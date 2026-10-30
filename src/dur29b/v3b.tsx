// dur29b · componentes únicos en 3D, bloque B: el asedio por abajo, el tambor con arvejas, la cuerda de los tirones, la columna de
// Rusia, el tambor que da órdenes, no te sientes en la nieve, las cinco cosas, el pasillo sin fin, la cloaca y las cuerdas del tiempo.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex, tubeG } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, EnSitio, Plate, fallY, latheG, pop, rockT } from "./kb";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;
const EARTH = [120, 92, 64];

// ---- AsedioCorte · «Cavar un túnel hasta debajo de la muralla, llenarlo de pólvora, y volarla»: corte del cerro; el túnel sale del
// campamento, pasa por debajo de la muralla, se llena de barriles y el tramo de muralla se levanta en polvo ----
export const AsedioCorte3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aP = sec(p, "polvora", 2.0), aV = Math.min(sec(p, "volarla", 3.0), D - 1.6);
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" key1={[-1.4, 2.6, 2.2]} backZ={-1.6}
    cam={{ at: [0.1, 0.35, 0], az: [-0.12, 0.08], el: [0.12, 0.08], r: [2.7, 2.4], fov: 36 }}>{(tt) => {
    const dig = eio(tt, 0.2, aP), bl = eio(tt, aV, aV + 0.5), up = cl(bl * 1.2), dust = eio(tt, aV, aV + 1.6);
    const tx = lerp(-1.2, 0.55, dig);
    return <>
      {/* el corte de tierra */}
      <mesh position={[0, 0.0, -0.2]}><boxGeometry args={[3.6, 0.8, 0.4]} /><meshStandardMaterial map={rockT("asedio", EARTH, 3, 1)} roughness={1} /></mesh>
      <mesh position={[0, 0.405, -0.2]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3.6, 0.4]} /><meshStandardMaterial color="#6a7a40" roughness={1} /></mesh>
      {/* el túnel, oscuro, avanzando */}
      <mesh position={[(tx - 1.2) / 2, -0.05, 0.005]}><planeGeometry args={[Math.max(0.01, tx + 1.2), 0.16]} /><meshBasicMaterial color="#120d09" /></mesh>
      {Array.from({ length: 9 }, (_, i) => { const x = -1.15 + i * 0.2; return x < tx ? <RBox key={i} s={[0.02, 0.16, 0.02]} p={[x, -0.05, 0.02]}>{M.wood({ base: [130, 92, 54] })}</RBox> : null; })}
      <group position={[tx - 0.08, -0.13, 0.03]}><Stickman escala={0.055} rotY={90} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={11} contacto={0} /></group>
      {/* los barriles de pólvora al final */}
      {Array.from({ length: 5 }, (_, i) => <group key={i} position={[0.48 + (i % 3) * 0.05, -0.1 + Math.floor(i / 3) * 0.06, 0.03]} visible={tt > aP + i * 0.12}><mesh><cylinderGeometry args={[0.025, 0.025, 0.055, 14]} />{M.wood({ base: [110, 70, 36] })}</mesh></group>)}
      {/* la muralla de la ciudad: el tramo de arriba del túnel se levanta */}
      {Array.from({ length: 7 }, (_, i) => { const x = 0.25 + i * 0.12, hit = Math.abs(x - 0.55) < 0.2;
        const lift = hit ? up * (0.35 + 0.3 * rn(i, 2)) : 0, rot = hit ? up * (rn(i, 3) - 0.5) * 1.2 : 0;
        return <group key={i} position={[x, 0.55 + lift, -0.2]} rotation={[0, 0, rot]}><RBox s={[0.115, 0.3, 0.16]} r={0.006}><meshStandardMaterial map={dirtT([176, 166, 150])} roughness={0.95} /></RBox></group>; })}
      {[0.18, 1.08].map((x, i) => <group key={i} position={[x, 0.65, -0.2]}><mesh><cylinderGeometry args={[0.08, 0.09, 0.5, 16]} /><meshStandardMaterial map={dirtT([170, 160, 144])} roughness={0.95} /></mesh><mesh position={[0, 0.32, 0]}><coneGeometry args={[0.1, 0.16, 16]} /><meshStandardMaterial color="#7a3a26" roughness={0.8} /></mesh></group>)}
      {/* el campamento: carpas a la izquierda */}
      {[-1.3, -1.05, -0.8].map((x, i) => <mesh key={i} position={[x, 0.48, -0.2]} rotation={[0, PI / 4, 0]}><coneGeometry args={[0.1, 0.16, 4]} /><meshStandardMaterial color="#d8ccb0" roughness={0.9} /></mesh>)}
      {/* el polvo de la voladura: bolas grises que crecen, nunca un destello */}
      {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[0.55 + (rn(i, 1) - 0.5) * 0.5, 0.5 + dust * (0.2 + 0.6 * rn(i, 2)), -0.1 + (rn(i, 3) - 0.5) * 0.2]} scale={Math.max(0.001, dust * (0.6 + rn(i, 4)))}>
        <sphereGeometry args={[0.08, 12, 10]} /><meshStandardMaterial color="#8a8070" roughness={1} transparent opacity={0.75 * (1 - 0.6 * eio(tt, aV + 1.0, aV + 2.4))} depthWrite={false} /></mesh>)}
      <pointLight position={[0.55, 0.0, 0.4]} intensity={2.2 * bl * (1 - eio(tt, aV + 0.5, aV + 1.5))} distance={1.6} color="#ff9a4a" />
    </>;
  }}</U3>;
};

// ---- TamborArvejas · «tambores con arvejas arriba. Cuando el agua temblaba o las arvejas saltaban»: el tambor junto a la muralla y
// el cuenco de agua; abajo, en el corte, el zapador se acerca y las arvejas empiezan a saltar ----
export const TamborArvejas3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aS = Math.min(sec(p, "saltaban", 2.4), D - 1.5);
  return <U3 d={d} bg={p.bg} ground={null} mode="iris" key1={[-1.0, 2.4, 1.8]}
    cam={{ at: [0, 0.18, 0], az: [-0.25, 0.1], el: [0.26, 0.2], r: [1.7, 1.45], fov: 34 }}>{(tt) => {
    const near = eio(tt, 0.3, aS + 0.2), amp = 0.04 * near * near, dx = lerp(-1.1, 0.0, near);
    return <>
      {/* el suelo cortado: arriba pasto, abajo la tierra con el túnel */}
      <mesh position={[0, -0.3, -0.1]}><boxGeometry args={[2.6, 0.6, 0.8]} /><meshStandardMaterial map={rockT("tambor", EARTH, 3, 1)} roughness={1} /></mesh>
      <mesh position={[0, 0.002, -0.1]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.6, 0.8]} /><meshStandardMaterial map={dirtT([110, 112, 70])} roughness={1} /></mesh>
      <mesh position={[(dx - 1.3) / 2, -0.4, 0.302]}><planeGeometry args={[Math.max(0.01, dx + 1.3), 0.14]} /><meshBasicMaterial color="#120d09" /></mesh>
      <group position={[dx - 0.04, -0.47, 0.32]}><Stickman escala={0.05} rotY={90} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={12} contacto={0} /></group>
      {/* el muro detrás */}
      <RBox s={[2.6, 0.5, 0.12]} r={0.01} p={[0, 0.25, -0.44]}><meshStandardMaterial map={dirtT([176, 166, 150])} roughness={0.95} /></RBox>
      {/* el tambor con las arvejas */}
      <group position={[-0.15, 0, 0]}>
        <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.16, 0.16, 0.16, 32, 1, true]} /><meshStandardMaterial map={tex.wood(3, 1, [140, 70, 40])} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.16, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.16, 32]} /><meshStandardMaterial color="#e8dcc0" roughness={0.8} /></mesh>
        {Array.from({ length: 34 }, (_, i) => { const a = rn(i, 1) * 2 * PI, r = Math.sqrt(rn(i, 2)) * 0.13, hop = amp * Math.abs(Math.sin(tt * 2 * PI * (1.6 + rn(i, 3)) + i));
          return <mesh key={i} position={[Math.cos(a) * r, 0.172 + hop, Math.sin(a) * r]}><sphereGeometry args={[0.011, 10, 8]} /><meshStandardMaterial color="#6a9a3a" roughness={0.6} /></mesh>; })}
      </group>
      {/* el cuenco de agua: anillos que tiemblan */}
      <group position={[0.3, 0, 0.05]}>
        <mesh geometry={latheG("cuenco", [[0.0, 0], [0.1, 0.0], [0.13, 0.05], [0.14, 0.08], [0.13, 0.08], [0.12, 0.05], [0.0, 0.02]], 36)}><meshStandardMaterial color="#a8643a" roughness={0.8} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.065, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.125, 36]} />{M.water({ col: "#4a7a8a" })}</mesh>
        {[0, 1, 2].map((i) => { const ph = (tt * 1.4 + i / 3) % 1; return <mesh key={i} position={[0, 0.067, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[ph * 0.11, ph * 0.11 + 0.004, 36]} /><meshBasicMaterial color="#e8f4f8" transparent opacity={near * (1 - ph) * 0.8} depthWrite={false} /></mesh>; })}
      </group>
    </>;
  }}</U3>;
};

// ---- CuerdaTirones · «Un tirón, para. Dos tirones, sigue. Tres, sal corriendo»: la cuerda por el piso del túnel; la onda corre por
// ella una, dos, tres veces y se levanta la tablita de cada orden ----
const ORD = [["uno", "PARA"], ["dos", "SIGUE"], ["tres", "SAL CORRIENDO"]];
export const CuerdaTirones3D: React.FC<UP> = ({ d, p }) => {
  const at = ORD.map(([k], i) => sec(p, k, 0.5 + i * 1.3));
  return <U3 d={d} bg={p.bg} ground={null} mode="iris" key1={[-0.8, 2.0, 1.6]}
    cam={{ at: [0, 0.12, 0], az: [-0.35, 0.1], el: [0.32, 0.22], r: [1.9, 1.6], fov: 34 }}>{(tt) => {
    // cuántos tirones viajan ahora y por dónde va cada onda
    const waves: number[] = []; at.forEach((a, i) => { for (let j = 0; j <= i; j++) { const s = a + j * 0.35; if (tt > s && tt < s + 1.0) waves.push((tt - s) / 1.0); } });
    const pts = Array.from({ length: 41 }, (_, i) => { const u = i / 40, x = -1.2 + u * 2.4; let y = 0.02; waves.forEach((w) => { y += 0.07 * Math.exp(-Math.pow((u - w) * 9, 2)); }); return [x, y, 0.1 * Math.sin(u * 5)]; });
    return <>
      <mesh position={[0, -0.01, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 1.6]} /><meshStandardMaterial map={dirtT([96, 76, 56])} roughness={1} /></mesh>
      {[-1.0, -0.4, 0.2, 0.8].map((x, i) => <group key={i} position={[x, 0, -0.4]}><RBox s={[0.04, 0.5, 0.04]} p={[0, 0.25, 0]}>{M.wood({ base: [120, 84, 50] })}</RBox></group>)}
      <mesh geometry={tubeG("tiron" + Math.round(tt * 30), pts, 0.008, 80, 8)}><meshStandardMaterial color="#c8a878" roughness={0.9} /></mesh>
      {ORD.map(([, w], i) => <group key={i} position={[-0.7 + i * 0.7, 0, 0.32]} scale={pop(tt, at[i] + 0.4)}>
        {Array.from({ length: i + 1 }, (_, j) => <mesh key={j} position={[-0.06 * i + j * 0.12, 0.3, 0]}><sphereGeometry args={[0.03, 14, 10]} /><meshStandardMaterial color="#c8a878" roughness={0.9} /></mesh>)}
        <Plate k={"orden" + i} txt={w} w={0.5} h={0.11} p={[0, 0.17, 0]} rot={[-0.3, 0, 0]} />
      </group>)}
      <mesh position={[-0.9, 0.3, -0.35]}><sphereGeometry args={[0.02, 10, 8]} />{M.glow({ col: "#ffd27a" })}</mesh>
      <pointLight position={[-0.9, 0.3, -0.2]} intensity={0.8} distance={1.6} color="#ffc070" />
    </>;
  }}</U3>;
};

// ---- ColumnaRusia · «seiscientos mil hombres… sólo regresó una fracción»: sobre el mapa, la columna de ida es una cinta ancha que
// llega a Moscú; la de vuelta, una cinta negra cada vez más finita, y los rodillos bajan de 600 a menos de 100 mil ----
export const ColumnaRusia3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aM = sec(p, "moscu", 1.6), aV = Math.min(sec(p, "volver", 3), D - 2.2);
  const n = (tt: number) => 600 - 500 * eio(tt, aV, D - 0.4);
  return <U3 d={d} bg={p.bg} ground={[200, 190, 170]} mode="drop" key1={[-1.0, 2.8, 1.4]}
    cam={{ at: [0, 0, 0], az: [-0.1, 0.1], el: [0.85, 0.7], r: [2.6, 2.3], fov: 36 }}
    over={(tt) => <Drums v={Math.round(n(tt))} n={3} x={1180} y={140} s={1.3} unit="mil" />}>{(tt) => {
    const go = eio(tt, 0.3, aM), back = eio(tt, aV, D - 0.4), snow = eio(tt, aV - 0.6, aV + 0.4);
    const path = (u: number) => [-1.3 + 2.4 * u, 0, 0.15 * Math.sin(u * 4)];
    const ribbon = (k: string, u0: number, u1: number, w: (u: number) => number, dz: number) => {
      const N = 40, pos: number[] = [], idx: number[] = [];
      for (let i = 0; i <= N; i++) { const u = lerp(u0, u1, i / N), [x, , z] = path(u), ww = w(u); pos.push(x, 0.01, z + dz - ww / 2, x, 0.01, z + dz + ww / 2); if (i < N) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; };
    const gGo = ribbon("go", 0, Math.max(0.01, go), (u) => 0.32 - 0.12 * u, -0.08);
    const gBk = ribbon("bk", Math.min(0.99, 1 - back), 1, (u) => 0.02 + 0.18 * u * u, 0.18);
    return <>
      <mesh geometry={gGo}><meshStandardMaterial color="#c8a878" roughness={0.8} side={THREE.DoubleSide} /></mesh>
      <mesh geometry={gBk}><meshStandardMaterial color="#1e1a16" roughness={0.8} side={THREE.DoubleSide} /></mesh>
      {/* Moscú: cúpulas y un fuego lento */}
      <group position={[1.15, 0, 0.15 * Math.sin(4)]} scale={pop(tt, aM - 0.4)}>
        {[[0, 0], [0.08, 0.05], [-0.07, 0.06]].map(([x, z], i) => <group key={i} position={[x, 0, z]}><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.03, 0.03, 0.12, 12]} /><meshStandardMaterial color="#d8ccb0" /></mesh><mesh position={[0, 0.14, 0]}><sphereGeometry args={[0.035, 14, 10]} />{M.brass()}</mesh></group>)}
        <mesh position={[0, 0.2, 0]} scale={[1, 1 + 0.1 * Math.sin(tt * 2 * PI * 1.2), 1]}><coneGeometry args={[0.06, 0.18, 12]} />{M.glow({ col: "#ff9a4a", op: 0.6 * eio(tt, aM, aM + 0.8) })}</mesh>
      </group>
      <Plate k="moscu" txt="MOSCÚ" w={0.32} h={0.08} p={[1.15, 0.02, 0.45]} rot={[-PI / 2 + 0.3, 0, 0]} />
      <Plate k="niemen" txt="FRONTERA" w={0.38} h={0.08} p={[-1.25, 0.02, 0.45]} rot={[-PI / 2 + 0.3, 0, 0]} />
      {/* la nieve de la vuelta */}
      {Array.from({ length: 60 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 3, 1.2 - ((rn(i, 2) + tt * 0.25) % 1) * 1.2, (rn(i, 3) - 0.5) * 1.6]}><sphereGeometry args={[0.008, 6, 6]} /><meshBasicMaterial color="#fff" transparent opacity={0.8 * snow} depthWrite={false} /></mesh>)}
    </>;
  }}</U3>;
};

// ---- TamborOrdenes · «el tambor no era música. Era la radio»: los palillos golpean y cada ritmo levanta su banderín: marchar,
// alto, atacar ----
const RIT = [["MARCHAR", [0, 0.5, 1.0, 1.5]], ["ALTO", [0, 0.2, 0.4]], ["ATACAR", [0, 0.15, 0.3, 0.45, 0.6, 0.75]]] as const;
export const TamborOrdenes3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, a0 = sec(p, "radio", 0.4), step = Math.max(1.4, (D - a0 - 0.6) / 3);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="iris" key1={[-1.0, 2.4, 1.8]}
    cam={{ at: [0, 0.35, 0], az: [-0.3, 0.15], el: [0.24, 0.16], r: [1.9, 1.6], fov: 34 }}>{(tt) => {
    const cur = Math.min(2, Math.floor(Math.max(0, tt - a0) / step)), lt = Math.max(0, tt - a0) - cur * step;
    const hits = RIT[cur][1] as readonly number[], hit = hits.reduce((m, h) => Math.max(m, Math.exp(-Math.pow((lt - h) * 14, 2))), 0);
    const zig = Array.from({ length: 17 }, (_, i) => { const a = i / 16 * 2 * PI; return [Math.cos(a) * 0.205, 0.08 + (i % 2 ? 0.2 : 0), Math.sin(a) * 0.205]; });
    return <>
      <group position={[0, 0.02, 0]}>
        <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.2, 0.2, 0.26, 40, 1, true]} /><meshStandardMaterial color="#2a4a8a" roughness={0.5} side={THREE.DoubleSide} /></mesh>
        {[0.05, 0.31].map((y, i) => <mesh key={i} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.205, 0.014, 10, 40]} /><meshStandardMaterial color="#c8302a" roughness={0.6} /></mesh>)}
        <mesh position={[0, 0.315, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.2, 40]} /><meshStandardMaterial color="#efe6d2" roughness={0.8} /></mesh>
        <mesh geometry={tubeG("zig", zig, 0.004, 64, 6)}><meshStandardMaterial color="#efe6d2" /></mesh>
        {[-1, 1].map((s) => <group key={s} position={[s * 0.1, 0.33 + 0.12 * (1 - hit), 0.05]} rotation={[0.6 - 0.5 * (1 - hit), 0, s * 0.3]}><mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.008, 0.01, 0.26, 8]} /><meshStandardMaterial map={tex.wood(1, 3, [200, 160, 110])} /></mesh></group>)}
      </group>
      {RIT.map(([w], i) => { const on = i === cur ? eio(tt, a0 + i * step, a0 + i * step + 0.3) : i < cur ? 0.25 : 0.12, x = -0.7 + i * 0.7;
        return <group key={i} position={[x, 0, -0.55]}>
          <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.01, 0.01, 0.9, 8]} />{M.wood({ base: [110, 72, 40] })}</mesh>
          <group position={[0.17, 0.78 + 0.04 * on, 0]}><Plate k={"rit" + i} txt={w} w={0.32} h={0.12} p={[0, 0, 0]} mat="brass" /></group>
          <pointLight position={[0.17, 0.78, 0.3]} intensity={1.2 * on} distance={0.8} color="#ffd890" />
        </group>; })}
    </>;
  }}</U3>;
};

// ---- NoTeSientes · «el que se sentaba se dormía. Y el que se dormía, no se levantaba»: dos soldados en la nieve; uno sigue
// caminando en el lugar, el otro se sienta y la nieve lo va tapando ----
export const NoTeSientes3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aS = sec(p, "sentaba", 0.8), aD = Math.min(sec(p, "levantaba", 2.6), D - 1);
  return <U3 d={d} bg={p.bg} ground={[226, 230, 236]} sky="#9aa4b0" mode="drop" key1={[-1.0, 2.6, 1.6]}
    cam={{ at: [0, 0.28, 0], az: [-0.3, 0.1], el: [0.16, 0.1], r: [2.0, 1.75], fov: 34 }}>{(tt) => {
    const cover = eio(tt, aS + 0.6, aD + 0.8);
    return <>
      <group position={[-0.35, 0, 0]}><EnSitio tt={tt} accion="caminar" escala={0.15} rotY={60} expr="decidido" semilla={31} /></group>
      <group position={[0.35, 0, 0]}><Stickman escala={0.15} rotY={-20} guion={[{ t: 0, accion: "idle", expr: "triste" }, { t: aS, accion: "sentarse", expr: "dormido" }]} semilla={32} contacto={0.3} colorContacto="#7a8a9a" /></group>
      {/* la nieve que se le junta encima, de a capas */}
      <mesh position={[0.35, 0, 0.02]} scale={[1, Math.max(0.001, cover), 1]}><sphereGeometry args={[0.2, 32, 16, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color="#f2f5f8" roughness={0.9} transparent opacity={0.92} /></mesh>
      {Array.from({ length: 80 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 2.4, 1.3 - ((rn(i, 2) + tt * 0.18) % 1) * 1.3, (rn(i, 3) - 0.5) * 1.4]}><sphereGeometry args={[0.007, 6, 6]} /><meshBasicMaterial color="#fff" transparent opacity={0.85} depthWrite={false} /></mesh>)}
      {/* el aliento del que camina */}
      {[0, 1, 2].map((i) => { const ph = (tt * 0.7 + i / 3) % 1; return <mesh key={i} position={[-0.3 + ph * 0.12, 0.27 + ph * 0.05, 0.07]} scale={0.3 + ph}><sphereGeometry args={[0.02, 10, 8]} /><meshBasicMaterial color="#fff" transparent opacity={0.35 * (1 - ph)} depthWrite={false} /></mesh>; })}
    </>;
  }}</U3>;
};

// ---- TopCinco · «cinco cosas que en una guerra te mataban antes que el enemigo»: cinco pedestales de piedra; en cada número sube
// su objeto: la mochila, la nube, la campana atada, el plato vacío y, en el más alto, el microbio ----
const T5 = ["cinco", "cuatro", "tres", "dos", "uno"];
const Obj5: React.FC<{ i: number; tt: number }> = ({ i, tt }) => {
  if (i === 0) return <group><RBox s={[0.16, 0.2, 0.1]} r={0.03} p={[0, 0.1, 0]}><meshStandardMaterial color="#5a5a3a" roughness={0.9} /></RBox><mesh position={[0, 0.23, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.04, 0.04, 0.18, 16]} /><meshStandardMaterial color="#8a6a4a" roughness={1} /></mesh></group>;
  if (i === 1) return <group position={[0, 0.16, 0]}>{[[0, 0, 0.07], [0.07, -0.01, 0.055], [-0.07, -0.01, 0.055], [0.03, 0.04, 0.05]].map(([x, y, r], k) => <mesh key={k} position={[x, y, 0]}><sphereGeometry args={[r, 18, 14]} /><meshStandardMaterial color="#8a929a" roughness={0.9} /></mesh>)}
    {Array.from({ length: 6 }, (_, k) => { const ph = (tt * 0.9 + k / 6) % 1; return <mesh key={"r" + k} position={[-0.06 + k * 0.025, -0.06 - ph * 0.12, 0]}><cylinderGeometry args={[0.002, 0.002, 0.03, 4]} /><meshBasicMaterial color="#9ac0e0" transparent opacity={1 - ph} /></mesh>; })}</group>;
  if (i === 2) return <group position={[0, 0.12, 0]}><mesh geometry={latheG("campana5", [[0.0, 0.12], [0.03, 0.11], [0.05, 0.04], [0.08, -0.04], [0.085, -0.05], [0.0, -0.05]], 32)}>{M.brass()}</mesh>
    <mesh rotation={[0, 0, 0.3]} position={[0, 0.0, 0]}><torusGeometry args={[0.07, 0.008, 8, 24]} /><meshStandardMaterial color="#c8a878" roughness={0.9} /></mesh></group>;
  if (i === 3) return <group position={[0, 0.03, 0]}><mesh geometry={latheG("plato5", [[0.0, 0], [0.09, 0.0], [0.13, 0.03], [0.12, 0.035], [0.085, 0.008], [0.0, 0.008]], 36)}>{M.steel({ col: "#a8acb0" })}</mesh></group>;
  return <group position={[0, 0.18, 0]} rotation={[tt * 0.4, tt * 0.6, 0]}><mesh><icosahedronGeometry args={[0.1, 2]} /><meshStandardMaterial color="#6a9a4a" roughness={0.6} emissive="#2a5a1a" emissiveIntensity={0.35} /></mesh>
    {Array.from({ length: 18 }, (_, k) => { const a = rn(k, 1) * 2 * PI, b = Math.acos(2 * rn(k, 2) - 1); const v = new THREE.Vector3(Math.sin(b) * Math.cos(a), Math.cos(b), Math.sin(b) * Math.sin(a)); const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
      return <mesh key={k} position={v.clone().multiplyScalar(0.12).toArray()} quaternion={q}><cylinderGeometry args={[0.006, 0.01, 0.05, 6]} /><meshStandardMaterial color="#8aba5a" roughness={0.6} /></mesh>; })}</group>;
};
export const TopCinco3D: React.FC<UP> = ({ d, p }) => {
  const at = T5.map((k, i) => sec(p, k, 0.4 + i * 1.4));
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-1.0, 2.6, 2.0]}
    cam={{ at: [-0.3, 0.45, 0], at1: [0.5, 0.55, 0], az: [-0.12, 0.08], el: [0.14, 0.1], r: [2.4, 2.1], fov: 36 }}>{(tt) => <>
    {T5.map((_, i) => { const h = 0.2 + i * 0.1, x = -1.0 + i * 0.5, on = eio(tt, at[i], at[i] + 0.4);
      return <group key={i} position={[x, 0, 0]}>
        <RBox s={[0.36, h, 0.36]} r={0.01} p={[0, h / 2, 0]}><meshStandardMaterial map={dirtT([150 + i * 6, 142 + i * 5, 128])} roughness={0.95} /></RBox>
        <Plate k={"t5n" + i} txt={String(5 - i)} w={0.12} h={0.1} p={[0, h * 0.55, 0.185]} mat="brass" font={90} />
        <group position={[0, h, 0]} scale={pop(tt, at[i])}><Obj5 i={i} tt={tt} /></group>
        <spotLight position={[x, 2.2, 0.6]} angle={0.2} penumbra={0.6} intensity={14 * on} distance={3} color={i === 4 ? "#d8ffc0" : "#ffe8c0"} />
      </group>; })}
  </>}</U3>;
};

// ---- PasilloInfinito · «Un pasillo larguísimo… a los dos lados, en el piso, hombres acostados»: la cámara avanza por los arcos del
// cuartel de Scutari y los colchones no se terminan nunca ----
export const PasilloInfinito3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30;
  return <U3 d={d} bg={p.bg} ground={null} sky="#1a1612" mode="iris" key1={[0.0, 2.0, 0.0]} backZ={-30}
    cam={{ at: [0, 0.45, -1.0], at1: [0, 0.45, -3.6], az: [0.0, 0.0], el: [0.04, 0.03], r: [1.2, 1.2], fov: 50 }}>{(tt) => <>
    <mesh position={[0, 0, -8]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.8, 20]} /><meshStandardMaterial map={rockT("piso", [120, 108, 92], 2, 20)} roughness={1} /></mesh>
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.9, 0.7, -8]} rotation={[0, -s * PI / 2, 0]}><planeGeometry args={[20, 1.4]} /><meshStandardMaterial map={rockT("pared", [190, 176, 150], 20, 1)} roughness={1} /></mesh>)}
    {Array.from({ length: 22 }, (_, i) => { const z = 1.0 - i * 0.8; return <group key={i} position={[0, 0, z]}>
      {[-1, 1].map((s) => <RBox key={s} s={[0.12, 1.2, 0.12]} r={0.01} p={[s * 0.82, 0.6, 0]}><meshStandardMaterial map={dirtT([200, 188, 164])} roughness={0.95} /></RBox>)}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.82, 0.06, 8, 24, PI]} /><meshStandardMaterial map={dirtT([200, 188, 164])} roughness={0.95} /></mesh>
      {[-1, 1].map((s) => <group key={"c" + s} position={[s * 0.6, 0.025, -0.4]}>
        <RBox s={[0.34, 0.05, 0.62]} r={0.02}><meshStandardMaterial color={rn(i + s, 4) > 0.5 ? "#c8b88a" : "#b8a478"} roughness={1} /></RBox>
        <mesh position={[0, 0.05, -0.05]} scale={[1, 0.35, 1]}><capsuleGeometry args={[0.08, 0.36, 6, 12]} /><meshStandardMaterial color="#8a7e6a" roughness={1} /></mesh>
      </group>)}
      {i % 2 === 0 && <mesh position={[-0.89, 0.9, -0.4]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.24, 0.36]} />{M.glow({ col: "#e8dcc0", op: 0.55 })}</mesh>}
    </group>; })}
    {[0, 1, 2].map((i) => <pointLight key={i} position={[0, 1.0, -1 - i * 3 - (D > 0 ? 0 : 0)]} intensity={1.4} distance={3.5} color="#ffd8a0" />)}
  </>}</U3>;
};

// ---- CloacaLimpia · «moría casi cuatro de cada diez… No fue un medicamento. Fue limpiar»: corte del hospital: la cloaca tapada
// debajo sube vapor verde a las camas; destapan la cloaca, el agua corre, el vapor se va y el porcentaje cae ----
export const CloacaLimpia3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aL = Math.min(sec(p, "limpiar", 2.4), D - 2);
  const pct = (tt: number) => 42 - 40 * eio(tt, aL + 0.3, D - 0.3);
  return <U3 d={d} bg={p.bg} ground={null} mode="drop" key1={[-1.2, 2.6, 2.0]} backZ={-1.4}
    cam={{ at: [0, 0.25, 0], az: [-0.15, 0.1], el: [0.12, 0.08], r: [2.4, 2.1], fov: 36 }}
    over={(tt) => <Drums v={Math.round(pct(tt))} n={2} x={1330} y={140} s={1.3} unit="%" />}>{(tt) => {
    const flow = eio(tt, aL, aL + 0.8), bad = 1 - eio(tt, aL + 0.2, aL + 1.6);
    return <>
      {/* el piso del pabellón y las diez camas */}
      <RBox s={[3.0, 0.08, 0.7]} r={0.005} p={[0, 0.3, 0]}><meshStandardMaterial map={rockT("pabellon", [170, 156, 132], 4, 1)} roughness={1} /></RBox>
      {Array.from({ length: 10 }, (_, i) => { const sick = i % 3 === 1 || i === 8; const dark = sick ? 0.65 * bad : 0;
        return <group key={i} position={[-1.3 + i * 0.29, 0.36, 0]}>
          <RBox s={[0.22, 0.04, 0.42]} r={0.015}><meshStandardMaterial color={new THREE.Color().setRGB(0.78 - dark * 0.6, 0.72 - dark * 0.55, 0.56 - dark * 0.45)} roughness={1} /></RBox>
          <mesh position={[0, 0.04, -0.03]} scale={[1, 0.4, 1]}><capsuleGeometry args={[0.06, 0.24, 6, 10]} /><meshStandardMaterial color="#9a8e78" roughness={1} /></mesh>
        </group>; })}
      {/* la tierra y la cloaca debajo */}
      <mesh position={[0, -0.1, -0.1]}><boxGeometry args={[3.0, 0.72, 0.5]} /><meshStandardMaterial map={rockT("subsuelo", [110, 90, 70], 3, 1)} roughness={1} /></mesh>
      <mesh position={[0, -0.18, 0.16]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.1, 0.1, 3.0, 24, 1, true]} /><meshStandardMaterial color="#6a5240" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.18, 0.16]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.085, 0.085, 2.98, 24]} /><meshStandardMaterial color={new THREE.Color().setRGB(lerp(0.32, 0.28, flow), lerp(0.24, 0.48, flow), lerp(0.12, 0.62, flow))} roughness={0.3} /></mesh>
      {/* el agua que corre al destapar */}
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-1.5 + ((i / 12 + tt * 0.5) % 1) * 3, -0.1, 0.25]}><sphereGeometry args={[0.025, 10, 8]} /><meshBasicMaterial color="#cfe8f4" transparent opacity={0.8 * flow} depthWrite={false} /></mesh>)}
      {/* el vapor verde que sube a las camas */}
      {Array.from({ length: 26 }, (_, i) => { const ph = (tt * 0.35 + rn(i, 1)) % 1; return <mesh key={i} position={[-1.4 + rn(i, 2) * 2.8, -0.05 + ph * 0.75, 0.1 + rn(i, 3) * 0.2]} scale={0.6 + ph}><sphereGeometry args={[0.05, 10, 8]} /><meshBasicMaterial color="#8ab84a" transparent opacity={0.28 * (1 - ph) * bad} depthWrite={false} /></mesh>; })}
    </>;
  }}</U3>;
};

// ---- CuerdasTiempo · «el ranking hasta ahora»: una viga con cinco sogas; cada soga baja según lo que aguantaste y en la punta
// cuelga su objeto con el tiempo grabado ----
const RK = [["3 MIN", 180, "casco"], ["10 MIN", 600, "arco"], ["30 SEG", 30, "pala"], ["1 HORA", 3600, "tambor"], ["20 MIN", 1200, "balde"]] as const;
export const CuerdasTiempo3D: React.FC<UP> = ({ d, p }) => {
  const a0 = sec(p, "ranking", 0.3), step = Math.max(0.6, (d / 30 - a0 - 1.2) / 5);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="drop" key1={[-1.0, 2.6, 2.0]}
    cam={{ at: [0, 0.75, 0], az: [-0.12, 0.1], el: [0.08, 0.04], r: [2.6, 2.4], fov: 36 }}>{(tt) => <>
    <RBox s={[2.6, 0.1, 0.12]} r={0.012} p={[0, 1.45, 0]}><meshStandardMaterial map={tex.wood(4, 1, [100, 64, 34])} roughness={0.7} /></RBox>
    {RK.map(([w, s, o], i) => { const L = 0.15 + 0.95 * Math.log10(s / 20) / Math.log10(3600 / 20), k = eio(tt, a0 + i * step, a0 + i * step + 0.7), len = Math.max(0.01, L * k), x = -1.0 + i * 0.5, sw = 0.05 * Math.sin(tt * 2 * PI * 0.5 + i) * (1 - k * 0.5);
      return <group key={i} position={[x, 1.4, 0]} rotation={[0, 0, sw]}>
        <mesh position={[0, -len / 2, 0]}><cylinderGeometry args={[0.008, 0.008, len, 8]} /><meshStandardMaterial color="#c8a878" roughness={0.9} /></mesh>
        <group position={[0, -len - 0.08, 0]}>
          {o === "casco" && <mesh scale={[1, 1.2, 1.1]}><sphereGeometry args={[0.07, 24, 14, 0, 2 * PI, 0, PI * 0.62]} />{M.brass({ col: "#a8823a" })}</mesh>}
          {o === "arco" && <mesh rotation={[0, 0, 0]}><torusGeometry args={[0.12, 0.008, 8, 30, PI * 0.7]} /><meshStandardMaterial map={tex.wood(1, 3, [170, 110, 60])} /></mesh>}
          {o === "pala" && <group><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.008, 0.008, 0.16, 8]} />{M.wood({ base: [120, 84, 50] })}</mesh><RBox s={[0.08, 0.1, 0.01]} r={0.004} p={[0, -0.05, 0]}>{M.steel({ col: "#7a7e82" })}</RBox></group>}
          {o === "tambor" && <mesh><cylinderGeometry args={[0.07, 0.07, 0.09, 24]} /><meshStandardMaterial color="#2a4a8a" roughness={0.5} /></mesh>}
          {o === "balde" && <mesh geometry={latheG("balde", [[0.0, -0.05], [0.05, -0.05], [0.065, 0.05], [0.06, 0.05], [0.045, -0.04], [0.0, -0.04]], 28)}>{M.wood({ base: [130, 92, 54] })}</mesh>}
          <Plate k={"rk" + i} txt={w} w={0.3} h={0.08} p={[0, -0.16, 0.02]} />
        </group>
      </group>; })}
  </>}</U3>;
};
