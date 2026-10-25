import { registerRoot, Composition } from "remotion";
import { Piloto, PILOTO_DUR } from "./soot3/Piloto";
import { Completo, COMPLETO_DUR } from "./soot3/Completo";

const Root = () => (
  <>
    <Composition id="Soot3Piloto" component={Piloto} durationInFrames={PILOTO_DUR} fps={30} width={1920} height={1080} />
    <Composition id="Soot3Completo" component={Completo} durationInFrames={COMPLETO_DUR} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
