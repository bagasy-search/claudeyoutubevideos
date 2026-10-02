// Entry MÍNIMO solo-hazeldealers (farm). Uso: ENTRY=src/index_hazeldealers.tsx
import { registerRoot, Composition } from "remotion";
import { MainHazeldealers, TOTAL_FRAMES_HAZELDEALERS } from "./hazeldealers/Main_hazeldealers";
import { HzKitTest, KIT_TEST_FRAMES } from "./hazel/HzKitTest";

const Root = () => (
  <>
    <Composition id="Hazeldealers" component={MainHazeldealers} durationInFrames={TOTAL_FRAMES_HAZELDEALERS} fps={30} width={1920} height={1080} />
    <Composition id="HzKitTest" component={HzKitTest} durationInFrames={KIT_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
