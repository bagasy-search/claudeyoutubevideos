// Entry MÍNIMO del banco de los componentes del moho (farm). ENTRY=src/index_clkitmoho.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClKitMoho, KITM } from "./claudio/ClKitMoho";
import { BEDS } from "./clkitmoho_beds";

const Main: React.FC = () => <ClKitMoho beds={BEDS} />;
const Root = () => <Composition id="Clkitmoho" component={Main} durationInFrames={KITM(() => undefined).length * 150} fps={30} width={1920} height={1080} />;
registerRoot(Root);
