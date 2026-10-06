// Entry MÍNIMO del banco de los componentes de la lavadora (farm). ENTRY=src/index_clkitlavadora.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClKitLavadora, KITL } from "./claudio/ClKitLavadora";
import { BEDS } from "./clkitlavadora_beds";

const Main: React.FC = () => <ClKitLavadora beds={BEDS} />;
const Root = () => <Composition id="Clkitlavadora" component={Main} durationInFrames={KITL(() => undefined).length * 150} fps={30} width={1920} height={1080} />;
registerRoot(Root);
