// Entry MÍNIMO solo-olcast (farm). Uso: ENTRY=src/index_olcast.tsx
import { registerRoot, Composition } from "remotion";
import { OlcKitTest, KIT_TEST_FRAMES } from "./olcast/OlcKitTest";
import { MainOlcast, TOTAL_FRAMES_OLCAST } from "./olcast/Main_olcast";

const Root = () => (
  <>
    <Composition id="Olcast" component={MainOlcast} durationInFrames={TOTAL_FRAMES_OLCAST} fps={30} width={1920} height={1080} />
    <Composition id="OlcKitTest" component={OlcKitTest} durationInFrames={KIT_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
