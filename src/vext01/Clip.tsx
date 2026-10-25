// vext01 — prueba de 12 s del estilo "Versión Extrema": stickmen de cabeza negra con luz de borde,
// cuartos en penumbra con rayos de luz, primerísimos planos de cara y gráficos que brillan.
// TODO en código (SVG + Remotion), cero imágenes generadas.
import React from "react";
import { AbsoluteFill, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Baloo2";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
export const CLIP_FRAMES = 360;

// interpolate que no revienta con planos cortos (rango no estrictamente creciente en el farm)
const lerp = (f: number, a: number[], b: number[], ease = Easing.inOut(Easing.cubic)) => {
  const r = a.map((v, i) => (i > 0 && v <= a[i - 1] ? a[i - 1] + 0.001 * i : v));
  return interpolate(f, r, b, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
};

const NOCHE = { pared: "#1a2136", pared2: "#10152a", piso: "#0c1020", luz: "#9fc4ff", borde: "#7fb0ff" };
const ORO = "#f4c35a";
const TEAL = "#2bb3a3";

// ── piezas comunes ─────────────────────────────────────────────────────────
const Polvo: React.FC<{ n?: number; color?: string; seed?: string }> = ({ n = 46, color = "#cfe0ff", seed = "p" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        {Array.from({ length: n }).map((_, i) => {
          const x = random(seed + "x" + i) * 1920 + Math.sin((f + i * 37) / 60) * 18;
          const y = ((random(seed + "y" + i) * 1080 - f * (0.25 + random(seed + "v" + i) * 0.5)) % 1080 + 1080) % 1080;
          const r = 1 + random(seed + "r" + i) * 2.4;
          const o = 0.15 + 0.45 * Math.abs(Math.sin((f + i * 13) / 40));
          return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={o} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Vineta: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.62) 100%)", pointerEvents: "none" }} />
);

// franjas negras de cine arriba y abajo (la ref las tiene en todo el video)
const Franjas: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 58, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 58, background: "#000" }} />
  </AbsoluteFill>
);

const Chapita: React.FC<{ texto: string; desde?: number }> = ({ texto, desde = 6 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - desde, fps, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", top: 92, right: 110, fontFamily, fontWeight: 800, fontSize: 46, color: ORO, letterSpacing: 2,
      opacity: s, transform: `translateY(${(1 - s) * -16}px)`, textShadow: "0 0 18px rgba(244,195,90,0.55)" }}>{texto}</div>
  );
};

// ── stickman de cuerpo entero ───────────────────────────────────────────────
type Pose = "sentado" | "parado";
const Stickman: React.FC<{ x: number; y: number; s?: number; pose: Pose; paso?: number; caida?: number; mira?: number; ojos?: number; borde?: string; remera?: string }> = ({
  x, y, s = 1, pose, paso = 0, caida = 0, mira = 0, ojos = 1, borde = NOCHE.borde, remera = TEAL,
}) => {
  // origen = cadera; y negativo = arriba. caida 0..1 = cansancio (se encorva, cabeza baja)
  const cuello = { x: 6 + caida * 16, y: -72 + caida * 8 };
  const cabeza = { x: cuello.x + 4 + caida * 8, y: cuello.y - 30 + caida * 6 };
  const hombro = { x: cuello.x - 2, y: cuello.y + 8 };
  let piernas: string, brazos: string;
  if (pose === "sentado") {
    piernas = `M0 0 L48 2 L52 64 M0 0 L44 6 L42 66`;
    brazos = `M${hombro.x} ${hombro.y} L${hombro.x + 16} ${hombro.y + 32} L40 -4`;
  } else {
    const a = Math.sin(paso) * 18;
    piernas = `M0 0 L${a * 0.5} 40 L${a} 82 M0 0 L${-a * 0.5} 40 L${-a} 82`;
    brazos = `M${hombro.x} ${hombro.y} L${hombro.x - a * 0.6} ${hombro.y + 34} L${hombro.x - a} ${hombro.y + 64 - caida * 6} M${hombro.x} ${hombro.y} L${hombro.x + a * 0.6} ${hombro.y + 34} L${hombro.x + a} ${hombro.y + 64 - caida * 6}`;
  }
  const tronco = `M0 0 Q${cuello.x * 0.3 + caida * 10} ${cuello.y * 0.5} ${cuello.x} ${cuello.y}`;
  const Trazo: React.FC<{ d: string }> = ({ d }) => (
    <>
      <path d={d} stroke={borde} strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(-2.5,-1)" opacity={0.85} />
      <path d={d} stroke="#050608" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Trazo d={piernas} />
      {/* buzo */}
      <path d={`M-9 2 L${cuello.x - 10} ${cuello.y + 6} Q${cuello.x} ${cuello.y - 2} ${cuello.x + 12} ${cuello.y + 6} L12 2 Z`} fill={remera} stroke={borde} strokeWidth={2} />
      <Trazo d={tronco} />
      <Trazo d={brazos} />
      <circle cx={cabeza.x - 2.5} cy={cabeza.y - 1} r={25} fill={borde} opacity={0.9} />
      <circle cx={cabeza.x} cy={cabeza.y} r={24} fill="#050608" />
      <g opacity={ojos}>
        <ellipse cx={cabeza.x + 6 + mira * 6} cy={cabeza.y - 3} rx={3.4} ry={4.4 - caida * 2} fill="#f2efe6" />
        <ellipse cx={cabeza.x + 17 + mira * 6} cy={cabeza.y - 3} rx={3.4} ry={4.4 - caida * 2} fill="#f2efe6" />
      </g>
    </g>
  );
};

// ── rayo de luz volumétrico ─────────────────────────────────────────────────
const Rayo: React.FC<{ pts: string; color: string; o?: number; id: string }> = ({ pts, color, o = 0.35, id }) => {
  const f = useCurrentFrame();
  const fl = o * (0.85 + 0.15 * Math.sin(f / 9) * Math.sin(f / 23));
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={fl} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <filter id={id + "b"}><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <polygon points={pts} fill={`url(#${id})`} filter={`url(#${id}b)`} />
    </g>
  );
};

// ── TOMA 1: cuarto de noche, el tipo sentado en la cama sin poder dormir ──────
const Cuarto: React.FC<{ conGente?: boolean }> = ({ conGente = true }) => {
  const f = useCurrentFrame();
  const ang = (f / 30) * 6; // minutero que avanza
  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <defs>
        <linearGradient id="pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={NOCHE.pared2} /><stop offset="1" stopColor={NOCHE.pared} /></linearGradient>
        <radialGradient id="luna" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff" /><stop offset="0.35" stopColor="#dfeaff" /><stop offset="1" stopColor="#dfeaff" stopOpacity={0} /></radialGradient>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0d1a3d" /><stop offset="1" stopColor="#24386b" /></linearGradient>
        <radialGradient id="charco" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={NOCHE.luz} stopOpacity={0.35} /><stop offset="1" stopColor={NOCHE.luz} stopOpacity={0} /></radialGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#pared)" />
      <rect y="820" width="1920" height="260" fill={NOCHE.piso} />
      <rect y="816" width="1920" height="8" fill="#232c47" />
      {/* ventana */}
      <g transform="translate(220,200)">
        <rect x="-26" y="-20" width="472" height="430" fill="#2a1c22" rx="6" />
        <rect width="420" height="390" fill="url(#cielo)" />
        {Array.from({ length: 18 }).map((_, i) => (
          <circle key={i} cx={random("ex" + i) * 420} cy={random("ey" + i) * 260} r={1 + random("er" + i) * 1.8} fill="#fff" opacity={0.4 + 0.6 * Math.abs(Math.sin((f + i * 20) / 25))} />
        ))}
        <circle cx="300" cy="100" r="120" fill="url(#luna)" opacity={0.55} />
        <circle cx="300" cy="100" r="38" fill="#f4f7ff" />
        {/* edificios lejanos */}
        <path d="M0 390 V300 H50 V270 H95 V320 H140 V250 H200 V310 H250 V280 H310 V330 H360 V290 H420 V390 Z" fill="#0a1124" />
        {[[60, 290], [160, 270], [215, 330], [330, 345], [380, 305]].map(([wx, wy], i) => (
          <rect key={i} x={wx} y={wy} width="8" height="10" fill="#ffd27a" opacity={0.7} />
        ))}
        <rect x="205" width="12" height="390" fill="#2a1c22" />
        <rect y="190" width="420" height="12" fill="#2a1c22" />
        <rect x="-50" y="-30" width="34" height="470" fill="#3b2a52" rx="4" />
        <rect x="436" y="-30" width="34" height="470" fill="#3b2a52" rx="4" />
      </g>
      {/* reloj de pared */}
      <g transform="translate(1380,260)">
        <circle r="58" fill="#e9e2d0" stroke="#3a3348" strokeWidth="9" />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x="-2" y="-50" width="4" height="9" fill="#3a3348" transform={`rotate(${i * 30})`} />
        ))}
        <rect x="-3" y="-30" width="6" height="34" fill="#20182b" rx="3" transform="rotate(90)" />
        <rect x="-2" y="-44" width="4" height="48" fill="#20182b" rx="2" transform={`rotate(${ang})`} />
        <circle r="5" fill="#d1494a" />
      </g>
      {/* mesita con lámpara apagada */}
      <g transform="translate(1500,640)">
        <rect x="-70" y="0" width="140" height="180" fill="#2b2238" rx="6" />
        <rect x="-60" y="60" width="120" height="6" fill="#3d3150" />
        <rect x="-6" y="-90" width="12" height="90" fill="#463a58" />
        <path d="M-50 -90 L50 -90 L32 -160 L-32 -160 Z" fill="#544468" />
        {/* celular brillando */}
        <rect x="18" y="-10" width="34" height="10" rx="3" fill="#9fd7ff" opacity={0.75 + 0.25 * Math.sin(f / 6)} />
      </g>
      {/* cama */}
      <g transform="translate(760,560)">
        <rect x="-40" y="-120" width="40" height="330" fill="#3a2a40" rx="8" />
        <rect x="0" y="120" width="620" height="90" fill="#33263c" rx="10" />
        <rect x="0" y="70" width="620" height="60" fill="#d9d4e6" rx="16" />
        <rect x="20" y="30" width="150" height="56" fill="#efeaf7" rx="22" />
        <path d="M170 70 Q330 40 620 76 L620 130 L170 130 Z" fill="#5b4a8a" />
        <rect x="580" y="-30" width="40" height="240" fill="#3a2a40" rx="8" />
        <rect x="10" y="200" width="22" height="60" fill="#2a1f30" />
        <rect x="590" y="200" width="22" height="60" fill="#2a1f30" />
      </g>
      {/* luz de la ventana sobre el piso y la cama */}
      <ellipse cx="1020" cy="860" rx="420" ry="70" fill="url(#charco)" />
      <Rayo id="r1" pts="440,210 640,210 1380,880 820,900" color={NOCHE.luz} o={0.42} />
      <Rayo id="r2" pts="560,230 620,230 1180,880 1000,880" color="#ffffff" o={0.18} />
      {conGente && <Stickman x={1160} y={630} s={2.35} pose="sentado" caida={0.15} mira={Math.sin(f / 18) > 0.6 ? -1 : 0.3} />}
    </svg>
  );
};

const Toma1: React.FC = () => {
  const f = useCurrentFrame();
  const z = lerp(f, [0, 96], [1, 1.09], Easing.out(Easing.quad));
  return (
    <AbsoluteFill style={{ background: NOCHE.pared2 }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "62% 55%" }}><Cuarto /></AbsoluteFill>
      <Polvo seed="t1" />
      <Vineta />
      <Chapita texto="DÍA 1 · 3:00 AM" />
    </AbsoluteFill>
  );
};

// ── TOMA 2: primerísimo plano, pelea contra el sueño ─────────────────────────
const Cara: React.FC<{ parpado: number; ojeras: number; anillos: number; borde: string; boca: "cansada" | "sorpresa" }> = ({ parpado, ojeras, anillos, borde, boca }) => {
  const R = 300;
  const Ojo: React.FC<{ cx: number }> = ({ cx }) => {
    const h = 58, w = 44;
    const id = "ojo" + cx;
    return (
      <g>
        <defs><clipPath id={id}><ellipse cx={cx} cy={-40} rx={w} ry={h} /></clipPath></defs>
        <ellipse cx={cx} cy={-40} rx={w} ry={h} fill="#f3efe4" />
        <g clipPath={`url(#${id})`}>
          {/* venitas rojas */}
          <path d={`M${cx - w} -40 q14 -6 26 2 M${cx + w} -30 q-16 -4 -24 6 M${cx - w + 6} -10 q12 -8 22 -2`} stroke="#d0504a" strokeWidth={2.5} fill="none" opacity={ojeras} />
          <circle cx={cx + 4} cy={-34} r={22} fill="#141018" />
          <circle cx={cx + 12} cy={-44} r={7} fill="#9cc7ff" />
          {/* párpado que baja */}
          <rect x={cx - w - 4} y={-40 - h - 4} width={w * 2 + 8} height={(h * 2 + 8) * parpado} fill="#050608" />
          <rect x={cx - w - 4} y={-40 - h - 4 + (h * 2 + 8) * parpado - 6} width={w * 2 + 8} height={6} fill="#26222e" opacity={parpado > 0.05 ? 1 : 0} />
        </g>
        {/* ojeras */}
        <path d={`M${cx - w + 4} ${-40 + h + 14} Q${cx} ${-40 + h + 40} ${cx + w - 4} ${-40 + h + 14}`} stroke="#6c4fa8" strokeWidth={9} fill="none" strokeLinecap="round" opacity={ojeras * 0.9} />
      </g>
    );
  };
  return (
    <g>
      {[1, 2, 3].map((k) => (
        <circle key={k} r={R + 24 * k + anillos * 40 * k} fill="none" stroke={borde} strokeWidth={2} opacity={(0.22 / k) * (0.4 + anillos)} />
      ))}
      <path d={`M-480 ${R + 260} Q-460 ${R - 10} 0 ${R - 20} Q460 ${R - 10} 480 ${R + 260} Z`} fill={TEAL} />
      <defs>
        <radialGradient id="cabeza" cx="0.42" cy="0.38" r="0.7"><stop offset="0" stopColor="#14141c" /><stop offset="1" stopColor="#030305" /></radialGradient>
      </defs>
      <circle r={R} fill="url(#cabeza)" />
      <circle r={R} fill="none" stroke={borde} strokeWidth={9} style={{ filter: `drop-shadow(0 0 14px ${borde})` }} />
      <Ojo cx={-105} />
      <Ojo cx={105} />
      {boca === "cansada" ? (
        <path d="M-70 130 q18 -14 35 0 t35 0 t35 0 t35 0" stroke="#f3efe4" strokeWidth={12} fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx={0} cy={140} rx={26} ry={34} fill="none" stroke="#f3efe4" strokeWidth={12} />
      )}
    </g>
  );
};

const Toma2: React.FC = () => {
  const f = useCurrentFrame();
  // los párpados se caen despacio y a los 46 cuadros se abren de golpe (se despierta)
  const cae = lerp(f, [0, 40], [0.1, 0.78], Easing.in(Easing.quad));
  const abre = f >= 46 ? lerp(f, [46, 50], [0.78, 0], Easing.out(Easing.back(2))) : cae;
  const parpado = f >= 40 && f < 46 ? 0.78 + Math.sin(f) * 0.04 : abre;
  const anillos = f >= 46 ? lerp(f, [46, 70], [1, 0], Easing.out(Easing.cubic)) : 0;
  const temblor = f >= 46 && f < 56 ? Math.sin(f * 3.1) * 6 : 0;
  const z = lerp(f, [0, 78], [1, 1.06]);
  return (
    <AbsoluteFill style={{ background: NOCHE.pared2 }}>
      <AbsoluteFill style={{ filter: "blur(16px) brightness(0.8)", transform: "scale(1.7)", transformOrigin: "65% 45%" }}><Cuarto conGente={false} /></AbsoluteFill>
      <AbsoluteFill>
        <svg width="100%" height="100%" viewBox="0 0 1920 1080">
          <g transform={`translate(${1010 + temblor},${600}) scale(${z})`}>
            <Cara parpado={parpado} ojeras={lerp(f, [0, 40], [0.25, 1])} anillos={anillos} borde={NOCHE.borde} boca={f >= 46 ? "sorpresa" : "cansada"} />
          </g>
        </svg>
      </AbsoluteFill>
      <Polvo seed="t2" n={30} />
      <Vineta />
    </AbsoluteFill>
  );
};

// ── TOMA 3: regla del tiempo, las horas sin dormir se acumulan ───────────────
const Toma3: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = 90;
  const p = lerp(f, [8, D - 10], [0, 1], Easing.inOut(Easing.quad));
  const horas = Math.round(p * 72);
  const X0 = 300, X1 = 1620, Y = 640;
  const xd = X0 + (X1 - X0) * p;
  const pop = spring({ frame: f - 4, fps, config: { damping: 12 } });
  const marcas = [0, 24, 48, 72];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #17213f 0%, #0a0f22 70%)" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="brillo"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="hecho" x1="0" x2="1"><stop offset="0" stopColor="#c98a2a" /><stop offset="1" stopColor={ORO} /></linearGradient>
        </defs>
        {/* regla */}
        <rect x={X0} y={Y - 3} width={X1 - X0} height={6} fill="#56658f" rx={3} />
        <rect x={X0} y={Y - 4} width={xd - X0} height={8} fill="url(#hecho)" rx={4} filter="url(#brillo)" />
        {Array.from({ length: 25 }).map((_, i) => {
          const x = X0 + ((X1 - X0) * i) / 24;
          const grande = i % 8 === 0;
          return <rect key={i} x={x - 1.5} y={Y + 10} width={3} height={grande ? 26 : 12} fill={x <= xd ? ORO : "#56658f"} />;
        })}
        {marcas.map((h, i) => {
          const x = X0 + ((X1 - X0) * h) / 72;
          const on = horas >= h;
          const s = spring({ frame: f - (8 + (D - 18) * (h / 72)), fps, config: { damping: 10 } });
          return (
            <g key={h} transform={`translate(${x},${Y + 80})`}>
              <text textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill={on ? ORO : "#56658f"}>{h} h</text>
              {i > 0 && (
                <g transform={`translate(0,-190) scale(${on ? s : 0})`}>
                  {/* lunita: una noche sin dormir */}
                  <circle r={24} fill="#f4f0dc" />
                  <circle cx={11} cy={-8} r={21} fill="#17213f" />
                </g>
              )}
            </g>
          );
        })}
        {/* diamante dorado que viaja */}
        <g transform={`translate(${xd},${Y}) rotate(45)`} filter="url(#brillo)">
          <rect x={-13} y={-13} width={26} height={26} fill={ORO} />
        </g>
        {/* el tipo camina arriba de la regla y se va encorvando */}
        <Stickman x={xd - 6} y={Y - 92} s={1.05} pose="parado" paso={f / 3.2} caida={p * 0.9} borde="#7fb0ff" />
        {/* contador grande */}
        <g transform={`translate(960,330) scale(${0.85 + 0.15 * pop})`} opacity={pop}>
          <text textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={150} fill={ORO} filter="url(#brillo)">{horas} HORAS</text>
          <text y={70} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill="#c9d6ff" opacity={0.85}>SIN DORMIR</text>
        </g>
      </svg>
      <Polvo seed="t3" n={36} color={ORO} />
      <Vineta />
    </AbsoluteFill>
  );
};

// ── TOMA 4: el cerebro dentro de la cabeza se va apagando ────────────────────
const NODOS = Array.from({ length: 30 }).map((_, i) => {
  const a = random("na" + i) * Math.PI * 2;
  const r = Math.sqrt(random("nr" + i));
  return { x: Math.cos(a) * r * 225, y: Math.sin(a) * r * 145, orden: random("no" + i) };
});
// contorno de cerebro (dos hemisferios con circunvoluciones), centrado en 0,0
const CEREBRO = "M0 -150 C-60 -175 -150 -165 -205 -110 C-260 -60 -255 30 -215 85 C-180 140 -100 165 -30 150 C-10 146 0 140 0 140 C0 140 10 146 30 150 C100 165 180 140 215 85 C255 30 260 -60 205 -110 C150 -165 60 -175 0 -150 Z";
const SURCOS = "M0 -150 C-20 -60 20 40 0 140 M-140 -110 C-100 -80 -150 -30 -100 0 M-200 20 C-150 30 -130 80 -80 90 M140 -110 C100 -80 150 -30 100 0 M200 20 C150 30 130 80 80 90";
const LINKS: [number, number][] = [];
NODOS.forEach((n, i) => {
  NODOS.map((m, j) => ({ j, d: Math.hypot(n.x - m.x, n.y - m.y) }))
    .filter((o) => o.j > i).sort((a, b) => a.d - b.d).slice(0, 2).forEach((o) => LINKS.push([i, o.j]));
});

const Toma4: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const z = lerp(f, [0, 96], [1, 1.12], Easing.out(Easing.quad));
  const apagado = lerp(f, [14, 84], [0, 1], Easing.in(Easing.quad)); // fracción de nodos apagados
  const palabras = ["TU", "CEREBRO", "EMPIEZA", "A", "APAGARSE"];
  const colorNodo = (n: { orden: number }) => {
    const off = n.orden < apagado;
    const parpadeo = Math.abs(n.orden - apagado) < 0.08 ? (Math.sin(f * 2.3 + n.orden * 50) > 0 ? 1 : 0.3) : 1;
    return { c: off ? "#c2453f" : ORO, o: (off ? 0.55 : 1) * parpadeo };
  };
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #142041 0%, #070b18 75%)" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 58%" }}>
        <svg width="100%" height="100%" viewBox="0 0 1920 1080">
          <defs>
            <filter id="glow4"><feGaussianBlur stdDeviation="8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          {/* silueta de cabeza y hombros, sólo el contorno luminoso */}
          <g transform="translate(960,600)" fill="none" stroke="#8fb7ff" strokeWidth={5} filter="url(#glow4)" opacity={0.9}>
            <circle r={300} />
            <path d="M-120 290 L-120 360 Q-330 380 -420 520 M120 290 L120 360 Q330 380 420 520" />
          </g>
          <g transform="translate(960,575)">
            <path d={CEREBRO} fill={apagado > 0.6 ? "#2a0f16" : "#2b2210"} stroke={apagado > 0.6 ? "#c2453f" : ORO} strokeWidth={4} opacity={0.75} filter="url(#glow4)" />
            <path d={SURCOS} fill="none" stroke={apagado > 0.6 ? "#c2453f" : ORO} strokeWidth={3} opacity={0.35} />
            {LINKS.map(([a, b], i) => {
              const A = NODOS[a], B = NODOS[b];
              const off = A.orden < apagado || B.orden < apagado;
              return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={off ? "#5a2a33" : ORO} strokeWidth={3} opacity={off ? 0.35 : 0.65} />;
            })}
            {NODOS.map((n, i) => {
              const { c, o } = colorNodo(n);
              return <circle key={i} cx={n.x} cy={n.y} r={9} fill={c} opacity={o} filter="url(#glow4)" />;
            })}
          </g>
        </svg>
      </AbsoluteFill>
      {/* título palabra por palabra */}
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily, fontWeight: 800, fontSize: 84, letterSpacing: 2 }}>
        {palabras.map((w, i) => {
          const s = spring({ frame: f - 6 - i * 6, fps, config: { damping: 11 } });
          const rojo = w === "APAGARSE";
          return (
            <span key={i} style={{ display: "inline-block", margin: "0 14px", opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${0.8 + 0.2 * s})`,
              color: rojo ? "#ff5a4f" : "#f4f0e2", textShadow: rojo ? "0 0 24px rgba(255,90,79,0.6)" : "0 0 18px rgba(160,190,255,0.35)" }}>{w}</span>
          );
        })}
      </div>
      <Polvo seed="t4" n={34} />
      <Vineta />
    </AbsoluteFill>
  );
};

// ── montaje: cortes secos cada ~3 s, como la referencia ─────────────────────
export const TOMAS = [
  { c: Toma1, d: 96 },
  { c: Toma2, d: 78 },
  { c: Toma3, d: 90 },
  { c: Toma4, d: 96 },
];

export const Clip: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {TOMAS.map(({ c: C, d }, i) => {
        const from = t;
        t += d;
        return (
          <Sequence key={i} from={from} durationInFrames={d}>
            <C />
          </Sequence>
        );
      })}
      <Franjas />
    </AbsoluteFill>
  );
};
