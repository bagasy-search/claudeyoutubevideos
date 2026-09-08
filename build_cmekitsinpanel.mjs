// build_cmekitsinpanel.mjs — VLOG CRUDO: un plano real por frase, cortes secos, cero componentes.
// Emite src/cmekitsinpanel/cues_cmekitsinpanel.gen.tsx + Main_cmekitsinpanel.tsx + src/index_cmekitsinpanel.tsx
// + _cmekitsinpanel_assets.txt, y corre las compuertas que ya costaron renders.
//
//   node build_cmekitsinpanel.mjs
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "cmekitsinpanel";
const FPS = 30;
const WAV_S = 1642.840;
const AVATAR_S = 585.024;          // dura la locución REAL del creador
const AIRE_S = 0.35;               // el aire de la costura
const AVATAR_END_S = AVATAR_S + AIRE_S;
const MIN_PLANO_S = 1.2;           // más corto que esto se funde con el plano anterior
const IMGDIR = `public/img/${SLUG}`;
const CLIPDIR = `public/broll/${SLUG}`;
const QR = `img/${SLUG}/cmek_qr.png`;
const DOMINIO = "claudiomendoza.vercel.app";

const F = (s) => Math.round(s * FPS);
const TOTAL = Math.ceil(WAV_S * FPS);
const AVATAR_FRAMES = (() => {
  try {
    const o = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-count_packets",
      "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", `public/${SLUG}_opt.mp4`], { encoding: "utf8" });
    return parseInt(o.trim(), 10);
  } catch { return F(AVATAR_S); }
})();

const beats = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8"));
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8"));
const planBy = new Map(plan.map((p) => [p.i, p]));

// ---------- 1. fusionar los planos demasiado cortos con el anterior ----------
const mom = [];
for (const b of beats) {
  const prev = mom[mom.length - 1];
  if (prev && b.dur < MIN_PLANO_S) { prev.end = b.end; prev.dur = +(prev.end - prev.start).toFixed(3); continue; }
  mom.push({ ...b });
}

// ---------- 2. elegir el asset de CADA momento (por su PROPIO índice, nunca un contador corrido) ----------
// ⛔ Repartir con un contador que avanza desfasa TODO lo que sigue y cada plano termina mostrando
//    el objeto del momento VECINO (medido en cmetemu: 22 de 52 planos no pegaban).
const faltan = [];
for (const m of mom) {
  const clip = path.join(CLIPDIR, `${m.name}.mp4`);
  const jpg = path.join(IMGDIR, `${m.name}.jpg`);
  if (fs.existsSync(clip)) { m.tipo = "clip"; m.src = `broll/${SLUG}/${m.name}.mp4`; }
  else if (fs.existsSync(jpg)) { m.tipo = "foto"; m.src = `img/${SLUG}/${m.name}.jpg`; }
  else { m.tipo = null; faltan.push(m.name); }
}

// ---------- 2.bis. SOLTAR momentos en el tramo donde el lipsync es REAL ----------
// ⛔ Cubrir el 100% tapa al presentador todo el video. En este canal eso es un ERROR: mientras el
//    avatar dice EXACTAMENTE esa frase con su lipsync real, su cara es el mejor plano que tiene el
//    video ("lo más limpio y profesional", validado en cmesodimac). Un "hueco" ahí no es un hueco.
//    Después del bucle es al revés: la boca ya no acompaña, así que la cobertura tiene que ser total.
// Se sueltan de a uno alternado -> el plano y el avatar se turnan, y ningún plano queda pegado al
// siguiente (el piso de separación antes del bucle es ~3 s).
let rank = 0;
for (const m of mom) {
  if (m.start >= AVATAR_END_S) continue;      // post-bucle: se cubre todo
  const abre = m.start < 11;                  // ⭐ el video ABRE con él hablando, no con b-roll
  if (abre || rank % 2 === 1) m.tipo = null;
  rank++;
}

// ---------- 3. alinear al frame SIN dejar huecos de 1 cuadro ----------
// ⛔ `from={sec(start)}` y `durationInFrames={sec(dur)}` redondean por separado -> destellos del
//    fondo de 33 ms en cada frontera. `blackdetect` no los ve y el ojo sí.
const cues = [];
const usables = mom.filter((m) => m.tipo);
for (let k = 0; k < usables.length; k++) {
  const m = usables[k];
  const sig = usables[k + 1];
  const f0 = F(m.start);
  let f1 = F(m.end);
  if (sig && Math.abs(F(sig.start) - f1) <= 1) f1 = F(sig.start);
  f1 = Math.min(f1, TOTAL);
  if (f1 - f0 < 2) continue;
  cues.push({ key: `m${String(m.i).padStart(3, "0")}`, start: f0, dur: f1 - f0, capa: "base",
    tipo: m.tipo, src: m.src, i: m.i });
}

// ---------- 4. el CTA, en la capa `over`, atado a la frase que lo nombra ----------
const iCta = mom.find((m) => /el enlace abajo/i.test(m.texto));
if (!iCta) throw new Error("no encontré la frase del CTA en el guion");
const ctaStart = F(iCta.start);
const ctaDur = Math.max(F(9.5), F(iCta.end) - ctaStart);   // ~9,5 s mínimos para poder escanearlo
cues.push({ key: "cta", start: ctaStart, dur: Math.min(ctaDur, TOTAL - ctaStart), capa: "over", tipo: "cta" });

// ---------- 5. emitir los cues ----------
const el = (c) => c.tipo === "clip" ? `<Clip src="${c.src}" seed={${c.start}} />`
  : c.tipo === "foto" ? `<Foto src="${c.src}" seed={${c.start}} />`
  : `<Cta qr="${QR}" dominio="${DOMINIO}" />`;
const cuesTsx = `// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { Clip, Foto, Cta } from "./Piezas";

export type Cue = { key: string; start: number; dur: number; capa: "base" | "over"; el: (frame: number) => React.ReactNode };

export const CUES_CMEKITSINPANEL: Cue[] = [
${cues.map((c) => `  { key: "${c.key}", start: ${c.start}, dur: ${c.dur}, capa: "${c.capa}", el: (frame: number) => ${el(c)} },`).join("\n")}
];
`;
fs.mkdirSync(`src/${SLUG}`, { recursive: true });
fs.writeFileSync(`src/${SLUG}/cues_${SLUG}.gen.tsx`, cuesTsx);

// ---------- 6. el Main ----------
// El avatar es el FONDO GARANTIZADO y va MUTEADO (el audio sale del master). Después de AVATAR_END
// el lipsync ya no vale, así que vuelve a correr en bucle y arriba siempre hay contenido tapándolo.
const nLoops = Math.ceil((TOTAL - AVATAR_FRAMES) / AVATAR_FRAMES);
const loops = Array.from({ length: Math.max(0, nLoops) }, (_, k) => {
  const from = AVATAR_FRAMES * (k + 1);
  const dur = Math.min(AVATAR_FRAMES, TOTAL - from);
  return dur > 0 ? `      <Sequence from={${from}} durationInFrames={${dur}}>
        <OffthreadVideo src={staticFile("${SLUG}_opt.mp4")} muted style={est} />
      </Sequence>` : "";
}).filter(Boolean).join("\n");

const mainTsx = `// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_CMEKITSINPANEL } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_CMEKITSINPANEL = ${TOTAL};
const AVATAR_FRAMES = ${AVATAR_FRAMES};

/** ⛔ \`OffthreadVideo\`, NUNCA \`<Video>\`: es la causa #1 del "se ve todo lageado".
 *  ⛔ Y NUNCA ESTÁTICO: un avatar full quieto se lee como una videollamada. Push lento y cíclico. */
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.022;
  const dx = Math.sin(f / 1300) * 0.5;
  const est: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    transform: \`scale(\${s.toFixed(4)}) translateX(\${dx.toFixed(3)}%)\`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile("${SLUG}_opt.mp4")} muted style={est} />
      </Sequence>
${loops}
    </AbsoluteFill>
  );
};

export const MainCmekitsinpanel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_CMEKITSINPANEL.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_CMEKITSINPANEL.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("${SLUG}.m4a")} />
    </AbsoluteFill>
  );
};
`;
fs.writeFileSync(`src/${SLUG}/Main_${SLUG}.tsx`, mainTsx);

// ---------- 7. el entry propio ----------
// ⛔ SIN entry propio el farm usa src/index.tsx COMPARTIDO, que otra sesión dejó apuntando a otro
//    video -> los 60 chunks mueren con "Could not find composition".
fs.writeFileSync(`src/index_${SLUG}.tsx`, `import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmekitsinpanel, TOTAL_FRAMES_CMEKITSINPANEL } from "./${SLUG}/Main_${SLUG}";

const Root: React.FC = () => (
  <Composition id="Cmekitsinpanel" component={MainCmekitsinpanel}
    durationInFrames={TOTAL_FRAMES_CMEKITSINPANEL} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root);
`);

// ---------- 8. lista de assets (con los _blur hermanos) ----------
const assets = new Set();
for (const c of cues) {
  if (!c.src) continue;
  assets.add(c.src);
  if (/\.jpe?g$/i.test(c.src)) assets.add(c.src.replace(/\.jpe?g$/i, "_blur.jpg"));
}
assets.add(QR);
const enDisco = [...assets].filter((a) => fs.existsSync(path.join("public", a)));
const sinDisco = [...assets].filter((a) => !fs.existsSync(path.join("public", a)));
fs.writeFileSync(`_${SLUG}_assets.txt`, enDisco.join("\n") + "\n");

// ---------- 9. COMPUERTAS ----------
const prob = [];
if (faltan.length) prob.push(`${faltan.length} momentos sin asset en disco: ${faltan.slice(0, 6).join(", ")}`);
if (sinDisco.length) prob.push(`${sinDisco.length} assets citados que NO existen: ${sinDisco.slice(0, 6).join(", ")}`);

// ⛔ ningun <Video> en src/<slug>/ (filtrando COMENTARIOS: el propio aviso dispara falso positivo)
for (const f of fs.readdirSync(`src/${SLUG}`).filter((x) => x.endsWith(".tsx"))) {
  const crudo = fs.readFileSync(path.join("src", SLUG, f), "utf8");
  const src = crudo.split("\n").filter((L) => { const s = L.trim(); return !s.startsWith("//") && !s.startsWith("*") && !s.startsWith("/*"); }).join("\n");
  if (src.includes("<Video ") || src.includes("<Video>")) prob.push(`${f} usa <Video> (va OffthreadVideo)`);
}

// cobertura y huecos, simulando el timeline cada 0,2 s
const base = cues.filter((c) => c.capa === "base").sort((a, b) => a.start - b.start);
let cubierto = 0, total = 0;
const huecos = [];
let hg = null;
for (let f = 0; f < TOTAL; f += 6) {
  total++;
  const hay = base.some((c) => f >= c.start && f < c.start + c.dur);
  if (hay) { cubierto++; if (hg) { huecos.push(hg); hg = null; } }
  else if (!hg) hg = { f0: f, f1: f }; else hg.f1 = f;
  if (hg) hg.f1 = f;
}
if (hg) huecos.push(hg);
const cob = (cubierto / total) * 100;
const huecosPost = huecos.filter((h) => h.f1 / FPS > AVATAR_END_S && (h.f1 - h.f0) / FPS >= 1.5);
const solapes = base.filter((c, k) => k && c.start < base[k - 1].start + base[k - 1].dur).length;
// ⛔ distinguir el DESTELLO (hueco de 1-5 cuadros = fondo a la vista por 33-160 ms, el defecto)
//    de la VENTANA DE AVATAR (hueco largo y deliberado, donde se lo ve hablando con su lipsync).
const destellos = base.filter((c, k) => {
  if (!k) return false;
  const g = c.start - (base[k - 1].start + base[k - 1].dur);
  return g > 0 && g <= 5;
}).length;
const ventanas = base.filter((c, k) => k && c.start - (base[k - 1].start + base[k - 1].dur) > 5).length;

const durs = base.map((c) => c.dur / FPS).sort((a, b) => a - b);
const q = (f) => durs[Math.floor(durs.length * f)];

console.log(`=== BUILD ${SLUG} ===`);
console.log(`momentos del guion ....... ${beats.length}  (fusionados los <${MIN_PLANO_S}s -> ${mom.length})`);
console.log(`cues base ................ ${base.length}  (clip ${base.filter((c) => c.tipo === "clip").length} · foto ${base.filter((c) => c.tipo === "foto").length})`);
console.log(`assets en el tar ......... ${enDisco.length}`);
console.log(`TOTAL_FRAMES ............. ${TOTAL}  (${(TOTAL / FPS).toFixed(2)} s · wav ${WAV_S} s)`);
console.log(`avatar ................... ${AVATAR_FRAMES} cuadros + ${nLoops} bucle(s)`);
console.log(`cobertura de b-roll ...... ${cob.toFixed(1)}%`);
console.log(`huecos >=1,5 s post-bucle  ${huecosPost.length}`);
console.log(`destellos (hueco 1-5 cuadros) ${destellos}   ⛔ tiene que dar 0`);
console.log(`ventanas de avatar ....... ${ventanas}`);
console.log(`solapes .................. ${solapes}`);
console.log(`plano p25/med/p75/max .... ${q(.25).toFixed(1)} / ${q(.5).toFixed(1)} / ${q(.75).toFixed(1)} / ${durs[durs.length - 1].toFixed(1)} s`);
console.log(`planos >=5 s ............. ${durs.filter((d) => d >= 5).length} (${(durs.filter((d) => d >= 5).length / durs.length * 100).toFixed(0)}%)`);
console.log(`CTA ...................... ${(ctaStart / FPS).toFixed(1)} s por ${(cues.find((c) => c.key === "cta").dur / FPS).toFixed(1)} s`);
if (destellos) prob.push(`${destellos} destellos del fondo entre planos (hueco de 1-5 cuadros)`);
console.log(`problemas ................ ${prob.length}`);
for (const p of prob) console.log("  ⛔ " + p);
if (prob.length) process.exit(1);
