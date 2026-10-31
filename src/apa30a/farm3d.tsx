// apa30 · EL MUNDO del canal: la granja del almanaque en 3D (maqueta low-poly con materiales gastados), tres lugares en una
// sola escena y una sola cámara que viaja en curva entre ellos:
//   HUERTA (x≈0): canteros de madera con lechuga, el pasto con lomos de topo y montículos, la pared del granero rojo, la pala,
//                 el balde, la tabla sobre el pozo y un CORTE de suelo al frente que muestra el túnel y la lata a ras del piso.
//   GRANERO (x≈14): paredes de tabla, fardos, cajones de alimento, el balde con la lata que gira y la rampa contra la pared,
//                 haces de sol entre las tablas con polvo que flota.
//   GALLINERO (x≈-14): el gallinero sobre patas, el corral, el comedero colgado, el roble, y un CORTE de tierra al frente con la
//                 malla de 1/2" en L enterrada y una cueva de rata que choca contra ella.
// Nada de texto en 3D. Render SÓLO en el farm (acá sólo stills).
import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";

export const W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];
const v3 = (a: V3) => new THREE.Vector3(...a);

// ---------- texturas propias (deterministas) ----------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useFarmTex = () => React.useMemo(() => ({
  grass: mk(512, 512, (g) => {
    g.fillStyle = "#4f6b2e"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5000; i++) { const v = rnd(i, 1); g.strokeStyle = `rgba(${70 + v * 60},${100 + v * 70},${30 + v * 25},.55)`; g.lineWidth = 1; const x = rnd(i, 2) * 512, y = rnd(i, 3) * 512; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd(i, 4) - 0.5) * 4, y - 4 - rnd(i, 5) * 6); g.stroke(); }
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(110,90,50,${0.12 * rnd(i, 6)})`; g.beginPath(); g.arc(rnd(i, 7) * 512, rnd(i, 8) * 512, 10 + rnd(i, 9) * 30, 0, 6.3); g.fill(); }
  }, [8, 8]),
  soil: mk(256, 256, (g) => {
    g.fillStyle = "#3a2a1c"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) { const v = 40 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v + 20},${v},${v - 15},.6)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 1 + rnd(i, 4) * 3, 1 + rnd(i, 5) * 3); }
    for (let i = 0; i < 18; i++) { g.strokeStyle = "rgba(200,170,130,.25)"; g.lineWidth = 1; g.beginPath(); const x = rnd(i, 6) * 256, y = rnd(i, 7) * 256; g.moveTo(x, y); g.bezierCurveTo(x + 20, y + 8, x + 30, y + 22, x + 46, y + 18); g.stroke(); }
  }, [3, 2]),
  strata: mk(256, 512, (g) => {
    const bands = ["#4a6b2a", "#3a2a1c", "#4a3424", "#5a4330", "#6b5238", "#7a6346"];
    const hs = [16, 90, 110, 120, 100, 76]; let y = 0;
    bands.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, y, 256, hs[i]); y += hs[i]; });
    for (let i = 0; i < 2600; i++) { const v = rnd(i, 1); g.fillStyle = `rgba(${30 + v * 80},${20 + v * 60},${10 + v * 40},.45)`; g.fillRect(rnd(i, 2) * 256, 16 + rnd(i, 3) * 496, 1 + v * 3, 1 + v * 2); }
    for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(150,130,110,${0.5 + 0.4 * rnd(i, 4)})`; g.beginPath(); g.ellipse(rnd(i, 5) * 256, 140 + rnd(i, 6) * 360, 3 + rnd(i, 7) * 7, 2 + rnd(i, 8) * 5, rnd(i, 9) * 3, 0, 6.3); g.fill(); }
    for (let i = 0; i < 30; i++) { g.strokeStyle = "rgba(205,170,120,.45)"; g.lineWidth = 1.2; g.beginPath(); const x = rnd(i, 10) * 256, yy = 20 + rnd(i, 11) * 180; g.moveTo(x, yy); g.bezierCurveTo(x + 6, yy + 20, x - 8, yy + 40, x + 4, yy + 60 + rnd(i, 12) * 40); g.stroke(); }
  }),
  barnRed: mk(512, 512, (g) => {
    for (let c = 0; c < 16; c++) { const v = rnd(c, 1); g.fillStyle = `rgb(${120 + v * 30},${32 + v * 10},${26 + v * 8})`; g.fillRect(c * 32, 0, 32, 512); g.fillStyle = "rgba(20,8,6,.6)"; g.fillRect(c * 32, 0, 2, 512); }
    for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(200,170,150,${0.15 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 512, rnd(i, 4) * 512, 1 + rnd(i, 5) * 10, 1); }
  }, [2, 1]),
  gray: mk(512, 512, (g) => {
    for (let c = 0; c < 10; c++) { const v = rnd(c, 4); g.fillStyle = `rgb(${110 + v * 30},${96 + v * 26},${78 + v * 20})`; g.fillRect(c * 52, 0, 52, 512); g.fillStyle = "rgba(20,14,8,.7)"; g.fillRect(c * 52, 0, 3, 512); }
    for (let i = 0; i < 1600; i++) { g.strokeStyle = `rgba(40,28,16,${0.1 + 0.15 * rnd(i, 1)})`; g.lineWidth = 1; const x = rnd(i, 2) * 512, y = rnd(i, 3) * 512; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd(i, 6) - 0.5) * 2, y + 10 + rnd(i, 7) * 30); g.stroke(); }
  }, [2, 1]),
  hay: mk(256, 256, (g) => {
    g.fillStyle = "#c9a65a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1800; i++) { const v = rnd(i, 1); g.strokeStyle = `rgba(${150 + v * 90},${120 + v * 70},${40 + v * 40},.7)`; g.lineWidth = 1; const x = rnd(i, 2) * 256, y = rnd(i, 3) * 256, a = (rnd(i, 4) - 0.5) * 0.8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14); g.stroke(); }
  }, [1, 1]),
  bark: mk(128, 256, (g) => {
    g.fillStyle = "#4a3a2c"; g.fillRect(0, 0, 128, 256);
    for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(20,14,10,${0.4 + 0.4 * rnd(i, 1)})`; g.lineWidth = 2 + rnd(i, 2) * 3; const x = rnd(i, 3) * 128; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 6, 80, x - 6, 170, x + 3, 256); g.stroke(); }
  }, [3, 2]),
  mesh: mk(256, 256, (g) => {
    g.clearRect(0, 0, 256, 256); g.strokeStyle = "#c9ccd0"; g.lineWidth = 3;
    for (let k = 0; k <= 256; k += 16) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 256); g.stroke(); g.beginPath(); g.moveTo(0, k); g.lineTo(256, k); g.stroke(); }
  }, [6, 2]),
  hex: mk(256, 256, (g) => {
    g.clearRect(0, 0, 256, 256); g.strokeStyle = "#b9bcc0"; g.lineWidth = 2;
    const r = 18; for (let y = 0; y < 300; y += r * 1.5) for (let x = 0; x < 300; x += r * 1.73) { const ox = (Math.round(y / (r * 1.5)) % 2) * r * 0.86; g.beginPath(); for (let k = 0; k < 7; k++) { const a = Math.PI / 6 + k * Math.PI / 3; g.lineTo(x + ox + r * Math.cos(a), y + r * Math.sin(a)); } g.stroke(); }
  }, [6, 2]),
  label: mk(256, 128, (g) => {
    g.fillStyle = "#c22a26"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#e8e2d6"; g.fillRect(0, 54, 256, 20);
    g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(0, 10, 256, 6);
  }),
}), []);

// ---------- piezas básicas ----------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c?: string; r?: number; m?: number; map?: Tx; rad?: number; rot?: V3; e?: string; ei?: number; cs?: boolean }> = ({ p, s, c = "#ffffff", r = 0.75, m = 0, map, rad = 0.012, rot, e, ei = 0, cs = true }) => (
  <mesh position={p} rotation={rot} castShadow={cs} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e} emissiveIntensity={ei} />
  </mesh>
);
const Cyl: React.FC<{ p: V3; r1: number; r2?: number; h: number; c: string; rough?: number; m?: number; rot?: V3; seg?: number; open?: boolean; side?: THREE.Side; map?: Tx }> = ({ p, r1, r2, h, c, rough = 0.6, m = 0, rot, seg = 28, open, side, map }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow>
    <cylinderGeometry args={[r1, r2 ?? r1, h, seg, 1, open]} />
    <meshStandardMaterial color={c} roughness={rough} metalness={m} side={side} map={map} />
  </mesh>
);
// balde galvanizado / plástico
const Bucket: React.FC<{ p: V3; c?: string; metal?: boolean; s?: number }> = ({ p, c = "#f1efe9", metal, s = 1 }) => (
  <group position={p} scale={s}>
    <Cyl p={[0, 0.19, 0]} r1={0.15} r2={0.13} h={0.38} c={metal ? "#a9aeb2" : c} rough={metal ? 0.35 : 0.55} m={metal ? 0.8 : 0} open side={THREE.DoubleSide} />
    <Cyl p={[0, 0.005, 0]} r1={0.13} h={0.01} c={metal ? "#9aa0a4" : c} />
    <mesh position={[0, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.151, 0.008, 8, 40]} /><meshStandardMaterial color={metal ? "#c0c5c9" : "#e9e6de"} roughness={0.4} metalness={metal ? 0.8 : 0} /></mesh>
  </group>
);
// lomo de topo: tubo de tierra semi-enterrado que sigue una curva
const Ridge: React.FC<{ pts: [number, number][]; y?: number; map?: Tx; r?: number }> = ({ pts, y = 0, map, r = 0.05 }) => {
  const geo = React.useMemo(() => {
    const c = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, y, z)));
    return new THREE.TubeGeometry(c, 60, r, 8, false);
  }, [pts, y, r]);
  return <mesh geometry={geo} scale={[1, 0.55, 1]} castShadow receiveShadow><meshStandardMaterial color="#5a4632" map={map} roughness={0.95} /></mesh>;
};
const Mound: React.FC<{ p: V3; s?: number; map?: Tx }> = ({ p, s = 1, map }) => (
  <mesh position={p} scale={[s, s * 0.55, s]} castShadow receiveShadow><sphereGeometry args={[0.16, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#3b2a1c" map={map} roughness={1} /></mesh>
);
const Flag: React.FC<{ p: V3; t: number; i: number }> = ({ p, t, i }) => (
  <group position={p}>
    <Cyl p={[0, 0.18, 0]} r1={0.004} h={0.36} c="#9aa0a4" m={0.7} rough={0.4} seg={6} />
    <mesh position={[0.045, 0.33, 0]} rotation={[0, Math.sin(t * 2.1 + i) * 0.35, 0]}><planeGeometry args={[0.09, 0.06]} /><meshStandardMaterial color="#ff6a1a" side={THREE.DoubleSide} roughness={0.7} /></mesh>
  </group>
);
// lechuga low-poly: hojas en roseta
const Lettuce: React.FC<{ p: V3; s?: number; seed?: number }> = ({ p, s = 1, seed = 0 }) => (
  <group position={p} scale={s}>
    {Array.from({ length: 9 }, (_, k) => { const a = k * 2.4 + seed; const rr = 0.04 + (k % 3) * 0.02; return (
      <mesh key={k} position={[Math.cos(a) * rr, 0.04 + (k % 3) * 0.015, Math.sin(a) * rr]} rotation={[0.9 - (k % 3) * 0.25, a, 0]} castShadow>
        <sphereGeometry args={[0.07 - (k % 3) * 0.012, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color={k % 3 === 2 ? "#b7d46a" : k % 2 ? "#79a83c" : "#93be4e"} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>); })}
  </group>
);
const Bale: React.FC<{ p: V3; ry?: number; map?: Tx }> = ({ p, ry = 0, map }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Box p={[0, 0.2, 0]} s={[0.9, 0.4, 0.45]} c="#d9b868" map={map} rad={0.06} r={1} />
    {[-0.22, 0.22].map((x, i) => <Box key={i} p={[x, 0.2, 0]} s={[0.012, 0.41, 0.46]} c="#7a5a2a" rad={0.004} />)}
  </group>
);
// polvo que flota en un haz de luz
const Dust: React.FC<{ t: number; c: V3; size: V3; n?: number; map?: Tx; o?: number }> = ({ t, c, size, n = 220, map, o = 0.6 }) => {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const ph = (t * (0.012 + rnd(i, 1) * 0.02) + rnd(i, 2)) % 1;
    pos[i * 3] = c[0] + (rnd(i, 3) - 0.5) * size[0] + Math.sin(t * 0.3 + i) * 0.03;
    pos[i * 3 + 1] = c[1] + (ph - 0.5) * size[1];
    pos[i * 3 + 2] = c[2] + (rnd(i, 4) - 0.5) * size[2] + Math.cos(t * 0.25 + i) * 0.03;
  }
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
    <pointsMaterial size={0.012} map={map} transparent opacity={o} depthWrite={false} color="#fff3d6" blending={THREE.AdditiveBlending} /></points>;
};
// haz de luz volumétrico (cuña translúcida)
const Beam: React.FC<{ p: V3; rot: V3; len: number; w: number; o?: number }> = ({ p, rot, len, w, o = 0.08 }) => (
  <mesh position={p} rotation={rot}><boxGeometry args={[w, len, 0.004]} /><meshBasicMaterial color="#ffe7b0" transparent opacity={o} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} /></mesh>
);

// ---------- lugares ----------
export const ZONE = { garden: 0, barn: 14, coop: -14 };
const GX = ZONE.garden, BX = ZONE.barn, CX = ZONE.coop;
export const PTS = {
  board: [GX + 0.6, 0.02, 0.9] as V3, can: [GX - 1.1, -0.18, 2.05] as V3, flagRow: [GX - 0.8, 0, 0.3] as V3,
  bucket: [BX + 0.4, 0, -1.0] as V3, can2: [BX + 0.4, 0.37, -1.0] as V3, wallGap: [BX - 1.4, 0.06, -1.95] as V3,
  coop: [CX + 0.6, 0, -0.8] as V3, apron: [CX - 0.2, -0.2, 1.9] as V3, feeder: [CX + 0.6, 0.95, -0.8] as V3, burrow: [CX - 1.2, -0.25, 1.95] as V3,
};

const Garden: React.FC<{ t: number; tx: ReturnType<typeof useFarmTex>; ft: ReturnType<typeof useTextures> }> = ({ t, tx, ft }) => (
  <group>
    {/* pasto */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[GX, 0, -1]} receiveShadow><planeGeometry args={[12, 9]} /><meshStandardMaterial map={tx.grass} roughness={0.95} /></mesh>
    {/* pared del granero rojo al fondo + alero */}
    <mesh position={[GX, 1.6, -4.4]} receiveShadow><planeGeometry args={[9, 3.2]} /><meshStandardMaterial map={tx.barnRed} roughness={0.9} /></mesh>
    <Box p={[GX, 3.25, -4.2]} s={[9.2, 0.12, 0.6]} c="#3b3f44" r={0.6} m={0.3} />
    <Box p={[GX - 1.5, 1.1, -4.38]} s={[1.3, 2.2, 0.05]} c="#5c1c16" r={0.9} />
    {[-2.12, -0.88].map((x, i) => <Box key={i} p={[GX + x, 1.1, -4.34]} s={[0.08, 2.2, 0.03]} c="#ece4d4" />)}
    <Box p={[GX - 1.5, 1.1, -4.34]} s={[1.3, 0.08, 0.03]} c="#ece4d4" rot={[0, 0, 1.03]} />
    {/* canteros de madera con lechuga */}
    {[[-2.3, -1.6], [0.9, -1.6], [2.9, 0.6]].map(([x, z], b) => (
      <group key={b} position={[GX + x, 0, z]}>
        <Box p={[0, 0.13, 0]} s={[1.9, 0.26, 0.9]} c="#7a5a3a" map={ft.planks} r={0.9} rad={0.02} />
        <Box p={[0, 0.25, 0]} s={[1.8, 0.04, 0.8]} c="#3a2a1c" map={tx.soil} r={1} rad={0.01} />
        {Array.from({ length: 10 }, (_, k) => <Lettuce key={k} p={[-0.72 + (k % 5) * 0.36, 0.27, -0.2 + Math.floor(k / 5) * 0.4]} s={0.9 + rnd(k + b * 10, 1) * 0.4} seed={k + b} />)}
      </group>))}
    {/* lomos de topo y montículos */}
    <Ridge map={tx.soil} pts={[[-3.6, 1.6], [-2.6, 1.2], [-1.8, 0.6], [-0.9, 0.5], [0.1, 0.0], [0.8, -0.4]]} />
    <Ridge map={tx.soil} pts={[[-0.9, 0.5], [-0.6, 1.2], [-1.1, 2.0], [-1.0, 2.6]]} r={0.04} />
    <Ridge map={tx.soil} pts={[[1.6, 1.8], [1.1, 1.3], [1.4, 0.9], [2.0, 0.5]]} r={0.045} />
    {[[-2.0, 2.6, 1.2], [0.5, 1.6, 1], [2.2, 2.3, 0.85], [-3.0, 0.2, 0.9]].map(([x, z, s], i) => <Mound key={i} p={[GX + x, 0, z]} s={s} map={tx.soil} />)}
    {[[-2.6, 1.2], [-0.9, 0.5], [0.1, 0.0], [1.1, 1.3], [-1.1, 2.0]].map(([x, z], i) => <Flag key={i} p={[GX + x + 0.12, 0, z + 0.05]} t={t} i={i} />)}
    {/* la tabla sobre el pozo, con tierra en los bordes */}
    <Box p={PTS.board} s={[0.5, 0.025, 0.5]} c="#8a7a62" map={tx.gray} r={0.95} rot={[0, 0.2, 0]} />
    {[0, 1, 2, 3].map((k) => <Mound key={k} p={[PTS.board[0] + Math.cos(k * 1.57 + 0.2) * 0.27, 0, PTS.board[2] + Math.sin(k * 1.57 + 0.2) * 0.27]} s={0.45} map={tx.soil} />)}
    {/* pala clavada y balde galvanizado */}
    <group position={[GX + 1.6, 0, 0.2]} rotation={[0.12, 0.4, -0.08]}>
      <Box p={[0, 0.12, 0]} s={[0.2, 0.26, 0.012]} c="#8d9296" m={0.8} r={0.45} />
      <Cyl p={[0, 0.72, 0]} r1={0.018} h={0.95} c="#a27a4a" rough={0.7} />
      <Box p={[0, 1.22, 0]} s={[0.16, 0.035, 0.035]} c="#a27a4a" />
    </group>
    <Bucket p={[GX + 2.1, 0, 0.0]} metal />
    {/* CORTE de suelo al frente: estratos, el túnel redondo y la lata enterrada a ras del piso del túnel */}
    <group position={[GX - 1.1, 0, 2.05]}>
      <mesh position={[0, -0.45, 0.45]}><planeGeometry args={[3.2, 0.9]} /><meshStandardMaterial map={tx.strata} roughness={1} /></mesh>
      <Box p={[0, -0.46, -0.02]} s={[3.2, 0.9, 0.86]} cs={false} c="#3a2a1c" map={tx.soil} r={1} rad={0.01} />
      {/* túnel: cilindro horizontal oscuro asomado en la cara del corte */}
      <mesh position={[0, -0.18, 0.457]}><circleGeometry args={[0.05, 20]} /><meshStandardMaterial color="#120c07" roughness={1} /></mesh>
      <mesh position={[-0.55, -0.18, 0.457]}><planeGeometry args={[1.0, 0.1]} /><meshStandardMaterial color="#1b120b" roughness={1} /></mesh>
      <mesh position={[0.55, -0.18, 0.457]}><planeGeometry args={[1.0, 0.1]} /><meshStandardMaterial color="#1b120b" roughness={1} /></mesh>
      {/* la lata: el borde al ras del piso del túnel */}
      <group position={[0, -0.23, 0.36]}>
        <Cyl p={[0, -0.13, 0]} r1={0.085} h={0.26} c="#b5b9bc" m={0.85} rough={0.35} open side={THREE.DoubleSide} />
        <mesh position={[0, -0.24, 0.0]}><boxGeometry args={[0.15, 0.04, 0.15]} /><meshStandardMaterial color="#4a3424" map={tx.soil} roughness={1} /></mesh>
      </group>
    </group>
  </group>
);

const Barn: React.FC<{ t: number; tx: ReturnType<typeof useFarmTex>; ft: ReturnType<typeof useTextures> }> = ({ t, tx, ft }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[BX, 0, -0.5]} receiveShadow><planeGeometry args={[8, 6]} /><meshStandardMaterial map={ft.planks} color="#b59a78" roughness={0.9} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[BX, 0.003, -0.5]}><planeGeometry args={[8, 6]} /><meshStandardMaterial map={tx.hay} transparent opacity={0.35} roughness={1} /></mesh>
    <mesh position={[BX, 1.6, -2.0]} receiveShadow><planeGeometry args={[8, 3.2]} /><meshStandardMaterial map={tx.gray} roughness={0.95} /></mesh>
    <mesh position={[BX - 4.0, 1.6, -0.5]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[6, 3.2]} /><meshStandardMaterial map={tx.gray} roughness={0.95} /></mesh>
    {/* rendijas por donde entra el sol (franjas emisivas) */}
    {[-2.6, -1.1, 0.9, 2.3].map((x, i) => <mesh key={i} position={[BX + x, 1.7, -1.995]}><planeGeometry args={[0.025, 2.6]} /><meshBasicMaterial color="#ffe2a8" /></mesh>)}
    {[-2.6, -1.1, 0.9, 2.3].map((x, i) => <Beam key={"b" + i} p={[BX + x + 0.5, 1.1, -1.2]} rot={[0.95, 0, -0.35]} len={2.4} w={0.09} o={0.05 + 0.02 * Math.sin(t * 0.4 + i)} />)}
    <Dust t={t} c={[BX + 0.3, 1.1, -1.1]} size={[4.5, 2.2, 1.6]} map={ft.flake} />
    {/* fardos y cajones de alimento */}
    {[[-2.8, 0, -1.5, 0], [-1.85, 0, -1.55, 0.05], [-2.35, 0.4, -1.52, -0.04], [2.6, 0, -1.5, 0.1]].map(([x, y, z, r], i) => <Bale key={i} p={[BX + x, y, z]} ry={r} map={tx.hay} />)}
    {[[1.4, -1.55], [0.4, -1.6]].map(([x, z], i) => (
      <group key={i} position={[BX + x, 0, z]}>
        <Box p={[0, 0.35, 0]} s={[0.8, 0.7, 0.6]} c="#6b7f6a" map={ft.planks} r={0.9} rad={0.02} />
        <Box p={[0, 0.72, 0.05]} s={[0.84, 0.04, 0.66]} c="#5a6a58" r={0.9} rot={[-0.25, 0, 0]} />
      </group>))}
    {/* banco largo contra la pared */}
    <group position={[BX - 3.4, 0, -0.4]} rotation={[0, Math.PI / 2, 0]}>
      <Box p={[0, 0.45, 0]} s={[1.6, 0.06, 0.32]} c="#7a5a3a" map={ft.planks} />
      {[-0.65, 0.65].map((x, i) => <Box key={i} p={[x, 0.22, 0]} s={[0.07, 0.44, 0.28]} c="#6a4a2c" />)}
    </group>
    {/* herramientas en clavos */}
    {[-0.9, -0.6, -0.3].map((x, i) => <Box key={i} p={[BX + x - 1.8, 1.5 - i * 0.04, -1.97]} s={[0.025, 0.6 + i * 0.1, 0.02]} c="#4a4f54" m={0.7} r={0.5} rot={[0, 0, 0.06 * (i - 1)]} />)}
    {/* EL BALDE con la lata que gira sobre el alambre y la rampa contra la pared */}
    <group position={PTS.bucket}>
      <Bucket p={[0, 0, 0]} s={1.25} />
      <Cyl p={[0, 0.455, 0]} r1={0.0025} h={0.42} c="#8d9296" m={0.8} rough={0.4} rot={[0, 0, Math.PI / 2]} seg={6} />
      <group position={[0, 0.455, 0]} rotation={[t * 0.6, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.033, 0.033, 0.12, 28]} /><meshStandardMaterial map={tx.label} roughness={0.35} metalness={0.5} /></mesh>
        <mesh position={[0, 0.0335, 0]} rotation={[0, 0, Math.PI / 2]}><boxGeometry args={[0.001, 0.05, 0.004]} /><meshStandardMaterial color="#6b4423" roughness={0.6} /></mesh>
      </group>
      <Box p={[-0.42, 0.24, 0]} s={[0.66, 0.02, 0.09]} c="#9a7b55" map={ft.planks} rot={[0, 0, 0.62]} />
    </group>
    {/* hueco al pie de la pared con lana de acero */}
    <mesh position={PTS.wallGap}><sphereGeometry args={[0.05, 10, 8]} /><meshStandardMaterial color="#9da2a6" roughness={0.9} metalness={0.6} wireframe /></mesh>
    {/* tacho de metal con tapa */}
    <Cyl p={[BX + 2.0, 0.3, -0.9]} r1={0.22} h={0.6} c="#9ea3a7" m={0.85} rough={0.35} />
    <Cyl p={[BX + 2.0, 0.62, -0.9]} r1={0.235} h={0.04} c="#b3b8bc" m={0.85} rough={0.3} />
  </group>
);

const Coop: React.FC<{ t: number; tx: ReturnType<typeof useFarmTex>; ft: ReturnType<typeof useTextures> }> = ({ t, tx, ft }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[CX, 0, -0.5]} receiveShadow><planeGeometry args={[10, 8]} /><meshStandardMaterial map={tx.soil} color="#8a7058" roughness={1} /></mesh>
    {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[CX + (rnd(i, 1) - 0.5) * 6, 0.004, -0.5 + (rnd(i, 2) - 0.5) * 4]} rotation={[-Math.PI / 2, 0, rnd(i, 3) * 6]}><planeGeometry args={[0.07, 0.05]} /><meshStandardMaterial color={rnd(i, 4) > 0.5 ? "#9a5a26" : "#b88a3a"} side={THREE.DoubleSide} roughness={1} /></mesh>)}
    {/* el roble */}
    <Cyl p={[CX - 3.0, 1.6, -3.0]} r1={0.22} r2={0.3} h={3.2} c="#5a4636" map={tx.bark} rough={1} />
    {[[0, 3.4, 0, 1.3], [-0.9, 3.0, 0.3, 0.9], [0.9, 3.1, -0.2, 1.0], [0.2, 3.9, 0.4, 0.8]].map(([x, y, z, r], i) => <mesh key={i} position={[CX - 3.0 + x, y, -3.0 + z]} castShadow><icosahedronGeometry args={[r, 1]} /><meshStandardMaterial color={i % 2 ? "#7a6a2a" : "#8a5a24"} roughness={1} flatShading /></mesh>)}
    {/* gallinero sobre patas */}
    <group position={PTS.coop}>
      {[[-0.55, -0.4], [0.55, -0.4], [-0.55, 0.4], [0.55, 0.4]].map(([x, z], i) => <Box key={i} p={[x, 0.25, z]} s={[0.08, 0.5, 0.08]} c="#6a5a46" map={tx.gray} />)}
      <Box p={[0, 0.95, 0]} s={[1.25, 0.9, 0.95]} c="#a59478" map={tx.gray} r={0.95} rad={0.02} />
      <Box p={[0, 1.48, 0]} s={[1.45, 0.07, 1.15]} c="#4d5357" m={0.4} r={0.5} rot={[0.12, 0, 0]} />
      <Box p={[0.1, 0.92, 0.48]} s={[0.36, 0.5, 0.02]} c="#6a5236" map={ft.planks} />
      {[0, 1].map((k) => <Box key={k} p={[-0.38 + k * 0.28, 0.72, 0.5]} s={[0.24, 0.2, 0.08]} c="#8a6a42" map={ft.planks} />)}
      {[0, 1].map((k) => <mesh key={"s" + k} position={[-0.38 + k * 0.28, 0.78, 0.53]}><boxGeometry args={[0.2, 0.06, 0.04]} /><meshStandardMaterial map={tx.hay} roughness={1} /></mesh>)}
      <Box p={[0.1, 0.3, 0.9]} s={[0.26, 0.02, 0.9]} c="#8a7350" map={ft.planks} rot={[0.62, 0, 0]} />
    </group>
    {/* comedero colgado (se balancea apenas) */}
    <group position={[CX + 1.8, 1.25, 0.2]} rotation={[0, 0, Math.sin(t * 0.9) * 0.03]}>
      <Cyl p={[0, -0.25, 0]} r1={0.003} h={0.5} c="#8d9296" m={0.8} seg={6} />
      <Cyl p={[0, -0.6, 0]} r1={0.08} r2={0.1} h={0.3} c="#a8adb1" m={0.85} rough={0.35} />
      <Cyl p={[0, -0.76, 0]} r1={0.17} r2={0.15} h={0.04} c="#9ca1a5" m={0.85} rough={0.35} />
    </group>
    {/* corral: postes + malla de gallinero hexagonal */}
    {[-1.6, 0, 1.6, 3.2].map((x, i) => <Box key={i} p={[CX + x, 0.7, 1.2]} s={[0.09, 1.4, 0.09]} c="#7a6a52" map={tx.gray} />)}
    <mesh position={[CX + 0.8, 0.7, 1.2]}><planeGeometry args={[4.8, 1.3]} /><meshStandardMaterial map={tx.hex} transparent alphaTest={0.3} side={THREE.DoubleSide} metalness={0.7} roughness={0.4} /></mesh>
    {/* CORTE de tierra al frente: la malla de 1/2" en L enterrada y la cueva de la rata que choca contra ella */}
    <group position={[CX - 0.2, 0, 1.9]}>
      <mesh position={[0, -0.45, 0.45]}><planeGeometry args={[3.6, 0.9]} /><meshStandardMaterial map={tx.strata} roughness={1} /></mesh>
      <Box p={[0, -0.46, 0]} s={[3.6, 0.9, 0.9]} cs={false} c="#3a2a1c" map={tx.soil} r={1} rad={0.01} />
      {/* malla: baja por la pared y sale en L hacia afuera */}
      <mesh position={[0.6, -0.15, 0.455]}><planeGeometry args={[0.02, 0.3]} /><meshStandardMaterial color="#cfd3d6" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0.6, -0.15, 0.456]}><planeGeometry args={[0.18, 0.3]} /><meshStandardMaterial map={tx.mesh} transparent alphaTest={0.3} metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0.25, -0.3, 0.456]}><planeGeometry args={[0.72, 0.02]} /><meshStandardMaterial color="#cfd3d6" metalness={0.8} roughness={0.3} /></mesh>
      {/* cueva: de la izquierda baja hasta tocar la malla */}
      {Array.from({ length: 14 }, (_, k) => { const x = -1.4 + k * 0.12, y = -0.05 - Math.sin(k / 13 * Math.PI * 0.55) * 0.3; return <mesh key={k} position={[x, y, 0.452]}><circleGeometry args={[0.055, 14]} /><meshStandardMaterial color="#140d08" roughness={1} /></mesh>; })}
    </group>
  </group>
);

// ---------- cámara ----------
export type Cam = { p: V3; l: V3; fov: number };
const CamSet: React.FC<{ k: { p: THREE.Vector3; l: THREE.Vector3; fov: number } }> = ({ k }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.02; c.far = 300; c.updateProjectionMatrix();
  return null;
};

// luz por lugar: la huerta al amanecer (sol bajo de la izquierda), el granero con sol que entra por las rendijas, el gallinero nublado
export const FarmWorld: React.FC<{ t: number; cam: { p: THREE.Vector3; l: THREE.Vector3; fov: number }; zone: number }> = ({ t, cam, zone }) => {
  const tx = useFarmTex(), ft = useTextures();
  const inBarn = cl(1 - Math.abs(cam.p.x - BX) / 5), inCoop = cl(1 - Math.abs(cam.p.x - CX) / 5);
  const sky = inBarn > 0.5 ? "#1a140e" : inCoop > 0.5 ? "#9aa3a8" : "#d9c8a4";
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <CamSet k={cam} />
      <Post bloom={0.16 + 0.12 * inBarn} threshold={0.9} exposure={lerp(0.95, 0.82, inBarn)} env={lerp(0.45, 0.25, inBarn)} />
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 9, 26]} />
      <hemisphereLight args={["#f2e6cc", "#5a4a32", lerp(0.55, 0.22, inBarn) + 0.1 * inCoop]} />
      {/* sol bajo de la mañana (huerta y gallinero) */}
      <directionalLight position={[cam.p.x - 6, 4.5, 3]} intensity={lerp(1.6, 0.4, inBarn) * (1 - 0.45 * inCoop)} color="#ffd7a0" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-camera-far={30} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* sol que entra por las tablas del granero */}
      <spotLight position={[BX + 0.8, 3.4, -2.3]} target-position={[BX, 0, -0.6]} angle={0.6} penumbra={0.8} intensity={inBarn * 9} distance={8} color="#ffd59a" castShadow decay={1.6} />
      <pointLight position={[BX - 1, 2.2, 1.2]} intensity={inBarn * 0.8} distance={6} color="#f0d8b0" decay={1.6} />
      <Garden t={t} tx={tx} ft={ft} />
      <Barn t={t} tx={tx} ft={ft} />
      <Coop t={t} tx={tx} ft={ft} />
      {zone === -99 && null}
    </ThreeCanvas>
  );
};

// cámaras con nombre (p0→p1 deriva lenta dentro de la parada; entre paradas viaja en arco)
type CN = { p0: V3; p1: V3; l0: V3; l1: V3; f0: number; f1: number };
export const CAMS: Record<string, CN> = {
  g_wide: { p0: [GX + 3.6, 2.2, 5.2], p1: [GX + 2.6, 1.9, 4.4], l0: [GX - 0.4, 0.3, 0], l1: [GX - 0.6, 0.3, -0.2], f0: 42, f1: 39 },
  g_ridges: { p0: [GX + 1.0, 0.75, 2.6], p1: [GX + 0.2, 0.6, 2.2], l0: [GX - 1.6, 0.0, 0.8], l1: [GX - 1.9, 0.0, 0.6], f0: 38, f1: 35 },
  g_board: { p0: [GX + 1.4, 0.7, 1.9], p1: [GX + 1.1, 0.55, 1.6], l0: PTS.board, l1: PTS.board, f0: 34, f1: 30 },
  g_cut: { p0: [GX - 0.6, 0.15, 3.8], p1: [GX - 0.95, 0.0, 3.3], l0: [GX - 1.1, -0.25, 2.4], l1: [GX - 1.1, -0.25, 2.4], f0: 36, f1: 31 },
  g_bed: { p0: [GX + 2.4, 1.1, 0.6], p1: [GX + 2.0, 0.9, 0.2], l0: [GX + 0.9, 0.3, -1.6], l1: [GX + 0.8, 0.3, -1.7], f0: 38, f1: 34 },
  g_barnwall: { p0: [GX - 0.2, 1.3, 1.6], p1: [GX - 0.9, 1.2, 1.2], l0: [GX - 1.5, 1.0, -4.3], l1: [GX - 1.6, 1.1, -4.3], f0: 44, f1: 40 },
  b_wide: { p0: [BX + 2.6, 1.7, 3.0], p1: [BX + 1.8, 1.5, 2.4], l0: [BX - 0.2, 0.6, -1.2], l1: [BX - 0.4, 0.6, -1.3], f0: 44, f1: 40 },
  b_bucket: { p0: [BX + 1.2, 0.85, 0.2], p1: [BX + 0.95, 0.72, -0.05], l0: PTS.can2, l1: PTS.can2, f0: 32, f1: 28 },
  b_wall: { p0: [BX - 0.5, 0.45, -0.4], p1: [BX - 0.9, 0.35, -0.7], l0: PTS.wallGap, l1: PTS.wallGap, f0: 36, f1: 32 },
  b_beams: { p0: [BX + 0.4, 0.9, 1.6], p1: [BX - 0.2, 1.1, 1.2], l0: [BX - 0.6, 1.6, -2], l1: [BX - 0.4, 1.5, -2], f0: 46, f1: 42 },
  b_bench: { p0: [BX - 1.6, 1.0, 1.2], p1: [BX - 2.0, 0.9, 0.9], l0: [BX - 3.4, 0.5, -0.4], l1: [BX - 3.4, 0.5, -0.5], f0: 40, f1: 36 },
  c_wide: { p0: [CX + 3.4, 2.0, 4.8], p1: [CX + 2.6, 1.8, 4.2], l0: [CX + 0.2, 0.7, -0.6], l1: [CX, 0.7, -0.7], f0: 42, f1: 39 },
  c_apron: { p0: [CX + 0.2, 0.1, 3.9], p1: [CX - 0.2, 0.0, 3.4], l0: [CX - 0.2, -0.25, 2.3], l1: [CX - 0.2, -0.25, 2.3], f0: 36, f1: 31 },
  c_coop: { p0: [CX + 1.9, 1.1, 1.6], p1: [CX + 1.5, 1.0, 1.2], l0: PTS.coop, l1: [PTS.coop[0], 0.8, PTS.coop[2]], f0: 38, f1: 34 },
  c_feeder: { p0: [CX + 2.6, 1.0, 1.6], p1: [CX + 2.3, 0.95, 1.3], l0: [CX + 1.8, 0.55, 0.2], l1: [CX + 1.8, 0.55, 0.2], f0: 34, f1: 30 },
  c_oak: { p0: [CX + 0.5, 0.9, 2.6], p1: [CX + 0.1, 1.1, 2.2], l0: [CX - 3.0, 3.0, -3.0], l1: [CX - 3.0, 3.3, -3.0], f0: 46, f1: 42 },
};
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
// cams: [[t, nombre]...]; dentro de la parada deriva p0→p1 en la duración de la parada; el vuelo entre paradas dura 1,6 s y va en arco
export const camOf = (t: number, cams: [number, string][]) => {
  let i = 0; while (i < cams.length - 1 && cams[i + 1][0] <= t) i++;
  const [a, n] = cams[i], b = i + 1 < cams.length ? cams[i + 1][0] : a + 30;
  const C = CAMS[n] ?? CAMS.g_wide, k = cl((t - a) / Math.max(4, b - a));
  const p = v3(C.p0).lerp(v3(C.p1), k), l = v3(C.l0).lerp(v3(C.l1), k); let fov = lerp(C.f0, C.f1, k);
  const FLY = 1.6;
  if (i > 0 && t - a < FLY) {   // vuelo desde el final de la parada anterior
    const [a0, n0] = cams[i - 1], P = CAMS[n0] ?? CAMS.g_wide, k0 = cl((a - a0) / Math.max(4, a - a0));
    const q = ease((t - a) / FLY);
    const pf = v3(P.p0).lerp(v3(P.p1), k0), lf = v3(P.l0).lerp(v3(P.l1), k0);
    p.copy(pf.lerp(p, q)); l.copy(lf.lerp(l, q)); p.y += Math.sin(Math.PI * q) * 0.6; fov = lerp(lerp(P.f0, P.f1, k0), fov, q);
  }
  p.x += Math.sin(t * 0.7) * 0.004; p.y += Math.sin(t * 0.93 + 1) * 0.003;
  return { p, l, fov };
};
export const camSpeed = (t: number, cams: [number, string][]) => {
  const a = camOf(t, cams), b = camOf(t + 1 / 30, cams);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, dp * 0.3), by: Math.min(10, dp * 0.12) };
};
