import { registerRoot, Composition } from "remotion";
import { HlHeatTest, HEAT_TEST_FRAMES } from "./harlan/HlHeatTest";
registerRoot(() => <Composition id="HeatTest" component={HlHeatTest} durationInFrames={HEAT_TEST_FRAMES} fps={30} width={1920} height={1080} />);
