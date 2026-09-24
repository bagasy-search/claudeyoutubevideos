import fs from "node:fs";
let s = fs.readFileSync("txt.mjs", "utf8");
const add = (after, arr) => { const re = new RegExp(String.raw`(\n \["${after}",[^\n]*\n)`); if (!re.test(s)) throw new Error("no " + after);
  s = s.replace(re, (m) => m + arr.map(([id,k,t]) => ` ["${id}","${k}","${t}"],\n`).join("")); };
add("s6_08", [["s6_08b","h","Enséñales tu frasco, a ver. ¿Lo trajiste?"],
 ["s6_08c","w","¡Claro! Mire: oscurito, con su fecha, como usted dijo. Y huele a laurel, a cocina de domingo. A mí me encanta."],
 ["s6_08d","h","Perfecto. Transparente, sin puntitos, con fecha. Eso es un frasco bien hecho. Cien por ciento."]]);
add("s7_06", [["s7_06b","h","Y el manejo, eh. La mano izquierda y el lado izquierdo de la cara reciben sol por la ventana del auto. Por eso a muchos se les mancha más un lado."]]);
add("s10_07", [["s10_07b","h","Un detalle práctico: usa una funda de almohada vieja, o de color oscuro. El aceite, aunque sea poquito, a la larga la marca."]]);
add("s11_09g", [["s11_09h","h","Y una que me asustó: '¿Lo puedo tomar?' No. Este aceite es para la piel, por fuera. No se toma, ni en gotas, ni en té."],
 ["s11_09i","h","Y la última, que es la más linda: '¿Ya estoy muy vieja para empezar?' No. Nunca es tarde para cuidarte. A los setenta, a los ochenta, cuando quieras."]]);
add("s13_07", [["s13_07b","h","Mi mamá tiene setenta y ocho. Y te digo algo que aprendí con ella: no le importa verse joven. Le importa verse bien, verse cuidada. Como ella es."],
 ["s13_07c","h","Eso es lo que te deseo a ti también. No pelearte con el espejo. Mirarte, y reconocerte. Y que cuando digas tu edad... te digan: ¿en serio?"]]);
fs.writeFileSync("txt.mjs", s);
