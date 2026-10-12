import { Composition, registerRoot } from "remotion";
import { Min1 } from "./suprecio/Min1";
const RootMin1: React.FC = () => (
  <Composition id="Min1" component={Min1} durationInFrames={60 * 30} fps={30} width={1920} height={1080} />
);
registerRoot(RootMin1);
