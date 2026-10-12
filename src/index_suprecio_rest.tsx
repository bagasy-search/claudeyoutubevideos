import { Composition, registerRoot } from "remotion";
import { Rest } from "./suprecio/Rest";
const RootRest: React.FC = () => (
  <Composition id="Rest" component={Rest} durationInFrames={400 * 30} fps={30} width={1920} height={1080} />
);
registerRoot(RootRest);
