// HingeScrewPull.tsx — ARREGLO 2 de rkcard en corte: el tornillo de fábrica (¾") sólo muerde el
// marco fino; el de 3" GIRA, atraviesa el hueco y muerde el montante de la pared, y al apretar
// TIRA del marco: la hoja vuelve a su lugar y el pestillo se alinea con la placa.
//   · corte visto desde arriba de la bisagra de ARRIBA (izq: hoja · bisagra · marco · luz · montante)
//   · recuadro: la puerta caída (latch bajo) que se ENDEREZA cuando el tornillo tira.
// ⛔ Mecánica correcta: el tornillo largo va del lado del MARCO de la bisagra, no en la hoja.
// ⛔ Tiempos = fracciones de la duración. Sin defaults de texto en la firma.
import React from "react";
import { Easing, interpolate } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba } from "./RayStage";
import { useT, DiagramStage, MetalDefs, Callout } from "./LatchKit";

const Screw: React.FC<{ x: number; y: number; len: number; spin: number; color: string; id: string }> = ({ x, y, len, spin, color, id }) => {
  // rosca: rayas diagonales que se DESPLAZAN con el giro
  const paso = 16;
  const off = (spin * paso) % paso;
  const n = Math.floor(len / paso) + 2;
  return (
    <g>
      <rect x={x} y={y - 7} width={len} height={14} fill={`url(#${id}_steel)`} />
      <clipPath id={`${id}_sc${Math.round(y)}`}><rect x={x + 10} y={y - 9} width={len - 10} height={18} /></clipPath>
      <g clipPath={`url(#${id}_sc${Math.round(y)})`}>
        {Array.from({ length: n }, (_, i) => (
          <line key={i} x1={x + i * paso - off} y1={y - 9} x2={x + i * paso - off + 8} y2={y + 9} stroke={rgba("#000", 0.45)} strokeWidth={3} />
        ))}
      </g>
      <polygon points={`${x + len},${y - 7} ${x + len + 16},${y} ${x + len},${y + 7}`} fill={`url(#${id}_steel)`} />
      <rect x={x - 12} y={y - 18} width={12} height={36} rx={3} fill={color} />
    </g>
  );
};

export const HingeScrewPull: React.FC<{
  kicker?: string;
  title?: string;
  caption?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ kicker, title, caption, bed, durationInFrames }) => {
  const { ph, salida, frame } = useT(durationInFrames);
  const aTitle = ph(0, 0.1, Easing.out(Easing.quad));
  const aStruct = ph(0.02, 0.16, Easing.out(Easing.cubic));
  const aCap = ph(0.76, 0.86, Easing.out(Easing.quad));
  const id = "hsp";

  const drive = ph(0.26, 0.58, Easing.inOut(Easing.quad));   // el tornillo largo entra
  const pull = ph(0.56, 0.72, Easing.inOut(Easing.cubic));   // al morder, tira del marco
  const LEN = 300;                                           // 3" (¾" = 75 px)
  const tiro = 30 * pull;                                    // el marco se acerca al montante
  const hx = 1000 + tiro;                                    // cara del marco donde va la bisagra
  const longX = hx + 10 - (1 - drive) * (LEN + 40);
  const spin = frame * 0.9 * (drive > 0 && drive < 1 ? 1 : 0.0) + drive * 40;
  const sag = interpolate(pull, [0, 1], [2.2, 0]);           // grados de caída del recuadro

  return (
    <DiagramStage bed={bed} kicker={kicker ?? "FIX 2 · ABOUT $3"} title={title ?? "The factory screw vs. three inches"}
      caption={caption ?? "It pulls the top of the door back up."} captionTone="brass" aTitle={aTitle} aCaption={aCap} salida={salida}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <MetalDefs id={id} />
        <clipPath id={`${id}_clip`}><rect x={92} y={212} width={1736} height={716} rx={16} /></clipPath>
        <g clipPath={`url(#${id}_clip)`} opacity={aStruct}>
          {/* montante de la pared (fijo) */}
          <rect x={1150} y={330} width={260} height={470} fill={`url(#${id}_wood)`} />
          <rect x={1150} y={330} width={260} height={470} fill={`url(#${id}_grain)`} />
          <text x={1280} y={780} textAnchor="middle" fill={V.bone} style={{ fontFamily: F_DISPLAY, fontSize: 26, letterSpacing: 3 }}>WALL FRAMING</text>
          {/* cuña */}
          <polygon points={`${hx + 70},360 1150,360 1150,380 ${hx + 70},420`} fill="#8A6A45" opacity={0.8} />
          {/* marco (jamb ¾") que se desplaza */}
          <rect x={hx} y={330} width={70} height={470} fill="#7A5634" />
          <rect x={hx} y={330} width={70} height={470} fill={`url(#${id}_grain)`} />
          <text x={hx + 35} y={320} textAnchor="middle" fill={V.bone} style={{ fontFamily: F_DISPLAY, fontSize: 24, letterSpacing: 3 }}>JAMB</text>
          {/* hoja de bisagra + hoja de la puerta */}
          <rect x={hx - 10} y={400} width={10} height={330} fill={`url(#${id}_steel)`} />
          <rect x={560} y={420} width={hx - 10 - 560 - 30} height={290} fill={`url(#${id}_door)`} />
          <circle cx={hx - 24} cy={565} r={20} fill={`url(#${id}_steel)`} stroke={rgba("#000", 0.4)} />
          {/* tornillo de fábrica ¾" (sólo el marco) */}
          <Screw x={hx + 2} y={460} len={62} spin={0} color={V.steel} id={id} />
          {/* tornillo de 3" que entra girando */}
          <Screw x={longX} y={660} len={LEN} spin={spin} color={V.brass} id={id} />
          {/* rótulos */}
          <Callout x={hx + 50} y={460} tx={640} ty={300} text="Factory screw: ¾ inch" a={ph(0.1, 0.24)} align="end" color={V.dangerSoft} />
          <Callout x={Math.min(1300, longX + LEN)} y={660} tx={1500} ty={880} text="Three-inch screw" a={ph(0.34, 0.48)} />
          <g opacity={pull}>
            <line x1={1130} y1={560} x2={1090} y2={560} stroke={V.ok} strokeWidth={5} />
            <polygon points="1150,560 1128,548 1128,572" fill={V.ok} transform="rotate(180 1110 560)" />
            <text x={1160} y={560} fill={V.ok} style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 28 }}>pulls</text>
          </g>
          {/* recuadro: la puerta caída que se endereza */}
          <g transform="translate(1470 300)">
            <rect x={0} y={0} width={320} height={380} rx={12} fill={rgba(V.ink0, 0.72)} stroke={rgba(V.brass, 0.45)} strokeWidth={2} />
            <rect x={40} y={30} width={10} height={320} fill="#7A5634" />
            <rect x={270} y={30} width={10} height={320} fill="#7A5634" />
            <g transform={`rotate(${sag.toFixed(3)} 60 50)`}>
              <rect x={56} y={42} width={206} height={300} fill={`url(#${id}_door)`} />
              <rect x={240} y={186} width={16} height={12} fill={`url(#${id}_brass)`} />
            </g>
            <rect x={262} y={176} width={10} height={32} fill={pull > 0.9 ? V.ok : V.steel} />
            <text x={160} y={372} textAnchor="middle" fill={V.bone} style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 22 }}>{pull > 0.9 ? "lined up again" : "a sagging door"}</text>
          </g>
        </g>
      </svg>
    </DiagramStage>
  );
};
