// Entry MÍNIMO solo-opalmolt (farm). Uso: ENTRY=src/index_opalmolt.tsx
import { registerRoot, Composition } from "remotion";
import { MainOpalmolt, TOTAL_FRAMES_OPALMOLT } from "./opalmolt/Main_opalmolt";
import { OpKitTest, KIT_TEST_FRAMES } from "./opal/OpKitTest";

const Root = () => (
  <>
    <Composition id="Opalmolt" component={MainOpalmolt} durationInFrames={TOTAL_FRAMES_OPALMOLT} fps={30} width={1920} height={1080} />
    <Composition id="OpKitTest" component={OpKitTest} durationInFrames={KIT_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
