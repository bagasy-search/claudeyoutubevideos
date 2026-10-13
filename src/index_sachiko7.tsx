import { Composition, registerRoot } from "remotion";
import React from "react";
import { Full, TOTAL_S } from "./sachiko7/Full";

const RootSachiko7: React.FC = () => (
  <Composition id="Sachiko7" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
);
registerRoot(RootSachiko7);
