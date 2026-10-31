// dur29c · bloque A (gancho, el trato, Londres y París): la cloaca debajo de la calle, las 8 postales, las rejillas que tragan la
// ciudad, el tesoro del barro, la marea, los ojos, los túneles, el cementerio en capas, el sótano que cede, las carretas, los seis
// millones y la cuerda. Un mecanismo por componente, objetos grandes, sin carteles para leer.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums, fallY, pop } from "./kb";
import { Stickman } from "../stickman3d";
import { Bone, Coin, Lantern, PI, Postal, Skull, Tunnel, Water, brickT, cobbleT, ramp, sm } from "./c3k";

type UP = { d: number; p: any };
const IMG = (id: string) => `img/dur29c/ag/dur29c_${id}.png`;

// ---- CloacaCorte · corte de la calle de 1850: arriba el empedrado con el farol de gas y la rueda que pasa; la cámara baja y abajo
// está el túnel con el agua a la cintura y vos con el farol; en «monedas» brillan las monedas en el fondo ----
const CloacaCorte: React.FC<UP> = ({ d, p }) => {
  const aM = sec(p, "monedas", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#0d0b0a" key1={[-1.2, 2.4, 2]}
    cam={{ at: [0, 0.75, 0], at1: [0.1, 0.05, 0], az: [-0.25, -0.1], el: [0.3, 0.06], r: [2.1, 1.45], fov: 34 }}>{(tt) => {
    const wheel = lerp(-1.6, 1.6, cl(tt / 4)), glint = eio(tt, aM, aM + 0.6);
    return <>
      {/* la calle: losa de empedrado cortada, farol de gas y una rueda de carro que cruza */}
      <mesh position={[0, 0.62, -0.05]}><boxGeometry args={[3, 0.1, 0.7]} /><meshStandardMaterial map={cobbleT()} roughness={0.9} /></mesh>
      <mesh position={[0, 0.5, -0.05]}><boxGeometry args={[3, 0.14, 0.7]} /><meshStandardMaterial map={dirtT([70, 54, 40])} roughness={1} /></mesh>
      <group position={[-0.7, 0.67, -0.25]}><mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.012, 0.018, 0.6, 8]} />{M.steel({ col: "#2a2826" })}</mesh>
        <mesh position={[0, 0.62, 0]}><boxGeometry args={[0.07, 0.09, 0.07]} /><meshStandardMaterial color="#ffe0a0" emissive="#ffb050" emissiveIntensity={1.4} /></mesh>
        <pointLight position={[0, 0.6, 0.1]} intensity={1.6} distance={1.4} color="#ffc070" /></group>
      <group position={[wheel, 0.83, -0.15]} rotation={[0, 0, -wheel * 4]}><mesh><torusGeometry args={[0.15, 0.012, 8, 32]} />{M.wood({ base: [80, 52, 30] })}</mesh>
        {Array.from({ length: 8 }, (_, i) => <mesh key={i} rotation={[0, 0, (i * PI) / 4]}><boxGeometry args={[0.3, 0.012, 0.012]} />{M.wood({ base: [80, 52, 30] })}</mesh>)}</group>
      {/* la rejilla por donde baja lo que cae */}
      <group position={[0.35, 0.68, 0.1]}>{Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[i * 0.03 - 0.075, 0, 0]}><boxGeometry args={[0.012, 0.012, 0.16]} />{M.steel({ col: "#1e1c1a" })}</mesh>)}</group>
      {/* el túnel abajo, el agua y el tosher con el farol en el pecho */}
      <Tunnel L={3} R={0.4} p={[0, 0.0, -0.05]} />
      <Water w={3} dpt={0.62} y={-0.12} col="#2e2618" />
      <group position={[-0.05, -0.36, 0.05]}><Stickman escala={0.1} rotY={20} guion={[{ t: 0, accion: "caminar", expr: "decidido" }]} semilla={3} contacto={0} color="#5a4c3c" /></group>
      <Lantern p={[0.0, 0.0, 0.14]} s={0.9} on={0.6 + 0.4 * cl(tt / 0.8)} />
      {Array.from({ length: 9 }, (_, i) => <Coin key={i} p={[-0.6 + i * 0.15 + rn(i, 2) * 0.05, -0.2, 0.1 + rn(i, 3) * 0.12]} r={0.016} silver={i === 4} />)}
      <pointLight position={[0.1, -0.1, 0.25]} intensity={2.5 * glint} distance={1} color="#ffe6a8" />
    </>;
  }}</U3>;
};

// ---- OchoPostales · ocho postales con la foto de cada ciudad en abanico sobre la mesa; en «postal» se ilumina el frente, en «debajo»
// se dan vuelta de a una y del otro lado está el trabajo de abajo (la foto del peor oficio) ----
const PFR = ["f03_thames", "p12_queue", "e01_roofs", "v03_island", "f04_brooklyn", "i03_black_sky", "c04_stockyards", "k06_capital"];
const PBK = ["g01_sewer_water", "p11_catacomb_wall", "e02_roof_fire", "v01_furnace", "n01_caisson", "i01_furnace_door", "c02_hooks_rail", "k04_bare_feet"];
const OchoPostales: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "postal", 2.0), aD = sec(p, "debajo", 4.0);
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" mode="drop" key1={[-0.8, 2.6, 1.6]}
    cam={{ at: [0, 0.12, 0.05], az: [-0.12, 0.08], el: [0.75, 0.62], r: [1.55, 1.35], fov: 34 }}>{(tt) => <>
      {PFR.map((f, i) => { const a = (i - 3.5) * 0.19, k = pop(tt, 0.1 + i * 0.12), fl = eio(tt, aD + i * 0.18, aD + i * 0.18 + 0.5), lift = Math.sin(PI * fl) * 0.08;
        return <Postal key={i} src={IMG(f)} back={IMG(PBK[i])} w={0.32} s={k} flip={fl}
          p={[Math.sin(a) * 0.55, 0.02 + i * 0.003 + lift, 0.35 - Math.cos(a) * 0.55 + 0.4]} rot={[-PI / 2, 0, -a]} />; })}
      <spotLight position={[0, 1.8, 0.6]} angle={0.5} penumbra={0.7} intensity={6 + 6 * eio(tt, aP, aP + 0.5)} distance={4} color="#fff0d8" />
    </>}</U3>;
};

// ---- LondresRejillas · la ciudad vista de costado: casas arriba, rejillas en la calle; monedas, cucharas y clavos caen por las
// rejillas hacia el túnel y se juntan en el barro ----
const LondresRejillas: React.FC<UP> = ({ d, p }) => {
  const aR = sec(p, "rejilla", 1.5), aA = sec(p, "abajo", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#14110e" key1={[-1, 2.5, 2]}
    cam={{ at: [0, 0.55, 0], at1: [0, 0.15, 0], az: [-0.18, 0.05], el: [0.18, 0.1], r: [2.2, 1.9], fov: 34 }}>{(tt) => <>
      {Array.from({ length: 7 }, (_, i) => { const h = 0.35 + rn(i, 1) * 0.3; return <RBox key={i} s={[0.32, h, 0.3]} r={0.01} p={[-1.05 + i * 0.35, 0.67 + h / 2, -0.25]}><meshStandardMaterial map={brickT([96 + rn(i, 2) * 30, 60, 44], 1, 1)} roughness={0.9} /></RBox>; })}
      <mesh position={[0, 0.62, 0]}><boxGeometry args={[2.6, 0.08, 0.5]} /><meshStandardMaterial map={cobbleT()} roughness={0.9} /></mesh>
      {[-0.8, -0.2, 0.45, 1.0].map((x, j) => <group key={j} position={[x, 0.665, 0.1]}>{Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[i * 0.025 - 0.05, 0, 0]}><boxGeometry args={[0.01, 0.01, 0.12]} />{M.steel({ col: "#1a1816" })}</mesh>)}</group>)}
      <Tunnel L={2.6} R={0.32} p={[0, 0.12, -0.05]} />
      <Water w={2.6} dpt={0.5} y={-0.08} col="#2a2216" />
      {Array.from({ length: 28 }, (_, i) => { const j = i % 4, x = [-0.8, -0.2, 0.45, 1.0][j] + (rn(i, 2) - 0.5) * 0.08, a = aR + (i / 28) * Math.max(1, aA - aR + 1.5), y = lerp(0.68, -0.07 + rn(i, 4) * 0.02, cl((tt - a) / 0.55));
        const kind = i % 3; return <group key={i} position={[x, y, 0.1 + (rn(i, 5) - 0.5) * 0.1]} rotation={[rn(i, 6) * 6 * cl(tt - a), 0, rn(i, 7) * 4]} visible={tt > a}>
          {kind === 0 ? <Coin p={[0, 0, 0]} r={0.014} silver={i % 7 === 0} /> : kind === 1 ? <mesh><boxGeometry args={[0.06, 0.006, 0.012]} />{M.steel({ col: "#9aa0a4" })}</mesh> : <mesh><cylinderGeometry args={[0.003, 0.003, 0.05, 6]} />{M.steel({ col: "#6a5a48" })}</mesh>}
        </group>; })}
      <pointLight position={[0, 0.1, 0.4]} intensity={1.4 + 1.2 * eio(tt, aA, aA + 0.6)} distance={1.6} color="#ffb860" />
    </>}</U3>;
};

// ---- TesoroBarro · la mano entra al barro negro y saca de a uno: clavo, cuchara, cobre... en «plata» sale una cuchara de plata que
// brilla y en «anillo» un anillo que gira en primer plano ----
const TesoroBarro: React.FC<UP> = ({ d, p }) => {
  const aP = sec(p, "plata", 3.0), aA = sec(p, "anillo", 4.2);
  return <U3 d={d} bg={p.bg} ground={[40, 32, 24]} mode="wipe" sky="#0b0908" key1={[-0.6, 1.8, 1.4]}
    cam={{ at: [0, 0.12, 0], az: [-0.3, -0.1], el: [0.42, 0.3], r: [1.0, 0.8], fov: 32 }}>{(tt) => {
    const items = [{ t: 0.3, x: -0.32 }, { t: 1.0, x: -0.16 }, { t: 1.8, x: 0.0 }, { t: aP, x: 0.16, sil: 1 }, { t: aA, x: 0.3, ring: 1 }];
    return <>
      <Water w={2} dpt={1.2} y={0.04} col="#1e1810" op={0.7} />
      {items.map((it, i) => { const k = eio(tt, it.t, it.t + 0.6); return <group key={i} position={[it.x, lerp(-0.02, 0.1 + (it.ring ? 0.1 : 0), k), 0.15]} rotation={[0, it.ring ? tt * 1.2 : 0, it.ring ? 0.3 : 0]} scale={sm(1 + 0.6 * (it.ring || it.sil ? k : 0))}>
        {it.ring ? <mesh><torusGeometry args={[0.04, 0.009, 12, 32]} />{M.brass({ col: "#e8c060" })}</mesh>
          : it.sil ? <group rotation={[0, 0, 0.4]}><mesh><boxGeometry args={[0.12, 0.008, 0.016]} />{M.chrome({ col: "#e8ecf0" })}</mesh><mesh position={[0.07, 0, 0]} scale={[1.4, 0.4, 1]}><sphereGeometry args={[0.022, 12, 8]} />{M.chrome({ col: "#e8ecf0" })}</mesh></group>
          : i === 0 ? <mesh rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.004, 0.004, 0.09, 6]} />{M.steel({ col: "#5a4a3a" })}</mesh>
          : i === 1 ? <mesh><boxGeometry args={[0.07, 0.012, 0.03]} />{M.brass({ col: "#b06a3a" })}</mesh> : <Coin p={[0, 0, 0]} r={0.02} />}
      </group>; })}
      <pointLight position={[0.2, 0.35, 0.4]} intensity={1.5 * eio(tt, aP, aP + 0.4) + 2 * eio(tt, aA, aA + 0.4)} distance={1.2} color="#fff0d0" />
      <Lantern p={[-0.45, 0.22, -0.1]} s={1.3} />
    </>;
  }}</U3>;
};

// ---- MareaReloj · la boca de la cloaca sobre el Támesis: el agua del río baja (escalones a la vista) y se abre la entrada; después
// vuelve a subir y tapa la boca, con un reloj de bolsillo que gira al lado ----
const MareaReloj: React.FC<UP> = ({ d, p }) => {
  const aB = sec(p, "baja", 1.0), aS = sec(p, "sube", 3.5);
  return <U3 d={d} bg={p.bg} ground={[70, 56, 40]} mode="wipe" sky="#2a2620" key1={[-1, 2.4, 1.8]}
    cam={{ at: [0, 0.25, 0], az: [-0.35, -0.2], el: [0.16, 0.12], r: [1.7, 1.5], fov: 34 }}>{(tt) => {
    const lvl = 0.42 - 0.34 * eio(tt, aB, aB + 1.2) + 0.4 * eio(tt, aS, aS + 1.6);
    return <>
      <RBox s={[1.2, 0.8, 0.3]} r={0.01} p={[0, 0.4, -0.4]}><meshStandardMaterial map={brickT([100, 70, 52], 3, 2)} roughness={0.95} /></RBox>
      <mesh position={[0, 0.22, -0.24]}><circleGeometry args={[0.2, 32]} /><meshBasicMaterial color="#050403" /></mesh>
      <mesh position={[0, 0.22, -0.245]}><ringGeometry args={[0.2, 0.25, 32]} /><meshStandardMaterial map={brickT([90, 60, 44], 1, 1)} /></mesh>
      {Array.from({ length: 5 }, (_, i) => <RBox key={i} s={[0.5, 0.05, 0.1]} r={0.005} p={[0, 0.03 + i * 0.05, -0.2 + 0.4 - i * 0.1]}><meshStandardMaterial color="#6a6258" roughness={0.9} /></RBox>)}
      <mesh position={[0, lvl, 0.3]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshPhysicalMaterial color="#5a4a30" roughness={0.15} clearcoat={0.8} transparent opacity={0.85} depthWrite={false} /></mesh>
      <group position={[0.6, 0.55, 0.15]} rotation={[0.2, -0.4, 0]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.025, 32]} />{M.brass({ col: "#c89a4a" })}</mesh>
        <mesh position={[0, 0, 0.014]}><circleGeometry args={[0.088, 32]} /><meshStandardMaterial color="#f2ead8" /></mesh>
        <mesh position={[0, 0, 0.017]} rotation={[0, 0, -tt * 1.4]}><boxGeometry args={[0.006, 0.08, 0.003]} /><meshBasicMaterial color="#1a1410" /></mesh>
        <mesh position={[0, 0, 0.018]} rotation={[0, 0, -tt * 0.12]}><boxGeometry args={[0.008, 0.05, 0.003]} /><meshBasicMaterial color="#1a1410" /></mesh>
      </group>
    </>;
  }}</U3>;
};

// ---- OjosPared · el farol barre la pared del túnel y en el borde aparecen decenas de pares de ojos; en «atacado» los ojos se
// adelantan y el farol tiembla ----
const OjosPared: React.FC<UP> = ({ d, p }) => {
  const aA = sec(p, "atacado", 3.0);
  return <U3 d={d} bg={p.bg} ground={null} mode="wipe" sky="#070605" key1={[-0.5, 1.5, 1]}
    cam={{ at: [0, 0.05, 0], az: [-0.15, 0.1], el: [0.06, 0.05], r: [1.2, 1.0], fov: 34 }}>{(tt) => {
    const sweep = lerp(-0.6, 0.6, eio(tt, 0.2, aA)), adv = eio(tt, aA, aA + 0.8);
    return <>
      <Tunnel L={2.4} R={0.45} p={[0, 0.05, -0.1]} col={[80, 52, 36]} />
      <Water w={2.4} dpt={0.7} y={-0.25} col="#1a1610" />
      {Array.from({ length: 34 }, (_, i) => { const x = -1 + (i / 34) * 2 + rn(i, 1) * 0.04, y = -0.18 + rn(i, 2) * 0.06, lit = cl(1 - Math.abs(x - sweep) * 2.5) + adv;
        return <group key={i} position={[x, y, -0.25 + adv * 0.25 * rn(i, 3)]}>{[-1, 1].map((s) => <mesh key={s} position={[s * 0.008, 0, 0]}><sphereGeometry args={[0.005, 8, 6]} /><meshBasicMaterial color="#ffd070" transparent opacity={cl(lit)} toneMapped={false} /></mesh>)}
          <mesh position={[0, -0.005, -0.02]} scale={[1.6, 0.8, 1]}><sphereGeometry args={[0.02, 10, 8]} /><meshStandardMaterial color="#3a2e24" roughness={1} transparent opacity={0.4 + 0.6 * cl(lit)} /></mesh></group>; })}
      <Lantern p={[sweep * 0.6 + 0.02 * Math.sin(tt * 6) * adv, 0.12, 0.25]} s={1.4} />
    </>;
  }}</U3>;
};

// ---- TunelesForma · el plano de la cloaca como maqueta de caños: un cordón de luz marca el camino; en «sube» se ilumina el ramal que
// sube, en «baja» el que baja y en «sale» la boca de salida con el cielo ----
const TunelesForma: React.FC<UP> = ({ d, p }) => {
  const aS = sec(p, "sube", 1.5), aB = sec(p, "baja", 3.0), aX = sec(p, "sale", 4.5);
  const pipe = (k: string, a: number[], b: number[], on: number, col: string) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    return <group key={k} position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]} rotation={[0, 0, Math.atan2(dy, dx) - PI / 2]}>
      <mesh><cylinderGeometry args={[0.05, 0.05, L, 20, 1, true]} /><meshStandardMaterial map={brickT([110, 70, 50], 1, 2)} side={THREE.DoubleSide} transparent opacity={0.85} /></mesh>
      <mesh><cylinderGeometry args={[0.018, 0.018, L, 10]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={2.4 * on} /></mesh></group>; };
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="drop" key1={[-1, 2.4, 2]}
    cam={{ at: [0, 0.35, 0], az: [-0.35, 0.2], el: [0.2, 0.16], r: [1.8, 1.6], fov: 34 }}>{(tt) => <>
      {pipe("m", [-0.8, 0.3], [0.0, 0.3], 0.4, "#d8b070")}
      {pipe("u", [0.0, 0.3], [0.7, 0.75], eio(tt, aS, aS + 0.5), "#f0c070")}
      {pipe("d", [0.0, 0.3], [0.7, -0.05], eio(tt, aB, aB + 0.5), "#70a8f0")}
      {pipe("x", [0.7, 0.75], [1.0, 0.95], eio(tt, aX, aX + 0.5), "#fff4d8")}
      <mesh position={[1.04, 0.98, 0]}><sphereGeometry args={[0.07, 20, 14]} /><meshBasicMaterial color="#cfe4ff" toneMapped={false} transparent opacity={eio(tt, aX, aX + 0.6)} /></mesh>
      <pointLight position={[1.0, 1.0, 0.3]} intensity={3 * eio(tt, aX, aX + 0.6)} distance={1.5} color="#dceaff" />
      <group position={[-0.6, 0.27, 0.05]}><Stickman escala={0.05} rotY={90} guion={[{ t: 0, accion: "caminar", expr: "decidido" }]} semilla={5} contacto={0} color="#5a4c3c" /></group>
    </>}</U3>;
};

// ---- CementerioCapas · corte del suelo del cementerio: capa sobre capa de huesos sube hasta pasar el nivel de la calle; en «dos»
// la vara de dos metros al costado se llena ----
const CementerioCapas: React.FC<UP> = ({ d, p }) => {
  const aD = sec(p, "dos", 3.0);
  return <U3 over={(tt) => <Drums v={2 * eio(tt, aD, aD + 1.0)} n={1} x={1500} y={120} s={1.1} unit="m" op={eio(tt, aD, aD + 0.3)} />} d={d} bg={p.bg} ground={null} mode="wipe" sky="#120f0c" key1={[-1, 2.4, 2]}
    cam={{ at: [0, 0.45, 0], az: [-0.2, -0.05], el: [0.12, 0.1], r: [1.9, 1.7], fov: 34 }}>{(tt) => {
    const layers = 7, grow = cl(tt / Math.max(1, aD));
    return <>
      <RBox s={[0.12, 1.0, 0.6]} r={0.01} p={[-0.85, 0.5, 0]}><meshStandardMaterial map={brickT([150, 140, 120], 1, 3)} roughness={0.95} /></RBox>
      <mesh position={[-1.3, 0.2, 0]}><boxGeometry args={[0.8, 0.04, 0.6]} /><meshStandardMaterial map={cobbleT()} /></mesh>
      {Array.from({ length: layers }, (_, l) => { const on = cl(grow * layers - l); return <group key={l} position={[0, 0.05 + l * 0.13, 0]} scale={[1, sm(on), 1]}>
        <mesh><boxGeometry args={[1.5, 0.12, 0.55]} /><meshStandardMaterial map={dirtT([84 - l * 3, 64 - l * 2, 46])} roughness={1} /></mesh>
        {Array.from({ length: 5 }, (_, i) => <Bone key={i} p={[-0.6 + i * 0.3 + rn(l * 5 + i, 1) * 0.08, 0.0, 0.28]} rot={[0, 0, rn(l * 5 + i, 2) * 3]} s={0.9} />)}
        {l % 2 === 0 && <Skull p={[-0.4 + rn(l, 3) * 0.8, 0.01, 0.28]} s={0.7} />}
      </group>; })}
      <group position={[0.92, 0, 0.1]}><mesh position={[0, 0.5, 0]}><boxGeometry args={[0.04, 1.0, 0.04]} />{M.wood({ base: [150, 110, 60] })}</mesh>
        <mesh position={[0, 0.5 * eio(tt, aD, aD + 1.0), 0.025]} scale={[1, sm(eio(tt, aD, aD + 1.0)), 1]}><boxGeometry args={[0.03, 1.0, 0.01]} /><meshStandardMaterial color="#d8402a" emissive="#d8402a" emissiveIntensity={0.6} /></mesh></group>
    </>;
  }}</U3>;
};

// ---- SotanoCede · el sótano de la casa vecina: la pared de piedra se abomba, se raja y en «cede» se abre y entra la tierra con
// huesos; la vela se cae ----
const SotanoCede: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "cede", 2.5);
  return <U3 d={d} bg={p.bg} ground={[90, 74, 58]} mode="wipe" sky="#0e0b09" key1={[-0.6, 2, 1.6]}
    cam={{ at: [0, 0.35, 0], az: [-0.4, -0.25], el: [0.12, 0.1], r: [1.5, 1.25], fov: 34 }}>{(tt) => {
    const bulge = eio(tt, 0.3, aC) * 0.06, br = eio(tt, aC, aC + 0.8);
    return <>
      {Array.from({ length: 30 }, (_, i) => { const c = i % 6, r = Math.floor(i / 6), x = -0.5 + c * 0.2, y = 0.08 + r * 0.16, cen = Math.max(0, 1 - Math.hypot(x, y - 0.4) * 2.2);
        return <RBox key={i} s={[0.19, 0.15, 0.12]} r={0.01} p={[x + br * cen * (x) * 0.6, y - br * cen * 0.25, -0.3 + bulge * cen + br * cen * 0.5]} rot={[br * cen * rn(i, 1), 0, br * cen * (rn(i, 2) - 0.5)]}>
          <meshStandardMaterial map={dirtT([140 + rn(i, 3) * 20, 128, 108])} roughness={0.95} /></RBox>; })}
      {Array.from({ length: 16 }, (_, i) => <group key={i} visible={br > 0.05} position={[(rn(i, 1) - 0.5) * 0.6 * br, 0.05 + rn(i, 2) * 0.4 * (1 - br * 0.6), -0.2 + br * (0.25 + rn(i, 3) * 0.3)]}>
        {i % 4 === 0 ? <Skull p={[0, 0, 0]} s={0.8} /> : <Bone p={[0, 0, 0]} rot={[rn(i, 4) * 3, rn(i, 5) * 3, 0]} s={0.9} />}</group>)}
      <mesh position={[0, 0.02, -0.05]} scale={[sm(br) * 1.2, sm(br) * 0.25, sm(br) * 0.9]}><sphereGeometry args={[0.4, 20, 10]} /><meshStandardMaterial map={dirtT([70, 54, 40])} roughness={1} /></mesh>
      <group position={[0.4, 0.08, 0.2]} rotation={[0, 0, -PI / 2 * eio(tt, aC + 0.3, aC + 0.7)]}><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.012, 0.012, 0.12, 10]} /><meshStandardMaterial color="#f0e8d0" /></mesh>
        <mesh position={[0, 0.13, 0]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.008, 8, 6]} />{M.glow({ col: "#ffc860", op: 1 - eio(tt, aC + 0.5, aC + 0.9) })}</mesh></group>
      <pointLight position={[0.4, 0.25, 0.25]} intensity={1.6 * (1 - eio(tt, aC + 0.5, aC + 0.9)) + 0.3} distance={1.4} color="#ffb860" />
    </>;
  }}</U3>;
};

// ---- CarretasNoche · la fila de carretas con paño negro avanza por la calle de noche entre antorchas; en «curas» aparece detrás la
// procesión con la cruz alta y las velas ----
const CarretasNoche: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "curas", 2.0);
  return <U3 d={d} bg={p.bg} ground={[60, 52, 44]} mode="wipe" sky="#0a0908" key1={[-0.5, 1.6, 1.2]}
    cam={{ at: [0, 0.2, 0], az: [-0.7, -0.45], el: [0.12, 0.1], r: [1.8, 1.6], fov: 34 }}>{(tt) => {
    const mv = tt * 0.12;
    return <>
      {Array.from({ length: 4 }, (_, i) => <group key={i} position={[0.9 - i * 0.55 + mv, 0, 0]}>
        <RBox s={[0.36, 0.12, 0.22]} r={0.01} p={[0, 0.17, 0]}>{M.wood({ base: [70, 48, 30] })}</RBox>
        <mesh position={[0, 0.27, 0]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.2, 18, 10, 0, 2 * PI, 0, PI / 2]} /><meshStandardMaterial color="#141210" roughness={0.95} /></mesh>
        {[-1, 1].map((s) => <mesh key={s} position={[0.0, 0.1, s * 0.13]} rotation={[0, 0, -mv * 8]}><torusGeometry args={[0.09, 0.01, 6, 20]} />{M.wood({ base: [60, 40, 24] })}</mesh>)}
      </group>)}
      {[-0.8, 0.0, 0.8].map((x, i) => <group key={i} position={[x, 0, -0.35]}><mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.01, 0.012, 0.5, 8]} />{M.wood({ base: [60, 40, 24] })}</mesh>
        <mesh position={[0, 0.53, 0]} scale={[1, 1.5 + 0.15 * Math.sin(tt * 2 * PI * 1.6 + i), 1]}><sphereGeometry args={[0.03, 10, 8]} />{M.glow({ col: "#ffa040" })}</mesh>
        <pointLight position={[0, 0.55, 0.05]} intensity={1.4} distance={1.2} color="#ff9a40" /></group>)}
      <group position={[-1.4 + mv + 0.3 * eio(tt, aC, aC + 1.2), 0, 0.05]} scale={sm(eio(tt, aC - 0.2, aC + 0.5))}>
        <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.015, 0.7, 0.015]} />{M.brass({ col: "#c8a050" })}</mesh>
        <mesh position={[0, 0.72, 0]}><boxGeometry args={[0.12, 0.015, 0.015]} />{M.brass({ col: "#c8a050" })}</mesh>
        {[0, 1, 2].map((j) => <group key={j} position={[-0.12 - j * 0.14, 0, (j - 1) * 0.1]}><Stickman escala={0.07} rotY={90} guion={[{ t: 0, accion: "caminar", expr: "triste" }]} semilla={20 + j} contacto={0} color="#1c1a18" />
          <mesh position={[0.04, 0.2, 0]}><sphereGeometry args={[0.008, 6, 6]} />{M.glow({ col: "#ffd890" })}</mesh></group>)}
      </group>
    </>;
  }}</U3>;
};

// ---- SeisMillones · la pared de calaveras y huesos se arma fila por fila en el túnel, como ladrillos; en «seis» el contador llega a
// 6.000.000 y la cámara se aleja: la pared sigue y sigue ----
const SeisMillones: React.FC<UP> = ({ d, p }) => {
  const aS = sec(p, "seis", 2.5);
  return <U3 over={(tt) => <Drums v={6 * eio(tt, 0.3, aS)} n={1} x={1380} y={110} s={1.1} unit="MILLONES" op={1} />} d={d} bg={p.bg} ground={[150, 140, 120]} mode="wipe" sky="#0d0b09" key1={[-0.6, 2, 1.4]}
    cam={{ at: [0, 0.3, 0], az: [-0.5, -0.75], el: [0.1, 0.08], r: [0.9, 1.9], fov: 34 }}>{(tt) => {
    const rows = 6, cols = 22, k = cl(tt / Math.max(1, aS));
    return <>
      {Array.from({ length: rows * cols }, (_, i) => { const r = Math.floor(i / cols), c = i % cols, on = cl(k * rows * cols - i * 0.9) ; const x = -0.2 + c * 0.1, y = 0.06 + r * 0.1;
        return r % 2 === 0 ? <Skull key={i} p={[x, y + (1 - on) * 0.4, -0.3 - c * 0.02]} rot={[0, -0.6, 0]} s={on * 0.85} />
          : <Bone key={i} p={[x, y + (1 - on) * 0.4, -0.28 - c * 0.02]} rot={[0, PI / 2 - 0.6, 0]} s={on} />; })}
      <pointLight position={[0.2, 0.5, 0.4]} intensity={2.2} distance={2} color="#ffd090" />
    </>;
  }}</U3>;
};

// ---- CuerdaSalida · vista desde arriba del laberinto de canteras (paredes bajas): la cuerda va desenrollándose desde la escalera
// mientras el caminante avanza; en «doscientos» la cámara sube y el laberinto no termina; en «queda» se ve uno sin cuerda, parado ----
const CuerdaSalida: React.FC<UP> = ({ d, p }) => {
  const aD = sec(p, "doscientos", 2.5), aQ = sec(p, "queda", 4.5);
  const path = [[-0.9, -0.5], [-0.5, -0.5], [-0.5, 0.0], [0.0, 0.0], [0.0, 0.4], [0.5, 0.4], [0.5, -0.2], [0.9, -0.2]];
  const segAt = (u: number) => { const L = path.length - 1, s = Math.min(L - 0.0001, u * L), i = Math.floor(s), f = s - i; return [lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f)]; };
  return <U3 d={d} bg={p.bg} ground={[170, 160, 140]} mode="drop" sky="#0e0c0a" key1={[-0.5, 2.4, 0.5]}
    cam={{ at: [0, 0, 0], az: [0, 0.2], el: [1.15, 1.3], r: [1.8, 3.2], fov: 34 }}>{(tt) => {
    const u = cl(tt / Math.max(1.5, aD + 1)), pos = segAt(u);
    return <>
      {Array.from({ length: 64 }, (_, i) => { const gx = (i % 8) - 3.5, gz = Math.floor(i / 8) - 3.5; if (rn(i, 3) < 0.35) return null;
        return <RBox key={i} s={rn(i, 1) > 0.5 ? [0.42, 0.14, 0.05] : [0.05, 0.14, 0.42]} r={0.01} p={[gx * 0.42 * (1 + 0.6 * eio(tt, aD, aD + 1)), 0.07, gz * 0.42 * (1 + 0.6 * eio(tt, aD, aD + 1))]}><meshStandardMaterial map={dirtT([190, 180, 160])} roughness={0.95} /></RBox>; })}
      {path.slice(0, -1).map((a, i) => { const b = path[i + 1], f0 = i / (path.length - 1), f = cl((u - f0) * (path.length - 1)); if (f <= 0) return null; const ex = lerp(a[0], b[0], f), ez = lerp(a[1], b[1], f), L = Math.hypot(ex - a[0], ez - a[1]);
        return <mesh key={i} position={[(a[0] + ex) / 2, 0.02, (a[1] + ez) / 2]} rotation={[0, -Math.atan2(ez - a[1], ex - a[0]), PI / 2]}><cylinderGeometry args={[0.008, 0.008, Math.max(0.001, L), 6]} /><meshStandardMaterial color="#d8b880" emissive="#a07020" emissiveIntensity={0.4} /></mesh>; })}
      <group position={[pos[0], 0.0, pos[1]]}><Stickman escala={0.06} rotY={0} guion={[{ t: 0, accion: "caminar", expr: "decidido" }]} semilla={7} contacto={0} color="#4a4038" />
        <Lantern p={[0.02, 0.12, 0.02]} s={0.6} /></group>
      <group position={[0.9, 0.0, 0.7]} scale={sm(eio(tt, aQ, aQ + 0.5))}><Stickman escala={0.06} rotY={-130} guion={[{ t: 0, accion: "mirar_reloj", expr: "asustado" }]} semilla={8} contacto={0} color="#4a4038" /></group>
    </>;
  }}</U3>;
};

export const OVR: Record<string, React.FC<UP>> = { CloacaCorte, OchoPostales, LondresRejillas, TesoroBarro, MareaReloj, OjosPared, TunelesForma, CementerioCapas, SotanoCede, CarretasNoche, SeisMillones, CuerdaSalida };
