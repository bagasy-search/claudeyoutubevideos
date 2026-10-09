// Kit de la BATERÍA (Claudio Old Mechanic ep. 9 "omwd40"), dentro del mundo (cama real + tarjeta):
//   ClVoltMeter  multímetro digital con la lectura que se asienta en `volts`, al lado la escala de carga (12,6 lleno · 12,4 ¾ · 12,2 ½ ·
//                12,0 ¼ · 11,9 vacío) con la flecha en su fila · mode "rest" (reposo), "crank" (baja y vuelve), "run" (13,7-14,7 =
//                alternador) · label
//   ClBucket     la batería como un balde: "kink" (llena pero la manguera pinchada: el chorro sale fino = la costra/grampa), "leak"
//                (gotea por un agujero = consumo parásito), "small" (balde chico = vejez), "ok" · label
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA, rnd } from "./ClTheme";
import { Bed, Card, RoomLight, lin, pop, useOut } from "./ClParts";

const ROWS = [{ v: 12.6, t: "FULL" }, { v: 12.4, t: "¾" }, { v: 12.2, t: "½" }, { v: 12.0, t: "¼" }, { v: 11.9, t: "EMPTY" }];
export const ClVoltMeter: React.FC<{ volts?: number; mode?: "rest" | "crank" | "run"; label?: string; bed?: string }> = ({ volts = 12.3, mode = "rest", label, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 14);
  const k = ease(clamp01((f - 8) / 18));
  let v = 0 + volts * k;
  if (mode === "crank") { const d = clamp01((f - 26) / 8) * (1 - clamp01((f - 44) / 10)); v = 12.4 - (12.4 - volts) * d; }
  const near = mode === "rest" ? ROWS.reduce((b, r) => (Math.abs(r.v - volts) < Math.abs(b.v - volts) ? r : b), ROWS[0]) : null;
  const lk = clamp01((f - 30) / 8);
  const ok = mode === "run" ? volts >= 13.7 && volts <= 14.7 : mode === "crank" ? volts >= 9.6 : volts >= 12.4;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1031} dim={0.62} />
      <div style={{ position: "absolute", left: 240, top: 140, width: 560, height: 800, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 40}px) rotate(-2deg)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 50, background: "linear-gradient(180deg,#F2C230,#D9A814)", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 50, top: 60, width: 460, height: 230, borderRadius: 18, background: "#B9C4A6", boxShadow: "inset 0 6px 14px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 36px", boxSizing: "border-box" }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 150, color: "#1C2215" }}>{v.toFixed(2)}</div>
        </div>
        <div style={{ position: "absolute", left: 50, top: 300, fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: "#3A2E0A" }}>V DC · 20</div>
        <div style={{ position: "absolute", left: 180, top: 380, width: 200, height: 200, borderRadius: 100, background: "#2A2F38", boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 120, top: 640, width: 80, height: 80, borderRadius: 40, background: CL.red }} />
        <div style={{ position: "absolute", left: 360, top: 640, width: 80, height: 80, borderRadius: 40, background: "#1A1A1A" }} />
      </div>
      <div style={{ position: "absolute", left: 900, top: 150, width: 820, opacity: clamp01(p * 1.3) }}>
        <Card style={{ padding: "34px 44px" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CL.ink, marginBottom: 14 }}>{mode === "rest" ? "Resting voltage" : mode === "crank" ? "While cranking" : "Engine running"}</div>
          {mode === "rest" ? ROWS.map((r) => (
            <div key={r.v} style={{ display: "flex", alignItems: "center", gap: 24, height: 86, background: near === r ? hexA(CL.yellow, 0.45 * lk) : "transparent", borderRadius: 12, padding: "0 16px" }}>
              <div style={{ width: 200, fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 58, color: CL.ink }}>{r.v.toFixed(1)}</div>
              <div style={{ flex: 1, height: 30, borderRadius: 8, background: hexA(CL.navy, 0.12) }}><div style={{ width: `${Math.max(4, (r.v - 11.8) / 0.8 * 100)}%`, height: "100%", borderRadius: 8, background: r.v >= 12.4 ? "#2E7D32" : r.v >= 12.2 ? CL.nitrile : CL.red }} /></div>
              <div style={{ width: 150, fontFamily: LABEL, fontWeight: 800, fontSize: 44, color: CL.inkSoft, textAlign: "right" }}>{r.t}</div>
            </div>
          )) : (
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CL.ink, lineHeight: 1.35 }}>
              {mode === "crank" ? <>Above <b>10 V</b>: healthy<br />9.5 V in deep cold: OK<br />In the 8s: struggling</> : <><b>13.7 – 14.7 V</b>: charging<br />≈ 12.5 V: not charging<br />Over 15 V: overcharging</>}
            </div>
          )}
        </Card>
        {label ? <div style={{ marginTop: 26, textAlign: "center", opacity: lk }}><span style={{ display: "inline-block", border: `8px solid ${ok ? "#2E7D32" : CL.red}`, color: ok ? "#2E7D32" : CL.red, background: "rgba(255,255,255,0.93)", fontFamily: LABEL, fontWeight: 800, fontSize: 52, letterSpacing: 3, padding: "6px 26px", borderRadius: 14, transform: "rotate(-2deg)" }}>{label}</span></div> : null}
      </div>
      <RoomLight k={0.25} />
    </AbsoluteFill>
  );
};

export const ClBucket: React.FC<{ mode?: "kink" | "leak" | "small" | "ok"; label?: string; bed?: string }> = ({ mode = "kink", label, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 14);
  const small = mode === "small" ? 1 - 0.45 * ease(clamp01((f - 10) / 20)) : 1;
  const W = 420 * small, H = 460 * small, x0 = 760 - W / 2, y0 = 640 - H;
  const lvl = mode === "leak" ? 0.85 - 0.5 * clamp01((f - 10) / (T * 0.7)) : 0.85;
  const lab = label || ({ kink: "FULL, BUT THE HOSE IS PINCHED", leak: "SOMETHING DRAINS IT", small: "THE BUCKET GOT SMALL", ok: "A GOOD BATTERY" } as any)[mode];
  const lk = clamp01((f - T * 0.4) / 8);
  const flowW = mode === "kink" ? 8 : 34;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1039} dim={0.62} />
      <div style={{ position: "absolute", left: 260, top: 110, width: 1400, height: 860, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 40}px)` }}>
        <Card style={{ position: "absolute", inset: 0, background: "#EEF2F6" }}>
          <svg width={1400} height={860} viewBox="260 110 1400 860" style={{ position: "absolute", inset: 0 }}>
            <path d={`M${x0} ${y0} L${x0 + W} ${y0} L${x0 + W - 40 * small} 640 L${x0 + 40 * small} 640 Z`} fill="#C7CDD6" stroke="#5B6372" strokeWidth={8} />
            <path d={`M${x0 + 10 + 40 * small * (1 - lvl)} ${640 - H * lvl} L${x0 + W - 10 - 40 * small * (1 - lvl)} ${640 - H * lvl} L${x0 + W - 40 * small - 6} 634 L${x0 + 40 * small + 6} 634 Z`} fill={hexA("#3E8AD6", 0.85)} />
            <text x={760} y={y0 - 24} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={42} fill={CL.ink}>12 V BATTERY</text>
            {/* la manguera de salida hacia el arranque */}
            <path d={`M${x0 + W - 30} 600 C ${x0 + W + 120} 600, 1180 600, 1240 520`} fill="none" stroke="#2A2F38" strokeWidth={28} />
            {mode === "kink" ? <circle cx={1150} cy={590} r={34} fill="none" stroke={CL.red} strokeWidth={8} /> : null}
            <path d={`M1240 520 Q 1290 600 1300 760`} fill="none" stroke={hexA("#3E8AD6", 0.9)} strokeWidth={flowW} strokeLinecap="round" strokeDasharray="30 18" strokeDashoffset={-f * 6} />
            <text x={1320} y={500} fontFamily="Arial" fontWeight={800} fontSize={36} fill={CL.inkSoft}>STARTER</text>
            {mode === "leak" ? Array.from({ length: 6 }, (_, i) => { const t = ((f + i * 9) % 54) / 54; return <ellipse key={i} cx={x0 + 60} cy={640 + t * 240} rx={9} ry={14} fill="#3E8AD6" opacity={1 - t} />; }) : null}
            {mode === "leak" ? <circle cx={x0 + 60} cy={628} r={10} fill="#1B1F27" /> : null}
            {/* el alternador llenando */}
            <path d={`M${x0 - 150} 300 C ${x0 - 60} 300, ${x0 + 20} 330, ${x0 + 60} ${y0 + 20}`} fill="none" stroke="#2A2F38" strokeWidth={22} />
            <path d={`M${x0 + 60} ${y0 + 20} L ${x0 + 70} ${640 - H * lvl}`} fill="none" stroke={hexA("#3E8AD6", 0.8)} strokeWidth={12} strokeDasharray="20 14" strokeDashoffset={-f * 5} />
            <text x={x0 - 160} y={280} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={36} fill={CL.inkSoft}>ALTERNATOR</text>
          </svg>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `rotate(-2deg) scale(${1.4 - 0.4 * lk})`, opacity: lk, border: `8px solid ${mode === "ok" ? "#2E7D32" : CL.red}`, color: mode === "ok" ? "#2E7D32" : CL.red, background: "rgba(255,255,255,0.93)", fontFamily: LABEL, fontWeight: 800, fontSize: 52, letterSpacing: 3, padding: "6px 28px", borderRadius: 14 }}>{lab}</div>
      </div>
      <RoomLight k={0.25} />
    </AbsoluteFill>
  );
};
