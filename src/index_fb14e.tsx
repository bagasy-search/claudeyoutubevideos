import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFb14e, TOTAL_FRAMES_FB14E } from "./fb14e/Main";
import { KitTest } from "./fb14e/KitTest";

const Root: React.FC = () => (
  <>
    <Composition id="Fb14e" component={MainFb14e} durationInFrames={TOTAL_FRAMES_FB14E} fps={30} width={1920} height={1080} />
    <Composition id="Fb14eKit" component={KitTest} durationInFrames={100000} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
