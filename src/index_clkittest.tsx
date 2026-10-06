// Entry MÍNIMO del banco del kit Claudio (farm). Uso: ENTRY=src/index_clkittest.tsx · beds = camas de stock reales del video
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClKitTest, KIT } from "./claudio/ClKitTest";
import { BEDS } from "./clkittest_beds";

const Main: React.FC = () => <ClKitTest beds={BEDS} />;
const Root = () => <Composition id="Clkittest" component={Main} durationInFrames={KIT(() => undefined).length * 150} fps={30} width={1920} height={1080} />;
registerRoot(Root);
