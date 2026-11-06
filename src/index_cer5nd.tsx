import { Composition, registerRoot } from "remotion";
import { makeVideo, type Cfg } from "./cer5nd/engine";
import PLAN from "./cer5nd/plan.json";
import AVW from "./cer5nd/avwin.json";
import AVAIL from "./cer5nd/avail.json";
import CFG from "./cer5nd/cfg.json";
// cer5nd · ola1_B · motor cer28 (todo sale de plan.json + avwin.json). Render SÓLO en el farm.
const V = makeVideo({ slug: "cer5nd", scene: "nada", plan: PLAN, win: AVW.win, avail: AVAIL, ...CFG } as unknown as Cfg);
const Root = () => <Composition id="Full" component={V.Full} durationInFrames={V.frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
