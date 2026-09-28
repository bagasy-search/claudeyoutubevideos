// LastDoorCutaway.tsx — "LA ÚLTIMA PUERTA": garage → cocina, en plano y en CORTE (canal Ray Kessler, rkremote).
//
// Izquierda: la planta de la casa se DIBUJA trazo a trazo (calle, entrada, garage, cocina). Una línea
// punteada recorre el camino que abre el control viejo: entra por el portón y se FRENA en la puerta que
// da a la cocina. De esa puerta sale una lupa hacia la derecha, donde la pieza aparece en CORTE visto
// desde arriba (hoja de la puerta, pestillo, placa de cierre, marco, y el parante de la pared atrás).
//
// Etapas (`stage`):
//   · "unlocked" — la puerta sin llave: el pestillo ni siquiera entra. Rojo.
//   · "knob"     — sólo la perilla: la placa de cierre con 2 tornillos CORTOS que muerden la moldura.
//   · "screws"   — los tornillos de 3 pulgadas entran girando hasta el PARANTE. Latón.
//   · "deadbolt" — el cerrojo de acero sale de la hoja y entra en el marco.
// ⛔ Todos los tiempos son FRACCIONES de la duración.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, PhotoBed, Keyring } from "./RayStage";

export const LastDoorCutaway: React.FC<{
  stage?: "unlocked" | "knob" | "screws" | "deadbolt";
  kicker?: string;
  title?: string;
  caption?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  stage = "knob",
  kicker = "THE LAST DOOR",
  title = "Garage to kitchen",
  caption = "",
  bed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const ease = (a: number, b: number, e = Easing.bezier(0.33, 0, 0.2, 1)) =>
    clamp01(interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e }));

  // ── PLANTA (izquierda), trazo a trazo ─────────────────────────────────────────────────────────
  const draw = ease(0.02, 0.26);
  const ruta = ease(0.2, 0.44);
  const lupa = ease(0.4, 0.52);
  const det = ease(0.46, 0.6);
  const accion = ease(0.58, 0.84, Easing.inOut(Easing.cubic));
  const etiqueta = ease(0.7, 0.8);
  const head = ease(0, 0.08);
  const peligro = stage === "unlocked" || stage === "knob";
  const acento = peligro ? V.danger : V.brass;

  const trazo = (len: number, p: number) => ({ strokeDasharray: `${len}`, strokeDashoffset: `${len * (1 - p)}` });
  // cajas de la planta: [x, y, w, h, etiqueta]
  const PX = 110, PY = 330;
  const cajas: [number, number, number, number, string][] = [
    [PX, PY + 470, 820, 80, "STREET"],
    [PX + 60, PY + 290, 360, 180, "DRIVEWAY"],
    [PX + 60, PY + 20, 360, 270, "GARAGE"],
    [PX + 420, PY + 20, 400, 270, "KITCHEN"],
  ];
  const doorPlanX = PX + 420, doorPlanY = PY + 150;       // la puerta garage→cocina en la planta
  // la ruta punteada: calle → portón → puerta de la cocina
  const rutaPts = `M ${PX + 240} ${PY + 520} L ${PX + 240} ${PY + 300} L ${PX + 240} ${PY + 150} L ${doorPlanX - 14} ${doorPlanY}`;
  const rutaLen = 220 + 150 + 170;

  // ── DETALLE EN CORTE (derecha) ────────────────────────────────────────────────────────────────
  const DX = 1040, DY = 250, DW = 780, DH = 640;
  const doorGap = stage === "unlocked" ? 40 : 0;
  const latchIn = stage === "unlocked" ? 0 : 1;
  const screwLen = stage === "screws" ? interpolate(accion, [0, 1], [34, 150]) : stage === "deadbolt" ? 150 : 34;
  const screwSpin = stage === "screws" ? accion * 16 : 0;
  const bolt = stage === "deadbolt" ? interpolate(accion, [0, 1], [0, 110]) : 0;
  // geometría del corte (visto desde arriba): la hoja a la izquierda, el marco+parante a la derecha
  const hojaX = DX + 60 - doorGap, hojaY = DY + 250, hojaW = 380, hojaH = 90;
  const marcoX = DX + 450, parX = DX + 530;

  const pieIzq = ({ unlocked: "Knob only — and not locked", knob: "Short screws bite only the trim",
    screws: "Three-inch screws reach the stud", deadbolt: "A steel bolt into the frame" } as const)[stage];

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <PhotoBed src={bed} dim={0.82} />

      <div style={{ position: "absolute", left: 96, top: 70, opacity: head, transform: `translateY(${(1 - head) * 16}px)` }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 3.4, color: V.brass }}>{kicker}</div>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 62, color: V.white, marginTop: 4 }}>{title}</div>
      </div>

      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <defs>
          <pattern id="ldc_wood" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
            <rect width="14" height="14" fill="#6B4E32" />
            <line x1="0" y1="3" x2="14" y2="3" stroke="#5A4029" strokeWidth="2" />
            <line x1="0" y1="10" x2="14" y2="10" stroke="#7A5B3C" strokeWidth="1.5" />
          </pattern>
          <linearGradient id="ldc_steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E6E6EA" /><stop offset="0.5" stopColor="#A9A9B0" /><stop offset="1" stopColor="#6D6D74" />
          </linearGradient>
          <linearGradient id="ldc_brass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F2CE7A" /><stop offset="0.5" stopColor="#C8912F" /><stop offset="1" stopColor="#8A5F17" />
          </linearGradient>
        </defs>

        {/* planta */}
        {cajas.map(([x, y, w, h, l], i) => {
          const p = clamp01(draw * 1.6 - i * 0.18);
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill={i === 3 ? rgba(V.amber, 0.12 * p) : "none"} stroke={V.bone} strokeWidth={4} {...trazo(2 * (w + h), p)} />
              <text x={x + 18} y={y + 38} fill={rgba(V.bone, p)} fontFamily={F_DISPLAY} fontSize={26} letterSpacing={3}>{l}</text>
            </g>
          );
        })}
        {/* el portón (abierto) y la puerta de la cocina */}
        <line x1={PX + 80} y1={PY + 290} x2={PX + 400} y2={PY + 290} stroke={V.brassSoft} strokeWidth={10} strokeDasharray="18 12" opacity={draw} />
        <rect x={doorPlanX - 8} y={doorPlanY - 40} width={16} height={80} fill={acento} opacity={draw} />
        {/* ruta */}
        <path d={rutaPts} fill="none" stroke={V.white} strokeWidth={6} strokeLinecap="round" strokeDasharray="4 16" opacity={ruta > 0 ? 0.95 : 0} />
        <path d={rutaPts} fill="none" stroke={V.ink0} strokeWidth={10} strokeDasharray={`${rutaLen}`} strokeDashoffset={`${-rutaLen * ruta}`} opacity={ruta > 0 && ruta < 1 ? 0.0 : 0} />
        {(() => {
          // la cabeza de la ruta: un punto que avanza por el camino
          const seg = ruta * rutaLen;
          let x = PX + 240, y = PY + 520;
          if (seg <= 370) { y = PY + 520 - seg; }
          else { y = PY + 150; x = PX + 240 + (seg - 370); }
          return ruta > 0 ? <circle cx={x} cy={y} r={14} fill={acento} /> : null;
        })()}
        {/* la lupa: del plano al detalle */}
        <circle cx={doorPlanX} cy={doorPlanY} r={60 * lupa} fill="none" stroke={V.brass} strokeWidth={4} />
        <line x1={doorPlanX + 42} y1={doorPlanY - 42} x2={interpolate(lupa, [0, 1], [doorPlanX + 42, DX])} y2={interpolate(lupa, [0, 1], [doorPlanY - 42, DY])} stroke={V.brass} strokeWidth={3} />
        <line x1={doorPlanX + 42} y1={doorPlanY + 42} x2={interpolate(lupa, [0, 1], [doorPlanX + 42, DX])} y2={interpolate(lupa, [0, 1], [doorPlanY + 42, DY + DH])} stroke={V.brass} strokeWidth={3} />

        {/* ── el detalle en corte ── */}
        <g opacity={det} transform={`translate(${DX + DW / 2} ${DY + DH / 2}) scale(${interpolate(det, [0, 1], [0.6, 1])}) translate(${-(DX + DW / 2)} ${-(DY + DH / 2)})`}>
          <rect x={DX} y={DY} width={DW} height={DH} rx={18} fill={rgba(V.ink1, 0.96)} stroke={V.brass} strokeWidth={4} />
          <text x={DX + 30} y={DY + 50} fill={V.brass} fontFamily={F_DISPLAY} fontSize={26} letterSpacing={3}>SEEN FROM ABOVE</text>
          {/* pared y parante (stud) */}
          <rect x={parX} y={DY + 120} width={200} height={400} fill="url(#ldc_wood)" />
          <text x={parX + 100} y={DY + 555} fill={V.bone} fontFamily={F_BODY} fontSize={26} textAnchor="middle">stud</text>
          {/* marco / moldura */}
          <rect x={marcoX} y={DY + 180} width={80} height={280} fill="#A07A52" stroke="#5A4029" strokeWidth={3} />
          <text x={marcoX + 40} y={DY + 170} fill={V.bone} fontFamily={F_BODY} fontSize={24} textAnchor="middle">frame</text>
          {/* placa de cierre */}
          <rect x={marcoX - 6} y={DY + 250} width={12} height={90} fill="url(#ldc_brass)" />
          {/* tornillos de la placa */}
          {[DY + 266, DY + 324].map((sy, k) => (
            <g key={k}>
              <rect x={marcoX - 4} y={sy - 7} width={screwLen} height={14} rx={3} fill={stage === "knob" || stage === "unlocked" ? V.dangerSoft : "url(#ldc_brass)"} />
              {Array.from({ length: Math.floor(screwLen / 12) }).map((_, j) => (
                <line key={j} x1={marcoX + 6 + j * 12 + (screwSpin % 12)} y1={sy - 7} x2={marcoX + 1 + j * 12 + (screwSpin % 12)} y2={sy + 7} stroke="rgba(0,0,0,.35)" strokeWidth={2} />
              ))}
            </g>
          ))}
          {/* hoja de la puerta */}
          <rect x={hojaX} y={hojaY} width={hojaW} height={hojaH} fill="#D9D2C2" stroke="#8E8878" strokeWidth={3} />
          {/* pestillo (latch) */}
          <rect x={hojaX + hojaW - 10} y={hojaY + 30} width={latchIn ? 46 : 18} height={24} rx={4} fill="url(#ldc_steel)" />
          {/* cerrojo (deadbolt) */}
          {stage === "deadbolt" ? (
            <rect x={hojaX + hojaW - 90} y={hojaY + hojaH / 2 - 22} width={90 + bolt} height={44} rx={6} fill="url(#ldc_steel)" stroke="#55555C" strokeWidth={2} />
          ) : null}
          {/* perilla */}
          <circle cx={hojaX + hojaW - 70} cy={hojaY + hojaH + 34} r={26} fill="url(#ldc_brass)" />
          <rect x={hojaX + hojaW - 76} y={hojaY + hojaH} width={12} height={16} fill="#8A5F17" />
          {/* etiqueta */}
          <g opacity={etiqueta}>
            <rect x={DX + 40} y={DY + DH - 96} width={DW - 80} height={64} rx={10} fill={rgba(acento, 0.18)} stroke={acento} strokeWidth={3} />
            <text x={DX + DW / 2} y={DY + DH - 52} fill={V.white} fontFamily={F_DISPLAY} fontSize={36} textAnchor="middle">{pieIzq}</text>
          </g>
        </g>
      </svg>

      {caption ? (
        <div style={{ position: "absolute", left: 110, bottom: 70, maxWidth: 820, opacity: etiqueta, fontFamily: F_BODY, fontSize: 32, color: V.bone }}>{caption}</div>
      ) : null}
      <div style={{ position: "absolute", right: "4.5%", bottom: "4%", opacity: 0.85 }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
