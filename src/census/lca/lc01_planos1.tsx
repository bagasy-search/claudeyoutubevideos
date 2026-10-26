// lc01 · planos 1-29 (0 → 173,9 s): cuadro 0 = la miniatura, «vos» despertando, la calle vacía, 8B → 2, Theo, el bus 6,
// Superior Street, el cuaderno CENSUS, la red que sigue prendida, la ventana que titila y June en St. Mary's.
// Vuelta 2 (rehechura): cada plano con personaje actuando + componente que lleva el concepto; la cámara grande
// (empujes) va por transform de pantalla (Empuje) para que el Plano no meta desenfoque de movimiento.
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { enPantalla, mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { Calendario, Contador, Globo, RelojDia, TextoMano, valorEn, F_HUD } from "../../anikit/pantalla";
import { Taza } from "../../anikit/props";
import { Cocina, Silla } from "../../anikit/sets/cocina";
import { Look } from "../../anikit/personaje";
import { AMBAR, BORDE_CALIDO, BORDE_FRIO, JUNE, JUNE_MOCHI, PAL, THEO, THEO_CASA, THEO_MOCHI } from "../elenco";
import { Panorama, PANO_PISO, VENT_HOSP } from "../mundo/panorama";
import { Superior, SUP_AUTOS, SUP_PISO, SUP_PUNTOS } from "../mundo/superior";
import { Barrio, BARRIO_PISO, Living, LIV_PISO } from "../mundo/casa";
import { Lobby, LOBBY_PISO, StMarys, SM_PUNTOS } from "../mundo/hospital";
import { Ore } from "../mundo/ore";
import { CuadernoGrande, fmtN, kDe, Lapiz, Pj, Rotulo } from "./base";
import {
  Bandada, BancoCafe, Cafetera, Caja, Checklist, CirculoMano, Cortes, CUARTO, CuadernoEscribe, CuadernoHoy, CuartoHosp, DUP, DuplexCorte, Empuje, ESQ, Esquema,
  Giro, InteriorAuto, Interruptor, manoA, ManoInterruptor, MapaRio, Multitud, OlaFarolas, ParedCocina, PARED_PISO, pesoIK, RadioVieja, rampa, Rejilla, RelojArena,
  RelojPared, Sabana, SemaforoGrande, SemPeaton, SurtidorGrande, Tarjeta, TheoCama, Tibio, Tienda, TIENDA, tras, VentanaInterior, Volador,
} from "./lc01_planos1_comp";

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
export const P01Mini: React.FC = () => {
  const f = useF();
  const T = 1290, J = 1440;
  return (
    <Escena Set={Panorama} pal={PAL} claves={[mira(0, 1640, 620, 1.2), mira(36, 1648, 620, 1.22)]} seed={1}
      setProps={{ hora: "ocaso", luces: 0, ventana: 1, nieve: 1, vapor: 0.6, puenteLuz: 0.3 }}
      medio={<>
        <Pj look={THEO_MOCHI} ruta={[{ f: 0, x: T, y: P - 6 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: -0.15 } }]} luz={BORDE_CALIDO}
          ajuste={manoA({ look: THEO_MOCHI, x: T, y: P - 6, lado: "D", obj: () => ({ x: T + 70, y: P - 128 }), peso: () => 1 })} />
        <Pj look={JUNE_MOCHI} ruta={[{ f: 0, x: J, y: P - 6 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: -0.1 } }, { f: 20, v: { x: -1, y: 0 } }]} giros={[{ f: 0, v: 0 }, { f: 20, v: -0.5 }]} luz={BORDE_CALIDO} seed={2}
          ajuste={manoA({ look: JUNE_MOCHI, x: J, y: P - 6, lado: "I", obj: () => ({ x: J + 40, y: P - 128 }), peso: () => 1 })} />
        <Aliento f={f} x={T + 14} y={P - 250} desde={6} />
      </>} />
  );
};

// ---------- 2 · «vos» te despertás: de la taza a la cara, bostezo, primer sorbo ----------
export const P02Despierta: React.FC = () => {
  const f = useF();
  const X = 2300, Y = COCINA_Y;
  const taza = (g: number) => {
    const a = { x: X + 84, y: 704 }, b = { x: X + 26, y: 612 };
    const u = rampa(g, 92, 108) * (1 - rampa(g, 122, 136));
    return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
  };
  return (
    <AbsoluteFill>
      <Empuje k={[{ f: 0, z: 1.45, x: 1010, y: 640 }, { f: 34, z: 1.45, x: 1010, y: 640 }, { f: 84, z: 1, x: 960, y: 540 }]}>
        <Escena Set={Cocina} pal={PAL} claves={[mira(0, 2400, 650, 1.9), mira(157, 2420, 640, 1.9)]} seed={2}
          medio={<>
            <g transform={`translate(2560,584) scale(1.3)`}><Cafetera f={f} /></g>
            <Pj look={VOS} ruta={[{ f: 0, x: X, y: Y }]} escala={1.3} dir={[{ f: 0, v: 1 }]} seed={4}
              poses={[{ f: 0, v: "parado" }]}
              caras={[{ f: 0, v: "cansado" }, { f: 116, v: "feliz" }]} habla={[[48, 76]]}
              miradas={[{ f: 0, v: { x: 0.5, y: 0.7 } }, { f: 46, v: { x: 0.3, y: -0.6 } }, { f: 80, v: { x: 1, y: 0.2 } }, { f: 130, v: { x: 1, y: 0 } }]}
              enManoD={<Taza vapor={1} f={f} />}
              ajuste={manoA({ look: VOS, x: X, y: Y, esc: 1.3, lado: "D", obj: taza, peso: () => 1 })} />
          </>} />
      </Empuje>
    </AbsoluteFill>
  );
};
const COCINA_Y = 940;

// ---------- 3 · prende la radio (clic) y se calienta las manos en la rejilla ----------
export const P03Radio: React.FC = () => {
  const f = useF();
  const X = 2400, Y = COCINA_Y, RX = 2470;
  const on = f >= 14 ? 1 : 0;
  const radio = (
    <Escena Set={Cocina} pal={PAL} claves={[mira(0, 2440, 660, 2.1), mira(32, 2450, 660, 2.12)]} seed={3}
      medio={<>
        <g transform={`translate(${RX},584)`}><RadioVieja f={f} on={on} perilla={interpolate(f, [8, 14], [-40, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} /></g>
        <Pj look={VOS} ruta={[{ f: 0, x: X, y: Y }]} escala={1.3} dir={[{ f: 0, v: 1 }]} seed={4}
          caras={[{ f: 0, v: "cansado" }, { f: 16, v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }]}
          ajuste={manoA({ look: VOS, x: X, y: Y, esc: 1.3, lado: "D", obj: () => ({ x: RX + 48, y: 550 }), peso: (g) => rampa(g, 0, 10) * (1 - rampa(g, 20, 30)) })} />
      </>} />
  );
  const RJ = 1000, Q = PARED_PISO;
  const manos = (g: number) => ({ x: RJ + 20 + 6 * Math.sin(g / 5), y: Q - 120 });
  const rejilla = (
    <Escena Set={ParedCocina} pal={PAL} claves={[mira(30, 1060, 640, 1.55), mira(83, 1070, 650, 1.6)]} seed={33}
      medio={<>
        <g transform={`translate(${RJ},${Q - 60})`}><Rejilla f={f} on={rampa(f, 32, 44)} w={260} /></g>
        <Pj look={VOS} ruta={[{ f: 0, x: RJ + 180, y: Q }]} dir={[{ f: 0, v: -1 }]} escala={1.3} seed={4}
          poses={[{ f: 0, v: "agacharse" }]} caras={[{ f: 0, v: "cansado" }, { f: 46, v: "feliz" }]} miradas={[{ f: 0, v: { x: -1, y: 0.4 } }]}
          ajuste={manoA({ look: VOS, x: RJ + 180, y: Q, esc: 1.3, dir: -1, lado: "D", obj: manos, peso: () => 1, otra: manoA({ look: VOS, x: RJ + 180, y: Q, esc: 1.3, dir: -1, lado: "I", obj: (g) => ({ x: RJ + 70 + 6 * Math.sin(g / 5 + 1), y: Q - 100 }), peso: () => 1 }) })} />
      </>} />
  );
  return <Cortes en={[[-100, radio], [30, rejilla]]} />;
};

// ---------- 4 · «outside your window»: desde adentro, empuje a través del vidrio a Superior vacía ----------
export const P04Calle: React.FC = () => {
  const f = useF();
  const k = kDe(9.18);
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} claves={[mira(0, 1500, 560, 0.95), mira(176, 1880, 560, 1.0)]} seed={4} setProps={{ hora: "dia", luces: 0.05, nieve: 0 }}
        medio={<>
          <Volador f={f} f0={60} f1={176} x0={1250} y0={760} x1={2350} y1={700} tipo="bolsa" s={1.3} />
          <Volador f={f} f0={20} f1={150} x0={1100} y0={820} x1={2050} y1={860} s={1.2} />
          <Bandada f={f} x0={900} y0={260} vx={5} n={6} />
        </>} />
      <VentanaInterior e0={34} e1={92}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <Pj look={VOS} ruta={[{ f: 0, x: 470, y: 1300 }]} escala={2.7} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} giros={[{ f: 0, v: -0.3 }]} seed={4} luz={BORDE_FRIO}
            poses={[{ f: 0, v: "brazosCruzados" }]} />
        </svg>
      </VentanaInterior>
      <Marcador lineas={[["PEOPLE OUTSIDE", "0", "#ff6a5a"]]} x={1180} y={70} tam={62} desde={k(13.4)} />
    </AbsoluteFill>
  );
};

// ---------- 5 · la vereda: el peatonal da WALK para nadie, un café en el banco y una correa tirada ----------
export const P05Vereda: React.FC = () => {
  const f = useF();
  return (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, 1400, 770, 1.6), mira(40, 1430, 770, 1.62)]} seed={5} setProps={{ hora: "dia", luces: 0.05 }}
      medio={<>
        <rect x={1146} y={560} width={10} height={70} fill="#1a1620" />
        <SemPeaton x={1200} y={610} walk={f >= 12} />
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
    <Escena Set={Superior} pal={PAL} claves={[mira(0, 2250, SUP_PISO - 60, 1.9), mira(35, 2295, SUP_PISO - 60, 1.9)]} seed={6} setProps={{ hora: "dia", luces: 0.05 }}
      frente={<Giro x={gx} y={gy} f={f} />} />
  );
};

// ---------- 7 · la ciudad entera de día, sin nadie: tirón hacia atrás, pájaros ----------
export const P07Ciudad: React.FC = () => {
  const f = useF();
  return (
    <Empuje k={[{ f: 0, z: 1.7, x: 1180, y: 520 }, { f: 37, z: 1, x: 960, y: 540 }]}>
      <Escena Set={Panorama} pal={PAL} claves={[mira(0, 2050, 560, 0.8), mira(37, 2050, 560, 0.8)]} seed={7} setProps={{ hora: "dia", luces: 0, nieve: 0, vapor: 0 }}
        medio={<Bandada f={f} x0={1500} y0={280} vx={6} n={9} s={1.2} />} />
    </Empuje>
  );
};

// ---------- 8 · 8,000,000,000 → 2: la multitud se apaga en ola hasta que quedan dos ----------
export const P08Ocho: React.FC = () => {
  const k = kDe(18.76);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 70%, #2a2238 0%, #0d0b14 75%)" }}>
      <Multitud a={k(19.6)} b={k(21.4)} zoomF={k(22.2)} />
      <NumeroGrande claves={[{ f: 0, v: 8000000000 }, { f: k(19.6), v: 8000000000 }, { f: k(21.4), v: 2, d: 30 }]} rotulo="PEOPLE ON EARTH" y={110} hasta={k(22.4)} />
    </AbsoluteFill>
  );
};

// ---------- 9 · la pregunta: June gira hacia Theo, él exhala vapor, se cruza de brazos; ¿cuánto durarían? ----------
export const P09Pregunta: React.FC = () => {
  const f = useF();
  const k = kDe(23.14);
  const T = 560, J = 720;
  return (
    <AbsoluteFill>
      <Empuje k={[{ f: 0, z: 2.0, x: 600, y: 600 }, { f: k(26.6), z: 2.0, x: 610, y: 600 }, { f: k(29.0), z: 1, x: 960, y: 540 }]}>
        <Escena Set={Panorama} pal={PAL} claves={[mira(0, 1100, 560, 0.85), mira(188, 1110, 560, 0.85)]} seed={9} setProps={{ hora: "noche", luces: 1, nieve: 0.8, vapor: 0.5 }}
          medio={<>
            <Pj look={THEO_MOCHI} ruta={[{ f: 0, x: T, y: P - 6 }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO}
              poses={[{ f: 0, v: "parado" }, { f: k(26.0), v: "brazosCruzados" }]} caras={[{ f: 0, v: "determinado" }, { f: k(24.9), v: "triste" }, { f: k(27.6), v: "duda" }]}
              miradas={[{ f: 0, v: { x: 1, y: -0.1 } }, { f: k(27.4), v: { x: 1, y: -0.5 } }]} habla={[[k(24.8), k(25.6)]]} />
            <Pj look={JUNE_MOCHI} ruta={[{ f: 0, x: J, y: P - 6 }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO} seed={2}
              caras={[{ f: 0, v: "neutral" }, { f: k(23.4), v: "miedo" }, { f: k(27.6), v: "triste" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(23.4), v: { x: -1, y: 0 } }, { f: k(27.4), v: { x: 1, y: -0.4 } }]} giros={[{ f: 0, v: 0 }, { f: k(23.4), v: -0.6 }, { f: k(27.4), v: 0 }]}
              poses={[{ f: 0, v: "parado" }, { f: k(27.6), v: "encogerse" }]} />
            <Aliento f={f} x={T + 14} y={P - 256} desde={k(25.0)} />
            <Aliento f={f} x={J - 14} y={P - 256} desde={k(26.4)} dir={-1} />
          </>} />
      </Empuje>
      <RelojArena x={1450} y={330} desde={k(27.3)} s={1.1} />
    </AbsoluteFill>
  );
};

// ---------- 10 · no en una película: comida real, inviernos reales, cuentas reales ----------
export const P10Real: React.FC = () => {
  const f = useF();
  const k = kDe(29.4);
  const tR = [{ f: 0, x: 1380, y: SUP_PISO }, { f: 179, x: 1900 }];
  const jR = [{ f: 0, x: 1230, y: SUP_PISO }, { f: 179, x: 1740 }];
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} claves={[mira(0, 1620, 580, 0.9), mira(179, 1880, 580, 0.9)]} seed={10} setProps={{ hora: "invierno", luces: 0, nieve: 1, cae: true }}
        medio={<>
          <Pj look={JUNE_MOCHI} ruta={jR} seed={2} caras={[{ f: 0, v: "cansado" }, { f: k(33.6), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(30.9), v: { x: 1, y: -0.8 } }, { f: k(33.6), v: { x: 1, y: 0 } }]}
            poses={[{ f: 0, v: "parado" }, { f: k(31.9), v: "brazosCruzados" }]} habla={[[k(33.8), k(34.8)]]} />
          <Pj look={THEO_MOCHI} ruta={tR} caras={[{ f: 0, v: "determinado" }, { f: k(31.9), v: "cansado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(32.2), v: { x: 1, y: -0.7 } }, { f: k(33.8), v: { x: -1, y: 0 } }]}
            poses={[{ f: 0, v: "parado" }, { f: k(31.9), v: "encogerse" }]} />
          <Aliento f={f} x={1380 + (520 * f) / 179 + 14} y={SUP_PISO - 250} desde={k(32.1)} />
        </>} />
      <Tarjeta x={560} y={36} desde={k(29.6)} icono="claqueta" texto="NOT A MOVIE" tacha={k(30.3)} color="#ff6a5a" />
      <Tarjeta x={900} y={36} desde={k(30.9)} icono="lata" texto="REAL FOOD" />
      <Tarjeta x={1240} y={36} desde={k(31.9)} icono="termo" texto="REAL WINTERS" color="#8fd3ff" />
      <Tarjeta x={1580} y={36} desde={k(33.5)} icono="cuenta" texto="REAL MATH" />
    </AbsoluteFill>
  );
};

// ---------- 11 · «let's count it»: la tapa empieza a abrirse ----------
export const P11Cuenta: React.FC = () => <CuadernoGrande tapa abre={10} zoom={[0, 1.1, 1.2]} />;

// ---------- 12 · 3:12 a.m., 3 de octubre: el que paseaba al perro desaparece sin ruido; Theo duerme ----------
export const P12Hora: React.FC = () => {
  const f = useF();
  const k = kDe(36.18);
  const ya = k(39.9);
  const vx = (g: number) => lerp(g, 0, ya, 1500, 1700);
  const ox = (g: number) => (g < ya ? vx(g) + 120 : vx(ya) + 120 + 30 * rampa(g, ya, ya + 12));
  const calle = (
    <Escena Set={Barrio} pal={PAL} claves={[mira(0, 1640, 640, 1.35), mira(k(40.6), 1680, 640, 1.38)]} seed={12} setProps={{ hora: "noche", luces: 0.15, nieve: 0 }}
      medio={<>
        {f < ya ? <path d={`M${vx(f) + 22},${BARRIO_PISO - 112} Q${vx(f) + 80},${BARRIO_PISO - 60} ${ox(f) + 36},${BARRIO_PISO - 56}`} stroke="#c0352c" strokeWidth={4} fill="none" />
          : <path d={`M${vx(ya) + 10},${BARRIO_PISO - 2} Q${vx(ya) + 60},${BARRIO_PISO + 4} ${ox(f) + 36},${BARRIO_PISO - 56 + 40 * rampa(f, ya, ya + 8)}`} stroke="#c0352c" strokeWidth={4} fill="none" />}
        <Ore x={ox(f)} y={BARRIO_PISO} dir={f < ya + 16 ? 1 : -1} f={f} cola={f < ya ? 1 : 0.2} cabeza={f > ya + 20 ? -0.4 : 0} s={0.7} />
        <Pj look={PASEA} ruta={[{ f: 0, x: 1500, y: BARRIO_PISO }, { f: ya, x: 1700 }]} seed={7} opacidad={(g) => (g < ya ? 1 : 0)} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 1, y: 0.4 } }]}
          ajuste={manoA({ look: PASEA, x: vx, y: BARRIO_PISO, lado: "D", obj: (g) => ({ x: vx(g) + 26, y: BARRIO_PISO - 112 }), peso: () => 1 })} />
      </>} />
  );
  const cama = (
    <Escena Set={DuplexCorte} pal={PAL} claves={[mira(k(40.6), 640, 700, 1.5), mira(183, 660, 700, 1.52)]} seed={121} setProps={{ alba: 0, celular: 0 }}
      medio={<TheoCama x={DUP.cama} piso={DUP.piso} f={f} vuelta={0} />} />
  );
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, calle], [k(40.6), cama]]} />
      <RelojDia min={3 * 60 + 11 + (f >= k(38.3) ? 1 : 0)} x={820} y={60} desde={k(36.4)} tam={64} />
      <Calendario texto="OCT 3" x={1440} y={70} desde={k(36.8)} />
    </AbsoluteFill>
  );
};

// ---------- 13 · Theo Lindgren, 34, liniero: se da vuelta, se sienta, se pone el gorro; la otra mitad, en silencio ----------
export const P13Theo: React.FC = () => {
  const f = useF();
  const k = kDe(42.28);
  const sienta = k(45.6), para = k(47.0), gorro = k(48.0);
  const TX = DUP.cama + 60;
  // pantalla: mundo (x,y) → (960+(x-1220)*0.85, 540+(y-600)*0.85)
  return (
    <AbsoluteFill>
      <Empuje k={[{ f: 0, z: 1.7, x: 520, y: 700 }, { f: k(48.6), z: 1.7, x: 590, y: 690 }, { f: k(50.2), z: 1, x: 960, y: 540 }]}>
        <Escena Set={DuplexCorte} pal={PAL} claves={[mira(0, 1220, 600, 0.85), mira(253, 1225, 600, 0.85)]} seed={13} setProps={{ alba: lerp(f, 0, 250, 0.3, 0.9), celular: 1 }}
          medio={<>
            <TheoCama x={DUP.cama} piso={DUP.piso} f={f} vuelta={rampa(f, k(43.6), k(44.6))} vacia={f >= sienta} destapa={f >= sienta ? 1 : 0} />
            {f >= sienta && <Pj look={f < gorro + 8 ? THEO_CASA : THEO} ruta={[{ f: sienta, x: TX - 160, y: DUP.piso }, { f: para, x: TX - 160 }, { f: para + 30, x: TX + 120 }]} dir={[{ f: 0, v: 1 }]}
              asiento={[{ f: 0, v: 104 }, { f: para, v: 104 }, { f: para + 10, v: undefined }]}
              poses={[{ f: 0, v: "sentado" }, { f: para, v: "parado" }]} caras={[{ f: 0, v: "cansado" }, { f: gorro + 10, v: "determinado" }, { f: k(49.3), v: "duda" }]}
              miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(49.3), v: { x: 1, y: 0 } }]} habla={[[k(46.0), k(46.6)]]}
              ajuste={manoA({ look: THEO, x: (g) => (g < para ? TX - 160 : lerp(g, para, para + 30, TX - 160, TX + 120)), y: DUP.piso, lado: "D", obj: (g) => ({ x: (g < para + 30 ? TX + 120 : TX + 120) + 6, y: DUP.piso - 300 + 10 * rampa(g, gorro, gorro + 8) }), peso: pesoIK(gorro - 6, gorro + 14, 8),
                otra: manoA({ look: THEO, x: (g) => (g < para ? TX - 160 : lerp(g, para, para + 30, TX - 160, TX + 120)), y: DUP.piso, lado: "I", obj: () => ({ x: TX + 110, y: DUP.piso - 300 }), peso: pesoIK(gorro - 6, gorro + 14, 8) }) })} />}
          </>} />
      </Empuje>
      <Rotulo nombre="THEO LINDGREN · 34" bajada="LINEMAN · MINNESOTA POWER" x={1100} y={120} desde={k(42.8)} hasta={k(47.6)} />
      <Cartel texto="THE OTHER HALF: QUIET" x={1440} y={140} desde={k(49.6)} />
    </AbsoluteFill>
  );
};

// ---------- 14 · el bus 6 no llega: mira la calle dos veces, el reloj, golpea el pie ----------
export const P14Bus: React.FC = () => {
  const f = useF();
  const k = kDe(50.7);
  const X = 740;
  const min = 6 * 60 + 40 + Math.floor(lerp(f, k(53.7), k(58.2), 0, 18));
  const tarde = Math.max(0, min - 400);
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} claves={[mira(0, 860, 640, 1.55), mira(k(57), 840, 660, 1.8, { curva: "inout" })]} seed={14} setProps={{ hora: "alba", luces: 0.1 }}
        medio={<Pj look={THEO} ruta={[{ f: 0, x: X, y: BARRIO_PISO }]}
          dir={[{ f: 0, v: 1 }, { f: k(52.0), v: -1 }, { f: k(53.4), v: 1 }, { f: k(54.9), v: -1 }, { f: k(55.9), v: 1 }]}
          poses={[{ f: 0, v: "parado" }, { f: k(55.9), v: "parado" }, { f: k(57.2), v: "manosCintura" }]}
          caras={[{ f: 0, v: "neutral" }, { f: k(54.9), v: "duda" }, { f: k(57.2), v: "enojo" }, { f: k(57.8), v: "duda" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(52.0), v: { x: 1, y: -0.1 } }, { f: k(55.9), v: { x: 0.2, y: 0.8 } }, { f: k(56.9), v: { x: 0, y: 0 } }]}
          giros={[{ f: 0, v: 0 }, { f: k(57.6), v: 0.9 }]}
          ajuste={(p0, g) => {
            const p = manoA({ look: THEO, x: X, y: BARRIO_PISO, lado: "I", obj: () => ({ x: X + 50, y: BARRIO_PISO - 190 }), peso: pesoIK(k(55.9), k(57.0), 6) })(p0, g);
            const tap = g > k(56.2) && g < k(57.4) ? Math.max(0, Math.sin((g - k(56.2)) / 2.2)) * 18 : 0;
            return { ...p, rD: p.rD - tap };
          }} />} />
      <RelojDia min={min} x={1540} y={60} desde={k(53.5)} tam={52} />
      <Contador lineas={[{ etiqueta: "BUS 6 DUE", claves: "6:40", color: AMBAR }, { etiqueta: "LATE", claves: `+${tarde} MIN`, color: tarde > 0 ? "#ff6a5a" : "#8fe08a" }]} x={70} y={150} tam={46} alinear="der" desde={k(54.0)} />
    </AbsoluteFill>
  );
};

// ---------- 15 · baja a Superior: se frena, mira los autos llenos de nada, apoya la mano en un techo ----------
const AUTO15 = SUP_AUTOS.filter((a) => a.x > 1150 && a.x < 1500)[0] ?? SUP_AUTOS[6];
export const P15Superior: React.FC = () => {
  const k = kDe(58.36);
  const para = k(61.0);
  const stop = AUTO15.x - 190;
  const x = (g: number) => lerp(g, 0, para, stop - 380, stop);
  const Y = SUP_PISO + 230;
  return (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, AUTO15.x - 420, 820, 1.3), mira(155, AUTO15.x - 300, 820, 1.32)]} seed={15} setProps={{ hora: "dia", luces: 0.05 }}
      frente={<Pj look={THEO} ruta={[{ f: 0, x: stop - 380, y: Y }, { f: para, x: stop }]} dir={[{ f: 0, v: 1 }]}
        caras={[{ f: 0, v: "duda" }, { f: k(61.4), v: "miedo" }, { f: k(62.6), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: para, v: { x: 1, y: 0.6 } }, { f: k(62.6), v: { x: -0.2, y: -0.2 } }]}
        giros={[{ f: 0, v: 0 }, { f: k(62.6), v: 0.6 }]}
        ajuste={manoA({ look: THEO, x, y: Y, lado: "D", obj: (g) => ({ x: AUTO15.x - 60 + 14 * Math.sin(g / 8), y: SUP_PISO + 190 - 118 }), peso: pesoIK(k(61.4), 1e9, 10) })} />} />
  );
};

// ---------- 16 · motores apagados, puertas cerradas: se asoma a la ventanilla → la campera doblada ----------
const AUTO16 = SUP_AUTOS.filter((a) => a.x > 2000 && a.x < 2400)[0] ?? SUP_AUTOS[9];
export const P16Campera: React.FC = () => {
  const k = kDe(63.52);
  const X = AUTO16.x - 40, Y = SUP_PISO + 240;
  const asomo = (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, AUTO16.x - 260, 860, 1.6), mira(k(66.3), AUTO16.x - 240, 850, 1.65)]} seed={16} setProps={{ hora: "dia", luces: 0.05 }}
      frente={<Pj look={THEO} ruta={[{ f: 0, x: X - 200, y: Y }, { f: 40, x: X }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: "parado" }, { f: 44, v: "pensar" }]} caras={[{ f: 0, v: "duda" }, { f: k(65.3), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: 44, v: { x: 1, y: 0.7 } }]}
        ajuste={manoA({ look: THEO, x: (g) => lerp(g, 0, 40, X - 200, X), y: Y, lado: "I", obj: () => ({ x: X + 70, y: SUP_PISO + 190 - 96 }), peso: pesoIK(50) })} />} />
  );
  return <Cortes en={[[-100, asomo], [k(66.3), <InteriorAuto e0={k(66.3)} mano={k(68.9)} />]]} />;
};

// ---------- 17 · camina una hora; ahueca las manos y grita HELLO?! (eco) ----------
export const P17Grita: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const k = kDe(70.22);
  const g0 = k(71.9);
  const X1 = 1960;
  const claves = [mira(0, 1800, 680, 1.3), mira(74, 1960, 680, 1.3)];
  const E = [{ f: 0, z: 1 }, { f: g0 - 4, z: 1 }, { f: g0 + 8, z: 1.45, x: tX(enPantalla(claves, g0, fps, X1 + 20, SUP_PISO - 250).x), y: 520 }];
  const boca = enPantalla(claves, f, fps, X1 + 24, SUP_PISO - 250);
  const b = tras(E, f, boca.x, boca.y);
  return (
    <AbsoluteFill>
      <Empuje k={E}>
        <Escena Set={Superior} pal={PAL} claves={claves} seed={17} setProps={{ hora: "dia", luces: 0.05 }}
          medio={<Pj look={THEO} ruta={[{ f: 0, x: 1640, y: SUP_PISO }, { f: k(71.6), x: X1 }]}
            caras={[{ f: 0, v: "cansado" }, { f: g0 - 6, v: "determinado" }, { f: g0, v: "sorpresa" }]} habla={[[g0, k(72.7)]]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: g0, v: { x: 1, y: -0.3 } }]}
            ajuste={manoA({ look: THEO, x: (g) => lerp(g, 0, k(71.6), 1640, X1), y: SUP_PISO, lado: "D", obj: () => ({ x: X1 + 34, y: SUP_PISO - 246 }), peso: pesoIK(g0 - 6, 1e9, 6),
              otra: manoA({ look: THEO, x: X1, y: SUP_PISO, lado: "I", obj: () => ({ x: X1 + 30, y: SUP_PISO - 236 }), peso: pesoIK(g0 - 6, 1e9, 6) }) })} />} />
      </Empuje>
      <RelojDia min={7 * 60 + 10 + Math.floor(lerp(f, 0, k(71.6), 0, 60))} x={1560} y={60} desde={0} tam={52} />
      <Globo texto="HELLO?!" x={b.x + 260} y={b.y - 40} desde={g0} hasta={k(72.7) + 6} tam={78} cola="izq" />
      <div style={{ opacity: 0.45 }}><Globo texto="hello?" x={b.x + 560} y={b.y - 230} desde={g0 + 10} hasta={k(72.7) + 6} tam={46} cola="izq" /></div>
      <div style={{ opacity: 0.25 }}><Globo texto="hello…" x={b.x + 760} y={b.y - 360} desde={g0 + 18} hasta={k(72.7) + 6} tam={34} cola="izq" /></div>
    </AbsoluteFill>
  );
};
const tX = (x: number) => Math.min(1920 - 960 / 1.45, Math.max(960 / 1.45, x));

// ---------- 18 · policía (golpea), bomberos (espía por el vidrio), la Holiday (entra) ----------
export const P18Lugares: React.FC = () => {
  const f = useF();
  const k = kDe(72.7);
  const a = k(74.0), b = k(75.4);
  const PX = SUP_PUNTOS.policia - 60;
  const pol = (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, PX + 80, 700, 1.5), mira(a, PX + 100, 700, 1.52)]} seed={18} setProps={{ hora: "dia", luces: 0.05 }}
      medio={<Pj look={THEO} ruta={[{ f: 0, x: PX - 60, y: SUP_PISO }, { f: 10, x: PX }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: 30, v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]}
        ajuste={manoA({ look: THEO, x: PX, y: SUP_PISO, lado: "D", obj: (g) => ({ x: PX + 96 + 14 * Math.max(0, Math.sin(g / 2.4)), y: SUP_PISO - 190 }), peso: pesoIK(10, a - 6, 6) })} />} />
  );
  const FX = 3340 - 120;
  const fuego = (
    <Escena Set={Superior} pal={PAL} claves={[mira(a, FX + 60, 700, 1.5), mira(b, FX + 80, 700, 1.52)]} seed={181} setProps={{ hora: "dia", luces: 0.05 }}
      medio={<Pj look={THEO} ruta={[{ f: a, x: FX - 80, y: SUP_PISO }, { f: a + 12, x: FX }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "parado" }, { f: a + 14, v: "manosCara" }]} caras={[{ f: 0, v: "duda" }, { f: a + 20, v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />} />
  );
  const HX = SUP_PUNTOS.holiday + 420;
  const holi = (
    <Escena Set={Superior} pal={PAL} claves={[mira(b, HX - 60, 700, 1.4), mira(145, HX - 110, 700, 1.42)]} seed={182} setProps={{ hora: "dia", luces: 0.05 }}
      medio={<Pj look={THEO} ruta={[{ f: b, x: HX + 220, y: SUP_PISO }, { f: 145, x: HX - 60 }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />} />
  );
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, pol], [a, fuego], [b, holi]]} />
      <Checklist x={1380} y={300} desde={4} items={[{ t: "POLICE", f: 0, x: a - 10 }, { t: "FIRE HALL", f: a, x: b - 10 }, { t: "HOLIDAY", f: b }]} />
      {f < a && f > 14 && Math.sin(f / 2.4) > 0.6 && <TextoMano texto="knock" x={1180} y={420} desde={0} color="#f6ecd2" tam={44} brillo={false} />}
    </AbsoluteFill>
  );
};

// ---------- 19 · el surtidor anda (el display corre), el café está tibio: lo huele y lo deja ----------
export const P19Holiday: React.FC = () => {
  const f = useF();
  const k = kDe(77.54);
  const c = k(79.9);
  const SX = 650, TX = 810;
  const gal = lerp(f, 18, c, 0, 2.84);
  const pistola = (g: number) => ({ x: TX - 92, y: SUP_PISO - 150 - 6 * Math.sin(g / 9) });
  const surt = (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, 720, 720, 1.75), mira(c, 730, 720, 1.78)]} seed={19} setProps={{ hora: "dia", luces: 0.05 }}
      medio={<>
        <SurtidorGrande x={SX} piso={SUP_PISO} gal={gal} usd={gal * 3.19} manguera={f > 10 ? pistola(f) : null} />
        <Pj look={THEO} ruta={[{ f: 0, x: TX, y: SUP_PISO }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "duda" }, { f: 30, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: -1, y: 0.3 } }, { f: 30, v: { x: -1, y: -0.2 } }]}
          ajuste={manoA({ look: THEO, x: TX, y: SUP_PISO, dir: -1, lado: "D", obj: pistola, peso: pesoIK(4) })} />
      </>} />
  );
  const CX = TIENDA.cafe - 190;
  const taza = (g: number) => {
    const mesa = { x: TIENDA.cafe - 90, y: TIENDA.piso - 232 }, nariz = { x: CX + 26, y: TIENDA.piso - 246 };
    const u = rampa(g, c + 14, c + 30) * (1 - rampa(g, k(81.6), k(82.1)));
    return { x: mesa.x + (nariz.x - mesa.x) * u, y: mesa.y + (nariz.y - mesa.y) * u };
  };
  const tienda = (
    <Escena Set={Tienda} pal={PAL} claves={[mira(c, TIENDA.cafe - 120, 640, 1.7), mira(152, TIENDA.cafe - 110, 640, 1.74)]} seed={191}
      medio={<>
        <Pj look={THEO} ruta={[{ f: c, x: CX, y: TIENDA.piso }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "duda" }, { f: c + 34, v: "sorpresa" }, { f: k(81.4), v: "miedo" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(81.4), v: { x: -1, y: 0 } }]} giros={[{ f: 0, v: 0 }, { f: k(81.6), v: 0.5 }]}
          enManoD={<Taza vapor={1} f={f} />} ajuste={manoA({ look: THEO, x: CX, y: TIENDA.piso, lado: "D", obj: taza, peso: () => 1 })} />
      </>} />
  );
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, surt], [c, tienda]]} />
      <Contador lineas={[{ etiqueta: "PUMP", claves: "ON", color: "#7dff9a" }, { etiqueta: "COFFEE", claves: "WARM", color: AMBAR }, { etiqueta: "PEOPLE", claves: 0, color: "#ff6a5a" }]} x={80} y={300} tam={46} alinear="der" desde={k(78.4)} hasta={c} />
      <Marcador lineas={[["COFFEE", "STILL WARM", AMBAR], ["PEOPLE", "0", "#ff6a5a"]]} x={1330} y={330} desde={c + 20} />
    </AbsoluteFill>
  );
};

// ---------- 20 · esa noche: sentado a la mesa escribe en el cuaderno del alce → CENSUS, «1» ----------
export const P20Censo: React.FC = () => {
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
            caras={[{ f: 0, v: "triste" }, { f: 50, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0.7 } }]} enManoD={<Lapiz />}
            ajuste={manoA({ look: THEO_CASA, x: TX, y: LIV_PISO, lado: "D", asiento: 58, obj: punta, peso: pesoIK(14),
              otra: manoA({ look: THEO_CASA, x: TX, y: LIV_PISO, lado: "I", asiento: 58, obj: () => ({ x: MX - 40, y: MY + 6 }), peso: () => 1 }) })} />
        </>} />
    </Empuje>
  );
  const cuaderno = <CuadernoEscribe abre={k(89.6)} lineas={[{ t: "CENSUS", desde: k(90.6), tam: 92, x: 1290, y: 290 }, { t: "1", desde: k(94.9), tam: 150, x: 1400, y: 470 }]} />;
  return <Cortes en={[[-100, mesa], [ins, cuaderno]]} />;
};

// ---------- 21 · el cuaderno todavía existe: otra mesa, luz fría; una mano pasa la hoja → la 2 arrancada ----------
export const P21Existe: React.FC = () => {
  const k = kDe(95.7);
  return (
    <AbsoluteFill>
      <CuadernoHoy pasa={k(98.6)} zoom={k(100.4)} marca={k(101.5)} />
      <CirculoMano x={1010} y={560} r={230} desde={k(101.5)} texto="?" />
      <Cartel texto="THE NOTEBOOK STILL EXISTS" x={1150} y={40} desde={k(95.9)} hasta={k(100.4)} tam={46} />
      <Cartel texto="PAGE 2: TORN OUT" x={1450} y={900} desde={k(101.0)} tam={44} color="#ffcf6e" />
    </AbsoluteFill>
  );
};

// ---------- 22 · las luces no se apagan: Theo mira cómo se prenden los faroles en cadena ----------
export const P22Luces: React.FC = () => {
  const f = useF();
  const k = kDe(103.44);
  const l0 = k(106.3);
  const TX = 1900;
  return (
    <Escena Set={Superior} pal={PAL} claves={[mira(0, 1780, 640, 1.3), mira(172, 1760, 620, 1.12, { curva: "inout" })]} seed={22} setProps={{ hora: "ocaso", luces: lerp(f, l0 + 30, l0 + 60, 0, 0.7), nieve: 0 }}
      medio={<>
        <OlaFarolas xs={[1000, 1450, 2200, 2650]} lados={[-1, 1, 1, -1]} piso={SUP_PISO + 30} f={f} f0={l0} paso={7} />
        <Pj look={THEO} ruta={[{ f: 0, x: TX - 120, y: SUP_PISO }, { f: k(105.6), x: TX }]} dir={[{ f: 0, v: 1 }]}
          caras={[{ f: 0, v: "cansado" }, { f: l0 + 2, v: "sorpresa" }, { f: k(108.0), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: l0, v: { x: -1, y: -0.6 } }, { f: l0 + 14, v: { x: 1, y: -0.8 } }, { f: k(108.0), v: { x: 1, y: -0.2 } }]}
          giros={[{ f: 0, v: 0 }, { f: k(108.0), v: 0.5 }]} poses={[{ f: 0, v: "parado" }, { f: k(107.6), v: "brazosCruzados" }]} />
      </>} />
  );
};

// ---------- 23 · la red es automática: esquema represa → torres → subestación → ciudad; Thomson y Fond du Lac giran solas ----------
export const P23Represa: React.FC = () => {
  const f = useF();
  const k = kDe(109.19);
  const m = k(114.3), c = k(119.4), d = k(121.5);
  const TX = -260;
  const theo = (
    <Pj look={THEO} ruta={[{ f: 0, x: TX, y: ESQ.piso }]} escala={2.2} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "hablar" }]}
      caras={[{ f: 0, v: "determinado" }, { f: k(112.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(111), v: { x: 0.3, y: 0 } }, { f: k(112.6), v: { x: 1, y: -0.3 } }]} giros={[{ f: 0, v: 0 }, { f: k(111), v: 0.7 }, { f: k(112.6), v: 0 }]}
      habla={[[k(109.3), k(110.6)], [k(110.9), k(114.1)]]}
      ajuste={manoA({ look: THEO, x: TX, y: ESQ.piso, esc: 2.2, lado: "D", obj: () => ({ x: TX + 700, y: ESQ.piso - 520 }), peso: pesoIK(k(110.0)) })} />
  );
  const a2 = k(111.4);
  const explica = (
    <Escena Set={Esquema} pal={PAL} claves={[mira(0, 340, 560, 0.8), mira(a2, 370, 560, 0.81)]} seed={23} setProps={{ pulso: 0, ciudad: 0 }} medio={theo} />
  );
  const red = (
    <Escena Set={Esquema} pal={PAL} claves={[mira(a2, 1690, 700, 0.57), mira(m, 1710, 700, 0.575)]} seed={233} setProps={{ pulso: lerp(f, a2 + 4, k(113.4), 0, 1), ciudad: lerp(f, k(112.8), k(113.8), 0, 1) }} />
  );
  const mapa = <MapaRio desde={m} pin1={k(116.6)} pin2={k(117.8)} />;
  const turb = (
    <Escena Set={Esquema} pal={PAL} claves={[mira(c, ESQ.represa + 130, 640, 1.35), mira(d, ESQ.represa + 160, 640, 1.38)]} seed={231} setProps={{ pulso: 1, ciudad: 1, marcas: 0 }} />
  );
  const ciudad = (
    <Escena Set={Esquema} pal={PAL} claves={[mira(d, ESQ.ciudad + 160, 620, 1.05), mira(419, ESQ.ciudad + 140, 610, 1.08)]} seed={232} setProps={{ pulso: 1, ciudad: lerp(f, k(121.7), k(122.6), 0.25, 1), marcas: 0 }} />
  );
  const dias = Math.floor(lerp(f, c + 10, d - 6, 0, 21));
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, explica], [a2, red], [m, mapa], [c, turb], [d, ciudad]]} />
      <Contador lineas={[{ etiqueta: "WORKERS ON SHIFT", claves: 0, color: "#ff6a5a" }, { etiqueta: "GRID", claves: f > k(112.4) ? "ONLINE ✓" : "…", color: "#7dff9a" }]} x={80} y={60} tam={46} alinear="der" desde={a2 + 4} hasta={m} />
      <Contador lineas={[{ etiqueta: "UNATTENDED", claves: `${dias} DAYS`, color: AMBAR }]} x={80} y={60} tam={54} alinear="der" desde={c + 6} hasta={d} />
      <Contador lineas={[{ etiqueta: "CITY", claves: "STILL LIT", color: AMBAR }]} x={80} y={60} tam={54} alinear="der" desde={k(121.8)} />
    </AbsoluteFill>
  );
};

// ---------- 24 · semáforos para nadie; cada farol de Superior se prende al atardecer, a horario ----------
export const P24Semaforos: React.FC = () => {
  const f = useF();
  const k = kDe(123.17);
  const b = k(125.45);
  const verde = k(124.3);
  const sema = (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} claves={[mira(0, 3150, 700, 1.15), mira(b, 3200, 700, 1.16)]} seed={24} setProps={{ hora: "noche", luces: 1 }} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><SemaforoGrande x={1560} y={300} luz={f < verde - 12 ? 0 : f < verde ? 1 : 2} s={1.25} /></svg>
      <Marcador lineas={[["CARS WAITING", "0", "#ff6a5a"]]} x={480} y={120} tam={58} desde={k(123.6)} />
    </AbsoluteFill>
  );
  const xs = [600, 1000, 1600, 2200, 2900, 3300];
  const ola = (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} claves={[mira(b, 1900, 620, 0.78), mira(200, 1960, 620, 0.79)]} seed={241} setProps={{ hora: "ocaso", luces: lerp(f, k(127.6), k(128.6), 0, 0.5) }}
        medio={<OlaFarolas xs={xs} lados={xs.map((_, i) => (i % 2 ? -1 : 1))} piso={SUP_PISO + 30} f={f} f0={k(126.4)} paso={7} />} />
      <RelojDia min={18 * 60 + 44 + (f >= k(126.3) ? 1 : 0)} x={820} y={60} desde={b + 2} tam={64} />
      <Cartel texto="ON SCHEDULE" x={960} y={170} desde={k(126.6)} tam={46} />
    </AbsoluteFill>
  );
  return <Cortes en={[[-100, sema], [b, ola]]} />;
};

// ---------- 25 · día 3: llega al mirador, la ciudad prendida… salvo una ventana (la señala) ----------
export const P25Colina: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const k = kDe(129.83);
  const claves = [mira(0, 1618, 600, 0.8), mira(365, 1628, 600, 0.8)];
  const T1 = 1150;
  const v = enPantalla(claves, f, fps, VENT_HOSP.x, VENT_HOSP.y);
  const E = [{ f: 0, z: 2.0, x: 480, y: 640 }, { f: k(133.3), z: 2.0, x: 590, y: 640 }, { f: k(137.8), z: 1 }];
  const w = tras(E, f, v.x, v.y);
  return (
    <AbsoluteFill>
      <Empuje k={E}>
        <Escena Set={Panorama} pal={PAL} claves={claves} seed={25} setProps={{ hora: "noche", luces: 1, ventana: f > k(139.4) ? titila(f, k(139.4), 15) : 1, nieve: 0 }}
          medio={<Pj look={THEO_MOCHI} ruta={[{ f: 0, x: 880, y: P - 6 }, { f: k(132.6), x: T1 }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO}
            caras={[{ f: 0, v: "cansado" }, { f: k(134.0), v: "sorpresa" }, { f: k(140.0), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(133.5), v: { x: 1, y: -0.2 } }]}
            ajuste={manoA({ look: THEO_MOCHI, x: T1, y: P - 6, lado: "D", obj: () => ({ x: T1 + 400, y: P - 420 }), peso: pesoIK(k(140.2)) })} />} />
      </Empuje>
      {f > k(139.4) && <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><Halo x={w.x} y={w.y} r={90 + 20 * Math.sin(f / 4)} color={AMBAR} fuerza={0.9 * titila(f, k(139.4), 15)} /></svg>}
      <CirculoMano x={w.x} y={w.y} r={70} desde={k(140.0)} />
      <Cartel texto="EXCEPT ONE WINDOW" x={960} y={120} desde={k(140.2)} tam={50} />
    </AbsoluteFill>
  );
};

// ---------- 26 · St. Mary's: empuje a la ventana del 4º piso, que se prende y se apaga a mano ----------
export const P26Ventana: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const k = kDe(141.99);
  const claves = [mira(0, 2000, 560, 1.0), mira(281, 2005, 560, 1.0)];
  const v = enPantalla(claves, 0, fps, VENT_HOSP.x + 12, VENT_HOSP.y + 16);
  const E = [{ f: 0, z: 1 }, { f: 15, z: 1, x: 960, y: 540 }, { f: k(145.9), z: 4.2, x: v.x, y: v.y }];
  const on = f < k(146.0) ? 1 : titila(f, k(146.0), 16);
  const TX = 1330;
  return (
    <AbsoluteFill>
      <Empuje k={E}>
        <Escena Set={Panorama} pal={PAL} claves={claves} seed={26} setProps={{ hora: "noche", luces: 0.45, ventana: on, nieve: 0 }}
          medio={<Pj look={THEO_MOCHI} ruta={[{ f: 0, x: TX, y: P - 6 }]} dir={[{ f: 0, v: 1 }]} luz={BORDE_FRIO} caras={[{ f: 0, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }]}
            ajuste={manoA({ look: THEO_MOCHI, x: TX, y: P - 6, lado: "D", obj: () => ({ x: TX + 60, y: P - 128 }), peso: () => 1 })} />} />
      </Empuje>
      {[k(146.0), k(146.55), k(147.1), k(147.65)].map((t, i) => <TextoMano key={i} texto={i % 2 ? "OFF" : "ON"} x={560 + i * 230} y={850} desde={t} hasta={k(149.0)} color={i % 2 ? "#8fa0c8" : AMBAR} tam={70} rot={-4 + i * 3} />)}
      {f > k(148.8) && (
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <g opacity={rampa(f, k(148.8), k(149.2))}>
            <circle cx={1580} cy={330} r={150} fill="#f2eee4" stroke={AMBAR} strokeWidth={8} />
            <g transform="translate(1580,330) scale(1.2)"><Interruptor on={titila(f, k(148.8), 16) > 0.5} /></g>
          </g>
        </svg>
      )}
      {f > k(148.8) && <Cartel texto="BY HAND" x={1580} y={500} desde={k(149.0)} tam={44} />}
    </AbsoluteFill>
  );
};

// ---------- 27 · «somebody is»: la cara de June (GOLPE); entre las camas vacías levanta la sábana; las camas están tibias ----------
export const P27June: React.FC = () => {
  const f = useF();
  const k = kDe(151.37);
  const b = k(152.25), c = k(159.85);
  const JX = 3050;
  const cara = (
    <Empuje k={[{ f: -20, z: 1.8, x: 960, y: 520 }, { f: b, z: 1.7, x: 960, y: 520 }]}><Escena Set={Lobby} pal={PAL} claves={[mira(0, JX + 10, LOBBY_PISO - 250, 2.3), mira(b, JX + 14, LOBBY_PISO - 250, 2.32)]} seed={27} setProps={{ luces: 1, afuera: "noche" }}
      medio={<Pj look={JUNE} ruta={[{ f: 0, x: JX, y: LOBBY_PISO }]} dir={[{ f: 0, v: 1 }]} giros={[{ f: 0, v: -0.2 }, { f: 12, v: 0.9 }]} caras={[{ f: 0, v: "miedo" }, { f: 16, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: 12, v: { x: 0, y: 0 } }]} />} /></Empuje>
  );
  const CAMA = 3350;
  const sab = (g: number) => ({ x: CAMA - 60 + 70 * rampa(g, k(155.6), k(156.6)), y: LOBBY_PISO - 172 - 120 * rampa(g, k(155.6), k(156.6)) * (1 - rampa(g, k(157.6), k(158.4))) });
  const camas = (
    <Escena Set={Lobby} pal={PAL} claves={[mira(b, 3380, 640, 1.2), mira(c, 3420, 640, 1.22)]} seed={271} setProps={{ luces: 1, afuera: "noche" }}
      medio={<>
        <Pj look={JUNE} ruta={[{ f: b, x: 2780, y: LOBBY_PISO }, { f: k(155.4), x: CAMA - 180 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "cansado" }, { f: k(157.6), v: "triste" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(155.4), v: { x: 1, y: 0.7 } }, { f: k(158.6), v: { x: 0.3, y: 0 } }]} giros={[{ f: 0, v: 0 }, { f: k(158.6), v: 0.6 }]}
          ajuste={manoA({ look: JUNE, x: CAMA - 180, y: LOBBY_PISO, lado: "D", obj: sab, peso: pesoIK(k(155.3), k(158.5), 8) })} />
        <Sabana x={CAMA - 30} y={LOBBY_PISO - 170} px={sab(f).x} py={sab(f).y} />
      </>} />
  );
  const MX = CAMA + 215, MY = LOBBY_PISO - 370;
  const tibia = (
    <Escena Set={Lobby} pal={PAL} claves={[mira(c, CAMA + 60, 690, 2.0), mira(337, CAMA + 70, 690, 2.02)]} seed={272} setProps={{ luces: 1, afuera: "noche" }}
      medio={<>
        <rect x={MX - 52} y={MY - 34} width={104} height={64} rx={6} fill="#0c1a14" />
        <path d={`M${MX - 48},${MY} ${Array.from({ length: 24 }).map((_, i) => { const x = MX - 48 + i * 4; const t = (i * 4 + f * 3) % 96; return `L${x},${MY - (t > 40 && t < 48 ? 26 : t >= 48 && t < 52 ? -14 : 0)}`; }).join(" ")}`} stroke="#5aff9a" strokeWidth={3} fill="none" />
        {(f - c) % 30 < 6 && <Halo x={MX} y={MY} r={70} color="#5aff9a" fuerza={0.7} />}
        <Pj look={JUNE} ruta={[{ f: c, x: CAMA - 150, y: LOBBY_PISO }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "triste" }, { f: k(161.5), v: "miedo" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: k(161.3), v: { x: 1, y: 0.7 } }]}
          ajuste={manoA({ look: JUNE, x: CAMA - 150, y: LOBBY_PISO, lado: "D", obj: () => ({ x: CAMA + 10, y: LOBBY_PISO - 176 }), peso: pesoIK(k(161.2)) })} />
        <Tibio x={CAMA + 30} y={LOBBY_PISO - 180} w={220} f={f} o={rampa(f, k(161.4), k(161.9))} />
      </>} />
  );
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, cara], [b, camas], [c, tibia]]} />
      <Rotulo nombre="JUNE OKAFOR · 31" bajada="ER NURSE · ST. MARY'S" x={420} y={800} desde={k(152.6)} hasta={k(156.8)} />
      <Marcador lineas={[["PATIENTS IN UNIT", String(Math.round(valorEn([{ f: 0, v: 14 }, { f: k(157.5), v: 14 }, { f: k(158.4), v: 0, d: 18 }], f).v)), "#ff6a5a"]]} x={1260} y={110} tam={48} desde={k(157.0)} hasta={c} />
      <Cartel texto="BEDS STILL WARM" x={1300} y={170} desde={k(161.5)} tam={46} color="#ffb27a" />
      {f >= c && f < k(161.4) && (f - c) % 30 < 8 && <TextoMano texto="beep" x={1450} y={240} desde={0} color="#5aff9a" tam={50} brillo={false} />}
    </AbsoluteFill>
  );
};

// ---------- 28 · se quedó tres días: apila cajas en el mostrador; el reloj vuela; donde están los insumos ----------
export const P28Quedo: React.FC = () => {
  const f = useF();
  const k = kDe(162.59);
  const c = k(167.3);
  const PILA = 1760, MOST = 1300, top = LOBBY_PISO - 160;
  // dos viajes: pila → mostrador
  const ruta = [{ f: 0, x: PILA - 90, y: LOBBY_PISO }, { f: 16, x: PILA - 90 }, { f: 46, x: MOST + 150 }, { f: 62, x: MOST + 150 }, { f: 88, x: PILA - 90 }, { f: 100, x: PILA - 90 }, { f: 128, x: MOST + 150 }];
  const xJ = (g: number) => { for (let i = 1; i < ruta.length; i++) if (g < ruta[i].f) return lerp(g, ruta[i - 1].f, ruta[i].f, ruta[i - 1].x, ruta[i].x); return ruta[ruta.length - 1].x; };
  const lleva = (g: number) => (g >= 8 && g < 54) || (g >= 96 && g < 136);
  const puestas = (f >= 54 ? 1 : 0) + (f >= 136 ? 1 : 0);
  const hrs = Math.floor(lerp(f, 6, c - 4, 0, 72));
  const caja = <Caja t="SALINE" w={92} h={70} />;
  const pila = (
    <g>
      <g transform={`translate(${PILA + 60},${LOBBY_PISO})`}><Caja t="GAUZE" w={120} h={86} /></g>
      <g transform={`translate(${PILA + 190},${LOBBY_PISO})`}><Caja t="MEDS" w={120} h={86} color="#d8c098" /></g>
      <g transform={`translate(${PILA + 120},${LOBBY_PISO - 86})`}><Caja t="SALINE" w={110} h={80} /></g>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${PILA + 290 + i * 54},${LOBBY_PISO})`}><rect x={-22} y={-80} width={44} height={80} rx={10} fill="#9fd0ff" opacity={0.75} stroke="#5a90c0" strokeWidth={3} /><rect x={-8} y={-94} width={16} height={16} fill="#2f6a8a" /></g>)}
    </g>
  );
  const apila = (
    <Escena Set={Lobby} pal={PAL} claves={[mira(0, 1500, 650, 1.45), mira(c, 1520, 650, 1.47)]} seed={28} setProps={{ luces: 1, afuera: "noche" }}
      medio={<>
        <RelojPared x={1260} y={360} vel={60} f={f} r={64} />
        {pila}
        {puestas >= 1 && <g transform={`translate(${MOST + 10},${LOBBY_PISO - 160})`}><Caja t="SALINE" w={92} h={70} /></g>}
        {puestas >= 2 && <g transform={`translate(${MOST + 30},${LOBBY_PISO - 230})`}><Caja t="SALINE" w={92} h={70} /></g>}
        <Pj look={JUNE} ruta={ruta.map((r, i) => (i === 0 ? r : { f: r.f, x: r.x }))} seed={2}
          poses={[{ f: 0, v: "agacharse" }, { f: 14, v: "parado" }, { f: 86, v: "agacharse" }, { f: 100, v: "parado" }]}
          caras={[{ f: 0, v: "cansado" }, { f: 60, v: "determinado" }, { f: 140, v: "cansado" }]} miradas={[{ f: 0, v: { x: -1, y: 0.4 } }, { f: 54, v: { x: -1, y: -0.3 } }]}
          enManoD={lleva(f) ? caja : null}
          ajuste={manoA({ look: JUNE, x: xJ, y: LOBBY_PISO, lado: "D", obj: (g) => ({ x: xJ(g) - 70, y: g >= 46 && g < 56 ? top - 6 : g >= 128 && g < 138 ? top - 76 : LOBBY_PISO - 150 }), peso: (g) => (lleva(g) ? 1 : 0) })} />
      </>} />
  );
  const pilaCerca = (
    <Escena Set={Lobby} pal={PAL} claves={[mira(c, PILA + 180, 700, 2.0), mira(202, PILA + 200, 700, 2.02)]} seed={281} setProps={{ luces: 1, afuera: "noche" }}
      medio={<>
        {pila}
        <Pj look={JUNE} ruta={[{ f: c, x: PILA - 40, y: LOBBY_PISO }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0.5 } }]}
          ajuste={manoA({ look: JUNE, x: PILA - 40, y: LOBBY_PISO, lado: "D", obj: () => ({ x: PILA + 70, y: LOBBY_PISO - 90 }), peso: pesoIK(c + 6) })} />
      </>} />
  );
  return (
    <AbsoluteFill>
      <Cortes en={[[-100, apila], [c, pilaCerca]]} />
      <Marcador lineas={[["HOURS IN HOSPITAL", String(hrs), AMBAR]]} x={1220} y={110} tam={48} desde={4} hasta={c} />
      <Cartel texto="STAY WHERE THE SUPPLIES ARE" x={960} y={140} desde={c + 4} tam={46} />
    </AbsoluteFill>
  );
};

// ---------- 29 · cada noche prendía y apagaba esa luz: la mano, la ventana desde afuera, June en la ventana ----------
export const P29Interruptor: React.FC = () => {
  const f = useF();
  const a = 46, b = 92;
  const mano = <ManoInterruptor toques={[10, 26, 42]} />;
  const fachada = <Escena Set={StMarys} pal={PAL} claves={[mira(a, SM_PUNTOS.ventana.x, 200, 2.0), mira(b, SM_PUNTOS.ventana.x, 195, 2.1)]} seed={29} setProps={{ hora: "noche", luces: 0.15, ventana: titila(f, a + 4, 15), nieve: 0 }} />;
  const JX = 940;
  const luz = titila(f, b + 14, 16);
  const cuarto = (
    <Escena Set={CuartoHosp} pal={PAL} claves={[mira(b, 1010, 640, 1.95), mira(139, 1020, 640, 1.98)]} seed={291} setProps={{ luz }}
      medio={<Pj look={JUNE} ruta={[{ f: b, x: JX, y: CUARTO.piso }]} dir={[{ f: 0, v: 1 }]} luz={luz > 0.5 ? undefined : BORDE_FRIO}
        caras={[{ f: 0, v: "determinado" }, { f: b + 30, v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }]} giros={[{ f: 0, v: 0 }, { f: b + 30, v: 0.4 }]}
        ajuste={manoA({ look: JUNE, x: JX, y: CUARTO.piso, lado: "I", obj: () => ({ x: CUARTO.interruptor + 4, y: CUARTO.piso - 215 }), peso: () => 1 })} />} />
  );
  return <Cortes en={[[-100, mano], [a, fachada], [b, cuarto]]} />;
};
