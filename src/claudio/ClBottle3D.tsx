// ClBottle3D — la botella marrón de agua oxigenada en 3D real (three.js), APOYADA en la mesada real del baño del hotel (cama
// debajo, sombra de contacto, luz cálida del techo), girando despacio. Etiqueta en blanco (sin marca). Del cuello cuelga la
// tarjetita del llavero del hotel con el precio/dato. Reusable:
//   title/sub/tag   rótulos · sprayer rociador de gatillo (default) · bed cama real
//   compare         al lado, una botella TRANSPARENTE al sol que pierde las burbujas ("se cansa") y la marrón que las conserva
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, SERIF, HAND, rnd, clamp01 } from "./ClTheme";
import { Bed, Contact, RoomLight, lin, pop } from "./ClParts";

const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};
function bottleGeo() {
  const p: any[] = [];
  const prof: [number, number][] = [[0, 0], [0.42, 0], [0.47, 0.04], [0.48, 0.12], [0.48, 1.25], [0.46, 1.38], [0.36, 1.58], [0.22, 1.72], [0.17, 1.8], [0.17, 1.98], [0, 1.98]];
  for (const [r, y] of prof) p.push(new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(p, 56);
}
const Bottle: React.FC<{ x: number; rotY: number; clear?: boolean; sprayer?: boolean; flat?: number }> = ({ x, rotY, clear, sprayer = true, flat = 0 }) => {
  const g = useMemo(() => bottleGeo(), []);
  const m = useMemo(() => ({
    body: new THREE.MeshPhysicalMaterial(clear ? { color: "#EAF3F8", roughness: 0.05, transparent: true, opacity: 0.22, clearcoat: 1, depthWrite: false } : { color: "#4A2810", roughness: 0.16, clearcoat: 0.8, transparent: true, opacity: 0.95 }),
    label: new THREE.MeshStandardMaterial({ color: "#FAFAF7", roughness: 0.7, side: THREE.DoubleSide }),
    white: new THREE.MeshStandardMaterial({ color: "#F4F4F2", roughness: 0.4 }),
    liquid: new THREE.MeshStandardMaterial({ color: "#CFE8F7", transparent: true, opacity: 0.35, depthWrite: false }),
    bub: new THREE.MeshStandardMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.85 }),
  }), [clear]);
  return (
    <group position={[x, 0, 0]} rotation={[0, rotY, 0]}>
      <mesh geometry={g} material={m.body} />
      {!clear ? <mesh position={[0, 0.72, 0]} material={m.label}><cylinderGeometry args={[0.487, 0.487, 0.72, 48, 1, true]} /></mesh> : null}
      {clear ? <mesh position={[0, 0.62, 0]} material={m.liquid}><cylinderGeometry args={[0.44, 0.44, 1.2, 32]} /></mesh> : null}
      {clear ? Array.from({ length: 16 }, (_, i) => (
        <mesh key={i} position={[(rnd(i) - 0.5) * 0.6, 0.15 + rnd(i + 9) * 1.0, (rnd(i + 4) - 0.5) * 0.6]} scale={Math.max(0.001, 1 - flat)} material={m.bub}><sphereGeometry args={[0.03, 8, 6]} /></mesh>
      )) : null}
      {sprayer ? (
        <group position={[0, 1.98, 0]}>
          <mesh position={[0, 0.1, 0]} material={m.white}><cylinderGeometry args={[0.2, 0.2, 0.2, 24]} /></mesh>
          <mesh position={[0.05, 0.36, 0]} material={m.white}><boxGeometry args={[0.36, 0.32, 0.26]} /></mesh>
          <mesh position={[0.36, 0.42, 0]} rotation={[0, 0, Math.PI / 2]} material={m.white}><cylinderGeometry args={[0.07, 0.09, 0.32, 16]} /></mesh>
          <mesh position={[0.2, 0.12, 0]} rotation={[0, 0, 0.35]} material={m.white}><boxGeometry args={[0.07, 0.34, 0.16]} /></mesh>
        </group>
      ) : <mesh position={[0, 2.08, 0]} material={m.white}><cylinderGeometry args={[0.2, 0.2, 0.2, 24]} /></mesh>}
    </group>
  );
};

export const ClBottle3D: React.FC<{ title?: string; sub?: string; tag?: string; sprayer?: boolean; compare?: { clear: string; brown: string }; bed?: string }> = ({ title = "Agua oxigenada 3 %", sub = "la común de la farmacia", tag, sprayer = true, compare, bed }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames, fps } = useVideoConfig();
  const T = durationInFrames;
  const rot = interpolate(f, [0, T], [-0.5, 0.55]);
  const dist = interpolate(f, [0, T], [5.6, 4.6], { easing: Easing.out(Easing.quad) });
  const target = new THREE.Vector3(compare ? 0 : 0.75, 1.05, 0);
  const pos = new THREE.Vector3(Math.sin(-0.18) * dist + target.x, 1.9, Math.cos(-0.18) * dist);
  const sun = compare ? clamp01(f / (T * 0.7)) : 0;
  const p1 = pop(f, fps, 8), p2 = lin(f, 18, 34), pt = pop(f, fps, 22, 9);
  const swing = Math.sin(f * 0.12) * 6 * Math.exp(-f / 60);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={13} dim={0.3} />
      {/* mesada (mármol claro) donde se apoya, en perspectiva */}
      <div style={{ position: "absolute", left: -100, right: -100, bottom: -40, height: 360, background: "linear-gradient(#F1EEE8, #D9D3C9)", borderTop: "6px solid #FBFAF7", transform: "perspective(900px) rotateX(38deg)", transformOrigin: "50% 0%", boxShadow: "0 -10px 30px rgba(0,0,0,0.12)" }} />
      {compare ? <AbsoluteFill style={{ background: `linear-gradient(115deg, rgba(255,236,170,${0.55 * sun}) 0%, rgba(255,236,170,${0.35 * sun}) 30%, rgba(255,236,170,0) 52%)` }} /> : null}
      {compare ? <><Contact x={width * 0.38} y={height * 0.86} w={340} /><Contact x={width * 0.62} y={height * 0.86} w={340} /></> : <Contact x={width * 0.62} y={height * 0.86} w={360} o={0.42} />}
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [pos.x, pos.y, pos.z] }} gl={{ antialias: true, alpha: true }}>
        <Cam pos={pos} target={new THREE.Vector3(compare ? 0 : 0, 1.05, 0)} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[-2, 7, 3]} intensity={1.4 + sun} color="#FFF0D8" />
        <directionalLight position={[4, 2, 4]} intensity={0.4} />
        {compare ? (
          <>
            <Bottle x={-0.85} rotY={rot} clear sprayer={false} flat={sun} />
            <Bottle x={0.85} rotY={-rot} sprayer={false} />
          </>
        ) : <Bottle x={0.9} rotY={rot} sprayer={sprayer} />}
      </ThreeCanvas>
      <RoomLight k={0.6} />
      {compare ? (
        <>
          <div style={{ position: "absolute", left: "38%", top: 140, translate: "-50% 0", opacity: lin(f, T * 0.45, T * 0.55), background: CL.red, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 50, padding: "8px 26px", borderRadius: 10 }}>{compare.clear}</div>
          <div style={{ position: "absolute", left: "62%", top: 140, translate: "-50% 0", opacity: lin(f, T * 0.6, T * 0.7), background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 50, padding: "8px 26px", borderRadius: 10, borderBottom: `5px solid ${CL.yellow}` }}>{compare.brown}</div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", left: 140, top: 230, opacity: p1, translate: `${(1 - p1) * -60}px 0` }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: CL.ink, lineHeight: 1.02, maxWidth: 700, textShadow: "0 2px 0 rgba(255,255,255,0.7)" }}>{title}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CL.navy, marginTop: 14, clipPath: `inset(0 ${100 - p2 * 100}% 0 0)` }}>{sub}</div>
          </div>
          {tag ? (
            <div style={{ position: "absolute", left: width * 0.62 + 120, top: height * 0.3, transformOrigin: "0% 0%", rotate: `${-14 + swing}deg`, scale: String(pt), opacity: Math.min(1, pt * 1.5) }}>
              <div style={{ width: 4, height: 70, background: "#8C6831", marginLeft: 20 }} />
              <div style={{ background: CL.yellow, color: CL.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 64, padding: "8px 30px 8px 46px", borderRadius: "10px 18px 18px 10px", boxShadow: `0 14px 28px ${CL.shadow}`, position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", translate: "0 -50%", width: 16, height: 16, borderRadius: "50%", background: CL.white, boxShadow: "inset 0 2px 3px rgba(0,0,0,0.3)" }} />
                {tag}
              </div>
            </div>
          ) : null}
        </>
      )}
    </AbsoluteFill>
  );
};
