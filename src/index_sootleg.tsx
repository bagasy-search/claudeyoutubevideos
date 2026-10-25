import { registerRoot, Composition } from "remotion";
import { Soot, DUR } from "./soot/Main";

const Root = () => <Composition id="Soot" component={Soot} durationInFrames={DUR} fps={30} width={1920} height={1080} />;

registerRoot(Root);
