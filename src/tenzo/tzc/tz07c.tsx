// tz07 · VUELTA 3 del Ojo del Director (28-oct, tarde): escenas re-animadas por PATRONES que marcaron las dos pasadas
// del director r28 (lavadero general chico, Leo con el teléfono en la misma pose, acto final en el cuarto, figuras chicas
// en Corinto, planos repetidos, E55→E56). Se usan desde la lista de tramos de tz07.tsx. Cuadros LOCALES de cada tramo.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Actor, ActorProps } from "../../anikit/actor";
import { Halo } from "../../anikit/luz";
import { ACENTO, ESC, LEO, MARA, ORO } from "../elenco";
import { MAYA } from "../elenco_b";
import { CTO, EnCuarto, EnLavadero, LAV, ManoLeo, RIM_FRIO, SENTADO, SENTADO_TEL, TENZO_MESA, TextoMano } from "./chicago";
import { Tel } from "../utileria";
import { TYLER } from "./tz05";
import { ABURRIDO, ABX, ALaVentanaA, Cortes, VozB1, VozB3 } from "./tz07b";

const FPS = 30;
const fr = (t: number) => Math.round(t * FPS);
const loc = (t0: number, t: number) => fr(t - t0);
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const PC = CTO.P;

const leoCto = (p: Partial<ActorProps>): ActorProps => ({ look: LEO, escala: ESC, seed: 1, luz: RIM_FRIO, ruta: [{ f: 0, x: CTO.colchon, y: PC }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: CTO.COLCHON_ALTO }], poses: [{ f: 0, v: SENTADO }], caras: [{ f: 0, v: "neutral" }], ...p } as ActorProps);
const LUZ_CHICA = { ...MAYA, piel: "#ffd9b8", camisa: ACENTO, pantalon: "#ff9a5a", zapatos: "#ffd9b8", miembro: "#ffd9b8", accesorios: [{ t: "pelo" as const, forma: "cola" as const, color: "#b0521c" }, { t: "trenzas" as const, color: "#b0521c", lazo: "#fff1c9" }] };

// teléfono parado contra algo, la pantalla NEGRA (sin halo, sin luz): sólo un reflejo quieto
const TelApagado: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = -10 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-24} y={-84} width={48} height={84} rx={8} fill="#0d0e12" stroke="#3a3c44" strokeWidth={3} />
    <rect x={-19} y={-78} width={38} height={72} rx={4} fill="#14161c" />
    <path d="M-15,-74 L4,-74 L-15,-30 Z" fill="#ffffff" opacity={0.07} />
  </g>
);

// ===================== ACTO 5 =====================
// E67 · 442,2-453,1 «draw it… so that night he does. A tiny man in a barrel… he pins it on the wall, next to the elephant»
// A) Leo entero cruza a su escritorio con la lámpara y se sienta  B) sobre su hombro: el dibujo GRANDE al centro, la mano con el
// lápiz va trazando  C) lo clava en la pared, parado al costado del corcho (sin taparlo)
export const LoDibuja3: React.FC<{ svg: (u: number) => React.ReactNode; pegado: React.ReactNode; pared?: React.ReactNode }> = ({ svg, pegado, pared }) => {
  const t0 = 442.2;
  const B = loc(t0, 445.2), C = loc(t0, 450.3);
  return <Cortes planos={[[0, <AlEscritorio />], [B, <Trazando svg={svg} dur={C - B} />], [C, <LoClava3 pegado={pegado} pared={pared} />]]} />;
};
const AlEscritorio: React.FC = () => {
  const t0 = 442.2;
  const sienta = loc(t0, 444.3);
  const X = CTO.escritorio - 170;
  return (
    <EnCuarto lampara leo={null}
      cam={[mira(0, X - 140, PC - 250, 1.75), mira(sienta, X - 40, PC - 240, 1.9, { curva: "fluida" }), mira(90, X - 20, PC - 235, 2.0, { curva: "inout" })]}
      medio={<Actor {...leoCto({ ruta: [{ f: 0, x: X - 330, y: PC }, { f: sienta - 8, x: X, y: PC }], asiento: [{ f: 0, v: undefined }, { f: sienta, v: 58 }], dir: [{ f: 0, v: 1 }],
        poses: [{ f: 0, v: "parado" }, { f: sienta, v: { ...SENTADO, hD: 60, cD: 60 } }, { f: sienta + 10, v: { ...SENTADO, hD: 80, cD: 70, tronco: 14, cabeza: 16 } }, { f: sienta + 22, v: { ...SENTADO, hD: 88, cD: 54, tronco: 14, cabeza: 16 } }, { f: sienta + 32, v: { ...SENTADO, hD: 80, cD: 70, tronco: 14, cabeza: 16 } }],
        caras: [{ f: 0, v: "neutral" }, { f: 30, v: "determinado" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: sienta, v: { x: 0.6, y: 0.8 } }],
        enManoD: (q: number) => (q >= sienta ? <g transform="rotate(-70) scale(1.3)"><rect x={-4} y={-46} width={8} height={46} fill="#e9b84a" /><path d="M-4,-46 L0,-58 L4,-46 Z" fill="#e8d6b0" /></g> : null) })} />}
      hud={<TextoMano texto="that night." x={960} y={300} desde={loc(t0, 443.9)} />} />
  );
};
// la punta del lápiz recorre los trazos del dibujo (en coordenadas del SVG del dibujo)
const PUNTA: [number, number, number][] = [[0, -170, 110], [0.06, -150, 40], [0.13, -60, 30], [0.2, -55, 100], [0.25, -110, 116], [0.3, -80, 98], [0.38, -50, 92],
  [0.5, 60, 110], [0.58, 60, -20], [0.64, 80, -80], [0.7, 100, -20], [0.75, 100, 110], [0.82, 50, 112], [0.88, -40, 124], [0.94, 150, -110], [1, 160, -90]];
const Trazando: React.FC<{ svg: (u: number) => React.ReactNode; dur: number }> = ({ svg, dur }) => {
  const f = useF();
  const u = interpolate(f, [6, dur - 12], [0, 1], cl);
  const S = 2.35, CX = 1010, CY = 470;
  const k = PUNTA.findIndex((p) => p[0] > u);
  const a = PUNTA[Math.max(0, (k < 0 ? PUNTA.length : k) - 1)], b = PUNTA[k < 0 ? PUNTA.length - 1 : k];
  const t = b[0] === a[0] ? 0 : (u - a[0]) / (b[0] - a[0]);
  const px = CX + S * (a[1] + (b[1] - a[1]) * t), py = CY + S * (a[2] + (b[2] - a[2]) * t);
  const cab = 2 * Math.sin(f / 19);
  return (
    <AbsoluteFill style={{ background: "#25272c" }}>
      <svg width={1920} height={1080}>
        <Halo x={1000} y={300} r={900} color={ORO} fuerza={0.16} />
        <rect x={0} y={860} width={1920} height={220} fill="#5a4634" />
        <g transform={`translate(${CX},${CY}) scale(${S + f * 0.0006})`}>{svg(u)}</g>
        {/* la mano de Leo con el lápiz: la punta sigue el trazo */}
        <g transform={`translate(${px},${py})`}>
          <path d="M-30,150 L-120,190 L-470,760 L-300,800 Z" fill="#24242a" />
          <line x1={0} y1={0} x2={-46} y2={150} stroke="#e9b84a" strokeWidth={16} strokeLinecap="round" />
          <path d="M0,0 L-10,32 L8,36 Z" fill="#3a3030" />
          <ellipse cx={-56} cy={150} rx={48} ry={38} fill="#ecc9a3" stroke="#1c1c22" strokeWidth={5} />
        </g>
        {/* la cabeza de Leo de espaldas, en primer plano abajo a la izquierda */}
        <g transform={`translate(330,${1010 + cab}) rotate(-8)`}>
          <path d="M-210,90 Q-200,-40 -60,-70 L60,-70 Q200,-40 210,90 Z" fill="#1c1c22" />
          <circle cx={0} cy={-170} r={150} fill="#1c1c22" />
          {[-110, -60, -10, 40, 90].map((x, i) => <path key={i} d={`M${x - 30},${-270 - (i % 2) * 10} l26,-${70 + (i % 3) * 14} l20,${74 + (i % 2) * 8} Z`} fill="#1c1c22" />)}
          <path d="M130,-200 Q170,-170 150,-110" stroke="#f4efe4" strokeWidth={10} fill="none" opacity={0.75} />
        </g>
      </svg>
      <TextoMano texto="a tiny man in a barrel." x={1340} y={950} desde={loc(445.2, 445.5)} hasta={loc(445.2, 447.0)} />
      <TextoMano texto="a huge king. a golden shadow." x={1300} y={950} desde={loc(445.2, 447.1)} />
    </AbsoluteFill>
  );
};
const PIN_X = CTO.colchon + 300;
const LoClava3: React.FC<{ pegado: React.ReactNode; pared?: React.ReactNode }> = ({ pegado, pared }) => {
  const f = useF();
  const clava = 18, junto = loc(450.3, 451.7);
  const X = PIN_X + 420;
  const anillo = f >= clava && f < clava + 14 ? (f - clava) / 14 : -1;
  return (
    <EnCuarto lampara leo={null}
      cam={[mira(0, PIN_X + 230, PC - 330, 1.5), mira(84, PIN_X + 220, PC - 325, 1.6, { curva: "inout" })]}
      medio={<>
        {pared}
        {f >= clava && pegado}
        {anillo >= 0 && <circle cx={PIN_X + 170} cy={PC - 520} r={20 + anillo * 90} fill="none" stroke={ORO} strokeWidth={5} opacity={1 - anillo} />}
        <Actor {...leoCto({ ruta: [{ f: 0, x: X, y: PC }], asiento: [{ f: 0, v: undefined }], dir: [{ f: 0, v: -1 }],
          poses: [{ f: 0, v: { hD: 150, cD: 10, tronco: -6, cabeza: -14 } }, { f: clava + 6, v: { hD: 60, cD: 30, hI: 20, cI: 30 } }, { f: junto, v: { hD: 110, cD: 0, cabeza: -10 } }, { f: junto + 26, v: "manosCintura" }],
          caras: [{ f: 0, v: "determinado" }, { f: clava + 4, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.6, y: -1 } }, { f: junto, v: { x: -0.9, y: -0.6 } }],
          enManoD: (q: number) => (q < clava ? <g transform="scale(0.5)"><rect x={-60} y={-90} width={120} height={90} fill="#2f2c28" stroke="#f4efe4" strokeWidth={4} /></g> : null) })} />
      </>}
      hud={<TextoMano texto="next to the elephant." x={960} y={960} desde={junto} />} />
  );
};

// E68 · 453,1-457,6 «And then something happens that has not happened in ten years, nothing.»
// A) a la altura del cajón: el teléfono parado, NEGRO y quieto; Leo se inclina, lo mira, lo toca con un dedo: nada
// B) primer plano de Leo, en blanco, parpadea; «nothing.»
export const NadaPasa3: React.FC = () => {
  const t0 = 453.1;
  return <Cortes planos={[[0, <TelQuieto />], [loc(t0, 455.9), <CaraNada />]]} />;
};
const TelQuieto: React.FC = () => {
  const toca = 46, retira = 62;
  const X = CTO.colchon - 200;
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, CTO.cajon + 150, PC - 190, 2.45, { rot: -2 }), mira(84, CTO.cajon + 140, PC - 195, 2.6, { rot: -1, curva: "inout" })]}
      medio={<>
        <TelApagado x={CTO.cajon + 10} y={PC - 90} s={1.15} />
        <Actor {...leoCto({ ruta: [{ f: 0, x: X, y: PC }], dir: [{ f: 0, v: -1 }],
          poses: [{ f: 0, v: { ...SENTADO, tronco: 6 } }, { f: 20, v: { ...SENTADO, tronco: 22, cabeza: 14 } }, { f: toca, v: { ...SENTADO, tronco: 26, cabeza: 12, hD: 82, cD: 8 } }, { f: retira, v: { ...SENTADO, tronco: 20, cabeza: 16 } }, { f: 80, v: { ...SENTADO, tronco: 4, cabeza: -4, hD: 30, cD: 60 } }],
          caras: [{ f: 0, v: "neutral" }, { f: 20, v: "duda" }, { f: retira, v: "sorpresa" }, { f: 80, v: "duda" }], miradas: [{ f: 0, v: { x: -0.8, y: 0.4 } }, { f: 80, v: { x: -0.2, y: -0.3 } }] })} />
      </>}
      hud={<TextoMano texto="no notifications." x={960} y={960} desde={toca + 6} />} />
  );
};
const CaraNada: React.FC = () => (
  <EnCuarto dia momento="lluvia" leo={null}
    cam={[mira(0, CTO.colchon - 270, PC - 300, 2.7), mira(51, CTO.colchon - 270, PC - 302, 2.8, { curva: "inout" })]}
    medio={<Actor {...leoCto({ ruta: [{ f: 0, x: CTO.colchon - 200, y: PC }], dir: [{ f: 0, v: -1 }],
      poses: [{ f: 0, v: { ...SENTADO, tronco: 4, cabeza: -4, hD: 30, cD: 60 } }, { f: 24, v: { ...SENTADO, tronco: 0, cabeza: -10, hD: 20, cD: 50, hI: 20, cI: 50 } }],
      caras: [{ f: 0, v: "duda" }, { f: 20, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.4, y: 0 } }, { f: 20, v: { x: 0.1, y: -0.1 } }] })} />}
    hud={<TextoMano texto="nothing." x={960} y={960} desde={6} color="#c9c6c0" />} />
);

// E69 · 457,6-461,6 «No notifications, no shadow, no Tyler, no girls made of light.» Los tres fantasmas aparecen JUNTOS alrededor de Leo
// (que se para) y se desvanecen uno por uno, cada uno en su palabra, con un anillo
const Fantasma3: React.FC<{ look: ActorProps["look"]; x: number; escala: number; entra: number; sale: number; dir?: 1 | -1; pose?: ActorProps["poses"]; cara?: string }> = ({ look, x, escala, entra, sale, dir = 1, pose, cara = "feliz" }) => {
  const f = useF();
  const o = interpolate(f, [entra, entra + 10, sale, sale + 12], [0, 0.92, 0.92, 0], cl);
  const anillo = f >= sale && f < sale + 18 ? (f - sale) / 18 : -1;
  const sube = interpolate(f, [sale, sale + 12], [0, -40], cl);
  return (
    <g transform={`translate(0,${sube})`}>
      {o > 0 && <Halo x={x} y={PC - 220 * escala / ESC} r={260 * escala / ESC} color="#f4efe4" fuerza={0.25 * o} />}
      {o > 0 && <Actor look={look} escala={escala} seed={77} ruta={[{ f: 0, x, y: PC }]} dir={[{ f: 0, v: dir }]} caras={[{ f: 0, v: cara }]} poses={pose ?? [{ f: 0, v: "parado" }]} opacidad={() => o} />}
      {anillo >= 0 && <circle cx={x} cy={PC - 250 * escala / ESC} r={70 + anillo * 230} fill="none" stroke="#f4efe4" strokeWidth={6} opacity={0.75 * (1 - anillo)} />}
    </g>
  );
};
export const Fantasmas3: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 457.6;
  const s1 = loc(t0, 458.9), s2 = loc(t0, 459.9), s3 = loc(t0, 461.0);
  const X = CTO.colchon - 60;
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, X + 120, PC - 300, 1.75), mira(120, X + 120, PC - 305, 1.85, { curva: "inout" })]}
      medio={<>
        {pared}
        <Fantasma3 look={MARA} x={X - 290} escala={ESC * 1.2} entra={0} sale={s1} dir={1} cara="risa" pose={[{ f: 0, v: { hD: 60, cD: 60, hI: 40, cI: 70, cabeza: 10 } }]} />
        <Fantasma3 look={TYLER} x={X + 300} escala={ESC} entra={6} sale={s2} dir={-1} cara="risa" pose={[{ f: 0, v: "saludar" }, { f: 30, v: { hD: 130, cD: 20 } }]} />
        <Fantasma3 look={LUZ_CHICA} x={X + 500} escala={ESC} entra={12} sale={s3} dir={-1} cara="feliz" pose={[{ f: 0, v: { hD: 100, cD: 30 } }]} />
        <Actor {...leoCto({ ruta: [{ f: 0, x: X, y: PC }], asiento: [{ f: 0, v: CTO.COLCHON_ALTO }, { f: 10, v: undefined }],
          poses: [{ f: 0, v: SENTADO }, { f: 10, v: "parado" }, { f: s1, v: { hI: 30, cI: 60, hD: 20, cD: 40, cabeza: 6 } }, { f: s2, v: { hD: 80, cD: 30 } }, { f: s3, v: "encogerse" }],
          dir: [{ f: 0, v: -1 }, { f: s1 + 8, v: 1 }],
          caras: [{ f: 0, v: "sorpresa" }, { f: s1, v: "duda" }, { f: s2, v: "sorpresa" }, { f: s3, v: "duda" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: s1 + 8, v: { x: 0.9, y: 0 } }, { f: s3, v: { x: 0.9, y: 0.1 } }] })} />
      </>}
      hud={<>
        <TextoMano texto="no shadow." x={960} y={960} desde={s1} hasta={s2 - 2} color="#c9c6c0" />
        <TextoMano texto="no tyler." x={960} y={960} desde={s2} hasta={s3 - 2} color="#c9c6c0" />
        <TextoMano texto="no girls made of light." x={960} y={960} desde={s3} color="#c9c6c0" />
      </>} />
  );
};

// E70-B · 465,3-467,0 «and nothing to do»: CONTRAPLANO desde afuera de la ventana: lluvia delante, Leo apoya la frente y tamborilea en el vidrio
export const VentanaAfuera: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const f = useF();
  const VX = CTO.colchon - 400 + 125;
  const X = VX + 95;
  const tam = (k: number) => ({ f: 14 + k * 9, v: { hI: 112 + (k % 2) * 10, cI: 30 - (k % 2) * 14, hD: 20, cD: 30, tronco: 8, cabeza: 12 } });
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, X + 30, PC - 300, 2.45), mira(51, X + 20, PC - 300, 2.55, { curva: "inout" })]}
      medio={<>
        {pared}
        <Actor {...leoCto({ ruta: [{ f: 0, x: X, y: PC }], asiento: [{ f: 0, v: undefined }], dir: [{ f: 0, v: 1 }],
          poses: [{ f: 0, v: { hI: 90, cI: 40, tronco: 6, cabeza: 8 } }, ...[0, 1, 2, 3].map(tam)],
          caras: [{ f: 0, v: "cansado" }, { f: 30, v: "triste" }], miradas: [{ f: 0, v: { x: 0.3, y: -0.2 } }, { f: 26, v: { x: 0.6, y: 0.4 } }] })} />
      </>}
      hud={<svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* el vidrio visto desde afuera: marco, parante, vidrio frío y la lluvia que baja POR DELANTE */}
        <rect x={0} y={0} width={1920} height={1080} fill="#6a86a8" opacity={0.12} />
        <rect x={0} y={0} width={1920} height={70} fill="#2a2522" /><rect x={0} y={1010} width={1920} height={70} fill="#2a2522" />
        <rect x={0} y={0} width={70} height={1080} fill="#2a2522" /><rect x={1850} y={0} width={70} height={1080} fill="#2a2522" />
        <rect x={1290} y={0} width={34} height={1080} fill="#2a2522" />
        {Array.from({ length: 40 }).map((_, k) => { const x0 = 80 + ((k * 211) % 1760), y0 = ((f * (9 + (k % 4)) + k * 97) % 1150) - 60; return <line key={k} x1={x0} y1={y0} x2={x0 - 6} y2={y0 + 44} stroke="#dfe8f2" strokeWidth={3} opacity={0.5} />; })}
        {Array.from({ length: 14 }).map((_, k) => <circle key={k} cx={120 + ((k * 389) % 1680)} cy={90 + ((k * 263 + f * (k % 3)) % 900)} r={5 + (k % 3) * 2} fill="#dfe8f2" opacity={0.35} />)}
      </svg>}
    />
  );
};

// E71 · 467,0-471,0 «And Leo Marsh, twenty-four years old, sitting on his mattress with his hands in his lap»: YA sentado en el colchón
// desde el primer cuadro, plano frontal amplio con los dibujos arriba; respira, se mira las manos y las junta en el regazo
export const SeSienta3: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 467.0;
  const corte = loc(t0, 469.4), cae = loc(t0, 468.2), manos = loc(t0, 470.6);
  const X = CTO.colchon + 160;
  const SIN = { ...SENTADO, hD: 30, cD: 72, hI: 32, cI: 70, tronco: 12, cabeza: 18 };
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, X + 200, PC - 300, 2.3), mira(cae, X + 40, PC - 250, 2.45, { curva: "inout" }), mira(corte - 1, X + 30, PC - 245, 2.5),
        mira(corte, X + 60, PC - 85, 3.4, { rot: 3 }), mira(120, X + 60, PC - 88, 3.55, { rot: 3, curva: "inout" })]}
      medio={<>
        {pared}
        <Actor {...leoCto({ ruta: [{ f: 0, x: X + 300, y: PC }, { f: cae - 8, x: X, y: PC }], asiento: [{ f: 0, v: undefined }, { f: cae, v: CTO.COLCHON_ALTO }], correr: 0,
          dir: [{ f: 0, v: -1 }, { f: cae - 8, v: 1 }],
          poses: [{ f: 0, v: { hD: 10, cD: 20, hI: -10, cI: 20, tronco: 8, cabeza: 14 } }, { f: cae - 4, v: { hD: 30, cD: 30, hI: 30, cI: 30, tronco: 14, cabeza: 10 } }, { f: cae, v: { ...SENTADO, hD: 50, cD: 30, hI: 50, cI: 30, tronco: -10, cabeza: -10 } },
            { f: cae + 10, v: { ...SENTADO, hD: 50, cD: 80, hI: 45, cI: 85, tronco: 6, cabeza: 10 } }, { f: corte + 6, v: { ...SENTADO, hD: 50, cD: 95, hI: 45, cI: 100, tronco: 8, cabeza: 14 } }, { f: manos, v: SIN }],
          caras: [{ f: 0, v: "cansado" }, { f: cae, v: "neutral" }, { f: cae + 14, v: "cansado" }, { f: manos, v: "triste" }], miradas: [{ f: 0, v: { x: 0.2, y: 0.6 } }, { f: cae + 14, v: { x: 0.4, y: 0.8 } }, { f: manos, v: { x: 0.1, y: 1 } }] })} />
        {/* el colchón se hunde cuando cae */}
        {(() => { const f = useF(); const u = f >= cae && f < cae + 10 ? Math.sin(Math.PI * (f - cae) / 10) : 0; return u > 0 ? [-1, 1].map((k) => <path key={k} d={`M${X + k * 90},${PC - CTO.COLCHON_ALTO + 4} l${k * (20 + 30 * u)},${-6 - 8 * u}`} stroke="#f4efe4" strokeWidth={5} strokeLinecap="round" opacity={u} />) : null; })()}
      </>}
      hud={<TextoMano texto="leo marsh · 24" x={960} y={960} desde={loc(t0, 467.5)} hasta={corte} />} />
  );
};
export const SeSienta3Viejo: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 467.0;
  const manos = loc(t0, 470.6);
  const X = CTO.colchon + 160;
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, X + 10, PC - 215, 2.55, { rot: -2 }), mira(120, X + 10, PC - 210, 2.7, { rot: -1, curva: "inout" })]}
      medio={<>
        {pared}
        <Actor {...leoCto({ ruta: [{ f: 0, x: X, y: PC }],
          poses: [{ f: 0, v: { ...SENTADO, hD: 60, cD: 40, hI: 50, cI: 50, tronco: -4, cabeza: -8 } }, { f: 36, v: { ...SENTADO, hD: 40, cD: 70, hI: 40, cI: 70, tronco: 2, cabeza: 6 } }, { f: 70, v: { ...SENTADO, hD: 50, cD: 90, hI: 45, cI: 95, tronco: 8, cabeza: 14 } },
            { f: manos, v: { ...SENTADO, hD: 30, cD: 72, hI: 32, cI: 70, tronco: 12, cabeza: 18 } }],
          caras: [{ f: 0, v: "neutral" }, { f: 36, v: "cansado" }, { f: manos, v: "triste" }], miradas: [{ f: 0, v: { x: 0.2, y: -0.4 } }, { f: 36, v: { x: 0.4, y: 0.8 } }, { f: manos, v: { x: 0.1, y: 1 } }] })} />
      </>}
      hud={<TextoMano texto="leo marsh · 24" x={960} y={960} desde={loc(t0, 467.5)} />} />
  );
};

// E73-A · 479,0-482,2 «his hand starts to itch and behind his shoulder…»: a la altura del colchón: la mano derecha se rasca la palma,
// el teléfono boca abajo al lado de la rodilla; la mano se le va hacia el teléfono y frena
export const Pica3: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const f = useF();
  const t0 = 479.0;
  const vaHacia = loc(t0, 480.8), frena = loc(t0, 481.5);
  const X = CTO.colchon - 250;
  const rasca = Array.from({ length: 6 }).map((_, k) => ({ f: 8 + k * 8, v: { ...SENTADO, hI: 60, cI: 80, hD: 64 + (k % 2) * 12, cD: 96 - (k % 2) * 18, tronco: 12, cabeza: 18 } }));
  const pica = f >= 8 && f < vaHacia;
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, X + 120, PC - 135, 3.3, { rot: 2 }), mira(frena + 2, X + 140, PC - 135, 3.4, { rot: 2, curva: "inout" }), mira(frena + 3, X + 10, PC - 255, 2.9, { rot: -3 }), mira(96, X + 10, PC - 258, 3.0, { rot: -3 })]}
      medio={<>
        {pared}
        {/* teléfono boca abajo sobre el colchón, un poco inclinado para que se lea */}
        <g transform={`translate(${X + 190},${PC - CTO.COLCHON_ALTO - 6}) rotate(-14)`}>
          <rect x={-46} y={-26} width={92} height={26} rx={7} fill="#15161a" stroke="#3a3c44" strokeWidth={3} />
          <rect x={18} y={-22} width={16} height={12} rx={3} fill="#2a2b31" />
        </g>
        <Actor {...leoCto({ ruta: [{ f: 0, x: X, y: PC }],
          poses: [{ f: 0, v: { ...SENTADO, hI: 40, cI: 70, hD: 40, cD: 70, tronco: 8, cabeza: 12 } }, ...rasca, { f: vaHacia, v: { ...SENTADO, hD: 30, cD: 10, hI: 40, cI: 70, tronco: 22, cabeza: 20 } }, { f: frena, v: { ...SENTADO, hD: 50, cD: 60, hI: 40, cI: 70, tronco: 6, cabeza: -4 } }],
          caras: [{ f: 0, v: "neutral" }, { f: 14, v: "duda" }, { f: vaHacia, v: "determinado" }, { f: frena, v: "enojo" }], miradas: [{ f: 0, v: { x: 0.5, y: 0.8 } }, { f: vaHacia - 10, v: { x: 0.8, y: 0.8 } }, { f: frena, v: { x: -0.5, y: -0.2 } }] })} />
        {pica && [0, 1, 2].map((k) => { const u = ((f + k * 6) % 18) / 18; return <path key={k} d={`M${X + 60 + k * 18},${PC - 150 - u * 30} l8,-14`} stroke={ACENTO} strokeWidth={4} strokeLinecap="round" opacity={0.8 * (1 - u)} />; })}
      </>}
      hud={<TextoMano texto="his hand starts to itch." x={960} y={960} desde={10} hasta={vaHacia} />} />
  );
};

// E74 · 488,2-494,3: igual que antes (Leo de pie frente a los dibujos, se da vuelta y señala) pero el texto va ABAJO, en la banda libre
export const TuTyler3: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => (
  <Cortes planos={[[0, <Boredom4 pared={pared} />], [loc(488.2, 488.9), <TuTyler3b pared={pared} />, loc(488.2, 488.9)]]} />
);
const Boredom4: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => (
  <EnCuarto dia momento="lluvia" leo={null}
    cam={[mira(0, ABX + 10, PC - 124, 3.9, { rot: 4 }), mira(21, ABX + 10, PC - 126, 4.0, { rot: 4 })]}
    medio={<>{pared}<Actor look={ABURRIDO} escala={ESC * 0.62} seed={88} ruta={[{ f: 0, x: ABX, y: PC - 30 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "picaro" }]} poses={[{ f: 0, v: "manosCintura" }]} /></>}
    hud={<TextoMano texto="boredom." x={960} y={300} desde={0} color="#c9c6c0" />} />
);
const TuTyler3b: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const t0 = 488.2;
  const quien = loc(t0, 488.9), que = loc(t0, 490.6), abajo = loc(t0, 492.6);
  const X = CTO.colchon + 230;
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, X - 20, PC - 300, 2.6), mira(abajo - 1, X - 30, PC - 302, 2.75, { curva: "inout" }), mira(abajo, X + 30, PC - 230, 2.3, { rot: 4 }), mira(183, X + 30, PC - 228, 2.4, { rot: 4, curva: "inout" })]}
      medio={<>
        {pared}
        <Actor {...leoCto({ ruta: [{ f: 0, x: X, y: PC }], asiento: [{ f: 0, v: undefined }], dir: [{ f: 0, v: -1 }, { f: quien - 8, v: 1 }],
          poses: [{ f: 0, v: { hD: 30, cD: 40, cabeza: -8 } }, { f: quien, v: { hD: 95, cD: 0, tronco: 4 } }, { f: que, v: { hD: 60, cD: 80, hI: 60, cI: 80, cabeza: 6 } }, { f: abajo, v: { hD: 40, cD: -10, tronco: 8, cabeza: 10 } }],
          caras: [{ f: 0, v: "cansado" }, { f: quien, v: "determinado" }, { f: que, v: "duda" }, { f: abajo, v: "feliz" }],
          miradas: [{ f: 0, v: { x: 0.5, y: -0.6 } }, { f: quien, v: { x: 1, y: 0 } }, { f: abajo, v: { x: 0.8, y: 0.6 } }] })} />
      </>}
      hud={<>
                <ManoLeo texto="who is your tyler?" x={1420} y={980} desde={quien} hasta={que} />
        <ManoLeo texto="what don't they post at 3 a.m.?" x={1300} y={980} desde={que} hasta={abajo} />
        <ManoLeo texto="tell me below ↓" x={1420} y={980} desde={abajo} />
      </>} />
  );
};

// E70 = A (de la vuelta 2: cruza a la ventana) + B contraplano desde afuera · E73 = A mano que pica + B la voz lejos (vuelta 2)
export const ALaVentana3: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => (
  <Cortes planos={[[0, <ALaVentanaA pared={pared} />], [loc(461.6, 465.3), <VentanaAfuera pared={pared} />]]} />
);
export const Picazon3: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => (
  <Cortes planos={[[0, <Pica3 pared={pared} />], [loc(479.0, 482.2), <VozLejos4 pared={pared} />], [loc(479.0, 484.2), <VozCerca4 pared={pared} />], [loc(479.0, 486.9), <VozB3c pared={pared} />]]} />
);
// E73 · 482,2-484,2 «from somewhere very far away»: por encima del hombro de Leo (nuca en primer plano), lejos junto a la ventana asoma la vocecita gris
const VozLejos4: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const f = useF();
  return (
    <AbsoluteFill>
      <EnCuarto dia momento="lluvia" leo={null}
        cam={[mira(0, ABX + 260, PC - 200, 2.0), mira(60, ABX + 220, PC - 198, 2.1, { curva: "inout" })]}
        medio={<>{pared}
          <g opacity={interpolate(f, [20, 32], [0, 1], cl)}>
            <Actor look={ABURRIDO} escala={ESC * 0.62} seed={88} ruta={[{ f: 0, x: ABX, y: PC - 30 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "cansado" }]} poses={[{ f: 0, v: "parado" }, { f: 34, v: "saludar" }, { f: 44, v: { hD: 120, cD: 40 } }, { f: 54, v: "saludar" }]} />
          </g>
        </>} />
      <Nuca x={1560} luz={false} />
    </AbsoluteFill>
  );
};
// E73 · 484,2-486,9 «he hears a tiny voice»: la vocecita gris EN PRIMER PLANO, chiquita pero llenando el cuadro, habla
const VozCerca4: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => (
  <EnCuarto dia momento="lluvia" leo={null}
    cam={[mira(0, ABX + 10, PC - 120, 3.6, { rot: -3 }), mira(81, ABX + 10, PC - 124, 3.8, { rot: -3, curva: "inout" })]}
    medio={<>{pared}
      <Actor look={ABURRIDO} escala={ESC * 0.62} seed={88} ruta={[{ f: 0, x: ABX, y: PC - 30 }]} dir={[{ f: 0, v: 1 }]}
        caras={[{ f: 0, v: "cansado" }, { f: 46, v: "picaro" }]} habla={[[6, 40], [50, 74]]} poses={[{ f: 0, v: "saludar" }, { f: 14, v: { hD: 120, cD: 40 } }, { f: 28, v: "saludar" }, { f: 46, v: "manosCintura" }]} />
    </>}
    hud={<TextoMano texto="bored?" x={960} y={300} desde={8} color="#c9c6c0" />} />
);
// E73 · 486,9-488,2 «not the shadow. something worse.»: primer plano grande de Leo con miedo
const VozB3c: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => (
  <EnCuarto dia momento="lluvia" leo={null}
    cam={[mira(0, CTO.colchon + 10, PC - 240, 3.0, { rot: 3 }), mira(39, CTO.colchon + 10, PC - 243, 3.15, { rot: 3, curva: "inout" })]}
    medio={<>{pared}<Actor {...leoCto({ dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70 } }, { f: 8, v: { ...SENTADO, hD: 110, cD: 120, hI: 105, cI: 125, tronco: -8, cabeza: -8 } }],
      caras: [{ f: 0, v: "miedo" }], miradas: [{ f: 0, v: { x: -1, y: 0 } }] })} /></>}
    hud={<TextoMano texto="something worse." x={960} y={300} desde={4} color="#c9c6c0" />} />
);

// E73 · 484,2-486,9 «he hears a tiny voice»: Leo en primer plano a la derecha, girado hacia la vocecita gris que asoma junto a la ventana
const VozB2c: React.FC<{ pared?: React.ReactNode }> = ({ pared }) => {
  const f = useF();
  const X = CTO.colchon - 150;
  return (
    <EnCuarto dia momento="lluvia" leo={null}
      cam={[mira(0, X - 190, PC - 250, 2.1), mira(81, X - 210, PC - 248, 2.2, { curva: "inout" })]}
      medio={<>
        {pared}
        <g opacity={interpolate(f, [4, 16], [0, 1], cl)}>
          <Actor look={ABURRIDO} escala={ESC * 0.7} seed={88} ruta={[{ f: 0, x: ABX + 90, y: PC - 30 }]} dir={[{ f: 0, v: 1 }]}
            caras={[{ f: 0, v: "cansado" }, { f: 50, v: "picaro" }]} habla={[[12, 44]]} poses={[{ f: 0, v: "saludar" }, { f: 20, v: { hD: 120, cD: 40 } }, { f: 36, v: "saludar" }, { f: 56, v: "manosCintura" }]} />
        </g>
        <Actor {...leoCto({ ruta: [{ f: 0, x: X, y: PC }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70, tronco: 4 } }, { f: 14, v: { ...SENTADO, hD: 30, cD: 70, hI: 30, cI: 70, tronco: -10, cabeza: -10 } }],
          caras: [{ f: 0, v: "duda" }, { f: 30, v: "sorpresa" }], miradas: [{ f: 0, v: { x: -1, y: 0.1 } }] })} />
      </>}
      hud={<TextoMano texto="bored?" x={960} y={300} desde={12} color="#c9c6c0" />} />
  );
};

// ===================== LAVADERO =====================
const P = LAV.P;
// teléfono GRANDE en la mano de Leo: dorso negro hasta que lo da vuelta (escala X) y aparece el auto de Tyler
const TelAuto: React.FC<{ f: number; gira: number }> = ({ f, gira }) => {
  const k = interpolate(f, [gira, gira + 5, gira + 10], [1, 0.05, 1], cl);
  const frente = f >= gira + 5;
  return (
    <g transform={`rotate(-90) scale(${k * 1.25},1.25)`}>
      {frente && <Halo x={0} y={-40} r={90} color={ACENTO} fuerza={0.35} />}
      <rect x={-30} y={-96} width={60} height={104} rx={9} fill="#15151a" stroke="#3a3a44" strokeWidth={3} />
      {frente ? <g transform="rotate(180 0 -44)">
        <rect x={-25} y={-90} width={50} height={92} rx={5} fill="#f6b46a" />
        <rect x={-25} y={-30} width={50} height={32} fill="#d9cdb8" />
        <path d="M-20,-30 L-16,-42 Q-10,-52 4,-52 Q14,-52 18,-42 L22,-30 Z" fill="#c8323a" />
        <circle cx={-12} cy={-28} r={5} fill="#1a1a20" /><circle cx={12} cy={-28} r={5} fill="#1a1a20" />
        <rect x={-8} y={-50} width={14} height={7} rx={2} fill="#bfe0f4" />
      </g> : <circle cx={-14} cy={-80} r={6} fill="#2a2a30" />}
    </g>
  );
};
export const TelDaVuelta: React.FC<{ medio?: React.ReactNode }> = ({ medio }) => {
  const f = useF();
  const gira = loc(92.3, 92.7), alza = loc(92.3, 93.9), dice = loc(92.3, 95.2);
  return (
    <EnLavadero medio={medio}
      cam={[mira(0, LAV.leo + 150, P - 290, 2.2), mira(123, LAV.leo + 160, P - 292, 2.32, { curva: "inout" })]}
      leo={{ poses: [{ f: 0, v: { ...SENTADO, hD: 70, cD: 60, cabeza: 14 } }, { f: gira, v: { ...SENTADO, hD: 80, cD: 30, cabeza: 6 } }, { f: alza, v: { ...SENTADO, hD: 112, cD: 8, tronco: -4, cabeza: -4 } }, { f: alza + 30, v: { ...SENTADO, hD: 118, cD: 4, tronco: -6, cabeza: -6 } }],
        caras: [{ f: 0, v: "triste" }, { f: alza, v: "enojo" }], habla: [[dice, dice + 18]], miradas: [{ f: 0, v: { x: 0.4, y: 0.6 } }, { f: alza, v: { x: 0.9, y: 0 } }],
        enManoD: (q: number) => <TelAuto f={q} gira={gira} /> }}
      hud={<>
        {/* la cabeza calva y el hombro de Tenzo, de espaldas, en primer plano a la derecha */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(1700,${900 + 3 * Math.sin(f / 23)})`}>
            <path d="M-330,200 Q-300,20 -120,-10 L140,-10 Q330,20 360,200 Z" fill="#6f6b64" />
            <path d="M-90,-10 Q-60,60 0,70 Q60,60 90,-10" fill="none" stroke="#7a4a2a" strokeWidth={10} />
            <ellipse cx={0} cy={-170} rx={150} ry={165} fill="#d9a87a" />
            <path d="M-120,-260 Q-60,-320 40,-310" stroke="#f6dcbc" strokeWidth={14} fill="none" opacity={0.6} strokeLinecap="round" />
            <ellipse cx={-148} cy={-160} rx={22} ry={38} fill="#c99670" />
          </g>
        </svg>
        <ManoLeo texto="look at this." x={960} y={300} desde={dice} />
      </>} />
  );
};
export const Devuelve: React.FC<{ medio?: React.ReactNode }> = ({ medio }) => {
  const agarra = 30;
  const plano = (cam: ReturnType<typeof mira>[]) => (
    <EnLavadero medio={medio} cam={cam}
      tenzo={{ poses: [{ f: 0, v: { ...TENZO_MESA, hD: 70, cD: 40 } }, { f: 12, v: { hD: 92, cD: 0, tronco: 10, hI: 32, cI: 92 } }, { f: agarra + 10, v: TENZO_MESA }], caras: [{ f: 0, v: "neutral" }, { f: 30, v: "feliz" }],
        miradas: [{ f: 0, v: { x: -0.9, y: 0.2 } }], enManoD: (q: number) => (q < agarra ? <Tel s={2.3} /> : null) }}
      leo={{ poses: [{ f: 0, v: SENTADO }, { f: 18, v: { ...SENTADO, hD: 85, cD: 0, tronco: 8 } }, { f: agarra + 4, v: { ...SENTADO, hD: 50, cD: 110, tronco: 12, cabeza: 22 } }, { f: 56, v: { ...SENTADO_TEL, hD: 40, cD: 120, tronco: 16, cabeza: 26 } }],
        enManoD: (q: number) => (q >= agarra ? <Tel s={1.8} /> : null), caras: [{ f: 0, v: "triste" }, { f: agarra + 4, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: agarra + 4, v: { x: 0.3, y: 0.9 } }] }} />
  );
  return <Cortes planos={[
    [0, plano([mira(0, 1450, P - 225, 2.45, { rot: -4 }), mira(agarra, 1440, P - 228, 2.55, { rot: -4, curva: "inout" })]), 0],
    [14, <InsertoTel />, 14],
    [42, plano([mira(42, LAV.leo + 20, P - 260, 2.75, { rot: 3 }), mira(60, LAV.leo + 10, P - 262, 2.85, { rot: 3, curva: "inout" })]), 42],
  ]} />;
};

// E18 · inserto: el teléfono GRANDE pasa de la mano vieja de Tenzo (derecha) a la de Leo (abajo a la izquierda), clic al soltar
const InsertoTel: React.FC = () => {
  const f = useF();
  const ag = 30;
  const e = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: (t) => 1 - (1 - t) * (1 - t) });
  const px = 1180 - 300 * e(14, ag) - 80 * e(ag, 44), py = 520 + 40 * e(14, ag) + 30 * e(ag, 44), rot = -18 + 10 * e(14, ag);
  const tz = interpolate(f, [ag, ag + 12], [0, 520], cl); // la mano de Tenzo se va
  const lx = interpolate(f, [14, ag - 4], [-380, 0], { ...cl, easing: (t) => 1 - (1 - t) * (1 - t) }); // la de Leo llega
  return (
    <AbsoluteFill style={{ background: "#e8e2d6", overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[260, 760, 1260, 1760].map((x) => <g key={x}><rect x={x - 220} y={-40} width={440} height={520} rx={18} fill="#f1eee8" stroke="#cfcac0" strokeWidth={6} /><circle cx={x} cy={250} r={150} fill="#d9d6d0" stroke="#b9b4aa" strokeWidth={14} /></g>)}
        <rect x={0} y={640} width={1920} height={440} fill="#c9c1b2" /><rect x={0} y={632} width={1920} height={18} fill="#9a9a9f" />
        <g transform={`translate(${px},${py}) rotate(${rot})`}>
          <Halo x={0} y={-30} r={330} color={ACENTO} fuerza={0.22} />
          <rect x={-130} y={-250} width={260} height={480} rx={34} fill="#15151a" stroke="#3a3a44" strokeWidth={6} />
          <rect x={-114} y={-232} width={228} height={444} rx={20} fill="#a9c4e0" />
          <rect x={-114} y={40} width={228} height={172} fill="#9aa0a8" />
          <path d="M-100,60 Q-98,20 -70,14 L-40,-14 Q0,-26 40,-14 L74,14 Q100,20 102,60 Z" fill="#0f1014" />
          <circle cx={-60} cy={62} r={16} fill="#1a1a1e" stroke="#6a6a72" strokeWidth={4} /><circle cx={64} cy={62} r={16} fill="#1a1a1e" stroke="#6a6a72" strokeWidth={4} />
          <text x={86} y={-200} textAnchor="end" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={30} fill={ACENTO}>▶ 41</text>
          {/* dedos de Tenzo sobre el borde derecho */}
          {tz < 500 && <g transform={`translate(${tz},${-tz * 0.2})`}>
            <path d="M120,-120 L520,-210 L560,40 L150,90 Z" fill="#8e8a82" />
            <ellipse cx={150} cy={-20} rx={74} ry={96} fill="#f2bf8f" stroke="#c9946a" strokeWidth={4} />
            {[-70, -30, 10].map((y) => <rect key={y} x={86} y={y} width={78} height={34} rx={16} fill="#f2bf8f" stroke="#c9946a" strokeWidth={4} />)}
          </g>}
          {/* la mano de Leo desde abajo a la izquierda */}
          <g transform={`translate(${lx},${-lx * 0.4})`}>
            <path d="M-150,140 L-520,420 L-380,620 L-60,260 Z" fill="#24242a" />
            <ellipse cx={-120} cy={160} rx={86} ry={70} fill="#ecc9a3" stroke="#c29c76" strokeWidth={4} />
            {[100, 140, 180].map((x) => <rect key={x} x={x - 240} y={196} width={32} height={60} rx={15} fill="#ecc9a3" stroke="#c29c76" strokeWidth={4} transform={`rotate(-20 ${x - 224} 226)`} />)}
            <rect x={-150} y={60} width={70} height={30} rx={15} fill="#ecc9a3" stroke="#c29c76" strokeWidth={4} transform="rotate(-30 -115 75)" />
          </g>
        </g>
        {f >= ag && f < ag + 8 && [-1, 0, 1].map((k) => <path key={k} d={`M${px + 150 + k * 10},${py - 280 + k * 50} l${36 - (f - ag) * 2},${-20 + k * 20}`} stroke={ORO} strokeWidth={7} strokeLinecap="round" opacity={1 - (f - ag) / 8} />)}
      </svg>
    </AbsoluteFill>
  );
};

// E55 · inserto del golpecito: la mano vieja de Tenzo golpea tres veces la mesa plegable con los nudillos; onda y la caja salta
export const ToqueMesa: React.FC = () => {
  const f = useF();
  const T0 = 367.25;
  const toques = [367.4, 367.8, 368.3].map((t) => loc(T0, t));
  const d = Math.min(...toques.map((t) => Math.abs(f - t)));
  const y = 560 - 260 * Math.min(1, d / 6);
  const salto = Math.max(0, ...toques.map((t) => (f >= t && f < t + 9 ? 34 * Math.sin(Math.PI * (f - t) / 9) : 0)));
  return (
    <AbsoluteFill style={{ background: "#ece8e0", overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[200, 640, 1080, 1520].map((x) => <g key={x}><rect x={x - 200} y={-60} width={400} height={500} rx={18} fill="#f4f2ee" stroke="#d2cdc4" strokeWidth={6} /><circle cx={x} cy={200} r={130} fill="#dcd9d3" stroke="#bbb6ac" strokeWidth={12} /></g>)}
        <rect x={0} y={560} width={1920} height={520} fill="#d3cbbd" /><rect x={0} y={548} width={1920} height={22} fill="#9a9a9f" />
        {/* la caja de metal */}
        <g transform={`translate(640,${700 - salto}) rotate(${salto * 0.12})`}>
          <rect x={-260} y={-150} width={520} height={190} rx={14} fill="#b9bcc2" stroke="#7d8088" strokeWidth={8} />
          <rect x={-276} y={-176} width={552} height={40} rx={10} fill="#cfd2d8" stroke="#7d8088" strokeWidth={8} />
          <path d="M-220,-110 L220,-110" stroke="#e8eaee" strokeWidth={8} opacity={0.6} />
        </g>
        <ellipse cx={640} cy={745} rx={260 - salto * 2} ry={22} fill="#000" opacity={0.12} />
        {toques.map((t) => { const u = (f - t) / 14; return u >= 0 && u < 1 ? <ellipse key={t} cx={1300} cy={690} rx={60 + 320 * u} ry={16 + 70 * u} fill="none" stroke={ORO} strokeWidth={12} opacity={1 - u} /> : null; })}
        {toques.map((t) => (f >= t && f < t + 6 ? [-1, 0, 1].map((k) => <path key={`${t}${k}`} d={`M${1300 + k * 70},${600} l${k * 26},-46`} stroke={ORO} strokeWidth={8} strokeLinecap="round" opacity={1 - (f - t) / 6} />) : null))}
        {/* el puño: manga gris desde arriba a la derecha, nudillos abajo */}
        <g transform={`translate(1300,${y}) scale(1.45)`}>
          <path d="M60,-60 L520,-520 L760,-300 L170,40 Z" fill="#8e8a82" />
          <path d="M60,-60 L170,40" stroke="#6f6b64" strokeWidth={10} />
          <ellipse cx={20} cy={-10} rx={110} ry={86} fill="#f2bf8f" stroke="#c9946a" strokeWidth={5} />
          {[-70, -25, 20, 65].map((x) => <ellipse key={x} cx={x} cy={62} rx={26} ry={20} fill="#f2bf8f" stroke="#c9946a" strokeWidth={5} />)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// la nuca de Leo de espaldas en primer plano abajo a la izquierda (POV sobre su hombro, en vez del círculo de cara)
export const Nuca: React.FC<{ x?: number; luz?: boolean }> = ({ x = 300, luz = true }) => {
  const f = useF();
  const cab = 2 * Math.sin(f / 19);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x},${1030 + cab}) rotate(-6)`}>
        <path d="M-260,90 Q-240,-40 -70,-80 L70,-80 Q240,-40 260,90 Z" fill="#1c1c22" />
        <circle cx={0} cy={-190} r={165} fill="#1c1c22" />
        {[-120, -66, -12, 42, 96].map((xx, i) => <path key={i} d={`M${xx - 32},${-300 - (i % 2) * 10} l28,-${74 + (i % 3) * 14} l22,${78 + (i % 2) * 8} Z`} fill="#1c1c22" />)}
        <path d="M150,-240 Q190,-190 165,-120" stroke="#f4efe4" strokeWidth={11} fill="none" opacity={0.75} />
        {luz && <path d="M120,-330 Q175,-280 168,-200" stroke={ACENTO} strokeWidth={6} fill="none" opacity={0.6} />}
      </g>
    </svg>
  );
};
