// TfbCamera — CÁMARA VIRTUAL sobre cualquier plano (envolvé el <OffthreadVideo> con esto):
//   · punch: saltos de zoom secos (jump-cut de vlog) en cuadros dados → {f, s, x?, y?}
//   · push: acercamiento lento continuo (0 = nada)
//   · shakes: sacudón corto amortiguado en cada impacto (cuadros)
//   · whipIn / whipOut: barrido lateral con desenfoque de movimiento en la entrada / salida del plano
// TfbFreeze: congela un cuadro del video con flash blanco, leve empuje y una nota escrita a mano.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CAVEAT, TFB, clamp, easeInOut, pop } from "./theme";

export type Punch = { f: number; s: number; x?: number; y?: number };
export const TfbCam: React.FC<{ dur: number; punch?: Punch[]; push?: number; shakes?: number[]; whipIn?: number; whipOut?: number; gamma?: number; children: React.ReactNode }> = ({ dur, punch = [], push = 0, shakes = [], whipIn = 0, whipOut = 0, gamma = 1, children }) => {
  const f = useCurrentFrame();
  let s = 1, ox = 50, oy = 40;
  for (const p of punch) if (f >= p.f) { s = p.s; ox = (p.x ?? 0.5) * 100; oy = (p.y ?? 0.4) * 100; }
  s *= 1 + push * (f / Math.max(1, dur));
  let dx = 0, dy = 0, rot = 0;
  for (const k of shakes) { const t = f - k; if (t >= 0 && t < 14) { const a = Math.exp(-t / 4) * 14; dx += Math.sin(t * 2.7) * a; dy += Math.cos(t * 3.3) * a * 0.7; rot += Math.sin(t * 2.1) * a * 0.03; } }
  let blur = 0;
  if (whipIn && f < whipIn) { const t = interpolate(f, [0, whipIn], [1, 0], { ...clamp, easing: easeInOut }); dx += t * 900; blur = t * 38; }
  if (whipOut && f > dur - whipOut) { const t = interpolate(f, [dur - whipOut, dur], [0, 1], { ...clamp, easing: easeInOut }); dx -= t * 900; blur = Math.max(blur, t * 38); }
  // gamma > 1 aclara las sombras (clips más oscuros que sus anclas): filtro SVG feComponentTransfer, exponente 1/gamma
  const gid = gamma !== 1 ? `tg${Math.round(gamma * 100)}` : "";
  const filt = [gid ? `url(#${gid})` : "", blur ? `blur(${blur.toFixed(1)}px)` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      {gid && <svg width={0} height={0} style={{ position: "absolute" }}><filter id={gid} colorInterpolationFilters="sRGB"><feComponentTransfer>
        {(["R", "G", "B"] as const).map(c => React.createElement(`feFunc${c}`, { key: c, type: "gamma", amplitude: 1, exponent: 1 / gamma, offset: 0 }))}</feComponentTransfer></filter></svg>}
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${s * (blur ? 1.05 : 1)})`, transformOrigin: `${ox}% ${oy}%`, filter: filt }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TfbFreeze: React.FC<{ dur: number; src: string; frame: number; note?: string; noteX?: number; noteY?: number; ring?: { x: number; y: number; r: number } }> = ({ dur, src, frame, note, noteX = 0.5, noteY = 0.2, ring }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const flash = interpolate(f, [0, 2, 9], [0, 0.85, 0], clamp);
  const s = 1 + interpolate(f, [0, dur], [0, 0.06], clamp);
  const p = pop(f, fps, 5, 12, 0.6);
  const draw = interpolate(f, [4, 16], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, filter: "saturate(0.85) contrast(1.05)" }}>
        <Freeze frame={frame}><OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{ boxShadow: "inset 0 0 160px rgba(0,0,0,0.55)" }} />
      {ring && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><circle cx={ring.x * 1920} cy={ring.y * 1080} r={ring.r} fill="none" stroke={TFB.yellow} strokeWidth={10}
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} transform={`rotate(-80 ${ring.x * 1920} ${ring.y * 1080})`} /></svg>}
      {note && <div style={{ position: "absolute", left: `${noteX * 100}%`, top: `${noteY * 100}%`, transform: `translate(-50%,0) rotate(-3deg) scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: p,
        fontFamily: CAVEAT, fontWeight: 700, fontSize: 82, color: TFB.white, whiteSpace: "nowrap", textShadow: "0 4px 0 rgba(0,0,0,0.8), 0 0 24px rgba(0,0,0,0.6)" }}>{note}</div>}
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

/** Destello: flash blanco de 1-2 cuadros que se apaga (acento en un corte). */
export const TfbFlash: React.FC<{ dur: number; peak?: number }> = ({ dur, peak = 0.75 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(f, [0, 1, Math.max(2, dur)], [peak, peak * 0.6, 0], clamp) }} />;
};
