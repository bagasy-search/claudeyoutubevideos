// Acciones: cada una es una función pura (segundos desde que empezó) → Pose. El guion las encadena con mezcla de
// poses (~10 cuadros), follow-through (cabeza y manos llegan 2–3 cuadros tarde), respiración y peso que nunca se
// congelan, parpadeo con semilla y transición de expresiones con resorte. Todo función pura del cuadro.
import { EXPRESIONES, Expresion, NombreExpresion, ParamOjo } from "./expresiones";
import { mano, mezclar, pie, Pose, POSE_BASE, PoseMano, PosePie } from "./rig";
import { V3 } from "./geometria";
import { PROPORCIONES as P } from "./proporciones";
import { parpadeos, ruido1 } from "./prng";

// ---------- utilidades de tiempo ----------
const PI = Math.PI;
const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const suave = (t: number, a: number, b: number) => { const x = cl((t - a) / (b - a)); return x * x * x * (x * (x * 6 - 15) + 10); };
const sube = (t: number, a: number, b: number) => { const x = cl((t - a) / (b - a)); return 1 - Math.pow(1 - x, 3); }; // ease-out
// resorte amortiguado en forma cerrada (follow-through con un poco de rebote)
export const resorte = (t: number, frec = 2.4, amort = 0.42) => {
  if (t <= 0) return 0;
  const w = 2 * PI * frec, wd = w * Math.sqrt(1 - amort * amort);
  return 1 - Math.exp(-amort * w * t) * (Math.cos(wd * t) + (amort * w / wd) * Math.sin(wd * t));
};
const osc = (t: number, per: number, fase = 0) => Math.sin(2 * PI * (t / per + fase));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const L3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

type Parcial<T> = { [K in keyof T]?: T[K] extends object ? Parcial<T[K]> : T[K] };
const clon = (p: Pose): Pose => JSON.parse(JSON.stringify(p));
export const pose = (o: Parcial<Pose> = {}, desde: Pose = POSE_BASE): Pose => {
  const q = clon(desde);
  const fusion = (dst: Record<string, unknown>, src: Record<string, unknown>) => {
    for (const k of Object.keys(src)) {
      const v = src[k];
      if (v && typeof v === "object" && !Array.isArray(v) && dst[k] && typeof dst[k] === "object") fusion(dst[k] as Record<string, unknown>, v as Record<string, unknown>);
      else if (v !== undefined) dst[k] = Array.isArray(v) ? [...v] : v;
    }
  };
  fusion(q as unknown as Record<string, unknown>, o as Record<string, unknown>);
  return q;
};

// ---------- manos y pies frecuentes (espacio pecho / raíz) ----------
const AT = P.pie.tobilloAlto;
const MD = (p: V3, polo: V3, forma: Parameters<typeof mano>[2] = { miton: 1 }, giro = 0, x: Partial<PoseMano> = {}) => mano(p, polo, forma, giro, x);
const colgando = { I: MD([0.42, -1.27, 0.05], [0.6, 0, -1]), D: MD([-0.42, -1.27, 0.05], [-0.6, 0, -1]) };
const enCadera = { I: MD([0.36, -0.86, -0.06], [1, 0.1, -0.5], { puno: 1 }, 80, { goma: 0.22 }), D: MD([-0.36, -0.86, -0.06], [-1, 0.1, -0.5], { puno: 1 }, 80, { goma: 0.22 }) };
const parado = { I: pie([0.2, AT, -0.02], 12, { polo: [0.2, 0, 1] }), D: pie([-0.2, AT, -0.02], -12, { polo: [-0.2, 0, 1] }) };

// ---------- POSES clave (también las usa la grilla de la hoja de expresiones) ----------
export const POSES = {
  parado: pose(),
  // la de la referencia: baile con brazo arriba, cadera ladeada, rodilla doblada
  ref: pose({
    raiz: [0.07, -0.1, 0], torso: { x: 1, z: -5, y: 4, curva: 0.012, lado: 0.035 }, cabeza: { x: -2, y: -2, z: 8, lado: -0.12 },
    manoI: MD([0.9, 1.0, 0.1], [1, -0.8, 0.2], { miton: 1 }, -80, { goma: 0.5, arqueo: 0.03, dobla: -15 }),
    manoD: MD([-0.86, -1.0, 0.04], [-1, -0.3, -0.3], { miton: 1 }, 10, { goma: 0.5, arqueo: 0.05 }),
    pieD: pie([-0.4, AT, 0.06], -72, { polo: [-1, 0, 0.6], goma: 0.4 }),
    pieI: pie([0.6, AT, -0.04], 6, { polo: [0.35, 0, 1], goma: 0.4, arqueo: 0.03 }),
  }),
  saludo_carcajada: pose({
    torso: { z: 3, x: -2 }, cabeza: { z: 10, x: -6, y: -16 },
    manoI: MD([0.5, 1.05, 0.05], [1, -0.3, -0.2], { abierta: 1 }, -70, { goma: 0.4, arqueo: 0.05 }),
    manoD: MD([-0.45, -1.1, 0.05], [-0.6, 0, -1]),
  }),
  cabizbajo: pose({
    torso: { x: 10, curva: 0.06 }, cabeza: { x: 24, z: 14, y: -10 }, raiz: [0, -0.03, 0],
    manoI: MD([0.2, -1.2, 0.18], [0.5, 0, -1], { miton: 1 }, 0, { goma: 0.2 }), manoD: MD([-0.2, -1.2, 0.18], [-0.5, 0, -1], { miton: 1 }, 0, { goma: 0.2 }),
  }),
  brazos_cruzados: pose({
    torso: { x: -3 }, cabeza: { x: -4, z: 3 },
    manoI: MD([-0.2, -0.46, 0.38], [0.8, -0.6, 0.3], { miton: 1 }, 70, { goma: 0.3 }),
    manoD: MD([0.22, -0.52, 0.32], [-0.8, -0.6, 0.4], { miton: 1 }, 70, { goma: 0.3 }),
  }),
  temblando: pose({
    raiz: [0, -0.06, 0], torso: { x: 6, curva: 0.03 }, cabeza: { x: 6 },
    manoI: MD([0.2, 0.08, 0.36], [0.5, -1, 0.1], { puno: 1 }, 40, { goma: 0.35 }),
    manoD: MD([-0.2, 0.05, 0.36], [-0.5, -1, 0.1], { puno: 1 }, 40, { goma: 0.35 }),
    pieI: pie([0.16, AT, 0.0], -5, { polo: [-0.4, 0, 1] }), pieD: pie([-0.16, AT, 0.0], 5, { polo: [0.4, 0, 1] }),
    temblor: 1,
  }),
  manos_cabeza: pose({
    cabeza: { x: -3 },
    manoI: MD([0.45, 0.52, 0.06], [1, -0.6, 0], { abierta: 1 }, 100, { goma: 0.4 }),
    manoD: MD([-0.45, 0.52, 0.06], [-1, -0.6, 0], { abierta: 1 }, 100, { goma: 0.4 }),
  }),
  rascarse: pose({
    cabeza: { z: -16, x: -2, y: 12 }, torso: { z: -2 },
    manoI: MD([0.22, 0.86, 0.0], [1, 0.1, -0.2], { miton: 1 }, 140, { goma: 0.35, dobla: 30 }),
    manoD: MD([-0.38, -1.24, 0.05], [-0.6, 0, -1]),
  }),
  pensar: pose({
    cabeza: { z: -8, x: -4, y: 6 },
    manoD: MD([-0.02, -0.1, 0.42], [-0.6, -1, 0.3], { puno: 1 }, 140, { goma: 0.3 }),
    manoI: MD([-0.22, -0.66, 0.28], [0.6, -1, 0.4], { miton: 1 }, 80, { goma: 0.3 }),
  }),
  bostezar: pose({
    cabeza: { z: 8, x: -6 }, torso: { z: 3 },
    manoI: MD([0.12, 0.0, 0.46], [1, -0.7, 0.2], { puno: 1 }, 160, { goma: 0.3 }),
    manoD: enCadera.D,
  }),
  pulgar_arriba: pose({
    torso: { z: 2 }, cabeza: { z: -5 },
    manoI: MD([0.8, -0.42, 0.3], [0.2, -1, -0.4], { pulgar: 1 }, -90, { goma: 0.3 }),
    manoD: MD([-0.4, -1.24, 0.06], [-0.6, 0, -1]),
  }),
  manos_cadera: pose({ torso: { z: 1 }, cabeza: { z: 4 }, manoI: enCadera.I, manoD: enCadera.D }),
  salto_alegria: pose({
    raiz: [0, 0.55, 0], aplaste: 1.03, torso: { x: -4 }, cabeza: { x: -8 },
    manoI: MD([1.12, 0.42, 0.05], [0.3, -1, 0], { abierta: 1 }, -90, { goma: 0.35 }),
    manoD: MD([-1.1, 0.3, 0.05], [-0.3, -1, 0], { abierta: 1 }, -90, { goma: 0.35 }),
    pieI: pie([0.5, 1.15, -0.3], 30, { polo: [1, 0.2, 0.3], pitch: -45 }), pieD: pie([-0.12, 1.05, -0.1], -40, { polo: [-1, 0.1, 0.4], pitch: -20 }),
  }),
  panza_risa: pose({
    torso: { x: 8, curva: 0.04, z: -2 }, cabeza: { x: -10, z: -6 },
    manoI: MD([0.08, -0.82, 0.32], [1, -0.4, 0.2], { miton: 1 }, 90, { goma: 0.3 }),
    manoD: MD([-0.05, -0.55, 0.36], [-1, -0.4, 0.2], { miton: 1 }, 90, { goma: 0.3 }),
  }),
} satisfies Record<string, Pose>;
export type NombrePose = keyof typeof POSES;

// ---------- ACCIONES ----------
export type Ctx = { objetivo?: [number, number]; semilla: number; dur: number };
export type Accion = { pose: (t: number, c: Ctx) => Pose; velocidad?: (t: number) => number; respira?: number; dur?: number };

const conPeso = (p: Pose, t: number, k = 1, semilla = 1): Pose => {
  // micro-movimiento de peso y balanceo para que NUNCA quede congelado
  const q = clon(p);
  q.raiz[0] += 0.018 * k * ruido1(t * 0.35, semilla);
  q.torso.z += 1.4 * k * ruido1(t * 0.4, semilla + 3);
  q.torso.x += 0.8 * k * ruido1(t * 0.3, semilla + 5);
  q.cabeza.z += 2.0 * k * ruido1(t * 0.45, semilla + 7);
  q.cabeza.y += 2.5 * k * ruido1(t * 0.3, semilla + 9);
  q.cabeza.x += 1.2 * k * ruido1(t * 0.5, semilla + 11);
  return q;
};

// ciclo de caminar/correr: contacto → bajada → paso → subida; pies plantados (en el espacio de la raíz el pie de apoyo
// retrocede EXACTAMENTE a la velocidad del cuerpo → en el mundo queda fijo, no patina)
const ciclo = (t: number, per: number, vel: number, o: { apoyo?: number; alto?: number; brazos?: number; incl?: number; rebote?: number; codo?: number; correr?: boolean }) => {
  const apoyo = o.apoyo ?? 0.62, alto = o.alto ?? 0.16, rebote = o.rebote ?? 0.04;
  const piePos = (fase: number, lado: number): PosePie => {
    const ph = ((t / per + fase) % 1 + 1) % 1;
    const Lap = vel * per * apoyo; // recorrido durante el apoyo
    let zz: number, yy = AT, pit = 0;
    if (ph < apoyo) { const s = ph / apoyo; zz = Lap / 2 - s * Lap; pit = s > 0.75 ? -(s - 0.75) * 60 : 0; }
    else {
      const s = (ph - apoyo) / (1 - apoyo), e = s * s * (3 - 2 * s);
      zz = -Lap / 2 + e * Lap; yy = AT + alto * Math.sin(PI * s) * (1 - 0.3 * s); pit = 25 * Math.sin(PI * Math.min(1, s * 1.3)) - 10 * Math.sin(PI * s);
    }
    return pie([lado * 0.14, yy, zz], lado * 4, { polo: [lado * 0.1, 0, 1], pitch: pit, goma: 0.3 });
  };
  const ph = (t / per) % 1;
  const subeBaja = -Math.cos(4 * PI * ph);
  const giro = Math.sin(2 * PI * ph);
  const br = o.brazos ?? 0.5, codo = o.codo ?? 0;
  const brazo = (lado: number, s: number): PoseMano => o.correr
    ? MD([lado * 0.3, -0.62 + 0.18 * s, 0.1 + 0.42 * s], [lado * 0.4, -0.2, -1], { puno: 1 }, 30, { goma: 0.2 })
    : MD([lado * 0.4, -1.22 + 0.08 * Math.abs(s) + codo, 0.04 + br * s], [lado * 0.5, 0, -1], { miton: 1 }, 0, { goma: 0.34 });
  return pose({
    raiz: [0.012 * giro, (o.correr ? -0.03 : 0.05) + rebote * subeBaja, 0],
    torso: { x: o.incl ?? 4, y: -6 * giro, z: 1.5 * giro },
    cabeza: { y: 4 * giro, x: -(o.incl ?? 4) * 0.6 },
    pieI: piePos(0, 1), pieD: piePos(0.5, -1),
    manoI: brazo(1, -giro), manoD: brazo(-1, giro),
  });
};

const dir2 = (c: Ctx): V3 => { const [x, y] = c.objetivo ?? [0.8, 0.3]; const l = Math.hypot(x, y, 0.35) || 1; return [x / l, y / l, 0.35 / l]; };

export const ACCIONES: Record<string, Accion> = {
  idle: { pose: (t, c) => conPeso(POSES.parado, t, 1, c.semilla), respira: 1 },
  quieto: { pose: () => POSES.parado, respira: 1 },
  pose_ref: { pose: (t, c) => conPeso(POSES.ref, t, 0.5, c.semilla), respira: 1 },

  saludar: {
    respira: 0.7,
    pose: (t, c) => {
      const sub = resorte(t - 0.18, 2.2, 0.45), ola = suave(t, 0.45, 0.65);
      const w = osc(t - 0.5, 0.56) * ola;
      const arriba = MD([0.84 + 0.13 * w, 0.82 - 0.03 * Math.abs(w), 0.12], [1, -0.4, -0.1], { abierta: 1 }, -80 + 12 * w, { goma: 0.42, arqueo: 0.04, dobla: -10 * w });
      const p = pose({ torso: { z: -3 * sub + 1.2 * w, x: -1 }, cabeza: { z: -7 * sub - 2 * w, x: -3 }, manoI: arriba });
      // anticipación: el brazo baja un poco y el torso se carga al otro lado antes de subir
      const ant = suave(t, 0, 0.16) * (1 - suave(t, 0.16, 0.3));
      const pre = pose({ torso: { z: 2.5 }, manoI: MD([0.48, -1.3, -0.05], [0.6, 0, -1]) });
      const q = mezclar(mezclar(POSES.parado, pre, ant), p, cl(sub, 0, 1.08));
      return conPeso(q, t, 0.6, c.semilla);
    },
  },
  saludar_dos_manos: {
    respira: 0.6,
    pose: (t, c) => {
      const sub = resorte(t - 0.12, 2.0, 0.45), w = osc(t - 0.4, 0.5) * suave(t, 0.35, 0.55);
      const p = pose({
        raiz: [0, 0.02 * Math.abs(w), 0], torso: { z: 2 * w }, cabeza: { z: -4 * w, x: -4 },
        manoI: MD([0.62 + 0.12 * w, 0.95, 0.08], [1, -0.4, -0.1], { abierta: 1 }, -80 + 12 * w, { goma: 0.42, arqueo: 0.04 }),
        manoD: MD([-0.62 + 0.12 * w, 0.95, 0.08], [-1, -0.4, -0.1], { abierta: 1 }, -80 - 12 * w, { goma: 0.42, arqueo: 0.04 }),
      });
      return conPeso(mezclar(POSES.parado, p, cl(sub, 0, 1.08)), t, 0.4, c.semilla);
    },
  },
  caminar: { respira: 0.25, velocidad: () => 0.95, pose: (t) => ciclo(t, 1.05, 0.95, {}) },
  correr: { respira: 0.1, velocidad: () => 2.5, pose: (t) => ciclo(t, 0.62, 2.5, { apoyo: 0.4, alto: 0.3, incl: 14, rebote: 0.07, correr: true }) },

  saltar: {
    respira: 0.2,
    pose: (t, c) => {
      // 0–0.32 se agacha (anticipación) · 0.32–0.42 despega estirado · vuelo hasta 0.9 · 0.9 aterriza aplastado · se recupera
      const ag = suave(t, 0.0, 0.3) * (1 - suave(t, 0.3, 0.38));
      const vuelo = cl((t - 0.36) / 0.56);
      const h = vuelo > 0 && vuelo < 1 ? 4 * vuelo * (1 - vuelo) : 0;
      const at = t > 0.92 ? Math.exp(-(t - 0.92) * 9) * Math.sin(Math.min(PI, (t - 0.92) * 18)) : 0;
      const est = vuelo > 0 && vuelo < 1 ? 0.06 * (1 - Math.abs(vuelo - 0.15) * 3) : 0;
      const encogido = Math.sin(PI * vuelo) * (vuelo > 0 && vuelo < 1 ? 1 : 0);
      const p = pose({
        raiz: [0, -0.32 * ag + 0.72 * h - 0.18 * at, 0],
        aplaste: 1 - 0.07 * ag + Math.max(0, est) - 0.08 * at, aplasteCabeza: 1 - 0.06 * at + 0.02 * Math.max(0, est),
        torso: { x: 18 * ag - 6 * encogido + 10 * at, curva: 0.04 * ag },
        cabeza: { x: -10 * ag + 6 * at },
        manoI: MD(L3([0.42, -1.24, 0.05], [0.32, -0.9, -0.5], ag), [0.6, 0, -1]),
        manoD: MD(L3([-0.42, -1.24, 0.05], [-0.32, -0.9, -0.5], ag), [-0.6, 0, -1]),
        pieI: pie([0.18, AT + 0.72 * h + 0.3 * encogido, -0.05 * encogido], 10, { polo: [0.2, 0, 1], pitch: -30 * encogido }),
        pieD: pie([-0.18, AT + 0.72 * h + 0.3 * encogido, -0.05 * encogido], -10, { polo: [-0.2, 0, 1], pitch: -30 * encogido }),
      });
      const brazosArriba = Math.sin(PI * cl(vuelo * 1.1));
      p.manoI = mezclar(p.manoI, MD([0.7, 0.75, 0.1], [0.4, -1, 0], { abierta: 1 }, -90), brazosArriba * 0.8);
      p.manoD = mezclar(p.manoD, MD([-0.7, 0.75, 0.1], [-0.4, -1, 0], { abierta: 1 }, -90), brazosArriba * 0.8);
      return t > 1.6 ? conPeso(p, t, suave(t, 1.6, 2.2), c.semilla) : p;
    },
  },
  festejar: {
    respira: 0.2,
    pose: (t) => {
      const per = 0.5, ph = (t % per) / per, h = Math.max(0, Math.sin(PI * ph * 1.25)) * suave(t, 0.1, 0.3);
      const sq = ph > 0.8 ? Math.sin(PI * (ph - 0.8) / 0.2) : 0;
      const ent = resorte(t, 2.2, 0.45);
      const p = pose({
        raiz: [0, 0.22 * h - 0.08 * sq, 0], aplaste: 1 + 0.03 * h - 0.05 * sq, aplasteCabeza: 1 - 0.03 * sq,
        torso: { x: -4, z: 3 * osc(t, 1.0) }, cabeza: { x: -10, z: -5 * osc(t, 1.0) },
        manoI: MD([0.7, 0.95 + 0.08 * h, 0.05], [0.5, -1, 0], { puno: 1 }, -90, { goma: 0.38 }),
        manoD: MD([-0.7, 0.95 + 0.08 * h, 0.05], [-0.5, -1, 0], { puno: 1 }, -90, { goma: 0.38 }),
        pieI: pie([0.2, AT + 0.22 * h, -0.02], 12, { polo: [0.2, 0, 1], pitch: -15 * h }), pieD: pie([-0.2, AT + 0.22 * h, -0.02], -12, { polo: [-0.2, 0, 1], pitch: -15 * h }),
      });
      return mezclar(POSES.parado, p, cl(ent, 0, 1.06));
    },
  },
  senalar: {
    respira: 0.7,
    pose: (t, c) => {
      const d = dir2(c), lado = d[0] >= 0 ? 1 : -1;
      const ent = resorte(t - 0.1, 2.3, 0.5);
      const brazo = MD([d[0] * 1.3, d[1] * 1.3 - 0.05, d[2] * 1.3 + 0.1], [lado * 0.3, -1, -0.2], { senala: 1 }, -90 * lado + 90, { goma: 0.25 });
      const p = pose({ torso: { y: 10 * lado, z: -2 * lado }, cabeza: { y: 18 * d[0], x: -10 * d[1] } });
      if (lado > 0) p.manoI = brazo; else p.manoD = brazo;
      const ant = suave(t, 0, 0.1) * (1 - suave(t, 0.1, 0.22));
      const pre = pose({ torso: { y: -5 * lado } });
      return conPeso(mezclar(mezclar(POSES.parado, pre, ant), p, cl(ent, 0, 1.06)), t, 0.5, c.semilla);
    },
  },
  explicar: {
    respira: 0.8,
    pose: (t, c) => {
      const a = osc(t, 1.6), b = osc(t, 1.6, 0.3), g = Math.max(0, osc(t, 0.8)) ;
      const p = pose({
        torso: { y: 6 * a, z: 1.5 * b, x: 2 }, cabeza: { y: -5 * a, z: 4 * b, x: -2 + 3 * g },
        manoI: MD([0.42 + 0.08 * a, -0.42 + 0.1 * g, 0.42 + 0.06 * b], [1, -0.7, -0.2], { abierta: 1 }, -20 + 20 * b, { goma: 0.35 }),
        manoD: MD([-0.42 + 0.08 * b, -0.48 + 0.12 * Math.max(0, osc(t, 0.8, 0.4)), 0.4 + 0.06 * a], [-1, -0.7, -0.2], { abierta: 1 }, -20 + 20 * a, { goma: 0.35 }),
      });
      return conPeso(mezclar(POSES.parado, p, cl(resorte(t, 2, 0.5), 0, 1.05)), t, 0.6, c.semilla);
    },
  },
  pensar: {
    respira: 1,
    pose: (t, c) => { const p = clon(POSES.pensar); p.manoD.p[1] += 0.015 * osc(t, 1.4); p.cabeza.z += 2 * osc(t, 3.1); return conPeso(mezclar(POSES.parado, p, cl(resorte(t, 1.8, 0.55), 0, 1.04)), t, 0.6, c.semilla); },
  },
  encogerse_de_hombros: {
    respira: 0.6,
    pose: (t, c) => {
      const e = suave(t, 0.05, 0.35) * (1 - suave(t, 1.4, 1.8));
      const p = pose({
        raiz: [0, 0.03, 0], torso: { z: -2 }, cabeza: { z: 12, x: -2 },
        manoI: MD([0.62, -0.62, 0.32], [1, -1, 0.2], { abierta: 1 }, 90, { goma: 0.35 }),
        manoD: MD([-0.62, -0.62, 0.32], [-1, -1, 0.2], { abierta: 1 }, 90, { goma: 0.35 }),
      });
      return conPeso(mezclar(POSES.parado, p, e), t, 0.5, c.semilla);
    },
  },
  facepalm: {
    respira: 0.6,
    pose: (t, c) => {
      const e = sube(t, 0.1, 0.42), golpe = Math.exp(-Math.max(0, t - 0.42) * 10) * (t > 0.42 ? 1 : 0);
      const p = pose({
        torso: { x: 10 + 4 * golpe, curva: 0.04 }, cabeza: { x: 22 + 8 * golpe, z: 6 },
        manoD: MD([-0.02, 0.36, 0.48], [-1, -0.8, 0], { abierta: 1 }, 180, { goma: 0.35 }),
      });
      return conPeso(mezclar(POSES.parado, p, e), t, 0.4, c.semilla);
    },
  },
  reir: {
    // carcajada: se agarra la panza, la cabeza va para atrás y el cuerpo «hipa» (~4,5 Hz) con un vaivén lento encima
    respira: 0.1,
    pose: (t, c) => {
      const ent = cl(resorte(t, 2.0, 0.5), 0, 1.05);
      const hipo = Math.abs(Math.sin(PI * 4.5 * t)) * suave(t, 0.15, 0.4), vai = Math.sin(2 * PI * 0.6 * t);
      const p = clon(POSES.panza_risa);
      p.raiz = [0.02 * vai, -0.03 * hipo, 0];
      p.aplaste = 1 - 0.025 * hipo;
      p.torso.x = 8 + 5 * hipo; p.torso.z = -2 + 4 * vai;
      p.cabeza.x = -16 - 6 * hipo; p.cabeza.z = -6 + 6 * vai;
      p.manoI.p[1] += 0.03 * hipo; p.manoD.p[1] += 0.03 * hipo;
      return conPeso(mezclar(POSES.parado, p, ent), t, 0.3, c.semilla);
    },
  },
  enojado_pisoton: {
    respira: 0.3,
    pose: (t) => {
      const per = 0.7, ph = (t % per) / per;
      const lev = ph < 0.55 ? Math.sin(PI * ph / 0.55) : 0, golpe = ph >= 0.55 ? Math.exp(-(ph - 0.55) * 14) : 0;
      const ent = suave(t, 0, 0.2);
      const lado = Math.floor(t / per) % 2 === 0 ? 1 : -1;
      const p = pose({
        raiz: [0, -0.06 * golpe + 0.03 * lev, 0], aplaste: 1 - 0.04 * golpe, aplasteCabeza: 1 - 0.04 * golpe,
        torso: { x: 10, z: -3 * lado * lev }, cabeza: { x: -6 + 6 * golpe },
        manoI: MD([0.36, -0.95 + 0.25 * lev, 0.12], [1, 0.2, -0.6], { puno: 1 }, 30, { goma: 0.25 }),
        manoD: MD([-0.36, -0.95 + 0.25 * lev, 0.12], [-1, 0.2, -0.6], { puno: 1 }, 30, { goma: 0.25 }),
      });
      const pp = lado > 0 ? "pieI" : "pieD";
      p[pp] = pie([lado * 0.2, AT + 0.28 * lev, 0.04 * lev], lado * 12, { polo: [lado * 0.2, 0, 1], pitch: 10 * lev });
      return mezclar(POSES.parado, p, ent);
    },
  },
  cruzarse_de_brazos: { respira: 1, pose: (t, c) => conPeso(mezclar(POSES.parado, POSES.brazos_cruzados, cl(resorte(t, 1.9, 0.55), 0, 1.04)), t, 0.6, c.semilla) },
  asustarse: {
    respira: 0.2,
    pose: (t) => {
      const salto = cl((t - 0.05) / 0.35), h = salto > 0 && salto < 1 ? 4 * salto * (1 - salto) : 0;
      const at = sube(t, 0.4, 0.6);
      const p1 = pose({
        raiz: [0, 0.3 * h, -0.25 * sube(t, 0.05, 0.4)], aplaste: 1 + 0.05 * h, torso: { x: -12 * h + 6 * at },
        manoI: MD([0.55, 0.4, 0.2], [1, -0.6, 0], { abierta: 1 }, 60), manoD: MD([-0.55, 0.4, 0.2], [-1, -0.6, 0], { abierta: 1 }, 60),
        pieI: pie([0.2, AT + 0.3 * h, -0.25 * sube(t, 0.05, 0.4)], 12, { polo: [0.2, 0, 1] }), pieD: pie([-0.2, AT + 0.3 * h, -0.25 * sube(t, 0.05, 0.4)], -12, { polo: [-0.2, 0, 1] }),
      });
      const tem = clon(POSES.temblando);
      tem.raiz = [0.012 * Math.sin(t * 55), -0.06 + 0.008 * Math.sin(t * 47), -0.25];
      tem.pieI.p[2] -= 0.25; tem.pieD.p[2] -= 0.25;
      tem.manoI.p[0] += 0.01 * Math.sin(t * 60); tem.manoD.p[0] += 0.01 * Math.sin(t * 57 + 1);
      tem.temblor = suave(t, 0.6, 0.8);
      return mezclar(p1, tem, at);
    },
  },
  caerse_y_levantarse: {
    respira: 0.3,
    pose: (t) => {
      // tropieza (0–0.3) → cae sentado (0.3–0.65, rebote) → queda (–1.6) → se levanta (1.6–2.6)
      const cae = suave(t, 0.25, 0.62), reb = t > 0.62 ? Math.exp(-(t - 0.62) * 8) * Math.sin((t - 0.62) * 22) : 0;
      const lev = suave(t, 1.6, 2.5);
      const suelo = pose({
        raiz: [0, -P.cadera.altura + 0.13 + 0.03 * reb, -0.1], torso: { x: -18, curva: 0.03 }, cabeza: { x: 8, z: 10 },
        manoI: MD([0.55, -0.85, -0.55], [1, 0.3, 0], { abierta: 1 }, 0, { goma: 0.25 }),
        manoD: MD([-0.55, -0.85, -0.55], [-1, 0.3, 0], { abierta: 1 }, 0, { goma: 0.25 }),
        pieI: pie([0.25, 0.09, 0.95], 20, { polo: [0.3, 1, 0.2], pitch: 30 }), pieD: pie([-0.22, 0.09, 1.0], -15, { polo: [-0.3, 1, 0.2], pitch: 35 }),
      });
      const tropiezo = pose({ torso: { x: -14 }, cabeza: { x: -12 }, manoI: MD([0.7, 0.2, 0.3], [1, -0.5, 0], { abierta: 1 }, 60), manoD: MD([-0.7, 0.3, 0.2], [-1, -0.5, 0], { abierta: 1 }, 60), pieI: pie([0.2, AT + 0.15, 0.3], 12, { polo: [0.2, 0, 1] }) });
      const agachado = pose({ raiz: [0, -0.5, 0], torso: { x: 30, curva: 0.05 }, manoI: MD([0.3, -0.85, 0.5], [1, 0, -0.5]), manoD: MD([-0.3, -0.85, 0.5], [-1, 0, -0.5]) });
      let p = mezclar(POSES.parado, tropiezo, suave(t, 0, 0.25));
      p = mezclar(p, suelo, cae);
      if (lev > 0) p = lev < 0.5 ? mezclar(suelo, agachado, lev * 2) : mezclar(agachado, POSES.parado, (lev - 0.5) * 2);
      return p;
    },
  },
  sentarse: {
    respira: 1,
    pose: (t, c) => {
      const e = suave(t, 0.1, 0.8);
      const p = pose({
        raiz: [0, -0.62, -0.3], torso: { x: 4 }, cabeza: { x: -3 },
        manoI: MD([0.36, -0.72, 0.42], [1, 0, -0.5], { miton: 1 }, 80, { goma: 0.25 }), manoD: MD([-0.36, -0.72, 0.42], [-1, 0, -0.5], { miton: 1 }, 80, { goma: 0.25 }),
        pieI: pie([0.2, AT, 0.28], 8, { polo: [0.1, 0.3, 1] }), pieD: pie([-0.2, AT, 0.28], -8, { polo: [-0.1, 0.3, 1] }),
      });
      const ant = pose({ torso: { x: 22 }, raiz: [0, -0.2, -0.05] });
      return conPeso(mezclar(mezclar(POSES.parado, ant, suave(t, 0, 0.35) * (1 - e)), p, e), t, 0.4, c.semilla);
    },
  },
  tipear: {
    respira: 0.8,
    pose: (t, c) => {
      const a = Math.max(0, Math.sin(t * 2 * PI * 4.2)), b = Math.max(0, Math.sin(t * 2 * PI * 3.7 + 1.3));
      const p = pose({
        torso: { x: 8 }, cabeza: { x: 14 + 2 * osc(t, 2.3) },
        manoI: MD([0.2, -0.82 + 0.035 * a, 0.62], [1, -0.4, -0.3], { miton: 1 }, 90, { goma: 0.3, dobla: 20 }),
        manoD: MD([-0.2, -0.82 + 0.035 * b, 0.62], [-1, -0.4, -0.3], { miton: 1 }, 90, { goma: 0.3, dobla: 20 }),
      });
      return conPeso(mezclar(POSES.parado, p, suave(t, 0, 0.35)), t, 0.4, c.semilla);
    },
  },
  cargar_caja: {
    respira: 0.6,
    pose: (t, c) => {
      const r = 0.02 * osc(t, 0.9);
      const p = pose({
        raiz: [0, -0.04, 0], torso: { x: -6, curva: -0.03 }, cabeza: { x: -2 },
        manoI: MD([0.3, -0.42 + r, 0.5], [1, -0.4, -0.5], { abierta: 1 }, 90, { goma: 0.3 }),
        manoD: MD([-0.3, -0.42 + r, 0.5], [-1, -0.4, -0.5], { abierta: 1 }, 90, { goma: 0.3 }),
      });
      return conPeso(mezclar(POSES.parado, p, suave(t, 0, 0.35)), t, 0.4, c.semilla);
    },
  },
  empujar: {
    respira: 0.3,
    pose: (t) => {
      const f = 0.5 + 0.5 * osc(t, 1.3);
      const p = pose({
        raiz: [0, -0.1 - 0.03 * f, 0.1], torso: { x: 28 + 4 * f, curva: 0.02 }, cabeza: { x: -18 },
        manoI: MD([0.24, 0.05, 1.12 + 0.05 * f], [1, -0.6, -0.3], { abierta: 1 }, 90, { goma: 0.25, dobla: -60 }),
        manoD: MD([-0.24, 0.05, 1.12 + 0.05 * f], [-1, -0.6, -0.3], { abierta: 1 }, 90, { goma: 0.25, dobla: -60 }),
        pieI: pie([0.18, AT, 0.5], 6, { polo: [0.1, 0, 1] }), pieD: pie([-0.18, AT, -0.6], -6, { polo: [-0.1, 0, 1], pitch: -18 }),
      });
      return mezclar(POSES.parado, p, suave(t, 0, 0.35));
    },
  },
  aplaudir: {
    respira: 0.7,
    pose: (t, c) => {
      const per = 0.38, ph = (t % per) / per, ab = 0.5 - 0.5 * Math.cos(2 * PI * ph);
      const p = pose({
        torso: { x: -2 }, cabeza: { x: -4, z: 2 * osc(t, 1.5) },
        manoI: MD([0.05 + 0.17 * ab, -0.4, 0.5], [1, -0.6, -0.3], { abierta: 1 }, 180, { goma: 0.3 }),
        manoD: MD([-0.05 - 0.17 * ab, -0.4, 0.5], [-1, -0.6, -0.3], { abierta: 1 }, 180, { goma: 0.3 }),
      });
      return conPeso(mezclar(POSES.parado, p, suave(t, 0, 0.25)), t, 0.5, c.semilla);
    },
  },
  bailar: {
    respira: 0.2,
    pose: (t) => {
      const b = osc(t, 0.9), r = Math.abs(osc(t, 0.9));
      const p = clon(POSES.ref);
      p.raiz = [0.05 * b, -0.035 - 0.04 * r, 0];
      p.torso.z = -1.5 + 5 * b; p.torso.y = 4 + 6 * b;
      p.cabeza.z = -17 + 10 * b;
      p.manoI.p = [0.75 + 0.08 * b, 1.13 - 0.06 * r, 0.12];
      p.manoD.p = [-0.76 + 0.05 * b, -1.03 + 0.12 * r, 0.06];
      p.pieD.p = [-0.36, AT + 0.04 * Math.max(0, -b), 0.04];
      return mezclar(POSES.parado, p, suave(t, 0, 0.3));
    },
  },
  dormir_de_pie: {
    respira: 2.2,
    pose: (t, c) => {
      const p = pose({ torso: { x: 6 + 2 * osc(t, 4), curva: 0.05, z: 3 * osc(t, 6) }, cabeza: { x: 26 + 5 * osc(t, 4, 0.2), z: 10 }, raiz: [0, -0.03, 0] });
      p.manoI.p = [0.3, -1.3, 0.12]; p.manoD.p = [-0.3, -1.3, 0.12];
      return conPeso(mezclar(POSES.parado, p, suave(t, 0, 0.9)), t, 0.3, c.semilla);
    },
  },
  llorar: {
    respira: 0.4,
    pose: (t) => {
      const sol = Math.max(0, osc(t, 0.9)) * 0.5 + 0.5 * Math.max(0, osc(t, 0.45));
      const p = pose({
        raiz: [0, 0.015 * sol - 0.02, 0], torso: { x: 10 + 3 * sol, curva: 0.04 }, cabeza: { x: 16 + 3 * sol },
        manoI: MD([0.12, 0.38 + 0.02 * sol, 0.5], [1, -0.7, -0.1], { puno: 1 }, 140, { goma: 0.3 }),
        manoD: MD([-0.12, 0.38 + 0.02 * sol, 0.5], [-1, -0.7, -0.1], { puno: 1 }, 140, { goma: 0.3 }),
      });
      return mezclar(POSES.parado, p, suave(t, 0, 0.4));
    },
  },
  mirar_reloj: {
    respira: 0.8,
    pose: (t, c) => {
      const e = sube(t, 0.05, 0.4), mira = suave(t, 0.3, 0.5) * (1 - suave(t, 1.5, 1.8));
      const p = pose({
        cabeza: { x: 24 * mira, y: 12 * mira, z: -4 },
        manoD: MD([0.02, -0.38, 0.5], [-1, -0.7, -0.2], { puno: 1 }, 90, { goma: 0.28 }),
      });
      return conPeso(mezclar(POSES.parado, p, e), t, 0.5, c.semilla);
    },
  },
  // poses de la hoja de expresiones como acciones sostenidas (con respiración y peso)
  ...Object.fromEntries((Object.keys(POSES) as NombrePose[]).map((k) => [`pose_${k}`, {
    respira: 1, pose: (t: number, c: Ctx) => {
      const p = clon(POSES[k]);
      if (p.temblor > 0) { p.manoI.p[0] += 0.012 * Math.sin(t * 58); p.manoD.p[0] += 0.012 * Math.sin(t * 61 + 1); p.raiz[0] += 0.006 * Math.sin(t * 50); }
      return conPeso(mezclar(POSES.parado, p, cl(resorte(t, 2, 0.55), 0, 1.04)), t, 0.4, c.semilla);
    },
  } as Accion])),
};
export type NombreAccion = keyof typeof ACCIONES;

// ---------- GUION ----------
export type PasoGuion = {
  t: number; // segundo del video en que arranca
  accion: string;
  expr?: NombreExpresion;
  objetivo?: [number, number]; // señalar: dirección (x −1…1 izq-der, y −1…1 abajo-arriba)
  rotY?: number; // hacia dónde mira el cuerpo durante este paso (grados)
  mezcla?: number; // cuadros de mezcla desde el paso anterior (def. 10)
  mirada?: "camara" | [number, number];
};

const B_DEF = 10;
const pesoMezcla = (f: number, nB: number) => { const x = cl(f / nB); return x * x * (3 - 2 * x); };

const indice = (g: PasoGuion[], t: number) => { let i = 0; for (let k = 0; k < g.length; k++) if (g[k].t <= t + 1e-9) i = k; return i; };

const poseDePaso = (g: PasoGuion[], i: number, t: number, fps: number, semilla: number): Pose => {
  const p = g[i], a = ACCIONES[p.accion] ?? ACCIONES.idle;
  const tl = Math.max(0, t - p.t);
  const base = a.pose(tl, { objetivo: p.objetivo, semilla, dur: (g[i + 1]?.t ?? 1e9) - p.t });
  const nB = (p.mezcla ?? B_DEF) / fps;
  if (i > 0 && tl < nB) return mezclar(poseDePaso(g, i - 1, t, fps, semilla), base, pesoMezcla(tl, nB));
  return base;
};

const respDe = (g: PasoGuion[], t: number, fps: number) => {
  const i = indice(g, t), a = ACCIONES[g[i].accion] ?? ACCIONES.idle;
  const r = a.respira ?? 0.5;
  if (i === 0) return r;
  const nB = (g[i].mezcla ?? B_DEF) / fps, ra = (ACCIONES[g[i - 1].accion] ?? ACCIONES.idle).respira ?? 0.5;
  return lerp(ra, r, pesoMezcla(t - g[i].t, nB));
};

const rotDe = (g: PasoGuion[], t: number, fps: number) => {
  const i = indice(g, t);
  const ry = (k: number) => { for (let j = k; j >= 0; j--) if (g[j].rotY !== undefined) return g[j].rotY!; return 0; };
  if (i === 0) return ry(0);
  const nB = Math.max(g[i].mezcla ?? B_DEF, 12) / fps;
  return lerp(ry(i - 1), ry(i), pesoMezcla(t - g[i].t, nB));
};
const velDe = (g: PasoGuion[], t: number, fps: number) => {
  const i = indice(g, t);
  const v = (k: number) => { const a = ACCIONES[g[k].accion]; return a?.velocidad ? a.velocidad(Math.max(0, t - g[k].t)) : 0; };
  if (i === 0) return v(0);
  const nB = (g[i].mezcla ?? B_DEF) / fps;
  return lerp(v(i - 1), v(i), pesoMezcla(t - g[i].t, nB));
};

const exprDePaso = (g: PasoGuion[], i: number): Expresion => { for (let j = i; j >= 0; j--) if (g[j].expr) return EXPRESIONES[g[j].expr!]; return EXPRESIONES.neutral; };

const mezOjo = (o: ParamOjo, f: (o: ParamOjo) => Partial<ParamOjo>): ParamOjo => ({ ...o, ...f(o) });

export type Evaluado = { pose: Pose; expr: Expresion; dx: number; dz: number; rotY: number };

export const evaluarGuion = (o: {
  guion: PasoGuion[]; frame: number; fps: number; semilla: number;
  poseFija?: Pose; exprFija?: Expresion; mirada?: "camara" | [number, number]; boca?: number[];
}): Evaluado => {
  const { guion: g, frame, fps, semilla } = o;
  const t = frame / fps;
  // pose con follow-through: torso/raíz/pies a t, cabeza 2 cuadros tarde, manos 3 cuadros tarde
  let pose: Pose;
  if (o.poseFija) pose = o.poseFija;
  else {
    const p0 = poseDePaso(g, indice(g, t), t, fps, semilla);
    const tc = Math.max(0, t - 2 / fps), tm = Math.max(0, t - 3 / fps);
    const pc = poseDePaso(g, indice(g, tc), tc, fps, semilla), pm = poseDePaso(g, indice(g, tm), tm, fps, semilla);
    pose = { ...p0, cabeza: pc.cabeza, manoI: { ...p0.manoI, p: pm.manoI.p, giro: pm.manoI.giro }, manoD: { ...p0.manoD, p: pm.manoD.p, giro: pm.manoD.giro } };
    // respiración: el torso sube/baja ~1,2 %, ciclo 3,5 s; los hombros acompañan
    const r = respDe(g, t, fps), resp = Math.sin((2 * PI * t) / 3.5 + semilla);
    pose = clon(pose);
    pose.aplaste *= 1 + 0.012 * r * resp;
    pose.cabeza.x -= 0.8 * r * resp;
    pose.manoI.p[1] += 0.01 * r * resp; pose.manoD.p[1] += 0.01 * r * resp;
  }
  // expresión con resorte entre pasos + anticipación
  let expr: Expresion;
  if (o.exprFija) expr = o.exprFija;
  else {
    const i = indice(g, t);
    const eN = exprDePaso(g, i);
    if (i > 0) {
      const eA = exprDePaso(g, i - 1), tl = (t - g[i].t) * fps;
      const w = cl(resorte(tl / fps, 2.6, 0.62), 0, 1.06);
      expr = mezclar(eA, eN, w);
      if (eN.anticipa > 0 && eA !== eN) {
        const bump = Math.sin(PI * cl(tl / 5)) * eN.anticipa;
        expr = { ...expr, I: mezOjo(expr.I, (q) => ({ abierto: q.abierto * (1 - 0.75 * bump) })), D: mezOjo(expr.D, (q) => ({ abierto: q.abierto * (1 - 0.75 * bump) })) };
      }
    } else expr = eN;
    const pm = g[i].mirada;
    if (pm && pm !== "camara") expr = { ...expr, miradaX: pm[0], miradaY: pm[1] };
  }
  if (o.mirada && o.mirada !== "camara") expr = { ...expr, miradaX: o.mirada[0], miradaY: o.mirada[1] };
  // parpadeo automático (con semilla), 5 cuadros, nunca en carcajada ni con los ojos ya cerrados
  if (expr.bocaAbierta < 0.8 || expr.lengua < 0.5) {
    const lista = parpadeos(semilla, t + 6);
    for (const tb of lista) {
      const df = (t - tb) * fps;
      if (df >= 0 && df < 5) {
        const k = Math.sin(PI * (df + 0.5) / 5);
        const cerr = (q: ParamOjo): ParamOjo => q.abierto < 0.1 ? q : { ...q, abierto: q.abierto * (1 - k), curva: lerp(q.curva, 0.35, k), parpado: q.parpado * (1 - k) };
        expr = { ...expr, I: cerr(expr.I), D: cerr(expr.D) };
      }
    }
  }
  // lip-sync
  if (o.boca && o.boca.length) {
    const a = cl(o.boca[Math.min(o.boca.length - 1, Math.max(0, frame))] ?? 0);
    if (a > expr.bocaAbierta) expr = { ...expr, bocaAbierta: lerp(expr.bocaAbierta, a * 0.75, 1), bocaArriba: lerp(expr.bocaArriba, 0.38, a), lengua: Math.max(expr.lengua, 0.4 * a) };
  }
  // desplazamiento integrado (caminar/correr mueven el cuerpo): suma por cuadro, pura
  let dx = 0, dz = 0;
  if (!o.poseFija) for (let f = 0; f < frame; f++) {
    const tf = f / fps, v = velDe(g, tf, fps);
    if (v) { const ry = (rotDe(g, tf, fps) * PI) / 180; dx += (Math.sin(ry) * v) / fps; dz += (Math.cos(ry) * v) / fps; }
  }
  return { pose, expr, dx, dz, rotY: o.poseFija ? 0 : rotDe(g, t, fps) };
};
