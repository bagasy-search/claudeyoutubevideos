// ClMixCloud3D — dos botellas de limpieza en 3D real (three.js) APOYADAS en la mesada del baño del hotel (cama real debajo, sombra
// de contacto, luz cálida del techo). Se acercan despacio; cuando se tocan:
//   mode "gas"    → sube una nube pálida amarillo-verdosa (partículas que crecen y se abren) + sello rojo (verdict)
//   mode "cancel" → burbujas que se apagan en el medio, sin nube: "se anulan" (sello azul marino, no es alarma)
// Etiquetas en blanco (sin marca), sólo la plaquita de latón con el nombre genérico. Reusable: a/b (rótulos), kindA/kindB
// ("jug" bidón blanco del cloro · "spray" rociador transparente · "brown" frasco marrón · "glass" limpiavidrios azul), verdict, bed.
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, rnd, clamp01 } from "./ClTheme";
import { Bed, Contact, RoomLight, Stamp, lin, pop } from "./ClParts";

const Cam: React.FC<{ pos: THREE.Vector3; target: THREE.Vector3 }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};
type Kind = "jug" | "spray" | "brown" | "glass";
const lathe = (prof: [number, number][]) => new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 56);
const PROF: Record<Kind, [number, number][]> = {
  jug: [[0, 0], [0.5, 0], [0.56, 0.05], [0.58, 0.15], [0.58, 1.45], [0.5, 1.62], [0.26, 1.78], [0.2, 1.84], [0.2, 2.02], [0, 2.02]],
  spray: [[0, 0], [0.38, 0], [0.42, 0.05], [0.42, 1.3], [0.36, 1.44], [0.2, 1.56], [0.16, 1.62], [0.16, 1.78], [0, 1.78]],
  brown: [[0, 0], [0.42, 0], [0.47, 0.04], [0.48, 0.12], [0.48, 1.25], [0.46, 1.38], [0.36, 1.58], [0.22, 1.72], [0.17, 1.8], [0.17, 1.98], [0, 1.98]],
  glass: [[0, 0], [0.4, 0], [0.44, 0.05], [0.44, 1.32], [0.38, 1.46], [0.2, 1.58], [0.16, 1.64], [0.16, 1.8], [0, 1.8]],
};
const Bottle: React.FC<{ kind: Kind; x: number; tilt: number; rotY: number }> = ({ kind, x, tilt, rotY }) => {
  const g = useMemo(() => lathe(PROF[kind]), [kind]);
  const m = useMemo(() => {
    const body = kind === "jug" ? new THREE.MeshStandardMaterial({ color: "#F3F3EF", roughness: 0.45 })
      : kind === "brown" ? new THREE.MeshPhysicalMaterial({ color: "#4A2810", roughness: 0.16, clearcoat: 0.8 })
      : kind === "glass" ? new THREE.MeshPhysicalMaterial({ color: "#7FB8E6", roughness: 0.08, transparent: true, opacity: 0.55, clearcoat: 1, depthWrite: false })
      : new THREE.MeshPhysicalMaterial({ color: "#EEF4F6", roughness: 0.06, transparent: true, opacity: 0.35, clearcoat: 1, depthWrite: false });
    return { body, label: new THREE.MeshStandardMaterial({ color: "#FAFAF7", roughness: 0.7, side: THREE.DoubleSide }), cap: new THREE.MeshStandardMaterial({ color: kind === "jug" ? "#2F6FD0" : "#F4F4F2", roughness: 0.4 }), liquid: new THREE.MeshStandardMaterial({ color: kind === "glass" ? "#5FA8E8" : "#DDEFF5", transparent: true, opacity: 0.4, depthWrite: false }) };
  }, [kind]);
  const top = PROF[kind][PROF[kind].length - 1][1];
  const sprayer = kind === "spray" || kind === "glass" || kind === "brown";
  const r = PROF[kind][3][0];
  return (
    <group position={[x, 0, 0]} rotation={[0, rotY, tilt]}>
      <mesh geometry={g} material={m.body} />
      <mesh position={[0, top * 0.38, 0]} material={m.label}><cylinderGeometry args={[r + 0.008, r + 0.008, top * 0.34, 48, 1, true]} /></mesh>
      {kind === "spray" || kind === "glass" ? <mesh position={[0, 0.6, 0]} material={m.liquid}><cylinderGeometry args={[r - 0.04, r - 0.04, 1.1, 32]} /></mesh> : null}
      {kind === "jug" ? (
        <>
          <mesh position={[0, top + 0.09, 0]} material={m.cap}><cylinderGeometry args={[0.23, 0.23, 0.18, 24]} /></mesh>
          {/* asa del bidón */}
          <mesh position={[0.36, 1.25, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.body}><torusGeometry args={[0.22, 0.06, 12, 24, Math.PI]} /></mesh>
        </>
      ) : sprayer ? (
        <group position={[0, top, 0]}>
          <mesh position={[0, 0.1, 0]} material={m.cap}><cylinderGeometry args={[0.19, 0.19, 0.2, 24]} /></mesh>
          <mesh position={[0.05, 0.36, 0]} material={m.cap}><boxGeometry args={[0.34, 0.3, 0.24]} /></mesh>
          <mesh position={[0.34, 0.42, 0]} rotation={[0, 0, Math.PI / 2]} material={m.cap}><cylinderGeometry args={[0.07, 0.09, 0.3, 16]} /></mesh>
          <mesh position={[0.2, 0.12, 0]} rotation={[0, 0, 0.35]} material={m.cap}><boxGeometry args={[0.07, 0.32, 0.15]} /></mesh>
        </group>
      ) : null}
    </group>
  );
};
// nube: esferas translúcidas que nacen en el punto de encuentro, suben, crecen y se abren (determinista)
const Cloud: React.FC<{ k: number; color: string }> = ({ k, color }) => {
  const mats = useMemo(() => Array.from({ length: 34 }, () => new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0, depthWrite: false, roughness: 1 })), [color]);
  return (
    <group position={[0, 1.6, 0.1]}>
      {mats.map((mt, i) => {
        const born = rnd(i * 3 + 1) * 0.55, life = clamp01((k - born) / (1 - born));
        const ang = rnd(i * 5 + 2) * Math.PI * 2, rad = 0.15 + life * (0.6 + rnd(i + 7) * 1.1);
        mt.opacity = life <= 0 ? 0 : 0.2 * Math.sin(Math.min(1, life * 1.4) * Math.PI * 0.5) * (1 - 0.35 * life);
        const s = 0.25 + life * (0.5 + rnd(i + 11) * 0.7);
        return <mesh key={i} material={mt} position={[Math.cos(ang) * rad, life * (0.9 + rnd(i + 13) * 1.3), Math.sin(ang) * rad * 0.6]} scale={s}><sphereGeometry args={[0.5, 14, 10]} /></mesh>;
      })}
    </group>
  );
};
const Fizz: React.FC<{ k: number }> = ({ k }) => {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.9 }), []);
  return (
    <group position={[0, 1.2, 0.2]}>
      {Array.from({ length: 22 }, (_, i) => {
        const t = (k * 3 + rnd(i)) % 1, fade = 1 - clamp01((k - 0.55) / 0.4);
        return <mesh key={i} material={mat} position={[(rnd(i + 3) - 0.5) * 0.9, t * 0.9, (rnd(i + 5) - 0.5) * 0.4]} scale={Math.max(0.001, (0.5 + rnd(i + 9)) * fade * (1 - t))}><sphereGeometry args={[0.05, 8, 6]} /></mesh>;
      })}
    </group>
  );
};

// nube SUAVE: manchas de gradiente radial (bordes que se pierden) que nacen entre las botellas, suben y se abren
const SoftCloud: React.FC<{ k: number }> = ({ k }) => (
  <AbsoluteFill style={{ pointerEvents: "none", filter: "blur(18px)" }}>
    {Array.from({ length: 26 }, (_, i) => {
      const born = rnd(i * 3 + 1) * 0.5, life = clamp01((k - born) / (1 - born));
      if (life <= 0) return null;
      const ang = rnd(i * 5 + 2) * Math.PI * 2, rad = 30 + life * (120 + rnd(i + 7) * 260);
      const s = 140 + life * (220 + rnd(i + 11) * 260), x = 960 + Math.cos(ang) * rad * 1.3, y = 640 - life * (180 + rnd(i + 13) * 330) + Math.sin(ang) * rad * 0.35;
      const o = 0.42 * Math.min(1, life * 2.2) * (1 - 0.45 * life);
      return <div key={i} style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: "50%", background: `radial-gradient(circle, rgba(206,214,104,${o}) 0%, rgba(206,214,104,${o * 0.5}) 40%, rgba(206,214,104,0) 70%)` }} />;
    })}
  </AbsoluteFill>
);

export const ClMixCloud3D: React.FC<{ a?: string; b?: string; kindA?: Kind; kindB?: Kind; mode?: "gas" | "cancel"; verdict?: string; bed?: string }> = ({ a = "Cloro", b = "Vinagre", kindA = "jug", kindB = "spray", mode = "gas", verdict, bed }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T, fps } = useVideoConfig();
  const meetAt = T * 0.38;
  const meet = interpolate(f, [6, meetAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const after = clamp01((f - meetAt) / (T - meetAt - 4));
  const gx = interpolate(meet, [0, 1], [1.55, 0.62]);
  const dist = interpolate(f, [0, T], [10.2, 8.8], { easing: Easing.out(Easing.quad) });
  const orbit = interpolate(f, [0, T], [-0.22, 0.16]);
  const target = new THREE.Vector3(0, 2.05, 0);
  const pos = new THREE.Vector3(Math.sin(orbit) * dist, 3.1, Math.cos(orbit) * dist);
  const gas = mode === "gas";
  const shake = gas && after > 0 && after < 0.25 ? Math.sin(f * 2.1) * 5 * (1 - after * 4) : 0;
  const pl = pop(f, fps, 4);
  const lab = (txt: string, left: boolean) => (
    <div style={{ position: "absolute", [left ? "left" : "right"]: interpolate(meet, [0, 1], [560, 790]), top: height * 0.885, translate: left ? "-50% 0" : "50% 0", opacity: pl, scale: String(0.8 + 0.2 * pl), background: `linear-gradient(160deg, ${CL.brassLight}, ${CL.brass} 50%, #8C6831)`, color: CL.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 2, padding: "4px 22px", borderRadius: 8, boxShadow: `0 10px 22px ${CL.shadow}, inset 0 2px 0 rgba(255,255,255,0.5)`, whiteSpace: "nowrap" }}>{txt.toUpperCase()}</div>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", translate: `${shake}px 0` }}>
      <Bed src={bed} seed={29} dim={0.26} />
      <Contact x={width / 2 - gx * 170} y={height * 0.86} w={250} o={0.45} />
      <Contact x={width / 2 + gx * 170} y={height * 0.86} w={250} o={0.45} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [pos.x, pos.y, pos.z] }} gl={{ antialias: true, alpha: true }}>
        <Cam pos={pos} target={target} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[-2, 7, 3]} intensity={1.4} color="#FFF0D8" />
        <directionalLight position={[4, 2, 4]} intensity={0.45} />
        <Bottle kind={kindA} x={-gx} tilt={-0.05 * meet} rotY={0.4} />
        <Bottle kind={kindB} x={gx} tilt={0.05 * meet} rotY={-0.5} />
        {!gas && after > 0 ? <Fizz k={after} /> : null}
      </ThreeCanvas>
      {gas && after > 0 ? <SoftCloud k={after} /> : null}
      <RoomLight k={0.7} />
      {lab(a, true)}
      {lab(b, false)}
      {verdict ? <Stamp text={verdict} at={Math.round(meetAt + 10)} color={gas ? CL.red : CL.navy} x="50%" y="16%" rot={-5} size={74} /> : null}
    </AbsoluteFill>
  );
};
