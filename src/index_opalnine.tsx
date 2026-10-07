// Entry MÍNIMO solo-opalnine (farm). Uso: ENTRY=src/index_opalnine.tsx
import { registerRoot, Composition } from "remotion";
import { MainOpalnine, TOTAL_FRAMES_OPALNINE } from "./opalnine/Main_opalnine";
import { OpNineTest, NINE_TEST_FRAMES } from "./opal/OpNineTest";

const Root = () => (
  <>
    <Composition id="Opalnine" component={MainOpalnine} durationInFrames={TOTAL_FRAMES_OPALNINE} fps={30} width={1920} height={1080} />
    <Composition id="OpNineTest" component={OpNineTest} durationInFrames={NINE_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
