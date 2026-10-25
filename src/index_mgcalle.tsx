// mgcalle: escena de prueba de la calle (motion design cutout, sin clips de IA). Comp "Full" para el farm.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { Escena } from "./mgcalle/Escena";

const Root: React.FC = () => (
  <Composition id="Full" component={Escena} durationInFrames={360} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
