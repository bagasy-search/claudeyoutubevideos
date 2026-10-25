import { Composition, registerRoot } from "remotion";
import { FULL_FRAMES, Main } from "./cuca30trucos/Main";
const Root = () => <Composition id="Full" component={Main} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />;
registerRoot(Root);
