// PILOTO de 60 s (vara del creador 28-oct: «el personaje está muy lejos», 2/10): apertura + el mercado (b02) dirigidos
// PLANO POR FRASE. Base = plano medio corto (de la cintura para arriba llenando el cuadro, centrado, un ícono grande al
// lado de la cabeza: la ref del creador), cortes de reacción en cada remate, insertos de objetos, encuadre nuevo cada
// 2–4 s y cámara siempre curva. Personajes en modo dibujo (cel + contorno) para casar con los fondos pintados.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Montaje } from "../../anikit/montaje";
import { PasoGuion } from "../../stickman3d/acciones";
import { Personaje } from "../capa3d";
import { ROPA, OFICIOS } from "../elenco";
import { Dato, EscenaB, Idioma } from "../escena";
import { Globo, IconoGrande } from "../iconos";
import { CallePintada, Pieza } from "../sets/pintado";
import { Cerdo, Gallina, PAL_LONDRES as PAL, PISO, Rata } from "../sets/londres";
import { Apertura } from "./Apertura";
import { PMC, reloj } from "./kit";
export { PMC };

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pmc = (f: number, x: number, extra: Parameters<typeof mira>[4] = {}, dz = 0) => mira(f, x, PMC.y, PMC.zoom + dz, { curva: "inout", ...extra });

// b02 palabra → segundo (asr/b02_es.json)
const T2 = { mira: 0.7, esto: 1.9, unas: 4.2, casas: 7.0, asi: 11.3, nohay: 13.3, bueno: 14.7, poreso: 16.9, ventana: 18.6, nopreg: 19.3, apartas: 20.2,
  cerdos: 21.0, gallinas: 22.2, perro: 23.0, fondo: 24.7, agua: 27.1, bano: 28.1, basura: 29.1, bienv: 30.8 };

// los globitos del mercado (s del b02). Cada uno = un blip suave en la mezcla (D:/rtmp/blanco/piloto/mezclar_blips.py)
export const GLOBOS: { tipo?: Parameters<typeof Globo>[0]["tipo"]; texto?: [string, string]; desde: number; hasta: number; x: number; y: number; cola: [number, number]; tam?: number }[] = [
  { tipo: "gente", texto: ["70.000", "70,000"], desde: 4.4, hasta: 6.9, x: 1270, y: 220, cola: [1050, 330], tam: 1.15 },
  { texto: ["¡AGUA VA!", "WATER BELOW!"], desde: 18.0, hasta: 19.05, x: 1470, y: 250, cola: [1010, 470], tam: 0.95 },
  { tipo: "alerta", desde: 26.4, hasta: 27.0, x: 1400, y: 270, cola: [1080, 370] },
  { tipo: "gota", desde: 27.15, hasta: 28.05, x: 1580, y: 250, cola: [1330, 400] },
  { tipo: "inodoro", desde: 28.2, hasta: 29.05, x: 1430, y: 270, cola: [1090, 380] },
  { tipo: "basura", desde: 29.2, hasta: 30.7, x: 420, y: 230, cola: [650, 360] },
  { texto: ["¡BIENVENIDO!", "WELCOME!"], desde: 30.9, hasta: 32.6, x: 1490, y: 300, cola: [1060, 420], tam: 0.8 },
];

// [s ES, s EN] de las palabras que se corresponden (asr/b02_*.json)
const PARES_B02: [number, number][] = [[0.7, 0.5], [1.9, 1.9], [4.2, 5.0], [7.0, 8.5], [11.3, 14.3], [13.3, 17.4], [14.7, 19.2], [16.9, 22.3], [18.6, 23.8], [19.3, 24.5],
  [20.2, 25.5], [21.0, 27.2], [22.2, 29.3], [23.0, 30.0], [24.7, 32.6], [25.5, 34.1], [27.1, 35.6], [28.1, 36.8], [29.1, 38.0], [30.8, 40.6]];
export const B02P: React.FC<{ D: number; L: Idioma }> = ({ D, L }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B02);
  const X = 1300; // Tiza en el mercado
  const RIO = 5600; // en el muelle, con el agua detrás
  const tx = (es: string, en: string) => (L === "es" ? es : en);
  const fuera = (s: number, lado: number) => ({ dx: s < S(8.32) ? 0 : lado * 9000 }); // la multitud se va en el corte a la fachada (lejos del río también)
  // los empujones del gentío: dos golpes secos que lo corren y vuelve (resorte amortiguado)
  const golpe = (s: number, t0: number, a: number) => (s < t0 ? 0 : a * Math.exp(-(s - t0) * 5) * Math.sin((s - t0) * 14 + 1.2) / Math.sin(1.2));
  const empujon = (s: number) => golpe(s, S(4.6), -28) + golpe(s, S(5.9), 32);
  const baldeGiro = interpolate(f, [F(18.5), F(19.0)], [0, -105], { ...cl, easing: Easing.in(Easing.cubic) });
  const cerdoX = X - 160 + interpolate(f, [F(20.95), F(22.1), F(22.25)], [0, 560, 1400], cl);
  // Tiza: salta al costado cuando tiran el balde y, ya fuera de cuadro, aparece en la orilla del río para el remate
  const tiza: Personaje = {
    x: X, semilla: 7, ropa: ROPA.tiza,
    mov: (s) => ({ dx: s < S(4.5) ? 0 : s < S(6.6) ? empujon(s) : s < S(19.7) ? 0 : s < S(24.7) ? interpolate(s, [S(19.7), S(20.1)], [0, 190], cl) : RIO - X }),
    guion: [
      { t: 0, accion: "idle", expr: "confundido", mirada: [-0.9, 0.1] },
      { t: S(0.9), accion: "idle", expr: "confundido", mirada: [0.9, 0.1] },
      { t: S(1.9), accion: "pensar", expr: "sorprendido", mirada: "camara" },
      { t: S(4.2), accion: "encogerse_de_hombros", expr: "nervioso", rotY: 10 },
      { t: S(5.0), accion: "idle", expr: "nervioso", mirada: [-0.8, 0] },
      { t: S(6.0), accion: "asustarse", expr: "sorprendido", mirada: [0.8, 0] },
      { t: S(7.0), accion: "idle", expr: "pensativo", mirada: [0.2, 0.9] },
      { t: S(10.8), accion: "idle", expr: "triste", mirada: [0.1, 1] },
      { t: S(13.3), accion: "idle", expr: "asqueado", mirada: [0, -1] },
      { t: S(14.7), accion: "facepalm", expr: "asqueado" },
      { t: S(16.9), accion: "idle", expr: "confundido", rotY: 20, mirada: [0.6, 0.9] },
      { t: S(18.6), accion: "asustarse", expr: "espantado", rotY: 20, mirada: [0.6, 1] },
      { t: S(19.6), accion: "saltar", expr: "espantado", rotY: 70 },
      { t: S(20.4), accion: "idle", expr: "avergonzado", rotY: -20, mirada: [-0.7, -0.4] },
      { t: S(21.0), accion: "asustarse", expr: "sorprendido", rotY: 20, mirada: [0.7, -0.5] },
      { t: S(22.2), accion: "idle", expr: "confundido", rotY: 25, mirada: [0.8, -0.6] },
      { t: S(23.0), accion: "idle", expr: "enamorado", rotY: -50, mirada: [-0.6, -0.8] },
      { t: S(24.7), accion: "idle", expr: "neutral" },
      { t: S(26.4), accion: "asustarse", expr: "sorprendido", mirada: "camara" },
      { t: S(27.1), accion: "idle", expr: "asqueado", rotY: -25, mirada: [-0.9, 0.1] },
      { t: S(28.1), accion: "encogerse_de_hombros", expr: "asqueado", mirada: "camara" },
      { t: S(29.1), accion: "idle", expr: "espantado", rotY: 25, mirada: [0.9, 0.1] },
      { t: S(30.7), accion: "saludar_dos_manos", expr: "feliz", mirada: "camara" },
    ] as PasoGuion[],
  };
  const gente = (i: number, x: number, prof: number, guion: PasoGuion[]): Personaje => ({ x, ropa: ROPA[OFICIOS[(i * 5 + 2) % OFICIOS.length]], guion, semilla: 20 + i, prof, mov: (s) => fuera(s, x < X ? -1 : 1) });
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} mano={2} seed={21} dibujo={{}} profundidad={1}
      claves={[
        // «Primero, mira a tu alrededor»: plano medio corto, él mira a un lado y al otro
        pmc(0, X - 10, {}, 0.1), pmc(F(1.6), X + 10, { rot: 0.6 }),
        // «Esto es Cheapside…»: plano medio, el mercado alrededor
        mira(F(2.0), X - 25, PISO - 272, 2.4, { curva: "inout" }), mira(F(3.9), X - 10, PISO - 285, 2.55, { curva: "out", rot: -0.6 }),
        // «70.000 personas viven apretadas»: plano medio corto apretado entre gente, el globo con la multitud
        mira(F(4.25), X + 10, PISO - 262, 2.9, { curva: "inout" }), mira(F(6.8), X, PISO - 262, 3.2, { curva: "inout", rot: 0.8 }),
        // «las casas son de madera, torcidas…»: inserto corto por la fachada y vuelve a él mirando arriba
        mira(F(7.1), X + 130, PISO - 430, 1.55, { curva: "inout" }), mira(F(8.3), X + 160, PISO - 640, 1.4, { curva: "inout", rot: -2 }),
        mira(F(8.3) + 1, X, CALLEJON.y - 640, 1.55, { curva: "inout", rot: 1.5 }), mira(F(9.5), X, CALLEJON.y - 680, 1.72, { curva: "inout", rot: -1 }),
        mira(F(9.5) + 1, X, PISO - 272, 2.9, { curva: "inout" }), mira(F(10.9), X + 10, PISO - 280, 3.2, { curva: "inout", rot: 0.5 }),
        // «la calle casi nunca ve el sol»: plano medio corto, mira arriba
        pmc(F(11.0), X, { rot: -0.8 }, -0.2), pmc(F(13.1), X + 10, {}, 0.1),
        // «No hay alcantarillas»: inserto de los pies en el barro
        mira(F(13.35), X + 10, PISO - 70, 3.6, { curva: "inout" }), mira(F(14.1), X + 20, PISO - 80, 3.8, { curva: "inout" }), pmc(F(14.15), X, {}, -0.1),
        // «Bueno, sí hay una: la calle»: reacción, plano medio corto que empuja
        pmc(F(14.75), X), pmc(F(16.7), X, { rot: 0.6 }, 0.35),
        // «cuando alguien grita desde una ventana»: arriba a la ventana
        pmc(F(17.0), X, { rot: -0.5 }, -0.15), pmc(F(17.85), X + 10, {}, 0),
        mira(F(17.9), X + 225, PISO - 735, 3.0, { curva: "inout" }), mira(F(19.3), X + 215, PISO - 730, 3.15, { curva: "inout", rot: 0.6 }),
        // «no preguntas. Te apartas»: plano medio de la cintura arriba, salta, ¡splash!
        mira(F(19.3) + 1, X + 100, PISO - 262, 2.3, { curva: "inout" }), mira(F(20.8), X + 170, PISO - 262, 2.6, { curva: "inout" }),
        // cerdos · gallinas · un perro que te sigue: insertos
        mira(F(21.0), X + 200, PISO - 150, 2.6, { curva: "inout" }), mira(F(22.1), X + 250, PISO - 150, 2.75, { curva: "inout" }),
        mira(F(22.25), X + 330, PISO - 170, 2.75, { curva: "inout" }), mira(F(22.9), X + 345, PISO - 170, 2.85, { curva: "inout" }),
        mira(F(23.05), X + 120, PISO - 180, 2.3, { curva: "inout" }), mira(F(24.5), X + 110, PISO - 190, 2.45, { curva: "inout" }),
        // «al fondo está el río Támesis»: paneo largo al río
        mira(F(25.0), RIO - 200, PISO - 300, 1.1, { curva: "inout" }), mira(F(26.0), RIO - 150, PISO - 280, 1.25, { curva: "inout" }), mira(F(26.4), RIO, PISO - 245, 3.6, { curva: "inout" }), mira(F(26.95), RIO, PISO - 255, 3.7, { curva: "inout" }),
        // agua de beber · baño público · basura: él con cada uno, un globito por palabra
        mira(F(27.1), RIO - 190, PISO - 262, 2.0, { curva: "inout" }), mira(F(28.0), RIO - 180, PISO - 262, 2.1, { curva: "inout" }),
        pmc(F(28.15), RIO, {}, -0.1), pmc(F(29.0), RIO, {}, 0.1),
        mira(F(29.15), RIO + 90, PISO - 272, 2.35, { curva: "inout" }), mira(F(30.6), RIO + 100, PISO - 272, 2.45, { curva: "inout" }),
        // «¡Bienvenido!»: plano medio corto con aire arriba, brazos abiertos
        mira(F(30.8), RIO, PISO - 300, 3.1, { curva: "inout" }), mira(D, RIO, PISO - 300, 3.3, { curva: "inout", rot: -0.8 }),
      ]}
      personajes={[
        tiza,
        // la multitud que lo aprieta (cerca, en el mismo plano)
        gente(0, X - 330, -0.8, [{ t: 0, accion: "explicar", rotY: 55, expr: "hablando" }]),
        gente(1, X + 225, -0.8, [{ t: 0, accion: "cargar_caja", rotY: -60, expr: "enojado" }]),
        gente(2, X - 480, -1.4, [{ t: 0, accion: "reir", rotY: 30, expr: "carcajada" }]),
        gente(3, X + 640, -1.2, [{ t: 0, accion: "idle", rotY: -30, expr: "aburrido" }]),
        // en el río: uno saca agua, otro tira basura
        { x: RIO - 380, ropa: ROPA.pescadero, guion: [{ t: 0, accion: "cargar_caja", rotY: 80, expr: "feliz" }], semilla: 31, prof: -0.6 },
        { x: RIO + 360, ropa: ROPA[OFICIOS[3]], guion: [{ t: 0, accion: "explicar", rotY: 70, expr: "aburrido" }, { t: S(29.5), accion: "caminar", rotY: 90, expr: "aburrido" }], semilla: 32, prof: -1.6, escala: 0.9, mov: (s) => ({ dx: s < S(30.75) ? 0 : 9000 }) },
      ]}
      detras={<><Pieza n="muelle" cx={RIO + 480} base={PISO + 60} alto={170} espejo />{f >= F(17.9) && f <= F(19.3) && <ParedVentana x={X} />}{f >= F(8.3) && f <= F(9.55) && <Callejon x={X} />}</>}
      sobre={<>
        {/* los animales 2D llevan el mismo trazo marrón que los personajes */}
        <g stroke="#3a2414" strokeWidth={5} strokeLinejoin="round">
          {f > F(20.95) && <Cerdo x={cerdoX} f={f} s={1.25} />}
          {f > F(21.6) && <><Gallina x={X + 420} f={f} /><Gallina x={X + 545} dir={-1} f={f} fase={1} /></>}
          <Rata x={RIO + 440} y={PISO - 20} f={f} />
        </g>
        {f > F(22.6) && f < F(24.8) && <PerroSentado x={X + 50} f={f} f0={F(22.7)} />}
        {f >= F(17.9) && f <= F(19.3) && <Balde x={X + 145} y={PISO - 705} s={0.85} giro={baldeGiro} />}
        {f >= F(17.9) && f <= F(19.3) && <Vecina f={f} f0={F(17.9)} x={X} giro={baldeGiro} />}
        {f >= F(18.75) && f <= F(19.3) && <Derrame f={f} f0={F(18.75)} x={X + 120} y={PISO - 698} />}
        <Chorro f={f} f0={F(19.3)} x={X - 20} x0={X + 150} y0={PISO - 560} />
        <BasuraAlRio f={f} f0={F(29.3)} x0={RIO + 420} x1={RIO + 700} />
      </>}
      hud={<>
        <Dato texto="CHEAPSIDE" x={960} y={120} desde={F(2.1)} hasta={F(4.1)} tam={120} color="#ffd23c" rot={0} />
        <IconoGrande tipo="pregunta" desde={F(0.1)} hasta={F(1.8)} />
        <IconoGrande tipo="sol_no" desde={F(9.6)} hasta={F(13.2)} />
        <IconoGrande tipo="cloaca_no" desde={F(13.45)} hasta={F(16.8)} />
        {GLOBOS.map((g, i) => <Globo key={i} {...g} texto={g.texto ? tx(g.texto[0], g.texto[1]) : undefined} desde={F(g.desde)} hasta={F(g.hasta)} />)}
      </>}
    />
  );
};

// «tan pegadas que…»: contrapicado del callejón, dos fachadas pintadas que se inclinan una hacia la otra hasta casi tocarse
// arriba (una franja angosta de cielo). Va lejos del set, arriba en el mundo, sólo durante su inserto.
export const CALLEJON = { y: PISO - 2600 };
const Callejon: React.FC<{ x: number }> = ({ x }) => {
  const b = CALLEJON.y, A = 1000;
  return <g>
    {/* cielo cálido como el resto del piloto (sin esto asomaba el celeste frío del set) */}
    <defs><linearGradient id="cieloCallejon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6dcc4" /><stop offset="1" stopColor="#f3c9b4" /></linearGradient></defs>
    <rect x={x - 1600} y={b - 1900} width={3200} height={1900} fill="url(#cieloCallejon)" />
    <g transform={`rotate(9 ${x - 75} ${b})`}><Pieza n="casa_c" cx={x - 75 - (1119 * A) / 1500 / 2} base={b} alto={A} /></g>
    <g transform={`rotate(-9 ${x + 75} ${b})`}><Pieza n="casa_f" cx={x + 75 + (1136 * A) / 1500 / 2} base={b} alto={A} espejo /></g>
  </g>;
};
// la vecina asomada a SU ventana: el primer plano es la fachada PINTADA (casa_a agrandada ≤1,7×, con sus vecinas a los lados
// para que no se vea el borde), así tiene el mismo trazo que el resto del set. Va en «detras»: sin saturar, como todo fondo.
const VX = 255, VY = 745; // la cara, relativa a (X, PISO): cae en la ventana de postigos de casa_a
export const ParedVentana: React.FC<{ x: number }> = ({ x }) => {
  const A = 950, k = A / 1500, base = PISO - VY - 20 + (1500 - 566) * k; // la ventana está a 566 px del techo de casa_a
  const cx = x + VX + 5 - (458 - 913 / 2) * k;
  const wa = (913 * A) / 1500, wc = (1119 * A) / 1500, wf = (1136 * A) / 1500;
  return <g>
    <Pieza n="casa_c" cx={cx - wa / 2 - wc / 2 + 30} base={base} alto={A} />
    <Pieza n="casa_f" cx={cx + wa / 2 + wf / 2 - 30} base={base} alto={A} espejo />
    <Pieza n="casa_a" cx={cx} base={base} alto={A} />
  </g>;
};
const Vecina: React.FC<{ f: number; f0: number; x: number; giro: number }> = ({ f, f0, x, giro }) => {
  const t = f - f0;
  const asoma = spring({ frame: t, fps: 30, config: { damping: 9, stiffness: 160 } });
  const grita = t > 4 ? 1 : 0;
  const M = "#3a2414";
  return (
    <g transform={`translate(${x + VX},${PISO - VY + 18 * (1 - asoma)}) scale(${0.72 * (0.82 + 0.18 * asoma)})`} strokeLinejoin="round" strokeLinecap="round">
      {/* se inclina hacia afuera por la ventana: hombros y brazos que sostienen el balde */}
      <clipPath id="vecinaAlfeizar"><rect x={-200} y={-200} width={400} height={300} /></clipPath>
      <g clipPath="url(#vecinaAlfeizar)">
        <path d="M-74 150 Q-76 66 0 64 Q76 66 74 150 Z" fill="#b85a4a" stroke={M} strokeWidth={8} />
        <path d="M-30 66 Q0 92 30 66" fill="none" stroke="#8a3a2e" strokeWidth={6} />
      </g>
      <path d={`M-58 96 Q-110 ${70 - giro * 0.2} -130 ${30 - giro * 0.3}`} fill="none" stroke={M} strokeWidth={20} />
      <path d={`M-58 96 Q-110 ${70 - giro * 0.2} -130 ${30 - giro * 0.3}`} fill="none" stroke="#b85a4a" strokeWidth={11} />
      <circle r={64} fill="#f2efe8" stroke={M} strokeWidth={8} />
      {/* cofia de lino */}
      <path d="M-70 -6 Q0 -100 70 -6 Q64 -46 0 -64 Q-64 -46 -70 -6 Z" fill="#f4ecdc" stroke={M} strokeWidth={6} />
      <path d="M-36 -20 L-8 -10 M36 -20 L8 -10" stroke="#262626" strokeWidth={7} />
      <circle cx={-21} cy={4} r={8.5} fill="#262626" /><circle cx={21} cy={4} r={8.5} fill="#262626" />
      {grita ? <ellipse cy={36} rx={19} ry={17 + Math.sin(t * 0.6) * 3} fill="#2e2a2b" stroke={M} strokeWidth={4} /> : <path d="M-14 32 Q0 38 14 32" stroke="#262626" strokeWidth={6} fill="none" />}
      <circle cx={-44} cy={24} r={10} fill="#f0a0a0" opacity={0.6} /><circle cx={44} cy={24} r={10} fill="#f0a0a0" opacity={0.6} />
    </g>
  );
};
// balde de madera REDONDO: duelas, dos zunchos curvos, boca elíptica con el agua sucia adentro; gira desde su centro
const Balde: React.FC<{ x: number; y: number; giro: number; s?: number }> = ({ x, y, giro, s: e = 1 }) => {
  const M = "#3a2414";
  return (
    <g transform={`translate(${x},${y}) scale(${e}) rotate(${giro}) translate(0 30)`} stroke={M} strokeLinejoin="round" strokeLinecap="round">
      <path d="M-34 -62 Q-38 -60 -36 -56 L-27 -2 Q0 10 27 -2 L36 -56 Q38 -60 34 -62 Z" fill="#a8743e" strokeWidth={6} />
      {[-18, -6, 6, 18].map((d) => <path key={d} d={`M${d * 1.1} -56 L${d * 0.8} 2`} stroke="#7a4e26" strokeWidth={3} />)}
      <path d="M-35 -46 Q0 -34 35 -46" fill="none" stroke="#5a5450" strokeWidth={7} />
      <path d="M-29 -12 Q0 -1 29 -12" fill="none" stroke="#5a5450" strokeWidth={7} />
      <ellipse cy={-60} rx={36} ry={11} fill="#6a4422" strokeWidth={6} />
      {giro < 40 && <ellipse cy={-58} rx={28} ry={7} fill="#8a6c44" strokeWidth={0} />}
      <path d="M-36 -60 Q0 -112 36 -60" fill="none" stroke="#3a3a3a" strokeWidth={5} />
    </g>
  );
};
// la primera tanda que sale del balde en el primer plano de la ventana (después sigue el Chorro en el plano general)
const Derrame: React.FC<{ f: number; f0: number; x: number; y: number }> = ({ f, f0, x, y }) => {
  const t = f - f0;
  return <g stroke="#3a2414" strokeWidth={3}>{Array.from({ length: 12 }).map((_, i) => {
    const u = (t - i * 0.9) / 10;
    if (u < 0) return null;
    const r = 7 + (i % 3) * 3;
    return <ellipse key={i} cx={x - 40 * u - Math.sin(i * 3.1) * 14} cy={y + 260 * u * u} rx={r} ry={r * (1 + u * 0.8)} fill="#8a6c44" />;
  })}</g>;
};
// el chorro que sale del balde en arco y el charco que salpica donde estaba parado
const Chorro: React.FC<{ f: number; f0: number; x: number; x0: number; y0: number }> = ({ f, f0, x, x0, y0 }) => {
  const t = f - f0;
  if (t < 0 || t > 50) return null;
  const M = "#3a2414", C = "#8a6c44";
  // el chorro = una lluvia de gotas en forma de lágrima, de a tandas (líquido, no un palo): salen del balde de costado y caen
  const gotas = Array.from({ length: 34 }).map((_, i) => {
    const d = ((i * 7) % 11) * 0.7, u = (t - d) / 11;
    if (u < 0 || u > 1.02) return null;
    const jx = Math.sin(i * 12.9898) * 70, r = 14 + ((i * 5) % 4) * 5;
    const px = x0 + (x - x0 + jx) * Math.sqrt(u), py = y0 + (PISO - y0) * u * u;
    const v = 0.55 + u * 0.7; // se estira con la velocidad
    const h = r * 2.2 * v; // lágrima: punta arriba, panza redonda abajo, con su brillo
    return <g key={i} transform={`translate(${px.toFixed(1)} ${py.toFixed(1)})`}><path d={`M0 ${-h} Q${r * 0.85} ${-r * 0.7} ${r} 0 A${r} ${r} 0 0 1 ${-r} 0 Q${-r * 0.85} ${-r * 0.7} 0 ${-h} Z`} fill={C} stroke={M} strokeWidth={3.5} strokeLinejoin="round" /><ellipse cx={-r * 0.35} cy={-r * 0.2} rx={r * 0.18} ry={r * 0.32} fill="#e8dcc0" /></g>;
  });
  return (
    <g>
      {gotas}
      {t >= 10 && [-1, 1].map((d) => [0, 1, 2].map((i) => {
        const u = (t - 10) / 16;
        return <circle key={`${d}${i}`} cx={x + d * (40 + i * 30) * Math.min(1, u * 1.5)} cy={PISO - 10 - (60 + i * 30) * Math.sin(Math.min(1, u) * Math.PI)} r={14 - i * 3} fill={C} stroke={M} strokeWidth={3} opacity={u < 1 ? 1 : 0} />;
      }))}
      {t >= 10 && <ellipse cx={x} cy={PISO + 6} rx={50 + Math.min(1, (t - 10) / 8) * 60} ry={14} fill="#7a5a22" stroke={M} strokeWidth={4} />}
    </g>
  );
};

// el perro que lo adopta: sentado, mira hacia arriba, mueve la cola y ladea la cabeza (entra con un saltito)
const PerroSentado: React.FC<{ x: number; f: number; f0: number }> = ({ x, f, f0 }) => {
  const t = f - f0;
  const M = "#3a2414", P = "#e0b47a", O = "#b07a44";
  const cola = Math.sin(t * 0.9) * 22;
  const ladea = -8 + Math.sin(t * 0.06) * 6;
  const salto = t < 10 ? Math.sin((t / 10) * Math.PI) * 30 : 0;
  const lengua = 2 + Math.abs(Math.sin(t * 0.35)) * 6;
  return (
    <g transform={`translate(${x},${PISO - salto}) scale(1.35)`} stroke={M} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
      <path d={`M-44 -14 q-34 -8 ${-40 + cola * 0.3} ${-40 - cola}`} fill="none" stroke={M} strokeWidth={16} />
      <path d={`M-44 -14 q-34 -8 ${-40 + cola * 0.3} ${-40 - cola}`} fill="none" stroke={O} strokeWidth={9} />
      <path d="M-50 0 Q-60 -70 -10 -84 Q30 -86 34 -40 L30 0 Z" fill={P} />
      <path d="M-34 0 Q-40 -30 -20 -34 Q0 -30 -6 0 Z" fill={O} />
      <rect x={6} y={-44} width={18} height={44} rx={8} fill={P} />
      <path d="M-6 -60 Q4 -30 16 -60 Z" fill="#fff4e0" />
      <g transform={`translate(18 -96) rotate(${ladea})`}>
        <ellipse rx={40} ry={34} fill={P} />
        <ellipse cx={34} cy={10} rx={24} ry={17} fill="#f0d0a0" />
        <ellipse cx={52} cy={2} rx={9} ry={7} fill="#2a1a10" />
        <path d={`M38 24 q4 ${lengua + 8} 12 ${lengua}`} fill="#ff7a8a" />
        <circle cx={12} cy={-8} r={9} fill="#2a1a10" stroke="none" /><circle cx={15} cy={-11} r={3} fill="#fff" stroke="none" />
        <path d="M-30 -24 Q-58 -6 -40 30 Q-24 14 -18 -14 Z" fill={O} />
      </g>
    </g>
  );
};

// la basura que tira el del muelle: tres bultos en arco al agua, cada uno con su anillo
const BasuraAlRio: React.FC<{ f: number; f0: number; x0: number; x1: number }> = ({ f, f0, x0, x1 }) => {
  const t = f - f0;
  if (t < 0 || t > 60) return null;
  const M = "#3a2414";
  const cosas = [{ c: "#8a7a5a", r: 16, d: 0 }, { c: "#c86a3a", r: 11, d: 3 }, { c: "#6a7a4a", r: 13, d: 6 }];
  return (
    <g>
      {cosas.map((k, i) => {
        const u = (t - k.d) / 16;
        if (u < 0) return null;
        const xe = x0 + (x1 - x0 + i * 30) * Math.min(1, u);
        const ye = PISO - 150 + 220 * Math.min(1, u) * Math.min(1, u) - 160 * Math.sin(Math.min(1, u) * Math.PI);
        return u < 1
          ? <g key={i} transform={`translate(${xe},${ye}) rotate(${u * 400})`}><rect x={-k.r} y={-k.r * 0.8} width={k.r * 2} height={k.r * 1.6} rx={4} fill={k.c} stroke={M} strokeWidth={4} /></g>
          : <ellipse key={i} cx={xe} cy={PISO + 70} rx={20 + (u - 1) * 60} ry={6 + (u - 1) * 14} fill="none" stroke="#e8f2f6" strokeWidth={4} opacity={Math.max(0, 1 - (u - 1) * 0.9)} />;
      })}
    </g>
  );
};

// la apertura (b01) + el mercado (b02), con la misma transición que el video entero
export const DUR_PILOTO = [962, 946];
export const Piloto: React.FC<{ idioma: Idioma }> = ({ idioma }) => {
  const D1 = DUR_PILOTO[0] + 12, D2 = DUR_PILOTO[1] + 12 + 30;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Montaje planos={[
        { dur: D1, el: <Apertura D={D1} L={idioma} /> },
        { dur: D2, el: <B02P D={D2 - 30} L={idioma} />, trans: { tipo: "fundido", d: 16 } },
      ]} />
    </AbsoluteFill>
  );
};
