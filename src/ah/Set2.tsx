// Set2 — set-pieces nuevos de "Before Us" (desde el video 2). Genéricos: ningún texto quemado acá.
//   HourDial  columna vertebral de un video: dial tallado en la roca que avanza (HOUR 6 / GENERATION 40 / AGE 30)
//   RockList  "la lista" de la banda pintada en ocre sobre la roca: cada ítem con su marca (seguro / mata / sólo si…)
//   ClayBind  la arcilla atrapa el veneno: láminas de arcilla (−) capturan moléculas (+) sobre un plano real
//   GapLine   la demora: A ──── N horas ──── B, y el arco del cerebro que une B con A
import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "../yc/Media";
import { AH, BIG, SANS, SERIF, TSH, clamp, ease, easeInOut, lerp, rnd } from "./theme";

const W = 1920, H = 1080;
const useLife = (inF = 8, outF = 10) => {
  const f = useCurrentFrame(); const { durationInFrames: D, fps } = useVideoConfig();
  return { f, D, fps, a: clamp(f / inF) * (1 - clamp((f - (D - outF)) / outF)) };
};
const flick = (f: number, s = 0) => 0.9 + 0.06 * Math.sin(f / 2.1 + s) + 0.04 * Math.sin(f / 3.7 + s * 2) + 0.03 * Math.sin(f / 1.3 + s);
const OCHRE = "#8E2E14", CHAR = "#1A120C";

const Bed: React.FC<{ src: string; start?: number; dim?: number; fire?: boolean; kb?: any }> = ({ src, start, dim = 0, fire = true, kb = "in" }) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ filter: `brightness(${(fire ? flick(f) : 1) * (1 - dim)})` }}><Media src={src} start={start} kb={kb} zoom={1.08} /></AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)" }} />
    </>
  );
};

// ─── HOUR DIAL ────────────────────────────────────────────────────────────────
export const HourDial: React.FC<{
  value: number; prev?: number; max?: number; ticks?: number; unit?: string; label?: string; title: string; bed: string; bedStart?: number; pulse?: boolean; side?: "left" | "right";
}> = ({ value, prev, max = 12, ticks, unit, label = "HOUR", title, bed, bedStart, pulse = false, side = "left" }) => {
  const { f, fps, a } = useLife(8, 12);
  const p0 = prev ?? Math.max(0, value - 1);
  const sweep = easeInOut(clamp((f - 10) / 34));
  const cur = lerp(p0, value, sweep);
  const R = 300, cx = side === "left" ? 560 : 1360, cy = 540;
  const ang = (v: number) => -Math.PI / 2 + (v / max) * Math.PI * 2;
  const arc = (v0: number, v1: number, r: number) => {
    const a0 = ang(v0), a1 = ang(Math.max(v0 + 0.0001, v1));
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A ${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}`;
  };
  const beat = pulse ? 1 + 0.035 * Math.max(0, Math.sin((f / fps) * Math.PI * 2 * 1.2)) ** 8 : 1;
  const k = spring({ frame: f - 30, fps, config: { damping: 16, stiffness: 90 } });
  const tx = side === "left" ? 980 : 160;
  const shown = Number.isInteger(value) && Number.isInteger(p0) ? Math.round(cur) : +cur.toFixed(1);
  return (
    <AbsoluteFill style={{ opacity: a, background: "#000" }}>
      <Bed src={bed} start={bedStart} dim={0.38} />
      <AbsoluteFill style={{ background: side === "left" ? "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.35) 100%)" : "linear-gradient(270deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.35) 100%)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, transform: `scale(${beat})`, transformOrigin: `${cx}px ${cy}px` }}>
        <defs>
          <filter id="hdrough"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" /><feDisplacementMap in="SourceGraphic" scale="6" /></filter>
          <filter id="hdglow"><feGaussianBlur stdDeviation="9" /></filter>
        </defs>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(239,230,212,0.22)" strokeWidth={34} filter="url(#hdrough)" />
        {Array.from({ length: ticks ?? max }, (_, i) => {
          const tv = (i * max) / (ticks ?? max); const t = ang(tv); const on = tv < cur;
          return <line key={i} x1={cx + (R - 58) * Math.cos(t)} y1={cy + (R - 58) * Math.sin(t)} x2={cx + (R + 46) * Math.cos(t)} y2={cy + (R + 46) * Math.sin(t)}
            stroke={on ? AH.ember : "rgba(239,230,212,0.55)"} strokeWidth={i % 3 === 0 ? 10 : 6} strokeLinecap="round" filter="url(#hdrough)" />;
        })}
        {cur > 0.01 ? <>
          <path d={arc(0, cur, R)} fill="none" stroke={AH.blood} strokeWidth={34} filter="url(#hdglow)" opacity={0.75} />
          <path d={arc(0, cur, R)} fill="none" stroke={AH.ember} strokeWidth={22} strokeLinecap="round" filter="url(#hdrough)" />
        </> : null}
      </svg>
      <div style={{ position: "absolute", left: cx - 300, width: 600, top: cy - 170, textAlign: "center", transform: `scale(${beat})` }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, letterSpacing: 14, color: AH.bone, textShadow: TSH }}>{label}</div>
        <div style={{ fontFamily: BIG, fontSize: 250, lineHeight: 0.95, color: AH.flame, textShadow: `0 0 60px rgba(255,138,42,0.65), ${TSH}` }}>{shown}{unit ? <span style={{ fontSize: 90, marginLeft: 8 }}>{unit}</span> : null}</div>
      </div>
      <div style={{ position: "absolute", left: tx, width: 800, top: 420, opacity: clamp(k * 1.3), transform: `translateX(${(1 - k) * (side === "left" ? 60 : -60)}px)` }}>
        <div style={{ width: 120, height: 8, background: AH.ember, marginBottom: 30, borderRadius: 4 }} />
        <div style={{ fontFamily: BIG, fontSize: 118, lineHeight: 1.0, color: AH.bone, textShadow: TSH }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── ROCK LIST ────────────────────────────────────────────────────────────────
type Mark = "safe" | "dead" | "maybe";
const MarkGlyph: React.FC<{ m: Mark; k: number }> = ({ m, k }) => (
  <svg width={110} height={110} viewBox="0 0 110 110" style={{ flex: "none" }}>
    {m === "safe" ? <circle cx={55} cy={55} r={38} fill="none" stroke={OCHRE} strokeWidth={14} strokeDasharray={240} strokeDashoffset={240 * (1 - k)} strokeLinecap="round" /> : null}
    {m === "dead" ? <>
      <line x1={20} y1={20} x2={20 + 70 * clamp(k * 2)} y2={20 + 70 * clamp(k * 2)} stroke={CHAR} strokeWidth={16} strokeLinecap="round" />
      <line x1={90} y1={20} x2={90 - 70 * clamp(k * 2 - 1)} y2={20 + 70 * clamp(k * 2 - 1)} stroke={CHAR} strokeWidth={16} strokeLinecap="round" />
    </> : null}
    {m === "maybe" ? <path d="M 15 60 Q 35 25 55 60 T 95 60" fill="none" stroke={OCHRE} strokeWidth={13} strokeLinecap="round" strokeDasharray={140} strokeDashoffset={140 * (1 - k)} /> : null}
  </svg>
);
export const RockList: React.FC<{ bed: string; bedStart?: number; title?: string; items: { text: string; mark: Mark }[]; from?: number; step?: number; size?: number; [k: string]: any }> = (P) => {
  const { bed, bedStart, title, items, from = 0, step = 22, size = 84 } = P;
  const { f, a } = useLife(8, 12);
  return (
    <AbsoluteFill style={{ opacity: a, background: "#000" }}>
      <Bed src={bed} start={bedStart} dim={0.05} />
      <AbsoluteFill style={{ mixBlendMode: "multiply" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 6 }}>
          {title ? <div style={{ fontFamily: BIG, fontSize: 120, color: OCHRE, letterSpacing: 6, opacity: 0.95, clipPath: `inset(0 ${100 - clamp(f / 18) * 100}% 0 0)`, marginBottom: 18 }}>{title}</div> : null}
          {items.map((it, i) => {
            const t0 = i < from ? -999 : (P["t" + i] ?? 14 + (i - from) * step);
            const k = clamp((f - t0) / 16);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, width: 1240, opacity: 0.93 }}>
                <MarkGlyph m={it.mark} k={ease(clamp((f - t0 - 8) / 14))} />
                <div style={{ fontFamily: BIG, fontSize: size, lineHeight: 1.1, color: it.mark === "dead" ? CHAR : OCHRE, clipPath: `inset(0 ${100 - k * 100}% 0 0)`, letterSpacing: 2 }}>{it.text}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 115%, rgba(255,140,50,${0.2 * flick(f)}), rgba(0,0,0,0) 60%)`, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

// ─── CLAY BIND ────────────────────────────────────────────────────────────────
export const ClayBind: React.FC<{ bed: string; bedStart?: number; title?: string; sub?: string; grabAt?: number }> = ({ bed, bedStart, title, sub, grabAt = 30 }) => {
  const { f, D, fps, a } = useLife(8, 12);
  const cv = useRef<HTMLCanvasElement>(null);
  const NP = 14, NT = 110;
  useLayoutEffect(() => {
    const c = cv.current; if (!c) return; const g = c.getContext("2d")!; g.clearRect(0, 0, W, H);
    const plates = Array.from({ length: NP }, (_, i) => {
      const bx = 200 + (i % 7) * 255 + rnd(i) * 80, by = 330 + Math.floor(i / 7) * 330 + rnd(i + 1) * 80;
      return { x: bx + Math.sin(f / 30 + i) * 14, y: by + Math.cos(f / 26 + i) * 10 + clamp((f - (D - 60)) / 50) * 260, r: 0.55 + rnd(i + 2) * 0.4, rot: rnd(i + 3) * 3 + f / 200 };
    });
    for (const p of plates) {
      g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.scale(p.r, p.r);
      g.fillStyle = "rgba(196,150,104,0.88)"; g.strokeStyle = "rgba(90,58,30,0.95)"; g.lineWidth = 5;
      g.beginPath(); for (let k = 0; k < 6; k++) { const t = (k / 6) * Math.PI * 2; g.lineTo(Math.cos(t) * 110, Math.sin(t) * 64); } g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "rgba(40,26,14,0.9)"; g.font = `700 70px ${SANS}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("−", 0, 2);
      g.restore();
    }
    for (let i = 0; i < NT; i++) {
      const sx = rnd(i + 20) * W, sy = rnd(i + 21) * H;
      const p = plates[i % NP];
      const ang = rnd(i + 22) * Math.PI * 2, rr = 60 + rnd(i + 23) * 40;
      const tx = p.x + Math.cos(ang) * rr * p.r * 1.4, ty = p.y + Math.sin(ang) * rr * p.r * 0.9;
      const k = easeInOut(clamp((f - grabAt - rnd(i + 24) * 40) / 26));
      const x = lerp(sx + Math.sin(f / 8 + i) * 18, tx, k), y = lerp(sy + Math.cos(f / 9 + i) * 18, ty, k);
      g.fillStyle = `rgba(230,40,30,${0.9})`; g.shadowColor = "rgba(255,60,40,0.9)"; g.shadowBlur = k < 1 ? 14 : 4;
      g.beginPath(); g.arc(x, y, 10, 0, Math.PI * 2); g.fill(); g.shadowBlur = 0;
      g.fillStyle = "#fff"; g.font = `700 16px ${SANS}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("+", x, y + 1);
    }
  });
  const k = spring({ frame: f - 12, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ opacity: a, background: "#000" }}>
      <Bed src={bed} start={bedStart} dim={0.5} fire={false} />
      <canvas ref={cv} width={W} height={H} style={{ position: "absolute", inset: 0 }} />
      {title ? <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", opacity: clamp(k * 1.3) }}>
        <div style={{ fontFamily: BIG, fontSize: 112, color: AH.bone, textShadow: TSH }}>{title}</div>
        {sub ? <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 52, color: AH.amber, textShadow: TSH, marginTop: 6 }}>{sub}</div> : null}
      </div> : null}
    </AbsoluteFill>
  );
};

// ─── GAP LINE ────────────────────────────────────────────────────────────────
export const GapLine: React.FC<{ bed: string; bedStart?: number; a: string; b: string; hours: number; unit?: string; linkAt?: number; note?: string }> =
  ({ bed, bedStart, a: A, b: B, hours, unit = "HOURS LATER", linkAt = 80, note }) => {
  const { f, fps, a } = useLife(8, 12);
  const x0 = 300, x1 = 1620, y = 560;
  const draw = easeInOut(clamp((f - 14) / 40));
  const xs = lerp(x0, x1, draw);
  const n = Math.round(hours * draw);
  const link = easeInOut(clamp((f - linkAt) / 26));
  const kb = spring({ frame: f - 50, fps, config: { damping: 14 } });
  const arcPath = `M ${x1} ${y - 40} Q 960 ${y - 470} ${x0} ${y - 40}`;
  return (
    <AbsoluteFill style={{ opacity: a, background: "#000" }}>
      <Bed src={bed} start={bedStart} dim={0.45} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs><filter id="glr"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="5" /><feDisplacementMap in="SourceGraphic" scale="5" /></filter>
          <filter id="gls"><feGaussianBlur stdDeviation="8" /></filter></defs>
        <line x1={x0} y1={y} x2={xs} y2={y} stroke={AH.bone} strokeWidth={9} strokeLinecap="round" strokeDasharray="20 22" />
        <circle cx={x0} cy={y} r={30} fill={AH.flame} />
        {draw > 0.98 ? <circle cx={x1} cy={y} r={30 * clamp(kb * 1.2)} fill={AH.blood} /> : null}
        {link > 0 ? <>
          <path d={arcPath} fill="none" stroke={AH.ember} strokeWidth={22} filter="url(#gls)" strokeDasharray={1800} strokeDashoffset={1800 * (1 - link)} />
          <path d={arcPath} fill="none" stroke={AH.flame} strokeWidth={8} strokeLinecap="round" strokeDasharray={1800} strokeDashoffset={1800 * (1 - link)} />
        </> : null}
      </svg>
      <div style={{ position: "absolute", left: x0 - 260, width: 520, top: y + 60, textAlign: "center", fontFamily: BIG, fontSize: 86, color: AH.flame, textShadow: TSH }}>{A}</div>
      <div style={{ position: "absolute", left: x1 - 260, width: 520, top: y + 60, textAlign: "center", fontFamily: BIG, fontSize: 86, color: AH.bone, textShadow: TSH, opacity: clamp(kb * 1.3) }}>{B}</div>
      {hours > 0 ? <div style={{ position: "absolute", left: 0, right: 0, top: y - 170, textAlign: "center" }}>
        <span style={{ fontFamily: BIG, fontSize: 150, color: AH.bone, textShadow: TSH }}>{n}</span>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: 8, color: AH.bone, textShadow: TSH, marginLeft: 22 }}>{unit}</span>
      </div> : null}
      {note ? <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", opacity: link, fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: AH.amber, textShadow: TSH }}>{note}</div> : null}
    </AbsoluteFill>
  );
};
