// rk29e · piezas 3D (kit compartido de rk29b) de la cerradura inteligente (puerta con marco, cerradura con teclado, teléfono, persona, mano, tornillo).
// Se apoyan en studio3d.tsx (RB, Mat, useTex3). Cada componente de heroes3*.tsx sólo las acomoda y las mueve.
import React, { useMemo } from "react";
import * as THREE from "three";
import { RB, Mat, useTex3, type V3 } from "./studio3d";

export const AMB = "#ffb257", RED = "#ff5a4a", ICE = "#8fd3ff", GRN = "#6fe39a";

// textura de lienzo con texto (carteles que SON objetos: calendario, pantalla, chapa)
export const useTxt = (lines: string[], w = 512, hh = 256, bg = "#f6f3ec", fg = "#2a2c31", size = 54, font = "Arial") => useMemo(() => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = hh; const g = cv.getContext("2d")!;
  g.fillStyle = bg; g.fillRect(0, 0, w, hh); g.fillStyle = fg; g.textAlign = "center"; g.font = `bold ${size}px ${font}`;
  lines.forEach((l, i) => g.fillText(l, w / 2, hh / 2 + (i - (lines.length - 1) / 2) * size * 1.25 + size * 0.35));
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}, [lines.join("|"), w, hh, bg, fg, size, font]);

// cerradura inteligente de frente: cuerpo, teclado 3x4 con botones que se prenden, anillo de LED; `bolt` saca el pestillo por el canto
export const Lock3: React.FC<{ p?: V3; rot?: V3; s?: number; led?: number; ledCol?: string; lit?: number[]; glossy?: number[]; bolt?: number; dead?: boolean; crack?: number; glass?: number; children?: React.ReactNode }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, led = 0, ledCol = AMB, lit = [], glossy = [], bolt = 0, dead = false, crack = 0, glass = 0, children }) => (
  <group position={p} rotation={rot} scale={s}>
    <RB p={[0, 0, 0]} s={[0.36, 0.72, 0.1]} rad={0.05} c="#22252b" r={0.35} m={0.4} op={glass > 0 ? 1 - 0.85 * glass : undefined} />
    <RB p={[0, 0, -0.06]} s={[0.4, 0.76, 0.03]} rad={0.02} c="#9aa0a8" r={0.3} m={0.9} />
    {[...Array(12)].map((_, i) => { const r = Math.floor(i / 3), c = i % 3, on = lit.includes(i), gl = glossy.includes(i); return <mesh key={i} position={[-0.09 + c * 0.09, 0.2 - r * 0.09, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.032, 0.032, 0.014, 24]} />
      <meshStandardMaterial color={gl ? "#d8dde4" : "#3a3e46"} roughness={gl ? 0.05 : 0.7} metalness={gl ? 0.9 : 0.1} emissive={dead ? "#000" : on ? AMB : "#0b0d10"} emissiveIntensity={on ? 1.2 : 0.4} toneMapped={!on} transparent={glass > 0} opacity={1 - 0.8 * glass} />
    </mesh>; })}
    <mesh position={[0, -0.24, 0.056]}><ringGeometry args={[0.045, 0.06, 40]} /><meshBasicMaterial color={dead ? "#1a1b1e" : ledCol} transparent opacity={dead ? 1 : 0.25 + 0.75 * led} toneMapped={false} /></mesh>
    <pointLight position={[0, -0.24, 0.2]} intensity={dead ? 0 : led * 0.9} distance={0.9} color={ledCol} />
    <RB p={[0.19 + 0.12 * bolt, 0.05, -0.02]} s={[0.22, 0.07, 0.07]} rad={0.012} c="#c9ced4" r={0.25} m={1} />
    {crack > 0 && <mesh position={[0.02, 0.0, 0.058]} rotation={[0, 0, 0.6]}><planeGeometry args={[0.012, 0.6 * crack]} /><meshBasicMaterial color="#0a0a0a" /></mesh>}
    {children}
  </group>
);

// puerta con marco: bisagra a la izquierda (open 0..1 = hasta 80°), pomo, cerradura opcional; la hoja mira a +z
export const Door3: React.FC<{ p?: V3; rot?: V3; s?: number; open?: number; col?: string; lock?: boolean; led?: number; ledCol?: string; bolt?: number; dead?: boolean; frame?: boolean; knobOld?: boolean }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, open = 0, col = "#7a2a24", lock = true, led = 0, ledCol = AMB, bolt = 0, dead = false, frame = true, knobOld = false }) => {
  const t3 = useTex3();
  return <group position={p} rotation={rot} scale={s}>
    {frame && <>
      <RB p={[-0.5, 1.05, 0]} s={[0.1, 2.2, 0.16]} rad={0.01} c="#efe9dd" r={0.6} />
      <RB p={[0.5, 1.05, 0]} s={[0.1, 2.2, 0.16]} rad={0.01} c="#efe9dd" r={0.6} />
      <RB p={[0, 2.12, 0]} s={[1.1, 0.1, 0.16]} rad={0.01} c="#efe9dd" r={0.6} />
    </>}
    <group position={[-0.45, 0, 0]} rotation={[0, -open * 1.4, 0]}>
      <RB p={[0.45, 1.02, 0]} s={[0.88, 2.02, 0.07]} rad={0.015} c={col} r={0.55} />
      {[0.55, 1.45].map((y, i) => <RB key={i} p={[0.45, y, 0.04]} s={[0.66, 0.7, 0.012]} rad={0.01} c={col} r={0.45} />)}
      <mesh position={[0.8, 0.98, 0.06]}><sphereGeometry args={[0.045, 20, 20]} /><Mat c={knobOld ? "#b08a3a" : "#c9ced4"} m={1} r={knobOld ? 0.45 : 0.25} /></mesh>
      {lock && <Lock3 p={[0.8, 1.22, 0.07]} s={0.36} led={led} ledCol={ledCol} bolt={bolt} dead={dead} />}
    </group>
    <RB p={[0, 0.005, 0.2]} s={[1.2, 0.01, 0.3]} rad={0.004} c="#fff" r={0.8} map={t3.wood} />
  </group>;
};

// teléfono: cuerpo negro, pantalla que se prende (on 0..1) con color o textura
export const Phone3: React.FC<{ p?: V3; rot?: V3; s?: number; on?: number; col?: string; map?: THREE.Texture; body?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, on = 0, col = "#9fc4ff", map, body = "#15161a" }) => (
  <group position={p} rotation={rot} scale={s}>
    <RB p={[0, 0, 0]} s={[0.3, 0.025, 0.6]} rad={0.012} c={body} r={0.25} m={0.3} />
    <mesh position={[0, 0.0135, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.27, 0.56]} />
      {map ? <meshBasicMaterial map={map} color={new THREE.Color(0.15 + 0.85 * on, 0.15 + 0.85 * on, 0.15 + 0.85 * on)} toneMapped={false} /> : <meshBasicMaterial color={new THREE.Color(col).multiplyScalar(0.05 + 0.95 * on)} toneMapped={false} />}
    </mesh>
    {on > 0.05 && <pointLight position={[0, 0.15, 0]} intensity={0.35 * on} distance={0.7} color={col} />}
  </group>
);

// persona simple (cápsulas) con color y transparencia: fantasmas, la señora afuera, el hijo en el sillón
export const Person3: React.FC<{ p?: V3; yaw?: number; s?: number; col?: string; op?: number; sit?: number; step?: number; arm?: number }> = ({ p = [0, 0, 0], yaw = 0, s = 1, col = "#5a6b80", op = 1, sit = 0, step = 0, arm = 0 }) => {
  const m = <meshStandardMaterial color={col} roughness={0.8} transparent={op < 1} opacity={op} depthWrite={op >= 1} />;
  const skin = <meshStandardMaterial color="#d9b49a" roughness={0.7} transparent={op < 1} opacity={op} depthWrite={op >= 1} />;
  return <group position={p} rotation={[0, yaw, 0]} scale={s}>
    <group position={[0, -0.42 * sit, 0]}>
      <mesh position={[0, 0.95, 0]} castShadow={op >= 1}><capsuleGeometry args={[0.19, 0.6, 6, 16]} />{m}</mesh>
      <mesh position={[0, 1.55, 0]} castShadow={op >= 1}><sphereGeometry args={[0.15, 20, 20]} />{skin}</mesh>
      <group position={[0.24, 1.25, 0]} rotation={[-0.15 - 1.3 * arm, 0, 0]}><mesh position={[0, -0.28, 0]}><capsuleGeometry args={[0.06, 0.44, 4, 8]} />{m}</mesh></group>
      <group position={[-0.24, 1.25, 0]} rotation={[0.3 * step, 0, 0]}><mesh position={[0, -0.28, 0]}><capsuleGeometry args={[0.06, 0.44, 4, 8]} />{m}</mesh></group>
    </group>
    {[-0.1, 0.1].map((x, i) => <group key={i} position={[x, 0.6 - 0.2 * sit, 0]} rotation={[sit * -1.45 + (i ? -1 : 1) * 0.45 * step, 0, 0]}><mesh position={[0, -0.28, 0]}><capsuleGeometry args={[0.075, 0.44, 4, 8]} />{m}</mesh></group>)}
  </group>;
};

// mano con dedo índice estirado (apaga teléfonos, barre avisos, pasa la llave)
export const Hand3: React.FC<{ p?: V3; rot?: V3; s?: number; skin?: string; sleeve?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, skin = "#d9b49a", sleeve = "#2c3e5a" }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh position={[0, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.075, 0.08, 0.5, 20]} /><Mat c={sleeve} r={0.85} /></mesh>
    <RB p={[0, 0, 0.1]} s={[0.15, 0.06, 0.18]} rad={0.03} c={skin} r={0.7} />
    <mesh position={[0, 0.005, -0.06]} rotation={[Math.PI / 2, 0, 0]}><capsuleGeometry args={[0.022, 0.12, 4, 10]} /><Mat c={skin} r={0.7} /></mesh>
    {[-0.045, 0.045].map((x, i) => <mesh key={i} position={[x * 1.2, -0.02, 0.01]} rotation={[Math.PI / 2 + 0.9, 0, 0]}><capsuleGeometry args={[0.02, 0.06, 4, 8]} /><Mat c={skin} r={0.7} /></mesh>)}
  </group>
);

// tornillo con rosca (largo L), gira con `spin`
export const Screw3: React.FC<{ p?: V3; rot?: V3; L?: number; spin?: number; c?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], L = 0.3, spin = 0, c = "#c9ced4" }) => (
  <group position={p} rotation={rot}>
    <group rotation={[0, spin, 0]}>
      <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.035, 0.02, 0.02, 24]} /><Mat c={c} m={1} r={0.25} /></mesh>
      <mesh position={[0, -L / 2, 0]}><cylinderGeometry args={[0.011, 0.004, L, 12]} /><Mat c={c} m={1} r={0.3} /></mesh>
      {[...Array(Math.max(2, Math.round(L / 0.03)))].map((_, i) => <mesh key={i} position={[0, -0.02 - i * 0.03, 0]} rotation={[Math.PI / 2, 0, 0.2]}><torusGeometry args={[0.013, 0.003, 4, 12]} /><Mat c={c} m={1} r={0.3} /></mesh>)}
    </group>
  </group>
);

// flecha de fuerza 3D
export const Arrow3: React.FC<{ p?: V3; rot?: V3; L?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], L = 0.8, col = RED }) => (
  <group position={p} rotation={rot}>
    <mesh position={[0, L / 2, 0]}><cylinderGeometry args={[0.04, 0.04, L, 16]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.4} /></mesh>
    <mesh position={[0, L + 0.08, 0]}><coneGeometry args={[0.1, 0.18, 20]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.4} /></mesh>
  </group>
);

// sillón
export const Sofa3: React.FC<{ p?: V3; rot?: V3; s?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, col = "#6b5b4b" }) => (
  <group position={p} rotation={rot} scale={s}>
    <RB p={[0, 0.22, 0]} s={[1.6, 0.3, 0.7]} rad={0.08} c={col} r={0.95} />
    <RB p={[0, 0.5, -0.28]} s={[1.6, 0.5, 0.18]} rad={0.08} c={col} r={0.95} />
    {[-0.84, 0.84].map((x, i) => <RB key={i} p={[x, 0.38, 0]} s={[0.16, 0.42, 0.7]} rad={0.07} c={col} r={0.95} />)}
  </group>
);

// tubo de luz entre dos puntos con panza (enlaces: teléfono → puerta, contraseña → casa)
export const Thread: React.FC<{ a: V3; b: V3; lift?: number; k?: number; col?: string; r?: number }> = ({ a, b, lift = 0.6, k = 1, col = AMB, r = 0.012 }) => {
  const geo = useMemo(() => {
    const m = new THREE.Vector3((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + lift, (a[2] + b[2]) / 2);
    const c = new THREE.QuadraticBezierCurve3(new THREE.Vector3(...a), m, new THREE.Vector3(...b));
    const pts = c.getPoints(60).slice(0, Math.max(2, Math.round(61 * Math.max(0, Math.min(1, k)))));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, r, 8, false);
  }, [a.join(), b.join(), Math.round(lift * 100), Math.round(k * 60), r]);
  return <mesh geometry={geo}><meshBasicMaterial color={col} toneMapped={false} /></mesh>;
};

// pantalla de ajuste con interruptor (on = verde a la derecha / off = gris a la izquierda) y un renglón de texto
export const useSwitchTex = (label: string, on: boolean, w = 512, hh = 1024) => useMemo(() => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = hh; const g = cv.getContext("2d")!;
  g.fillStyle = "#101216"; g.fillRect(0, 0, w, hh);
  g.fillStyle = "#1c1f25"; g.fillRect(30, 380, w - 60, 200);
  g.fillStyle = "#e9ecf1"; g.font = "bold 46px Arial"; g.textAlign = "left"; g.fillText(label, 56, 495);
  const x = w - 170, y = 445; g.fillStyle = on ? "#34c759" : "#4a4e57"; g.beginPath(); g.roundRect(x, y, 120, 70, 35); g.fill();
  g.fillStyle = "#fff"; g.beginPath(); g.arc(on ? x + 85 : x + 35, y + 35, 29, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}, [label, on, w, hh]);

// reloj de arena: k 0..1 = cuánta arena ya cayó
export const Hourglass3: React.FC<{ p?: V3; s?: number; k?: number }> = ({ p = [0, 0, 0], s = 1, k = 0 }) => (
  <group position={p} scale={s}>
    {[0, 0.82].map((y, i) => <RB key={i} p={[0, y, 0]} s={[0.5, 0.06, 0.5]} rad={0.02} c="#7a4a2a" r={0.5} />)}
    {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([x, z], i) => <mesh key={i} position={[x, 0.41, z]}><cylinderGeometry args={[0.018, 0.018, 0.78, 10]} /><Mat c="#7a4a2a" r={0.5} /></mesh>)}
    <mesh position={[0, 0.6, 0]}><coneGeometry args={[0.17, 0.36, 32, 1, true]} /><meshPhysicalMaterial color="#e8f2ff" transmission={0.9} roughness={0.05} thickness={0.1} transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.22, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.17, 0.36, 32, 1, true]} /><meshPhysicalMaterial color="#e8f2ff" transmission={0.9} roughness={0.05} thickness={0.1} transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
    {k < 0.99 && <mesh position={[0, 0.42 + 0.3 * (1 - k) * 0.5 + 0.02, 0]} rotation={[Math.PI, 0, 0]} scale={[Math.max(0.02, 1 - k), Math.max(0.02, 1 - k), Math.max(0.02, 1 - k)]}><coneGeometry args={[0.15, 0.3, 32]} /><Mat c="#e2b56a" r={0.9} /></mesh>}
    {k > 0.01 && <mesh position={[0, 0.06 + 0.13 * Math.sqrt(k), 0]} scale={[Math.sqrt(k), Math.sqrt(k), Math.sqrt(k)]}><coneGeometry args={[0.16, 0.26, 32]} /><Mat c="#e2b56a" r={0.9} /></mesh>}
    {k > 0.01 && k < 0.99 && <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.005, 0.005, 0.24, 6]} /><Mat c="#e2b56a" r={0.9} /></mesh>}
  </group>
);
