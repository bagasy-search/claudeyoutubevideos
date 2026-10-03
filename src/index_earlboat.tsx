// Entry MÍNIMO solo-earlboat (farm). Uso: ENTRY=src/index_earlboat.tsx
import { registerRoot, Composition } from "remotion";
import { MainEarlboat, TOTAL_FRAMES_EARLBOAT } from "./earlboat/Main_earlboat";
import { ElNightTest, NIGHT_TEST_FRAMES } from "./earl/ElNightTest";

const Root = () => (
  <>
    <Composition id="Earlboat" component={MainEarlboat} durationInFrames={TOTAL_FRAMES_EARLBOAT} fps={30} width={1920} height={1080} />
    <Composition id="ElNightTest" component={ElNightTest} durationInFrames={NIGHT_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
