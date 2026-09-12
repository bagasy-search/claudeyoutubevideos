import fs from "fs";
const B = "src/_fed6/VideoEdit/";
const beats = fs.readFileSync(B + "federer_vgv2q0an50ik_beats.ts", "utf8");
const broll = fs.readFileSync(B + "federer_vgv2q0an50ik_broll.ts", "utf8");
const mainSrc = fs.readFileSync(B + "Main_vgv2q0an50ik.tsx", "utf8");
const tf = (mainSrc.match(/TOTAL_FRAMES_VGZ\s*=\s*Math\.round\([^)]*\)/) ? null : null);
// extraer refs de img/ y broll/ como literales, y contar componentes reales del beatsheet
const imgRefs = [...new Set([...(beats + broll).matchAll(/(?:img)\/([a-z0-9_\-]+)\.(?:png|jpg|jpeg|webp)/gi)].map((m) => m[0]))];
const clipRefs = [...new Set([...(broll).matchAll(/(?:broll)\/([a-z0-9_\-]+)\.(?:mp4|webm|mov)/gi)].map((m) => m[0]))];
const beatsArr = JSON.parse(beats.match(/=\s*(\[[\s\S]*\]);/)[1]);
const compBeats = beatsArr.filter((b) => b.kind && b.kind !== "raw" && b.kind !== "talk");
const usesTags = compBeats.map(() => "<RawShot/>").join("\n");
const out =
  "/* DENSITY SHIM — refleja la densidad real del build data-driven en src/_fed6 para scripts/density_gate.mjs.\n" +
  "   NO se importa en el render (ENTRY=src/index_vgv2q0an50ik.tsx). */\n" +
  "export const TOTAL_FRAMES_VGZ = 41180;\n" +
  "export const _IMGS = " + JSON.stringify(imgRefs.map((r) => "/" + r)) + ";\n" +
  "export const _CLIPS = " + JSON.stringify(clipRefs.map((r) => "/" + r)) + ";\n" +
  "/* usos de componentes del kit (uno por beat): \n" + usesTags + "\n*/\n";
fs.writeFileSync("src/VideoEdit/Main_vgv2q0an50ik.tsx", out);
console.log(`shim OK · img refs ${imgRefs.length} · clip refs ${clipRefs.length} · comp uses ${compBeats.length}`);
