import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCl19c, TOTAL_FRAMES_CL19C } from "./cl19c/Main";
import { KitTest } from "./cl19c/KitTest";

const Root: React.FC = () => (
  <>
    <Composition id="Cl19c" component={MainCl19c} durationInFrames={TOTAL_FRAMES_CL19C} fps={30} width={1920} height={1080} />
    <Composition id="Cl19cKit" component={KitTest} durationInFrames={100000} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
