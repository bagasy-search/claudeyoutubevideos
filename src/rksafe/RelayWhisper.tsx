// RelayWhisper.tsx — CÓMO "HABLA" UNA LLAVE SIN LLAVE, DENTRO DE LA ESCENA (canal Ray Kessler, rkkeyless v2).
//
// v2 (3-oct, "componentes flojos, aburridos"): ya no es un dibujo de casa sobre negro. Es la FOTO REAL
// de la casa de noche (`bg`) con la cámara empujando; la llave late en ámbar desde la ventana real
// (`keyAt`), el auto pregunta con un pulso blanco (`carAt`), y en mode="relay" aparecen dos puntos
// rojos (cerca de la casa y del auto) unidos por un hilo de luz que corre: el "alargue de radio".
// Al final el auto destella las balizas y un sello marca UNLOCKED.
// ⛔ Encuadre DEFENSIVO: sin aparatos ni personas; sólo luz sobre la escena.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01 } from "./RayStage";
import { WorldBed, Pulse, Stamp, Tag } from "./WorldBed";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };
const P = (x: number, y: number) => ({ X: x * 19.2, Y: y * 10.8 });

export const RelayWhisper: React.FC<{
  mode?: "normal" | "relay";
  kicker?: string;
  verdict?: string;
  bg?: string;
  keyAt?: [number, number];
  carAt?: [number, number];
  bed?: string;
  durationInFrames?: number;
}> = ({ mode = "relay", kicker = "HOW THE KEY TALKS", verdict = "", bg, keyAt = [29, 53], carAt = [69, 60], durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const relay = mode === "relay";
  const k = P(...keyAt), c = P(...carAt);
  const b1 = P(keyAt[0] + (carAt[0] - keyAt[0]) * 0.28, Math.max(keyAt[1], carAt[1]) + 9);
  const b2 = P(keyAt[0] + (carAt[0] - keyAt[0]) * 0.78, Math.max(keyAt[1], carAt[1]) + 11);
  const tag = interpolate(t, [0, 0.08], [0, 1], ease);
  const pregunta = interpolate(t, [0.1, 0.2], [0, 1], ease);
  const llave = interpolate(t, [0.2, 0.3], [0, 1], ease);
  const cajas = relay ? interpolate(t, [0.36, 0.44], [0, 1], ease) : 0;
  const hilo = relay ? interpolate(t, [0.46, 0.7], [0, 1], ease) : 0;
  const abierto = relay && t > 0.74;
  const flash = abierto && Math.floor(frame / 7) % 2 === 0;
  const stamp = relay ? clamp01((t - 0.76) / 0.1) : 0;
  const vA = interpolate(t, [0.84, 0.92], [0, 1], ease);
  // el hilo de luz: casa → caja 1 → caja 2 → auto
  const pts = [k, b1, b2, c];
  const segs = pts.slice(1).map((p, i) => ({ a: pts[i], b: p }));
  return (
    <AbsoluteFill>
      <WorldBed src={bg} push={0.14} fx={(keyAt[0] + carAt[0]) / 2} fy={keyAt[1]} dim={0.12} durationInFrames={D} />
      <Pulse x={carAt[0]} y={carAt[1]} color="#FFFFFF" t={pregunta} r={150} on={pregunta * (abierto ? 0 : 1)} />
      <Pulse x={keyAt[0]} y={keyAt[1]} color={V.brassSoft} t={llave} r={relay ? 120 : 190} on={llave} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {segs.map((s, i) => {
          const q = clamp01(hilo * 3 - i);
          if (q <= 0) return null;
          const x2 = s.a.X + (s.b.X - s.a.X) * q, y2 = s.a.Y + (s.b.Y - s.a.Y) * q;
          return (
            <g key={i}>
              <line x1={s.a.X} y1={s.a.Y} x2={x2} y2={y2} stroke={rgba(V.dangerSoft, 0.35)} strokeWidth={16} strokeLinecap="round" />
              <line x1={s.a.X} y1={s.a.Y} x2={x2} y2={y2} stroke={V.dangerSoft} strokeWidth={4} strokeDasharray="14 12" strokeDashoffset={-frame * 4} strokeLinecap="round" />
            </g>
          );
        })}
        {[b1, b2].map((b, i) => (
          <g key={i} opacity={cajas} transform={`translate(${b.X} ${b.Y})`}>
            <circle r={26 + 6 * Math.sin(frame / 5 + i)} fill={rgba(V.danger, 0.25)} />
            <circle r={11} fill={V.dangerSoft} />
          </g>
        ))}
        {flash ? (<><circle cx={c.X - 120} cy={c.Y} r={40} fill={rgba("#FFB43A", 0.75)} /><circle cx={c.X + 120} cy={c.Y} r={40} fill={rgba("#FFB43A", 0.75)} /></>) : null}
      </svg>
      {/* rótulos anclados a la escena */}
      <div style={{ position: "absolute", left: c.X - 220, top: c.Y - 190, width: 440, textAlign: "center", opacity: pregunta * (abierto ? 0.4 : 1), fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 46, color: V.white, textShadow: "0 4px 18px rgba(0,0,0,.95)" }}>"Is my key here?"</div>
      <div style={{ position: "absolute", left: k.X - 200, top: k.Y - 150, width: 400, textAlign: "center", opacity: llave, fontFamily: F_BODY, fontWeight: 700, fontSize: 34, color: V.brassSoft, textShadow: "0 3px 14px rgba(0,0,0,.95)" }}>{relay ? "The real key answers" : "Reaches a few feet"}</div>
      <Tag kicker={kicker} a={tag} />
      <Stamp text="UNLOCKED" color={V.dangerSoft} p={stamp} x={carAt[0]} y={carAt[1] + 18} size={90} />
      {verdict ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", opacity: vA, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 58, color: V.white, textShadow: "0 6px 26px rgba(0,0,0,.95)" }}>{verdict}</div>
      ) : null}
    </AbsoluteFill>
  );
};
