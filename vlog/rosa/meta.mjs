// meta.mjs <slug> "<título>" — public/<slug>_meta.json con título, descripción (capítulos con tiempos reales) y comentario fijado.
import fs from "node:fs";
const [slug, title] = process.argv.slice(2);
const R = `D:/rtmp/${slug}/`;
const here = new URL(".", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const cfg = JSON.parse(fs.readFileSync(`${here}${slug}/items.json`, "utf8"));
const moments = JSON.parse(fs.readFileSync(R + "moments.json", "utf8"));
const t = (ms) => { const s = Math.round(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ":" + String(m).padStart(2, "0") : String(m).padStart(1, "0")) + ":" + String(x).padStart(2, "0"); };
const first = {}; for (const m of moments) if (!(m.item in first)) first[m.item] = m.ms_in;
const lines = ["0:00 Mi primera noche cocinando para uno"];
if (first.reglas != null) lines.push(`${t(first.reglas)} Tres reglas de la olla pequeña`);
if (first.despensa != null) lines.push(`${t(first.despensa)} La despensa que nunca falla`);
for (const [n, it] of Object.entries(cfg.items)) if (first["i" + n] != null) lines.push(`${t(first["i" + n])} ${n}. ${it.title}`);
for (const k of ["interludio", "semana", "errores", "elegir", "cierre"]) if (first[k] != null) lines.push(`${t(first[k])} ${cfg.chapters[k]?.text ?? "Cierre"}`);
// YouTube exige que los capítulos estén en orden creciente
lines.sort((a, b) => { const p = (s) => s.split(" ")[0].split(":").map(Number).reduce((x, y) => x * 60 + y, 0); return p(a) - p(b); });
const description = `Cada comida de esta lista se hace en UNA sola olla pequeña, para una o dos personas, con ingredientes de cualquier despensa. Sin fregar un montón de platos y sin tirar nada: lo que sobra de hoy es la base de mañana.

Las medidas exactas de todas, el menú de 30 días, la tabla de las sobras y 45 trucos de la abuela las dejé reunidas en un libro, como un regalo de la casa:
👉 https://abuela-rosa-recetario.vercel.app

CAPÍTULOS
${lines.join("\n")}

Si hoy cenas solo, no estás sola ni solo: aquí hay una olla puesta. Cuéntame en los comentarios cuál vas a cocinar esta noche.

#comidascaseras #recetasdeabuela #cocinaparaunapersona #comidaeconomica`;
const pinned = "¿Cuál de las 30 vas a cocinar esta noche? Cuéntamelo aquí, que los leo todos con mi taza de té. 🍲 Y el libro con las medidas exactas, el menú de 30 días y los trucos está en la descripción.";
const out = REPO_OUT();
function REPO_OUT() { return `${process.cwd().replace(/\\/g, "/")}/public/${slug}_meta.json`; }
fs.writeFileSync(out, JSON.stringify({ title, description, pinned_comment: pinned }, null, 1));
console.log(out, "\n" + lines.length + " capítulos\n" + lines.slice(0, 6).join("\n"));
