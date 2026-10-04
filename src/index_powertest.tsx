import { registerRoot, Composition } from "remotion";
import { HlPowerTest, POWER_TEST_FRAMES } from "./harlan/HlPowerTest";
registerRoot(() => <Composition id="PowerTest" component={HlPowerTest} durationInFrames={POWER_TEST_FRAMES} fps={30} width={1920} height={1080} />);
