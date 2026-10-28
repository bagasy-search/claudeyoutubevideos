// Bloques 7–10 al nivel del piloto. Pedido del creador (28-oct): «ir cambiando los fondos, uno por problema» → cada
// bloque tiene su lugar y su luz, y en el 8 (avisar) cada frase pasa en un sitio distinto (panadería, taberna, puerto,
// mercado, lluvia). Tiempos en s ES; `reloj` los lleva a la EN.
import React from "react";
import { Easing, interpolate } from "remotion";
import { useF } from "../../anikit/camara";
import { PasoGuion } from "../../stickman3d/acciones";
import { Ropa } from "../../stickman3d/vestuario";
import { Personaje } from "../capa3d";
import { ROPA } from "../elenco";
import { Dato, EscenaB } from "../escena";
import { IconoGrande } from "../iconos";
import { CallePintada, MurallaPintada, PuertoPintado, TabernaPintada } from "../sets/pintado";
import { Gato, PAL_LONDRES as PAL, PISO, puntoSoga, Rata } from "../sets/londres";
import { B, cab, cl, E, Estrellas, Globos, M_, Me, P, Pi, reloj, Repollo, ROPA_T1, ROPA_T2, Sudor, tomas, ubicado, Vapor, ventanas } from "./kit";

const tx = (L: string, es: string, en: string) => (L === "es" ? es : en);
const SIN_GORRO: Ropa = { ...ROPA_T1, sombrero: undefined };

// una rata que baja por la soga del barco (de la borda al bolardo), mirando hacia donde va
const RataSoga: React.FC<{ f: number; u: number; s?: number }> = ({ f, u, s = 1 }) => {
  if (u < 0 || u > 1) return null;
  const p = puntoSoga(u, f);
  return <g transform={`translate(${p.x},${p.y - 4}) scale(-1,1) rotate(${-p.ang})`}><Rata x={0} y={0} f={f} s={s} fase={u * 9} /></g>;
};
// los bultos negros del cuello (bubones)
const Bultos: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g stroke={M_} strokeWidth={3}>{[[-10, 22, 10], [8, 26, 12]].map(([dx, dy, r], i) => {
    const k = 1 + 0.05 * Math.sin(f * 0.1 + i);
    return <g key={i}><ellipse cx={x + dx} cy={y + dy} rx={r * 1.3 * k} ry={r * k} fill="#8a3a52" /><ellipse cx={x + dx - r * 0.35} cy={y + dy - r * 0.3} rx={r * 0.35} ry={r * 0.22} fill="#d88aa0" stroke="none" /></g>;
  })}</g>
);

// ── b07 · el puerto: el barco de Francia, marineros enfermos y una fila de ratas por la soga ──
const PARES_B07: [number, number][] = [[1.1, 1.3], [1.9, 2.9], [2.6, 3.7], [3.3, 5.2], [3.8, 6.0], [4.5, 7.3], [5.8, 9.1], [6.6, 10.0], [7.2, 10.8], [7.5, 11.4], [8.2, 12.0],
  [8.8, 13.1], [9.8, 14.4], [10.8, 15.1], [11.4, 15.5], [11.8, 16.5], [12.8, 17.3], [13.2, 17.6], [13.9, 18.6], [14.3, 19.0], [15.1, 20.3], [15.7, 21.1], [16.3, 22.1],
  [17.4, 23.0], [18.3, 24.2], [18.9, 25.4], [19.7, 26.0], [20.9, 28.7], [21.5, 29.6], [22.6, 31.1], [23.4, 32.3], [24.5, 33.1]];
export const B07P: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B07);
  const X = 1150, M1 = 2050, M2 = 2260, ES1 = 1520, ES2 = 1740; // Tiza · los dos marineros · los estibadores
  const MARINO: Ropa = { ...ROPA.pescadero, manos: undefined, pelo: { color: "#3a2a20", estilo: "corto" } };
  const marinos = Me((M1 + M2) / 2, 2.3);
  // las ratas: salen de la borda de a una cada 0,9 s y tardan 3 s en bajar
  const ratas = (t0: number) => Array.from({ length: 7 }).map((_, i) => <RataSoga key={i} f={f} u={1 - (f - F(t0) - i * 27) / 90} s={1.15} />);
  return (
    <EscenaB Set={PuertoPintado} pal={PAL} mano={2} seed={71} dibujo={{}} profundidad={1}
      claves={tomas(F, D, [
        [0, Me(1000, 1.7), Me(1120, 1.85)], // Día 2: vas al puerto a buscar trabajo
        [2.6, P(X, 0), P(X, 0.3, -0.5)], // algo que te congela la sangre
        [4.5, E(2700, PISO - 470, 0.95), E(2750, PISO - 450, 1.05, 0.5)], // un barco que llega de Francia
        [6.6, marinos, Me((M1 + M2) / 2 + 10, 2.5, 0, -0.5)], // los marineros bajan pálidos, sudando
        [8.8, P(M2, 0.2), P(M2, 0.5, 0.5)], // bultos negros en el cuello
        [11.4, E(2560, PISO - 260, 1.55), E(2520, PISO - 230, 1.7, -0.5)], // por las cuerdas del barco…
        [13.9, E(2330, PISO - 110, 3.0), E(2310, PISO - 100, 3.3, 0.5)], // …una fila de ratas
        [16.3, Me((ES1 + ES2) / 2, 2.3), Me((ES1 + ES2) / 2 + 10, 2.45, 0, 0.5)], // la gente del puerto no se preocupa: es martes
        [19.7, P(X, 0.1), P(X, 0.35, -0.5)], // pero tú sabes lo que acabas de ver
        [21.5, Pi(X + 120, 3.4), Pi(X + 100, 3.7)], // acaba de entrar la muerte a Londres
        [23.4, E(2450, PISO - 250, 1.35), E(2430, PISO - 240, 1.5, -0.5)], // caminando por una cuerda
      ])}
      personajes={[
        ubicado(820, [{ t: 0, accion: "caminar", rotY: 90, expr: "feliz" }, { t: S(2.3), accion: "idle", rotY: 40, expr: "neutral", mirada: [1, 0.3] },
          { t: S(2.6), accion: "asustarse", expr: "espantado", rotY: 20 }, { t: S(3.5), accion: "pose_temblando", expr: "asustado", rotY: 20 },
          { t: S(19.7), accion: "idle", expr: "decidido", mirada: "camara" }, { t: S(21.5), accion: "idle", expr: "asustado", mirada: [0, -1] }] as PasoGuion[],
          (s) => ventanas(s, [[0, S(4.5)], [S(19.7), 99]]) + interpolate(s, [0, S(2.3)], [820, X], { ...cl, easing: Easing.out(Easing.quad) }), { ropa: ROPA_T1 }),
        { x: M1, semilla: 72, ropa: MARINO, mov: (s) => ({ dx: ventanas(s, [[S(4.5), S(8.8)]]) }), guion: [{ t: 0, accion: "pose_temblando", expr: "triste", rotY: 25 }] },
        { x: M2, semilla: 73, ropa: { ...MARINO, pelo: { color: "#a85a2a", estilo: "corto" }, tunica: { color: "#7a6a5a", largo: 0.45 } }, mov: (s) => ({ dx: ventanas(s, [[S(4.5), S(11.4)]]) }),
          guion: [{ t: 0, accion: "idle", expr: "llorando", rotY: -20 }, { t: S(8.8), accion: "idle", expr: "dormido", rotY: -10 }] },
        { x: ES1, semilla: 74, ropa: ROPA.aguatero, mov: (s) => ({ dx: ventanas(s, [[S(16.3), S(19.7)]]) }), guion: [{ t: 0, accion: "reir", expr: "carcajada", rotY: 30 }] },
        { x: ES2, semilla: 75, ropa: ROPA.granjero, mov: (s) => ({ dx: ventanas(s, [[S(16.3), S(19.7)]]) }), guion: [{ t: 0, accion: "pose_brazos_cruzados", expr: "aburrido", rotY: -30 }] },
      ]}
      sobre={<>
        {f >= F(6.6) && f < F(11.4) && <><Sudor f={f} x={M1} y={PISO - 330} desde={F(6.6)} hasta={F(8.8)} s={0.75} /><Sudor f={f} x={M2} y={PISO - 330} desde={F(6.6)} hasta={F(11.4)} s={0.75} /></>}
        {f >= F(8.8) && f < F(11.4) && <Bultos x={M2 + 30} y={PISO - 262} f={f} />}
        {f >= F(11.4) && f < F(16.3) && ratas(11.6)}
        {f >= F(21.5) && f < F(23.4) && <g stroke={M_} strokeWidth={4} transform={`translate(${interpolate(f, [F(21.5), F(23.4)], [X + 420, X - 260])},0) scale(-1,1) translate(${-2 * 0},0)`}><Rata x={0} y={PISO - 4} f={f} s={1.5} /></g>}
        {f >= F(23.4) && ratas(22.6)}
      </>}
      hud={<>
        <IconoGrande tipo="alerta" desde={F(2.7)} hasta={F(4.4)} />
        <Dato texto={tx(L, "DESDE FRANCIA", "FROM FRANCE")} x={960} y={190} desde={F(5.6)} hasta={F(6.5)} tam={110} color="#ffd23c" rot={0} />
        <IconoGrande tipo="calavera" desde={F(9.8)} hasta={F(11.3)} />
        <IconoGrande tipo="calavera" desde={F(22.2)} hasta={F(23.35)} x={960} y={330} />
        <Globos F={F} L={L} lista={[
          { tipo: "barco", desde: 0.6, hasta: 2.5, x: 1450, y: 250, cola: cab(Me(1060, 1.75), 1000) },
          { texto: ["ES MARTES", "IT'S TUESDAY"], desde: 18.3, hasta: 19.6, x: 1250, y: 230, cola: cab(Me((ES1 + ES2) / 2, 2.3), ES2), tam: 0.85 },
        ]} />
      </>}
    />
  );
};

// ── b08 · avisar: panadería → taberna → puerto → mercado (se ríen, repollo) → el cura → sólo bajo la lluvia ──
const PARES_B08: [number, number][] = [[0.9, 1.1], [1.8, 2.7], [2.1, 3.2], [3.3, 4.8], [3.8, 5.2], [4.2, 5.7], [4.8, 6.5], [5.3, 7.0], [5.9, 7.9], [6.3, 8.4], [6.8, 9.1],
  [7.3, 9.4], [8.0, 10.2], [8.4, 11.1], [9.1, 11.8], [9.2, 12.2], [9.8, 13.0], [10.3, 13.8], [11.1, 14.2], [11.5, 14.7], [12.3, 15.7], [12.9, 16.4], [13.2, 17.0],
  [13.5, 17.5], [14.4, 18.8], [14.6, 19.1], [15.0, 19.5], [15.5, 20.2], [16.0, 20.8], [16.5, 21.4], [17.1, 21.8], [17.7, 23.0], [18.8, 24.8], [19.8, 25.8], [21.3, 27.4],
  [22.0, 28.4], [22.3, 28.7], [22.8, 29.4], [24.0, 31.1]];
export const B08P: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B08);
  // cada lugar con su Tiza (misma persona, otro sitio)
  const MER = 1250, PANX = 2250, TABX = 800, PUX = 1250, CURA = 1150; // el cura predica en la puerta de la muralla
  const tiza = (x: number, g: PasoGuion[], extra: Partial<Personaje> = {}): Personaje => ({ x, semilla: 7, ropa: ROPA_T1, guion: g, ...extra });
  const tomasB08 = tomas(F, D, [
    [0, P(MER, 0.1), P(MER, 0.3, 0.5)], // haces lo que haría cualquiera: avisar
    [2.8, Me(PANX + 100, 2.3), Me(PANX + 110, 2.5, 0, -0.5)], // al panadero: mata las ratas
    [4.8, Me(TABX + 20, 2.3), Me(TABX + 30, 2.5, 0, 0.5)], // a la tabernera: hierve el agua
    [6.8, Me(PUX + 120, 1.9), Me(PUX + 140, 2.05, 0, -0.5)], // a todo el mundo: aléjense del puerto
    [9.1, P(MER, 0.2), P(MER, 0.35, 0.5)], // ¿y qué pasa?
    [9.8, Me(MER + 160, 2.0), Me(MER + 170, 2.15, 0, -0.5)], // se ríen de ti
    [11.1, P(MER + 380, -0.1), P(MER + 380, 0.15, 0.5)], // ¿eres brujo?
    [12.9, P(MER, 0.1), P(MER, 0.25, -0.6)], // otro te tira un repollo
    [14.4, P(CURA, -0.1), P(CURA, 0.2, 0.5)], // un cura: es un castigo del cielo
    [17.1, Me(CURA - 150, 2.3), Me(CURA - 140, 2.45, 0, -0.5)], // los que la temen, algo malo hicieron
    [19.8, P(MER, 0.1), P(MER, 0.3, 0.5)], // lección número uno
    [22.0, Me(MER, 1.5, -20), Me(MER, 2.4, -20, -0.5)], // saber el futuro no sirve si nadie te cree
  ]);
  const comun = { mano: 2, dibujo: {}, profundidad: 1, claves: tomasB08 } as const;
  const hud = <>
    <IconoGrande tipo="alerta" desde={F(1.9)} hasta={F(2.75)} />
    <IconoGrande tipo="rayo" desde={F(15.5)} hasta={F(17.0)} />
    <Dato texto={tx(L, "LECCIÓN Nº 1", "LESSON #1")} x={960} y={170} desde={F(19.9)} hasta={D} tam={120} color="#fff6e6" rot={0} />
    <Globos F={F} L={L} lista={[
      { tipo: "rata", desde: 3.4, hasta: 4.7, x: cab(Me(PANX + 100, 2.3), PANX)[0] - 260, y: 200, cola: cab(Me(PANX + 100, 2.3), PANX) },
      { tipo: "gota", desde: 5.4, hasta: 6.7, x: cab(Me(TABX + 20, 2.3), TABX + 200)[0] + 150, y: 200, cola: cab(Me(TABX + 20, 2.3), TABX + 200) },
      { tipo: "barco", desde: 7.4, hasta: 9.0, x: 1500, y: 220, cola: cab(Me(PUX + 120, 1.9), PUX) },
      { texto: ["¿BRUJO?", "WITCH?"], desde: 11.5, hasta: 12.8, x: 1420, y: 250, cola: [1060, 340], tam: 0.95 },
      { tipo: "calavera", desde: 17.6, hasta: 19.7, x: 760, y: 220, cola: cab(Me(CURA - 150, 2.3), CURA) },
    ]} />
  </>;
  const s = f / 30;
  // el repollo: sale de la izquierda en arco y le pega en la cabeza (12.9 → 13.4), rebota y cae
  const t0 = F(13.0), ti = f - t0;
  const repollo = ti >= 0 && ti < 40 ? (ti < 12 ? { x: MER - 520 + ti * 43, y: PISO - 420 - Math.sin((ti / 12) * Math.PI) * 120, r: ti * 30 } : { x: MER - 4 + (ti - 12) * 9, y: PISO - 340 + (ti - 12) ** 2 * 0.9 - (ti - 12) * 6, r: ti * 18 }) : null;
  if (f < F(2.8) || (f >= F(9.1) && f < F(14.4)) || f >= F(19.8)) {
    const lluvia = f >= F(19.8);
    const risa = f >= F(9.1) && f < F(14.4);
    return (
      <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} seed={81} momento={lluvia ? "lluvia" : undefined} {...comun}
        personajes={[
          tiza(MER, [{ t: 0, accion: "pensar", expr: "pensativo" }, { t: S(1.8), accion: "senalar", expr: "decidido", objetivo: [0.3, 1], mirada: "camara" },
            { t: S(9.1), accion: "idle", expr: "feliz", mirada: [0.8, 0] }, { t: S(9.8), accion: "idle", expr: "confundido", rotY: 30, mirada: [0.8, 0] },
            { t: S(12.9), accion: "idle", expr: "neutral", rotY: 20 }, { t: S(13.3), accion: "asustarse", expr: "espantado", rotY: 20 },
            { t: S(19.8), accion: "llorar", expr: "llorando" }, { t: S(22.0), accion: "idle", expr: "triste", mirada: [0, -1] }]),
          ...(risa ? [
            { x: MER + 330, semilla: 82, ropa: ROPA.noble, guion: [{ t: 0, accion: "reir", expr: "carcajada", rotY: -40 }, { t: S(11.1), accion: "senalar", expr: "sonrisa_picara", rotY: -10, objetivo: [-1, 0] as [number, number] }], mov: () => ({ dx: s >= S(12.9) ? 9000 : 0 }) },
            { x: MER + 560, semilla: 83, ropa: ROPA.lavandera, guion: [{ t: 0, accion: "reir", expr: "carcajada", rotY: -50 }], mov: () => ({ dx: s >= S(11.1) ? 9000 : 0 }) },
          ] as Personaje[] : []),
        ]}
        sobre={<>{repollo && <Repollo x={repollo.x} y={repollo.y} r={repollo.r} s={1.1} />}<Estrellas f={f} f0={F(13.4)} x={MER} y={PISO - 400} dur={40} /></>}
        hud={hud}
      />
    );
  }
  if (f >= F(14.4) && f < F(19.8)) return (
    <EscenaB Set={MurallaPintada} pal={PAL} zTras={0.6} momento="amanecer" seed={85} {...comun}
      personajes={[
        { x: CURA, semilla: 87, ropa: { ...ROPA.monje, manos: { i: "libro" } }, guion: [{ t: 0, accion: "explicar", expr: "enojado", mirada: "camara" }, { t: S(15.5), accion: "senalar", expr: "furioso", objetivo: [0, -1] }, { t: S(17.1), accion: "explicar", expr: "decidido", rotY: -40 }] },
        { x: CURA - 290, semilla: 88, ropa: ROPA.anciana, mov: (q) => ({ dx: ventanas(q, [[S(17.1), 99]]) }), guion: [{ t: 0, accion: "idle", expr: "asustado", rotY: 50 }] },
        { x: CURA - 460, semilla: 89, ropa: ROPA.campesina, mov: (q) => ({ dx: ventanas(q, [[S(17.1), 99]]) }), guion: [{ t: 0, accion: "pose_temblando", expr: "nervioso", rotY: 50 }] },
      ]}
      hud={hud} />
  );
  if (f < F(4.8)) return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} seed={82} {...comun}
      personajes={[tiza(PANX + 230, [{ t: 0, accion: "explicar", expr: "hablando", rotY: -50 }]), { x: PANX, semilla: 31, ropa: ROPA.panadero, guion: [{ t: 0, accion: "pose_manos_cadera", expr: "confundido", rotY: 45 }, { t: S(4.0), accion: "reir", expr: "risa_apretada", rotY: 40 }] }]}
      sobre={<Vapor f={f} x={2130} y={PISO - 330} n={4} alto={260} s={1.3} />} hud={hud} />
  );
  if (f < F(6.8)) return (
    <EscenaB Set={TabernaPintada} pal={PAL} interior seed={83} {...comun}
      personajes={[tiza(TABX + 200, [{ t: 0, accion: "explicar", expr: "decidido", rotY: -50 }]), { x: TABX - 160, semilla: 53, ropa: ROPA.tabernera, guion: [{ t: 0, accion: "idle", expr: "aburrido", rotY: 40 }, { t: S(6.0), accion: "pose_brazos_cruzados", expr: "aburrido", rotY: 40 }] }]}
      hud={hud} />
  );
  return (
    <EscenaB Set={PuertoPintado} pal={PAL} seed={84} {...comun}
      personajes={[tiza(PUX, [{ t: 0, accion: "saludar_dos_manos", expr: "asustado", rotY: 20 }, { t: S(8.0), accion: "senalar", expr: "decidido", objetivo: [1, 0.2], rotY: 30 }]),
        { x: PUX + 300, semilla: 85, ropa: ROPA.aguatero, guion: [{ t: 0, accion: "pose_brazos_cruzados", expr: "aburrido", rotY: -40 }] },
        { x: PUX + 520, semilla: 86, ropa: ROPA.pescadero, guion: [{ t: 0, accion: "idle", expr: "confundido", rotY: -50 }] }]}
      hud={hud} />
  );
};

// ── b09 · la peste: casas marcadas con cruces, remedios absurdos (bajo la lluvia) ──
const PARES_B09: [number, number][] = [[1.1, 1.5], [1.8, 2.5], [2.6, 3.6], [3.3, 4.4], [3.9, 5.2], [4.3, 5.5], [5.1, 6.5], [6.4, 8.3], [7.4, 9.6], [8.4, 10.3], [9.0, 11.3],
  [9.9, 12.3], [10.6, 13.8], [11.5, 15.0], [12.0, 15.5], [12.6, 16.6], [13.6, 17.8], [14.3, 18.9], [15.1, 19.7], [15.9, 20.4], [16.9, 21.9], [17.6, 22.7], [18.5, 23.8],
  [18.9, 24.4], [19.8, 25.5], [20.3, 25.9], [21.2, 27.3], [22.5, 29.8], [23.2, 30.6], [24.9, 32.1], [25.5, 33.2], [26.6, 34.9], [27.0, 35.5], [27.7, 36.5], [28.6, 36.9], [29.9, 39.8]];
const Flor: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} stroke={M_} strokeWidth={3}>
    <path d="M0 0 L-6 40" strokeWidth={5} stroke="#3c7a3a" />
    {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 14} cy={Math.sin((a * Math.PI) / 180) * 14} r={11} fill="#ff8fb8" />)}<circle r={9} fill="#ffd23c" />
  </g>
);
export const B09P: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B09);
  const X = 3300, FL = 2950, BAR = 3650, PAC = 3830, CLO = 4250, PUERTA = 1405, MED = 2300;
  const BARBERO: Ropa = { tunica: { color: "#a8302a", largo: 0.55, cinto: "#2a1a14" }, delantal: "#f4efe4", calzas: "#3a2a20", pelo: { color: "#2a2020", estilo: "corto" }, barba: "#2a2020", calzado: { tipo: "botas" } };
  const corre = (x0: number, d: number, sem: number, r: Ropa): Personaje => ubicado(x0, [{ t: 0, accion: "correr", rotY: d * 90, expr: "espantado" }], (s) => ventanas(s, [[S(7.0), S(9.9)]]) + x0 + d * (s - S(7.0)) * 232, { ropa: r, semilla: sem });
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} momento="lluvia" setProps={{ variante: "peste" }} mano={2} seed={91} dibujo={{}} profundidad={1}
      claves={tomas(F, D, [
        [0, Me(X, 1.1, -40), Me(X + 30, 1.25, -40, 0.5)], // Día 3. Y empieza.
        [1.8, E(1150, PISO - 420, 1.05), E(1190, PISO - 430, 1.15, -0.5)], // primero dos casas, después diez
        [5.1, E(PUERTA, PISO - 230, 2.6), E(PUERTA, PISO - 250, 2.9, 0.5)], // en las puertas aparecen cruces
        [7.0, Me(2600, 1.6), Me(2620, 1.75, 0, -0.5)], // la ciudad entera se vuelve loca
        [9.9, P(FL, -0.05), P(FL, 0.2, 0.5)], // flores pegadas a la nariz
        [12.0, P(X, 0.1), P(X, 0.3, -0.5)], // creen que viene del mal olor
        [14.3, Me((BAR + PAC) / 2, 2.4), Me((BAR + PAC) / 2 + 10, 2.6, 0, 0.5)], // el barbero les corta el brazo
        [15.9, E(PAC - 40, PISO - 260, 3.4), E(PAC - 30, PISO - 260, 3.7, -0.5)], // la sangría, de cerca
        [17.6, P(X, 0), P(X, 0.25, -0.5)], // y otros, te lo juro…
        [18.8, Me(CLO, 2.3, 60), Me(CLO + 10, 2.45, 60, 0.5)], // se sientan al lado de la cloaca
        [21.2, P(X, 0.2), P(X, 0.4, -0.5)], // un olor horrible espanta a otro
        [23.2, Me(MED, 2.2), Me(MED + 10, 2.4, 0, 0.5)], // todavía no existen los médicos pájaro
        [26.6, P(X, 0.2), P(X, 0.4, -0.5)], // eso es 300 años después
        [28.6, Me(X, 1.4, -30), Me(X, 1.55, -30, 0.5)], // aquí nadie sabe qué hacer
      ])}
      personajes={[
        { x: X, semilla: 7, ropa: ROPA_T1, mov: (s) => ({ dx: ventanas(s, [[0, S(1.8)], [S(12.0), S(14.3)], [S(17.6), S(18.8)], [S(21.2), S(23.2)], [S(26.6), 99]]) }),
          guion: [{ t: 0, accion: "idle", expr: "asustado", mirada: [-0.8, 0] }, { t: S(12.0), accion: "pensar", expr: "confundido" }, { t: S(17.6), accion: "explicar", expr: "sorprendido", mirada: "camara" },
            { t: S(21.2), accion: "facepalm", expr: "asqueado" }, { t: S(23.2), accion: "explicar", expr: "neutral", mirada: "camara" }, { t: S(26.6), accion: "encogerse_de_hombros", expr: "sonrisa_picara" },
            { t: S(28.6), accion: "idle", expr: "triste", mirada: [0, -0.6] }] },
        { x: MED, semilla: 99, ropa: ROPA.medico, mov: (s) => ({ dx: ventanas(s, [[S(23.2), S(26.6)]]) }), guion: [{ t: 0, accion: "pose_brazos_cruzados", expr: "neutral", rotY: 20 }] },
        corre(2100, 1, 92, ROPA.campesina), corre(3100, -1, 93, ROPA.noble), corre(2400, 1, 94, ROPA.anciana),
        { x: FL, semilla: 95, ropa: { ...ROPA.lavandera, manos: undefined }, mov: (s) => ({ dx: ventanas(s, [[S(9.9), S(12.0)]]) }), guion: [{ t: 0, accion: "idle", expr: "nervioso", mirada: [0.5, 0] }, { t: S(11.0), accion: "idle", expr: "decidido", mirada: "camara" }] },
        { x: BAR, semilla: 96, ropa: BARBERO, mov: (s) => ({ dx: ventanas(s, [[S(14.3), S(17.6)]]) }), guion: [{ t: 0, accion: "explicar", expr: "sonrisa_picara", rotY: 50 }] },
        { x: PAC, semilla: 97, ropa: ROPA.pregonero, mov: (s) => ({ dx: ventanas(s, [[S(14.3), S(17.6)]]) }), guion: [{ t: 0, accion: "pose_temblando", expr: "llorando", rotY: -40 }] },
        { x: CLO, semilla: 98, ropa: ROPA.granjero, mov: (s) => ({ dx: ventanas(s, [[S(18.8), S(21.2)]]) }), guion: [{ t: 0, accion: "sentarse", expr: "feliz", rotY: 20 }, { t: S(20.3), accion: "sentarse", expr: "decidido", rotY: 20 }] },
      ]}
      sobre={<>
        {f >= F(9.9) && f < F(12.0) && <Flor x={FL + 16} y={PISO - 312} s={1.05} />}
        {f >= F(14.3) && f < F(17.6) && <path d={`M${PAC - 60} ${PISO - 190} q-10 ${30 + (f % 30)} -4 ${60 + (f % 30) * 2}`} stroke="#c8202a" strokeWidth={9} fill="none" strokeLinecap="round" />}
        {f >= F(18.8) && f < F(21.2) && <><Vapor f={f} x={CLO + 140} y={PISO - 40} color="#9ac85a" n={3} alto={240} s={1.2} /><Vapor f={f} x={CLO - 40} y={PISO - 300} color="#b8a070" n={2} alto={160} /></>}
        {f >= F(18.8) && f < F(21.2) && <ellipse cx={CLO + 140} cy={PISO + 6} rx={120} ry={20} fill="#5a6a2a" stroke={M_} strokeWidth={5} />}
      </>}
      hud={<>
        <Dato texto="2" x={760} y={300} desde={F(2.4)} hasta={F(4.2)} tam={170} color="#ff5a3c" rot={0} />
        <Dato texto="10" x={1160} y={300} desde={F(4.3)} hasta={F(5.05)} tam={190} color="#ff5a3c" rot={0} />
        <IconoGrande tipo="olor" desde={F(12.1)} hasta={F(14.2)} />
        <IconoGrande tipo="mascara_no" desde={F(24.9)} hasta={F(26.5)} x={1380} y={300} />
        <Globos F={F} L={L} lista={[
          { tipo: "flor", desde: 10.7, hasta: 11.9, x: 1400, y: 250, cola: [1050, 340] },
          { tipo: "sangre", desde: 15.9, hasta: 17.5, x: 1450, y: 220, cola: cab(Me((BAR + PAC) / 2, 2.4), PAC) },
          { tipo: "olor", desde: 21.9, hasta: 23.1, x: 1450, y: 240, cola: [1060, 340] },
          { texto: ["+300 AÑOS", "+300 YEARS"], desde: 26.9, hasta: 28.5, x: 1400, y: 250, cola: [1060, 340], tam: 0.85 },
        ]} />
      </>}
    />
  );
};

// ── b10 · lo que él sí sabe: agua hervida, trapo, capa al sol (el pozo al amanecer) → el gato (la posada de noche) ──
const PARES_B10: [number, number][] = [[0.9, 1.4], [1.6, 2.7], [2.0, 3.3], [2.6, 3.9], [3.1, 4.5], [3.7, 5.9], [4.0, 6.2], [4.4, 6.5], [5.0, 7.5], [5.7, 8.9], [6.1, 9.5],
  [6.9, 10.5], [7.6, 11.8], [7.9, 12.4], [8.4, 13.1], [8.8, 13.8], [9.4, 15.0], [10.0, 15.9], [10.6, 16.5], [11.1, 17.7], [11.6, 18.3], [12.1, 19.0], [12.4, 19.8], [13.3, 19.9],
  [13.9, 20.3], [14.9, 21.9], [15.5, 23.0], [16.1, 24.0], [16.8, 24.7], [17.7, 25.8], [18.4, 26.8], [19.0, 27.8], [19.9, 29.1], [20.3, 29.6], [20.7, 30.5], [21.8, 31.6], [22.4, 32.3]];
// el señor Bigotes: el gato de la calle, flaco y con cicatrices
const Bigotes: React.FC<{ x: number; y: number; f: number; s?: number; dir?: 1 | -1 }> = ({ x, y, f, s = 1, dir = 1 }) => (
  <g stroke={M_} strokeWidth={4} strokeLinejoin="round">
    <Gato x={x} y={y} f={f} s={s} dir={dir} />
    <g transform={`translate(${x},${y}) scale(${dir * s},${s})`} stroke="#7a2a1a" strokeWidth={2.5} fill="none"><path d="M24 -62 l10 14 M-6 -36 l12 -6 M-16 -30 l10 -8" /></g>
  </g>
);
const Trapo: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y}) scale(0.62)`} stroke={M_} strokeWidth={4} strokeLinejoin="round">
    <path d="M-62 -10 Q0 -22 62 -10 L56 34 Q0 48 -56 34 Z" fill="#f4efe4" />
    <path d="M-40 4 Q0 -4 40 4 M-36 20 Q0 12 36 20" stroke="#c8beac" strokeWidth={3} fill="none" />
    <path d="M62 -10 l26 -8 M62 -4 l24 10" strokeWidth={6} />
  </g>
);
export const B10P: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B10);
  const X = 2480, VIEJA = 2160, NIN = 2250;
  const ropa = f < F(7.6) ? ROPA_T1 : f < F(11.8) ? { ...SIN_GORRO, capa: undefined } : { calzado: ROPA_T1.calzado };
  const conTrapo = f >= F(5.7) && f < F(15.5);
  if (f < F(15.5)) {
    // el gato salta de los brazos de la niña a los de él (12.1)
    const salto = interpolate(f, [F(12.1), F(12.1) + 12], [0, 1], { ...cl, easing: Easing.inOut(Easing.quad) });
    const gx = interpolate(salto, [0, 1], [NIN + 70, X - 20]), gy = interpolate(salto, [0, 1], [PISO - 125, PISO - 190]) - Math.sin(salto * Math.PI) * 120;
    return (
      <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} momento="amanecer" mano={2} seed={101} dibujo={{}} profundidad={1}
        claves={tomas(F, D, [
          [0, P(X, 0.1), P(X, 0.3, 0.5)], // pero tú sí sabes qué hacer
          [1.5, Me(X + 90, 2.2), Me(X + 100, 2.4, 0, -0.5)], // te lavas manos y cara con agua hervida
          [3.7, P(VIEJA, 0), P(VIEJA, 0.2, 0.5)], // la gente te mira como a un loco
          [5.5, P(X, 0.2), P(X, 0.4, -0.5)], // un trapo limpio sobre la boca
          [7.6, E(2860, PISO - 420, 2.0), E(2880, PISO - 430, 2.2, 0.5)], // lavas la capa y la cuelgas al sol
          [9.4, P(X, 0.1), P(X, 0.3, 0.5)], // el mejor negocio de tu vida
          [11.1, Me((X + NIN) / 2, 2.4), Me((X + NIN) / 2 + 10, 2.6, 0, -0.5)], // cambias el gorro por un gato
          [12.4, E(X - 20, PISO - 220, 4.4), E(X - 20, PISO - 225, 4.8, 0.5)], // flaco, enojado, lleno de cicatrices
        ])}
        personajes={[
          { x: X, semilla: 7, ropa, mov: (s) => ({ dx: ventanas(s, [[0, S(3.7)], [S(5.5), S(7.6)], [S(9.4), 99]]) }),
            guion: [{ t: 0, accion: "pose_manos_cadera", expr: "decidido", mirada: "camara" }, { t: S(1.5), accion: "facepalm", expr: "feliz", rotY: 30 }, { t: S(3.0), accion: "facepalm", expr: "feliz", rotY: 30 },
              { t: S(5.5), accion: "pose_pulgar_arriba", expr: "decidido" }, { t: S(9.4), accion: "idle", expr: "guino", mirada: "camara" },
              { t: S(11.1), accion: "explicar", expr: "sonrisa_picara", rotY: -45 }, { t: S(12.1), accion: "cargar_caja", expr: "feliz", rotY: -10 }, { t: S(13.9), accion: "cargar_caja", expr: "asustado", rotY: -10 }] },
          { x: VIEJA, semilla: 102, ropa: ROPA.anciana, mov: (s) => ({ dx: ventanas(s, [[S(3.7), S(5.5)]]) }), guion: [{ t: 0, accion: "idle", expr: "confundido", rotY: 40, mirada: [0.8, 0] }, { t: S(4.4), accion: "pose_rascarse", expr: "confundido", rotY: 40 }] },
          { x: NIN, semilla: 103, ropa: { ...ROPA.niña, manos: undefined, sombrero: f >= F(11.8) ? { tipo: "boina", color: "#5a4030" } : undefined }, mov: (s) => ({ dx: ventanas(s, [[S(11.1), S(12.4)]]) }),
            guion: [{ t: 0, accion: "cargar_caja", expr: "triste", rotY: 40 }, { t: S(12.0), accion: "festejar", expr: "feliz", rotY: 30 }] },
        ]}
        sobre={<>
          {f >= F(1.5) && f < F(3.7) && <><g stroke={M_} strokeWidth={6}><path d={`M${X + 115} ${PISO - 120} l10 110 h90 l10 -110 Z`} fill="#8a6a44" /><ellipse cx={X + 170} cy={PISO - 120} rx={56} ry={14} fill="#7fc8f0" /></g><Vapor f={f} x={X + 170} y={PISO - 140} n={3} alto={180} /></>}
          {conTrapo && f < F(7.6) && <Trapo x={X} y={PISO - 284} />}
          {conTrapo && f >= F(9.4) && f < F(12.4) && <Trapo x={X} y={PISO - 284} />}
          {f >= F(7.6) && f < F(9.4) && <g stroke={M_} strokeWidth={6} strokeLinejoin="round">
            <path d={`M2700 ${PISO - 560} Q2880 ${PISO - 520} 3060 ${PISO - 560}`} stroke="#c9a46a" fill="none" />
            <g transform={`translate(2880,${PISO - 540}) rotate(${Math.sin(f * 0.05) * 3})`}><path d="M-110 0 Q0 16 110 0 L130 300 Q0 320 -130 300 Z" fill="#7a5030" /><path d="M-40 4 v20 M40 4 v20" stroke="#f4efe4" strokeWidth={8} /></g>
            {[0, 1, 2].map((i) => <path key={i} d={`M${2780 + i * 100} ${PISO - 220 + ((f * 0.8 + i * 20) % 60)} v14`} stroke="#7fc8f0" strokeWidth={6} opacity={1 - ((f * 0.8 + i * 20) % 60) / 60} />)}
          </g>}
          {f >= F(11.1) && f < F(15.5) && <Bigotes x={f < F(12.1) ? NIN + 70 : gx} y={f < F(12.1) ? PISO - 125 : gy} f={f} s={1.1} dir={-1} />}
        </>}
        hud={<>
          <IconoGrande tipo="bombilla" desde={F(0.2)} hasta={F(1.4)} />
          <IconoGrande tipo="corazon" desde={F(9.6)} hasta={F(11.0)} />
          <Globos F={F} L={L} lista={[
            { tipo: "espiral", desde: 4.0, hasta: 5.4, x: 1400, y: 250, cola: [1050, 340] },
            { tipo: "gato", desde: 11.3, hasta: 12.0, x: cab(Me((X + NIN) / 2, 2.4), X)[0] + 150, y: 200, cola: cab(Me((X + NIN) / 2, 2.4), X) },
          ]} />
        </>}
      />
    );
  }
  // la posada de noche: el gato caza ratas al lado de su rincón; él lo bautiza
  const R = 1250, FO = 1620;
  const caza = interpolate(f, [F(16.6), F(16.6) + 14], [0, 1], cl);
  return (
    <EscenaB Set={TabernaPintada} pal={PAL} interior momento="noche" setProps={{ variante: "posada" }} mano={2} seed={102} dibujo={{}} profundidad={1}
      claves={tomas(F, D, [
        [15.5, E(R + 120, PISO - 120, 2.6), E(R + 100, PISO - 110, 2.85, 0.5)], // se pasa la noche cazando ratas
        [17.7, E(FO + 165, PISO - 120, 2.1), E(FO + 165, PISO - 120, 2.25, -0.5)], // al lado de tu rincón
        [18.4, P(1930, 0.1), P(1930, 0.3, 0.5)], // lo llamas señor Bigotes
        [19.9, Me(1930, 2.3), Me(1940, 2.5, 0, -0.6)], // sin saberlo te está salvando la vida
      ])}
      personajes={[
        { x: 1930, semilla: 7, ropa: ROPA_T2, mov: (s) => (s < S(18.4) ? { dx: FO - 1930, rz: -90, dy: -10 } : {}),
          guion: [{ t: 0, accion: "quieto", expr: "dormido" }, { t: S(18.4), accion: "cargar_caja", expr: "feliz", mirada: "camara" }, { t: S(19.9), accion: "cargar_caja", expr: "enamorado" }] },
      ]}
      sobre={<>
        {f < F(17.7) && <g stroke={M_} strokeWidth={4}>{caza < 1 && <Rata x={R + 160 - caza * 40} y={PISO - 6} f={f} s={1.4} />}</g>}
        {f < F(18.4) && <Bigotes x={f < F(17.7) ? R - 120 + caza * 260 : FO + 120} y={PISO - 6 - Math.sin(caza * Math.PI) * 110} f={f} s={1.3} />}
        {f >= F(18.4) && <Bigotes x={1910} y={PISO - 196} f={f} s={1.15} dir={-1} />}
      </>}
      hud={<>
        <IconoGrande tipo="corazon" desde={F(20.0)} hasta={D} />
        <Globos F={F} L={L} lista={[{ texto: ["SR. BIGOTES", "MR. WHISKERS"], desde: 18.6, hasta: 19.85, x: 1400, y: 250, cola: [1060, 340], tam: 0.9 }]} />
      </>}
    />
  );
};
