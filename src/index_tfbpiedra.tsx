import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTfbpiedra, TOTAL_FRAMES_TFBPIEDRA } from "./tfbpiedra/Main_tfbpiedra";
import { TfbProof, PROOF_FRAMES } from "./tfb/TfbProof";

export const Root: React.FC = () => (
  <>
    <Composition id="Tfbpiedra" component={MainTfbpiedra} durationInFrames={TOTAL_FRAMES_TFBPIEDRA}
      fps={30} width={1920} height={1080} />
    <Composition id="TfbProof" component={TfbProof} durationInFrames={PROOF_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
