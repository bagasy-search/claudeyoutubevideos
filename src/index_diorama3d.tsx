// Entrada de Remotion del Diorama 3D (foto -> mundo con relieve, toma continua).
// Stills: node D:/claude-brain/plantillas/stills/still.mjs --raiz . --entry src/index_diorama3d.tsx --pub public --comp EpicaEverest --out <dir> 0 5 10 ...
import React from "react";
import { Composition, registerRoot } from "remotion";
import { EpicaEverest } from "./kits/diorama3d/EpicaEverest";

const Root: React.FC = () => <Composition id="EpicaEverest" component={EpicaEverest} durationInFrames={900} fps={30} width={1920} height={1080} />;
registerRoot(Root);
