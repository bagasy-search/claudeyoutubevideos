// Harlan the Lineman — kit del video hlpower (cuánto dura de verdad un corte). Misma marca que HlKit. Tres piezas
// con profundidad (fondo + plano medio + lluvia/nieve al frente). Textos SIEMPRE por props.
//   HlPowerTree   — la red como un árbol: tronco (transmisión) → ramas (subestaciones, alimentadores, calles) →
//                   hojas (casas); se va encendiendo del tronco hacia afuera y tu casa es la última hoja
//   HlDamageScale — "mirá por la ventana": tarjetas de daño (nada roto, rama, cable, poste, varios postes) y una
//                   barra de tiempo que crece de horas a días
//   HlServiceDrop — la casa de costado: el cable del poste llega al caño (mástil) y al medidor; el lado del poste es
//                   de la compañía, el mástil y el medidor son TUYOS (electricista)
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadStencil } from "@remotion/google-fonts/AllertaStencil";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";

const OS = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
const ST = loadStencil("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const HD = loadHand("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const C = { yellow: "#F6C400", orange: "#F26B1D", ice: "#CFE8F5", pole: "#3B2A1E", ink: "#121417", night: "#0D1B2A", bone: "#F4F1EA", red: "#D62828", green: "#3FA34D" };
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const Rain: React.FC<{ n?: number; seed?: number; o?: number }> = ({ n = 60, seed = 1, o = 0.5 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => { const r = (k: number) => rnd(seed * 31 + i * 7 + k); const y = ((r(2) * 1100 + f * (14 + r(3) * 10)) % 1180) - 60; const x = (r(4) * 2000 - f * 3) % 1960; return <div key={i} style={{ position: "absolute", left: x, top: y, width: 2, height: 30 + r(1) * 30, background: "rgba(207,232,245,0.6)", transform: "rotate(12deg)", opacity: o * (0.4 + 0.6 * r(5)) }} />; })}
    </AbsoluteFill>
  );
};
const Bed: React.FC<{ src?: string; dim?: number }> = ({ src, dim = 0.62 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      {src ? <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + f * 0.0004})`, filter: "blur(5px)" }} /> : null}
      <AbsoluteFill style={{ background: `rgba(13,27,42,${dim})` }} />
    </AbsoluteFill>
  );
};
const Title: React.FC<{ t: string }> = ({ t }) => <div style={{ position: "absolute", top: 46, width: "100%", textAlign: "center", fontFamily: ST, fontSize: 60, color: C.bone, textTransform: "uppercase", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{t}</div>;

// ── el árbol de la red ─────────────────────────────────────────────────────────────────────────────────────────
export const HlPowerTree: React.FC<{ title?: string; labels?: string[]; you?: string; every?: number; bed?: string }> = ({ title = "power comes back from the trunk out", labels = ["transmission lines", "substations", "main lines", "side streets", "your house"], you = "last", every = 30, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const lvl = (i: number) => spring({ frame: f - 14 - i * every, fps, config: { damping: 16 } });
  const X0 = 960, Y0 = 1010;
  type Br = { x1: number; y1: number; x2: number; y2: number; l: number };
  const br: Br[] = []; const leaves: { x: number; y: number }[] = [];
  const grow = (x: number, y: number, ang: number, len: number, l: number) => {
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len; br.push({ x1: x, y1: y, x2, y2, l });
    if (l >= 3) { leaves.push({ x: x2, y: y2 }); return; }
    const spread = l === 0 ? 0.62 : 0.5;
    grow(x2, y2, ang - spread, len * 0.66, l + 1); grow(x2, y2, ang + spread, len * 0.66, l + 1); if (l === 0) grow(x2, y2, ang, len * 0.7, l + 1);
  };
  grow(X0 + 120, Y0, -Math.PI / 2, 360, 0);
  const youLeaf = leaves[leaves.length - 1];
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.75} />
      <Title t={title} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {br.map((b, i) => { const k = lvl(b.l); return <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke={k > 0.5 ? C.yellow : "rgba(255,255,255,0.25)"} strokeWidth={[26, 16, 9, 5][b.l]} strokeLinecap="round" style={{ filter: k > 0.5 ? `drop-shadow(0 0 ${10 * k}px rgba(246,196,0,0.8))` : undefined }} />; })}
        {leaves.map((p, i) => { const isYou = p === youLeaf; const k = isYou ? lvl(4) : lvl(3); return <rect key={i} x={p.x - 13} y={p.y - 13} width={26} height={22} rx={3} fill={k > 0.5 ? (isYou ? C.orange : C.yellow) : "#2a3542"} stroke={isYou ? C.bone : "none"} strokeWidth={isYou ? 4 : 0} />; })}
      </svg>
      {labels.map((l, i) => { const k = lvl(i); return <div key={i} style={{ position: "absolute", left: 80, top: 860 - i * 150, fontFamily: OS, fontWeight: 700, fontSize: 40, textTransform: "uppercase", color: k > 0.5 ? (i === labels.length - 1 ? C.orange : C.yellow) : "rgba(255,255,255,0.4)", opacity: 0.4 + 0.6 * k }}>{i + 1} · {l}</div>; })}
      <div style={{ position: "absolute", left: youLeaf.x + 30, top: youLeaf.y - 30, fontFamily: HD, fontSize: 56, color: C.orange, opacity: lvl(4) }}>{you} ←</div>
      <Rain n={40} seed={7} o={0.35} />
    </AbsoluteFill>
  );
};

// ── qué ves por la ventana ─────────────────────────────────────────────────────────────────────────────────────
export const HlDamageScale: React.FC<{ title?: string; items: { label: string; time: string; w: number }[]; every?: number; bed?: string }> = ({ title = "look out your window", items, every = 34, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.72} />
      <Title t={title} />
      {items.map((it, i) => {
        const at = 14 + i * every; const k = spring({ frame: f - at, fps, config: { damping: 14 } });
        const fill = interpolate(f, [at + 6, at + 30], [0, it.w], cl);
        const y = 190 + i * 160; const col = it.w < 0.25 ? C.green : it.w < 0.55 ? C.yellow : it.w < 0.8 ? C.orange : C.red;
        return (
          <div key={i} style={{ position: "absolute", left: 120, top: y, width: 1680, height: 120, opacity: k, transform: `translateX(${(1 - k) * -80}px)` }}>
            <div style={{ position: "absolute", left: 0, top: 10, width: 620, height: 100, borderRadius: 12, background: "rgba(244,241,234,0.95)", display: "flex", alignItems: "center", paddingLeft: 28, fontFamily: OS, fontWeight: 700, fontSize: 40, color: C.ink, textTransform: "uppercase" }}>{it.label}</div>
            <div style={{ position: "absolute", left: 660, top: 34, width: 760, height: 52, borderRadius: 26, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}><div style={{ width: `${fill * 100}%`, height: "100%", background: col, borderRadius: 26 }} /></div>
            <div style={{ position: "absolute", left: 1450, top: 26, fontFamily: HD, fontSize: 58, color: col, whiteSpace: "nowrap" }}>{it.time}</div>
          </div>
        );
      })}
      <Rain n={50} seed={9} o={0.4} />
    </AbsoluteFill>
  );
};

// ── el cable a tu casa ─────────────────────────────────────────────────────────────────────────────────────────
export const HlServiceDrop: React.FC<{ title?: string; theirs?: string; yours?: string; parts?: string[]; note?: string; bed?: string }> = ({ title = "the wire to your house", theirs = "power company", yours = "YOURS · call an electrician", parts = ["weatherhead", "mast", "meter box"], note = "damaged? call an electrician first", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const bend = interpolate(f, [70, 100], [0, 1], cl);
  const show = (i: number) => spring({ frame: f - 30 - i * 14, fps, config: { damping: 14 } });
  const sag = 60 + Math.sin(f / 12) * 4;
  const mx = 1300, my = 300;
  const tipX = mx + bend * 70, tipY = my + bend * 40;
  return (
    <AbsoluteFill>
      <Bed src={bed} dim={0.72} />
      <Title t={title} />
      {/* poste */}
      <div style={{ position: "absolute", left: 300, top: 170, width: 34, height: 860, background: "linear-gradient(90deg, #2b1f15, #5a4330, #2b1f15)" }} />
      <div style={{ position: "absolute", left: 220, top: 210, width: 200, height: 18, background: "#2b1f15" }} />
      <div style={{ position: "absolute", left: 340, top: 250, width: 70, height: 100, borderRadius: 12, background: "#8c9599" }} />
      {/* casa */}
      <div style={{ position: "absolute", left: 1150, top: 470, width: 600, height: 560, background: "#d8d2c4", boxShadow: "0 30px 50px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 1110, top: 330, width: 0, height: 0, borderLeft: "340px solid transparent", borderRight: "340px solid transparent", borderBottom: "150px solid #6b3a2a" }} />
      {/* mástil (se dobla) */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={`M${mx} 640 L ${mx} 420 Q ${mx} ${my + 40} ${tipX} ${tipY}`} stroke="#9aa3a8" strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d={`M380 300 Q ${(380 + tipX) / 2} ${300 + sag + bend * 120} ${tipX} ${tipY}`} stroke="#1a1a1a" strokeWidth={9} fill="none" />
        <rect x={mx - 50} y={640} width={100} height={150} rx={14} fill="#a9b2b6" stroke="#5c666b" strokeWidth={6} transform={`rotate(${bend * 14} ${mx} 640)`} />
        <circle cx={mx} cy={705} r={30} fill="#e9eef0" stroke="#5c666b" strokeWidth={4} transform={`rotate(${bend * 14} ${mx} 640)`} />
      </svg>
      {/* etiquetas */}
      <div style={{ position: "absolute", left: 470, top: 420, padding: "12px 22px", background: "rgba(244,241,234,0.95)", borderRadius: 10, fontFamily: OS, fontWeight: 700, fontSize: 36, color: C.ink, textTransform: "uppercase", opacity: show(0) }}>{theirs}</div>
      <div style={{ position: "absolute", left: 1000, top: 830, padding: "12px 22px", background: C.orange, borderRadius: 10, fontFamily: OS, fontWeight: 700, fontSize: 36, color: C.ink, textTransform: "uppercase", opacity: show(1) }}>{yours}</div>
      {parts.map((p, i) => <div key={p} style={{ position: "absolute", left: 1440, top: [250, 480, 680][i], padding: "4px 18px", borderRadius: 10, background: "rgba(13,27,42,0.85)", fontFamily: HD, fontSize: 48, color: C.bone, opacity: show(2 + i) }}>← {p}</div>)}
      <div style={{ position: "absolute", bottom: 40, width: "100%", textAlign: "center", fontFamily: HD, fontSize: 56, color: C.yellow, opacity: interpolate(f, [100, 115], [0, 1], cl) }}>{note}</div>
      <Rain n={60} seed={11} o={0.45} />
    </AbsoluteFill>
  );
};
