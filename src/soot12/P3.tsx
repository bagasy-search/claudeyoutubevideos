import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Escena, Particulas, Emote, Rayos } from "./kit";
import { Mundo, camEn, Key, SAJON, VIK, barbaDe, gy } from "./mundo";
import { G, Ch, Cartel, Cuenta, Sello, Flash, LanzaMano, MapaN, lugarN } from "./comun";
import { Cita } from "./escenas";
import { Perro, Caballo, Drakkar, Esqueleto, Tienda } from "./vik";

// 295,1-393,4 s · TRAMPA 3: LOS PERROS. Cruzás, te pegás al terraplén, un gruñido. Los animales del campamento, el barco
// de Gokstad con sus 6 perros, Gunnar y su perro Sam (la saga de Njal), y vuelta al mundo: docenas de perros, un ladrido son diez.
export const CAM3: Key[] = [
  [295.06, 3560, 880, 1.8], [297.31, 3720, 760, 1.5], [299.0, 3900, 700, 2.1], [303.25, 3980, 760, 1.6],
  [305.0, 4200, 780, 2.0], [307.33, 4380, 800, 3.0],
  [371.68, 4300, 700, 1.2], [373.18, 4900, 680, 0.9], [378.0, 5300, 680, 0.85], [381.6, 4800, 720, 1.3],
  [386.8, 4500, 760, 1.6], [388.5, 5200, 620, 0.55], [393.39, 5300, 640, 0.6],
];

// animalitos planos para las grillas
const Ave: React.FC<{ x: number; y: number; s?: number; pavo?: boolean; t: number; t0: number; pica?: number }> = ({ x, y, s = 1, pavo, t, t0, pica = 0 }) => (
  <svg style={{ position: "absolute", left: x - 120 * s, top: y - 120 * s, overflow: "visible", transform: `scale(${ent(t, t0)}) rotate(${pica * 38}deg)`, transformOrigin: "50% 80%" }} width={240 * s} height={240 * s} viewBox="-120 -120 240 240">
    {pavo && Array.from({ length: 9 }, (_, i) => { const a = -150 + i * 15; const r = Math.PI / 180; return <g key={i}><line x1={0} y1={30} x2={Math.cos(a * r) * 110} y2={30 + Math.sin(a * r) * 110} stroke="#2f8a6a" strokeWidth={14} /><circle cx={Math.cos(a * r) * 110} cy={30 + Math.sin(a * r) * 110} r={16} fill="#2a5ad8" stroke="#f2c230" strokeWidth={5} /></g>; })}
    <ellipse cx={0} cy={40} rx={44} ry={50} fill={pavo ? "#2a6ad8" : "#8a6a4a"} stroke="#2a1530" strokeWidth={7} />
    <circle cx={10} cy={-20} r={26} fill={pavo ? "#2a6ad8" : "#9a7a5a"} stroke="#2a1530" strokeWidth={7} />
    <path d="M 34 -24 L 58 -14 L 34 -6 Z" fill="#f2c230" stroke="#2a1530" strokeWidth={5} />
    <circle cx={16} cy={-24} r={5} fill="#2a1530" />
    {!pavo && <path d="M -40 30 Q -100 0 -110 60 Q -70 50 -40 70 Z" fill="#6a4a2e" stroke="#2a1530" strokeWidth={6} />}
  </svg>
);
const Oveja: React.FC<{ x: number; y: number; s?: number; t: number; t0: number }> = ({ x, y, s = 1, t, t0 }) => (
  <svg style={{ position: "absolute", left: x - 120 * s, top: y - 100 * s, overflow: "visible", transform: `scale(${ent(t, t0)})` }} width={240 * s} height={200 * s} viewBox="-120 -100 240 200">
    {[-50, -20, 30, 60].map((lx) => <rect key={lx} x={lx - 8} y={20} width={16} height={60} fill="#2a1530" />)}
    {[[-50, -10], [-10, -30], [30, -10], [10, 20], [-30, 20], [60, 10]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={42} fill="#f4ead2" stroke="#2a1530" strokeWidth={6} />)}
    <ellipse cx={92} cy={-24} rx={28} ry={34} fill="#3a2a3a" />
    <circle cx={100} cy={-30} r={5} fill="#fff" />
  </svg>
);
// perro de cuerpo CORTO (largo ≈1,3× alto) dibujado acá: (x,y) = pies, mira a +x (flip = mira a −x).
// modos: duerme · alerta (orejas paradas) · grune (dientes) · ladra (mandíbula que se abre) · aulla (cabeza arriba) · muerto (de costado, patas tiesas)
type ModoCan = "duerme" | "alerta" | "grune" | "ladra" | "aulla" | "muerto";
export const Can: React.FC<{ x: number; y: number; s?: number; t: number; t0?: number; modo?: ModoCan; flip?: boolean; color?: string; oye?: boolean }> = ({ x, y, s = 1, t, t0, modo = "alerta", flip, color = "#8a7a6a", oye }) => {
  if (t0 !== undefined && t < t0) return null;
  const e = t0 === undefined ? 1 : ent(t, t0);
  const L = "#2a1530", osc = "#5a4a42", claro = "#c9b8a0";
  const ladra = modo === "ladra" && Math.sin(t * 10) > -0.2;
  const boca = modo === "aulla" ? 0.7 : ladra ? 1 : 0;
  const orejasArriba = modo !== "duerme" && modo !== "muerto";
  const cola = Math.sin(t * (modo === "alerta" ? 4 : 12)) * (modo === "grune" ? 4 : 14);
  const cab = modo === "aulla" ? -40 : ladra ? -8 : modo === "grune" ? 8 : 0;
  const oreja = orejasArriba ? (oye ? Math.sin(t * 9) * 8 : 0) : 0;
  const cuerpo = (
    <>
      {/* cola */}
      <path d={`M -78 -112 Q -120 ${-150 + cola} -104 ${-196 + cola}`} stroke={color} strokeWidth={20} fill="none" strokeLinecap="round" />
      <path d={`M -78 -112 Q -120 ${-150 + cola} -104 ${-196 + cola}`} stroke={L} strokeWidth={30} fill="none" strokeLinecap="round" opacity={0} />
      {/* patas lejanas */}
      <rect x={-62} y={-78} width={22} height={78} rx={9} fill={osc} stroke={L} strokeWidth={5} />
      <rect x={42} y={-78} width={22} height={78} rx={9} fill={osc} stroke={L} strokeWidth={5} />
      {/* cuerpo corto y alto */}
      <path d="M -92 -110 Q -96 -164 -40 -164 L 52 -168 Q 98 -168 104 -122 Q 106 -78 66 -70 L -60 -70 Q -96 -74 -92 -110 Z" fill={color} stroke={L} strokeWidth={7} strokeLinejoin="round" />
      <path d="M 40 -110 Q 70 -76 96 -100" fill={claro} opacity={0.6} />
      {/* patas cercanas */}
      <rect x={-84} y={-86} width={26} height={86} rx={10} fill={color} stroke={L} strokeWidth={6} />
      <rect x={60} y={-86} width={26} height={86} rx={10} fill={color} stroke={L} strokeWidth={6} />
      {[-71, 73].map((px) => <ellipse key={px} cx={px + 6} cy={-2} rx={20} ry={9} fill={color} stroke={L} strokeWidth={5} />)}
      {/* cabeza */}
      <g transform={`translate(88 -176) rotate(${cab})`}>
        <path d={`M ${-14 + oreja * 0.2} -30 ${orejasArriba ? `L ${-10 + oreja} -88 L 18 -40` : "Q -40 -20 -30 30 L -6 6"} Z`} fill={osc} stroke={L} strokeWidth={6} strokeLinejoin="round" />
        <ellipse cx={8} cy={0} rx={48} ry={44} fill={color} stroke={L} strokeWidth={7} />
        {/* hocico (mandíbula de arriba) */}
        <path d="M 36 -20 Q 92 -24 100 -2 Q 100 12 86 14 L 36 18 Z" fill={color} stroke={L} strokeWidth={7} strokeLinejoin="round" />
        {/* mandíbula de abajo, se abre al ladrar/aullar */}
        <g transform={`rotate(${boca * 26} 40 16)`}>
          {boca > 0 && <path d="M 40 14 L 92 12 L 86 26 L 42 28 Z" fill="#7a1a2a" />}
          <path d="M 40 16 L 88 14 Q 90 30 76 32 L 42 32 Z" fill={color} stroke={L} strokeWidth={6} strokeLinejoin="round" />
        </g>
        {(modo === "grune" || boca > 0) && [50, 64, 78].map((tx) => <path key={tx} d={`M ${tx} 15 l 5 9 l 5 -9`} fill="#fff" stroke={L} strokeWidth={2} />)}
        {modo === "grune" && <path d="M 40 16 Q 66 6 92 14" stroke={L} strokeWidth={5} fill="none" />}
        <ellipse cx={100} cy={-8} rx={11} ry={9} fill="#1d1430" />
        {orejasArriba ? (
          <>
            <ellipse cx={24} cy={-12} rx={13} ry={13} fill="#fff" stroke={L} strokeWidth={3} />
            <circle cx={28} cy={-11} r={7} fill="#1d1430" />
            {modo === "grune" && <path d="M 6 -30 L 40 -22" stroke={L} strokeWidth={7} strokeLinecap="round" />}
          </>
        ) : <path d="M 12 -12 Q 24 -4 36 -12" stroke={L} strokeWidth={5} fill="none" />}
        {/* oreja de este lado */}
        <path d={orejasArriba ? `M -20 -24 L ${-26 + oreja} -86 L 6 -36 Z` : "M -20 -20 Q -52 -6 -40 40 L -14 10 Z"} fill={osc} stroke={L} strokeWidth={6} strokeLinejoin="round" />
      </g>
      {ladra && [0, 1, 2].map((i) => <path key={i} d={`M ${206 + i * 26} ${-230 - i * 10} Q ${226 + i * 26} -200 ${206 + i * 26} ${-170 + i * 10}`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />)}
    </>
  );
  let g: React.ReactNode;
  if (modo === "duerme")
    g = (
      <>
        <path d="M -110 -10 Q -130 -60 -60 -70 L 60 -72 Q 120 -70 118 -24 Q 116 0 80 0 L -90 0 Q -112 -2 -110 -10 Z" fill={color} stroke={L} strokeWidth={7} />
        <ellipse cx={104} cy={-34} rx={40} ry={34} fill={color} stroke={L} strokeWidth={7} />
        <path d="M 96 -60 Q 70 -50 76 -12 L 100 -30 Z" fill={osc} stroke={L} strokeWidth={5} />
        <path d="M 108 -34 Q 120 -26 132 -34" stroke={L} strokeWidth={5} fill="none" />
        <path d="M -108 -14 Q -150 -4 -120 -30" stroke={color} strokeWidth={18} fill="none" strokeLinecap="round" />
      </>
    );
  else if (modo === "muerto")
    g = (
      <>
        {/* de costado, panza arriba, patas tiesas, lengua afuera, ojo en X */}
        <ellipse cx={0} cy={-46} rx={104} ry={46} fill={color} stroke={L} strokeWidth={7} />
        <path d="M -60 -70 Q 0 -94 60 -72" fill={claro} opacity={0.55} />
        {[[-64, -150], [-30, -146], [30, -144], [64, -152]].map(([px, ang], i) => <rect key={i} x={px - 11} y={-150} width={22} height={86} rx={9} fill={i % 2 ? osc : color} stroke={L} strokeWidth={5} transform={`rotate(${(i < 2 ? -18 : 18)} ${px} -70)`} />)}
        <path d="M -104 -40 Q -150 -30 -168 -12" stroke={color} strokeWidth={18} fill="none" strokeLinecap="round" />
        <g transform="translate(118 -34) rotate(12)">
          <ellipse cx={0} cy={0} rx={44} ry={38} fill={color} stroke={L} strokeWidth={7} />
          <path d="M 28 -12 Q 80 -14 88 6 Q 86 18 70 18 L 28 18 Z" fill={color} stroke={L} strokeWidth={6} />
          <path d="M 44 18 Q 50 44 62 40 Q 66 30 60 18 Z" fill="#e8607a" stroke={L} strokeWidth={4} />
          <path d="M 4 -18 L 22 0 M 22 -18 L 4 0" stroke={L} strokeWidth={6} strokeLinecap="round" />
          <path d="M -20 -28 Q -60 -10 -50 30 L -24 4 Z" fill={osc} stroke={L} strokeWidth={6} />
        </g>
      </>
    );
  else g = cuerpo;
  return (
    <svg style={{ position: "absolute", left: x - 260 * s, top: y - 300 * s, overflow: "visible" }} width={520 * s} height={320 * s} viewBox="-260 -300 520 320">
      <g transform={`translate(0 0) scale(${(flip ? -1 : 1) * e} ${e})`}>
        <ellipse cx={0} cy={2} rx={120} ry={14} fill="#000" opacity={0.25} />
        {g}
      </g>
    </svg>
  );
};

// la casa de Gunnar (casa larga) con ventanas que se encienden
export const CasaLarga: React.FC<{ t: number; luz?: number; x?: number; y?: number; s?: number }> = ({ t, luz = 1e9, x = 1250, y = 760, s = 1 }) => {
  const l = prog(t, luz, luz + 0.6);
  return (
    <svg style={{ position: "absolute", left: x - 500 * s, top: y - 360 * s, overflow: "visible" }} width={1000 * s} height={420 * s} viewBox="-500 -360 1000 420">
      <path d="M -460 -120 Q 0 -360 460 -120 L 440 40 L -440 40 Z" fill="#7a5a3a" stroke="#2a1530" strokeWidth={10} />
      <path d="M -470 -110 Q 0 -380 470 -110" fill="none" stroke="#c9a24a" strokeWidth={22} />
      {[-300, -100, 100, 300].map((wx) => <rect key={wx} x={wx - 34} y={-70} width={68} height={60} rx={6} fill={l > 0 ? `rgba(255,200,90,${0.3 + l * 0.7})` : "#1a1020"} stroke="#2a1530" strokeWidth={6} />)}
      <path d="M -40 40 L -40 -50 Q 0 -80 40 -50 L 40 40 Z" fill={l > 0 ? "#ffb84a" : "#2a1530"} />
      <path d="M -470 -110 L -520 -170 M 470 -110 L 520 -170" stroke="#2a1530" strokeWidth={12} strokeLinecap="round" />
    </svg>
  );
};
// Gunnar con el arco
const Arco = (tensa: number) => (
  <g transform="rotate(-80)">
    <path d="M 0 -150 Q 70 0 0 150" fill="none" stroke="#7a4a22" strokeWidth={12} strokeLinecap="round" />
    <path d={`M 0 -150 L ${-30 * tensa} 0 L 0 150`} fill="none" stroke="#f4ead2" strokeWidth={4} />
    {tensa > 0.3 && <line x1={-30 * tensa} y1={0} x2={150} y2={0} stroke="#5e3a1e" strokeWidth={6} />}
  </g>
);

// los tiros de Gunnar (E054): 9 que hieren (de a 2 → 16) y 2 que matan
const TIROS = [364.9, 365.45, 366.0, 366.55, 367.1, 367.65, 368.2, 368.75, 369.3, 369.85, 370.4];
const BLANCO = (i: number) => (i < 9 ? 140 + (i % 9) * 90 : i === 9 ? 140 + 4 * 90 : 140 + 7 * 90) + 30;

export const P3: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM3);
  return (
    <AbsoluteFill>
      {/* 0 · TRAMPA 3 · cruzaste la zanja, pegado al terraplén, adentro · y un gruñido */}
      <Escena t={t} t0={295.06} t1={307.36} zoom={0} entra="corte" golpes={[305.1]}>
        <Mundo t={t} cam={cam} e={{ perros: "duerme" }}>
          {(() => {
            const x = interpolate(t, [295.3, 299.0], [3560, 3880], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const acost = t > 299;
            return <Persona x={x} y={gy(x) + (acost ? 18 : 24)} h={260} t={t} seed={3} ropa={SAJON} expr={t > 305 ? "sorpresa" : "miedo"} inclina={acost ? -24 : 30} habla={t > 299 && t < 303.2} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={420} />} />;
          })()}
          {/* el perro de guardia: dormido junto a la carpa; a los 305 s levanta la cabeza, para las orejas y GRUÑE hacia vos */}
          <Can x={4330} y={884} s={0.5} t={t} modo={t > 305.1 ? "grune" : "duerme"} flip color="#8a7a6a" />
          {t > 305.1 && (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              {(() => { const k = ((t - 305.1) % 1.1) / 1.1; return <circle cx={4290} cy={800} r={30 + k * 90} fill="none" stroke="#ff6a4a" strokeWidth={5} opacity={(1 - k) * 0.8} />; })()}
            </svg>
          )}
        </Mundo>
        {t > 305 && <AbsoluteFill style={{ background: "radial-gradient(circle at 55% 55%, transparent 25%, rgba(5,3,18,.7) 60%)" }} />}
        <Cartel t={t} t0={295.1} t1={297.3} n={3} nombre="THE DOGS" />
        <Ch t={t} t0={297.5} t1={303.2} text="ACROSS THE DITCH ✓" color={C.lima} tinta={C.noche} x={120} y={150} size={58} />
        <Ch t={t} t0={299.4} t1={303.2} text="BREATHE THROUGH YOUR MOUTH" color={C.violeta} x={120} y={260} size={52} />
        <G t={t} t0={303.4} t1={305.0} text="INSIDE THE LINE" y={220} size={120} color={C.crema} />
        <G t={t} t0={305.2} text="GRRRR…" y={220} size={150} color={C.rojo} />
      </Escena>
      {/* 1 · la vida vikinga estaba llena de animales · los perros no eran mascotas: eran defensa */}
      <Escena t={t} t0={307.36} t1={314.68} entra="zoom" ix={1150} iy={600} golpes={[309.0, 309.6, 310.2, 310.8, 312.6]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a3a7a, #3a5a4a 72%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 790 Q 960 760 1920 790 L 1920 1080 L 0 1080 Z" fill="#2f5a40" /></svg>
        {/* cada animal HACE algo: el caballo come, la oveja bala, la gallina picotea los granos que tira la vikinga, el perro ladra a la derecha */}
        <Caballo x={300} y={640} s={0.7} t={t} t0={309.0} come={t > 310.0} />
        {(() => { const bala = t > 309.9 && (t - 309.9) % 1.6 < 0.7; return (
          <>
            <Oveja x={660} y={720 - (bala ? 10 : 0)} s={1.1} t={t} t0={309.6} />
            {bala && [0, 1].map((i) => <svg key={i} style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d={`M ${790 + i * 22} ${640 - i * 8} Q ${806 + i * 22} 670 ${790 + i * 22} ${700 + i * 8}`} stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" /></svg>)}
            {bala && <div style={{ position: "absolute", left: 830, top: 600, fontFamily: "Fredoka", fontWeight: 700, fontSize: 40, color: "#fff", WebkitTextStroke: `6px ${C.noche}`, paintOrder: "stroke" }}>BAA!</div>}
          </>
        ); })()}
        {t > 310.6 && Array.from({ length: 7 }, (_, i) => { const u = prog(t, 310.6 + i * 0.05, 311.1 + i * 0.05); return <circle key={i} cx={1240 - u * (180 - i * 22)} cy={600 + u * 200 - Math.sin(u * Math.PI) * 90} r={7} fill="#f2d27a" stroke="#2a1530" strokeWidth={2} />; })}
        <Ave x={1010} y={700} s={1.0} t={t} t0={310.2} pica={t > 311.1 ? Math.max(0, Math.sin((t - 311.1) * 7)) : 0} />
        <Persona x={1290} y={880} h={340} t={t} seed={77} ropa={VIK(3)} mujer expr="feliz" aparece={310.3} flip bD={t > 310.5 && t < 311.2 ? 130 - prog(t, 310.5, 311.2) * 70 : 40} cD={20} />
        <Can x={1610} y={880} s={0.85} t={t} t0={310.8} modo={t > 312.6 ? "ladra" : "alerta"} />
        <Ch t={t} t0={307.6} text="WE FORGET THIS:" color={C.violeta} x={120} y={150} size={58} />
        <Ch t={t} t0={308.4} text="FULL OF ANIMALS" color={C.ambar} tinta={C.noche} x={120} y={260} size={64} />
        <Sello t={t} t0={312.0} text="NOT PETS" x={1300} y={300} size={80} rot={-8} />
        <G t={t} t0={312.9} text="PART OF THE DEFENSE" y={960} size={90} color={C.crema} />
      </Escena>
      {/* 2 · Gokstad, Noruega: el jefe enterrado en su barco con 12 caballos, 2 halcones, 2 pavos reales y 6 perros */}
      <Escena t={t} t0={314.68} t1={318.0} zoom={0} entra="zoom">
        {/* zoom directo del mapa al túmulo de Gokstad (1→3 en 2 s, después se mete en el montículo) y empalma con el barco enterrado */}
        <MapaN t={t} cam={[[314.68, 1150, 330, 1.0], [316.7, 1232, 150, 3.0], [318.0, 1232, 152, 11.0]]} desde="NORWAY" pulsa={[{ n: "GOKSTAD", t0: 315.3, color: C.ambar, label: "GOKSTAD", lado: "der" }]}>
          {t > 316.4 && (() => { const g = lugarN("GOKSTAD"); const e = ent(t, 316.4); return (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
              <g transform={`translate(${g.x} ${g.y + 8}) scale(${e})`}>
                <path d="M -46 10 Q 0 -34 46 10 Z" fill="#5e4428" stroke="#2a1530" strokeWidth={1.4} />
                <path d="M -46 10 Q 0 -34 46 10" fill="none" stroke="#4a8a3a" strokeWidth={4} />
                {t > 317.0 && <path d="M -24 4 Q 0 12 24 4 L 28 -2 L 20 2 Q 0 6 -20 2 L -28 -2 Z" fill="#8a5a32" stroke="#2a1530" strokeWidth={0.8} opacity={prog(t, 317.0, 317.4)} />}
              </g>
            </svg>
          ); })()}
        </MapaN>
        {t > 317.4 && <AbsoluteFill style={{ background: "#1e1840", opacity: prog(t, 317.4, 318.0) }} />}
        <Ch t={t} t0={314.8} text="NORWAY" color={C.teal} tinta={C.noche} x={120} y={150} size={60} />
        <Ch t={t} t0={315.9} text="THE GOKSTAD SHIP BURIAL" color={C.ambar} tinta={C.noche} x={120} y={260} size={54} />
      </Escena>
      <Escena t={t} t0={318.0} t1={325.39} entra="iris" ix={960} iy={420} golpes={[320.3, 321.6, 322.7, 323.9]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #1e1840, #3a2a5a)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <path d="M 0 520 Q 960 120 1920 520 L 1920 1080 L 0 1080 Z" fill="#5e4428" />
          <path d="M 0 520 Q 960 120 1920 520" fill="none" stroke="#4a8a3a" strokeWidth={30} />
          {Array.from({ length: 24 }, (_, i) => <ellipse key={i} cx={(i * 173) % 1920} cy={600 + (i * 71) % 400} rx={20} ry={9} fill="#4a3420" />)}
        </svg>
        <Drakkar x={960} y={520} s={0.95} t={t} vela={0} escudos />
        <Esqueleto x={960} y={420} s={0.55} t={t} t0={318.6} />
        {/* lo que lo acompañó */}
        {[["12", "HORSES", 320.3, 300], ["2", "HAWKS", 321.6, 760], ["2", "PEACOCKS", 322.7, 1180], ["6", "DOGS", 323.9, 1620]].map(([n, txt, t0, x]) => (
          t >= (t0 as number) && <div key={txt as string} style={{ position: "absolute", left: (x as number) === 1620 ? 1560 : x as number, top: 830 + (1 - Math.min(1, (t - (t0 as number)) / 0.25)) * 40, opacity: Math.min(1, (t - (t0 as number)) / 0.2), transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 130, lineHeight: 1, color: txt === "DOGS" ? C.rojo : C.crema, WebkitTextStroke: `8px ${C.noche}`, paintOrder: "stroke" }}>{n}</div>
            <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 46, color: "#fff", background: txt === "DOGS" ? C.rojo : C.violeta, padding: "2px 18px", borderRadius: 12 }}>{txt}</div>
          </div>
        ))}
        <Ave x={760} y={660} s={0.85} t={t} t0={321.6} />
        <Ave x={1180} y={660} s={0.85} t={t} t0={322.7} pavo />
        <Can x={1560} y={735} s={0.62} t={t} t0={323.9} modo={t > 324.4 ? "ladra" : "alerta"} flip />
        <Caballo x={300} y={650} s={0.5} t={t} t0={320.3} />
        <Ch t={t} t0={318.3} text="THE DEAD CHIEFTAIN TOOK WITH HIM…" color={C.violeta} x={960} y={150} centro size={54} />
      </Escena>
      {/* 3 · eso valía un buen perro: lo bastante para llevarlo a la tumba · y las sagas cuentan qué era un perro de noche */}
      <Escena t={t} t0={325.39} t1={333.39} entra="sube" golpes={[326.6, 330.6]}>
        <Mundo t={t} cam={{ x: 4900, y: 640, z: 0.9 }} />
        <AbsoluteFill style={{ background: "radial-gradient(circle at 35% 60%, transparent 20%, rgba(5,3,18,.75) 60%)" }} />
        {/* el perro (cuerpo corto) oye y ladra; vos al lado, con la mano en la oreja, no oís nada */}
        <Can x={560} y={900} s={1.25} t={t} t0={325.5} modo={t > 327.4 && Math.sin(t * 5) > 0 ? "ladra" : "alerta"} oye={t > 326.4} />
        {t > 327.4 && [0, 1, 2].map((i) => { const k = ((t - 327.4 - i * 0.3) % 0.9) / 0.9; return <svg key={i} style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d={`M ${860 + k * 160} ${520 - k * 60} Q ${910 + k * 210} 640 ${860 + k * 160} ${760 + k * 60}`} fill="none" stroke="#fff3c4" strokeWidth={10} opacity={1 - k} /></svg>; })}
        <Persona x={1640} y={1010} h={420} t={t} seed={3} ropa={SAJON} expr={t > 328.8 ? "triste" : "neutro"} mira={-0.8} bD={t > 327.6 ? 165 : 20} cD={t > 327.6 ? 150 : 10} aparece={325.8} />
        <Emote t={t} t0={328.6} t1={330.5} tipo="preg" x={1600} y={640} s={0.9} />
        {t > 327.6 && t < 330.6 && (
          <div style={{ position: "absolute", left: 900, top: 420, display: "flex", flexDirection: "column", gap: 22, transform: `scale(${ent(t, 327.6)})`, transformOrigin: "0 50%" }}>
            {[["DOG", 4, C.rojo], ["YOU", 1, C.teal]].map(([n, v, col]) => (
              <div key={n as string} style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 130, fontFamily: "Fredoka", fontWeight: 700, fontSize: 52, color: "#fff" }}>{n}</div>
                <div style={{ height: 64, width: 95 * (v as number) * prog(t, 327.8, 328.8), background: col as string, borderRadius: 14, border: "6px solid #fff" }} />
              </div>
            ))}
            <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 40, color: C.ambar }}>HEARS 4× FARTHER</div>
          </div>
        )}
        <G t={t} t0={326.6} text="WORTH TAKING TO THE GRAVE" y={190} size={92} color={C.ambar} />
        {t > 330.6 && (
          <div style={{ position: "absolute", left: 1160, top: 520, transform: `translate(-50%,-50%) scale(${ent(t, 330.6)})`, display: "flex", gap: 0 }}>
            <div style={{ width: 400, height: 120, background: "#f4ead2", border: "8px solid #2a1530", borderRadius: "14px 0 0 14px", fontFamily: "Fredoka", fontWeight: 700, fontSize: 60, color: C.noche, display: "flex", alignItems: "center", justifyContent: "center" }}>THE SAGAS</div>
            <div style={{ width: 400, height: 120, background: "#efe2c4", border: "8px solid #2a1530", borderLeft: "none", borderRadius: "0 14px 14px 0", fontFamily: "Fredoka", fontWeight: 700, fontSize: 60, color: C.rojo, display: "flex", alignItems: "center", justifyContent: "center" }}>AT NIGHT…</div>
          </div>
        )}
      </Escena>
      {/* 4 · la saga de Njal: Gunnar y su enorme perro irlandés Sam, listo como un hombre */}
      <Escena t={t} t0={333.39} t1={344.15} entra="barrido" banda={C.ambar} golpes={[335.0, 338.8, 341.4]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #f2b07a, #ffe2b0 62%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 860 Q 960 800 1920 860 L 1920 1080 L 0 1080 Z" fill="#7aa04a" /></svg>
        <CasaLarga t={t} x={1450} y={820} s={0.75} />
        {/* Gunnar acaricia la cabeza de Sam (que mueve la cola y lo mira) */}
        <Persona x={520} y={1000} h={560} t={t} seed={90} ropa={{ tunica: "#2a6ad8", tunica2: "#1a4aa8", cinto: "#c9a24a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#e8c97a" }} barba="#e8c97a" expr={t > 336 ? "feliz" : "orgullo"} mira={0.7} miraY={t > 335.4 ? 0.6 : 0.2} manoI={Arco(0)} bI={20} bD={t > 335.4 ? 62 + Math.sin(t * 6) * 9 : 10} cD={t > 335.4 ? 18 + Math.sin(t * 6) * 10 : 10} />
        <Can x={900} y={1000} s={1.35} t={t} t0={334.6} modo={t > 341.4 ? "ladra" : "alerta"} flip={t < 341.2} color="#9a8a7a" />
        {t > 336.0 && t < 338.6 && <Emote t={t} t0={336.0} t1={338.6} tipo="brillos" x={700} y={760} s={0.9} />}
        <Ch t={t} t0={333.8} text="THE SAGA OF NJAL" color={C.violeta} x={120} y={150} size={58} />
        <Ch t={t} t0={335.0} text="GUNNAR" color={C.rojo} x={120} y={270} size={66} />
        <Ch t={t} t0={336.4} text="SAM · A HUGE IRISH HOUND" color={C.ambar} tinta={C.noche} x={1000} y={560} centro size={46} />
        <Ch t={t} t0={338.8} text="AS SMART AS A MAN" color={C.teal} tinta={C.noche} x={1450} y={250} centro size={56} />
        <Ch t={t} t0={341.4} text="BARKS AT EVERY ENEMY" color={C.rojo} x={1450} y={360} centro size={56} />
      </Escena>
      {/* 5 · vienen de noche, lo primero que hacen: matar al perro · no sirvió: un aullido terrible despierta la casa */}
      <Escena t={t} t0={344.15} t1={355.57} entra="corte" golpes={[348.4, 349.6, 350.9, 353.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0826, #241a5c 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 860 Q 960 800 1920 860 L 1920 1080 L 0 1080 Z" fill="#1e3a3a" /></svg>
        <CasaLarga t={t} x={1450} y={820} s={0.75} luz={352.6} />
        {Array.from({ length: 6 }, (_, i) => {
          const x = interpolate(t, [344.4, 348.2], [-200 - i * 110, 420 - i * 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + (i === 0 ? prog(t, 350.9, 351.5) * 260 : 0);
          const ataca = i === 0 && t > 350.9 && t < 352.4;
          return <Persona key={i} x={x} y={1000 + (i % 2) * 20} h={420} t={t} seed={400 + i} sombra="#05041a" camina={t < 348.2 || (i === 0 && t > 350.9 && t < 351.5) ? 1.2 : 0} inclina={ataca ? 22 : 0} bD={ataca ? 95 : undefined} manoD={<LanzaMano a={ataca ? 0 : 70} inclina={ataca ? 90 : -40} largo={360} />} />;
        })}
        {(() => {
          const muere = t > 351.6;
          const k = prog(t, 351.6, 352.2);
          return (
            <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - k * 0.25 }}>
              <Can x={1000} y={1010} s={1.0} t={t} modo={muere ? "muerto" : t > 350.8 ? "aulla" : t > 346 ? "ladra" : "alerta"} flip color="#9a8a7a" />
            </div>
          );
        })()}
        {t > 350.8 && t < 353.6 && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
            {[0, 1, 2, 3].map((i) => { const k = ((t - 350.8 - i * 0.22) % 0.9) / 0.9; return <circle key={i} cx={1080} cy={760} r={60 + k * 700} fill="none" stroke="#fff3c4" strokeWidth={10} opacity={(1 - k) * 0.8} />; })}
          </svg>
        )}
        <Flash t={t} t0={350.9} dur={0.2} color="#fff3c4" />
        <Ch t={t} t0={344.4} t1={349.5} text="HIS ENEMIES COME IN THE DARK" color={C.violeta} x={120} y={150} size={56} />
        <Ch t={t} t0={346.4} t1={349.5} text="STEP 1: KILL THE DOG" color={C.rojo} x={120} y={260} size={56} />
        <Sello t={t} t0={349.6} t1={350.8} text="IT DID NOT WORK" x={960} y={320} size={90} rot={-6} />
        <G t={t} t0={350.9} text="AWOOOOO" y={250} size={170} color={C.crema} />
        <Ch t={t} t0={353.0} text="THE WHOLE HOUSE: AWAKE" color={C.ambar} tinta={C.noche} x={1350} y={420} centro size={54} />
      </Escena>
      {/* 6 · lo que dijo Gunnar */}
      <Escena t={t} t0={355.57} t1={364.04} entra="iris" ix={1000} iy={900}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0826, #241a5c 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 640 Q 960 590 1920 640 L 1920 1080 L 0 1080 Z" fill="#1e3a3a" /></svg>
        <CasaLarga t={t} x={1500} y={600} s={0.6} luz={355.0} />
        {/* Gunnar ARRODILLADO junto a Sam: cadera 120 px más abajo, las piernas tapadas por el pasto de adelante, la mano en el perro */}
        {(() => {
          const baja = prog(t, 355.7, 356.6);
          const yk = 700 + baja * 120;
          return (
            <>
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><ellipse cx={620} cy={712} rx={170} ry={26} fill="#0a1a1e" opacity={0.6} /></svg>
              <Persona x={620} y={yk} h={480} t={t} seed={90} ropa={{ tunica: "#2a6ad8", tunica2: "#1a4aa8", cinto: "#c9a24a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#e8c97a" }} barba="#e8c97a" expr="triste" inclina={10 + baja * 12} mira={0.7} miraY={0.8}
                bD={45 + baja * 15 + Math.sin(t * 2.2) * 5} cD={20} bI={10 + baja * 10} cI={30} />
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
                <path d={`M 380 716 ${Array.from({ length: 22 }, (_, i) => `L ${400 + i * 20} ${700 - (i % 2) * 26 - Math.sin(t * 1.5 + i) * 3}`).join(" ")} L 860 716 L 860 1080 L 380 1080 Z`} fill="#1e3a3a" />
              </svg>
              {t > 357.5 && <Emote t={t} t0={357.5} tipo="lagrimas" x={640} y={yk - 410} s={0.8} />}
            </>
          );
        })()}
        <Can x={830} y={740} s={0.95} t={t} modo="muerto" color="#9a8a7a" />
        <Cita t={t} t0={355.8} texto="You have been hard treated, Sam, my foster child… it may be that we too will not be far apart now." autor="GUNNAR · NJAL'S SAGA" y={880} size={42} w={1560} />
      </Escena>
      {/* 7 · Gunnar, solo con su arco, contra toda la banda: 16 heridos, 2 muertos */}
      <Escena t={t} t0={364.04} t1={371.68} entra="barrido" golpes={[365.2, 366.4, 367.6, 368.5, 370.0]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a1a4a, #6a3a5a 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 880 L 1920 880 L 1920 1080 L 0 1080 Z" fill="#2a2a3a" /></svg>
        {/* Gunnar tensa y suelta: cada flecha vuela a una silueta, la pega, y el contador suma */}
        {(() => {
          const prox = TIROS.find((h) => h > t);
          const tensa = prox !== undefined && prox - t < 0.42 ? 1 - (prox - t) / 0.42 : 0;
          const heridos = Math.min(16, TIROS.slice(0, 9).filter((h) => h + 0.28 <= t).length * 2);
          const muertos = TIROS.slice(9).filter((h) => h + 0.28 <= t).length;
          const golpeH = TIROS.slice(0, 9).some((h) => t > h + 0.28 && t < h + 0.48);
          const golpeM = TIROS.slice(9).some((h) => t > h + 0.28 && t < h + 0.48);
          return (
            <>
              <Persona x={1500} y={1000} h={600} t={t} seed={90} ropa={{ tunica: "#2a6ad8", tunica2: "#1a4aa8", cinto: "#c9a24a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#e8c97a" }} barba="#e8c97a" expr="enojado" inclina={-tensa * 6} bI={90} cI={0} manoI={Arco(tensa)} bD={20 + tensa * 75} cD={10 - tensa * 185} />
              {TIROS.map((h, i) => {
                const u = prog(t, h, h + 0.28);
                const ty = 700 + (i % 3) * 40;
                return u > 0 && u < 1 ? <svg key={i} style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><g transform={`translate(${1330 - u * (1330 - BLANCO(i))} ${640 + (ty - 640) * u})`}><line x1={0} y1={0} x2={110} y2={0} stroke="#5e3a1e" strokeWidth={7} /><path d="M -18 0 L 4 -9 L 4 9 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={2} /><path d="M 100 0 L 116 -9 M 100 0 L 116 9" stroke={C.rojo} strokeWidth={5} /></g></svg> : null;
              })}
              {Array.from({ length: 9 }, (_, i) => {
                const hit = TIROS.map((h, k) => ({ h, k })).filter(({ k }) => k % 9 === i && k < 9).map(({ h }) => h + 0.28);
                const muere = (i === 4 && t > TIROS[9] + 0.28) || (i === 7 && t > TIROS[10] + 0.28);
                const sac = hit.some((h) => t > h && t < h + 0.5);
                return <Persona key={i} x={140 + i * 90} y={1000 + (i % 2) * 24} h={360} t={t} seed={420 + i} sombra="#120a20" camina={muere ? 0 : 0.6} inclina={muere ? 80 : sac ? 34 : 0} />;
              })}
              {t > 365.0 && <Cuenta t={t} t0={365.0} de={heridos} a={heridos} x={620} y={300} size={golpeH ? 240 : 210} color={C.ambar} />}
              <Ch t={t} t0={365.4} text="WOUNDED" color={C.ambar} tinta={C.noche} x={620} y={450} centro size={56} />
              {t > 370.0 && <Cuenta t={t} t0={370.0} de={muertos} a={muertos} x={1080} y={300} size={golpeM ? 240 : 210} color={C.rojo} />}
            </>
          );
        })()}
        <Ch t={t} t0={364.3} text="ALONE · ONE BOW" color={C.violeta} x={960} y={150} centro size={60} />
        <Ch t={t} t0={370.3} text="KILLED" color={C.rojo} x={1080} y={450} centro size={56} />
      </Escena>
      {/* 8 · tu problema: 2.000 hombres no tienen UN perro: tienen docenas · y caballos, y el ganado robado a tus vecinos */}
      <Escena t={t} t0={371.68} t1={393.6} zoom={0} entra="zoom" golpes={[376.7, 378.1, 386.9, 388.6]}>
        {/* tiro 1 (371,7-381,7): el campamento entero, docenas de perros que aparecen de a uno */}
        {t < 381.7 && (
          <Mundo t={t} cam={cam} e={{ perros: "alerta" }}>
            {t > 376.6 && Array.from({ length: 18 }, (_, i) => {
              const x = 4300 + i * 175 + (i % 3) * 40;
              return <Can key={i} x={x} y={gy(x) + 6 + (i % 2) * 10} s={0.62} t={t} t0={376.7 + i * 0.05} modo={Math.sin(t * 3 + i) > 0.6 ? "ladra" : "alerta"} flip={i % 2 === 1} color={["#7a6a62", "#5a4a42", "#8a7a6a", "#9a8a7a"][i % 4]} />;
            })}
            {t > 378.1 && [[4700, 0], [5800, 1], [6400, 2]].map(([x, i]) => <Oveja key={i} x={x} y={gy(x) - 4} s={0.45} t={t} t0={378.9 + i * 0.1} />)}
          </Mundo>
        )}
        {t < 381.7 && <Cuenta t={t} t0={376.75} t1={381.6} de={1} a={18} dur={0.9} x={1660} y={420} size={150} color={C.rojo} sufijo=" DOGS" />}
        {/* tiro 2 (381,7-388,6): un perro grande OYE al chico que se arrastra; ladra y la cadena de perros contesta */}
        {t >= 381.7 && t < 388.6 && (() => {
          const ladro = t > 386.85;
          const sc = interpolate(t, [386.85, 387.4], [1.7, 1.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const dx = interpolate(t, [386.85, 387.4], [1250, 1560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const bx = interpolate(t, [381.8, 384.6], [230, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const quieto = t > 384.6;
          return (
            <>
              <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0826, #241a5c 70%)" }} />
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 800 Q 960 760 1920 800 L 1920 1080 L 0 1080 Z" fill="#1e3a3a" /></svg>
              {/* la cadena: cada perro del campamento contesta al anterior */}
              {ladro && Array.from({ length: 10 }, (_, i) => {
                const x = 1300 - i * 100, y = 800 + (i % 2) * 26, tc = 387.0 + i * 0.13;
                const k = t > tc ? ((t - tc) % 0.5) / 0.5 : -1;
                return (
                  <React.Fragment key={i}>
                    <Can x={x} y={y} s={0.34} t={t} t0={tc - 0.15} modo={t > tc ? "ladra" : "alerta"} flip color={["#7a6a62", "#5a4a42", "#8a7a6a", "#9a8a7a"][i % 4]} />
                    {k >= 0 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}><path d={`M ${x - 70 - k * 30} ${y - 120 - k * 20} Q ${x - 100 - k * 40} ${y - 80} ${x - 70 - k * 30} ${y - 40 + k * 20}`} fill="none" stroke="#fff3c4" strokeWidth={6} opacity={1 - k} /></svg>}
                  </React.Fragment>
                );
              })}
              {/* ondas: el perro oye */}
              {t > 382.2 && !ladro && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{[0, 1, 2].map((i) => { const k = ((t - 382.2 + i * 0.4) % 1.2) / 1.2; return <path key={i} d={`M ${560 + k * 260} ${420 - k * 70} Q ${470 + k * 200} 560 ${560 + k * 260} ${700 + k * 70}`} fill="none" stroke="#fff3c4" strokeWidth={12} opacity={0.9 * (1 - k)} />; })}</svg>}
              {ladro && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{[0, 1, 2].map((i) => { const k = ((t - 386.9 + i * 0.25) % 0.75) / 0.75; return <path key={i} d={`M ${1300 - k * 260} ${560 - k * 60} Q ${1250 - k * 330} 690 ${1300 - k * 260} ${820 + k * 60}`} fill="none" stroke="#fff3c4" strokeWidth={14} opacity={1 - k} />; })}</svg>}
              {/* el chico se arrastra, se congela, y el ladrido lo asusta */}
              <Persona x={bx} y={1040} h={440} t={t} seed={3} ropa={SAJON} expr={ladro ? "miedo" : quieto ? "sorpresa" : "neutro"} inclina={ladro ? -10 : 0} camina={quieto ? 0 : 0.8} mira={1} bD={ladro ? 160 : 40} cD={30} bI={ladro ? 160 : 30} cI={30} />
              {quieto && !ladro && <Emote t={t} t0={384.7} tipo="sudor" x={bx - 60} y={760} />}
              {ladro && <Emote t={t} t0={386.95} tipo="susto" x={bx - 60} y={760} />}
              <Can x={dx} y={1000} s={sc} t={t} t0={381.75} modo={ladro ? "ladra" : t > 384.6 ? "grune" : "alerta"} oye={!ladro} flip color="#8a7a6a" />
            </>
          );
        })()}
        {/* tiro 3 (388,6-393,6): las carpas se encienden una por una y sale un vikingo de cada una */}
        {t >= 388.6 && (
          <>
            <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a0826, #241a5c 70%)" }} />
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 0 820 Q 960 790 1920 820 L 1920 1080 L 0 1080 Z" fill="#1e3a3a" /></svg>
            {[0, 1, 2, 3, 4].map((i) => {
              const x = 240 + i * 360, tl = 388.75 + i * 0.4;
              const sale = prog(t, tl + 0.25, tl + 1.0);
              return (
                <React.Fragment key={i}>
                  {t > tl && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}><ellipse cx={x} cy={820} rx={200} ry={40} fill="#ffb84a" opacity={0.25 * prog(t, tl, tl + 0.3)} /></svg>}
                  <Tienda x={x} y={694} s={0.7} t={t} k={i} luz={t > tl} />
                  {t > tl + 0.25 && <Persona x={x + sale * 70 * (i % 2 ? -1 : 1)} y={900 + sale * 70} h={340} t={t} seed={500 + i} ropa={VIK(i)} barba={barbaDe(i)} casco="vikingo" expr="enojado" aparece={tl + 0.25} camina={sale < 1 ? 1.1 : 0} flip={i % 2 === 1} bD={sale >= 1 ? 150 : 40} cD={20} manoD={<LanzaMano a={sale >= 1 ? 160 : 60} inclina={-30} largo={300} />} />}
                </React.Fragment>
              );
            })}
            <Cuenta t={t} t0={388.75} de={0} a={5} dur={1.7} x={1720} y={330} size={130} color={C.ambar} sufijo="/5" />
            <Ch t={t} t0={388.8} text="TENTS AWAKE" color={C.ambar} tinta={C.noche} x={1720} y={440} centro size={40} />
          </>
        )}
        <Ch t={t} t0={371.9} t1={376.6} text="SO HERE IS YOUR PROBLEM" color={C.violeta} x={960} y={150} centro size={60} />
        <Ch t={t} t0={373.4} t1={376.6} text="2,000 MEN ≠ 1 DOG" color={C.ambar} tinta={C.noche} x={960} y={260} centro size={60} />
        <G t={t} t0={376.7} t1={378.0} text="DOZENS" y={240} size={180} color={C.rojo} />
        <Ch t={t} t0={378.1} t1={381.5} text="+ HORSES" color={C.teal} tinta={C.noche} x={300} y={160} size={56} />
        <Ch t={t} t0={379.4} t1={381.5} text="+ YOUR NEIGHBORS' STOLEN SHEEP" color={C.ambar} tinta={C.noche} x={300} y={270} size={50} />
        <Ch t={t} t0={381.8} t1={386.7} text="BETTER EARS THAN YOU" color={C.violeta} x={960} y={150} centro size={58} />
        <Ch t={t} t0={384.0} t1={386.7} text="NOTHING TO LOSE" color={C.rojo} x={960} y={260} centro size={58} />
        <G t={t} t0={386.9} t1={388.5} text="1 BARK = 10" y={230} size={150} color={C.crema} />
        <Sello t={t} t0={388.7} t1={390.8} text="CAMP: AWAKE" x={900} y={330} size={100} rot={-5} />
        <Ch t={t} t0={390.9} text="…AND THAT WAS THE QUIET PART" color={C.ambar} tinta={C.noche} x={900} y={200} centro size={64} />
      </Escena>
    </AbsoluteFill>
  );
};

void Particulas; void Emote; void VIK; void barbaDe;
