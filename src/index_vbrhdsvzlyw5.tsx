import React from "react";
import {Composition, registerRoot} from "remotion";
import {
  MainVbrhdsvzlyw5,
  TOTAL_FRAMES_VBRHDSVZLYW5,
} from "./VideoEdit/Main_vbrhdsvzlyw5";

export const Vbrhdsvzlyw5Root: React.FC = () => (
  <>
    <Composition
      id="Vbrhdsvzlyw5"
      component={MainVbrhdsvzlyw5}
      durationInFrames={TOTAL_FRAMES_VBRHDSVZLYW5}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Vbrhdsvzlyw5Root);
