import { registerRoot, Composition } from "remotion";
import { Completo, COMPLETO_DUR } from "./soot06/Completo";

const Root = () => (
  <>
    <Composition id="Soot06" component={Completo} durationInFrames={COMPLETO_DUR} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
