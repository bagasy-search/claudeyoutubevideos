// OlcPanRescue3D — la sartén oxidada del mercado de pulgas que vuelve a la vida, en 3D real (three.js por useCurrentFrame):
// óxido naranja → cepillo y vinagre (el óxido se va por manchones) → hierro pelado gris → capas finas → negro espejo.
// props: teaser (3 s: rust→black en un vistazo) · rustEnd/scrubEnd/grayEnd (s) en modo completo (default: proporcional a la duración).
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { CamRig, canvasTex, smooth } from "./OleDutchOven3D";
import { OLE, SERIF, HAND, rnd } from "./OleTheme";
import { ramp, useT, useIO, Kicker } from "./OlcKit";

const panProfile = () => {
  const p: THREE.Vector2[] = [];
  const add = (x: number, y: number) => p.push(new THREE.Vector2(x, y));
  add(0, 0); add(1.05, 0); add(1.22, 0.03); add(1.42, 0.3); add(1.48, 0.36); add(1.42, 0.375); add(1.36, 0.34); add(1.18, 0.1); add(1.0, 0.075); add(0.0, 0.075);
  return p;
};
/** manchones de óxido: cada uno tiene un umbral; los que están por debajo del avance del cepillo desaparecen */
const rustTex = (scrub: number) => canvasTex((c, W, H) => {
  c.clearRect(0, 0, W, H);
  for (let i = 0; i < 420; i++) {
    const thr = rnd(i * 7 + 1);
    if (thr < scrub) continue;
    const x = rnd(i * 3 + 11) * W, y = rnd(i * 5 + 13) * H, r = 14 + rnd(i * 11 + 5) * 46;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    const hue = 11 + rnd(i * 13) * 14, l = 20 + rnd(i * 17) * 17;
    g.addColorStop(0, `hsla(${hue}, 62%, ${l}%, 0.97)`); g.addColorStop(0.7, `hsla(${hue}, 58%, ${l - 6}%, 0.85)`); g.addColorStop(1, `hsla(${hue}, 60%, ${l - 10}%, 0)`);
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill();
  }
}, 512, 512);
const woodTex = () => canvasTex((c, W, H) => {
  c.fillStyle = "#A87B4B"; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 9; i++) { c.fillStyle = `hsl(28, ${36 + rnd(i) * 10}%, ${34 + rnd(i + 3) * 12}%)`; c.fillRect(0, (i * H) / 9, W, H / 9 - 3); c.fillStyle = "rgba(40,22,10,0.5)"; c.fillRect(0, (i * H) / 9 - 1, W, 3); }
  for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(60,35,15,${0.05 + rnd(i + 40) * 0.08})`; c.fillRect(rnd(i + 5) * W, rnd(i + 8) * H, 40 + rnd(i) * 120, 2); }
}, 1024, 1024);

export const OlcPanRescue3D: React.FC<{ teaser?: boolean; startGray?: boolean; tScrub?: number; tGray?: number; tBlack?: number }> = ({ teaser = false, startGray = false, tScrub, tGray, tBlack }) => {
  const { t, dur } = useT(); const io = useIO(teaser ? 0.15 : 0.4, teaser ? 0.15 : 0.3);
  const T0 = tScrub ?? (teaser ? 0.35 : dur * 0.14), T1 = tGray ?? (teaser ? 1.25 : dur * 0.52), T2 = tBlack ?? (teaser ? 1.75 : dur * 0.78);
  const scrub = startGray ? 1 : smooth((t - T0) / Math.max(0.2, T1 - T0));
  const black = smooth((t - T2) / Math.max(0.2, (teaser ? 0.9 : 3)));
  const rustQ = Math.round(scrub * 24) / 24;
  const rt = useMemo(() => rustTex(rustQ), [rustQ]);
  const wood = useMemo(() => woodTex(), []);
  const prof = useMemo(() => panProfile(), []);
  const az = 0.5 + (t / Math.max(dur, 1)) * 1.7, el = 0.86 + Math.sin(t * 0.35) * 0.04;
  const R = teaser ? 4.6 : 5.0;
  const pos: [number, number, number] = [Math.sin(az) * Math.cos(el) * R, Math.sin(el) * R, Math.cos(az) * Math.cos(el) * R];
  const bx = scrub > 0.02 && scrub < 0.98 ? Math.sin(t * 9) * 0.5 : 0, bz = scrub > 0.02 && scrub < 0.98 ? Math.cos(t * 7.3) * 0.45 : 0;
  const brushOn = scrub > 0.02 && scrub < 0.98 ? 1 : 0;
  const stage = startGray ? (black > 0.5 ? { k: "SEASONED", s: "thin coats, hot oven: black glass" } : { k: "BARE IRON", s: "gray and dry: season it before anything else" }) : t < T0 ? { k: "RUST", s: "orange on top, harmless to the pan" } : t < T1 ? { k: "SCRUB", s: "hot water, stiff brush, elbow grease" } : t < T2 ? { k: "BARE IRON", s: "gray and dry, ready to season" } : { k: "SEASONED", s: "thin coats, hot oven: black glass" };
  const sp = 1;
  return (
    <AbsoluteFill style={{ backgroundColor: "#2b2119" }}>
      <AbsoluteFill style={{ opacity: io }}>
        <ThreeCanvas width={1920} height={1080} camera={{ fov: 30, position: pos, near: 0.1, far: 60 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <CamRig pos={pos} target={[0.35, 0.1, 0]} fov={30} />
          <color attach="background" args={["#2b2119"]} />
          <hemisphereLight args={["#FFF3DE", "#6a4b30", 0.9]} />
          <directionalLight position={[-3.5, 5, 3]} intensity={2.1} color="#FFE7C6" />
          <spotLight position={[2.5, 4.5, 2]} intensity={90} angle={0.55} penumbra={0.6} decay={1.6} color="#FFF0D8" />
          <pointLight position={[-2, 1.4, -2.5]} intensity={5} distance={0} decay={1.6} color="#FFB45E" />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}><planeGeometry args={[14, 14]} /><meshStandardMaterial map={wood} roughness={0.85} /></mesh>
          <group rotation={[0, 0.3, 0]}>
            {/* hierro base (gris pelado) */}
            <mesh><latheGeometry args={[prof, 72]} /><meshStandardMaterial color="#77736D" roughness={0.55} metalness={0.75} side={THREE.DoubleSide} /></mesh>
            {/* óxido que se va por manchones */}
            <mesh><latheGeometry args={[prof, 72]} /><meshStandardMaterial map={rt} transparent alphaTest={0.02} roughness={0.95} metalness={0.05} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-2} /></mesh>
            {/* capa negra brillante (sazón) */}
            <mesh><latheGeometry args={[prof, 72]} /><meshPhysicalMaterial color="#08090A" roughness={0.14} metalness={0.4} clearcoat={1} clearcoatRoughness={0.06} transparent opacity={black} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-4} /></mesh>
            {/* mango */}
            <group position={[1.42, 0.3, 0]}>
              <mesh position={[0.6, 0, 0]} rotation={[0, 0, 0.05]}><boxGeometry args={[1.35, 0.13, 0.26]} /><meshStandardMaterial color={black > 0.5 ? "#0a0a0b" : scrub > 0.5 ? "#6d6963" : "#7a3d1a"} roughness={black > 0.5 ? 0.2 : 0.8} metalness={0.5} /></mesh>
              <mesh position={[1.3, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.13, 0.13, 0.13, 20]} /><meshStandardMaterial color={black > 0.5 ? "#0a0a0b" : "#6d6963"} roughness={0.5} metalness={0.6} /></mesh>
            </group>
            {/* cepillo */}
            {brushOn ? (
              <group position={[bx, 0.34, bz]} rotation={[0, Math.sin(t * 5) * 0.35, 0]}>
                <mesh position={[0, 0.08, 0]}><boxGeometry args={[0.62, 0.14, 0.24]} /><meshStandardMaterial color="#B98C5A" roughness={0.7} /></mesh>
                <mesh position={[0, -0.03, 0]}><boxGeometry args={[0.58, 0.1, 0.2]} /><meshStandardMaterial color="#2a2622" roughness={1} /></mesh>
                <mesh position={[0.5, 0.22, 0]} rotation={[0, 0, 0.5]}><boxGeometry args={[0.6, 0.07, 0.1]} /><meshStandardMaterial color="#B98C5A" roughness={0.7} /></mesh>
              </group>
            ) : null}
            {/* polvo de óxido */}
            {brushOn ? Array.from({ length: 16 }).map((_, i) => {
              const life = ((t * 1.6 + rnd(i) * 3) % 1); const a = rnd(i + 20) * 6.283, r = 0.25 + rnd(i + 30) * 1.0;
              return <mesh key={i} position={[Math.cos(a) * r, 0.38 + life * 0.9, Math.sin(a) * r]}><sphereGeometry args={[0.028, 8, 8]} /><meshStandardMaterial color="#B04E1E" transparent opacity={0.9 * (1 - life)} /></mesh>;
            }) : null}
          </group>
        </ThreeCanvas>
        <div style={{ position: "absolute", left: 90, bottom: teaser ? 96 : 84, opacity: Math.min(1, ramp(t, 0, 0.25) * sp), background: OLE.paper, padding: teaser ? "14px 32px 18px" : "22px 40px 26px", borderRadius: 3, boxShadow: "0 18px 40px rgba(0,0,0,0.45)", maxWidth: 1000 }}>
          <Kicker size={teaser ? 22 : 26}>{stage.k}</Kicker>
          {!teaser ? <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 54, color: OLE.forest, marginTop: 10, lineHeight: 1.05 }}>{stage.s}</div> : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
