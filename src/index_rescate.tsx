// Entrada de «rescate» (storyboard 13–36: tiburón muerde la balsa, persecución y rescate en helicóptero).
import React from "react";
import { Composition, registerRoot } from "remotion";
import { RescateEscena } from "./balsa/Rescate";

const Root: React.FC = () => <Composition id="Rescate" component={RescateEscena} durationInFrames={1026} fps={30} width={1920} height={1080} />;
registerRoot(Root);
