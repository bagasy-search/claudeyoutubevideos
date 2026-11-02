// plo31t (kit de ctr31a) · MESA 3D: el set de objetos de oficio para las piezas (piso con luz, cámara con mano, objetos con material de verdad).
// <Mesa> = ThreeCanvas + entorno PBR + bloom (umbral 0,97) + AO + luz cálida con motivo + piso; adentro van los objetos.
// Objetos: balde gris, frasco marrón (genérico, sin marca), linterna, trapo azul, caño transparente con contenido, unión de PVC,
// cuchara, sopapas, regla. Todo es f(t) (sin estado). Llegadas con resorte: drop(t, a) → altura que se pasa, rebota y asienta.
import React, { useEffect, useMemo, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { BgCtx } from "./base";
import { P } from "./lib";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { Pose, V3, mano } from "./casa";

export const W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
export const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
// resorte con masa: 0 → 1 con sobrepico (y nunca negativo antes de a)
export const spr = (t: number, a: number, k = 1) => { const x = Math.max(0, (t - a) * 6 * k); return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.9); };
// caída: altura extra que baja, rebota un poco y asienta; aplasta la sombra al apoyarse
export const drop = (t: number, a: number, h = 1.2) => (t < a ? h : h * Math.max(-0.06, 1 - spr(t, a, 0.9)));

const Rig: React.FC<{ c: Pose }> = ({ c }) => {
  const { camera } = useThree(); const k = camera as THREE.PerspectiveCamera;
  k.position.set(...c.p); k.up.set(0, 1, 0); k.lookAt(...c.l); k.fov = c.fov ?? 34; k.near = 0.01; k.far = 100; k.updateProjectionMatrix();
  return null;
};
// cámara que deriva en curva (seno lento) + mano; nunca quieta, nunca zoom lineal
export const orbit = (t: number, a: number, base: Pose, amt = 1): Pose => {
  const u = (t - a), m = mano(t, 0.5 * amt);
  const ang = 0.16 * Math.sin(u * 0.22) * amt, push = 1 - 0.07 * sm(u / 9) * amt;
  const d = [base.p[0] - base.l[0], base.p[1] - base.l[1], base.p[2] - base.l[2]];
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const px = base.l[0] + (d[0] * ca - d[2] * sa) * push, pz = base.l[2] + (d[0] * sa + d[2] * ca) * push;
  return { p: [px + m.dp[0], base.p[1] + (base.p[1] - base.l[1]) * (push - 1) + m.dp[1] + 0.05 * Math.sin(u * 0.3), pz + m.dp[2]], l: [base.l[0] + m.dl[0], base.l[1] + m.dl[1], base.l[2]], fov: base.fov };
};

// telón de fondo DENTRO de la escena (el bloom/AO pierden el canal alfa): el cuadro desenfocado del clip Veo de la pieza,
// siempre de frente a la cámara, 6 m detrás del punto que mira → la mesada queda en una cocina/baño real
const TEXC = new Map<string, THREE.Texture>();
export const useImgTex = (url?: string) => {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [h] = useState(() => (url ? delayRender("telón " + url) : 0));
  useEffect(() => {
    if (!url) return;
    const c = TEXC.get(url);
    if (c) { setTex(c); return; }
    new THREE.TextureLoader().load(url, (t) => { t.colorSpace = THREE.SRGBColorSpace; TEXC.set(url, t); setTex(t); }, undefined, () => continueRender(h));
  }, [url, h]);
  // la captura se suelta recién cuando el Telón ya se dibujó (ver Telon: advance + done)
  const [listo] = useState(() => ({ ok: false }));
  const done = () => { if (!listo.ok && h) { listo.ok = true; continueRender(h); } };
  return [tex, done] as const;
};
export const Telon: React.FC<{ cam: Pose; tex: THREE.Texture; dist?: number; tone?: string; done?: () => void }> = ({ cam, tex, dist = 6, tone = "#d8d0c4", done }) => {
  // ThreeCanvas renderiza con frameloop "never": sin este advance el telón recién aparece en el cuadro siguiente (cuadros negros)
  const { advance } = useThree();
  useEffect(() => { advance(performance.now()); requestAnimationFrame(() => { advance(performance.now()); done?.(); }); }, [tex, advance]);
  const d = new THREE.Vector3(cam.l[0] - cam.p[0], cam.l[1] - cam.p[1], cam.l[2] - cam.p[2]), L = d.length(); d.normalize();
  const D = L + dist, c = new THREE.Vector3(...cam.p).addScaledVector(d, D), hgt = 2 * D * Math.tan(((cam.fov ?? 34) * Math.PI) / 360) * 1.25;
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), d.clone().negate());
  return <mesh position={c} quaternion={q}><planeGeometry args={[hgt * 16 / 9, hgt]} /><meshBasicMaterial map={tex} toneMapped={false} fog={false} color={tone} /></mesh>;
};
export const Mesa: React.FC<{ cam: Pose; floor?: "madera" | "azulejo" | "mueble" | "nada"; warm?: number; bloom?: number; bg?: string; children: React.ReactNode; light?: V3 }> = ({ cam, floor = "madera", warm = 1, bloom = 0.5, bg = "#120f0c", children, light = [1.6, 3.2, 2.0] }) => {
  const tx = useTextures();
  const bgId = React.useContext(BgCtx), [tel, telDone] = useImgTex(bgId ? staticFile(P + "vbg/" + bgId + ".jpg") : undefined);
  const map = floor === "madera" ? tx.planks : floor === "azulejo" ? tx.tile : floor === "mueble" ? tx.paper : undefined;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }} style={{ position: "absolute", inset: 0 }}>
      <Rig c={cam} />
      {tel && <Telon cam={cam} tex={tel} done={telDone} />}
      <Post bloom={bloom} threshold={0.97} exposure={1.0} env={0.55} />
      <fog attach="fog" args={[bg, 9, 22]} />
      <hemisphereLight args={[0xd8e6ff, 0x2a2018, 0.5]} />
      <spotLight position={light} angle={0.55} penumbra={0.85} intensity={5.5 * warm} color="#ffe9cf" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0003} shadow-normalBias={0.02} target-position={[0, 0, 0]} />
      <directionalLight position={[-3, 2.5, 1.5]} intensity={0.55} color="#bcd4ff" />
      {/* mesada FINITA (no un piso infinito): detrás se ve la cocina/baño real del clip de fondo, desenfocado */}
      {floor !== "nada" && <mesh position={[0, -0.04, 0.1]} receiveShadow castShadow><boxGeometry args={[3.0, 0.08, 1.9]} /><meshStandardMaterial color={floor === "azulejo" ? "#d9d4c8" : floor === "mueble" ? "#bba98a" : "#a1846a"} map={map} roughness={0.75} /></mesh>}
      {children}
    </ThreeCanvas>
  );
};

export const Bx: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; ro?: number; rot?: V3; e?: string; ei?: number; o?: number }> = ({ p, s, c, r = 0.02, m = 0, ro = 0.55, rot = [0, 0, 0], e, ei = 0, o = 1 }) => (
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], r)} castShadow receiveShadow>
    <meshStandardMaterial color={c} metalness={m} roughness={ro} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={o < 1} opacity={o} />
  </mesh>
);

// balde gris de plástico (abierto, con borde y asa de alambre)
export const Balde: React.FC<{ p: V3; s?: number; fill?: number; fillCol?: string }> = ({ p, s = 1, fill = 0, fillCol = "#6b675e" }) => {
  const g = useMemo(() => { const pts = [new THREE.Vector2(0.0, 0), new THREE.Vector2(0.2, 0), new THREE.Vector2(0.27, 0.42), new THREE.Vector2(0.285, 0.43), new THREE.Vector2(0.28, 0.445), new THREE.Vector2(0.262, 0.43), new THREE.Vector2(0.19, 0.012)]; return new THREE.LatheGeometry(pts, 48); }, []);
  return (
    <group position={p} scale={s}>
      <mesh geometry={g} castShadow receiveShadow><meshPhysicalMaterial color="#8d9196" roughness={0.45} clearcoat={0.4} side={THREE.DoubleSide} /></mesh>
      {fill > 0 && <mesh position={[0, 0.42 * fill, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.2 + 0.065 * fill, 40]} /><meshPhysicalMaterial color={fillCol} roughness={0.25} clearcoat={1} /></mesh>}
      <mesh position={[0, 0.43, 0]} rotation={[0.25, 0, 0]}><torusGeometry args={[0.285, 0.006, 8, 40, Math.PI]} /><meshStandardMaterial color="#bfc3c7" metalness={0.9} roughness={0.3} /></mesh>
    </group>
  );
};
// frasco marrón de farmacia (genérico): vidrio ámbar con líquido, tapa blanca, etiqueta lisa con «3 %»
export const Frasco: React.FC<{ p: V3; s?: number; rot?: number; level?: number; glow?: number }> = ({ p, s = 1, rot = 0, level = 0.72, glow = 0 }) => {
  const g = useMemo(() => { const v = [[0, 0], [0.085, 0], [0.095, 0.01], [0.095, 0.2], [0.088, 0.235], [0.05, 0.27], [0.034, 0.285], [0.034, 0.31], [0, 0.31]].map(([x, y]) => new THREE.Vector2(x, y)); return new THREE.LatheGeometry(v, 48); }, []);
  const lab = useMemo(() => { const c = document.createElement("canvas"); c.width = 512; c.height = 256; const x = c.getContext("2d")!; x.fillStyle = "#f2ede2"; x.fillRect(0, 0, 512, 256); x.fillStyle = "#2a5a8a"; x.fillRect(0, 0, 512, 34); x.fillRect(0, 222, 512, 34); x.fillStyle = "#1d2a36"; x.font = "bold 92px Arial"; x.textAlign = "center"; x.fillText("3 %", 256, 158); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }, []);
  return (
    <group position={p} scale={s} rotation={[0, rot, 0]}>
      <mesh geometry={g} castShadow><meshPhysicalMaterial color="#6b3510" roughness={0.08} transmission={0.35} thickness={0.03} clearcoat={1} transparent opacity={0.92} emissive="#ff8a30" emissiveIntensity={0.12 * glow} /></mesh>
      <mesh position={[0, 0.1 * level, 0]}><cylinderGeometry args={[0.088, 0.088, 0.2 * level, 40]} /><meshStandardMaterial color="#3b1a06" roughness={0.2} /></mesh>
      <mesh position={[0, 0.115, 0]}><cylinderGeometry args={[0.0965, 0.0965, 0.11, 48, 1, true, -1.2, 2.4]} /><meshStandardMaterial map={lab} roughness={0.7} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.325, 0]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.05, 32]} /><meshStandardMaterial color="#f4f2ee" roughness={0.35} /></mesh>
    </group>
  );
};
// linterna de mano con haz (la luz siempre montada: intensidad en rampa)
export const Linterna: React.FC<{ p: V3; rot?: V3; on?: number; s?: number; target?: V3 }> = ({ p, rot = [0, 0, Math.PI / 2], on = 0, s = 1, target }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh castShadow><cylinderGeometry args={[0.03, 0.03, 0.22, 24]} /><meshStandardMaterial color="#26292e" metalness={0.6} roughness={0.35} /></mesh>
    <mesh position={[0, 0.13, 0]} castShadow><cylinderGeometry args={[0.048, 0.034, 0.06, 28]} /><meshStandardMaterial color="#9aa0a7" metalness={0.9} roughness={0.2} /></mesh>
    <mesh position={[0, 0.162, 0]}><circleGeometry args={[0.042, 28]} /><meshBasicMaterial color={new THREE.Color("#3a3a3a").lerp(new THREE.Color("#fff6dc"), on)} toneMapped={false} /></mesh>
    <spotLight position={[0, 0.17, 0]} angle={0.32} penumbra={0.5} intensity={9 * on} distance={5} color="#fff3d6" castShadow target-position={target ?? [0, 3, 0]} />
  </group>
);
// trapo azul doblado (tela con sheen)
export const Trapo: React.FC<{ p: V3; s?: number; rot?: number }> = ({ p, s = 1, rot = 0 }) => {
  const g = useMemo(() => { const q = new THREE.PlaneGeometry(0.9, 0.6, 30, 20); const a = q.attributes.position; for (let i = 0; i < a.count; i++) { const x = a.getX(i), y = a.getY(i); a.setZ(i, 0.012 * Math.sin(x * 14 + y * 5) + 0.008 * Math.sin(y * 22)); } q.computeVertexNormals(); return q; }, []);
  return <mesh geometry={g} position={p} rotation={[-Math.PI / 2, 0, rot]} scale={s} receiveShadow castShadow><meshPhysicalMaterial color="#2d5d9c" roughness={0.9} sheen={1} sheenColor="#8fb6ff" sheenRoughness={0.6} side={THREE.DoubleSide} /></mesh>;
};
// tramo de caño transparente (vidrio) horizontal, eje X, con lo que lleva adentro
export const CanoVidrio: React.FC<{ p: V3; len: number; r: number; children?: React.ReactNode; tint?: string }> = ({ p, len, r, children, tint = "#e6f2f7" }) => (
  <group position={p}>
    <mesh rotation={[0, 0, Math.PI / 2]} renderOrder={3}><cylinderGeometry args={[r, r, len, 64, 1, true]} /><meshPhysicalMaterial color={tint} roughness={0.04} transmission={0.92} thickness={0.02} ior={1.45} clearcoat={1} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[(k * len) / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[r, r * 0.06, 10, 48]} /><meshStandardMaterial color="#cfd8de" metalness={0.3} roughness={0.2} /></mesh>)}
    {children}
  </group>
);
// unión de PVC (manguito con tuerca) sobre el eje X; warp = cuánto se comba (0..1), drip = gota que cae
export const Union: React.FC<{ p: V3; warp?: number; t?: number; drip?: number; hot?: number }> = ({ p, warp = 0, t = 0, drip = 0, hot = 0 }) => {
  const col = new THREE.Color("#c9cdd0").lerp(new THREE.Color("#e8c9a0"), hot * 0.6);
  const ph = (t * 0.9) % 1;
  return (
    <group position={p}>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.42, -warp * 0.06 * (k + 1), 0]} rotation={[0, 0, Math.PI / 2 + k * -warp * 0.18]} castShadow><cylinderGeometry args={[0.07, 0.07, 0.62, 40]} /><meshPhysicalMaterial color={col} roughness={0.38} clearcoat={0.5} /></mesh>)}
      <mesh rotation={[0, 0, Math.PI / 2 - warp * 0.1]} position={[0, -warp * 0.02, 0]} castShadow scale={[1, 1 + warp * 0.08, 1 - warp * 0.12]}><cylinderGeometry args={[0.105, 0.105, 0.26, 12]} /><meshPhysicalMaterial color={col} roughness={0.32} clearcoat={0.6} /></mesh>
      {drip > 0.01 && <mesh position={[0.02, -0.11 - ph * 0.9, 0.02]} scale={[0.022, 0.03 + 0.012 * Math.sin(ph * 6), 0.022].map((v) => v * drip) as V3}><sphereGeometry args={[1, 16, 12]} /><meshPhysicalMaterial color="#cfe8f5" roughness={0.02} transmission={0.9} thickness={0.01} /></mesh>}
    </group>
  );
};
// regla de carpintero plegable (madera amarilla con marcas)
export const Regla: React.FC<{ p: V3; len?: number; rot?: V3 }> = ({ p, len = 0.6, rot = [0, 0, 0] }) => {
  const tex = useMemo(() => { const c = document.createElement("canvas"); c.width = 1024; c.height = 64; const x = c.getContext("2d")!; x.fillStyle = "#e9c24a"; x.fillRect(0, 0, 1024, 64); x.fillStyle = "#1d1a12"; for (let i = 0; i <= 60; i++) { const X = (i / 60) * 1024; x.fillRect(X, 0, 2, i % 10 === 0 ? 30 : i % 5 === 0 ? 20 : 12); if (i % 10 === 0 && i > 0) { x.font = "bold 22px Arial"; x.fillText(String(i), X + 4, 54); } } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }, []);
  return <mesh position={p} rotation={rot} castShadow><boxGeometry args={[len, 0.008, 0.04]} /><meshStandardMaterial map={tex} roughness={0.55} /></mesh>;
};
