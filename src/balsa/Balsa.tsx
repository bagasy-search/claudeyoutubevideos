// Escena «balsa»: balsa inflable blanca sobre negro, figuritas rojas de arcilla que caen rebotando y la llenan.
// 100 % código (Remotion + R3F). Determinista por cuadro. Luces siempre montadas (se encienden con rampa).
import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { mulberry32, ruido1 } from "../stickman3d/prng";

// ───────────────────────── forma de la balsa ─────────────────────────
export const RA = 2.55, RB = 1.12, RTUBO = 0.25, NSE = 3.6; // semiejes, radio del tubo, exponente superelipse
export const PISO = 0.1; // altura del piso interior
export const sgnPow = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e);
export const borde = (u: number, ka = RA, kb = RB): [number, number] => {
  const c = Math.cos(u), s = Math.sin(u);
  return [ka * sgnPow(c, 2 / NSE), kb * sgnPow(s, 2 / NSE)];
};
export const curvaBorde = (ka: number, kb: number, y: number, n = 160) => {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) { const [x, z] = borde((i / n) * Math.PI * 2, ka, kb); pts.push(new THREE.Vector3(x, y, z)); }
  return new THREE.CatmullRomCurve3(pts, true, "centripetal");
};

export const usarGeosBalsa = () => useMemo(() => {
  const tubo = new THREE.TubeGeometry(curvaBorde(RA, RB, RTUBO + 0.02), 520, RTUBO, 56, true);
  // casco inferior gris: forma apenas más grande, achatada, debajo del tubo
  const casco = new THREE.TubeGeometry(curvaBorde(RA + 0.04, RB + 0.04, 0.06), 400, 0.13, 24, true);
  casco.scale(1, 0.55, 1);
  // piso interior
  const sh = new THREE.Shape();
  for (let i = 0; i <= 120; i++) { const [x, z] = borde((i / 120) * Math.PI * 2, RA - 0.12, RB - 0.12); if (i === 0) sh.moveTo(x, z); else sh.lineTo(x, z); }
  const piso = new THREE.ExtrudeGeometry(sh, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 60 });
  piso.rotateX(Math.PI / 2); piso.translate(0, PISO, 0);
  // costuras de las cámaras (anillos finos alrededor del tubo)
  const costuras: THREE.BufferGeometry[] = [];
  const cv = curvaBorde(RA, RB, RTUBO + 0.02);
  [0.06, 0.19, 0.31, 0.44, 0.56, 0.69, 0.81, 0.94].forEach((u) => {
    const p = cv.getPointAt(u), t = cv.getTangentAt(u);
    const g = new THREE.TorusGeometry(RTUBO + 0.003, 0.009, 8, 64);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), t);
    g.applyQuaternion(q); g.translate(p.x, p.y, p.z); costuras.push(g);
  });
  // listones del piso (travesaños apenas elevados)
  const listones: THREE.BufferGeometry[] = [];
  for (let k = -5; k <= 5; k++) {
    const x = k * 0.46; const half = RB * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(x) / (RA - 0.2), NSE)), 1 / NSE) - 0.2;
    if (half < 0.3) continue;
    const g = new THREE.CapsuleGeometry(0.022, half * 2, 6, 12); g.rotateX(Math.PI / 2); g.translate(x, PISO + 0.012, 0); listones.push(g);
  }
  // cabo lateral con caídas entre presillas + presillas
  const NP = 22, cabo: THREE.Vector3[] = [], presillas: THREE.Vector3[] = [];
  const kOff = 1 + RTUBO * 1.02 / Math.max(RA, RB);
  for (let i = 0; i < NP; i++) {
    for (let j = 0; j < 8; j++) {
      const s = j / 8, u = ((i + s) / NP) * Math.PI * 2;
      const [x, z] = borde(u, RA + RTUBO * 0.82, RB + RTUBO * 0.82);
      const caida = Math.sin(s * Math.PI) * 0.07;
      cabo.push(new THREE.Vector3(x, RTUBO * 0.55 - caida, z));
      if (j === 0) presillas.push(new THREE.Vector3(x, RTUBO * 0.55, z));
    }
  }
  void kOff;
  const caboGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cabo, true), 900, 0.012, 8, true);
  const presillaGeo = new THREE.SphereGeometry(0.03, 16, 12);
  return { tubo, casco, piso, costuras, listones, caboGeo, presillaGeo, presillas };
}, []);

// ───────────────────────── figurita ─────────────────────────
// alto parado = 1. Jerarquía FK: raíz(cadera) → torso → cabeza / hombros → brazos ; cadera → piernas
export type Pose = {
  tronco: number; // inclinación del torso hacia adelante (rad)
  cabeza: number; // cabeceo
  cabezaY: number;
  muslo: [number, number]; // ángulo del muslo (0 = abajo, -π/2 = adelante)
  rodilla: [number, number]; // flexión (+ = hacia atrás)
  abre: [number, number]; // apertura lateral de las piernas
  hombro: [number, number]; // ángulo del brazo (0 = abajo, -π/2 = adelante)
  hombroL: [number, number]; // separación lateral
  codo: [number, number]; // flexión del codo (- = hacia adelante)
  altura: number; // altura de la cadera sobre el apoyo
};

export const P_PARADO: Pose = { tronco: 0, cabeza: 0, cabezaY: 0, muslo: [0, 0], rodilla: [0.04, 0.04], abre: [0.06, 0.06], hombro: [0.05, 0.05], hombroL: [0.12, 0.12], codo: [-0.15, -0.15], altura: 0.49 };
export const P_AIRE: Pose = { tronco: -0.1, cabeza: -0.15, cabezaY: 0, muslo: [-0.35, 0.2], rodilla: [0.7, 0.3], abre: [0.25, 0.25], hombro: [-2.5, -2.4], hombroL: [0.5, 0.5], codo: [-0.2, -0.2], altura: 0.49 };
export const P_PISO: Pose = { tronco: 0.12, cabeza: 0.15, cabezaY: 0, muslo: [-1.15, -1.1], rodilla: [2.1, 2.05], abre: [0.18, 0.2], hombro: [-0.42, -0.38], hombroL: [0.2, 0.2], codo: [-0.95, -1.05], altura: 0.06 };
export const P_PISO_ABRAZA: Pose = { tronco: 0.3, cabeza: 0.3, cabezaY: 0, muslo: [-1.3, -1.25], rodilla: [2.35, 2.3], abre: [0.08, 0.08], hombro: [-0.62, -0.62], hombroL: [0.16, 0.16], codo: [-1.05, -1.05], altura: 0.06 };
export const P_BORDE: Pose = { tronco: 0.02, cabeza: 0.08, cabezaY: 0, muslo: [-1.45, -1.5], rodilla: [1.45, 1.5], abre: [0.12, 0.14], hombro: [-0.3, -0.35], hombroL: [0.18, 0.18], codo: [-0.9, -0.85], altura: 0.04 };
export const P_BORDE_MANO: Pose = { tronco: 0.18, cabeza: 0.1, cabezaY: 0, muslo: [-1.5, -1.4], rodilla: [1.5, 1.4], abre: [0.12, 0.14], hombro: [-0.9, -0.2], hombroL: [0.15, 0.25], codo: [-2.1, -0.4], altura: 0.04 };
export const P_PARADO_MENTON: Pose = { ...P_PARADO, hombro: [-0.6, 0.05], codo: [-2.2, -0.15], cabeza: 0.12 };

export const mezclaP = (a: Pose, b: Pose, k: number): Pose => {
  const m = (x: number, y: number) => x + (y - x) * k;
  const m2 = (x: [number, number], y: [number, number]): [number, number] => [m(x[0], y[0]), m(x[1], y[1])];
  return { tronco: m(a.tronco, b.tronco), cabeza: m(a.cabeza, b.cabeza), cabezaY: m(a.cabezaY, b.cabezaY), muslo: m2(a.muslo, b.muslo), rodilla: m2(a.rodilla, b.rodilla), abre: m2(a.abre, b.abre), hombro: m2(a.hombro, b.hombro), hombroL: m2(a.hombroL, b.hombroL), codo: m2(a.codo, b.codo), altura: m(a.altura, b.altura) };
};

// medidas (alto 1)
export const M = {
  cabezaR: 0.098, cuello: 0.035,
  torsoLargo: 0.25, torsoR: 0.092, torsoAncho: 1.12, torsoProf: 0.84,
  hombroX: 0.095, hombroY: 0.235,
  brazoR: 0.037, brazo: 0.19, anteR: 0.034, ante: 0.18, manoR: 0.04,
  caderaX: 0.05, musloR: 0.052, muslo: 0.235, canillaR: 0.044, canilla: 0.215, pieR: 0.034, pie: 0.07,
};

export type GeosFig = Record<"torso" | "cabeza" | "brazo" | "ante" | "mano" | "muslo" | "canilla" | "pie" | "nalga", THREE.BufferGeometry>;
export const capsula = (r: number, largo: number) => { const g = new THREE.CapsuleGeometry(r, Math.max(0.001, largo - 2 * r), 10, 24); g.translate(0, -largo / 2 + r, 0); return g; }; // cuelga de su origen hacia -y

export const usarGeosFig = (): GeosFig => useMemo(() => {
  const torso = new THREE.CapsuleGeometry(M.torsoR, M.torsoLargo - 2 * M.torsoR, 12, 32);
  torso.scale(M.torsoAncho, 1, M.torsoProf); torso.translate(0, M.torsoLargo / 2, 0);
  // afinar la cintura y ensanchar el pecho
  const p = torso.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i) / M.torsoLargo; const k = 0.9 + 0.18 * THREE.MathUtils.smoothstep(y, 0.15, 0.75);
    p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * (0.95 + 0.08 * THREE.MathUtils.smoothstep(y, 0.3, 0.8)));
  }
  torso.computeVertexNormals();
  const nalga = new THREE.SphereGeometry(M.torsoR * 1.02, 24, 16); nalga.scale(1.15, 0.75, 0.9);
  return {
    torso, nalga,
    cabeza: new THREE.SphereGeometry(M.cabezaR, 48, 32),
    brazo: capsula(M.brazoR, M.brazo), ante: capsula(M.anteR, M.ante),
    mano: new THREE.SphereGeometry(M.manoR, 20, 14),
    muslo: capsula(M.musloR, M.muslo), canilla: capsula(M.canillaR, M.canilla),
    pie: (() => { const g = new THREE.CapsuleGeometry(M.pieR, M.pie, 8, 16); g.rotateX(Math.PI / 2); g.scale(1, 0.75, 1); g.translate(0, -M.pieR * 0.4, M.pie * 0.35); return g; })(),
  };
}, []);

export const Figura: React.FC<{ g: GeosFig; mat: THREE.Material; pose: Pose; sq: number }> = ({ g, mat, pose, sq }) => {
  // sq = squash (+) / stretch (−) conservando volumen
  const sy = 1 - sq, sxz = 1 / Math.sqrt(Math.max(0.3, sy));
  const lado = (s: number, i: 0 | 1) => (
    <group key={`l${i}`}>
      {/* brazo */}
      <group position={[s * M.hombroX, M.hombroY, 0]} rotation={[pose.hombro[i], 0, s * pose.hombroL[i]]}>
        <mesh geometry={g.brazo} material={mat} castShadow receiveShadow />
        <group position={[0, -M.brazo + M.brazoR, 0]} rotation={[pose.codo[i], 0, 0]}>
          <mesh geometry={g.ante} material={mat} castShadow receiveShadow />
          <mesh geometry={g.mano} material={mat} position={[0, -M.ante + M.anteR * 0.6, 0]} castShadow receiveShadow />
        </group>
      </group>
    </group>
  );
  const pierna = (s: number, i: 0 | 1) => (
    <group key={`p${i}`} position={[s * M.caderaX, 0, 0]} rotation={[pose.muslo[i], 0, s * pose.abre[i]]}>
      <mesh geometry={g.muslo} material={mat} castShadow receiveShadow />
      <group position={[0, -M.muslo + M.musloR, 0]} rotation={[pose.rodilla[i], 0, 0]}>
        <mesh geometry={g.canilla} material={mat} castShadow receiveShadow />
        <group position={[0, -M.canilla + M.canillaR * 0.5, 0]} rotation={[-pose.rodilla[i] - pose.muslo[i], 0, 0]}>
          <mesh geometry={g.pie} material={mat} castShadow receiveShadow />
        </group>
      </group>
    </group>
  );
  return (
    <group scale={[sxz, sy, sxz]}>
      <group position={[0, pose.altura, 0]}>
        <mesh geometry={g.nalga} material={mat} position={[0, 0.01, -0.005]} castShadow receiveShadow />
        {pierna(-1, 0)}{pierna(1, 1)}
        <group rotation={[pose.tronco, 0, 0]}>
          <mesh geometry={g.torso} material={mat} castShadow receiveShadow />
          {lado(-1, 0)}{lado(1, 1)}
          <group position={[0, M.torsoLargo + M.cuello, 0]} rotation={[pose.cabeza, pose.cabezaY, 0]}>
            <mesh geometry={g.cabeza} material={mat} position={[0, M.cabezaR * 0.92, 0]} castShadow receiveShadow />
          </group>
        </group>
      </group>
    </group>
  );
};

// ───────────────────────── reparto de figuras ─────────────────────────
export type Plaza = { x: number; z: number; y: number; rot: number; pose: Pose; tCae: number; desde: [number, number]; alto: number };
export const NFIG = 40;

export const repartir = (): Plaza[] => {
  const r = mulberry32(2026);
  const plazas: Omit<Plaza, "tCae" | "desde">[] = [];
  // en el borde (sentados sobre el tubo, mirando adentro)
  const NB = 15;
  for (let i = 0; i < NB; i++) {
    const u = ((i + 0.5 + (r() - 0.5) * 0.35) / NB) * Math.PI * 2;
    const [x, z] = borde(u, RA - 0.02, RB - 0.02);
    const ang = Math.atan2(-z / (RB * RB), -x / (RA * RA)); // hacia adentro (normal de la elipse)
    plazas.push({ x, z, y: RTUBO * 2 - 0.04, rot: Math.PI / 2 - ang + (r() - 0.5) * 0.3, pose: r() < 0.3 ? P_BORDE_MANO : P_BORDE, alto: 0.94 + r() * 0.1 });
  }
  // adentro (sentados en el piso o parados), muestreo con distancia mínima
  const dentro: [number, number][] = [];
  let intentos = 0;
  while (dentro.length < NFIG - NB && intentos < 4000) {
    intentos++;
    const x = (r() * 2 - 1) * (RA - 0.5), z = (r() * 2 - 1) * (RB - 0.45);
    if (Math.pow(Math.abs(x) / (RA - 0.45), NSE) + Math.pow(Math.abs(z) / (RB - 0.4), NSE) > 1) continue;
    if (dentro.some(([a, b]) => Math.hypot(a - x, b - z) < 0.36)) continue;
    dentro.push([x, z]);
  }
  dentro.forEach(([x, z], k) => {
    const parado = k % 6 === 2;
    const pose = parado ? (k % 12 === 2 ? P_PARADO_MENTON : P_PARADO) : (r() < 0.4 ? P_PISO_ABRAZA : P_PISO);
    plazas.push({ x, z, y: PISO + 0.1, rot: (r() - 0.5) * Math.PI * 2, pose, alto: 0.92 + r() * 0.12 });
  });
  // orden de llegada: la primera, parada en el centro; después mezclado
  const primera = plazas.reduce((b, p, i) => (p.pose === P_PARADO && Math.hypot(p.x, p.z) < Math.hypot(plazas[b].x, plazas[b].z) ? i : b), NB);
  const orden = [primera, ...plazas.map((_, i) => i).filter((i) => i !== primera).sort(() => 0).sort((a, b) => ((a * 7919) % 41) - ((b * 7919) % 41))];
  // cadencia que se acelera: 0,6 s → 0,08 s
  let t = 2.4;
  return orden.map((idx, k) => {
    const p = plazas[idx];
    if (k > 0) t += k === 1 ? 0.75 : Math.max(0.075, 0.42 * Math.pow(0.9, k));
    const a = r() * Math.PI * 2;
    return { ...p, tCae: t, desde: [p.x + Math.cos(a) * 0.8, p.z + Math.sin(a) * 0.6] as [number, number] };
  });
};

// ───────────────────────── luz y entorno ─────────────────────────
const Entorno: React.FC<{ k: number }> = ({ k }) => {
  const { gl, scene } = useThree();
  const env = useMemo(() => {
    const sc = new THREE.Scene();
    sc.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.02, 0.022, 0.025), side: THREE.BackSide })));
    const sb = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.2, 2.25), side: THREE.DoubleSide }));
    sb.position.set(-8, 30, 10); sb.lookAt(0, 0, 0); sc.add(sb);
    const tira = new THREE.Mesh(new THREE.PlaneGeometry(30, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.7, 0.75, 0.8), side: THREE.DoubleSide }));
    tira.position.set(20, 8, -20); tira.lookAt(0, 0, 0); sc.add(tira);
    const pm = new THREE.PMREMGenerator(gl); const rt = pm.fromScene(sc, 0.04); pm.dispose(); return rt.texture;
  }, [gl]);
  scene.environment = env;
  scene.environmentIntensity = 0.42 * k;
  return null;
};

const Fondo: React.FC<{ k: number }> = ({ k }) => {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    depthTest: false, depthWrite: false, toneMapped: false, uniforms: { uK: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = position.xy*0.5+0.5; gl_Position = vec4(position.xy, 0.9999, 1.0);} `,
    fragmentShader: `varying vec2 vUv; uniform float uK;
      void main(){
        vec2 p = (vUv - vec2(0.5, 0.56)) * vec2(1.6, 1.0);
        float d = length(p);
        vec3 c = mix(vec3(0.075, 0.08, 0.085), vec3(0.018, 0.02, 0.022), smoothstep(0.0, 0.85, d));
        // dither para que el degradé no haga bandas
        float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
        gl_FragColor = vec4(c * uK + (n - 0.5) / 255.0, 1.0);
      }`,
  }), []);
  mat.uniforms.uK.value = k;
  const geo = useMemo(() => new THREE.PlaneGeometry(2, 2), []);
  return <mesh geometry={geo} material={mat} frustumCulled={false} renderOrder={-1000} />;
};

const Camara: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree();
  const c = camera as THREE.PerspectiveCamera;
  // órbita lenta y curva: azimut, altura y distancia con easing (nunca lineal) + respiración mínima
  const k = Easing.bezier(0.45, 0, 0.25, 1)(Math.min(1, Math.max(0, (t - 0.3) / 9.2)));
  const az = THREE.MathUtils.degToRad(-58 + 22 * k + 0.6 * ruido1(t * 0.35, 3));
  const el = THREE.MathUtils.degToRad(47 - 6 * k + 0.4 * ruido1(t * 0.3, 5));
  const dist = 11.2 - 1.3 * k;
  const mira = new THREE.Vector3(0.0, 0.25 + 0.05 * k, 0);
  c.position.set(mira.x + dist * Math.cos(el) * Math.sin(az), mira.y + dist * Math.sin(el), mira.z + dist * Math.cos(el) * Math.cos(az));
  c.up.set(0, 1, 0); c.lookAt(mira);
  c.rotateZ(THREE.MathUtils.degToRad(-14 + 3 * k)); // la balsa en diagonal, como la ref
  c.fov = 30; c.near = 1; c.far = 60; c.updateProjectionMatrix();
  return null;
};

// ───────────────────────── escena ─────────────────────────
export const resorte = (t: number, w = 14, z = 0.32) => (t <= 0 ? 0 : 1 - Math.exp(-z * w * t) * Math.cos(w * Math.sqrt(1 - z * z) * t));

const Escena: React.FC<{ t: number }> = ({ t }) => {
  const gb = usarGeosBalsa();
  const gf = usarGeosFig();
  const plazas = useMemo(() => repartir(), []);
  const mats = useMemo(() => ({
    pvc: new THREE.MeshPhysicalMaterial({ color: "#e9e9e7", roughness: 0.38, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.35, sheen: 0.2, sheenColor: new THREE.Color("#ffffff") }),
    pisoB: new THREE.MeshPhysicalMaterial({ color: "#d9d9d6", roughness: 0.55, clearcoat: 0.1 }),
    casco: new THREE.MeshPhysicalMaterial({ color: "#8d9195", roughness: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.4 }),
    costura: new THREE.MeshPhysicalMaterial({ color: "#c9cacb", roughness: 0.5 }),
    cabo: new THREE.MeshStandardMaterial({ color: "#3a3d40", roughness: 0.6 }),
    arcilla: new THREE.MeshPhysicalMaterial({ color: "#c63b31", roughness: 0.6, metalness: 0, sheen: 0.45, sheenColor: new THREE.Color("#ff8a78"), sheenRoughness: 0.5, clearcoat: 0.08, clearcoatRoughness: 0.7 }),
  }), []);

  // la balsa aparece: emerge de la oscuridad mientras baja y se asienta con un bamboleo
  const tb = t - 0.6;
  const kLuz = interpolate(t, [0.6, 2.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) });
  const caida = tb < 0 ? 1 : Math.max(0, 1 - resorte(tb, 7.5, 0.42));
  let by = 0.9 * caida, rx = 0.09 * Math.exp(-2.2 * Math.max(0, tb)) * Math.sin(Math.max(0, tb) * 6.5), rz = -0.05 * Math.exp(-2 * Math.max(0, tb)) * Math.sin(Math.max(0, tb) * 5.1 + 1);

  // cada aterrizaje hunde la balsa un poco (impulso amortiguado) e inclina hacia ese lado
  let n = 0;
  plazas.forEach((p) => {
    const d = t - (p.tCae + 0.5);
    if (d < 0) return;
    n++;
    const imp = Math.exp(-5 * d) * Math.sin(d * 16) * 0.022;
    by -= imp; rx += imp * p.z * 0.35; rz -= imp * p.x * 0.12;
  });
  by -= 0.004 * Math.min(n, NFIG) / 4; // se hunde un poquito con la carga
  // flota apenas (respiración del agua, mínima)
  by += 0.008 * Math.sin(t * 1.3); rx += 0.004 * Math.sin(t * 0.9 + 1);

  return (
    <>
      <Entorno k={kLuz} />
      {/* luces SIEMPRE montadas, se encienden con kLuz */}
      {/* pozo de luz cenital (cae hacia las puntas, como la ref) */}
      <spotLight position={[-2.2, 10.5, 2.6]} angle={0.36} penumbra={1} decay={0} intensity={4.2 * kLuz} color="#fff7f0" castShadow
        shadow-mapSize-width={4096} shadow-mapSize-height={4096} shadow-bias={-0.0002} shadow-normalBias={0.01} shadow-camera-near={4} shadow-camera-far={20} />
      <directionalLight position={[5, 3, -6]} intensity={0.9 * kLuz} color="#cfe0ff" />
      <directionalLight position={[4, 4, 6]} intensity={0.18 * kLuz} color="#ffffff" />
      <hemisphereLight args={["#ffffff", "#141618", 0.18 * kLuz]} />

      <group position={[0, by, 0]} rotation={[rx, 0, rz]}>
        <mesh geometry={gb.tubo} material={mats.pvc} castShadow receiveShadow />
        <mesh geometry={gb.casco} material={mats.casco} receiveShadow />
        <mesh geometry={gb.piso} material={mats.pisoB} receiveShadow />
        {gb.costuras.map((g, i) => <mesh key={`c${i}`} geometry={g} material={mats.costura} receiveShadow />)}
        {gb.listones.map((g, i) => <mesh key={`s${i}`} geometry={g} material={mats.pisoB} castShadow receiveShadow />)}
        <mesh geometry={gb.caboGeo} material={mats.cabo} />
        {gb.presillas.map((p, i) => <mesh key={`q${i}`} geometry={gb.presillaGeo} material={mats.costura} position={p} scale={[1, 0.7, 1]} />)}

        {plazas.map((p, i) => {
          const DUR = 0.5; // vuelo
          const tv = t - p.tCae;
          if (tv < 0) return null;
          let x = p.x, y = p.y, z = p.z, sq = 0, pose = p.pose;
          let rot = p.rot;
          if (tv < DUR) {
            const s = tv / DUR;
            const e = s; // horizontal lineal, vertical parabólica (gravedad)
            x = p.desde[0] + (p.x - p.desde[0]) * Easing.out(Easing.quad)(e);
            z = p.desde[1] + (p.z - p.desde[1]) * Easing.out(Easing.quad)(e);
            const h0 = 3.0; y = p.y + h0 * (1 - s * s) + 0.9 * Math.sin(s * Math.PI) * (1 - s);
            sq = -0.14 * s; // se estira al caer
            pose = mezclaP(P_AIRE, p.pose, Easing.in(Easing.cubic)(s) * 0.5);
            rot = p.rot + (1 - s) * 1.2;
          } else {
            const d = tv - DUR;
            // aplaste al tocar y rebote con resorte; la primera hace un saltito extra
            sq = 0.26 * Math.exp(-9 * d) * Math.cos(d * 22);
            if (i === 0 && d > 0.12 && d < 0.62) { const h = (d - 0.12) / 0.5; y += 0.45 * 4 * h * (1 - h); }
            pose = mezclaP(P_AIRE, p.pose, Math.min(1, 0.5 + resorte(d, 16, 0.5) * 0.5));
            // micro-movimiento de vida
            const v = ruido1(t * 0.6 + i * 3.1, i);
            pose = { ...pose, cabeza: pose.cabeza + 0.05 * v, cabezaY: pose.cabezaY + 0.12 * ruido1(t * 0.35 + i, i + 9), tronco: pose.tronco + 0.015 * Math.sin(t * 1.8 + i) };
          }
          return (
            <group key={i} position={[x, y, z]} rotation={[0, rot, 0]} scale={p.alto}>
              <Figura g={gf} mat={mats.arcilla} pose={pose} sq={sq} />
            </group>
          );
        })}
      </group>
    </>
  );
};

export const BalsaEscena: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ backgroundColor: "#050607" }}>
      <ThreeCanvas width={width} height={height} dpr={2} shadows="soft"
        gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05, outputColorSpace: THREE.SRGBColorSpace }}
        camera={{ fov: 30, position: [0, 9, 9], near: 1, far: 60 }}>
        <Camara t={t} />
        <Fondo k={interpolate(t, [0.6, 2.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) })} />
        <Escena t={t} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
