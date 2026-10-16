import { Composition, registerRoot } from "remotion";
import { V5, TOTAL, FPS } from "./fortune5/v5/V5";
const Root = () => <Composition id="Fortune5" component={V5} durationInFrames={Math.ceil(TOTAL * FPS)} fps={FPS} width={1920} height={1080} />;
registerRoot(Root);
