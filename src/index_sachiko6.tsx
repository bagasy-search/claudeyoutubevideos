import { Composition, registerRoot } from "remotion";
import { Full, TOTAL_S } from "./sachiko6/Full";
const RootSachiko6 = () => (
  <Composition id="Sachiko6" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
);
registerRoot(RootSachiko6);
