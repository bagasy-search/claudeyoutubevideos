// rk29a · 7º, 8º y 9º bloque de componentes 3D (29-oct). Cada uno UNA vez en toda la tanda.
import React, { useMemo } from "react";
import * as THREE from "three";
import { H, Stage, Tag } from "./hkit";
import { Studio, Fob3, Car3, Rings3, Wall3, Pouch3, Drawer3, Thief3, Coin3, RB, sm, spr, c01, rnd } from "./studio3d";

type P = { t: number; h: H };
type V = [number, number, number];
const AMB = "#ffb257", RED = "#ff5a4a", ICE = "#8fd3ff", OKC = "#7fd6a0";

const useTxt = (lines: string[], w = 512, hh = 256, bg = "#f6f3ec", fg = "#2a2c31", size = 54, font = "Arial") => useMemo(() => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = hh; const g = cv.getContext("2d")!;
  g.fillStyle = bg; g.fillRect(0, 0, w, hh); g.fillStyle = fg; g.textAlign = "center"; g.font = `bold ${size}px ${font}`;
  lines.forEach((l, i) => g.fillText(l, w / 2, hh / 2 + (i - (lines.length - 1) / 2) * size * 1.25 + size * 0.35));
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}, [lines.join("|"), w, hh, bg, fg, size, font]);

// tubo de luz entre dos puntos con panza (hilo, línea de mapa)
const Thread: React.FC<{ a: V; b: V; lift?: number; wob?: number; k?: number; col?: string; r?: number }> = ({ a, b, lift = 0.6, wob = 0, k = 1, col = AMB, r = 0.012 }) => {
  const geo = useMemo(() => {
    const m = new THREE.Vector3((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + lift, (a[2] + b[2]) / 2 + wob);
    const c = new THREE.QuadraticBezierCurve3(new THREE.Vector3(...a), m, new THREE.Vector3(...b));
    const pts = c.getPoints(60).slice(0, Math.max(2, Math.round(61 * c01(k))));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, r, 8, false);
  }, [a.join(), b.join(), Math.round(lift * 100), Math.round(wob * 100), Math.round(k * 60), r]);
  return <mesh geometry={geo}><meshBasicMaterial color={col} toneMapped={false} /></mesh>;
};

// 31 · la escalera de lo que bloquea: aluminio, lata, bolsa probada, sin pila; en cada escalón se escapa menos onda
export const H3Ladder: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const leak = [1, 0.55, 0.2, 0], sel = Math.min(3, Math.floor(c01((tt - 0.3) / 4.8) * 4));
  const plates = [useTxt(["FOIL"], 256, 96, "#f6f3ec", "#2a2c31", 54), useTxt(["TIN"], 256, 96, "#f6f3ec", "#2a2c31", 54), useTxt(["POUCH"], 256, 96, "#f6f3ec", "#2a2c31", 54), useTxt(["NO BATTERY"], 256, 96, "#f6f3ec", "#2a2c31", 40)];
  const need = useMemo(() => ({ v: 0 }), []); need.v = leak[sel] + (sel < 3 ? (leak[sel + 1] - leak[sel]) * sm(tt, 0.3 + (sel + 1) * 1.2 - 0.4, 0.3 + (sel + 1) * 1.2) : 0);
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0.0, 1.3, 3.9], l: [0.05, 0.65, 0], fov: 38 }, { t: 9, p: [0.4, 1.35, 3.8], l: [0.1, 0.65, 0], arc: 0.04 }]}>
      <Wall3 p={[0, 1.6, -1.2]} s={[8, 3.4, 0.1]} kind="drywall" />
      {[0, 1, 2, 3].map((i) => { const x = -1.35 + i * 0.82, y = 0.15 + i * 0.22, on = c01(spr(tt, 0.1 + i * 1.2, 6, 0.5)); return <group key={i}>
        <RB p={[x, y / 2, 0]} s={[0.76, y, 0.9]} rad={0.03} c={["#8a7a64", "#94836b", "#9e8c72", "#a89679"][i]} r={0.7} />
        <mesh position={[x, y * 0.5, 0.452]}><planeGeometry args={[0.5, 0.12]} /><meshStandardMaterial map={plates[i]} roughness={0.8} /></mesh>
        <group position={[x, y + 0.6 * (1 - on), 0.05]} scale={(0.4 + 0.6 * on) * 1.45}>
          {i === 0 && <group><Fob3 s={0.5} ring={false} /><mesh position={[0, 0.06, 0]} scale={[1.7, 0.45, 1.25]} castShadow><icosahedronGeometry args={[0.12, 1]} /><meshStandardMaterial color="#d6d9de" metalness={1} roughness={0.35} flatShading transparent opacity={0.85} /></mesh></group>}
          {i === 1 && <group><mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.2, 40]} /><meshStandardMaterial color="#b9bec5" metalness={1} roughness={0.3} /></mesh><mesh position={[0, 0.205, 0]}><cylinderGeometry args={[0.135, 0.135, 0.02, 40]} /><meshStandardMaterial color="#c8202a" roughness={0.4} /></mesh></group>}
          {i === 2 && <Pouch3 s={0.45} />}
          {i === 3 && <group><Fob3 s={0.6} open={0.8} batt={false} ring={false} /><Coin3 p={[0.26, 0.02, 0.1]} d={0.12} glow={0} /></group>}
        </group>
        {on > 0.9 && leak[i] > 0 && <mesh position={[x, y + 0.2 + 0.45, 0.05]}><coneGeometry args={[0.04 + 0.42 * leak[i], 0.9, 40, 1, true]} /><meshBasicMaterial color={RED} transparent opacity={(0.12 + 0.3 * leak[i]) * (0.8 + 0.2 * Math.sin(tt * 6 + i))} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>}
        {on > 0.9 && leak[i] > 0 && <Rings3 p={[x, y + 0.2, 0.05]} k={((tt - i * 1.2) % 1.6) * 1.1} n={2} r={0.12 + 0.5 * leak[i]} col={RED} op={0.25 + 0.6 * leak[i]} />}
      </group>; })}
      {/* medidor de aguja: cuánto se escapa */}
      <group position={[1.6, 0.8, -0.7]}>
        <mesh><circleGeometry args={[0.32, 48, 0, Math.PI]} /><meshStandardMaterial color="#f6f3ec" roughness={0.8} /></mesh>
        <mesh position={[0, 0, -0.01]}><circleGeometry args={[0.36, 48, 0, Math.PI]} /><meshStandardMaterial color="#2a2c31" metalness={0.5} roughness={0.4} /></mesh>
        <mesh position={[0.2, 0.06, 0.005]} rotation={[0, 0, 0.5]}><circleGeometry args={[0.12, 24, 0, 0.9]} /><meshBasicMaterial color={RED} /></mesh>
        <group rotation={[0, 0, Math.PI * (1 - need.v) - Math.PI / 2 + 0.0]} position={[0, 0, 0.01]}><mesh position={[0, 0.13, 0]}><boxGeometry args={[0.02, 0.27, 0.01]} /><meshBasicMaterial color="#1a1a1a" /></mesh></group>
      </group>
    </Studio>
  </>;
}}</Stage>;

// 32 · las paredes no son iguales: ladrillo, madera, durlock; la misma onda atraviesa y sale más o menos fuerte
export const H3Walls: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const out = [0.25, 0.6, 1.0], cyc = (tt + 0.6) % 2.4, fin = cyc / 1.0, fout = (cyc - 1.0) / 1.2;
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [2.3, 1.5, 2.9], l: [-0.1, 0.6, -0.2], fov: 42 }, { t: 10, p: [1.9, 1.6, 3.2], l: [-0.1, 0.6, -0.2], arc: 0.05 }]}>
      <Wall3 p={[-3.0, 1.8, -2.4]} s={[16, 3.8, 0.1]} kind="drywall" />
      {(["brick", "wood", "drywall"] as const).map((k, i) => { const x = -1.1 + i * 1.1; return <group key={k}>
        <Wall3 p={[x, 0.65, 0]} s={[0.85, 1.3, 0.16]} kind={k} />
        {fin > 0 && fin < 1 && <Rings3 p={[x, 0.65, 0.12]} k={1 - fin} n={2} r={0.55} col={ICE} rot={[0, 0, 0]} op={0.9} />}
        {fout > 0 && fout < 1 && <Rings3 p={[x, 0.65, -0.12 - 0.5 * fout]} k={fout} n={2} r={0.55 * out[i]} col={i === 2 ? ICE : RED} rot={[0, 0, 0]} op={out[i] * (1 - fout * 0.5)} />}
      </group>; })}
    </Studio>
  </>;
}}</Stage>;

// 33 · siguen casadas: un hilo de luz va del cajón hasta la camioneta lejos; se estira, se curva, nunca se corta
export const H3Married: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const k = sm(tt, 0.2, 1.6), away = sm(tt, 3.0, 7.0), wob = 0.25 * Math.sin(tt * 1.3), lift = 0.7 + 0.5 * away;
  const cz = -1.2 - 1.4 * away, cx = 1.4 + 0.5 * away;
  const ringM = <meshStandardMaterial color="#e8c46a" metalness={1} roughness={0.2} emissive="#7a5a10" emissiveIntensity={0.3} />;
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [-0.3, 1.7, 4.2], l: [0.0, 0.4, -0.8], fov: 42 }, { t: 10, p: [0.0, 1.9, 4.6], l: [0.0, 0.4, -1.3], arc: 0.06 }]}>
      <Wall3 p={[0, 1.6, -4.4]} s={[12, 3.4, 0.1]} kind="drywall" />
      <group position={[-0.9, 0, 0.6]} scale={0.7}><Drawer3 open={0.8}><Fob3 p={[0, 0.02, 0.05]} s={0.9} ring={false} /></Drawer3></group>
      <mesh position={[-0.9, 0.66, 0.66]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.03, 16, 48]} />{ringM}</mesh>
      <Car3 p={[cx, 0, cz]} rot={[0, -1.2, 0]} s={1.0} col="#5a6470" blink={tt > 3 ? (Math.sin(tt * 3) > 0.7 ? 1 : 0) : 0} />
      <mesh position={[cx - 0.2, 0.8, cz + 0.3]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.03, 16, 48]} />{ringM}</mesh>
      <Thread a={[-0.9, 0.66, 0.66]} b={[cx - 0.2, 0.8, cz + 0.3]} lift={lift} wob={wob} k={k} col={AMB} r={0.035} />
    </Studio>
  </>;
}}</Stage>;

// 34 · borrar la perdida: la memoria del auto tiene casilleros de llaves; uno expulsa su llave y se cierra vacío
export const H3Erase: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const pick = sm(tt, 0.2, 0.6), out = c01(spr(tt, 0.7, 5, 0.5)), lid = sm(tt, 1.4, 2.0), flash = Math.max(0, 1 - Math.abs(tt - 2.0) * 4);
  return <>
    <Studio tt={tt} night={0.5} keys={[{ t: 0, p: [0.0, 0.85, 2.7], l: [0, 0.65, 0], fov: 34 }, { t: 10, p: [0.5, 0.9, 2.5], l: [0.15, 0.65, 0], arc: 0.05 }]}>
      <Wall3 p={[0, 1.4, -0.6]} s={[6, 3, 0.1]} kind="drywall" />
      <RB p={[0, 0.6, -0.15]} s={[2.4, 1.0, 0.2]} rad={0.06} c="#1e2228" r={0.4} m={0.4} />
      {[0, 1, 2, 3].map((i) => { const cx = -0.84 + i * 0.56, lost = i === 2; return <group key={i} position={[cx, 0.6, 0]}>
        <RB s={[0.46, 0.7, 0.06]} rad={0.03} c="#0b0f14" r={0.3} e={lost ? RED : AMB} ei={lost ? 0.05 + 0.25 * pick * (1 - lid) + 1.2 * flash : 0.12} />
        {<group position={[0, lost ? 0.9 * out : 0, 0.12 + (lost ? 0.5 * out : 0)]} rotation={[lost ? out * 1.2 : 0, lost ? out * 2.5 : 0, 0]} scale={1}><Fob3 rot={[Math.PI / 2, 0, 0]} s={0.6} ring={false} led={0} /></group>}
        {lost && <RB p={[0, 0.35 - 0.35 * lid, 0.1]} s={[0.46, 0.7 * lid + 0.001, 0.03]} rad={0.02} c="#2a2c31" r={0.35} m={0.5} />}
      </group>; })}
    </Studio>
  </>;
}}</Stage>;

// 35 · vaciar todos los cajones: las llaves caen en montón y vuelan a tres bandejas: auto, casa, ni idea
export const H3Sort: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const N = 12, q = useTxt(["?"], 128, 128, "#3a3d44", "#ffb257", 110);
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0, 2.4, 2.9], l: [0, 0.1, -0.2], fov: 40 }, { t: 10, p: [0.2, 2.3, 2.9], l: [0, 0.1, -0.2], arc: 0.03 }]}>
      <RB p={[0, -0.03, 0]} s={[3.6, 0.06, 2.2]} rad={0.03} c="#c9a77c" r={0.6} />
      {[-1.1, 0, 1.1].map((x, i) => <group key={i}>
        <RB p={[x, 0.03, -0.55]} s={[1.0, 0.06, 0.7]} rad={0.03} c={["#2a2c31", "#3a3d44", "#4a4d55"][i]} r={0.5} />
        {i === 0 && <Car3 p={[x, 0.06, -1.0]} s={0.4} rot={[0, -0.5, 0]} col="#8a929c" />}
        {i === 1 && <group position={[x, 0.06, -1.0]} scale={2}><RB p={[0, 0.08, 0]} s={[0.2, 0.16, 0.16]} c="#c9b28f" r={0.7} /><mesh position={[0, 0.21, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.16, 0.1, 4]} /><meshStandardMaterial color="#6b3a2a" roughness={0.7} /></mesh></group>}
        {i === 2 && <mesh position={[x, 0.3, -1.0]}><planeGeometry args={[0.46, 0.46]} /><meshBasicMaterial map={q} /></mesh>}
      </group>)}
      {Array.from({ length: N }, (_, i) => {
        const drop = c01(spr(tt, 0.3 + i * 0.05, 7, 0.45)), st = 1.0 + i * 0.32, fly = sm(tt, st, st + 0.7), tray = [0, 1, 2, 0, 1, 1, 2, 0, 1, 0, 2, 1][i];
        const px = (rnd(i, 1) - 0.5) * 0.9, pz = 0.45 + (rnd(i, 2) - 0.5) * 0.4, tx = -1.1 + tray * 1.1 + (rnd(i, 3) - 0.5) * 0.5, tz = -0.55 + (rnd(i, 4) - 0.5) * 0.3;
        const bounce = fly >= 1 ? 0.06 * Math.max(0, Math.sin((tt - st - 0.7) * 14)) * Math.exp(-(tt - st - 0.7) * 6) : 0;
        const x = px + (tx - px) * fly, z = pz + (tz - pz) * fly, y = 0.06 + 1.2 * (1 - drop) + 0.55 * Math.sin(Math.PI * fly) + bounce + i * 0.004;
        return <group key={i} position={[x, y, z]} rotation={[0, rnd(i, 5) * 6 + fly * 3, 0]}><Fob3 s={0.42} ring={false} col={["#17181c", "#2a2420", "#1c2024", "#22252b"][i % 4]} /></group>;
      })}
    </Studio>
  </>;
}}</Stage>;

// 36 · la etiqueta es un mapa: ganchos rotulados; de cada rótulo baja un hilo tenso al auto, a la casa, a la camioneta
export const H3HookMap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const L = [useTxt(["SPARE"], 256, 96, "#f6f3ec", "#2a2c31", 50), useTxt(["CAR"], 256, 96, "#f6f3ec", "#2a2c31", 50), useTxt(["TRUCK"], 256, 96, "#f6f3ec", "#2a2c31", 50), useTxt(["GARAGE"], 256, 96, "#f6f3ec", "#2a2c31", 50)];
  const dest: V[] = [[0.75, 0.55, -0.4], [1.25, 0.3, 0.35], [1.95, 0.35, -0.1], [0.85, 0.3, 0.45]];
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0.3, 1.5, 4.8], l: [0.3, 0.65, -0.3], fov: 42 }, { t: 10, p: [0.35, 1.55, 4.9], l: [0.3, 0.65, -0.3], arc: 0.03 }]}>
      <Wall3 p={[0.5, 1.6, -1.6]} s={[9, 3.4, 0.1]} kind="drywall" />
      <Wall3 p={[-0.85, 1.0, -0.3]} s={[1.6, 0.8, 0.06]} kind="wood" />
      {[0, 1, 2, 3].map((i) => { const x = -1.4 + i * 0.37; return <group key={i}>
        <mesh position={[x, 1.15, -0.22]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.12, 8]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.25} /></mesh>
        <mesh position={[x, 1.28, -0.26]}><planeGeometry args={[0.34, 0.13]} /><meshStandardMaterial map={L[i]} roughness={0.7} /></mesh>
        <group position={[x, 0.95, -0.2]} rotation={[Math.PI / 2 - 0.1, 0, 0]}><Fob3 s={0.45} ring={false} /></group>
        <Thread a={[x, 1.26, -0.2]} b={dest[i]} lift={0.15} k={sm(tt, 0.3 + i * 0.6, 1.1 + i * 0.6)} col={RED} r={0.02} />
      </group>; })}
      <group position={[0.75, 0, -0.6]}><RB p={[0, 0.3, 0]} s={[0.6, 0.6, 0.5]} c="#c9b28f" r={0.7} /><mesh position={[0, 0.72, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.48, 0.28, 4]} /><meshStandardMaterial color="#6b3a2a" roughness={0.7} /></mesh><RB p={[0.1, 0.18, 0.26]} s={[0.3, 0.26, 0.02]} c="#e9e3d6" r={0.6} /></group>
      <Car3 p={[1.25, 0, 0.35]} rot={[0, -0.9, 0]} s={0.42} col="#8a929c" />
      <Car3 p={[1.95, 0, -0.1]} rot={[0, -0.9, 0]} s={0.5} col="#5a4636" />
    </Studio>
  </>;
}}</Stage>;

// 37 · la linterna del ladrón: el haz barre debajo del paragolpes y encuentra la cajita imantada
export const H3Flashlight: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const sweep = -0.9 + 1.25 * sm(tt, 0.2, 2.6), found = sm(tt, 2.5, 2.9), tgt = useMemo(() => new THREE.Object3D(), []), beam = useMemo(() => new THREE.Object3D(), []);
  const lp = new THREE.Vector3(1.05, 0.62, 0.55); tgt.position.set(sweep, 0.12, 0.05); tgt.updateMatrixWorld();
  beam.position.copy(lp); beam.lookAt(tgt.position); beam.updateMatrixWorld(); const len = lp.distanceTo(tgt.position);
  const cone = useMemo(() => { const g = new THREE.ConeGeometry(0.13, 1, 32, 1, true); g.translate(0, -0.5, 0); g.rotateX(-Math.PI / 2); return g; }, []);
  return <>
    <Studio tt={tt} night={0.75} photo={0.35} floor="concrete" keys={[{ t: 0, p: [0.6, 0.85, 3.4], l: [0.35, 0.35, -0.3], fov: 40 }, { t: 10, p: [0.4, 0.8, 3.2], l: [0.3, 0.3, -0.3], arc: 0.05 }]}>
      <Car3 p={[0, 0, -0.9]} rot={[0, Math.PI, 0]} s={1.3} col="#3e4650" />
      <primitive object={tgt} />
      <group position={[1.3, 0, 0.75]} rotation={[0, -2.2, 0]} scale={[1, 0.72, 1]}><Thief3 yaw={0} reach={0.75} s={0.62} /></group>
      <spotLight position={[1.05, 0.62, 0.55]} target={tgt} angle={0.16} penumbra={0.4} intensity={40} distance={6} color="#fff2d0" castShadow />
      <primitive object={beam}><group position={[0, 0, -0.08]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.028, 0.22, 20]} /><meshStandardMaterial color="#1c1d21" metalness={0.7} roughness={0.35} /></mesh><mesh position={[0, 0, 0.11]}><circleGeometry args={[0.034, 20]} /><meshBasicMaterial color="#fff6dc" toneMapped={false} /></mesh></group>{[...Array(26)].map((_, j) => { const f = ((rnd(j, 7) + tt * 0.08) % 1); return <mesh key={j} position={[(rnd(j, 8) - 0.5) * 0.22 * f, (rnd(j, 9) - 0.5) * 0.22 * f, -f * len]}><sphereGeometry args={[0.005, 6, 6]} /><meshBasicMaterial color="#fff2d0" transparent opacity={0.7} toneMapped={false} /></mesh>; })}<mesh geometry={cone} scale={[1, 1, len]}><meshBasicMaterial color="#fff2d0" transparent opacity={0.07} depthWrite={false} side={THREE.DoubleSide} /></mesh></primitive>
      <group position={[0.35, 0.16, 0.05]}><RB s={[0.34, 0.12, 0.2]} rad={0.02} c="#2a1412" r={0.4} e={RED} ei={0.9 * found} /><pointLight position={[0, -0.05, 0.15]} intensity={2.5 * found} distance={0.8} color={RED} /></group>
    </Studio>
  </>;
}}</Stage>;

// 38 · el llavero pesado: dos llaves en el mismo aro; un gancho levanta el aro y se van las dos juntas
export const H3Ring: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const hook = sm(tt, 0.1, 0.8), up = c01(spr(tt, 1.0, 5, 0.5)), sw = Math.sin(tt * 3) * 0.25 * up, ry = 0.28 + 0.6 * up;
  const brass = <meshStandardMaterial color="#c9a24a" metalness={1} roughness={0.25} />;
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0, 1.0, 3.0], l: [0, 0.7, 0], fov: 36 }, { t: 10, p: [0.3, 1.05, 2.95], l: [0, 0.72, 0], arc: 0.04 }]}>
      <Wall3 p={[0, 1.4, -1.1]} s={[5, 3, 0.1]} kind="drywall" />
      <RB p={[0, -0.03, 0]} s={[2.4, 0.06, 1.6]} rad={0.03} c="#6b4a2e" r={0.6} />
      <group position={[0, ry + 0.2 + 1.2 * (1 - hook), 0]}>
        <mesh position={[0, 1.0, 0]}><cylinderGeometry args={[0.008, 0.008, 2, 8]} /><meshStandardMaterial color="#2a2c31" metalness={0.6} roughness={0.4} /></mesh>
        <mesh rotation={[0, 0, Math.PI]}><torusGeometry args={[0.06, 0.012, 10, 32, Math.PI * 1.3]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.25} /></mesh>
      </group>
      <group position={[0, ry, 0]}>
        <mesh castShadow><torusGeometry args={[0.16, 0.016, 12, 48]} /><meshStandardMaterial color="#d6d9de" metalness={1} roughness={0.2} /></mesh>
        <group position={[-0.1, -0.15, 0]} rotation={[0, 0, 0.25 + sw]}><group position={[0, -0.18, 0.02]}><Fob3 rot={[Math.PI / 2, 0, 0]} s={0.7} ring={false} /></group></group>
        <group position={[0.1, -0.15, 0]} rotation={[0, 0, -0.25 - sw]} scale={1.6}>
          <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.012, 32]} />{brass}</mesh>
          <mesh position={[0, -0.2, 0]}><boxGeometry args={[0.025, 0.22, 0.01]} />{brass}</mesh>
          {[0, 1, 2].map((j) => <mesh key={j} position={[0.02, -0.15 - j * 0.05, 0]}><boxGeometry args={[0.025, 0.02, 0.01]} />{brass}</mesh>)}
        </group>
      </group>
    </Studio>
  </>;
}}</Stage>;

// 39 · la lata de café: la llave cae dentro, la lata vuelve atrás del diluyente en el estante del garaje
export const H3Can: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const cof = useTxt(["COFFEE"], 512, 200, "#7a2a1e", "#f2e2c0", 80);
  const drop = sm(tt, 0.2, 1.7), bump = tt > 1.7 ? 0.03 * Math.abs(Math.sin((tt - 1.7) * 12)) * Math.exp(-(tt - 1.7) * 5) : 0, back = sm(tt, 3.4, 4.8), slide = sm(tt, 3.4, 4.8);
  const canX = -0.1 + 0.22 * slide, canZ = 0.12 - 0.38 * back;
  return <>
    <Studio tt={tt} floor="concrete" keys={[{ t: 0, p: [-0.1, 1.85, 1.35], l: [0, 1.0, 0], fov: 36 }, { t: 3.2, p: [0.05, 1.8, 1.4], l: [0, 1.0, 0] }, { t: 10, p: [0.35, 1.45, 1.9], l: [0.05, 1.0, -0.1], arc: 0.05 }]}>
      <Wall3 p={[0, 1.4, -0.5]} s={[3, 2.2, 0.06]} kind="drywall" />
      <RB p={[0, 0.8, -0.2]} s={[2.2, 0.05, 0.6]} rad={0.01} c="#8a6a48" r={0.7} />
      <group position={[canX, 0.83, canZ]} scale={1.35}>
        <mesh position={[0, 0.17, 0]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.34, 40, 1, true]} /><meshStandardMaterial map={cof} metalness={0.4} roughness={0.4} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.13, 0.13, 0.02, 40]} /><meshStandardMaterial color="#3a2a20" roughness={0.6} /></mesh>
        <mesh position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.006, 8, 40]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.3} /></mesh>
        <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.125, 40]} /><meshStandardMaterial color="#2a1c14" roughness={0.9} /></mesh>
        {drop >= 1 && <group position={[0, 0.05 + bump, 0]} rotation={[0, 0.6, 0]}><Fob3 s={0.32} ring={false} led={0.6} /></group>}
      </group>
      {drop < 1 && <group position={[canX, 0.83 + 0.07 + 0.9 * (1 - drop), canZ]} rotation={[drop * 3.2, 0.6, 0.3 * (1 - drop)]}><Fob3 s={0.43} ring={false} led={0.6} /></group>}
      <group position={[0.3, 0.83, 0.18]} scale={0.95}>
        <mesh position={[0, 0.22, 0]} castShadow><boxGeometry args={[0.24, 0.44, 0.16]} /><meshStandardMaterial color="#d8d4c8" roughness={0.5} metalness={0.3} /></mesh>
        <mesh position={[0.06, 0.47, 0]}><cylinderGeometry args={[0.03, 0.03, 0.06, 16]} /><meshStandardMaterial color="#c8202a" roughness={0.4} /></mesh>
      </group>
    </Studio>
  </>;
}}</Stage>;

// 40 · nunca juntas: dos cuartos separados; en uno la llave duerme en la bolsa, en el otro la llave sin pila
export const H3Apart: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const a = c01(spr(tt, 0.2, 6, 0.5)), b = c01(spr(tt, 0.6, 6, 0.5)), zip = sm(tt, 1.0, 2.2);
  return <>
    <Studio tt={tt} night={0.4} keys={[{ t: 0, p: [-0.6, 2.6, 2.9], l: [0, 0.2, 0], fov: 40 }, { t: 10, p: [0.6, 2.6, 2.9], l: [0, 0.2, 0], arc: 0.08 }]}>
      <RB p={[0, 0.02, 0]} s={[3.0, 0.04, 1.8]} rad={0.01} c="#b9a88a" r={0.8} />
      {[-1.5, 0, 1.5].map((x, i) => <RB key={i} p={[x, 0.35, 0]} s={[0.06, 0.7, 1.8]} rad={0.01} c="#e9e3d6" r={0.8} />)}
      <RB p={[0, 0.35, -0.9]} s={[3.0, 0.7, 0.06]} rad={0.01} c="#e9e3d6" r={0.8} />
      <group position={[-0.75, 0, 0]}>
        <RB p={[0, 0.15, -0.3]} s={[0.5, 0.3, 0.4]} c="#6b4a2e" r={0.6} />
        <group position={[0, 0.3 + 0.5 * (1 - a), -0.15]}><Pouch3 s={0.95} open={1 - zip} /></group>
        <pointLight position={[0, 0.9, 0]} intensity={1.5} distance={2} color="#ffd9a0" />
      </group>
      <group position={[0.75, 0, 0]}>
        <group position={[0, 0.05 + 0.5 * (1 - b), 0.15]}><Fob3 s={1.15} open={0.8} batt={false} ring={false} led={0} /></group>
        <Coin3 p={[0.32, 0.05, 0.45]} d={0.14} glow={0} />
        <pointLight position={[0, 0.9, 0.3]} intensity={1.5} distance={2} color="#ffd9a0" />
      </group>
    </Studio>
    <Tag tt={tt} at={2.6} x={960} y={140} txt="NEVER TOGETHER" col={RED} size={66} />
  </>;
}}</Stage>;

// 41 · la línea del tiempo: del 2000 a hoy, los autos con botón de arranque llegan uno por uno por la ruta
export const H3Era: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const years = ["2000", "2005", "2010", "2015", "2020", "NOW"], tex = years.map((y) => useTxt([y], 256, 96, "#1a1a1a", "#f2ead8", 60));
  return <>
    <Studio tt={tt} floor="concrete" keys={[{ t: 0, p: [1.6, 1.9, 2.9], l: [0, 0.15, -0.9], fov: 40 }, { t: 9, p: [1.3, 2.0, 3.1], l: [0, 0.15, -1.0], arc: 0.03 }]}>
      <RB p={[0, 0.005, -1.8]} s={[1.4, 0.01, 7]} rad={0.002} c="#2a2c31" r={0.8} />
      {[...Array(14)].map((_, j) => <RB key={j} p={[0, 0.012, 1.3 - j * 0.5]} s={[0.04, 0.004, 0.22]} c="#e8d9a8" r={0.6} />)}
      {years.map((y, i) => { const z = 1.0 - i * 0.85, x = i % 2 ? 0.32 : -0.32, k = c01(spr(tt, 0.1 + i * 0.7, 6, 0.5)), btn = i > 0 && k > 0.95, bi = c01((tt - 0.5 - i * 0.7) / 0.6); return <group key={y}>
        <mesh position={[x > 0 ? 0.62 : -0.62, 0.014, z]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.62, 0.24]} /><meshBasicMaterial map={tex[i]} /></mesh>
        {k > 0 && <group position={[x, 0.6 * (1 - k), z]}><Car3 s={0.3} rot={[0, 0, 0]} col={i === 0 ? "#6a6d75" : "#8a929c"} />
          {btn && <mesh position={[0, 0.36, 0]}><sphereGeometry args={[0.03, 12, 12]} /><meshStandardMaterial color="#c8202a" emissive={RED} emissiveIntensity={0.6 * bi} /></mesh>}</group>}
      </group>; })}
    </Studio>
  </>;
}}</Stage>;

// 42 · la pila es la llave de luz: una perilla grande ON/OFF con la pila dentro; baja con peso a OFF
export const H3Switch: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const on = useTxt(["ON"], 256, 128, "#1a1208", "#ffb257", 90), off = useTxt(["OFF"], 256, 128, "#0b0f14", "#8fd3ff", 90);
  const rot = c01(spr(tt, 2.2, 5, 0.45)), lit = 1 - c01((tt - 2.6) / 0.4);
  return <>
    <Studio tt={tt} night={0.3 + 0.3 * (1 - lit)} keys={[{ t: 0, p: [0, 0.85, 3.1], l: [0, 0.78, 0], fov: 32 }, { t: 10, p: [0.45, 0.9, 3.0], l: [0, 0.78, 0], arc: 0.04 }]}>
      <Wall3 p={[0, 1.2, -0.5]} s={[5, 3, 0.1]} kind="drywall" />
      <RB p={[0, 0.75, -0.1]} s={[1.6, 1.3, 0.1]} rad={0.06} c="#2a2c31" r={0.4} m={0.4} />
      <mesh position={[-0.45, 1.2, -0.04]}><planeGeometry args={[0.36, 0.18]} /><meshBasicMaterial map={on} toneMapped={false} transparent opacity={0.25 + 0.75 * lit} /></mesh>
      <mesh position={[0.45, 1.2, -0.04]}><planeGeometry args={[0.36, 0.18]} /><meshBasicMaterial map={off} toneMapped={false} transparent opacity={0.4 + 0.6 * (1 - lit)} /></mesh>
      <group position={[0, 0.66, 0.0]} rotation={[0, 0, 0.8 - 1.6 * rot]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.06]} castShadow><cylinderGeometry args={[0.36, 0.4, 0.24, 64]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.25} /></mesh>
        <RB p={[0, 0.27, 0.2]} s={[0.08, 0.26, 0.06]} rad={0.02} c="#c8202a" r={0.4} />
        <group position={[0, -0.04, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <mesh><cylinderGeometry args={[0.07, 0.07, 0.4, 32]} /><meshStandardMaterial color="#1c1c1c" roughness={0.4} /></mesh>
          <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.071, 0.071, 0.16, 32]} /><meshStandardMaterial color="#d79a2b" metalness={0.6} roughness={0.3} emissive={AMB} emissiveIntensity={0.15 * lit} /></mesh>
          <mesh position={[0, 0.215, 0]}><cylinderGeometry args={[0.025, 0.025, 0.03, 16]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.25} /></mesh>
        </group>
      </group>
      <Fob3 p={[0.95, 0.0, 0.55]} rot={[0, -0.5, 0]} s={0.7} led={lit > 0.5 && Math.sin(tt * 8) > 0 ? 0.8 : 0} dim={1 - lit} />
    </Studio>
  </>;
}}</Stage>;

// 43 · la rutina de la noche: el reloj llega a las 10; cinco cosas salen en orden alrededor de la esfera
export const H3Routine: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const face = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 512; cv.height = 512; const g = cv.getContext("2d")!; g.fillStyle = "#f6f3ec"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.fillStyle = "#2a2c31"; g.textAlign = "center"; g.font = "bold 54px Arial"; for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2; g.fillText(String(i), 256 + Math.sin(a) * 195, 256 - Math.cos(a) * 195 + 18); } const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx; }, []);
  const go = sm(tt, 0.1, 2.0), hrA = -((9 + go) / 12) * Math.PI * 2, mnA = -go * Math.PI * 2;
  const items = [0, 1, 2, 3, 4].map((i) => c01(spr(tt, 0.4 + i * 0.7, 6, 0.5)));
  const ang = [200, 155, 25, -20, -90].map((d) => d * Math.PI / 180);
  return <>
    <Studio tt={tt} night={0.2 + 0.7 * go} keys={[{ t: 0, p: [0, 1.0, 4.0], l: [0, 0.92, 0], fov: 36 }, { t: 10, p: [0.15, 1.0, 3.95], l: [0, 0.92, 0], arc: 0.02 }]}>
      <Wall3 p={[0, 1.3, -0.5]} s={[6, 3, 0.1]} kind="drywall" />
      <group position={[0, 0.95, -0.35]}>
        <mesh><circleGeometry args={[0.5, 64]} /><meshStandardMaterial map={face} roughness={1} metalness={0} envMapIntensity={0} /></mesh>
        <mesh position={[0, 0, -0.02]}><torusGeometry args={[0.51, 0.03, 12, 64]} /><meshStandardMaterial color="#2a2c31" metalness={0.5} roughness={0.3} /></mesh>
        <group rotation={[0, 0, hrA]}><mesh position={[0, 0.13, 0.01]}><boxGeometry args={[0.035, 0.26, 0.01]} /><meshBasicMaterial color="#1a1a1a" /></mesh></group>
        <group rotation={[0, 0, mnA]}><mesh position={[0, 0.19, 0.02]}><boxGeometry args={[0.022, 0.38, 0.01]} /><meshBasicMaterial color="#1a1a1a" /></mesh></group>
      </group>
      {items.map((k, i) => { const r = 0.82, p: V = [Math.cos(ang[i]) * r * 1.3, 0.95 + Math.sin(ang[i]) * r * 0.75, -0.1]; return k <= 0 ? null : <group key={i} position={[p[0] * k, 0.95 + (p[1] - 0.95) * k, p[2]]} scale={k * 1.35}>
        {i === 0 && <Fob3 s={0.55} dim={1} ring={false} rot={[Math.PI / 2 - 0.3, 0, 0]} />}
        {i === 1 && <Pouch3 s={0.42} rot={[0.9, 0, 0]} />}
        {i === 2 && <group scale={0.32} rotation={[0.3, -0.4, 0]}><Drawer3 open={0.6} /></group>}
        {i === 3 && <Coin3 d={0.18} rot={[Math.PI / 2, 0, 0]} glow={0} c="#8f949b" />}
        {i === 4 && <group rotation={[0.5, 0, 0]}><RB s={[0.34, 0.06, 0.24]} rad={0.03} c="#3c5a7a" r={0.95} /><RB p={[0, 0.045, 0]} s={[0.3, 0.04, 0.2]} rad={0.02} c="#4d6e91" r={0.95} /></group>}
      </group>; })}
    </Studio>
  </>;
}}</Stage>;

// 44 · el plano dibujado a mano: una caja por cuarto; cada lugar se marca con X roja o círculo cuando lo nombra
export const H3XMap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const rooms: [number, number, number, number][] = [[-0.6, -0.25, 0.55, 0.45], [0.05, -0.25, 0.7, 0.45], [-0.6, 0.25, 0.55, 0.5], [0.05, 0.25, 0.7, 0.5]];
  const marks: { p: [number, number]; x: boolean; a: number; o: number }[] = [{ p: [-0.42, -0.08], x: true, a: 0.8, o: 0 }, { p: [0.3, -0.08], x: false, a: 1.6, o: 1 }, { p: [-0.42, 0.5], x: false, a: 2.4, o: 2 }, { p: [0.55, 0.5], x: true, a: 3.2, o: 3 }, { p: [0.15, 0.5], x: false, a: 4.0, o: 4 }];
  const line = (x: number, z: number, w: number, d: number, k: number, key: string) => <mesh key={key} position={[x + w * k / 2, 0.012, z]}><boxGeometry args={[w * k, 0.004, d]} /><meshBasicMaterial color="#2a2c31" /></mesh>;
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0.05, 3.0, 1.5], l: [0.05, 0, 0.14], fov: 36 }, { t: 10, p: [0.05, 3.0, 1.5], l: [0.05, 0, 0.14], arc: 0.02 }]}>
      <RB p={[0, -0.03, 0.1]} s={[2.8, 0.06, 2.0]} rad={0.03} c="#7a5a3c" r={0.6} />
      <mesh position={[0.05, 0.003, 0.12]} rotation={[-Math.PI / 2, 0, 0.02]}><planeGeometry args={[1.6, 1.25]} /><meshStandardMaterial color="#f4efe2" roughness={1} metalness={0} envMapIntensity={0} /></mesh>
      {rooms.map(([x, z, w, d], i) => { const k = sm(tt, 0.1 + i * 0.12, 0.5 + i * 0.12); return <group key={i}>
        {line(x, z, w, 0.008, k, "a")}{line(x, z + d, w, 0.008, k, "b")}
        <mesh position={[x, 0.012, z + d * k / 2]}><boxGeometry args={[0.008, 0.004, d * k]} /><meshBasicMaterial color="#2a2c31" /></mesh>
        <mesh position={[x + w, 0.012, z + d * k / 2]}><boxGeometry args={[0.008, 0.004, d * k]} /><meshBasicMaterial color="#2a2c31" /></mesh>
      </group>; })}
      {marks.map((m, i) => { const ob = sm(tt, 0.6 + i * 0.12, 1.0 + i * 0.12); return <group key={"o" + i} position={[m.p[0], 0.0, m.p[1]]} scale={ob * 1.8}>
        {m.o === 0 && <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.035, 0.008, 8, 24, Math.PI * 1.4]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.3} /></mesh>}
        {m.o === 1 && <RB p={[0, 0.03, 0]} s={[0.14, 0.06, 0.1]} rad={0.01} c="#8a6a48" r={0.7} />}
        {m.o === 2 && <mesh position={[0, 0.02, 0]} rotation={[Math.PI, 0, 0]}><sphereGeometry args={[0.06, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#e9e3d6" roughness={0.5} side={THREE.DoubleSide} /></mesh>}
        {m.o === 3 && <RB p={[0, 0.04, 0]} s={[0.1, 0.08, 0.1]} rad={0.01} c="#6b4a2e" r={0.7} />}
        {m.o === 4 && <RB p={[0, 0.05, 0]} s={[0.16, 0.1, 0.06]} rad={0.01} c="#a89679" r={0.7} />}
      </group>; })}
      {marks.map((m, i) => { const k = c01(spr(tt, m.a, 8, 0.45)); return k <= 0 ? null : <group key={i} position={[m.p[0] + 0.07, 0.13 + 0.4 * (1 - k), m.p[1] - 0.06]} scale={c01(k * 1.5)}>
        {m.x ? <><mesh rotation={[-Math.PI / 2, 0, 0.8]}><planeGeometry args={[0.15, 0.024]} /><meshBasicMaterial color={RED} /></mesh><mesh rotation={[-Math.PI / 2, 0, -0.8]}><planeGeometry args={[0.15, 0.024]} /><meshBasicMaterial color={RED} /></mesh></>
          : <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.05, 0.07, 40]} /><meshBasicMaterial color={OKC} /></mesh>}
      </group>; })}
    </Studio>
    <Tag tt={tt} at={0.8} x={420} y={130} txt="X = IT OPENED" col={RED} size={62} />
    <Tag tt={tt} at={1.6} x={1500} y={130} txt="O = STAYED LOCKED" col={OKC} size={62} />
  </>;
}}</Stage>;

// 45 · la entrada de al lado: una fila de casas; el ladrón camina, frena frente a la tuya y sigue de largo
export const H3NextDrive: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const x = -2.4 + 1.6 * sm(tt, 0.0, 2.6) + 3.4 * sm(tt, 4.2, 8.0), stopped = tt > 2.6 && tt < 4.2, mine = 1;
  return <>
    <Studio tt={tt} night={1} floor="concrete" keys={[{ t: 0, p: [-2.4, 0.95, 4.7], l: [-2.4, 0.55, -0.2], fov: 38 }, { t: 2.6, p: [-0.8, 0.95, 4.7], l: [-0.8, 0.55, -0.2] }, { t: 4.2, p: [-0.6, 0.95, 4.7], l: [-0.6, 0.55, -0.2] }, { t: 8, p: [2.3, 0.95, 4.7], l: [2.3, 0.55, -0.2] }]}>
      {[-2.4, -0.8, 0.8, 2.4].map((hx, i) => <group key={i} position={[hx, 0, -1.2]}>
        <RB p={[0, 0.4, 0]} s={[1.1, 0.8, 0.8]} c={["#c9b28f", "#b9a88a", "#d0bc98", "#a89679"][i]} r={0.8} />
        <mesh position={[0, 1.0, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.85, 0.45, 4]} /><meshStandardMaterial color="#5a3a2a" roughness={0.8} /></mesh>
        <mesh position={[0.25, 0.45, 0.41]}><planeGeometry args={[0.22, 0.2]} /><meshBasicMaterial color={i === mine ? "#1c2230" : "#ffcf7a"} toneMapped={false} /></mesh>
        <Car3 p={[0, 0, 0.95]} rot={[0, 0.15, 0]} s={0.5} col={i === mine ? "#8a929c" : "#5a6470"} blink={0} />
        {i === mine && <group position={[0.05, 0.42, 1.05]}><RB s={[0.09, 0.08, 0.04]} rad={0.01} c="#c9a24a" r={0.3} m={0.8} /><mesh position={[0, 0.06, 0]}><torusGeometry args={[0.03, 0.009, 8, 20, Math.PI]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.25} /></mesh></group>}
      </group>)}
      <Thief3 p={[x, 0, 1.45]} yaw={stopped ? Math.PI / 2 + (0.9 * sm(tt, 2.7, 3.1) - 0.9 * sm(tt, 3.8, 4.2)) : Math.PI / 2} step={stopped ? 0 : Math.sin(tt * 7)} reach={0} s={0.5} />
    </Studio>
  </>;
}}</Stage>;

export const HEROES_3E: Record<string, React.FC<P>> = { ladder: H3Ladder, walls: H3Walls, married: H3Married, erase: H3Erase, sort: H3Sort, hookmap: H3HookMap, flashlight: H3Flashlight, ring: H3Ring, can: H3Can, apart: H3Apart, era: H3Era, switch: H3Switch, routine: H3Routine, xmap: H3XMap, nextdrive: H3NextDrive };
