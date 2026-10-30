// lch29b · componentes únicos 22-27 (tacitas, escalera, factura, laminado, zanjas del piano, la línea de costado).
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Fork, IceCube, Iron, Pile, Steam, dent, dentLine, rugTex } from "./rug";

const PI = Math.PI;
const nogal = () => <meshStandardMaterial map={tex.wood(1, 2, [86, 50, 26])} roughness={0.5} />;

// ---- 14:30 · TACITAS BAJO LAS PATAS: la pata pelada hace un pozo hondo; la de la tapita de maní casi no marca ----
export const HFurnitureCups: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#16130f"
  cam={{ at: [0, 0.07, 0], az: [0.25, 0.05], el: [0.55, 0.62], r: [0.8, 0.72], fov: 30 }}>{(tt) => {
  const lid = phys(tt, 0.3, 7, 0.5), down = eio(tt, 1.4, 2.0), up = eio(tt, 3.4, 4.2), press = down * (1 - up);
  const L = -0.1, R = 0.1;
  return <>
    <Pile w={0.7} d={0.45} tt={tt} sq={(x, z) => Math.max(dent(x, z, L, 0, 0.026) * (down > 0 ? 1 : 0), 0.25 * dent(x, z, R, 0, 0.045) * press)} />
    {/* la tapa de frasco de maní, boca abajo */}
    <group position={[R, 0.02 + 0.12 * (1 - cl(lid)), 0]}>
      <mesh><cylinderGeometry args={[0.042, 0.042, 0.012, 40]} />{M.plastic({ col: "#d63b2f" })}</mesh>
      <mesh position={[0, 0.0065, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.036, 0.04, 40]} /><meshStandardMaterial color="#a82a22" /></mesh>
    </group>
    {/* las dos patas de la misma silla, bajan juntas */}
    {[L, R].map((x, i) => <group key={i} position={[x, (i ? 0.026 : 0.004) + 0.14 * (1 - down) + 0.14 * up, 0]}>
      <mesh position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.014, 0.011, 0.18, 18]} />{nogal()}</mesh>
    </group>)}
    <RBox s={[0.34, 0.03, 0.12]} p={[0, 0.2 + 0.14 * (1 - down) + 0.14 * up, 0]} r={0.008}>{nogal()}</RBox>
  </>;
}}</Scene3D>;

// ---- 17:05 · LA ESCALERA, DE ARRIBA PARA ABAJO: cada escalón tiene su huella en el medio; rocío, cepillo, y bajar ----
export const HStairs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#15120e"
  cam={{ at: [0, 0.2, 0.1], at1: [0, 0.12, 0.22], az: [0.75, 0.6], el: [0.3, 0.26], r: [1.2, 1.05], fov: 32 }}>{(tt) => {
  const N = 4, cur = cl((tt - 0.5) / 5.6) * N, step = Math.min(N - 1, Math.floor(cur)), k = cur - step;
  const rug = <meshStandardMaterial map={rugTex("#7d3b33")} roughness={1} />;
  return <>
    {Array.from({ length: N }, (_, i) => { const y = 0.36 - i * 0.09, z = i * 0.13, done = i < step || (i === step && k > 0.7);
      return <group key={i}>
        <RBox s={[0.5, 0.09, 0.14]} p={[0, y - 0.045, z]} r={0.01}>{rug}</RBox>
        {/* la huella gastada: más clara y aplastada en el centro */}
        <mesh position={[0, y + 0.0015, z + 0.01]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.17, 0.09]} /><meshStandardMaterial color="#a7655a" roughness={1} transparent opacity={done ? 0.0 : 0.75} /></mesh>
      </group>; })}
    {/* el pasamanos */}
    <mesh position={[0.28, 0.42, 0.2]} rotation={[-0.6, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.62, 14]} />{nogal()}</mesh>
    {[0, 2].map((i) => <mesh key={i} position={[0.28, 0.36 - i * 0.09 + 0.08, i * 0.13]}><cylinderGeometry args={[0.006, 0.006, 0.16, 10]} />{nogal()}</mesh>)}
    {/* el cepillo duro bajando escalón por escalón */}
    <group position={[0.08 * Math.sin(tt * 14), 0.36 - step * 0.09 + 0.025, step * 0.13 + 0.01]}>
      <RBox s={[0.12, 0.03, 0.06]} r={0.01}><meshStandardMaterial map={tex.wood(1, 1, [150, 100, 58])} roughness={0.6} /></RBox>
    </group>
    <Steam tt={tt} k={0.25 * (k < 0.3 ? 1 : 0)} p={[0, 0.38 - step * 0.09, step * 0.13]} up={-0.2} spread={0.08} n={10} />
  </>;
}}</Scene3D>;

// ---- 18:12 · LA FACTURA DE 1985: el presupuesto de Des Moines se apila en billetes; enfrente hielo, tenedor y plancha: cero ----
const recibo = () => tex.text("recibo85", 256, 340, (g) => {
  g.fillStyle = "#f3ecd8"; g.fillRect(0, 0, 256, 340); g.fillStyle = "#2c2a26"; g.font = "bold 22px Georgia"; g.fillText("CARPET CARE CO.", 22, 40);
  g.font = "16px Georgia"; g.fillText("Des Moines, Iowa", 22, 62); g.fillRect(22, 76, 212, 2);
  g.font = "18px Courier New"; g.fillText("Service call", 22, 112); g.fillText("Per spot  x 19", 22, 142);
  g.fillRect(22, 250, 212, 2); g.font = "bold 46px Georgia"; g.fillStyle = "#9b2a22"; g.fillText("$150", 60, 310);
});
export const HInvoice: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#16130f"
  cam={{ at: [0, 0.06, 0], az: [0.0, 0.1], el: [0.55, 0.62], r: [0.85, 0.75], fov: 32 }}>{(tt) => {
  const slide = eio(tt, 0.3, 1.2), bills = cl((tt - 1.3) / 2.0), tools = [phys(tt, 3.6, 7, 0.5), phys(tt, 3.9, 7, 0.5), phys(tt, 4.2, 7, 0.5)];
  return <>
    <group position={[lerp(-0.6, -0.2, slide), 0.003, 0.02]} rotation={[-PI / 2, 0, 0.08]}><mesh><planeGeometry args={[0.2, 0.265]} /><meshStandardMaterial map={recibo()} roughness={0.85} /></mesh></group>
    {Array.from({ length: Math.round(15 * bills) }, (_, i) => <RBox key={i} s={[0.13, 0.004, 0.06]} p={[-0.2 + (rn(i, 2) - 0.5) * 0.01, 0.006 + i * 0.0045, 0.19 + (rn(i, 3) - 0.5) * 0.008]} r={0.001}><meshStandardMaterial color={i % 2 ? "#8fa684" : "#9cb291"} roughness={0.9} /></RBox>)}
    {/* lo que ya había en la casa */}
    {tools[0] > 0.01 && <group position={[0.12, 0.03 + 0.2 * (1 - cl(tools[0])), -0.14]} scale={1.6}><IceCube /></group>}
    {tools[1] > 0.01 && <group position={[0.3, 0.008 + 0.2 * (1 - cl(tools[1])), -0.02]} rotation={[0, 0.5, 0]} scale={1.6}><Fork /></group>}
    {tools[2] > 0.01 && <group position={[0.14, 0.012 + 0.2 * (1 - cl(tools[2])), 0.16]} rotation={[0, -0.6, 0]}><Iron /></group>}
  </>;
}}</Scene3D>;

// ---- 19:50 · EL LAMINADO ES UNA FOTO DE MADERA: corte; el vapor hincha el aglomerado y la lámina se levanta; fieltro y listo ----
const aglo = () => tex.text("aglo", 256, 64, (g) => { g.fillStyle = "#b58e5c"; g.fillRect(0, 0, 256, 64); for (let i = 0; i < 900; i++) { g.fillStyle = ["#8f6a3e", "#d2ad78", "#6e4f2c"][i % 3]; g.fillRect(rn(i, 2) * 256, rn(i, 3) * 64, 2 + 4 * rn(i, 4), 1 + 2 * rn(i, 5)); } });
export const HLaminate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#15120e"
  cam={{ at: [0, 0.06, 0], az: [0.15, 0.3], el: [0.25, 0.32], r: [0.62, 0.55], fov: 30 }}>{(tt) => {
  const st = eio(tt, 0.6, 1.2) * (1 - eio(tt, 2.6, 3.0)), sw = eio(tt, 1.2, 3.0), pad = phys(tt, 4.2, 7, 0.5);
  return <>
    {/* el aglomerado que se hincha en el medio */}
    {Array.from({ length: 20 }, (_, i) => { const x = -0.19 + i * 0.02, bump = sw * Math.exp(-((x / 0.07) ** 2));
      return <group key={i}>
        <mesh position={[x, -0.012 + 0.006 * bump, 0]}><boxGeometry args={[0.0205, 0.024 + 0.012 * bump, 0.16]} /><meshStandardMaterial map={aglo()} roughness={0.95} /></mesh>
        <mesh position={[x, 0.0015 + 0.018 * bump, 0]} rotation={[0, 0, -Math.sign(x) * 0.25 * bump]}><boxGeometry args={[0.0205, 0.003, 0.16]} /><meshStandardMaterial map={tex.wood(1, 1, [176, 128, 82])} roughness={0.25} /></mesh>
      </group>; })}
    <group position={[0, 0.08 + 0.05 * (1 - st), 0]}><Iron hot={st} /></group>
    <Steam tt={tt} k={st} p={[0, 0.03, 0]} up={-0.1} spread={0.08} n={12} />
    {/* el fieltro bajo la pata, en otra tabla sana */}
    {pad > 0.01 && <group position={[0.14, 0.004 + 0.1 * (1 - cl(pad)), 0.04]}>
      <mesh><cylinderGeometry args={[0.022, 0.022, 0.006, 30]} /><meshStandardMaterial color="#6c6a62" roughness={1} /></mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.012, 0.012, 0.11, 16]} />{nogal()}</mesh>
    </group>}
  </>;
}}</Scene3D>;

// ---- 20:55 · LAS ZANJAS DEL PIANO: las rueditas se van; dos zanjas largas en la alfombra azul, y el lápiz cabe acostado ----
export const HPianoTrench: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#121318" key1={[-1.2, 0.8, 0.6]}
  cam={{ at: [0, 0.02, 0], az: [0.45, 0.3], el: [0.62, 0.55], r: [0.95, 0.8], fov: 32 }}>{(tt) => {
  const out = eio(tt, 0.5, 2.6), pencil = phys(tt, 3.6, 7, 0.5), Z = [-0.09, 0.09];
  return <>
    <Pile w={1.1} d={0.5} step={0.01} tt={tt} col="#45618e" sq={(x, z) => Math.max(...Z.map((cz) => dentLine(x, z, -0.42, 0.42, cz, 0.022)))} />
    {/* la base del piano y sus rueditas de bronce, saliendo de cuadro */}
    <group position={[lerp(0, -1.3, out), 0, 0]}>
      <RBox s={[0.95, 0.12, 0.3]} p={[0, 0.1, 0]} r={0.01}><meshPhysicalMaterial color="#1a1210" roughness={0.25} clearcoat={1} /></RBox>
      {[-0.42, 0.42].flatMap((x) => Z.map((z) => [x, z])).map(([x, z], i) => <group key={i} position={[x, 0.022, z]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.014, 20]} /><meshStandardMaterial color="#b8893a" metalness={0.9} roughness={0.3} /></mesh>
      </group>)}
    </group>
    {/* el lápiz amarillo acostado dentro de la zanja */}
    {pencil > 0.01 && <group position={[0.05, 0.012 + 0.12 * (1 - cl(pencil)), Z[1]]} rotation={[0, 0, PI / 2]}>
      <mesh><cylinderGeometry args={[0.006, 0.006, 0.16, 6]} /><meshStandardMaterial color="#f2c230" roughness={0.5} /></mesh>
      <mesh position={[0, 0.088, 0]}><coneGeometry args={[0.006, 0.016, 6]} /><meshStandardMaterial color="#e6c9a0" /></mesh>
      <mesh position={[0, -0.084, 0]}><cylinderGeometry args={[0.0062, 0.0062, 0.01, 10]} /><meshStandardMaterial color="#e48a9a" /></mesh>
    </group>}
  </>;
}}</Scene3D>;

// ---- 21:30 · DE PARADO NO SE VE: la cámara baja de la altura de los ojos al ras del piso, con la luz rasante; ahí aparece la línea ----
export const HFaintLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#121318" key1={[-2.0, 0.15, 0.1]}
  cam={{ at: [0, 0.01, 0], az: [0.0, 0.25], el: [1.35, 0.06], r: [0.9, 0.55], fov: 32 }}>{(tt) => {
  const lamp = eio(tt, 2.8, 3.6);
  return <>
    <Pile w={1.0} d={0.6} step={0.01} tt={tt} col="#45618e" sq={(x, z) => 0.22 * Math.max(dentLine(x, z, -0.45, 0.45, -0.08, 0.014), dentLine(x, z, -0.45, 0.45, 0.08, 0.014))} shine={(x, z) => lamp * 0.5 * Math.max(dentLine(x, z, -0.45, 0.45, -0.08, 0.016), dentLine(x, z, -0.45, 0.45, 0.08, 0.016))} />
    {/* la ventana: luz rasante que entra de costado */}
    <mesh position={[-0.7, 0.12, 0]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.6, 0.2]} /><meshBasicMaterial color="#fff1d0" transparent opacity={0.5 + 0.4 * lamp} /></mesh>
  </>;
}}</Scene3D>;
void Steam;
