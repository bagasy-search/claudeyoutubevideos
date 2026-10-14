// Entry MÍNIMO del banco de los componentes de clcolchon. ENTRY=src/index_clkitcolchon.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClKitColchon, KITS9 } from "./claudio/ClKitColchon";

const Root = () => <Composition id="Clkitcolchon" component={ClKitColchon} durationInFrames={KITS9.length * 150} fps={30} width={1920} height={1080} />;
registerRoot(Root);
