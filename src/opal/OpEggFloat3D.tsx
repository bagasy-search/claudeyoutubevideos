// OpEggFloat3D — la prueba del agua en 3D real: un bowl de vidrio con agua fría sobre la mesa de la cocina; caen tres
// huevos uno por uno: el fresco se acuesta en el fondo, el viejo se para de punta, el malo flota. Cada uno con su
// rótulo a lápiz. Props: labels [fresh, older, bad], every (cuadros entre huevos), title.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OP, LABEL, HAND, fontsReady } from "./OpTheme";

const CamLook: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.set(...pos); camera.lookAt(...target); camera.updateProjectionMatrix(); return null;
};
function eggGeo() {
  const pts: any[] = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40, a = t * Math.PI; const r = Math.sin(a) * (0.16 + 0.03 * Math.cos(a)); pts.push(new THREE.Vector2(Math.max(0.0001, r), -Math.cos(a) * 0.22)); }
  return new THREE.LatheGeometry(pts, 48);
}

export const OpEggFloat3D: React.FC<{ labels?: [string, string, string]; every?: number; title?: string }> = ({ labels = ["fresh", "older · use soon", "compost"], every = 40, title = "The water test" }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const [ready, setReady] = useState(false); const [h] = useState(() => delayRender("op egg fonts"));
  useEffect(() => { fontsReady().then(() => { setReady(true); continueRender(h); }); }, [h]);
  const m = useMemo(() => !ready ? null : ({
    egg: eggGeo(),
    shell: new THREE.MeshStandardMaterial({ color: "#e9d2ad", roughness: 0.55 }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#ffffff", transmission: 0.0, transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0, side: THREE.DoubleSide }),
    water: new THREE.MeshStandardMaterial({ color: "#9cc8dc", transparent: true, opacity: 0.38, roughness: 0.1 }),
    surf: new THREE.MeshStandardMaterial({ color: "#cfe8f2", transparent: true, opacity: 0.35, roughness: 0.05 }),
    table: new THREE.MeshStandardMaterial({ color: "#b98c5c", roughness: 0.8 }),
    cloth: new THREE.MeshStandardMaterial({ color: "#d9534a", roughness: 0.9 }),
  }), [ready]);
  const WL = 0.95; // nivel del agua
  const drop = (i: number) => interpolate(f, [12 + i * every, 12 + i * every + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.bounce) });
  const xs = [-0.55, 0, 0.55];
  // destino de cada huevo: acostado en el fondo / parado en el fondo / flotando con la punta afuera
  const target = [{ y: 0.2, rx: Math.PI / 2 }, { y: 0.3, rx: 0.15 }, { y: WL - 0.06, rx: 0.5 }];
  const cam: [number, number, number] = [0, 1.35, interpolate(f, [0, 120], [3.9, 3.5], { extrapolateRight: "clamp" })];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#f4ecd8, #e7d9b8)" }}>
      {m ? (
        <ThreeCanvas width={width} height={height} camera={{ fov: 34, position: cam, near: 0.05, far: 40 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <CamLook pos={cam} target={[0, 0.55, 0]} />
          <hemisphereLight args={["#FFF8EA", "#8a6a44", 1.1]} />
          <directionalLight position={[2, 5, 3]} intensity={1.8} color="#FFF3DC" />
          <directionalLight position={[-3, 2, -1]} intensity={0.5} color="#DCE6FF" />
          <mesh material={m.table} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[10, 6]} /></mesh>
          <mesh material={m.cloth} rotation={[-Math.PI / 2, 0, 0.1]} position={[0, 0.002, 0.2]}><planeGeometry args={[2.6, 1.6]} /></mesh>
          <mesh material={m.glass} position={[0, 0.6, 0]}><cylinderGeometry args={[1.0, 0.85, 1.2, 64, 1, true]} /></mesh>
          <mesh material={m.glass} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.85, 64]} /></mesh>
          <mesh material={m.water} position={[0, WL / 2 + 0.01, 0]}><cylinderGeometry args={[0.97, 0.85, WL, 64]} /></mesh>
          <mesh material={m.surf} position={[0, WL + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.97, 64]} /></mesh>
          {[0, 1, 2].map((i) => {
            const d = drop(i); const tg = target[i];
            const y = interpolate(d, [0, 1], [2.6, tg.y]); const rx = interpolate(d, [0, 1], [0.2, tg.rx]);
            return <mesh key={i} geometry={m.egg} material={m.shell} position={[xs[i], y, 0.05]} rotation={[rx, 0, i === 0 ? 0.3 : 0]} visible={f >= 10 + i * every} />;
          })}
        </ThreeCanvas>
      ) : null}
      <div style={{ position: "absolute", top: 56, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 42, letterSpacing: 9, color: OP.pencil, textTransform: "uppercase" }}>{title}</div>
      {labels.map((l, i) => {
        const o = interpolate(f, [30 + i * every, 38 + i * every], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const col = i === 0 ? OP.green : i === 1 ? "#B7791F" : OP.red;
        return <div key={i} style={{ position: "absolute", left: [470, 960, 1450][i], bottom: 60, transform: "translateX(-50%) rotate(-2deg)", opacity: o, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: col, textAlign: "center", whiteSpace: "nowrap", background: OP.paper, padding: "4px 22px", boxShadow: `0 8px 18px ${OP.shadow}` }}>{l}</div>;
      })}
    </AbsoluteFill>
  );
};
