// SelfCheck.tsx — el autotest de 4 preguntas como un MAZO de tarjetas de vidrio con FOTO.
// La pregunta activa queda adelante y nítida (foto que respira + pregunta + YES / NO que late); las que
// faltan esperan detrás, desenfocadas; al pasar a la siguiente la activa VUELA a la pila de la izquierda
// con un tilde. Mismo reloj en todos sus segmentos (`offset`), así el mazo retoma donde quedó.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, CL, ramp, Atmosphere, Finish, GlassPhoto, SegmentShell, KickerRule } from "./RoweDepth";

type Q = { text: string; img?: string; at: number; tone?: "brass" | "danger" };

const pose = (s: number) => {
  const S = [-3, -1, 0, 1, 2, 3];
  const m = (vals: number[]) => interpolate(s, S, vals, CL);
  return {
    x: m([250, 330, 1110, 1330, 1420, 1500]),
    y: m([660, 620, 590, 500, 450, 410]),
    sc: m([0.4, 0.44, 1, 0.8, 0.7, 0.62]),
    rot: m([-10, -6, 0, 4, 7, 9]),
    blur: m([2, 1.4, 0, 3.5, 5.5, 7]),
    op: m([0.85, 1, 1, 0.75, 0.55, 0.4]),
  };
};

export const SelfCheck: React.FC<{
  kicker?: string;
  questions?: Q[];
  offset?: number;
  bed?: string;
  durationInFrames?: number;
}> = ({ kicker = "", questions = [], offset = 0, bed, durationInFrames = 150 }) => {
  const local = useCurrentFrame();
  const frame = local + offset;
  const { fps } = useVideoConfig();
  const cur = questions.reduce((acc, q) => acc + interpolate(frame, [q.at, q.at + 16], [0, 1], { ...CL, easing: Easing.bezier(0.45, 0, 0.2, 1) }), 0) - 1;
  const idx = Math.max(0, Math.floor(cur + 0.001));
  const driftX = Math.sin(frame / fps * 0.4) * 10;
  const W = 860, H = 620;

  return (
    <SegmentShell frame={local} dur={durationInFrames}>
      <Atmosphere frame={frame} img={bed ?? questions[Math.min(idx, questions.length - 1)]?.img} blur={24} dim={0.68} bokeh={10} seed={61} camX={driftX} />
      <div style={{ position: "absolute", left: 120, top: 96, zIndex: 50 }}>
        <KickerRule text={kicker} a={1} />
        <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
          {questions.map((q, i) => {
            const k = interpolate(cur - i, [-1, 0], [0, 1], CL);
            return <div key={i} style={{ width: 54, height: 10, borderRadius: 5, background: k > 0.5 ? (q.tone === "danger" ? V.amber : V.brass) : rgba(V.white, 0.18), boxShadow: k > 0.5 ? `0 0 14px ${rgba(V.brass, 0.6)}` : "none" }} />;
          })}
        </div>
      </div>
      <AbsoluteFill style={{ transform: `translateX(${driftX.toFixed(2)}px)` }}>
        {questions.map((q, i) => {
          const s = i - cur;
          const p = pose(s);
          const active = Math.abs(s) < 0.5;
          const done = s <= -0.5;
          const t = frame - q.at;
          const yes = 0.5 + 0.5 * Math.sin(t / fps * Math.PI * 1.6);
          const acc = q.tone === "danger" ? V.amber : V.brass;
          return (
            <div key={i} style={{
              position: "absolute", left: p.x, top: p.y, zIndex: Math.round(100 - Math.abs(s) * 10),
              transform: `translate(-50%,-50%) perspective(1700px) rotateZ(${p.rot.toFixed(2)}deg) rotateY(${(s * -4).toFixed(2)}deg) scale(${p.sc.toFixed(4)})`,
              opacity: p.op,
            }}>
              <GlassPhoto w={W} h={H} blur={p.blur} glow={active ? acc : undefined} glowK={active ? ramp(frame, q.at + 6, q.at + 20) * 0.8 : 0}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 360, overflow: "hidden" }}>
                  <GlassPhoto img={q.img} w={W} h={360} radius={0} push={Math.max(0, t) * 0.0004} />
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, top: 330, bottom: 0, padding: "34px 44px", background: `linear-gradient(180deg, ${rgba(V.card, 0.6)} 0%, ${rgba(V.card, 0.99)} 14%)` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 22 }}>
                    <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 84, lineHeight: 0.9, color: acc }}>{i + 1}</div>
                    <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 50, lineHeight: 1.08, color: V.white }}>{q.text}</div>
                  </div>
                  <div style={{ display: "flex", gap: 18, marginTop: 22, marginLeft: 70, opacity: active ? ramp(frame, q.at + 18, q.at + 30) : 0 }}>
                    {["SÍ", "NO"].map((w, k) => (
                      <div key={w} style={{
                        padding: "8px 30px", borderRadius: 999, fontFamily: F_BODY, fontWeight: 800, fontSize: 28, letterSpacing: 2,
                        border: `2px solid ${k === 0 ? acc : rgba(V.white, 0.35)}`, color: k === 0 ? V.white : V.bone,
                        background: k === 0 ? rgba(acc, 0.18 + yes * 0.2) : "transparent",
                        boxShadow: k === 0 ? `0 0 ${(10 + yes * 20).toFixed(0)}px ${rgba(acc, 0.45)}` : "none",
                      }}>{w}</div>
                    ))}
                  </div>
                </div>
              </GlassPhoto>
              {done ? (
                <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: acc, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(-s, [0.5, 0.9], [0, 1], CL).toFixed(3)})`, boxShadow: `0 14px 30px ${rgba(acc, 0.6)}` }}>
                  <svg width={70} height={70} viewBox="0 0 40 40"><path d="M9 21 L17 29 L31 12" fill="none" stroke={V.onAccent} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              ) : null}
            </div>
          );
        })}
      </AbsoluteFill>
      <Finish frame={frame} camX={driftX} seed={63} />
    </SegmentShell>
  );
};
