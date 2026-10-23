// duane02 · EL MUNDO: el taller de chapa de Duane en corte, en enero, con LA ESTUFA DE DOS DISCOS DE FRENO en el rincón.
// La estufa se arma en el aire pieza por pieza (soporte, disco de abajo, disco de arriba que se da vuelta, bulones, puerta
// con la corredera de aire, tapa con collar, caño). El fuego se ve por las ranuras de los discos y el aire caliente sale por
// ellas como una corriente visible. Tiraje (aire frío que entra por la corredera, gas caliente que sube por el caño en rayos X),
// distancias de seguridad en el piso, el humo/monóxido que se acumula bajo el techo con las alarmas, y afuera el caño con la
// regla 3-2-10. Encima, la VISIÓN TÉRMICA (paleta iron) del aire y del piso. Una escena, UNA cámara por tramo (keyframes).
// Render SÓLO en el farm (acá sólo stills).
import React, { createContext, useContext, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "../kits/yanqui3d/fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
type V3 = [number, number, number];

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
export const camAt = (t: number, KF: Key[]) => {
  let i = 0; while (i < KF.length - 1 && KF[i + 1].t <= t) i++;
  const a = KF[i], b = KF[Math.min(i + 1, KF.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  return { p, l, fov: (a.fov ?? 38) + ((b.fov ?? 38) - (a.fov ?? 38)) * k };
};
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.02, 400); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3, KF: Key[]) => project(camAt(t, KF), v3(q));
export const camSpeed = (t: number, KF: Key[]) => {
  const a = camAt(t, KF), b = camAt(t + 1 / FPS, KF);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number; KF: Key[] }> = ({ t, KF }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera; const k = camAt(t, KF);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.02; c.far = 400; c.updateProjectionMatrix(); return null;
};

// ---------------- ESTADO ----------------
export type FX = {
  day: number;      // 0 noche/amanecer azul · 1 día gris de enero
  heat: number;     // 0..1 visión térmica
  fire: number;     // 0..1 fuego adentro (se ve por las ranuras)
  flow: number;     // 0..1 aire caliente saliendo por las ranuras y subiendo
  draft: number;    // 0..1 tiraje: aire frío entra por la corredera, gas caliente sube por el caño
  xray: number;     // 0..1 caño y estufa en rayos X (se ve el gas adentro)
  build: number;    // 0..7 armado: 0 nada · 1 soporte · 2 disco abajo · 3 disco arriba · 4 bulones · 5 puerta · 6 tapa+collar · 7 caño
  explode: number;  // 0..1 piezas separadas en el aire (vista despiezada)
  cut: number;      // 0..1 el disco de arriba en corte: se ven las aletas
  smoke: number;    // 0..1 humo/monóxido que se acumula bajo el techo (tiraje muerto / fuego ahogado)
  alarm: number;    // 0..1 alarmas de CO destellando
  clear: number;    // 0..1 anillos de distancia en el piso (36") y alrededor del caño (18")
  hearth: number;   // 0..1 los ladrillos del frente se marcan
  fumes: number;    // 0..1 latas de nafta / thinner / aserrín resaltadas (lejos)
  rule: number;     // 0..1 afuera: regla 3-2-10 (3 ft sobre el techo, 2 ft más alto que todo a 10 ft)
  frost: number;    // 0..1 escarcha en la ventana y en la morsa
  storm: number;    // 0..1 tormenta de nieve
  shopTemp: number; // °F del aire del taller
  stoveT: number;   // °F de la chapa de arriba (termómetro magnético)
  slide: number;    // 0..1 corredera de aire abierta
  smolder: number;  // 0..1 fuego ahogado (brasas rojas sin llama, humo amarillo)
};
export const FX0: FX = { day: 0.2, heat: 0, fire: 0, flow: 0, draft: 0, xray: 0, build: 7, explode: 0, cut: 0, smoke: 0, alarm: 0, clear: 0, hearth: 0, fumes: 0, rule: 0, frost: 0, storm: 0, shopTemp: 26, stoveT: 26, slide: 0.6, smolder: 0 };

// paleta térmica "iron"
const IRON = ["#05062b", "#1c0b6e", "#5a0f9e", "#a8177e", "#e23a2a", "#ff8a1d", "#ffd23a", "#fff6c8"].map((c) => new THREE.Color(c));
export const ironCol = (u: number) => { const x = cl(u) * (IRON.length - 1), i = Math.min(IRON.length - 2, Math.floor(x)); return IRON[i].clone().lerp(IRON[i + 1], x - i); };
export const ironCss = (u: number) => "#" + ironCol(u).getHexString();
export const tU = (f: number) => cl((f + 5) / 80); // −5 °F → 0 · 75 °F → 1

// ---------------- geometría ----------------
const SX0 = -1, SX1 = 7, SZ0 = -3, SZ1 = 3, SH = 3.4;
export const ST: V3 = [0.9, 0, -1.9];             // centro de la estufa en el piso (rincón suroeste)
const RR = 0.17, FACE = 0.022, VG = 0.026;         // radio del disco (13"), espesor de cara, alto de las aletas
const ROT_H = FACE * 2 + VG;                        // alto de un disco ventilado
const HAT_R = 0.095, HAT_H = 0.06;
const LEG = 0.15, PLATE = 0.012;
const Y_PLATE = LEG + PLATE;                        // apoyo del disco de abajo (con el sombrero hacia abajo, metido en la placa)
const Y_BOT = Y_PLATE + HAT_H;                      // base del disco de abajo
const Y_TOP = Y_BOT + ROT_H;                        // base del disco de arriba (cara contra cara)
const Y_CAP = Y_TOP + ROT_H + HAT_H;                // arriba del sombrero de arriba
const PIPE_R = 0.051;                               // caño de 4"
const ELBOW_Y = Y_CAP + 1.25;                       // codo
const WALL_Z = SZ0;                                 // el caño sale por la pared sur
const OUT_TOP = SH + 0.9 + 0.95;                    // tope del caño afuera: 3 ft sobre el alero
export const PT = {
  stove: [ST[0], Y_TOP, ST[2]] as V3,
  slots: [ST[0] + RR, Y_TOP, ST[2] + 0.02] as V3,
  door: [ST[0] + 0.02, Y_BOT + 0.03, ST[2] + RR] as V3,
  slide: [ST[0] + 0.02, Y_BOT - 0.03, ST[2] + RR + 0.01] as V3,
  cap: [ST[0], Y_CAP + 0.04, ST[2]] as V3,
  pipe: [ST[0], ELBOW_Y - 0.5, ST[2]] as V3,
  elbow: [ST[0], ELBOW_Y, ST[2]] as V3,
  thimble: [ST[0], ELBOW_Y + 0.08, WALL_Z] as V3,
  outTop: [ST[0], OUT_TOP, WALL_Z - 0.35] as V3,
  eave: [ST[0], SH + 0.9, WALL_Z - 0.35] as V3,
  dial: [2.4, 1.6, -1.2] as V3,
  co1: [2.2, 1.75, SZ0 + 0.08] as V3,
  co2: [SX1 - 0.08, 1.75, 1.6] as V3,
  cans: [SX1 - 0.6, 0.35, SZ1 - 0.5] as V3,
  bench: [5.4, 1.0, -1.6] as V3,
  bigdoor: [3.0, 1.2, SZ1] as V3,
  shop: [3, 1.5, 0] as V3,
  hearth: [ST[0] + 0.0, 0.05, ST[2] + 0.45] as V3,
};

type Tx = THREE.Texture | undefined;
type TC = { th: number; fx: FX };
const ThermCtx = createContext<TC>({ th: 0, fx: FX0 });
const tempAt = (x: number, y: number, z: number, fx: FX) => {
  if (z < SZ0 - 0.1 || z > SZ1 + 0.1 || x < SX0 - 0.1 || x > SX1 + 0.1) return fx.storm > 0.5 ? -5 : 14;
  const dx = x - ST[0], dz = z - ST[2], dy = y - (Y_TOP + 0.1);
  let f = fx.shopTemp - (1 - y / SH) * 4 + (y / SH) * fx.fire * 6;
  f += fx.fire * 70 / (1 + 7 * (dx * dx + dz * dz + dy * dy * 0.6));
  if (Math.abs(dx) < 0.25 && Math.abs(dz) < 0.25 && y > Y_CAP) f += fx.fire * 40 * Math.exp(-(dx * dx + dz * dz) * 120);
  if (z > SZ1 - 0.6 && x > 1.4 && x < 4.6) f -= 8 * (1 - (SZ1 - z) / 0.6); // el portón grande pierde
  return f;
};
const useTherm = (base: string, p: number[], tw?: number) => {
  const T = useContext(ThermCtx);
  if (!T.th) return { c: base, e: undefined as string | undefined, k: 0 };
  const ic = ironCol(tU(tw ?? tempAt(p[0], p[1], p[2], T.fx)));
  return { c: "#" + new THREE.Color(base).lerp(ic, T.th).getHexString(), e: "#" + ic.getHexString(), k: T.th };
};

const mkTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useShopTex = () => useMemo(() => ({
  tin: mkTex(256, 256, (g) => {
    for (let x = 0; x < 256; x++) { const s = Math.sin((x / 256) * Math.PI * 2 * 8); const v = 150 + s * 38; g.fillStyle = `rgb(${v + 6},${v + 4},${v - 2})`; g.fillRect(x, 0, 1, 256); }
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(120,70,30,${0.05 + rnd(i, 2) * 0.12})`; g.beginPath(); g.ellipse(rnd(i, 3) * 256, rnd(i, 4) * 256, 1 + rnd(i, 5) * 3, 3 + rnd(i, 6) * 14, 0, 0, 6.3); g.fill(); }
  }, [4, 1.4]),
  iron: mkTex(256, 256, (g) => { // fundición gris con rayas de frenado y óxido en el borde
    g.fillStyle = "#6b6b6a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(${150 + rnd(i, 1) * 60},${150 + rnd(i, 1) * 60},${150 + rnd(i, 1) * 60},${0.08 + rnd(i, 2) * 0.12})`; g.lineWidth = 0.6 + rnd(i, 3) * 1.4; g.beginPath(); g.arc(128, 128, 40 + rnd(i, 4) * 88, 0, 6.3); g.stroke(); }
    for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(${120 + rnd(i, 5) * 60},${55 + rnd(i, 6) * 30},${25},${0.05 + rnd(i, 7) * 0.18})`; g.beginPath(); g.arc(rnd(i, 8) * 256, rnd(i, 9) * 256, 0.5 + rnd(i, 10) * 3, 0, 6.3); g.fill(); }
  }, [1, 1]),
  frost: mkTex(256, 256, (g) => {
    g.fillStyle = "rgba(220,240,255,0.15)"; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "rgba(240,250,255,.85)"; g.lineCap = "round";
    for (let i = 0; i < 260; i++) {
      let x = rnd(i, 1) * 256, y = rnd(i, 2) * 256, a = rnd(i, 3) * 6.3;
      for (let k = 0; k < 9; k++) { const L = 2 + rnd(i * 9 + k, 4) * 6; const nx = x + Math.cos(a) * L, ny = y + Math.sin(a) * L; g.lineWidth = 0.9 - k * 0.07; g.beginPath(); g.moveTo(x, y); g.lineTo(nx, ny); g.stroke(); x = nx; y = ny; a += (rnd(i * 9 + k, 6) - 0.5) * 0.8; }
    }
  }, [3, 2]),
  brick: mkTex(256, 128, (g) => {
    g.fillStyle = "#d8d2c6"; g.fillRect(0, 0, 256, 128);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) { const v = rnd(r * 5 + c, 1); g.fillStyle = `rgb(${150 + v * 40},${62 + v * 20},${44 + v * 12})`; g.fillRect(c * 56 + (r % 2) * 28 - 20, r * 32 + 2, 52, 28); }
  }, [1, 1]),
}), []);

const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; o?: number; tw?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, o = 1, tw }) => {
  const T = useTherm(c, p, tw);
  return (
    <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
      <meshStandardMaterial color={T.c} roughness={r} metalness={m * (1 - T.k)} emissive={T.e ?? e ?? "#000"} emissiveIntensity={T.e ? T.k * 0.6 : ei} map={T.k > 0.5 ? undefined : map} transparent={o < 1} opacity={o} depthWrite={o > 0.6} />
    </mesh>
  );
};
const TinWall: React.FC<{ p: V3; s: V3; tin?: Tx; inner?: string }> = ({ p, s, tin, inner = "#b9b2a4" }) => {
  const T0 = useContext(ThermCtx), tw = T0.th ? tempAt(p[0], p[1], p[2], T0.fx) - 14 : 0;
  const Ti = useTherm(inner, p, tw), Tc = useTherm("#e9c9a0", p, tw);
  const thin = s[2] < s[0] ? 2 : 0;
  const core = s.map((v, i) => (i === thin ? v - 0.006 : v - 0.002)) as V3;
  return (
    <group position={p}>
      <mesh castShadow receiveShadow><boxGeometry args={core} /><meshStandardMaterial color={Tc.c} roughness={1} emissive={Tc.e ?? "#000"} emissiveIntensity={Tc.k * 0.85} /></mesh>
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={thin === 2 ? [0, 0, (sd * s[2]) / 2] : [(sd * s[0]) / 2, 0, 0]} rotation={thin === 2 ? [0, sd < 0 ? Math.PI : 0, 0] : [0, (sd * Math.PI) / 2, 0]} receiveShadow>
          <planeGeometry args={[thin === 2 ? s[0] : s[2], s[1]]} /><meshStandardMaterial color={sd > 0 ? "#cfcac0" : Ti.c} map={Ti.k > 0.5 ? undefined : tin} roughness={0.55} metalness={0.45 * (1 - Ti.k)} emissive={Ti.e ?? "#000"} emissiveIntensity={Ti.k * 0.6} />
        </mesh>
      ))}
    </group>
  );
};

// ---------------- LA ESTUFA ----------------
// disco ventilado: dos caras de fundición + 36 aletas radiales entre medio; las ranuras brillan con el fuego.
// half = el corte (0..1): esconde la cara de arriba en la mitad de adelante para ver las aletas.
const Rotor: React.FC<{ y: number; flip: boolean; glow: number; tex: Tx; cut?: number; th: number; f: number }> = ({ y, flip, glow, tex, cut = 0, th, f }) => {
  const ic = ironCol(tU(f)), base = new THREE.Color("#a3a29d").lerp(ic, th);
  const mat = <meshStandardMaterial color={base} map={th > 0.5 ? undefined : tex} roughness={0.55} metalness={0.3 * (1 - th)} emissive={th ? ic : new THREE.Color("#ff5a14")} emissiveIntensity={th ? th * 0.7 : glow * 0.08} />;
  const fin = <meshStandardMaterial color={base} roughness={0.7} metalness={0.4} emissive={new THREE.Color("#ff7a1e")} emissiveIntensity={glow * 1.6 + th * 0.4} />;
  const hatY = flip ? ROT_H + HAT_H / 2 : -HAT_H / 2;
  return (
    <group position={[0, y, 0]}>
      {/* cara de abajo y de arriba (anillos) */}
      {[FACE / 2, FACE * 1.5 + VG].map((yy, i) => (
        <mesh key={i} position={[0, yy, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[RR, RR, FACE, 64, 1, false, 0, i === 1 && cut > 0.01 ? Math.PI * 2 - Math.PI * cut : Math.PI * 2]} />{mat}
        </mesh>
      ))}
      {/* aletas: 36 radiales en el hueco del medio; el hueco brilla naranja cuando hay fuego */}
      {Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2; return (
        <mesh key={i} position={[Math.cos(a) * (RR * 0.72), FACE + VG / 2, Math.sin(a) * (RR * 0.72)]} rotation={[0, -a, 0]} castShadow>
          <boxGeometry args={[RR * 0.52, VG, 0.012]} />{fin}
        </mesh>); })}
      {/* luz del fuego dentro de las ranuras */}
      {glow > 0.01 && <mesh position={[0, FACE + VG / 2, 0]}><cylinderGeometry args={[RR * 0.985, RR * 0.985, VG * 0.9, 64, 1, true]} /><meshBasicMaterial color="#ff8a2a" transparent opacity={glow * 0.85} toneMapped={false} side={THREE.BackSide} /></mesh>}
      {/* sombrero (el cubo del disco) */}
      <mesh position={[0, hatY, 0]} castShadow receiveShadow><cylinderGeometry args={[HAT_R, HAT_R + 0.004, HAT_H, 48]} />{mat}</mesh>
      {/* agujeros de las ruedas: 8 puntos oscuros sobre el sombrero */}
      {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * HAT_R * 0.68, flip ? ROT_H + HAT_H + 0.001 : -HAT_H - 0.001, Math.sin(a) * HAT_R * 0.68]} rotation={[flip ? -Math.PI / 2 : Math.PI / 2, 0, 0]}><circleGeometry args={[0.009, 14]} /><meshBasicMaterial color="#141414" /></mesh>; })}
    </group>
  );
};

const Stove: React.FC<{ fx: FX; t: number; tex: Tx; brick: Tx }> = ({ fx, t, tex, brick }) => {
  const T = useContext(ThermCtx), th = T.th;
  const b = fx.build, ex = fx.explode;
  const show = (k: number) => cl(b - (k - 1)); // 0..1 cuánto llegó la pieza k
  // cada pieza baja desde arriba al llegar; en la vista despiezada flota separada
  const drop = (k: number) => (1 - ease(show(k))) * 0.9;
  const glow = fx.fire * (0.75 + 0.25 * Math.sin(t * 9) * Math.sin(t * 5.3)) * (1 - fx.smolder * 0.75);
  const sT = fx.shopTemp + fx.fire * 120;
  const flip3 = show(3) < 1 ? (1 - ease(show(3))) * Math.PI : 0; // el disco de arriba llega dándose vuelta
  const pipeO = 1 - fx.xray * 0.75;
  return (
    <group position={ST}>
      {/* pad de ladrillos (hasta 18" al frente de la puerta) */}
      <group position={[0, 0.03, 0.2]}>
        <Box p={[0, 0, 0]} s={[0.75, 0.06, 0.95]} c="#a9553d" map={brick} r={0.95} rad={0.006} tw={fx.shopTemp + fx.fire * 20} />
        {fx.hearth > 0.01 && <mesh position={[0, 0.032, 0.32]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.75, 0.46]} /><meshBasicMaterial color="#ffb257" transparent opacity={fx.hearth * 0.45} toneMapped={false} depthWrite={false} /></mesh>}
      </group>
      {/* 1 · soporte: placa de 1/4" + 3 patas */}
      {show(1) > 0 && <group position={[0, drop(1) + ex * -0.05, 0]}>
        <mesh position={[0, LEG + PLATE / 2 + 0.06, 0]} castShadow receiveShadow><cylinderGeometry args={[RR + 0.03, RR + 0.03, PLATE, 6]} /><meshStandardMaterial color="#3b3d40" metalness={0.6} roughness={0.45} /></mesh>
        {[0, 1, 2].map((i) => { const a = (i / 3) * Math.PI * 2 + 0.5; return <mesh key={i} position={[Math.cos(a) * RR * 0.85, LEG / 2 + 0.06, Math.sin(a) * RR * 0.85]} castShadow><boxGeometry args={[0.025, LEG, 0.025]} /><meshStandardMaterial color="#2f3134" metalness={0.6} roughness={0.5} /></mesh>; })}
      </group>}
      {/* 2 · disco de abajo, sombrero hacia abajo */}
      {show(2) > 0 && <group position={[0, 0.06 + drop(2) + ex * 0.12, 0]}><Rotor y={Y_BOT} flip={false} glow={glow} tex={tex} th={th} f={sT} /></group>}
      {/* 3 · disco de arriba, cara contra cara, sombrero arriba (llega dándose vuelta) */}
      {show(3) > 0 && <group position={[0, 0.06 + Y_TOP + drop(3) + ex * 0.2, 0]} rotation={[flip3, 0, 0]}><group position={[0, -Y_TOP, 0]}><Rotor y={Y_TOP} flip glow={glow} tex={tex} cut={fx.cut} th={th} f={sT} /></group></group>}
      {/* 4 · tres bulones grado 8 por los agujeros de las ruedas */}
      {show(4) > 0 && [0, 1, 2].map((i) => { const a = (i / 3) * Math.PI * 2 + 0.2; return (
        <group key={i} position={[Math.cos(a) * HAT_R * 0.68, 0.06 + Y_BOT + ROT_H + (1 - ease(show(4))) * 0.5 + ex * 0.36, Math.sin(a) * HAT_R * 0.68]}>
          <mesh castShadow><cylinderGeometry args={[0.006, 0.006, ROT_H * 2 + HAT_H * 2 + 0.03, 10]} /><meshStandardMaterial color="#c9b25a" metalness={0.9} roughness={0.3} /></mesh>
          <mesh position={[0, ROT_H + HAT_H + 0.02, 0]}><cylinderGeometry args={[0.012, 0.012, 0.01, 6]} /><meshStandardMaterial color="#c9b25a" metalness={0.9} roughness={0.3} /></mesh>
        </group>); })}
      {/* 5 · puerta de chapa con pasador + corredera de aire debajo (al frente, +z) */}
      {show(5) > 0 && <group position={[0, 0.06 + Y_BOT + (1 - ease(show(5))) * 0.4 + ex * 0.2, RR + 0.006 + ex * 0.15]}>
        <Box p={[0, ROT_H * 0.5, 0]} s={[0.1, 0.075, 0.008]} c="#3a3c3f" m={0.6} r={0.45} rad={0.004} tw={sT - 20} />
        <mesh position={[-0.055, ROT_H * 0.5, 0.004]}><cylinderGeometry args={[0.004, 0.004, 0.09, 8]} /><meshStandardMaterial color="#888" metalness={0.9} /></mesh>
        <Box p={[0.03, ROT_H * 0.5, 0.008]} s={[0.025, 0.012, 0.012]} c="#202020" m={0.5} rad={0.003} />
        {/* corredera: chapita que tapa una fila de agujeros */}
        <group position={[0, -0.025, 0.002]}>
          {[-0.03, -0.01, 0.01, 0.03].map((x) => <mesh key={x} position={[x, 0, 0.001]}><circleGeometry args={[0.0065, 12]} /><meshBasicMaterial color={glow > 0.05 ? "#ff7a22" : "#111"} toneMapped={false} /></mesh>)}
          <Box p={[0.045 - fx.slide * 0.07, 0, 0.006]} s={[0.07, 0.022, 0.004]} c="#55585c" m={0.7} r={0.35} rad={0.002} />
        </group>
      </group>}
      {/* 6 · tapa con collar de 4" atornillada */}
      {show(6) > 0 && <group position={[0, 0.06 + Y_CAP + (1 - ease(show(6))) * 0.5 + ex * 0.3, 0]}>
        <Box p={[0, 0.006, 0]} s={[0.22, 0.012, 0.22]} c="#3b3d40" m={0.6} r={0.45} rad={0.004} tw={sT - 10} />
        <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[PIPE_R, PIPE_R, 0.1, 32, 1, true]} /><meshStandardMaterial color="#2a2b2d" metalness={0.5} roughness={0.5} side={THREE.DoubleSide} /></mesh>
      </group>}
      {/* 7 · el caño: sube, codo, atraviesa la pared sur con su manga aislada, y sube por afuera */}
      {show(7) > 0 && <group position={[0, (1 - ease(show(7))) * 0.8 + ex * 0.45, 0]}>
        <mesh position={[0, (Y_CAP + 0.16 + ELBOW_Y) / 2, 0]} castShadow><cylinderGeometry args={[PIPE_R, PIPE_R, ELBOW_Y - Y_CAP - 0.16, 32, 1, true]} /><meshStandardMaterial color="#1d1e20" metalness={0.45} roughness={0.55} side={THREE.DoubleSide} transparent={pipeO < 1} opacity={pipeO} depthWrite={pipeO > 0.9} /></mesh>
        {/* juntas con 3 tornillos, el lado crimpado para abajo */}
        {[0.45, 0.9].map((y) => <mesh key={y} position={[0, Y_CAP + 0.16 + y, 0]}><torusGeometry args={[PIPE_R + 0.002, 0.003, 8, 32]} /><meshStandardMaterial color="#444" metalness={0.6} /></mesh>)}
        <mesh position={[0, ELBOW_Y, 0]}><sphereGeometry args={[PIPE_R * 1.05, 24, 16]} /><meshStandardMaterial color="#1d1e20" metalness={0.45} roughness={0.55} transparent={pipeO < 1} opacity={pipeO} /></mesh>
        {/* tramo corto hacia la pared, con pendiente 1/4" por pie */}
        {(() => { const L = -WALL_Z + ST[2] + 0.35; return <mesh position={[0, ELBOW_Y + 0.02, -L / 2]} rotation={[Math.PI / 2 + 0.02, 0, 0]} castShadow><cylinderGeometry args={[PIPE_R, PIPE_R, L, 32, 1, true]} /><meshStandardMaterial color="#1d1e20" metalness={0.45} roughness={0.55} side={THREE.DoubleSide} transparent={pipeO < 1} opacity={pipeO} /></mesh>; })()}
        {/* manga aislada en la pared */}
        <group position={[0, ELBOW_Y + 0.03, WALL_Z - ST[2]]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[PIPE_R + 0.04, PIPE_R + 0.04, 0.2, 32, 1, true]} /><meshStandardMaterial color="#c9ccd0" metalness={0.85} roughness={0.25} side={THREE.DoubleSide} /></mesh>
          <Box p={[0, 0, 0.1]} s={[0.26, 0.26, 0.006]} c="#c9ccd0" m={0.85} r={0.3} rad={0.002} />
        </group>
        {/* afuera: codo y caño que sube por la pared hasta 3 ft sobre el alero */}
        <mesh position={[0, (ELBOW_Y + OUT_TOP) / 2, WALL_Z - ST[2] - 0.35]} castShadow><cylinderGeometry args={[PIPE_R, PIPE_R, OUT_TOP - ELBOW_Y, 32]} /><meshStandardMaterial color="#c9ccd0" metalness={0.8} roughness={0.3} /></mesh>
        <mesh position={[0, OUT_TOP + 0.05, WALL_Z - ST[2] - 0.35]}><coneGeometry args={[PIPE_R * 2.2, 0.08, 24]} /><meshStandardMaterial color="#9ea2a7" metalness={0.8} roughness={0.3} /></mesh>
        {[0.6, 1.4, 2.2].map((y) => <Box key={y} p={[0, ELBOW_Y + y, WALL_Z - ST[2] - 0.2]} s={[0.04, 0.03, 0.3]} c="#888" m={0.7} rad={0.003} />)}
      </group>}
      {/* el fuego adentro: luz naranja + brasas; ahogado = rojo oscuro */}
      {fx.fire > 0.01 && <>
        <pointLight position={[0, 0.06 + Y_TOP, 0]} intensity={glow * 2.4} distance={3.2} color={fx.smolder > 0.5 ? "#c8381a" : "#ff8a3a"} castShadow={false} />
        <pointLight position={[0, 0.3, 0.6]} intensity={glow * 0.9} distance={1.6} color="#ff7a2a" />
      </>}
    </group>
  );
};

// partículas suaves (siempre redondas, nunca cuadradas)
const Pts: React.FC<{ pos: Float32Array; col: Float32Array; size: number; o: number; map?: Tx; add?: boolean }> = ({ pos, col, size, o, map, add = true }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  if (o < 0.01) return null;
  return <points geometry={geo}><pointsMaterial vertexColors size={size} map={map} alphaTest={0.01} sizeAttenuation transparent opacity={o} depthWrite={false} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} toneMapped={false} /></points>;
};
// aire caliente: sale radial por las ranuras, se curva para arriba y sube hasta el techo
const HotFlow: React.FC<{ t: number; o: number; map?: Tx }> = ({ t, o, map }) => {
  const N = 900, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const a = rnd(i, 1) * Math.PI * 2, ph = (rnd(i, 2) + t * (0.22 + rnd(i, 3) * 0.12)) % 1;
    const out = Math.min(1, ph * 3) * 0.35, up = Math.max(0, ph - 0.25) / 0.75;
    const r = RR + out + up * 0.25, y = 0.06 + Y_TOP + (rnd(i, 4) - 0.5) * 0.06 + up * up * (SH - 0.6) + Math.sin(t * 2 + i) * 0.02;
    const c = ironCol(0.92 - up * 0.45);
    pos.set([ST[0] + Math.cos(a) * r, y, ST[2] + Math.sin(a) * r], i * 3); col.set([c.r, c.g, c.b], i * 3);
  }
  return <Pts pos={pos} col={col} size={0.06} o={0.75 * o} map={map} />;
};
// tiraje: aire frío (azul) que entra por la corredera; gas caliente (naranja) que sube por adentro del caño y sale afuera
const Draft: React.FC<{ t: number; o: number; map?: Tx }> = ({ t, o, map }) => {
  const N = 700, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const cold = new THREE.Color("#7fc4ff");
  for (let i = 0; i < N; i++) {
    const ph = (rnd(i, 1) + t * (0.28 + rnd(i, 2) * 0.1)) % 1;
    let x = ST[0], y = 0, z = ST[2]; let c = cold;
    if (i < 220) { // entra por la corredera
      z = ST[2] + RR + 0.5 - ph * 0.5; x = ST[0] + (rnd(i, 3) - 0.5) * 0.12 * (1 - ph); y = 0.06 + Y_BOT - 0.03 + (rnd(i, 4) - 0.5) * 0.02;
    } else { // sube por el caño, cruza la pared y sube afuera
      const L1 = ELBOW_Y - Y_CAP, L2 = -WALL_Z + ST[2] + 0.35, L3 = OUT_TOP - ELBOW_Y, tot = L1 + L2 + L3, d = ph * tot;
      const j = (rnd(i, 5) - 0.5) * PIPE_R * 1.2, k = (rnd(i, 6) - 0.5) * PIPE_R * 1.2;
      if (d < L1) { x = ST[0] + j; z = ST[2] + k; y = 0.06 + Y_CAP + d; }
      else if (d < L1 + L2) { x = ST[0] + j; y = ELBOW_Y + 0.02 + k; z = ST[2] - (d - L1); }
      else { x = ST[0] + j; z = WALL_Z - 0.35 + k; y = ELBOW_Y + (d - L1 - L2); }
      c = ironCol(0.95 - ph * 0.4);
    }
    pos.set([x, y, z], i * 3); col.set([c.r, c.g, c.b], i * 3);
  }
  return <Pts pos={pos} col={col} size={0.045} o={0.9 * o} map={map} />;
};
// humo / monóxido: sale por la puerta y se apila bajo el techo, bajando de a poco
const Smoke: React.FC<{ t: number; o: number; map?: Tx }> = ({ t, o, map }) => {
  const N = 1400, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const fill = o; // cuánto bajó la capa
  for (let i = 0; i < N; i++) {
    const ph = (rnd(i, 1) + t * 0.05) % 1;
    const x = SX0 + 0.3 + rnd(i, 2) * (SX1 - SX0 - 0.6) + Math.sin(t * 0.3 + i) * 0.1;
    const z = SZ0 + 0.3 + rnd(i, 3) * (SZ1 - SZ0 - 0.6);
    const y = SH - 0.15 - rnd(i, 4) * fill * 2.4 - ph * 0.1;
    const g = 0.42 + rnd(i, 5) * 0.12;
    pos.set([x, y, z], i * 3); col.set([g, g * 0.98, g * 0.9], i * 3);
  }
  return <Pts pos={pos} col={col} size={0.5} o={0.32 * o} map={map} add={false} />;
};
// visión térmica del aire
const HeatCloud: React.FC<{ fx: FX; map?: Tx; t: number; cam: THREE.Vector3 }> = ({ fx, map, t, cam }) => {
  const N = 5000, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const x = SX0 + 0.3 + rnd(i, 1) * (SX1 - SX0 - 0.6), z = SZ0 + 0.25 + rnd(i, 2) * (SZ1 - SZ0 - 0.5);
    const y = 0.15 + rnd(i, 3) * (SH - 0.4) + Math.sin(t * 0.7 + i) * 0.04;
    const c = ironCol(tU(tempAt(x, y, z, fx)));
    const dc = Math.hypot(x - cam.x, y - cam.y, z - cam.z), fade = cl((dc - 0.6) / 1.4);
    pos.set([x, y, z], i * 3); col.set([c.r * fade, c.g * fade, c.b * fade], i * 3);
  }
  return <Pts pos={pos} col={col} size={0.2} o={0.24 * fx.heat} map={map} />;
};
const HeatFloor: React.FC<{ fx: FX }> = ({ fx }) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 128; cv.height = 96; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; return { cv, tex }; }, []);
  if (fx.heat < 0.01) return null;
  const g = cv.getContext("2d")!; const img = g.createImageData(128, 96);
  for (let j = 0; j < 96; j++) for (let i = 0; i < 128; i++) {
    const x = SX0 + ((i + 0.5) / 128) * (SX1 - SX0), z = SZ0 + ((j + 0.5) / 96) * (SZ1 - SZ0);
    const c = ironCol(tU(tempAt(x, 0.3, z, fx) - 3)), k = (j * 128 + i) * 4;
    img.data[k] = c.r * 255; img.data[k + 1] = c.g * 255; img.data[k + 2] = c.b * 255; img.data[k + 3] = 255;
  }
  g.putImageData(img, 0, 0); tex.needsUpdate = true;
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(SX0 + SX1) / 2, 0.152, 0]}><planeGeometry args={[SX1 - SX0 - 0.2, SZ1 - SZ0 - 0.1]} /><meshBasicMaterial map={tex} transparent opacity={0.8 * fx.heat} toneMapped={false} depthWrite={false} /></mesh>;
};
const Snow: React.FC<{ t: number; n?: number; map?: Tx; rate?: number }> = ({ t, n = 2200, map, rate = 1 }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []); const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const x = -16 + rnd(i, 1) * 34 + Math.sin(t * 0.6 + i) * 0.25 + (rate > 1.5 ? ((t * 1.4 + rnd(i, 7) * 20) % 20) - 10 : 0), Y = 14;
    const y = Y - ((rnd(i, 2) * Y + t * (0.6 + rnd(i, 3) * 0.5) * rate) % Y) - 1;
    let z = -14 + rnd(i, 4) * 30; if (z > SZ0 - 0.2 && z < SZ1 + 0.2 && x > SX0 - 0.2 && x < SX1 + 0.2 && y < SH + 1.4) z -= 6.5;
    p.set([x, y, z], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
  return <points geometry={geo}><pointsMaterial color="#f4f8ff" size={0.08} map={map} alphaTest={0.02} sizeAttenuation transparent opacity={0.85} depthWrite={false} /></points>;
};
const Pine: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.15, 0.2, 1, 8]} /><meshStandardMaterial color="#3b2b20" /></mesh>
    {[0, 1, 2].map((k) => (<group key={k}>
      <mesh position={[0, 1.6 + k * 1.1, 0]} castShadow><coneGeometry args={[1.5 - k * 0.38, 1.9, 9]} /><meshStandardMaterial color="#1f3a2c" roughness={0.95} flatShading /></mesh>
      <mesh position={[0, 1.75 + k * 1.1, 0]}><coneGeometry args={[1.38 - k * 0.38, 1.5, 9]} /><meshStandardMaterial color="#eef3f8" roughness={1} transparent opacity={0.55} flatShading /></mesh>
    </group>))}
  </group>
);
// dial del termómetro del poste (°F)
const useDial = (f: number) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 256; cv.height = 256; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; return { cv, tex }; }, []);
  const g = cv.getContext("2d")!;
  g.fillStyle = "#f3efe4"; g.beginPath(); g.arc(128, 128, 124, 0, 6.3); g.fill();
  g.strokeStyle = "#222"; g.lineWidth = 3; for (let v = -40; v <= 120; v += 10) { const a = (-225 + ((v + 40) / 160) * 270) * Math.PI / 180; g.beginPath(); g.moveTo(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100); g.lineTo(128 + Math.cos(a) * 116, 128 + Math.sin(a) * 116); g.stroke(); }
  g.fillStyle = "#222"; g.font = "bold 22px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
  [0, 40, 80].forEach((v) => { const a = (-225 + ((v + 40) / 160) * 270) * Math.PI / 180; g.fillText(String(v), 128 + Math.cos(a) * 80, 128 + Math.sin(a) * 80); });
  const a = (-225 + ((f + 40) / 160) * 270) * Math.PI / 180;
  g.strokeStyle = "#b11"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + Math.cos(a) * 96, 128 + Math.sin(a) * 96); g.stroke();
  g.fillStyle = "#111"; g.beginPath(); g.arc(128, 128, 10, 0, 6.3); g.fill();
  tex.needsUpdate = true; return tex;
};
// anillo plano en el piso / cilindro de distancia
const Ring: React.FC<{ p: V3; r: number; o: number; col: string }> = ({ p, r, o, col }) => o < 0.01 ? null : (
  <group position={p}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r - 0.015, r + 0.015, 96]} /><meshBasicMaterial color={col} transparent opacity={o} toneMapped={false} depthWrite={false} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[r, 96]} /><meshBasicMaterial color={col} transparent opacity={o * 0.12} toneMapped={false} depthWrite={false} /></mesh>
  </group>
);

// ---------------- LA ESCENA ----------------
export const StoveWorld: React.FC<{ t: number; KF: Key[]; fx: (t: number) => Partial<FX> }> = ({ t, KF, fx: fxf }) => {
  const fx: FX = { ...FX0, ...fxf(t) };
  const tx = useTextures(), st = useShopTex();
  const dial = useDial(fx.shopTemp);
  const th = fx.heat, dim = 1 - th * 0.55;
  const k = camAt(t, KF);
  const sky = new THREE.Color("#0c1526").lerp(new THREE.Color(fx.storm > 0.5 ? "#8e98a3" : "#a8bdd6"), fx.day);
  const fire = fx.fire;
  const alarmOn = fx.alarm > 0.01 && Math.sin(t * 10) > 0;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <ThermCtx.Provider value={{ th, fx }}>
      <Cam t={t} KF={KF} />
      <Post bloom={(0.35 + 0.55 * fire) * (1 - th * 0.7) + th * 0.12} threshold={0.78 + 0.5 * fx.day + th * 0.6} exposure={(0.9 + 0.2 * (1 - fx.day)) * dim + th * 0.25} env={(0.12 + 0.12 * fx.day) * dim} />
      <color attach="background" args={[sky.clone().multiplyScalar(dim).getHex()]} />
      <fogExp2 attach="fog" args={[sky.getHex(), 0.018 + 0.03 * fx.storm]} />
      <hemisphereLight args={[new THREE.Color("#7f98c4").lerp(new THREE.Color("#e6ecf2"), fx.day).getHex(), new THREE.Color("#1a1d24").lerp(new THREE.Color("#8a8f96"), fx.day).getHex(), (0.45 + fx.day * 0.6) * dim]} />
      <directionalLight position={[6, 9, -12]} intensity={(0.5 + fx.day * 1.6) * dim * (1 - fx.storm * 0.5)} color={new THREE.Color("#a9c3ff").lerp(new THREE.Color("#f2ecdf"), fx.day)} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={10} shadow-camera-bottom={-6} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <directionalLight position={[-8, 12, 14]} intensity={(0.3 + 0.35 * fx.day) * dim} color="#c9d6ea" />
      <pointLight position={[3.4, 3.0, 0.4]} intensity={(2.4 + 1.6 * fx.day) * dim} distance={9} color="#d9e2ee" />

      {/* terreno nevado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[160, 160]} /><meshStandardMaterial color={new THREE.Color("#e9eef4").lerp(ironCol(tU(14)), th).getHex()} roughness={1} /></mesh>
      {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[-16 + i * 2.4 + rnd(i, 2), 0.1, -6.5 - rnd(i, 3) * 2]} scale={[1.4, 0.3, 0.8]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color="#f2f5f9" roughness={1} /></mesh>)}

      {/* piso, paredes (la del frente +z no existe: es el corte), techo a dos aguas recortado */}
      <Box p={[(SX0 + SX1) / 2, 0.05, 0]} s={[SX1 - SX0, 0.2, SZ1 - SZ0]} c="#8e9093" map={tx.concrete} r={0.9} rad={0.01} />
      {(() => { const wx0 = 3.0, wx1 = 4.6, wy0 = 1.2, wy1 = 2.2; return (<>
        <TinWall p={[(SX0 + wx0) / 2, SH / 2, SZ0]} s={[wx0 - SX0, SH, 0.14]} tin={st.tin} />
        <TinWall p={[(wx1 + SX1) / 2, SH / 2, SZ0]} s={[SX1 - wx1, SH, 0.14]} tin={st.tin} />
        <TinWall p={[(wx0 + wx1) / 2, wy0 / 2, SZ0]} s={[wx1 - wx0, wy0, 0.14]} tin={st.tin} />
        <TinWall p={[(wx0 + wx1) / 2, (wy1 + SH) / 2, SZ0]} s={[wx1 - wx0, SH - wy1, 0.14]} tin={st.tin} />
        <mesh position={[(wx0 + wx1) / 2, (wy0 + wy1) / 2, SZ0]}><planeGeometry args={[wx1 - wx0, wy1 - wy0]} /><meshBasicMaterial color={new THREE.Color("#5f7fb0").lerp(new THREE.Color("#dfe6ee"), fx.day)} transparent opacity={(0.35 + fx.day * 0.5) * dim} toneMapped={false} /></mesh>
        <mesh position={[(wx0 + wx1) / 2, (wy0 + wy1) / 2, SZ0 + 0.075]}><planeGeometry args={[wx1 - wx0, wy1 - wy0]} /><meshBasicMaterial map={st.frost} transparent opacity={fx.frost * dim} toneMapped={false} depthWrite={false} /></mesh>
        {[[0, 0.5, 1.7, 0.06], [0, -0.5, 1.7, 0.06], [-0.8, 0, 0.06, 1.0], [0.8, 0, 0.06, 1.0], [0, 0, 0.04, 1.0]].map(([x, y, a, b], i) => <mesh key={i} position={[(wx0 + wx1) / 2 + x, (wy0 + wy1) / 2 + y, SZ0 + 0.08]}><boxGeometry args={[a, b, 0.04]} /><meshStandardMaterial color="#e8e2d6" roughness={0.7} /></mesh>)}
      </>); })()}
      <TinWall p={[SX0, SH / 2, 0]} s={[0.14, SH, SZ1 - SZ0]} tin={st.tin} />
      <TinWall p={[SX1, SH / 2, -0.4]} s={[0.14, SH, SZ1 - SZ0 - 1.2]} tin={st.tin} />
      <TinWall p={[SX1, 2.75, SZ1 - 0.6]} s={[0.14, 1.3, 1.2]} tin={st.tin} />
      <Box p={[SX1, 1.05, SZ1 - 0.6]} s={[0.06, 2.1, 1.0]} c="#6b6f73" m={0.4} r={0.5} />
      {[SX0 + 0.1, 1.6, 3.4, 5.2, SX1 - 0.1].map((x, i) => (
        <group key={i} position={[x, SH, 0]}>
          {[-1, 1].map((sd) => <mesh key={sd} position={[0, 0.45, sd * 1.5]} rotation={[sd * 0.3, 0, 0]} castShadow><boxGeometry args={[0.08, 0.12, 3.15]} /><meshStandardMaterial color="#6d5a44" roughness={0.9} /></mesh>)}
          <mesh position={[0, 0.02, 0]} castShadow><boxGeometry args={[0.08, 0.1, SZ1 - SZ0]} /><meshStandardMaterial color="#6d5a44" roughness={0.9} /></mesh>
        </group>
      ))}
      {/* techo: el faldón sur entero (con nieve) — el del norte es el corte */}
      <group position={[(SX0 + SX1) / 2, SH + 0.45, SZ0 + 1.5]} rotation={[0.3, 0, 0]}>
        <Box p={[0, 0, 0]} s={[SX1 - SX0 + 0.4, 0.06, 3.3]} c="#7d8186" m={0.5} r={0.5} map={st.tin} />
        <Box p={[0, 0.07, 0]} s={[SX1 - SX0 + 0.4, 0.1, 3.3]} c="#f1f5f9" r={1} />
      </group>
      {/* portón grande (frente/costado este, abajo) — el que pierde */}
      <Box p={[3.0, 1.2, SZ1 - 0.05]} s={[2.6, 2.3, 0.05]} c="#e6e4df" r={0.6} o={0.25} />

      {/* poste con el termómetro de dial */}
      <Box p={[PT.dial[0], 1.6, PT.dial[2] - 0.08]} s={[0.12, 3.2, 0.12]} c="#8a6a48" r={0.9} />
      <group position={[PT.dial[0], PT.dial[1], PT.dial[2]]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.13, 0.13, 0.03, 40]} /><meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.3} /></mesh>
        <mesh position={[0, 0, 0.017]}><circleGeometry args={[0.118, 40]} /><meshBasicMaterial map={dial} toneMapped={false} /></mesh>
      </group>
      {/* banco con morsa, soldadora, mesa de soldar */}
      <Box p={[5.4, 0.95, -1.6]} s={[2.2, 0.08, 0.8]} c="#4b4f55" m={0.6} r={0.45} />
      {[-0.95, 0.95].map((dx) => <Box key={dx} p={[5.4 + dx, 0.5, -1.6]} s={[0.06, 0.85, 0.7]} c="#3a3d42" m={0.5} />)}
      <Box p={[4.7, 1.1, -1.5]} s={[0.22, 0.16, 0.3]} c="#3b5d8a" m={0.5} r={0.4} />
      {fx.frost > 0.01 && <mesh position={[4.7, 1.19, -1.5]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.36]} /><meshBasicMaterial map={st.frost} transparent opacity={fx.frost} toneMapped={false} depthWrite={false} /></mesh>}
      <Box p={[6.1, 0.55, -2.4]} s={[0.55, 0.9, 0.45]} c="#2e5aa0" m={0.3} r={0.5} />
      <Box p={[4.2, 0.85, 1.0]} s={[1.4, 0.06, 0.9]} c="#55595e" m={0.7} r={0.4} />
      {[[-0.6, -0.4], [0.6, -0.4], [-0.6, 0.4], [0.6, 0.4]].map(([dx, dz], i) => <Box key={i} p={[4.2 + dx, 0.45, 1.0 + dz]} s={[0.06, 0.8, 0.06]} c="#3a3d42" m={0.5} />)}
      {/* estante de madera contra la pared oeste (lo que puede prenderse) */}
      <group position={[SX0 + 0.3, 0, 0.6]}>
        {[0.5, 1.1, 1.7].map((y) => <Box key={y} p={[0, y, 0]} s={[0.4, 0.04, 1.4]} c="#a07a50" r={0.9} />)}
        {[-0.65, 0.65].map((z) => <Box key={z} p={[0, 0.9, z]} s={[0.4, 1.8, 0.04]} c="#8a6a48" r={0.9} />)}
        {[[0.6, -0.3], [0.6, 0.2], [1.2, 0.0], [1.8, -0.4]].map(([y, z], i) => <Box key={i} p={[0, y + 0.12, z]} s={[0.3, 0.2, 0.3]} c={["#b9a77e", "#8b4e3c", "#6d7c8c", "#a68a62"][i]} r={0.9} />)}
      </group>
      {/* latas de nafta, thinner y aserrín: rincón opuesto, lejos */}
      <group position={PT.cans}>
        {[[-0.2, 0], [0.15, 0.05]].map(([x, z], i) => <Box key={i} p={[x, 0.25, z]} s={[0.24, 0.32, 0.16]} c="#c42b22" r={0.5} rad={0.03} e="#ff3a2a" ei={fx.fumes * 0.6} />)}
        <mesh position={[0.45, 0.22, -0.05]}><cylinderGeometry args={[0.08, 0.08, 0.2, 20]} /><meshStandardMaterial color="#b9bec4" metalness={0.8} roughness={0.3} emissive="#ff3a2a" emissiveIntensity={fx.fumes * 0.4} /></mesh>
        <mesh position={[-0.1, 0.11, 0.35]} scale={[1, 0.25, 0.7]}><sphereGeometry args={[0.35, 16, 10]} /><meshStandardMaterial color="#d9b07a" roughness={1} emissive="#ff3a2a" emissiveIntensity={fx.fumes * 0.35} /></mesh>
      </group>
      {/* alarmas de CO: una a ~15 ft de la estufa a la altura de la cabeza, otra junto a la puerta */}
      {[PT.co1, PT.co2].map((p, i) => (
        <group key={i} position={p} rotation={[0, i === 0 ? 0 : -Math.PI / 2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.035, 32]} /><meshStandardMaterial color="#f3f3f0" roughness={0.5} /></mesh>
          <mesh position={[0.03, 0, 0.019]}><circleGeometry args={[0.01, 12]} /><meshBasicMaterial color={alarmOn ? "#ff2a1a" : "#2a7a2a"} toneMapped={false} /></mesh>
          {alarmOn && <pointLight position={[0, 0, 0.25]} intensity={fx.alarm * 0.6} distance={1.2} color="#ff3a2a" />}
        </group>
      ))}
      {/* detector de humo en el techo + matafuego junto a la puerta */}
      <mesh position={[3.4, SH - 0.05, 0]}><cylinderGeometry args={[0.08, 0.08, 0.04, 28]} /><meshStandardMaterial color="#f2f2ef" /></mesh>
      <group position={[SX1 - 0.12, 0.55, 1.2]}>
        <mesh><cylinderGeometry args={[0.07, 0.07, 0.42, 20]} /><meshStandardMaterial color="#c8231d" roughness={0.4} metalness={0.2} /></mesh>
        <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.025, 0.04, 0.08, 12]} /><meshStandardMaterial color="#222" /></mesh>
      </group>

      <pointLight position={[ST[0] + 0.7, 1.5, ST[2] + 1.0]} intensity={(3.2 - fx.fire * 1.8) * dim} distance={4} color="#fff1dc" />
      <Stove fx={fx} t={t} tex={st.iron} brick={st.brick} />
      <Ring p={[ST[0], 0.165, ST[2]]} r={0.91} o={fx.clear * 0.9} col="#ff4a3d" />
      {fx.clear > 0.01 && <mesh position={[ST[0], (Y_CAP + ELBOW_Y) / 2 + 0.1, ST[2]]}><cylinderGeometry args={[0.46, 0.46, ELBOW_Y - Y_CAP, 48, 1, true]} /><meshBasicMaterial color="#ffb257" transparent opacity={fx.clear * 0.12} side={THREE.DoubleSide} toneMapped={false} depthWrite={false} /></mesh>}
      <HotFlow t={t} o={fx.flow * (1 - th * 0.4)} map={tx.flake} />
      <Draft t={t} o={fx.draft} map={tx.flake} />
      <Smoke t={t} o={fx.smoke} map={tx.flake} />
      <HeatFloor fx={fx} />
      <HeatCloud fx={fx} map={tx.flake} t={t} cam={k.p} />

      {/* afuera: la regla 3-2-10 (disco de 10 ft alrededor del tope, marca de 3 ft sobre el alero, 2 ft sobre lo más alto) */}
      {fx.rule > 0.01 && <group>
        <mesh position={[ST[0], OUT_TOP - 0.6, WALL_Z - 0.35]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[3.05, 64]} /><meshBasicMaterial color="#8fd6ff" transparent opacity={fx.rule * 0.16} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} /></mesh>
        <mesh position={[ST[0], OUT_TOP - 0.6, WALL_Z - 0.35]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[3.0, 3.05, 96]} /><meshBasicMaterial color="#8fd6ff" transparent opacity={fx.rule * 0.9} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} /></mesh>
        <mesh position={[ST[0] + 0.25, (SH + 0.9 + OUT_TOP) / 2, WALL_Z - 0.35]}><boxGeometry args={[0.015, OUT_TOP - SH - 0.9, 0.015]} /><meshBasicMaterial color="#ffb257" transparent opacity={fx.rule} toneMapped={false} /></mesh>
      </group>}

      {[[-9, 0, -7], [11, 0, -8], [-3, 0, -10], [12, 0, 2], [-10, 0, 3], [6, 0, -11]].map((p, i) => <Pine key={i} p={p as V3} s={1 + rnd(i, 9) * 0.5} />)}
      <Snow t={t} map={tx.flake} rate={1 + fx.storm * 2.5} n={fx.storm > 0.3 ? 3800 : 2000} />
      </ThermCtx.Provider>
    </ThreeCanvas>
  );
};
