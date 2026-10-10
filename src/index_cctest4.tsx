// Prueba de componentes ccfrijoles (cuadros fijos): npx remotion still src/index_cctest.tsx <id> out.png --frame=N
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClBookPage, ClQRCard, ClBeforeAfter, ClCheck } from "./claudio/ClCards";
import { ClReceipt } from "./claudio/ClBandeja";
import { ClVideoRef, ClNotebook } from "./claudio/ClSarro";
import { ClChip } from "./claudio/ClOverlays";
import { ClTimer30 } from "./claudio/ClGauges";
import { ClBeanCut, ClRecipeCard, ClRibCut, ClGreenClock, ClCoffeeThermo, ClSmellClock, ClSkinLayers, ClMeatClock } from "./claudio/ClCocina";
import { COMPS } from "./cccarne/comps";
const C: Record<string, React.FC<any>> = { ClBookPage, ClQRCard, ClReceipt, ClBeforeAfter, ClNotebook, ClCheck, ClVideoRef, ClChip, ClTimer30, ClBeanCut, ClRecipeCard, ClRibCut, ClGreenClock, ClCoffeeThermo, ClSmellClock, ClSkinLayers, ClMeatClock };
registerRoot(() => (
  <>
    {Object.entries(COMPS).map(([id, [c, p]]) => (
      <Composition key={id} id={id} component={C[c]} defaultProps={{ bed: "img/ccfrijoles/bed_corte.jpg", ...p }} durationInFrames={id === "reloj" ? 400 : 240} fps={30} width={1920} height={1080} />
    ))}
  </>
));
