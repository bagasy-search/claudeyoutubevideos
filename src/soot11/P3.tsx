import React from "react";
import { clamp } from "../soot/lib";
import { C, Chip, Emote, fontFamily } from "./kit";
import { Persona, CIVIL, Ropa } from "./persona";
import { SUELO, Llave, G, interp, TextoMundo, Taburete, Jarra, Hogaza, Fachwerk, Cucharon, Saco, Bolsa, Moneda, Banco } from "./mundo";
import { PT } from "./pueblo";
import { Franz, Gente, CartelTrampa, Sello, Titulo, Globo, BurbujaM, Pin, vig } from "./actores";

// P3 · Trampa 3 "Your seat" (270,3-375,3 s). La iglesia (banco junto a la puerta, comulgás último, rezás de lejos)
// → la taberna (mesa propia, taburete de 3 patas, la jarra encadenada) → SALTO POR EL CIELO a París: el pan al revés y
// la superstición → el "havage": el verdugo de París cobrando con un cucharón de hierro → el rey lo abolió en 1775.
const PARIS_V: Ropa = { tunica: "#1d1430", tunica2: "#0f0a1c", cinto: "#a3202f", piel: "#f0b88e", piel2: "#d3966c", pelo: "#2a1a10" };
const PAN = 30690, CASA_P = 30290;
const SACOS = [30950, 31080, 31330, 31650, 31780, 31950, 32100];

export const P3K: Llave[] = [
  [270.9, 1380, 610, 1.3, 0.6],
  [272.75, 2050, 400, 0.42, 0.9],
  [277.5, 1420, 600, 1.35, 0.8],
  [279.8, 1580, 640, 2.2, 0.6],
  [282.75, 900, 600, 0.95, 0.8],
  [286.8, 1350, 620, 1.25, 0.6],
  [289.3, 700, 620, 1.3, 2.0],
  [290.6, 1000, 560, 0.72, 0.9],
  [294.25, 3330, 600, 1.0, 0.9, 0.2],
  [296.95, 3550, 620, 1.3, 0.6],
  [300.15, 3800, 720, 2.0, 0.6],
  [301.5, 3800, 700, 2.8, 0.5],
  [303.0, 3560, 620, 1.15, 0.6],
  [304.45, 3800, 580, 2.2, 0.6],
  [308.3, 3800, 520, 3.6, 0.6],
  [312.2, 3780, 590, 2.4, 0.6],
  [315.0, 3400, 250, 0.95, 0.9],
  [316.6, PAN, 250, 0.95, 1.0],
  [317.95, PAN, 600, 1.3, 0.9],
  [320.2, PAN, 560, 2.3, 0.6],
  [324.7, CASA_P, 660, 1.6, 0.8],
  [327.9, CASA_P, 700, 2.0, 0.6],
  [331.5, CASA_P, 650, 1.6, 1.0],
  [334.9, 31350, 600, 1.0, 0.9],
  [338.5, 31100, 600, 1.45, 0.6],
  [341.2, 31130, 620, 1.9, 0.6],
  [346.3, 31330, 620, 1.35, 0.6],
  [350.8, 31380, 600, 2.3, 0.5],
  [352.9, 31500, 600, 1.0, 0.8],
  [359.0, 32050, 600, 1.15, 5.0],
  [360.3, 31700, 600, 1.0, 0.8],
  [364.0, 31700, 620, 1.5, 0.8],
  [367.9, 31600, 520, 0.85, 1.0],
  [372.75, 31600, 250, 0.95, 0.9],
  [374.4, 10300, 250, 0.95, 1.2],
];
export const P3H: [number, number][] = [[270.3, 0], [271.5, 0.3], [318.5, 0.3], [320.5, 0], [375.3, 0]];

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>{children}</svg>;
const Corona: React.FC<{ x: number; y: number }> = ({ x, y }) => <G x={x} y={y}><path d="M -60 0 L -70 -70 L -35 -35 L 0 -85 L 35 -35 L 70 -70 L 60 0 Z" fill={C.oro} stroke="#8a5414" strokeWidth={6} /><circle cx={0} cy={-20} r={10} fill={C.rojo} /></G>;

export const P3Mundo: React.FC<{ t: number }> = ({ t }) => {
  // ── iglesia
  const iglesia = t < 294.5;
  const filaVa = t > 286.75; // los fieles ya comulgaron y vuelven
  const fx = t < 286.75 ? PT.bancoVerdugo : t < 289.9 ? interp(t, [286.75, 289.4], [PT.bancoVerdugo, 560]) : PT.bancoVerdugo;
  // ── París: el verdugo con su cucharón
  const vx = t < 341 ? interp(t, [335, 340.5], [30700, 31000]) : t < 352.9 ? interp(t, [341, 346.0], [31000, 31260]) : interp(t, [352.9, 360.2], [31260, 32180]);
  const cuchara = t > 350.75;
  const recoge = vig(t, 341.5, 346) || (cuchara && Math.sin((t - 352.9) * 2.2) > 0.4 && t < 360.2);
  return (
    <>
      {iglesia && (
        <>
          <Persona x={PT.altar + 175} y={SUELO - 40} h={300} t={t} seed={40} ropa={{ ...CIVIL(0), tunica: "#f2ead8", tunica2: "#c9bca4" }} gorro="cura" flip habla={vig(t, 283, 286.5)} bD={vig(t, 283, 286.7) ? 70 : 10} expr={vig(t, 288.6, 290) ? "miedo" : "neutro"} />
          {[620, 840, 1060, 1280].map((bx, b) => (
            <React.Fragment key={bx}>
              {!vig(t, 282.7, 287.5) && <Gente t={t} x0={bx - 95} x1={bx + 95} n={3} y={SUELO - 70} h={250} seed={60 + b} flipDe={-9} expr={vig(t, 287.5, 290) ? "sorpresa" : "neutro"} mira={vig(t, 286.8, 290) ? 1 : -1} />}
              <Banco x={bx} y={SUELO} w={200} />
            </React.Fragment>
          ))}
          {/* la fila de la comunión: todos primero */}
          {vig(t, 282.7, 287.6) && Array.from({ length: 8 }, (_, i) => {
            const avanza = interp(t, [283, 286.4], [0, 1]);
            const xx = 560 + i * 105 - avanza * 60 + (filaVa ? (t - 286.75) * 900 : 0);
            return (
              <React.Fragment key={i}>
                <Persona x={xx} y={SUELO - 10} h={260} t={t} seed={500 + i} ropa={CIVIL(i + 3)} gorro={i % 3 === 1 ? "toca" : undefined} flip={!filaVa} camina={filaVa ? 1.6 : 0} />
                {t < 286.7 && <TextoMundo x={xx} y={SUELO - 300} text={`#${i + 1}`} size={34} color="#fff3d6" borde="#2b1c14" />}
              </React.Fragment>
            );
          })}
          {/* Franz: banco junto a la puerta (corriente de aire), camina último, reza de lejos */}
          <Franz x={fx} y={t < 286.75 || t > 289.9 ? SUELO - 72 : SUELO - 10} t={t} flip={t < 289.9} camina={vig(t, 286.75, 289.4) ? 1.4 : 0}
            expr={vig(t, 290, 294.5) ? "feliz" : "triste"} bD={vig(t, 290, 294.5) ? 120 : 8} bI={vig(t, 290, 294.5) ? 120 : 8} cD={vig(t, 290, 294.5) ? 100 : 6} cI={vig(t, 290, 294.5) ? 100 : 6} mira={-1} />
          {vig(t, 286.75, 289.9) && <TextoMundo x={fx} y={SUELO - 340} text="#LAST" size={38} color={C.rojo} borde="#fff" />}
          {vig(t, 279.5, 282.7) && <Svg>{[0, 1, 2].map((i) => <path key={i} d={`M ${1700 - ((t * 300 + i * 120) % 360)} ${SUELO - 260 + i * 50} q 40 -20 80 0 t 80 0`} stroke="#bfe6ff" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.9} />)}</Svg>}
          {vig(t, 279.6, 282.7) && <Emote t={t} t0={279.7} tipo="susto" x={PT.bancoVerdugo} y={SUELO - 400} s={0.5} />}
          {/* el rezo viaja de lejos: una burbujita que tarda en llegar al altar */}
          {vig(t, 291.4, 294.4) && (() => {
            const u = clamp((t - 291.4) / 2.6, 0, 1);
            return <G x={PT.bancoVerdugo - u * (PT.bancoVerdugo - PT.altar)} y={SUELO - 420 - Math.sin(u * Math.PI) * 140} s={0.9}><circle r={40} fill="#fff" stroke="#2b2140" strokeWidth={6} /><text y={18} textAnchor="middle" fontSize={50} fontFamily={fontFamily} fontWeight={700} fill={C.violeta}>♥</text></G>;
          })()}
          {vig(t, 290.6, 294.4) && <Svg><line x1={PT.altar + 140} y1={SUELO + 40} x2={PT.bancoVerdugo - 60} y2={SUELO + 40} stroke="#fff" strokeWidth={10} strokeDasharray="30 18" /><path d={`M ${PT.altar + 140} ${SUELO + 10} v 60 M ${PT.bancoVerdugo - 60} ${SUELO + 10} v 60`} stroke="#fff" strokeWidth={10} /></Svg>}
        </>
      )}
      {/* ── taberna: los demás charlan; vos, en tu rincón */}
      {vig(t, 293.5, 316) && (
        <>
          <Gente t={t} x0={3050} x1={3310} n={3} seed={71} habla={t < 303 || t > 305.6} flipDe={3180} expr={vig(t, 305.7, 308.2) ? "miedo" : "feliz"} />
          <Gente t={t} x0={3510} x1={3600} n={1} seed={73} habla flipDe={-1} expr="feliz" />
          <G x={3910} y={SUELO}><rect x={-60} y={-110} width={120} height={18} rx={6} fill="#8a5a2a" /><rect x={-10} y={-92} width={20} height={92} fill="#5a3418" /></G>
          <Taburete x={PT.taburete} y={SUELO} brillo={vig(t, 300, 303)} />
          {t > 297 && <Franz x={PT.taburete + 10} y={SUELO - 70} t={t} flip expr={vig(t, 304.4, 314.2) ? "neutro" : "triste"} mira={vig(t, 304.4, 309) ? 1 : -1}
            bD={vig(t, 304.4, 305.7) || t > 312.2 ? 120 : 10} cD={vig(t, 304.4, 305.7) || t > 312.2 ? 60 : 6} />}
          {/* números en las patas del taburete */}
          {vig(t, 301.5, 303.0) && [[-80, 1], [0, 2], [80, 3]].map(([dx, n]) => t > 301.5 + n * 0.3 ? <TextoMundo key={n} x={PT.taburete + dx} y={SUELO + 50} text={`${n}`} size={50} color={C.ambar} borde="#2b1c14" /> : null)}
          {vig(t, 303.0, 304.4) && <Svg><line x1={3640 + 150} y1={SUELO - 160} x2={PT.taburete - 90} y2={SUELO - 160} stroke={C.rojo} strokeWidth={8} strokeDasharray="18 12" /></Svg>}
          {/* uno estira la mano a TU jarra y la suelta como si quemara */}
          {vig(t, 305.7, 308.2) && <Persona x={interp(t, [305.7, 306.6, 307.0, 308.2], [3480, 3700, 3700, 3480])} y={SUELO - 10} h={280} t={t} seed={77} ropa={CIVIL(15)} gorro="campesino" camina={t < 306.6 || t > 307.0 ? 1.8 : 0}
            bD={vig(t, 306.4, 307.0) ? 140 : 10} expr={t > 306.8 ? "miedo" : "feliz"} salta={306.8} />}
          {vig(t, 306.8, 308.2) && <Emote t={t} t0={306.8} tipo="excl" x={3700} y={SUELO - 330} s={0.6} />}
          {t > 312.1 && <G x={PT.taburete + 190} y={SUELO - 190} rot={Math.sin(t * 3) * 6}><line x1={0} y1={-20} x2={0} y2={20} stroke="#5a3418" strokeWidth={4} /><rect x={-70} y={20} width={140} height={40} rx={8} fill="#fff6e0" stroke={C.rojo} strokeWidth={4} /><text x={0} y={50} textAnchor="middle" fontSize={24} fontFamily={fontFamily} fontWeight={700} fill={C.rojo}>RESERVED</text></G>}
        </>
      )}
      {/* ── París: la panadería con la hogaza al revés y la casa de la superstición */}
      {t > 315 && t < 336 && (
        <>
          <Fachwerk x={PAN - 190} w={380} h={540} abierta fondo="#f2d3a0" muro="#efe4d0" viga="#c9bca4" techo="#5a6a8a" pisos={1} cartel="PAIN" />
          <G x={PAN} y={SUELO - 290}><rect x={-160} y={0} width={320} height={16} fill="#7d4a24" /></G>
          <G x={PAN} y={SUELO - 400}><rect x={-160} y={0} width={320} height={16} fill="#7d4a24" /></G>
          {[PAN - 100, PAN, PAN + 100].map((x) => <Hogaza key={x} x={x} y={SUELO - 400} s={0.5} />)}
          {[PAN - 100, PAN + 100].map((x) => <Hogaza key={x} x={x} y={SUELO - 290} s={0.5} />)}
          <G x={PAN} y={SUELO - 290 - 38}><g transform={`rotate(${t > 320.3 ? 180 : interp(t, [319.6, 320.3], [0, 180])})`}><g transform="translate(0 38)"><path d="M -40 0 Q -43 -35 0 -38 Q 43 -35 40 0 Z" fill="#c9773a" /><rect x={-41} y={-3} width={82} height={6} rx={3} fill="#a8582a" /></g></g></G>
          {t > 320.5 && <G x={PAN} y={SUELO - 230}><rect x={-80} y={0} width={160} height={36} rx={8} fill="#2b1c14" /><text x={0} y={26} textAnchor="middle" fontSize={22} fontFamily={fontFamily} fontWeight={700} fill={C.ambar}>LE BOURREAU</text></G>}
          <Persona x={PAN - 120} y={SUELO - 10} h={290} t={t} seed={520} ropa={{ ...CIVIL(3), tunica: "#f2ead8", tunica2: "#d9cdb8" }} gorro="panadero" expr={t > 320.3 ? "orgullo" : "feliz"} bD={vig(t, 319.4, 320.6) ? 150 : 10} flip />
          {/* la casa: la hogaza boca abajo en la mesa, ¡mala suerte! */}
          <Fachwerk x={CASA_P - 190} w={380} h={540} abierta fondo="#e9d3b0" muro="#efe4d0" viga="#c9bca4" techo="#5a6a8a" pisos={1} />
          <G x={CASA_P} y={SUELO}><rect x={-130} y={-140} width={260} height={22} rx={6} fill="#a8622c" /><rect x={-110} y={-120} width={16} height={120} fill="#6b3a1f" /><rect x={94} y={-120} width={16} height={120} fill="#6b3a1f" /></G>
          <G x={CASA_P} y={SUELO - 140}><g transform={`rotate(${t > 331.0 ? interp(t, [331.0, 331.5], [180, 360]) : 180})`}><path d="M -50 0 Q -54 -44 0 -48 Q 54 -44 50 0 Z" fill="#c9773a" /></g></G>
          <Persona x={CASA_P - 130} y={SUELO - 10} h={280} t={t} seed={530} ropa={CIVIL(22)} gorro="toca" expr={t > 328 ? "miedo" : "feliz"} bD={vig(t, 330.6, 331.6) ? 70 : 10} />
          <Persona x={CASA_P + 140} y={SUELO - 10} h={250} t={t} seed={531} ropa={CIVIL(23)} flip expr={t > 328 ? "sorpresa" : "feliz"} />
          {vig(t, 328.3, 331.0) && <Emote t={t} t0={328.3} tipo="excl" x={CASA_P - 130} y={SUELO - 340} s={0.6} />}
        </>
      )}
      {/* ── el havage en el mercado de París */}
      {t > 334 && (
        <>
          {/* comerciantes con cara de asco */}
          {[31200, 31800].map((mx, i) => <Persona key={mx} x={mx} y={SUELO - 110} h={270} t={t} seed={540 + i} ropa={CIVIL(30 + i)} gorro={i ? "toca" : "campesino"} expr={Math.abs(vx - mx) < 260 ? "enojado" : "neutro"} flip={vx < mx} />)}
          {[31010, 32030].map((mx, i) => <Persona key={mx} x={mx} y={SUELO - 10} h={260} t={t} seed={550 + i} ropa={CIVIL(33 + i)} gorro={i ? undefined : "noble"} flip={vx < mx} expr={Math.abs(vx - mx) < 220 ? "miedo" : "neutro"} salta={Math.abs(vx - mx) < 220 ? t - 0.01 : undefined} />)}
          {/* el verdugo de París */}
          {t < 360.4 && <Persona x={vx} y={SUELO - 10} h={300} t={t} seed={560} ropa={PARIS_V} gorro="verdugo" capa="#a3202f" barba="#2a1a10" camina={vig(t, 335, 340.5) || vig(t, 341, 346) || (vig(t, 352.9, 360.2) && !recoge) ? 1.4 : 0}
            expr={vig(t, 346.3, 350.7) ? "triste" : "orgullo"} bD={vig(t, 350.75, 352.9) ? 150 : recoge ? 70 : cuchara ? 30 : 8} cD={recoge ? 20 : 10} inclina={recoge ? 16 : 0}
            manoD={cuchara ? <g transform="rotate(180)"><Cucharon x={0} y={-20} s={interp(t, [350.75, 351.2], [0.3, 1.7])} /></g> : undefined}
            manoI={<Saco x={0} y={170} s={interp(t, [341, 360], [0.35, 0.9])} />} />}
          {vig(t, 346.3, 350.7) && <BurbujaM t={t} t0={346.5} t1={350.6} x={31200} y={SUELO - 470} text="NON! NOT YOUR HAND!" size={36} />}
          {vig(t, 341.2, 346.3) && SACOS.slice(0, 3).map((sx, i) => vig(t, 342.2 + i * 1.2, 343.4 + i * 1.2) ? <TextoMundo key={sx} x={sx} y={SUELO - 190} text="-1 HANDFUL" size={46} color={C.rojo} borde="#fff" /> : null)}
          {/* el rey lo abolió y les pagó */}
          {t > 360.2 && (
            <>
              <Persona x={interp(t, [360.3, 361.6], [31200, 31500])} y={SUELO - 10} h={320} t={t} seed={570} ropa={{ tunica: "#2a4ab5", tunica2: "#1a2a6a", cinto: C.oro, piel: "#f2c09a", piel2: "#d99872", pelo: "#e8e0d0" }} camina={t < 361.6 ? 1.3 : 0} expr="orgullo" bD={t > 364 ? 80 : 10}
                manoD={t > 364 ? <Bolsa x={0} y={30} s={0.7} /> : undefined} />
              <Corona x={interp(t, [360.3, 361.6], [31200, 31500])} y={SUELO - 10 - 320 * 1.02} />
              <Persona x={31820} y={SUELO - 10} h={300} t={t} seed={560} ropa={PARIS_V} gorro="verdugo" capa="#a3202f" barba="#2a1a10" flip expr={t > 364.5 ? "feliz" : "triste"} />
              {t > 364.3 && Array.from({ length: 6 }, (_, i) => { const u = clamp((t - 364.3 - i * 0.18) / 0.6, 0, 1); return u > 0 && u < 1 ? <Moneda key={i} x={31580 + u * 220} y={SUELO - 260 - Math.sin(u * Math.PI) * 160} s={0.5} /> : null; })}
            </>
          )}
        </>
      )}
    </>
  );
};

// inventario: lo que llevás hasta ahora
const Inventario: React.FC<{ t: number }> = ({ t }) => {
  if (t < 367.8 || t > 373.2) return null;
  const items: [string, number][] = [["NO FRIENDS", 368.0], ["A BAD SEAT", 369.3], ["A CURSED LOAF", 370.0], ["...AND A SPOON", 371.7]];
  const sale = clamp((t - 372.8) / 0.4, 0, 1);
  return (
    <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${1 - sale})`, background: "#fbecc8", border: "10px solid #7a3d14", borderRadius: 26, padding: "24px 50px", fontFamily, fontWeight: 700, boxShadow: "0 14px 0 rgba(20,10,50,.35)" }}>
      <div style={{ fontSize: 42, color: "#7a3d14", marginBottom: 8, textAlign: "center" }}>YOUR INVENTORY</div>
      {items.map(([txt, t0]) => <div key={txt} style={{ fontSize: 60, color: txt.includes("SPOON") ? C.violeta : "#5a2a10", opacity: t > t0 ? 1 : 0, transform: `translateX(${t > t0 ? 0 : -40}px)` }}>✓ {txt}</div>)}
    </div>
  );
};

export const P3Pant: React.FC<{ t: number }> = ({ t }) => (
  <>
    <CartelTrampa t={t} t0={270.35} t1={272.6} n={3} titulo="YOUR SEAT" />
    {vig(t, 272.7, 277.5) && (
      <div style={{ position: "absolute", inset: 0 }}>
        {/* tres alfileres sobre el plano del pueblo (cámara fija en 2050,400,0.42) */}
        {[[PT.bancoVerdugo, "CHURCH"], [PT.mostrador, "BAKERY"], [PT.taburete, "TAVERN"]].map(([wx, l], i) => {
          const sx = 960 + ((wx as number) - 2050) * 0.42, sy = 540 + (SUELO - 300 - 400) * 0.42;
          const e = clamp((t - 273.2 - i * 0.35) / 0.3, 0, 1);
          const mal = t > 275.75;
          return (
            <div key={i} style={{ position: "absolute", left: sx, top: sy - 120 - i * 70, transform: `translate(-50%,-100%) scale(${e})`, textAlign: "center", fontFamily, fontWeight: 700 }}>
              <div style={{ background: mal ? C.rojo : C.teal, color: "#fff", padding: "10px 22px", borderRadius: 18, fontSize: 36, whiteSpace: "nowrap" }}>{mal ? "✗ " : "★ "}{l}</div>
              <div style={{ width: 0, height: 0, margin: "0 auto", borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `26px solid ${mal ? C.rojo : C.teal}` }} />
            </div>
          );
        })}
      </div>
    )}
    <Chip t={t} t0={272.8} t1={275.6} text="A SPECIAL SPOT IN EVERY PUBLIC PLACE" color={C.violeta} x={960} y={150} centro size={52} />
    <Chip t={t} t0={275.75} t1={277.4} text="NEVER A GOOD ONE" color={C.rojo} x={960} y={150} centro size={62} />
    <Chip t={t} t0={277.55} t1={280.2} text="YOUR OWN BENCH" color={C.teal} tinta={C.noche} x={960} y={150} centro size={62} />
    <Chip t={t} t0={280.3} t1={282.6} text="VERY BACK · BY THE DRAFTY DOOR" color={C.noche} x={960} y={150} centro size={56} />
    <Chip t={t} t0={282.8} t1={286.6} text="COMMUNION: EVERYONE FIRST" color={C.violeta} x={960} y={150} centro size={56} />
    <Titulo t={t} t0={286.8} t1={289.8} text="YOU GO LAST" y={190} size={130} color={C.rojo} borde="#2b0a14" />
    <Chip t={t} t0={290.1} t1={291.7} text="PRAY? SURE." color={C.teal} tinta={C.noche} x={960} y={150} centro size={62} />
    <Chip t={t} t0={291.8} t1={294.1} text="...PREFERABLY FROM A DISTANCE" color={C.violeta} x={960} y={150} centro size={56} />
    <Chip t={t} t0={294.3} t1={296.8} text="THE TAVERN: EVEN MORE AWKWARD" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={56} />
    <Chip t={t} t0={297.0} t1={300.0} text="YOUR OWN TABLE" color={C.teal} tinta={C.noche} x={960} y={150} centro size={62} />
    <Chip t={t} t0={300.2} t1={301.4} text="...OR YOUR OWN STOOL" color={C.teal} tinta={C.noche} x={960} y={150} centro size={62} />
    <Chip t={t} t0={301.5} t1={302.9} text="WITH 3 LEGS" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={66} />
    <Chip t={t} t0={303.0} t1={304.3} text="SET APART" color={C.rojo} x={960} y={150} centro size={66} />
    <Chip t={t} t0={304.45} t1={305.6} text="YOUR OWN CUP" color={C.violeta} x={960} y={150} centro size={62} />
    <Chip t={t} t0={305.7} t1={308.2} text="NOBODY ELSE EVER DRINKS FROM IT" color={C.rojo} x={960} y={150} centro size={54} />
    <Chip t={t} t0={308.3} t1={312.0} text="KEPT ON A HOOK · OR A CHAIN" color={C.noche} x={960} y={150} centro size={56} />
    <Chip t={t} t0={312.2} t1={314.1} text="RESERVED FOR YOU. ONLY YOU." color={C.violeta} x={960} y={150} centro size={56} />
    <Chip t={t} t0={314.2} t1={315.5} text="AND THEN... THE BREAD" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={60} />
    <Titulo t={t} t0={316.0} t1={317.8} text="FRANCE" y={540} size={170} color={C.crema} />
    <Chip t={t} t0={318.0} t1={320.1} text="AN OLD TRADITION" color={C.violeta} x={960} y={150} centro size={60} />
    <Chip t={t} t0={320.3} t1={324.5} text="THE EXECUTIONER'S LOAF: UPSIDE DOWN" color={C.rojo} x={960} y={150} centro size={54} />
    <Chip t={t} t0={324.7} t1={327.8} text="WHERE THE SUPERSTITION COMES FROM" color={C.violeta} x={960} y={150} centro size={54} />
    <Chip t={t} t0={327.9} t1={331.0} text="NEVER LEAVE BREAD UPSIDE DOWN" color={C.noche} x={960} y={150} centro size={56} />
    <Sello t={t} t0={331.1} t1={334.7} text="BAD LUCK" x={1300} y={340} size={100} />
    <Chip t={t} t0={335.0} t1={338.4} text="THE EXECUTIONER OF PARIS" color={C.rojo} x={960} y={150} centro size={60} />
    <Titulo t={t} t0={338.5} t1={341.1} text="AN EVEN WEIRDER DEAL" y={190} size={100} color={C.ambar} />
    <Chip t={t} t0={341.2} t1={346.2} text="THE HAVAGE: A HANDFUL FROM EVERY SACK · FREE" color={C.violeta} x={960} y={150} centro size={48} />
    <Titulo t={t} t0={350.8} t1={352.8} text="SO: A BIG IRON SPOON" y={190} size={100} color={C.crema} />
    <Chip t={t} t0={353.0} t1={359.2} text="EVERY MARKET DAY · STALL TO STALL" color={C.violeta} x={960} y={150} centro size={56} />
    <Chip t={t} t0={360.3} t1={363.9} text="THE KING ABOLISHED IT" color={C.teal} tinta={C.noche} x={960} y={150} centro size={60} />
    <Sello t={t} t0={362.0} t1={367.7} text="1775" x={1500} y={330} size={110} color={C.violeta} />
    <Chip t={t} t0={364.1} t1={367.7} text="...AND PAID THE FAMILY OFF" color={C.ambar} tinta={C.noche} x={960} y={150} centro size={58} />
    <Inventario t={t} />
    <Chip t={t} t0={372.8} t1={375.2} text="AT LEAST YOU HAVE A NICE HOUSE... RIGHT?" color={C.violeta} x={960} y={150} centro size={52} />
  </>
);
