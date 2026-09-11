import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTfbdesague, TOTAL_FRAMES_TFBDESAGUE } from "./tfbdesague/Main_tfbdesague";

const Root: React.FC = () => (
  <Composition id="Tfbdesague" component={MainTfbdesague}
    durationInFrames={TOTAL_FRAMES_TFBDESAGUE} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
