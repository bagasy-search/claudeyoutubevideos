// MovClose.tsx — MOVIMIENTO 6 · "DOS IDEAS" · 783 frames (26,1 s)
// Canal Mike Dalton (EN) · video `mdtoilet`.
//
// LA IDEA: todo el video cierra en un diagrama. Todo lo que ENTRA a la taza sale de un canal que
// nunca limpiaste y de un tanque que nunca abriste. Todo lo que SALE de la taza aterriza en un
// cuarto que nunca trataste. Y la taza del medio —la única parte que fregamos, la única de la que
// hablan los comerciales— es la única que se enjuaga sola, dos galones por vez.
//
// MATERIA QUE CRUZA LAS FRONTERAS: **la taza**. Está desde el frame 0, chiquita y al centro, y
// nunca se va: los actos son la cámara acercándose y las flechas naciendo alrededor de ella.
//
// ACTO 1 · f0–220  · "DOS IDEAS"        cam {z -260 → -120}
// ACTO 2 · f220–470 · "LO QUE ENTRA"    cam {z -120 → -10, panX -50}
// ACTO 3 · f470–650 · "LO QUE SALE"     cam {z -10 → +90, panX +60}
// ACTO 4 · f650–783 · "LA DEL MEDIO"    cam {z +90 → +150, hold vivo}
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { MD, rgba, clamp01, lerp, light, Atmos, Occluder, Sheen, glassStyle, F_SANS } from "../mdmold/Stage";
import { Blocks, PT } from "./Porcelain";

const C1 = 0, C2 = 220, C3 = 470, C4 = 650, END = 783;

const CAMERA = (f: number) => {
  const z =
    f < C2 ? lerp(-260, -120, clamp01(f / C2)) :
    f < C3 ? lerp(-120, -10, clamp01((f - C2) / (C3 - C2))) :
    f < C4 ? lerp(-10, 90, clamp01((f - C3) / (C4 - C3))) :
             lerp(90, 150, clamp01((f - C4) / (END - C4)));
  const panX =
    f < C3 ? lerp(0, -50, clamp01(f / C3)) :
    f < C4 ? lerp(-50, 60, clamp01((f - C3) / (C4 - C3))) :
             lerp(60, 20, clamp01((f - C4) / (END - C4)));
  const bx = Math.sin(f / 55) * 2.2;
  const by = Math.cos(f / 73) * 1.6;
  return `perspective(1400px) translateZ(${z.toFixed(2)}px) translate3d(${(panX + bx).toFixed(2)}px, ${by.toFixed(2)}px, 0) rotateX(${lerp(3, -1, clamp01(f / 700)).toFixed(3)}deg)`;
};

// la taza al centro, siempre presente
const BowlIcon: React.FC<{ f: number; rinse: number }> = ({ f, rinse }) => (
  <div style={{ position: "relative", width: 360, height: 260 }}>
    <div
      style={{
        position: "absolute", inset: 0,
        borderRadius: "46% 46% 26% 26% / 58% 58% 34% 34%",
        background: `linear-gradient(180deg, ${rgba(PT.china, 0.5)} 0%, ${rgba(PT.chinaDim, 0.24)} 56%, ${rgba("#16181B", 0.9)} 100%)`,
        boxShadow: "inset 0 4px 0 rgba(255,255,255,0.35), 0 30px 70px rgba(0,0,0,0.7)",
      }}
    />
    {/* el agua limpia que la enjuaga sola */}
    <div
      style={{
        position: "absolute", left: "12%", right: "12%", top: "44%", height: 60,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${rgba(PT.water, 0.42 + rinse * 0.4)} 0%, rgba(0,0,0,0) 74%)`,
        transform: `scaleY(${1 + Math.sin(f / 16) * 0.06})`,
      }}
    />
    {rinse > 0 &&
      Array.from({ length: 10 }, (_, i) => {
        const k = ((f / 30) + i * 0.1) % 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: `${16 + i * 7}%`, top: `${18 + k * 30}%`,
              width: 3, height: 22 * (1 - k), borderRadius: 2,
              background: rgba(PT.water, (1 - k) * 0.6 * rinse),
            }}
          />
        );
      })}
  </div>
);

// una flecha larga que se dibuja desde un rótulo hacia la taza (o al revés)
const Flow: React.FC<{
  f: number; at: number; from: "left" | "right" | "top"; out?: boolean; label: string; sub: string; color?: string;
}> = ({ f, at, from, out = false, label, sub, color = MD.red }) => {
  const a = clamp01((f - at) / 26);
  if (a <= 0) return null;
  const draw = clamp01((f - at - 14) / 34);
  const pos =
    from === "left" ? { left: "5%", top: "38%" } :
    from === "right" ? { right: "5%", top: "38%" } :
    { left: "50%", top: "6%", transform: "translateX(-50%)" };
  return (
    <>
      <div style={{ position: "absolute", ...pos, opacity: a, ...glassStyle({ radius: 14 }), padding: "16px 22px", maxWidth: 380 }}>
        <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 20, letterSpacing: 2.4, color }}>{label}</div>
        <div style={{ fontFamily: F_SANS, fontWeight: 700, fontSize: 30, color: MD.white, marginTop: 6, lineHeight: 1.14 }}>{sub}</div>
      </div>
      {/* la línea: nace en el rótulo y llega a la taza (o sale de ella) */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1920 1080" preserveAspectRatio="none">
        {(() => {
          const P =
            from === "left" ? { x1: 420, y1: 470, x2: 830, y2: 540 } :
            from === "right" ? { x1: 1500, y1: 470, x2: 1090, y2: 540 } :
            { x1: 960, y1: 210, x2: 960, y2: 430 };
          const x2 = lerp(P.x1, P.x2, draw), y2 = lerp(P.y1, P.y2, draw);
          const sx = out ? x2 : P.x1, sy = out ? y2 : P.y1;
          const ex = out ? P.x1 : x2, ey = out ? P.y1 : y2;
          return (
            <>
              <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={rgba(color, 0.75)} strokeWidth={4} strokeLinecap="round" />
              {draw > 0.9 && (
                <circle cx={out ? P.x1 : P.x2} cy={out ? P.y1 : P.y2} r={7} fill={color} />
              )}
            </>
          );
        })()}
      </svg>
    </>
  );
};

export const MovClose: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END - 1);
  const t = clamp01(f / END);
  const out = clamp01((frame - (durationInFrames - 12)) / 12);
  const rinse = clamp01((f - C4) / 90);
  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      <Atmos tint={light(t, "cold", "warm")} keyFrom={lerp(0.28, 0.56, t)} intensity={lerp(0.9, 1.02, t)} />
      <AbsoluteFill style={{ transform: CAMERA(f), transformStyle: "preserve-3d" }}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <BowlIcon f={f} rinse={rinse} />
        </AbsoluteFill>

        {/* ACTO 1 · dos ideas */}
        {f < C2 + 40 && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: "12%" }}>
            <div style={{ textAlign: "center", opacity: clamp01(1 - (f - C2) / 40) }}>
              <Blocks at={16} align="center" stepEvery={42} items={[{ t: "TWO IDEAS, REALLY.", size: 62 }]} />
            </div>
          </AbsoluteFill>
        )}

        {/* ACTO 2 · lo que ENTRA */}
        {f >= C2 && (
          <>
            <Flow f={f} at={C2 + 10} from="left" label="COMES IN" sub="A channel you have never cleaned" />
            <Flow f={f} at={C2 + 110} from="top" label="COMES IN" sub="A tank you have never opened" />
          </>
        )}

        {/* ACTO 3 · lo que SALE */}
        {f >= C3 && <Flow f={f} at={C3 + 8} from="right" out label="GOES OUT" sub="A room you have never treated" color={MD.redHot} />}
      </AbsoluteFill>

      {/* ACTO 4 · el remate, fuera de la cámara para que quede clavado y legible */}
      {f >= C4 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: "9%" }}>
          <div style={{ textAlign: "center", maxWidth: "78%" }}>
            <Blocks
              at={C4 + 12}
              align="center"
              stepEvery={44}
              items={[
                { t: "AND THE BOWL IN THE MIDDLE —", size: 40 },
                { t: "the one part that rinses itself", em: true, size: 72, gap: 8 },
              ]}
            />
          </div>
        </AbsoluteFill>
      )}

      <Occluder at={C2 - 10} dur={14} color={MD.ink2} angle={-5} />
      <Occluder at={C3 - 10} dur={12} color={MD.ink1} angle={7} />
      <Sheen at={C4 + 60} dur={30} />
      {out > 0 && <AbsoluteFill style={{ background: rgba(MD.ink0, out * 0.4) }} />}
    </AbsoluteFill>
  );
};
