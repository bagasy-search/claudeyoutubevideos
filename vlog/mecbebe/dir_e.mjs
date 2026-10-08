// DIRECTOR E — mecbebe: tomas EXTRA de ritmo (minuto 1 ≥ 33 cortes, planos largos partidos en la frase que se dice; stock donde es
// genérico) + Claudio vuelve a cámara (avatar ~25 %).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { BABY, RAG, GIRL, GH, GAUGE, SIL } from "./dir_a.mjs";
const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const SHOTS = [
  // ── minuto 1
  B(0, "en una esquina", "st_corner", "An ordinary city street corner with cars turning.", { q: "street corner traffic" }),
  B(1, "vio uno de esos videos", "b_girlscreen", `Extreme close view of ${GH} holding a smartphone playing a video of someone wiping a car with a rag.`),
  B(1, "con un frasco rosa", "b_pinkbottle", `Extreme close view of ${BABY} in ${GH} on the hood of ${CAR}.`),
  B(2, "cuando Elena lo sacó de la cochera", "b_elenagate", `${ELENA} opening the green metal gate of ${DRIVE} early in the morning, ${CAR} behind her.`),
  B(3, "y te ahorra dinero", "b_coins", `Close view of ${EH} putting a few coins back into a small purse.`),
  B(3, "pegada en el baúl", "b_trunkwide", `The back of ${CAR} parked in ${DRIVE}, an old dealership sticker on the trunk lid, no legible text.`),
  B(4, "las tres pruebas", "b_flashunder", `Night, a flashlight beam pointing under the front of ${CAR} parked on a cement floor.`),
  B(4, "que tienes que hacer", "b_dash0", "Close view of a car dashboard lit at night, the gauges glowing.", { q: "car dashboard night" }),
  // ── resto
  B(9, "Después abrí las puertas", "b_dooropen2", `Close view of the open rear door of ${CAR}, the black rubber seal around the frame glossy with oil.`),
  B(22, "apoyas el paño sobre el pegamento", "b_ragflat", `Extreme close view of ${RAG} pressed flat on silver car paint by ${H}.`),
  B(28, "algún cromado viejo", "st_chrome", "An old chrome car part with a little rust.", { q: "old car chrome" }),
  B(32, "Pero ojo: eso es una prueba", "b_lightclose", `Extreme close view of the headlight of ${CAR} with an oily shiny streak across it.`),
  B(35, "Elena salió de la cochera marcha atrás", "b_reverselight", `Close view of the reverse light of ${CAR} lit, early morning in ${DRIVE}.`),
  B(37, "Ahora imagina eso mismo en una esquina", "st_rainstreet", "A rainy city street corner with cars.", { q: "rainy street" }),
  B(41, "tampoco en la alfombrilla de goma", "b_mat2", `Low view of the driver's side rubber floor mat of ${CABIN}, glossy.`, { q: "car floor mat", q2: "car mat" }),
  B(49, "Lo bueno es que se saca fácil", "st_bucketsoap", "A bucket of soapy water with a sponge.", { q: "bucket soapy water" }),
  B(60, "Es lo mismo, aceite mineral más espeso", "b_jellyfinger", `Extreme close view of a fingertip with a small dab of clear petroleum jelly, a plain white jar with no label next to it on a workbench.`),
  B(74, "Y para no molestarme", "b_elenadrive", `${ELENA} driving ${CAR} out of ${DRIVE} with a straw beach bag on the passenger seat.`),
  // ── Claudio vuelve a cámara (avatar ~25 %)
  ...[[12, "Nada más"], [14, "Porque el brillo se ve en la cámara el mismo día"], [22, "El aceite se mete por debajo y lo afloja"], [23, "para que no quede aceite sobre la pintura"], [25, "La savia se ablanda y sale"],
      [26, "Con el aceite salen igual que la savia"], [27, "quedas con grasa negra en los dedos"], [28, "y el agua ya no se queda pegada"], [31, "En dos segundos sabes"], [35, "como todos los días"], [40, "Lo mismo que los pedales"],
      [42, "Ya viste el reflejo"], [44, "No se pegan con el frío"], [45, "que con la lluvia se vuelve un manchón"], [47, "Hay quien lo usa para que la goma quede negra"], [62, "El aceite los oscurece un día"], [63, "Ahí tampoco"],
      [70, "En un lugar plano"], [71, "Con el auto apagado"], [13, "Pero esa misma capa es el problema"], [49, "que corta la grasa"], [57, "Un tablero brillante no está más limpio"], [60, "Mismas reglas"], [61, "El aceite mineral lo deja pegajoso"], [67, "pero secas al tacto"], [29, "de estar años debajo de la alfombra del baúl"], [32, "y junta polvo"], [53, "Y al final dijo algo que me gustó"], [65, "Ni una gota adentro"], [44, "y duran años"], [64, "Ése tiene su propio capítulo"], [42, "y si quieres que se vea bien"], [56, "Después de la savia o el pegamento"], [36, "La nieta le había pasado aceite de bebé a los pedales"]]
    .map(([p, a]) => S(p, a, "av", "")),
];
