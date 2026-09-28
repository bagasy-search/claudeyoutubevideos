// Entry MÍNIMO solo-lorpies (farm). Uso: ENTRY=src/index_lorpies.tsx
import { registerRoot, Composition } from "remotion";
import { MainLorpies, TOTAL_FRAMES_LORPIES } from "./lorpies/Main_lorpies";
import { LorKitTest, KIT_TEST_FRAMES } from "./loretta/LorKitTest";

const Root = () => (
  <>
    <Composition id="Lorpies" component={MainLorpies} durationInFrames={TOTAL_FRAMES_LORPIES} fps={30} width={1920} height={1080} />
    <Composition id="LorKitTest" component={LorKitTest} durationInFrames={KIT_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
