import { Composition, registerRoot } from "remotion";
import { Full, TOTAL_S } from "./sachiko9/Full";
const Root = () => (
  <Composition id="Sachiko9" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
