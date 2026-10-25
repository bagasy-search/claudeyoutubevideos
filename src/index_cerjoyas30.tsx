import { Composition, registerRoot } from "remotion";
import { makeVideo, type Cfg } from "./cerjoyas30/engine";
import PLAN from "./cerjoyas30/plan.json";
import AVW from "./cerjoyas30/avwin.json";
import AVAIL from "./cerjoyas30/avail.json";
import CFG from "./cerjoyas30/cfg.json";
// cerjoyas30 · Claudio el Cerrajero · motor cer30 (todo sale de plan.json + avwin.json). Render SÓLO en el farm.
const V = makeVideo({ slug: "cerjoyas30", scene: "joyas", plan: PLAN, win: AVW.win, avail: AVAIL, ...CFG } as unknown as Cfg);
const Root = () => <Composition id="Full" component={V.Full} durationInFrames={V.frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
