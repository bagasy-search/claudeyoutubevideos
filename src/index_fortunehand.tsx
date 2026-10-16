import { Composition, registerRoot } from "remotion";
import { Hand, HAND_END, FPS } from "./fortune5/hand/Hand";
const Root = () => <Composition id="FortuneHand" component={Hand} durationInFrames={Math.ceil(HAND_END * FPS)} fps={FPS} width={1920} height={1080} />;
registerRoot(Root);
