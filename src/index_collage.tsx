import { registerRoot, Composition } from "remotion";
import React from "react";
import { MainCollageDemo, TOTAL_FRAMES_COLLAGE } from "./VideoEdit/RemedioCollage";

const CollageRoot: React.FC = () => (
  <>
    <Composition
      id="CollageDemo"
      component={MainCollageDemo}
      durationInFrames={TOTAL_FRAMES_COLLAGE}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(CollageRoot);
