// anselmo01 · EL RESTO (1:48 → 14:26). Sigue la MISMA toma del minuto 1: el taller de adobe es el mundo y la mesa se arma de verdad
// a medida que avanzan los pasos (la tarima entera en el piso → los clavos cortados → las tablas salen enteras → la cubierta pegada
// aparece en la pared → la bisagra con su palo de escoba → la ménsula → la tarabilla → el aceite de gris a miel → al atardecer, abierta
// con los platos). Entre ventana y ventana del avatar: el mundo, la toma real (LTX o foto con empuje) y las piezas NUEVAS de cada paso.
// Entradas al avatar = cortina de aserrín; salidas = portal a lo que sigue (o la mirilla del nudo que crece). Todo clavado a la voz.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, MESA, V, screenOf, camSpeed, setKeys, win } from "./taller3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, CH, P, Portal, Receipt, Tag, at, e, ei, s } from "./lib";
import { Aserrin, Etiqueta, FotoVieja, MIN1_END, Mirilla, Nota, Pensado, Rayado, Sello, Tablita } from "./Min1";
import { Anillos, Botador, Brasa, Calendario, Calibrador, ClavoEspiral, Conteo, Crack, Desmorona, Despiece, Dientes, DosTercios, Escalera, Escuadra, GrisMiel, Lata, LuzRegla, PasoCartel, PrensaCunas, Quemadas, Reloj, Rendija, Repaso, SelloFuego, TarugoCanto, Triangulo, TraposFuego } from "./comps_rest";

export const FULL_END = 866.1;
export const FULL_FRAMES = Math.ceil(FULL_END * 30);
const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms > 110);

// at() con red: la frase del ASR o, si no aparece cerca, el segundo de la transcripción
const A = (ph: string, fb: number) => { try { const v = at(ph, fb - 4); return Math.abs(v - fb) < 4 ? v : fb; } catch { return fb; } };

// ---------------- cámara del resto (se suma a la del minuto 1) ----------------
const K = (t: number, p: V, l: V, fov = 40, arc?: number) => ({ t, p, l, fov, arc });
const TA = PT.tarima, BA = PT.banco, BI = PT.bisagraL, ME = PT.mensula, TB = PT.tarabilla, MC = PT.mesaCerrada;
setKeys([
  K(110.5, [0.8, 1.3, 2.4], TA, 40, 0.2), K(114.5, [0.3, 0.9, 1.9], PT.sello, 34),                  // de la pila a la tarima del piso
  K(117.5, [0.25, 0.35, 1.35], PT.sello, 30), K(123.0, [0.15, 0.3, 1.25], PT.sello, 28), K(133.8, [0.1, 0.28, 1.15], PT.sello, 27), // el sello
  K(139.0, [3.6, 1.3, 0.9], PT.pila, 40), K(150.8, [3.3, 1.5, 1.1], PT.pila, 44),                    // la pila (la MB, déjela)
  K(155.4, [1.0, 1.6, 2.6], TA, 42), K(160.5, [0.8, 1.5, 2.4], TA, 42),
  K(179.4, [-0.6, 2.4, 1.9], TA, 40), K(184.3, [-0.5, 2.3, 1.6], TA, 40),                           // las tablas desde arriba
  K(188.7, [1.2, 1.1, 2.0], TA, 40), K(196.9, [0.9, 0.9, 1.7], TA, 38),                             // paso 2
  K(206.7, [0.6, 0.6, 1.6], [-0.6, 0.05, 0.7], 36), K(212.6, [0.5, 0.55, 1.5], [-0.6, 0.05, 0.7], 34), // los clavos se cortan
  K(219.0, [0.0, 0.7, 1.8], TA, 36), K(222.4, [-0.1, 0.65, 1.7], TA, 34),
  K(227.5, [1.2, 1.4, 2.4], [-0.2, 0.4, 0.2], 44), K(231.0, [1.8, 1.5, 1.4], [1.0, 0.8, -1.5], 44, 0.15), // las tablas salen enteras y vuelan
  K(242.5, [-1.6, 1.7, -0.3], BA, 40), K(246.4, [-1.5, 1.6, -0.4], BA, 40),
  K(258.0, [-1.0, 1.3, -0.9], [-1.3, 0.92, -1.55], 34), K(262.6, [-1.05, 1.25, -1.0], [-1.3, 0.92, -1.55], 33), // el cepillo
  K(267.8, [-1.6, 2.0, 0.0], BA, 42), K(275.4, [-1.7, 1.9, -0.2], BA, 42),
  K(285.3, [-2.4, 1.4, -0.6], BA, 38), K(297.5, [-2.2, 1.3, -0.8], BA, 36),
  K(303.4, [-1.4, 1.5, -0.3], BA, 40), K(308.6, [-1.3, 1.45, -0.4], BA, 40),
  K(325.5, [-1.6, 2.8, -1.2], BA, 40), K(332.7, [-1.6, 2.6, -1.1], BA, 40),                         // despiece, de arriba
  K(332.8, [0.6, 1.75, -1.0], [1.55, 0.78, -2.5], 40), K(338.6, [0.55, 1.72, -1.05], [1.55, 0.78, -2.5], 40), // (mirilla) la mesa con 4 platos
  K(338.7, [-0.9, 1.6, 0.2], BA, 40), K(342.7, [-1.0, 1.5, 0.0], BA, 40),                           // paso 4
  K(353.4, [-1.6, 1.9, -0.1], BA, 42), K(363.0, [-1.5, 1.8, -0.2], BA, 42),
  K(366.6, [-2.6, 1.6, 0.4], BA, 44), K(375.5, [-2.4, 1.5, 0.2], BA, 44),
  K(382.9, [0.0, 2.2, 1.5], [0.0, 0.0, -0.5], 44), K(392.9, [0.1, 2.1, 1.3], [0.0, 0.0, -0.5], 44),
  K(404.9, [0.3, 1.5, 1.8], [-0.4, 0.3, 0.0], 42), K(411.8, [0.2, 1.4, 1.6], [-0.4, 0.3, 0.0], 42),
  K(421.9, [1.55, 1.2, -0.6], [1.55, 1.05, -2.8], 42), K(428.8, [1.6, 1.15, -0.8], [1.55, 1.05, -2.8], 40), // paso 5: la cubierta ya en la pared
  K(437.4, [0.9, 1.4, -0.5], MC, 42), K(441.5, [1.1, 1.35, -0.7], MC, 42),
  K(441.6, [0.6, 0.6, 1.8], [-0.6, 0.0, 0.7], 36), K(443.5, [0.55, 0.58, 1.7], [-0.6, 0.0, 0.7], 35), // el patín
  K(448.2, [0.95, 0.62, -2.2], [1.25, 0.76, -2.76], 32), K(461.4, [1.0, 0.66, -2.3], [1.25, 0.76, -2.76], 30), // la bisagra en rayos X
  K(469.1, [1.3, 0.8, -1.9], BI, 34), K(478.2, [1.2, 0.75, -2.0], BI, 33),
  K(487.9, [0.9, 0.7, -2.0], BI, 33), K(492.6, [0.92, 0.68, -2.1], BI, 32),
  K(497.4, [0.95, 0.62, -2.2], BI, 30), K(502.0, [1.0, 0.6, -2.3], BI, 30),                         // entra el palo de escoba
  K(516.0, [0.6, 1.4, -0.7], [1.55, 0.9, -2.7], 42), K(522.0, [0.8, 1.3, -0.9], [1.55, 0.8, -2.7], 42), K(527.3, [2.7, 1.0, -1.5], [1.55, 0.5, -2.6], 40), // paso 6
  K(531.5, [2.6, 1.0, -1.6], ME, 40), K(543.7, [2.5, 0.9, -1.8], ME, 40),
  K(556.9, [2.7, 1.1, -1.4], ME, 38), K(564.6, [2.75, 1.15, -1.3], ME, 39), K(571.5, [2.6, 1.1, -1.5], ME, 40), // la ménsula aparece y gira
  K(579.5, [2.4, 1.4, -0.9], PT.mesa, 40), K(587.2, [2.3, 1.35, -1.0], PT.mesa, 40),
  K(587.3, [1.55, 1.5, -1.2], TB, 38), K(593.2, [1.6, 1.45, -1.6], TB, 34), K(597.0, [1.62, 1.42, -2.1], TB, 30), K(608.1, [1.58, 1.4, -2.2], TB, 28), // paso 7: la tarabilla
  K(612.5, [1.55, 1.2, -0.7], MC, 40), K(620.0, [1.5, 1.15, -0.9], MC, 40),
  K(629.3, [1.0, 1.25, -1.3], MC, 38), K(641.5, [2.0, 1.2, -1.4], MC, 38),                          // gris → miel
  K(667.9, [0.3, 1.3, -1.2], [0.3, 1.0, -2.94], 40), K(676.2, [0.4, 1.2, -1.5], [0.3, 1.0, -2.94], 40), // la pared
  K(699.0, [-0.4, 1.7, 0.6], BA, 42), K(720.7, [-0.7, 1.6, 0.2], BA, 42),
  K(720.8, [0.95, 0.62, -2.2], BI, 32), K(726.9, [1.0, 0.66, -2.3], BI, 30),
  K(732.0, [-1.2, 1.5, -0.5], BA, 40), K(740.3, [-1.3, 1.4, -0.6], BA, 40),
  K(740.4, [2.4, 1.0, -1.6], ME, 40), K(744.8, [2.3, 1.0, -1.7], ME, 40),
  K(748.7, [0.4, 1.5, -0.5], MC, 44), K(774.1, [0.7, 1.4, -0.9], MC, 44),                           // la cuenta
  K(787.2, [0.2, 1.8, 4.8], [0, 1.1, -1.5], 44), K(794.2, [1.0, 1.7, 4.0], [0, 1.1, -1.5], 44),     // el fin de semana: el taller entero
  K(798.5, [1.55, 1.3, 0.2], MC, 44), K(829.2, [1.6, 1.25, -0.3], MC, 44),                          // el repaso
  K(839.1, [3.4, 1.4, 0.9], PT.pila, 40), K(844.7, [3.5, 1.3, 0.7], PT.pila, 40),                   // la pregunta, frente a la pila
  K(858.7, [0.55, 1.5, -0.55], [1.55, 1.0, -2.7], 40), K(866.2, [-0.5, 1.9, 3.5], [1.2, 0.9, -2.5], 44), // atardecer: la mesa abierta, nos alejamos
]);

// ---------------- la mesa se arma a lo largo del video ----------------
const worldAt = (t: number): WorldProps => ({
  t,
  nails: win(t, 210.2, 213.0), explode: win(t, 227.9, 231.0),
  selloGlow: win(t, 116, 118) * (1 - win(t, 150, 151)),
  dusk: win(t, 855, 859),
  mesa: {
    build: 2 * win(t, 416.9, 418.5) + win(t, 500.7, 502.0) + win(t, 557.0, 558.6) + win(t, 597.0, 598.4),
    dowel: win(t, 500.9, 502.0),
    open: win(t, 520.3, 521.8) * (1 - win(t, 589.0, 590.6)) + win(t, 852, 854.5),
    arm: win(t, 566.9, 568.2) * (1 - win(t, 588.6, 589.4)) + win(t, 853, 855),
    latch: 1 - win(t, 605.4, 606.0) + win(t, 608.5, 609.1) - win(t, 612, 613) + win(t, 851, 852),
    oil: 0.33 * win(t, 622, 627) + 0.33 * win(t, 633.5, 635.5) + 0.34 * win(t, 637, 640),
    glowHinge: win(t, 448.3, 449) * (1 - win(t, 457, 457.4)) + win(t, 497.5, 498) * (1 - win(t, 502, 502.3)) + win(t, 516.1, 516.6) * (1 - win(t, 518.8, 519.2)) + win(t, 720.8, 721.3) * (1 - win(t, 726.6, 727)),
    xray: 0.6 * win(t, 448.3, 449) * (1 - win(t, 456.8, 457.2)),
    plates: win(t, 855, 856.5),
  },
});
const World: React.FC<{ t: number; over?: Partial<WorldProps> }> = ({ t, over }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const w = worldAt(t);
  return <AbsoluteFill style={{ filter: v.bx + v.by > 2.5 ? `blur(${Math.min(7, (v.bx + v.by) * 0.45).toFixed(2)}px)` : undefined }}>
    <WorldRaw {...w} {...over} mesa={{ ...w.mesa, ...over?.mesa }} />
  </AbsoluteFill>;
};

// ---------------- avatar (preroll de 10 cuadros) ----------------
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

// ---------------- toma real: clip LTX si llegó, si no la foto con empuje lento ----------------
const Clip: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number] }> = ({ k, t, a, from = 0, z = [1.03, 1.1] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 8);
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} startFrom={s(from)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};
// achica una pieza alrededor de su propio punto (para dejarla al costado del avatar)
const Sc: React.FC<{ x: number; y: number; k: number; children: React.ReactNode }> = ({ x, y, k, children }) => <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: `${x}px ${y}px` }}>{children}</AbsoluteFill>;

// ---------------- la base de cada tramo sin avatar ----------------
// k = toma real (ca = segundo en que arrancó esa toma, para seguirla sin repetir); sin k = el mundo (dim = oscurecido bajo una pieza)
type Seg = { a: number; b: number; k?: string; ca?: number; from?: number; z?: [number, number]; dim?: number; dA?: number; over?: Partial<WorldProps> };
const SEGS: Seg[] = [
  { a: MIN1_END, b: 114.9 }, { a: 114.9, b: 117.7, k: "r_sello" },
  { a: 123.2, b: 133.9, dim: 0.55 },
  { a: 139.1, b: 150.9, dim: 0.5 },
  { a: 155.5, b: 160.6, dim: 0.45 }, { a: 160.6, b: 167.5, k: "r_mancha" },
  { a: 173.4, b: 179.5, k: "r_contar" }, { a: 179.5, b: 184.4, dim: 0.3 },
  { a: 188.8, b: 197.0 }, { a: 197.0, b: 202.3, k: "r_crack" },
  { a: 206.8, b: 212.7 }, { a: 212.7, b: 219.1, k: "r_cegueta" },
  { a: 222.4, b: 227.6, k: "r_cortar" }, { a: 227.6, b: 231.1 },
  { a: 234.6, b: 242.6, k: "r_botador", z: [1.02, 1.08] }, { a: 242.6, b: 246.5 },
  { a: 251.3, b: 258.1, k: "r_iman", ca: 246.9 }, { a: 258.1, b: 262.7 },
  { a: 267.9, b: 275.5, dim: 0.45 }, { a: 275.5, b: 280.2, k: "r_cepillo" },
  { a: 285.4, b: 297.6, dim: 0.55, dA: 293.8 },
  { a: 303.5, b: 308.7, dim: 0.5 }, { a: 308.7, b: 315.4, k: "r_contraluz" },
  { a: 319.1, b: 321.9, k: "r_contraluz", from: 6.7 }, { a: 321.9, b: 325.6, k: "r_serrucho" }, { a: 325.6, b: 332.8, dim: 0.45 },
  { a: 338.7, b: 342.7 }, { a: 342.7, b: 349.3, k: "r_tarugos" },
  { a: 353.5, b: 363.1, dim: 0.5 },
  { a: 366.7, b: 375.6 }, { a: 375.6, b: 378.3, k: "r_tiras" },
  { a: 383.0, b: 393.0, dim: 0.5 },
  { a: 399.0, b: 405.0, k: "r_gotas" }, { a: 405.0, b: 411.9, dim: 0.35 },
  { a: 416.9, b: 422.0, k: "r_rasqueta" }, { a: 422.0, b: 428.9 },
  { a: 432.5, b: 437.5, k: "r_fierro" }, { a: 437.5, b: 441.6, dim: 0.45 }, { a: 441.6, b: 443.5 },
  { a: 448.3, b: 461.5, dim: 0.5, dA: -457.0 },
  { a: 465.7, b: 469.2, k: "r_formon" }, { a: 469.2, b: 478.3, dim: 0.5 },
  { a: 482.8, b: 488.0, k: "r_broca" }, { a: 488.0, b: 492.7, dim: 0.5 },
  { a: 497.5, b: 502.1, dim: 0.4 }, { a: 502.1, b: 510.4, k: "r_cera" },
  { a: 516.1, b: 527.4 },
  { a: 531.6, b: 543.8, dim: 0.5 },
  { a: 548.6, b: 557.0, k: "r_mediamadera" }, { a: 557.0, b: 560.1 },
  { a: 564.7, b: 575.5, dim: 0.5, dA: -571.4 },
  { a: 579.6, b: 587.3, dim: 0.5 }, { a: 587.3, b: 593.3 },
  { a: 597.1, b: 608.2 },
  { a: 612.6, b: 620.1 }, { a: 620.1, b: 623.7, k: "r_aceite" },
  { a: 629.4, b: 641.6, dim: 0.3 },
  { a: 647.8, b: 658.9, k: "r_trapos" },
  { a: 664.3, b: 668.0, k: "r_tendido", ca: 659.3 }, { a: 668.0, b: 676.3, dim: 0.45, dA: -669.5 },
  { a: 681.5, b: 686.0, k: "r_taquete", ca: 676.8 }, { a: 686.0, b: 694.5, k: "r_atornillar" },
  { a: 699.1, b: 709.7, dim: 0.5, dA: -702.7 },
  { a: 715.5, b: 720.8, dim: 0.5 }, { a: 720.8, b: 727.0 },
  { a: 732.1, b: 740.4 }, { a: 740.4, b: 744.9 },
  { a: 748.8, b: 758.9, dim: 0.5 },
  { a: 763.6, b: 774.2, dim: 0.5 }, { a: 774.2, b: 777.4, k: "r_tienda" },
  { a: 783.4, b: 787.3, k: "r_nietos" }, { a: 787.3, b: 794.3, dim: 0.4 },
  { a: 798.6, b: 811.5, dim: 0.45, dA: -803.6 },
  { a: 815.9, b: 829.3, dim: 0.45 },
  { a: 835.4, b: 839.2, k: "r_calle" }, { a: 839.2, b: 844.8 },
  { a: 848.9, b: 855.3, k: "r_pasador" }, { a: 855.3, b: 858.8, k: "r_atardecer" }, { a: 858.8, b: FULL_END + 0.2 },
];
// dA > 0: el oscurecido se va en dA; dA < 0: llega en |dA|
const dimOf = (sg: Seg, t: number) => !sg.dim ? 0 : !sg.dA ? sg.dim : sg.dA > 0 ? sg.dim * (1 - e(t, sg.dA - 0.3, sg.dA)) : sg.dim * e(t, -sg.dA - 0.3, -sg.dA);
const Base: React.FC<{ sg: Seg; t: number }> = ({ sg, t }) => sg.k
  ? <Clip k={sg.k} t={t} a={sg.ca ?? sg.a} from={sg.from} z={sg.z} />
  : <><World t={t} over={sg.over} />{sg.dim ? <AbsoluteFill style={{ background: `rgba(12,7,3,${dimOf(sg, t)})` }} /> : null}</>;
const segAt = (t: number) => SEGS.find((q) => t >= q.a && t < q.b);

// ventanas del avatar: qué asoma por la mirilla del nudo (grow = la mirilla crece y ES la toma que sigue)
type Mir = { at: number; out: number; grow?: boolean; k?: string; ca?: number; over?: Partial<WorldProps> };
const MIR: Record<number, Mir> = {
  117.7: { at: 118.3, out: 123.0 },
  219.1: { at: 219.6, out: 222.2 },
  246.5: { at: 246.9, out: 251.3, grow: true, k: "r_iman" },
  280.2: { at: 281.9, out: 285.2, k: "r_regla" },
  332.8: { at: 333.3, out: 338.5, over: { mesa: { build: 5, open: 1, arm: 1, latch: 1, oil: 1, plates: 1 } } },
  527.4: { at: 529.9, out: 531.4, k: "r_mensula" },
  560.1: { at: 560.4, out: 564.5 },
  593.3: { at: 593.8, out: 597.0 },
  608.2: { at: 610.3, out: 612.4, k: "r_ventana" },
  658.9: { at: 659.3, out: 664.3, grow: true, k: "r_tendido" },
  676.3: { at: 676.8, out: 681.5, grow: true, k: "r_taquete" },
  709.7: { at: 710.1, out: 715.3, k: "r_anillos" },
};

const R7 = (a: number[]) => ["la tarima con sello HT, nunca la MB", "los clavos no se sacan: se cortan", "mismo grueso · los cantos contra la luz", "la prensa de dos cuñas", "bisagra de dientes + palo de escoba", "la ménsula que gira, a ⅔ del fondo", "tarabilla, linaza y trapos extendidos"].map((txt, i) => ({ at: a[i], txt }));
const SUN = "#d8402c";

export const Rest: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  if (t < MIN1_END - 0.001) return null;
  const L: React.ReactNode[] = [];
  const aw = WIN.find((w) => t >= w.ms && t < w.me);

  // ---- base ----
  if (aw) {
    L.push(<Avatar key="av" t={t} />);
    const m = MIR[aw.ms];
    if (m) L.push(<Mirilla key={"mi" + aw.ms} t={t} at={m.at} out={m.grow ? 1e9 : m.out} grow={m.grow ? aw.me - 0.45 : undefined}>
      {m.k ? <Clip k={m.k} t={t} a={m.ca ?? m.at} z={[1.0, 1.06]} /> : <World t={t} over={m.over} />}</Mirilla>);
    // salida por portal a lo que sigue (si la mirilla no crece)
    const r = m?.grow ? 0 : ei(t, aw.me - 0.55, aw.me), nx = segAt(aw.me + 0.01);
    if (r > 0 && nx) L.push(<Portal key="po" x={1380} y={560} r={r}><Base sg={nx} t={t} /></Portal>);
  } else {
    const sg = segAt(t);
    if (sg) L.push(<Base key={"b" + sg.a} sg={sg} t={t} />);
  }
  // aserrín al entrar a cada ventana del avatar y entre dos bases pegadas
  WIN.forEach((w) => { if (Math.abs(t - w.ms) < 0.4) L.push(<Aserrin key={"aw" + w.ms} t={t} mid={w.ms} w={0.3} />); });
  SEGS.forEach((q, i) => { const n = SEGS[i + 1]; if (n && Math.abs(q.b - n.a) < 0.01 && Math.abs(t - q.b) < 0.4) L.push(<Aserrin key={"as" + i} t={t} mid={q.b} w={0.3} />); });

  const O = (k: string, el: React.ReactElement) => L.push(React.cloneElement(el, { key: k }));
  const tag = (k: string, q: V, a: number, out: number, text: string, sub?: string, dx = 220, dy = -200) => { if (t > a - 0.2 && t < out + 0.4) { const p = screenOf(t, q); O(k, <Tag t={t} at={a} x={p.x} y={p.y} dx={dx} dy={dy} text={text} sub={sub} col={CH.maiz} out={out} size={56} />); } };

  // ======================= PASO 1 · escoger la tarima =======================
  O("p1", <PasoCartel t={t} at={MIN1_END} out={113.9} n={1} title="escoger la tarima" titleAt={A("escoger la tarima", 108.6)} />);
  O("eq", <Rayado t={t} at={A("se equivoca", 112.4)} out={114.7} x={960} y={900} text="agarran la primera que encuentran" rot={-2} size={58} />);
  O("bs", <Rayado t={t} at={A("voltéela", 116.0)} out={117.6} x={1320} y={220} text="voltéela: búsquele el sello" rot={-4} />);
  O("vp", <Rayado t={t} at={A("viajan entre paises", 120.4)} out={123.0} x={1450} y={190} text="las que viajan entre países" rot={-3} size={54} />);
  O("2l", <Rayado t={t} at={A("dos letras", 127.1)} out={129.5} x={960} y={130} text="lo que importa: dos letras" rot={-2} size={60} />);
  O("ht", <SelloFuego t={t} at={123.4} letters={A("dos letras", 127.1) + 0.5} verdict={A("horno", 131.6) + 0.3} out={133.7} x={960} y={540} code="HT" sub="CURADA CON CALOR, EN HORNO" />);
  O("lb", <Sello t={t} at={A("esa es la buena", 134.3)} text="LA BUENA ✓" x={1450} y={300} out={139.0} col={CH.nopal} size={90} />);
  O("cd", <Rayado t={t} at={A("en la cocina", 136.6)} out={139.0} x={1450} y={760} text="casa · cocina · donde sea" rot={3} size={54} />);
  O("mb", <SelloFuego t={t} at={139.3} letters={139.6} verdict={A("veneno", 142.6) + 0.2} out={150.6} x={960} y={480} code="MB" sub="FUMIGADA CON VENENO" />);
  O("nc", <Rayado t={t} at={A("no entra", 144.6)} out={149.6} x={960} y={950} text="esa no entra a mi casa" rot={-2} size={60} />);
  O("dj", <Sello t={t} at={A("dejela donde esta", 149.8)} text="DÉJELA" x={1450} y={240} out={150.8} col={SUN} size={100} />);
  O("ss", <Nota t={t} at={151.5} out={155.3} x={1460} y={360} lines={["sin sello =", "hecha aquí,", "sin tratar"]} rot={3} w={440} />);
  O("q1", <Quemadas t={t} out={160.3} x={960} y={540} rows={[{ at: 155.8, txt: "HT → sí" }, { at: A("esa si sirve", 157.6), txt: "sin sello → sí, revísela" }, { at: 158.8, txt: "MB → nunca", ok: false }]} />);
  O("tm", <Tag t={t} at={A("manchas oscuras", 163.6)} x={900} y={560} dx={-220} dy={-220} text="MANCHA DE ACEITE" col={CH.maiz} out={167.3} size={54} />);
  O("hr", <Rayado t={t} at={A("huele raro", 165.6)} out={167.3} x={1320} y={880} text="¿huele raro? no la quiera" rot={-3} />);
  O("hm", <Pensado t={t} at={A("huele a madera", 171.4)} out={173.2} x={1420} y={280} text="huele a madera, nada más" size={78} />);
  O("ct", <Rayado t={t} at={A("cuentele las tablas", 174.0)} out={177.5} x={960} y={150} text="cuéntele las tablas" rot={-3} />);
  O("co", <Conteo t={t} at={A("siete tablas", 177.2)} patines={A("los patines", 183.0)} out={184.2} y={850} />);
  O("12", <BigNum t={t} at={A("un metro con veinte", 185.6)} text="1,20 m" x={1450} y={420} size={170} col={CH.maiz} edge="#5a2a10" out={188.6} sub="Y LE SOBRA" />);

  // ======================= PASO 2 · desarmar =======================
  O("p2", <PasoCartel t={t} at={A("paso numero 2", 189.0)} out={194.9} n={2} title="desarmar sin romper" titleAt={190.3} />);
  O("en", <Rayado t={t} at={A("se enoja", 193.6)} out={196.8} x={960} y={900} text="aquí la gente se enoja" rot={2} />);
  O("ck", <Crack t={t} at={A("y crack", 199.0) + 0.25} out={202.1} x={960} y={600} />);
  O("ce", <Sc x={1500} y={480} k={0.75}><ClavoEspiral t={t} at={202.8} out={206.6} x={1500} y={480} /></Sc>);
  O("tp", <Nota t={t} at={A("el truco de mi papa", 206.8)} out={210.0} x={1300} y={330} lines={["El truco de mi papá:", "no pelearse", "con el clavo"]} rot={-3} w={560} />);
  O("lc", <Rayado t={t} at={A("lo corta", 211.6)} out={212.5} x={960} y={200} text="no lo saca: lo CORTA" rot={-4} size={84} />);
  O("sa", <Tag t={t} at={A("sin el arco", 214.6)} x={900} y={520} dx={-260} dy={-200} text="SIN EL ARCO" sub="NOMÁS LA HOJA" col={CH.maiz} out={218.9} size={54} />);
  O("tr", <Tag t={t} at={A("con un trapo", 216.3)} x={1200} y={650} dx={220} dy={150} text="UN TRAPO" sub="EN LA PUNTA" col={CH.maiz} out={218.9} size={54} />);
  O("rj", <Rayado t={t} at={A("por la rendijita", 220.6)} out={222.3} x={1450} y={170} text="por la rendijita" rot={-3} size={56} />);
  O("rl", <Reloj t={t} at={A("tres o cuatro minutos", 225.4)} out={227.4} x={1550} y={380} label="3-4 MIN" sub="POR TABLA" mins={4} />);
  O("se", <Rayado t={t} at={A("sale entera", 228.3)} out={230.9} x={960} y={170} text="sale entera, sin una astilla" rot={-2} />);
  O("pd", <Pensado t={t} at={A("el pedacito", 232.5)} out={234.4} x={1420} y={280} text="el pedacito → botador" size={76} />);
  O("bt", <Botador t={t} at={234.8} hit={A("golpe seco", 238.6) + 0.2} out={242.3} x={1420} y={520} />);
  O("sh", <Pensado t={t} at={A("le salva la herramienta", 244.0)} out={246.3} x={960} y={250} text="esto le salva la herramienta" size={88} />);
  O("im", <Rayado t={t} at={A("un iman", 247.2)} out={250.4} x={1450} y={170} text="un imán, de punta a punta" rot={-3} size={54} />);
  O("hc", <Tag t={t} at={A("se pega", 251.0)} x={960} y={560} dx={240} dy={-200} text="AHÍ QUEDÓ" sub="UN CLAVO" col={CH.maiz} out={253.6} size={58} />);
  O("fl", <Rayado t={t} at={A("se come el filo", 254.4)} out={257.9} x={960} y={900} text="se come el filo de su cepillo" rot={2} size={60} />);
  O("r2", <BigNum t={t} at={A("rompiendo dos", 259.0)} text="ROMPÍ 2" x={960} y={330} size={170} col={CH.maiz} edge="#5a2a10" out={260.0} sub="CEPILLOS" />);

  // ======================= PASO 3 · emparejar =======================
  O("p3", <PasoCartel t={t} at={A("paso numero 3", 260.2)} out={262.5} n={3} title="emparejar las tablas" titleAt={261.5} />);
  O("cb", <Sc x={1430} y={560} k={0.7}><Calibrador t={t} at={264.8} out={267.7} x={1430} y={560} vals={[{ at: 264.8, mm: 19 }, { at: A("trae 17", 266.6), mm: 17 }, { at: A("la otra 20", 267.4), mm: 20 }]} /></Sc>);
  O("es", <Escalera t={t} at={268.1} tip={A("como escalera", 272.4)} out={275.3} x={960} y={560} />);
  O("cm", <Tag t={t} at={A("cepillo de mano", 277.0)} x={900} y={520} dx={-240} dy={-200} text="CEPILLO DE MANO" col={CH.maiz} out={280.0} size={54} />);
  O("cl", <Rayado t={t} at={A("a contraluz", 279.4)} out={280.1} x={1300} y={880} text="a contraluz" rot={-3} />);
  O("cv", <Rayado t={t} at={A("contra la ventana", 284.0)} out={285.2} x={1450} y={170} text="contra la ventana" rot={-3} size={56} />);
  O("lr", <LuzRegla t={t} at={285.6} fix={A("17 milimetros", 290.6)} out={293.6} x={960} y={460} />);
  O("17", <BigNum t={t} at={A("17 milimetros", 290.6)} text="17 mm" x={960} y={890} size={120} col={CH.maiz} edge="#5a2a10" out={293.6} sub="LO QUE DA LA MÁS DELGADA" />);
  tag("cn", [-1.6, 0.9, -1.25], A("los cantos", 294.2), 297.4, "LOS CANTOS", "LAS ORILLAS LARGAS", -300, -170);
  O("eq9", <Sc x={1500} y={560} k={0.7}><Escuadra t={t} at={A("90 grados", 302.6)} out={304.8} x={1500} y={560} /></Sc>);
  O("rm", <Rendija t={t} at={A("una rendija", 305.6)} out={308.5} x={960} y={540} mode="medio" label="ahí se le mete la tortilla" />);
  O("rc", <Rendija t={t} at={A("no pasa luz", 313.2)} out={315.2} x={1420} y={760} mode="cierra" label="no pasa luz = ya quedó ✓" sc={0.8} />);
  O("rm2", <Rendija t={t} at={315.8} out={319.0} x={1420} y={760} mode="medio" label="luz en medio → cepille las puntas" sc={0.8} />);
  O("rp", <Rendija t={t} at={319.3} out={321.7} x={1350} y={820} mode="puntas" label="luz en las puntas → falta en medio" sc={0.55} />);
  O("78", <Rayado t={t} at={A("las 7 tablas", 322.6)} out={325.4} x={960} y={170} text="7 tablas × 80 cm" rot={-3} size={70} />);
  O("dp", <Despiece t={t} at={325.8} cotas={A("60 centimetros", 329.6)} out={332.6} x={960} y={560} />);
  O("4p", <Rayado t={t} at={A("4 platos", 333.6)} out={338.5} x={1450} y={170} text="4 platos + la jarra del agua" rot={-3} size={54} />);

  // ======================= PASO 4 · pegar con la prensa de cuñas =======================
  O("p4", <PasoCartel t={t} at={A("paso numero 4", 338.8)} out={342.5} n={4} title="pegar la cubierta" titleAt={340.2} />);
  O("cb2", <Tag t={t} at={A("cola blanca", 345.0)} x={760} y={640} dx={-220} dy={-200} text="COLA BLANCA" col={CH.maiz} out={349.1} size={54} />);
  O("tg", <Tag t={t} at={A("tarugos de madera", 346.6)} x={1150} y={560} dx={220} dy={-200} text="TARUGOS" sub="PARA QUE NO SE MUEVAN" col={CH.maiz} out={349.1} size={54} />);
  O("8m", <BigNum t={t} at={A("8 milimetros", 351.8)} text="8 mm" x={1450} y={400} size={170} col={CH.maiz} edge="#5a2a10" out={353.3} sub="PALITOS REDONDOS" />);
  O("tc", <TarugoCanto t={t} at={353.7} holes={A("dos agujeros", 354.6)} dowels={A("mete el tarugo", 359.6)} out={361.6} x={960} y={520} />);
  O("1h", <Reloj t={t} at={361.9} out={363.0} x={960} y={520} label="1 HORA" sub="BIEN APRETADAS" mins={60} />);
  O("ap", <Rayado t={t} at={363.3} out={366.5} x={1450} y={200} text="una hora, por lo menos" rot={-3} size={56} />);
  O("pl", <Etiqueta t={t} at={A("prensas largas", 369.6)} out={375.4} x={1300} y={90} top="PRENSA LARGA" $="$1,200" cross={A("yo no tengo", 373.5) + 0.2} />);
  O("cm2", <Rayado t={t} at={A("cuestan mas", 371.0)} out={375.4} x={700} y={880} text="cuestan más que toda la mesa" rot={-2} size={58} />);
  O("dt", <Rayado t={t} at={A("dos tiras", 376.6)} out={378.2} x={960} y={170} text="dos tiras en el piso" rot={-3} />);
  O("65", <BigNum t={t} at={A("65 centimetros", 381.0)} text="65 cm" x={1450} y={420} size={170} col={CH.maiz} edge="#5a2a10" out={382.8} sub="ENTRE TIRA Y TIRA" />);
  O("pc", <PrensaCunas t={t} at={383.2} hueco={A("un huequito", 386.3)} cunas={A("dos cunas", 389.6)} golpes={[1e9]} gotas={1e9} out={392.8} x={960} y={540} sc={0.9} />);
  O("ar", <Rayado t={t} at={A("al reves", 391.2)} out={392.8} x={1560} y={140} text="una contra la otra, al revés" rot={-3} size={50} />);
  { const g = A("golpecitos con el martillo", 394.4); O("pc2", <PrensaCunas t={t} at={393.1} hueco={0} cunas={0} golpes={[g, g + 0.6, g + 1.2, 396.6, 397.2, 397.8]} gotas={A("como gotitas", 400.8) - 2.4} out={398.9} x={1460} y={560} sc={0.55} />); }
  O("sñ", <Rayado t={t} at={A("esa es la senal", 402.6)} out={404.9} x={960} y={170} text="esa es la señal" rot={-3} size={70} />);
  O("ng", <Sello t={t} at={A("ni un golpe mas", 405.1)} text="¡NI UN GOLPE MÁS!" x={960} y={420} out={409.9} col={SUN} size={96} />);
  O("js", <Rayado t={t} at={A("queda seca", 409.0)} out={410.1} x={960} y={760} text="si no, la junta queda seca" rot={2} size={58} />);
  O("dr", <Rayado t={t} at={A("de retazo", 410.8)} out={411.8} x={960} y={620} text="dos cuñas de retazo" rot={-2} size={64} />);
  O("pt", <Etiqueta t={t} at={412.3} out={415.0} x={1450} y={110} top="PRENSA DE TIENDA" $="$1,000" cross={A("mil pesos", 414.0) + 0.2} />);
  O("tn", <Rayado t={t} at={A("toda la noche", 415.2)} out={416.7} x={1450} y={820} text="toda la noche" rot={-3} />);
  O("od", <Rayado t={t} at={A("al otro dia", 417.0)} out={421.8} x={960} y={170} text="al otro día: fuera la cola seca" rot={-2} size={60} />);

  // ======================= PASO 5 · la bisagra de madera =======================
  O("p5", <PasoCartel t={t} at={A("paso numero 5", 422.0)} out={425.0} n={5} title="la bisagra de madera" titleAt={423.4} />);
  O("gu", <Pensado t={t} at={A("mas le gusta", 425.8)} out={428.7} x={960} y={880} text="la que más le gusta a la gente" size={82} />);
  O("db", <Rayado t={t} at={A("tiene que doblarse", 429.6)} out={432.3} x={1450} y={200} text="tiene que doblarse" rot={-3} />);
  O("fi", <Quemadas t={t} out={437.3} x={1380} y={540} rows={[{ at: A("se afloja", 433.8), txt: "se afloja", ok: false }, { at: A("se oxida", 434.8), txt: "se oxida", ok: false }, { at: A("y rechina", 435.8), txt: "rechina", ok: false }]} />);
  O("en2", <Sello t={t} at={A("esta no", 437.5)} text="ÉSTA NO SE AFLOJA" x={1380} y={190} out={441.3} col={CH.maiz} size={64} />);
  O("ha", <FotoVieja t={t} at={A("las haciendas viejas", 440.0) - 1.2} out={441.3} k="r_hacienda" x={880} y={560} cap="la puerta de la hacienda" />);
  tag("pa", [-0.6, 0.0, 1.14], A("del patin", 441.8), 443.3, "EL PATÍN", "2 TIRAS DE 80 CM", 220, -220);
  O("un", <Nota t={t} at={A("una va atornillada", 446.4)} out={448.1} x={1460} y={360} lines={["una, a la pared", "otra, bajo", "la cubierta"]} rot={3} w={460} />);
  tag("2b", BI, A("dos bisagras", 454.6), 456.8, "2 BISAGRAS", "UNA DE CADA LADO", -220, -230);
  O("d1", <Dientes t={t} at={457.2} cotas={A("21 centimetros", 458.6)} out={461.3} x={960} y={520} />);
  O("d2", <Dientes t={t} at={461.6} cotas={0} corte={A("el de en medio", 464.6)} out={465.5} x={1490} y={520} sc={0.75} />);
  O("sf", <Tag t={t} at={465.9} x={1100} y={480} dx={-120} dy={-260} text="SERRUCHO Y FORMÓN" col={CH.maiz} out={469.0} size={54} />);
  O("d3", <Dientes t={t} at={469.4} corte={468.0} junta={A("entrelaza", 475.6)} out={478.1} x={960} y={520} />);
  O("dl", <Rayado t={t} at={A("lo delicado", 479.4)} out={482.6} x={1450} y={200} text="ahora, lo delicado" rot={-3} />);
  O("bp", <Rayado t={t} at={A("broca de pala", 489.0) - 5.6} out={487.8} x={560} y={960} text="broca de pala: un solo agujero" rot={-2} size={58} />);
  O("d4", <Dientes t={t} at={488.2} corte={480} junta={480} broca={A("22 milimetros", 490.6) - 0.6} out={492.5} x={960} y={520} />);
  O("sa2", <Sello t={t} at={A("un solo agujero", 493.0)} text="UN SOLO AGUJERO" x={1450} y={300} out={497.3} col={CH.maiz} size={74} />);
  O("dc", <Rayado t={t} at={A("derechito", 494.6)} out={497.3} x={1450} y={760} text="derechito: los 3 alineados" rot={3} size={50} />);
  O("qp", <Pensado t={t} at={A("y que perno", 499.3)} out={500.6} x={960} y={200} text="¿y qué perno?" size={96} />);
  O("d5", <Dientes t={t} at={497.7} corte={480} junta={480} broca={480} palo={A("un palo de escoba", 500.7)} out={501.9} x={960} y={560} />);
  O("22", <BigNum t={t} at={A("justo 22", 503.6)} text="22 mm" x={520} y={300} size={150} col={CH.maiz} edge="#5a2a10" out={506.6} sub="JUSTO EL PALO DE ESCOBA" />);
  O("cv2", <Tag t={t} at={A("cera de vela", 505.6)} x={1100} y={560} dx={220} dy={-200} text="CERA DE VELA" sub="Y A GOLPECITOS" col={CH.maiz} out={510.2} size={54} />);
  O("q5", <Quemadas t={t} out={515.9} x={1430} y={560} size={50} rows={[{ at: A("no se oxida nunca", 512.0), txt: "no se oxida nunca" }, { at: A("no rechina", 513.2), txt: "no rechina" }, { at: A("cambia el palo", 515.0), txt: "¿se afloja? otro palo" }]} />);
  O("yy", <Rayado t={t} at={516.3} out={518.8} x={960} y={900} text="y quedó nueva" rot={-2} />);

  // ======================= PASO 6 · la ménsula =======================
  O("p6", <PasoCartel t={t} at={A("paso numero 6", 519.0)} out={521.9} n={6} title="la patita que sale sola" titleAt={520.2} />);
  O("ag", <Rayado t={t} at={A("que la aguante", 523.6)} out={525.8} x={960} y={170} text="algo que la aguante abierta" rot={-3} />);
  O("et", <Sello t={t} at={A("estorba", 526.8)} text="ESTORBA" x={1300} y={700} out={527.3} col={SUN} size={100} />);
  O("mn", <Rayado t={t} at={A("una mensula", 530.4)} out={531.5} x={1450} y={170} text="la ménsula: se abre como puerta" rot={-3} size={50} />);
  O("tri", <Triangulo t={t} at={532.0} p45={A("parada de 45", 536.8)} p40={A("acostada de 40", 539.6)} pdiag={A("en diagonal", 542.4)} out={543.6} x={900} y={520} />);
  O("mm", <Rayado t={t} at={A("a media madera", 547.0)} out={548.4} x={1450} y={200} text="a media madera" rot={-3} />);
  O("mg", <Tag t={t} at={A("la mitad del grueso", 549.8)} x={960} y={520} dx={240} dy={-200} text="LA MITAD" sub="DEL GRUESO" col={CH.maiz} out={553.5} size={56} />);
  O("tco", <Tag t={t} at={A("un tarugo y cola", 554.8)} x={900} y={600} dx={-240} dy={160} text="TARUGO + COLA" col={CH.maiz} out={556.8} size={54} />);
  tag("gt", ME, 557.3, 559.9, "GIRA SOBRE", "DOS TARUGOS", 220, -200);
  O("pr", <Rayado t={t} at={A("puerta de rancho", 563.2)} out={564.5} x={1450} y={170} text="como puerta de rancho" rot={-3} />);
  tag("90", ME, A("a 90 grados", 570.0), 571.3, "90°", "ABIERTA", -200, 150);
  O("dt1", <DosTercios t={t} at={571.8} out={575.3} x={900} y={560} />);
  O("64", <BigNum t={t} at={A("llega a 40", 578.6)} text="60 → 40" x={1450} y={420} size={140} col={CH.maiz} edge="#5a2a10" out={579.4} sub="DOS TERCIOS" />);
  O("dt2", <DosTercios t={t} at={579.8} menos={A("cabecea", 582.8)} mas={A("ya no cierra", 586.2)} out={587.1} x={900} y={560} />);

  // ======================= PASO 7 · tarabilla y aceite =======================
  O("p7", <PasoCartel t={t} at={A("paso numero 7", 587.4)} out={590.2} n={7} title="la tarabilla y el aceite" titleAt={588.6} />);
  O("cr", <Rayado t={t} at={A("levantada contra la pared", 592.0)} out={593.1} x={960} y={900} text="cerrada, contra la pared" rot={-2} />);
  tag("tb", TB, 591.6, 593.1, "LA TARABILLA", undefined, 220, -160);
  O("tg2", <Rayado t={t} at={A("es la taravilla", 595.6)} out={597.0} x={1450} y={170} text="una tablita que gira" rot={-3} />);
  tag("10", TB, A("10 centimetros", 599.0), 603.0, "10 CM", "CON UN AGUJERO", 200, -150);
  tag("ta", TB, A("sobre un tarugo", 601.6), 605.2, "SOBRE UN TARUGO", "ARRIBA DE LA MESA", -260, 150);
  O("dm", <Rayado t={t} at={A("detiene la mesa", 606.6)} out={608.0} x={960} y={880} text="para un lado: la detiene" rot={-2} />);
  O("su", <Rayado t={t} at={A("la suelta", 609.6)} out={610.1} x={1450} y={170} text="para el otro: la suelta" rot={-3} size={54} />);
  O("vn", <Rayado t={t} at={A("las ventanas", 611.0)} out={612.4} x={1450} y={170} text="las ventanas de mi pueblo" rot={-3} size={54} />);
  O("ac", <Rayado t={t} at={A("el acabado", 614.6)} out={616.2} x={960} y={170} text="el acabado: aceite" rot={-3} />);
  O("nb", <Sello t={t} at={A("nada de barniz", 616.4)} text="NADA DE BARNIZ" x={960} y={500} out={619.9} col={SUN} size={96} />);
  O("pc3", <Rayado t={t} at={A("plato caliente", 618.6)} out={619.9} x={960} y={860} text="se pela con el plato caliente" rot={2} size={58} />);
  O("lt", <Lata t={t} at={620.2} cocido={A("del cocido", 621.8)} out={623.5} x={1550} y={560} />);
  O("15", <Reloj t={t} at={A("15 minutos", 627.4)} out={629.2} x={1460} y={440} label="15 MIN" sub="QUE SE LO TOME" mins={15} />);
  O("gm", <GrisMiel t={t} at={629.6} manos={[A("espera un dia", 632.4), A("otra mano", 634.6), A("tercera mano", 636.6)]} out={641.4} x={960} y={780} />);
  O("ns", <Sello t={t} at={A("esto es en serio", 643.4)} text="¡EN SERIO!" x={1450} y={280} out={647.6} col={SUN} size={100} />);
  O("ps", <Rayado t={t} at={A("prender solos", 645.6)} out={647.6} x={1450} y={760} text="se pueden prender solos" rot={3} size={56} />);
  O("tf", <TraposFuego t={t} at={648.2} fire={A("agarran fuego", 654.6)} out={658.6} x={500} y={520} />);
  L.push(<Brasa key="br" t={t} a={A("agarran fuego", 654.6)} b={658.7} />);
  O("qt", <Rayado t={t} at={A("no es cuento", 655.8)} out={658.6} x={1300} y={970} text="así se quemó el taller de un compañero" rot={-2} size={50} />);
  O("ex", <Rayado t={t} at={A("se extienden", 661.0)} out={663.7} x={1450} y={170} text="extendidos, al aire libre" rot={-3} size={54} />);
  O("qx", <Quemadas t={t} out={667.8} x={1300} y={760} size={52} rows={[{ at: 664.6, txt: "extendidos hasta que se pongan duros" }, { at: A("cubeta con agua", 666.6), txt: "o en una cubeta con agua" }]} />);

  // ======================= la pared · lo que sale mal =======================
  O("pa2", <Rayado t={t} at={A("a la pared", 668.2)} out={669.6} x={960} y={170} text="ahora, a la pared" rot={-3} size={70} />);
  O("dsm", <Desmorona t={t} at={669.8} crumble={A("se desmorona", 673.8)} out={676.1} x={960} y={500} />);
  O("en3", <Rayado t={t} at={A("de encino", 678.4)} out={680.9} x={1450} y={170} text="taquete de encino" rot={-3} />);
  O("ca", <Tag t={t} at={A("cal y arena", 680.0) + 1.7} x={960} y={560} dx={240} dy={-200} text="CAL + ARENA" sub="UN DÍA ENTERO" col={CH.maiz} out={683.4} size={56} />);
  O("nd", <Rayado t={t} at={A("ya no lo saca nadie", 684.4)} out={685.8} x={960} y={880} text="ya no lo saca nadie" rot={2} />);
  O("3p", <Tag t={t} at={A("tres pijas largas", 688.6)} x={900} y={540} dx={-240} dy={-200} text="3 PIJAS LARGAS" col={CH.maiz} out={690.6} size={54} />);
  O("75", <BigNum t={t} at={A("75 centimetros", 690.6)} text="75 cm" x={1450} y={330} size={160} col={CH.maiz} edge="#5a2a10" out={694.3} sub="ALTURA DE COMEDOR" />);
  O("lb2", <Rayado t={t} at={A("ladrillo o de bloc", 696.0)} out={698.9} x={1450} y={200} text="ladrillo o bloc: taquete normal" rot={-3} size={50} />);
  O("sm", <Pensado t={t} at={A("le puede salir mal", 700.6)} out={702.6} x={960} y={230} text="lo que puede salir mal" size={96} />);
  O("an1", <Anillos t={t} at={702.9} teja={A("como una teja", 704.4)} alt={1e9} out={709.5} x={960} y={540} />);
  O("st", <Rayado t={t} at={A("una sonrisa o una tristeza", 712.6)} out={715.3} x={1450} y={170} text="¿sonrisa o tristeza?" rot={-3} />);
  O("an2", <Anillos t={t} at={715.6} teja={714.0} alt={A("alternadas", 716.4)} out={720.5} x={960} y={540} />);
  O("nl", <Sello t={t} at={A("no la lije", 721.6)} text="NO LA LIJE" x={1350} y={300} out={723.3} col={SUN} size={90} />);
  O("mc", <Rayado t={t} at={A("mas cera", 724.4)} out={726.8} x={960} y={880} text="más cera, y a meterla otra vez" rot={-2} size={58} />);
  O("as2", <Rayado t={t} at={A("se asienta sola", 730.7)} out={731.9} x={1450} y={200} text="se asienta sola" rot={-3} />);
  O("rj2", <Nota t={t} at={A("se le raja", 732.6)} out={737.4} x={1380} y={400} lines={["¿se rajó?", "no la tire:", "tarabilla o tacos"]} rot={-3} w={480} />);
  O("nt", <BigNum t={t} at={A("no se tira nada", 738.6)} text="AQUÍ NO SE TIRA NADA" x={960} y={860} size={96} col={CH.maiz} edge="#5a2a10" out={740.2} />);
  O("cb3", <Rayado t={t} at={A("si la mesa cabecea", 740.6)} out={744.7} x={960} y={170} text="¿cabecea? la ménsula, a ⅔" rot={-3} />);
  O("ml", <Rayado t={t} at={A("un poquito mas larga", 746.4)} out={748.6} x={1450} y={200} text="otra, un poquito más larga" rot={-3} size={52} />);

  // ======================= la cuenta · el tiempo · el repaso =======================
  O("lcu", <Rayado t={t} at={A("ahora la cuenta", 748.9)} out={753.5} x={960} y={140} text="la cuenta" rot={-3} size={84} />);
  const rows = [{ at: A("la tarima regalada", 753.9), item: "Tarima (regalada)", $: 0 }, { at: A("la cola blanca", 755.7), item: "Cola blanca", $: 60 }, { at: A("los tarugos", 758.2), item: "Tarugos", $: 30 },
    { at: A("el aceite de linaza", 759.7), item: "Linaza 1/4 L", $: 90 }, { at: A("lija y cera", 763.7), item: "Lija y cera", $: 30 }, { at: A("tres pijas", 766.0), item: "Pijas y cal", $: 25 }, { at: A("el palo de escoba", 768.7), item: "Palo de escoba", $: 0 }];
  O("90p", <Rayado t={t} at={A("90 pesos", 762.4)} out={764.6} x={1560} y={985} text="linaza: 90 pesos" rot={-3} />);
  O("rc2", <Receipt t={t} rows={rows} totalAt={A("235 pesos", 772.0)} x={1300} y={150} out={774.0} sc={1.4} title="LA MESA" cur="$" />);
  O("mel", <Etiqueta t={t} at={A("de melamina", 776.6) - 1.8} out={777.2} x={1350} y={90} top="MESA DE MELAMINA" $="$1,800–2,500" />);
  O("hi", <Rayado t={t} at={A("se le hincha", 781.6)} out={783.2} x={1450} y={200} text="a los 2 años se hincha" rot={-3} />);
  O("he", <Rayado t={t} at={A("sus nietos", 785.8)} out={787.1} x={960} y={900} text="se la heredan sus nietos" rot={-2} size={66} />);
  O("fs", <Rayado t={t} at={A("un fin de semana", 788.8)} out={794.1} x={960} y={140} text="un fin de semana" rot={-3} size={76} />);
  O("cal", <Calendario t={t} at={787.4} out={794.1} x={960} y={580} dias={[{ at: A("el sabado", 790.6), d: "SÁBADO", items: ["desarma", "cepilla", "pega con cuñas"] }, { at: 793.0, d: "DOMINGO", items: ["bisagra", "ménsula", "1ª mano de aceite"] }]} />);
  O("do", <Rayado t={t} at={794.6} out={798.4} x={1450} y={200} text="domingo: bisagra y ménsula" rot={-3} size={52} />);
  O("es2", <Rayado t={t} at={A("entre semana", 798.7)} out={800.8} x={960} y={150} text="entre semana: las otras 2 manos" rot={-3} size={60} />);
  O("dc2", <Rayado t={t} at={A("de corrido", 802.6)} out={803.6} x={960} y={150} text="los 7 pasos, de corrido" rot={-3} size={64} />);
  const r7 = R7([A("uno la tarima", 804.4), A("dos los clavos", 808.3), A("tres todas las tablas", 811.8), A("cuatro la prensa", 815.9), A("cinco la bisagra", 818.3), A("seis la mensula", 821.7), A("siete la taravilla", 825.1)]);
  O("rp1", <Repaso t={t} at={803.8} out={811.3} x={960} y={540} sc={0.82} items={r7} />);
  O("rp2", <Repaso t={t} at={815.9} out={829.1} x={960} y={540} sc={0.82} items={r7} />);

  // ======================= tarea · pregunta · próximo · cierre =======================
  O("ta2", <Tablita t={t} at={A("su tarea", 830.0)} out={835.2} x={1360} y={360} lines={["Tarea: voltee la tarima", "y búsquele el sello"]} rot={2} />);
  O("ne", <Rayado t={t} at={A("nada mas eso", 835.4)} out={839.0} x={600} y={960} text="nada más eso" rot={-3} size={70} />);
  O("pq", <Tablita t={t} at={A("cuenteme aqui abajo", 839.2)} out={844.6} x={880} y={330} lines={["¿De qué pueblo me escribe?", "¿Y qué haría con una tarima?"]} />);
  O("ab", <Rayado t={t} at={A("en los comentarios", 840.6)} out={844.6} x={880} y={900} text="cuénteme aquí abajo ↓" rot={-3} size={64} />);
  O("ll", <Rayado t={t} at={A("los leo todos", 845.6)} out={848.7} x={1450} y={200} text="yo los leo todos" rot={-3} />);
  O("px", <Rayado t={t} at={A("en el proximo video", 849.0)} out={855.0} x={1330} y={975} text="próximo video: el pasador que se traba solo" rot={-2} size={54} />);
  O("sr", <Sello t={t} at={A("sin un resorte", 857.6)} text="SIN RESORTE" x={1300} y={640} out={858.6} col={CH.maiz} size={90} />);
  O("fin", <Nota t={t} at={A("la madera buena", 859.6)} out={865.3} x={1360} y={380} lines={["La madera buena", "no se compra,", "se encuentra."]} rot={-3} w={560} />);
  O("an", <Rayado t={t} at={A("andele mijo", 863.8)} out={866.5} x={900} y={880} text="¡Ándele, mijo!" rot={-4} size={72} />);
  L.push(<AbsoluteFill key="fo" style={{ background: "#000", opacity: e(t, FULL_END - 0.9, FULL_END) }} />);

  return <AbsoluteFill style={{ background: "#0a0603" }}>{L}</AbsoluteFill>;
};
