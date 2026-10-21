import { Composition, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./gb01es/Min1";
import { Video } from "./gb01es/v2/Video";
import { FRAMES } from "./gb01es/v2/datos";
// gb01es = gb01 v2 re-locutado en español (El Cerebro de Cristal): mismo mundo y héroes, tiempos EN→ES por ./gb01es/tiempo_es.
const Root = () => (
  <>
    <Composition id="GB01ESMIN1" component={Min1} defaultProps={{ farm: true }} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="GB01ES" component={Video} defaultProps={{ farm: true }} durationInFrames={FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="GB01ESSFX" component={Video} defaultProps={{ farm: false }} durationInFrames={FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
