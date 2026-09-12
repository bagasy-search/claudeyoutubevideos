import React from "react";
import { registerRoot, Composition } from "remotion";
import "./index.css";
import { MainVslcurso, TOTAL_FRAMES_VSLCURSO } from "./VideoEdit/Main_vslcurso";

// Entry AISLADO para el render del VSL de /curso.
// La composición se declara ACÁ y no en un Root aparte: la compuerta de pre-vuelo del farm
// busca el id literal en este archivo, y con la indirección `import { RootVslcurso }` no lo
// ve. Se usa createElement en vez de JSX porque este archivo es .ts, no .tsx.
const RootVslcursoEntry: React.FC = () =>
  React.createElement(Composition, {
    id: "Vslcurso",
    component: MainVslcurso,
    durationInFrames: TOTAL_FRAMES_VSLCURSO,
    fps: 30,
    width: 1920,
    height: 1080,
  });

registerRoot(RootVslcursoEntry);
