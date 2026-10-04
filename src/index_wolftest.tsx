import { registerRoot, Composition } from "remotion";
import { HkWolfTest, WOLF_TEST_FRAMES } from "./hank/HkWolfTest";
registerRoot(() => <Composition id="WolfTest" component={HkWolfTest} durationInFrames={WOLF_TEST_FRAMES} fps={30} width={1920} height={1080} />);
