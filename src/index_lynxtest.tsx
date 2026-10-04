import { registerRoot, Composition } from "remotion";
import { HkLynxTest, LYNX_TEST_FRAMES } from "./hank/HkLynxTest";
registerRoot(() => <Composition id="LynxTest" component={HkLynxTest} durationInFrames={LYNX_TEST_FRAMES} fps={30} width={1920} height={1080} />);
