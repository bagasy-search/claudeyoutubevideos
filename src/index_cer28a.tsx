import { Composition, registerRoot } from "remotion";
import { makeVideo, type Cfg } from "./cer28a/engine";
import PLAN from "./cer28a/plan.json";
import AVW from "./cer28a/avwin.json";
import AVAIL from "./cer28a/avail.json";
import CFG from "./cer28a/cfg.json";
// cer28a · Claudio el Cerrajero · motor cer28 (todo sale de plan.json + avwin.json). Render SÓLO en el farm.
const V = makeVideo({ slug: "cer28a", scene: "vaso", plan: PLAN, win: AVW.win, avail: AVAIL, ...CFG } as unknown as Cfg);
const Root = () => <Composition id="Full" component={V.Full} durationInFrames={V.frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
