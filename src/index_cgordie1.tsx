import { Composition, registerRoot } from "remotion";
import { Main, TOTAL } from "./cgordie1/Main";
import { FPS } from "./cgordie1/lib";
const Root = () => <Composition id="CGordie1" component={Main} durationInFrames={Math.ceil(TOTAL * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{ farm: true, avatar: true }} />;
registerRoot(Root);
