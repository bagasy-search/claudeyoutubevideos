// Entrada de la demo EpicaVeo (toma continua con clips Veo encadenados).
import React from "react";
import { Composition, registerRoot } from "remotion";
import { EpicaVeo, LARGO_VEO } from "./kits/tomaclips/EpicaVeo";

const Root: React.FC = () => <Composition id="EpicaVeo" component={EpicaVeo} durationInFrames={Math.round(LARGO_VEO * 24)} fps={24} width={1920} height={1080} />;
registerRoot(Root);
