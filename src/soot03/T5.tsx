import React from "react";
import { Sala } from "./sets";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { Exterior } from "./escenas4";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Casa } from "./kit";
import { Fuerte, Bolsa, Mula } from "./kit2";
import { Persona, CIVIL } from "./persona";
import { TOP, BASE, MC, K, Cam, Pal, Plano, CartelTrampa, pant, FUERTE_H } from "./mundo";
import { Gr, Ch, T, ck, TUNGRO, AUX, Esqueleto, TablillaGrande, Picto, Ojos, gesto, Sale, Actua } from "./kit3";

// TRAMPA 5 · LOS VECINOS (536,4-618,5 s). El vicus que crece afuera de Housesteads (tabernas, tiendas, talleres,
// familias que la ley no reconoce, comerciantes); "suena acogedor" → no siempre: los dos esqueletos bajo el piso con
// la punta del cuchillo entre las costillas; los britanos sin armadura y la palabra "Brittunculi"; y por qué conviene
// no despreciar a quien conoce el terreno.
const D = 536;
const HX = FUERTE_H; // Housesteads
const VI = HX - 1700; // el vicus
const CASAS = [VI - 900, VI - 560, VI - 220, VI + 120, VI + 460, VI + 800];
const ROT: [string, string][] = [["pubs", "PUB"], ["shops", "SHOP"], ["workshops", "WORKSHOP"]];

export const keys5: K[] = [
  [536.6, 25200, 580, 0.42], ck("outside the gates", D, VI, 760, 0.8), ck("a small town grows", D, VI, 740, 0.95), ck("pubs", D, VI - 400, 740, 1.0),
  ck("families that the law", D, VI + 300, 760, 1.2), ck("traders who came", D, VI + 700, 760, 1.25), ck("it sounds cozy", D, VI, 700, 0.7),
  ck("it was not always", D, VI + 400, 700, 0.55), ck("at the fort of", D, HX, 660, 0.5), ck("nobody knows who", D, HX - 800, 760, 0.9),
  ck("the wall had a murder", D, HX - 800, 740, 1.2), ck("then there are the locals", D, HX, 380, 0.5), ck("one roman report", D, HX, 400, 0.6),
  ck("but here is the problem", D, HX, 400, 0.6), ck("they know the land", D, HX, 380, 0.9), ck("which brings us", D, HX + 2000, 420, 0.4), [618.4, 33000, 500, 0.4],
];
export const amb5: [number, Pal][] = [[536.6, "gris"], [538.8, "dia"], [553.3, "calido"], [554.6, "noche"], [581.7, "gris"], [602.3, "tormenta"], [615.0, "gris"]];
export const lluvia5: [number, number][] = [[536.6, 0.1], [538.8, 0], [581.7, 0], [602.3, 0.4], [618.4, 0.3]];
export const sol5: [number, number, number, boolean?][] = [[538.8, 1720, 300], [553.3, 1500, 520], [554.6, 1500, 180, true], [581.7, -999, 0]];

// ── utilería propia de T5
const BRITON = { tunica: "#3f7a4a", tunica2: "#2a5233", cinto: "#5a3418", piel: "#f2c09a", piel2: "#d99a72", pelo: "#c9602c" };
const ARQ = { tunica: "#c9b07a", tunica2: "#9a8452", cinto: "#5a3418", piel: "#c98b62", piel2: "#a2643f", pelo: "#1d1410" };
const ARQ2 = { tunica: "#e0cfa0", tunica2: "#b0a070", cinto: "#6b4a2f", piel: "#f2c09a", piel2: "#d99a72", pelo: "#7a4a22" };
// salacot de arqueólogo de los años 30 sobre la cabeza de una Persona
const Salacot: React.FC<{ x: number; y: number; h: number; inclina?: number }> = ({ x, y, h, inclina = 0 }) => {
  const cb = cabeza(x, y, h);
  return (
    <svg style={{ position: "absolute", left: cb.x - 150 * cb.s, top: cb.y - 200 * cb.s, overflow: "visible", transform: `rotate(${inclina * 0.6}deg)`, transformOrigin: `${150 * cb.s}px ${470 * cb.s}px` }} width={300 * cb.s} height={200 * cb.s} viewBox="-150 -200 300 200">
      <ellipse cx={0} cy={-58} rx={148} ry={30} fill="#d8c08a" stroke="#8a7040" strokeWidth={6} />
      <path d="M -104 -66 Q -100 -190 0 -192 Q 100 -190 104 -66 Z" fill="#e8d4a0" stroke="#8a7040" strokeWidth={6} />
      <rect x={-104} y={-92} width={208} height={18} fill="#8a5a2a" />
    </svg>
  );
};
// cara colorada de bronca (se pinta encima de la cabeza) + vapor que sale de las orejas
const Bronca: React.FC<{ x: number; y: number; h: number; t: number; t0: number }> = ({ x, y, h, t, t0 }) => {
  if (t < t0) return null;
  const cb = cabeza(x, y, h), k = prog(t, t0, t0 + 0.5);
  return (
    <>
      <div style={{ position: "absolute", left: cb.x - 92 * cb.s, top: cb.y - 70 * cb.s, width: 184 * cb.s, height: 150 * cb.s, borderRadius: "50%", background: `rgba(225,40,40,${0.42 * k})` }} />
      {[-1, 1].map((sd) => [0, 1, 2].map((j) => { const q = ((t - t0) * 1.6 + j / 3) % 1; return <div key={sd + "-" + j} style={{ position: "absolute", left: cb.x + sd * (150 + q * 60) * cb.s - 22, top: cb.y - (20 + q * 120) * cb.s, width: 44 + q * 40, height: 44 + q * 40, borderRadius: "50%", background: "#fff", opacity: 0.85 * (1 - q) * k }} />; }))}
    </>
  );
};
// manos en la cintura (brazos en jarra)
const JARRA = { bD: 40, bI: 40, cD: -100, cI: -100, expr: "enojado" as const, habla: true };

// 8:59 · el vicus a la sombra de la puerta: herrero que martilla, vendedora, comerciante con la mula que llega
const VicusCalle: React.FC<{ t: number }> = ({ t }) => {
  const o = T("outside the gates", D), g = T("a small town grows", D), v = T("the romans called it", D);
  const S = 470 / 560;
  const fase = (t * 2.4) % 1, alza = Math.sin(fase * Math.PI * 2);
  const golpe = fase > 0.7 && fase < 0.85;
  const tx = interpolate(t, [g + 0.2, g + 2.2], [2150, 1520], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const anda = t > g + 0.2 && t < g + 2.2;
  return (
    <Exterior t={t} tono="dia" horizonte={560}>
      {/* la puerta del fuerte, a la izquierda */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <rect x={-20} y={280} width={380} height={760} fill="#c8b89c" stroke="#7a6a52" strokeWidth={8} />
        {Array.from({ length: 5 }, (_, i) => <rect key={i} x={-10 + i * 78} y={236} width={50} height={52} fill="#c8b89c" stroke="#7a6a52" strokeWidth={6} />)}
        {Array.from({ length: 22 }, (_, i) => <rect key={"p" + i} x={((i * 97) % 330) - 4} y={320 + ((i * 53) % 640)} width={70} height={28} rx={6} fill="#e0d2b8" opacity={0.7} />)}
        <path d="M 80 1040 L 80 660 Q 170 540 260 660 L 260 1040 Z" fill="#4a2c16" />
        {[110, 150, 190, 230].map((x) => <line key={x} x1={x} y1={640} x2={x} y2={1040} stroke="#2e1a0c" strokeWidth={6} />)}
        <rect x={-20} y={980} width={1960} height={120} fill="#b89a6a" />
        <rect x={-20} y={972} width={1960} height={14} fill="#8a6e48" opacity={0.6} />
      </svg>
      {/* las casas del pueblo brotan una por una */}
      {[[640, "#e8b98a", "#b5452c"], [1080, "#f0c89a", "#8a5a2a"], [1500, "#d8a878", "#b5452c"]].map(([x, tono, techo], i) => {
        const e = ent(t, o + 0.5 + i * 0.45);
        return t > o + 0.5 + i * 0.45 ? (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${e})`, transformOrigin: `${x}px 820px` }}>
            <Casa x={x as number} y={820} s={1.55} tono={tono as string} techo={techo as string} />
            {[0, 1, 2].map((k) => { const kk = (t * 0.45 + k / 3 + i * 0.2) % 1; return <div key={k} style={{ position: "absolute", left: (x as number) + 90 + kk * 40, top: 520 - kk * 200, width: 50 + kk * 60, height: 50 + kk * 60, borderRadius: "50%", background: "#eee6dc", opacity: 0.55 * (1 - kk) }} />; })}
          </div>
        ) : null;
      })}
      {/* el herrero martilla en el yunque: chispas en cada golpe */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
        <rect x={858} y={928} width={60} height={70} fill="#4a4a52" />
        <path d="M 820 896 L 960 896 L 990 880 L 940 930 L 840 930 Z" fill="#5d6577" stroke="#2e3340" strokeWidth={5} />
      </svg>
      <Persona x={720} y={1000} h={470} t={t} seed={41} ropa={{ ...CIVIL(3), tunica: "#7a4a2a", tunica2: "#5a3418" }} expr={golpe ? "enojado" : "feliz"} bD={70 + 70 * (0.5 + 0.5 * alza)} cD={20 + 30 * (0.5 - 0.5 * alza)} bI={30} cI={60} inclina={6} mira={0.6}
        manoD={<g><rect x={-7} y={-6} width={14} height={86} rx={6} fill="#7a4a22" /><rect x={-34} y={70} width={68} height={34} rx={6} fill="#5d6577" /></g>} />
      {golpe && Array.from({ length: 9 }, (_, i) => { const q = (fase - 0.7) / 0.15; const ang = -150 + i * 22; return <div key={i} style={{ position: "absolute", left: 900 + Math.cos((ang * Math.PI) / 180) * q * 120, top: 880 + Math.sin((ang * Math.PI) / 180) * q * 120, width: 12, height: 12, borderRadius: 6, background: i % 2 ? "#ffd27a" : "#ff9a3a" }} />; })}
      {/* la vendedora con la canasta de pan */}
      <Persona x={1150} y={1000} h={450} t={t} seed={42} mujer ropa={{ ...CIVIL(1), tunica: C.rosa, tunica2: "#c94a6a" }} {...gesto(t, [[o, "habla"], [g, "festeja"], [v, "señala"], [v + 1.2, "habla"]])} mira={-0.5}
        manoI={<g><path d="M -60 0 L 60 0 L 46 56 L -46 56 Z" fill="#a8783a" stroke="#6b4a2f" strokeWidth={6} /><ellipse cx={-22} cy={-6} rx={26} ry={16} fill="#e0a85a" /><ellipse cx={20} cy={-8} rx={26} ry={16} fill="#d8984a" /></g>} />
      {/* el comerciante llega con la mula cargada, atraído por la plata de la paga */}
      {t > g + 0.2 && <div style={{ position: "absolute", left: 0, top: 0, transform: "scaleX(-1)", transformOrigin: `${tx + 200}px 0px` }}><Mula x={tx + 200} y={880} t={t} camina={anda ? 1.5 : 0} s={0.72} carga /></div>}
      {t > g + 0.2 && <Persona x={tx} y={1000} h={460} t={t} seed={43} ropa={CIVIL(5)} flip camina={anda ? 1.3 : 0} {...(anda ? { expr: "feliz" as const } : gesto(t, [[g + 2.2, "señala"], [v, "festeja"], [v + 1.4, "habla"]]))} />}
      {t > g + 2.4 && <div style={{ position: "absolute", left: tx - 175, top: 700 - Math.abs(Math.sin(t * 5)) * 16, transform: `scale(${ent(t, g + 2.4)})` }}><svg width={120} height={120} viewBox="-60 -60 120 120"><circle r={52} fill={C.oro} stroke="#8a6a1a" strokeWidth={8} /><text y={22} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={64} fill="#6a4a10">$</text></svg></div>}
    </Exterior>
  );
};

// 9:18 · excavación de 1930, a la altura del arqueólogo dentro del pozo: cepilla la arcilla y aparece lo que brilla
const Piso: React.FC<{ t: number }> = ({ t }) => {
  const a = T("archaeologists in the 1930s", D), b = T("under the clay floor", D), c = T("they found two skeletons", D), k = T("and the man still had", D);
  const mw = T("a man and a woman", D), hd = T("hidden there", D), nk = T("nobody knows who", D), nr = T("nobody ever reported", D), mm = T("the wall had a murder", D), un = T("still unsolved", D);
  const destapa = prog(t, b - 0.2, c + 0.2);
  const niebla = prog(t, nk - 0.4, nk + 1.6);
  const H1 = 520, H2 = 500;
  // pincel/pala: el brazo va y viene
  const cep = t > b && t < c + 0.3;
  const p1 = t < b ? gesto(t, [[a, "cava"]]) : cep ? { expr: "neutro" as const, habla: false, bD: 75 + Math.sin(t * 14) * 14, cD: 30, bI: 40, cI: 70, inclina: 22, ladea: 0, dx: 0, dy: 0, salta: undefined } : gesto(t, [[c + 0.3, "sorpresa"], [c + 1.4, "miedo"], [k, "señala"], [nk, "encoge"], [nr, "niega"], [mm, "triste"]]);
  const p2 = gesto(t, [[a, "escribe"], [c + 0.2, "sorpresa"], [mw, "señala"], [hd, "miedo"], [k + 0.6, "miedo"], [nk, "encoge"], [nr, "lee"], [un, "triste"]]);
  return (
    <AbsoluteFill style={{ background: "#2a1a10" }}>
      {/* cielo de tarde arriba del pozo */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 260, background: "linear-gradient(180deg,#f2c896,#e0a070)" }} />
      <div style={{ position: "absolute", left: 1560, top: -200, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,190,.95) 0 14%, rgba(255,220,150,.35) 16%, rgba(255,220,150,0) 62%)" }} />
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        {[[40, 170, 200], [290, 196, 130], [1380, 160, 240], [1700, 200, 160]].map(([x, y, w], i) => <g key={i}><rect x={x} y={y} width={w} height={262 - y} fill="#9a8a72" stroke="#6a5a44" strokeWidth={5} />{Array.from({ length: Math.floor(w / 60) }, (_, j) => <rect key={j} x={x + 8 + j * 60} y={y + 10 + (j % 2) * 22} width={44} height={16} rx={4} fill="#b9a98e" />)}</g>)}
        {Array.from({ length: 40 }, (_, i) => { const x = i * 49 + ((i * 31) % 20), sw = 6 * Math.sin(t * 2.4 + i); return <path key={i} d={`M ${x} 262 q ${sw / 2} -14 ${sw} -28`} stroke="#5f8a3a" strokeWidth={6} strokeLinecap="round" fill="none" />; })}
        {/* pared del pozo: estratos */}
        {["#8a5a32", "#7a4a28", "#6e4224", "#62391e"].map((col, i) => <rect key={i} x={0} y={260 + i * 95} width={1920} height={95} fill={col} />)}
        {Array.from({ length: 30 }, (_, i) => <ellipse key={i} cx={(i * 173) % 1920} cy={290 + ((i * 97) % 330)} rx={16 + (i % 4) * 7} ry={10 + (i % 3) * 4} fill="#9a8a7a" opacity={0.75} />)}
        {/* piso de arcilla del cuarto, en perspectiva */}
        <path d="M 0 640 L 1920 640 L 1920 1080 L 0 1080 Z" fill="#c08a52" />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={0} y1={700 + i * 100} x2={1920} y2={700 + i * 100} stroke="#a8763f" strokeWidth={4} opacity={0.6} />)}
        {Array.from({ length: 9 }, (_, i) => <line key={"v" + i} x1={960 + (i - 4) * 160} y1={640} x2={960 + (i - 4) * 330} y2={1080} stroke="#a8763f" strokeWidth={4} opacity={0.5} />)}
        {/* cuerda de la cuadrícula arqueológica */}
        <path d="M 520 680 L 1420 680 L 1500 1040 L 440 1040 Z" fill="none" stroke="#f2ead8" strokeWidth={5} strokeDasharray="18 12" />
      </svg>
      {/* farol colgado en la pared del pozo, con halo */}
      <div style={{ position: "absolute", left: 1700 - 260, top: 420 - 260, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,214,130,${0.55 + 0.08 * Math.sin(t * 13)}) 0 10%, rgba(255,200,110,.18) 30%, rgba(255,200,110,0) 64%)` }} />
      <svg style={{ position: "absolute", left: 1660, top: 340 }} width={80} height={130}><rect x={36} y={0} width={8} height={24} fill="#3a2a1a" /><rect x={14} y={24} width={52} height={70} rx={10} fill="#ffd27a" stroke="#3a2a1a" strokeWidth={6} /><rect x={8} y={90} width={64} height={12} fill="#3a2a1a" /></svg>
      {/* los dos esqueletos bajo la arcilla (se destapan con el cepillo) */}
      <Esqueleto x={820} y={770} s={1.05} t={t} t0={a} />
      <Esqueleto x={1150} y={920} s={1.05} t={t} t0={a} rot={180} cuchillo={t > k} />
      <div style={{ position: "absolute", left: 470, top: 700, width: 1040, height: 320, borderRadius: "40%", background: "#b07a46", opacity: 1 - destapa }} />
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 500 + ((i * 113) % 940), top: 720 + ((i * 61) % 260), width: 120, height: 60, borderRadius: "50%", background: "#a06a38", opacity: Math.max(0, 1 - destapa * (1.2 + i * 0.1)) }} />)}
      {/* lo que brilla debajo del cepillo */}
      {t > b - 0.2 && t < c + 1.4 && <div style={{ position: "absolute", left: 600 - 200, top: 770 - 200, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,246,200,.9) 0 12%, rgba(255,230,150,.35) 30%, rgba(255,230,150,0) 65%)", transform: `scale(${0.8 + 0.25 * Math.sin(t * 9)})`, opacity: prog(t, b - 0.2, b + 0.4) * (1 - prog(t, c + 0.6, c + 1.4)) }} />}
      {t > k && t < nk && <div style={{ position: "absolute", left: 1236 - 120, top: 962 - 120, width: 240, height: 240, borderRadius: "50%", border: `12px solid ${C.rojo}`, transform: `scale(${ent(t, k + 1.4) * (1 + 0.06 * Math.sin(t * 8))})` }} />}
      {/* los dos arqueólogos, plano medio */}
      <Persona x={360} y={1010} h={H1} t={t} seed={77} ropa={ARQ} {...p1} mira={0.6}
        manoD={t < b ? <g><rect x={-6} y={-10} width={12} height={110} fill="#6b4a2f" /><path d="M -26 96 L 26 96 L 18 150 L -18 150 Z" fill="#7d8796" /></g> : cep ? <g><rect x={-6} y={-6} width={12} height={60} fill="#6b4a2f" /><rect x={-16} y={50} width={32} height={36} rx={6} fill="#e8d4a0" /></g> : undefined} />
      <Salacot x={360} y={1010} h={H1} inclina={p1.inclina ?? 0} />
      {t > a + 0.4 && t < b && Array.from({ length: 7 }, (_, i) => { const q = ((t - a) * 1.5 + i / 7) % 1; return <div key={i} style={{ position: "absolute", left: 560 + q * (260 + i * 30), top: 860 - Math.sin(q * Math.PI) * (220 + i * 16), width: 24, height: 20, borderRadius: 8, background: "#a8783a", opacity: 1 - q * 0.5 }} />; })}
      <Persona x={1620} y={1010} h={H2} t={t} seed={78} mujer flip ropa={ARQ2} {...p2} mira={-0.6}
        manoI={<g><rect x={-34} y={-10} width={68} height={86} rx={6} fill="#f6efe2" stroke="#6b4a2f" strokeWidth={5} /><line x1={-20} y1={14} x2={20} y2={14} stroke="#6b4a2f" strokeWidth={4} /><line x1={-20} y1={32} x2={16} y2={32} stroke="#6b4a2f" strokeWidth={4} /></g>} />
      <Salacot x={1620} y={1010} h={H2} inclina={-(p2.inclina ?? 0)} />
      {/* niebla que baja al pozo */}
      {t > nk - 0.4 && Array.from({ length: 6 }, (_, i) => <div key={"n" + i} style={{ position: "absolute", left: ((t - nk) * (40 + i * 12) + i * 420) % 2600 - 500, top: 300 + i * 120, width: 900, height: 170, borderRadius: "50%", background: "#eef0f4", opacity: 0.32 * niebla }} />)}
      {/* el expediente: víctimas 2, arma cuchillo, asesino ??? → UNSOLVED */}
      {t > mm - 0.2 && (
        <div style={{ position: "absolute", left: 960 - 380, top: 440, width: 760, height: 500, transform: `translateY(${(1 - ent(t, mm - 0.2)) * 700}px) rotate(-2deg)` }}>
          <div style={{ position: "absolute", left: 30, top: -40, width: 280, height: 70, background: "#d8b46a", borderRadius: "16px 16px 0 0" }} />
          <div style={{ position: "absolute", inset: 0, background: "#e8c87a", borderRadius: 18, boxShadow: "0 18px 0 rgba(20,8,40,.35)", border: "6px solid #8a6a2a" }} />
          <div style={{ position: "absolute", left: 46, top: 30, fontFamily, fontWeight: 700, fontSize: 40, color: "#6a4a10", letterSpacing: 2 }}>CASE FILE · HOUSESTEADS</div>
          {[["VICTIMS", "2"], ["WEAPON", "KNIFE"], ["KILLER", "???"]].map(([l, v], i) => <div key={i} style={{ position: "absolute", left: 60, top: 110 + i * 92, fontFamily, fontWeight: 700, fontSize: 52, color: C.noche, opacity: prog(t, mm + 0.2 + i * 0.3, mm + 0.4 + i * 0.3) }}>{l}: <span style={{ color: i === 2 ? C.rojo : C.noche }}>{v}</span></div>)}
          {t > un && <div style={{ position: "absolute", left: 220, top: 345, width: 470, height: 140, border: `14px solid ${C.rojo}`, borderRadius: 20, fontFamily, fontWeight: 700, fontSize: 92, color: C.rojo, textAlign: "center", lineHeight: "112px", background: "rgba(255,240,230,.55)", transform: `rotate(-12deg) scale(${2.2 - 1.2 * ent(t, un, 0, { damping: 14, stiffness: 260 })})`, opacity: prog(t, un, un + 0.12) }}>UNSOLVED</div>}
        </div>
      )}
      <Chip t={t} t0={a} t1={nk - 0.3} text="HOUSESTEADS · 1930s" color={C.violeta} x={960} y={110} centro size={60} />
      {t > b && t < c + 1 && <Chip t={t} t0={b} t1={c + 0.7} text="UNDER THE CLAY FLOOR" color="#a8783a" x={960} y={220} centro size={50} />}
      {t > mw && <Chip t={t} t0={mw} t1={nk - 0.3} text="A WOMAN" color={C.rosa} x={700} y={640} centro size={50} />}
      {t > mw + 0.5 && <Chip t={t} t0={mw + 0.5} t1={nk - 0.3} text="A MAN" color="#3d7fc9" x={1380} y={760} centro size={50} />}
      {t > hd && <Chip t={t} t0={hd} t1={k + 1.3} text="HIDDEN · NOT BURIED" color={C.rojo} x={960} y={230} centro size={58} />}
      <Sale t={t} t0={k + 1.6} t1={nk - 0.3}><Grande t={t} t0={k + 1.6} text="A KNIFE." y={250} size={110} color={C.rojo} borde="#fff" /></Sale>
    </AbsoluteFill>
  );
};
// 9:48 · el informe sobre los britanos: el escriba se ríe, el britano lo lee por arriba del hombro y se ofende
const Informe: React.FC<{ t: number }> = ({ t }) => {
  const a = T("one roman report", D), na = T("they have no armor", D), ca = T("they have lots of cavalry", D), b = T("and the report gives", D);
  const br = T("brit and culi", D), w = T("wretched little britons", D), o = T("it is the only time", D), wr = T("and it was written", D);
  const bx = interpolate(t, [b - 0.4, b + 1.0], [2150, 1660], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const anda = t > b - 0.4 && t < b + 1.0;
  const pb = t < br ? gesto(t, [[b + 1.0, "lee"]]) : t < w ? gesto(t, [[br, "sorpresa"]]) : t < o ? { ...gesto(t, [[w, "enojado"]]), ...JARRA } : gesto(t, [[o, "niega"], [wr, "señala"], [wr + 1.6, "enojado"]]);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="violeta" />
      {/* mesa del escriba */}
      <div style={{ position: "absolute", left: 120, top: 870, width: 560, height: 36, background: "#8a5a2a", borderRadius: 10 }} />
      {[150, 620].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 900, width: 26, height: 160, background: "#6b4a2f" }} />)}
      <div style={{ position: "absolute", left: 470, top: 812, width: 110, height: 62, background: "#c9a46a", border: "5px solid #8a6a3a", borderRadius: 6, transform: "rotate(-6deg)" }} />
      <Persona x={300} y={1050} h={500} t={t} seed={95} ropa={{ ...AUX(4), tunica: "#c9a23d", tunica2: "#8f7025" }} casco="legion" malla mira={0.5}
        {...gesto(t, [[a, "escribe"], [na, "festeja"], [ca, "habla"], [b, "escribe"], [w, "festeja"], [o, "habla"], [wr, "encoge"]])}
        manoD={<rect x={-4} y={-50} width={8} height={70} fill="#2a1530" transform="rotate(20)" />} />
      <TablillaGrande t={t} t0={a + 0.5} x={1000} y={420} w={1000} vel={30} titulo="VINDOLANDA · A REPORT ON THE BRITONS"
        lineas={["“…the Britons are unprotected by armour.", "There are very many cavalry…", "…nor do the Brittunculi mount", "in order to throw javelins.”"]} />
      {t > br && <div style={{ position: "absolute", left: 780, top: 420 - 284 + 300, width: 222, height: 74, borderRadius: 40, border: `9px solid ${C.rojo}`, transform: `rotate(-3deg) scale(${ent(t, br)})` }} />}
      {/* el britano entra, lee por arriba y se ofende */}
      {t > b - 0.4 && <Persona x={bx} y={1050} h={500} t={t} seed={96} ropa={BRITON} pantalon="#8a5a2a" flip camina={anda ? 1.3 : 0} mira={-0.7} {...pb} />}
      {t > b - 0.4 && <Bronca x={bx} y={1050} h={500} t={t} t0={w} />}
      {[[na, "NO ARMOR", 760, C.rojo, "#fff"], [ca, "LOTS OF CAVALRY", 1220, C.teal, C.noche]].map(([t0, tx, x, col, ti], i) => t > (t0 as number) ? <Chip key={i} t={t} t0={t0 as number} t1={b - 0.2} text={tx as string} color={col as string} tinta={ti as string} x={x as number} y={820} centro size={56} /> : null)}
      {t > b && t < o + 0.4 && <div style={{ position: "absolute", left: 600, width: 800, top: 760, height: 130, background: C.ambar, borderRadius: 24, opacity: 1 - prog(t, o, o + 0.3), transform: `scale(${ent(t, b + 0.4)}) rotate(-2deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 84, color: C.noche, letterSpacing: 4 }}>BRITTUNCULI</div>}
      {t > w && <Chip t={t} t0={w} t1={wr - 0.5} text="= “WRETCHED LITTLE BRITONS”" color={C.rojo} x={1000} y={945} centro size={52} />}
      {t > o && <Chip t={t} t0={o} text="THE ONLY TIME THIS WORD EVER APPEARS" color="#fff" tinta={C.noche} x={1000} y={815} centro size={46} />}
    </AbsoluteFill>
  );
};
// 10:18 · lo que saben los vecinos: el valle que se inunda, la patrulla floja que mira para otro lado, la torre ciega en la niebla
const Terreno: React.FC<{ t: number }> = ({ t }) => {
  const a = T("they know the land", D), y = T("and you do not", D), f = T("they know which valleys", D), p = T("they know when the patrol", D), n = T("and they know exactly", D);
  const agua = prog(t, f + 0.2, f + 2.2);
  const nb = prog(t, n + 0.6, n + 2.8);
  const cono = 360 - 220 * nb;
  const sneak = prog(t, p + 0.4, n + 3);
  return (
    <AbsoluteFill style={{ background: "#2a2350" }}>
      <Sala t={t} tono="piedra" estante={false} />
      {/* el mapa del terreno, colgado en la pared */}
      <div style={{ position: "absolute", left: 400, top: 170, width: 1120, height: 720, borderRadius: 20, background: "#e8d8b0", border: "10px solid #8a6a3a", boxShadow: "0 18px 0 rgba(20,8,40,.35)", overflow: "hidden" }}>
        <svg width={1100} height={700} viewBox="0 0 1100 700">
          <rect width={1100} height={700} fill="#a8c47a" />
          {/* curvas de nivel: dos lomas */}
          {[0, 1, 2, 3, 4].map((i) => <ellipse key={"a" + i} cx={300} cy={260} rx={260 - i * 48} ry={190 - i * 36} fill={["#9ab86a", "#8aac5c", "#7a9e50", "#6a9044", "#5a8238"][i]} stroke="#4a6a2a" strokeWidth={4} />)}
          {[0, 1, 2, 3, 4].map((i) => <ellipse key={"b" + i} cx={800} cy={250} rx={250 - i * 46} ry={200 - i * 38} fill={["#9ab86a", "#8aac5c", "#7a9e50", "#6a9044", "#5a8238"][i]} stroke="#4a6a2a" strokeWidth={4} />)}
          {/* el valle entre las lomas: el agua sube */}
          <defs><clipPath id="valle5"><path d="M 470 0 Q 560 200 520 330 Q 470 470 380 620 L 720 620 Q 640 470 630 330 Q 600 200 650 0 Z" /></clipPath></defs>
          <path d="M 470 0 Q 560 200 520 330 Q 470 470 380 620 L 720 620 Q 640 470 630 330 Q 600 200 650 0 Z" fill="#c8b07a" opacity={0.6} />
          <g clipPath="url(#valle5)">
            <rect x={300} y={620 - 640 * agua} width={500} height={700} fill="#3d7fc9" />
            {[0, 1, 2].map((i) => <path key={i} d={`M 360 ${640 - 640 * agua + 24 + i * 40} q 30 -14 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0`} stroke="#bfe0ff" strokeWidth={5} fill="none" transform={`translate(${Math.sin(t * 3 + i) * 14} 0)`} />)}
          </g>
          {/* el muro y la torre (abajo) */}
          <rect x={0} y={620} width={1100} height={80} fill="#c9b8a0" />
          {Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 70 + 6} y={606} width={44} height={20} fill="#c9b8a0" />)}
          <path d={`M 870 620 L ${870 - cono} ${620 - cono * 1.05} A ${cono * 1.45} ${cono * 1.45} 0 0 1 ${870 + cono} ${620 - cono * 1.05} Z`} fill="#fff6c8" opacity={0.28} />
          <rect x={830} y={560} width={80} height={80} fill="#b9a98e" stroke="#7a6a52" strokeWidth={6} />
          {/* la ronda de la patrulla */}
          <path d="M 620 590 L 800 590" stroke="#fff" strokeWidth={8} strokeDasharray="18 16" />
        </svg>
        {/* niebla sobre el mapa */}
        {t > n && Array.from({ length: 6 }, (_, i) => <div key={"f" + i} style={{ position: "absolute", left: ((t - n) * (60 + i * 15) + i * 300) % 1700 - 500, top: 60 + i * 90, width: 700, height: 160, borderRadius: "50%", background: "#f4f6fa", opacity: 0.6 * nb }} />)}
        {/* la patrulla floja: bosteza y mira para el otro lado */}
        {t > p - 0.2 && <Persona x={640 + 140 * prog(t, p - 0.2, p + 0.8)} y={590} h={190} t={t} seed={27} ropa={AUX(4)} casco="legion" flip={false} mira={1} expr={t > p + 0.9 ? "dormido" : "neutro"} bD={t > p + 0.9 ? 160 : 10} bI={t > p + 0.9 ? 160 : 10} cD={40} cI={40} camina={t < p + 0.8 ? 1.4 : 0} />}
        {t > p + 0.9 && <div style={{ position: "absolute", left: 840, top: 330, fontFamily, fontWeight: 700, fontSize: 40, color: "#fff", WebkitTextStroke: "6px #2a1530", paintOrder: "stroke fill", opacity: 0.5 + 0.5 * Math.sin(t * 4) }}>z z z</div>}
        {/* los pictos se cuelan por detrás de él, por el valle */}
        {[0, 1, 2].map((i) => <Picto key={i} x={140 + i * 90 + 360 * sneak} y={480 + (i % 2) * 20 + 60 * Math.sin(sneak * 3)} s={0.62} t={t} seed={70 + i} sube={a + 0.3 + i * 0.2} />)}
      </div>
      {/* el britano que conoce la tierra y vos que no */}
      <Persona x={220} y={1050} h={500} t={t} seed={96} ropa={BRITON} pantalon="#8a5a2a" mira={0.6} {...gesto(t, [[a, "señala"], [y, "festeja"], [f, "señala"], [p, "habla"], [n, "señala"]])} />
      <Actua t={t} beats={[[a - 0.2, "camina"], [a + 0.9, "lee"], [y, "encoge"], [f, "sorpresa"], [p, "enojado"], [n, "miedo"]]} x0={2150} x1={1710} y={1050} h={480} frio />
      <Chip t={t} t0={a} t1={y - 0.15} text="THEY KNOW THE LAND" color={C.violeta} x={960} y={95} centro size={52} />
      <Chip t={t} t0={y} t1={f - 0.15} text="…AND YOU DON'T" color={C.rojo} x={960} y={95} centro size={52} />
      <Chip t={t} t0={f} t1={p - 0.15} text="WHICH VALLEYS FLOOD" color="#3d7fc9" x={960} y={95} centro size={52} />
      <Chip t={t} t0={p} t1={n - 0.15} text="WHEN THE PATROL IS LAZY" color={C.ambar} tinta={C.noche} x={960} y={95} centro size={52} />
      <Chip t={t} t0={n} text="HOW FAR YOUR TOWER SEES IN FOG" color="#2a2350" x={960} y={95} centro size={52} />
    </AbsoluteFill>
  );
};

export const W5: React.FC<{ t: number; c: Cam }> = ({ t }) => {
  if (t < 536 || t > 619) return null;
  const crece = T("outside the gates", D) + 0.6;
  const noche = t > T("it was not always", D);
  return (
    <>
      <Fuerte x={HX} y={BASE - 190} s={0.9} w={1700} piedra />
      {t > T("at the fort of", D) - 0.5 && t < T("archaeologists in the 1930s", D) && <div style={{ position: "absolute", left: HX - 520, top: BASE - 560, width: 1040, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 110, color: "#fff", WebkitTextStroke: "14px #2a1530", paintOrder: "stroke fill", transform: `scale(${ent(t, T("at the fort of", D))})` }}>HOUSESTEADS</div>}
      {/* el pueblo crece casa por casa */}
      {CASAS.map((x, i) => t > crece + i * 0.25 ? (
        <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `scale(${ent(t, crece + i * 0.25)})`, transformOrigin: `${x}px ${BASE}px` }}>
          <Casa x={x} y={BASE - 110} s={1.1} tono={["#e8b98a", "#d8a878", "#f0c89a", "#c99a6a", "#e0b080", "#d0a070"][i]} techo={i % 2 ? "#8a5a2a" : "#b5452c"} luz={noche} />
        </div>
      ) : null)}
      {ROT.map(([w, tx], i) => t > T(w, D) && t < T("it was not always", D) ? <div key={i} style={{ position: "absolute", left: CASAS[i * 2] - 140, top: BASE - 380, width: 280, height: 80, background: "#f6e3b4", border: "7px solid #8a5a2a", borderRadius: 10, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 46, lineHeight: "66px", color: C.rojo, transform: `scale(${ent(t, T(w, D))}) rotate(${(i - 1) * 4}deg)` }}>{tx}</div> : null)}
      {/* chimeneas */}
      {t > crece + 2 && CASAS.map((x, i) => [0, 1, 2].map((k) => { const kk = (t * 0.4 + k / 3 + i * 0.1) % 1; return <div key={i + "-" + k} style={{ position: "absolute", left: x + 40 + kk * 40, top: BASE - 330 - kk * 260, width: 60 + kk * 70, height: 60 + kk * 70, borderRadius: "50%", background: "#d8d0c8", opacity: 0.5 * (1 - kk) }} />; }))}
      {/* comerciantes que llegan con la mula mientras crece el pueblo */}
      {t > crece && t < T("families that the law", D) - 0.3 && [0, 1].map((i) => <Persona key={"c" + i} x={VI + 1200 + i * 220 - 900 * prog(t, crece + i * 0.3, crece + 4 + i * 0.3)} y={BASE} h={230} t={t} seed={160 + i} ropa={CIVIL(i + 5)} flip camina={1.3} expr="feliz" />)}
      {t > crece && t < T("families that the law", D) - 0.3 && <div style={{ position: "absolute", left: 0, top: 0, transform: "scaleX(-1)", transformOrigin: `${VI + 1650 - 900 * prog(t, crece, crece + 4)}px 0px` }}><Mula x={VI + 1650 - 900 * prog(t, crece, crece + 4)} y={BASE - 150} t={t} camina={1.5} s={0.75} carga /></div>}
      {/* familias, comerciantes, soldados */}
      {t > T("families that the law", D) - 0.3 && t < T("at the fort of", D) && (
        <>
          <Persona x={VI + 150} y={BASE} h={230} t={t} seed={3} ropa={TUNGRO} casco="no" malla pantalon="#6b4a2f" capa="#3f6b2a" {...gesto(t, [[T("families that the law", D) - 0.3, "festeja"], [T("traders who came", D), "habla"], [T("it sounds cozy", D), "festeja"], [T("it was not always", D), "miedo"]])} />
          <Persona x={VI + 330} y={BASE} h={215} t={t} seed={150} ropa={{ ...CIVIL(1), tunica: C.rosa, tunica2: "#c94a6a" }} {...gesto(t, [[T("families that the law", D), "habla"], [T("it sounds cozy", D), "festeja"], [T("it was not always", D), "miedo"]])} />
          <Persona x={VI + 470} y={BASE} h={120} t={t} seed={151} ropa={CIVIL(3)} expr="feliz" salta={noche ? 0 : Math.abs(Math.sin(t * 6)) * 16} />
        </>
      )}
      {t > T("traders who came", D) - 0.3 && t < T("at the fort of", D) && <><Persona x={VI + 900} y={BASE} h={240} t={t} seed={152} ropa={CIVIL(4)} flip {...gesto(t, [[T("traders who came", D), "señala"], [T("and stayed", D), "festeja"], [T("it was not always", D), "encoge"]])} /><Bolsa x={VI + 760} y={BASE - 150} s={0.5} t={t} t0={T("traders who came", D)} txt="$" /></>}
      {/* jinetes britanos en la loma del frente del muro (al norte, detrás) */}
    </>
  );
};
export const N5: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  const vis = t > T("then there are the locals", D) - 0.3 && t < 618.5;
  if (!vis) return null;
  const bx = HX * 0.62;
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const x = bx - 700 + i * 170 + Math.sin(t * 2 + i) * 6, y = 300 + (i % 3) * 24;
        const montado = i % 3 !== 1;
        return (
          <React.Fragment key={i}>
            {montado && <svg style={{ position: "absolute", left: x - 90, top: y - 90, overflow: "visible" }} width={180} height={110}><ellipse cx={90} cy={50} rx={80} ry={34} fill="#5a3a26" /><path d="M 150 40 L 190 0 L 200 20 L 168 56 Z" fill="#5a3a26" />{[30, 60, 120, 150].map((xx) => <rect key={xx} x={xx} y={70} width={12} height={40} fill="#3a2418" />)}</svg>}
            <Picto x={x} y={y - (montado ? 60 : 0)} s={0.7} t={t} seed={80 + i} sube={T("then there are the locals", D) + i * 0.08} grita={t > 602.3} />
          </React.Fragment>
        );
      })}
      {t > T("but here is the problem", D) && [0, 1, 2, 3].map((i) => <Ojos key={i} x={bx - 500 + i * 330} y={250} t={t} t0={T("but here is the problem", D) + i * 0.2} s={0.6} seed={i + 9} />)}
    </>
  );
};

export const S5: React.FC<{ t: number; c: Cam }> = ({ t, c }) => {
  if (t < 536 || t > 619) return null;
  return (
    <>
      <Plano t={t} t0={539.85} t1={T("pubs", D) - 0.15} fondo="#5fb4ea"><VicusCalle t={t} /></Plano>
      <CartelTrampa t={t} t0={536.41} n={5} titulo="THE NEIGHBORS" color={C.rosa} />
      <Ch t={t} w="outside the gates" d={D} txt="OUTSIDE EVERY BIG FORT…" x={760} y={150} c={C.violeta} size={60} dur={2.1} />
      <Ch t={t} w="a small town grows" d={D} txt="…A SMALL TOWN GROWS" x={760} y={150} c={C.teal} tinta={C.noche} size={60} dur={1.7} />
      <Gr t={t} w="the romans called it" d={D} txt="VICUS" y={200} size={190} c={C.ambar} dur={1.9} dt={0.8} />
      <Ch t={t} w="families that the law" d={D} txt="FAMILIES THE LAW DID NOT RECOGNIZE" y={150} c={C.rosa} size={54} dur={2.9} />
      <Ch t={t} w="traders who came" d={D} txt="TRADERS: CAME FOR THE SILVER, STAYED" y={150} c={C.oro} tinta={C.noche} size={54} dur={2.7} />
      <Gr t={t} w="it sounds cozy" d={D} txt="COZY?" y={200} size={170} c={C.lima} dur={1.2} />
      <Gr t={t} w="it was not always" d={D} txt="NOT ALWAYS." y={200} size={150} c={C.rojo} borde="#fff" dur={1.0} />
      <Ch t={t} w="in the middle of the wall" d={D} txt="THE MIDDLE OF THE WALL" y={150} c={C.violeta} size={56} dur={1.4} />
      <Plano t={t} t0={T("archaeologists in the 1930s", D) - 0.1} t1={T("then there are the locals", D) - 0.15} desde={[960, 760]} fondo="#2a1a10"><Piso t={t} /></Plano>
      <Ch t={t} w="nobody knows who" d={D} txt="NOBODY KNOWS WHO" y={150} c="#2a2350" size={60} dur={1.5} />
      <Ch t={t} w="nobody ever reported" d={D} txt="NOBODY REPORTED IT" y={150} c={C.rojo} size={60} dur={1.5} />
      <Gr t={t} w="the wall had a murder" d={D} txt="A MURDER MYSTERY" y={220} size={130} c={C.rojo} borde="#fff" dur={3.6} />
      <Ch t={t} w="then there are the locals" d={D} txt="THE LOCALS BEYOND THE WALL" y={150} c={C.violeta} size={58} dur={2.2} />
      <Plano t={t} t0={T("one roman report", D) - 0.1} t1={T("but here is the problem", D) - 0.15} desde={[960, 400]} fondo="#1b1240"><Informe t={t} /></Plano>
      <Ch t={t} w="and it was written" d={D} txt="WRITTEN BY A SOLDIER ON THE WALL" x={1000} y={945} c={C.teal} tinta={C.noche} size={50} dur={3.8} />
      <Ch t={t} w="but here is the problem" d={D} txt="THE PROBLEM WITH “WRETCHED”…" y={150} c={C.rojo} size={58} dur={2.6} />
      <Plano t={t} t0={T("they know the land", D) - 0.1} t1={T("which brings us", D) - 0.15} desde={[960, 360]} fondo="#7fa05a"><Terreno t={t} /></Plano>
      <Ch t={t} w="which brings us" d={D} txt="THE REASON THE WALL WAS BUILT…" y={150} c="#2a2350" size={58} dur={3.2} />
    </>
  );
};
