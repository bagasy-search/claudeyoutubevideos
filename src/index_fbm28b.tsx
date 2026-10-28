import { Composition, registerRoot } from "remotion";
import { makeVideo, type Cfg } from "./fbm28b/engine";
import PLAN from "./fbm28b/plan.json";
import AVW from "./fbm28b/avwin.json";
import AVAIL from "./fbm28b/avail.json";
import CFG from "./fbm28b/cfg.json";
// fbm28b · Claudio · Free Builder · motor fbm28 (todo sale de plan.json + avwin.json). Render SÓLO en el farm.
const V = makeVideo({ slug: "fbm28b", scene: "yeso", plan: PLAN, win: AVW.win, avail: AVAIL, ...CFG } as unknown as Cfg);
const Root = () => <Composition id="Full" component={V.Full} durationInFrames={V.frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
