// chpozole · EL VIDEO ENTERO (0 s → final). Un solo mundo y una sola cámara: la cocina de adobe con la olla de peltre azul del
// pozole al centro, los siete tazones de barro (uno por secreto: al cerrar cada secreto su tazón se sirve), el recetario de
// mamá Cuca que pasa una hoja por secreto, la olla del maíz en el fogón (el maíz florea), el comal de los chiles, la sartén
// de la salsa, el remojo, el mercado. Entre mundo y toma real sólo portales y vapor; el avatar entra en sus ventanas.
// Cada pieza nace con la palabra que la nombra (at("frase")).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, WorldProps, PT, PT2, PLATES, screenOf, camSpeed, setKeys, win, Key } from "./cocina3d";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, CH, Flash, HAND, P, Portal, Tag, at, e, ei, s, LowerThird, Receipt } from "./lib";
import { SteamWipe, Aroma, Nota, Pensado, Palomita, Stamp, Precio, Pill } from "./Min1";
import * as X from "./piezas";

const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = new Set((AVAIL as { clips: string[] }).clips);
type V = [number, number, number];
type Win = { ms: number; me: number; off: number };
const WIN: Win[] = ((AVW as { win: Win[] }).win).filter((w) => w.me - w.ms > 0.1);
const inAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);
export const END_T = 925.3; // voz 924,3 + 1 s de silencio
const A = (ph: string, after: number) => at(ph, after);

// ---------------- cámaras con nombre ----------------
type Cam = { p: V; l: V; fov?: number };
const CZ: V = [0, 1.02, -0.17];
const OLLA2: V = [-0.62, 1.12, -2.6];
const C: Record<string, Cam> = {
  top: { p: [0, 3.6, 0.95], l: [0, 0.8, 0.12], fov: 40 }, topB: { p: [0.18, 3.95, 1.0], l: [0, 0.8, 0.12], fov: 40 }, topC: { p: [-0.15, 3.35, 0.9], l: [0, 0.8, 0.12], fov: 40 },
  wide: { p: [1.9, 1.95, 2.7], l: [-0.6, 0.8, -1.3], fov: 42 }, wide2: { p: [1.5, 1.9, 2.4], l: [-0.8, 0.8, -1.6], fov: 42 },
  fogon: { p: [-0.55, 1.4, -0.75], l: [-1.3, 0.95, -2.4], fov: 38 }, fogon2: { p: [-0.78, 1.3, -1.05], l: [-1.3, 0.8, -2.4], fov: 38 },
  olla2: { p: [-0.25, 1.75, -1.65], l: OLLA2, fov: 34 }, olla2b: { p: [-0.42, 1.62, -1.95], l: OLLA2, fov: 30 },
  comal: { p: [-0.55, 1.9, -0.7], l: [-1.3, 0.94, -2.5], fov: 32 }, comal2: { p: [-0.75, 1.75, -1.0], l: [-1.3, 0.94, -2.5], fov: 30 },
  comalT: { p: [-1.2, 2.6, -1.6], l: [-1.3, 0.94, -2.5], fov: 40 }, comalT2: { p: [-1.15, 2.45, -1.72], l: [-1.3, 0.94, -2.5], fov: 37 },
  pots: { p: [-0.2, 1.6, -1.2], l: [0.9, 1.95, -2.86], fov: 40 }, repisa: { p: [1.3, 1.55, -1.5], l: [1.6, 1.45, -2.82], fov: 38 }, repisa2: { p: [1.7, 1.5, -1.75], l: [1.6, 1.45, -2.82], fov: 36 },
  caz: { p: [0.85, 1.6, 1.2], l: CZ, fov: 36 }, caz2: { p: [0.55, 1.45, 0.6], l: CZ, fov: 33 }, cazL: { p: [-0.9, 1.55, 1.0], l: CZ, fov: 36 }, cazL2: { p: [-0.6, 1.45, 0.7], l: CZ, fov: 34 },
  cazT: { p: [0.3, 1.95, 0.55], l: [0, 1.07, -0.17], fov: 30 }, cazT2: { p: [0.22, 1.8, 0.42], l: [0, 1.07, -0.17], fov: 27 },
  libro: { p: [1.12, 1.42, 0.28], l: [0.88, 0.82, -0.3], fov: 34 }, libro2: { p: [1.0, 1.2, 0.02], l: [0.88, 0.82, -0.3], fov: 30 },
  charola: { p: [-0.55, 1.3, 0.75], l: PT2.charola, fov: 34 }, charolaT: { p: [-0.72, 1.62, 0.4], l: PT2.charola, fov: 34 },
  remojo: { p: [1.05, 1.45, 0.15], l: PT2.remojo, fov: 34 }, remojo2: { p: [0.7, 1.18, -0.12], l: PT2.remojo, fov: 31 },
  patio: { p: [6.6, 1.75, 3.6], l: [10, 1.0, 0.8], fov: 42 }, patio2: { p: [6.9, 1.7, 3.4], l: [10, 1.0, 0.8], fov: 42 },
  mercado: { p: [6.6, 1.5, 7.6], l: [6.6, 0.95, 5.4], fov: 38 }, mercado2: { p: [6.25, 1.3, 6.7], l: [6.6, 0.95, 5.4], fov: 35 },
  salida: { p: [3.4, 2.9, 6.2], l: [0, 0.9, -0.6], fov: 44 },
};
PLATES.forEach((q, i) => { C["pl" + i] = { p: [q[0], 1.25, 0.95], l: [q[0], 0.82, 0.33], fov: 34 }; C["pl" + i + "b"] = { p: [q[0], 1.08, 0.7], l: [q[0], 0.82, 0.33], fov: 32 }; });

// ---------------- la línea de tiempo: partes de mundo (w) y tomas reales (c) entre las ventanas del avatar ----------------
type Part = { a: number; b: number; c?: string; k0?: string; k1?: string; pt?: V; z?: [number, number] };
const w = (a: number, b: number, k0: string, k1: string, pt?: V): Part => ({ a, b, k0, k1, pt });
const c = (a: number, b: number, id: string, z?: [number, number]): Part => ({ a, b, c: id, z });
const FIRE = PT.fire;
const PARTS: Part[] = [
  // gancho
  w(4.2, 10.6, "cazT", "cazT2"), c(10.6, 15.2, "p_florea"),
  w(19.7, 24.4, "top", "topB"), w(24.4, 29.5, "topB", "topC"),
  c(33.0, 38.6, "h_quince"), c(38.6, 42.2, "h_olla"), c(42.2, 45.5, "h_cunado"),
  c(50.8, 55.6, "h_cansada"), c(55.6, 62.6, "h_lety_fonda"),
  c(66.7, 72.0, "h_fonda"), w(72.0, 78.9, "cazT2", "cazT"),
  // promesa
  w(82.7, 88.0, "wide", "top"), w(88.0, 95.4, "top", "topB"), w(101.5, 113.6, "topB", "topC"),
  // quién es Chayo + guía
  w(119.4, 125.2, "wide", "fogon", FIRE), w(125.2, 131.5, "fogon", "fogon2"),
  c(137.3, 142.6, "i_fogon"), c(142.6, 148.4, "i_cta"),
  w(153.2, 163.3, "libro", "libro2"),
  w(169.1, 173.4, "libro2", "libro"), c(173.4, 177.6, "s_abuela"), w(177.6, 181.9, "fogon2", "olla2"),
  // la historia
  c(187.8, 193.4, "s_nina"), w(193.4, 198.6, "charola", "charolaT"),
  c(203.3, 209.2, "s_vecina"), w(209.2, 216.1, "caz", "caz2"),
  w(221.3, 226.2, "cazL", "cazL2"), c(226.2, 231.7, "s_olla"),
  w(235.6, 246.2, "caz", "cazL"),
  // SECRETO 1 · descabezar
  c(250.8, 256.2, "u_maiz"), w(256.2, 264.0, "charolaT", "charola"),
  c(268.4, 274.2, "p_descabezar"), c(274.2, 280.7, "u_lavar"),
  c(285.3, 290.4, "u_bolsa"), w(290.4, 295.2, "pl0", "pl0b"),
  // SECRETO 2 · la carne
  c(299.6, 305.2, "d_carnicero"), w(305.2, 313.2, "caz", "caz2"),
  c(318.6, 323.4, "d_carne"), w(323.4, 329.3, "cazT", "cazT2"),
  c(334.1, 339.2, "d_agua"), w(339.2, 346.4, "cazL", "caz"),
  c(350.4, 355.6, "d_espuma"), w(355.6, 361.3, "pl1", "pl1b"),
  // SECRETO 3 · el maíz aparte
  c(366.9, 372.0, "t_dos_ollas"), c(372.0, 377.9, "t_sal"),
  w(381.9, 389.2, "olla2", "olla2b"), c(389.2, 396.5, "t_florear"),
  c(401.4, 406.2, "t_juntar"), w(406.2, 413.6, "cazT", "cazT2"),
  c(419.6, 424.6, "t_estropajo"), w(424.6, 429.5, "pl2", "pl2b"),
  // SECRETO 4 · los chiles
  w(433.2, 439.2, "comal", "comal2"), c(439.2, 446.2, "k_limpiar"),
  c(451.8, 455.6, "k_comal"), w(455.6, 459.8, "comalT", "comalT2"), c(459.8, 463.1, "k_quemado"),
  w(468.3, 472.8, "comal", "comal2"), c(472.8, 476.4, "k_remojo"), c(476.4, 479.5, "k_tirar"),
  c(485.7, 490.0, "k_licuar"), c(490.0, 494.2, "k_colar"), c(494.2, 498.8, "c2_posada"),
  w(504.9, 516.9, "libro", "libro2"),
  // SECRETO 5 · freír la salsa
  w(520.5, 525.6, "libro2", "comal"), w(525.6, 529.4, "comal", "comal2"), c(529.4, 533.8, "f_manteca"),
  c(539.6, 544.6, "f_echar"), w(544.6, 552.4, "comalT", "comalT2"),
  c(556.4, 561.6, "f_mover"), c(561.6, 567.1, "p_freir"),
  w(571.5, 577.2, "cazT", "cazT2"), w(577.2, 582.8, "pl3", "pl3b"),
  // SECRETO 6 · orégano y reposo
  c(588.2, 593.2, "o_probar"), c(593.2, 599.4, "p_oregano"),
  c(604.2, 610.2, "o_frotar"), c(610.2, 616.5, "o_tapar"),
  c(620.6, 626.0, "o_noche"), w(626.0, 631.1, "caz", "caz2"),
  w(635.7, 640.2, "cazL", "cazL2"), w(640.2, 646.7, "pl4", "pl4b"),
  // SECRETO 7 · nunca en la olla
  c(651.4, 656.2, "m_cocida"), c(656.2, 660.6, "m_lechuga"), w(660.6, 665.9, "top", "topB"),
  c(669.3, 675.2, "m_armar"), c(675.2, 681.9, "p_mesa"),
  // variantes
  w(686.4, 691.4, "pl5", "pl5b"), c(691.4, 697.1, "v_pollo"),
  w(701.7, 707.0, "cazT", "cazT2"), c(707.0, 714.6, "v_licha_verde"),
  w(719.5, 725.2, "top", "topC"), c(725.2, 730.7, "v_tostadas"),
  c(735.9, 741.2, "v_lupe_enchiladas"), w(741.2, 747.0, "pl6", "pl6b"),
  // lo que puede salir mal
  c(750.3, 756.2, "pr_duro"), w(756.2, 763.5, "comal", "comal2"),
  c(769.0, 774.6, "pr_grasa"), w(774.6, 780.3, "cazL", "cazL2"),
  // la cuenta
  w(785.7, 792.0, "caz", "caz2"), c(792.0, 798.2, "din_mercado"),
  w(801.9, 814.2, "mercado", "mercado2"),
  c(819.7, 825.0, "din_mesa"), w(825.0, 829.8, "topB", "topC"),
  // resumen, tarea, comentarios, próximo, cierre
  w(834.2, 847.6, "top", "topB"), w(853.7, 865.1, "topB", "top"),
  w(868.5, 874.4, "olla2", "olla2b"), c(874.4, 881.7, "f_olla_roja"),
  w(885.9, 897.7, "caz", "cazL"),
  c(903.5, 909.2, "z_fogon"), w(909.2, 914.5, "fogon2", "fogon"),
  c(919.0, 922.2, "z_familia"), w(922.2, END_T, "caz", "salida"),
];
// llaves de cámara: inicio y fin de cada parte de mundo (los saltos caen siempre dentro de una toma, del avatar o del vapor)
setKeys(PARTS.filter((p) => !p.c).flatMap((p, i, arr) => {
  const prev = arr[i - 1], t0 = prev && Math.abs(prev.b - p.a) < 1e-6 ? p.a + 0.001 : p.a;
  const k0 = C[p.k0!], k1 = C[p.k1!];
  return [{ t: t0, p: k0.p, l: k0.l, fov: k0.fov }, { t: p.b, p: k1.p, l: k1.l, fov: k1.fov }] as Key[];
}));
const partAt = (t: number) => PARTS.find((p) => t >= p.a && t < p.b);

// ---------------- el recetario de mamá Cuca (una hoja por secreto) y la guía con sus páginas REALES ----------------
const RECETARIO = [
  { l: ["# Pozole Rojo", "de Mamá Cuca", "", "pa' 12 gentes", "olla de 10 litros", "", "15 de septiembre"], r: ["el pozole no se avienta,", "se va armando", "", "", "Refugio"] },
  { l: ["# 1. El maíz", "1 kg cacahuacintle", "descabezar uno por uno", "(uña o cuchillito)", "", "lavar en 3 aguas"], r: ["hasta que salga clarita", "", "el de bolsa:", "nomás enjuagar bien"] },
  { l: ["# 2. La carne", "1 kg espinazo", "2 kg maciza", "1 pata en 4", "", "agua FRÍA, 6 litros"], r: ["½ cebolla, 1 ajo", "1 cda sal", "", "la espuma gris:", "10 minutos, fuera"] },
  { l: ["# 3. El maíz aparte", "otra olla", "agua SIN sal", "fuego medio", "", "crudo: 2 a 2½ h"], r: ["precocido: 40 min", "", "que FLOREE", "y luego a la olla", "con su agua y todo"] },
  { l: ["# 4. Los chiles", "6 guajillo", "3 anchos", "sin rabito ni semillas", "", "de 2 en 2, apenitas"], r: ["agua caliente 15 min", "el agua SE TIRA", "", "licuar con caldo", "2 ajos, ¼ cebolla", "y colar"] },
  { l: ["# 5. Freír la salsa", "2 cdas manteca", "bien caliente", "de un jalón", "", "10 minutos"], r: ["hasta rojo ladrillo", "", "luego a la olla grande", "con todo"] },
  { l: ["# 6. Orégano y reposo", "media hora bajito", "sal al final", "", "orégano frotado", "entre las manos"], r: ["tapar y reposar 15 min", "", "mejor al día siguiente", "(al refri antes", "de 2 horas)"] },
  { l: ["# 7. En la mesa", "lechuga finita", "rábano en rodajas", "cebolla picada", "limón, orégano", "piquín, tostadas"], r: ["NUNCA en la olla", "", "cada quien", "arma su plato"] },
];
const G = "chpozole/guia/";
const GUIA = [
  { l: ["@img:" + G + "l1_p30.jpg"], r: ["@img:" + G + "l1_p31.jpg"] },
  { l: ["@img:" + G + "l1_p33.jpg"], r: ["@img:" + G + "l5_p29.jpg"] },
  { l: ["@img:" + G + "l5_p30.jpg"], r: ["@img:" + G + "l5_p32.jpg"] },
];

// ---------------- tiempos clave ----------------
const SERVE = [292.2, 357.6, 426.4, 579.0, 642.4, 688.4, 743.4];           // el tazón del secreto i se sirve
const FLIP = [A("secreto numero 1", 240), A("secreto numero 2", 285), A("secreto numero 3", 350), A("numero 4", 430), A("secreto numero 5", 515), A("secreto numero 6", 570), A("secreto numero 7", 630)];
const PROM = [A("que maiz comprar", 83), A("que carne pedir", 90), A("porque el maiz se cuece", 90), A("como se tuestan", 100), A("lo que le pasa a la salsa", 100), A("el oregano", 100), A("lo que nunca", 100)];
const RES = [A("1 el maiz se descabeza", 830), A("2 espinazo", 830), A("3 el maiz se cuece aparte", 830), A("4 los chiles", 840), A("5 la salsa", 850), A("6 el oregano", 850), A("7 la lechuga", 850)];
const G1 = A("se llama las cinco ollas", 150), G1P = A("en la pagina 30", 150), G2 = 499.0, G2P = A("en la pagina 29", 495);
const isGuia = (t: number) => (t >= 148.4 && t < 173.4) || (t >= 498.8 && t < 520.5);

const worldAt = (t: number): WorldProps => {
  const guia = isGuia(t);
  const plateServed = PLATES.map((_, i) => win(t, SERVE[i], SERVE[i] + 1.2));
  const plateOn = PLATES.map((_, i) => Math.max(
    win(t, PROM[i], PROM[i] + 0.3) * (1 - win(t, 113.4, 113.8)),
    win(t, SERVE[i] - 0.4, SERVE[i]) * (1 - win(t, SERVE[i] + 2, SERVE[i] + 3)),
    win(t, RES[i], RES[i] + 0.3) * (1 - win(t, 865, 865.3)),
  ));
  const k0 = partAt(t)?.k0 ?? "caz";
  // el maíz: cerrado en la fonda, florea en la olla del maíz (secreto 3)
  const florea = t < 82 ? (t >= 66 ? 0 : 1) : t >= 381.9 && t < 396.5 ? ei(t, 383, 392) : t >= 366 && t < 381.9 ? 0 : 1;
  const salsaK = t >= 520 && t < 571.5 ? (t < 544.6 ? 0.05 : 0.05 + 0.95 * ei(t, 545, 552)) : 0;
  return {
    t,
    night: Math.max(t >= 177.6 && t < 182 ? 0.8 : 0, t >= 626 && t < 631.1 ? 0.75 : 0, win(t, 922.2, 925) * 0.55),
    fire: (t >= 785.7 && t < 792 ? 0.55 : 1) + (t >= 756 && t < 763.5 ? 0.4 : 0),
    steamCaz: /^cazT/.test(k0) ? 0.35 : /^(caz|pl)/.test(k0) ? 1 : /^top/.test(k0) ? 0.4 : 0.25,
    steamComal: /^comal/.test(k0) ? 0.18 : 1,
    ojitos: 0.8,
    plateOn, plateServed, plateSteam: plateServed.map((v) => 0.16 * v),
    book: guia
      ? { open: ei(t, t < 300 ? G1 + 0.2 : G2, (t < 300 ? G1 + 0.2 : G2) + 1.2), flip: t < 300 ? ei(t, G1P, G1P + 0.9) : 1 + ei(t, G2P - 0.3, G2P + 0.6) + ei(t, A("49 pesos", 505), A("49 pesos", 505) + 0.9), pages: GUIA }
      : { open: 1, flip: FLIP.reduce((acc, f) => acc + ei(t, f, f + 0.9), 0), pages: RECETARIO },
    guia: guia ? 1 : 0,
    cover: G + "cov_" + (t < 300 ? "l1" : "l5") + ".png",
    partyPeople: t >= 919 ? 1 : 0,
    patioLights: win(t, 920, 924),
    chiles: t >= 433 && t < 446.2 ? 9 * win(t, 433.3, 434.2) : t >= 455 && t < 460 ? 2 : t >= 468 && t < 473 ? 2 * win(t, A("de dos en dos", 466), A("de dos en dos", 466) + 0.6) : t >= 756 && t < 763.5 ? 2 : 0,
    toast: t >= 455 && t < 460 ? win(t, 455.8, 459) : t >= 468 && t < 473 ? 0.6 : 0,
    burnt: t >= 756 && t < 763.5 ? win(t, A("se te quemo un chile", 756), A("se te quemo un chile", 756) + 1.2) : 0,
    sarten: salsaK > 0 ? 1 : 0, fry: 0, salsa: salsaK,
    remojo: t >= 476 && t < 480 ? 0.9 : 0,
    maiz: (t >= 193.4 && t < 198.6) || (t >= 256.2 && t < 264) ? 1 : 0,
    florea,
    abierta: t >= 612 && t < 626.5 ? 0 : 1,
    raw: t >= 571.5 && t < 577.2 ? 1 - ei(t, A("revuelves", 570), A("revuelves", 570) + 3) : t >= 323.4 && t < 329.3 ? 0.6 : 0,
    top: k0.startsWith("top") ? 1 : 0,
  };
};

const World: React.FC<{ t: number; over?: Partial<WorldProps> }> = ({ t, over }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mbr" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw {...worldAt(t)} {...over} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.map((wn, i) => (
    <Sequence key={i} from={s(wn.ms) - 10} durationInFrames={s(wn.me - wn.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= wn.ms - 0.02 && t < wn.me ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(wn.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.012 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};
// el clip de agnes dura 3 s (1 s a 0,33×): la toma abre con la foto (Ken Burns) y el clip cierra la toma, con fundido
const CLIP_S = 3.0;
const Clip: React.FC<{ k: string; t: number; a: number; b: number; z?: [number, number] }> = ({ k, t, a, b, z = [1.03, 1.1] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  const img = <AbsoluteFill style={{ transform: `scale(${sc})` }}><Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>;
  if (!CLIPS.has(k)) return <AbsoluteFill style={{ overflow: "hidden" }}>{img}</AbsoluteFill>;
  const c0 = Math.max(a, b - CLIP_S), fade = c0 > a + 0.05 ? e(t, c0, c0 + 0.35) : 1;
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    {fade < 1 ? img : null}
    {t >= c0 - 0.05 ? <AbsoluteFill style={{ opacity: fade }}><Sequence from={s(c0)} layout="none"><OffthreadVideo src={staticFile(P + k + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence></AbsoluteFill> : null}
  </AbsoluteFill>;
};

// ---------------- las piezas, cada una clavada a su palabra ----------------
const sc = (t: number, q: V) => screenOf(t, q);
const PL = (i: number) => PLATES[i];
const PROMT = ["qué maíz y cómo", "carne con hueso", "el maíz, aparte", "chiles sin amargar", "la salsa, frita", "el orégano", "nunca en la olla"];
const REST = ["descabezar · 3 aguas", "hueso + agua fría", "maíz aparte, sin sal", "chiles de 2 en 2", "salsa frita", "orégano + reposo", "todo en la mesa"];
const Ov = (t: number): React.ReactNode[] => {
  const L: React.ReactNode[] = [];
  const on = (a: number, b: number) => t >= a - 0.4 && t < b + 0.6;
  const add = (a: number, b: number, f: () => React.ReactNode) => { if (on(a, b)) L.push(<React.Fragment key={"o" + a.toFixed(2) + "_" + L.length}>{f()}</React.Fragment>); };
  const tg = (a: number, b: number, q: V, ph: string, after: number, text: string, sub: string | undefined, dx: number, dy: number, col: string = CH.maiz, size = 56) =>
    add(a, b, () => { const p = sc(t, q); return <Tag t={t} at={A(ph, after)} x={p.x} y={p.y} dx={dx} dy={dy} text={text} sub={sub} col={col} out={b - 0.2} size={size} />; });

  // ===== gancho =====
  tg(4.2, 10.6, CZ, "rojo oscuro", 4, "ROJO OSCURO", "BRILLOSITO", 330, -230);
  add(10.6, 15.2, () => <X.Card t={t} at={A("abierto como florecita", 10)} out={15.0} x={1440} y={260} from="right"><X.H s={56} c={CH.maiz}>EL MAÍZ, ABIERTO</X.H><X.H s={46} f={HAND}>como florecita</X.H></X.Card>);
  add(19.7, 24.4, () => <><Pill t={t} at={A("ni la salsa de botella", 19)} out={24.2} x={480} y={250} text="SALSA DE BOTELLA" /></>);
  add(19.7, 29.5, () => <BigNum t={t} at={A("siete cosas", 20)} out={26.4} text="7 SECRETOS" size={150} y={470} col={CH.maiz} edge="#5a2a10" sub="DE MI ABUELA" />);
  add(24.4, 29.5, () => <Stamp t={t} at={A("las fondas ya no hacen", 22)} out={29.3} text="LAS FONDAS YA NO" x={1420} y={260} size={64} col={CH.maiz} />);
  add(33.0, 38.6, () => <X.Card t={t} at={33.2} out={38.4} x={470} y={230} from="left"><X.H s={58} c={CH.maiz}>15 DE SEPTIEMBRE</X.H><X.H s={44} f={HAND}>toda la familia en tu casa</X.H></X.Card>);
  add(38.6, 42.2, () => <X.Cronometro t={t} at={A("llevas 5 horas", 37)} out={42.0} x={1560} y={360} mins={5} label="5 HORAS EN LA LUMBRE" />);
  add(42.2, 45.5, () => <X.Burbujas t={t} out={50.6} items={[{ at: A("tu cunado", 41) + 0.3, x: 1400, y: 300, text: "¿Y el maíz por qué está duro?", rot: 3 }, { at: A("sabe a agua con chile", 45), x: 560, y: 560, text: "Sabe a agua con chile...", rot: -4 }]} />);
  add(50.8, 55.6, () => <><Pill t={t} at={A("le echan limon y sal", 51)} out={55.4} x={1400} y={260} text="LIMÓN Y SAL" /><Nota t={t} at={A("para que sepa algo", 52)} out={55.4} x={1450} y={520} lines={["...pa' que", "sepa a algo."]} rot={4} w={400} /></>);
  add(55.6, 62.6, () => <LowerThird t={t} at={A("mi hija leti", 55)} out={60.0} name="LETY" l2="MI HIJA · FONDA EN MORELIA" l2at={A("una fonda en morelia", 55)} />);
  add(60.0, 66.7, () => <Precio t={t} at={A("160", 60)} out={62.4} x={1440} y={140} top="$160" sub="UN PLATO DE POZOLE" />);
  add(66.7, 72.0, () => <X.Card t={t} at={A("tres pedacitos de carne", 66)} out={71.8} x={1430} y={270} from="right"><X.H s={58} c="#ff8a6a">3 PEDACITOS</X.H><X.H s={46} f={HAND}>de carne. Nomás.</X.H></X.Card>);
  tg(72.0, 78.9, CZ, "y el maiz entero cerrado", 66, "CERRADO", "COMO BOLITAS DE UNICEL", 330, -220, "#ff8a6a", 60);
  add(72.0, 78.9, () => <X.Burbujas t={t} out={78.7} items={[{ at: A("y por que no se le abrio", 72), x: 520, y: 300, text: "¿Y por qué no se le abrió el maíz?", rot: -3 }]} />);
  add(82.7, 88.0, () => <X.Card t={t} at={A("esto es lo que te voy a dar", 83)} out={87.8} x={960} y={170} from="up"><X.H s={60} c={CH.maiz}>7 SECRETOS · EN SU ORDEN</X.H></X.Card>);

  // ===== promesa: cada tazón se enciende con su secreto =====
  add(83, 113.6, () => PLATES.map((q, i) => { const p = sc(t, q); return t >= PROM[i] && (t < 95.4 || t >= 101.5) ? <X.PlateLabel key={i} t={t} at={PROM[i]} out={113.4} x={p.x} y={p.y} n={i + 1} text={PROMT[i]} up={i % 2 ? 250 : 130} /> : null; }));

  // ===== quién es Chayo =====
  add(119.4, 128, () => <LowerThird t={t} at={A("yo soy rosario", 119)} out={128} name="DOÑA CHAYO" l2="67 AÑOS · PÁTZCUARO" l2at={A("tengo 67 anos", 119)} />);
  add(125.2, 131.5, () => <X.MapaMich t={t} at={A("patzcuaro", 125)} out={131.3} x={1380} y={430} />);
  add(137.3, 142.6, () => <X.Orden t={t} at={137.4} out={142.4} nums={false} steps={[{ label: "de fiesta", at: A("era de fiesta", 137) }, { label: "septiembre", at: A("de septiembre", 137) }, { label: "cumpleaños", at: A("de cumpleanos", 137) }, { label: "visitas de lejos", at: A("de cuando llegaba", 137) }]} />);
  add(142.6, 148.4, () => <X.Card t={t} at={A("lo escribi", 142)} out={148.2} x={1450} y={280} from="right"><X.H s={50} c={CH.maiz}>LO ESCRIBÍ TODO</X.H><X.H s={44} f={HAND}>cantidades · tiempos · lo que cuesta</X.H></X.Card>);
  add(153.2, 163.3, () => <><X.Card t={t} at={G1} out={163.1} x={470} y={170} from="left" col="#ff8fbf"><X.H s={50} c="#ff8fbf">LAS 5 OLLAS DE DOÑA CHAYO</X.H></X.Card>
    <X.GuiaPag t={t} at={G1P} out={163.1} x={1530} y={820} pag="Libro 1 · pág. 30" text="El Pozole Rojo del Domingo" /></>);
  add(169.1, 173.4, () => <X.DescCard t={t} at={A("el link esta", 168)} out={173.2} x={1440} y={760} hl={A("primera linea", 168)} />);
  add(173.4, 177.6, () => <X.FotoVieja t={t} at={173.5} out={177.4} x={1360} y={460} src="s_abuela" w={700} rot={4} cap="Mamá Cuca" />);
  add(177.6, 181.9, () => <X.Card t={t} at={A("el 14 de septiembre", 176)} out={181.7} x={470} y={230} from="left"><X.H s={58} c={CH.maiz}>14 DE SEPTIEMBRE</X.H><X.H s={44} f={HAND}>en la noche, ya estaba...</X.H></X.Card>);
  tg(181.9, 187.8, OLLA2, "la de peltre azul", 181, "PELTRE AZUL", "NOMÁS PA'L POZOLE", 300, -200, "#8fc4ff");

  // ===== la historia =====
  add(187.8, 193.4, () => <X.Card t={t} at={A("descabezar el maiz", 187)} out={193.2} x={1440} y={260} from="right"><X.H s={50} c={CH.maiz}>A MÍ ME TOCABA</X.H><X.H s={46} f={HAND}>descabezar el maíz</X.H></X.Card>);
  add(193.4, 198.6, () => <Nota t={t} at={A("y yo renegaba", 194)} out={198.4} x={1480} y={300} lines={["Uno por uno...", "y yo renegaba."]} rot={-3} w={460} />);
  add(198.6, 203.3, () => <X.Cita t={t} at={A("el maiz que no se descabeza", 198)} out={203.1} x={960} y={880} text="El maíz que no se descabeza no florea." who="MAMÁ CUCA" size={64} />);
  add(203.3, 209.2, () => <X.Burbujas t={t} out={209.0} items={[{ at: A("por que su pozole sabe asi", 203), x: 1380, y: 280, text: "¿Por qué su pozole sabe así?", rot: 3 }, { at: A("echa todo junto", 205), x: 560, y: 560, text: "Echa todo junto y se va a misa.", rot: -4 }]} />);
  add(209.2, 216.1, () => <><X.Fondo o={0.45 * e(t, 209.4, 210) * (1 - e(t, 215.6, 216))} /><X.Cita t={t} at={A("el pozole no se avienta", 209)} out={215.8} x={960} y={500} text="El pozole no se avienta, mija. Se va armando." who="MAMÁ CUCA" size={92} /></>);
  add(221.3, 226.2, () => { const p = sc(t, CZ); return <Tag t={t} at={A("10 litros", 221)} x={p.x} y={p.y} dx={330} dy={-230} text="10 LITROS" sub="POR LO MENOS" col={CH.maiz} out={226.0} size={64} />; });
  add(226.2, 231.7, () => <X.Card t={t} at={A("crece casi al doble", 226)} out={231.5} x={1440} y={280} from="right"><X.H s={64} c={CH.maiz}>× 2</X.H><X.H s={46} f={HAND}>el maíz crece casi al doble</X.H></X.Card>);
  add(235.6, 246.2, () => <><X.Fondo o={0.4 * e(t, 235.8, 236.3) * (1 - e(t, 245.6, 246))} /><X.CorteOllas t={t} at={236.0} out={245.8} x={960} y={540} n={3} badAt={A("la delgadita no", 238)} /></>);
  add(235.6, 240.0, () => <Pill t={t} at={A("espeso como atole", 235)} out={239.8} x={1400} y={200} text="ESPESO COMO ATOLE" />);

  // ===== SECRETO 1 · el maíz se descabeza =====
  add(246.2, 250.8, () => <X.Banda t={t} at={A("secreto numero 1", 245)} out={250.6} n={1} text="EL MAÍZ POZOLERO SE DESCABEZA" />);
  add(250.8, 256.2, () => <><Pill t={t} at={A("lo enjuaga y lo echa asi", 250)} out={256.0} x={1400} y={260} text="ENJUAGAR Y ECHAR" /><X.Card t={t} at={A("cacahuacintle", 250)} out={256.0} x={480} y={240} from="left"><X.H s={50} c={CH.maiz}>CACAHUACINTLE</X.H></X.Card></>);
  add(256.2, 264.0, () => <X.Lupa t={t} at={A("una cabecita dura", 256)} out={263.8} x={1400} y={420} cleanAt={1e9} label="LA CABECITA" />);
  add(268.4, 274.2, () => <X.Cronometro t={t} at={A("en 20 minutos", 268)} out={274.0} x={1560} y={360} mins={20} label="20 MIN = 1 KILO" />);
  add(274.2, 280.7, () => <X.Card t={t} at={A("en tres aguas", 274)} out={280.5} x={1440} y={260} from="right"><X.H s={60} c={CH.maiz}>3 AGUAS</X.H><X.H s={44} f={HAND}>tallándolo entre las manos</X.H></X.Card>);
  add(285.3, 290.4, () => <><Palomita t={t} at={A("ya viene descabezado", 285)} out={290.2} y={230} text="EL DE BOLSA: YA VIENE LISTO" /><Nota t={t} at={A("como a tiza", 288)} out={290.2} x={1480} y={560} lines={["Enjuágalo bien:", "sabe a tiza."]} rot={4} w={420} /></>);
  tg(290.4, 295.2, PL(0), "secreto numero 2", 285, "TAZÓN 1", "SERVIDO", 220, -220, CH.maiz, 52);
  add(292.6, 299.6, () => <X.Banda t={t} at={A("secreto numero 2", 290)} out={299.4} n={2} text="LA CARNE CON HUESO Y PATA" />);

  // ===== SECRETO 2 · la carne =====
  add(299.6, 305.2, () => <Pill t={t} at={A("pura maciza", 299)} out={305.0} x={1400} y={260} text="PURA MACIZA" />);
  add(305.2, 313.2, () => <X.Versus t={t} at={A("no salen de la carne limpia", 305)} out={313.0} x={960} y={300} a="HUESO + CUERITO" b="CARNE LIMPIA" w={980} rows={[["sabor", true, false], ["cuerpo del caldo", true, false]]} />);
  add(313.2, 329.3, () => <X.Carnes t={t} out={329.1} x={960} y={790} rows={[{ at: A("un kilo de espinazo", 313), n: "1 KG ESPINAZO", s: "el sabor" }, { at: A("dos kilos de maciza", 313), n: "2 KG MACIZA", s: "en trozos grandes" }, { at: A("una pata partida", 313), n: "1 PATA EN 4", s: "la gelatina" }]} />);
  add(323.4, 329.3, () => <Nota t={t} at={A("los labios pegajositos", 324)} out={329.1} x={1480} y={260} lines={["Los labios", "pegajositos."]} rot={-3} w={400} />);
  add(334.1, 339.2, () => <X.Card t={t} at={A("con el agua fria", 334)} out={339.0} x={1440} y={300} from="right"><div style={{ display: "flex", gap: 40 }}><X.H s={64} c="#bfe88a">FRÍA ✓</X.H><X.H s={64} c="#ff8a6a">HIRVIENDO ✗</X.H></div></X.Card>);
  add(339.2, 350.4, () => <X.IconRow t={t} out={350.2} x={960} y={880} items={[
    { k: "agua", label: "6 litros de agua", at: A("6 litros de agua", 338), c: "#cfe6ff" }, { k: "cebolla", label: "½ cebolla", at: A("media cebolla", 338), c: "#f0e6d8" },
    { k: "ajo", label: "1 cabeza de ajo", at: A("una cabeza de ajo", 338), c: "#efe6cf" }, { k: "sal", label: "1 cda de sal", at: A("una cucharada de", 340), c: "#ffffff" }]} />);
  add(350.4, 355.6, () => <X.Cronometro t={t} at={A("10 minutos", 350)} out={355.4} x={1560} y={360} mins={10} label="LA ESPUMA, FUERA" />);
  add(355.6, 361.3, () => <Stamp t={t} at={A("el caldo te sale turbio", 354)} out={358.4} text="SI NO: CALDO TURBIO" x={1400} y={250} size={60} />);
  tg(355.6, 361.3, PL(1), "secreto numero 3", 355, "TAZÓN 2", "SERVIDO", 220, -220, CH.maiz, 52);
  add(358.6, 366.9, () => <X.Banda t={t} at={A("secreto numero 3", 356)} out={366.7} n={3} text="EL MAÍZ SE CUECE APARTE" />);

  // ===== SECRETO 3 · el maíz aparte =====
  add(366.9, 372.0, () => <X.Card t={t} at={A("con agua y sin sal", 366)} out={371.8} x={1440} y={260} from="right"><X.H s={56} c={CH.maiz}>OTRA OLLA</X.H><X.H s={46} f={HAND}>agua y SIN sal</X.H></X.Card>);
  add(372.0, 377.9, () => <Stamp t={t} at={A("la sal le cierra la piel", 370)} out={377.7} text="LA SAL LO CIERRA" x={1400} y={260} size={66} />);
  tg(381.9, 389.2, OLLA2, "que el maiz flore", 380, "QUE FLOREE", "ESE ES TU RELOJ", 320, -210);
  add(381.9, 396.5, () => <X.Senales t={t} out={396.3} x={480} y={420} title="CUÁNTO TARDA" rows={[{ at: A("tarda unas 2 horas", 382), text: "crudo: 2 a 2½ horas" }, { at: A("unos 40 minutos", 385), text: "precocido: 40 min" }, { at: A("se revienta por la punta", 389), text: "se abre en 4, como palomita" }]} />);
  add(401.4, 406.2, () => <X.Card t={t} at={A("con su agua y todo", 401)} out={406.0} x={1440} y={260} from="right"><X.H s={52} c={CH.maiz}>CON SU AGUA Y TODO</X.H></X.Card>);
  tg(406.2, 413.6, CZ, "caldo blanquito sedoso", 405, "CALDO SEDOSO", "EL ALMIDÓN DEL MAÍZ", 330, -230, CH.crema, 56);
  add(419.6, 424.6, () => <X.Card t={t} at={A("como estropajo", 420)} out={424.4} x={1440} y={280} from="right"><X.H s={50} c="#ff8a6a">CARNE: HEBRAS SECAS</X.H><X.H s={46} f={HAND}>como estropajo</X.H></X.Card>);
  add(424.6, 429.5, () => <Pill t={t} at={A("el maiz se queda duro", 424)} out={429.3} x={1400} y={250} text="MAÍZ DURO" />);
  tg(424.6, 429.5, PL(2), "el maiz se queda duro", 424, "TAZÓN 3", "SERVIDO", 220, -220, CH.maiz, 52);
  add(429.5, 438, () => <X.Banda t={t} at={A("numero 4", 430)} out={437.8} n={4} text="LOS CHILES, APENITAS" />);

  // ===== SECRETO 4 · los chiles =====
  add(433.2, 446.2, () => <X.Conteo t={t} out={446.0} x={1500} y={430} rows={[{ label: "GUAJILLO", n: 6, at: A("6 chiles guajillo", 434), c: "#a8201a" }, { label: "ANCHO", n: 3, at: A("3 chiles anchos", 434), c: "#5a160a" }]} />);
  add(439.2, 446.2, () => <X.Card t={t} at={A("los abres como libro", 440)} out={446.0} x={460} y={260} from="left"><X.H s={46} f={HAND}>sin rabito, sin semillas,</X.H><X.H s={46} f={HAND}>abiertos como libro</X.H></X.Card>);
  add(446.2, 455.6, () => <X.FuegoNivel t={t} at={A("a fuego medio sin aceite", 446)} out={455.4} x={420} y={430} lvl={2} label="FUEGO MEDIO · SIN ACEITE" />);
  add(451.8, 459.8, () => <X.Senales t={t} out={459.6} x={1440} y={430} title="YA ESTÁN CUANDO..." rows={[{ at: A("nomas unos segundos", 451), text: "unos segundos por lado" }, { at: A("cambian de color", 452), text: "cambian de color" }, { at: A("sueltan su olor", 452), text: "sueltan su olor" }]} />);
  add(459.8, 463.1, () => <Stamp t={t} at={A("si ves humo", 458)} out={462.9} text="¿HUMO? YA SE QUEMÓ" x={1400} y={280} size={62} />);
  add(463.1, 468.3, () => <><Pill t={t} at={A("ni con azucar", 463)} out={468.1} x={700} y={860} text="AZÚCAR" /><Pill t={t} at={A("ni con mas sal", 463)} out={468.1} x={1220} y={860} text="MÁS SAL" /></>);
  tg(468.3, 472.8, PT2.comal, "de dos en dos", 466, "DE 2 EN 2", "NUNCA EN MONTÓN", 300, -220, CH.maiz, 60);
  add(472.8, 476.4, () => <X.Cronometro t={t} at={A("15 minutos", 472)} out={476.2} x={1560} y={360} mins={15} label="AGUA CALIENTE, SIN HERVIR" />);
  add(476.4, 479.5, () => <Stamp t={t} at={A("el agua del remojo se tira", 476)} out={479.3} text="EL AGUA SE TIRA" x={1400} y={260} size={70} />);
  add(485.7, 494.2, () => <X.Card t={t} at={A("con dos dientes de ajo", 485)} out={490.0} x={1440} y={260} from="right"><X.H s={46} f={HAND}>caldo de la olla</X.H><X.H s={46} f={HAND}>+ 2 ajos + ¼ cebolla</X.H></X.Card>);
  add(490.0, 494.2, () => <X.Coladera t={t} at={A("la salsa se cuela", 489)} out={494.0} x={1460} y={460} twoAt={1e9} />);
  add(494.2, 498.8, () => <X.Card t={t} at={A("la posada", 494)} out={498.6} x={470} y={240} from="left"><X.H s={52} c={CH.maiz}>¿TE TOCA LA POSADA?</X.H></X.Card>);
  add(504.9, 516.9, () => <><X.GuiaPag t={t} at={504.9} out={516.7} x={1530} y={820} pag="Libro 5 · pág. 29" text="El Pozole para 40 de la Posada" />
    <X.Versus t={t} at={A("49 pesos por persona", 505)} out={516.7} x={560} y={300} a="$49" b="$150-200" w={760} rows={[["por persona", true, false], ["tu olla, tu sazón", true, false]]} /></>);
  add(516.9, 520.5, () => <Palomita t={t} at={516.95} out={520.3} y={230} text="LA GUÍA YA SE PAGÓ SOLA" />);

  // ===== SECRETO 5 · la salsa se fríe =====
  add(520.5, 525.6, () => <X.DescCard t={t} at={A("el link esta", 519)} out={525.0} x={1440} y={760} hl={A("primera linea", 519)} />);
  add(525.6, 533.8, () => <X.Banda t={t} at={A("secreto numero 5", 522)} out={531.0} n={5} text="LA SALSA SE FRÍE ANTES" />);
  add(529.4, 539.6, () => <X.HervirFreir t={t} at={A("echan la salsa cruda", 530)} out={539.4} x={960} y={820} okAt={1e9} />);
  add(539.6, 544.6, () => <><X.Onoma t={t} at={A("de un jalon", 540)} out={543.6} x={1350} y={360} text="¡CHSSS!" /><Nota t={t} at={A("cuidado que brinca", 541)} out={544.4} x={520} y={300} lines={["¡Cuidado,", "que brinca!"]} rot={-4} w={400} /></>);
  add(544.6, 556.4, () => <X.ColorBarra t={t} at={A("diez minutos", 545)} out={556.2} x={960} y={880} t0={545.5} t1={552.0} mins={10} />);
  add(556.4, 561.6, () => <X.Card t={t} at={A("eso se llama sazonar", 556)} out={561.4} x={1440} y={260} from="right"><X.H s={56} c={CH.maiz}>SAZONAR LA SALSA</X.H></X.Card>);
  add(561.6, 567.1, () => <X.Card t={t} at={A("se le va a lo crudo", 561)} out={566.9} x={1440} y={280} from="right"><X.H s={46} f={HAND}>el chile se cocina en la grasa</X.H><X.H s={46} f={HAND}>y se le va lo crudo</X.H></X.Card>);
  tg(571.5, 577.2, CZ, "rojo parejo", 570, "ROJO PAREJO", "HONDO, BONITO", 330, -230, "#ff8a6a", 60);
  tg(577.2, 582.8, PL(3), "secreto numero 6", 575, "TAZÓN 4", "SERVIDO", 220, -220, CH.maiz, 52);
  add(578.0, 588.2, () => <X.Banda t={t} at={A("secreto numero 6", 576)} out={588.0} n={6} text="EL ORÉGANO SE FROTA Y EL POZOLE REPOSA" />);

  // ===== SECRETO 6 · orégano y reposo =====
  add(588.2, 593.2, () => <Palomita t={t} at={A("la sal va al final", 590)} out={593.0} y={230} text="LA SAL, AL FINAL" />);
  add(593.2, 599.4, () => <X.Card t={t} at={A("oregano mexicano", 595)} out={599.2} x={1440} y={260} from="right"><X.H s={52} c={CH.nopal}>ORÉGANO MEXICANO</X.H><X.H s={46} f={HAND}>del seco</X.H></X.Card>);
  add(604.2, 610.2, () => <Nota t={t} at={A("como si te calentaras las manos", 604)} out={610.0} x={1480} y={280} lines={["Como si te", "calentaras las manos."]} rot={3} w={480} />);
  add(606.0, 613.0, () => <Aroma t={t} at={A("se llena de olor", 606)} out={612.8} x={1200} y={680} />);
  add(610.2, 616.5, () => <X.Cronometro t={t} at={A("tapas la olla", 612)} out={620.4} x={1560} y={360} mins={15} label="REPOSA 15 MIN" />);
  add(620.6, 626.0, () => <X.Calendario t={t} at={A("sabe mejor al dia siguiente", 620)} out={625.8} x={1400} y={420} flipAt={A("para el 15", 622)} a="14" b="15" la="EN LA NOCHE" lb="LA FIESTA" />);
  add(626.0, 631.1, () => <><X.Fondo o={0.4 * e(t, 626.1, 626.6) * (1 - e(t, 630.6, 631))} /><X.Cita t={t} at={626.1} out={630.8} x={960} y={500} text="El pozole sabe mejor al día siguiente." who="MAMÁ CUCA" size={90} /></>);
  add(635.7, 640.2, () => <X.Refri t={t} at={A("al refrigerador", 635)} out={640.0} x={1440} y={460} inAt={A("al refrigerador", 635) + 0.4} />);
  tg(640.2, 646.7, PL(4), "secreto numero 7", 638, "TAZÓN 5", "SERVIDO", 220, -220, CH.maiz, 52);
  add(641.0, 651.4, () => <X.Banda t={t} at={A("secreto numero 7", 639)} out={646.4} n={7} text="LO QUE NUNCA VA DENTRO DE LA OLLA" />);

  // ===== SECRETO 7 · en la mesa =====
  add(651.4, 656.2, () => <Stamp t={t} at={A("en la mesa", 651)} out={656.0} text="EN LA MESA, NO EN LA OLLA" x={960} y={220} size={58} />);
  add(656.2, 660.6, () => <Pill t={t} at={A("una hierba cocida", 656)} out={660.4} x={1400} y={260} text="HIERBA COCIDA" />);
  add(660.6, 669.3, () => <X.Card t={t} at={A("pierde el picorcito", 660)} out={665.4} x={460} y={240} from="left"><X.H s={46} f={HAND}>el rábano cocido</X.H><X.H s={46} f={HAND}>pierde el picorcito</X.H></X.Card>);
  add(660.6, 681.9, () => <X.Orden t={t} at={A("lechuga picada finita", 662) - 0.2} out={681.7} nums={false} steps={[{ label: "lechuga finita", at: A("lechuga picada finita", 662) }, { label: "rábano", at: A("rabanos en rodajitas", 664) }, { label: "cebolla", at: A("cebolla blanca picada", 664) }, { label: "limón", at: A("limones partidos", 668) }, { label: "orégano", at: A("el oregano en un platito", 668) }, { label: "piquín", at: A("el chile piquin", 668) }, { label: "tostadas", at: A("una pila de tostadas", 668) }]} />);
  add(675.2, 681.9, () => <X.Card t={t} at={A("cada quien arma su plato", 673)} out={681.7} x={1440} y={260} from="right"><X.H s={50} c={CH.maiz}>CADA QUIEN ARMA SU PLATO</X.H></X.Card>);
  add(681.9, 686.4, () => <X.Versus t={t} at={A("lo crujiente", 678)} out={686.2} x={960} y={860} a="FRÍO Y CRUJIENTE" b="CALDO CALIENTE" w={980} rows={[]} />);

  // ===== variantes =====
  tg(686.4, 691.4, PL(5), "el segundo plato", 685, "TAZÓN 6", "SERVIDO", 220, -220, CH.maiz, 52);
  add(686.4, 691.4, () => <BigNum t={t} at={A("tres cosas mas", 687)} out={691.2} text="3 MÁS" size={150} y={420} col={CH.maiz} edge="#5a2a10" sub="EN EL RANCHO NADA SE REPETÍA" />);
  add(691.4, 701.7, () => <X.Card t={t} at={A("el pozole de pollo", 694)} out={701.5} x={460} y={220} from="left"><X.H s={52} c={CH.maiz}>1 · DE POLLO</X.H></X.Card>);
  add(701.7, 707.0, () => <><Nota t={t} at={A("las patitas del pollo", 701)} out={706.8} x={1480} y={280} lines={["En vez de pata:", "las patitas del pollo."]} rot={3} w={480} /><Palomita t={t} at={A("y sale mas barato", 703)} out={706.8} y={880} text="SALE MÁS BARATO" /></>);
  add(707.0, 719.5, () => <><X.Card t={t} at={A("el pozole verde", 706)} out={719.3} x={460} y={220} from="left"><X.H s={52} c={CH.nopal}>2 · VERDE</X.H><X.H s={44} f={HAND}>el de mi hermana Licha</X.H></X.Card></>);
  add(714.6, 730.7, () => <X.IconRow t={t} out={725.0} x={960} y={880} items={[
    { k: "tomate", label: "tomate verde", at: A("tomate verde", 714), c: "#8fbf4a" }, { k: "poblano", label: "poblano", at: A("chile poblano", 714), c: "#2f6a2a" },
    { k: "pepita", label: "pepitas", at: A("pepitas tostadas", 718), c: "#bfd08a" }, { k: "epazote", label: "rábano + epazote", at: A("hojas de rabano", 719), c: "#4a8a3a" }]} />);
  add(725.2, 735.9, () => <X.Card t={t} at={A("y la tercera lo que sobra", 724)} out={735.7} x={460} y={220} from="left"><X.H s={52} c={CH.maiz}>3 · LO QUE SOBRA</X.H></X.Card>);
  add(735.9, 741.2, () => <Nota t={t} at={A("le duran hasta el miercoles", 736)} out={741.0} x={1480} y={280} lines={["Enchiladas rojas", "hasta el miércoles."]} rot={-3} w={460} />);
  tg(741.2, 747.0, PL(6), "lo que puede salir mal", 740, "TAZÓN 7", "SERVIDO", 220, -220, CH.maiz, 52);
  add(741.2, 747.0, () => <BigNum t={t} at={A("lo que puede salir mal", 740)} out={746.8} text="SI ALGO SALE MAL" size={130} y={420} col={CH.crema} edge="#4a1a0c" />);

  // ===== lo que puede salir mal =====
  add(750.3, 756.2, () => <X.FixCard t={t} at={750.4} out={756.0} x={960} y={860} prob="EL MAÍZ NO SE ABRIÓ" fix={["½ hora más, bajito, tapado"]} fixAt={A("dejalo media hora mas", 750)} />);
  add(756.2, 768.9, () => <X.Diagnostico t={t} out={763.3} x={1340} y={480} title="¿AMARGO? FUE UNO DE DOS" rows={[{ at: A("se te quemo un chile", 756), text: "un chile quemado" }, { at: A("no tiraste el agua del remojo", 760), text: "el agua del remojo" }]} />);
  add(769.0, 780.3, () => <X.FixCard t={t} at={A("quedo muy grasoso", 768)} out={780.1} x={960} y={860} prob="MUY GRASOSO" fix={["al refri toda la noche", "quitar la tapa blanca"]} fixAt={A("dejalo enfriar", 769)} />);
  add(780.3, 789, () => <X.FuegoNivel t={t} at={A("que apenas tiemble", 785)} out={788.8} x={420} y={430} lvl={1} label="QUE APENAS TIEMBLE" />);

  // ===== la cuenta =====
  add(785.7, 792.0, () => <BigNum t={t} at={A("hagamos la cuenta", 785)} out={791.8} text="LA CUENTA" size={170} y={500} col={CH.maiz} edge="#5a2a10" sub="EN EL RANCHO TODO SE CUENTA" />);
  add(792.0, 798.2, () => <Precio t={t} at={A("160 pesos un plato", 790)} out={794.8} x={1440} y={140} top="$160" sub="UN PLATO EN LA FONDA" />);
  add(801.9, 829.0, () => <Receipt t={t} rows={[
    { at: A("110 pesos el kilo", 795), item: "espinazo", $: 110 }, { at: 798.3, item: "maciza 2 kg", $: 280 }, { at: A("60 pesos el kilo", 801), item: "maíz pozolero", $: 60 },
    { at: A("unos 50 pesos", 804), item: "chiles", $: 50 }, { at: A("unos 200 pesos mas", 806), item: "lechuga, rábano, tostadas...", $: 200 }]}
    totalAt={A("todo junto unos 700", 812)} x={120} y={110} out={818.8} sc={1.12} title="LA OLLA · 12 GENTES" />);
  add(814.2, 819.7, () => <X.Gente t={t} at={A("comen 12 personas", 814)} out={819.5} x={1350} y={420} n={12} label="gentes" />);
  add(819.7, 825.0, () => <X.Cifra t={t} at={A("como 60 pesos el plato", 819)} out={824.8} x={1450} y={300} to={60} pre="$" post=" el plato" size={120} />);
  add(825.0, 829.8, () => <X.Card t={t} at={A("comen casi tres", 826)} out={829.6} x={960} y={220} from="up"><X.H s={60} c={CH.maiz}>CASI 3 PLATOS</X.H><X.H s={46} f={HAND}>por lo que cuesta uno en la fonda</X.H></X.Card>);

  // ===== resumen, tarea, comentarios, próximo, cierre =====
  add(834.2, 865.1, () => PLATES.map((q, i) => { const p = sc(t, q); return t >= RES[i] && !inAv(t) ? <X.PlateLabel key={i} t={t} at={RES[i]} out={864.9} x={p.x} y={p.y} n={i + 1} text={REST[i]} up={i % 2 ? 250 : 130} /> : null; }));
  add(868.5, 881.7, () => <X.Tarea t={t} at={A("no hagas los 7", 868)} out={881.5} x={1360} y={500} rows={[{ at: A("cuece el maiz aparte", 870), text: "el maíz aparte, sin sal" }, { at: A("y frie la salsa", 873), text: "la salsa, frita" }]} />);
  add(885.9, 897.7, () => <X.Encuesta t={t} at={A("cuentame aqui abajo", 885)} out={897.5} x={1340} y={440} q="¿TU POZOLE ES...?" a="rojo" b="blanco o verde" pa={-1} />);
  add(891, 897.7, () => <Pensado t={t} at={A("y de que parte eres", 890)} out={897.5} x={560} y={860} text="¿y de qué parte eres?" size={84} />);
  add(903.5, 914.5, () => <X.Proximo t={t} at={A("de mi abuela para los tamales", 900)} out={914.3} x={1300} y={460} big="TAMALES" small="los más esponjosos" />);
  add(909.2, 914.5, () => <X.Orden t={t} at={A("la prueba de la bolita", 905) - 0.2} out={914.3} nums={false} y={900} steps={[{ label: "la bolita en el agua", at: A("la prueba de la bolita", 905) }, { label: "la moneda en la olla", at: A("la moneda en la olla", 905) }, { label: "sin pleitos", at: A("si en la cocina hay pleito", 905) }]} />);
  add(919.0, END_T, () => <X.Cita t={t} at={A("que nunca te falte maiz", 918)} out={924.6} x={960} y={300} text="Que nunca te falte maíz en la olla." size={92} />);
  return L;
};

// ---------------- EL VIDEO ----------------
export const Rest: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const idx = PARTS.findIndex((p) => t >= p.a && t < p.b);
  if (inAv(t)) L.push(<Avatar key="av" t={t} />);
  else if (idx >= 0) {
    const p = PARTS[idx], nx = PARTS[idx + 1];
    if (p.c) {
      const portaled = idx > 0 && PARTS[idx - 1].pt && Math.abs(PARTS[idx - 1].b - p.a) < 1e-6;
      L.push(<Clip key={"c" + idx} k={p.c} t={t} a={portaled ? p.a - 0.7 : p.a} b={p.b} z={p.z} />);
    } else {
      L.push(<World key="w" t={t} />);
      if (p.pt && nx?.c && Math.abs(nx.a - p.b) < 1e-6) {
        const r = ei(t, p.b - 0.7, p.b);
        if (r > 0) { const q = sc(t, p.pt); L.push(<Portal key="pt" x={q.x} y={q.y} r={r}><Clip k={nx.c} t={t} a={p.b - 0.7} b={nx.b} z={nx.z} /></Portal>); }
      }
    }
  } else L.push(<World key="w" t={t} />);
  L.push(...Ov(t));
  // vapor en cada costura entre dos partes seguidas (salvo las que ya son portal)
  PARTS.forEach((p, i) => { const nx = PARTS[i + 1]; if (nx && Math.abs(nx.a - p.b) < 1e-6 && !(p.pt && nx.c) && Math.abs(t - p.b) < 0.4) L.push(<SteamWipe key={"sw" + i} t={t} mid={p.b} w={0.38} />); });
  // destello suave al entrar a cada secreto
  FLIP.forEach((a, i) => { if (Math.abs(t - a) < 0.5) L.push(<Flash key={"fl" + i} t={t} at={a} col="#fff1cf" peak={0.45} w={0.3} />); });
  const fin = e(t, END_T - 0.9, END_T - 0.1);
  if (fin > 0) L.push(<AbsoluteFill key="fin" style={{ background: `rgba(0,0,0,${fin})` }} />);
  return <AbsoluteFill style={{ background: "#0a0503" }}>{L}</AbsoluteFill>;
};
