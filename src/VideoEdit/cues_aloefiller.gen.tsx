// cues_aloefiller.gen.tsx — GENERADO por beatsheet.mjs desde aloefiller.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/aloefiller.json
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { LowerThirdKit } from "./kit/LowerThirdKit";
import { CinematicLowerThird } from "./scenes/CinematicLowerThird";
import { NameTag } from "./scenes/NameTag";
import { BarCompare } from "./scenes/BarCompare";
import { Checklist } from "./scenes/Checklist";

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "reveal_1", start: 135.2, dur: 5.44, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/al_federer_leaf.png" kicker="A filler you refill for the price of a coffee" /> },
  { key: "intro_1", start: 175.83, dur: 26.56, kind: "nametag", el: (d) => <NameTag durationInFrames={d} name="Dr. Federer" /> },
  { key: "patient_1", start: 233.42, dur: 16.82, kind: "lowerthird", el: (d) => <CinematicLowerThird durationInFrames={d} image=undefined /> },
  { key: "science_1", start: 338.32, dur: 5.63, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/al_federer_scoop.png" kicker="The clear inner gel — not the green skin" /> },
  { key: "mistake_2", start: 478, dur: 27.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/al_hook_greenbottle.png" kicker="Mostly water, dye — and drying alcohol" /> },
  { key: "realthing_0", start: 528.56, dur: 4.53, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/al_hook_cleargel.png" kicker="Clear — not green. Fresh from the leaf." /> },
  { key: "realthing_1", start: 533.09, dur: 23.54, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/al_federer_cut.png" kicker="Scoop the clear gel — leave the yellow layer" /> },
  { key: "apply_0", start: 594.62, dur: 5.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/al_federer_apply.png" kicker="A thin layer at night — then seal it in" /> },
  { key: "villain_1", start: 628.93, dur: 20.99, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"$700 syringe / 6 months","value":70,"tone":"danger","note":"the needle"},{"label":"$90 'plumping' day cream","value":45,"tone":"danger","note":"sold to you"},{"label":"$90 'plumping' night cream","value":45,"tone":"danger","note":"also sold to you"}]} title="Sold a permanent problem" /> },
  { key: "honesty_1", start: 812.76, dur: 25.45, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Be honest — what this will NOT do" items={[{"text":"Replace an injection for deep, structural volume loss","state":"warn"},{"text":"Last without the habit — the first-week plump is water","state":"warn"},{"text":"Suit everyone — patch-test; skip the yellow layer","state":"warn"},{"text":"'Detox' anything — and no, no one's hiding it","state":"warn"},{"text":"Replace your daytime sunscreen","state":"warn"}]} eyebrow="The honest truth" /> },
  { key: "desc2_1", start: 964.4, dur: 15.1, kind: "lowerthird", el: (d) => <CinematicLowerThird durationInFrames={d} image=undefined /> },
  { key: "cierre_0", start: 1034.53, dur: 25.34, kind: "nametag", el: (d) => <NameTag durationInFrames={d} name="Dr. Federer" /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [

];

// cama de música (AudioBed) — null si el beatsheet no define "music"
export const AUDIO_BED: { src: string; activity: [number, number][]; base: number; duck: number; totalSec: number; loop: boolean } | null = null;

// riel de SFX suaves (SfxRail) — [] si "sfx": false
export const SFX_CUES: { at: number; role: string; vol?: number }[] = [{"at":0.3,"role":"popUp","vol":0.32},{"at":38.33,"role":"popUp","vol":0.32},{"at":56.43,"role":"popUp","vol":0.32},{"at":100.16,"role":"popUp","vol":0.32},{"at":112.8,"role":"popUp","vol":0.32},{"at":140.64,"role":"popUp","vol":0.32},{"at":150.74,"role":"popUp","vol":0.32},{"at":175.83,"role":"popUp","vol":0.32},{"at":233.42,"role":"popUp","vol":0.32},{"at":261.68,"role":"popUp","vol":0.32},{"at":275.98,"role":"popUp","vol":0.32},{"at":286.47,"role":"popUp","vol":0.32},{"at":308.4,"role":"popUp","vol":0.32},{"at":343.95,"role":"popUp","vol":0.32},{"at":380,"role":"popUp","vol":0.32},{"at":385.39,"role":"popUp","vol":0.32},{"at":416.24,"role":"popUp","vol":0.32},{"at":448.22,"role":"popUp","vol":0.32},{"at":463.51,"role":"popUp","vol":0.32},{"at":471.28,"role":"popUp","vol":0.32},{"at":505.96,"role":"popUp","vol":0.32},{"at":559.45,"role":"popUp","vol":0.32},{"at":563.95,"role":"popUp","vol":0.32},{"at":599.91,"role":"popUp","vol":0.32},{"at":628.93,"role":"popUp","vol":0.32},{"at":649.92,"role":"popUp","vol":0.32},{"at":661.36,"role":"popUp","vol":0.32},{"at":669.33,"role":"popUp","vol":0.32},{"at":675.86,"role":"popUp","vol":0.32},{"at":700.29,"role":"popUp","vol":0.32},{"at":710.9,"role":"popUp","vol":0.32},{"at":738.51,"role":"popUp","vol":0.32},{"at":750.92,"role":"popUp","vol":0.32},{"at":754.3,"role":"popUp","vol":0.32},{"at":812.76,"role":"popUp","vol":0.32},{"at":838.21,"role":"popUp","vol":0.32},{"at":893.95,"role":"popUp","vol":0.32},{"at":902.8,"role":"popUp","vol":0.32},{"at":964.4,"role":"popUp","vol":0.32},{"at":979.5,"role":"popUp","vol":0.32},{"at":1006.14,"role":"popUp","vol":0.32},{"at":1034.53,"role":"popUp","vol":0.32}];
