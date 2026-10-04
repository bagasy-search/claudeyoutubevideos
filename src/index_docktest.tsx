import { registerRoot, Composition } from "remotion";
import { ElDockTest, DOCK_TEST_FRAMES } from "./earl/ElDockTest";
registerRoot(() => <Composition id="DockTest" component={ElDockTest} durationInFrames={DOCK_TEST_FRAMES} fps={30} width={1920} height={1080} />);
