// Entry MÍNIMO solo-lordeviled (farm). Uso: ENTRY=src/index_lordeviled.tsx
import { registerRoot, Composition } from "remotion";
import { LorEggKitTest, EGG_KIT_TEST_FRAMES } from "./loretta/LorEggKitTest";

const Root = () => (
  <>
    <Composition id="LorEggKitTest" component={LorEggKitTest} durationInFrames={EGG_KIT_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
