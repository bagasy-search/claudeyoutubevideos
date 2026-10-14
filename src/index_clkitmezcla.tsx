// Entry MÍNIMO del banco de los componentes de clmezcla. ENTRY=src/index_clkitmezcla.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClKitMezcla, KITS7 } from "./claudio/ClKitMezcla";

const Root = () => <Composition id="Clkitmezcla" component={ClKitMezcla} durationInFrames={KITS7.length * 150} fps={30} width={1920} height={1080} />;
registerRoot(Root);
