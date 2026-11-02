import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate } from "remotion";
import { Avatar } from "./base";
import { FONT, e, ei, spr, extrude } from "./lib";

const W = 1920, H = 1080;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const lin = (t: number, a: number, b: number, v0: number, v1: number) =>
  interpolate(t, [a, b], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

type PanelDef = {
  src: string; a: number; b: number;
  z0: number; z1: number; x0: number; x1: number; y0: number; y1: number;
  ry0: number; ry1: number; rx0: number; rx1: number; rot0?: number; rot1?: number;
};
const Panels: PanelDef[] = [
  { src: "plo31t/img/plo31t_t0_01.jpg", a: 4.64, b: 9.10, z0: 1.10, z1: 1.22, x0: 0, x1: -40, y0: 0, y1: 20, ry0: 6, ry1: 0, rx0: -3, rx1: 0 },
  { src: "plo31t/img/plo31t_t0_02.jpg", a: 8.94, b: 13.30, z0: 1.12, z1: 1.05, x0: 60, x1: 20, y0: -20, y1: 10, ry0: -5, ry1: 0, rx0: 2, rx1: -1 },
  { src: "plo31t/img/plo31t_t0_03.jpg", a: 13.08, b: 18.60, z0: 1.06, z1: 1.18, x0: -20, x1: 30, y0: 30, y1: -10, ry0: 4, ry1: -2, rx0: 0, rx1: 2 },
  { src: "plo31t/img/plo31t_t0_04.jpg", a: 21.95, b: 27.60, z0: 1.06, z1: 1.16, x0: -40, x1: 20, y0: 30, y1: -10, ry0: -3, ry1: 2, rx0: 1, rx1: -1 },
  { src: "plo31t/img/plo31t_t0_05.jpg", a: 27.36, b: 33.60, z0: 1.06, z1: 1.18, x0: 50, x1: 10, y0: -20, y1: 10, ry0: 3, ry1: -2, rx0: -1, rx1: 1 },
];

const Panel: React.FC<{ t: number; p: PanelDef; children?: React.ReactNode }> = ({ t, p, children }) => {
  const k = lin(t, p.a, p.b, p.z0, p.z1);
  const x = lin(t, p.a, p.b, p.x0, p.x1);
  const y = lin(t, p.a, p.b, p.y0, p.y1);
  const ry = lin(t, p.a, p.b, p.ry0, p.ry1);
  const rx = lin(t, p.a, p.b, p.rx0, p.rx1);
  const rot = lin(t, p.a, p.b, p.rot0 ?? 0, p.rot1 ?? 0);
  const ek = ei(t, p.a, p.a + 0.7);
  const ez = 320 * (1 - ek);
  const xk = 260 * ei(t, p.b - 0.5, p.b);
  return (
    <AbsoluteFill style={{ overflow: "hidden", perspective: 1700 }}>
      <AbsoluteFill style={{ transformStyle: "preserve-3d",
        transform: `translateZ(${ez + xk}px) translate(${x}px,${y}px) scale(${k}) rotate(${rot}deg) rotateY(${ry}deg) rotateX(${rx}deg)` }}>
        <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};

// AVATAR: corte limpio, sin blur de plantilla. Entra con un push seco, sale con un push seco.
const AvatarPanel: React.FC<{ t: number; a: number; b: number; enter?: boolean; exit?: boolean }> = ({ t, a, b, enter = true, exit = true }) => {
  const kin = enter ? ei(t, a, a + 0.35) : 1;
  const kout = exit ? 1 - ei(t, b - 0.35, b) : 1;
  const k = Math.min(kin, kout);
  const sc = 1.0 + 0.035 * ei(t, a, b) + 0.06 * (1 - kin);
  return (
    <AbsoluteFill style={{ perspective: 1700, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, opacity: k }}>
        <Avatar t={t} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.44) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,10,0,0.10), rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(20,10,0,0.20))" }} />
    <AbsoluteFill style={{ opacity: 0.06, backgroundImage: "url(data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='0.6'/></svg>)" }} />
  </AbsoluteFill>
);

const CircleMark: React.FC<{ t: number; at: number; x: number; y: number; rx: number; ry: number; rot?: number; col?: string }> = ({ t, at, x, y, rx, ry, rot = -8, col = "#d7261e" }) => {
  const k = ei(t, at, at + 0.7);
  const len = 2 * Math.PI * ((rx + ry) / 2);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${rot} ${x} ${y})`}
        fill="none" stroke={col} strokeWidth={7} strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - k)} opacity={0.92} />
    </svg>
  );
};

const Note: React.FC<{ t: number; at: number; out?: number; x: number; y: number; rot?: number; text: string; size?: number }> = ({ t, at, out = 999, x, y, rot = -3, text, size = 46 }) => {
  const k = spr(t, at, 0.9);
  const o = 1 - ei(t, out, out + 0.35);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.6 + 0.4 * k})`, opacity: o * Math.min(1, k * 1.4),
      background: "#f4ecd8", padding: "18px 30px", borderRadius: 4, boxShadow: "0 18px 40px rgba(0,0,0,.45), 0 2px 0 rgba(0,0,0,.15)",
      fontFamily: "'Permanent Marker', 'Caveat', cursive", color: "#2a1c10", fontSize: size, lineHeight: 1.05, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

const BigRot: React.FC<{ t: number; at: number; out?: number; x: number; y: number; text: string; col?: string; size?: number; rot?: number }> = ({ t, at, out = 999, x, y, text, col = "#fff", size = 92, rot = -2 }) => {
  const k = spr(t, at, 0.95);
  const o = 1 - ei(t, out, out + 0.35);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.55 + 0.45 * k})`, opacity: o * Math.min(1, k * 1.4),
      fontFamily: FONT, fontWeight: 900, color: col, fontSize: size, letterSpacing: 1, lineHeight: 1,
      textShadow: extrude(7, "rgba(0,0,0,.65)"), whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

const PaperRot: React.FC<{ t: number; at: number; out?: number; x: number; y: number; text: string; col?: string; size?: number }> = ({ t, at, out = 999, x, y, text, col = "#ffd84a", size = 88 }) => {
  const k = spr(t, at, 0.9);
  const o = 1 - ei(t, out, out + 0.35);
  const ry = lin(t, at, at + 0.55, -70, 0);
  const z = lin(t, at, at + 0.55, -260, 0);
  return (
    <div style={{ position: "absolute", left: x, top: y, perspective: 1200, transform: `translate(-50%,-50%)`, opacity: o }}>
      <div style={{ transform: `rotateY(${ry}deg) translateZ(${z}px) scale(${0.6 + 0.4 * k})`, transformOrigin: "left center",
        fontFamily: FONT, fontWeight: 900, color: col, fontSize: size, letterSpacing: 1, lineHeight: 1,
        textShadow: extrude(7, "rgba(0,0,0,.65)"), whiteSpace: "nowrap" }}>
        {text}
      </div>
    </div>
  );
};

const Iris: React.FC<{ t: number; a: number; b: number; x: number; y: number; r0: number; r1: number; col?: string }> = ({ t, a, b, x, y, r0, r1, col = "rgba(143,214,255,0.55)" }) => {
  const k = ei(t, a, b);
  const r = r0 + (r1 - r0) * k;
  const o = Math.sin(Math.PI * clamp01((t - a) / (b - a)));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, transform: "translate(-50%,-50%)", borderRadius: "50%",
      background: `radial-gradient(circle, ${col} 0%, rgba(143,214,255,0) 70%)`, opacity: o * 0.9, filter: "blur(6px)", pointerEvents: "none" }} />
  );
};

// Gota que cae UNA vez (se usa una sola vez por gota, no se repite)
const Drop: React.FC<{ t: number; at: number; x: number; y: number; n: number }> = ({ t, at, x, y, n }) => {
  const k = ei(t, at, at + 0.35);
  const fall = lin(t, at, at + 0.5, -70, 0);
  return (
    <div style={{ position: "absolute", left: x, top: y + fall, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, opacity: k,
      width: 56, height: 56, borderRadius: "50% 50% 50% 0", background: "#2f7bff",
      boxShadow: "0 8px 24px rgba(47,123,255,.55)", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FONT, fontWeight: 900, color: "#fff", fontSize: 26, rotate: "45deg" }}>
      <span style={{ rotate: "-45deg" }}>{n}</span>
    </div>
  );
};

// Tinte azul que crece desde el centro del agua (en t0_03 y t0_04)
const TintBloom: React.FC<{ t: number; a: number; b: number; x: number; y: number; rMax: number }> = ({ t, a, b, x, y, rMax }) => {
  const k = ei(t, a, b);
  const r = rMax * k;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, transform: "translate(-50%,-50%)", borderRadius: "50%",
      background: `radial-gradient(circle, rgba(70,170,255,${0.55 * k}) 0%, rgba(70,170,255,${0.30 * k}) 55%, rgba(70,170,255,0) 78%)`,
      filter: "blur(22px)", mixBlendMode: "screen", pointerEvents: "none" }} />
  );
};

// Flecha roja que se dibuja (para marcar la fuga)
const ArrowMark: React.FC<{ t: number; at: number; x0: number; y0: number; x1: number; y1: number; col?: string; label?: string }> = ({ t, at, x0, y0, x1, y1, col = "#d7261e", label }) => {
  const k = ei(t, at, at + 0.8);
  const ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * k} y2={y0 + (y1 - y0) * k} stroke={col} strokeWidth={7} strokeLinecap="round" opacity={0.95} />
      {k > 0.85 && (
        <g transform={`translate(${x1} ${y1}) rotate(${ang})`} opacity={(k - 0.85) / 0.15}>
          <path d="M0 0 L-34 -18 M0 0 L-34 18" stroke={col} strokeWidth={7} strokeLinecap="round" fill="none" />
        </g>
      )}
      <circle cx={x0} cy={y0} r={9 * k} fill={col} opacity={0.9} />
      {label && <text x={x0 + 26} y={y0 - 26} fill={col} fontFamily={FONT} fontWeight={900} fontSize={64} opacity={k}>{label}</text>}
    </svg>
  );
};

// Contador de minutos: grande, en el margen INFERIOR DERECHO, no tapa el frasco
const TimeLapse: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const prog = clamp01((t - a) / (b - a));
  const mins = Math.max(0, Math.round(10 * (1 - prog)));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 120, bottom: 210, transform: `scale(${Math.min(1.06, spr(t, a))})`,
        textAlign: "right", fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow: extrude(8, "rgba(0,0,0,.7)") }}>
        <div style={{ fontSize: 200, lineHeight: 1 }}>{mins}</div>
        <div style={{ fontSize: 46, color: "#8fd6ff", letterSpacing: 6 }}>MINUTOS</div>
      </div>
      <div style={{ position: "absolute", left: 960, bottom: 150, width: 900, height: 14, transform: "translateX(-50%)",
        background: "rgba(255,255,255,.18)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ width: `${prog * 100}%`, height: "100%", background: "linear-gradient(90deg,#8fd6ff,#2f7bff)" }} />
      </div>
    </AbsoluteFill>
  );
};

// Chip anclado abajo-izquierda, no tapa el frasco
const Chip: React.FC<{ t: number; at: number; out?: number; x: number; y: number; text: string; col?: string }> = ({ t, at, out = 999, x, y, text, col = "#8fd6ff" }) => {
  const k = spr(t, at, 0.9);
  const o = 1 - ei(t, out, out + 0.35);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, opacity: o * Math.min(1, k * 1.4),
      background: "rgba(11,20,36,0.72)", border: `2px solid ${col}`, borderRadius: 999, padding: "14px 34px",
      fontFamily: FONT, fontWeight: 900, color: col, fontSize: 54, letterSpacing: 2, whiteSpace: "nowrap",
      boxShadow: `0 12px 40px rgba(0,0,0,.5), 0 0 24px ${col}55` }}>
      {text}
    </div>
  );
};

// LITROS que se llenan en sincronía con la mancha azul (un solo valor que sube, sin saltos).
// El número arranca en 0 cuando aparece la mancha y llega a 1240 cuando la mancha cubre el agua.
const LitrosFill: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const k = ei(t, a, a + 0.5);
  const o = 1 - ei(t, b - 0.4, b);
  const prog = clamp01((t - a) / (b - a));
  const litros = Math.round(prog * 1240);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <div style={{ position: "absolute", right: 130, top: 200, transform: `scale(${Math.min(1.04, spr(t, a))})`,
        textAlign: "right", fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow: extrude(8, "rgba(0,0,0,.7)") }}>
        <div style={{ fontSize: 190, lineHeight: 1, color: "#8fd6ff" }}>{litros.toLocaleString("es")}</div>
        <div style={{ fontSize: 46, color: "#fff", letterSpacing: 6 }}>LITROS AL MES</div>
      </div>
      <div style={{ position: "absolute", left: 960, bottom: 150, width: 900, height: 14, transform: "translateX(-50%)",
        background: "rgba(255,255,255,.18)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ width: `${prog * 100}%`, height: "100%", background: "linear-gradient(90deg,#8fd6ff,#2f7bff)" }} />
      </div>
    </AbsoluteFill>
  );
};

// Comparación clara: pieza chica vs taza llena. Etiquetas grandes, legibles a 1 m de TV.
const PieceVsCoffee: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const k = ei(t, a, a + 0.7);
  const grow = ei(t, a + 0.4, b - 0.4);
  const hP = 90 + 60 * grow, hC = 260 + 420 * grow;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: k }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W / 2, height: H, background: "rgba(0,0,0,.28)" }} />
      <div style={{ position: "absolute", left: W / 2, top: 0, width: W / 2, height: H, background: "rgba(120,20,10,.30)" }} />
      <div style={{ position: "absolute", left: 480, bottom: 300, width: 130, height: hP, transform: "translateX(-50%)",
        background: "linear-gradient(180deg,#8fd6ff,#2f7bff)", borderRadius: "8px 8px 0 0" }} />
      <div style={{ position: "absolute", left: 480, bottom: 190, transform: "translateX(-50%)", textAlign: "center",
        fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow: extrude(7, "rgba(0,0,0,.75)"), fontSize: 84 }}>PIEZA</div>
      <div style={{ position: "absolute", left: 1440, bottom: 300, width: 130, height: hC, transform: "translateX(-50%)",
        background: "linear-gradient(180deg,#ff8a5a,#d7261e)", borderRadius: "8px 8px 0 0" }} />
      <div style={{ position: "absolute", left: 1440, bottom: 190, transform: "translateX(-50%)", textAlign: "center",
        fontFamily: FONT, fontWeight: 900, color: "#ffd84a", textShadow: extrude(7, "rgba(0,0,0,.75)"), fontSize: 84 }}>CAFÉ</div>
    </AbsoluteFill>
  );
};

const BlueToCoffee: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const k = ei(t, a, b);
  const o = Math.sin(Math.PI * clamp01((t - a) / (b - a)));
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o * 0.9,
      background: `radial-gradient(circle at 50% 55%, rgba(60,150,255,${0.35 * (1 - k)}) 0%, rgba(90,50,20,${0.35 * k}) 70%)`,
      mixBlendMode: "screen" }} />
  );
};

const Whip: React.FC<{ t: number; a: number; b: number; dx?: number }> = ({ t, a, b, dx = 1 }) => {
  const k = Math.sin(Math.PI * clamp01((t - a) / (b - a)));
  if (k <= 0.001) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: k * 0.85 }}>
      <AbsoluteFill style={{ background: `linear-gradient(${dx > 0 ? 90 : 270}deg, rgba(255,240,210,0) 0%, rgba(255,240,210,0.35) 45%, rgba(255,240,210,0) 100%)`,
        filter: "blur(18px)", transform: `translateX(${dx * 220 * (1 - k)}px)` }} />
    </AbsoluteFill>
  );
};

export const Escena_0_39_continuo: React.FC<{ t: number }> = ({ t }) => {
  const av1 = t >= 0 && t < 4.64;
  const av2 = t >= 18.36 && t < 21.95;
  const av3 = t >= 33.28 && t < 38.54;

  const drops = [13.24, 13.62, 13.98];

  return (
    <AbsoluteFill style={{ background: "#0b0a08", overflow: "hidden" }}>
      {Panels.map((p, i) => {
        if (t < p.a - 0.7 || t > p.b + 0.5) return null;
        return (
          <Panel key={i} t={t} p={p}>
            {i === 0 && (
              <>
                <PaperRot t={t} at={5.20} out={8.94 - 0.3} x={1420} y={300} text="EL TRIPLE ×3" col="#ffd84a" size={88} />
                <CircleMark t={t} at={5.36} x={980} y={560} rx={150} ry={70} rot={-6} />
                <Note t={t} at={6.46} out={8.94 - 0.3} x={360} y={880} rot={-4} text="¿error de la compañía?" size={40} />
              </>
            )}
            {i === 1 && (
              <>
                <BigRot t={t} at={9.62} out={13.08 - 0.3} x={1180} y={420} text="ME AGACHÉ" col="#8fd6ff" size={86} />
                <BigRot t={t} at={11.34} out={13.08 - 0.3} x={760} y={300} text="LA TAPA" col="#ffd84a" size={86} />
              </>
            )}
            {i === 2 && (
              <>
                {/* gotas: cada una cae UNA vez, en su palabra */}
                {drops.map((d, j) => (
                  <Drop key={j} t={t} at={d} x={1180 + j * 70} y={380} n={j + 1} />
                ))}
                {/* tinte azul que crece desde el agua a medida que caen las gotas */}
                <TintBloom t={t} a={13.24} b={16.14} x={960} y={620} rMax={520} />
                <Chip t={t} at={13.30} out={18.36 - 0.3} x={420} y={880} text="TRES GOTAS" />
                <TimeLapse t={t} a={16.14} b={18.20} />
              </>
            )}
            {i === 3 && (
              <>
                {/* mancha azul que se difunde y llena el número */}
                <TintBloom t={t} a={22.10} b={25.60} x={960} y={560} rMax={640} />
                <ArrowMark t={t} at={23.10} x0={1030} y0={560} x1={1330} y1={470} label="FUGA" />
                <BigRot t={t} at={22.26} out={24.20} x={960} y={180} text="MESES TIRANDO AGUA" col="#ff4a3d" size={96} />
                <BigRot t={t} at={25.14} out={27.36 - 0.3} x={960} y={920} text="SIN RUIDO" col="#8fd6ff" size={92} />
                <LitrosFill t={t} a={22.10} b={27.10} />
              </>
            )}
            {i === 4 && (
              <>
                <PieceVsCoffee t={t} a={29.40} b={33.28 - 0.2} />
                <Note t={t} at={29.60} out={33.28 - 0.3} x={960} y={1000} rot={-2} text="MENOS QUE UN CAFÉ" size={54} />
              </>
            )}
          </Panel>
        );
      })}

      <Whip t={t} a={4.30} b={5.10} dx={1} />
      <Iris t={t} a={4.30} b={4.90} x={960} y={540} r0={40} r1={900} col="rgba(255,216,120,0.35)" />
      <Whip t={t} a={8.70} b={9.30} dx={-1} />
      <Iris t={t} a={17.55} b={18.36} x={960} y={640} r0={40} r1={900} />
      <Iris t={t} a={18.10} b={18.75} x={960} y={540} r0={900} r1={40} col="rgba(143,214,255,0.5)" />
      <Iris t={t} a={21.55} b={22.15} x={960} y={540} r0={40} r1={900} col="rgba(143,214,255,0.5)" />
      <Iris t={t} a={26.55} b={27.36} x={960} y={640} r0={60} r1={900} col="rgba(143,214,255,0.45)" />
      <BlueToCoffee t={t} a={26.60} b={27.40} />
      <Iris t={t} a={32.90} b={33.70} x={1320} y={520} r0={60} r1={900} col="rgba(255,216,120,0.5)" />
      <Iris t={t} a={33.02} b={33.72} x={1320} y={520} r0={700} r1={40} col="rgba(255,216,120,0.5)" />

      {av1 && <AvatarPanel t={t} a={0} b={4.64} enter={false} exit={true} />}
      {av2 && <AvatarPanel t={t} a={18.36} b={21.95} enter={true} exit={true} />}
      {av3 && <AvatarPanel t={t} a={33.28} b={38.54} enter={true} exit={false} />}

      {t >= 31.96 && t < 38.54 && (
        <div style={{ position: "absolute", left: 260, top: 200, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${lin(t, 31.96, 32.6, -28, 0)}deg) scale(${0.85 + 0.15 * spr(t, 31.96, 0.9)})`,
          textAlign: "center", fontFamily: FONT, fontWeight: 900, color: "#ffd84a", textShadow: extrude(8, "#7a4a00"), opacity: ei(t, 31.96, 32.3) }}>
          <div style={{ fontSize: 160, lineHeight: 1 }}>{t < 36.20 ? 25 : 15}</div>
          <div style={{ fontSize: 44, color: "#fff", letterSpacing: 4 }}>{t < 36.20 ? "AÑOS" : "TRUCOS"}</div>
        </div>
      )}

      <Grade />
    </AbsoluteFill>
  );
};

export const SFX_Escena_0_39_continuo: [number, string, number?][] = [
  [4.30, "whoosh_big", -3],
  [4.64, "whoosh", -4],
  [5.20, "pop", -3],
  [5.36, "write", -4],
  [6.46, "paper", -6],
  [8.70, "swish", -3],
  [8.94, "whoosh", -4],
  [9.62, "pop", -3],
  [11.34, "pop", -3],
  [12.80, "swish", -3],
  [13.08, "k_frasco", -6],
  [13.24, "tick", -4],
  [13.62, "tick", -4],
  [13.98, "tick", -4],
  [16.14, "roll", -4],
  [17.55, "riser", -4],
  [18.36, "whoosh", -3],
  [21.55, "whoosh", -3],
  [22.26, "pop", -3],
  [22.40, "roll", -4],
  [22.90, "write", -4],
  [25.14, "pop", -3],
  [26.55, "riser", -5],
  [27.36, "swish", -3],
  [29.40, "stamp", -3],
  [29.60, "stamp", -3],
  [31.96, "pop", -3],
  [32.90, "riser", -5],
  [33.28, "whoosh", -3],
  [36.20, "pop", -5],
];
