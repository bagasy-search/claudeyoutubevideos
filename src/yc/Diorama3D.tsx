// Diorama3D — escena 3D real (three.js): un pueblo norteamericano de los 60 en miniatura, al atardecer.
// Casas con ventanas que se encienden, árboles, calles, faroles con halo, el cine con marquesina de lamparitas,
// niebla cálida para la profundidad y una RUTA luminosa que la bici recorre mientras la cámara vuela detrás.
//   mode "route"        → el gancho: de la casa al cine (2 millas), la cámara baja y termina frente a la marquesina
//   mode "streetlights" → los faroles se prenden uno a uno, en ola, mientras cae la noche (ítem #2)
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SERIF, TYPE, SANS, YC, clamp, ease, easeInOut, rnd } from "./theme";

const BLOCK = 10, ROAD = 2.4, N = 7; // grilla de manzanas
const GRID = N * (BLOCK + ROAD);
const off = -GRID / 2;
const street = (i: number) => off + i * (BLOCK + ROAD) - ROAD / 2; // eje de la calle i (0..N)

type House = { x: number; z: number; w: number; d: number; h: number; rot: number; col: string; roof: string; lit: number };
type Tree = { x: number; z: number; s: number; tone: number };

const HOUSE_COLS = ["#E9DCC0", "#C9D8C5", "#E7C7B0", "#BFD0DD", "#F0E2B8", "#D8C3D6", "#E4E0D6"];
const ROOF_COLS = ["#5B3B2E", "#3F4A55", "#6B4A3A", "#4E3B37", "#2F3B34"];

function buildTown(seed: number) {
  const houses: House[] = [], trees: Tree[] = [];
  for (let bx = 0; bx < N; bx++) for (let bz = 0; bz < N; bz++) {
    const x0 = off + bx * (BLOCK + ROAD), z0 = off + bz * (BLOCK + ROAD);
    if (bx === 5 && bz === 1) continue; // lote del cine
    if (bx === 2 && bz === 3) { // parque
      for (let k = 0; k < 9; k++) trees.push({ x: x0 + 1.5 + rnd(seed + k * 3) * 7, z: z0 + 1.5 + rnd(seed + k * 5) * 7, s: 0.9 + rnd(k) * 0.6, tone: rnd(k + 9) });
      continue;
    }
    // 4 casas por lado del bloque, mirando a la calle
    for (let side = 0; side < 4; side++) for (let k = 0; k < 3; k++) {
      const s = seed + bx * 131 + bz * 17 + side * 7 + k;
      if (rnd(s) < 0.12) continue;
      const w = 1.9 + rnd(s + 1) * 0.8, d = 1.8 + rnd(s + 2) * 0.7, h = 1.1 + rnd(s + 3) * 0.9;
      const t = 1.7 + k * 3.3;
      const inset = 1.5;
      let x = 0, z = 0, rot = 0;
      if (side === 0) { x = x0 + t; z = z0 + inset; rot = 0; }
      if (side === 1) { x = x0 + t; z = z0 + BLOCK - inset; rot = Math.PI; }
      if (side === 2) { x = x0 + inset; z = z0 + t; rot = Math.PI / 2; }
      if (side === 3) { x = x0 + BLOCK - inset; z = z0 + t; rot = -Math.PI / 2; }
      houses.push({ x, z, w, d, h, rot, col: HOUSE_COLS[Math.floor(rnd(s + 4) * HOUSE_COLS.length)], roof: ROOF_COLS[Math.floor(rnd(s + 5) * ROOF_COLS.length)], lit: rnd(s + 6) });
      if (rnd(s + 8) < 0.7 && !(Math.abs(x - (off + 5 * (BLOCK + ROAD) + BLOCK / 2)) < 9 && z > off + 1 * (BLOCK + ROAD) + BLOCK - 4 && z < off + 3 * (BLOCK + ROAD))) trees.push({ x: x + (rnd(s + 9) - 0.5) * 3, z: z + (rnd(s + 10) - 0.5) * 3, s: 0.7 + rnd(s + 11) * 0.7, tone: rnd(s + 12) });
    }
  }
  return { houses, trees };
}

// puntos de la ruta: casa (esquina SO) → por calles → cine (NE)
const HOME = new THREE.Vector3(street(1) + 3, 0, street(6) - 1.4);
const THEATER = new THREE.Vector3(off + 5 * (BLOCK + ROAD) + BLOCK / 2, 0, off + 1 * (BLOCK + ROAD) + BLOCK - 1.2);
const ROUTE = [
  HOME.clone(), new THREE.Vector3(street(1), 0, street(6) - 1.4), new THREE.Vector3(street(1), 0, street(4)),
  new THREE.Vector3(street(3), 0, street(4)), new THREE.Vector3(street(3), 0, street(2)), new THREE.Vector3(street(5), 0, street(2)),
  new THREE.Vector3(THEATER.x - 1.5, 0, street(2)), new THREE.Vector3(THEATER.x, 0, THEATER.z + 1.8),
].map((v) => v.setY(0.12));

function routeCurve() {
  const c = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0; i < ROUTE.length - 1; i++) c.add(new THREE.LineCurve3(ROUTE[i], ROUTE[i + 1]));
  return c;
}

const Cam: React.FC<{ pos: THREE.Vector3; look: THREE.Vector3; fov: number }> = ({ pos, look, fov }) => {
  const { camera } = useThree();
  camera.position.copy(pos); camera.lookAt(look);
  (camera as THREE.PerspectiveCamera).fov = fov; (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  return null;
};

const glowTex = (() => {
  let t: THREE.Texture | null = null;
  return () => {
    if (t) return t;
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d")!; const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,240,200,1)"); gr.addColorStop(0.25, "rgba(255,200,120,0.55)"); gr.addColorStop(1, "rgba(255,160,60,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); t = new THREE.CanvasTexture(c); return t;
  };
})();

const canvasTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const hex = (c: THREE.Color) => "#" + c.getHexString();
const skyTex = (night: number) => canvasTex(16, 512, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 512);
  const top = new THREE.Color().lerpColors(new THREE.Color("#5E7FB8"), new THREE.Color("#0B1024"), night);
  const mid = new THREE.Color().lerpColors(new THREE.Color("#F2B27A"), new THREE.Color("#3A2A4A"), night);
  const hor = new THREE.Color().lerpColors(new THREE.Color("#FFD9A0"), new THREE.Color("#C0643A"), night);
  gr.addColorStop(0, hex(top)); gr.addColorStop(0.55, hex(mid)); gr.addColorStop(0.72, hex(hor)); gr.addColorStop(1, hex(hor));
  g.fillStyle = gr; g.fillRect(0, 0, 16, 512);
});
let _marq: THREE.Texture | null = null, _sign: THREE.Texture | null = null;
const marqTex = () => _marq ?? (_marq = canvasTex(1024, 160, (g) => {
  g.fillStyle = "#FFF6D8"; g.fillRect(0, 0, 1024, 160);
  g.fillStyle = "#1B140E"; g.font = "bold 62px Georgia"; g.textAlign = "center"; g.fillText("SATURDAY MATINEE", 512, 72);
  g.font = "bold 44px Georgia"; g.fillText("CARTOONS \u00b7 SERIAL \u00b7 2 WESTERNS", 512, 132);
}));
const signTex = () => _sign ?? (_sign = canvasTex(128, 640, (g) => {
  g.fillStyle = "#C8102E"; g.fillRect(0, 0, 128, 640); g.fillStyle = "#FFF3C4"; g.font = "bold 96px Georgia"; g.textAlign = "center";
  "RIALTO".split("").forEach((ch, i) => g.fillText(ch, 64, 100 + i * 100));
}));
const CAR_COLS = ["#8FB9C9", "#D9A441", "#B23A3A", "#E8E1CF", "#4C7A5A", "#6A7FA8"];

const Scene: React.FC<{ mode: "route" | "streetlights"; f: number; D: number }> = ({ mode, f, D }) => {
  const town = useMemo(() => buildTown(7), []);
  const curve = useMemo(() => routeCurve(), []);
  const t = clamp(f / D);
  // hora del día: route = atardecer fijo; streetlights = cae la noche
  const night = mode === "route" ? 0.55 : 0.35 + 0.6 * t;
  const sky = new THREE.Color().lerpColors(new THREE.Color("#E9A15E"), new THREE.Color("#1B2440"), night);
  const fogCol = new THREE.Color().lerpColors(new THREE.Color("#D9935A"), new THREE.Color("#141B30"), night);
  const winOn = (h: House) => (mode === "route" ? h.lit < 0.75 : h.lit < t * 1.1);

  // ruta y bici
  const p = mode === "route" ? easeInOut(clamp((f - 30) / (D * 0.72))) : 0;
  const tube = useMemo(() => new THREE.TubeGeometry(curve as any, 400, 0.22, 8, false), [curve]);
  const idxCount = tube.index ? tube.index.count : 0;
  tube.setDrawRange(0, Math.floor(idxCount * p / 6) * 6);
  const bike = curve.getPointAt(Math.min(0.999, Math.max(0.001, p)));

  // faroles en las esquinas
  const lamps: { x: number; z: number; on: number }[] = [];
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
    const x = street(i) + 1.4, z = street(j) + 1.4;
    const dist = Math.hypot(x - HOME.x, z - HOME.z) / GRID;
    const on = mode === "route" ? 1 : clamp((t * 1.6 - dist) * 6);
    lamps.push({ x, z, on });
  }

  return (
    <>
      <color attach="background" args={[sky]} />
      <mesh><sphereGeometry args={[320, 24, 16]} /><meshBasicMaterial map={skyTex(night)} side={THREE.BackSide} fog={false} depthWrite={false} /></mesh>
      <sprite position={[-160, 30 - night * 30, -180]} scale={[90, 90, 1]}><spriteMaterial map={glowTex()} color="#FFC27A" transparent opacity={0.9 - night * 0.6} fog={false} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
      {[0, 1, 2, 3].map((k) => (
        <mesh key={"ray" + k} position={[-30 + k * 22, 18, -20 + k * 10]} rotation={[0, 0.6, -0.9]}>
          <planeGeometry args={[6 + k * 2, 90]} />
          <meshBasicMaterial color="#FFCB8A" transparent opacity={(0.07 + 0.02 * Math.sin(f / 30 + k)) * (1 - night * 0.8)} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <fog attach="fog" args={[fogCol, 28, mode === "route" ? 110 : 130]} />
      <hemisphereLight args={[new THREE.Color("#FFD3A0"), new THREE.Color("#2A3346"), 0.95 - night * 0.55]} />
      <directionalLight position={[-40, 25, 30]} intensity={1.6 - night * 1.2} color="#FFB36B" />
      <ambientLight intensity={0.32} color="#8FA2C8" />
      {/* suelo y calles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}><planeGeometry args={[400, 400]} /><meshLambertMaterial color="#3E5A34" /></mesh>
      {Array.from({ length: N + 1 }, (_, i) => (
        <React.Fragment key={"r" + i}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[street(i), 0.02, 0]}><planeGeometry args={[ROAD, GRID + 20]} /><meshLambertMaterial color="#4A4A4E" /></mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.021, street(i)]}><planeGeometry args={[GRID + 20, ROAD]} /><meshLambertMaterial color="#4A4A4E" /></mesh>
        </React.Fragment>
      ))}
      {Array.from({ length: N * N }, (_, q) => {
        const bx = q % N, bz = Math.floor(q / N);
        const cx = off + bx * (BLOCK + ROAD) + BLOCK / 2, cz = off + bz * (BLOCK + ROAD) + BLOCK / 2;
        return (
          <React.Fragment key={"blk" + q}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.015, cz]}><planeGeometry args={[BLOCK + 0.6, BLOCK + 0.6]} /><meshLambertMaterial color="#9E9A8E" /></mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.02, cz]}><planeGeometry args={[BLOCK - 0.5, BLOCK - 0.5]} /><meshLambertMaterial color={rnd(q * 9) > 0.5 ? "#4E7440" : "#5A8048"} /></mesh>
          </React.Fragment>
        );
      })}
      {Array.from({ length: 40 }, (_, k) => {
        const i = Math.floor(rnd(k * 3 + 1) * (N + 1)), along = off + rnd(k * 3 + 2) * GRID, vert = rnd(k * 3 + 3) > 0.5;
        const x = vert ? street(i) + 0.75 : along, z = vert ? along : street(i) + 0.75;
        if (Math.hypot(x - THEATER.x, z - (THEATER.z + 4)) < 7) return null;
        return (
          <group key={"car" + k} position={[x, 0, z]} rotation={[0, vert ? 0 : Math.PI / 2, 0]}>
            <mesh position={[0, 0.28, 0]}><boxGeometry args={[0.8, 0.36, 1.9]} /><meshLambertMaterial color={CAR_COLS[k % CAR_COLS.length]} /></mesh>
            <mesh position={[0, 0.58, -0.1]}><boxGeometry args={[0.7, 0.28, 0.95]} /><meshLambertMaterial color="#D8E2E8" /></mesh>
          </group>
        );
      })}
      {/* casas */}
      {town.houses.map((h, i) => (
        <group key={"h" + i} position={[h.x, 0, h.z]} rotation={[0, h.rot, 0]}>
          <mesh position={[0, h.h / 2, 0]}><boxGeometry args={[h.w, h.h, h.d]} /><meshLambertMaterial color={h.col} /></mesh>
          <mesh position={[0, h.h + 0.45, 0]} rotation={[0, Math.PI / 4, 0]} scale={[h.w * 0.78, 0.9, h.d * 0.78]}><coneGeometry args={[1, 1, 4]} /><meshLambertMaterial color={h.roof} /></mesh>
          {[-0.45, 0.45].map((wx, k) => (
            <mesh key={k} position={[wx * h.w * 0.8, h.h * 0.5, h.d / 2 + 0.01]}>
              <planeGeometry args={[0.38, 0.34]} />
              <meshBasicMaterial color={winOn(h) ? "#FFD27A" : "#3A3F4A"} toneMapped={false} />
            </mesh>
          ))}
          <mesh position={[0, 0.3, h.d / 2 + 0.01]}><planeGeometry args={[0.3, 0.6]} /><meshBasicMaterial color="#5A3A28" /></mesh>
          {winOn(h) ? <sprite position={[0, h.h * 0.5, h.d / 2 + 0.2]} scale={[h.w * 1.3, 1.1, 1]}><spriteMaterial map={glowTex()} color="#FFB85C" transparent opacity={0.35 + night * 0.4} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite> : null}
        </group>
      ))}
      {/* árboles */}
      {town.trees.map((tr, i) => (
        <group key={"t" + i} position={[tr.x, 0, tr.z]} scale={tr.s}>
          <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.1, 0.14, 1, 6]} /><meshLambertMaterial color="#4B3526" /></mesh>
          <mesh position={[0, 1.5, 0]}><sphereGeometry args={[0.85, 10, 8]} /><meshLambertMaterial color={tr.tone > 0.5 ? "#2F5A2E" : "#46703A"} /></mesh>
          <mesh position={[0.35, 1.9, 0.2]}><sphereGeometry args={[0.55, 10, 8]} /><meshLambertMaterial color={tr.tone > 0.3 ? "#3B6A34" : "#557F40"} /></mesh>
        </group>
      ))}
      {/* el cine */}
      <group position={[THEATER.x, 0, THEATER.z - 3]}>
        <mesh position={[0, 2.4, 0]}><boxGeometry args={[7, 4.8, 5]} /><meshLambertMaterial color="#8A3B2E" /></mesh>
        <mesh position={[0, 2.2, 2.9]}><boxGeometry args={[6.2, 0.9, 1.0]} /><meshBasicMaterial color="#F7E7B5" toneMapped={false} /></mesh>
        <mesh position={[0, 2.2, 3.41]}><planeGeometry args={[6.0, 0.94]} /><meshBasicMaterial map={marqTex()} toneMapped={false} /></mesh>
        <mesh position={[0, 0.9, 2.51]}><planeGeometry args={[2.4, 1.6]} /><meshBasicMaterial color="#FFD58A" toneMapped={false} /></mesh>
        {Array.from({ length: 22 }, (_, i) => {
          const on = (Math.floor(f / 4) + i) % 3 !== 0;
          const x = -3 + (i % 11) * 0.6, y = i < 11 ? 2.72 : 1.68;
          return <mesh key={i} position={[x, y, 3.42]}><sphereGeometry args={[0.07, 6, 6]} /><meshBasicMaterial color={on ? "#FFF3C4" : "#7A5A30"} toneMapped={false} /></mesh>;
        })}
        <mesh position={[3.2, 5.2, 2.6]}><boxGeometry args={[0.35, 3.2, 0.9]} /><meshBasicMaterial color="#E8442F" toneMapped={false} /></mesh>
        <mesh position={[3.39, 5.2, 2.6]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.8, 3.0]} /><meshBasicMaterial map={signTex()} toneMapped={false} /></mesh>
        <sprite position={[0, 2.3, 3.8]} scale={[11, 5, 1]}><spriteMaterial map={glowTex()} color="#FFD58A" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
      </group>
      {/* faroles */}
      {lamps.map((l, i) => (
        <group key={"l" + i} position={[l.x, 0, l.z]}>
          <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.04, 0.05, 1.8, 5]} /><meshLambertMaterial color="#222" /></mesh>
          <mesh position={[0, 1.85, 0]}><sphereGeometry args={[0.12, 8, 8]} /><meshBasicMaterial color={l.on > 0.5 ? "#FFE3A3" : "#555"} toneMapped={false} /></mesh>
          {l.on > 0.02 ? <sprite position={[0, 1.85, 0]} scale={[2.6 * l.on, 2.6 * l.on, 1]}><spriteMaterial map={glowTex()} transparent opacity={0.85 * l.on} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite> : null}
        </group>
      ))}
      {/* ruta luminosa + bici */}
      {mode === "route" ? (
        <>
          <mesh geometry={tube}><meshBasicMaterial color="#F2B705" toneMapped={false} /></mesh>
          <mesh position={[HOME.x, 0.4, HOME.z]}><sphereGeometry args={[0.35, 12, 12]} /><meshBasicMaterial color="#F5F1E6" toneMapped={false} /></mesh>
          <group position={[bike.x, 0.35, bike.z]}>
            <mesh><sphereGeometry args={[0.28, 12, 12]} /><meshBasicMaterial color="#FFF6DC" toneMapped={false} /></mesh>
            <sprite scale={[3.2, 3.2, 1]}><spriteMaterial map={glowTex()} transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
          </group>
        </>
      ) : null}
    </>
  );
};

export const Diorama3D: React.FC<{ mode?: "route" | "streetlights"; title?: string; distance?: string; place?: string }> = ({ mode = "route", title, distance, place }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: D } = useVideoConfig();
  const t = clamp(f / D);
  // cámara
  let pos: THREE.Vector3, look: THREE.Vector3, fov = 38;
  if (mode === "route") {
    const curve = routeCurve();
    const p = easeInOut(clamp((f - 30) / (D * 0.72)));
    const b = curve.getPointAt(Math.min(0.999, Math.max(0.001, p)));
    const ahead = curve.getPointAt(Math.min(0.999, p + 0.08));
    const intro = 1 - ease(clamp(f / 60));                 // arranca alto, en plano general del pueblo
    const endT = ease(clamp((f - D * 0.8) / (D * 0.2)));  // al final baja frente a la marquesina
    const chase = new THREE.Vector3(b.x - 9, 9 + intro * 28, b.z + 12 + intro * 20);
    const final = new THREE.Vector3(THEATER.x - 1.2, 3.4, THEATER.z + 9.5);
    pos = chase.lerp(final, endT);
    look = new THREE.Vector3().lerpVectors(ahead, new THREE.Vector3(THEATER.x, 2.4, THEATER.z - 1), Math.max(endT, intro * 0.3));
    fov = 40 - endT * 6;
  } else {
    const a = -0.6 + t * 0.9;
    pos = new THREE.Vector3(Math.cos(a) * 30, 15 - t * 6, Math.sin(a) * 30);
    look = new THREE.Vector3(0, 1, 0);
  }
  const fade = clamp(f / 8) * (1 - clamp((f - (D - 8)) / 8));
  return (
    <AbsoluteFill style={{ opacity: fade, background: "#000" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov, position: [0, 30, 40], near: 0.1, far: 400 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <Cam pos={pos} look={look} fov={fov} />
        <Scene mode={mode} f={f} D={D} />
      </ThreeCanvas>
      {/* grado de película sobre el 3D: viñeta cálida + bruma */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 45%, rgba(10,6,2,0.6) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,180,110,0.10), rgba(0,0,0,0) 40%)", mixBlendMode: "screen" }} />
      {place ? <div style={{ position: "absolute", left: 90, top: 70, fontFamily: SANS, fontSize: 36, letterSpacing: 12, color: YC.bus, opacity: ease((f - 10) / 16) }}>{place}</div> : null}
      {distance ? (
        <div style={{ position: "absolute", right: 90, bottom: 80, textAlign: "right", opacity: ease((f - 40) / 16) }}>
          <div style={{ fontFamily: SERIF, fontSize: 140, color: YC.bus, lineHeight: 1, textShadow: "0 8px 30px rgba(0,0,0,0.8)" }}>
            {(parseFloat(distance) * (mode === "route" ? easeInOut(clamp((f - 30) / (D * 0.72))) : 1)).toFixed(1)}<span style={{ fontSize: 64 }}> MILES</span>
          </div>
          {title ? <div style={{ fontFamily: TYPE, fontSize: 40, color: YC.paper, marginTop: 6, textShadow: "0 3px 14px rgba(0,0,0,0.9)" }}>{title}</div> : null}
        </div>
      ) : title ? <div style={{ position: "absolute", left: 90, bottom: 90, fontFamily: TYPE, fontSize: 52, color: YC.paper, textShadow: "0 3px 14px rgba(0,0,0,0.9)", opacity: ease((f - 20) / 16) }}>{title}</div> : null}
    </AbsoluteFill>
  );
};
