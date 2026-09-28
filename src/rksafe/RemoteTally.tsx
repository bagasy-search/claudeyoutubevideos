// RemoteTally.tsx — "¿CUÁNTOS CONTROLES ABREN TU CASA?" (canal Ray Kessler, rkremote).
//
// A la izquierda entran, uno por uno, los controles que el motor todavía reconoce (el del dueño
// anterior, el del paseador de perros, el del auto vendido…). De cada uno sale una onda de radio que
// viaja hasta el portón dibujado a la derecha, y el portón se ABRE un poco con cada una. Arriba, un
// contador tipo odómetro suma. Al final el número puede quedar como signo de pregunta en rojo: el
// punto es que NO sabés cuántos son.
// ⛔ Todo escalonado es FRACCIÓN de la duración.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, PhotoBed, Keyring } from "./RayStage";

const Remote: React.FC<{ size?: number; tone?: string }> = ({ size = 64, tone = "#9A9A9F" }) => (
  <svg width={size * 0.62} height={size} viewBox="0 0 62 100">
    <rect x="4" y="4" width="54" height="92" rx="12" fill={tone} stroke="#2A2A2E" strokeWidth="4" />
    <rect x="16" y="20" width="30" height="22" rx="6" fill="#3B3B40" />
    <rect x="16" y="50" width="30" height="14" rx="5" fill="#55555B" />
    <circle cx="31" cy="80" r="4" fill={V.danger} />
  </svg>
);

export const RemoteTally: React.FC<{
  kicker?: string;
  title?: string;
  items?: { text: string }[];
  final?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  kicker = "HOW MANY OPEN YOUR HOUSE?",
  title = "",
  items = [{ text: "Previous owner" }, { text: "Dog walker" }, { text: "The car you sold" }],
  final,
  bed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seqDur);
  const t = frame / D;
  const ease = (a: number, b: number, e = Easing.bezier(0.25, 0.1, 0.2, 1)) =>
    clamp01(interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e }));

  const n = items.length;
  const tIn = (i: number) => 0.12 + (i / Math.max(1, n)) * 0.58;      // escalón relativo
  const llegados = items.filter((_, i) => t > tIn(i) + 0.07).length;
  const finalA = final ? ease(0.8, 0.88) : 0;
  const apertura = clamp01(llegados / Math.max(1, n)) * 0.55;         // cuánto se abrió el portón
  const puerta = interpolate(ease(0.1, 0.9), [0, 1], [0, apertura]);

  // odómetro: el dígito rueda del número anterior al nuevo
  const rueda = items.reduce((acc, _, i) => acc + ease(tIn(i) + 0.03, tIn(i) + 0.09), 0);
  const entero = Math.floor(rueda);
  const frac = rueda - entero;

  const head = ease(0.0, 0.08);
  const doorX = 1220, doorY = 250, doorW = 560, doorH = 520;
  const paneles = 5;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <PhotoBed src={bed} dim={0.8} />

      <div style={{ position: "absolute", left: 96, top: 70, opacity: head, transform: `translateY(${(1 - head) * 16}px)` }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 3.4, color: V.brass }}>{kicker}</div>
        {title ? <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 58, color: V.white, marginTop: 6 }}>{title}</div> : null}
      </div>

      {/* odómetro */}
      <div style={{ position: "absolute", left: 96, top: title ? 210 : 150, height: 190, overflow: "hidden", opacity: head }}>
        <div style={{ position: "relative", height: 190, width: 260 }}>
          {[entero, entero + 1].map((v, k) => (
            <div key={k} style={{
              position: "absolute", left: 0, top: (k - frac) * 190, height: 190,
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 190, lineHeight: 1, color: finalA > 0.5 ? V.danger : V.brass,
              textShadow: `0 0 60px ${rgba(V.brass, 0.35)}`, opacity: finalA > 0.5 ? 0 : 1,
            }}>{v}</div>
          ))}
          {final ? (
            <div style={{
              position: "absolute", left: 0, top: 0, fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 190, lineHeight: 1,
              color: V.danger, opacity: finalA, transform: `scale(${interpolate(finalA, [0, 1], [1.6, 1])})`, transformOrigin: "left center",
              textShadow: `0 0 70px ${rgba(V.danger, 0.5)}`,
            }}>{final}</div>
          ) : null}
        </div>
      </div>

      {/* los controles que entran */}
      {items.map((it, i) => {
        const a = ease(tIn(i), tIn(i) + 0.06, Easing.out(Easing.back(1.4)));
        const y = (title ? 440 : 380) + i * Math.min(120, 520 / Math.max(1, n));
        const onda = clamp01((t - tIn(i) - 0.02) / 0.12);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 96, top: y, display: "flex", alignItems: "center", gap: 22, opacity: a, transform: `translateX(${(1 - a) * -80}px)` }}>
              <Remote size={84} tone={["#9A9A9F", "#6E6E74", "#B8B2A2", "#4A4A50", "#8C8578"][i % 5]} />
              <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 40, color: V.white, textShadow: "0 3px 14px rgba(0,0,0,.8)" }}>{it.text}</div>
              <div style={{ fontFamily: F_DISPLAY, fontSize: 40, color: V.brass }}>+1</div>
            </div>
            {/* onda de radio que viaja al portón */}
            {onda > 0 && onda < 1 ? (
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
                {[0, 1, 2].map((k) => {
                  const p = clamp01(onda - k * 0.12);
                  const x = interpolate(p, [0, 1], [640, doorX + 40]);
                  const yy = interpolate(p, [0, 1], [y + 42, doorY + doorH * 0.45]);
                  return <path key={k} d={`M ${x} ${yy - 34} Q ${x + 26} ${yy} ${x} ${yy + 34}`} stroke={rgba(V.brassSoft, (1 - p) * 0.9)} strokeWidth={5} fill="none" />;
                })}
              </svg>
            ) : null}
          </React.Fragment>
        );
      })}

      {/* el portón seccional, que se abre de a poco */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <rect x={doorX - 30} y={doorY - 30} width={doorW + 60} height={doorH + 50} fill="#26241F" stroke={V.bone} strokeWidth={4} opacity={head} />
        <rect x={doorX} y={doorY} width={doorW} height={doorH} fill="#0B0B0D" />
        {/* interior: la puerta a la cocina iluminada al fondo */}
        <rect x={doorX + doorW * 0.64} y={doorY + doorH * 0.36} width={90} height={doorH * 0.64} fill={rgba(V.amber, 0.55)} />
        {Array.from({ length: paneles }).map((_, k) => {
          const h = doorH / paneles;
          const yTop = doorY + k * h - puerta * doorH;
          if (yTop + h < doorY) return null;
          const yy = Math.max(doorY, yTop), hh = yTop + h - yy;
          return (
            <g key={k} opacity={head}>
              <rect x={doorX} y={yy} width={doorW} height={hh} fill="#E8E2D2" stroke="#9C9686" strokeWidth={3} />
              {hh > 30 ? [0, 1, 2, 3].map((c) => (
                <rect key={c} x={doorX + 22 + c * (doorW - 44) / 4} y={yy + 12} width={(doorW - 44) / 4 - 16} height={Math.max(0, hh - 24)} rx={4} fill="none" stroke="#B9B2A1" strokeWidth={3} />
              )) : null}
            </g>
          );
        })}
        {/* el motor en el techo */}
        <rect x={doorX + doorW * 0.38} y={doorY - 110} width={140} height={56} rx={12} fill="#BDB5A3" opacity={head} />
        <rect x={doorX + doorW * 0.38 + 100} y={doorY - 96} width={14} height={14} rx={3} fill={llegados ? V.brassSoft : "#3A3228"} opacity={head} />
      </svg>

      <div style={{ position: "absolute", right: "4.5%", bottom: "6%", opacity: 0.85 }}><Keyring size={30} /></div>
    </AbsoluteFill>
  );
};
