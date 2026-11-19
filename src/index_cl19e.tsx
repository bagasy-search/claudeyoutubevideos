import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCl19e, TOTAL_FRAMES_CL19E } from "./cl19e/Main";
import { KitTest } from "./cl19e/KitTest";

const Root: React.FC = () => (
  <>
    <Composition id="Cl19e" component={MainCl19e} durationInFrames={TOTAL_FRAMES_CL19E} fps={30} width={1920} height={1080} />
    <Composition id="Cl19eKit" component={KitTest} durationInFrames={100000} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
