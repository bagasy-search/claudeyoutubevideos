import { registerRoot, Composition } from "remotion";
import { ElBoilTest, BOIL_TEST_FRAMES } from "./earl/ElBoilTest";
const Root = () => <Composition id="ElBoilTest" component={ElBoilTest} durationInFrames={BOIL_TEST_FRAMES} fps={30} width={1920} height={1080} />;
registerRoot(Root);
