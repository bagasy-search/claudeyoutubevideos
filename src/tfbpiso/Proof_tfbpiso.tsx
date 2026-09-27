// Banco de prueba de los componentes Tfb* sobre un fondo real del set (stills de revisión, no va al render).
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { TfbLayerCut } from "../tfb/TfbLayerCut";
import { TfbWipeCompare } from "../tfb/TfbWipeCompare";
import { TfbBroomTexture } from "../tfb/TfbBroomTexture";
import { TfbZoomCircle } from "../tfb/TfbZoomCircle";
import { TfbScribble } from "../tfb/TfbScribble";
import { TfbStepCounter } from "../tfb/TfbStepCounter";
import { TfbCureCalendar } from "../tfb/TfbCureCalendar";
import { TfbRatio } from "../tfb/TfbRatio";
import { TfbCheckList } from "../tfb/TfbCheckList";
import { TfbDropTest } from "../tfb/TfbDropTest";
import { TfbQrCard } from "../tfb/TfbQrCard";
import { TfbPageZoom } from "../tfb/TfbPageZoom";
export const LAYERS = [
  { key: "viejo", label: "Piso viejo, mojado", color: "#8c8578", h: 170, at: 4, cracked: true },
  { key: "agua", label: "Húmedo, sin charcos", color: "#6d7f8f", h: 10, at: 20, wet: true, thin: true },
  { key: "puente", label: "Lechada con cola", color: "#5f5a52", h: 26, at: 36 },
  { key: "carpeta", label: "Carpeta 1 : 3", color: "#a39d91", h: 120, at: 52, grain: true },
  { key: "rayado", label: "Rayado de escoba", color: "#b3ada2", h: 12, at: 70, grooves: true, thin: true },
];
const BG: React.FC<{ s?: string }> = ({ s = "img/tfbpiso/proof/bg.png" }) => <Img src={staticFile(s)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
const D = 150;
const items: [string, React.ReactNode][] = [
  ["layer", <TfbLayerCut dur={D} layers={LAYERS} title="Lo que aguanta" />],
  ["absorb", <TfbLayerCut dur={D} layers={LAYERS.slice(0, 4).map(l => l.key === "agua" ? { ...l, label: "Piso SECO", wet: false, color: "#8c8578" } : l)} mode="absorb" absorbAt={60} peelAt={100} title="Piso seco = esponja" badLabel="¡se despega!" />],
  ["wipe", <TfbWipeCompare dur={D} before={{ src: "img/tfbpiso/proof/bg2.png" }} after={{ src: "img/tfbpiso/proof/bg.png" }} />],
  ["broom", <TfbBroomTexture dur={D} note="en su punto: mate" noteAt={40} />],
  ["broomearly", <TfbBroomTexture dur={D} early note="muy pronto: arranca" noteAt={40} />],
  ["zoom", <TfbZoomCircle dur={D} src="img/tfbpiso/proof/bg.png" video={false} keys={[{ f: 0, x: 0.3, y: 0.62 }]} label="se rompe en placas" />],
  ["scribble", <TfbScribble dur={D} marks={[{ kind: "circle", x: 0.62, y: 0.7, w: 0.2, h: 0.18, at: 0, note: "hueco = suelto" }, { kind: "arrow", x: 0.2, y: 0.3, to: { x: 0.4, y: 0.62 }, at: 10 }]} />],
  ["step", <TfbStepCounter dur={D} step={4} total={9} label="Lechada" />],
  ["cure", <TfbCureCalendar dur={D} days={["DÍA 1", "DÍA 2", "DÍA 3", "…"]} title="Húmedo varios días" />],
  ["ratio", <TfbRatio dur={D} a={{ n: 1, label: "CEMENTO", color: "#8e8a84" }} b={{ n: 3, label: "ARENA", color: "#d6b98a", speck: "#a88b5c" }} title="La carpeta" footer="Siempre el mismo balde" />],
  ["check", <TfbCheckList dur={D} title="NO SIRVE SI" rows={[{ t: "Humedad que sube", ok: false, at: 8 }, { t: "Grietas que se mueven", ok: false, at: 20 }, { t: "El piso se hunde", ok: false, at: 32 }]} />],
  ["drop", <TfbDropTest dur={D} leftLabel="TIENE SED: MOJA MÁS" rightLabel="CERA O GRASA: NO PEGA" title="La prueba de la gota" />],
  ["qr", <TfbQrCard dur={D} qr="img/tfbpiso/qr_tfbpiso.png" cover="img/tfbpiso/portada-coleccion.jpg" kicker="Escanea con tu teléfono" line="o el enlace en la descripción" url="constructorlibre.com" />],
  ["page", <TfbPageZoom dur={D} src="img/tfbpiso/lamina.jpg" keys={[[0, 0.5, 0.5, 1], [2, 0.5, 0.4, 1.7]]} marks={[{ from: 1, to: 5, x: 0.02, y: 0.26, w: 0.96, h: 0.2 }]} />],
];
export const PROOF_N = items.length;
export const ProofTfbpiso: React.FC = () => (
  <AbsoluteFill>
    {items.map(([k, el], i) => <Sequence key={k} from={i * D} durationInFrames={D}><AbsoluteFill><BG /></AbsoluteFill>{el}</Sequence>)}
  </AbsoluteFill>
);
