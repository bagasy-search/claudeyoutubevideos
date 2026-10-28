// lc02 · vuelta 3 (v3h, 28-oct): piezas nuevas para P61-P80.
//  · PilaLena: leña partida de verdad (cuñas, mitades y rollizos con corteza, anillos y grieta; tamaño, tono y giro al azar).
//  · LenoLado: un leño visto de costado (para cargarlo con las dos manos).
//  · VaporLago: «sea smoke» del Lago Superior: columnas blancas que suben y se mecen sobre el agua oscura.
//  · BordeHielo: set propio del borde del hielo (plataforma de hielo con grietas, agua abierta negra que humea hasta el horizonte).
//  · MapaPuertoV3: puerto que se congela entero / lago que humea, con flecha FURTHER OUT y los dos chiquitos en la orilla.
//  · SilGus: la silueta de Gus (con el micrófono del escáner) y de Ore dentro de la ventana chiquita de Canal Park.
//  · RayasPared: 130 rayitas de tiza en la pared del living (el dato vive en el mundo).
//  · TarjetasReglas: las 3 reglas como 3 tarjetas grandes que se resaltan de a una (CTA).
import React from "react";
import { random } from "remotion";
import { Halo } from "../../anikit/luz";
import { Cielo } from "../../anikit/sets/comun";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { AMBAR } from "../elenco";
import { F_MONO } from "../hud";
import { NieveCae } from "../mundo/comun";

const R = (s: string) => random(`v3h${s}`);

// ------------------------------------------------------------------------------------------------ leña
const CORTEZA = ["#5a3822", "#4e3020", "#6a4428", "#5e3a26"];
const CARA = ["#d8b07a", "#c89a62", "#e2bf8c", "#cfa36c", "#bf8f58"];
const Pieza: React.FC<{ cx: number; cy: number; r: number; tipo: number; rot: number; s: string }> = ({ cx, cy, r, tipo, rot, s }) => {
  const cort = CORTEZA[Math.floor(R(`co${s}`) * CORTEZA.length)];
  const cara = CARA[Math.floor(R(`ca${s}`) * CARA.length)];
  const ri = r * 0.8;
  const anillo = "#a87a48";
  let borde: string, cuerpo: string, ox = 0, oy = 0;
  if (tipo === 0) {
    borde = `M${r},0 A${r},${r * 0.94} 0 1 1 ${-r},0 A${r},${r * 0.94} 0 1 1 ${r},0 Z`;
    cuerpo = `M${ri},0 A${ri},${ri * 0.94} 0 1 1 ${-ri},0 A${ri},${ri * 0.94} 0 1 1 ${ri},0 Z`;
  } else if (tipo === 1) {
    oy = -r * 0.42;
    borde = `M${r},0 A${r},${r} 0 0 1 ${-r},0 Z`;
    cuerpo = `M${ri},-2 A${ri},${ri} 0 0 1 ${-ri},-2 Z`;
  } else {
    ox = -r * 0.42; oy = -r * 0.42;
    borde = `M0,0 L${r},0 A${r},${r} 0 0 1 0,${r} Z`;
    cuerpo = `M3,3 L${ri + 2},3 A${ri},${ri} 0 0 1 3,${ri + 2} Z`;
  }
  return (
    <g transform={`translate(${cx},${cy}) rotate(${rot}) translate(${ox},${oy})`}>
      <path d={borde} fill={cort} />
      <path d={cuerpo} fill={cara} />
      {tipo === 0 ? [0.55, 0.3].map((q) => <ellipse key={q} cx={0} cy={0} rx={ri * q} ry={ri * q * 0.94} fill="none" stroke={anillo} strokeWidth={1.6} opacity={0.7} />)
        : tipo === 1 ? [0.55, 0.3].map((q) => <path key={q} d={`M${ri * q},-2 A${ri * q},${ri * q} 0 0 1 ${-ri * q},-2`} fill="none" stroke={anillo} strokeWidth={1.6} opacity={0.7} />)
          : [0.55, 0.3].map((q) => <path key={q} d={`M${3 + ri * q},3 A${ri * q},${ri * q} 0 0 1 3,${3 + ri * q}`} fill="none" stroke={anillo} strokeWidth={1.6} opacity={0.7} />)}
      {R(`gr${s}`) > 0.5 && <path d={`M0,${tipo === 1 ? 4 : 0} l${ri * 0.5},${ri * 0.35}`} stroke="#7a5230" strokeWidth={2} />}
    </g>
  );
};
// x = borde izquierdo, piso = apoyo. filas de piezas de r 20-34; `n` = tope de piezas por fila.
export const PilaLena: React.FC<{ x: number; piso: number; w?: number; filas?: number; seed?: string; n?: number; s?: number }> = ({ x, piso, w = 620, filas = 7, seed = "p", n = 99, s = 1 }) => {
  const piezas: React.ReactNode[] = [];
  for (let f = 0; f < filas; f++) {
    let cx = x + 26 * s + (f % 2) * 14 * s;
    const fila: React.ReactNode[] = [];
    let i = 0;
    const ancho = f === filas - 1 ? w * (0.55 + 0.35 * R(`fw${seed}${f}`)) : w;
    while (cx < x + ancho - 20 * s && i < n) {
      const k = `${seed}${f}_${i}`;
      const r = (21 + R(`r${k}`) * 13) * s;
      const tipo = R(`t${k}`) < 0.3 ? 0 : R(`t${k}`) < 0.7 ? 1 : 2;
      const rot = [0, 180, 90, -90][Math.floor(R(`o${k}`) * 4)] + (R(`j${k}`) - 0.5) * 34;
      const cy = piso - (25 + f * 47) * s - (R(`y${k}`) - 0.5) * 6 * s;
      fila.push(<Pieza key={k} cx={cx + r * 0.2} cy={cy} r={r} tipo={tipo} rot={rot} s={k} />);
      cx += r * 1.72 + R(`g${k}`) * 6 * s;
      i++;
    }
    piezas.push(<rect key={`s${f}`} x={x + 8 * s} y={piso - (48 + f * 47) * s} width={Math.min(ancho, cx - x) - 6 * s} height={46 * s} fill="#24160f" opacity={0.85} />);
    piezas.push(...fila);
  }
  return <g>{piezas}</g>;
};
// leño visto de costado (centro en 0,0; largo ~ 150·s). Corteza con vetas + cara clara en la punta.
export const LenoLado: React.FC<{ s?: number; rot?: number; seed?: string }> = ({ s = 1, rot = 0, seed = "l" }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <path d="M-76,-20 Q-80,0 -76,22 L70,24 L70,-22 Z" fill={CORTEZA[Math.floor(R(`lc${seed}`) * 4)]} />
    {[-10, 2, 13].map((y, i) => <path key={i} d={`M${-66 + i * 8},${y} q40,${-4 + i * 3} ${80 + i * 12},${2}`} stroke="#3a2416" strokeWidth={3} fill="none" opacity={0.8} />)}
    <path d="M-76,-20 L70,-22 L70,-8 L-74,-6 Z" fill="#c89a62" opacity={0.85} />
    <ellipse cx={70} cy={1} rx={13} ry={23} fill={CARA[Math.floor(R(`lf${seed}`) * 5)]} stroke="#4e3020" strokeWidth={4} />
    {[0.55, 0.28].map((q) => <ellipse key={q} cx={70} cy={1} rx={13 * q} ry={23 * q} fill="none" stroke="#a87a48" strokeWidth={1.6} />)}
  </g>
);

// ------------------------------------------------------------------------------------------------ vapor del lago
// columnas de «humo de mar»: base en y (agua), alto H, de x0 a x0+w. lejos = más chicas y finas.
export const VaporLago: React.FC<{ f: number; x0: number; w: number; y: number; n?: number; H?: number; o?: number; seed?: string; ancho?: number }> = ({ f, x0, w, y, n = 16, H = 260, o = 1, seed = "v", ancho = 1 }) => (
  <g opacity={o}>
    <defs>
      <linearGradient id={`v3hvap${seed}`} x1="0" x2="0" y1="1" y2="0">
        <stop offset="0" stopColor="#ffffff" stopOpacity={0.85} />
        <stop offset="0.45" stopColor="#f2f6ff" stopOpacity={0.45} />
        <stop offset="1" stopColor="#f2f6ff" stopOpacity={0} />
      </linearGradient>
    </defs>
    {Array.from({ length: n }).map((_, i) => {
      const k = `${seed}${i}`;
      const bx = x0 + ((R(`x${k}`) * w + f * (0.25 + R(`d${k}`) * 0.3)) % w);
      const h = H * (0.6 + R(`h${k}`) * 0.6) * (0.9 + 0.12 * Math.sin(f / 37 + i));
      const wb = (26 + R(`w${k}`) * 40) * ancho;
      const fase = R(`p${k}`) * 6.28;
      const N = 9;
      const izq: string[] = [], der: string[] = [];
      for (let q = 0; q <= N; q++) {
        const t = q / N;
        const sw = Math.sin(t * 3.2 + f / 24 + fase) * 22 * t * ancho + t * t * 40 * ancho;
        const ww = wb * (1 + t * 1.6) * (q === N ? 0.4 : 1);
        izq.push(`${(bx + sw - ww / 2).toFixed(1)},${(y - t * h).toFixed(1)}`);
        der.unshift(`${(bx + sw + ww / 2).toFixed(1)},${(y - t * h).toFixed(1)}`);
      }
      return <path key={i} d={`M${izq.join(" L")} L${der.join(" L")} Z`} fill={`url(#v3hvap${seed})`} />;
    })}
    {Array.from({ length: Math.round(n * 1.4) }).map((_, i) => {
      const k = `${seed}b${i}`;
      const t = (f / 90 + R(`t${k}`)) % 1;
      const bx = x0 + R(`x${k}`) * w + t * 30;
      return <ellipse key={`b${i}`} cx={bx} cy={y - t * H * 0.8} rx={(30 + 40 * t) * ancho} ry={(10 + 14 * t) * ancho} fill="#ffffff" opacity={0.35 * Math.sin(t * Math.PI)} />;
    })}
  </g>
);

// ------------------------------------------------------------------------------------------------ set: borde del hielo
export const BH_PISO = 900;
export const BordeHielo: React.FC<{ capa: string; f: number; vapor?: number; sol?: number }> = ({ capa, f, vapor = 1 }) => {
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={["#5f7da6", "#a9bad0", "#f0d9b8"]} />
        <Halo x={1500} y={470} r={520} color="#fff0cf" fuerza={0.55} />
        <circle cx={1500} cy={470} r={46} fill="#fff4dc" opacity={0.95} />
        <rect x={-2000} y={540} width={8000} height={800} fill="#2b4664" />
        <rect x={-2000} y={540} width={8000} height={6} fill="#c8d4e2" opacity={0.6} />
        {Array.from({ length: 24 }).map((_, i) => <rect key={i} x={-600 + R(`ls${i}`) * 3600 + Math.sin(f / 40 + i) * 8} y={552 + R(`ly${i}`) * 120} width={40 + R(`lw${i}`) * 110} height={3} rx={2} fill="#ffe6c0" opacity={0.35} />)}
        <VaporLago f={f} x0={-900} w={3800} y={556} n={30} H={110} o={vapor} seed="far" ancho={0.55} />
        <VaporLago f={f} x0={-900} w={3800} y={620} n={20} H={200} o={vapor} seed="mid" ancho={0.8} />
      </g>
    );
  }
  if (capa === "frente") return null;
  const P = BH_PISO;
  const borde = Array.from({ length: 34 }).map((_, i) => `L${-1500 + i * 180},${P - 70 + R(`be${i}`) * 34}`).join(" ");
  return (
    <g>
      {/* agua abierta cercana, negra, con vapor grande */}
      <rect x={-1500} y={680} width={6000} height={300} fill="#22394f" />
      {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={-800 + R(`ns${i}`) * 4000 + Math.sin(f / 30 + i) * 10} y={700 + R(`ny${i}`) * 90} width={60 + R(`nw${i}`) * 140} height={4} rx={2} fill="#ffe6c0" opacity={0.25} />)}
      <VaporLago f={f} x0={-800} w={4200} y={P - 60} n={16} H={360} o={vapor} seed="near" ancho={1.2} />
      {/* témpanos que se mecen en el agua */}
      {Array.from({ length: 7 }).map((_, i) => { const x = -400 + i * 560 + R(`tx${i}`) * 200, y = 760 + R(`ty${i}`) * 40 + Math.sin(f / 22 + i) * 3; return <path key={i} d={`M${x},${y} l${40 + R(`ta${i}`) * 40},-14 l${50 + R(`tb${i}`) * 40},6 l-12,14 Z`} fill="#e8eef6" stroke="#9fb4cc" strokeWidth={3} />; })}
      {/* la plataforma de hielo (borde dentado) */}
      <path d={`M-1500,${P - 60} ${borde} L4600,${P - 60} L4600,1600 L-1500,1600 Z`} fill="#e9eff6" />
      <path d={`M-1500,${P - 60} ${borde} L4600,${P - 60} L4600,${P - 30} L-1500,${P - 30} Z`} fill="#b9cbe0" opacity={0.85} />
      {Array.from({ length: 14 }).map((_, i) => { const x = -1200 + i * 380 + R(`gx${i}`) * 140; return <path key={i} d={`M${x},${P - 20} l${30 + R(`ga${i}`) * 40},${40 + R(`gb${i}`) * 50} l${-20 + R(`gc${i}`) * 60},${50}`} stroke="#a8bcd4" strokeWidth={3} fill="none" />; })}
      {Array.from({ length: 9 }).map((_, i) => { const x = -1100 + i * 600 + R(`cx${i}`) * 300; return <path key={i} d={`M${x},${P + 40} l26,-30 l34,8 l12,22 Z`} fill="#f6f9fc" stroke="#b9cbe0" strokeWidth={2} />; })}
    </g>
  );
};

// ------------------------------------------------------------------------------------------------ hielo que se amontona en la orilla
// placas de hielo que el agua empuja y se apilan (base en y, de x a x+w). p 0..1 = cuánto hielo hay.
export const HieloOrilla: React.FC<{ x: number; y: number; w: number; p: number; f: number; seed?: string }> = ({ x, y, w, p, f, seed = "h" }) => {
  const n = Math.round(w / 70);
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const k = `${seed}${i}`;
        const umbral = R(`u${k}`) * 0.8;
        const q = Math.max(0, Math.min(1, (p - umbral) / 0.2));
        if (q <= 0) return null;
        const bx = x + i * 70 + R(`x${k}`) * 30;
        const hh = (30 + R(`h${k}`) * 60) * q;
        const ww = 60 + R(`w${k}`) * 60;
        const rot = (R(`r${k}`) - 0.5) * 50 + Math.sin(f / 18 + i) * (1 - q) * 6;
        return (
          <g key={i} transform={`translate(${bx},${y + 6 - 8 * q}) rotate(${rot})`}>
            <path d={`M${-ww / 2},0 L${-ww / 2 + 8},${-hh} L${ww / 2 - 4},${-hh - 8} L${ww / 2},0 Z`} fill="#f2f6fb" stroke="#9fb6d0" strokeWidth={3} />
            <path d={`M${-ww / 2 + 8},${-hh} L${ww / 2 - 4},${-hh - 8} L${ww / 2 - 10},${-hh + 6} L${-ww / 2 + 12},${-hh + 10} Z`} fill="#c6d8ec" />
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------------------------------------ mapa del puerto (pantalla)
// puerto 0..1 = el agua del puerto se cubre de hielo desde la orilla · lago 0..1 = rótulos del lago · vap 0..1 = vapor
// flecha 0..1 = FURTHER OUT · zoom/cx/cy = cámara del mapa
export const MapaPuertoV3: React.FC<{ f: number; puerto: number; lago: number; vap: number; flecha: number; zoom: number; cx: number; cy: number; gente: number }> = ({ f, puerto, lago, vap, flecha, zoom, cx, cy, gente }) => {
  const agua = "#21486e";
  const fx = 470 + 1030 * flecha, fy = 700 - 300 * flecha;
  return (
    <g transform={`translate(960,540) scale(${zoom}) translate(${-cx},${-cy})`}>
      <rect x={-1400} y={-800} width={4400} height={2800} fill={agua} />
      {Array.from({ length: 34 }).map((_, i) => <rect key={`o${i}`} x={600 + ((i * 263) % 2000) + Math.sin(f / 30 + i) * 6} y={150 + ((i * 157) % 900)} width={50 + (i % 4) * 20} height={3} rx={2} fill="#6f9cc8" opacity={0.35} />)}
      {/* vapor sobre el lago abierto */}
      <g opacity={vap}>{Array.from({ length: 30 }).map((_, i) => { const xx = 640 + ((i * 263) % 1900), yy = 260 + ((i * 197) % 820), q = ((f / 45 + i * 0.37) % 1); return <path key={i} d={`M${xx},${yy} q-14,${-30 - q * 30} 6,${-60 - q * 50} q16,-30 -4,${-50 - q * 20}`} stroke="#ffffff" strokeWidth={10 + q * 10} strokeLinecap="round" fill="none" opacity={0.55 * Math.sin(q * Math.PI)} />; })}</g>
      {/* la costa de Duluth */}
      <path d="M-1400,-800 H760 Q600,0 540,240 Q480,420 380,560 Q250,760 -1400,900 Z" fill="#d9dfe6" />
      <path d="M-1400,-800 H760 Q600,0 540,240 Q480,420 380,560 Q250,760 -1400,900 Z" fill="none" stroke="#8a9aaa" strokeWidth={6} />
      {Array.from({ length: 22 }).map((_, i) => <rect key={`c${i}`} x={-300 + (i % 6) * 110 + (i > 11 ? 40 : 0)} y={-60 + Math.floor(i / 6) * 120} width={70} height={70} rx={6} fill="#b9c2cc" />)}
      <path d="M380,560 Q330,700 160,820 Q40,900 -1400,980 V2000 H-1400 Z" fill="#c9d2dc" />
      {/* el puerto: agua → hielo desde la orilla */}
      <path d="M-160,600 Q120,570 300,620 Q370,645 390,705 Q300,800 120,840 Q-80,870 -220,820 Z" fill={agua} />
      <clipPath id="v3hpuerto"><path d="M-160,600 Q120,570 300,620 Q370,645 390,705 Q300,800 120,840 Q-80,870 -220,820 Z" /></clipPath>
      <g clipPath="url(#v3hpuerto)">
        <circle cx={-220} cy={720} r={30 + 640 * puerto} fill="#eef3f9" />
        {puerto > 0.2 && [0, 1, 2, 3].map((i) => <path key={i} d={`M${-140 + i * 110},${640 + (i % 2) * 40} l60,40 l-20,60`} stroke="#b9cbe0" strokeWidth={4} fill="none" opacity={Math.min(1, (puerto - 0.2) * 3)} />)}
      </g>
      <path d="M300,612 Q450,560 560,470 L584,484 Q474,584 322,646 Z" fill="#c8b48a" />
      {/* borde de hielo pegado a la costa del lago (fino: casi nunca se congela entero) */}
      <path d={`M540,240 Q480,420 380,560 L${408 + 30 * lago},560 Q${510 + 30 * lago},420 ${570 + 30 * lago},240 Z`} fill="#eef3f9" opacity={0.95} />
      {/* flecha FURTHER OUT */}
      {flecha > 0.02 && <g>
        <path d={`M470,700 Q${800},${650} ${fx},${fy}`} stroke={AMBAR} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray="34 22" />
        <path d={`M${fx},${fy} l-46,-6 l26,40 Z`} fill={AMBAR} transform={`rotate(${-18} ${fx} ${fy})`} />
      </g>}
      {/* Theo y June chiquitos en la orilla */}
      <g opacity={gente} transform="translate(360,560)">
        {[[-30, "#c0352c", "#c0352c"], [12, "#2f7f86", "#16110e"]].map(([dx, cam, gorro], i) => <g key={i} transform={`translate(${dx},${Math.sin(f / 6 + i) * 1.5})`}><rect x={-9} y={-46} width={18} height={34} rx={6} fill={cam as string} /><circle cx={0} cy={-58} r={13} fill="#16110e" /><path d="M-13,-62 a13,13 0 0 1 26,0 Z" fill={gorro as string} /><rect x={-7} y={-14} width={5} height={16} fill="#2a2a32" /><rect x={2} y={-14} width={5} height={16} fill="#2a2a32" /></g>)}
      </g>
      <g fontFamily={F_HUD} fontWeight={600} textAnchor="middle">
        <text x={90} y={725} fontSize={46} fill="#1d3a5a" stroke="#eef3f9" strokeWidth={10} strokeLinejoin="round" paintOrder="stroke">HARBOR</text>
        <text x={90} y={772} fontSize={30} fill="#1d3a5a" stroke="#eef3f9" strokeWidth={8} strokeLinejoin="round" paintOrder="stroke" opacity={Math.max(0, Math.min(1, (puerto - 0.8) * 6))}>FROZEN SOLID</text>
        <text x={150} y={300} fontSize={46} fill="#3a3442">DULUTH</text>
        <g opacity={lago}>
          <text x={1350} y={820} fontSize={64} fill="#f6ecd2">LAKE SUPERIOR</text>
          <text x={1350} y={876} fontSize={36} fill="#9fd3ff">ALMOST NEVER FREEZES</text>
        </g>
        <text x={fx} y={fy - 44} fontSize={34} fill={AMBAR} opacity={flecha > 0.85 ? (flecha - 0.85) / 0.15 : 0}>FURTHER OUT</text>
      </g>
    </g>
  );
};

// ------------------------------------------------------------------------------------------------ Gus en su ventana chiquita
// ventana del EdificioGus (r=1, c=1): x 370..450, y 450..540 (mundo de CanalPark). habla 0..1 mueve la cabeza; mic 0..1 sube el micrófono.
export const SilGus: React.FC<{ f: number; o: number; mic: number; habla: number; perro: number }> = ({ f, o, mic, habla, perro }) => {
  if (o <= 0.01) return null;
  const c = "#2a1610";
  const bob = habla * Math.sin(f / 2.6) * 1.4;
  const hx = 398, hy = 482 + bob;
  const manoY = 528 - 34 * mic;
  return (
    <g opacity={o}>
      <clipPath id="v3hvg"><rect x={370} y={450} width={80} height={90} /></clipPath>
      <g clipPath="url(#v3hvg)">
        {/* lámpara de pie al fondo */}
        <path d="M444,470 l-8,-14 h16 Z" fill="#fff6d8" opacity={0.9} /><rect x={443} y={470} width={2} height={70} fill={c} opacity={0.6} />
        {/* Gus: hombros, cuello, cabeza con gorro y barba */}
        <path d={`M372,540 Q374,${506 + bob} 392,${500 + bob} H406 Q422,${504 + bob} 426,540 Z`} fill={c} />
        <circle cx={hx} cy={hy} r={13} fill={c} />
        <path d={`M${hx - 13},${hy - 3} a13,13 0 0 1 26,0 v-3 h-26 Z`} fill={c} /><rect x={hx - 14} y={hy - 9} width={28} height={6} rx={3} fill={c} />
        <path d={`M${hx - 9},${hy + 7} q9,${12 + habla * Math.abs(Math.sin(f / 2.6)) * 3} 18,0`} fill={c} />
        {/* brazo con el micrófono del escáner */}
        <path d={`M418,${520 + bob} Q${416},${manoY + 10} ${hx + 9},${manoY}`} stroke={c} strokeWidth={7} fill="none" strokeLinecap="round" />
        <rect x={hx + 4} y={manoY - 10} width={9} height={14} rx={3} fill={c} />
        <path d={`M${hx + 8},${manoY + 4} q-10,24 4,40`} stroke={c} strokeWidth={1.6} fill="none" />
        {/* Ore (cabeza y orejas) */}
        <g transform={`translate(436,${530 - 4 * perro})`}>
          <path d="M-10,12 Q-10,-6 0,-8 Q12,-10 14,0 L20,4 Q20,10 12,10 L10,12 Z" fill={c} />
          <path d={`M-4,-6 q-6,${6 - perro * 8} -4,14`} stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
};

// ------------------------------------------------------------------------------------------------ 130 rayitas de tiza en la pared (mundo)
// x,y = esquina sup. izq.; n rayitas dibujadas (5 por grupo: 4 palotes + tachado). 7 grupos por fila.
export const RayasPared: React.FC<{ x: number; y: number; n: number; s?: number; nueva?: number }> = ({ x, y, n, s = 1, nueva = 0 }) => (
  <g>
    {Array.from({ length: Math.min(130, Math.floor(n)) }).map((_, i) => {
      const g = Math.floor(i / 5), k = i % 5, gx = x + (g % 7) * 46 * s, gy = y + Math.floor(g / 7) * 50 * s;
      const jx = (R(`rx${i}`) - 0.5) * 2, jy = (R(`ry${i}`) - 0.5) * 3;
      return k < 4 ? <path key={i} d={`M${gx + k * 8 * s + jx},${gy + jy} l${1.5 * s},${36 * s}`} stroke="#ece6d6" strokeWidth={3.2 * s} strokeLinecap="round" opacity={0.85} />
        : <path key={i} d={`M${gx - 4 * s},${gy + 28 * s} L${gx + 34 * s},${gy + 6 * s}`} stroke="#ece6d6" strokeWidth={3.2 * s} strokeLinecap="round" opacity={0.85} />;
    })}
    {nueva > 0 && <circle cx={x} cy={y} r={0} />}
  </g>
);

// ------------------------------------------------------------------------------------------------ CTA: las 3 reglas como tarjetas (pantalla)
export const TarjetasReglas: React.FC<{ x: number; y: number; o: number[]; marca: number; w?: number; h?: number; voto?: number }> = ({ x, y, o, marca, w = 300, h = 220, voto = 0 }) => {
  const T = [["1", "FRESH FOOD", "FIRST"], ["2", "NOTHING RISKY", "ALONE"], ["3", "ONE THING", "FOR FUN"]];
  return (
    <g>
      {T.map((t, i) => {
        const a = o[i] ?? 0;
        if (a <= 0.01) return null;
        const on = marca === i;
        const cx = x + i * (w + 40), sc = 0.85 + 0.15 * a + (on ? 0.06 : 0);
        return (
          <g key={i} opacity={Math.min(1, a)} transform={`translate(${cx + w / 2},${y + h / 2}) scale(${sc}) rotate(${[-3, 1.5, -1.5][i]}) translate(${-w / 2},${-h / 2})`}>
            <rect x={6} y={10} width={w} height={h} rx={10} fill="#000" opacity={0.25} />
            <rect x={0} y={0} width={w} height={h} rx={10} fill="#fbf4dc" stroke={on ? "#e2483a" : "#cfc4a4"} strokeWidth={on ? 8 : 3} />
            <rect x={w / 2 - 22} y={-14} width={44} height={26} rx={4} fill={on ? "#e2483a" : "#c0352c"} opacity={0.9} />
            <text x={30} y={88} fontFamily={F_MANO} fontWeight={700} fontSize={84} fill={on ? "#e2483a" : "#1d3a8a"}>{t[0]}</text>
            <text x={w / 2 + 22} y={110} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={34} fill="#1d3a8a">{t[1]}</text>
            <text x={w / 2 + 22} y={154} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={34} fill="#1d3a8a">{t[2]}</text>
            {voto > 0 && <g opacity={voto}><circle cx={w - 34} cy={h - 32} r={22} fill="#2f7f86" /><text x={w - 34} y={h - 22} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={26} fill="#fff">?</text></g>}
          </g>
        );
      })}
    </g>
  );
};

export { NieveCae };
