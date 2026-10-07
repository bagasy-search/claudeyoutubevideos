// Metadata de YouTube para El Constructor Libre (row 59): 1ª línea = el REGALO gratis con ?src=<slug> (la landing salta a la receta
// del video), 2ª = la Colección. Capítulos con los ms REALES de _v3/<slug>_paras.json. → public/<slug>_meta.json
import fs from "node:fs";
const SLUG = "fbporcelanato", R = "D:/Proyectos/video2-wt/fbporcelanato/";
const paras = JSON.parse(fs.readFileSync(R + `_v3/${SLUG}_paras.json`, "utf8"));
const ch = JSON.parse(fs.readFileSync(R + `vlog/${SLUG}/chapters.json`, "utf8"));
const startOf = (i) => { const p = paras[i] ?? paras.find((x) => x.i === i); return (p.ms ?? p.start ?? p.s) / (p.ms ? 1000 : 1); };
const ts = (s) => { s = Math.floor(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const caps = ch.chapters.map(([i, t], k) => `${k === 0 ? "0:00" : ts(startOf(i))} ${t}`).join("\n");
const title = "Mezclá CEMENTO BLANCO con PINTURA y Mirá Cómo Queda: Parece PORCELANATO de $3";
const description = `🎁 GRATIS — las 10 mezclas del canal con las medidas exactas (ésta y las otras 9): https://www.constructorlibre.com/regalo?src=${SLUG}
📕 La Colección del Constructor Libre — 76 arreglos caseros con materiales y medidas: https://www.constructorlibre.com/?src=${SLUG}

Cemento blanco con pintura: el piso liso que parece porcelanato, sin una sola junta. Pero casi todos esperan que la pintura le dé el color, y les queda un pastel lavado. La pintura hace otra cosa (es el pegamento), el color de verdad lo da el óxido de hierro, y el brillo lo hace la llana.

En este video renuevo la galería del fondo por unos 3 dólares de mezcla por metro cuadrado:
• La receta completa: el piso de abajo, la medida, el orden (cemento y pintura primero, el agua después) y las dos capas finitas.
• El paso de la llana que lo "quema" y le da el brillo.
• Por qué la pintura no da el color (tres muestras lado a lado).
• Los 5 errores, y lo que pasó cuando el vecino lo hizo en la entrada del garaje.
• La prueba: silla de hierro, café, lavandina y tacos.
• Dónde NO hacerlo y cuatro lugares donde queda mejor.

📏 Las medidas exactas están en la página gratis del primer link.

Capítulos:
${caps}

Sin música: sólo el trabajo y el sonido de la obra.`;
const out = { title, description, pinned_comment: ch.pinned, tags: ["cemento blanco con pintura", "piso que parece porcelanato", "cemento alisado", "microcemento casero", "piso de cemento pulido", "renovar piso", "mezcla casera", "trucos de albañil", "el constructor libre"] };
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify(out, null, 1));
console.log(caps); console.log(description.length, "chars");
