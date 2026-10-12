import { registerRoot, Composition } from "remotion";
import { Full } from "./sucaja/Full";
registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(988.8 * 30)} fps={30} width={1920} height={1080} />
));
