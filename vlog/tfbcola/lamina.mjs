// lamina.mjs <outPrefix> <n> — la FICHA (estilo de la guía) con gpt-image-2 LOW 1536x1024, n variantes en paralelo
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const [, , pre, n = "3"] = process.argv;
const P = `A premium printed page from a vintage-style home repair guide, landscape layout, flat front view filling the whole image, no hands, no table, no photo of a page: the page itself.
Paper: warm cream #F1E4C9 with a very subtle paper texture. Ink: dark espresso brown. Accents: rust red #8B2D22 and old gold #B1832F. Big elegant serif typography, thin gold rule lines, earthy vintage craft style, clean hierarchy, generous margins, everything large and easy to read.
TOP HEADER, small caps in gold, centered: "LA COLECCIÓN DEL CONSTRUCTOR LIBRE · FICHA X"
MAIN TITLE, big rust-red serif, centered below: "COLA DE CARPINTERO CASERA"
SUBTITLE in espresso italic serif: "cola de caseína, hecha con leche"
LEFT COLUMN, header in espresso serif: "INGREDIENTES", with a small ink drawing of a milk carton, a vinegar bottle and a jar, and four lines with gold bullets:
"1 litro de leche DESCREMADA" · "4 cucharadas de vinagre blanco" · "1 cucharadita de bicarbonato (o ½ de cal)" · "2 o 3 cucharadas de agua"
CENTER COLUMN, header in espresso serif: "PASO A PASO", six small ink drawings in two rows of three, each with a rust-red numbered circle and a short caption under it:
"1 · Entibiar sin hervir" (a pot on a flame), "2 · Cortar con vinagre" (curds in a pot), "3 · Colar en tela" (a cloth in a colander), "4 · Lavar bien" (curds under a tap), "5 · Exprimir" (hands twisting a cloth), "6 · Mezclar: queda como miel" (a stick lifting thick glue from a jar).
RIGHT COLUMN, header in espresso serif: "TIEMPOS", three lines with small clock icons: "Pincel en las dos caras" · "Prensa: toda la noche" · "Carga: después de 24 h".
Below it a boxed panel with a rust-red border titled "LOS 3 ERRORES" with three lines:
"✗ No lavar la cuajada" · "✗ Usarla con grumos" · "✗ Guardarla para mañana"
FOOTER BAND across the whole bottom, rust red background with cream text: "SÓLO PARA ADENTRO · CON HUMEDAD O AFUERA: COLA PARA EXTERIORES · CAL: GUANTES Y GAFAS".
Every word in SPANISH spelled EXACTLY as written, no invented words, no extra text; CRITICAL SPELLING: render every accent and the N-with-tilde exactly (COLECCIÓN, CASEÍNA, CUCHARADITA, DESPUÉS, SÓLO, MAÑANA, PASO A PASO).`;
await Promise.all(Array.from({ length: +n }, async (_, i) => {
  const j = await (await fetch("https://api.openai.com/v1/images/generations", { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ model: "gpt-image-2", quality: "low", size: "1536x1024", prompt: P }) })).json();
  if (!j.data) return console.log(JSON.stringify(j).slice(0, 300));
  fs.writeFileSync(`${pre}_${i}.png`, Buffer.from(j.data[0].b64_json, "base64")); console.log("OK", i, JSON.stringify(j.usage));
}));
