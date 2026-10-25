// vext01 v2 — "La taza número 9" (19 s). Tratamiento del director creativo: café a las 3 AM, revelación de
// las 8 tazas vacías, el corazón se desboca. Cámara orgánica (camara.tsx) + foley cuadro a cuadro (sonido.tsx).
import React from "react";
import { AbsoluteFill, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Caveat";
import { Plano, Capa, golpe, respira, useF, OffsetCtx } from "./camara";
import { Sonidos } from "./sonido";

const { fontFamily: mano } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (f: number, a: number[], b: number[], ease = Easing.inOut(Easing.cubic)) => {
  const r = a.map((v, i) => (i > 0 && v <= a[i - 1] ? a[i - 1] + 0.001 * i : v));
  return interpolate(f, r, b, { ...cl, easing: ease });
};

// paleta: noche azul + acento cálido de la tira de luz bajo la alacena
const C = {
  noche: "#0f1628", noche2: "#18223b", pared: "#1c2640", azulejo: "#24304e",
  calido: "#ffb766", calido2: "#ffd9a0", madera: "#5b3d2a", madera2: "#7a5236", maderaLuz: "#a8743f",
  porcelana: "#f3ede2", porcSombra: "#b9b3ab", cafe: "#2a170c", cafe2: "#4a2a16", teal: "#2bb3a3", negro: "#05070d",
  frio: "#7fb0ff",
};
export const BPM_F = 30 * 60 / 110; // un latido cada 16,36 cuadros
export const LATIDO0 = 318; // el corazón arranca después del silencio que deja la heladera (300-318)

// ── piezas ────────────────────────────────────────────────────────────────
const Vapor: React.FC<{ x: number; y: number; s?: number; o?: number; seed?: string }> = ({ x, y, s = 1, o = 0.5, seed = "v" }) => {
  const f = useF();
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} style={{ mixBlendMode: "screen" }}>
      {/* cintas anchas y difusas que suben ~25 px/s, se desvían y mueren a los 180 px (nada de rayitas de emoji) */}
      {[0, 1, 2, 3].map((i) => {
        const t = ((f + i * 54 + random(seed + i) * 40) % 216) / 216;
        const y = -t * 180;
        const dx = Math.sin(t * 5 + i * 1.7) * 16 + Math.sin(f / 23 + i) * 6;
        const op = Math.sin(t * Math.PI) * (0.12 + 0.13 * random(seed + "o" + i)) * (o / 0.5);
        return (
          <path key={i} d={`M${-24 + i * 16 + dx} ${y} c 18 -20 -14 -40 4 -62`} stroke="#fff3e2" strokeWidth={18 + 12 * random(seed + "w" + i)}
            fill="none" strokeLinecap="round" opacity={op} style={{ filter: "blur(6px)" }} />
        );
      })}
    </g>
  );
};

// taza de perfil. lleno 0..1, el café se ve por la boca (elipse)
const Taza: React.FC<{ x: number; y: number; s?: number; lleno?: number; luz?: string; ola?: number }> = ({ x, y, s = 1, lleno = 0, luz = C.calido, ola = 0 }) => {
  const W = 92, H = 104; // boca a y=0, base a y=H
  const nivel = H * (1 - lleno * 0.86);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <linearGradient id="tazaCil" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d8cdbb" /><stop offset="0.12" stopColor="#fff8ec" /><stop offset="0.3" stopColor={C.porcelana} />
          <stop offset="0.72" stopColor="#b5ada3" /><stop offset="0.9" stopColor="#8e8a8c" /><stop offset="1" stopColor="#a9b3c6" />
        </linearGradient>
        <linearGradient id="tazaBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0.75" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.28} /></linearGradient>
        <radialGradient id="tazaAO" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#000" stopOpacity={0.55} /><stop offset="1" stopColor="#000" stopOpacity={0} /></radialGradient>
        <linearGradient id="asaCil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c9c0b2" /><stop offset="1" stopColor="#8f8a88" /></linearGradient>
      </defs>
      {/* sombra de contacto: núcleo apretado (oclusión) + penumbra ancha corrida hacia el lado opuesto a la luz */}
      <ellipse cx={10} cy={H + 4} rx={W * 0.95} ry={16} fill="url(#tazaAO)" opacity={0.8} />
      <ellipse cx={0} cy={H + 1} rx={W * 0.5} ry={4} fill="#000" opacity={0.55} />
      <path d={`M${W / 2 - 4} 22 C ${W / 2 + 44} 18, ${W / 2 + 44} 78, ${W / 2 - 10} 74`} stroke="url(#asaCil)" strokeWidth={13} fill="none" />
      <path d={`M${W / 2 - 2} 26 C ${W / 2 + 36} 24, ${W / 2 + 36} 72, ${W / 2 - 8} 70`} stroke="#000" strokeWidth={3} fill="none" opacity={0.18} />
      <path d={`M${-W / 2} 0 L${-W / 2 + 8} ${H - 10} Q${-W / 2 + 10} ${H} 0 ${H} Q${W / 2 - 10} ${H} ${W / 2 - 8} ${H - 10} L${W / 2} 0 Z`} fill="url(#tazaCil)" />
      <path d={`M${-W / 2} 0 L${-W / 2 + 8} ${H - 10} Q${-W / 2 + 10} ${H} 0 ${H} Q${W / 2 - 10} ${H} ${W / 2 - 8} ${H - 10} L${W / 2} 0 Z`} fill="url(#tazaBase)" />
      <path d={`M${-W / 2 + 6} 6 L${-W / 2 + 12} ${H - 16}`} stroke={luz} strokeWidth={6} opacity={0.55} strokeLinecap="round" />
      <path d={`M${W / 2 - 2} 4 L${W / 2 - 9} ${H - 12}`} stroke={C.frio} strokeWidth={2} opacity={0.45} strokeLinecap="round" />
      <ellipse cx={0} cy={0} rx={W / 2} ry={11} fill="#d9d2c6" />
      <ellipse cx={0} cy={1.5} rx={W / 2 - 4} ry={8.5} fill="#7d766f" opacity={0.55} />
      <path d={`M${-W / 2 + 6} -3 A${W / 2} 11 0 0 1 ${-6} ${-10.5}`} stroke="#fff" strokeWidth={1.6} fill="none" opacity={0.85} strokeLinecap="round" />
      {lleno > 0.02 && (
        <ellipse cx={0} cy={Math.min(nivel * 0.12, 6)} rx={W / 2 - 5} ry={8 + ola} fill={C.cafe} />
      )}
      {lleno > 0.02 && <ellipse cx={-10} cy={Math.min(nivel * 0.12, 6) - 2} rx={14} ry={3} fill={C.calido} opacity={0.35} />}
    </g>
  );
};

// brazo de tubo teal con puño negro (la mano de la referencia). desde = hombro fuera de cuadro, puño en (px,py)
const Brazo: React.FC<{ dx: number; dy: number; px: number; py: number; grosor?: number; luz?: string; ang?: number }> = ({ dx, dy, px, py, grosor = 46, luz = C.calido, ang = 0 }) => (
  <g>
    <path d={`M${dx} ${dy} Q${(dx + px) / 2 + 30} ${(dy + py) / 2 + 60} ${px} ${py}`} stroke={luz} strokeWidth={grosor + 6} fill="none" strokeLinecap="round" transform="translate(-3,-3)" opacity={0.8} />
    <path d={`M${dx} ${dy} Q${(dx + px) / 2 + 30} ${(dy + py) / 2 + 60} ${px} ${py}`} stroke={C.teal} strokeWidth={grosor} fill="none" strokeLinecap="round" />
    <g transform={`translate(${px},${py}) rotate(${ang})`}>
      <circle r={grosor * 0.78} fill={luz} transform="translate(-3,-3)" opacity={0.8} />
      <circle r={grosor * 0.75} fill={C.negro} />
      {[-1, 0, 1].map((k) => <circle key={k} cx={-grosor * 0.55} cy={k * grosor * 0.35} r={grosor * 0.24} fill={C.negro} />)}
    </g>
  </g>
);

const Cafetera: React.FC<{ x: number; y: number; s?: number; rot?: number; nivel?: number; ola?: number }> = ({ x, y, s = 1, rot = 0, nivel = 0.6, ola = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <defs>
      <clipPath id="vidrio"><path d="M-70 -110 L70 -110 L95 60 Q95 90 60 90 L-60 90 Q-95 90 -95 60 Z" /></clipPath>
    </defs>
    <path d="M-70 -110 L70 -110 L95 60 Q95 90 60 90 L-60 90 Q-95 90 -95 60 Z" fill="#9fb6d6" opacity={0.18} />
    <g clipPath="url(#vidrio)">
      <rect x={-120} y={90 - 200 * nivel + ola} width={240} height={300} fill={C.cafe} transform={`rotate(${-rot} 0 ${90 - 200 * nivel})`} />
      <rect x={-120} y={90 - 200 * nivel + ola} width={240} height={6} fill={C.cafe2} transform={`rotate(${-rot} 0 ${90 - 200 * nivel})`} />
    </g>
    <path d="M-70 -110 L70 -110 L95 60 Q95 90 60 90 L-60 90 Q-95 90 -95 60 Z" fill="none" stroke="#cfe0ff" strokeWidth={4} opacity={0.6} />
    <path d="M-62 -100 L-82 50" stroke="#fff" strokeWidth={6} opacity={0.35} strokeLinecap="round" />
    {/* pico */}
    <path d="M-70 -110 L-100 -126 L-66 -96 Z" fill="#9fb6d6" opacity={0.5} />
    {/* tapa y asa */}
    <rect x={-74} y={-132} width={148} height={26} rx={8} fill="#141820" />
    <path d="M78 -96 C150 -96 150 40 86 40" stroke="#141820" strokeWidth={22} fill="none" strokeLinecap="round" />
  </g>
);

const Pared: React.FC<{ tira?: number }> = ({ tira = 1 }) => (
  <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="pw" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.calido} stopOpacity={0.55 * tira} />
        <stop offset="0.35" stopColor={C.pared} stopOpacity={1} />
        <stop offset="1" stopColor={C.noche} />
      </linearGradient>
    </defs>
    <rect x={-200} y={-200} width={2320} height={1480} fill="url(#pw)" />
    {Array.from({ length: 14 }).map((_, i) => <rect key={"h" + i} x={-200} y={i * 80} width={2320} height={3} fill={C.azulejo} opacity={0.5} />)}
    {Array.from({ length: 30 }).map((_, i) => <rect key={"v" + i} x={-200 + i * 160 + ((Math.floor(i / 1) % 2) * 0)} y={0} width={3} height={1080} fill={C.azulejo} opacity={0.3} />)}
    {/* alacena y tira de luz: la luz cálida nace en el borde de la alacena y se apaga en ~350 px */}
    <defs>
      <radialGradient id="tiraG" cx="0.5" cy="0" r="0.5"><stop offset="0" stopColor={C.calido} stopOpacity={0.34 * tira} /><stop offset="1" stopColor={C.calido} stopOpacity={0} /></radialGradient>
    </defs>
    <ellipse cx={960} cy={66} rx={1300} ry={380} fill="url(#tiraG)" />
    <Rayos y={66} tira={tira} />
    <rect x={-200} y={-200} width={2320} height={260} fill="#2a1d18" />
    <rect x={-200} y={56} width={2320} height={10} fill={C.calido2} opacity={tira} />
  </svg>
);
// haces de luz: trapecios con degradé vertical, ondulan apenas (el aire se mueve) — barato, sin blur de CSS
const Rayos: React.FC<{ y: number; tira?: number; x0?: number; x1?: number }> = ({ y, tira = 1, x0 = 80, x1 = 1840 }) => {
  const f = useF();
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <defs>
        <linearGradient id="rayo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.calido2} stopOpacity={0.16 * tira} /><stop offset="1" stopColor={C.calido2} stopOpacity={0} /></linearGradient>
      </defs>
      {Array.from({ length: 9 }).map((_, i) => {
        const cx = x0 + ((x1 - x0) * (i + 0.5)) / 9 + Math.sin(f / 40 + i * 1.3) * 10;
        const w = 40 + random("rw" + i) * 70, abre = 1.6 + random("ra" + i) * 0.8;
        const o = 0.5 + 0.5 * Math.sin(f / 33 + i * 2.1);
        return <path key={i} d={`M${cx - w / 2} ${y} L${cx + w / 2} ${y} L${cx + (w / 2) * abre + 60} ${y + 700} L${cx - (w / 2) * abre + 60} ${y + 700} Z`} fill="url(#rayo)" opacity={o} />;
      })}
    </g>
  );
};
// bruma: separa planos de profundidad (lo lejano se aclara hacia el color del aire), reemplaza blur caro
const Bruma: React.FC<{ o?: number; color?: string }> = ({ o = 0.18, color = "#2a3556" }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${color} 0%, rgba(0,0,0,0) 85%)`, opacity: o, mixBlendMode: "screen" }} />
);

const Mesada: React.FC<{ y?: number }> = ({ y = 780 }) => (
  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="md" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.maderaLuz} /><stop offset="0.25" stopColor={C.madera2} /><stop offset="1" stopColor={C.madera} />
      </linearGradient>
    </defs>
    <rect x={-300} y={y} width={2520} height={600} fill="url(#md)" />
    {Array.from({ length: 7 }).map((_, i) => (
      <path key={i} d={`M-300 ${y + 24 + i * 34} C 400 ${y + 18 + i * 34}, 1200 ${y + 32 + i * 34}, 2220 ${y + 22 + i * 34}`} stroke="#3e2819" strokeWidth={2} opacity={0.35} fill="none" />
    ))}
    <rect x={-300} y={y} width={2520} height={5} fill={C.calido2} opacity={0.5} />
    <defs>
      <radialGradient id="charcoMesa" cx="0.5" cy="0" r="0.6"><stop offset="0" stopColor={C.calido2} stopOpacity={0.32} /><stop offset="1" stopColor={C.calido2} stopOpacity={0} /></radialGradient>
      <linearGradient id="canto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.55} /></linearGradient>
    </defs>
    <rect x={-300} y={y} width={2520} height={420} fill="url(#charcoMesa)" style={{ mixBlendMode: "screen" }} />
    <rect x={-300} y={y + 150} width={2520} height={450} fill="url(#canto)" />
  </svg>
);

const Polvo: React.FC<{ n?: number; seed?: string; caja?: [number, number, number, number] }> = ({ n = 26, seed = "p", caja = [0, 0, 1920, 1080] }) => {
  const f = useF();
  const [x0, y0, w, h] = caja;
  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
      {Array.from({ length: n }).map((_, i) => {
        const x = x0 + random(seed + "x" + i) * w + Math.sin((f + i * 31) / 50) * 14;
        const y = y0 + (((random(seed + "y" + i) * h - f * (0.2 + random(seed + "v" + i) * 0.4)) % h) + h) % h;
        return <circle key={i} cx={x} cy={y} r={1 + random(seed + "r" + i) * 2} fill={C.calido2} opacity={0.2 + 0.4 * Math.abs(Math.sin((f + i * 11) / 37))} />;
      })}
    </svg>
  );
};

const Vineta: React.FC<{ o?: number }> = ({ o = 0.65 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,${o}) 100%)` }} />
);
const Franjas: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 58, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 58, background: "#000" }} />
  </AbsoluteFill>
);
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>{children}</svg>
);

// ── P1 (0-60): detalle, la mano agarra la cafetera ──────────────────────────
const P1: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const llega = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 70 }, durationInFrames: 22 });
  const sube = lerp(f, [30, 54], [0, -46], Easing.out(Easing.cubic));
  const ola = f > 30 ? Math.sin((f - 30) * 0.7) * 7 * Math.exp(-(f - 30) / 12) : 0;
  const px = interpolate(llega, [0, 1], [1780, 1132]);
  const py = interpolate(llega, [0, 1], [600, 476]) + sube;
  return (
    <Plano
      claves={[
        { f: 0, x: 0, y: 0, zoom: 1.02, foco: 1 },
        { f: 48, x: -26, y: -12, zoom: 1.07, resorte: { damping: 30, stiffness: 20 } },
        { f: 60, x: -26, y: -620, zoom: 1.07, curva: "in" }, // T1: sigue la subida de la cafetera y acelera hasta el corte
      ]}
      mano={4} seed={1} fondo={C.noche}
    >
      <Capa z={0.45} desenfoqueMax={16}><Pared /></Capa>
      <Bruma o={0.22} />
      <Capa z={1}>
        <Mesada y={800} />
        <Svg>
          {/* base de la cafetera con luz roja */}
          <rect x={720} y={762} width={360} height={44} rx={10} fill="#141820" />
          <circle cx={1040} cy={784} r={6} fill="#ff4a3d" opacity={0.6 + 0.4 * Math.sin(f / 5)} />
          <Cafetera x={900} y={672 + sube} s={1.55} nivel={0.62} ola={ola} />
          <Vapor x={760} y={480 + sube} s={1.2} o={0.35} seed="v1" />
          <Brazo dx={2050} dy={760} px={px} py={py} grosor={60} />
        </Svg>
      </Capa>
      <Capa z={1.8} desenfoqueMax={22}>
        <Svg>
          <rect x={-200} y={960} width={900} height={300} rx={30} fill="#120c09" />
          <path d="M60 1080 L90 760 Q170 720 250 760 L280 1080 Z" fill="#20283c" />
        </Svg>
      </Capa>
      <Polvo seed="p1" caja={[500, 60, 900, 700]} />
      <Vineta />
    </Plano>
  );
};

// ── P2 (60-165): perfil, el chorro cae en la taza ───────────────────────────
// el grupo cafetera+brazo+chorro se dibuja en espejo: el brazo entra SIEMPRE por la derecha (como en P1 y P3)
const P2: React.FC = () => {
  const f = useF(); // local 0-105
  const lleno = lerp(f, [4, 90], [0, 0.84], Easing.inOut(Easing.sin));
  const corte = lerp(f, [88, 94], [0, 1]); // el chorro se corta desde arriba
  const arranque = lerp(f, [0, 4], [0, 1]);
  const CXo = 1040, CX = 1920 - CXo, CY = 690, S = 2.6; // CXo = x de la taza en el espacio espejado
  const sup = CY + 6 * S;
  const pico = { x: 780, y: 300 };
  const wob = (k: number) => Math.sin(f * 1.3 + k) * 3;
  const y0 = pico.y + (sup - pico.y) * corte;
  const y1 = pico.y + (sup - pico.y) * arranque;
  const gotas = [
    { f0: 96, x: CXo - 30 }, { f0: 103, x: CXo - 26 },
  ];
  return (
    <Plano
      claves={[
        { f: 0, x: 20, y: 560, zoom: 1.04, foco: 1.2 }, // T1: llega del paneo con la misma velocidad y frena
        { f: 13, x: 20, y: 0, zoom: 1.04, foco: 1.2, curva: "out" },
        { f: 50, x: -20, y: 6, zoom: 1.06, foco: 1.2 },
        { f: 68, x: -30, y: 10, zoom: 1.075, foco: 1, resorte: { damping: 22, stiffness: 50 } },
      ]}
      mano={4} seed={2} fondo={C.noche}
    >
      <Capa z={0.4} desenfoqueMax={18}><Pared /></Capa>
      <Bruma o={0.22} />
      <Capa z={1} desenfoqueMax={18}>
        <Mesada y={958} />
        <Svg>
          {/* el mismo plato de P3 bajo la taza (continuidad) */}
          <ellipse cx={CX} cy={972} rx={276} ry={38} fill="#000" opacity={0.4} />
          <ellipse cx={CX} cy={962} rx={265} ry={40} fill={C.porcelana} />
          <ellipse cx={CX} cy={956} rx={188} ry={24} fill="#ddd6ca" />
          <Taza x={CX} y={CY} s={S} lleno={lleno} ola={f < 92 ? 1.5 + Math.sin(f) : 0} />
          <Vapor x={CX} y={CY - 10} s={1.6} o={0.15 + lleno * 0.4} seed="v2" />
        </Svg>
      </Capa>
      <Capa z={1.2} desenfoqueMax={18}>
        <Svg>
          <g transform="translate(1920,0) scale(-1,1)">
            <Cafetera x={680} y={420} s={1.5} rot={-58} nivel={0.42 - lleno * 0.25} />
            <Brazo dx={260} dy={-140} px={560} py={300} grosor={60} ang={-58} />
            {corte < 1 && (
              <path d={`M${pico.x} ${y0} C ${pico.x + 120 + wob(0)} ${y0 + 40}, ${CXo - 40 + wob(1)} ${Math.max(y0, sup - 220)}, ${CXo - 30 + wob(2)} ${y1}`}
                stroke={C.cafe2} strokeWidth={13} fill="none" strokeLinecap="round" />
            )}
            {corte < 1 && <path d={`M${pico.x + 4} ${y0 + 4} C ${pico.x + 120} ${y0 + 44}, ${CXo - 44} ${Math.max(y0, sup - 216)}, ${CXo - 34} ${y1}`} stroke={C.calido} strokeWidth={3} fill="none" opacity={0.5} />}
            {gotas.map((g, i) => {
              const t = (f - g.f0) / 6;
              if (t < 0 || t > 1) return null;
              return <ellipse key={i} cx={g.x} cy={pico.y + 230 + t * (sup - pico.y - 230)} rx={6} ry={9} fill={C.cafe2} />;
            })}
          </g>
        </Svg>
      </Capa>
      <Capa z={1.75} desenfoqueMax={22}>
        <Svg>
          <rect x={1560} y={780} width={300} height={360} rx={40} fill="#2b3a52" />
          <rect x={1540} y={760} width={340} height={50} rx={20} fill="#1b2433" />
          <path d="M1580 800 L1590 1100" stroke={C.calido} strokeWidth={14} opacity={0.35} strokeLinecap="round" />
        </Svg>
      </Capa>
      <Polvo seed="p2" caja={[400, 60, 1100, 800]} />
      <Vineta />
    </Plano>
  );
};

// ── P3 (165-225): la taza se apoya, la cámara siente el golpe ───────────────
const P3: React.FC = () => {
  const f = useF(); // 0-60
  const { fps } = useVideoConfig();
  const T = 15; // cuadro del contacto (global 180)
  const baja = spring({ frame: f, fps, config: { damping: 26, stiffness: 120 }, durationInFrames: T });
  const ty = interpolate(baja, [0, 1], [610, 742]);
  const suelta = lerp(f, [25, 42], [0, 1], Easing.in(Easing.quad));
  const cuchara = f > T + 2 ? Math.sin((f - T - 2) * 1.9) * 4 * Math.exp(-(f - T - 2) / 6) : 0;
  return (
    <Plano claves={[{ f: 0, x: 0, y: 0, zoom: 1.0, foco: 1 }, { f: 60, x: 6, y: 4, zoom: 1.015 }]} mano={2.5} seed={3} fondo={C.noche} extra={{ y: golpe(f, T, 1.5) }}>
      <Capa z={0.4} desenfoqueMax={18}><Pared /></Capa>
      <Bruma o={0.22} />
      <Capa z={1}>
        <Mesada y={860} />
        <Svg>
          {/* plato y cucharita */}
          <ellipse cx={960} cy={1000} rx={250} ry={34} fill="#000" opacity={0.4} />
          <ellipse cx={960} cy={990} rx={240} ry={36} fill={C.porcelana} />
          <ellipse cx={960} cy={984} rx={170} ry={22} fill="#ddd6ca" />
          <g transform={`rotate(${cuchara} 1170 980)`}>
            <path d="M1080 990 L1300 960" stroke="#c9ccd4" strokeWidth={9} strokeLinecap="round" />
            <ellipse cx={1310} cy={958} rx={26} ry={12} fill="#c9ccd4" transform="rotate(-8 1310 958)" />
          </g>
          <Taza x={960} y={ty} s={2.35} lleno={0.84} ola={f > T ? 3 * Math.exp(-(f - T) / 5) * Math.sin(f) : 0} />
          <Vapor x={960} y={ty - 20} s={1.7} o={0.5} seed="v3" />
          <Brazo dx={1900 + suelta * 300} dy={1150} px={1180 + suelta * 420} py={ty + 70 + suelta * 120} grosor={58} />
        </Svg>
      </Capa>
      <Capa z={1.75} desenfoqueMax={22}>
        <Svg><Cafetera x={150} y={760} s={2.4} nivel={0.25} /></Svg>
      </Capa>
      <Polvo seed="p3" caja={[500, 60, 900, 700]} />
      <Vineta />
    </Plano>
  );
};

// ── set de cocina completa (P4 y fondo de P5) ───────────────────────────────
const Exterior: React.FC = () => (
  <Svg>
    <defs>
      <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1634" /><stop offset="1" stopColor="#24386b" /></linearGradient>
      <radialGradient id="luna" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff" /><stop offset="0.3" stopColor="#dfeaff" /><stop offset="1" stopColor="#dfeaff" stopOpacity={0} /></radialGradient>
    </defs>
    <rect x={180} y={120} width={560} height={480} fill="url(#cielo)" />
    <circle cx={560} cy={230} r={110} fill="url(#luna)" opacity={0.5} />
    <circle cx={560} cy={230} r={34} fill="#f4f7ff" />
    <path d="M180 600 V480 H240 V450 H300 V500 H360 V430 H430 V490 H500 V470 H570 V520 H640 V460 H740 V600 Z" fill="#0a1124" />
    {[[250, 470], [320, 510], [445, 455], [590, 535], [680, 480]].map(([x, y], i) => <rect key={i} x={x} y={y} width={9} height={11} fill="#ffd27a" opacity={0.7} />)}
  </Svg>
);
const ParedCocina: React.FC<{ hora?: string }> = ({ hora = "3:07" }) => {
  const f = useF();
  return (
    <Svg>
      <defs>
        <linearGradient id="pc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.noche2} /><stop offset="1" stopColor={C.pared} /></linearGradient>
        <radialGradient id="charcoCal" cx="0.5" cy="0" r="1"><stop offset="0" stopColor={C.calido} stopOpacity={0.5} /><stop offset="1" stopColor={C.calido} stopOpacity={0} /></radialGradient>
      </defs>
      {/* pared con agujero para la ventana */}
      <path d="M-300 -300 H2220 V1380 H-300 Z M180 120 V600 H740 V120 Z" fill="url(#pc)" fillRule="evenodd" />
      <rect x={160} y={100} width={600} height={520} fill="none" stroke="#2a1d18" strokeWidth={22} />
      <rect x={452} y={110} width={14} height={500} fill="#2a1d18" />
      <rect x={170} y={350} width={580} height={14} fill="#2a1d18" />
      {/* alacenas */}
      <rect x={860} y={60} width={760} height={300} fill="#2a1d18" rx={6} />
      {[0, 1, 2].map((i) => <rect key={i} x={880 + i * 250} y={80} width={230} height={260} fill="#33241d" rx={4} />)}
      <rect x={860} y={356} width={760} height={12} fill={C.calido2} />
      <path d={`M860 368 L1620 368 L1760 780 L720 780 Z`} fill="url(#charcoCal)" />
      <Rayos y={368} x0={880} x1={1600} tira={0.8} />
      {/* reloj */}
      <g transform="translate(1060,470)">
        <circle r={44} fill="#e9e2d0" stroke="#3a3348" strokeWidth={7} />
        <rect x={-2.5} y={-24} width={5} height={26} fill="#20182b" rx={2} transform={`rotate(${93 + f * 0.01})`} />
        <rect x={-2} y={-36} width={4} height={38} fill="#20182b" rx={2} transform={`rotate(${42 + f * 0.1})`} />
        <rect x={-1} y={-38} width={2} height={42} fill="#d1494a" transform={`rotate(${(Math.floor(f / 30) * 6) % 360})`} />
        <circle r={4} fill="#d1494a" />
      </g>
      {/* heladera con post-it */}
      <g transform="translate(1690,140)">
        <rect width={300} height={720} rx={18} fill="#c9cfd8" />
        <rect width={300} height={720} rx={18} fill={C.noche} opacity={0.55} />
        <rect x={0} y={250} width={300} height={6} fill="#5c6474" />
        <rect x={250} y={80} width={14} height={140} rx={7} fill="#7d8698" />
        <g transform="translate(60,320) rotate(-6)">
          <rect width={120} height={110} fill="#f6d65a" />
          <text x={60} y={72} textAnchor="middle" fontFamily={mano} fontWeight={700} fontSize={46} fill="#2b2b2b">DÍA 3</text>
        </g>
      </g>
      <text x={0} y={0} fontSize={1} fill="transparent">{hora}</text>
    </Svg>
  );
};
// cada taza vacía cuenta algo distinto: separaciones irregulares, dos apiladas, una volcada, cucharitas, aros de café
const VACIAS = [
  { dx: 0, cuchara: true, chorreo: true },
  { dx: 14 },
  { dx: -10, apilada: true },
  { dx: 18, cuchara: true },
  { dx: -22, volcada: true },
  { dx: 34, chorreo: true },
  { dx: 22, cuchara: true },
  { dx: 30 },
];
const MesadaCocina: React.FC<{ llena?: boolean; persona?: boolean; ojos?: number; f0?: number }> = ({ llena = true, persona = true, ojos = 1, f0 = 0 }) => {
  const f = useF();
  const g = f + f0; // cuadro global (para que el cambio de peso caiga en 262 junto al roce)
  const resp = Math.sin(f / 26); // respiración lenta del pecho
  const peso = lerp(g, [258, 272], [0, 1], Easing.inOut(Easing.quad)); // pasa el peso a la otra pierna
  const mira = lerp(g, [244, 254], [0, 1]) * (1 - lerp(g, [290, 300], [0, 1])); // ojeada de reojo a las tazas
  const cierra = f0 > 0 ? lerp(g, [312, 317], [1, 0]) : 1; // cierra los ojos con el silencio, justo antes del empuje
  return (
    <>
      {persona && (
        <Svg>
          {/* stickman encorvado detrás de la mesada, luz de borde cálida SÓLO del lado de la alacena */}
          <g transform={`translate(${1240 - peso * 12},${478 + resp * 1.2}) rotate(${-2 + peso * 3} 0 330)`}>
            <g transform={`scale(${1 + resp * 0.012},${1 - resp * 0.006})`}>
              <defs>
                <linearGradient id="torsoCil" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#5fd6c6" /><stop offset="0.25" stopColor={C.teal} /><stop offset="0.7" stopColor="#167468" /><stop offset="0.92" stopColor="#0f4f49" /><stop offset="1" stopColor="#2d5f7a" />
                </linearGradient>
              </defs>
              <path d="M-38 84 Q0 70 38 84 L46 330 L-46 330 Z" fill="url(#torsoCil)" />
              <path d="M-38 84 L-46 330" stroke={C.calido} strokeWidth={4} opacity={0.8} />
            </g>
            <rect x={-6} y={50} width={12} height={36} fill={C.negro} transform="rotate(14 0 86)" />
            <path d="M-40 96 Q-66 190 -34 276" stroke={C.negro} strokeWidth={15} fill="none" strokeLinecap="round" />
            <path d="M-44 96 Q-70 190 -38 276" stroke={C.calido} strokeWidth={4} fill="none" opacity={0.7} />
            <path d="M40 96 Q62 190 36 276" stroke={C.negro} strokeWidth={15} fill="none" strokeLinecap="round" />
            {/* cabeza caída hacia adelante */}
            <g transform="translate(-10,18) rotate(-10)">
              <circle cx={0} cy={0} r={52} fill={C.negro} />
              <path d="M-50 -14 A52 52 0 0 1 -14 -50" stroke={C.calido} strokeWidth={5} fill="none" opacity={0.85} />
              <g opacity={ojos * cierra}>
                <ellipse cx={-22} cy={-2} rx={8} ry={6} fill="#f2efe6" />
                <ellipse cx={6} cy={-2} rx={8} ry={6} fill="#f2efe6" />
                <circle cx={-22 - mira * 4} cy={0} r={3} fill="#141018" />
                <circle cx={6 - mira * 4} cy={0} r={3} fill="#141018" />
                <rect x={-34} y={-12} width={52} height={7} fill={C.negro} />
              </g>
            </g>
          </g>
        </Svg>
      )}
      <Mesada y={780} />
      <Svg>
        {/* aros de café secos sobre la madera */}
        {[[360, 792, 34], [585, 798, 30], [760, 790, 36], [1020, 800, 28], [1180, 794, 32]].map(([x, y, r], i) => (
          <ellipse key={"aro" + i} cx={x} cy={y} rx={r} ry={r * 0.22} fill="none" stroke="#3a2010" strokeWidth={3} opacity={0.55} />
        ))}
        {VACIAS.map((v, i) => {
          const x = 300 + i * 118 + v.dx;
          const y = 700 + (i % 2) * 6;
          const luz = i > 4 ? C.calido : C.frio;
          if (v.apilada) return null; // se dibuja encima de la anterior
          return (
            <g key={i} opacity={0.96}>
              {v.volcada ? (
                <g transform={`rotate(84 ${x + 38} ${y + 86})`}><Taza x={x} y={y} s={0.82} lleno={0} luz={luz} /></g>
              ) : (
                <Taza x={x} y={y} s={0.82} lleno={0} luz={luz} />
              )}
              {v.volcada && <ellipse cx={x + 150} cy={790} rx={40} ry={7} fill={C.cafe} opacity={0.8} />}
              {v.chorreo && <path d={`M${x - 30} ${y + 6} q -3 26 2 44`} stroke={C.cafe2} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.85} />}
              {v.cuchara && <path d={`M${x + 8} ${y + 4} L${x + 30} ${y - 52}`} stroke="#c9ccd4" strokeWidth={6} strokeLinecap="round" />}
              {VACIAS[i + 1]?.apilada && (
                <g transform={`rotate(4 ${x} ${y})`}><Taza x={x + 6} y={y - 80} s={0.78} lleno={0} luz={luz} /></g>
              )}
            </g>
          );
        })}
        {llena && (
          <g>
            {/* plato y cucharita = los de P3 a escala 0,383 (continuidad del fundido T3) */}
            <ellipse cx={1360} cy={787} rx={96} ry={13} fill="#000" opacity={0.4} />
            <ellipse cx={1360} cy={785} rx={92} ry={14} fill={C.porcelana} />
            <ellipse cx={1360} cy={783} rx={65} ry={8.4} fill="#ddd6ca" />
            <path d="M1406 785 L1490 774" stroke="#c9ccd4" strokeWidth={3.4} strokeLinecap="round" />
            <ellipse cx={1494} cy={773} rx={10} ry={4.6} fill="#c9ccd4" transform="rotate(-8 1494 773)" />
          </g>
        )}
        {llena && <Taza x={1360} y={690} s={0.9} lleno={0.84} />}
        {llena && <Vapor x={1360} y={680} s={0.6} o={0.45} seed="v4" />}
      </Svg>
    </>
  );
};

// ── P4 (225-330): travelling hacia atrás, la revelación ─────────────────────
const P4: React.FC = () => {
  const f = useF(); // 0-105
  return (
    <Plano
      claves={[
        // T3: la taza 9 (mundo 1360,690, s 0,9) cae exacto donde termina la taza de P3 (pantalla 954,741, s 2,385)
        { f: -6, x: 1066, y: 197, zoom: 2.65, foco: 1 },
        { f: 8, x: 1060, y: 195, zoom: 2.65 },
        { f: 78, x: 0, y: 0, zoom: 1.0, resorte: { damping: 17, stiffness: 55, mass: 1.2 } },
        { f: 90, x: 0, y: 0, zoom: 1.0 },
        // T4: con el primer latido cierra los ojos y la cámara se mete en la cabeza negra (centro 1223,496)
        { f: 105, x: 26 * 263, y: 26 * -44, zoom: 26, curva: "in" },
      ]}
      mano={3.5} seed={4} fondo={C.noche}
    >
      <Capa z={0.08}><Exterior /></Capa>
      <Capa z={0.55} desenfoqueMax={4}><ParedCocina /></Capa>
      <Bruma o={0.16} />
      <Capa z={1}><MesadaCocina f0={225} /></Capa>
      <Capa z={1.9} desenfoqueMax={20}>
        <Svg>
          {/* repasador colgando en primer término */}
          <path d="M1780 -100 L1980 -100 L1990 420 Q1890 450 1790 410 Z" fill="#7a2f3a" />
          <path d="M1790 300 L1990 310" stroke="#e8d9c0" strokeWidth={14} opacity={0.7} />
        </Svg>
      </Capa>
      <Polvo seed="p4" caja={[860, 370, 900, 420]} />
      <Vineta o={0.7} />
      {/* la heladera se apaga: el cuarto se "enfría" un poco (75) */}
      <AbsoluteFill style={{ background: "#0a1430", opacity: lerp(f, [75, 95], [0, 0.12]), mixBlendMode: "multiply" }} />
    </Plano>
  );
};

// ── P5 (330-420): primer plano al tercio, el corazón ────────────────────────
const latido = (g: number) => { // g = cuadro global
  const ph = ((((g - LATIDO0) % BPM_F) + BPM_F) % BPM_F) / BPM_F;
  return Math.exp(-ph * 7);
};
const Cabeza: React.FC<{ x: number; y: number; R: number; parpadoIzq: number; pulso: number; frio: number; extraAnillos?: number }> = ({ x, y, R, parpadoIzq, pulso, frio, extraAnillos = 0 }) => {
  const borde = frio > 0.5 ? C.frio : C.calido;
  return (
    <g transform={`translate(${x},${y})`}>
      {[1, 2, 3].map((k) => (
        <circle key={k} r={(R + 26 * k) * (1 + pulso * 0.04) + extraAnillos * 1300 * (k === 1 ? 1 : 0.7 / k)} fill="none" stroke={k === 1 ? C.calido2 : C.frio}
          strokeWidth={k === 1 ? 2.5 + extraAnillos * 5 : 2.5 - k * 0.35}
          opacity={k === 1 ? Math.max(0.34 * (0.45 + 0.55 * pulso), extraAnillos * 0.9) : (0.34 / k) * (0.45 + 0.55 * pulso) * (1 - extraAnillos)} />
      ))}
      <path d={`M${-R * 1.6} ${R + 300} Q${-R * 1.5} ${R * 0.95} 0 ${R * 0.92} Q${R * 1.5} ${R * 0.95} ${R * 1.6} ${R + 300} Z`} fill={C.teal} />
      <circle r={R} fill={C.negro} />
      {/* luz de borde del lado izquierdo (alacena), se enfría con el plano */}
      <path d={`M${-R * 0.2} ${-R * 0.98} A${R} ${R} 0 0 0 ${-R * 0.98} ${R * 0.2}`} stroke={C.calido} strokeWidth={8} fill="none" opacity={1 - frio} strokeLinecap="round" />
      <path d={`M${-R * 0.2} ${-R * 0.98} A${R} ${R} 0 0 0 ${-R * 0.98} ${R * 0.2}`} stroke={C.frio} strokeWidth={8} fill="none" opacity={frio} strokeLinecap="round" />
      <circle r={R} fill="none" stroke={borde} strokeWidth={2} opacity={0.25} />
      {/* ojos simples mirando a la izquierda (el aire del cuadro) */}
      {[-0.42, 0.06].map((cx, i) => {
        const lid = i === 0 ? parpadoIzq : 0.18;
        const ex = cx * R, ey = -R * 0.12, rx = R * 0.16, ry = R * 0.2;
        return (
          <g key={i}>
            <ellipse cx={ex} cy={ey} rx={rx} ry={ry} fill="#f3efe4" />
            <circle cx={ex - rx * 0.35} cy={ey + ry * 0.05} r={rx * 0.28} fill="#141018" />
            <circle cx={ex - rx * 0.5} cy={ey - ry * 0.25} r={rx * 0.14} fill={C.frio} />
            <rect x={ex - rx - 4} y={ey - ry - 4} width={rx * 2 + 8} height={(ry * 2 + 8) * lid} fill={C.negro} />
          </g>
        );
      })}
      <path d={`M${-R * 0.34} ${R * 0.42} L${R * 0.02} ${R * 0.42}`} stroke="#f3efe4" strokeWidth={10} strokeLinecap="round" />
    </g>
  );
};
const P5: React.FC = () => {
  const f = useF(); // 0-90
  const { fps } = useVideoConfig();
  const tics = [13, 28, 45]; // global 343/358/375: entre latidos (334, 351, 367, 383)
  const parpado = tics.some((t) => f >= t && f < t + 3) ? 0.62 : 0.2;
  const frio = lerp(f, [0, 90], [0, 1], Easing.inOut(Easing.sin));
  const extra = lerp(f, [78, 96], [0, 1], Easing.in(Easing.cubic)); // T5: el anillo se abre y su borde revela P6
  return (
    <Plano
      claves={[
        { f: 0, x: 9 * 401, y: 9 * 127, zoom: 9, foco: 1 }, // T4: arranca adentro de la cabeza (punto sin ojos 1361,667) y sale frenando
        { f: 20, x: 0, y: 0, zoom: 1.0, curva: "out" },
        { f: 90, x: 18, y: 4, zoom: 1.06, resorte: { damping: 40, stiffness: 10 } },
      ]}
      mano={3} seed={5} fondo={C.noche} extra={{ zoom: respira(f, fps) }}>
      <Capa z={0.3} desenfoqueMax={20} style={{ transform: "scale(1.5)" }}>
        <AbsoluteFill style={{ transform: "translate(-180px,-60px)" }}><ParedCocina /></AbsoluteFill>
      </Capa>
      <Capa z={0.45} desenfoqueMax={22} style={{ transform: "scale(1.5)" }}>
        <AbsoluteFill style={{ transform: "translate(-180px,-60px)" }}><MesadaCocina persona={false} /></AbsoluteFill>
      </Capa>
      <Capa z={1}>
        <Svg><Cabeza x={1240} y={600} R={270} parpadoIzq={parpado} pulso={latido(f + 330)} frio={frio} extraAnillos={extra} /></Svg>
      </Capa>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(255,150,70,${0.12 * (1 - frio)}) 0%, rgba(70,110,255,${0.14 * frio}) 100%)`, mixBlendMode: "soft-light" }} />
      <Vineta o={0.72} />
    </Plano>
  );
};

// ── P6 (420-510): cenital del café, ondas al ritmo del corazón ──────────────
const P6: React.FC = () => {
  const f = useF(); // 0-90; los latidos siguen la misma grilla global
  const g = f + 420; // cuadro global
  const beats = Array.from({ length: 20 }).map((_, k) => LATIDO0 + k * BPM_F - 420).filter((b) => b > -20 && b < 100);
  const pulso = latido(g);
  const oscurece = lerp(f, [60, 90], [0, 0.45]);
  return (
    <Plano
      claves={[
        { f: -12, x: 88, y: 19, zoom: 1.31, foco: 1 }, // T5: café del tamaño del 1er anillo (r 314 en 1239,600)
        { f: 76, x: 0, y: 0, zoom: 1.08, resorte: { damping: 40, stiffness: 8 } },
        { f: 90, x: 6 * 280, y: 6 * 60, zoom: 6, curva: "in" }, // T6: se zambulle en el café
      ]}
      mano={1.5} seed={6} fondo={C.madera}>
      <Capa z={0.9} desenfoqueMax={10}>
        <Svg>
          <rect x={-300} y={-300} width={2520} height={1680} fill={C.madera} />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-300} y={-100 + i * 120} width={2520} height={4} fill="#3e2819" opacity={0.5} />)}
          <radialGradient id="luzCen" cx="0.3" cy="0.1" r="0.9"><stop offset="0" stopColor={C.calido} stopOpacity={0.35} /><stop offset="1" stopColor={C.calido} stopOpacity={0} /></radialGradient>
          <rect x={-300} y={-300} width={2520} height={1680} fill="url(#luzCen)" />
        </Svg>
      </Capa>
      <Capa z={1}>
        <Svg>
          <g transform={`translate(${1240 + pulso * Math.sin(g * 2.1)},${600 + pulso * Math.cos(g * 1.7)})`}>
            <circle r={330} fill="#000" opacity={0.35} cx={14} cy={18} />
            <circle r={330} fill={C.porcelana} />
            <circle r={300} fill="#ddd6ca" />
            <path d="M300 -30 C420 -30 420 120 296 110" stroke={C.porcelana} strokeWidth={40} fill="none" />
            <circle r={268} fill={C.porcelana} />
            <defs>
              <radialGradient id="cafeTop" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stopColor={C.cafe2} /><stop offset="1" stopColor={C.cafe} /></radialGradient>
              <clipPath id="sup"><circle r={240} /></clipPath>
            </defs>
            <circle r={240} fill="url(#cafeTop)" />
            <g clipPath="url(#sup)">
              {beats.flatMap((b, i) => [0, 4, 8].map((d, j) => {
                const t = (f - b - d) / 14;
                if (t < 0 || t > 1) return null;
                return <circle key={i + "-" + j} r={20 + t * 230} fill="none" stroke={C.calido2} strokeWidth={4 - t * 3 - j} opacity={(1 - t) * (0.5 - j * 0.12)} />;
              }))}
              <ellipse cx={-90 + pulso * 2} cy={-110 + pulso} rx={70} ry={22} fill={C.calido2} opacity={0.18} transform="rotate(-30 -90 -110)" />
            </g>
          </g>
          <text fontSize={1} fill="transparent">{g}</text>
        </Svg>
      </Capa>
      <AbsoluteFill style={{ background: "#000", opacity: oscurece }} />
      <Vineta o={0.6} />
    </Plano>
  );
};

// ── P7 (510-610): toma un sorbo, negro al tragar y se sostiene ──────────────
const P7: React.FC = () => {
  const f = useF(); // 0-100, negro desde 33
  const { fps } = useVideoConfig();
  const sube = spring({ frame: f - 1, fps, config: { damping: 20, stiffness: 70 }, durationInFrames: 18 });
  const cx = interpolate(sube, [0, 1], [1120, 975]);
  const cy = interpolate(sube, [0, 1], [1080, 740]);
  const ang = interpolate(sube, [0, 1], [0, -24]) + lerp(f, [20, 30], [0, -10]);
  const traga = f >= 30 && f < 34 ? 6 : 0;
  const atras = lerp(f, [12, 26], [0, -9]); // echa la cabeza atrás para el sorbo
  const hombro = lerp(f, [8, 22], [0, -14]); // el hombro sube con el brazo
  const ojo = lerp(f, [18, 21], [1, 0.12]); // cierra el ojo en el sorbo
  if (f >= 33) return <AbsoluteFill style={{ background: "#000" }} />;
  return (
    <Plano claves={[{ f: 0, x: 0, y: 0, zoom: 1.5, foco: 1 }, { f: 14, x: 0, y: 0, zoom: 1.02, curva: "out" }, { f: 33, x: -10, y: -6, zoom: 1.05 }]} mano={3} seed={7} fondo={C.noche}>
      <Capa z={0.35} desenfoqueMax={22} style={{ transform: "scale(1.3)" }}><ParedCocina /></Capa>
      <Capa z={1}>
        <Svg>
          <g transform={`translate(1150,${560 + traga})`}>
            <path d={`M-120 230 Q0 ${200 + hombro} 160 ${230 + hombro} L240 600 L-200 600 Z`} fill={C.teal} />
            <g transform={`rotate(${-atras} 40 200)`}>
              <circle r={230} fill={C.negro} />
              <path d="M-46 -226 A230 230 0 0 0 -226 -46" stroke={C.frio} strokeWidth={8} fill="none" strokeLinecap="round" />
              <ellipse cx={-120} cy={-40} rx={24} ry={32 * ojo} fill="#f3efe4" />
              {ojo > 0.5 && <circle cx={-128} cy={-36} r={9} fill="#141018" />}
            </g>
          </g>
          <g transform={`rotate(${ang} ${cx} ${cy})`}>
            <Taza x={cx} y={cy - 60} s={1.9} lleno={0.84 - lerp(f, [20, 32], [0, 0.2])} />
          </g>
          <Brazo dx={1400} dy={1200} px={cx + 150} py={cy + 40} grosor={56} luz={C.frio} />
        </Svg>
      </Capa>
      <Vineta o={0.7} />
      {/* T6: todavía estamos "en el café": el color se abre en 10 cuadros */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #3a2112 0%, #1d1009 70%)", opacity: lerp(f, [0, 10], [1, 0], Easing.out(Easing.quad)) }} />
    </Plano>
  );
};

// entra = cuadros que el plano arranca ANTES de su corte (encimado), sale = cuadros que sigue después.
// capa(fl) = estilo del plano que entra durante el encimado (fl = cuadro local, negativo antes del corte).
const lat = (g: number) => Math.exp(-7 * ((((g - LATIDO0) % BPM_F) + BPM_F) % BPM_F) / BPM_F);
export const PLANOS: { c: React.FC; d: number; entra?: number; sale?: number; capa?: (fl: number) => React.CSSProperties }[] = [
  { c: P1, d: 60 },
  { c: P2, d: 105 },
  { c: P3, d: 60, sale: 6 },
  // T3: fundido con la taza calzada
  { c: P4, d: 105, entra: 6, capa: (fl) => ({ opacity: lerp(fl, [-6, 6], [0, 1], Easing.inOut(Easing.sin)) }) },
  { c: P5, d: 90, sale: 6 },
  {
    // T5: máscara circular cuyo borde es el primer anillo del latido de P5
    c: P6, d: 90, entra: 12,
    capa: (fl) => {
      const e = lerp(fl + 90, [78, 96], [0, 1], Easing.in(Easing.cubic));
      const r = 1.06 * (296 * (1 + lat(fl + 420) * 0.04) + 1300 * e);
      // la cabeza se llena de café (6 cuadros) y después el anillo abre el resto
      return { clipPath: `circle(${r.toFixed(1)}px at 1239px 600px)`, opacity: lerp(fl, [-12, -6], [0, 1]) };
    },
  },
  { c: P7, d: 100 },
];
export const TAZA_FRAMES = PLANOS.reduce((a, p) => a + p.d, 0); // 610

// T2: la manga del brazo pasa pegada a la lente (desenfocada) y esconde el corte P2→P3 en 165
const Barrido: React.FC = () => {
  const f = useCurrentFrame(); // 0-18, tapa todo alrededor del 9
  const x = interpolate(f, [0, 18], [2500, -3300], { easing: Easing.inOut(Easing.sin) });
  return (
    <AbsoluteFill style={{ filter: "blur(28px)" }}>
      <Svg>
        <defs>
          <linearGradient id="mangaSombra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0.55} /><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.6} /></linearGradient>
        </defs>
        <g transform={`translate(${x},0) rotate(-6 960 540)`}>
          <rect x={0} y={-500} width={3000} height={2100} rx={600} fill={C.teal} />
          <rect x={0} y={-500} width={3000} height={2100} rx={600} fill="url(#mangaSombra)" />
          <ellipse cx={120} cy={520} rx={420} ry={700} fill={C.negro} />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

const CapaEntrada: React.FC<{ entra: number; capa?: (fl: number) => React.CSSProperties; children: React.ReactNode }> = ({ entra, capa, children }) => {
  const fl = useF();
  const st = capa && fl < entra + 2 ? capa(fl) : {};
  return <AbsoluteFill style={st}>{children}</AbsoluteFill>;
};

export const TazaNueve: React.FC<{ sonido?: boolean }> = ({ sonido = true }) => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {PLANOS.map(({ c: P, d, entra = 0, sale = 0, capa }, i) => {
        const from = t;
        t += d;
        return (
          <Sequence key={i} from={from - entra} durationInFrames={entra + d + sale}>
            <OffsetCtx.Provider value={entra}>
              <CapaEntrada entra={entra} capa={capa}><P /></CapaEntrada>
            </OffsetCtx.Provider>
          </Sequence>
        );
      })}
      <Sequence from={156} durationInFrames={18}><Barrido /></Sequence>
      <Franjas />
      {sonido && <Sonidos />}
    </AbsoluteFill>
  );
};
