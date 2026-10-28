// lc01 · planos 1-29 (0 → 173,9 s): cuadro 0 = la miniatura, «vos» despertando, la calle vacía, 8B → 2, Theo, el bus 6,
// Superior Street, el cuaderno CENSUS, la red que sigue prendida, la ventana que titila y June en St. Mary's.
// Vuelta 2 (rehechura): cada plano con personaje actuando + componente que lleva el concepto; la cámara grande
// (empujes) va por transform de pantalla (Empuje) para que el Plano no meta desenfoque de movimiento.
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { enPantalla, mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { Calendario, Contador, Globo, RelojDia, valorEn, F_HUD } from "../../anikit/pantalla";
import { Taza } from "../../anikit/props";
import { Cocina, Silla } from "../../anikit/sets/cocina";
import { Look } from "../../anikit/personaje";
import { AMBAR, BORDE_CALIDO, BORDE_FRIO, JUNE, JUNE_MOCHI, PAL, THEO, THEO_CASA, THEO_MOCHI } from "../elenco";
import { Panorama, PANO_PISO, VENT_HOSP } from "../mundo/panorama";
import { Superior, SUP_AUTOS, SUP_PISO } from "../mundo/superior";
import { Barrio, BARRIO_PISO, Living, LIV_PISO } from "../mundo/casa";
import { Lobby, LOBBY_PISO, StMarys } from "../mundo/hospital";
import { Ore } from "../mundo/ore";
import { fmtN, kDe, Lapiz, Pj, Rotulo } from "./base";
import {
  Bandada, BancoCafe, Cafetera, Caja, CirculoMano, Cortes, CUARTO, CuadernoEscribe, CuartoHosp, DUP, DuplexCorte, Empuje, ESQ, Esquema,
  Giro, manoA, Multitud, pesoIK, RadioVieja, rampa, RelojArena,
  RelojPared, Sabana, SemPeaton, SurtidorGrande, Tarjeta, TheoCama, Tibio, Tienda, TIENDA, tras, Volador,
} from "./lc01_planos1_comp";
import { VentanaSM } from "./v3b_v3";
import { CalleAutos, Casillas, Chip, InteriorAutoV3, luzEn, ManoV3, MapaRioV3, Mezcla, Pilar, SemaforoFundido, Tablilla } from "./v3b_v3";
import { Farola } from "../mundo/comun";
import { AutoExtraV4, CuadernoHoyV4, Eco, ManoInterruptorV4, PilarR, PizarraTexto } from "./v4b_v4";
import { AlientoV4, CuadernoAbreV4, GorroPerchero } from "./v4a_v4";
import { SolDia } from "./v3a_v3";
import { CascoLiniero, Costura, Gorro, HorarioParada, Marquesina, OndasRadio, Radiador, Rafaga, RelojMesa, SemaforoSuave, VentanaEmpuje, VisorCafetera } from "./v3a_v3";

const P = PANO_PISO;
// «vos»: persona gris genérica del gancho
const VOS: Look = { estilo: "palo", camisa: "#8a8f9a", manga: "larga", pantalon: "#3a3f4a", zapatos: "#1a1410" };
const PASEA: Look = { estilo: "palo", camisa: "#5a6a8a", manga: "larga", pantalon: "#2a2e38", zapatos: "#1a1410" };
// ventana del hospital que titila (on/off a mano)
export const titila = (f: number, desde = 0, cada = 16) => (f < desde ? 0 : Math.floor((f - desde) / cada) % 2 === 0 ? 1 : 0.05);
const lerp = (f: number, a: number, b: number, v0: number, v1: number) => v0 + (v1 - v0) * rampa(f, a, b);
// bocanada de vapor de la boca (mundo)
const Aliento: React.FC<{ f: number; x: number; y: number; desde: number; dir?: 1 | -1 }> = ({ f, x, y, desde, dir = 1 }) => {
  if (f < desde || f > desde + 50) return null;
  const t = (f - desde) / 50;
  return <g opacity={0.7 * (1 - t)}>{[0, 1, 2].map((i) => <circle key={i} cx={x + dir * (10 + t * 70 + i * 16)} cy={y - t * 30 - i * 6} r={8 + t * 22 + i * 4} fill="#eef2ff" />)}</g>;
};
// número grande propio (8 mil millones → 2) con rótulo grande
const NumeroGrande: React.FC<{ claves: { f: number; v: number; d?: number }[]; rotulo: string; y: number; hasta: number }> = ({ claves, rotulo, y, hasta }) => {
  const f = useF();
  const { v, pop } = valorEn(claves, f);
  const o = 1 - rampa(f, hasta - 10, hasta);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o }}>
      <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 150 * (1 + 0.1 * pop), color: AMBAR, letterSpacing: 4, textShadow: "0 6px 24px rgba(0,0,0,0.7)", lineHeight: 1 }}>{fmtN(v)}</div>
      <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 64, color: "#f6ecd2", letterSpacing: 10, marginTop: 10, textShadow: "0 4px 14px rgba(0,0,0,0.7)" }}>{rotulo}</div>
    </div>
  );
};
const Marcador: React.FC<{ lineas: [string, string, string][]; x: number; y: number; desde: number; hasta?: number; tam?: number }> = ({ lineas, x, y, desde, hasta = 1e9, tam = 44 }) => {
  const f = useF();
  const o = Math.min(rampa(f, desde, desde + 10), 1 - rampa(f, hasta - 10, hasta));
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: 3, color: "#f6ecd2", background: "rgba(14,12,20,0.8)", padding: "10px 24px", borderRadius: 14, border: `3px solid ${AMBAR}`, lineHeight: 1.25 }}>
      {lineas.map(([e, v, c], i) => <div key={i} style={{ whiteSpace: "nowrap" }}>{e} <span style={{ color: c }}>{v}</span></div>)}
    </div>
  );
};
const Cartel: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; tam?: number; color?: string }> = ({ texto, x, y, desde, hasta = 1e9, tam = 50, color = "#f6ecd2" }) => {
  const f = useF();
  const o = Math.min(rampa(f, desde, desde + 10), 1 - rampa(f, hasta - 10, hasta));
  if (o <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,${(1 - o) * 14}px)`, opacity: o, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: 5, color, whiteSpace: "nowrap", background: "rgba(14,12,20,0.72)", padding: "8px 26px", borderRadius: 14, border: `3px solid ${AMBAR}` }}>{texto}</div>;
};

// ---------- 1 · CUADRO 0 = la miniatura sin texto: Theo y June en la baranda del mirador, la ciudad y la ventana ----------
// v3: arranca en el encuadre de la miniatura y empuja (curva out, sin frenar) hasta los dos a ~45 % del alto;
// June gira la cabeza hacia Theo, Theo exhala vapor y apoya la mano en la baranda.
export const P01Mini: React.FC = () => {
  const f = useF();
  const T = 1290, J = 1440;
  return (
    <Escena Set={Panorama} pal={PAL} claves={[mira(0, 1640, 620, 1.2), mira(32, 1380, 668, 1.95, { curva: "inout" })]} seed={1}
      setProps={{ hora: "ocaso", luces: 0, ventana: 1, nieve: 1, vapor: 0.6, puenteLuz: 0.3 }}
      medio={<>
        <Pj look={THEO_MOCHI} ruta={[{ f: 0, x: T, y: P - 6 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: 22, v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: -0.15 } }, { f: 22, v: { x: 1, y: 0.1 } }]} luz={BORDE_CALIDO}
          ajuste={manoA({ look: THEO_MOCHI, x: T, y: P - 6, lado: "D", obj: () => ({ x: T + 70, y: P - 128 }), peso: () => 1 })} />
        <Pj look={JUNE_MOCHI} ruta={[{ f: 0, x: J, y: P - 6 }]} dir={[{ f: 0, v: 1 }, { f: 12, v: -1 }]} caras={[{ f: 0, v: "miedo" }, { f: 14, v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: -0.1 } }, { f: 10, v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} seed={2}
          poses={[{ f: 0, v: "parado" }, { f: 12, v: "brazosCruzados" }]} />
        <AlientoV4 f={f} x={T + 30} y={P - 262} desde={4} />
      </>} />
  );
};

// ---------- 2 · «vos» te despertás: de la taza a la cara (bostezo) → corte: la cafetera borbotea, primer sorbo, el timer ----------
// v3: corte limpio desde P01 bajo el destello (Costura); toma A = inserto taza → cara; toma B = plano medio con sorbo
// real (la taza va a la boca con IK y se dibuja derecha en la mano) y el visor AUTO 6:00 de la cafetera en «timer».
export const P02Despierta: React.FC = () => {
  const f = useF();
  const X = 2300, Y = COCINA_Y, E = 1.3;
  const B = 40;
  // v4: el sorbo cae en el cuadro del medio (f 58 → 112): la taza llega a la boca, se inclina, y la cara feliz va DESPUÉS
  const sorbo = (g: number) => (g < B ? 0 : rampa(g, 56, 70) * (1 - rampa(g, 100, 114)));
  const mano = (g: number) => {
    const a = { x: X + 78, y: 724 }, m = { x: X + 22, y: 634 };
    const u = sorbo(g);
    return { x: a.x + (m.x - a.x) * u, y: a.y + (m.y - a.y) * u };
  };
  const taza = (g: number) => { const h = mano(g); return <g transform={`translate(${h.x + 30},${h.y + 22}) rotate(${-34 * sorbo(g)}) scale(${-E},${E})`}><Taza vapor={1} f={g} /></g>; };
  const vos = (tomaA: boolean) => (
    <Pj look={VOS} ruta={[{ f: 0, x: X, y: Y }]} escala={E} dir={[{ f: 0, v: 1 }]} seed={4} luz={BORDE_CALIDO}
      poses={tomaA ? [{ f: 0, v: "parado" }] : [{ f: 0, v: "parado" }, { f: 46, v: { tronco: 6, cabeza: 6 }, d: 8 }, { f: 62, v: { tronco: -6, cabeza: -14 }, d: 10 }, { f: 104, v: { tronco: 0, cabeza: 0 }, d: 10 }, { f: 118, v: { hI: 70, cI: 10, tronco: 4 }, d: 10 }, { f: 146, v: "parado" }]}
      caras={tomaA ? [{ f: 0, v: "cansado" }] : [{ f: 0, v: "cansado" }, { f: 46, v: "duda" }, { f: 64, v: "cansado" }, { f: 104, v: "feliz" }, { f: 124, v: "picaro" }]}
      habla={tomaA ? [[6, 30]] : [[132, 150]]}
      miradas={tomaA ? [{ f: 0, v: { x: 0.6, y: 0.8 } }, { f: 16, v: { x: 0.2, y: -0.4 } }] : [{ f: 0, v: { x: 0.3, y: 0.2 } }, { f: 46, v: { x: 1, y: -0.3 } }, { f: 62, v: { x: 0.6, y: 0.5 } }, { f: 104, v: { x: 0.2, y: 0 } }, { f: 118, v: { x: 1, y: -0.1 } }, { f: 140, v: { x: 0, y: 0 } }]}
      giros={tomaA ? [{ f: 0, v: 0.2 }] : [{ f: 0, v: 0 }, { f: 46, v: 0.7 }, { f: 62, v: 0.3 }, { f: 104, v: 0 }, { f: 118, v: 0.7 }, { f: 140, v: -0.2 }]}
      ajuste={manoA({ look: VOS, x: X, y: Y, esc: E, lado: "D", obj: mano, peso: () => 1,
        otra: tomaA ? undefined : manoA({ look: VOS, x: X, y: Y, esc: E, lado: "I", obj: () => ({ x: 2440, y: 560 }), peso: pesoIK(118, 140, 8) }) })} />
  );
  const set = (tomaA: boolean) => (
    <Escena Set={Cocina} pal={PAL} seed={2}
      claves={tomaA ? [mira(-6, X + 104, 724, 3.3), mira(34, X + 60, 562, 2.0, { curva: "inout" }), mira(60, X + 60, 558, 1.98, { curva: "inout" })]
        : [mira(B, 2430, 610, 1.42), mira(165, 2470, 590, 1.48, { curva: "inout" })]}
      medio={<>
        <g transform={`translate(2560,584) scale(1.3)`}><Cafetera f={f} /></g>
        <VisorCafetera x={2414} y={556} f={f} brilla={rampa(f, 118, 126) * (1 - rampa(f, 150, 157))} s={1.2} />
        {vos(tomaA)}
        {taza(f)}
      </>} />
  );
  return <Costura antes={{ el: <P01Mini />, d: 36 }}><Cortes en={[[-100, set(true)], [B, set(false)]]} /></Costura>;
};
const COCINA_Y = 940;

// ---------- 3 · prende la radio (clic, ondas ámbar) y va al radiador de la MISMA cocina a calentarse las manos ----------
// v3: un solo set (continuidad); paneo inout siguiendo la caminata; el radiador echa aire caliente desde «heat»;
// corte limpio a P04 (Costura) en vez del fundido con fantasma.
export const P03Radio: React.FC = () => {
  const f = useF();
  const Y = COCINA_Y, E = 1.3, RX = 2738, AX = 3030;
  const x0 = 2640, x1 = 2800, c0 = 22, c1 = 56;
  const vx = (g: number) => lerp(g, c0, c1, x0, x1);
  const on = rampa(f, 14, 24);
  const calor = rampa(f, 30, 44);
  return (
    <Costura despues={{ el: <P04Calle />, d: -83, desde: 83 }}>
      <Escena Set={Cocina} pal={PAL} seed={3} claves={[mira(0, 2700, 643, 1.62), mira(24, 2706, 643, 1.62, { curva: "inout" }), mira(56, 2940, 655, 1.55, { curva: "inout" }), mira(92, 2960, 645, 1.6, { curva: "inout" })]}
        medio={<>
          <g transform={`translate(2560,584) scale(1.3)`}><Cafetera f={f} /></g>
          <g transform={`translate(${RX},584) scale(0.9)`}><RadioVieja f={f} on={on} perilla={interpolate(f, [6, 14], [-40, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} /></g>
          <OndasRadio x={RX + 70} y={540} f={f} on={on} s={0.9} />
          <Radiador x={AX} piso={P} f={f} on={calor} w={260} />
          <Pj look={VOS} ruta={[{ f: 0, x: x0, y: Y }, { f: c0, x: x0 }, { f: c1, x: x1 }]} escala={E} dir={[{ f: 0, v: 1 }]} seed={4} luz={BORDE_CALIDO}
            poses={[{ f: 0, v: "parado" }, { f: 62, v: { tronco: 16, cabeza: -6 }, d: 12 }, { f: 76, v: { tronco: 12, cabeza: -14, bajar: 4 }, d: 10 }]}
            caras={[{ f: 0, v: "cansado" }, { f: 16, v: "feliz" }, { f: 30, v: "sorpresa" }, { f: 62, v: "cansado" }, { f: 74, v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: 16, v: { x: 0.4, y: -0.3 } }, { f: 30, v: { x: 1, y: 0.4 } }, { f: 62, v: { x: 1, y: 0.8 } }]}
            giros={[{ f: 0, v: 0.6 }, { f: 16, v: -0.3 }, { f: 30, v: 0.8 }, { f: 62, v: 0.5 }]}
            ajuste={manoA({ look: VOS, x: vx, y: Y, esc: E, lado: "D", peso: (g) => Math.max(pesoIK(0, 18, 8)(g), pesoIK(60, 1e9, 10)(g)),
              obj: (g) => (g < 30 ? { x: RX + 44, y: 552 } : { x: AX - 104 + 8 * Math.sin(g / 5), y: 692 }),
              otra: manoA({ look: VOS, x: vx, y: Y, esc: E, lado: "I", peso: pesoIK(62, 1e9, 10), obj: (g) => ({ x: AX - 128 + 8 * Math.sin(g / 5 + 1.4), y: 698 }) }) })} />
        </>} />
    </Costura>
  );
};

// ---------- 4 · «outside your window»: de espaldas mirando afuera, la mano en el vidrio → empuje a través del vidrio →
// dolly por Superior vacía (FRIDAY · DULUTH, MN en el cielo) → corte al semáforo que cambia para nadie (PEOPLE OUTSIDE 0) ----------
export const P04Calle: React.FC = () => {
  const f = useF();
  const k = kDe(9.18);
  const C = k(13.1);
  const calle = (
    <Escena Set={Superior} pal={PAL} claves={[mira(-6, 1460, 560, 0.95), mira(C + 2, 1900, 560, 1.0, { curva: "inout" })]} seed={4} setProps={{ hora: "dia", luces: 0, nieve: 0 }}
      medio={<>
        <Volador f={f} f0={50} f1={150} x0={1250} y0={760} x1={2250} y1={700} tipo="bolsa" s={1.3} />
        <Volador f={f} f0={14} f1={130} x0={1100} y0={820} x1={2000} y1={860} s={1.2} />
        <Bandada f={f} x0={900} y0={240} vx={5} n={6} />
      </>} />
  );
  const sema = (
    <Escena Set={Superior} pal={PAL} claves={[mira(C, 2150, 470, 1.08), mira(178, 2175, 462, 1.11, { curva: "inout" })]} seed={41} setProps={{ hora: "dia", luces: 0, nieve: 0 }}
      medio={<Volador f={f} f0={C} f1={178} x0={1900} y0={880} x1={2700} y1={860} s={1.4} />}
      frente={<SemaforoSuave x={2320} y={629} f={f} s={0.85} claves={[{ f: 0, luz: 2 }, { f: k(13.6), luz: 1 }, { f: k(14.2), luz: 0 }]} />} />
  );
  const VX = 470, VY = 1300, VE = 2.7;
  return (
    <Costura antes={{ el: <P03Radio />, d: 83 }}>
      <AbsoluteFill>
        <Cortes en={[[-100, calle], [C, sema]]} />
        {f < C && <VentanaEmpuje e0={k(10.3)} e1={k(11.2)}>
          <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
            <Pj look={VOS} ruta={[{ f: 0, x: VX, y: VY }]} escala={VE} dir={[{ f: 0, v: 1 }]} seed={4} luz={{ lado: -1, color: "#9bb7ff", fuerza: 0.22 }}
              poses={[{ f: 0, v: "brazosCruzados" }, { f: 12, v: { tronco: 8, cabeza: 4 }, d: 10 }]}
              caras={[{ f: 0, v: "cansado" }, { f: 14, v: "duda" }, { f: 30, v: "sorpresa" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0.1 } }, { f: 14, v: { x: 1, y: -0.2 } }, { f: 30, v: { x: 1, y: 0.3 } }]} giros={[{ f: 0, v: 1 }]}
              ajuste={manoA({ look: VOS, x: VX, y: VY, esc: VE, lado: "D", obj: (g) => ({ x: 660, y: 560 - 12 * rampa(g, 24, 40) }), peso: pesoIK(12, 1e9, 12) })} />
          </svg>
        </VentanaEmpuje>}
        {f < C && <Cartel texto="FRIDAY · 7:52 AM · DULUTH, MN" x={1500} y={110} tam={40} desde={k(10.6)} hasta={C} />}
        {f >= C && <Marcador lineas={[["PEOPLE OUTSIDE", "0", "#ff6a5a"]]} x={760} y={110} tam={58} desde={k(13.4)} />}
      </AbsoluteFill>
    </Costura>
  );
};

// ---------- 5 · la vereda: el peatonal da WALK para nadie, un café en el banco y una correa tirada ----------
export const P05Vereda: React.FC = () => {
  const f = useF();
  const w = interpolate(f, [10, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, 1380, 690, 1.42), mira(40, 1430, 694, 1.47, { curva: "inout" })]} seed={5} setProps={{ hora: "dia", luces: 0, nieve: 0 }}
      medio={<>
        <rect x={1195} y={650} width={10} height={SUP_PISO - 650} fill="#1a1620" />
        <g opacity={1 - w}><SemPeaton x={1200} y={610} walk={false} /></g>
        <g opacity={w}><SemPeaton x={1200} y={610} walk /></g>
        <BancoCafe x={1560} piso={SUP_PISO} f={f} />
        <Volador f={f} f0={0} f1={40} x0={1300} y0={860} x1={1720} y1={870} s={1.3} />
      </>} />
  );
};

// ---------- 6 · los autos llenan el cuadro: uno con la luz de giro titilando, motor apagado ----------
const AUTO_GIRO = SUP_AUTOS.filter((a) => a.x > 2500 && a.x < 2800)[0] ?? SUP_AUTOS[10];
export const P06Autos: React.FC = () => {
  const f = useF();
  const gx = AUTO_GIRO.x + AUTO_GIRO.dir * -126 * 1.15, gy = SUP_PISO + 190 - 59;
  return (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, 2330, SUP_PISO + 40, 1.9), mira(35, 2380, SUP_PISO + 40, 1.92, { curva: "inout" })]} seed={6} setProps={{ hora: "dia", luces: 0, nieve: 0 }}
      frente={<Giro x={gx} y={gy} f={f} />} />
  );
};

// ---------- 7 · la ciudad entera de día, sin nadie: tirón hacia atrás, pájaros ----------
export const P07Ciudad: React.FC = () => {
  const f = useF();
  return (
    <Empuje k={[{ f: 0, z: 1.7, x: 1180, y: 520 }, { f: 37, z: 1.06, x: 980, y: 540 }, { f: 60, z: 0.98, x: 950, y: 540 }]}>
      <Escena Set={Panorama} pal={PAL} claves={[mira(0, 2050, 560, 0.8), mira(60, 2080, 560, 0.8)]} seed={7} setProps={{ hora: "dia", luces: 0, nieve: 0, vapor: 0 }}
        medio={<Bandada f={f} x0={1500} y0={280} vx={6} n={9} s={1.2} />} />
      <SolDia x={775} y={258} r={50} />
    </Empuje>
  );
};

// ---------- 8 · 8,000,000,000 → 2: la multitud se apaga en ola hasta que quedan dos ----------
export const P08Ocho: React.FC = () => {
  const k = kDe(18.76);
  return (
    <Costura antes={{ el: <P07Ciudad />, d: 37 }}><AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 70%, #2a2238 0%, #0d0b14 75%)" }}>
      <Multitud a={k(19.6)} b={k(21.4)} zoomF={k(22.2)} />
      <NumeroGrande claves={[{ f: 0, v: 8000000000 }, { f: k(19.6), v: 8000000000 }, { f: k(21.4), v: 2, d: 30 }]} rotulo="PEOPLE ON EARTH" y={110} hasta={k(22.4)} />
    </AbsoluteFill></Costura>
  );
};

// ---------- 9 · la pregunta: June gira hacia Theo, él exhala vapor, se cruza de brazos; ¿cuánto durarían? ----------
export const P09Pregunta: React.FC = () => {
  const f = useF();
  const k = kDe(23.14);
  const T = 560, J = 720;
  return (
    <AbsoluteFill>
      <Empuje k={[{ f: 0, z: 2.0, x: 600, y: 600 }, { f: k(27.3), z: 2.0, x: 612, y: 598 }, { f: k(28.7), z: 1.3, x: 720, y: 560 }, { f: 200, z: 1.27, x: 724, y: 560 }]}>
        <Escena Set={Panorama} pal={PAL} claves={[mira(0, 1100, 560, 0.85), mira(188, 1110, 560, 0.85)]} seed={9} setProps={{ hora: "noche", luces: 1, nieve: 0, vapor: 0.5 }}
          medio={<>
            <Pj look={THEO_MOCHI} ruta={[{ f: 0, x: T, y: P - 6 }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO}
              poses={[{ f: 0, v: "parado" }, { f: k(23.9), v: "brazosCruzados", d: 8 }, { f: k(26.0), v: "pensar", d: 8 }, { f: k(27.9), v: "encogerse", d: 10 }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(24.9), v: "triste" }, { f: k(26.0), v: "duda" }, { f: k(27.6), v: "miedo" }]}
              miradas={[{ f: 0, v: { x: 1, y: -0.1 } }, { f: k(24.72), v: { x: 1, y: 0.4 } }, { f: k(26.0), v: { x: 1, y: 0 } }, { f: k(27.4), v: { x: 1, y: -0.5 } }]}
              giros={[{ f: 0, v: 0 }, { f: k(26.0), v: 0.5 }, { f: k(27.4), v: 0 }]} habla={[[k(24.8), k(25.6)]]} />
            <Pj look={JUNE_MOCHI} ruta={[{ f: 0, x: J, y: P - 6 }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO} seed={2}
              caras={[{ f: 0, v: "duda" }, { f: k(24.3), v: "miedo" }, { f: k(25.8), v: "duda" }, { f: k(27.6), v: "triste" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(23.4), v: { x: -1, y: 0 } }, { f: k(27.4), v: { x: 1, y: -0.4 } }]} giros={[{ f: 0, v: 0 }, { f: k(23.4), v: -0.6 }, { f: k(27.4), v: 0 }]}
              poses={[{ f: 0, v: "parado" }, { f: k(24.0), v: "manosCintura" }, { f: k(26.4), v: "brazosCruzados" }, { f: k(27.6), v: "encogerse" }]} habla={[[k(26.5), k(27.2)]]} />
            <AlientoV4 f={f} x={T + 30} y={P - 262} desde={k(25.0)} />
            <AlientoV4 f={f} x={J - 30} y={P - 262} desde={k(26.4)} dir={-1} />
          </>} />
      </Empuje>
      <RelojArena x={1400} y={170} desde={k(27.9)} s={0.85} />
    </AbsoluteFill>
  );
};

// ---------- 10 · «not in a movie»: la marquesina cambia a NOT A MOVIE; corte al mirador: comida, invierno, cuentas ----------
export const P10Real: React.FC = () => {
  const f = useF();
  const k = kDe(29.4);
  const B = k(30.9);
  const JX = 880, TX = 1060;
  const lata = (g: number) => ({ x: JX + 66, y: P - 190 + 40 * (1 - rampa(g, k(31.0), k(31.5))) });
  const cine = (
    <Escena Set={Superior} pal={PAL} claves={[mira(-6, 1980, 600, 1.42), mira(B, 2010, 596, 1.46, { curva: "inout" })]} seed={10} setProps={{ hora: "dia", luces: 0, nieve: 0 }}
      medio={<>
        <Marquesina piso={SUP_PISO} f={f} cambia={k(29.75)} />
        <Pj look={JUNE_MOCHI} ruta={[{ f: 0, x: 2290, y: SUP_PISO }, { f: k(29.95), x: 2380 }]} seed={2} dir={[{ f: 0, v: 1 }, { f: k(29.75), v: -1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k(30.0), v: "señalar" }]} caras={[{ f: 0, v: "neutral" }, { f: k(29.85), v: "sorpresa" }, { f: k(30.4), v: "duda" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(29.7), v: { x: 1, y: -0.8 } }]} />
        <Pj look={THEO_MOCHI} ruta={[{ f: 0, x: 2420, y: SUP_PISO }, { f: k(29.95), x: 2510 }]} dir={[{ f: 0, v: 1 }, { f: k(29.85), v: -1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k(30.4), v: "brazosCruzados" }]} caras={[{ f: 0, v: "duda" }, { f: k(30.4), v: "picaro" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(29.8), v: { x: 1, y: -0.7 } }, { f: k(30.5), v: { x: 1, y: 0 } }]} giros={[{ f: 0, v: 0 }, { f: k(30.5), v: 0.5 }]} />
      </>} />
  );
  const mirador = (
    <Escena Set={Panorama} pal={PAL} claves={[mira(B, 1050, 600, 1.6), mira(179, 1066, 598, 1.64, { curva: "inout" })]} seed={101} setProps={{ hora: "dia", luces: 0, nieve: 0, vapor: 0 }}
      medio={<>
        <Pj look={JUNE_MOCHI} ruta={[{ f: 0, x: JX, y: P - 6 }]} dir={[{ f: 0, v: 1 }]} seed={2}
          poses={[{ f: 0, v: "parado" }, { f: k(33.5), v: { hD: 120, cD: 10, tronco: -3, cabeza: -8 }, d: 10 }]} caras={[{ f: 0, v: "determinado" }, { f: k(31.4), v: "feliz" }, { f: k(32.2), v: "miedo" }, { f: k(33.6), v: "determinado" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0.5 } }, { f: k(31.9), v: { x: 1, y: 0 } }, { f: k(33.6), v: { x: 1, y: -0.7 } }]} habla={[[k(33.8), k(34.8)]]}
          ajuste={manoA({ look: JUNE_MOCHI, x: JX, y: P - 6, lado: "D", obj: lata, peso: pesoIK(k(30.9), k(33.4), 8) })} />
        {f < k(33.4) && <g transform={`translate(${lata(f).x + 6},${lata(f).y + 4})`} opacity={rampa(f, k(30.95), k(31.15))}>
          <rect x={-18} y={-26} width={36} height={52} rx={5} fill="#c0352c" /><rect x={-18} y={-10} width={36} height={18} fill="#efe3c8" /><text x={0} y={4} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={11} fill="#c0352c">BEANS</text>
        </g>}
        <Pj look={THEO_MOCHI} ruta={[{ f: 0, x: TX, y: P - 6 }]} dir={[{ f: 0, v: -1 }, { f: k(32.0), v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k(31.9), v: "encogerse", d: 8 }, { f: k(33.5), v: "brazosCruzados", d: 10 }]} caras={[{ f: 0, v: "feliz" }, { f: k(31.9), v: "cansado" }, { f: k(33.5), v: "duda" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(32.0), v: { x: 1, y: -0.2 } }, { f: k(33.5), v: { x: 1, y: -0.6 } }]} />
        <Rafaga f={f} f0={k(31.85)} x0={380} y0={P - 400} w={640} n={4} />
        <AlientoV4 f={f} x={TX + 30} y={P - 262} desde={k(32.1)} />
      </>} />
  );
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, cine], [B, mirador]]} />
      <Tarjeta x={1000} y={250} w={270} desde={k(31.0)} icono="lata" texto="REAL FOOD" />
      <Tarjeta x={1310} y={250} w={270} desde={k(31.9)} icono="termo" texto="REAL WINTERS" color="#8fd3ff" />
      <Tarjeta x={1620} y={250} w={270} desde={k(33.5)} icono="cuenta" texto="REAL MATH" />
    </AbsoluteFill>
  );
};

// ---------- 11 · «let's count it»: una mano abre la tapa (corte limpio al 12) ----------
// v4: la mano del kit (manga + dedos, 0,72) entra desde abajo a la derecha, pellizca el borde y la tapa se abre
// entre los cuadros 5 y 23 con empuje (1,0 → 1,14): ini (tapa cerrada + mano llegando) ≠ mid (tapa de canto) ≠ fin (abierto).
export const P11Cuenta: React.FC = () => <Costura despues={{ el: <P12Hora />, d: -24, desde: 24 }}><CuadernoAbreV4 abre={3} zoom={[0, 1.0, 2.4]} /></Costura>;

// ---------- 12 · 3:12 a.m., 3 de octubre: el que paseaba al perro bosteza y desaparece sin ruido; el perro busca; Theo duerme ----------
export const P12Hora: React.FC = () => {
  const f = useF();
  const k = kDe(36.18);
  const ya = k(39.9);
  const para = k(37.5);
  const vx = (g: number) => lerp(g, 0, para, 1440, 1640);
  const ox = (g: number) => (g < ya ? vx(g) + 120 : vx(ya) + 120 + 30 * rampa(g, ya, ya + 12));
  const calle = (
    <Escena Set={Barrio} pal={PAL} claves={[mira(0, 1560, 640, 1.6), mira(para + 4, 1680, 646, 1.7, { curva: "inout" })]} seed={12} setProps={{ hora: "noche", luces: 0.15, nieve: 0 }}
      medio={<>
        {f < ya ? <path d={`M${vx(f) + 22},${BARRIO_PISO - 112} Q${vx(f) + 80},${BARRIO_PISO - 60} ${ox(f) + 36},${BARRIO_PISO - 56}`} stroke="#c0352c" strokeWidth={4} fill="none" />
          : <path d={`M${vx(ya) + 10},${BARRIO_PISO - 2} Q${vx(ya) + 60},${BARRIO_PISO + 4} ${ox(f) + 36},${BARRIO_PISO - 56 + 40 * rampa(f, ya, ya + 8)}`} stroke="#c0352c" strokeWidth={4} fill="none" />}
        <Ore x={ox(f)} y={BARRIO_PISO} dir={f < ya + 16 ? 1 : -1} f={f} cola={f < ya ? 1 : 0.2} cabeza={f > ya + 20 ? -0.4 : f > ya + 6 ? 0.3 : f > k(38.7) && f < k(39.4) ? 0.35 : 0} s={0.7} />
        <Pj look={PASEA} ruta={[{ f: 0, x: 1440, y: BARRIO_PISO }, { f: para, x: 1640 }]} seed={7} opacidad={(g) => 1 - rampa(g, ya - 2, ya + 6)}
          poses={[{ f: 0, v: "parado" }, { f: k(37.65), v: { hD: 62, cD: 128, tronco: -6, cabeza: -16 }, d: 8 }, { f: k(38.65), v: { hD: -28, cD: 30, cabeza: -6, tronco: -5 }, d: 10 }, { f: k(39.3), v: { tronco: 8, cabeza: 14, hD: 4, cD: 10 }, d: 10 }]}
          caras={[{ f: 0, v: "neutral" }, { f: k(37.0), v: "cansado" }, { f: k(37.7), v: "sorpresa" }, { f: k(38.65), v: "cansado" }, { f: k(39.3), v: "feliz" }]} habla={[[k(37.7), k(38.55)]]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(37.0), v: { x: 1, y: 0.4 } }, { f: k(37.7), v: { x: 0.3, y: -0.8 } }, { f: k(38.65), v: { x: 1, y: 0.2 } }, { f: k(39.3), v: { x: 1, y: 0.8 } }]}
          ajuste={manoA({ look: PASEA, x: vx, y: BARRIO_PISO, lado: "I", obj: (g) => ({ x: vx(g) + 26, y: BARRIO_PISO - 112 }), peso: () => 1 })} />
      </>} />
  );
  const cama = (
    <Escena Set={DuplexCorte} pal={PAL} claves={[mira(k(40.6), 720, 618, 1.5), mira(183, 735, 618, 1.52, { curva: "inout" })]} seed={121} setProps={{ alba: 0, celular: 0 }}
      medio={<>
        <CascoLiniero x={590} y={DUP.piso - 430} s={0.9} />
        <GorroPerchero x={1044} y={DUP.piso - 382} colgado />
        <TheoCama x={DUP.cama} piso={DUP.piso} f={f} vuelta={0} />
        <RelojMesa x={965} y={DUP.piso - 179} txt="3:12" f={f} />
      </>} />
  );
  return (
    <Costura antes={{ el: <P11Cuenta />, d: 24 }}><AbsoluteFill>
      <Cortes en={[[-100, calle], [k(40.6), cama]]} />
      <RelojDia min={3 * 60 + 11 + (f >= k(38.3) ? 1 : 0)} x={400} y={110} desde={k(36.4)} tam={52} />
      <Calendario texto="OCT 3" x={690} y={116} desde={k(36.8)} />
    </AbsoluteFill></Costura>
  );
};

// ---------- 13 · Theo Lindgren, 34, liniero (casco en la pared): se da vuelta, se sienta, gorro, oreja a la pared: la otra mitad, en silencio ----------
// v4: 3 tomas con CORTE seco y Theo grande (≥40 % del alto): (1) cerca de la cama: el despertador pasa a 5:59, Theo se da
// vuelta enseguida (ini ≠ mid); (2) plano medio: sentado en el borde, se frota la cara, mira el gorro colgado, se levanta,
// lo descuelga con IK y se lo pone en cuadro, camina a la medianera y apoya palma y oreja; (3) general a 1,12 con las dos
// mitades: él contra la pared y del otro lado la cama deshecha y el celular que suena solo. Rótulos en zonas lisas.
export const P13Theo: React.FC = () => {
  const f = useF();
  const k = kDe(42.28);
  const C1 = k(44.2), C2 = k(49.0);
  const E = 1.2, PI = DUP.piso;
  const SX = 720, GX = 985, WX = 1088;
  const para = k(45.3), c0 = k(45.35), c1 = k(46.5), toma = k(46.6), pone = k(47.2), w0 = k(47.5), w1 = k(48.15);
  const x = (g: number) => (g < c0 ? SX : g < c1 ? lerp(g, c0, c1, SX, GX) : g < w0 ? GX : lerp(g, w0, w1, GX, WX));
  const PEG = { x: 1044, y: PI - 382 };
  const agarre = { x: PEG.x + 4, y: PEG.y + 62 };
  const cabeza = (g: number) => ({ x: x(g) + 14 * E, y: PI - 300 * E });
  const gorroEn = (g: number) => { const u = rampa(g, toma, pone); const c = cabeza(g); return { x: agarre.x + (c.x - agarre.x) * u, y: agarre.y + (c.y - agarre.y) * u }; };
  const puesto = f >= pone;
  const alba = lerp(f, 0, 250, 0.35, 0.9);
  const reloj = <RelojMesa x={965} y={PI - 179} txt={f < k(42.9) ? "5:58" : "5:59"} f={f} tick={k(42.9)} />;
  const casco = <CascoLiniero x={590} y={PI - 430} s={0.9} />;
  const theo = (
    <Pj look={puesto ? THEO : THEO_CASA} ruta={[{ f: 0, x: SX, y: PI }, { f: c0, x: SX }, { f: c1, x: GX }, { f: w0, x: GX }, { f: w1, x: WX }]} escala={E} dir={[{ f: 0, v: 1 }]} luz={BORDE_CALIDO}
      asiento={[{ f: 0, v: 96 }, { f: para - 6, v: 96 }, { f: para + 4, v: undefined }]}
      poses={[{ f: 0, v: "sentado" }, { f: k(44.45), v: { ...{ tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92 }, hI: 40, cI: 140, hD: 45, cD: 140, cabeza: 8 }, d: 8 }, { f: k(45.0), v: "sentado", d: 8 },
        { f: para, v: "parado", d: 10 }, { f: w1, v: { tronco: 10, cabeza: 16, hI: -10, cI: 30 }, d: 10 }, { f: k(49.9), v: { tronco: 6, cabeza: 8, hI: 35, cI: 120 }, d: 12 }]}
      caras={[{ f: 0, v: "cansado" }, { f: k(45.0), v: "duda" }, { f: pone + 2, v: "determinado" }, { f: w1 + 4, v: "duda" }, { f: k(49.8), v: "miedo" }]}
      miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(45.0), v: { x: 1, y: -0.7 } }, { f: para, v: { x: 1, y: -0.5 } }, { f: pone, v: { x: 1, y: 0 } }, { f: w1 + 4, v: { x: 1, y: 0.3 } }, { f: k(49.8), v: { x: -1, y: 0.2 } }]}
      giros={[{ f: 0, v: 0.3 }, { f: k(45.0), v: 0 }, { f: pone, v: 0.4 }, { f: w1, v: 0.9 }, { f: k(49.8), v: 0.2 }]}
      habla={[]}
      ajuste={manoA({ look: THEO, x, y: PI, esc: E, lado: "D", peso: (g) => Math.max(pesoIK(toma - 8, pone, 8)(g), pesoIK(w1 - 4, 1e9, 8)(g)),
        obj: (g) => (g < w0 ? gorroEn(g) : { x: DUP.pared - 20, y: PI - 262 }) })} />
  );
  const gorroMano = f >= toma && !puesto && <g transform={`translate(${gorroEn(f).x},${gorroEn(f).y})`}><Gorro s={1.1} /></g>;
  const t1 = (
    <Escena Set={DuplexCorte} pal={PAL} claves={[mira(-4, 640, 730, 1.75), mira(C1, 660, 728, 1.86, { curva: "inout" })]} seed={13} setProps={{ alba, celular: 1 }}
      medio={<>{casco}<GorroPerchero x={PEG.x} y={PEG.y} colgado /><TheoCama x={DUP.cama} piso={PI} f={f} vuelta={rampa(f, k(42.85), k(43.4))} />{reloj}</>} />
  );
  const t2 = (
    <Escena Set={DuplexCorte} pal={PAL} claves={[mira(C1, 870, 690, 1.55), mira(k(46.6), 900, 690, 1.58, { curva: "inout" }), mira(C2 - 1, 960, 690, 1.6, { curva: "inout" })]} seed={131} setProps={{ alba, celular: 1 }}
      medio={<>{casco}<GorroPerchero x={PEG.x} y={PEG.y} colgado={f < toma} /><TheoCama x={DUP.cama} piso={PI} f={f} vuelta={1} vacia destapa={1} />{reloj}{theo}{gorroMano}</>} />
  );
  const t3 = (
    <Escena Set={DuplexCorte} pal={PAL} claves={[mira(C2, 1345, 640, 1.12), mira(260, 1330, 640, 1.16, { curva: "inout" })]} seed={132} setProps={{ alba, celular: 1 }}
      medio={<>{casco}<GorroPerchero x={PEG.x} y={PEG.y} colgado={false} /><TheoCama x={DUP.cama} piso={PI} f={f} vuelta={1} vacia destapa={1} />{reloj}{theo}</>} />
  );
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, t1], [C1, t2], [C2, t3]]} />
      <Rotulo nombre="THEO LINDGREN · 34" bajada="LINEMAN · MINNESOTA POWER" x={200} y={918} desde={k(42.6)} hasta={k(47.0)} />
      <Cartel texto="THE OTHER HALF: QUIET" x={1250} y={180} tam={40} desde={k(49.3)} />
    </AbsoluteFill>
  );
};

// ---------- 14 · el bus 6 no llega: mira la calle dos veces, golpea el pie, inserto del horario 6:40, se encoge ----------
export const P14Bus: React.FC = () => {
  const f = useF();
  const k = kDe(50.7);
  const X = 740;
  const min = 6 * 60 + 40 + Math.floor(lerp(f, k(53.7), k(58.2), 0, 18));
  const tarde = Math.max(0, min - 400);
  const I0 = k(55.5), I1 = k(57.0);
  const horario = <HorarioParada x={900} y={BARRIO_PISO - 272} f={f} marca={k(56.3)} />;
  const theo = (
    <Pj look={THEO} ruta={[{ f: 0, x: X, y: BARRIO_PISO }]}
      dir={[{ f: 0, v: 1 }, { f: k(52.0), v: -1 }, { f: k(53.4), v: 1 }, { f: k(54.7), v: -1 }, { f: k(55.4), v: 1 }]}
      poses={[{ f: 0, v: "parado" }, { f: k(51.7), v: "brazosCruzados", d: 8 }, { f: k(52.0), v: { ...{ hI: 30, cI: 115, hD: 35, cD: 110 }, tronco: 9, cabeza: 6 }, d: 8 }, { f: k(53.4), v: "brazosCruzados", d: 8 },
        { f: k(54.0), v: { hD: 78, cD: 128, hI: 22, cI: 104, cabeza: 16, tronco: 4 }, d: 8 }, { f: k(54.7), v: { tronco: 10, cabeza: 4, hD: 10, cD: 20 }, d: 8 }, { f: k(55.4), v: "brazosCruzados", d: 8 }, { f: k(57.3), v: "encogerse", d: 10 }]}
      caras={[{ f: 0, v: "neutral" }, { f: k(51.7), v: "duda" }, { f: k(54.0), v: "cansado" }, { f: k(54.7), v: "duda" }, { f: k(57.3), v: "triste" }]}
      miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(52.0), v: { x: 1, y: -0.1 } }, { f: k(54.0), v: { x: 1, y: 0.8 } }, { f: k(54.7), v: { x: 1, y: -0.2 } }, { f: k(57.0), v: { x: 0, y: 0 } }]}
      giros={[{ f: 0, v: 0 }, { f: k(52.0), v: -0.3 }, { f: k(53.4), v: 0.4 }, { f: k(54.7), v: -0.3 }, { f: k(55.4), v: 0.3 }, { f: k(57.3), v: 0 }]}
      ajuste={(p0, g) => {
        const tap = g > k(52.8) && g < k(53.9) ? Math.max(0, Math.sin((g - k(52.8)) / 2.2)) * 18 : 0;
        return { ...p0, rD: p0.rD - tap };
      }} />
  );
  const parada = (
    <Escena Set={Barrio} pal={PAL} claves={[mira(-6, 860, 640, 1.55), mira(k(53.7), 852, 644, 1.58, { curva: "inout" }), mira(I0, 850, 600, 1.95, { curva: "inout" }), mira(I1, 840, 650, 1.62), mira(229, 830, 656, 1.7, { curva: "inout" })]} seed={14} setProps={{ hora: "alba", luces: 0, nieve: 0 }}
      medio={<>{horario}{theo}</>} />
  );
  const inserto = (
    <Escena Set={Barrio} pal={PAL} claves={[mira(I0, 900, BARRIO_PISO - 290, 2.7), mira(I1, 900, BARRIO_PISO - 290, 2.85, { curva: "inout" })]} seed={141} setProps={{ hora: "alba", luces: 0, nieve: 0 }}
      medio={<>{horario}</>} />
  );
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, parada], [I0, inserto], [I1, parada]]} />
      <RelojDia min={min} x={1460} y={110} desde={k(53.5)} tam={52} />
      {(f < I0 || f >= I1) && <Contador lineas={[{ etiqueta: "BUS 6 DUE", claves: "6:40", color: AMBAR }, { etiqueta: "LATE", claves: `+${tarde} MIN`, color: tarde > 0 ? "#ff6a5a" : "#8fe08a" }]} x={280} y={200} tam={46} alinear="der" desde={k(54.0)} />}
    </AbsoluteFill>
  );
};

// ---------- 15 · baja a Superior: general corto (≤2 s) → plano medio: autos A ESCALA, Theo se frena y apoya la palma en un techo ----------
// v3: la fila chica del set queda tapada por autos grandes (CalleAutos, techo ≈ hombro de Theo) y Theo camina DELANTE de la fila
// (sombra y pies por debajo de las ruedas): ya no «pisa» un auto.
export const AUTOS_V3 = [550, 1150, 1750, 2350, 2950];
const AY = SUP_PISO + 300, TY = SUP_PISO + 360;
export const P15Superior: React.FC = () => {
  // v4: general ≤1,7 s con Theo por la VEREDA (capa medio, detrás de los autos, lejos del semáforo y el farol) y el
  // contador que rueda 0 → 41 en el cielo; corte seco al medio: camina entre los autos, apoya la palma en el techo,
  // mira la fila hacia atrás (giro + miedo) y se encoge. Sin rótulos sobre la calle ni la marca.
  const k = kDe(58.36);
  const c1 = 52, para = k(60.75);
  const xM = (g: number) => lerp(g, c1, para, 1290, 1530);
  const calle = <CalleAutos xs={AUTOS_V3} y={AY} piso={SUP_PISO} />;
  const theoV = (
    <Pj look={THEO} ruta={[{ f: 0, x: 1320, y: SUP_PISO }, { f: c1, x: 1470 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }]}
      miradas={[{ f: 0, v: { x: 1, y: 0.3 } }]} />
  );
  const theo = (
    <Pj look={THEO} ruta={[{ f: c1, x: 1290, y: TY }, { f: para, x: 1530 }]} dir={[{ f: 0, v: 1 }]}
      poses={[{ f: 0, v: "parado" }, { f: k(62.45), v: "encogerse" }]}
      caras={[{ f: 0, v: "duda" }, { f: k(60.9), v: "sorpresa" }, { f: k(61.5), v: "miedo" }, { f: k(62.45), v: "triste" }]}
      miradas={[{ f: 0, v: { x: 1, y: 0.25 } }, { f: k(60.8), v: { x: 1, y: 0.6 } }, { f: k(61.45), v: { x: -1, y: -0.05 } }, { f: k(62.45), v: { x: 0.3, y: 0.3 } }]}
      giros={[{ f: 0, v: 0 }, { f: k(61.45), v: 0.75 }, { f: k(62.45), v: 0.2 }]}
      ajuste={manoA({ look: THEO, x: (g) => (g < para ? xM(g) : 1530), y: TY, lado: "D", obj: (g) => ({ x: 1652, y: AY - 178 + 3 * Math.sin(g / 7) }), peso: pesoIK(k(60.6), k(62.3), 9) })} />
  );
  const ancho = <Escena Set={Superior} pal={PAL} claves={[mira(0, 1350, 600, 0.75), mira(c1, 1380, 600, 0.76)]} seed={15} setProps={{ hora: "dia", luces: 0 }} medio={theoV} frente={calle} />;
  const medio = <Escena Set={Superior} pal={PAL} claves={[mira(c1, 1430, 955, 1.3), mira(155, 1450, 955, 1.32)]} seed={151} setProps={{ hora: "dia", luces: 0 }} frente={<>{calle}{theo}</>} />;
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, ancho], [c1, medio]]} />
      <PilarR lineas={[{ e: "CARS ON SUPERIOR", v: [[0, 0], [k(61.4), 41]], c: AMBAR }, { e: "DRIVERS", v: "0", c: "#ff6a5a" }]} x={180} y={880} tam={42} desde={k(61.2)} />
    </AbsoluteFill>
  );
};

// ---------- 16 · motores apagados, puertas cerradas: tira dos veces de la manija, se asoma con la mano de visera → la campera doblada ----------
export const P16Campera: React.FC = () => {
  const k = kDe(63.52);
  const CX = 2350, X = 2210;
  const t1 = k(64.3), t2 = k(65.3), ins = k(66.3);
  const tira = (g: number) => (g < t1 ? 0 : g < t2 ? Math.max(0, Math.sin(((g - t1) / (t2 - t1)) * Math.PI * 2)) * 26 : 0);
  const asomo = (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, 2050, 963, 1.8), mira(ins, 2070, 963, 1.83)]} seed={16} setProps={{ hora: "dia", luces: 0 }}
      frente={<>
        <CalleAutos xs={AUTOS_V3} y={AY} piso={SUP_PISO} />
        <Pj look={THEO} ruta={[{ f: 0, x: X - 120, y: TY }, { f: 18, x: X }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: t2, v: "pensar" }]} caras={[{ f: 0, v: "duda" }, { f: k(64.9), v: "enojo" }, { f: t2 + 6, v: "miedo" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: t1, v: { x: 0.6, y: 0.8 } }, { f: t2 + 4, v: { x: 1, y: 0.5 } }]} giros={[{ f: 0, v: 0 }, { f: k(64.9), v: 0.6 }, { f: t2, v: 0 }]}
          ajuste={manoA({ look: THEO, x: (g) => lerp(g, 0, 18, X - 120, X), y: TY, lado: "D", obj: (g) => ({ x: CX - 40 - tira(g), y: AY - 105 }), peso: pesoIK(20, t2, 8),
            otra: manoA({ look: THEO, x: X, y: TY, lado: "I", obj: () => ({ x: X + 60, y: TY - 286 }), peso: pesoIK(t2 + 2) }) })} />
      </>} />
  );
  // v4: el inserto lleva a Theo: su reflejo en el vidrio y su palma que se apoya (vaho), y la manga que cuelga del asiento
  const adentro = <AbsoluteFill><InteriorAutoV3 e0={ins} /><AutoExtraV4 e0={ins} refl={k(66.9)} palma={k(67.6)} /></AbsoluteFill>;
  return <Cortes en={[[-100, asomo], [ins, adentro]]} />;
};

// ---------- 17 · camina una hora; ahueca las manos y grita HELLO?! (eco que se aleja por el cielo) ----------
// v3: camina bajo el edificio de 2 pisos (lejos de faroles y del cartel NOW SHOWING), reloj en zona limpia, globos en el cielo.
export const P17Grita: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const k = kDe(70.22);
  const g0 = k(71.9);
  // v4: encuadre 1,55 entre el NOW SHOWING y el FIRE HALL (ningún cartel cortado por el borde), Theo lejos del farol,
  // eco: dos «hello?» más chicos que suben y se apagan.
  const X0 = 2390, X1 = 2540;
  const claves = [mira(0, 2555, 610, 1.55), mira(74, 2575, 610, 1.55, { curva: "inout" })];
  const E = [{ f: 0, z: 1 }, { f: g0 - 12, z: 1 }, { f: g0 + 6, z: 1.4, x: tX(enPantalla(claves, g0, fps, X1 + 20, SUP_PISO - 250).x), y: 500 }];
  const boca = enPantalla(claves, f, fps, X1 + 24, SUP_PISO - 250);
  const b = tras(E, f, boca.x, boca.y);
  const gx = Math.min(1300, b.x + 200);
  const gy = Math.max(150, b.y - 170);
  return (
    <AbsoluteFill>
      <Empuje k={E}>
        <Escena Set={Superior} pal={PAL} claves={claves} seed={17} setProps={{ hora: "dia", luces: 0 }}
          frente={<CalleAutos xs={AUTOS_V3} y={AY} piso={SUP_PISO} />}
          medio={<Pj look={THEO} ruta={[{ f: 0, x: X0, y: SUP_PISO }, { f: k(71.5), x: X1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(71.5), v: "manosCintura" }]}
            caras={[{ f: 0, v: "cansado" }, { f: k(71.5), v: "duda" }, { f: g0 - 4, v: "determinado" }, { f: g0 + 2, v: "sorpresa" }]} habla={[[g0, k(72.7)]]}
            miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: k(71.0), v: { x: -1, y: -0.1 } }, { f: k(71.5), v: { x: 1, y: -0.1 } }, { f: g0, v: { x: 1, y: -0.35 } }]} giros={[{ f: 0, v: 0 }, { f: k(71.0), v: 0.6 }, { f: k(71.5), v: 0 }]}
            ajuste={manoA({ look: THEO, x: (g) => lerp(g, 0, k(71.5), X0, X1), y: SUP_PISO, lado: "D", obj: () => ({ x: X1 + 34, y: SUP_PISO - 246 }), peso: pesoIK(g0 - 8, 1e9, 7),
              otra: manoA({ look: THEO, x: X1, y: SUP_PISO, lado: "I", obj: () => ({ x: X1 + 30, y: SUP_PISO - 236 }), peso: pesoIK(g0 - 8, 1e9, 7) }) })} />} />
      </Empuje>
      <RelojDia min={7 * 60 + 10 + Math.floor(lerp(f, 0, k(71.6), 0, 60))} x={1420} y={100} desde={0} tam={52} />
      <Globo texto="HELLO?!" x={gx} y={gy} desde={g0} hasta={k(72.7) + 6} tam={78} cola="izq" />
      <Eco texto="hello?" x={gx + 60} y={gy} desde={g0} dx={150} dy={-62} tam={54} />
    </AbsoluteFill>
  );
};
const tX = (x: number) => Math.min(1920 - 960 / 1.4, Math.max(960 / 1.4, x));

// ---------- 18 · policía (golpea la puerta), bomberos (espía con las manos en el vidrio), la Holiday (tira de la puerta) ----------
// v3: sin el «knock» que titilaba; los golpes son el brazo; checklist en una zona lisa (abajo, sobre la vereda).
export const P18Lugares: React.FC = () => {
  const k = kDe(72.7);
  const a = k(74.0), b = k(75.4);
  const PX = 2470;
  const golpe = (g: number) => Math.max(0, Math.sin((g - 14) / 2.6)) * 22;
  const calle = <CalleAutos xs={AUTOS_V3} y={AY} piso={SUP_PISO} />;
  const pol = (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, 2558, 600, 1.55), mira(a, 2562, 600, 1.555, { curva: "inout" })]} seed={18} setProps={{ hora: "dia", luces: 0 }} frente={calle}
      medio={<Pj look={THEO} ruta={[{ f: 0, x: PX - 70, y: SUP_PISO }, { f: 12, x: PX }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: "parado" }, { f: a - 10, v: "manosCintura" }]} caras={[{ f: 0, v: "determinado" }, { f: 26, v: "duda" }, { f: a - 10, v: "triste" }]}
        miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: 26, v: { x: 1, y: -0.4 } }, { f: a - 10, v: { x: -0.4, y: 0 } }]} giros={[{ f: 0, v: 0 }, { f: a - 10, v: 0.6 }]}
        ajuste={manoA({ look: THEO, x: (g) => lerp(g, 0, 12, PX - 70, PX), y: SUP_PISO, lado: "D", obj: (g) => ({ x: PX + 100 + golpe(g), y: SUP_PISO - 200 }), peso: pesoIK(12, a - 14, 6) })} />} />
  );
  const FX = 3010;
  const fuego = (
    <Escena Set={Superior} pal={PAL} claves={[mira(a, 3199, 630, 1.7), mira(b, 3203, 630, 1.705, { curva: "inout" })]} seed={181} setProps={{ hora: "dia", luces: 0 }} frente={calle}
      medio={<Pj look={THEO} ruta={[{ f: a, x: FX - 60, y: SUP_PISO }, { f: a + 12, x: FX }]} dir={[{ f: 0, v: 1 }]}
        caras={[{ f: 0, v: "duda" }, { f: a + 18, v: "miedo" }, { f: b - 10, v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: -0.1 } }, { f: a + 16, v: { x: 1, y: 0.1 } }]}
        ajuste={manoA({ look: THEO, x: (g) => lerp(g, a, a + 12, FX - 60, FX), y: SUP_PISO, lado: "D", obj: () => ({ x: FX + 94, y: SUP_PISO - 262 }), peso: pesoIK(a + 12, b - 8, 6),
          otra: manoA({ look: THEO, x: FX, y: SUP_PISO, lado: "I", obj: () => ({ x: FX + 90, y: SUP_PISO - 300 }), peso: pesoIK(a + 12, b - 8, 6) }) })} />} />
  );
  const HX = 450;
  const holi = (
    <Escena Set={Superior} pal={PAL} claves={[mira(b, 505, 600, 1.55), mira(145, 498, 600, 1.555, { curva: "inout" })]} seed={182} setProps={{ hora: "dia", luces: 0 }} frente={calle}
      medio={<Pj look={THEO} ruta={[{ f: b, x: HX + 110, y: SUP_PISO }, { f: b + 22, x: HX }]} dir={[{ f: 0, v: -1 }, { f: b + 34, v: 1 }]}
        poses={[{ f: 0, v: "parado" }, { f: b + 24, v: "encogerse" }]} caras={[{ f: 0, v: "determinado" }, { f: b + 22, v: "duda" }, { f: b + 36, v: "triste" }]}
        miradas={[{ f: 0, v: { x: -1, y: 0 } }, { f: b + 22, v: { x: -1, y: -0.2 } }, { f: b + 34, v: { x: 1, y: -0.1 } }]} />} />
  );
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, pol], [a, fuego], [b, holi]]} />
      <Casillas x={420} y={100} tam={50} desde={6} items={[{ t: "POLICE", f: 0, x: a - 10 }, { t: "FIRE HALL", f: a, x: b - 10 }, { t: "HOLIDAY", f: b, x: 140 }]} />
    </AbsoluteFill>
  );
};

// ---------- 19 · el surtidor anda (el display corre), el café está tibio: toca la jarra, retira la mano, mira la tienda vacía ----------
// v3: Theo lejos de los postes (a la izquierda del surtidor), sin contador en la zona del HUD; adentro: toca la jarra,
// se quema apenas, retira la mano, gira a la tienda vacía; el rótulo en la pared lisa de arriba.
export const P19Holiday: React.FC = () => {
  const f = useF();
  const k = kDe(77.54);
  const c = k(79.9);
  const SX = 650, TX = 470;
  const gal = lerp(f, 0, c - 4, 0.12, 3.06); // v4: el display ya corre desde el cuadro 0
  const pistola = (g: number) => ({ x: TX + 96, y: SUP_PISO - 150 - 5 * Math.sin(g / 9) });
  const surt = (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, 640, 640, 1.75), mira(c, 652, 640, 1.78)]} seed={19} setProps={{ hora: "dia", luces: 0 }}
      medio={<>
        <SurtidorGrande x={SX} piso={SUP_PISO} gal={gal} usd={gal * 3.19} manguera={f > 6 ? pistola(f) : null} />
        <Pj look={THEO} ruta={[{ f: 0, x: TX, y: SUP_PISO }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: k(79.2), v: "encogerse" }]}
          caras={[{ f: 0, v: "duda" }, { f: 24, v: "sorpresa" }, { f: k(79.2), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: 22, v: { x: 1, y: -0.25 } }, { f: k(79.2), v: { x: -0.4, y: 0 } }]}
          giros={[{ f: 0, v: 0 }, { f: k(79.2), v: 0.6 }]}
          ajuste={manoA({ look: THEO, x: TX, y: SUP_PISO, lado: "D", obj: pistola, peso: pesoIK(2, k(79.1), 8) })} />
      </>} />
  );
  const CX = TIENDA.cafe - 150;
  const jarra = { x: TIENDA.cafe - 30, y: TIENDA.piso - 226 - 70 };
  // v4: toca la jarra → retira la mano (quema) → se inclina y huele el vapor → se endereza con miedo y mira la tienda vacía
  const t2 = c + 20, h0 = c + 30, h1 = k(81.55);
  const toca = (g: number) => ({ x: jarra.x - 30 * rampa(g, t2, t2 + 6), y: jarra.y + 12 - 30 * rampa(g, t2, t2 + 6) });
  const tienda = (
    <Escena Set={Tienda} pal={PAL} claves={[mira(c, TIENDA.cafe - 120, 640, 1.7), mira(152, TIENDA.cafe - 105, 640, 1.73, { curva: "inout" })]} seed={191}
      medio={<>
        <Tibio x={jarra.x - 4} y={jarra.y - 70} w={120} f={f} o={rampa(f, c + 6, c + 20)} />
        <Pj look={THEO} ruta={[{ f: c, x: CX - 40, y: TIENDA.piso }, { f: c + 10, x: CX }]} dir={[{ f: 0, v: 1 }, { f: k(81.6), v: -1 }, { f: k(82.25), v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: t2, v: { hI: -10, cI: 20, hD: 20, cD: 120 } }, { f: h0, v: { tronco: 20, cabeza: 16, hD: 20, cD: 40, hI: -10, cI: 20 } }, { f: h1, v: "encogerse" }, { f: k(82.0), v: "manosCintura" }]}
          caras={[{ f: 0, v: "duda" }, { f: t2, v: "sorpresa" }, { f: h0 + 4, v: "cansado" }, { f: h1, v: "miedo" }, { f: k(82.1), v: "triste" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: t2, v: { x: 0.2, y: 0.5 } }, { f: h0, v: { x: 1, y: 0.2 } }, { f: h1, v: { x: -0.3, y: -0.1 } }, { f: k(81.6), v: { x: 1, y: 0 } }, { f: k(82.25), v: { x: 0.3, y: 0 } }]}
          giros={[{ f: 0, v: 0 }, { f: h1, v: 0.5 }, { f: k(82.25), v: 0.2 }]}
          ajuste={manoA({ look: THEO, x: (g) => lerp(g, c, c + 10, CX - 40, CX), y: TIENDA.piso, lado: "D", obj: toca, peso: pesoIK(c + 6, t2 + 2, 8) })} />
      </>} />
  );
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, surt], [c, tienda]]} />
      <Pilar lineas={[["PUMP", "STILL ON", "#7dff9a"], ["CASHIER", "0", "#ff6a5a"]]} x={760} y={100} tam={42} desde={k(78.6)} hasta={c} />
      <Pilar lineas={[["COFFEE", "STILL WARM", AMBAR], ["PEOPLE", "0", "#ff6a5a"]]} x={430} y={110} tam={42} desde={h0} />
    </AbsoluteFill>
  );
};

// ---------- 20 · esa noche: sentado a la mesa escribe en el cuaderno del alce → CENSUS, «1» ----------
export const P20Censo: React.FC = () => {
  const f = useF();
  const k = kDe(82.6);
  const ins = k(85.6);
  const MX = 2475, MY = LIV_PISO - 186, TX = 2350;
  const punta = (g: number) => ({ x: MX - 20 + 22 * Math.sin(g / 3) + ((g / 2) % 30), y: MY - 4 + 4 * Math.cos(g / 2.3) });
  const mesa = (
    <Empuje k={[{ f: 0, z: 1, x: 960, y: 540 }, { f: 20, z: 1, x: 960, y: 540 }, { f: ins, z: 1.35, x: 1000, y: 470 }]}>
      <Escena Set={Living} pal={PAL} claves={[mira(0, 2470, 640, 1.6), mira(ins, 2480, 640, 1.62)]} seed={20} setProps={{ hora: "noche", luces: 1, fuego: 0, vela: true, lena: 0, latas: 0.3, mantas: false, reglas: 0 }}
        medio={<>
          <Silla x={TX - 10} piso={LIV_PISO} />
          <Pj look={THEO_CASA} ruta={[{ f: 0, x: TX, y: LIV_PISO }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 58 }]} poses={[{ f: 0, v: "sentado" }]} luz={BORDE_CALIDO}
            caras={[{ f: 0, v: "cansado" }, { f: 30, v: "triste" }, { f: 62, v: "determinado" }]} miradas={[{ f: 0, v: { x: 0.4, y: 0.1 } }, { f: 28, v: { x: 1, y: 0.75 } }]} giros={[{ f: 0, v: 0.4 }, { f: 28, v: 0 }]} enManoD={<Lapiz />}
            ajuste={manoA({ look: THEO_CASA, x: TX, y: LIV_PISO, lado: "D", asiento: 58, obj: punta, peso: pesoIK(14),
              otra: manoA({ look: THEO_CASA, x: TX, y: LIV_PISO, lado: "I", asiento: 58, obj: () => ({ x: MX - 40, y: MY + 6 }), peso: () => 1 }) })} />
        </>} />
    </Empuje>
  );
  // v3: antes de abrir, la mano de Theo (manga naranja) entra, toca el alce de la tapa y lleva el dedo al borde para abrirla
  const m1 = k(86.6), m2 = k(87.9), m3 = k(88.9), m4 = k(89.6);
  const entra = rampa(f, m1 - 14, m1), sale = rampa(f, m4 - 2, m4 + 10);
  const hx = lerp(f, m2, m3, 1340, 1640) + (1 - entra) * 520 + sale * 600, hy = lerp(f, m2, m3, 640, 560) + (1 - entra) * 380 + sale * 300 - (f > m1 && f < m2 ? Math.max(0, Math.sin((f - m1) / 3)) * 14 : 0);
  const cuaderno = (
    <AbsoluteFill>
      <CuadernoEscribe abre={m4} lineas={[{ t: "CENSUS", desde: k(90.6), tam: 92, x: 1290, y: 290 }, { t: "1", desde: k(94.9), tam: 150, x: 1400, y: 470 }]} />
      {entra > 0 && sale < 1 && <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><ManoV3 x={hx} y={hy} ang={38} gesto={f < m2 + 6 ? "dedo" : "palma"} s={1.05} /></svg>}
    </AbsoluteFill>
  );
  return <Cortes en={[[-100, mesa], [ins, cuaderno]]} />;
};

// ---------- 21 · el cuaderno todavía existe: mesa de archivo, luz fría; una mano con guante blanco pasa la hoja → la 2 arrancada ----------
// v3: la mano es de archivista (manga azul + guante), la toma con pinza la esquina; rótulos en zonas lisas de la mesa.
export const P21Existe: React.FC = () => {
  const k = kDe(95.7);
  return (
    <AbsoluteFill>
      <CuadernoHoyV4 pasa={k(99.0)} zoom={k(100.6)} marca={k(101.6)} />
      <Pilar lineas={[["THE NOTEBOOK", "STILL EXISTS", AMBAR]]} x={960} y={110} centro tam={46} desde={k(95.9)} hasta={k(100.5)} />
      <Pilar lineas={[["PAGE 2", "TORN OUT", "#ff8a6a"]]} x={1330} y={930} centro tam={46} desde={k(101.4)} />
    </AbsoluteFill>
  );
};

// ---------- 22 · las luces no se apagan: los faroles se prenden en ola (fundidos), Theo la sigue con la cabeza y la señala ----------
// v3: sin parpadeos ni ventanas que saltan (las ventanas entran por Mezcla de 20 cuadros); Theo a ≥240 px de cada poste;
// claves de pose: camina → se frena → mira arriba y señala → cruza los brazos en «not on day one».
const FAROLES22 = [1760, 2200, 2700, 3150];
export const P22Luces: React.FC = () => {
  const f = useF();
  const k = kDe(103.44);
  const l0 = k(106.2);
  const TX = 2400;
  const on = (i: number) => rampa(f, l0 + i * 9, l0 + i * 9 + 10);
  const escena = (luces: number) => (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, 2720, 610, 1.2), mira(172, 2745, 610, 1.21, { curva: "inout" })]} seed={22} setProps={{ hora: "ocaso", luces, nieve: 0 }}
      medio={<>
        {FAROLES22.map((x, i) => <Farola key={x} x={x} piso={SUP_PISO + 30} on={on(i)} lado={i === 2 ? -1 : 1} />)}
        <Pj look={THEO} ruta={[{ f: 0, x: TX - 50, y: SUP_PISO }, { f: k(104.6), x: TX }]} dir={[{ f: 0, v: 1 }]} escala={1.3}
          poses={[{ f: 0, v: "parado" }, { f: k(104.7), v: "manosCintura" }, { f: l0 + 20, v: "señalar" }, { f: k(107.9), v: "brazosCruzados" }]}
          caras={[{ f: 0, v: "cansado" }, { f: k(104.5), v: "duda" }, { f: l0 + 2, v: "sorpresa" }, { f: k(107.3), v: "feliz" }, { f: k(107.9), v: "duda" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(104.7), v: { x: 0.3, y: -0.9 } }, { f: l0, v: { x: -0.9, y: -0.7 } }, { f: l0 + 9, v: { x: -0.4, y: -0.8 } }, { f: l0 + 18, v: { x: 0.4, y: -0.8 } }, { f: l0 + 27, v: { x: 1, y: -0.7 } }, { f: k(107.9), v: { x: 0.2, y: 0 } }]}
          giros={[{ f: 0, v: 0 }, { f: l0, v: 0.6 }, { f: l0 + 14, v: 0.2 }, { f: l0 + 27, v: 0 }, { f: k(107.9), v: 0.6 }]} />
      </>} />
  );
  return (
    <AbsoluteFill>
      <Mezcla a={escena(0)} b={escena(0.6)} t={rampa(f, k(106.9), k(107.6))} />
      <Pilar lineas={[["POWER", "STILL ON", "#7dff9a"]]} x={1260} y={100} tam={42} desde={k(106.6)} />
    </AbsoluteFill>
  );
};

// ---------- 23 · la red es automática: Theo lo explica → la cadena entera con rótulos DENTRO de cuadro → mapa → turbina → ciudad ----------
// v3: sin rótulos del set (TRANSMISSION salía cortado): pastillas propias en el «cielo» del esquema que entran cuando pasa
// el pulso; contadores arriba a la derecha (fuera de la zona del HUD); la ciudad se prende con fundido (Mezcla), sin saltos.
export const P23Represa: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const k = kDe(109.19);
  const m = k(114.3), c = k(119.4), d = k(121.5);
  const TX = -260;
  const theo = (
    <Pj look={THEO} ruta={[{ f: 0, x: TX, y: ESQ.piso }]} escala={2.2} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "hablar" }, { f: k(110.0), v: "señalar" }]}
      caras={[{ f: 0, v: "determinado" }, { f: k(110.4), v: "duda" }, { f: k(110.9), v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.2, y: 0 } }, { f: k(110.0), v: { x: 1, y: -0.2 } }, { f: k(110.9), v: { x: 0.3, y: 0 } }]} giros={[{ f: 0, v: 0.6 }, { f: k(110.0), v: 0 }, { f: k(110.9), v: 0.5 }]}
      habla={[[k(109.3), k(110.6)], [k(110.9), k(111.4)]]} />
  );
  const a2 = k(111.4);
  const explica = (
    <Escena Set={Esquema} pal={PAL} claves={[mira(0, 170, 560, 0.8), mira(a2, 182, 560, 0.8)]} seed={23} setProps={{ pulso: lerp(f, k(110.2), a2, 0, 0.35), ciudad: 0, marcas: 0 }} medio={theo} />
  );
  const cR = [mira(a2, 1690, 700, 0.57), mira(m, 1700, 700, 0.572)];
  const red = (
    <Escena Set={Esquema} pal={PAL} claves={cR} seed={233} setProps={{ pulso: lerp(f, a2 + 4, k(113.4), 0, 1), ciudad: 0, marcas: 0 }} />
  );
  // v4: turbina → ciudad en UNA toma: la cámara viaja por la línea con curva inout de 30 cuadros (antes: salto en 121,5)
  const theoC = (
    <Pj look={THEO} ruta={[{ f: 0, x: ESQ.ciudad + 600, y: ESQ.piso }]} escala={2.0} dir={[{ f: 0, v: -1 }]}
      poses={[{ f: 0, v: "parado" }, { f: k(122.3), v: "señalar" }, { f: k(122.85), v: "manosCintura" }]}
      caras={[{ f: 0, v: "sorpresa" }, { f: k(122.5), v: "feliz" }]} miradas={[{ f: 0, v: { x: -1, y: -0.3 } }, { f: k(122.85), v: { x: -0.2, y: 0 } }]} giros={[{ f: 0, v: 0 }, { f: k(122.85), v: 0.5 }]} />
  );
  const cT = [mira(c, 730, 640, 1.35), mira(k(121.1), 742, 640, 1.37), mira(k(122.1), 2300, 600, 0.75, { curva: "inout" }), mira(419, 2310, 600, 0.752)];
  const turbOn = (v: number) => <Escena Set={Esquema} pal={PAL} claves={cT} seed={231} setProps={{ pulso: 1, ciudad: v, marcas: 0 }} medio={theoC} />;
  const turb = <Mezcla a={turbOn(0.3)} b={turbOn(1)} t={rampa(f, k(122.1), k(122.7))} />;
  const theoM = (
    <AbsoluteFill><svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <Pj look={THEO} ruta={[{ f: 0, x: 1650, y: 1005 }]} escala={1.7} dir={[{ f: 0, v: -1 }]}
        poses={[{ f: 0, v: "hablar" }, { f: k(116.4), v: "señalar" }, { f: k(118.6), v: "manosCintura" }]}
        caras={[{ f: 0, v: "determinado" }, { f: k(116.6), v: "feliz" }, { f: k(118.6), v: "duda" }]}
        miradas={[{ f: 0, v: { x: 0.2, y: 0 } }, { f: k(116.4), v: { x: -1, y: -0.3 } }, { f: k(118.6), v: { x: -0.2, y: 0 } }]} giros={[{ f: 0, v: 0.5 }, { f: k(116.4), v: 0 }, { f: k(118.6), v: 0.5 }]}
        habla={[[m + 2, k(116.3)], [k(118.7), k(119.3)]]} />
    </svg></AbsoluteFill>
  );
  const dias = Math.floor(lerp(f, c + 10, d - 6, 0, 21));
  const rot = (t: string, X: number, desde: number) => <Pilar key={t} lineas={[[t, "", AMBAR]]} x={enPantalla(cR, a2, fps, X, 0).x} y={300} centro tam={34} desde={desde} hasta={m} />;
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, explica], [a2, red], [m, <AbsoluteFill><MapaRioV3 desde={m} pin1={k(116.6)} pin2={k(117.8)} />{theoM}</AbsoluteFill>], [c, turb]]} />
      <Pilar lineas={[["THE GRID", "RUNS ITSELF", AMBAR]]} x={1060} y={110} tam={46} desde={k(109.4)} hasta={a2} />
      {rot("HYDRO DAM", ESQ.represa + 60, a2 + 4)}
      {rot("TRANSMISSION", ESQ.torres[1], k(112.3))}
      {rot("SUBSTATION", ESQ.sub, k(112.9))}
      {rot("DULUTH", ESQ.ciudad + 120, k(113.5))}
      <Pilar lineas={[["WORKERS ON SHIFT", "0", "#ff6a5a"], ["GRID", "ONLINE ✓", "#7dff9a"]]} x={1230} y={110} tam={40} desde={a2 + 10} hasta={m} />
      <Pilar lineas={[["UNATTENDED", `${dias} DAYS`, AMBAR]]} x={1250} y={110} tam={48} desde={c + 6} hasta={k(121.3)} />
      <Pilar lineas={[["CITY", "STILL LIT", AMBAR]]} x={700} y={110} tam={48} desde={k(122.2)} />
    </AbsoluteFill>
  );
};

// ---------- 24 · semáforos para nadie (fundidos); al atardecer cada farol de Superior se prende en ola, a horario ----------
// v3: semáforo con fundidos de 8 cuadros; general de la ola ≤2 s; plano medio de Theo mirando el reloj: el farol de al lado
// se prende justo cuando el reloj pasa a 6:45. Sin ventanas que saltan (luces 0), sin parpadeos.
export const P24Semaforos: React.FC = () => {
  const f = useF();
  const k = kDe(123.17);
  const b = k(125.45), w2 = k(127.4), tic = k(128.4);
  // v4: la ola llega a Theo DENTRO de la toma 2 (antes era un general vacío); el farol de al lado se prende en el tic de 6:45 (toma 3)
  const OLA: [number, number, 1 | -1][] = [[700, 125.75, 1], [1000, 126.0, -1], [1400, 126.3, 1], [1760, 126.65, 1], [2200, 127.0, 1], [2700, 128.4, -1], [3150, 128.7, 1]];
  const faroles = OLA.map(([x, t, l]) => <Farola key={x} x={x} piso={SUP_PISO + 30} on={rampa(f, k(t), k(t) + 10)} lado={l} />);
  const sema = (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} claves={[mira(0, 3485, 650, 1.15), mira(b, 3505, 650, 1.16)]} seed={24} setProps={{ hora: "ocaso", luces: 0 }} frente={<CalleAutos xs={[]} y={AY} piso={SUP_PISO} />} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><SemaforoFundido x={1700} y={360} s={1.25} claves={[[-100, 0], [k(123.8), 2], [k(124.6), 1], [k(125.1), 0]]} /></svg>
      <Pilar lineas={[["CARS WAITING", "0", "#ff6a5a"]]} x={420} y={100} tam={48} desde={k(123.5)} />
    </AbsoluteFill>
  );
  const TX = 2450;
  const ola = (
    <Escena Set={Superior} pal={PAL} claves={[mira(b, 1950, 590, 1.0), mira(w2, 1975, 590, 1.01)]} seed={241} setProps={{ hora: "ocaso", luces: 0 }}
      medio={<>{faroles}
        <Pj look={THEO} ruta={[{ f: b, x: TX, y: SUP_PISO }]} escala={1.35} dir={[{ f: 0, v: -1 }]}
          poses={[{ f: 0, v: "manosCintura" }, { f: k(126.7), v: { tronco: -4, cabeza: -14 } }, { f: k(127.05), v: "encogerse" }]}
          caras={[{ f: 0, v: "cansado" }, { f: k(125.85), v: "duda" }, { f: k(127.05), v: "sorpresa" }]}
          miradas={[{ f: 0, v: { x: -1, y: -0.2 } }, { f: k(125.8), v: { x: -1, y: -0.5 } }, { f: k(126.35), v: { x: -0.6, y: -0.7 } }, { f: k(126.7), v: { x: -0.3, y: -0.9 } }, { f: k(127.05), v: { x: 0, y: -1 } }]}
          giros={[{ f: 0, v: 0 }, { f: k(127.05), v: 0.3 }]} />
      </>} />
  );
  const reloj = (g: number) => ({ x: TX + 50, y: SUP_PISO - 175 });
  const medio = (
    <Escena Set={Superior} pal={PAL} claves={[mira(w2, 2550, 590, 1.55), mira(200, 2562, 590, 1.56)]} seed={242} setProps={{ hora: "ocaso", luces: 0 }}
      medio={<>
        {faroles}
        <Pj look={THEO} ruta={[{ f: w2, x: TX, y: SUP_PISO }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: tic + 14, v: "señalar" }, { f: k(129.4), v: "brazosCruzados" }]}
          caras={[{ f: 0, v: "duda" }, { f: tic, v: "sorpresa" }, { f: k(129.4), v: "feliz" }]}
          miradas={[{ f: 0, v: { x: 0.6, y: 0.8 } }, { f: tic, v: { x: 1, y: -0.8 } }, { f: k(129.4), v: { x: 0.2, y: 0 } }]} giros={[{ f: 0, v: 0 }, { f: k(129.4), v: 0.5 }]}
          ajuste={manoA({ look: THEO, x: TX, y: SUP_PISO, lado: "I", obj: reloj, peso: pesoIK(w2 - 2, tic + 10, 8) })} />
      </>} />
  );
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, sema], [b, ola], [w2, medio]]} />
      {f >= w2 && <RelojDia min={18 * 60 + 44 + (f >= tic ? 1 : 0)} x={1340} y={100} desde={w2 + 2} tam={60} />}
      <Pilar lineas={[["ON", "SCHEDULE", AMBAR]]} x={820} y={100} tam={48} desde={tic + 6} />
    </AbsoluteFill>
  );
};

// ---------- 25 · día 3: sube al mirador agotado → la ciudad entera (≤2 s) → su cara → por encima del hombro: faroles, carteles,
// porches… salvo una ventana, que empieza a titilar (fundidos) y él la señala ----------
export const P25Colina: React.FC = () => {
  const f = useF();
  const k = kDe(129.83);
  const claves = [mira(0, 1618, 600, 0.8), mira(365, 1622, 600, 0.8)];
  const T1 = 1350;
  const cB = k(133.4), cC = k(135.3), cD = k(137.8), w0 = k(140.9);
  const E: { f: number; z: number; x?: number; y?: number }[] =
    f < cB ? [{ f: 0, z: 2.0, x: 600, y: 620 }, { f: cB, z: 2.0, x: 746, y: 620 }]
      : f < cC ? [{ f: 0, z: 1 }]
        : f < cD ? [{ f: 0, z: 3.0, x: 750, y: 545 }, { f: cD, z: 3.1, x: 750, y: 545 }]
          : f < w0 ? [{ f: 0, z: 2.2, x: 1010, y: 560 }, { f: w0, z: 2.26, x: 1030, y: 560 }]
            : [{ f: 0, z: 1.3, x: 1182, y: 560 }, { f: 365, z: 1.31, x: 1182, y: 560 }];
  const ventana = luzEn(f, [[-100, 1], [w0, 0.05], [w0 + 12, 1], [w0 + 24, 0.05], [w0 + 36, 1]], 8);
  const v = tras(E, f, 960 + (VENT_HOSP.x + 12 - 1618) * 0.8, 540 + (VENT_HOSP.y + 16 - 600) * 0.8);
  return (
    <AbsoluteFill>
      <Empuje k={E}>
        <Escena Set={Panorama} pal={PAL} claves={claves} seed={25} setProps={{ hora: "noche", luces: 1, ventana, nieve: 0.3 }}
          medio={<>
            {[k(130.6), k(131.5), k(132.4), k(133.0), k(136.2)].map((t, i) => <Aliento key={i} f={f} x={T1 + 30} y={P - 262} desde={t} />)}
            <Pj look={THEO_MOCHI} ruta={[{ f: 0, x: 1040, y: P - 6 }, { f: k(131.9), x: T1 }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO}
              poses={[{ f: 0, v: "parado" }, { f: k(131.9), v: "agacharse" }, { f: k(133.0), v: "parado" }, { f: k(138.0), v: "señalar" }, { f: k(139.5), v: "manosCintura" }, { f: k(140.5), v: "parado" }, { f: w0 + 2, v: "señalar" }]}
              caras={[{ f: 0, v: "cansado" }, { f: k(133.0), v: "sorpresa" }, { f: k(136.4), v: "feliz" }, { f: w0, v: "duda" }, { f: w0 + 14, v: "determinado" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(133.0), v: { x: 1, y: -0.2 } }, { f: cC, v: { x: 0.6, y: -0.1 } }, { f: k(136.4), v: { x: 1, y: -0.15 } }, { f: w0, v: { x: 1, y: -0.3 } }]}
              giros={[{ f: 0, v: 0 }, { f: cC, v: 0.45 }, { f: cD, v: 0 }]} />
          </>} />
      </Empuje>
      {f >= cD && <CirculoMano x={v.x} y={v.y} r={66} desde={w0 + 6} />}
      <Chip texto="STREET LIGHTS" icono="farol" x={360} y={110} tam={36} desde={k(137.95)} hasta={w0} />
      <Chip texto="SIGNS" icono="cartel" x={830} y={110} tam={36} desde={k(138.7)} hasta={w0} />
      <Chip texto="PORCH LIGHTS" icono="porche" x={1100} y={110} tam={36} desde={k(139.4)} hasta={w0} />
      <Pilar lineas={[["EXCEPT", "ONE WINDOW", AMBAR]]} x={760} y={110} tam={48} desde={w0 + 8} />
    </AbsoluteFill>
  );
};

// ---------- 26 · St. Mary's: fachada entera (rótulo dentro de cuadro), pocas luces: UNA ventana del 4º piso titila con fundidos;
// empuje lento hasta la ventana (on/off en la voz); en «flipping the switch by hand» pantalla partida ventana | mano ----------
// v3: la ventana es la ÚNICA viva del cuadro (resto 0,1), se prende/apaga con fundidos de 8 cuadros y tiene una silueta;
// sin los ON/OFF a mano que salían «CN/CFF».
const VSM = { x: 1170, y: 280 };
export const P26Ventana: React.FC = () => {
  const f = useF();
  const k = kDe(141.99);
  const sp = k(148.8);
  const toques = [k(149.0), k(149.65), k(150.3), k(150.9)];
  const cl: [number, number][] = [[-100, 0.75], [k(142.4), 1], [k(143.2), 0.05], [k(143.8), 1], [k(144.6), 0.05], [k(145.2), 1], [k(146.6), 0.05], [k(147.2), 1], [k(147.8), 0.05], [k(148.35), 1]];
  let on = 1;
  for (const t of toques) { on = 1 - on; cl.push([t + 2, on ? 1 : 0.05]); }
  const luz = luzEn(f, cl, 8);
  const claves = [mira(0, 1150, -150, 0.85), mira(281, 1152, -150, 0.85)];
  const v = { x: 960 + (VSM.x + 45 - 1150) * 0.85, y: 540 + (VSM.y + 50 + 150) * 0.85 };
  const E = [{ f: 0, z: 1 }, { f: k(143.0), z: 1, x: 960, y: 540 }, { f: k(146.0), z: 3.6, x: v.x, y: v.y }, { f: sp, z: 3.9, x: v.x, y: v.y }];
  const fachada = (
    <Empuje k={E}>
      <Escena Set={StMarys} pal={PAL} claves={claves} seed={26} setProps={{ hora: "noche", luces: 0, ventana: 0, nieve: 0 }}
        medio={<VentanaSM x={VSM.x} y={VSM.y} luz={luz} silueta={rampa(f, k(146.0), k(146.6))} />} />
    </Empuje>
  );
  return (
    <AbsoluteFill>
      {f < sp ? fachada : (
        <AbsoluteFill style={{ background: "#0e0c14" }}>
          <AbsoluteFill style={{ clipPath: "inset(0px 966px 0px 0px)" }}><AbsoluteFill style={{ transform: "translateX(-480px)" }}>{fachada}</AbsoluteFill></AbsoluteFill>
          <AbsoluteFill style={{ clipPath: "inset(0px 0px 0px 966px)" }}><AbsoluteFill style={{ transform: "translateX(560px) scale(0.92)", transformOrigin: "960px 540px" }}><ManoInterruptorV4 toques={toques} manga="#2f7f86" /></AbsoluteFill></AbsoluteFill>
          <div style={{ position: "absolute", left: 957, top: 0, width: 12, height: 1080, background: AMBAR, opacity: rampa(f, sp, sp + 8) }} />
        </AbsoluteFill>
      )}
      <Pilar lineas={[["4TH FLOOR", "", AMBAR]]} x={1300} y={110} tam={44} desde={k(142.0)} hasta={k(144.0)} />
      <Pilar lineas={[["BY", "HAND", AMBAR]]} x={1440} y={930} centro tam={46} desde={sp + 10} />
    </AbsoluteFill>
  );
};

// ---------- 27 · «somebody is»: la cara de June (GOLPE, cuadro entero, giro lento) → entre las camas vacías, tablilla en mano,
// levanta la sábana (PATIENTS 14 → 0) → apoya la palma: la cama está tibia; el monitor late con fundido (sin «beep» que parpadea) ----------
// v3: giro de cabeza de 24 cuadros (el lageo de 151,6), rótulos en el piso liso (nunca sobre camas, cortinas ni monitores).
export const P27June: React.FC = () => {
  const f = useF();
  const k = kDe(151.37);
  const b = k(152.25), c = k(159.85);
  const JX = 3050;
  const cara = (
    <Escena Set={Lobby} pal={PAL} claves={[mira(0, JX + 30, LOBBY_PISO - 270, 2.9), mira(b, JX + 34, LOBBY_PISO - 270, 2.94)]} seed={27} setProps={{ luces: 1, afuera: "noche" }}
      medio={<Pj look={JUNE} ruta={[{ f: 0, x: JX, y: LOBBY_PISO }]} dir={[{ f: 0, v: 1 }]} giros={[{ f: 0, v: -0.2 }, { f: 3, v: -0.2 }, { f: 27, v: 0.9 }]}
        caras={[{ f: 0, v: "miedo" }, { f: 20, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: 22, v: { x: 0, y: 0 } }]} />} />
  );
  const CAMA = 3350;
  const sab = (g: number) => ({ x: CAMA - 60 + 70 * rampa(g, k(155.6), k(156.6)), y: LOBBY_PISO - 172 - 120 * rampa(g, k(155.6), k(156.6)) * (1 - rampa(g, k(157.6), k(158.4))) });
  const xC = (g: number) => lerp(g, b, k(155.2), 2780, CAMA - 180);
  const camas = (
    <Escena Set={Lobby} pal={PAL} claves={[mira(b, 3380, 640, 1.2), mira(c, 3420, 640, 1.22)]} seed={271} setProps={{ luces: 1, afuera: "noche" }}
      medio={<>
        <Pj look={JUNE} ruta={[{ f: b, x: 2780, y: LOBBY_PISO }, { f: k(155.2), x: CAMA - 180 }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k(158.6), v: "encogerse" }]}
          caras={[{ f: 0, v: "cansado" }, { f: k(153.4), v: "duda" }, { f: k(156.7), v: "sorpresa" }, { f: k(157.6), v: "triste" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0.1 } }, { f: k(153.2), v: { x: 0.6, y: 0.9 } }, { f: k(154.4), v: { x: 1, y: 0 } }, { f: k(155.4), v: { x: 1, y: 0.7 } }, { f: k(158.6), v: { x: 0.3, y: 0 } }]}
          giros={[{ f: 0, v: 0 }, { f: k(158.6), v: 0.6 }]}
          enManoI={f < k(155.1) ? <Tablilla f={f} escribe={rampa(f, k(153.4), k(154.6))} /> : null}
          ajuste={manoA({ look: JUNE, x: xC, y: LOBBY_PISO, lado: "D", obj: sab, peso: pesoIK(k(155.3), k(158.5), 8),
            otra: manoA({ look: JUNE, x: xC, y: LOBBY_PISO, lado: "I", obj: (g) => ({ x: xC(g) + 50, y: LOBBY_PISO - 175 }), peso: pesoIK(k(152.9), k(155.0), 8) }) })} />
        <Sabana x={CAMA - 30} y={LOBBY_PISO - 170} px={sab(f).x} py={sab(f).y} />
      </>} />
  );
  const MX = CAMA + 215, MY = LOBBY_PISO - 370;
  const ult = (f - c + 300) % 30;
  const tibia = (
    <Escena Set={Lobby} pal={PAL} claves={[mira(c, CAMA + 20, 700, 1.85), mira(337, CAMA + 30, 700, 1.87)]} seed={272} setProps={{ luces: 1, afuera: "noche" }}
      medio={<>
        <rect x={MX - 52} y={MY - 34} width={104} height={64} rx={6} fill="#0c1a14" />
        <path d={`M${MX - 48},${MY} ${Array.from({ length: 24 }).map((_, i) => { const x = MX - 48 + i * 4; const t = (i * 4 + f * 3) % 96; return `L${x},${MY - (t > 40 && t < 48 ? 26 : t >= 48 && t < 52 ? -14 : 0)}`; }).join(" ")}`} stroke="#5aff9a" strokeWidth={3} fill="none" />
        <Halo x={MX} y={MY} r={70} color="#5aff9a" fuerza={0.6 * Math.exp(-ult / 7)} />
        <Pj look={JUNE} ruta={[{ f: c, x: CAMA - 150, y: LOBBY_PISO }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: k(162.0), v: "manosCara" }]}
          caras={[{ f: 0, v: "triste" }, { f: k(160.6), v: "duda" }, { f: k(161.5), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: -0.5 } }, { f: k(160.9), v: { x: 1, y: 0.7 } }, { f: k(162.0), v: { x: 0.2, y: 0 } }]}
          giros={[{ f: 0, v: 0 }, { f: k(162.0), v: 0.5 }]}
          ajuste={manoA({ look: JUNE, x: CAMA - 150, y: LOBBY_PISO, lado: "D", obj: () => ({ x: CAMA + 10, y: LOBBY_PISO - 176 }), peso: (g) => pesoIK(k(161.0), k(161.95), 8)(g) * (g < k(162.0) ? 1 : 0) })} />
        <Tibio x={CAMA + 30} y={LOBBY_PISO - 180} w={220} f={f} o={rampa(f, k(161.4), k(161.9))} />
      </>} />
  );
  const pac = Math.round(valorEn([{ f: 0, v: 14 }, { f: k(157.5), v: 14 }, { f: k(158.4), v: 0, d: 18 }], f).v);
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, cara], [b, camas], [c, tibia]]} />
      <Rotulo nombre="JUNE OKAFOR · 31" bajada="ER NURSE · ST. MARY'S" x={1000} y={880} desde={k(152.6)} hasta={k(156.6)} />
      <Pilar lineas={[["PATIENTS IN UNIT", String(pac), "#ff6a5a"]]} x={1000} y={905} tam={46} desde={k(157.0)} hasta={c} />
      <Pilar lineas={[["MONITORS", "STILL ON", "#5aff9a"]]} x={1160} y={930} tam={42} desde={c + 4} hasta={k(161.3)} />
      <Pilar lineas={[["BEDS", "STILL WARM", "#ffb27a"]]} x={1160} y={930} tam={42} desde={k(161.5)} />
    </AbsoluteFill>
  );
};

// ---------- 28 · se quedó tres días: lleva cajas a la cintura de la pila (bajo la pizarra) al mostrador; por las puertas
// de vidrio pasa día y noche (fundidos de 12 cuadros); la pizarra cuenta DAY 1 → 3 y al final dice dónde quedarse ----------
export const P28Quedo: React.FC = () => {
  const f = useF();
  const k = kDe(162.59);
  const c = k(167.3);
  const PILA = 600;
  const ida = [0, 16, 46, 62, 88, 100, 128, 141];
  const xs = [PILA + 170, PILA + 170, 1100, 1100, PILA + 170, PILA + 170, 1200, 1200];
  const xJ = (g: number) => { for (let i = 1; i < ida.length; i++) if (g < ida[i]) return lerp(g, ida[i - 1], ida[i], xs[i - 1], xs[i]); return xs[xs.length - 1]; };
  const dirJ = (g: number): 1 | -1 => (g < 16 ? -1 : g < 62 ? 1 : g < 100 ? -1 : 1);
  const lleva = (g: number) => (g >= 14 && g < 50) || (g >= 98 && g < 132);
  const puestas = (f >= 50 ? 1 : 0) + (f >= 132 ? 1 : 0);
  const dia = luzEn(f, [[-100, 0], [k(163.5), 1], [k(164.6), 0], [k(165.6), 1], [k(166.6), 0]], 12);
  const dias = f < k(163.5) ? 1 : f < k(165.6) ? 2 : 3;
  const pila = (
    <g>
      <g transform={`translate(${PILA - 60},${LOBBY_PISO})`}><Caja t="GAUZE" w={120} h={86} /></g>
      <g transform={`translate(${PILA + 70},${LOBBY_PISO})`}><Caja t="MEDS" w={120} h={86} color="#d8c098" /></g>
      <g transform={`translate(${PILA},${LOBBY_PISO - 86})`}><Caja t="SALINE" w={110} h={80} /></g>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${PILA - 255 + i * 50},${LOBBY_PISO})`}><rect x={-22} y={-80} width={44} height={80} rx={10} fill="#9fd0ff" opacity={0.75} stroke="#5a90c0" strokeWidth={3} /><rect x={-8} y={-94} width={16} height={16} fill="#2f6a8a" /></g>)}
    </g>
  );
  const escena = (afuera: "noche" | "dia") => (
    <Escena Set={Lobby} pal={PAL} claves={[mira(0, 860, 650, 1.45), mira(c, 875, 650, 1.47)]} seed={28} setProps={{ luces: 1, afuera, pizarra: `SUPPLIES OK\nDAY ${dias}`, trazo: 1 }}
      medio={<>
        <RelojPared x={1160} y={380} vel={60} f={f} r={60} />
        {pila}
        {puestas >= 1 && <g transform={`translate(1175,${LOBBY_PISO - 150})`}><Caja t="SALINE" w={92} h={70} /></g>}
        {puestas >= 2 && <g transform={`translate(1275,${LOBBY_PISO - 150})`}><Caja t="SALINE" w={92} h={70} /></g>}
        <Pj look={JUNE} ruta={ida.map((t, i) => (i === 0 ? { f: t, x: xs[i], y: LOBBY_PISO } : { f: t, x: xs[i] }))} dir={[{ f: 0, v: -1 }, { f: 16, v: 1 }, { f: 62, v: -1 }, { f: 100, v: 1 }]}
          poses={[{ f: 0, v: "agacharse" }, { f: 14, v: "parado" }, { f: 86, v: "agacharse" }, { f: 98, v: "parado" }]}
          caras={[{ f: 0, v: "cansado" }, { f: 60, v: "determinado" }, { f: 140, v: "cansado" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: 20, v: { x: 1, y: 0 } }, { f: 44, v: { x: 1, y: 0.5 } }, { f: 64, v: { x: 1, y: -0.2 } }]}
          enManoD={lleva(f) ? <Caja t="SALINE" w={92} h={70} /> : null}
          ajuste={manoA({ look: JUNE, x: xJ, y: LOBBY_PISO, dir: dirJ, lado: "D", obj: (g) => ({ x: xJ(g) + dirJ(g) * 70, y: (g >= 44 && g < 52) || (g >= 126 && g < 134) ? LOBBY_PISO - 150 : LOBBY_PISO - 108 }), peso: (g) => (lleva(g) ? 1 : 0),
            otra: manoA({ look: JUNE, x: xJ, y: LOBBY_PISO, dir: dirJ, lado: "I", obj: (g) => ({ x: xJ(g) + dirJ(g) * 62, y: LOBBY_PISO - 112 }), peso: (g) => (lleva(g) ? 1 : 0) }) })} />
      </>} />
  );
  const apila = <Mezcla a={escena("noche")} b={escena("dia")} t={dia} />;
  const pilaCerca = (
    <Escena Set={Lobby} pal={PAL} claves={[mira(c, 700, 640, 1.7), mira(202, 712, 640, 1.72)]} seed={281} setProps={{ luces: 1, afuera: "noche", pizarra: "", trazo: 1 }}
      medio={<>
        {/* v4: pizarra propia, más ancha, con el texto que siempre entra (antes «SUPPLIES ARE» se salía) */}
        <PizarraTexto x={430} y={380} w={420} h={235} lineas={["STAY WHERE", "THE SUPPLIES ARE"]} trazo={rampa(f, c + 4, c + 50, false)} tamMax={52} />
        {pila}
        <Pj look={JUNE} ruta={[{ f: c, x: 990, y: LOBBY_PISO }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, { f: c + 34, v: "brazosCruzados" }]}
          caras={[{ f: 0, v: "cansado" }, { f: c + 34, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: -0.6 } }, { f: c + 34, v: { x: 0.2, y: 0 } }]} giros={[{ f: 0, v: 0 }, { f: c + 34, v: 0.5 }]} />
      </>} />
  );
  return <Cortes en={[[-100, apila], [c, pilaCerca]]} />;
};

// ---------- 29 · cada noche prendía y apagaba esa luz: la mano en la tecla (manga verde agua) → la ventana desde afuera →
// June en el cuarto: apaga, prende, mira por la ventana, cansada → decidida ----------
// v3: todas las luces cambian con fundido (Mezcla de dos cuartos idénticos), mano de inserto con manga; nada de «feliz».
export const P29Interruptor: React.FC = () => {
  const f = useF();
  const a = 46, b = 92;
  const mano = <ManoInterruptorV4 toques={[10, 26, 42]} manga="#2f7f86" />;
  const fl = luzEn(f, [[-100, 1], [a + 18, 0.05], [a + 32, 1]], 10);
  const fachada = (
    <Escena Set={StMarys} pal={PAL} claves={[mira(a, 1215, 330, 1.6), mira(b, 1215, 326, 1.66)]} seed={29} setProps={{ hora: "noche", luces: 0, ventana: 0, nieve: 0 }}
      medio={<VentanaSM x={1170} y={280} luz={fl} silueta={1} />} />
  );
  const JX = 975;
  const toq = [b + 10, b + 24];
  const luz = luzEn(f, [[-100, 1], [toq[0], 0], [toq[1], 1]], 8);
  const cuarto = (l: number) => (
    <Escena Set={CuartoHosp} pal={PAL} claves={[mira(b, 1050, 640, 1.95), mira(139, 1060, 640, 1.98)]} seed={291} setProps={{ luz: l }}
      medio={<Pj look={JUNE} ruta={[{ f: b, x: JX, y: CUARTO.piso }]} dir={[{ f: 0, v: 1 }]} luz={l > 0.5 ? undefined : BORDE_FRIO}
        poses={[{ f: 0, v: "parado" }, { f: b + 36, v: "brazosCruzados" }]}
        caras={[{ f: 0, v: "cansado" }, { f: b + 28, v: "triste" }, { f: b + 38, v: "determinado" }]} miradas={[{ f: 0, v: { x: -0.4, y: 0.1 } }, { f: b + 28, v: { x: 1, y: -0.2 } }]} giros={[{ f: 0, v: 0.3 }, { f: b + 28, v: -0.7 }]}
        ajuste={manoA({ look: JUNE, x: JX, y: CUARTO.piso, lado: "I", obj: (g) => ({ x: CUARTO.interruptor + 4, y: CUARTO.piso - 215 + (Math.abs(g - toq[0]) < 4 ? 8 : 0) - (Math.abs(g - toq[1]) < 4 ? 8 : 0) }), peso: (g) => (g < b + 32 ? 1 : 1 - rampa(g, b + 32, b + 40)) })} />} />
  );
  return <Cortes en={[[-100, mano], [a, fachada], [b, <Mezcla a={cuarto(0)} b={cuarto(1)} t={luz} />]]} />;
};
