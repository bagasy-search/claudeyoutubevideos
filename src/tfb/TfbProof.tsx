// Banco de prueba del kit TFB: cada componente sobre footage real a 1920x1080 (escala 1:1), 90 cuadros cada uno.
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { TfbCam, TfbLabel, TfbScribble, TfbZoomCircle, TfbStepCounter, TfbTimingDial, TfbLayerCut, TfbRevealWipe, TfbProportion, TfbErrorList, TfbQRCard, TfbFreeze } from ".";

const BG = "img/tfbpiedra/proof_bg.jpg", BG2 = "img/tfbpiedra/proof_bg2.jpg";
const Bg: React.FC<{ src?: string }> = ({ src = BG }) => <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
const N = 90;
const items: [string, React.ReactNode][] = [
  ["label", <><Bg /><TfbLabel dur={N} kicker="Paso clave" text="La prueba de la esquina" /></>],
  ["scribble", <><Bg /><TfbScribble dur={N} kind="arrow" from={[1500, 250]} to={[1050, 560]} label="grava compactada" labelAt={[1560, 200]} /><TfbScribble dur={N} kind="circle" box={[860, 480, 460, 320]} delay={20} color="#E0342A" /></>],
  ["zoom", <TfbZoomCircle dur={N} path={[[0, 1350, 700], [60, 1250, 650]]} label="piedras firmes" labelDx={-560} labelDy={-240}><Bg src={BG2} /></TfbZoomCircle>],
  ["step", <><Bg /><TfbStepCounter dur={N} n={3} total={7} title="El colado" /></>],
  ["dial", <><Bg /><TfbTimingDial dur={N} title="EL PUNTO DE LAVADO" needle={[[0, 0.05], [30, 0.2], [70, 0.5]]} /></>],
  ["layer", <><Bg /><TfbLayerCut dur={N} title="EL CORTE DEL PISO" washAt={48} stagger={10} washLabel="Se destapa 1/3" slopeLabel="1 cm por metro" layers={[{ label: "Tierra firme", kind: "soil", h: 90 }, { label: "Grava compactada", dim: "10 cm", kind: "gravel", h: 110 }, { label: "Concreto con piedra", dim: "8 a 10 cm", kind: "concrete", h: 120 }]} /></>],
  ["wipe", <TfbRevealWipe dur={N} before={<Bg />} after={<Bg src={BG2} />} beforeLabel="ANTES" afterLabel="DESPUÉS" />],
  ["prop", <><Bg /><TfbProportion dur={N} title="CON EL MISMO BALDE" note="agua justa: que no chorree" items={[{ n: 1, label: "Cemento", color: "#9a9a95" }, { n: 2, label: "Arena", color: "#d8c089" }, { n: 3, label: "Piedra", color: "#a4553a" }]} /></>],
  ["errors", <><Bg /><TfbErrorList dur={N} title="LOS 3 ERRORES" items={["Lavar antes de tiempo", "Mucha agua en la mezcla", "El agua al desagüe"]} ats={[14, 30, 46]} /></>],
  ["qr", <><Bg /><TfbQRCard dur={N} qr="img/tfbpiedra/qr_tfbpiedra.png" cover="img/tfbpiedra/portada-coleccion.jpg" line1="La colección del canal" line2="Escanea con tu teléfono" /></>],
  ["freeze", <TfbFreeze dur={N} at={0} media={<Bg src={BG2} />} tag="MIRA ESTO" focus={[1300, 700]}><TfbScribble dur={N} kind="underline" from={[1000, 900]} to={[1600, 880]} delay={10} /></TfbFreeze>],
  ["cam", <TfbCam dur={N} keys={[[0, 1, 0, 0], [N, 1.15, -80, -30]]} shakes={[[20, 18]]} whipOut={10} flash={[20]}><Bg /></TfbCam>],
];
export const PROOF_FRAMES = items.length * N + N;
export const TfbProof: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {items.map(([k, node], i) => <Sequence key={k} from={i * N} durationInFrames={N}>{node}</Sequence>)}
  </AbsoluteFill>
);
