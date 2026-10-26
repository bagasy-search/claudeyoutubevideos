import React from "react";
import { Sala } from "./sets";
import { Exterior } from "./escenas4";
import { NadieCuida } from "./escenas5";
import { AbsoluteFill } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Pergamino } from "./kit";
import { Fuerte, Ropa, Mula, Lluvia } from "./kit2";
import { Persona, CIVIL } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa, pant, FUERTE_V } from "./mundo";
import { Gr, Cu, Ch, T, ck, TUNGRO, AUX, Carro, Banio, TablillaGrande, Burbuja, gesto, Termometro, Actua } from "./kit3";

// TRAMPA 2 · EL CLIMA (182,6-331,2 s). Viajamos por el muro a la cresta del Whin Sill: viento del Atlántico, lluvia,
// llovizna, lluvia de costado, nieve; el barro que traba el carro; los pantalones; la capa británica; Vindolanda y sus
// tablillas (medias de mamá); el parte de 752 hombres; los ojos irritados; y el baño caliente que te salva.
const D = 182;
const M2 = MC(2);
const YO2 = M2 + 330;
const VX = FUERTE_V; // Vindolanda
const BX = VX + 2300; // baño, afuera del fuerte
const CX = M2 + 2600; // el carro en el barro
const tVin = T("we know about the socks", D);
const YOV = VX + 1050; // vos, ya en Vindolanda

export const keys2: K[] = [
  [183.0, 7000, 520, 0.32], [184.4, YO2, 470, 1.5], ck("the central part", D, M2 + 200, 540, 0.9), ck("it is beautiful", D, M2 + 200, 520, 0.42),
  ck("it is also exactly", D, YO2, 470, 1.55), ck("with nothing to stop", D, YO2 + 40, 470, 1.8), ck("it rains", D, YO2, 480, 1.2),
  ck("then it drizzles", D, YO2, 470, 1.35), ck("then it rains sideways", D, YO2 - 100, 490, 0.95), ck("it snows", D, YO2, 470, 1.5),
  ck("the roads turn into mud", D, CX, 780, 1.05), ck("one merchant", D, CX, 760, 1.2), ck("because the roads are so bad", D, CX + 60, 780, 1.4),
  ck("so you adapt", D, YO2, 470, 1.6), ck("you wear trousers", D, YO2, 520, 1.25), ck("on the wall", D, YO2 - 300, 500, 0.9),
  ck("you want wool", D, YO2, 470, 1.7), ck("a heavy hooded cloak", D, YO2, 480, 1.4), ck("britain became so famous", D, YO2, 480, 1.4),
  ck("we know about the socks", D, VX + 300, 640, 0.42), ck("just behind the line", D, VX, 660, 0.55), ck("in the 1970s", D, VX, 700, 0.7),
  ck("and one of them", D, YOV, 700, 1.15), ck("somewhere", D, YOV, 690, 1.3), ck("the cold does not only", D, YOV, 700, 1.6),
  ck("it makes you sick", D, YOV, 690, 1.9), ck("at vindolanda", D, VX, 640, 0.5, 1.2), ck("ten men", D, VX, 700, 0.6),
  ck("that was a real enemy", D, VX + 200, 700, 0.8), ck("the one thing that kept", D, BX, 640, 0.75), ck("every fort had one", D, BX - 300, 640, 0.5),
  ck("fires burning under", D, BX, 660, 0.8), ck("if you want to know", D, BX, 680, 1.0), ck("it was that hot room", D, BX, 660, 1.25), [331.0, BX, 650, 1.1],
];
export const amb2: [number, Pal][] = [[184.4, "gris"], [194.1, "dia"], [195.3, "gris"], [200.2, "tormenta"], [204.6, "nieve"], [206.3, "gris"], [244.4, "gris"], [312.7, "atardecer"]];
export const lluvia2: [number, number][] = [[184.4, 0.45], [193.9, 0.3], [194.2, 0], [195.4, 0.05], [200.2, 0.75], [201.2, 0.25], [202.4, 1], [204.2, 1], [205.0, 0], [206.4, 0.55], [217.2, 0.4], [244.4, 0.15], [312.5, 0], [331, 0]];
export const nieve2: [number, number][] = [[204.3, 0], [205.2, 1], [206.2, 0.9], [206.8, 0], [331, 0]];
export const sol2: [number, number, number][] = [[194.1, 1300, 220], [195.4, -999, 0], [312.7, 1500, 420]];

const BARRO = "#6b4a2f";
// capa de lana que FLAMEA con el viento (misma caja que Persona; se dibuja detrás). El viento sopla hacia la derecha de pantalla.
const CapaViento: React.FC<{ x: number; y: number; h: number; t: number; f: number; inclina?: number; flip?: boolean; color?: string }> = ({ x, y, h, t, f, inclina = 0, flip, color = "#3f6b2a" }) => {
  const S = h / 560, d = flip ? -1 : 1;
  const L = 120 + 190 * f, a = Math.sin(t * 13) * 26 * f, b = Math.sin(t * 13 - 1.4) * 38 * f, q = Math.sin(t * 9 + 2) * 20 * f;
  const X = (v: number) => (d * v).toFixed(1);
  const path = `M ${X(-62)} -352 L ${X(62)} -352 Q ${X(60 + L * 0.5)} ${-352 + a} ${X(60 + L)} ${-318 + b} L ${X(46 + L * 0.9)} ${-230 + b + q} L ${X(40 + L * 0.82)} ${-160 + b} Q ${X(L * 0.35)} ${-130 + a} ${X(-40)} -118 Q ${X(-96)} -230 ${X(-62)} -352 Z`;
  return (
    <svg style={{ position: "absolute", left: x - 300 * S, top: y - 640 * S, overflow: "visible" }} width={600 * S} height={680 * S} viewBox="-300 -640 600 680">
      <g transform={`scale(${flip ? -1 : 1} 1) rotate(${inclina} 0 -200)`}>
        <path d={path} fill={color} stroke="#2a4a1c" strokeWidth={6} strokeLinejoin="round" />
        <path d={`M ${X(10)} -340 Q ${X(40 + L * 0.5)} ${-320 + a} ${X(40 + L * 0.8)} ${-240 + b}`} stroke="#2a4a1c" strokeWidth={6} fill="none" opacity={0.5} />
      </g>
    </svg>
  );
};
// el muro sobre su cresta de roca negra, viento que llega del Atlántico (corte)
const Cresta: React.FC<{ t: number }> = ({ t }) => {
  const a = T("the wind sill", D), b = T("with cliffs facing north", D), c = T("it is also exactly", D);
  const p0 = T("the central part", D) + 0.6, up = prog(t, p0, p0 + 0.9);
  const xs = 905 + 330 * (1 - prog(t, p0 + 0.9, a + 1.6));
  // plano 2 (el viento): cámara cerca del soldado; cada ráfaga lo empuja y lo hace trastabillar
  const zoom = t > c - 0.3;
  const gol = [c + 0.2, T("the wind from the atlantic", D), T("arrives first", D), T("with nothing to stop", D) + 0.1];
  const rafaga = gol.reduce((m, g) => Math.max(m, t > g ? Math.exp(-(t - g) * 3.2) * Math.min(1, (t - g) / 0.12) : 0), 0);
  const empuje = zoom ? gol.reduce((m, g) => m + 55 * prog(t, g, g + 0.45), 0) : 0;
  const zz = zoom ? 1.65 + 0.12 * prog(t, c, c + 4.5) : 1;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#4f6488,#9fb2cc 60%,#d8dfe8)" }}>
      <div style={{ position: "absolute", left: 1380, top: 60, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,190,.55), rgba(255,236,190,0) 65%)" }} />
      {[0, 1, 2, 3].map((k) => <div key={"nb" + k} style={{ position: "absolute", left: ((t * (40 + k * 15) + k * 560) % 2400) - 300, top: 90 + k * 70, width: 260 + k * 40, height: 70, borderRadius: 40, background: "rgba(255,255,255,.55)" }} />)}
      <div style={{ position: "absolute", inset: 0, transform: zoom ? `translate(${960 - (905 + empuje * 0.6)}px, 110px) scale(${zz}) translateY(150px)` : "translateY(150px)", transformOrigin: `${905 + empuje * 0.6}px 300px` }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <defs>
          <linearGradient id="roca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a5866" /><stop offset="1" stopColor="#24222e" /></linearGradient>
          <clipPath id="risco"><path d={`M 0 1080 L 0 ${980 - 60 * up} L 420 ${960 - 120 * up} L 700 ${880 - 320 * up} L 760 ${880 - 420 * up} L 900 ${880 - 440 * up} L 1300 ${900 - 360 * up} L 1920 ${940 - 200 * up} L 1920 1080 Z`} /></clipPath>
        </defs>
        {/* colinas lejanas (Escocia al norte, Britania al sur) */}
        <path d={`M 0 ${700 + 40 * Math.sin(t * 0.05)} Q 300 600 640 690 T 1300 650 T 1920 700 L 1920 1080 L 0 1080 Z`} fill="#7d8fae" opacity={0.7} />
        <path d="M 0 800 Q 360 720 760 790 T 1500 760 T 1920 790 L 1920 1080 L 0 1080 Z" fill="#6b7f98" opacity={0.8} />
        {/* el risco: roca con estratos, grietas y luz en la cara sur */}
        <path d={`M 0 1080 L 0 ${980 - 60 * up} L 420 ${960 - 120 * up} L 700 ${880 - 320 * up} L 760 ${880 - 420 * up} L 900 ${880 - 440 * up} L 1300 ${900 - 360 * up} L 1920 ${940 - 200 * up} L 1920 1080 Z`} fill="url(#roca)" />
        <g clipPath="url(#risco)">
          {Array.from({ length: 12 }, (_, k) => <path key={k} d={`M 0 ${470 + k * 52} Q 480 ${450 + k * 52 + (k % 3) * 14} 960 ${480 + k * 52} T 1920 ${470 + k * 52}`} stroke="#000" strokeOpacity={0.22} strokeWidth={6} fill="none" />)}
          {[[560, 640], [680, 560], [820, 520], [610, 760], [740, 700]].map(([x, y], k) => <path key={"g" + k} d={`M ${x} ${y} l 18 50 l -14 40 l 22 60`} stroke="#15141c" strokeWidth={6} fill="none" strokeLinecap="round" />)}
          <path d={`M 900 ${880 - 440 * up} L 1300 ${900 - 360 * up} L 1920 ${940 - 200 * up} L 1920 1080 L 940 1080 Z`} fill="#fff" opacity={0.07} />
        </g>
        {/* pasto que cubre la ladera sur */}
        <path d={`M 940 ${1080} L 1920 1080 L 1920 ${940 - 200 * up} L 1300 ${900 - 360 * up} L 900 ${880 - 440 * up} L 960 ${900 - 400 * up} Z`} fill="#7fb34a" opacity={0.85} />
        {Array.from({ length: 22 }, (_, i) => { const x = 980 + i * 42, y0 = 900 - 440 * up + (x - 900) * (up * 80 / 400) + 30; return <path key={"h" + i} d={`M ${x} ${y0 + 40} l 6 -26 l 6 26`} stroke="#5f8f34" strokeWidth={5} fill="none" opacity={up} transform={`rotate(${Math.sin(t * 2 + i) * 6} ${x} ${y0 + 40})`} />; })}
        {/* la muralla sobre la cresta, con almenas */}
        <g opacity={up}>
          <path d={`M 700 ${880 - 320 * up} L 760 ${880 - 420 * up} L 900 ${880 - 440 * up} L 1300 ${900 - 360 * up} L 1300 ${900 - 360 * up - 70} L 900 ${880 - 440 * up - 70} L 760 ${880 - 420 * up - 70} L 700 ${880 - 320 * up - 70} Z`} fill="#c9b8a0" stroke="#8a7a64" strokeWidth={5} />
          {Array.from({ length: 14 }, (_, i) => { const x = 770 + i * 38, y = x < 900 ? 880 - 420 * up - 70 - (x - 760) * (20 * up / 140) : 880 - 440 * up - 70 + (x - 900) * (80 * up / 400); return <rect key={"a" + i} x={x} y={y - 26} width={22} height={28} fill="#c9b8a0" stroke="#8a7a64" strokeWidth={4} />; })}
        </g>
        {/* niebla que corre por el valle norte */}
        {[0, 1, 2].map((k) => <ellipse key={"n" + k} cx={((t * (30 + k * 12) + k * 700) % 2600) - 300} cy={760 + k * 70} rx={420} ry={60} fill="#e8eef6" opacity={0.35} />)}
        {t > c && Array.from({ length: 16 }, (_, i) => {
          const k = ((t - c) * 1.3 + i * 0.13) % 1;
          const y = 220 + (i % 8) * 50;
          return <path key={i} d={`M ${-300 + k * 2300} ${y} q 60 -18 120 0 t 120 0`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.75 * Math.sin(k * Math.PI)} />;
        })}
      </svg>
      {up > 0.5 && (() => {
        const g = gesto(t, [[a, "señala"], [T("it is beautiful", D) - 0.6, "festeja"], [b, "señala"], [c, "miedo"], [T("with nothing to stop", D), "tiembla"]]);
        const xx = xs + empuje;
        const yy = 880 - 440 * up - 66 + (xx - 900) * (80 * up / 400);
        const h = zoom ? 330 : 360;
        const inc = zoom ? -12 + 30 * rafaga : (g.inclina ?? 0) + 4 * Math.sin(t * 2.3);
        const fl = t < a + 1.6;
        return <>
          <CapaViento x={xx} y={yy} h={h} t={t} f={zoom ? 0.75 + 0.5 * rafaga : 0.45} inclina={inc} flip={fl} />
          <Persona {...g} x={xx + g.dx} y={yy} h={h} t={t} seed={3} ropa={TUNGRO} casco="legion" malla inclina={inc} camina={(t > p0 + 0.9 && t < a + 1.6) || rafaga > 0.35 ? 1.6 : 0} flip={fl} />
          {/* niebla que pasa POR DELANTE del soldado */}
          {!zoom && <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
            {[0, 1].map((k) => { const fx = 380 + (t - p0) * 330 - k * 1100; return <ellipse key={"nf" + k} cx={fx} cy={yy - 150 + k * 40} rx={420} ry={95} fill="#eef3f8" opacity={0.62} />; })}
            {[0, 1].map((k) => { const fx = 120 + (t - p0) * 260 - k * 1000; return <ellipse key={"nf2" + k} cx={fx} cy={yy - 40} rx={300} ry={60} fill="#f6f9fc" opacity={0.5} />; })}
          </svg>}
        </>;
      })()}
      </div>
      {/* ráfagas por delante (en pantalla, no en el zoom) */}
      {zoom && Array.from({ length: 14 }, (_, i) => {
        const k = ((t - c) * (1.6 + (i % 3) * 0.4) + i * 0.17) % 1;
        const y = 180 + ((i * 97) % 640);
        return <div key={"rf" + i} style={{ position: "absolute", left: -300 + k * 2400, top: y, width: 220 + (i % 4) * 60, height: 7, borderRadius: 4, background: "#fff", opacity: 0.7 * Math.sin(k * Math.PI) }} />;
      })}
      {zoom && [0, 1, 2, 3, 4].map((i) => {
        const k = ((t - c) * 0.9 + i * 0.21) % 1;
        return <div key={"hj" + i} style={{ position: "absolute", left: -100 + k * 2200, top: 300 + ((i * 131) % 400) + Math.sin(t * 6 + i) * 60, width: 34, height: 18, borderRadius: "50% 0", background: i % 2 ? "#7fb34a" : "#b58a3a", transform: `rotate(${t * 500 + i * 70}deg)` }} />;
      })}
      {!zoom && <div style={{ position: "absolute", left: 60, top: 60, fontFamily, fontWeight: 700, fontSize: 54, color: "#fff" }}>← NORTH</div>}
      {!zoom && <div style={{ position: "absolute", right: 60, top: 60, fontFamily, fontWeight: 700, fontSize: 54, color: "#fff" }}>SOUTH →</div>}
      {!zoom && t > Math.min(a, p0 + 0.5) && <Chip t={t} t0={Math.min(a, p0 + 0.5)} text="THE WHIN SILL" color="#2a2a36" x={1500} y={640} centro size={64} />}
      {!zoom && t > b && <Chip t={t} t0={b} t1={T("with nothing to stop", D) - 0.2} text="CLIFFS FACING NORTH" color={C.violeta} x={520} y={820} centro size={50} />}
      {t > c && <Chip t={t} t0={c} text="ATLANTIC WIND →" color={C.teal} tinta={C.noche} x={380} y={170} centro size={62} />}
      {t > T("with nothing to stop", D) && <Grande t={t} t0={T("with nothing to stop", D)} text="NOTHING TO STOP IT" y={880} size={84} color={C.ambar} />}
    </AbsoluteFill>
  );
};

// ── 3:30 · el mercader: el carro con la rueda ROTA hundido en el barro; él la golpea de bronca; la mula no puede tirar
const RuedaRota: React.FC<{ x: number; y: number; r: number; rot: number }> = ({ x, y, r, rot }) => (
  <svg style={{ position: "absolute", left: x - r - 20, top: y - r - 20, overflow: "visible" }} width={2 * r + 40} height={2 * r + 40} viewBox={`${-r - 20} ${-r - 20} ${2 * r + 40} ${2 * r + 40}`}>
    <g transform={`rotate(${rot})`}>
      <path d={`M ${r} 0 A ${r} ${r} 0 1 1 ${-r * 0.5} ${-r * 0.866}`} fill="none" stroke="#9a5a2a" strokeWidth={r * 0.24} strokeLinecap="round" />
      <path d={`M ${-r * 0.2} ${-r * 0.98} L ${r * 0.18} ${-r * 0.82} L ${r * 0.5} ${-r * 1.0}`} fill="none" stroke="#9a5a2a" strokeWidth={r * 0.2} strokeLinecap="round" />
      {[0, 60, 150].map((a) => <line key={a} x1={0} y1={0} x2={r * 0.92} y2={0} stroke="#9a5a2a" strokeWidth={r * 0.13} transform={`rotate(${a})`} />)}
      <line x1={0} y1={0} x2={r * 0.45} y2={0} stroke="#9a5a2a" strokeWidth={r * 0.13} transform="rotate(-100)" />
      <circle r={r * 0.22} fill="#3a2418" />
    </g>
  </svg>
);
const Barro: React.FC<{ t: number }> = ({ t }) => {
  const a = T("one merchant", D), g = T("would have collected", D), m = T("did not want", D), z = T("because the roads are so bad", D);
  const G = gesto(t, [[a, "enojado"], [T("complains that", D), "habla"], [g, "golpea"], [m, "señala"], [z, "triste"]]);
  // golpes: cada vez que el brazo baja, la rueda salta y salpica barro
  const golpeando = t > g && t < m;
  const fase = golpeando ? ((t - g) * 9) / Math.PI : 0;
  const k = golpeando ? 1 - (fase % 1) : 0;
  const sacude = golpeando ? Math.sin(Math.min(1, (fase % 1) * 3) * Math.PI) * 10 : 0;
  const tira = t > a + 0.6; // la mula tira y no se mueve
  return (
    <AbsoluteFill>
      <Exterior t={t} tono="gris" horizonte={540} viento={1.4} pasto={false}>
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <path d="M 0 760 Q 480 730 960 750 T 1920 740 L 1920 1080 L 0 1080 Z" fill="#6b4a2f" />
          <path d="M 0 800 Q 480 780 960 800 T 1920 790" stroke="#4a3220" strokeWidth={10} fill="none" />
          {[[300, 960, 220], [1180, 1000, 260], [1700, 930, 150], [760, 1040, 200]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.14} fill="#8aa0b8" opacity={0.55} />)}
          {[[300, 960, 220], [1180, 1000, 260], [1700, 930, 150]].map(([x, y, r], i) => { const q = (t * 1.3 + i * 0.37) % 1; return <ellipse key={"o" + i} cx={x + 40 - i * 30} cy={y} rx={20 + q * 70} ry={(20 + q * 70) * 0.18} fill="none" stroke="#dfe8f2" strokeWidth={3} opacity={1 - q} />; })}
        </svg>
        {/* soga del carro a la mula, tensa */}
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <line x1={1110} y1={790} x2={1280 + (tira ? Math.sin(t * 7) * 6 : 0)} y2={790} stroke="#3a2418" strokeWidth={8} />
        </svg>
        <Mula x={1470 + (tira ? Math.sin(t * 7) * 6 : 0)} y={800} t={t} s={0.95} camina={tira ? 1.8 : 0} carga={false} />
        {tira && [0, 1, 2].map((i) => { const q = (t * 1.6 + i / 3) % 1; return <div key={"sp" + i} style={{ position: "absolute", left: 1330 - q * 60, top: 930 - Math.sin(q * Math.PI) * 60, width: 26, height: 22, borderRadius: "50%", background: "#4a3220", opacity: 1 - q }} />; })}
        {/* el carro, hundido de un lado */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `rotate(-7deg) translateY(${sacude * 0.4}px)`, transformOrigin: "1000px 860px" }}>
          <svg style={{ position: "absolute", left: 880 - 308, top: 760 - 198, overflow: "visible" }} width={616} height={396} viewBox="-280 -180 560 360">
            {[-110, 20].map((x) => <g key={x}><path d={`M ${x - 50} -20 Q ${x - 64} -80 ${x - 50} -150 L ${x + 50} -150 Q ${x + 64} -80 ${x + 50} -20 Z`} fill="#a8622c" /><line x1={x - 56} y1={-110} x2={x + 56} y2={-110} stroke="#5d6577" strokeWidth={10} /><line x1={x - 56} y1={-60} x2={x + 56} y2={-60} stroke="#5d6577" strokeWidth={10} /></g>)}
            <rect x={-220} y={-30} width={440} height={80} rx={10} fill="#8a5a2a" />
            <rect x={-220} y={-30} width={440} height={16} fill="#a8783a" />
            <line x1={220} y1={10} x2={300} y2={-10} stroke="#6b3a1f" strokeWidth={14} />
            {/* eje izquierdo sin rueda, clavado en el barro */}
            <rect x={-150} y={40} width={40} height={70} fill="#3a2418" />
            <g transform="translate(130 90)"><circle r={70} fill="none" stroke="#5a3418" strokeWidth={18} />{[0, 60, 120].map((a) => <line key={a} x1={-66} y1={0} x2={66} y2={0} stroke="#5a3418" strokeWidth={10} transform={`rotate(${a})`} />)}<circle r={16} fill="#3a2418" /></g>
          </svg>
        </div>
        {/* la rueda rota, caída en el barro, al lado del carro */}
        <div style={{ position: "absolute", left: 470, top: 960, width: 300, height: 60, borderRadius: "50%", background: "#4a3220" }} />
        <RuedaRota x={620} y={920 - sacude} r={95} rot={-20 + sacude * 2} />
        {golpeando && k > 0.7 && [0, 1, 2, 3, 4].map((i) => <div key={"b" + i} style={{ position: "absolute", left: 620 + Math.cos(i * 1.3 + 0.5) * (1 - k) * 600, top: 880 - Math.sin(i * 0.6 + 0.4) * (1 - k) * 400, width: 30, height: 26, borderRadius: "50%", background: "#4a3220" }} />)}
        <Persona {...G} {...(golpeando ? { bD: 40 + 85 * (1 - k), cD: 10, bI: 30, cI: 60, expr: "enojado" as const, habla: true } : {})} x={360 + G.dx} y={1000} h={440} t={t} seed={81} ropa={CIVIL(3)} inclina={(G.inclina ?? 0) + (golpeando ? 6 + 8 * k : 0)}
          manoD={<g transform="rotate(-70)"><line x1={0} y1={0} x2={0} y2={150} stroke="#6b3a1f" strokeWidth={14} strokeLinecap="round" /></g>} />
        <Lluvia t={t} n={110} angulo={16} op={0.5} />
      </Exterior>
      <TablillaGrande t={t} t0={a + 0.4} x={1555} y={300} w={640} vel={30} titulo="VINDOLANDA TABLET"
        lineas={["“I would have collected", "the goods… but I did not", "want to injure the animals", "while the roads are bad.”"]} />
      {t > z && <Chip t={t} t0={z} text="ROADS TOO BAD TO MOVE" color="#4a3220" x={560} y={160} centro size={50} />}
    </AbsoluteFill>
  );
};

// ── 3:40 · te ponés pantalones y los compañeros se matan de risa señalándote (cuerpos enteros, nada los tapa)
const Pantalon2: React.FC<{ t: number }> = ({ t }) => {
  const t0 = T("so you adapt", D), np = T("no proper roman", D), tP = T("you wear trousers", D);
  const puesto = t > tP;
  const G = gesto(t, [[t0, "habla"], [np, "niega"], [tP - 0.6, "encoge"], [tP + 0.15, "sorpresa"], [tP + 0.8, "encoge"]]);
  // mira a los costados (a escondidas) antes de ponérselos
  const mira = t < tP - 0.6 ? Math.sin((t - t0) * 2.4) : -0.8;
  const risa = (i: number) => {
    if (t < tP + 0.1) return { ...gesto(t, [[t0 + 0.2 + i * 0.2, "habla"], [np, "lee"]]), mira: -0.8 };
    const d = t - tP - 0.1;
    return { expr: "feliz" as const, habla: true, bD: 112 + Math.sin(d * 7 + i) * 8, cD: 6, bI: 30 + Math.abs(Math.sin(d * 9 + i)) * 40, cI: 120, inclina: -8 + Math.sin(d * 10 + i * 2) * 9, salta: tP + 0.1 + Math.floor(d / 0.7) * 0.7 + i * 0.2, ladea: Math.sin(d * 12 + i) * 8, mira: -1 };
  };
  return (
    <AbsoluteFill>
      <Sala t={t} tono="piedra" ventana="izq" />
      {/* perchero con la ropa de lana */}
      <div style={{ position: "absolute", left: 1040, top: 300, width: 16, height: 520, background: "#6b3a1f" }} />
      <div style={{ position: "absolute", left: 980, top: 300, width: 136, height: 16, background: "#6b3a1f", borderRadius: 8 }} />
      {!puesto && t < tP - 0.5 && <svg style={{ position: "absolute", left: 990, top: 316, overflow: "visible" }} width={120} height={160}><path d="M 14 0 L 106 0 L 112 150 L 74 150 L 60 46 L 46 150 L 8 150 Z" fill="#6b4a2f" stroke="#3a2410" strokeWidth={5} /></svg>}
      {t > tP - 0.5 && t < tP + 0.1 && (() => {
        const k = prog(t, tP - 0.5, tP);
        return <svg style={{ position: "absolute", left: 1050 - 290 * k - 60, top: 316 + 500 * k - 140 * Math.sin(k * Math.PI), overflow: "visible", transform: `rotate(${k * 360}deg)` }} width={120} height={160}><path d="M 14 0 L 106 0 L 112 150 L 74 150 L 60 46 L 46 150 L 8 150 Z" fill="#6b4a2f" stroke="#3a2410" strokeWidth={5} /></svg>;
      })()}
      <Persona {...G} x={700 + G.dx} y={1010} h={560} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon={puesto ? "#6b4a2f" : undefined} mira={mira} />
      {puesto && <div style={{ position: "absolute", left: 700 - 110, top: 1010 - 210, width: 220, height: 230, border: `10px solid ${C.ambar}`, borderRadius: 30, opacity: Math.min(1, (t - tP) / 0.2) * (0.7 + 0.3 * Math.sin(t * 8)) }} />}
      <Persona {...risa(0)} x={1360} y={1010} h={470} t={t} seed={46} ropa={AUX(2)} casco="legion" flip />
      <Persona {...risa(1)} x={1660} y={1010} h={440} t={t} seed={47} ropa={AUX(5)} casco="legion" malla flip />
      {puesto && [0, 1].map((i) => { const on = Math.floor((t - tP) / 0.35 + i) % 2 === 0; return <div key={i} style={{ position: "absolute", left: [1250, 1560][i], top: 340 + (on ? -8 : 0), fontFamily, fontWeight: 700, fontSize: 52, color: "#fff", WebkitTextStroke: "8px #2a1530", paintOrder: "stroke fill", transform: `rotate(${i ? 8 : -8}deg) scale(${ent(t, tP + 0.2 + i * 0.2)})` }}>HA HA!</div>; })}
    </AbsoluteFill>
  );
};
// ── 4:38 · el frío: vaho en cada frase, el termómetro baja EN VIVO, y al final estornuda (enfermo)
const Frio2: React.FC<{ t: number }> = ({ t }) => {
  const s0 = T("somewhere", D), cf = T("the cold does not only", D), sk = T("it makes you sick", D), fin = T("at vindolanda", D);
  const G = gesto(t, [[s0, "triste"], [T("a mother in a warmer", D), "lee"], [T("knew exactly", D), "triste"], [cf, "tiembla"], [T("miserable", D), "encoge"], [sk, "sorpresa"], [sk + 0.6, "tiembla"]]);
  const X = 640, Y = 1010, H = 540, S = H / 560;
  // vaho: una nube cada vez que arranca una frase + respiración cada 0,9 s
  const golpes = [s0, T("a mother in a warmer", D), T("knew exactly", D), cf, T("miserable", D), sk, sk + 0.5].concat(Array.from({ length: 9 }, (_, i) => s0 + 0.45 + i * 0.9));
  const temp = t < cf ? 9 : 9 - 12 * prog(t, cf, fin);
  const v = Math.round(temp);
  const f = Math.max(0.06, Math.min(1, (v + 5) / 45));
  const estornudo = t > sk && t < sk + 0.8;
  return (
    <AbsoluteFill>
      <Exterior t={t} tono="gris" horizonte={600} viento={1.6}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 200, background: "repeating-linear-gradient(90deg,#b9ad98 0 118px,#a89c86 118px 122px)", borderTop: "14px solid #eef3f8" }} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <div key={i} style={{ position: "absolute", left: i * 260 + 40, top: 500, width: 120, height: 70, background: "#b9ad98", borderTop: "12px solid #eef3f8" }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: "linear-gradient(180deg,#e8eef4,#c8d4e0)" }} />
      </Exterior>
      <CapaViento x={X} y={Y} h={H} t={t} f={0.3} inclina={G.inclina} />
      <Persona {...G} x={X + G.dx} y={Y} h={H} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" expr={t > sk + 0.6 ? "triste" : G.expr} />
      {golpes.map((g, i) => {
        if (t < g || t > g + 1.6) return null;
        const k = (t - g) / 1.6, big = i < 7;
        return <div key={i} style={{ position: "absolute", left: X + 60 * S + k * (big ? 260 : 150), top: Y - 395 * S - k * 90 - 30, width: (big ? 90 : 55) + k * (big ? 170 : 90), height: (big ? 60 : 36) + k * (big ? 110 : 60), borderRadius: "50%", background: "#f4f9ff", opacity: 0.85 * (1 - k), border: "4px solid rgba(160,190,220,.6)" }} />;
      })}
      {estornudo && <div style={{ position: "absolute", left: X + 190, top: Y - 470 * S - 120, fontFamily, fontWeight: 700, fontSize: 64, color: "#fff", WebkitTextStroke: "9px #2a1530", paintOrder: "stroke fill", transform: `scale(${ent(t, sk)}) rotate(-6deg)` }}>ACHOO!</div>}
      {Array.from({ length: 60 }, (_, i) => { const k = (t * (0.18 + (i % 5) * 0.03) + i * 0.137) % 1; return <div key={"n" + i} style={{ position: "absolute", left: ((i * 173) % 2000) - 40 + Math.sin(t * 2 + i) * 30 + k * 160, top: k * 1100 - 20, width: 10 + (i % 3) * 5, height: 10 + (i % 3) * 5, borderRadius: "50%", background: "#fff", opacity: 0.85 }} />; })}
      {t > cf - 0.3 && (() => {
        const e = ent(t, cf - 0.3), col = v > 5 ? C.naranja : "#4ab8ff", s = 1.25, x = 1560, y = 560;
        return <div style={{ position: "absolute", left: x - 70 * s, top: y - 260 * s, width: 140 * s, height: 420 * s, transform: `scale(${e})` }}>
          <div style={{ position: "absolute", left: 40 * s, top: 0, width: 60 * s, height: 320 * s, borderRadius: 30 * s, background: "#fff", border: `${6 * s}px solid #2a1530` }} />
          <div style={{ position: "absolute", left: 56 * s, top: (16 + 290 * (1 - f)) * s, width: 28 * s, height: 290 * f * s, borderRadius: 14 * s, background: col }} />
          <div style={{ position: "absolute", left: 20 * s, top: 290 * s, width: 100 * s, height: 100 * s, borderRadius: "50%", background: col, border: `${6 * s}px solid #2a1530` }} />
          {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 100 * s, top: (40 + i * 56) * s, width: 24 * s, height: 6 * s, background: "#2a1530" }} />)}
          <div style={{ position: "absolute", left: -80 * s, width: 300 * s, top: 400 * s, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 70 * s, color: "#fff", WebkitTextStroke: `${8 * s}px #2a1530`, paintOrder: "stroke fill" }}>{v}°C</div>
        </div>;
      })()}
      <Burbuja t={t} t0={T("a mother in a warmer", D)} t1={cf - 0.15} x={1360} y={380} r={250}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg,#ffb347,#ffe0a0)" }}>
          <div style={{ position: "absolute", left: 300, top: 40, width: 120, height: 120, borderRadius: "50%", background: "#fff2b0" }} />
          <Persona x={250} y={480} h={360} t={t} seed={72} ropa={CIVIL(1)} mujer {...gesto(t, [[T("a mother in a warmer", D), "habla"], [T("knew exactly", D), "triste"]])} manoD={<path d="M -40 -60 L 40 -60 L 40 30 Q 80 40 70 70 L -20 70 Z" fill="#c9a0e8" />} />
        </AbsoluteFill>
      </Burbuja>
    </AbsoluteFill>
  );
};
// ── 4:47 · el escriba anota el parte de fuerza en una tablilla, con la lámpara encendida
const Escriba: React.FC<{ t: number }> = ({ t }) => {
  const a = T("at vindolanda", D), r = T("a strength report", D), u = T("a whole unit", D);
  const G = gesto(t, [[a - 0.1, "escribe"], [r, "señala"], [r + 0.8, "escribe"], [u, "lee"]]);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="calido" ventana="der" />
      <div style={{ position: "absolute", left: 380, top: 760, width: 760, height: 46, borderRadius: 10, background: "#8a5a2a", boxShadow: "0 14px 0 rgba(0,0,0,.25)" }} />
      {[430, 1060].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 800, width: 34, height: 230, background: "#6b3a1f" }} />)}
      <div style={{ position: "absolute", left: 950 - 110, top: 600, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,220,140,.75), rgba(255,220,140,0) 70%)" }} />
      <svg style={{ position: "absolute", left: 900, top: 680, overflow: "visible" }} width={100} height={80}><path d="M 10 60 Q 50 90 90 60 L 80 50 L 20 50 Z" fill="#b5452c" /><path d={`M 50 50 Q ${40 + Math.sin(t * 17) * 4} 22 50 ${8 + Math.sin(t * 23) * 3} Q ${60 + Math.sin(t * 13) * 4} 22 50 50 Z`} fill="#ffb020" /></svg>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 700 + i * 8, top: 730 - i * 14, width: 160, height: 34, background: "#c9a46a", border: "4px solid #8a6a3a", borderRadius: 5 }} />)}
      <Persona {...G} x={560 + G.dx} y={1010} h={520} t={t} seed={92} ropa={{ ...AUX(4), tunica: "#e8dcc0", tunica2: "#b8a888" }} casco="no" mira={0.6}
        manoD={<g transform="rotate(-30)"><line x1={0} y1={0} x2={0} y2={70} stroke="#3a2418" strokeWidth={8} /></g>} />
      <TablillaGrande t={t} t0={a + 0.3} x={1300} y={560} w={820} vel={30} titulo="RENUNTIUM · VINDOLANDA"
        lineas={["Strength report of the", "1st Cohort of Tungrians:", "total… present… unfit…"]} />
      <Chip t={t} t0={r} text="A STRENGTH REPORT" color={C.violeta} x={1300} y={160} centro size={62} />
    </AbsoluteFill>
  );
};
// Siria al sol vs. el muro
const Siria: React.FC<{ t: number }> = ({ t }) => {
  const a = T("if you come from syria", D), b = T("this is going to hurt", D);
  const k = prog(t, b - 0.1, b + 0.3);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${k > 0.5 ? "#55607a" : "#ffb347"}, ${k > 0.5 ? "#8b95aa" : "#ffe0a0"})` }}>
      <div style={{ position: "absolute", left: 1300, top: 140, width: 300, height: 300, borderRadius: "50%", background: "#fff2b0", transform: `scale(${1 - k})` }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M 0 820 Q 480 740 960 800 T 1920 790 L 1920 1080 L 0 1080 Z" fill={k > 0.5 ? "#6d8a4a" : "#e8c27a"} />
        {[360, 1560].map((x) => <g key={x} opacity={1 - k}><rect x={x - 12} y={560} width={24} height={260} fill="#8a5a2a" />{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={x + Math.cos(i * 1.3) * 90} cy={560 + Math.sin(i * 1.3) * 30} rx={110} ry={26} fill="#3f8a3a" transform={`rotate(${i * 40 - 80} ${x} 560)`} />)}</g>)}
        {k > 0 && Array.from({ length: 70 }, (_, i) => { const kk = (t * 2.2 + i * 0.137) % 1; const x = (i * 97) % 1920; return <line key={i} x1={x} y1={kk * 1080} x2={x + 20} y2={kk * 1080 + 50} stroke="#d6e6ff" strokeWidth={5} opacity={k} />; })}
      </svg>
      {(() => { const g = gesto(t, [[a, "festeja"], [b, "tiembla"]]); return <Persona {...g} x={900 + g.dx} y={880} h={460} t={t} seed={24} ropa={AUX(1)} casco="legion" malla />; })()}
      <Termometro t={t} t0={a} de={35} a={6} dur={0.4} x={1560} y={560} s={1.1} />
      <Chip t={t} t0={a} text={k > 0.5 ? "BRITAIN · 6°C · RAIN" : "SYRIA · 35°C"} color={k > 0.5 ? "#2a2350" : C.naranja} x={960} y={150} centro size={76} />
    </AbsoluteFill>
  );
};
// romanos de toga que se burlan de los pantalones
const Burla: React.FC<{ t: number }> = ({ t }) => {
  const a = T("for centuries", D);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="calido" />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {[300, 520, 1400, 1620].map((x) => <rect key={x} x={x - 40} y={260} width={80} height={620} fill="#f6efe2" stroke="#c9b8a0" strokeWidth={6} />)}
        <rect x={0} y={880} width={1920} height={200} fill="#c9b8a0" />
      </svg>
      {[0, 1, 2].map((i) => <Persona key={i} x={420 + i * 230} y={880} h={360} t={t} seed={70 + i} ropa={{ ...CIVIL(i), tunica: "#f6efe2", tunica2: "#d8cfbf" }} expr="feliz" habla bD={i === 1 ? 110 : 20} cD={10} mira={0.8} viejo={i === 0} />)}
      <Persona x={1360} y={880} h={360} t={t} seed={31} ropa={AUX(3)} pantalon="#6b4a2f" expr="triste" mira={-0.6} />
      <Chip t={t} t0={a + 0.3} text="“BARBARIAN CLOTHES!”" color={C.rojo} x={660} y={220} centro size={64} />
      <Emote t={t} t0={a + 0.6} tipo="sudor" x={1400} y={420} s={0.8} />
      {t > T("romans had mocked", D) + 0.6 && <div style={{ position: "absolute", left: 1240, top: 690, width: 240, height: 240, border: `14px solid ${C.rojo}`, borderRadius: "50%", transform: `scale(${ent(t, T("romans had mocked", D) + 0.6)})` }} />}
    </AbsoluteFill>
  );
};
// edicto de precios: el soldado entero a la derecha señala el BIRRUS, que se enciende en amarillo y crece
const Edicto: React.FC<{ t: number }> = ({ t }) => {
  const a = T("much later", D) - 0.1, b = T("british hooded cloak", D);
  const hk = prog(t, b, b + 0.35);
  const pulso = t > b ? 1 + 0.03 * Math.sin((t - b) * 7) : 1;
  return (
    <AbsoluteFill>
      <Sala t={t} tono="violeta" />
      <div style={{ position: "absolute", left: 90, top: 110, width: 1180, height: 820, background: "#f6e3b4", borderRadius: 20, border: "10px solid #8a5a2a", transform: `scale(${ent(t, a)}) rotate(-1.2deg)`, boxShadow: "0 18px 0 rgba(20,8,40,.35)" }}>
        <div style={{ textAlign: "center", fontFamily, fontWeight: 700, fontSize: 50, color: "#7a3d14", marginTop: 30 }}>EDICT ON MAXIMUM PRICES · AD 301</div>
        {["WHEAT · 1 MODIUS ........ 100", "BEER · 1 SEXTARIUS ........ 4", "SOLDIER'S BOOTS ........ 100", "BIRRUS BRITANNICUS ........ 6,000", "SALT · 1 MODIUS ........ 100"].map((l, i) => {
          const hl = i === 3 && t > b;
          return <div key={i} style={{ position: "relative", marginLeft: 50, marginTop: 34, fontFamily, fontWeight: 700, fontSize: 48, color: hl ? C.noche : t > b && i !== 3 ? "rgba(74,42,23,.45)" : "#4a2a17", background: hl ? C.ambar : "transparent", width: 1040, padding: "6px 14px", borderRadius: 12, opacity: t > a + 0.3 + i * 0.2 ? 1 : 0, transform: hl ? `scale(${(1 + 0.1 * hk) * pulso})` : undefined, transformOrigin: "30% 50%", boxShadow: hl ? `0 0 ${40 * hk}px ${14 * hk}px rgba(255,200,60,.85)` : undefined, zIndex: hl ? 2 : 1 }}>{l}</div>;
        })}
      </div>
      {/* el soldado, entero, a la derecha del edicto */}
      <CapaViento x={1590} y={1000} h={540} t={t} f={0.08} flip />
      {(() => { const G = gesto(t, [[a + 0.2, "lee"], [b - 0.3, "señala"], [b + 1.4, "festeja"], [T("all on its own", D), "habla"]]); return <Persona {...G} x={1590 + G.dx} y={1000} h={540} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" flip mira={-0.8} />; })()}
      {t > b && t < b + 1.6 && [0, 1, 2, 3, 4, 5].map((i) => { const k = prog(t, b + i * 0.05, b + 0.6 + i * 0.05); return <div key={i} style={{ position: "absolute", left: 1090 + Math.cos(i) * 140 * k, top: 556 + Math.sin(i * 1.7) * 90 * k, width: 18, height: 18, borderRadius: "50%", background: C.ambar, opacity: 1 - k }} />; })}
      {t > b && <Chip t={t} t0={b + 0.2} text="THE BRITISH HOODED CLOAK" color={C.ambar} tinta={C.noche} x={680} y={1005} centro size={54} />}
    </AbsoluteFill>
  );
};
// excavación: corte del pozo con estratos, escalera, pala y cubeta; el arqueólogo BAJA y saca tablillas del barro
const Excava: React.FC<{ t: number }> = ({ t }) => {
  const a = T("in the 1970s", D), b = T("hundreds of them", D), c = T("preserved in wet", D), sl = T("thin slivers of wood", D);
  const SUP = 430; // nivel del suelo
  const baja = prog(t, a - 0.25, a + 1.0);
  const enPozo = baja >= 1;
  const n = t > b ? Math.min(46, Math.floor((t - b) * 30)) : Math.min(7, Math.floor(Math.max(0, t - sl) * 2.6));
  const G = gesto(t, [[a - 0.3, "carga"], [a + 1.0, "camina"], [a + 1.7, "cava"], [sl + 0.2, "sorpresa"], [sl + 0.9, "cava"], [T("letters", D), "lee"], [b, "festeja"], [c, "señala"]]);
  const ax = 780 + 260 * prog(t, a + 1.0, a + 1.7) - 30 * (1 - baja), ay = SUP + 40 + (930 - SUP - 40) * baja;
  const cav = enPozo && t > sl && t < b ? Math.abs(Math.sin(t * 7)) : 0;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#8fc3e8,#d4eef7 40%)" }}>
      <div style={{ position: "absolute", left: 1380, top: -120, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,190,.95) 0 12%, rgba(255,240,190,.35) 15%, rgba(255,240,190,0) 62%)" }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {/* estratos con piedras */}
        {[["#7fb34a", 0], ["#9a7a4a", 60], ["#7a5634", 210], ["#5a3c24", 380], ["#3e2a1a", 520]].map(([col, dy], i) => <path key={i} d={`M 0 ${SUP + (dy as number) + 12 * Math.sin(i)} Q 480 ${SUP + (dy as number) - 14} 960 ${SUP + (dy as number) + 10} T 1920 ${SUP + (dy as number)} L 1920 1080 L 0 1080 Z`} fill={col as string} />)}
        {Array.from({ length: 26 }, (_, i) => <ellipse key={"p" + i} cx={(i * 211) % 1900 + 10} cy={SUP + 90 + ((i * 137) % 560)} rx={14 + (i % 4) * 8} ry={9 + (i % 3) * 5} fill="#2a1c10" opacity={0.35} />)}
        {/* el pozo: más oscuro, con paredes en escalón */}
        <path d={`M 620 ${SUP} L 1400 ${SUP} L 1380 ${SUP + 180} L 1400 ${SUP + 180} L 1380 960 L 640 960 L 620 ${SUP + 300} L 640 ${SUP + 300} Z`} fill="rgba(20,12,8,.42)" />
        <path d={`M 640 960 L 1380 960`} stroke="#2a1c10" strokeWidth={8} />
        {/* cuerdas de cuadrícula arqueológica */}
        {[0, 1, 2, 3].map((i) => <line key={"c" + i} x1={620 + i * 260} y1={SUP - 30} x2={620 + i * 260} y2={SUP + 10} stroke="#f2ead8" strokeWidth={6} />)}
        <line x1={600} y1={SUP - 22} x2={1420} y2={SUP - 22} stroke="#f2ead8" strokeWidth={4} />
        {/* escalera apoyada en la pared del pozo */}
        <g transform={`rotate(-12 760 ${SUP})`}>{[0, 1].map((k) => <line key={k} x1={720 + k * 80} y1={SUP - 90} x2={720 + k * 80} y2={950} stroke="#a8783a" strokeWidth={12} />)}{Array.from({ length: 9 }, (_, i) => <line key={i} x1={720} y1={SUP - 40 + i * 62} x2={800} y2={SUP - 40 + i * 62} stroke="#a8783a" strokeWidth={9} />)}</g>
        {/* pala clavada en el montículo, cubeta y carretilla en el borde */}
        <path d={`M 80 ${SUP} Q 200 ${SUP - 110} 320 ${SUP} Z`} fill="#7a5634" />
        <g transform={`translate(-220 0) rotate(18 420 ${SUP - 60})`}><line x1={420} y1={SUP - 230} x2={420} y2={SUP - 60} stroke="#a8783a" strokeWidth={12} /><path d={`M 392 ${SUP - 70} L 448 ${SUP - 70} L 440 ${SUP} L 400 ${SUP} Z`} fill="#8e96a6" /><rect x={396} y={SUP - 248} width={48} height={14} rx={6} fill="#a8783a" /></g>
        <g transform={`translate(1520 ${SUP})`}><path d="M -60 -100 L 60 -100 L 46 0 L -46 0 Z" fill="#5d6577" /><path d="M -60 -100 Q 0 -170 60 -100" stroke="#3a3f4a" strokeWidth={7} fill="none" /><ellipse cx={0} cy={-100} rx={60} ry={14} fill="#4a3220" /></g>
        <g transform={`translate(1760 ${SUP})`}><path d="M -110 -80 L 90 -80 L 60 -10 L -80 -10 Z" fill="#8a5a2a" /><circle cx={-60} cy={-6} r={22} fill="#3a2418" /><line x1={90} y1={-70} x2={160} y2={-20} stroke="#6b3a1f" strokeWidth={10} /></g>
      </svg>
      {/* tablillas que asoman del barro, brillan y saltan al montón */}
      {Array.from({ length: n }, (_, i) => {
        const x = 700 + ((i * 137) % 600), y = 900 - ((i * 53) % 150);
        const tt = i < 7 ? sl + i / 2.6 : b + (i - 7) / 30;
        const e = prog(t, tt, tt + 0.35);
        return <div key={i} style={{ position: "absolute", left: x, top: y - 30 * e, width: 110, height: 50, background: "#c9a46a", border: "4px solid #8a6a3a", borderRadius: 6, transform: `rotate(${(i * 23) % 30 - 15}deg) scale(${0.6 + 0.4 * e})`, boxShadow: `0 0 ${24 * (1 - e) + 6}px rgba(255,230,140,${0.9 - 0.5 * e})` }}><div style={{ margin: "12px 10px", height: 4, background: "#1d120a", opacity: 0.7 }} /><div style={{ margin: "0 10px", height: 4, width: 60, background: "#1d120a", opacity: 0.7 }} /></div>;
      })}
      <Persona {...G} x={ax + G.dx} y={ay} h={430} t={t} seed={77} ropa={CIVIL(2)} camina={t > a + 1.0 && t < a + 1.7 ? 1.6 : 0} inclina={(G.inclina ?? 0) + cav * 6}
        manoD={<g transform="rotate(20)"><line x1={0} y1={0} x2={0} y2={90} stroke="#a8783a" strokeWidth={10} /><path d="M -16 80 L 16 80 L 10 120 L -10 120 Z" fill="#8e96a6" /></g>} />
      {enPozo && t > sl && t < b && <div style={{ position: "absolute", left: ax - 120, top: 900 - 50 * cav, width: 26, height: 22, borderRadius: "50%", background: "#3e2a1a", opacity: cav }} />}
      <Chip t={t} t0={a} text="VINDOLANDA · 1973" color={C.violeta} x={960} y={130} centro size={60} />
      {[["LETTERS", "letters"], ["LISTS", "lists"], ["REPORTS", "reports"]].map(([tx, w], i) => t > T(w, D) && t < b - 0.1 ? <Chip key={i} t={t} t0={T(w, D)} text={tx} color={[C.rojo, C.teal, C.ambar][i]} tinta={i ? C.noche : "#fff"} x={420 + i * 540} y={260} centro size={54} /> : null)}
      {t > b && <Grande t={t} t0={b} text="HUNDREDS" y={270} size={120} color={C.ambar} />}
      {t > c && <Chip t={t} t0={c} t1={T("most of them were written", D)} text="WET MUD = 2,000 YEARS SAFE" color="#2f2418" x={960} y={1015} centro size={52} />}
    </AbsoluteFill>
  );
};
// el parte de fuerza: 752 soldaditos → 296 en el fuerte → 31 UNFIT se ponen rojos y se sientan
const Parte: React.FC<{ t: number }> = ({ t }) => {
  const a0 = T("the first cohort", D), b = T("only 296", D), c = T("31 were unfit", D), d1 = T("15 sick", D), d2 = T("6 wounded", D), d3 = T("and 10 suffering", D);
  const COLS = 46, DX = 30, DY = 38, X0 = 95, Y0 = 296;
  const col = (i: number) => {
    if (t > c && i < 31) return t > d3 && i >= 21 ? C.ambar : t > d2 && i >= 15 && i < 21 ? "#ff5a6a" : t > d1 && i < 15 ? C.lima : C.rojo;
    return "#f2ead8";
  };
  const fuera = (i: number) => t > b && i >= 296;
  return (
    <AbsoluteFill>
      <Sala t={t} tono="noche" estante={false} lampara={false} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {Array.from({ length: 752 }, (_, i) => {
          const ap = a0 + 0.1 + i * 0.0025;
          if (t < ap) return null;
          const x = X0 + (i % COLS) * DX, y = Y0 + Math.floor(i / COLS) * DY;
          const sienta = t > c && i < 31 ? prog(t, c + 0.2 + i * 0.02, c + 0.5 + i * 0.02) : 0;
          const op = fuera(i) ? 0.16 : 1;
          const k = Math.min(1, (t - ap) / 0.15);
          const cc = col(i);
          // soldadito: casco con cimera, cabeza, cuerpo; sentado = más bajo y piernas hacia adelante
          const un = t > c && i < 31;
          return <g key={i} transform={`translate(${x} ${y + 8 * sienta}) scale(${k * (un ? 0.95 : 0.72)})`} opacity={op}>
            {un && <circle cx={0} cy={0} r={20} fill="rgba(232,52,74,.35)" />}
            <path d="M -6 -16 Q 0 -24 6 -16 Z" fill={un ? "#fff" : "#c9506a"} />
            <circle cx={0} cy={-10} r={6} fill={cc} />
            <rect x={-7} y={-3} width={14} height={16 - 8 * sienta} rx={4} fill={cc} />
            {sienta > 0.5 ? <rect x={-7} y={9} width={16} height={4} rx={2} fill={cc} /> : <><rect x={-6} y={12} width={4} height={8} fill={cc} /><rect x={2} y={12} width={4} height={8} fill={cc} /></>}
          </g>;
        })}
      </svg>
      <Cu t={t} w="752 men" d={D} de={0} a={752} sube={1} dur={Math.min(3.2, T("only 296", D) - T("752 men", D) - 0.3)} y={170} size={120} suf=" ON THE BOOKS" color="#fff" />
      <Cu t={t} w="only 296" d={D} de={752} a={296} sube={0.8} dur={Math.min(3.2, T("31 were unfit", D) - T("only 296", D) - 0.3)} y={170} size={120} suf=" AT THE FORT" color={C.teal} />
      <Cu t={t} w="31 were unfit" d={D} de={0} a={31} sube={0.6} dur={10} y={170} size={120} suf=" UNFIT" color="#ff8aa0" />
      {t > d1 && <Chip t={t} t0={d1} text="15 SICK" color={C.lima} tinta={C.noche} x={260} y={985} centro size={50} />}
      {t > d2 && <Chip t={t} t0={d2} text="6 WOUNDED" color="#ff5a6a" x={640} y={985} centro size={50} />}
      {t > d3 && <Chip t={t} t0={d3} text="10 · INFLAMED EYES" color={C.ambar} tinta={C.noche} x={1150} y={985} centro size={50} />}
      <Persona x={1700} y={1010} h={440} t={t} seed={91} ropa={{ ...AUX(0), tunica: "#a3202f", tunica2: "#5e0f1d" }} casco="centurion" flip mira={-0.7} {...gesto(t, [[a0, "lee"], [b, "sorpresa"], [b + 0.7, "señala"], [c, "enojado"], [d3, "niega"]])} />
      <Chip t={t} t0={a0} t1={b} text="1st COHORT OF TUNGRIANS" color={C.violeta} x={800} y={1000} centro size={54} />
      {t > T("men from belgium", D) && t < b && <Chip t={t} t0={T("men from belgium", D)} text="FROM BELGIUM · LIKE YOU" color={C.teal} tinta={C.noche} x={800} y={905} centro size={46} />}
    </AbsoluteFill>
  );
};
// cuartel húmedo: el humo sale de un brasero VISIBLE detrás; los soldados se frotan los ojos hinchados
const Cuartel: React.FC<{ t: number }> = ({ t }) => {
  const t0 = T("ten men", D);
  const BX = 960, BY = 720;
  return (
    <AbsoluteFill>
      <Sala t={t} tono="noche" ventana="der" estante={false} lampara={false} />
      {/* goteras de la humedad */}
      {[380, 820, 1300, 1620].map((x, i) => { const k = (t * 0.9 + i * 0.3) % 1; return <React.Fragment key={x}><div style={{ position: "absolute", left: x - 30, top: 0, width: 60, height: 30, borderRadius: "0 0 30px 30px", background: "rgba(80,110,140,.6)" }} /><div style={{ position: "absolute", left: x - 7, top: 20 + k * 900, width: 14, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#8fc3e8", opacity: 1 - k * 0.6 }} /></React.Fragment>; })}
      {/* brasero */}
      <div style={{ position: "absolute", left: BX - 230, top: BY - 230, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,150,60,.55), rgba(255,150,60,0) 70%)" }} />
      <svg style={{ position: "absolute", left: BX - 120, top: BY - 120, overflow: "visible" }} width={240} height={260} viewBox="-120 -120 240 260">
        {[-1, 1].map((s) => <line key={s} x1={s * 40} y1={20} x2={s * 80} y2={130} stroke="#3a3f4a" strokeWidth={12} />)}
        <path d="M -100 -10 L 100 -10 L 70 40 L -70 40 Z" fill="#5d6577" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-70 + i * 35} -10 Q ${-80 + i * 35 + Math.sin(t * 13 + i) * 8} ${-60 - (i % 2) * 20} ${-60 + i * 35} ${-90 - Math.abs(Math.sin(t * 9 + i)) * 30} Q ${-45 + i * 35} -50 ${-40 + i * 35} -10 Z`} fill={i % 2 ? "#ff7a3d" : "#ffb020"} />)}
      </svg>
      {/* humo: sale del brasero, sube y se queda bajo el techo (detrás de la gente) */}
      {Array.from({ length: 14 }, (_, i) => {
        const k = (t * 0.22 + i / 14) % 1;
        const x = BX + Math.sin(k * 5 + i) * 60 + (k > 0.5 ? (i % 2 ? 1 : -1) * (k - 0.5) * 1500 : 0);
        const y = BY - 120 - Math.min(k, 0.5) * 2 * 560;
        const r = 50 + k * 220;
        return <div key={i} style={{ position: "absolute", left: x - r, top: y - r * 0.6, width: r * 2, height: r * 1.2, borderRadius: "50%", background: "#8a8296", opacity: 0.5 * Math.sin(Math.min(1, k * 1.4) * Math.PI * 0.9) + 0.08 }} />;
      })}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(130,120,140,.45), rgba(130,120,140,0) 45%)" }} />
      {/* soldados que se frotan los ojos */}
      {[[330, 500, 0], [700, 470, 1], [1240, 480, 2], [1600, 500, 3]].map(([x, h, i]) => {
        const d = t - t0 - i * 0.25;
        const frota = Math.sin(d * 11) * 14;
        const beat = Math.floor(Math.max(0, d) / 1.4) % 3;
        const P = beat === 2
          ? { bD: 40, bI: 20, cD: 60, cI: 20, expr: "enojado" as const, habla: true, inclina: 6 }
          : { bD: 150 + frota, bI: 150 - frota, cD: 150 + frota * 0.6, cI: 150 - frota * 0.6, expr: "dormido" as const, habla: false, inclina: 8 + Math.sin(d * 3) * 4 };
        const cb = cabeza(x, 1010, h);
        return <React.Fragment key={i}>
          <Persona x={x} y={1010} h={h} t={t} seed={40 + i} ropa={AUX(i)} {...P} flip={i >= 2} />
          {beat === 2 && [-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: cb.x + s * 30 * cb.s - 22 * cb.s, top: cb.y - 6 * cb.s, width: 44 * cb.s, height: 22 * cb.s, borderRadius: "50%", background: "rgba(232,52,74,.75)" }} />)}
        </React.Fragment>;
      })}
      <Chip t={t} t0={t0} text="DAMP + SMOKE = SWOLLEN EYES" color={C.rojo} x={960} y={150} centro size={62} />
      <Chip t={t} t0={t0 + 0.6} text="10 MEN OUT" color={C.ambar} tinta={C.noche} x={960} y={260} centro size={50} />
    </AbsoluteFill>
  );
};
// corte del baño: caliente, tibio, frío; el soldado se tira al agua fría y vuelve corriendo al cuarto caliente
const Termas: React.FC<{ t: number }> = ({ t }) => {
  const r = [["HOT ROOM", "#e8344a", "with a hot room"], ["WARM ROOM", "#ff9a3d", "a warm room"], ["COLD PLUNGE", "#2ec4d6", "and a cold plunge"]] as const;
  const f = T("fires burning under", D);
  const feliz = T("if you want to know", D);
  const t0 = T("with a hot room", D), tw = T("a warm room", D), tc = T("and a cold plunge", D);
  const enAgua = t > tc && t < f + 0.2;
  const salta = prog(t, tc, tc + 0.45);
  return (
    <AbsoluteFill style={{ background: "#2d1b69" }}>
      {r.map(([n, col, w], i) => (
        <div key={i} style={{ position: "absolute", left: 120 + i * 580, top: 260, width: 520, height: 520, background: t > T(w, D) ? col : "#4a3a7a", borderRadius: 24, opacity: t > T(w, D) ? 1 : 0.4, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 20, width: "100%", textAlign: "center", fontFamily, fontWeight: 700, fontSize: 52, color: "#fff", WebkitTextStroke: "6px #2a1530", paintOrder: "stroke fill", zIndex: 3 }}>{n}</div>
          {i === 2 && t > T(w, D) && (
            <>
              {enAgua && <Persona x={260} y={300 + 300 * salta + 10 * Math.sin(t * 6)} h={320} t={t} seed={3} ropa={TUNGRO} {...gesto(t, [[tc, "sorpresa"], [tc + 0.5, "miedo"], [tc + 1.0, "tiembla"]])} />}
              <svg style={{ position: "absolute", left: 0, top: 330 }} width={520} height={190}>
                <path d={`M 0 ${40 + Math.sin(t * 3) * 8} ${Array.from({ length: 11 }, (_, k) => `L ${k * 52} ${40 + Math.sin(t * 3 + k * 0.9) * 10}`).join(" ")} L 520 190 L 0 190 Z`} fill="#bff3ff" opacity={0.75} />
                {[0, 1, 2].map((k) => <rect key={k} x={60 + k * 170} y={20 + Math.sin(t * 2 + k) * 8} width={56} height={56} rx={10} fill="#fff" stroke="#8fdcea" strokeWidth={5} transform={`rotate(${15 + k * 20} ${88 + k * 170} ${48})`} />)}
              </svg>
              {t > tc + 0.4 && t < tc + 1.4 && Array.from({ length: 10 }, (_, k) => { const q = prog(t, tc + 0.4, tc + 1.2); return <div key={"g" + k} style={{ position: "absolute", left: 250 + Math.cos(k * 0.62 + 3.4) * 230 * q, top: 370 - Math.sin(k * 0.31 + 0.2) * 260 * q + 200 * q * q, width: 26, height: 26, borderRadius: "50%", background: "#e8fbff", opacity: 1 - q }} />; })}
            </>
          )}
          {i === 1 && t > T(w, D) && <Persona x={260} y={500} h={300} t={t} seed={45} ropa={AUX(5)} {...gesto(t, [[T(w, D), "festeja"], [T(w, D) + 1.2, "duerme"]])} />}
          {i < 2 && t > T(w, D) && Array.from({ length: 6 }, (_, k) => { const kk = (t * 0.6 + k / 6) % 1; return <div key={k} style={{ position: "absolute", left: 60 + k * 70, top: 440 - kk * 360, width: 70, height: 70, borderRadius: "50%", background: "#fff", opacity: 0.45 * (1 - kk) }} />; })}
        </div>
      ))}
      <div style={{ position: "absolute", left: 120, top: 790, width: 1100, height: 150, background: "#3a2418" }}>
        {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 108, top: 0, width: 40, height: 150, background: "#8a5a3a" }} />)}
        {t > f && Array.from({ length: 9 }, (_, i) => <div key={"f" + i} style={{ position: "absolute", left: 76 + i * 108, top: 70 - Math.abs(Math.sin(t * 9 + i)) * 30, width: 40, height: 80, borderRadius: "50% 50% 30% 30%", background: i % 2 ? "#ff7a3d" : "#ffb020" }} />)}
      </div>
      {t > f && <Chip t={t} t0={f} text="FIRES UNDER THE FLOOR" color={C.naranja} x={960} y={1000} centro size={50} />}
      {/* el soldado afuera: hot → warm → salta al frío; después vuelve corriendo al cuarto caliente */}
      {!enAgua && (() => {
        let x: number, cam = 0, fl = false;
        if (t < tc) { x = 380 + 580 * prog(t, tw - 0.2, tw + 0.6) + 360 * prog(t, tc - 0.5, tc); cam = (t > tw - 0.2 && t < tw + 0.6) || t > tc - 0.5 ? 1.6 : 0; }
        else { x = 1540 - 1160 * prog(t, f + 0.2, f + 1.6); cam = t < f + 1.6 ? 2.2 : 0; fl = t < f + 1.6; }
        const G = gesto(t, [[t0 - 0.2, "festeja"], [tw, "encoge"], [tc - 0.5, "sorpresa"], [f + 0.2, "tiembla"], [f + 1.6, "habla"], [feliz, "festeja"]]);
        return <Persona {...G} x={x + (cam ? 0 : G.dx)} y={760} h={380} t={t} seed={3} ropa={TUNGRO} camina={cam} flip={fl} expr={t > f + 1.6 ? "feliz" : G.expr} />;
      })()}
      <Chip t={t} t0={t0 - 0.2} t1={f - 0.3} text="EVERY FORT HAD ONE" color={C.violeta} x={960} y={150} centro size={60} />
      {t > T("it was not rome", D) && <Chip t={t} t0={T("it was not rome", D)} text="ROME ✗" color="#2a2350" x={700} y={170} centro size={70} />}
      {t > T("it was that hot room", D) && <Chip t={t} t0={T("it was that hot room", D)} text="THE HOT ROOM ✓" color={C.rojo} x={1260} y={170} centro size={70} />}
    </AbsoluteFill>
  );
};

export const W2: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 182.5 || t > 332) return null;
  const pant_ = t > T("you wear trousers", D) ? "#6b4a2f" : undefined;
  const capa = t > T("a heavy hooded cloak", D) ? "#3f6b2a" : undefined;
  const sideways = t > T("then it rains sideways", D) && t < T("it snows", D);
  const viento = (t > T("it is also exactly", D) && t < 206) ? 1 : 0;
  const enV = t > tVin;
  return (
    <>
      {/* compañeros en la cresta */}
      {t < tVin && [-900, 700].map((dx, i) => <Persona key={i} x={YO2 + dx} y={TOP} h={220} t={t} seed={44 + i} ropa={AUX(i + 2)} casco="legion" malla={i === 0} pantalon={pant_ && t > 229 ? "#5a4a3a" : undefined} {...gesto(t, [[183, "tiembla"], [T("then it rains sideways", D), "miedo"], [206.3, "tiembla"], [T("nobody cares", D) - 0.3, "festeja"], [T("you want wool", D), "encoge"]])} inclina={viento * -8} />)}
      {/* vos */}
      {!enV && <Persona x={YO2} y={TOP} h={230} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon={pant_} capa={capa}
        {...gesto(t, [[183, "tiembla"], [194.1, "festeja"], [195.3, "miedo"], [T("it rains", D), "encoge"], [T("then it drizzles", D), "tiembla"], [T("then it rains sideways", D), "miedo"], [T("it snows", D), "sorpresa"], [206.3, "tiembla"],
          [T("so you adapt", D), "habla"], [T("no proper roman", D), "niega"], [T("you wear trousers", D), "festeja"], [T("on the wall", D), "habla"], [T("nobody cares", D), "festeja"], [T("you want wool", D), "habla"], [T("thick socks", D), "señala"], [T("a heavy hooded cloak", D), "festeja"], [T("britain became so famous", D), "habla"]])}
        inclina={viento * -10 + (sideways ? -6 : 0)} />}
      {/* el carro empantanado */}
      {t > 205 && t < 218 && (
        <>
          <ellipse cx={CX} cy={BASE + 40} rx={700} ry={70} fill={BARRO} />
          <Carro x={CX} y={BASE - 120 + Math.sin(t * 20) * 3} t={t * (t > 207 ? 1 : 0)} s={0.9} carga="barril" />
          <Mula x={CX + 470} y={BASE - 150} t={t} camina={t > 207 ? 1.5 : 0} s={0.75} carga={false} />
          <Persona x={CX - 380} y={BASE} h={230} t={t} seed={81} ropa={CIVIL(3)} expr={t > 213 ? "triste" : "enojado"} bD={140} cD={30} inclina={14} />
          {Array.from({ length: 10 }, (_, i) => { const k = (t * 1.7 + i / 10) % 1; return <circle key={i} cx={CX - 120 + (i % 2 ? 1 : -1) * k * 260 + i * 20} cy={BASE - 20 - Math.sin(k * Math.PI) * 160} r={14 + (i % 3) * 6} fill={BARRO} opacity={1 - k} />; })}
        </>
      )}
      {/* Vindolanda */}
      <Fuerte x={VX} y={BASE - 190} s={0.9} w={1700} piedra />
      {t > tVin - 1 && t < tVin + 7 && <div style={{ position: "absolute", left: VX - 420, top: BASE - 640, width: 840, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 120, color: "#fff", WebkitTextStroke: "14px #2a1530", paintOrder: "stroke fill", transform: `scale(${ent(t, tVin + 0.3)})` }}>VINDOLANDA</div>}
      {enV && <Persona x={YOV} y={BASE} h={240} t={t} seed={3} ropa={TUNGRO} casco="legion" malla pantalon="#6b4a2f" capa="#3f6b2a" aparece={tVin + 2}
        {...gesto(t, [[tVin + 2, "habla"], [T("a letter from home", D), "sorpresa"], [T("it says", D), "lee"], [T("two pairs of underpants", D), "festeja"], [T("somewhere", D), "triste"], [T("the cold does not only", D), "tiembla"], [T("it makes you sick", D), "miedo"], [T("at vindolanda", D), "triste"]])} />}
      {/* el baño humeante */}
      <Banio x={BX} y={BASE - 310} t={t} s={1} />
    </>
  );
};

export const S2: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  if (t < 182.5 || t > 332) return null;
  const yo = pant(YO2, cabeza(YO2, TOP, 230).y, c);
  const yv = pant(YOV, cabeza(YOV, BASE, 240).y, c);
  const iconos: [string, string, string][] = [["it rains", "RAIN", "#3d7fc9"], ["then it drizzles", "DRIZZLE", "#5b8fc9"], ["then it rains sideways", "SIDEWAYS RAIN", "#2a2350"], ["it snows", "SNOW", "#9aa4b4"]];
  return (
    <>
      <CartelTrampa t={t} t0={182.64} n={2} titulo="THE WEATHER" color="#3d7fc9" />
      <Plano t={t} t0={T("if you come from syria", D)} t1={T("the central part", D) - 0.1} desde={[yo[0], yo[1]]} fondo="#ffb347"><Siria t={t} /></Plano>
      <Plano t={t} t0={T("the central part", D) + 0.6} t1={T("it is beautiful", D) - 0.15} desde={[960, 600]} fondo="#5c6f8f"><Cresta t={t} /></Plano>
      <Ch t={t} w="the central part" d={D} txt="THE CENTRAL SECTION" y={150} c={C.violeta} size={60} dur={0.7} dt={0.35} />
      <Gr t={t} w="it is beautiful" d={D} txt="BEAUTIFUL." y={200} size={150} c={C.lima} dur={1.0} />
      <Plano t={t} t0={T("it is also exactly", D) + 0.2} t1={T("it rains", D) - 0.2} desde={[960, 400]} fondo="#5c6f8f"><Cresta t={t} /></Plano>
      {iconos.map(([w, tx, col], i) => t > T(w, D) && t < T("the roads turn into mud", D) ? <Chip key={i} t={t} t0={T(w, D)} text={tx} color={col} x={330 + i * 420} y={150} centro size={i === 2 ? 50 : 58} /> : null)}
      {t > T("then it rains sideways", D) && t < T("it snows", D) && Array.from({ length: 40 }, (_, i) => { const k = (t * 3 + i * 0.173) % 1; return <div key={i} style={{ position: "absolute", left: -200 + k * 2400, top: (i * 61) % 1080, width: 180, height: 6, borderRadius: 3, background: "#d6e6ff", opacity: 0.7 }} />; })}
      <Gr t={t} w="for a change" d={D} txt="FOR A CHANGE…" y={880} size={90} c={C.crema} dur={1.0} />
      <Gr t={t} w="the roads turn into mud" d={D} txt="MUD." y={200} size={170} c="#c9a36a" dur={1.3} />
      <Plano t={t} t0={T("one merchant", D) + 0.1} t1={T("so you adapt", D) - 0.15} desde={[960, 600]} fondo="#6f82a0"><Barro t={t} /></Plano>
      <Plano t={t} t0={T("so you adapt", D) - 0.1} t1={T("for centuries", D) - 0.15} desde={[960, 600]} fondo="#b9a98e"><Pantalon2 t={t} /></Plano>
      <Ch t={t} w="so you adapt" d={D} txt="SO YOU ADAPT" y={150} c={C.teal} tinta={C.noche} size={66} dur={1.0} />
      <Ch t={t} w="no proper roman" d={D} txt="NO PROPER ROMAN WOULD…" y={150} c={C.rojo} size={60} dur={2.5} />
      <Gr t={t} w="you wear trousers" d={D} txt="TROUSERS." y={200} size={180} c={C.ambar} dur={1.4} />
      <Plano t={t} t0={T("for centuries", D) - 0.1} t1={T("on the wall", D) - 0.15} desde={[yo[0], yo[1] + 200]} fondo="#e8b98a"><Burla t={t} /></Plano>
      <Plano t={t} t0={T("on the wall", D) - 0.1} t1={T("you want wool", D) - 0.15} desde={[960, 600]} fondo="#6f82a0"><NadieCuida t={t} t0={T("on the wall", D)} /></Plano>
      <Gr t={t} w="nobody cares" d={D} txt="NOBODY CARES." y={200} size={130} c={C.lima} dur={1.5} />
      <Ch t={t} w="you want wool" d={D} txt="WOOL. LOTS OF IT." y={150} c={C.violeta} size={66} dur={1.9} />
      {t > T("thick socks", D) && t < T("britain became so famous", D) && (
        <>
          <Ropa k="medias" x={yo[0] - 330} y={yo[1] + 40} t={t} t0={T("thick socks", D)} s={1} rot={-12} />
          <Ropa k="calzon" x={yo[0] + 330} y={yo[1] + 40} t={t} t0={T("underpants", D)} s={1} rot={8} />
          <Chip t={t} t0={T("thick socks", D)} text="THICK SOCKS" color={C.lila} x={yo[0] - 330} y={yo[1] + 190} centro size={40} />
          <Chip t={t} t0={T("underpants", D)} text="UNDERPANTS" color={C.crema} tinta={C.noche} x={yo[0] + 330} y={yo[1] + 190} centro size={40} />
        </>
      )}
      <Ch t={t} w="a heavy hooded cloak" d={D} txt="+ HEAVY HOODED CLOAK" y={950} c="#3f6b2a" size={60} dur={1.4} />
      <Plano t={t} t0={T("much later", D) - 0.2} t1={T("we know about the socks", D) - 0.2} desde={[yo[0], yo[1]]} fondo="#1b1240"><Edicto t={t} /></Plano>
      <Ch t={t} w="just behind the line" d={D} txt="JUST BEHIND THE WALL" y={150} c={C.violeta} size={60} dur={1.8} />
      <Plano t={t} t0={T("in the 1970s", D) - 0.1} t1={T("most of them were written", D) + 2.2} desde={[960, 760]} fondo="#9fc6e0"><Excava t={t} /></Plano>
      <Ch t={t} w="most of them were written" d={D} txt="WRITTEN ~AD 85-130" y={1000} c={C.ambar} tinta={C.noche} size={56} dur={4.2} dt={0.2} />
      <Ch t={t} w="the wall went up" d={D} txt="← AS THE WALL WENT UP" y={900} c={C.teal} tinta={C.noche} size={50} dur={1.4} />
      
      <Plano t={t} t0={T("a letter from home", D) - 0.1} t1={T("somewhere", D) - 0.1} desde={[960, 600]} fondo="#e0a25a">
        <Sala t={t} tono="calido" ventana="der" estante={false} lampara={false} />
        <div style={{ position: "absolute", left: 160, top: 820, width: 1600, height: 70, borderRadius: 12, background: "#8a5a2a", boxShadow: "0 16px 0 rgba(0,0,0,.25)" }} />
        <div style={{ position: "absolute", left: 600, top: 700, width: 240, height: 130, background: "#c9a46a", border: "6px solid #7a5a2a", borderRadius: 8, transform: `rotate(${-3 + 6 * prog(t, T("it says", D), T("it says", D) + 0.4)}deg)` }}><div style={{ position: "absolute", left: 0, right: 0, top: 54, height: 14, background: "#8a3a2a" }} /></div>
        <TablillaGrande t={t} t0={T("a letter from home", D) + 0.1} x={1430} y={250} w={760} vel={44} titulo="A LETTER FROM HOME" lineas={["“I have sent you… socks,", "two pairs of sandals,", "and two pairs of underpants.”"]} />
        <Actua t={t} beats={[[T("a letter from home", D) - 0.1, "sorpresa"], [T("it says", D), "lee"], [T("two pairs of sandals", D), "señala"], [T("two pairs of underpants", D), "festeja"]]} x0={330} x1={330} y={1050} h={560} frio />
        <Ropa k="medias" x={900} y={760} t={t} t0={T("i have sent you socks", D) + 0.6} s={1.2} rot={-10} />
        <Ropa k="sandalia" x={1100} y={770} t={t} t0={T("two pairs of sandals", D)} s={1.1} rot={6} />
        <Ropa k="sandalia" x={1230} y={790} t={t} t0={T("two pairs of sandals", D) + 0.25} s={1.1} rot={18} />
        <Ropa k="calzon" x={1440} y={760} t={t} t0={T("two pairs of underpants", D)} s={1.1} rot={-6} />
        <Ropa k="calzon" x={1620} y={790} t={t} t0={T("two pairs of underpants", D) + 0.25} s={1.1} rot={10} />
      </Plano>
      <Plano t={t} t0={T("somewhere", D) - 0.1} t1={T("at vindolanda", D) - 0.15} desde={[960, 600]} fondo="#6f82a0"><Frio2 t={t} /></Plano>
      <Ch t={t} w="the cold does not only" d={D} txt="COLD = MISERABLE" y={150} c="#3d7fc9" size={60} dur={2.0} />
      <Gr t={t} w="it makes you sick" d={D} txt="…AND SICK." y={200} size={140} c={C.lima} dur={1.2} />
      <Plano t={t} t0={T("at vindolanda", D) - 0.1} t1={T("the first cohort", D) - 0.2} desde={[960, 600]} fondo="#e0a25a"><Escriba t={t} /></Plano>
      <Plano t={t} t0={T("the first cohort", D) - 0.2} t1={T("ten men", D) - 0.15} desde={[960, 640]} fondo="#120a2c"><Parte t={t} /></Plano>
      <Plano t={t} t0={T("ten men", D)} t1={T("that was a real enemy", D) - 0.1} desde={[960, 640]} fondo="#3a2418"><Cuartel t={t} /></Plano>
      <Gr t={t} w="that was a real enemy" d={D} txt="A REAL ENEMY." y={200} size={140} c={C.rojo} borde="#fff" dur={1.3} />
      <Ch t={t} w="the one thing that kept" d={D} txt="THE ONE THING THAT KEPT YOU HUMAN" y={150} c={C.naranja} size={54} dur={2.3} />
      <Chip t={t} t0={T("every fort had one", D)} t1={T("with a hot room", D) - 0.2} text="EVERY FORT HAD ONE" color={C.violeta} x={960} y={150} centro size={60} />
      <Ch t={t} w="outside the walls" d={D} txt="OUTSIDE THE WALLS" y={260} c={C.violeta} size={48} dur={1.2} />
      <Plano t={t} t0={T("with a hot room", D) - 0.2} t1={331.0} desde={[960, 600]} fondo="#2d1b69"><Termas t={t} /></Plano>
    </>
  );
};
