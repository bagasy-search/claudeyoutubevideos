// Entry MÍNIMO del banco de los componentes de cldescarga. ENTRY=src/index_clkitdescarga.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClKitDescarga, KITS8 } from "./claudio/ClKitDescarga";

const Root = () => <Composition id="Clkitdescarga" component={ClKitDescarga} durationInFrames={KITS8.length * 150} fps={30} width={1920} height={1080} />;
registerRoot(Root);
