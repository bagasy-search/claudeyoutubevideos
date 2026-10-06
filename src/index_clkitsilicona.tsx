// Entry MÍNIMO del banco de los componentes de la silicona (farm). ENTRY=src/index_clkitsilicona.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClKitSilicona, KITS2 } from "./claudio/ClKitSilicona";
import { BEDS } from "./clkitsilicona_beds";

const Main: React.FC = () => <ClKitSilicona beds={BEDS} />;
const Root = () => <Composition id="Clkitsilicona" component={Main} durationInFrames={KITS2(() => undefined).length * 150} fps={30} width={1920} height={1080} />;
registerRoot(Root);
