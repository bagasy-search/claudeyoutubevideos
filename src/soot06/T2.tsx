import React from "react";
import { interpolate } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Moneda } from "./kit";
import { Persona } from "./persona";
import { CamP, Llave, aPantalla, Llama } from "./mundo";
import { CHICO, SIERVO, Vela, Junco, Campanita, Olla } from "./objetos";
import { TarjetaTrampa, Inserto, Ficha, Yo } from "./comun";

// TRAMPA 2 · LA OSCURIDAD (201,5-281,6 s). Afuera negro total; adentro la luz cuesta plata: cera (iglesia y señor),
// sebo (oveja quemada) y abajo de la escalera el junco. La campana del toque de queda (couvre-feu → curfew) y las velas
// del salón que se apagan una a una hasta que sólo queda el fuego del hogar.
export const T0 = 201.5, T1 = 281.6;
export const CAM: Llave[] = [
  [203.7, 5600, 2560, 0.6], [205.9, 3700, 2350, 0.3], [209.9, 3500, 2450, 0.32], [211.6, 5750, 2620, 0.78], [229.9, 5900, 2640, 0.82],
  [244.6, 5600, 2700, 0.8], [246.2, 6900, 660, 1.15], [251.5, 6900, 660, 1.2],
  [266.2, 6200, 1400, 0.5], [268.6, 5300, 2820, 1.4], [269.6, 5300, 2820, 1.45], [271.0, 5500, 2700, 0.9], [276.0, 5650, 2720, 0.85], [278.4, 5300, 2780, 1.35], [281.4, 5300, 2800, 1.3],
];
const BOY_X = 5300;
const VELAS = [4980, 5420, 6180, 6620];
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Mundo: React.FC<{ t: number; c: CamP }> = ({ t }) => {
  if (t < T0 - 1 || t > T1 + 1) return null;
  const viento = t > 270.3 && t < 277;
  return (
    <>
      {/* velas de sebo en la pared del salón: se apagan una por una con el viento */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      {VELAS.map((x, i) => (
        <g key={i}>
          <rect x={x - 30} y={2470} width={60} height={14} rx={4} fill="#3a3a48" />
          <rect x={x - 12} y={2400} width={24} height={72} rx={6} fill="#e8d48a" />
          <Llama x={x} y={2400} t={t} s={0.9} seed={i + 3} viva={1 - prog(t, 272.37 + i * 0.42, 272.6 + i * 0.42)} />
          {t > 272.6 + i * 0.42 && t < 275 + i * 0.42 && [0, 1].map((k) => { const u = ((t - 272.6 - i * 0.42) * 0.5 + k * 0.4) % 1; return <circle key={k} cx={x + Math.sin(u * 6) * 10} cy={2380 - u * 160} r={10 + u * 26} fill="#8a8298" opacity={0.6 * (1 - u)} />; })}
        </g>
      ))}
      {viento && [0, 1, 2, 3, 4].map((i) => { const u = ((t - 270.3) * 0.7 + i / 5) % 1; return <path key={i} d={`M ${4700 + u * 1700} ${2300 + i * 80} q 80 -50 160 0 t 160 0`} stroke="#d6f0f7" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.8 * Math.sin(u * Math.PI)} />; })}
      </svg>
      {/* vos en el salón: con la vela de junco en la mano */}
      <Persona x={BOY_X} y={2965} h={280} t={t} seed={7} ropa={CHICO} expr={t < 238 ? "neutro" : t < 243.3 ? "sorpresa" : t < 270 ? "neutro" : "miedo"} mira={t > 270 ? -0.6 : 0.3}
        bD={t > 238 ? 70 : 8} cD={t > 238 ? 70 : 10} inclina={viento ? Math.sin(t * 5) * 4 : 0}
        manoD={t > 238 && t < 278 ? <g transform="translate(0 -40) scale(0.32)"><rect x={-6} y={-200} width={12} height={220} rx={6} fill="#c9b26a" />{t < 273 && <path d={`M 0 -260 Q ${16 + Math.sin(t * 12) * 5} -230 12 -200 Q 0 -192 -12 -200 Q -14 -230 0 -260 Z`} fill="#ff9a3d" />}</g> : undefined} />
      {/* criados que tapan el fuego de la cocina con el «couvre-feu» */}
      {t > 248 && t < 252 && <Persona x={3250} y={3690} h={300} t={t} seed={81} ropa={SIERVO(5)} expr="neutro" bD={80} cD={30} />}
      {/* la campana de la tarde */}
      {t > 244 && t < 253 && (
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          <Campanita x={6900} y={560} s={1.6} t={t} tb={[245.93, 246.9, 247.91, 248.9, 249.9]} />
        </div>
      )}
    </>
  );
};

// escalera de precios de la luz (pantalla)
const Peldano: React.FC<{ t: number; t0: number; y: number; label: string; precio: string; color: string; children: React.ReactNode }> = ({ t, t0, y, label, precio, color, children }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  return (
    <div style={{ position: "absolute", left: 360, top: y, width: 1200, height: 220, transform: `translateX(${(1 - e) * 1400}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 150, width: 1200, height: 40, borderRadius: 14, background: "#7a4a22", boxShadow: "0 10px 0 rgba(14,8,40,.4)" }} />
      <div style={{ position: "absolute", left: 40, top: -40 }}>{children}</div>
      <div style={{ position: "absolute", left: 300, top: 40, fontFamily, fontWeight: 700, fontSize: 80, color: "#fff", WebkitTextStroke: `8px ${C.noche}`, paintOrder: "stroke fill" }}>{label}</div>
      <div style={{ position: "absolute", right: 30, top: 50, fontFamily, fontWeight: 700, fontSize: 70, color }}>{precio}</div>
    </div>
  );
};

export const Capa: React.FC<{ t: number; c: CamP }> = ({ t, c }) => {
  if (t < T0 - 0.5 || t > T1 + 0.6) return null;
  const P = (x: number, y: number) => aPantalla(c, x, y);
  const boy = P(BOY_X, 2965);
  const campana = P(6900, 560);
  const vela0 = P(VELAS[1], 2400);
  return (
    <>
      <TarjetaTrampa t={t} t0={201.48} t1={203.9} n={2} nombre="THE DARK" hora="6 PM" color={C.violeta} />
      {t < 210.4 && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 55%, rgba(0,0,0,0) 10%, rgba(3,2,12,.85) 60%)", opacity: prog(t, 204.4, 205.6) * (1 - prog(t, 209.9, 210.4)) }} />}
      {/* afuera: negro total */}
      <Chip t={t} t0={204.36} t1={209.9} text="OUTSIDE THE WALLS" color={C.noche} x={960} y={140} centro size={60} />
      {t >= 206.22 && t < 207.3 && <Grande t={t} t0={206.22} text="PITCH BLACK" y={540} size={170} color="#fff" />}
      {t < 210.7 && <>
      <Ficha t={t} t0={207.4} x={520} y={600} label="LIGHTS" color={C.rojo} tacha={207.9} icono={<g><rect x={-8} y={-60} width={16} height={130} fill="#3a3a48" /><circle cx={0} cy={-70} r={30} fill="#ffe08a" /></g>} />
      <Ficha t={t} t0={208.38} x={960} y={600} label="MOON" color={C.rojo} tacha={208.9} icono={<path d="M 30 -60 A 66 66 0 1 0 30 60 A 50 50 0 1 1 30 -60 Z" fill="#fff3b0" />} />
      </>}
      {t >= 209.62 && t < 210.6 && <><div style={{ position: "absolute", left: 900, top: 880, width: 600, height: 180, transform: "translate(-50%,-50%)", borderRadius: 28, background: "rgba(14,8,40,.85)", opacity: ent(t, 209.62) }} /><Grande t={t} t0={209.62} text="NOTHING." x={900} y={880} size={120} color={C.rojo} /></>}
      {t > 204.5 && t < 210.7 && <Yo t={t} t0={204.6} x={1750} h={520} expr="miedo" bD={95} cD={10} bI={95} cI={10} mira={-1} tiembla={t > 206.2 && t < 207.3} />}
      {/* adentro: la luz cuesta plata */}
      <Chip t={t} t0={210.78} t1={212.8} text="INSIDE…" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={60} />
      {t >= 211.48 && t < 212.8 && <Grande t={t} t0={211.48} text="LIGHT COSTS MONEY" y={300} size={120} color={C.oro} />}
      {t > 211.8 && t < 212.9 && [0, 1, 2, 3, 4].map((i) => <Moneda key={i} x={600 + i * 180} y={interpolate(t, [211.8 + i * 0.08, 212.4 + i * 0.08], [-100, 700], cl)} r={46} t={t} gira={2} />)}
      {/* inserto: cera vs sebo — nace de una vela del salón */}
      <Inserto t={t} t0={212.6} t1={230.2} ix={vela0.x} iy={vela0.y} fondo="#ffd36b" fondo2="#b8541f">
        {t < 220.1 ? (
          <>
            <Vela x={620} y={560} s={1.6} t={t} t0={212.7} />
            <Yo t={t} t0={212.65} x={280} expr={t > 216.6 ? "sorpresa" : "feliz"} bD={t > 216.6 ? 150 : 40} cD={t > 216.6 ? 40 : 30} mira={0.6} />
            {[0, 1, 2].map((i) => { const a = t * 2 + i * 2.1; return <g key={i}><svg style={{ position: "absolute", left: 620 + Math.cos(a) * 260 - 30, top: 420 + Math.sin(a * 1.3) * 120 - 20, overflow: "visible" }} width={60} height={40}><ellipse cx={30} cy={22} rx={26} ry={18} fill="#ffd23a" stroke={C.noche} strokeWidth={5} /><path d="M 20 6 L 20 38 M 34 6 L 34 38" stroke={C.noche} strokeWidth={6} /><ellipse cx={28} cy={2} rx={16} ry={10} fill="#fff" opacity={0.8} /></svg></g>; })}
            <Chip t={t} t0={212.66} text="BEESWAX" color={C.oro} tinta={C.noche} x={1050} y={200} size={80} />
            <Chip t={t} t0={214.48} text="BURNS CLEAN" color={C.lima} tinta={C.noche} x={1050} y={330} size={54} t1={216.5} />
            <Chip t={t} t0={215.04} text="SMELLS SWEET" color={C.rosa} x={1050} y={430} size={54} t1={216.5} />
            {t >= 216.6 && t < 218.4 && <Grande t={t} t0={216.6} text="£££££" x={1300} y={620} size={150} color={C.rojo} />}
            <Chip t={t} t0={218.48} text="⛪ CHURCH" color={C.violeta} x={1050} y={800} size={54} />
            <Chip t={t} t0={219.44} text="👑 THE LORD'S TABLE" color={C.noche} x={1050} y={900} size={54} />
          </>
        ) : (
          <>
            <Vela x={620} y={560} s={1.6} t={t} t0={220.2} sebo />
            <Yo t={t} t0={220.15} x={300} y={1080} h={600} expr={t > 225.5 ? "enojado" : "neutro"} bD={t > 227.3 ? 150 : 20} cD={t > 227.3 ? 150 : 10} mira={0.6} tiembla={t > 227.3 && t < 228.2} />
            <Chip t={t} t0={221.5} text="TALLOW" color={C.tierra} x={1050} y={200} size={80} />
            <Chip t={t} t0={223.06} text="= ANIMAL FAT" color={C.ambar} tinta={C.noche} x={1050} y={330} size={54} />
            {t > 224.4 && (
              <svg style={{ position: "absolute", left: 1150, top: 420, transform: `scale(${ent(t, 224.48)})`, overflow: "visible" }} width={300} height={200} viewBox="-150 -100 300 200">
                <ellipse cx={0} cy={0} rx={110} ry={70} fill="#f3eee0" />
                {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={Math.cos(i * 0.63) * 100} cy={Math.sin(i * 0.63) * 60} r={34} fill="#f3eee0" />)}
                <ellipse cx={120} cy={-30} rx={40} ry={30} fill="#3a3a48" />
                <circle cx={130} cy={-36} r={6} fill="#fff" />
                {[-60, -20, 30, 70].map((x) => <rect key={x} x={x} y={60} width={14} height={50} fill="#3a3a48" />)}
              </svg>
            )}
            <Chip t={t} t0={224.48} text="MUTTON" color={C.rojo} x={1500} y={460} size={54} />
            <Chip t={t} t0={225.54} text="SMOKES" color={C.noche} x={160} y={150} size={54} />
            <Chip t={t} t0={226.44} text="DRIPS" color={C.ambar} tinta={C.noche} x={160} y={250} size={54} />
            <Chip t={t} t0={227.32} text="STINKS" color={C.lima} tinta={C.noche} x={160} y={350} size={54} />
            {t > 227.3 && <svg style={{ position: "absolute", left: 470, top: 100, overflow: "visible" }} width={300} height={200}>{[0, 1, 2].map((i) => <path key={i} d={`M ${40 + i * 90} 220 q 30 -40 0 -80 t 0 -80`} stroke="#6a8a2a" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.6 + 0.4 * Math.sin(t * 6 + i)} />)}</svg>}
            {t >= 229.44 && <Grande t={t} t0={229.44} text="BURNING SHEEP" x={1250} y={800} size={120} color={C.crema} />}
          </>
        )}
      </Inserto>
      {/* inserto: la escalera de la luz y la receta de la vela de junco */}
      <Inserto t={t} t0={230.3} t1={244.6} ix={boy.x} iy={boy.y - 200} fondo="#5b2bb5" fondo2={C.noche}>
        {t < 233 ? (
          <>
            <Peldano t={t} t0={230.4} y={130} label="BEESWAX" precio="£££" color={C.oro}><svg width={200} height={200} viewBox="-100 -100 200 200"><rect x={-24} y={-40} width={48} height={120} rx={6} fill="#fff8ea" /><path d="M 0 -90 Q 18 -60 12 -40 Q 0 -32 -12 -40 Q -16 -60 0 -90 Z" fill="#ffb020" /></svg></Peldano>
            <Peldano t={t} t0={230.6} y={420} label="TALLOW" precio="££" color={C.ambar}><svg width={200} height={200} viewBox="-100 -100 200 200"><rect x={-24} y={-40} width={48} height={120} rx={6} fill="#e8d48a" /><path d="M 0 -90 Q 18 -60 12 -40 Q 0 -32 -12 -40 Q -16 -60 0 -90 Z" fill="#ff8a3d" /></svg></Peldano>
            <Peldano t={t} t0={231.28} y={710} label="RUSH LIGHT" precio="¼ d" color={C.lima}><svg width={200} height={200} viewBox="-100 -100 200 200"><line x1={-60} y1={60} x2={60} y2={-40} stroke="#c9b26a" strokeWidth={12} strokeLinecap="round" /><path d="M 60 -80 Q 72 -60 68 -44 Q 60 -38 52 -44 Q 50 -60 60 -80 Z" fill="#ff9a3d" /></svg></Peldano>
            {t > 231.3 && <div style={{ position: "absolute", left: 300, top: 690, width: 1320, height: 260, border: `10px solid ${C.lima}`, borderRadius: 24, transform: `scale(${ent(t, 231.4)})` }} />}
          </>
        ) : (
          <>
            {/* receta en 3 pasos */}
            {["PEEL A RUSH", "DIP IN KITCHEN GREASE", "SET IT ON FIRE"].map((k, i) => <Chip key={k} t={t} t0={[233.22, 235.75, 237.91][i]} text={`${i + 1}. ${k}`} color={[C.lima, C.ambar, C.rojo][i]} tinta={i < 2 ? C.noche : C.crema} x={140} y={160 + i * 110} size={56} />)}
            {t < 235.7 && (
              <svg style={{ position: "absolute", left: 960, top: 640, overflow: "visible" }} width={10} height={10}>
                <path d="M -400 200 Q -200 100 0 -300" stroke="#3a7a2a" strokeWidth={22} fill="none" />
                <path d={`M -400 200 Q -200 100 ${-400 + 400 * prog(t, 233.3, 234.6)} ${200 - 500 * prog(t, 233.3, 234.6)}`} stroke="#c9e29a" strokeWidth={14} fill="none" />
                <text x={60} y={-200} fontFamily={fontFamily} fontWeight={700} fontSize={48} fill="#fff">FROM THE RIVERBANK</text>
              </svg>
            )}
            {t >= 235.7 && t < 237.9 && <Olla x={960} y={720} s={1.3} t={t} t0={235.75} />}
            <Yo t={t} t0={233.2} x={300} y={1080} h={600} expr={t > 242.5 ? "triste" : t > 237.9 ? "sorpresa" : "orgullo"} bD={t > 237.9 ? 70 : 45} cD={t > 237.9 ? 30 : 60} mira={0.6} habla={t > 243.2} />
            {t >= 237.9 && <Junco x={900} y={640} s={1.5} t={t} t0={237.95} quema={prog(t, 239.2, 242.4)} />}
            {t > 239.8 && (
              <svg style={{ position: "absolute", left: 1350, top: 470, transform: `scale(${ent(t, 239.8)})` }} width={300} height={300} viewBox="-150 -150 300 300">
                <circle r={120} fill="#fff6e0" stroke={C.noche} strokeWidth={14} />
                {Array.from({ length: 12 }, (_, k) => <line key={k} x1={0} y1={-104} x2={0} y2={-88} stroke={C.noche} strokeWidth={8} transform={`rotate(${k * 30})`} />)}
                <rect x={-22} y={-160} width={44} height={30} rx={8} fill={C.noche} />
                <path d={`M 0 0 L 0 -100 A 100 100 0 ${prog(t, 239.9, 242.5) > 0.5 ? 1 : 0} 1 ${Math.sin(prog(t, 239.9, 242.5) * Math.PI * 2 - 0.0001) * 100} ${-Math.cos(prog(t, 239.9, 242.5) * Math.PI * 2 - 0.0001) * 100} Z`} fill={C.rojo} />
              </svg>
            )}
            <Chip t={t} t0={240.81} text="≈ 30 MIN" color={C.rojo} x={1500} y={820} centro size={64} />
            {t >= 242.53 && t < 243.3 && <Grande t={t} t0={242.53} text="GONE." x={960} y={900} size={130} color={C.crema} />}
            {t >= 243.25 && <Grande t={t} t0={243.25} text="YOUR NIGHT LIGHT" x={960} y={900} size={110} color={C.lima} />}
          </>
        )}
      </Inserto>
      {/* la campana */}
      <Chip t={t} t0={245.93} t1={251.6} text="THE EVENING BELL" color={C.oro} tinta={C.noche} x={campana.x} y={campana.y - 300} centro size={60} />
      {t > 246 && t < 251.6 && [0, 1, 2].map((i) => { const u = ((t - 246) * 0.9 + i / 3) % 1; return <div key={i} style={{ position: "absolute", left: campana.x - 160 - u * 300, top: campana.y - 160 - u * 300, width: 320 + u * 600, height: 320 + u * 600, borderRadius: "50%", border: `10px solid rgba(255,230,150,${0.7 * (1 - u)})` }} />; })}
      {t > 246.5 && t < 251.7 && <Yo t={t} t0={246.6} x={1650} h={540} expr="miedo" bD={165} cD={150} bI={165} cI={150} tiembla />}
      <Chip t={t} t0={249.82} t1={251.6} text="COVER YOUR FIRES" color={C.rojo} x={960} y={900} centro size={60} />
      <Chip t={t} t0={250.87} t1={251.6} text="GO TO BED" color={C.violeta} x={960} y={990} centro size={50} />
      {/* inserto: couvre-feu → curfew, Guillermo el Conquistador */}
      <Inserto t={t} t0={251.7} t1={266.4} ix={campana.x} iy={campana.y} fondo="#ff7a3d" fondo2="#7a1f2a">
        {t < 257.3 ? (
          <>
            <svg style={{ position: "absolute", left: 960, top: 640, overflow: "visible" }} width={10} height={10}>
              <path d="M -220 120 L 220 120 L 180 160 L -180 160 Z" fill="#5a3418" />
              {[0, 1, 2].map((i) => <path key={i} d={`M ${-120 + i * 120} 120 Q ${-150 + i * 120 + Math.sin(t * 9 + i) * 10} 20 ${-120 + i * 120} -60 Q ${-90 + i * 120} 20 ${-120 + i * 120} 120 Z`} fill={["#ff7a3d", "#ffb020", "#ff7a3d"][i]} opacity={1 - prog(t, 253.0, 253.3)} />)}
              <g transform={`translate(0 ${interpolate(t, [252.6, 253.05], [-700, 0], cl)})`}>
                <path d="M -260 130 Q -260 -150 0 -170 Q 260 -150 260 130 Z" fill="#b5652c" stroke={C.noche} strokeWidth={10} />
                {[-150, -50, 50, 150].map((x) => <circle key={x} cx={x} cy={-20} r={16} fill={C.noche} />)}
                <rect x={-30} y={-210} width={60} height={50} rx={14} fill="#8a4a1a" />
              </g>
            </svg>
            <div style={{ position: "absolute", left: 960, top: 200, transform: `translate(-50%,-50%) scale(${ent(t, 251.93)})`, fontFamily, fontWeight: 700, fontSize: 110, color: "#fff", WebkitTextStroke: `10px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>
              {t < 254.3 ? <>COVER FIRE = <span style={{ color: C.oro }}>COUVRE-FEU</span></> : <>COUVRE-FEU → <span style={{ color: C.lima }}>CURFEW</span></>}
            </div>
            <Chip t={t} t0={252.0} text="FRENCH" color={C.violeta} x={960} y={330} centro size={48} />
          </>
        ) : (
          <>
            <Persona x={560} y={960} h={620} t={t} seed={44} ropa={{ tunica: "#b5266a", tunica2: "#7a1446", cinto: "#f7c548", piel: "#f2b48a", piel2: "#d98d66", pelo: "#a0602c" }} expr={t < 261 ? "orgullo" : "enojado"} aparece={257.45} habla={t > 258 && t < 261} bD={100} cD={20} />
            <svg style={{ position: "absolute", left: 560 - 100, top: 960 - 620 * 0.98 - 40, overflow: "visible", transform: `scale(${ent(t, 257.7)})` }} width={200} height={90}><path d="M 20 80 L 10 10 L 60 50 L 100 0 L 140 50 L 190 10 L 180 80 Z" fill={C.oro} stroke={C.noche} strokeWidth={8} /></svg>
            <Chip t={t} t0={258.06} text="WILLIAM THE CONQUEROR" color={C.oro} tinta={C.noche} x={900} y={170} size={60} />
            <Chip t={t} t0={259.08} text="IMPOSED IT ON ENGLAND?" color={C.noche} x={900} y={280} size={50} />
            {[0, 1, 2].map((i) => <Persona key={i} x={1200 + i * 200} y={960} h={360} t={t} seed={50 + i} ropa={SIERVO(i + 2)} expr="enojado" aparece={260.58 + i * 0.12} salta={261.05 + i * 0.1} bD={140} cD={20} />)}
            {t > 261 && [0, 1, 2].map((i) => <Emote key={i} t={t} t0={261.05 + i * 0.1} tipo="enojo" {...cabeza(1200 + i * 200, 960, 360)} />)}
            {t > 262.64 && (
              <div style={{ position: "absolute", left: 1400, top: 470, transform: `translate(-50%,-50%) rotate(-8deg) scale(${ent(t, 262.64, 0, { damping: 7, stiffness: 260 })})`, border: `12px solid ${C.violeta}`, borderRadius: 18, padding: "8px 30px", fontFamily, fontWeight: 700, fontSize: 70, color: C.violeta, background: "rgba(255,255,255,.9)", whiteSpace: "nowrap" }}>HISTORIANS: NOT SO SURE</div>
            )}
            <Chip t={t} t0={264.96} text="BUT THE IDEA WAS REAL" color={C.lima} tinta={C.noche} x={1400} y={600} centro size={56} />
          </>
        )}
      </Inserto>
      {/* toda llama abierta = amenaza */}
      {t >= 266.9 && t < 269.3 && <Grande t={t} t0={267.44} text="EVERY OPEN FLAME" y={180} size={120} color={C.crema} />}
      {t >= 268.4 && t < 269.4 && <Grande t={t} t0={268.49} text="= A THREAT" y={330} size={120} color={C.rojo} />}
      {t > 267.5 && t < 269.4 && [[5800, 2860], [3400, 3600], [4850, 1945], [6600, 1650], [2620, 1860]].map(([x, y], i) => {
        const p = P(x, y);
        return <div key={i} style={{ position: "absolute", left: p.x - 70, top: p.y - 100, width: 140, height: 140, borderRadius: "50%", border: `10px solid ${C.rojo}`, transform: `scale(${ent(t, 267.6 + i * 0.15) * (1 + 0.1 * Math.sin(t * 10))})` }} />;
      })}
      {/* aquí estás vos */}
      <Chip t={t} t0={269.5} t1={271.6} text="SO HERE YOU ARE" color={C.lima} tinta={C.noche} x={boy.x} y={boy.y - 400 * c.z} centro size={54} />
      <Chip t={t} t0={270.69} t1={273.7} text="WIND HOWLING" color={C.teal} tinta={C.noche} x={160} y={150} size={56} />
      <Chip t={t} t0={271.87} t1={275.3} text="CANDLES GOING OUT…" color={C.violeta} x={160} y={260} size={56} />
      {[0, 1, 2, 3].map((i) => { const p = P(VELAS[i], 2300); return t > 272.6 + i * 0.42 && t < 274.6 + i * 0.42 ? <div key={i} style={{ position: "absolute", left: p.x, top: p.y - 60 * (t - 272.6 - i * 0.42), transform: "translate(-50%,-50%)", fontFamily, fontWeight: 700, fontSize: 40, color: "#fff", opacity: 1 - (t - 272.6 - i * 0.42) / 2 }}>fft</div> : null; })}
      {t >= 274.6 && t < 277 && <Grande t={t} t0={274.62} text="ONLY ONE REAL LIGHT" y={180} size={110} color={C.oro} />}
      {t > 275.9 && t < 277.2 && (() => { const p = P(5800, 2860); return <div style={{ position: "absolute", left: p.x - 160, top: p.y - 220, width: 320, height: 320, borderRadius: "50%", border: `12px solid ${C.oro}`, transform: `scale(${ent(t, 275.9)})` }} />; })()}
      {t >= 277.9 && t < 281.4 && <Grande t={t} t0={278.08} text="WHERE DO YOU SLEEP?" y={190} size={110} color={C.crema} />}
      {t > 279 && t < 281.6 && <Emote t={t} t0={279.2} tipo="preg" {...cabeza(boy.x, boy.y, 280 * c.z)} />}
    </>
  );
};
