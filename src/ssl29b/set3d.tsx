// ssl29 · EL SET 3D de los componentes: un pedazo de la casa de Sachiko (tatami con borde azul, pared de shoji al fondo,
// luz de mañana de costado) donde Blanquito (el muñeco de arcilla blanca, con moño de abuela) hace lo que ella cuenta.
// Las poses de PISO (seiza, de rodillas, en cuatro patas, una rodilla, de costado, piernas cruzadas) no vienen en el kit:
// se arman acá con pose() y se encadenan con secuencia() (resorte con peso, nunca un corte). Luces SIEMPRE montadas.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { Post, useTextures } from "./fx3d";
import { Box, Cyl, useCasaTex } from "./casa3d";
import { StickmanCuerpo } from "./s3d/Stickman";
import { pose, POSES } from "./s3d/acciones";
import { EXPRESIONES } from "./s3d/expresiones";
import { mano, mezclar, pie, Pose } from "./s3d/rig";
import { PROPORCIONES as PR } from "./s3d/proporciones";

export type V = [number, number, number];
const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const sv = (t: number, a: number, b: number) => { const x = cl((t - a) / (b - a)); return x * x * x * (x * (x * 6 - 15) + 10); };
const AT = PR.pie.tobilloAlto, HIP = PR.cadera.altura;
const MD = (p: V, polo: V, forma: Parameters<typeof mano>[2] = { miton: 1 }, giro = 0, x = {}) => mano(p, polo, forma, giro, x);
// raíz con la pelvis a la altura y (del piso) y corrida z
const R = (y: number, z = 0, x = 0): V => [x, y - HIP, z];

// ---------------- poses de piso (mirando a +z) ----------------
export const PZ: Record<string, Pose> = {
  stand: POSES.parado,
  // sentada sobre los talones: rodillas adelante en el piso, empeines planos para atrás
  seiza: pose({ raiz: R(0.42, -0.12), torso: { x: 2 }, cabeza: { x: -2 },
    manoI: MD([0.2, -1.12, 0.46], [1, 0, -0.4], { miton: 1 }, 80, { goma: 0.3 }), manoD: MD([-0.2, -1.12, 0.46], [-1, 0, -0.4], { miton: 1 }, 80, { goma: 0.3 }),
    pieI: pie([0.13, 0.09, -0.2], 176, { polo: [0, -0.3, 1], pitch: -6 }), pieD: pie([-0.13, 0.09, -0.2], -176, { polo: [0, -0.3, 1], pitch: -6 }) }),
  // de rodillas derecha (cadera arriba de las rodillas)
  kneel: pose({ raiz: R(0.86, 0.05), torso: { x: 3 },
    pieI: pie([0.14, 0.09, -0.62], 176, { polo: [0, -0.2, 1], pitch: -4 }), pieD: pie([-0.14, 0.09, -0.62], -176, { polo: [0, -0.2, 1], pitch: -4 }) }),
  // en cuatro patas
  four: pose({ raiz: R(0.84, 0.0), torso: { x: 80, curva: -0.02 }, cabeza: { x: -55 },
    manoI: MD([0.26, -0.18, 0.92], [1, 0.2, -0.3], { abierta: 1 }, 90, { goma: 0.2 }), manoD: MD([-0.26, -0.18, 0.92], [-1, 0.2, -0.3], { abierta: 1 }, 90, { goma: 0.2 }),
    pieI: pie([0.16, 0.09, -0.66], 178, { polo: [0, -0.2, 1] }), pieD: pie([-0.16, 0.09, -0.66], -178, { polo: [0, -0.2, 1] }) }),
  // una rodilla: el pie derecho plantado adelante, la rodilla izquierda en el piso
  half: pose({ raiz: R(0.86, 0.0), torso: { x: 8 },
    manoI: MD([0.2, -0.95, 0.5], [1, 0, -0.4], { abierta: 1 }, 80), manoD: MD([-0.24, -0.86, 0.62], [-1, 0, -0.4], { abierta: 1 }, 80),
    pieI: pie([0.15, 0.09, -0.66], 176, { polo: [0, -0.2, 1] }), pieD: pie([-0.17, AT, 0.66], -4, { polo: [0, 0.6, 1] }) }),
  // una rodilla con la nariz arriba de la punta del pie (a punto de subir)
  halfLean: pose({ raiz: R(0.92, 0.12), torso: { x: 34, curva: 0.03 }, cabeza: { x: -20 },
    manoI: MD([0.22, -0.6, 0.62], [1, 0, -0.4], { abierta: 1 }, 80), manoD: MD([-0.26, -0.55, 0.66], [-1, 0, -0.4], { abierta: 1 }, 80),
    pieI: pie([0.15, 0.09, -0.6], 176, { polo: [0, -0.2, 1] }), pieD: pie([-0.17, AT, 0.66], -4, { polo: [0, 0.6, 1] }) }),
  // sentada de costado (yokozuwari): cadera en el piso, las dos piernas dobladas hacia su derecha
  side: pose({ raiz: R(0.2, -0.05, 0.1), torso: { z: 8, x: 2 }, cabeza: { z: -8 },
    manoI: MD([0.5, -1.2, 0.0], [1, 0.2, 0], { abierta: 1 }, 0, { goma: 0.2 }), manoD: MD([-0.2, -1.05, 0.42], [-1, 0, -0.4], { miton: 1 }, 80),
    pieI: pie([-0.45, 0.09, 0.15], -100, { polo: [0.2, 0.2, 1] }), pieD: pie([-0.62, 0.09, -0.12], -110, { polo: [0.1, 0.2, 1] }) }),
  // piernas cruzadas (agura), espalda derecha
  cross: pose({ raiz: R(0.2, -0.05), torso: { x: 0 },
    manoI: MD([0.32, -1.0, 0.5], [1, 0, -0.4], { miton: 1 }, 80), manoD: MD([-0.32, -1.0, 0.5], [-1, 0, -0.4], { miton: 1 }, 80),
    pieI: pie([-0.2, 0.09, 0.42], -80, { polo: [1, 0.3, 0.6] }), pieD: pie([0.2, 0.09, 0.3], 80, { polo: [-1, 0.3, 0.6] }) }),
  // encorvada (el hongo triste): la misma agura con la espalda en C
  slump: pose({ raiz: R(0.2, -0.1), torso: { x: 34, curva: 0.16 }, cabeza: { x: 26 },
    manoI: MD([0.3, -0.7, 0.6], [1, 0, -0.4], { miton: 1 }, 80), manoD: MD([-0.3, -0.7, 0.6], [-1, 0, -0.4], { miton: 1 }, 80),
    pieI: pie([-0.2, 0.09, 0.42], -80, { polo: [1, 0.3, 0.6] }), pieD: pie([0.2, 0.09, 0.3], 80, { polo: [-1, 0.3, 0.6] }) }),
  // acostada de costado (para rodar)
  lying: pose({ raiz: R(0.22, 0.0), torso: { z: 84, x: 4 }, cabeza: { z: -10 },
    manoI: MD([0.0, -0.3, 0.6], [1, 0, -0.4], { abierta: 1 }, 60), manoD: MD([-0.1, 0.1, 0.5], [-1, 0, -0.4], { abierta: 1 }, 60),
    pieI: pie([-0.85, 0.12, 0.25], -70, { polo: [0, 0.3, 1] }), pieD: pie([-0.9, 0.24, 0.05], -70, { polo: [0, 0.3, 1] }) }),
  // en cuclillas (doblar las rodillas para lo de abajo)
  squat: pose({ raiz: R(0.62, -0.18), torso: { x: 30, curva: 0.03 }, cabeza: { x: -18 },
    manoI: MD([0.24, -0.9, 0.62], [1, 0, -0.4], { abierta: 1 }, 80), manoD: MD([-0.24, -0.95, 0.58], [-1, 0, -0.4], { abierta: 1 }, 80),
    pieI: pie([0.24, AT, 0.18], 10, { polo: [0.4, 0.3, 1] }), pieD: pie([-0.24, AT, 0.18], -10, { polo: [-0.4, 0.3, 1] }) }),
  // parada inclinada hacia adelante (subiendo, nariz sobre los pies)
  lean: pose({ raiz: R(1.1, -0.2), torso: { x: 36, curva: 0.03 }, cabeza: { x: -22 },
    manoI: MD([0.3, -0.85, 0.45], [1, 0, -0.4], { miton: 1 }, 80), manoD: MD([-0.3, -0.85, 0.45], [-1, 0, -0.4], { miton: 1 }, 80),
    pieI: pie([0.2, AT, 0.08], 10, { polo: [0.2, 0.3, 1] }), pieD: pie([-0.2, AT, 0.08], -10, { polo: [-0.2, 0.3, 1] }) }),
  // parada rígida echada para atrás (el soldado)
  stiff: pose({ raiz: R(1.42, 0.0), torso: { x: -12 }, cabeza: { x: 6 },
    manoI: MD([0.36, -1.24, -0.1], [0.6, 0, -1]), manoD: MD([-0.36, -1.24, -0.1], [-0.6, 0, -1]) }),
  // estirando el brazo para lo de arriba
  reach: pose({ torso: { x: -4 }, cabeza: { x: -26 }, manoD: MD([-0.2, 1.3, 0.3], [-1, 0, -0.3], { abierta: 1 }, 0), pieD: pie([-0.2, AT + 0.08, -0.02], -12, { polo: [-0.2, 0, 1], pitch: -30 }) }),
};
// encadena poses: [[t, pose], ...] (t en segundos del componente) con mezcla suave de dur s; micro-movimiento para no congelarse
export const secuencia = (keys: [number, Pose][], t: number, dur = 0.7): Pose => {
  let p = keys[0][1];
  for (let i = 1; i < keys.length; i++) { const k = sv(t, keys[i][0], keys[i][0] + dur); if (k <= 0) break; p = mezclar(p, keys[i][1], k); }
  const q: Pose = JSON.parse(JSON.stringify(p));
  q.torso.z += 1.2 * Math.sin(t * 1.3); q.cabeza.y += 2.2 * Math.sin(t * 0.9 + 1); q.cabeza.x += 1.0 * Math.sin(t * 1.7);
  return q;
};

// ---------------- Blanquito-Sachiko ----------------
export const Sachi: React.FC<{ p: Pose; t: number; x?: number; z?: number; rotY?: number; s?: number; expr?: keyof typeof EXPRESIONES; color?: string; contacto?: number }> =
  ({ p, t, x = 0, z = 0, rotY = 0, s = 1, expr = "feliz", color = "#f1ede6", contacto = 0.7 }) =>
    <StickmanCuerpo pose={p} e={EXPRESIONES[expr]} t={t} x={x} z={z} rotY={rotY} escala={s} color={color} accesorios={["monio"]} contacto={contacto} colorContacto="#3a2e1c" />;

// ---------------- el set ----------------
export type Cam3 = { p: V; l: V; fov: number };
const Cam: React.FC<{ c: Cam3 }> = ({ c }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  cm.position.set(...c.p); cm.up.set(0, 1, 0); cm.lookAt(...c.l); cm.fov = c.fov; cm.near = 0.05; cm.far = 200; cm.updateProjectionMatrix();
  return null;
};
// cámara orgánica: deriva lenta en arco entre dos encuadres (nunca zoom lineal)
export const orbita = (t: number, a: Cam3, b: Cam3, d: number): Cam3 => {
  const k = sv(t, 0, d), arc = Math.sin(Math.PI * k) * 0.25;
  const L = (u: V, w: V): V => [u[0] + (w[0] - u[0]) * k + arc, u[1] + (w[1] - u[1]) * k + arc * 0.3, u[2] + (w[2] - u[2]) * k];
  return { p: L(a.p, b.p), l: [a.l[0] + (b.l[0] - a.l[0]) * k, a.l[1] + (b.l[1] - a.l[1]) * k, a.l[2] + (b.l[2] - a.l[2]) * k], fov: a.fov + (b.fov - a.fov) * k };
};
// piso de tatami (esteras con borde de tela azul) + pared de shoji al fondo; warm = cuánto se entibia la luz
export const Set3D: React.FC<{ cam: Cam3; children?: React.ReactNode; warm?: number; floor?: "tatami" | "wood" | "none"; wall?: boolean; spot?: V; spotK?: number; bg?: string }> =
  ({ cam, children, warm = 0.3, floor = "tatami", wall = true, spot = [0, 0, 0], spotK = 0, bg = "#d9cdb8" }) => {
    const tx = useTextures(), tt = useCasaTex();
    return <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam c={cam} />
      <Post bloom={0.25} threshold={0.95} exposure={1.15} env={0.45} />
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 9, 22]} />
      <hemisphereLight args={[0xf4ede0, 0x6a5640, 0.95]} />
      <directionalLight position={[-5, 6, 4]} intensity={2.4} color={new THREE.Color("#fff3dc").lerp(new THREE.Color("#ffc890"), warm).getStyle()} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[3, 2.5, 3]} intensity={0.8} distance={10} color="#ffe4c0" />
      <spotLight position={[spot[0], 3.2, spot[2] + 0.8]} target-position={spot} angle={0.42} penumbra={0.85} intensity={0.2 + 6 * spotK} distance={7} color="#ffd9a0" />
      {floor === "tatami" && <>
        <Box p={[0, 0.0, 0]} s={[14, 0.04, 10]} c="#5a4430" map={tx.planks} r={0.75} rad={0.005} cast={false} />
        {[-2.85, -0.95, 0.95, 2.85].map((x) => [-2.9, -0.95, 1.0].map((z) => <group key={x + "_" + z}>
          <Box p={[x, 0.035, z]} s={[1.86, 0.03, 1.91]} c="#ffffff" map={tt.tatami} r={0.92} rad={0.008} cast={false} />
          <Box p={[x - 0.9, 0.037, z]} s={[0.05, 0.032, 1.91]} c="#1f2a40" r={0.8} rad={0.004} cast={false} />
        </group>))}
      </>}
      {floor === "wood" && <Box p={[0, 0.0, 0]} s={[14, 0.04, 10]} c="#8a6a48" map={tx.planks} r={0.7} rad={0.005} cast={false} />}
      {wall && <group position={[0, 0, -3.9]}>
        <Box p={[0, 1.6, 0]} s={[14, 3.2, 0.1]} c="#e9dfcc" r={0.95} cast={false} />
        {[-3.2, -1.2, 0.8, 2.8].map((x) => <group key={x}>
          <Box p={[x, 1.45, 0.07]} s={[1.6, 1.7, 0.03]} c="#f6f0e2" e="#fff2d6" ei={0.25} r={0.9} cast={false} />
          {[0, 1, 2, 3].map((i) => <Box key={i} p={[x - 0.6 + i * 0.4, 1.45, 0.09]} s={[0.025, 1.7, 0.02]} c="#6b4a2c" cast={false} />)}
          {[0, 1, 2, 3, 4].map((i) => <Box key={"h" + i} p={[x, 0.65 + i * 0.4, 0.09]} s={[1.6, 0.025, 0.02]} c="#6b4a2c" cast={false} />)}
        </group>)}
        <Box p={[0, 2.42, 0.1]} s={[14, 0.12, 0.08]} c="#5a3a22" cast={false} />
      </group>}
      {children}
    </ThreeCanvas>;
  };
export { Box, Cyl };

// ---------------- lámina de poses (sólo para stills de revisión) ----------------
export const PoseLab: React.FC = () => {
  const f = useCurrentFrame(), ks = Object.keys(PZ), k = ks[f % ks.length], side = f >= ks.length;
  return <Set3D cam={{ p: side ? [7.5, 1.6, 0.4] : [3.2, 2.4, 6.8], l: [0, 1.1, 0], fov: 36 }} wall={false}>
    <Sachi p={PZ[k]} t={0} rotY={0} />
  </Set3D>;
};
