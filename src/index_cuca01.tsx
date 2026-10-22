import { Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES } from "./cuca01/Min1";
import { FULL_FRAMES, Resto } from "./cuca01/Resto";
// el video entero: minuto 1 tal cual fue aprobado en stills + el resto con el mismo mundo y la misma cámara
const Full = () => (useCurrentFrame() < MIN1_FRAMES ? <Min1 /> : <Resto />);
const Root = () => (
  <>
    <Composition id="Cuca01Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Cuca01Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
