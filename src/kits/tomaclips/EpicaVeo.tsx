// Demo: 30 s en una sola toma (fondo marino -> sale del agua -> atraviesa la nube -> Everest), 4 tomas Veo
// encadenadas (cada una arranca del último cuadro de la anterior), así que se pegan sin fundido.
import React from "react";
import { TomaClips, Toma, largoTomas } from "./TomaClips";

const D = "epica_veo/";
export const TOMAS_VEO: Toma[] = [
  { src: D + "v1.mp4", dura: 7.88 },
  { src: D + "v2.mp4", desde: 0.04, dura: 7.84 },
  { src: D + "v3.mp4", desde: 0.04, dura: 7.84 },
  { src: D + "v4.mp4", desde: 0.04, dura: 7.84, empuje: 1.1 },
];
export const LARGO_VEO = largoTomas(TOMAS_VEO);

export const EpicaVeo: React.FC = () => (
  <TomaClips tomas={TOMAS_VEO} golpes={[
    { src: D + "whoosh_nube.mp3", t: 9.6, vol: 0.35, dura: 2 },
    { src: D + "swell.mp3", t: 16.2, vol: 0.4, dura: 3 },
    { src: D + "deep-cinematic-impact-1.mp3", t: 18.3, vol: 0.45, dura: 3 },
  ]} />
);
