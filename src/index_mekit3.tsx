// Banco de stills del ep. 3 (mecmillon): componentes NUEVOS + REUSADOS con los textos del video. ENTRY=src/index_mekit3.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClPCV3D, ClEnginePressure, ClSevereChart, ClColdStart, ClFilterLight, ClLogbook } from "./claudio/ClMecanico";
import { ClChapter, ClCheck, ClBookPage, ClQRCard, ClColorCode } from "./claudio/ClCards";
import { ClVideoRef } from "./claudio/ClSarro";
import { ClReceipt } from "./claudio/ClBandeja";
const B = "ref_mecmillon.png", I = "img/mecmillon/";
export const K: [string, React.FC<any>, any][] = [
  ["pcv_intro", ClPCV3D, { mode: "intro", bed: B }], ["pcv_rattle", ClPCV3D, { mode: "rattle", bed: B }], ["pcv_stuck", ClPCV3D, { mode: "stuck", bed: B }],
  ["eng_flow", ClEnginePressure, { mode: "flow", bed: B }], ["eng_blocked", ClEnginePressure, { mode: "blocked", bed: B }], ["eng_leak", ClEnginePressure, { mode: "leak", bed: B }],
  ["sev_table", ClSevereChart, { mode: "table", bed: B }], ["sev_trips", ClSevereChart, { mode: "trips", bed: B }],
  ["cold_wait", ClColdStart, { mode: "wait", bed: B }], ["cold_gentle", ClColdStart, { mode: "gentle", bed: B }],
  ["filt_check", ClFilterLight, { mode: "check", bed: B }], ["filt_cmp", ClFilterLight, { mode: "compare", bed: B }],
  ["log_ern", ClLogbook, { mode: "ernesto", bed: B }], ["log_last", ClLogbook, { mode: "last", bed: B }], ["log_gap", ClLogbook, { mode: "gap", bed: B }], ["log_new", ClLogbook, { mode: "new", bed: B }], ["log_two", ClLogbook, { mode: "two", bed: B }], ["log_cons", ClLogbook, { mode: "consume", bed: B }],
  ["vref_prev", ClVideoRef, { thumb: I + "th_mecllave.jpg", title: "Lo que la agencia te cobra de la llave", tag: "VIDEO ANTERIOR", bed: B }],
  ["vref_next", ClVideoRef, { thumb: I + "th_mecvinagre.jpg", title: "El truco de vinagre de 1 dólar", next: true, bed: B }],
  ["book11", ClBookPage, { page: I + "page11.jpg", pageNo: 11, stamp: "La frase, en la página", bed: B }],
  ["rcpt_list", ClReceipt, { head: "LA LISTA DE ELENA", lines: [["Aceite sintético", "el del manual"], ["Filtro de aceite", "1"], ["Filtro de aire", "1"], ["Válvula PCV", "1"]], total: ["Para", "marca · modelo · año · motor"], bed: B }],
  ["rcpt_spent", ClReceipt, { head: "LO QUE GASTÓ ELENA", lines: [["Válvula PCV", "US$ 7"], ["Manguerita", "US$ 4"], ["Filtro de aire", "US$ 6"], ["Aceite y filtro", "lo de siempre"]], total: ["vs. 1ª revisión de la agencia", "menos"], bed: B }],
  ["chk_pcv", ClCheck, { title: "La válvula PCV", items: ["Revisar cada 2-3 cambios de aceite", "Sacudir: tiene que sonar", "Manguera dura → cambiarla"], fast: true, bed: B }],
  ["chk_refri", ClCheck, { title: "El refrigerante", items: ["Mirarlo con el motor frío", "Entre las dos marcas", "Nunca abrir caliente"], fast: true, bed: B }],
  ["oilcolor", ClColorCode, { pick: 0, items: [{ c: "#C8902E", name: "Ámbar o marrón", what: "Aceite sano", fix: "Seguir" }, { c: "#1B1A16", name: "Negro y espeso", what: "Ya toca cambio", fix: "Cambiar" }, { c: "#CBB59A", name: "Café con leche", what: "No es normal", fix: "Taller" }], bed: B }],
  ["chapter", ClChapter, { n: 5, title: "La libreta de Don Ernesto", sub: "el hábito más importante", bed: B }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([, C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="Mekit3" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
