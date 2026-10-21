// tialicha01 · EL RESTO (77 s → fin). El mismo hilo del minuto 1: la casa de adobe de Licha en corte, UNA cámara que vuela de un
// rincón a otro (cocina, fogón, mesita, hierbas, los diez jarritos, la recámara, el buró, el patio), y entre ventana y ventana del
// avatar las fotos/tomas de Licha HACIENDO lo que cuenta. Cada cena enciende su jarrito. Entradas y salidas del avatar con iris
// desde su cara, costuras con vaho, mundo → toma por portal. Piezas nuevas por minuto (piezas.tsx), todas clavadas a la voz.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, JARS, screenOf, camSpeed, setKeys, dropKeys, Key } from "./casa3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { Flash, LowerThird, P, Portal, Tag, Chips, at, e, ei, s } from "./lib";
import { MIN1_END, Escrito, Cinta, Tachada, Sello, Hora } from "./Min1";
import * as Q from "./piezas";

const LI = Q.LI;
const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type V = [number, number, number];
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.ms >= 77);
const avAt = (t: number) => WIN.find((w) => t >= w.ms && t < w.me);
export const END_T = 804.85; // voz 803,83 + 1 s de silencio
// frase → segundo (búsqueda desde un poco antes de donde cae; si la frase no está, el segundo medido)
const A = (ph: string, near: number) => { try { return at(ph, near - 2.5); } catch { return near; } };
const FACE = { x: 1350, y: 430 }; // la cara de Licha en el reel: centro de los iris

// ---------------- cámaras con nombre ----------------
type Cam = { p: V; l: V; fov?: number };
const C: Record<string, Cam> = {
  camaEnd: { p: [2.5, 1.5, 1.4], l: [2.55, 0.7, -1.6], fov: 42 },
  cama: { p: [2.0, 1.7, 1.9], l: [2.6, 0.8, -1.6], fov: 44 }, cama2: { p: [1.9, 1.62, 1.6], l: [2.6, 0.78, -1.6], fov: 42 },
  buro: { p: [3.6, 1.2, -1.15], l: [3.75, 0.8, -2.55], fov: 44 }, buro2: { p: [3.5, 1.28, -0.9], l: [3.75, 0.82, -2.55], fov: 46 },
  mesa: { p: [-0.95, 1.35, 0.75], l: [-1.35, 0.8, -0.5], fov: 40 }, mesa2: { p: [-1.0, 1.3, 0.6], l: [-1.35, 0.8, -0.5], fov: 37 },
  mesaT: { p: [-1.2, 1.95, 0.35], l: [-1.35, 0.78, -0.55], fov: 40 },
  fogon: { p: [-2.55, 1.45, -1.25], l: [-2.75, 0.95, -2.55], fov: 40 }, fogon2: { p: [-2.45, 1.52, -1.05], l: [-2.75, 0.95, -2.55], fov: 38 },
  fogonW: { p: [-1.4, 1.7, 0.6], l: [-2.75, 0.9, -2.3], fov: 44 },
  hierbas: { p: [-1.4, 1.85, -0.7], l: [-2.4, 2.2, -2.45], fov: 42 }, hierbas2: { p: [-1.65, 1.8, -0.95], l: [-2.4, 2.2, -2.45], fov: 40 },
  jarros: { p: [-1.93, 2.1, 1.25], l: [-1.93, 2.1, -2.86], fov: 46 }, jarros2: { p: [-1.93, 2.05, 0.95], l: [-1.93, 2.08, -2.86], fov: 46 },
  frente: { p: [0.6, 2.0, 3.7], l: [0.7, 0.7, -1.0], fov: 48 }, frente2: { p: [0.7, 1.95, 3.45], l: [1.2, 0.7, -1.0], fov: 46 },
  patio: { p: [0.3, 3.0, 10.8], l: [0.3, 1.4, -1.0], fov: 40 }, patio2: { p: [0.3, 2.8, 9.4], l: [0.3, 1.3, -1.0], fov: 40 },
  puerta: { p: [-0.9, 1.45, 1.3], l: [0.4, 1.0, -0.15], fov: 42 }, puerta2: { p: [-0.7, 1.4, 1.0], l: [0.4, 1.0, -0.15], fov: 40 },
};
JARS.forEach((q, i) => { C["j" + i] = { p: [q[0], 2.0, -1.75], l: [q[0], 2.05, q[2]], fov: 34 }; });

// ---------------- la línea de tiempo: partes de mundo (w) y fotos/tomas de Licha (c) entre ventanas del avatar ----------------
type Part = { a: number; b: number; c?: string; k0?: string; k1?: string; pt?: V; z?: [number, number] };
const w = (a: number, b: number, k0: string, k1: string, pt?: V): Part => ({ a, b, k0, k1, pt });
const c = (a: number, b: number, id: string, z?: [number, number]): Part => ({ a, b, c: id, z });
const PARTS: Part[] = [
  // promesa, quién es Licha, el rancho
  w(77.25, 82.07, "camaEnd", "j1"),
  w(86.21, 89.4, "mesaT", "mesa"), c(89.4, 92.2, "r_ropero"), w(92.2, 96.86, "frente", "frente2"),
  c(102.73, 107.4, "n_ninas"), w(107.4, 112.6, "fogonW", "fogon"), w(112.6, 116.12, "mesa", "mesa2"),
  // a las nueve, todos dormidos · la campanita · quédate hasta el final
  c(121.05, 125.5, "r_perros"), c(125.5, 129.6, "r_saluda"), c(129.6, 134.6, "r_campanita"), c(134.6, 138.3, "r_silla"),
  w(138.3, 141.4, "mesaT", "mesa2"), c(141.4, 145.6, "r_hastaelfinal"), w(145.6, 149.25, "frente", "fogonW"),
  // el sueño cambia: la culpa, a los 30 y a los 60
  w(152.94, 158.0, "cama", "cama2"), c(158.0, 165.65, "r_madruga"),
  w(171.63, 176.5, "mesaT", "mesa"), c(176.5, 181.4, "n_tamales3"), c(181.4, 183.48, "r_tamal_noche"),
  // las tres reglas
  w(188.92, 194.4, "hierbas", "jarros"), c(194.4, 199.0, "r_oracion"), c(199.0, 201.96, "r_agruras"),
  c(207.31, 211.0, "r_poquito"), w(211.0, 217.0, "mesaT", "mesa"), w(217.0, 220.28, "mesa", "mesa2"),
  // cena 1 · atole de avena
  c(225.0, 228.2, "r_tibio"), w(228.2, 231.6, "jarros", "j0", JARS[0]), c(231.6, 235.07, "r_atole_olla"),
  c(239.16, 247.2, "r_atole_jarrito"), c(247.2, 253.03, "r_avena"),
  // cena 2 · la leche tibia
  c(256.59, 262.4, "r_piloncillo"), w(262.4, 264.7, "mesa", "mesa2"), w(264.7, 267.63, "jarros", "j1"),
  w(272.67, 279.9, "buro", "buro2", PT.vaso), c(279.9, 283.5, "n_abuela"),
  c(289.14, 295.0, "r_leche_hora"), w(295.0, 301.96, "buro2", "cama"),
  // cena 3 · el caldito
  c(305.63, 311.0, "r_leche_olla"), w(311.0, 314.1, "mesa2", "mesaT"), w(314.1, 317.65, "jarros", "j2"),
  c(321.81, 327.4, "r_caldito"), w(327.4, 332.3, "fogon", "fogon2"),
  w(336.8, 340.4, "mesaT", "mesa2", PT.mesa), c(340.4, 345.6, "r_bano"), w(345.6, 348.74, "mesa", "mesa2"),
  // cena 4 · calabacitas con queso y elote (+ rinde para cuatro)
  c(353.21, 358.0, "r_patio_calabaza"), c(358.0, 362.6, "r_picar_calabacita"), c(362.6, 364.34, "r_queso"),
  w(369.93, 374.4, "mesaT", "mesa", PT.mesa), c(374.4, 380.2, "r_serrano"), w(380.2, 385.0, "cama", "cama2"),
  c(385.0, 391.9, "n_mercado_bolsa"), c(391.9, 395.8, "r_quesadilla_sobra"), w(395.8, 401.7, "fogonW", "fogon2"),
  w(401.7, 407.1, "patio2", "frente"),
  // cena 5 · frijoles de la olla
  w(407.1, 411.3, "jarros", "j4", JARS[4]), c(411.3, 414.5, "r_tacita_frijol"),
  c(418.64, 422.7, "r_epazote"), w(422.7, 427.6, "fogon", "fogon2"), w(427.6, 431.88, "mesa", "mesaT"),
  w(436.22, 440.7, "mesa2", "mesa"), w(440.7, 445.0, "jarros", "jarros2"), w(445.0, 447.48, "patio", "patio2"),
  // cuando éramos niñas: los cuentos, la vela
  w(453.04, 455.3, "mesaT", "mesa2"), w(455.3, 459.0, "puerta", "puerta2", PT.puerta), c(459.0, 465.56, "n_cuentos"),
  c(470.04, 472.4, "n_vela"), w(472.4, 479.6, "mesa", "mesa2"), c(479.6, 481.92, "n_tele_cel"),
  // cena 6 · quesadilla de flor de calabaza
  c(486.08, 489.7, "r_apaga"), w(489.7, 493.0, "jarros", "j5", JARS[5]), c(493.0, 497.44, "r_comal_quesadilla"),
  c(503.05, 504.6, "r_flor"), w(504.6, 512.2, "fogonW", "fogon"), c(512.2, 516.75, "r_sin_aceite"),
  // cena 7 · huevo con nopalitos
  w(521.31, 524.4, "jarros", "j6", JARS[6]), c(524.4, 529.5, "r_nopalera"), c(529.5, 532.66, "r_espinas"),
  c(537.08, 541.2, "r_huevo"), w(541.2, 546.68, "cama", "cama2"),
  // cena 8 · plátano macho al comal
  w(550.35, 552.5, "fogon2", "fogon"), w(552.5, 556.6, "jarros", "j7", JARS[7]), c(556.6, 562.38, "r_platano_comal"),
  c(565.82, 568.4, "r_platano_abre"), w(568.4, 576.5, "mesaT", "mesa2"),
  // cena 9 · arroz con leche
  w(581.74, 585.5, "mesa2", "mesa"), w(585.5, 589.4, "jarros", "j8", JARS[8]), c(589.4, 593.49, "r_arroz_leche"),
  w(598.45, 604.3, "mesaT", "mesa2", PT.mesa), c(604.3, 611.25, "r_tacita_arroz"),
  // cena 10 · tecito de manzanilla con hojas de naranjo
  w(616.0, 618.2, "mesa", "mesa2"), w(618.2, 622.4, "jarros", "j9", JARS[9]), c(622.4, 626.38, "r_naranjo"),
  c(632.22, 638.4, "r_manzanilla"), w(638.4, 642.3, "hierbas", "hierbas2"), w(642.3, 645.85, "buro", "buro2"),
  // las tres cosas que nunca cenaba
  c(650.31, 656.9, "r_medicinas"), w(656.9, 661.46, "mesaT", "mesa"),
  c(666.42, 670.0, "r_cafe_no"), w(670.0, 674.4, "fogonW", "fogon2"), c(674.4, 676.15, "n_cafe_cola"),
  w(680.77, 684.2, "fogon", "fogon2", PT.fogon), c(684.2, 688.0, "n_pozole"), w(688.0, 694.23, "frente", "patio2"),
  c(698.19, 702.9, "n_tio"), w(702.9, 709.02, "cama", "cama2"),
  // la semana, el mercado
  w(713.36, 716.4, "mesa2", "mesaT", PT.mesa), c(716.4, 725.49, "r_menu"),
  c(730.23, 736.0, "n_semana"), w(736.0, 740.8, "buro", "buro2"), c(740.8, 742.49, "r_mercado"),
  // de corazón: el médico · la tarea · la pregunta · el próximo · buenas noches
  w(747.45, 753.8, "cama2", "cama"), c(753.8, 757.08, "r_medico"),
  c(761.54, 768.0, "r_tarea"), w(768.0, 771.0, "buro2", "buro"), c(771.0, 774.8, "r_comentarios"),
  c(779.65, 785.9, "n_caldo_res"), w(785.9, 790.44, "hierbas", "hierbas2"),
  c(794.91, 798.2, "r_hierbas"), c(798.2, 801.6, "r_buenas_noches"), w(801.6, END_T, "frente", "patio"),
];
// llaves de cámara: inicio y fin de cada parte de mundo (los saltos caen siempre detrás del avatar, de una foto o del vaho)
dropKeys(MIN1_END + 0.01, 1e9);
setKeys(PARTS.filter((p) => !p.c).flatMap((p, i, arr) => {
  const prev = arr[i - 1], t0 = prev && Math.abs(prev.b - p.a) < 1e-6 ? p.a + 0.001 : p.a;
  const k0 = C[p.k0!], k1 = C[p.k1!];
  return [{ t: t0, p: k0.p, l: k0.l, fov: k0.fov }, { t: p.b - 0.001, p: k1.p, l: k1.l, fov: k1.fov }] as Key[];
}));
const partIdx = (t: number) => { let k = -1; for (let i = 0; i < PARTS.length; i++) if (PARTS[i].a <= t) k = i; return k; };
const partAt = (t: number) => PARTS[partIdx(t)];

// ---------------- cenas: cada una enciende su jarrito ----------------
const CEN = [228.3, 264.8, 314.2, 349.2, 407.2, 489.8, 521.4, 552.6, 585.6, 618.3];
const CENAS: [string, string][] = [
  ["Atole de avena", "CON CANELA"], ["La leche tibia", "DE LA ABUELA"], ["Caldito de pollo", "CON CALABACITA"], ["Calabacitas", "CON QUESO Y ELOTE"],
  ["Frijoles de la olla", "EN TACITA"], ["Quesadilla de flor", "DE CALABAZA, AL COMAL"], ["Huevo con nopalitos", "DE LA NOPALERA"],
  ["Plátano al comal", "CON CANELA"], ["Arroz con leche", "EN TACITA"], ["Tecito de manzanilla", "CON HOJAS DE NARANJO"],
];

const worldAt = (t: number): WorldProps => {
  const k0 = partAt(t)?.k0 ?? "";
  const noche = /^(cama|buro)/.test(k0) || t > 797 ? 1 : /^(patio|frente)/.test(k0) ? 0.75 : 0.4;
  const cur = CEN.reduce((acc, a, i) => (t >= a - 0.1 ? i : acc), -1);
  return {
    t, hora: noche,
    fire: 0.55 + 0.35 * (/^fogon/.test(k0) ? 1 : 0) + (t >= 680.77 && t < 684.2 ? 0.6 : 0),
    vela: t >= 472.4 && t < 479.6 ? 1 - 0.75 * e(t, A("la luz bajita", 476.1), 479.4) : t > 801.6 ? 1 - e(t, 802.6, 803.6) : 1,
    velaLuz: /^mesa/.test(k0) ? 0.3 : 0.65,
    lamp: /^(cama|buro)/.test(k0) ? 0.85 * (t > 801 ? 0 : 1) : 0.35,
    steam: 0.85,
    jarOn: JARS.map((_, i) => (t >= 77.25 && t < 82.1 && i === 1) ? e(t, A("la cena numero dos", 79), A("la cena numero dos", 79) + 0.4) : i === cur ? e(t, CEN[i] - 0.1, CEN[i] + 0.4) : CEN[i] < t ? 0.45 : 0),
    path: t >= 801.6 ? ei(t, 801.7, 803.8) : 0,
    cena: { pan: /^mesa/.test(k0) ? 1 : 0, recal: t >= 171.63 && t < 176.5 ? 1 : 0, vaso: t >= 272.67 && t < 279.9 ? ei(t, 274.0, 275.0) * 0.6 : 0 },
    ring: 0, relojGlow: 0,
    hundida: /^cama/.test(k0) ? 1 : 0,
    roof: 1, cortina: 0.8,
  };
};

const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mbr" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
// avatar: sólo la ventana viva se monta (preroll de 10 cuadros)
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  if (!REEL) return <AbsoluteFill style={{ background: "#000" }}><Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>;
  const wn = WIN.find((x) => t >= x.ms - 0.4 && t < x.me + 0.1);
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{wn && (
    <Sequence key={wn.ms} from={s(wn.ms) - 10} durationInFrames={s(wn.me - wn.ms) + 12} layout="none">
      <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(wn.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>)}</AbsoluteFill>;
};
// toma de Licha: el clip LTX si ya llegó (arranca medio segundo antes, para los iris), si no la foto con empuje lento
const Clip: React.FC<{ k: string; t: number; a: number; z?: [number, number] }> = ({ k, t, a, z = [1.03, 1.1] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  const inner = CLIPS.has(k)
    ? <Sequence from={s(a) - 15} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    : <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><AbsoluteFill style={{ transform: `scale(${sc})` }}>{inner}</AbsoluteFill></AbsoluteFill>;
};
const sc = (t: number, q: V) => screenOf(t, q);
// dibuja la parte i en el segundo t (fuera de su tramo, el mundo queda quieto en su borde)
const PartView: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const p = PARTS[i];
  if (!p) return null;
  if (p.c) { const prev = PARTS[i - 1], portaled = prev && prev.pt && Math.abs(prev.b - p.a) < 1e-6; return <Clip k={p.c} t={t} a={portaled ? p.a - 0.7 : p.a} z={p.z} />; }
  return <World t={Math.min(Math.max(t, p.a + 0.002), p.b - 0.002)} />;
};

// ---------------- las piezas, cada una clavada a su palabra ----------------
const Ov = (t: number): React.ReactNode[] => {
  const L: React.ReactNode[] = [];
  const on = (a: number, b: number) => t >= a - 0.4 && t < b + 0.6;
  const add = (a: number, b: number, f: () => React.ReactNode) => { if (on(a, b)) L.push(<React.Fragment key={"o" + a.toFixed(2) + "_" + L.length}>{f()}</React.Fragment>); };
  const J = (i: number) => sc(t, [JARS[i][0], JARS[i][1] + 0.36, JARS[i][2]]);

  // ===== minuto 2 · la promesa, Licha, el rancho, la campanita =====
  add(77.25, 82.07, () => { const p = J(1), a = A("la cena numero dos", 79); return <><Tag t={t} at={a + 0.3} x={p.x} y={p.y} dx={-260} dy={-170} text="CENA Nº 2" sub="DA CORAJE" col={LI.maiz} out={81.9} size={58} />
    <Escrito t={t} at={A("coraje", 80.2)} out={81.9} x={1300} y={880} text="¡¿cómo que no?!" size={92} col={LI.crema} rot={4} /></>; });
  add(86.21, 89.4, () => <Q.Nunca3 t={t} at={A("las tres cosas", 86.4)} ats={[1e9, 1e9, 1e9]} labels={["", "", ""]} out={89.2} y={680} />);
  add(89.4, 92.2, () => <Escrito t={t} at={A("en el ropero", 91.1)} out={92.0} x={620} y={880} text="…la tiene tu tío en el ropero" size={78} col={LI.maiz} />);
  add(92.2, 102.73, () => <LowerThird t={t} at={A("yo soy alicia", 93.7)} out={102.4} name="LICHA" l2="63 AÑOS · LA HERMANA MENOR DE CHAYO" l2at={A("63 anos", 97.4)} />);
  add(102.73, 107.4, () => <Q.MapaMich t={t} at={A("patzcuaro", 105.5) - 0.4} out={107.2} x={1380} y={430} />);
  add(107.4, 116.12, () => { const f = sc(t, PT.fogon), m = sc(t, PT.mesa); return <>{t < 112.6 && <Tag t={t} at={A("el comal", 111.1)} x={f.x} y={f.y} dx={240} dy={-200} text="EL COMAL" sub="TODAVÍA TIBIO" col={LI.maiz} out={112.4} size={56} />}
    {t >= 112.6 && <Tag t={t} at={A("una vela", 112.8)} x={m.x + 60} y={m.y - 80} dx={260} dy={-170} text="LA VELA" sub="EN LA MESA" col={LI.crema} out={115.9} size={56} />}
    {t >= 112.6 && <Tachada t={t} at={A("no habia reloj", 114.8)} cut={A("reloj de pared", 115.1) + 0.3} out={115.95} x={560} y={240} text="reloj de pared" size={84} col={LI.crema} />}</>; });
  add(116.12, 121.05, () => <><Escrito t={t} at={A("tocaban la oracion", 117.5)} out={120.0} x={520} y={250} text="la campana de la oración" size={72} col={LI.lila} />
    <Hora t={t} at={A("a las siete", 120.0)} out={120.9} x={420} y={600} label="7:00 p.m." h={7} /></>);
  add(121.05, 125.5, () => <><Hora t={t} at={A("a las nueve", 121.3)} out={125.3} x={360} y={230} label="9:00 p.m." h={9} /><Escrito t={t} at={A("hasta los perros", 124.2)} out={125.3} x={1300} y={900} text="…hasta los perros" size={84} /></>);
  add(129.6, 134.6, () => <Q.Campanita t={t} at={A("suscribete", 129.7) - 0.25} bell={A("la campanita", 130.6)} out={134.4} x={960} y={860} />);
  add(134.6, 138.3, () => <Escrito t={t} at={A("gracias mija", 136.3)} out={138.1} x={620} y={860} text="gracias, mija, de corazón" size={88} col={LI.crema} />);
  add(138.3, 141.4, () => <Escrito t={t} at={A("siempre hay lugar", 139.2)} out={141.2} x={960} y={230} text="siempre hay lugar para una más" size={86} col={LI.maiz} />);
  add(141.4, 149.25, () => <Q.Comentario t={t} at={A("te voy a preguntar", 142.9)} out={149.0} x={960} y={820} text="¿Qué te daban de cenar de niña?…" send={1e9} />);

  // ===== minuto 3 · el sueño cambia, la culpa, a los 30 y a los 60 =====
  add(152.94, 158.0, () => <Q.Culpa t={t} at={A("una culpa", 153.6) - 0.2} lift={A("despues de los 60", 155.5) + 0.6} out={157.8} x={960} y={520} />);
  add(152.94, 158.0, () => <Escrito t={t} at={A("el sueno cambia", 156.7)} out={157.8} x={960} y={880} text="después de los 60, el sueño cambia" size={80} col={LI.crema} />);
  add(158.0, 165.65, () => <Q.Hipnograma t={t} at={158.1} b={A("mas ligerito", 162.5) - 0.3} out={165.4} x={960} y={520} />);
  add(165.65, 171.63, () => <><Tachada t={t} at={A("estes enferma", 169.0) - 0.1} cut={A("estes enferma", 169.0) + 0.5} out={171.4} x={520} y={260} text="enferma" size={100} col={LI.crema} pre="no estás" />
    <Sello t={t} at={A("es la edad", 171.5) - 0.1} text="ES LA EDAD" x={520} y={520} out={171.5} /></>);
  add(171.63, 176.5, () => <Q.Balanza t={t} at={A("lo que cenas", 173.9)} tip={A("pesa mas", 174.5)} out={176.3} x={1380} y={420} l="a los 30" r="a los 60" />);
  add(176.5, 183.48, () => <Q.Tamales t={t} a={A("a los 30 te comias", 176.6)} b={A("a los 60 un tamal", 181.0)} out={183.3} />);
  add(183.48, 188.92, () => <Hora t={t} at={A("la madrugada", 184.9)} out={188.6} x={420} y={260} label="3:00 a.m." h={3} />);

  // ===== minuto 4 · las tres reglas =====
  const RG = [A("se cena temprano", 195.5), A("se cena poquito", 208.4), A("se cena tibio", 221.2)];
  add(188.92, 194.4, () => <Q.Reglas t={t} at={A("las tres reglas", 190.2)} ats={[1e9, 1e9, 1e9]} labels={["", "", ""]} hl={-1} out={194.2} x={1280} y={560} />);
  add(194.4, 199.0, () => <><Q.Reglas t={t} at={194.4} ats={RG} labels={["temprano", "poquito", "tibio"]} hl={0} out={198.8} x={560} y={300} />
    <Q.RelojArco t={t} at={A("dos o tres horas", 196.9) - 0.3} arc={A("dos o tres horas", 196.9)} out={198.8} x={1450} y={560} /></>);
  add(199.0, 201.96, () => <Q.Estomago t={t} at={A("estomago lleno", 201.0) - 0.8} up={A("estomago lleno", 201.0) + 0.3} out={201.8} x={1450} y={520} />);
  add(201.96, 207.31, () => <Cinta t={t} at={A("te dan agruras", 203.8)} out={207.0} x={520} y={260} text="AGRURAS" col={LI.rojo} size={96} />);
  add(207.31, 211.0, () => <Q.Reglas t={t} at={207.35} ats={RG} labels={["temprano", "poquito", "tibio"]} hl={1} out={210.8} x={560} y={300} />);
  add(211.0, 217.0, () => <Q.Platos3 t={t} ats={[A("como rey", 213.0), A("principe", 213.9), A("cena como mendigo", 215.4)]} out={216.8} y={560} />);
  add(217.0, 220.28, () => { const m = sc(t, PT.mesa); return <Tag t={t} at={A("una taza", 218.4)} x={m.x + 40} y={m.y - 60} dx={300} dy={-200} text="UNA TAZA" sub="Y UN PLATO CHICO" col={LI.maiz} out={220.1} size={60} />; });
  add(220.28, 225.0, () => <><Q.Reglas t={t} at={220.35} ats={RG} labels={["temprano", "poquito", "tibio"]} hl={2} out={222.6} x={560} y={300} />
    <Q.Tibiometro t={t} at={222.7} stop={A("tibio como para", 225.1) - 0.6} out={227.9} x={560} y={760} /></>);
  add(225.0, 228.2, () => <Escrito t={t} at={A("con las dos manos", 226.7)} out={228.0} x={1300} y={240} text="con las dos manos" size={88} col={LI.crema} />);

  // ===== las diez cenas: tarjeta al encenderse su jarrito =====
  CEN.forEach((a, i) => add(a - 0.1, a + 5, () => <Q.CenaCard t={t} at={a + 0.25} out={a + 4.6} n={i + 1} title={CENAS[i][0]} sub={CENAS[i][1]} x={i === 3 ? 520 : 600} y={i === 3 ? 300 : 830} />));

  // ===== minuto 4-5 · cena 1: el atole =====
  add(231.6, 235.07, () => <Tag t={t} at={A("una raja de canela", 233.8)} x={1180} y={560} dx={260} dy={-220} text="RAJA DE CANELA" col={LI.maiz} out={234.9} size={56} />);
  add(235.07, 239.16, () => <Q.Dicho t={t} at={A("decia que el atole", 236.9)} out={239.0} x={560} y={300} text="el atole asienta el estómago" />);
  add(239.16, 247.2, () => <Q.Pizarra t={t} at={239.3} out={247.0} x={1380} y={400} rows={[{ at: A("tiene fibra", 240.8), text: "fibra: llena sin pesar" }, { at: A("faciles de digerir", 245.6), text: "fácil de digerir" }]} />);
  const RC1 = [A("media taza de avena", 248.7), A("2 tazas de agua", 250.2), A("la raja de canela", 252.0), A("fuego bajito", 253.8), A("con piloncillo", 257.8)];
  add(247.2, 256.59, () => <Q.Receta t={t} at={A("como la hago yo", 247.4)} out={256.4} x={t < 253.03 ? 1420 : 520} y={480} title="Atole de avena" rows={[{ at: RC1[0], text: "½ taza de avena" }, { at: RC1[1], text: "2 tazas agua o leche" }, { at: RC1[2], text: "1 raja de canela" }, { at: RC1[3], text: "fuego bajito · 10 min" }]} />);
  add(256.59, 262.4, () => <Q.Cucharadita t={t} at={A("con piloncillo", 257.8) - 0.2} cross={A("el azucar de noche", 260.7)} out={262.2} x={1300} y={560} />);
  add(262.4, 264.7, () => <Escrito t={t} at={A("atole tibio", 262.6)} out={264.5} x={960} y={240} text="atole tibio, cuerpo quieto" size={96} col={LI.maiz} />);

  // ===== minuto 5 · cena 2: la leche tibia =====
  add(267.63, 272.67, () => <Sello t={t} at={A("da sueno", 271.9)} text="¿DA SUEÑO?" x={540} y={300} out={272.5} col={LI.maiz} />);
  add(272.67, 279.9, () => <Q.Lupa t={t} at={A("triptofano", 274.2) - 0.1} dot={A("tan poquito", 278.1)} out={279.7} x={1380} y={500} />);
  add(279.9, 283.5, () => <Escrito t={t} at={A("por que mi abuela", 281.6)} out={283.3} x={960} y={880} text="¿por qué dormía como piedra?" size={88} col={LI.crema} />);
  add(283.5, 289.14, () => <Q.TresMismos t={t} ats={[A("el mismo vaso", 285.8), A("a la misma hora", 286.8), A("en la misma silla", 287.9)]} out={288.9} y={780} />);
  add(289.14, 295.0, () => <Q.Noches7 t={t} at={A("lo repites", 294.7) - 4.2} out={294.8} y={760} />);
  add(295.0, 301.96, () => <Sello t={t} at={A("todos los dias", 299.6)} text="TODOS LOS DÍAS · MISMA HORA" x={960} y={300} out={301.8} size={84} />);
  add(301.96, 311.0, () => <Q.Receta t={t} at={A("yo la hago", 302.3)} out={310.8} x={t < 305.63 ? 520 : 1420} y={480} title="Leche tibia" rows={[{ at: A("un vaso de leche", 303.0), text: "1 vaso de leche" }, { at: A("una pizca de canela", 304.3), text: "1 pizca de canela" }, { at: A("sin que hierva", 306.2), text: "tibia: sin que hierva" }]} />);
  add(305.63, 311.0, () => <Escrito t={t} at={A("el atole de arroz", 308.9)} out={310.8} x={560} y={880} text="o atole de arroz" size={80} col={LI.maiz} />);
  add(311.0, 314.1, () => <Escrito t={t} at={A("lo que cuenta es el ritual", 311.2)} out={313.9} x={960} y={240} text="el ritual, no el vaso" size={100} col={LI.crema} />);

  // ===== minuto 6 · cena 3: el caldito =====
  add(317.65, 321.81, () => <Tachada t={t} at={A("su pieza grande", 319.7)} cut={A("sus tortillas", 320.7) + 0.2} out={321.6} x={520} y={280} text="pieza grande + tortillas" size={70} col={LI.crema} pre="no" />);
  add(321.81, 327.4, () => <Q.TazaCae t={t} at={321.9} out={327.2} x={1420} y={480} items={[{ at: A("no mas el caldo", 323.0), text: "caldo", col: "#f2d98a" }, { at: A("calabacita picadita", 324.2), text: "calabacita", col: "#a8d070" }, { at: A("una cucharada de arroz", 325.7), text: "1 cda arroz", col: "#fbf8f0" }]} />);
  add(327.4, 332.3, () => <Q.Dicho t={t} at={A("el caldo de noche", 328.5)} out={331.3} x={1300} y={260} text="calienta el cuerpo por dentro" rot={3} />);
  add(331.4, 336.8, () => <Q.Pizarra t={t} at={A("lo que se sabe hoy", 331.4)} out={336.6} x={560} y={330} rows={[{ at: A("algo tibio y ligero", 332.7), text: "tibio y ligero: relaja" }]} />);
  add(336.8, 340.4, () => <Q.TazaPlato t={t} at={336.85} cross={A("plato hondo", 337.9) + 0.2} out={340.2} x={960} y={560} />);
  add(340.4, 345.6, () => <><Hora t={t} at={A("a las 3 de la manana", 340.6)} out={345.4} x={380} y={230} label="3:00 a.m." h={3} /><Escrito t={t} at={A("despues de los 60", 344.5)} out={345.4} x={1300} y={900} text="y más después de los 60" size={80} /></>);
  add(345.6, 348.74, () => <Q.Check3 t={t} ats={[A("el caldito", 346.2), A("temprano", 347.0), A("en taza chica", 347.8)]} labels={["el caldito", "temprano", "taza chica"]} out={348.6} x={1400} y={480} />);

  // ===== minuto 6 · cena 4: calabacitas =====
  add(353.21, 358.0, () => <Escrito t={t} at={A("se daba sola", 356.5)} out={357.8} x={960} y={900} text="se daba sola en el patio" size={88} col={LI.crema} />);
  add(358.0, 362.6, () => <Q.Cubitos t={t} at={A("en cubitos", 359.5)} out={362.4} x={1450} y={500} />);
  add(362.6, 364.34, () => <Tag t={t} at={A("el queso hasta el final", 363.2)} x={960} y={620} dx={300} dy={-260} text="EL QUESO" sub="HASTA EL FINAL" col={LI.maiz} out={364.2} size={60} />);
  add(364.34, 369.93, () => <Q.Gota t={t} at={A("casi pura agua", 368.2) - 0.3} out={369.8} x={480} y={480} />);
  add(369.93, 374.4, () => { const m = sc(t, PT.mesa); return <Tag t={t} at={A("algo de proteina", 371.1)} x={m.x + 30} y={m.y - 60} dx={-320} dy={-230} text="PROTEÍNA" sub="NO TE DESPIERTAS CON HAMBRE" col={LI.maiz} out={374.2} size={60} />; });
  add(374.4, 380.2, () => <Q.ChileNo t={t} at={A("el serrano", 377.5) - 0.3} cross={A("de noche sin picante", 379.6) + 0.4} out={380.0} x={1400} y={500} />);
  add(380.2, 385.0, () => <Cinta t={t} at={A("agrura seguras", 382.4)} out={384.8} x={960} y={300} text="AGRURAS SEGURAS" col={LI.rojo} size={100} />);
  add(385.0, 391.9, () => <Q.Rinde4 t={t} at={A("rinden para cuatro", 389.2) - 0.3} cheap={A("baratisimas", 390.3)} out={391.7} x={1300} y={500} />);
  add(391.9, 395.8, () => <Q.Dias2 t={t} at={A("el martes", 392.4)} b={A("el viernes", 394.9)} out={395.6} x={960} y={300} a1="MARTES" a2="calabacitas" b1="VIERNES" b2="quesadillas" />);
  add(395.8, 401.7, () => <Q.Dias2 t={t} at={A("un poquito de elote", 396.5)} b={A("a los frijoles", 398.2)} out={401.5} x={960} y={280} a1="SOBRA" a2="elote" b1="AL DÍA SIGUIENTE" b2="a los frijoles" />);
  add(401.7, 407.1, () => <Escrito t={t} at={A("no se tira nada", 402.3) - 0.4} out={406.9} x={960} y={250} text="en mi casa no se tira nada" size={96} col={LI.maiz} />);

  // ===== minuto 7 · cena 5: frijoles de la olla =====
  add(411.3, 414.5, () => <Tachada t={t} at={A("no refritos", 413.0)} cut={A("con manteca", 413.6) + 0.2} out={414.3} x={1300} y={260} text="refritos con manteca" size={76} col={LI.crema} />);
  add(414.5, 418.64, () => <Tag t={t} at={A("una ramita de epazote", 417.1)} x={500} y={620} dx={120} dy={-240} text="EPAZOTE" col={LI.verde} out={418.5} size={60} />);
  add(422.7, 427.6, () => <Q.Dicho t={t} at={A("la tradicion dice", 422.8)} out={427.4} x={1300} y={260} text="el epazote: que no caigan pesados" rot={2} />);
  add(427.6, 431.88, () => <Q.Pizarra t={t} at={427.7} out={431.7} x={1380} y={380} rows={[{ at: A("mucha fibra", 429.7), text: "mucha fibra" }, { at: A("llena bastante", 430.9), text: "llena bastante" }]} />);
  add(431.88, 436.22, () => <Cinta t={t} at={A("les da gases", 433.2)} out={436.0} x={520} y={280} text="…a veces, gases" col={LI.lila} size={84} />);
  add(436.22, 440.7, () => <Q.Check3 t={t} ats={[A("tacita chica", 438.0), A("bien cocidos", 439.1), A("y temprano", 439.9)]} labels={["tacita chica", "bien cocidos", "temprano"]} title="SI A TI TE PASA" out={440.5} x={1380} y={480} />);
  add(440.7, 445.0, () => <Q.Saltar t={t} at={A("saltate esta", 442.6) - 0.6} out={444.8} x={960} y={820} />);
  add(445.0, 447.48, () => <Escrito t={t} at={A("cuando eramos ninas", 446.0)} out={447.3} x={960} y={250} text="cuando éramos niñas…" size={100} col={LI.lila} />);

  // ===== minuto 7-8 · los cuentos, la vela, la luz =====
  add(447.48, 453.04, () => <><Tag t={t} at={A("chayo era la mayor", 447.8)} x={330} y={720} dx={60} dy={-240} text="CHAYO" sub="LA MAYOR" col={LI.maiz} out={452.8} size={56} /><Tag t={t} at={A("yo era la chiquita", 451.8)} x={640} y={760} dx={80} dy={-200} text="LICHA" sub="LA CHIQUITA" col={LI.lila} out={452.8} size={56} /></>);
  add(453.04, 455.3, () => { const m = sc(t, PT.mesa); return <Tag t={t} at={A("los jarritos en la mesa", 453.9)} x={m.x} y={m.y - 40} dx={260} dy={-200} text="LOS JARRITOS" col={LI.maiz} out={455.1} size={56} />; });
  add(455.3, 459.0, () => { const d = sc(t, PT.puerta); return <Tag t={t} at={A("su silla de tule", 459.4) - 1.6} x={d.x} y={d.y + 60} dx={260} dy={-160} text="LA SILLA DE TULE" sub="JUNTO A LA PUERTA" col={LI.crema} out={458.8} size={54} />; });
  add(459.0, 465.56, () => <Escrito t={t} at={A("nos contaba cuentos", 462.8)} out={465.4} x={960} y={900} text="nos contaba cuentos…" size={92} col={LI.crema} />);
  add(465.56, 470.04, () => <Q.VozBaja t={t} ats={[A("bajaba la voz", 467.8), A("y bajaba la voz", 468.8) + 0.2]} out={469.9} x={520} y={420} text="bajaba la voz" />);
  add(470.04, 472.4, () => <Escrito t={t} at={A("la vela se iba", 470.1)} out={472.2} x={960} y={880} text="y la vela se iba acabando" size={86} col={LI.maiz} />);
  add(472.4, 479.6, () => <Q.Perillas t={t} ats={[A("la luz bajita", 476.1), A("la voz bajita", 477.3), A("el estomago tranquilo", 478.4)]} labels={["la luz", "la voz", "la panza"]} out={479.4} x={1380} y={500} />);
  add(479.6, 486.08, () => <Q.SolCel t={t} at={A("del celular", 482.9)} out={485.9} x={t < 481.92 ? 1400 : 500} y={480} />);
  add(486.08, 489.7, () => <Hora t={t} at={A("apagaba todo", 487.9)} out={489.5} x={380} y={230} label="8:00 p.m." h={8} />);

  // ===== minuto 8-9 · cena 6: quesadilla de flor =====
  add(493.0, 503.05, () => <Q.Receta t={t} at={A("sin aceite", 494.0) - 0.4} out={502.8} x={t < 497.44 ? 1420 : 520} y={480} title="Quesadilla de flor" rows={[{ at: A("una tortilla de maiz", 494.9), text: "tortilla de maíz" }, { at: A("un poquito de queso", 496.4), text: "un poquito de queso" }, { at: A("la flor picadita", 497.7), text: "la flor picadita" }, { at: A("al comal hasta que", 499.1), text: "al comal, sin aceite" }]} />);
  add(503.05, 504.6, () => <Escrito t={t} at={503.1} out={504.4} x={960} y={880} text="antes de que se cerrara" size={84} col={LI.crema} />);
  add(504.6, 512.2, () => <Q.ArenaDos t={t} at={A("casi nunca es la tortilla", 506.9)} b={A("es el aceite", 508.8)} out={512.0} x={1300} y={480} />);
  add(512.2, 516.75, () => <Sello t={t} at={A("no freia nada", 512.9)} text="NADA FRITO PA' LA CENA" x={960} y={260} out={516.5} size={80} />);
  add(516.75, 521.31, () => <Escrito t={t} at={A("ponle dos", 519.4)} out={521.1} x={520} y={300} text="ponle dos… en el comal" size={80} col={LI.maiz} />);

  // ===== minuto 9 · cena 7: huevo con nopalitos =====
  add(524.4, 529.5, () => <Tag t={t} at={A("dos pencas tiernas", 528.1)} x={980} y={520} dx={300} dy={-220} text="2 PENCAS" sub="TIERNAS" col={LI.verde} out={529.3} size={60} />);
  add(529.5, 537.08, () => <Q.Receta t={t} at={A("un huevo", 533.0) - 0.3} out={536.9} x={t < 532.66 ? 1420 : 520} y={480} title="Huevo con nopalitos" rows={[{ at: A("un huevo", 533.0), text: "1 huevo" }, { at: A("los nopalitos", 533.8), text: "los nopalitos" }, { at: A("poquita cebolla", 534.9), text: "poquita cebolla" }, { at: A("alcomal", 536.2), text: "al comal" }]} />);
  add(537.08, 541.2, () => <Q.Pizarra t={t} at={537.2} out={541.0} x={1380} y={380} rows={[{ at: A("de las proteinas que mejor llenan", 538.9), text: "proteína que llena" }]} />);
  add(541.2, 546.68, () => <Q.Estomago t={t} at={A("a medianoche", 544.6) - 1.4} up={1e9} out={546.5} x={1400} y={500} />);
  add(541.2, 546.68, () => <Hora t={t} at={A("a medianoche", 544.6)} out={546.5} x={380} y={230} label="12:00 a.m." h={12} />);
  add(546.68, 552.5, () => <><Q.UnoNoTres t={t} at={A("un huevo mija", 547.0)} cross={A("no tres", 548.3) + 0.2} out={550.2} x={540} y={520} />
    {t >= 550.35 && <Cinta t={t} at={550.4} out={552.3} x={960} y={300} text="CHORIZO = GRASA PURA" col={LI.rojo} size={90} />}</>);

  // ===== minuto 9-10 · cena 8: plátano al comal =====
  add(556.6, 562.38, () => <Sello t={t} at={A("el premio de los domingos", 557.2)} text="EL PREMIO DEL DOMINGO" x={960} y={250} out={562.2} size={80} col={LI.maiz} />);
  add(565.82, 568.4, () => <Escrito t={t} at={A("dulce como cajeta", 566.7)} out={568.2} x={960} y={880} text="dulce como cajeta" size={100} col={LI.maiz} />);
  add(568.4, 576.5, () => <><Q.Minerales t={t} ats={[A("potasio", 570.7), A("magnesio", 571.4)]} out={574.6} x={1380} y={480} />
    {t >= 574.4 && <Tachada t={t} at={A("una pastilla para dormir", 575.2)} cut={A("para dormir", 575.8) + 0.3} out={576.3} x={960} y={300} text="pastilla para dormir" size={84} col={LI.crema} pre="no es una" />}</>);
  add(576.5, 585.5, () => <Q.Medio t={t} at={A("medio platano", 581.8)} out={585.3} x={t < 581.74 ? 500 : 1380} y={460} />);
  add(576.5, 581.74, () => <Chips t={t} at={A("dulce ligera", 578.8)} items={["dulce", "ligera", "sin azúcar de bolsa"]} out={581.5} y={820} />);

  // ===== minuto 10 · cena 9: arroz con leche =====
  add(589.4, 593.49, () => <Escrito t={t} at={A("cocido despacito", 591.4)} out={593.3} x={960} y={880} text="despacito, a fuego bajo" size={88} col={LI.crema} />);
  add(593.49, 598.45, () => <Tag t={t} at={A("se hacia el sabado", 595.6)} x={520} y={700} dx={40} dy={-260} text="EL SÁBADO" sub="Y ALCANZABA PA' LA SEMANA" col={LI.maiz} out={598.3} size={58} />);
  add(598.45, 604.3, () => <Q.Cucharadita t={t} at={A("lleva azucar", 600.7) - 0.3} cross={A("mucha azucar en la noche", 601.8)} out={604.1} x={1300} y={500} />);
  add(604.3, 611.25, () => <><Tag t={t} at={A("una tacita de cafe", 607.2)} x={960} y={600} dx={320} dy={-250} text="UNA TACITA DE CAFÉ" col={LI.maiz} out={611.0} size={60} />
    <Tachada t={t} at={A("no un plato hondo", 608.9)} cut={A("plato hondo", 609.4) + 0.3} out={611.0} x={560} y={880} text="plato hondo" size={80} col={LI.crema} pre="no un" /></>);
  add(611.25, 616.0, () => <Q.AzucarCanela t={t} at={A("menos ponle azucar", 611.3)} b={A("y mas canela", 615.0)} out={615.8} x={520} y={500} />);
  add(616.0, 618.2, () => <Escrito t={t} at={A("la canela engana", 616.3)} out={618.0} x={960} y={250} text="la canela engaña la boca" size={100} col={LI.maiz} />);

  // ===== minuto 10-11 · cena 10: la manzanilla =====
  add(622.4, 626.38, () => <Tag t={t} at={A("dos hojas de naranjo", 624.7)} x={900} y={420} dx={320} dy={-160} text="2 HOJAS DE NARANJO" sub="DEL PATIO" col={LI.verde} out={626.2} size={56} />);
  add(626.38, 632.22, () => <Escrito t={t} at={A("su cena de mendiga", 630.1)} out={632.0} x={520} y={300} text="«mi cena de mendiga»" size={84} col={LI.maiz} />);
  add(632.22, 638.4, () => <Q.Pizarra t={t} at={632.3} out={638.2} x={1380} y={380} rows={[{ at: A("de las hierbas mas usadas", 635.2), text: "de las más usadas" }, { at: A("para la noche", 637.6), text: "en todo el mundo" }]} />);
  add(638.4, 642.3, () => <Q.Estudios t={t} at={A("los estudios que hay", 638.6)} out={642.1} x={1340} y={520} />);
  add(642.3, 650.31, () => <Chips t={t} at={A("una taza tibia", 642.7)} items={["tibia", "sin cafeína", "a la misma hora"]} out={649.8} y={820} />);
  add(650.31, 656.9, () => <Q.Aviso t={t} at={A("si tomas medicinas", 651.3)} out={656.7} x={1200} y={300} title="SI TOMAS MEDICINAS" text="pregúntale a tu médico antes" />);

  // ===== minuto 11 · las tres que nunca cenaba =====
  const NU = [A("el cafe de olla", 661.7), A("la segunda nada de picante", 679.8), A("la tercera la del ropero", 694.6)];
  add(656.9, 661.46, () => <Q.Nunca3 t={t} at={A("las tres cosas", 657.8)} ats={[NU[0], 1e9, 1e9]} labels={["café de olla", "picante y grasa", "el traguito"]} out={661.3} y={640} />);
  add(661.46, 666.42, () => <Tachada t={t} at={A("ni uno", 663.1)} cut={A("aunque fuera", 663.9)} out={666.2} x={520} y={280} text="café de olla" size={96} col={LI.crema} pre="ni un" />);
  add(666.42, 674.4, () => <Q.Cafeina t={t} at={A("se queda horas", 668.0) - 0.3} b={A("a la medianoche", 673.3)} out={674.2} x={960} y={300} />);
  add(674.4, 676.15, () => <Escrito t={t} at={A("refresco de cola", 675.0)} out={676.0} x={960} y={880} text="…y el refresco de cola" size={90} col={LI.crema} />);
  add(676.15, 680.77, () => <Escrito t={t} at={A("chocolate de agua", 676.7)} out={679.5} x={520} y={300} text="…y el chocolate de agua" size={80} col={LI.maiz} />);
  add(680.77, 684.2, () => <Cinta t={t} at={A("nada de picante", 680.9)} out={684.0} x={960} y={260} text="NI PICANTE NI GRASA" col={LI.rojo} size={96} />);
  add(684.2, 688.0, () => <Q.NiNiNi t={t} ats={[A("ni pozole", 684.3), A("ni tamales", 685.3), A("ni el recalentado", 686.2)]} items={["pozole", "tamales", "recalentado con chile"]} out={687.8} x={1340} y={460} />);
  add(688.0, 694.23, () => <><Hora t={t} at={A("comidas de mediodia", 688.5)} out={694.0} x={380} y={230} label="MEDIODÍA" h={12} />
    <Escrito t={t} at={A("no hay almohada", 692.6)} out={694.0} x={960} y={880} text="no hay almohada que alcance" size={88} col={LI.crema} /></>);
  add(694.23, 698.19, () => <Tag t={t} at={A("el traguito para dormir", 696.6)} x={600} y={720} dx={40} dy={-260} text="EL TRAGUITO" sub="PA' DORMIR" col={LI.maiz} out={698.0} size={58} />);
  add(698.19, 702.9, () => <Escrito t={t} at={A("un sueno de angelito", 701.4)} out={702.7} x={960} y={880} text="«un sueño de angelito»" size={92} col={LI.lila} />);
  add(702.9, 709.02, () => <Q.SuenoCortado t={t} at={A("es cierto que te duermes", 703.0)} cut={A("te corta el sueno", 707.1)} out={708.8} x={960} y={480} />);
  add(709.02, 713.36, () => <Hora t={t} at={A("justo a las 3", 709.4)} out={713.2} x={400} y={240} label="3:00 a.m." h={3} />);
  add(713.36, 716.4, () => <Escrito t={t} at={A("el traguito para la fiesta", 713.8)} out={716.2} x={960} y={250} text="pa' la fiesta, no pa' la almohada" size={88} col={LI.maiz} />);

  // ===== minuto 12 · la semana, el mercado, de corazón =====
  const SD = [A("lunes", 719.9), A("martes calabacitas", 722.7), A("miercoles", 725.0), A("jueves", 727.2), A("viernes quesadillas", 729.6), A("sabado frijoles", 732.0), A("domingo", 734.2)];
  add(716.4, 736.0, () => <Q.Semana t={t} at={A("asi lo hago yo", 718.6)} ats={SD} dishes={["atole de avena", "calabacitas con queso", "caldito en taza", "huevo con nopalitos", "quesadillas de lo que sobró", "frijoles de la olla", "plátano al comal"]} out={735.8} y={t >= 725.49 && t < 730.23 ? 900 : 820} small={t >= 725.49 && t < 730.23 ? 1 : 0} />);
  add(736.0, 740.8, () => <Q.TresMismos t={t} ats={[A("la leche tibia", 737.1), A("o el tecito", 738.3), A("a la misma hora", 739.2)]} out={740.6} y={780} />);
  add(740.8, 747.45, () => <Q.PanVsCena t={t} at={A("menos de lo que te cuesta", 742.6)} out={747.2} x={t < 742.49 ? 1300 : 560} y={400} />);
  add(747.45, 753.8, () => <Q.Senales t={t} ats={[A("semanas sin dormir", 749.2), A("roncas muy fuerte", 750.7), A("sin aire", 753.0)]} labels={["semanas sin dormir", "roncas muy fuerte", "te despiertas sin aire"]} out={753.6} y={330} />);
  add(753.8, 757.08, () => <Sello t={t} at={A("ve con tu medico", 756.0)} text="VE CON TU MÉDICO" x={960} y={260} out={756.9} size={92} />);
  add(757.08, 761.54, () => <Escrito t={t} at={A("tiene arreglo", 758.7)} out={761.3} x={520} y={300} text="muchas veces tiene arreglo" size={78} col={LI.maiz} />);

  // ===== minuto 13 · la tarea, la pregunta, el próximo, buenas noches =====
  add(761.54, 768.0, () => <Q.Cuaderno t={t} at={A("tu tarea", 761.7)} out={767.8} x={1380} y={480} rows={[{ at: A("cena dos horas antes", 764.4), text: "cenar 2 horas antes" }, { at: A("en un plato chico", 766.7), text: "y en un plato chico" }]} />);
  add(768.0, 771.0, () => <Escrito t={t} at={A("me cuentas como dormiste", 769.3)} out={770.8} x={960} y={250} text="¿y cómo dormiste?" size={100} col={LI.crema} />);
  add(771.0, 774.8, () => <Q.Comentario t={t} at={A("dejame en los comentarios", 771.1)} out={774.6} x={960} y={830} text="¿Qué te daban de cenar a ti de niña?" send={A("de nina", 773.9) + 0.4} />);
  add(774.8, 779.65, () => <Q.Duo t={t} a={A("el atole", 777.1)} b={A("el cafe con pan", 778.4)} out={779.5} y={800} la="¿el atole?" lb="¿café con pan?" />);
  add(779.65, 785.9, () => <LowerThird t={t} at={A("mi hermana chayo", 781.1)} out={785.7} name="DOÑA CHAYO" l2="EL CALDO DE RES DE LA ABUELA" l2at={A("el caldo de res", 783.8)} />);
  add(785.9, 794.91, () => <Q.Proximo t={t} at={A("en el proximo video", 786.1)} leaves={A("las siete hierbas", 790.8)} out={794.7} x={t < 790.44 ? 1240 : 560} y={500} />);
  add(798.2, 801.6, () => <Escrito t={t} at={A("buenas noches mija", 799.9)} out={801.4} x={960} y={880} text="buenas noches, mija" size={100} col={LI.crema} />);
  add(801.6, END_T, () => <Escrito t={t} at={A("despiertes descansada", 802.3)} out={END_T - 0.6} x={960} y={250} text="que despiertes descansada" size={92} col={LI.lila} />);
  return L;
};

// ---------------- EL RESTO ----------------
export const Rest: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const av = avAt(t);
  if (av) {
    L.push(<Avatar key="av" t={t} />);
    // entra el avatar: la toma anterior se cierra en un iris sobre la cara
    if (t < av.ms + 0.45) { let pi = -1; PARTS.forEach((p, i) => { if (p.b <= av.ms + 0.05) pi = i; }); const r = 1 - ei(t, av.ms, av.ms + 0.45); if (pi >= 0 && r > 0) L.push(<Portal key="pin" x={FACE.x} y={FACE.y} r={r} ring={0.6}><PartView i={pi} t={t} /></Portal>); }
    // sale el avatar: la toma siguiente se abre en un iris desde la cara
    if (t > av.me - 0.5) { const ni = PARTS.findIndex((p) => p.a >= av.me - 0.05); const r = ei(t, av.me - 0.5, av.me); if (ni >= 0 && r > 0) L.push(<Portal key="pout" x={FACE.x} y={FACE.y} r={r} ring={0.6}><PartView i={ni} t={t} /></Portal>); }
  } else {
    const idx = partIdx(t);
    if (idx >= 0) {
      const p = PARTS[idx], nx = PARTS[idx + 1];
      L.push(<PartView key={"p" + idx} i={idx} t={t} />);
      if (!p.c && p.pt && nx?.c && Math.abs(nx.a - p.b) < 1e-6) {
        const r = ei(t, p.b - 0.7, p.b);
        if (r > 0) { const q = sc(t, p.pt); L.push(<Portal key="pt" x={q.x} y={q.y} r={r}><Clip k={nx.c} t={t} a={p.b - 0.7} z={nx.z} /></Portal>); }
      }
    }
  }
  L.push(...Ov(t));
  // vaho en cada costura entre dos partes seguidas (salvo las que ya son portal)
  PARTS.forEach((p, i) => { const nx = PARTS[i + 1]; if (nx && Math.abs(nx.a - p.b) < 1e-6 && !(p.pt && nx.c) && Math.abs(t - p.b) < 0.4) L.push(<Q.Vaho key={"vh" + i} t={t} mid={p.b} w={0.36} />); });
  // destello suave al encender cada jarrito
  CEN.forEach((a, i) => { if (Math.abs(t - a) < 0.5) L.push(<Flash key={"fl" + i} t={t} at={a} col="#efe4ff" peak={0.35} w={0.3} />); });
  // fundido final
  const fin = e(t, END_T - 0.9, END_T - 0.1);
  if (fin > 0) L.push(<AbsoluteFill key="fin" style={{ background: `rgba(0,0,0,${fin})` }} />);
  return <AbsoluteFill style={{ background: "#07060d" }}>{L}</AbsoluteFill>;
};
