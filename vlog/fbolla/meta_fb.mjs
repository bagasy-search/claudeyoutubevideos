// Metadata de YouTube para El Constructor Libre (row 59): 1ª línea = el REGALO gratis con ?src=<slug> (la landing salta a la receta
// del video), 2ª = la Colección. Capítulos con los ms REALES de _v3/<slug>_paras.json. → public/<slug>_meta.json
import fs from "node:fs";
const SLUG = "fbolla", R = "D:/Proyectos/video2-wt/fbolla/";
const paras = JSON.parse(fs.readFileSync(R + `_v3/${SLUG}_paras.json`, "utf8"));
const ch = JSON.parse(fs.readFileSync(R + `vlog/${SLUG}/chapters.json`, "utf8"));
const startOf = (i) => { const p = paras[i] ?? paras.find((x) => x.i === i); return (p.ms ?? p.start ?? p.s) / (p.ms ? 1000 : 1); };
const ts = (s) => { s = Math.floor(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const caps = ch.chapters.map(([i, t], k) => `${k === 0 ? "0:00" : ts(startOf(i))} ${t}`).join("\n");
const title = "Mezclá COCA-COLA con PASTA DE DIENTES y Mirá Cómo Queda la Olla Quemada";
const description = `🎁 GRATIS — las 10 mezclas del canal con las medidas exactas (ésta y las otras 9): https://www.constructorlibre.com/regalo?src=${SLUG}
📕 La Colección del Constructor Libre — 76 arreglos caseros con materiales y medidas: https://www.constructorlibre.com/?src=${SLUG}

Gaseosa cola y pasta de dientes para la olla quemada: funciona, pero no en cualquier olla. En el video viral lo hacen en una sartén de teflón, y la pasta se come el antiadherente. El truco es el orden y el material: la gaseosa primero, que ablanda la costra, y la pasta después, que pule. Sólo en acero inoxidable o aluminio.

En este video dejo brillando una olla con el guiso quemado por menos de un dólar:
• La receta completa: gaseosa hasta tapar lo negro, 10 minutos a fuego bajo, media hora enfriando, pasta de dientes en círculos y bicarbonato.
• En qué ollas sí y en cuáles te la arruina (y cómo saber de qué es la tuya).
• Por qué hay que esperar que se enfríe antes de frotar.
• Los 5 errores, y lo que le pasó al vecino con la sartén de los huevos.
• La prueba: servilleta blanca, la uña y un arroz con leche.
• Lo que esto NO arregla y dónde más sirve.

📏 Las medidas exactas están en la página gratis del primer link.

⚠️ Cuidado con la olla caliente: la gaseosa hervida es azúcar y quema. Déjala enfriar antes de tocarla.

Capítulos:
${caps}

Sin música: sólo el trabajo y el sonido de la casa.`;
const out = { title, description, pinned_comment: ch.pinned, tags: ["olla quemada", "limpiar olla quemada", "coca cola y pasta de dientes", "gaseosa cola olla", "pasta de dientes olla", "trucos de cocina", "limpiar acero inoxidable", "trucos caseros", "el constructor libre"] };
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify(out, null, 1));
console.log(caps); console.log(description.length, "chars");
