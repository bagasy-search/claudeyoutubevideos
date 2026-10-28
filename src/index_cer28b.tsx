import { Composition, registerRoot } from "remotion";
import { makeVideo, type Cfg } from "./cer28b/engine";
import PLAN from "./cer28b/plan.json";
import AVW from "./cer28b/avwin.json";
import AVAIL from "./cer28b/avail.json";
import CFG from "./cer28b/cfg.json";
// cer28b · Claudio el Cerrajero · motor cer28 (todo sale de plan.json + avwin.json). Render SÓLO en el farm.
const V = makeVideo({ slug: "cer28b", scene: "ventana", plan: PLAN, win: AVW.win, avail: AVAIL, ...CFG } as unknown as Cfg);
const Root = () => <Composition id="Full" component={V.Full} durationInFrames={V.frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
