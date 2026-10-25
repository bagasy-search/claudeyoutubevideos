import React from "react";
import { interpolate } from "remotion";
import { C, fontFamily, ent, prog, Chip, Grande, Emote, cabeza, Particulas } from "./kit";
import { Persona, Expr } from "./persona";
import { CamP, Llave, aPantalla, SUELO } from "./mundo";
import { CHICO, SENOR, DAMA, GUARDIA, SIERVO, Perro, Trinchero, Arenque, Castor, Ganso, Jarra, Olla } from "./objetos";
import { TarjetaTrampa, Inserto } from "./comun";

// TRAMPA 1 · LA CENA (55,2-201,5 s). Todo en el gran salón: la procesión entra, el estrado del señor, la jerarquía
// de los bancos hasta vos junto a la puerta, el trinchero de pan duro, la limosna en la puerta (y el perro),
// el calendario de días de pescado, los «pescados» de los ricos (castor, ganso de percebe), potaje y un galón de cerveza.
export const T0 = 55.2, T1 = 201.5;
export const CAM: Llave[] = [
  [55.9, 4600, 2690, 0.9], [57.9, 4700, 2650, 0.92], [62.6, 5800, 2560, 0.62], [63.9, 4980, 2700, 1.15], [65.8, 4990, 2690, 1.2],
  [74.0, 4990, 2690, 1.2], [76.2, 5000, 2700, 1.05], [77.4, 6880, 2560, 1.05], [82.9, 6850, 2560, 1.0],
  [84.4, 6600, 2620, 1.0], [93.0, 5020, 2700, 1.05], [93.6, 5020, 2700, 1.05], [94.6, 5060, 2790, 2.6], [104.2, 5060, 2790, 2.4], [104.9, 5060, 2760, 1.6],
  [106.0, 5300, 2700, 0.95], [108.4, 5300, 2700, 0.95], [110.6, 2150, 3500, 1.35], [114.9, 2100, 3500, 1.35], [116.8, 5060, 2780, 1.6],
  [131.6, 5060, 2780, 1.6], [133.0, 5060, 2800, 2.3], [138.2, 5060, 2800, 2.3], [139.4, 6880, 2600, 1.25],
  [167.6, 6880, 2600, 1.25], [168.8, 5060, 2760, 1.5], [177.0, 5060, 2760, 1.5],
  [189.5, 5060, 2760, 1.5], [190.7, 2620, 1880, 1.1], [192.0, 2620, 1880, 1.1], [193.2, 5040, 2700, 1.25], [199.4, 5040, 2700, 1.3], [201.4, 5600, 2560, 0.6],
];

// comensales de los bancos, del más importante (cerca del estrado) al menos
const BANCOS: { x: number; rol?: string; tr: number; r: number }[] = [
  { x: 6460, rol: "KNIGHTS", tr: 86.36, r: 0 }, { x: 6330, tr: 86.36, r: 1 }, { x: 6200, rol: "CLERKS", tr: 87.16, r: 2 }, { x: 6070, tr: 87.16, r: 3 },
  { x: 5600, rol: "GROOMS", tr: 88.0, r: 4 }, { x: 5470, tr: 88.0, r: 5 }, { x: 5340, rol: "COOKS", tr: 88.84, r: 6 }, { x: 5210, tr: 88.84, r: 7 }, { x: 5100, rol: "LAUNDRY", tr: 89.6, r: 8 },
];
const BOY_X = 4975;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Mundo: React.FC<{ t: number; c: CamP }> = ({ t }) => {
  if (t < T0 - 1 || t > T1 + 1) return null;
  const sentados = t > 63.0;
  const pos = (i: number, x: number) => interpolate(t, [58.3 + i * 0.35, 61.8 + i * 0.35], [4500, x], cl);
  const borracho = t > 194 ? Math.sin(t * 2.2) * 9 : 0;
  const exprChico: Expr = t < 66 ? "triste" : t < 93 ? "neutro" : t < 96.2 ? "feliz" : t < 98 ? "sorpresa" : t < 132 ? "neutro" : t < 136.7 ? "feliz" : t < 138.4 ? "enojado" : t < 171.5 ? "triste" : t < 195 ? "neutro" : "feliz";
  return (
    <>
      {/* estrado: el señor, la dama y los hijos */}
      {([[6720, SENOR, "orgullo", 1], [6880, DAMA, "feliz", 2], [7020, SIERVO(3), "feliz", 3], [7110, SIERVO(0), "neutro", 4]] as const).map(([x, ropa, ex, s], i) => (
        <Persona key={i} x={x} y={2840} h={i < 2 ? 330 : 240} t={t} seed={60 + s} ropa={ropa} expr={(t > 139 && t < 168 && i === 0 ? "feliz" : ex) as Expr} habla={i === 0 && t > 139.4 && t < 141} />
      ))}
      {/* bancos */}
      {BANCOS.map((b, i) => (
        <Persona key={i} x={sentados ? b.x : pos(i, b.x)} y={2965} h={300} t={t} seed={70 + i} ropa={b.r < 2 ? GUARDIA : SIERVO(b.r)} casco={b.r < 2 ? "medieval" : "no"}
          camina={!sentados && t > 58.3 + i * 0.35 && t < 61.8 + i * 0.35 ? 1.6 : 0} expr={t > 106 && t < 108.4 ? "feliz" : "neutro"} habla={sentados && (i * 7 + Math.floor(t * 0.5)) % 3 === 0}
          bD={sentados ? 40 + 20 * Math.sin(t * 3 + i) : 8} cD={sentados ? 80 : 10} />
      ))}
      {/* vos, en la punta de abajo, junto a las puertas con corriente */}
      {t > 58 && (
        <Persona x={t < 62.5 ? interpolate(t, [58.5, 62.4], [4380, BOY_X], cl) : BOY_X} y={2965} h={280} t={t} seed={7} ropa={CHICO}
          expr={exprChico} camina={t > 58.5 && t < 62.4 ? 1.4 : 0} inclina={borracho} mira={t > 74 && t < 77 ? 1 : 0.4} salta={t > 96.2 ? 96.94 : undefined}
          bI={t > 63.9 && t < 66 ? 40 : 8} cI={t > 63.9 && t < 66 ? 100 : 10} bD={t > 171 && t < 177 ? 60 : 8} cD={t > 171 && t < 177 ? 90 : 10} />
      )}
      {/* corriente de aire de las puertas */}
      {t > 91.8 && t < 94.2 && (
        <svg style={{ position: "absolute", left: 4600, top: 2600, overflow: "visible" }} width={10} height={10}>
          {[0, 1, 2].map((i) => { const u = ((t - 91.8) * 0.9 + i / 3) % 1; return <path key={i} d={`M ${u * 600} ${80 + i * 90} q 60 -40 120 0 t 120 0`} stroke="#d6f0f7" strokeWidth={14} fill="none" strokeLinecap="round" opacity={Math.sin(u * Math.PI)} />; })}
        </svg>
      )}
      {/* tu lugar en la mesa: trinchero, arenque, potaje, jarra */}
      {t > 94.3 && t < 116 && <Trinchero x={5010} y={2800} s={0.5} t={t} t0={94.36} duro={t > 100.8} salsa={prog(t, 101.9, 103.2)} />}
      {t >= 116 && <Trinchero x={5010} y={2800} s={0.5} salsa={0.9} />}
      {t > 133.9 && t < 168.6 && <Arenque x={5010} y={2770} s={0.32} t={t} t0={134.06} />}
      {t > 136.6 && t < 138.4 && Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 4985 + (i % 5) * 12, top: 2650 + ((t * 3 + i / 14) % 1) * 120, width: 6, height: 6, background: "#fff" }} />)}
      {t > 171.3 && <Olla x={5080} y={2790} s={0.32} t={t} t0={171.5} />}
      {t > 176.3 && <Jarra x={4925} y={2780} s={0.3} t={t} t0={176.4} nivel={t > 192 ? 0.15 : 1} />}
      {/* limosna en la puerta del castillo: los pobres y el perro que se lleva un trinchero */}
      {t > 108 && t < 116 && (
        <>
          <Persona x={2120} y={SUELO - 26} h={290} t={t} seed={91} ropa={SIERVO(1)} expr={t < 113.9 ? "feliz" : "sorpresa"} bD={70} cD={60}
            manoD={t > 110.9 && t < 114.3 ? <g transform="translate(0 20) scale(0.3)"><rect x={-120} y={-50} width={240} height={100} rx={22} fill="#7a3a14" /></g> : undefined} />
          <Persona x={1960} y={SUELO - 26} h={260} t={t} seed={92} ropa={SIERVO(4)} expr="feliz" viejo flip />
          <Persona x={interpolate(t, [108, 110.6], [2600, 2300], cl)} y={SUELO - 26} h={300} t={t} seed={93} ropa={SIERVO(2)} flip camina={t < 110.6 ? 1.5 : 0} bD={60} cD={40}
            manoD={t < 110.9 ? <g transform="translate(0 30)"><rect x={-60} y={-20} width={120} height={70} rx={14} fill="#c9a36a" /><rect x={-50} y={-40} width={100} height={30} rx={10} fill="#7a3a14" /></g> : undefined} />
          <Perro x={interpolate(t, [114.0, 114.5], [1700, 2160], cl) - Math.max(0, t - 114.5) * 700} y={SUELO - 70} s={0.9} t={t} camina={1.5} flip={t > 114.5} ladra={114.3} />
        </>
      )}
      {/* el guardia que ya tomó su galón, en el adarve */}
      {t > 189 && t < 193.5 && (
        <Persona x={2620} y={1945} h={330} t={t} seed={22} ropa={GUARDIA} casco="medieval" expr="feliz" inclina={Math.sin(t * 3) * 14} bD={120} cD={40}
          manoD={<g transform="translate(0 10) scale(0.3)"><rect x={-80} y={-110} width={150} height={220} rx={14} fill="#a8622c" /></g>} />
      )}
    </>
  );
};

// calendario del año: 52 semanas x 7 días; viernes, miércoles/sábados, cuaresma y adviento se pintan
const Calendario: React.FC<{ t: number }> = ({ t }) => {
  const W = 26, H = 34, x0 = 960 - (26 * 52) / 2 + 20, y0 = 360;
  const dias = ["S", "M", "T", "W", "T", "F", "S"];
  const tipo = (sem: number, d: number) => {
    if (t > 125.02 && sem >= 7 && sem <= 12) return C.violeta;
    if (t > 125.4 && sem >= 48 && sem <= 51) return C.violeta;
    if (t > 121.36 && d === 5) return C.rojo;
    if (t > 122.6 && d === 3 && sem % 2 === 0) return C.naranja;
    if (t > 123.34 && d === 6 && sem % 2 === 1) return C.naranja;
    return "#fff6e0";
  };
  return (
    <>
      <div style={{ position: "absolute", left: 960, top: 230, transform: `translate(-50%,-50%) scale(${ent(t, 117.2)})`, fontFamily, fontWeight: 700, fontSize: 80, color: C.crema, WebkitTextStroke: `8px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>THE YEAR 1300</div>
      {dias.map((d, i) => <div key={i} style={{ position: "absolute", left: x0 - 46, top: y0 + i * (H + 6), fontFamily, fontWeight: 700, fontSize: 28, color: i === 5 && t > 121.36 ? C.rojo : "#fff" }}>{d}</div>)}
      {Array.from({ length: 52 * 7 }, (_, k) => {
        const sem = Math.floor(k / 7), d = k % 7;
        const e = ent(t, 117.3, sem * 0.012);
        const col = tipo(sem, d);
        const tachar = t > 129.3 && col !== "#fff6e0";
        return <div key={k} style={{ position: "absolute", left: x0 + sem * W, top: y0 + d * (H + 6), width: W - 4, height: H, borderRadius: 5, background: col, transform: `scale(${e})`, boxShadow: tachar ? `inset 0 0 0 3px ${C.noche}` : undefined }} />;
      })}
      {t > 130.6 && <div style={{ position: "absolute", left: x0 + 48 * W - 6, top: y0 - 16, width: 4 * W + 8, height: 7 * (H + 6) + 22, border: `8px solid ${C.oro}`, borderRadius: 14, transform: `scale(${ent(t, 130.6)})` }} />}
    </>
  );
};

const Sello: React.FC<{ t: number; t0: number; x: number; y: number; rot: number; size: number; children: React.ReactNode }> = ({ t, t0, x, y, rot, size, children }) =>
  t < t0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${ent(t, t0, 0, { damping: 7, stiffness: 260 }) * (1 + 3 * Math.max(0, 0.12 - (t - t0)))})`, border: `14px solid ${C.rojo}`, borderRadius: 20, padding: "10px 40px", fontFamily, fontWeight: 700, fontSize: size, color: C.rojo, background: "rgba(255,255,255,.88)", textAlign: "center", lineHeight: 1, whiteSpace: "nowrap" }}>{children}</div>
  );

export const Capa: React.FC<{ t: number; c: CamP }> = ({ t, c }) => {
  if (t < T0 - 0.5 || t > T1 + 0.6) return null;
  const P = (x: number, y: number) => aPantalla(c, x, y);
  const boy = P(BOY_X, 2965 - 300);
  const plato = P(5010, 2800);
  const senor = P(6720, 2840 - 340);
  const puerta = P(4770, 2500);
  const jarra = P(4925, 2780);
  return (
    <>
      <TarjetaTrampa t={t} t0={55.16} t1={57.9} n={1} nombre="SUPPER" hora="4 PM" color={C.ambar} />
      <Chip t={t} t0={59.2} t1={63.4} text="ALREADY GETTING DARK" color={C.violeta} x={120} y={140} size={52} />
      <Chip t={t} t0={61.66} t1={63.6} text="THE GREAT HALL" color={C.oro} tinta={C.noche} x={960} y={960} centro size={70} />
      <Chip t={t} t0={62.8} t1={63.6} text="LAST MEAL OF THE DAY" color={C.rojo} x={1300} y={140} size={52} />
      {t > 64.1 && t < 66.2 && <Emote t={t} t0={64.36} tipo="sudor" x={boy.x} y={boy.y + 80} s={1.4} />}
      <Chip t={t} t0={64.96} t1={66.1} text="LAST FOOD: 10 AM" color={C.rojo} x={boy.x + 140} y={boy.y - 40} size={56} />
      {/* inserto: el día con 2 comidas — nace en la panza del chico */}
      <Inserto t={t} t0={66.0} t1={74.1} ix={boy.x} iy={boy.y + 150} fondo="#ffb347" fondo2="#c2552a">
        {(() => {
          const ang = Math.PI * (1 - prog(t, 66.3, 73.2));
          return (
            <>
              <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
                <path d="M 260 820 A 700 560 0 0 1 1660 820" stroke="#fff6e0" strokeWidth={14} fill="none" strokeDasharray="30 22" />
                <rect x={160} y={820} width={1600} height={20} rx={10} fill={C.noche} />
                {([[0.2, "6 AM"], [0.48, "10 AM"], [0.75, "4 PM"], [0.96, "DARK"]] as const).map(([u, l], i) => {
                  const a = Math.PI * (1 - u);
                  return <g key={i}><circle cx={960 + Math.cos(a) * 700} cy={820 - Math.sin(a) * 560} r={14} fill={C.noche} /><text x={960 + Math.cos(a) * 700} y={900} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill={C.noche}>{l}</text></g>;
                })}
                <circle cx={960 + Math.cos(ang) * 700} cy={820 - Math.sin(ang) * 560} r={70} fill="#fff3b0" stroke="#fff" strokeWidth={8} />
              </svg>
              <Grande t={t} t0={68.96} text="2 REAL MEALS" y={200} size={130} color={C.crema} />
              <Chip t={t} t0={70.5} text="DINNER" color={C.teal} tinta={C.noche} x={960 + Math.cos(Math.PI * 0.52) * 700} y={820 - Math.sin(Math.PI * 0.52) * 560 + 110} centro size={54} />
              <Chip t={t} t0={72.42} text="SUPPER" color={C.rojo} x={960 + Math.cos(Math.PI * 0.25) * 700} y={820 - Math.sin(Math.PI * 0.25) * 560 + 110} centro size={54} />
            </>
          );
        })()}
      </Inserto>
      <Chip t={t} t0={74.8} t1={77.2} text="NOT THE GOOD END" color={C.rojo} x={boy.x + 120} y={boy.y - 30} size={56} />
      {/* estrado */}
      <Chip t={t} t0={78.46} t1={83.6} text="RAISED PLATFORM" color={C.violeta} x={150} y={830} size={56} />
      <Chip t={t} t0={80.0} t1={83.6} text="THE LORD'S FAMILY" color={C.oro} tinta={C.noche} x={senor.x} y={senor.y - 40} centro size={58} />
      <Chip t={t} t0={81.38} t1={83.6} text="CANOPY" color={C.teal} tinta={C.noche} x={1500} y={170} size={52} />
      {t > 77.6 && t < 83.6 && <Emote t={t} t0={78.0} tipo="brillos" x={senor.x} y={senor.y + 60} s={1.2} />}
      {/* jerarquía de los bancos */}
      {BANCOS.filter((b) => b.rol).map((b, i) => {
        const p = P(b.x, 2965 - 360);
        return <Chip key={b.rol} t={t} t0={b.tr} t1={93.9} text={b.rol!} color={[C.rojo, C.violeta, C.teal, C.ambar, C.rosa][i]} tinta={i === 2 || i === 3 ? C.noche : C.crema} x={p.x} y={p.y} centro size={44} />;
      })}
      {t > 84 && t < 94 && (
        <div style={{ position: "absolute", left: 160, right: 160, top: 1010, height: 26, borderRadius: 13, background: `linear-gradient(90deg, ${C.noche}, ${C.oro})`, transform: `scaleX(${prog(t, 84, 85)})`, transformOrigin: "right center" }}>
          <div style={{ position: "absolute", right: 0, top: -54, fontFamily, fontWeight: 700, fontSize: 40, color: C.oro }}>IMPORTANT</div>
          <div style={{ position: "absolute", left: 0, top: -54, fontFamily, fontWeight: 700, fontSize: 40, color: "#fff" }}>NOT IMPORTANT</div>
        </div>
      )}
      <Chip t={t} t0={92.16} t1={93.9} text="DRAFTY DOORS" color={C.teal} tinta={C.noche} x={puerta.x} y={puerta.y} centro size={46} />
      {t >= 93.38 && t < 94.2 && <Grande t={t} t0={93.38} text="YOU" x={boy.x} y={boy.y - 60} size={150} color={C.lima} />}
      {/* el trinchero */}
      <Chip t={t} t0={94.36} t1={98} text="YOUR PLATE" color={C.violeta} x={960} y={140} centro size={64} />
      <Chip t={t} t0={95.46} t1={98} text="= A SLICE OF BREAD" color={C.oro} tinta={C.noche} x={960} y={240} centro size={56} />
      <Chip t={t} t0={96.94} t1={98.2} text="NOT FRESH" color={C.rojo} x={960} y={950} centro size={64} />
      <Chip t={t} t0={98.26} t1={101.4} text="BAKED DAYS AGO" color={C.rojo} x={120} y={150} size={58} />
      <Chip t={t} t0={100.86} t1={101.9} text="*KNOCK KNOCK*" color={C.noche} x={960} y={840} centro size={56} />
      <Chip t={t} t0={101.94} t1={104.3} text="SOAKS UP THE GRAVY" color={C.ambar} tinta={C.noche} x={960} y={950} centro size={56} />
      {t >= 104.88 && t < 106 && <Grande t={t} t0={104.88} text="TRENCHER" y={180} size={150} color={C.oro} />}
      <Chip t={t} t0={107.18} t1={108.6} text="LEFTOVER TRENCHERS?" color={C.violeta} x={960} y={140} centro size={58} />
      <Chip t={t} t0={111.12} t1={114.1} text="TO THE POOR AT THE GATE" color={C.teal} tinta={C.noche} x={960} y={140} centro size={58} />
      <Chip t={t} t0={114.34} t1={115.8} text="…OR TO THE DOGS" color={C.rojo} x={960} y={140} centro size={66} />
      {/* calendario de días de pescado — nace del plato */}
      <Inserto t={t} t0={117.0} t1={132.4} ix={plato.x} iy={plato.y} fondo="#2d5bb5" fondo2={C.noche}>
        <Calendario t={t} />
        <Chip t={t} t0={121.36} text="FRIDAYS" color={C.rojo} x={200} y={760} size={50} />
        <Chip t={t} t0={122.6} text="MANY WED + SAT" color={C.naranja} x={510} y={760} size={50} />
        <Chip t={t} t0={125.02} text="LENT + ADVENT" color={C.violeta} x={1010} y={760} size={50} />
        {t >= 127.6 && <Grande t={t} t0={127.6} text="≈ 1/3 OF THE YEAR" y={930} size={110} color={C.oro} />}
        <Chip t={t} t0={129.48} text="NO MEAT" color={C.rojo} x={1480} y={760} size={50} />
        <Chip t={t} t0={130.92} text="DECEMBER = ADVENT" color={C.oro} tinta={C.noche} x={1500} y={230} centro size={50} />
      </Inserto>
      {t >= 134.06 && t < 135.3 && <Grande t={t} t0={134.06} text="FISH" y={190} size={160} color={C.teal} />}
      <Chip t={t} t0={135.02} t1={138.3} text="SALTED HERRING" color={C.teal} tinta={C.noche} x={960} y={140} centro size={62} />
      <Chip t={t} t0={136.7} t1={138.3} text="VERY, VERY SALTED" color={C.crema} tinta={C.noche} x={960} y={950} centro size={66} />
      {/* los ricos: castor y ganso de percebe — nace del señor */}
      <Chip t={t} t0={138.48} t1={140.5} text="THE RICH FOUND LOOPHOLES" color={C.oro} tinta={C.noche} x={960} y={140} centro size={58} />
      <Inserto t={t} t0={140.4} t1={168.4} ix={senor.x} iy={senor.y + 200} fondo="#2ec4d6" fondo2="#1d4f8a">
        {t < 151.3 ? (
          <>
            <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
              <rect x={0} y={700} width={1920} height={380} fill="#1d6f8a" />
              {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${((i * 260 + t * 120) % 2200) - 200} ${720 + (i % 3) * 60} q 40 -20 80 0 t 80 0`} stroke="#bff0f7" strokeWidth={8} fill="none" />)}
            </svg>
            <Castor x={interpolate(t, [140.6, 142.5], [-300, 900], cl)} y={720 + Math.sin(t * 3) * 10} s={1.6} t={t} t0={140.6} cola={t > 143.3 ? 1 : 0} />
            <Chip t={t} t0={140.64} text="BEAVER" color={C.tierra} x={160} y={150} size={70} />
            <Chip t={t} t0={142.3} text="LIVES IN WATER" color={C.teal} tinta={C.noche} x={160} y={260} size={50} />
            {t > 143.3 && <svg style={{ position: "absolute", left: 280, top: 560, transform: `scale(${ent(t, 143.3)})` }} width={500} height={300}><ellipse cx={250} cy={150} rx={230} ry={130} fill="none" stroke={C.oro} strokeWidth={14} strokeDasharray="30 20" /></svg>}
            <Chip t={t} t0={145.5} text="TAIL HAS SCALES" color={C.oro} tinta={C.noche} x={300} y={500} size={58} />
            <Sello t={t} t0={149.14} x={1350} y={420} rot={-12} size={120}>= FISH</Sello>
          </>
        ) : (
          <>
            <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
              <rect x={0} y={760} width={1920} height={320} fill="#1d4f8a" />
              {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${((i * 260 + t * 80) % 2200) - 200} ${780 + (i % 3) * 60} q 40 -20 80 0 t 80 0`} stroke="#bff0f7" strokeWidth={8} fill="none" />)}
            </svg>
            <Ganso x={960} y={600} s={1.7} brota={prog(t, 157.2, 159.6)} />
            <Chip t={t} t0={151.38} text="BARNACLE GOOSE" color={C.noche} x={160} y={150} size={64} />
            <Chip t={t} t0={153.62} text="GERALD OF WALES, c. 1188" color={C.violeta} x={160} y={250} size={46} />
            {t > 155.54 && t < 162.3 && (
              <div style={{ position: "absolute", left: 1550, top: 330, transform: `scale(${ent(t, 155.54)})` }}>
                <svg width={220} height={260} viewBox="-110 -130 220 260"><ellipse rx={80} ry={104} fill="#fff6e0" stroke="#c9b9a0" strokeWidth={8} /><line x1={-100} y1={-110} x2={100} y2={110} stroke={C.rojo} strokeWidth={22} strokeLinecap="round" /></svg>
                <div style={{ fontFamily, fontWeight: 700, fontSize: 46, color: "#fff", textAlign: "center" }}>NO EGG</div>
              </div>
            )}
            <Chip t={t} t0={157.72} t1={162.3} text="GROWS ON DRIFTWOOD" color={C.tierra} x={960} y={980} centro size={56} />
            {t >= 160.8 && t < 162.4 && <Grande t={t} t0={160.8} text="TECHNICALLY A FISH" y={160} size={110} color={C.oro} />}
            {t > 162.4 && (
              <>
                <Chip t={t} t0={162.58} text="CLERGY" color={C.violeta} x={160} y={380} size={58} />
                <Chip t={t} t0={163.4} text="ATE IT ON FAST DAYS" color={C.lima} tinta={C.noche} x={160} y={480} size={50} />
                <Sello t={t} t0={165.36} x={1380} y={300} rot={10} size={96}>THE POPE<br />SAYS NO</Sello>
                <Chip t={t} t0={167.34} text="1215" color={C.rojo} x={1380} y={500} centro size={80} />
              </>
            )}
          </>
        )}
      </Inserto>
      <Chip t={t} t0={168.64} t1={171.2} text="YOU: NO GOOSE" color={C.rojo} x={boy.x + 100} y={boy.y - 30} size={56} />
      <Chip t={t} t0={171.5} t1={177.0} text="POTTAGE" color={C.lima} tinta={C.noche} x={960} y={140} centro size={70} />
      {["PEAS", "BEANS", "OATS", "WHATEVER WAS LEFT"].map((k, i) => <Chip key={k} t={t} t0={[173.24, 173.9, 174.5, 174.88][i]} t1={177.0} text={k} color={[C.lima, C.tierra, C.ambar, C.rojo][i]} tinta={i === 0 || i === 2 ? C.noche : C.crema} x={1480} y={300 + i * 100} size={46} />)}
      <Chip t={t} t0={176.4} t1={177.4} text="+ A MUG OF ALE" color={C.ambar} tinta={C.noche} x={960} y={960} centro size={60} />
      {/* inserto: un galón por persona por día — nace de la jarra */}
      <Inserto t={t} t0={177.2} t1={189.7} ix={jarra.x} iy={jarra.y} fondo="#ffb020" fondo2="#b8541f">
        <Jarra x={520} y={560} s={2.2} t={t} t0={177.4} nivel={1} />
        {t >= 180.62 && <Grande t={t} t0={180.62} text="1 GALLON" x={1240} y={330} size={170} color={C.crema} />}
        <Chip t={t} t0={181.12} text="PER PERSON" color={C.noche} x={1240} y={500} centro size={60} />
        <Chip t={t} t0={181.8} text="PER DAY" color={C.rojo} x={1240} y={600} centro size={60} />
        {t > 183.0 && [0, 1, 2, 3].map((i) => <Jarra key={i} x={980 + i * 200} y={820} s={0.85} t={t} t0={183.1 + i * 0.18} nivel={prog(t, 183.2 + i * 0.18, 183.7 + i * 0.18)} />)}
        <Chip t={t} t0={183.4} text="≈ 4 LITERS" color={C.crema} tinta={C.noche} x={1290} y={980} centro size={56} />
        <Chip t={t} t0={185.16} text="WEAK… MOSTLY" color={C.violeta} x={120} y={140} size={54} />
        {["BREAKFAST", "LUNCH", "DINNER"].map((k, i) => <Chip key={k} t={t} t0={[187.56, 188.36, 188.98][i]} text={k} color={[C.teal, C.rosa, C.lima][i]} tinta={C.noche} x={120} y={260 + i * 100} size={50} />)}
      </Inserto>
      <Chip t={t} t0={189.78} t1={192.1} text="NOW GUARD A WALL" color={C.rojo} x={960} y={140} centro size={66} />
      {t > 190.5 && t < 193.5 && <Emote t={t} t0={190.8} tipo="brillos" {...cabeza(P(2620, 1945).x, P(2620, 1945).y, 330 * c.z)} />}
      <Chip t={t} t0={193.3} t1={199.3} text="SALT FISH + 4 L OF ALE" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={58} />
      <Chip t={t} t0={195.34} t1={199.3} text="THIRSTY" color={C.teal} tinta={C.noche} x={boy.x + 150} y={boy.y - 150} size={50} />
      <Chip t={t} t0={196.4} t1={199.3} text="SLIGHTLY DRUNK" color={C.rosa} x={boy.x + 150} y={boy.y + 20} size={50} />
      {t > 196 && t < 199.5 && <Emote t={t} t0={196.4} tipo="brillos" {...cabeza(boy.x, boy.y + 300 * c.z, 280 * c.z)} />}
      {t >= 199.94 && t < 201.4 && <Grande t={t} t0={199.94} text="THE GOOD PART" y={200} size={140} color={C.oro} />}
      {t > 199 && t < 201.6 && <Particulas t={t} tipo="destellos" n={16} seed={4} />}
    </>
  );
};
