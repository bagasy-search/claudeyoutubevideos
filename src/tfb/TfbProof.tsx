// TfbProof — banco de prueba de los componentes Tfb* sobre una foto real a 1920x1080 (90 cuadros por componente).
// Uso: registrá <Composition id="TfbProof" component={TfbProof} durationInFrames={TFB_PROOF_FRAMES} …/> con `bg` (ruta en public/)
// y sacá stills con `npx remotion still <entry> TfbProof out.png --frame=N`.
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { TfbTitleSlam } from "./TfbTitleSlam";
import { TfbMagnifier } from "./TfbMagnifier";
import { TfbScribble } from "./TfbScribble";
import { TfbStepCounter } from "./TfbStepCounter";
import { TfbRecipeFlow } from "./TfbRecipeFlow";
import { TfbForceGauge } from "./TfbForceGauge";
import { TfbGlueSection } from "./TfbGlueSection";
import { TfbWipeCompare } from "./TfbWipeCompare";
import { TfbFreeze } from "./TfbFreeze";
import { TfbWarning, TfbTimerChip, TfbTag, TfbChecklist } from "./TfbBadges";
import { TfbQrCard } from "./TfbLamina";

const D = 90;
export const TfbProof: React.FC<{ bg: string; bg2: string; qr: string; cover: string }> = ({ bg, bg2, qr, cover }) => {
  const items: React.ReactNode[] = [
    <TfbTitleSlam key="a" dur={D} lines={[{ t: "SE ROMPIÓ LA MADERA", style: "white", size: 104 }, { t: "LA COLA NO", style: "redbox", size: 110 }]} y={24} />,
    <TfbMagnifier key="b" dur={D} src={bg} image path={[{ f: 0, x: 60, y: 60 }]} lensAt={{ x: 25, y: 38 }} label="la unión, entera" />,
    <TfbScribble key="c" dur={D} kind="circle" center={{ x: 50, y: 55 }} rx={16} ry={13} label="la cuajada" />,
    <TfbStepCounter key="d" dur={D} n={3} total={6} title="Colar y lavar" />,
    <TfbRecipeFlow key="e" dur={D * 3} title="De la leche a la cola" nodes={[{ icon: "milk", label: "Leche", sub: "descremada", at: 6 }, { icon: "curd", label: "Cuajada", sub: "la caseína", at: 60 }, { icon: "jar", label: "Cola", sub: "+ algo alcalino", at: 120 }, { icon: "joint", label: "Unión", sub: "más que la madera", at: 180 }]} />,
    <TfbForceGauge key="f" dur={D * 2} breakAt={120} result="¡SE PARTIÓ LA MADERA!" side="left" />,
    <TfbGlueSection key="g" dur={D * 2} mode="grip" title="Por dentro de la unión" note="la cola se mete en los poros" />,
    <TfbWipeCompare key="h" dur={D} left={{ src: bg, label: "ENGRUDO · PAPEL", tone: "red" }} right={{ src: bg2, label: "CASEÍNA · MADERA", tone: "yellow" }} />,
    <TfbFreeze key="i" dur={D} src={bg} image tag="LA PRUEBA DEL OLFATO"><TfbScribble dur={D} kind="arrow" from={{ x: 80, y: 70 }} to={{ x: 60, y: 45 }} label="otra lavada" /></TfbFreeze>,
    <TfbWarning key="j" dur={D} title="LA CAL ES CÁUSTICA" items={[{ icon: "gloves", label: "Guantes" }, { icon: "goggles", label: "Gafas" }, { icon: "kids", label: "Lejos de niños" }]} />,
    <TfbTimerChip key="k" dur={D} text="TODA LA NOCHE" sub="+ 1 día antes de cargar" />,
    <TfbTag key="l" dur={D} text="40–50 °C" sub="tibia, sin hervir" />,
    <TfbChecklist key="m" dur={D} title="Resumen" items={[{ t: "Leche descremada", ok: true, at: 5 }, { t: "Sin grumos", ok: true, at: 20 }, { t: "Guardarla", ok: false, at: 35 }]} />,
    <TfbQrCard key="n" dur={D} qr={qr} cover={cover} line1="Apunta la cámara aquí" line2="o el enlace en la descripción" />,
  ];
  let from = 0;
  return (
    <AbsoluteFill>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {items.map((el, i) => { const d = (el as React.ReactElement<{ dur: number }>).props.dur; const s = <Sequence key={i} from={from} durationInFrames={d}>{el}</Sequence>; from += d; return s; })}
    </AbsoluteFill>
  );
};
export const TFB_PROOF_FRAMES = 90 * 20;
