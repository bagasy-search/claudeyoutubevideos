import React from "react";
import { interpolate } from "remotion";
import { C, ent, prog, Chip, Particulas, Emote } from "./kit";
import type { Parte } from "./parte";
import { Bote, Cachalote, Splash, Farol, Pajitas, Svg, Barril, Ballenero, Moneda0 } from "./kit3";
import { Articulos, Torta } from "./kit3";
import { Boya, Colectivo, MapaMA, Saldo, Cuenta, Titulo } from "./hud";
import { Chico } from "./reparto";
import { X_DOCK, X_FARO } from "./estado";

// 0-64,5 s · EL GANCHO. Arranca pegado a la cara del chico en el muelle de Nantucket; la cámara se abre y
// aparece el barco gigante. Contrato con la X, la torta de 175 porciones, 4 años en 2 segundos (días y noches),
// el bote contra el cachalote del tamaño de un colectivo, buceo hasta casa (deuda), el faro y las farolas,
// el mapa del viaje con las 7 boyas sobre el mar y el buceo hasta la 7 (el sorteo del Essex).
const CX = -2300; // el chico en el muelle
const WX = 9000; // donde está el cachalote del avance
const BOYAS = Array.from({ length: 7 }, (_, i) => 1600 + i * 1900);
const FAROLAS = [-3150, -3650, -4150, -4650, -5150, -5650];
const boteX = (t: number) => WX - 600 + (t - 16.7) * 160;

export const P0: Parte = {
  a: 0, b: 64.6,
  keys: [
    { t: 0, x: CX + 10, y: -250, z: 3.3 },
    { t: 1.6, x: CX + 30, y: -250, z: 3.0 },
    { t: 3.3, x: X_DOCK - 300, y: -620, z: 0.52, e: "o" },
    { t: 6.5, x: X_DOCK - 380, y: -560, z: 0.6 },
    { t: 7.6, x: X_DOCK - 100, y: -1250, z: 0.62 },
    { t: 14.3, x: X_DOCK, y: -1300, z: 0.7 },
    { t: 16.6, x: WX - 200, y: -260, z: 0.5, e: "io" },
    { t: 21.2, x: WX + 300, y: -200, z: 0.66 },
    { t: 23.6, x: WX + 400, y: -160, z: 0.6 },
    { t: 24.6, x: WX + 300, y: 900, z: 0.62, e: "i" },
    { t: 26.0, x: CX + 400, y: 900, z: 0.62 },
    { t: 27.0, x: CX + 200, y: -380, z: 0.72, e: "o" },
    { t: 29.6, x: CX + 120, y: -400, z: 0.78 },
    { t: 30.9, x: X_FARO, y: -560, z: 0.75 },
    { t: 33.0, x: X_FARO - 500, y: -480, z: 0.62 },
    { t: 38.6, x: -5000, y: -420, z: 0.5, e: "lin" },
    { t: 42.4, x: -4700, y: -520, z: 0.62 },
    { t: 43.4, x: CX + 40, y: -250, z: 1.35, e: "o" },
    { t: 45.8, x: CX + 160, y: -290, z: 1.15 },
    { t: 47.6, x: 300, y: -700, z: 0.3, e: "io" },
    { t: 54.0, x: BOYAS[6] - 700, y: -600, z: 0.3, e: "lin" },
    { t: 55.6, x: BOYAS[6] - 2500, y: -500, z: 0.2 },
    { t: 57.6, x: BOYAS[6], y: 760, z: 0.66, e: "io" },
    { t: 62.9, x: BOYAS[6] + 80, y: 820, z: 0.78 },
    { t: 63.7, x: BOYAS[6], y: -500, z: 0.4, e: "i" },
    { t: 64.9, x: CX + 300, y: -450, z: 0.7, e: "o" },
  ],
  pal: [
    [0, "manana"], [14.6, "noche", 0.2], [15.0, "dia", 0.2], [15.4, "noche", 0.2], [15.8, "dia", 0.2], [16.4, "tormenta", 0.4],
    [24.6, "abismo", 0.9], [27.0, "noche", 1.0], [40.8, "manana", 1.6], [47.0, "dia", 1.5], [57.2, "abismo", 1.2], [64.2, "manana", 0.8],
  ],
  fondo: (t) => (
    <>
      {/* el cachalote del avance asoma desde abajo */}
      {t > 16 && t < 25 && <Cachalote x={WX + 900 - (t - 16) * 30} y={interpolate(t, [17.2, 19.0], [700, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} t={t} s={0.95} flip chorro={t > 19 && t < 21 ? 1 : 0} />}
      {/* boya 7: el Essex hundido en el fondo */}
      {t > 55 && t < 64.5 && <Svg x={BOYAS[6] + 150} y={1250} s={0.55} rot={-18} op={0.7}><g opacity={0.8}><path d="M -820 -250 Q -800 -200 -790 -150 L -760 90 Q -600 150 0 150 Q 560 150 700 70 L 860 -230 Q 700 -205 0 -195 Q -500 -200 -820 -250 Z" fill="#3a4e80" /><rect x={-14} y={-900} width={28} height={700} fill="#3a4e80" /><rect x={406} y={-760} width={28} height={560} fill="#3a4e80" transform="rotate(20 420 -200)" /></g></Svg>}
    </>
  ),
  mundo: (t) => (
    <>
      {/* el chico en el muelle (gancho, "not you though", "let's get you aboard") */}
      {(t < 14.6 || (t > 26 && t < 30.5) || (t > 42 && t < 47.8) || t > 63.6) && (
        <Chico x={CX} y={-60} t={t} gorro={false} expr={t < 1.6 ? "orgullo" : t < 6.6 ? "feliz" : t < 14.4 ? "sorpresa" : t < 30.5 ? "triste" : t < 44.1 ? "triste" : "feliz"} habla={false} mira={t > 1.7 && t < 3.6 ? 1 : 0} miraY={t > 6.6 && t < 14.4 ? -1 : 0} flip={t > 44.2 && t < 47.8 ? false : undefined} camina={t > 44.3 && t < 47.8 ? 1.2 : 0} bD={t > 42.8 && t < 44.2 ? 40 : 8} bI={t > 42.8 && t < 44.2 ? 40 : 8} />
      )}
      {/* moneda que se le escapa y cae al agua */}
      {t > 43.0 && t < 45.6 && <Svg x={CX + 60 + (t - 43) * 260} y={-90 + Math.max(0, t - 44.0) ** 2 * 700 - Math.abs(Math.sin((t - 43) * 9)) * 30 * Math.max(0, 1 - (t - 43))} s={0.8} rot={(t - 43) * 400}><Moneda0 /></Svg>}
      {t > 44.4 && <Splash x={CX + 340} y={4} t={t} t0={44.45} s={0.5} />}
      {/* farolas del pueblo que se encienden con aceite de ballena */}
      {t > 29 && t < 44 && FAROLAS.map((fx, i) => (
        <React.Fragment key={fx}>
          <div style={{ position: "absolute", left: fx - 8, top: -330, width: 16, height: 260, background: "#2a2228" }} />
          {t > 34.6 + i * 0.32 ? <Farol x={fx} y={-330} t={t} s={1.1} /> : <Svg x={fx} y={-330} s={1.1}><rect x={-26} y={-40} width={52} height={70} rx={8} fill="#3a3a48" stroke="#1a1a20" strokeWidth={6} /></Svg>}
        </React.Fragment>
      ))}
      {/* lluvia de monedas sobre las casas ricas */}
      {t > 41.6 && t < 43.2 && Array.from({ length: 26 }, (_, i) => <Svg key={i} x={-5600 + (i * 233) % 1500} y={-1100 + ((t - 41.6) * 900 + i * 97) % 1100} s={0.6} rot={t * 300 + i * 40}><Moneda0 /></Svg>)}
      {/* bote del avance y su remada */}
      {t > 16 && t < 24.6 && <Bote x={boteX(t)} y={12} t={t} s={1.05} arponero={t > 19.6 ? 0.4 : 0} roto={t > 22.35 ? 1 : 0} />}
      {t > 22.2 && t < 24.6 && <Splash x={boteX(t) + 150} y={0} t={t} t0={22.3} s={1.4} />}
      {/* la cola del cachalote baja como un martillo */}
      {t > 21.3 && t < 23.4 && <Svg x={boteX(21.3) + 420} y={interpolate(t, [21.3, 21.9, 22.3, 23.4], [400, -420, 0, 300], { extrapolateRight: "clamp" })} s={1.2} rot={interpolate(t, [21.3, 22.3], [-30, 10], { extrapolateRight: "clamp" })}><path d="M 0 0 Q -40 -110 -150 -170 Q -110 -60 -160 -10 Q -80 -10 0 0 Z M 0 0 Q 40 -110 150 -170 Q 110 -60 160 -10 Q 80 -10 0 0 Z" fill="#33425f" /><rect x={-30} y={0} width={60} height={300} fill="#3a4a6a" /></Svg>}
      {/* el colectivo de escala (anacronismo a propósito) */}
      {t > 19.3 && t < 21.4 && <Colectivo x={WX + 760} y={interpolate(t, [19.3, 19.7], [-1600, -320], { extrapolateRight: "clamp" })} s={0.85} rot={Math.sin((t - 19.3) * 12) * 3 * Math.max(0, 1 - (t - 19.7))} />}
      {/* las 7 boyas del viaje */}
      {t > 46 && t < 64.4 && BOYAS.map((bx2, i) => <Boya key={i} x={bx2} t={t} t0={47.7 + i * 0.85} n={i + 1} pulsa={54.2} />)}
      {/* barriles de aceite que caen al muelle (whale oil) */}
      {t > 37.9 && t < 44 && [0, 1, 2].map((i) => <Barril key={i} x={-4300 + i * 120} y={interpolate(t, [37.9 + i * 0.12, 38.4 + i * 0.12], [-900, -100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} s={1.6} />)}
    </>
  ),
  hud: (t) => (
    <>
      {/* 0-1,6: "You are 17" */}
      <Cuenta t={t} t0={0.12} t1={0.9} de={0} a={17} x={1480} y={420} size={330} color={C.oro} t2={1.7} />
      <Chip t={t} t0={0.4} t1={1.65} text="YOU" color={C.rojo} x={420} y={300} centro size={90} />
      <Chip t={t} t0={2.4} t1={4.0} text="A WHALING SHIP" color={C.violeta} x={960} y={150} centro size={74} />
      {/* 4,2-6,6: el contrato y la X */}
      {t < 6.9 && <Articulos t={t} t0={4.2} x={960} y={560} s={interpolate(t, [6.4, 6.9], [0.95, 0.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} tx={5.2} />}
      <Chip t={t} t0={4.35} t1={5.15} text="NOT YOUR NAME" color={C.rojo} x={1560} y={260} centro size={56} />
      <Chip t={t} t0={5.3} t1={6.5} text="AN X." color={C.teal} tinta={C.noche} x={1560} y={260} centro size={84} />
      {/* 6,7-14,4: la torta de las ganancias */}
      {t > 6.7 && t < 10.15 && <Torta t={t} t0={6.8} x={960} y={500} r={300} n={1} label="THE PROFITS" col={C.oro} />}
      {t >= 10.15 && t < 11.4 && <Torta t={t} t0={10.15} x={960} y={500} r={300} n={10} saca={10.5} label="1/10? NO." />}
      {t >= 11.4 && t < 12.6 && <Torta t={t} t0={11.4} x={960} y={500} r={300} n={100} saca={11.7} label="1/100? NO." />}
      {t >= 12.6 && t < 14.5 && <Torta t={t} t0={12.6} x={960} y={500} r={300} n={175} saca={13.2} label="1/175" col={C.lima} />}
      <Chip t={t} t0={7.6} t1={10} text="ONE SHARE" color={C.rojo} x={960} y={110} centro size={70} />
      <Chip t={t} t0={13.6} t1={14.45} text="YOURS →" color={C.rojo} x={1500} y={330} centro size={60} />
      {/* 14,4-16,7: cuatro años en dos segundos */}
      <Cuenta t={t} t0={14.5} t1={16.3} de={1841} a={1845} x={960} y={420} size={260} color="#fff" t2={16.75} sep={false} />
      <Chip t={t} t0={14.7} t1={16.7} text="4 YEARS AWAY" color={C.violeta} x={960} y={640} centro size={70} />
      {/* 16,7-23,7: el bote contra el cachalote */}
      <Chip t={t} t0={17.0} t1={19.2} text="A WOODEN BOAT" color={C.tierra} x={420} y={200} centro size={60} />
      <Chip t={t} t0={19.7} t1={21.3} text="SIZE OF A BUS" color={C.ambar} tinta={C.noche} x={1460} y={170} centro size={66} />
      <Titulo t={t} t0={22.4} t1={23.7} text="FIREWOOD" y={300} size={190} color={C.naranja} />
      {/* 23,7-29,8: si volvés, debés plata */}
      <Chip t={t} t0={24.0} t1={25.6} text="IF YOU COME HOME" color={C.teal} tinta={C.noche} x={960} y={540} centro size={74} />
      <Saldo t={t} t0={26.7} t1={29.8} x={1420} y={520} filas={[{ txt: "YOUR SHARE", monto: "+$200", t0: 27.0 }, { txt: "GEAR + INTEREST", monto: "-$84", t0: 27.4 }, { txt: "ADVANCE", monto: "-$75", t0: 27.7 }, { txt: "SLOP CHEST", monto: "-$50", t0: 28.0 }]} total="-$9" tTotal={28.5} />
      {/* 29,8-42,8: el trabajo que iluminó el mundo */}
      <Titulo t={t} t0={30.0} t1={31.8} text="THE JOB THAT LIT THE WORLD" y={180} size={96} color={C.oro} />
      <Chip t={t} t0={32.1} t1={33.2} text="NO ELECTRICITY" color={C.violeta} x={960} y={160} centro size={64} />
      <Chip t={t} t0={33.3} t1={34.5} text="NO KEROSENE" color={C.rojo} x={960} y={160} centro size={64} />
      <Chip t={t} t0={34.6} t1={36.3} text="LONDON STREETLAMPS" color={C.ambar} tinta={C.noche} x={960} y={160} centro size={64} />
      <Chip t={t} t0={36.4} t1={37.9} text="AMERICAN LIGHTHOUSES" color={C.teal} tinta={C.noche} x={960} y={160} centro size={64} />
      <Titulo t={t} t0={38.0} t1={39.4} text="WHALE OIL" y={200} size={150} color={C.oro} />
      <MapaMA t={t} t0={39.3} t1={42.4} x={1440} y={560} />
      <Chip t={t} t0={41.8} t1={42.8} text="RICH" color={C.lima} tinta={C.noche} x={480} y={200} centro size={90} />
      {/* 42,8-45,9: tú no */}
      <Titulo t={t} t0={42.9} t1={44.1} text="NOT YOU." y={170} size={150} color={C.crema} />
      <Chip t={t} t0={44.3} t1={45.8} text="SIGNING ON" color={C.teal} tinta={C.noche} x={960} y={150} centro size={70} />
      {/* 45,9-55,8: el mapa del viaje */}
      <Chip t={t} t0={46.2} t1={49.3} text="FROM THE DOCK…" color={C.violeta} x={960} y={130} centro size={66} />
      <Chip t={t} t0={49.4} t1={52.0} text="…TO THE FAR SIDE OF THE PACIFIC" color={C.violeta} x={960} y={130} centro size={66} />
      <Chip t={t} t0={52.1} t1={54.1} text="EVERY WAY IT TRIES TO KILL YOU" color={C.rojo} x={960} y={130} centro size={66} />
      <Titulo t={t} t0={54.3} t1={55.9} text="7 TRAPS" y={190} size={200} color={C.crema} />
      {/* 55,8-63,2: el sorteo */}
      <Chip t={t} t0={56.6} t1={59.0} text="THE MOST FAMOUS WHALING CREW" color={C.violeta} x={960} y={140} centro size={62} />
      {t > 58.6 && t < 63.3 && <Pajitas x={960} y={720} s={1.6 * ent(t, 58.6)} saca={prog(t, 60.4, 61.0)} />}
      <Chip t={t} t0={59.1} t1={61.6} text="THEY DREW LOTS" color={C.ambar} tinta={C.noche} x={960} y={140} centro size={70} />
      <Titulo t={t} t0={61.7} t1={63.2} text="WHO GETS EATEN" y={200} size={120} color={C.rojo} />
      <Chip t={t} t0={63.3} t1={64.4} text="LET'S GET YOU ABOARD" color={C.teal} tinta={C.noche} x={960} y={540} centro size={80} />
      {t > 14.3 && t < 16.7 && <Particulas t={t} tipo="destellos" n={30} seed={9} />}
      {t > 22.4 && t < 23.2 && <Emote t={t} t0={22.4} tipo="susto" x={960} y={540} s={2} />}
    </>
  ),
};
export { Ballenero };
