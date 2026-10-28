// Video 1 de los canales del stickman blanco: «Despiertas en Londres en 1348…» / «I Sent a Stickman to London in 1348».
// UNA animación, dos renders: `idioma` elige la voz, los textos y los tiempos de cada bloque (durs = cuadros por
// bloque, medidos de la voz de ESE idioma). Todo lo de adentro de un bloque va en FRACCIONES de su duración (fr/sec),
// así la misma escena calza con la voz ES (6:37) y con la EN (8:39).
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Montaje, PlanoM } from "../../anikit/montaje";
import { PasoGuion } from "../../stickman3d/acciones";
import { Personaje } from "../capa3d";
import { Dato, EscenaB, HudSupervivencia, Idioma, MarcaHUD } from "../escena";
import { Simbolo } from "../simbolos";
import { Apertura } from "./Apertura";
import { CallePintada, MurallaPintada, PuertoPintado, TabernaPintada } from "../sets/pintado";
import { OFICIOS, ROPA } from "../elenco";
import { CALLE_M, CalleMedieval, Carro, Cerdo, Gallina, Gato, MURALLA_M, Muralla, PAL_LONDRES as PAL, PISO, Perro, PUERTO_M, Puerto, puntoSoga, Rata, TABERNA_M, Taberna } from "../sets/londres";

export type LondresProps = { idioma: Idioma; durs: number[]; voz?: string; musica?: string };
type B = { D: number; L: Idioma };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const H = PISO - 210; // altura de mira para un plano medio de alguien parado
const tx = (L: Idioma, es: string, en: string) => (L === "es" ? es : en);

// elenco (vinilo de color = NPC; Tiza/Chalk es el único blanco)
const SOMBRERO: Personaje["accesorios"] = ["gorra"];
const NPC = {
  guardia: { ropa: ROPA.guardia },
  trapero: { ropa: ROPA.sereno },
  panadero: { ropa: ROPA.panadero },
  tabernera: { ropa: ROPA.tabernera },
  cura: { ropa: ROPA.monje },
  marinero: { ropa: ROPA.pescadero },
  aldeano: (i: number) => ({ ropa: ROPA[OFICIOS[(i * 5 + 2) % OFICIOS.length]] }),
  granjero: { ropa: ROPA.granjero },
};
const tiza = (guion: PasoGuion[], x: number, extra: Partial<Personaje> = {}): Personaje => ({ x, guion, semilla: 7, ropa: ROPA.tiza, ...extra });

// ── objetos 2D sueltos (capa `sobre`) ────────────────────────────────────────────────────────────────────────────
const Zapatilla: React.FC<{ x: number; y: number; r?: number; s?: number }> = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
    <path d="M-46 0 Q-48 -30 -20 -34 L10 -30 Q40 -22 48 -6 L48 6 L-46 6 Z" fill="#f2f2f2" stroke="#1d1410" strokeWidth={5} />
    <path d="M-46 2 H48" stroke="#ff4a3d" strokeWidth={8} /><path d="M-10 -28 l10 10 M2 -28 l10 10" stroke="#3a6ad8" strokeWidth={4} />
  </g>
);
const Balde: React.FC<{ x: number; y: number; lleno?: boolean }> = ({ x, y, lleno = true }) => (
  <g transform={`translate(${x},${y})`}><path d="M-26 -50 L26 -50 L20 0 L-20 0 Z" fill="#9a6a3a" stroke="#4a3020" strokeWidth={5} /><path d="M-26 -50 Q0 -90 26 -50" stroke="#3a3a3a" strokeWidth={4} fill="none" />{lleno && <ellipse cy={-50} rx={24} ry={6} fill="#7fc0e0" />}</g>
);
const Jarra: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}><rect x={-22} y={-62} width={44} height={62} rx={7} fill="#b5763a" stroke="#4a3020" strokeWidth={5} /><path d="M22 -50 q24 14 0 34" stroke="#b5763a" strokeWidth={9} fill="none" /><ellipse cy={-62} rx={26} ry={10} fill="#fff4dc" stroke="#4a3020" strokeWidth={3} /></g>
);
const Repollo: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x},${y}) rotate(${r})`}><circle r={26} fill="#7cc46a" stroke="#2f5a2a" strokeWidth={5} /><path d="M-16 0 Q0 -18 16 0 M-10 10 Q0 0 10 10" stroke="#3c7a3a" strokeWidth={4} fill="none" /></g>
);
const Flor: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>{[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 14} cy={Math.sin((a * Math.PI) / 180) * 14} r={11} fill="#ff8fb8" stroke="#1d1410" strokeWidth={3} />)}<circle r={9} fill="#ffd23c" /></g>
);
const Orinal: React.FC<{ f: number; f0: number; x: number }> = ({ f, f0, x }) => {
  const t = f - f0;
  if (t < 0 || t > 40) return null;
  const y = PISO - 520 + Math.min(1, t / 18) ** 2 * 500;
  return <g>{t < 18 ? <path d={`M${x - 20} ${y - 30} q20 -20 40 0 q10 30 -20 40 q-30 -10 -20 -40`} fill="#8a6a2a" /> : <ellipse cx={x} cy={PISO + 6} rx={30 + (t - 18) * 4} ry={8} fill="#8a6a2a" opacity={1 - (t - 18) / 22} />}</g>;
};
const MascaraPajaro: React.FC<{ x: number; y: number; f: number; f0: number }> = ({ x, y, f, f0 }) => {
  const t = f - f0;
  if (t < 0) return null;
  const tacha = interpolate(t, [20, 34], [0, 1], cl);
  return (
    <g transform={`translate(${x},${y}) scale(${interpolate(t, [0, 10], [0.4, 1], cl)})`}>
      <circle r={110} fill="#f6f1e6" stroke="#1d1410" strokeWidth={8} />
      <path d="M-50 -30 Q-10 -60 30 -20 L110 40 L20 20 Q-30 30 -50 -30 Z" fill="#2a2420" /><circle cx={-20} cy={-20} r={16} fill="#c8d8e0" stroke="#7a6a5a" strokeWidth={5} />
      <path d={`M-80 -80 L${-80 + 160 * tacha} ${-80 + 160 * tacha}`} stroke="#ff3b30" strokeWidth={18} strokeLinecap="round" />
      <path d={`M80 -80 L${80 - 160 * tacha} ${-80 + 160 * tacha}`} stroke="#ff3b30" strokeWidth={18} strokeLinecap="round" />
    </g>
  );
};
const Lanza: React.FC<{ x: number; f: number; f0: number }> = ({ x, f, f0 }) => {
  const t = f - f0;
  const ent = t < 0 ? 0 : t < 10 ? t / 10 : t < 26 ? 1 : Math.max(0, 1 - (t - 26) / 14);
  return <g transform={`translate(${x - 420 + ent * 260},${PISO - 190}) rotate(-8)`}><rect x={-360} y={-6} width={360} height={12} fill="#6a4a2a" /><path d="M0 -16 L54 0 L0 16 Z" fill="#c8c8c8" stroke="#1d1410" strokeWidth={4} /></g>;
};

// ── los bloques ──────────────────────────────────────────────────────────────────────────────────────────────────
const fr = (D: number, a: number) => Math.round(a * D);
const sc = (D: number, a: number) => (a * D) / 30;

// b01 · despierta en el barro
const B01: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const X = -350;
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} momento="amanecer"
      claves={[mira(0, X, PISO - 90, 2.3), mira(fr(D, 0.18), X, PISO - 160, 1.9, { curva: "inout" }), mira(fr(D, 0.32), X + 60, PISO - 60, 2.6, { curva: "inout" }), mira(fr(D, 0.45), X + 150, H - 40, 1.25, { curva: "fluida" }), mira(fr(D, 0.75), X + 260, H - 120, 0.9, { curva: "fluida" }), mira(D, X + 380, H - 80, 1.1, { curva: "fluida" })]}
      personajes={[
        tiza([{ t: 0, accion: "caerse_y_levantarse", expr: "dormido" }, { t: sc(D, 0.12), accion: "caerse_y_levantarse", expr: "confundido" }, { t: sc(D, 0.24), accion: "pensar", expr: "asqueado" }, { t: sc(D, 0.33), accion: "pensar", expr: "sorprendido", mirada: [0, -0.8] }, { t: sc(D, 0.45), accion: "asustarse", expr: "espantado" }, { t: sc(D, 0.62), accion: "encogerse_de_hombros", expr: "nervioso" }, { t: sc(D, 0.8), accion: "explicar", expr: "sonrisa_picara" }], X),
        { x: X + 330, ...NPC.aldeano(0), guion: [{ t: 0, accion: "caminar", rotY: -90, expr: "neutral" }, { t: sc(D, 0.2), accion: "cruzarse_de_brazos", rotY: -30, expr: "confundido" }, { t: sc(D, 0.5), accion: "senalar", rotY: -40, expr: "asqueado", objetivo: [-0.8, -0.6] }], semilla: 3, prof: -1 },
        { x: X - 380, ...NPC.aldeano(1), guion: [{ t: 0, accion: "idle", rotY: 40, expr: "confundido" }, { t: sc(D, 0.4), accion: "reir", rotY: 40, expr: "carcajada" }, { t: sc(D, 0.7), accion: "cruzarse_de_brazos", rotY: 30, expr: "sonrisa_picara" }], semilla: 5, prof: -1.5 },
      ]}
      sobre={<>
        <Gallina x={X + 600} dir={-1} f={f} /><Gallina x={X - 600} f={f} fase={2} />
        <Simbolo tipo="olor" x={X} y={PISO - 340} desde={fr(D, 0.12)} hasta={fr(D, 0.3)} />
        <Simbolo tipo="?" x={X + 330} y={PISO - 400} desde={fr(D, 0.22)} hasta={fr(D, 0.42)} />
        <Simbolo tipo="!" x={X} y={PISO - 400} desde={fr(D, 0.45)} hasta={fr(D, 0.6)} s={1.2} />
      </>}
      hud={<>
        <Dato texto={tx(L, "¿ZAPATILLAS?", "SNEAKERS?")} x={1300} y={300} desde={fr(D, 0.33)} hasta={fr(D, 0.44)} />
        <Dato texto={"LONDRES · 1348".replace("LONDRES", tx(L, "LONDRES", "LONDON"))} x={960} y={250} desde={fr(D, 0.46)} hasta={fr(D, 0.6)} tam={130} color="#fff6e6" />
        <Dato texto={tx(L, "LA PESTE NEGRA", "THE BLACK DEATH")} x={960} y={420} desde={fr(D, 0.56)} hasta={fr(D, 0.7)} color="#ff5a3c" />
        <Dato texto={tx(L, "¿CUÁNTO DURAS?", "HOW LONG DOES HE LAST?")} x={960} y={300} desde={fr(D, 0.86)} hasta={D} tam={120} />
      </>}
    />
  );
};

// b02 · el general de Cheapside hasta el río
const B02: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const perroX = interpolate(f, [0, D], [0, 2400], cl);
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6}
      claves={[mira(0, 150, PISO - 380, 0.8), mira(fr(D, 0.3), 1600, PISO - 330, 0.85, { curva: "fluida" }), mira(fr(D, 0.45), 2500, PISO - 240, 1.1, { curva: "fluida" }), mira(fr(D, 0.6), 3100, H, 1.3, { curva: "fluida" }), mira(fr(D, 0.85), 4600, PISO - 300, 0.9, { curva: "fluida" }), mira(D, 5300, PISO - 240, 1.05, { curva: "fluida" })]}
      personajes={[
        tiza([{ t: 0, accion: "caminar", rotY: 90, expr: "sorprendido", mirada: [0, 0.6] }, { t: sc(D, 0.48), accion: "asustarse", rotY: 20, expr: "espantado" }, { t: sc(D, 0.56), accion: "caminar", rotY: 90, expr: "asqueado" }, { t: sc(D, 0.9), accion: "facepalm", rotY: 0, expr: "aburrido" }], 300),
        { x: 1300, ...NPC.aldeano(2), guion: [{ t: 0, accion: "cargar_caja", rotY: -90, expr: "neutral" }], semilla: 11, prof: -2 },
        { x: 2300, ...NPC.aldeano(3), guion: [{ t: 0, accion: "explicar", rotY: 50, expr: "hablando" }], semilla: 12, prof: -2 },
        { x: 2500, ...NPC.aldeano(4), guion: [{ t: 0, accion: "reir", rotY: -50, expr: "carcajada" }], semilla: 13, prof: -2.2 },
        { x: 3900, ...NPC.aldeano(5), guion: [{ t: 0, accion: "empujar", rotY: 90, expr: "enojado" }], semilla: 14, prof: -2 },
      ]}
      sobre={<>
        <Cerdo x={900 + interpolate(f, [0, D], [0, 500])} f={f} /><Cerdo x={3500 - interpolate(f, [0, D], [0, 400])} dir={-1} f={f} s={0.8} />
        <Gallina x={1900} f={f} /><Gallina x={2050} dir={-1} f={f} fase={1} /><Gallina x={4200} f={f} fase={3} />
        <Perro x={150 + perroX} f={f} />
        <Orinal f={f} f0={fr(D, 0.46)} x={300 + 88 * sc(D, 0.46) + 60} />
        <Simbolo tipo="!" x={300 + 88 * sc(D, 0.48)} y={PISO - 400} desde={fr(D, 0.48)} hasta={fr(D, 0.58)} />
        <Simbolo tipo="corazon" x={150 + interpolate(fr(D, 0.7), [0, D], [0, 2400]) + 40} y={PISO - 120} desde={fr(D, 0.7)} hasta={fr(D, 0.82)} s={0.6} />
        <Simbolo tipo="olor" x={5500} y={PISO - 80} desde={fr(D, 0.82)} hasta={D} s={1.4} />
      </>}
      hud={<>
        <Dato texto="CHEAPSIDE" x={960} y={260} desde={fr(D, 0.03)} hasta={fr(D, 0.14)} color="#fff6e6" />
        <Dato texto={tx(L, "70.000\nPERSONAS", "70,000\nPEOPLE")} x={1450} y={330} desde={fr(D, 0.14)} hasta={fr(D, 0.3)} />
        <Dato texto={tx(L, "CLOACAS: 0", "SEWERS: 0")} x={600} y={300} desde={fr(D, 0.36)} hasta={fr(D, 0.46)} color="#ff5a3c" />
        <Dato texto={tx(L, "¡AGUA VA!", "WATER BELOW!")} x={960} y={260} desde={fr(D, 0.46)} hasta={fr(D, 0.56)} tam={120} />
        <Dato texto={tx(L, "AGUA · BAÑO · BASURA", "WATER · TOILET · TRASH")} x={960} y={300} desde={fr(D, 0.82)} hasta={fr(D, 0.97)} tam={84} color="#8fd04a" />
      </>}
    />
  );
};

// b03 · la ropa: guardia, trapero, el canje de las zapatillas
const B03: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const T = CALLE_M.trapero;
  const canje = fr(D, 0.42), dado = fr(D, 0.78);
  const huele = interpolate(f, [canje, canje + 20, canje + 60, canje + 80], [0, 1, 1, 0], cl);
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6}
      claves={[mira(0, T - 520, H, 1.2), mira(fr(D, 0.2), T - 650, H - 30, 1.5, { curva: "inout" }), mira(fr(D, 0.36), T - 200, H, 1.25, { curva: "fluida" }), mira(fr(D, 0.5), T - 60, PISO - 300, 2.0, { curva: "fluida" }), mira(fr(D, 0.75), T - 120, H, 1.4, { curva: "fluida" }), mira(D, T - 250, H - 40, 1.2, { curva: "fluida" })]}
      personajes={[
        tiza([{ t: 0, accion: "idle", rotY: 30, expr: "nervioso" }, { t: sc(D, 0.18), accion: "asustarse", rotY: -40, expr: "asustado" }, { t: sc(D, 0.26), accion: "caminar", rotY: 90, expr: "nervioso" }, { t: sc(D, 0.38), accion: "explicar", rotY: 50, expr: "sonrisa_picara" }, { t: sc(D, 0.62), accion: "encogerse_de_hombros", rotY: 40, expr: "confundido" }, { t: sc(D, 0.8), accion: "festejar", rotY: 0, expr: "feliz" }], T - 520, { accesorios: f > dado ? SOMBRERO : undefined }),
        { x: T - 1100, ...NPC.guardia, guion: [{ t: 0, accion: "cruzarse_de_brazos", rotY: 50, expr: "enojado" }, { t: sc(D, 0.12), accion: "senalar", rotY: 60, expr: "enojado", objetivo: [1, 0] }, { t: sc(D, 0.4), accion: "caminar", rotY: 90, expr: "enojado" }, { t: sc(D, 0.55), accion: "mirar_reloj", rotY: 70, expr: "aburrido" }], semilla: 21, prof: -1 },
        { x: T + 80, ...NPC.trapero, guion: [{ t: 0, accion: "idle", rotY: -40, expr: "aburrido" }, { t: sc(D, 0.4), accion: "pensar", rotY: -30, expr: "sorprendido" }, { t: sc(D, 0.55), accion: "pensar", rotY: -20, expr: "asqueado" }, { t: sc(D, 0.68), accion: "festejar", rotY: -40, expr: "feliz" }], semilla: 22, prof: -0.5 },
      ]}
      sobre={<>
        <Simbolo tipo="enojo" x={T - 1100} y={PISO - 400} desde={fr(D, 0.12)} hasta={fr(D, 0.3)} />
        <Simbolo tipo="sudor" x={T - 470} y={PISO - 350} desde={fr(D, 0.18)} hasta={fr(D, 0.36)} />
        {f > canje && f < fr(D, 0.7) && <Zapatilla x={T + 30} y={PISO - 230 - huele * 60} r={-20 + huele * 30} s={1.2} />}
        <Simbolo tipo="olor" x={T + 40} y={PISO - 320} desde={fr(D, 0.55)} hasta={fr(D, 0.66)} s={0.8} />
        <Simbolo tipo="corazon" x={T + 80} y={PISO - 420} desde={fr(D, 0.68)} hasta={fr(D, 0.8)} />
        <Simbolo tipo="estrellas" x={T - 380} y={PISO - 390} desde={fr(D, 0.8)} hasta={D} s={1.1} />
      </>}
      hud={<>
        <Dato texto={tx(L, "ESPÍA · LOCO · LADRÓN", "SPY · MADMAN · THIEF")} x={960} y={250} desde={fr(D, 0.06)} hasta={fr(D, 0.2)} tam={88} color="#ff5a3c" />
        <Dato texto={tx(L, "CAPA + BOTAS + GORRO", "CLOAK + BOOTS + HAT")} x={960} y={250} desde={fr(D, 0.7)} hasta={fr(D, 0.86)} tam={86} />
        <Dato texto={tx(L, "HORA 2: VIVO", "HOUR 2: ALIVE")} x={960} y={360} desde={fr(D, 0.88)} hasta={D} color="#5fd47a" />
      </>}
    />
  );
};

// b04 · el hambre: cargar agua de la fuente al horno; el penique
const B04: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const A = CALLE_M.fuente, P = CALLE_M.panaderia + 110;
  // va y viene caminando entre la fuente y el horno: ida (rotY -90) / vuelta (90); cada tramo ≈ 600 px ≈ 6,5 s
  const tramo = 6.5, n = Math.floor((sc(D, 0.62) - sc(D, 0.18)) / tramo);
  const g: PasoGuion[] = [{ t: 0, accion: "idle", rotY: -60, expr: "triste", mirada: [-0.8, 0] }, { t: sc(D, 0.1), accion: "senalar", rotY: -50, expr: "feliz", objetivo: [-1, 0] }];
  for (let i = 0; i < n; i++) g.push({ t: sc(D, 0.18) + i * tramo, accion: "caminar", rotY: i % 2 ? 90 : -90, expr: i > 1 ? "aburrido" : "neutral" });
  const finPaseo = sc(D, 0.18) + n * tramo;
  g.push({ t: finPaseo, accion: "idle", rotY: 0, expr: "aburrido" }, { t: sc(D, 0.68), accion: "festejar", rotY: -30, expr: "carcajada" }, { t: sc(D, 0.84), accion: "festejar", rotY: 0, expr: "feliz" });
  const xIni = A - 40;
  const cargando = f > fr(D, 0.18) && f < finPaseo * 30;
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6}
      claves={[mira(0, (A + P) / 2, H - 20, 1.0), mira(fr(D, 0.12), P + 100, PISO - 260, 1.8, { curva: "inout" }), mira(fr(D, 0.2), (A + P) / 2, H - 30, 1.0, { curva: "fluida" }), mira(fr(D, 0.62), (A + P) / 2 + 80, H, 1.2, { curva: "fluida" }), mira(fr(D, 0.72), P + 40, PISO - 280, 1.9, { curva: "fluida" }), mira(D, P + 60, H, 1.3, { curva: "fluida" })]}
      personajes={[
        tiza(g, xIni, { accesorios: SOMBRERO }),
        { x: P - 160, ...NPC.panadero, guion: [{ t: 0, accion: "empujar", rotY: 70, expr: "enojado" }, { t: sc(D, 0.15), accion: "aplaudir", rotY: 60, expr: "feliz" }, { t: sc(D, 0.3), accion: "cruzarse_de_brazos", rotY: 60, expr: "feliz" }, { t: sc(D, 0.66), accion: "explicar", rotY: 40, expr: "feliz" }], semilla: 31, prof: -0.8 },
      ]}
      sobre={<>
        {f < fr(D, 0.15) && <><Balde x={P - 260} y={PISO} /><Balde x={P - 200} y={PISO} /></>}
        {cargando && <Simbolo tipo="sudor" x={(A + P) / 2} y={PISO - 380} desde={fr(D, 0.42)} hasta={fr(D, 0.6)} />}
        <Simbolo tipo="moneda" x={P - 60} y={PISO - 400} desde={fr(D, 0.66)} hasta={fr(D, 0.84)} s={1.3} />
        <Simbolo tipo="corazon" x={P - 300} y={PISO - 430} desde={fr(D, 0.8)} hasta={fr(D, 0.92)} />
      </>}
      hud={<>
        <Dato texto={tx(L, "0 MONEDAS", "0 COINS")} x={960} y={260} desde={fr(D, 0.04)} hasta={fr(D, 0.15)} color="#ff5a3c" />
        <Dato texto={tx(L, "IDA Y VUELTA\nIDA Y VUELTA", "BACK AND FORTH\nBACK AND FORTH")} x={960} y={300} desde={fr(D, 0.32)} hasta={fr(D, 0.5)} tam={90} />
        <Dato texto={tx(L, "1 PENIQUE + ½ PAN", "1 PENNY + ½ LOAF")} x={960} y={250} desde={fr(D, 0.68)} hasta={fr(D, 0.82)} />
        <Dato texto={tx(L, "1 PENIQUE ≈ 1 DÍA DE SUELDO", "1 PENNY ≈ 1 DAY'S PAY")} x={960} y={360} desde={fr(D, 0.86)} hasta={D} tam={80} color="#fff6e6" />
      </>}
    />
  );
};

// b05a · la sed junto al río  /  b05b · la cerveza floja en la taberna
const B05a: React.FC<B> = ({ D, L }) => {
  const R = CALLE_M.rio - 380;
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6}
      claves={[mira(0, R, H, 1.3), mira(D, R + 160, PISO - 180, 1.7, { curva: "inout" })]}
      personajes={[tiza([{ t: 0, accion: "caminar", rotY: 90, expr: "feliz" }, { t: sc(D, 0.35), accion: "asustarse", rotY: 60, expr: "asqueado" }, { t: sc(D, 0.6), accion: "facepalm", rotY: 20, expr: "asqueado" }], R - 150, { accesorios: SOMBRERO })]}
      sobre={<>
        <Simbolo tipo="olor" x={CALLE_M.rio} y={PISO - 60} desde={0} hasta={D} s={1.5} />
        <Simbolo tipo="calavera" x={CALLE_M.rio - 80} y={PISO - 200} desde={fr(D, 0.38)} hasta={D} s={1.2} />
      </>}
      hud={<Dato texto={tx(L, "¿AGUA DEL RÍO?\nERROR", "RIVER WATER?\nWRONG")} x={1300} y={320} desde={fr(D, 0.3)} hasta={D} color="#ff5a3c" />}
    />
  );
};
const B05b: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const M = TABERNA_M.mesa;
  return (
    <EscenaB Set={TabernaPintada} pal={PAL} interior
      claves={[mira(0, M - 300, H - 60, 0.95), mira(fr(D, 0.4), M - 100, H, 1.3, { curva: "fluida" }), mira(D, M - 40, PISO - 260, 1.8, { curva: "fluida" })]}
      personajes={[
        tiza([{ t: 0, accion: "caminar", rotY: 90, expr: "feliz" }, { t: sc(D, 0.3), accion: "explicar", rotY: 40, expr: "sonrisa_picara" }, { t: sc(D, 0.55), accion: "reir", rotY: 20, expr: "feliz" }, { t: sc(D, 0.8), accion: "festejar", rotY: 0, expr: "feliz" }], M - 700, { accesorios: SOMBRERO }),
        { x: TABERNA_M.barra - 180, ...NPC.tabernera, guion: [{ t: 0, accion: "explicar", rotY: 60, expr: "hablando" }, { t: sc(D, 0.4), accion: "reir", rotY: 50, expr: "carcajada" }], semilla: 41, prof: -1 },
        { x: M + 260, ...NPC.aldeano(2), guion: [{ t: 0, accion: "sentarse", rotY: -60, expr: "feliz" }], semilla: 42, prof: -1.2 },
      ]}
      sobre={<>
        {f > fr(D, 0.4) && <Jarra x={M - 160 + 88 * 0} y={PISO - 186} />}
        <Simbolo tipo="nota" x={M + 260} y={PISO - 340} desde={fr(D, 0.1)} hasta={fr(D, 0.5)} s={0.8} />
      </>}
      hud={<>
        <Dato texto={tx(L, "CERVEZA FLOJA", "WEAK BEER")} x={960} y={250} desde={fr(D, 0.1)} hasta={fr(D, 0.3)} />
        <Dato texto={tx(L, "HASTA LOS NIÑOS", "EVEN THE KIDS")} x={960} y={360} desde={fr(D, 0.22)} hasta={fr(D, 0.38)} tam={80} color="#fff6e6" />
        <Dato texto={tx(L, "SABE A PAN MOJADO", "TASTES LIKE WET BREAD")} x={960} y={280} desde={fr(D, 0.6)} hasta={fr(D, 0.8)} tam={84} />
      </>}
    />
  );
};

// b06 · la noche en la posada: cama compartida, pulgas, al piso
const B06: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const C = TABERNA_M.cama;
  const rata = interpolate(f, [fr(D, 0.5), fr(D, 0.7)], [-300, 2600], cl);
  return (
    <EscenaB Set={TabernaPintada} pal={PAL} momento="noche" interior setProps={{ variante: "posada" }}
      claves={[mira(0, 900, PISO - 340, 0.9), mira(fr(D, 0.3), C, PISO - 200, 1.2, { curva: "fluida" }), mira(fr(D, 0.5), C - 100, PISO - 150, 1.9, { curva: "fluida" }), mira(fr(D, 0.75), C + 700, H, 1.3, { curva: "fluida" }), mira(D, C + 760, PISO - 140, 2.0, { curva: "fluida" })]}
      personajes={[tiza([{ t: 0, accion: "caminar", rotY: 90, expr: "nervioso" }, { t: sc(D, 0.22), accion: "mirar_reloj", rotY: 30, expr: "asqueado" }, { t: sc(D, 0.42), accion: "asustarse", rotY: 0, expr: "espantado" }, { t: sc(D, 0.5), accion: "pensar", rotY: 0, expr: "nervioso" }, { t: sc(D, 0.62), accion: "explicar", rotY: 20, expr: "sonrisa_picara" }, { t: sc(D, 0.75), accion: "caminar", rotY: 90, expr: "feliz" }, { t: sc(D, 0.86), accion: "sentarse", rotY: 0, expr: "dormido" }], C - 700, { accesorios: SOMBRERO })]}
      sobre={<>
        <Simbolo tipo="zzz" x={C + 150} y={PISO - 260} desde={fr(D, 0.25)} hasta={fr(D, 0.6)} s={1.3} />
        <Simbolo tipo="pulgas" x={C} y={PISO - 200} desde={fr(D, 0.38)} hasta={fr(D, 0.75)} s={1.4} />
        <Simbolo tipo="!" x={C - 700 + 88 * sc(D, 0.22)} y={PISO - 420} desde={fr(D, 0.42)} hasta={fr(D, 0.5)} />
        <Rata x={rata} y={PISO} f={f} />
        <Simbolo tipo="bombilla" x={C - 700 + 88 * sc(D, 0.22)} y={PISO - 400} desde={fr(D, 0.6)} hasta={fr(D, 0.74)} />
        <Simbolo tipo="zzz" x={C + 760 + 60} y={PISO - 300} desde={fr(D, 0.9)} hasta={D} />
      </>}
      hud={<>
        <Dato texto={tx(L, "1 CAMA · 6 PERSONAS", "1 BED · 6 PEOPLE")} x={960} y={250} desde={fr(D, 0.2)} hasta={fr(D, 0.38)} />
        <Dato texto={tx(L, "LA PESTE VIAJA\nEN LAS PULGAS", "THE PLAGUE RIDES\nON THE FLEAS")} x={960} y={330} desde={fr(D, 0.56)} hasta={fr(D, 0.74)} color="#ff5a3c" tam={92} />
        <Dato texto={tx(L, "DÍA 1: SOBREVIVIDO", "DAY 1: SURVIVED")} x={960} y={300} desde={fr(D, 0.9)} hasta={D} color="#5fd47a" />
      </>}
    />
  );
};

// b07 · el puerto: el barco de Francia y las ratas por la soga
const B07: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const ratas = Array.from({ length: 7 }).map((_, i) => {
    const u = interpolate(f, [fr(D, 0.5) + i * 14, fr(D, 0.5) + i * 14 + 110], [1, 0], cl);
    return u < 1 && u > 0 ? <Rata key={i} {...puntoSoga(u, f)} f={f} fase={i} s={0.8} /> : u <= 0 ? <Rata key={i} x={PUERTO_M.soga - 60 - (f - fr(D, 0.5) - i * 14 - 110) * 6} y={PISO} f={f} fase={i} s={0.8} /> : null;
  });
  return (
    <EscenaB Set={PuertoPintado} pal={PAL}
      claves={[mira(0, 1400, PISO - 300, 0.85), mira(fr(D, 0.25), 2000, PISO - 220, 1.15, { curva: "fluida" }), mira(fr(D, 0.5), 2450, PISO - 200, 1.4, { curva: "fluida" }), mira(fr(D, 0.75), 2000, PISO - 170, 1.4, { curva: "fluida" }), mira(D, 1600, PISO - 170, 2.0, { curva: "fluida" })]}
      personajes={[
        tiza([{ t: 0, accion: "caminar", rotY: 90, expr: "feliz" }, { t: sc(D, 0.22), accion: "idle", rotY: 60, expr: "sorprendido" }, { t: sc(D, 0.48), accion: "asustarse", rotY: 50, expr: "espantado" }, { t: sc(D, 0.8), accion: "asustarse", rotY: 20, expr: "asustado" }], 900, { accesorios: SOMBRERO }),
        { x: 2100, ...NPC.marinero, guion: [{ t: 0, accion: "caminar", rotY: -90, expr: "triste" }, { t: sc(D, 0.3), accion: "llorar", rotY: -20, expr: "llorando" }], semilla: 51, prof: -1 },
        { x: 2400, ...NPC.marinero, color: "#8aa58a", guion: [{ t: 0, accion: "cargar_caja", rotY: -90, expr: "aburrido" }], semilla: 52, prof: -1.4 },
        { x: 600, ...NPC.aldeano(4), guion: [{ t: 0, accion: "reir", rotY: 60, expr: "carcajada" }, { t: sc(D, 0.6), accion: "encogerse_de_hombros", rotY: 60, expr: "aburrido" }], semilla: 53, prof: -2 },
      ]}
      sobre={<>
        {ratas}
        <Simbolo tipo="sudor" x={2060} y={PISO - 380} desde={fr(D, 0.22)} hasta={fr(D, 0.5)} />
        <Simbolo tipo="!?" x={900 + 88 * sc(D, 0.22)} y={PISO - 410} desde={fr(D, 0.5)} hasta={fr(D, 0.65)} s={1.2} />
        <Simbolo tipo="calavera" x={2600} y={PISO - 560} desde={fr(D, 0.85)} hasta={D} s={1.4} />
      </>}
      hud={<>
        <Dato texto={tx(L, "DESDE FRANCIA", "FROM FRANCE")} x={960} y={260} desde={fr(D, 0.12)} hasta={fr(D, 0.26)} color="#fff6e6" />
        <Dato texto={tx(L, "BULTOS NEGROS", "BLACK LUMPS")} x={960} y={330} desde={fr(D, 0.3)} hasta={fr(D, 0.46)} color="#ff5a3c" />
        <Dato texto={tx(L, "ENTRÓ POR UNA SOGA", "IT WALKED IN ON A ROPE")} x={960} y={260} desde={fr(D, 0.86)} hasta={D} tam={90} />
      </>}
    />
  );
};

// b08 · avisar no sirve: risas, repollo, el cura
const B08: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const X = CALLE_M.panaderia;
  const tiro = fr(D, 0.5);
  const u = interpolate(f, [tiro, tiro + 22], [0, 1], cl);
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6}
      claves={[mira(0, X, H, 1.2), mira(fr(D, 0.2), X + 400, H, 1.2, { curva: "fluida" }), mira(fr(D, 0.45), X + 300, H - 60, 0.95, { curva: "fluida" }), mira(fr(D, 0.7), X + 700, H, 1.35, { curva: "fluida" }), mira(D, X + 600, PISO - 280, 1.8, { curva: "fluida" })]}
      personajes={[
        tiza([{ t: 0, accion: "explicar", rotY: -50, expr: "nervioso" }, { t: sc(D, 0.12), accion: "caminar", rotY: 90, expr: "nervioso" }, { t: sc(D, 0.2), accion: "senalar", rotY: 50, expr: "asustado", objetivo: [-1, 0] }, { t: sc(D, 0.32), accion: "saludar_dos_manos", rotY: 0, expr: "furioso" }, { t: sc(D, 0.52), accion: "asustarse", rotY: -20, expr: "espantado" }, { t: sc(D, 0.7), accion: "caminar", rotY: 90, expr: "triste" }, { t: sc(D, 0.8), accion: "idle", rotY: 30, expr: "triste" }, { t: sc(D, 0.92), accion: "facepalm", rotY: 0, expr: "triste" }], X + 100, { accesorios: SOMBRERO }),
        { x: X - 200, ...NPC.panadero, guion: [{ t: 0, accion: "cruzarse_de_brazos", rotY: 50, expr: "aburrido" }, { t: sc(D, 0.3), accion: "reir", rotY: 50, expr: "carcajada" }], semilla: 61, prof: -0.6 },
        { x: X + 700, ...NPC.tabernera, guion: [{ t: 0, accion: "reir", rotY: -50, expr: "carcajada" }, { t: sc(D, 0.35), accion: "senalar", rotY: -60, expr: "sonrisa_picara", objetivo: [-1, 0.3] }], semilla: 62, prof: -1 },
        { x: X + 1000, ...NPC.aldeano(0), guion: [{ t: 0, accion: "enojado_pisoton", rotY: -60, expr: "furioso" }, { t: sc(D, 0.45), accion: "empujar", rotY: -70, expr: "furioso" }], semilla: 63, prof: -1.4 },
        { x: X + 1150, ...NPC.cura, guion: [{ t: 0, accion: "idle", rotY: -40, expr: "neutral" }, { t: sc(D, 0.62), accion: "senalar", rotY: -50, expr: "enojado", objetivo: [-1, 0.8] }, { t: sc(D, 0.8), accion: "cruzarse_de_brazos", rotY: -40, expr: "enojado" }], semilla: 64, prof: -0.4 },
      ]}
      sobre={<>
        {u > 0 && u < 1 && <Repollo x={X + 1000 - u * 780} y={PISO - 260 - Math.sin(u * Math.PI) * 220} r={u * 540} />}
        {u >= 1 && f < tiro + 60 && <Repollo x={X + 200} y={PISO - 20} r={30} />}
        <Simbolo tipo="?" x={X - 200} y={PISO - 400} desde={fr(D, 0.08)} hasta={fr(D, 0.26)} />
        <Simbolo tipo="estrellas" x={X + 220} y={PISO - 380} desde={tiro + 22} hasta={tiro + 70} />
        <Simbolo tipo="enojo" x={X + 1150} y={PISO - 420} desde={fr(D, 0.64)} hasta={fr(D, 0.82)} />
        <Simbolo tipo="sudor" x={X + 700} y={PISO - 360} desde={fr(D, 0.85)} hasta={D} />
      </>}
      hud={<>
        <Dato texto={tx(L, "¡MATEN LAS RATAS!", "KILL THE RATS!")} x={960} y={250} desde={fr(D, 0.05)} hasta={fr(D, 0.17)} tam={96} color="#ff5a3c" />
        <Dato texto={tx(L, "¡HIERVAN EL AGUA!", "BOIL THE WATER!")} x={960} y={250} desde={fr(D, 0.18)} hasta={fr(D, 0.3)} tam={96} color="#ff5a3c" />
        <Dato texto={tx(L, "¿BRUJO?", "WITCH?")} x={1350} y={330} desde={fr(D, 0.38)} hasta={fr(D, 0.5)} tam={120} />
        <Dato texto={tx(L, "LECCIÓN 1:\nNADIE TE CREE", "LESSON 1:\nNOBODY BELIEVES YOU")} x={960} y={300} desde={fr(D, 0.86)} hasta={D} tam={92} color="#fff6e6" />
      </>}
    />
  );
};

// b09 · empieza: cruces en las puertas y los remedios absurdos
const B09: React.FC<B> = ({ D, L }) => {
  const f = useF();
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} setProps={{ variante: "peste" }}
      claves={[mira(0, 4600, PISO - 420, 0.75), mira(fr(D, 0.22), 3700, PISO - 360, 0.85, { curva: "fluida" }), mira(fr(D, 0.4), 3100, H, 1.3, { curva: "fluida" }), mira(fr(D, 0.58), 2600, H, 1.3, { curva: "fluida" }), mira(fr(D, 0.74), 3450, PISO - 200, 1.5, { curva: "fluida" }), mira(D, 3900, PISO - 330, 0.95, { curva: "fluida" })]}
      personajes={[
        { x: 3100, ...NPC.aldeano(1), guion: [{ t: 0, accion: "caminar", rotY: -90, expr: "pensativo" }, { t: sc(D, 0.3), accion: "festejar", rotY: 0, expr: "feliz" }], semilla: 71 },
        { x: 2600, ...NPC.aldeano(3), guion: [{ t: 0, accion: "llorar", rotY: 30, expr: "llorando" }], semilla: 72 },
        { x: 2780, color: "#6a5a8a", accesorios: ["anteojos"], guion: [{ t: 0, accion: "explicar", rotY: -50, expr: "sonrisa_picara" }], semilla: 73 },
        { x: 3500, ...NPC.aldeano(5), guion: [{ t: 0, accion: "sentarse", rotY: 0, expr: "feliz" }], semilla: 74 },
        tiza([{ t: 0, accion: "idle", rotY: -60, expr: "asustado" }, { t: sc(D, 0.4), accion: "facepalm", rotY: -40, expr: "aburrido" }, { t: sc(D, 0.75), accion: "encogerse_de_hombros", rotY: 0, expr: "confundido" }, { t: sc(D, 0.88), accion: "pensar", rotY: 0, expr: "pensativo" }], 3950, { accesorios: SOMBRERO, prof: 0.5 }),
      ]}
      sobre={<>
        {f > fr(D, 0.28) && <Flor x={3100 + 88 * interpolate(f, [0, fr(D, 0.3)], [0, -sc(D, 0.3)], cl) + 40} y={PISO - 250} />}
        <Simbolo tipo="olor" x={3500} y={PISO - 260} desde={fr(D, 0.64)} hasta={fr(D, 0.85)} s={1.3} />
        <Simbolo tipo="corazon" x={3500} y={PISO - 420} desde={fr(D, 0.7)} hasta={fr(D, 0.85)} />
        <Simbolo tipo="calavera" x={3800} y={PISO - 430} desde={fr(D, 0.05)} hasta={fr(D, 0.22)} s={1.2} />
      </>}
      hud={<>
        <Dato texto={tx(L, "2 CASAS → 10 CASAS", "2 HOUSES → 10 HOUSES")} x={960} y={250} desde={fr(D, 0.04)} hasta={fr(D, 0.2)} color="#ff5a3c" />
        <Dato texto={tx(L, "REMEDIO 1: FLORES", "CURE 1: FLOWERS")} x={960} y={250} desde={fr(D, 0.3)} hasta={fr(D, 0.42)} tam={90} />
        <Dato texto={tx(L, "REMEDIO 2: SANGRÍA", "CURE 2: BLOODLETTING")} x={960} y={250} desde={fr(D, 0.44)} hasta={fr(D, 0.58)} tam={90} />
        <Dato texto={tx(L, "REMEDIO 3: LA CLOACA", "CURE 3: THE SEWER")} x={960} y={250} desde={fr(D, 0.6)} hasta={fr(D, 0.74)} tam={90} />
        <AbsoluteFill><svg width={1920} height={1080}><MascaraPajaro x={1450} y={600} f={f} f0={fr(D, 0.76)} /></svg></AbsoluteFill>
        <Dato texto={tx(L, "ESTO ES DEL 1600", "THAT'S THE 1600s")} x={1450} y={820} desde={fr(D, 0.8)} hasta={D} tam={70} color="#fff6e6" />
      </>}
    />
  );
};

// b10 · su propia protección: lavarse, el trapo, el gato Señor Bigotes
const B10: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const C = TABERNA_M.cama;
  const ratX = interpolate(f, [fr(D, 0.62), fr(D, 0.8)], [C + 900, C - 600], cl);
  const gatoX = interpolate(f, [fr(D, 0.66), fr(D, 0.84)], [C + 1200, C - 300], cl);
  return (
    <EscenaB Set={TabernaPintada} pal={PAL} interior setProps={{ variante: "posada" }}
      claves={[mira(0, 900, H, 1.25), mira(fr(D, 0.35), 1100, PISO - 260, 1.6, { curva: "fluida" }), mira(fr(D, 0.55), 1100, H, 1.2, { curva: "fluida" }), mira(fr(D, 0.75), C + 200, PISO - 160, 1.4, { curva: "fluida" }), mira(D, 1050, PISO - 230, 1.7, { curva: "fluida" })]}
      personajes={[tiza([{ t: 0, accion: "pensar", rotY: 20, expr: "feliz" }, { t: sc(D, 0.18), accion: "explicar", rotY: 0, expr: "sonrisa_picara" }, { t: sc(D, 0.36), accion: "cruzarse_de_brazos", rotY: 0, expr: "feliz" }, { t: sc(D, 0.5), accion: "saludar", rotY: 40, expr: "feliz" }, { t: sc(D, 0.66), accion: "senalar", rotY: 50, expr: "sorprendido", objetivo: [1, -0.6] }, { t: sc(D, 0.86), accion: "festejar", rotY: 0, expr: "enamorado" }], 1000)]}
      sobre={<>
        {f < fr(D, 0.2) && <Balde x={1140} y={PISO} />}
        {f > fr(D, 0.18) && <rect x={960} y={PISO - 285} width={80} height={30} rx={10} fill="#f4efe0" stroke="#1d1410" strokeWidth={4} />}
        <Simbolo tipo="estrellas" x={1000} y={PISO - 390} desde={fr(D, 0.05)} hasta={fr(D, 0.2)} />
        <Gato x={f < fr(D, 0.5) ? 1300 : gatoX} y={PISO} dir={-1} f={f} />
        {f > fr(D, 0.6) && f < fr(D, 0.82) && <Rata x={ratX} y={PISO} f={f} />}
        <Simbolo tipo="enojo" x={1340} y={PISO - 120} desde={fr(D, 0.5)} hasta={fr(D, 0.62)} s={0.6} />
        <Simbolo tipo="corazon" x={1000} y={PISO - 420} desde={fr(D, 0.86)} hasta={D} s={1.2} />
      </>}
      hud={<>
        <Dato texto={tx(L, "AGUA HERVIDA", "BOILED WATER")} x={960} y={250} desde={fr(D, 0.04)} hasta={fr(D, 0.16)} tam={90} />
        <Dato texto={tx(L, "TRAPO LIMPIO", "CLEAN RAG")} x={960} y={250} desde={fr(D, 0.18)} hasta={fr(D, 0.3)} tam={90} />
        <Dato texto={tx(L, "GORRO → GATO", "HAT → CAT")} x={960} y={250} desde={fr(D, 0.44)} hasta={fr(D, 0.58)} tam={110} />
        <Dato texto={tx(L, "SEÑOR BIGOTES", "MISTER WHISKERS")} x={960} y={330} desde={fr(D, 0.6)} hasta={fr(D, 0.8)} tam={110} color="#ffb347" />
      </>}
    />
  );
};

// b11a · la posada vacía  /  b11b · los carros por la calle en silencio
const B11a: React.FC<B> = ({ D, L }) => {
  const C = TABERNA_M.cama;
  return (
    <EscenaB Set={TabernaPintada} pal={PAL} interior momento="amanecer"
      claves={[mira(0, C, PISO - 200, 1.6), mira(fr(D, 0.5), C - 300, H, 1.1, { curva: "fluida" }), mira(D, TABERNA_M.fogon, H, 1.3, { curva: "fluida" })]}
      personajes={[
        tiza([{ t: 0, accion: "caerse_y_levantarse", rotY: 0, expr: "dormido" }, { t: sc(D, 0.2), accion: "idle", rotY: -30, expr: "sorprendido" }, { t: sc(D, 0.5), accion: "caminar", rotY: 90, expr: "triste" }], C - 400),
        { x: TABERNA_M.fogon + 160, color: "#8a6a5a", guion: [{ t: 0, accion: "llorar", rotY: -50, expr: "triste" }], semilla: 81, prof: -0.8 },
      ]}
      sobre={<><Gato x={C - 300} y={PISO} f={0} /><Simbolo tipo="sudor" x={TABERNA_M.fogon + 160} y={PISO - 380} desde={fr(D, 0.4)} hasta={D} /></>}
      hud={<Dato texto={tx(L, "LOS 5 YA NO ESTÁN", "THE 5 ARE GONE")} x={960} y={260} desde={fr(D, 0.25)} hasta={fr(D, 0.6)} tam={92} color="#fff6e6" />}
    />
  );
};
const B11b: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const cx = interpolate(f, [0, D], [1800, 5200]);
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} setProps={{ variante: "peste" }} momento="amanecer"
      claves={[mira(0, 2200, PISO - 330, 0.9), mira(D, 4600, PISO - 380, 0.8, { curva: "inout" })]}
      personajes={[tiza([{ t: 0, accion: "idle", rotY: 40, expr: "triste" }, { t: sc(D, 0.5), accion: "cruzarse_de_brazos", rotY: 60, expr: "triste" }], 3300, { prof: 1 })]}
      sobre={<><Carro x={cx} f={f} tapado ruedaGira={f * 3} /><Simbolo tipo="calavera" x={cx} y={PISO - 330} desde={fr(D, 0.1)} hasta={fr(D, 0.6)} /></>}
      hud={<>
        <Dato texto={tx(L, "CIENTOS POR DÍA", "HUNDREDS A DAY")} x={960} y={260} desde={fr(D, 0.4)} hasta={fr(D, 0.65)} color="#ff5a3c" />
        <Dato texto={tx(L, "SIN CAMPANAS · SÓLO CARROS", "NO BELLS · JUST CARTS")} x={960} y={300} desde={fr(D, 0.72)} hasta={D} tam={80} color="#fff6e6" />
      </>}
    />
  );
};

// b12 · lo acusan: la turba y la huida
const B12: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const corre = sc(D, 0.66);
  const X = 1600;
  const vx = 232; // px/s del «correr» del kit (2,5 u/s × K)
  const tizaX = (s: number) => X + Math.max(0, s - corre) * vx;
  const turba = Array.from({ length: 6 }).map((_, i) => ({
    x: X - 700 - i * 170, ...NPC.aldeano(i), semilla: 90 + i, prof: -0.5 - (i % 3) * 0.6,
    guion: [{ t: 0, accion: "cruzarse_de_brazos", rotY: 60, expr: "confundido" }, { t: sc(D, 0.36) + i * 0.4, accion: "senalar", rotY: 70, expr: "enojado", objetivo: [1, 0] as [number, number] }, { t: sc(D, 0.52) + i * 0.2, accion: "enojado_pisoton", rotY: 70, expr: "furioso" }, { t: corre + 0.4 + i * 0.15, accion: "correr", rotY: 90, expr: "furioso" }] as PasoGuion[],
  }));
  const s = f / 30;
  return (
    <EscenaB Set={CallePintada} pal={PAL} zTras={0.6} setProps={{ variante: "peste" }}
      claves={[mira(0, X - 300, H - 40, 1.0), mira(fr(D, 0.3), X - 80, PISO - 270, 1.9, { curva: "fluida" }), mira(fr(D, 0.5), X - 500, H - 60, 0.9, { curva: "fluida" }), mira(fr(D, 0.66), X, H, 1.2, { curva: "fluida" }), mira(D, tizaX(sc(D, 1)) - 200, H, 1.05, { curva: "fluida" })]}
      personajes={[tiza([{ t: 0, accion: "idle", rotY: -40, expr: "neutral" }, { t: sc(D, 0.3), accion: "asustarse", rotY: -60, expr: "asustado" }, { t: sc(D, 0.5), accion: "encogerse_de_hombros", rotY: -50, expr: "nervioso" }, { t: corre, accion: "correr", rotY: 90, expr: "espantado" }], X), ...turba]}
      sobre={<>
        <Gato x={tizaX(s) + 40} y={PISO - 150} dir={1} f={f} s={0.7} />
        <Simbolo tipo="!" x={X - 700} y={PISO - 410} desde={fr(D, 0.36)} hasta={fr(D, 0.5)} />
        {turba.slice(1, 5).map((t, i) => <Simbolo key={i} tipo="enojo" x={t.x + (s > corre ? (s - corre) * vx : 0)} y={PISO - 420} desde={fr(D, 0.52) + i * 6} hasta={D} s={0.9} />)}
        <Simbolo tipo="sudor" x={tizaX(s) - 20} y={PISO - 380} desde={fr(D, 0.68)} hasta={D} />
      </>}
      hud={<>
        <Dato texto={tx(L, "¿QUIÉN NO SE ENFERMA?", "WHO DOESN'T GET SICK?")} x={960} y={250} desde={fr(D, 0.36)} hasta={fr(D, 0.5)} tam={90} />
        <Dato texto={tx(L, "EL QUE LA TRAJO", "THE ONE WHO BROUGHT IT")} x={960} y={360} desde={fr(D, 0.46)} hasta={fr(D, 0.6)} tam={90} color="#ff5a3c" />
        <Dato texto={tx(L, "¡CORRE!", "RUN!")} x={960} y={300} desde={fr(D, 0.66)} hasta={fr(D, 0.8)} tam={170} color="#ff5a3c" />
      </>}
    />
  );
};

// b13 · la puerta de Aldgate, el carro de heno y la lanza
const B13: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const P = MURALLA_M.puerta;
  const salto = sc(D, 0.22), Cx = MURALLA_M.carro;
  const cartX = (s: number) => Cx + Math.max(0, s - sc(D, 0.72)) * 140;
  const s = f / 30;
  return (
    <EscenaB Set={MurallaPintada} pal={PAL} setProps={{ hora: 0.35 }}
      claves={[mira(0, P + 100, H - 60, 0.95), mira(fr(D, 0.22), Cx - 200, H, 1.25, { curva: "fluida" }), mira(fr(D, 0.45), Cx - 100, PISO - 220, 1.9, { curva: "fluida" }), mira(fr(D, 0.65), Cx, PISO - 200, 1.6, { curva: "fluida" }), mira(D, cartX(sc(D, 1)) + 400, PISO - 360, 0.85, { curva: "fluida" })]}
      personajes={[
        tiza([{ t: 0, accion: "correr", rotY: 90, expr: "espantado" }, { t: salto, accion: "saltar", rotY: 90, expr: "sorprendido" }, { t: salto + 0.8, accion: "sentarse", rotY: 0, expr: "asustado" }, { t: sc(D, 0.62), accion: "sentarse", rotY: 0, expr: "feliz" }], P - 600),
        { x: P + 90, ...NPC.guardia, guion: [{ t: 0, accion: "idle", rotY: 30, expr: "aburrido" }, { t: sc(D, 0.38), accion: "caminar", rotY: 90, expr: "enojado" }, { t: sc(D, 0.48), accion: "empujar", rotY: 90, expr: "enojado" }, { t: sc(D, 0.62), accion: "mirar_reloj", rotY: -40, expr: "aburrido" }], semilla: 101, prof: -1 },
        { x: Cx + 380, ...NPC.granjero, guion: [{ t: 0, accion: "idle", rotY: 90, expr: "aburrido" }, { t: sc(D, 0.72), accion: "caminar", rotY: 90, expr: "neutral" }], semilla: 102, prof: 0.5 },
      ]}
      sobre={<>
        <Carro x={cartX(s)} f={f} heno ruedaGira={Math.max(0, s - sc(D, 0.72)) * 140 * 1.3} />
        <Lanza x={cartX(s) - 60} f={f} f0={fr(D, 0.48)} />
        <Simbolo tipo="sudor" x={cartX(s) - 40} y={PISO - 340} desde={fr(D, 0.46)} hasta={fr(D, 0.62)} />
        <Gato x={cartX(s) + 120} y={PISO - 236} f={f} s={0.6} enojado={false} />
      </>}
      hud={<>
        <Dato texto="ALDGATE" x={960} y={250} desde={fr(D, 0.04)} hasta={fr(D, 0.18)} color="#fff6e6" />
        <Dato texto={tx(L, "A UN DEDO", "ONE INCH")} x={960} y={300} desde={fr(D, 0.5)} hasta={fr(D, 0.62)} tam={140} color="#ff5a3c" />
        <Dato texto={tx(L, "AFUERA. VIVO.", "OUT. ALIVE.")} x={960} y={280} desde={fr(D, 0.82)} hasta={D} tam={130} color="#5fd47a" />
      </>}
    />
  );
};

// b14 · el ocaso en el heno, el estornudo y el gancho al vikingo
const B14: React.FC<B> = ({ D, L }) => {
  const f = useF();
  const Cx = MURALLA_M.carro + 1600;
  const estornudo = fr(D, 0.58);
  return (
    <EscenaB Set={MurallaPintada} pal={PAL} setProps={{ hora: 1 }}
      claves={[mira(0, Cx + 200, PISO - 420, 0.8), mira(fr(D, 0.35), Cx, PISO - 260, 1.4, { curva: "fluida" }), mira(fr(D, 0.56), Cx + 250, PISO - 260, 1.6, { curva: "fluida" }), mira(fr(D, 0.7), Cx + 60, PISO - 290, 2.4, { curva: "fluida" }), mira(D, Cx + 600, PISO - 600, 0.7, { curva: "fluida" })]}
      personajes={[
        tiza([{ t: 0, accion: "sentarse", rotY: 0, expr: "feliz" }, { t: sc(D, 0.4), accion: "sentarse", rotY: 0, expr: "feliz" }, { t: sc(D, 0.6), accion: "sentarse", rotY: 40, expr: "sorprendido" }, { t: sc(D, 0.7), accion: "sentarse", rotY: 30, expr: "espantado" }], Cx - 20, { alto: 170, prof: 0.6 }),
        { x: Cx + 380, ...NPC.granjero, guion: [{ t: 0, accion: "idle", rotY: 90, expr: "neutral" }, { t: sc(D, 0.56), accion: "asustarse", rotY: 60, expr: "sorprendido" }, { t: sc(D, 0.62), accion: "idle", rotY: -60, expr: "sonrisa_picara" }], semilla: 102, prof: 0.5 },
      ]}
      detras={<Carro x={Cx} f={f} heno ruedaGira={f * 2} />}
      sobre={<>
        <Gato x={Cx + 120} y={PISO - 236} f={f} s={0.6} enojado={false} />
        <Simbolo tipo="corazon" x={Cx - 20} y={PISO - 560} desde={fr(D, 0.42)} hasta={fr(D, 0.55)} />
        <Simbolo tipo="!" x={Cx + 380} y={PISO - 420} desde={estornudo} hasta={estornudo + 20} />
        <Simbolo tipo="!" x={Cx + 380} y={PISO - 420} desde={estornudo + 26} hasta={estornudo + 46} s={1.3} />
        <Simbolo tipo="!?" x={Cx - 20} y={PISO - 560} desde={fr(D, 0.68)} hasta={fr(D, 0.8)} s={1.3} />
      </>}
      hud={<>
        <Dato texto={tx(L, "4 DÍAS", "4 DAYS")} x={960} y={300} desde={fr(D, 0.04)} hasta={fr(D, 0.2)} tam={200} color="#ffd23c" />
        <Dato texto={tx(L, "RÍO ✗ · PAJA ✗ · GATO ✓", "RIVER ✗ · STRAW ✗ · CAT ✓")} x={960} y={300} desde={fr(D, 0.2)} hasta={fr(D, 0.38)} tam={84} color="#fff6e6" />
        <Dato texto={tx(L, "¡ACHÍS!", "ACHOO!")} x={1300} y={330} desde={estornudo} hasta={estornudo + 40} tam={150} color="#8fd04a" />
        <Dato texto={tx(L, "PRÓXIMO: VIKINGOS · AÑO 900", "NEXT: VIKINGS · YEAR 900")} x={960} y={280} desde={fr(D, 0.76)} hasta={fr(D, 0.9)} tam={86} />
        <Dato texto={tx(L, "SUSCRÍBETE", "SUBSCRIBE")} x={960} y={420} desde={fr(D, 0.84)} hasta={D} tam={120} color="#ff5a3c" />
        <Dato texto={tx(L, "¿TÚ CUÁNTO DURARÍAS?", "HOW LONG WOULD YOU LAST?")} x={960} y={560} desde={fr(D, 0.9)} hasta={D} tam={80} color="#fff6e6" />
      </>}
    />
  );
};

// ── armado ───────────────────────────────────────────────────────────────────────────────────────────────────────
// bloque → [componentes, fracción donde se parte (si son 2 planos), transición de entrada]
type Def = { el: React.FC<B>[]; corte?: number; trans?: PlanoM["trans"] };
const DEFS: Def[] = [
  { el: [Apertura] },
  { el: [B02], trans: { tipo: "fundido", d: 16 } },
  { el: [B03], trans: { tipo: "cortina", d: 16 } },
  { el: [B04], trans: { tipo: "barrido", d: 14 } },
  { el: [B05a, B05b], corte: 0.32, trans: { tipo: "barrido", d: 14 } },
  { el: [B06], trans: { tipo: "fundido", d: 24 } },
  { el: [B07], trans: { tipo: "luz", d: 20 } },
  { el: [B08], trans: { tipo: "cortina", d: 16 } },
  { el: [B09], trans: { tipo: "fundido", d: 20 } },
  { el: [B10], trans: { tipo: "cortina", d: 16 } },
  { el: [B11a, B11b], corte: 0.45, trans: { tipo: "fundido", d: 24 } },
  { el: [B12], trans: { tipo: "cortina", d: 16 } },
  { el: [B13], trans: { tipo: "barrido", d: 14 } },
  { el: [B14], trans: { tipo: "fundido", d: 20 } },
];
const HUD_M: Omit<MarcaHUD, "f">[] = [
  { dia: "1", hora: "06:00", prob: 50 }, { dia: "1", hora: "07:00", prob: 45 }, { dia: "1", hora: "08:00", prob: 55 }, { dia: "1", hora: "11:00", prob: 62 },
  { dia: "1", hora: "14:00", prob: 68 }, { dia: "1", hora: "21:00", prob: 78 }, { dia: "2", hora: "10:00", prob: 52 }, { dia: "2", hora: "16:00", prob: 40 },
  { dia: "3", hora: "09:00", prob: 33 }, { dia: "3", hora: "18:00", prob: 61 }, { dia: "4", hora: "08:00", prob: 44 }, { dia: "4", hora: "13:00", prob: 12 },
  { dia: "4", hora: "15:00", prob: 70 }, { dia: "4", hora: "18:00", prob: 91 },
];

export const PAUSA = 12; // cuadros de aire después de cada bloque de voz
export const largoLondres = (durs: number[]) => durs.reduce((a, d) => a + d + PAUSA, 0) + 60;

export const Londres1348: React.FC<LondresProps> = ({ idioma, durs, voz, musica }) => {
  const { fps } = useVideoConfig();
  const planos: PlanoM[] = [];
  const marcas: MarcaHUD[] = [];
  let t = 0;
  DEFS.forEach((d, i) => {
    const D = durs[i] + PAUSA + (i === DEFS.length - 1 ? 60 : 0);
    marcas.push({ f: t, ...HUD_M[i] });
    if (d.el.length === 1) planos.push({ dur: D, el: React.createElement(d.el[0], { D, L: idioma }), trans: d.trans });
    else {
      const a = Math.round(D * (d.corte ?? 0.5));
      planos.push({ dur: a, el: React.createElement(d.el[0], { D: a, L: idioma }), trans: d.trans });
      planos.push({ dur: D - a, el: React.createElement(d.el[1], { D: D - a, L: idioma }), trans: { tipo: "cortina", d: 16 } });
    }
    t += D;
  });
  let v = 0;
  const audios = durs.map((d, i) => { const a = v; v += d + PAUSA; return a; });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Montaje planos={planos} />
      <HudSupervivencia marcas={marcas} idioma={idioma} lugar={idioma === "es" ? "LONDRES · 1348" : "LONDON · 1348"} hasta={t - fps * 4} />
      {voz && durs.map((d, i) => <Sequence key={i} from={audios[i]} durationInFrames={d + 2}><Audio src={staticFile(`${voz}/b${String(i + 1).padStart(2, "0")}_${idioma}.wav`)} /></Sequence>)}
      {musica && <Audio src={staticFile(musica)} volume={0.09} loop />}
    </AbsoluteFill>
  );
};
