import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { rnd } from "../soot/lib";
import { C, ent, prog, fontFamily } from "./kit";
import { V, Drakkar, Tienda, Fogata, Llamas, Iglesia } from "./vik";

// Escenas-objeto de pantalla completa que se reusan en varias trampas (todo vector en código).

// isla en el río vista de costado: agua alrededor, campamento arriba, barcos atracados
export const Isla: React.FC<{ t: number; t0: number; juncos?: boolean; cielo?: string }> = ({ t, t0, juncos, cielo = "#241a5c" }) => {
  const e = ent(t, t0, 0, { damping: 14, stiffness: 120 });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #0c0a2a, ${cielo} 60%, #4a3a8a)` }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <rect x={0} y={640} width={1920} height={440} fill={V.rio} />
        {Array.from({ length: 24 }, (_, i) => <rect key={i} x={(i * 173 + t * 50) % 2000 - 80} y={680 + (i % 6) * 60} width={110} height={7} rx={3} fill="#bfe3ff" opacity={0.3} />)}
        <g transform={`translate(960 ${700 + (1 - e) * 400})`}>
          <path d="M -560 0 Q -500 -120 -300 -140 Q 0 -170 300 -140 Q 500 -120 560 0 Z" fill="#2a6a5a" stroke="#123a30" strokeWidth={10} />
          <path d="M -560 0 Q 0 40 560 0 Q 0 20 -560 0 Z" fill="#1a4a40" />
          {juncos && Array.from({ length: 30 }, (_, i) => { const x = -640 + i * 44; return <path key={i} d={`M ${x} 10 Q ${x + 6 + Math.sin(t * 2 + i) * 6} -60 ${x + 12} -110`} stroke="#5a8a3a" strokeWidth={8} fill="none" />; })}
        </g>
      </svg>
      {e > 0.5 && (
        <>
          <Tienda x={800} y={500} s={0.6} k={0} t={t} luz />
          <Tienda x={1040} y={490} s={0.7} k={1} t={t} luz />
          <Tienda x={1260} y={510} s={0.55} k={2} t={t} luz />
          <Fogata x={930} y={540} s={0.5} t={t} />
        </>
      )}
      <Drakkar x={330} y={700} s={0.5} t={t} vela={1} />
      <Drakkar x={1640} y={720} s={0.46} t={t} flip />
    </AbsoluteFill>
  );
};

// plano de Repton visto desde arriba: el Trent hace curva, la zanja en D cierra contra el río y la iglesia es el portón
export const PlanoRepton: React.FC<{ t: number; zanja?: number; iglesia?: number; flechas?: number; agua?: number }> = ({ t, zanja, iglesia = 1e9, flechas = 1e9, agua = 1e9 }) => {
  const u = zanja === undefined ? 1 : prog(t, zanja, zanja + 1.4);
  return (
    <AbsoluteFill style={{ background: "#2a5a4a" }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {/* campos (parcelas) */}
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={(i % 5) * 230 - 60} y={Math.floor(i / 5) * 360 - 40} width={210} height={330} rx={20} fill={i % 2 ? "#2f6450" : "#285646"} />)}
        {/* río Trent en curva */}
        <path d="M 1100 -60 Q 560 200 700 540 Q 840 900 1300 1140" stroke={V.rio2} strokeWidth={260} fill="none" />
        <path d="M 1100 -60 Q 560 200 700 540 Q 840 900 1300 1140" stroke={V.rio} strokeWidth={200} fill="none" />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${760 + Math.sin(i) * 60} ${i * 90 + ((t * 40) % 90)} l 50 10`} stroke="#bfe3ff" strokeWidth={6} opacity={0.4} />)}
        {t > agua && <path d="M 1100 -60 Q 560 200 700 540 Q 840 900 1300 1140" stroke="#bfe3ff" strokeWidth={30} fill="none" opacity={0.3 + 0.3 * Math.sin(t * 6)} />}
        {/* zanja en D: los dos extremos mueren en el río */}
        <path d="M 760 250 Q 200 540 760 830" stroke="#4a3326" strokeWidth={56} fill="none" pathLength={1000} strokeDasharray={`${u * 1000} 1000`} strokeLinecap="round" />
        <path d="M 760 250 Q 200 540 760 830" stroke="#7a5a3a" strokeWidth={18} fill="none" pathLength={1000} strokeDasharray={`${u * 1000} 1000`} strokeLinecap="round" transform="translate(28 0)" />
        {/* tiendas dentro */}
        {u > 0.95 && Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${560 + (i % 3) * 60} ${430 + Math.floor(i / 3) * 70} l 24 -40 l 24 40 Z`} fill="#d6c49a" stroke="#2a1530" strokeWidth={4} />)}
        {/* barcos contra la orilla */}
        {u > 0.95 && [380, 520, 660].map((y, i) => <path key={i} d={`M ${700 + i * 10} ${y} q 30 -14 60 0 q -30 14 -60 0 Z`} fill={V.madera} stroke="#2a1530" strokeWidth={4} transform={`rotate(70 ${730} ${y})`} />)}
        {/* iglesia = portón */}
        {t > iglesia && (
          <g transform={`translate(390 540) scale(${ent(t, iglesia)})`}>
            <rect x={-46} y={-30} width={92} height={60} fill={V.piedra} stroke="#2a1530" strokeWidth={6} />
            <rect x={-16} y={-60} width={32} height={36} fill={V.piedra} stroke="#2a1530" strokeWidth={6} />
            <path d="M -6 -60 L 6 -60 L 6 -74 L -6 -74 Z" fill="#2a1530" />
          </g>
        )}
        {/* flechas: el único camino */}
        {t > flechas && [0, 1, 2].map((i) => {
          const v = prog(t, flechas + i * 0.2, flechas + 0.7 + i * 0.2);
          const y = 420 + i * 120;
          return <g key={i}><line x1={-40} y1={y} x2={-40 + v * 300} y2={y + (540 - y) * v * 0.5} stroke={C.rojo} strokeWidth={16} strokeLinecap="round" strokeDasharray="34 20" />
            {v >= 1 && <path d={`M 270 ${y + (540 - y) * 0.5} l -34 -20 l 4 40 Z`} fill={C.rojo} />}</g>;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// reloj de 24 h: la parte oscura del día crece hasta 16 h
export const Reloj24: React.FC<{ t: number; t0: number; horas: number; x?: number; y?: number; r?: number }> = ({ t, t0, horas, x = 960, y = 540, r = 300 }) => {
  const e = ent(t, t0);
  const h = interpolate(t, [t0 + 0.3, t0 + 1.6], [0, horas], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // arriba = mediodía, abajo = medianoche: la noche ocupa h horas centradas abajo
  const ang = (hh: number) => -Math.PI / 2 + (hh / 24) * Math.PI * 2;
  const ini = ang(12 - h / 2), fin = ang(12 + h / 2);
  const big = h > 12 ? 1 : 0;
  return (
    <svg style={{ position: "absolute", left: x - r - 40, top: y - r - 40, transform: `scale(${e})` }} width={(r + 40) * 2} height={(r + 40) * 2} viewBox={`${-r - 40} ${-r - 40} ${(r + 40) * 2} ${(r + 40) * 2}`}>
      <circle r={r + 20} fill="#fff3d6" stroke="#2a1530" strokeWidth={14} />
      <circle r={r} fill="#ffd27a" />
      {h > 0 && <path d={`M 0 0 L ${Math.cos(ini) * r} ${Math.sin(ini) * r} A ${r} ${r} 0 ${big} 1 ${Math.cos(fin) * r} ${Math.sin(fin) * r} Z`} fill="#1b1240" />}
      {Array.from({ length: 24 }, (_, i) => <line key={i} x1={Math.cos(ang(i)) * (r - 10)} y1={Math.sin(ang(i)) * (r - 10)} x2={Math.cos(ang(i)) * (r - (i % 6 ? 26 : 50))} y2={Math.sin(ang(i)) * (r - (i % 6 ? 26 : 50))} stroke="#2a1530" strokeWidth={i % 6 ? 5 : 10} />)}
      <circle cx={0} cy={-r * 0.6} r={36} fill="#fff7c0" />
      {[0, 1, 2].map((i) => <circle key={i} cx={-40 + i * 50} cy={r * 0.55 + (i % 2) * 20} r={6} fill="#fff" />)}
      <circle r={16} fill="#2a1530" />
    </svg>
  );
};

// ciudad que crece desde el campamento (Dublín): tiendas → casas → ciudad
export const CrecePueblo: React.FC<{ t: number; t0: number; t1: number; x?: number; y?: number }> = ({ t, t0, t1, x = 960, y = 760 }) => {
  const u = prog(t, t0, t1);
  const r = rnd(41);
  const n = 22;
  return (
    <svg style={{ position: "absolute", left: x - 900, top: y - 600, overflow: "visible" }} width={1800} height={640}>
      {Array.from({ length: n }, (_, i) => {
        const bx = 60 + i * 78 + r() * 20;
        const etapa = u * 3 - (Math.abs(i - n / 2) / n) * 1.2;
        const h = 60 + r() * 220, col = ["#e8b98a", "#c9a3e8", "#9ad1d6", "#f2c4a0", "#b8d68a"][i % 5];
        if (etapa <= 0) return null;
        if (etapa < 1) return <path key={i} d={`M ${bx} 600 l 34 -60 l 34 60 Z`} fill="#d6c49a" stroke="#2a1530" strokeWidth={4} />;
        if (etapa < 2) return <g key={i}><rect x={bx} y={540} width={68} height={60} fill="#a8794a" stroke="#2a1530" strokeWidth={4} /><path d={`M ${bx - 8} 540 l 42 -36 l 42 36 Z`} fill="#7a5a3a" stroke="#2a1530" strokeWidth={4} /></g>;
        return <g key={i}><rect x={bx} y={600 - h} width={70} height={h} fill={col} stroke="#2a1530" strokeWidth={4} />
          {Array.from({ length: Math.floor(h / 50) }, (_, k) => <rect key={k} x={bx + 14} y={620 - h + k * 50} width={16} height={20} fill="#ffe28a" />)}
          {Array.from({ length: Math.floor(h / 50) }, (_, k) => <rect key={"b" + k} x={bx + 40} y={620 - h + k * 50} width={16} height={20} fill="#ffe28a" />)}</g>;
      })}
    </svg>
  );
};

// detector de metales sobre un campo: hallazgos que saltan del suelo (Torksey)
export const Hallazgo: React.FC<{ t: number; t0: number; x: number; y: number; children: React.ReactNode }> = ({ t, t0, x, y, children }) => {
  if (t < t0) return null;
  const u = Math.min(1, (t - t0) / 0.5);
  const salto = -Math.sin(u * Math.PI) * 120 - u * 140;
  return (
    <div style={{ position: "absolute", left: x, top: y + salto, transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * u}) rotate(${(1 - u) * 180}deg)` }}>
      {children}
      {t - t0 < 0.6 && <div style={{ position: "absolute", left: "50%", top: "50%", width: 240, height: 240, marginLeft: -120, marginTop: -120, borderRadius: "50%", border: "8px solid #fff3c4", transform: `scale(${(t - t0) * 2})`, opacity: 1 - (t - t0) / 0.6 }} />}
    </div>
  );
};

// texto de saga/crónica en pergamino (citas)
export const Cita: React.FC<{ t: number; t0: number; texto: string; autor?: string; x?: number; y?: number; w?: number; size?: number }> = ({ t, t0, texto, autor, x = 960, y = 540, w = 1200, size = 60 }) => {
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 14, stiffness: 150 });
  const n = Math.floor(interpolate(t, [t0 + 0.2, t0 + 0.2 + texto.length * 0.03], [0, texto.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `translate(-50%,-50%) scale(${e}) rotate(${(1 - e) * 4 - 1}deg)`, background: "#f4e6c4", border: "10px solid #8a5a32", borderRadius: 26, padding: "40px 56px", boxShadow: "0 18px 0 rgba(10,5,30,.45)" }}>
      <div style={{ fontFamily, fontWeight: 600, fontSize: size, color: "#3b2416", lineHeight: 1.25 }}>
        <span style={{ color: C.rojo, fontSize: size * 1.6, lineHeight: 0.5 }}>“</span>{texto.slice(0, n)}<span style={{ opacity: 0 }}>{texto.slice(n)}</span>
      </div>
      {autor && <div style={{ marginTop: 22, fontFamily, fontWeight: 700, fontSize: size * 0.6, color: "#8a5a32", textAlign: "right", opacity: n >= texto.length ? 1 : 0 }}>— {autor}</div>}
    </div>
  );
};

export { Llamas, Iglesia };
