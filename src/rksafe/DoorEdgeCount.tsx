// DoorEdgeCount.tsx — EL CANTO DE LA PUERTA visto de frente, con la cámara que entra al herraje (rkcard).
//
//   anatomy — el canto; la cámara entra al pestillo; al costado, el PERFIL de la rampa con su resorte
//             que se comprime y vuelve (por qué la puerta cierra sola).
//   count   — "¿cuántas piezas de metal van al marco?": un contador que sube a 1 y el veredicto.
//   plunger — un barrido de luz recorre la placa y ENCUENTRA el émbolo chico al lado del pestillo.
// ⛔ Mecánica correcta: el émbolo deadlatch está AL LADO del pestillo en el espesor de la hoja (en
//    este plano, a la derecha de la cara del pestillo), nunca arriba ni abajo.
// ⛔ Sin defaults de texto en la firma (rksafe_gate_props): los textos salen del modo.
import React from "react";
import { Easing, interpolate } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba } from "./RayStage";
import { useT, DiagramStage, MetalDefs, Callout } from "./LatchKit";

type Mode = "anatomy" | "count" | "plunger";
const DEF: Record<Mode, { kicker: string; title: string; caption: string; tone: "brass" | "danger" | "ok" }> = {
  anatomy: { kicker: "LOOK AT THE EDGE", title: "The spring latch", caption: "Angled on one side. A little ramp.", tone: "brass" },
  count: { kicker: "QUESTION ONE", title: "How many pieces of metal?", caption: "One means a spring latch. Nothing else.", tone: "danger" },
  plunger: { kicker: "QUESTION TWO", title: "Look for a second little bolt", caption: "That plunger was built to stop this.", tone: "ok" },
};

export const DoorEdgeCount: React.FC<{
  mode?: Mode;
  kicker?: string;
  title?: string;
  caption?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ mode, kicker, title, caption, bed, durationInFrames }) => {
  const m: Mode = mode ?? "count";
  const d = DEF[m];
  const { ph, salida, frame } = useT(durationInFrames);
  const aTitle = ph(0, 0.1, Easing.out(Easing.quad));
  const aStruct = ph(0.02, 0.15, Easing.out(Easing.cubic));
  const cam = ph(0.08, 0.42, Easing.inOut(Easing.cubic));
  const s = interpolate(cam, [0, 1], [1, 1.9]);
  const CX = 830, CY = 570, SX = 700, SY = 570;
  const T = (x: number, y: number) => [SX + (x - CX) * s, SY + (y - CY) * s];
  const aCap = ph(0.72, 0.82, Easing.out(Easing.quad));
  const id = "dec";

  // resorte del perfil (anatomy): comprime y vuelve dos veces
  const ciclo = m === "anatomy" ? Math.max(0, Math.sin(ph(0.42, 0.9, Easing.linear) * Math.PI * 2)) : 0;
  // contador (count)
  const cnt = m === "count" ? ph(0.44, 0.56, Easing.out(Easing.cubic)) : 0;
  const pulse = m === "count" ? 1 + 0.12 * Math.max(0, Math.sin((frame / 6))) * ph(0.5, 0.6) : 1;
  // barrido (plunger)
  const scan = m === "plunger" ? ph(0.4, 0.62, Easing.inOut(Easing.sin)) : 0;
  const found = m === "plunger" ? ph(0.6, 0.7, Easing.out(Easing.back(1.8))) : 0;

  const latchHot = m === "count" && cnt > 0.5;
  const lat = T(817, 565), pl = T(861, 565), plate = T(830, 490);

  return (
    <DiagramStage bed={bed} kicker={kicker ?? d.kicker} title={title ?? d.title} caption={caption ?? d.caption}
      captionTone={d.tone} aTitle={aTitle} aCaption={aCap} salida={salida}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <MetalDefs id={id} />
        <clipPath id={`${id}_clip`}><rect x={92} y={212} width={1736} height={716} rx={16} /></clipPath>
        <g clipPath={`url(#${id}_clip)`} opacity={aStruct}>
          <g transform={`translate(${SX} ${SY}) scale(${s.toFixed(4)}) translate(${-CX} ${-CY})`}>
            {/* canto de la hoja (1¾") con veta y pintura gastada */}
            <rect x={760} y={100} width={140} height={1000} fill={`url(#${id}_door)`} />
            <rect x={760} y={100} width={140} height={1000} fill="none" stroke={rgba("#000", 0.25)} strokeWidth={2} />
            <line x1={776} y1={100} x2={776} y2={1100} stroke={rgba("#000", 0.08)} strokeWidth={6} />
            {/* placa frontal del pestillo */}
            <rect x={785} y={470} width={90} height={190} rx={10} fill={`url(#${id}_brass)`} stroke={rgba("#000", 0.45)} strokeWidth={2} />
            <circle cx={830} cy={490} r={7} fill={rgba("#000", 0.45)} /><line x1={825} y1={490} x2={835} y2={490} stroke="#E4B75C" strokeWidth={2} />
            <circle cx={830} cy={640} r={7} fill={rgba("#000", 0.45)} /><line x1={825} y1={640} x2={835} y2={640} stroke="#E4B75C" strokeWidth={2} />
            {/* cara del pestillo (D) */}
            <path d="M795 530 h32 a14 14 0 0 1 14 14 v42 a14 14 0 0 1 -14 14 h-32 z" fill={latchHot ? V.danger : `url(#${id}_steel)`} stroke={rgba("#000", 0.5)} strokeWidth={2} />
            {/* émbolo deadlatch, al lado en el espesor */}
            {m === "plunger" ? <rect x={850} y={538} width={18} height={54} rx={6} fill={m === "plunger" && found > 0.2 ? V.ok : `url(#${id}_steel)`} stroke={rgba("#000", 0.5)} strokeWidth={2} /> : null}
            {/* barrido de luz */}
            {m === "plunger" ? (
              <rect x={770 + scan * 120} y={460} width={26} height={210} fill={rgba(V.brassSoft, 0.35 * (1 - found))} />
            ) : null}
          </g>
          {/* ── al costado: perfil de la rampa (anatomy) ── */}
          {m === "anatomy" ? (() => {
            const a = ph(0.36, 0.48);
            const k = ciclo * 70;                       // retracción del perfil
            return (
              <g opacity={a} transform={`translate(1180 ${420 + (1 - a) * 20})`}>
                <text x={0} y={-40} fill={V.brass} style={{ fontFamily: F_DISPLAY, fontSize: 26, letterSpacing: 4 }}>FROM ABOVE</text>
                <rect x={-10} y={0} width={420} height={250} rx={12} fill={rgba(V.ink0, 0.6)} stroke={rgba(V.brass, 0.4)} />
                {/* resorte */}
                <polyline fill="none" stroke={V.steel} strokeWidth={5}
                  points={Array.from({ length: 11 }, (_, i) => `${20 + i * ((150 - k) / 10)},${i % 2 ? 95 : 155}`).join(" ")} />
                {/* pestillo con bisel */}
                <polygon points={`${170 - k},90 ${300 - k},90 ${360 - k},150 ${360 - k},160 ${170 - k},160`} fill={`url(#${id}_brass)`} stroke={rgba("#000", 0.5)} strokeWidth={2} />
                <line x1={300 - k} y1={90} x2={360 - k} y2={150} stroke={V.danger} strokeWidth={6} />
                <text x={200} y={225} fill={V.white} style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 28 }}>the ramp</text>
              </g>
            );
          })() : null}
          {/* callouts */}
          {m === "anatomy" ? <Callout x={lat[0]} y={lat[1]} tx={420} ty={330} text="One piece of metal" a={ph(0.3, 0.46)} align="end" /> : null}
          {m === "plunger" ? <Callout x={pl[0]} y={pl[1]} tx={1260} ty={420} text="The deadlatch plunger" a={found} color={V.ok} /> : null}
          {m === "plunger" ? <Callout x={lat[0]} y={lat[1] + 30} tx={420} ty={820} text="The latch" a={ph(0.3, 0.44)} align="end" /> : null}
          {m === "count" ? (
            <g transform={`translate(1360 580) scale(${pulse.toFixed(3)})`} opacity={ph(0.4, 0.5)}>
              <text x={0} y={60} textAnchor="middle" fill={cnt > 0.5 ? V.danger : V.white} style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 260 }}>{Math.round(cnt)}</text>
              <text x={0} y={130} textAnchor="middle" fill={V.bone} style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 34 }}>piece going into the frame</text>
            </g>
          ) : null}
          {m === "count" ? <Callout x={plate[0]} y={plate[1]} tx={420} ty={320} text="Only the latch" a={ph(0.52, 0.64)} align="end" color={V.dangerSoft} /> : null}
        </g>
      </svg>
    </DiagramStage>
  );
};
