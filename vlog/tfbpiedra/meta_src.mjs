// arma public/tfbpiedra_meta.json con los capítulos reales de timeline.json. node vlog/tfbpiedra/meta_src.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/tfbpiedra/", V = R + "vlog/tfbpiedra/";
const T = JSON.parse(fs.readFileSync(V + "timeline.json", "utf8"));
const mmss = f => { const s = Math.floor(f / 30); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const title = "Le Tiré AGUA al Cemento Fresco y Apareció ESTO (Piedra Lavada, Paso a Paso)";
const guia = `🔧 LA COLECCIÓN DEL CONSTRUCTOR LIBRE — el Manual de Reparaciones Caseras (76 arreglos paso a paso, con materiales, medidas y la prueba para saber si te salió bien), la Guía Anti-Humedad, Moho y Goteras, una guía exclusiva de herramientas, la Hoja de Compras Maestra y las Fichas de Emergencia.
👉 https://constructorlibre.com/?src=tfb-piedra`;
const truco = `EL TRUCO QUE MENCIONÉ EN EL VIDEO → si la piedra de color te sale cara, no la mezcles toda.
Cuela el piso con concreto común (1 de cemento, 2 de arena y 3 de grava común, medido con el mismo balde), reglalo, y enseguida SIEMBRA encima una sola capa de la piedra bonita, piedras tocándose entre sí.
Apriétalas con la llana de madera hasta que queden hundidas unos dos tercios, apenas cubiertas por la pasta, sin frotar.
Después, lo mismo de siempre: la prueba de la esquina con el cepillo y el lavado con lluvia fina, destapando más o menos un tercio de cada piedra.
Por arriba se ve igual, y usas mucho menos piedra de color.`;
const cuerpo = `Piso de piedra lavada (concreto deslavado) hecho en casa, con manguera de jardín y un cepillo, sin hidrolavadora. En este video te muestro el proceso completo: la base de grava compactada, el marco de tablas con pendiente, la mezcla con canto rodado, el colado, el reglado, el punto exacto de lavado, el curado y el sellado opcional.

Lo más importante: el momento de lavar no se adivina con el reloj, se prueba en una esquina. Si lavas antes de tiempo, las piedras se sueltan; si lavas tarde, la pasta ya no sale.

⚠️ Seguridad: el cemento fresco es cáustico. Usa guantes de goma, botas y gafas. El agua del lavado (con pasta de cemento) no va al desagüe: déjala asentar en un balde y tira el agua clara en la tierra.
📌 Relacionado en la colección: «El sellador universal del taller: cuándo cada uno», por si vas a sellar el piso.

CAPÍTULOS
${T.chap.map(([n, f]) => `${mmss(f)} ${n}`).join("\n")}

¿Lo hiciste? Cuéntame en los comentarios cómo te quedó, y si te salió mal, también.`;
const description = `${guia}\n\n${truco}\n\n${cuerpo}`;
const pinned = `${guia}\n\n${truco}`;
for (const [k, v] of Object.entries({ description, pinned })) if (/gratis|regalo|\$\d/i.test(v)) throw new Error(k + ": palabra/precio prohibido");
fs.writeFileSync(R + "public/tfbpiedra_meta.json", JSON.stringify({ title, description, pinned_comment: pinned }, null, 1));
console.log("meta OK ·", description.length, "car · capítulos", T.chap.length);
