// Componentes de relato de Hank Out Back: ficha de especie tipo expediente, contador de colas con billetes de $6 que se
// apilan en 3D, curva de daño que se dibuja, marco de cámara trampa y libreta de Hank sobre el capó.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "../yc/Media";
import { SANS, SERIF, MONO, HAND, HK, clamp, ease, easeInOut, rnd, lerp } from "./theme";

const useLife = (inF = 8, outF = 10) => { const f = useCurrentFrame(); const { durationInFrames: D, fps } = useVideoConfig(); return { f, D, fps, a: clamp(f / inF) * (1 - clamp((f - (D - outF)) / outF)) }; };

// ─── FICHA DE ESPECIE ───────────────────────────────────────────────────────
export const SpeciesFile: React.FC<{ photo: string; photoStart?: number; common: string; latin: string; facts: { k: string; v: string }[]; stamp?: string; bed?: string }> =
  ({ photo, photoStart, common, latin, facts, stamp = "INVASIVE", bed }) => {
  const { f, fps, a } = useLife();
  const s = spring({ frame: f, fps, config: { damping: 18, stiffness: 70 } });
  const st = spring({ frame: f - 30 - facts.length * 8, fps, config: { damping: 10, stiffness: 190, mass: 0.7 } });
  return (
    <AbsoluteFill style={{ opacity: a, background: HK.ink }}>
      {bed ? <AbsoluteFill style={{ filter: "blur(14px) brightness(0.35)" }}><Media src={bed} kb="in" /></AbsoluteFill> : null}
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div style={{ position: "absolute", left: 960, top: 545, width: 1480, height: 820, transform: `translate(-50%, -50%) rotateX(${(1 - s) * 30 + 6}deg) rotateZ(${-2 + (1 - s) * -6}deg) translateY(${(1 - s) * 300}px)`,
          background: "#E9E2CF", boxShadow: "0 60px 120px rgba(0,0,0,0.75)", display: "flex", padding: 44, boxSizing: "border-box", gap: 44 }}>
          <div style={{ position: "absolute", top: -26, left: 70, width: 260, height: 56, background: "#D8CDAE", borderRadius: "10px 10px 0 0", fontFamily: MONO, fontSize: 24, lineHeight: "56px", textAlign: "center", color: "#3A2E20" }}>FIELD FILE No. 01</div>
          <div style={{ width: 700, height: "100%", background: "#fff", padding: 14, boxSizing: "border-box", transform: "rotate(-1.5deg)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <div style={{ width: "100%", height: "100%", overflow: "hidden" }}><Media src={photo} start={photoStart} kb="in" zoom={1.12} /></div>
          </div>
          <div style={{ flex: 1, color: "#1E1A14" }}>
            <div style={{ fontFamily: SERIF, fontSize: 86, lineHeight: 1 }}>{common}</div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 38, color: "#5A4A36", marginTop: 8 }}>{latin}</div>
            <div style={{ height: 3, background: "#1E1A14", margin: "22px 0 16px" }} />
            {facts.map((x, i) => {
              const t = ease(clamp((f - 24 - i * 8) / 12));
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 32, padding: "10px 0", borderBottom: "1px dashed rgba(30,26,20,0.35)", opacity: t, transform: `translateX(${(1 - t) * 30}px)` }}>
                  <span style={{ color: "#5A4A36" }}>{x.k}</span><span style={{ fontWeight: 700 }}>{x.v}</span>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", right: 70, bottom: 60, transform: `rotate(-12deg) scale(${interpolate(st, [0, 1], [2.4, 1])})`, opacity: clamp(st * 1.5),
            border: `10px solid ${HK.red}`, color: HK.red, fontFamily: SANS, fontSize: 76, letterSpacing: 8, padding: "6px 30px", borderRadius: 14 }}>{stamp}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── CONTADOR DE COLAS + BILLETES ───────────────────────────────────────────
const Bill: React.FC<{ i: number; drop: number }> = ({ i, drop }) => (
  <div style={{ position: "absolute", left: -170, top: -80 - i * 7 - (1 - drop) * 500, width: 340, height: 150, borderRadius: 8, background: "linear-gradient(135deg,#C9D7B6,#9DB38A)",
    border: "3px solid #56704A", transform: `rotate(${(rnd(i) - 0.5) * 16}deg) translateX(${(rnd(i + 5) - 0.5) * 40}px)`, boxShadow: "0 6px 12px rgba(0,0,0,0.35)", opacity: drop > 0 ? 1 : 0,
    display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 80, color: "#2F4A2A" }}>$6</div>
);
export const TailCounter: React.FC<{ from?: number; to: number; label: string; money?: boolean; perTail?: number; bed?: string; bedStart?: number }> = ({ from = 0, to, label, money = true, perTail = 6, bed, bedStart }) => {
  const { f, D, a } = useLife();
  const p = easeInOut(clamp((f - 8) / (D * 0.62)));
  const v = Math.round(lerp(from, to, p));
  const digits = String(v).padStart(String(to).length, "0").split("");
  const bills = Math.floor(p * 26);
  return (
    <AbsoluteFill style={{ opacity: a }}>
      {bed ? <AbsoluteFill style={{ filter: "brightness(0.35) saturate(0.8)" }}><Media src={bed} start={bedStart} kb="in" /></AbsoluteFill> : <AbsoluteFill style={{ background: HK.ink }} />}
      <div style={{ position: "absolute", left: 140, top: 250 }}>
        <div style={{ fontFamily: SANS, fontSize: 34, letterSpacing: 10, color: HK.bone, marginBottom: 20 }}>{label}</div>
        <div style={{ display: "flex", gap: 10 }}>
          {digits.map((d, i) => (
            <div key={i} style={{ width: 110, height: 170, background: "linear-gradient(#1A1A18,#2B2B28 50%,#1A1A18)", borderRadius: 10, overflow: "hidden", position: "relative", boxShadow: "inset 0 0 0 3px #444, 0 10px 20px rgba(0,0,0,0.5)" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, fontFamily: MONO, fontSize: 130, lineHeight: "170px", textAlign: "center", color: "#F4EEDC" }}>{d}</div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 84, height: 2, background: "rgba(0,0,0,0.6)" }} />
            </div>
          ))}
        </div>
        {money ? <div style={{ fontFamily: SERIF, fontSize: 96, color: HK.gold, marginTop: 30, textShadow: "0 6px 20px rgba(0,0,0,0.7)" }}>= ${(v * perTail).toLocaleString("en-US")}</div> : null}
      </div>
      {money ? (
        <div style={{ position: "absolute", left: 1470, top: 760, perspective: 1200 }}>
          <div style={{ transform: "rotateX(55deg) rotateZ(-10deg)", transformStyle: "preserve-3d" }}>
            {Array.from({ length: bills }, (_, i) => <Bill key={i} i={i} drop={clamp((p * 26 - i) * 1.5)} />)}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ─── CURVA DE DAÑO ──────────────────────────────────────────────────────────
export const DamageChart: React.FC<{ series: { year: number; v: number }[]; title: string; unit: string; marks?: { year: number; label: string }[] }> = ({ series, title, unit, marks = [] }) => {
  const { f, D, a } = useLife();
  const p = easeInOut(clamp((f - 10) / (D * 0.65)));
  const W = 1500, H = 600, x0 = 210, y0 = 830;
  const minY = Math.min(...series.map((s) => s.year)), maxY = Math.max(...series.map((s) => s.year)), maxV = Math.max(...series.map((s) => s.v));
  const X = (yr: number) => x0 + ((yr - minY) / (maxY - minY)) * W, Y = (v: number) => y0 - (v / maxV) * H;
  const pts = series.map((s) => [X(s.year), Y(s.v)] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const lastIdx = Math.min(series.length - 1, Math.floor(p * (series.length - 1) + 0.0001));
  const cur = series[lastIdx];
  return (
    <AbsoluteFill style={{ opacity: a, background: `radial-gradient(ellipse at 40% 40%, #16261F 0%, ${HK.ink} 80%)` }}>
      <div style={{ position: "absolute", left: x0, top: 90, fontFamily: SANS, fontSize: 40, letterSpacing: 8, color: HK.bone }}>{title}</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[0, 0.25, 0.5, 0.75, 1].map((k) => <line key={k} x1={x0} x2={x0 + W} y1={y0 - k * H} y2={y0 - k * H} stroke="rgba(241,235,221,0.12)" />)}
        {[0, 0.25, 0.5, 0.75, 1].map((k) => <text key={"t" + k} x={x0 - 20} y={y0 - k * H + 10} fill="rgba(241,235,221,0.6)" fontFamily={MONO} fontSize={26} textAnchor="end">{Math.round(maxV * k / 1000)}k</text>)}
        {series.filter((_, i) => i % Math.ceil(series.length / 7) === 0 || i === series.length - 1).map((s) => <text key={s.year} x={X(s.year)} y={y0 + 46} fill="rgba(241,235,221,0.7)" fontFamily={MONO} fontSize={26} textAnchor="middle">{s.year}</text>)}
        <path d={`${d} L${x0 + W} ${y0} L${x0} ${y0} Z`} fill="rgba(255,122,26,0.12)" style={{ clipPath: `inset(0 ${100 - p * 100}% 0 0)` }} />
        <path d={d} stroke={HK.orange} strokeWidth={7} fill="none" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        {marks.map((m, i) => { const show = ease(clamp((p - (m.year - minY) / (maxY - minY)) * 8)); const s = series.find((x) => x.year === m.year) ?? series[0];
          return <g key={i} opacity={show}><line x1={X(m.year)} x2={X(m.year)} y1={Y(s.v) - 20} y2={Y(s.v) - 150} stroke={HK.bone} strokeWidth={2} strokeDasharray="6 6" />
            <text x={X(m.year)} y={Y(s.v) - 165} fill={HK.bone} fontFamily={SANS} fontSize={30} textAnchor="middle" letterSpacing={3}>{m.label}</text></g>; })}
        {pts[lastIdx] ? <circle cx={pts[lastIdx][0]} cy={pts[lastIdx][1]} r={12} fill={HK.orange} /> : null}
      </svg>
      <div style={{ position: "absolute", right: 120, top: 150, textAlign: "right" }}>
        <div style={{ fontFamily: SERIF, fontSize: 130, color: HK.bone, lineHeight: 1 }}>{cur.v.toLocaleString("en-US")}</div>
        <div style={{ fontFamily: SANS, fontSize: 26, letterSpacing: 6, color: HK.orange }}>{unit} · {cur.year}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── MARCO DE CÁMARA TRAMPA (overlay sobre metraje) ─────────────────────────
export const TrailCam: React.FC<{ src: string; start?: number; stamp?: string; temp?: string; night?: boolean }> = ({ src, start, stamp = "03:14 AM", temp = "68°F", night = true }) => {
  const { f, fps } = useLife(1, 1);
  const secs = Math.floor(f / fps);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: night ? "grayscale(1) sepia(0.2) hue-rotate(60deg) contrast(1.25) brightness(1.1)" : "contrast(1.1)" }}>
        <Media src={src} start={start} kb="none" zoom={1} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0 2px, rgba(0,0,0,0) 2px 4px)", mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 64, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px",
        fontFamily: MONO, fontSize: 30, color: "#E8E8E8" }}>
        <span>CAM 04  ●</span><span>{temp}</span><span>{stamp.replace(/:(\d\d)/, (m, mm) => ":" + String((+mm + Math.floor(secs / 60)) % 60).padStart(2, "0"))}:{String(secs % 60).padStart(2, "0")}</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 30, fontFamily: MONO, fontSize: 28, color: f % 30 < 15 ? HK.red : "transparent" }}>● REC</div>
    </AbsoluteFill>
  );
};

// ─── LIBRETA DE HANK sobre el capó ──────────────────────────────────────────
export const FieldNote: React.FC<{ lines: string[]; bed?: string; bedStart?: number }> = ({ lines, bed, bedStart }) => {
  const { f, D, a } = useLife();
  return (
    <AbsoluteFill style={{ opacity: a }}>
      {bed ? <AbsoluteFill style={{ filter: "blur(6px) brightness(0.5)" }}><Media src={bed} start={bedStart} kb="in" /></AbsoluteFill> : <AbsoluteFill style={{ background: "#2A2D2C" }} />}
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", left: 960, top: 560, width: 980, height: 760, transform: "translate(-50%, -50%) rotateX(28deg) rotateZ(-4deg)", background: "#F6EFD9",
          backgroundImage: "repeating-linear-gradient(0deg, rgba(60,90,160,0.25) 0 2px, transparent 2px 96px)", boxShadow: "0 50px 90px rgba(0,0,0,0.7)", padding: "110px 70px 60px", boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 60, top: 0, bottom: 0, width: 3, background: "rgba(200,40,40,0.5)" }} />
          {lines.map((l, i) => {
            const n = Math.floor(clamp((f - 10 - i * 26) / 24) * l.length);
            return <div key={i} style={{ fontFamily: HAND, fontSize: 84, lineHeight: "96px", color: i === lines.length - 1 ? HK.red : "#1D2A4F", paddingLeft: 30 }}>{l.slice(0, n)}</div>;
          })}
        </div>
      </AbsoluteFill>
      {void D}
    </AbsoluteFill>
  );
};
