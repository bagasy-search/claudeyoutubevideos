import { Composition, registerRoot } from "remotion";
import { Main, TOTAL } from "./orbit01/Main";
import { FPS } from "./orbit01/lib";
const Root = () => <Composition id="Orbit01" component={Main} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} defaultProps={{ farm: true }} />;
registerRoot(Root);
