// Metadata de YouTube para El Constructor Libre (row 59): 1ª línea = el REGALO gratis con ?src=<slug> (la landing salta a la receta
// del video), 2ª = la Colección. Capítulos con los ms REALES de _v3/<slug>_paras.json. → public/<slug>_meta.json
import fs from "node:fs";
const SLUG = "fbgranito", R = "D:/Proyectos/video2-wt/fbgranito/";
const paras = JSON.parse(fs.readFileSync(R + `_v3/${SLUG}_paras.json`, "utf8"));
const ch = JSON.parse(fs.readFileSync(R + `vlog/${SLUG}/chapters.json`, "utf8"));
const startOf = (i) => { const p = paras[i] ?? paras.find((x) => x.i === i); return (p.ms ?? p.start ?? p.s) / (p.ms ? 1000 : 1); };
const ts = (s) => { s = Math.floor(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const caps = ch.chapters.map(([i, t], k) => `${k === 0 ? "0:00" : ts(startOf(i))} ${t}`).join("\n");
const title = "Mezclá CEMENTO con BARNIZ y Mirá Cómo Queda: Parece GRANITO de $5";
const description = `🎁 GRATIS — las 10 mezclas del canal con las medidas exactas (ésta y las otras 9): https://www.constructorlibre.com/regalo?src=${SLUG}
📕 La Colección del Constructor Libre — 76 arreglos caseros con materiales y medidas: https://www.constructorlibre.com/?src=${SLUG}

Casi todo el mundo hace este truco al revés: le echa el barniz ADENTRO de la mezcla, como en el video viral. El barniz envuelve el cemento, el agua no llega, y queda una pieza manchada que se desgrana con la uña.

En este video hago una tapa de 60 x 40 que parece granito pulido, con cemento, granza de mármol, arena fina y barniz, por unos 5 dólares de material:
• La receta completa: molde, malla, mezcla en seco, el agua de a poco y el paso que casi todos se saltean (golpear el molde).
• Por qué el dibujo del granito lo hace la LIJA, no el barniz.
• Los 5 errores que te arruinan la tapa.
• La prueba del vecino: café caliente, limón, llaves y cien kilos encima.
• La versión clara para el baño, el color con óxido de hierro y el truco del vidrio de botella.

📏 Las medidas exactas (cemento, granza, arena, agua, la mano de barniz rebajada y los tiempos) están en la página gratis del primer link.

Capítulos:
${caps}

Sin música: sólo el trabajo y el sonido del taller.`;
const out = { title, description, pinned_comment: ch.pinned, tags: ["cemento", "granito", "barniz", "mezcla casera", "mesada de cemento", "granza de mármol", "trucos de albañil", "construcción casera", "el constructor libre"] };
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify(out, null, 1));
console.log(caps); console.log(description.length, "chars");
