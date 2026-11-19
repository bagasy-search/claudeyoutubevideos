// dom16a — «Le Devolví la Vida a un Tornillo de Banco Comido por el Óxido». Composición = la de la serie (src/dom16/Serie.tsx).
import React from "react";
import { SerieMain, totalFrames, type EdlSerie } from "../dom16/Serie";
import EDL from "./edl.json";

const E = EDL as unknown as EdlSerie;
export const TOTAL_FRAMES_DOM16A = totalFrames(E);
export const MainDom16a: React.FC = () => <SerieMain e={E} />;
