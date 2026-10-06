// Entry MÍNIMO del banco de prueba del kit Rhonda (farm). Uso: ENTRY=src/index_rhkittest.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { RhKitTest, KIT } from "./rhonda/RhKitTest";
const Root = () => <Composition id="Rhkittest" component={RhKitTest} durationInFrames={KIT.length * 150} fps={30} width={1920} height={1080} />;
registerRoot(Root);
