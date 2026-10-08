// DIRECTOR D — jpviejo: cortes extra del minuto 1 (≥33) + partir los tramos largos de avatar del final.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
export const SHOTS = [
  S(0, "Y todos lo huelen menos tú", "av", ""),
  S(1, "En el hotel de Tokio", "bi", "b_hotelext", { q: "tokyo hotel building", p: BI("The entrance of a modest business hotel on a Tokyo side street in the early morning, a small lit sign with no readable text, bicycles parked.") }),
  S(1, "una mañana", "bi", "b_room0", { p: BI(`Morning light falling on the floor of a quiet room of ${HOTEL}, a housekeeping cart at the open door.`) }),
  S(1, "de una habitación recién limpiada", "bi", "b_madebed", { q: "hotel bed made", p: BI("A hotel bed made perfectly tight with white sheets, four white pillows stacked at the head, a folded throw at the foot.") }),
  S(2, "Ése es el problema", "av", ""),
  S(2, "este olor no se va con más ducha", "bi", "b_shower2", { q: "shower running", p: BI(`Water running from a chrome shower head in ${BATH}, steam on the glass.`) }),
  S(3, "es la que casi todos rompemos", "bi", "b_neckspray", { p: BI("Close view of a cologne bottle with a blank label spraying a mist toward the side of a man's neck and collar.") }),
  S(3, "las once reglas", "bi", "b_eleven", { p: BI("A neat row of eleven small folded white hand towels lined up on a long light-wood shelf in a bright bathroom.") }),
  S(4, "en un hotel de Tokio", "bi", "b_tokyonight", { q: "tokyo street morning", p: BI("A quiet Tokyo street with small buildings and overhead wires in soft morning light, a man in a dark jacket walking away.") }),
  S(4, "sábanas y toallas", "bi", "b_sheets", { q: "folding white sheets", p: BI("Hands folding a crisp white bed sheet on a laundry table in a hotel linen room.") }),
  S(4, "de cinco minutos", "bi", "b_timer5", { q: "kitchen timer", p: BI("A simple white kitchen timer set to five minutes on a light-wood table next to a pillow and a folded towel.") }),
  S(5, "porque hoy vamos con lo que te prometí al final", "bi", "b_napetease", { p: BI("The back of the neck and ear of a man in his fifties with short gray hair, seen from behind in soft daylight.") }),
  // tramos largos de avatar al final
  S(65, "Una hora", "bi", "b_clock1h", { p: BI(`A wall clock in a room of ${HOTEL} with the window wide open behind it, the bed stripped.`) }),
  S(65, "Así entraba el siguiente", "bi", "b_newguest", { p: BI(`A guest with a small suitcase stepping into a fresh, bright room of ${HOTEL}, the window just closed, the bed perfectly made.`) }),
  S(66, "", "av", ""),
  S(66, "En Japón hasta hay una palabra", "bi", "b_jpoffice2", { q: "japanese office meeting", p: BI("Two Japanese office workers talking calmly face to face in a small meeting room, polite posture, a window behind.") }),
  S(66, "Nosotros no tenemos palabra para eso", "av", ""),
  S(66, "y es el que menos te lo va a decir", "bi", "b_hands", { p: BI(`An older Latin American couple holding hands on a sofa in ${HOUSE}, seen from close, warm daylight.`) }),
  S(67, "si tienes un problema de la piel", "bi", "b_soapshelf", { p: BI(`A plain bar of soap, a pillowcase and a box of baking soda on a light-wood shelf in ${BATH}.`) }),
  S(67, "Esto es higiene, no un tratamiento", "av", "", { ov: { c: "ClChip", props: { text: "consulta a un médico" } } }),
];
