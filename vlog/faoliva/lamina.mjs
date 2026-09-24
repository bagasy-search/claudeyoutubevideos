import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/faoliva/", O = R + "vlog/faoliva/lamina/";
const env = Object.fromEntries(fs.readFileSync(R + ".env", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const P = `A premium printed guide page, landscape, photographed flat and filling the whole frame (no table, no hands, no background): cream paper, deep green and warm amber accents, clean modern sans-serif typography, very LARGE readable letters, generous margins, a neat editorial layout like a high-quality health handout.
TOP HEADER BAR in deep green with white text: "GUÍA DEL DR. FEDERER · RECETA 3.3" and below it, big dark green title: "MASCARILLA DE AVENA PARA PIEL MUY SECA".
TOP ROW, a cream card with a small olive branch icon titled "INGREDIENTES", four lines each with a small line icon (oats, yogurt pot, honey jar, olive oil bottle):
 "3 cucharadas de avena molida fina"
 "2 cucharadas de yogur natural entero, sin azúcar"
 "1 cucharadita de miel pura"
 "1 cucharadita de aceite de oliva"
LEFT HALF, four numbered step cards in a column, each with a small simple line icon (a bowl with a spoon, a honey drop, a face, a water drop):
 1 "MEZCLAR" — "Avena + yogur hasta una pasta espesa"
 2 "SUMAR" — "Miel y aceite. Revolver hasta que quede untuosa"
 3 "APLICAR" — "Cara limpia y seca. Capa fina"
 4 "RETIRAR" — "12 a 15 minutos, recostada. Agua tibia, en círculos, sin frotar"
RIGHT HALF, top: a simple clean line drawing of a front-facing woman's face with soft green shaded zones on the forehead, the cheeks and the chin, with green arrows and labels "FRENTE", "MEJILLAS", "MENTÓN", and small red crossed circles on the eyes and on the lips labeled "OJOS Y LABIOS NO".
RIGHT HALF, bottom: an AMBER box with a warning icon: "LOS 3 ERRORES QUE LA ARRUINAN" — "1. Dejarla más de 20 minutos" — "2. Ponerla sobre granitos o heridas" — "3. Frotar fuerte al retirarla".
FOOTER strip across the bottom in deep green with white text: "2 VECES POR SEMANA · Prueba del parche 24 h antes · Para un solo uso · Piel más suave desde la primera vez; menos aspereza en semanas".
Every word in SPANISH spelled EXACTLY as written, no invented words, no extra text; CRITICAL SPELLING: render every accent and the N-with-tilde exactly: GUÍA, AZÚCAR, CÍRCULOS, MENTÓN, MÁS, SEMANAS, RECOSTADA. BRIGHT, evenly lit, neutral white balance, no vignette.`;
// Batch · low · 1088x608 (4 palancas). 3 variantes → elegir la mejor con zoom.
const H = { Authorization: "Bearer " + env.OPENAI_API_KEY };
const lines = ["a", "b", "c"].filter(v => !fs.existsSync(O + "lamina_" + v + ".png")).map(v => JSON.stringify({ custom_id: "lamina_" + v, method: "POST", url: "/v1/images/generations", body: { model: "gpt-image-2", quality: "low", size: "1088x608", n: 1, prompt: P } }));
const fd = new FormData(); fd.append("purpose", "batch"); fd.append("file", new Blob([lines.join("\n") + "\n"]), "lamina.jsonl");
const f = await (await fetch("https://api.openai.com/v1/files", { method: "POST", headers: H, body: fd })).json();
const b = await (await fetch("https://api.openai.com/v1/batches", { method: "POST", headers: { ...H, "Content-Type": "application/json" }, body: JSON.stringify({ input_file_id: f.id, endpoint: "/v1/images/generations", completion_window: "24h" }) })).json();
console.log("batch", b.id);
let st; for (;;) { await new Promise(r => setTimeout(r, 20000)); st = await (await fetch("https://api.openai.com/v1/batches/" + b.id, { headers: H })).json(); if (["completed", "failed", "expired", "cancelled"].includes(st.status)) break; }
console.log(st.status, JSON.stringify(st.request_counts));
const txt = await (await fetch(`https://api.openai.com/v1/files/${st.output_file_id}/content`, { headers: H })).text();
for (const ln of txt.split("\n").filter(Boolean)) { const r = JSON.parse(ln), body = r.response?.body; if (!body?.data) { console.log("FALLÓ", r.custom_id, JSON.stringify(body).slice(0, 200)); continue; }
  fs.writeFileSync(O + r.custom_id + ".png", Buffer.from(body.data[0].b64_json, "base64")); const u = body.usage, di = u.input_tokens_details || {};
  const c = (di.image_tokens || 0) * 4e-6 + (di.text_tokens || 0) * 2.5e-6 + u.output_tokens * 15e-6;
  fs.appendFileSync(R + "vlog/faoliva/usage_gptimage.jsonl", JSON.stringify({ src: "lamina_batch", usd_batch: +c.toFixed(5), u }) + "\n"); console.log("OK", r.custom_id, c.toFixed(5), JSON.stringify(u)); }
