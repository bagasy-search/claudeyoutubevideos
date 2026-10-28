// lc01 · vuelta 3 (v3a, planos P01-P14): componentes nuevos. No toca los _comp compartidos.
// - Desfase: renderiza otro plano corrido en el tiempo → las transiciones del montaje (luz / fundido) quedan como CORTE
//   limpio en el cuadro nominal (sin fantasma ni salto de 1 cuadro debajo del destello).
// - utilería del mundo: radiador con aire caliente, ondas de radio, visor de la cafetera, marquesina NOT A MOVIE,
//   casco de liniero colgado, reloj de mesa de luz, gorro en la mano, horario de la parada, sol de día.
// - inserto: el cuaderno CENSUS que abre la mano de Theo (manga naranja, como la mano de P52/P56).
import React, { useContext } from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { OffsetCtx, useF } from "../../anikit/camara";
import { F_HUD } from "../../anikit/pantalla";
import { Halo } from "../../anikit/luz";
import { AMBAR } from "../elenco";
import { F_MONO } from "../hud";
import { CuadernoGrande } from "./base";

const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const rp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });

// ---------- corte limpio: el hijo ve su reloj corrido `d` cuadros (f_hijo = f + d) ----------
export const Desfase: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => {
  const off = useContext(OffsetCtx);
  return <OffsetCtx.Provider value={off - d}>{children}</OffsetCtx.Provider>;
};
// antes de `desde` muestra `antes` (corrido), después muestra `despues` (corrido): para costuras de montaje
export const Costura: React.FC<{ antes?: { el: React.ReactNode; d: number }; despues?: { el: React.ReactNode; d: number; desde: number }; children: React.ReactNode }> = ({ antes, despues, children }) => {
  const f = useF();
  if (antes && f < 0) return <Desfase d={antes.d}>{antes.el}</Desfase>;
  if (despues && f >= despues.desde) return <Desfase d={despues.d}>{despues.el}</Desfase>;
  return <>{children}</>;
};

// ---------- ondas ámbar de la radio (mundo): arcos que salen del parlante ----------
export const OndasRadio: React.FC<{ x: number; y: number; f: number; on: number; s?: number }> = ({ x, y, f, on, s = 1 }) => {
  if (on <= 0) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[0, 1, 2, 3].map((k) => {
        const t = ((f / 22 + k / 4) % 1);
        const r = 40 + t * 150;
        return <path key={k} d={`M${-r * 0.5},${-r * 0.87} A${r},${r} 0 0 1 ${-r * 0.5},${r * 0.87}`} transform="scale(-1,1)" stroke={AMBAR} strokeWidth={8 - 4 * t} fill="none" strokeLinecap="round" opacity={on * 0.85 * (1 - t)} />;
      })}
      {[0, 1].map((k) => {
        const t = ((f / 30 + k / 2) % 1);
        return <text key={k} x={-30 - t * 120} y={-60 - t * 110 + Math.sin(f / 6 + k) * 8} fontSize={46} fill={AMBAR} opacity={on * (1 - t)} fontFamily={F_HUD}>♪</text>;
      })}
      <Halo x={0} y={0} r={140} color={AMBAR} fuerza={0.35 * on} />
    </g>
  );
};

// ---------- radiador de pared (base en el piso) con aire caliente que sube ----------
export const Radiador: React.FC<{ x: number; piso: number; f: number; on: number; w?: number }> = ({ x, piso, f, on, w = 300 }) => {
  const n = Math.floor(w / 30);
  return (
    <g transform={`translate(${x},${piso})`}>
      <rect x={-w / 2 + 10} y={-14} width={14} height={14} fill="#6a645a" /><rect x={w / 2 - 24} y={-14} width={14} height={14} fill="#6a645a" />
      {Array.from({ length: n }).map((_, i) => <rect key={i} x={-w / 2 + i * (w / n) + 3} y={-190} width={w / n - 6} height={178} rx={10} fill={on > 0.5 ? "#d8b8a0" : "#c9c2b6"} stroke="#9a8e80" strokeWidth={3} />)}
      <rect x={-w / 2 - 6} y={-176} width={w + 12} height={14} rx={6} fill="#b0a698" />
      <rect x={-w / 2 - 6} y={-40} width={w + 12} height={12} rx={6} fill="#b0a698" />
      <circle cx={w / 2 + 14} cy={-60} r={14} fill="#c0352c" /><rect x={w / 2 + 2} y={-64} width={24} height={8} fill="#8a2420" transform={`rotate(${on * 90} ${w / 2 + 14} -60)`} />
      {on > 0 && Array.from({ length: 6 }).map((_, k) => {
        const t = ((f / 30 + k / 6) % 1);
        const xx = -w / 2 + 30 + k * (w - 60) / 5;
        return <path key={k} d={`M${xx},${-200 - t * 220} q16,-26 0,-52 q-16,-26 4,-52`} stroke="#ffb27a" strokeWidth={7} fill="none" strokeLinecap="round" opacity={on * 0.8 * Math.sin(t * Math.PI)} />;
      })}
      {on > 0 && <Halo x={0} y={-120} r={w * 0.9} color="#ffb27a" fuerza={0.35 * on} />}
    </g>
  );
};

// ---------- visor del temporizador de la cafetera (mundo) «AUTO 6:00» que destella al nombrarlo ----------
export const VisorCafetera: React.FC<{ x: number; y: number; f: number; brilla: number; s?: number }> = ({ x, y, f, brilla, s = 1 }) => {
  const b = brilla > 0 ? 0.5 + 0.5 * Math.sin(f / 4) * brilla : 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-46} y={-20} width={92} height={40} rx={6} fill="#141018" stroke="#3a3440" strokeWidth={3} />
      <text x={0} y={-4} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={13} fill="#7ae0a0">AUTO ●</text>
      <text x={0} y={15} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={17} fill="#7ae0a0">6:00</text>
      {brilla > 0 && <Halo x={0} y={0} r={70} color="#7ae0a0" fuerza={0.3 + 0.4 * b} />}
    </g>
  );
};

// ---------- marquesina del NORSHOR: las letras pasan de NOW SHOWING a NOT A MOVIE (tabla que gira) ----------
// coordenadas del set Superior: marquesina en x 1480..1920, y P-300..P-230
export const Marquesina: React.FC<{ piso: number; f: number; cambia: number; tacha?: number }> = ({ piso, f, cambia, tacha }) => {
  const u = rp(f, cambia, cambia + 12);
  const sy = Math.abs(Math.cos(u * Math.PI));
  const txt = u < 0.5 ? "NOW SHOWING" : "NOT A MOVIE";
  const col = u < 0.5 ? "#c8c0d0" : "#ff6a5a";
  const t = tacha !== undefined ? rp(f, tacha, tacha + 10) : 0;
  return (
    <g>
      <rect x={1486} y={piso - 288} width={428} height={54} rx={4} fill="#2a1a20" />
      <g transform={`translate(1700,${piso - 260}) scale(1,${Math.max(0.05, sy)}) translate(-1700,${-(piso - 260)})`}>
        <text x={1700} y={piso - 248} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={34} letterSpacing={2} fill={col}>{txt}</text>
      </g>
      {u > 0.5 && <Halo x={1700} y={piso - 260} r={200} color="#ff6a5a" fuerza={0.25 * (0.8 + 0.2 * Math.sin(f / 5))} />}
      {t > 0 && <path d={`M1510,${piso - 262} L${1510 + 380 * t},${piso - 262}`} stroke="#ff4a3d" strokeWidth={6} strokeLinecap="round" />}
    </g>
  );
};

// ---------- casco de liniero + cinturón de herramientas colgados de un gancho (mundo) ----------
export const CascoLiniero: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-4} y={-10} width={8} height={22} fill="#2a2232" /><path d="M0,10 q14,0 14,14" stroke="#8a8a92" strokeWidth={5} fill="none" />
    <path d="M-52,70 Q-50,22 0,20 Q50,22 52,70 Z" fill="#f2c14a" /><rect x={-66} y={66} width={132} height={12} rx={6} fill="#d9a83a" />
    <rect x={-6} y={22} width={12} height={46} rx={4} fill="#e0b040" />
    <circle cx={0} cy={50} r={13} fill="#1d3a6a" /><text x={0} y={55} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={13} fill="#fff">MP</text>
    {/* cinturón de liniero que cuelga */}
    <path d="M-40,84 Q-60,170 -10,200 Q40,214 60,150 Q66,110 46,84" stroke="#6a4a2a" strokeWidth={14} fill="none" />
    <rect x={-30} y={176} width={30} height={40} rx={4} fill="#5a3a22" /><rect x={10} y={176} width={26} height={44} rx={4} fill="#5a3a22" />
    <rect x={-22} y={160} width={6} height={24} fill="#9a9aa2" /><rect x={18} y={156} width={6} height={28} fill="#c0352c" />
  </g>
);

// ---------- reloj de mesa de luz (cubre el del set del dúplex, que marca 5:58) ----------
export const RelojMesa: React.FC<{ x: number; y: number; txt: string; f: number; tick?: number }> = ({ x, y, txt, f, tick }) => {
  const p = tick !== undefined && f >= tick && f < tick + 8 ? 1.12 : 1;
  return (
    <g transform={`translate(${x},${y}) scale(${p})`}>
      <rect x={-37} y={-23} width={74} height={46} rx={9} fill="#1d1a20" />
      <text x={0} y={10} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={25} fill="#ff4a3d">{txt}</text>
      <Halo x={0} y={0} r={46} color="#ff4a3d" fuerza={0.35} />
    </g>
  );
};

// ---------- gorro de lana rojo (en la mano, base en el origen) ----------
export const Gorro: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s}) translate(0,-8)`}>
    <path d="M-26,8 Q-28,-30 0,-32 Q28,-30 26,8 Z" fill="#b2342a" />
    <rect x={-28} y={0} width={56} height={12} rx={5} fill="#efe3c8" />
    <circle cx={0} cy={-34} r={8} fill="#efe3c8" />
  </g>
);

// ---------- horario de la parada (mundo): placa debajo del cartel 6 con 6:40 ----------
export const HorarioParada: React.FC<{ x: number; y: number; f: number; marca: number }> = ({ x, y, f, marca }) => {
  const m = marca > 0 && f > marca ? 0.6 + 0.4 * Math.sin((f - marca) / 4) : 0;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-46} y={0} width={92} height={96} rx={6} fill="#f2ece0" stroke="#2f6a8a" strokeWidth={5} />
      <text x={0} y={22} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={15} fill="#2f6a8a">WEEKDAYS</text>
      {["6:10", "6:40", "7:10"].map((t, i) => <text key={t} x={0} y={46 + i * 20} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={18} fill={i === 1 ? "#c0352c" : "#3a3440"}>{t}</text>)}
      {m > 0 && <rect x={-36} y={50} width={72} height={24} rx={6} fill="none" stroke="#ff4a3d" strokeWidth={4} opacity={m} />}
    </g>
  );
};

// ---------- sol de día que se lee como sol (disco cálido + halo), coordenadas de pantalla ----------
export const SolDia: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 70 }) => (
  <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <Halo x={x} y={y} r={r * 5} color="#ffe6a0" fuerza={0.55} />
    <Halo x={x} y={y} r={r * 2.2} color="#fff2c0" fuerza={0.8} />
    <circle cx={x} cy={y} r={r} fill="#fff6d6" />
  </svg>
);

// ---------- inserto: la mano de Theo (manga naranja, puño crema) abre la tapa del cuaderno CENSUS ----------
// la tapa la abre CuadernoGrande (abre); la mano sigue el borde de la tapa que gira (pantalla)
export const CuadernoAbre: React.FC<{ abre: number; zoom: [number, number, number] }> = ({ abre, zoom }) => {
  const f = useF();
  const ab = rp(f, abre, abre + 18);
  const entra = rp(f, abre - 14, abre);
  // borde libre de la tapa: x = 960 + 660·cos(ab·π) (en el marco del cuaderno, rotado -3°)
  const bx = 960 + 640 * Math.cos(ab * Math.PI), by = 640 - 120 * Math.sin(ab * Math.PI);
  const x = bx + (1 - entra) * 700, y = by + (1 - entra) * 500;
  const z = interpolate(f, [zoom[0], zoom[0] + 240], [zoom[1], zoom[2]], CL);
  return (
    <AbsoluteFill>
      <CuadernoGrande tapa abre={abre} zoom={zoom} />
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <g transform="rotate(-3 960 540)">
            <g transform={`translate(${x},${y})`}>
              <path d="M60,40 L900,700" stroke="#c8582b" strokeWidth={170} strokeLinecap="round" />
              <path d="M40,20 L96,64" stroke="#efe3c8" strokeWidth={170} strokeLinecap="butt" />
              <ellipse cx={-10} cy={-10} rx={74} ry={56} fill="#17100d" transform="rotate(38 -10 -10)" />
              <ellipse cx={-62} cy={-50} rx={34} ry={16} fill="#17100d" transform="rotate(20 -62 -50)" />
            </g>
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- ráfaga de viento (mundo): líneas blancas que cruzan ----------
export const Rafaga: React.FC<{ f: number; f0: number; x0: number; y0: number; w?: number; n?: number }> = ({ f, f0, x0, y0, w = 900, n = 5 }) => {
  if (f < f0 || f > f0 + 40) return null;
  const u = (f - f0) / 40;
  return (
    <g opacity={Math.sin(u * Math.PI) * 0.8}>
      {Array.from({ length: n }).map((_, i) => {
        const x = x0 + u * w + i * 40, y = y0 + i * 34;
        return <path key={i} d={`M${x},${y} q60,-14 120,0 q40,10 70,-6`} stroke="#eef4ff" strokeWidth={5} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
};

// ---------- semáforo grande (pantalla o mundo) con cambio de luz por fundido de 8 cuadros ----------
export const SemaforoSuave: React.FC<{ x: number; y: number; f: number; claves: { f: number; luz: 0 | 1 | 2 }[]; s?: number; poste?: number }> = ({ x, y, f, claves, s = 1, poste = 900 }) => {
  const cols = ["#ff4a3d", "#ffcf3a", "#4ae08a"];
  const nivel = (k: number) => {
    let v = claves[0].luz === k ? 1 : 0;
    for (let i = 1; i < claves.length; i++) {
      const c = claves[i];
      const u = interpolate(f, [c.f, c.f + 8], [0, 1], CL);
      const obj = c.luz === k ? 1 : 0;
      v = v + (obj - v) * u;
    }
    return v;
  };
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-12} y={160} width={24} height={poste} fill="#121016" />
      <rect x={-70} y={-180} width={140} height={360} rx={22} fill="#121016" />
      {[0, 1, 2].map((k) => { const n = nivel(k); return <g key={k}><path d={`M-58,${-150 + k * 112} q58,-30 116,0`} stroke="#121016" strokeWidth={14} fill="none" /><circle cx={0} cy={-110 + k * 110} r={42} fill="#2a2630" /><circle cx={0} cy={-110 + k * 110} r={42} fill={cols[k]} opacity={n} />{n > 0.02 && <Halo x={0} y={-110 + k * 110} r={170} color={cols[k]} fuerza={0.75 * n} />}</g>; })}
    </g>
  );
};

// ---------- la pared con la ventana vista desde adentro (pantalla), empuje a TRAVÉS de un vidrio ----------
// el origen del empuje es el centro de un paño: los parantes salen del cuadro (no quedan como fantasma en el medio)
export const VentanaEmpuje: React.FC<{ e0: number; e1: number; ox?: number; oy?: number; children?: React.ReactNode }> = ({ e0, e1, ox = 1420, oy = 300, children }) => {
  const f = useF();
  const u = interpolate(f, [e0, e1], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
  const s = 1 + u * 5;
  const o = 1 - interpolate(f, [e1 - 4, e1], [0, 1], CL);
  if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${s})`, transformOrigin: `${ox}px ${oy}px` }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <path fillRule="evenodd" d="M-200,-200 H2200 V1300 H-200 Z M600,120 H1700 V820 H600 Z" fill="#2b2230" />
        <rect x={588} y={108} width={1124} height={724} fill="none" stroke="#e9dfc8" strokeWidth={24} />
        <rect x={1140} y={120} width={20} height={700} fill="#e9dfc8" />
        <rect x={600} y={460} width={1100} height={16} fill="#e9dfc8" />
        <rect x={560} y={826} width={1180} height={30} rx={6} fill="#d8ccb2" />
        <path d="M600,120 Q640,300 610,560 Q660,580 700,560 Q690,300 760,120 Z" fill="#c8582b" opacity={0.9} />
        <path d="M1700,120 Q1660,300 1690,560 Q1640,580 1600,560 Q1610,300 1540,120 Z" fill="#c8582b" opacity={0.9} />
        <rect x={1240} y={770} width={60} height={56} rx={6} fill="#c9463a" /><path d="M1270,770 q-30,-60 -10,-110 M1270,770 q20,-50 50,-80 M1270,770 q0,-70 6,-120" stroke="#5a8a4a" strokeWidth={8} fill="none" />
      </svg>
      {children}
    </AbsoluteFill>
  );
};
