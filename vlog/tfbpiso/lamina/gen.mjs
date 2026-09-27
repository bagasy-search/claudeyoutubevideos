// lámina tfbpiso: gpt-image-2 LOW 1792x1008 (texto legible a pantalla completa), 3 variantes en paralelo
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(".env","utf8").split(/\r?\n/).filter(l=>l.includes("=")&&!l.startsWith("#")).map(l=>[l.slice(0,l.indexOf("=")).trim(), l.slice(l.indexOf("=")+1).trim().replace(/^"|"$/g,"")]));
const P = `A premium printed workshop reference sheet, landscape, photographed perfectly flat and filling the whole frame edge to edge (no table, no hands, no background): warm cream paper colour #F1E4C9 with a very subtle paper texture, dark espresso-brown ink #2B1D14, rust red #8B2D22 and antique gold #B1832F accents, elegant large serif headings and a clean serif body, generous margins, thin gold rule lines, the look of a beautifully designed page from a practical home-repair handbook.
TOP LEFT small gold caps: "LA COLECCIÓN DEL CONSTRUCTOR LIBRE · FICHA DE TALLER".
BIG TITLE in espresso serif: "PISO NUEVO SOBRE PISO VIEJO" and under it in italic: "Carpeta de cemento con terminación a escoba".
TOP BAND: a single row of ten small numbered circles in rust red (1 to 10), each with a tiny line-drawn icon and ONE word under it, in this exact order: 1 "PICAR" (chisel), 2 "LAVAR" (brush), 3 "MOJAR" (hose), 4 "LECHADA" (bucket), 5 "CARPETA" (wheelbarrow), 6 "REGLA" (long straightedge), 7 "FRATÁS" (wooden float), 8 "ESCOBA" (broom), 9 "JUNTAS" (grid lines), 10 "CURADO" (water drops), with thin arrows between them.
MIDDLE LEFT: a clean line-drawn cross-section of a floor with labelled layers from bottom to top: "PISO VIEJO (mojado)", "LECHADA: cemento + agua con cola", "CARPETA", "RAYADO DE ESCOBA", with small leader lines.
MIDDLE RIGHT, heading "LAS MEDIDAS" in gold caps, three short lines with small icons: "Carpeta: 1 de cemento por 3 de arena" (one bucket and three buckets), "Grosor: nunca más fino que un dedo" (a finger icon), "Juntas: paños casi cuadrados" (a small grid).
BOTTOM: a box with a rust-red border and a light rust tint, heading "LOS 3 ERRORES" in rust red caps, three numbered lines: "1. Echar la mezcla sobre piso seco o con polvo", "2. Dejar secar la lechada antes de la carpeta", "3. Dejarlo al sol sin agua los primeros días".
Very large readable letters, perfect hierarchy, lots of air, nothing crowded, no photos, no logos, no people. Every word in SPANISH spelled EXACTLY as written, no invented words; CRITICAL SPELLING: render every accent and the N-with-tilde exactly (COLECCIÓN, TERMINACIÓN, FRATÁS, DÍAS).`;
fs.writeFileSync("vlog/tfbpiso/lamina/prompt.txt", P);
await Promise.all(["a","b","c"].map(async v => {
  const r = await fetch("https://api.openai.com/v1/images/generations",{method:"POST",headers:{Authorization:"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-image-2",prompt:P,size:"1792x1008",quality:"low",n:1})});
  const j = await r.json(); if (!j.data) return console.log(v, JSON.stringify(j).slice(0,300));
  fs.writeFileSync(`vlog/tfbpiso/lamina/lamina_${v}.png`, Buffer.from(j.data[0].b64_json,"base64")); console.log(v,"ok",JSON.stringify(j.usage));
}));
