// RhToiletCutaway3D — corte 3D real (three.js) de un inodoro: tanque con su tubo de rebalse, el canal hueco del borde y la fila
// de agujeros. El líquido que se vierte baja por el tubo, recorre el canal y sale por los agujeros; donde llega, la mugre negra
// hace espuma y desaparece. Reusable por el canal con `mode`:
//   "flow"   la media taza por el tubo limpia el canal y los agujeros (default)
//   "dirty"  sólo muestra dónde vive la mugre (canal + agujeros + chorretes), sin líquido
//   "tablet" la pastilla azul en el fondo del tanque: el agua azul pasa rápido y la mugre queda
//   "crust"  costra mineral (anillo blanco áspero) alrededor de los agujeros, con la mugre agarrada
// Rótulos dentro del mundo (proyectados desde los puntos 3D reales): labels.{tube,channel,holes,tank,amount}. "" = sin rótulo.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RH, LABEL, rnd, clamp01, ease } from "./RhTheme";
import { tileBg, lin } from "./RhParts";

type Mode = "flow" | "dirty" | "tablet" | "crust";
type Labels = { tube?: string; channel?: string; holes?: string; tank?: string; amount?: string };
const HOLES = 14, R0 = 1.0, YR = 1.0;                 // radio y altura del canal del borde
const TUBE = new THREE.Vector3(0.38, 0, -1.55);        // eje del tubo de rebalse (x,z)
const TUBE_TOP = 2.32, TUBE_BOT = 1.42;
const holeAng = (i: number) => 0.18 + (i / (HOLES - 1)) * (Math.PI - 0.36); // en la mitad de atrás (z<0)
const ringPt = (t: number, r = R0, y = YR) => new THREE.Vector3(r * Math.cos(t), y, -r * Math.sin(t));

const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};

function bowlGeo() {
  // perfil interior de la taza (r, y): fondo angosto → borde ancho
  const pts: any[] = [];
  for (let i = 0; i <= 28; i++) { const t = i / 28; pts.push(new THREE.Vector2(0.26 + 0.7 * Math.pow(t, 0.75), -0.05 + 0.98 * t)); }
  return new THREE.LatheGeometry(pts, 48, Math.PI / 2, Math.PI);
}
function outerGeo() {
  const pts: any[] = [];
  for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push(new THREE.Vector2(0.55 + 0.6 * Math.pow(t, 0.9), -0.75 + 1.75 * t)); }
  return new THREE.LatheGeometry(pts, 48, Math.PI / 2, Math.PI);
}
// recorrido de cada gota: arriba del tubo → abajo → caño al fondo del canal → por el canal hasta su agujero → baja por la pared
function dropPath(hole: number) {
  const back = Math.PI / 2, th = holeAng(hole);
  const P: any[] = [];
  P.push(new THREE.Vector3(TUBE.x, TUBE_TOP + 0.55, TUBE.z), new THREE.Vector3(TUBE.x, TUBE_TOP, TUBE.z), new THREE.Vector3(TUBE.x, TUBE_BOT, TUBE.z));
  P.push(new THREE.Vector3(0.25, 1.2, -1.25), ringPt(back, R0, YR));
  const n = 10; for (let k = 1; k <= n; k++) P.push(ringPt(back + (th - back) * (k / n)));
  P.push(ringPt(th, 0.93, 0.9));
  for (let k = 1; k <= 4; k++) { const t = k / 4; P.push(ringPt(th, 0.92 - 0.55 * t, 0.88 - 0.85 * t)); }
  return new THREE.CatmullRomCurve3(P, false, "centripetal", 0.3);
}

export const RhToiletCutaway3D: React.FC<{ mode?: Mode; labels?: Labels; orbit?: number; start?: number }> = ({ mode = "flow", labels = {}, orbit = 0.35, start = 12 }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const T = durationInFrames;
  // tiempos: vertido 0-35 %, canal 25-60 %, agujeros y espuma 45-85 %
  const flowing = mode === "flow" || mode === "tablet";
  const u = clamp01((f - start) / Math.max(1, T * 0.72 - start));       // avance global del líquido
  const fizzAt = (i: number) => 0.52 + 0.3 * Math.abs(holeAng(i) - Math.PI / 2) / (Math.PI / 2);  // del centro hacia los lados
  const cleanK = (i: number) => (mode === "flow" ? clamp01((u - fizzAt(i)) / 0.12) : 0);

  // cámara: órbita lenta y empuje (nunca vuelve a cero)
  const a = interpolate(f, [0, T], [-orbit, orbit * 0.6], { easing: Easing.inOut(Easing.cubic) });
  const dist = interpolate(f, [0, T], [6.0, 5.1]);
  const target = new THREE.Vector3(0.05, 1.15, -0.75);
  const camPos = new THREE.Vector3(target.x + Math.sin(a) * dist, 3.1 - 0.25 * (f / T), target.z + Math.cos(a) * dist);

  const geo = useMemo(() => ({
    bowl: bowlGeo(), outer: outerGeo(),
    channel: new THREE.TorusGeometry(R0, 0.11, 18, 64, Math.PI),
    rimTop: new THREE.TorusGeometry(R0 + 0.04, 0.16, 12, 64, Math.PI),
    paths: Array.from({ length: HOLES }, (_, i) => dropPath(i)),
    feed: new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(TUBE.x, TUBE_BOT + 0.02, TUBE.z), new THREE.Vector3(0.25, 1.2, -1.25), ringPt(Math.PI / 2, R0, YR)]), 24, 0.075, 12, false),
  }), []);
  const mats = useMemo(() => ({
    porcelain: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.18, metalness: 0.0, side: THREE.DoubleSide }),
    porcelainOut: new THREE.MeshStandardMaterial({ color: "#F4F2EE", roughness: 0.3, side: THREE.DoubleSide }),
    glass: new THREE.MeshStandardMaterial({ color: "#EAF4FB", roughness: 0.1, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false }),
    tankGlass: new THREE.MeshStandardMaterial({ color: "#F6F8FA", roughness: 0.15, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }),
    water: new THREE.MeshStandardMaterial({ color: mode === "tablet" ? "#3E8FD6" : "#BFDDF2", transparent: true, opacity: mode === "tablet" ? 0.55 : 0.4, roughness: 0.05, depthWrite: false }),
    tube: new THREE.MeshStandardMaterial({ color: "#E8E4DC", roughness: 0.45 }),
    hole: new THREE.MeshStandardMaterial({ color: "#2A2620", roughness: 0.9 }),
    slime: new THREE.MeshStandardMaterial({ color: "#1B1912", roughness: 0.55 }),
    crust: new THREE.MeshStandardMaterial({ color: "#D9D3C4", roughness: 0.95 }),
    drop: new THREE.MeshStandardMaterial({ color: mode === "tablet" ? "#2E7FD0" : "#DDEFFF", roughness: 0.05, transparent: true, opacity: 0.9 }),
    foam: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.6, transparent: true, opacity: 0.95 }),
    tablet: new THREE.MeshStandardMaterial({ color: "#1F6FD1", roughness: 0.6 }),
  }), [mode]);

  // gotas: 6 por agujero, escalonadas
  const drops = [] as { p: any; s: number }[];
  if (flowing) {
    for (let i = 0; i < HOLES; i++) for (let k = 0; k < 6; k++) {
      const d = (k * 0.055 + rnd(i * 13 + k) * 0.04);
      const s = (u - d) / 0.8; if (s <= 0 || s >= 1) continue;
      drops.push({ p: geo.paths[i].getPointAt(Math.min(0.999, ease(s) * 0.6 + s * 0.4)), s });
    }
  }
  // proyección de rótulos (misma cámara que el canvas)
  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(32, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const L: { at: any; text: string; dx: number; dy: number; t0: number; alert?: boolean }[] = [];
  if (labels.tube) L.push({ at: new THREE.Vector3(TUBE.x, TUBE_TOP, TUBE.z), text: labels.tube, dx: 170, dy: -110, t0: 6 });
  if (labels.channel) L.push({ at: ringPt(2.35, R0, YR + 0.05), text: labels.channel, dx: -260, dy: -150, t0: Math.round(T * 0.3) });
  if (labels.holes) L.push({ at: ringPt(0.55, 0.95, 0.9), text: labels.holes, dx: 220, dy: 120, t0: Math.round(T * 0.45) });
  if (labels.tank) L.push({ at: new THREE.Vector3(-0.7, 2.0, -1.55), text: labels.tank, dx: -230, dy: -90, t0: 10, alert: mode === "tablet" });
  const tankWater = 1.95;

  return (
    <AbsoluteFill style={{ ...tileBg(), overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.85), rgba(255,255,255,0) 70%)" }} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true }}>
        <Cam pos={camPos} target={target} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[-4, 6, 4]} intensity={1.25} />
        <directionalLight position={[4, 3, 2]} intensity={0.35} />
        {/* taza y su cáscara exterior (mitad de atrás: el corte mira a la cámara) */}
        <mesh geometry={geo.bowl} material={mats.porcelain} />
        <mesh geometry={geo.outer} material={mats.porcelainOut} />
        {/* canal hueco del borde (vidrio para ver adentro) + labio superior */}
        <mesh geometry={geo.channel} material={mats.glass} rotation={[-Math.PI / 2, 0, 0]} position={[0, YR, 0]} />
        <mesh geometry={geo.rimTop} material={mats.porcelainOut} rotation={[-Math.PI / 2, 0, 0]} position={[0, YR + 0.17, 0]} />
        {/* caño que alimenta el canal desde el tubo de rebalse */}
        <mesh geometry={geo.feed} material={mats.glass} />
        {/* tanque */}
        <mesh position={[0, 1.9, -1.55]} material={mats.tankGlass}><boxGeometry args={[2.3, 1.25, 0.75]} /></mesh>
        <mesh position={[0, (1.3 + tankWater) / 2, -1.55]} material={mats.water}><boxGeometry args={[2.2, tankWater - 1.3, 0.66]} /></mesh>
        <mesh position={[TUBE.x, (TUBE_TOP + TUBE_BOT) / 2, TUBE.z]} material={mats.tube}><cylinderGeometry args={[0.09, 0.09, TUBE_TOP - TUBE_BOT, 20, 1, true]} /></mesh>
        {mode === "tablet" ? <mesh position={[-0.55, 1.36, -1.5]} material={mats.tablet}><cylinderGeometry args={[0.2, 0.2, 0.08, 24]} /></mesh> : null}
        {/* agujeros, mugre (chorretes y dentro del canal), costra mineral, espuma */}
        {Array.from({ length: HOLES }, (_, i) => {
          const th = holeAng(i), h = ringPt(th, 0.95, 0.92), k = cleanK(i);
          const slimeVis = mode === "tablet" ? 1 : 1 - k;
          const foamK = mode === "flow" ? Math.sin(Math.PI * clamp01((u - fizzAt(i) + 0.04) / 0.2)) : 0;
          const len = 0.22 + rnd(i * 7) * 0.32;
          return (
            <group key={i}>
              <mesh position={h} rotation={[0, -th + Math.PI / 2, 0]} material={mats.hole}><cylinderGeometry args={[0.035, 0.035, 0.03, 10]} /></mesh>
              {mode === "crust" ? <mesh position={h} material={mats.crust}><torusGeometry args={[0.055, 0.022, 6, 14]} /></mesh> : null}
              {slimeVis > 0.02 ? (
                <mesh position={ringPt(th, 0.93 - len * 0.25, 0.9 - len * 0.5)} rotation={[0, -th + Math.PI / 2, 0.08 * (rnd(i) - 0.5)]} scale={[1, slimeVis, 1]} material={mats.slime}>
                  <capsuleGeometry args={[0.024, len, 4, 8]} />
                </mesh>
              ) : null}
              {slimeVis > 0.02 ? <mesh position={ringPt(th + 0.05, R0, YR - 0.02)} scale={[slimeVis, slimeVis, slimeVis]} material={mats.slime}><sphereGeometry args={[0.05, 10, 8]} /></mesh> : null}
              {foamK > 0.01 ? Array.from({ length: 7 }, (_, b) => (
                <mesh key={b} position={ringPt(th + (rnd(i * 31 + b) - 0.5) * 0.12, 0.92 - rnd(i * 17 + b) * 0.08, 0.86 - rnd(i * 5 + b) * 0.22)} scale={foamK * (0.6 + rnd(b + i) * 0.7)} material={mats.foam}>
                  <sphereGeometry args={[0.03, 8, 6]} />
                </mesh>
              )) : null}
            </group>
          );
        })}
        {drops.map((d, i) => (<mesh key={"d" + i} position={d.p} material={mats.drop}><sphereGeometry args={[0.038, 8, 6]} /></mesh>))}
        {/* chorro que cae del vaso medidor al tubo (sólo flow) */}
        {mode === "flow" && u > 0.01 && u < 0.32 ? <mesh position={[TUBE.x, TUBE_TOP + 0.4, TUBE.z]} material={mats.drop}><cylinderGeometry args={[0.025, 0.035, 0.75, 10]} /></mesh> : null}
      </ThreeCanvas>
      {/* rótulos en el mundo (con línea al punto real) */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0, l.t0 + 12); if (k <= 0) return null;
          const ex = p.x + l.dx, ey = p.y + l.dy;
          return (<g key={i} opacity={k}>
            <circle cx={p.x} cy={p.y} r={9} fill={l.alert ? RH.red : RH.yellow} stroke={RH.ink} strokeWidth={3} />
            <line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * k} y2={p.y + (ey - p.y) * k} stroke={RH.ink} strokeWidth={4} strokeLinecap="round" />
          </g>); })}
      </svg>
      {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0 + 6, l.t0 + 18); if (k <= 0) return null;
        const room = l.dx < 0 ? p.x + l.dx : width - (p.x + l.dx), est = l.text.length * 24 + 50, flip = room < est;
        return (<div key={i} style={{ position: "absolute", left: flip ? Math.max(20, Math.min(width - est - 20, p.x + l.dx - (l.dx < 0 ? -est : est))) : p.x + l.dx, top: p.y + l.dy, translate: `${!flip && l.dx < 0 ? "-100%" : "0%"} -50%`, opacity: k, scale: String(0.85 + 0.15 * k), background: l.alert ? RH.red : RH.blueDeep, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 2, padding: "8px 22px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${RH.shadow}` }}>{l.text}</div>);
      })}
      {labels.amount ? (
        <div style={{ position: "absolute", left: 110, top: 90, opacity: lin(f, 4, 16), translate: `0 ${(1 - lin(f, 4, 16)) * 30}px`, background: RH.yellow, color: RH.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 64, padding: "10px 30px", borderRadius: 12, boxShadow: `0 14px 30px ${RH.shadow}` }}>{labels.amount}</div>
      ) : null}
    </AbsoluteFill>
  );
};
