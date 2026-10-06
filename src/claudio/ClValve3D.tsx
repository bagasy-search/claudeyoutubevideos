// ClValve3D — la LLAVE DE PASO de atrás del inodoro en 3D (three.js), apoyada en la pared de azulejos del baño del hotel (cama real):
// roseta, caño que sale de la pared, cuerpo cromado, manija ovalada y la manguera que sube al tanque. La manija gira a la derecha
// "hasta que pare" (flecha curva proyectada desde el eje real) y un recuadro con la taza vista desde arriba muestra el agua que baja
// al descargar. Props: label (texto de la flecha), turns (vueltas, default 1,25), drain (muestra la taza vaciándose), bed.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, HAND, clamp01, ease } from "./ClTheme";
import { Bed, Contact, RoomLight, lin } from "./ClParts";

const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};

export const ClValve3D: React.FC<{ label?: string; turns?: number; drain?: boolean; bed?: string }> = ({ label = "A la derecha, hasta que pare", turns = 1.25, drain = true, bed }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: T } = useVideoConfig();
  const tTurn = clamp01((f - 14) / Math.max(1, T * 0.45));
  const ang = -2 * Math.PI * turns * ease(tTurn) + (tTurn >= 1 ? 0.03 * Math.sin((f - T * 0.45 - 14) * 0.9) * Math.exp(-(f - T * 0.45 - 14) * 0.15) : 0); // tope: pequeño rebote
  const stopped = tTurn >= 1;
  const a = interpolate(f, [0, T], [-0.32, 0.12], { easing: Easing.inOut(Easing.cubic) });
  const dist = interpolate(f, [0, T], [3.4, 2.75]);
  const target = new THREE.Vector3(0.1, 0.05, 0.25);
  const camPos = new THREE.Vector3(target.x + Math.sin(a) * dist, 0.55, target.z + Math.cos(a) * dist);
  const mats = useMemo(() => ({
    chrome: new THREE.MeshStandardMaterial({ color: "#DCE1E7", metalness: 0.75, roughness: 0.18 }),
    chromeDark: new THREE.MeshStandardMaterial({ color: "#A9B0B9", metalness: 0.7, roughness: 0.28 }),
    hose: new THREE.MeshStandardMaterial({ color: "#C9CDD2", metalness: 0.55, roughness: 0.42 }),
    wall: new THREE.MeshStandardMaterial({ color: "#EFE8DC", roughness: 0.55, transparent: true, opacity: 0.0 }),
  }), []);
  const hoseGeo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.0, 0.18, 0.62), new THREE.Vector3(0.0, 0.55, 0.66), new THREE.Vector3(0.05, 1.1, 0.55), new THREE.Vector3(0.12, 1.9, 0.45)]), 40, 0.045, 12, false), []);
  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(30, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const hub = proj(new THREE.Vector3(0, 0, 0.98));
  const base = proj(new THREE.Vector3(0, -0.5, 0.3));
  // flecha curva alrededor de la manija (sentido horario en pantalla)
  const ak = lin(f, 6, 18), R = 150;
  const sweep = Math.PI * 1.45 * clamp01(ease(tTurn) * 1.1);
  const a0 = -Math.PI * 0.85, a1 = a0 + Math.max(0.05, sweep);
  const arc = `M ${hub.x + R * Math.cos(a0)} ${hub.y + R * Math.sin(a0)} A ${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${hub.x + R * Math.cos(a1)} ${hub.y + R * Math.sin(a1)}`;
  const tip = { x: hub.x + R * Math.cos(a1), y: hub.y + R * Math.sin(a1) }, tg = a1 + Math.PI / 2;
  // la taza vista desde arriba: el agua baja después del tope (tire la cadena)
  const dk = drain ? clamp01((f - T * 0.62) / Math.max(1, T * 0.28)) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={21} dim={0.3} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 50%, rgba(255,252,246,0.55), rgba(255,252,246,0) 62%)" }} />
      <Contact x={base.x} y={base.y} w={520} o={0.22} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
        <Cam pos={camPos} target={target} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[-2, 4, 5]} intensity={1.3} color="#FFF1DA" />
        <directionalLight position={[3, 1, 2]} intensity={0.55} />
        <pointLight position={[0.6, 0.8, 1.8]} intensity={0.6} />
        {/* roseta en la pared */}
        <mesh material={mats.chrome} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}><cylinderGeometry args={[0.32, 0.36, 0.06, 40]} /></mesh>
        {/* caño que sale de la pared */}
        <mesh material={mats.chromeDark} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.22]}><cylinderGeometry args={[0.09, 0.09, 0.4, 24]} /></mesh>
        {/* cuerpo de la llave (escuadra) */}
        <mesh material={mats.chrome} position={[0, 0, 0.55]}><sphereGeometry args={[0.2, 32, 24]} /></mesh>
        <mesh material={mats.chrome} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.42]}><cylinderGeometry args={[0.15, 0.17, 0.2, 32]} /></mesh>
        <mesh material={mats.chrome} position={[0, 0.2, 0.6]}><cylinderGeometry args={[0.1, 0.13, 0.2, 24]} /></mesh>
        {/* vástago + manija ovalada que gira */}
        <mesh material={mats.chromeDark} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.8]}><cylinderGeometry args={[0.05, 0.05, 0.3, 16]} /></mesh>
        <group position={[0, 0, 0.98]} rotation={[0, 0, ang]}>
          <mesh material={mats.chrome} scale={[1, 0.42, 0.32]}><sphereGeometry args={[0.36, 32, 20]} /></mesh>
          <mesh material={mats.chromeDark} position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.04, 20]} /></mesh>
          <mesh material={mats.chromeDark} position={[0.25, 0, 0.09]}><boxGeometry args={[0.12, 0.03, 0.02]} /></mesh>
        </group>
        {/* manguera al tanque */}
        <mesh geometry={hoseGeo} material={mats.hose} />
      </ThreeCanvas>
      <RoomLight k={0.6} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: ak }}>
        <path d={arc} fill="none" stroke={stopped ? CL.navy : CL.yellow} strokeWidth={16} strokeLinecap="round" />
        <path d={arc} fill="none" stroke={CL.ink} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 22" opacity={0.35} />
        <polygon points={`${tip.x + 34 * Math.cos(tg)},${tip.y + 34 * Math.sin(tg)} ${tip.x + 24 * Math.cos(tg + 2.3)},${tip.y + 24 * Math.sin(tg + 2.3)} ${tip.x + 24 * Math.cos(tg - 2.3)},${tip.y + 24 * Math.sin(tg - 2.3)}`} fill={stopped ? CL.navy : CL.yellow} stroke={CL.ink} strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", left: hub.x + 210, top: hub.y - 120, opacity: lin(f, 10, 22), translate: `${(1 - lin(f, 10, 22)) * 40}px 0`, background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 46, letterSpacing: 2, padding: "10px 26px", borderRadius: 12, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 14px 30px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{label}</div>
      {stopped ? <div style={{ position: "absolute", left: hub.x + 210, top: hub.y - 30, opacity: lin(f, T * 0.45 + 16, T * 0.45 + 26), fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CL.navy }}>¡tope!</div> : null}
      {drain ? (
        <div style={{ position: "absolute", left: 120, bottom: 110, opacity: lin(f, T * 0.55, T * 0.62), translate: `0 ${(1 - lin(f, T * 0.55, T * 0.62)) * 40}px`, background: CL.white, borderRadius: 20, padding: 22, boxShadow: `0 20px 44px ${CL.shadow}` }}>
          <svg width={330} height={260} viewBox="0 0 330 260">
            <ellipse cx={165} cy={130} rx={150} ry={118} fill="#F4F2EE" stroke="#D9D3C8" strokeWidth={6} />
            <ellipse cx={165} cy={140} rx={112} ry={86} fill="#FFFFFF" stroke="#E2DDD4" strokeWidth={3} />
            <ellipse cx={165} cy={140 + 22 * dk} rx={100 - 62 * dk} ry={74 - 48 * dk} fill="#BFDDF2" opacity={0.85 - 0.35 * dk} />
            <ellipse cx={165} cy={136} rx={104} ry={78} fill="none" stroke="#8A5A2B" strokeWidth={9} opacity={0.75} />
          </svg>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 32, letterSpacing: 2, color: CL.ink, textAlign: "center", textTransform: "uppercase" }}>{dk < 0.5 ? "Tire la cadena" : "El anillo, afuera"}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
