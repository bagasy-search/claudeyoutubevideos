import { registerRoot, Composition } from "remotion";
import { HzSoldTest, SOLD_TEST_FRAMES } from "./hazel/HzSoldTest";
registerRoot(() => <Composition id="SoldTest" component={HzSoldTest} durationInFrames={SOLD_TEST_FRAMES} fps={30} width={1920} height={1080} />);
