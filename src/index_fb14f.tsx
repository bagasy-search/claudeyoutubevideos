import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFb14f, TOTAL_FRAMES_FB14F } from "./fb14f/Main";
import { KitTest } from "./fb14f/KitTest";

const Root: React.FC = () => (
  <>
    <Composition id="Fb14f" component={MainFb14f} durationInFrames={TOTAL_FRAMES_FB14F} fps={30} width={1920} height={1080} />
    <Composition id="Fb14fKit" component={KitTest} durationInFrames={100000} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
