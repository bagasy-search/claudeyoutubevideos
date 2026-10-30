// Rig de Blanquito: FK (torso/cabeza por ángulos) + IK analítico de 2 huesos (brazos y piernas por objetivo).
// Ejes (espacio del personaje, mira hacia +z = cámara): x = su IZQUIERDA (derecha de pantalla), y = arriba, z = adelante.
// Ángulos en GRADOS. Torso: inclinX + = se inclina hacia adelante; inclinZ + = se ladea hacia su izquierda (+x);
// giroY + = gira el pecho hacia su izquierda. Cabeza: x + = mira abajo (asiente), y + = gira a su izquierda, z + = inclina hacia su izquierda.
// Manos: objetivo de la MUÑECA en espacio del PECHO (origen = punto de los hombros, ejes del torso).
// Pies: objetivo del TOBILLO en espacio de la RAÍZ (piso en y = 0, sin la rotación del torso).
import * as THREE from "three";
import { PROPORCIONES as P } from "./proporciones";
import { curvaGoma, v3, V3 } from "./geometria";
import type { Capsula } from "./material";

export type FormaMano = "miton" | "puno" | "abierta" | "pulgar" | "senala";
export const FORMAS_MANO: FormaMano[] = ["miton", "puno", "abierta", "pulgar", "senala"];

export type PoseMano = {
  p: V3; // muñeca, espacio pecho
  polo: V3; // hacia dónde apunta el codo
  forma: number[]; // pesos [miton, puno, abierta, pulgar, senala]
  giro: number; // giro de la mano alrededor del antebrazo (grados)
  dobla: number; // flexión de muñeca (grados, + = hacia la palma)
  goma: number; // redondeo del codo (0.1 duro … 0.45 manguera)
  arqueo: number; // arqueo de todo el brazo (u)
};
export type PosePie = {
  p: V3; // tobillo, espacio raíz
  polo: V3; // hacia dónde apunta la rodilla
  yaw: number; // hacia dónde apunta la punta (grados, 0 = +z)
  pitch: number; // punta arriba (+) / abajo (-)
  goma: number;
  arqueo: number;
};
export type Pose = {
  raiz: V3; // desplazamiento de la pelvis respecto de (0, cadera.altura, 0)
  rotY: number; // giro de todo el cuerpo (grados)
  torso: { x: number; z: number; y: number; curva: number; lado: number }; // curva = arqueo hacia adelante, lado = panza de la S hacia su izquierda (u)
  cabeza: { x: number; y: number; z: number; lado: number }; // lado = corrimiento de la cabeza sobre el cuello (u, + = su izquierda)
  manoI: PoseMano; manoD: PoseMano;
  pieI: PosePie; pieD: PosePie;
  aplaste: number; // squash & stretch global (1 = normal, <1 aplasta, >1 estira)
  aplasteCabeza: number;
  temblor: number; // líneas de temblor alrededor (0–1)
};

const M = (w: number[]) => { const s = w.reduce((a, b) => a + b, 0) || 1; return w.map((x) => x / s); };
export const mano = (p: V3, polo: V3, forma: Partial<Record<FormaMano, number>> = { miton: 1 }, giro = 0, extra: Partial<PoseMano> = {}): PoseMano => ({
  p, polo, forma: M(FORMAS_MANO.map((k) => forma[k] ?? 0)), giro, dobla: 0, goma: 0.32, arqueo: 0, ...extra,
});
export const pie = (p: V3, yaw = 0, extra: Partial<PosePie> = {}): PosePie => ({ p, polo: [0, 0, 1], yaw, pitch: 0, goma: 0.3, arqueo: 0, ...extra });

// pose de reposo (parado, brazos colgando)
export const POSE_BASE: Pose = {
  raiz: [0, 0, 0], rotY: 0,
  torso: { x: 0, z: 0, y: 0, curva: 0, lado: 0 },
  cabeza: { x: 0, y: 0, z: 0, lado: 0 },
  manoD: mano([-0.42, -1.27, 0.05], [-0.6, 0, -1]),
  manoI: mano([0.42, -1.27, 0.05], [0.6, 0, -1]),
  pieD: pie([-0.2, P.pie.tobilloAlto, -0.02], -12, { polo: [-0.2, 0, 1] }),
  pieI: pie([0.2, P.pie.tobilloAlto, -0.02], 12, { polo: [0.2, 0, 1] }),
  aplaste: 1, aplasteCabeza: 1, temblor: 0,
};

// ---------- mezcla de poses (todo numérico) ----------
const mezNum = (a: number, b: number, t: number) => a + (b - a) * t;
export const mezclar = <T,>(a: T, b: T, t: number): T => {
  if (typeof a === "number") return mezNum(a, b as unknown as number, t) as unknown as T;
  if (Array.isArray(a)) return (a as unknown[]).map((x, i) => mezclar(x, (b as unknown as unknown[])[i], t)) as unknown as T;
  if (a && typeof a === "object") {
    const o: Record<string, unknown> = {};
    for (const k of Object.keys(a as object)) o[k] = mezclar((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], t);
    return o as T;
  }
  return (t < 0.5 ? a : b);
};
// suma un «delta» (pose − base) escalado: para capas aditivas (respiración, temblor…)
export const sumarCapa = (p: Pose, f: (p: Pose) => void): Pose => { const q = JSON.parse(JSON.stringify(p)) as Pose; f(q); return q; };

// ---------- IK de 2 huesos ----------
export const ik2 = (raiz: THREE.Vector3, obj: THREE.Vector3, l1: number, l2: number, polo: THREE.Vector3) => {
  const d0 = obj.clone().sub(raiz);
  let d = d0.length();
  const dir = d > 1e-6 ? d0.clone().divideScalar(d) : v3(0, -1, 0);
  d = Math.min(Math.max(d, Math.abs(l1 - l2) + 1e-3), (l1 + l2) * 0.9995);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  let pd = polo.clone().sub(dir.clone().multiplyScalar(polo.dot(dir)));
  if (pd.lengthSq() < 1e-8) pd = Math.abs(dir.y) < 0.9 ? v3(0, 1, 0).sub(dir.clone().multiplyScalar(dir.y)) : v3(0, 0, 1);
  pd.normalize();
  const codo = raiz.clone().addScaledVector(dir, a).addScaledVector(pd, h);
  const punta = raiz.clone().addScaledVector(dir, d);
  return { codo, punta, lado: pd };
};

const R3 = (x: number, y: number, z: number) => new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(x), THREE.MathUtils.degToRad(y), THREE.MathUtils.degToRad(z), "YXZ"));

export type ManoResuelta = { muneca: THREE.Vector3; eje: THREE.Vector3; pulgar: THREE.Vector3; palma: THREE.Vector3; forma: number[]; dobla: number; brazo: THREE.Vector3[] };
export type PieResuelto = { tobillo: THREE.Vector3; centro: THREE.Vector3; dir: THREE.Vector3; pierna: THREE.Vector3[] };
export type Esqueleto = {
  pelvis: THREE.Vector3; cuello: THREE.Vector3; hombro: THREE.Vector3;
  torsoCurva: THREE.Vector3[];
  cabeza: { centro: THREE.Vector3; rot: THREE.Matrix4; aplaste: number };
  pecho: THREE.Matrix4;
  manoI: ManoResuelta; manoD: ManoResuelta;
  pieI: PieResuelto; pieD: PieResuelto;
};

const N_MIEMBRO = 40;

// resuelve la pose en coordenadas del PERSONAJE (sin la posición/rotY del mundo, que pone el grupo)
export const resolver = (pose: Pose, escalaCuerpo = 1): Esqueleto => {
  const st = pose.aplaste;
  const pelvis = v3(pose.raiz[0], P.cadera.altura * (0.5 + 0.5 * st) + pose.raiz[1], pose.raiz[2]);
  const rotT = R3(pose.torso.x, pose.torso.y, -pose.torso.z);
  const arriba = v3(0, 1, 0).applyMatrix4(rotT);
  const adelante = v3(0, 0, 1).applyMatrix4(rotT);
  const Lt = P.torso.largo * st * escalaCuerpo;
  const cuello = pelvis.clone().addScaledVector(arriba, Lt);
  const hombro = pelvis.clone().addScaledVector(arriba, Lt - P.torso.hombroBajoMenton);
  // torso: tubo de pelvis a cuello con arqueo hacia adelante
  const mid = pelvis.clone().lerp(cuello, 0.5).addScaledVector(adelante, pose.torso.curva).addScaledVector(v3(1, 0, 0).applyMatrix4(rotT), pose.torso.lado);
  const torsoCurva = curvaGoma(pelvis.clone().addScaledVector(arriba, -0.03), mid, cuello, 0.5, 0, adelante, N_MIEMBRO);
  // cabeza
  const rotC = rotT.clone().multiply(R3(pose.cabeza.x, pose.cabeza.y, -pose.cabeza.z));
  const arribaC = v3(0, 1, 0).applyMatrix4(rotC);
  const ladoC = v3(1, 0, 0).applyMatrix4(rotC);
  const cabCentro = cuello.clone().addScaledVector(arribaC, P.cabeza.radio * P.cabeza.achatadoY * pose.aplasteCabeza - P.cabeza.hundida - Math.abs(pose.cabeza.lado) * 0.25).addScaledVector(ladoC, pose.cabeza.lado);

  const brazo = (pm: PoseMano, signo: number): ManoResuelta => {
    const raiz = hombro.clone().add(v3(signo * P.brazo.separacionHombros, -0.02, -0.01).applyMatrix4(rotT));
    const obj = hombro.clone().add(v3(...pm.p).applyMatrix4(rotT));
    const polo = v3(...pm.polo).applyMatrix4(rotT);
    const { codo, punta, lado } = ik2(raiz, obj, P.brazo.superior, P.brazo.antebrazo, polo);
    const pts = curvaGoma(raiz, codo, punta, pm.goma, pm.arqueo, lado, N_MIEMBRO);
    const eje = punta.clone().sub(pts[N_MIEMBRO - 4]).normalize();
    // pulgar de referencia: «adelante del pecho» proyectado ⟂ al antebrazo, girado por pm.giro
    let ref = adelante.clone().sub(eje.clone().multiplyScalar(adelante.dot(eje)));
    if (ref.lengthSq() < 1e-4) ref = arriba.clone().sub(eje.clone().multiplyScalar(arriba.dot(eje)));
    ref.normalize().applyAxisAngle(eje, THREE.MathUtils.degToRad(pm.giro * signo));
    const palma = eje.clone().cross(ref).multiplyScalar(-signo).normalize();
    return { muneca: punta, eje, pulgar: ref, palma, forma: pm.forma, dobla: pm.dobla, brazo: pts };
  };
  const pierna = (pp: PosePie, signo: number): PieResuelto => {
    const raiz = pelvis.clone().add(v3(signo * P.pierna.separacionCadera, 0.0, 0));
    const tob = v3(...pp.p);
    const { codo, punta, lado } = ik2(raiz, tob, P.pierna.muslo, P.pierna.canilla, v3(...pp.polo));
    const pts = curvaGoma(raiz, codo, punta, pp.goma, pp.arqueo, lado, N_MIEMBRO);
    const yaw = THREE.MathUtils.degToRad(pp.yaw), pit = THREE.MathUtils.degToRad(pp.pitch);
    const dir = v3(Math.sin(yaw) * Math.cos(pit), Math.sin(pit), Math.cos(yaw) * Math.cos(pit)).normalize();
    const largo = P.pie.largo;
    // el tobillo cae sobre el tercio de atrás del pie
    const centro = punta.clone().addScaledVector(dir, largo * 0.2).add(v3(0, -(P.pie.tobilloAlto - P.pie.radio * P.pie.aplaste) * 0.98, 0));
    return { tobillo: punta, centro, dir, pierna: pts };
  };

  return {
    pelvis, cuello, hombro, torsoCurva,
    cabeza: { centro: cabCentro, rot: rotC, aplaste: pose.aplasteCabeza },
    pecho: rotT,
    manoI: brazo(pose.manoI, 1), manoD: brazo(pose.manoD, -1),
    pieI: pierna(pose.pieI, 1), pieD: pierna(pose.pieD, -1),
  };
};

// cápsulas para la AO (en coordenadas del personaje; Stickman las pasa a mundo)
export const capsulasDe = (e: Esqueleto): Capsula[] => {
  const caps: Capsula[] = [];
  const tramos = (pts: THREE.Vector3[], r: number, k: number) => {
    for (let i = 0; i < k; i++) {
      const a = pts[Math.round((i / k) * (pts.length - 1))], b = pts[Math.round(((i + 1) / k) * (pts.length - 1))];
      caps.push({ a: a.clone(), b: b.clone(), r });
    }
  };
  tramos(e.torsoCurva, P.torso.radio, 3);
  caps.push({ a: e.cabeza.centro.clone(), b: e.cabeza.centro.clone(), r: P.cabeza.radio * 0.98 });
  for (const m of [e.manoI, e.manoD]) {
    tramos(m.brazo, P.brazo.radio, 4);
    const c = m.muneca.clone().addScaledVector(m.eje, P.mano.largo * 0.55);
    caps.push({ a: c, b: c.clone(), r: P.mano.ancho * 0.95 });
  }
  for (const p of [e.pieI, e.pieD]) {
    tramos(p.pierna, P.pierna.radio, 4);
    const h = P.pie.largo / 2 - P.pie.radio;
    caps.push({ a: p.centro.clone().addScaledVector(p.dir, -h), b: p.centro.clone().addScaledVector(p.dir, h), r: P.pie.radio * 0.92 });
  }
  return caps;
};
