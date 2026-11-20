// dom16b — «Le Devolví la Vida a un Hacha Comida por el Óxido». Composición = la de la serie (src/dom16/Serie.tsx).
import React from "react";
import { SerieMain, totalFrames, type EdlSerie } from "../dom16/Serie";
import EDL from "./edl.json";

const E = EDL as unknown as EdlSerie;
export const TOTAL_FRAMES_DOM16B = totalFrames(E);
export const MainDom16b: React.FC = () => <SerieMain e={E} />;
