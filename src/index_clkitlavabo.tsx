// Entry MÍNIMO del banco de los componentes de cllavabo. ENTRY=src/index_clkitlavabo.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClKitLavabo, KITSL } from "./claudio/ClKitLavabo";

const Root = () => <Composition id="Clkitlavabo" component={ClKitLavabo} durationInFrames={KITSL.length * 150} fps={30} width={1920} height={1080} />;
registerRoot(Root);
