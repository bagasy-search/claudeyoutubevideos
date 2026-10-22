// chtamal · EL VIDEO ENTERO (0 s → final). Un solo mundo y una sola cámara: la cocina de adobe con la vaporera de peltre de los
// tamales al centro, los siete platos (uno por secreto: al cerrar cada secreto su tamal se sirve), el recetario de mamá Cuca
// que pasa una hoja por secreto, la batea donde la manteca se vuelve crema, el vaso de la bolita, el remojo de las hojas,
// el fogón y el mercado. Entre mundo y toma real sólo portales y vapor; el avatar entra en sus ventanas.
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
export const END_T = 930.3; // voz 929,3 + 1 s de silencio
const A = (ph: string, after: number) => at(ph, after);

// ---------------- cámaras con nombre ----------------
type Cam = { p: V; l: V; fov?: number };
const CZ: V = [0, 1.1, -0.17];
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
  cazT: { p: [0.3, 1.95, 0.55], l: [0, 1.25, -0.17], fov: 30 }, cazT2: { p: [0.22, 1.8, 0.42], l: [0, 1.25, -0.17], fov: 27 },
  libro: { p: [1.12, 1.42, 0.28], l: [0.88, 0.82, -0.3], fov: 34 }, libro2: { p: [1.0, 1.2, 0.02], l: [0.88, 0.82, -0.3], fov: 30 },
  charola: { p: [-0.55, 1.3, 0.75], l: PT2.charola, fov: 34 }, charolaT: { p: [-0.72, 1.62, 0.4], l: PT2.charola, fov: 34 },
  remojo: { p: [1.05, 1.45, 0.15], l: PT2.remojo, fov: 34 }, remojo2: { p: [0.7, 1.18, -0.12], l: PT2.remojo, fov: 31 },
  patio: { p: [6.6, 1.75, 3.6], l: [10, 1.0, 0.8], fov: 42 }, patio2: { p: [6.9, 1.7, 3.4], l: [10, 1.0, 0.8], fov: 42 },
  mercado: { p: [6.6, 1.5, 7.6], l: [6.6, 0.95, 5.4], fov: 38 }, mercado2: { p: [6.25, 1.3, 6.7], l: [6.6, 0.95, 5.4], fov: 35 },
  salida: { p: [3.4, 2.9, 6.2], l: [0, 0.9, -0.6], fov: 44 },
  vaso: { p: [0.75, 1.12, 0.42], l: [0.56, 0.88, 0.02], fov: 28 }, vaso2: { p: [0.68, 1.04, 0.3], l: [0.56, 0.88, 0.02], fov: 25 },
};
PLATES.forEach((q, i) => { C["pl" + i] = { p: [q[0], 1.25, 0.95], l: [q[0], 0.82, 0.33], fov: 34 }; C["pl" + i + "b"] = { p: [q[0], 1.08, 0.7], l: [q[0], 0.82, 0.33], fov: 32 }; });

// ---------------- la línea de tiempo: partes de mundo (w) y tomas reales (c) entre las ventanas del avatar ----------------
type Part = { a: number; b: number; c?: string; k0?: string; k1?: string; pt?: V; z?: [number, number] };
const w = (a: number, b: number, k0: string, k1: string, pt?: V): Part => ({ a, b, k0, k1, pt });
const c = (a: number, b: number, id: string, z?: [number, number]): Part => ({ a, b, c: id, z });
const FIRE = PT.fire;
const PARTS: Part[] = [
  // gancho
  w(4.3, 9.6, "pl3", "pl3b"), c(9.6, 14.8, "p_despega"),
  w(20.8, 26.4, "top", "topB"), c(26.4, 33.1, "h_navidad"),
  c(39.2, 44.6, "h_tamal"), c(44.6, 51.6, "h_suegra"),
  c(56.5, 62.4, "h_lupe_fonda"), c(62.4, 68.1, "h_fonda"),
  w(72.5, 78.2, "wide", "top"), w(78.2, 84.1, "top", "topB"),
  // promesa
  w(88.4, 99.0, "topB", "topC"),
  // quién es Chayo + guía
  w(104.5, 110.6, "wide", "fogon", FIRE), w(110.6, 116.3, "fogon", "fogon2"),
  c(122.6, 128.0, "i_fogon"), c(128.0, 133.8, "i_cta"),
  w(138.1, 148.0, "libro", "libro2"),
  w(152.5, 157.4, "libro2", "libro"), c(157.4, 162.0, "s_abuela"), w(162.0, 165.8, "fogon2", "fogon"),
  // la historia
  c(169.7, 175.6, "s_nina"), w(175.6, 181.4, "remojo", "remojo2"),
  c(186.3, 191.0, "s_batea"), c(191.0, 196.2, "s_vecina"),
  w(201.9, 207.4, "wide", "wide2"), c(207.4, 213.9, "o_cantar"),
  w(217.8, 223.4, "cazT", "cazT2"), w(223.4, 229.5, "top", "topC"),
  c(233.7, 239.6, "z_familia"), w(239.6, 246.4, "caz", "cazL"),
  w(250.5, 257.2, "cazL2", "caz2"), c(257.2, 263.0, "s_olla"),
  // SECRETO 1 · la masa
  c(267.3, 272.4, "u_tortilleria"), c(272.4, 278.2, "u_dos_masas"),
  w(282.5, 288.2, "charola", "charolaT"), c(288.2, 295.7, "u_harina"),
  w(300.5, 306.0, "top", "topC"), w(306.0, 313.5, "pl0", "pl0b"),
  // SECRETO 2 · la manteca
  c(318.4, 323.4, "d_manteca"), w(323.4, 328.6, "charolaT", "charola"),
  c(332.7, 338.6, "d_batea"), c(338.6, 345.6, "d_puno"),
  w(351.8, 356.6, "cazT", "cazT2"), c(356.6, 363.5, "d_batidora"),
  w(369.5, 375.0, "charola", "charolaT"), w(375.0, 382.7, "pl1", "pl1b"),
  // SECRETO 3 · el caldo tibio
  c(387.5, 393.4, "t_dedo"), c(393.4, 399.6, "t_caldo"),
  c(404.9, 409.6, "t_suave"), c(409.6, 415.3, "t_sal"),
  w(420.5, 427.6, "charolaT", "charola"), w(427.6, 434.8, "pl2", "pl2b"),
  // SECRETO 4 · la bolita
  c(439.5, 444.6, "p_bolita"), w(444.6, 451.8, "vaso", "vaso2"),
  w(456.8, 461.4, "vaso2", "vaso"), c(461.4, 466.6, "b_flota"),
  c(472.5, 478.4, "c2_tamalada"), w(478.4, 485.9, "libro", "libro2"),
  w(490.0, 496.0, "libro2", "libro"), w(496.0, 502.0, "pl3", "pl3b"),
  // SECRETO 5 · las hojas
  c(507.4, 512.6, "h5_remojo"), w(512.6, 520.0, "remojo", "remojo2"),
  c(524.9, 530.0, "h5_escurrir"), c(530.0, 537.0, "h5_untar"),
  c(542.7, 547.6, "h5_crudo"), c(547.6, 550.4, "h5_relleno"), c(550.4, 553.0, "h5_doblar"),
  w(558.0, 563.4, "pl4", "pl4b"), c(563.4, 570.5, "o_moneda"),
  // SECRETO 6 · la moneda y los tamales parados
  w(573.8, 579.6, "cazT", "cazT2"), c(579.6, 586.1, "o_agua"),
  c(589.4, 594.6, "o_acomodar"), w(594.6, 599.4, "cazT2", "cazT"),
  c(604.5, 610.6, "o_trapo"), c(610.6, 616.9, "o_oreja"),
  c(620.3, 625.6, "b_sonrie"), w(625.6, 630.6, "pl5", "pl5b"),
  // SECRETO 7 · se despega y reposa
  c(636.3, 642.4, "l_sacar"), c(642.4, 649.1, "l_limpio"),
  w(654.3, 659.6, "cazT", "cazT2"), c(659.6, 666.8, "l_reposar"),
  w(671.0, 675.6, "caz", "caz2"), w(675.6, 680.3, "pl6", "pl6b"),
  // variantes
  c(685.1, 691.0, "v_rojos"), w(691.0, 697.7, "comal", "comal2"),
  c(701.5, 707.0, "v_dulce"), w(707.0, 712.7, "top", "topC"),
  c(716.9, 721.8, "v_congelar"), c(721.8, 727.4, "v_chencho"),
  w(732.4, 738.6, "topC", "top"), w(738.6, 744.9, "caz", "cazL"),
  c(750.8, 756.0, "p_masa"), w(756.0, 761.1, "fogon", "fogon2"),
  // lo que puede salir mal
  w(767.0, 773.0, "vaso", "vaso2"), w(773.0, 778.9, "charolaT", "charola"),
  c(782.6, 789.0, "l_pegado"), c(789.0, 795.8, "pr_aguada"),
  c(801.5, 806.4, "pr_quemado"), w(806.4, 811.9, "cazT", "cazT2"),
  // la cuenta
  c(817.3, 823.4, "din_mercado"), w(823.4, 830.3, "mercado", "mercado2"),
  w(834.8, 841.0, "top", "topB"), c(841.0, 847.5, "din_mesa"),
  // resumen, tarea, comentarios, próximo, cierre
  w(852.4, 862.5, "top", "topB"), w(867.0, 879.8, "topB", "top"),
  w(884.7, 890.4, "charola", "charolaT"), w(890.4, 896.8, "vaso", "vaso2"),
  w(902.6, 908.6, "caz", "cazL"), c(908.6, 915.3, "z_fogon"),
  w(920.4, 925.0, "fogon2", "fogon"), w(925.0, END_T, "caz", "salida"),
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
  { l: ["# Tamales de Navidad", "de Mamá Cuca", "", "100 a 150 en una noche", "olla alta con rejilla", "", "23 de diciembre"], r: ["los tamales no se cuecen", "si en la cocina hay pleito", "", "", "Refugio"] },
  { l: ["# 1. La masa", "masa para TAMAL", "martajada, quebradita", "no la de tortilla", "", "2 kg = 35 tamales"], r: ["6 kg = 100 tamales", "", "harina pa' tamal:", "con caldo tibio"] },
  { l: ["# 2. La manteca", "½ kg por 2 kg de masa", "de cerdo, la blanca", "batida SOLA primero", "", "10 minutos sin parar"], r: ["blanca como crema", "", "luego la masa", "a puños, poco a poco"] },
  { l: ["# 3. El caldo", "TIBIO, nunca frío", "que aguante el dedo", "una taza a la vez", "", "2 tazas pa' 2 kg"], r: ["sal: 1½ cucharada", "polvo: 1 cdita por kg", "", "suavecita, como", "pa' untar"] },
  { l: ["# 4. La bolita", "vaso de agua fría", "bolita como canica", "", "¿al fondo? batir 5 min", "¿flota? ya está"], r: ["el vaso siempre", "junto a la batea"] },
  { l: ["# 5. Las hojas", "agua caliente 1 hora", "un plato encima", "escurrir y secar", "", "lado liso, parte ancha"], r: ["delgadita:", "como medio dedo", "", "1 cda de relleno", "doblar y listo"] },
  { l: ["# 6. La olla", "agua sin tocar rejilla", "moneda de 10 pesos", "tin, tin, tin", "", "parados, punta arriba"], r: ["cama de hojas + trapo", "fuego medio", "hora y cuarto", "", "¡sin pleitos!"] },
  { l: ["# 7. ¿Ya están?", "sacar uno de en medio", "1 minuto y abrir", "", "se despega: listo", "pegado: 15 min más"], r: ["reposar tapados", "15 a 20 minutos", "", "firmes y", "esponjocitos"] },
];
const G = "chtamal/guia/";
const GUIA = [
  { l: ["@img:" + G + "l5_p65.jpg"], r: ["@img:" + G + "l5_p66.jpg"] },
  { l: ["@img:" + G + "l5_p68.jpg"], r: ["@img:" + G + "l5_p81.jpg"] },
  { l: ["@img:" + G + "l5_p83.jpg"], r: ["@img:" + G + "l5_p66.jpg"] },
];

// ---------------- tiempos clave ----------------
const SERVE = [307.0, 376.4, 429.0, 497.0, 559.0, 627.0, 677.0];           // el tamal del secreto i se sirve
const FLIP = [A("secreto numero 1", 255), A("secreto numero 2", 300), A("secreto numero 3", 368), A("secreto numero 4", 420), A("secreto numero 5", 500), A("secreto numero 6", 555), A("secreto numero 7", 630)];
const PROM = [A("que masa comprar", 80), A("que se bate primero", 84), A("con que se moja", 84), A("la prueba que te dice", 88), A("como se embarra", 88), A("lo que va en el fondo", 88), A("y como sabes", 88)];
const RES = [A("1 masa martajada", 850), A("2 la manteca", 850), A("3", 858), A("4", 866), A("5 las hojas", 865), A("6 la moneda", 865), A("y 7", 870)];
const G1 = A("se llama las cinco ollas", 136), G1P = A("en la pagina 65", 136), G2 = 478.4, G2P = A("en la pagina 68", 472), G3P = A("en la pagina 81", 488);
const isGuia = (t: number) => (t >= 133.8 && t < 157.4) || (t >= 478.4 && t < 496.0);

const worldAt = (t: number): WorldProps => {
  const guia = isGuia(t);
  const plateServed = PLATES.map((_, i) => Math.max(win(t, SERVE[i], SERVE[i] + 1.2), t < 12 && i === 3 ? 1 : 0));
  const plateOn = PLATES.map((_, i) => Math.max(
    win(t, PROM[i], PROM[i] + 0.3) * (1 - win(t, 98.8, 99.2)),
    win(t, SERVE[i] - 0.4, SERVE[i]) * (1 - win(t, SERVE[i] + 2, SERVE[i] + 3)),
    win(t, RES[i], RES[i] + 0.3) * (1 - win(t, 879.5, 879.8)),
  ));
  const k0 = partAt(t)?.k0 ?? "caz";
  // la batea: masa plana (amarilla) → batida (blanca y esponjosa)
  const batea = t >= 282 && t < 296 ? 0.15 : t >= 323 && t < 329 ? 0.25 + 0.6 * ei(t, 324, 328.4) : t >= 369.5 && t < 375 ? 0.9 : t >= 420.5 && t < 427.6 ? 1 : t >= 773 && t < 779 ? 0.5 + 0.4 * ei(t, 774, 778) : t >= 884.7 && t < 890.4 ? 1 : 0;
  // el vaso: la bolita se hunde (0..1) o flota (>1)
  const bolita = t >= 444.6 && t < 451.8 ? (t < A("si la bolita flota", 448) ? Math.min(1, ei(t, 445.2, 447.2) + 0.02) : 1.5) : t >= 456.8 && t < 461.4 ? 1.5 : t >= 767 && t < 773 ? Math.min(1, ei(t, 767.5, 769.5) + 0.02) : t >= 890.4 && t < 896.8 ? 1.5 : 0;
  return {
    t,
    night: Math.max(t >= 162 && t < 165.8 ? 0.6 : 0, win(t, 925.0, 929.5) * 0.55),
    fire: 1 + (t >= 806.4 && t < 812 ? 0.5 : 0),
    steamCaz: /^cazT/.test(k0) ? 0.5 : /^(caz|pl)/.test(k0) ? 1 : /^top/.test(k0) ? 0.4 : 0.25,
    steamComal: /^comal/.test(k0) ? 0.18 : 1,
    ojitos: 0.6,
    plateOn, plateServed, plateSteam: plateServed.map((v) => 0.16 * v),
    book: guia
      ? { open: ei(t, t < 300 ? G1 + 0.2 : G2, (t < 300 ? G1 + 0.2 : G2) + 1.2), flip: t < 300 ? ei(t, G1P, G1P + 0.9) : 1 + ei(t, G2P, G2P + 0.9) * 0 + ei(t, G3P, G3P + 0.9), pages: GUIA }
      : { open: 1, flip: FLIP.reduce((acc, f) => acc + ei(t, f, f + 0.9), 0), pages: RECETARIO },
    guia: guia ? 1 : 0,
    cover: G + "cov_l5.png",
    partyPeople: (t >= 201.9 && t < 207.4) || t >= 924 ? 1 : 0,
    patioLights: Math.max(t >= 201.9 && t < 207.4 ? 1 : 0, win(t, 925, 929)),
    chiles: t >= 691 && t < 697.7 ? 4 : 0, toast: t >= 691 && t < 697.7 ? 0.5 : 0, burnt: 0,
    sarten: t >= 691 && t < 697.7 ? 1 : 0, fry: 0, salsa: t >= 691 && t < 697.7 ? 0.2 + 0.8 * ei(t, 693, 697) : 0,
    remojo: (t >= 175.6 && t < 181.4) || (t >= 512.6 && t < 520) ? 1 : 0, hojas: (t >= 175.6 && t < 181.4) || (t >= 512.6 && t < 520) ? 1 : 0,
    tapa: t >= 512.6 && t < 520 ? win(t, A("con un plato encima", 512), A("con un plato encima", 512) + 0.6) : 0,
    batea, bolita,
    abierta: (t >= 573.8 && t < 579.6) || (t >= 806.4 && t < 812) ? 0.15 : t >= 594.6 && t < 599.4 ? 1 - ei(t, A("encima otra capa de hojas", 594), A("encima otra capa de hojas", 594) + 2) : 1,
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
const PROMT = ["qué masa comprar", "qué se bate primero", "con qué se moja", "la prueba que no falla", "cómo se embarra", "lo del fondo de la olla", "cómo saber si ya"];
const REST = ["masa martajada", "manteca sola, blanca", "caldo tibio", "la bolita flota", "hoja delgadita", "moneda · parados", "se despega · reposa"];
const VASO: V = [0.56, 0.88, 0.02];
const Ov = (t: number): React.ReactNode[] => {
  const L: React.ReactNode[] = [];
  const on = (a: number, b: number) => t >= a - 0.4 && t < b + 0.6;
  const add = (a: number, b: number, f: () => React.ReactNode) => { if (on(a, b)) L.push(<React.Fragment key={"o" + a.toFixed(2) + "_" + L.length}>{f()}</React.Fragment>); };
  const tg = (a: number, b: number, q: V, ph: string, after: number, text: string, sub: string | undefined, dx: number, dy: number, col: string = CH.maiz, size = 56) =>
    add(a, b, () => { const p = sc(t, q); return <Tag t={t} at={A(ph, after)} x={p.x} y={p.y} dx={dx} dy={dy} text={text} sub={sub} col={col} out={b - 0.2} size={size} />; });

  // ===== gancho =====
  tg(4.3, 9.6, PL(3), "se despega solito", 4, "SE DESPEGA SOLITO", "ESPONJOCITO COMO PAN", 300, -230);
  add(9.6, 14.8, () => <Pill t={t} at={A("no es la harina cara", 9)} out={14.6} x={1400} y={260} text="HARINA CARA" />);
  add(20.8, 26.4, () => <><BigNum t={t} at={20.9} out={24.6} text="7 SECRETOS" size={150} y={470} col={CH.maiz} edge="#5a2a10" sub="DE MI ABUELA" /><Stamp t={t} at={A("las fondas ya no hacen", 19)} out={26.2} text="LAS FONDAS YA NO" x={1420} y={260} size={64} col={CH.maiz} /></>);
  add(26.4, 33.1, () => <X.Card t={t} at={A("es 24 de diciembre", 25)} out={32.9} x={470} y={230} from="left"><X.H s={58} c={CH.maiz}>24 DE DICIEMBRE</X.H><X.H s={44} f={HAND}>los tamales de toda la familia</X.H></X.Card>);
  add(39.2, 44.6, () => <><X.Cronometro t={t} at={A("tres horas en la olla", 38)} out={44.4} x={1560} y={360} mins={180} label="3 HORAS EN LA OLLA" /><Pill t={t} at={A("pegado a la hoja", 40)} out={44.4} x={480} y={260} text="PEGADO A LA HOJA" /></>);
  add(44.6, 51.6, () => <><X.Card t={t} at={A("mazacote", 43)} out={51.4} x={460} y={240} from="left"><X.H s={58} c="#ff8a6a">MAZACOTE</X.H><X.H s={44} f={HAND}>crudo en el centro</X.H></X.Card><Nota t={t} at={A("no dice nada", 46)} out={51.4} x={1480} y={300} lines={["...y no dice", "nada."]} rot={4} w={380} /></>);
  add(51.6, 57.0, () => <LowerThird t={t} at={A("mi viejo lupe", 50)} out={57.0} name="LUPE" l2="MI VIEJO · FONDA EN MORELIA" l2at={A("en una fonda en morelia", 50)} />);
  add(56.5, 62.4, () => <Precio t={t} at={A("25 pesos cada uno", 55)} out={62.2} x={1440} y={140} top="$25" sub="CADA TAMAL" />);
  add(62.4, 71.9, () => <><X.Card t={t} at={A("pesado como piedra", 58)} out={68.0} x={460} y={240} from="left"><X.H s={56} c="#ff8a6a">DURO COMO PIEDRA</X.H><X.H s={44} f={HAND}>con un hilito de carne</X.H></X.Card>
    <X.Burbujas t={t} out={71.9} items={[{ at: A("y como le hace usted", 62), x: 1400, y: 300, text: "¿Y cómo le hace pa' que quede así?", rot: 3 }, { at: A("eso no se dice", 66), x: 560, y: 600, text: "¡Ay señora, eso no se dice!", rot: -4 }]} /></>);
  add(72.5, 78.2, () => <X.Card t={t} at={A("esto es lo que te voy a dar", 70)} out={78.0} x={960} y={170} from="up"><X.H s={60} c={CH.maiz}>7 SECRETOS · EN SU ORDEN</X.H></X.Card>);

  // ===== promesa: cada plato se enciende con su secreto =====
  add(78.2, 99.0, () => PLATES.map((q, i) => { const p = sc(t, q); return t >= PROM[i] && !inAv(t) ? <X.PlateLabel key={i} t={t} at={PROM[i]} out={98.8} x={p.x} y={p.y} n={i + 1} text={PROMT[i]} up={i % 2 ? 250 : 130} /> : null; }));

  // ===== quién es Chayo =====
  add(104.5, 113, () => <LowerThird t={t} at={A("yo soy rosario", 102)} out={113} name="DOÑA CHAYO" l2="67 AÑOS · PÁTZCUARO" l2at={A("tengo 67 anos", 102)} />);
  add(110.6, 116.3, () => <X.MapaMich t={t} at={A("en michoacan", 106)} out={116.1} x={1380} y={430} />);
  add(122.6, 128.0, () => <X.Orden t={t} at={122.7} out={127.8} nums={false} steps={[{ label: "Navidad", at: A("de navidad", 118) }, { label: "2 de febrero", at: A("del 2 de febrero", 118) }, { label: "bautizos", at: A("de los bautizos", 118) }]} />);
  add(122.6, 128.0, () => <Nota t={t} at={A("nunca sola", 120)} out={127.8} x={1500} y={300} lines={["En familia.", "Nunca sola."]} rot={4} w={380} />);
  add(128.0, 133.8, () => <X.Card t={t} at={A("lo escribi", 125)} out={133.6} x={1450} y={280} from="right"><X.H s={50} c={CH.maiz}>LO ESCRIBÍ TODO</X.H><X.H s={44} f={HAND}>cantidades · tiempos · lo que cuesta</X.H></X.Card>);
  add(138.1, 148.0, () => <><X.Card t={t} at={G1} out={147.8} x={470} y={170} from="left" col="#ff8fbf"><X.H s={50} c="#ff8fbf">LAS 5 OLLAS DE DOÑA CHAYO</X.H></X.Card>
    <X.GuiaPag t={t} at={G1P} out={147.8} x={1530} y={820} pag="Libro 5 · pág. 65" text="Los 100 Tamales de Navidad" /></>);
  add(152.5, 157.4, () => <><X.Card t={t} at={A("con su champurrado", 146)} out={157.2} x={470} y={200} from="left"><X.H s={46} f={HAND}>rojos · verdes · rajas · dulce</X.H><X.H s={46} f={HAND}>y su champurrado</X.H></X.Card><X.DescCard t={t} at={A("el link esta", 148)} out={157.2} x={1440} y={760} hl={A("primera linea", 148)} /></>);
  add(157.4, 162.0, () => <X.FotoVieja t={t} at={157.5} out={161.8} x={1360} y={460} src="s_abuela" w={700} rot={4} cap="Mamá Cuca" />);
  add(162.0, 165.8, () => <X.Card t={t} at={A("el 23 de diciembre", 156)} out={165.6} x={470} y={230} from="left"><X.H s={58} c={CH.maiz}>23 DE DICIEMBRE</X.H><X.H s={44} f={HAND}>en la tarde, ya estaban...</X.H></X.Card>);

  // ===== la historia =====
  add(169.7, 175.6, () => <X.Orden t={t} at={169.8} out={175.4} nums={false} steps={[{ label: "mi mamá", at: 169.8 }, { label: "mis tías", at: A("mis tias", 164) }, { label: "Licha", at: A("mi hermana licha", 164) }, { label: "la comadre Cuca", at: A("la comadre cuca", 164) }, { label: "y yo", at: A("y yo que era", 166) }]} />);
  tg(175.6, 181.4, PT2.remojo, "lavar las hojas", 170, "A MÍ ME TOCABA", "LAVAR LAS HOJAS", 300, -220);
  add(186.3, 191.0, () => <X.Cronometro t={t} at={A("una hora entera", 182)} out={190.8} x={1560} y={360} mins={60} label="UNA HORA, A MANO" />);
  add(191.0, 201.9, () => <X.Burbujas t={t} out={201.7} items={[{ at: A("por que los tamales de usted", 186), x: 1380, y: 280, text: "¿Por qué los de usted son esponjosos?", rot: 3 }, { at: A("porque la vecina no bate", 190), x: 560, y: 600, text: "La vecina no bate: dos minutos y se cansa.", rot: -4 }]} />);
  add(207.4, 217.8, () => <X.Orden t={t} at={A("las mujeres embarraban", 200)} out={217.6} nums={false} steps={[{ label: "las mujeres embarraban", at: A("las mujeres embarraban", 200) }, { label: "las niñas lavábamos hojas", at: A("las ninas lavabamos", 200) }, { label: "los hombres, el fuego", at: A("y los hombres cuidaban", 204) }]} />);
  add(217.8, 229.5, () => <><X.Fondo o={0.4 * e(t, 224, 224.5) * (1 - e(t, 229, 229.4))} /><X.Cita t={t} at={A("si estaba bueno se cantaba", 216)} out={229.2} x={960} y={500} text="Si estaba bueno, se cantaba. Si no, se batía más." who="MAMÁ CUCA" size={84} /></>);
  add(229.5, 239.6, () => <X.Gente t={t} at={A("eran 100", 224)} out={239.4} x={1350} y={380} n={100} label="tamales en una noche" />);
  add(239.6, 250.5, () => { const p = sc(t, CZ); return <Tag t={t} at={A("una olla grande alta", 234)} x={p.x} y={p.y} dx={330} dy={-230} text="OLLA ALTA" sub="DE PELTRE · CON REJILLA" col="#8fc4ff" out={250.3} size={60} />; });
  add(250.5, 257.2, () => <X.CorteOllas t={t} at={A("la olla bajita", 245)} out={257.0} x={960} y={840} n={1} badAt={A("se encharcan", 246)} />);
  add(257.2, 263.0, () => <X.Banda t={t} at={A("secreto numero 1", 252)} out={262.8} n={1} text="MASA PARA TAMAL, NO LA DE TORTILLA" />);

  // ===== SECRETO 1 · la masa =====
  add(267.3, 272.4, () => <Pill t={t} at={A("sale duro", 262)} out={272.2} x={1400} y={260} text="MASA DE TORTILLA" />);
  add(272.4, 278.2, () => <X.Versus t={t} at={A("la masa de tortilla es muy fina", 264)} out={278.0} x={960} y={300} a="PARA TAMAL" b="DE TORTILLA" w={980} rows={[["martajada, quebradita", true, false], ["fina y aguada", false, true]]} />);
  add(278.2, 282.5, () => <X.Card t={t} at={A("deme masa para tamal", 272)} out={282.4} x={960} y={880} from="down"><X.H s={56} f={HAND}>"Deme masa para tamal."</X.H></X.Card>);
  tg(282.5, 288.2, PT2.charola, "deja espacio para que entre el aire", 276, "EL AIRE", "LO QUE LO HACE ESPONJOSO", 300, -220, CH.crema, 58);
  add(288.2, 295.7, () => <X.Card t={t} at={A("la harina de maiz", 282)} out={295.5} x={1440} y={280} from="right"><X.H s={48} c={CH.maiz}>¿SIN MASA FRESCA?</X.H><X.H s={44} f={HAND}>harina "para tamales" + caldo tibio</X.H></X.Card>);
  add(295.7, 306.0, () => <X.Conteo t={t} out={305.8} x={1500} y={430} rows={[{ label: "100 TAMALES", n: 6, at: A("6 kilos de masa", 292), c: "#f2dd9e" }, { label: "35 TAMALES", n: 2, at: A("2 kilos", 296), c: "#e3c97a" }]} />);
  tg(306.0, 313.5, PL(0), "secreto numero 2", 298, "PLATO 1", "SERVIDO", 220, -220, CH.maiz, 52);
  add(306.6, 318.4, () => <X.Banda t={t} at={A("secreto numero 2", 298)} out={318.2} n={2} text="LA MANTECA SE BATE SOLA, PRIMERO" />);

  // ===== SECRETO 2 · la manteca =====
  add(313.5, 318.4, () => <X.Card t={t} at={A("todo junto", 306)} out={318.2} x={460} y={600} from="left"><X.H s={50} c="#ff8a6a">TODO JUNTO = SIN AIRE</X.H></X.Card>);
  tg(323.4, 328.6, PT2.charola, "blanca como crema batida", 316, "BLANCA COMO CREMA", "BATIDA Y ESPONJOSA", 140, -300, CH.crema, 52);
  add(328.6, 338.6, () => <X.Cronometro t={t} at={A("10 minutos", 320)} out={338.4} x={1560} y={360} mins={10} label="SIN PARAR · 2 KG DE MASA" />);
  add(332.7, 338.6, () => <X.Versus t={t} at={A("medio kilo de manteca", 326)} out={338.4} x={600} y={300} a="DE CERDO" b="VEGETAL" w={760} rows={[["½ kg, la blanca", true, false]]} />);
  add(338.6, 351.8, () => <X.Globitos t={t} at={A("se llena de burbujitas", 332)} out={351.6} x={960} y={520} />);
  add(351.8, 356.6, () => <Stamp t={t} at={A("por eso el tamal se infla", 345)} out={356.4} text="¡SE INFLA!" x={1400} y={280} size={90} />);
  add(356.6, 369.5, () => <X.Versus t={t} at={A("si tienes batidora", 350)} out={369.3} x={960} y={300} a="A MANO" b="BATIDORA" w={900} rows={[["1 hora", true, false], ["20 minutos", false, true]]} />);
  add(369.5, 375.0, () => <Palomita t={t} at={A("lo que importa es el aire", 362)} out={374.8} y={230} text="IMPORTA EL AIRE, NO EL BRAZO" />);
  tg(375.0, 382.7, PL(1), "secreto numero 3", 366, "PLATO 2", "SERVIDO", 220, -220, CH.maiz, 52);
  add(373.0, 382.7, () => <X.Banda t={t} at={A("secreto numero 3", 366)} out={382.5} n={3} text="LA MASA SE MOJA CON CALDO TIBIO" />);

  // ===== SECRETO 3 · el caldo tibio =====
  add(382.7, 393.4, () => <X.Card t={t} at={A("que metas el dedo", 380)} out={393.2} x={1440} y={280} from="right"><X.H s={64} c={CH.maiz}>TIBIO</X.H><X.H s={44} f={HAND}>que metas el dedo y aguantes</X.H></X.Card>);
  add(393.4, 404.9, () => <X.Tazas t={t} at={A("una taza a la vez", 386)} out={404.7} x={1440} y={460} n={2} dt={2.2} label="2 TAZAS PA' 2 KG" />);
  add(404.9, 409.6, () => <X.Card t={t} at={A("como para untar", 398)} out={409.4} x={1440} y={260} from="right"><X.H s={50} f={HAND}>suavecita, como pa' untar</X.H></X.Card>);
  add(409.6, 415.3, () => <X.IconRow t={t} out={415.1} x={960} y={880} items={[{ k: "sal", label: "1½ cda de sal", at: A("una cucharada y media", 403), c: "#ffffff" }, { k: "polvo", label: "1 cdita polvo por kg", at: A("una cucharadita de polvo", 403), c: "#d8402a" }]} />);
  add(415.3, 420.5, () => <Pill t={t} at={A("el polvo a punos", 408)} out={420.3} x={1400} y={260} text="POLVO A PUÑOS" />);
  add(420.5, 427.6, () => <Palomita t={t} at={A("el que levanta el tamal es el batido", 413)} out={427.4} y={230} text="LO LEVANTA EL BATIDO, NO EL POLVO" />);
  tg(427.6, 434.8, PL(2), "la prueba de la bolita", 419, "PLATO 3", "SERVIDO", 220, -220, CH.maiz, 52);
  add(426.0, 434.8, () => <X.Banda t={t} at={A("secreto numero 4", 419)} out={434.6} n={4} text="LA PRUEBA DE LA BOLITA" />);

  // ===== SECRETO 4 · la bolita =====
  add(439.5, 444.6, () => <X.Card t={t} at={A("tamano de una canica", 439)} out={444.4} x={1440} y={260} from="right"><X.H s={50} c={CH.maiz}>COMO UNA CANICA</X.H><X.H s={44} f={HAND}>al vaso de agua fría</X.H></X.Card>);
  tg(444.6, 451.8, VASO, "si se va al fondo", 437, "AL FONDO", "LE FALTA AIRE · 5 MIN MÁS", -330, -200, "#ff8a6a", 60);
  add(447.5, 451.8, () => <Stamp t={t} at={A("si la bolita flota", 440)} out={451.6} text="¡FLOTA!" x={1400} y={260} size={110} col={CH.maiz} />);
  tg(456.8, 461.4, VASO, "pesa menos que el agua", 449, "PESA MENOS QUE EL AGUA", "POR EL AIRE", -330, -200, CH.crema, 50);
  add(461.4, 466.6, () => <X.Cita t={t} at={A("y si la masa flota en el vaso", 453)} out={466.4} x={960} y={880} text="Si flota en el vaso, se infla en la olla." size={70} />);
  add(472.5, 478.4, () => <X.Card t={t} at={A("la tamalada te toca a ti", 465)} out={478.2} x={470} y={240} from="left"><X.H s={50} c={CH.maiz}>¿TE TOCA LA TAMALADA?</X.H></X.Card>);
  add(478.4, 485.9, () => <X.GuiaPag t={t} at={G2P} out={485.7} x={1530} y={820} pag="Libro 5 · pág. 68" text="La lista del mercado pa' 100 tamales" />);
  add(485.9, 496.0, () => <X.Versus t={t} at={486.0} out={495.8} x={560} y={300} a="$15" b="$18-25" w={760} rows={[["por tamal", true, false]]} />);
  add(490.0, 496.0, () => <X.GuiaPag t={t} at={G3P} out={495.8} x={1530} y={820} pag="Libro 5 · pág. 81" text="Si no flota o se pega a la hoja" />);
  add(496.0, 502.0, () => <Palomita t={t} at={A("la guia ya se pago sola", 488)} out={501.8} y={230} text="LA GUÍA YA SE PAGÓ SOLA" />);
  add(498.0, 502.0, () => <X.DescCard t={t} at={A("el link esta", 494)} out={501.8} x={1440} y={760} hl={A("primera linea", 494)} />);
  tg(496.0, 502.0, PL(3), "la guia ya se pago sola", 488, "PLATO 4", "SERVIDO", 220, -220, CH.maiz, 52);
  add(502.0, 512.6, () => <X.Banda t={t} at={A("secreto numero 5", 495)} out={512.4} n={5} text="LA HOJA SE REMOJA Y SE EMBARRA DELGADITO" />);

  // ===== SECRETO 5 · las hojas =====
  add(507.4, 512.6, () => <X.Cronometro t={t} at={A("una hora antes", 500)} out={512.4} x={1560} y={360} mins={60} label="AGUA CALIENTE · 1 HORA" />);
  tg(512.6, 520.0, PT2.remojo, "con un plato encima", 504, "UN PLATO ENCIMA", "PA' QUE NO FLOTEN", 300, -200);
  add(524.9, 530.0, () => <Pill t={t} at={A("una hoja mojada de mas", 517)} out={529.8} x={1400} y={260} text="HOJA MOJADA DE MÁS" />);
  add(530.0, 537.0, () => <X.Senales t={t} out={536.8} x={1440} y={430} title="ASÍ SE EMBARRA" rows={[{ at: A("por el lado liso", 522), text: "por el lado liso" }, { at: A("en la parte ancha", 524), text: "en la parte ancha" }, { at: A("con una cuchara grande", 525), text: "cuchara grande o la palma" }]} />);
  add(537.0, 547.6, () => <X.Card t={t} at={A("queda crudo en el centro", 532)} out={547.4} x={460} y={260} from="left"><X.H s={50} c="#ff8a6a">MUCHA MASA</X.H><X.H s={44} f={HAND}>= crudo en el centro</X.H></X.Card>);
  add(547.6, 553.0, () => <X.Orden t={t} at={A("una cucharada de relleno", 540)} out={552.8} nums={false} steps={[{ label: "carne en su salsa", at: A("la carne en su salsa", 540) }, { label: "rajas con queso", at: A("las rajas con queso", 541) }]} />);
  tg(558.0, 563.4, PL(4), "este te va a hacer reir", 549, "PLATO 5", "SERVIDO", 220, -220, CH.maiz, 52);
  add(558.4, 563.4, () => <X.Banda t={t} at={A("secreto numero 6", 549)} out={563.2} n={6} text="UNA MONEDA EN EL FONDO DE LA OLLA" />);
  add(563.4, 570.5, () => <X.Card t={t} at={A("una moneda de 10 pesos", 556)} out={570.3} x={1440} y={260} from="right"><X.H s={64} c={CH.maiz}>$10</X.H><X.H s={44} f={HAND}>al fondo, bajo la rejilla</X.H></X.Card>);

  // ===== SECRETO 6 · la moneda =====
  add(573.8, 579.6, () => <X.Onoma t={t} at={A("tin tin tin", 566)} out={579.4} x={1350} y={330} text="¡TIN, TIN, TIN!" size={110} />);
  add(579.6, 586.1, () => <X.Senales t={t} out={585.9} x={480} y={420} title="LA MONEDA TE AVISA" rows={[{ at: A("mientras suene hay agua", 570), text: "suena: hay agua" }, { at: A("si deja de sonar", 572), text: "calla: echa agua caliente" }]} />);
  add(589.4, 594.6, () => <X.Card t={t} at={A("los tamales van parados", 582)} out={594.4} x={1440} y={260} from="right"><X.H s={52} c={CH.maiz}>PARADOS</X.H><X.H s={44} f={HAND}>punta arriba, sin apretar</X.H></X.Card>);
  add(594.6, 599.4, () => <X.Orden t={t} at={A("encima otra capa de hojas", 587)} out={599.2} nums={false} steps={[{ label: "otra capa de hojas", at: A("encima otra capa de hojas", 587) }, { label: "un trapo limpio", at: A("un trapo limpio", 590) }, { label: "la tapa", at: A("y la tapa", 592) }]} />);
  add(599.4, 610.6, () => <X.Cronometro t={t} at={A("hora y cuarto", 592)} out={610.4} x={1560} y={360} mins={75} label="FUEGO MEDIO · 1¼ A 1½ H" />);
  add(610.6, 616.9, () => <><X.Fondo o={0.4 * e(t, 612, 612.5) * (1 - e(t, 616.4, 616.8))} /><X.Cita t={t} at={A("que los tamales no se cuecen", 604)} out={616.6} x={960} y={500} text="Los tamales no se cuecen si en la cocina hay pleito." who="MAMÁ CUCA" size={84} /></>);
  add(620.3, 625.6, () => <X.Card t={t} at={A("todos cantaban", 613)} out={625.4} x={1440} y={260} from="right"><X.H s={50} c={CH.maiz}>TODOS CANTABAN</X.H><X.H s={44} f={HAND}>el enojado, a la tienda</X.H></X.Card>);
  tg(625.6, 630.6, PL(5), "a lo mejor no es ciencia", 617, "PLATO 6", "SERVIDO", 220, -220, CH.maiz, 52);
  add(630.6, 641, () => <X.Banda t={t} at={A("secreto numero 7", 623)} out={640.8} n={7} text="SE DESPEGA SOLO Y REPOSA" />);

  // ===== SECRETO 7 · se despega y reposa =====
  add(636.3, 642.4, () => <X.Card t={t} at={A("sacas un tamal de en medio", 629)} out={642.2} x={1440} y={260} from="right"><X.H s={50} c={CH.maiz}>UNO DE EN MEDIO</X.H><X.H s={44} f={HAND}>no de la orilla</X.H></X.Card>);
  add(642.4, 649.1, () => <Palomita t={t} at={A("si la masa se despega solita", 636)} out={648.9} y={230} text="SE DESPEGA SOLITA: LISTO" />);
  add(654.3, 659.6, () => <X.Cronometro t={t} at={A("15 minutos mas", 646)} out={659.4} x={1560} y={360} mins={15} label="PEGADO: 15 MIN MÁS" />);
  add(659.6, 666.8, () => <X.Cronometro t={t} at={A("los dejas reposar", 652)} out={666.6} x={1560} y={360} mins={20} label="REPOSO · TAPADOS" />);
  add(663.0, 666.8, () => <Stamp t={t} at={A("casi nadie hace", 656)} out={666.6} text="CASI NADIE LO HACE" x={600} y={860} size={58} />);
  add(671.0, 680.3, () => <X.Card t={t} at={A("se asienta y queda firme", 664)} out={680.1} x={1440} y={260} from="right"><X.H s={50} c={CH.maiz}>FIRME Y ESPONJOCITO</X.H><X.H s={44} f={HAND}>si lo abres luego luego, parece crudo</X.H></X.Card>);
  tg(675.6, 680.3, PL(6), "y los vuelves a cocer", 667, "PLATO 7", "SERVIDO", 220, -220, CH.maiz, 52);
  add(680.3, 685.1, () => <BigNum t={t} at={A("tres cosas mas", 673)} out={684.9} text="3 MÁS" size={150} y={420} col={CH.maiz} edge="#5a2a10" sub="EN EL RANCHO NADA SE REPETÍA" />);

  // ===== variantes =====
  add(685.1, 697.7, () => <X.Card t={t} at={A("la primera los rojos", 678)} out={697.5} x={460} y={220} from="left"><X.H s={52} c={CH.maiz}>1 · ROJOS DE CERDO</X.H></X.Card>);
  add(691.0, 697.7, () => <Palomita t={t} at={A("esa salsa se frie", 684)} out={697.5} y={880} text="LA SALSA SE FRÍE" />);
  add(701.5, 712.7, () => <X.Card t={t} at={A("la segunda los de dulce", 694)} out={712.5} x={460} y={220} from="left"><X.H s={52} c="#ff8fbf">2 · DE DULCE</X.H></X.Card>);
  add(707.0, 712.7, () => <X.Orden t={t} at={A("azucar o piloncillo", 696)} out={712.5} nums={false} y={880} steps={[{ label: "piloncillo", at: A("azucar o piloncillo", 696) }, { label: "pasitas", at: A("pasitas", 698) }, { label: "canela", at: A("una pizca de canela", 698) }, { label: "rosita", at: A("colorante rosita", 700) }]} />);
  add(716.9, 727.4, () => <X.Card t={t} at={A("se congelan muy bien", 709)} out={727.2} x={460} y={220} from="left"><X.H s={52} c={CH.maiz}>3 · LO QUE SOBRA</X.H><X.H s={44} f={HAND}>al congelador, en su hoja</X.H></X.Card>);
  add(721.8, 727.4, () => <LowerThird t={t} at={A("mi hermano chencho", 712)} out={727.2} name="CHENCHO" l2="MI HERMANO · TAMAL DORADO" l2at={A("los doran el comal", 714)} />);
  add(732.4, 750.8, () => <X.Card t={t} at={A("los verdes de pollo", 726)} out={750.6} x={460} y={220} from="left"><X.H s={48} c={CH.nopal}>VERDES DE POLLO</X.H><X.H s={48} c={CH.maiz}>RAJAS CON QUESO</X.H></X.Card>);
  add(750.8, 761.1, () => <X.IconRow t={t} out={760.9} x={960} y={880} items={[
    { k: "masa", label: "masa en agua fría", at: A("masa de maiz disuelta", 743), c: "#f2dd9e" }, { k: "agua", label: "leche", at: A("con leche", 745), c: "#ffffff" },
    { k: "manteca", label: "chocolate de mesa", at: A("chocolate de mesa", 745), c: "#5a2a14" }, { k: "queso", label: "piloncillo", at: A("y piloncillo", 747), c: "#8a4a1a" }]} />);
  add(756.0, 761.1, () => <X.Card t={t} at={756.1} out={760.9} x={960} y={200} from="up"><X.H s={60} c={CH.maiz}>CHAMPURRADO</X.H></X.Card>);

  // ===== lo que puede salir mal =====
  add(761.1, 770.0, () => <BigNum t={t} at={A("lo que puede salir mal", 756)} out={769.8} text="SI ALGO SALE MAL" size={130} y={420} col={CH.crema} edge="#4a1a0c" />);
  add(770.0, 782.6, () => <X.FixCard t={t} at={A("si la masa no flota", 762)} out={782.4} x={960} y={860} prob="NO FLOTA" fix={["batir 10 min más", "manteca blanda + 5 min"]} fixAt={A("bate 10 minutos mas", 764)} />);
  add(782.6, 789.0, () => <X.FixCard t={t} at={A("si los tamales se pegaron", 774)} out={788.8} x={960} y={860} prob="SE PEGAN A LA HOJA" fix={["15 min más en la olla", "despegar tibios"]} fixAt={A("regresalos a la olla", 776)} />);
  add(789.0, 801.5, () => <X.FixCard t={t} at={A("si la masa quedo aguada", 782)} out={801.3} x={960} y={860} prob="AGUADA Y PESADA" fix={["mucho caldo: batir más", "otro poco de masa"]} fixAt={A("bate mas", 788)} />);
  add(801.5, 807.8, () => <X.FixCard t={t} at={A("si se quemo el fondo", 794)} out={807.6} x={960} y={860} prob="SE QUEMÓ EL FONDO" fix={["los de arriba, a otra olla", "los de abajo, fuera"]} fixAt={A("apaga", 796)} />);
  tg(806.4, 811.9, CZ, "por eso la moneda", 798, "POR ESO LA MONEDA", undefined, 330, -230, CH.maiz, 58);

  // ===== la cuenta =====
  add(811.9, 823.4, () => <Precio t={t} at={A("25 pesos un tamal", 804)} out={823.2} x={1440} y={140} top="$25" sub="UN TAMAL EN LA FONDA" />);
  add(817.3, 841.0, () => <Receipt t={t} rows={[
    { at: A("unos 45 pesos", 810), item: "masa 2 kg", $: 45 }, { at: A("unos 30", 812), item: "manteca ½ kg", $: 30 }, { at: A("unos 40", 814), item: "hojas", $: 40 },
    { at: 830.4, item: "maciza 1½ kg", $: 210 }, { at: A("unos 40 pesos mas", 824), item: "chiles, cebolla, ajo", $: 40 }]}
    totalAt={A("todo junto unos 365", 826)} x={120} y={110} out={840.8} sc={1.12} title="LA TANDA · 35 TAMALES" />);
  add(841.0, 847.5, () => <X.Cifra t={t} at={A("son como 10 pesos", 832)} out={847.3} x={1450} y={300} to={10} pre="$" post=" cada uno" size={120} />);
  add(847.5, 852.4, () => <Palomita t={t} at={A("en tu casa haces cinco", 839)} out={852.2} y={230} text="EN TU CASA HACES 5" />);

  // ===== resumen, tarea, comentarios, próximo, cierre =====
  add(852.4, 879.8, () => PLATES.map((q, i) => { const p = sc(t, q); return t >= RES[i] && !inAv(t) ? <X.PlateLabel key={i} t={t} at={RES[i]} out={879.6} x={p.x} y={p.y} n={i + 1} text={REST[i]} up={i % 2 ? 250 : 130} /> : null; }));
  add(884.7, 896.8, () => <X.Tarea t={t} at={A("no hagas los 7", 876)} out={896.6} x={1360} y={500} rows={[{ at: A("bate la manteca sola", 877), text: "la manteca sola, primero" }, { at: A("y haz la prueba de la bolita", 879), text: "la prueba de la bolita" }]} />);
  add(902.6, 908.6, () => <X.Encuesta t={t} at={902.7} out={908.4} x={1340} y={440} q="¿EN TU CASA SE ENVUELVEN EN...?" a="hoja de maíz" b="hoja de plátano" pa={-1} />);
  add(904, 908.6, () => <Pensado t={t} at={A("y de que parte eres", 894)} out={908.4} x={560} y={860} text="¿y de qué parte eres?" size={84} />);
  add(908.6, 920.4, () => <X.Proximo t={t} at={A("los frijoles de olla", 900)} out={920.2} x={1300} y={460} big="FRIJOLES" small="de olla, los más sabrosos" />);
  add(920.4, END_T, () => <X.Cita t={t} at={A("que nunca te falte masa", 910)} out={929.4} x={960} y={300} text="Que nunca te falte masa en la batea." size={92} />);
  return L;
};

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
