import { Composition, registerRoot } from "remotion";
import { V2 } from "./c23v2/V2";
const Root = () => <Composition id="C23V2" component={V2} durationInFrames={1882} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />;
registerRoot(Root);
