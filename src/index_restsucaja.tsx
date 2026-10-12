import { registerRoot, Composition } from "remotion";
import { Rest } from "./sucaja/Rest";
registerRoot(() => (
  <Composition id="Rest" component={Rest} durationInFrames={400 * 30} fps={30} width={1920} height={1080} />
));
