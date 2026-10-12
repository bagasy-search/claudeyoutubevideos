import React from "react";
import { registerRoot, Composition } from "remotion";
import { Pasada2 } from "./pasada2/Pasada2";
import { FINAL_OFERTA_TOTAL_S } from "./suoferta/FinalOferta";

const FRAMES = Math.round(FINAL_OFERTA_TOTAL_S * 30);

const Root: React.FC = () => (
  <>
    <Composition id="Pasada2" component={Pasada2} durationInFrames={FRAMES} fps={30} width={1920} height={1080} defaultProps={{ noPhotos: false }} />
    <Composition id="Pasada2NoFotos" component={Pasada2} durationInFrames={FRAMES} fps={30} width={1920} height={1080} defaultProps={{ noPhotos: true }} />
  </>
);
registerRoot(Root);
