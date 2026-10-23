import { registerRoot, Composition } from "remotion";
import { Full, DUR } from "./stickcine/Full";

const Root = () => <Composition id="Full" component={Full} durationInFrames={DUR} fps={30} width={1920} height={1080} />;

registerRoot(Root);
