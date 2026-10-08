// Banco de stills del ep. 2 (mecllave): componentes NUEVOS + REUSADOS con los textos del video. ENTRY=src/index_mekit2.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClKeyFob3D, ClCarMap, ClBatterySwap, ClRangeMeter, ClPanicWaves, ClDoorUnlock, ClProxStart } from "./claudio/ClMecanico";
import { ClChapter, ClCheck, ClBookPage, ClQRCard, ClDoDont, ClColorCode } from "./claudio/ClCards";
import { ClVideoRef } from "./claudio/ClSarro";
import { ClReceipt } from "./claudio/ClBandeja";
const B = "ref_mecllave.png", I = "img/mecllave/";
export const K: [string, React.FC<any>, any][] = [
  ["bat_id", ClBatterySwap, { mode: "id", bed: B }], ["bat_plus", ClBatterySwap, { mode: "plus", bed: B }], ["bat_edges", ClBatterySwap, { mode: "edges", bed: B }],
  ["range_now", ClRangeMeter, { mode: "now", bed: B }], ["range_cmp", ClRangeMeter, { mode: "compare", bed: B }], ["range_drop", ClRangeMeter, { mode: "drop", bed: B }],
  ["panic_alarm", ClPanicWaves, { mode: "alarm", bed: B }], ["panic_find", ClPanicWaves, { mode: "find", bed: B }],
  ["door_once", ClDoorUnlock, { mode: "once", bed: B }], ["door_twice", ClDoorUnlock, { mode: "twice", bed: B }],
  ["prox_press", ClProxStart, { mode: "press", bed: B }], ["prox_chip", ClProxStart, { mode: "chip", bed: B }], ["prox_key", ClProxStart, { mode: "key", bed: B }],
  ["fob_tease", ClKeyFob3D, { mode: "tease", bed: B }], ["fob_battery", ClKeyFob3D, { mode: "battery", bed: B }], ["fob_range", ClKeyFob3D, { mode: "range", bed: B }],
  ["receipt", ClReceipt, { head: "PRESUPUESTO DE LA AGENCIA", lines: [["Control nuevo", "US$ 30"], ["Programación", "US$ 15"], ["Volver", "el jueves"]], total: ["Total", "US$ 45"], bed: B }],
  ["carmap", ClCarMap, { n: 17, all: true, done: true, bed: B }],
  ["vref_prev", ClVideoRef, { thumb: I + "th_mec99.jpg", title: "Las 17 cosas que tu auto ya trae", tag: "VIDEO ANTERIOR", bed: B }],
  ["vref_next", ClVideoRef, { thumb: I + "th_mecmillon.jpg", title: "Los hábitos de un motor de 1 millón", next: true, bed: B }],
  ["book10", ClBookPage, { page: I + "page10.jpg", pageNo: 10, stamp: "La frase, en la página", bed: B }],
  ["dodont", ClDoDont, { yes: { label: "Moneda o destornillador chico", img: B }, no: { label: "Cuchillo", img: B }, bed: B }],
  ["check1", ClCheck, { title: "Después del cambio", items: ["El código queda guardado", "No hay que programar", "Si no anda: pila al derecho"], fast: true, bed: B }],
  ["check2", ClCheck, { title: "La prueba de la otra llave", items: ["Anda la de repuesto → tu control", "No anda ninguna → el auto", "Nunca es todo la pila"], fast: true, bed: B }],
  ["check3", ClCheck, { title: "Dos cosas distintas", items: ["Pila del control: abrir y cerrar", "Batería del auto: arrancar", "Tablero apagado → la batería"], fast: true, bed: B }],
  ["chapter", ClChapter, { n: 5, title: "El botón rojo", sub: "el que asustaba al estacionamiento", bed: B }],
  ["qrgift", ClQRCard, { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DEL TALLER", bed: B }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([, C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Mekit2" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
