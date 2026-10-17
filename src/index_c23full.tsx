import { Composition, registerRoot } from "remotion";
import { Full, FULL_FRAMES } from "./c23full/Full";
const Root = () => <Composition id="C23Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />;
registerRoot(Root);
