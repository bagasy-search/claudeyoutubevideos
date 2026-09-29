// PrincipalDoor3D — pasillo de escuela de 1956 en 3D (three.js, se PRE-RENDERIZA con GPU): lockers a los dos lados,
// piso encerado con reflejos (escena espejada bajo un piso semitransparente), luz de ventanas y plafones.
// Al fondo, la puerta con vidrio esmerilado "PRINCIPAL"; la cámara avanza y ATRAVIESA el vidrio: el esmerilado llena
// el cuadro y se aclara hasta revelar el metraje siguiente (`next`), que entra desenfocado y se hace nítido.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SERIF, SANS, TYPE, YC, clamp, ease, rnd } from "./theme";
import { Media } from "./Media";

const canvas = (w: number, h: number) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
const T = (c: HTMLCanvasElement, rep?: [number, number]) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t; };
const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3; fov: number }> = ({ pos, look, fov }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(look);
  const c = camera as THREE.PerspectiveCamera; if (c.fov !== fov) { c.fov = fov; c.updateProjectionMatrix(); } return null;
};
let _glow: THREE.Texture | null = null;
const glow = () => { if (_glow) return _glow; const c = canvas(64, 64); const g = c.getContext("2d")!; const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,244,220,1)"); gr.addColorStop(1, "rgba(255,230,180,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); _glow = new THREE.CanvasTexture(c); return _glow; };

const LEN = 14; // largo del pasillo
const HW = 1.6; // medio ancho

const Hall: React.FC<{ tex: Record<string, THREE.Texture>; f: number }> = ({ tex, f }) => (
  <group>
    {/* lockers: bloques de 3 puertas con ventilación, a los dos lados */}
    {[-1, 1].map((side) =>
      Array.from({ length: 20 }, (_, i) => (
        <mesh key={side + "_" + i} position={[side * (HW - 0.2), 0.95, 1 - i * 0.62]} rotation={[0, -side * Math.PI / 2, 0]}>
          <planeGeometry args={[0.6, 1.8]} /><meshStandardMaterial map={tex.locker} roughness={0.45} metalness={0.35} />
        </mesh>
      ))
    )}
    {[-1, 1].map((side) => (
      <mesh key={"top" + side} position={[side * (HW - 0.1), 1.9, 1 - LEN / 2 + 0.3]}><boxGeometry args={[0.4, 0.06, LEN]} /><meshStandardMaterial color="#5E6B52" roughness={0.6} /></mesh>
    ))}
    {/* paredes sobre los lockers, zócalo y cielorraso */}
    {[-1, 1].map((side) => (
      <mesh key={"w" + side} position={[side * HW, 2.5, 1 - LEN / 2]} rotation={[0, -side * Math.PI / 2, 0]}><planeGeometry args={[LEN + 2, 1.4]} /><meshStandardMaterial color="#E9DFC6" roughness={0.9} /></mesh>
    ))}
    <mesh position={[0, 3.2, 1 - LEN / 2]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[HW * 2, LEN + 2]} /><meshStandardMaterial map={tex.ceil} roughness={1} /></mesh>
    {/* ventanas altas a la izquierda (transoms) con luz */}
    {Array.from({ length: 6 }, (_, i) => (
      <mesh key={"win" + i} position={[-HW + 0.01, 2.55, 0.2 - i * 2.2]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[1.2, 0.8]} /><meshBasicMaterial color="#FFEBC2" toneMapped={false} /></mesh>
    ))}
    {/* plafones */}
    {Array.from({ length: 6 }, (_, i) => (
      <group key={"lamp" + i} position={[0, 3.05, 0.5 - i * 2.3]}>
        <mesh><sphereGeometry args={[0.16, 20, 14]} /><meshBasicMaterial color="#FFF3DA" toneMapped={false} /></mesh>
        <sprite scale={[1.1, 1.1, 1]}><spriteMaterial map={glow()} color="#FFE1B0" transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
      </group>
    ))}
    {/* pared del fondo con la puerta */}
    <mesh position={[0, 1.6, 1 - LEN]}><planeGeometry args={[HW * 2, 3.2]} /><meshStandardMaterial color="#E4D9BF" roughness={0.9} /></mesh>
    <group position={[0, 0, 1 - LEN + 0.02]}>
      <mesh position={[0, 1.1, 0]}><boxGeometry args={[1.06, 2.25, 0.05]} /><meshStandardMaterial color="#4A2C18" roughness={0.45} /></mesh>
      <mesh position={[0, 0.6, 0.03]}><boxGeometry args={[0.9, 1.0, 0.02]} /><meshStandardMaterial map={tex.door} roughness={0.4} /></mesh>
      <mesh position={[0, 1.62, 0.035]}><planeGeometry args={[0.84, 0.95]} /><meshStandardMaterial map={tex.glass} emissive="#FFE8C4" emissiveMap={tex.glass} emissiveIntensity={0.55} roughness={0.2} /></mesh>
      <mesh position={[0.36, 1.05, 0.06]}><sphereGeometry args={[0.035, 16, 12]} /><meshStandardMaterial color="#C9A55A" metalness={0.9} roughness={0.2} /></mesh>
      <mesh position={[0, 2.35, 0]}><boxGeometry args={[1.2, 0.08, 0.08]} /><meshStandardMaterial color="#3E2414" /></mesh>
    </group>
    {/* carteleras de corcho con papeles clavados sobre los lockers de la derecha, reloj y bandera junto a la puerta */}
    {Array.from({ length: 3 }, (_, i) => (
      <group key={"bb" + i} position={[HW - 0.02, 2.45, -0.8 - i * 4]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh><planeGeometry args={[1.4, 0.8]} /><meshStandardMaterial color="#9C7248" roughness={1} /></mesh>
        {Array.from({ length: 6 }, (_, k) => (
          <mesh key={k} position={[-0.5 + (k % 3) * 0.5 + (rnd(k + i) - 0.5) * 0.1, k < 3 ? 0.17 : -0.17, 0.005]} rotation={[0, 0, (rnd(k * 3 + i) - 0.5) * 0.2]}>
            <planeGeometry args={[0.3, 0.26]} /><meshStandardMaterial color={["#F3ECD8", "#F2D98A", "#DDE8F0", "#F3ECD8", "#F1C9C9", "#F3ECD8"][k]} roughness={1} />
          </mesh>
        ))}
      </group>
    ))}
    <group position={[0.85, 2.55, 1 - LEN + 0.04]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.17, 0.17, 0.04, 32]} /><meshStandardMaterial color="#1E1E1E" metalness={0.5} /></mesh>
      <mesh position={[0, 0, 0.022]}><circleGeometry args={[0.15, 32]} /><meshStandardMaterial color="#F6F1E4" /></mesh>
      <mesh position={[0, 0.04, 0.03]}><planeGeometry args={[0.012, 0.1]} /><meshBasicMaterial color="#222" /></mesh>
      <mesh position={[0.03, 0, 0.03]} rotation={[0, 0, -1.2]}><planeGeometry args={[0.01, 0.13]} /><meshBasicMaterial color="#222" /></mesh>
    </group>
    {[-1, 1].map((side) => (
      <mesh key={"lw" + side} position={[side * (HW - 0.05), 0.95, 1 - LEN / 2]} rotation={[0, -side * Math.PI / 2, 0]}><planeGeometry args={[LEN + 2, 1.9]} /><meshStandardMaterial color="#D8CCAE" roughness={0.9} /></mesh>
    ))}
    {/* haces de las ventanas */}
    {Array.from({ length: 4 }, (_, i) => (
      <mesh key={"ray" + i} position={[-0.6, 1.6, -0.9 - i * 2.8]} rotation={[0, 0.25, -0.7]}>
        <planeGeometry args={[0.9, 4.5]} /><meshBasicMaterial map={tex.beam} color="#FFD9A0" transparent opacity={0.12 + 0.02 * Math.sin(f / 30 + i)} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    ))}
  </group>
);

export const PrincipalDoor3D: React.FC<{ next?: string; nextStart?: number; label?: string; through?: number }> = ({ next, nextStart, label = "PRINCIPAL", through }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: D } = useVideoConfig();
  const [h] = useState(() => delayRender("fuentes de la puerta"));
  const [ok, setOk] = useState(false);
  useEffect(() => { Promise.all([SERIF, SANS].map((x) => document.fonts.load(`60px "${x}"`))).then(() => document.fonts.ready).then(() => { setOk(true); continueRender(h); }); }, [h]);
  const tex = useMemo(() => {
    if (!ok) return null;
    const lk = canvas(256, 768); const g = lk.getContext("2d")!;
    g.fillStyle = "#6F7F60"; g.fillRect(0, 0, 256, 768);
    for (let d = 0; d < 1; d++) {
      g.strokeStyle = "rgba(0,0,0,0.45)"; g.lineWidth = 4; g.strokeRect(6, 6, 244, 756);
      for (let k = 0; k < 6; k++) { g.fillStyle = "rgba(0,0,0,0.5)"; g.fillRect(70, 60 + k * 18, 116, 7); g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(70, 67 + k * 18, 116, 2); }
      for (let k = 0; k < 6; k++) { g.fillStyle = "rgba(0,0,0,0.5)"; g.fillRect(70, 620 + k * 18, 116, 7); }
      g.fillStyle = "#B8B8AA"; g.fillRect(200, 360, 16, 60); g.fillStyle = "rgba(255,255,255,0.3)"; g.fillRect(202, 362, 4, 56);
      g.fillStyle = "#D9D2BC"; g.fillRect(60, 170, 60, 24); g.fillStyle = "#333"; g.font = "16px monospace"; g.fillText(String(100 + Math.floor(rnd(3) * 300)), 66, 188);
    }
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(0,0,0,${rnd(i) * 0.12})`; g.fillRect(rnd(i + 1) * 256, rnd(i + 2) * 768, 2 + rnd(i) * 6, 1); }
    const cl = canvas(256, 256); const cg = cl.getContext("2d")!; cg.fillStyle = "#EFE8D6"; cg.fillRect(0, 0, 256, 256); cg.strokeStyle = "rgba(0,0,0,0.12)"; for (let k = 0; k < 256; k += 64) { cg.strokeRect(k, 0, 64, 256); cg.strokeRect(0, k, 256, 64); }
    // vidrio esmerilado con letras de oro
    const gl = canvas(512, 580); const gg = gl.getContext("2d")!;
    const gr = gg.createRadialGradient(256, 300, 20, 256, 300, 360); gr.addColorStop(0, "#F4EAD2"); gr.addColorStop(1, "#C9C0AC"); gg.fillStyle = gr; gg.fillRect(0, 0, 512, 580);
    for (let i = 0; i < 9000; i++) { gg.fillStyle = `rgba(255,255,255,${rnd(i) * 0.18})`; gg.fillRect(rnd(i + 1) * 512, rnd(i + 2) * 580, 1.5, 1.5); }
    gg.textAlign = "center"; gg.fillStyle = "#B8862E"; gg.strokeStyle = "#3A2410"; gg.lineWidth = 3;
    gg.font = `400 ${label.length > 10 ? 58 : 84}px "${SERIF}"`; gg.strokeText(label, 256, 250, 470); gg.fillText(label, 256, 250, 470);
    gg.font = `400 30px "${SANS}"`; gg.fillStyle = "#6B4A20"; gg.fillText("KNOCK BEFORE ENTERING", 256, 320);
    const dr = canvas(256, 256); const dg = dr.getContext("2d")!; dg.fillStyle = "#6B4125"; dg.fillRect(0, 0, 256, 256); for (let i = 0; i < 200; i++) { dg.strokeStyle = `rgba(0,0,0,${0.05 + rnd(i) * 0.1})`; dg.beginPath(); const x = rnd(i + 3) * 256; dg.moveTo(x, 0); dg.bezierCurveTo(x + 5, 80, x - 5, 170, x + 3, 256); dg.stroke(); }
    dg.strokeStyle = "rgba(0,0,0,0.35)"; dg.lineWidth = 6; dg.strokeRect(24, 24, 208, 208);
    const bm = canvas(64, 256); const bg = bm.getContext("2d")!;
    const hh = bg.createLinearGradient(0, 0, 64, 0); hh.addColorStop(0, "rgba(255,255,255,0)"); hh.addColorStop(0.5, "rgba(255,255,255,1)"); hh.addColorStop(1, "rgba(255,255,255,0)"); bg.fillStyle = hh; bg.fillRect(0, 0, 64, 256);
    bg.globalCompositeOperation = "destination-in"; const vv = bg.createLinearGradient(0, 0, 0, 256); vv.addColorStop(0, "rgba(0,0,0,0)"); vv.addColorStop(0.3, "rgba(0,0,0,1)"); vv.addColorStop(0.8, "rgba(0,0,0,1)"); vv.addColorStop(1, "rgba(0,0,0,0)"); bg.fillStyle = vv; bg.fillRect(0, 0, 64, 256);
    // piso de baldosas vinílicas (tablero crema/verde) encerado
    const fl = canvas(512, 512); const fg = fl.getContext("2d")!;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { fg.fillStyle = (x + y) % 2 ? "#CFC3A4" : "#5F6E55"; fg.fillRect(x * 64, y * 64, 64, 64); for (let k = 0; k < 18; k++) { fg.fillStyle = `rgba(255,255,255,${rnd(x * 8 + y + k) * 0.08})`; fg.fillRect(x * 64 + rnd(k + x) * 64, y * 64 + rnd(k + y) * 64, 3, 2); } }
    return { locker: T(lk), ceil: T(cl, [2, 8]), glass: T(gl), door: T(dr), beam: new THREE.CanvasTexture(bm), floor: T(fl, [3, 22]) };
  }, [ok, label]);

  // la cámara avanza por el pasillo; el tramo final se acelera hacia el vidrio y lo atraviesa
  const thr = through ?? D - 22;                      // cuadro en que la cámara toca el vidrio
  const zDoor = 1 - LEN + 0.06;
  const p = interpolate(f, [0, thr], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.85, 0.55) });
  const z = interpolate(p, [0, 1], [2.6, zDoor + 0.02]);
  const y = interpolate(p, [0, 1], [1.45, 1.62]);
  const x = Math.sin(f / 26) * 0.03 * (1 - p);
  const pos = new THREE.Vector3(x, y + Math.sin(f / 9) * 0.008 * (1 - p), z);
  const look = new THREE.Vector3(0, 1.62, zDoor - 1);
  const frost = clamp((f - (thr - 8)) / 8);            // el esmerilado llena la pantalla
  const reveal = clamp((f - thr) / Math.max(8, D - thr - 4)); // aparece el metraje siguiente
  const fade = clamp(f / 8);
  return (
    <AbsoluteFill style={{ background: "#120C08", opacity: fade }}>
      {tex ? (
        <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 50, position: [0, 1.45, 2.6], near: 0.02, far: 40 }}>
          <Cam pos={pos} look={look} fov={50 - p * 8} />
          <color attach="background" args={["#1A120C"]} />
          <fog attach="fog" args={["#2A1E14", 8, 20]} />
          <ambientLight intensity={0.45} color="#FFE6C8" />
          <hemisphereLight args={["#FFE9C8", "#3A2A1C", 0.45]} />
          {Array.from({ length: 4 }, (_, i) => <pointLight key={i} position={[0, 2.9, 0.5 - i * 3.3]} intensity={4} color="#FFEBCC" distance={6} />)}
          <pointLight position={[0, 1.7, zDoor + 1.2]} intensity={3} color="#FFD9A8" distance={4} />
          <Hall tex={tex} f={f} />
          {/* reflejo: el pasillo espejado bajo el piso encerado */}
          <group scale={[1, -1, 1]}><Hall tex={tex} f={f} /></group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1 - LEN / 2]}>
            <planeGeometry args={[HW * 2, LEN + 2]} />
            <meshStandardMaterial map={tex.floor} transparent opacity={0.68} roughness={0.12} metalness={0.1} />
          </mesh>
          {Array.from({ length: 50 }, (_, i) => (
            <sprite key={"d" + i} position={[-1.3 + rnd(i) * 2.6, 0.3 + ((rnd(i + 5) * 2.6 + f * 0.002 * (0.4 + rnd(i + 9))) % 2.6), 1.5 - rnd(i + 2) * 13]} scale={[0.014, 0.014, 1]}>
              <spriteMaterial map={glow()} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
            </sprite>
          ))}
        </ThreeCanvas>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)", opacity: 1 - reveal }} />
      {/* el vidrio esmerilado a pantalla completa, y detrás, el plano siguiente que se hace nítido */}
      <AbsoluteFill style={{ opacity: frost, background: "radial-gradient(ellipse at 50% 50%, #F6EEDC, #D3C9B2)" }} />
      {next ? (
        <AbsoluteFill style={{ opacity: reveal, filter: `blur(${(1 - ease(reveal)) * 26}px) brightness(${1.35 - ease(reveal) * 0.35})` }}>
          <Media src={next} start={nextStart} kb="none" zoom={1} durFrames={Math.max(1, D - thr)} />
        </AbsoluteFill>
      ) : null}
      {void TYPE}{void YC}
    </AbsoluteFill>
  );
};
