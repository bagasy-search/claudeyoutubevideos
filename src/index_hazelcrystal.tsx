// Entry MÍNIMO solo-hazelcrystal (farm). Uso: ENTRY=src/index_hazelcrystal.tsx
import { registerRoot, Composition } from "remotion";
import { MainHazelcrystal, TOTAL_FRAMES_HAZELCRYSTAL } from "./hazelcrystal/Main_hazelcrystal";
import { HzGlassKitTest, GLASS_TEST_FRAMES } from "./hazel/HzGlassKitTest";

const Root = () => (
  <>
    <Composition id="Hazelcrystal" component={MainHazelcrystal} durationInFrames={TOTAL_FRAMES_HAZELCRYSTAL} fps={30} width={1920} height={1080} />
    <Composition id="HzGlassKitTest" component={HzGlassKitTest} durationInFrames={GLASS_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
