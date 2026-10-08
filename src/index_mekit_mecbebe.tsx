// Banco de stills de mecbebe: componentes NUEVOS (ClMec_mecbebe) en todos sus modos + REUSADOS con los textos del video. ENTRY=src/index_mekit_mecbebe.tsx
import React from "react";
import { registerRoot, Composition, AbsoluteFill, Sequence } from "remotion";
import { ClOilMap13, ClDropTest, ClGrip, ClSealSwell, ClGlare } from "./claudio/ClMec_mecbebe";
import { ClChapter, ClCheck, ClBookPage, ClQRCard, ClColorCode } from "./claudio/ClCards";
import { ClVideoRef } from "./claudio/ClSarro";
import { ClReceipt } from "./claudio/ClBandeja";
import { ClLogbook } from "./claudio/ClMecanico";
const B = "ref_mecbebe.png", I = "img/mecbebe/";
export const K: [string, React.FC<any>, any][] = [
  ["map_all", ClOilMap13, { all: true, bed: B }], ["map_n3", ClOilMap13, { n: 3, bed: B }], ["map_n7", ClOilMap13, { n: 7, bed: B }], ["map_n9", ClOilMap13, { upto: 13, n: 9, bed: B }], ["map_n13", ClOilMap13, { upto: 13, n: 13, bed: B }],
  ["drop_surface", ClDropTest, { mode: "surface", bed: B }], ["drop_inside", ClDropTest, { mode: "inside", bed: B }],
  ["grip_oiled", ClGrip, { mode: "oiled", bed: B }], ["grip_dry", ClGrip, { mode: "dry", bed: B }],
  ["seal_oil", ClSealSwell, { mode: "oil", bed: B }], ["seal_sil", ClSealSwell, { mode: "silicone", bed: B }],
  ["glare_oil", ClGlare, { mode: "oil", bed: B }], ["glare_clean", ClGlare, { mode: "clean", bed: B }],
  ["log_new", ClLogbook, { mode: "new", elena: ["10/2026 · 280.900", "lavado vinagre, verde", "10/2026 · 281.300", "limpieza, silicona gomas", "aceite bebé: sólo paño"], bed: B }],
  ["log_two", ClLogbook, { mode: "two", elena: ["10/2026 · 280.900", "lavado vinagre, verde", "10/2026 · 281.300", "limpieza, silicona gomas", "¡nunca en los pedales!", "— Elena y su nieta"], bed: B }],
  ["vref_prev", ClVideoRef, { thumb: I + "th_mecvinagre.jpg", title: "El truco de vinagre de 1 dólar", tag: "VIDEO ANTERIOR", bed: B }],
  ["vref_next", ClVideoRef, { thumb: I + "th_mecaceite.jpg", title: "NUNCA hagas esto después de cambiar el aceite", next: true, bed: B }],
  ["book13a", ClBookPage, { page: I + "page13.jpg", pageNo: 13, stamp: "La frase, en la página", bed: B }], ["book13b", ClBookPage, { page: I + "page13.jpg", pageNo: 13, stamp: "La lista honesta, en la página", bed: B }],
  ["qr_gift", ClQRCard, { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DEL TALLER", bed: B }], ["qr_book", ClQRCard, { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "todos los trucos del taller", kicker: "EL MANUAL · US$27", bed: B }],
  ["chk_faros", ClCheck, { title: "La prueba de los faros", items: ["Se apagan al arrancar → batería", "Parpadean andando → otra cosa", "No cambies la batería todavía"], fast: true, bed: B }],
  ["rcpt_pide", ClReceipt, { head: "LO QUE PIDES", lines: [["Aceite mineral o de bebé", "1 frasco chico"], ["Paños de microfibra", "2 o 3"], ["Protector de silicona", "para las gomas"]], total: ["Para las gomas", "silicona, no aceite"], bed: B }],
  ["color", ClColorCode, { pick: 1, items: [{ c: "#BFD9E8", name: "Agua sin olor", what: "Aire acondicionado", fix: "Normal" }, { c: "#2A1A0E", name: "Marrón o negro", what: "Aceite", fix: "Mide la varilla" }, { c: "#46A85A", name: "Verde, rosa o naranja", what: "Refrigerante", fix: "Taller" }], bed: B }],
  ["chapter", ClChapter, { n: 6, title: "Los 6 lugares donde nunca va", sub: "la lista más importante", alert: true, bed: B }],
];
const Main: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([, C, p], i) => <Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>)}</AbsoluteFill>;
registerRoot(() => <Composition id="MekitBebe" component={Main} durationInFrames={K.length * 150} fps={30} width={1920} height={1080} />);
