import React from "react";
import { interpolate } from "remotion";
import { C, prog, Emote } from "./kit";
import { Persona, GRUMETE, CAPITAN, PIRATA, Ropa } from "./persona";
import { Key, CUB, ALCA, MAR } from "./barco";
import { G, S, P, arco, Pila, Libro, Dado, Carta, Signo, Pistola, Sable, Botella, Gato9, Galleta, Moneda8, Globo, Sello, TINTA } from "./obj";
import { Txt, Lbl, Lista, Flash, en } from "./dsl";
import { CartelTrampa } from "./mundo";

// TRAMPA 3 · LOS ARTÍCULOS (264,6-369,8): la constitución pirata, el libro de 1724, Roberts, las reglas una por una
// (voto, luces a las 8, sin juego, sin peleas → duelo en la isla), el reparto en monedas, el capitán destituido,
// el contramaestre temido, el artículo 6 "no boys" y la solución simple: el próximo puerto.
export const ROBERTS: Ropa = { ...CAPITAN, tunica: "#c81d2e", tunica2: "#7a0f1d", gorroCol: "#1d1420", barba: "#2a1a10", pelo: "#2a1a10" };
const QM: Ropa = { ...PIRATA(5), tunica: "#3a3a4a", tunica2: "#1d1d28", barba: "#1d1410", parche: true, gorro: "bandana", gorroCol: "#1d1420" };
const ISLA = 7800;

export const K3: Key[] = [
  [266.8, 1850, 1330, -1.5, 0.8],
  [270.1, 2050, 1370, -2.1, 0.8],
  [274.9, 1950, 1340, -1.6, 0.8],
  [278.2, 1250, 1300, -2.0, 0.7, "seco"],
  [284.8, 1100, 1060, -2.3, 0.8],
  [291.1, 2000, 1250, -1.0, 0.8],
  [293.6, 1900, 1150, -0.55, 0.8],
  [296.1, 2200, 1340, -1.9, 0.7],
  [299.7, 1700, 1380, -2.6, 0.6, "seco"],
  [302.2, 2350, 1360, -2.1, 0.6, "seco"],
  [304.1, ISLA, 1800, 1.5, 1.1],
  [307.9, 2000, 1300, -1.2, 1.0],
  [310.3, 1500, 1380, -2.1, 0.7],
  [312.9, 1900, 1380, -2.1, 0.7],
  [316.6, 2300, 1380, -2.1, 0.7],
  [318.1, 2620, 1400, -2.7, 0.6, "seco"],
  [320.5, 2050, 1340, -1.2, 0.8],
  [322.3, 1000, 1080, -2.0, 0.8],
  [327.2, 2300, 1310, -2.2, 0.8],
  [333.2, 2000, 1300, -1.1, 0.8],
  [338.7, 1850, 1390, -2.6, 0.8],
  [344.5, 2000, 1320, -1.3, 0.8],
  [346.9, 2250, 1390, -2.0, 0.7],
  [352.7, 1900, 1330, -1.6, 0.9],
  [356.5, 1850, 1390, -2.4, 1.2],
  [360.5, 2050, 1360, -1.7, 0.7, "seco"],
  [363.0, 2050, 1380, -2.5, 0.7],
  [366.2, ISLA - 150, 1820, 1.7, 1.2],
];

// reparto: [x en cubierta, quién, acciones]
const REPARTO: [number, string, number, number, Ropa, number][] = [[1500, "CAPTAIN · 2", 2, 310.3, ROBERTS, 265], [1700, "QUARTERMASTER · 2", 2, 311.4, QM, 260], [2000, "MASTER · 1½", 1.5, 312.9, PIRATA(1), 250], [2200, "BOATSWAIN · 1½", 1.5, 313.9, PIRATA(2), 250], [2400, "GUNNER · 1½", 1.5, 315.0, PIRATA(3), 250], [2580, "PIRATE · 1", 1, 316.6, PIRATA(4), 250]];

export const A3: React.FC<{ t: number }> = ({ t }) => {
  if (t < 264 || t > 371) return null;
  const firma = (i: number) => en(t, 275 + i * 0.5, 275.5 + i * 0.5);
  const fila = en(t, 266, 304.1);
  const reparto = en(t, 307.6, 322.3);
  const echado = t > 324.5 ? arco(t, 324.5, 325.6, [1000, ALCA], [-200, 2300], 300) : null;
  return (
    <>
      {/* la tripulación alrededor de la mesa de los artículos */}
      {fila && [1550, 1750, 2350, 2550, 2750, 2950].map((x, i) => {
        const voto = en(t, 291.4 + i * 0.1, 293.5);
        const pelea = en(t, 302.2, 304.1) && (i === 2 || i === 3);
        return <Persona key={i} x={pelea ? (i === 2 ? 2280 : 2440) : x} y={CUB} h={250} t={t} seed={160 + i} ropa={PIRATA(i)} flip={x > 2050 && !(pelea && i === 2)}
          expr={pelea ? "enojado" : voto ? "orgullo" : en(t, 299.7, 302.2) ? "triste" : "neutro"} habla={pelea || (i === 1 && en(t, 270, 274))}
          bD={voto ? 170 : firma(i) ? 60 : pelea ? 120 + Math.sin(t * 12 + i) * 30 : en(t, 296, 299.7) && i > 2 ? 140 : 10} cD={voto ? 0 : 40}
          manoD={en(t, 296, 299.7) && i > 2 ? <g transform="translate(0 -20) scale(0.3)"><Botella c="#5a8a3a" /></g> : undefined} />;
      })}
      {/* el contramaestre escribe */}
      {en(t, 266, 290) && <Persona x={2050} y={CUB} h={260} t={t} seed={170} ropa={QM} expr="orgullo" habla={en(t, 270, 274)} bD={en(t, 270, 275) ? 50 + Math.sin(t * 10) * 8 : 10} cD={70} />}
      {/* Roberts */}
      {en(t, 284, 307.5) && <Persona x={1000} y={ALCA} h={270} t={t} seed={171} ropa={ROBERTS} flip expr="orgullo" habla={en(t, 289.5, 302)} bD={en(t, 291, 293.5) ? 170 : 30} cD={0} />}
      {/* el reparto: cada uno con su pila */}
      {reparto && REPARTO.map(([x, , , t0, r, h], i) => <Persona key={i} x={x} y={CUB} h={h} t={t} seed={180 + i} ropa={r} flip={i > 2} expr={t > t0 ? "feliz" : "neutro"} aparece={308 + i * 0.12} />)}
      {reparto && <Persona x={2780} y={CUB} h={180} t={t} seed={7} ropa={GRUMETE} flip expr={t > 318.3 ? "sorpresa" : "neutro"} aparece={308.8} salta={318.4} />}
      {/* el capitán destituido y el nuevo */}
      {en(t, 322.3, 327.2) && !echado && <Persona x={1000} y={ALCA} h={265} t={t} seed={172} ropa={CAPITAN} expr={t > 323.3 ? "miedo" : "orgullo"} />}
      {echado && echado.u < 1 && <Persona x={echado.x} y={echado.y} h={265} t={t} seed={172} ropa={CAPITAN} expr="miedo" inclina={echado.u * 300} bD={160} bI={160} />}
      {en(t, 322.3, 327.2) && [1400, 1600, 1800, 2000].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={190 + i} ropa={PIRATA(i + 1)} flip expr={t > 323.3 ? "enojado" : "neutro"} bD={t > 323.3 ? 170 : 10} cD={0} />)}
      {/* el contramaestre: comida en una mano, castigo en la otra */}
      {en(t, 327.2, 333.2) && <Persona x={2300} y={CUB} h={290} t={t} seed={170} ropa={QM} expr="enojado" bD={110} cD={50} bI={110} cI={50}
        manoD={<g transform="translate(0 -20) scale(0.3)"><Galleta /></g>} manoI={<g transform="scale(0.28) rotate(180)"><Gato9 t={t} /></g>} />}
      {en(t, 327.2, 333.2) && <Persona x={2000} y={CUB} h={180} t={t} seed={7} ropa={GRUMETE} expr="miedo" />}
      {/* artículo 6: el chico frente a las reglas */}
      {en(t, 333.2, 366.2) && <Persona x={1850} y={CUB} h={180} t={t} seed={7} ropa={GRUMETE} flip={false}
        expr={t > 342.3 && t < 360.5 ? "triste" : t > 360.5 ? "feliz" : "neutro"}
        bD={en(t, 360.5, 363) ? 160 + Math.sin(t * 14) * 20 : 10} bI={en(t, 360.5, 363) ? 160 - Math.sin(t * 14) * 20 : 10} salta={360.6} />}
      {en(t, 344.4, 360.5) && [2250, 2450].map((x, i) => <Persona key={i} x={x} y={CUB} h={250} t={t} seed={200 + i} ropa={PIRATA(i + 3)} flip expr={en(t, 352.7, 360.5) ? "neutro" : "enojado"} bD={en(t, 346.9, 352.7) ? 120 : 10} />)}
      {en(t, 352.7, 360.5) && <Emote t={t} t0={356.6} t1={360.4} tipo="lagrimas" x={1850} y={1335} s={0.3} />}
      <G>
        {/* el pergamino de los artículos sobre un barril */}
        {en(t, 266, 290) && <g><rect x={1880} y={1440} width={340} height={60} rx={8} fill="#8a4f22" />
          <rect x={1900} y={1330} width={300} height={110} fill="#f4ead2" stroke="#a8946a" strokeWidth={4} />
          {Array.from({ length: 5 }, (_, i) => t > 267.0 + i * 0.5 && <line key={i} x1={1920} y1={1350 + i * 16} x2={2180 - (i % 2) * 40} y2={1350 + i * 16} stroke="#8a7a5a" strokeWidth={4} />)}
          {Array.from({ length: 7 }, (_, i) => t > 275 + i * 0.45 && <text key={`f${i}`} x={1915 + i * 40} y={1432} fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={22} fill="#5a2a1a">{i % 2 ? "X" : "✗"}</text>)}</g>}
        {[270.4, 271.0, 271.6, 272.2, 272.8].map((a, i) => <S key={i} t={a} p="write" g={-14} />)}
        {[275, 275.45, 275.9, 276.35, 276.8, 277.25, 277.7].map((a, i) => <S key={`f${i}`} t={a} p="stamp" g={-14} pitch={1.4} />)}
        <Lbl t={t} t0={275.2} t1={278.1} x={2050} y={1180} txt="SIGN OR MAKE YOUR MARK" size={44} color={C.oro} />
        {/* el libro de 1724 */}
        <P t={t} t0={278.3} t1={284.6} x={1250} y={1300} s={0.42} flota><Libro titulo={["A GENERAL", "HISTORY", "OF THE", "PIRATES"]} /></P>
        <Lbl t={t} t0={279.5} t1={284.6} x={1250} y={1440} txt="1724" size={60} color={C.oro} />
        <S t={278.3} p="paper" g={-6} />
        <S t={279.5} p="sparkle" g={-10} />
        <Lbl t={t} t0={285.4} t1={290.8} x={1000} y={1565} txt="BARTHOLOMEW ROBERTS" size={40} color={C.oro} />
        <S t={285.4} p="fanfare" g={-12} />
        {/* voto */}
        <S t={291.4} p="cloth" g={-8} />
        <S t={291.8} p="laugh" g={-14} />
        {/* luces: 8 en punto */}
        <Lbl t={t} t0={293.9} t1={296.0} x={1900} y={700} txt="8 PM · LIGHTS OUT" size={110} color={C.oro} />
        <S t={293.9} p="cricket" g={-12} d={6} />
        <S t={294.0} p="tick" g={-10} />
        {/* beber en cubierta */}
        <Lbl t={t} t0={296.4} t1={299.6} x={2330} y={1180} txt="DRINK? OPEN DECK." size={42} color={C.lima} />
        <S t={296.4} p="drink" g={-8} />
        <S t={297.6} p="glass" g={-10} />
        {/* sin apuestas */}
        <P t={t} t0={299.8} t1={302.1} x={1620} y={1390} s={0.5}><Dado n={5} /></P>
        <P t={t} t0={300.0} t1={302.1} x={1760} y={1390} s={0.45} rot={10}><Carta txt="A" /></P>
        <P t={t} t0={300.6} t1={302.1} x={1700} y={1300} s={1.1}><Signo k="cross" /></P>
        <S t={299.8} p="roll" g={-8} />
        <S t={300.6} p="fail" g={-10} />
        {/* sin peleas a bordo */}
        <P t={t} t0={302.9} t1={304.1} x={2360} y={1190} s={1.1}><Signo k="cross" /></P>
        <S t={302.3} p="punch" g={-10} />
        <S t={302.9} p="fail" g={-12} />
        {/* reparto: pilas de monedas */}
        {reparto && REPARTO.map(([x, txt, n, t0], i) => (
          <g key={i}>
            <g transform={`translate(${x} ${CUB - 6}) scale(0.5)`}><Pila n={n} t={t} t0={t0} oro /></g>
            <Lbl t={t} t0={t0} t1={320.4} x={x} y={CUB + 62 + (i % 2) * 34} txt={txt} size={30} color={C.crema} />
          </g>
        ))}
        {reparto && <g transform={`translate(2780 ${CUB - 6}) scale(0.5)`}><Pila n={0.5} t={t} t0={318.3} oro /></g>}
        <Lbl t={t} t0={318.3} t1={320.4} x={2780} y={CUB + 80} txt="BOY · ½" size={40} color={C.oro} />
        {REPARTO.map(([, , , t0], i) => <S key={i} t={t0} p="coin" g={-8} pitch={1 + i * 0.05} />)}
        <S t={318.3} p="coin" g={-6} pitch={1.6} />
        {/* destituido */}
        <Lbl t={t} t0={323.4} t1={327.1} x={1000} y={960} txt="VOTED OUT" size={64} color={C.rojo} />
        <S t={323.4} p="stamp" g={-6} />
        <S t={324.5} p="whoosh" g={-6} />
        <S t={325.7} p="splash" g={-6} />
        <Lbl t={t} t0={327.6} t1={333.1} x={2300} y={1050} txt="QUARTERMASTER" size={56} color={C.crema} />
        <S t={327.6} p="suspense" g={-10} d={2.5} />
        <S t={330.9} p="heart" g={-8} />
        {/* razones: la parte del chico sale de la de un hombre */}
        {en(t, 346.9, 352.7) && (() => { const p = arco(t, 349.5, 350.5, [2280, 1300], [1880, 1300], 120); return <g transform={`translate(${p.x} ${p.y}) scale(0.4)`}><Moneda8 r={40} oro t={t} gira={1} /></g>; })()}
        <Lbl t={t} t0={347.2} t1={352.6} x={2150} y={1215} txt="A BOY CAN'T FIGHT" size={44} color={C.crema} />
        <S t={349.5} p="coin" g={-8} />
        <Lbl t={t} t0={353.0} t1={360.4} x={1850} y={1130} txt="NOT A SAFE PLACE" size={56} color={C.lila} />
        <S t={353.0} p="sad" g={-10} />
        {/* útil, muy útil */}
        {en(t, 360.5, 363) && ["⚓", "🍞", "🔔"].map((_, i) => <g key={i} transform={`translate(${1850 + Math.cos(t * 6 + i * 2.1) * 120} ${1250 + Math.sin(t * 6 + i * 2.1) * 50})`}>{i === 0 ? <circle r={22} fill={C.oro} /> : i === 1 ? <rect x={-22} y={-14} width={44} height={28} rx={8} fill="#e0b26a" /> : <path d="M -18 10 Q -18 -22 0 -22 Q 18 -22 18 10 Z" fill={C.oro} />}</g>)}
        <Lbl t={t} t0={360.6} t1={362.9} x={2050} y={1150} txt="VERY USEFUL!" size={70} color={C.lima} />
        <S t={360.6} p="popcluster" g={-8} />
        <Lbl t={t} t0={363.2} t1={366.1} x={2050} y={1235} txt="JUST ANOTHER MOUTH?" size={44} color={C.rojo} />
        <S t={363.3} p="crunch" g={-8} />
      </G>
      <Flash t={t} t0={324.5} c="rgba(255,255,255,0)" />
    </>
  );
};

// mundo: duelo en la isla y el chico abandonado en "el próximo puerto"
export const M3: React.FC<{ t: number }> = ({ t }) => {
  if (t < 303 || t > 371) return null;
  return (
    <>
      {en(t, 303.5, 308.5) && (
        <>
          <Persona x={ISLA - 330} y={1945} h={250} t={t} seed={163} ropa={PIRATA(2)} expr="enojado" bD={en(t, 306.8, 308.5) ? 95 : 40} cD={0} manoD={<g transform="scale(0.4) rotate(-90)"><Pistola t={t} dispara={307.0} /></g>} manoI={<g transform="scale(0.35) rotate(-100)"><Sable /></g>} />
          <Persona x={ISLA + 330} y={1945} h={250} t={t} seed={164} ropa={PIRATA(3)} flip expr="enojado" bD={en(t, 306.8, 308.5) ? 95 : 40} cD={0} manoD={<g transform="scale(0.4) rotate(-90)"><Pistola t={t} dispara={307.2} /></g>} />
          <G>
            <Lbl t={t} t0={304.8} t1={308.4} x={ISLA} y={1580} txt="ON SHORE" size={80} color={C.oro} />
            <S t={304.2} p="whoosh_big" g={-6} />
            <S t={305.0} p="sword" g={-8} />
            <S t={306.8} p="heart" g={-10} />
            <S t={307.0} p="gun" g={-6} />
            <S t={307.2} p="gun" g={-6} />
          </G>
        </>
      )}
      {en(t, 366, 371) && (
        <>
          <Persona x={ISLA - 150} y={1945} h={180} t={t} seed={7} ropa={GRUMETE} expr="triste" bD={60} cD={80} manoD={<g transform="translate(0 30) scale(0.35)"><circle r={60} fill="#c9a06a" /></g>} />
          <G><Lbl t={t} t0={368.0} t1={369.7} x={ISLA - 150} y={1660} txt="NEXT PORT" size={80} color={C.crema} /><S t={366.3} p="whoosh_big" g={-6} /><S t={366.9} p="birds" g={-12} d={3} /><S t={367.2} p="sad" g={-10} /></G>
        </>
      )}
    </>
  );
};

export const O3: React.FC<{ t: number }> = ({ t }) => {
  if (t < 264 || t > 371) return null;
  return (
    <>
      <CartelTrampa t={t} t0={264.64} n={3} nombre="THE ARTICLES" t1={266.7} />
      <S t={264.64} p="whoosh_big" g={-4} />
      <S t={264.85} p="wood_hit" g={-4} />
      <Txt t={t} t0={266.9} t1={270.0} text="PIRATES GOT STRANGE" y={170} size={110} color={C.lila} />
      <Txt t={t} t0={270.3} t1={274.8} text="WRITTEN RULES" y={170} size={120} color={C.oro} />
      <Lista t={t} x={60} y={230} size={40} w={560} titulo="ROBERTS' ARTICLES" t1={304.0}
        items={[{ txt: "EVERY MAN A VOTE", t0: 291.2, ok: true }, { txt: "LIGHTS OUT AT 8", t0: 293.7, ok: true }, { txt: "DRINK ON DECK", t0: 296.2, ok: true }, { txt: "NO CARDS, NO DICE", t0: 299.8 }, { txt: "NO FIGHTING ON BOARD", t0: 302.3 }]} />
      {[291.2, 293.7, 296.2, 299.8, 302.3].map((a, i) => <S key={i} t={a} p="write" g={-14} />)}
      <Txt t={t} t0={306.9} t1={307.8} text="WITH SWORDS AND PISTOLS" y={900} size={84} color={C.rojo} />
      <Txt t={t} t0={308.0} t1={310.2} text="THE PRIZE: A FIXED SCALE" y={170} size={100} color={C.oro} />
      <Txt t={t} t0={330.9} t1={333.1} text="THE MOST FEARED" y={170} size={120} color={C.rojo} />
      <Txt t={t} t0={320.6} t1={322.2} text="ALMOST FAIR?" y={170} size={120} />
      {/* artículo VI */}
      {en(t, 333.2, 344.4) && (
        <div style={{ position: "absolute", left: 960, top: 70, transform: `translate(-50%,0) scale(${prog(t, 333.2, 333.6) * 0.88}) rotate(-2deg)`, transformOrigin: "50% 0", width: 1100, background: "#f4ead2", border: `10px solid #8a5a2a`, borderRadius: 18, padding: "30px 50px", boxShadow: "0 18px 0 rgba(20,10,40,.4)", fontFamily: "Fredoka, sans-serif", fontWeight: 700, color: TINTA, textAlign: "center" }}>
          <div style={{ fontSize: 80, color: C.rojo, letterSpacing: 6 }}>ARTICLE VI</div>
          <div style={{ fontSize: 58, lineHeight: 1.2, marginTop: 10, fontStyle: "italic" }}>
            {"“No boy or woman to be allowed amongst them.”".split(" ").map((w, i) => <span key={i} style={{ opacity: t > 334.6 + i * 0.36 ? 1 : 0.12 }}>{w} </span>)}
          </div>
          <div style={{ fontSize: 30, color: "#8a5a2a", marginTop: 12 }}>— A General History of the Pirates, 1724</div>
        </div>
      )}
      <S t={333.2} p="unroll" g={-6} />
      <S t={334.6} p="write" g={-12} d={4.2} />
      {en(t, 342.3, 344.4) && <div style={{ position: "absolute", left: 1500, top: 780 }}><svg width={1} height={1} style={{ overflow: "visible" }}><Sello t={t} t0={342.4} txt="NOT YOU" size={90} /></svg></div>}
      <S t={342.4} p="stamp" g={-3} />
      <Txt t={t} t0={344.6} t1={346.8} text="WHY BAN BOYS?" y={170} size={130} />
      <Txt t={t} t0={366.4} t1={367.9} text="A VERY SIMPLE SOLUTION" y={170} size={100} />
    </>
  );
};
export const _3 = { MAR, interpolate, Globo, Sable };
