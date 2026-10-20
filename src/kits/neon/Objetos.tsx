// nx-objeto-neon — cada concepto = UN objeto con luz propia que entra EXACTO con la palabra, colgado de un hilo de
// luz del objeto anterior (nadie aparece de la nada). Formas vectoriales incluidas (cerebro de cristal, tragamonedas,
// bombilla, reloj, corazón, ojo, candado) o `img` = recorte PNG de cualquier objeto (gpt/agnes) con brillo propio.
import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { BlurDef, Hilo, NeonPath, SANS, balanceo, clamp, easeOut, neonOn, pop, ramp, respira, rnd, useSvgId, useT, vis } from "./base";

const src = (p: string) => (p.startsWith("http") ? p : staticFile(p));
type P2 = [number, number];
export type G = { t: number; t0: number; on: number; activo?: number; color: string };

// ───────── cerebro de cristal (vista lateral): contorno + circunvoluciones + neuronas que titilan ─────────
const CEREBRO_OUT = "M40,100 C26,84 28,54 50,40 C64,22 92,14 118,18 C142,10 176,16 196,34 C216,46 228,70 222,94 C220,110 210,120 196,124 C186,128 176,126 168,124 C160,134 146,140 130,138 C112,142 92,138 80,128 C64,126 48,118 40,100 Z";
const CEREBELO = "M168,124 C186,120 208,126 207,140 C205,155 184,159 170,151 C161,146 159,132 168,124 Z";
const TRONCO = "M146,134 C150,150 148,162 154,176 M160,136 C160,150 162,162 168,176";
const CEREBRO_IN = [
  "M52,62 C62,52 76,62 68,74 C60,86 74,94 86,84 C96,76 108,86 104,96", // 0-2: las largas (por acá corre la sinapsis)
  "M146,30 C158,40 146,52 160,56 C174,60 168,74 182,74 C194,74 196,86 208,86",
  "M98,124 C110,114 122,126 136,118 C146,112 152,124 164,118",
  "M84,118 C104,100 128,96 150,104 C160,108 170,102 178,94", // cisura lateral
  "M132,22 C124,40 140,52 128,70 C120,84 134,92 126,104", // surco central
  "M70,40 C82,32 92,46 84,56 C78,66 92,72 102,62",
  "M96,26 C106,34 96,44 108,48 C118,52 112,64 122,68",
  "M176,40 C188,48 182,60 198,62",
  "M144,72 C156,66 160,82 172,78",
  "M190,100 C200,94 208,104 216,96",
  "M50,96 C60,86 70,98 80,92",
  "M172,132 C184,128 196,130 205,134", "M169,140 C182,136 196,138 205,142", "M172,148 C184,146 194,148 200,150", // cerebelo
];
export const Cerebro: React.FC<G> = ({ t, t0, on }) => {
  const b = useSvgId("cb"), gr = useSvgId("cg");
  const neur = Array.from({ length: 30 }, (_, i) => [56 + rnd(i, 1) * 150, 36 + rnd(i, 2) * 96] as P2).filter(([x, y]) => ((x - 128) / 92) ** 2 + ((y - 82) / 56) ** 2 < 1);
  return (
    <svg viewBox="0 0 240 180" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <BlurDef id={b} s={3.2} />
        <radialGradient id={gr} cx="45%" cy="40%" r="60%"><stop offset="0" stopColor="#fff" stopOpacity={0.38} /><stop offset="0.6" stopColor="#dfe8ff" stopOpacity={0.12} /><stop offset="1" stopColor="#fff" stopOpacity={0.04} /></radialGradient>
      </defs>
      <path d={CEREBRO_OUT} fill={`url(#${gr})`} opacity={on} />
      <path d={CEREBELO} fill={`url(#${gr})`} opacity={on} />
      <NeonPath d={TRONCO} color="#e6eeff" ancho={1.2} on={on * 0.8} blurId={b} halo={0.5} />
      <NeonPath d={CEREBELO} color="#e6eeff" ancho={1.3} on={on} blurId={b} />
      <NeonPath d={CEREBRO_OUT} color="#e6eeff" ancho={1.6} on={on} blurId={b} />
      {CEREBRO_IN.map((d, i) => (
        <NeonPath key={i} d={d} color="#e6eeff" ancho={0.95} on={on * neonOn(t, t0 + 0.04 * i)} k={ramp(t, t0 + 0.03 * i, 0.5, easeOut)} len={260} blurId={b} halo={0.6} />
      ))}
      {/* sinapsis: un destello corre por una circunvolución cada ~1,3 s */}
      {t > t0 + 0.6 && (() => {
        const ciclo = 1.3, n = Math.floor((t - t0) / ciclo), fase = ((t - t0) % ciclo) / ciclo;
        return <path d={CEREBRO_IN[n % 3]} fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" opacity={on * Math.sin(Math.PI * fase)} filter={`url(#${b})`} strokeDasharray="26 400" strokeDashoffset={-fase * 180} />;
      })()}
      {neur.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.4} fill="#fff" opacity={on * (0.25 + 0.75 * Math.max(0, Math.sin(t * 2.6 + i * 1.7)) ** 6)} />)}
    </svg>
  );
};

// ───────── tragamonedas: carcasa dorada, marquesina con bombitas, 3 rodillos que giran y frenan en 7-7-7 ─────────
const SIM_H = 26; // alto de un símbolo en el rodillo
const TIRAS = [[0, 1, 2, 3], [0, 3, 1, 2], [0, 2, 3, 1]]; // orden de símbolos de cada rodillo (el 0 = "7")
const Simbolo: React.FC<{ k: number; y: number }> = ({ k, y }) => {
  const s = k % 4;
  if (s === 0) return <text x={18} y={y + 9} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={24} fill="#d3122c">7</text>;
  if (s === 1) return <polygon transform={`translate(18,${y})`} points="0,-10 2.9,-3.1 10,-3.1 4.3,1.4 6.5,8.5 0,4.3 -6.5,8.5 -4.3,1.4 -10,-3.1 -2.9,-3.1" fill="#e9a400" />;
  if (s === 2) return <g transform={`translate(18,${y})`}><circle cx={-4} cy={4} r={5} fill="#c8102e" /><circle cx={5} cy={5} r={5} fill="#c8102e" /><path d="M-4,0 Q0,-10 6,-11 M5,1 Q3,-6 6,-11" stroke="#2f7a2f" strokeWidth={1.6} fill="none" /></g>;
  return <g transform={`translate(18,${y})`}><rect x={-13} y={-6} width={26} height={12} rx={2} fill="#111" /><text x={0} y={3.5} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={9} fill="#f4c24a">BAR</text></g>;
};
const Tragamonedas: React.FC<G> = ({ t, t0, on, activo }) => {
  const b = useSvgId("tb"), oro = useSvgId("to"), rod = useSvgId("tr"), mar = useSvgId("tm"), vb = useSvgId("tv");
  const ta = activo ?? t0 + 0.5;
  const fin = [ta + 1.0, ta + 1.25, ta + 1.5];
  const gano = t > fin[2];
  const palanca = interpolate(t, [ta - 0.05, ta + 0.12, ta + 0.5], [0, 1, 0], clamp);
  return (
    <svg viewBox="0 0 210 270" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <BlurDef id={b} s={6} />
        <filter id={vb} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="0 2.6" /></filter>
        <linearGradient id={oro} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3b2608" /><stop offset="0.18" stopColor="#b8862e" /><stop offset="0.42" stopColor="#ffe9a8" /><stop offset="0.6" stopColor="#d4a446" /><stop offset="0.85" stopColor="#6b4610" /><stop offset="1" stopColor="#2a1a05" /></linearGradient>
        <linearGradient id={rod} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8d8d8d" /><stop offset="0.25" stopColor="#f4f1ea" /><stop offset="0.75" stopColor="#f4f1ea" /><stop offset="1" stopColor="#8d8d8d" /></linearGradient>
        <linearGradient id={mar} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a0c14" /><stop offset="1" stopColor="#1c0306" /></linearGradient>
      </defs>
      {/* aura cálida (brilla más cuando gana) */}
      <ellipse cx={100} cy={140} rx={110} ry={130} fill="#ffcf70" opacity={on * (gano ? 0.22 + 0.1 * Math.sin(t * 14) : 0.1)} filter={`url(#${b})`} />
      <path d="M28,72 L28,42 Q28,10 100,10 Q172,10 172,42 L172,72 Z" fill={`url(#${mar})`} stroke={`url(#${oro})`} strokeWidth={4} />
      {Array.from({ length: 15 }).map((_, i) => {
        const an = Math.PI + (i / 14) * Math.PI, x = 100 + 66 * Math.cos(an), y = 44 + 28 * Math.sin(an);
        const lit = (Math.floor(t * (gano ? 16 : 6)) + i) % 3 === 0;
        return <circle key={i} cx={x} cy={y} r={3.2} fill={lit ? "#fff6d0" : "#7a5a20"} opacity={on} style={{ filter: lit ? "drop-shadow(0 0 3px #ffd36b)" : undefined }} />;
      })}
      <text x={100} y={58} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={17} fill="#ffd36b" opacity={on} letterSpacing={1}>777</text>
      <rect x={18} y={70} width={164} height={152} rx={9} fill={`url(#${oro})`} />
      <rect x={30} y={92} width={140} height={80} rx={7} fill="#0b0b0d" stroke="#2a1a05" strokeWidth={2} />
      {[0, 1, 2].map((i) => {
        // giro: desde `activo` hasta fin[i], frena con ease-out y queda exacto en el 7
        const vueltas = 9 + i * 3;
        const k = interpolate(t, [ta, fin[i]], [0, 1], { ...clamp, easing: easeOut });
        const off = (1 - k) * vueltas * 4 * SIM_H;
        const vel = t > ta && t < fin[i] ? 1 - k : 0;
        return (
          <g key={i} transform={`translate(${38 + i * 44},98)`}>
            <rect width={36} height={68} rx={3} fill={`url(#${rod})`} />
            <svg x={0} y={0} width={36} height={68} style={{ overflow: "hidden" }}>
              <g filter={vel > 0.15 ? `url(#${vb})` : undefined}>
                {[-2, -1, 0, 1, 2].map((j) => {
                  // la tira baja: al terminar (off = 0) queda el símbolo 0 (el 7) en el centro
                  const pos = off / SIM_H, idx = Math.floor(pos), frac = pos - idx;
                  return <Simbolo key={j} k={TIRAS[i][(((idx - j) % 4) + 4) % 4]} y={34 + (j + frac) * SIM_H} />;
                })}
              </g>
            </svg>
            <rect width={36} height={68} rx={3} fill="none" stroke="#000" strokeOpacity={0.35} />
          </g>
        );
      })}
      {gano && <rect x={30} y={92} width={140} height={80} rx={7} fill="#fff" opacity={interpolate(t, [fin[2], fin[2] + 0.08, fin[2] + 0.5], [0, 0.55, 0], clamp)} />}
      <rect x={40} y={182} width={120} height={14} rx={3} fill="#1a1206" stroke="#7a5a20" strokeWidth={1.5} />
      <rect x={26} y={222} width={148} height={20} rx={3} fill="#2a1a05" stroke={`url(#${oro})`} strokeWidth={3} />
      <rect x={14} y={242} width={172} height={18} rx={4} fill={`url(#${oro})`} />
      {/* palanca */}
      <g transform={`rotate(${palanca * 52} 192 150)`}>
        <rect x={188} y={92} width={8} height={60} rx={3} fill={`url(#${oro})`} />
        <circle cx={192} cy={88} r={11} fill="#d3122c" />
        <circle cx={188} cy={84} r={3.5} fill="#fff" opacity={0.7} />
      </g>
      <rect x={182} y={140} width={18} height={20} rx={4} fill={`url(#${oro})`} />
    </svg>
  );
};

// ───────── íconos de neón de una línea (para conceptos sueltos) ─────────
const ICONOS: Record<string, string[]> = {
  bombilla: ["M100,30 C60,30 44,62 52,90 C58,110 76,120 78,140 L122,140 C124,120 142,110 148,90 C156,62 140,30 100,30 Z", "M82,152 L118,152 M86,164 L114,164 M94,176 L106,176", "M90,140 L94,100 L100,108 L106,100 L110,140"],
  reloj: ["M100,30 A70,70 0 1 1 99.9,30 Z", "M100,100 L100,58", "M100,100 L134,118", "M100,22 L100,30 M100,170 L100,178 M22,100 L30,100 M170,100 L178,100"],
  corazon: ["M100,168 C40,124 26,90 40,64 C54,38 88,38 100,66 C112,38 146,38 160,64 C174,90 160,124 100,168 Z", "M58,100 L80,100 L90,80 L104,122 L114,96 L142,96"],
  ojo: ["M24,100 C60,50 140,50 176,100 C140,150 60,150 24,100 Z", "M100,100 m-26,0 a26,26 0 1 0 52,0 a26,26 0 1 0 -52,0", "M100,100 m-9,0 a9,9 0 1 0 18,0 a9,9 0 1 0 -18,0"],
  candado: ["M56,92 L144,92 L144,170 L56,170 Z", "M72,92 L72,64 C72,30 128,30 128,64 L128,92", "M100,118 L100,140"],
};
const Icono: React.FC<G & { forma: string }> = ({ t, t0, on, color, forma }) => {
  const b = useSvgId("ib");
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs><BlurDef id={b} s={5} /></defs>
      {ICONOS[forma].map((d, i) => <NeonPath key={i} d={d} color={color} ancho={3.4} on={on * neonOn(t, t0 + i * 0.08)} k={ramp(t, t0 + i * 0.08, 0.45, easeOut)} len={700} blurId={b} />)}
    </svg>
  );
};

export type Forma = "cerebro" | "tragamonedas" | "bombilla" | "reloj" | "corazon" | "ojo" | "candado";
const PROP: Record<Forma, number> = { cerebro: 0.75, tragamonedas: 1.29, bombilla: 1, reloj: 1, corazon: 1, ojo: 1, candado: 1 };

// ObjetoNeon: (x, y) = centro del objeto en el MUNDO. colgadoDe = punto del objeto anterior: el hilo se dibuja hasta
// la parte de arriba de este y RECIÉN AHÍ el objeto se enciende (t0 = la palabra). activo = la acción del objeto
// (tragamonedas: tira la palanca y giran los rodillos). etiqueta = palabra chica arriba ("Psicología").
export const ObjetoNeon: React.FC<{ x: number; y: number; t0: number; t1?: number; forma?: Forma; img?: string; prop?: number; tam?: number; etiqueta?: string; colgadoDe?: P2; sag?: number; color?: string; activo?: number; golpe?: number }> = ({ x, y, t0, t1 = Infinity, forma = "bombilla", img, prop, tam = 240, etiqueta, colgadoDe, sag = 0, color = "#ffffff", activo, golpe = 6 }) => {
  const t = useT();
  if (!vis(t, colgadoDe ? t0 - 0.45 : t0, t1)) return null;
  const h = tam * (prop ?? (img ? 1 : PROP[forma]));
  const on = neonOn(t, t0) * respira(t, x * 0.01, 0.05);
  const s = pop(t, t0, 11);
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const rot = balanceo(t, t0, golpe, x * 0.003);
  const g: G = { t, t0, on, activo, color };
  return (
    <>
      {colgadoDe && <Hilo a={colgadoDe} b={[x, y - h / 2 + 6]} t0={t0 - 0.42} t1={t1} dur={0.42} sag={sag} />}
      <div style={{ position: "absolute", left: x - tam / 2, top: y - h / 2, width: tam, height: h, transformOrigin: "50% 0%", transform: `rotate(${rot}deg) scale(${(0.82 + 0.18 * s) * (1 - sal * 0.3)})`, opacity: 1 - sal }}>
        <div style={{ position: "absolute", left: -tam * 0.35, top: -h * 0.35, width: tam * 1.7, height: h * 1.7, borderRadius: "50%", background: `radial-gradient(circle, ${color === "#ffffff" ? "rgba(220,230,255,.16)" : color + "2a"} 0%, transparent 62%)`, opacity: on }} />
        {img ? (
          <Img src={src(img)} style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.25 + 0.75 * on, filter: `drop-shadow(0 0 ${14 * on}px rgba(255,235,200,.45)) brightness(${0.6 + 0.4 * on})` }} />
        ) : forma === "cerebro" ? <Cerebro {...g} /> : forma === "tragamonedas" ? <Tragamonedas {...g} /> : <Icono {...g} forma={forma} />}
        {etiqueta && (
          <div style={{ position: "absolute", left: "50%", top: -46, transform: `translate(-50%,0) scale(${pop(t, t0 + 0.15, 12)})`, fontFamily: SANS, fontWeight: 800, fontSize: Math.max(26, tam * 0.13), color: "#fff", whiteSpace: "nowrap", letterSpacing: -0.4, textShadow: "0 0 12px rgba(255,255,255,.35)", opacity: t > t0 + 0.15 ? 1 : 0 }}>{etiqueta}</div>
        )}
      </div>
    </>
  );
};
// punta de arriba / abajo de un objeto (para colgar el siguiente)
export const bordeObjeto = (o: { x: number; y: number; tam?: number; forma?: Forma; prop?: number }, lado: "arriba" | "abajo") => {
  const h = (o.tam ?? 240) * (o.prop ?? PROP[o.forma ?? "bombilla"]);
  return [o.x, lado === "arriba" ? o.y - h / 2 : o.y + h / 2] as P2;
};
