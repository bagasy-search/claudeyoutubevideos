import { Composition, registerRoot } from "remotion";
import { Main, TOTAL, FPS } from "./sealed01/Main";
const Root = () => <Composition id="Sealed01" component={Main} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />;
registerRoot(Root);
