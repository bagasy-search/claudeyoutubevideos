import { Composition, registerRoot } from "remotion";
import { makeVideo, type Cfg } from "./cerllave30/engine";
import PLAN from "./cerllave30/plan.json";
import AVW from "./cerllave30/avwin.json";
import AVAIL from "./cerllave30/avail.json";
import CFG from "./cerllave30/cfg.json";
// cerllave30 · Claudio el Cerrajero · motor cer30 (todo sale de plan.json + avwin.json). Render SÓLO en el farm.
const V = makeVideo({ slug: "cerllave30", scene: "llave", plan: PLAN, win: AVW.win, avail: AVAIL, ...CFG } as unknown as Cfg);
const Root = () => <Composition id="Full" component={V.Full} durationInFrames={V.frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
