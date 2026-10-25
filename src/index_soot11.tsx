import { registerRoot, Composition } from "remotion";
import { Prueba } from "./soot11/Prueba";
import { Completo, COMPLETO_DUR } from "./soot11/Completo";

const Root = () => (
  <>
    <Composition id="S11Prueba" component={Prueba} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="S11Completo" component={Completo} durationInFrames={COMPLETO_DUR} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
