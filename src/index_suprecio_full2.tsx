import { Composition, registerRoot } from "remotion";
import { Full2 } from "./suprecio/Full2";
const RootFull2: React.FC = () => (
  <Composition id="Full2" component={Full2} durationInFrames={962 * 30} fps={30} width={1920} height={1080} />
);
registerRoot(RootFull2);
