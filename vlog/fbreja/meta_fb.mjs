// Metadata de YouTube para El Constructor Libre (row 59): 1ª línea = el REGALO gratis con ?src=<slug> (la landing salta a la receta
// del video), 2ª = la Colección. Capítulos con los ms REALES de _v3/<slug>_paras.json. → public/<slug>_meta.json
import fs from "node:fs";
const SLUG = "fbreja", R = "D:/Proyectos/video2-wt/fbreja/";
const paras = JSON.parse(fs.readFileSync(R + `_v3/${SLUG}_paras.json`, "utf8"));
const ch = JSON.parse(fs.readFileSync(R + `vlog/${SLUG}/chapters.json`, "utf8"));
const startOf = (i) => { const p = paras[i] ?? paras.find((x) => x.i === i); return (p.ms ?? p.start ?? p.s) / (p.ms ? 1000 : 1); };
const ts = (s) => { s = Math.floor(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const caps = ch.chapters.map(([i, t], k) => `${k === 0 ? "0:00" : ts(startOf(i))} ${t}`).join("\n");
const title = "Mezclá WD-40 con PINTURA y Mirá Cómo Queda la Reja: No Se Oxida Más";
const description = `🎁 GRATIS — las 10 mezclas del canal con las medidas exactas (ésta y las otras 9): https://www.constructorlibre.com/regalo?src=${SLUG}
📕 La Colección del Constructor Libre — 76 arreglos caseros con materiales y medidas: https://www.constructorlibre.com/?src=${SLUG}

Aflojatodo con pintura para la reja oxidada: funciona, pero casi todos lo ponen en el lugar equivocado. En el video viral lo mezclan ADENTRO del tarro, y la pintura queda aceitosa, no seca y se pela al primer invierno. El truco es el orden: el aflojatodo trabaja ANTES, para soltar el óxido, y después tiene que desaparecer para que la pintura agarre.

En este video dejo la reja del frente como nueva por unos 15 dólares:
• La receta completa: aflojatodo, 10 minutos, cepillo, alcohol, fondo antióxido y dos manos finas de esmalte.
• Por qué el aflojatodo adentro de la pintura te la arruina (la prueba de las dos chapas).
• Por qué dos manos finitas duran más que una gruesa.
• Los 5 errores, y lo que pasó cuando el vecino lo hizo como en el video viral.
• La prueba: cuadrícula y cinta, la llave y una semana de manguera.
• Lo que esto NO arregla y dónde más sirve.

📏 Las medidas exactas están en la página gratis del primer link.

⚠️ El aflojatodo, el alcohol y las pinturas son inflamables: al aire libre, lejos del fuego, con guantes y lentes para el cepillo de alambre.

Capítulos:
${caps}

Sin música: sólo el trabajo y el sonido de la obra.`;
const out = { title, description, pinned_comment: ch.pinned, tags: ["reja oxidada", "pintar reja", "aflojatodo y pintura", "wd40 y pintura", "quitar oxido reja", "fondo antioxido", "pintar hierro", "trucos caseros", "el constructor libre"] };
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify(out, null, 1));
console.log(caps); console.log(description.length, "chars");
