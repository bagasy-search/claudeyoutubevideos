import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainLamina15, TOTAL_FRAMES_LAMINA15 } from "./VideoEdit/Main_lamina15";

// Entry AISLADO para el farm. El Root compartido importa TODOS los Main_* y alguno
// depende de un public/*.json que está en .gitignore → bundle 404 en la nube.
// El pre-vuelo de farm.mjs además busca el id de la composición en ESTE archivo,
// así que la <Composition> se declara inline, no sólo importando un Root.
export const RootLamina15: React.FC = () => (
  <Composition
    id="Lamina15"
    component={MainLamina15}
    durationInFrames={TOTAL_FRAMES_LAMINA15}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RootLamina15);
