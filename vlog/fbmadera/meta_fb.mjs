// Metadata de YouTube para El Constructor Libre (row 59): 1ª línea = el REGALO gratis con ?src=<slug> (la landing salta a la receta
// del video), 2ª = la Colección. Capítulos con los ms REALES de _v3/<slug>_paras.json. → public/<slug>_meta.json
import fs from "node:fs";
const SLUG = "fbmadera", R = "D:/Proyectos/video2-wt/fbmadera/";
const paras = JSON.parse(fs.readFileSync(R + `_v3/${SLUG}_paras.json`, "utf8"));
const ch = JSON.parse(fs.readFileSync(R + `vlog/${SLUG}/chapters.json`, "utf8"));
const startOf = (i) => { const p = paras[i] ?? paras.find((x) => x.i === i); return (p.ms ?? p.start ?? p.s) / (p.ms ? 1000 : 1); };
const ts = (s) => { s = Math.floor(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const caps = ch.chapters.map(([i, t], k) => `${k === 0 ? "0:00" : ts(startOf(i))} ${t}`).join("\n");
const title = "Mezclá VELA con ACEITE DE MOTOR USADO y Mirá Cómo Queda la Madera: No Se Pudre Nunca Más";
const description = `🎁 GRATIS — las 10 mezclas del canal con las medidas exactas (ésta y las otras 9): https://www.constructorlibre.com/regalo?src=${SLUG}
📕 La Colección del Constructor Libre — 76 arreglos caseros con materiales y medidas: https://www.constructorlibre.com/?src=${SLUG}

Vela con aceite de motor usado: el truco viejo del campo para que el poste no se pudra en la tierra. Funciona, pero casi todos lo hacen mal: lo pincelan sobre madera mojada, la cera encierra la humedad adentro, y el poste se pudre igual, escondido.

En este video protejo los postes del cerco por menos de 2 dólares:
• La receta completa: colar el aceite, la medida, baño María (nunca fuego directo) y dónde insistir.
• Por qué en madera mojada no sirve (corto un poste al medio para mostrarte).
• Los 5 errores, y lo que pasó cuando el vecino lo calentó en la hornalla.
• La prueba: estacas enterradas un verano entero y tablitas una noche bajo el agua.
• Dónde NO usarlo nunca (huerta, gallinero, juegos, pozo) y la versión con aceite de lino.
• Cómo clavar el poste para que no se junte el agua.

📏 Las medidas exactas y la versión segura para la huerta están en la página gratis del primer link.

⚠️ La parafina y el aceite son inflamables: siempre a baño María, al aire libre y con guantes.

Capítulos:
${caps}

Sin música: sólo el trabajo y el sonido del taller.`;
const out = { title, description, pinned_comment: ch.pinned, tags: ["vela y aceite de motor", "madera que no se pudre", "proteger postes de madera", "aceite quemado madera", "postes de cerco", "mezcla casera", "trucos caseros", "construcción casera", "el constructor libre"] };
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify(out, null, 1));
console.log(caps); console.log(description.length, "chars");
