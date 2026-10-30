// lch29e · componentes únicos 8-14 (el ruedo que no llega al alféizar, el lavarropas lleno, media tapa de jabón, el vinagre en la cubeta, el humo de pipa que se va, el baño de bicarbonato, la lavandina que agujerea).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Curtain, Rod, Tub, Washer, Window, cottonTex } from "./curtain";
import { Hand, Steam } from "./sofa";

const PI = Math.PI;

// ---- 4:50 · YA NO LLEGA AL ALFÉIZAR: la cortina de algodón recién lavada en caliente se encoge con tirones y el ruedo queda colgando arriba de la madera ----
export const HColdShrink: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="wood" bg="#16110d" key1={[-0.7, 1.3, 1.3]}
  cam={{ at: [0, 0.95, 0.15], az: [0.3, 0.2], el: [0.05, 0.08], r: [1.4, 1.2], fov: 34 }}>{(tt) => {
  const s = [0.8, 1.7, 2.6].reduce((a, t0) => a + 0.045 * cl(phys(tt, t0, 9, 0.35)), 0);
  return <>
    <group position={[0, 1.05, -0.05]}><Window w={0.9} h={1.05} sky="#cfe0ee" /></group>
    {/* el alféizar de madera */}
    <RBox s={[1.2, 0.04, 0.2]} p={[0, 0.5, 0.06]} r={0.01}>{M.wood({ base: [150, 102, 60] })}</RBox>
    <group position={[0, 1.62, 0.1]}><Rod len={1.2} />
      {[-0.3, 0.3].map((x, i) => <group key={i} position={[x, 0, 0]}><Curtain w={0.48} h={1.1} folds={4} amp={0.025} col="#f7f2e6" shrink={s} /></group>)}
    </group>
    {/* la luz del hueco: una franja que crece entre el ruedo y la madera */}
    <mesh position={[0, 0.52 + (1.1 * s) / 2 + 0.003, 0.12]}><planeGeometry args={[1.05, 1.1 * s]} />{M.glow({ col: "#fff1c8", op: 0.25 })}</mesh>
  </>;
}}</Scene3D>;

// ---- 5:20 · EL LAVARROPAS LLENO NO LAVA, APRIETA: tambor atiborrado de cortinas que no se mueven; se sacan y quedan dos que vuelan libres ----
export const HPackedWasher: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="tile" bg="#14120f" key1={[-0.6, 1.3, 1.4]}
  cam={{ at: [0, 0.42, 0.3], az: [0.12, 0.05], el: [0.1, 0.08], r: [0.85, 0.72], fov: 32 }}>{(tt) => {
  const out = eio(tt, 1.8, 3.0), rot = tt * 2.2;
  return <>
    <Washer drum={out > 0.5 ? rot : Math.sin(tt * 8) * 0.04} water={0.5}>
      {/* lleno: bollos apretados contra el vidrio */}
      {Array.from({ length: 9 }, (_, i) => { const a = i * 0.7, r = 0.08 + 0.05 * (i % 3), go = cl(out * 1.3 - i * 0.04);
        return go < 1 && <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0.06 + 0.2 * go]} scale={[1 - go, 1 - go, 1 - go]}><icosahedronGeometry args={[0.075, 2]} /><meshStandardMaterial map={cottonTex(["#e8dcc0", "#cfe0e8", "#f0e2e2"][i % 3])} roughness={1} /></mesh>; })}
      {/* después: dos cortinas sueltas que dan vueltas con espuma */}
      {out > 0.6 && [0, 1].map((i) => <group key={i} rotation={[0, 0, rot * 0.7 + i * PI]}><mesh position={[0.1, 0.02, 0]} rotation={[0.3, 0.4, 1]} scale={[1.6, 0.25, 1.1]}><icosahedronGeometry args={[0.06, 2]} /><meshStandardMaterial map={cottonTex("#f3eee2")} roughness={1} /></mesh></group>)}
      {out > 0.6 && Array.from({ length: 18 }, (_, i) => { const a = rot * 0.5 + rn(i, 2) * 6.28; return <mesh key={"b" + i} position={[Math.cos(a) * 0.15, -0.1 + 0.08 * rn(i, 3), (rn(i, 4) - 0.5) * 0.2]}><sphereGeometry args={[0.008 + 0.01 * rn(i, 5), 10, 8]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} transparent opacity={0.8} /></mesh>; })}
    </Washer>
  </>;
}}</Scene3D>;

// ---- 5:27 · LA MITAD DE JABÓN: la tapa del detergente se llena hasta la raya de la mitad y frena; la otra mitad queda vacía con su raya ----
export const HHalfSoap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#13110e" key1={[-0.6, 1.4, 1.2]}
  cam={{ at: [-0.05, 0.1, 0], az: [0.3, 0.25], el: [0.3, 0.36], r: [0.62, 0.55], fov: 30 }}>{(tt) => {
  const fill = 0.5 * eio(tt, 0.8, 3.2), pour = tt > 0.6 && tt < 3.3;
  return <>
    <RBox s={[0.7, 0.04, 0.5]} p={[0, -0.02, 0]} r={0.01}>{M.pvc({ col: "#f0efe9" })}</RBox>
    {/* la tapa medidora, translúcida, con rayas */}
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.06, 0.05, 0.12, 40, 1, true]} />{M.plastic({ col: "#e8f3ff", op: 0.45, side: 2 })}</mesh>
    {[0.25, 0.5, 0.75, 1].map((f, i) => <mesh key={i} position={[0, 0.0 + 0.12 * f, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.058 - 0.008 * (1 - f), 0.0012, 6, 40]} /><meshBasicMaterial color={f === 0.5 ? "#c23a2a" : "#7a8a99"} /></mesh>)}
    {fill > 0.005 && <mesh position={[0, 0.06 * fill * 2 / 2 + 0.001, 0]}><cylinderGeometry args={[0.05 + 0.005 * fill, 0.05, 0.12 * fill, 40]} />{M.water({ col: "#7fb6e8", op: 0.85 })}</mesh>}
    {/* el bidón inclinado y el chorro */}
    <group position={[-0.12, 0.2, 0]} rotation={[0, 0, -0.9 * (pour ? 1 : eio(tt, 3.3, 3.8) > 0 ? 1 - eio(tt, 3.3, 3.8) : eio(tt, 0.2, 0.6))]}>
      <RBox s={[0.12, 0.16, 0.08]} p={[-0.06, 0, 0]} r={0.02}>{M.plastic({ col: "#2f6fbf" })}</RBox>
      <mesh position={[0.02, 0.06, 0]} rotation={[0, 0, -PI / 2]}><cylinderGeometry args={[0.018, 0.022, 0.04, 18]} />{M.plastic({ col: "#2f6fbf" })}</mesh>
    </group>
    {pour && Array.from({ length: 10 }, (_, i) => { const ph = (tt * 2.6 + i / 10) % 1; return <mesh key={i} position={[lerp(-0.06, -0.005, ph), lerp(0.17, 0.06 + 0.12 * fill, ph), 0]}><sphereGeometry args={[0.006, 10, 8]} />{M.water({ col: "#7fb6e8", op: 0.9 })}</mesh>; })}
    {/* la raya de la mitad: ahí frena */}
    {fill >= 0.49 && <mesh position={[0.075, 0.06, 0]}><planeGeometry args={[0.03, 0.004]} />{M.glow({ col: "#ffcf7a" })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 6:31 · EL VINAGRE SE LLEVA EL HUMO: la cubeta del lavarropas recibe media taza de vinagre; de la cortina salen hilos grises de humo viejo que se deshacen ----
export const HVinegarCup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile" bg="#14120f" key1={[-0.6, 1.4, 1.3]}
  cam={{ at: [-0.05, 0.62, 0.35], az: [0.42, 0.34], el: [0.3, 0.34], r: [1.05, 0.92], fov: 32 }}>{(tt) => {
  const drawer = eio(tt, 0.2, 0.8), pour = eio(tt, 0.9, 2.6), smoke = 1 - eio(tt, 2.6, 5.8), flowing = tt > 1.0 && tt < 2.6;
  return <>
    <Washer drum={tt * 1.4} water={0.45} wcol="#c4d2da">
      <mesh position={[0.02, -0.05, 0]} scale={[1.5, 0.6, 1.1]}><icosahedronGeometry args={[0.09, 2]} /><meshStandardMaterial map={cottonTex("#d9cfb4")} roughness={1} /></mesh>
    </Washer>
    {/* la cubeta GRANDE que sale arriba a la izquierda, con su compartimento lleno */}
    <group position={[-0.13, 0.79, 0.3 + 0.2 * drawer]}>
      <RBox s={[0.26, 0.07, 0.24]} r={0.012}>{M.pvc({ col: "#e9e7e0" })}</RBox>
      <RBox s={[0.1, 0.02, 0.16]} p={[0.06, 0.03, 0.02]} r={0.004}>{M.pvc({ col: "#cfd3d6" })}</RBox>
      <mesh position={[0.06, 0.042, 0.02]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.09 * pour + 0.001, 0.15]} />{M.water({ col: "#e9eef0", op: 0.85 })}</mesh>
    </group>
    {/* la taza medidora de vidrio que se inclina; el chorro cae a la cubeta */}
    <group position={[-0.07, 1.0, 0.56]} rotation={[0, 0, 1.4 * Math.sin(cl(pour * 1.05) * PI / 2) * (1 - eio(tt, 2.6, 3.2))]}>
      <mesh><cylinderGeometry args={[0.055, 0.05, 0.11, 30, 1, true]} />{M.glass({ op: 0.35 })}</mesh>
      <mesh position={[0, -0.055, 0]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.05, 30]} />{M.glass({ op: 0.35 })}</mesh>
      {pour < 0.95 && <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.049, 0.048, 0.05 * (1 - pour) + 0.002, 30]} />{M.water({ col: "#eef3f5", op: 0.85 })}</mesh>}
      <mesh position={[0.057, 0.02, 0]}><planeGeometry args={[0.004, 0.06]} /><meshBasicMaterial color="#c23a2a" /></mesh>
    </group>
    {flowing && Array.from({ length: 14 }, (_, i) => { const ph = (tt * 3 + i / 14) % 1; return <mesh key={i} position={[lerp(-0.03, -0.07, ph), lerp(0.98, 0.84, ph), lerp(0.56, 0.52, ph)]}><sphereGeometry args={[0.009, 10, 8]} />{M.water({ col: "#eef3f5", op: 0.9 })}</mesh>; })}
    {/* el humo viejo: hilos grises gruesos que salen del ojo de buey, se enroscan y se deshacen */}
    {smoke > 0.05 && Array.from({ length: 9 }, (_, i) => { const ph = (tt * 0.32 + i / 9) % 1, a = i * 0.7;
      const c = new THREE.CatmullRomCurve3([0, 1, 2, 3].map((j) => new THREE.Vector3(Math.cos(a) * 0.12 + 0.04 * Math.sin(j * 2 + tt + i), 0.42 + j * 0.09 + ph * 0.25, 0.34 + 0.05 * j)));
      return <mesh key={"h" + i}><tubeGeometry args={[c, 24, 0.006 * (1 - ph) + 0.002, 6, false]} /><meshBasicMaterial color="#6f6c66" transparent opacity={0.6 * smoke * (1 - ph)} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 7:01 · HUELE A LA CASA DE OTRO: la pipa en su cenicero; el humo de cuarenta años sale de la cortina en anillos y la ventana se aclara, de ámbar a blanco ----
export const HPipeSmoke: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#16110d" key1={[-0.8, 1.2, 1.4]}
  cam={{ at: [0.15, 0.85, 0.25], az: [0.4, 0.3], el: [0.14, 0.18], r: [1.45, 1.25], fov: 34 }}>{(tt) => {
  const clear = eio(tt, 1.0, 5.0);
  const tone = `rgb(${Math.round(lerp(214, 246, clear))},${Math.round(lerp(176, 242, clear))},${Math.round(lerp(110, 230, clear))})`;
  return <>
    <group position={[0, 1.05, -0.06]}><Window w={0.8} h={1.0} sky="#f2efe6" /></group>
    <group position={[0, 1.62, 0.05]}><Rod len={1.2} />
      {[-0.3, 0.3].map((x, i) => <group key={i} position={[x, 0, 0]}><Curtain w={0.46} h={1.3} folds={4} amp={0.03} col={tone} /></group>)}
    </group>
    {/* la mesita con la pipa */}
    <group position={[0.42, 0.25, 0.55]} scale={1.5}>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.16, 0.16, 0.025, 30]} />{M.wood({ base: [110, 70, 40] })}</mesh>
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.02, 0.03, 0.3, 12]} />{M.wood({ base: [110, 70, 40] })}</mesh>
      <mesh position={[0, 0.322, 0]}><cylinderGeometry args={[0.07, 0.05, 0.02, 30]} />{M.glass({ op: 0.4 })}</mesh>
      <group position={[0.0, 0.345, 0]} rotation={[0, 0.6, 0]}>
        <mesh position={[0.04, 0.025, 0]}><cylinderGeometry args={[0.018, 0.015, 0.045, 20]} />{M.wood({ base: [96, 52, 26] })}</mesh>
        <mesh position={[-0.03, 0.008, 0]} rotation={[0, 0, PI / 2 - 0.15]}><cylinderGeometry args={[0.005, 0.006, 0.12, 10]} /><meshStandardMaterial color="#1c1a18" roughness={0.4} /></mesh>
      </group>
    </group>
    {/* anillos de humo que salen de la tela y se van por la ventana */}
    {Array.from({ length: 10 }, (_, i) => { const ph = cl((tt - 0.6 - i * 0.35) / 2.4); return ph > 0 && ph < 1 && <mesh key={i} position={[(i % 2 ? 0.3 : -0.3) + 0.1 * Math.sin(i), 0.7 + 0.3 * rn(i, 2) + 0.4 * ph, 0.08 - 0.25 * ph]} rotation={[0.3, ph * 2, 0]}>
      <torusGeometry args={[0.06 + 0.1 * ph, 0.014 * (1 - ph) + 0.003, 10, 36]} /><meshBasicMaterial color="#7a7064" transparent opacity={0.7 * (1 - ph)} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 7:52 · EL AMARILLO SE VA: la cortina amarilla hundida en la bañera; el agua se tiñe de té y la tela sube blanca ----
export const HYellowSoak: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile" bg="#14120f" key1={[-0.5, 1.5, 1.1]}
  cam={{ at: [0, 0.3, 0], az: [0.4, 0.3], el: [0.55, 0.62], r: [1.4, 1.2], fov: 32 }}>{(tt) => {
  const k = eio(tt, 0.6, 4.8), lift = eio(tt, 4.6, 6.2);
  const water = `rgb(${Math.round(lerp(215, 196, k))},${Math.round(lerp(230, 170, k))},${Math.round(lerp(234, 112, k))})`;
  const cloth = `rgb(${Math.round(lerp(226, 250, k))},${Math.round(lerp(204, 248, k))},${Math.round(lerp(140, 238, k))})`;
  return <>
    <Tub water={0.62} wcol={water} wop={0.72} />
    {/* la cortina bajo el agua, ondulando; al final una punta sube blanca */}
    <group position={[0, 0.22 + 0.25 * lift, 0]} rotation={[-PI / 2 + 0.4 * lift, 0, 0]}><group position={[0, 0.18, 0]}><Curtain w={0.85} h={0.36} folds={6} amp={0.02} tt={tt} sway={0.02} col={cloth} /></group></group>
    {/* nubes de amarillo que salen de la tela */}
    {Array.from({ length: 14 }, (_, i) => { const ph = (tt * 0.25 + rn(i, 2)) % 1; return k > 0.05 && <sprite key={i} position={[(rn(i, 3) - 0.5) * 0.8, 0.25 + 0.06 * ph, (rn(i, 4) - 0.5) * 0.3]} scale={[0.1 + 0.15 * ph, 0.1 + 0.15 * ph, 1]}>
      <spriteMaterial map={tex.text("ycl", 64, 64, (g) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(190,150,70,0.8)"); r.addColorStop(1, "rgba(190,150,70,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); })} transparent opacity={0.5 * k * Math.sin(ph * PI)} depthWrite={false} /></sprite>; })}
    {/* la caja de bicarbonato en el borde */}
    <RBox s={[0.09, 0.13, 0.05]} p={[0.5, 0.515, -0.24]} r={0.005}><meshStandardMaterial map={tex.text("bsoda", 90, 130, (g) => { g.fillStyle = "#f2c230"; g.fillRect(0, 0, 90, 130); g.fillStyle = "#b8231c"; g.fillRect(0, 30, 90, 40); g.fillStyle = "#fff"; g.font = "bold 16px Arial"; g.textAlign = "center"; g.fillText("BAKING", 45, 48); g.fillText("SODA", 45, 66); })} /></RBox>
  </>;
}}</Scene3D>;

// ---- 8:07 · LA LAVANDINA COME EL ALGODÓN VIEJO: tres gotas caen sobre la tela; donde tocan, los hilos se afinan y se abren agujeros con el borde deshilachado ----
export const HChlorineHole: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#13110e" key1={[-0.6, 1.3, 1.2]}
  cam={{ at: [0, 0.0, 0], az: [0.15, 0.1], el: [0.75, 0.85], r: [0.55, 0.46], fov: 30 }}>{(tt) => {
  const P = [[-0.1, 0.02], [0.03, -0.04], [0.12, 0.05]];
  return <>
    {/* la trama del algodón: hilos de verdad, cruzados */}
    <mesh position={[0, -0.004, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.7, 0.52]} /><meshStandardMaterial map={cottonTex("#ece2c8")} roughness={1} /></mesh>
    {Array.from({ length: 68 }, (_, i) => { const x = -0.335 + i * 0.01; return <mesh key={"v" + i} position={[x, 0, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.0045, 0.0045, 0.5, 6]} /><meshStandardMaterial color={i % 2 ? "#f2e9d2" : "#e6dcc0"} roughness={1} /></mesh>; })}
    {Array.from({ length: 50 }, (_, i) => { const z = -0.245 + i * 0.01; return <mesh key={"h" + i} position={[0, 0.003, z]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0042, 0.0042, 0.68, 6]} /><meshStandardMaterial color="#e8dec4" roughness={1} /></mesh>; })}
    {/* donde cae cada gota: un agujero negro que crece, con borde amarillento */}
    {P.map(([x, z], i) => { const drop = cl((tt - 0.5 - i * 0.6) / 0.5), eat = eio(tt, 1.0 + i * 0.6, 3.6 + i * 0.6);
      return <group key={i}>
        {drop < 1 && <mesh position={[x, 0.25 * (1 - drop), z]}><sphereGeometry args={[0.022, 16, 12]} />{M.water({ col: "#e8f6c8", op: 0.9 })}</mesh>}
        {eat > 0 && <>
          <mesh position={[x, 0.0065, z]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.012 + 0.028 * eat, 30]} /><meshBasicMaterial color="#c9a85a" transparent opacity={0.7} /></mesh>
          <mesh position={[x, 0.007, z]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.022 * eat, 30]} /><meshBasicMaterial color="#13110e" /></mesh>
          {Array.from({ length: 8 }, (_, j) => { const a = (j / 8) * PI * 2 + i; return <mesh key={j} position={[x + Math.cos(a) * 0.022 * eat, 0.008, z + Math.sin(a) * 0.022 * eat]} rotation={[0, -a, 0.5]}><cylinderGeometry args={[0.0025, 0.001, 0.03 * eat + 0.001, 5]} /><meshStandardMaterial color="#efe6cf" /></mesh>; })}
        </>}
      </group>; })}
    {/* la botella de lavandina, de costado arriba */}
    <group position={[-0.24, 0.3, -0.12]} rotation={[0, 0.4, -1.1]}><RBox s={[0.09, 0.2, 0.07]} r={0.02}>{M.plastic({ col: "#f4f6f8" })}</RBox>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.018, 0.018, 0.03, 16]} />{M.plastic({ col: "#2a6ad0" })}</mesh></group>
  </>;
}}</Scene3D>;
void Hand; void tex;
