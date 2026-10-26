import React from "react";
import { interpolate, Easing } from "remotion";
import { rnd } from "../soot/lib";
import { C, fontFamily } from "./kit";

// Soot 10 — EL MUNDO: un barco pirata en corte (cutaway) gigante, el mar, el cielo y el fondo marino en un solo lienzo.
// Coordenadas de mundo en px a zoom 1. La cámara viaja por acá (cam = centro + zoom); nunca se corta a otro fondo.
// Barco: proa a la derecha. Línea de flotación y = MAR. Todo vector plano saturado, cero imágenes.

export const MAR = 2000;
export const FONDO = 4700; // lecho marino
export const CUB = 1500; // cubierta principal (pies de la gente)
export const ALCA = 1200; // alcázar (techo del camarote)
export const BAT = 1800; // cubierta de cañones (piso)
export const BOD = 2120; // bodega (piso)
export const CASTI = 1300; // castillo de proa
export const MASTIL = { mesana: 700, mayor: 2050, trinquete: 2900 };

const MAD = { casco: "#8a4520", casco2: "#5e2c14", oscuro: "#3a1c10", interior: "#4a2616", interior2: "#5c321c", tabla: "#c98a4a", tabla2: "#a8682f", riel: "#5a2d14", oro: "#f7c548", viga: "#2e160c" };
export const VELA = "#f6ecd4";

export type Cam = { x: number; y: number; z: number };
// llave de cámara: en `t` empieza a ir a (x, y, z) y llega en `d` s
export type Key = [number, number, number, number, number?, ("suave" | "seco" | "lineal")?];
export const camara = (t: number, keys: Key[]): Cam => {
  let c: Cam = { x: keys[0][1], y: keys[0][2], z: keys[0][3] };
  let ult = keys[0][0];
  for (let i = 1; i < keys.length; i++) {
    const [k0, x, y, z, d0 = 0.9, tipo = "suave"] = keys[i];
    let d = d0;
    if (t < k0) break;
    // viaje largo (mucho cielo/mar vacío en el medio) = barrido rápido de 0,5 s en vez de un paneo lento por la nada
    const lejos = Math.hypot(x - c.x, y - c.y) * Math.min(c.z, z) > 3000;
    if (lejos) d = Math.min(d, 0.5);
    const ease = lejos ? Easing.inOut(Easing.poly(5)) : tipo === "seco" ? Easing.out(Easing.cubic) : tipo === "lineal" ? Easing.linear : Easing.inOut(Easing.cubic);
    const u = d <= 0 ? 1 : interpolate(t, [k0, k0 + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
    // el zoom se interpola en escala logarítmica (el dolly se siente parejo)
    c = { x: c.x + (x - c.x) * u, y: c.y + (y - c.y) * u, z: Math.exp(Math.log(c.z) + (Math.log(z) - Math.log(c.z)) * u) };
    ult = k0 + d;
  }
  // empuje lento que nunca deja el cuadro quieto
  const empuje = 1 + Math.min(0.07, Math.max(0, t - ult) * 0.012);
  return { ...c, z: c.z * empuje };
};
export const vista = (c: Cam) => ({ x0: c.x - 960 / c.z, x1: c.x + 960 / c.z, y0: c.y - 540 / c.z, y1: c.y + 540 / c.z });

// ── cielo y mar (mundo)
export type Clima = { cielo: [string, string, string]; mar: [string, string]; ola: number; noche: number; tormenta: number };
export const Cielo: React.FC<{ cl: Clima; cam: Cam }> = ({ cl, cam }) => {
  const v = vista(cam);
  return (
    <div style={{ position: "absolute", left: v.x0 - 200, top: Math.min(v.y0 - 200, MAR - 4000), width: v.x1 - v.x0 + 400, height: MAR - Math.min(v.y0 - 200, MAR - 4000) + 40, background: `linear-gradient(180deg, ${cl.cielo[0]} 0%, ${cl.cielo[1]} 62%, ${cl.cielo[2]} 100%)` }} />
  );
};
export const Nubes: React.FC<{ t: number; cam: Cam; cl: Clima; seed?: number }> = ({ t, cam, cl, seed = 3 }) => {
  const v = vista(cam);
  const r = rnd(seed);
  const ns = Array.from({ length: 40 }, (_, i) => ({ x: -16000 + i * 900 + r() * 500, y: -1400 + r() * 2600, s: 0.7 + r() * 1.4, v: 6 + r() * 14 }));
  const col = cl.tormenta > 0.5 ? "#59536e" : cl.noche > 0.5 ? "#3b2f6e" : "#ffffff";
  return (
    <>
      {ns.map((n, i) => {
        const x = n.x + t * n.v * (1 + cl.tormenta * 6);
        if (x + 500 * n.s < v.x0 || x - 500 * n.s > v.x1 || n.y + 200 > MAR + 100 || n.y + 200 * n.s < v.y0 || n.y - 200 > v.y1) return null;
        return (
          <svg key={i} style={{ position: "absolute", left: x - 260 * n.s, top: n.y - 120 * n.s, overflow: "visible", opacity: cl.noche > 0.5 ? 0.5 : 0.85 }} width={520 * n.s} height={240 * n.s} viewBox="-260 -120 520 240">
            <path d="M -240 80 Q -250 10 -170 10 Q -160 -70 -70 -60 Q -20 -130 70 -80 Q 150 -110 180 -20 Q 260 -10 240 80 Z" fill={col} />
            <path d="M -240 80 L 240 80 Q 200 50 120 60 Q 0 40 -120 64 Q -200 50 -240 80 Z" fill="rgba(80,60,140,.18)" />
          </svg>
        );
      })}
    </>
  );
};
// mar: cuerpo con degradé (de la superficie al abismo), olas animadas en la superficie, rayos de luz bajo el agua, lecho marino
export const Mar: React.FC<{ t: number; cam: Cam; cl: Clima; frente?: boolean }> = ({ t, cam, cl, frente }) => {
  const v = vista(cam);
  if (v.y1 < MAR - 300) return null;
  const x0 = Math.floor((v.x0 - 400) / 120) * 120, x1 = v.x1 + 400;
  const amp = 26 + cl.ola * 70;
  const ola = (fase: number, a: number, k = 1) => {
    const pts: string[] = [];
    for (let x = x0; x <= x1; x += 60) pts.push(`${x},${MAR + Math.sin(x * 0.006 * k + t * 1.6 + fase) * a + Math.sin(x * 0.017 + t * 2.3 + fase) * a * 0.35}`);
    return pts.join(" ");
  };
  if (frente)
    return (
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={1} height={1}>
        <polygon points={`${x0},${MAR + 2600} ${ola(2.1, amp * 0.7, 1.3).split(" ").map((p) => { const [a, b] = p.split(","); return `${a},${+b + 60}`; }).join(" ")} ${x1},${MAR + 2600}`} fill={cl.mar[0]} opacity={0.38} />
        <polyline points={ola(2.1, amp * 0.7, 1.3).split(" ").map((p) => { const [a, b] = p.split(","); return `${a},${+b + 60}`; }).join(" ")} fill="none" stroke="#e8fbff" strokeWidth={10} opacity={0.6} strokeLinecap="round" />
      </svg>
    );
  const prof = FONDO + 400;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <defs>
        <linearGradient id="marG" x1="0" y1={MAR} x2="0" y2={prof} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={cl.mar[0]} /><stop offset="0.35" stopColor={cl.mar[1]} /><stop offset="1" stopColor="#050a24" />
        </linearGradient>
      </defs>
      <polygon points={`${x0},${prof} ${ola(0, amp)} ${x1},${prof}`} fill="url(#marG)" />
      <polyline points={ola(0, amp)} fill="none" stroke="#bff3ff" strokeWidth={12} opacity={0.7} strokeLinecap="round" />
      {/* espuma que corre */}
      {Array.from({ length: Math.ceil((x1 - x0) / 340) }, (_, i) => {
        const x = x0 + i * 340 + ((t * 70 + i * 97) % 340);
        const y = MAR + Math.sin(x * 0.006 + t * 1.6) * amp + 70 + (i % 3) * 60;
        return <path key={i} d={`M ${x} ${y} q 30 -14 60 0 q 30 14 60 0`} stroke="#d8f8ff" strokeWidth={8} fill="none" opacity={0.4} strokeLinecap="round" />;
      })}
      {/* rayos de sol bajo el agua */}
      {v.y1 > MAR + 300 && Array.from({ length: 9 }, (_, i) => {
        const x = x0 + ((i * 700 + t * 30) % (x1 - x0 + 800)) - 200;
        return <polygon key={`r${i}`} points={`${x},${MAR + 40} ${x + 160},${MAR + 40} ${x + 700},${MAR + 2200} ${x + 380},${MAR + 2200}`} fill="#bff3ff" opacity={0.06 + 0.04 * Math.sin(t + i)} />;
      })}
      {/* lecho marino */}
      {v.y1 > FONDO - 400 && (
        <g>
          <path d={`M ${x0} ${FONDO} ${Array.from({ length: Math.ceil((x1 - x0) / 200) + 1 }, (_, i) => `L ${x0 + i * 200} ${FONDO + Math.sin((x0 + i * 200) * 0.004) * 40}`).join(" ")} L ${x1} ${prof} L ${x0} ${prof} Z`} fill="#c9a86a" />
          <path d={`M ${x0} ${FONDO + 60} ${Array.from({ length: Math.ceil((x1 - x0) / 200) + 1 }, (_, i) => `L ${x0 + i * 200} ${FONDO + 60 + Math.sin((x0 + i * 200) * 0.006 + 1) * 30}`).join(" ")} L ${x1} ${prof} L ${x0} ${prof} Z`} fill="#a8854a" />
          {Array.from({ length: Math.ceil((x1 - x0) / 260) }, (_, i) => {
            const x = Math.floor(x0 / 260) * 260 + i * 260;
            const r = rnd(Math.abs(Math.floor(x / 260)) + 7);
            const h = 80 + r() * 160;
            if (r() < 0.45) return <ellipse key={`p${i}`} cx={x} cy={FONDO + 10} rx={40 + r() * 50} ry={24 + r() * 20} fill={r() < 0.5 ? "#6b6a7a" : "#8a8494"} />;
            return <path key={`a${i}`} d={`M ${x} ${FONDO + 10} q ${Math.sin(t * 1.4 + i) * 30} ${-h / 2} 0 ${-h} M ${x + 20} ${FONDO + 10} q ${Math.sin(t * 1.4 + i + 1) * 30} ${-h / 3} 10 ${-h * 0.7}`} stroke={r() < 0.5 ? "#3f9a5a" : "#2f7a4a"} strokeWidth={14} fill="none" strokeLinecap="round" />;
          })}
        </g>
      )}
    </svg>
  );
};

// burbujas que suben (bajo el agua)
export const Burbujas: React.FC<{ t: number; x: number; y: number; w?: number; n?: number; seed?: number }> = ({ t, x, y, w = 600, n = 26, seed = 4 }) => {
  const r = rnd(seed);
  const b = Array.from({ length: n }, () => [r() * w - w / 2, r(), 0.5 + r(), 6 + r() * 16]);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      {b.map(([dx, ph, v, s], i) => {
        const k = (t * 0.25 * v + ph) % 1;
        return <circle key={i} cx={x + dx + Math.sin(t * 3 + i) * 14} cy={y - k * 1400} r={s} fill="none" stroke="#dff8ff" strokeWidth={3} opacity={0.6 * (1 - k)} />;
      })}
    </svg>
  );
};

// ── piezas del barco (coordenadas locales del barco)
export const Canon: React.FC<{ x: number; y: number; t?: number; dispara?: number; s?: number; flip?: boolean }> = ({ x, y, t = 0, dispara, s = 1, flip }) => {
  const d = dispara !== undefined && t >= dispara ? t - dispara : -1;
  const retro = d >= 0 && d < 0.6 ? -Math.sin(Math.min(1, d / 0.12) * Math.PI / 2) * 40 * Math.exp(-d * 4) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g transform={`translate(${retro} 0)`}>
        <rect x={-70} y={-62} width={130} height={46} rx={8} fill="#7a4520" />
        <circle cx={-40} cy={-14} r={20} fill="#3a1c10" /><circle cx={34} cy={-14} r={20} fill="#3a1c10" />
        <path d="M -90 -100 L 110 -94 L 110 -70 L -90 -64 Q -110 -82 -90 -100 Z" fill="#2b2b38" />
        <rect x={100} y={-100} width={18} height={34} rx={6} fill="#1d1d28" />
        <path d="M -70 -96 L 90 -92" stroke="#6a6a80" strokeWidth={6} strokeLinecap="round" />
      </g>
      {d >= 0 && d < 0.5 && (
        <g transform="translate(120 -84)" opacity={1 - d * 2}>
          <circle cx={30 + d * 200} cy={0} r={40 + d * 160} fill="#fff3c4" />
          <circle cx={10 + d * 120} cy={0} r={26 + d * 70} fill="#ffb020" />
        </g>
      )}
      {d >= 0 && d < 2.5 && Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={130 + d * (160 + i * 40)} cy={-84 - d * (30 + i * 16)} r={30 + d * 60} fill="#e8e2f0" opacity={Math.max(0, 0.6 - d * 0.25)} />
      ))}
    </g>
  );
};
export const Barril: React.FC<{ x: number; y: number; s?: number; c?: string; txt?: string; acostado?: boolean }> = ({ x, y, s = 1, c = "#a8682f", txt, acostado }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) ${acostado ? "rotate(90 0 -60)" : ""}`}>
    <path d="M -50 0 Q -64 -60 -50 -120 L 50 -120 Q 64 -60 50 0 Z" fill={c} />
    <path d="M -20 0 Q -26 -60 -20 -120" stroke="rgba(0,0,0,.18)" strokeWidth={6} fill="none" />
    <path d="M 20 0 Q 26 -60 20 -120" stroke="rgba(0,0,0,.18)" strokeWidth={6} fill="none" />
    {[-104, -16].map((yy) => <path key={yy} d={`M -56 ${yy} Q 0 ${yy + 8} 56 ${yy}`} stroke="#3a2a2a" strokeWidth={10} fill="none" />)}
    <path d="M -40 -100 Q -50 -60 -40 -20" stroke="#fff" strokeOpacity={0.3} strokeWidth={8} fill="none" strokeLinecap="round" />
    {txt && <text x={0} y={-50} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={28} fill="#3a1c10">{txt}</text>}
  </g>
);
export const Saco: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#d9b98a" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -50 0 Q -70 -70 -30 -100 L -20 -118 L 20 -118 L 30 -100 Q 70 -70 50 0 Z" fill={c} />
    <path d="M -24 -104 L 24 -104" stroke="#8a6a3a" strokeWidth={8} />
    <path d="M -36 -70 Q -44 -40 -34 -14" stroke="#fff" strokeOpacity={0.35} strokeWidth={7} fill="none" strokeLinecap="round" />
  </g>
);
export const Linterna: React.FC<{ x: number; y: number; on?: number; t?: number; c?: string }> = ({ x, y, on = 1, t = 0, c = "#ffd27a" }) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 1.1 + x) * 5})`}>
    {on > 0 && <circle cx={0} cy={50} r={230} fill={`url(#halo)`} opacity={on * (0.85 + 0.15 * Math.sin(t * 9 + x))} />}
    <line x1={0} y1={0} x2={0} y2={20} stroke="#2a1a10" strokeWidth={5} />
    <rect x={-20} y={20} width={40} height={56} rx={8} fill={on > 0.5 ? c : "#5a4a3a"} stroke="#2a1a10" strokeWidth={6} />
    <path d="M -24 20 L 24 20 L 0 4 Z" fill="#2a1a10" />
  </g>
);
export const Hamaca: React.FC<{ x: number; y: number; w?: number; t?: number }> = ({ x, y, w = 200, t = 0 }) => {
  const sw = Math.sin(t * 1.2 + x) * 6;
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1={-w / 2} y1={-40} x2={-w / 2 + 20} y2={0} stroke="#3a2414" strokeWidth={4} />
      <line x1={w / 2} y1={-40} x2={w / 2 - 20} y2={0} stroke="#3a2414" strokeWidth={4} />
      <path d={`M ${-w / 2 + 20} 0 Q ${sw} ${70} ${w / 2 - 20} 0 Q ${sw} ${40} ${-w / 2 + 20} 0 Z`} fill="#d9cba8" stroke="#a8946a" strokeWidth={4} />
    </g>
  );
};
export const Rata: React.FC<{ x: number; y: number; s?: number; flip?: boolean; t?: number }> = ({ x, y, s = 1, flip, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d={`M -40 -8 Q -90 ${-30 + Math.sin(t * 10) * 10} -120 -6`} stroke="#c88a8a" strokeWidth={6} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={-22} rx={44} ry={24} fill="#6b6170" />
    <circle cx={40} cy={-30} r={18} fill="#6b6170" />
    <circle cx={34} cy={-48} r={10} fill="#c88a8a" />
    <circle cx={48} cy={-32} r={4} fill="#111" />
    <circle cx={58} cy={-26} r={4} fill="#ff8aa0" />
    {[-20, 10].map((k) => <line key={k} x1={k} y1={-2} x2={k + Math.sin(t * 20 + k) * 6} y2={4} stroke="#4a4050" strokeWidth={6} strokeLinecap="round" />)}
  </g>
);
export const Campana: React.FC<{ x: number; y: number; t: number; golpes?: number[]; s?: number; txt?: string }> = ({ x, y, t, golpes = [], s = 1, txt }) => {
  const g = golpes.filter((k) => t >= k).pop();
  const sw = g !== undefined ? Math.sin((t - g) * 18) * 20 * Math.exp(-(t - g) * 2.6) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -70 -150 L -70 -20 M 70 -150 L 70 -20" stroke="#5a2d14" strokeWidth={14} />
      <rect x={-90} y={-170} width={180} height={26} rx={8} fill="#5a2d14" />
      <g transform={`rotate(${sw} 0 -140)`}>
        <path d="M -50 -20 Q -52 -126 0 -126 Q 52 -126 50 -20 L 62 -8 L -62 -8 Z" fill="#ffcf5a" />
        <rect x={-62} y={-14} width={124} height={10} rx={4} fill="#e9a92a" />
        <circle cx={0} cy={2} r={12} fill="#c98a1e" />
        <path d="M -30 -40 Q -34 -90 -6 -104" stroke="#fff" strokeOpacity={0.6} strokeWidth={8} fill="none" strokeLinecap="round" />
        {txt && <text x={0} y={-50} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={13} fill="#8a5414">{txt}</text>}
      </g>
      {g !== undefined && t - g < 0.8 && [0, 1, 2].map((i) => <circle key={i} cx={0} cy={-70} r={70 + (t - g) * 260 + i * 40} fill="none" stroke="#fff3c4" strokeWidth={6} opacity={Math.max(0, 0.7 - (t - g))} />)}
    </g>
  );
};
// reloj de arena de media hora (el grumete lo da vuelta)
export const RelojArena: React.FC<{ x: number; y: number; t: number; vuelta?: number[]; s?: number }> = ({ x, y, t, vuelta = [], s = 1 }) => {
  const v = vuelta.filter((k) => t >= k);
  const ultima = v.length ? v[v.length - 1] : -100;
  const giro = interpolate(t, [ultima, ultima + 0.5], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const arena = Math.min(1, Math.max(0, (t - ultima - 0.5) / 4)); // cae rápido para que se vea
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`rotate(${giro + v.length * 180 - (giro >= 180 ? 180 : 0)} 0 -70)`}>
        <rect x={-50} y={-150} width={100} height={14} rx={5} fill="#5a2d14" />
        <rect x={-50} y={-4} width={100} height={14} rx={5} fill="#5a2d14" />
        {[-40, 40].map((xx) => <rect key={xx} x={xx - 5} y={-140} width={10} height={140} fill="#5a2d14" />)}
        <path d="M -32 -136 Q -30 -80 -4 -70 Q -30 -60 -32 -4 L 32 -4 Q 30 -60 4 -70 Q 30 -80 32 -136 Z" fill="rgba(220,240,255,.55)" stroke="#fff" strokeWidth={3} />
        <path d={`M ${-26 + arena * 18} ${-130 + arena * 50} Q 0 ${-120 + arena * 50} ${26 - arena * 18} ${-130 + arena * 50} L 4 -76 L -4 -76 Z`} fill="#f2c56a" opacity={1 - arena * 0.9} />
        <path d={`M -28 -6 Q 0 ${-6 - 40 * arena} 28 -6 Z`} fill="#f2c56a" />
        {arena > 0 && arena < 1 && <line x1={0} y1={-72} x2={0} y2={-10} stroke="#f2c56a" strokeWidth={3} />}
      </g>
    </g>
  );
};
// timón
export const Timon: React.FC<{ x: number; y: number; t: number; gira?: number }> = ({ x, y, t, gira = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-10} y={-90} width={20} height={90} fill="#5a2d14" />
    <g transform={`translate(0 -150) rotate(${Math.sin(t * 0.7) * 18 + gira})`}>
      <circle r={74} fill="none" stroke="#7a4520" strokeWidth={16} />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={0} x2={Math.cos((i * Math.PI) / 4) * 100} y2={Math.sin((i * Math.PI) / 4) * 100} stroke="#7a4520" strokeWidth={10} strokeLinecap="round" />)}
      <circle r={18} fill={MAD.oro} />
    </g>
  </g>
);
// bandera: pirata (calavera y tibias) o mercante (cruz); `iza` 0-1 la sube por el mástil
export const Bandera: React.FC<{ x: number; y: number; t: number; tipo: "pirata" | "mercante" | "marina" | "blanca"; iza?: number; s?: number; largo?: number }> = ({ x, y, t, tipo, iza = 1, s = 1, largo = 300 }) => {
  const yy = largo * (1 - iza);
  const ond = (k: number) => Math.sin(t * 6 + k) * 10;
  const fondo = tipo === "pirata" ? "#111018" : tipo === "mercante" ? "#f2f2f2" : tipo === "marina" ? "#c81d2e" : "#ffffff";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`translate(0 ${yy})`}>
        <path d={`M 0 0 Q 60 ${ond(0)} 120 ${ond(1)} Q 180 ${ond(2)} 220 ${ond(3)} L 220 ${140 + ond(3)} Q 180 ${140 + ond(2)} 120 ${140 + ond(1)} Q 60 ${140 + ond(0)} 0 140 Z`} fill={fondo} />
        {tipo === "mercante" && <><path d={`M 80 ${ond(0.7)} L 80 ${140 + ond(0.7)}`} stroke="#c81d2e" strokeWidth={26} /><path d={`M 0 70 Q 110 ${70 + ond(1)} 220 ${70 + ond(3)}`} stroke="#c81d2e" strokeWidth={26} fill="none" /></>}
        {tipo === "marina" && <path d={`M 0 0 L 90 0 L 90 60 L 0 60 Z`} fill="#fff" />}
        {tipo === "marina" && <path d="M 45 0 L 45 60 M 0 30 L 90 30" stroke="#c81d2e" strokeWidth={14} />}
        {tipo === "pirata" && (
          <g transform={`translate(110 ${70 + ond(1.5)})`}>
            <path d="M -60 30 L 60 -30 M -60 -30 L 60 30" stroke="#fff" strokeWidth={16} strokeLinecap="round" />
            {[[-64, 30], [64, -30], [-64, -30], [64, 30]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={10} fill="#fff" />)}
            <path d="M -32 -4 Q -34 -46 0 -46 Q 34 -46 32 -4 Q 30 12 18 14 L 18 26 L -18 26 L -18 14 Q -30 12 -32 -4 Z" fill="#fff" />
            <circle cx={-12} cy={-14} r={9} fill="#111018" /><circle cx={12} cy={-14} r={9} fill="#111018" />
          </g>
        )}
      </g>
    </g>
  );
};

type EstadoBarco = {
  t: number; bandera?: { tipo: "pirata" | "mercante" | "marina" | "blanca"; iza: number }; luces?: number; velas?: number; danio?: number; dispara?: number[];
  nombre?: string; campana?: number[]; reloj?: number[]; agua?: number; casco?: string; mercante?: boolean; humo?: number;
};

// El barco entero en corte. Origen local (0,0); el contenedor lo ubica en el mundo y lo hace rolar.
export const Barco: React.FC<EstadoBarco & { children?: React.ReactNode }> = (p) => {
  const { t, luces = 1, velas = 1, danio = 0, dispara = [], nombre, campana = [], reloj = [], agua = 0, mercante, humo = 0 } = p;
  const viento = Math.sin(t * 0.9) * 0.04 + 0.96;
  const casco = p.casco ?? (mercante ? "#3d6fa8" : MAD.casco);
  const Vela = ({ x, y, w, h, abre = 1 }: { x: number; y: number; w: number; h: number; abre?: number }) => {
    const hh = h * abre;
    const b = (34 + Math.sin(t * 1.3 + x) * 10) * viento * abre;
    return (
      <g>
        <path d={`M ${x - w / 2} ${y} Q ${x} ${y + 14} ${x + w / 2} ${y} L ${x + w / 2 - 20} ${y + hh} Q ${x + b} ${y + hh + b * 0.8} ${x - w / 2 + 20} ${y + hh} Z`} fill={danio > 0.5 ? "#e6d9b8" : VELA} />
        <path d={`M ${x + w / 2} ${y} L ${x + w / 2 - 20} ${y + hh} Q ${x + b} ${y + hh + b * 0.8} ${x + w * 0.1} ${y + hh} Q ${x + w * 0.3} ${y + hh * 0.5} ${x + w / 2} ${y} Z`} fill="rgba(160,130,90,.25)" />
        {[0.33, 0.66].map((k) => <path key={k} d={`M ${x - w / 2 + 20 * k} ${y + hh * k} Q ${x + b * 0.5} ${y + hh * k + b * 0.5} ${x + w / 2 - 20 * k} ${y + hh * k}`} stroke="rgba(160,130,90,.35)" strokeWidth={5} fill="none" />)}
        {danio > 0.3 && <circle cx={x + w * 0.2} cy={y + hh * 0.4} r={24} fill="#1b1240" opacity={0.75} />}
        <rect x={x - w / 2 - 20} y={y - 10} width={w + 40} height={20} rx={10} fill={MAD.riel} />
      </g>
    );
  };
  const Obenques = ({ x, top, base, w }: { x: number; top: number; base: number; w: number }) => (
    <g stroke="#3a2414" strokeWidth={5}>
      {[-1, 1].map((s) => (
        <g key={s}>
          <line x1={x + s * 40} y1={top} x2={x + s * w} y2={base} />
          <line x1={x + s * 60} y1={top} x2={x + s * (w + 60)} y2={base} />
          {Array.from({ length: Math.floor((base - top) / 50) }, (_, i) => {
            const k = (i + 1) / ((base - top) / 50 + 1);
            const yy = top + (base - top) * k;
            return <line key={i} x1={x + s * (40 + (w - 40) * k)} y1={yy} x2={x + s * (60 + w * k)} y2={yy} strokeWidth={3} />;
          })}
        </g>
      ))}
    </g>
  );
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <defs>
        <radialGradient id="halo"><stop offset="0" stopColor="#ffd27a" stopOpacity={0.55} /><stop offset="1" stopColor="#ffd27a" stopOpacity={0} /></radialGradient>
        <linearGradient id="int" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={MAD.interior2} /><stop offset="1" stopColor={MAD.interior} /></linearGradient>
      </defs>
      {/* mástiles, velas y jarcia (detrás del casco) */}
      <g>
        <Obenques x={MASTIL.mayor} top={520} base={1440} w={330} />
        <Obenques x={MASTIL.trinquete} top={640} base={1440} w={280} />
        <Obenques x={MASTIL.mesana} top={560} base={1150} w={220} />
        <line x1={MASTIL.mayor} y1={-260} x2={3600} y2={1240} stroke="#3a2414" strokeWidth={6} />
        <line x1={MASTIL.trinquete} y1={140} x2={4300} y2={1060} stroke="#3a2414" strokeWidth={6} />
        <line x1={MASTIL.mayor} y1={-260} x2={MASTIL.mesana} y2={340} stroke="#3a2414" strokeWidth={6} />
        <rect x={MASTIL.mayor - 26} y={-280} width={52} height={2600} fill="#8a5a2a" />
        <rect x={MASTIL.trinquete - 22} y={120} width={44} height={2200} fill="#8a5a2a" />
        <rect x={MASTIL.mesana - 20} y={330} width={40} height={1900} fill="#8a5a2a" />
        {[MASTIL.mayor, MASTIL.trinquete, MASTIL.mesana].map((x) => <rect key={x} x={x - 10} y={-200} width={10} height={2300} fill="rgba(255,255,255,.12)" />)}
        {/* cofa */}
        <path d={`M ${MASTIL.mayor - 130} 520 L ${MASTIL.mayor + 130} 520 L ${MASTIL.mayor + 100} 560 L ${MASTIL.mayor - 100} 560 Z`} fill={MAD.riel} />
        <path d={`M ${MASTIL.trinquete - 110} 640 L ${MASTIL.trinquete + 110} 640 L ${MASTIL.trinquete + 84} 676 L ${MASTIL.trinquete - 84} 676 Z`} fill={MAD.riel} />
        <Vela x={MASTIL.mayor} y={40} w={760} h={420} abre={velas} />
        <Vela x={MASTIL.mayor} y={600} w={1080} h={560} abre={velas} />
        <Vela x={MASTIL.trinquete} y={220} w={640} h={360} abre={velas} />
        <Vela x={MASTIL.trinquete} y={720} w={900} h={480} abre={velas} />
        <Vela x={MASTIL.mesana} y={420} w={560} h={360} abre={velas} />
        {/* foque */}
        <path d={`M ${MASTIL.trinquete + 60} 300 L 4200 1080 Q 3700 1000 ${MASTIL.trinquete + 200} 1150 Z`} fill={VELA} opacity={velas} />
        {p.bandera && <><rect x={MASTIL.mayor - 6} y={-560} width={12} height={300} fill="#5a2d14" /><Bandera x={MASTIL.mayor + 6} y={-560} t={t} tipo={p.bandera.tipo} iza={p.bandera.iza} /></>}
      </g>
      {/* bauprés */}
      <path d="M 3520 1290 L 4320 1040" stroke="#7a4520" strokeWidth={34} strokeLinecap="round" />
      {/* casco exterior */}
      <path d="M 100 1130 L 1130 1130 L 1130 1430 L 3180 1430 L 3180 1240 L 3700 1220 Q 3720 1900 3000 2340 L 820 2340 Q 260 2210 150 1700 Z" fill={casco} />
      <path d="M 150 1700 Q 260 2210 820 2340 L 3000 2340 Q 3500 2060 3640 1700 Z" fill="rgba(0,0,0,.2)" />
      {/* interior en corte */}
      <g>
        {/* camarote del capitán */}
        <rect x={190} y={ALCA + 30} width={920} height={CUB - ALCA - 30} fill="url(#int)" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={230 + i * 120} y={ALCA + 70} width={90} height={120} rx={10} fill={luces > 0.5 ? "#9fd6ff" : "#1b2a5a"} stroke="#2e160c" strokeWidth={10} />
            <line x1={275 + i * 120} y1={ALCA + 70} x2={275 + i * 120} y2={ALCA + 190} stroke="#2e160c" strokeWidth={6} />
          </g>
        ))}
        <rect x={1112} y={ALCA + 30} width={18} height={CUB - ALCA - 30} fill={MAD.viga} />
        {/* cocina bajo el castillo */}
        <rect x={3200} y={CASTI + 30} width={420} height={CUB - CASTI - 30} fill="url(#int)" />
        {/* cubierta de cañones */}
        <path d={`M 230 ${CUB + 30} L 3600 ${CUB + 30} Q 3620 1700 3560 ${BAT} L 290 ${BAT} Z`} fill="url(#int)" />
        {/* bodega */}
        <path d={`M 330 ${BAT + 30} L 3540 ${BAT + 30} Q 3460 2000 3330 ${BOD} L 520 ${BOD} Q 380 2010 330 ${BAT + 30} Z`} fill="url(#int)" />
        {/* santabárbara (pólvora) */}
        <rect x={780} y={BAT + 30} width={16} height={BOD - BAT - 30} fill={MAD.viga} />
        {/* sentina */}
        <path d={`M 560 ${BOD + 24} L 3300 ${BOD + 24} Q 3140 2270 2960 2300 L 850 2300 Q 650 2260 560 ${BOD + 24} Z`} fill="#2e1a12" />
        <path d={`M 600 ${2230 - agua * 60 + Math.sin(t * 2) * 6} Q 1800 ${2210 - agua * 60 + Math.sin(t * 2 + 1) * 14} 3200 ${2230 - agua * 60 + Math.sin(t * 2 + 2) * 6} Q 3140 2275 2960 2300 L 850 2300 Q 650 2270 600 ${2230 - agua * 60} Z`} fill="#4a6a3a" opacity={0.95} />
        {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={900 + i * 480 + Math.sin(t + i) * 30} cy={2240 - agua * 60 - ((t * 20 + i * 13) % 30)} r={6 + (i % 2) * 4} fill="#8aa86a" opacity={0.7} />)}
        {/* cuadernas / vigas verticales */}
        {Array.from({ length: 13 }, (_, i) => 420 + i * 250).map((x) => (
          <g key={x}>
            <rect x={x} y={CUB + 30} width={14} height={BAT - CUB - 30} fill={MAD.viga} opacity={0.55} />
            {x > 560 && x < 3300 && <rect x={x} y={BAT + 30} width={14} height={BOD - BAT - 30} fill={MAD.viga} opacity={0.55} />}
          </g>
        ))}
        {/* pisos (tablones en corte) */}
        <rect x={110} y={ALCA} width={1020} height={30} fill={MAD.tabla} />
        <rect x={1100} y={CUB} width={2120} height={30} fill={MAD.tabla} />
        <rect x={190} y={CUB} width={920} height={30} fill={MAD.tabla2} />
        <rect x={3180} y={CASTI} width={520} height={30} fill={MAD.tabla} />
        <rect x={3200} y={CUB} width={420} height={30} fill={MAD.tabla2} />
        <rect x={250} y={BAT} width={3340} height={30} fill={MAD.tabla2} />
        <rect x={420} y={BOD} width={2980} height={24} fill={MAD.tabla2} />
        {[ALCA, CUB, BAT].map((y) => Array.from({ length: 30 }, (_, i) => <line key={`${y}${i}`} x1={200 + i * 120} y1={y + 4} x2={200 + i * 120} y2={y + 26} stroke="rgba(0,0,0,.18)" strokeWidth={4} />))}
        {/* escaleras */}
        {[[1500, CUB, BAT], [2500, BAT, BOD]].map(([x, a, b]) => (
          <g key={x} stroke="#7a4520" strokeWidth={10}>
            <line x1={x} y1={a + 30} x2={x + 120} y2={b} /><line x1={x + 60} y1={a + 30} x2={x + 180} y2={b} />
            {Array.from({ length: 6 }, (_, i) => <line key={i} x1={x + (i + 1) * 17} y1={a + 30 + (i + 1) * ((b - a - 30) / 7)} x2={x + 60 + (i + 1) * 17} y2={a + 30 + (i + 1) * ((b - a - 30) / 7)} strokeWidth={8} />)}
          </g>
        ))}
        {/* bomba de achique: caño de la sentina a cubierta */}
        <rect x={2195} y={1420} width={30} height={2290 - 1420} fill="#6b3a1f" />
        <rect x={2160} y={1400} width={100} height={30} rx={8} fill="#5a2d14" />
        {/* cañones del puente */}
        {[560, 900, 1240, 1900, 2620, 2960, 3300].map((x, i) => <Canon key={x} x={x} y={BAT} t={t} dispara={dispara[i % Math.max(1, dispara.length)]} />)}
        {/* bodega: carga */}
        {[[1000, "RUM"], [1130, ""], [1700, "WATER"], [1830, "WATER"], [2800, "PORK"], [2930, ""]].map(([x, txt], i) => <Barril key={i} x={+x} y={BOD} s={1.15} txt={txt as string} c={i % 2 ? "#9a5a28" : "#a8682f"} />)}
        <Barril x={1065} y={BOD - 138} s={1.05} />
        {[1300, 1400, 2050, 3060, 3170].map((x, i) => <Saco key={x} x={x} y={BOD} s={1.1} c={i % 2 ? "#d9b98a" : "#c9a370"} />)}
        {/* pólvora */}
        {[560, 650, 600].map((x, i) => <Barril key={x} x={x} y={i === 2 ? BOD - 110 : BOD} s={0.85} c="#5a3a2a" txt="⚠" />)}
        <Linterna x={700} y={BAT + 40} on={luces} t={t} c="#ff9a6a" />
        {/* linternas */}
        {[[600, ALCA + 30], [1700, CUB + 30], [2900, CUB + 30], [3400, CASTI + 30], [1500, BAT + 30], [3000, BAT + 30]].map(([x, y], i) => <Linterna key={i} x={x} y={y} on={luces} t={t} />)}
        {/* cocina: fogón */}
        <rect x={3330} y={CUB - 120} width={200} height={120} rx={10} fill="#8a3a2a" />
        <rect x={3360} y={CUB - 80} width={140} height={50} rx={8} fill="#2a1010" />
        {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M ${3380 + i * 26} ${CUB - 36} q 10 ${-30 - Math.sin(t * 9 + i) * 14} 20 0`} fill={i % 2 ? "#ffb020" : "#ff6a3d"} />)}
        <path d={`M 3370 ${CUB - 120} Q 3430 ${CUB - 200} 3490 ${CUB - 120} Z`} fill="#2b2b38" />
        <path d={`M 3360 ${CUB - 190} L 3500 ${CUB - 190}`} stroke="#2b2b38" strokeWidth={8} />
      </g>
      {/* borda: barandas, alcázar y castillo */}
      <g>
        <rect x={100} y={1130} width={1030} height={22} rx={8} fill={MAD.riel} />
        <rect x={1100} y={1420} width={2100} height={22} rx={8} fill={MAD.riel} />
        <rect x={3170} y={1210} width={540} height={22} rx={8} fill={MAD.riel} />
        {[...Array.from({ length: 9 }, (_, i) => [140 + i * 112, 1150, ALCA]), ...Array.from({ length: 18 }, (_, i) => [1140 + i * 118, 1440, CUB]), ...Array.from({ length: 5 }, (_, i) => [3200 + i * 110, 1230, CASTI])].map(([x, a, b], i) => <rect key={i} x={x} y={a} width={12} height={b - a} fill={MAD.riel} />)}
        {/* franja dorada y portas de cañón */}
        <path d="M 150 1660 L 3660 1660" stroke={MAD.oro} strokeWidth={14} />
        {nombre && <text x={330} y={1610} fontFamily={fontFamily} fontWeight={700} fontSize={70} fill={MAD.oro} stroke="#3a1c10" strokeWidth={6} paintOrder="stroke">{nombre}</text>}
      </g>
      <Timon x={1000} y={ALCA} t={t} />
      <Campana x={860} y={ALCA} t={t} golpes={campana} s={0.8} />
      <RelojArena x={760} y={ALCA} t={t} vuelta={reloj} s={0.7} />
      {p.children}
      {humo > 0 && Array.from({ length: 10 }, (_, i) => <circle key={i} cx={1800 + Math.sin(i * 7) * 1300 + t * 40 % 300} cy={1350 - ((t * 60 + i * 120) % 900)} r={120 + (i % 3) * 60} fill="#d8d0e0" opacity={humo * 0.35} />)}
    </svg>
  );
};

// barco simple visto de lejos (horizonte): mercante, marina, pirata
export const BarcoLejos: React.FC<{ x: number; y: number; t: number; s?: number; tipo: "pirata" | "mercante" | "marina"; iza?: number; flip?: boolean; fuego?: number }> = ({ x, y, t, s = 1, tipo, iza = 1, flip, fuego }) => {
  const casco = tipo === "marina" ? "#2a3a6a" : tipo === "mercante" ? "#3d6fa8" : "#5e2c14";
  const d = fuego !== undefined && t >= fuego ? (t - fuego) % 1.6 : -1;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${Math.sin(t * 1.1 + x) * 2})`}>
        <path d="M -330 -40 L 330 -60 Q 310 60 230 90 L -240 90 Q -320 40 -330 -40 Z" fill={casco} />
        <path d="M -320 0 L 320 -10" stroke="#f7c548" strokeWidth={8} />
        {[-200, -100, 0, 100, 200].map((k) => <rect key={k} x={k - 14} y={10} width={28} height={22} rx={4} fill="#1d1420" />)}
        {[-130, 60, 220].map((mx, i) => (
          <g key={mx}>
            <rect x={mx - 7} y={-440 + i * 30} width={14} height={400 - i * 30} fill="#6b3a1f" />
            <path d={`M ${mx - 120 + i * 16} ${-400 + i * 30} Q ${mx + 30} ${-370 + i * 30} ${mx + 120 - i * 16} ${-400 + i * 30} L ${mx + 100} ${-220 + i * 20} Q ${mx + 30} ${-180 + i * 20} ${mx - 100} ${-220 + i * 20} Z`} fill={VELA} />
            <path d={`M ${mx - 100} ${-200 + i * 20} Q ${mx + 30} ${-170 + i * 20} ${mx + 100} ${-200 + i * 20} L ${mx + 90} ${-80} Q ${mx + 30} ${-50} ${mx - 90} ${-80} Z`} fill={VELA} />
          </g>
        ))}
        <rect x={54} y={-560} width={8} height={130} fill="#5a2d14" />
        <g transform="translate(62 -560) scale(0.5)"><Bandera x={0} y={0} t={t} tipo={tipo} iza={iza} /></g>
        {d >= 0 && d < 0.5 && [-200, -100, 0, 100, 200].map((k, i) => <circle key={k} cx={k} cy={20} r={20 + d * 200 + i * 6} fill="#fff3c4" opacity={1 - d * 2} />)}
        {d >= 0 && [-200, 0, 200].map((k) => <circle key={k} cx={k} cy={20 - d * 60} r={60 + d * 140} fill="#e8e2f0" opacity={Math.max(0, 0.5 - d * 0.3)} />)}
      </g>
    </svg>
  );
};

export const Rotulo: React.FC<{ x: number; y: number; txt: string; size?: number; color?: string; tinta?: string }> = ({ x, y, txt, size = 60, color = C.crema, tinta = C.noche }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={size} fill={color} stroke={tinta} strokeWidth={size * 0.16} paintOrder="stroke">{txt}</text>
);
export { MAD };
