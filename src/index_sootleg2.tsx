import { registerRoot, Composition } from "remotion";
import { Soot2, DUR } from "./soot2/Main";

const Root = () => <Composition id="Soot2" component={Soot2} durationInFrames={DUR} fps={30} width={1920} height={1080} />;

registerRoot(Root);
