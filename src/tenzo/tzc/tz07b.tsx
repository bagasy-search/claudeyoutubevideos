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
import { Agora, AGORA_PISO } from "../sets/agora";
import {
  Burbuja, CabeceraChat, ConCara, CTO, EnCuarto, EnLavadero, LAV, ManoLeo, ManoMara, Negro, PantallaTel, RIM_FRIO, RIM_ORO,
  SENTADO, SENTADO_TEL, TENZO_MESA, TextoMano,
} from "./chicago";
import { ALEJANDRO, REY_ESC } from "./parabola07";
import { TYLER } from "./tz05";

const FPS = 30;
const fr = (t: number) => Math.round(t * FPS);
const loc = (t0: number, t: number) => fr(t - t0);
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const P = LAV.P;
const PC = CTO.P;
const sube = (f: number, a: number, d = 18) => spring({ frame: f - a, fps: FPS, config: { damping: 14, stiffness: 120 } }) * (f >= a ? 1 : 0) + 0 * d;

// ---------- CORTES dentro de UN tramo (una escena del director = un tramo; adentro, planos distintos) ----------
// lista de [cuadro local de inicio, plano]; cada plano ve su propio reloj desde 0
export const Cortes: React.FC<{ planos: [number, React.ReactNode][] }> = ({ planos }) => {
  const f = useF();
  const o = useContext(OffsetCtx);
  let i = 0;
  planos.forEach(([a], k) => { if (f >= a) i = k; });
  return <OffsetCtx.Provider value={o + planos[i][0]}>{planos[i][1]}</OffsetCtx.Provider>;
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
const LUZ_CHICA = { ...MAYA, piel: "#ffd9b8", camisa: ACENTO, pantalon: "#ff9a5a", zapatos: "#ffd9b8", miembro: "#ffd9b8", accesorios: [{ t: "pelo" as const, forma: "bob" as const, color: "#ffb070" }] };
// fantasma que aparece y revienta (anillo) en `pop`
const Fantasma: React.FC<{ look: ActorProps["look"]; x: number; y: number; escala: number; desde: number; pop: number; dir?: 1 | -1; pose?: ActorProps["poses"]; cara?: string; demonio?: boolean }> = ({ look, x, y, escala, desde, pop, dir = 1, pose, cara = "feliz" }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + 10, pop, pop + 6], [0, 0.6, 0.6, 0], cl);
  const anillo = f >= pop && f < pop + 16 ? (f - pop) / 16 : -1;
  return (
    <g>
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
  const dy = interpolate(sube(f, 4), [0, 1], [520, 0]);
  const fest = loc(t0, 59.2);
  return (
    <EnCuarto leo={null}
      cam={[mira(0, CTO.colchon - 70, PC - 400, 1.32), mira(114, CTO.colchon - 60, PC - 400, 1.42, { curva: "inout" })]}
      medio={<>
        <MaraEn x={CTO.colchon - 230} y={PC - 10 + dy} s={1.3} p={{
          caras: [{ f: 0, v: "picaro" }, { f: fest, v: "risa" }], habla: [[fest, fest + 30]],
          poses: [{ f: 0, v: { hD: 30, cD: 40, hI: 30, cI: 40, cabeza: 10, tronco: 10 } }, { f: 30, v: { hD: 70, cD: 60, hI: 60, cI: 70, cabeza: 16, tronco: 14 } },
            { f: fest, v: "celebrar" }, { f: fest + 14, v: { hI: 120, cI: 40, hD: 160, cD: 10, cabeza: -14, tronco: -8 } }, { f: fest + 28, v: "celebrar" }, { f: fest + 42, v: { hI: 120, cI: 40, hD: 160, cD: 10, cabeza: -14, tronco: -8 } }],
        }} />
        <Actor {...leoCto({ poses: [{ f: 0, v: SENTADO_TEL }, { f: 60, v: { ...SENTADO_TEL, cabeza: 28, tronco: 10 } }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }], enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 0.8 } })} />
        <Halo x={CTO.colchon - 230} y={PC - 520} r={420} color={ACENTO} fuerza={0.18 * interpolate(f, [fest, fest + 10], [0.4, 1], cl)} />
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
      cam={[mira(0, X + 120, PC - 330, 1.75, { rot: 2 }), mira(171, X + 90, PC - 320, 2.0, { rot: 1, curva: "inout" })]}
      medio={<>
        <MaraEn x={X + 230} y={PC + 140} s={1.25} p={{
          dir: [{ f: 0, v: -1 }], caras: [{ f: 0, v: "picaro" }, { f: fr1, v: "risa" }, { f: fr3, v: "feliz" }],
          habla: [[fr1, fr2 - 4], [fr2, fr3 - 4], [fr3, fr3 + 22]],
          poses: [{ f: 0, v: { tronco: 26, cabeza: 18, hD: 40, cD: 60, hI: 20, cI: 40 } }, { f: fr1, v: { tronco: 34, cabeza: 22, hD: 80, cD: 40, hI: 20, cI: 40 } },
            { f: fr2, v: { tronco: 30, cabeza: 14, hD: 120, cD: 10, hI: 30, cI: 50 } }, { f: fr3, v: { tronco: 38, cabeza: 24, hD: 60, cD: 90, hI: 70, cI: 60 } }],
        }} />
        <Actor {...leoCto({ ruta: [{ f: 0, x: X, y: PC }], dir: [{ f: 0, v: -1 }], enManoD: <Tel />, luz: { lado: -1, color: ACENTO, fuerza: 0.7 },
          poses: [{ f: 0, v: SENTADO_TEL }, { f: fr1 + 4, v: { ...SENTADO_TEL, cabeza: 30, tronco: 12 } }, { f: fr2 + 4, v: { ...SENTADO_TEL, cabeza: 34, tronco: 18, hI: 40, cI: 110 } }, { f: fr3 + 4, v: { ...SENTADO_TEL, cabeza: 38, tronco: 24, hI: 46, cI: 130, bajar: 6 } }],
          caras: [{ f: 0, v: "triste" }, { f: fr2, v: "miedo" }, { f: fr3, v: "triste" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: fr2, v: { x: 0.8, y: -0.2 } }, { f: fr2 + 20, v: { x: 0.3, y: 0.9 } }] })} />
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
      cam={[mira(0, X + 280, PC - 300, 1.55), mira(165, X + 300, PC - 300, 1.68, { curva: "inout" })]}
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
  const ruta = [{ f: 0, x: LAV.leo, y: P }, { f: 12, x: LAV.leo, y: P }, { f: 26, x: LAV.leo + 70, y: P + 40 }, { f: 98, x: 2010, y: P + 40 }];
  return (
    <EnLavadero leo={null} medio={medio}
      tenzo={{ caras: [{ f: 0, v: "neutral" }, { f: este, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: 70, v: { x: 0.9, y: 0 } }], dir: [{ f: 0, v: -1 }, { f: 70, v: 1 }] }}
      extra={[{ ...leoLav({ ruta, asiento: [{ f: 0, v: 66 }, { f: 12, v: undefined }],
        poses: [{ f: 0, v: SENTADO }, { f: 8, v: { hD: 110, cD: 20, tronco: 8 } }, { f: 26, v: { hD: 80, cD: 20 } }, { f: sec, v: { hD: 140, cD: 10, cabeza: -14 } }, { f: maq, v: { hD: 95, cD: 0, tronco: 4 } }, { f: maq + 26, v: { hD: 60, cD: 30 } }, { f: este, v: { hI: 105, cI: 20, hD: 105, cD: 20, cabeza: -6, tronco: -4 } }],
        dir: [{ f: 0, v: 1 }, { f: este - 6, v: -1 }],
        caras: [{ f: 0, v: "triste" }, { f: 20, v: "enojo" }, { f: este, v: "triste" }], habla: [[este, este + 22]],
        miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: sec, v: { x: 0.6, y: -0.8 } }, { f: maq, v: { x: 0.9, y: 0 } }, { f: este, v: { x: 0.9, y: 0 } }] }), luz: RIM_FRIO }]}
      cam={[mira(0, LAV.leo + 60, P - 290, 1.95), mira(30, LAV.leo + 180, P - 320, 1.8, { curva: "fluida" }), mira(70, 1700, P - 340, 1.72, { curva: "fluida" }), mira(100, 2040, P - 340, 1.72, { curva: "fluida" }),
        mira(este, 2010, P - 320, 1.78, { curva: "inout" }), mira(171, 2000, P - 300, 1.9, { curva: "inout" })]}
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
  const PA = AGORA_PISO, AX = 720, SX = 1080;
  const PIEDRA = { estilo: "frijol" as const, piel: "#d8d0bf", camisa: "#e6dfcf", miembro: "#d8d0bf", pantalon: "#e6dfcf", zapatos: "#cfc6b2", ceja: "#b9b09c", accesorios: [{ t: "pelo" as const, forma: "corto" as const, color: "#cfc6b2" }, { t: "barba" as const, color: "#cfc6b2" }, { t: "tunica" as const, color: "#e6dfcf", largo: 1 }] };
  return (
    <Escena Set={Agora} pal={PAL_ANT} seed={140} mano={1.4}
      claves={[mira(0, AX + 200, PA - 540, 1.02), mira(81, AX + 210, PA - 550, 0.96, { curva: "inout" })]}
      medio={<>
        <rect x={SX - 170} y={PA - 230} width={340} height={230} fill="#cfc6b2" stroke="#a89e88" strokeWidth={6} />
        <rect x={SX - 200} y={PA - 250} width={400} height={28} fill="#e2dac8" />
        <g transform={`translate(${SX * 0.25},${-250 + PA * 0.25}) scale(0.75)`}>
          <Actor look={PIEDRA} escala={REY_ESC * 2.3} seed={141} ruta={[{ f: 0, x: SX, y: PA }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "determinado" }]} poses={[{ f: 0, v: { hD: 150, cD: 10, hI: 20, cI: 30, cabeza: -6 } }]} sombra={0} />
        </g>
        <Halo x={SX} y={PA - 1100} r={420} color="#fff0b0" fuerza={0.35} />
        <Actor look={ALEJANDRO} escala={REY_ESC} seed={130} luz={{ lado: 1, color: "#fff0b0", fuerza: 1 }} ruta={[{ f: 0, x: AX, y: PA + 20 }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: "manosCintura" }, { f: 20, v: { hD: 150, cD: 10, hI: -20, cI: 20, tronco: -6, cabeza: -18 } }, { f: 50, v: { hD: 160, cD: 4, hI: 140, cI: 10, tronco: -10, cabeza: -22 } }]}
          caras={[{ f: 0, v: "determinado" }, { f: 40, v: "enojo" }]} miradas={[{ f: 0, v: { x: 0.6, y: -0.9 } }]}
          ajuste={(p, fr) => ({ ...p, bajar: p.bajar - 10 * interpolate(fr, [20, 50], [0, 1], cl) })} />
      </>}
      hud={<TextoMano texto="…compared himself to the gods." x={960} y={300} desde={10} />} />
  );
};

// ============ E54 · 355,0-364,6 «the shadow is shrinking, but it is not finished… he's laughing at you…» ============
// la sombra se ACHICA dentro del cuadro, salta al hombro de Leo y le grita al oído, chiquita; Leo la espanta con la mano
export const SombraChica: React.FC = () => {
  const f = useF();
  const t0 = 355.0;
  const achica = [loc(t0, 356.5), loc(t0, 358.4)], salto = [loc(t0, 358.6), loc(t0, 359.2)];
  const l1 = loc(t0, 359.5), l2 = loc(t0, 360.9), l3 = loc(t0, 362.6);
  const sAtras = interpolate(f, achica, [1.45, 0.42], cl);
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
      cam={[mira(0, LAV.leo - 110, P - 400, 1.45), mira(achica[1], LAV.leo - 70, P - 330, 1.85, { curva: "inout" }), mira(288, LAV.leo - 20, P - 300, 2.25, { curva: "inout" })]}
      medio={<>
        {f < salto[0] && <MaraEn x={atras.x} y={atras.y} s={sAtras} p={pMara} />}
        <Actor {...leoLav({ caras: [{ f: 0, v: "triste" }, { f: salto[1], v: "duda" }, { f: l1 + 10, v: "enojo" }, { f: l3 + 24, v: "triste" }],
          poses: [{ f: 0, v: SENTADO }, { f: salto[1], v: { ...SENTADO, cabeza: -10 } }, { f: l3 - 4, v: { ...SENTADO, hI: 150, cI: 70, cabeza: 10, tronco: -4 } }, { f: l3 + 22, v: SENTADO }, { f: l3 + 40, v: { ...SENTADO, cabeza: 16, tronco: 8 } }],
          miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: salto[1], v: { x: -0.8, y: -0.3 } }, { f: l3 + 30, v: { x: 0.4, y: 0.8 } }], giros: [{ f: 0, v: 0 }, { f: salto[1], v: -0.5 }, { f: l3 + 30, v: 0 }] })} />
        {f >= salto[0] && <MaraEn x={mx} y={my} s={0.42} p={{ ...pMara, dir: [{ f: 0, v: 1 }] }} />}
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
  <Inserto objeto={<PantallaVacia />} objetoAlto={250} objetoAncho={124} look={LEO} pal={PAL} acento={ACENTO} accion="girar" esquina="der"
    caras={[{ f: 0, v: "neutral" }, { f: loc(453.1, 455.3), v: "duda" }, { f: loc(453.1, 456.6), v: "sorpresa" }]} />
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
export const ALaVentana: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 461.6;
  const VX = CTO.colchon - 275;
  const llega = 92;
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, CTO.colchon - 40, PC - 420, 1.0), mira(30, CTO.colchon - 60, PC - 420, 1.04), mira(70, VX + 140, PC - 330, 1.8, { curva: "inout" }), mira(162, VX + 130, PC - 340, 1.95, { curva: "inout" })]}
      medio={<>
        {pared}
        <Actor {...leoCto({ ruta: [{ f: 0, x: CTO.colchon + 40, y: PC }, { f: 20, x: CTO.colchon + 40, y: PC }, { f: llega, x: VX + 60, y: PC }], asiento: [{ f: 0, v: undefined }],
          dir: [{ f: 0, v: -1 }],
          poses: [{ f: 0, v: "parado" }, { f: llega + 4, v: { hD: 30, cD: 30 } }, { f: llega + 22, v: { hI: 120, cI: 30, cabeza: -10 } }, { f: 150, v: { hI: 118, cI: 34, cabeza: -6 } }],
          caras: [{ f: 0, v: "neutral" }, { f: llega + 20, v: "cansado" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: llega, v: { x: -0.7, y: -0.6 } }] })} />
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
      cam={[mira(0, CTO.colchon - 40, PC - 330, 1.6), mira(sienta, CTO.colchon + 20, PC - 280, 1.85, { curva: "inout" }), mira(120, CTO.colchon + 30, PC - 270, 2.0, { curva: "inout" })]}
      medio={<>
        {pared}
        <Actor {...leoCto({ ruta: [{ f: 0, x: CTO.colchon - 260, y: PC }, { f: sienta - 8, x: CTO.colchon, y: PC }], asiento: [{ f: 0, v: undefined }, { f: sienta, v: CTO.COLCHON_ALTO }],
          dir: [{ f: 0, v: 1 }],
          poses: [{ f: 0, v: "parado" }, { f: sienta, v: SENTADO }, { f: sienta + 14, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70, tronco: 8, cabeza: 8 } }],
          caras: [{ f: 0, v: "neutral" }, { f: sienta + 10, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: sienta, v: { x: 0.3, y: 0.8 } }] })} />
      </>}
      hud={<TextoMano texto="leo marsh · 24" x={960} y={300} desde={loc(t0, 467.5)} />} />
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
const ABURRIDO = { estilo: "frijol" as const, piel: "#b9b6b0", camisa: "#8f8c87", miembro: "#b9b6b0", pantalon: "#7f7c77", zapatos: "#6f6c67", ceja: "#6f6c67", accesorios: [{ t: "pelo" as const, forma: "calvo" as const, color: "#b9b6b0" }] };
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
const LaVozLejos: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const f = useF();
  const t0 = 482.2;
  const oye = loc(t0, 484.2), voz = loc(t0, 484.6), peor = loc(t0, 486.9);
  const BX = CTO.colchon - 640;
  const leo = conReaccion(leoCto({ dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70 } }, { f: oye, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70, tronco: -4, cabeza: -6 } }],
    caras: [{ f: 0, v: "neutral" }, { f: oye, v: "duda" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.5 } }, { f: oye, v: { x: -1, y: -0.1 } }], giros: [{ f: 0, v: 0 }, { f: oye, v: -0.8 }] }), "miedo", peor, 60);
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, CTO.colchon - 260, PC - 330, 1.62), mira(180, CTO.colchon - 300, PC - 320, 1.75, { curva: "inout" })]}
      medio={<>
        {pared}
        <g opacity={interpolate(f, [voz - 20, voz], [0, 1], cl)}>
          <Actor look={ABURRIDO} escala={ESC * 0.5} seed={88} ruta={[{ f: 0, x: BX, y: PC - 40 }, { f: peor, x: BX, y: PC - 40 }, { f: 180, x: BX + 90, y: PC - 40 }]} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "cansado" }, { f: peor, v: "picaro" }]} habla={[[voz, voz + 30]]} poses={[{ f: 0, v: "saludar" }, { f: 20 + voz, v: { hD: 120, cD: 40 } }, { f: 40 + voz, v: "saludar" }, { f: peor, v: "manosCintura" }]} />
        </g>
        <Actor {...leo} />
      </>}
      hud={<TextoMano texto="bored?" x={960} y={300} desde={voz} color="#c9c6c0" />} />
  );
};
// E74 · 488,2-494,3 «Boredom. Who is your Tyler, and what don't they post at three in the morning? Tell me below»
// Leo frente a sus dibujos, se da vuelta a cámara, señala al que mira y después abajo (los comentarios)
export const TuTyler: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 488.2;
  const quien = loc(t0, 488.9), que = loc(t0, 490.6), abajo = loc(t0, 492.6);
  const X = CTO.colchon + 230;
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, X + 40, PC - 400, 1.9), mira(183, X + 30, PC - 390, 2.05, { curva: "inout" })]}
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
    cam={[mira(0, LAV.leo + 120, P - 300, 1.75), mira(81, LAV.leo + 260, P - 290, 1.9, { curva: "inout" })]}
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
        cam={[mira(0, 1450, P - 300, 1.75), mira(93, 1470, P - 300, 1.85, { curva: "inout" })]}
        hud={<TextoMano texto="boredom might be the door." x={960} y={300} desde={8} />} />
      <Negro desde={74} d={18} />
    </AbsoluteFill>
  );
};
export type { Clave };
