// PatchTimer.tsx — LA PRUEBA DE 48 HORAS como set-piece: foto real del antebrazo en vidrio a la izquierda,
// a la derecha un dial de 48 h cuyo arco avanza hasta cada hito en el cuadro exacto en que se nombra (`at`),
// con las fichas de chequeo que aparecen, y un veredicto final (`verdictAt`) en rojo o verde.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, CL, ramp, spr, eIO, Atmosphere, Finish, Plane, GlassPhoto, useCam, KickerRule } from "./RoweDepth";

export type PatchMark = { h: number; label: string; at: number };

export const PatchTimer: React.FC<{
  kicker?: string;
  title?: string;
  img?: string;
  bed?: string;
  marks?: PatchMark[];
  verdict?: string;
  verdictAt?: number;
  tone?: "ok" | "danger";
  durationInFrames?: number;
}> = ({ kicker = "", title = "", img, bed, marks = [], verdict = "", verdictAt = 99999, tone = "danger", durationInFrames = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames;
  const cam = useCam(frame, fps, marks.map((m) => m.at), 0.05, dur);
  const out = ramp(frame, dur - 9, dur);
  const inK = spr(frame, fps, 2, 130, 0.9);
  const headA = ramp(frame, 4, 16);
  // horas mostradas: tramo interpolado entre hitos
  let hours = 0;
  for (let i = 0; i < marks.length; i++) {
    const m = marks[i], prevH = i ? marks[i - 1].h : 0;
    if (frame >= m.at) hours = interpolate(frame, [m.at, m.at + 22], [prevH, m.h], { ...CL, easing: eIO });
  }
  const R = 190, C = 2 * Math.PI * R;
  const frac = Math.min(1, hours / 48);
  const vU = ramp(frame, verdictAt, verdictAt + 8);
  const col = tone === "ok" ? V.ok : V.danger;

  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.01 ? `blur(${(out * 12).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed || img} blur={22} dim={0.66} bokeh={10} seed={81} camX={cam.camX} />
      <div style={{ position: "absolute", top: 58, left: 110, zIndex: 20, opacity: headA }}>
        <KickerRule text={kicker} a={headA} />
        <div style={{ fontFamily: F_DISPLAY, fontSize: 66, fontWeight: 700, color: V.white, marginTop: 6, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{title}</div>
      </div>
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 60%" }}>
        <Plane depth={0.8} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{ position: "absolute", left: 110, top: 290, transform: `perspective(1800px) rotateY(${interpolate(inK, [0, 1], [-20, 6]).toFixed(2)}deg)`, opacity: inK }}>
            <GlassPhoto img={img} w={860} h={484} glow={vU > 0 ? col : V.brass} glowK={vU > 0 ? vU : 0.25} push={frame * 0.00025} />
          </div>
        </Plane>
        <Plane depth={1} camX={cam.camX} camY={cam.camY} z={3}>
          <div style={{ position: "absolute", left: 1090, top: 250, width: 720, height: 720, opacity: inK }}>
            <svg width={520} height={520} viewBox="0 0 520 520" style={{ position: "absolute", left: 100, top: 0 }}>
              <circle cx={260} cy={260} r={R + 34} fill={rgba("#0A1220", 0.82)} stroke={rgba("#F1DDAE", 0.25)} strokeWidth={2} />
              {Array.from({ length: 48 }).map((_, i) => {
                const a = (i / 48) * Math.PI * 2 - Math.PI / 2, big = i % 12 === 0;
                return <line key={i} x1={260 + Math.cos(a) * (R + (big ? 8 : 18))} y1={260 + Math.sin(a) * (R + (big ? 8 : 18))} x2={260 + Math.cos(a) * (R + 26)} y2={260 + Math.sin(a) * (R + 26)} stroke={rgba("#F1DDAE", big ? 0.8 : 0.35)} strokeWidth={big ? 4 : 2} />;
              })}
              <circle cx={260} cy={260} r={R} fill="none" stroke={rgba("#F1DDAE", 0.12)} strokeWidth={22} />
              <circle cx={260} cy={260} r={R} fill="none" stroke={V.brass} strokeWidth={22} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 260 260)" style={{ filter: `drop-shadow(0 0 12px ${rgba(V.brass, 0.7)})` }} />
              <text x={260} y={262} textAnchor="middle" fontFamily={F_DISPLAY} fontWeight={700} fontSize={128} fill={V.white}>{Math.round(hours)}</text>
              <text x={260} y={322} textAnchor="middle" fontFamily={F_DISPLAY} fontWeight={700} fontSize={40} letterSpacing={6} fill={V.brassSoft}>HOURS</text>
            </svg>
            <div style={{ position: "absolute", top: 540, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16 }}>
              {marks.map((m, i) => {
                const u = ramp(frame, m.at, m.at + 9);
                return (
                  <div key={i} style={{ padding: "12px 20px", borderRadius: 8, background: rgba("#F3EAD6", 0.96), fontFamily: F_BODY, fontWeight: 700, fontSize: 28, color: "#2B2A28", opacity: u, transform: `translateY(${((1 - u) * 20).toFixed(1)}px)`, boxShadow: "0 12px 26px rgba(0,0,0,0.5)", borderTop: `6px solid ${V.brass}` }}>{m.label}</div>
                );
              })}
            </div>
          </div>
        </Plane>
        {verdict ? (
          <Plane depth={1.05} camX={cam.camX} camY={cam.camY} z={5}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", opacity: vU, transform: `scale(${interpolate(vU, [0, 1], [1.3, 1]).toFixed(3)})` }}>
              <span style={{ display: "inline-block", padding: "14px 40px", borderRadius: 10, background: col, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 52, letterSpacing: 2, color: V.white, boxShadow: `0 20px 50px ${rgba(col, 0.5)}`, textTransform: "uppercase" }}>{verdict}</span>
            </div>
          </Plane>
        ) : null}
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={83} />
    </AbsoluteFill>
  );
};
