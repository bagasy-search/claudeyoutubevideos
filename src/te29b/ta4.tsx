// te29b · HAITÍ · piezas en 3D real (three.js, kit t3d): reemplazan a las de ta3/ta3b que el evaluador bajó por planas
import React from "react";
import { AMB, H, RED, Stage, phys, eio } from "./hkit";
import { K, Num, W } from "./tkit";
import { Chest3, Puff, Scene3, Sea3, Ship3, sc } from "./t3d";

// 6:24 · DIEZ AÑOS DE PRESUPUESTO: diez cofres de madera caen de a uno con rebote en dos filas sobre un piso de tablas y cada uno abre la tapa con brillo de oro; el contador de años sube 1 → 10
const XChests3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), step = (w - 1.6) / 10, n = Math.min(10, Math.max(0, Math.floor((tt - 0.3) / step) + 1));
  return <>
    <Scene3 k={K(tt, h, 0)} from={[-4.6, 2.8, 4.6]} to={[1.2, 6.2, 10.5]} look={[-3.8, 1.7, -1.1]} look2={[0, 0.3, 0]} fog={[16, 32]} floor="planks">
      {Array.from({ length: 10 }, (_, i) => { const a = 0.3 + i * step, s = phys(tt, a, 7, 0.45), x = -3.8 + (i % 5) * 1.9 + (i < 5 ? 0.95 : 0), z = i < 5 ? -1.4 : 1.2;
        const land = a + 0.33; return tt < a ? null : <React.Fragment key={i}><Puff p={[x, 0, z]} k={tt - land} /><Chest3 p={[x, 6 * (1 - Math.min(1, s)) + Math.max(0, s - 1) * -0.3, z]} rot={[0, (i % 2 ? 0.12 : -0.12), 0]} s={sc(0.9 + 0.1 * Math.min(1, s))} lid={eio(tt, a + 0.45, a + 1.1)} /></React.Fragment>; })}
    </Scene3>
    <Num tt={tt} d={0.2} x={960} y={150} txt={`${Math.max(1, n)} ${n <= 1 ? "AÑO" : "AÑOS"}`} size={120} col={n >= 10 ? RED : AMB} />
  </>;
}}</Stage>;

// 0:31 · LA FLOTA: sobre un mar 3D con olas, catorce galeones entran de a uno desde la derecha y se ubican en dos filas frente a la bahía; la cámara rasante sube en curva; el contador 1 → 14
const XFleet3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const w = W(h), step = (w - 1.6) / 14, n = Math.min(14, Math.max(0, Math.floor((tt - 0.2) / step) + 1));
  return <>
    <Scene3 k={K(tt, h, 0)} from={[-5, 1.6, 11]} to={[2.5, 5.5, 15]} look={[2, 1, -1]} look2={[0, 0.6, -2]} bg="#41556e" floor={null} fog={[18, 46]} key1={[-8, 10, 6]}>
      <Sea3 tt={tt} />
      <mesh position={[0, 0.4, -16]}><boxGeometry args={[60, 3, 4]} /><meshStandardMaterial color="#3e5a3a" roughness={0.9} /></mesh>
      {Array.from({ length: 14 }, (_, i) => { const a = 0.2 + i * step, e = eio(tt, a, a + 1.6), row = i % 2, slot = Math.floor(i / 2), x = -7.5 + slot * 2.5 + row * 1.25, z = row ? -0.5 : -4;
        return tt < a ? null : <Ship3 key={i} p={[x + 22 * (1 - e), -0.15 + 0.08 * Math.sin(tt * 1.6 + i), z]} rot={[0, Math.PI, 0]} s={0.8} roll={Math.sin(tt * 1.4 + i * 0.7)} flag={["#1f3f8a", "#f4f1ea", "#c2261e"][i % 3]} />; })}
    </Scene3>
    <Num tt={tt} d={0.2} x={960} y={150} txt={`${Math.max(1, n)} ${n <= 1 ? "BARCO DE GUERRA" : "BARCOS DE GUERRA"}`} size={100} col={n >= 14 ? RED : AMB} />
  </>;
}}</Stage>;

export const HC4: Record<string, React.FC<{ t: number; h: H }>> = { chests10: XChests3, fleet: XFleet3 };
