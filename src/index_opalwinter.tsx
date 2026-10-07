// Entry MÍNIMO solo-opalwinter (farm). Uso: ENTRY=src/index_opalwinter.tsx
import { registerRoot, Composition } from "remotion";
import { MainOpalwinter, TOTAL_FRAMES_OPALWINTER } from "./opalwinter/Main_opalwinter";
import { OpWinterTest, WINTER_TEST_FRAMES } from "./opal/OpWinterTest";

const Root = () => (
  <>
    <Composition id="Opalwinter" component={MainOpalwinter} durationInFrames={TOTAL_FRAMES_OPALWINTER} fps={30} width={1920} height={1080} />
    <Composition id="OpWinterTest" component={OpWinterTest} durationInFrames={WINTER_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
