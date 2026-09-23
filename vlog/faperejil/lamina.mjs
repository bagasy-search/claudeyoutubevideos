import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/faperejil/", O = R + "vlog/faperejil/lamina/";
const env = Object.fromEntries(fs.readFileSync(R + ".env", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const P = `A premium printed guide page, landscape, photographed flat and filling the whole frame (no table, no hands, no background): cream paper, deep green and warm amber accents, clean modern sans-serif typography, very LARGE readable letters, generous margins, a neat editorial layout like a high-quality health handout.
TOP HEADER BAR in deep green with white text: "DR. FEDERER · TÓNICO DE PEREJIL DE NOCHE".
LEFT HALF: four numbered cards in a column, each with a small simple line icon (a parsley sprig, a kettle, a glass jar, a crescent moon):
 1 "UN PUÑADO" — "20 g de perejil fresco, lavado y picado grueso"
 2 "250 ml DE AGUA RECIÉN HERVIDA" — "Tapar 10 minutos. No hervir el perejil"
 3 "COLAR Y ENFRIAR" — "Frasco de vidrio en la nevera. Dura 3 días"
 4 "DE NOCHE" — "Algodón sobre cara y cuello limpios. Sin enjuagar"
RIGHT HALF, top: a simple clean line drawing of a front-facing face and neck with green curved arrows pointing UPWARD on the cheeks, forehead, chin and neck, labeled "DE ABAJO HACIA ARRIBA", and a small red crossed circle next to the eyes labeled "OJOS NO".
RIGHT HALF, middle: a small green box: "MASCARILLA · 2 VECES POR SEMANA" — "2 cucharadas de perejil picado + 1 cucharada de yogur natural · 10 minutos".
RIGHT HALF, bottom: an AMBER box with a warning icon: "LOS 3 ERRORES QUE LO ARRUINAN" — "1. Usarlo de día y salir al sol" — "2. Mezclarlo con limón o vinagre" — "3. Saltarse la prueba del parche (24 h)".
FOOTER strip across the bottom: "PLAZO: 3 a 4 semanas, todas las noches · Más luz e hidratación; las arrugas profundas no se borran".
Every word in SPANISH spelled EXACTLY as written, no invented words, no extra text; CRITICAL SPELLING: render every accent and the N-with-tilde exactly: PUÑADO (P-U-Ñ-A-D-O), RECIÉN, DÍAS, ALGODÓN, DÍA, LIMÓN, TÓNICO. BRIGHT, evenly lit, neutral white balance, no vignette.`;
await Promise.all(["a", "b", "c"].map(async v => {
  const out = O + "lamina_" + v + ".png"; if (fs.existsSync(out)) return;
  const j = await (await fetch("https://api.openai.com/v1/images/generations", { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ model: "gpt-image-2", quality: "low", size: "1792x1008", prompt: P }) })).json();
  if (!j.data) return console.log(v, JSON.stringify(j).slice(0, 300));
  fs.writeFileSync(out, Buffer.from(j.data[0].b64_json, "base64")); console.log("OK", v, JSON.stringify(j.usage));
}));
