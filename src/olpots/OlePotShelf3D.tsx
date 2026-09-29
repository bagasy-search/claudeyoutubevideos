// OlePotShelf3D — la repisa de campamento con las 5 ollas (3D real, @remotion/three).
// Cada olla tiene su propia geometría de torno (Lathe): 0 Dutch oven de hierro · 1 sartén de hierro · 2 olla enlozada moteada
// · 3 olla de acero inoxidable con base gruesa · 4 cacerola pesada con tapa. Giran despacio; la cámara vuela a la que se nombra;
// aparece su ficha técnica (props) y el sello BUY / SKIP sobre ella. Todo determinista por useCurrentFrame (nada de useFrame/Math.random).
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OLE, LABEL, HAND, SERIF, rnd, hexA } from "./OleTheme";
// @ts-ignore
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CamRig, canvasTex, dots, clamp01, easeOut, ease, projectTo, ironTextures, BODY_PROFILE, LID_PROFILE, tube } from "./OleDutchOven3D";

export type PotSpec = { pot: number; kicker?: string; title: string; lines: string[] };
export type PotStamp = { at: number; pot: number; kind: "buy" | "skip"; text?: string };
export type PotFocus = { at: number; pot: number }; // pot -1 = toda la repisa
export type OlePotShelf3DProps = {
  focus?: PotFocus[];
  specs?: PotSpec[];
  stamps?: PotStamp[];
  /** segundos en que cae cada olla a la repisa (por defecto escalonadas desde 0.1) */
  appear?: number[];
  /** ollas visibles (por defecto las 5) */
  show?: number[];
  spinDegPerSec?: number;
  /** números 1-5 grabados en la repisa (props, ej. ["1","2",...]) */
  tags?: string[];
  /** las 3 ollas del "nunca": se dibujan tachadas en un rincón */
  crossed?: number[];
};

const X = [-4.4, -2.2, 0, 2.2, 4.4];
export const shelfCam = (focus: PotFocus[] | undefined, t: number) => {
  const f = (focus ?? []).slice().sort((a, b) => a.at - b.at);
  const target = (pot: number): { p: [number, number, number]; l: [number, number, number] } =>
    pot < 0 ? { p: [0, 1.25, 10.6], l: [0, 0.95, 0] } : { p: [X[pot] * 0.9, 1.35, 4.3], l: [X[pot], 0.62, 0] };
  if (!f.length) return target(-1);
  // interpolar hacia el foco activo durante 0.9 s desde el anterior
  let a = target(-1), b = a, at = 0;
  for (const k of f) { if (t >= k.at) { a = b; b = target(k.pot); at = k.at; } }
  const u = ease(clamp01((t - at) / 0.9));
  return { p: a.p.map((v, i) => v + (b.p[i] - v) * u) as [number, number, number], l: a.l.map((v, i) => v + (b.l[i] - v) * u) as [number, number, number] };
};

const P = (pts: [number, number][], seg = 56) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);

function useMats() {
  return useMemo(() => {
    const { rough, col } = ironTextures();
    const iron = new THREE.MeshStandardMaterial({ map: col, roughnessMap: rough, roughness: 0.62, metalness: 0.45, side: THREE.DoubleSide });
    const enamel = new THREE.MeshStandardMaterial({
      map: canvasTex((c, W, H) => { c.fillStyle = "#EDEFEA"; c.fillRect(0, 0, W, H); dots(c, W, H, 5, 900, "#2a2f36", 0.6, 1.8, 0.55); dots(c, W, H, 11, 500, "#7d8791", 0.6, 1.6, 0.5); }, 256, 256, 3, 2),
      roughness: 0.22, metalness: 0.08, side: THREE.DoubleSide,
    });
    const enamelRim = new THREE.MeshStandardMaterial({ color: OLE.enamel, roughness: 0.25, metalness: 0.08, side: THREE.DoubleSide });
    const steel = new THREE.MeshStandardMaterial({ color: "#c9cdd1", roughness: 0.3, metalness: 0.85, side: THREE.DoubleSide });
    const steelDark = new THREE.MeshStandardMaterial({ color: "#8f959b", roughness: 0.38, metalness: 0.85, side: THREE.DoubleSide });
    const wood = new THREE.MeshStandardMaterial({
      map: canvasTex((c, W, H) => {
        c.fillStyle = "#8a5f38"; c.fillRect(0, 0, W, H);
        for (let i = 0; i < 90; i++) { c.strokeStyle = `rgba(${40 + (i % 5) * 8},${24 + (i % 4) * 6},10,${0.08 + rnd(i) * 0.18})`; c.lineWidth = 1 + rnd(i + 3) * 3; c.beginPath(); const y = rnd(i + 9) * H; c.moveTo(0, y); c.bezierCurveTo(W * 0.3, y + rnd(i + 2) * 12 - 6, W * 0.6, y + rnd(i + 5) * 12 - 6, W, y + rnd(i + 7) * 8 - 4); c.stroke(); }
      }, 512, 256, 2, 1), roughness: 0.85, metalness: 0,
    });
    const wall = new THREE.MeshStandardMaterial({
      map: canvasTex((c, W, H) => {
        c.fillStyle = "#2c1c10"; c.fillRect(0, 0, W, H);
        const n = 5; const lh = H / n;
        for (let r = 0; r < n; r++) {
          const y0 = r * lh; const g = c.createLinearGradient(0, y0, 0, y0 + lh);
          g.addColorStop(0, "#3a2614"); g.addColorStop(0.18, "#6d4a2a"); g.addColorStop(0.5, "#7a5431"); g.addColorStop(0.85, "#553820"); g.addColorStop(1, "#22150a");
          c.fillStyle = g; c.fillRect(0, y0, W, lh - 4);
          for (let i = 0; i < 40; i++) { c.strokeStyle = `rgba(35,20,8,${0.08 + rnd(r * 77 + i) * 0.22})`; c.lineWidth = 1 + rnd(i + r * 5) * 2.2; c.beginPath(); const yy = y0 + 8 + rnd(r * 31 + i) * (lh - 20); const x0 = rnd(i * 3 + r) * W * 0.5; c.moveTo(x0, yy); c.lineTo(x0 + 120 + rnd(i) * 500, yy + rnd(i + 8) * 6 - 3); c.stroke(); }
          c.fillStyle = "rgba(20,10,4,0.5)"; c.beginPath(); c.ellipse(W * (0.15 + rnd(r + 3) * 0.7), y0 + lh * 0.5, 26, 12, 0, 0, 7); c.fill();
        }
      }, 1024, 512, 1, 1), color: "#a58e7a", roughness: 0.95, metalness: 0,
    });
    return { iron, enamel, enamelRim, steel, steelDark, wood, wall };
  }, []);
}

function useGeoms() {
  return useMemo(() => {
    const dutch = P(BODY_PROFILE), dutchLid = P(LID_PROFILE);
    const skillet = P([[0, 0], [0.9, 0], [1.0, 0.03], [1.14, 0.22], [1.16, 0.25], [1.1, 0.25], [1.08, 0.22], [0.95, 0.06], [0, 0.05]]);
    const skHandle = tube([[1.1, 0.2, 0], [1.6, 0.19, 0], [2.1, 0.18, 0], [2.35, 0.17, 0]], 0.09);
    const stock = P([[0, 0], [0.98, 0], [1.0, 0.03], [1.0, 1.5], [1.03, 1.52], [1.03, 1.56], [0.96, 1.56], [0.96, 0.05], [0, 0.03]]);
    const stockRim = P([[0.94, 1.5], [1.04, 1.5], [1.04, 1.58], [0.94, 1.58]]);
    const stockLid = P([[0, 1.72], [0.3, 1.66], [0.9, 1.6], [1.06, 1.56], [1.06, 1.53], [0.9, 1.55], [0, 1.6]]);
    const stockKnob = new THREE.SphereGeometry(0.11, 14, 10);
    const ear = tube([[1.02, 1.28, -0.12], [1.28, 1.3, -0.08], [1.34, 1.3, 0], [1.28, 1.3, 0.08], [1.02, 1.28, 0.12]], 0.05);
    const ss = P([[0, 0], [0.92, 0], [0.94, 0.02], [0.94, 0.05], [1.0, 0.06], [1.0, 1.35], [1.03, 1.37], [1.0, 1.4], [0.97, 1.4], [0.97, 0.12], [0, 0.1]]);
    const ssBase = P([[0, -0.02], [0.96, -0.02], [1.0, 0.0], [1.0, 0.16], [0, 0.16]]); // base sándwich gruesa
    const ssLid = P([[0, 1.5], [0.4, 1.47], [1.0, 1.43], [1.04, 1.4], [0.98, 1.4], [0.9, 1.42], [0, 1.44]]);
    const ssHandle = tube([[1.0, 1.15, -0.1], [1.22, 1.16, -0.06], [1.26, 1.16, 0], [1.22, 1.16, 0.06], [1.0, 1.15, 0.1]], 0.05);
    const pan = P([[0, 0], [0.88, 0], [0.96, 0.03], [1.0, 0.1], [1.0, 0.86], [1.03, 0.88], [1.0, 0.9], [0.95, 0.9], [0.95, 0.12], [0.85, 0.09], [0, 0.09]]);
    const panLid = P([[0, 1.05], [0.45, 1.0], [0.98, 0.94], [1.03, 0.9], [0.97, 0.9], [0.9, 0.92], [0, 0.97]]);
    const panHandle = tube([[0.98, 0.6, 0], [1.6, 0.66, 0], [2.3, 0.7, 0]], 0.075);
    const panKnob = new THREE.SphereGeometry(0.09, 12, 8);
    const rivet = new THREE.SphereGeometry(0.045, 8, 6);
    const shelf = new THREE.BoxGeometry(12.2, 0.3, 2.6);
    const wall = new THREE.PlaneGeometry(22, 9);
    const bracket = new THREE.BoxGeometry(0.34, 0.9, 2.2);
    return { dutch, dutchLid, skillet, skHandle, stock, stockRim, stockLid, stockKnob, ear, ss, ssBase, ssLid, ssHandle, pan, panLid, panHandle, panKnob, rivet, shelf, wall, bracket };
  }, []);
}

const Env: React.FC = () => {
  const { gl, scene } = useThree();
  useMemo(() => {
    try {
      const pm = new THREE.PMREMGenerator(gl);
      scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    } catch (e) { /* sin entorno: queda con luces */ }
  }, [gl, scene]);
  return null;
};

const dropY = (t: number, at: number) => {
  const u = clamp01((t - at) / 0.75);
  if (u <= 0) return 6;
  const e = 1 - Math.pow(1 - u, 3);
  const bounce = u > 0.8 ? Math.sin((u - 0.8) / 0.2 * Math.PI) * 0.06 : 0;
  return (1 - e) * 6 + bounce;
};

const Pot: React.FC<{ i: number; t: number; spin: number; at: number; crossed: boolean; g: ReturnType<typeof useGeoms>; m: ReturnType<typeof useMats> }> = ({ i, t, spin, at, crossed, g, m }) => {
  const y = dropY(t, at);
  const ry = (spin * Math.max(0, t - at) * Math.PI) / 180 + (i * 0.7);
  const sc = [0.62, 0.7, 0.62, 0.55, 0.42][i];
  const lidLift = 0; // cerradas: se ven como se compran
  const yBase = 0.15;
  return (
    <group position={[X[i], yBase + y, 0]} rotation={[0, ry, 0]} scale={[sc, sc, sc]}>
      {i === 0 && (<>
        <mesh geometry={g.dutch} material={m.iron} />
        <mesh geometry={g.dutchLid} material={m.iron} position={[0, 0.88 + lidLift, 0]} />
        {[-1, 1].map((s) => <mesh key={s} geometry={new THREE.TorusGeometry(0.09, 0.03, 8, 16)} material={m.iron} position={[s * 1.03, 0.7, 0]} rotation={[0, Math.PI / 2, 0]} />)}
      </>)}
      {i === 1 && (<>
        <mesh geometry={g.skillet} material={m.iron} />
        <mesh geometry={g.skHandle} material={m.iron} />
        <mesh geometry={new THREE.TorusGeometry(0.06, 0.02, 8, 14)} material={m.iron} position={[-1.1, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} />
      </>)}
      {i === 2 && (<>
        <mesh geometry={g.stock} material={m.enamel} />
        <mesh geometry={g.stockRim} material={m.enamelRim} />
        <mesh geometry={g.stockLid} material={m.enamel} />
        <mesh geometry={g.stockKnob} material={m.enamelRim} position={[0, 1.74, 0]} />
        <mesh geometry={g.ear} material={m.enamelRim} />
        <mesh geometry={g.ear} material={m.enamelRim} rotation={[0, Math.PI, 0]} />
      </>)}
      {i === 3 && (<>
        <mesh geometry={g.ss} material={m.steel} />
        <mesh geometry={g.ssBase} material={m.steelDark} />
        <mesh geometry={g.ssLid} material={m.steel} />
        <mesh geometry={g.stockKnob} material={m.steelDark} position={[0, 1.52, 0]} />
        <mesh geometry={g.ssHandle} material={m.steelDark} />
        <mesh geometry={g.ssHandle} material={m.steelDark} rotation={[0, Math.PI, 0]} />
      </>)}
      {i === 4 && (<>
        <mesh geometry={g.pan} material={m.steel} />
        <mesh geometry={g.ssBase} material={m.steelDark} scale={[1, 0.8, 1]} />
        <mesh geometry={g.panLid} material={m.steel} />
        <mesh geometry={g.panKnob} material={m.steelDark} position={[0, 1.07, 0]} />
        <mesh geometry={g.panHandle} material={m.iron} />
        <mesh geometry={g.rivet} material={m.steelDark} position={[0.99, 0.62, 0.09]} />
        <mesh geometry={g.rivet} material={m.steelDark} position={[0.99, 0.62, -0.09]} />
      </>)}
      {crossed ? null : null}
    </group>
  );
};

const Scene: React.FC<Required<Pick<OlePotShelf3DProps, "spinDegPerSec">> & OlePotShelf3DProps & { t: number; cam: ReturnType<typeof shelfCam>; fov: number }> = ({ t, cam, fov, spinDegPerSec, appear, show, crossed }) => {
  const g = useGeoms(); const m = useMats();
  const list = show ?? [0, 1, 2, 3, 4];
  return (
    <>
      <CamRig pos={cam.p} target={cam.l} fov={fov} />
      <Env />
      <ambientLight intensity={0.55} color="#ffe6c4" />
      <directionalLight position={[-5, 7, 6]} intensity={2.1} color="#fff1dc" />
      <pointLight position={[3.5, 3.2, 3.5]} intensity={28} color="#ffb765" distance={16} decay={1.6} />
      <pointLight position={[-6, 2.6, 2.5]} intensity={10} color="#e9f0ff" distance={14} decay={1.6} />
      <mesh geometry={g.wall} material={m.wall} position={[0, 1.6, -1.7]} />
      <mesh geometry={g.shelf} material={m.wood} position={[0, -0.02, 0]} />
      <mesh geometry={g.bracket} material={m.iron} position={[-5.0, -0.7, 0]} />
      <mesh geometry={g.bracket} material={m.iron} position={[5.0, -0.7, 0]} />
      {list.map((i) => <Pot key={i} i={i} t={t} spin={spinDegPerSec} at={(appear ?? [0.1, 0.45, 0.8, 1.15, 1.5])[i] ?? 0.1} crossed={!!crossed?.includes(i)} g={g} m={m} />)}
    </>
  );
};

const Sheet: React.FC<{ s: PotSpec; p: number; x: number; y: number }> = ({ s, p, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 470, transform: `translate(-50%,0) rotate(-1.5deg) scale(${0.92 + 0.08 * p})`, opacity: p, padding: "22px 28px 24px", borderRadius: 6,
    background: `linear-gradient(180deg, ${OLE.cream}, ${OLE.kraftL})`, boxShadow: "0 18px 40px rgba(20,12,4,0.45), inset 0 0 0 2px rgba(120,80,30,0.25)", border: `2px solid ${hexA(OLE.forest, 0.5)}` }}>
    {s.kicker ? <div style={{ fontFamily: LABEL, fontSize: 21, letterSpacing: 5, color: OLE.fire, fontWeight: 600 }}>{s.kicker}</div> : null}
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: OLE.forest, lineHeight: 1.05, margin: "6px 0 10px" }}>{s.title}</div>
    {s.lines.map((l, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 32, color: OLE.pencil, lineHeight: 1.25, opacity: clamp01(p * 3 - i * 0.5) }}>{l}</div>)}
  </div>
);

export const Verdict: React.FC<{ kind: "buy" | "skip"; text?: string; p: number; x: number; y: number; size?: number }> = ({ kind, text, p, x, y, size = 150 }) => {
  const c = kind === "buy" ? "#2E6B3E" : "#A32626";
  const s = interpolate(p, [0, 0.55, 1], [2.4, 0.94, 1]);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${kind === "buy" ? -8 : 7}deg) scale(${s})`, opacity: clamp01(p * 3),
      border: `${Math.round(size * 0.06)}px solid ${c}`, borderRadius: 14, padding: `${size * 0.05}px ${size * 0.2}px`, color: c, fontFamily: LABEL, fontWeight: 700, letterSpacing: size * 0.05, fontSize: size,
      background: hexA("#FBF6EA", 0.5), boxShadow: `inset 0 0 0 3px ${hexA(c, 0.5)}, 0 8px 24px rgba(0,0,0,0.35)`, mixBlendMode: "multiply", textShadow: "0 0 1px rgba(0,0,0,0.3)" }}>
      {text ?? (kind === "buy" ? "BUY" : "SKIP")}
    </div>
  );
};

export const OlePotShelf3D: React.FC<OlePotShelf3DProps> = (props) => {
  const f = useCurrentFrame(); const { fps, width, height } = useVideoConfig();
  const t = f / fps;
  const spin = props.spinDegPerSec ?? 18;
  const fov = 34;
  const cam = shelfCam(props.focus, t);
  // pot enfocado actual
  const foc = (props.focus ?? []).filter((k) => t >= k.at).sort((a, b) => b.at - a.at)[0];
  const potNow = foc ? foc.pot : -1;
  const spec = props.specs?.find((s) => s.pot === potNow);
  const specAt = foc ? foc.at + 0.9 : 0;
  const specP = spec ? easeOut(clamp01((t - specAt) / 0.6)) : 0;
  const scr = (pot: number, dy = 1.9): [number, number] => projectTo([X[pot], dy, 0], cam.p, cam.l, fov, width, height);
  return (
    <AbsoluteFill style={{ backgroundColor: "#3a2a1a" }}>
      <ThreeCanvas width={width} height={height} camera={{ position: cam.p, fov, near: 0.1, far: 60 }} gl={{ antialias: true }}>
        <Scene {...props} spinDegPerSec={spin} t={t} cam={cam} fov={fov} />
      </ThreeCanvas>
      {props.tags?.map((tg, i) => {
        const [x, y] = projectTo([X[i], -0.02, 1.4], cam.p, cam.l, fov, width, height);
        const a = easeOut(clamp01((t - ((props.appear ?? [0.1, 0.45, 0.8, 1.15, 1.5])[i] ?? 0.1) - 0.6) / 0.5));
        return <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: a, fontFamily: LABEL, fontWeight: 700, fontSize: 34, color: OLE.kraftL, letterSpacing: 4, textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}>{tg}</div>;
      })}
      {spec ? (() => { const [x] = scr(spec.pot); const right = X[spec.pot] < 1; return <Sheet s={spec} p={specP} x={Math.min(width - 260, Math.max(260, x + (right ? 520 : -520)))} y={height * 0.14} />; })() : null}
      {(props.stamps ?? []).map((s, k) => {
        const p = clamp01((t - s.at) / 0.4); if (p <= 0) return null;
        const [x, y] = scr(s.pot, 0.9);
        return <Verdict key={k} kind={s.kind} text={s.text} p={easeOut(p)} x={x} y={y} size={potNow < 0 ? 78 : 130} />;
      })}
    </AbsoluteFill>
  );
};
export default OlePotShelf3D;
