// suoferta · Pasada2: la composición entregada (FinalOferta) + la capa de fotos de Claudio.
import React from "react";
import { AbsoluteFill } from "remotion";
import { FinalOferta } from "../suoferta/FinalOferta";
import { PhotoLayer } from "./PhotoLayer";

export const Pasada2: React.FC<{ noPhotos?: boolean }> = ({ noPhotos }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <FinalOferta />
    <PhotoLayer enabled={!noPhotos} />
  </AbsoluteFill>
);
