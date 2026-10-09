// OleCalorieMeter (manometro de hierro con aguja + contador) y OleDayClock (reloj de pared del hachero + campana).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SLAB, HAND, SERIF, woodBg, hexA, lanternGlow } from "./OleSupTheme";
import { Bed, CL, Rivet, easeOut, fadeOut, flicker, pop, sourceLine } from "./OleBits";

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
};
const fmtNum = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const fmtTick = (n: number) => (n >= 1000 ? `${Math.round((n / 1000) * 10) / 10}k` : String(Math.round(n * 10) / 10));

/* ---------------------------------------------------------------- CALORIE METER */
export const OleCalorieMeter: React.FC<{ label: string; to: number; unit: string; source: string; from?: number; bed?: string }> = ({ label, to, unit, source, from = 0, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const out = fadeOut(f, durationInFrames, 8);
  const inP = pop(f, fps, 0, 15);
  // escala "linda": 6 tramos de paso 1/2/2.5/5 x 10^k que cubra to*1.12
  const raw = (Math.max(to, from) * 1.12) / 6;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = ([1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) as number) || raw;
  const max = step * 6;
  const A0 = -125, A1 = 125;
  const angOf = (v: number) => A0 + ((A1 - A0) * v) / max;
  const t = interpolate(f, [16, 82], [0, 1], { ...CL, easing: Easing.bezier(0.25, 0.9, 0.3, 1) });
  const v = from + (to - from) * t;
  const wob = t >= 1 ? Math.sin((f - 82) * 0.9) * 1.8 * Math.exp(-(f - 82) * 0.13) : 0;
  const ang = angOf(v) + wob;
  const C = 360, R = 300;
  const fillLen = ((angOf(v) - A0) / 360) * 360;
  const glow = flicker(f, 5);
  const rIn = interpolate(f, [30, 50], [0, 1], { ...CL, easing: easeOut });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} />
      <AbsoluteFill style={{ background: lanternGlow, opacity: 0.6 * glow }} />
      <div style={{ position: "absolute", left: 90, top: 100, width: 760 + 60, height: 760, scale: String(0.7 + 0.3 * inP), opacity: Math.min(1, inP * 1.5), transformOrigin: "50% 50%" }}>
        <svg width={820} height={760} viewBox="-30 -20 780 760" style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="ironG" cx="35%" cy="30%"><stop offset="0" stopColor="#6a6560" /><stop offset="0.6" stopColor="#2c2926" /><stop offset="1" stopColor="#151311" /></radialGradient>
            <radialGradient id="faceG" cx="45%" cy="38%"><stop offset="0" stopColor="#FFF3D2" /><stop offset="0.8" stopColor="#E8D6A6" /><stop offset="1" stopColor="#CDB37A" /></radialGradient>
          </defs>
          <circle cx={C} cy={C} r={R + 40} fill="url(#ironG)" style={{ filter: "drop-shadow(0 26px 30px rgba(0,0,0,0.55))" }} />
          {Array.from({ length: 12 }).map((_, i) => { const [x, y] = polar(C, C, R + 20, i * 30 + 15); return <circle key={i} cx={x} cy={y} r={8} fill="#8b857d" stroke="#111" strokeWidth={2} />; })}
          <circle cx={C} cy={C} r={R - 6} fill="url(#faceG)" stroke="#1a1816" strokeWidth={8} />
          {/* zona roja final */}
          <circle cx={C} cy={C} r={R - 46} fill="none" stroke={hexA(OLE.plaid, 0.28)} strokeWidth={30} pathLength={360} strokeDasharray={`${(A1 - angOf(max * 0.85)) } 360`} strokeDashoffset={-(angOf(max * 0.85) - A0)} transform={`rotate(${A0 - 90} ${C} ${C})`} />
          {/* barra de llenado */}
          <circle cx={C} cy={C} r={R - 46} fill="none" stroke={OLE.ember} strokeWidth={22} strokeLinecap="butt" pathLength={360} strokeDasharray={`${Math.max(0, fillLen)} 360`} transform={`rotate(${A0 - 90} ${C} ${C})`} opacity={0.9} />
          {/* ticks */}
          {Array.from({ length: 31 }).map((_, i) => { const major = i % 5 === 0; const a = A0 + ((A1 - A0) * i) / 30; const [x1, y1] = polar(C, C, R - 76, a); const [x2, y2] = polar(C, C, R - (major ? 112 : 96), a); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={OLE.ink} strokeWidth={major ? 6 : 3} strokeLinecap="round" />; })}
          <text x={C} y={C + 150} textAnchor="middle" fontFamily={SLAB} fontSize={34} fill={OLE.inkSoft} letterSpacing={6}>OLE'S CAMP</text>
          {/* aguja */}
          <g transform={`rotate(${ang} ${C} ${C})`} style={{ filter: "drop-shadow(6px 8px 6px rgba(0,0,0,0.45))" }}>
            <path d={`M ${C - 9} ${C + 50} L ${C - 4} ${C - (R - 62)} L ${C + 4} ${C - (R - 62)} L ${C + 9} ${C + 50} Z`} fill={OLE.plaid} stroke="#4a1410" strokeWidth={2} />
          </g>
          {Array.from({ length: 7 }).map((_, i) => { const [x, y] = polar(C, C, R - 150, A0 + ((A1 - A0) * i) / 6); return <text key={i} x={x} y={y + 13} textAnchor="middle" fontFamily={SLAB} fontSize={38} fill={OLE.ink}>{fmtTick(step * i)}</text>; })}
          <circle cx={C} cy={C} r={30} fill="url(#ironG)" stroke="#0e0d0c" strokeWidth={4} />
          <circle cx={C} cy={C} r={9} fill="#9a948a" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 950, top: 250, width: 900, opacity: rIn, translate: `${(1 - rIn) * 80}px 0` }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 76, color: OLE.lanternSoft, lineHeight: 1, textShadow: "0 4px 0 rgba(0,0,0,0.55)" }}>{label}</div>
        <div style={{ fontFamily: SLAB, fontSize: 250, lineHeight: 1.05, color: OLE.lantern, textShadow: `0 10px 0 rgba(0,0,0,0.5), 0 0 60px ${hexA(OLE.lantern, 0.45)}`, marginTop: 6 }}>{fmtNum(v)}</div>
        <div style={{ fontFamily: SERIF, fontSize: 80, color: OLE.cream, textShadow: "0 4px 0 rgba(0,0,0,0.55)", marginTop: 4 }}>{unit}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 88, background: "rgba(14,9,5,0.72)", display: "flex", alignItems: "center", justifyContent: "center", opacity: rIn }}>
        <div style={{ fontFamily: SERIF, fontSize: 34, color: OLE.paper, letterSpacing: 1 }}>{sourceLine(source)}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- DAY CLOCK */
const fmtH = (h: number) => {
  const tot = Math.round((h * 60) / 5) * 5; const H = Math.floor(tot / 60) % 24; const M = tot % 60;
  const ap = H >= 12 ? "PM" : "AM"; const h12 = H % 12 === 0 ? 12 : H % 12;
  return `${h12}:${String(M).padStart(2, "0")} ${ap}`;
};
const fmtHShort = (h: number) => { const H = Math.floor(h) % 24; return `${H % 12 === 0 ? 12 : H % 12} ${H >= 12 ? "PM" : "AM"}`; };

export const OleDayClock: React.FC<{ marks: { h: number; label: string }[]; startH: number; endH: number; bed?: string }> = ({ marks, startH, endH, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const out = fadeOut(f, durationInFrames, 8);
  const inP = pop(f, fps, 0, 15);
  const t0 = 26, t1 = Math.max(t0 + 30, durationInFrames - 56);
  const p = interpolate(f, [t0, t1], [0, 1], { ...CL, easing: Easing.inOut(Easing.sin) });
  const hour = startH + (endH - startH) * p;
  const A0 = -135, A1 = 135;
  const angOf = (h: number) => A0 + ((A1 - A0) * (h - startH)) / (endH - startH);
  const CX = 560, CY = 480, R = 320;
  const arrived = f >= t1;
  const bt = Math.max(0, f - t1);
  const bell = arrived ? 16 * Math.sin(bt * 0.75) * Math.exp(-bt * 0.05) : 0;
  const rows = marks;
  const rowH = Math.min(124, 700 / Math.max(1, rows.length));
  const hoursTicks: number[] = []; for (let h = Math.ceil(startH); h <= endH; h++) hoursTicks.push(h);
  const glow = flicker(f, 2);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} />
      <AbsoluteFill style={{ background: lanternGlow, opacity: 0.55 * glow }} />
      {/* reloj */}
      <div style={{ position: "absolute", left: CX - 420, top: CY - 480, width: 840, height: 840, scale: String(0.75 + 0.25 * inP), opacity: Math.min(1, inP * 1.5) }}>
        <svg width={840} height={840} viewBox={`${CX - 420} ${CY - 420} 840 840`} style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="ckIron" cx="35%" cy="30%"><stop offset="0" stopColor="#6a6560" /><stop offset="0.6" stopColor="#2c2926" /><stop offset="1" stopColor="#151311" /></radialGradient>
            <radialGradient id="ckFace" cx="45%" cy="38%"><stop offset="0" stopColor="#FFF3D2" /><stop offset="0.85" stopColor="#E8D6A6" /><stop offset="1" stopColor="#CDB37A" /></radialGradient>
          </defs>
          <circle cx={CX} cy={CY} r={R + 40} fill="url(#ckIron)" style={{ filter: "drop-shadow(0 26px 30px rgba(0,0,0,0.55))" }} />
          <circle cx={CX} cy={CY} r={R - 4} fill="url(#ckFace)" stroke="#1a1816" strokeWidth={8} />
          {/* riel del recorrido */}
          <circle cx={CX} cy={CY} r={R - 48} fill="none" stroke="rgba(60,40,20,0.18)" strokeWidth={26} pathLength={360} strokeDasharray={`${A1 - A0} 360`} transform={`rotate(${A0 - 90} ${CX} ${CY})`} />
          <circle cx={CX} cy={CY} r={R - 48} fill="none" stroke={OLE.ember} strokeWidth={26} pathLength={360} strokeDasharray={`${Math.max(0, angOf(hour) - A0)} 360`} transform={`rotate(${A0 - 90} ${CX} ${CY})`} />
          {hoursTicks.map((h) => { const a = angOf(h); const [x1, y1] = polar(CX, CY, R - 70, a); const [x2, y2] = polar(CX, CY, R - 96, a); const [lx, ly] = polar(CX, CY, R - 128, a); const show = (h - Math.ceil(startH)) % 2 === 0; return (<g key={h}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={OLE.ink} strokeWidth={show ? 6 : 3} strokeLinecap="round" />{show ? <text x={lx} y={ly + 12} textAnchor="middle" fontFamily={SLAB} fontSize={34} fill={OLE.ink}>{h % 12 === 0 ? 12 : h % 12}</text> : null}</g>); })}
          {rows.map((m, i) => { const [x, y] = polar(CX, CY, R - 48, angOf(m.h)); const lit = hour >= m.h - 0.001; return <g key={i}>{lit ? <circle cx={x} cy={y} r={30} fill={hexA(OLE.lantern, 0.55)} /> : null}<circle cx={x} cy={y} r={15} fill={lit ? OLE.lanternSoft : "#8a7a5c"} stroke="#1a1816" strokeWidth={4} /></g>; })}
          {/* lectura digital */}
          <text x={CX} y={CY + 190} textAnchor="middle" fontFamily={SLAB} fontSize={66} fill={OLE.ink}>{fmtH(hour).split(" ")[0]}</text>
          <text x={CX} y={CY + 232} textAnchor="middle" fontFamily={SLAB} fontSize={38} fill={OLE.plaid} letterSpacing={6}>{fmtH(hour).split(" ")[1]}</text>
          {/* manecilla */}
          <g transform={`rotate(${angOf(hour)} ${CX} ${CY})`} style={{ filter: "drop-shadow(5px 7px 5px rgba(0,0,0,0.4))" }}>
            <path d={`M ${CX - 9} ${CY + 40} L ${CX - 3} ${CY - (R - 70)} L ${CX + 3} ${CY - (R - 70)} L ${CX + 9} ${CY + 40} Z`} fill="#1a1816" />
          </g>
          <circle cx={CX} cy={CY} r={22} fill="url(#ckIron)" stroke="#0e0d0c" strokeWidth={3} />
          {/* campana de la cena */}
          <g transform={`translate(${CX} ${CY + R + 34}) rotate(${bell} 0 -50)`} style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.5))" }}>
            <path d="M -62 40 C -62 -20 -44 -50 0 -54 C 44 -50 62 -20 62 40 Z" fill="#B98A2C" stroke="#4a3410" strokeWidth={5} />
            <path d="M -50 40 C -50 0 -36 -36 -14 -44" fill="none" stroke="rgba(255,240,180,0.55)" strokeWidth={8} strokeLinecap="round" />
            <rect x={-70} y={36} width={140} height={14} rx={7} fill="#8a6520" stroke="#4a3410" strokeWidth={4} />
            <circle cx={0} cy={62} r={13} fill="#3a2a12" />
            <circle cx={0} cy={-58} r={9} fill="#3a2a12" />
          </g>
          {arrived ? [0, 1].map((k) => { const s = ((bt * 0.05 + k * 0.5) % 1); return <circle key={k} cx={CX} cy={CY + R + 34} r={70 + s * 90} fill="none" stroke={hexA(OLE.lanternSoft, 0.7 * (1 - s))} strokeWidth={6} />; }) : null}
        </svg>
      </div>
      {/* lista de marcas */}
      <div style={{ position: "absolute", left: 1090, top: 540 - (rowH * rows.length) / 2 - 30, width: 780, padding: "30px 36px", borderRadius: 18, background: "rgba(22,14,8,0.62)", boxShadow: `0 24px 50px ${OLE.shadow}, inset 0 0 0 3px rgba(255,210,140,0.16)`, opacity: interpolate(f, [16, 32], [0, 1], CL) }}>
        {rows.map((m, i) => {
          const lit = hour >= m.h - 0.001;
          const on = lit ? pop(f, fps, Math.round(t0 + (t1 - t0) * ((m.h - startH) / (endH - startH))) , 12) : 0;
          return (
            <div key={i} style={{ height: rowH, display: "flex", alignItems: "center", gap: 28, opacity: 0.32 + 0.68 * on, translate: `${(1 - on) * 14}px 0` }}>
              <div style={{ minWidth: 190, fontFamily: SLAB, fontSize: 50, color: lit ? OLE.lantern : OLE.paperEdge, textShadow: "0 3px 0 rgba(0,0,0,0.5)" }}>{fmtHShort(m.h)}</div>
              <div style={{ fontFamily: SERIF, fontSize: 50, lineHeight: 1.05, color: OLE.cream, textShadow: "0 3px 0 rgba(0,0,0,0.5)" }}>{m.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
