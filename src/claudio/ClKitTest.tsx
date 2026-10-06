// Banco de prueba del kit Claudio en el FARM (antes del render completo): cada componente 5 s con props y camas REALES del video.
// SLUG del banco = clkittest (entry src/index_clkittest.tsx). La lista de assets sale de vlog/claudio/kit_assets.mjs.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ClRimCutaway3D } from "./ClRimCutaway3D";
import { ClBottle3D } from "./ClBottle3D";
import { ClMicroscope3D } from "./ClMicroscope3D";
import { ClHallway3D } from "./ClHallway3D";
import { ClChapter, ClCheck, ClBookPage, ClQRCard, ClDoDont, ClPins, ClColorCode, ClBeforeAfter, ClSplit } from "./ClCards";
import { ClMeasureCup, ClTimer30 } from "./ClGauges";
import { ClRimJets, ClNeverMix } from "./ClScience";
import { ClNameTag, ClStampOv, ClChip, ClAsk } from "./ClOverlays";

const I = "img/clborde/";
export const kitBeds = (beds: string[]) => (i: number) => beds.length ? beds[i % beds.length] : undefined;
export const KIT = (B: (i: number) => string | undefined): [React.FC<any>, any, React.FC<any>?, any?][] => [
  [ClRimCutaway3D, { mode: "alive", labels: { tube: "¿Por dónde come?" }, orbit: 0.4, bed: I + "b_hotelbath.jpg" }],
  [ClRimCutaway3D, { mode: "flow", labels: { tube: "Tubo de rebalse", channel: "Canal del borde", holes: "Cada agujero", amount: "½ taza" }, bed: I + "b_hotelbath2.jpg" }],
  [ClRimCutaway3D, { mode: "bleach", labels: { channel: "Abajo sigue vivo" }, bed: I + "b_hotelbath.jpg" }],
  [ClMicroscope3D, { label: "Bacterias y moho, juntos", zoomTo: 400 }],
  [ClHallway3D, { total: 120, floor: 3, title: "inodoros", sub: "cada uno, todos los días" }],
  [ClBottle3D, { title: "Agua oxigenada 3 %", sub: "la común de la farmacia", tag: "la de siempre", bed: I + "b_hotelbath.jpg" }],
  [ClBottle3D, { compare: { clear: "Se cansa", brown: "Sigue fuerte" }, bed: I + "b_counter.jpg" }],
  [ClBeforeAfter, { before: I + "b_rimdirty.jpg", after: I + "b_rimclean.jpg", note: "½ taza · 30 minutos" }],
  [ClSplit, { img: I + "b_rimdirty.jpg" }],
  [ClChapter, { n: 3, title: "El mito del cloro", sub: "por qué vuelve tan rápido", bed: B(0) }],
  [ClChapter, { n: 5, label: "ERROR", title: "Mezclar", sub: "el que más miedo me da", alert: true, bed: B(1) }],
  [ClCheck, { title: "El arreglo entero", items: ["½ taza por el tubo", "Rociar hasta que goteen", "1 taza en el agua", "30 minutos sin descargar", "Cepillito y descarga"], bed: B(2) }],
  [ClBookPage, { page: I + "book_p9.jpg", pageNo: 9, qr: I + "qr.png", stamp: "Gratis en la página", bed: B(3) }],
  [ClQRCard, { qr: I + "qr.png", cover: I + "book_cover.jpg", bed: B(4) }],
  [ClDoDont, { yes: { label: "Palito de plástico", img: I + "b_stirrer.jpg" }, no: { label: "Nada de metal", img: I + "b_metal.jpg" }, bed: B(5) }],
  [ClPins, { img: I + "b_wholetoilet.jpg", pins: [{ x: 0.5, y: 0.66, label: "El chorro" }, { x: 0.5, y: 0.33, label: "Las bisagras" }, { x: 0.33, y: 0.9, label: "La base" }] }],
  [ClColorCode, { pick: 2, bed: B(6) }],
  [ClMeasureCup, { fill: 0.5, label: "½ taza", where: "debajo del borde", bed: B(7) }],
  [ClTimer30, { minutes: 30, label: "Sin tirar la cadena", bed: B(8) }],
  [ClTimer30, { overnight: true, bed: B(9) }],
  [ClRimJets, { mode: "fizz", label: "La espuma la despega" }],
  [ClNeverMix, { a: "?", b: "?", verdict: "Nunca", bed: B(10) }],
  [ClNeverMix, { a: "Cloro", b: "Vinagre", verdict: "Gas cloro", bed: B(11) }],
  [ClNeverMix, { chart: true, bed: B(12) }],
  // overlays sobre fotos reales
  [ClStampOv, { text: "ESTÁ VIVO" }, undefined, I + "b_rimdirty.jpg"],
  [ClNameTag, { name: "Claudio", sub: "30 años de conserje de hotel" }, undefined, I + "c_cart.jpg"],
  [ClChip, { text: "Jueves", alert: true }, undefined, I + "b_thursday.jpg"],
  [ClAsk, { q: "¿Qué vuelve siempre en SU casa?" }, undefined, I + "c_done.jpg"],
];
import { Img, staticFile } from "remotion";
export const ClKitTest: React.FC<{ beds?: string[] }> = ({ beds = [] }) => {
  const K = KIT(kitBeds(beds));
  return (
    <AbsoluteFill style={{ backgroundColor: "#fff" }}>
      {K.map(([C, p, , under], i) => (
        <Sequence key={i} from={i * 150} durationInFrames={150}>
          {under ? <Img src={staticFile(under)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} /> : null}
          <C {...p} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
