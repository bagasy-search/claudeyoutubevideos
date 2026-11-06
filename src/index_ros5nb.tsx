import { Composition, registerRoot } from "remotion";
import { makeVideo, type Cfg } from "./ros5nb/engine";
import PLAN from "./ros5nb/plan.json";
import AVW from "./ros5nb/avwin.json";
import AVAIL from "./ros5nb/avail.json";
import CFG from "./ros5nb/cfg.json";
// ros5nb · ola1_B · motor cer28 (todo sale de plan.json + avwin.json). Render SÓLO en el farm.
const V = makeVideo({ slug: "ros5nb", scene: "nada", plan: PLAN, win: AVW.win, avail: AVAIL, ...CFG } as unknown as Cfg);
const Root = () => <Composition id="Full" component={V.Full} durationInFrames={V.frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
