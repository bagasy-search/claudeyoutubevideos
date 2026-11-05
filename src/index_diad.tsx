// Entrada de la demo DiaD (toma continua Veo + capas + narrador).
import React from "react";
import { Composition, registerRoot } from "remotion";
import { DiaD, LARGO_DD } from "./kits/tomaclips/DiaD";

const Root: React.FC = () => <Composition id="DiaD" component={DiaD} durationInFrames={Math.round(LARGO_DD * 24)} fps={24} width={1920} height={1080} />;
registerRoot(Root);
