// rosa29e · bloque 4 en 3D: la harina cruda, el surco que no se cierra, el limón, lo que se evapora, la ventana, el cubito, la grasa fría.
// Cada pieza = UN objeto real que hace la idea, en la cocina de Rosa.
import React, { useMemo } from "react";
import * as THREE from "three";
import { H, cl } from "./hkit";
import { C3, Stage3, Kitchen, Cam, orbit, Pot, Skillet, Spoon, Fork, Steam, Bubbles, Plate, M, T, V, ease, ramp, spr, rnd, lerp, rbox } from "./k3d";
import { Burner } from "./h3d2";

type P = { t: number; h: H };
const mtex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const lumpGeo = (r: number, seed: number) => {
  const g = new THREE.IcosahedronGeometry(r, 4); const a = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < a.count; i++) { const x = a.getX(i), y = a.getY(i), z = a.getZ(i), n = 1 + 0.16 * Math.sin(x * 40 + seed) * Math.cos(y * 33 + seed) + 0.08 * Math.sin(z * 61); a.setXYZ(i, x * n, y * n * 0.82, z * n); }
  g.computeVertexNormals(); return g;
};

// ───────── 1 · ENGRUDO: en el plato de Antonio, el tenedor arrastra una bola blanca al borde; se parte y adentro es harina cruda que larga polvo
export const Lumps3: React.FC<P> = ({ t, h }) => {
  const g = useMemo(() => lumpGeo(0.07, 3), []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const push = ramp(tt, 1.2, 2.6), split = spr(tt, 3.0, 7, 0.5), dust = ramp(tt, 3.0, 4.2);
    const bx = lerp(0, 0.3, push);
    const c = orbit(tt, [0.15, 0.75, 0.75], [0.12, 0.05, 0], 0.15, 0.01);
    return <C3 bloom={0.08} exposure={0.85}><Cam p={c.p} l={c.l} fov={40} /><Kitchen />
      <Plate s={1.7} col="#7a3e1e" />
      {/* trozos del guiso alrededor */}
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.22 + rnd(i, 1) * 0.3, 0.1, -0.2 + rnd(i, 2) * 0.35]} rotation={[rnd(i, 3), rnd(i, 4), 0]} castShadow><boxGeometry args={[0.07, 0.04, 0.06]} /><meshPhysicalMaterial color={i % 3 ? "#6a3020" : "#d0782a"} roughness={0.4} clearcoat={0.6} /></mesh>)}
      {/* la bola de harina cruda: dos mitades que se abren */}
      {[-1, 1].map((d) => <group key={d} position={[bx + d * 0.04 * cl(split), 0.15, 0.02]} rotation={[0, 0, d * 0.5 * cl(split)]}>
        <mesh geometry={g} castShadow><meshStandardMaterial color="#ece4d2" roughness={0.95} /></mesh>
      </group>)}
      {split > 0.05 && <mesh position={[bx, 0.15, 0.03]} rotation={[0, 0, Math.PI / 2]} scale={[1, cl(split), 1]}><circleGeometry args={[0.062, 32]} /><meshStandardMaterial color="#f8f4ea" roughness={1} side={THREE.DoubleSide} /></mesh>}
      <Steam tt={tt * 0.6} p={[bx, 0.16, 0.03]} col="#f2ede2" o={0.7 * dust * (1 - ramp(tt, 5.0, 6.2))} n={10} h={0.35} w={0.08} />
      {/* el tenedor de Antonio la empuja */}
      <Fork p={[bx - 0.13, 0.12, 0.05]} r={[0, 0, Math.PI / 2 + 0.25]} s={0.7} />
    </C3>;
  }}</Stage3>;
};

// ───────── 2 · EL SURCO: la cuchara pasa por el caldo espeso; el surco queda abierto y se cierra despacio
export const PartSea3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const drag = ramp(tt, 0.4, 1.5), close = ramp(tt, 2.0, 6.0), sx = lerp(-0.3, 0.3, drag);
    const len = sx + 0.3, w = 0.07 * (1 - close);
    const c = orbit(tt, [0.0, 0.95, 0.75], [0, 0.05, 0], 0.15, 0.01);
    return <C3 bloom={0.08}><Cam p={c.p} l={c.l} fov={40} /><Kitchen />
      <Skillet p={[0, 0.0, 0]} s={1.1} />
      {/* el caldo espeso llena la sartén */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.43, 64]} /><meshPhysicalMaterial color="#6a2e12" roughness={0.12} clearcoat={1} /></mesh>
      {/* el surco: se ve el fondo oscuro y los dos bordes brillantes, y se cierra despacio */}
      {len > 0.01 && w > 0.002 && <group position={[-0.3 + len / 2, 0.061, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[len, w]} /><meshStandardMaterial color="#231a16" roughness={0.6} /></mesh>
        {[-1, 1].map((d) => <mesh key={d} position={[0, 0.004, d * w / 2]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.007, 0.007, len, 10]} /><meshPhysicalMaterial color="#8a4018" roughness={0.08} clearcoat={1} /></mesh>)}
      </group>}
      <Spoon p={[sx + 0.02, 0.2, -0.05]} r={[-1.2, 0, 0]} s={0.8} />
    </C3>;
  }}</Stage3>;
};

// ───────── 3 · EL LIMÓN: cae un limón, se parte en dos, una mitad se exprime y las gotas caen al guiso con ondas
const lemonCut = () => mtex(256, 256, (g) => {
  g.fillStyle = "#f2e28a"; g.beginPath(); g.arc(128, 128, 126, 0, 6.3); g.fill(); g.fillStyle = "#f7f0c8"; g.beginPath(); g.arc(128, 128, 112, 0, 6.3); g.fill();
  for (let i = 0; i < 10; i++) { const a0 = i / 10 * 6.28 + 0.05, a1 = (i + 1) / 10 * 6.28 - 0.05; g.fillStyle = "#f0d860"; g.beginPath(); g.moveTo(128, 128); g.arc(128, 128, 104, a0, a1); g.closePath(); g.fill(); }
  g.fillStyle = "#f7f0c8"; g.beginPath(); g.arc(128, 128, 12, 0, 6.3); g.fill();
});
export const Lemon3: React.FC<P> = ({ t, h }) => {
  const ct = useMemo(lemonCut, []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const fall = spr(tt, 0.4, 8, 0.4), cut = spr(tt, 2.2, 7, 0.5), sq = ramp(tt, 2.9, 3.6) * (1 - ramp(tt, 4.6, 5.2));
    const ly = lerp(0.98, 0.7, cl(fall));
    const c = orbit(tt, [0.1, 1.2, 1.6], [0, 0.55, 0], 0.12, 0.01);
    return <C3 bloom={0.1}><Cam p={c.p} l={c.l} fov={42} /><Kitchen />
      <Pot fill={0.8} col="#7a3a1a" lidOff />
      <group position={[0, 0.42, 0]}><Bubbles tt={tt} R={0.38} n={6} size={0.025} rate={0.5} col="#8a4a20" /></group>
      {/* las dos mitades del limón */}
      {[-1, 1].map((d) => <group key={d} position={[d * 0.07 * cl(cut) + (d > 0 ? 0.12 * cl(cut) : -0.04 * cl(cut)), ly + (d > 0 ? 0.04 * cl(cut) : 0), 0]} rotation={[0, 0, d * Math.PI / 2 + (d > 0 ? -0.6 * cl(cut) : 0.2 * cl(cut))]} scale={d > 0 ? [1 - sq * 0.25, 1 + sq * 0.15, 1 - sq * 0.25] : [1, 1, 1]}>
        <mesh castShadow><sphereGeometry args={[0.09, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#f0c824" roughness={0.45} clearcoat={0.5} side={THREE.DoubleSide} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.09, 40]} /><meshPhysicalMaterial map={ct} roughness={0.2} clearcoat={1} side={THREE.DoubleSide} /></mesh>
      </group>)}
      {/* las gotas */}
      {sq > 0.1 && [0, 1, 2, 3].map((i) => { const k = ((tt - 3.0) * 1.4 + i * 0.25) % 1; return <mesh key={i} position={[0.17, lerp(ly - 0.06, 0.42, k * k), 0]} scale={[0.6, 1.2, 0.6]}><sphereGeometry args={[0.014, 12, 8]} /><meshPhysicalMaterial color="#f8f0a0" roughness={0.02} clearcoat={1} transparent opacity={0.85} /></mesh>; })}
      {/* ondas donde caen */}
      {[0, 1].map((i) => { const k = ((tt - 3.3) * 0.9 + i * 0.5) % 1; return tt > 3.3 ? <mesh key={'o' + i} position={[0.17, 0.425, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.02 + k * 0.12, 0.026 + k * 0.12, 40]} /><meshBasicMaterial color="#e8c88a" transparent opacity={0.5 * (1 - k)} /></mesh> : null; })}
      <Steam tt={tt} p={[0, 0.5, 0]} o={0.2} n={8} h={0.8} />
    </C3>;
  }}</Stage3>;
};

// ───────── 4 · SE EVAPORA: olla de vidrio de costado; el caldo baja y deja un anillo blanco de sal en la pared
export const Evap3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const k = ramp(tt, 0.5, 4.6), lvl = lerp(0.42, 0.17, k), salt = ramp(tt, 1.2, 4.0);
    const c = orbit(tt, [0.0, 0.85, 1.35], [0, 0.4, -0.1], 0.12, 0.01);
    const R = 0.4, th0 = Math.PI * 0.5, thL = Math.PI; // media olla: la mitad de atrás (cortada hacia nosotros)
    return <C3 bloom={0.1}><Cam p={c.p} l={c.l} fov={40} /><Kitchen />
      <Burner tt={tt} k={0.9} r={0.24} />
      <group position={[0, 0.18, 0]}>
        {/* la cara del corte: el caldo visto de frente y los cantos de hierro */}
        <mesh position={[0, 0.015 + lvl / 2, 0.001]}><planeGeometry args={[2 * R - 0.004, lvl]} /><meshPhysicalMaterial color="#7a3e16" roughness={0.2} clearcoat={1} /></mesh>
        <mesh position={[0, 0.015 + (0.42 + lvl) / 2, 0.0]}><planeGeometry args={[2 * R - 0.004, Math.max(0.001, 0.42 - lvl)]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.0} /></mesh>
        {[-1, 1].map((d) => <mesh key={d} position={[d * (R + 0.0125), 0.27, 0]} material={M.iron()}><boxGeometry args={[0.028, 0.54, 0.01]} /></mesh>)}
        <mesh position={[0, 0.0, 0]} material={M.iron()}><boxGeometry args={[2 * R + 0.05, 0.03, 0.01]} /></mesh>
        {/* pared de hierro: afuera y adentro, y el canto del corte */}
        <mesh position={[0, 0.27, 0]} material={M.iron()} castShadow receiveShadow><cylinderGeometry args={[R + 0.025, R + 0.025, 0.54, 64, 1, true, th0, thL]} /></mesh>
        <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[R, R, 0.54, 64, 1, true, th0, thL]} /><meshStandardMaterial color="#3a3532" roughness={0.6} side={THREE.BackSide} /></mesh>
        <mesh position={[0, 0.0, 0]} material={M.iron()}><cylinderGeometry args={[R + 0.025, R + 0.025, 0.03, 64, 1, false, th0, thL]} /></mesh>
        {/* el caldo en corte */}
        <mesh position={[0, 0.015 + lvl / 2, 0]}><cylinderGeometry args={[R - 0.002, R - 0.002, lvl, 64, 1, false, th0, thL]} /><meshPhysicalMaterial color="#8a4a1e" roughness={0.12} clearcoat={1} side={THREE.DoubleSide} /></mesh>
        <group position={[0, 0.017 + lvl, 0]} rotation={[0, 0, 0]}><Bubbles tt={tt} R={0.3} n={9} size={0.03} rate={1.0} col="#a05a24" /></group>
        {/* la costra de sal: banda blanca gruesa desde el nivel de antes hasta el de ahora */}
        <mesh position={[0, 0.015 + (0.42 + lvl) / 2, 0]}><cylinderGeometry args={[R - 0.004, R - 0.004, Math.max(0.001, 0.42 - lvl), 64, 1, true, th0, thL]} /><meshStandardMaterial color="#efe8dc" roughness={1} transparent opacity={0.55 * salt} side={THREE.BackSide} /></mesh>
        <mesh position={[0, 0.435, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[R - 0.006, 0.012, 8, 64, Math.PI]} /><meshStandardMaterial color="#ffffff" roughness={1} transparent opacity={salt} /></mesh>
      </group>
      <Steam tt={tt} p={[0, 0.2 + lvl, -0.1]} o={0.45} n={12} h={1.0} w={0.25} />
    </C3>;
  }}</Stage3>;
};

// ───────── 5 · LA VENTANA: los postigos de madera se abren con inercia y entra un haz de sol con laurel, limón y pimienta flotando hacia la olla
export const Shutters3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const o = spr(tt, 0.4, 5, 0.35), beam = ramp(tt, 0.7, 1.6);
    const c = orbit(tt, [0.15, 1.2, -0.5], [0, 1.2, -1.85], 0.12, 0.01);
    return <C3 bloom={0.2}><Cam p={c.p} l={c.l} fov={50} /><Kitchen />
      {/* el vano de la ventana con cielo cálido */}
      <mesh position={[0, 1.3, -1.9]}><planeGeometry args={[0.8, 0.9]} /><meshBasicMaterial map={T.planks()} color={new THREE.Color("#9ac0d8").lerp(new THREE.Color("#ffe2a8"), beam).getStyle()} /></mesh>
      {[[-0.43, 1.3, 0.06, 0.98], [0.43, 1.3, 0.06, 0.98], [0, 1.8, 0.92, 0.06], [0, 0.82, 0.98, 0.08]].map(([x, y, w, hh], i) => <mesh key={i} position={[x, y, -1.83]} geometry={rbox(w, hh, 0.08, 0.01)} material={M.wood("#6b4426")} castShadow />)}
      {/* los dos postigos, bisagra en el marco */}
      {[-1, 1].map((d) => <group key={d} position={[d * 0.4, 1.3, -1.79]} rotation={[0, d * -1.9 * o, 0]}>
        <mesh position={[-d * 0.2, 0, 0]} geometry={rbox(0.4, 0.88, 0.035, 0.008)} castShadow><meshStandardMaterial map={T.planks()} color="#3f7a6a" roughness={0.7} /></mesh>
        {[-0.25, 0, 0.25].map((y) => <mesh key={y} position={[-d * 0.2, y, 0.02]} castShadow><boxGeometry args={[0.36, 0.04, 0.01]} /><meshStandardMaterial color="#356a5c" roughness={0.7} /></mesh>)}
      </group>)}
      {/* el haz de sol */}
      <mesh position={[0, 0.85, -0.95]} rotation={[0.62, 0, 0]}><boxGeometry args={[0.75, 0.9, 2.0]} /><meshBasicMaterial color="#ffe6a8" transparent opacity={0.16 * beam} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
      <spotLight position={[0, 1.4, -1.7]} target-position={[0, 0.3, 0]} angle={0.5} penumbra={0.6} intensity={6 * beam} color="#ffdca0" castShadow />
      {/* lo que flota en el haz: hojas de laurel, rodajas de limón, granos de pimienta */}
      {Array.from({ length: 14 }, (_, i) => {
        const k = ((tt - 1.0) * 0.18 + rnd(i, 1)) % 1; if (tt < 1.0) return null;
        const p: V = [(rnd(i, 2) - 0.5) * 0.6, lerp(1.35, 0.65, k) + Math.sin(tt + i) * 0.03, lerp(-1.6, -0.5, k)];
        const ty = i % 3;
        return <group key={i} position={p} rotation={[tt * 0.5 + i, tt * 0.4 + i * 2, 0]}>
          {ty === 0 && <mesh scale={[1, 0.38, 1]} castShadow><circleGeometry args={[0.045, 20]} /><meshStandardMaterial color="#5a7a3a" roughness={0.6} side={THREE.DoubleSide} /></mesh>}
          {ty === 1 && <mesh castShadow><cylinderGeometry args={[0.035, 0.035, 0.008, 24]} /><meshStandardMaterial color="#f2d64a" roughness={0.4} /></mesh>}
          {ty === 2 && <mesh castShadow><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#2a1a10" roughness={0.8} /></mesh>}
        </group>;
      })}
    </C3>;
  }}</Stage3>;
};

// ───────── 6 · EL CUBITO: el papel dorado se abre en cuatro solapas; al lado crece una montaña de sal
export const Cube3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const open = ramp(tt, 0.4, 1.4), salt = ramp(tt, 1.8, 4.2);
    const c = orbit(tt, [0.1, 0.3, 0.48], [0.04, 0.06, 0], 0.15, 0.01);
    const S = 0.09;
    return <C3 bloom={0.12} exposure={0.85}><Cam p={c.p} l={c.l} fov={40} /><Kitchen />
      {/* el cubito marrón */}
      <mesh position={[-0.12, S * (1 - 0.55 * salt) / 2 + 0.003, 0]} scale={1 - 0.55 * salt} geometry={rbox(S, S, S, 0.008)} castShadow><meshStandardMaterial color="#8a5a22" roughness={0.9} /></mesh>
      {/* el papel: base + cuatro solapas que se abren hacia afuera */}
      <mesh position={[-0.12, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[S + 0.01, S + 0.01]} /><meshStandardMaterial color="#d8b04a" metalness={0.9} roughness={0.35} side={THREE.DoubleSide} /></mesh>
      {[0, 1, 2, 3].map((i) => <group key={i} position={[-0.12, 0.002, 0]} rotation={[0, i * Math.PI / 2, 0]}>
        <group position={[0, 0, (S + 0.01) / 2]} rotation={[lerp(-Math.PI / 2, 0.35, open), 0, 0]}>
          <mesh position={[0, 0, S / 2 + 0.005]} rotation={[-Math.PI / 2, 0, 0]} castShadow><planeGeometry args={[S + 0.01, S + 0.01, 6, 6]} /><meshStandardMaterial color="#e2b84e" metalness={0.9} roughness={0.3 + 0.1 * Math.sin(i)} side={THREE.DoubleSide} /></mesh>
        </group>
      </group>)}
      {/* la montaña de sal que crece, y los granos que caen sobre ella */}
      <mesh position={[0.14, 0.036 * salt, 0]} scale={[0.6 * salt, 0.6 * salt, 0.6 * salt]} castShadow receiveShadow><coneGeometry args={[0.13, 0.12, 48]} /><meshStandardMaterial color="#f6f3ee" roughness={0.95} /></mesh>
      {salt > 0 && salt < 1 && Array.from({ length: 24 }, (_, i) => { const k = ((tt * 1.3) + rnd(i, 1)) % 1; return <mesh key={i} position={[0.14 + (rnd(i, 2) - 0.5) * 0.04, lerp(0.4, 0.072 * salt, k), (rnd(i, 3) - 0.5) * 0.05]}><boxGeometry args={[0.006, 0.006, 0.006]} /><meshStandardMaterial color="#ffffff" /></mesh>; })}
    </C3>;
  }}</Stage3>;
};

// ───────── 7 · LA GRASA FRÍA: sobre el guiso frío se forma una capa blanca; la cuchara la rompe y levanta una placa
export const FatCap3: React.FC<P> = ({ t, h }) => {
  const plate = useMemo(() => { const s = new THREE.Shape(); for (let i = 0; i <= 14; i++) { const a = i / 14 * Math.PI * 2, r = 0.12 * (0.8 + 0.3 * rnd(i, 4)); i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); } return new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2 }); }, []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const fat = ramp(tt, 0.4, 2.0), lift = ramp(tt, 2.6, 4.0), down = ramp(tt, 2.0, 2.6);
    const c = orbit(tt, [0.1, 1.3, 1.15], [0, 0.35, 0], 0.15, 0.01);
    const top = 0.08 + 0.75 * 0.42;
    return <C3 bloom={0.08} exposure={0.85}><Cam p={c.p} l={c.l} fov={40} /><Kitchen />
      <Pot fill={0.75} col="#6a3018" lidOff />
      {/* la capa blanca que se forma */}
      <mesh position={[0, top + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[lift > 0 ? 0.13 : 0, 0.49, 64]} /><meshStandardMaterial color="#f0ebe0" roughness={0.85} transparent opacity={0.95 * fat} /></mesh>
      {/* la placa que levanta la cuchara */}
      <group position={[0, lerp(top + 0.004, top + 0.3, lift), lerp(0, 0.1, lift)]} rotation={[-Math.PI / 2 + lift * 0.3, 0, 0]}>
        <mesh geometry={plate} castShadow><meshStandardMaterial color="#f2ede2" roughness={0.8} transparent opacity={fat} /></mesh>
      </group>
      <Spoon p={[0, lerp(top + 0.25, top + 0.02, down) + lift * 0.29, lerp(0.35, 0.3, down) + lift * 0.1]} r={[0.35 - lift * 0.1, 0, 0]} s={0.7} />
    </C3>;
  }}</Stage3>;
};
