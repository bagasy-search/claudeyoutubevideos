import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFb14g, TOTAL_FRAMES_FB14G } from "./fb14g/Main";
import { KitTest } from "./fb14g/KitTest";

const Root: React.FC = () => (
  <>
    <Composition id="Fb14g" component={MainFb14g} durationInFrames={TOTAL_FRAMES_FB14G} fps={30} width={1920} height={1080} />
    <Composition id="Fb14gKit" component={KitTest} durationInFrames={100000} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
