// cues_bake.gen.tsx — GENERADO por beatsheet.mjs desde bake.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/bake.json
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { StatBig } from "./scenes/StatBig";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { ScaleColossus } from "./setpieces/ScaleColossus";
import { DocLabel } from "./overlays/DocLabel";
import { DateStamp } from "./overlays/DateStamp";
import { CountRail } from "./overlays/CountRail";

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "rule325", start: 2.07, dur: 4.2, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="03" title="El pájaro de Saqqara" label="Saqqara, Egipto" hue="amber" /> },
  { key: "c173", start: 6.27, dur: 0.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w177.mp4" hue="amber" /> },
  { key: "c174", start: 6.94, dur: 2.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w178.mp4" hue="amber" /> },
  { key: "c175", start: 9.56, dur: 3.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w179.mp4" hue="amber" /> },
  { key: "c176", start: 13.12, dur: 3.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w180.mp4" hue="amber" /> },
  { key: "c177", start: 16.82, dur: 4.11, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w181.mp4" hue="amber" /> },
  { key: "c178", start: 20.93, dur: 6.63, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w182.mp4" hue="amber" /> },
  { key: "c179", start: 27.56, dur: 6.63, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w185.mp4" hue="amber" /> },
  { key: "c180", start: 34.2, dur: 5.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w185.mp4" hue="amber" /> },
  { key: "c181", start: 39.9, dur: 4.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w186.mp4" hue="amber" /> },
  { key: "c182", start: 44.58, dur: 2.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w187.mp4" hue="amber" /> },
  { key: "scalecolossus326", start: 46.92, dur: 6, kind: "scalecolossus", el: (d) => <ScaleColossus durationInFrames={d} image="real/sq_bird.jpg" meters={2200} unit="años" label="una cola vertical como la de un avión" eyebrow="El pájaro de Saqqara" accent="amber" /> },
  { key: "c183", start: 52.92, dur: 3.05, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w189.mp4" hue="amber" /> },
  { key: "c184", start: 55.97, dur: 4.21, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w190.mp4" hue="amber" /> },
  { key: "c185", start: 60.18, dur: 3.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w191.mp4" hue="amber" /> },
  { key: "c186", start: 63.48, dur: 2.25, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w192.mp4" hue="amber" /> },
  { key: "annotated327", start: 65.73, dur: 6.5, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="real/sq_bird.jpg" annotations={[{"kind":"arrow","x":0.5,"y":0.35,"fromX":0.75,"fromY":0.2,"label":"Cola vertical = estabilizador de vuelo"}]} eyebrow="No es un pájaro cualquiera" caption="Pájaro de Saqqara · la cola vertical solo existe en los aviones" hue="amber" /> },
  { key: "c187", start: 72.23, dur: 2.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w194.mp4" hue="amber" /> },
  { key: "c188", start: 74.5, dur: 2.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w195.mp4" hue="amber" /> },
  { key: "c189", start: 77.18, dur: 3.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w196.mp4" hue="amber" /> },
  { key: "c190", start: 80.86, dur: 3.94, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w197.mp4" hue="amber" /> },
  { key: "c191", start: 84.8, dur: 5.54, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w198.mp4" hue="amber" /> },
  { key: "c192", start: 90.34, dur: 1.44, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w199.mp4" hue="amber" /> },
  { key: "stat328", start: 91.78, dur: 5.2, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={1} suffix=" cola vertical" label="aerodinámica dentro de una tumba" eyebrow="¿Un planeador egipcio?" accent="danger" hue="amber" /> },
  { key: "c193", start: 96.98, dur: 2.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w199.mp4" hue="amber" /> },
  { key: "c194", start: 99.88, dur: 3.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w201.mp4" hue="amber" /> },
  { key: "c195", start: 103.73, dur: 3.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w203.mp4" hue="amber" /> },
  { key: "c196", start: 107.58, dur: 2.94, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w203.mp4" hue="amber" /> },
  { key: "c197", start: 110.52, dur: 4.24, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w204.mp4" hue="amber" /> },
  { key: "c198", start: 114.76, dur: 4.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w205.mp4" hue="amber" /> },
  { key: "c199", start: 119.16, dur: 6.64, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/w206.mp4" hue="amber" /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [
  { key: "o013", start: 6.27, dur: 6, kind: "doclabel", el: (d) => <DocLabel durationInFrames={d} label="El pájaro de Saqqara" sub="Saqqara, Egipto" accent="amber" /> },
  { key: "o014", start: 6.27, dur: 130.16, kind: "countrail", el: (d) => <CountRail durationInFrames={d} rank={3} total={7} name="El pájaro de Saqqara" accent="amber" /> },
  { key: "o015", start: 47.12, dur: 5, kind: "datestamp", el: (d) => <DateStamp durationInFrames={d} value="≈ 2.200 años" label="El pájaro de Saqqara" accent="amber" /> },
];
