// Entry MÍNIMO solo-opalnolay (farm). Uso: ENTRY=src/index_opalnolay.tsx
import { registerRoot, Composition } from "remotion";
import { MainOpalnolay, TOTAL_FRAMES_OPALNOLAY } from "./opalnolay/Main_opalnolay";
import { OpKitTest, KIT_TEST_FRAMES } from "./opal/OpKitTest";

const Root = () => (
  <>
    <Composition id="Opalnolay" component={MainOpalnolay} durationInFrames={TOTAL_FRAMES_OPALNOLAY} fps={30} width={1920} height={1080} />
    <Composition id="OpKitTest" component={OpKitTest} durationInFrames={KIT_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
