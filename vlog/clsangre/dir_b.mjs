// DIRECTOR B — clsangre: lo que necesita + paso 1 (agua fría del revés, 1er secreto) + paso 2 (la prueba de la tela) + paso 3 (el
// frasco marrón, 5 min) + paso 4 (apretar, no frotar, 2º secreto) + CTA 2 + paso 5 (lavar en frío) (párr. 22-46).
import { S } from "../claudio/lib.mjs";
import { C, B, CL, ST, G, BROWN, SHEET, STAIN, LAUNDRY, I } from "./dir_a.mjs";
export const SHOTS = [
  // ── lo que necesita
  C(22, "", "ClChapter", { n: 2, label: "LO QUE NECESITA", title: "Pocas cosas", sub: "casi todas en casa" }),
  CL(23, "", "c_kit", `He lays out on a laundry counter in ${LAUNDRY}: ${BROWN}, a folded white cloth and a box of laundry soap, next to a deep sink.`),
  ST(23, "Agua fría", "b_tap2", "cold water faucet", `Cold water running from a faucet.`),
  ST(23, "la del frasco marrón de la farmacia", "b_pharmacy", "brown medicine bottle shelf", `${BROWN} on a shelf.`),
  ST(23, "Y jabón para la ropa", "b_soap", "laundry detergent powder", `Laundry detergent powder in a scoop.`),
  ST(24, "", "b_whitecloth2", "white cotton cloth", `A white cotton cloth.`),
  C(25, "", "ClDoDont", { yes: { label: "Agua fría", img: I + "b_tap2.jpg" }, no: { label: "Agua caliente", img: I + "b_hotwater.jpg" } }),
  ST(25, "ni cloro", "b_bleach", "bleach bottle", `A bleach bottle, plain label.`),
  // ── paso 1: del revés (1er secreto)
  C(26, "", "ClChapter", { n: 1, label: "PASO", title: "Agua fría", sub: "del revés, ya" }),
  ST(26, "Agua fría, del revés", "b_coldflip", "cold water running fabric", `Cold water running over fabric.`),
  S(27, "", "av", ""),
  ST(27, "La sangre fresca es la fácil", "b_fresh", "red stain fabric", `A fresh red stain on fabric.`),
  C(28, "", "ClChapter", { n: 1, label: "SECRETO", title: "Del revés", sub: "por donde entró" }),
  CL(28, "Dé vuelta la tela", "c_flip", `He turns a white sheet inside out over a deep sink in ${LAUNDRY}, the stain facing down.`),
  B(28, "del revés", "b_backrinse", `Close view of cold tap water running through the back of a white cotton sheet where a red blood stain is, pink water dripping.`),
  C(29, "", "ClInsideOut", { hi: 0 }),
  C(29, "Del revés, la empuja para afuera", "ClInsideOut", { hi: 1 }),
  ST(30, "", "b_pinkwater", "pink water sink", `Pinkish water in a sink.`),
  ST(30, "hasta que deje de salir rosada", "b_clearwater", "clear water running sink", `Clear water running into a sink.`),
  // ── paso 2: la prueba de la tela
  C(31, "", "ClChapter", { n: 2, label: "PASO", title: "La prueba", sub: "en un rincón" }),
  CL(32, "", "c_seamtest", `He dabs one drop from ${BROWN} on the hem of a sheet with a fingertip, looking closely, in ${LAUNDRY}.`),
  ST(32, "en el dobladillo", "b_hem", "fabric hem seam closeup", `Close view of a fabric hem.`),
  ST(33, "", "b_whitesheets", "white sheets", `White sheets.`),
  ST(33, "En una tela de color, puede aclararla", "b_colorfabric", "colorful fabric", `Colorful fabric.`),
  C(34, "", "ClDoDont", { yes: { label: "Algodón blanco", img: I + "b_whitesheets.jpg" }, no: { label: "Seda y lana", img: I + "b_silk.jpg" } }),
  ST(34, "Y en seda y en lana, no", "b_silk", "silk fabric", `Silk fabric.`),
  // ── paso 3: el frasco y 5 minutos
  C(35, "", "ClChapter", { n: 3, label: "PASO", title: "El frasco marrón", sub: "cinco minutos" }),
  CL(36, "", "c_pour2", `He pours a little from ${BROWN} onto a red stain on a white sheet laid flat on a counter in ${LAUNDRY}.`, { anim: "he pours and the stain foams" }),
  B(36, "Va a hacer espuma", "b_foam3", `Extreme close view of white foam rising on a red blood stain on white cotton.`),
  C(37, "", "ClTimer30", { minutes: 5, label: "Sin tocar", text: "que haga espuma" }),
  ST(38, "", "b_bubbles2", "foam bubbles closeup", `Foam bubbles close view.`),
  // ── paso 4: apretar, no frotar (2º secreto)
  C(39, "", "ClChapter", { n: 4, label: "PASO", title: "Apriete", sub: "no frote" }),
  CL(40, "", "c_blot", `He presses a folded white cloth flat on a stain on a white sheet on a counter in ${LAUNDRY}, without rubbing.`),
  C(41, "", "ClBlotNoRub", { hi: 0 }),
  C(41, "Apretando, el trapo la chupa hacia arriba", "ClBlotNoRub", { hi: 1 }),
  B(42, "", "b_pinkcloth", `A folded white cloth with a pink blotted mark on it, held up next to a white sheet.`),
  ST(43, "Repita", "b_pourbottle", "hand pouring small bottle", `A hand pouring from a small brown bottle.`),
  B(43, "Hasta que el trapo no saque más color", "b_cleancloth", `A folded white cloth with no mark at all, pressed on a clean white sheet.`),
  // ── CTA 2
  C(44, "La sangre en la página veinte", "ClBookPage", { page: I + "book_p20.jpg", pageNo: 20, stamp: "La sangre" }),
  C(44, "y noventa y cuatro arreglos de la casa", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINAS 7 Y 20", text: "el link está abajo" }),
  // ── paso 5: lavar en frío
  C(45, "", "ClChapter", { n: 5, label: "PASO", title: "Al lavarropas", sub: "en frío" }),
  ST(46, "", "b_washer2", "washing machine sheets", `Sheets in a washing machine.`),
  ST(46, "El programa frío", "b_colddial", "washing machine dial cold", `A washing machine dial set to cold.`),
];
