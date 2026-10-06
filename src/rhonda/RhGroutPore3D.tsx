// RhGroutPore3D — corte 3D real (three.js) de UNA junta de azulejo vista con lupa: dos azulejos blancos esmaltados a los lados,
// la pastina en el medio cortada de frente (arena y cemento con poros), puntitos negros arriba y sus RAÍCES metidas en los poros.
// Vive en el mundo: pared de azulejo detrás, luz de ventana desde la izquierda, sombra real. Reusable con `mode`:
//   "pores"    la lupa entra: aparecen los poros y el agua del baño se mete en ellos
//   "roots"    los puntitos negros echan raíces hacia abajo, dentro de los poros
//   "bleach"   una capa blanca baja SÓLO por arriba: los puntitos se blanquean, las raíces siguen negras abajo
//   "peroxide" el líquido baja hasta el fondo, burbujas suben desde las raíces y las raíces se rompen y se van
//   "dry"      el agua de los poros se seca (sin agua no vuelve)
//   "scratch"  un rayón abre la junta y aparece un poro nuevo con un puntito
//   "paint"    pintura blanca arriba (lapicera de juntas) y los puntitos vuelven a asomar a través
// Rótulos dentro del mundo (proyectados desde los puntos 3D): labels.{pore,roots,top,dots,tile}. short = versión ráfaga (minuto 1).
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RH, LABEL, rnd, clamp01, ease } from "./RhTheme";
import { tileBg, lin } from "./RhParts";

type Mode = "pores" | "roots" | "bleach" | "peroxide" | "dry" | "scratch" | "paint";
type Labels = { pore?: string; roots?: string; top?: string; dots?: string; tile?: string };
const GW = 1.2, GH = 2.0, GD = 1.0;          // pastina: ancho, alto (profundidad de la junta), espesor
const TOP = GH / 2;                           // superficie de la junta (y)
const NP = 64, NR = 7;                        // poros, raíces

const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};
// poro i: en la cara de corte (z = +GD/2), distribuidos por todo el alto
const poreAt = (i: number) => new THREE.Vector3((rnd(i * 3 + 1) - 0.5) * GW * 0.86, TOP - 0.15 - rnd(i * 5 + 2) * (GH - 0.3), GD / 2 - 0.02);
const poreR = (i: number) => 0.022 + rnd(i * 7 + 3) * 0.04;
// raíz r: arranca en un puntito de la superficie y baja zigzagueando de poro en poro
function rootCurve(r: number) {
  const x0 = (r / (NR - 1) - 0.5) * GW * 0.78 + (rnd(r * 11) - 0.5) * 0.08;
  const P: any[] = [new THREE.Vector3(x0, TOP + 0.02, GD / 2 - 0.05)];
  const depth = 0.75 + rnd(r * 13) * 0.75;
  for (let k = 1; k <= 6; k++) { const t = k / 6; P.push(new THREE.Vector3(x0 + (rnd(r * 17 + k) - 0.5) * 0.22, TOP - depth * t, GD / 2 - 0.05 - rnd(r * 19 + k) * 0.05)); }
  return new THREE.CatmullRomCurve3(P, false, "centripetal", 0.4);
}

export const RhGroutPore3D: React.FC<{ mode?: Mode; labels?: Labels; short?: boolean }> = ({ mode = "roots", labels = {}, short }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: T } = useVideoConfig();
  const t0 = short ? 2 : 10, t1 = Math.max(t0 + 10, T * (short ? 0.85 : 0.75));
  const u = clamp01((f - t0) / (t1 - t0));    // avance de la acción del modo
  const ue = ease(u);
  // cámara: empuje lento hacia la cara de corte + leve órbita (nunca quieta)
  const a = interpolate(f, [0, T], [-0.32, 0.18], { easing: Easing.inOut(Easing.cubic) });
  const dist = interpolate(f, [0, T], [short ? 5.4 : 6.2, short ? 4.8 : 5.0], { easing: Easing.out(Easing.cubic) });
  const target = new THREE.Vector3(0, 0.25, 0.1);
  const camPos = new THREE.Vector3(Math.sin(a) * dist, 2.35 + 0.3 * (1 - f / T), Math.cos(a) * dist);

  const roots = useMemo(() => Array.from({ length: NR }, (_, r) => rootCurve(r)), []);
  const mats = useMemo(() => ({
    tile: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.06, metalness: 0.0, emissive: "#F4F2EC", emissiveIntensity: 0.25 }),
    tileBody: new THREE.MeshStandardMaterial({ color: "#F1EBDF", roughness: 0.8, emissive: "#E8E1D3", emissiveIntensity: 0.2 }),
    grout: new THREE.MeshStandardMaterial({ color: "#A9A397", roughness: 0.98 }),
    groutCut: new THREE.MeshStandardMaterial({ color: "#BDB6A8", roughness: 1 }),
    sand: new THREE.MeshStandardMaterial({ color: "#D8D1C2", roughness: 1 }),
    sand2: new THREE.MeshStandardMaterial({ color: "#8E877A", roughness: 1 }),
    pore: new THREE.MeshStandardMaterial({ color: "#7E776B", roughness: 1 }),
    water: new THREE.MeshStandardMaterial({ color: "#9CCBEA", roughness: 0.05, transparent: true, opacity: 0.75 }),
    root: new THREE.MeshStandardMaterial({ color: "#0D0C08", roughness: 0.5 }),
    dot: new THREE.MeshStandardMaterial({ color: "#121009", roughness: 0.7 }),
    bleach: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.5, transparent: true, opacity: 0.55, depthWrite: false }),
    perox: new THREE.MeshStandardMaterial({ color: "#D8ECF8", roughness: 0.05, transparent: true, opacity: 0.32, depthWrite: false }),
    bubble: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.15, transparent: true, opacity: 0.9 }),
    paint: new THREE.MeshStandardMaterial({ color: "#FDFDFB", roughness: 0.35 }),
    scratch: new THREE.MeshStandardMaterial({ color: "#6E675C", roughness: 1 }),
  }), []);

  // estado por modo
  const poresK = mode === "pores" ? ue : 1;                                   // poros visibles
  const waterK = mode === "pores" ? clamp01(u * 1.4 - 0.35) : mode === "dry" ? 1 - ue : mode === "peroxide" || mode === "bleach" || mode === "roots" ? 0.55 : 0;
  const growK = mode === "roots" ? ue : mode === "pores" ? 0 : 1;             // largo de las raíces
  const bleachK = mode === "bleach" ? ue : 0;                                 // capa blanca (sólo arriba)
  const peroxK = mode === "peroxide" ? ue : 0;                                // líquido baja hasta el fondo
  const killK = mode === "peroxide" ? clamp01((u - 0.45) / 0.45) : 0;         // raíces se rompen
  const paintK = mode === "paint" ? clamp01(u / 0.4) : 0, poke = mode === "paint" ? clamp01((u - 0.6) / 0.35) : 0;
  const scratchK = mode === "scratch" ? clamp01(u / 0.45) : 0, newDot = mode === "scratch" ? clamp01((u - 0.55) / 0.35) : 0;
  const dotsVis = mode === "pores" ? 0.6 : 1;
  const dotWhite = bleachK;                                                   // los puntitos se blanquean (por arriba)
  const bleachDepth = 0.28;                                                   // la lejía no pasa de acá
  const rootGeo = useMemo(() => roots.map((c) => new THREE.TubeGeometry(c, 40, 0.034, 7, false)), [roots]);
  // raíz parcial (crece): tubo hasta el % pedido
  const partial = (r: number, k: number) => {
    if (k >= 0.999) return rootGeo[r];
    const pts = roots[r].getSpacedPoints(40).slice(0, Math.max(2, Math.round(40 * k) + 1));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.max(2, pts.length * 2), 0.034, 7, false);
  };

  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(30, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const L: { at: any; text: string; dx: number; dy: number; t0: number; alert?: boolean }[] = [];
  const lt = (k: number) => Math.round(t0 + (t1 - t0) * k);
  if (labels.tile) L.push({ at: new THREE.Vector3(-GW / 2 - 0.55, TOP + 0.02, 0.2), text: labels.tile, dx: -120, dy: -140, t0: lt(0.05) });
  if (labels.pore) L.push({ at: poreAt(5), text: labels.pore, dx: 330, dy: 40, t0: lt(0.3) });
  if (labels.dots) L.push({ at: roots[2].getPointAt(0), text: labels.dots, dx: -260, dy: -170, t0: lt(0.15) });
  if (labels.top) L.push({ at: new THREE.Vector3(GW * 0.3, TOP - 0.1, GD / 2), text: labels.top, dx: 300, dy: -150, t0: lt(0.45) });
  if (labels.roots) L.push({ at: roots[4].getPointAt(0.75), text: labels.roots, dx: 320, dy: 120, t0: lt(mode === "roots" ? 0.6 : 0.55), alert: mode === "bleach" || mode === "paint" });

  // burbujas (peroxide): suben desde cada raíz
  const bubbles: { p: any; s: number }[] = [];
  if (mode === "peroxide") for (let r = 0; r < NR; r++) for (let b = 0; b < 9; b++) {
    const ph = ((f * (short ? 0.045 : 0.03) + rnd(r * 23 + b)) % 1), on = clamp01((peroxK - 0.25) / 0.2) * (1 - clamp01((u - 0.95) / 0.05));
    if (on <= 0) continue;
    const base = roots[r].getPointAt(clamp01(0.35 + rnd(r * 29 + b) * 0.6));
    bubbles.push({ p: new THREE.Vector3(base.x + Math.sin(ph * 9 + b) * 0.04, base.y + ph * (TOP - base.y + 0.25), GD / 2 + 0.03), s: on * (0.5 + rnd(b + r * 3) * 0.8) * (1 - ph * 0.3) });
  }

  return (
    <AbsoluteFill style={{ ...tileBg(220, 110), overflow: "hidden" }}>
      {/* luz de ventana sobre la pared (izquierda) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 22% 30%, rgba(255,250,235,0.85), rgba(255,255,255,0.15) 55%, rgba(30,42,54,0.10) 100%)" }} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true }}>
        <Cam pos={camPos} target={target} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[-5, 6, 4]} intensity={1.35} color="#FFF4E0" />
        <directionalLight position={[4, 2, 3]} intensity={0.3} color="#DCE9F5" />
        {/* azulejos a los lados: esmalte arriba, bizcocho en el corte */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * (GW / 2 + 0.75), 0, 0]}>
            <mesh material={mats.tileBody}><boxGeometry args={[1.5, GH, GD]} /></mesh>
            <mesh position={[0, TOP + 0.04, 0]} material={mats.tile}><boxGeometry args={[1.5, 0.08, GD]} /></mesh>
          </group>
        ))}
        {/* la pastina: bloque + cara de corte con poros */}
        <mesh material={mats.grout}><boxGeometry args={[GW, GH, GD]} /></mesh>
        <mesh position={[0, 0, GD / 2 + 0.001]} material={mats.groutCut}><planeGeometry args={[GW, GH]} /></mesh>
        {Array.from({ length: NP }, (_, i) => {
          const p = poreAt(i), r = poreR(i) * (0.2 + 0.8 * clamp01(poresK * 1.6 - rnd(i) * 0.6));
          const wet = clamp01(waterK * 1.5 - rnd(i * 41) * 0.5) * (mode === "peroxide" ? 1 - peroxK * 0 : 1);
          return (
            <group key={i}>
              <mesh position={[p.x, p.y, p.z - r * 0.55]} scale={[1, 1, 0.45]} material={mats.pore}><sphereGeometry args={[r, 10, 8]} /></mesh>
              {wet > 0.02 ? <mesh position={[p.x, p.y, p.z + 0.012]} scale={wet} material={mats.water}><sphereGeometry args={[r * 0.8, 10, 8]} /></mesh> : null}
            </group>
          );
        })}
        {Array.from({ length: 160 }, (_, i) => (<mesh key={"g" + i} position={[(rnd(i * 37 + 5) - 0.5) * GW * 0.96, TOP - rnd(i * 41 + 9) * GH * 0.98, GD / 2 + 0.004]} material={i % 3 ? mats.sand : mats.sand2}><circleGeometry args={[0.006 + rnd(i * 43) * 0.012, 6]} /></mesh>))}
        {/* lejía: capa blanca que baja sólo un poco */}
        {bleachK > 0.01 ? <mesh position={[0, TOP - (bleachDepth * bleachK) / 2, GD / 2 + 0.015]} material={mats.bleach}><boxGeometry args={[GW, bleachDepth * bleachK, 0.02]} /></mesh> : null}
        {/* agua oxigenada: baja hasta el fondo */}
        {peroxK > 0.01 ? <mesh position={[0, TOP - (GH * 0.95 * peroxK) / 2, GD / 2 + 0.018]} material={mats.perox}><boxGeometry args={[GW, GH * 0.95 * peroxK, 0.02]} /></mesh> : null}
        {/* raíces y puntitos */}
        {roots.map((c, r) => {
          const k = growK * (1 - killK * clamp01(1.3 - rnd(r * 3) * 0.6));
          const vis = 1 - killK;
          const top = c.getPointAt(0);
          return (
            <group key={r}>
              {k > 0.02 && vis > 0.02 ? <mesh geometry={partial(r, k)} material={mats.root} scale={[1, 1, 1]} /> : null}
              {vis > 0.02 ? [0, 1, 2, 3].map((q) => <mesh key={q} position={[top.x + (q ? (rnd(r * 7 + q) - 0.5) * 0.12 : 0), TOP + 0.02, top.z - (q ? rnd(r * 9 + q) * 0.25 : 0)]} scale={[1, 0.45, 1]} material={dotWhite > 0.5 ? mats.paint : mats.dot}><sphereGeometry args={[(q ? 0.035 : 0.065) * dotsVis * (1 - 0.3 * dotWhite), 12, 8]} /></mesh>) : null}
            </group>
          );
        })}
        {bubbles.map((b, i) => (<mesh key={"b" + i} position={b.p} scale={b.s} material={mats.bubble}><sphereGeometry args={[0.03, 8, 6]} /></mesh>))}
        {/* pintura de juntas: tapa blanca y los puntitos asoman */}
        {paintK > 0.01 ? <mesh position={[0, TOP + 0.03, 0]} scale={[paintK, 1, 1]} material={mats.paint}><boxGeometry args={[GW, 0.05, GD]} /></mesh> : null}
        {poke > 0.01 ? roots.map((c, r) => { const tp = c.getPointAt(0); return <mesh key={"pk" + r} position={[tp.x, TOP + 0.06, tp.z]} scale={[poke, 0.4 * poke, poke]} material={mats.dot}><sphereGeometry args={[0.055, 10, 8]} /></mesh>; }) : null}
        {/* rayón: canaleta en V + poro nuevo con su puntito */}
        {scratchK > 0.01 ? <mesh position={[0.15, TOP + 0.004, GD / 2 - (GD * 0.9 * scratchK) / 2]} material={mats.scratch}><boxGeometry args={[0.11, 0.012, GD * 0.9 * scratchK]} /></mesh> : null}
        {newDot > 0.01 ? <mesh position={[0.15, TOP - 0.1, GD / 2 - 0.05]} scale={newDot} material={mats.dot}><sphereGeometry args={[0.06, 10, 8]} /></mesh> : null}
        {/* sombra de contacto bajo el bloque */}
        <mesh position={[0, -GH / 2 - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[5, 2.4]} /><meshBasicMaterial color="#000000" transparent opacity={0.12} /></mesh>
      </ThreeCanvas>
      {/* rótulos en el mundo (línea al punto real) */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0, l.t0 + 12); if (k <= 0) return null;
          const ex = p.x + l.dx, ey = p.y + l.dy;
          return (<g key={i} opacity={k}>
            <circle cx={p.x} cy={p.y} r={9} fill={l.alert ? RH.red : RH.yellow} stroke={RH.ink} strokeWidth={3} />
            <line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * k} y2={p.y + (ey - p.y) * k} stroke={RH.ink} strokeWidth={4} strokeLinecap="round" />
          </g>); })}
      </svg>
      {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0 + 6, l.t0 + 18); if (k <= 0) return null;
        const est = l.text.length * 25 + 50; let x = l.dx < 0 ? p.x + l.dx - est : p.x + l.dx; x = Math.max(30, Math.min(width - est - 30, x));
        return (<div key={i} style={{ position: "absolute", left: x, top: Math.max(40, Math.min(height - 90, p.y + l.dy)), translate: "0 -50%", opacity: k, scale: String(0.85 + 0.15 * k), background: l.alert ? RH.red : RH.blueDeep, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 42, letterSpacing: 2, padding: "8px 22px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${RH.shadow}` }}>{l.text}</div>);
      })}
    </AbsoluteFill>
  );
};
