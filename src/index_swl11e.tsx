import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainSwl11e, TOTAL_SWL11E } from "./swl11e/Main";

const Root: React.FC = () => (
  <Composition id="Swl11e" component={MainSwl11e} durationInFrames={TOTAL_SWL11E} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
