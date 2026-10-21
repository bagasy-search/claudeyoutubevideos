// hdcesq · ESTACIONES NUEVAS del patio para los minutos 2-16 (mismo mundo, misma cámara):
// la mesa de trabajo del frente con la RAMA en macro (nudos, yema, el corte, la raíz que sale del nudo, el hongo en la herida),
// el vaso de las "canillas" (hojas que gotean), el plato de canela, la miel, el frasco (sábila / sauce), la maceta grande EN CORTE
// (rosa honda, arena, raíces que crecen por debajo), la bolsa-invernadero (nubecita, horno, moho), el injerto del rosal,
// el palo de sauce que se vuelve árbol en la orilla, las 3 ramas de bugambilia, el romero y las macetas que se multiplican.
// Todo clavado a la voz con T (plan.ts). Render SÓLO en el farm.
import React, { useMemo } from "react";
import * as THREE from "three";
import { rbox } from "./fx3d";
import { T } from "./plan";

type V = [number, number, number];
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const w = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const hx = (a: string, b: string, k: number) => "#" + new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getHexString();
const pop = (t: number, a: number) => Math.min(1.1, Math.max(0, 1 - Math.exp(-Math.max(0, t - a) * 7) * Math.cos(Math.max(0, t - a) * 12)));
const inR = (t: number, a: number, b: number) => t >= a && t < b;

// ---------------- dónde está cada cosa ----------------
export const WT: V = [1.9, 0, 1.3];      // mesa de trabajo del frente
export const TY = 0.92;                   // tapa de la mesa
export const SY = 0.947;                  // eje de la rama acostada sobre la tabla
export const N1 = 1.69, N2 = 1.76, N3 = 1.83, X0 = 1.64, X1 = 1.9, XC = 1.68; // nudos, puntas y el corte (1 cm debajo del nudo)
export const GL: V = [2.2, TY, 1.25];     // vaso (canillas / potos)
export const PL: V = [2.45, TY, 1.42];    // plato de canela
export const HB: V = [2.6, TY, 1.18];     // miel
export const JA: V = [1.98, TY, 1.52];    // frasco (sábila / sauce)
export const CP: V = [1.0, 0, 1.95];      // maceta grande en corte
export const BG: V = [2.55, TY, 1.25];    // la bolsa-invernadero
export const STICK: V = [2.2, -0.3, -10.6]; // palo de sauce en el barro
export const RQ = {
  nodo: [N1, SY + 0.006, 1.3] as V, yema: [N1, SY + 0.012, 1.304] as V, corte: [XC, SY, 1.3] as V, stub: [1.655, SY, 1.3] as V,
  glass: [GL[0], TY + 0.17, GL[2]] as V, glassW: [GL[0], TY + 0.03, GL[2]] as V, plate: [PL[0], TY + 0.02, PL[2]] as V, honey: [HB[0], TY + 0.06, HB[2]] as V,
  jar: [JA[0], TY + 0.1, JA[2]] as V, pot: [CP[0], 0.15, CP[2] + 0.01] as V, potTop: [CP[0], 0.3, CP[2]] as V, bag: [BG[0], TY + 0.17, BG[2]] as V,
  graft: [-1.36, 0.6, -1.5] as V, sucker: [-1.27, 0.7, -1.4] as V, stick: [STICK[0], 0.4, STICK[2]] as V,
  b1: [1.76, SY, 1.24] as V, b2: [1.76, SY, 1.3] as V, b3: [1.76, SY, 1.36] as V,
};

// ---------------- piezas ----------------
const B: React.FC<{ p: V; s: V; c: string; r?: number; rot?: V; m?: number; rad?: number; map?: THREE.Texture }> = ({ p, s, c, r = 0.8, rot, m = 0, rad = 0.004, map }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} /></mesh>
);
const Tb: React.FC<{ pts: V[]; r: number; col: string; grow?: number; e?: string; ei?: number; seg?: number; rough?: number }> = ({ pts, r, col, grow = 1, e, ei = 0, seg = 24, rough = 0.7 }) => {
  const geo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q))), seg, r, 6, false), [pts.map((q) => q.join()).join("|"), r, seg]);
  const n = geo.index ? geo.index.count : 0;
  geo.setDrawRange(0, Math.floor((n * cl(grow)) / 36) * 36);
  if (grow <= 0.001) return null;
  return <mesh geometry={geo} castShadow><meshStandardMaterial color={col} roughness={rough} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>;
};
const Lf: React.FC<{ p: V; rot: V; s?: number; col: string; half?: number }> = ({ p, rot, s = 1, col, half = 0 }) => (
  <mesh position={p} rotation={rot} scale={[0.045 * s * (1 - 0.45 * half), 0.005 * s, 0.022 * s]} castShadow><sphereGeometry args={[1, 24, 12]} /><meshStandardMaterial color={col} roughness={0.55} /></mesh>
);
const Ball: React.FC<{ p: V; r: number; c: string; o?: number; e?: string; ei?: number; rough?: number }> = ({ p, r, c, o = 1, e, ei = 0, rough = 0.5 }) => (
  <mesh position={p} scale={r}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color={c} roughness={rough} transparent={o < 1} opacity={o} depthWrite={o >= 1} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
const Glass: React.FC<{ r: number; h: number; water: number; wc: string; wo?: number }> = ({ r, h, water, wc, wo = 0.3 }) => (
  <group>
    <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[r, r * 0.88, h, 32, 1, true]} /><meshPhysicalMaterial color="#e8f4ff" roughness={0.05} transparent opacity={0.2} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[r * 0.88, 32]} /><meshStandardMaterial color="#dfe9ef" transparent opacity={0.4} /></mesh>
    {water > 0.005 && <mesh position={[0, water / 2 + 0.003, 0]}><cylinderGeometry args={[r * 0.95, r * 0.86, water, 32]} /><meshStandardMaterial color={wc} transparent opacity={wo} roughness={0.08} depthWrite={false} /></mesh>}
  </group>
);
const mkTex = (draw: (g: CanvasRenderingContext2D) => void, n = 512) => { const cv = document.createElement("canvas"); cv.width = cv.height = n; draw(cv.getContext("2d")!); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

// ---------------- la mesa de trabajo + tabla de picar ----------------
const Mesa: React.FC = () => {
  const wood = useMemo(() => mkTex((g) => { g.fillStyle = "#9a6e44"; g.fillRect(0, 0, 512, 512); for (let k = 0; k < 70; k++) { g.strokeStyle = `rgba(60,35,15,${0.1 + rnd(k, 1) * 0.18})`; g.lineWidth = 1 + rnd(k, 2) * 3; g.beginPath(); const y = k * 7.3; g.moveTo(0, y); g.bezierCurveTo(170, y + 6 * rnd(k, 3), 340, y - 5, 512, y + 3); g.stroke(); } }), []);
  const board = useMemo(() => mkTex((g) => { g.fillStyle = "#d8b47e"; g.fillRect(0, 0, 512, 512); for (let k = 0; k < 90; k++) { g.strokeStyle = `rgba(150,100,50,${0.08 + rnd(k, 4) * 0.12})`; g.lineWidth = 1 + rnd(k, 5) * 2; g.beginPath(); const y = k * 5.7; g.moveTo(0, y); g.bezierCurveTo(170, y + 4, 340, y - 3, 512, y + 2); g.stroke(); } for (let k = 0; k < 40; k++) { g.strokeStyle = "rgba(90,60,30,.18)"; g.lineWidth = 1; g.beginPath(); const x = rnd(k, 6) * 512, y = rnd(k, 7) * 512; g.moveTo(x, y); g.lineTo(x + 30 + rnd(k, 8) * 60, y + (rnd(k, 9) - 0.5) * 20); g.stroke(); } }), []);
  return (
    <group>
      <B p={[WT[0], TY - 0.03, WT[2]]} s={[1.7, 0.06, 0.72]} c="#a87a4e" map={wood} rad={0.01} />
      {[[-0.78, -0.3], [0.78, -0.3], [-0.78, 0.3], [0.78, 0.3]].map(([x, z], i) => <B key={i} p={[WT[0] + x, (TY - 0.06) / 2, WT[2] + z]} s={[0.07, TY - 0.06, 0.07]} c="#6e4c2e" />)}
      <B p={[1.76, TY + 0.01, 1.3]} s={[0.36, 0.02, 0.24]} c="#e2c08a" r={0.7} map={board} rad={0.006} />
    </group>
  );
};

// ---------------- LA RAMA en macro (acostada sobre la tabla; la base a la izquierda) ----------------
const Rama: React.FC<{ t: number }> = ({ t }) => {
  // estados
  const glow = w(t, T.nodo - 0.2, T.nodo + 0.4) * (1 - w(t, T.cinco + 1, T.cinco + 1.6)) + w(t, T.cortaR, T.cortaR + 0.4) * (1 - w(t, T.cortaR + 4, T.cortaR + 5));
  const roots = w(t, T.raizNudo, T.raizNudo + 2.5) * (1 - w(t, T.cinco - 0.4, T.cinco)) + w(t, 920, 921) * 0;
  const rot = w(t, T.ablanda, T.ablanda + 3.5) * (t < 135 ? 1 : 0);
  const cutK = t < T.cortar - 0.2 ? 0 : t < T.cortaR - 1 ? w(t, T.cortar - 0.2, T.cortar + 0.25) : t < T.cortaR + 0.2 ? 0 : w(t, T.cortaR + 0.2, T.cortaR + 0.6);
  const cutDone = t > T.cortar + 0.25 && !(t > T.cortaR - 1 && t < T.cortaR + 0.6);
  const hyph = w(t, T.herida - 1.5, T.herida + 1.2) * (t < 165 ? 1 : 0) + w(t, T.canela - 0.6, T.canela + 0.8) * (1 - w(t, T.canela + 1.2, T.canela + 2.6)) * (t < 262 ? 1 : 0);
  const cin = t > 240 && t < 262 ? w(t, T.canela + 1.1, T.canela + 1.6) : 0;
  const honey = t > 285 && t < 330 ? (t < T.llorar ? w(t, T.curita, T.curita + 0.5) : w(t, T.poquita - 0.3, T.poquita + 0.3)) : 0;
  const sap = t > 290 && t < 312 ? w(t, T.llorar - 0.2, T.llorar + 1) : 0;
  const flower = t > 495 && t < 512 ? 1 : 0;
  const stubOff = cutDone ? w(t, T.cortar + 0.25, T.cortar + 1.0) : 0;
  const green = "#5d7f34", brown = "#7a5a32";
  const col = t > 495 && t < 530 ? "#6f6a33" : green;
  const st: V[] = [[X0, SY, 1.3], [1.66, SY + 0.0006, 1.3005], [XC, SY, 1.3]];
  const main: V[] = Array.from({ length: 9 }, (_, k) => { const x = lerp(XC, X1, k / 8); return [x, SY + Math.sin(k * 0.8) * 0.0007, 1.3 + Math.sin(k * 1.3) * 0.0006] as V; });
  return (
    <group>
      {/* el pedazo de abajo (5 cm del nudo): se ablanda y se pudre; con el corte sale volando a un costado */}
      <group position={[-0.03 * stubOff, 0.004 * Math.sin(stubOff * Math.PI), 0.02 * stubOff]} rotation={[0, 0.5 * stubOff, 0]}>
        <Tb pts={st} r={0.0036} col={hx(col, "#16100a", rot)} seg={10} rough={0.6 - 0.4 * rot} />
        {rot > 0.05 && Array.from({ length: 10 }, (_, i) => <Ball key={i} p={[lerp(X0, XC - 0.004, rnd(i, 1)), SY + 0.002 + rnd(i, 2) * 0.002, 1.3 + (rnd(i, 3) - 0.5) * 0.006]} r={0.0012 + 0.0012 * rnd(i, 4) * rot} c="#2a2018" o={0.8 * rot} rough={0.2} />)}
      </group>
      <Tb pts={main} r={0.0036} col={col} seg={30} />
      {/* el corte en diagonal: cara clara al final del tallo */}
      {cutDone && <mesh position={[XC - 0.0005, SY, 1.3]} rotation={[0, 0, Math.PI / 4]}><cylinderGeometry args={[0.0038, 0.0038, 0.0005, 18]} /><meshStandardMaterial color="#d9e0a0" roughness={0.6} emissive="#9fb050" emissiveIntensity={0.15} /></mesh>}
      {/* nudos: abultamiento + yema roja en la axila + rabito de la hoja */}
      {[N1, N2, N3].map((x, i) => (
        <group key={i} position={[x, SY, 1.3]}>
          <mesh scale={[0.0055, 0.0048, 0.0048]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={col} roughness={0.6} emissive={i === 0 ? "#d6ff7a" : "#000"} emissiveIntensity={i === 0 ? glow * 0.9 : 0} /></mesh>
          <mesh position={[0.0015, 0.0058, 0.002]} rotation={[0, 0, -0.5]} scale={[0.0022, 0.0034, 0.0022]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#b8323a" roughness={0.5} emissive="#ff6a6a" emissiveIntensity={i === 0 ? glow * 0.6 : 0} /></mesh>
          {i > 0 ? <Tb pts={[[0, 0.002, 0], [0.008, 0.01, 0.006], [0.02, 0.012, 0.01]]} r={0.0011} col={col} seg={6} /> : <mesh position={[0.002, 0.004, -0.003]} rotation={[0.6, 0, -0.6]}><cylinderGeometry args={[0.001, 0.0014, 0.005, 6]} /><meshStandardMaterial color={brown} /></mesh>}
          {i > 0 && <Lf p={[0.034, 0.013, 0.016 * (i === 1 ? 1 : -1)]} rot={[0.1, i === 1 ? -0.4 : 0.5, 0.05]} s={0.75} col="#3f7a32" />}
        </group>
      ))}
      {/* la raíz sale DEL NUDO */}
      {roots > 0.01 && Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2, L = 0.016 + rnd(i, 3) * 0.014;
        return <Tb key={i} pts={[[N1, SY, 1.3], [N1 - 0.003 + Math.cos(a) * 0.004, SY - 0.002, 1.3 + Math.sin(a) * 0.006], [N1 - 0.008 + Math.cos(a) * L * 0.5, SY - 0.004, 1.3 + Math.sin(a) * L], [N1 - 0.012 + Math.cos(a) * L, SY - 0.0045, 1.3 + Math.sin(a) * L * 1.3]]} r={0.0007} col="#f3ecd8" grow={cl(roots * 1.3 - i * 0.04)} e="#fff3d6" ei={0.4} seg={10} />; })}
      {/* hongo que entra por la herida */}
      {hyph > 0.01 && Array.from({ length: 26 }, (_, i) => { const a = rnd(i, 1) * 6.28, L = 0.004 + rnd(i, 2) * 0.012;
        return <Tb key={"h" + i} pts={[[XC - L, SY + Math.cos(a) * L * 0.8, 1.3 + Math.sin(a) * L], [XC - L * 0.4, SY + Math.cos(a) * 0.003, 1.3 + Math.sin(a) * 0.003], [XC + 0.002, SY + Math.cos(a) * 0.001, 1.3 + Math.sin(a) * 0.001]]} r={0.00028} col="#ece8dc" grow={cl(hyph * 1.4 - (i % 6) * 0.06)} e="#d8d0b8" ei={0.3} seg={8} />; })}
      {/* canela / miel en el centímetro de abajo */}
      {cin > 0.01 && <mesh position={[XC + 0.005, SY, 1.3]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.0041, 0.0041, 0.01 * cin, 16]} /><meshStandardMaterial color="#8a4f26" roughness={1} /></mesh>}
      {honey > 0.01 && <mesh position={[XC + 0.005, SY, 1.3]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.0042, 0.0044, 0.01 * honey, 18]} /><meshPhysicalMaterial color="#e3a326" roughness={0.08} transparent opacity={0.8} emissive="#b8740e" emissiveIntensity={0.3} /></mesh>}
      {/* la base "llora": gotas de savia */}
      {sap > 0.01 && Array.from({ length: 4 }, (_, i) => { const ph = ((t - T.llorar) * 0.6 + i * 0.25) % 1; return <Ball key={"s" + i} p={[XC - 0.002, SY - 0.002 - ph * 0.004, 1.3 + (i - 1.5) * 0.0015]} r={0.0012 * sap * (0.6 + ph)} c="#e9efc8" o={0.75} rough={0.05} />; })}
      {/* con flor: la fuerza sube a la flor */}
      {flower > 0 && <>
        <group position={[X1 + 0.012, SY + 0.004, 1.3]} scale={1.4}>{Array.from({ length: 10 }, (_, i) => { const a = (i * 2.4) % 6.28, rr = i < 4 ? 0.006 : 0.012; return <mesh key={i} position={[0.004, Math.cos(a) * rr, Math.sin(a) * rr]} rotation={[a, 0, 0.6]} scale={[0.006, 0.011, 0.009]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#e8578f" roughness={0.55} /></mesh>; })}</group>
        {Array.from({ length: 14 }, (_, i) => { const ph = ((t * 0.35 + i / 14) % 1); return <Ball key={"e" + i} p={[lerp(X0 + 0.01, X1 + 0.01, ph), SY + 0.0045, 1.3]} r={0.0016} c="#ffd860" e="#ffcf40" ei={1.2} />; })}
      </>}
      {/* la hoja de la tijera que corta en diagonal */}
      {cutK > 0.01 && cutK < 0.995 && <mesh position={[XC, SY + 0.05 * (1 - cutK), 1.3]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.0012, 0.06, 0.03]} /><meshStandardMaterial color="#cfd6dc" metalness={0.9} roughness={0.15} /></mesh>}
    </group>
  );
};

// tres largos (corta / justa / larga) y las 3 ramas de bugambilia (verde / semileñosa / vieja)
const TresRamas: React.FC<{ t: number; mode: "largo" | "buga" | "romero" }> = ({ t, mode }) => {
  if (mode === "romero") {
    const strip = w(t, T.deshoja - 4.5, T.deshoja - 1.5);
    return <group>
      <Tb pts={[[1.66, SY, 1.3], [1.73, SY + 0.001, 1.3], [1.78, SY, 1.301]]} r={0.0022} col="#8a7a52" seg={12} />
      {Array.from({ length: 60 }, (_, i) => { const x = lerp(1.66, 1.78, i / 60), gone = x < 1.70 ? cl(strip * 1.4 - (1.70 - x) * 8) : 0; if (gone > 0.98) return null;
        return <mesh key={i} position={[x, SY + 0.004 + gone * -0.003, 1.3 + (i % 2 ? 1 : -1) * (0.005 + gone * 0.01)]} rotation={[(i % 2 ? 1 : -1) * 0.9, 0, -0.4]} scale={[0.0011, 0.007, 0.0011]}><sphereGeometry args={[1, 6, 5]} /><meshStandardMaterial color="#4d6b4a" roughness={0.8} /></mesh>; })}
    </group>;
  }
  const L = mode === "largo" ? [0.06, 0.12, 0.25] : [0.17, 0.17, 0.17];
  const C = mode === "largo" ? ["#5d7f34", "#5d7f34", "#5d7f34"] : ["#7fb04a", "#8a7444", "#3e2a1c"];
  const R = mode === "largo" ? [0.0036, 0.0036, 0.0036] : [0.0032, 0.0042, 0.0062];
  const snap = mode === "buga" ? w(t, T.dobla + 1.2, T.dobla + 1.5) : 0;
  return <group>
    {[0, 1, 2].map((i) => { const z = 1.3 + (i - 1) * 0.06, x0 = 1.66, x1 = x0 + L[i];
      if (mode === "buga" && i === 1 && snap > 0) {
        const xm = (x0 + x1) / 2;
        return <group key={i}>
          <group position={[xm, SY, z]} rotation={[0, 0, 0.5 * snap]}><Tb pts={[[x0 - xm, 0, 0], [0, 0, 0]]} r={R[i]} col={C[i]} seg={6} /></group>
          <group position={[xm, SY, z]} rotation={[0, 0, -0.5 * snap]}><Tb pts={[[0, 0, 0], [x1 - xm, 0, 0]]} r={R[i]} col={C[i]} seg={6} /></group>
        </group>;
      }
      return <group key={i}>
        <Tb pts={[[x0, SY, z], [(x0 + x1) / 2, SY + 0.0006, z], [x1, SY, z]]} r={R[i]} col={C[i]} seg={12} />
        {[0.55, 0.85].map((u, q) => <Lf key={q} p={[lerp(x0, x1, u), SY + 0.004, z + (q ? 0.016 : -0.016)]} rot={[0.1, q ? 0.4 : -0.4, 0]} s={mode === "largo" ? 0.6 : 0.5} col={mode === "buga" && i === 0 ? "#6fa23e" : "#3f7a32"} />)}
      </group>; })}
  </group>;
};

// ---------------- el vaso: canillas / potos / agua sucia ----------------
const Vaso: React.FC<{ t: number }> = ({ t }) => {
  const mode = t < 215 ? "canilla" : t < 500 ? "potos" : t < 870 ? "potos2" : "sucia";
  const n = mode === "canilla" ? (t < T.dosHojas ? 10 : 2) : 3;
  const half = mode === "canilla" && t >= T.dosHojas ? w(t, T.dosHojas, T.dosHojas + 0.6) : 0;
  const drip = mode === "canilla" && t > T.canilla - 0.5 && t < T.dosHojas ? 1 : 0;
  const wilt = mode === "canilla" ? w(t, 193, 197.6) * (1 - w(t, T.dosHojas, T.dosHojas + 0.8)) : 0;
  const roots = mode === "potos" ? 0.55 : mode === "potos2" ? w(t, T.raices25, T.raices25 + 3) * 0.5 + 0.5 : 0.4;
  const murk = mode === "sucia" ? w(t, T.sopa - 3, T.sopa) : 0;
  const black = mode === "sucia" ? w(t, T.negra, T.negra + 0.8) : 0;
  const water = mode === "canilla" ? 0.07 : 0.03;
  const H = 0.24;
  const stem: V[] = mode === "canilla" ? [[0, 0.01, 0], [0.002, H * 0.5, 0], [0.004 + wilt * 0.03, H, 0]] : [[0, 0.01, 0], [0.006, 0.08, 0], [0.02, 0.14, 0.004], [0.045, 0.19, 0.01]];
  return (
    <group position={GL}>
      <Glass r={0.045} h={0.13} water={water} wc={hx("#cfe6f5", "#7f6a2a", murk)} wo={0.28 + 0.5 * murk} />
      <Tb pts={stem} r={0.0035} col={mode === "canilla" ? "#4f7a2e" : "#6aa04a"} seg={14} />
      {Array.from({ length: n }, (_, i) => { const y = mode === "canilla" ? 0.11 + (i / Math.max(1, n - 1)) * 0.12 * (n > 2 ? 1 : 0.4) + (n > 2 ? 0 : 0.09) : 0.1 + i * 0.035; const a = i * 2.3;
        const isBlack = mode === "sucia" && i === 0;
        return <Lf key={i} p={[Math.cos(a) * 0.028 + (mode === "canilla" ? 0 : i * 0.012), y - wilt * 0.02, Math.sin(a) * 0.028]} rot={[0, -a, -0.35 - wilt * 0.7]} s={mode === "canilla" ? 1.15 : 1.0} half={half} col={isBlack ? hx("#4f8a3a", "#1a140c", black) : hx("#3f7a32", "#7a6a30", wilt)} />; })}
      {drip > 0 && Array.from({ length: 10 }, (_, i) => { const a = i * 2.3, ph = ((t - T.canilla) * 0.9 + rnd(i, 4)) % 1, y = 0.11 + (i / 9) * 0.12;
        return <Ball key={"d" + i} p={[Math.cos(a) * 0.05, y - ph * 0.08, Math.sin(a) * 0.05]} r={0.0028 * (1 - ph * 0.3)} c="#bfe6ff" o={0.85 * (1 - ph)} rough={0.02} e="#7fc6ff" ei={0.3} />; })}
      {roots > 0.01 && mode !== "canilla" && Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * 6.28, L = 0.02 + rnd(i, 2) * 0.03 * roots;
        return <Tb key={"r" + i} pts={[[0.001, 0.025, 0], [Math.cos(a) * 0.012, 0.018, Math.sin(a) * 0.012], [Math.cos(a) * (0.012 + L * 0.6), 0.008, Math.sin(a) * (0.012 + L * 0.6)]]} r={0.0009} col="#f4f0e2" grow={cl(roots * 1.4 - i * 0.05)} e="#fff6e0" ei={0.25} seg={8} />; })}
    </group>
  );
};

// ---------------- plato de canela, miel, esqueje que se moja ----------------
const Cocina: React.FC<{ t: number }> = ({ t }) => {
  const plate = (t > 250 && t < 290) || (t > 676 && t < 690) || (t > 740 && t < 757) ? pop(t, t > 676 ? (t > 740 ? 742.6 : 677) : T.plato) : 0;
  const bowl = t > 280 && t < 330 ? pop(t, T.miel + 0.5) : 0;
  const ants = t > 306 && t < 316 ? w(t, T.mielMucha + 0.2, T.mielMucha + 1.2) : 0;
  return (
    <group>
      {plate > 0.01 && <group position={PL} scale={plate}>
        <mesh position={[0, 0.006, 0]} receiveShadow><cylinderGeometry args={[0.07, 0.05, 0.012, 32]} /><meshStandardMaterial color="#f4f2ec" roughness={0.3} /></mesh>
        <mesh position={[0, 0.016, 0]} scale={[1, 0.45, 1]}><coneGeometry args={[0.03, 0.03, 24]} /><meshStandardMaterial color="#8a4f26" roughness={1} /></mesh>
      </group>}
      {bowl > 0.01 && <group position={HB} scale={bowl}>
        <mesh position={[0, 0.025, 0]}><cylinderGeometry args={[0.045, 0.035, 0.05, 28, 1, true]} /><meshPhysicalMaterial color="#eef6ff" roughness={0.05} transparent opacity={0.25} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.042, 0.034, 0.036, 28]} /><meshPhysicalMaterial color="#e09a1c" roughness={0.06} transparent opacity={0.9} emissive="#b8740e" emissiveIntensity={0.35} /></mesh>
        {ants > 0.01 && Array.from({ length: 7 }, (_, i) => { const a = (t - T.mielMucha) * 0.7 + i * 0.9; return <group key={i} position={[Math.cos(a) * 0.055, 0.002, Math.sin(a) * 0.055]} rotation={[0, -a, 0]} scale={ants}>
          <Ball p={[0, 0.002, 0]} r={0.0025} c="#120c08" rough={0.3} /><Ball p={[0.004, 0.002, 0]} r={0.0018} c="#120c08" rough={0.3} /><Ball p={[-0.004, 0.002, 0]} r={0.003} c="#120c08" rough={0.3} /></group>; })}
      </group>}
    </group>
  );
};

// ---------------- el frasco: sábila (gel turbio) → sauce (ámbar) ----------------
const Frasco: React.FC<{ t: number }> = ({ t }) => {
  const sabila = t > 330 && t < 362, sauce = t > 378 && t < 545;
  const tint = sabila ? w(t, T.gel + 0.5, T.gel + 2.5) : 0;
  const amber = sauce ? w(t, T.pasarAgua + 3, T.frascoS) : 0;
  const pieces = sabila ? (t < T.remojo ? w(t, T.gel, T.gel + 1.5) : 0) : sauce ? (t < T.frascoS + 2 ? 1 : 0) : 0;
  const soak = (sabila && t > T.remojo) || (sauce && t > T.frascoS + 3) ? 1 : 0;
  const lid = sauce && t > 386 && t < T.frascoS ? 1 : 0;
  const wc = sabila ? hx("#cfe6f5", "#dfe8cf", tint) : hx("#cfe6f5", "#c89a3c", amber);
  return (
    <group position={JA}>
      <Glass r={0.055} h={0.17} water={0.13} wc={wc} wo={0.3 + 0.35 * Math.max(tint, amber)} />
      {lid > 0 && <mesh position={[0, 0.176, 0]}><cylinderGeometry args={[0.058, 0.058, 0.014, 28]} /><meshStandardMaterial color="#b8b2a4" metalness={0.7} roughness={0.3} /></mesh>}
      {pieces > 0.01 && Array.from({ length: sabila ? 14 : 24 }, (_, i) => { const y = 0.02 + rnd(i, 2) * 0.1, a = rnd(i, 3) * 6.28, r = rnd(i, 4) * 0.04;
        return sabila ? <Ball key={i} p={[Math.cos(a) * r, y, Math.sin(a) * r]} r={0.006 * pieces} c="#e8f2d8" o={0.7} rough={0.1} />
          : <mesh key={i} position={[Math.cos(a) * r, 0.01 + rnd(i, 5) * 0.11, Math.sin(a) * r]} rotation={[rnd(i, 6) * 3, rnd(i, 7) * 3, rnd(i, 8) * 3]}><cylinderGeometry args={[0.0028, 0.0028, 0.035, 6]} /><meshStandardMaterial color={rnd(i, 9) > 0.4 ? "#7f9a3c" : "#9a8a4a"} roughness={0.8} /></mesh>; })}
      {soak > 0 && <group>
        {[0, 1, 2].map((i) => <Tb key={i} pts={[[(i - 1) * 0.018, 0.01, 0], [(i - 1) * 0.02, 0.15, 0.002], [(i - 1) * 0.024, 0.27, 0.004]]} r={0.0034} col={t > 530 ? "#6f6a33" : "#4f7a2e"} seg={10} />)}
        {[0, 1, 2].map((i) => <Lf key={"l" + i} p={[(i - 1) * 0.024 + 0.02, 0.25, 0.004]} rot={[0, i, -0.3]} s={0.7} col="#3f7a32" />)}
      </group>}
    </group>
  );
};

// ---------------- la maceta grande EN CORTE ----------------
type Cut = { x: number; top: number; depth: number; col: string; roots: number; leaves?: number };
const Maceta: React.FC<{ t: number }> = ({ t }) => {
  const R = 0.2, H = 0.3;
  const sandy = (t > 540 && t < 560) || (t > 690 && t < 712) || (t > 742 && t < 775) || (t > 845 && t < 872);
  const soil = useMemo(() => mkTex((g) => { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#2a1a10"); gr.addColorStop(0.2, "#3d2818"); gr.addColorStop(1, "#5a3e28"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 2600; i++) { const v = rnd(i, 1); g.fillStyle = v < 0.04 ? "rgba(240,236,226,.9)" : `rgba(${20 + v * 40},${12 + v * 25},${6 + v * 12},.55)`; g.beginPath(); g.arc(rnd(i, 2) * 512, rnd(i, 3) * 512, 0.6 + rnd(i, 5) * 1.8, 0, 6.3); g.fill(); } }), []);
  const sand = useMemo(() => mkTex((g) => { g.fillStyle = "#5a4430"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 6000; i++) { const v = rnd(i, 1); g.fillStyle = v < 0.5 ? `rgba(${200 + v * 50},${170 + v * 50},${120 + v * 40},.85)` : `rgba(${30 + v * 30},${20 + v * 20},${10 + v * 10},.6)`; g.beginPath(); g.arc(rnd(i, 2) * 512, rnd(i, 3) * 512, 1 + rnd(i, 4) * 2.5, 0, 6.3); g.fill(); } }), []);
  const map = sandy ? sand : soil;
  const face = useMemo(() => { const sh = new THREE.Shape(); sh.moveTo(-R * 0.78 + 0.008, 0.008); sh.lineTo(R * 0.78 - 0.008, 0.008); sh.lineTo(R - 0.01, H - 0.03); sh.lineTo(-R + 0.01, H - 0.03); sh.closePath();
    const g = new THREE.ShapeGeometry(sh), uv = g.attributes.uv, ps = g.attributes.position; // UV 0..1 en toda la cara (si no, la textura se estira en rayas)
    for (let k = 0; k < uv.count; k++) uv.setXY(k, (ps.getX(k) + R) / (2 * R), ps.getY(k) / H);
    uv.needsUpdate = true; return g; }, []);
  // qué hay plantado
  let cuts: Cut[] = [];
  if (t < 300) cuts = [{ x: 0, top: 0.22, depth: 0.06, col: "#4f7a2e", roots: 0 }];
  else if (t < 430) cuts = [{ x: 0, top: 0.24, depth: 0.08, col: "#4f7a2e", roots: w(t, T.riegaS, T.riegaS + 4) * 0.5 }];
  else if (t < 480) cuts = [{ x: 0, top: 0.25, depth: 0.1, col: "#6f6a33", roots: w(t, T.terminan, T.terminan + 3) }];
  else if (t < 600) { const n = t > T.tres ? 4 : 1; cuts = Array.from({ length: n }, (_, i) => ({ x: [0, -0.1, 0.1, 0.05][i], top: 0.16, depth: 0.2, col: "#6f6a33", roots: t > T.semanas8 ? w(t, T.semanas8, T.semanas8 + 4) * (i === 0 ? 1 : 0.6) : 0, leaves: 2 })); }
  else if (t < 730) cuts = [{ x: 0, top: 0.14, depth: 0.1, col: "#8a7444", roots: 0.2 }];
  else if (t < 800) cuts = [{ x: 0, top: 0.1, depth: 0.04, col: "#6a8a52", roots: w(t, T.romRaiz, T.romRaiz + 4) }];
  else if (t < 875) cuts = [{ x: 0, top: 0.12, depth: 0.05, col: "#6aa04a", roots: 0.7 }];
  else cuts = [{ x: 0, top: 0.16, depth: 0.2, col: "#6f6a33", roots: w(t, T.porDebajo - 2, T.porDebajo + 4) }];
  const puddle = t > 418 && t < 424 ? w(t, T.charco, T.charco + 0.6) : 0;
  const drain = (t > T.arenaB - 0.5 && t < T.arenaB + 6) ? 1 : 0;
  const water = t > T.riegaS && t < T.riegaS + 4 ? 1 : 0;
  return (
    <group position={CP}>
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow><cylinderGeometry args={[R, R * 0.78, H, 40, 1, true, Math.PI / 2, Math.PI]} /><meshStandardMaterial color="#b4643c" roughness={0.85} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, H - 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[R + 0.008, 0.015, 10, 48, Math.PI]} /><meshStandardMaterial color="#a85a35" roughness={0.85} /></mesh>
      <mesh position={[0, H - 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[R - 0.008, 40, 0, Math.PI]} /><meshStandardMaterial color={sandy ? "#7a6448" : "#3a2616"} roughness={1} map={map} /></mesh>
      <mesh geometry={face}><meshStandardMaterial map={map} roughness={1} color="#d8c8b8" /></mesh>
      {[-1, 1].map((sx) => <mesh key={sx} position={[sx * (R * 0.89), H / 2, 0]} rotation={[0, 0, sx * -0.25]}><boxGeometry args={[0.02, H, 0.004]} /><meshStandardMaterial color="#c97a50" roughness={0.9} /></mesh>)}
      {puddle > 0.01 && <mesh position={[0, H - 0.026, -0.03]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[R * 0.8 * puddle, 32, 0, Math.PI]} /><meshStandardMaterial color="#6f8a9a" roughness={0.02} metalness={0.3} transparent opacity={0.75} /></mesh>}
      {(drain > 0 || water > 0) && Array.from({ length: 22 }, (_, i) => { const ph = ((t * 0.5 + rnd(i, 1)) % 1); return <Ball key={"w" + i} p={[(rnd(i, 2) - 0.5) * 0.25, H - 0.04 - ph * (H - 0.05), 0.006]} r={0.004} c="#9fd4ff" o={0.8 * (1 - ph * 0.5)} rough={0.02} e="#5fb0ff" ei={0.4} />; })}
      {cuts.map((c, i) => { const yb = H - 0.03 - c.depth;
        return <group key={i}>
          <Tb pts={[[c.x, yb, 0.0], [c.x + 0.002, (yb + c.top + H) / 2 - 0.05, 0.0], [c.x + 0.004, H - 0.03 + c.top, 0.0]]} r={0.0045} col={c.col} seg={14} />
          {[0.3, 0.62].map((u) => <mesh key={u} position={[c.x + 0.001, lerp(yb, H - 0.03 + c.top, u), 0.0]} scale={[0.0065, 0.006, 0.006]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={c.col} roughness={0.6} /></mesh>)}
          {[0, 1].slice(0, c.leaves ?? 2).map((q) => <Lf key={q} p={[c.x + (q ? 0.03 : -0.03), H - 0.03 + c.top * 0.92, 0.0]} rot={[0, q * 3.1, -0.35]} s={1.0} col="#3f7a32" />)}
          {c.roots > 0.01 && Array.from({ length: 10 }, (_, k) => { const d = (rnd(i * 10 + k, 2) - 0.5) * 2, L = 0.05 + rnd(i * 10 + k, 3) * 0.06;
            return <Tb key={"r" + k} pts={[[c.x, yb + 0.004, 0.006], [c.x + d * 0.015, yb - L * 0.35, 0.006], [c.x + d * 0.04, yb - L * 0.7, 0.007], [c.x + d * 0.05, Math.max(0.015, yb - L), 0.007]]} r={0.0016} col="#f3ecd8" grow={cl(c.roots * 1.3 - (k % 4) * 0.08)} e="#fff3d6" ei={0.35} seg={14} />; })}
        </group>; })}
    </group>
  );
};

// ---------------- la bolsa-invernadero ----------------
const Bolsa: React.FC<{ t: number }> = ({ t }) => {
  const bag = w(t, T.invernadero, T.invernadero + 0.8) * (t < 960 ? 1 : 1);
  const fog = t < 870 ? w(t, T.nube, T.nube + 2.5) * (1 - w(t, T.abreB - 0.2, T.abreB + 0.5) * 0) : w(t, T.cierra, T.cierra + 3);
  const heat = w(t, T.horno, T.cocina + 1) * (t < 823 ? 1 : 0);
  const mold = t > 870 && t < 892 ? w(t, T.hongoB - 1, T.hongoB + 1.5) : 0;
  const drops = t > 890 && t < 902 ? w(t, T.gotas, T.gotas + 0.8) : mold;
  const open = t > 891 && t < 905 ? w(t, T.abreB, T.abreB + 0.6) * (1 - w(t, T.gotas + 2, T.gotas + 3)) : 0;
  const holes = t > 822 && t < 870 || t > 950;
  const leafC = hx("#3f7a32", "#6e5a2a", heat);
  return (
    <group position={BG}>
      <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.07, 0.055, 0.09, 28]} /><meshStandardMaterial color="#b4643c" roughness={0.85} /></mesh>
      <mesh position={[0, 0.089, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.066, 28]} /><meshStandardMaterial color="#3a2616" roughness={1} /></mesh>
      {[-0.025, 0.0, 0.025].map((x, i) => <group key={i}>
        <Tb pts={[[x, 0.07, (i - 1) * 0.01], [x + 0.002, 0.14, (i - 1) * 0.01], [x + 0.004, 0.2, (i - 1) * 0.012]]} r={0.003} col={mold > 0.2 && i === 1 ? hx("#4f7a2e", "#16100a", mold) : "#4f7a2e"} seg={10} />
        <Lf p={[x + 0.018, 0.19 - heat * 0.01, (i - 1) * 0.012]} rot={[0, i * 1.7, -0.3 - heat * 0.6]} s={0.65} col={leafC} />
      </group>)}
      {bag > 0.01 && <>
        <mesh position={[0.05, 0.16, 0]}><cylinderGeometry args={[0.002, 0.002, 0.2, 6]} /><meshStandardMaterial color="#a8844e" /></mesh>
        <group position={[0, 0.09 + 0.12 * open, 0]} rotation={[0, 0, -0.5 * open]}>
          <mesh position={[0, 0.06, 0]} scale={[0.085 * bag, 0.17 * bag, 0.085 * bag]}><sphereGeometry args={[1, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.62]} /><meshPhysicalMaterial color="#f4f8ff" roughness={0.15} transparent opacity={0.16 + 0.22 * fog} side={THREE.DoubleSide} depthWrite={false} /></mesh>
          {holes && [0, 1, 2].map((i) => <Ball key={i} p={[Math.cos(i * 0.8 + 0.4) * 0.06, 0.17, Math.sin(i * 0.8 + 0.4) * 0.06]} r={0.0022} c="#20262a" />)}
        </group>
        <mesh position={[0, 0.082, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.071, 0.0025, 8, 32]} /><meshStandardMaterial color="#c8402f" roughness={0.6} /></mesh>
        {fog > 0.02 && open < 0.5 && Array.from({ length: 30 }, (_, i) => { const a = rnd(i, 1) * 6.28, r = rnd(i, 2) * 0.06, y = 0.1 + rnd(i, 3) * 0.14 + Math.sin(t * 0.6 + i) * 0.005;
          return <Ball key={"f" + i} p={[Math.cos(a) * r, y, Math.sin(a) * r]} r={0.018 + 0.012 * rnd(i, 4)} c={mold > 0.3 ? "#cfd2c0" : "#ffffff"} o={0.09 * fog} rough={1} />; })}
        {drops > 0.02 && Array.from({ length: 16 }, (_, i) => { const a = rnd(i, 5) * 6.28, ph = rnd(i, 6); return <Ball key={"d" + i} p={[Math.cos(a) * 0.08 * Math.sin(0.4 + ph * 1.4), 0.12 + ph * 0.1, Math.sin(a) * 0.08 * Math.sin(0.4 + ph * 1.4)]} r={0.0045 * drops} c="#dff2ff" o={0.7} rough={0.02} />; })}
        {mold > 0.02 && Array.from({ length: 18 }, (_, i) => <Ball key={"m" + i} p={[(rnd(i, 7) - 0.5) * 0.02, 0.095 + rnd(i, 8) * 0.04, (rnd(i, 9) - 0.5) * 0.02]} r={0.004 + 0.004 * rnd(i, 1) * mold} c="#e8e6dc" o={0.6 * mold} rough={1} />)}
      </>}
    </group>
  );
};

// ---------------- el injerto del rosal (la bola + el chupón del pie) ----------------
const Injerto: React.FC<{ t: number }> = ({ t }) => {
  const k = w(t, T.injerto, T.injerto + 1), red = w(t, T.debajo + 0.3, T.debajo + 0.9);
  return <group>
    <mesh position={RQ.graft} scale={[0.06 * k, 0.045 * k, 0.06 * k]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#6a5236" roughness={0.95} /></mesh>
    <Tb pts={[[-1.36, 0.58, -1.5], [-1.3, 0.63, -1.42], [-1.25, 0.76, -1.36], [-1.23, 0.92, -1.34]]} r={0.006} col={hx("#7aa05a", "#c8402f", red)} grow={k} e="#ff3a2a" ei={red * 0.6} seg={16} />
    {k > 0.5 && [0.7, 0.8, 0.9].map((y, i) => <Lf key={i} p={[-1.25 + i * 0.01, y, -1.35]} rot={[0, i * 2, -0.3]} s={0.9} col="#8ab86a" />)}
  </group>;
};

// ---------------- el palo de sauce clavado en el barro → árbol (timelapse) ----------------
const PaloSauce: React.FC<{ t: number }> = ({ t }) => {
  const g = w(t, T.palo - 0.5, T.pasarAgua + 1.5);
  return <group position={STICK}>
    <mesh position={[0, 0.35 + g * 0.3, 0]}><cylinderGeometry args={[0.025 + g * 0.05, 0.035 + g * 0.07, 0.7 + g * 0.6, 10]} /><meshStandardMaterial color="#6a5a40" roughness={1} /></mesh>
    {Array.from({ length: 40 }, (_, i) => { const a = rnd(i, 1) * 6.28, r = (0.05 + rnd(i, 2) * 0.5) * g, y = 0.65 + g * 0.6 + rnd(i, 3) * 0.5 * g; const s = cl(g * 1.6 - rnd(i, 4) * 0.6);
      return s > 0.02 ? <Tb key={i} pts={[[Math.cos(a) * r * 0.3, y, Math.sin(a) * r * 0.3], [Math.cos(a) * r, y - 0.1, Math.sin(a) * r], [Math.cos(a) * r * 1.1, y - 0.5 * s, Math.sin(a) * r * 1.1]]} r={0.008} col="#8fae4a" grow={s} seg={10} /> : null; })}
    {g > 0.1 && <mesh position={[0, 1.05 + g * 0.6, 0]} scale={[0.6 * g, 0.35 * g, 0.6 * g]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#86a640" roughness={0.9} /></mesh>}
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * 6.28; return <Tb key={"r" + i} pts={[[0, 0.02, 0], [Math.cos(a) * 0.1, 0.0, Math.sin(a) * 0.1], [Math.cos(a) * 0.25, -0.02, Math.sin(a) * 0.25]]} r={0.006} col="#e8dcc0" grow={cl(g * 1.5 - 0.2)} seg={8} />; })}
  </group>;
};

// ---------------- macetas que se multiplican ("cada rama es una planta más") + el rosal nuevo que florea ----------------
const Multiplica: React.FC<{ t: number }> = ({ t }) => (
  <group>
    {Array.from({ length: 24 }, (_, i) => { const k = pop(t, T.masPlantas + i * 0.09); if (k < 0.01) return null; const x = -3.7 + (i % 4) * 0.5, z = -1.25 + Math.floor(i / 4) * 0.6;
      return <group key={i} position={[x, 0, z]} scale={k}>
        <mesh position={[0, 0.07, 0]} castShadow><cylinderGeometry args={[0.1, 0.075, 0.14, 20]} /><meshStandardMaterial color="#b4643c" roughness={0.85} /></mesh>
        {Array.from({ length: 6 }, (_, q) => <Lf key={q} p={[Math.cos(q) * 0.04, 0.17 + q * 0.015, Math.sin(q) * 0.04]} rot={[0, q, -0.5]} s={1.4} col={["#3f7a32", "#4f8a3a", "#5a9a3e"][i % 3]} />)}
        {i % 3 === 0 && <Ball p={[0, 0.26, 0]} r={0.022} c={["#e8578f", "#c21a72", "#a99be0"][i % 9 / 3 | 0]} />}
      </group>; })}
  </group>
);
const RosaNueva: React.FC<{ t: number }> = ({ t }) => {
  const f = w(t, T.florea, T.florea + 2.5);
  return <group position={[-0.75, 0, -0.95]}>
    <mesh position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.13, 0.1, 0.18, 24]} /><meshStandardMaterial color="#b4643c" roughness={0.85} /></mesh>
    {[0, 1, 2, 3].map((i) => <Tb key={i} pts={[[(i - 1.5) * 0.03, 0.17, 0], [(i - 1.5) * 0.05, 0.35, (i % 2) * 0.03], [(i - 1.5) * 0.07, 0.5 + i * 0.03, (i % 2) * 0.05]]} r={0.005} col="#5d7f34" seg={10} />)}
    {Array.from({ length: 14 }, (_, i) => <Lf key={i} p={[(rnd(i, 1) - 0.5) * 0.2, 0.3 + rnd(i, 2) * 0.25, (rnd(i, 3) - 0.5) * 0.12]} rot={[0, rnd(i, 4) * 6, -0.4]} s={1.3} col="#3f7a32" />)}
    {Array.from({ length: 7 }, (_, i) => { const k = cl(f * 2 - i * 0.12); return k > 0.02 ? <group key={"f" + i} position={[(rnd(i, 5) - 0.5) * 0.22, 0.45 + rnd(i, 6) * 0.15, (rnd(i, 7) - 0.5) * 0.12]} scale={k * 1.6}>
      {Array.from({ length: 9 }, (_, q) => { const a = (q * 2.4) % 6.28, rr = q < 4 ? 0.008 : 0.016; return <mesh key={q} position={[Math.cos(a) * rr, 0.004, Math.sin(a) * rr]} rotation={[Math.sin(a) * 0.6, a, Math.cos(a) * 0.6]} scale={[0.012, 0.014, 0.005]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#e8578f" roughness={0.55} /></mesh>; })}
    </group> : null; })}
  </group>;
};

// ---------------- todo junto (sólo lo que toca en cada momento, para que el render vuele) ----------------
export const Stations: React.FC<{ t: number }> = ({ t }) => {
  if (t < 101) return null;
  const ramaOn = inR(t, 101, 162) || inR(t, 240, 330) || inR(t, 495, 530) || inR(t, 926, 940);
  const tres = inR(t, 162, 182) ? "largo" : inR(t, 640, 676) ? "buga" : inR(t, 740, 760) ? "romero" : null;
  return (
    <group>
      <Mesa />
      {ramaOn && !tres && <Rama t={t} />}
      {tres && <TresRamas t={t} mode={tres} />}
      {(inR(t, 180, 230) || inR(t, 425, 500) || inR(t, 676, 690) || inR(t, 826, 870) || inR(t, 920, 935)) && <Vaso t={t} />}
      <Cocina t={t} />
      {(inR(t, 328, 365) || inR(t, 376, 545) || inR(t, 676, 690) || inR(t, 950, 960)) && <Frasco t={t} />}
      <Maceta t={t} />
      {inR(t, 774, 970) && <Bolsa t={t} />}
      {inR(t, 555, 600) && <Injerto t={t} />}
      {inR(t, 360, 395) && <PaloSauce t={t} />}
      {inR(t, 625, 645) && <Multiplica t={t} />}
      {t > 960 && <RosaNueva t={t} />}
    </group>
  );
};
