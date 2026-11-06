import { Composition, registerRoot } from "remotion";
import { makeVideo, type Cfg } from "./cer5na/engine";
import PLAN from "./cer5na/plan.json";
import AVW from "./cer5na/avwin.json";
import AVAIL from "./cer5na/avail.json";
import CFG from "./cer5na/cfg.json";
// cer5na · ola1_B · motor cer28 (todo sale de plan.json + avwin.json). Render SÓLO en el farm.
const V = makeVideo({ slug: "cer5na", scene: "corrediza", plan: PLAN, win: AVW.win, avail: AVAIL, ...CFG } as unknown as Cfg);
const Root = () => <Composition id="Full" component={V.Full} durationInFrames={V.frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
