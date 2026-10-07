// Metadata de YouTube para El Constructor Libre (row 59): 1ª línea = el REGALO gratis con ?src=<slug> (la landing salta a la receta
// del video), 2ª = la Colección. Capítulos con los ms REALES de _v3/<slug>_paras.json. → public/<slug>_meta.json
import fs from "node:fs";
const SLUG = "fbpiedra", R = "D:/Proyectos/video2-wt/fbpiedra/";
const paras = JSON.parse(fs.readFileSync(R + `_v3/${SLUG}_paras.json`, "utf8"));
const ch = JSON.parse(fs.readFileSync(R + `vlog/${SLUG}/chapters.json`, "utf8"));
const startOf = (i) => { const p = paras[i] ?? paras.find((x) => x.i === i); return (p.ms ?? p.start ?? p.s) / (p.ms ? 1000 : 1); };
const ts = (s) => { s = Math.floor(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const caps = ch.chapters.map(([i, t], k) => `${k === 0 ? "0:00" : ts(startOf(i))} ${t}`).join("\n");
const title = "Herví CEMENTO y Mirá Cómo Quedó: Parece PIEDRA de Río de $1";
const description = `🎁 GRATIS — las 10 mezclas del canal con las medidas exactas (ésta y las otras 9): https://www.constructorlibre.com/regalo?src=${SLUG}
📕 La Colección del Constructor Libre — 76 arreglos caseros con materiales y medidas: https://www.constructorlibre.com/?src=${SLUG}

Piedras de cemento que parecen de río, hechas con globos y un baño de agua caliente: funciona, porque el calor acelera el endurecido del cemento y quedan duras en horas, no en semanas. Pero en el video viral las hierven a borbotones, y el hervor fuerte las raja por dentro: salen lindas y se parten a la semana. El agua tiene que humear, no hervir.

En este video hago el borde del cantero con una docena de piedras por un dólar de cemento:
• La receta completa: 1 de cemento y 2 de arena fina, el globo, 24 horas en arena, agua a 60-70 °C de 2 a 3 horas, lija al agua y cera.
• Por qué el hervor fuerte las raja por dentro.
• Por qué el agua caliente las endurece en horas y no en semanas.
• Los 5 errores, y lo que pasó cuando el vecino las hirvió a borbotones.
• La prueba: la caída, el choque y un invierno entero.
• Lo que esto NO arregla y dónde más sirve.

📏 Las medidas exactas están en la página gratis del primer link.

⚠️ Son piedras decorativas: no las uses para muros ni nada que cargue peso, y nunca alrededor del fuego o la parrilla (el cemento con calor fuerte puede saltar). Usa una olla vieja que no vuelvas a usar para cocinar.

Capítulos:
${caps}

Sin música: sólo el trabajo y el sonido del patio.`;
const out = { title, description, pinned_comment: ch.pinned, tags: ["piedras de cemento", "hervir cemento", "piedra de rio casera", "manualidades con cemento", "borde de cantero", "decoracion jardin cemento", "trucos caseros", "el constructor libre"] };
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify(out, null, 1));
console.log(caps); console.log(description.length, "chars");
