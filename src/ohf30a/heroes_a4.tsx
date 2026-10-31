// ohf30a · componentes únicos 22-28: el agua negra como café, la balanza de 100 libras, el filtro magnético que junta el limo,
// el camino fácil del agua por el árbol de caños, el capuchón del detentor, el almanaque de una válvula por día, el aire que circula
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { CShadow, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { BleedKey, Cup, Gauge, IronRad, Pipe, RadH, Tape, dialTex } from "./okit";

const PI = Math.PI;

// ---- 15:40 · COMO CAFÉ FUERTE: del purgador cae un hilo oscuro a la taza; al lado, el vaso de agua limpia para comparar ----
export const HCoffee: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="paper" wallZ={-0.2} bg="#191714" key1={[-0.8, 1.5, 1.2]}
  cam={{ at: [0.0, 0.2, 0], az: [-0.6, 0.45], el: [0.6, 0.38], r: [0.95, 0.8], fov: 32 }}>{(tt) => {
  const fill = eio(tt, 0.5, 3.2), pour = tt > 0.4 && tt < 3.3;
  return <>
    <RadH n={5} w={0.05} h={0.33} p={[-0.08, 0.02, -0.07]} heat={() => 0.15} />
    <mesh position={[0.06, 0.33, -0.01]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.014, 0.014, 0.05, 16]} />{M.brass({ col: "#b8892e" })}</mesh>
    {pour && <mesh position={[0.06, 0.2, 0.01]}><cylinderGeometry args={[0.003, 0.0045, 0.24, 8]} /><meshStandardMaterial color="#2a1a10" roughness={0.1} /></mesh>}
    <Cup p={[0.06, 0, 0.01]} s={1.3} fill={fill} col="#24160c" />
    {/* el vaso de agua limpia */}
    <group position={[-0.16, 0, 0.04]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.04, 0.035, 0.12, 28, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.037, 0.034, 0.085, 28]} />{M.water({ op: 0.5, col: "#cfe8f6" })}</mesh>
    </group>
    <Tape txt="CLEAN" col="#1f4f9a" p={[-0.16, 0.16, 0.04]} w={0.1} k={phys(tt, 1.0, 8, 0.45)} />
    <Tape txt="BLACK WATER = SLUDGE" p={[-0.05, 0.47, -0.195]} rot={[0, 0, 0.02]} w={0.36} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) / 1.0)} />
  </>;
}}</Scene3D>;

// ---- 16:35 · CIEN LIBRAS: el radiador de hierro baja colgado de dos correas sobre la balanza de plataforma; la aguja trepa y se pasa
// de 100, tiembla y se asienta; entra rodando la carretilla ----
const DLB = () => dialTex("lb200", 200, 0, 0, "LB", undefined, "white");
export const HHundredLb: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="oak" wall="plaster" wallZ={-0.42} bg="#1b1815" key1={[-1, 2.2, 1.4]} warm={0.85}
  cam={{ at: [0, 0.45, 0], at1: [0.12, 0.34, 0], az: [-0.5, 0.42], el: [0.22, 0.12], r: [1.25, 1.5], fov: 32 }}>{(tt) => {
  const down = phys(tt, 1.5, 4.0, 0.6), y = (1 - cl(down)) * 0.6, land = cl((tt - 2.0) / 0.5);
  const w = 118 * eio(tt, 2.0, 3.0) + 30 * Math.exp(-Math.max(0, tt - 3) * 1.4) * Math.sin(Math.max(0, tt - 3) * 5.5) * cl((tt - 3) * 5);
  const dolly = eio(tt, 3.9, 5.0), squash = 1 - 0.015 * Math.exp(-Math.max(0, tt - 2.2) * 6) * Math.sin(Math.max(0, tt - 2.2) * 20) * land;
  return <>
    {/* balanza de plataforma con su columna y el reloj */}
    <RBox s={[0.62, 0.06, 0.36]} p={[0, 0.03, 0]} r={0.01}><meshStandardMaterial color="#5d6468" metalness={0.7} roughness={0.45} /></RBox>
    <RBox s={[0.58, 0.006, 0.32]} p={[0, 0.062, 0]} r={0.002}><meshStandardMaterial color="#2a2c2e" roughness={0.9} /></RBox>
    <RBox s={[0.06, 0.5, 0.06]} p={[0.36, 0.25, -0.12]} r={0.01}><meshStandardMaterial color="#5d6468" metalness={0.7} roughness={0.45} /></RBox>
    <Gauge v={Math.max(0, w)} max={200} tx={DLB()} p={[0.36, 0.56, -0.08]} r={0.11} look="chrome" />
    <CShadow p={[0, 0, 0]} s={[0.8, 0.5]} o={0.7} />
    <group position={[-0.02, 0.065 + y, 0]} scale={[1, squash, 1]}><IronRad n={8} w={0.05} h={0.5} heat={() => 0.3} /></group>
    {/* las dos correas que lo bajan (se aflojan al apoyar) */}
    {[-0.16, 0.12].map((x, i) => <RBox key={i} s={[0.03, 1.2, 0.004]} p={[x, 0.065 + y + 0.5 + 0.6, 0.0]} r={0.001}><meshStandardMaterial color="#c8902a" roughness={0.8} transparent opacity={1 - eio(tt, 2.4, 3.0)} /></RBox>)}
    {/* la carretilla que entra rodando */}
    <group position={[lerp(1.1, 0.58, dolly), 0, 0.12]} rotation={[0, 0, 0.18 * (1 - dolly) + 0.05]}>
      {[-0.08, 0.08].map((z, i) => <React.Fragment key={i}>
        <RBox s={[0.022, 0.9, 0.022]} p={[0.0, 0.45, z]} r={0.006}><meshStandardMaterial color="#b3261e" metalness={0.4} roughness={0.4} /></RBox>
        <mesh position={[0.03, 0.05, z * 1.4]} rotation={[PI / 2, 0, -lerp(1.1, 0.62, dolly) / 0.05]}><cylinderGeometry args={[0.05, 0.05, 0.03, 24]} /><meshStandardMaterial color="#1a1a1a" roughness={0.7} /></mesh>
      </React.Fragment>)}
      {[0.25, 0.5, 0.75].map((y2, i) => <RBox key={i} s={[0.018, 0.018, 0.18]} p={[0, y2, 0]} r={0.004}><meshStandardMaterial color="#b3261e" metalness={0.4} roughness={0.4} /></RBox>)}
      <RBox s={[0.12, 0.01, 0.2]} p={[-0.06, 0.01, 0]} r={0.002}>{M.steel({ col: "#9aa1a8" })}</RBox>
    </group>
    <Tape txt="100+ LB" col="#b3261e" p={[0.36, 0.36, -0.088]} w={0.16} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.5)} />
    <Tape txt="TWO PEOPLE + DOLLY" p={[-0.04, 0.032, 0.182]} rot={[0, 0, 0.01]} w={0.36} k={phys(tt, 4.3, 8, 0.45)} rev={cl((tt - 4.3) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- 17:30 · EL FILTRO MAGNÉTICO: el tarro en el caño de retorno, abierto en corte; el limo negro entra y se va pegando a la barra
// imantada hasta cubrirla; al final se saca la barra peluda de barro ----
export const HMagFilter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="plaster" wallZ={-0.22} bg="#17150f" key1={[-0.8, 1.6, 1.3]} warm={0.85}
  cam={{ at: [0, 0.34, 0], at1: [0.0, 0.5, 0], az: [0.6, -0.3], el: [0.18, 0.22], r: [0.8, 1.2], fov: 30 }}>{(tt) => {
  const stick = eio(tt, 0.6, 3.6), lift = eio(tt, 3.8, 5.0) * 0.24, Y = 0.3;
  return <>
    <Pipe a={[-0.6, Y - 0.12, -0.08]} b={[-0.07, Y - 0.12, -0.08]} r={0.022} col="#b87333" />
    <Pipe a={[0.07, Y - 0.12, -0.08]} b={[0.6, Y - 0.12, -0.08]} r={0.022} col="#b87333" />
    {[-0.4, 0.4].map((x, i) => <RBox key={i} s={[0.03, 0.05, 0.14]} p={[x, Y - 0.12, -0.15]} r={0.004}>{M.steel({ col: "#8c9096" })}</RBox>)}
    <group position={[0, Y, -0.08]}>
      <mesh><cylinderGeometry args={[0.07, 0.07, 0.3, 36, 1, true, 0, PI * 1.35]} /><meshStandardMaterial color="#e9edf0" roughness={0.35} side={THREE.DoubleSide} /></mesh>
      <mesh><cylinderGeometry args={[0.07, 0.07, 0.3, 36, 1, true, PI * 1.35, PI * 0.65]} />{M.glass({ op: 0.18 })}</mesh>
      <mesh position={[0, -0.155, 0]}><cylinderGeometry args={[0.072, 0.072, 0.012, 36]} /><meshStandardMaterial color="#d0d5d8" roughness={0.4} /></mesh>
      {/* barra imantada + tapa azul: suben juntas al final */}
      <group position={[0, lift, 0]}>
        <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.075, 0.075, 0.03, 36]} />{M.plastic({ col: "#2f5fa8" })}</mesh>
        <mesh position={[0, 0.19, 0]}><cylinderGeometry args={[0.02, 0.024, 0.03, 6]} />{M.plastic({ col: "#244a86" })}</mesh>
        <mesh><cylinderGeometry args={[0.014, 0.014, 0.28, 16]} />{M.chrome()}</mesh>
        <mesh scale={[1 + stick * 0.9, 1, 1 + stick * 0.9]} visible={stick > 0.01}><cylinderGeometry args={[0.016, 0.016, Math.max(0.001, 0.26 * stick), 16]} /><meshStandardMaterial color="#1c1612" roughness={1} transparent opacity={0.85 * stick} /></mesh>
      </group>
      {/* partículas: entran por el caño y terminan pegadas a la barra (y suben con ella) */}
      {Array.from({ length: 110 }, (_, i) => { const a = 0.4 + rn(i, 1) * 3.0, k = eio(tt, a, a + 0.6), ang = rn(i, 2) * PI * 2, y = -0.12 + rn(i, 3) * 0.24, rr = 0.018 + 0.012 * rn(i, 6);
        const x0 = -0.6 + rn(i, 4) * 0.45, q: [number, number, number] = [lerp(x0, Math.cos(ang) * rr, k), lerp(-0.12, y, k) + lift * k, lerp(0, Math.sin(ang) * rr, k)];
        return <mesh key={i} position={q} visible={tt > a - 0.6}><sphereGeometry args={[0.004 + 0.004 * rn(i, 5), 6, 6]} /><meshStandardMaterial color="#17120e" roughness={1} /></mesh>; })}
    </group>
    <CShadow p={[0, 0, -0.08]} s={[0.3, 0.2]} o={0.4} />
    <Tape txt="CATCHES THE SILT" p={[-0.32, 0.5, -0.215]} rot={[0, 0, 0.02]} w={0.3} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 18:40 · EL CAMINO FÁCIL: un árbol de caños desde la caldera; el agua llena gruesa los radiadores cercanos y llega flaca al último ----
const RX = [-0.35, -0.05, 0.25, 0.55, 0.85];
export const HEasyPath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="oak" wall="plaster" wallZ={-0.25} bg="#1b1815" key1={[-0.4, 2.2, 1.6]} warm={0.85}
  cam={{ at: [0.15, 0.22, 0], az: [-0.25, 0.15], el: [0.4, 0.3], r: [1.95, 1.8], fov: 34 }}>{(tt) => {
  const run = eio(tt, 0.5, 3.5);
  return <>
    <RBox s={[0.18, 0.24, 0.16]} p={[-0.62, 0.12, 0]} r={0.012}><meshStandardMaterial color="#7a2c22" metalness={0.3} roughness={0.5} /></RBox>
    <Pipe a={[-0.53, 0.05, 0.15]} b={[0.9, 0.05, 0.15]} r={0.016} />
    {RX.map((x, i) => { const share = Math.max(0.15, 1 - i * 0.22), heat = 0.12 + 0.85 * share * cl(run * 1.6 - i * 0.18);
      return <group key={i}>
        <Pipe a={[x, 0.05, 0.15]} b={[x, 0.05, 0.03]} r={0.012} />
        <RadH n={5} w={0.035} h={0.18} p={[x, 0.0, 0]} heat={() => heat} />
        {Array.from({ length: Math.round(8 * share) }, (_, j) => { const u = (tt * 0.6 + j / 8) % 1, lim = (x + 0.53) / 1.43;
          return run > 0.05 && <mesh key={j} position={[-0.53 + u * lim * 1.43, 0.05, 0.15 + 0.02]}><sphereGeometry args={[0.008, 8, 8]} /><meshBasicMaterial color="#ff9a4a" toneMapped={false} /></mesh>; })}
      </group>; })}
    <Tape txt="NEAR: HOT" col="#b3261e" p={[-0.28, 0.42, -0.245]} w={0.46} k={phys(tt, 2.0, 8, 0.45)} />
    <Tape txt="FAR: LUKEWARM" col="#1f4f9a" p={[0.6, 0.42, -0.245]} w={0.56} k={phys(tt, 3.0, 8, 0.45)} rev={cl((tt - 3.0) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- 19:40 · EL DETENTOR: en la otra punta del radiador de hierro, el capuchón de plástico salta girando y deja ver el vástago
// hexagonal; la llave entra y gira un cuarto mientras se dibuja el arco ----
export const HLockshield: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="oak" wall="paper" wallZ={-0.2} bg="#191714" key1={[-0.9, 1.5, 1.3]} warm={0.85}
  cam={{ at: [0.2, 0.2, 0], at1: [0.3, 0.17, 0], az: [0.75, 0.12], el: [0.32, 0.2], r: [0.75, 0.48], fov: 32 }}>{(tt) => {
  const pop = cl((tt - 1.6) / 0.9), key = eio(tt, 2.8, 3.4), turn = eio(tt, 3.6, 4.8) * PI / 2, arc = cl((tt - 3.6) / 1.2);
  return <>
    <IronRad n={6} w={0.05} h={0.42} p={[-0.1, 0, -0.02]} valve={false} heat={(i, y) => 0.15 + 0.5 * eio(tt, 4.2, 5.8) * cl(1.2 - y)} />
    <CShadow p={[-0.1, 0, -0.02]} s={[0.45, 0.14]} o={0.6} />
    <Pipe a={[0.07, 0.1, -0.02]} b={[0.28, 0.1, -0.02]} r={0.018} col="#b87333" />
    <Pipe a={[0.32, 0.06, -0.02]} b={[0.32, 0.0, -0.02]} r={0.018} col="#b87333" />
    <group position={[0.32, 0.1, -0.02]}>
      <mesh castShadow><sphereGeometry args={[0.04, 24, 18]} />{M.brass({ col: "#b8892e" })}</mesh>
      <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.024, 0.028, 0.03, 24]} />{M.chrome({ col: "#e6e9ec" })}</mesh>
      <mesh position={[0, 0.07, 0]} rotation={[0, turn, 0]}><cylinderGeometry args={[0.011, 0.011, 0.03, 6]} />{M.brass()}</mesh>
      {/* el capuchón que salta */}
      <group position={[pop * 0.14, 0.07 + Math.sin(pop * PI) * 0.16 - pop * 0.165, pop * 0.1]} rotation={[pop * 4, pop * 6, 0]}>
        <mesh><cylinderGeometry args={[0.027, 0.027, 0.05, 24]} />{M.plastic({ col: "#f2f0ea" })}</mesh>
        <mesh position={[0, 0.026, 0]}><cylinderGeometry args={[0.022, 0.027, 0.004, 24]} />{M.plastic({ col: "#e4e1d8" })}</mesh>
      </group>
      {/* la llave de tubo que entra desde arriba y gira */}
      <group position={[0, 0.09 + 0.14 * (1 - key), 0]} rotation={[0, turn, 0]} visible={key > 0.01}>
        <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.016, 0.016, 0.06, 6]} />{M.steel({ col: "#9aa1a8" })}</mesh>
        <RBox s={[0.16, 0.012, 0.016]} p={[0.07, 0.065, 0]} r={0.004}>{M.steel({ col: "#9aa1a8" })}</RBox>
        <RBox s={[0.06, 0.02, 0.022]} p={[0.13, 0.065, 0]} r={0.008}>{M.rubber({ col: "#c2302a" })}</RBox>
      </group>
      <mesh position={[0, 0.16, 0]} rotation={[-PI / 2, 0, 0]} visible={arc > 0.01}><ringGeometry args={[0.13, 0.142, 48, 1, 0, Math.max(0.001, arc * PI / 2)]} /><meshBasicMaterial color="#6fe39a" toneMapped={false} side={THREE.DoubleSide} /></mesh>
    </group>
    <Tape txt="LOCKSHIELD" p={[0.43, 0.068, -0.174]} rot={[0, 0, 0.01]} w={0.16} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- 20:40 · UNA POR DÍA: el almanaque de pared y la llave de purga en el radiador; cada «día» la llave da su cuarto de vuelta,
// el marcador tacha el casillero y el radiador sale un poco más tibio ----
const CAL_W = 0.36, CAL_H = 0.495;
const calTex = () => tex.text("calNov", 512, 704, (g) => {
  g.fillStyle = "#f4efe3"; g.fillRect(0, 0, 512, 704);
  for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(140,110,70,${0.04 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 704, 3, 3); }
  g.fillStyle = "#a8261e"; g.fillRect(0, 26, 512, 94); g.fillStyle = "#f4efe3"; g.font = "700 64px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("NOVEMBER", 256, 76);
  g.fillStyle = "#555"; g.font = "700 26px Arial"; ["S", "M", "T", "W", "T", "F", "S"].forEach((d, c) => g.fillText(d, c * 73 + 36, 145));
  g.strokeStyle = "#b9b0a0"; g.lineWidth = 2; for (let r = 0; r <= 5; r++) { g.beginPath(); g.moveTo(0, 170 + r * 104); g.lineTo(512, 170 + r * 104); g.stroke(); } for (let c = 0; c <= 7; c++) { g.beginPath(); g.moveTo(c * 73, 170); g.lineTo(c * 73, 690); g.stroke(); }
  g.fillStyle = "#2a2a2a"; g.font = "700 30px Georgia, serif"; g.textAlign = "left"; g.textBaseline = "top";
  for (let d = 1; d <= 30; d++) { const k = d - 1, r = Math.floor(k / 7), c = k % 7; g.fillStyle = c === 0 ? "#a8261e" : "#2a2a2a"; g.fillText(String(d), c * 73 + 8, 170 + r * 104 + 8); }
  // las espirales del anillado
  for (let i = 0; i < 16; i++) { g.fillStyle = "#333"; g.beginPath(); g.arc(24 + i * 31, 12, 6, 0, 6.3); g.fill(); }
});
const cellPos = (d: number): [number, number] => { const k = d - 1, r = Math.floor(k / 7), c = k % 7; return [((c * 73 + 36) / 512 - 0.5) * CAL_W, (0.5 - (170 + r * 104 + 58) / 704) * CAL_H]; };
const DAYS = [3, 4, 5, 6];
export const HOneADay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="oak" wall="plaster" wallZ={-0.3} bg="#1b1916" key1={[-0.5, 1.6, 1.2]} warm={0.75}
  cam={{ at: [-0.1, 0.48, -0.22], at1: [0.02, 0.38, -0.26], az: [-0.42, 0.12], el: [0.08, 0.06], r: [0.55, 1.12], fov: 32 }}>{(tt) => {
  const T = [0.9, 1.95, 3.0, 4.05], done = T.filter((x) => tt > x + 0.35).length;
  const turn = T.reduce((acc, x) => acc + cl(phys(tt, x, 11, 0.4)), 0) * PI / 2;
  const cur = Math.min(3, T.findIndex((x) => tt < x + 0.95) < 0 ? 3 : T.findIndex((x) => tt < x + 0.95));
  const n = 7, w = 0.05, L = n * w * 1.12, rx = -0.42, bx = rx + L / 2 + w * 0.12 + 0.016, by = 0.07 + 0.5 - 0.02 - 0.0185 * 0.9 * 2;
  const [cx, cy] = cellPos(DAYS[cur]), calX = 0.2, calY = 0.4, mk = cl((tt - T[cur] - 0.3) / 0.5);
  return <>
    <IronRad n={n} w={w} h={0.5} p={[rx, 0, -0.24]} heat={(i, y) => 0.12 + 0.13 * done * (1 - 0.3 * y)} />
    {/* la llave en el purgador, dando su cuarto de vuelta por día */}
    <group position={[bx + 0.004, by + 0.0, -0.24]} rotation={[turn, PI, 0]}><BleedKey s={2.0} /></group>
    {/* el almanaque colgado del clavo */}
    <group position={[calX, calY, -0.296]} rotation={[0, 0, 0.012 * Math.sin(tt * 1.3)]}>
      <mesh position={[0, CAL_H / 2 + 0.02, 0.004]}><cylinderGeometry args={[0.004, 0.004, 0.012, 8]} />{M.steel()}</mesh>
      <mesh castShadow receiveShadow><boxGeometry args={[CAL_W, CAL_H, 0.004]} /><meshStandardMaterial map={calTex()} roughness={0.9} /></mesh>
      {DAYS.map((d, i) => { const [x, y] = cellPos(d), a = cl((tt - T[i] - 0.3) / 0.22), b = cl((tt - T[i] - 0.52) / 0.22);
        return <group key={d} position={[x, y, 0.004]}>
          <mesh rotation={[0, 0, PI / 4]} scale={[1, Math.max(0.001, a), 1]} position={[0, 0, 0]}><boxGeometry args={[0.008, 0.07, 0.001]} /><meshStandardMaterial color="#c0261e" roughness={0.5} /></mesh>
          <mesh rotation={[0, 0, -PI / 4]} scale={[1, Math.max(0.001, b), 1]} position={[0, 0, 0.0005]}><boxGeometry args={[0.008, 0.07, 0.001]} /><meshStandardMaterial color="#c0261e" roughness={0.5} /></mesh>
        </group>; })}
      {/* el marcador que tacha */}
      <group position={[cx + 0.03 * (mk - 0.5) - 0.03, cy + 0.065 + 0.02 * Math.sin(mk * PI * 2), 0.05]} rotation={[0.5, 0.2, -0.6]}>
        <mesh><cylinderGeometry args={[0.009, 0.009, 0.12, 14]} /><meshStandardMaterial color="#c0261e" roughness={0.4} /></mesh>
        <mesh position={[0, -0.068, 0]}><coneGeometry args={[0.006, 0.016, 10]} /><meshStandardMaterial color="#222" /></mesh>
        <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.0095, 0.0095, 0.03, 14]} /><meshStandardMaterial color="#f2f2f2" roughness={0.4} /></mesh>
      </group>
    </group>
    <CShadow p={[rx, 0, -0.23]} s={[0.5, 0.16]} o={0.5} />
    <Tape txt="ONE VALVE · ONE DAY" p={[0.282, 0.196, -0.288]} rot={[0, 0, 0.02]} w={0.2} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- 21:10 · DEJALO RESPIRAR (r4): el sofá en primer plano, pegado al radiador: la cinta de aire caliente sube, CHOCA contra
// el respaldo y se enrosca para atrás; el sofá se corre y la cinta pasa por arriba y cruza el cuarto ----
const ribbonPts = (blk: number, x: number): THREE.Vector3[] => {
  const B = [[0, 0.46, -0.33], [0, 0.56, -0.3], [0, 0.6, -0.25], [0, 0.55, -0.21], [0, 0.6, -0.3], [0, 0.66, -0.4]];
  const F = [[0, 0.46, -0.33], [0, 0.66, -0.3], [0, 0.82, -0.12], [0, 0.84, 0.18], [0, 0.72, 0.45], [0, 0.52, 0.7]];
  return B.map((b, i) => new THREE.Vector3(x + 0.03 * Math.sin(i + x * 9), lerp(F[i][1], b[1], blk), lerp(F[i][2], b[2], blk)));
};
export const HAirflow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="oak" wall="sage" wallZ={-0.46} bg="#1b1815" key1={[-1.2, 2.0, 1.4]} warm={0.85}
  cam={{ at: [0, 0.4, -0.05], at1: [0, 0.44, 0.05], az: [1.0, 0.72], el: [0.2, 0.24], r: [1.45, 1.75], fov: 34 }}>{(tt) => {
  const slide = eio(tt, 3.1, 4.1), grow = eio(tt, 0.3, 1.6), blk = 1 - slide, hit = grow * blk;
  return <>
    <RadH n={9} h={0.44} p={[0, 0, -0.35]} heat={() => 0.92} />
    <pointLight position={[0, 0.5, -0.25]} intensity={0.3 * grow} distance={0.9} color="#ff9a55" />
    {/* sofá verde, en primer plano: pegado al radiador y después se corre */}
    <group position={[0, 0, -0.1 + slide * 0.5]}>
      <RBox s={[0.78, 0.24, 0.32]} p={[0, 0.12, 0]} r={0.04}><meshStandardMaterial color="#3f5a3a" roughness={0.9} /></RBox>
      <RBox s={[0.78, 0.36, 0.09]} p={[0, 0.34, -0.13]} r={0.04}><meshStandardMaterial color="#3f5a3a" roughness={0.9} /></RBox>
      {[-1, 1].map((k) => <RBox key={k} s={[0.08, 0.3, 0.32]} p={[k * 0.39, 0.2, 0]} r={0.035}><meshStandardMaterial color="#38512f" roughness={0.9} /></RBox>)}
    </group>
    {/* las cintas de aire caliente */}
    {[-0.24, 0, 0.24].map((x, j) => { const pts = ribbonPts(blk, x), cur = new THREE.CatmullRomCurve3(pts), n = Math.max(2, Math.round(40 * grow));
      const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: n }, (_, i) => cur.getPoint((i / (n - 1)) * Math.max(0.02, grow)))), 40, 0.018, 10, false);
      return <group key={j}>
        <mesh geometry={g} visible={grow > 0.02}><meshStandardMaterial color="#ff8a3a" emissive="#ff7a2a" emissiveIntensity={0.9} transparent opacity={0.6} depthWrite={false} /></mesh>
        {Array.from({ length: 6 }, (_, i) => { const u = ((tt * 0.5 + i / 6 + j * 0.13) % 1) * grow, p = cur.getPoint(u); return <mesh key={i} position={p} visible={grow > 0.05}><sphereGeometry args={[0.022, 10, 8]} /><meshBasicMaterial color="#ffd2a0" toneMapped={false} transparent opacity={0.85} /></mesh>; })}
      </group>; })}
    {/* donde choca: un abanico de remolinos contra el respaldo */}
    {Array.from({ length: 10 }, (_, i) => { const u = (tt * 0.9 + i / 10) % 1, o = 0.35 * hit * (1 - u); return <mesh key={i} position={[(i - 4.5) * 0.07, 0.56 + u * 0.06, -0.24 - u * 0.1]} rotation={[PI / 2, 0, 0]} scale={0.6 + u * 1.5} visible={o > 0.01}><torusGeometry args={[0.03, 0.006, 6, 20]} /><meshBasicMaterial color="#ffb070" transparent opacity={o} depthWrite={false} toneMapped={false} /></mesh>; })}
    <Tape txt="LET IT BREATHE" p={[0.32, 0.74, -0.455]} rot={[0, 0, -0.02]} w={0.5} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.7)} />
  </>;
}}</Scene3D>;
