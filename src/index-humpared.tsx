import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainHumpared, TOTAL_FRAMES_HUMPARED } from "./VideoEdit/Main_humpared";

// Entry AISLADO para el farm. El Root compartido importa TODOS los Main_* y alguno
// depende de un public/*.json en .gitignore → bundle 404 en la nube. El pre-vuelo de
// farm.mjs busca el id de la composición en ESTE archivo, así que la <Composition>
// se declara inline, no sólo importando un Root.
export const RootHumpared: React.FC = () => (
  <Composition
    id="Humpared"
    component={MainHumpared}
    durationInFrames={TOTAL_FRAMES_HUMPARED}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RootHumpared);
