import { registerRoot, Composition } from "remotion";
import { Soot09, SOOT09_DUR } from "./soot09/Soot09";

const Root = () => (
  <>
    <Composition id="Soot09" component={Soot09} durationInFrames={SOOT09_DUR} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
