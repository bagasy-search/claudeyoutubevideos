import { Composition, registerRoot } from "remotion";
import { makeVideo, type Cfg } from "./mec5nc/engine";
import PLAN from "./mec5nc/plan.json";
import AVW from "./mec5nc/avwin.json";
import AVAIL from "./mec5nc/avail.json";
import CFG from "./mec5nc/cfg.json";
// mec5nc · ola1_B · motor cer28 (todo sale de plan.json + avwin.json). Render SÓLO en el farm.
const V = makeVideo({ slug: "mec5nc", scene: "nada", plan: PLAN, win: AVW.win, avail: AVAIL, ...CFG } as unknown as Cfg);
const Root = () => <Composition id="Full" component={V.Full} durationInFrames={V.frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
