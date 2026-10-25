// Kit del video cllavabo (sarro del LAVABO): el lavabo del hotel en 3D y sus set-pieces 2.5D, sobre camas reales del baño.
//   ClFaucet3D  lavabo de porcelana + llave de cromo (three.js, cámara a mano). mode:
//               "grow"  la costra blanca crece en la base, la boca y el aro del desagüe (contador de días)
//               "wrap"  la venda de papel empapado envuelve la base, se moja (gris) y la costra de abajo se achica
//               "bag"   la bolsita con vinagre colgada de la boca, atada con la liga; la costra de la boca se deshace
//               "clean" sin costra: el brillo del cromo recorre la llave
//   ClDropDry   macro: una gota sobre la porcelana se seca y deja su anillito de piedra; las gotas se apilan → costra (días)
//   ClAerator   la rejilla del aireador de frente: los agujeritos se tapan uno a uno y el chorro sale torcido · "clean" = chorro derecho
//   ClMaterials de qué es su lavabo: porcelana / mármol / resina / acero / vidrio, con vinagre sí-no y el tiempo (hi = fila resaltada)
//   ClAcidBase  la regla del ácido: limón · vinagre · cítrico ← agua → bicarbonato · cloro · SARRO; el cloro del mismo lado que la piedra
//   ClWrapGuide el lavabo visto de arriba con los 3 lugares y su tiempo (base 1 h · boca 1 h / 20 min dorada · desagüe 40 min)
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease } from "./ClTheme";
import { Bed, Contact, RoomLight, Stamp, lin, pop, useOut } from "./ClParts";
import { manoCam } from "../kits/camara/CamaraMano";

const Cam: React.FC<{ pos: any; target: any; roll: number }> = ({ pos, target, roll }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.rotateZ(roll); camera.updateProjectionMatrix(); return null;
};
const Tag: React.FC<{ x: number; y: number; text: string; k: number; left?: boolean }> = ({ x, y, text, k, left }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: `${left ? "-100%" : "0%"} -50%`, opacity: k, background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 42, letterSpacing: 2, padding: "8px 22px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${CL.shadow}`, borderBottom: `4px solid ${CL.yellow}` }}>{text}</div>
);
const tick = (ok: boolean, s = 60): React.ReactNode => (
  <svg width={s} height={s} viewBox="0 0 70 70">{ok ? <path d="M10 38 L28 56 L60 16" stroke="#2F8F48" strokeWidth={11} fill="none" strokeLinecap="round" /> : <path d="M14 14 L56 56 M56 14 L14 56" stroke={CL.red} strokeWidth={11} strokeLinecap="round" />}</svg>
);

// ───────────────────────────── el lavabo 3D
type FMode = "grow" | "wrap" | "bag" | "clean";
const BASE_Y = 0.02, BODY_H = 0.9, SPOUT_TIP = new THREE.Vector3(0, 0.8, 0.82);
export const ClFaucet3D: React.FC<{ mode?: FMode; labels?: { a?: string; b?: string; c?: string }; days?: number; bed?: string }> = ({ mode = "grow", labels = {}, days = 730, bed }) => {
  const f = useCurrentFrame();
  const { width, height, fps, durationInFrames: T } = useVideoConfig();
  const out = useOut(8);
  const u = clamp01((f - 6) / Math.max(1, T * 0.8 - 6));
  const m = manoCam(f / fps, 1, 31);
  const views: Record<FMode, [number, number, number, any]> = {
    grow: [-0.45, 2.8, 4.1, new THREE.Vector3(0, -0.05, -0.35)],
    wrap: [-0.7, 1.35, 2.4, new THREE.Vector3(0, 0.15, -1.05)],
    bag: [0.6, 1.25, 2.4, new THREE.Vector3(0, 0.6, -0.35)],
    clean: [-0.25, 2.2, 3.4, new THREE.Vector3(0, 0.25, -0.6)],
  };
  const [a0, camY, d0, target] = views[mode];
  const a = a0 + interpolate(f, [0, T], [0, 0.32], { easing: Easing.inOut(Easing.cubic) }) + (m.pan * Math.PI) / 180;
  const dist = d0 * interpolate(f, [0, T], [1.08, 0.96]);
  const camPos = new THREE.Vector3(target.x + Math.sin(a) * dist, camY + m.tilt * 0.02, target.z + Math.cos(a) * dist);
  // costra: grosor por modo
  const grow = mode === "grow" ? ease(u) : mode === "clean" ? 0 : 1;
  const baseCrust = mode === "wrap" ? 1 - 0.85 * ease(clamp01((u - 0.25) / 0.7)) : grow;
  const tipCrust = mode === "bag" ? 1 - 0.9 * ease(clamp01((u - 0.2) / 0.7)) : grow;
  const wrapK = mode === "wrap" ? ease(clamp01(u / 0.3)) : 0, wet = mode === "wrap" ? clamp01((u - 0.2) / 0.5) : 0;
  const bagK = mode === "bag" ? ease(clamp01(u / 0.25)) : 0;
  const shine = mode === "clean" ? ((f % 70) / 70) * 3 - 1.5 : -9;
  const mats = useMemo(() => ({
    porcelain: new THREE.MeshPhysicalMaterial({ color: "#F8F7F3", roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08, side: THREE.DoubleSide }),
    counter: new THREE.MeshStandardMaterial({ color: "#E9E2D4", roughness: 0.6 }),
    chrome: new THREE.MeshPhysicalMaterial({ color: "#EEF2F6", metalness: 0.35, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.05 }),
    crust: new THREE.MeshStandardMaterial({ color: "#F1EFE6", roughness: 1 }),
    crustGray: new THREE.MeshStandardMaterial({ color: "#C9C4B5", roughness: 1 }),
    paper: new THREE.MeshStandardMaterial({ color: "#FFFCF4", roughness: 1, side: THREE.DoubleSide }),
    bag: new THREE.MeshPhysicalMaterial({ color: "#FFFFFF", roughness: 0.15, transmission: 0.6, transparent: true, opacity: 0.38 }),
    vinegar: new THREE.MeshStandardMaterial({ color: "#F4EAD2", roughness: 0.05, transparent: true, opacity: 0.55 }),
    band: new THREE.MeshStandardMaterial({ color: "#C9762A", roughness: 0.6 }),
    drain: new THREE.MeshStandardMaterial({ color: "#B8BEC4", metalness: 0.9, roughness: 0.25 }),
    dark: new THREE.MeshStandardMaterial({ color: "#2A2B2D", roughness: 0.8 }),
  }), []);
  const bowl = useMemo(() => {
    const pts: any[] = []; for (let i = 0; i <= 24; i++) { const t = i / 24; pts.push(new THREE.Vector2(0.08 + 1.05 * Math.sin(t * Math.PI / 2), -0.55 * Math.cos(t * Math.PI / 2))); }
    return new THREE.LatheGeometry(pts, 64);
  }, []);
  const counter = useMemo(() => {
    const sh = new THREE.Shape(); sh.moveTo(-1.8, -1.6); sh.lineTo(1.8, -1.6); sh.lineTo(1.8, 1.2); sh.lineTo(-1.8, 1.2); sh.lineTo(-1.8, -1.6);
    const h = new THREE.Path(); h.absellipse(0, 0.05, 1.13, 1.13 * 0.82, 0, Math.PI * 2, true, 0); sh.holes.push(h);
    return new THREE.ExtrudeGeometry(sh, { depth: 0.07, bevelEnabled: false, curveSegments: 64 });
  }, []);
  const spout = useMemo(() => new THREE.TubeGeometry(new THREE.CubicBezierCurve3(new THREE.Vector3(0, BODY_H - 0.06, 0), new THREE.Vector3(0, BODY_H + 0.12, 0.05), new THREE.Vector3(0, BODY_H + 0.16, SPOUT_TIP.z), SPOUT_TIP.clone().add(new THREE.Vector3(0, 0.04, 0))), 40, 0.07, 20, false), []);
  // bultitos de piedra en anillo
  const lumps = (n: number, r: number, seed: number) => Array.from({ length: n }, (_, i) => ({ ang: (i / n) * Math.PI * 2 + rnd(seed + i) * 0.3, s: 0.6 + rnd(seed + i * 3) * 0.8, rr: r + (rnd(seed + i * 7) - 0.5) * 0.03 }));
  const baseL = useMemo(() => lumps(46, 0.21, 11), []), drainL = useMemo(() => lumps(40, 0.16, 23), []);
  const FZ = -1.1; // la llave está atrás del bowl
  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(34, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const L: { at: any; text: string; dx: number; dy: number; t0: number }[] = [];
  if (labels.a) L.push({ at: new THREE.Vector3(0.2, BASE_Y + 0.05, FZ + 0.1), text: labels.a, dx: 210, dy: 150, t0: 10 });
  if (labels.b) L.push({ at: SPOUT_TIP.clone().add(new THREE.Vector3(0, -0.06, FZ)), text: labels.b, dx: -220, dy: -120, t0: Math.round(T * 0.3) });
  if (labels.c) L.push({ at: new THREE.Vector3(0.12, -0.53, 0.05), text: labels.c, dx: 260, dy: 90, t0: Math.round(T * 0.5) });
  const base = proj(new THREE.Vector3(0, -0.2, 0));
  const k0 = pop(f, 30, 0, 16);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={301} dim={0.34} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(255,252,246,0.75), rgba(255,252,246,0) 64%)" }} />
      <Contact x={base.x} y={base.y + 150} w={1500} o={0.3} />
      <div style={{ position: "absolute", inset: 0, translate: `${m.x}px ${m.y + (1 - k0) * 60}px` }}>
        <ThreeCanvas width={width} height={height} camera={{ fov: 34, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
          <Cam pos={camPos} target={target} roll={(m.roll * Math.PI) / 180} />
          <ambientLight intensity={0.75} />
          <hemisphereLight args={["#FFFFFF", "#BDB29E", 0.55]} />
          <directionalLight position={[-2, 6, 4]} intensity={1.2} color="#FFF0D8" />
          <directionalLight position={[3, 3, 2]} intensity={0.45} />
          <pointLight position={[shine, 1.4, FZ + 0.6]} intensity={mode === "clean" ? 3.2 : 0} distance={2.2} color="#FFFFFF" />
          {/* mesada con el bowl hundido */}
          <mesh geometry={counter} material={mats.counter} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} />
          <mesh geometry={bowl} material={mats.porcelain} position={[0, 0, 0.05]} scale={[1, 1, 0.82]} />
          
          {/* desagüe con su aro de piedra */}
          <mesh material={mats.drain} position={[0, -0.545, 0.05]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.05, 0.13, 40]} /></mesh>
          <mesh material={mats.dark} position={[0, -0.548, 0.05]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.05, 30]} /></mesh>
          {drainL.map((l, i) => grow > 0.02 ? <mesh key={"d" + i} material={i % 3 ? mats.crust : mats.crustGray} position={[Math.cos(l.ang) * l.rr, -0.54, 0.05 + Math.sin(l.ang) * l.rr * 0.82]} scale={0.03 * l.s * grow}><sphereGeometry args={[1, 8, 6]} /></mesh> : null)}
          {/* llave */}
          <group position={[0, 0, FZ]}>
            <mesh material={mats.chrome} position={[0, BASE_Y + 0.03, 0]}><cylinderGeometry args={[0.19, 0.21, 0.06, 40]} /></mesh>
            <mesh material={mats.chrome} position={[0, BASE_Y + BODY_H / 2, 0]}><cylinderGeometry args={[0.11, 0.13, BODY_H, 40]} /></mesh>
            <mesh geometry={spout} material={mats.chrome} />
            <mesh material={mats.chrome} position={[SPOUT_TIP.x, SPOUT_TIP.y, SPOUT_TIP.z]}><cylinderGeometry args={[0.078, 0.078, 0.09, 30]} /></mesh>
            <mesh material={mats.dark} position={[SPOUT_TIP.x, SPOUT_TIP.y - 0.046, SPOUT_TIP.z]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.06, 24]} /></mesh>
            <mesh material={mats.chrome} position={[0, BODY_H + 0.05, -0.02]} rotation={[-0.35, 0, 0]}><boxGeometry args={[0.07, 0.05, 0.42]} /></mesh>
            {/* costra de la base */}
            {baseL.map((l, i) => baseCrust > 0.02 ? <mesh key={"b" + i} material={i % 4 ? mats.crust : mats.crustGray} position={[Math.cos(l.ang) * l.rr, BASE_Y + 0.01, Math.sin(l.ang) * l.rr]} scale={[0.05 * l.s * baseCrust, 0.035 * l.s * baseCrust, 0.05 * l.s * baseCrust]}><sphereGeometry args={[1, 8, 6]} /></mesh> : null)}
            {baseCrust > 0.02 ? <mesh material={mats.crust} position={[0, BASE_Y + 0.005, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, baseCrust]}><torusGeometry args={[0.215, 0.03, 10, 48]} /></mesh> : null}
            {/* costra de la boca */}
            {tipCrust > 0.02 ? <mesh material={mats.crust} position={[SPOUT_TIP.x, SPOUT_TIP.y - 0.05, SPOUT_TIP.z]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, tipCrust]}><torusGeometry args={[0.065, 0.022 * tipCrust + 0.004, 8, 30]} /></mesh> : null}
            {/* venda de papel */}
            {wrapK > 0.01 ? <group>{[0, 1, 2].map((k) => <mesh key={"w" + k} position={[0, BASE_Y + 0.06 + k * 0.075, 0]} material={mats.paper} scale={[1, wrapK, 1]}><cylinderGeometry args={[0.235 - k * 0.04, 0.245 - k * 0.04, 0.085, 40, 1, true]} /></mesh>)}</group> : null}
            {/* bolsita con vinagre en la boca */}
            {bagK > 0.01 ? <group position={[SPOUT_TIP.x, SPOUT_TIP.y - 0.04, SPOUT_TIP.z]} scale={bagK}>
              <mesh material={mats.bag} position={[0, -0.12, 0]} scale={[1, 1.25, 1]}><sphereGeometry args={[0.17, 24, 18]} /></mesh>
              <mesh material={mats.vinegar} position={[0, -0.16, 0]} scale={[0.92, 0.85, 0.92]}><sphereGeometry args={[0.16, 24, 18, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.58]} /></mesh>
              <mesh material={mats.band} position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.08, 0.012, 8, 30]} /></mesh>
              <mesh material={mats.bag} position={[0, 0.05, 0]}><cylinderGeometry args={[0.085, 0.15, 0.16, 24, 1, true]} /></mesh>
            </group> : null}
          </group>
          {/* el papel mojado se ve gris: sombra que crece en la venda */}
          {wet > 0 ? <mesh position={[0, BASE_Y + 0.13, FZ]} material={new THREE.MeshStandardMaterial({ color: "#9E998C", transparent: true, opacity: 0.35 * wet, roughness: 1 })}><cylinderGeometry args={[0.25, 0.25, 0.24, 40, 1, true]} /></mesh> : null}
        </ThreeCanvas>
        <RoomLight k={0.55} />
        <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
          {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0, l.t0 + 12); if (k <= 0) return null; const ex = p.x + l.dx, ey = p.y + l.dy;
            return (<g key={i} opacity={k}><circle cx={p.x} cy={p.y} r={10} fill={CL.yellow} stroke={CL.ink} strokeWidth={3} /><line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * k} y2={p.y + (ey - p.y) * k} stroke={CL.ink} strokeWidth={4} strokeLinecap="round" /></g>); })}
        </svg>
        {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0 + 6, l.t0 + 18); return k > 0 ? <Tag key={i} x={p.x + l.dx} y={p.y + l.dy} text={l.text} k={k} left={l.dx < 0} /> : null; })}
      </div>
      {mode === "grow" ? (
        <div style={{ position: "absolute", left: 110, bottom: 110, opacity: lin(f, 4, 14), background: CL.white, borderRadius: 14, padding: "10px 30px 14px", boxShadow: `0 14px 30px ${CL.shadow}`, borderTop: `10px solid ${CL.navy}` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 32, letterSpacing: 3, color: CL.inkSoft }}>DÍAS DE GOTAS</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: CL.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.max(1, Math.round(days * ease(u)))}</div>
        </div>
      ) : null}
      {mode === "wrap" || mode === "bag" ? (
        <div style={{ position: "absolute", right: 110, bottom: 110, opacity: lin(f, 4, 14), background: CL.white, borderRadius: 14, padding: "10px 30px 14px", boxShadow: `0 14px 30px ${CL.shadow}`, borderTop: `10px solid ${CL.yellow}` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 32, letterSpacing: 3, color: CL.inkSoft }}>VINAGRE TIBIO</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: CL.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(60 * ease(u))} min</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────────── la gota que se seca
export const ClDropDry: React.FC<{ bed?: string; days?: number }> = ({ bed, days = 365 }) => {
  const f = useCurrentFrame(); const { width, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const CX = width / 2, CY = 560;
  const cyc = 42, n = Math.floor(f / cyc), t = (f % cyc) / cyc;            // una gota por ciclo
  const rings = Math.min(14, n);
  const fill = (k: number) => Math.min(1, k);
  const dayN = Math.round(interpolate(f, [cyc, T - 10], [1, days], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const dropR = 150 * (1 - ease(clamp01((t - 0.15) / 0.75))) + 6;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={303} dim={0.55} />
      <svg width={width} height={1080} viewBox={`0 0 ${width} 1080`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="ddPor" cx="50%" cy="45%" r="70%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E7E4DC" /></radialGradient>
          <radialGradient id="ddDrop" cx="38%" cy="32%" r="70%"><stop offset="0" stopColor="#FFFFFF" stopOpacity={0.95} /><stop offset="0.35" stopColor="#D8ECF8" stopOpacity={0.55} /><stop offset="1" stopColor="#9CC3DC" stopOpacity={0.5} /></radialGradient>
        </defs>
        <ellipse cx={CX} cy={CY + 20} rx={760} ry={360} fill="url(#ddPor)" opacity={0.92} />
        {/* anillitos de piedra que deja cada gota, apilados */}
        {Array.from({ length: rings }, (_, i) => (
          <g key={i} opacity={0.35 + 0.05 * i}>
            {Array.from({ length: 40 }, (_, k) => { const ang = (k / 40) * Math.PI * 2, r = 150 - i * 3 + (rnd(i * 41 + k) - 0.5) * 10; return <circle key={k} cx={CX + Math.cos(ang) * r * 1.4} cy={CY + Math.sin(ang) * r * 0.55} r={3 + rnd(i * 13 + k) * 4 + i * 0.4} fill="#F3F0E6" stroke="#CFC9B8" strokeWidth={1} />; })}
          </g>
        ))}
        {rings > 4 ? <ellipse cx={CX} cy={CY} rx={210} ry={80} fill="none" stroke="#E9E4D4" strokeWidth={fill((rings - 4) / 10) * 22} opacity={0.9} /> : null}
        {/* la gota que cae y se va secando */}
        {t < 0.12 ? <ellipse cx={CX} cy={CY - 420 + (t / 0.12) * 400} rx={34} ry={46} fill="url(#ddDrop)" /> : (
          <g><ellipse cx={CX} cy={CY} rx={dropR * 1.4} ry={dropR * 0.55} fill="url(#ddDrop)" stroke="#BFD9EA" strokeWidth={2} />
            <ellipse cx={CX - dropR * 0.4} cy={CY - dropR * 0.18} rx={dropR * 0.35} ry={dropR * 0.12} fill="#FFFFFF" opacity={0.8} /></g>
        )}
        {/* el agua se va al aire */}
        {t > 0.2 ? Array.from({ length: 7 }, (_, k) => { const tt = clamp01((t - 0.2 - k * 0.07) / 0.5); return tt > 0 && tt < 1 ? <path key={k} d={`M${CX - 160 + k * 52} ${CY - 40 - tt * 260} q12 -18 0 -36 q-12 -18 0 -36`} stroke="#9CC3DC" strokeWidth={5} fill="none" opacity={(1 - tt) * 0.8} /> : null; }) : null}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 74, color: CL.ink, opacity: lin(f, 4, 14) }}>El agua se va. <span style={{ color: CL.navy }}>La piedra se queda.</span></div>
      <div style={{ position: "absolute", left: 110, bottom: 100, background: CL.white, borderRadius: 14, padding: "10px 30px 14px", boxShadow: `0 14px 30px ${CL.shadow}`, borderTop: `10px solid ${CL.navy}`, opacity: lin(f, cyc, cyc + 10) }}>
        <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 32, letterSpacing: 3, color: CL.inkSoft }}>GOTAS SECAS</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: CL.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{dayN}</div>
      </div>
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ───────────────────────────── el aireador
export const ClAerator: React.FC<{ mode?: "clog" | "clean"; bed?: string }> = ({ mode = "clog", bed }) => {
  const f = useCurrentFrame(); const { width, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const u = clamp01((f - 8) / Math.max(1, T * 0.75 - 8));
  const CX = 640, CY = 520, R = 300;
  const holes = useMemo(() => { const o: { x: number; y: number; i: number }[] = []; let i = 0; for (let gx = -9; gx <= 9; gx++) for (let gy = -9; gy <= 9; gy++) { const x = gx * 30 + (gy % 2 ? 15 : 0), y = gy * 28; if (x * x + y * y < (R - 40) ** 2) o.push({ x, y, i: i++ }); } return o; }, []);
  const clogged = mode === "clog" ? u : 1 - u;
  const bend = mode === "clog" ? ease(u) : 1 - ease(u);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={305} dim={0.42} />
      <svg width={width} height={1080} viewBox={`0 0 ${width} 1080`} style={{ position: "absolute", inset: 0 }}>
        <defs><radialGradient id="aeCr" cx="40%" cy="35%" r="75%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.5" stopColor="#C8CED4" /><stop offset="1" stopColor="#7C858E" /></radialGradient></defs>
        <circle cx={CX} cy={CY} r={R + 40} fill="url(#aeCr)" stroke="#6E7780" strokeWidth={6} />
        <circle cx={CX} cy={CY} r={R} fill="#3B4046" />
        {holes.map((h) => { const c = rnd(h.i * 7.3) < clogged * 0.85; return <circle key={h.i} cx={CX + h.x} cy={CY + h.y} r={10} fill={c ? "#EDE9DC" : "#151719"} stroke={c ? "#C8C1AE" : "#5A6168"} strokeWidth={2} />; })}
        {/* el chorro visto de costado, a la derecha */}
        <g transform="translate(1280 140)">
          <rect x={-70} y={0} width={140} height={90} rx={14} fill="url(#aeCr)" stroke="#6E7780" strokeWidth={4} />
          {[-1, 0, 1].map((k) => { const sp = k * 90 * bend + (k === 0 ? 30 * bend : 0); return <path key={k} d={`M${k * 30} 90 Q ${k * 30 + sp * 0.4} 400 ${k * 30 + sp} 760`} stroke="#9CC9E6" strokeWidth={k === 0 ? 46 - 22 * bend : 12 + 18 * bend} fill="none" strokeLinecap="round" opacity={k === 0 ? 0.9 : 0.25 + 0.6 * bend} />; })}
          {bend > 0.4 ? Array.from({ length: 14 }, (_, k) => <circle key={k} cx={(rnd(k) - 0.5) * 420 * bend} cy={300 + rnd(k + 9) * 420} r={6 + rnd(k + 3) * 8} fill="#9CC9E6" opacity={0.6} />) : null}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 300, top: 70, fontFamily: LABEL, fontWeight: 700, fontSize: 48, letterSpacing: 5, color: CL.navy, opacity: lin(f, 2, 12) }}>EL AIREADOR</div>
      {mode === "clog" ? <Stamp text="Chorro torcido" at={Math.round(T * 0.6)} color={CL.red} x="67%" y="88%" rot={-5} size={58} /> : <Stamp text="Chorro derecho" at={Math.round(T * 0.6)} color={CL.navy} x="67%" y="88%" rot={-5} size={58} />}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ───────────────────────────── de qué es su lavabo
const MATS: { n: string; v: boolean; t: string; sw: string }[] = [
  { n: "Porcelana / cerámica", v: true, t: "aguanta todo · nada que raye", sw: "#F8F7F3" },
  { n: "Mármol / granito", v: false, t: "NUNCA ácido · se opaca para siempre", sw: "#D9D2C6" },
  { n: "Resina", v: true, t: "vinagre corto · 15 min", sw: "#EFE8DA" },
  { n: "Acero inoxidable", v: true, t: "10 min · a favor de la veta", sw: "#BFC5CB" },
  { n: "Vidrio", v: true, t: "perfecto · cuidado la base dorada", sw: "#D8ECF4" },
];
export const ClMaterials: React.FC<{ hi?: number; bed?: string }> = ({ hi = -1, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={307} dim={0.3} />
      <div style={{ position: "absolute", left: 230, top: 90, width: 1460, background: "#FFFDF6", borderRadius: 30, boxShadow: `24px 30px 60px ${CL.shadow}`, padding: "34px 50px 30px", translate: `0 ${(1 - pop(f, fps, 0, 15)) * 80}px` }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 5, color: CL.navy }}>¿DE QUÉ ES SU LAVABO?</div>
        <div style={{ display: "flex", justifyContent: "flex-end", fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 3, color: CL.inkSoft, marginTop: 6 }}>VINAGRE</div>
        {MATS.map((m, i) => { const k = pop(f, fps, 6 + i * 6, 15), on = hi < 0 || hi === i;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 28, padding: "16px 10px", borderTop: `2px solid ${CL.grout}`, opacity: k * (on ? 1 : 0.38), translate: `${(1 - k) * -60}px 0`, background: hi === i ? (m.v ? "rgba(47,143,72,0.09)" : "rgba(196,48,43,0.09)") : "transparent", borderRadius: 12 }}>
              <div style={{ width: 92, height: 92, borderRadius: 18, background: m.sw, boxShadow: "inset 0 -8px 16px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.15)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CL.ink, lineHeight: 1.05 }}>{m.n}</div>
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: m.v ? CL.inkSoft : CL.red }}>{m.t}</div>
              </div>
              {tick(m.v, 76)}
            </div>
          );
        })}
      </div>
      <RoomLight k={0.6} />
    </AbsoluteFill>
  );
};

// ───────────────────────────── la regla del ácido
const ACID = [{ n: "limón", x: 0.06 }, { n: "ác. cítrico", x: 0.14 }, { n: "vinagre", x: 0.25 }];
const BASEL = [{ n: "bicarbonato", x: 0.6 }, { n: "cloro", x: 0.76 }, { n: "SARRO", x: 0.9 }];
export const ClAcidBase: React.FC<{ hi?: "cloro" | "vinagre" | "bicarbonato"; bed?: string }> = ({ hi = "cloro", bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const X0 = 220, W = 1480, Y = 600;
  const bar = lin(f, 4, 22);
  const all = [...ACID.map((a) => ({ ...a, acid: true })), ...BASEL.map((a) => ({ ...a, acid: false }))];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={309} dim={0.34} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><linearGradient id="abG" x1="0" x2="1"><stop offset="0" stopColor="#E9A23B" /><stop offset="0.5" stopColor="#F4F1E8" /><stop offset="1" stopColor="#4C78A8" /></linearGradient></defs>
        <rect x={X0} y={Y - 30} width={W * bar} height={60} rx={30} fill="url(#abG)" stroke={CL.ink} strokeWidth={4} />
        <line x1={X0 + W / 2} y1={Y - 60} x2={X0 + W / 2} y2={Y + 60} stroke={CL.ink} strokeWidth={4} strokeDasharray="10 8" opacity={bar} />
      </svg>
      <div style={{ position: "absolute", left: X0, top: Y + 70, fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: "#B86E10", opacity: bar }}>ÁCIDO · DISUELVE LA PIEDRA</div>
      <div style={{ position: "absolute", left: X0 + W, top: Y + 70, translate: "-100% 0", whiteSpace: "nowrap", fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: "#2F5E93", opacity: bar }}>BASE · NO LA TOCA</div>
      <div style={{ position: "absolute", left: X0 + W / 2, top: Y + 70, translate: "-50% 0", fontFamily: HAND, fontWeight: 700, fontSize: 40, color: CL.inkSoft, opacity: bar }}>agua</div>
      {all.map((a, i) => { const k = pop(f, fps, 14 + i * 7, 13), on = a.n.toLowerCase().includes(hi) || a.n === "SARRO"; const up = i % 2 ? 1 : -1;
        return (
          <div key={i} style={{ position: "absolute", left: X0 + W * a.x, top: Y + (up < 0 ? -210 : -330), translate: "-50% 0", opacity: k, scale: String(0.8 + 0.2 * k) }}>
            <div style={{ background: a.n === "SARRO" ? CL.ink : CL.white, color: a.n === "SARRO" ? "#fff" : CL.ink, fontFamily: SERIF, fontWeight: 900, fontSize: 52, padding: "10px 26px", borderRadius: 14, boxShadow: on ? `0 0 0 8px ${a.acid ? "#E9A23B" : "#4C78A8"}, 0 16px 30px ${CL.shadow}` : `0 12px 24px ${CL.shadow}`, whiteSpace: "nowrap" }}>{a.n}</div>
            <div style={{ width: 4, height: up < 0 ? 140 : 260, background: CL.ink, margin: "0 auto", opacity: 0.6 }} />
          </div>
        );
      })}
      {hi === "cloro" ? <Stamp text="Mismo lado: no lo toca" at={Math.round(T * 0.55)} color={CL.red} x="72%" y="18%" rot={-4} size={56} /> : null}
      <RoomLight k={0.55} />
    </AbsoluteFill>
  );
};

// ───────────────────────────── el mapa de la rutina (lavabo visto de arriba)
const SPOTS = [
  { x: 0, y: -250, t: "Base de la llave", d: "venda · 1 hora" },
  { x: 0, y: -60, t: "Boca de la llave", d: "bolsita · 1 h (dorada 20 min)" },
  { x: 0, y: 150, t: "Aro del desagüe", d: "venda · 40 min" },
  { x: -330, y: 40, t: "Porcelana", d: "rociar · 15 min, 3 alarmas" },
];
export const ClWrapGuide: React.FC<{ hi?: number; bed?: string }> = ({ hi = -1, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const CX = 920, CY = 560;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={311} dim={0.3} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, translate: `0 ${(1 - pop(f, fps, 0, 15)) * 70}px` }}>
        <defs><radialGradient id="wgB" cx="50%" cy="40%" r="65%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#DCD8CE" /></radialGradient></defs>
        <rect x={CX - 520} y={CY - 400} width={1040} height={780} rx={60} fill="#EDE6D8" stroke="#C9BFAC" strokeWidth={5} />
        <ellipse cx={CX} cy={CY + 60} rx={400} ry={290} fill="url(#wgB)" stroke="#BDB6A8" strokeWidth={5} />
        <circle cx={CX} cy={CY + 150} r={44} fill="#B8BEC4" stroke="#7E868F" strokeWidth={5} /><circle cx={CX} cy={CY + 150} r={16} fill="#2A2B2D" />
        <circle cx={CX} cy={CY - 250} r={70} fill="#D9DEE3" stroke="#7E868F" strokeWidth={5} />
        <rect x={CX - 28} y={CY - 250} width={56} height={200} rx={26} fill="#C9CFD5" stroke="#7E868F" strokeWidth={4} />
        <circle cx={CX} cy={CY - 60} r={30} fill="#AEB5BC" stroke="#6E7780" strokeWidth={4} />
        <circle cx={CX} cy={CY - 330} r={18} fill="#2A2B2D" opacity={0.6} />
      </svg>
      {SPOTS.map((s, i) => { const k = pop(f, fps, 10 + i * 9, 13), on = hi < 0 || hi === i;
        return (
          <div key={i} style={{ position: "absolute", left: CX + s.x + (s.x < 0 ? -40 : 120), top: CY + s.y, translate: `${s.x < 0 ? "-100%" : "0"} -50%`, opacity: k * (on ? 1 : 0.35), display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: CL.yellow, border: `4px solid ${CL.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 34, color: CL.ink, order: s.x < 0 ? 2 : 0 }}>{i + 1}</div>
            <div style={{ background: CL.white, borderRadius: 14, padding: "10px 24px", boxShadow: hi === i ? `0 0 0 6px ${CL.navy}, 0 14px 28px ${CL.shadow}` : `0 12px 24px ${CL.shadow}` }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: CL.ink, whiteSpace: "nowrap" }}>{s.t}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 38, color: CL.navy, whiteSpace: "nowrap" }}>{s.d}</div>
            </div>
          </div>
        );
      })}
      <RoomLight k={0.55} />
    </AbsoluteFill>
  );
};
