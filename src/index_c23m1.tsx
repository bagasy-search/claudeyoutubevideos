import { Composition, registerRoot } from "remotion";
import { Min1 } from "./c23m1/Min1";
const Root = () => <Composition id="C23Min1" component={Min1} durationInFrames={1882} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />;
registerRoot(Root);
