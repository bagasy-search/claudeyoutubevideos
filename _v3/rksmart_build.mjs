// rksmart_build.mjs — genera el Main, los cues y el archivo de frames desde `_v3/rksmart_plan.json`.
//   node _v3/rksmart_build.mjs
//
// ⛔ Acá NO se inventa nada: cada cue sale del plan. Lo que se renderiza FUERA del beatsheet no lo
//    ve ninguna compuerta (ahí se colaron el hook de otro video y el endcard en español).
// ⛔ `RayCta` va en OVERLAYS (es una tarjeta de esquina) y lleva su PROPIA cama en la capa base:
//    un overlay no cubre nada, y en este flujo debajo no hay avatar de fondo — se vería NEGRO.
// ⛔ El `seed` de cada foto es su CUADRO DE ARRANQUE y `durF` su duración: el Ken-Burns necesita
//    las dos cosas para sortear sentido/velocidad y para atar el paneo a la escala.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const plan = JSON.parse(fs.readFileSync("_v3/rksmart_plan.json", "utf8"));
const FPS = plan.fps;
const TOTAL_F = Math.round(plan.total * FPS);
const OVERLAY = new Set(["RayCta"]);

const IMPORTS = {
  BigStat: "../rksafe/BigStat", CheckCard: "../rksafe/CheckCard", CrossSection: "../rksafe/CrossSection",
  MythTruth: "../rksafe/MythTruth", ProcessChips: "../rksafe/ProcessChips", PullQuote: "../rksafe/PullQuote",
  RayChecklist: "../rksafe/RayChecklist", RayCta: "../rksafe/RayCta", RaySecurityCam: "../rksafe/RaySecurityCam",
  RouteFlow: "../rksafe/RouteFlow", ScrewHero: "../rksafe/ScrewHero", SplitVs: "../rksafe/SplitVs",
  WorstSpots: "../rksafe/WorstSpots",
};

// ⛔⛔ LAS FRONTERAS SE ALINEAN AL CUADRO, ACA, ANTES DE EMITIR NADA.
// El Main escribia `from={F(start)}` y `durationInFrames={F(dur)}`: DOS redondeos independientes,
// asi que F(53,94)+F(0,98) no cae en F(54,92). Segun el resto de cada frontera, el cue siguiente
// arranca un cuadro ANTES (un plano TAPA al otro: material generado que nadie ve) o un cuadro
// DESPUES (destello de 33 ms del fondo). Medido en este mismo video antes del arreglo:
// 37 solapes (1,23 s) y 31 destellos (1,03 s). ⛔ `blackdetect` NO los ve: pide 0,4 s.
// La duracion sale del CUADRO FINAL, no del largo, y la frontera compartida es UN solo numero.
// ⚠️ Un CLIP no se puede estirar mas de 2 cuadros sobre su archivo (pasado el ultimo, congela y
//    `agnes_qc_gate` lo cuenta como repeticion): si el ajuste se pasa, se mueve el ARRANQUE del
//    siguiente en vez del final de este.
{
  const durClip = {};
  const base = plan.beats.filter((b) => !(b.kind === "componente" && OVERLAY.has(b.comp)))
    .sort((a, b) => a.t - b.t || a.dur - b.dur);
  for (const b of base) {
    b.f0 = Math.round(b.t * FPS);
    b.f1 = b.f0 + Math.max(1, Math.round(b.dur * FPS));
  }
  let ajustadas = 0;
  for (let i = 0; i < base.length - 1; i++) {
    const a = base[i], n = base[i + 1];
    if (n.f0 === a.f1) continue;
    if (a.kind === "clip") {
      if (!(a.asset in durClip)) durClip[a.asset] = +execFileSync("ffprobe",
        ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "public/" + a.asset],
        { encoding: "utf8" }).match(/[\d.]+/)[0];
      const techo = a.f0 + Math.floor(durClip[a.asset] * FPS) + 2;
      if (n.f0 > techo) { n.f0 = a.f1; ajustadas++; continue; }   // el clip no se estira: arranca antes el siguiente
    }
    a.f1 = n.f0;
    if (a.f1 <= a.f0) a.f1 = a.f0 + 1;
    ajustadas++;
  }
  for (const b of base) { b.t = +(b.f0 / FPS).toFixed(6); b.dur = +((b.f1 - b.f0) / FPS).toFixed(6); delete b.f0; delete b.f1; }
  // los overlays se alinean solos (van encima, no comparten frontera con nadie)
  for (const b of plan.beats.filter((x) => x.kind === "componente" && OVERLAY.has(x.comp))) {
    const f0 = Math.round(b.t * FPS), f1 = f0 + Math.max(1, Math.round(b.dur * FPS));
    b.t = +(f0 / FPS).toFixed(6); b.dur = +((f1 - f0) / FPS).toFixed(6);
  }
  plan.beats.sort((a, b) => a.t - b.t);
  console.log(`FRONTERAS alineadas al cuadro: ${ajustadas} de ${base.length - 1} · ` +
    `${base.length} cues de base medidos`);
  // ✅ se PERSISTE el plan alineado: la compuerta de timeline tiene que medir EL MISMO artefacto
  //    que se renderiza (en rkspare el gate leia el plan crudo mientras el build alineaba en memoria)
  fs.writeFileSync("_v3/rksmart_plan.json", JSON.stringify(plan, null, 1));
}

const usados = new Set();
const cues = [], overlays = [];
const assets = new Set();

for (const b of plan.beats) {
  const key = `${b.kind}_${Math.round(b.t * 1000)}${b.cama ? "_cama" : ""}`;
  const seed = Math.round(b.t * FPS);
  let el;
  if (b.kind === "avatar") {
    el = `(d) => <RayAvatarWin src=${JSON.stringify(b.asset)} seed={${seed}} durF={d} />`;
    assets.add(b.asset);
  } else if (b.kind === "clip") {
    el = `(d) => <Clip src=${JSON.stringify(b.asset)} rate={1} />`;
    assets.add(b.asset);
    assets.add(b.asset.replace("broll/rksmart/", "img/").replace(/\.mp4$/, ".jpg"));   // su foto base viaja igual
  } else if (b.kind === "imagen") {
    el = `(d) => <Foto src=${JSON.stringify(b.asset)} seed={${seed}} durF={d} />`;
    assets.add(b.asset);
  } else {
    usados.add(b.comp);
    const props = { ...b.props };
    if (b.bed && !OVERLAY.has(b.comp)) { props.bed = b.bed; assets.add(b.bed); }
    if (props.qr) assets.add(props.qr);
    el = `(d) => <${b.comp} durationInFrames={d} {...(${JSON.stringify(props)} as any)} />`;
  }
  const esOverlay = b.kind === "componente" && OVERLAY.has(b.comp);
  const row = `  { key: ${JSON.stringify(key)}, start: ${b.t}, dur: ${b.dur}, el: ${el} },`;
  (esOverlay ? overlays : cues).push(row);
}

const comps = [...usados].sort();
for (const c of comps) if (!IMPORTS[c]) { console.error("⛔ no sé de dónde importar " + c); process.exit(1); }

fs.writeFileSync("src/VideoEdit/cues_rksmart.gen.tsx",
  `// cues_rksmart.gen.tsx — GENERADO por _v3/rksmart_build.mjs. NO editar a mano.
import React from "react";
${comps.map((c) => `import { ${c} } from "${IMPORTS[c]}";`).join("\n")}
import { Clip, Foto } from "../rksafe/RayStage";
import { RayAvatarWin } from "../rksafe/RayAvatarWin";

export type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };

export const CUES: Cue[] = [
${cues.join("\n")}
];

export const OVERLAYS: Cue[] = [
${overlays.join("\n")}
];
`);

fs.writeFileSync("src/VideoEdit/avatar_rksmart.gen.ts",
  `// avatar_rksmart.gen.ts — GENERADO por _v3/rksmart_build.mjs. NO editar a mano.
// El avatar de este video NO es una capa de fondo: son ${plan.beats.filter((b) => b.kind === "avatar").length}
// ventanas generadas en RunPod que se montan como planos más de la capa base.
export const TOTAL_FRAMES_RKSMART = ${TOTAL_F};
`);

fs.writeFileSync("src/VideoEdit/Main_rksmart.tsx",
  `// Main_rksmart.tsx — GENERADO por _v3/rksmart_build.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_rksmart.gen";
import { TOTAL_FRAMES_RKSMART } from "./avatar_rksmart.gen";

const F = (s: number) => Math.round(s * ${FPS});

export const MainRksmart: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* overlays: van ENCIMA, no ocultan la base (y por eso el plan les pone una cama debajo) */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* UN solo <Audio> con el máster: cubre TODO el video. */}
    <Audio src={staticFile("rksmart.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_RKSMART };
`);

fs.writeFileSync("src/index_rksmart.tsx",
  `import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRksmart, TOTAL_FRAMES_RKSMART } from "./VideoEdit/Main_rksmart";

const RootRksmart: React.FC = () => (
  <Composition id="Rksmart" component={MainRksmart} durationInFrames={TOTAL_FRAMES_RKSMART} fps={30} width={1920} height={1080} />
);
registerRoot(RootRksmart);
`);

// ── lista de assets para el tar: TODA foto lleva su hermano _blur.jpg ───────
for (const a of [...assets]) if (a.startsWith("img/") && a.endsWith(".jpg") && !a.endsWith("_blur.jpg")) assets.add(a.replace(/\.jpg$/, "_blur.jpg"));
// El farm (agnes_qc_gate) EXIGE este archivo: sin el, la repeticion "no se midio" y bloquea.
// Es la capa BASE tal como se monta: [{key, src, start, dur}] — asi el gate compara la duracion
// REAL de cada plano contra la duracion REAL de su clip.
fs.writeFileSync("_v3/rksmart_cues.json", JSON.stringify(plan.beats
  .filter((b) => b.asset && !(b.kind === "componente"))
  .map((b) => ({ key: `${b.kind}_${Math.round(b.t * 1000)}`, src: b.asset, start: b.t, dur: b.dur })), null, 1));

const lista = [...assets].sort();
fs.writeFileSync("_rksmart_assets.txt", lista.join("\n") + "\n");

console.log("═".repeat(72));
console.log(`CUES ${cues.length} · OVERLAYS ${overlays.length} · COMPONENTES ${comps.length}: ${comps.join(" · ")}`);
console.log(`TOTAL_FRAMES ${TOTAL_F} (${plan.total.toFixed(2)} s = ${Math.floor(plan.total / 60)}:${String(Math.round(plan.total % 60)).padStart(2, "0")})`);

// ── COMPUERTA: 0 instantes sin cue de BASE (sin avatar de fondo, un hueco es NEGRO) ──
{
  const base = plan.beats.filter((b) => !(b.kind === "componente" && OVERLAY.has(b.comp)));
  let medidos = 0, huecos = 0, peor = 0, peorT = 0, run = 0;
  for (let t = 0; t < plan.total - 0.05; t += 0.05) {
    medidos++;
    if (base.some((b) => b.t <= t && b.t + b.dur > t)) run = 0;
    else { huecos++; run += 0.05; if (run > peor) { peor = run; peorT = t; } }
  }
  console.log(`PANTALLA NEGRA: instantes medidos ${medidos} · descubiertos ${huecos} = ${(huecos * 0.05).toFixed(2)} s` +
    (huecos ? `  ⛔ el peor de ${peor.toFixed(2)} s en ${Math.floor(peorT / 60)}:${String(Math.round(peorT % 60)).padStart(2, "0")}` : "  ✓"));
  if (medidos < 10000) { console.error("⛔ medí " + medidos + " instantes: el medidor está roto"); process.exit(3); }
  if (huecos) process.exit(3);
}

// ── COMPUERTA: todo asset referenciado EXISTE, y todo clip es 30/1 CFR ──────
let faltan = 0, fps_malos = [], medidos = 0;
for (const a of lista) { medidos++; if (!fs.existsSync("public/" + a)) { console.log("  ⛔ falta public/" + a); faltan++; } }
for (const a of lista.filter((x) => x.endsWith(".mp4"))) {
  if (!fs.existsSync("public/" + a)) continue;
  const r = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", "public/" + a], { encoding: "utf8" }).trim().replace(/,$/, "");
  if (r !== "30/1") fps_malos.push(`${a}=${r}`);
}
console.log(`ASSETS: ${medidos} referenciados · faltan ${faltan} ${faltan ? "⛔" : "✓"}`);
console.log(`FPS de los mp4: ${lista.filter((x) => x.endsWith(".mp4")).length} medidos · fuera de 30/1: ${fps_malos.length} ${fps_malos.length ? "⛔ " + fps_malos.slice(0, 5).join(" ") : "✓"}`);
for (const extra of ["public/rksmart.m4a", "public/rksmart.wav"]) {
  console.log("  " + (fs.existsSync(extra) ? "✓" : "⛔") + " " + extra);
  if (!fs.existsSync(extra)) faltan++;
}
// ⛔ ningún <Video> en lo que escribimos (en el render busca por tiempo y no acierta el cuadro)
for (const f of ["src/VideoEdit/Main_rksmart.tsx", "src/VideoEdit/cues_rksmart.gen.tsx", "src/rksafe/RayAvatarWin.tsx"]) {
  const src = fs.readFileSync(f, "utf8").split("\n").filter((L) => { const s = L.trim(); return !s.startsWith("//") && !s.startsWith("*") && !s.startsWith("/*"); }).join("\n");
  if (src.includes("<Video ") || src.includes("<Video>")) { console.error("⛔ <Video> en " + f + " — va OffthreadVideo"); faltan++; }
}
console.log("<Video> en el código propio: 0 ✓  (3 archivos revisados)");
console.log("═".repeat(72));
if (faltan || fps_malos.length) process.exit(2);
