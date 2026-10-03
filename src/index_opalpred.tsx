// Entry MÍNIMO solo-opalpred (farm). Uso: ENTRY=src/index_opalpred.tsx
import { registerRoot, Composition } from "remotion";
import { MainOpalpred, TOTAL_FRAMES_OPALPRED } from "./opalpred/Main_opalpred";
import { OpPredTest, PRED_TEST_FRAMES } from "./opal/OpPredTest";

const Root = () => (
  <>
    <Composition id="Opalpred" component={MainOpalpred} durationInFrames={TOTAL_FRAMES_OPALPRED} fps={30} width={1920} height={1080} />
    <Composition id="OpPredTest" component={OpPredTest} durationInFrames={PRED_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
