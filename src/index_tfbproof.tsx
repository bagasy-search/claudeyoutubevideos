import { Composition, registerRoot } from "remotion";
import React from "react";
import { TfbProof, PROOF_FRAMES } from "./tfb/TfbProof";

export const Root: React.FC = () => (
  <>
    <Composition id="TfbProof" component={TfbProof} durationInFrames={PROOF_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
