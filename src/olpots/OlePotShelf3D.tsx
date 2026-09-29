// OlePotShelf3D — la repisa de campamento con las 5 ollas (3D real, @remotion/three), versión 2.
// 0 Dutch oven de hierro · 1 sartén de hierro (apoyada de canto contra los troncos) · 2 olla enlozada moteada · 3 olla de acero inoxidable con base
// gruesa · 4 cacerola pesada con tapa. Troncos redondos con corteza, tablón de pino con veta, farol colgado con luz cálida que PROYECTA SOMBRAS,
// frascos, tazas de lata. Al nombrar una olla la cámara se acerca y ella gira sobre su eje (turntable); aparece su ficha técnica (props) y el sello
// BUY / SKIP cae con rebote y golpe de cámara. Vapor en las ollas "en uso". Todo determinista por useCurrentFrame (nada de useFrame / Math.random).
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
// @ts-ignore
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { OLE, LABEL, HAND, SERIF, rnd, hexA } from "./OleTheme";
import { CamRig, canvasTex, dots, clamp01, easeOut, ease, projectTo, ironTextures, BODY_PROFILE, LID_PROFILE, tube, softTex } from "./OleDutchOven3D";

export type PotSpec = { pot: number; kicker?: string; title: string; lines: string[] };
export type PotStamp = { at: number; pot: number; kind: "buy" | "skip"; text?: string };
export type PotFocus = { at: number; pot: number }; // pot -1 = toda la repisa
export type OlePotShelf3DProps = {
  focus?: PotFocus[];
  specs?: PotSpec[];
  stamps?: PotStamp[];
  /** segundos en que cae cada olla a la repisa (por defecto escalonadas desde 0.1) */
  appear?: number[];
  show?: number[];
  /** giro de fondo (grados/seg) de todas las ollas; la enfocada gira el triple (turntable) */
  spinDegPerSec?: number;
  tags?: string[];
  /** ollas con vapor (en uso) */
  steam?: number[];
};

const X = [-3.55, -1.8, 0, 1.85, 3.5];
const SC = [0.82, 0.68, 0.74, 0.66, 0.52];
const OVERVIEW = { p: [0, 1.6, 8.5] as [number, number, number], l: [0, 0.92, 0] as [number, number, number] };
const FOV = 36;

export const shelfCam = (focus: PotFocus[] | undefined, t: number, stamps?: PotStamp[]) => {
  const tgt = (pot: number) => (pot < 0 ? OVERVIEW : { p: [X[pot] * 0.72, 1.55, 4.1] as [number, number, number], l: [X[pot], 0.72, 0] as [number, number, number] });
  const f = (focus ?? []).slice().sort((a, b) => a.at - b.at);
  let a = tgt(-1), b = a, at = 0;
  for (const k of f) { if (t >= k.at) { a = b; b = tgt(k.pot); at = k.at; } }
  const u = ease(clamp01((t - at) / 1.1));
  const orbit = b === OVERVIEW ? 0 : Math.sin((t - at) * 0.55) * 0.55 * u; // giro suave alrededor de la olla enfocada
  const p = a.p.map((v, i) => v + (b.p[i] - v) * u) as [number, number, number];
  const l = a.l.map((v, i) => v + (b.l[i] - v) * u) as [number, number, number];
  p[0] += orbit;
  // golpe de cámara al caer un sello
  for (const s of stamps ?? []) { const d = t - s.at; if (d > 0 && d < 0.4) { const k = Math.exp(-d * 9); p[1] += Math.sin(d * 80) * 0.06 * k; p[0] += Math.cos(d * 65) * 0.03 * k; } }
  return { p, l };
};

function useMats() {
  return useMemo(() => {
    const { rough, col } = ironTextures();
    const iron = new THREE.MeshStandardMaterial({ map: col, roughnessMap: rough, bumpMap: rough, bumpScale: 1.2, roughness: 0.6, metalness: 0.55, envMapIntensity: 0.8, side: THREE.DoubleSide });
    const enamel = new THREE.MeshPhysicalMaterial({
      map: canvasTex((c, W, H) => { c.fillStyle = "#EDEFEA"; c.fillRect(0, 0, W, H); dots(c, W, H, 5, 1100, "#23282f", 0.7, 2.1, 0.7); dots(c, W, H, 11, 700, "#6f7a86", 0.7, 1.8, 0.55); dots(c, W, H, 19, 40, "#b7a98b", 2, 5, 0.25); }, 512, 512, 3, 2),
      roughness: 0.16, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.3, side: THREE.DoubleSide,
    });
    const enamelRim = new THREE.MeshPhysicalMaterial({ color: OLE.enamel, roughness: 0.2, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.2, side: THREE.DoubleSide });
    const brushed = canvasTex((c, W, H) => { c.fillStyle = "#c7cbcf"; c.fillRect(0, 0, W, H); for (let i = 0; i < 260; i++) { c.strokeStyle = `rgba(${i % 2 ? 255 : 110},${i % 2 ? 255 : 115},${i % 2 ? 255 : 120},${0.03 + rnd(i) * 0.06})`; c.lineWidth = 0.6 + rnd(i + 3) * 0.8; c.beginPath(); const y = rnd(i + 9) * H; c.moveTo(0, y); c.lineTo(W, y + (rnd(i + 5) - 0.5) * 3); c.stroke(); } }, 512, 512, 4, 1);
    const steel = new THREE.MeshStandardMaterial({ map: brushed, color: "#ffffff", roughness: 0.28, metalness: 0.95, envMapIntensity: 1.7, side: THREE.DoubleSide });
    const steelDark = new THREE.MeshStandardMaterial({ color: "#8d9298", roughness: 0.34, metalness: 0.95, envMapIntensity: 1.5, side: THREE.DoubleSide });
    const plank = new THREE.MeshStandardMaterial({
      map: canvasTex((c, W, H) => {
        c.fillStyle = "#9b6c3f"; c.fillRect(0, 0, W, H);
        for (let i = 0; i < 140; i++) { c.strokeStyle = `rgba(${45 + (i % 5) * 9},${26 + (i % 4) * 6},10,${0.07 + rnd(i) * 0.2})`; c.lineWidth = 1 + rnd(i + 3) * 3.5; c.beginPath(); const y = rnd(i + 9) * H; c.moveTo(0, y); c.bezierCurveTo(W * 0.3, y + rnd(i + 2) * 16 - 8, W * 0.6, y + rnd(i + 5) * 16 - 8, W, y + rnd(i + 7) * 10 - 5); c.stroke(); }
        c.fillStyle = "rgba(40,22,8,0.55)"; c.beginPath(); c.ellipse(W * 0.72, H * 0.42, 34, 14, 0.1, 0, 7); c.fill(); c.fillStyle = "rgba(255,225,170,0.10)"; c.fillRect(0, 0, W, 5);
      }, 1024, 256, 1, 1), roughness: 0.82, metalness: 0,
    });
    const bark = new THREE.MeshStandardMaterial({
      map: canvasTex((c, W, H) => {
        c.fillStyle = "#5b3d24"; c.fillRect(0, 0, W, H);
        for (let i = 0; i < 260; i++) { const x = rnd(i) * W; c.strokeStyle = `rgba(${22 + (i % 6) * 6},${12 + (i % 4) * 4},4,${0.15 + rnd(i + 1) * 0.35})`; c.lineWidth = 1 + rnd(i + 2) * 5; c.beginPath(); c.moveTo(x, 0); c.bezierCurveTo(x + (rnd(i + 3) - 0.5) * 30, H * 0.3, x + (rnd(i + 4) - 0.5) * 30, H * 0.7, x + (rnd(i + 5) - 0.5) * 20, H); c.stroke(); }
        for (let i = 0; i < 30; i++) { c.fillStyle = `rgba(140,100,60,${0.05 + rnd(i + 40) * 0.1})`; c.fillRect(rnd(i + 50) * W, rnd(i + 60) * H, 40 + rnd(i) * 90, 3); }
      }, 512, 512, 6, 9), roughness: 0.95, metalness: 0,
    });
    const glass = new THREE.MeshStandardMaterial({ color: "#ffb45a", emissive: "#ff8a1f", emissiveIntensity: 2.2, transparent: true, opacity: 0.85 });
    const jar = new THREE.MeshPhysicalMaterial({ color: "#cfe2dc", transparent: true, opacity: 0.35, roughness: 0.05, clearcoat: 1 });
    const beans = new THREE.MeshStandardMaterial({ color: "#4a2a18", roughness: 0.8 });
    const tin = new THREE.MeshStandardMaterial({ color: OLE.enamel, roughness: 0.3, metalness: 0.2 });
    return { iron, enamel, enamelRim, steel, steelDark, plank, bark, glass, jar, beans, tin };
  }, []);
}

function useGeoms() {
  return useMemo(() => {
    const P = (pts: [number, number][], seg = 64) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
    const dutch = P(BODY_PROFILE), dutchLid = P(LID_PROFILE);
    const skillet = P([[0, 0], [0.9, 0], [1.0, 0.03], [1.14, 0.22], [1.16, 0.25], [1.1, 0.25], [1.08, 0.22], [0.95, 0.06], [0, 0.05]]);
    const skHandle = tube([[1.1, 0.2, 0], [1.6, 0.19, 0], [2.1, 0.18, 0], [2.35, 0.17, 0]], 0.09);
    const stock = P([[0, 0], [0.98, 0], [1.0, 0.03], [1.0, 1.5], [1.03, 1.52], [1.03, 1.56], [0.96, 1.56], [0.96, 0.05], [0, 0.03]]);
    const stockRim = P([[0.94, 1.5], [1.04, 1.5], [1.04, 1.58], [0.94, 1.58]]);
    const stockLid = P([[0, 1.72], [0.3, 1.66], [0.9, 1.6], [1.06, 1.56], [1.06, 1.53], [0.9, 1.55], [0, 1.6]]);
    const knob = new THREE.SphereGeometry(0.11, 16, 12);
    const ear = tube([[1.02, 1.28, -0.12], [1.28, 1.3, -0.08], [1.34, 1.3, 0], [1.28, 1.3, 0.08], [1.02, 1.28, 0.12]], 0.05);
    const ss = P([[0, 0], [0.92, 0], [0.94, 0.02], [0.94, 0.05], [1.0, 0.06], [1.0, 1.35], [1.03, 1.37], [1.0, 1.4], [0.97, 1.4], [0.97, 0.12], [0, 0.1]]);
    const ssBase = P([[0, -0.02], [0.96, -0.02], [1.0, 0.0], [1.0, 0.16], [0, 0.16]]);
    const ssLid = P([[0, 1.5], [0.4, 1.47], [1.0, 1.43], [1.04, 1.4], [0.98, 1.4], [0.9, 1.42], [0, 1.44]]);
    const ssHandle = tube([[1.0, 1.15, -0.1], [1.22, 1.16, -0.06], [1.26, 1.16, 0], [1.22, 1.16, 0.06], [1.0, 1.15, 0.1]], 0.05);
    const pan = P([[0, 0], [0.88, 0], [0.96, 0.03], [1.0, 0.1], [1.0, 0.86], [1.03, 0.88], [1.0, 0.9], [0.95, 0.9], [0.95, 0.12], [0.85, 0.09], [0, 0.09]]);
    const panLid = P([[0, 1.05], [0.45, 1.0], [0.98, 0.94], [1.03, 0.9], [0.97, 0.9], [0.9, 0.92], [0, 0.97]]);
    const panHandle = tube([[0.98, 0.6, 0], [1.6, 0.66, 0], [2.3, 0.7, 0]], 0.075);
    const torus = new THREE.TorusGeometry(0.09, 0.03, 8, 16);
    const shelf = new THREE.BoxGeometry(13.6, 0.32, 3.0);
    const bracket = new THREE.BoxGeometry(0.34, 1.0, 2.4);
    const log = new THREE.CylinderGeometry(1.05, 1.05, 30, 32);
    const lanternBody = new THREE.CylinderGeometry(0.22, 0.26, 0.5, 14);
    const lanternCap = new THREE.CylinderGeometry(0.1, 0.32, 0.16, 14);
    const jarG = new THREE.CylinderGeometry(0.36, 0.36, 0.8, 24);
    const jarFill = new THREE.CylinderGeometry(0.33, 0.33, 0.55, 24);
    const mug = new THREE.CylinderGeometry(0.22, 0.2, 0.34, 20, 1, true);
    const rope = new THREE.TorusGeometry(0.3, 0.06, 8, 26);
    return { dutch, dutchLid, skillet, skHandle, stock, stockRim, stockLid, knob, ear, ss, ssBase, ssLid, ssHandle, pan, panLid, panHandle, torus, shelf, bracket, log, lanternBody, lanternCap, jarG, jarFill, mug, rope };
  }, []);
}

const Env: React.FC = () => {
  const { gl, scene } = useThree();
  useMemo(() => {
    try { const pm = new THREE.PMREMGenerator(gl); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; } catch (e) { /* sin entorno */ }
  }, [gl, scene]);
  return null;
};

const dropY = (t: number, at: number) => {
  const u = clamp01((t - at) / 0.7); if (u <= 0) return 7;
  const e = 1 - Math.pow(1 - u, 3);
  const bounce = u > 0.78 ? Math.sin((u - 0.78) / 0.22 * Math.PI) * 0.11 : 0;
  return (1 - e) * 7 + bounce;
};

const Steam: React.FC<{ t: number; x: number; y: number; tex: any }> = ({ t, x, y, tex }) => (
  <>{Array.from({ length: 12 }).map((_, i) => {
    const age = (t * 0.55 + i / 12) % 1; const px = x + Math.sin(age * 5 + i * 1.7) * 0.18 + (rnd(i) - 0.5) * 0.25;
    const s = 0.45 + age * 1.3; const o = Math.sin(age * Math.PI) * 0.34;
    return <sprite key={i} position={[px, y + age * 2.1, 0.1 + rnd(i + 4) * 0.3]} scale={[s, s, s]}><spriteMaterial map={tex} transparent opacity={o} depthWrite={false} color="#fff6ea" /></sprite>;
  })}</>
);

const Pot: React.FC<{ i: number; t: number; spin: number; focused: boolean; at: number; g: ReturnType<typeof useGeoms>; m: ReturnType<typeof useMats> }> = ({ i, t, spin, focused, at, g, m }) => {
  const y = dropY(t, at);
  const spinRate = focused ? spin * 3.2 : spin;
  const ry = (spinRate * Math.max(0, t - at) * Math.PI) / 180 + i * 0.7;
  const sc = SC[i];
  const lean = false;
  const c = { castShadow: true, receiveShadow: true } as const;
  return (
    <group position={[X[i], 0.16 + y + (lean ? 0.62 : 0), lean ? -0.55 : 0]} rotation={lean ? [-1.22, 0, 0] : [0, 0, 0]} scale={[sc, sc, sc]}>
      <group rotation={lean ? [0, 0, ry * 0.3] : [0, ry, 0]}>
        {i === 0 && (<>
          <mesh geometry={g.dutch} material={m.iron} {...c} />
          <mesh geometry={g.dutchLid} material={m.iron} position={[0, 0.88, 0]} {...c} />
          {[-1, 1].map((s) => <mesh key={s} geometry={g.torus} material={m.iron} position={[s * 1.03, 0.7, 0]} rotation={[0, Math.PI / 2, 0]} {...c} />)}
        </>)}
        {i === 1 && (<>
          <mesh geometry={g.skillet} material={m.iron} {...c} />
          <mesh geometry={g.skHandle} material={m.iron} {...c} />
          <mesh geometry={g.torus} material={m.iron} position={[-1.1, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} {...c} />
        </>)}
        {i === 2 && (<>
          <mesh geometry={g.stock} material={m.enamel} {...c} />
          <mesh geometry={g.stockRim} material={m.enamelRim} {...c} />
          <mesh geometry={g.stockLid} material={m.enamel} {...c} />
          <mesh geometry={g.knob} material={m.enamelRim} position={[0, 1.74, 0]} {...c} />
          <mesh geometry={g.ear} material={m.enamelRim} {...c} />
          <mesh geometry={g.ear} material={m.enamelRim} rotation={[0, Math.PI, 0]} {...c} />
        </>)}
        {i === 3 && (<>
          <mesh geometry={g.ss} material={m.steel} {...c} />
          <mesh geometry={g.ssBase} material={m.steelDark} {...c} />
          <mesh geometry={g.ssLid} material={m.steel} {...c} />
          <mesh geometry={g.knob} material={m.steelDark} position={[0, 1.52, 0]} {...c} />
          <mesh geometry={g.ssHandle} material={m.steelDark} {...c} />
          <mesh geometry={g.ssHandle} material={m.steelDark} rotation={[0, Math.PI, 0]} {...c} />
        </>)}
        {i === 4 && (<>
          <mesh geometry={g.pan} material={m.steel} {...c} />
          <mesh geometry={g.ssBase} material={m.steelDark} scale={[1, 0.8, 1]} {...c} />
          <mesh geometry={g.panLid} material={m.steel} {...c} />
          <mesh geometry={g.knob} material={m.steelDark} position={[0, 1.07, 0]} scale={[0.85, 0.85, 0.85]} {...c} />
          <mesh geometry={g.panHandle} material={m.iron} {...c} />
        </>)}
      </group>
    </group>
  );
};

const Set: React.FC<{ t: number; g: ReturnType<typeof useGeoms>; m: ReturnType<typeof useMats> }> = ({ t, g, m }) => {
  const sway = Math.sin(t * 1.3) * 0.02;
  const flick = 22 + Math.sin(t * 13) * 2.2 + Math.sin(t * 7.3) * 1.6;
  return (
    <>
      {/* troncos redondos con corteza (dan profundidad y sombras) */}
      {[-3.6, -1.6, 0.35, 2.3, 4.25, 6.2].map((y, k) => <mesh key={k} geometry={g.log} material={m.bark} position={[0, y, -2.3 - (k % 2) * 0.12]} rotation={[0, 0, Math.PI / 2]} receiveShadow />)}
      <mesh geometry={g.shelf} material={m.plank} position={[0, -0.02, 0]} castShadow receiveShadow />
      <mesh geometry={g.bracket} material={m.iron} position={[-5.9, -0.8, -0.2]} castShadow />
      <mesh geometry={g.bracket} material={m.iron} position={[5.9, -0.8, -0.2]} castShadow />
      {/* tazas de lata y frascos de porotos en los extremos */}
      <mesh geometry={g.mug} material={m.tin} position={[-5.2, 0.33, 0.2]} castShadow />
      <mesh geometry={g.mug} material={m.tin} position={[-4.9, 0.33, 0.55]} castShadow />
      <mesh geometry={g.jarG} material={m.jar} position={[5.2, 0.56, -0.5]} castShadow />
      <mesh geometry={g.jarFill} material={m.beans} position={[5.2, 0.44, -0.5]} />
      <mesh geometry={g.jarG} material={m.jar} position={[4.7, 0.56, -1.0]} castShadow />
      <mesh geometry={g.jarFill} material={m.beans} position={[4.7, 0.44, -1.0]} />
      <mesh geometry={g.rope} material={m.plank} position={[-5.0, 0.24, 1.1]} rotation={[Math.PI / 2, 0, 0.3]} castShadow />
      {/* farol colgado: luz cálida que proyecta sombras */}
      <group position={[1.9, 5.1 + sway, 0.6]} rotation={[0, 0, sway]}>
        <mesh geometry={g.lanternBody} material={m.glass} />
        <mesh geometry={g.lanternCap} material={m.iron} position={[0, 0.33, 0]} />
        <mesh position={[0, 1.0, 0]} material={m.iron}><cylinderGeometry args={[0.02, 0.02, 1.4, 6]} /></mesh>
      </group>
      <spotLight position={[1.9, 4.9, 1.3]} target-position={[0, 0, 0]} intensity={360} angle={1.05} penumbra={0.85} color="#ffb765" distance={22} decay={1.7} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
      <pointLight position={[1.9, 5.0, 1.0]} intensity={flick} color="#ff9a3c" distance={16} decay={1.8} />
      <pointLight position={[-7, 3.2, 5]} intensity={26} color="#dbe8ff" distance={22} decay={1.6} />
      <ambientLight intensity={0.35} color="#ffe2bd" />
    </>
  );
};

const Scene: React.FC<{ t: number; cam: { p: [number, number, number]; l: [number, number, number] }; focusPot: number } & OlePotShelf3DProps> = ({ t, cam, focusPot, spinDegPerSec = 14, appear, show, steam }) => {
  const g = useGeoms(); const m = useMats(); const list = show ?? [0, 1, 2, 3, 4];
  const stex = useMemo(() => softTex("rgba(255,255,255,0.9)", 128), []);
  return (
    <>
      <CamRig pos={cam.p} target={cam.l} fov={FOV} />
      <Env />
      <Set t={t} g={g} m={m} />
      {list.map((i) => <Pot key={i} i={i} t={t} spin={spinDegPerSec} focused={focusPot === i} at={(appear ?? [0.1, 0.45, 0.8, 1.15, 1.5])[i] ?? 0.1} g={g} m={m} />)}
      {(steam ?? []).map((i) => (list.includes(i) ? <Steam key={i} t={t} x={X[i]} y={i === 2 ? 1.5 : 1.1} tex={stex} /> : null))}
    </>
  );
};

const Sheet: React.FC<{ s: PotSpec; p: number; x: number; y: number }> = ({ s, p, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 500, transform: `translate(-50%,0) rotate(-1.5deg) scale(${0.9 + 0.1 * p})`, opacity: p, padding: "24px 30px 26px", borderRadius: 6,
    background: `linear-gradient(180deg, ${OLE.cream}, ${OLE.kraftL})`, boxShadow: "0 18px 40px rgba(20,12,4,0.5), inset 0 0 0 2px rgba(120,80,30,0.25)", border: `2px solid ${hexA(OLE.forest, 0.5)}` }}>
    {s.kicker ? <div style={{ fontFamily: LABEL, fontSize: 22, letterSpacing: 5, color: OLE.fire, fontWeight: 600 }}>{s.kicker}</div> : null}
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: OLE.forest, lineHeight: 1.05, margin: "6px 0 12px" }}>{s.title}</div>
    {s.lines.map((l, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 36, color: OLE.pencil, lineHeight: 1.25, opacity: clamp01(p * 3.2 - i * 0.55), translate: `${(1 - clamp01(p * 3.2 - i * 0.55)) * 18}px 0` }}>{l}</div>)}
  </div>
);

/** sello que cae con rebote (spring subamortiguado) sobre esmalte/madera */
export const Verdict: React.FC<{ kind: "buy" | "skip"; text?: string; at: number; x: number; y: number; size?: number }> = ({ kind, text, at, x, y, size = 150 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const c = kind === "buy" ? "#2E6B3E" : "#A32626";
  const sp = spring({ frame: f - at * fps, fps, config: { damping: 7, stiffness: 190, mass: 0.7 } });
  const s = 1 + (1 - sp) * 1.7; const vis = f >= at * fps;
  const flash = interpolate(f - at * fps, [4, 6, 14], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (!vis) return null;
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, width: size * 3.2, height: size * 3.2, translate: "-50% -50%", borderRadius: "50%", background: `radial-gradient(circle, ${hexA("#FFF3D0", flash)}, transparent 62%)` }} />
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${kind === "buy" ? -8 : 7}deg) scale(${s})`, opacity: clamp01(sp * 4),
        border: `${Math.round(size * 0.06)}px solid ${c}`, borderRadius: 14, padding: `${size * 0.05}px ${size * 0.2}px`, color: c, fontFamily: LABEL, fontWeight: 700, letterSpacing: size * 0.05, fontSize: size,
        background: hexA("#FBF6EA", 0.55), boxShadow: `inset 0 0 0 3px ${hexA(c, 0.5)}, 0 8px 24px rgba(0,0,0,0.4)`, mixBlendMode: "multiply", textShadow: "0 0 1px rgba(0,0,0,0.3)" }}>
        {text ?? (kind === "buy" ? "BUY" : "SKIP")}
      </div>
    </>
  );
};

export const OlePotShelf3D: React.FC<OlePotShelf3DProps> = (props) => {
  const f = useCurrentFrame(); const { fps, width, height } = useVideoConfig();
  const t = f / fps;
  const cam = shelfCam(props.focus, t, props.stamps);
  const foc = (props.focus ?? []).filter((k) => t >= k.at).sort((a, b) => b.at - a.at)[0];
  const potNow = foc ? foc.pot : -1;
  const spec = props.specs?.find((s) => s.pot === potNow);
  const specAt = foc ? foc.at + 1.0 : 0;
  const specP = spec ? easeOut(clamp01((t - specAt) / 0.6)) : 0;
  const scr = (pot: number, dy: number): [number, number] => projectTo([X[pot], dy, 0], cam.p, cam.l, FOV, width, height);
  return (
    <AbsoluteFill style={{ backgroundColor: "#21150b" }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ position: cam.p, fov: FOV, near: 0.1, far: 80 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.95 }}>
        <Scene {...props} t={t} cam={cam} focusPot={potNow} />
      </ThreeCanvas>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(10,5,0,0.5) 100%)", pointerEvents: "none" }} />
      {props.tags?.map((tg, i) => {
        const [x, y] = projectTo([X[i], 0.05, 1.5], cam.p, cam.l, FOV, width, height);
        const a = easeOut(clamp01((t - ((props.appear ?? [0.1, 0.45, 0.8, 1.15, 1.5])[i] ?? 0.1) - 0.6) / 0.5));
        return <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: a, fontFamily: LABEL, fontWeight: 700, fontSize: potNow < 0 ? 44 : 56, color: OLE.kraftL, letterSpacing: 4, textShadow: "0 3px 6px rgba(0,0,0,0.7)" }}>{tg}</div>;
      })}
      {spec ? (() => { const [x] = scr(spec.pot, 1); const right = X[spec.pot] < 1; return <Sheet s={spec} p={specP} x={Math.min(width - 300, Math.max(300, x + (right ? 620 : -620)))} y={height * 0.13} />; })() : null}
      {(props.stamps ?? []).map((s, k) => { const [x, y] = scr(s.pot, potNow < 0 ? 1.0 : 1.05); return <Verdict key={k} kind={s.kind} text={s.text} at={s.at} x={x} y={y} size={potNow < 0 ? 84 : 150} />; })}
    </AbsoluteFill>
  );
};
export default OlePotShelf3D;
