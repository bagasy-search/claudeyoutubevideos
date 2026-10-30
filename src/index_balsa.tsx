// Entrada de la escena de prueba «balsa» (estilo arcilla roja + balsa blanca). Stills: still.mjs --entry src/index_balsa.tsx
import React from "react";
import { Composition, registerRoot } from "remotion";
import { BalsaEscena } from "./balsa/Balsa";

const Root: React.FC = () => <Composition id="Balsa" component={BalsaEscena} durationInFrames={300} fps={30} width={1920} height={1080} />;
registerRoot(Root);
