import { Composition, registerRoot } from "remotion";
import { Demo, DEMO_FRAMES } from "./kits/neon/Demo";
// NEONDEMO = la del farm (sin audio adentro: la pista de efectos se mezcla aparte con mezcla_neon.py y la pega encfin).
// NEONDEMOSFX = la misma escena con los efectos sonando adentro, para revisar en Studio.
const Root = () => (
  <>
    <Composition id="NEONDEMO" component={Demo} defaultProps={{ farm: true }} durationInFrames={DEMO_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="NEONDEMOSFX" component={Demo} defaultProps={{ farm: false }} durationInFrames={DEMO_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
