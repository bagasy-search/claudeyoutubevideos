// Banco de stills de mecaceite: componentes NUEVOS (ClMec_mecaceite) en todos sus modos + REUSADOS con los textos del video. ENTRY=src/index_mekit_mecaceite.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClDipstick, ClCrankFoam, ClDoubleGasket, ClOilLabel, ClOilLight, ClCrushWasher } from "./claudio/ClMec_mecaceite";
import { ClChapter, ClCheck, ClBookPage, ClQRCard, ClColorCode } from "./claudio/ClCards";
import { ClVideoRef } from "./claudio/ClSarro";
import { ClReceipt } from "./claudio/ClBandeja";
import { ClLogbook } from "./claudio/ClMecanico";
const B = "ref_mecaceite.png", I = "img/mecaceite/";
export const K: [string, React.FC<any>, any][] = [
  ["dip_over", ClDipstick, { mode: "over", bed: B }], ["dip_ok", ClDipstick, { mode: "ok", bed: B }], ["dip_low", ClDipstick, { mode: "low", bed: B }], ["dip_how", ClDipstick, { mode: "how", bed: B }],
  ["foam_high", ClCrankFoam, { mode: "high", bed: B }], ["foam_ok", ClCrankFoam, { mode: "ok", bed: B }],
  ["gask_ok", ClDoubleGasket, { mode: "ok", bed: B }], ["gask_double", ClDoubleGasket, { mode: "double", bed: B }],
  ["label_grade", ClOilLabel, { mode: "grade", bed: B }], ["label_norm", ClOilLabel, { mode: "norm", bed: B }],
  ["light_red", ClOilLight, { mode: "red", bed: B }], ["light_amber", ClOilLight, { mode: "amber", bed: B }],
  ["wash_new", ClCrushWasher, { mode: "new", bed: B }], ["wash_reused", ClCrushWasher, { mode: "reused", bed: B }],
  ["log_new", ClLogbook, { mode: "new", elena: ["10/2026 · 281.300", "limpieza, silicona gomas", "10/2026 · 281.700", "aceite (lubricentro)"], bed: B }],
  ["log_two", ClLogbook, { mode: "two", elena: ["10/2026 · 281.300", "limpieza, silicona gomas", "aceite (lubricentro) ✗", "10/2026 · 281.700", "0W-20 · API SP · filtro", "arandela nueva"], bed: B }],
  ["vref_prev", ClVideoRef, { thumb: I + "th_mecbebe.jpg", title: "13 trucos con aceite para bebé", tag: "VIDEO ANTERIOR", bed: B }],
  ["vref_next", ClVideoRef, { thumb: I + "th_mecnafta.jpg", title: "El método que corta tu gasto de gasolina a la mitad", next: true, bed: B }],
  ["book14a", ClBookPage, { page: I + "page14.jpg", pageNo: 14, stamp: "La frase, en la página", bed: B }], ["book14b", ClBookPage, { page: I + "page14.jpg", pageNo: 14, stamp: "Los 9 errores, en la página", bed: B }],
  ["qr_gift", ClQRCard, { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DEL TALLER", bed: B }], ["qr_book", ClQRCard, { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "todos los trucos del taller", kicker: "EL MANUAL · US$27", bed: B }],
  ["chk_faros", ClCheck, { title: "La prueba de los faros", items: ["Se apagan al arrancar → batería", "Parpadean andando → otra cosa", "No cambies la batería todavía"], fast: true, bed: B }],
  ["rcpt_pide", ClReceipt, { head: "LO QUE PIDES", lines: [["Aceite", "el número del manual"], ["Filtro", "marca · modelo · año · motor"], ["Arandela del tapón", "nueva"]], total: ["Ejemplo", "0W-20"], bed: B }],
  ["chk_repaso", ClCheck, { title: "El repaso de 5 minutos", items: ["1. El bidón: número y norma", "2. Filtro viejo con su goma", "3. Varilla, en plano, a los 5 min", "4. Debajo: tapón y filtro", "5. Sin luz roja + aviso reseteado", "6. Etiqueta de próximos km"], fast: true, bed: B }],
  ["color", ClColorCode, { pick: 1, items: [{ c: "#BFD9E8", name: "Agua sin olor", what: "Aire acondicionado", fix: "Normal" }, { c: "#2A1A0E", name: "Marrón o negro", what: "Aceite", fix: "Varilla y tapón" }, { c: "#46A85A", name: "Verde, rosa o naranja", what: "Refrigerante", fix: "Taller" }], bed: B }],
  ["chapter", ClChapter, { n: 4, title: "Los 9 errores", sub: "después del cambio", alert: true, bed: B }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([, C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="MekitAceite" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
