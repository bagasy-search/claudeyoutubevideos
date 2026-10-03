// Entry MÍNIMO solo-hazelmom (farm). Uso: ENTRY=src/index_hazelmom.tsx
import { registerRoot, Composition } from "remotion";
import { MainHazelmom, TOTAL_FRAMES_HAZELMOM } from "./hazelmom/Main_hazelmom";
import { HzGlassKitTest, GLASS_TEST_FRAMES } from "./hazel/HzGlassKitTest";

const Root = () => (
  <>
    <Composition id="Hazelmom" component={MainHazelmom} durationInFrames={TOTAL_FRAMES_HAZELMOM} fps={30} width={1920} height={1080} />
    <Composition id="HzGlassKitTest" component={HzGlassKitTest} durationInFrames={GLASS_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
