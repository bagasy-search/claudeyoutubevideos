// hdctomate · EL MUNDO: el patio chico de Claudio a pleno día. En el centro, la maceta negra de 50 litros CORTADA al medio
// (la mitad de adelante no está: se ve la tierra en corte, el tallo enterrado y las raíces) con la planta de tomate atada a
// su caña: hojas, racimos de flores amarillas y racimos de tomates que crecen y se ponen rojos. Alrededor: el banco de madera
// con el frasco del fermentado (tela + liga), la taza de medir y el molcajete con el polvo de cascarón; el balde de 10 litros
// y la regadera en el piso; la compostera de madera; el termómetro en la pared encalada; la media sombra arriba.
// UNA escena y UNA cámara (keyframes clavados a la voz con at()). El abono entra como polvo de luz que baja a la tierra.
// Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { manoCam } from "../kits/camara/CamaraMano";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type V3 = [number, number, number];
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const mix = (a: string, b: string, k: number) => "#" + new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getHexString();

// ---------------- medidas de la maceta y la planta ----------------
const POT_H = 0.75, R_TOP = 0.55, R_BOT = 0.42, SOIL = 0.71;
const TRUSS = [ // racimos: altura, ángulo alrededor del tallo (desde +z hacia +x)
  { y: 1.05, a: 0.55 }, { y: 1.5, a: -0.75 }, { y: 1.95, a: 0.85 }, { y: 2.38, a: -0.45 },
];
const tip = (i: number, d = 0.13): V3 => { const q = TRUSS[i]; return [Math.sin(q.a) * d, q.y - 0.04, Math.cos(q.a) * d]; };

// ---------------- puntos del mundo ----------------
export const PT = {
  pot: [0, 0.4, 0] as V3,
  soil: [0, 0.4, 0.02] as V3,       // el corte de la tierra (frente)
  soilTop: [0, SOIL, -0.15] as V3,  // la tierra de arriba
  stemBase: [0, SOIL, 0] as V3,
  buried: [0, 0.45, 0.02] as V3,    // el tallo enterrado
  ring5: [0.12, SOIL + 0.01, 0.05] as V3, // a 5 cm del tallo
  tr0: tip(0), tr1: tip(1), tr2: tip(2), tr3: tip(3),
  sucker: [0.07, 1.47, 0.05] as V3,
  lowLeaf: [-0.3, 0.92, 0.1] as V3,
  cane: [0.09, 1.6, -0.06] as V3,
  jar: [1.6, 0.95, -1.3] as V3,
  cup: [1.88, 0.86, -1.18] as V3,
  molca: [2.18, 0.88, -1.35] as V3,
  bucket: [1.15, 0.3, -0.25] as V3,
  can: [-1.0, 0.3, -0.35] as V3,
  thermo: [-0.95, 1.9, -2.5] as V3,
  compost: [-2.1, 0.5, -1.6] as V3,
  plate: [0, 0.03, 0.2] as V3,
  center: [0.2, 1.1, -0.3] as V3,
};

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const makeCam = (KEYS: Key[]) => {
  const camAt = (t: number) => {
    let i = 0;
    while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
    const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
    const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
    const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
    if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * v3(a.p).distanceTo(v3(b.p)); // arco de vuelo en traslados largos
    // cámara a mano virtual (vara 23-oct): paneo/inclinación lentos de manoCam sobre el punto de mira
    // (en camAt y no en Cam, así los carteles anclados con screenOf siguen pegados al objeto)
    const m = manoCam(t, 1, 3), fw = l.clone().sub(p), d = fw.length();
    const rt = fw.clone().cross(new THREE.Vector3(0, 1, 0)).normalize(), up = rt.clone().cross(fw).normalize();
    l.addScaledVector(rt, Math.tan((m.pan * Math.PI) / 180) * d).addScaledVector(up, Math.tan((m.tilt * Math.PI) / 180) * d);
    return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
  };
  const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
    const c = new THREE.PerspectiveCamera(cm.fov, W / H, 0.02, 200); c.position.copy(cm.p); c.lookAt(cm.l); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const v = q.clone().project(c); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, front: v.z < 1 };
  };
  const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
  const camSpeed = (t: number) => {
    const a = screenOf(t - 1 / FPS, PT.center), b = screenOf(t, PT.center);
    return { bx: Math.abs(b.x - a.x) * 0.06, by: Math.abs(b.y - a.y) * 0.06 };
  };
  return { camAt, screenOf, camSpeed };
};

const Cam: React.FC<{ t: number; camAt: ReturnType<typeof makeCam>["camAt"] }> = ({ t, camAt }) => {
  const { camera } = useThree();
  const c = camAt(t);
  const pc = camera as THREE.PerspectiveCamera;
  pc.position.copy(c.p); pc.lookAt(c.l); pc.fov = c.fov; pc.near = 0.02; pc.far = 200; pc.updateProjectionMatrix();
  return null;
};

// ---------------- texturas ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useHuertoTex = () => useMemo(() => ({
  tiles: mk(256, 256, (g) => { // piso de baldosa de barro
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = rnd(r * 4 + c, 1); g.fillStyle = `rgb(${170 + v * 30},${92 + v * 18},${60 + v * 12})`; g.fillRect(c * 64 + 2, r * 64 + 2, 60, 60); }
    g.fillStyle = "rgba(90,70,55,.9)"; for (let k = 0; k <= 4; k++) { g.fillRect(k * 64 - 2, 0, 4, 256); g.fillRect(0, k * 64 - 2, 256, 4); }
    for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(60,30,15,${0.12 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 2, 2); }
  }, [10, 5]),
  wall: mk(256, 256, (g) => { // pared encalada, con manchas de humedad abajo
    g.fillStyle = "#ece6da"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1800; i++) { const v = 210 + rnd(i, 1) * 40; g.fillStyle = `rgba(${v},${v - 6},${v - 16},.35)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
    const gr = g.createLinearGradient(0, 200, 0, 256); gr.addColorStop(0, "rgba(150,130,100,0)"); gr.addColorStop(1, "rgba(150,130,100,.35)"); g.fillStyle = gr; g.fillRect(0, 200, 256, 56);
  }, [6, 1]),
  // la tierra en corte (frente de la maceta): mantillo arriba, tierra con composta, tierra más clara y grava al fondo
  section: mk(512, 340, (g) => {
    g.clearRect(0, 0, 512, 340);
    const hw = (y: number) => (R_BOT + (R_TOP - R_BOT) * (1 - y / 340)) / R_TOP * 256; // media anchura del trapecio
    g.beginPath(); g.moveTo(256 - hw(0), 0); g.lineTo(256 + hw(0), 0); g.lineTo(256 + hw(340), 340); g.lineTo(256 - hw(340), 340); g.closePath(); g.clip();
    const bands: [number, string][] = [[0, "#3b2a1e"], [30, "#4f3826"], [150, "#5e4530"], [270, "#7a6a5a"]];
    bands.forEach(([y, c], i) => { g.fillStyle = c; g.fillRect(0, y, 512, (bands[i + 1]?.[0] ?? 340) - y); });
    for (let i = 0; i < 1600; i++) { const y = rnd(i, 3) * 340; g.fillStyle = y > 270 ? `rgba(160,150,140,${0.6 * rnd(i, 2)})` : `rgba(20,12,6,${0.35 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 4) * 512, y, y > 270 ? 2 + rnd(i, 5) * 5 : 1 + rnd(i, 5) * 2.5, 0, 6.3); g.fill(); }
    for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(220,200,160,${0.25 * rnd(i, 7)})`; g.fillRect(rnd(i, 8) * 512, 40 + rnd(i, 9) * 220, 3, 2); } // perlita
  }),
}), []);

// ---------------- piezas ----------------
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: THREE.Texture; rad?: number; rot?: V3; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op }) => (
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow={cast} receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V3; r: number; r2?: number; h: number; c: string; rough?: number; m?: number; rot?: V3; seg?: number; e?: string; ei?: number; op?: number; open?: boolean }> = ({ p, r, r2, h, c, rough = 0.8, m = 0, rot, seg = 32, e, ei = 0, op, open }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg, 1, open]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} side={open ? THREE.DoubleSide : THREE.FrontSide} /></mesh>
);
// segmento cilíndrico entre dos puntos (tallos, raíces, pecíolos)
const Seg: React.FC<{ a: V3; b: V3; r: number; c: string; r2?: number; e?: string; ei?: number }> = ({ a, b, r, c, r2, e, ei = 0 }) => {
  const A = v3(a), B = v3(b), mid = A.clone().add(B).multiplyScalar(0.5), d = B.clone().sub(A), len = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return <mesh position={mid} quaternion={q} castShadow><cylinderGeometry args={[r2 ?? r, r, len, 8]} /><meshStandardMaterial color={c} roughness={0.75} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>;
};

// la maceta negra de 50 L: sólo la mitad de atrás (corte al medio), con el borde y la tierra en corte
const Pot: React.FC<{ st: WorldState; tex: ReturnType<typeof useHuertoTex> }> = ({ st, tex }) => {
  const soilCol = st.dry > 0 ? mix("#5a4130", "#b39472", st.dry) : mix("#5a4130", "#2e1d12", st.wet);
  const secCol = st.dry > 0 ? mix("#ffffff", "#e8cfa8", st.dry) : mix("#ffffff", "#8a7a70", st.wet);
  return (
    <group>
      <mesh position={[0, POT_H / 2, 0]} castShadow receiveShadow><cylinderGeometry args={[R_TOP, R_BOT, POT_H, 64, 1, true, Math.PI / 2, Math.PI]} /><meshStandardMaterial color="#1b1d20" roughness={0.55} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, POT_H, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[R_TOP + 0.01, 0.025, 10, 64, Math.PI]} /><meshStandardMaterial color="#222428" roughness={0.45} /></mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[R_BOT, 48, 0, Math.PI]} /><meshStandardMaterial color="#141517" /></mesh>
      {/* tierra de arriba (media luna) */}
      <mesh position={[0, SOIL, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[R_TOP - 0.02, 64, 0, Math.PI]} /><meshStandardMaterial color={soilCol} roughness={st.wet > 0.4 ? 0.45 : 0.95} /></mesh>
      {/* la tierra en corte */}
      <mesh position={[0, SOIL / 2, 0.001]} receiveShadow><planeGeometry args={[2 * R_TOP, SOIL]} /><meshStandardMaterial map={tex.section} color={secCol} transparent alphaTest={0.5} roughness={0.95} emissive={st.feedCol} emissiveIntensity={0.18 * st.glow} /></mesh>
      {/* costra blanca de sal en el borde */}
      {st.salt > 0.01 && <mesh position={[0, POT_H - 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[R_TOP - 0.02, 0.018, 6, 64, Math.PI]} /><meshStandardMaterial color="#f4f1ea" roughness={1} transparent opacity={st.salt} /></mesh>}
      {/* platito abajo, con agua quieta */}
      <Cyl p={[0, 0.02, 0]} r={0.6} h={0.04} c="#2a2c30" rough={0.5} />
      {st.plate > 0.01 && <mesh position={[0, 0.042, 0.45]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.12, 32]} /><meshStandardMaterial color="#6d7a6a" roughness={0.1} metalness={0.2} transparent opacity={0.8 * st.plate} /></mesh>}
    </group>
  );
};

// raíces: nacen del tallo enterrado (los "pelitos" que se vuelven raíz) y del fondo; se dibujan pegadas al corte
const ROOTS: { a: V3; b: V3; deep: boolean }[] = (() => {
  const out: { a: V3; b: V3; deep: boolean }[] = [];
  for (let i = 0; i < 22; i++) {
    const deep = i >= 6, y0 = deep ? 0.66 - (i - 6) * 0.025 : 0.22 + rnd(i, 1) * 0.05, s = i % 2 ? 1 : -1;
    const len = (deep ? 0.12 : 0.1) + rnd(i, 2) * 0.14, ang = (deep ? -0.35 : -0.9) - rnd(i, 3) * 0.6;
    const b: V3 = [s * Math.cos(ang) * len, Math.max(0.04, y0 + Math.sin(ang) * len), 0.012];
    out.push({ a: [s * 0.03, y0, 0.012], b, deep });
    out.push({ a: b, b: [b[0] + s * 0.06 * rnd(i, 4), Math.max(0.03, b[1] - 0.05 - 0.05 * rnd(i, 5)), 0.012], deep });
  }
  return out;
})();

// folíolo de tomate: óvalo puntiagudo con el borde dentado (no una paleta)
const LEAFLET = (() => {
  // óvalo ancho con punta y 4-5 lóbulos suaves por lado (folíolo de tomate, no de helecho)
  const sh = new THREE.Shape(), N = 40, top: [number, number][] = [], bot: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const x = i / N, base = 0.46 * Math.pow(Math.sin(Math.PI * Math.pow(x, 0.8)), 0.75);
    const lobe = 1 + 0.07 * Math.sin(x * Math.PI * 9) * (x > 0.15 && x < 0.9 ? 1 : 0);
    top.push([x, base * lobe]); bot.push([x, -base * (1 + 0.07 * Math.sin(x * Math.PI * 9 + 1.3) * (x > 0.15 && x < 0.9 ? 1 : 0))]);
  }
  sh.moveTo(0, 0); top.forEach(([x, y]) => sh.lineTo(x, y)); bot.reverse().forEach(([x, y]) => sh.lineTo(x, y)); sh.lineTo(0, 0);
  const g = new THREE.ShapeGeometry(sh);
  // un poco de cuchara: la hoja se curva hacia abajo en los bordes
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i), x = pos.getX(i); pos.setZ(i, -0.35 * y * y - 0.08 * x * x); }
  g.computeVertexNormals();
  return g;
})();
const Leaflet: React.FC<{ s: number; k: number; col: string; pos: V3; rot: V3 }> = ({ s, k, col, pos, rot }) => (
  <mesh geometry={LEAFLET} position={pos} rotation={rot} scale={[s * 0.13 * k, 0.13 * k, 0.13 * k]} castShadow>
    <meshStandardMaterial color={col} roughness={0.6} side={THREE.DoubleSide} />
  </mesh>
);
const Leaf: React.FC<{ y: number; ang: number; len: number; col: string; droop: number; sc?: number }> = ({ y, ang, len, col, droop, sc = 1 }) => {
  if (sc < 0.01) return null;
  const col2 = "#" + new THREE.Color(col).multiplyScalar(1.18).getHexString();
  return (
    <group position={[0, y, 0]} rotation={[0, ang, 0]} scale={sc}>
      <group rotation={[1.05 + droop * 0.8, 0, 0]}>
        <Seg a={[0, 0, 0]} b={[0, len, 0]} r={0.008} r2={0.004} c="#5d8a3e" />
        {[0.2, 0.38, 0.56, 0.74, 0.92].map((f, j) => (
          <group key={j} position={[0, len * f, 0]} rotation={[0.25 * (j % 2), 0, 0]}>
            {j === 4 ? <Leaflet s={1} k={1.25} col={col2} pos={[0, 0, 0.004]} rot={[0.2, 0, Math.PI / 2]} /> :
              [-1, 1].map((s) => (
                <group key={s}>
                  <Leaflet s={s} k={0.85 + 0.3 * f} col={j % 2 ? col : col2} pos={[s * 0.004, 0.0, 0.004]} rot={[0.35, s * 0.25, s * 0.45]} />
                  <Leaflet s={s} k={0.38} col={col2} pos={[s * 0.003, -len * 0.08, 0.004]} rot={[0.3, 0, s * 0.8]} />
                </group>
              ))}
          </group>
        ))}
      </group>
    </group>
  );
};

// racimo: flores amarillas (estrellitas) o tomates; las flores pueden caer a la tierra
const Truss: React.FC<{ i: number; flw: number; drop: number; fruit: number; ripe: number; rot: number; t: number; glow: number }> = ({ i, flw, drop, fruit, ripe, rot, t, glow }) => {
  const q = TRUSS[i], dir: V3 = [Math.sin(q.a), 0, Math.cos(q.a)];
  const base: V3 = [dir[0] * 0.02, q.y, dir[2] * 0.02], end: V3 = [dir[0] * 0.13, q.y - 0.04, dir[2] * 0.13];
  const fcol = mix("#6aa83a", "#d8331f", ripe), n = 5;
  return (
    <group>
      <Seg a={base} b={end} r={0.006} c="#557f38" />
      {Array.from({ length: n }, (_, j) => {
        const off: V3 = [end[0] + dir[0] * 0.03 * j + (j % 2 ? 0.02 : -0.02) * dir[2], end[1] - 0.025 * (j % 3), end[2] + dir[2] * 0.03 * j - (j % 2 ? 0.02 : -0.02) * dir[0]];
        const fallen = cl(drop * 1.6 - j * 0.12), fy = off[1] - (off[1] - SOIL - 0.01) * ease(fallen), spin = fallen * (3 + j);
        return (
          <group key={j}>
            {flw > 0.01 && fruit < 0.15 && (
              <group position={[off[0] + fallen * 0.05 * (j - 2), fy, off[2] + fallen * 0.04]} rotation={[spin, spin * 0.5, 0]} scale={flw * (1 - 0.3 * fallen)}>
                <mesh rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.042, 0.022, 5]} /><meshStandardMaterial color={fallen > 0.5 ? "#c9a84a" : "#ffd21f"} emissive="#ffc400" emissiveIntensity={0.15 + 0.6 * glow} roughness={0.6} /></mesh>
                <mesh position={[0, -0.012, 0]}><coneGeometry args={[0.007, 0.02, 6]} /><meshStandardMaterial color="#e7b400" /></mesh>
              </group>
            )}
            {fruit > 0.01 && (
              <group position={[off[0], off[1] - 0.03 - 0.03 * fruit, off[2]]}>
                <mesh scale={[1, 0.88, 1]} castShadow><sphereGeometry args={[0.045 * fruit * (0.85 + 0.25 * rnd(i * 7 + j, 2)), 20, 14]} /><meshStandardMaterial color={fcol} roughness={0.28} /></mesh>
                <mesh position={[0, 0.04 * fruit, 0]}><coneGeometry args={[0.014 * fruit, 0.01, 5]} /><meshStandardMaterial color="#3f6b26" /></mesh>
                {rot > 0.01 && j === 2 && <mesh position={[0, -0.034 * fruit, 0]} scale={[1, 0.45, 1]}><sphereGeometry args={[0.022 * fruit, 14, 10]} /><meshStandardMaterial color="#1a120c" roughness={0.9} transparent opacity={rot} /></mesh>}
              </group>
            )}
          </group>
        );
      })}
      {/* polen: polvito amarillo que sale del racimo cuando se sacude */}
    </group>
  );
};

// polvo de luz que baja a la tierra (el abono que entra) y polen que flota
const Dust: React.FC<{ k: number; t: number; col: string; from: V3; to: number; n?: number; spread?: number; size?: number }> = ({ k, t, col, from, to, n = 70, spread = 0.35, size = 0.008 }) => {
  if (k < 0.01) return null;
  return <>{Array.from({ length: n }, (_, i) => {
    const ph = (t * (0.35 + 0.25 * rnd(i, 1)) + rnd(i, 2)) % 1, y = lerp(from[1], to, ph);
    const x = from[0] + (rnd(i, 3) - 0.5) * spread * (0.4 + ph), z = from[2] + (rnd(i, 4) - 0.5) * spread * 0.6 + 0.05;
    return <mesh key={i} position={[x, y, z]}><sphereGeometry args={[size * (0.7 + rnd(i, 5)), 6, 6]} /><meshBasicMaterial color={col} transparent opacity={k * Math.sin(Math.PI * ph)} toneMapped={false} /></mesh>;
  })}</>;
};

// el frasco del fermentado: vidrio, líquido ámbar, pedacitos de cáscara, tela con liga (o la tapa cerrada = el error)
const Jar: React.FC<{ st: WorldState; t: number }> = ({ st, t }) => {
  const [x, , z] = PT.jar, y0 = 0.83, lh = 0.17 * st.jarFill, lc = mix("#d8c27a", "#9a6418", st.ferment);
  return (
    <group position={[x, y0, z]}>
      <Cyl p={[0, 0.115, 0]} r={0.085} h={0.23} c="#cfe3e0" rough={0.05} m={0.1} op={0.35} />
      {lh > 0.003 && <Cyl p={[0, lh / 2 + 0.005, 0]} r={0.079} h={lh} c={lc} rough={0.2} op={0.93} />}
      {st.peels > 0.01 && Array.from({ length: 9 }, (_, i) => (
        <Box key={i} p={[(rnd(i, 1) - 0.5) * 0.1, 0.02 + rnd(i, 2) * Math.max(0.03, lh * 0.9), (rnd(i, 3) - 0.5) * 0.1]} s={[0.034, 0.012, 0.022]} rot={[rnd(i, 4) * 3, rnd(i, 5) * 3, 0]} c={mix("#e8c63a", "#5a4320", st.ferment)} r={0.7} rad={0.004} op={Math.min(1, st.peels * 3 - i * 0.2)} />
      ))}
      {st.ferment > 0.2 && lh > 0.02 && Array.from({ length: 10 }, (_, i) => { const ph = (t * 0.5 + rnd(i, 6)) % 1; return <mesh key={i} position={[(rnd(i, 7) - 0.5) * 0.12, 0.01 + ph * lh, (rnd(i, 8) - 0.5) * 0.12]}><sphereGeometry args={[0.004, 6, 6]} /><meshBasicMaterial color="#fff6d8" transparent opacity={0.7 * (st.ferment - 0.2)} /></mesh>; })}
      {st.cloth > 0.01 && <group position={[0, 0.235, 0]} scale={[1, 1, 1]}>
        <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.1 * st.cloth, 0.105 * st.cloth, 0.012, 24]} /><meshStandardMaterial color="#f2eee4" roughness={1} /></mesh>
        <mesh position={[0, -0.012, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.088, 0.005, 6, 32]} /><meshStandardMaterial color="#b0372b" roughness={0.6} transparent opacity={st.cloth} /></mesh>
      </group>}
      {st.lid > 0.01 && <Cyl p={[0, 0.245 + 0.1 * (1 - st.lid), 0]} r={0.09} h={0.03} c="#c7c9cc" m={0.8} rough={0.3} op={st.lid} />}
    </group>
  );
};

const Bucket: React.FC<{ fill: number; glow: number }> = ({ fill, glow }) => {
  const [x, , z] = PT.bucket;
  return (
    <group position={[x, 0, z]}>
      <Cyl p={[0, 0.17, 0]} r={0.17} r2={0.14} h={0.34} c="#2f6fb8" rough={0.45} open />
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.14, 32]} /><meshStandardMaterial color="#2a5f9e" /></mesh>
      {fill > 0.01 && <mesh position={[0, 0.02 + 0.28 * fill, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.14 + 0.028 * fill, 32]} /><meshStandardMaterial color={mix("#8fb4c9", "#b78a3a", glow)} roughness={0.08} metalness={0.1} emissive="#ffb84a" emissiveIntensity={0.25 * glow} /></mesh>}
      <mesh position={[0, 0.34, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.17, 0.006, 6, 40, Math.PI]} /><meshStandardMaterial color="#d9d9d9" metalness={0.8} roughness={0.3} /></mesh>
    </group>
  );
};

const Can: React.FC<{ pour: number }> = ({ pour }) => (
  <group position={[PT.can[0] + 0.55 * pour, 0.0 + 0.55 * pour, PT.can[2] + 0.25 * pour]} rotation={[0, 0.4, -0.7 * pour]}>
    <Cyl p={[0, 0.16, 0]} r={0.12} h={0.32} c="#3f8a52" rough={0.4} m={0.2} />
    <Seg a={[0.1, 0.12, 0]} b={[0.34, 0.36, 0]} r={0.016} r2={0.01} c="#3f8a52" />
    <mesh position={[0, 0.34, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.09, 0.012, 6, 24, Math.PI]} /><meshStandardMaterial color="#357547" /></mesh>
  </group>
);

const Compost: React.FC = () => (
  <group position={[PT.compost[0], 0, PT.compost[2]]}>
    {[0, 1, 2, 3, 4].map((k) => <Box key={k} p={[0, 0.1 + k * 0.17, 0.4]} s={[0.9, 0.12, 0.04]} c="#8a6a45" r={0.9} rad={0.01} />)}
    {[0, 1, 2, 3, 4].map((k) => <Box key={"s" + k} p={[0.45, 0.1 + k * 0.17, 0]} s={[0.04, 0.12, 0.8]} c="#7d603e" r={0.9} rad={0.01} />)}
    {[0, 1, 2, 3, 4].map((k) => <Box key={"w" + k} p={[-0.45, 0.1 + k * 0.17, 0]} s={[0.04, 0.12, 0.8]} c="#7d603e" r={0.9} rad={0.01} />)}
    <mesh position={[0, 0.72, 0]} scale={[0.42, 0.14, 0.36]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#3c2b1c" roughness={1} /></mesh>
    {[0, 1, 2, 3].map((k) => <Box key={"p" + k} p={[-0.2 + k * 0.13, 0.82, -0.05 + rnd(k, 2) * 0.1]} s={[0.1, 0.012, 0.04]} rot={[0, rnd(k, 3) * 3, 0]} c="#5a4a20" rad={0.004} />)}
  </group>
);

const Thermometer: React.FC<{ temp: number }> = ({ temp }) => {
  const [x, y, z] = PT.thermo, k = cl((temp - 10) / 35), hot = cl((temp - 30) / 4);
  return (
    <group position={[x, y, z + 0.02]}>
      <Box p={[0, 0, 0]} s={[0.16, 0.6, 0.02]} c="#f6f3ec" r={0.6} />
      <Cyl p={[0, 0.02, 0.02]} r={0.012} h={0.46} c="#ffffff" rough={0.1} op={0.5} />
      <mesh position={[0, -0.22, 0.02]}><sphereGeometry args={[0.025, 16, 12]} /><meshStandardMaterial color="#d8271c" emissive="#ff3a20" emissiveIntensity={0.3 + 0.8 * hot} /></mesh>
      <mesh position={[0, -0.21 + 0.21 * k, 0.022]}><cylinderGeometry args={[0.006, 0.006, 0.42 * k, 8]} /><meshStandardMaterial color="#d8271c" emissive="#ff3a20" emissiveIntensity={0.3 + 0.8 * hot} toneMapped={false} /></mesh>
      {Array.from({ length: 8 }, (_, i) => <Box key={i} p={[0.035, -0.18 + i * 0.055, 0.012]} s={[0.025, 0.004, 0.004]} c="#333" rad={0.001} />)}
    </group>
  );
};

// macetas de adorno alrededor (chiles, limonero, fresas): que se lea "patio de Claudio"
const SidePot: React.FC<{ p: V3; s: number; canopy: string; fruit?: string; tall?: number }> = ({ p, s, canopy, fruit, tall = 0 }) => (
  <group position={p} scale={s}>
    <Cyl p={[0, 0.17, 0]} r={0.2} r2={0.15} h={0.34} c="#b5653d" rough={0.85} />
    <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.19, 24]} /><meshStandardMaterial color="#3f2c1e" /></mesh>
    {tall > 0 && <Seg a={[0, 0.33, 0]} b={[0, 0.33 + tall, 0]} r={0.025} c="#6b5236" />}
    <mesh position={[0, 0.55 + tall, 0]} scale={[0.32, 0.26 + tall * 0.1, 0.3]} castShadow><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={canopy} roughness={0.85} /></mesh>
    {fruit && Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.5, 0.45 + tall + rnd(i, 2) * 0.25, 0.18 + rnd(i, 3) * 0.1]}><sphereGeometry args={[0.035, 10, 8]} /><meshStandardMaterial color={fruit} roughness={0.35} /></mesh>)}
  </group>
);

export const World: React.FC<{ t: number; camAt: ReturnType<typeof makeCam>["camAt"]; st: WorldState }> = ({ t, camAt, st }) => {
  const tex = useHuertoTex();
  const sunX = lerp(-5, 5, (st.sun + 1) / 2), sway = st.shake * 0.05 * Math.sin(t * 15), bushy = st.bushy;
  const leafCol = mix(mix("#2f6b2a", "#1f4f1c", bushy), "#8a6a2f", st.burn * 0.6);
  const NODES = [0.9, 1.1, 1.27, 1.45, 1.62, 1.8, 1.97, 2.14, 2.3, 2.45, 2.58, 1.0, 1.36, 1.72, 2.06, 2.38, ...(bushy > 0.05 ? [1.18, 1.54, 1.88, 2.22] : [])];
  return (
    <ThreeCanvas width={W} height={H} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 38, position: [0, 2, 5] }}>
      <Cam t={t} camAt={camAt} />
      <color attach="background" args={[mix("#9fc0da", "#e8c79a", st.heat)]} />
      <fog attach="fog" args={[mix("#b9cddc", "#e8c79a", st.heat), 14, 40]} />
      <hemisphereLight args={["#d6e4f2", "#7a5a3c", 0.5]} />
      <ambientLight intensity={0.08} />
      <directionalLight position={[sunX, 6.5, 4]} intensity={1.75 + 0.9 * st.heat} color={mix("#fff1d8", "#ffb565", st.heat)} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-3} shadow-bias={-0.0004} />
      {/* piso de baldosa y pared encalada */}
      <mesh position={[0, 0, -0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[16, 8]} /><meshStandardMaterial map={tex.tiles} roughness={0.9} /></mesh>
      <Box p={[0, 1.6, -2.65]} s={[16, 3.2, 0.2]} c="#d8cdbb" map={tex.wall} r={0.95} rad={0.01} />
      <Box p={[0, 3.24, -2.6]} s={[16, 0.1, 0.3]} c="#c9b8a0" r={0.9} rad={0.01} />
      {/* media sombra (se tiende para cortar el sol de la tarde) */}
      {st.shade > 0.01 && <mesh position={[0.2, 3.0, -0.6]} rotation={[-Math.PI / 2 + 0.25, 0, 0]} scale={[st.shade, 1, 1]} castShadow><planeGeometry args={[3.2, 2.6]} /><meshStandardMaterial color="#3d6b45" side={THREE.DoubleSide} transparent opacity={0.92} roughness={1} /></mesh>}
      {/* banco de madera */}
      <Box p={[1.9, 0.8, -1.35]} s={[1.3, 0.06, 0.55]} c="#8a5f3a" r={0.8} />
      {[[1.3, -1.6], [2.5, -1.6], [1.3, -1.1], [2.5, -1.1]].map(([x, z], i) => <Box key={i} p={[x, 0.39, z]} s={[0.06, 0.78, 0.06]} c="#76502f" />)}
      <Jar st={st} t={t} />
      {/* taza de medir y molcajete con el polvo de cascarón */}
      <group position={[PT.cup[0], 0.83, PT.cup[2]]}>
        <Cyl p={[0, 0.045, 0]} r={0.045} r2={0.038} h={0.09} c="#f1ece2" rough={0.3} e="#ffd27a" ei={0.6 * st.cupGlow} />
        <mesh position={[0.05, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.025, 0.007, 6, 16, Math.PI]} /><meshStandardMaterial color="#f1ece2" /></mesh>
      </group>
      <group position={[PT.molca[0], 0.83, PT.molca[2]]}>
        <mesh position={[0, 0.05, 0]} scale={[1, 0.6, 1]}><sphereGeometry args={[0.1, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#3a3836" roughness={1} side={THREE.DoubleSide} /></mesh>
        {[0, 1, 2].map((k) => <Cyl key={k} p={[0.06 * Math.cos(k * 2.1), -0.0, 0.06 * Math.sin(k * 2.1)]} r={0.018} h={0.03} c="#3a3836" />)}
        <mesh position={[0, 0.04 + 0.02 * st.powder, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.08, 24]} /><meshStandardMaterial color={mix("#d9d2c3", "#ffffff", st.powder)} roughness={1} emissive="#ffffff" emissiveIntensity={0.2 * st.powderGlow} /></mesh>
        {st.shells > 0.01 && Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.09, 0.07, (rnd(i, 2) - 0.5) * 0.09]} rotation={[rnd(i, 3) * 3, 0, rnd(i, 4) * 3]} scale={st.shells}><sphereGeometry args={[0.025, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={i % 2 ? "#f4efe4" : "#d9a774"} side={THREE.DoubleSide} /></mesh>)}
      </group>
      <Bucket fill={st.bucket} glow={st.bucketGlow} />
      <Can pour={st.pour} />
      <Compost />
      <Thermometer temp={st.temp} />
      <SidePot p={[-1.7, 0, -1.9]} s={1.2} canopy="#3d6e2e" fruit="#2f8a2a" />
      <SidePot p={[2.9, 0, -2.0]} s={1.5} canopy="#2f5f26" fruit="#e2c22a" tall={0.5} />
      <SidePot p={[-2.9, 0, -0.9]} s={1.0} canopy="#3a7a33" fruit="#d8261c" />
      <SidePot p={[-0.9, 0, -2.25]} s={0.8} canopy="#4a8a3a" fruit="#d8261c" />
      <SidePot p={[0.9, 0, -2.3]} s={0.7} canopy="#3f7f35" fruit="#e8343a" />
      <SidePot p={[3.7, 0, -1.2]} s={1.3} canopy="#2c5a24" fruit="#e2c22a" tall={0.4} />
      <SidePot p={[-3.8, 0, -2.0]} s={1.4} canopy="#2f6328" tall={0.6} />
      <SidePot p={[-2.2, 0, 0.4]} s={0.75} canopy="#4f9440" />
      <SidePot p={[3.1, 0, 0.3]} s={0.8} canopy="#3a7a33" fruit="#d8261c" />
      <Pot st={st} tex={tex} />
      {/* el tallo enterrado (se ve en el corte) + raíces */}
      <Seg a={[0, 0.22, 0.004]} b={[0, SOIL, 0.004]} r={0.026} c="#6f8a4a" />
      {ROOTS.map((r, i) => (!r.deep || st.roots > i / ROOTS.length) && <Seg key={i} a={r.a} b={r.deep ? [lerp(r.a[0], r.b[0], cl(st.roots * 1.4)), lerp(r.a[1], r.b[1], cl(st.roots * 1.4)), r.b[2]] : r.b} r={0.004} r2={0.0025} c="#cdb88e" e="#ffe2a0" ei={0.12 * st.roots * (r.deep ? 1 : 0)} />)}
      {/* mantillo de hojas secas y paja (3-5 cm) con el aro libre alrededor del tallo */}
      {st.mulch > 0.01 && Array.from({ length: 220 }, (_, i) => {
        const ang = Math.PI * rnd(i, 1), rr = 0.1 + rnd(i, 2) * 0.42; if (i / 220 > st.mulch) return null;
        return <Box key={i} p={[Math.cos(ang) * rr, SOIL + 0.006 + rnd(i, 3) * 0.03, -Math.sin(ang) * rr]} s={[0.045 + 0.03 * rnd(i, 6), 0.004, 0.016 + 0.012 * rnd(i, 7)]} rot={[rnd(i, 8) * 0.4, rnd(i, 4) * 6, rnd(i, 5) * 0.4]} c={["#9a7a42", "#6e5530", "#b89a5e", "#5a4528", "#c4a868"][i % 5]} r={1} rad={0.0015} cast={false} />;
      })}
      {/* el puñito de cascarón molido enterrado a 5 cm del tallo */}
      {st.shell > 0.01 && Array.from({ length: 40 }, (_, i) => { const ang = Math.PI * rnd(i, 6), rr = 0.1 + rnd(i, 7) * 0.05; return <mesh key={i} position={[Math.cos(ang) * rr, SOIL + 0.004, -Math.sin(ang) * rr]}><sphereGeometry args={[0.004, 5, 5]} /><meshStandardMaterial color="#fffaf0" emissive="#ffffff" emissiveIntensity={0.3 * st.shell} transparent opacity={st.shell} /></mesh>; })}
      {/* flores caídas en la tierra */}
      {st.fallen > 0.01 && Array.from({ length: 6 }, (_, i) => { const ang = 0.3 + Math.PI * 0.8 * rnd(i, 8), rr = 0.15 + rnd(i, 9) * 0.3; return <mesh key={i} position={[Math.cos(ang) * rr, SOIL + 0.008, -Math.sin(ang) * rr]} rotation={[-Math.PI / 2 + rnd(i, 2), rnd(i, 3) * 6, 0]} scale={st.fallen}><coneGeometry args={[0.028, 0.012, 5]} /><meshStandardMaterial color="#c4a54c" roughness={0.9} /></mesh>; })}
      {/* la caña y las ataduras de trapo */}
      <Seg a={[0.09, 0.3, -0.06]} b={[0.09, 2.85, -0.06]} r={0.016} c="#c9b27c" />
      {[1.0, 1.42, 1.86, 2.3].map((y, i) => st.ties > (i + 0.5) / 4 && <mesh key={i} position={[0.045, y, -0.03]} rotation={[Math.PI / 2, 0, 0.5]}><torusGeometry args={[0.055, 0.012, 6, 16]} /><meshStandardMaterial color="#e9e2d4" roughness={1} /></mesh>)}
      {/* la planta (se balancea cuando se sacude el tallo) */}
      <group position={[0, SOIL, 0]} rotation={[sway * 0.4, 0, sway]}>
        <group position={[0, -SOIL, 0]}>
          <Seg a={[0, SOIL, 0]} b={[0.01, 1.6, 0]} r={0.028} r2={0.022} c="#5f8a3c" />
          <Seg a={[0.01, 1.6, 0]} b={[-0.01, 2.6, 0.01]} r={0.022} r2={0.012} c="#5f8a3c" />
          {NODES.map((y, i) => {
            const low = i < 2, sc = low ? 1 - st.prune : 1, col = low ? mix(leafCol, "#d1b53c", st.yellow) : leafCol;
            const L0 = (0.46 + 0.06 * Math.sin(i * 1.7)) * (1 + 0.35 * bushy) * (y > 2.35 ? 0.65 : 1), dr = low ? 0.5 + 0.4 * st.yellow : 0.15 + st.wilt * 0.6;
            return <React.Fragment key={i}>
              <Leaf y={y} ang={i * 2.4 + 0.6} len={L0} col={col} droop={dr} sc={sc} />
              {y < 2.4 && <Leaf y={y + 0.04} ang={i * 2.4 + 0.6 + 2.7} len={L0 * 0.72} col={col} droop={dr + 0.1} sc={sc * (i >= 11 ? bushy * 0.9 + 0.6 : 1)} />}
            </React.Fragment>;
          })}
          {/* el chupón en la axila */}
          {st.sucker > 0.01 && <group position={[0.02, 1.4, 0.02]} rotation={[0.9, 0.5, 0]} scale={st.sucker}>
            <Seg a={[0, 0, 0]} b={[0, 0.14, 0]} r={0.008} c="#7fb24a" e="#c8ff7a" ei={0.5 * st.suckerHi} />
            {[-1, 1].map((s) => <mesh key={s} position={[s * 0.03, 0.13, 0]} rotation={[0, 0, s * 0.6]} scale={[0.035, 0.022, 0.006]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#7fb24a" emissive="#c8ff7a" emissiveIntensity={0.5 * st.suckerHi} /></mesh>)}
          </group>}
          {TRUSS.map((_, i) => <Truss key={i} i={i} flw={st.flw[i]} drop={st.drop[i]} fruit={st.fruit[i]} ripe={st.ripe[i]} rot={i === 3 ? st.rot : 0} t={t} glow={st.flowerGlow} />)}
        </group>
      </group>
      {/* polen que sale con la sacudida, abono que baja a la tierra, agua del riego */}
      <Dust k={st.pollen} t={t} col="#ffe24a" from={[0.1, 2.2, 0.15]} to={1.7} n={60} spread={0.5} size={0.006} />
      <Dust k={st.feed} t={t} col={st.feedCol} from={[0, 1.25, 0.05]} to={SOIL - 0.25} n={90} spread={0.6} size={0.009} />
      <Dust k={st.rain} t={t * 2.2} col="#9fd3ff" from={[-0.2, 1.15, 0.0]} to={SOIL} n={70} spread={0.12} size={0.008} />
      {st.feed > 0.01 && <pointLight position={[0, SOIL + 0.1, 0.3]} color={st.feedCol} intensity={1.6 * st.feed} distance={1.2} />}
      <Post bloom={0.45} threshold={0.9} exposure={0.92} env={0.35} ao />
    </ThreeCanvas>
  );
};

export type WorldState = {
  sun: number; heat: number; shade: number; temp: number;
  shake: number; pollen: number; flowerGlow: number;
  flw: number[]; drop: number[]; fruit: number[]; ripe: number[]; rot: number; fallen: number;
  feed: number; feedCol: string; glow: number;
  wet: number; dry: number; rain: number; plate: number; salt: number; burn: number; wilt: number;
  roots: number; mulch: number; shell: number; ties: number; sucker: number; suckerHi: number; prune: number; yellow: number; bushy: number;
  jarFill: number; peels: number; ferment: number; cloth: number; lid: number; cupGlow: number; bucket: number; bucketGlow: number; pour: number;
  powder: number; powderGlow: number; shells: number;
};
// estado base: la planta sana en flor, día de mañana
export const BASE: WorldState = {
  sun: -0.4, heat: 0, shade: 0, temp: 26,
  shake: 0, pollen: 0, flowerGlow: 0,
  flw: [1, 1, 1, 1], drop: [0, 0, 0, 0], fruit: [0, 0, 0, 0], ripe: [0, 0, 0, 0], rot: 0, fallen: 0,
  feed: 0, feedCol: "#ffb84a", glow: 0,
  wet: 0.2, dry: 0, rain: 0, plate: 0, salt: 0, burn: 0, wilt: 0,
  roots: 0.15, mulch: 0, shell: 0, ties: 1, sucker: 0, suckerHi: 0, prune: 0, yellow: 0, bushy: 0,
  jarFill: 0, peels: 0, ferment: 0, cloth: 0, lid: 0, cupGlow: 0, bucket: 0, bucketGlow: 0, pour: 0,
  powder: 0, powderGlow: 0, shells: 0,
};
