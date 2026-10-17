import { Composition, registerRoot } from "remotion";
import { Main, TOTAL } from "./orbit01_es/Main";
import { FPS } from "./orbit01_es/lib";
const Root = () => <Composition id="Orbit01Es" component={Main} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} defaultProps={{ farm: true }} />;
registerRoot(Root);
