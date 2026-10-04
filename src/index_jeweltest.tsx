import { registerRoot, Composition } from "remotion";
import { HzJewelTest, JEWEL_TEST_FRAMES } from "./hazel/HzJewelTest";
registerRoot(() => <Composition id="JewelTest" component={HzJewelTest} durationInFrames={JEWEL_TEST_FRAMES} fps={30} width={1920} height={1080} />);
