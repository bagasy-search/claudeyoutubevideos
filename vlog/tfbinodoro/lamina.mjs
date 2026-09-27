// lámina (ficha con el estilo de la guía, NO una página de la guía): gpt-image-2 LOW por Batch, 1536x1024 → recorte 16:9.
// uso: node vlog/tfbinodoro/lamina.mjs [n variantes]   → out/lamina/lam_<i>.png
import fs from "node:fs";
import { submitBatch, pollBatch, fetchBatch } from "../../factory/lib/openai_batch.mjs";
const OUT = "D:/Proyectos/video2-wt/tfbinodoro/out/lamina";
fs.mkdirSync(OUT, { recursive: true });
const P = `A premium printed reference sheet from a vintage-style home repair guide, landscape layout, flat front view filling the whole image edge to edge, no hands, no table, no photo of a page: the sheet itself.
Paper: warm cream #F1E4C9 with a very subtle paper texture. Ink: dark espresso brown. Accents: rust red #8B2D22 and old gold #B1832F. Big elegant serif typography, thin gold rule lines, clean hierarchy, generous margins.
TOP HEADER, small caps in gold, centered: "LA COLECCIÓN DEL CONSTRUCTOR LIBRE · FICHA DE TALLER"
MAIN TITLE, big rust-red serif, centered: "SARRO EN EL INODORO: SÁCALO SIN CAMBIARLO"
LEFT TWO THIRDS: header in espresso serif "EL MÉTODO EN 5 PASOS". A clean ink line illustration of a side cross-section of a toilet bowl showing the water line with a yellow-brown limescale ring and the curved trap, with thin arrows to five numbered rust circles, and next to each number one line of text:
"1 · BAJA EL AGUA: llave cerrada, descarga, vaso y esponja"
"2 · VINAGRE CALIENTE: unos 2 litros, sin hervir, por el borde"
"3 · TIEMPO: 1 hora mínimo, toda la noche si es vieja"
"4 · PIEDRA PÓMEZ MOJADA: suave, sobre la línea"
"5 · AGUJEROS DEL BORDE: alambre fino y papel con vinagre"
RIGHT THIRD: a box with a rust-red border titled in rust red "LOS 3 ERRORES", with three lines, each starting with a small rust cross:
"Echarlo con la taza llena"
"Frotar fuerte a los 5 minutos"
"La piedra pómez seca"
BOTTOM BAND across the whole width, thin gold rule above, two short lines in espresso serif:
"PREVENCIÓN: un vaso de vinagre por semana, de noche."
"OJO: nunca mezcles ácido con cloro. Si está rajado o pierde por la base, se cambia."
Every word in SPANISH spelled EXACTLY as written, no invented words, no extra text; CRITICAL SPELLING: render every accent and the N-with-tilde exactly (CÓ, SÁ, MÉ, ÍN, PÓ, Í, É).`;
const n = +(process.argv[2] || 2);
const items = Array.from({ length: n }, (_, i) => ({ name: "lam_" + i, prompt: P }));
const st = OUT + "/_batch.json";
let id = fs.existsSync(st) ? JSON.parse(fs.readFileSync(st, "utf8")).id : null;
if (!id) { const r = await submitBatch({ items, outDir: OUT, size: "1536x1024", quality: "low" }); id = r.batchId; fs.writeFileSync(st, JSON.stringify({ id })); console.log("batch", id, r.n); }
for (;;) { const b = await pollBatch(id); console.log(new Date().toISOString().slice(11, 19), b.status, JSON.stringify(b.counts)); if (b.status === "completed") break; if (["failed", "expired", "cancelled"].includes(b.status)) throw new Error(b.status); await new Promise(r => setTimeout(r, 20000)); }
console.log(await fetchBatch({ batchId: id, outDir: OUT }));
