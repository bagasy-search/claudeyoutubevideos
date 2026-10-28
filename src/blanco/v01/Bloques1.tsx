// Bloques 3–6 al nivel del piloto («es un 9, seguí», 28-oct): plano medio corto de base, encuadre nuevo cada 2–4 s,
// corte de reacción en cada remate, insertos de objetos, globitos con dibujo en vez de palabras. Tiempos en s de la voz
// ES; `reloj` los lleva a la EN por palabras ancla. Nadie cortado por el borde: cada extra vive sólo en sus planos.
import { PCama, PPenique } from "./Piezas2";
import { Foco } from "./foco";
import { luzCasa } from "../sets/pintado";
import React from "react";
import { Easing, interpolate } from "remotion";
import { useF } from "../../anikit/camara";
import { PasoGuion } from "../../stickman3d/acciones";
import { Ropa } from "../../stickman3d/vestuario";
import { Personaje } from "../capa3d";
import { ROPA } from "../elenco";
import { Dato, EscenaB } from "../escena";
import { IconoGrande } from "../iconos";
import { CallePintada, TabernaPintada } from "../sets/pintado";
import { PAL_LONDRES as PAL, PISO, Rata } from "../sets/londres";
import { B, cab, cl, E, Globos, GloboDef, M_, Me, Moneda, P, Pi, Pulgas, reloj, ROPA_BOTAS, ROPA_T0, ROPA_T1, Sudor, tomas, tramo, ubicado, Vapor, ventanas } from "./kit";
import { PBalanza, PLupa } from "./Piezas";

const tx = (L: string, es: string, en: string) => (L === "es" ? es : en);

// el par de zapatillas (blancas con franja roja): en las manos del trapero, en el inserto de los cordones
export const Zapas: React.FC<{ x: number; y: number; r?: number; s?: number; tira?: number }> = ({ x, y, r = 0, s: e = 1, tira = 0 }) => {
  const una = (dx: number, k: number) => (
    <g transform={`translate(${dx},${k * 6})`}>
      <path d="M-46 0 Q-48 -30 -20 -34 L10 -30 Q40 -22 48 -6 L48 6 L-46 6 Z" fill="#f6f6f2" stroke={M_} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-46 1 H48" stroke="#ff4a3d" strokeWidth={8} />
      <path d="M-46 7 H48" stroke={M_} strokeWidth={4} />
      <path d="M-12 -30 l10 10 M0 -30 l10 10 M12 -27 l8 9" stroke="#3a6ad8" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${e})`}>
      {una(-26, 1)}{una(26, 0)}
      {/* el cordón que estira: sale del empeine y vuelve con un rebote */}
      {tira > 0 && <path d={`M30 -24 Q${60 + tira * 40} ${-60 - tira * 50} ${70 + tira * 90} ${-30 - tira * 70}`} stroke="#3a6ad8" strokeWidth={5} fill="none" strokeLinecap="round" />}
    </g>
  );
};
// el perchero del trapero: dos palos, una soga y ropa vieja colgada (va en «detras», sin saturar)
const Perchero: React.FC<{ x: number; f: number }> = ({ x, f }) => {
  const mece = (i: number) => Math.sin(f * 0.04 + i) * 2;
  const prendas = [["#8a6a4a", 0], ["#5a7a5a", 1], ["#a85a3a", 2], ["#6a5a7a", 3]] as const;
  return (
    <g stroke={M_} strokeWidth={5} strokeLinejoin="round">
      <path d={`M${x - 40} ${PISO - 10} V${PISO - 420} M${x + 420} ${PISO - 10} V${PISO - 420}`} strokeWidth={12} />
      <path d={`M${x - 40} ${PISO - 400} Q${x + 190} ${PISO - 370} ${x + 420} ${PISO - 400}`} fill="none" stroke="#b08a5a" strokeWidth={6} />
      {prendas.map(([c, i]) => (
        <g key={i} transform={`translate(${x + 20 + i * 105},${PISO - 388 + (i === 1 || i === 2 ? 8 : 0)}) rotate(${mece(i)})`}>
          {i % 2 ? <path d="M-40 0 L40 0 L48 30 L30 34 L30 150 L-30 150 L-30 34 L-48 30 Z" fill={c} /> : <path d="M-36 0 L36 0 L52 190 L-52 190 Z" fill={c} />}
          <path d="M-12 0 Q0 14 12 0" fill="none" strokeWidth={4} />
        </g>
      ))}
    </g>
  );
};

// ── b03 · la ropa: el guardia lo marca, cambia las zapatillas por capa, botas y gorro ──
const PARES_B03: [number, number][] = [[2.0, 2.5], [2.8, 3.8], [3.6, 4.7], [5.0, 6.4], [5.7, 7.3], [6.5, 8.2], [7.3, 9.4], [8.4, 11.0], [9.2, 12.3], [10.9, 14.7], [11.5, 15.9],
  [12.2, 17.4], [13.5, 19.2], [14.0, 20.0], [15.1, 21.3], [16.8, 24.7], [17.8, 25.9], [18.9, 27.2], [20.1, 28.6], [20.5, 30.6], [21.6, 32.1], [22.4, 32.7], [22.7, 33.3],
  [23.5, 34.3], [24.4, 35.5], [25.8, 37.0], [26.9, 38.7]];
const ROPA_TRAPERO: Ropa = { tunica: { color: "#7a6a52", largo: 0.6, cinto: "#4a3020", mangas: "largas" }, calzas: "#5a4a3a", sombrero: { tipo: "pañuelo", color: "#6a7a4a" }, barba: "#9a9088", calzado: { tipo: "zuecos", color: "#6a4a2a" } };
const DESCALZO: Ropa = {};
export const B03P: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B03);
  const X0 = 430, X1 = 615, T = 880, G = -300; // Tiza al llegar / frente al trapero · el trapero · el guardia
  const tz = f < F(15.1) ? ROPA_T0 : f < F(20.5) ? DESCALZO : f < F(21.6) ? { capa: "#7a5030" } : f < F(23.5) ? ROPA_BOTAS : ROPA_T1;
  // encuadres (los que llevan globo se nombran para apuntar la cola)
  const dos = Me(250, 2.3), camina1 = Me(560, 2.2), camina2 = Me(690, 2.25), par = Me(750, 2.55), ancho = Me(700, 1.75);
  const tiza: Personaje = {
    x: X0, semilla: 7, ropa: tz,
    mov: (s) => ({ dx: tramo(s, S(10.9), S(12.9), X1 - X0) + ventanas(s, [[0, S(15.1)], [S(20.1), 99]]) }),
    guion: [
      { t: 0, accion: "idle", expr: "nervioso", mirada: [0.8, 0.1] },
      { t: S(1.0), accion: "mirar_reloj", expr: "nervioso" },
      { t: S(2.0), accion: "idle", expr: "confundido", mirada: [0, -1] },
      { t: S(2.8), accion: "idle", expr: "nervioso", rotY: -30, mirada: [-0.9, 0] },
      { t: S(5.0), accion: "asustarse", expr: "sorprendido", rotY: -30, mirada: [-0.9, 0] },
      { t: S(5.8), accion: "encogerse_de_hombros", expr: "nervioso", rotY: -20 },
      { t: S(6.6), accion: "pose_manos_cabeza", expr: "espantado", rotY: -25 },
      { t: S(9.2), accion: "pensar", expr: "pensativo", mirada: [0.6, 0.7] },
      { t: S(10.0), accion: "senalar", expr: "decidido", objetivo: [1, 0.2], mirada: "camara" },
      { t: S(10.9), accion: "caminar", expr: "decidido", rotY: 90 },
      { t: S(12.9), accion: "explicar", expr: "sonrisa_picara", rotY: 45 },
      { t: S(14.0), accion: "senalar", expr: "sonrisa_picara", rotY: 40, objetivo: [0.3, -1] },
      { t: S(20.1), accion: "idle", expr: "sorprendido", rotY: 40 },
      { t: S(20.5), accion: "festejar", expr: "feliz" },
      { t: S(21.6), accion: "idle", expr: "feliz", mirada: [0, -1] },
      { t: S(22.4), accion: "facepalm", expr: "asqueado" },
      { t: S(23.5), accion: "pose_manos_cadera", expr: "sonrisa_picara", rotY: 15, mirada: "camara" },
      { t: S(24.4), accion: "idle", expr: "neutral", rotY: 30, mirada: [0.8, 0] },
      { t: S(25.8), accion: "pose_pulgar_arriba", expr: "feliz", mirada: "camara" },
    ] as PasoGuion[],
  };
  const trapero: Personaje = {
    x: T, ropa: ROPA_TRAPERO, semilla: 22,
    mov: (s) => ({ dx: ventanas(s, [[S(10.9), S(20.5)], [S(24.4), S(25.8)]]) }),
    guion: [
      { t: 0, accion: "idle", expr: "aburrido", rotY: -40 },
      { t: S(12.2), accion: "saludar", expr: "feliz", rotY: -45 },
      { t: S(13.4), accion: "idle", expr: "confundido", rotY: -40, mirada: [-0.5, -0.5] },
      { t: S(15.1), accion: "cargar_caja", expr: "sorprendido", rotY: -10, mirada: [0, -0.4] },
      { t: S(16.8), accion: "cargar_caja", expr: "confundido", rotY: -10, mirada: [0, -0.4] },
      { t: S(17.8), accion: "cargar_caja", expr: "enamorado", rotY: -10, mirada: [0, -0.2] },
      { t: S(20.1), accion: "explicar", expr: "feliz", rotY: -45 },
      { t: S(24.4), accion: "cargar_caja", expr: "feliz", rotY: -20, mirada: [0, -0.4] },
    ] as PasoGuion[],
  };
  const guardia: Personaje = {
    x: G, ropa: ROPA.guardia, semilla: 21,
    guion: [{ t: 0, accion: "cruzarse_de_brazos", expr: "enojado", rotY: 40 }, { t: S(7.4), accion: "senalar", expr: "furioso", rotY: 35, objetivo: [1, 0.1] }],
  };
  // las dos chismosas que lo miran (sólo en el plano de a dos); en «uno más» una pasa caminando y ni lo mira
  const chisme = (x: number, r: Ropa, sem: number, g: PasoGuion[]): Personaje => ({ x, ropa: r, semilla: sem, prof: -0.4, guion: g, mov: (s) => ({ dx: ventanas(s, [[S(2.8), S(7.3)]]) }) });
  const pasa: Personaje = { x: 330, ropa: ROPA.lavandera, semilla: 41, prof: 0.5, guion: [{ t: 0, accion: "caminar", rotY: 90, expr: "aburrido" }], mov: (s) => ({ dx: ventanas(s, [[S(24.4), S(25.8)]]) + tramo(s, S(24.4), S(25.8), 140) }) };
  // las zapatillas en las manos del trapero: da vuelta (16.8), huele (17.8), tira del cordón (18.9)
  const vuelta = interpolate(f, [F(16.8), F(16.8) + 12], [0, 180], cl);
  const nariz = interpolate(f, [F(17.8), F(17.8) + 8, F(18.8), F(18.9)], [0, 1, 1, 0], cl);
  const tira = f > F(18.9) ? Math.abs(Math.sin(((f - F(18.9)) / 30) * Math.PI * 1.6)) * Math.exp(-(f - F(18.9)) / 40) * 1.4 : 0;
  const GLB: GloboDef[] = [
    { tipo: "lupa", desde: 5.0, hasta: 5.65, x: cab(dos, 160)[0] - 60, y: 190, cola: cab(dos, 160, 20) },
    { tipo: "espiral", desde: 5.7, hasta: 6.45, x: cab(dos, 20)[0] + 40, y: 180, cola: cab(dos, 20) },
    { tipo: "bolsa", desde: 6.5, hasta: 7.25, x: cab(dos, 160)[0] + 40, y: 190, cola: cab(dos, 160, 20) },
    { texto: ["¡EH, TÚ!", "HEY, YOU!"], desde: 7.5, hasta: 9.1, x: 1380, y: 250, cola: [1060, 330], tam: 0.95 },
  ];
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} mano={2} seed={31} dibujo={{}} profundidad={2.6}
      claves={tomas(F, D, [
        [0, P(X0, -0.1), P(X0, 0.15, 0.6)], // «Primer problema, y llega rápido»
        [2.0, Pi(X0, 3.5), Pi(X0 + 15, 3.8)], // «Tu ropa»: las zapatillas
        [2.8, dos, Me(262, 2.45, 0, 0.5)], // las dos que lo miran: espía · loco · ladrón
        [7.3, P(G, -0.2), P(G + 10, 0.15, -0.6)], // el guardia lo señala
        [9.2, P(X0, 0.1), P(X0 + 10, 0.3, 0.5)], // «lo único inteligente»
        [10.9, camina1, camina2], // va directo al trapero
        [13.4, par, Me(760, 2.7, 0, 0.4)], // le ofrece las zapatillas
        [15.1, P(T, -0.15), P(T, 0.1, -0.5)], // el trapero: nunca vio nada igual · las da vuelta · las huele
        [18.9, E(T - 20, PISO - 230, 6.2), E(T - 10, PISO - 240, 6.6, 1)], // tira de los cordones
        [20.1, par, Me(745, 2.6)], // a cambio…
        [20.5, P(X1, 0), P(X1, 0.2, 0.5)], // una capa marrón
        [21.6, Pi(X1, 3.6), Pi(X1 + 10, 3.9)], // unas botas de cuero
        [22.4, P(X1, 0.2), P(X1, 0.35, -0.5)], // que huelen a queso
        [23.5, P(X1, -0.1), P(X1, 0.1, 0.6)], // y un gorro
        [24.4, ancho, Me(720, 1.85, 0, -0.4)], // «Ahora eres uno más»
        [25.8, P(X1, -0.2), P(X1, 0.15, 0.5)], // «Hora dos, y sigues vivo»
      ])}
      personajes={[tiza, trapero, guardia,
        chisme(160, ROPA.campesina, 33, [{ t: 0, accion: "idle", expr: "sorprendido", rotY: 50 }, { t: S(5.0), accion: "senalar", expr: "asustado", rotY: 50, objetivo: [1, 0] }, { t: S(6.5), accion: "pose_manos_cabeza", expr: "espantado", rotY: 45 }]),
        chisme(20, ROPA.anciana, 34, [{ t: 0, accion: "idle", expr: "confundido", rotY: 55 }, { t: S(5.7), accion: "pose_rascarse", expr: "confundido", rotY: 55 }]),]}
      detras={<Perchero x={T + 230} f={f} />}
      sobre={<>
        {f >= F(15.1) && f < F(20.1) && <Zapas x={T - 6} y={PISO - 214 - nariz * 95} r={vuelta + nariz * -20} s={0.62} />}
        {f >= F(18.9) && f < F(20.1) && <Zapas x={T - 6} y={PISO - 214} s={0.62} tira={tira} />}
      </>}
      hud={<>
        <IconoGrande tipo="reloj" desde={F(0.3)} hasta={F(1.9)} />
        <PBalanza a={F(19.4)} b={F(25.2)} m={[F(19.7), F(20.5), F(21.6), F(23.5)]} trato={tx(L, "¡TRATO!", "DEAL!")} />
        <IconoGrande tipo="bombilla" desde={F(9.6)} hasta={F(10.85)} />
        <IconoGrande tipo="olor" desde={F(17.9)} hasta={F(18.85)} x={1360} y={300} />
        <IconoGrande tipo="corazon" desde={F(26.0)} hasta={D} />
        <Dato texto={tx(L, "HORA 2", "HOUR 2")} x={1380} y={250} desde={F(25.9)} hasta={D} tam={120} color="#5fd47a" rot={0} />
        <Globos lista={GLB} F={F} L={L} />
      </>}
    />
  );
};

// ── b04 · el hambre: el olor a pan, sin un peso; carga agua de la fuente al horno; el penique y el pan duro ──
const PARES_B04: [number, number][] = [[1.2, 1.5], [4.4, 5.4], [5.1, 6.5], [5.9, 7.2], [6.8, 7.8], [7.7, 9.8], [8.4, 11.0], [9.1, 11.5], [10.3, 13.3], [11.4, 14.5], [11.7, 14.8],
  [12.6, 16.1], [14.4, 18.4], [14.7, 19.2], [15.4, 20.2], [15.8, 20.8], [16.4, 21.5], [17.4, 22.6], [18.3, 23.8], [19.3, 24.6], [19.5, 25.2], [20.4, 26.0], [20.6, 26.4],
  [21.4, 28.0], [22.2, 28.7], [23.4, 30.3], [24.8, 31.7], [25.7, 32.6], [26.5, 33.4], [28.2, 35.7], [29.2, 36.9]];
export const B04P: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B04);
  const X = 2300, HORNO = 2150, FUENTE = 2560, PAN = 1900; // Tiza · la puerta del horno · la fuente · el panadero
  // el ida y vuelta con el balde (posición fija por segundo ES, igual en los dos idiomas)
  const ruta: [number, number][] = [[12.6, X], [14.4, FUENTE], [15.4, HORNO + 100], [16.4, FUENTE], [17.4, HORNO + 100], [18.3, X]];
  const donde = (s: number) => {
    for (let i = 0; i + 1 < ruta.length; i++) { const a = S(ruta[i][0]), b = S(ruta[i + 1][0]); if (s < b) return s < a ? ruta[i][1] : interpolate(s, [a, b], [ruta[i][1], ruta[i + 1][1]], { easing: Easing.inOut(Easing.cubic) }); }
    return ruta[ruta.length - 1][1];
  };
  const carga = f >= F(12.6) && f < F(18.3);
  const conPan = f >= F(22.2);
  const g: PasoGuion[] = [
    { t: 0, accion: "idle", expr: "triste", mirada: [0, -0.8] },
    { t: S(1.2), accion: "pose_manos_cabeza", expr: "llorando" },
    { t: S(4.2), accion: "idle", expr: "pensativo", rotY: -30, mirada: [-0.8, 0.2] },
    { t: S(5.6), accion: "idle", expr: "enamorado", rotY: -20, mirada: [-0.6, 0.4] },
    { t: S(6.8), accion: "encogerse_de_hombros", expr: "triste" },
    { t: S(8.4), accion: "idle", expr: "confundido", rotY: -40, mirada: [-0.9, 0] },
    { t: S(11.4), accion: "pose_pulgar_arriba", expr: "feliz", rotY: -40 },
    ...ruta.slice(0, -1).map(([t, x], i): PasoGuion => ({ t: S(t), accion: "caminar", expr: i < 2 ? "decidido" : "aburrido", rotY: ruta[i + 1][1] > x ? 90 : -90 })),
    { t: S(18.3), accion: "pose_temblando", expr: "llorando" },
    { t: S(20.4), accion: "idle", expr: "sorprendido", rotY: -40, mirada: [-0.8, 0] },
    { t: S(22.2), accion: "festejar", expr: "carcajada" },
    { t: S(23.4), accion: "idle", expr: "espantado", mirada: [0.3, 0.3] },
    { t: S(24.8), accion: "idle", expr: "enamorado", mirada: [0.2, 0.6] },
    { t: S(26.5), accion: "explicar", expr: "hablando", mirada: "camara" },
  ];
  const tz = ubicado(X, g, donde, { ropa: { ...ROPA_T1, manos: carga ? { d: "balde" } : conPan ? { d: "pan" } : undefined } });
  const panadero: Personaje = {
    x: PAN, semilla: 31, ropa: { ...ROPA.panadero, manos: f < F(11.4) ? { i: "balde", d: "balde" } : f < F(20.4) ? undefined : { d: "pan" } },
    mov: (s) => ({ dx: ventanas(s, [[S(8.4), S(12.6)], [S(20.4), S(23.4)]]), rz: s < S(11.4) ? Math.sin(s * 5) * 4 : 0 }),
    guion: [{ t: 0, accion: "idle", expr: "furioso", rotY: 20 }, { t: S(11.4), accion: "pose_manos_cadera", expr: "sorprendido", rotY: 45 }, { t: S(20.4), accion: "explicar", expr: "feliz", rotY: 50 }],
  };
  const par = Me(2100, 2.3);
  const GLB: GloboDef[] = [
    { texto: ["¡YO TE AYUDO!", "I'LL HELP!"], desde: 11.5, hasta: 12.55, x: cab(par, X)[0] + 60, y: 200, cola: cab(par, X), tam: 0.8 },
    { texto: ["¡CRAC!", "CRACK!"], desde: 23.4, hasta: 24.7, x: 1400, y: 260, cola: [1030, 360], tam: 0.95 },
  ];
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} mano={2} seed={41} corre={[[F(26.6), D - 6, -300]]} dibujo={{}} profundidad={2.6}
      claves={tomas(F, D, [
        [0, P(X, 0.1), P(X, 0.3, -0.6)], // «el hambre»
        [4.2, E(HORNO - 100, PISO - 420, 1.25), E(HORNO - 80, PISO - 400, 1.4, 0.8)], // el olor a pan de la panadería
        [5.6, P(X, 0.2), P(X, 0.45, 0.6)], // te está matando
        [6.8, P(X, -0.2), P(X, 0, -0.5)], // ni una moneda
        [8.4, Me(PAN, 2.6, 40), Me(PAN, 2.8, 40, 0.5)], // el panadero peleando con los baldes
        [11.4, par, Me(2110, 2.45, 0, -0.4)], // y te ofreces
        [12.6, Me(2350, 2.0), Me(2500, 2.05)], // cargas agua toda la mañana
        [14.4, P(FUENTE, -0.4), P(HORNO + 100, -0.4)], // de la fuente al horno (lo sigue de cerca)
        [15.4, Me(2380, 1.45), Me(2370, 1.55, 0, 0.5)], // del horno a la fuente
        [16.4, P(FUENTE, -0.4), P(HORNO + 100, -0.4)], // ida y vuelta…
        [17.4, Me(2380, 1.3), Me(2360, 1.4)], // ida y vuelta
        [18.3, P(X, 0.1), P(X, 0.35, -0.5)], // los brazos destruidos
        [20.4, par, Me(2120, 2.5, 0, 0.4)], // el panadero le da un penique
        [22.2, Me(2180, 2.0), Me(2200, 2.15, 0, 0.5)], // medio pan negro (el panadero se lo da)
        [23.4, P(X, 0), P(X, 0.2, 0.5)], // duro como una piedra
        [24.8, Me(X - 120, 1.5, -60), Me(X - 80, 1.65, -60, 0.5)], // el mejor pan de tu vida (otro lado de la calle)
        [26.5, P(X, -0.1), P(X, 0.1, 0.5)], // un penique = el sueldo de un día
      ])}
      personajes={[tz, panadero]}
      detras={<Foco f={f} luces={[luzCasa(5, F(4.4), F(8.2))]} />}
      sobre={<>
        <Vapor f={f} x={HORNO - 20} y={PISO - 330} n={4} alto={260} s={1.3} />
        {f >= F(5.6) && f < F(6.8) && <Vapor f={f} x={X - 70} y={PISO - 250} n={3} alto={120} s={0.7} />}
        <Sudor f={f} x={PAN} y={PISO - 330} desde={F(8.4)} hasta={F(11.4)} s={0.8} />
        <Sudor f={f} x={X} y={PISO - 330} desde={F(18.3)} hasta={F(20.4)} s={0.8} />
        {f >= F(20.4) && f < F(22.2) && <Moneda f={f} f0={F(21.3)} x={X - 70} y={PISO - 175} s={0.8} />}
      </>}
      hud={<>
        <IconoGrande tipo="pan" desde={F(1.3)} hasta={F(4.1)} />
        <IconoGrande tipo="moneda_no" desde={F(7.0)} hasta={F(8.3)} />
        <IconoGrande tipo="reloj" desde={F(17.5)} hasta={F(18.25)} x={960} y={260} />
        <IconoGrande tipo="brazo" desde={F(18.6)} hasta={F(20.3)} />
        <IconoGrande tipo="corazon" desde={F(25.0)} hasta={F(26.4)} />
        <PPenique a={F(26.6)} b={D - 6} dia={tx(L, "= 1 DÍA DE SUELDO", "= 1 DAY'S PAY")} />
        <Globos lista={GLB} F={F} L={L} />
      </>}
    />
  );
};

// ── b05 · la sed: el río es una cloaca → cerveza floja (hervida) en la taberna. Partido en dos sets (río | taberna) ──
const PARES_B05: [number, number][] = [[0.7, 0.8], [1.6, 2.1], [2.6, 3.9], [3.0, 4.7], [3.8, 6.1], [4.5, 6.9], [5.3, 7.7], [6.0, 9.2], [6.9, 10.6], [8.2, 12.8], [9.0, 13.6],
  [9.2, 14.1], [10.1, 15.0], [10.7, 15.1], [11.3, 16.1], [11.9, 16.5], [12.6, 17.0], [13.1, 17.9], [13.9, 18.8], [14.2, 19.1], [15.2, 20.6], [16.2, 21.6], [17.1, 22.8],
  [17.9, 23.7], [18.5, 24.5], [18.9, 24.9], [19.5, 25.4], [20.5, 26.8], [20.8, 27.5], [21.7, 28.5], [22.1, 29.6], [22.9, 30.3], [23.4, 31.1], [24.1, 31.9], [24.8, 32.3], [26.7, 34.3]];
// la basura que flota en el Támesis (cabecea lento)
const Flota: React.FC<{ f: number; x: number; y: number }> = ({ f, x, y }) => {
  const b = (i: number) => Math.sin(f * 0.07 + i * 1.7) * 6;
  return (
    <g stroke={M_} strokeWidth={5} strokeLinejoin="round">
      <g transform={`translate(${x - 260},${y + b(0)}) rotate(${b(0)})`}><rect x={-46} y={-34} width={92} height={60} rx={10} fill="#8a6a3a" /><path d="M-46 -12 H46 M-46 10 H46" stroke="#5a3a1a" /></g>
      <g transform={`translate(${x - 40},${y + 6 + b(1)})`}><path d="M-60 0 Q0 -16 60 0 L48 14 Q0 22 -48 14 Z" fill="#4a3a2a" /><path d="M-20 -6 l-16 -34 M10 -8 l8 -40" stroke="#6a5a4a" strokeWidth={6} /></g>
      <g transform={`translate(${x + 170},${y + b(2)}) rotate(180)`}><ellipse rx={34} ry={14} fill="#7a6e6f" /><path d="M30 0 q26 -4 40 10" fill="none" stroke="#8a6e6e" strokeWidth={4} /><path d="M-24 -10 l-8 -14 M-10 -12 l-4 -16" strokeWidth={4} /></g>
      <g transform={`translate(${x + 360},${y + b(3)}) rotate(${-20 + b(3)})`}><path d="M-40 0 L30 -10 L40 0 L30 10 Z M-40 0 L-56 -14 L-56 14 Z" fill="#b8c0b0" /><path d="M-20 -6 V6 M-6 -8 V8 M8 -8 V8" strokeWidth={3} /></g>
      {[0, 1, 2].map((i) => <ellipse key={i} cx={x - 160 + i * 230} cy={y + 24} rx={60} ry={8} fill="none" stroke="#c8d8c0" strokeWidth={4} opacity={0.6} />)}
    </g>
  );
};
export const B05aP: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B05);
  const X = 5250, PES = 4900, RIO = 5800;
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} mano={2} seed={51} dibujo={{}} profundidad={2.6}
      claves={tomas(F, D, [
        [0, P(X, 0.1), P(X, 0.3, 0.5)], // «Y ahora, sed»
        [1.6, Me(X + 230, 1.9), Me(X + 260, 2.05, 0, -0.5)], // lo lógico: el agua del río
        [3.8, P(X, 0.2), P(X, 0.35, 0.6)], // ¡Error!
        [4.5, E(RIO, PISO + 20, 2.3), E(RIO + 30, PISO + 30, 2.55, 0.6)], // el río tiene de todo
        [6.3, P(X, 0), P(X, 0.2, -0.5)], // menos agua limpia
        [6.9, P(PES, -0.1), P(PES, 0.15, 0.5)], // aquí casi nadie toma agua
      ])}
      personajes={[
        { x: X, semilla: 7, ropa: ROPA_T1, mov: (s) => ({ dx: ventanas(s, [[0, S(4.5)], [S(6.3), S(6.9)]]) }),
          guion: [{ t: 0, accion: "pose_temblando", expr: "triste", mirada: [0, 0.3] }, { t: S(1.6), accion: "senalar", expr: "feliz", rotY: 40, objetivo: [1, -0.3] },
            { t: S(3.8), accion: "asustarse", expr: "espantado" }, { t: S(6.3), accion: "facepalm", expr: "asqueado" }] },
        { x: PES, semilla: 52, ropa: ROPA.pescadero, mov: (s) => ({ dx: ventanas(s, [[S(6.9), 99]]) }),
          guion: [{ t: 0, accion: "idle", expr: "asqueado", rotY: 20 }, { t: S(7.5), accion: "pose_brazos_cruzados", expr: "enojado", rotY: 15 }] },
      ]}
      sobre={<>
        <Flota f={f} x={RIO} y={PISO + 70} />
        <Sudor f={f} x={X} y={PISO - 330} desde={0} hasta={F(1.6)} s={0.8} />
      </>}
      hud={<>
        <IconoGrande tipo="alerta" desde={F(3.85)} hasta={F(4.45)} />
        <IconoGrande tipo="calavera" desde={F(5.4)} hasta={F(6.25)} x={960} y={300} />
        <Globos F={F} L={L} lista={[
          { tipo: "gota_no", desde: 7.6, hasta: 8.9, x: 1390, y: 260, cola: [1050, 340] },
        ]} />
      </>}
    />
  );
};
// la olla del fogón: hierve, y los bichitos salen con ojos en cruz y se desvanecen
const Olla: React.FC<{ f: number; x: number; y: number; f0: number }> = ({ f, x, y, f0 }) => {
  const t = f - f0;
  return (
    <g transform={`translate(${x},${y})`} stroke={M_} strokeWidth={6} strokeLinejoin="round">
      <path d="M-130 -110 L130 -110 L112 30 Q0 60 -112 30 Z" fill="#4a4a50" />
      <ellipse cy={-110} rx={132} ry={30} fill="#c89a4a" />
      <path d="M-130 -96 h-30 M130 -96 h30" strokeWidth={12} />
      {[0, 1, 2, 3, 4].map((i) => { const u = ((t * 0.6 + i * 9) % 22) / 22; return <circle key={i} cx={-90 + i * 45} cy={-112 - u * 10} r={6 + u * 12} fill="#e8c878" strokeWidth={3} opacity={1 - u} />; })}
      {t > 20 && [0, 1, 2, 3].map((i) => {
        const u = Math.min(1, Math.max(0, (t - 20 - i * 12) / 40));
        if (u <= 0) return null;
        return <g key={i} transform={`translate(${-70 + i * 48 + Math.sin(u * 6 + i) * 14},${-140 - u * 170})`} opacity={1 - u * u}>
          <ellipse rx={13} ry={9} fill="#3a5a2a" strokeWidth={3} /><path d="M-5 -4 l4 4 M-1 -4 l-4 4 M3 -4 l4 4 M7 -4 l-4 4" strokeWidth={2} stroke="#fff" />
          <path d="M-8 8 l-6 8 M8 8 l6 8" strokeWidth={3} />
        </g>;
      })}
    </g>
  );
};
const MESA_Y = PISO - 172; // la tabla de la mesa pintada
export const B05bP: React.FC<B> = ({ D, L, f0 = 0 }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B05, f0);
  const BAR = 640, BEB = 1000, NI = 1500, FO = 2050, MESA = 1250, X = 1120;
  const conJarra = f >= F(20.2);
  const gt: PasoGuion[] = [{ t: 0, accion: "idle", expr: "neutral" }, { t: S(17.1), accion: "caminar", rotY: 90, expr: "feliz" }, { t: S(18.3), accion: "idle", rotY: 30, expr: "feliz" },
    { t: S(20.2), accion: "festejar", expr: "carcajada" }, { t: S(21.7), accion: "idle", expr: "asqueado" }, { t: S(22.9), accion: "encogerse_de_hombros", expr: "confundido" },
    { t: S(24.1), accion: "idle", expr: "guino", mirada: "camara" }];
  return (
    <EscenaB Set={TabernaPintada} pal={PAL} interior mano={2} seed={52} dibujo={{}} profundidad={2.6}
      claves={tomas(F, D, [
        [9.0, Me(BAR + 120, 2.1), Me(BAR + 140, 2.3, 0, 0.5)], // toman cerveza
        [10.1, P(BEB, -0.1), P(BEB, 0.15, -0.5)], // una cerveza floja, aguada
        [11.9, P(NI, 0), P(NI, 0.2, 0.5)], // hasta los niños, en el desayuno
        [13.9, E(FO, PISO - 250, 2.1), E(FO, PISO - 270, 2.4, -0.5)], // al hervirla se mueren los bichos
        [17.1, Me(1000, 1.9), Me(1100, 2.0)], // entras a la taberna
        [18.5, E(MESA, MESA_Y - 30, 4.2), E(MESA + 10, MESA_Y - 30, 4.5, 0.6)], // el penique sobre la mesa
        [19.8, Me(MESA - 10, 1.95), Me(MESA, 2.1)], // te dan una jarra enorme
        [21.7, P(X, 0.1), P(X, 0.3, -0.5)], // sabe a pan mojado
        [22.9, P(X, -0.1), P(X, 0.1, 0.5)], // pero no te va a matar
        [24.1, P(X, 0.25), P(X, 0.45, -0.6)], // y en 1348 ya es mucho
        [25.7, Me(X + 80, 1.45, -40), Me(X + 120, 1.6, -40, 0.5)], // la taberna entera brinda
      ])}
      personajes={[
        ubicado(860, gt, (s) => (s < S(17.1) ? 9000 : s < S(18.3) ? interpolate(s, [S(17.1), S(18.3)], [880, X]) : X), { ropa: { ...ROPA_T1, manos: conJarra ? { d: "jarra" } : undefined } }),
        { x: BAR, semilla: 53, ropa: ROPA.tabernera, mov: (s) => ({ dx: s < S(17.1) ? ventanas(s, [[0, S(10.1)]]) : s < S(19.8) || s >= S(21.7) ? 9000 : MESA + 160 - BAR }),
          guion: [{ t: 0, accion: "saludar", expr: "feliz", rotY: 30 }, { t: S(19.8), accion: "explicar", expr: "feliz", rotY: -50 }] },
        { x: BEB, semilla: 54, ropa: { ...ROPA.aguatero, manos: { d: "jarra" } }, mov: (s) => ({ dx: ventanas(s, [[S(10.1), S(11.9)]]) }),
          guion: [{ t: 0, accion: "reir", expr: "carcajada", rotY: 10 }] },
        { x: NI, semilla: 55, escala: 0.8, ropa: { ...ROPA.niña, manos: { d: "jarra" } }, mov: (s) => ({ dx: ventanas(s, [[S(11.9), S(13.9)]]) }),
          guion: [{ t: 0, accion: "festejar", expr: "feliz", rotY: -10 }] },
      ]}
      sobre={<>
        {f >= F(13.9) && f < F(17.1) && <Olla f={f} f0={F(13.9)} x={FO} y={PISO - 190} />}
        {f >= F(13.9) && f < F(17.1) && <Vapor f={f} x={FO} y={PISO - 330} n={4} alto={200} />}
        {f >= F(18.5) && f < F(19.8) && <Moneda f={f} f0={F(18.7)} x={MESA} y={MESA_Y} s={0.9} />}
      </>}
      hud={<>
        <PLupa a={F(13.7)} b={F(17.1)} fuego={F(14.2)} muere={F(15.1)} />
        <IconoGrande tipo="corazon" desde={F(24.2)} hasta={F(25.65)} />
        <Dato texto="1348" x={960} y={190} desde={F(25.75)} hasta={D} tam={150} color="#ffd23c" rot={0} />
        <Globos F={F} L={L} lista={[
          { tipo: "jarra", desde: 9.1, hasta: 10.0, x: 1350, y: 250, cola: cab(Me(BAR + 120, 2.1), BAR) },
          { texto: ["¡HIP!", "HIC!"], desde: 11.0, hasta: 11.85, x: 1380, y: 250, cola: [1050, 330], tam: 0.9 },
          { tipo: "pan", desde: 21.8, hasta: 22.8, x: 1380, y: 260, cola: [1040, 340] },
        ]} />
      </>}
    />
  );
};

// ── b06 · la noche: oscuridad y ladrones (calle) | la posada: 5 desconocidos, pulgas, y duerme en el piso ──
const PARES_B06: [number, number][] = [[1.1, 1.2], [2.0, 2.4], [2.5, 2.8], [3.4, 4.1], [4.4, 5.5], [5.1, 7.4], [6.1, 8.4], [6.9, 10.1], [7.8, 11.5], [8.6, 12.2], [9.4, 13.1],
  [9.8, 13.4], [10.5, 14.1], [12.1, 15.7], [12.3, 16.1], [13.3, 17.1], [13.9, 17.7], [14.6, 18.5], [15.1, 19.1], [15.9, 20.1], [16.5, 20.9], [17.4, 21.8], [18.0, 22.5],
  [18.9, 23.6], [20.4, 25.5], [21.2, 26.5], [22.2, 28.1], [22.9, 28.8], [23.4, 29.6], [24.3, 30.6], [24.8, 31.6], [25.4, 32.1], [26.2, 33.2], [26.6, 33.8], [27.5, 34.4],
  [28.3, 35.7], [28.9, 36.3], [30.0, 37.6], [31.1, 38.9], [32.0, 40.1], [33.0, 41.3]];
const LADRON: Ropa = { tunica: { color: "#2a2a34", largo: 0.6, mangas: "largas", cinto: "#1a1a1a" }, calzas: "#1e1e24", sombrero: { tipo: "capucha", color: "#22222c" }, calzado: { tipo: "botas", color: "#1a1a1a" } };
export const B06aP: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B06);
  const X = 3300;
  const ladron = (l: number, sem: number) => ubicado(X + l * 420, [{ t: 0, accion: "caminar", rotY: -l * 90, expr: "sonrisa_picara" }, { t: S(5.0), accion: "idle", rotY: -l * 60, expr: "sonrisa_picara" }],
    (s) => ventanas(s, [[S(4.1), S(5.1)]]) + X + l * interpolate(s, [S(4.1), S(5.0)], [430, 280], cl), { ropa: LADRON, semilla: sem });
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} momento="noche" mano={2} seed={61} dibujo={{}} profundidad={2.6}
      claves={tomas(F, D, [
        [0, Me(X, 1.0, -60), Me(X + 40, 1.15, -60, 0.5)], // llega la noche
        [1.1, P(X, 0), P(X, 0.25, -0.5)], // oscura de verdad
        [3.2, P(X, 0.25), P(X, 0.4, 0.5)], // no hay faroles
        [4.1, Me(X, 1.9), Me(X, 2.1, 0, -0.5)], // en la calle sólo quedan ladrones
        [5.1, P(X, 0.3), P(X, 0.5, 0.6)],
      ])}
      personajes={[
        { x: X, semilla: 7, ropa: ROPA_T1, guion: [{ t: 0, accion: "idle", expr: "nervioso", mirada: [-0.9, 0] }, { t: S(1.8), accion: "idle", expr: "asustado", mirada: [0.9, 0] },
          { t: S(3.2), accion: "pose_temblando", expr: "asustado" }, { t: S(4.4), accion: "asustarse", expr: "espantado", mirada: [-0.9, 0] }, { t: S(5.1), accion: "pose_manos_cabeza", expr: "espantado" }] },
        ladron(-1, 62), ladron(1, 63),
      ]}
      sobre={<Sudor f={f} x={X} y={PISO - 330} desde={F(5.1)} hasta={D} s={0.8} />}
      hud={<IconoGrande tipo="farol_no" desde={F(3.3)} hasta={F(4.05)} />}
    />
  );
};
export const B06bP: React.FC<B> = ({ D, L, f0 = 0 }) => {
  const f = useF();
  const { F, S } = reloj(L, PARES_B06, f0);
  const X = 980, POS = 700, CAMA = 1500, PISOX = 1600; // Tiza · el posadero · la cama · donde duerme en el piso
  const RATA = 1150;
  return (
    <EscenaB Set={TabernaPintada} pal={PAL} interior momento="noche" setProps={{ variante: "posada" }} mano={2} seed={62} corre={[[F(10.5), F(13.4), 300]]} dibujo={{}} profundidad={2.6}
      claves={tomas(F, D, [
        [6.1, Me(840, 2.3), Me(850, 2.45, 0, 0.5)], // paga un lugar en la posada
        [8.6, P(POS, 0), P(POS, 0.2, -0.5)], // un lugar, no una cama
        [10.5, E(CAMA, PISO - 250, 1.9), E(CAMA, PISO - 250, 2.05, 0.5)], // la cama con cinco desconocidos
        [13.3, E(CAMA, PISO - 200, 3.6), E(CAMA + 10, PISO - 200, 3.9, -0.5)], // uno ronca como un oso
        [15.1, E(CAMA + 200, PISO - 180, 3.8), E(CAMA + 220, PISO - 180, 4.1, 0.5)], // paja llena de pulgas
        [17.4, P(X, 0.1), P(X, 0.3, -0.5)], // aquí viene tu ventaja
        [18.9, P(X, -0.1), P(X, 0.15, 0.5)], // sabes algo que nadie sabe
        [21.2, P(X, 0.25), P(X, 0.4, -0.5)], // no viene del aire
        [24.3, Pi(RATA, 3.6), Pi(RATA + 20, 3.9)], // viaja en las pulgas de las ratas
        [26.2, P(X, 0), P(X, 0.2, 0.6)], // te levantas, te sacudes
        [28.3, E(PISOX + 165, PISO - 130, 2.0), E(PISOX + 165, PISO - 130, 2.15, -0.5)], // duermes en el piso, lejos de la paja
        [31.0, E(PISOX + 165, PISO - 70, 3.0), E(PISOX + 165, PISO - 75, 3.3, 0.5)], // Día 1. Sobrevivido
      ])}
      personajes={[
        { x: X, semilla: 7, ropa: ROPA_T1,
          mov: (s) => (s < S(28.3) ? { dx: ventanas(s, [[0, S(10.5)], [S(17.4), S(24.3)], [S(26.2), S(28.3)]]) + (s > S(27.5) ? Math.sin(s * 40) * 6 : 0) } : { dx: PISOX - X, rz: -90, dy: -10 }),
          guion: [{ t: 0, accion: "explicar", expr: "feliz", rotY: -40 }, { t: S(9.4), accion: "idle", expr: "confundido", rotY: -30 }, { t: S(17.4), accion: "pensar", expr: "sonrisa_picara" },
            { t: S(18.9), accion: "explicar", expr: "decidido", mirada: "camara" }, { t: S(21.2), accion: "senalar", expr: "decidido", objetivo: [-0.6, 0.8] }, { t: S(22.7), accion: "pose_brazos_cruzados", expr: "pensativo" },
            { t: S(26.2), accion: "asustarse", expr: "asqueado" }, { t: S(27.5), accion: "pose_temblando", expr: "asqueado" }, { t: S(28.3), accion: "quieto", expr: "dormido" }] },
        { x: POS, semilla: 64, ropa: { ...ROPA.noble, capa: undefined, sombrero: { tipo: "cofia" }, delantal: "#e8dcc4" }, mov: (s) => ({ dx: ventanas(s, [[0, S(10.5)]]) }),
          guion: [{ t: 0, accion: "pose_manos_cadera", expr: "sonrisa_picara", rotY: 40 }, { t: S(8.6), accion: "senalar", expr: "sonrisa_picara", rotY: 10, objetivo: [1, -0.2] }] },
      ]}
      sobre={<>
        {f < F(8.6) && <Moneda f={f} f0={F(7.0)} x={POS + 70} y={PISO - 185} s={0.8} />}
        {f >= F(15.1) && f < F(17.4) && <Pulgas f={f} x={CAMA + 210} y={PISO - 200} n={10} ancho={300} s={0.8} />}
        {f >= F(24.3) && f < F(26.2) && <g stroke={M_} strokeWidth={4}><Rata x={RATA - 10} y={PISO - 6} f={f} s={1.6} /></g>}
        {f >= F(24.3) && f < F(26.2) && <Pulgas f={f} x={RATA + 10} y={PISO - 50} n={7} ancho={120} s={0.55} />}
      </>}
      hud={<>
        <IconoGrande tipo="bombilla" desde={F(17.5)} hasta={F(18.8)} />
        <IconoGrande tipo="calavera" desde={F(21.3)} hasta={F(22.6)} />
        <IconoGrande tipo="olor" desde={F(22.7)} hasta={F(24.2)} />
        <PCama a={F(10.5)} b={F(13.4)} cabezas={F(11.5)} />
        <Dato texto={tx(L, "DÍA 1: SOBREVIVIDO", "DAY 1: SURVIVED")} x={960} y={230} desde={F(32.0)} hasta={D} tam={96} color="#5fd47a" rot={0} />
        <Globos F={F} L={L} lista={[
          { texto: ["¡NO!", "NOPE!"], desde: 9.4, hasta: 10.4, x: 1390, y: 250, cola: [1050, 340] },
          { texto: ["ZZZ…", "ZZZ…"], desde: 13.6, hasta: 15.0, x: 1300, y: 270, cola: [1000, 470] },
          { texto: ["zzz", "zzz"], desde: 30.0, hasta: 99, x: 1250, y: 380, cola: [960, 600], tam: 0.8 },
        ]} />
      </>}
    />
  );
};
