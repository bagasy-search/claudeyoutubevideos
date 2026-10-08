// Banco de prueba del kit Mecánico (stills locales): componentes NUEVOS (ClMecanico) + REUSADOS con los textos de mec99. ENTRY=src/index_mekit.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClFuelGauge, ClCarMap, ClKeyFob3D, ClChildLock, ClAirFlow, ClTireLabel, ClTread3D } from "./claudio/ClMecanico";
import { ClChapter, ClCheck, ClBookPage, ClQRCard, ClDoDont, ClPins, ClColorCode } from "./claudio/ClCards";
import { ClNotebook, ClVideoRef } from "./claudio/ClSarro";
import { ClReceipt } from "./claudio/ClBandeja";
import { ClNeverMix } from "./claudio/ClScience";
import { ClNameTag, ClStampOv, ClChip } from "./claudio/ClOverlays";
const B = "ref_mec99.png", I = "img/mec99/";
export const K: [string, React.FC<any>, any][] = [
  ["fuel", ClFuelGauge, { side: "left", bed: B }], ["fuelcar", ClFuelGauge, { side: "left", car: true, bed: B }],
  ["map0", ClCarMap, { n: 0, all: true, bed: B }], ["maptab", ClCarMap, { n: 1, zone: "tablero", bed: B }], ["mapbaul", ClCarMap, { n: 10, zone: "baul", bed: B }], ["mapdone", ClCarMap, { n: 17, all: true, done: true, bed: B }],
  ["fobtease", ClKeyFob3D, { mode: "tease", bed: B }], ["fobkey", ClKeyFob3D, { mode: "key", bed: B }], ["fobdead", ClKeyFob3D, { mode: "dead", bed: B }], ["fobwin", ClKeyFob3D, { mode: "windows", bed: B }], ["fobrange", ClKeyFob3D, { mode: "range", bed: B }], ["fobbat", ClKeyFob3D, { mode: "battery", bed: B }],
  ["lockfind", ClChildLock, { mode: "find", bed: B }], ["locklocked", ClChildLock, { mode: "locked", bed: B }], ["lockopen", ClChildLock, { mode: "open", bed: B }],
  ["airrecirc", ClAirFlow, { mode: "recirc", bed: B }], ["airdefog", ClAirFlow, { mode: "defog", bed: B }],
  ["tiredoor", ClTireLabel, { mode: "door", bed: B }], ["tirevs", ClTireLabel, { mode: "versus", bed: B }],
  ["treadbar", ClTread3D, { mode: "bar", bed: B }], ["treadworn", ClTread3D, { mode: "worn", bed: B }], ["treadcoin", ClTread3D, { mode: "coin", bed: B }],
  ["chapter", ClChapter, { n: 1, title: "El auto de Doña Elena", sub: "2012 · 280.000 km", bed: B }], ["chapteralert", ClChapter, { n: 7, title: "Los 5 errores", sub: "los que más veo", alert: true, bed: B }],
  ["check", ClCheck, { title: "Casi todos los traen", items: ["Flecha del tanque", "Traba de niños", "Llave de metal"], fast: true, bed: B }],
  ["check2", ClCheck, { title: "La prueba de los faros", items: ["Se apagan al arrancar → batería", "Parpadean andando → otra cosa", "No cambies la batería todavía"], fast: true, bed: B }],
  ["bookpage", ClBookPage, { page: I + "page9.jpg", pageNo: 9, stamp: "La frase, en la página", bed: B }],
  ["qrgift", ClQRCard, { qr: I + "qr.png", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DEL TALLER", bed: B }],
  ["qrbook", ClQRCard, { qr: I + "qr.png", cover: I + "book_cover.jpg", text: "todos los trucos del taller", kicker: "EL MANUAL · US$27", bed: B }],
  ["receipt", ClReceipt, { head: "PRESUPUESTO DE LA AGENCIA", lines: [["Servicio completo", "US$ 480"], ["4 llantas nuevas", "US$ 520"], ["Llave nueva", "US$ 180"], ["Auto nuevo", "60 cuotas"]], total: ["Total", "US$ 1.180 + cuotas"], bed: B }],
  ["notebook", ClNotebook, { title: "Llantas", rows: [{ k: "Las 4", v: "cada mes" }, { k: "Repuesto", v: "2-3 meses" }, { k: "En frío", v: "mañana" }], mark: "✓", bed: B }],
  ["dodont", ClDoDont, { yes: { label: "Arriba, a la altura de tu cabeza", img: B }, no: { label: "En el cuello", img: B }, bed: B }],
  ["pins", ClPins, { img: B, pins: [{ x: 0.42, y: 0.52, label: "Repuesto" }, { x: 0.72, y: 0.38, label: "Gato" }, { x: 0.24, y: 0.7, label: "Llave de ruedas" }] }],
  ["colorcode", ClColorCode, { pick: 1, items: [{ c: "#E9EEF2", name: "Agua clara", what: "Aire acondicionado", fix: "Normal" }, { c: "#3A2A1A", name: "Marrón o negro", what: "Aceite de motor", fix: "Mide la varilla" }, { c: "#4CAF50", name: "Verde o naranja", what: "Refrigerante", fix: "Al taller" }, { c: "#B23A48", name: "Rojo", what: "Caja o dirección", fix: "Al taller" }], bed: B }],
  ["nevermix", ClNeverMix, { a: "Fusible de 10", b: "uno de 20", verdict: "Nunca", short: true, bed: B }],
  ["videoref", ClVideoRef, { thumb: I + "th_mecllave.jpg", title: "Lo que la agencia te cobra de la llave", next: true, bed: B }],
  ["nametag", ClNameTag, { name: "Claudio", sub: "35 años de mecánico" }], ["stamp", ClStampOv, { text: "8 AÑOS SIN VERLA" }], ["chip", ClChip, { text: "280.000 km" }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([, C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Mekit" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
