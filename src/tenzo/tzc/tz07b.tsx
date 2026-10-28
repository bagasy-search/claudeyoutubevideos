// tz07 · vuelta ESTRUCTURAL del Ojo del Director (28-oct): escenas re-animadas (acción de cuerpo entero, contraplanos,
// objetos que nombra la voz, sombra entera dentro del cuadro). Se usan desde la lista de tramos de tz07.tsx.
// Todo va en cuadros LOCALES de cada tramo (loc(t0, t) = cuadro del segundo absoluto t dentro del tramo que empieza en t0).
import React, { useContext } from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { Clave, mira, OffsetCtx, useF } from "../../anikit/camara";
import { Actor, ActorProps } from "../../anikit/actor";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { F_HUD, RelojDia } from "../../anikit/pantalla";
import { Inserto } from "../../anikit/inserto";
import { Prop } from "../../anikit/utileria";
import { conReaccion } from "../../anikit/explica/reaccion";
import { ACENTO, ESC, LEO, MARA, ORO, PAL, PAL_ANT, TENZO } from "../elenco";
import { MAYA } from "../elenco_b";
import { Laptop, Tel } from "../utileria";
import { Agora, AGORA_PISO, AGORA_PUNTOS as A, Barril, SombraRey } from "../sets/agora";
import {
  ActorVivo, Burbuja, CabeceraChat, ConCara, CTO, EnCuarto, EnLavadero, LAV, ManoLeo, ManoMara, Negro, PantallaTel, Recuerdo, RIM_FRIO, RIM_ORO,
  SENTADO, SENTADO_TEL, TENZO_MESA, TextoMano,
} from "./chicago";
import { ALEJANDRO, BX, DIO, DIOGENES, REY, REY_ESC, SeCorre } from "./parabola07";
import { TYLER } from "./tz05";

const FPS = 30;
const fr = (t: number) => Math.round(t * FPS);
const loc = (t0: number, t: number) => fr(t - t0);
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const P = LAV.P;
const PC = CTO.P;
const sube = (f: number, a: number, d = 18) => spring({ frame: f - a, fps: FPS, config: { damping: 14, stiffness: 120 } }) * (f >= a ? 1 : 0) + 0 * d;

// ---------- CORTES dentro de UN tramo (una escena del director = un tramo; adentro, planos distintos) ----------
// lista de [cuadro local de inicio, plano, desplaza?]; cada plano ve su propio reloj desde 0 (o desde `desplaza`:
// con desplaza = inicio el plano conserva el reloj del tramo, para piezas viejas armadas con loc(t0, …))
export const Cortes: React.FC<{ planos: [number, React.ReactNode, number?][] }> = ({ planos }) => {
  const f = useF();
  const o = useContext(OffsetCtx);
  let i = 0;
  planos.forEach(([a], k) => { if (f >= a) i = k; });
  return <OffsetCtx.Provider value={o + planos[i][0] - (planos[i][2] ?? 0)}>{planos[i][1]}</OffsetCtx.Provider>;
};

// Leo por defecto en el cuarto (sentado en el colchón) y en el lavadero (en su silla)
const leoCto = (p: Partial<ActorProps>): ActorProps => ({ look: LEO, escala: ESC, seed: 1, luz: RIM_FRIO, ruta: [{ f: 0, x: CTO.colchon, y: PC }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: CTO.COLCHON_ALTO }], poses: [{ f: 0, v: SENTADO }], caras: [{ f: 0, v: "neutral" }], ...p } as ActorProps);
const leoLav = (p: Partial<ActorProps>): ActorProps => ({ look: LEO, escala: ESC, seed: 1, luz: RIM_FRIO, ruta: [{ f: 0, x: LAV.leo, y: P }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: 66 }], poses: [{ f: 0, v: SENTADO }], caras: [{ f: 0, v: "neutral" }], ...p } as ActorProps);
// la sombra dibujada a mano (para subirla, bajarla, achicarla dentro del cuadro sin que camine)
const MaraEn: React.FC<{ x: number; y: number; s: number; p?: Partial<ActorProps>; o?: number }> = ({ x, y, s, p = {}, o = 0.94 }) => (
  <g transform={`translate(${x},${y})`}>
    <Actor look={MARA} escala={ESC * s} seed={5} ruta={[{ f: 0, x: 0, y: 0 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} opacidad={() => o} {...p} />
  </g>
);
// la «chica hecha de luz» (tz02/tz04): silueta ámbar translúcida
const LUZ_CHICA = { ...MAYA, piel: "#ffd9b8", camisa: ACENTO, pantalon: "#ff9a5a", zapatos: "#ffd9b8", miembro: "#ffd9b8", accesorios: [{ t: "pelo" as const, forma: "cola" as const, color: "#b0521c" }, { t: "trenzas" as const, color: "#b0521c", lazo: "#fff1c9" }] };
// fantasma que aparece y revienta (anillo) en `pop`
const Fantasma: React.FC<{ look: ActorProps["look"]; x: number; y: number; escala: number; desde: number; pop: number; dir?: 1 | -1; pose?: ActorProps["poses"]; cara?: string; demonio?: boolean }> = ({ look, x, y, escala, desde, pop, dir = 1, pose, cara = "feliz" }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + 8, pop, pop + 6], [0, 0.95, 0.95, 0], cl);
  const anillo = f >= pop && f < pop + 16 ? (f - pop) / 16 : -1;
  return (
    <g>
      {o > 0 && <Halo x={x} y={y - 200 * escala / ESC} r={240 * escala / ESC} color="#f4efe4" fuerza={0.22 * o} />}
      {o > 0 && <Actor look={look} escala={escala} seed={77} ruta={[{ f: 0, x, y }]} dir={[{ f: 0, v: dir }]} caras={[{ f: 0, v: cara }]} poses={pose ?? [{ f: 0, v: "parado" }]} opacidad={() => o} />}
      {anillo >= 0 && <circle cx={x} cy={y - 260 * escala / ESC} r={60 + anillo * 220} fill="none" stroke="#f4efe4" strokeWidth={6} opacity={0.7 * (1 - anillo)} />}
    </g>
  );
};

// ============ E10 · 57,0-60,8 «And behind his shoulder, the shadow has never been so happy.» ============
// la sombra SUBE desde atrás del colchón, entera en el cuadro, y festeja; Leo ni la ve
export const SombraFeliz: React.FC = () => {
  const f = useF();
  const t0 = 57.0;
  const crece = sube(f, 2);
  const inclina = 34, fest = loc(t0, 59.2);
  const X = CTO.colchon;
  return (
    <EnCuarto leo={null}
      cam={[mira(0, X - 90, PC - 270, 2.0), mira(fest, X - 80, PC - 265, 2.1, { curva: "inout" }), mira(114, X - 70, PC - 262, 2.2, { curva: "inout" })]}
      medio={<>
        <Halo x={X - 210} y={PC - 260} r={300} color={ACENTO} fuerza={0.22 * crece} />
        <MaraEn x={X - 210} y={PC} s={Math.max(0.05, 0.9 * crece)} p={{
          caras: [{ f: 0, v: "picaro" }, { f: inclina, v: "feliz" }, { f: fest, v: "risa" }], habla: [[fest, fest + 30]],
          poses: [{ f: 0, v: { hD: 30, cD: 40, hI: 30, cI: 40 } }, { f: inclina, v: { tronco: 18, cabeza: 14, hD: 70, cD: 50, hI: 40, cI: 60 } },
            { f: fest, v: "celebrar" }, { f: fest + 14, v: { hI: 120, cI: 40, hD: 160, cD: 10, cabeza: -14, tronco: -8 } }, { f: fest + 28, v: "celebrar" }, { f: fest + 42, v: { hI: 120, cI: 40, hD: 160, cD: 10, cabeza: -14, tronco: -8 } }],
        }} />
        <Actor {...leoCto({ ruta: [{ f: 0, x: X, y: PC }], enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 0.8 },
          poses: [{ f: 0, v: SENTADO_TEL }, { f: inclina, v: { ...SENTADO_TEL, cabeza: 26, tronco: 10 } }, { f: fest, v: { ...SENTADO_TEL, hD: 40, cD: 135, cabeza: 30, tronco: 14 } }, { f: fest + 26, v: { ...SENTADO_TEL, cabeza: 32, tronco: 16 } }],
          caras: [{ f: 0, v: "triste" }, { f: inclina, v: "cansado" }, { f: fest, v: "triste" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }] })} />
      </>} />
  );
};

// ============ E11 · 60,8-72,2 «it just reads the captions out loud… over and over. He's better than you…» ============
// A) el celular: la sombra lee el pie del reel palabra por palabra (su cara en la esquina, hablando)
// B) contraplano: la sombra se dobla sobre el hombro de Leo y le habla al oído; Leo se encoge en cada frase
export const LeeCaptions: React.FC<{ reel: (lee: number) => React.ReactNode }> = ({ reel }) => {
  const t0 = 60.8;
  const B = loc(t0, 66.5);
  return (
    <Cortes planos={[
      [0, <ConCara look={MARA} esquina="der" caras={[{ f: 0, v: "picaro" }, { f: 60, v: "risa" }, { f: 130, v: "feliz" }]} habla={[[loc(t0, 62.7), loc(t0, 66.4)]]}>{reel(loc(t0, 63.0))}</ConCara>],
      [B, <AlOido t0={66.5} />],
    ]} />
  );
};
const AlOido: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useF();
  const fr1 = loc(t0, 67.9), fr2 = loc(t0, 69.2), fr3 = loc(t0, 70.7);
  const X = CTO.colchon + 40;
  const enc = interpolate(f, [fr1, fr3 + 20], [0, 1], cl);
  return (
    <EnCuarto leo={null}
      cam={[mira(0, X + 90, PC - 265, 1.9), mira(171, X + 80, PC - 262, 2.05, { curva: "inout" })]}
      medio={<>
        <MaraEn x={X + 190} y={PC} s={0.88} p={{
          dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "picaro" }, { f: fr1, v: "risa" }, { f: fr3, v: "feliz" }],
          habla: [[fr1, fr2 - 4], [fr2, fr3 - 4], [fr3, fr3 + 22]],
          poses: [{ f: 0, v: { tronco: 10, cabeza: 8, hD: 40, cD: 60, hI: 20, cI: 40 } }, { f: fr1, v: { tronco: 22, cabeza: 16, hD: 80, cD: 40, hI: 20, cI: 40 } },
            { f: fr2, v: { tronco: 14, cabeza: 6, hD: 130, cD: 10, hI: 30, cI: 50 } }, { f: fr3, v: { tronco: 26, cabeza: 18, hD: 60, cD: 90, hI: 70, cI: 60 } }],
        }} />
        <Actor {...leoCto({ ruta: [{ f: 0, x: X, y: PC }], dir: [{ f: 0, v: 1 }], enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 0.7 },
          poses: [{ f: 0, v: SENTADO_TEL }, { f: fr1 + 4, v: { ...SENTADO_TEL, cabeza: 24, tronco: 8 } }, { f: fr2 + 4, v: { ...SENTADO_TEL, cabeza: 10, tronco: 4, hI: 40, cI: 110 } }, { f: fr3 + 4, v: { ...SENTADO_TEL, cabeza: 28, tronco: 10, hD: 20, cD: 110 } }],
          caras: [{ f: 0, v: "triste" }, { f: fr2, v: "miedo" }, { f: fr3, v: "triste" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: fr2, v: { x: 0.9, y: -0.3 } }, { f: fr3, v: { x: 0.3, y: 0.9 } }] })} />
        <Halo x={X} y={PC - 260} r={260} color={ACENTO} fuerza={0.15 + 0.15 * enc} />
      </>}
      hud={<>
        <ManoMara texto="he's better than you." x={960} y={300} desde={fr1} hasta={fr2} />
        <ManoMara texto="look where he is." x={960} y={300} desde={fr2} hasta={fr3} />
        <ManoMara texto="look where you are." x={960} y={300} desde={fr3} />
      </>} />
  );
};

// ============ E13 · 79,1-84,6 «not a girl made of light that is pulling him. It is a guy he used to know.» ============
// perfil de Leo en el colchón: el teléfono le TIRA del brazo hacia adelante; la chica de luz se apaga y en su lugar
// aparece Tyler (gris, como un recuerdo) con las llaves del auto, que le hace señas
export const NoEsLuz: React.FC = () => {
  const f = useF();
  const t0 = 79.1;
  const chau = loc(t0, 80.4), ty = loc(t0, 82.7);
  const tira = interpolate(f, [10, 60, ty, ty + 30], [0, 0.4, 0.5, 1], cl);
  const X = CTO.colchon - 120;
  return (
    <EnCuarto leo={null}
      cam={[mira(0, X + 280, PC - 300, 1.75), mira(ty - 1, X + 300, PC - 300, 1.85, { curva: "inout" }), mira(ty, X + 300, PC - 270, 2.35, { rot: -2 }), mira(165, X + 310, PC - 272, 2.45, { rot: -2, curva: "inout" })]}
      medio={<>
        {/* la chica de luz: aparece, la voz la nombra… y se apaga */}
        <g opacity={interpolate(f, [0, 10, chau, chau + 24], [0, 0.55, 0.55, 0], cl)}>
          <Halo x={X + 560} y={PC - 260} r={260} color={ACENTO} fuerza={0.4} />
          <Actor look={LUZ_CHICA} escala={ESC} seed={44} ruta={[{ f: 0, x: X + 560, y: PC }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} poses={[{ f: 0, v: { hD: 100, cD: 30, hI: 20, cI: 30 } }]} />
        </g>
        {/* Tyler, gris (el recuerdo), entra donde estaba ella */}
        <g opacity={interpolate(f, [ty - 14, ty + 4], [0, 0.85], cl)}>
          <Actor look={{ ...TYLER, camisa: "#7d8794", pantalon: "#5a5f68" }} escala={ESC} seed={31} ruta={[{ f: 0, x: X + 620, y: PC }, { f: ty - 14, x: X + 620, y: PC }, { f: ty + 20, x: X + 560, y: PC }]} dir={[{ f: 0, v: -1 }]}
            caras={[{ f: 0, v: "risa" }]} poses={[{ f: 0, v: "saludar" }, { f: ty + 24, v: { hD: 120, cD: 40 } }, { f: ty + 40, v: "saludar" }, { f: ty + 56, v: { hD: 120, cD: 40 } }]}
            enManoD={<g><circle cx={0} cy={0} r={8} fill="#c9ccd2" /><rect x={6} y={-3} width={22} height={6} rx={3} fill="#c9ccd2" /></g>} />
        </g>
        <Actor {...leoCto({ ruta: [{ f: 0, x: X, y: PC }], enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 1 },
          poses: [{ f: 0, v: SENTADO_TEL }, { f: 30, v: { ...SENTADO_TEL, hD: 60 + 30 * tira, cD: 60, tronco: 6 + 22 * tira, cabeza: 10 } }, { f: ty, v: { ...SENTADO_TEL, hD: 80, cD: 30, tronco: 20, cabeza: 4 } }, { f: ty + 30, v: { ...SENTADO_TEL, hD: 90, cD: 20, tronco: 30, cabeza: 0 } }],
          caras: [{ f: 0, v: "triste" }, { f: chau, v: "duda" }, { f: ty, v: "triste" }], miradas: [{ f: 0, v: { x: 0.8, y: 0.1 } }] })} />
        {/* el hilo ámbar que tira del teléfono hacia adelante */}
        <path d={`M${X + 120},${PC - 230} Q${X + 330},${PC - 300 - 30 * Math.sin(f / 9)} ${X + 540},${PC - 250}`} stroke={ACENTO} strokeWidth={4} fill="none" strokeDasharray="10 12" opacity={interpolate(f, [20, 40], [0, 0.7], cl)} />
      </>}
      hud={<ManoLeo texto="a guy he used to know." x={960} y={300} desde={ty} />} />
  );
};

// ============ E20 · 111,7-117,4 «Leo waves his hand at the laundromat, the dryers, the broken vending machine. This.» ============
// Leo se PARA, cruza el lavadero señalando (las secadoras, la máquina rota) y abre los brazos: «This.»
export const EsteLugar: React.FC<{ medio?: React.ReactNode }> = ({ medio }) => {
  const t0 = 111.7;
  const sec = loc(t0, 113.8), maq = loc(t0, 114.8), este = loc(t0, 116.5);
  const ruta = [{ f: 0, x: LAV.leo, y: P }, { f: 12, x: LAV.leo, y: P }, { f: 26, x: LAV.leo + 60, y: P + 30 }, { f: 56, x: LAV.leo + 260, y: P + 30 }];
  return (
    <EnLavadero leo={null} medio={medio}
      tenzo={{ caras: [{ f: 0, v: "neutral" }, { f: este, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: 70, v: { x: 0.9, y: 0 } }], dir: [{ f: 0, v: -1 }, { f: 70, v: 1 }] }}
      extra={[{ ...leoLav({ ruta, asiento: [{ f: 0, v: 66 }, { f: 12, v: undefined }],
        poses: [{ f: 0, v: SENTADO }, { f: 8, v: { hD: 110, cD: 20, tronco: 8 } }, { f: 26, v: { hD: 80, cD: 20 } }, { f: sec, v: { hD: 140, cD: 10, cabeza: -14 } }, { f: maq, v: { hD: 95, cD: 0, tronco: 4 } }, { f: maq + 26, v: { hD: 60, cD: 30 } }, { f: este, v: { hI: 105, cI: 20, hD: 105, cD: 20, cabeza: -6, tronco: -4 } }],
        dir: [{ f: 0, v: 1 }, { f: este - 6, v: -1 }],
        caras: [{ f: 0, v: "triste" }, { f: 20, v: "enojo" }, { f: este, v: "triste" }], habla: [[este, este + 22]],
        miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: sec, v: { x: 0.6, y: -0.8 } }, { f: maq, v: { x: 0.9, y: 0 } }, { f: este, v: { x: 0.9, y: 0 } }] }), luz: RIM_FRIO }]}
      cam={[mira(0, LAV.leo + 60, P - 250, 2.2), mira(56, LAV.leo + 260, P - 245, 2.2, { curva: "fluida" }), mira(sec - 1, LAV.leo + 260, P - 245, 2.2), mira(sec, LAV.leo + 330, P - 330, 1.75),
        mira(maq - 1, LAV.leo + 360, P - 330, 1.78), mira(maq, LAV.expendedora - 520, P - 330, 1.7), mira(este - 1, LAV.expendedora - 560, P - 330, 1.72), mira(este, LAV.leo + 260, P - 250, 2.3), mira(171, LAV.leo + 260, P - 255, 2.45, { curva: "inout" })]}
      hud={<ManoLeo texto="this." x={960} y={300} desde={este} tam={96} />} />
  );
};

// ============ E52 · 337,4-348,2 «comparison never ends… a bigger car, a bigger boat. Alexander compared himself to the gods.» ============
const Icono: React.FC<{ d: string; x: number; y: number; s: number; desde: number; de: { x: number; y: number } }> = ({ d, x, y, s, desde, de }) => {
  const f = useF();
  if (f < desde) return null;
  const u = interpolate(f, [desde, desde + 14], [0, 1], { ...cl, easing: (t) => 1 - (1 - t) * (1 - t) });
  const px = de.x + (x - de.x) * u, py = de.y + (y - de.y) * u - 160 * Math.sin(Math.PI * u);
  const pop = spring({ frame: f - desde - 12, fps: FPS, config: { damping: 10, stiffness: 160 } });
  return (
    <g transform={`translate(${px},${py}) scale(${s * (0.35 + 0.65 * Math.min(1, u)) * (1 + 0.08 * Math.max(0, pop - 1))}) rotate(${(1 - u) * -30})`}>
      <Halo x={0} y={0} r={220} color={ACENTO} fuerza={0.25} />
      <rect x={-130} y={-110} width={260} height={220} rx={26} fill="#120d0b" stroke={ACENTO} strokeWidth={7} />
      {d === "auto" && <path d="M-100,40 Q-98,0 -70,-6 L-40,-36 Q0,-46 40,-36 L76,-6 Q100,0 102,40 Z" fill={ACENTO} />}
      {d === "barco" && <path d="M-110,10 L110,10 L86,70 L-86,70 Z M-60,-30 h120 v40 h-120 Z" fill={ACENTO} />}
      {d === "casa" && <path d="M-100,80 V-6 L0,-80 L100,-6 V80 Z M-26,80 V26 H26 V80" fill="none" stroke={ACENTO} strokeWidth={10} />}
      {d === "?" && <text x={0} y={46} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={130} fill={ACENTO}>?</text>}
    </g>
  );
};
export const Escalera: React.FC = () => {
  const t0 = 337.4;
  const MX = LAV.leo - 230;
  const tiros = [loc(t0, 340.8), loc(t0, 343.4), loc(t0, 344.4), loc(t0, 345.0)];
  const items: { d: string; x: number; y: number; s: number }[] = [
    { d: "auto", x: LAV.leo + 230, y: P - 420, s: 0.45 }, { d: "auto", x: LAV.leo + 470, y: P - 500, s: 0.6 },
    { d: "barco", x: LAV.leo + 740, y: P - 560, s: 0.75 }, { d: "casa", x: LAV.leo + 1040, y: P - 620, s: 0.9 },
  ];
  const mano = { x: MX + 90, y: P - 560 };
  return (
    <EnLavadero leo={null} tenzo={null}
      cam={[mira(0, LAV.leo - 10, P - 360, 1.72), mira(loc(t0, 341.6), LAV.leo + 60, P - 420, 1.72, { curva: "inout" }), mira(loc(t0, 344.2), LAV.leo + 420, P - 440, 1.72, { curva: "inout" }), mira(243, LAV.leo + 700, P - 480, 1.72, { curva: "inout" })]}
      medio={<>
        <MaraEn x={MX} y={P - 20} s={1.15} p={{
          caras: [{ f: 0, v: "picaro" }, { f: tiros[0], v: "risa" }],
          poses: [{ f: 0, v: { hD: 60, cD: 60, hI: 40, cI: 70, cabeza: 10 } }, ...tiros.flatMap((t) => [{ f: t - 10, v: { hD: -30, cD: 70, tronco: -8, hI: 30, cI: 40 } }, { f: t, v: { hD: 140, cD: 10, tronco: 10, hI: 30, cI: 40, cabeza: -10 } }])],
          miradas: [{ f: 0, v: { x: 0.8, y: -0.6 } }],
        }} />
        <Actor {...leoLav({ poses: [{ f: 0, v: SENTADO_TEL }, { f: tiros[0], v: { ...SENTADO_TEL, cabeza: -6 } }, { f: tiros[1], v: { ...SENTADO, hD: 60, cD: 70, cabeza: -16, tronco: -6 } }], enManoD: <Tel />,
          caras: [{ f: 0, v: "triste" }, { f: tiros[1], v: "sorpresa" }, { f: tiros[2] + 10, v: "triste" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: tiros[0], v: { x: 0.5, y: -0.7 } }, { f: tiros[2], v: { x: 0.4, y: -1 } }] })} />
        {items.map((it, i) => <Icono key={i} {...it} desde={tiros[i]} de={mano} />)}
        {/* la escalera sigue fuera del cuadro: escalones que se pierden arriba */}
        {[0, 1].map((k) => <Icono key={`m${k}`} d="?" x={LAV.leo + 1290 + k * 230} y={P - 660 - k * 50} s={1.0 + k * 0.1} desde={tiros[3] + 8 + k * 10} de={{ x: LAV.leo + 1040, y: P - 620 }} />)}
      </>}
      hud={<>
        <TextoMano texto="a bigger car." x={960} y={300} desde={loc(t0, 343.3)} hasta={loc(t0, 344.3)} />
        <TextoMano texto="a bigger boat." x={960} y={300} desde={loc(t0, 344.3)} hasta={243} />
      </>} />
  );
};
// 345,5-348,2 · Alejandro, al pie de una estatua de dios gigante, se estira para medirse con ella
export const Dioses: React.FC = () => {
  const PA = AGORA_PISO, AX = 720, SX = 1720;
  const PIEDRA = { estilo: "frijol" as const, piel: "#d8d0bf", camisa: "#e6dfcf", miembro: "#d8d0bf", pantalon: "#e6dfcf", zapatos: "#cfc6b2", ceja: "#b9b09c", accesorios: [{ t: "pelo" as const, forma: "corto" as const, color: "#cfc6b2" }, { t: "barba" as const, color: "#cfc6b2" }, { t: "tunica" as const, color: "#e6dfcf", largo: 1 }] };
  return (
    <Escena Set={Agora} pal={PAL_ANT} seed={140} mano={1.4}
      claves={[mira(0, AX + 320, PA - 400, 0.9), mira(81, AX + 330, PA - 405, 0.86, { curva: "inout" })]}
      medio={<>
        <rect x={SX - 170} y={PA - 230} width={340} height={230} fill="#cfc6b2" stroke="#a89e88" strokeWidth={6} />
        <rect x={SX - 200} y={PA - 250} width={400} height={28} fill="#e2dac8" />
        <rect x={SX - 190} y={PA - 22} width={380} height={22} fill="#bfb6a0" />
        <text x={SX} y={PA - 110} textAnchor="middle" fontFamily="Georgia, serif" fontSize={54} letterSpacing={10} fill="#9a907a">ΖΕΥΣ</text>
        {[[SX - 120, PA - 200, SX - 90, PA - 150], [SX + 100, PA - 60, SX + 130, PA - 20]].map(([a, b, c, d], k) => <path key={k} d={`M${a},${b} L${(a + c) / 2 + 8},${(b + d) / 2} L${c},${d}`} stroke="#a89e88" strokeWidth={3} fill="none" />)}
        <g transform={`translate(${SX * 0.42},${-250 + PA * 0.42}) scale(0.58)`}>
          <Actor look={{ ...PIEDRA, accesorios: [...PIEDRA.accesorios, { t: "corona" as const, color: "#b9b09c" }] }} escala={REY_ESC * 2.3} seed={141} ruta={[{ f: 0, x: SX, y: PA }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "determinado" }]}
            poses={[{ f: 0, v: { hD: 150, cD: 10, hI: 30, cI: 40, cabeza: -6 } }]} sombra={0} />
        </g>
        <Halo x={SX} y={PA - 1100} r={420} color="#fff0b0" fuerza={0.35} />
        <Actor look={ALEJANDRO} escala={REY_ESC} seed={130} luz={{ lado: 1, color: "#fff0b0", fuerza: 1 }} ruta={[{ f: 0, x: AX, y: PA + 20 }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "manosCintura" }, { f: 20, v: { hD: 150, cD: 10, hI: -20, cI: 20, tronco: -6, cabeza: -18 } }, { f: 50, v: { hD: 160, cD: 4, hI: 140, cI: 10, tronco: -10, cabeza: -22 } }]}
          caras={[{ f: 0, v: "determinado" }, { f: 40, v: "enojo" }]} miradas={[{ f: 0, v: { x: 0.6, y: -0.9 } }]}
          ajuste={(p, fr) => ({ ...p, bajar: p.bajar - 10 * interpolate(fr, [20, 50], [0, 1], cl) })} />
      </>}
      hud={<TextoMano texto="…compared himself to the gods." x={960} y={900} desde={10} />} />
  );
};

// ============ E54 · 355,0-364,6 «the shadow is shrinking, but it is not finished… he's laughing at you…» ============
// la sombra se ACHICA dentro del cuadro, salta al hombro de Leo y le grita al oído, chiquita; Leo la espanta con la mano
export const SombraChica: React.FC = () => {
  const f = useF();
  const t0 = 355.0;
  const achica = [loc(t0, 356.5), loc(t0, 358.4)], salto = [loc(t0, 358.6), loc(t0, 359.2)];
  const l1 = loc(t0, 359.5), l2 = loc(t0, 360.9), l3 = loc(t0, 362.6);
  const sAtras = interpolate(f, achica, [1.45, 0.66], cl);
  const hombro = { x: LAV.leo + 10, y: P - 196 };
  const atras = { x: LAV.leo - 200, y: P - 30 };
  const u = interpolate(f, salto, [0, 1], cl);
  const espanta = interpolate(f, [l3, l3 + 8, l3 + 24], [0, 1, 0], cl);
  const mx = f < salto[0] ? atras.x : atras.x + (hombro.x - atras.x) * u + (f > salto[1] ? -20 * espanta : 0);
  const my = f < salto[0] ? atras.y : atras.y + (hombro.y - atras.y) * u - 120 * Math.sin(Math.PI * u) - (f > salto[1] ? 30 * espanta : 0);
  const pMara: Partial<ActorProps> = {
    caras: [{ f: 0, v: "feliz" }, { f: achica[0], v: "miedo" }, { f: salto[1], v: "risa" }, { f: l3, v: "sorpresa" }, { f: l3 + 24, v: "risa" }],
    habla: [[l1, l2 - 4], [l2, l3 - 4], [l3 + 20, 288]],
    poses: [{ f: 0, v: { hD: 60, cD: 60, hI: 40, cI: 70, cabeza: 14 } }, { f: achica[0], v: "encogerse" }, { f: salto[0], v: "celebrar" }, { f: salto[1] + 4, v: { hD: 95, cD: 0, tronco: 10 } },
      { f: l2, v: { hD: 150, cD: 10, hI: 150, cI: 10, cabeza: -10 } }, { f: l2 + 14, v: { hD: 95, cD: 0, tronco: 10 } }, { f: l3, v: "encogerse" }, { f: l3 + 26, v: { hD: 95, cD: 0, tronco: 12, cabeza: 10 } }],
  };
  return (
    <EnLavadero leo={null} tenzo={null}
      cam={[mira(0, LAV.leo - 110, P - 400, 1.45), mira(achica[1], LAV.leo - 70, P - 330, 1.85, { curva: "inout" }), mira(288, LAV.leo - 20, P - 330, 2.25, { curva: "inout" })]}
      medio={<>
        {f < salto[0] && <MaraEn x={atras.x} y={atras.y} s={sAtras} p={pMara} />}
        <Actor {...leoLav({ caras: [{ f: 0, v: "triste" }, { f: salto[1], v: "duda" }, { f: l1 + 10, v: "enojo" }, { f: l3 + 24, v: "triste" }],
          poses: [{ f: 0, v: SENTADO }, { f: salto[1], v: { ...SENTADO, cabeza: -10 } }, { f: l3 - 4, v: { ...SENTADO, hI: 150, cI: 70, cabeza: 10, tronco: -4 } }, { f: l3 + 22, v: SENTADO }, { f: l3 + 40, v: { ...SENTADO, cabeza: 16, tronco: 8 } }],
          miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: salto[1], v: { x: -0.8, y: -0.3 } }, { f: l3 + 30, v: { x: 0.4, y: 0.8 } }], giros: [{ f: 0, v: 0 }, { f: salto[1], v: -0.5 }, { f: l3 + 30, v: 0 }] })} />
        {f >= salto[0] && <MaraEn x={mx} y={my} s={0.66} p={{ ...pMara, dir: [{ f: 0, v: 1 }] }} />}
      </>}
      hud={<>
        <ManoMara texto="he's laughing at you." x={960} y={300} desde={l1} hasta={l2} />
        <ManoMara texto="everyone is laughing at you." x={960} y={300} desde={l2} hasta={l3} />
        <ManoMara texto="delivery boy forever." x={960} y={300} desde={l3} />
      </>} />
  );
};

// ============ E63 · 410,4-423,2 la respuesta de Tyler ============
// A) el chat (teléfono entero en cuadro); B) Tyler de verdad, a las 3 a. m., solo frente a la laptop: las llaves en
// leasing, se frota los ojos, levanta la foto de su papá; C) el chat otra vez: «You still draw?» y la cara de Leo
const TylerNoche: React.FC = () => {
  const f = useF();
  const t0 = 414.9;
  const llaves = 0, ojos = loc(t0, 416.3), papa = loc(t0, 418.1);
  const PT = 1010, TX = 700;
  const cerca = f >= papa;
  const z = cerca ? interpolate(f, [papa, 60 + papa], [1.5, 1.56], cl) : interpolate(f, [0, papa], [1.02, 1.1], cl);
  const cx = cerca ? 830 : 900, cy = cerca ? 560 : 600;
  const Foto = <g transform="rotate(-80)"><rect x={-34} y={-44} width={68} height={88} rx={4} fill="#6a4a2a" /><rect x={-26} y={-36} width={52} height={66} fill="#e9e1cf" /><circle cx={-8} cy={-14} r={9} fill="#7a6a5a" /><circle cx={12} cy={-8} r={7} fill="#c9a07a" /><rect x={-16} y={-4} width={16} height={26} fill="#7a6a5a" /><rect x={6} y={0} width={12} height={20} fill="#3a5a8a" /></g>;
  return (
    <AbsoluteFill style={{ background: "#11141b", overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960,540) scale(${z}) translate(${-cx},${-cy})`}>
          <rect x={-200} y={-200} width={2400} height={1500} fill="#161a22" />
          {/* el ventanal de la torre de vidrio: la ciudad que brillaba en el reel, ahora de noche y vacía */}
          <rect x={1000} y={90} width={860} height={700} fill="#0d1220" />
          {[[1030, 300, 120], [1180, 180, 150], [1360, 380, 110], [1500, 240, 140], [1680, 330, 150]].map(([x, top, w], i) => (
            <g key={i}><rect x={x} y={top} width={w} height={790 - top} fill="#1b2232" />
              {Array.from({ length: 18 }).map((_, k) => <rect key={k} x={x + 10 + (k % 4) * (w / 4.4)} y={top + 14 + Math.floor(k / 4) * 34} width={14} height={18} fill={ACENTO} opacity={((k + i) % 5 === 0) ? 0.7 : 0.12} />)}</g>
          ))}
          {[1430, 1000 + 430].map((x, i) => <rect key={i} x={x - 6} y={90} width={12} height={700} fill="#2a2f3a" />)}
          <rect x={990} y={80} width={880} height={720} fill="none" stroke="#2a2f3a" strokeWidth={20} />
          <rect x={-200} y={PT} width={2400} height={300} fill="#1d2129" />
          {/* escritorio + laptop + llaves + foto */}
          <rect x={780} y={PT - 250} width={520} height={22} rx={4} fill="#3a3330" />
          <rect x={800} y={PT - 228} width={18} height={228} fill="#2e2926" /><rect x={1262} y={PT - 228} width={18} height={228} fill="#2e2926" />
          <Laptop x={1040} y={PT - 250} brillo={1} />
          {f < ojos && <Halo x={TX + 90} y={PT - 470} r={200} color="#9fb8e0" fuerza={0.2} />}
          {f >= papa + 6 ? null : <g transform={`translate(1220,${PT - 250})`}><g transform="rotate(-8)"><rect x={-30} y={-80} width={60} height={80} rx={4} fill="#6a4a2a" /><rect x={-22} y={-72} width={44} height={60} fill="#e9e1cf" /></g></g>}
          <Actor look={TYLER} escala={ESC * 1.55} seed={31} luz={{ lado: 1, color: "#9fb8e0", fuerza: 0.8 }} ruta={[{ f: 0, x: TX, y: PT }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 62 }]}
            poses={[{ f: llaves, v: { ...SENTADO, hD: 120, cD: 40, cabeza: 6 } }, { f: 24, v: { ...SENTADO, hD: 112, cD: 50, cabeza: 10 } }, { f: ojos - 4, v: { ...SENTADO, hD: 50, cD: 70, hI: 40, cI: 60 } },
              { f: ojos + 6, v: { ...SENTADO, hD: 40, cD: 150, hI: 45, cI: 145, cabeza: 18, tronco: 14 } }, { f: papa - 8, v: { ...SENTADO, hD: 60, cD: 60, tronco: 10 } }, { f: papa + 6, v: { ...SENTADO, hD: 85, cD: 70, cabeza: 14, tronco: 10 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: 30, v: "cansado" }, { f: ojos, v: "cansado" }, { f: papa + 6, v: "triste" }]}
            miradas={[{ f: 0, v: { x: 0.6, y: -0.2 } }, { f: ojos, v: { x: 0.4, y: 0.5 } }, { f: papa + 6, v: { x: 0.7, y: 0.3 } }]}
            enManoD={(fr) => (fr < ojos - 6 ? <g transform="scale(1.5)"><circle cx={0} cy={0} r={8} fill="#c9ccd2" /><rect x={6} y={-3} width={22} height={6} rx={3} fill="#c9ccd2" /><rect x={-4} y={8} width={30} height={16} rx={3} fill="#f4efe4" /></g> : fr >= papa + 6 ? Foto : null)} />
        </g>
      </svg>
      <RelojDia min={201} x={1640} y={150} />
      <TextoMano texto="the car is leased." x={960} y={300} desde={0} hasta={ojos} />
      <TextoMano texto="80 hours a week." x={960} y={300} desde={ojos} hasta={papa} />
      <TextoMano texto="haven't seen my dad in a year." x={960} y={300} desde={papa} />
    </AbsoluteFill>
  );
};
export const ChatTyler: React.FC = () => {
  const t0 = 410.4;
  const B = loc(t0, 414.9), C = loc(t0, 420.1);
  return (
    <Cortes planos={[
      [0, <ConCara esquina="der" caras={[{ f: 0, v: "sorpresa" }, { f: loc(t0, 412.9), v: "duda" }]}><PantallaTel zoom0={0.9} zoom1={0.94} dur={B} luz={0.8}>
        <CabeceraChat nombre="Tyler" color="#3a5a8a" />
        <Burbuja texto="Congrats on the car man, hope you're good. For real." yo y={150} desde={-100} />
        <Burbuja texto="Leo! wow, thanks bro." y={400} desde={0} />
        <Burbuja texto="Honestly, not that good." y={510} desde={loc(t0, 412.9)} />
      </PantallaTel></ConCara>],
      [B, <TylerNoche />],
      [C, <ConCara esquina="der" caras={[{ f: 0, v: "triste" }, { f: loc(420.1, 421.9), v: "sorpresa" }, { f: loc(420.1, 422.5), v: "feliz" }]}><PantallaTel zoom0={0.92} zoom1={0.97} dur={96} luz={0.8}>
        <CabeceraChat nombre="Tyler" color="#3a5a8a" />
        <Burbuja texto="The car is leased. I work 80 hours a week. Haven't seen my dad in a year." y={150} desde={-100} />
        <Burbuja texto="Miss art class sometimes." y={440} desde={0} />
        <Burbuja texto="You still draw?" y={560} desde={loc(420.1, 421.9)} />
      </PantallaTel></ConCara>],
    ]} />
  );
};

// ============ ACTO 5 · el domingo sin nada (453,1-494,3): cada escena con otro encuadre y otra acción ============
// E68 · 453,1-457,6 «something happens… nothing. No notifications»: inserto del teléfono en la mano, pantalla vacía
const PantallaVacia: React.FC = () => (
  <g>
    <rect x={-62} y={-250} width={124} height={250} rx={16} fill="#121218" stroke="#34343e" strokeWidth={5} />
    <rect x={-54} y={-238} width={108} height={226} rx={9} fill="#1f2430" />
    <text x={0} y={-178} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={34} fill="#f4efe4">3:40</text>
    <text x={0} y={-156} textAnchor="middle" fontFamily={F_HUD} fontSize={11} fill="#b9c0cc">Sunday, rain</text>
    <rect x={-44} y={-120} width={88} height={30} rx={8} fill="#2c3240" />
    <text x={0} y={-101} textAnchor="middle" fontFamily={F_HUD} fontSize={10} fill="#d9dee6">No notifications</text>
  </g>
);
export const NadaPasa: React.FC = () => (
  <Cortes planos={[[0, <NadaPasaA />], [loc(453.1, 455.2), <NadaPasaB />]]} />
);
const NadaPasaB: React.FC = () => {
  const t0 = 455.2;
  const baja = loc(t0, 455.9), mira2 = loc(t0, 456.6);
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, CTO.colchon + 40, PC - 250, 2.4), mira(72, CTO.colchon + 30, PC - 255, 2.55, { curva: "inout" })]}
      medio={<Actor {...leoCto({ enManoD: (fr: number) => (fr < baja + 6 ? <Tel /> : null),
        poses: [{ f: 0, v: SENTADO_TEL }, { f: baja, v: { ...SENTADO, hD: 20, cD: 40, hI: 30, cI: 70, tronco: 8 } }, { f: mira2, v: { ...SENTADO, hD: 20, cD: 40, hI: 30, cI: 70, tronco: -2, cabeza: -12 } }],
        caras: [{ f: 0, v: "duda" }, { f: baja, v: "cansado" }, { f: mira2, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: mira2, v: { x: -0.8, y: -0.6 } }] })} />} />
  );
};
const NadaPasaA: React.FC = () => (
  <Inserto objeto={<PantallaVacia />} objetoAlto={250} objetoAncho={124} look={LEO} pal={PAL} acento={ACENTO} accion="girar" esquina="der"
    caras={[{ f: 0, v: "neutral" }, { f: 30, v: "duda" }, { f: 54, v: "sorpresa" }]} />
);
// E69 · 457,6-461,6 «no shadow, no Tyler, no girls made of light»: Leo se para y busca; los tres aparecen como fantasmas y revientan
export const Fantasmas: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 457.6;
  const s1 = loc(t0, 458.8), s2 = loc(t0, 459.8), s3 = loc(t0, 460.8);
  const X = CTO.colchon + 40;
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, X + 40, PC - 300, 1.9), mira(120, X + 60, PC - 300, 2.0, { curva: "inout" })]}
      medio={<>
        {pared}
        <Fantasma look={MARA} x={X - 330} y={PC} escala={ESC * 1.15} desde={s1 - 12} pop={s1 + 22} dir={1} cara="risa" pose={[{ f: 0, v: { hD: 60, cD: 60, hI: 40, cI: 70 } }]} />
        <Fantasma look={TYLER} x={X + 330} y={PC} escala={ESC} desde={s2 - 10} pop={s2 + 22} dir={-1} cara="risa" pose={[{ f: 0, v: "saludar" }]} />
        <Fantasma look={LUZ_CHICA} x={X + 520} y={PC} escala={ESC} desde={s3 - 10} pop={s3 + 18} dir={-1} cara="feliz" pose={[{ f: 0, v: { hD: 100, cD: 30 } }]} />
        <Actor {...leoCto({ ruta: [{ f: 0, x: X - 40, y: PC }, { f: 14, x: X - 40, y: PC }, { f: 40, x: X, y: PC }], asiento: [{ f: 0, v: CTO.COLCHON_ALTO }, { f: 12, v: undefined }],
          poses: [{ f: 0, v: SENTADO }, { f: 12, v: "parado" }, { f: s1, v: { hI: 30, cI: 60, hD: 20, cD: 40, cabeza: 6 } }, { f: s2, v: { hD: 80, cD: 30 } }, { f: s3, v: "encogerse" }],
          dir: [{ f: 0, v: 1 }, { f: s1 - 8, v: -1 }, { f: s2 - 8, v: 1 }],
          caras: [{ f: 0, v: "neutral" }, { f: s1, v: "duda" }, { f: s2, v: "sorpresa" }, { f: s3, v: "duda" }], miradas: [{ f: 0, v: { x: 0.5, y: 0 } }, { f: s1, v: { x: 0.9, y: 0 } }, { f: s3, v: { x: 0.9, y: 0.1 } }] })} />
      </>} />
  );
};
// E70 · 461,6-467,0 «Just a quiet room, a Sunday afternoon, and nothing to do»: general corto del cuarto con lluvia y Leo
// va hasta la ventana, apoya la mano en el vidrio y mira la lluvia
const VidrioLluvia: React.FC = () => {
  const f = useF();
  return (
    <g>
      <rect x={-140} y={-280} width={280} height={280} rx={6} fill="#2c3a4c" stroke="#3a3330" strokeWidth={12} />
      {[[-130, -120, 60], [-62, -170, 54], [-2, -100, 60], [62, -150, 66]].map(([x, top, w], i) => <g key={i}><rect x={x} y={top} width={w} height={-top} fill="#141a26" />
        {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={x + 8 + (k % 3) * 17} y={top + 12 + Math.floor(k / 3) * 22} width={8} height={11} fill={ACENTO} opacity={(k + i) % 3 ? 0.7 : 0.2} />)}</g>)}
      {Array.from({ length: 18 }).map((_, k) => { const x0 = -130 + (k * 47) % 260, y0 = -280 + ((f * (6 + (k % 3)) + k * 61) % 300); return <line key={k} x1={x0} y1={y0} x2={x0 - 4} y2={y0 + 20} stroke="#c9d6e6" strokeWidth={2} opacity={0.55} />; })}
      <rect x={-6} y={-280} width={12} height={280} fill="#3a3330" />
    </g>
  );
};
export const ALaVentana: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => (
  <Cortes planos={[[0, <ALaVentanaA pared={pared} />], [loc(461.6, 465.3), <Inserto objeto={<VidrioLluvia />} objetoAlto={280} objetoAncho={280} look={LEO} pal={PAL} acento={ACENTO} accion="tocar" toques={[8]} esquina="der"
    caras={[{ f: 0, v: "cansado" }, { f: 30, v: "triste" }]} />]]} />
);
export const ALaVentanaA: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 461.6;
  const VX = CTO.colchon - 400 + 125; // centro de la ventana
  const llega = 50, apoya = 70;
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, CTO.colchon - 120, PC - 360, 1.15), mira(llega - 2, CTO.colchon - 140, PC - 360, 1.2), mira(llega, VX + 70, PC - 300, 2.2), mira(111, VX + 60, PC - 300, 2.35, { curva: "inout" })]}
      medio={<>
        {pared}
        <Actor {...leoCto({ ruta: [{ f: 0, x: CTO.colchon - 40, y: PC }, { f: 6, x: CTO.colchon - 40, y: PC }, { f: llega + 10, x: VX + 95, y: PC }], asiento: [{ f: 0, v: undefined }],
          dir: [{ f: 0, v: -1 }],
          poses: [{ f: 0, v: "parado" }, { f: llega + 10, v: { hI: 40, cI: 30 } }, { f: apoya, v: { hD: 30, cD: 40, hI: 30, cI: 40, cabeza: -14 } }, { f: 100, v: { hD: 34, cD: 46, hI: 30, cI: 40, cabeza: -8, tronco: 4 } }],
          caras: [{ f: 0, v: "neutral" }, { f: apoya + 6, v: "cansado" }, { f: 120, v: "triste" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: llega, v: { x: -0.6, y: -0.8 } }] })} />
      </>}
      hud={<TextoMano texto="sunday · 3:40 pm" x={960} y={300} desde={loc(t0, 463.9)} />} />
  );
};

// E71 · 467,0-471,0 «Leo Marsh, twenty-four years old, sitting on his mattress with his hands»: vuelve, se sienta, manos al regazo
export const SeSienta: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 467.0;
  const sienta = loc(t0, 469.5);
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, CTO.colchon - 200, PC - 300, 2.0), mira(sienta - 10, CTO.colchon - 10, PC - 270, 2.1, { curva: "fluida" }), mira(120, CTO.colchon + 20, PC - 255, 2.45, { curva: "inout" })]}
      medio={<>
        {pared}
        <Actor {...leoCto({ ruta: [{ f: 0, x: CTO.colchon - 260, y: PC }, { f: sienta - 8, x: CTO.colchon, y: PC }], asiento: [{ f: 0, v: undefined }, { f: sienta, v: CTO.COLCHON_ALTO }],
          dir: [{ f: 0, v: 1 }],
          poses: [{ f: 0, v: "parado" }, { f: sienta, v: SENTADO }, { f: sienta + 14, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70, tronco: 8, cabeza: 8 } }, { f: sienta + 30, v: { ...SENTADO, hD: 34, cD: 66, hI: 34, cI: 66, tronco: 12, cabeza: 18 } }],
          caras: [{ f: 0, v: "neutral" }, { f: sienta + 10, v: "cansado" }, { f: sienta + 30, v: "triste" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: sienta, v: { x: 0.3, y: 0.8 } }, { f: sienta + 30, v: { x: 0.1, y: 1 } }] })} />
      </>}
      hud={<TextoMano texto="leo marsh · 24" x={960} y={900} desde={loc(t0, 467.5)} />} />
  );
};
// E72 · 471,0-479,0 «realizes he has absolutely no idea what to do with himself. The silence gets louder and louder.»
// A) a la altura del colchón: agarra un lápiz, lo mira, lo suelta, se encoge de hombros
// B) el reloj de la pared hace tic-tac cada vez más fuerte (ondas) y Leo se tapa los oídos
const Lapiz = <g transform="rotate(-70) scale(1.3)"><rect x={-4} y={-46} width={8} height={46} fill="#e9b84a" /><path d="M-4,-46 L0,-58 L4,-46 Z" fill="#e8d6b0" /><rect x={-4} y={-4} width={8} height={6} fill="#d27a8a" /></g>;
export const SinIdea: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 471.0;
  const B = loc(t0, 476.4);
  return <Cortes planos={[[0, <SinIdeaA pared={pared} />], [B, <Silencio pared={pared} />]]} />;
};
const SinIdeaA: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const f = useF();
  const t0 = 471.0;
  const agarra = loc(t0, 473.0), suelta = loc(t0, 474.6), encoge = loc(t0, 475.1);
  const LX = CTO.colchon + 120, LY = PC - CTO.COLCHON_ALTO + 2;
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, CTO.colchon + 60, PC - 190, 2.05, { rot: -2 }), mira(162, CTO.colchon + 50, PC - 200, 2.2, { rot: -1, curva: "inout" })]}
      medio={<>
        {pared}
        {(f < agarra || f >= suelta) && <g transform={`translate(${f < agarra ? LX : LX + 20},${LY - (f >= suelta ? interpolate(f, [suelta, suelta + 8], [70, 0], cl) : 0)}) rotate(90)`}>{Lapiz}</g>}
        <Actor {...leoCto({
          poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70, tronco: 8 } }, { f: 36, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70, cabeza: -10 } }, { f: agarra - 12, v: { ...SENTADO, hD: 20, cD: 20, tronco: 18 } },
            { f: agarra + 6, v: { ...SENTADO, hD: 80, cD: 90, cabeza: 10 } }, { f: suelta, v: { ...SENTADO, hD: 60, cD: 30 } }, { f: encoge, v: { ...SENTADO, ...{ hI: 40, cI: 120, hD: 45, cD: 115, cabeza: 12, tronco: 10 } } }, { f: encoge + 30, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70, tronco: 8 } }],
          caras: [{ f: 0, v: "neutral" }, { f: 36, v: "duda" }, { f: agarra + 6, v: "neutral" }, { f: suelta, v: "cansado" }], habla: [],
          miradas: [{ f: 0, v: { x: 0.4, y: 0.6 } }, { f: 30, v: { x: -0.8, y: -0.3 } }, { f: 50, v: { x: 0.8, y: -0.3 } }, { f: agarra - 12, v: { x: 0.6, y: 0.8 } }, { f: agarra + 6, v: { x: 0.7, y: 0.2 } }, { f: encoge, v: { x: 0.2, y: -0.2 } }],
          enManoD: (fr: number) => (fr >= agarra && fr < suelta ? Lapiz : null) })} />
      </>}
      hud={<ManoLeo texto="…now what?" x={960} y={300} desde={loc(t0, 474.0)} />} />
  );
};
const Silencio: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const f = useF();
  const t0 = 476.4;
  const tapa = loc(t0, 477.2);
  const RX = CTO.colchon - 300, RY = PC - 430;
  const ticks = Array.from({ length: 12 }).map((_, k) => Math.round(k * 7 - k * k * 0.12));
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, CTO.colchon - 140, PC - 330, 1.6), mira(78, CTO.colchon - 120, PC - 320, 1.85, { curva: "inout" })]}
      medio={<>
        {pared}
        <Prop name="reloj" x={RX} y={RY} entra="ya" s={1.1} sombra={false} />
        {ticks.map((t, k) => {
          const u = (f - t) / 20;
          if (u < 0 || u > 1) return null;
          return <circle key={k} cx={RX} cy={RY - 40} r={50 + u * (140 + k * 30)} fill="none" stroke="#e9e3d6" strokeWidth={3 + k * 0.6} opacity={(0.25 + k * 0.05) * (1 - u)} />;
        })}
        <Actor {...leoCto({
          poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70, tronco: 8 } }, { f: tapa - 6, v: { ...SENTADO, hD: 60, cD: 60, hI: 60, cI: 60 } }, { f: tapa + 4, v: { ...SENTADO, hD: 120, cD: 140, hI: 120, cI: 140, cabeza: 14, tronco: 14 } }, { f: 70, v: { ...SENTADO, hD: 124, cD: 146, hI: 122, cI: 144, cabeza: 18, tronco: 18, bajar: 4 } }],
          caras: [{ f: 0, v: "duda" }, { f: tapa, v: "miedo" }], miradas: [{ f: 0, v: { x: -0.8, y: -0.5 } }, { f: tapa, v: { x: 0, y: 0.4 } }] })} />
      </>}
      hud={<TextoMano texto="tick… tick… TICK" x={960} y={300} desde={8} />} />
  );
};
// E73 · 479,0-488,2 «his hand starts to itch… from somewhere very far away he hears a tiny voice. Not the shadow. Something worse.»
// A) inserto: la mano que pica, encima del teléfono boca abajo; B) Leo gira la cabeza: en la puerta, lejos, el aburrimiento
const TelDorso: React.FC = () => (
  <g><rect x={-62} y={-250} width={124} height={250} rx={16} fill="#1a1a20" stroke="#34343e" strokeWidth={5} />
    <rect x={-44} y={-232} width={36} height={52} rx={10} fill="#2a2a32" /><circle cx={-26} cy={-216} r={9} fill="#0c0c10" /><circle cx={-26} cy={-194} r={7} fill="#0c0c10" /></g>
);
export const ABURRIDO = { estilo: "frijol" as const, piel: "#b9b6b0", camisa: "#8f8c87", miembro: "#b9b6b0", pantalon: "#7f7c77", zapatos: "#6f6c67", ceja: "#6f6c67", accesorios: [{ t: "pelo" as const, forma: "calvo" as const, color: "#b9b6b0" }] };
export const Picazon2: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 479.0;
  const B = loc(t0, 482.2);
  return (
    <Cortes planos={[
      [0, <Inserto objeto={<TelDorso />} objetoAlto={250} objetoAncho={124} look={LEO} pal={PAL} acento={ACENTO} accion="tocar" toques={[14, 30, 44, 56, 66, 76, 84]} esquina="der"
        caras={[{ f: 0, v: "neutral" }, { f: 24, v: "duda" }, { f: 70, v: "enojo" }]} />],
      [B, <LaVozLejos pared={pared} />],
    ]} />
  );
};
export const LaVozLejos: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 482.2;
  return <Cortes planos={[[0, <VozB1 pared={pared} />], [loc(t0, 484.2), <VozB2 pared={pared} />], [loc(t0, 486.9), <VozB3 pared={pared} />]]} />;
};
export const ABX = CTO.colchon - 620;
export const VozB1: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => (
  <EnCuarto dia momento="lluvia" leo={null}
    cam={[mira(0, CTO.colchon + 40, PC - 260, 2.4), mira(60, CTO.colchon + 40, PC - 262, 2.5, { curva: "inout" })]}
    medio={<>{pared}<Actor {...leoCto({ poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70 } }, { f: 14, v: { ...SENTADO, hD: 50, cD: 40, hI: 30, cI: 70, tronco: 10 } }, { f: 34, v: { ...SENTADO, hD: 30, cD: 90, hI: 70, cI: 80, tronco: 2 } }],
      caras: [{ f: 0, v: "enojo" }, { f: 30, v: "duda" }], miradas: [{ f: 0, v: { x: 0.7, y: 0.7 } }, { f: 30, v: { x: -0.4, y: -0.2 } }] })} /></>} />
);
const VozB2: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const f = useF();
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, CTO.colchon - 260, PC - 270, 1.9), mira(81, CTO.colchon - 300, PC - 265, 2.0, { curva: "inout" })]}
      medio={<>
        {pared}
        <g opacity={interpolate(f, [4, 16], [0, 1], cl)}>
          <Actor look={ABURRIDO} escala={ESC * 0.62} seed={88} ruta={[{ f: 0, x: ABX, y: PC - 30 }]} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "cansado" }, { f: 50, v: "picaro" }]} habla={[[12, 44]]} poses={[{ f: 0, v: "saludar" }, { f: 20, v: { hD: 120, cD: 40 } }, { f: 36, v: "saludar" }, { f: 56, v: "manosCintura" }]} />
        </g>
        <Actor {...leoCto({ dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70, tronco: -4, cabeza: -6 } }],
          caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: -1, y: -0.1 } }], giros: [{ f: 0, v: -0.8 }] })} />
      </>}
      hud={<TextoMano texto="bored?" x={960} y={300} desde={12} color="#c9c6c0" />} />
  );
};
export const VozB3: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => (
  <EnCuarto dia momento="lluvia" leo={null}
    cam={[mira(0, CTO.colchon + 10, PC - 270, 2.5), mira(39, CTO.colchon + 10, PC - 272, 2.6, { curva: "inout" })]}
    medio={<>{pared}<Actor {...conReaccion(leoCto({ dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70 } }, { f: 8, v: { ...SENTADO, hD: 110, cD: 120, hI: 105, cI: 125, tronco: -8, cabeza: -8 } }],
      caras: [{ f: 0, v: "miedo" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }] }), "miedo", 0, 30)} /></>}
    hud={<TextoMano texto="something worse." x={960} y={300} desde={4} color="#c9c6c0" />} />
);

// E74 · 488,2-494,3 «Boredom. Who is your Tyler, and what don't they post at three in the morning? Tell me below»
// Leo frente a sus dibujos, se da vuelta a cámara, señala al que mira y después abajo (los comentarios)
export const TuTyler: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 488.2;
  const quien = loc(t0, 488.9), que = loc(t0, 490.6), abajo = loc(t0, 492.6);
  const X = CTO.colchon + 230;
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, X + 30, PC - 330, 2.25), mira(quien, X + 10, PC - 310, 2.4, { curva: "inout" }), mira(183, X + 10, PC - 300, 2.55, { curva: "inout" })]}
      medio={<>
        {pared}
        <Actor {...leoCto({ ruta: [{ f: 0, x: X, y: PC }], asiento: [{ f: 0, v: undefined }], dir: [{ f: 0, v: -1 }, { f: quien - 8, v: 1 }],
          poses: [{ f: 0, v: { hD: 30, cD: 40, cabeza: -8 } }, { f: quien, v: { hD: 95, cD: 0, tronco: 4 } }, { f: que, v: { hD: 60, cD: 80, hI: 60, cI: 80, cabeza: 6 } }, { f: abajo, v: { hD: 40, cD: -10, tronco: 8, cabeza: 10 } }],
          caras: [{ f: 0, v: "cansado" }, { f: quien, v: "determinado" }, { f: que, v: "duda" }, { f: abajo, v: "feliz" }],
          miradas: [{ f: 0, v: { x: 0.5, y: -0.6 } }, { f: quien, v: { x: 1, y: 0 } }, { f: abajo, v: { x: 0.8, y: 0.6 } }] })} />
      </>}
      hud={<>
        <TextoMano texto="boredom." x={960} y={300} desde={0} hasta={quien} color="#c9c6c0" />
        <ManoLeo texto="who is your tyler?" x={960} y={300} desde={quien} hasta={que} />
        <ManoLeo texto="what don't they post at 3 a.m.?" x={960} y={300} desde={que} hasta={abajo} />
        <ManoLeo texto="tell me below ↓" x={960} y={300} desde={abajo} />
      </>} />
  );
};
// E75 · 494,3-502,9 «tomorrow night Tenzo will tell Leo about a monk who stared at a wall for nine years… the door»
// A) el lavadero a la noche: Leo llega y se sienta, Tenzo levanta el farol; B) el monje frente a la pared, los años que
// corren; C) Tenzo y Leo en dos: el farol se apaga
export const Manana: React.FC = () => {
  const t0 = 494.3;
  const B = loc(t0, 497.0), C = loc(t0, 499.7);
  return <Cortes planos={[[0, <LlegaLeo />], [B, <LaPared />], [C, <SeApaga />]]} />;
};
const LlegaLeo: React.FC = () => (
  <EnLavadero leo={null} abrigo={null}
    tenzo={{ caras: [{ f: 0, v: "neutral" }, { f: 40, v: "feliz" }], poses: [{ f: 0, v: TENZO_MESA }, { f: 30, v: { hD: 120, cD: 30, hI: 32, cI: 92, cabeza: -6 } }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }}
    extra={[leoLav({ ruta: [{ f: 0, x: LAV.leo - 420, y: P }, { f: 50, x: LAV.leo, y: P }], asiento: [{ f: 0, v: undefined }, { f: 58, v: 66 }], poses: [{ f: 0, v: "parado" }, { f: 58, v: SENTADO }, { f: 70, v: { ...SENTADO, hD: 80, cD: 30 } }],
      caras: [{ f: 0, v: "neutral" }, { f: 60, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] })]}
    cam={[mira(0, LAV.leo - 60, P - 270, 2.2), mira(50, LAV.leo + 20, P - 250, 2.3, { curva: "fluida" }), mira(81, LAV.leo + 40, P - 250, 2.45, { curva: "inout" })]}
    hud={<TextoMano texto="tomorrow night" x={960} y={300} desde={4} />} />
);
const LaPared: React.FC = () => {
  const f = useF();
  const anios = Math.min(9, 1 + Math.floor(f / 9));
  const MONJE = { ...TENZO, piel: "#d9a273", miembro: "#d9a273", camisa: "#b5532c", pantalon: "#b5532c", ceja: "#2a1a10", accesorios: [{ t: "pelo" as const, forma: "calvo" as const, color: "#d9a273" }, { t: "barba" as const, color: "#2a1a10" }, { t: "tunica" as const, color: "#b5532c", largo: 1 }] };
  const z = interpolate(f, [0, 81], [1.0, 1.08], cl);
  return (
    <AbsoluteFill style={{ background: "#2a2420", overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960,560) scale(${z}) translate(-960,-560)`}>
          {/* la pared de piedra de la cueva: bloques irregulares */}
          <rect x={0} y={0} width={1920} height={1080} fill="#4a4038" />
          {Array.from({ length: 40 }).map((_, k) => <rect key={k} x={(k % 8) * 250 - ((Math.floor(k / 8) % 2) * 120)} y={Math.floor(k / 8) * 170} width={238} height={160} rx={18} fill={k % 3 ? "#5a4e44" : "#544840"} />)}
          <rect x={0} y={880} width={1920} height={200} fill="#3a322c" />
          <Halo x={1320} y={500} r={520} color={ORO} fuerza={0.28} />
          <Actor look={MONJE} escala={ESC * 1.9} seed={150} luz={RIM_ORO} ruta={[{ f: 0, x: 1180, y: 880 }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 8 }]}
            poses={[{ f: 0, v: { tronco: -2, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 80, hD: 20, cD: 80, cabeza: 2 } }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: -1, y: 0 } }]} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 1350, top: 170, fontFamily: F_HUD, fontWeight: 600, fontSize: 120, color: ORO, textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>{anios}</div>
      <div style={{ position: "absolute", left: 1350, top: 310, fontFamily: F_HUD, fontWeight: 600, fontSize: 44, letterSpacing: 4, color: "#efe6d4" }}>{anios === 1 ? "YEAR" : "YEARS"} · ONE WALL</div>
    </AbsoluteFill>
  );
};
const SeApaga: React.FC = () => {
  const f = useF();
  const luz = interpolate(f, [20, 80], [1, 0.05], cl);
  return (
    <AbsoluteFill>
      <EnLavadero luzFarol={luz} abrigo={null}
        tenzo={{ caras: [{ f: 0, v: "feliz" }], poses: [{ f: 0, v: { hD: 120, cD: 30, hI: 32, cI: 92, cabeza: -6 } }, { f: 40, v: TENZO_MESA }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }}
        leo={{ caras: [{ f: 0, v: "duda" }, { f: 40, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }], poses: [{ f: 0, v: SENTADO }] }}
        cam={[mira(0, 1450, P - 270, 2.0), mira(93, 1460, P - 265, 2.15, { curva: "inout" })]}
        hud={<TextoMano texto="boredom might be the door." x={960} y={300} desde={8} />} />
      <Negro desde={74} d={18} />
    </AbsoluteFill>
  );
};
export type { Clave };

// ==================== SEGUNDA VUELTA (28-oct, tarde): las peores que no se habían tocado ====================
const DIO_VIEJO = { ...DIOGENES, accesorios: [{ t: "pelo" as const, forma: "calvo" as const, color: "#c99a70" }, { t: "barba" as const, color: "#ece6da" }, { t: "tunica" as const, color: "#9a8a6a", largo: 0.85 }] };
const PA2 = AGORA_PISO;

// E2 · 6,5-8,3 «The answer made history.»: perfil bajo del barril; Diógenes levanta la mano y le hace seña al rey de que se corra; la sombra se va
export const LaRespuesta: React.FC = () => {
  const f = useF();
  const u = interpolate(f, [22, 44], [0, 1], cl);
  return (
    <AbsoluteFill>
      <Escena Set={Agora} pal={PAL_ANT} seed={171} mano={1.2} claves={[mira(0, DIO.x + 250, PA2 - 200, 2.3), mira(54, DIO.x + 240, PA2 - 205, 2.45, { curva: "inout" })]}
        medio={<>
          <Barril x={BX} y={PA2} capa="atras" />
          <Actor look={DIOGENES} escala={ESC} seed={71} luz={{ lado: 1, color: "#ffd890", fuerza: 0.85 }} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 26 }]} {...{ ruta: [{ f: 0, x: DIO.x + 110, y: DIO.y }], caras: [{ f: 0, v: "cansado" }, { f: 14, v: "determinado" }, { f: 40, v: "feliz" }], habla: [[12, 34]],
            poses: [{ f: 0, v: { tronco: -30, pI: 80, rI: 10, pD: 70, rD: 20, hI: 40, cI: 120, hD: 30, cD: 130, cabeza: -14 } }, { f: 12, v: { tronco: -26, pI: 80, rI: 10, pD: 70, rD: 20, hI: 40, cI: 120, hD: 100, cD: 10, cabeza: -10 } },
              { f: 24, v: { tronco: -26, pI: 80, rI: 10, pD: 70, rD: 20, hI: 40, cI: 120, hD: 70, cD: 60, cabeza: -6 } }, { f: 32, v: { tronco: -26, pI: 80, rI: 10, pD: 70, rD: 20, hI: 40, cI: 120, hD: 110, cD: 0, cabeza: -6 } }, { f: 44, v: { tronco: -32, pI: 80, rI: 10, pD: 70, rD: 20, hI: 40, cI: 120, hD: 30, cD: 130, cabeza: -18 } }],
            miradas: [{ f: 0, v: { x: 0.9, y: -0.6 } }] }} />
          <Barril x={BX} y={PA2} capa="boca" />
          <SombraRey x={REY + 40 + u * 300} y={PA2 - 2} largo={620} fuerza={0.55 * (1 - u)} />
          <Halo x={DIO.x + 60} y={PA2 - 180} r={380} color="#fff0b0" fuerza={0.45 * u} />
        </>} />
      <Negro desde={46} d={6} />
    </AbsoluteFill>
  );
};

// E47 · 306,0-309,7 «Diogenes lived to almost 90 in the sun»: ya viejo, FUERA del barril: camina con su bastón hasta la fuente, se sienta y levanta la cara al sol
export const NoventaAlSol: React.FC = () => {
  const f = useF();
  const X = A.fuente - 260, sienta = 66;
  const baston = <g><line x1={0} y1={-6} x2={0} y2={150} stroke="#7a5a3a" strokeWidth={9} strokeLinecap="round" /></g>;
  return (
    <Escena Set={Agora} pal={PAL_ANT} seed={160} mano={1.4}
      claves={[mira(0, X - 240, PA2 - 40, 3.3), mira(40, X - 110, PA2 - 42, 3.35), mira(41, X + 10, PA2 - 220, 2.2, { rot: -2 }), mira(78, X + 10, PA2 - 224, 2.3, { rot: -2 }), mira(79, X + 20, PA2 - 165, 3.0, { rot: 3 }), mira(111, X + 20, PA2 - 168, 3.15, { rot: 3 })]}
      medio={<>
        <Halo x={X + 40} y={PA2 - 300} r={420} color="#fff0b0" fuerza={0.2 + 0.3 * interpolate(f, [sienta, 100], [0, 1], cl)} />
        {f >= 79 && [0, 1, 2, 3, 4].map((k) => <line key={k} x1={X + 260} y1={PA2 - 560} x2={X + 60 + k * 18} y2={PA2 - 330 + k * 6} stroke="#fff0b0" strokeWidth={10} strokeLinecap="round" opacity={0.25 + 0.12 * Math.sin(f / 9 + k)} />)}
        {f < 41 && [12, 26, 40].map((t) => { const u = (f - t) / 10; return u >= 0 && u < 1 ? <ellipse key={t} cx={X - 260 + (t / 56) * 260 + 40} cy={PA2 + 12} rx={14 + 30 * u} ry={4 + 6 * u} fill="none" stroke="#c9b48c" strokeWidth={4} opacity={1 - u} /> : null; })}
        <rect x={X - 120} y={PA2 - 60} width={260} height={60} rx={8} fill="#d8cdb6" stroke="#b5a88c" strokeWidth={4} />
        <ActorVivo look={DIO_VIEJO} escala={ESC} seed={71} luz={{ lado: 1, color: "#ffd890", fuerza: 1 }} ruta={[{ f: 0, x: X - 260, y: PA2 + 10 }, { f: sienta - 10, x: X, y: PA2 + 10 }]} correr={0} dir={[{ f: 0, v: 1 }]}
          asiento={[{ f: 0, v: undefined }, { f: sienta, v: 60 }]}
          poses={[{ f: 0, v: { tronco: 14, hD: 50, cD: 20, cabeza: 6 } }, { f: sienta, v: { ...SENTADO, hD: 40, cD: 30 } }, { f: sienta + 14, v: { ...SENTADO, hD: 30, cD: 50, hI: 30, cI: 50, tronco: -8, cabeza: -22 } }]}
          caras={[{ f: 0, v: "cansado" }, { f: sienta + 10, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0.2 } }, { f: sienta + 10, v: { x: 0.5, y: -1 } }]}
          enManoD={(fr: number) => (fr < sienta + 6 ? baston : null)} />
        {f >= sienta + 6 && <g transform={`translate(${X + 110},${PA2 - 150}) rotate(18)`}>{baston}</g>}
      </>}
      hud={<TextoMano texto="almost 90. in the sun." x={960} y={300} desde={loc(306.0, 308.3)} />} />
  );
};

// E3 · 8,3-11,6 «Day 14. 11 at night.»: perfil a la altura del colchón; Leo pasa con el pulgar, bosteza y se refriega los ojos, vuelve al teléfono
export const DiaCatorce: React.FC = () => {
  // vuelta 3: ACOSTADO boca arriba en el colchón (cabeza a la izquierda), el teléfono en alto sobre la cara; el pulgar pasa, se refriega los ojos
  const t0 = 8.3, ojos = loc(t0, 10.1);
  const PIES = CTO.colchon + 250;
  const ARR = { hD: 92, cD: 44, hI: 10, cI: 20, pI: 4, pD: -4, cabeza: -6 };
  const scroll = [4, 16, 28, 40].flatMap((a) => [{ f: a, v: { ...ARR, cD: 56 } }, { f: a + 5, v: ARR }]);
  return (
    <EnCuarto leo={null}
      cam={[mira(0, CTO.colchon + 30, PC - 150, 2.4, { rot: 2 }), mira(99, CTO.colchon + 20, PC - 155, 2.6, { rot: 1, curva: "inout" })]}
      medio={<g transform={`translate(0,${-CTO.COLCHON_ALTO - 52}) rotate(-90 ${PIES} ${PC})`}>
        <Actor {...leoCto({ ruta: [{ f: 0, x: PIES, y: PC }], asiento: [{ f: 0, v: undefined }], dir: [{ f: 0, v: 1 }], enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 0.9 },
          poses: [...scroll, { f: ojos - 4, v: { ...ARR, hI: 150, cI: 150 } }, { f: ojos + 4, v: { ...ARR, hI: 160, cI: 140, cabeza: -10 } }, { f: ojos + 12, v: { ...ARR, hI: 150, cI: 150 } }, { f: ojos + 26, v: ARR }, { f: 90, v: { ...ARR, cD: 56 } }],
          caras: [{ f: 0, v: "triste" }, { f: ojos - 2, v: "cansado" }, { f: ojos + 26, v: "triste" }], habla: [[ojos, ojos + 10]],
          miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: ojos, v: { x: 0.2, y: -0.4 } }, { f: ojos + 26, v: { x: 0.9, y: 0 } }] })} />
      </g>}
      hud={<RelojDia min={23 * 60} x={1640} y={150} desde={ojos} />} />
  );
};

// E5 · 17,5-21,5 «a glass apartment behind him, with the whole city shining in the window»: el depto de vidrio de Tyler, de día,
// él con las llaves en alto, se da vuelta al ventanal y abre los brazos; la ciudad brilla
export const DeptoVidrio: React.FC = () => {
  const f = useF();
  const t0 = 17.5;
  const gira = loc(t0, 19.4), abre = loc(t0, 21.0);
  const PT = 1000, TX = 900;
  const z = interpolate(f, [0, 120], [1.55, 1.3], cl);
  const brillo = (k: number) => 0.35 + 0.6 * Math.max(0, Math.sin(f / 7 + k * 1.7));
  return (
    <AbsoluteFill style={{ background: "#e9e4da", overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960,560) scale(${z}) translate(${-TX - 60},${-PT + 300})`}>
          <rect x={-400} y={-300} width={2800} height={1700} fill="#efe9de" />
          <rect x={300} y={160} width={1300} height={PT - 160} fill="#f6b46a" />
          <rect x={300} y={160} width={1300} height={300} fill="#f9cf8e" />
          {[[320, 520, 140], [480, 430, 120], [620, 560, 160], [800, 380, 130], [950, 500, 150], [1120, 420, 140], [1280, 540, 170], [1460, 460, 120]].map(([x, top, w], i) => (
            <g key={i}><rect x={x} y={top} width={w} height={PT - top} fill={i % 2 ? "#3a4a64" : "#2e3a52"} />
              {Array.from({ length: 16 }).map((_, k) => <rect key={k} x={x + 10 + (k % 4) * (w / 4.3)} y={top + 16 + Math.floor(k / 4) * 40} width={16} height={22} fill="#ffe6a8" opacity={brillo(k + i * 3)} />)}</g>
          ))}
          {[300, 625, 950, 1275, 1600].map((x) => <rect key={x} x={x - 8} y={150} width={16} height={PT - 150} fill="#cfd6de" />)}
          <rect x={290} y={140} width={1320} height={22} fill="#cfd6de" />
          <path d={`M420,180 L560,180 L380,${PT} L240,${PT} Z`} fill="#ffffff" opacity={0.18} />
          <rect x={-400} y={PT} width={2800} height={400} fill="#d9cdb8" />
          <rect x={1250} y={PT - 120} width={300} height={90} rx={22} fill="#3a3f4a" /><rect x={1240} y={PT - 40} width={320} height={40} rx={10} fill="#2e323b" />
          <Actor look={TYLER} escala={ESC * 1.5} seed={31} luz={{ lado: -1, color: "#ffd890", fuerza: 1 }} ruta={[{ f: 0, x: TX, y: PT }]} dir={[{ f: 0, v: 1 }, { f: gira, v: -1 }]}
            poses={[{ f: 0, v: { hD: 150, cD: 20, cabeza: -4 } }, { f: 14, v: { hD: 140, cD: 40, cabeza: -6 } }, { f: 28, v: { hD: 152, cD: 14 } }, { f: gira, v: { hD: 60, cD: 40, hI: 40, cI: 40 } }, { f: abre, v: "celebrar" }]}
            caras={[{ f: 0, v: "risa" }, { f: gira, v: "feliz" }, { f: abre, v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: gira, v: { x: -0.4, y: -0.5 } }]}
            enManoD={(fr: number) => (fr < gira ? <g transform="scale(1.5)"><circle cx={0} cy={0} r={8} fill="#2a2a30" /><rect x={-6} y={6} width={12} height={22} rx={4} fill="#1a1a20" /><circle cx={0} cy={-8} r={7} fill="none" stroke="#c9ccd2" strokeWidth={3} /></g> : null)} />
        </g>
      </svg>
      <TextoMano texto="a glass apartment." x={960} y={300} desde={loc(t0, 18.6)} hasta={loc(t0, 20.4)} />
      <TextoMano texto="the whole city shining." x={960} y={300} desde={loc(t0, 20.6)} />
    </AbsoluteFill>
  );
};

// E6 · 21,5-26,0 «25, and already made it. Grateful.»: Leo en su colchón; del teléfono sube la tarjeta del post; lo baja y mira su dibujo
export const YaLoLogro: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const f = useF();
  const t0 = 21.5;
  const sube = loc(t0, 22.9), baja = loc(t0, 24.6), mira2 = loc(t0, 25.3);
  const u = interpolate(f, [sube, sube + 16], [0, 1], { ...cl, easing: (t) => 1 - (1 - t) * (1 - t) });
  const X = CTO.silla - 60; // vuelta 3: en la silla del escritorio, no en el colchón (E3 y E12 ya son colchón)
  return (
    <EnCuarto leo={null} lampara
      cam={[mira(0, X + 80, PC - 235, 2.25), mira(135, X + 70, PC - 232, 2.4, { curva: "inout" })]}
      medio={<>
        {pared}
        <Actor {...leoCto({ enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 0.9 },
          ruta: [{ f: 0, x: X, y: PC }], asiento: [{ f: 0, v: 58 }],
          poses: [{ f: 0, v: { ...SENTADO, hD: 70, cD: 80, cabeza: 0, tronco: 0 } }, { f: baja, v: { ...SENTADO, hD: 8, cD: 10, cabeza: 12, tronco: 4 } }, { f: mira2, v: { ...SENTADO, hD: 4, cD: 6, hI: 4, cI: 6, cabeza: 16, tronco: 6 } }],
          caras: [{ f: 0, v: "duda" }, { f: sube + 10, v: "sorpresa" }, { f: baja, v: "triste" }], miradas: [{ f: 0, v: { x: 0.8, y: 0 } }, { f: sube, v: { x: 0.8, y: -0.5 } }, { f: mira2, v: { x: 0.3, y: 1 } }] })} />
        {u > 0 && f < baja + 10 && (
          <g transform={`translate(${X + 290},${PC - 215 - 50 * u}) scale(${0.4 + 0.75 * u})`} opacity={interpolate(f, [baja, baja + 10], [1, 0], cl)}>
            <Halo x={0} y={0} r={240} color={ACENTO} fuerza={0.25} />
            <rect x={-150} y={-120} width={300} height={200} rx={18} fill="#f4f4f6" stroke={ACENTO} strokeWidth={5} />
            <rect x={-136} y={-106} width={272} height={110} rx={10} fill="#a9c4e0" />
            <path d="M-80,-10 Q-78,-34 -56,-38 L-34,-60 Q0,-68 34,-60 L60,-38 Q80,-34 82,-10 Z" fill="#0f1014" />
            <text x={-134} y={30} fontFamily={F_HUD} fontWeight={700} fontSize={20} fill="#222">@tyler</text>
            <text x={-134} y={60} fontFamily={F_HUD} fontSize={19} fill="#333">25 & already made it. grateful 🙏</text>
          </g>
        )}
      </>} />
  );
};

// E9 · 49,6-57,0 «Tyler in Miami, Tyler in a suit, Tyler on a boat…»: Leo echado en el colchón pasa fotos; cada post sale del teléfono como una tarjeta
const Post: React.FC<{ tipo: "miami" | "traje" | "barco"; desde: number; x: number; y: number; rot: number; k?: number }> = ({ tipo, desde, x, y, rot, k = 0.72 }) => {
  const f = useF();
  if (f < desde) return null;
  const u = spring({ frame: f - desde, fps: FPS, config: { damping: 13, stiffness: 140 } });
  return (
    <g transform={`translate(${x},${y}) rotate(${rot * u}) scale(${(0.3 + 0.7 * u) * k})`}>
      <Halo x={0} y={0} r={220} color={ACENTO} fuerza={0.18} />
      <rect x={-120} y={-150} width={240} height={300} rx={16} fill="#f4f4f6" stroke="#2a2a30" strokeWidth={4} />
      <rect x={-108} y={-138} width={216} height={216} rx={8} fill={tipo === "miami" ? "#7ec4e8" : tipo === "traje" ? "#3a3f4a" : "#5aa8d8"} />
      {tipo === "miami" && <><rect x={-108} y={40} width={216} height={38} fill="#f0d9a0" /><path d="M-70,78 Q-64,10 -74,-40 M-74,-40 q-40,6 -50,34 M-74,-40 q40,0 50,30" stroke="#3a8a4a" strokeWidth={9} fill="none" strokeLinecap="round" /></>}
      {tipo === "barco" && <><rect x={-108} y={20} width={216} height={58} fill="#2a78b8" /><path d="M-96,24 L96,24 L76,60 L-76,60 Z" fill="#f4f4f6" /></>}
      <g transform="translate(20,72)"><Actor look={{ ...TYLER, ...(tipo === "traje" ? { camisa: "#1a1a20", accesorios: [{ t: "pelo" as const, forma: "corto" as const, color: "#6a4a2a" }, { t: "corbata" as const, color: "#8a2a2a" }] } : {}) }} escala={0.55} seed={31} ruta={[{ f: 0, x: 0, y: 0 }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "risa" }]} poses={[{ f: 0, v: tipo === "barco" ? "celebrar" : "saludar" }]} /></g>
      <text x={-104} y={118} fontFamily={F_HUD} fontWeight={700} fontSize={22} fill="#222">{tipo === "miami" ? "miami ☀" : tipo === "traje" ? "big day." : "no days off 🛥"}</text>
    </g>
  );
};
export const Posts: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 49.6;
  const m = loc(t0, 50.2), s = loc(t0, 51.6), b = loc(t0, 53.2), cansa = loc(t0, 55.3);
  const X = CTO.colchon;
  const flick = (a: number) => [{ f: a - 6, v: { ...SENTADO_TEL, hD: 60, cD: 100, cabeza: 4 } }, { f: a, v: { ...SENTADO_TEL, hD: 66, cD: 82, cabeza: 2 } }];
  return (
    <EnCuarto leo={null}
      cam={[mira(0, X + 250, PC - 320, 1.95), mira(b, X + 300, PC - 330, 1.85, { curva: "inout" }), mira(222, X + 290, PC - 310, 1.95, { curva: "inout" })]}
      medio={<>
        {pared}
        <Actor {...leoCto({ enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 0.9 },
          poses: [{ f: 0, v: { ...SENTADO_TEL, hD: 60, cD: 100 } }, ...flick(m), ...flick(s), ...flick(b), { f: cansa, v: { ...SENTADO_TEL, hD: 20, cD: 70, hI: 60, cI: 150, cabeza: 24, tronco: 16 } }, { f: cansa + 30, v: { ...SENTADO_TEL, hD: 20, cD: 70, cabeza: 30, tronco: 20 } }],
          caras: [{ f: 0, v: "duda" }, { f: m, v: "sorpresa" }, { f: s, v: "triste" }, { f: b, v: "sorpresa" }, { f: cansa, v: "cansado" }],
          miradas: [{ f: 0, v: { x: 0.6, y: -0.2 } }, { f: m, v: { x: 0.8, y: -0.6 } }, { f: s, v: { x: 0.9, y: -0.3 } }, { f: b, v: { x: 0.9, y: -0.8 } }, { f: cansa, v: { x: 0.2, y: 0.8 } }] })} />
        <Post tipo="miami" desde={m} x={X + 250} y={PC - 370} rot={-8} />
        <Post tipo="traje" desde={s} x={X + 455} y={PC - 385} rot={6} />
        <Post tipo="barco" desde={b} x={X + 660} y={PC - 370} rot={-4} />
      </>}
      hud={<TextoMano texto="never been tired in their lives." x={960} y={300} desde={loc(t0, 54.9)} />} />
  );
};

// E49-A · 316,8-319,3 «he points at the phone»: dos en el lavadero, Tenzo se inclina y le apunta al teléfono con los palillos
export const ApuntaTel: React.FC<{ palitos: React.ReactNode; medio?: React.ReactNode }> = ({ palitos, medio }) => (
  <EnLavadero medio={medio}
    leo={{ poses: [{ f: 0, v: { ...SENTADO, hD: 70, cD: 80, cabeza: 10 } }], enManoD: <Tel />, caras: [{ f: 0, v: "duda" }, { f: 40, v: "sorpresa" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: 36, v: { x: 0.9, y: -0.1 } }] }}
    tenzo={{ enManoD: palitos, caras: [{ f: 0, v: "neutral" }, { f: 30, v: "determinado" }], habla: [[27, 75]], dir: [{ f: 0, v: -1 }],
      poses: [{ f: 0, v: TENZO_MESA }, { f: 26, v: { hD: 95, cD: 0, tronco: 14, cabeza: 8, hI: 32, cI: 92 } }, { f: 50, v: { hD: 100, cD: -6, tronco: 18, cabeza: 6, hI: 32, cI: 92 } }], miradas: [{ f: 0, v: { x: -0.8, y: 0.4 } }] }}
    cam={[mira(0, LAV.leo + 260, P - 260, 2.15), mira(75, LAV.leo + 250, P - 255, 2.3, { curva: "inout" })]} />
);

// E55-A · 364,6-366,8 «what do I do?»: Leo pregunta con las manos abiertas, primer plano
export const ManosAbiertas: React.FC<{ caja?: React.ReactNode }> = ({ caja }) => (
  <EnLavadero medio={caja}
    leo={{ caras: [{ f: 0, v: "duda" }, { f: 30, v: "triste" }], habla: [[6, 52]], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }],
      poses: [{ f: 0, v: SENTADO }, { f: 8, v: { ...SENTADO, hD: 75, cD: 30, hI: 75, cI: 30, cabeza: -6 } }, { f: 30, v: { ...SENTADO, hD: 60, cD: 50, hI: 60, cI: 50, cabeza: 8, tronco: 6 } }, { f: 52, v: { ...SENTADO, hD: 80, cD: 20, hI: 80, cI: 20 } }] }}
    cam={[mira(0, LAV.leo + 40, P - 270, 2.4), mira(66, LAV.leo + 40, P - 272, 2.55, { curva: "inout" })]} />
);
// E55-B · 366,8-369,1 «Tenzo taps the folding table»: primer plano de Tenzo golpeando la mesa plegable, tres golpes con onda
export const GolpeMesa: React.FC<{ caja?: React.ReactNode }> = ({ caja }) => {
  const f = useF();
  const toques = [loc(366.8, 367.4), loc(366.8, 367.8), loc(366.8, 368.3)];
  const arriba = { ...TENZO_MESA, hD: 110, cD: 20, tronco: 8, cabeza: 10 }, golpe = { ...TENZO_MESA, hD: 80, cD: 30, tronco: 12, cabeza: 14 };
  const poses = [{ f: 0, v: TENZO_MESA }, ...toques.flatMap((t) => [{ f: t - 5, v: arriba }, { f: t, v: golpe }])];
  return (
    <EnLavadero medio={<><g transform={`translate(0,${-Math.max(0, ...toques.map((t) => (f >= t && f < t + 8 ? 22 * Math.sin(Math.PI * (f - t) / 8) : 0)))})`}>{caja}</g>{toques.map((t) => (f >= t && f < t + 6 ? [-1, 0, 1].map((k) => <path key={`${t}${k}`} d={`M${LAV.tenzo - 170 + k * 40},${P - 175} l${k * 14},-26`} stroke={ORO} strokeWidth={6} strokeLinecap="round" />) : null))}{toques.map((t) => { const u = (f - t) / 12; return u >= 0 && u < 1 ? <ellipse key={t} cx={LAV.tenzo - 170} cy={P - 152} rx={30 + 110 * u} ry={10 + 30 * u} fill="none" stroke={ORO} strokeWidth={5} opacity={1 - u} /> : null; })}</>}
      tenzo={{ caras: [{ f: 0, v: "feliz" }, { f: toques[1], v: "determinado" }], poses, miradas: [{ f: 0, v: { x: -0.9, y: 0.5 } }], habla: [[toques[2] + 4, 66]] }}
      leo={{ caras: [{ f: 0, v: "duda" }] }}
      cam={[mira(0, LAV.tenzo - 110, P - 185, 2.8, { rot: -2 }), mira(69, LAV.tenzo - 110, P - 188, 2.95, { rot: -2, curva: "inout" })]} />
  );
};

// E56 · 369,1-373,6 «the boy who was on the mattress fourteen days ago»: el recuerdo — un cuadro con el Leo del día 1, hecho un bollo a la noche
export const DiaUno: React.FC = () => (
  // vuelta 3: el recuerdo a PANTALLA COMPLETA (sin marco ni círculo de cara): Leo del día 1, grande, encorvado sobre el teléfono
  <AbsoluteFill>
    <EnCuarto leo={null} cam={[mira(0, CTO.colchon - 20, PC - 190, 2.35, { rot: 3 }), mira(135, CTO.colchon - 30, PC - 195, 2.5, { rot: 2, curva: "inout" })]}
      medio={<Actor {...leoCto({ enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 1 }, dir: [{ f: 0, v: -1 }],
        poses: [{ f: 0, v: { ...SENTADO_TEL, cabeza: 34, tronco: 22 } }, { f: 30, v: { ...SENTADO_TEL, cabeza: 36, tronco: 24, hD: 34, cD: 118 } }, { f: 60, v: { ...SENTADO_TEL, hI: 60, cI: 150, cabeza: 30, tronco: 20 } }, { f: 84, v: { ...SENTADO_TEL, cabeza: 38, tronco: 26 } }],
        caras: [{ f: 0, v: "triste" }, { f: 60, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.2, y: 0.9 } }] })} />} />
    <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 112, fontFamily: F_HUD, fontWeight: 600, fontSize: 60, color: "#f4efe4", background: "rgba(12,10,10,0.78)", padding: "8px 28px 12px", borderRadius: 16 }}>DAY 1 · <span style={{ color: ACENTO }}>9h 42m</span></div>
  </AbsoluteFill>
);

// E58 · 377,0-378,3 «is he winning?»: Tenzo se inclina sobre la mesa, ceja arriba, cabeza ladeada
export const GanaEl: React.FC = () => (
  <EnLavadero
    tenzo={{ caras: [{ f: 0, v: "picaro" }], habla: [[0, 30]], poses: [{ f: 0, v: TENZO_MESA }, { f: 8, v: { ...TENZO_MESA, tronco: 14, cabeza: 14, hD: 80, cD: 60 } }, { f: 30, v: { ...TENZO_MESA, tronco: 16, cabeza: -10, hD: 90, cD: 40 } }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }}
    leo={{ caras: [{ f: 0, v: "duda" }] }}
    cam={[mira(0, LAV.tenzo - 60, P - 300, 3.0, { rot: -4 }), mira(39, LAV.tenzo - 70, P - 300, 3.15, { rot: -4, curva: "inout" })]}
    hud={<ManoLeo texto="is he winning?" x={960} y={300} desde={6} />} />
);

// E60 · 386,0-397,9 A) Leo, el pulgar sobre el perfil, duda y se decide  B) el menú → Mute (reloj original)  C) Corinto: el rey se corre y vuelve el sol
export const Mute: React.FC<{ tel: React.ReactNode }> = ({ tel }) => {
  const t0 = 386.0;
  const B = loc(t0, 388.3), C = loc(t0, 394.3);
  return (
    <Cortes planos={[
      [0, <EnLavadero
        leo={{ enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 0.8 }, caras: [{ f: 0, v: "duda" }, { f: 50, v: "determinado" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: 40, v: { x: -0.4, y: -0.3 } }, { f: 62, v: { x: 0.3, y: 0.8 } }],
          poses: [{ f: 0, v: SENTADO_TEL }, { f: 20, v: { ...SENTADO_TEL, hD: 60, cD: 100, cabeza: 6 } }, { f: 40, v: { ...SENTADO_TEL, hD: 60, cD: 100, cabeza: -8, tronco: -4 } }, { f: 62, v: { ...SENTADO_TEL, hD: 70, cD: 90, cabeza: 10 } }, { f: 80, v: { ...SENTADO_TEL, hD: 76, cD: 80, cabeza: 12 } }] }}
        cam={[mira(0, LAV.leo + 30, P - 260, 2.45), mira(B, LAV.leo + 30, P - 262, 2.6, { curva: "inout" })]}
        hud={<ManoLeo texto="something he's never done." x={960} y={300} desde={4} />} />],
      [B, <AbsoluteFill>{tel}
        <TextoMano texto="not block." x={960} y={300} desde={loc(t0, 391.0)} hasta={loc(t0, 391.9)} />
        <TextoMano texto="not unfollow." x={960} y={300} desde={loc(t0, 391.9)} hasta={loc(t0, 393.0)} />
        <TextoMano texto="just mute." x={960} y={300} desde={loc(t0, 393.0)} /></AbsoluteFill>, B],
      [C, <SeCorre cam={[mira(100, DIO.x + 230, PA2 - 250, 1.6), mira(210, BX + 160, PA2 - 255, 1.7, { curva: "inout" })]} />, 100],
    ]} />
  );
};

// E61-A · 397,9-400,2 «he does something even stranger»: Leo mira el teléfono, mira a Tenzo; Tenzo asiente; Leo se decide
export const MasRaro: React.FC = () => (
  <EnLavadero
    leo={{ enManoD: <Tel />, caras: [{ f: 0, v: "duda" }, { f: 40, v: "determinado" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: 18, v: { x: 0.9, y: -0.1 } }, { f: 48, v: { x: 0.3, y: 0.8 } }],
      poses: [{ f: 0, v: SENTADO_TEL }, { f: 18, v: { ...SENTADO_TEL, cabeza: -4, tronco: -2 } }, { f: 48, v: { ...SENTADO_TEL, hD: 60, cD: 100, cabeza: 10 } }] }}
    tenzo={{ caras: [{ f: 0, v: "neutral" }, { f: 24, v: "feliz" }], poses: [{ f: 0, v: TENZO_MESA }, { f: 26, v: { ...TENZO_MESA, cabeza: 14 } }, { f: 34, v: { ...TENZO_MESA, cabeza: -4 } }, { f: 42, v: { ...TENZO_MESA, cabeza: 12 } }], miradas: [{ f: 0, v: { x: -0.9, y: 0.1 } }] }}
    cam={[mira(0, 1450, P - 270, 2.05), mira(69, 1440, P - 268, 2.2, { curva: "inout" })]} />
);

// E62-A · 405,8-407,8 «he puts the phone face down»: Leo lo da vuelta y lo deja en la mesa
export const BocaAbajoA: React.FC<{ tel: React.ReactNode; hora: React.ReactNode }> = ({ tel, hora }) => (
  <EnLavadero tel={null} medio={<>{tel}</>}
    leo={{ enManoD: (fr: number) => (fr < 26 ? <Tel /> : null), caras: [{ f: 0, v: "determinado" }, { f: 32, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.7 } }],
      poses: [{ f: 0, v: { ...SENTADO, hD: 80, cD: 60, cabeza: 10 } }, { f: 20, v: { ...SENTADO, hD: 110, cD: 10, tronco: 14, cabeza: 14 } }, { f: 34, v: { ...SENTADO, hD: 60, cD: 60 } }, { f: 50, v: SENTADO }] }}
    cam={[mira(0, LAV.leo + 140, P - 230, 2.4), mira(60, LAV.leo + 150, P - 230, 2.5, { curva: "inout" })]}
    hud={hora} />
);
// E62-B · 407,8-410,4 «20 minutes later… it buzzes»: los dos quietos, la hora salta; corte al teléfono enorme que vibra
export const BocaAbajoB: React.FC<{ tel: React.ReactNode; hora: React.ReactNode }> = ({ tel, hora }) => {
  const C = loc(407.8, 409.0);
  return (
    <Cortes planos={[
      [0, <EnLavadero tel={null} medio={tel}
        leo={{ caras: [{ f: 0, v: "neutral" }], poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70 } }], miradas: [{ f: 0, v: { x: 0.6, y: 0.6 } }, { f: 20, v: { x: 0.9, y: -0.1 } }] }}
        tenzo={{ caras: [{ f: 0, v: "feliz" }], poses: [{ f: 0, v: TENZO_MESA }, { f: 22, v: { ...TENZO_MESA, cabeza: 10 } }], miradas: [{ f: 0, v: { x: -0.9, y: 0.1 } }] }}
        cam={[mira(0, 1450, P - 270, 2.0), mira(36, 1450, P - 270, 2.05)]} hud={hora} />, 0],
      [C, <ConCara esquina="der" caras={[{ f: 0, v: "neutral" }, { f: 8, v: "sorpresa" }]}><TelVibra desde={loc(407.8, 409.1) - C} /><TextoMano texto="bzzz." x={960} y={300} desde={loc(407.8, 409.2) - C} color={ACENTO} /></ConCara>],
    ]} />
  );
};

// el teléfono boca abajo sobre la mesa plegable, visto de arriba y enorme: vibra y salta
const TelVibra: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useF();
  const on = f >= desde && Math.floor((f - desde) / 10) % 2 === 0;
  const j = on ? 7 * Math.sin(f * 2.7) : 0;
  const z = interpolate(f, [0, 40], [1, 1.08], cl);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#b9b2a4, #cfc8ba)" }}>
      <svg width={1920} height={1080}>
        <g transform={`translate(960,600) scale(${z})`}>
          {[-1, 1].map((k) => <line key={k} x1={-900} y1={k * 300} x2={900} y2={k * 300} stroke="#a8a192" strokeWidth={6} />)}
          <ellipse cx={8} cy={30} rx={330} ry={170} fill="#000" opacity={0.18} />
          <g transform={`translate(${j},${on ? 2 * Math.cos(f * 3.1) : 0}) rotate(${-6 + j * 0.3})`}>
            <rect x={-300} y={-150} width={600} height={300} rx={48} fill="#22242a" stroke="#3a3d45" strokeWidth={8} />
            <rect x={140} y={-110} width={110} height={110} rx={26} fill="#2e3138" /><circle cx={172} cy={-78} r={20} fill="#15161a" /><circle cx={220} cy={-30} r={20} fill="#15161a" />
          </g>
          {on && [0, 1, 2].map((k) => <path key={k} d={`M${-360 - k * 46},-90 q-40,90 0,180 M${360 + k * 46},-90 q40,90 0,180`} stroke={ACENTO} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.9 - k * 0.25} />)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// E65-A · 427,3-430,6 «Day 15… one hour and four minutes»: al amanecer se para y se estira de cara a la ventana
export const Amanece: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => (
  <EnCuarto dia momento="amanecer" leo={null}
    cam={[mira(0, CTO.colchon - 120, PC - 300, 2.0), mira(99, CTO.colchon - 150, PC - 310, 2.15, { curva: "inout" })]}
    medio={<>{pared}<Actor {...leoCto({ ruta: [{ f: 0, x: CTO.colchon - 120, y: PC }], asiento: [{ f: 0, v: CTO.COLCHON_ALTO }, { f: 18, v: undefined }], dir: [{ f: 0, v: -1 }],
      poses: [{ f: 0, v: SENTADO }, { f: 18, v: "parado" }, { f: 34, v: "celebrar" }, { f: 60, v: { hI: 150, cI: 30, hD: 150, cD: 30, tronco: -10, cabeza: -16 } }, { f: 84, v: { hD: 30, cD: 30, hI: 30, cI: 30 } }],
      caras: [{ f: 0, v: "cansado" }, { f: 34, v: "alivio" }, { f: 84, v: "feliz" }], habla: [[36, 56]], miradas: [{ f: 0, v: { x: -0.5, y: -0.3 } }, { f: 60, v: { x: -0.6, y: -0.6 } }] })} /></>}
    hud={<TextoMano texto="day 15 · 1h 04m" x={960} y={300} desde={loc(427.3, 428.6)} />} />
);
// E65-B · 430,6-434,2 «Day 16. 51 minutes»: en el escritorio, dibujando a trazos
export const Dibujando: React.FC = () => {
  const Lap = <g transform="rotate(-70) scale(1.3)"><rect x={-4} y={-46} width={8} height={46} fill="#e9b84a" /><path d="M-4,-46 L0,-58 L4,-46 Z" fill="#e8d6b0" /></g>;
  return (
    <EnCuarto dia momento="amanecer" leo={null}
      cam={[mira(0, CTO.escritorio - 60, PC - 300, 2.2), mira(108, CTO.escritorio - 50, PC - 305, 2.35, { curva: "inout" })]}
      medio={<Actor {...leoCto({ ruta: [{ f: 0, x: CTO.escritorio - 170, y: PC }], asiento: [{ f: 0, v: undefined }], dir: [{ f: 0, v: 1 }], enManoD: Lap,
        poses: [{ f: 0, v: { hD: 80, cD: 70, tronco: 12, cabeza: 18 } }, ...Array.from({ length: 14 }).map((_, k) => ({ f: 6 + k * 7, v: { hD: 80 + (k % 2) * 8, cD: 70 - (k % 2) * 16, tronco: 12, cabeza: 18 } }))],
        caras: [{ f: 0, v: "determinado" }, { f: 50, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.8 } }] })} />}
      hud={<TextoMano texto="day 16 · 51m" x={960} y={300} desde={loc(430.6, 431.3)} />} />
  );
};

// E67 · 442,2-453,1 A) esa noche, en el escritorio con la lámpara, empieza a dibujar  B) el dibujo que se hace (reloj original)  C) lo clava junto al elefante
export const LoDibuja: React.FC<{ dibujo: React.ReactNode; pegado: React.ReactNode; pared?: React.ReactNode }> = ({ dibujo, pegado, pared }) => {
  const t0 = 442.2;
  const B = loc(t0, 445.2), C = loc(t0, 450.3);
  return (
    <Cortes planos={[
      [0, <EnCuarto lampara leo={null}
        cam={[mira(0, CTO.escritorio - 80, PC - 290, 2.3), mira(B, CTO.escritorio - 70, PC - 295, 2.45, { curva: "inout" })]}
        medio={<Actor {...leoCto({ ruta: [{ f: 0, x: CTO.escritorio - 380, y: PC }, { f: 40, x: CTO.escritorio - 170, y: PC }], asiento: [{ f: 0, v: undefined }], dir: [{ f: 0, v: 1 }],
          poses: [{ f: 0, v: "parado" }, { f: 44, v: { hD: 80, cD: 70, tronco: 12, cabeza: 18 } }, { f: 56, v: { hD: 88, cD: 54, tronco: 12, cabeza: 18 } }, { f: 66, v: { hD: 80, cD: 70, tronco: 12, cabeza: 18 } }, { f: 76, v: { hD: 88, cD: 54, tronco: 12, cabeza: 18 } }],
          caras: [{ f: 0, v: "determinado" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: 44, v: { x: 0.6, y: 0.8 } }] })} />}
        hud={<TextoMano texto="that night." x={960} y={300} desde={loc(t0, 443.9)} />} />],
      [B, <ConCara esquina="der" caras={[{ f: 0, v: "determinado" }, { f: 150, v: "feliz" }]}>{dibujo}</ConCara>, B],
      [C, <LoClava pegado={pegado} pared={pared} />],
    ]} />
  );
};
const LoClava: React.FC<{ pegado: React.ReactNode; pared?: React.ReactNode }> = ({ pegado, pared }) => {
  const f = useF();
  const clava = 16, junto = loc(450.3, 451.7);
  const anillo = f >= clava && f < clava + 14 ? (f - clava) / 14 : -1;
  return (
    <EnCuarto lampara leo={null}
      cam={[mira(0, PIN_X + 40, PC - 400, 1.9), mira(84, PIN_X + 30, PC - 395, 2.0, { curva: "inout" })]}
      medio={<>
        {pared}
        {f >= clava && pegado}
        {anillo >= 0 && <circle cx={PIN_X + 170} cy={PC - 520} r={20 + anillo * 90} fill="none" stroke={ORO} strokeWidth={5} opacity={1 - anillo} />}
        <Actor {...leoCto({ ruta: [{ f: 0, x: PIN_X + 120, y: PC }, { f: junto, x: PIN_X + 120, y: PC }, { f: junto + 20, x: PIN_X - 20, y: PC }], asiento: [{ f: 0, v: undefined }], dir: [{ f: 0, v: 1 }],
          poses: [{ f: 0, v: "celebrar" }, { f: clava + 6, v: { hD: 30, cD: 30, hI: 30, cI: 30 } }, { f: junto + 22, v: "manosCintura" }],
          caras: [{ f: 0, v: "determinado" }, { f: clava + 4, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.5, y: -1 } }, { f: junto + 20, v: { x: 0.8, y: -0.8 } }],
          enManoD: (fr: number) => (fr < clava ? <g transform="scale(0.5)"><rect x={-60} y={-90} width={120} height={90} fill="#2f2c28" stroke="#f4efe4" strokeWidth={4} /></g> : null) })} />
      </>}
      hud={<TextoMano texto="next to the elephant." x={960} y={300} desde={junto} />} />
  );
};
const PIN_X = CTO.colchon + 300;
