import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate } from "remotion";
import { Avatar } from "./base";
import { FONT, e, ei, spr, extrude, LowerThird } from "./lib";

const W = 1920, H = 1080;
const rnd = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

const Grade: React.FC<{ t: number }> = ({ t }) => (
  <>
    <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,.58) 100%)" }} />
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.07,
      backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.5) 0 1px, transparent 1px 3px)" }} />
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "soft-light", opacity: 0.10,
      background: `radial-gradient(circle at ${50 + Math.sin(t * 0.3) * 6}% 42%, #ffd9a8 0%, transparent 62%)` }} />
  </>
);

const Grain: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.05, mixBlendMode: "overlay" }}>
    {Array.from({ length: 60 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: rnd(i * 3 + Math.floor(t * 12)) * W, top: rnd(i * 7 + Math.floor(t * 12)) * H,
        width: 3, height: 3, background: "#fff", borderRadius: "50%" }} />
    ))}
  </AbsoluteFill>
);

const Photo: React.FC<{ src: string; t: number; a: number; b: number; zoom?: number; panX?: number; panY?: number; rot?: number }> =
  ({ src, t, a, b, zoom = 1.14, panX = 0, panY = 0, rot = 0 }) => {
    const p = ei(t, a, b);
    const sc = interpolate(p, [0, 1], [1, zoom]);
    const dx = interpolate(p, [0, 1], [0, panX]);
    const dy = interpolate(p, [0, 1], [0, panY]);
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${sc}) translate(${dx}px,${dy}px) rotate(${rot}deg)`,
          filter: "saturate(1.06) contrast(1.03) brightness(1.01)" }} />
      </AbsoluteFill>
    );
  };

const SheetDrop: React.FC<{ src: string; t: number; a: number }> = ({ src, t, a }) => {
  const p = ei(t, a, a + 0.9);
  const y = interpolate(p, [0, 1], [-500, H / 2]);
  const sc = interpolate(p, [0, 1], [0.7, 1.0]);
  const ry = interpolate(p, [0, 1], [26, 0]);
  const rx = interpolate(p, [0, 1], [-18, 0]);
  const sway = Math.sin((t - a) * 4) * (1 - p) * 8;
  return (
    <div style={{ position: "absolute", left: W / 2 + sway, top: y, width: 1500, height: 880,
      transform: `translate(-50%,-50%) perspective(1600px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${sc})`,
      boxShadow: "0 60px 130px rgba(0,0,0,.7), 0 10px 24px rgba(0,0,0,.5)", borderRadius: 6, overflow: "hidden",
      border: "10px solid #f4ecd8" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,.18), transparent 42%, rgba(0,0,0,.22))" }} />
    </div>
  );
};

const Chip: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; col?: string; size?: number; pad?: string }> =
  ({ t, at, out, x, y, text, col = "#d7261e", size = 44, pad = "12px 26px" }) => {
    if (t < at - 0.05 || t > out + 0.4) return null;
    const k = spr(t, at);
    const o = 1 - e(t, out, out + 0.35);
    return (
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${Math.min(1.08, k)})`,
        opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 2, color: "#fff",
        background: col, padding: pad, borderRadius: 10,
        boxShadow: "0 14px 34px rgba(0,0,0,.55), inset 0 -3px 0 rgba(0,0,0,.25)",
        textShadow: "0 2px 4px rgba(0,0,0,.35)", whiteSpace: "nowrap" }}>{text}</div>
    );
  };

const Ring: React.FC<{ t: number; at: number; out: number; x: number; y: number; r: number; col?: string; w?: number }> =
  ({ t, at, out, x, y, r, col = "#d7261e", w = 7 }) => {
    if (t < at) return null;
    const p = e(t, at, at + 0.55);
    const o = 1 - e(t, out, out + 0.3);
    const C = 2 * Math.PI * r;
    return (
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: o, pointerEvents: "none" }}>
        <circle cx={x} cy={y} r={r} fill="none" stroke={col} strokeWidth={w}
          strokeDasharray={C} strokeDashoffset={C * (1 - p)} strokeLinecap="round"
          transform={`rotate(-90 ${x} ${y})`} style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,.4))" }} />
      </svg>
    );
  };

const Note: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; rot?: number; size?: number; dark?: boolean }> =
  ({ t, at, out, x, y, text, rot = -4, size = 50, dark = false }) => {
    if (t < at - 0.05 || t > out + 0.4) return null;
    const k = spr(t, at);
    const o = 1 - e(t, out, out + 0.35);
    return (
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${Math.min(1.06, k)})`,
        opacity: o, fontFamily: "'Permanent Marker', cursive", fontWeight: 400, fontSize: size,
        color: dark ? "#fff" : "#1a1a1a",
        background: dark ? "rgba(11,10,8,.88)" : "#f4ecd8", padding: "16px 28px", borderRadius: 4,
        boxShadow: dark ? "0 18px 40px rgba(0,0,0,.7), inset 0 0 0 2px rgba(255,216,74,.55)" : "0 18px 40px rgba(0,0,0,.45)",
        whiteSpace: "nowrap" }}>{text}</div>
    );
  };

const SlamX3: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  if (t < at - 0.05 || t > out + 0.5) return null;
  const fall = e(t, at, at + 0.28);
  const y = interpolate(fall, [0, 1], [-260, 300]);
  const bounce = Math.max(0, Math.sin((t - at - 0.28) * 14)) * Math.max(0, 1 - (t - at - 0.28) / 0.5) * 26;
  const sc = interpolate(fall, [0, 1], [1.35, 1.0]);
  const o = 1 - e(t, out, out + 0.4);
  return (
    <div style={{ position: "absolute", left: 1500, top: y - bounce, opacity: o,
      transform: `translate(-50%,-50%) scale(${sc})`, textAlign: "center", fontFamily: FONT, fontWeight: 900, lineHeight: 0.9 }}>
      <div style={{ display: "inline-block", padding: "18px 34px 22px", borderRadius: 16,
        background: "rgba(11,10,8,.82)", boxShadow: "0 24px 60px rgba(0,0,0,.6), inset 0 0 0 3px rgba(215,38,30,.85)" }}>
        <div style={{ fontSize: 220, color: "#ffd84a", textShadow: extrude(7, "#d7261e") }}>×3</div>
        <div style={{ fontSize: 58, color: "#fff", letterSpacing: 4, marginTop: 8, textShadow: "0 3px 8px rgba(0,0,0,.6)" }}>LO NORMAL</div>
      </div>
    </div>
  );
};

const Drop3D: React.FC<{ t: number; at: number; x: number; y: number; z?: number; col?: string }> =
  ({ t, at, x, y, z = 1, col = "#1e6fd7" }) => {
    if (t < at - 0.02) return null;
    const fall = e(t, at, at + 0.34);
    const yy = interpolate(fall, [0, 1], [y - 320 * z, y]);
    const sc = interpolate(fall, [0, 1], [0.55 * z, 1.05 * z]);
    const splash = Math.max(0, Math.min(1, (t - at - 0.34) / 0.4));
    const ringR = interpolate(splash, [0, 1], [8, 90 * z]);
    const o = 1 - e(t, at + 1.0, at + 1.4);
    return (
      <>
        {splash > 0 && (
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: (1 - splash) * o, pointerEvents: "none" }}>
            <ellipse cx={x} cy={y + 6} rx={ringR} ry={ringR * 0.32} fill="none" stroke={col} strokeWidth={4} />
          </svg>
        )}
        <div style={{ position: "absolute", left: x, top: yy, width: 30 * z, height: 30 * z, borderRadius: "50% 50% 50% 0",
          background: col, transform: `translate(-50%,-50%) rotate(-45deg) scale(${sc})`, opacity: o,
          boxShadow: `0 0 22px ${col}, 0 8px 16px rgba(0,0,0,.45)` }} />
      </>
    );
  };

const Lupa: React.FC<{ t: number; at: number; out: number; src: string; x0: number; y0: number; x1: number; y1: number; r?: number }> =
  ({ t, at, out, src, x0, y0, x1, y1, r = 200 }) => {
    if (t < at) return null;
    const p = ei(t, at, out);
    const x = interpolate(p, [0, 1], [x0, x1]);
    const y = interpolate(p, [0, 1], [y0, y1]);
    const o = 1 - e(t, out, out + 0.3);
    const sc = 1.9;
    return (
      <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%",
        overflow: "hidden", opacity: o, border: "8px solid #f4ecd8",
        boxShadow: "0 24px 60px rgba(0,0,0,.6), 0 0 0 3px rgba(215,38,30,.6)" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", width: W * sc, height: H * sc, objectFit: "cover",
          left: -(x * sc - r), top: -(y * sc - r), filter: "saturate(1.1) contrast(1.05)" }} />
      </div>
    );
  };

const TravelMask: React.FC<{ src: string; t: number; a: number; b: number; x0: number; y0: number; x1: number; y1: number; r: number }> =
  ({ src, t, a, b, x0, y0, x1, y1, r }) => {
    const p = ei(t, a, b);
    const x = interpolate(p, [0, 1], [x0, x1]);
    const y = interpolate(p, [0, 1], [y0, y1]);
    const sc = 1.7;
    return (
      <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%",
        overflow: "hidden", border: "6px solid rgba(244,236,216,.9)",
        boxShadow: "0 30px 70px rgba(0,0,0,.6), 0 0 0 3px rgba(215,38,30,.55)" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", width: W * sc, height: H * sc, objectFit: "cover",
          left: -(x * sc - r), top: -(y * sc - r), filter: "saturate(1.08) contrast(1.05)" }} />
      </div>
    );
  };

const Hourglass: React.FC<{ t: number; a: number; b: number; x: number; y: number; scale?: number }> =
  ({ t, a, b, x, y, scale = 1 }) => {
    if (t < a - 0.05 || t > b + 0.9) return null;
    const p = Math.max(0, Math.min(1, (t - a) / (b - a)));
    const enter = spr(t, a, 0.85);
    const o = (1 - e(t, b + 0.3, b + 0.9)) * Math.min(1, enter);
    const done = p >= 0.999;
    const secs = Math.round(600 * (1 - p));
    const mm = Math.floor(secs / 60), ss = secs % 60;
    const txt = `${mm}:${ss.toString().padStart(2, "0")}`;
    const sc = scale * Math.min(1.05, enter) * (done ? 1 + Math.sin((t - b) * 8) * 0.03 : 1);
    const topFill = 1 - p;
    const botFill = p;
    const stream = !done && p > 0.01 && p < 0.99;
    const gW = 120, gH = 220;
    return (
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${sc})`, opacity: o }}>
        <svg width={gW * 2 + 40} height={gH * 2 + 160} viewBox={`${-(gW + 20)} ${-(gH + 60)} ${gW * 2 + 40} ${gH * 2 + 160}`}
          style={{ overflow: "visible", filter: "drop-shadow(0 20px 40px rgba(0,0,0,.6))" }}>
          <defs>
            <linearGradient id="hgGlass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(255,255,255,.22)" />
              <stop offset="1" stopColor="rgba(255,255,255,.04)" />
            </linearGradient>
            <linearGradient id="hgSand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={done ? "#4be08a" : "#ffd84a"} />
              <stop offset="1" stopColor={done ? "#2aa562" : "#e0a020"} />
            </linearGradient>
          </defs>
          <rect x={-gW - 8} y={-gH - 34} width={(gW + 8) * 2} height={26} rx={8} fill="#3a2a1a" />
          <rect x={-gW - 8} y={gH + 8} width={(gW + 8) * 2} height={26} rx={8} fill="#3a2a1a" />
          <rect x={-gW - 8} y={-gH - 34} width={(gW + 8) * 2} height={26} rx={8} fill="url(#hgSand)" opacity={0.15} />
          <path d={`M ${-gW} ${-gH} L ${gW} ${-gH} L 0 0 L ${gW} ${gH} L ${-gW} ${gH} L 0 0 Z`}
            fill="url(#hgGlass)" stroke="rgba(255,255,255,.55)" strokeWidth={4} strokeLinejoin="round" />
          <path d={`M ${-gW * topFill} ${-gH + 4} L ${gW * topFill} ${-gH + 4} L 0 ${-4} Z`} fill="url(#hgSand)" />
          <path d={`M ${-gW * botFill} ${gH - 4} L ${gW * botFill} ${gH - 4} L 0 ${4} Z`} fill="url(#hgSand)" />
          {stream && <rect x={-3} y={-4} width={6} height={8} fill="#ffd84a" opacity={0.9} />}
          <path d={`M ${-gW * 0.7} ${-gH + 20} L ${-gW * 0.4} ${-gH + 20} L 0 ${-20}`}
            stroke="rgba(255,255,255,.5)" strokeWidth={6} strokeLinecap="round" fill="none" />
        </svg>
        <div style={{ position: "absolute", left: "50%", top: gH * 2 + 60, transform: "translateX(-50%)",
          textAlign: "center", fontFamily: FONT, fontWeight: 900, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 76, color: done ? "#4be08a" : "#fff", lineHeight: 1,
            textShadow: "0 4px 14px rgba(0,0,0,.85), 0 0 20px rgba(0,0,0,.6)" }}>{done ? "LISTO" : txt}</div>
          <div style={{ fontSize: 26, letterSpacing: 6, color: "#ffe9b8", marginTop: 4,
            textShadow: "0 3px 8px rgba(0,0,0,.9)" }}>SIN JALAR</div>
        </div>
      </div>
    );
  };

const Check: React.FC<{ t: number; at: number; out: number; x: number; y: number; r: number }> =
  ({ t, at, out, x, y, r }) => {
    if (t < at) return null;
    const p = e(t, at, at + 0.45);
    const o = 1 - e(t, out, out + 0.4);
    const C = 2 * Math.PI * r;
    return (
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: o, pointerEvents: "none" }}>
        <circle cx={x} cy={y} r={r} fill="none" stroke="#4be08a" strokeWidth={12}
          strokeDasharray={C} strokeDashoffset={C * (1 - p)} strokeLinecap="round"
          transform={`rotate(-90 ${x} ${y})`} style={{ filter: "drop-shadow(0 0 14px rgba(75,224,138,.8))" }} />
        {p > 0.5 && (
          <polyline points={`${x - r * 0.42},${y + r * 0.02} ${x - r * 0.08},${y + r * 0.36} ${x + r * 0.46},${y - r * 0.34}`}
            fill="none" stroke="#4be08a" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={r} strokeDashoffset={r * (1 - (p - 0.5) * 2)}
            style={{ filter: "drop-shadow(0 0 14px rgba(75,224,138,.8))" }} />
        )}
      </svg>
    );
  };

const Slam15: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  if (t < at - 0.02) return null;
  const hit = e(t, at, at + 0.20);
  const sc = interpolate(hit, [0, 1], [1.75, 1.0]);
  const shake = Math.max(0, 1 - (t - at) / 0.4);
  const dx = Math.sin((t - at) * 90) * 16 * shake;
  const dy = Math.cos((t - at) * 80) * 12 * shake;
  const o = 1 - e(t, out, out + 0.4);
  const ul = e(t, at + 0.15, at + 0.55);
  const ringP = e(t, at, at + 0.5);
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: (1 - ringP) * o, pointerEvents: "none" }}>
        <circle cx={960} cy={900} r={interpolate(ringP, [0, 1], [60, 620])} fill="none"
          stroke="rgba(255,216,74,.7)" strokeWidth={interpolate(ringP, [0, 1], [22, 3])} />
      </svg>
      <div style={{ position: "absolute", left: 960 + dx, top: 900 + dy, opacity: o,
        transform: `translate(-50%,-50%) scale(${sc})`, textAlign: "center",
        padding: "22px 56px 26px", borderRadius: 20,
        background: "rgba(11,10,8,.88)", boxShadow: "0 30px 70px rgba(0,0,0,.7), inset 0 0 0 3px rgba(255,216,74,.55)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, letterSpacing: 4, lineHeight: 0.9,
          color: "#ffd84a", textShadow: extrude(6, "#7a1a12") }}>15 TRUCOS</div>
        <div style={{ height: 12, width: 620, margin: "14px auto 0", borderRadius: 6,
          background: "#d7261e", transform: `scaleX(${ul})`, transformOrigin: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,.6)" }} />
      </div>
    </>
  );
};

const NewsCard: React.FC<{ t: number; at: number; out: number; src: string; x: number; y: number; w: number; h: number; ry: number; label: string }> =
  ({ t, at, out, src, x, y, w, h, ry, label }) => {
    if (t < at - 0.05 || t > out + 0.5) return null;
    const p = ei(t, at, at + 0.7);
    const k = spr(t, at);
    const o = 1 - e(t, out, out + 0.4);
    const z = interpolate(p, [0, 1], [-500, 0]);
    const ryy = interpolate(p, [0, 1], [ry + 22, ry]);
    const sc = interpolate(p, [0, 1], [0.82, 1]);
    const hl = e(t, at + 0.45, at + 1.1);
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h,
        transform: `translate(-50%,-50%) perspective(1400px) translateZ(${z}px) rotateY(${ryy}deg) scale(${sc * Math.min(1.04, k)})`,
        opacity: o, borderRadius: 8, overflow: "hidden", border: "6px solid #f4ecd8",
        boxShadow: "0 40px 90px rgba(0,0,0,.7), 0 10px 24px rgba(0,0,0,.5)" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,.14), transparent 45%, rgba(0,0,0,.25))" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.30, height: h * 0.14,
          background: "rgba(255,216,74,.55)", mixBlendMode: "multiply",
          transform: `scaleX(${hl})`, transformOrigin: "left" }} />
        <div style={{ position: "absolute", left: 0, bottom: 0, right: 0, padding: "10px 16px",
          fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: "#fff",
          background: "rgba(11,10,8,.82)" }}>{label}</div>
      </div>
    );
  };

const Split: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  if (t < at - 0.05 || t > out + 0.5) return null;
  const p = ei(t, at, at + 0.6);
  const o = 1 - e(t, out, out + 0.4);
  const gap = interpolate(p, [0, 1], [0, 26]);
  const lx = interpolate(p, [0, 1], [W / 2, 500]);
  const rx = interpolate(p, [0, 1], [W / 2, 1420]);
  const price = Math.round(interpolate(e(t, at + 0.4, at + 1.6), [0, 1], [0, 18]));
  const card = (cx: number, label: string, col: string) => (
    <div style={{ position: "absolute", left: cx, top: 540, width: 640, height: 720,
      transform: "translate(-50%,-50%)", borderRadius: 10, overflow: "hidden",
      border: "8px solid #f4ecd8", boxShadow: "0 40px 90px rgba(0,0,0,.7)" }}>
      <Img src={staticFile("plo31t/img/plo31t_t0_05.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 0",
        textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 3,
        color: "#fff", background: col }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: "rgba(8,6,4,.55)" }}>
      <div style={{ position: "absolute", left: W / 2, top: 540, width: gap, height: 720,
        transform: "translate(-50%,-50%)", background: "#f4ecd8", opacity: 0.9 }} />
      {card(lx, "LA PIEZA", "#d7261e")}
      {card(rx, "UN CAFÉ", "#3a2a1a")}
      <div style={{ position: "absolute", left: W / 2, top: 130, transform: "translate(-50%,-50%)",
        fontFamily: FONT, fontWeight: 900, fontSize: 84, color: "#fff", textAlign: "center",
        textShadow: "0 6px 20px rgba(0,0,0,.7)" }}>
        <span style={{ color: "#ffd84a" }}>${price}</span> <span style={{ fontSize: 52, color: "#ffe9b8" }}>LA DIFERENCIA</span>
      </div>
    </AbsoluteFill>
  );
};

const Num25: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  if (t < at - 0.05 || t > out + 0.5) return null;
  const k = spr(t, at, 0.9);
  const o = 1 - e(t, out, out + 0.4);
  const n = Math.round(interpolate(e(t, at, at + 1.2), [0, 1], [0, 25]));
  return (
    <div style={{ position: "absolute", left: 960, top: 440, transform: `translate(-50%,-50%) scale(${Math.min(1.1, k)})`,
      opacity: o, textAlign: "center", fontFamily: FONT, fontWeight: 900, lineHeight: 0.9 }}>
      <div style={{ fontSize: 240, color: "#ffd84a", textShadow: extrude(8, "#d7261e") }}>{n}</div>
      <div style={{ fontSize: 64, color: "#fff", letterSpacing: 6, marginTop: 10, textShadow: "0 4px 12px rgba(0,0,0,.7)" }}>AÑOS</div>
    </div>
  );
};

const BowlPOV: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const p = ei(t, a, b);
  const sc = interpolate(p, [0, 1], [1.02, 1.20]);
  const tilt = interpolate(p, [0, 1], [0, -2.2]);
  const blue = e(t, a + 0.1, a + 3.6);
  const minutes = Math.round(interpolate(e(t, a + 0.2, b - 0.4), [0, 1], [10, 0]));
  const label = minutes <= 0 ? "LISTO" : `${minutes}`;
  const glow = 0.5 + Math.sin(t * 2.4) * 0.12;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#05080c" }}>
      <Img src={staticFile("plo31t/img/plo31t_t0_04.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${sc}) rotate(${tilt}deg)`, filter: "saturate(1.05) contrast(1.04) brightness(1.02)" }} />
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "color",
        background: `radial-gradient(circle ${interpolate(blue, [0, 1], [120, 900])}px at 52% 56%, rgba(30,111,215,.95) 0%, rgba(30,111,215,.5) 46%, transparent 72%)`,
        opacity: 0.55 + blue * 0.4 }} />
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen",
        background: `radial-gradient(circle ${interpolate(blue, [0, 1], [60, 420])}px at 52% 56%, rgba(120,190,255,${0.25 * glow}) 0%, transparent 70%)` }} />
      <div style={{ position: "absolute", left: 960, top: 700, transform: `translate(-50%,-50%) scale(${Math.min(1.06, spr(t, a + 0.3))})`,
        textAlign: "center", fontFamily: FONT, fontWeight: 900, opacity: 0.92 }}>
        <div style={{ fontSize: 210, lineHeight: 0.9, color: "#eaf5ff",
          textShadow: "0 0 40px rgba(80,160,255,.9), 0 8px 24px rgba(0,0,0,.6)" }}>{label}</div>
        <div style={{ fontSize: 44, letterSpacing: 8, color: "#cfe6ff", marginTop: 4,
          textShadow: "0 3px 10px rgba(0,0,0,.7)" }}>{minutes <= 0 ? "AZUL" : "MINUTOS"}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Escena_0_39: React.FC<{ t: number }> = ({ t }) => {
  const av1 = t >= 0 && t < 4.64;
  const av2 = t >= 18.36 && t < 21.95;
  const av3 = t >= 33.28 && t < 38.54;

  const p1 = t >= 4.64 && t < 8.94;
  const p2 = t >= 8.94 && t < 13.08;
  const p3 = t >= 13.08 && t < 18.36;
  const p4 = t >= 21.95 && t < 27.36;
  const p5 = t >= 27.36 && t < 33.28;

  return (
    <AbsoluteFill style={{ background: "#0b0a08" }}>
      {av1 && <Avatar t={t} />}
      {av2 && <Avatar t={t} />}
      {av3 && <Avatar t={t} />}

      {p1 && (
        <AbsoluteFill>
          {t < 6.46 ? (
            <>
              <Photo src="plo31t/img/plo31t_t0_01.jpg" t={t} a={4.64} b={6.46} zoom={1.18} panX={-30} />
              <SheetDrop src="plo31t/img/plo31t_t0_01.jpg" t={t} a={4.64} />
              <Chip t={t} at={4.80} out={6.40} x={330} y={1000} text="EL RECIBO DEL AGUA" size={34} pad="10px 20px" />
            </>
          ) : (
            <>
              <Photo src="plo31t/img/plo31t_t0_01.jpg" t={t} a={6.46} b={8.94} zoom={1.26} panX={-46} panY={-26} />
              <Ring t={t} at={6.50} out={8.60} x={980} y={470} r={190} col="#d7261e" w={12} />
              <SlamX3 t={t} at={4.80} out={8.60} />
              <Note t={t} at={7.74} out={8.60} x={420} y={880} text="¡EL TRIPLE!" rot={-5} />
              <NewsCard t={t} at={7.10} out={8.60} src="plo31t/real/noticia2.jpg" x={330} y={330} w={420} h={470} ry={-16} label="RECIBO CARO · POR ESTO!" />
            </>
          )}
          <Grade t={t} />
        </AbsoluteFill>
      )}

      {p2 && (
        <AbsoluteFill>
          <Photo src="plo31t/img/plo31t_t0_02.jpg" t={t} a={8.94} b={13.08} zoom={1.22} panX={28} panY={14} />
          <Grade t={t} />
          {t < 11.34 && (
            <>
              <TravelMask src="plo31t/img/plo31t_t0_02.jpg" t={t} a={9.62} b={10.54} x0={700} y0={760} x1={1000} y1={420} r={190} />
              <Ring t={t} at={10.54} out={11.20} x={1000} y={420} r={200} />
              <Chip t={t} at={10.54} out={11.20} x={960} y={980} text="AL LADO DEL INODORO" size={40} />
            </>
          )}
          {t >= 11.34 && (
            <>
              <Lupa t={t} at={11.34} out={12.90} src="plo31t/img/plo31t_t0_02.jpg" x0={700} y0={300} x1={900} y1={300} r={190} />
              <Ring t={t} at={11.84} out={12.90} x={900} y={300} r={170} col="#ffd84a" />
              <Note t={t} at={11.86} out={12.90} x={1440} y={330} text="LA TAPA" rot={-6} />
            </>
          )}
        </AbsoluteFill>
      )}

      {p3 && (
        <AbsoluteFill>
          <Photo src="plo31t/img/plo31t_t0_03.jpg" t={t} a={13.08} b={18.36} zoom={1.24} panY={30} />
          <Grade t={t} />
          <Drop3D t={t} at={13.24} x={820} y={640} z={0.85} />
          <Drop3D t={t} at={13.62} x={940} y={700} z={1.05} />
          <Drop3D t={t} at={14.62} x={1060} y={760} z={1.25} />
          <Chip t={t} at={14.62} out={17.90} x={960} y={1000} text="3 GOTAS DE COLORANTE" col="#1e6fd7" size={38} pad="10px 22px" />
          <Note t={t} at={17.28} out={17.90} x={470} y={300} text="SIN JALAR" rot={-5} />
        </AbsoluteFill>
      )}

      {p4 && (
        <AbsoluteFill>
          {t < 24.60 ? (
            <>
              <BowlPOV t={t} a={21.95} b={24.60} />
              <Grade t={t} />
              <Ring t={t} at={22.26} out={23.20} x={960} y={640} r={250} col="#1e6fd7" w={9} />
              <Chip t={t} at={22.72} out={24.00} x={960} y={960} text="MESES TIRANDO AGUA" size={42} col="#0b1424" />
            </>
          ) : (
            <>
              <BowlPOV t={t} a={24.60} b={27.36} />
              <Grade t={t} />
              <Note t={t} at={25.14} out={26.90} x={1480} y={760} text="SIN RUIDO" rot={-3} size={64} dark />
              <NewsCard t={t} at={25.28} out={27.20} src="plo31t/real/noticia1.jpg" x={340} y={340} w={430} h={500} ry={14} label="FUGA SILENCIOSA · EL IMPARCIAL" />
            </>
          )}
        </AbsoluteFill>
      )}

      {p5 && (
        <AbsoluteFill>
          <Photo src="plo31t/img/plo31t_t0_05.jpg" t={t} a={27.36} b={33.28} zoom={1.22} panX={-40} />
          <Grade t={t} />
          <Ring t={t} at={27.42} out={28.50} x={720} y={560} r={210} col="#d7261e" w={14} />
          <Chip t={t} at={28.54} out={29.20} x={720} y={870} text="LA PIEZA" size={42} />
          <Split t={t} at={28.54} out={30.40} />
          <Num25 t={t} at={30.90} out={32.90} />
          <Chip t={t} at={32.16} out={32.90} x={480} y={220} text="PLOMERO" col="#d7261e" size={40} />
        </AbsoluteFill>
      )}

      <Hourglass t={t} a={15.56} b={21.38} x={t >= 18.36 ? 1690 : 1560} y={t >= 18.36 ? 250 : 300} scale={t >= 18.36 ? 0.72 : 0.9} />

      {t >= 21.95 && t < 22.60 && <Check t={t} at={21.95} out={22.40} x={960} y={640} r={280} />}

      {av1 && <LowerThird t={t} at={1.22} out={4.30} name="CLAUDIO" l2="PLOMERO · 25 AÑOS" l2at={1.5} />}
      {av2 && <Chip t={t} at={19.00} out={21.30} x={300} y={940} text="LA PRUEBA DEL COLORANTE" size={40} />}
      {av3 && <Slam15 t={t} at={36.20} out={38.10} />}

      <Grade t={t} />
      <Grain t={t} />
    </AbsoluteFill>
  );
};

export const SFX_Escena_0_39: [number, string, number?][] = [
  [1.22, "pop", -3],
  [1.22, "tick", -6],
  [4.64, "whoosh"],
  [4.80, "slam", -2],
  [6.46, "swish", -3],
  [6.50, "write", -3],
  [7.10, "paper", -4],
  [7.74, "paper", -5],
  [8.94, "whoosh"],
  [9.62, "write", -3],
  [10.54, "write", -3],
  [11.34, "whoosh", -3],
  [11.84, "write", -3],
  [11.86, "paper", -4],
  [13.08, "whoosh", -4],
  [13.24, "k_gota", -6],
  [13.62, "k_burbuja", -5],
  [14.62, "k_frasco", -5],
  [15.56, "click", -5],
  [16.14, "tick", -6],
  [17.28, "paper", -4],
  [18.36, "whoosh", -3],
  [19.00, "pop", -3],
  [20.45, "riser", -4],
  [21.38, "ding", -3],
  [21.95, "boom", -1],
  [22.26, "write", -3],
  [22.72, "pop", -2],
  [25.28, "paper", -4],
  [27.36, "whoosh"],
  [27.42, "write", -3],
  [28.54, "swish", -3],
  [28.54, "pop", -2],
  [29.62, "coin", -2],
  [30.90, "ding", -3],
  [32.16, "pop", -3],
  [33.28, "whoosh", -3],
  [36.20, "slam", -2],
];
