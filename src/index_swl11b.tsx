import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainSwl11b, TOTAL_SWL11B } from "./swl11b/Main";

const Root: React.FC = () => (
  <Composition id="Swl11b" component={MainSwl11b} durationInFrames={TOTAL_SWL11B} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
