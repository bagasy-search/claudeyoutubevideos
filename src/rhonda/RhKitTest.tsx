// Banco de prueba del kit Rhonda en el FARM (antes del render completo): cada componente 5 s con props reales.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { RhToiletCutaway3D } from "./RhToiletCutaway3D";
import { RhBottle3D } from "./RhBottle3D";
import { RhChapter, RhCheck, RhBookPage, RhQRCard, RhDoDont, RhPins, RhColorCode } from "./RhCards";
import { RhMeasureCup, RhTimer30 } from "./RhGauges";
import { RhRimJets, RhBleachVsRoots, RhNeverMix } from "./RhScience";
import { RhNameTag, RhAsk } from "./RhOverlays";

const B = (n: string) => `broll/rhtoiletrim_st/${n}.mp4#270`;
const I = "img/rhtoiletrim/";
export const KIT: [React.FC<any>, any][] = [
  [RhToiletCutaway3D, { mode: "flow", labels: { tube: "Overflow tube", channel: "Rim channel", holes: "Every hole", amount: "½ cup" } }],
  [RhToiletCutaway3D, { mode: "tablet", labels: { tank: "Tablet at the bottom", holes: "Slime stays" } }],
  [RhToiletCutaway3D, { mode: "crust", labels: { holes: "The anchor: mineral crust" } }],
  [RhBottle3D, { title: "3% hydrogen peroxide", sub: "the regular drugstore kind", tag: "$1" }],
  [RhBottle3D, { compare: { clear: "Goes flat", brown: "Stays strong" } }],
  [RhChapter, { n: 3, title: "The bleach myth", sub: "why it comes back so fast", bed: B("bd_bathclean") }],
  [RhChapter, { n: 5, title: "Mixing", sub: "the one that scares me", mistake: true, alert: true, bed: B("bd_faucet") }],
  [RhCheck, { title: "The whole fix", items: ["½ cup down the overflow tube", "Spray the holes till they drip", "1 cup in the bowl", "30 minutes, no flushing", "Brush, then flush"], bed: B("bd_counter") }],
  [RhBookPage, { page: I + "book_p9.jpg", bed: B("bd_towels") }],
  [RhQRCard, { qr: I + "qr.png", cover: I + "book_cover.jpg", bed: B("bd_kitchen") }],
  [RhDoDont, { yes: { label: "Plastic stirrer", img: I + "b_stirrer.jpg" }, no: { label: "Metal tools", img: I + "b_metal.jpg" }, bed: B("bd_tiles") }],
  [RhPins, { img: I + "b_wholetoilet.jpg", pins: [{ x: 0.5, y: 0.66, label: "The jet" }, { x: 0.5, y: 0.33, label: "The hinges" }, { x: 0.33, y: 0.9, label: "The base" }] }],
  [RhColorCode, { pick: 2, bed: B("bd_drip") }],
  [RhMeasureCup, { fill: 0.5, label: "½ cup", where: "under the rim", bed: B("bd_gloves") }],
  [RhTimer30, { minutes: 30, label: "No flushing", bed: B("bd_spraycl") }],
  [RhTimer30, { overnight: true, bed: B("bd_curtain") }],
  [RhRimJets, { mode: "fizz", label: "The fizz lifts it loose" }],
  [RhRimJets, { mode: "spray", label: "Spray until they drip" }],
  [RhBleachVsRoots, { phase: "bleach", bed: B("bd_hall") }],
  [RhNeverMix, { a: "Bleach", b: "Vinegar", verdict: "Chlorine gas", bed: B("bd_cabinet") }],
  [RhNeverMix, { chart: true, bed: B("bd_mop") }],
];
export const RhKitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    {KIT.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}
    <Sequence from={150 * 3} durationInFrames={150}><RhNameTag sub="34 years cleaning houses in Ohio" /></Sequence>
    <Sequence from={150 * 4} durationInFrames={150}><RhAsk q="What keeps coming back in YOUR house?" /></Sequence>
  </AbsoluteFill>
);
