// build_cmepanel30.mjs — emite el montaje de `cmepanel30`.
//
// Lee `_v3/cmepanel30_cues.json` (movimientos + capa de eventos, ya anclados al ms de Whisper) y
// escribe:
//   src/cmepanel30/cues_cmepanel30.gen.tsx   la lista de cues
//   src/cmepanel30/Main_cmepanel30.tsx       la composicion (avatar + cues + audio master)
//   src/index_cmepanel30.tsx                 el entry propio (⛔ sin esto el farm usa src/index.tsx
//                                            COMPARTIDO, que otra sesion dejo apuntando a otro video)
//   _cmepanel30_assets.txt                   la lista de assets para el tarball
//
// ⛔⛔ COMPUERTAS QUE CORRE ESTE BUILD (cada una costo un render):
//  1. FPS: todo a 30/1 CFR. Los clips de agnes salen a 24 y el avatar de HeyGen a 25; en una comp de
//     30 eso da JUDDER EN TODO EL METRAJE, y no lo ve blackdetect, ni el auditor de vision, ni tsc,
//     ni density_gate. Se entrego `cmeenchufe` asi y hubo que re-rendearlo entero.
//  2. ASSETS POR ESCANEO DE `src/cmepanel30/*.tsx`, no solo de los cues: los MOVIMIENTOS llevan sus
//     rutas HARDCODEADAS adentro y el cue solo dice que componente montar. Sin este escaneo el tar
//     salio con 102 imagenes en vez de 391 y cada chunk con un movimiento murio con 404 — y el error
//     MIENTE ("EncodingError: source image cannot be decoded", parece archivo corrupto).
//  3. RUTA POR TEMPLATE LITERAL: ningun escaneo por texto la ve. Se aborta si aparece.
//  4. EXISTENCIA EN DISCO de cada ruta.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const FPS = 30;
const SLUG = "cmepanel30";
const TOTAL_FRAMES = 43657;      // 1455,221 s de master
const AVATAR_FRAMES = 18683;     // 622,763 s de lipsync REAL
const LOOP_START = 18695;        // 623,15 s — desde aca el avatar va EN BUCLE (sin lipsync valido)

const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffprobe.exe";
const die = (m) => { console.error("\n⛔ " + m + "\n"); process.exit(1); };

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_cues.json`, "utf8").replace(/^﻿/, ""));
const { movs, cues } = plan;

// ── 1) ASSETS: de los cues + del ESCANEO de los .tsx del slug ─────────────────────────────────
const assets = new Set();
for (const c of cues) assets.add(c.src);

const tsx = fs.readdirSync(`src/${SLUG}`).filter((f) => f.endsWith(".tsx"));
for (const f of tsx) {
  const src = fs.readFileSync(`src/${SLUG}/${f}`, "utf8");
  // ⛔ compuerta 3: ruta armada por template literal
  const tl = src.match(/staticFile\(`[^`]*`\)/g);
  if (tl) die(`${f} arma una ruta por TEMPLATE LITERAL (${tl[0]}). Ningun escaneo la ve y el chunk muere con 404.`);
  for (const m of src.match(/"(img|broll|sfx)\/[^"]+"/g) || []) assets.add(m.replace(/"/g, ""));
}

// ── 2) COMPUERTA DE EXISTENCIA + FPS ──────────────────────────────────────────────────────────
const faltan = [], malFps = [];
for (const a of assets) {
  if (!fs.existsSync("public/" + a)) { faltan.push(a); continue; }
  if (a.endsWith(".mp4")) {
    const r = execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v",
      "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", "public/" + a], { encoding: "utf8" }).trim();
    if (r !== "30/1") malFps.push(`${a} = ${r}`);
  }
}
if (faltan.length) die(`${faltan.length} assets NO existen en disco:\n   ` + faltan.slice(0, 12).join("\n   "));

// el avatar tambien
const avFps = execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v", "-show_entries",
  "stream=r_frame_rate,width,height", "-of", "csv=p=0", `public/${SLUG}_opt.mp4`], { encoding: "utf8" }).trim();
if (!avFps.endsWith("30/1")) malFps.push(`${SLUG}_opt.mp4 = ${avFps}`);
if (malFps.length) die(`COMPUERTA DE FPS — esto sale con TIRON en todo el metraje y ninguna otra compuerta lo ve.\n   ` +
  malFps.slice(0, 10).join("\n   ") + `\n   Arreglo: bash _v3/conform30_${SLUG}.sh`);

// ── 3) CUES ───────────────────────────────────────────────────────────────────────────────────
// Alineados al FRAME FINAL en `build_eventos.mjs` (mata los destellos de 33 ms entre cues contiguos).
const cueRows = cues.map((c, i) => {
  const f0 = Math.round(c.start * FPS);
  const f1 = Math.round((c.start + c.dur) * FPS);
  return `  { key: "e${i}", start: ${f0}, dur: ${Math.max(1, f1 - f0)}, kind: "${c.kind}", src: "${c.src}", seed: ${i * 37 + 11} },`;
}).join("\n");

const movRows = movs.map((m, i) =>
  `  { key: "m${i}", from: ${m.from}, dur: ${m.dur}, comp: "${m.comp}" },`).join("\n");

const imports = movs.map((m) => `import { ${m.comp} } from "./${m.comp}";`).join("\n");

fs.writeFileSync(`src/${SLUG}/cues_${SLUG}.gen.tsx`, `// GENERADO por build_${SLUG}.mjs — no editar a mano.
import React from "react";
import { Clip, Foto } from "./Piezas";
${imports}

export type Cue = { key: string; start: number; dur: number; kind: string; src: string; seed: number };
export const CUES: Cue[] = [
${cueRows}
];

export type Mov = { key: string; from: number; dur: number; comp: string };
export const MOVS: Mov[] = [
${movRows}
];

export const renderCue = (c: Cue) =>
  c.kind === "clip" ? <Clip src={c.src} /> : <Foto src={c.src} seed={c.seed} />;

export const renderMov = (m: Mov) => {
  switch (m.comp) {
${movs.map((m) => `    case "${m.comp}": return <${m.comp} />;`).join("\n")}
    default: return null;
  }
};
`);

// ── 4) MAIN ───────────────────────────────────────────────────────────────────────────────────
// El avatar es el FONDO GARANTIZADO (base full). Nunca se dibuja en dos ramas oculto/visible: un
// solo <Video> montado por tramo, o el audio glitchea en cada cambio de escena.
// ⚠️ La cola de Fish (832 s) es mas larga que el avatar (623 s) -> DOS pasadas de bucle.
const LOOP2 = LOOP_START + AVATAR_FRAMES;
fs.writeFileSync(`src/${SLUG}/Main_${SLUG}.tsx`, `// GENERADO por build_${SLUG}.mjs — no editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile } from "remotion";
import { CUES, MOVS, renderCue, renderMov } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_CMEPANEL30 = ${TOTAL_FRAMES};

const AVATAR = "${SLUG}_opt.mp4";
const V = { width: "100%", height: "100%", objectFit: "cover" } as const;

/**, NUNCA <Video>. Medido en cmepanel30 (ago-2026): con <Video> el avatar servia
 *  CUADROS EQUIVOCADOS -- cuatro cuadros seguidos del render mostraban los fotogramas
 *  13952, 13948, 13954, 13953 de la fuente (desfases +2, -3, +2, 0). El creador lo vio
 *  como 'el avatar se re contra lagea', y es el MISMO bug en todos los videos del repo
 *  que usan <Video>. Causa: el farm rinde en chunks paralelos y cada Chrome le pide al
 *  elemento de video que salte a un tiempo; con un mp4 largo el decodificador no llega
 *  y devuelve el cuadro que tiene a mano. OffthreadVideo extrae el cuadro exacto con
 *  ffmpeg y no depende del navegador. */
/** El avatar del creador dura ${AVATAR_FRAMES} f y el audio ${TOTAL_FRAMES}: va en BUCLE, dos pasadas.
 *  Los dos saltos (${LOOP_START} y ${LOOP2}) los tapa contenido a pantalla completa. */
const AvatarLayer: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    <Sequence from={0} durationInFrames={${AVATAR_FRAMES}}>
      <OffthreadVideo src={staticFile(AVATAR)} muted style={V} />
    </Sequence>
    <Sequence from={${LOOP_START}} durationInFrames={${AVATAR_FRAMES}}>
      <OffthreadVideo src={staticFile(AVATAR)} muted style={V} />
    </Sequence>
    <Sequence from={${LOOP2}} durationInFrames={${TOTAL_FRAMES} - ${LOOP2}}>
      <OffthreadVideo src={staticFile(AVATAR)} muted style={V} />
    </Sequence>
  </AbsoluteFill>
);

export const MainCmepanel30: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    <AvatarLayer />
    {CUES.map((c) => (
      <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
        {renderCue(c)}
      </Sequence>
    ))}
    {MOVS.map((m) => (
      <Sequence key={m.key} from={m.from} durationInFrames={m.dur} layout="none">
        {renderMov(m)}
      </Sequence>
    ))}
    {/* un solo <Audio> con el master completo; el <Video> va MUTEADO */}
    <Audio src={staticFile("${SLUG}.wav")} />
  </AbsoluteFill>
);
`);

// ── 5) ENTRY PROPIO ───────────────────────────────────────────────────────────────────────────
fs.writeFileSync(`src/index_${SLUG}.tsx`, `// GENERADO por build_${SLUG}.mjs — entry propio.
// ⛔ Sin este entry el farm usa src/index.tsx COMPARTIDO, que otra sesion dejo apuntando a otro
// video, y los 60 chunks mueren con "Could not find composition with ID Cmepanel30".
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmepanel30, TOTAL_FRAMES_CMEPANEL30 } from "./${SLUG}/Main_${SLUG}";

export const Root: React.FC = () => (
  <Composition id="Cmepanel30" component={MainCmepanel30}
    durationInFrames={TOTAL_FRAMES_CMEPANEL30} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root);
`);

// ── 6) LISTA DE ASSETS ────────────────────────────────────────────────────────────────────────
const lista = [...assets].sort();
fs.writeFileSync(`_${SLUG}_assets.txt`, lista.join("\n") + "\n");

const nClip = lista.filter((a) => a.endsWith(".mp4")).length;
console.log(`✅ build ${SLUG}`);
console.log(`   cues ${cues.length} · movimientos ${movs.length} · TOTAL ${TOTAL_FRAMES} f = ${(TOTAL_FRAMES / FPS / 60).toFixed(1)} min`);
console.log(`   assets ${lista.length} (${nClip} clips, ${lista.length - nClip} imagenes) -> _${SLUG}_assets.txt`);
console.log(`   compuertas OK: fps 30/1 · existencia en disco · sin template literals`);
