import { registerRoot, Composition } from "remotion";
import { Full2 } from "./sucaja/Full2";
registerRoot(() => (
  <Composition id="Full2" component={Full2} durationInFrames={Math.round(988.8 * 30)} fps={30} width={1920} height={1080} />
));
