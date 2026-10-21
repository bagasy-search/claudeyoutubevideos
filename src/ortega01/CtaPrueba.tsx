// prueba de la pieza de la guía (sólo stills; va dentro del video después del OK del minuto 1)
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { P } from "./lib";
import { GuiaCTA, GUIA_PROVISORIA } from "./cta_guia";
export const CtaPrueba: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return <AbsoluteFill style={{ background: "#000" }}>
    <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.45)" }} />
    <GuiaCTA t={t} g={GUIA_PROVISORIA} at={0.2} abre={1.4} pasa={2.2} descAt={3.2} out={9} />
  </AbsoluteFill>;
};
