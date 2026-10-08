// Banco de stills de mecvinagre: componentes NUEVOS (ClMec_mecvinagre) en todos sus modos + REUSADOS con los textos del video. ENTRY=src/index_mekit_mecvinagre.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClRadiator3D, ClTempGauge, ClBubbleTest, ClMixJug, ClHotCap } from "./claudio/ClMec_mecvinagre";
import { ClChapter, ClCheck, ClBookPage, ClQRCard, ClColorCode } from "./claudio/ClCards";
import { ClVideoRef } from "./claudio/ClSarro";
import { ClReceipt } from "./claudio/ClBandeja";
import { ClLogbook } from "./claudio/ClMecanico";
const B = "ref_mecvinagre.png", I = "img/mecvinagre/";
const ROWS = [["03/13", "15.200", "refrig. verde", ""], ["04/15", "41.800", "refrig. verde", ""], ["05/17", "88.300", "refrig. verde", ""], ["…", "…", "…", ""], ["06/19", "251.000", "refrig. verde", ""]];
export const K: [string, React.FC<any>, any][] = [
  ["rad_clean", ClRadiator3D, { mode: "clean", bed: B }], ["rad_scale", ClRadiator3D, { mode: "scale", bed: B }], ["rad_flush", ClRadiator3D, { mode: "flush", bed: B }],
  ["tg_traffic", ClTempGauge, { mode: "traffic", bed: B }], ["tg_fixed", ClTempGauge, { mode: "fixed", bed: B }], ["tg_red", ClTempGauge, { mode: "red", bed: B }],
  ["bt_normal", ClBubbleTest, { mode: "normal", bed: B }], ["bt_gasket", ClBubbleTest, { mode: "gasket", bed: B }], ["bt_crust", ClBubbleTest, { mode: "crust", bed: B }],
  ["mj_mix", ClMixJug, { mode: "mix", bed: B }], ["mj_timer", ClMixJug, { mode: "timer", bed: B }], ["hotcap", ClHotCap, { bed: B }],
  ["log_ern", ClLogbook, { mode: "ernesto", rows: ROWS, tag: "Cada 2 años, el verde", bed: B }], ["log_last", ClLogbook, { mode: "last", rows: ROWS, note: ["La última vez", "siete años atrás"], bed: B }],
  ["log_new", ClLogbook, { mode: "new", elena: ["10/2026 · 280.400", "PCV, f. aire, aceite", "10/2026 · 280.900", "lavado vinagre, verde"], bed: B }],
  ["log_two", ClLogbook, { mode: "two", elena: ["10/2026 · 280.400", "PCV, f. aire, aceite", "10/2026 · 280.900", "lavado vinagre, verde", "¡nunca más manguera!"], bed: B }],
  ["vref_prev", ClVideoRef, { thumb: I + "th_mecmillon.jpg", title: "Hábitos para que tu auto dure 1 millón de km", tag: "VIDEO ANTERIOR", bed: B }],
  ["vref_next", ClVideoRef, { thumb: I + "th_mecbebe.jpg", title: "13 trucos con aceite para bebé", next: true, bed: B }],
  ["book12a", ClBookPage, { page: I + "page12.jpg", pageNo: 12, stamp: "La frase, en la página", bed: B }], ["book12b", ClBookPage, { page: I + "page12.jpg", pageNo: 12, stamp: "Los tiempos, en la página", bed: B }],
  ["qr_gift", ClQRCard, { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DEL TALLER", bed: B }], ["qr_book", ClQRCard, { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "todos los trucos del taller", kicker: "EL MANUAL · US$27", bed: B }],
  ["chk_faros", ClCheck, { title: "La prueba de los faros", items: ["Se apagan al arrancar → batería", "Parpadean andando → otra cosa", "No cambies la batería todavía"], fast: true, bed: B }],
  ["rcpt_pide", ClReceipt, { head: "LO QUE PIDES", lines: [["Vinagre blanco", "1 galón"], ["Agua destilada", "2 galones"], ["Refrigerante", "el de tu auto"]], total: ["Del mismo color", "que el que tiene"], bed: B }],
  ["rcpt_gasto", ClReceipt, { head: "LO QUE GASTÓ ELENA", lines: [["Vinagre blanco", "1-2 dólares"], ["Agua destilada", "otro poco"], ["Refrigerante", "tocaba igual"], ["Una mañana", "de su tiempo"]], total: ["vs. radiador nuevo", "sin comparación"], bed: B }],
  ["chk_taller", ClCheck, { title: "No laves: al taller", items: ["Burbujas que no paran", "Humo blanco con olor dulce", "Aceite café con leche", "Bomba que gotea · ventilador que no prende"], fast: true, bed: B }],
  ["chk_refri", ClCheck, { title: "El refrigerante", items: ["No hierve con el calor", "No se congela con el frío", "No deja oxidar el metal"], fast: true, bed: B }],
  ["chk_vin", ClCheck, { title: "Vinagre: sí, así", items: ["Diluido 1 : 4", "15 a 20 minutos", "Dos enjuagues"], fast: true, bed: B }],
  ["chk_enj", ClCheck, { title: "El enjuague", items: ["Agua destilada sola", "10 minutos andando", "Enfriar y vaciar", "Otra vez: dos enjuagues"], fast: true, bed: B }],
  ["color", ClColorCode, { pick: 3, items: [{ c: "#BFD9E8", name: "Agua sin olor", what: "Aire acondicionado", fix: "Normal" }, { c: "#2A1A0E", name: "Marrón o negro", what: "Aceite", fix: "Mide la varilla" }, { c: "#C9302C", name: "Rojo", what: "Transmisión", fix: "Taller" }, { c: "#46A85A", name: "Verde, rosa o naranja", what: "Refrigerante", fix: "Tu sistema pierde" }], bed: B }],
  ["chapter", ClChapter, { n: 10, title: "Los errores con el vinagre", sub: "los que más veo", alert: true, bed: B }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([, C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="MekitVinagre" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
