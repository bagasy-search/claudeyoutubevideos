// ohf9na · CUADRO 0 = la miniatura sin texto. A los F0 s, CORTE SECO al avatar.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./lib";

export const F0 = 1.2;

export const Frame0: React.FC<{ t: number }> = () => <AbsoluteFill><Img src={staticFile(P + "f0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>;
