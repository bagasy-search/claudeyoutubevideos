// Entry MÍNIMO solo-lorham (farm). Uso: ENTRY=src/index_lorham.tsx
import { registerRoot, Composition } from "remotion";
import { MainLorham, TOTAL_FRAMES_LORHAM } from "./lorham/Main_lorham";
import { LorHamKitTest, HAM_KIT_TEST_FRAMES } from "./loretta/LorHamKitTest";

const Root = () => (
  <>
    <Composition id="Lorham" component={MainLorham} durationInFrames={TOTAL_FRAMES_LORHAM} fps={30} width={1920} height={1080} />
    <Composition id="LorHamKitTest" component={LorHamKitTest} durationInFrames={HAM_KIT_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
