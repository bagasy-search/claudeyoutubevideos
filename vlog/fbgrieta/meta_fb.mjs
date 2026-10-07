// Metadata de YouTube para El Constructor Libre (row 59): 1ª línea = el REGALO gratis con ?src=<slug> (la landing salta a la receta
// del video), 2ª = la Colección. Capítulos con los ms REALES de _v3/<slug>_paras.json. → public/<slug>_meta.json
import fs from "node:fs";
const SLUG = "fbgrieta", R = "D:/Proyectos/video2-wt/fbgrieta/";
const paras = JSON.parse(fs.readFileSync(R + `_v3/${SLUG}_paras.json`, "utf8"));
const ch = JSON.parse(fs.readFileSync(R + `vlog/${SLUG}/chapters.json`, "utf8"));
const startOf = (i) => { const p = paras[i] ?? paras.find((x) => x.i === i); return (p.ms ?? p.start ?? p.s) / (p.ms ? 1000 : 1); };
const ts = (s) => { s = Math.floor(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const caps = ch.chapters.map(([i, t], k) => `${k === 0 ? "0:00" : ts(startOf(i))} ${t}`).join("\n");
const title = "Mezclá SILICONA con CEMENTO y Mirá Cómo Queda: La Grieta No Vuelve Nunca Más";
const description = `🎁 GRATIS — las 10 mezclas del canal con las medidas exactas (ésta y las otras 9): https://www.constructorlibre.com/regalo?src=${SLUG}
📕 La Colección del Constructor Libre — 76 arreglos caseros con materiales y medidas: https://www.constructorlibre.com/?src=${SLUG}

Silicona con cemento para la grieta de la pared que vuelve siempre: funciona, porque estira con la pared en vez de rajarse como el yeso o el enduido. Pero en el video viral la pintan encima, y al mes la grieta aparece otra vez como una raya brillante. La silicona no se pinta: si tu pared se pinta, usa sellador acrílico pintable con la misma mezcla.

En este video tapo la grieta que volvía cada invierno por menos de tres dólares:
• La receta completa: abrir en V, soplar, humedecer, silicona y cemento mitad y mitad, alisar y 48 horas.
• Por qué no se pinta encima, y cuándo usar el acrílico pintable.
• Por qué el yeso y el enduido se vuelven a rajar.
• Los 5 errores, y lo que pasó cuando el vecino la pintó a la tarde.
• La prueba: el pulgar, el testigo de yeso y un invierno entero.
• Qué grietas NO se tapan (y hay que hacer ver) y dónde más sirve.

📏 Las medidas exactas están en la página gratis del primer link.

⚠️ Si la grieta sale en diagonal desde una ventana o una puerta, se abre más de 3 mm o está creciendo, no la tapes: que la vea un profesional. La silicona acética larga olor a vinagre: trabaja con la ventana abierta y guantes.

Capítulos:
${caps}

Sin música: sólo el trabajo y el sonido de la obra.`;
const out = { title, description, pinned_comment: ch.pinned, tags: ["grieta en la pared", "silicona con cemento", "tapar grietas", "grietas que vuelven", "masilla casera", "reparar pared", "fisuras pared", "trucos caseros", "el constructor libre"] };
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify(out, null, 1));
console.log(caps); console.log(description.length, "chars");
