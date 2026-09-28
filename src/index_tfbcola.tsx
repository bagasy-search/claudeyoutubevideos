import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTfbcola, TOTAL_FRAMES_TFBCOLA } from "./tfbcola/Main_tfbcola";
import { TfbProof, TFB_PROOF_FRAMES } from "./tfb/TfbProof";

export const Root: React.FC = () => (
  <>
    <Composition id="Tfbcola" component={MainTfbcola} durationInFrames={TOTAL_FRAMES_TFBCOLA}
      fps={30} width={1920} height={1080} />
    <Composition id="TfbProof" component={TfbProof} durationInFrames={TFB_PROOF_FRAMES} fps={30} width={1920} height={1080}
      defaultProps={{ bg: "tfbcola/img/proof_bg.jpg", bg2: "tfbcola/img/proof_bg2.jpg", qr: "img/tfbcola/qr_tfbcola.png", cover: "img/tfbcola/portada-coleccion.jpg" }} />
  </>
);
registerRoot(Root);
