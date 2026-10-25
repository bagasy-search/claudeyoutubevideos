import { Composition, registerRoot } from "remotion";
import { makeVideo, type Cfg } from "./cerpapeles30/engine";
import PLAN from "./cerpapeles30/plan.json";
import AVW from "./cerpapeles30/avwin.json";
import AVAIL from "./cerpapeles30/avail.json";
import CFG from "./cerpapeles30/cfg.json";
// cerpapeles30 · Claudio el Cerrajero · motor cer30 (todo sale de plan.json + avwin.json). Render SÓLO en el farm.
const V = makeVideo({ slug: "cerpapeles30", scene: "papeles", plan: PLAN, win: AVW.win, avail: AVAIL, ...CFG } as unknown as Cfg);
const Root = () => <Composition id="Full" component={V.Full} durationInFrames={V.frames} fps={30} width={1920} height={1080} />;
registerRoot(Root);
