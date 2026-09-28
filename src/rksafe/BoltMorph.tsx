// BoltMorph.tsx — COMPARATIVA QUE SE TRANSFORMA (rkcard): el pestillo de resorte se CONVIERTE en un
// cerrojo (deadbolt) y el mismo corte muestra por qué la tarjeta ya no tiene contra qué empujar.
//   morph — rampa (roja, cede) -> el bisel se ENDEREZA a cara cuadrada (latón) -> la flecha de empuje
//           rebota: "no ramp, nothing to push".
//   throw — el cerrojo SALE del canto y entra al marco mientras una regla cuenta 0 -> 1.00": el
//           "full one-inch throw" que pide el guion.
// ⛔ Tiempos = fracciones de la duración. Sin defaults de texto en la firma.
import React from "react";
import { Easing, interpolate } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba } from "./RayStage";
import { useT, DiagramStage, MetalDefs, Callout } from "./LatchKit";

type Mode = "morph" | "throw";
const DEF: Record<Mode, { kicker: string; title: string; caption: string; tone: "brass" | "ok" }> = {
  morph: { kicker: "WHY A DEADBOLT IS DIFFERENT", title: "No ramp. Nothing to push.", caption: "It only moves with the key or the thumb turn.", tone: "ok" },
  throw: { kicker: "FIX 6 · WHAT TO BUY", title: "A full one-inch throw", caption: "Grade 1 or grade 2. Around $30 to $60.", tone: "brass" },
};

export const BoltMorph: React.FC<{
  mode?: Mode;
  kicker?: string;
  title?: string;
  caption?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ mode, kicker, title, caption, bed, durationInFrames }) => {
  const m: Mode = mode ?? "morph";
  const d = DEF[m];
  const { ph, salida } = useT(durationInFrames);
  const aTitle = ph(0, 0.1, Easing.out(Easing.quad));
  const aStruct = ph(0.02, 0.16, Easing.out(Easing.cubic));
  const aCap = ph(0.74, 0.84, Easing.out(Easing.quad));
  const id = "bm";

  const J0 = 1060, XE = 1050;            // cara del marco · canto de la hoja
  const Y0 = 500, Y1 = 610;              // alto del bulón (vista de arriba)
  const PRO = m === "throw" ? 150 : 90;  // cuánto entra al marco (px)

  // morph: bisel 0 -> 1 (1 = cuadrado)
  const sq = m === "morph" ? ph(0.44, 0.6, Easing.inOut(Easing.cubic)) : 1;
  // empuje: antes del morph cede, después rebota
  const push1 = m === "morph" ? ph(0.2, 0.34) * (1 - ph(0.36, 0.44)) : 0;
  const push2 = m === "morph" ? ph(0.62, 0.7) : 0;
  const rebote = Math.sin(push2 * Math.PI) * 14;
  const retr = push1 * 60;
  // throw: el bulón sale 0 -> PRO
  const salidaBolt = m === "throw" ? ph(0.28, 0.6, Easing.out(Easing.cubic)) : 1;
  const ext = PRO * salidaBolt - retr;
  const tipX = XE + ext;
  const bevelX = interpolate(sq, [0, 1], [tipX - 50, tipX]);
  const bevelY = interpolate(sq, [0, 1], [Y1 - 10, Y0]);
  const pts = [[XE - 120, Y0], [bevelX, Y0], [tipX, bevelY], [tipX, Y1], [XE - 120, Y1]].map((p) => p.join(",")).join(" ");
  const colorBolt = m === "morph" && sq < 0.3 && push1 > 0.1 ? V.danger : undefined;
  const inches = (PRO * salidaBolt) / PRO;   // 0..1"

  return (
    <DiagramStage bed={bed} kicker={kicker ?? d.kicker} title={title ?? d.title} caption={caption ?? d.caption}
      captionTone={d.tone} aTitle={aTitle} aCaption={aCap} salida={salida}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <MetalDefs id={id} />
        <clipPath id={`${id}_clip`}><rect x={92} y={212} width={1736} height={716} rx={16} /></clipPath>
        <g clipPath={`url(#${id}_clip)`} opacity={aStruct}>
          {/* marco + hueco + placa */}
          <rect x={J0} y={330} width={420} height={450} fill={`url(#${id}_wood)`} />
          <rect x={J0} y={330} width={420} height={450} fill={`url(#${id}_grain)`} />
          <rect x={J0} y={Y0 - 8} width={PRO + 30} height={Y1 - Y0 + 16} fill="#050506" />
          <rect x={J0 - 6} y={400} width={12} height={Y0 - 8 - 400} fill={`url(#${id}_steel)`} />
          <rect x={J0 - 6} y={Y1 + 8} width={12} height={690 - Y1} fill={`url(#${id}_steel)`} />
          {/* bulón */}
          <polygon points={pts} fill={colorBolt ?? `url(#${id}_brass)`} stroke={rgba("#000", 0.55)} strokeWidth={2} />
          {/* hoja */}
          <rect x={300} y={380} width={XE - 300} height={360} fill={`url(#${id}_door)`} />
          <rect x={XE - 14} y={410} width={14} height={300} fill={`url(#${id}_brass)`} opacity={0.9} />
          {/* flecha de empuje (morph) */}
          {m === "morph" ? (() => {
            const on = ph(0.16, 0.22) * (1 - ph(0.4, 0.44)) + ph(0.58, 0.62) * (1 - ph(0.74, 0.8));
            const x = (push2 > 0 ? tipX + 30 + rebote : tipX + 30 - retr * 0.1);
            return (
              <g opacity={on}>
                <line x1={x + 160} y1={Y0 - 60} x2={x + 10} y2={Y0 + 20} stroke={V.white} strokeWidth={8} strokeLinecap="round" />
                <polygon points={`${x},${Y0 + 28} ${x + 30},${Y0 + 2} ${x + 14},${Y0 + 34}`} fill={V.white} />
                <text x={x + 170} y={Y0 - 70} fill={V.white} style={{ fontFamily: F_BODY, fontStyle: "italic", fontWeight: 600, fontSize: 30 }}>push</text>
              </g>
            );
          })() : null}
          {m === "morph" ? (
            <g opacity={ph(0.66, 0.74)}>
              <text x={tipX + 190} y={Y1 + 10} fill={V.ok} style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 70 }}>✕</text>
            </g>
          ) : null}
          {m === "morph" ? (
            <>
              <Callout x={tipX - 30} y={Y0 + 20} tx={560} ty={300} text={sq < 0.5 ? "Spring latch: a ramp" : "Deadbolt: square end"} a={ph(0.1, 0.24)} align="end" color={sq < 0.5 ? V.dangerSoft : V.brassSoft} />
            </>
          ) : null}
          {/* regla (throw) */}
          {m === "throw" ? (
            <g opacity={ph(0.2, 0.3)}>
              <line x1={XE} y1={Y1 + 110} x2={XE + PRO} y2={Y1 + 110} stroke={V.brassSoft} strokeWidth={4} />
              {Array.from({ length: 9 }, (_, i) => (
                <line key={i} x1={XE + (PRO * i) / 8} y1={Y1 + 110} x2={XE + (PRO * i) / 8} y2={Y1 + (i % 4 === 0 ? 70 : 90)} stroke={V.brassSoft} strokeWidth={3} />
              ))}
              <line x1={tipX} y1={Y1 + 12} x2={tipX} y2={Y1 + 120} stroke={V.white} strokeWidth={2} strokeDasharray="6 6" />
              <text x={XE + PRO / 2} y={Y1 + 180} textAnchor="middle" fill={V.white} style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 64 }}>{inches.toFixed(2)}″</text>
              <text x={XE + PRO + 330} y={Y0 + 70} fill={V.bone} style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 30 }} opacity={ph(0.6, 0.7)}>into the frame</text>
            </g>
          ) : null}
        </g>
      </svg>
    </DiagramStage>
  );
};
