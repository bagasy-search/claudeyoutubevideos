// Entry MÍNIMO del banco de los componentes de las bandejas (farm). ENTRY=src/index_clkitbandeja.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClKitBandeja, KITB } from "./claudio/ClKitBandeja";
import { BEDS } from "./clkitbandeja_beds";

const Main: React.FC = () => <ClKitBandeja beds={BEDS} />;
const Root = () => <Composition id="Clkitbandeja" component={Main} durationInFrames={KITB(() => undefined).length * 150} fps={30} width={1920} height={1080} />;
registerRoot(Root);
