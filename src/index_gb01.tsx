import { Composition, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./gb01/Min1";
// GB01MIN1 = la del farm (sin audio adentro: voz + efectos se mezclan aparte con mezcla_neon.py y los pega encfin).
// GB01MIN1SFX = la misma escena con los efectos sonando adentro, para revisar en Studio.
const Root = () => (
  <>
    <Composition id="GB01MIN1" component={Min1} defaultProps={{ farm: true }} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="GB01MIN1SFX" component={Min1} defaultProps={{ farm: false }} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
