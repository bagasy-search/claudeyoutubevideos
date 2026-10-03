// Entry MÍNIMO solo-earlwont (farm). Uso: ENTRY=src/index_earlwont.tsx
import { registerRoot, Composition } from "remotion";
import { MainEarlwont, TOTAL_FRAMES_EARLWONT } from "./earlwont/Main_earlwont";
import { ElNightTest, NIGHT_TEST_FRAMES } from "./earl/ElNightTest";

const Root = () => (
  <>
    <Composition id="Earlwont" component={MainEarlwont} durationInFrames={TOTAL_FRAMES_EARLWONT} fps={30} width={1920} height={1080} />
    <Composition id="ElNightTest" component={ElNightTest} durationInFrames={NIGHT_TEST_FRAMES} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
