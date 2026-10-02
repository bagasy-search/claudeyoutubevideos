// LorEgg3D — un huevo duro 3D real (three.js): gira, cae el cuchillo, se abre y muestra clara + yema.
// mode "halve": un huevo (ring=true dibuja el anillo gris-verdoso de la yema recocida).
// mode "compare": dos huevos a la par — el recocido (anillo, yema seca) contra el bueno (yema dorada pareja).
// Todo por useCurrentFrame (sin useFrame). Texturas procedurales con PRNG determinista. Textos por props (inglés).
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LOR, SERIF, HAND } from "./LorTheme";
import { canvasTex, dots, eggProfile, eggR, ease } from "./lor3dutil";

const H = 1.6, A = 0.62;

// mitad del huevo: la cáscara abulta hacia atrás (z<0) y el corte (clara + yema) mira a cámara (z>0)
const EggHalf: React.FC<{ x: number; ring: boolean; shell: string; mats: any; faceGeo: any }> = ({ x, ring, shell, mats, faceGeo }) => {
  const yc = -0.1;
  return (
    <group position={[x, 0, 0]}>
      <mesh geometry={mats.halfGeo} material={mats.shell(shell)} />
      <mesh geometry={faceGeo} position={[0, 0, 0.002]} material={mats.white} />
      {ring ? <mesh position={[0, yc, 0.004]} scale={[0.43, 0.39, 1]} material={mats.ring}><circleGeometry args={[1, 40]} /></mesh> : null}
      <mesh position={[0, yc, 0.006]} scale={[ring ? 0.37 : 0.4, ring ? 0.33 : 0.36, 1]} material={ring ? mats.yolkDry : mats.yolk}><circleGeometry args={[1, 40]} /></mesh>
    </group>
  );
};

const Egg: React.FC<{ frame: number; fps: number; cutAt: number; ring: boolean; shell: string; x0: number; mats: any; faceGeo: any; spin: number }> = ({ frame, fps, cutAt, ring, shell, x0, mats, faceGeo, spin }) => {
  const intro = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const knifeY = interpolate(frame, [cutAt - 14, cutAt], [2.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const open = ease(interpolate(frame, [cutAt + 2, cutAt + 2 + 0.9 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const whole = frame < cutAt + 2;
  const turn = whole ? (frame / fps) * spin * 0.7 : 0;
  const knifeOp = interpolate(frame, [cutAt, cutAt + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <group position={[x0, 0.8, 0]} scale={Math.max(0.001, intro)}>
      {whole ? (
        <group rotation={[0, turn, 0]}><mesh geometry={mats.fullGeo} material={mats.shell(shell)} /></group>
      ) : (
        <>
          <EggHalf x={-0.1 - 0.62 * open} ring={ring} shell={shell} mats={mats} faceGeo={faceGeo} />
          <EggHalf x={0.1 + 0.62 * open} ring={ring} shell={shell} mats={mats} faceGeo={faceGeo} />
        </>
      )}
      <mesh position={[0, knifeY + 0.2, 0.2]} visible={knifeOp > 0.02}>
        <boxGeometry args={[0.02, 2.2, 1.5]} />
        <meshStandardMaterial color="#D8DDE2" metalness={0.8} roughness={0.25} transparent opacity={knifeOp} />
      </mesh>
    </group>
  );
};

export const LorEgg3D: React.FC<{ mode?: "halve" | "compare"; ring?: boolean; shell?: "white" | "brown"; cutAt?: number; spin?: number; labelA?: string; labelB?: string; title?: string; sub?: string; bg?: "gingham" | "paper" }> = ({ mode = "halve", ring = false, shell = "white", cutAt = 40, spin = 0.9, labelA, labelB, title, sub, bg = "gingham" }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const shellCol = shell === "brown" ? "#C99A62" : "#F5EFE0";
  const mats = useMemo(() => {
    const prof = eggProfile(48, A, H);
    const tex = canvasTex((c, S) => { c.fillStyle = "#FFFBF0"; c.fillRect(0, 0, S, S); dots(c, S, 3, 260, "#EADFC4", 1, 3, 0.5); }, 256, 1);
    const yolkTex = canvasTex((c, S) => { const g = c.createRadialGradient(S * 0.42, S * 0.4, S * 0.05, S / 2, S / 2, S * 0.55); g.addColorStop(0, "#FFD35A"); g.addColorStop(0.7, "#F0A91E"); g.addColorStop(1, "#D98A12"); c.fillStyle = g; c.fillRect(0, 0, S, S); dots(c, S, 8, 120, "#FFE08A", 1, 3, 0.5); }, 256, 1);
    const dryTex = canvasTex((c, S) => { c.fillStyle = "#EBCB6A"; c.fillRect(0, 0, S, S); dots(c, S, 12, 700, "#D9B24C", 1, 4, 0.7); dots(c, S, 22, 500, "#F6E3A0", 1, 3, 0.7); }, 256, 1);
    return {
      halfGeo: new THREE.LatheGeometry(prof, 48, Math.PI / 2, Math.PI),
      fullGeo: new THREE.LatheGeometry(prof, 48, 0, Math.PI * 2),
      shell: (col: string) => new THREE.MeshStandardMaterial({ color: col, roughness: 0.55, side: THREE.DoubleSide }),
      white: new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, side: THREE.DoubleSide }),
      yolk: new THREE.MeshStandardMaterial({ map: yolkTex, roughness: 0.45, side: THREE.DoubleSide }),
      yolkDry: new THREE.MeshStandardMaterial({ map: dryTex, roughness: 0.95, side: THREE.DoubleSide }),
      ring: new THREE.MeshStandardMaterial({ color: "#8A9A5E", roughness: 0.9, side: THREE.DoubleSide }),
      table: new THREE.MeshStandardMaterial({ map: canvasTex((c, S) => {
        if (bg === "paper") { c.fillStyle = LOR.paper; c.fillRect(0, 0, S, S); dots(c, S, 5, 900, "#C9B48A", 1, 3, 0.2); }
        else { c.fillStyle = "#FFFDF7"; c.fillRect(0, 0, S, S); c.fillStyle = "rgba(200,50,58,0.5)"; const q = S / 8; for (let k = 0; k < 8; k += 2) { c.fillRect(k * q, 0, q, S); c.fillRect(0, k * q, S, q); } dots(c, S, 5, 700, "#FFFFFF", 1, 2, 0.25); }
      }, 512, bg === "gingham" ? 5 : 2), roughness: 0.9 }),
    };
  }, [bg]);
  // cara del corte: contorno del huevo (mitad derecha + espejo) en el plano XY
  const faceGeo = useMemo(() => {
    const sh = new THREE.Shape(); const n = 48;
    for (let i = 0; i <= n; i++) { const t = i / n; const x = eggR(t, A), y = H * (0.5 - t); i === 0 ? sh.moveTo(x, y) : sh.lineTo(x, y); }
    for (let i = n; i >= 0; i--) { const t = i / n; sh.lineTo(-eggR(t, A), H * (0.5 - t)); }
    return new THREE.ShapeGeometry(sh);
  }, []);

  const dist = interpolate(frame, [0, durationInFrames], [6.8, 5.8], { extrapolateRight: "clamp" });
  const camPos: [number, number, number] = [0.3, 1.9, dist];
  const titleIn = interpolate(frame, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const labIn = interpolate(frame, [cutAt + 30, cutAt + 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eggs = mode === "compare"
    ? [{ x0: -1.7, ring: true }, { x0: 1.7, ring: false }]
    : [{ x0: 0, ring }];
  return (
    <AbsoluteFill style={{ backgroundColor: "#EFE3C8" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: camPos, near: 0.1, far: 50 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <Cam pos={camPos} target={[0, 0.9, 0]} />
        <color attach="background" args={["#EFE3C8"]} />
        <hemisphereLight args={["#FFF6E0", "#B98A5A", 0.95]} />
        <directionalLight position={[3, 5, 4]} intensity={2.0} color="#FFF1D6" />
        <directionalLight position={[-4, 2.5, 2]} intensity={0.6} color="#DDE8FF" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={mats.table}><planeGeometry args={[16, 16]} /></mesh>
        {eggs.map((e, i) => (
          <Egg key={i} frame={frame} fps={fps} cutAt={cutAt + i * 4} ring={e.ring} shell={shellCol} x0={e.x0} mats={mats} faceGeo={faceGeo} spin={spin} />
        ))}
      </ThreeCanvas>
      {title ? (
        <div style={{ position: "absolute", left: 90, top: 70, opacity: titleIn, translate: `${(1 - titleIn) * -30}px 0px` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: LOR.ink, lineHeight: 1, letterSpacing: -1, textShadow: "0 2px 0 rgba(255,255,255,0.6)" }}>{title}</div>
          {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: LOR.gingham, marginTop: 8 }}>{sub}</div> : null}
        </div>
      ) : null}
      {mode === "compare" ? (
        <>
          {labelA ? <div style={{ position: "absolute", left: "13%", bottom: 70, opacity: labIn, fontFamily: HAND, fontWeight: 700, fontSize: 62, color: LOR.gingham, textAlign: "center", width: "26%", lineHeight: 1 }}>{labelA}</div> : null}
          {labelB ? <div style={{ position: "absolute", left: "61%", bottom: 70, opacity: labIn, fontFamily: HAND, fontWeight: 700, fontSize: 62, color: LOR.greenDeep, textAlign: "center", width: "26%", lineHeight: 1 }}>{labelB}</div> : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const Cam: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree();
  camera.position.set(pos[0], pos[1], pos[2]); camera.lookAt(target[0], target[1], target[2]); camera.updateProjectionMatrix();
  return null;
};
