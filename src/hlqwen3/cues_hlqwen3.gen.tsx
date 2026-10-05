// cues_hlqwen3.gen.tsx — GENERADO por la FÁBRICA (factory/phases/60_build.mjs). NO editar a mano.
import React from "react";
import { Clip, CtaFinal, Foto, FxOver } from "./Piezas";
import { Comp } from "./Comp";

export type Cue = { key: string; start: number; dur: number; capa: "base" | "over"; el: (frame: number) => React.ReactNode };

export const CUES_HLQWEN3: Cue[] = [
  { key: "m001", start: 190, dur: 116, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p001.jpg" seed={190} fx={{"atm":"nieve","pf":"img/hlqwen3/px/p001_pf.webp","pb":"img/hlqwen3/px/p001_pb.jpg","entra":"zoom","punch":22} as any} /> },
  { key: "fxn0", start: 212, dur: 78, capa: "over", el: (frame: number) => <FxOver kind="num" props={{"n":40,"unidad":"years"} as any} dur={78} /> },
  { key: "m002", start: 306, dur: 160, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p002.jpg" seed={306} fx={{"pf":"img/hlqwen3/px/p002_pf.webp","pb":"img/hlqwen3/px/p002_pb.jpg","entra":"whip-l"} as any} /> },
  { key: "m004", start: 615, dur: 125, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p004.jpg" seed={615} fx={{"atm":"polvo","pf":"img/hlqwen3/px/p004_pf.webp","pb":"img/hlqwen3/px/p004_pb.jpg","entra":"zoom"} as any} /> },
  { key: "m005", start: 740, dur: 91, capa: "base", el: (frame: number) => <Clip src="broll/hlqwen3/p005.mp4" seed={740} frames={121} fx={{"entra":"whip-r"} as any} /> },
  { key: "m005a", start: 831, dur: 58, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p005.jpg" seed={831} fx={{"pf":"img/hlqwen3/px/p005_pf.webp","pb":"img/hlqwen3/px/p005_pb.jpg"} as any} /> },
  { key: "m006", start: 889, dur: 143, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p006.jpg" seed={889} fx={{"pf":"img/hlqwen3/px/p006_pf.webp","pb":"img/hlqwen3/px/p006_pb.jpg","entra":"whip-l"} as any} /> },
  { key: "m008", start: 1157, dur: 167, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p008.jpg" seed={1157} fx={{"pf":"img/hlqwen3/px/p008_pf.webp","pb":"img/hlqwen3/px/p008_pb.jpg","entra":"zoom"} as any} /> },
  { key: "m009", start: 1324, dur: 137, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p009.jpg" seed={1324} fx={{"entra":"whip-r"} as any} /> },
  { key: "m011", start: 1553, dur: 91, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p011.jpg" seed={1553} fx={{"atm":"polvo","pf":"img/hlqwen3/px/p011_pf.webp","pb":"img/hlqwen3/px/p011_pb.jpg"} as any} /> },
  { key: "k011", start: 1553, dur: 217, capa: "over", el: (frame: number) => <Comp kind="StatBig" props={{"to":1500,"suffix":"W","label":"typical heater draw","caption":"about 12.5 A at 120 V","accent":"amber","bg":"black"} as any} /> },
  { key: "m011a", start: 1644, dur: 120, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p011x.jpg" seed={1644} fx={{"pf":"img/hlqwen3/px/p011x_pf.webp","pb":"img/hlqwen3/px/p011x_pb.jpg"} as any} /> },
  { key: "m012", start: 1764, dur: 136, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p012.jpg" seed={1764} /> },
  { key: "k013", start: 1893, dur: 151, capa: "over", el: (frame: number) => <Comp kind="VsCard" props={{"left":{"label":"12 gauge","value":"short and heavy","good":true},"right":{"label":"16 gauge","value":"thin lamp cord","good":false},"title":"heater cord","hue":"amber"} as any} /> },
  { key: "m013", start: 1900, dur: 133, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p013.jpg" seed={1900} fx={{"pf":"img/hlqwen3/px/p013_pf.webp","pb":"img/hlqwen3/px/p013_pb.jpg"} as any} /> },
  { key: "m014", start: 2033, dur: 205, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p014.jpg" seed={2033} fx={{"atm":"polvo","pf":"img/hlqwen3/px/p014_pf.webp","pb":"img/hlqwen3/px/p014_pb.jpg"} as any} /> },
  { key: "m015", start: 2238, dur: 155, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p015.jpg" seed={2238} fx={{"entra":"zoom"} as any} /> },
  { key: "m015a", start: 2393, dur: 81, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p015x.jpg" seed={2393} fx={{"entra":"whip-l"} as any} /> },
  { key: "m016", start: 2474, dur: 139, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p016.jpg" seed={2474} fx={{"atm":"polvo","pf":"img/hlqwen3/px/p016_pf.webp","pb":"img/hlqwen3/px/p016_pb.jpg"} as any} /> },
  { key: "m016a", start: 2613, dur: 106, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p016x.jpg" seed={2613} fx={{"pf":"img/hlqwen3/px/p016x_pf.webp","pb":"img/hlqwen3/px/p016x_pb.jpg","entra":"zoom"} as any} /> },
  { key: "m017", start: 2719, dur: 77, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p017.jpg" seed={2719} fx={{"pf":"img/hlqwen3/px/p017_pf.webp","pb":"img/hlqwen3/px/p017_pb.jpg","entra":"whip-l"} as any} /> },
  { key: "m017a", start: 2796, dur: 157, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p017x.jpg" seed={2796} fx={{"atm":"polvo","pf":"img/hlqwen3/px/p017x_pf.webp","pb":"img/hlqwen3/px/p017x_pb.jpg"} as any} /> },
  { key: "m018", start: 2953, dur: 99, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p018.jpg" seed={2953} fx={{"pf":"img/hlqwen3/px/p018_pf.webp","pb":"img/hlqwen3/px/p018_pb.jpg","entra":"zoom"} as any} /> },
  { key: "m019", start: 3052, dur: 134, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p019.jpg" seed={3052} fx={{"atm":"polvo","pf":"img/hlqwen3/px/p019_pf.webp","pb":"img/hlqwen3/px/p019_pb.jpg"} as any} /> },
  { key: "m019a", start: 3186, dur: 70, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p019x.jpg" seed={3186} fx={{"pf":"img/hlqwen3/px/p019x_pf.webp","pb":"img/hlqwen3/px/p019x_pb.jpg","entra":"whip-l"} as any} /> },
  { key: "m020", start: 3256, dur: 178, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p020.jpg" seed={3256} fx={{"pf":"img/hlqwen3/px/p020_pf.webp","pb":"img/hlqwen3/px/p020_pb.jpg"} as any} /> },
  { key: "m021", start: 3434, dur: 174, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p021.jpg" seed={3434} fx={{"entra":"zoom"} as any} /> },
  { key: "m022", start: 3608, dur: 83, capa: "base", el: (frame: number) => <Clip src="broll/hlqwen3/p022.mp4" seed={3608} frames={121} fx={{"entra":"whip-l"} as any} /> },
  { key: "m022a", start: 3691, dur: 160, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p022x.jpg" seed={3691} fx={{"pf":"img/hlqwen3/px/p022x_pf.webp","pb":"img/hlqwen3/px/p022x_pb.jpg"} as any} /> },
  { key: "m024", start: 4016, dur: 169, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p024.jpg" seed={4016} fx={{"pf":"img/hlqwen3/px/p024_pf.webp","pb":"img/hlqwen3/px/p024_pb.jpg"} as any} /> },
  { key: "k024", start: 4016, dur: 164, capa: "over", el: (frame: number) => <Comp kind="Checklist" props={{"title":"do not share the circuit","items":[{"text":"fridge","state":"todo"},{"text":"microwave","state":"todo"},{"text":"hair dryer","state":"todo"},{"text":"second heater","state":"todo"}],"accent":"danger","hue":"red","startAt":10,"stagger":29} as any} /> },
  { key: "m025", start: 4185, dur: 163, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p025.jpg" seed={4185} fx={{"pf":"img/hlqwen3/px/p025_pf.webp","pb":"img/hlqwen3/px/p025_pb.jpg","entra":"zoom"} as any} /> },
  { key: "m026", start: 4348, dur: 112, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p026.jpg" seed={4348} fx={{"pf":"img/hlqwen3/px/p026_pf.webp","pb":"img/hlqwen3/px/p026_pb.jpg","entra":"whip-r"} as any} /> },
  { key: "m027", start: 4460, dur: 136, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p027.jpg" seed={4460} fx={{"atm":"polvo","entra":"whip-l"} as any} /> },
  { key: "m028", start: 4596, dur: 136, capa: "base", el: (frame: number) => <Foto src="img/hlqwen3/p028.jpg" seed={4596} fx={{"atm":"polvo","pf":"img/hlqwen3/px/p028_pf.webp","pb":"img/hlqwen3/px/p028_pb.jpg","entra":"whip-r"} as any} /> },
  { key: "cta1", start: 4732, dur: 200, capa: "over", el: (frame: number) => <CtaFinal {...({"head":"Subscribe for more from the line","sub":""} as any)} /> },
];
