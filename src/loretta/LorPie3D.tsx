// LorPie3D — un pie 3D real (three.js) que gira bajo la luz de la cocina y al que se le levanta una porción.
// Parametrizable por tipo: chess · sugarcream · shoofly · meringue (lemon) · butterscotch · raisin · mockapple · cherry.
// Todo animado por useCurrentFrame (nada de useFrame). Texturas procedurales en canvas con PRNG determinista.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LOR, SERIF, HAND, rnd } from "./LorTheme";

export type PieType = "chess" | "sugarcream" | "shoofly" | "meringue" | "butterscotch" | "raisin" | "mockapple" | "cherry";

type Spec = { fill: string; fillSide: string; topTex: (c: CanvasRenderingContext2D, S: number) => void; meringue?: boolean; height: number; gloss: number };

const R0 = 0.95; // radio del relleno
const N = 8;     // porciones

function noiseDots(c: CanvasRenderingContext2D, S: number, seed: number, n: number, col: string, rMin: number, rMax: number, alpha = 1) {
  c.fillStyle = col; c.globalAlpha = alpha;
  for (let i = 0; i < n; i++) {
    const x = rnd(seed + i * 3) * S, y = rnd(seed + i * 3 + 1) * S, r = rMin + rnd(seed + i * 3 + 2) * (rMax - rMin);
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
  }
  c.globalAlpha = 1;
}
function radial(c: CanvasRenderingContext2D, S: number, inner: string, outer: string) {
  const g = c.createRadialGradient(S / 2, S / 2, S * 0.05, S / 2, S / 2, S * 0.5);
  g.addColorStop(0, inner); g.addColorStop(1, outer); c.fillStyle = g; c.fillRect(0, 0, S, S);
}

const SPECS: Record<PieType, Spec> = {
  chess: { fill: "#EBC25A", fillSide: "#F2D27A", height: 0.2, gloss: 0.35, topTex: (c, S) => {
    radial(c, S, "#E9B84A", "#B9772E"); noiseDots(c, S, 11, 900, "#A8652A", 2, 9, 0.35); noiseDots(c, S, 77, 500, "#F6D98A", 1, 5, 0.5);
    c.strokeStyle = "rgba(120,70,25,0.45)"; c.lineWidth = 2; // craquelado del azúcar
    for (let i = 0; i < 70; i++) { let x = rnd(300 + i) * S, y = rnd(500 + i) * S; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (rnd(i * 9 + k) - 0.5) * 60; y += (rnd(i * 7 + k + 1) - 0.5) * 60; c.lineTo(x, y); } c.stroke(); } } },
  sugarcream: { fill: "#F3E2B6", fillSide: "#F7EACB", height: 0.2, gloss: 0.3, topTex: (c, S) => {
    radial(c, S, "#F5E6BD", "#D7A968"); noiseDots(c, S, 21, 1400, "#8B5A2B", 1, 3.5, 0.55); noiseDots(c, S, 41, 60, "#C0843F", 10, 28, 0.35); } },
  shoofly: { fill: "#5B3418", fillSide: "#6E3F1D", height: 0.24, gloss: 0.2, topTex: (c, S) => {
    radial(c, S, "#B98348", "#8A5427"); noiseDots(c, S, 31, 2600, "#6E3F1D", 3, 11, 0.6); noiseDots(c, S, 61, 1600, "#D8A868", 2, 8, 0.7); } },
  meringue: { fill: "#F4D63B", fillSide: "#F6DC4E", height: 0.22, gloss: 0.4, meringue: true, topTex: (c, S) => { radial(c, S, "#FFF8E8", "#E8C790"); } },
  butterscotch: { fill: "#B8742E", fillSide: "#C4813A", height: 0.22, gloss: 0.75, topTex: (c, S) => {
    radial(c, S, "#C98A45", "#9A5A22"); c.strokeStyle = "rgba(255,230,190,0.25)"; c.lineWidth = 6;
    for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(S / 2, S / 2, 40 + i * 50 + rnd(i) * 10, rnd(i + 5) * 6, rnd(i + 5) * 6 + 2.2); c.stroke(); } } },
  raisin: { fill: "#D9BE8C", fillSide: "#DEC697", height: 0.22, gloss: 0.35, meringue: true, topTex: (c, S) => { radial(c, S, "#FFF8E8", "#E3C08A"); } },
  mockapple: { fill: "#E7C98E", fillSide: "#E2C27F", height: 0.3, gloss: 0.25, topTex: (c, S) => {
    radial(c, S, "#E8B563", "#B8742E"); noiseDots(c, S, 51, 700, "#F5D79A", 2, 7, 0.45); noiseDots(c, S, 91, 400, "#9A5A22", 1, 4, 0.45);
    c.fillStyle = "rgba(90,50,20,0.85)"; for (let i = 0; i < 5; i++) { c.save(); c.translate(S / 2, S / 2); c.rotate(i * Math.PI * 2 / 5 + 0.3); c.beginPath(); c.ellipse(S * 0.2, 0, 32, 5, 0, 0, Math.PI * 2); c.fill(); c.restore(); }
    c.fillStyle = "rgba(150,90,40,0.5)"; noiseDots(c, S, 131, 250, "#7A4A1C", 2, 4, 0.5); } },
  cherry: { fill: "#8E1B25", fillSide: "#9E2330", height: 0.24, gloss: 0.6, topTex: (c, S) => {
    c.fillStyle = "#7A1320"; c.fillRect(0, 0, S, S); noiseDots(c, S, 71, 180, "#B02A36", 14, 26, 0.9); noiseDots(c, S, 72, 120, "#5E0E18", 10, 18, 0.7);
    const strip = (x: number, vert: boolean) => { const w = S * 0.085; const g = vert ? c.createLinearGradient(x, 0, x + w, 0) : c.createLinearGradient(0, x, 0, x + w);
      g.addColorStop(0, "#B8742E"); g.addColorStop(0.5, "#EDC27A"); g.addColorStop(1, "#B8742E"); c.fillStyle = g; if (vert) c.fillRect(x, 0, w, S); else c.fillRect(0, x, S, w); };
    for (let i = 0; i < 6; i++) strip(S * (0.1 + i * 0.15), true); for (let i = 0; i < 6; i++) strip(S * (0.1 + i * 0.15), false);
    noiseDots(c, S, 73, 300, "#F7D9A0", 1, 3, 0.5); } },
};

function canvasTex(draw: (c: CanvasRenderingContext2D, S: number) => void, S = 512, repeat = 1) {
  const cv = document.createElement("canvas"); cv.width = cv.height = S;
  const c = cv.getContext("2d")!; draw(c, S);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  if (repeat !== 1) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat); }
  return t;
}

// repulgue: toro con el radio menor modulado (ondas del pulgar)
function crimpGeom(arc: number, seg: number) {
  const g = new THREE.TorusGeometry(0.985, 0.085, 10, seg, arc);
  const p = g.attributes.position as any;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const u = Math.atan2(v.y, v.x);
    const rr = Math.hypot(v.x, v.y);
    const off = rr - 0.985;
    const k = 1 + 0.35 * Math.abs(Math.sin(u * 24));
    const nr = 0.985 + off * k;
    v.x = Math.cos(u) * nr; v.y = Math.sin(u) * nr; v.z *= k * 1.1;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

const Wedge: React.FC<{ i: number; spec: Spec; topTex: any; mats: Record<string, any>; peakGeo: any; lift: number; type: PieType }> = ({ i, spec, topTex, mats, peakGeo, lift, type }) => {
  const len = (Math.PI * 2) / N, t0 = i * len, tc = t0 + len / 2, h = spec.height;
  const fillGeo = useMemo(() => new THREE.CylinderGeometry(R0, R0 * 0.93, h, 14, 1, false, t0, len), [t0, len, h]);
  const baseGeo = useMemo(() => new THREE.CylinderGeometry(R0 * 0.93, R0 * 0.86, 0.07, 14, 1, false, t0, len), [t0, len]);
  const rimGeo = useMemo(() => crimpGeom(len, 18), [len]);
  const merGeo = useMemo(() => new THREE.CylinderGeometry(R0 * 0.96, R0, 0.12, 14, 1, false, t0, len), [t0, len]);
  const fillMats = useMemo(() => [mats.side, new THREE.MeshStandardMaterial({ map: topTex, roughness: 1 - spec.gloss, metalness: 0 }), mats.crust], [topTex, mats, spec.gloss]);
  const cut = (th: number, hh: number, y: number, mat: any) => (
    <mesh position={[Math.sin(th) * R0 / 2, y, Math.cos(th) * R0 / 2]} rotation={[0, th - Math.PI / 2, 0]} material={mat}>
      <planeGeometry args={[R0, hh]} />
    </mesh>
  );
  const peaks = useMemo(() => {
    if (!spec.meringue) return [] as [number, number, number, number][];
    const out: [number, number, number, number][] = [];
    for (let k = 0; k < 16; k++) {
      const a = t0 + 0.08 + rnd(i * 97 + k) * (len - 0.16), r = 0.12 + Math.sqrt(rnd(i * 131 + k)) * 0.78;
      out.push([Math.sin(a) * r, Math.cos(a) * r, 0.7 + rnd(i * 17 + k) * 0.7, rnd(i * 29 + k) * 6]);
    }
    return out;
  }, [spec.meringue, t0, len, i]);
  const d = lift * 0.75, up = lift * 0.55;
  return (
    <group position={[Math.sin(tc) * d, up, Math.cos(tc) * d]} rotation={[Math.cos(tc) * lift * 0.12, 0, -Math.sin(tc) * lift * 0.12]}>
      <mesh geometry={baseGeo} position={[0, 0.035, 0]} material={mats.crust} />
      <mesh geometry={fillGeo} position={[0, 0.07 + h / 2, 0]} material={fillMats} />
      {cut(t0, h, 0.07 + h / 2, mats.side)}
      {cut(t0 + len, h, 0.07 + h / 2, mats.side)}
      {cut(t0, 0.07, 0.035, mats.crust)}
      {cut(t0 + len, 0.07, 0.035, mats.crust)}
      {spec.meringue ? (
        <>
          <mesh geometry={merGeo} position={[0, 0.07 + h + 0.06, 0]} material={mats.meringue} />
          {cut(t0, 0.12, 0.07 + h + 0.06, mats.meringue)}
          {cut(t0 + len, 0.12, 0.07 + h + 0.06, mats.meringue)}
          {peaks.map(([x, z, s, r], k) => (
            <mesh key={k} geometry={peakGeo} material={mats.peak} position={[x, 0.07 + h + 0.12, z]} scale={[s, s * 1.1, s]} rotation={[0.25 * Math.sin(r), r, 0.25 * Math.cos(r)]} />
          ))}
        </>
      ) : null}
      <group rotation={[0, t0 - Math.PI / 2, 0]}>
        <mesh geometry={rimGeo} position={[0, 0.07 + h * 0.85, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.crust} />
      </group>
      {type === "raisin" ? null : null}
    </group>
  );
};

export const LorPie3D: React.FC<{ type?: PieType; title?: string; sub?: string; lift?: boolean; liftAt?: number; spin?: number; bg?: "gingham" | "wood" | "paper" }> = ({ type = "chess", title, sub, lift = true, liftAt = 45, spin = 0.35, bg = "gingham" }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const spec = SPECS[type];
  const topTex = useMemo(() => canvasTex(spec.topTex), [spec]);
  const tableTex = useMemo(() => canvasTex((c, S) => {
    if (bg === "wood") { c.fillStyle = "#B98A5A"; c.fillRect(0, 0, S, S); for (let i = 0; i < 60; i++) { c.strokeStyle = `rgba(90,55,25,${0.15 + rnd(i) * 0.2})`; c.lineWidth = 1 + rnd(i + 3) * 3; c.beginPath(); c.moveTo(0, rnd(i + 9) * S); c.bezierCurveTo(S / 3, rnd(i + 1) * S, S * 2 / 3, rnd(i + 2) * S, S, rnd(i + 4) * S); c.stroke(); } noiseDots(c, S, 5, 400, "#FFFFFF", 1, 2, 0.35); }
    else if (bg === "paper") { c.fillStyle = LOR.paper; c.fillRect(0, 0, S, S); noiseDots(c, S, 5, 900, "#C9B48A", 1, 3, 0.2); }
    else { c.fillStyle = "#FFFDF7"; c.fillRect(0, 0, S, S); c.fillStyle = "rgba(200,50,58,0.5)"; const q = S / 8; for (let k = 0; k < 8; k += 2) { c.fillRect(k * q, 0, q, S); c.fillRect(0, k * q, S, q); } noiseDots(c, S, 5, 700, "#FFFFFF", 1, 2, 0.25); }
  }, 512, bg === "gingham" ? 5 : 2), [bg]);
  const mats = useMemo(() => {
    const crustTex = canvasTex((c, S) => { c.fillStyle = "#D99A4E"; c.fillRect(0, 0, S, S); noiseDots(c, S, 9, 1500, "#F2C27E", 1, 5, 0.6); noiseDots(c, S, 19, 900, "#A8652A", 1, 4, 0.5); }, 256, 2);
    return {
      crust: new THREE.MeshStandardMaterial({ map: crustTex, roughness: 0.8 }),
      side: new THREE.MeshStandardMaterial({ color: spec.fillSide, roughness: 1 - spec.gloss * 0.6, side: THREE.DoubleSide }),
      meringue: new THREE.MeshStandardMaterial({ color: "#FFF8EC", roughness: 0.85, side: THREE.DoubleSide }),
      peak: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 }),
      glass: new THREE.MeshStandardMaterial({ color: "#D6E6EA", roughness: 0.15, metalness: 0.05 }),
      table: new THREE.MeshStandardMaterial({ map: tableTex, roughness: 0.9 }),
      shadow: new THREE.MeshBasicMaterial({ map: canvasTex((c, S) => { const g = c.createRadialGradient(S / 2, S / 2, S * 0.25, S / 2, S / 2, S / 2); g.addColorStop(0, "rgba(0,0,0,0.45)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(0, 0, S, S); }, 256), transparent: true, depthWrite: false }),
    };
  }, [spec, tableTex]);
  const peakGeo = useMemo(() => {
    const g = new THREE.ConeGeometry(0.07, 0.16, 10, 3);
    const p = g.attributes.position as any; const col: number[] = [];
    for (let k = 0; k < p.count; k++) { const y = p.getY(k); const t = THREE.MathUtils.clamp((y + 0.02) / 0.1, 0, 1); const a = new THREE.Color("#FFF7E6"), b = new THREE.Color("#C27A34"); a.lerp(b, t * t); col.push(a.r, a.g, a.b); }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); return g;
  }, []);

  const liftP = lift ? interpolate(frame, [liftAt, liftAt + 1.4 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) }) : 0;
  const t = frame / fps;
  const ang = 0.6 + t * spin;
  const dist = interpolate(frame, [0, durationInFrames], [3.4, 2.7], { extrapolateRight: "clamp" });
  const elev = interpolate(frame, [0, durationInFrames], [0.95, 0.72], { extrapolateRight: "clamp" });
  const camPos: [number, number, number] = [Math.sin(ang) * dist * Math.cos(elev), dist * Math.sin(elev), Math.cos(ang) * dist * Math.cos(elev)];
  const titleIn = interpolate(frame, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  return (
    <AbsoluteFill style={{ backgroundColor: "#EFE3C8" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: camPos, near: 0.1, far: 50 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamLook pos={camPos} />
        <color attach="background" args={["#EFE3C8"]} />
        <hemisphereLight args={["#FFF6E0", "#B98A5A", 0.9]} />
        <directionalLight position={[3, 5, 2]} intensity={2.1} color="#FFF1D6" />
        <directionalLight position={[-4, 2.5, -2]} intensity={0.55} color="#DDE8FF" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} material={mats.table}><planeGeometry args={[14, 14]} /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} material={mats.shadow}><planeGeometry args={[2.9, 2.9]} /></mesh>
        <mesh position={[0, 0.03, 0]} material={mats.glass}><cylinderGeometry args={[1.12, 0.95, 0.06, 48]} /></mesh>
        <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.glass}><torusGeometry args={[1.12, 0.04, 8, 64]} /></mesh>
        {Array.from({ length: N }).map((_, i) => (
          <Wedge key={i} i={i} spec={spec} topTex={topTex} mats={mats} peakGeo={peakGeo} lift={i === 0 ? liftP : 0} type={type} />
        ))}
      </ThreeCanvas>
      {title ? (
        <div style={{ position: "absolute", left: 90, top: 80, opacity: titleIn, translate: `${(1 - titleIn) * -30}px 0px` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 104, color: LOR.ink, lineHeight: 1, letterSpacing: -1, textShadow: "0 2px 0 rgba(255,255,255,0.6)" }}>{title}</div>
          {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: LOR.gingham, marginTop: 8 }}>{sub}</div> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const CamLook: React.FC<{ pos: [number, number, number]; target?: [number, number, number] }> = ({ pos, target = [0, 0.15, 0] }) => {
  // la cámara por defecto del ThreeCanvas, reubicada en cada cuadro (sin useFrame)
  const { camera } = useThree();
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(target[0], target[1], target[2]);
  camera.updateProjectionMatrix();
  return null;
};
