// DIRECTOR A — cons6nd (la plancha que escupe sarro): MINUTO 1 (domingo a la noche, la camisa, el chorro, la aureola → por dentro y por
// fuera) + 400 camisas + 3 anzuelos + CTA 1 (pág. 36) + la cámara de vapor + la piedra + escamas y marrón + la boda de 2009 + el manual +
// el botón + la suela + método uno (párr. 0-22). Avatar = ventanas PAGADAS (_v3/cons6nd_avlock.json, AV_LOCK): acá no van AV().
// Veo d01-d10 = Claudio (broll/cons6nd/dNN.mp4). Seguridad: el manual primero, plancha desenchufada y fría para la suela.
import { S, BI } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const V = (p, at, name) => S(p, at, "cl", name, { p: "veo", veo: 1 });
export const IRON = "a blue and white household steam iron with a stainless steel soleplate";
export const SHIRT = "a white cotton dress shirt";
export const BOARD = "an ironing board with a plain gray cover";
export const HOME = "a modest home with a small laundry corner and a window";
export const IROOM = "a hotel ironing room with several ironing boards, rolling racks of white shirts on hangers and a shelf of irons";
export const ROSA = "Rosa, a hotel ironing room supervisor in her fifties with gray hair in a bun and a light-blue work smock";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
export const RAMIRO = "Don Ramiro, a hotel maintenance chief in his sixties with a gray mustache, a gray work coat and reading glasses in the pocket";
export const DIST = "a clear plastic jug of distilled water with a plain blank label";
export const VIN = "a clear jug of white vinegar with a plain blank label";
export const I = "img/cons6nd/";
export const SHOTS = [
  // ── 0:00 · domingo a la noche (avatar 0-~6)
  B(0, "o una boda, o una entrevista", "b_suit", `A dark suit jacket and a tie laid out on a bed at night, a lamp on, ready for the morning.`),
  B(0, "Usted plancha la camisa blanca", "b_ironing", `${IRON} gliding over ${SHIRT} on ${BOARD} at night, a warm lamp nearby.`, { anim: "the iron glides over the shirt" }),
  B(0, "aprieta el botón del vapor", "b_button", `A thumb pressing the steam button on top of the handle of ${IRON}, close view.`),
  V(0, "y la plancha escupe", "d01"),
  C(0, "Un chorro turbio, con escamitas blancas", "PlSpit"),
  // 16 · lo empeora
  B(1, "una aureola marrón", "b_halo", `Close view of a pale brown water ring stain on the collar of ${SHIRT} on an ironing board.`),
  B(1, "Y la camisa", "b_collarclose", `Extreme close view of a brown water mark on the white collar of a dress shirt.`),
  B(1, "que estaba limpia", "b_hamper", `${SHIRT} with a brown spot on the collar tossed back into a laundry hamper.`),
  B(1, "ahora hay que lavarla de nuevo", "b_washer", `A white dress shirt going back into the drum of a home washing machine at night.`),
  // 24 · promesa
  B(2, "Hoy le dejo la plancha como nueva", "b_newiron", `${IRON} standing on its heel on an ironing board, gleaming, morning light.`),
  B(2, "Por dentro", "b_fillhole", `Close view of the open water fill hole of a steam iron, white crust around its edge.`),
  B(2, "donde se junta la piedra", "b_tankcrust", `Close view through the clear water tank window of a steam iron, white chalky crust stuck inside.`),
  V(2, "y por fuera, en la suela", "d02"),
  // 34 · 400 camisas
  B(3, "Treinta años fui conserje", "b_hotel", `The front of an old city hotel with a canopy over the entrance, evening light.`),
  B(3, "de mantenimiento en un hotel", "b_lobby", `An old hotel lobby with a marble floor, a brass luggage cart and a reception desk, morning light.`),
  B(3, "En el cuarto de planchado", "b_iroom", `${IROOM}, warm overhead light, no people.`),
  B(3, "cuatrocientas camisas por semana", "b_racks", `Long rolling racks packed with hundreds of white shirts on hangers in a hotel basement.`),
  B(3, "Uniformes, camisas de huéspedes, manteles", "b_uniforms", `Hotel staff uniforms, guest shirts and folded white tablecloths stacked on a table in an ironing room.`),
  // 50 · tres cosas
  B(4, "Pero antes de tocarla", "b_unplugged", `${IRON} unplugged, its cord coiled beside it on an ironing board.`),
  B(4, "Por qué escupe, y qué tiene adentro", "b_flakes", `White limescale flakes scattered on the dark cover of an ironing board under a steam iron, close view.`),
  B(4, "Lo que dice el manual de su plancha", "b_manualbox", `A small instruction booklet for an iron lying next to its open cardboard box, no readable text.`),
  B(4, "que casi nadie lee", "b_drawer", `A kitchen drawer full of old appliance instruction booklets and warranty papers.`),
  B(4, "y que le puede salvar la plancha", "b_saved", `A clean steam iron standing on its heel next to its instruction booklet on an ironing board.`),
  // 67 · CTA 1 (pág. 36)
  C(5, "Este arreglo, y los del lavadero", "TbBookTub", { page: I + "book_p36.png", cover: I + "book_cover.png", qr: I + "qr.png", pageNo: 36 }),
  C(5, "El link está en la primera línea", "TbBookTub", { page: I + "book_p36.png", cover: I + "book_cover.png", qr: I + "qr.png", pageNo: 36, skip: 96 }),
  // 85 · la cámara de vapor
  C(7, "La plancha tiene un depósito de agua", "PlCutaway"),
  B(7, "se convierte en vapor", "b_steam", `Steam puffing out from the holes of a hot iron soleplate held above an ironing board, side view.`, { anim: "steam puffs out of the soleplate" }),
  // 99 · la piedra
  B(8, "Calcio, magnesio", "b_tap", `Tap water running from a chrome faucet with white mineral crust around its spout.`),
  B(8, "Cuando el agua se hace vapor, la piedra se queda", "b_kettlecrust", `The inside of an old kettle with white mineral crust, seen through the open lid.`),
  B(8, "Una capita por cada planchada", "b_soleholes", `Extreme close view of the steam holes of an iron soleplate rimmed with white crust.`),
  // 113 · escamas y marrón
  C(9, "mezclada con agua, y cae en la camisa", "PlFlakeCrack"),
  B(9, "Esas son las escamas blancas", "b_flakesshirt", `Tiny white limescale flakes on the dark fabric of a navy shirt on an ironing board, close view.`),
  B(9, "y la mancha sale marrón", "b_brownsole", `The soleplate of a steam iron with brown burnt starch marks, turned up on an ironing board.`),
  // 130 · menos vapor
  B(10, "el vapor sale por los pocos que quedan", "b_weaksteam", `A weak uneven puff of steam from a few holes of an iron soleplate, side view.`, { anim: "a weak puff of steam" }),
  B(10, "y sale de golpe, escupiendo", "b_spurt", `A sudden spurt of cloudy water drops from an iron onto a white sheet on an ironing board.`),
  // 140 · la boda, 2009
  B(11, "Fue en dos mil nueve", "b_terrace", `A hotel rooftop terrace set for a wedding at dusk, string lights, round tables with white cloths.`),
  B(11, "Y le mandó a planchar el uniforme de gala", "b_galauniform", `A white formal hotel manager's jacket with brass buttons hanging on a hook in ${IROOM}.`),
  C(12, "La plancha escupió", "PlUniform"),
  // 169 · lo salvamos
  B(13, "la secamos con el secador de pelo", "b_hairdryer", `A hair dryer blowing on a damp spot of a white jacket on an ironing board.`, { anim: "the fabric flutters in the air" }),
  B(13, "y la plancharon con otra plancha, una limpia", "b_otheriron", `A clean steam iron pressing a white jacket on an ironing board in a hotel ironing room.`),
  B(13, "El gerente dio el discurso sin saber nada", "b_speech", `${MANAGER} in a white jacket speaking at a wedding on a hotel terrace at night, seen from the back of the room.`),
  B(13, "Pero al otro día, Don Ramiro juntó todas", "b_ironsrow", `About twenty old steam irons lined up on a long steel table in a hotel basement workshop.`),
  C(13, "Y en la libreta del gerente quedó anotado", "ClNotebook", { title: "Boda · 2009", rows: [{ k: "Mancha", v: "el pecho" }, { k: "Causa", v: "piedra" }, { k: "Orden", v: "1 vez por mes" }] }),
  // 193 · el manual
  B(14, "Antes de echarle cualquier cosa adentro", "b_jugs", `${VIN} and ${DIST} on a laundry counter beside ${IRON}.`),
  V(14, "Lea el manual", "d03"),
  C(15, "Muchas planchas dicen claramente", "PlManual"),
  B(15, "Y muchas dicen que no le pongan vinagre", "b_novin", `${VIN} pushed aside on a shelf, ${IRON} and ${DIST} in front.`),
  B(16, "no lo use. Así de simple", "b_vinshelf", `${VIN} on the top shelf of a pantry, far from the ironing corner.`),
  B(16, "el fabricante sabe lo que tiene adentro", "b_inside", `A steam iron opened up on a workbench showing its inner parts, a small screwdriver beside it.`),
  B(16, "Le muestro los dos métodos", "b_two", `Two steam irons side by side on an ironing board, one with a steam button marked with a drop symbol.`),
  // 233 · el botón
  C(17, "Suele decir calc clean", "PlCalcButton"),
  B(17, "Es el que diseñó el fabricante", "b_buttonclose", `Close view of a small round self-cleaning button on the back of a steam iron, the symbol a water drop.`),
  // 249 · la suela
  C(18, "Antiadherente, que es oscura y lisa", "PlSoleTypes"),
  B(18, "Eso decide qué le puede pasar por fuera", "b_soleup", `A steam iron resting on its heel with the soleplate turned to the window light, close view.`),
  // 264 · método uno
  B(20, "Enchufe la plancha", "b_plug", `A hand plugging the cord of a steam iron into a wall socket near an ironing board.`),
  B(20, "y espere a que se caliente", "b_light", `The small orange indicator light glowing on top of a steam iron, close view.`),
  B(20, "Cuando se apaga la lucecita, la desenchufa", "b_unplug", `A hand pulling the plug of a steam iron out of a wall socket.`),
  V(21, "con la plancha horizontal, apriete y sostenga", "d05"),
  C(21, "Va a salir vapor y agua sucia por la suela", "PlSelfClean"),
  B(22, "Cuando el depósito se vacía, suelte el botón", "b_emptywin", `The empty clear water tank window of a steam iron, close view.`),
  B(22, "Si salió muy sucia, repítalo una vez más", "b_dirtysink", `Dirty cloudy water with white flakes in the bottom of a white sink.`),
  B(22, "pase la suela todavía tibia sobre un trapo viejo", "b_rag", `A steam iron gliding over an old folded white cotton rag on an ironing board, gray marks left on the rag.`, { anim: "the iron glides over the rag" }),
];
