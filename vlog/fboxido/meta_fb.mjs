// Metadata de YouTube para El Constructor Libre (row 59): 1ª línea = el REGALO gratis con ?src=<slug> (la landing salta a la receta
// del video), 2ª = la Colección. Capítulos con los ms REALES de _v3/<slug>_paras.json. → public/<slug>_meta.json
import fs from "node:fs";
const SLUG = "fboxido", R = "D:/Proyectos/video2-wt/fboxido/";
const paras = JSON.parse(fs.readFileSync(R + `_v3/${SLUG}_paras.json`, "utf8"));
const ch = JSON.parse(fs.readFileSync(R + `vlog/${SLUG}/chapters.json`, "utf8"));
const startOf = (i) => { const p = paras[i] ?? paras.find((x) => x.i === i); return (p.ms ?? p.start ?? p.s) / (p.ms ? 1000 : 1); };
const ts = (s) => { s = Math.floor(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const caps = ch.chapters.map(([i, t], k) => `${k === 0 ? "0:00" : ts(startOf(i))} ${t}`).join("\n");
const title = "Gel QUITA-ÓXIDO Casero con Solo 2 Ingredientes: Como un Milagro";
const description = `🎁 GRATIS — las 10 mezclas del canal con las medidas exactas (ésta y las otras 9): https://www.constructorlibre.com/regalo?src=${SLUG}
📕 La Colección del Constructor Libre — 76 arreglos caseros con materiales y medidas: https://www.constructorlibre.com/?src=${SLUG}

El gel quita-óxido casero de vinagre y harina: funciona, y saca el óxido de las herramientas sin lijar. Pero el video viral corta cuando la herramienta sale brillante, y al otro día está naranja otra vez. El metal recién limpio y mojado con ácido es lo más fácil de oxidar que hay: el trabajo termina cuando está neutralizada, seca y aceitada.

En este video dejo como nuevas las herramientas oxidadas del galpón por menos de un dólar:
• La receta completa: vinagre, harina y una pizca de sal al fuego hasta engrudo, untar grueso, film y de 2 a 12 horas.
• El final que no te puedes saltar: bicarbonato, calor y aceite.
• Por qué tiene que ser gel y no vinagre solo.
• Los 5 errores, y lo que pasó cuando el vecino dejó las herramientas en la pileta.
• La prueba: una semana en el galpón húmedo, la servilleta y las gotas.
• Lo que esto NO arregla y dónde más sirve.

📏 Las medidas exactas están en la página gratis del primer link.

⚠️ Usa una olla que no vuelvas a usar para cocinar, ventila mientras calientas el vinagre y usa guantes. No lo apliques sobre piezas cromadas o pintadas que quieras conservar.

Capítulos:
${caps}

Sin música: sólo el trabajo y el sonido del taller.`;
const out = { title, description, pinned_comment: ch.pinned, tags: ["quitar oxido", "gel quita oxido casero", "vinagre y harina oxido", "herramientas oxidadas", "quitar oxido herramientas", "removedor de oxido casero", "trucos caseros", "el constructor libre"] };
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify(out, null, 1));
console.log(caps); console.log(description.length, "chars");
