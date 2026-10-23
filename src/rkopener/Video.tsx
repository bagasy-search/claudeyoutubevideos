// rkopener · EL VIDEO ENTERO (0-1050,4 s). Un solo hilo: el barrio 3D de noche es el mapa (la cámara vuela del auto al
// portón, a la puerta de adentro, a la cocina), las tomas LTX / fotos de cada frase entran con barridos y el avatar entra
// por portales. Todo clavado a la voz (tiempos del ASR + at()). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, makeCam, routeAt, type Key, type WorldState } from "./barrio3d";
import { Avatar, CamHud, Chip, Comment, Cover, Desc, Page, PlaceTitle, Quote, Remotes, Rows, Shot, Stamp, Stopwatch, Swipe, WIN, at } from "./parts";
import { BigNum, COL, LowerThird, Portal, Tag, e, ei } from "./lib";

export const END = 1050.4;
type V3 = [number, number, number];

const winAt = (t: number) => WIN.findIndex((w) => t >= w.ms && t < w.me);

// ---------------- poses de cámara por lugar ----------------
type Pose = { p: V3; l: V3; fov: number };
const POSE: Record<string, Pose> = {
  street: { p: [-1.5, 2.4, 12.5], l: [-6.2, 0.9, 2.0], fov: 40 },
  carSide: { p: [-3.6, 1.6, 5.6], l: [-6.9, 0.9, 2.9], fov: 38 },
  visor: { p: [-4.6, 1.12, 2.75], l: [-7.25, 1.17, 2.8], fov: 34 },
  window: { p: [-4.3, 1.3, 4.3], l: [-6.1, 0.95, 3.3], fov: 34 },
  console: { p: [-4.7, 1.12, 2.45], l: [-6.9, 1.2, 2.62], fov: 36 },
  glove: { p: [-4.8, 1.05, 2.55], l: [-6.5, 0.85, 2.85], fov: 36 },
  drive: { p: [-7.2, 2.75, 0.75], l: [-6.4, 0.3, 4.8], fov: 62 },
  gdoor: { p: [-4.6, 1.9, 6.8], l: [-7.2, 1.2, 0.2], fov: 40 },
  garIn: { p: [-5.9, 3.6, 1.9], l: [-7.2, 0.9, -1.1], fov: 46 },
  panel: { p: [-6.7, 1.55, -0.15], l: [-5.62, 1.3, -0.55], fov: 30 },
  door: { p: [-8.2, 2.3, 0.0], l: [-5.6, 1.15, -1.5], fov: 40 },
  motor: { p: [-6.0, 1.55, 0.1], l: [-7.0, 2.3, -1.6], fov: 38 },
  kitchen: { p: [-3.4, 2.1, 2.2], l: [-3.8, 1.0, -1.9], fov: 44 },
  kids: { p: [6.6, 2.2, 2.6], l: [6.6, 0.5, -1.2], fov: 42 },
  over: { p: [-1.0, 7.0, 9.5], l: [-1.5, 0.4, -0.6], fov: 44 },
  overG: { p: [-3.6, 5.2, 6.8], l: [-5.8, 0.6, 0.0], fov: 46 },
};
const push = (q: Pose, k = 0.12): Pose => ({ p: q.p.map((v, i) => v + (q.l[i] - v) * k) as V3, l: q.l, fov: q.fov - 2 });

// ---------------- el guion visual ----------------
// v = "img:<clave>" (toma LTX si ya bajó, si no su cuadro clave / foto) · "img:<clave>@<seg>" (la toma arranca en ese segundo)
//     "w:<pose>" (el barrio) · "wd:<pose>" (barrio oscurecido, para gráficos)
const B: { a: number; v: string }[] = [
  { a: 0, v: "w:street" },
  { a: 9.0, v: "w:visor" },
  { a: 20.7, v: "img:gancho_s1@20.3" },
  { a: 34.5, v: "img:gancho_s1@24.5" },
  { a: 39.6, v: "img:k_motor" },
  { a: 47.2, v: "w:garIn" },
  { a: 53.4, v: "w:overG" },
  { a: 61.9, v: "img:r_visor2" },
  { a: 70.0, v: "w:door" },
  { a: 74.6, v: "w:kitchen" },
  { a: 84.4, v: "img:r_van" },
  { a: 89.6, v: "img:x_taza" },
  { a: 92.6, v: "img:r_entrada" },
  { a: 103.2, v: "img:x_entrada_vacia" },
  { a: 107.7, v: "w:gdoor" },
  { a: 120.0, v: "img:r_mira" },
  { a: 126.3, v: "img:k_visor" },
  { a: 136.4, v: "img:x_garaje_ordenado" },
  { a: 139.7, v: "img:x_calle_noche" },
  { a: 143.6, v: "img:k_llavero" },
  { a: 154.1, v: "img:r_bolsillo" },
  { a: 161.5, v: "w:panel" },
  { a: 170.7, v: "img:x_luz_panel" },
  { a: 175.0, v: "img:r_panel" },
  { a: 180.2, v: "img:k_pared" },
  { a: 190.3, v: "wd:panel" },
  { a: 196.1, v: "w:panel" },
  { a: 200.7, v: "w:gdoor" },
  { a: 207.1, v: "img:r_mesa" },
  { a: 210.0, v: "wd:over" },
  { a: 214.0, v: "img:x_panel_viejo" },
  { a: 222.7, v: "w:panel" },
  { a: 226.1, v: "img:r_manual" },
  { a: 239.0, v: "wd:over" },
  { a: 255.7, v: "wd:over" },
  { a: 261.6, v: "w:carSide" },
  { a: 263.4, v: "w:visor" },
  { a: 270.2, v: "img:x_visor" },
  { a: 275.0, v: "w:gdoor" },
  { a: 279.9, v: "wd:visor" },
  { a: 286.6, v: "w:visor" },
  { a: 291.2, v: "img:r_porche" },
  { a: 302.9, v: "w:window" },
  { a: 308.0, v: "img:x_vidrio_capas" },
  { a: 320.8, v: "w:window" },
  { a: 329.3, v: "img:k_vidrio" },
  { a: 337.2, v: "w:window" },
  { a: 351.0, v: "w:drive" },
  { a: 356.3, v: "img:x_tres_botones" },
  { a: 361.6, v: "img:r_consola" },
  { a: 368.4, v: "w:console" },
  { a: 374.2, v: "img:r_llave_casa" },
  { a: 383.4, v: "img:k_prueba" },
  { a: 400.7, v: "w:console" },
  { a: 409.9, v: "wd:console" },
  { a: 415.9, v: "wd:console" },
  { a: 422.8, v: "w:panel" },
  { a: 432.7, v: "wd:console" },
  { a: 449.9, v: "img:x_puerta_garaje_casa" },
  { a: 457.0, v: "w:overG" },
  { a: 466.0, v: "w:garIn" },
  { a: 469.7, v: "w:door" },
  { a: 471.9, v: "img:r_tres_escalones" },
  { a: 480.8, v: "w:door" },
  { a: 485.7, v: "wd:door" },
  { a: 491.0, v: "wd:overG" },
  { a: 498.3, v: "w:door" },
  { a: 502.7, v: "w:overG" },
  { a: 507.2, v: "img:x_minivan" },
  { a: 516.7, v: "img:k_vecino" },
  { a: 526.6, v: "w:door" },
  { a: 533.8, v: "img:x_bolsos" },
  { a: 537.4, v: "w:kitchen" },
  { a: 539.8, v: "img:x_cuarto_ninos" },
  { a: 543.9, v: "img:r_escoba" },
  { a: 550.3, v: "w:over" },
  { a: 555.1, v: "w:door" },
  { a: 558.3, v: "wd:door" },
  { a: 565.8, v: "img:k_cerrojo" },
  { a: 573.2, v: "img:x_perilla" },
  { a: 576.6, v: "img:r_pomo" },
  { a: 585.2, v: "img:r_cerrojo_nuevo" },
  { a: 589.2, v: "img:x_tornillos" },
  { a: 592.9, v: "img:k_tornillos" },
  { a: 601.9, v: "w:door" },
  { a: 607.4, v: "img:k_golpe" },
  { a: 617.2, v: "w:door" },
  { a: 624.2, v: "w:glove" },
  { a: 627.2, v: "img:x_guantera" },
  { a: 634.4, v: "w:glove" },
  { a: 638.9, v: "img:r_estacionamiento" },
  { a: 643.8, v: "img:x_aeropuerto" },
  { a: 651.0, v: "w:overG" },
  { a: 660.2, v: "w:carSide" },
  { a: 667.6, v: "wd:glove" },
  { a: 673.2, v: "img:k_guantera" },
  { a: 684.2, v: "img:r_billetera" },
  { a: 691.6, v: "w:visor" },
  { a: 700.3, v: "img:r_mesa" },
  { a: 705.8, v: "wd:motor" },
  { a: 709.6, v: "w:motor" },
  { a: 718.8, v: "img:k_aprender" },
  { a: 736.7, v: "img:r_programa" },
  { a: 743.5, v: "w:motor" },
  { a: 752.4, v: "img:k_adentro" },
  { a: 759.1, v: "img:r_cajas" },
  { a: 769.1, v: "w:garIn" },
  { a: 773.6, v: "img:r_auto_adentro" },
  { a: 777.2, v: "wd:over" },
  { a: 786.3, v: "img:r_auto_cerrado" },
  { a: 789.6, v: "img:x_auto_vacio" },
  { a: 793.0, v: "w:panel" },
  { a: 801.9, v: "img:k_celular" },
  { a: 818.4, v: "w:gdoor" },
  { a: 827.9, v: "w:motor" },
  { a: 835.8, v: "img:k_enchufe" },
  { a: 839.3, v: "img:x_disyuntor" },
  { a: 843.6, v: "img:r_maleta" },
  { a: 847.7, v: "w:carSide" },
  { a: 853.6, v: "img:r_consola_abierta" },
  { a: 862.3, v: "w:console" },
  { a: 870.4, v: "w:glove" },
  { a: 873.3, v: "wd:glove" },
  { a: 875.8, v: "img:x_cuatro_controles" },
  { a: 884.7, v: "img:r_cajon" },
  { a: 890.3, v: "img:k_contar" },
  { a: 901.6, v: "w:panel" },
  { a: 906.3, v: "img:r_luces" },
  { a: 909.1, v: "w:panel" },
  { a: 915.2, v: "img:r_camara" },
  { a: 920.7, v: "img:x_camara_casa" },
  { a: 931.9, v: "w:drive" },
  { a: 935.3, v: "img:gancho_s2@935.3" },
  { a: 948.3, v: "img:plata_s1@948.3" },
  { a: 964.9, v: "img:plata_s2@959.0" },
  { a: 974.0, v: "w:over" },
  { a: 985.3, v: "img:r_tarea" },
  { a: 989.9, v: "wd:visor" },
  { a: 995.6, v: "img:r_pantuflas" },
  { a: 1003.6, v: "w:door" },
  { a: 1006.5, v: "wd:over" },
  { a: 1017.1, v: "wd:over" },
  { a: 1021.8, v: "img:r_libro" },
  { a: 1023.6, v: "wd:over" },
  { a: 1026.6, v: "wd:visor" },
  { a: 1033.8, v: "wd:visor" },
  { a: 1036.2, v: "img:r_llavero_tag" },
  { a: 1043.2, v: "w:street" },
].sort((x, y) => x.a - y.a);
const beatAt = (t: number) => { let i = 0; while (i < B.length - 1 && B[i + 1].a <= t) i++; return i; };

// tramos que se ven por la cámara de seguridad (HUD) — gancho y la toma de plata
const CAMV: [number, number][] = [[20.7, 39.6], [931.9, 974.0]];
const camvAt = (t: number) => CAMV.some(([x, y]) => t >= x && t < y);

// ---------------- la cámara: vuela de pose en pose (si viene del barrio) y empuja despacio ----------------
const KEYS: Key[] = [];
{
  let prev: Pose | null = null;
  B.forEach((b, i) => {
    const end = i < B.length - 1 ? B[i + 1].a : END;
    if (!b.v.startsWith("w")) { prev = null; return; }
    const q = POSE[b.v.split(":")[1]];
    const fly = prev && end - b.a > 2.2 ? 1.1 : 0;
    if (prev) KEYS.push({ t: b.a, ...prev });
    KEYS.push({ t: b.a + fly, ...q, arc: 0.03 });
    prev = push(q, 0.08 + Math.min(0.12, (end - b.a) * 0.01));
    KEYS.push({ t: end - 0.01, ...prev });
  });
}
const CAM = makeCam(KEYS);
const { screenOf } = CAM;

// ---------------- estado del barrio por tramo ----------------
const on = (t: number, x: number, y = 1e9, f = 0.4) => e(t, x, x + f) * (1 - e(t, y, y + f));
const seg = (t: number, L: [number, number][]) => Math.min(1, L.reduce((s0, [x, y]) => s0 + on(t, x, y), 0));
const toward = (a: V3, b: V3) => Math.atan2(b[0] - a[0], b[2] - a[2]);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, 0, a[2] + (b[2] - a[2]) * k];
const STREET: V3 = [-5.4, 0, 8.6], BYCAR: V3 = [-5.6, 0, 3.2], INGAR: V3 = [-6.4, 0, -0.4], ATDOOR: V3 = [-6.0, 0, -0.95];
const thiefOf = (t: number): { on: number; at: V3; yaw: number; reach: number } => {
  const walk = (t0: number, t1: number, a: V3, b: V3) => { const k = e(t, t0, t1); return { at: lerp3(a, b, k), yaw: k < 1 ? toward(a, b) : -Math.PI / 2 }; };
  if (t >= 15 && t < 34.6) { const w = walk(15.4, 24.8, STREET, BYCAR); return { on: 1, ...w, reach: e(t, 27.5, 29.0) }; }
  if (t >= 44 && t < 62) {
    if (t < 53.5) return { on: 1, at: INGAR, yaw: Math.PI * 0.55, reach: 0 };
    const k = e(t, 53.5, 61), p = routeAt(k), q = routeAt(Math.min(1, k + 0.02));
    return { on: 1, at: p, yaw: toward(p, q), reach: 0 };
  }
  if (t >= 337.2 && t < 351) return { on: 1, at: BYCAR, yaw: -Math.PI / 2, reach: e(t, 338, 339.2) };
  if (t >= 457 && t < 502.7) return { on: 1, at: ATDOOR, yaw: toward(ATDOOR, PT.door), reach: 0 };
  if (t >= 502.7 && t < 507.2) { const k = e(t, 502.9, 506.8), p = routeAt(0.35 + 0.35 * k), q = routeAt(0.36 + 0.35 * k); return { on: 1, at: p, yaw: toward(p, q), reach: 0 }; }
  if (t >= 931.9 && t < 974) { const w = walk(931.9, 937.9, STREET, BYCAR); return { on: 1, ...w, reach: e(t, 940.5, 941.8) * (1 - e(t, 944.0, 945.0)) }; }
  return { on: 0, at: BYCAR, yaw: 0, reach: 0 };
};
const stAt = (t: number): WorldState => {
  const th = thiefOf(t);
  const lift = t < 62 ? e(t, 40.0, 46.5) : t >= 107.7 && t < 120 ? 0.98 : t >= 275 && t < 279.9 ? e(t, 276.0, 279.6) : t >= 457 && t < 555 ? 1 : t >= 818.4 && t < 827.9 ? 1 - e(t, 819.5, 825.0) : 0;
  const moving = (t > 40 && t < 47) || (t > 276 && t < 280) || (t > 819.5 && t < 825.5) ? 1 : 0;
  const route = t >= 53.4 && t < 62 ? e(t, 53.5, 61) : t >= 502.7 && t < 507.2 ? e(t, 502.9, 506.8) : (t >= 550.3 && t < 555.1) || (t >= 651 && t < 660.2) ? 1 : 0;
  return {
    day: t >= 107.7 && t < 114.4 ? 1 : 0,
    lamps: t >= 1043 ? 0.8 : 0.3,
    gLight: lift > 0.2 || t >= 457 && t < 555 ? 1 : 0.35,
    gLift: lift, jam: t >= 200.7 && t < 202.2 || t >= 949.4 && t < 959 ? 1 : 0,
    lock: seg(t, [[180.2, 211.8], [422.8, 426.7], [793, 798.3], [901.6, 911.5], [931.9, 974]]),
    dbolt: seg(t, [[585.2, 624.2], [974, 985.3], [1003.6, 1006.5]]),
    door: t >= 526.6 && t < 529.2 ? e(t, 526.8, 527.8) : t >= 502.7 && t < 507.2 ? e(t, 503, 504) : 0,
    learn: on(t, 709.6, 718.8) + on(t, 743.5, 749.6, 0.2) * 0,
    plug: t >= 827.9 && t < 847.7 ? e(t, 839.3, 840.2) : 0,
    motorLight: moving,
    glove: seg(t, [[624.2, 691.6], [862.3, 875.8]]),
    broken: t < 62 ? e(t, 27.6, 28.6) : t >= 320.8 && t < 351 ? e(t, 329.0, 330.0) : (t >= 457 && t < 555) || (t >= 862.3 && t < 875.8) ? 1 : t >= 931.9 && t < 974 ? e(t, 939.0, 940.0) : 0,
    remote: t < 40 || (t >= 261 && t < 337.2) ? 1 : 0,
    rGlow: seg(t, [[9, 15.4], [263.4, 297.5], [989.9, 995.6], [1026.6, 1036.2]]),
    console: seg(t, [[368.4, 374.2], [400.7, 422.8], [432.7, 449.9], [862.3, 865.4]]),
    carLights: 0, loot: t >= 533.8 && t < 555 ? 1 : 0,
    thief: th.on, thiefAt: th.at, thiefYaw: th.yaw, reach: th.reach,
    flash: seg(t, [[47.2, 48.1], [469.7, 471.9], [480.8, 485.7]]), flashAt: PT.door, flashFrom: [-6.7, 1.5, -0.3],
    route, routeCol: COL.red,
    heat: {
      visor: seg(t, [[9, 15.4], [263.4, 291.2], [691.6, 694.9]]),
      door: seg(t, [[70, 79.5], [469.7, 502.7], [555.1, 558.3]]),
      glove: seg(t, [[624.2, 627.2], [634.4, 638.9], [870.4, 875.8]]),
      console: seg(t, [[400.7, 409.9]]),
    },
    good: {
      panel: seg(t, [[161.5, 164.6], [196.1, 200.7], [422.8, 426.7], [793, 798.3], [909.1, 911.5], [974, 985.3]]),
      door: seg(t, [[601.9, 607.4], [617.2, 624.2], [974, 985.3], [1003.6, 1006.5]]),
      motor: seg(t, [[709.6, 713.6], [743.5, 747.7], [827.9, 830]]),
    },
  };
};

const World: React.FC<{ t: number; dim?: number }> = ({ t, dim = 0 }) => (
  <AbsoluteFill style={{ filter: dim > 0 ? `brightness(${1 - dim})` : undefined }}><WorldRaw t={t} camAt={CAM.camAt} st={stAt(t)} /></AbsoluteFill>
);

// una toma del guion (foto/LTX con empuje lento, o el barrio), dibujada en el segundo t
const Visual: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const b = B[i], end = i < B.length - 1 ? B[i + 1].a : END, [kind, rest] = b.v.split(":");
  if (kind === "img") {
    const [k, st] = rest.split("@"), a0 = st ? Number(st) : b.a, zin = i % 2 === 0;
    return <Shot k={k} t={t} a={a0} dur={end - a0 + 0.6} z={st ? [1.0, 1.04] : zin ? [1.03, 1.12] : [1.12, 1.03]} ox={st ? 0 : (i % 3 - 1) * 24} oy={st ? 0 : zin ? -10 : 10} />;
  }
  return <World t={t} dim={kind === "wd" ? 0.5 : 0} />;
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const L: React.ReactNode[] = [];
  const wi = winAt(t), bi = beatAt(t);
  const P2 = (q: V3) => screenOf(t, q);

  // ===== capa base: avatar / tomas / barrio, con portales y barridos =====
  if (wi >= 0) {
    L.push(<Avatar key="av" t={t} />);
  } else {
    const prevW = WIN.find((w) => t >= w.me && t < w.me + 0.38);
    const b = B[bi], startedInWin = winAt(b.a) >= 0 || WIN.some((w) => Math.abs(w.me - b.a) < 0.4);
    if (prevW) L.push(<Swipe key="sx" t={t} a={prevW.me} b={prevW.me + 0.38} dir={bi % 2 ? 1 : -1} vert={bi % 3 === 0} from={<Avatar t={t} />} to={<Visual i={bi} t={t} />} />);
    else if (bi > 0 && t < b.a + 0.38 && !startedInWin && !(B[bi - 1].v.startsWith("w") && b.v.startsWith("w")))
      L.push(<Swipe key={"sb" + bi} t={t} a={b.a} b={b.a + 0.38} dir={bi % 2 ? 1 : -1} vert={bi % 4 === 1} from={<Visual i={bi - 1} t={t} />} to={<Visual i={bi} t={t} />} />);
    else L.push(<Visual key={"v" + bi} i={bi} t={t} />);
    if (camvAt(t)) L.push(<CamHud key="hud" t={t} t0={t < 100 ? 20.3 : 931.9} clock={2 * 3600 + 7 * 60 + 14} />);
    const nextW = WIN.find((w) => t >= w.ms - 0.35 && t < w.ms);
    if (nextW) L.push(<Portal key="pw" x={960} y={540} r={ei(t, nextW.ms - 0.35, nextW.ms)}><Avatar t={t} /></Portal>);
  }

  // ===== GANCHO 0-79 =====
  if (t > 9 && t < 15.4) { const v = P2(PT.visor); L.push(<Tag key="vi" t={t} at={10.4} x={v.x} y={v.y} dx={-360} dy={-200} text="THAT LITTLE GRAY REMOTE" col={COL.amber} out={15.0} size={52} />); }
  if (t > 47 && t < 48.1) L.push(<Chip key="du" t={t} at={47.3} out={47.9} text="BEFORE IT'S EVEN HALFWAY UP" />);
  if (t > 53.4 && t < 62) L.push(<Rows key="nl" t={t} out={56.4} y={250} items={[{ at: 53.5, tx: "NO LOCK PICKED", ok: false }, { at: 54.3, tx: "NO DOOR FORCED", ok: false }]} />);
  L.push(<Stamp key="hk" t={t} at={56.7} text="YOU HANDED HIM THE KEY" x={960} y={300} out={61.6} rot={-6} size={86} />);
  L.push(<Stopwatch key="sw0" t={t} at={62.4} out={65.5} x={960} y={540} n={30} label="TONIGHT" />);
  if (t > 70 && t < 74.6) { const d = P2(PT.door); L.push(<Tag key="sd" t={t} at={70.3} x={d.x} y={d.y} dx={330} dy={-220} text="THE SECOND DOOR" sub="NOBODY THINKS ABOUT" col={COL.red} out={74.4} size={56} />); }
  if (t > 74.6 && t < 79.5) L.push(<Quote key="sk" t={t} at={75.2} out={79.2} text="A STRANGER IN YOUR KITCHEN" col="#ff8a7a" y={200} size={84} />);

  // ===== QUIÉN SOY 79-126 =====
  L.push(<LowerThird key="lt" t={t} at={80.0} out={84.2} name="RAY KESSLER" l2="LOCKSMITH · 35 YEARS" l2at={81.5} />);
  L.push(<Tag key="mo" t={t} at={87.4} x={1000} y={560} dx={-360} dy={-230} text="THE MORNING AFTER" col="#fff" out={92.4} size={56} />);
  L.push(<Tag key="nd" t={t} at={103.4} x={960} y={540} dx={330} dy={-230} text="NO SPLINTERED FRAME" sub="NO BUSTED LOCK" col={COL.amber} out={107.5} size={52} />);
  if (t > 107.7 && t < 114.4) L.push(<Quote key="sw" t={t} at={108.6} out={114.2} text="“I SWEAR I CLOSED IT”" y={170} size={80} />);
  if (t > 114.4 && t < 120.5) L.push(<Quote key="op" t={t} at={116.8} out={120.0} text="THEY JUST OPENED IT" y={140} size={80} col="#ffd60a" />);

  // ===== ARREGLO 1 · el control del parasol =====
  L.push(<PlaceTitle key="f1" t={t} at={126.4} out={131.6} n="1" name="TAKE THE REMOTE OFF THE VISOR" />);
  L.push(<Chip key="tn" t={t} at={136.5} out={139.4} good text="CAR SLEEPS INSIDE, DOOR DOWN = FINE" />);
  L.push(<Chip key="dr" t={t} at={139.8} out={143.4} text="CAR SLEEPS OUTSIDE = REMOTE COMES IN" />);
  L.push(<Tag key="kc" t={t} at={150.5} x={980} y={560} dx={330} dy={-230} text="A KEYCHAIN REMOTE" sub="GOES WHERE YOUR KEYS GO" col="#7dffb4" out={154.0} size={52} />);
  L.push(<Tag key="pg" t={t} at={155.8} x={960} y={540} dx={-340} dy={-230} text="INSIDE" sub="NOT BEHIND A PANE OF GLASS" col="#7dffb4" out={161.3} size={60} />);

  // ===== ARREGLO 2 · la traba del panel =====
  L.push(<PlaceTitle key="f2" t={t} at={161.6} out={164.5} n="2" name="THE LOCK ON THE WALL BUTTON" />);
  if (t > 161.5 && t < 164.6) { const p = P2(PT.panel); L.push(<Tag key="pn" t={t} at={162.2} x={p.x} y={p.y} dx={-320} dy={-160} text="BY THE DOOR INTO THE HOUSE" col="#fff" out={164.4} size={40} />); }
  L.push(<Tag key="lk" t={t} at={171.0} x={960} y={520} dx={330} dy={-220} text="🔒 PADLOCK · LOCK · VACATION" col={COL.amber} out={174.8} size={50} />);
  L.push(<Stopwatch key="sw2" t={t} at={180.6} out={183.8} x={1400} y={260} n={2} label="HOLD UNTIL IT BLINKS" />);
  L.push(<Remotes key="rm" t={t} ats={[190.4, 191.6, 192.9]} labels={["THE VISOR", "HER PURSE", "BUILT INTO THE CAR"]} out={195.9} y={360} cross={194.2} />);
  if (t > 196.1 && t < 200.7) { const p = P2(PT.panel); L.push(<Tag key="wb" t={t} at={196.3} x={p.x} y={p.y} dx={-330} dy={-170} text="THE WALL BUTTON STILL WORKS" sub="YOU CAN ALWAYS GET OUT" col="#7dffb4" out={200.5} size={44} />); }
  L.push(<Chip key="no" t={t} at={200.9} out={202.0} text="NOBODY OUTSIDE CAN OPEN IT" good />);
  L.push(<Rows key="nm" t={t} out={209.8} y={300} items={[{ at: 204.2, tx: "LAST CAR IN → PRESS", ok: true }, { at: 207.7, tx: "EVERY MORNING → PRESS AGAIN", ok: true }]} />);
  L.push(<Stopwatch key="sw3" t={t} at={210.1} out={213.8} x={960} y={540} n={30} label="THAT'S YOUR 30 SECONDS" />);
  L.push(<Tag key="ol" t={t} at={214.3} x={960} y={540} dx={330} dy={-230} text="OLDER OPENERS" sub="MOSTLY NO LOCK" col={COL.amber} out={218.1} size={56} />);
  if (t > 222.7 && t < 226.1) { const p = P2(PT.panel); L.push(<Tag key="lp" t={t} at={222.9} x={p.x} y={p.y} dx={-330} dy={-170} text="SEE THE PADLOCK? YOU'VE GOT IT" col="#7dffb4" out={226.0} size={44} />); }
  L.push(<Chip key="ma" t={t} at={226.3} out={235.0} good text="NO LOCK? STAY WITH ME" />);

  // ===== CTA 1 · la guía =====
  L.push(<Cover key="cv1" t={t} at={239.2} out={248.2} x={1360} y={540} w={460} />);
  L.push(<BigNum key="tsk" t={t} at={246.2} text="THE SLEEPING KEY" size={92} x={620} y={300} out={248.2} col="#ffd60a" edge="#5a4500" />);
  L.push(<Page key="p32" t={t} at={248.5} out={258.6} n={32} hl="THE NIGHT ROUTINE" box={[78, 520, 498, 92]} />);
  L.push(<Desc key="d1" t={t} at={258.9} out={261.4} />);

  // ===== el control es una llave =====
  if (t > 263.4 && t < 266.7) { const v = P2(PT.visor); L.push(<Tag key="cv" t={t} at={263.6} x={v.x} y={v.y} dx={-330} dy={-200} text="WHAT THAT REMOTE REALLY IS" col={COL.amber} out={266.5} size={48} />); }
  L.push(<Tag key="cn" t={t} at={270.4} x={960} y={540} dx={330} dy={-220} text="“A CONVENIENCE”" col="#fff" out={274.8} size={60} />);
  L.push(<Quote key="od" t={t} at={277.9} out={279.7} text="IT OPENS A DOOR INTO YOUR HOUSE" y={160} size={76} />);
  L.push(<Rows key="nb" t={t} out={286.4} y={260} items={[{ at: 281.3, tx: "A DOORBELL", ok: false }, { at: 282.4, tx: "A LIGHT SWITCH", ok: false }, { at: 284.2, tx: "A KEY", ok: true }]} />);
  if (t > 286.6 && t < 291.2) { const v = P2(PT.visor); L.push(<Tag key="nt" t={t} at={286.8} x={v.x} y={v.y} dx={-360} dy={-210} text="NO TEETH · NO LOCK" sub="NO IDEA WHOSE HAND IT'S IN" col={COL.red} out={291.0} size={48} />); }
  L.push(<Tag key="fk" t={t} at={292.4} x={960} y={540} dx={330} dy={-230} text="YOUR FRONT DOOR KEY" sub="YOU'D NEVER HANG IT OUTSIDE" col="#fff" out={297.3} size={52} />);
  if (t > 302.9 && t < 308) { const w = P2(PT.window); L.push(<Tag key="1t" t={t} at={303.2} x={w.x} y={w.y} dx={330} dy={-200} text="ONE TAP" col={COL.red} out={307.8} size={70} />); }

  // ===== el vidrio =====
  L.push(<Tag key="lm" t={t} at={311.4} x={960} y={540} dx={-340} dy={-230} text="WINDSHIELD: LAMINATED" sub="TWO LAYERS + PLASTIC" col="#8fd6ff" out={316.0} size={50} />);
  if (t > 320.8 && t < 329.3) { const w = P2(PT.window); L.push(<Tag key="tg" t={t} at={321.0} x={w.x} y={w.y} dx={330} dy={-220} text="SIDE WINDOWS: TEMPERED" sub="LET GO ALL AT ONCE" col={COL.amber} out={329.0} size={50} />); }
  L.push(<BigNum key="cb" t={t} at={329.5} text="1,000 LITTLE CUBES" size={96} x={960} y={180} out={333.0} col="#ffffff" edge="#334" />);
  L.push(<Stopwatch key="sw4" t={t} at={338.6} out={346.3} x={1420} y={300} n={1} label="ABOUT ONE SECOND" />);
  if (t > 351 && t < 356.3) L.push(<Quote key="nt2" t={t} at={351.8} out={356.1} text="HE DOESN'T NEED ANY TIME AT ALL" y={820} size={68} />);

  // ===== los botones del auto =====
  L.push(<Tag key="bb" t={t} at={361.8} x={960} y={500} dx={330} dy={-200} text="BUILT INTO THE CAR" col={COL.amber} out={363.6} size={56} />);
  L.push(<Rows key="ts" t={t} out={383.2} y={240} items={[{ at: 370.8, tx: "1 · TURN THE CAR OFF", ok: true }, { at: 375.9, tx: "2 · KEY INSIDE THE HOUSE", ok: true }, { at: 383.4 - 0.01, tx: "3 · PRESS THE BUTTON", ok: true }]} />);
  L.push(<Chip key="ok" t={t} at={388.4} out={395.7} good text="NOTHING HAPPENS = GOOD" />);
  if (t > 400.7 && t < 409.9) { const c = P2(PT.console); L.push(<Tag key="up" t={t} at={401.0} x={c.x} y={c.y} dx={-330} dy={-200} text="DOOR GOES UP ANYWAY?" sub="KEY OR NO KEY" col={COL.red} out={409.7} size={50} />); }
  L.push(<Stamp key="db" t={t} at={410.0} text="DIFFERENT BUTTON, SAME WINDOW" x={960} y={500} out={412.4} rot={-5} size={64} />);
  L.push(<Quote key="ti" t={t} at={416.0} out={422.6} text="TEST IT WITH THE KEY IN THE HOUSE" y={420} size={78} col="#ffd60a" />);
  if (t > 422.8 && t < 426.7) { const p = P2(PT.panel); L.push(<Tag key="bf" t={t} at={423.0} x={p.x} y={p.y} dx={-330} dy={-170} text="THE WALL LOCK SHUTS THEM OFF TOO" col="#7dffb4" out={426.5} size={42} />); }
  L.push(<Tag key="cl" t={t} at={433.0} x={960} y={420} dx={330} dy={-150} text="NO LOCK? CLEAR THE CAR BUTTONS" sub="IT'S IN THE OWNER'S MANUAL" col={COL.amber} out={443.8} size={48} />);
  L.push(<Stopwatch key="sw5" t={t} at={444.1} out={445.9} x={960} y={560} n={20} label="TWO OUTSIDE BUTTONS" />);
  L.push(<Chip key="er" t={t} at={450.2} out={456.8} text="ERASES EVERY BUTTON — CHECK THE MANUAL" />);

  // ===== la segunda puerta =====
  L.push(<PlaceTitle key="sd2" t={t} at={457.2} out={460.9} n="2ND" lbl="THE" name="DOOR" good={false} />);
  if (t > 466 && t < 469.7) { const g = P2(PT.gdoor); L.push(<Tag key="in" t={t} at={466.2} x={g.x} y={g.y} dx={330} dy={-200} text="HE'S INSIDE THE GARAGE" col={COL.red} out={469.5} size={50} />); }
  if (t > 469.7 && t < 471.9) { const d = P2(PT.door); L.push(<Tag key="ad" t={t} at={470.9} x={d.x} y={d.y} dx={330} dy={-200} text="A DOOR" col="#fff" out={471.7} size={70} />); }
  L.push(<Tag key="3s" t={t} at={472.2} x={960} y={540} dx={-330} dy={-230} text="THREE WOODEN STEPS" sub="INTO THE KITCHEN" col={COL.amber} out={476.1} size={52} />);
  if (t > 480.8 && t < 485.7) { const d = P2(PT.door); L.push(<Tag key="lt2" t={t} at={481.0} x={d.x} y={d.y} dx={330} dy={-200} text="LAST TIME YOU LOCKED IT?" col="#fff" out={485.5} size={52} />); }
  L.push(<Stamp key="nv" t={t} at={486.0} text="NEVER" x={960} y={520} out={490.8} rot={-10} size={170} />);
  L.push(<Rows key="hd" t={t} out={494.1} y={260} items={[{ at: 491.2, tx: "“THE GARAGE IS OUTSIDE”", ok: false }, { at: 492.6, tx: "“THE BIG DOOR IS THE LOCK”", ok: false }]} />);
  L.push(<Stamp key="mk" t={t} at={501.8} text="THAT'S THE MISTAKE" x={960} y={260} out={507.0} rot={-6} size={90} />);

  // ===== la historia de la minivan =====
  L.push(<Tag key="sa" t={t} at={507.4} x={960} y={540} dx={-340} dy={-230} text="ONE SATURDAY" sub="A NICE COUPLE, TWO KIDS" col="#fff" out={510.6} size={56} />);
  if (t > 526.6 && t < 529.2) { const d = P2(PT.door); L.push(<Tag key="ul" t={t} at={526.7} x={d.x} y={d.y} dx={330} dy={-200} text="NOT LOCKED. NEVER WAS." col={COL.red} out={529.0} size={52} />); }
  L.push(<Rows key="tk" t={t} out={539.6} y={240} items={[{ at: 533.9, tx: "2 PURSES", ok: false }, { at: 534.4, tx: "A LAPTOP", ok: false }, { at: 535.0, tx: "THE OTHER CAR'S KEYS", ok: false }]} />);
  L.push(<BigNum key="40" t={t} at={541.4} text="40 FEET AWAY" size={110} x={960} y={200} out={543.7} col="#ffffff" edge="#334" />);
  L.push(<Quote key="fd" t={t} at={544.6} out={546.4} text="“WE LOCKED THE FRONT DOOR”" y={160} size={72} />);
  L.push(<Stamp key="dm" t={t} at={552.5} text="IT DIDN'T MATTER" x={960} y={300} out={555.0} rot={-6} size={90} />);

  // ===== ARREGLO 3 · la puerta de adentro =====
  L.push(<PlaceTitle key="f3" t={t} at={555.2} out={558.1} n="3" name="LOCK THE DOOR FROM THE GARAGE" />);
  L.push(<Stopwatch key="sw6" t={t} at={558.4} out={561.2} x={960} y={540} n={30} label="EVERY NIGHT, FOR LIFE" />);
  L.push(<Tag key="pl" t={t} at={573.4} x={960} y={540} dx={330} dy={-230} text="A KNOB BUTTON" sub="IS A PRIVACY LATCH, NOT A LOCK" col={COL.red} out={579.1} size={52} />);
  L.push(<Tag key="rd" t={t} at={585.4} x={960} y={540} dx={-330} dy={-230} text="A REAL DEADBOLT" sub="SAME AS THE FRONT DOOR" col="#7dffb4" out={589.0} size={56} />);
  L.push(<Tag key="ls" t={t} at={593.1} x={960} y={540} dx={330} dy={-230} text="LONG SCREWS" sub="INTO THE FRAMING" col="#7dffb4" out={597.0} size={56} />);
  L.push(<Tag key="hw" t={t} at={610.2} x={960} y={540} dx={-330} dy={-230} text="SOUNDS LIKE A DRUM?" sub="PUT IT ON THE LIST" col={COL.amber} out={612.4} size={56} />);
  if (t > 617.2 && t < 624.2) L.push(<Chip key="li" t={t} at={617.4} out={624.0} good text="NOT THIS MONTH — BUT ON THE LIST" />);

  // ===== ARREGLO 4 · los papeles =====
  L.push(<PlaceTitle key="f4" t={t} at={624.3} out={627.0} n="4" name="THE PAPERWORK" />);
  if (t > 634.4 && t < 638.9) { const g = P2(PT.glove); L.push(<Tag key="ha" t={t} at={634.6} x={g.x} y={g.y} dx={330} dy={-200} text="YOUR NAME + HOME ADDRESS" col={COL.red} out={638.7} size={50} />); }
  if (t > 651 && t < 660.2) L.push(<Rows key="mp" t={t} out={660.0} y={230} items={[{ at: 651.2, tx: "THE ADDRESS", ok: false }, { at: 652.4, tx: "THE KEY", ok: false }, { at: 655.0, tx: "HOURS AWAY", ok: false }]} />);
  L.push(<Quote key="hn" t={t} at={665.3} out={667.4} text="THE HOUSE WAS NOT" y={420} size={96} col="#ff8a7a" />);
  L.push(<Rows key="2t" t={t} out={673.0} y={300} items={[{ at: 668.8, tx: "NO REMOTE IN A CAR AWAY FROM HOME", ok: false }, { at: 670.6, tx: "EVER", ok: false }]} />);
  L.push(<Tag key="wl" t={t} at={684.4} x={960} y={540} dx={330} dy={-230} text="PAPERS IN YOUR WALLET" sub="IF YOUR STATE ALLOWS IT" col="#7dffb4" out={691.4} size={52} />);

  // ===== ARREGLO 5 · el botón learn =====
  L.push(<PlaceTitle key="f5" t={t} at={691.7} out={694.7} n="5" name="THE REMOTE GOES MISSING" />);
  L.push(<Quote key="lh" t={t} at={700.5} out={705.6} text="TREAT IT LIKE A LOST HOUSE KEY" y={160} size={72} />);
  L.push(<Stamp key="ch" t={t} at={705.9} text="CHEAPEST LOCK CHANGE" x={960} y={540} out={709.4} rot={-6} size={84} col="#3fe08a" />);
  if (t > 709.6 && t < 713.6) { const m = P2(PT.motor); L.push(<Tag key="ln" t={t} at={710.4} x={m.x} y={m.y} dx={-330} dy={160} text="THE “LEARN” BUTTON" col={COL.amber} out={713.4} size={56} />); }
  L.push(<Stopwatch key="sw7" t={t} at={719.5} out={725.0} x={1420} y={280} n={6} label="UNTIL THE LIGHT GOES OUT" />);
  L.push(<Chip key="fg" t={t} at={725.3} out={730.6} good text="IT FORGETS EVERY REMOTE" />);
  L.push(<BigNum key="5m" t={t} at={737.2} text="5 MINUTES · $0" size={110} x={960} y={200} out={743.3} col="#7dffb4" edge="#0b3a22" />);
  if (t > 743.5 && t < 747.7) L.push(<Tag key="pp" t={t} at={743.6} x={960} y={540} dx={330} dy={-230} text="PEOPLE PAID ME $100" sub="FOR THIS ONE BUTTON" col={COL.amber} out={747.5} size={52} />);

  // ===== ARREGLO 6 · dónde duerme el auto =====
  L.push(<PlaceTitle key="f6" t={t} at={752.6} out={757.8} n="6" name="WHERE THE CAR SLEEPS" />);
  L.push(<Tag key="bx" t={t} at={759.4} x={960} y={540} dx={-330} dy={-230} text="BOXES INDOORS" sub="THE CAR OUTSIDE FOR 10 YEARS" col={COL.red} out={765.0} size={52} />);
  L.push(<Rows key="all" t={t} out={780.5} y={240} items={[{ at: 777.6, tx: "THE REMOTE", ok: true }, { at: 778.4, tx: "THE GLOVE BOX", ok: true }, { at: 779.2, tx: "THE WINDOW", ok: true }]} />);
  L.push(<Rows key="rl" t={t} out={798.1} y={220} items={[{ at: 786.6, tx: "CAR LOCKED", ok: true }, { at: 788.0, tx: "NOTHING ON THE SEATS", ok: true }, { at: 790.0, tx: "NO REMOTE IN IT", ok: true }, { at: 793.2, tx: "WALL LOCK ON AT NIGHT", ok: true }]} />);

  // ===== ARREGLO 7 · saber cuándo se mueve =====
  L.push(<PlaceTitle key="f7" t={t} at={802.0} out={806.0} n="7" name="KNOW WHEN THAT DOOR MOVES" />);
  L.push(<Tag key="2am" t={t} at={811.6} x={960} y={540} dx={330} dy={-230} text="2 AM — NOT 7 AM" col="#fff" out={814.7} size={60} />);
  L.push(<Chip key="ac" t={t} at={818.6} out={827.6} good text="AUTO-CLOSE AFTER A FEW MINUTES" />);
  L.push(<Tag key="ok2" t={t} at={828.2} x={960} y={540} dx={-330} dy={160} text="OLD OPENER? GOING ON A TRIP?" col={COL.amber} out={829.8} size={48} />);
  L.push(<Stamp key="np" t={t} at={839.5} text="NO POWER = NO REMOTE" x={960} y={260} out={843.4} rot={-5} size={80} col="#3fe08a" />);

  // ===== los errores =====
  L.push(<PlaceTitle key="mx" t={t} at={847.8} out={853.3} n="4" lbl="THE" name="MISTAKES I SAW" good={false} />);
  L.push(<Chip key="m1" t={t} at={853.7} out={862.1} text="MISTAKE 1 · HIDING IT INSTEAD OF REMOVING IT" />);
  if (t > 862.3 && t < 865.4) { const c = P2(PT.console); L.push(<Tag key="oe" t={t} at={862.5} x={c.x} y={c.y} dx={-330} dy={-200} text="HE OPENS EVERYTHING" col={COL.red} out={865.2} size={56} />); }
  if (t > 870.4 && t < 873.3) { const g = P2(PT.glove); L.push(<Tag key="f2p" t={t} at={870.6} x={g.x} y={g.y} dx={330} dy={-200} text="FIRST TWO PLACES HE LOOKS" col={COL.red} out={873.1} size={50} />); }
  L.push(<Quote key="hc" t={t} at={873.4} out={875.6} text="HIDDEN IN THE CAR IS STILL IN THE CAR" y={400} size={74} />);
  L.push(<Chip key="m2" t={t} at={875.9} out={880.1} text="MISTAKE 2 · THE SPARE" />);
  L.push(<Tag key="tb" t={t} at={885.0} x={960} y={540} dx={330} dy={-230} text="THE OLD ONE THAT STILL WORKS" col={COL.amber} out={890.1} size={50} />);
  L.push(<Remotes key="cr" t={t} ats={[890.4, 890.9, 891.4, 891.9]} labels={["CAR 1", "CAR 2", "JUNK DRAWER", "THE TEENAGER"]} out={897.8} y={330} />);
  L.push(<Chip key="m3" t={t} at={901.7} out={906.1} text="MISTAKE 3 · THE LOCK NOBODY PRESSES" />);
  L.push(<Chip key="m4" t={t} at={910.4} out={911.4} text="MISTAKE 4 · THE CAMERA" />);
  L.push(<Stamp key="wn" t={t} at={926.6} text="A WITNESS, NOT A LOCK" x={960} y={300} out={927.3} rot={-6} size={80} />);

  // ===== la toma de plata: el mismo hombre, la misma noche =====
  L.push(<Chip key="sn" t={t} at={935.4} out={938.4} text="SAME NIGHT · SAME MAN · SAME DRIVEWAY" />);
  L.push(<Stamp key="nt3" t={t} at={950.6} text="NOT A HUM" x={1420} y={300} out={959.0} rot={-8} size={80} col="#3fe08a" />);
  L.push(<Tag key="hp" t={t} at={966.5} x={960} y={540} dx={-330} dy={-230} text="ONE MORE MINUTE…" col="#fff" out={970.8} size={56} />);
  L.push(<Stamp key="wa" t={t} at={971.1} text="HE WALKS AWAY" x={960} y={300} out={973.8} rot={-6} size={96} col="#3fe08a" />);
  L.push(<Quote key="bt" t={t} at={981.8} out={985.0} text="THE HOUSE WHERE HIS BUTTON DOESN'T WORK" y={160} size={70} col="#7dffb4" />);

  // ===== tarea + CTA 2 + cierre =====
  L.push(<Rows key="hw2" t={t} out={995.4} y={260} items={[{ at: 990.0, tx: "REMOTE OFF THE VISOR", ok: true }, { at: 992.6, tx: "DOES THE WALL BUTTON HAVE A LOCK?", ok: true }]} />);
  L.push(<Tag key="sl" t={t} at={995.8} x={960} y={540} dx={330} dy={-230} text="IN YOUR SLIPPERS" col="#fff" out={997.8} size={60} />);
  if (t > 1003.6 && t < 1006.5) { const d = P2(PT.door); L.push(<Tag key="tm" t={t} at={1003.8} x={d.x} y={d.y} dx={330} dy={-200} text="TOMORROW NIGHT: LOCK IT" col="#7dffb4" out={1006.3} size={50} />); }
  L.push(<Page key="p32b" t={t} at={1006.6} out={1012.0} n={32} hl="THE NIGHT ROUTINE" box={[78, 520, 498, 92]} />);
  L.push(<Page key="p39" t={t} at={1017.2} out={1021.6} n={39} hl="AFTER A BREAK-IN: CANCEL THE REMOTE" box={[94, 437, 502, 26]} />);
  L.push(<Cover key="cv2" t={t} at={1022.0} out={1023.4} x={1400} y={540} w={420} />);
  L.push(<Desc key="d2" t={t} at={1023.7} out={1026.4} />);
  L.push(<Comment key="cm" t={t} at={1026.8} out={1036.0} reply={1034.0} />);
  L.push(<Tag key="nx" t={t} at={1036.6} x={960} y={540} dx={-330} dy={-230} text="NEXT TIME" sub="WHAT YOUR KEY RING TELLS A STRANGER" col={COL.amber} out={1043.0} size={56} />);

  return <AbsoluteFill style={{ background: "#000" }}>{L}</AbsoluteFill>;
};
void at;
