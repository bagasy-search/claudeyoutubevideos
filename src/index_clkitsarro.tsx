// Entry MÍNIMO del banco de los componentes del sarro (farm). ENTRY=src/index_clkitsarro.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClKitSarro, KITS } from "./claudio/ClKitSarro";
import { BEDS } from "./clkitsarro_beds";

const Main: React.FC = () => <ClKitSarro beds={BEDS} />;
const Root = () => <Composition id="Clkitsarro" component={Main} durationInFrames={KITS(() => undefined).length * 150} fps={30} width={1920} height={1080} />;
registerRoot(Root);
