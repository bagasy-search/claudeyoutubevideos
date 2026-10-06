import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainPinfactura, TOTAL_FRAMES_PINFACTURA } from "./pinfactura/Main_pinfactura";

const Root: React.FC = () => (
  <Composition id="Pinfactura" component={MainPinfactura}
    durationInFrames={TOTAL_FRAMES_PINFACTURA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
