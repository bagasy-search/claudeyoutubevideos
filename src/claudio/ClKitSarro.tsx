// Banco de prueba de los componentes NUEVOS del video del sarro (farm, 5 s cada uno) con camas y fotos REALES del video.
// Entry src/index_clkitsarro.tsx · assets en _clkitsarro_assets.txt (vlog/clsarro/kitassets.py)
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ClBowl3D } from "./ClBowl3D";
import { ClValve3D } from "./ClValve3D";
import { ClPumiceTest, ClPasteRecipe, ClNotebook, ClVideoRef } from "./ClSarro";
import { ClColorCode, ClBeforeAfter } from "./ClCards";
import { ClTimer30 } from "./ClGauges";

const I = "img/clsarro/";
const SAR = [{ c: "#E6E1D3", name: "Blanco o gris", what: "Calcio solo", fix: "Vinagre + piedra" }, { c: "#8A5A2B", name: "Marrón o naranja", what: "Piedra con óxido", fix: "Pasta + piedra" }, { c: "#4F8C7A", name: "Verdoso", what: "Cobre de caños viejos", fix: "Vinagre" }, { c: "#1C1A14", name: "Negro baboso", what: "Está vivo", fix: "El video del borde" }];
export const KITS = (B: (i: number) => string | undefined): [React.FC<any>, any][] => [
  [ClBowl3D, { mode: "layers", days: 365, labels: { ring: "Una capa por día" }, bed: I + "b_hotelbath.jpg" }],
  [ClBowl3D, { mode: "brush", labels: { ring: "El cepillo resbala" }, bed: B(0) }],
  [ClBowl3D, { mode: "lower", labels: { ring: "Anillo afuera", water: "El agua, abajo" }, bed: I + "b_hotelbath2.jpg" }],
  [ClBowl3D, { mode: "paste", labels: { ring: "Sale la capa de arriba" }, bed: B(1) }],
  [ClBowl3D, { mode: "vinegar", labels: { ring: "Apoyado toda la noche" }, bed: I + "b_hotelbath.jpg" }],
  [ClValve3D, { label: "A la derecha, hasta que pare", bed: I + "b_tilewall.jpg" }],
  [ClPumiceTest, { bed: B(2) }],
  [ClPumiceTest, { only: "dry", bed: B(3) }],
  [ClPasteRecipe, { a: 3, b: 1, bed: I + "b_counter.jpg" }],
  [ClNotebook, { rows: [{ k: "312", v: "cambiar" }, { k: "314", v: "cambiar" }, { k: "318", v: "cambiar" }], bed: I + "b_desk.jpg" }],
  [ClNotebook, { rows: [{ k: "312", v: "cambiar" }, { k: "314", v: "cambiar" }, { k: "318", v: "cambiar" }], strike: true, bed: I + "b_desk.jpg" }],
  [ClVideoRef, { thumb: I + "th_clborde.jpg", title: "El borde del inodoro", bed: B(4) }],
  [ClVideoRef, { thumb: I + "th_cllavadora.jpg", title: "La lavadora que huele mal", next: true, bed: B(5) }],
  [ClColorCode, { pick: 1, items: SAR, bed: B(6) }],
  [ClBeforeAfter, { before: I + "b_ringdirty.jpg", after: I + "b_ringclean_ab.jpg", note: "sin tallar" }],
  [ClTimer30, { minutes: 20, label: "No toque nada", bed: B(7) }],
];
export const ClKitSarro: React.FC<{ beds?: string[] }> = ({ beds = [] }) => {
  const K = KITS((i) => (beds.length ? beds[i % beds.length] : undefined));
  return (
    <AbsoluteFill style={{ backgroundColor: "#fff" }}>
      {K.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}
    </AbsoluteFill>
  );
};
