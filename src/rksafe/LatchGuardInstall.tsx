// LatchGuardInstall.tsx — ARREGLO 5 de rkcard: el LATCH GUARD se atornilla SOLO en pantalla.
//   · vista desde AFUERA del canto con el pomo: la rendija junto al pestillo, expuesta (roja);
//   · la chapa de acero entra deslizando y tapa la rendija (el ala cubre la luz sobre el marco);
//   · los bulones GIRAN y asientan, escalonados en fracciones de la duración;
//   · una flecha de "algo fino" llega y REBOTA contra la chapa.
// ⛔ Mecánica correcta: la chapa se fija a la HOJA (bulones pasantes) y su ala tapa la luz; no se
//    atornilla al marco. Salvedad del guion: "on some doors they do not fit".
import React from "react";
import { Easing, interpolate } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba } from "./RayStage";
import { useT, DiagramStage, MetalDefs } from "./LatchKit";

const Bolt: React.FC<{ x: number; y: number; t: number; id: string }> = ({ x, y, t, id }) => {
  const rot = interpolate(t, [0, 1], [-540, 0]);
  const s = interpolate(t, [0, 0.2, 1], [0, 1.25, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g transform={`translate(${x} ${y}) scale(${s.toFixed(3)}) rotate(${rot.toFixed(1)})`} opacity={t > 0 ? 1 : 0}>
      <circle r={17} fill={`url(#${id}_steel)`} stroke={rgba("#000", 0.5)} strokeWidth={2} />
      <rect x={-11} y={-3} width={22} height={6} fill={rgba("#000", 0.55)} />
    </g>
  );
};

export const LatchGuardInstall: React.FC<{
  kicker?: string;
  title?: string;
  caption?: string;
  price?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ kicker, title, caption, price, bed, durationInFrames }) => {
  const { ph, salida } = useT(durationInFrames);
  const aTitle = ph(0, 0.1, Easing.out(Easing.quad));
  const aStruct = ph(0.02, 0.16, Easing.out(Easing.cubic));
  const slide = ph(0.2, 0.4, Easing.out(Easing.cubic));
  const bolts = [ph(0.4, 0.5), ph(0.46, 0.56), ph(0.52, 0.62)];
  const arrow = ph(0.64, 0.74, Easing.in(Easing.quad));
  const rebote = ph(0.74, 0.82, Easing.out(Easing.quad));
  const aPrice = ph(0.3, 0.4, Easing.out(Easing.back(1.7)));
  const aCap = ph(0.78, 0.88, Easing.out(Easing.quad));
  const id = "lgi";

  const GX = 1010;                            // rendija
  const plateX = interpolate(slide, [0, 1], [1900, 890]);   // 890 = posición final (offset 0)
  const gapExpuesta = 1 - slide;
  const ax = interpolate(arrow, [0, 1], [1500, GX + 60]) + rebote * 120;
  const ay = interpolate(arrow, [0, 1], [300, 520]) - rebote * 60;

  return (
    <DiagramStage bed={bed} kicker={kicker ?? "FIX 5"} title={title ?? "The latch guard"}
      caption={caption ?? "A strip of steel over the gap."} captionTone="brass" aTitle={aTitle} aCaption={aCap} salida={salida}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <MetalDefs id={id} />
        <clipPath id={`${id}_clip`}><rect x={92} y={212} width={1736} height={716} rx={16} /></clipPath>
        <g clipPath={`url(#${id}_clip)`} opacity={aStruct}>
          {/* hoja (vista desde afuera) y marco */}
          <rect x={380} y={240} width={GX - 380} height={700} fill={`url(#${id}_door)`} />
          <rect x={GX + 8} y={240} width={300} height={700} fill="#E2DCCB" />
          <rect x={GX + 8} y={240} width={40} height={700} fill={rgba("#000", 0.07)} />
          {/* rendija */}
          <rect x={GX} y={240} width={8} height={700} fill="#060607" />
          <rect x={GX - 2} y={470} width={12} height={130} fill={rgba(V.danger, 0.85 * gapExpuesta)} />
          {/* pomo */}
          <circle cx={870} cy={540} r={58} fill={`url(#${id}_brass)`} stroke={rgba("#000", 0.4)} strokeWidth={2} />
          <circle cx={870} cy={540} r={22} fill={rgba("#000", 0.18)} />
          {/* la chapa */}
          <g transform={`translate(${plateX - 890} 0)`}>
            <path d={`M 920 380 H 1090 V 700 H 920 V 596 A 75 75 0 0 0 920 484 Z`} fill={`url(#${id}_steel)`} stroke={rgba("#000", 0.45)} strokeWidth={2} />
            <rect x={1010} y={380} width={80} height={320} fill={rgba("#FFFFFF", 0.08)} />
            <line x1={1010} y1={380} x2={1010} y2={700} stroke={rgba("#000", 0.25)} strokeWidth={2} />
          </g>
          {slide > 0.98 ? (
            <>
              <Bolt x={962} y={420} t={bolts[0]} id={id} />
              <Bolt x={962} y={660} t={bolts[1]} id={id} />
              <Bolt x={982} y={540} t={bolts[2]} id={id} />
            </>
          ) : null}
          {/* flecha que rebota */}
          <g opacity={arrow > 0 ? 1 - rebote * 0.6 : 0}>
            <line x1={ax + 260} y1={ay - 150} x2={ax} y2={ay} stroke={V.white} strokeWidth={8} strokeLinecap="round" />
            <text x={ax + 170} y={ay - 170} fill={V.white} style={{ fontFamily: F_BODY, fontStyle: "italic", fontWeight: 600, fontSize: 30 }}>anything thin</text>
          </g>
          {rebote > 0 ? (
            <text x={GX + 330} y={880} fill={V.ok} opacity={rebote} style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 50, letterSpacing: 2 }}>NOTHING TO REACH</text>
          ) : null}
          {/* precio */}
          <g opacity={aPrice} transform={`translate(1480 ${700 + (1 - aPrice) * 20})`}>
            <rect x={0} y={0} width={290} height={120} rx={12} fill={rgba(V.ink0, 0.8)} stroke={V.brass} strokeWidth={3} />
            <text x={145} y={72} textAnchor="middle" fill={V.brassSoft} style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 56 }}>{price ?? "$15–30"}</text>
            <text x={145} y={106} textAnchor="middle" fill={V.bone} style={{ fontFamily: F_BODY, fontSize: 22 }}>around</text>
          </g>
        </g>
      </svg>
    </DiagramStage>
  );
};
