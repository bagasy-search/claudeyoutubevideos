// dur29b · segunda versión del bloque B (tambor con arvejas, cuerda, Rusia, tambor de órdenes, la nieve, las cinco cosas, el pasillo,
// la cloaca y las cuerdas del tiempo): cada idea es UN mecanismo que se ve, sin carteles que haya que leer.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex, tubeG } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, EnSitio, Plate, fallY, latheG, pop, rockT } from "./kb";
import { Casco } from "./v3a";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;
const EARTH = [120, 92, 64];

// ---- TamborArvejas · primer plano enorme: el tambor de cuero con las arvejas y el cuenco de agua ocupan el cuadro; la cámara baja
// por el corte de tierra hasta el zapador que pica el techo; vuelve a subir y en «saltaban» cada golpe hace saltar las arvejas ----
const TamborArvejas: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aS = Math.min(sec(p, "saltaban", 2.4), D - 1.5);
  return <U3 d={d} bg={p.bg} ground={null} mode="iris" key1={[-1.0, 2.4, 1.8]}
    cam={{ at: [0.0, 0.1, 0], at1: [0.0, 0.05, 0], az: [-0.3, -0.12], el: [0.42, 0.3], r: [1.0, 0.85], fov: 36 }}>{(tt) => {
    const h = (tt * 1.1) % 1, knock = Math.exp(-h * 8) * eio(tt, 0.3, aS);
    return <>
      <mesh position={[0, -0.32, -0.1]}><boxGeometry args={[2.0, 0.64, 0.8]} /><meshStandardMaterial map={rockT("tambor3", EARTH, 3, 1)} roughness={1} /></mesh>
      <mesh position={[0, 0.002, -0.1]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.0, 0.8]} /><meshStandardMaterial map={dirtT([110, 112, 70])} roughness={1} /></mesh>
      {/* el túnel en el corte, con el zapador grande y su lámpara */}
      <mesh position={[0, -0.44, 0.302]}><planeGeometry args={[1.6, 0.26]} /><meshBasicMaterial color="#2a1a10" /></mesh>
      <pointLight position={[0.05, -0.38, 0.5]} intensity={1.2} distance={0.9} color="#ffb060" />
      <group position={[0.05, -0.57, 0.33]}><Stickman escala={0.1} rotY={90} guion={[{ t: 0, accion: "empujar", expr: "decidido" }]} semilla={12} contacto={0} /></group>
      <group position={[0.16, -0.4, 0.34]} rotation={[0, 0, -0.9 + 0.9 * Math.exp(-h * 8)]}>
        <mesh position={[0.07, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.16, 6]} /><meshStandardMaterial map={tex.wood(1, 2, [120, 84, 50])} /></mesh>
        <mesh position={[0.15, 0.0, 0]}><boxGeometry args={[0.016, 0.1, 0.016]} />{M.steel({ col: "#a0a4a8" })}</mesh></group>
      {/* la onda que sube por la tierra hasta el tambor */}
      {[0, 1].map((k) => { const ph = (h + k / 2) % 1; return <mesh key={k} position={[0.05, -0.35 + ph * 0.32, 0.305]} scale={[1 + ph, 1, 1]}><planeGeometry args={[0.3, 0.012]} /><meshBasicMaterial color="#ffb070" transparent opacity={(1 - ph) * 0.6} depthWrite={false} toneMapped={false} /></mesh>; })}
      <group position={[-0.16, 0, 0.05]} scale={1.35}>
        <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.16, 0.16, 0.16, 32, 1, true]} /><meshStandardMaterial map={tex.wood(3, 1, [140, 70, 40])} side={THREE.DoubleSide} /></mesh>
        {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[Math.cos(i * PI / 5) * 0.162, 0.08, Math.sin(i * PI / 5) * 0.162]} rotation={[0, -i * PI / 5, 0.5]}><cylinderGeometry args={[0.003, 0.003, 0.18, 4]} /><meshStandardMaterial color="#e8dcc0" /></mesh>)}
        <mesh position={[0, 0.16 - 0.004 * knock, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.16, 32]} /><meshStandardMaterial color="#e8dcc0" roughness={0.8} /></mesh>
        {Array.from({ length: 30 }, (_, i) => { const a = rn(i, 1) * 2 * PI, r = Math.sqrt(rn(i, 2)) * 0.13, hop = 0.12 * knock * (0.5 + rn(i, 3));
          return <mesh key={i} position={[Math.cos(a) * r, 0.176 + hop, Math.sin(a) * r]}><sphereGeometry args={[0.016, 12, 10]} /><meshStandardMaterial color="#6a9a3a" roughness={0.5} /></mesh>; })}
      </group>
      <group position={[0.3, 0, 0.12]} scale={1.3}>
        <mesh geometry={latheG("cuenco4", [[0.0, 0], [0.1, 0.0], [0.13, 0.05], [0.14, 0.08], [0.13, 0.08], [0.12, 0.05], [0.0, 0.02]], 36)}><meshStandardMaterial color="#a8643a" roughness={0.8} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.065 + 0.004 * knock, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.125, 36]} />{M.water({ col: "#4a7a8a" })}</mesh>
        {[0, 1, 2].map((i) => { const ph = (h + i / 3) % 1; return <mesh key={i} position={[0, 0.068, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[ph * 0.11, ph * 0.11 + 0.006, 36]} /><meshBasicMaterial color="#e8f4f8" transparent opacity={eio(tt, 0.3, aS) * (1 - ph) * 0.9} depthWrite={false} /></mesh>; })}
      </group>
      <spotLight position={[0, 1.4, 0.8]} angle={0.4} penumbra={0.6} intensity={6} distance={3} color="#ffe8c8" />
    </>;
  }}</U3>;
};

// ---- CuerdaTirones · la soga corre por el túnel hasta una campana; cada tirón es una onda que viaja y la campana se mueve una, dos,
// tres veces; a la tercera el minero sale corriendo ----
const CuerdaTirones: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, at = ["uno", "dos", "tres"].map((k, i) => sec(p, k, 0.5 + i * 1.3)), aR = Math.min(at[2] + 1.2, D - 1.0);
  return <U3 d={d} bg={p.bg} ground={null} mode="iris" key1={[-0.8, 2.0, 1.6]}
    cam={{ at: [0.3, 0.26, 0], az: [-0.5, -0.15], el: [0.18, 0.12], r: [1.15, 0.95], fov: 34 }}>{(tt) => {
    const waves: number[] = [], arr: number[] = [];
    at.forEach((a, i) => { for (let j = 0; j <= i; j++) { const s = a + j * 0.35; arr.push(s + 0.9); if (tt > s && tt < s + 0.9) waves.push((tt - s) / 0.9); } });
    const pts = Array.from({ length: 41 }, (_, i) => { const u = i / 40, x = -1.2 + u * 2.0; let y = 0.03; waves.forEach((w) => { y += 0.13 * Math.exp(-Math.pow((u - w) * 9, 2)); }); return [x, y, 0.06 * Math.sin(u * 5)]; });
    const ring = arr.reduce((s, a) => s + (tt > a ? Math.exp(-(tt - a) * 4) * Math.sin((tt - a) * 2 * PI * 1.6) : 0), 0);
    const run = eio(tt, aR, aR + 1.4);
    return <>
      <mesh position={[0, -0.01, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 1.6]} /><meshStandardMaterial map={dirtT([96, 76, 56])} roughness={1} /></mesh>
      {[-1.0, -0.4, 0.2].map((x, i) => <group key={i} position={[x, 0, -0.4]}><RBox s={[0.04, 0.6, 0.04]} p={[0, 0.3, 0]}>{M.wood({ base: [120, 84, 50] })}</RBox></group>)}
      <mesh geometry={tubeG("tiron2_" + Math.round(tt * 30), pts, 0.014, 80, 8)}><meshStandardMaterial color="#d8b888" roughness={0.9} /></mesh>
      {/* el poste con la campana de bronce */}
      <RBox s={[0.05, 0.62, 0.05]} p={[0.86, 0.31, 0]}>{M.wood({ base: [110, 74, 42] })}</RBox>
      <RBox s={[0.22, 0.04, 0.05]} p={[0.78, 0.6, 0]}>{M.wood({ base: [110, 74, 42] })}</RBox>
      <mesh geometry={tubeG("cuerda_c", [[0.8, 0.03, 0.06], [0.74, 0.25, 0.0], [0.7, 0.44, 0]], 0.006, 20, 6)}><meshStandardMaterial color="#c8a878" roughness={0.9} /></mesh>
      <group position={[0.7, 0.58, 0]} rotation={[0, 0, 0.5 * ring]}>
        <mesh position={[0, -0.09, 0]} geometry={latheG("campana_t", [[0.0, 0.09], [0.03, 0.085], [0.05, 0.03], [0.075, -0.04], [0.08, -0.05], [0.0, -0.05]], 32)}>{M.brass()}</mesh>
        <mesh position={[0.02 * ring, -0.16, 0]}><sphereGeometry args={[0.014, 10, 8]} />{M.steel()}</mesh></group>
      {[0, 1].map((k) => { const ph = (tt * 1.5 + k / 2) % 1; return <mesh key={k} position={[0.7, 0.5, 0.02]}><ringGeometry args={[0.1 + ph * 0.2, 0.108 + ph * 0.2, 40]} /><meshBasicMaterial color="#ffe0a0" transparent opacity={0.5 * (1 - ph) * cl(Math.abs(ring) * 3)} depthWrite={false} toneMapped={false} /></mesh>; })}
      {/* el minero: quieto junto a la campana; a la tercera, sale corriendo */}
      <group position={[0.5 - 2.0 * run, 0, 0.12]} visible={tt < aR}><Stickman escala={0.12} rotY={-30} guion={[{ t: 0, accion: "idle", expr: "nervioso" }, { t: at[2] + 0.6, accion: "asustarse", expr: "asustado" }] as any} semilla={14} contacto={0.3} colorContacto="#1a120c" /></group>
      <group position={[0.5 - 2.0 * run, 0, 0.12]} visible={tt >= aR}><EnSitio tt={tt} accion="correr" escala={0.12} rotY={-90} expr="asustado" semilla={14} /></group>
      <mesh position={[-0.9, 0.36, -0.35]}><sphereGeometry args={[0.02, 10, 8]} />{M.glow({ col: "#ffd27a" })}</mesh>
      <pointLight position={[-0.9, 0.36, -0.2]} intensity={0.8} distance={1.6} color="#ffc070" />
      <pointLight position={[0.7, 0.7, 0.3]} intensity={0.9} distance={1.4} color="#ffd8a0" />
    </>;
  }}</U3>;
};

// ---- ColumnaRusia · mapa en relieve: cien soldaditos de arcilla marchan hasta Moscú; a la vuelta caen de a uno y quedan como
// montoncitos de nieve; los rodillos bajan con ellos ----
const N_SOL = 100;
const ColumnaRusia: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aM = sec(p, "moscu", 1.6), aV = Math.min(Math.max(sec(p, "volver", 3), aM + 0.6), D - 2.2);
  const back = (tt: number) => eio(tt, aV, D - 0.3);
  const alive = (tt: number) => { let n = 0; for (let i = 0; i < N_SOL; i++) if (back(tt) < 0.2 + 0.8 * rn(i, 9) || rn(i, 9) > 0.85) n++; return n; };
  const path = (u: number) => [-1.25 + 2.35 * u, 0.15 * Math.sin(u * 4)];
  return <U3 d={d} bg={p.bg} ground={[200, 190, 170]} mode="drop" key1={[-1.0, 2.8, 1.4]}
    cam={{ at: [-0.55, 0.06, 0.05], at1: [0.75, 0.06, 0.05], az: [-0.35, -0.2], el: [0.24, 0.2], r: [1.15, 1.05], fov: 36 }}
    over={(tt) => <Drums v={Math.round(alive(tt) * 6)} n={3} x={1180} y={260} s={1.3} unit="mil" />}>{(tt) => {
    const go = eio(tt, 0.2, aM), b = back(tt), snow = eio(tt, aV - 0.6, aV + 0.4);
    return <>
      {/* el camino y los ríos */}
      <mesh geometry={tubeG("camino_r", Array.from({ length: 21 }, (_, i) => { const [x, z] = path(i / 20); return [x, 0.004, z]; }), 0.05, 60, 4)}><meshStandardMaterial color="#a89474" roughness={1} /></mesh>
      
      {Array.from({ length: N_SOL }, (_, i) => { const lag = (i % 50) * 0.012, lane = Math.floor(i / 50) * 0.07 - 0.035;
        const th = 0.2 + 0.8 * rn(i, 9), dies = rn(i, 9) <= 0.85, dead = dies && b > th;
        const u = tt < aV ? cl(go - lag) : 1 - cl((dead ? th : b) - lag * 0.5);
        const [x, z] = path(Math.max(0, u)), fallK = dead ? eio(b, th, th + 0.05) : 0, mound = dead ? cl((b - th) * 4) : 0;
        return <group key={i} position={[x, 0, z + lane + (b > 0 ? 0.08 : 0)]} visible={u > 0.001 || tt > aV}>
          <group rotation={[0, 0, -PI / 2 * fallK]} scale={1.5}>
            <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.016, 0.022, 0.08, 8]} /><meshStandardMaterial color={b > 0 ? "#3a3a40" : "#4a5a8a"} roughness={0.9} /></mesh>
            <mesh position={[0, 0.105, 0]}><sphereGeometry args={[0.018, 8, 6]} /><meshStandardMaterial color="#d8c0a0" roughness={0.9} /></mesh></group>
          <mesh position={[0, 0.0, 0]} scale={[1, Math.max(0.001, mound), 1]}><sphereGeometry args={[0.055, 12, 8, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color="#f2f5f8" roughness={0.9} /></mesh>
        </group>; })}
      <group position={[1.12, 0, 0.15 * Math.sin(4)]} scale={pop(tt, aM - 0.4)}>
        {[[0, 0], [0.08, 0.05], [-0.07, 0.06]].map(([x, z], i) => <group key={i} position={[x, 0, z]}><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.035, 0.035, 0.14, 12]} /><meshStandardMaterial color="#d8ccb0" /></mesh><mesh position={[0, 0.16, 0]}><sphereGeometry args={[0.04, 14, 10]} />{M.brass()}</mesh></group>)}
        <mesh position={[0, 0.24, 0]} scale={[1, 1 + 0.1 * Math.sin(tt * 2 * PI * 1.2), 1]}><coneGeometry args={[0.07, 0.2, 12]} />{M.glow({ col: "#ff9a4a", op: 0.6 * eio(tt, aM, aM + 0.8) })}</mesh>
      </group>
      <Plate k="moscu2" txt="MOSCÚ" w={0.36} h={0.1} p={[0.95, 0.06, 0.4]} rot={[-0.5, 0, 0]} font={80} />
      {Array.from({ length: 70 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 3, 1.2 - ((rn(i, 2) + tt * 0.25) % 1) * 1.2, (rn(i, 3) - 0.5) * 1.6]}><sphereGeometry args={[0.008, 6, 6]} /><meshBasicMaterial color="#fff" transparent opacity={0.8 * snow} depthWrite={false} /></mesh>)}
    </>;
  }}</U3>;
};

// ---- TamborOrdenes · el tambor adelante; detrás, una fila de soldaditos que obedece cada redoble: marcha, frena en seco, carga ----
const RIT2 = [[0, 0.5, 1.0, 1.5], [0, 0.2, 0.4], [0, 0.15, 0.3, 0.45, 0.6, 0.75]];
const TamborOrdenes: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, a0 = sec(p, "radio", 0.4), step = Math.max(1.4, (D - a0 - 0.6) / 3);
  const xo = (tt: number) => { const s = Math.max(0, tt - a0); return 0.12 * Math.min(s, step) + Math.min(0.4, 0.3 * Math.max(0, s - 2 * step)); };
  return <U3 d={d} bg={p.bg} ground={[150, 132, 100]} mode="iris" key1={[-1.0, 2.4, 1.8]}
    cam={{ at: [0.0, 0.3, 0.0], az: [-0.25, 0.18], el: [0.14, 0.1], r: [1.45, 1.2], fov: 34 }}>{(tt) => {
    const s = Math.max(0, tt - a0), cur = Math.min(2, Math.floor(s / step)), lt = s - cur * step;
    const hits = RIT2[cur], last = hits.reduce((m, h) => (lt >= h ? h : m), -9), hit = Math.exp(-Math.max(0, lt - last) * 12);
    const X = xo(tt), mode = tt < a0 ? 0 : cur === 1 ? 1 : cur === 2 ? 2 : 0, jolt = cur === 1 ? Math.exp(-lt * 5) * 0.05 : 0;
    return <>
      <group position={[0.0, 0.02, 0.42]}>
        <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.2, 0.2, 0.26, 40, 1, true]} /><meshStandardMaterial color="#2a4a8a" roughness={0.5} side={THREE.DoubleSide} /></mesh>
        {[0.05, 0.31].map((y, i) => <mesh key={i} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.205, 0.014, 10, 40]} /><meshStandardMaterial color="#c8302a" roughness={0.6} /></mesh>)}
        <mesh position={[0, 0.315, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.2, 40]} /><meshStandardMaterial color="#efe6d2" roughness={0.8} /></mesh>
        {[-1, 1].map((k) => <group key={k} position={[k * 0.1, 0.33 + 0.06 * (1 - hit), 0.05]} rotation={[0.9 - 0.4 * (1 - hit), 0, k * 0.3]}><mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.007, 0.009, 0.17, 8]} /><meshStandardMaterial map={tex.wood(1, 3, [200, 160, 110])} /></mesh></group>)}
      </group>
      {/* la onda de cada golpe corre por el piso hasta la fila */}
      {[0].map((k) => { const ph = cl(Math.max(0, lt - last) / 0.8); return <mesh key={k} position={[0.0, 0.006, 0.42]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.2 + ph * 1.1, 0.215 + ph * 1.1, 64]} /><meshBasicMaterial color="#ffe0a0" transparent opacity={0.55 * (1 - ph) * (tt > a0 ? 1 : 0)} depthWrite={false} toneMapped={false} /></mesh>; })}
      {Array.from({ length: 7 }, (_, i) => { const x = -0.85 + i * 0.2 + X + jolt;
        return <group key={i} position={[x, 0, -0.25]}>
          <group visible={mode === 1}><Stickman escala={0.11} rotY={90} guion={[{ t: 0, accion: "idle", expr: "decidido" }]} semilla={90 + i} contacto={0.3} colorContacto="#1a120c" /></group>
          <group visible={mode !== 1}><EnSitio tt={tt + i * 0.07} accion="caminar" escala={0.11} rotY={90} expr={mode === 2 ? "enojado" : "decidido"} semilla={90 + i} /></group>
          <mesh position={[0.06, mode === 2 ? 0.2 : 0.42, 0.04]} rotation={[0, 0, mode === 2 ? -PI / 2 + 0.2 : 0]}><cylinderGeometry args={[0.006, 0.006, 0.6, 6]} /><meshStandardMaterial map={tex.wood(1, 4, [120, 84, 50])} /></mesh>
        </group>; })}
    </>;
  }}</U3>;
};

// ---- NoTeSientes · seis caminan por la nieve; uno se sienta y se queda; los otros se alejan y la nieve lo tapa hasta un montículo ----
const NoTeSientes: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aS = sec(p, "sentaba", 0.8), aD = Math.min(sec(p, "levantaba", 2.6), D - 1);
  const v = 0.14, sx = 0.25 - v * aS;
  return <U3 d={d} bg={p.bg} ground={[200, 208, 220]} sky="#3a4452" mode="drop" key1={[-1.0, 2.6, 1.6]}
    cam={{ at: [0.0, 0.22, 0], az: [-0.42, -0.3], el: [0.16, 0.12], r: [1.7, 1.3], fov: 34 }}>{(tt) => {
    const cover = eio(tt, aS + 0.5, D - 0.4), sat = tt >= aS;
    return <>
      {Array.from({ length: 5 }, (_, i) => <group key={i} position={[0.25 + (i + 1) * 0.26 - v * tt - (i % 2) * 0.05, 0, (i % 2 ? -0.12 : -0.3)]}><EnSitio tt={tt + i * 0.13} accion="caminar" escala={0.13} rotY={-90} expr="triste" semilla={40 + i} color="#5a4a40" /></group>)}
      <group position={[0.25 - v * tt, 0, 0.26]} visible={!sat}><EnSitio tt={tt} accion="caminar" escala={0.13} rotY={-90} expr="triste" semilla={32} color="#c8442a" /></group>
      <group position={[sx, 0, 0.26]} visible={sat}><Stickman escala={0.13} rotY={-60} guion={[{ t: 0, accion: "sentarse", expr: "dormido" }]} semilla={32} contacto={0.3} colorContacto="#7a8a9a" color="#c8442a" /></group>
      <mesh position={[sx, 0, 0.26]} scale={[1, Math.max(0.001, cover * 1.15), 1]}><sphereGeometry args={[0.17, 32, 16, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color="#f2f5f8" roughness={0.9} transparent opacity={0.35 + 0.6 * cover} /></mesh>
      {/* las huellas que se van tapando */}
      {Array.from({ length: 14 }, (_, i) => <mesh key={"h" + i} position={[sx - 0.1 + i * 0.12, 0.002, 0.26 + (i % 2 ? 0.04 : -0.04)]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.02, 12]} /><meshBasicMaterial color="#9aa4b4" transparent opacity={0.6 * (1 - cover)} depthWrite={false} /></mesh>)}
      {Array.from({ length: 80 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 2.4, 1.3 - ((rn(i, 2) + tt * 0.18) % 1) * 1.3, (rn(i, 3) - 0.5) * 1.4]}><sphereGeometry args={[0.007, 6, 6]} /><meshBasicMaterial color="#fff" transparent opacity={0.85} depthWrite={false} /></mesh>)}
    </>;
  }}</U3>;
};

// ---- TopCinco · cinco pedestales distintos; en cada número cae su objeto con rebote: la balanza con la mochila, la nube que nieva,
// la campana callada, el plato vacío y el termómetro que se pone rojo ----
const T5 = ["cinco", "cuatro", "tres", "dos", "uno"];
export const Obj5: React.FC<{ i: number; tt: number; on: number }> = ({ i, tt, on }) => {
  if (i === 0) { const tl = -0.35 * on; return <group>
    <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.01, 0.014, 0.32, 10]} />{M.brass()}</mesh>
    <group position={[0, 0.32, 0]} rotation={[0, 0, tl]}><RBox s={[0.4, 0.016, 0.02]} r={0.004}>{M.brass()}</RBox>
      <group position={[-0.18, -0.06, 0]} rotation={[0, 0, -tl]}><mesh><cylinderGeometry args={[0.07, 0.06, 0.01, 24]} />{M.brass({ col: "#b88c40" })}</mesh>
        <RBox s={[0.1, 0.12, 0.07]} r={0.02} p={[0, 0.065, 0]}><meshStandardMaterial color="#5a5a3a" roughness={0.9} /></RBox></group>
      <group position={[0.18, -0.06, 0]} rotation={[0, 0, -tl]}><mesh><cylinderGeometry args={[0.07, 0.06, 0.01, 24]} />{M.brass({ col: "#b88c40" })}</mesh></group></group></group>; }
  if (i === 1) return <group position={[0, 0.0, 0]}>
    {/* el clima: una bota atrapada en un bloque de hielo */}
    <mesh position={[0, 0.11, 0]}><boxGeometry args={[0.22, 0.22, 0.16]} />{M.glass({ op: 0.35, col: "#cfe6f4" })}</mesh>
    <group position={[0, 0.03, 0]} rotation={[0, 0.4, 0]}><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.035, 0.04, 0.12, 16]} /><meshStandardMaterial color="#3a2618" roughness={0.7} /></mesh>
      <RBox s={[0.12, 0.04, 0.06]} r={0.015} p={[0.035, 0.0, 0]}><meshStandardMaterial color="#3a2618" roughness={0.7} /></RBox></group>
    {Array.from({ length: 6 }, (_, k) => <mesh key={k} position={[-0.09 + k * 0.036, 0.205, 0.081]} rotation={[PI, 0, 0]}><coneGeometry args={[0.008, 0.04 + 0.02 * rn(k, 1), 6]} />{M.glass({ op: 0.6, col: "#e8f4fc" })}</mesh>)}
  </group>;
  if (i === 2) return <group position={[0, 0.14, 0]}><mesh geometry={latheG("campana5b", [[0.0, 0.14], [0.035, 0.13], [0.06, 0.05], [0.1, -0.05], [0.105, -0.06], [0.0, -0.06]], 32)}>{M.brass()}</mesh>
    <mesh position={[0, -0.04, 0]}><sphereGeometry args={[0.018, 10, 8]} />{M.steel()}</mesh>
    <mesh position={[0, -0.02, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.06, 0.008, 8, 24]} /><meshStandardMaterial color="#c8a878" roughness={0.9} /></mesh></group>;
  if (i === 3) return <group position={[0, 0.03, 0]}><mesh geometry={latheG("plato5b", [[0.0, 0], [0.11, 0.0], [0.16, 0.035], [0.15, 0.04], [0.1, 0.01], [0.0, 0.01]], 36)}>{M.steel({ col: "#a8acb0" })}</mesh>
    <group position={[0.04, 0.03, 0.05]} rotation={[0, 0.6, 0]}><mesh position={[0.07, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.14, 8]} />{M.steel({ col: "#c8ccd0" })}</mesh><mesh scale={[1, 0.3, 0.7]}><sphereGeometry args={[0.03, 14, 10]} />{M.steel({ col: "#c8ccd0" })}</mesh></group></group>;
  return <group position={[0, 0.02, 0]}>
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.025, 0.025, 0.36, 20]} />{M.glass({ op: 0.3 })}</mesh>
    <mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.045, 20, 16]} /><meshStandardMaterial color="#c0281e" roughness={0.3} emissive="#ff2010" emissiveIntensity={0.5 * on} /></mesh>
    <mesh position={[0, 0.04 + 0.15 * (0.15 + 0.85 * on), 0]}><cylinderGeometry args={[0.012, 0.012, Math.max(0.01, 0.3 * (0.15 + 0.85 * on)), 12]} /><meshStandardMaterial color="#c0281e" emissive="#ff2010" emissiveIntensity={0.5 * on} /></mesh></group>;
};
const PED = [[0.36, 0.22, "piedra"], [0.3, 0.3, "madera"], [0.32, 0.38, "piedra"], [0.34, 0.46, "madera"], [0.3, 0.56, "bronce"]] as const;
const TopCinco: React.FC<UP> = ({ d, p }) => {
  const at = T5.map((k, i) => sec(p, k, 0.4 + i * 1.4));
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="wipe" key1={[-1.0, 2.6, 2.0]}
    cam={{ at: [0, 0.55, 0], az: [-0.12, 0.1], el: [0.18, 0.14], r: [2.35, 2.1], fov: 36 }}>{(tt) => <>
    {PED.map(([w, h, m], i) => { const x = -1.0 + i * 0.5, on = eio(tt, at[i] + 0.3, at[i] + 1.2), cur = at.filter((a) => tt > a).length - 1 === i ? 1 : 0, past = tt > at[i] && !cur ? 1 : 0;
      return <group key={i} position={[x, 0, 0]}>
        {m === "madera" ? <RBox s={[w, h, w]} r={0.01} p={[0, h / 2, 0]}><meshStandardMaterial map={tex.wood(1, 2, [110, 72, 40])} roughness={0.8} /></RBox>
          : m === "bronce" ? <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[w / 2, w / 2 + 0.03, h, 32]} />{M.brass({ col: "#8a6a30" })}</mesh>
          : <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[w / 2, w / 2, h, 6]} /><meshStandardMaterial map={dirtT([150, 142, 128])} roughness={0.95} /></mesh>}
        <Plate k={"t5b" + i} txt={String(5 - i)} w={0.22} h={0.2} p={[0, h * 0.55, w / 2 + 0.02]} mat="brass" font={100} />
        <mesh position={[0, h + 0.003, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.13, 32]} /><meshBasicMaterial color="#000" transparent opacity={0.35 * cl((tt - at[i]) * 3)} depthWrite={false} /></mesh>
        <group position={[0, h + fallY(tt, at[i], 0.9), 0]} visible={tt > at[i] - 0.3}><group scale={2.3 * (1 - 0.3 * past) * (1 + 0.15 * cur)}><Obj5 i={i} tt={tt} on={on} /></group></group>
        <spotLight position={[x, 2.2, 0.6]} angle={0.2} penumbra={0.6} intensity={1.5 + 18 * cur + 3 * past} distance={3} color={i === 4 ? "#ffc8b0" : "#ffe8c0"} />
      </group>; })}
  </>}</U3>;
};

// ---- PasilloInfinito · camas de hierro con sábana blanca y un bulto, en espejo a los dos lados; la cámara avanza y la puerta del
// fondo nunca se acerca ----
const PasilloInfinito: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, z0 = -1.0, z1 = -3.6;
  return <U3 d={d} bg={p.bg} ground={null} sky="#1a1612" mode="iris" key1={[0.0, 2.0, 0.0]} backZ={-30}
    cam={{ at: [0, 0.45, z0], at1: [0, 0.45, z1], az: [0.0, 0.0], el: [0.06, 0.05], r: [1.2, 1.2], fov: 50 }}>{(tt) => {
    const cz = lerp(z0, z1, eio(tt, 0, D)) - 6.5;
    return <>
      <mesh position={[0, 0, -8]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.8, 20]} /><meshStandardMaterial map={rockT("piso2", [150, 136, 116], 2, 20)} roughness={1} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.9, 0.7, -8]} rotation={[0, -s * PI / 2, 0]}><planeGeometry args={[20, 1.4]} /><meshStandardMaterial map={rockT("pared2", [214, 204, 184], 20, 1)} roughness={1} /></mesh>)}
      {Array.from({ length: 20 }, (_, i) => { const z = 1.0 - i * 0.6; return <group key={i} position={[0, 0, z]}>
        {[-1, 1].map((s) => <group key={"c" + s} position={[s * 0.58, 0, -0.3]}>
          {[[-0.13, -0.28], [0.13, -0.28], [-0.13, 0.28], [0.13, 0.28]].map(([x, zz], k) => <mesh key={k} position={[x, 0.11, zz]}><cylinderGeometry args={[0.008, 0.008, 0.22, 6]} /><meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.5} /></mesh>)}
          <mesh position={[0, 0.27, -0.29]}><torusGeometry args={[0.12, 0.007, 6, 20, PI]} /><meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.5} /></mesh>
          <RBox s={[0.28, 0.05, 0.6]} r={0.02} p={[0, 0.24, 0]}><meshStandardMaterial color="#ece6da" roughness={1} /></RBox>
          <mesh position={[0, 0.28, 0.02]} scale={[1, 0.4, 1]}><capsuleGeometry args={[0.07, 0.34, 6, 12]} /><meshStandardMaterial color="#e4dccc" roughness={1} /></mesh>
          <mesh position={[0, 0.29, -0.23]} scale={[1, 0.5, 0.7]}><sphereGeometry args={[0.06, 12, 10]} /><meshStandardMaterial color="#f4f0e8" roughness={1} /></mesh>
        </group>)}
        {i % 2 === 0 && <mesh position={[-0.89, 0.95, -0.3]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.24, 0.36]} />{M.glow({ col: "#e8dcc0", op: 0.5 })}</mesh>}
      </group>; })}
      <mesh position={[0, 1.42, -8]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[1.8, 20]} /><meshStandardMaterial map={rockT("techo2", [180, 168, 148], 2, 20)} roughness={1} /></mesh>
      {/* la puerta del fondo: siempre a la misma distancia */}
      <group position={[0, 0, cz]}>
        <RBox s={[0.5, 0.95, 0.04]} r={0.01} p={[0, 0.48, 0]}><meshStandardMaterial map={tex.wood(1, 2, [110, 70, 40])} roughness={0.8} /></RBox>
        <mesh position={[0, 0.48, 0.03]}><planeGeometry args={[0.2, 0.7]} />{M.glow({ col: "#ffe8c0", op: 0.55 })}</mesh>
        <pointLight position={[0, 0.6, 0.5]} intensity={1.2} distance={3} color="#ffd8a0" />
      </group>
      {[0, 1, 2].map((i) => <pointLight key={i} position={[0, 1.0, -1 - i * 3]} intensity={1.4} distance={3.5} color="#ffd8a0" />)}
    </>;
  }}</U3>;
};

// ---- CloacaLimpia · corte del pabellón; en la punta de la cloaca un tapón de madera salta, sale el agua y arrastra el vapor verde;
// las camas se aclaran y los rodillos bajan ----
const CloacaLimpia: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aL = Math.min(sec(p, "limpiar", 2.4), D - 2);
  const pct = (tt: number) => 42 - 40 * eio(tt, aL + 0.4, D - 0.3);
  return <U3 d={d} bg={p.bg} ground={null} mode="iris" key1={[-1.2, 2.6, 2.0]} backZ={-1.4}
    cam={{ at: [0.6, 0.0, 0], az: [-0.5, -0.08], el: [0.14, 0.08], r: [1.6, 1.3], fov: 36 }}
    over={(tt) => <Drums v={Math.round(pct(tt))} n={2} x={1330} y={260} s={1.3} unit="%" />}>{(tt) => {
    const pop2 = eio(tt, aL, aL + 0.35), flow = eio(tt, aL + 0.1, aL + 0.8), bad = 1 - eio(tt, aL + 0.3, aL + 1.8);
    return <>
      <RBox s={[3.0, 0.08, 0.7]} r={0.005} p={[0, 0.3, 0]}><meshStandardMaterial map={rockT("pabellon2", [170, 156, 132], 4, 1)} roughness={1} /></RBox>
      {Array.from({ length: 10 }, (_, i) => { const sick = i % 3 === 1 || i === 8; const dk = sick ? 0.65 * bad : 0;
        return <group key={i} position={[-1.3 + i * 0.29, 0.36, 0]}>
          <RBox s={[0.22, 0.04, 0.42]} r={0.015}><meshStandardMaterial color={new THREE.Color().setRGB(0.78 - dk * 0.6, 0.72 - dk * 0.55, 0.56 - dk * 0.45)} roughness={1} /></RBox>
          <mesh position={[0, 0.04, -0.03]} scale={[1, 0.4, 1]}><capsuleGeometry args={[0.06, 0.24, 6, 10]} /><meshStandardMaterial color="#9a8e78" roughness={1} /></mesh>
        </group>; })}
      <mesh position={[-0.1, -0.1, -0.1]}><boxGeometry args={[2.8, 0.72, 0.5]} /><meshStandardMaterial map={rockT("subsuelo2", [110, 90, 70], 3, 1)} roughness={1} /></mesh>
      <mesh position={[-0.25, -0.18, 0.16]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.1, 0.1, 2.5, 24, 1, true]} /><meshStandardMaterial color="#6a5240" roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <mesh position={[-0.25, -0.18, 0.16]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.085, 0.085, 2.48, 24]} /><meshStandardMaterial color={new THREE.Color().setRGB(lerp(0.32, 0.36, flow), lerp(0.24, 0.3, flow), lerp(0.12, 0.2, flow))} roughness={0.3} /></mesh>
      {/* el tapón que salta */}
      <group position={[1.0 + 0.35 * pop2, -0.18 + 0.25 * pop2 - 0.4 * pop2 * pop2, 0.16]} rotation={[0, 0, -3 * pop2]}>
        <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.095, 0.085, 0.08, 20]} />{M.wood({ base: [130, 90, 50] })}</mesh></group>
      {/* el chorro que sale por la boca y el agua que corre por dentro */}
      {Array.from({ length: 16 }, (_, i) => { const ph = (tt * 1.2 + i / 16) % 1; return <mesh key={i} position={[1.02 + ph * 0.45, -0.2 - ph * ph * 0.3, 0.16 + (rn(i, 1) - 0.5) * 0.08]}><sphereGeometry args={[0.03, 10, 8]} /><meshStandardMaterial color="#6a5a40" roughness={0.4} transparent opacity={0.9 * flow} depthWrite={false} /></mesh>; })}
      {Array.from({ length: 14 }, (_, i) => { const ph = (i / 14 + tt * 0.6) % 1; return <mesh key={"a" + i} position={[-1.45 + ph * 2.45, -0.1, 0.26]}><sphereGeometry args={[0.03, 10, 8]} /><meshBasicMaterial color={i % 3 ? "#7a6a4a" : "#8ab84a"} transparent opacity={0.85 * flow} depthWrite={false} /></mesh>; })}
      {Array.from({ length: 26 }, (_, i) => { const ph = (tt * 0.35 + rn(i, 1)) % 1; return <mesh key={i} position={[-1.4 + rn(i, 2) * 2.8 + flow * ph * 0.6, -0.05 + ph * 0.75, 0.1 + rn(i, 3) * 0.2]} scale={Math.max(0.001, (0.6 + ph) * bad)}><sphereGeometry args={[0.07, 12, 10]} /><meshStandardMaterial color="#7ac83a" emissive="#3a8a1a" emissiveIntensity={0.5} transparent opacity={0.75 * (1 - ph)} depthWrite={false} /></mesh>; })}
    </>;
  }}</U3>;
};

// ---- CuerdasTiempo · cinco columnas de piedra que crecen desde el piso, una por puesto, cada una tan alta como lo que durarías;
// arriba de cada una su objeto grande; la que se nombra se ilumina y el contador muestra su tiempo; la más alta queda brillando ----
const RK = [[3, "min", 180, "casco"], [10, "min", 600, "arco"], [30, "seg", 30, "pala"], [1, "hora", 3600, "tambor"], [20, "min", 1200, "balde"]] as const;
const CuerdasTiempo: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, a0 = sec(p, "ranking", 0.3), step = Math.max(0.6, (D - a0 - 1.4) / 5), aF = a0 + 5 * step;
  const cur = (tt: number) => Math.min(4, Math.max(0, Math.floor((tt - a0) / step)));
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="drop" key1={[-1.0, 2.6, 2.0]} backDim={0.3}
    cam={{ at: [0, 0.5, 0], az: [-0.2, 0.12], el: [0.16, 0.12], r: [2.0, 1.8], fov: 36 }}
    over={(tt) => { const c = cur(tt); return <Drums v={RK[c][0] as number} n={2} x={1480} y={110} s={1.15} unit={RK[c][1] as string} op={eio(tt, a0, a0 + 0.3)} />; }}>{(tt) => <>
    {RK.map(([, , s, o], i) => { const L = 0.1 + 0.9 * Math.log10((s as number) / 20) / Math.log10(3600 / 20), k = eio(tt, a0 + i * step, a0 + i * step + 0.7), H = Math.max(0.01, L * k), x = -0.9 + i * 0.45;
      const lit = cur(tt) === i && tt > a0 ? 1 : 0, top = o === "tambor" ? eio(tt, aF, aF + 0.5) : 0;
      return <group key={i} position={[x, 0, 0]}>
        <mesh position={[0, H / 2, 0]}><cylinderGeometry args={[0.13, 0.15, H, 8]} /><meshStandardMaterial map={dirtT([150, 142, 128])} roughness={0.95} emissive="#ffd890" emissiveIntensity={0.12 * lit} /></mesh>
        <group position={[0, H + 0.01, 0]} scale={Math.max(0.001, k) * (o === "casco" ? 1.6 : 2.6)} rotation={[0, 0.4 * Math.sin(tt * 0.6 + i), 0]}>
          {o === "casco" && <group position={[0, -0.02, 0]}><Casco i={0} /></group>}
          {o === "arco" && <mesh position={[0, 0.08, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.1, 0.008, 8, 30, PI * 0.7]} /><meshStandardMaterial map={tex.wood(1, 3, [170, 110, 60])} /></mesh>}
          {o === "pala" && <group position={[0, 0.08, 0]}><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.007, 0.007, 0.14, 8]} />{M.wood({ base: [120, 84, 50] })}</mesh><RBox s={[0.07, 0.09, 0.01]} r={0.004} p={[0, -0.04, 0]}>{M.steel({ col: "#7a7e82" })}</RBox></group>}
          {o === "tambor" && <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.06, 0.06, 0.08, 24]} /><meshStandardMaterial color="#2a4a8a" roughness={0.5} emissive="#ffd890" emissiveIntensity={0.35 * top} /></mesh>}
          {o === "balde" && <mesh position={[0, 0.045, 0]} geometry={latheG("balde3", [[0.0, -0.045], [0.045, -0.045], [0.058, 0.045], [0.054, 0.045], [0.04, -0.035], [0.0, -0.035]], 28)}>{M.wood({ base: [130, 92, 54] })}</mesh>}
        </group>
        <spotLight position={[x * 0.5, 2.2, 0.9]} angle={0.16} penumbra={0.6} intensity={1.5 + 12 * Math.max(lit, top)} distance={3.2} color="#ffe0b0" />
      </group>; })}
  </>}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { TamborArvejas, CuerdaTirones, ColumnaRusia, TamborOrdenes, NoTeSientes, TopCinco, PasilloInfinito, CloacaLimpia, CuerdasTiempo };
