import { registerRoot, Composition } from "remotion";
import { Min1 } from "./sucaja/Min1";
registerRoot(() => (
  <Composition id="Min1" component={Min1} durationInFrames={65 * 30} fps={30} width={1920} height={1080} />
));
