import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFb14g, TOTAL_FRAMES_FB14G } from "./cl19b/Main";
import { KitTest } from "./cl19b/KitTest";

const Root: React.FC = () => (
  <>
    <Composition id="Cl19b" component={MainFb14g} durationInFrames={TOTAL_FRAMES_FB14G} fps={30} width={1920} height={1080} />
    <Composition id="Cl19bKit" component={KitTest} durationInFrames={100000} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
