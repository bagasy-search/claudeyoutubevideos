import { Composition, registerRoot } from "remotion";
import { Suez, SUEZ_END, FPS } from "./suez20/Suez";
const Root = () => <Composition id="Suez20" component={Suez} durationInFrames={Math.round(SUEZ_END * FPS)} fps={FPS} width={1920} height={1080} />;
registerRoot(Root);
