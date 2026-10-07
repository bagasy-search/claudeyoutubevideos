// Metadata de YouTube para El Constructor Libre (row 59): 1ª línea = el REGALO gratis con ?src=<slug> (la landing salta a la receta
// del video), 2ª = la Colección. Capítulos con los ms REALES de _v3/<slug>_paras.json. → public/<slug>_meta.json
import fs from "node:fs";
const SLUG = "fbimpermeable", R = "D:/Proyectos/video2-wt/fbimpermeable/";
const paras = JSON.parse(fs.readFileSync(R + `_v3/${SLUG}_paras.json`, "utf8"));
const ch = JSON.parse(fs.readFileSync(R + `vlog/${SLUG}/chapters.json`, "utf8"));
const startOf = (i) => { const p = paras[i] ?? paras.find((x) => x.i === i); return (p.ms ?? p.start ?? p.s) / (p.ms ? 1000 : 1); };
const ts = (s) => { s = Math.floor(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const caps = ch.chapters.map(([i, t], k) => `${k === 0 ? "0:00" : ts(startOf(i))} ${t}`).join("\n");
const title = "Mezclá COLA BLANCA con ACEITE y Mirá Cómo Queda (Lo Probé con la Manguera)";
const description = `🎁 GRATIS — las 10 mezclas del canal con las medidas exactas (ésta y las otras 9): https://www.constructorlibre.com/regalo?src=${SLUG}
📕 La Colección del Constructor Libre — 76 arreglos caseros con materiales y medidas: https://www.constructorlibre.com/?src=${SLUG}

Cola blanca con aceite para impermeabilizar: lo probé con la manguera, y no aguanta. La cola y el aceite no se mezclan (se separan en el frasco), y la cola blanca común se ablanda con el agua: es fondo, no terminación. Pero con esos mismos dos frascos, usados por separado, hay dos cosas que sí funcionan.

En este video te muestro lo que pasó de verdad y lo que sí protege la madera por menos de dos dólares:
• La prueba de la mezcla viral: el frasco separado y la tabla blanca como leche.
• Lo que sí funciona: cola rebajada 1 a 3 como fondo antes de pintar, y aceite de lino cocido para la madera de afuera.
• Por qué el aceite de cocina no sirve y el de lino sí.
• Los 5 errores, y lo que le pasó al banco del vecino.
• La prueba: la uña, la gota, la manguera y una noche de lluvia.
• Lo que esto NO arregla (techos y paredes con humedad) y dónde más sirve.

📏 Las medidas exactas están en la página gratis del primer link.

⚠️ Los trapos con aceite de lino pueden prenderse fuego solos si quedan hechos un bollo: estíralos al aire libre o déjalos en un balde con agua.

Capítulos:
${caps}

Sin música: sólo el trabajo y el sonido del patio.`;
const out = { title, description, pinned_comment: ch.pinned, tags: ["cola blanca y aceite", "impermeabilizar madera", "aceite de lino cocido", "impermeabilizante casero", "proteger madera exterior", "fondo sellador casero", "trucos caseros", "el constructor libre"] };
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify(out, null, 1));
console.log(caps); console.log(description.length, "chars");
