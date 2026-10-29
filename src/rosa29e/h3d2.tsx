// rosa29e · bloque 2 rehecho en 3D: la carne que chisporrotea, la cebolla lenta (y lo que le pasa), el pimentón que se quema.
import React, { useMemo } from "react";
import * as THREE from "three";
import { H, cl } from "./hkit";
import { C3, Stage3, Kitchen, Cam, orbit, Pot, Skillet, Spoon, Meat, Steam, M, V, ease, ramp, spr, rnd, lerp } from "./k3d";

type P = { t: number; h: H };
const mtex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};

// hornalla con llamas azules (k = tamaño de la llama 0..1); titileo lento (≤2 Hz)
export const Burner: React.FC<{ tt: number; p?: V; k?: number; r?: number }> = ({ tt, p = [0, 0, 0], k = 0.5, r = 0.24 }) => (
  <group position={p}>
    <mesh material={M.iron()} receiveShadow><cylinderGeometry args={[r + 0.06, r + 0.08, 0.05, 40]} /></mesh>
    {/* parrilla de hierro sobre la que apoya la sartén */}
    {[0, 1, 2, 3].map((i) => <mesh key={"g" + i} position={[0, 0.17, 0]} rotation={[0, i * Math.PI / 4, 0]} material={M.iron()} castShadow><boxGeometry args={[2 * r + 0.22, 0.018, 0.022]} /></mesh>)}
    {Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2, f = 1 + 0.12 * Math.sin(tt * 9 + i * 1.7), hgt = (0.025 + 0.08 * k) * f;
      return <mesh key={i} position={[Math.cos(a) * r, 0.03 + hgt / 2, Math.sin(a) * r]} rotation={[Math.sin(a) * 0.35 * k, 0, -Math.cos(a) * 0.35 * k]}>
        <coneGeometry args={[0.022 + 0.015 * k, hgt, 10]} /><meshStandardMaterial color="#5aa0ff" emissive="#3c7dff" emissiveIntensity={0.9 + 0.6 * k} transparent opacity={0.8} />
      </mesh>;
    })}
  </group>
);

// trocitos de cebolla (cubitos) sobre una superficie: st 0 cruda blanca → 1 transparente → 2 dorada → 3 quemada
const onionCol = (st: number) => {
  const c = [new THREE.Color("#d9d3c2"), new THREE.Color("#d4cc96"), new THREE.Color("#b47828"), new THREE.Color("#2a1608")];
  const i = Math.min(2, Math.floor(st)), f = st - i; return c[i].clone().lerp(c[i + 1], cl(f));
};
export const Onion: React.FC<{ n?: number; R?: number; st?: number; heap?: number; seed?: number; sz?: number }> = ({ n = 46, R = 0.3, st = 0, heap = 0, seed = 1, sz = 0.04 }) => {
  const col = onionCol(st), op = st < 1 ? lerp(1, 0.62, st) : st < 2 ? lerp(0.62, 0.95, st - 1) : 1;
  return <group>{Array.from({ length: n }, (_, i) => {
    const a = rnd(i, seed) * 6.28, d = Math.sqrt(rnd(i, seed + 1)) * R, y = heap * (1 - d / R) * 0.22 * rnd(i, seed + 3) + sz * 0.4;
    return <mesh key={i} position={[Math.cos(a) * d, y, Math.sin(a) * d]} rotation={[Math.PI / 2 + (rnd(i, 4) - 0.5) * 0.6, (rnd(i, 6) - 0.5) * 0.6, rnd(i, 5) * 6.28]} castShadow>
      <torusGeometry args={[sz * (0.7 + rnd(i, 7) * 0.5), sz * 0.16, 6, 14, Math.PI * (0.7 + rnd(i, 8) * 0.4)]} />
      <meshPhysicalMaterial color={col} roughness={0.45} clearcoat={0.3} transparent={op < 1} opacity={op} />
    </mesh>;
  })}</group>;
};

// ───────── 1 · SUENA: el bife cae a la sartén y el aceite salta en gotas; ondas en el aceite desde el golpe
export const SoundWave3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const drop = spr(tt, -0.3, 11, 0.4), hit = 0.0, y = lerp(0.6, 0.06, cl(drop));
    const c = orbit(tt, [0.35, 0.85, 1.05], [0.1, 0.18, 0], 0.3, 0.02);
    return <C3><Cam p={c.p} l={c.l} fov={40} /><Kitchen wall={false} />
      <Burner tt={tt} k={0.75} p={[0, 0.0, 0]} r={0.2} />
      <Skillet p={[0, 0.19, 0]} col="#5b3a14" content={<>
        <Meat seed={13} p={[0, y - 0.06, 0]} r={[0, 0.4, 0]} s={1.2} col="#a33a2c" shine={0.6} />
        {/* gotas de aceite que saltan en arcos (chisporroteo): cada una vive 0,45 s */}
        {tt > hit && Array.from({ length: 26 }, (_, i) => {
          const per = 0.45, ph = ((tt - hit) + rnd(i, 1) * per) % per / per, a = rnd(i, 2) * 6.28 + Math.floor((tt - hit) / per) * 1.3, r0 = 0.16 + rnd(i, 3) * 0.14;
          const out = r0 + ph * 0.12, up = Math.sin(Math.PI * ph) * (0.08 + rnd(i, 4) * 0.12);
          return <mesh key={i} position={[Math.cos(a) * out, up, Math.sin(a) * out]} scale={0.008 + rnd(i, 5) * 0.01}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color="#e8c070" roughness={0.02} clearcoat={1} transmission={0.3} /></mesh>;
        })}
        {tt > hit && [0, 1, 2].map((k) => {
          const ph = ((tt - hit) * 0.9 + k / 3) % 1;
          return <mesh key={k} position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.12 + ph * 0.26}><ringGeometry args={[0.93, 1, 64]} /><meshBasicMaterial color="#fff0c8" transparent opacity={0.8 * (1 - ph) * (1 - ramp(tt, 3.6, 4.6))} /></mesh>;
        })}
      </>} />
      <Steam tt={tt} p={[0, 0.26, 0]} o={0.3 * cl((tt - hit) * 2)} n={12} h={0.9} w={0.25} />
    </C3>;
  }}</Stage3>;
};

// ───────── 2 · LA CEBOLLA LENTA: dos sartenes; a la izquierda fuego alto y la cebolla se quema; a la derecha fuego bajo y se dora. La cámara elige la derecha.
export const Signpost3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const cook = ramp(tt, 0.6, 4.0), pick = ramp(tt, 3.6, 5.6);
    const c = orbit(tt, lv3([0, 0.95, 1.5], [0.3, 0.9, 1.3], pick), lv3([0, 0.25, 0], [0.25, 0.25, 0], pick), 0.12, 0.012);
    return <C3><Cam p={c.p} l={c.l} fov={44} /><Kitchen />
      <Burner tt={tt} k={1.8} p={[-0.55, 0, 0]} r={0.2} />
      <Skillet p={[-0.55, 0.19, 0]} ry={Math.PI} content={<Onion st={cook * 3} seed={2} />} />
      <Steam tt={tt} p={[-0.55, 0.24, 0]} col="#3a3a3a" o={0.45 * cook} n={12} h={1.2} w={0.2} />
      <Burner tt={tt} k={0.05} p={[0.55, 0, 0]} r={0.2} />
      <Skillet p={[0.55, 0.19, 0]} content={<Onion st={cook * 2} seed={5} />} />
      <Steam tt={tt} p={[0.55, 0.24, 0]} o={0.25 * cook} n={10} h={0.8} w={0.2} />
    </C3>;
  }}</Stage3>;
};
const Hourglass: React.FC<{ p: V; k: number }> = ({ p, k }) => (
  <group position={p} scale={1.7}>
    {[0.16, -0.16].map((y) => <mesh key={y} position={[0, y, 0]} material={M.wood("#5a3418")} castShadow><cylinderGeometry args={[0.09, 0.09, 0.02, 24]} /></mesh>)}
    {[1, -1].map((d) => <mesh key={d} position={[0, d * 0.075, 0]} rotation={[d > 0 ? Math.PI : 0, 0, 0]}><coneGeometry args={[0.075, 0.14, 24, 1, true]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.25} roughness={0.05} side={THREE.DoubleSide} /></mesh>)}
    <mesh position={[0, 0.02 + 0.05 * (1 - k), 0]} rotation={[Math.PI, 0, 0]} scale={[1 - k * 0.9, 1 - k * 0.9, 1 - k * 0.9]}><coneGeometry args={[0.06, 0.1, 24]} /><meshStandardMaterial color="#e0b46a" roughness={0.9} /></mesh>
    <mesh position={[0, -0.15 + 0.05 * k, 0]} scale={[0.1 + k * 0.9, 0.1 + k * 0.9, 0.1 + k * 0.9]}><coneGeometry args={[0.065, 0.1, 24]} /><meshStandardMaterial color="#e0b46a" roughness={0.9} /></mesh>
    {k < 0.98 && <mesh position={[0, -0.06, 0]}><cylinderGeometry args={[0.003, 0.003, 0.12, 6]} /><meshStandardMaterial color="#e0b46a" /></mesh>}
  </group>
);
const lv3 = (a: V, b: V, k: number): V => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

// ───────── 3 · CONTRALUZ: la cebolla picada, a fuego bajo, se vuelve TRANSPARENTE (la luz de atrás la atraviesa) y después se dora
export const Backlight3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const st = ramp(tt, 0.4, 3.2) + ramp(tt, 3.6, 5.6);
    const c = orbit(tt, [0.1, 0.55, 0.6], [0, 0.2, 0], 0.25, 0.015);
    return <C3 exposure={0.78} bloom={0.12}><Cam p={c.p} l={c.l} fov={32} /><Kitchen wall={false} />
      {/* la luz de la ventana por detrás, rasante: atraviesa la cebolla cuando se vuelve transparente */}
      <pointLight position={[0, 0.32, -0.6]} intensity={0.7 * cl(st)} distance={2} color="#ffd38a" />
      <Burner tt={tt} k={0.12} p={[0, 0, 0]} r={0.2} />
      <Skillet p={[0, 0.19, 0]} content={<Onion n={70} R={0.33} st={st} seed={9} sz={0.05} />} />
      <Steam tt={tt} p={[0, 0.24, 0]} o={0.2} n={8} h={0.6} w={0.2} />
    </C3>;
  }}</Stage3>;
};

// ───────── 4 · LUPA: una lupa de bronce se desliza sobre la cebolla; adentro de la lente se ven las celdas y el azúcar que se vuelve caramelo
const cellsTex = (k: number) => mtex(512, 512, (g) => {
  const a = new THREE.Color("#f2ecd2").lerp(new THREE.Color("#c97a22"), k), b = new THREE.Color("#fff8e6").lerp(new THREE.Color("#ffcf6a"), k);
  g.fillStyle = "#" + a.getHexString(); g.fillRect(0, 0, 512, 512);
  for (let r = 0; r < 9; r++) for (let c = 0; c < 6; c++) {
    const x = c * 90 + (r % 2) * 45 + 10, y = r * 60;
    g.fillStyle = "#" + b.getHexString(); g.strokeStyle = `rgba(120,80,30,${0.4 + 0.4 * k})`; g.lineWidth = 4;
    g.beginPath(); g.ellipse(x + 40, y + 28, 40, 24, 0.1, 0, 6.3); g.fill(); g.stroke();
    // gotitas de azúcar dentro de cada celda (brillan más con el caramelo)
    for (let s = 0; s < 3; s++) { g.fillStyle = `rgba(255,${230 - 90 * k},${150 - 120 * k},${0.5 + 0.5 * k})`; g.beginPath(); g.arc(x + 22 + s * 16, y + 24 + (s % 2) * 8, 5 + 3 * k, 0, 6.3); g.fill(); }
  }
});
export const Microscope3: React.FC<P> = ({ t, h }) => {
  const tex = useMemo(() => [0, 0.25, 0.5, 0.75, 1].map(cellsTex), []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const slide = spr(tt, 0.3, 6, 0.6), car = ramp(tt, 2.0, 5.2), lx = lerp(0.9, 0.02, cl(slide));
    const c = orbit(tt, [0.0, 0.66, 0.5], [0, 0.07, -0.02], 0.25, 0.015);
    return <C3><Cam p={c.p} l={c.l} fov={34} /><Kitchen wall={false} />
      <Skillet p={[0, 0.02, 0]} content={<Onion n={60} R={0.34} st={0.9 + car} seed={4} sz={0.045} />} />
      <group position={[lx, 0.2, 0.0]} rotation={[-Math.PI / 2 + 0.25, 0, 0]}>
        <mesh material={M.gold()} castShadow><torusGeometry args={[0.15, 0.018, 16, 64]} /></mesh>
        <mesh position={[0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={M.wood("#5a3018")} castShadow><cylinderGeometry args={[0.022, 0.026, 0.2, 16]} /></mesh>
        {/* lo que se ve aumentado adentro de la lente */}
        <mesh position={[0, 0, 0.002]}><circleGeometry args={[0.135, 64]} /><meshStandardMaterial map={tex[Math.min(4, Math.round(car * 4))]} roughness={0.6} /></mesh>
        <mesh position={[-0.05, 0.05, 0.006]}><circleGeometry args={[0.03, 24]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.35} /></mesh>
      </group>
    </C3>;
  }}</Stage3>;
};

// ───────── 5 · SE ACHICA: la olla llena hasta el borde de cebolla cruda; baja y se dora; queda el "fantasma" del volumen de antes
export const Shrink3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const k = (ramp(tt, 0.4, 1.6) + ramp(tt, 2.0, 3.2) + ramp(tt, 3.6, 4.8)) / 3, lvl = lerp(0.5, 0.1, k);
    const c = orbit(tt, [0.25, 1.05, 1.05], [0, 0.35, 0], 0.25, 0.02);
    return <C3><Cam p={c.p} l={c.l} fov={36} /><Kitchen />
      <Pot fill={0} lidOff col="#2a2420" content={<group position={[0, lvl - 0.08, 0]}><Onion n={90} R={0.44} st={k * 1.9} heap={1 - k * 0.6} seed={12} sz={0.055} /></group>} />
      {/* la marca de hasta dónde llegaba: una línea de grasa quemada en la pared de la olla */}
      {[0.5, 0.3, 0.12].map((y, i) => <mesh key={i} position={[0, y, -0.488]}><boxGeometry args={[0.34, 0.03, 0.006]} /><meshStandardMaterial color={k * 3 > i + 0.5 ? "#f0d090" : "#d8cfc0"} emissive="#c08a30" emissiveIntensity={k * 3 > i + 0.5 ? 0.3 : 0} /></mesh>)}
      <Steam tt={tt} p={[0, 0.55, 0]} o={0.2 + 0.2 * k} n={10} h={0.9} />
    </C3>;
  }}</Stage3>;
};

// ───────── 6 · ¿QUIÉN FUE?: Carmen prueba con la cuchara; en la cuchara hay puntitos negros; el foco gira y encuentra la lata de pimentón
const tinTex = () => mtex(1024, 256, (g) => {
  g.fillStyle = "#b8231a"; g.fillRect(0, 0, 1024, 256); g.fillStyle = "#f2d27a"; g.fillRect(0, 26, 1024, 10); g.fillRect(0, 220, 1024, 10);
  g.fillStyle = "#f7ecd0"; g.font = "900 70px Georgia, serif"; g.textAlign = "center"; g.fillText("PIMENTÓN", 512, 152);
});
export const Tongue3: React.FC<P> = ({ t, h }) => {
  const tt0 = useMemo(tinTex, []);
  return <Stage3 t={t} h={h}>{(tt) => {
    // la lata entra deslizando por la mesa, la tapa salta y en vez de polvo rojo sale humo negro: el culpable
    const slide = spr(tt, 0.1, 6, 0.6), pop = spr(tt, 1.4, 8, 0.35), smoke = ramp(tt, 1.5, 2.6);
    const c = orbit(tt, [0.05, 0.75, 1.5], [0, 0.42, 0], 0.15, 0.012);
    return <C3 bloom={0.1}><Cam p={c.p} l={c.l} fov={44} /><Kitchen />
      <group position={[lerp(-1.4, 0, cl(slide)), 0.17, 0]} rotation={[0, Math.PI + 0.4 + (1 - cl(slide)) * 1.5, 0]}>
        <mesh castShadow receiveShadow><cylinderGeometry args={[0.15, 0.15, 0.34, 48]} /><meshStandardMaterial map={tt0} metalness={0.4} roughness={0.35} /></mesh>
        <mesh position={[0, -0.172, 0]} material={M.chrome()}><cylinderGeometry args={[0.152, 0.152, 0.01, 48]} /></mesh>
        {/* la tapa salta y cae al costado */}
        <group position={[lerp(0, 0.26, cl(pop)), 0.18 + Math.max(0, Math.sin(Math.PI * cl(pop))) * 0.18 - cl(pop) * 0.34 * ramp(tt, 1.9, 2.3), 0]} rotation={[0, 0, cl(pop) * 1.4]}>
          <mesh material={M.chrome()} castShadow><cylinderGeometry args={[0.155, 0.155, 0.02, 48]} /></mesh>
        </group>
      </group>
      <Steam tt={tt - 1.5} p={[0, 0.36, 0]} col="#2a2420" o={1.0 * smoke} n={18} h={0.7} w={0.14} />
    </C3>;
  }}</Stage3>;
};

// ───────── 7 · DOS SEGUNDOS: el pimentón cae al aceite y en 2 s pasa de rojo a negro, con humo; el cronómetro de bronce marca 2
const faceTex = () => mtex(256, 256, (g) => {
  g.fillStyle = "#f4ead2"; g.beginPath(); g.arc(128, 128, 126, 0, 6.3); g.fill(); g.strokeStyle = "#2b2118";
  for (let i = 0; i < 60; i++) { const a = i / 60 * 6.28, l = i % 5 ? 10 : 22; g.lineWidth = i % 5 ? 2 : 5; g.beginPath(); g.moveTo(128 + Math.sin(a) * 118, 128 - Math.cos(a) * 118); g.lineTo(128 + Math.sin(a) * (118 - l), 128 - Math.cos(a) * (118 - l)); g.stroke(); }
  g.fillStyle = "#b3241c"; g.font = "900 44px Georgia, serif"; g.textAlign = "center"; g.fillText("2 s", 128, 190);
});
export const Fuse3: React.FC<P> = ({ t, h }) => {
  const ft = useMemo(faceTex, []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const fall = ramp(tt, 0.3, 1.0), burn = cl((tt - 1.1) / 2.0), hand = burn * (2 / 60) * Math.PI * 2 * 7.5;
    const c = orbit(tt, [0.3, 0.85, 1.15], [0.18, 0.2, 0.05], 0.15, 0.015);
    const red = new THREE.Color("#d2361c").lerp(new THREE.Color("#1a0d06"), burn);
    return <C3><Cam p={c.p} l={c.l} fov={34} /><Kitchen wall={false} />
      <Burner tt={tt} k={0.8} p={[0, 0, 0]} r={0.2} />
      <Skillet p={[0, 0.19, 0]} col="#a0661c" content={<>
        {Array.from({ length: 160 }, (_, i) => {
          const a = rnd(i, 1) * 6.28, d = Math.sqrt(rnd(i, 2)) * 0.1 * (0.3 + 0.7 * fall), yy = lerp(0.6 + rnd(i, 3) * 0.3, 0.006 + 0.06 * (1 - d / 0.1) * rnd(i, 4), cl((tt - 0.3 - rnd(i, 5) * 0.4) / 0.5));
          return <mesh key={i} position={[Math.cos(a) * d, yy, Math.sin(a) * d]}><sphereGeometry args={[0.009, 6, 5]} /><meshStandardMaterial color={new THREE.Color("#d2361c").lerp(new THREE.Color("#1a0d06"), cl(burn * 1.8 - (1 - d / 0.1) * 0.8))} roughness={0.9} /></mesh>;
        })}
      </>} />
      <Steam tt={tt} p={[0, 0.24, 0]} col="#2a2622" o={0.6 * burn} n={14} h={1.1} w={0.15} />
      {/* el cronómetro de bronce al costado */}
      <group position={[0.42, 0.18, 0.3]} rotation={[-0.25, -0.2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={M.gold()} castShadow><cylinderGeometry args={[0.15, 0.15, 0.05, 48]} /></mesh>
        <mesh position={[0, 0, 0.026]}><circleGeometry args={[0.135, 48]} /><meshStandardMaterial map={ft} roughness={0.5} /></mesh>
        <mesh position={[0, 0.19, 0]} material={M.gold()}><cylinderGeometry args={[0.022, 0.022, 0.06, 16]} /></mesh>
        <group position={[0, 0, 0.03]} rotation={[0, 0, -hand]}><mesh position={[0, 0.055, 0]}><boxGeometry args={[0.008, 0.11, 0.004]} /><meshStandardMaterial color="#b3241c" /></mesh></group>
      </group>
    </C3>;
  }}</Stage3>;
};
