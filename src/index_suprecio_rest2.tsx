import { Composition, registerRoot } from "remotion";
import { Rest2 } from "./suprecio/Rest2";
const RootRest2: React.FC = () => (
  <Composition id="Rest2" component={Rest2} durationInFrames={962 * 30} fps={30} width={1920} height={1080} />
);
registerRoot(RootRest2);
