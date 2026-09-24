import fs from "node:fs";
let s = fs.readFileSync("txt.mjs", "utf8");
const add = (after, arr) => { const re = new RegExp(String.raw`(\n \["${after}",[^\n]*\n)`); if (!re.test(s)) throw new Error("no " + after);
  s = s.replace(re, (m) => m + arr.map(([id,k,t]) => ` ["${id}","${k}","${t}"],\n`).join("")); };
add("s5_04", [["s5_04b","h","Yo, la verdad, tengo los dos andando. Uno rápido para usar ya, y uno lento guardado, que va a estar listo cuando se me acabe el otro."]]);
add("s8_04", [["s8_04b","d","La crema, bien metida entre los dedos y en los nudillos. Ahí es donde la piel se agrieta primero."]]);
add("s9_09", [["s9_09b","h","Y fíjate que yo te dije desde el principio lo que el laurel no hace. No borra arrugas, no aclara manchas, no fabrica colágeno. Y aun así vale la pena. ¿Por qué?"],
 ["s9_09c","h","Porque una piel hidratada, masajeada y protegida del sol se ve distinta. Más viva. Y eso, a los setenta, la gente lo nota."]]);
add("s12_08", [["s12_08b","h","Y fíjate en la bolsita: que diga laurel, hojas de laurel, nada más. Nada de mezclas con otras cosas, ni sabores, ni sal."]]);
fs.writeFileSync("txt.mjs", s);
