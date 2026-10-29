// rosa29e · bloque 3 rehecho en 3D: el pimentón en el aceite, la ficha escondida, el fondo dorado que se va por la pileta y que se levanta con vino, el vapor de Carmen, la carne que se vuelve aserrín.
import React, { useMemo } from "react";
import * as THREE from "three";
import { H, cl } from "./hkit";
import { C3, Stage3, Kitchen, Cam, orbit, Pot, Skillet, Spoon, Meat, Steam, M, T, V, ease, ramp, spr, rnd, lerp, rbox } from "./k3d";
import { Burner } from "./h3d2";

type P = { t: number; h: H };
const mtex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const lv3 = (a: V, b: V, k: number): V => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

// ───────── 1 · LA PERILLA: la perilla de la cocina gira a fuego bajo, la llama se achica; la cuchara de pimentón se vuelca y el polvo rojo cae al aceite
export const BurnerDots3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const knob = ramp(tt, 0.1, 1.0), fl = lerp(1, 0.2, knob), pour = ramp(tt, 2.0, 2.8), red = ramp(tt, 2.4, 4.6), mv = ramp(tt, 1.0, 2.0);
    const c = orbit(tt, lv3([0.75, 0.2, 0.95], [0.35, 0.55, 0.95], mv), lv3([0.5, 0.1, 0.4], [0, 0.28, 0], mv), 0.12, 0.012);
    const oil = new THREE.Color("#c99a3a").lerp(new THREE.Color("#c2361c"), red);
    return <C3><Cam p={c.p} l={c.l} fov={36} /><Kitchen wall={false} />
      {/* el frente de la cocina con la perilla */}
      <mesh position={[0, 0.06, 0.42]} geometry={rbox(1.3, 0.12, 0.05, 0.01)} material={M.enamel("#efe9dc")} castShadow receiveShadow />
      <group position={[0.55, 0.08, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={M.chrome()} castShadow><cylinderGeometry args={[0.055, 0.06, 0.035, 32]} /></mesh>
        <group rotation={[0, -knob * 2.4, 0]}><mesh position={[0, 0.022, 0]} material={M.matte("#1d1a18", 0.4)}><boxGeometry args={[0.018, 0.012, 0.09]} /></mesh></group>
      </group>
      <Burner tt={tt} k={fl} p={[0, 0, 0]} r={0.2} />
      <Skillet p={[0, 0.19, 0]} col={"#" + oil.getHexString()} content={<>
        {/* el polvo que ya cayó, una mancha que se esparce en el aceite */}
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.04 + 0.3 * ease(red)}><circleGeometry args={[1, 40]} /><meshStandardMaterial color="#a52814" transparent opacity={0.85 * cl(pour * 2) * (1 - 0.6 * red)} roughness={0.9} /></mesh>
      </>} />
      {/* la cuchara de madera con pimentón se vuelca y el polvo cae en hilo */}
      <group position={[0.12, 0.55, 0.0]} rotation={[0, 0.4, -pour * 1.9]}>
        <Spoon s={0.8} c="#c08a52" />
        {pour < 0.6 && <mesh position={[0, 0.03, -0.22]} scale={[1, 0.4, 1.2]}><sphereGeometry args={[0.06, 20, 12]} /><meshStandardMaterial color="#b8301a" roughness={0.95} /></mesh>}
      </group>
      {pour > 0.2 && tt < 3.6 && Array.from({ length: 180 }, (_, i) => {
        const k = ((tt - 2.1) * 1.6 + rnd(i, 1)) % 1; if (k < 0) return null;
        return <mesh key={i} position={[0.0 + (rnd(i, 2) - 0.5) * 0.06, lerp(0.5, 0.23, k), (rnd(i, 3) - 0.5) * 0.06]}><sphereGeometry args={[0.006, 6, 5]} /><meshStandardMaterial color="#b8301a" roughness={0.95} /></mesh>;
      })}
    </C3>;
  }}</Stage3>;
};

// ───────── 2 · ESPIRAL: plano cenital; la cuchara da vueltas y el pimentón se abre en hebras rojas en espiral que tiñen todo el aceite de rojo brillante; sube un humito dulce
const swirlTex = (k: number) => mtex(512, 512, (g) => {
  const base = new THREE.Color("#c99a3a").lerp(new THREE.Color("#c4321a"), k);
  g.fillStyle = "#" + base.getHexString(); g.fillRect(0, 0, 512, 512);
  for (let a = 0; a < 5; a++) {
    g.strokeStyle = `rgba(150,22,10,${0.85 - 0.5 * k})`; g.lineWidth = 10 + 30 * k; g.lineCap = "round"; g.beginPath();
    for (let s = 0; s < 120; s++) { const r = s * 2.0, th = a * 1.257 + s * 0.09; const x = 256 + Math.cos(th) * r, y = 256 + Math.sin(th) * r; s ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
  }
  g.fillStyle = `rgba(255,220,150,${0.25})`; for (let i = 0; i < 30; i++) { g.beginPath(); g.arc(rnd(i, 1) * 512, rnd(i, 2) * 512, 4 + rnd(i, 3) * 10, 0, 6.3); g.fill(); }
});
export const Marble3: React.FC<P> = ({ t, h }) => {
  const tx = useMemo(() => [0, 0.25, 0.5, 0.75, 1].map(swirlTex), []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const k = ramp(tt, 0.2, 4.6), sp = tt * 2.2, ti = Math.min(4, Math.floor(k * 4.999));
    const c = orbit(tt, [0.05, 1.05, 0.38], [0, 0.2, 0], 0.15, 0.01);
    return <C3><Cam p={c.p} l={c.l} fov={34} /><Kitchen wall={false} />
      <Burner tt={tt} k={0.2} p={[0, 0, 0]} r={0.2} />
      <Skillet p={[0, 0.19, 0]} content={<>
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, -sp * 0.6]}><circleGeometry args={[0.39, 64]} /><meshPhysicalMaterial map={tx[ti]} roughness={0.15} clearcoat={1} clearcoatRoughness={0.05} /></mesh>
      </>} />
      {/* la cuchara gira por el borde, de canto */}
      <group position={[Math.cos(sp) * 0.18, 0.5, Math.sin(sp) * 0.18]} rotation={[0, -sp, 0.0]}>
        <group rotation={[-1.15, 0, 0]}><Spoon s={0.85} c="#b9824c" /></group>
      </group>
      <Steam tt={tt} p={[0, 0.25, 0]} col="#ffe2c4" o={0.25 * k} n={10} h={0.8} w={0.18} />
    </C3>;
  }}</Stage3>;
};

// ───────── 3 · EL LIBRO QUE FALTA: estante con los libros de cocina; uno se desliza afuera y del hueco asoma la ficha escrita a mano de Carmen
const spineTex = (txt: string, col: string) => mtex(128, 512, (g) => {
  g.fillStyle = col; g.fillRect(0, 0, 128, 512); g.fillStyle = "rgba(255,230,170,.85)"; g.fillRect(0, 40, 128, 6); g.fillRect(0, 466, 128, 6);
  g.save(); g.translate(78, 256); g.rotate(-Math.PI / 2); g.font = "700 38px Georgia, serif"; g.textAlign = "center"; g.fillText(txt, 0, 0); g.restore();
});
const noteTex = () => mtex(700, 460, (g) => {
  g.fillStyle = "#e8dcbf"; g.fillRect(0, 0, 700, 460); g.strokeStyle = "rgba(90,70,40,.25)"; g.lineWidth = 2; for (let y = 90; y < 460; y += 46) { g.beginPath(); g.moveTo(20, y); g.lineTo(680, y); g.stroke(); }
  g.fillStyle = "#2c3e70"; g.font = "italic 700 72px Georgia, serif"; g.textAlign = "center"; g.fillText("El fondo dorado", 350, 200); g.font = "italic 48px Georgia, serif"; g.fillText("— Carmen", 470, 320);
});
export const BookGap3: React.FC<P> = ({ t, h }) => {
  const BK = useMemo(() => [["Cocina", "#6b2a1e"], ["Guisos", "#2f4a3a"], ["Postres", "#7a5a1e"], ["Caldos", "#3a3a5a"], ["Salsas", "#5a2a3a"], ["Masas", "#4a3a22"], ["Moles", "#2a4a5a"], ["Tamales", "#6a3a1a"]].map(([a, b]) => spineTex(a, b)), []);
  const nt = useMemo(noteTex, []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const out = ramp(tt, 0.3, 1.3), drop = ramp(tt, 1.3, 1.9), up = spr(tt, 1.9, 7, 0.5);
    const c = orbit(tt, lv3([0.15, 1.08, -0.45], [0.03, 1.15, -0.75], ramp(tt, 1.8, 3.8)), lv3([0, 1.0, -1.78], [0.03, 1.2, -1.78], ramp(tt, 1.8, 3.8)), 0.1, 0.01);
    return <C3><Cam p={c.p} l={c.l} fov={46} /><Kitchen />
      <mesh position={[0, 1.1, -1.875]} geometry={rbox(4, 2.6, 0.02, 0.005)} receiveShadow><meshStandardMaterial map={T.planks()} color="#9a7a5a" roughness={0.85} /></mesh>
      <mesh position={[0, 0.88, -1.72]} geometry={rbox(1.1, 0.03, 0.3, 0.008)} material={M.wood("#5a3820")} castShadow receiveShadow />
      {BK.map((tx, i) => {
        const w = 0.075 + rnd(i, 1) * 0.03, x = -0.42 + i * 0.112, hh = 0.26 + rnd(i, 2) * 0.06, isG = i === 4;
        if (isG && drop >= 1) return null;
        return <mesh key={i} position={[x, 0.895 + hh / 2 - (isG ? 1.2 * drop * drop : 0), -1.74 + (isG ? 0.3 * ease(out) : 0)]} rotation={[isG ? drop * 1.2 : 0, 0, isG ? 0 : (i === 5 ? -0.05 * out : 0)]} castShadow receiveShadow>
          <boxGeometry args={[w, hh, 0.22]} />
          <meshStandardMaterial attach="material-0" color="#efe6d0" roughness={0.9} /><meshStandardMaterial attach="material-1" color="#efe6d0" roughness={0.9} />
          <meshStandardMaterial attach="material-2" color="#e8dfc8" /><meshStandardMaterial attach="material-3" color="#e8dfc8" />
          <meshStandardMaterial attach="material-4" map={tx} roughness={0.7} /><meshStandardMaterial attach="material-5" map={tx} roughness={0.7} />
        </mesh>;
      })}
      {/* la ficha de Carmen sube del hueco */}
      <mesh position={[0.03, lerp(0.92, 1.33, cl(up)), -1.75]} rotation={[0, 0, 0.04]} castShadow><boxGeometry args={[0.36, 0.24, 0.003]} /><meshStandardMaterial map={nt} roughness={0.85} /></mesh>
    </C3>;
  }}</Stage3>;
};

// ───────── 4 · POR LA PILETA: la olla se inclina sobre la pileta de acero; el agua turbia baja con las motitas doradas del fondo y se las lleva el remolino del desagüe
export const Drain3: React.FC<P> = ({ t, h }) => {
  const sinkG = useMemo(() => { const g = new THREE.LatheGeometry([[0.02, 0.0], [0.42, 0.0], [0.46, 0.04], [0.47, 0.3]].map(([x, y]) => new THREE.Vector2(x, y)), 64); return g; }, []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const tilt = ramp(tt, 0.2, 1.2), flow = ramp(tt, 0.9, 1.4) * (1 - ramp(tt, 6.4, 6.9));
    const c = orbit(tt, [0.5, 1.25, 1.35], [0.1, 0.25, -0.1], 0.1, 0.01);
    return <C3><Cam p={c.p} l={c.l} fov={46} /><Kitchen table={false} />
      {/* la canilla de bronce atrás de la pileta */}
      <group position={[-0.05, 0.28, -0.62]}>
        <mesh position={[0, 0.18, 0]} material={M.chrome()} castShadow><cylinderGeometry args={[0.025, 0.03, 0.36, 20]} /></mesh>
        <mesh position={[0, 0.36, 0.13]} rotation={[0, Math.PI / 2, 0]} material={M.chrome()} castShadow><torusGeometry args={[0.13, 0.02, 12, 24, Math.PI]} /></mesh>
        {[-1, 1].map((d) => <mesh key={d} position={[d * 0.11, 0.05, 0]} material={M.chrome()} castShadow><cylinderGeometry args={[0.03, 0.03, 0.06, 16]} /></mesh>)}
      </group>
      {/* mesada y pileta redonda de acero */}
      <mesh position={[0, 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><ringGeometry args={[0.47, 1.6, 64]} /><meshStandardMaterial color="#d8d2c6" roughness={0.5} /></mesh>
      <mesh geometry={sinkG} position={[0, -0.02, 0]} receiveShadow><meshStandardMaterial color="#b9bcc0" metalness={0.9} roughness={0.28} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.05, 32]} /><meshStandardMaterial color="#6a6d70" metalness={0.9} roughness={0.3} /></mesh>
      <mesh position={[0, -0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.03, 24]} /><meshBasicMaterial color="#0a0a0a" /></mesh>
      {/* el agua que se junta y gira */}
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, -tt * 3]}><circleGeometry args={[0.3 * flow + 0.001, 48]} /><meshPhysicalMaterial color="#8a7348" transparent opacity={0.55 * flow} roughness={0.05} clearcoat={1} /></mesh>
      {/* las motitas doradas del fondo, en espiral hacia el desagüe */}
      {flow > 0.05 && Array.from({ length: 40 }, (_, i) => {
        const k = ((tt - 1.0) * 0.45 + rnd(i, 1)) % 1; if (k < 0) return null;
        const r = 0.3 * (1 - k), th = rnd(i, 2) * 6.28 + k * 9;
        return <mesh key={i} position={[Math.cos(th) * r, -0.0 + 0.004, Math.sin(th) * r]} rotation={[-Math.PI / 2, 0, th]}><boxGeometry args={[0.032, 0.02, 0.006]} /><meshStandardMaterial color="#b0701e" metalness={0.2} roughness={0.4} emissive="#5a3a08" emissiveIntensity={0.2} /></mesh>;
      })}
      {/* la olla se inclina desde arriba y el chorro cae */}
      <group position={[0.36, 0.42, -0.16]} rotation={[0, 0, tilt * 1.15]}><Pot s={0.55} fill={0.55 * (1 - 0.6 * flow)} col="#8a7348" lidOff /></group>
      {flow > 0.02 && Array.from({ length: 30 }, (_, i) => {
        const k = ((tt * 1.6) + i / 30) % 1;
        return <mesh key={'w' + i} position={[lerp(0.15, 0.06, k) + (rnd(i, 3) - 0.5) * 0.02, lerp(0.44, 0.0, k * k), lerp(-0.18, -0.06, k)]} scale={[1, 1.8, 1]}><sphereGeometry args={[0.018 * flow, 8, 6]} /><meshPhysicalMaterial color="#9a8458" transparent opacity={0.7} roughness={0.05} clearcoat={1} /></mesh>;
      })}
    </C3>;
  }}</Stage3>;
};

// ───────── 5 · DESGLASAR: el fondo de la olla tiene la costra dorada pegada; cae el chorro de vino, chirría y humea, y la cuchara de madera levanta la costra en escamas
export const Lift3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const pour = ramp(tt, 0.3, 0.7) * (1 - ramp(tt, 1.6, 1.9)), wet = ramp(tt, 0.5, 1.8), scr = ramp(tt, 2.0, 5.2);
    const sx = lerp(-0.3, 0.3, (Math.sin(tt * 2.4) + 1) / 2) * cl(scr * 4), sz = lerp(-0.2, 0.25, scr);
    const c = orbit(tt, [0.05, 1.1, 0.62], [0, 0.08, 0], 0.15, 0.015);
    return <C3><Cam p={c.p} l={c.l} fov={36} /><Kitchen wall={false} />
      <Pot fill={0} col={"#" + new THREE.Color("#5a3414").lerp(new THREE.Color("#6a1e22"), wet * 0.7).getHexString()} lidOff content={<>
        {/* la costra: placas doradas pegadas al fondo */}
        {Array.from({ length: 90 }, (_, i) => {
          const a = rnd(i, 1) * 6.28, d = Math.sqrt(rnd(i, 2)) * 0.42, px = Math.cos(a) * d, pz = Math.sin(a) * d;
          const hit = scr > 0 && pz < sz && Math.abs(px - sx) < 0.2 ? 1 : 0, lift = hit ? cl((sz - pz) * 4) : 0;
          return <mesh key={i} position={[px + lift * 0.05, 0.004 + lift * 0.06, pz]} rotation={[-Math.PI / 2 + lift * 1.2, 0, a]} castShadow><circleGeometry args={[0.018 + rnd(i, 3) * 0.022, 5]} /><meshStandardMaterial color={["#6a3a14", "#8a4e1c", "#5a2e10", "#7a4418"][i % 4]} roughness={0.7} side={THREE.DoubleSide} /></mesh>;
        })}
        {/* el vino que corre por el fondo */}
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05 + 0.4 * wet}><circleGeometry args={[1, 40]} /><meshPhysicalMaterial color="#5a0f18" transparent opacity={0.6 * wet} roughness={0.05} clearcoat={1} /></mesh>
      </>} />
      {/* el chorro de vino en arco desde una taza */}
      <group position={[0.45, 0.85, 0.05]} rotation={[0, 0, 1.2 * cl(pour * 3)]}>
        <mesh castShadow><cylinderGeometry args={[0.07, 0.055, 0.12, 32, 1, true]} /><meshStandardMaterial color="#efe9dc" roughness={0.3} side={THREE.DoubleSide} /></mesh>
      </group>
      {pour > 0.05 && Array.from({ length: 24 }, (_, i) => { const k = ((tt * 1.8) + i / 24) % 1; return <mesh key={i} position={[lerp(0.38, 0.1, k), 0.85 - 0.8 * k * k, 0.05]}><sphereGeometry args={[0.016, 8, 6]} /><meshPhysicalMaterial color="#6a0f1c" roughness={0.05} clearcoat={1} /></mesh>; })}
      <Steam tt={tt} p={[0, 0.1, 0]} o={0.5 * wet * (1 - scr * 0.5)} n={12} h={0.9} w={0.25} />
      {scr > 0 && <group position={[sx, 0.3, sz]} rotation={[0.9, 0, 0]}><Spoon s={0.9} c="#b9824c" /></group>}
    </C3>;
  }}</Stage3>;
};

// ───────── 6 · EL VAPOR DE CARMEN: contraluz de la ventana; el vapor de la olla sube y por un momento dibuja el perfil de una señora con su rodete; después se deshace
const silhouette = (n: number) => {
  // perfil mirando a la derecha: cabeza, rodete atrás, nariz, mentón, cuello y hombro
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const u = i / n, s = rnd(i, 7);
    if (u < 0.45) { const a = s * 6.28; pts.push([Math.cos(a) * 0.17, 0.62 + Math.sin(a) * 0.2]); }
    else if (u < 0.6) { const a = s * 6.28; pts.push([-0.2 + Math.cos(a) * 0.08, 0.7 + Math.sin(a) * 0.08]); }
    else if (u < 0.68) { pts.push([0.17 + s * 0.05, 0.6 - s * 0.05]); }
    else if (u < 0.8) { pts.push([-0.04 + (s - 0.5) * 0.12, 0.38 - s * 0.14]); }
    else { pts.push([-0.35 + s * 0.6, 0.2 - Math.abs(s - 0.4) * 0.15]); }
  }
  return pts;
};
export const SteamGhost3: React.FC<P> = ({ t, h }) => {
  const P0 = useMemo(() => silhouette(120), []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const form = ramp(tt, 1.0, 2.6) * (1 - ramp(tt, 4.4, 5.8));
    const c = orbit(tt, [0.0, 1.0, 1.95], [0, 1.0, 0], 0.08, 0.008);
    return <C3><Cam p={c.p} l={c.l} fov={50} /><Kitchen warm={0.6} wall={false} dark={0.6} />
      <mesh position={[0, 1.6, -1.875]}><planeGeometry args={[14, 5]} /><meshStandardMaterial map={T.planks()} color="#4a3a2c" roughness={0.9} /></mesh>
      <pointLight position={[0.2, 1.2, -1.4]} intensity={2.4} distance={4} color="#ffd9a0" />
      {/* la ventana detrás, la luz que hace brillar el vapor */}
      <mesh position={[0.1, 1.2, -1.84]}><planeGeometry args={[1.0, 0.9]} /><meshBasicMaterial color="#ffe6b8" /></mesh>
      {[-1, 0, 1].map((k) => <mesh key={k} position={[0.1 + k * 0.5, 1.2, -1.83]}><boxGeometry args={[0.04, 0.94, 0.02]} /><meshStandardMaterial color="#4a3220" /></mesh>)}
      <mesh position={[0.1, 1.2, -1.83]}><boxGeometry args={[1.04, 0.04, 0.02]} /><meshStandardMaterial color="#4a3220" /></mesh>
      <Pot s={0.8} fill={0.8} col="#8a4a20" lidOff />
      <Steam tt={tt} p={[0, 0.45, 0]} o={0.2 * (1 - form * 0.8)} n={8} h={1.2} w={0.2} />
      {P0.map(([x, y], i) => {
        const k = ((tt * 0.25 + rnd(i, 1)) % 1), fx = Math.sin(i * 2.1 + tt * 0.6) * 0.3 * k, fy = 0.45 + k * 1.3;
        const px = lerp(fx, x, form), py = lerp(fy, 0.6 + y * 1.3, form), sc = lerp(0.18 + k * 0.4, 0.1, form);
        return <sprite key={i} position={[px, py, 0.1 + rnd(i, 3) * 0.05]} scale={[sc, sc, sc]}><spriteMaterial map={T.soft()} color="#fff4e2" transparent opacity={0.1 + 0.4 * form} depthWrite={false} /></sprite>;
      })}
    </C3>;
  }}</Stage3>;
};

// ───────── 7 · ASERRÍN: un trozo de carne magra demasiado cocida, hecho de fibras; el tenedor lo aprieta y se desarma en hebras secas que caen como aserrín
export const Sawdust3: React.FC<P> = ({ t, h }) => {
  const F = 150;
  return <Stage3 t={t} h={h}>{(tt) => {
    const press = ramp(tt, 1.0, 1.6), crumb = ramp(tt, 1.5, 3.6), dry = ramp(tt, 0.0, 1.0);
    const col = new THREE.Color("#8a4a32").lerp(new THREE.Color("#8c7a66"), dry);
    const c = orbit(tt, [0.3, 0.5, 0.7], [0, 0.1, 0], 0.15, 0.01);
    return <C3><Cam p={c.p} l={c.l} fov={40} /><Kitchen wall={false} />
      <mesh position={[0, 0.02, 0]} geometry={rbox(0.8, 0.04, 0.55, 0.02)} material={M.wood("#c99a6a")} castShadow receiveShadow />
      {Array.from({ length: F }, (_, i) => {
        const ga = rnd(i, 11) * 6.28, gr = Math.sqrt(rnd(i, 12)) * 0.5, gx = Math.cos(ga) * gr, gy = Math.sin(ga) * gr * 0.8, f = cl((crumb - rnd(i, 1) * 0.5) * 2);
        const fall = f * f, x = gx * 0.22 + (rnd(i, 2) - 0.5) * 0.3 * fall, z = (rnd(i, 3) - 0.5) * 0.3 * fall, y = 0.1 + gy * 0.1 * (1 - 0.3 * press) - fall * (0.1 + gy * 0.1) + 0.0;
        return <mesh key={i} position={[x, Math.max(0.045, y), z]} rotation={[Math.PI / 2 + f * rnd(i, 4) * 2, f * rnd(i, 5) * 3, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.009, lerp(0.22, 0.05 + rnd(i, 6) * 0.05, f), 6]} /><meshStandardMaterial color={col.clone().multiplyScalar(0.85 + rnd(i, 13) * 0.3)} roughness={0.98} />
        </mesh>;
      })}
      {/* el polvillo seco que queda en la tabla */}
      {Array.from({ length: 90 }, (_, i) => crumb > rnd(i, 9) * 0.8 && <mesh key={'d' + i} position={[(rnd(i, 1) - 0.5) * 0.5, 0.043, (rnd(i, 2) - 0.5) * 0.36]}><boxGeometry args={[0.008, 0.004, 0.006]} /><meshStandardMaterial color="#9a8670" roughness={1} /></mesh>)}
      <group position={[0.02, lerp(0.55, 0.22, press) + crumb * 0.05, 0]} rotation={[0, 0.4, 0.15]}>
        <mesh position={[0, 0.32, 0]} material={M.chrome()} castShadow><boxGeometry args={[0.05, 0.5, 0.014]} /></mesh>
        <mesh position={[0, 0.05, 0]} material={M.chrome()} castShadow><boxGeometry args={[0.1, 0.05, 0.014]} /></mesh>
        {[-0.036, -0.012, 0.012, 0.036].map((x) => <mesh key={x} position={[x, -0.06, 0]} material={M.chrome()} castShadow><boxGeometry args={[0.011, 0.18, 0.012]} /></mesh>)}
      </group>
    </C3>;
  }}</Stage3>;
};
