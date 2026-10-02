// Entry MÍNIMO solo-earlshrimpbag (farm). Uso: ENTRY=src/index_earlshrimpbag.tsx
import { registerRoot, Composition } from "remotion";
import { MainEarlshrimpbag, TOTAL_FRAMES_EARLSHRIMPBAG } from "./earlshrimpbag/Main_earlshrimpbag";
import { ElKitTest, KIT_TEST_FRAMES } from "./earl/ElKitTest";

const Root = () => (
  <>
    <Composition id="Earlshrimpbag" component={MainEarlshrimpbag} durationInFrames={TOTAL_FRAMES_EARLSHRIMPBAG} fps={30} width={1920} height={1080} />
    <Composition id="ElKitTest" component={ElKitTest} durationInFrames={KIT_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
