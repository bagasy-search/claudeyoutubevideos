import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT, COL, e, ei, spr, extrude } from "./lib";
import { Stage } from "./base";

const rnd = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
const W = 1920, H = 1080;

type Nodo = { x: number; y: number; label: string };

const MedidorDial: React.FC<{ t: number; at: number; giro: number; scale: number; glow: number }> = ({ t, at, giro, scale, glow }) => {
  const spin = t > at + 0.5 ? (t - at - 0.5) * giro : 0;
  const wob = Math.sin(t * 9) * 1.6;
  const ang = spin + wob;
  const pts: string[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + ang * Math.PI / 180;
    const r = i % 2 === 0 ? 26 : 12;
    pts.push(`${Math.cos(a) * r},${Math.sin(a) * r}`);
  }
  const needle = -90 + Math.sin(t * 1.7) * 6;
  return (
    <svg width={380 * scale} height={380 * scale} viewBox="-190 -190 380 380" style={{ filter: `drop-shadow(0 12px 30px rgba(0,0,0,.7)) drop-shadow(0 0 ${18 * glow}px rgba(143,214,255,${0.5 * glow}))` }}>
      <defs>
        <radialGradient id="dialG" cx="42%" cy="36%" r="72%">
          <stop offset="0%" stopColor="#dfe6ea" />
          <stop offset="55%" stopColor="#9aa6ad" />
          <stop offset="100%" stopColor="#4a5359" />
        </radialGradient>
        <radialGradient id="starG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6d8" />
          <stop offset="60%" stopColor="#ffd84a" />
          <stop offset="100%" stopColor="#c99a10" />
        </radialGradient>
      </defs>
      <circle r="178" fill="#2b2f33" />
      <circle r="168" fill="url(#dialG)" />
      <circle r="168" fill="none" stroke="#1a1d20" strokeWidth="4" />
      {Array.from({ length: 40 }).map((_, i) => {
        const a = (i / 40) * Math.PI * 2 - Math.PI / 2;
        const big = i % 4 === 0;
        const r1 = big ? 128 : 138, r2 = 150;
        return <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} stroke={big ? "#1c1f22" : "#5a636a"} strokeWidth={big ? 5 : 2.5} strokeLinecap="round" />;
      })}
      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110].map((n, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return <text key={n} x={Math.cos(a) * 100} y={Math.sin(a) * 100 + 9} fill="#20242a" fontSize="22" fontWeight={800} fontFamily={FONT} textAnchor="middle">{n}</text>;
      })}
      <g transform={`rotate(${needle})`}>
        <line x1="0" y1="0" x2="0" y2="-150" stroke="#d7261e" strokeWidth="6" strokeLinecap="round" />
        <circle r="10" fill="#d7261e" />
      </g>
      <g transform={`rotate(${ang})`}>
        <polygon points={pts.join(" ")} fill="url(#starG)" stroke="#7a5a00" strokeWidth="2" />
        <circle r="6" fill="#5a4300" />
      </g>
      <circle r="178" fill="none" stroke="rgba(0,0,0,.5)" strokeWidth="10" />
    </svg>
  );
};

const PanelCasa: React.FC<{ t: number; at: number; clave: number; nodos: string[]; out: number }> = ({ t, at, clave, nodos, out }) => {
  const open = ei(t, clave, clave + 0.8);
  const cx = 1340, cy = 540, sc = 1;
  const medX = 1010, medY = 720;
  const nodes: Nodo[] = [
    { x: 1470, y: 330, label: nodos[0] ?? "INODOROS" },
    { x: 1560, y: 480, label: nodos[1] ?? "LLAVES" },
    { x: 1360, y: 620, label: nodos[2] ?? "GENERAL" },
    { x: 1180, y: 760, label: nodos[3] ?? "CAÑO ENTERRADO" },
  ];
  const closeStart = clave + 1.8;
  const closed = nodes.map((_, i) => e(t, closeStart + i * 0.5, closeStart + i * 0.5 + 0.35));
  const lastClosed = (() => { let n = 0; for (let i = 0; i < 3; i++) if (closed[i] > 0.6) n = i + 1; return n; })();
  const live = t > closeStart + 1.5;
  const pulse = 1 + 0.08 * Math.sin(t * 6);
  const housePath = "M 1180 760 L 1180 470 L 1360 340 L 1540 470 L 1540 700 L 1470 700 L 1470 560 L 1300 560 L 1300 700 L 1180 700";
  const len = 1400;
  const dash = open * len;
  const pipe = `M ${medX} ${medY} L ${nodes[3].x} ${nodes[3].y} L ${nodes[2].x} ${nodes[2].y} L ${nodes[1].x} ${nodes[1].y} L ${nodes[0].x} ${nodes[0].y}`;
  const flowLen = 1600;
  const flowOff = -((t - clave) * 260) % flowLen;
  const cut = lastClosed / 4;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: open, transform: `translateX(${(1 - open) * 120}px) scale(${sc})` }}>
      <defs>
        <filter id="glowB"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <linearGradient id="pipeG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8fd6ff" /><stop offset="100%" stopColor="#d9f3ff" />
        </linearGradient>
      </defs>
      <path d={housePath} fill="none" stroke="rgba(143,214,255,.55)" strokeWidth="4" strokeDasharray={`${dash} ${len}`} strokeLinejoin="round" />
      <path d={pipe} fill="none" stroke="rgba(143,214,255,.25)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 10" />
      <path d={pipe} fill="none" stroke="url(#pipeG)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${flowLen * (1 - cut)} ${flowLen}`} strokeDashoffset={flowOff} filter="url(#glowB)" opacity={live ? 0.35 : 1} />
      {live && (
        <g>
          <path d={`M ${medX} ${medY} L ${nodes[3].x} ${nodes[3].y}`} fill="none" stroke="#ff4a3d" strokeWidth={10 * pulse} strokeLinecap="round" filter="url(#glowB)" opacity={0.85} />
          <path d={`M ${medX} ${medY} L ${nodes[3].x} ${nodes[3].y}`} fill="none" stroke="#ffd0c8" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 14" strokeDashoffset={-(t * 90) % 20} />
        </g>
      )}
      {nodes.map((n, i) => {
        const c = closed[i];
        return (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={16 + 4 * Math.sin(t * 3 + i)} fill="rgba(11,20,36,.85)" stroke={c > 0.5 ? "#ff4a3d" : "#8fd6ff"} strokeWidth="3" />
            <circle cx={n.x} cy={n.y} r="6" fill={c > 0.5 ? "#ff4a3d" : "#8fd6ff"} opacity={0.9} />
            {c > 0.01 && (
              <g opacity={c}>
                <line x1={n.x - 12} y1={n.y - 12} x2={n.x + 12} y2={n.y + 12} stroke="#ff4a3d" strokeWidth="5" strokeLinecap="round" />
                <line x1={n.x + 12} y1={n.y - 12} x2={n.x - 12} y2={n.y + 12} stroke="#ff4a3d" strokeWidth="5" strokeLinecap="round" />
              </g>
            )}
            <text x={n.x + 26} y={n.y + 6} fill={c > 0.5 ? "#ffb0a8" : "#d9f3ff"} fontSize="22" fontFamily={FONT} fontWeight={800} letterSpacing="1">{n.label}</text>
          </g>
        );
      })}
      <g>
        <rect x={medX - 40} y={medY - 30} width="80" height="60" rx="8" fill="#2b2f33" stroke="#8fd6ff" strokeWidth="3" />
        <text x={medX} y={medY + 8} fill="#8fd6ff" fontSize="18" fontFamily={FONT} fontWeight={800} textAnchor="middle">MED.</text>
      </g>
    </svg>
  );
};

export const MedidorFuga: React.FC<{ t: number; at: number; out: number; clave: number; bgImg?: string; giro?: number; nodos?: string[] }> = ({ t, at, out, clave, bgImg = "plo31t/img/plo31t_t0_02.jpg", giro = 180, nodos = ["INODOROS", "LLAVES", "GENERAL", "CAÑO ENTERRADO"] }) => {
  if (t < at - 0.1 || t > out + 0.6) return null;
  const exit = ei(t, out, out + 0.55);
  const enter = spr(t, at, 0.9);
  const cardZ = -900 * (1 - enter) - 500 * exit;
  const cardRy = (1 - enter) * 55 + exit * 40;
  const blur = exit * 14;
  const tagIn = spr(t, at + 1.0, 0.8);
  const tagOut = ei(t, out - 0.2, out + 0.2);
  const live = t > clave + 1.5;
  const pulse = 1 + 0.08 * Math.sin(t * 6);
  const redTagIn = spr(t, clave + 2.6, 0.8);
  const redTagOut = ei(t, out + 0.05, out + 0.55);
  return (
    <AbsoluteFill style={{ perspective: 1400, filter: `blur(${blur}px)` }}>
      <Stage t={t} a={at} b={out + 0.5} bg={undefined} tint="#ffc890">
        <AbsoluteFill>
          <Img src={staticFile(bgImg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(22px) brightness(.5) saturate(.9)", transform: `scale(${1.08 + 0.04 * Math.sin(t * 0.4)})` }} />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 45%, rgba(11,20,36,.15), rgba(11,20,36,.85) 75%)" }} />
        </AbsoluteFill>

        <PanelCasa t={t} at={at} clave={clave} nodos={nodos} out={out} />

        <div style={{ position: "absolute", left: 480, top: 540, transform: `translate(-50%,-50%) translateZ(${cardZ}px) rotateY(${cardRy}deg) scale(${0.95 + 0.05 * enter})`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "relative", width: 560, height: 560, borderRadius: 28, background: "linear-gradient(160deg,#3a3f44,#22262a)", boxShadow: "0 40px 90px rgba(0,0,0,.75), inset 0 0 0 2px rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MedidorDial t={t} at={at} giro={giro} scale={1.35} glow={live ? pulse : 0.4} />
          </div>
        </div>

        <div style={{ position: "absolute", left: 480, top: 900, transform: `translate(-50%,-50%) scale(${Math.min(1.05, tagIn)})`, opacity: tagIn * (1 - tagOut), textAlign: "center", fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow: extrude(6, "rgba(0,0,0,.65)"), whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 46, letterSpacing: 2 }}>TODO CERRADO… <span style={{ color: "#ffd84a" }}>Y GIRA</span></div>
        </div>

        {live && (
          <div style={{ position: "absolute", left: 1340, top: 990, transform: `translate(-50%,-50%) scale(${Math.min(1.06, redTagIn) * pulse})`, opacity: Math.min(1, redTagIn) * (1 - redTagOut), fontFamily: FONT, fontWeight: 900, color: "#fff", background: "#d7261e", padding: "16px 34px", borderRadius: 14, boxShadow: "0 14px 40px rgba(215,38,30,.6)", whiteSpace: "nowrap", fontSize: 40, letterSpacing: 1 }}>
            ESTÁ ENTRE EL MEDIDOR Y LA CASA
          </div>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

export const sfxMedidorFuga = (at: number): [number, string, number?][] => [
  [at + 0.00, "whoosh"],
  [at + 0.50, "k_gota", -4],
  [at + 1.00, "pop", -2],
  [at + 1.80, "whoosh_big", -3],
  [at + 2.40, "click", -3],
  [at + 2.90, "click", -3],
  [at + 3.40, "click", -3],
  [at + 3.90, "click", -3],
  [at + 4.30, "k_gota", -5],
  [at + 5.10, "riser", -3],
  [at + 6.20, "slam", -2],
  [at + 6.90, "k_gota", -4],
  [at + 7.60, "k_gota", -4],
  [at + 8.20, "whoosh", -2],
];
