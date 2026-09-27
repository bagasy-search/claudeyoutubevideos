// tfbpiso — public/tfbpiso_meta.json (título literal de la tarjeta + descripción + comentario fijado) con capítulos
// reales sacados de vlog/tfbpiso/timeline.json (lineAt). Ítems de la guía verificados contra content/oferta.ts
// (76 arreglos, Guía Anti-Humedad, guía exclusiva de herramientas, Hoja de Compras, Fichas de Emergencia, garantía 7 días).
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/tfbpiso/", V = R + "vlog/tfbpiso/";
const T = JSON.parse(fs.readFileSync(V + "timeline.json", "utf8")), at = id => T.lineAt[id].f / 30;
const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const CH = [[0, "El piso viejo y la escoba"], [at("s2_01"), "El proceso completo, de corrido"], [at("s3_01"), "El antes y el después"],
  [at("s3_03"), "¿Aguanta o se despega?"], [at("s3_08"), "La proporción exacta"], [at("s3b_01"), "¿Cuándo se pisa? ¿La escoba lo raya?"],
  [at("s4_01"), "Cuándo NO sirve este arreglo"], [at("s4b_01"), "Materiales y herramientas"], [at("s5_02"), "La ficha completa"],
  [at("s6_01"), "Picar y limpiar bien"], [at("s6_09"), "Guías y pendiente"], [at("s7_01"), "Las mezclas (y el error nº 2)"],
  [at("s8_01"), "Lechada, carpeta, regla y fratás"], [at("s9_01"), "La escoba en su punto y las juntas"], [at("s10_01"), "El curado"],
  [at("s10_04"), "El paso que casi todos se saltean"], [at("s11_01"), "La prueba del vecino"]];
const GUIA = "🔧 LA COLECCIÓN DEL CONSTRUCTOR LIBRE — 76 arreglos caseros numerados, con materiales y medidas, + la Guía Anti-Humedad, Moho y Goteras + una guía exclusiva de herramientas + la Hoja de Compras Maestra y las Fichas de Emergencia. Pago único · garantía de 7 días · te llega al correo al terminar la compra.\n👉 https://constructorlibre.com/?src=tfb-piso";
const TRUCO = "EL TRUCO QUE MENCIONÉ EN EL VIDEO → el patio de COLOR, sin pintura encima.\nUsa óxido de hierro en polvo (el pigmento para cemento) y mézclalo EN SECO con el cemento, antes de sumar la arena y el agua, hasta que el polvo quede de un solo color.\nLa medida: la que indique el envase del pigmento, calculada sobre el peso del CEMENTO (no de toda la mezcla), y exactamente la MISMA en cada tanda: pésala o usa siempre el mismo vaso medidor, porque un poco más o un poco menos cambia el tono y se notan los parches.\nAntes, haz una tanda de prueba en un cartón y déjala secar un día: el color seco queda bastante más claro que el húmedo.";
const CUERPO = `Tu piso viejo de cemento está rajado, gastado y suelta polvo cada vez que lo barres. En este video lo renuevo en mi patio con cemento, arena, un poco de cola vinílica y una escoba, de principio a fin, y te explico por qué no se despega:

• El proceso completo: picar lo flojo, lavar, mojar el piso viejo, la lechada de cemento con cola, la carpeta 1 de cemento por 3 de arena, regla, fratás, la escoba en el punto justo, las juntas y el curado húmedo.
• Por qué el "cemento con agua solo" se hace polvo y salta en placas, y qué es lo que sí aguanta.
• El error nº 2: la lechada que se seca antes de la carpeta (y cómo trabajar fresca sobre fresca).
• Cómo saber el punto de la escoba con el dedo, y por qué el rayado es lo que te cuida de resbalar.
• El paso que casi todos se saltean, al principio del trabajo, y la prueba de la gota para saber si tu piso va a agarrar.

«En una hora» es la aplicación de un patio chico. El curado lleva días: se mantiene húmedo y no se pisa hasta que está duro (el envase de tu cemento te dice los tiempos).

⚠️ Este arreglo NO es para un piso con humedad que sube desde abajo (manchas que no secan, salitre), con grietas que se abren o en escalera, o que se hunde: eso viene de la base y hay que resolver la causa primero. Sobre cerámica esmaltada la lechada no agarra bien. Y el cemento fresco es cáustico: guantes, botas y gafas.`;
const chapters = CH.map(([s, t]) => `${mmss(s)} ${t}`).join("\n");
const description = `${GUIA}\n\n${TRUCO}\n\n${CUERPO}\n\nCAPÍTULOS\n${chapters}\n\n#pisodecemento #bricolaje #arreglosdecasa #constructorlibre`;
const pinned_comment = `${GUIA}\n\n${TRUCO}`;
const meta = { title: "Cómo RENOVAR un Piso Viejo en Una Hora con CEMENTO y una ESCOBA", description, pinned_comment };
fs.writeFileSync(R + "public/tfbpiso_meta.json", JSON.stringify(meta, null, 1));
console.log(description.length, "car ·", chapters);
