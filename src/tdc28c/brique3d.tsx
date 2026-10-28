// tdc28c · EL RINCÓN DE LAS BRIQUETAS, adelante en el taller (sobre el piso, frente abierto en z=+3):
// el palé con los tres baldes (carbonilla · barro colorado · la mezcla), la prensa de gato en su marco, la malla de secado
// sobre dos ladrillos, las dos latas de la prueba del reloj (carbón suelto con llama vs briquetas rojas) y el cartel de chapa
// del monóxido con el detector en la pared del fondo. Todo entra con escala/opacidad en rampa y las luces están SIEMPRE
// montadas (intensidad en rampa): nada aparece en un cuadro (regla del creador 28-oct: sin destellos ni lageos).
import React, { useMemo } from "react";
import * as THREE from "three";
import { rbox } from "./fx3d";
import type { Estado } from "./tl";

type V = [number, number, number];
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k));

export const BQ: V = [-1.4, 0, 1.0];      // el palé de los baldes
export const DRY: V = [0.85, 0, 1.35];    // la malla de secado
export const CANS: V = [2.35, 0, 1.25];   // las dos latas de la prueba
export const SIGN: V = [0.75, 1.75, -2.92];

const Box: React.FC<{ p: V; s: V; c: string | THREE.Color; r?: number; m?: number; e?: string | THREE.Color; ei?: number; rot?: V; rad?: number; map?: THREE.Texture }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, rot, rad = 0.01, map }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; h: number; c: string | THREE.Color; r2?: number; rough?: number; m?: number; e?: string | THREE.Color; ei?: number; rot?: V; open?: boolean; seg?: number }> = ({ p, r, h, c, r2, rough = 0.7, m = 0, e, ei = 0, rot, open, seg = 24 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg, 1, open]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} side={open ? THREE.DoubleSide : THREE.FrontSide} /></mesh>
);

// un balde de plástico de 20 L con su contenido (la superficie) y un montoncito arriba
const Bucket: React.FC<{ p: V; fill: string | THREE.Color; heap?: number; rough?: number }> = ({ p, fill, heap = 0.4, rough = 1 }) => (
  <group position={p}>
    <Cyl p={[0, 0.17, 0]} r={0.15} r2={0.125} h={0.34} c="#d8d4cb" rough={0.55} open />
    <Cyl p={[0, 0.005, 0]} r={0.125} h={0.01} c="#cfcac0" />
    <mesh position={[0, 0.305, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[0.145, 28]} /><meshStandardMaterial color={fill} roughness={rough} /></mesh>
    {heap > 0 && <mesh position={[0, 0.305, 0]} castShadow><coneGeometry args={[0.1, 0.06 * heap, 20]} /><meshStandardMaterial color={fill} roughness={rough} /></mesh>}
    <mesh position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.15, 0.008, 8, 32]} /><meshStandardMaterial color="#c8c3b8" roughness={0.5} /></mesh>
  </group>
);

const useSignTex = () => useMemo(() => {
  const cv = document.createElement("canvas"); cv.width = 512; cv.height = 320; const g = cv.getContext("2d")!;
  g.fillStyle = "#b8231c"; g.fillRect(0, 0, 512, 320);
  for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(${90 + rnd(i, 1) * 60},${40 + rnd(i, 2) * 30},20,${0.15 + rnd(i, 3) * 0.3})`; g.beginPath(); g.ellipse(rnd(i, 4) * 512, rnd(i, 5) * 320, 4 + rnd(i, 6) * 22, 3 + rnd(i, 7) * 14, 0, 0, 6.3); g.fill(); }
  g.strokeStyle = "#f3eee2"; g.lineWidth = 10; g.strokeRect(16, 16, 480, 288);
  g.fillStyle = "#f3eee2"; g.textAlign = "center"; g.font = "900 78px Arial Black, Arial"; g.fillText("¡MONÓXIDO!", 256, 128);
  g.font = "800 46px Arial"; g.fillText("NUNCA ADENTRO", 256, 200); g.font = "700 34px Arial"; g.fillText("BRASERO SÓLO AFUERA", 256, 258);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}, []);

export const Brique: React.FC<{ s: Estado; t: number }> = ({ s, t }) => {
  const sign = useSignTex();
  const mixC = col("#141414", "#3b3a38", s.mix);
  // la prensa: el tarugo baja despacio una vez cada 2 s mientras s.press; la palanca del gato va y viene suave
  const cyc = (t * 0.5) % 1, push = s.press * ease(cl(cyc * 1.4)), lever = s.press * Math.sin(t * Math.PI) * 0.35;
  // las briquetas en la malla (6 × 3), entran de a una y se secan (de brillante a mate)
  const wetC = col("#121212", "#2d2c2a", s.dried), wetR = 0.35 + 0.6 * s.dried;
  // las latas: la del carbón suelto con llama (baja con burnLow), la de las briquetas roja pareja
  const flame = s.burn * (1 - 0.85 * s.burnLow) * (0.94 + 0.06 * Math.sin(t * 2.3)), glow = s.burn * (0.9 + 0.05 * Math.sin(t * 1.1));
  return (
    <group>
      {/* ===== el palé con los tres baldes ===== */}
      <group position={BQ}>
        {[-0.62, -0.31, 0, 0.31, 0.62].map((x, i) => <Box key={"pl" + i} p={[x, 0.11, 0]} s={[0.26, 0.022, 0.82]} c={i % 2 ? "#a07a52" : "#937049"} r={0.95} rad={0.004} />)}
        {[-0.36, 0.36].map((z, i) => <Box key={"pt" + i} p={[0, 0.05, z]} s={[1.6, 0.09, 0.09]} c="#7d5c3c" r={0.95} rad={0.004} />)}
        <Bucket p={[-0.55, 0.12, 0.12]} fill="#121212" heap={0.6 + 0.4 * s.pour} />
        <Bucket p={[0.55, 0.12, 0.12]} fill="#93432a" heap={0.3} rough={0.8} />
        <Bucket p={[0, 0.12, 0.28]} fill={mixC} heap={0.3 + 0.5 * s.mix} rough={1 - 0.4 * s.mix} />
        {/* la bolsa de papel que se vacía en el balde negro (y el chorrito de polvo) */}
        {s.pour > 0.01 && <group position={[-0.55, 0.62, 0.05]} rotation={[0, 0, Math.PI * 0.72 * ease(s.pour)]} scale={ease(cl(s.pour * 3))}>
          <Box p={[0, 0, 0]} s={[0.2, 0.32, 0.11]} c="#a9845a" r={0.95} rad={0.006} />
        </group>}
        {s.pour > 0.2 && Array.from({ length: 14 }, (_, i) => {
          const k = (t * 1.6 + i / 14) % 1;
          return <mesh key={"dp" + i} position={[-0.55 + (rnd(i, 2) - 0.5) * 0.03, 0.5 - k * 0.15, 0.1 + (rnd(i, 3) - 0.5) * 0.03]}><boxGeometry args={[0.012, 0.012, 0.012]} /><meshStandardMaterial color="#0d0d0d" roughness={1} transparent opacity={cl((s.pour - 0.2) * 3)} /></mesh>;
        })}
        {/* el chorizo de arcilla que se dobla en anillo sin rajarse */}
        {s.chorizo > 0.01 && <group position={[0.55, 0.62, 0.12]} scale={ease(s.chorizo)} rotation={[Math.PI / 2 - 0.3, 0, t * 0.25]}>
          <mesh castShadow><torusGeometry args={[0.07, 0.011, 12, 40, Math.PI * 2 * (0.55 + 0.45 * ease(cl(s.chorizo * 1.5 - 0.3)))]} /><meshStandardMaterial color="#a24a2c" roughness={0.75} /></mesh>
        </group>}
        {/* la prensa de gato: dos hierros ángulo, el tirante, el caño blanco, el tarugo, el gato rojo y su palanca */}
        <group position={[0, 0.122, -0.22]}>
          {[-0.2, 0.2].map((x, i) => <Box key={"pp" + i} p={[x, 0.33, 0]} s={[0.04, 0.66, 0.04]} c="#4c4f53" m={0.7} r={0.45} rad={0.004} />)}
          <Box p={[0, 0.68, 0]} s={[0.5, 0.07, 0.09]} c="#6b4d30" r={0.9} rad={0.006} />
          <Box p={[0, 0.01, 0]} s={[0.5, 0.02, 0.2]} c="#8a6a46" r={0.95} rad={0.004} />
          <Cyl p={[0, 0.06, 0]} r={0.03} h={0.1} c="#ecebe6" rough={0.4} open />
          <Cyl p={[0, 0.06 - 0.03 * push, 0]} r={0.027} h={0.098} c="#1b1b1b" rough={1} />
          <Cyl p={[0, 0.2 - 0.05 * push, 0]} r={0.026} h={0.18} c="#b88a55" rough={0.85} />
          <Cyl p={[0, 0.39 - 0.05 * push, 0]} r={0.05} h={0.12} c="#b3221b" m={0.4} rough={0.4} />
          <Cyl p={[0, 0.55 - 0.03 * push, 0]} r={0.022} h={0.2} c="#9aa0a6" m={0.85} rough={0.3} />
          <group position={[0.05, 0.36 - 0.05 * push, 0]} rotation={[0, 0, -0.5 + lever]}><Box p={[0.12, 0, 0]} s={[0.24, 0.014, 0.014]} c="#2c2f33" m={0.8} r={0.4} rad={0.003} /></group>
          {/* la briqueta que sale del caño (cuando s.press termina) */}
          {s.press > 0.01 && <Cyl p={[0.12, 0.06, 0.04]} r={0.027} h={0.09} c="#1a1a1a" rough={0.9} />}
        </group>
      </group>

      {/* ===== la malla de secado sobre dos ladrillos, a un palmo del piso ===== */}
      {s.dry > 0.01 && <group position={DRY} scale={[1, ease(cl(s.dry * 4)), 1]}>
        {[-0.48, 0.48].map((x, i) => <Box key={"lb" + i} p={[x, 0.06, 0]} s={[0.12, 0.12, 0.25]} c="#8d4a33" r={0.95} rad={0.006} />)}
        <Box p={[0, 0.125, 0]} s={[1.15, 0.01, 0.52]} c="#7f868c" m={0.75} r={0.45} rad={0.002} />
        {Array.from({ length: 18 }, (_, i) => {
          const k = ease(cl(s.dry * 20 - i * 0.9)), x = (i % 6) * 0.17 - 0.425, z = Math.floor(i / 6) * 0.15 - 0.15;
          return k > 0.01 ? <Cyl key={"bq" + i} p={[x, 0.13 + 0.045 * k, z]} r={0.028} h={0.09 * k} c={wetC} rough={wetR} rot={[0, 0, s.turn * Math.PI * cl(Math.sin(t * 0.8 + i))]} /> : null;
        })}
      </group>}

      {/* ===== las dos latas de la prueba del reloj ===== */}
      {s.burn > 0.01 && <group position={CANS} scale={ease(cl(s.burn * 3))}>
        {[-0.22, 0.22].map((x, i) => <group key={"ln" + i} position={[x, 0, 0]}>
          <Box p={[0, 0.03, 0]} s={[0.25, 0.06, 0.12]} c="#8d4a33" r={0.95} rad={0.005} />
          <Cyl p={[0, 0.14, 0]} r={0.09} h={0.16} c="#8e9399" m={0.7} rough={0.5} open />
          <Cyl p={[0, 0.065, 0]} r={0.088} h={0.01} c="#5b5f63" m={0.6} />
        </group>)}
        {/* izquierda: el carbón de bolsa en trozos, con llama que baja */}
        {Array.from({ length: 6 }, (_, i) => <Box key={"cb" + i} p={[-0.22 + (rnd(i, 1) - 0.5) * 0.09, 0.1 + rnd(i, 2) * 0.05, (rnd(i, 3) - 0.5) * 0.09]} s={[0.05, 0.035, 0.04]} c="#141414" e="#ff5a1a" ei={0.6 * flame} rot={[rnd(i, 4), rnd(i, 5), 0]} rad={0.006} />)}
        {Array.from({ length: 6 }, (_, i) => { const h = 0.1 + rnd(i, 7) * 0.08, w = 0.016 + rnd(i, 8) * 0.012;
          return <mesh key={"fl" + i} position={[-0.22 + (rnd(i, 5) - 0.5) * 0.09, 0.17 + 0.05 * flame, (rnd(i, 6) - 0.5) * 0.08]} scale={[1, 0.35 + flame * (0.9 + 0.1 * Math.sin(t * 1.7 + i * 1.9)), 1]}>
            <coneGeometry args={[w, h, 10]} /><meshBasicMaterial color={i % 2 ? "#ffcf6a" : "#ff8a2a"} transparent opacity={0.6 * flame} depthWrite={false} toneMapped={false} />
          </mesh>; })}
        {/* derecha: tres briquetas rojas parejas, sin llama */}
        {Array.from({ length: 3 }, (_, i) => <Cyl key={"br" + i} p={[0.22 + (i - 1) * 0.055, 0.115, (i % 2) * 0.02 - 0.01]} r={0.026} h={0.08} c="#2a1a14" e="#ff4a12" ei={1.1 * glow} rough={0.95} />)}
      </group>}
      {/* luz de trabajo fija sobre el rincón (siempre igual: no cambia nada de golpe) */}
      <pointLight position={[-1.3, 1.9, 1.9]} intensity={1.3} distance={4.5} color="#ffe2b8" />
      <pointLight position={[0.9, 1.7, 2.2]} intensity={0.8} distance={3.5} color="#ffe2b8" />
      <pointLight position={[CANS[0], 0.45, CANS[2] + 0.1]} intensity={1.6 * s.burn * (0.8 + 0.2 * (1 - s.burnLow))} distance={2.4} color="#ff8a3d" />

      {/* ===== el cartel de chapa del monóxido y el detector (pared del fondo) ===== */}
      <group position={SIGN} scale={ease(s.co) * 0.999 + 0.001}>
        <Box p={[0, 0, 0]} s={[0.62, 0.39, 0.012]} c="#ffffff" map={sign} r={0.6} m={0.3} rad={0.004} />
        <Box p={[0.48, -0.05, 0.01]} s={[0.12, 0.12, 0.035]} c="#f2f2f0" r={0.5} rad={0.012} />
        <mesh position={[0.48, -0.02, 0.03]}><sphereGeometry args={[0.009, 10, 8]} /><meshBasicMaterial color={col("#3a0a0a", "#ff2a1a", s.co * (0.5 + 0.5 * Math.sin(t * Math.PI)))} toneMapped={false} /></mesh>
      </group>
    </group>
  );
};
