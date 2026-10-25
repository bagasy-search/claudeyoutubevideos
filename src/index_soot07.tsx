import { registerRoot, Composition } from "remotion";
import { Noche, NOCHE_DUR } from "./soot07/Noche";

const Root = () => <Composition id="Soot07" component={Noche} durationInFrames={NOCHE_DUR} fps={30} width={1920} height={1080} />;

registerRoot(Root);
