// Banco de prueba del kit Rhonda en el FARM (antes del render completo): cada componente 5 s con props y assets REALES del video en curso.
// rhmoldbleach: los componentes nuevos del tema moho (RhGroutPore3D en todos sus modos + RhMold) y el reloj en horas.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { RhGroutPore3D } from "./RhGroutPore3D";
import { RhMoldCalendar, RhSwabTest, RhWipeReveal, RhFogMirror, RhPatchMeter, RhWetMap, RhStrengthMeter, RhNextVideo } from "./RhMold";
import { RhTimer30 } from "./RhGauges";

const B = (n: string) => `broll/rhmoldbleach_st/${n}.mp4#270`;
const I = (n: string) => `img/rhmoldbleach/${n}.jpg`;
export const KIT: [React.FC<any>, any][] = [
  [RhGroutPore3D, { mode: "pores", labels: { pore: "Tiny holes", tile: "Tile" } }],
  [RhGroutPore3D, { mode: "roots", labels: { roots: "The roots", dots: "What you see" } }],
  [RhGroutPore3D, { mode: "bleach", labels: { top: "Bleach: color only", roots: "Roots: still alive" } }],
  [RhGroutPore3D, { mode: "peroxide", labels: { roots: "Down to the roots" } }],
  [RhGroutPore3D, { mode: "dry", labels: { pore: "No water, no mold" } }],
  [RhGroutPore3D, { mode: "scratch", labels: { pore: "A new home" } }],
  [RhGroutPore3D, { mode: "paint", labels: { top: "Paint", roots: "Roots: still there" } }],
  [RhMoldCalendar, { mode: "split", a: I("b_day1"), b: I("b_day9"), la: "Day 1", lb: "Day 9" }],
  [RhMoldCalendar, { mode: "days", img: I("b_day1"), steps: [{ d: 1, t: "White" }, { d: 3, t: "Nothing" }, { d: 6, t: "A shadow" }, { d: 9, t: "Same dots" }] }],
  [RhMoldCalendar, { mode: "months", img: I("b_whiteafter") }],
  [RhMoldCalendar, { mode: "weekly", img: I("b_whiteafter") }],
  [RhSwabTest, { mode: "tease", bed: B("bd_showerclean") }],
  [RhSwabTest, { mode: "top", bed: B("bd_tilewall") }],
  [RhSwabTest, { mode: "under", bed: B("bd_curtain") }],
  [RhWipeReveal, { before: I("b_before2"), after: I("b_after2") }],
  [RhFogMirror, { img: I("b_fogmirror"), lines: ["Squeegee", "Wipe the corners", "30 seconds"] }],
  [RhPatchMeter, { img: I("b_bigpatch") }],
  [RhWetMap, { img: I("b_wholeshower") }],
  [RhStrengthMeter, { bed: B("bd_spraybottle") }],
  [RhTimer30, { minutes: 24, unit: "hours", label: "New caulk: hands off", bed: B("bd_handtowel") }],
];
export const RhKitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    {KIT.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}
    <Sequence from={150 * 14} durationInFrames={150}><RhNextVideo title="Black mold in your shower caulk?" /></Sequence>
  </AbsoluteFill>
);
