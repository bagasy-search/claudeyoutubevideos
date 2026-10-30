// kit29 · utilería 3D de Chencho compartida por los 5 videos de chen29 (billete, moneda, pila de monedas, sobre de estraza,
// lata de café, libreta de rayas, báscula de dos platos, tambo, foco). Va dentro de <Estudio>. Render SÓLO en el farm.
import React from "react";
import * as THREE from "three";
import { rbox } from "./fx3d";
import { cl, ctex, lathe, M, papel, rn, V3 } from "./estudio3d";

const P2 = Math.PI / 2;
// billete mexicano genérico (sin marca ni retrato real): color por valor, número grande en la esquina
const billTex = (v: string, c: string) => ctex("bill" + v + c, 512, 240, (g) => {
  g.fillStyle = c; g.fillRect(0, 0, 512, 240);
  for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(255,255,255,${0.05 + 0.05 * rn(i, 2)})`; g.lineWidth = 2; g.beginPath(); g.arc(380, 120, 20 + i * 5, 0, 6.3); g.stroke(); }
  g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.ellipse(150, 120, 70, 85, 0, 0, 6.3); g.fill();
  g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 6; g.strokeRect(10, 10, 492, 220);
  g.fillStyle = "#fff"; g.font = "900 78px Montserrat, Arial"; g.textAlign = "right"; g.textBaseline = "top"; g.fillText(v, 490, 18);
  g.font = "900 44px Montserrat, Arial"; g.textAlign = "left"; g.fillText(v, 22, 176);
});
export const BCOL: Record<string, string> = { "20": "#3f7fb8", "50": "#b0447a", "100": "#c0593a", "200": "#4f8a4a", "500": "#6b5a8a", "1000": "#a07a3a" };
export const Billete: React.FC<{ p?: V3; rot?: V3; v?: string; s?: number }> = ({ p, rot, v = "200", s = 1 }) => (
  <mesh position={p} rotation={rot} scale={s} castShadow receiveShadow><boxGeometry args={[0.66, 0.31, 0.004]} />
    <meshStandardMaterial map={billTex(v, BCOL[v] ?? "#4f8a4a")} roughness={0.85} /></mesh>
);
const coinGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.018, 28);
export const Moneda: React.FC<{ p: V3; rot?: V3; s?: number; oro?: boolean }> = ({ p, rot, s = 1, oro = true }) => (
  <mesh position={p} rotation={rot} scale={s} geometry={coinGeo} castShadow receiveShadow>
    <meshStandardMaterial color={oro ? "#c9a24a" : "#b9bcc2"} roughness={0.3} metalness={1} envMapIntensity={1.3} /></mesh>
);
// pila de n monedas que crecen de a una desde `a` (cada `dt`), con caída corta
export const Pila: React.FC<{ p: V3; n: number; t: number; a: number; dt?: number; oro?: boolean }> = ({ p, n, t, a, dt = 0.05, oro }) => (
  <group position={p}>{Array.from({ length: n }, (_, i) => { const k = t - (a + i * dt); if (k < 0) return null;
    const y = 0.009 + i * 0.019 + Math.max(0, 0.35 - k * 3) ** 2 * 3;
    return <Moneda key={i} p={[(rn(i, 3) - 0.5) * 0.012, y, (rn(i, 4) - 0.5) * 0.012]} rot={[0, rn(i, 5) * 6, 0]} oro={oro} />; })}</group>
);
// sobre de papel de estraza con su nombre a plumón; solapa 0 = cerrada, 1 = abierta; rojo = el sobre siete
export const Sobre: React.FC<{ p?: V3; rot?: V3; txt: string; solapa?: number; rojo?: boolean; s?: number; children?: React.ReactNode }> = ({ p, rot, txt, solapa = 0, rojo, s = 1, children }) => {
  const lab = papel("sobre" + txt + (rojo ? "r" : ""), [txt], { w: 512, h: 160, bg: rojo ? "#f1e6cc" : "#c39a68", ink: rojo ? "#b3201a" : "#2a1c12", size: txt.length > 9 ? 70 : 92 });
  return <group position={p} rotation={rot} scale={s}>
    <mesh geometry={rbox(0.8, 0.03, 0.5, 0.012)} castShadow receiveShadow><meshStandardMaterial color={rojo ? "#b8322a" : "#b98d5c"} roughness={0.92} /></mesh>
    <mesh position={[0, 0.0155, 0.06]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.74, 0.23]} /><meshStandardMaterial map={lab} roughness={0.95} /></mesh>
    <group position={[0, 0.016, -0.25]} rotation={[-solapa * 2.6, 0, 0]}>
      <mesh rotation={[-P2, 0, 0]} position={[0, 0.001, 0.12]}><shapeGeometry args={[new THREE.Shape([new THREE.Vector2(-0.4, 0.12), new THREE.Vector2(0.4, 0.12), new THREE.Vector2(0, -0.14)])]} />
        <meshStandardMaterial color={rojo ? "#9e2a22" : "#a97f50"} roughness={0.92} side={THREE.DoubleSide} /></mesh></group>
    {children}
  </group>;
};
// lata de café de lámina (sin marca): cuerpo rojo gastado, tapa que se levanta (tapa 0..1)
const lataTex = () => ctex("lata", 1024, 256, (g) => {
  g.fillStyle = "#9a2a1e"; g.fillRect(0, 0, 1024, 256);
  g.fillStyle = "#e9c46a"; g.fillRect(0, 96, 1024, 64); g.fillStyle = "#6a1a12"; for (let x = 0; x < 1024; x += 48) g.fillRect(x, 108, 20, 40);
  for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(60,40,30,${0.25 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 1024, rn(i, 3) * 256, 3 + rn(i, 4) * 6, 2 + rn(i, 5) * 4); }
});
export const Lata: React.FC<{ p?: V3; tapa?: number; s?: number; children?: React.ReactNode }> = ({ p, tapa = 0, s = 1, children }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.32, 0]} castShadow receiveShadow><cylinderGeometry args={[0.34, 0.34, 0.64, 48, 1, true]} /><meshStandardMaterial map={lataTex()} roughness={0.45} metalness={0.6} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.005, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.34, 48]} />{M.cromo("#8a8d93")}</mesh>
    <group position={[0.34 * tapa * 1.6, 0.66 + 0.5 * Math.sin(tapa * Math.PI) * 0.6, 0]} rotation={[0, 0, -tapa * 1.2]}>
      <mesh castShadow><cylinderGeometry args={[0.355, 0.355, 0.06, 48]} />{M.cromo("#b8bbc0")}</mesh></group>
    {children}
  </group>
);
// libreta de rayas abierta: páginas con texto que aparece renglón por renglón (rev 0..n)
export const Libreta: React.FC<{ p?: V3; rot?: V3; k: string; izq: string[]; der: string[]; rev?: number; s?: number }> = ({ p, rot, k, izq, der, rev = 99, s = 1 }) => {
  const pg = (side: string, ls: string[]) => papel(`lib${k}${side}${Math.min(ls.length, Math.floor(rev))}`, ls.map((l, i) => (i < rev ? l : " ")), { w: 512, h: 640, bg: "#f1ead6", rule: true, size: 64 });
  return <group position={p} rotation={rot} scale={s}>
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.36, 0, 0]} rotation={[0, 0, sd * 0.05]}>
      <mesh geometry={rbox(0.7, 0.025, 0.9, 0.01)} castShadow receiveShadow><meshStandardMaterial color="#f1ead6" roughness={0.9} /></mesh>
      <mesh position={[0, 0.0135, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.66, 0.86]} /><meshStandardMaterial map={pg(sd < 0 ? "l" : "r", sd < 0 ? izq : der)} roughness={0.9} /></mesh>
    </group>)}
    <mesh position={[0, -0.006, 0]} geometry={rbox(1.5, 0.012, 0.95, 0.01)} receiveShadow><meshStandardMaterial color="#3d5a7a" roughness={0.8} /></mesh>
  </group>;
};
// lápiz amarillo
export const Lapiz: React.FC<{ p: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.025, 0.025, 0.6, 6]} /><meshStandardMaterial color="#e8b931" roughness={0.5} /></mesh>
    <mesh position={[-0.33, 0, 0]} rotation={[0, 0, P2]} castShadow><coneGeometry args={[0.025, 0.07, 6]} /><meshStandardMaterial color="#e8c9a0" roughness={0.7} /></mesh>
    <mesh position={[0.31, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.026, 0.026, 0.04, 12]} /><meshStandardMaterial color="#d86a8a" roughness={0.7} /></mesh>
  </group>
);
// báscula de dos platos: inc = inclinación (-1 izq abajo … 1 der abajo); hijos en cada plato vía izq / der
export const Bascula: React.FC<{ p?: V3; inc: number; izq?: React.ReactNode; der?: React.ReactNode; s?: number }> = ({ p, inc, izq, der, s = 1 }) => {
  const a = inc * 0.22, L = 1.0;
  return <group position={p} scale={s}>
    <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.3, 0.36, 0.06, 32]} />{M.cromo("#b08a4a")}</mesh>
    <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.035, 0.05, 0.95, 16]} />{M.cromo("#b08a4a")}</mesh>
    <group position={[0, 0.98, 0]} rotation={[0, 0, -a]}>
      <mesh rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.025, 0.025, L * 2, 12]} />{M.cromo("#c9a24a")}</mesh>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * L, 0, 0]} rotation={[0, 0, a]}>
        <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.006, 0.006, 0.5, 6]} />{M.cromo()}</mesh>
        <group position={[0, -0.52, 0]}>
          <mesh geometry={lathe([[0, 0], [0.36, 0.02], [0.42, 0.07]])} castShadow receiveShadow>{M.cromo("#c9a24a")}</mesh>
          <group position={[0, 0.03, 0]}>{sd < 0 ? izq : der}</group>
        </group>
      </group>)}
    </group>
  </group>;
};
// tambo de 200 L azul con nivel de agua (nivel 0..1), corte = se ve el agua por una ventana
export const Tambo: React.FC<{ p?: V3; nivel: number; t: number; s?: number }> = ({ p, nivel, t, s = 1 }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.02 + 0.43 * nivel, 0]}><cylinderGeometry args={[0.39, 0.39, 0.86 * nivel + 0.001, 40]} />{M.liquido("#7fb4c9", 0.85)}</mesh>
    <mesh position={[0, 0.03 + 0.86 * nivel, 0]} rotation={[-P2, 0, 0]} visible={nivel > 0.02}><circleGeometry args={[0.39, 40]} /><meshPhysicalMaterial color="#a8d4e4" roughness={0.05} clearcoat={1} transparent opacity={0.8} /></mesh>
    <mesh position={[0, 0.46, 0]} castShadow receiveShadow><cylinderGeometry args={[0.42, 0.42, 0.92, 40, 1, true, 0.5, 5.3]} /><meshStandardMaterial color="#2a5fa8" roughness={0.45} side={THREE.DoubleSide} /></mesh>
    {[0.2, 0.46, 0.72].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.425, 0.012, 8, 40, 5.3]} /><meshStandardMaterial color="#244f8c" roughness={0.5} /></mesh>)}
    <mesh position={[0, 0.06 + 0.02 * Math.sin(t), 0]} visible={false}><boxGeometry /></mesh>
  </group>
);
// foco: encendido 0..1 (luz siempre montada, sólo cambia la intensidad)
export const Foco: React.FC<{ p: V3; on: number; led?: boolean; s?: number }> = ({ p, on, led, s = 1 }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.12, 0]}><sphereGeometry args={[0.16, 32, 20]} /><meshPhysicalMaterial color={led ? "#f4f6f8" : "#fff6dc"} emissive={led ? "#fff4e0" : "#ffb64a"} emissiveIntensity={0.05 + 2.4 * on} roughness={0.2} transmission={0.3} transparent opacity={0.95} /></mesh>
    <mesh position={[0, -0.06, 0]} castShadow><cylinderGeometry args={[0.07, 0.06, 0.14, 20]} />{M.cromo("#a9acb2")}</mesh>
    <pointLight position={[0, 0.12, 0.1]} intensity={0.01 + 2.5 * on} distance={3} color={led ? "#fff2dc" : "#ffb46a"} />
  </group>
);
export { cl };
