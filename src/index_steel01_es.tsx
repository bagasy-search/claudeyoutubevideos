import { Composition, registerRoot } from "remotion";
import { Main, TOTAL, FPS } from "./steel01_es/Main";
const Root = () => <Composition id="Steel01Es" component={Main} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} defaultProps={{ farm: true }} />;
registerRoot(Root);
