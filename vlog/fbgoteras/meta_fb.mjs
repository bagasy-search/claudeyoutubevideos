// Metadata de YouTube para El Constructor Libre (row 59): 1ª línea = el REGALO gratis con ?src=<slug> (la landing salta a la receta
// del video), 2ª = la Colección. Capítulos con los ms REALES de _v3/<slug>_paras.json. → public/<slug>_meta.json
import fs from "node:fs";
const SLUG = "fbgoteras", R = "D:/Proyectos/video2-wt/fbgoteras/";
const paras = JSON.parse(fs.readFileSync(R + `_v3/${SLUG}_paras.json`, "utf8"));
const ch = JSON.parse(fs.readFileSync(R + `vlog/${SLUG}/chapters.json`, "utf8"));
const startOf = (i) => { const p = paras[i] ?? paras.find((x) => x.i === i); return (p.ms ?? p.start ?? p.s) / (p.ms ? 1000 : 1); };
const ts = (s) => { s = Math.floor(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const caps = ch.chapters.map(([i, t], k) => `${k === 0 ? "0:00" : ts(startOf(i))} ${t}`).join("\n");
const title = "Mezclá SILICONA con ACETONA y Mirá Cómo Queda: Sella Goteras por $3";
const description = `🎁 GRATIS — las 10 mezclas del canal con las medidas exactas (ésta y las otras 9): https://www.constructorlibre.com/regalo?src=${SLUG}
📕 La Colección del Constructor Libre — 76 arreglos caseros con materiales y medidas: https://www.constructorlibre.com/?src=${SLUG}

Silicona con acetona para las goteras: funciona, pero casi todos hacen el frasco entero como en el video viral, y a los diez minutos tienen una bola de goma. El truco es que no es una mezcla, son dos: una masilla con acetona para rellenar la grieta, y una versión líquida con aguarrás para pincelar encima.

En este video sello las grietas finas de la terraza por unos 3 dólares:
• La receta completa: limpiar, abrir en V, esperar el sol, la masilla por tramos y las tres manos líquidas.
• Por qué la acetona te arruina el frasco (y el aguarrás no).
• Cómo encontrar por dónde entra el agua de verdad (casi nunca es donde gotea).
• Los 5 errores, y lo que pasó cuando el vecino lo hizo con el techo mojado.
• La prueba: manguera, un charco toda la noche y la uña.
• Lo que esto NO arregla y dónde más sirve.

📏 Las medidas exactas están en la página gratis del primer link.

⚠️ La acetona y el aguarrás son inflamables: al aire libre, con guantes y lejos del fuego. En el techo, con cuidado.

Capítulos:
${caps}

Sin música: sólo el trabajo y el sonido de la obra.`;
const out = { title, description, pinned_comment: ch.pinned, tags: ["silicona con acetona", "sellar goteras", "grietas en el techo", "impermeabilizar techo casero", "silicona con aguarrás", "goteras terraza", "mezcla casera", "trucos caseros", "el constructor libre"] };
fs.writeFileSync(R + `public/${SLUG}_meta.json`, JSON.stringify(out, null, 1));
console.log(caps); console.log(description.length, "chars");
