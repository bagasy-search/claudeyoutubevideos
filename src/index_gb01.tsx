import { Composition, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./gb01/Min1";
import { Video } from "./gb01/v2/Video";
import { FRAMES } from "./gb01/v2/datos";
// GB01MIN1 = minuto 1 v1 (entregado 20-oct). GB01V2 = el video entero v2 (hub con el monje recortado + portales).
// Las ...SFX = la misma escena con los efectos sonando adentro, para revisar en Studio. Audio final: mezcla aparte + encfin.
const Root = () => (
  <>
    <Composition id="GB01MIN1" component={Min1} defaultProps={{ farm: true }} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="GB01MIN1SFX" component={Min1} defaultProps={{ farm: false }} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="GB01V2" component={Video} defaultProps={{ farm: true }} durationInFrames={FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="GB01V2SFX" component={Video} defaultProps={{ farm: false }} durationInFrames={FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
