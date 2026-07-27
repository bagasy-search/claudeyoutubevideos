// gate_shim_v3iuzgxce9vg.mjs — emite src/VideoEdit/Main_v3iuzgxce9vg.tsx
//
// POR QUÉ EXISTE: density_gate.mjs cuenta las instancias `<Componente>` leyendo el TEXTO del build,
// y busca el build en src/VideoEdit/Main_<slug>.tsx. Este video usa el kit _fed6, que es DATA-DRIVEN:
// el Main real (src/_fed6/VideoEdit/Main_v3iuzgxce9vg.tsx) recorre FEDZ_BEATS y despacha con un
// ternario, así que cada componente aparece UNA sola vez en el texto aunque se instancie 40 veces.
// Leído crudo, el gate mediría ~20 usos en vez de ~200 y bloquearía un video que sí está denso.
//
// Para eso el propio gate contempla el "ASSET_MANIFEST/COMPONENT_MANIFEST embebido en comentario".
// Este script lo GENERA a partir de los beats REALES ya anclados + el b-roll REAL en disco, así que
// el manifiesto no es una declaración optimista: es lo que efectivamente se va a renderizar.
import fs from "fs";

const SLUG = "v3iuzgxce9vg";
const beatsSrc = fs.readFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`, "utf8");
const BEATS = JSON.parse(beatsSrc.slice(beatsSrc.indexOf("= [") + 2, beatsSrc.lastIndexOf("]") + 1));
const brollSrc = fs.readFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`, "utf8");
const BROLL = JSON.parse(brollSrc.slice(brollSrc.indexOf("= [") + 2, brollSrc.lastIndexOf("]") + 1));
const manifest = fs.readFileSync(`_manifest_${SLUG}.txt`, "utf8").trim().split("\n");

// b-roll REALMENTE bajado (el que no bajó se tapa con imagen y no debe contarse como clip)
const enDisco = new Set(fs.readdirSync(`public/broll/${SLUG}`).filter((f) => f.endsWith(".mp4")));
const clips = BROLL.filter((b) => enDisco.has(b.name + ".mp4"));

// El manifiesto se emite en ORDEN CRONOLÓGICO (comps + un <RawShot/> por clip de b-roll).
// density_gate mide la "variedad por tramo" por POSICIÓN en la lista cuando el build no trae
// tiempos: si listás todos los componentes juntos y después todos los RawShot, los últimos tramos
// dan 0 componentes y avisa "TRAMOS PELADOS" aunque el video esté bien repartido.
const eventos = [
  ...BEATS.map((b, i) => ({ t: b.start, line: manifest[i] })),
  ...clips.map((c) => ({ t: c.start, line: "<RawShot />" })),
].sort((a, b) => a.t - b.t);
const lineas = eventos.map((e) => e.line);

const assets = [
  ...new Set([
    ...BEATS.flatMap((b) => JSON.stringify(b).match(/img\/[a-z0-9_\-]+\.png/gi) || []),
    ...clips.map((c) => c.src),
  ]),
];

const VIDEO_END = Math.max(...BEATS.map((b) => b.start + b.dur), ...clips.map((c) => c.start + c.dur)) + 1.2;
const TOTAL = Math.round(VIDEO_END * 30);

const out = `// Main_${SLUG}.tsx — MANIFIESTO del build (para scripts/density_gate.mjs).
// El build REAL vive en src/_fed6/VideoEdit/Main_${SLUG}.tsx (kit _fed6, data-driven).
// Este archivo NO se importa en el render: sólo re-exporta y declara qué se instancia.
// Generado por scripts/gate_shim_${SLUG}.mjs — no editar a mano.

export const TOTAL_FRAMES = ${TOTAL};

/* COMPONENT_MANIFEST — una línea por instancia real que se renderiza
${lineas.join("\n")}
*/

/* ASSET_MANIFEST
${assets.map((a) => JSON.stringify(a)).join("\n")}
*/

export { MainUro, TOTAL_FRAMES_URO } from "../_fed6/VideoEdit/Main_${SLUG}";
`;
fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`, out);

const comps = manifest.filter((l) => !l.includes("RawShot")).length;
console.log(`shim escrito · componentes: ${comps} · tomas planas: ${manifest.length - comps + clips.length} · assets: ${assets.length} · clips en disco: ${clips.length}/${BROLL.length}`);
console.log(`TOTAL_FRAMES: ${TOTAL} (${(VIDEO_END / 60).toFixed(1)} min) · componentes/min: ${(comps / (VIDEO_END / 60)).toFixed(1)}`);
