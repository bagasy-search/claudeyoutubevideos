import { Composition, registerRoot } from "remotion";
import { makeVideo, type Cfg } from "./ros5nc/engine";
import PLAN from "./ros5nc/plan.json";
import AVW from "./ros5nc/avwin.json";
import AVAIL from "./ros5nc/avail.json";
import CFG from "./ros5nc/cfg.json";
// ros5nc · ola1_B · motor cer28 (todo sale de plan.json + avwin.json). Render SÓLO en el farm.
const V = makeVideo({ slug: "ros5nc", scene: "nada", plan: PLAN, win: AVW.win, avail: AVAIL, ...CFG } as unknown as Cfg);
const Root = () => <Composition id="Full" component={V.Full} durationInFrames={V.frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
