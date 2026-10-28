// PILOTO de 60 s (vara del creador 28-oct: «el personaje está muy lejos», 2/10): apertura + el mercado (b02) dirigidos
// PLANO POR FRASE. Base = plano medio corto (de la cintura para arriba llenando el cuadro, centrado, un ícono grande al
// lado de la cabeza: la ref del creador), cortes de reacción en cada remate, insertos de objetos, encuadre nuevo cada
// 2–4 s y cámara siempre curva. Personajes en modo dibujo (cel + contorno) para casar con los fondos pintados.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Montaje } from "../../anikit/montaje";
import { PasoGuion } from "../../stickman3d/acciones";
import { Personaje } from "../capa3d";
import { ROPA, OFICIOS } from "../elenco";
import { Dato, EscenaB, Idioma } from "../escena";
import { Simbolo } from "../simbolos";
import { IconoGrande } from "../iconos";
import { CallePintada, Pieza } from "../sets/pintado";
import { Cerdo, Gallina, PAL_LONDRES as PAL, PISO, Perro, Rata } from "../sets/londres";
import { Apertura } from "./Apertura";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// plano medio corto (la ref): cintura → coronilla en el alto del cuadro
export const PMC = { y: PISO - 262, zoom: 3.85 };
const pmc = (f: number, x: number, extra: Parameters<typeof mira>[4] = {}, dz = 0) => mira(f, x, PMC.y, PMC.zoom + dz, { curva: "inout", ...extra });

// b02 palabra → segundo (asr/b02_es.json)
const T2 = { mira: 0.7, esto: 1.9, unas: 4.2, casas: 7.0, asi: 11.3, nohay: 13.3, bueno: 14.7, poreso: 16.9, ventana: 18.6, nopreg: 19.3, apartas: 20.2,
  cerdos: 21.0, gallinas: 22.2, perro: 23.0, fondo: 24.7, agua: 27.1, bano: 28.1, basura: 29.1, bienv: 30.8 };

const B02P: React.FC<{ D: number; L: Idioma }> = ({ D, L }) => {
  const f = useF();
  const k = D / (946 + 12); // los tiempos son de la voz ES; en EN se estiran parejo (el piloto es ES)
  const F = (s: number) => Math.round(s * 30 * k);
  const S = (s: number) => s * k;
  const X = 1300; // Tiza en el mercado
  const RIO = 5600; // en el muelle, con el agua detrás
  const tx = (es: string, en: string) => (L === "es" ? es : en);
  const cerdoX = X - 160 + interpolate(f, [F(20.6), F(22.4)], [0, 560], cl);
  // Tiza: salta al costado cuando tiran el balde y, ya fuera de cuadro, aparece en la orilla del río para el remate
  const tiza: Personaje = {
    x: X, semilla: 7, ropa: ROPA.tiza,
    mov: (s) => ({ dx: s < S(19.7) ? 0 : s < S(24.7) ? interpolate(s, [S(19.7), S(20.1)], [0, 190], cl) : RIO - X }),
    guion: [
      { t: 0, accion: "idle", expr: "confundido", mirada: [-0.9, 0.1] },
      { t: S(0.9), accion: "idle", expr: "confundido", mirada: [0.9, 0.1] },
      { t: S(1.9), accion: "pensar", expr: "sorprendido", mirada: "camara" },
      { t: S(4.2), accion: "encogerse_de_hombros", expr: "nervioso", rotY: 10 },
      { t: S(7.0), accion: "idle", expr: "pensativo", mirada: [0.2, 0.9] },
      { t: S(10.8), accion: "idle", expr: "triste", mirada: [0.1, 1] },
      { t: S(13.3), accion: "idle", expr: "asqueado", mirada: [0, -1] },
      { t: S(14.7), accion: "facepalm", expr: "asqueado" },
      { t: S(16.9), accion: "idle", expr: "confundido", mirada: [0.1, 1] },
      { t: S(18.6), accion: "asustarse", expr: "espantado", mirada: [0, 1] },
      { t: S(19.6), accion: "saltar", expr: "espantado", rotY: 70 },
      { t: S(20.4), accion: "idle", expr: "avergonzado", rotY: -20, mirada: [-0.7, -0.4] },
      { t: S(23.0), accion: "idle", expr: "enamorado", rotY: -50, mirada: [-0.6, -0.8] },
      { t: S(24.7), accion: "idle", expr: "neutral" },
      { t: S(30.6), accion: "explicar", expr: "nervioso", mirada: "camara" },
    ] as PasoGuion[],
  };
  const gente = (i: number, x: number, prof: number, guion: PasoGuion[]): Personaje => ({ x, ropa: ROPA[OFICIOS[(i * 5 + 2) % OFICIOS.length]], guion, semilla: 20 + i, prof });
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} mano={2} seed={21} dibujo={{}}
      claves={[
        // «Primero, mira a tu alrededor»: plano medio corto, él mira a un lado y al otro
        pmc(0, X - 10, {}, 0.1), pmc(F(1.6), X + 10, { rot: 0.6 }),
        // «Esto es Cheapside…»: se abre curvo al mercado entero
        mira(F(2.0), X + 80, PISO - 300, 1.6, { curva: "inout" }), mira(F(3.9), X + 200, PISO - 330, 1.2, { curva: "out", rot: -0.6 }),
        // «70.000 personas viven apretadas»: plano medio de él apretado entre gente
        mira(F(4.25), X + 20, PISO - 200, 2.1, { curva: "inout" }), mira(F(6.8), X, PISO - 215, 2.45, { curva: "inout", rot: 0.8 }),
        // «las casas son de madera, torcidas, cada piso sobresale»: paneo hacia arriba por la fachada
        mira(F(7.1), X + 130, PISO - 430, 1.55, { curva: "inout" }), mira(F(10.5), X + 160, PISO - 700, 1.35, { curva: "inout", rot: -2 }),
        // «la calle casi nunca ve el sol»: plano medio corto, mira arriba
        pmc(F(11.0), X, { rot: -0.8 }, -0.2), pmc(F(13.1), X + 10, {}, 0.1),
        // «No hay alcantarillas»: inserto de los pies en el barro
        mira(F(13.35), X + 10, PISO - 150, 2.2, { curva: "inout" }), mira(F(14.55), X + 20, PISO - 160, 2.4, { curva: "inout" }),
        // «Bueno, sí hay una: la calle»: reacción, plano medio corto que empuja
        pmc(F(14.75), X), pmc(F(16.7), X, { rot: 0.6 }, 0.35),
        // «cuando alguien grita desde una ventana»: arriba a la ventana
        mira(F(17.0), X + 120, PISO - 650, 2.0, { curva: "inout" }), mira(F(19.0), X + 100, PISO - 600, 2.2, { curva: "inout" }),
        // «no preguntas. Te apartas»: plano medio, salta, ¡splash!
        mira(F(19.35), X + 100, PISO - 200, 1.7, { curva: "inout" }), mira(F(20.8), X + 190, PISO - 230, 2.1, { curva: "inout" }),
        // cerdos · gallinas · un perro que te sigue: insertos
        mira(F(21.0), X + 190, PISO - 170, 2.3, { curva: "inout" }), mira(F(22.1), X + 230, PISO - 170, 2.4, { curva: "inout" }),
        mira(F(22.25), X + 330, PISO - 120, 2.8, { curva: "inout" }), mira(F(22.9), X + 350, PISO - 120, 2.9, { curva: "inout" }),
        mira(F(23.05), X + 110, PISO - 170, 2.3, { curva: "inout" }), mira(F(24.5), X + 100, PISO - 180, 2.5, { curva: "inout" }),
        // «al fondo está el río Támesis»: paneo largo al río
        mira(F(25.0), RIO - 200, PISO - 300, 1.1, { curva: "inout" }), mira(F(26.0), RIO - 150, PISO - 280, 1.25, { curva: "inout" }), pmc(F(26.4), RIO, {}, -0.2), pmc(F(26.95), RIO, {}, -0.1),
        // agua de beber · baño público · basura: tres insertos, una palabra cada uno
        mira(F(27.1), RIO - 320, PISO - 200, 2.0, { curva: "inout" }), mira(F(28.0), RIO - 300, PISO - 210, 2.1, { curva: "inout" }),
        pmc(F(28.15), RIO, {}, -0.1), pmc(F(29.0), RIO, {}, 0.1),
        mira(F(29.15), RIO + 340, PISO - 200, 2.0, { curva: "inout" }), mira(F(30.6), RIO + 360, PISO - 210, 2.2, { curva: "inout" }),
        // «¡Bienvenido!»: plano medio corto, sonrisa forzada
        pmc(F(30.8), RIO, {}, -0.35), pmc(D, RIO, { rot: -0.8 }, -0.15),
      ]}
      personajes={[
        tiza,
        // la multitud que lo aprieta (cerca, en el mismo plano)
        gente(0, X - 290, -0.4, [{ t: 0, accion: "explicar", rotY: 40, expr: "hablando" }]),
        gente(1, X + 390, -0.3, [{ t: 0, accion: "cargar_caja", rotY: -60, expr: "enojado" }]),
        gente(2, X - 470, -1.2, [{ t: 0, accion: "reir", rotY: 30, expr: "carcajada" }]),
        gente(3, X + 480, -1.0, [{ t: 0, accion: "idle", rotY: -30, expr: "aburrido" }]),
        gente(4, X + 560, -2.2, [{ t: 0, accion: "caminar", rotY: 90, expr: "neutral" }]),
        // en el río: uno saca agua, otro tira basura
        { x: RIO - 320, ropa: ROPA.pescadero, guion: [{ t: 0, accion: "cargar_caja", rotY: 80, expr: "feliz" }], semilla: 31, prof: -0.6 },
        { x: RIO + 340, ropa: ROPA[OFICIOS[3]], guion: [{ t: 0, accion: "explicar", rotY: 70, expr: "aburrido" }], semilla: 32, prof: -0.6 },
      ]}
      detras={<Pieza n="muelle" cx={RIO + 480} base={PISO + 60} alto={170} espejo />}
      sobre={<>
        <Cerdo x={cerdoX} f={f} />
        {f > F(21.6) && <><Gallina x={X + 300} f={f} /><Gallina x={X + 420} dir={-1} f={f} fase={1} /></>}
        {f > F(22.6) && f < F(24.8) && <Perro x={X + 10} f={f} anda={false} />}
        <Rata x={RIO + 440} y={PISO - 20} f={f} />
        
        <Simbolo tipo="!" x={X + 150} y={PISO - 400} desde={F(18.6)} hasta={F(19.5)} s={1.4} />
        <Simbolo tipo="corazon" x={X - 40} y={PISO - 130} desde={F(23.4)} hasta={F(24.6)} s={0.8} />
        
        {f > F(16.8) && f < F(19.6) && <Vecina f={f} f0={F(16.9)} x={X + 30} />}
        {f > F(16.8) && f < F(19.6) && <Balde x={X + 30} y={PISO - 560 + interpolate(f, [F(18.8), F(19.5)], [0, 30], cl)} />}
        <Chorro f={f} f0={F(19.5)} x={X} />
      </>}
      hud={<>
        <Dato texto="CHEAPSIDE" x={960} y={230} desde={F(2.1)} hasta={F(4.1)} tam={150} color="#fff6e6" rot={0} />
        <Dato texto="70.000" x={1500} y={250} desde={F(4.4)} hasta={F(6.9)} tam={170} rot={-3} />
        <Dato texto={tx("CLOACAS: 0", "SEWERS: 0")} x={960} y={230} desde={F(13.5)} hasta={F(14.6)} tam={140} color="#ff5a3c" rot={0} />
        <Dato texto={tx("¡AGUA VA!", "WATER BELOW!")} x={960} y={220} desde={F(17.9)} hasta={F(19.2)} tam={150} rot={-2} />
        <Dato texto={tx("AGUA", "WATER")} x={960} y={230} desde={F(27.15)} hasta={F(28.05)} tam={170} color="#7fd0f0" rot={0} />
        <Dato texto={tx("BAÑO", "TOILET")} x={960} y={230} desde={F(28.2)} hasta={F(29.05)} tam={170} color="#c8a050" rot={0} />
        <Dato texto={tx("BASURA", "TRASH")} x={960} y={230} desde={F(29.2)} hasta={F(30.7)} tam={170} color="#8fd04a" rot={0} />
        <Dato texto={tx("¡BIENVENIDO!", "WELCOME!")} x={1420} y={300} desde={F(30.9)} hasta={D} tam={120} rot={-3} />
        <IconoGrande tipo="pregunta" desde={F(0.1)} hasta={F(1.8)} />
        <IconoGrande tipo="sol_no" desde={F(11.0)} hasta={F(13.2)} />
        <IconoGrande tipo="cloaca_no" desde={F(14.8)} hasta={F(16.8)} />
        <IconoGrande tipo="alerta" desde={F(26.4)} hasta={F(27.0)} />
        <IconoGrande tipo="olor" desde={F(28.2)} hasta={F(29.05)} x={1340} y={300} />
      </>}
    />
  );
};

// la vecina asomada a la ventana (2D plano, como los fondos): grita y vuelca el balde
const Vecina: React.FC<{ f: number; f0: number; x: number }> = ({ f, f0, x }) => {
  const t = f - f0;
  const asoma = Math.min(1, t / 8);
  const grita = t > 30 ? 1 : 0;
  return (
    <g transform={`translate(${x - 40},${PISO - 560 - 40 * asoma})`}>
      <rect x={-90} y={-40} width={220} height={150} fill="#2a1c12" stroke="#3a2414" strokeWidth={8} />
      <circle cx={10} cy={20} r={48} fill="#f2efe8" stroke="#3a2414" strokeWidth={7} />
      <path d="M-40 0 Q10 -50 60 0 L60 -10 Q10 -70 -40 -10 Z" fill="#d8d0c0" stroke="#3a2414" strokeWidth={6} />
      <circle cx={-6} cy={20} r={6} fill="#262626" /><circle cx={26} cy={20} r={6} fill="#262626" />
      {grita ? <ellipse cx={10} cy={46} rx={14} ry={12} fill="#2e2a2b" /> : <path d="M-4 44 Q10 50 24 44" stroke="#262626" strokeWidth={5} fill="none" />}
      <rect x={-90} y={60} width={220} height={22} fill="#7a4a24" stroke="#3a2414" strokeWidth={6} />
    </g>
  );
};
const Balde: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y}) rotate(150)`}><path d="M-34 -64 L34 -64 L26 0 L-26 0 Z" fill="#9a6a3a" stroke="#3a2414" strokeWidth={6} /><path d="M-34 -64 Q0 -110 34 -64" stroke="#3a3a3a" strokeWidth={5} fill="none" /></g>
);
// el chorro que cae de la ventana y el charco que salpica donde estaba parado
const Chorro: React.FC<{ f: number; f0: number; x: number }> = ({ f, f0, x }) => {
  const t = f - f0;
  if (t < 0 || t > 50) return null;
  const caida = Math.min(1, t / 9);
  const y0 = PISO - 520, y1 = y0 + caida * 520;
  return (
    <g>
      {t < 14 && <path d={`M${x - 26} ${y0} Q${x - 10} ${(y0 + y1) / 2} ${x - 30} ${y1} L${x + 30} ${y1} Q${x + 14} ${(y0 + y1) / 2} ${x + 26} ${y0} Z`} fill="#8a6a2a" stroke="#3a2414" strokeWidth={5} opacity={t < 9 ? 1 : 1 - (t - 9) / 5} />}
      {t >= 8 && [-1, 1].map((d) => [0, 1, 2].map((i) => {
        const u = (t - 8) / 16;
        return <circle key={`${d}${i}`} cx={x + d * (40 + i * 30) * Math.min(1, u * 1.5)} cy={PISO - 10 - (60 + i * 30) * Math.sin(Math.min(1, u) * Math.PI)} r={14 - i * 3} fill="#8a6a2a" stroke="#3a2414" strokeWidth={3} opacity={u < 1 ? 1 : 0} />;
      }))}
      {t >= 8 && <ellipse cx={x} cy={PISO + 6} rx={50 + Math.min(1, (t - 8) / 8) * 60} ry={14} fill="#7a5a22" stroke="#3a2414" strokeWidth={4} />}
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
