// index_tcsalmetal_probe.tsx — SOLO para sacar stills de los componentes nuevos antes del render.
// ⛔ No entra en la ref del farm. Compuerta de la skill: un still cuesta segundos y caza `theme`
//    como string, paneles vacíos por props de forma equivocada y sellos aterrizando en el centro.
import "./tcsalmetal/index.css";
import { AbsoluteFill, Composition, registerRoot } from "remotion";
import React from "react";
import { Foto, SelloNum, CtaFinal } from "./tcsalmetal/Piezas";

const Probe: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    <Foto src="img/tcsalmetal/tsmet_0001.jpg" seed={3} />
    <SelloNum num="5" pie="LA CHIMENEA" />
  </AbsoluteFill>
);

const ProbeCta: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
    <Foto src="img/tcsalmetal/tsmet_0002.jpg" seed={5} />
    <CtaFinal head="LA MINI ESTUFA CON DOS LATAS" sub="La semana que viene · suscríbete para no perdértela" />
  </AbsoluteFill>
);

const Root: React.FC = () => (
  <>
    <Composition id="Probe" component={Probe} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="ProbeCta" component={ProbeCta} durationInFrames={90} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
