import { Composition, registerRoot } from "remotion";
import { makeVideo, type Cfg } from "./mec5na/engine";
import PLAN from "./mec5na/plan.json";
import AVW from "./mec5na/avwin.json";
import AVAIL from "./mec5na/avail.json";
import CFG from "./mec5na/cfg.json";
// mec5na · ola1_B · motor cer28 (todo sale de plan.json + avwin.json). Render SÓLO en el farm.
const V = makeVideo({ slug: "mec5na", scene: "nada", plan: PLAN, win: AVW.win, avail: AVAIL, ...CFG } as unknown as Cfg);
const Root = () => <Composition id="Full" component={V.Full} durationInFrames={V.frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
