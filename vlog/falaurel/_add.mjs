import fs from "node:fs";
let s = fs.readFileSync("txt.mjs", "utf8");
const add = (after, arr) => { const re = new RegExp(String.raw`(\n \["${after}",[^\n]*\n)`); if (!re.test(s)) throw new Error("no " + after);
  s = s.replace(re, (m) => m + arr.map(([id,k,t]) => ` ["${id}","${k}","${t}"],\n`).join("")); };
add("s5_15", [["s5_15b","h","Y si quieres regalarlo, es un regalo precioso. Frasquitos chiquitos, oscuros, para tus amigas o tus hermanas."],
 ["s5_15c","d","Con su etiqueta, la fecha, y una tarjetita que diga: primero la prueba del parche. Así la cuidas de verdad."],
 ["s5_15d","h","Porque un aceite regalado sin instrucciones termina en los ojos, o en la cara de alguien con alergia. Y eso no es regalo."]]);
add("s6_05", [["s6_05b","w","Mi nieta me decía: abuela, te vas a quemar la cara con esas cosas de internet. ¡Y casi, eh!"]]);
add("s6_12", [["s6_12b","h","¿Y cómo te sientes ahora, con el espejo? Dime la verdad."],
 ["s6_12c","w","Mejor, doctor. Ya no me tapo la cara con la mano cuando me toman fotos. Eso ya es mucho."]]);
add("s7_03", [["s7_03b","h","Y las manchas que ya tienes, las de muchos años, no se van con nada de la cocina. Ni con limón, ni con bicarbonato, ni con agua oxigenada. Eso irrita, y mancha más."],
 ["s7_03c","h","Lo que sí hace el protector, con constancia, es que no aparezcan nuevas, y que las de ahora no se oscurezcan más. Y eso ya es muchísimo."]]);
add("s7_08", [["s7_08b","h","Y si una mancha de la cara te molesta mucho, eso se habla con un dermatólogo: hay tratamientos de verdad. Pero en casa, primero, el protector."]]);
add("s8_05", [["s8_05b","h","¿Y el aceite de laurel en las manos? Perfecto. De noche, después de lavar los platos, dos o tres gotas en el dorso y en las cutículas."]]);
add("s9_03", [["s9_03b","h","Dormir. En serio, eh: la piel se repara de noche. Si duermes cinco horas, no hay aceite que lo tape."],
 ["s9_03c","h","El dulce. No te digo que no comas pan dulce; te digo que no todos los días. Tanta azúcar tampoco le hace bien a la piel."],
 ["s9_03d","h","Y el agua. No hace milagros, pero una piel deshidratada se ve más marcada. Un vaso al levantarte, y otro en cada comida."]]);
add("s10_02", [["s10_02b","h","El pelo recogido, con una vincha o una toalla, para que no se te pegue el aceite. Y las manos lavadas, y las uñas cortas, para no arañarte."]]);
add("s10_06", [["s10_06b","h","Y un truco para las manos muy secas: aceite, crema encima, y unos guantes de algodón para dormir. Al otro día parecen otras manos."],
 ["s10_06c","h","Y si un día estás cansada y no tienes ganas del masaje, no pasa nada. Pones las gotas y a dormir. Lo que cuenta es la semana, no el día."]]);
add("s11_09", [["s11_09b","h","Novena: '¿Cada cuánto hago un frasco nuevo?' Media taza te dura más o menos un mes y medio. Haz poquito, y más seguido; así siempre está fresco."],
 ["s11_09c","h","Décima: '¿El calor no le quita lo bueno?' Con calor suave, no. Lo que lo arruina es el calor fuerte. Por eso el fuego al mínimo."],
 ["s11_09d","h","Once: '¿Y en las patas de gallo?' Ahí no pongas el aceite, que los ojos se irritan fácil. Si quieres, un toquecito suave con el anular, sin producto, hacia afuera."],
 ["s11_09e","h","Doce: '¿Se lo puedo poner a mi mamá, que tiene noventa?' Sí, con más cuidado todavía: parche primero, y un masaje muy suave, casi una caricia."],
 ["s11_09f","h","Trece: '¿Sirve el laurel que tengo hace años en la alacena?' Si ya no huele a nada, no. Hojas viejas, aceite sin aroma. Compra una bolsita nueva."],
 ["s11_09g","h","Y catorce, de un señor: '¿Me lo puedo poner después de afeitarme?' Mejor al otro día, o de noche. Sobre la piel recién afeitada puede arder."]]);
add("s12_05", [["s12_05b","h","Se confunden porque las hojas se parecen: largas, verdes. Pero el laurel de cocina, seco, huele a guiso. La adelfa no huele a nada de la cocina."]]);
add("s13_06", [["s13_06b","h","Y si te sirvió, compártelo con esa amiga que se hace sus remedios en casa. Que lo haga bien: sin agua, y con la prueba del parche."]]);
fs.writeFileSync("txt.mjs", s);
