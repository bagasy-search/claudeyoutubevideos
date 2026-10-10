// Prueba de componentes ccfrijoles (cuadros fijos): npx remotion still src/index_cctest.tsx <id> out.png --frame=N
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClBookPage, ClQRCard, ClBeforeAfter, ClCheck } from "./claudio/ClCards";
import { ClReceipt } from "./claudio/ClBandeja";
import { ClVideoRef, ClNotebook } from "./claudio/ClSarro";
import { ClChip } from "./claudio/ClOverlays";
import { ClTimer30 } from "./claudio/ClGauges";
import { ClBeanCut, ClRecipeCard } from "./claudio/ClCocina";
import { COMPS } from "./ccfrijoles/comps";
const C: Record<string, React.FC<any>> = { ClBookPage, ClQRCard, ClReceipt, ClBeforeAfter, ClNotebook, ClCheck, ClVideoRef, ClChip, ClTimer30, ClBeanCut, ClRecipeCard };
registerRoot(() => (
  <>
    {Object.entries(COMPS).map(([id, [c, p]]) => (
      <Composition key={id} id={id} component={C[c]} defaultProps={{ bed: "img/ccfrijoles/bed_corte.jpg", ...p }} durationInFrames={id === "corte" ? 345 : 240} fps={30} width={1920} height={1080} />
    ))}
  </>
));
