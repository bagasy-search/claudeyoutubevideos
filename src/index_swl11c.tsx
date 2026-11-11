import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainSwl11c, TOTAL_SWL11C } from "./swl11c/Main";

const Root: React.FC = () => (
  <Composition id="Swl11c" component={MainSwl11c} durationInFrames={TOTAL_SWL11C} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
