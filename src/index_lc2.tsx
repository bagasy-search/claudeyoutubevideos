// Entry MÍNIMO del canal 2 de Loretta (lc2dump / lc2pan / lc2cass). Uso: ENTRY=src/index_lc2.tsx
import { registerRoot, Composition } from "remotion";
import { Lc2KitTest, LC2_KIT_FRAMES } from "./lc2/Lc2KitTest";
import { Lc2Main, Lc2TL } from "./lc2/Lc2Main";
import dump from "./lc2/lc2dump_tl.json";
import pan from "./lc2/lc2pan_tl.json";
import cass from "./lc2/lc2cass_tl.json";

const V: [string, Lc2TL][] = [["Lc2dump", dump as Lc2TL], ["Lc2pan", pan as Lc2TL], ["Lc2cass", cass as Lc2TL]];
const Root = () => (
  <>
    <Composition id="Lc2KitTest" component={Lc2KitTest} durationInFrames={LC2_KIT_FRAMES} fps={30} width={1920} height={1080} />
    {V.map(([id, tl]) => <Composition key={id} id={id} component={Lc2Main} defaultProps={{ tl }} durationInFrames={tl.frames} fps={30} width={1920} height={1080} />)}
  </>
);

registerRoot(Root);
