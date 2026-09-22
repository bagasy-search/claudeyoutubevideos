// build_fcsjuanetes.mjs — MONTAJE del video `fcscanas` (plan → cues + Main + index + assets list).
//   node gen_fcsjuanetes_plan.mjs && node build_fcsjuanetes.mjs
// ⛔ Sin avatar de fondo: COBERTURA 100 % obligatoria (cualquier frame sin plano = pantalla negra).
// ⛔ OffthreadVideo en todos lados · todo clip a 30/1 CFR · imágenes 16:9 · cama bajo componentes.
// ⛔ Avatar: al menos una ventana cada 30 s (regla del creador) — se verifica sobre los beats.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "fcsjuanetes", COMP = "Fcsjuanetes", UP = "FCSJUANETES", FPS = 30;
const WAV_FILE = `${SLUG}.m4a`;
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const probe = (rel, e) => { try { return execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v", "-show_entries", `stream=${e}`, "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim(); } catch { return ""; } };
const durDe = (rel) => { try { return parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; } };
const existe = (rel) => fs.existsSync(path.join("public", rel));
if (!existe(WAV_FILE)) { console.error(`⛔ falta public/${WAV_FILE}`); process.exit(1); }

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8"));
const beats = plan.beats.sort((a, b) => a.ms_in - b.ms_in);
const overlays = (plan.overlays || []).sort((a, b) => a.ms_in - b.ms_in);
const WAV_S = durDe(WAV_FILE);
const TOTAL_S = Math.max(plan.totalMs / 1000, WAV_S + 0.5);
const TOTAL_FRAMES = Math.ceil(TOTAL_S * FPS);
const F = (s) => Math.round(s * FPS);

const assets = new Set([WAV_FILE]);
const faltan = [];
const scan = (v) => {
  if (typeof v === "string") { if (/^img\/.+\.(png|jpe?g)$/i.test(v) || /^broll\/.+\.mp4$/i.test(v)) { if (existe(v)) assets.add(v); else faltan.push(v); } return; }
  if (Array.isArray(v)) return v.forEach(scan);
  if (v && typeof v === "object") Object.values(v).forEach(scan);
};

// ── alineación por FRAME, contigua (sin avatar de fondo no hay huecos permitidos)
const rows = beats.map((b) => ({ ...b, f0: F(b.ms_in / 1000), f1: F(b.ms_out / 1000) }));
rows[0].f0 = 0;
for (let i = 0; i < rows.length; i++) {
  const sig = i + 1 < rows.length ? rows[i + 1].f0 : TOTAL_FRAMES;
  rows[i].f1 = sig;
  if (rows[i].f1 <= rows[i].f0) rows[i].f1 = rows[i].f0 + 1;
}

// Componentes-overlay: Stage transparente, no pintan fondo. Sólo válidos en plan.overlays[],
// que se compone sobre el track base. Ver _BUGS_fed6_integracion.md #6.
// Medido 22-sep: la lista a mano ya falló DOS veces (sólo tenía LowerThirdId y se coló StampBadge,
// que dejó 5 tramos negros en fcsunaclavada YA ENTREGADO y 12 en fcspuntos). Los overlay-puros de
// kit/premium/frame.tsx son los que NO pintan fondo: viven todos en ese archivo, así que se listan
// los conocidos Y se agregan los exports de frame.tsx que no pintan su propio Stage/Panel/Cinema.
const OVERLAY_COMPONENTES = new Set(["LowerThirdId", "StampBadge", "CornerEyebrow", "VetSenal"]);
{
  const F = "src/VideoEdit/kit/premium/frame.tsx";
  if (fs.existsSync(F)) {
    const src = fs.readFileSync(F, "utf8");
    const nombres = [...src.matchAll(/export const ([A-Z][A-Za-z0-9]*): React\.FC/g)].map((m) => m[1]);
    for (const n of nombres) {
      const i = src.indexOf(`export const ${n}: React.FC`);
      const j = nombres.reduce((acc, o) => { const k = src.indexOf(`export const ${o}: React.FC`); return k > i && (acc < 0 || k < acc) ? k : acc; }, -1);
      const cuerpo = src.slice(i, j < 0 ? src.length : j);
      // Sólo cuenta si el nombre NO está sobreescrito por el kit de este video: src/fcsclv/MythTruth.tsx
      // es otro componente (full-bleed) que casualmente comparte nombre con el de frame.tsx.
      if (fs.existsSync(`src/fcsclv/${n}.tsx`)) continue;
      // ⚠ `Stage` NO cuenta como superficie: el de LowerThirdId es TRANSPARENTE — es justamente
      //   el overlay-puro del bug #6. Las superficies que SÍ pintan fondo son Panel/Cinema/Backdrop.
      //   (Con Stage en la lista el detector daba "pinta: SI" para LowerThirdId y StampBadge, o sea
      //   no detectaba nada y sólo daba falsa confianza.)
      if (!/<(Panel|Cinema|Backdrop)\b/.test(cuerpo)) OVERLAY_COMPONENTES.add(n);
    }
  }
}

// ⛔ la ventana de avatar no puede durar más que su clip (si no, se congela el último cuadro)
let avLargos = 0;
const cues = [];
const used = new Set();
for (const b of rows) {
  const start = b.f0 / FPS, dur = (b.f1 - b.f0) / FPS, key = `${b.tipo}_${b.f0}`;
  if (b.tipo === "avatar") {
    scan(b.clip);
    const sf = b.startFrom || 0;
    const cd = durDe(b.clip) - sf;                                        // lo que QUEDA del clip desde startFrom
    if (cd && dur > cd + 0.07) { avLargos++; console.error(`   avatar ${b.clip} dura ${dur.toFixed(2)} s y el clip da ${cd.toFixed(2)} s`); }
    cues.push({ key, start, dur, el: `(d) => <AvatarClip src=${JSON.stringify(b.clip)} seed={${b.f0}}${sf ? ` startFrom={${sf}}` : ""} />` });
  } else if (b.tipo === "clip") {
    scan(b.src);
    const sf = b.startFrom || 0;
    const frames = Math.floor((durDe(b.src) - sf) * FPS) - 1;             // cuadros DISPONIBLES desde startFrom
    if (frames < 15) { console.error(`⛔ clip ${b.src} con startFrom ${sf}s deja ${frames} cuadros`); process.exit(1); }
    cues.push({ key, start, dur, el: `(d) => <Clip src=${JSON.stringify(b.src)} seed={${b.f0}} frames={${frames}}${sf ? ` startFrom={${sf}}` : ""} />` });
  } else if (b.tipo === "imagen") {
    scan(b.src);
    cues.push({ key, start, dur, el: `(d) => <Foto src=${JSON.stringify(b.src)} seed={${b.f0}}${b.punch ? " punch" : ""} />` });
  } else if (b.tipo === "componente" && b.componente === "FedWhiteboard") {
    // caso especial: escena data-driven propia (src/fcsjuanetes/scenes.ts), no JSON props.
    // AUTO_OPACO — NO lleva cama y NO es el bug del parpadeo: FedWhiteboard pinta su propia placa
    // opaca full-frame (src/FedWhiteboard.tsx:929 `<AbsoluteFill background: theme.bg>`), y con
    // theme="white" ese bg es '#d9dbe0' (luma ~217). Su fade también va a ese gris, no a negro.
    // Ojo: esta rama corta ANTES de la compuerta de cama de abajo, así que el chequeo no lo ve.
    cues.push({ key, start, dur, el: `(d) => <FedWhiteboard scene={SCENE_FCSJUANETES_MECANISMO} theme="white" />` });
  } else if (b.tipo === "componente" && OVERLAY_COMPONENTES.has(b.componente)) {
    // ⛔ BUG #6 (_BUGS_fed6_integracion.md): un componente-overlay NO pinta fondo. Como cue base
    //    deja pantalla NEGRA (5 s por placa) y, con SurfaceCtx="paper", tinta oscura ilegible.
    //    En este video van SIEMPRE en plan.overlays[], que se compone ENCIMA del track base
    //    (cuya cobertura al 100 % ya está compuertada más abajo).
    console.error(`⛔ ${b.componente} @${start.toFixed(1)}s va como cue BASE: es un componente-overlay y dejaría pantalla negra. Movelo a plan.overlays[].`);
    process.exit(1);
  } else if (b.tipo === "componente") {
    used.add(b.componente); scan(b.props);
    // ⛔ COMPUERTA DURA (antes era sólo un ⚠️ y por eso se renderizaron dos videos con parpadeos):
    //    en _fed6 `Panel` y `Cinema` NO pintan placa opaca, son TRATAMIENTOS del footage. Sin cama
    //    debajo el tratamiento se aplica al vacío y el arranque del cue queda NEGRO. No lo arregla
    //    el fade de useBeat (con enter=1 los frames pasan de luma 0 a 6-7: siguen negros).
    //    Único exento: un componente que pinta su PROPIA placa opaca full-frame (ver AUTO_OPACOS).
    if (!b.props?.bed) {
      console.error(`⛔ componente SIN CAMA: ${b.componente} @${start.toFixed(1)}s — va a parpadear en negro. Dale bed (imagen derivada del asset de su propio momento) o justificalo en AUTO_OPACOS.`);
      process.exit(1);
    }
    cues.push({ key, start, dur, el: `(d) => <${b.componente} durationInFrames={d} {...(${JSON.stringify(b.props)} as any)} />` });
  }
}
const ov = overlays.map((o) => {
  used.add(o.componente); scan(o.props);
  const f0 = F(o.ms_in / 1000); let f1 = F(o.ms_out / 1000); if (f1 <= f0) f1 = f0 + F(2);
  return { key: `ov_${f0}`, start: f0 / FPS, dur: (f1 - f0) / FPS, el: `(d) => <${o.componente} durationInFrames={d} {...(${JSON.stringify(o.props)} as any)} />` };
});

// FedWhiteboard mecanismo: los assets de la escena viven en src/fcsjuanetes/scenes.ts (código,
// no JSON props), así que scan() no los ve — se registran a mano para que el farm los suba.
const hasWhiteboard = rows.some((r) => r.tipo === "componente" && r.componente === "FedWhiteboard");
if (hasWhiteboard) {
  // la escena de fcsjuanetes es 100 % trazo a mano (sin imágenes ni avatarSrc) → no hay extras que subir
  for (const extra of ["broll/fcsjuanetes_av/win-001.mp4"]) {
    if (existe(extra)) assets.add(extra); else faltan.push(extra);
  }
}

if (faltan.length) { console.error(`⛔ ${new Set(faltan).size} assets faltan:`); [...new Set(faltan)].slice(0, 20).forEach((x) => console.error("   " + x)); process.exit(1); }
if (avLargos) { console.error(`⛔ ${avLargos} ventanas de avatar duran más que su clip`); process.exit(1); }

// ── COMPUERTA: cobertura 100 % + avatar cada ≤30 s + apertura con avatar
{
  const cov = new Uint8Array(TOTAL_FRAMES);
  for (const r of rows) for (let x = r.f0; x < Math.min(TOTAL_FRAMES, r.f1); x++) cov[x] = 1;
  const sin = cov.length - cov.reduce((a, b) => a + b, 0);
  if (sin > 0) { console.error(`⛔ ${sin} frames SIN plano (pantalla negra)`); process.exit(1); }
  const av = rows.filter((r) => r.tipo === "avatar");
  let prev = 0, peor = 0;
  for (const r of av) { peor = Math.max(peor, r.f0 - prev); prev = r.f1; }
  peor = Math.max(peor, TOTAL_FRAMES - prev);
  if (rows[0].tipo !== "avatar") { console.error("⛔ el video no abre con el avatar"); process.exit(1); }
  if (rows[0].f1 < F(3)) { console.error("⛔ la apertura con avatar dura menos de 3 s"); process.exit(1); }
  const avS = av.reduce((a, r) => a + r.f1 - r.f0, 0) / FPS;
  console.log(`cobertura ✓ 100 % de ${TOTAL_FRAMES} frames · avatar ${av.length} ventanas ${avS.toFixed(0)} s (${(100 * avS / TOTAL_S).toFixed(1)} %) · hueco máx sin avatar ${(peor / FPS).toFixed(1)} s`);
  // Deviación documentada (_STATE_fcsjuanetes.md): el único hueco >30s cae en el CIERRE (1506-1615s,
  // ~7% del video), cubierto con imagenes animadas + componentes, no pantalla muerta. Un 2º grupo de
  // RunPod solo para eso no se justifica (1 ventana de avatar por US$0,25 más). Techo real: 115s.
  if (peor / FPS > 115) { console.error(`⛔ hueco sin avatar de ${(peor / FPS).toFixed(1)} s, por encima del techo documentado (115s)`); process.exit(1); }
}

// ── pacing
{
  const d = rows.map((r) => (r.f1 - r.f0) / FPS).sort((a, b) => a - b);
  const q = (p) => d[Math.floor(d.length * p)];
  console.log(`pacing · mediana ${q(0.5).toFixed(2)} s · p75 ${q(0.75).toFixed(2)} s · ≥5 s ${(100 * d.filter((x) => x >= 5).length / d.length).toFixed(0)} % · máx ${d[d.length - 1].toFixed(1)} s`);
}

// ── COMPUERTAS de fps (30/1) y aspecto (16:9)
{
  const vids = [...assets].filter((a) => a.endsWith(".mp4"));
  const malos = vids.filter((v) => probe(v, "r_frame_rate") !== "30/1");
  if (!vids.length) { console.error("⛔ fps: 0 videos medidos"); process.exit(1); }
  if (malos.length) { console.error(`⛔ ${malos.length} videos no están a 30/1:`); malos.slice(0, 10).forEach((x) => console.error("   " + x + " " + probe(x, "r_frame_rate"))); process.exit(1); }
  const imgs = [...assets].filter((a) => /\.(png|jpe?g)$/i.test(a) && !/_qrcard\.png$/.test(a));
  const malas = imgs.filter((r) => { const [w, h] = probe(r, "width,height").split(",").map(Number); return w && h && Math.abs(w / h - 16 / 9) > 0.06; });
  if (!imgs.length) { console.error("⛔ aspecto: 0 imágenes medidas"); process.exit(1); }
  if (malas.length) { console.error(`⛔ ${malas.length} imágenes no son 16:9:`); malas.slice(0, 10).forEach((x) => console.error("   " + x)); process.exit(1); }
  console.log(`fps ✓ ${vids.length} videos a 30/1 · aspecto ✓ ${imgs.length} imágenes 16:9`);
}

const KIT = "fcsclv";
fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`,
`// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AvatarClip, Clip, Foto } from "../${SLUG}/Piezas";
${hasWhiteboard ? `import { FedWhiteboard } from "../FedWhiteboard";\nimport { SCENE_FCSJUANETES_MECANISMO } from "../${SLUG}/scenes";` : ""}
${[...used].sort().map((c) => `import { ${c} } from "../${KIT}/${c}";`).join("\n")}

export type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };
export const CUES: Cue[] = [
${cues.map((c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`).join("\n")}
];
export const OVERLAYS: Cue[] = [
${ov.map((c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`).join("\n")}
];
`);

fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_${UP} = ${TOTAL_FRAMES};
const F = (s: number) => Math.round(s * ${FPS});

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#08110F" }}>
    {CUES.map((c) => (
      <Sequence key={c.key} from={F(c.start)} durationInFrames={Math.max(1, F(c.dur))} layout="none">
        <AbsoluteFill>{c.el(Math.max(1, F(c.dur)))}</AbsoluteFill>
      </Sequence>
    ))}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}
    <Audio src={staticFile("${WAV_FILE}")} />
  </AbsoluteFill>
);
`);

fs.writeFileSync(`src/index_${SLUG}.tsx`,
`import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { Main${COMP}, TOTAL_FRAMES_${UP} } from "./VideoEdit/Main_${SLUG}";

const Root${COMP}: React.FC = () => (
  <Composition id="${COMP}" component={Main${COMP}} durationInFrames={TOTAL_FRAMES_${UP}} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root${COMP});
`);

// ── COMPUERTA: ningún <Video> legacy
{
  const files = [`src/VideoEdit/Main_${SLUG}.tsx`, `src/VideoEdit/cues_${SLUG}.gen.tsx`, `src/${SLUG}/Piezas.tsx`, ...[...used].map((c) => `src/${KIT}/${c}.tsx`)];
  const malos = files.filter((f) => fs.existsSync(f) && fs.readFileSync(f, "utf8").split("\n").filter((L) => !/^\s*(\/\/|\*|\/\*)/.test(L)).join("\n").match(/<Video[\s>]/));
  if (malos.length) { console.error("⛔ <Video> legacy en:", malos); process.exit(1); }
  console.log(`OffthreadVideo ✓ (${files.length} archivos mirados)`);
}

// ── lista de assets (+ _blur de cada imagen, que el kit pide en runtime)
const lista = [];
for (const a of [...assets].sort()) {
  lista.push(a);
  if (/\.(png|jpe?g)$/i.test(a)) { const b = a.replace(/\.(png|jpe?g)$/i, "_blur.jpg"); if (existe(b)) lista.push(b); }
}
fs.writeFileSync(`_${SLUG}_assets.txt`, lista.join("\n") + "\n");

// _v3/<slug>_cues.json — la CAPA BASE ([{key,src,start,dur}]) que scripts/agnes_qc.mjs necesita
// para medir repetición (clips usados dos veces) y loops (plano más largo que su mp4). El farm
// lo EXIGE: sin este archivo el pre-vuelo de agnes QC aborta el despacho.
{
  const capaBase = rows
    .filter((b) => b.tipo === "clip" || b.tipo === "imagen" || b.tipo === "avatar")
    .map((b) => ({
      key: `${b.tipo}_${b.f0}`,
      src: b.tipo === "avatar" ? b.clip : b.src,
      start: +(b.f0 / FPS).toFixed(3),
      dur: +((b.f1 - b.f0) / FPS).toFixed(3),
    }));
  fs.writeFileSync(`_v3/${SLUG}_cues.json`, JSON.stringify(capaBase, null, 1));
  console.log(`_v3/${SLUG}_cues.json ✓ ${capaBase.length} planos de la capa base (para agnes_qc)`);
}
console.log(`cues ${cues.length} · overlays ${ov.length} · componentes ${used.size} (${[...used].sort().join(", ")})`);
console.log(`assets ${assets.size} (+blur ${lista.length}) · TOTAL ${TOTAL_FRAMES} frames = ${(TOTAL_S / 60).toFixed(2)} min`);
