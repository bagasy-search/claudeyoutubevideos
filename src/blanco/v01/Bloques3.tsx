// Bloques 11–14 al nivel del piloto, cada uno con su fondo (pedido del creador 28-oct): b11 posada al alba → calle de la
// peste → la colina de las fosas a la tarde → la ciudad de noche · b12 la calle de día y la huida hacia el río · b13 la
// puerta de Aldgate de día · b14 el campo al atardecer. Tiempos en s ES; `reloj` los lleva a la EN.
import React from "react";
import { interpolate } from "remotion";
import { useF } from "../../anikit/camara";
import { PasoGuion } from "../../stickman3d/acciones";
import { Ropa } from "../../stickman3d/vestuario";
import { Personaje } from "../capa3d";
import { ROPA } from "../elenco";
import { Dato, EscenaB } from "../escena";
import { IconoGrande } from "../iconos";
import { CallePintada, MurallaPintada, TabernaPintada } from "../sets/pintado";
import { Carro, Gato, MURALLA_M, PAL_LONDRES as PAL, PISO } from "../sets/londres";
import { B, cab, cl, E, Globos, M_, Me, P, Pi, reloj, ROPA_T2, Sudor, tomas, ubicado, Vapor, ventanas } from "./kit";
import { PCuaderno, PReloj, PRumor } from "./Piezas";

const tx = (L: string, es: string, en: string) => (L === "es" ? es : en);
const VCOR = 232;
const POSADERO: Ropa = { tunica: { color: "#7a5a3a", largo: 0.55, cinto: "#3a2414" }, delantal: "#e8e0d0", calzas: "#5a4a3a", pelo: { color: "#8a8a8a", estilo: "corto" }, barba: "#8a8a8a", calzado: { tipo: "zuecos", color: "#6a4a2a" } };
// Bigotes en brazos (va sobre el pecho de Tiza)
const GatoBrazo: React.FC<{ x: number; f: number; dir?: 1 | -1; s?: number }> = ({ x, f, dir = 1, s = 0.9 }) => (
  <g stroke={M_} strokeWidth={4}><Gato x={x} y={PISO - 186} f={f} s={s} dir={dir} enojado /></g>
);
// la fosa en la colina: tierra removida y el agujero
const Fosa: React.FC<{ x: number; f: number }> = ({ x, f }) => (
  <g stroke={M_} strokeWidth={6} strokeLinejoin="round">
    <path d={`M${x - 330} ${PISO + 4} Q${x - 260} ${PISO - 90} ${x - 170} ${PISO + 4} Z`} fill="#7a5a36" />
    <path d={`M${x + 170} ${PISO + 4} Q${x + 260} ${PISO - 110} ${x + 360} ${PISO + 4} Z`} fill="#7a5a36" />
    <ellipse cx={x} cy={PISO + 14} rx={190} ry={34} fill="#2a1a12" />
    {[0, 1, 2].map((i) => <circle key={i} cx={x + 200 + ((f * 2 + i * 40) % 120)} cy={PISO - 60 - Math.sin(((f * 2 + i * 40) % 120) / 120 * Math.PI) * 60} r={7} fill="#7a5a36" strokeWidth={3} />)}
  </g>
);

// ── b11 · Día 4: la posada vacía, el posadero tose, el carro, las fosas, la ciudad en silencio ──
const PARES_B11: [number, number][] = [[1.1, 1.4], [1.9, 2.4], [3.1, 3.4], [3.7, 4.8], [4.2, 5.3], [4.9, 6.2], [5.5, 7.0], [6.1, 7.8], [7.0, 8.9], [8.4, 9.7], [8.8, 10.6],
  [9.4, 11.6], [9.8, 12.1], [10.6, 12.8], [11.2, 14.1], [12.5, 15.5], [13.3, 16.3], [13.8, 17.2], [14.5, 18.0], [15.2, 18.4], [15.6, 20.5], [17.2, 20.8], [18.0, 22.3],
  [18.7, 23.4], [20.0, 24.3], [20.7, 25.6], [21.5, 26.2], [22.2, 27.4], [22.8, 28.5], [23.6, 29.6], [24.5, 30.7], [24.9, 31.4], [25.9, 32.4], [26.2, 32.6]];
export const B11P: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B11);
  const hud = <>
    <Dato texto={tx(L, "DÍA 4", "DAY 4")} x={960} y={200} desde={0} hasta={F(1.1)} tam={130} color="#ffd23c" rot={0} />
    <PReloj a={F(17.9)} b={F(21.6)} cientos={F(18.9)} rot={tx(L, "CIENTOS\nPOR DÍA", "HUNDREDS\nA DAY")} />
    <IconoGrande tipo="campana_no" desde={F(23.5)} hasta={F(24.4)} />
    <IconoGrande tipo="gente_no" desde={F(24.4)} hasta={F(25.8)} />
  </>;
  if (f < F(7.0)) {
    // la posada: los cinco ya no están; el posadero tose en la cocina
    const CAMA = 1500, X = 1100, FOG = 2050;
    return (
      <EscenaB Set={TabernaPintada} pal={PAL} interior momento="amanecer" setProps={{ variante: "posada_vacia" }} mano={2} seed={111} dibujo={{}} profundidad={1}
        claves={tomas(F, D, [
          [0, E(CAMA, PISO - 200, 1.2), E(CAMA - 60, PISO - 200, 1.35, 0.5)], // Día 4: te despiertas en una posada vacía
          [3.1, P(X, 0.1), P(X, 0.35, -0.5)], // los cinco de la cama ya no están
          [4.9, Me(FOG, 2.3), Me(FOG + 10, 2.5, 0, 0.5)], // el posadero tose en la cocina
        ])}
        personajes={[
          { x: X, semilla: 7, ropa: ROPA_T2, mov: (s) => (s < S(1.9) ? { dx: CAMA + 100 - X, rz: -90, dy: -10 } : { dx: ventanas(s, [[0, S(4.9)]]) }),
            guion: [{ t: 0, accion: "quieto", expr: "dormido" }, { t: S(1.9), accion: "asustarse", expr: "sorprendido", rotY: 30 }, { t: S(3.4), accion: "pose_manos_cabeza", expr: "asustado", rotY: 20 }] },
          { x: FOG + 120, semilla: 112, ropa: POSADERO, mov: (s) => ({ dx: ventanas(s, [[S(4.9), 99]]) }),
            guion: [{ t: 0, accion: "pose_temblando", expr: "triste", rotY: -40 }, { t: S(5.4), accion: "facepalm", expr: "asqueado", rotY: -30 }] },
        ]}
        sobre={<>{f >= F(4.9) && <><Vapor f={f} x={FOG + 150} y={PISO - 300} color="#b0b0a8" n={2} alto={120} /><Sudor f={f} x={FOG + 120} y={PISO - 330} desde={F(5.0)} hasta={F(7.0)} s={0.8} /></>}</>}
        hud={<>{hud}<Globos F={F} L={L} lista={[{ tipo: "gente_no", desde: 3.6, hasta: 4.8, x: 1420, y: 240, cola: [1060, 330] }]} /></>}
      />
    );
  }
  if (f < F(10.6)) {
    // la calle de la peste a media luz: pasa el carro tapado
    const X = 1800, cx = interpolate(f, [F(7.0), F(10.6)], [1100, 2400], cl);
    return (
      <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} setProps={{ variante: "peste" }} mano={2} seed={113} dibujo={{}} profundidad={1}
        claves={tomas(F, D, [
          [7.0, Me(1450, 1.6), Me(1950, 1.7, 0, 0.5)], // afuera, por la calle, pasa un carro lleno de…
          [9.4, P(X, 0.1), P(X, 0.3, -0.5)], // mejor no mires
        ])}
        personajes={[{ x: X, semilla: 7, ropa: ROPA_T2, guion: [{ t: 0, accion: "idle", expr: "asustado", rotY: -30, mirada: [-0.8, 0] }, { t: S(9.4), accion: "facepalm", expr: "asqueado" }] }]}
        detras={<Carro x={cx} f={f} tapado ruedaGira={f * 3} />}
        sobre={<Vapor f={f} x={cx} y={PISO - 200} color="#9ac85a" n={2} alto={140} />}
        hud={<>{hud}<IconoGrande tipo="calavera" desde={F(8.4)} hasta={F(9.3)} x={960} y={300} /></>}
      />
    );
  }
  if (f < F(18.0)) {
    // la colina fuera de las murallas, a la tarde: cavan fosas enormes
    const FX = 4240, CAV = 3960, CAV2 = 4500;
    const cx = interpolate(f, [F(10.6), F(13.3)], [1700, 2650], cl);
    return (
      <EscenaB Set={MurallaPintada} pal={PAL} setProps={{ hora: 1 }} momento="amanecer" mano={2} seed={114} dibujo={{}} profundidad={1}
        claves={tomas(F, D, [
          [10.6, E(1900, PISO - 330, 0.95), E(2500, PISO - 330, 1.0, 0.5)], // lo llevan a un campo nuevo fuera de las murallas
          [13.3, Me(FX, 1.7, 20), Me(FX + 10, 1.85, 20, -0.5)], // donde ya están cavando fosas enormes
          [15.2, E(1000, PISO - 420, 1.1), E(1040, PISO - 440, 1.2, 0.5)], // en los cementerios de las iglesias no queda lugar
        ])}
        personajes={[
          { x: CAV, semilla: 115, ropa: ROPA.sereno, mov: (s) => ({ dx: ventanas(s, [[S(13.3), S(15.2)]]) }), guion: [{ t: 0, accion: "empujar", expr: "triste", rotY: 50 }] },
          { x: CAV2, semilla: 116, ropa: ROPA.granjero, mov: (s) => ({ dx: ventanas(s, [[S(13.3), S(15.2)]]) }), guion: [{ t: 0, accion: "empujar", expr: "aburrido", rotY: -50 }] },
        ]}
        sobre={<>{f < F(13.3) && <Carro x={cx} f={f} tapado ruedaGira={f * 3} />}{f >= F(13.3) && f < F(15.2) && <Fosa x={FX} f={f} />}</>}
        hud={<>{hud}<IconoGrande tipo="cruz" desde={F(15.6)} hasta={F(17.9)} /><Globos F={F} L={L} lista={[{ texto: ["LLENO", "FULL"], desde: 16.4, hasta: 17.9, x: 1350, y: 250, cola: [1100, 420] }]} /></>}
      />
    );
  }
  // la ciudad de noche, en silencio: sin campanas, sin mercado, sólo carros
  const X = 2600, cx = interpolate(f, [F(25.6), D], [1900, 2900], cl);
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} momento="noche" mano={2} seed={117} dibujo={{}} profundidad={1}
      claves={tomas(F, D, [
        [18.0, Me(X, 1.15, -40), Me(X + 40, 1.3, -40, 0.5)], // en Londres ya mueren cientos por día
        [20.6, P(X, 0.1), P(X, 0.3, -0.5)], // y la ciudad se queda en silencio
        [22.2, E(1560, PISO - 300, 1.9), E(1580, PISO - 300, 2.05, 0.5)], // un silencio raro. Sin campanas, sin gritos del mercado (el puesto vacío)
        [25.6, Me(X - 150, 2.0), Me(X - 120, 2.15, 0, -0.5)], // sólo carros
      ])}
      personajes={[{ x: X, semilla: 7, ropa: ROPA_T2, guion: [{ t: 0, accion: "pose_cabizbajo", expr: "triste" }, { t: S(20.6), accion: "idle", expr: "asustado", mirada: [0.8, -0.2] }, { t: S(22.2), accion: "pose_cabizbajo", expr: "triste" }, { t: S(25.6), accion: "idle", expr: "asustado", mirada: [-0.8, 0], rotY: -30 }] }]}
      detras={f >= F(25.6) ? <Carro x={cx} f={f} tapado ruedaGira={f * 3} /> : undefined}
      hud={hud}
    />
  );
};

// ── b12 · buscan culpables: la mujer señala, media calle detrás, y corre con Bigotes bajo el brazo ──
const PARES_B12: [number, number][] = [[0.9, 0.4], [2.1, 2.4], [3.0, 3.6], [3.9, 5.3], [4.9, 6.2], [5.8, 7.3], [6.4, 8.3], [6.7, 8.6], [7.4, 9.7], [7.9, 10.2], [8.6, 11.2],
  [9.7, 12.8], [10.7, 14.3], [11.4, 15.5], [12.2, 16.4], [12.7, 17.1], [13.5, 18.5], [14.1, 19.5], [15.1, 20.5], [15.4, 21.3], [16.5, 22.3], [16.9, 22.5], [18.1, 24.1],
  [18.9, 25.4], [20.0, 26.3], [20.7, 27.2], [21.2, 28.0], [21.8, 29.0], [22.4, 30.0], [23.6, 31.7], [24.4, 32.7], [24.9, 33.3], [25.3, 34.9], [26.4, 36.3], [27.3, 37.3]];
export const B12P: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B12);
  const X = 3700, MUJ = 3380, HOM = 3150, s = f / 30, t0 = S(24.4);
  const xT = (q: number) => X + Math.max(0, q - t0) * VCOR; // dónde está Tiza mientras corre
  const turba = [[2950, "campesina"], [2760, "granjero"], [2600, "noble"], [2440, "aguatero"], [2300, "lavandera"]] as const;
  const runA = t0 + 0.1, xRun = (q: number) => xT(q);
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} setProps={{ variante: "peste" }} mano={2} seed={121} dibujo={{}} profundidad={1}
      claves={tomas(F, D, [
        [0, Me(X, 1.6, -10), Me(X - 30, 1.75, -10, 0.5)], // lo peor que le puede pasar a un forastero
        [2.9, Me((MUJ + HOM) / 2, 2.3), Me((MUJ + HOM) / 2 + 10, 2.45, 0, -0.5)], // la gente empieza a buscar culpables
        [4.9, P(MUJ, 0.1), P(MUJ, 0.3, 0.5)], // alguien se da cuenta de algo
        [6.3, P(X, 0), P(X, 0.25, -0.5)], // el tipo raro. El que llegó hace cuatro días…
        [8.2, Me((MUJ + HOM) / 2, 2.3), Me((MUJ + HOM) / 2 - 10, 2.45, 0, 0.5)], // …con zapatillas. El que lo sabía todo antes que nadie
        [11.1, P(X, 0.1), P(X, 0.35, -0.5)], // no se enferma. ¿Y quién no se enferma en plena peste?
        [14.1, P(MUJ, 0.2), P(MUJ, 0.4, 0.5)], // Exacto. El que la trajo.
        [16.3, Me((MUJ + X) / 2 - 30, 2.0), Me((MUJ + X) / 2 - 40, 2.12, 0, -0.5)], // una mujer te señala
        [17.6, Me((HOM + MUJ) / 2 - 110, 2.1), Me((HOM + MUJ) / 2 - 100, 2.22, 0, 0.5)], // después un hombre
        [18.7, E(3150, PISO - 300, 1.0), E(3200, PISO - 310, 1.08, 0.5)], // en un minuto, media calle detrás de ti
        [21.0, Me(2720, 2.0), Me(2860, 2.2, 0, -0.5)], // con palos, con horquillas y ganas de culpar a alguien
        [24.4, P(xRun(t0), 0), P(xRun(S(25.9)), 0)], // corres. Corres como nunca
        [25.9, Me(xRun(S(25.9)) - 200, 1.6), Me(xRun(S(27.6)) - 200, 1.6)], // con el señor Bigotes debajo del brazo
      ])}
      personajes={[
        ubicado(X, [{ t: 0, accion: "cargar_caja", expr: "feliz", rotY: -20 }, { t: S(6.3), accion: "cargar_caja", expr: "feliz", mirada: "camara" }, { t: S(11.1), accion: "cargar_caja", expr: "sonrisa_picara" },
          { t: S(12.2), accion: "cargar_caja", expr: "confundido" }, { t: S(17.7), accion: "asustarse", expr: "espantado", rotY: -60 }, { t: t0, accion: "correr", expr: "espantado", rotY: 90 }] as PasoGuion[],
          (q) => ventanas(q, [[0, S(2.9)], [S(6.3), S(8.2)], [S(11.1), S(14.1)], [S(16.3), 99]]) + xT(q), { ropa: ROPA_T2 }),
        { x: MUJ, semilla: 122, ropa: ROPA.campesina, mov: (q) => ({ dx: ventanas(q, [[S(2.9), S(6.3)], [S(8.2), S(11.1)], [S(14.1), S(18.7)]]) }),
          guion: [{ t: 0, accion: "pensar", expr: "pensativo", rotY: 50 }, { t: S(4.9), accion: "idle", expr: "sorprendido", rotY: 30, mirada: [1, 0] }, { t: S(8.2), accion: "explicar", expr: "decidido", rotY: -40 },
            { t: S(14.1), accion: "idle", expr: "sonrisa_picara", mirada: "camara" }, { t: S(15.1), accion: "senalar", expr: "furioso", objetivo: [1, 0.2], rotY: 40 }] },
        { x: HOM, semilla: 123, ropa: ROPA.noble, mov: (q) => ({ dx: ventanas(q, [[S(2.9), S(4.9)], [S(8.2), S(11.1)], [S(16.3), S(18.7)]]) }),
          guion: [{ t: 0, accion: "explicar", expr: "pensativo", rotY: 50 }, { t: S(9.3), accion: "pose_brazos_cruzados", expr: "confundido", rotY: 50 }, { t: S(17.7), accion: "senalar", expr: "enojado", objetivo: [1, 0.2], rotY: 50 }] },
        ...turba.map(([x, r], i): Personaje => ({ x, semilla: 124 + i, ropa: ROPA[r], prof: (i % 2) * -0.6, mov: (q) => ({ dx: ventanas(q, [[S(18.7), 99]]) + Math.max(0, Math.min(q, runA + i * 0.15) - S(18.7)) * 55 }),
          guion: [{ t: 0, accion: "enojado_pisoton", expr: "furioso", rotY: 70 }, { t: S(21.0), accion: "senalar", expr: "furioso", objetivo: [1, 0], rotY: 70 }, { t: runA + i * 0.15, accion: "correr", expr: "furioso", rotY: 90 }] })),
      ]}
      sobre={<>
        {f < F(24.4) && ventanas(s, [[0, S(2.9)], [S(6.3), S(8.2)], [S(11.1), S(14.1)], [S(16.3), 99]]) === 0 && <GatoBrazo x={X - 4} f={f} dir={-1} />}
        {f >= F(24.4) && <GatoBrazo x={xT(s) + 20} f={f} dir={1} s={0.8} />}
        {f >= F(21.0) && f < F(24.4) && [2760, 2440].map((x) => <path key={x} d={`M${x + 70} ${PISO - 160} l40 -260 m-30 0 l0 -50 m30 50 l0 -50 m30 50 l0 -50 M${x + 80} ${PISO - 420} h60`} stroke={M_} strokeWidth={9} fill="none" strokeLinecap="round" />)}
        {f >= F(24.4) && <Sudor f={f} x={xT(s)} y={PISO - 330} desde={F(24.4)} hasta={D} s={0.8} />}
      </>}
      hud={<>
        <IconoGrande tipo="alerta" desde={F(0.5)} hasta={F(2.8)} />
        <IconoGrande tipo="bombilla" desde={F(5.4)} hasta={F(6.25)} x={1360} y={300} />
        <Dato texto={tx(L, "EL QUE LA TRAJO", "THE ONE WHO BROUGHT IT")} x={960} y={170} desde={F(15.1)} hasta={F(16.2)} tam={96} color="#ff5a3c" rot={0} />
        <Dato texto={tx(L, "¡CORRE!", "RUN!")} x={960} y={190} desde={F(24.5)} hasta={F(25.8)} tam={170} color="#ff3b2a" rot={0} />
        <IconoGrande tipo="horquilla" desde={F(21.7)} hasta={F(24.3)} x={1500} y={300} />
        <PRumor a={F(17.6)} b={F(20.9)} todos={F(20.0)} />
        <Globos F={F} L={L} lista={[
          { tipo: "lupa", desde: 3.6, hasta: 4.8, x: 1420, y: 230, cola: cab(Me((MUJ + HOM) / 2, 2.3), MUJ) },
          { tipo: "zapatilla", desde: 8.3, hasta: 9.5, x: 1420, y: 230, cola: cab(Me((MUJ + HOM) / 2, 2.3), MUJ) },
          { tipo: "reloj", desde: 9.7, hasta: 11.0, x: 600, y: 230, cola: cab(Me((MUJ + HOM) / 2, 2.3), HOM) },
          { tipo: "pregunta", desde: 12.2, hasta: 14.0, x: 1420, y: 250, cola: [1060, 340] },
          { tipo: "gato", desde: 26.2, hasta: 27.4, x: 1450, y: 230, cola: cab(Me(xRun(S(26.6)) - 200, 1.6), xRun(S(26.6))) },
        ]} />
      </>}
    />
  );
};
// ── b13 · Aldgate: el carro de heno, la lanza a un dedo y el puente ──
const PARES_B13: [number, number][] = [[0.5, 0.7], [1.0, 1.5], [1.8, 2.3], [2.5, 3.3], [3.0, 3.7], [4.1, 5.1], [5.0, 5.9], [5.6, 6.8], [5.8, 7.4], [6.6, 8.2], [6.9, 8.6],
  [7.6, 9.2], [8.1, 10.0], [8.6, 10.7], [9.1, 11.2], [9.8, 12.2], [10.3, 12.5], [11.1, 13.5], [11.2, 14.0], [12.1, 15.2], [12.9, 16.1], [13.4, 16.8], [14.1, 17.4],
  [14.7, 18.0], [15.4, 18.9], [16.1, 19.9], [16.7, 20.7], [17.3, 21.5], [18.2, 22.6], [18.7, 23.5], [19.7, 24.6], [19.9, 24.8], [20.6, 25.4], [20.9, 25.7], [21.6, 26.6],
  [22.6, 27.9], [23.8, 29.3]];
const Lanza: React.FC<{ x: number; y: number; f: number; f0: number }> = ({ x, y, f, f0 }) => {
  const t = f - f0;
  if (t < 0 || t > 42) return null;
  const ent = t < 8 ? t / 8 : t < 30 ? 1 : Math.max(0, 1 - (t - 30) / 12);
  return <g transform={`translate(${x - 300 + ent * 240},${y}) rotate(-18)`} stroke={M_} strokeWidth={5}><rect x={-420} y={-7} width={420} height={14} fill="#6a4a2a" /><path d="M0 -18 L64 0 L0 18 Z" fill="#d8d8d8" /></g>;
};
export const B13P: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B13);
  const PU = MURALLA_M.puerta, C0 = PU + 330, G = PU + 60;
  // el carro arranca a los 15,3 y sale por el puente hacia la colina
  const cx = (q: number) => C0 + Math.max(0, q - S(15.3)) * 150;
  const c = cx(f / 30), adentro = f >= F(7.6);
  return (
    <EscenaB Set={MurallaPintada} pal={PAL} mano={2} seed={131} dibujo={{}} profundidad={1}
      claves={tomas(F, D, [
        [0, Me(PU - 330, 1.15, -60), Me(PU - 250, 1.25, -60, 0.5)], // llegas a la puerta de la muralla, la de Aldgate
        [2.5, Me(C0 + 80, 2.0), Me(C0 + 90, 2.15, 0, -0.5)], // un granjero saca su carro de heno de la ciudad
        [5.6, P(PU + 40, 0.1), P(PU + 40, 0.35, 0.5)], // no lo piensas
        [6.6, Me(C0 - 60, 2.2), Me(C0 - 60, 2.35, 0, -0.5)], // saltas adentro y te tapas con el heno
        [8.6, E(C0 - 20, PISO - 230, 3.4), E(C0 - 20, PISO - 230, 3.7, 0.5)], // aguantas la respiración
        [9.6, Me(C0 - 150, 1.9), Me(C0 - 140, 2.05, 0, -0.5)], // mientras pasan los guardias
        [11.1, E(C0 - 60, PISO - 220, 3.0), E(C0 - 50, PISO - 220, 3.3, 0.5)], // uno pincha el heno con la lanza a un dedo de tu oreja
        [14.1, Me(C0 - 150, 1.9), Me(C0 - 160, 2.0, 0, 0.5)], // y sigue de largo
        [15.3, E(cx(S(15.3)) + 100, PISO - 320, 1.15), E(cx(S(19.7)) - 100, PISO - 340, 0.9)], // cruza el puente; Londres queda atrás con su humo
        [19.7, E(cx(S(19.7)) - 40, PISO - 400, 1.55), E(cx(S(22.3)) - 40, PISO - 400, 1.7)], // estás afuera. Estás vivo.
        [22.3, E(cx(S(22.3)) - 380, PISO - 360, 1.05), E(cx(S(26)) - 520, PISO - 380, 0.85)], // el carro se aleja hacia la colina
      ])}
      personajes={[
        ubicado(PU - 500, [{ t: 0, accion: "correr", expr: "espantado", rotY: 90 }, { t: S(2.5), accion: "idle", expr: "pensativo", rotY: 60 }, { t: S(5.6), accion: "idle", expr: "decidido", mirada: "camara" },
          { t: S(6.6), accion: "saltar", expr: "sorprendido", rotY: 90 }, { t: S(19.7), accion: "sentarse", expr: "feliz", mirada: "camara" }, { t: S(20.6), accion: "sentarse", expr: "carcajada", mirada: "camara" }] as PasoGuion[],
          (q) => (q < S(2.5) ? PU - 800 + (640 * q) / S(2.5) : q < S(5.6) ? 9000 : q < S(6.6) ? PU + 40 : q < S(7.6) ? PU + 40 + (C0 - 100 - PU) * (q - S(6.6)) / (S(7.6) - S(6.6)) : q < S(19.7) ? 9000 : cx(q) - 60),
          { ropa: ROPA_T2, alto: f >= F(19.7) ? 215 : adentro ? 120 : 0 }),
        ubicado(C0 + 380, [{ t: 0, accion: "idle", expr: "aburrido", rotY: 90 }, { t: S(15.3), accion: "caminar", expr: "neutral", rotY: 90 }], (q) => cx(q) + 380, { semilla: 132, ropa: { ...ROPA.granjero, manos: undefined } }),
        { x: G, semilla: 133, ropa: ROPA.guardia, 
          guion: [{ t: 0, accion: "idle", expr: "aburrido", rotY: 40 }, { t: S(9.6), accion: "caminar", expr: "enojado", rotY: 90 }, { t: S(10.8), accion: "empujar", expr: "enojado", rotY: 90 }, { t: S(14.1), accion: "caminar", expr: "aburrido", rotY: 90 }, { t: S(15.3), accion: "idle", expr: "aburrido", rotY: -30 }] },
      ]}
      sobre={<>
        <Carro x={c} f={f} heno ruedaGira={Math.max(0, f / 30 - S(15.3)) * 150 * 1.3} />
        {/* los ojos de Tiza asomando del heno mientras se esconde */}
        {f >= F(8.6) && f < F(15.3) && <g stroke={M_} strokeWidth={3}>{[-16, 16].map((d) => <ellipse key={d} cx={c - 40 + d} cy={PISO - 222} rx={11} ry={f >= F(12.1) && f < F(13.4) ? 15 : 11} fill="#fffaf0" />)}{[-16, 16].map((d) => <circle key={d} cx={c - 40 + d + (f >= F(11.1) ? -4 : 0)} cy={PISO - 220} r={5} fill={M_} />)}</g>}
        {f >= F(8.6) && f < F(15.3) && <Sudor f={f} x={c - 40} y={PISO - 250} desde={F(8.8)} hasta={F(14.0)} s={0.6} />}
        <Lanza x={c - 70} y={PISO - 214} f={f} f0={F(11.4)} />
        {f >= F(17.3) && f < F(19.7) && <Vapor f={f} x={PU - 600} y={PISO - 500} color="#8a8a86" n={4} alto={420} s={2.2} />}
      </>}
      hud={<>
        <Dato texto="ALDGATE" x={960} y={180} desde={F(1.7)} hasta={F(2.45)} tam={120} color="#fff6e6" rot={0} />
        <Dato texto={tx(L, "A UN DEDO", "ONE INCH")} x={960} y={170} desde={F(12.8)} hasta={F(14.0)} tam={130} color="#ff5a3c" rot={0} />
        <Dato texto={tx(L, "AFUERA. VIVO.", "OUT. ALIVE.")} x={960} y={170} desde={F(20.0)} hasta={F(21.5)} tam={120} color="#5fd47a" rot={0} />
        <Dato texto={tx(L, "4 DÍAS · 1348", "4 DAYS · 1348")} x={960} y={170} desde={F(21.6)} hasta={D} tam={110} color="#ffd23c" rot={0} />
        <Globos F={F} L={L} lista={[{ texto: ["¡NO RESPIRES!", "DON'T BREATHE!"], desde: 9.0, hasta: 9.55, x: 960, y: 230, cola: [1000, 420], tam: 1.15 }]} />
      </>}
    />
  );
};

// ── b14 · al atardecer en el heno: las 3 cosas, el estornudo y el gancho al barco vikingo ──
const PARES_B14: [number, number][] = [[0.8, 1.5], [1.6, 2.6], [2.4, 3.5], [3.1, 4.8], [4.4, 6.6], [5.1, 7.8], [5.8, 8.7], [6.3, 9.5], [6.9, 10.2], [7.5, 11.2], [8.4, 12.6],
  [9.3, 13.9], [9.9, 14.9], [10.4, 15.6], [11.0, 16.2], [11.8, 17.7], [12.4, 18.6], [13.0, 19.6], [13.4, 20.2], [14.6, 21.5], [15.4, 22.3], [16.3, 23.2], [16.6, 23.6],
  [18.0, 25.0], [18.8, 25.9], [19.6, 27.2], [20.1, 28.0], [21.4, 28.8], [22.4, 29.0], [23.7, 31.1], [25.1, 32.3], [26.6, 34.4], [27.2, 35.4], [28.0, 36.6], [29.7, 38.5],
  [30.6, 39.3], [31.1, 40.0], [32.0, 41.0], [32.9, 42.5]];
export const B14P: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B14);
  const C = MURALLA_M.colina + 300, GR = C + 380, s = f / 30;
  const cx = C + s * 60; // el carro anda despacio por el campo
  const mueve = s * 60;
  return (
    <EscenaB Set={MurallaPintada} pal={PAL} setProps={{ hora: 1 }} momento="amanecer" mano={2} seed={141} dibujo={{}} profundidad={1}
      claves={tomas(F, D, [
        [0, E(C + 150, PISO - 380, 0.85), E(C + 250, PISO - 380, 0.92, 0.5)], // entonces, ¿cuánto duraste? cuatro días
        [3.0, E(C - 30 + S(3.0) * 60, PISO - 400, 2.5), E(C - 30 + S(9.0) * 60, PISO - 400, 2.7, -0.5)], // sobreviviste gracias a tres cosas
        [9.1, E(C + S(9.1) * 60, PISO - 700, 0.9), E(C + S(14.2) * 60, PISO - 560, 1.05)], // te acuestas en el heno y miras el cielo naranja
        [14.3, Me(GR + S(14.3) * 60 - 150, 2.1, -100), Me(GR + S(17.7) * 60 - 150, 2.25, -100, 0.5)], // el granjero estornuda
        [17.7, E(GR + S(17.7) * 60, PISO - 290, 3.0), E(GR + S(21.1) * 60, PISO - 290, 3.3, -0.5)], // una vez, dos veces, y se da vuelta a mirarte
        [21.2, E(C - 30 + S(21.2) * 60, PISO - 400, 3.0), E(C - 30 + S(23.4) * 60, PISO - 400, 3.4)], // la próxima vez que abras los ojos…
        [23.5, E(C + S(23.5) * 60, PISO - 450, 1.6), E(C + S(27.9) * 60, PISO - 470, 1.75, 0.5)], // …un barco vikingo, año 900, 40 hombres enormes
        [28.0, E(C - 30 + S(28.0) * 60, PISO - 400, 2.6), E(C - 30 + S(34) * 60, PISO - 400, 2.8, -0.5)], // suscríbete · ¿tú cuánto habrías durado?
      ])}
      personajes={[
        { x: C - 30, semilla: 7, ropa: ROPA_T2, alto: 120, mov: () => ({ dx: mueve }),
          guion: [{ t: 0, accion: "sentarse", expr: "feliz" }, { t: S(3.1), accion: "explicar", expr: "decidido", mirada: "camara" }, { t: S(9.1), accion: "sentarse", expr: "feliz", mirada: [0, -1] },
            { t: S(13.0), accion: "sentarse", expr: "enamorado", mirada: [0, -1] }, { t: S(19.6), accion: "sentarse", expr: "sorprendido", rotY: 40 }, { t: S(21.2), accion: "asustarse", expr: "espantado" },
            { t: S(28.0), accion: "saludar", expr: "feliz", mirada: "camara" }, { t: S(30.4), accion: "senalar", expr: "sonrisa_picara", objetivo: [0, 0.3], mirada: "camara" }] as PasoGuion[] },
        ubicado(GR, [{ t: 0, accion: "caminar", expr: "neutral", rotY: 90 }, { t: S(16.5), accion: "asustarse", expr: "asqueado", rotY: 90 }, { t: S(18.6), accion: "asustarse", expr: "asqueado", rotY: 90 },
            { t: S(19.5), accion: "idle", expr: "sonrisa_picara", rotY: -70 }, { t: S(21.0), accion: "caminar", expr: "sonrisa_picara", rotY: 90 }] as PasoGuion[], (q) => GR + q * 60, { semilla: 132, ropa: { ...ROPA.granjero, manos: undefined } }),
      ]}
      sobre={<>
        <Carro x={cx} f={f} heno ruedaGira={s * 60 * 1.3} />
        <g stroke={M_} strokeWidth={4}><Gato x={cx + 70} y={PISO - 214} f={f} s={0.7} /></g>
        {f >= F(16.6) && f < F(17.3) && <Vapor f={f} x={GR + mueve + 40} y={PISO - 300} color="#c8e870" n={3} alto={90} />}
        {f >= F(18.6) && f < F(19.3) && <Vapor f={f} x={GR + mueve + 40} y={PISO - 300} color="#c8e870" n={4} alto={120} />}
      </>}
      hud={<>
        <Dato texto={tx(L, "4 DÍAS", "4 DAYS")} x={960} y={200} desde={F(1.6)} hasta={F(2.95)} tam={170} color="#ffd23c" rot={0} />
        <IconoGrande tipo="gota_no" desde={F(5.0)} hasta={F(6.1)} />
        <IconoGrande tipo="cama" desde={F(6.2)} hasta={F(7.3)} />
        <IconoGrande tipo="gato" desde={F(7.4)} hasta={F(9.0)} />
        <IconoGrande tipo="corazon" desde={F(13.0)} hasta={F(14.2)} x={960} y={250} />
        <Dato texto={tx(L, "¡ACHÍS!", "ACHOO!")} x={1300} y={240} desde={F(16.6)} hasta={F(17.6)} tam={150} color="#8fd04a" rot={0} />
        <Dato texto={tx(L, "¡ACHÍS!", "ACHOO!")} x={1350} y={240} desde={F(18.6)} hasta={F(19.5)} tam={180} color="#8fd04a" rot={0} />
        <PCuaderno a={F(21.2)} b={F(27.9)} hoja={F(23.6)} sello={F(25.0)} cuarenta={F(26.6)} tx={{ londres: tx(L, "LONDRES 1348", "LONDON 1348"), dias: tx(L, "4 DÍAS", "4 DAYS"), anio: tx(L, "AÑO 900", "YEAR 900") }} />
        <Dato texto={tx(L, "SUSCRÍBETE", "SUBSCRIBE")} x={960} y={170} desde={F(28.0)} hasta={F(30.3)} tam={130} color="#fff6e6" rot={0} />
        <Globos F={F} L={L} lista={[
          { texto: ["¿Y TÚ?", "AND YOU?"], desde: 30.6, hasta: 34, x: 1400, y: 260, cola: [1080, 360], tam: 0.9 },
        ]} />
      </>}
    />
  );
};
