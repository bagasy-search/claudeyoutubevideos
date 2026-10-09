// OleCookhouse3D — el comedor (cookhouse) de un campamento maderero: LA MESA LARGA.
// Dos mesas de tablones con bancos sin respaldo, paredes de troncos con argamasa, vigas, farolas con parpadeo,
// cocina de hierro al fondo, ventanas con nieve. La cámara recorre el pasillo a baja altura y los platos "aparecen"
// servidos (pop + vapor) en su lugar. Todo animado por useCurrentFrame (sin useFrame / Math.random).
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, delayRender, continueRender, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { HAND, OLE, SLAB, rnd } from "./OleSupTheme";
import { CamRig, Motes, Steam, StoveModel, V3, blobs, canvasTex, clamp01, dots, ease, flick, radialFill, softTex, useIronMats } from "./Ole3DKit";

export type DishKind = "empty" | "stew" | "pie" | "bread" | "beans" | "soup" | "fried" | "pancakes" | "pudding" | "roast" | "hash" | "cookies";
export type CookhouseDish = { n: number; kind: DishKind; at: number };
export type CookhouseSign = { text: string; at?: number; where?: "end" | "cook" };
export type OleCookhouse3DProps = {
  dishes?: CookhouseDish[];
  camAlong?: { from: number; to: number };
  /** plato al que apunta la cámara al inicio (push lento; sigue al más reciente si aparecen platos con at>0) */
  focusN?: number;
  /** plato al que se desplaza la cámara durante TODO el componente (dolly suave focusN -> camTo) */
  camTo?: number;
  /** true: arranca con toma abierta de la mesa entera y hace push-in hacia el foco */
  intro?: boolean;
  total?: number;
  signs?: CookhouseSign[];
  vignette?: boolean;
};

// ─── geometría de la sala ───
const X0 = -1.6, X1 = 19, ZW = 4, RH = 3.4;
const SLOT0 = 1.9, SLOT_DX = 0.72;
const LANE_Z = [-1.18, 1.18, -1.82, 1.82]; // 0/1 = lado del pasillo (mesa A/B), 2/3 = lado de la pared
export function placeOf(n: number): { x: number; z: number; lane: number; slot: number } {
  const k = Math.max(0, n - 1), lane = k % 4, col = Math.floor(k / 4);
  const slot = 2 * col + (lane >= 2 ? 1 : 0);
  return { x: SLOT0 + slot * SLOT_DX, z: LANE_Z[lane], lane, slot };
}

function useFontsReady(fams: string[]) {
  const [ok, setOk] = useState(false);
  const [h] = useState(() => delayRender("olsup-fonts"));
  React.useEffect(() => {
    Promise.all(fams.map((f) => (document as any).fonts.load(`40px ${f}`))).catch(() => null).then(() => setOk(true));
  }, []); // eslint-disable-line
  React.useEffect(() => { if (ok) continueRender(h); }, [ok]); // eslint-disable-line
  return ok;
}

// ─── texturas de la sala ───
function useRoomTex() {
  return useMemo(() => {
    const logWall = canvasTex((c, W, H) => {
      c.fillStyle = "#8b8271"; c.fillRect(0, 0, W, H);
      const rows = 4, rh = H / rows;
      for (let r = 0; r < rows; r++) {
        const y0 = r * rh + 6, h = rh - 12;
        const g = c.createLinearGradient(0, y0, 0, y0 + h);
        g.addColorStop(0, "#33231a"); g.addColorStop(0.18, "#6b4e38"); g.addColorStop(0.5, "#7a5a41"); g.addColorStop(0.85, "#4a3324"); g.addColorStop(1, "#2a190d");
        c.fillStyle = g; c.fillRect(0, y0, W, h);
        for (let i = 0; i < 26; i++) { c.strokeStyle = `rgba(20,10,4,${0.25 + rnd(r * 99 + i) * 0.35})`; c.lineWidth = 1 + rnd(i + r) * 2; const y = y0 + 6 + rnd(r * 50 + i + 3) * (h - 12); c.beginPath(); c.moveTo(rnd(i * 7 + r) * W * 0.3, y); c.bezierCurveTo(W * 0.3, y + (rnd(i + 8) - 0.5) * 9, W * 0.6, y + (rnd(i + 12) - 0.5) * 9, W * (0.6 + rnd(i + r * 3) * 0.4), y); c.stroke(); }
        for (let i = 0; i < 2; i++) { const kx = rnd(r * 17 + i) * W, ky = y0 + h * (0.3 + rnd(r * 5 + i) * 0.4); c.fillStyle = "rgba(25,12,5,0.7)"; c.beginPath(); c.ellipse(kx, ky, 14, 9, 0, 0, 6.3); c.fill(); c.strokeStyle = "rgba(200,150,90,0.4)"; c.lineWidth = 2; c.beginPath(); c.ellipse(kx, ky, 20, 13, 0, 0, 6.3); c.stroke(); }
        c.fillStyle = "rgba(255,225,170,0.10)"; c.fillRect(0, y0 + h * 0.3, W, 3);
        // argamasa (junta)
        c.fillStyle = "#a89c84"; c.fillRect(0, r * rh - 5, W, 11);
        dots(c, W, H, 5 + r, 90, "#6e6552", 1, 3, 0.7);
      }
    }, 1024, 512, [7, 2.4]);
    const floor = canvasTex((c, W, H) => {
      c.fillStyle = "#2b1c11"; c.fillRect(0, 0, W, H);
      const n = 6, ph = H / n;
      for (let i = 0; i < n; i++) { c.fillStyle = i % 2 ? "#3a271a" : "#332216"; c.fillRect(0, i * ph + 2, W, ph - 4); for (let k = 0; k < 20; k++) { c.strokeStyle = `rgba(15,8,3,${0.2 + rnd(i * 30 + k) * 0.3})`; c.lineWidth = 1 + rnd(k) * 2; const y = i * ph + 6 + rnd(i * 40 + k + 2) * (ph - 12); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y + (rnd(k + i) - 0.5) * 8); c.stroke(); } }
      dots(c, W, H, 71, 400, "#1a0f07", 1, 4, 0.55); dots(c, W, H, 72, 120, "#5a4028", 1, 3, 0.4);
    }, 512, 512, [12, 5]);
    const table = canvasTex((c, W, H) => {
      const n = 4, ph = H / n;
      for (let i = 0; i < n; i++) {
        const g = c.createLinearGradient(0, i * ph, 0, (i + 1) * ph); g.addColorStop(0, "#8B6C4A"); g.addColorStop(0.5, "#9C7A55"); g.addColorStop(1, "#7A5C3E");
        c.fillStyle = g; c.fillRect(0, i * ph, W, ph);
        for (let k = 0; k < 22; k++) { c.strokeStyle = `rgba(70,40,15,${0.15 + rnd(i * 50 + k) * 0.3})`; c.lineWidth = 1 + rnd(k + i) * 2; const y = i * ph + 4 + rnd(i * 60 + k + 1) * (ph - 8); c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(W * 0.3, y + (rnd(k + 5) - 0.5) * 8, W * 0.7, y + (rnd(k + 9) - 0.5) * 8, W, y); c.stroke(); }
        c.fillStyle = "#3a2410"; c.fillRect(0, i * ph, W, 3);
      }
      dots(c, W, H, 33, 260, "#5b3a1b", 1, 3, 0.4); dots(c, W, H, 34, 160, "#E8C99A", 1, 2, 0.28);
      // manchas de uso / círculos de tazas
      for (let i = 0; i < 24; i++) { c.strokeStyle = "rgba(50,28,10,0.32)"; c.lineWidth = 2; c.beginPath(); c.arc(rnd(i * 3) * W, rnd(i * 3 + 1) * H, 10 + rnd(i * 3 + 2) * 6, 0, 6.3); c.stroke(); }
    }, 1024, 256, [5, 1]);
    const ceiling = canvasTex((c, W, H) => {
      c.fillStyle = "#2a1a0e"; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#33200f" : "#2c1b0d"; c.fillRect(0, i * H / 8 + 2, W, H / 8 - 3); }
      dots(c, W, H, 9, 300, "#140a04", 1, 3, 0.5);
    }, 512, 512, [10, 3]);
    const snow = canvasTex((c, W, H) => {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#7E9DBC"); g.addColorStop(1, "#C4D6E6"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      dots(c, W, H, 3, 90, "#FFFFFF", 1, 3.6, 0.95); dots(c, W, H, 4, 50, "#FFFFFF", 2, 5, 0.6);
    }, 256, 256, [1, 1]);
    const wood = canvasTex((c, W, H) => { c.fillStyle = "#4a2f18"; c.fillRect(0, 0, W, H); for (let i = 0; i < 20; i++) { c.strokeStyle = `rgba(20,10,4,${0.2 + rnd(i) * 0.3})`; c.lineWidth = 1 + rnd(i + 3) * 2; const y = rnd(i + 8) * H; c.beginPath(); c.moveTo(0, y); c.lineTo(W, y + (rnd(i + 2) - 0.5) * 6); c.stroke(); } dots(c, W, H, 21, 120, "#25150a", 1, 3, 0.5); }, 256, 256);
    const shadow = canvasTex((c, W) => { const g = c.createRadialGradient(W / 2, W / 2, W * 0.15, W / 2, W / 2, W / 2); g.addColorStop(0, "rgba(0,0,0,0.6)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(0, 0, W, W); }, 128);
    const plate = canvasTex((c, W) => { c.fillStyle = "#8C9DAE"; c.fillRect(0, 0, W, W); dots(c, W, W, 5, 200, "#7C858C", 1, 2, 0.35); dots(c, W, W, 6, 120, "#D8E0E6", 1, 2, 0.4); c.strokeStyle = "rgba(50,58,66,0.4)"; c.lineWidth = 4; c.beginPath(); c.arc(W / 2, W / 2, W * 0.36, 0, 6.3); c.stroke(); c.lineWidth = 3; c.beginPath(); c.arc(W / 2, W / 2, W * 0.2, 0, 6.3); c.stroke(); }, 256);
    return { logWall, floor, table, ceiling, snow, wood, shadow, plate };
  }, []);
}

// ─── texturas de comida ───
function useFoodTex(kinds: DishKind[]) {
  const key = kinds.slice().sort().join(",");
  return useMemo(() => {
    const T: Record<string, any> = {};
    const want = (k: DishKind) => kinds.includes(k);
    if (want("stew")) T.stew = canvasTex((c, W) => {
      radialFill(c, W, W, "#8B5426", "#4E2C12");
      dots(c, W, W, 5, 500, "#3A1F0C", 1, 4, 0.4);
      blobs(c, 100, 7, W / 2, W / 2, W * 0.36, ["#E4CFA0", "#D8BE86", "#EAD7AA"], 28, 44, 0.8); // papas
      blobs(c, 200, 9, W / 2, W / 2, W * 0.38, ["#EB7F1E", "#DC6614", "#F19232"], 16, 24, 0.9); // zanahorias
      blobs(c, 300, 6, W / 2, W / 2, W * 0.34, ["#6A3818", "#7F4620", "#5B2F12"], 26, 40, 0.75); // carne
      dots(c, W, W, 400, 45, "#6FA53A", 3, 6, 1); dots(c, W, W, 500, 60, "#FFF1C2", 1, 3, 0.55);
    }, 256);
    if (want("pie")) T.pie = canvasTex((c, W) => {
      radialFill(c, W, W, "#E7A94A", "#B36E28");
      dots(c, W, W, 8, 700, "#8B4F1C", 1, 5, 0.35); dots(c, W, W, 9, 500, "#F7D08A", 1, 4, 0.5);
      c.strokeStyle = "#6E3A14"; c.lineWidth = 7; c.lineCap = "round";
      for (let i = 0; i < 7; i++) { const a = i * 0.9 + 0.3, r0 = 30 + rnd(i) * 30, r1 = 70 + rnd(i + 3) * 60; c.beginPath(); c.moveTo(W / 2 + Math.cos(a) * r0, W / 2 + Math.sin(a) * r0); c.lineTo(W / 2 + Math.cos(a + 0.4) * r1, W / 2 + Math.sin(a + 0.4) * r1); c.stroke(); }
      c.fillStyle = "rgba(160,20,40,0.85)"; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(W / 2 + Math.cos(i * 1.05) * 50, W / 2 + Math.sin(i * 1.05) * 50, 5, 0, 6.3); c.fill(); }
    }, 256);
    if (want("bread")) T.bread = canvasTex((c, W, H) => {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#E1A54F"); g.addColorStop(0.5, "#C67F2C"); g.addColorStop(1, "#8F5418"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      dots(c, W, H, 17, 500, "#F1CB86", 1, 3, 0.45); dots(c, W, H, 18, 300, "#7C440F", 1, 4, 0.4);
      c.strokeStyle = "#F6DDA8"; c.lineWidth = 9; c.lineCap = "round"; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(W * (0.15 + i * 0.22), H * 0.1); c.lineTo(W * (0.24 + i * 0.22), H * 0.9); c.stroke(); }
    }, 256, 128);
    if (want("beans")) T.beans = canvasTex((c, W) => {
      radialFill(c, W, W, "#5B2F13", "#2E170A");
      for (let i = 0; i < 260; i++) { const x = rnd(i * 3) * W, y = rnd(i * 3 + 1) * W; c.save(); c.translate(x, y); c.rotate(rnd(i + 4) * 6.3); c.fillStyle = ["#7A4420", "#69381A", "#8A5128", "#55290F"][i % 4]; c.beginPath(); c.ellipse(0, 0, 11, 7, 0, 0, 6.3); c.fill(); c.fillStyle = "rgba(255,210,150,0.35)"; c.beginPath(); c.ellipse(-3, -2, 5, 2.4, 0, 0, 6.3); c.fill(); c.restore(); }
      blobs(c, 900, 3, W / 2, W / 2, W * 0.28, ["#E2BFA8", "#D3A98E"], 18, 26, 0.6);
      c.fillStyle = "rgba(255,200,120,0.15)"; c.beginPath(); c.ellipse(W * 0.4, W * 0.35, 60, 30, 0.5, 0, 6.3); c.fill();
    }, 256);
    if (want("soup")) T.soup = canvasTex((c, W) => {
      radialFill(c, W, W, "#9DB447", "#5F7A24");
      dots(c, W, W, 7, 900, "#B6C862", 1, 4, 0.5); dots(c, W, W, 8, 700, "#4C6519", 1, 4, 0.5);
      c.strokeStyle = "rgba(255,245,210,0.8)"; c.lineWidth = 10; c.lineCap = "round"; c.beginPath(); c.arc(W / 2, W / 2, 60, 0.4, 3.9); c.stroke(); c.lineWidth = 6; c.beginPath(); c.arc(W / 2, W / 2, 34, 3.5, 6.8); c.stroke();
      blobs(c, 800, 6, W / 2, W / 2, W * 0.3, ["#E29A8C", "#D9857A"], 8, 14, 0.9); blobs(c, 850, 4, W / 2, W / 2, W * 0.32, ["#E0B266"], 8, 13, 1);
    }, 256);
    if (want("fried")) {
      T.friedPork = canvasTex((c, W, H) => { c.fillStyle = "#9B5236"; c.fillRect(0, 0, W, H); for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? "#E7C9AE" : "#C0725A"; c.fillRect(0, i * H / 6, W, H / 6 - 3); } dots(c, W, H, 3, 200, "#5B2A14", 1, 3, 0.6); c.fillStyle = "#4E2210"; c.fillRect(0, 0, W, 5); c.fillRect(0, H - 5, W, 5); }, 128, 64);
      T.home = canvasTex((c, W) => { c.fillStyle = "#D9A650"; c.fillRect(0, 0, W, W); dots(c, W, W, 5, 300, "#8B5A1C", 2, 8, 0.6); dots(c, W, W, 6, 200, "#F2D08A", 2, 6, 0.6); }, 64);
    }
    if (want("pancakes")) T.pancake = canvasTex((c, W) => {
      radialFill(c, W, W, "#B4561C", "#D79A42");
      const g = c.createRadialGradient(W * 0.42, W * 0.4, 8, W / 2, W / 2, W * 0.42); g.addColorStop(0, "rgba(255,190,110,0.95)"); g.addColorStop(0.5, "rgba(170,80,20,0.9)"); g.addColorStop(1, "rgba(160,70,15,0)");
      c.fillStyle = g; c.fillRect(0, 0, W, W); dots(c, W, W, 5, 120, "#7B3A10", 1, 4, 0.4);
    }, 256);
    if (want("pudding")) T.pudding = canvasTex((c, W) => { c.fillStyle = "#7A4526"; c.fillRect(0, 0, W, W); dots(c, W, W, 5, 700, "#4B2510", 2, 6, 0.55); dots(c, W, W, 6, 300, "#A8663A", 2, 6, 0.45); dots(c, W, W, 7, 90, "#2E1408", 3, 7, 0.9); }, 256);
    if (want("roast")) {
      T.roast = canvasTex((c, W) => { radialFill(c, W, W, "#C48046", "#8A4C24"); dots(c, W, W, 5, 500, "#5B2E14", 1, 5, 0.45); dots(c, W, W, 6, 700, "#E2AC72", 1, 4, 0.55); }, 256);
      T.slice = canvasTex((c, W) => { radialFill(c, W, W, "#D8867A", "#B36757"); c.strokeStyle = "#5B2E14"; c.lineWidth = 26; c.beginPath(); c.arc(W / 2, W / 2, W * 0.46, 0, 6.3); c.stroke(); dots(c, W, W, 8, 200, "#F1B8A8", 1, 4, 0.5); }, 128);
    }
    if (want("hash")) T.hash = canvasTex((c, W) => {
      radialFill(c, W, W, "#B0793B", "#6B4020");
      for (let i = 0; i < 520; i++) { const x = rnd(i * 3) * W, y = rnd(i * 3 + 1) * W, s = 5 + rnd(i + 3) * 9; c.save(); c.translate(x, y); c.rotate(rnd(i + 9) * 3); c.fillStyle = ["#E2C088", "#8C4E22", "#C77A2C", "#F0DAB0", "#5E3416", "#B85A34"][i % 6]; c.fillRect(-s / 2, -s / 2, s, s * 0.8); c.restore(); }
      dots(c, W, W, 77, 60, "#6FA53A", 2, 4, 0.9);
    }, 256);
    if (want("cookies")) T.cookie = canvasTex((c, W) => { radialFill(c, W, W, "#D69A50", "#A8692A"); dots(c, W, W, 5, 40, "#4A2410", 6, 12, 0.95); dots(c, W, W, 6, 22, "#6C2C3C", 5, 9, 0.9); dots(c, W, W, 7, 300, "#F0C98A", 1, 4, 0.5); c.strokeStyle = "rgba(90,50,18,0.55)"; c.lineWidth = 8; c.beginPath(); c.arc(W / 2, W / 2, W * 0.46, 0, 6.3); c.stroke(); }, 128);
    return T;
  }, [key]); // eslint-disable-line
}

// ─── platos de comida (el plato de lata va aparte, instanciado) ───
const Mound: React.FC<{ r: number; h: number; tex?: any; side: string; y?: number; topR?: number; rough?: number }> = ({ r, h, tex, side, y = 0, topR = 0.82, rough = 0.75 }) => (
  <mesh position={[0, y + h / 2, 0]}>
    <cylinderGeometry args={[r * topR, r, h, 26]} />
    <meshStandardMaterial attach="material-0" color={side} roughness={0.85} />
    <meshStandardMaterial attach="material-1" map={tex} color={tex ? "#ffffff" : side} roughness={rough} />
    <meshStandardMaterial attach="material-2" color={side} />
  </mesh>
);
const Ball: React.FC<{ p: V3; s: V3; c: string; r?: number; rough?: number; rot?: V3; tex?: any }> = ({ p, s, c, r = 0.05, rough = 0.7, rot = [0, 0, 0], tex }) => (
  <mesh position={p} scale={s} rotation={rot}><sphereGeometry args={[r, 12, 9]} /><meshStandardMaterial color={c} roughness={rough} map={tex} /></mesh>
);
const Chunk: React.FC<{ p: V3; s: number; c: string; rot?: number }> = ({ p, s, c, rot = 0 }) => (
  <mesh position={p} scale={[s, s * 0.8, s * 0.9]} rotation={[rot, rot * 2, rot * 0.5]}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color={c} roughness={0.7} flatShading /></mesh>
);
const Egg: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.006, 0]} scale={[1.2, 1, 0.95]}><cylinderGeometry args={[0.05, 0.055, 0.012, 16]} /><meshStandardMaterial color="#C98B3A" roughness={0.8} /></mesh>
    <mesh position={[0, 0.011, 0]} scale={[1.15, 1, 0.9]}><cylinderGeometry args={[0.046, 0.046, 0.012, 16]} /><meshStandardMaterial color="#FFF8EC" roughness={0.35} /></mesh>
    <mesh position={[0, 0.02, 0]} scale={[1, 0.75, 1]}><sphereGeometry args={[0.022, 12, 8]} /><meshStandardMaterial color="#F0A81C" roughness={0.2} emissive="#7A4A00" emissiveIntensity={0.35} /></mesh>
  </group>
);

const Food: React.FC<{ kind: DishKind; T: Record<string, any> }> = ({ kind, T }) => {
  switch (kind) {
    case "empty": return null;
    case "stew": return (
      <group>
        <Mound r={0.165} h={0.06} tex={T.stew} side="#5B3216" rough={0.35} />
        <Chunk p={[0.05, 0.075, 0.02]} s={0.032} c="#E4CFA0" rot={0.4} />
        <Chunk p={[-0.05, 0.072, 0.04]} s={0.03} c="#DCC48C" rot={1.1} />
        <Chunk p={[0.0, 0.08, -0.05]} s={0.034} c="#7A4220" rot={2} />
        <mesh position={[-0.07, 0.07, -0.03]} rotation={[1.4, 0, 0.6]}><cylinderGeometry args={[0.014, 0.014, 0.05, 8]} /><meshStandardMaterial color="#EB7F1E" roughness={0.6} /></mesh>
        <mesh position={[0.08, 0.068, -0.04]} rotation={[1.5, 0, -0.4]}><cylinderGeometry args={[0.014, 0.014, 0.05, 8]} /><meshStandardMaterial color="#DC6614" roughness={0.6} /></mesh>
      </group>);
    case "pie": return (
      <group>
        <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.19, 0.17, 0.03, 26]} /><meshStandardMaterial color="#B9BDBE" roughness={0.4} metalness={0.5} /></mesh>
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.165, 0.175, 0.05, 26, 1, false, 1.1, Math.PI * 2 - 1.1]} /><meshStandardMaterial color="#CE8A3A" roughness={0.75} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.087, 0]}><cylinderGeometry args={[0.15, 0.165, 0.008, 26, 1, false, 1.1, Math.PI * 2 - 1.1]} /><meshStandardMaterial color="#D9994A" roughness={0.6} map={T.pie} /></mesh>
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.163, 0.014, 8, 40, Math.PI * 2 - 1.1]} /><meshStandardMaterial color="#D08A38" roughness={0.7} /></mesh>
        <mesh position={[0, 0.055, 0]}><cylinderGeometry args={[0.15, 0.15, 0.05, 20, 1, false, 0, 1.1]} /><meshStandardMaterial color="#7C1024" roughness={0.3} /></mesh>
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.15, 20, 0, 1.1]} /><meshStandardMaterial color="#A4162F" roughness={0.25} /></mesh>
      </group>);
    case "bread": return (
      <group>
        <Ball p={[-0.07, 0.07, 0.04]} s={[1.7, 0.85, 0.9]} r={0.075} c="#C67F2C" tex={T.bread} rot={[0, 0.3, 0]} />
        <Ball p={[0.06, 0.07, -0.05]} s={[1.7, 0.85, 0.9]} r={0.075} c="#C67F2C" tex={T.bread} rot={[0, -0.25, 0]} />
        <Ball p={[0.02, 0.15, 0.0]} s={[1.5, 0.8, 0.9]} r={0.07} c="#C67F2C" tex={T.bread} rot={[0, 0.9, 0]} />
        <mesh position={[0.09, 0.02, 0.09]}><boxGeometry args={[0.07, 0.035, 0.05]} /><meshStandardMaterial color="#F6E08A" roughness={0.4} /></mesh>
      </group>);
    case "beans": return (
      <group>
        <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.13, 0.11, 0.11, 22, 1, true]} /><meshStandardMaterial color="#1E1B19" roughness={0.5} metalness={0.4} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.13, 22]} /><meshStandardMaterial color="#1E1B19" /></mesh>
        <mesh position={[0, 0.112, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.122, 22]} /><meshStandardMaterial map={T.beans} roughness={0.28} /></mesh>
        <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.011, 6, 24]} /><meshStandardMaterial color="#242120" roughness={0.5} metalness={0.4} /></mesh>
        <mesh position={[0, 0.125, 0]} rotation={[0, 0.5, 0]}><torusGeometry args={[0.13, 0.006, 6, 20, Math.PI]} /><meshStandardMaterial color="#242120" metalness={0.4} /></mesh>
        <mesh position={[0.15, 0.03, 0.06]} rotation={[0, -0.4, 0]}><boxGeometry args={[0.09, 0.028, 0.08]} /><meshStandardMaterial color="#DDAE68" roughness={0.9} /></mesh>
      </group>);
    case "soup": return (
      <group>
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.175, 0.095, 0.1, 24, 1, true]} /><meshStandardMaterial color="#EFEBDD" roughness={0.3} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.012, 0]}><cylinderGeometry args={[0.095, 0.095, 0.012, 20]} /><meshStandardMaterial color="#EFEBDD" /></mesh>
        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.175, 0.008, 6, 30]} /><meshStandardMaterial color="#2B4C8C" roughness={0.35} /></mesh>
        <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.165, 26]} /><meshStandardMaterial map={T.soup} roughness={0.22} /></mesh>
        <mesh position={[0.16, 0.09, 0.07]} rotation={[0.2, -0.6, 1.4]}><cylinderGeometry args={[0.008, 0.006, 0.17, 6]} /><meshStandardMaterial color="#B9BDBE" metalness={0.5} roughness={0.35} /></mesh>
      </group>);
    case "fried": return (
      <group>
        {[[-0.05, -0.055, 0.2], [0.0, -0.02, 0.05], [-0.04, 0.015, -0.12]].map(([x, z, r], i) => (
          <mesh key={i} position={[x, 0.014 + i * 0.008, z]} rotation={[0, r, 0.05]}><boxGeometry args={[0.15, 0.008, 0.045]} /><meshStandardMaterial map={T.friedPork} roughness={0.5} /></mesh>
        ))}
        <Egg p={[0.055, 0.01, 0.055]} s={1.1} />
        <Egg p={[-0.07, 0.02, 0.085]} s={0.95} />
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh key={i} position={[0.06 + (rnd(i * 3) - 0.5) * 0.09, 0.014 + rnd(i) * 0.015, -0.06 + (rnd(i * 3 + 1) - 0.5) * 0.08]} rotation={[rnd(i + 3), rnd(i + 4) * 3, rnd(i + 5)]}><boxGeometry args={[0.03, 0.02, 0.03]} /><meshStandardMaterial map={T.home} roughness={0.6} /></mesh>
        ))}
      </group>);
    case "pancakes": return (
      <group>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[(rnd(i + 2) - 0.5) * 0.012, 0.014 + i * 0.022, (rnd(i + 7) - 0.5) * 0.012]}><cylinderGeometry args={[0.155 - i * 0.002, 0.16 - i * 0.002, 0.021, 24]} />
            <meshStandardMaterial attach="material-0" color={i % 2 ? "#E6BC70" : "#D2A052"} roughness={0.8} />
            <meshStandardMaterial attach="material-1" map={i === 5 ? T.pancake : undefined} color={i === 5 ? "#ffffff" : "#DFAD5C"} roughness={i === 5 ? 0.2 : 0.8} />
            <meshStandardMaterial attach="material-2" color="#B98235" />
          </mesh>
        ))}
        <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.185, 26]} /><meshStandardMaterial color="#9C4A14" roughness={0.15} transparent opacity={0.75} /></mesh>
        <mesh position={[0.01, 0.15, 0.0]} rotation={[0, 0.4, 0]}><boxGeometry args={[0.05, 0.022, 0.045]} /><meshStandardMaterial color="#F7E38E" roughness={0.3} /></mesh>
      </group>);
    case "pudding": return (
      <group>
        <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.185, 26]} /><meshStandardMaterial color="#F0CE6A" roughness={0.2} /></mesh>
        <mesh position={[0, 0.012, 0]} scale={[1, 0.85, 1]}><sphereGeometry args={[0.125, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial map={T.pudding} roughness={0.75} /></mesh>
        <mesh position={[0, 0.014, 0]} scale={[1, 0.85, 1]}><sphereGeometry args={[0.128, 22, 8, 0, Math.PI * 2, 0, 0.75]} /><meshStandardMaterial color="#FFF3CC" roughness={0.3} /></mesh>
        <mesh position={[0.07, 0.012, 0.09]} scale={[1, 0.3, 1]}><sphereGeometry args={[0.03, 8, 6]} /><meshStandardMaterial color="#FFF3CC" roughness={0.3} /></mesh>
      </group>);
    case "roast": return (
      <group>
        <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.16, 24]} /><meshStandardMaterial color="#3A1E0C" roughness={0.12} /></mesh>
        <Ball p={[-0.05, 0.06, -0.03]} s={[1.5, 0.75, 0.95]} r={0.09} c="#7A4525" tex={T.roast} rot={[0, 0.3, 0]} />
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.08 + i * 0.022, 0.05 + i * 0.006, 0.04]} rotation={[0, 0.3, -0.5 - i * 0.05]}><cylinderGeometry args={[0.06, 0.06, 0.016, 18]} />
            <meshStandardMaterial attach="material-0" color="#8A5232" /><meshStandardMaterial attach="material-1" map={T.slice} roughness={0.5} /><meshStandardMaterial attach="material-2" map={T.slice} />
          </mesh>
        ))}
        <mesh position={[-0.02, 0.022, 0.1]} rotation={[0, 0.5, Math.PI / 2]}><cylinderGeometry args={[0.02, 0.011, 0.1, 12]} /><meshStandardMaterial color="#EB7F1E" roughness={0.5} /></mesh>
        <mesh position={[-0.09, 0.022, 0.09]} rotation={[0, -0.4, Math.PI / 2]}><cylinderGeometry args={[0.02, 0.011, 0.09, 12]} /><meshStandardMaterial color="#DC6614" roughness={0.5} /></mesh>
        <Chunk p={[0.07, 0.03, -0.09]} s={0.03} c="#D9B36A" rot={0.5} />
        <Chunk p={[-0.06, 0.03, -0.11]} s={0.028} c="#CFA65A" rot={1.5} />
      </group>);
    case "hash": return (
      <group>
        <Mound r={0.16} h={0.055} tex={T.hash} side="#8A5A2A" />
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[(rnd(i * 3) - 0.5) * 0.18, 0.06 + rnd(i) * 0.012, (rnd(i * 3 + 1) - 0.5) * 0.18]} rotation={[rnd(i), rnd(i + 2) * 3, rnd(i + 5)]}><boxGeometry args={[0.028, 0.02, 0.028]} /><meshStandardMaterial color={["#E2C088", "#C77A2C", "#8C4E22"][i % 3]} roughness={0.7} /></mesh>
        ))}
        <Egg p={[0.0, 0.058, 0.0]} s={1.15} />
      </group>);
    case "cookies": return (
      <group>
        {[[0.075, 0.03, 0], [-0.075, 0.0, 0.04], [0.02, -0.075, 0.0], [-0.02, 0.075, 0.1]].map(([x, z, tz], i) => (
          <mesh key={"a" + i} position={[x, 0.01, z]} rotation={[0, i, tz]}><cylinderGeometry args={[0.068, 0.068, 0.014, 18]} /><meshStandardMaterial attach="material-0" color="#B7742C" /><meshStandardMaterial attach="material-1" map={T.cookie} roughness={0.9} /><meshStandardMaterial attach="material-2" color="#8E5A20" /></mesh>
        ))}
        {[[0.03, 0.03], [-0.045, -0.02], [0.0, -0.05]].map(([x, z], i) => (
          <mesh key={"b" + i} position={[x, 0.026, z]} rotation={[0.08 * i, i * 2, 0.05]}><cylinderGeometry args={[0.066, 0.066, 0.014, 18]} /><meshStandardMaterial attach="material-0" color="#B7742C" /><meshStandardMaterial attach="material-1" map={T.cookie} roughness={0.9} /><meshStandardMaterial attach="material-2" color="#8E5A20" /></mesh>
        ))}
        <mesh position={[0.005, 0.043, 0.0]} rotation={[0.05, 1, 0.1]}><cylinderGeometry args={[0.064, 0.064, 0.014, 18]} /><meshStandardMaterial attach="material-0" color="#B7742C" /><meshStandardMaterial attach="material-1" map={T.cookie} roughness={0.9} /><meshStandardMaterial attach="material-2" color="#8E5A20" /></mesh>
        <mesh position={[0.13, 0.05, 0.1]} rotation={[0.5, 0.3, 0.9]}><cylinderGeometry args={[0.06, 0.06, 0.014, 18]} /><meshStandardMaterial attach="material-0" color="#B7742C" /><meshStandardMaterial attach="material-1" map={T.cookie} roughness={0.9} /><meshStandardMaterial attach="material-2" color="#8E5A20" /></mesh>
      </group>);
  }
  return null;
};
const HOT: Record<DishKind, number> = { empty: 0, stew: 1, pie: 0.6, bread: 0.35, beans: 1, soup: 1.4, fried: 0.8, pancakes: 0.8, pudding: 0.7, roast: 1, hash: 0.9, cookies: 0.15 };
const STEAM_Y: Record<DishKind, number> = { empty: 0, stew: 0.09, pie: 0.11, bread: 0.2, beans: 0.14, soup: 0.11, fried: 0.06, pancakes: 0.19, pudding: 0.16, roast: 0.12, hash: 0.1, cookies: 0.1 };

const PlacedDish: React.FC<{ d: CookhouseDish; T: Record<string, any>; frame: number; fps: number; camX: number; focus: boolean }> = ({ d, T, frame, fps, camX, focus }) => {
  const served = d.at <= 0; // ya servido desde el frame 0: sin pop
  const dt = served ? 1e6 : frame - d.at * fps;
  if (dt < 0) return null;
  const p = placeOf(d.n);
  const sp = served ? 1 : spring({ frame: dt, fps, config: { damping: 9, stiffness: 150, mass: 0.7 } });
  const s = Math.max(0.001, sp);
  const drop = (1 - clamp01(dt / 9)) * 0.14;
  const face = p.z < 0 ? 0.25 : -0.25;
  const ring = Math.max(0, 1 - dt / (0.7 * fps));
  const near = Math.abs(p.x - camX) < 9;
  const tex = softTex();
  return (
    <group position={[p.x, 0.815 + drop, p.z]} rotation={[0, face + (rnd(d.n) - 0.5) * 0.4, 0]}>
      <group scale={s * DISH_K}>
        <Food kind={d.kind} T={T} />
      </group>
      {ring > 0 ? (
        <sprite position={[0, 0.05, 0]} scale={[0.5 + (1 - ring) * 0.7, 0.5 + (1 - ring) * 0.7, 1]}><spriteMaterial map={tex} color="#FFD58A" transparent opacity={ring * 0.55} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
      ) : null}
      {focus ? <sprite position={[0, 0.02, 0]} scale={[0.95, 0.95, 1]}><spriteMaterial map={tex} color="#FFC46A" transparent opacity={0.22 + 0.05 * Math.sin(frame * 0.2)} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite> : null}
      {near && d.kind !== "empty" ? <Steam pos={[0, STEAM_Y[d.kind] * DISH_K, 0]} frame={frame} fps={fps} n={d.kind === "soup" || d.kind === "stew" ? 4 : 3} seed={d.n * 3} amt={HOT[d.kind] * (served ? 0.8 : clamp01(dt / 10) * Math.max(0.25, 1 - dt / (fps * 60)))} size={0.17} rise={0.7} speed={0.4} /> : null}
    </group>
  );
};

// ─── instancias ───
const Inst: React.FC<{ geo: any; mat: any; list: number[][]; rotX?: boolean }> = ({ geo, mat, list, rotX }) => {
  const ref = useRef<any>(null);
  const args = useMemo(() => [geo, mat, list.length], [geo, mat, list]);
  useLayoutEffect(() => {
    const m = ref.current; if (!m) return;
    const o = new THREE.Object3D();
    list.forEach((p, i) => { o.position.set(p[0], p[1], p[2]); o.scale.set(p[3], p[4], p[5]); o.rotation.set(rotX ? Math.PI / 2 : 0, p[6], 0); o.updateMatrix(); m.setMatrixAt(i, o.matrix); });
    m.instanceMatrix.needsUpdate = true;
  }, [list]);
  return <instancedMesh ref={ref} args={args as any} frustumCulled={false} />;
};

const NSLOT = 20;
const DISH_K = 1.35;
function useSetting() {
  return useMemo(() => {
    const plates: number[][] = [], cups: number[][] = [], loaves: number[][] = [], pitchers: number[][] = [], shadows: number[][] = [];
    for (let lane = 0; lane < 4; lane++) for (let s = 0; s < NSLOT; s++) {
      const x = SLOT0 + s * SLOT_DX + (lane >= 2 ? 0.0 : 0), z = LANE_Z[lane];
      plates.push([x, 0.815, z, 1, 1, 1, 0]);
      cups.push([x + 0.33, 0.845, z + (z < 0 ? 0.07 : -0.07) + (rnd(lane * 50 + s) - 0.5) * 0.05, 1, 1, 1, 0]);
      shadows.push([x, 0.803, z, 1, 1, 1, 0]);
    }
    for (let s = 1; s < NSLOT; s += 4) for (let side = 0; side < 2; side++) {
      const z = side ? 1.5 : -1.5; const x = SLOT0 + s * SLOT_DX + 0.36;
      if (s % 8 !== 1) loaves.push([x, 0.86, z + (rnd(s + side * 9) - 0.5) * 0.15, 1, 1, 1, rnd(s + side) * 2]);
      else pitchers.push([x, 0.86, z, 1, 1, 1, 0]);
    }
    return { plates, cups, loaves, pitchers, shadows };
  }, []);
}

const Lantern: React.FC<{ x: number; i: number; frame: number; mats: any }> = ({ x, i, frame, mats }) => {
  const f = flick(frame, i + 1);
  const tex = softTex();
  return (
    <group position={[x, 2.72, 0]}>
      <mesh position={[0, 0.5, 0]} material={mats.dark}><cylinderGeometry args={[0.008, 0.008, 0.72, 5]} /></mesh>
      <mesh position={[0, 0.17, 0]} material={mats.dark}><coneGeometry args={[0.13, 0.1, 10]} /></mesh>
      <mesh position={[0, -0.16, 0]} material={mats.dark}><cylinderGeometry args={[0.09, 0.11, 0.05, 10]} /></mesh>
      <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.085, 0.085, 0.27, 12]} /><meshBasicMaterial color={f > 1 ? "#FFD27A" : "#FFC260"} toneMapped={false} /></mesh>
      <mesh position={[0, 0.0, 0]} scale={[1, 1, 1]}><cylinderGeometry args={[0.105, 0.105, 0.27, 8, 1, true]} /><meshBasicMaterial color="#FFB040" transparent opacity={0.18} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      <sprite position={[0, 0, 0]} scale={[2.6 * f, 2.6 * f, 1]}><spriteMaterial map={tex} color="#FFB552" transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
    </group>
  );
};

const Window: React.FC<{ p: V3; ry: number; w: number; h: number; snow: any; wood: any; big?: boolean }> = ({ p, ry, w, h, snow, wood, big }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <mesh position={[0, 0, 0.005]}><planeGeometry args={[w, h]} /><meshBasicMaterial map={snow} color={big ? "#ffffff" : "#c9d8e8"} toneMapped={false} /></mesh>
    {[[0, h / 2 + 0.05, w + 0.2, 0.1], [0, -h / 2 - 0.05, w + 0.3, 0.1], [-w / 2 - 0.05, 0, 0.1, h], [w / 2 + 0.05, 0, 0.1, h], [0, 0, w, 0.04], [0, 0, 0.04, h]].map(([x, y, sw, sh], i) => (
      <mesh key={i} position={[x, y, 0.05]}><boxGeometry args={[sw, sh, 0.1]} /><meshStandardMaterial map={wood} roughness={0.9} /></mesh>
    ))}
  </group>
);

const SignBoard: React.FC<{ s: CookhouseSign; frame: number; fps: number; pos: V3; ry: number }> = ({ s, frame, fps, pos, ry }) => {
  const tex = useMemo(() => canvasTex((c, W, H) => {
    c.fillStyle = "#6a4526"; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 24; i++) { c.strokeStyle = `rgba(25,12,4,${0.2 + rnd(i) * 0.3})`; c.lineWidth = 1 + rnd(i + 2) * 2; const y = rnd(i + 5) * H; c.beginPath(); c.moveTo(0, y); c.lineTo(W, y + (rnd(i) - 0.5) * 6); c.stroke(); }
    c.strokeStyle = "#2A170A"; c.lineWidth = 10; c.strokeRect(6, 6, W - 12, H - 12);
    c.fillStyle = OLE.cream; c.textAlign = "center"; c.textBaseline = "middle"; c.font = `${Math.min(110, 1500 / Math.max(6, s.text.length))}px ${SLAB}`;
    c.shadowColor = "rgba(0,0,0,0.6)"; c.shadowBlur = 6; c.fillText(s.text.toUpperCase(), W / 2, H / 2 + 4);
  }, 1024, 256), [s.text]);
  const a = clamp01((frame / fps - (s.at ?? 0)) / 0.5);
  if (a <= 0) return null;
  return <mesh position={pos} rotation={[0, ry, 0]} scale={[a, a, 1]}><planeGeometry args={[3.4, 0.85]} /><meshBasicMaterial map={tex} color="#E8D2B0" fog={false} toneMapped={false} /></mesh>;
};

export const OleCookhouse3D: React.FC<OleCookhouse3DProps> = ({
  dishes = [], camAlong, focusN, camTo, intro = false, total = 30, signs = [], vignette = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const fontsOk = useFontsReady(signs.length ? [SLAB] : []);
  const R = useRoomTex();
  const kinds = useMemo(() => Array.from(new Set(dishes.map((d) => d.kind))), [JSON.stringify(dishes.map((d) => d.kind))]); // eslint-disable-line
  const T = useFoodTex(kinds);
  const S = useSetting();
  const G = useMemo(() => ({
    plate: new THREE.CylinderGeometry(0.19 * DISH_K, 0.145 * DISH_K, 0.03, 24),
    cup: new THREE.CylinderGeometry(0.058, 0.044, 0.095, 14),
    loaf: new THREE.SphereGeometry(0.11, 12, 8),
    pitcher: new THREE.CylinderGeometry(0.045, 0.055, 0.17, 12),
    shadow: new THREE.CircleGeometry(0.32, 18).rotateX(-Math.PI / 2),
    plateMat: new THREE.MeshStandardMaterial({ color: "#E2EAF2", roughness: 0.4, metalness: 0.3, map: R.plate }),
    cupMat: new THREE.MeshStandardMaterial({ color: "#3F6BC0", roughness: 0.4, metalness: 0.0, emissive: "#0E1E44", emissiveIntensity: 0.6 }),
    loafMat: new THREE.MeshStandardMaterial({ color: "#A66A30", roughness: 0.8 }),
    pitchMat: new THREE.MeshStandardMaterial({ color: "#E4DFCC", roughness: 0.35, metalness: 0.05 }),
    rimMat: new THREE.MeshStandardMaterial({ color: "#F2EEE0", roughness: 0.3 }),
    rimGeo: new THREE.TorusGeometry(0.06, 0.008, 6, 14),
    dark: new THREE.MeshStandardMaterial({ color: "#1c1714", roughness: 0.6, metalness: 0.4 }),
    tableM: new THREE.MeshStandardMaterial({ map: R.table, roughness: 0.85 }),
    woodM: new THREE.MeshStandardMaterial({ map: R.wood, roughness: 0.9 }),
    benchM: new THREE.MeshStandardMaterial({ map: R.table, color: "#9a8d80", roughness: 0.9 }),
    wallM: new THREE.MeshStandardMaterial({ map: R.logWall, roughness: 0.95 }),
    floorM: new THREE.MeshStandardMaterial({ map: R.floor, roughness: 0.9 }),
    ceilM: new THREE.MeshStandardMaterial({ map: R.ceiling, roughness: 1 }),
    shadowM: new THREE.MeshBasicMaterial({ map: R.shadow, transparent: true, depthWrite: false }),
  }), [R]);
  R.snow.wrapT = THREE.RepeatWrapping; R.snow.offset.y = -(frame * 0.006) % 1;

  // ── cámara sobre los platos ──
  const list = useMemo(() => dishes.filter((d) => d.n >= 1 && d.n <= total).slice().sort((a, b) => a.at - b.at || a.n - b.n), [JSON.stringify(dishes), total]); // eslint-disable-line
  const pl = (n: number) => placeOf(n);
  const dur = durationInFrames / fps;
  const servedList = list.filter((d) => d.at <= 0), newList = list.filter((d) => d.at > 0);
  const start = focusN ? pl(focusN) : servedList.length ? pl(servedList[servedList.length - 1].n) : newList.length ? { x: SLOT0 - 0.4, z: 0 } : { x: SLOT0 + 1.2, z: 0 };
  let A = { x: start.x, z: start.z };
  let push = clamp01(t / Math.max(4, dur));
  if (camTo) {
    const p1 = pl(camTo), u = ease(t / Math.max(0.5, dur));
    A = { x: start.x + (p1.x - start.x) * u, z: start.z + (p1.z - start.z) * u };
  } else if (camAlong) {
    const lastN = list.length ? list[list.length - 1].n : total, p0 = pl(1), p1 = pl(lastN);
    const u = ease((t - camAlong.from) / Math.max(0.01, camAlong.to - camAlong.from));
    A = { x: p0.x + (p1.x - p0.x) * u, z: (p0.z + p1.z) / 2 * 0.3 };
  } else {
    let cur = { x: start.x, z: start.z };
    for (let i = 0; i < newList.length; i++) {
      if (t < newList[i].at) break;
      const p = pl(newList[i].n), gap = i + 1 < newList.length ? Math.max(0.3, newList[i + 1].at - newList[i].at) : 9, dd = Math.min(1.5, gap * 0.95);
      const u = ease((t - newList[i].at) / dd);
      const to = { x: p.x, z: p.z };
      if (u >= 1) { cur = to; continue; }
      cur = { x: cur.x + (to.x - cur.x) * u, z: cur.z + (to.z - cur.z) * u }; break;
    }
    A = cur;
    push = 0;
  }
  const dist = 1.8 - push * 0.3;
  const camXr = Math.max(-0.4, Math.min(17, A.x - dist));
  const railPos: V3 = [camXr + Math.sin(t * 0.6) * 0.05, 1.2 + Math.abs(A.z) * 0.1 + Math.sin(t * 1.9) * 0.02 + Math.sin(t * 3.7) * 0.01, A.z * 0.5 + Math.sin(t * 0.7) * 0.05];
  const railLook: V3 = [A.x + 0.15 + Math.sin(t * 0.5) * 0.04, 0.8, A.z * 1.0];
  const introDur = Math.min(4.5, dur * 0.6);
  const w = intro ? 1 - ease(t / introDur) : 0;
  const introPos: V3 = [-0.3, 1.8, 0.05], introLook: V3 = [9.5, 0.95, 0];
  const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  const pos = mix(railPos, introPos, w), look = mix(railLook, introLook, w);
  const cx = pos[0];

  const lanterns = [0, 1, 2, 3, 4, 5, 6];
  const L = (a: number) => flick(frame, a);
  const beams = useMemo(() => Array.from({ length: 9 }, (_, i) => X0 + 1.2 + i * 2.4), []);
  const trest = useMemo(() => Array.from({ length: 7 }, (_, i) => SLOT0 - 0.2 + i * 2.6), []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#140b06" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 46, position: pos, near: 0.05, far: 60 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamRig pos={pos} look={look} roll={Math.sin(t * 0.8) * 0.006} fov={46 + 14 * w} />
        <color attach="background" args={["#170d07"]} />
        <fog attach="fog" args={["#2a1a10", 6, 30]} />
        <hemisphereLight args={["#77808C", "#24170D", 0.6]} />
        <directionalLight position={[3, 4, 6]} intensity={0.35} color="#7FA0CC" />
        <pointLight position={[cx + 1.4, 2.5, 0]} color="#FFBE78" intensity={16 * L(1)} distance={10} decay={1.5} />
        <pointLight position={[cx + 4.6, 2.5, 0]} color="#FFB060" intensity={12 * L(4)} distance={10} decay={1.5} />
        <pointLight position={[cx + 0.3, 1.9, 0.0]} color="#FFD2A0" intensity={2.6} distance={4.5} decay={1.6} />

        {/* estructura */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(X0 + X1) / 2, 0, 0]} material={G.floorM}><planeGeometry args={[X1 - X0, ZW * 2]} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[(X0 + X1) / 2, RH, 0]} material={G.ceilM}><planeGeometry args={[X1 - X0, ZW * 2]} /></mesh>
        {[-1, 1].map((sd) => (
          <mesh key={sd} position={[(X0 + X1) / 2, RH / 2, sd * ZW]} rotation={[0, sd > 0 ? Math.PI : 0, 0]} material={G.wallM}><planeGeometry args={[X1 - X0, RH]} /></mesh>
        ))}
        <mesh position={[X1, RH / 2, 0]} rotation={[0, -Math.PI / 2, 0]} material={G.wallM}><planeGeometry args={[ZW * 2, RH]} /></mesh>
        <mesh position={[X0, RH / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={G.wallM}><planeGeometry args={[ZW * 2, RH]} /></mesh>
        {/* vigas */}
        {beams.map((x, i) => (
          <group key={i}>
            <mesh position={[x, RH - 0.2, 0]} material={G.woodM}><boxGeometry args={[0.26, 0.3, ZW * 2]} /></mesh>
            <mesh position={[x, RH - 0.6, ZW - 0.5]} rotation={[0, 0, 0]} material={G.woodM}><boxGeometry args={[0.14, 0.14, 1.0]} /></mesh>
            <mesh position={[x, RH - 0.6, -ZW + 0.5]} material={G.woodM}><boxGeometry args={[0.14, 0.14, 1.0]} /></mesh>
          </group>
        ))}
        <mesh position={[(X0 + X1) / 2, RH - 0.05, 0]} material={G.woodM}><boxGeometry args={[X1 - X0, 0.22, 0.34]} /></mesh>
        {/* ventanas con nieve */}
        {[5.2, 10, 14.8].map((x, i) => (<React.Fragment key={i}>
          <Window p={[x, 1.9, -ZW + 0.02]} ry={0} w={1.2} h={0.95} snow={R.snow} wood={R.wood} />
          <Window p={[x + 2.2, 1.9, ZW - 0.02]} ry={Math.PI} w={1.2} h={0.95} snow={R.snow} wood={R.wood} />
        </React.Fragment>))}
        <Window p={[X1 - 0.02, 1.95, 0]} ry={-Math.PI / 2} w={1.7} h={1.25} snow={R.snow} wood={R.wood} big />
        <sprite position={[X1 - 0.6, 1.9, 0]} scale={[5, 3.6, 1]}><spriteMaterial map={softTex()} color="#8FB4E0" transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>

        {/* mesas: tablones, caballetes y bancos */}
        {[-1, 1].map((sd) => (
          <group key={sd}>
            <mesh position={[(SLOT0 - 0.6 + X1 - 1.4) / 2, 0.77, sd * 1.5]} material={G.tableM}><boxGeometry args={[X1 - 1.4 - (SLOT0 - 0.6), 0.05, 1.0]} /></mesh>
            {[-0.25, 0.25].map((o) => (<mesh key={o} position={[(SLOT0 - 0.6 + X1 - 1.4) / 2, 0.735, sd * (1.5 + o * 1.8)]} material={G.woodM}><boxGeometry args={[X1 - 1.4 - (SLOT0 - 0.6), 0.04, 0.06]} /></mesh>))}
            {[-1, 1].map((sb) => (
              <mesh key={sb} position={[(SLOT0 - 0.6 + X1 - 1.4) / 2, 0.45, sd * (1.5 + sb * 0.82)]} material={G.benchM}><boxGeometry args={[X1 - 1.4 - (SLOT0 - 0.6), 0.055, 0.3]} /></mesh>
            ))}
            {trest.map((x, i) => (
              <group key={i} position={[x, 0, sd * 1.5]}>
                <mesh position={[0, 0.38, -0.34]} material={G.woodM}><boxGeometry args={[0.08, 0.76, 0.09]} /></mesh>
                <mesh position={[0, 0.38, 0.34]} material={G.woodM}><boxGeometry args={[0.08, 0.76, 0.09]} /></mesh>
                {[-1, 1].map((sb) => (<mesh key={sb} position={[0, 0.22, sb * 0.82]} material={G.woodM}><boxGeometry args={[0.08, 0.44, 0.08]} /></mesh>))}
                <mesh position={[0, 0.2, 0]} material={G.woodM}><boxGeometry args={[0.06, 0.05, 1.7]} /></mesh>
              </group>
            ))}
          </group>
        ))}
        <Inst geo={G.shadow} mat={G.shadowM} list={S.shadows.map((p) => [p[0], p[1], p[2], 1, 1, 1, 0])} />
        <Inst geo={G.plate} mat={G.plateMat} list={S.plates} />
        <Inst geo={G.cup} mat={G.cupMat} list={S.cups} />
        <Inst geo={G.rimGeo} mat={G.rimMat} list={S.cups.map((c) => [c[0], c[1] + 0.045, c[2], 1, 1, 1, 0])} rotX />
        <Inst geo={G.loaf} mat={G.loafMat} list={S.loaves.map((p) => [p[0], p[1], p[2], 1.6, 0.62, 0.75, p[6]])} />
        <Inst geo={G.pitcher} mat={G.pitchMat} list={S.pitchers} />

        {/* platos servidos */}
        {list.map((d) => <PlacedDish key={d.n} d={d} T={T} frame={frame} fps={fps} camX={cx} focus={focusN === d.n} />)}

        {/* farolas */}
        {lanterns.map((i) => <Lantern key={i} x={1.2 + i * 2.9} i={i} frame={frame} mats={G} />)}

        {/* cocina y mostrador al fondo (lado del cocinero) */}
        <group position={[X0 + 0.55, 0, 2.5]} rotation={[0, Math.PI / 2, 0]}><StoveModel frame={frame} fps={fps} light={cx < 6} /></group>
        <mesh position={[X0 + 0.4, 0.5, -1.2]} material={G.woodM}><boxGeometry args={[0.7, 1.0, 3.2]} /></mesh>
        <mesh position={[X0 + 0.4, 1.02, -1.2]} material={G.tableM}><boxGeometry args={[0.8, 0.05, 3.3]} /></mesh>
        {[-2.2, -1.3, -0.4].map((z, i) => (
          <group key={i} position={[X0 + 0.4, 1.05, z]}>
            <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.2, 0.22, 0.28, 18]} /><meshStandardMaterial color={i === 1 ? "#2B4C8C" : "#26221F"} roughness={0.45} metalness={0.3} /></mesh>
            <Steam pos={[0, 0.3, 0]} frame={frame} fps={fps} n={3} size={0.16} rise={0.8} seed={60 + i} amt={0.9} />
          </group>
        ))}
        <mesh position={[X0 + 0.05, 2.0, 0.2]} material={G.woodM}><boxGeometry args={[0.2, 0.06, 3.2]} /></mesh>

        {/* carteles opcionales */}
        {fontsOk && signs.map((s, i) => s.where === "cook"
          ? <SignBoard key={i} s={s} frame={frame} fps={fps} pos={[X0 + 0.03, 2.35, -1.0]} ry={Math.PI / 2} />
          : <SignBoard key={i} s={s} frame={frame} fps={fps} pos={[X1 - 0.03, 2.5, -2.4]} ry={-Math.PI / 2} />)}

        <Motes frame={frame} center={[cx + 3, 0.2, 0]} span={[9, 3, 6]} n={110} seed={3} opacity={0.55} size={0.045} />
        <Motes frame={frame} center={[cx + 1.5, 0.6, 0]} span={[4, 1.6, 2.4]} n={40} seed={9} opacity={0.65} size={0.03} color="#FFF0C8" />
      </ThreeCanvas>
      {vignette ? <>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 52%, rgba(0,0,0,0) 45%, rgba(8,3,0,0.55) 100%)", pointerEvents: "none" }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,170,70,0.06), rgba(40,10,0,0.08))", mixBlendMode: "soft-light", pointerEvents: "none" }} />
      </> : null}
    </AbsoluteFill>
  );
};
