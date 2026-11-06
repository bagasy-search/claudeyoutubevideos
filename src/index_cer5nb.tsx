import { Composition, registerRoot } from "remotion";
import { makeVideo, type Cfg } from "./cer5nb/engine";
import PLAN from "./cer5nb/plan.json";
import AVW from "./cer5nb/avwin.json";
import AVAIL from "./cer5nb/avail.json";
import CFG from "./cer5nb/cfg.json";
// cer5nb · ola1_B · motor cer28 (todo sale de plan.json + avwin.json). Render SÓLO en el farm.
const V = makeVideo({ slug: "cer5nb", scene: "nada", plan: PLAN, win: AVW.win, avail: AVAIL, ...CFG } as unknown as Cfg);
const Root = () => <Composition id="Full" component={V.Full} durationInFrames={V.frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
