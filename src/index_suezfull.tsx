import { Composition, registerRoot } from "remotion";
import { SuezFull, FULL_END, FPS } from "./suezfull/SuezFull";
const Root = () => <Composition id="SuezFull" component={SuezFull} durationInFrames={Math.round(FULL_END * FPS)} fps={FPS} width={1920} height={1080} />;
registerRoot(Root);
