// Composiciones de Blanquito. <RootStickman /> es un fragmento: se puede montar en cualquier Root.
import React from "react";
import { Composition } from "remotion";
import { StickmanRef, StickmanCaras, StickmanHoja, StickmanVuelta, StickmanPoses, StickmanAccion, StickmanEnFondoQA, FONDOS_QA, StickmanDemo, LISTA_CARAS, HOJA_REF, ACCIONES_QA } from "./composiciones";

export const RootStickman: React.FC = () => (
  <>
    <Composition id="StickmanRef" component={StickmanRef} durationInFrames={1} fps={30} width={1376} height={768} />
    <Composition id="StickmanCaras" component={StickmanCaras} durationInFrames={LISTA_CARAS.length} fps={30} width={480} height={420} />
    <Composition id="StickmanHoja" component={StickmanHoja} durationInFrames={HOJA_REF.length} fps={30} width={344} height={256} />
    <Composition id="StickmanVuelta" component={StickmanVuelta} durationInFrames={5} fps={30} width={420} height={768} />
    <Composition id="StickmanPoses" component={StickmanPoses} durationInFrames={ACCIONES_QA.length} fps={30} width={400} height={420} />
    <Composition id="StickmanAccion" component={StickmanAccion} durationInFrames={300} fps={30} width={420} height={560} defaultProps={{ accion: "saludar", expr: "feliz" as const }} />
    <Composition id="StickmanEnFondo" component={StickmanEnFondoQA} durationInFrames={FONDOS_QA.length} fps={30} width={1920} height={1080} />
    <Composition id="StickmanDemo" component={StickmanDemo} durationInFrames={600} fps={30} width={1920} height={1080} />
  </>
);
