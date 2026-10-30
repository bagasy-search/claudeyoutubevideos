// dur29a · componentes únicos en 3D, bloque D: el altímetro, el ranking de relojes de arena, el frasco de millones,
// la sirga contra la corriente, el reloj de doce horas, la pirámide de oficios y la mesa para elegir.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { U3, dirtT, sec } from "./k3";
import { Drums } from "./u3a";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;
const pop = (tt: number, a: number) => Math.max(0.001, cl(phys(tt, a, 7, 0.42)));
const fallY = (tt: number, a: number, h = 0.8) => (1 - cl(phys(tt, a, 8, 0.36))) * h;
const LG = new Map<string, THREE.LatheGeometry>();
const latheG = (k: string, P: number[][], seg = 40) => { let g = LG.get(k); if (!g) { g = new THREE.LatheGeometry(P.map(([r, y]) => new THREE.Vector2(r, y)), seg); LG.set(k, g); } return g; };
// rótulo grabado: letras oscuras sobre la madera o la piedra (va pegado al objeto, nunca suelto en pantalla)
const label = (key: string, txt: string, w = 512, h = 128, col = "#3a2210", font = "800 64px Georgia") => tex.text("lbl" + key, w, h, (g) => {
  g.clearRect(0, 0, w, h); g.font = font; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "rgba(255,240,210,.35)"; g.fillText(txt, w / 2 + 2, h / 2 + 3); g.fillStyle = col; g.fillText(txt, w / 2, h / 2); });

// ---------------- 1 · ALTÍMETRO: subís a 4000 m y la campana de aire se queda sin burbujas ----------------
export const Altimetro3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aM = sec(p, "metros", 0.8), aA = sec(p, "aire", 2.6);
  const alt = (tt: number) => 4000 * eio(tt, 0.2, aM + 1.2);
  return <U3 d={d} bg={p.bg} ground={[150, 140, 128]} sky="#8a9cac" mode="drop" key1={[-1.4, 2.6, 1.4]}
    cam={{ at: [0.05, 0.42, 0], az: [-0.35, 0.15], el: [0.2, 0.12], r: [2.4, 2.0], fov: 34 }}
    over={(tt) => <Drums v={Math.round(alt(tt))} n={4} x={1240} y={140} s={1.4} unit="m" />}>{(tt) => {
    const thin = eio(tt, aA - 0.2, Math.min(D - 0.6, aA + 2.4)), N = 46, gasp = tt > aA + 0.6;
    return <>
      {/* la montaña al fondo con nieve arriba */}
      <group position={[-0.6, 0, -1.6]}>
        <mesh position={[0, 0.75, 0]} castShadow><coneGeometry args={[1.1, 1.5, 7]} /><meshStandardMaterial map={dirtT([118, 104, 92])} roughness={1} flatShading /></mesh>
        <mesh position={[0, 1.27, 0]}><coneGeometry args={[0.39, 0.5, 7]} /><meshStandardMaterial color="#f4f6f8" roughness={0.7} flatShading /></mesh>
      </group>
      {/* la campana de vidrio con el aire: burbujas azules que se van apagando */}
      <group position={[0.42, 0, 0.1]} scale={pop(tt, 0.3)}>
        <mesh position={[0, 0.03, 0]} receiveShadow><cylinderGeometry args={[0.24, 0.26, 0.06, 40]} />{M.wood({ base: [110, 72, 40] })}</mesh>
        <mesh geometry={latheG("campana", [[0.2, 0.06], [0.21, 0.4], [0.17, 0.55], [0.08, 0.62], [0.0, 0.63]], 48)}>{M.glass({ op: 0.2 })}</mesh>
        <mesh position={[0, 0.66, 0]}><sphereGeometry args={[0.03, 16, 12]} />{M.brass()}</mesh>
        {Array.from({ length: N }, (_, i) => { const gone = i / N < thin * 0.93, a = rn(i, 1) * 2 * PI, r = 0.03 + rn(i, 2) * 0.14, y = 0.1 + rn(i, 3) * 0.42 + 0.015 * Math.sin(tt * 1.6 + i);
          const s = gone ? Math.max(0.001, 1 - cl((thin * 0.93 - i / N) * 10)) : 1;
          return <mesh key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]} scale={s}><sphereGeometry args={[0.018 + 0.01 * rn(i, 4), 12, 10]} /><meshPhysicalMaterial color="#8fd2ff" roughness={0.1} clearcoat={1} transparent opacity={0.85} emissive="#2a7ab8" emissiveIntensity={0.25} /></mesh>; })}
      </group>
      {/* el que llega arriba: respira por la boca cuando el aire se afina */}
      <group position={[-0.12, 0, 0.25]}>
        <Stickman escala={0.24} rotY={30} guion={[{ t: 0, accion: "idle", expr: "decidido" }, { t: aM + 0.4, accion: "mirar_reloj", expr: "neutral" }, { t: aA + 0.6, accion: "asustarse", expr: "nervioso" }]} semilla={11} contacto={0.5} colorContacto="#2a1a10" />
      </group>
      {/* vaho de la respiración agitada (siempre montado, se ve sólo cuando jadea) */}
      {Array.from({ length: 6 }, (_, i) => { const k = ((tt * 1.3 + i / 6) % 1); return <mesh key={i} position={[-0.05 + 0.18 * k, 0.5 + 0.05 * k, 0.32]} scale={0.02 + 0.05 * k}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#f2f4f6" roughness={1} transparent opacity={gasp ? 0.35 * Math.sin(PI * k) : 0} depthWrite={false} /></mesh>; })}
      {/* nieve suelta que cae lenta */}
      {Array.from({ length: 40 }, (_, i) => { const y = 1.6 - ((tt * 0.12 + rn(i, 5)) % 1) * 1.6; return <mesh key={i} position={[(rn(i, 6) - 0.5) * 2.4, y, (rn(i, 7) - 0.5) * 1.4]}><sphereGeometry args={[0.006, 6, 5]} />{M.glow({ col: "#ffffff", op: 0.7 })}</mesh>; })}
    </>;
  }}</U3>;
};

// ---------------- 2 · RELOJES DE ARENA: uno por oficio, la arena que tiene es lo que aguantarías ----------------
const JOBS = [["EGIPTO", "2 h", 0.7], ["ROMA", "10 min", 0.12], ["CHINA", "1 h", 0.45], ["MONGOLIA", "4 h", 1], ["AZTECAS", "3 h", 0.85], ["POTOSÍ", "15 min", 0.16]] as const;
export const RelojesArena3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30;
  return <U3 d={d} bg={p.bg} ground={null} floor="wood" sky="#3a2a1e" mode="wipe" key1={[-1.2, 2.4, 1.6]}
    cam={{ at: [-0.05, 0.3, 0.1], az: [-0.06, 0.04], el: [0.22, 0.16], r: [3.6, 3.4], fov: 34 }}>{(tt) => <>
      {/* el estante */}
      <RBox s={[3.6, 0.06, 0.6]} r={0.01} p={[0, 0.03, 0]}><meshStandardMaterial map={tex.wood(4, 1, [118, 76, 42])} roughness={0.7} /></RBox>
      {JOBS.map(([n, t, amt], i) => { const a = Math.min(sec(p, "j" + (i + 1), 0.5 + i * 1.3), D - 1.5), x = -1.45 + i * 0.58, fl = eio(tt, a + 0.2, a + 2.6);
        const top = amt * (1 - fl), bot = amt * fl, H2 = 0.2;
        return <group key={i} position={[x, 0.06 + fallY(tt, a - 0.5, 0.9), 0]} visible={tt > a - 0.55}>
          {/* tapas y columnas de madera */}
          {[0, 0.46].map((y) => <mesh key={y} position={[0, y + 0.015, 0]} castShadow><cylinderGeometry args={[0.15, 0.15, 0.03, 32]} /><meshStandardMaterial map={tex.wood(1, 1, [96, 60, 32])} roughness={0.6} /></mesh>)}
          {[0, 1, 2].map((k) => <mesh key={k} position={[Math.cos(k * 2.09) * 0.125, 0.245, Math.sin(k * 2.09) * 0.125]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.43, 10]} /><meshStandardMaterial map={tex.wood(1, 1, [96, 60, 32])} roughness={0.6} /></mesh>)}
          {/* el vidrio: dos bulbos */}
          <mesh geometry={latheG("arena_v", [[0.0, 0.03], [0.09, 0.05], [0.1, 0.12], [0.06, 0.2], [0.012, 0.245], [0.06, 0.29], [0.1, 0.37], [0.09, 0.44], [0.0, 0.46]], 40)}>{M.glass({ op: 0.18 })}</mesh>
          {/* la arena de arriba (se vacía) y la de abajo (se llena) */}
          <group position={[0, 0.255, 0]} scale={[1, Math.max(0.001, top), 1]}><mesh position={[0, H2 * 0.45, 0]}><cylinderGeometry args={[0.075, 0.03, H2 * 0.9, 32]} /><meshStandardMaterial color="#d9ae62" roughness={0.9} /></mesh></group>
          <group position={[0, 0.04, 0]} scale={[1, Math.max(0.001, bot), 1]}><mesh position={[0, H2 * 0.45, 0]}><coneGeometry args={[0.085, H2 * 0.9, 32]} /><meshStandardMaterial color="#d9ae62" roughness={0.9} /></mesh></group>
          <mesh position={[0, 0.15, 0]} scale={[1, fl > 0 && fl < 1 ? 1 : 0.001, 1]}><cylinderGeometry args={[0.004, 0.004, 0.19, 6]} /><meshStandardMaterial color="#d9ae62" roughness={0.9} /></mesh>
          {/* la tablita del pie con el oficio y el tiempo */}
          <mesh position={[0, 0.0, 0.2]} rotation={[-0.3, 0, 0]}><planeGeometry args={[0.54, 0.16]} /><meshStandardMaterial map={tex.text("tab" + i, 512, 134, (g) => { g.fillStyle = "#e8d6b0"; g.fillRect(0, 0, 512, 134); g.strokeStyle = "#6a4a26"; g.lineWidth = 8; g.strokeRect(4, 4, 504, 126); g.fillStyle = "#3a2210"; g.textAlign = "center"; g.font = "900 58px Georgia"; g.fillText(n, 256, 54); g.font = "italic 800 46px Georgia"; g.fillStyle = "#8a2a14"; g.fillText(t, 256, 108); })} roughness={0.8} /></mesh>
        </group>; })}
      {/* foco sobre el que más aguanta y el que menos */}
      {[3, 1].map((i) => { const a = Math.min(sec(p, "j" + (i + 1), 0.5 + i * 1.3), D - 1.5) + 2.6; return <spotLight key={i} position={[-1.45 + i * 0.58, 1.6, 0.6]} target-position={[-1.45 + i * 0.58, 0.2, 0]} angle={0.22} penumbra={0.5} intensity={30 * eio(tt, a, a + 0.6)} distance={3} color={i === 3 ? "#fff1d0" : "#ff8a6a"} />; })}
    </>}</U3>;
};

// ---------------- 3 · FRASCO DE MILLONES: un frasco, después miles de cajones, después una pared hasta el techo ----------------
export const FrascoMillones3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aK = sec(p, "miles", 1.0), aM = Math.min(sec(p, "millones", 3.2), D - 1.6);
  const cnt = (tt: number) => tt < aK ? 1 : tt < aM ? 1 + 999 * eio(tt, aK, aM) : 1000 + 30e6 * eio(tt, aM, aM + 1.3);
  return <U3 d={d} bg={p.bg} ground={[96, 80, 62]} mode="iris" key1={[-1.3, 2.6, 1.6]}
    cam={{ at: [0, 0.17, 0.3], at1: [0, 0.75, -0.6], az: [-0.3, 0.1], el: [0.2, 0.12], r: [1.3, 3.6], fov: 34 }}
    over={(tt) => { const v = cnt(tt); return <Drums v={v >= 1e6 ? Math.round(v / 1e6) : Math.round(v)} n={v >= 1e6 ? 2 : 4} x={1300} y={140} s={1.4} unit={v >= 1e6 ? "mill." : ""} />; }}>{(tt) => {
    const grow = eio(tt, aK, aM), wall = eio(tt, aM, aM + 1.6);
    return <>
      {/* el frasco del frente con las sanguijuelas */}
      <group position={[0, 0, 0.3]}>
        <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.1, 0.1, 0.28, 36, 1, true]} />{M.glass({ op: 0.2 })}</mesh>
        <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.095, 0.095, 0.2, 36]} />{M.water({ col: "#7a8a5a", op: 0.5 })}</mesh>
        <mesh position={[0, 0.29, 0]}><cylinderGeometry args={[0.105, 0.105, 0.03, 36]} /><meshStandardMaterial map={tex.wood(1, 1, [120, 84, 50])} /></mesh>
        {Array.from({ length: 6 }, (_, i) => <mesh key={i} geometry={tubeG("sang" + (i % 3), Array.from({ length: 6 }, (_, j) => [-0.04 + j * 0.016, 0.006 * Math.sin(j * 1.4), 0]), 0.009, 20, 8)} position={[(rn(i, 1) - 0.5) * 0.1, 0.05 + i * 0.026, (rn(i, 2) - 0.5) * 0.1]} rotation={[0.3 * Math.sin(tt * 2 + i), rn(i, 3) * 6, 0.4 * Math.sin(tt * 1.4 + i)]}><meshPhysicalMaterial color="#3b3a1c" roughness={0.25} clearcoat={1} /></mesh>)}
      </group>
      {/* los cajones de frascos que se apilan atrás: primero de a uno, después la pared entera */}
      {Array.from({ length: 70 }, (_, i) => { const c = i % 10, r = Math.floor(i / 10), k0 = i / 70, on = i < 12 ? cl((grow - k0 * 5) * 4) : cl((wall - (k0 - 0.17) * 1.1) * 5);
        return <group key={i} position={[(c - 4.5) * 0.36, 0.11 + r * 0.22 + (1 - on) * 0.6, -0.4 - (r % 2) * 0.02]} scale={Math.max(0.001, on)}>
          <RBox s={[0.34, 0.2, 0.3]} r={0.01}><meshStandardMaterial map={tex.wood(1, 1, [150 - (i % 3) * 12, 104, 60])} roughness={0.8} /></RBox>
          {[-0.1, 0, 0.1].map((x) => <mesh key={x} position={[x, 0.06, 0.1]}><cylinderGeometry args={[0.035, 0.035, 0.08, 14]} />{M.glass({ op: 0.35, col: "#c8d8b0" })}</mesh>)}
        </group>; })}
    </>;
  }}</U3>;
};

// ---------------- 4 · CONTRA LA CORRIENTE: el barco no tiene motor, lo tiran once hombres desde la orilla ----------------
export const ContraCorriente3D: React.FC<UP> = ({ d, p }) => {
  const aC = sec(p, "corriente", 2), aG = sec(p, "gente", 6);
  return <U3 d={d} bg={p.bg} ground={[118, 104, 70]} mode="wipe" key1={[-1.6, 2.6, 1.0]}
    cam={{ at: [-0.2, 0.25, 0.2], at1: [0.05, 0.25, 0.3], az: [0.4, 0.2], el: [0.3, 0.2], r: [3.5, 3.1], fov: 36 }}>{(tt) => {
    const bob = 0.012 * Math.sin(tt * 1.3), crawl = 0.04 * tt, strain = eio(tt, aG - 0.3, aG + 0.6);
    const mast = [0.8 + crawl, 0.82, -0.3] as const;
    return <>
      {/* el río: agua que corre hacia la izquierda (contra el barco), con espuma */}
      <mesh position={[0, 0.02, -0.4]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 1.5]} />{M.water({ col: "#3f6c78", op: 0.85 })}</mesh>
      {Array.from({ length: 34 }, (_, i) => { const x = 2.6 - ((tt * 0.45 * (1 + eio(tt, aC - 0.3, aC + 0.4) * 0.6) + rn(i, 1) * 5.2) % 5.2); return <mesh key={i} position={[x, 0.025, -1.05 + rn(i, 2) * 1.3]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.18 + 0.12 * rn(i, 3), 0.012]} />{M.glow({ col: "#e6f2f4", op: 0.55 })}</mesh>; })}
      {/* la orilla de tierra donde caminan */}
      <mesh position={[0, 0.03, 0.55]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6, 0.4]} /><meshStandardMaterial map={dirtT([142, 116, 78])} roughness={1} /></mesh>
      {/* el barco de carga */}
      <group position={[0.8 + crawl, bob, -0.4]} scale={1.25} rotation={[0, 0, 0.02 * Math.sin(tt * 1.1)]}>
        <RBox s={[1.1, 0.18, 0.42]} r={0.05} p={[0, 0.1, 0]}><meshStandardMaterial map={tex.wood(4, 1, [104, 70, 40])} roughness={0.8} /></RBox>
        {[-0.3, 0, 0.3].map((x, i) => <RBox key={i} s={[0.24, 0.14, 0.3]} r={0.02} p={[x, 0.26, 0]}><meshStandardMaterial map={dirtT([180, 150, 110])} roughness={1} /></RBox>)}
        <mesh position={[0, 0.5, 0.1]} castShadow><cylinderGeometry args={[0.018, 0.022, 0.8, 12]} /><meshStandardMaterial map={tex.wood(1, 2, [96, 64, 36])} /></mesh>
      </group>
      {/* la sirga: del mástil a la fila de hombres; se tensa cuando aparecen */}
      <mesh geometry={tubeG("sirga" + Math.round(strain * 10) + Math.round(crawl * 50), [[mast[0], mast[1] + bob, -0.3], [lerp(mast[0], -0.3 + crawl, 0.5), 0.46 - 0.12 * (1 - strain), 0.18], [-0.3 + crawl, 0.3, 0.55]], 0.006, 40, 6)}><meshStandardMaterial color="#c9b48a" roughness={0.8} /></mesh>
      {/* los once sirgadores, inclinados hacia adelante, con la correa al pecho */}
      {Array.from({ length: 11 }, (_, i) => <group key={i} position={[-0.3 - i * 0.16 + crawl, 0.03, 0.55 + 0.02 * Math.sin(i)]} rotation={[0, 0, 0.18 * strain]}>
        <Stickman escala={0.14} rotY={-90} guion={[{ t: 0, accion: "empujar", expr: i % 3 ? "decidido" : "triste" }]} semilla={20 + i} contacto={0.4} colorContacto="#2a1a10" />
      </group>)}
    </>;
  }}</U3>;
};

// ---------------- 5 · RELOJ DE DOCE: las porciones de cada oficio llenan el reloj y no llegan ----------------
export const RelojDoce3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aT = Math.min(sec(p, "total", 2.4), D - 1.4);
  const hrs = [2, 10 / 60, 1, 4, 3, 0.25, 40 / 3600, 0.5], cols = ["#d9b27c", "#b0532e", "#c8a46c", "#8a5a32", "#7a8a3a", "#c0c4ca", "#5a7a5a", "#6a4628"];
  const face = tex.text("doce", 1024, 1024, (g) => { g.fillStyle = "#efe6d2"; g.fillRect(0, 0, 1024, 1024); g.fillStyle = "#3a2a18"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "800 92px Georgia";
    for (let h = 1; h <= 12; h++) { const a = h / 12 * 2 * PI; g.fillText(String(h), 512 + Math.sin(a) * 420, 512 - Math.cos(a) * 420); }
    for (let m = 0; m < 60; m++) { const a = m / 60 * 2 * PI, r0 = m % 5 ? 470 : 455; g.fillRect(512 + Math.sin(a) * r0 - 3, 512 - Math.cos(a) * r0 - 3, 6, 6); } });
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[-1.0, 2.0, 2.2]}
    cam={{ at: [0, 0.62, 0], az: [-0.3, -0.05], el: [0.12, 0.04], r: [2.2, 1.8], fov: 34 }}>{(tt) => {
    let acc = 0; const gap = eio(tt, aT, aT + 0.8);
    return <group position={[0, 0.62, 0]}>
      {/* el atril de madera que lo sostiene */}
      <RBox s={[0.5, 0.06, 0.34]} r={0.01} p={[0, -0.6, 0.0]}><meshStandardMaterial map={tex.wood(2, 1, [104, 66, 36])} roughness={0.7} /></RBox>
      <RBox s={[0.08, 0.5, 0.06]} r={0.01} p={[0, -0.36, -0.1]}><meshStandardMaterial map={tex.wood(1, 2, [104, 66, 36])} roughness={0.7} /></RBox>
      <mesh position={[0, -0.628, 0.15]} rotation={[-PI / 2, 0, 0]} scale={[2.2, 0.8, 1]}><circleGeometry args={[0.3, 40]} /><meshBasicMaterial color="#000" transparent opacity={0.35} depthWrite={false} /></mesh>
      {/* la caja del reloj y la esfera */}
      <mesh rotation={[PI / 2, 0, 0]} position={[0, 0, -0.06]} castShadow><cylinderGeometry args={[0.6, 0.6, 0.1, 64]} />{M.brass({ col: "#b08a40" })}</mesh>
      <mesh position={[0, 0, -0.005]}><circleGeometry args={[0.55, 64]} /><meshStandardMaterial map={face} roughness={0.7} /></mesh>
      {/* las porciones: cuñas gruesas que salen de la esfera, una por oficio */}
      {hrs.map((h, i) => { const k = eio(tt, 0.4 + i * 0.32, 0.9 + i * 0.32), s0 = acc / 12 * 2 * PI; acc += h; const len = Math.max(0.0001, h / 12 * 2 * PI * k);
        return <mesh key={i} rotation={[PI / 2, 0, 0]} position={[0, 0, 0.012 + 0.012 * i]}><cylinderGeometry args={[0.42, 0.42, 0.02 + 0.002 * i, 64, 1, false, PI - s0 - len, len]} /><meshStandardMaterial color={cols[i]} roughness={0.55} /></mesh>; })}
      {/* lo que falta para doce: un hueco que late en rojo */}
      <mesh rotation={[PI / 2, 0, 0]} position={[0, 0, 0.02]}><cylinderGeometry args={[0.43, 0.43, 0.012, 64, 1, false, PI - 2 * PI, 2 * PI - acc / 12 * 2 * PI]} /><meshStandardMaterial color="#5a0e0a" emissive="#c0281e" emissiveIntensity={0.15 + 0.35 * gap * (0.6 + 0.4 * Math.sin(tt * 2 * PI * 0.8))} transparent opacity={0.85 * gap} roughness={0.5} /></mesh>
      {/* las agujas y el eje */}
      <mesh position={[0, 0, 0.12]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.04, 24]} />{M.brass()}</mesh>
      <group position={[0, 0, 0.11]} rotation={[0, 0, -acc / 12 * 2 * PI * eio(tt, 0.4, 0.9 + 7 * 0.32)]}><RBox s={[0.02, 0.36, 0.012]} r={0.005} p={[0, 0.17, 0]}><meshStandardMaterial color="#1e1610" roughness={0.4} /></RBox></group>
    </group>;
  }}</U3>;
};

// ---------------- 6 · PIRÁMIDE DE OFICIOS: los logros arriba; al levantarla, la gente que la sostiene ----------------
const LOGROS = ["PIRÁMIDES", "ORO", "MURALLA", "IMPERIO", "CIUDAD", "PLATA", "MEDICINA", "BARCOS"];
export const PiramideOficios3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aD = Math.min(sec(p, "debajo", 2.2), D - 3), aA = Math.min(sec(p, "amigos", aD + 2.4), D - 1.2);
  return <U3 d={d} bg={p.bg} ground={[176, 142, 98]} mode="drop" key1={[-1.4, 2.8, 1.6]}
    cam={{ at: [0, 0.9, 0], at1: [0, 0.75, 0.2], az: [-0.2, 0.15], el: [0.1, 0.06], r: [3.8, 3.4], fov: 36 }}>{(tt) => {
    const lift = eio(tt, aD, aD + 1.2) * 0.42;
    return <>
      {/* los escalones de la pirámide, cada uno con su logro grabado */}
      <group position={[0, lift, 0]}>
        {LOGROS.map((w, i) => { const lvl = LOGROS.length - 1 - i, wd = 0.5 + lvl * 0.24, y = 0.12 + i * 0.16, a = 0.2 + lvl * 0.18;
          return <group key={i} position={[0, y + fallY(tt, a, 1.4), 0]} visible={tt > a - 0.3}>
            <RBox s={[wd, 0.15, 0.5]} r={0.012}><meshStandardMaterial map={dirtT([206 - i * 4, 176 - i * 3, 122])} roughness={0.95} /></RBox>
            <mesh position={[0, 0, 0.252]}><planeGeometry args={[Math.min(wd * 0.9, 0.72), 0.12]} /><meshStandardMaterial map={label("pir" + i, w, 512, 128, "#4a2a12", "800 66px Georgia")} transparent roughness={0.9} /></mesh>
          </group>; })}
      </group>
      {/* la base: la gente, con los brazos arriba, sosteniendo todo */}
      {Array.from({ length: 13 }, (_, i) => <group key={i} position={[-1.08 + i * 0.18, 0, 0.05 + 0.1 * (i % 2)]} visible={tt > aD - 0.1}>
        <Stickman escala={0.11} rotY={0} guion={[{ t: 0, accion: "festejar", expr: i % 2 ? "triste" : "nervioso" }]} semilla={40 + i} contacto={0.35} colorContacto="#2a1a10" />
      </group>)}
      {/* la placa al pie, al final */}
      <group position={[0, 0.07, 0.62]} rotation={[-0.35, 0, 0]} scale={pop(tt, aA)}>
        <RBox s={[1.1, 0.16, 0.03]} r={0.01}>{M.brass({ col: "#c8963e" })}</RBox>
        <mesh position={[0, 0, 0.017]}><planeGeometry args={[1.05, 0.15]} /><meshStandardMaterial map={label("amigos", "LOS AMIGOS DEL REY", 1024, 140, "#3a2008", "800 70px Georgia")} transparent roughness={0.4} /></mesh>
      </group>
    </>;
  }}</U3>;
};

// ---------------- 7 · ELIGE OFICIO: ocho herramientas en la mesa, el foco duda entre ellas ----------------
export const EligeOficio3D: React.FC<UP> = ({ d, p }) => {
  const aE = sec(p, "elegir", 3);
  const xs = Array.from({ length: 8 }, (_, i) => -1.75 + i * 0.5);
  return <U3 d={d} bg={p.bg} ground={null} floor="dark" mode="iris" key1={[-1.2, 2.6, 1.2]}
    cam={{ at: [-1.2, 0.12, 0], at1: [0.1, 0.12, 0], az: [-0.15, 0.1], el: [0.36, 0.3], r: [1.5, 1.3], fov: 40 }}>{(tt) => {
    const scan = cl(tt / Math.max(0.5, aE)) * 7, hes = tt > aE ? 3.5 + Math.sin((tt - aE) * 2.2) * 1.6 * (1 - eio(tt, aE + 2, aE + 4)) : scan, lx = lerp(xs[0], xs[7], hes / 7);
    const wood = tex.wood(1, 1, [120, 84, 50]);
    const T = [
      // pisón de piedra con mango
      <group><mesh position={[0, 0.05, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.045, 0.045, 0.1, 20]} /><meshStandardMaterial color="#8a8680" roughness={0.9} /></mesh><mesh position={[0, 0.05, 0.12]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.22, 10]} /><meshStandardMaterial map={wood} /></mesh></group>,
      // pico de minero
      <group><mesh position={[0, 0.02, 0]} rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.3, 10]} /><meshStandardMaterial map={wood} /></mesh><mesh position={[0, 0.02, -0.13]} rotation={[0, 0, PI / 2]} castShadow><coneGeometry args={[0.018, 0.22, 4]} />{M.steel()}</mesh></group>,
      // rollo de cuerda
      <group><mesh position={[0, 0.03, 0]} rotation={[PI / 2, 0, 0]} castShadow><torusGeometry args={[0.08, 0.028, 12, 32]} /><meshStandardMaterial color="#c9b48a" roughness={0.9} /></mesh></group>,
      // frasco de sanguijuelas
      <group><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.05, 0.05, 0.14, 24, 1, true]} />{M.glass({ op: 0.25 })}</mesh><mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.046, 0.046, 0.09, 24]} />{M.water({ col: "#6a7a4a", op: 0.6 })}</mesh></group>,
      // canasta de mecapal
      <group><mesh position={[0, 0.0, 0]} castShadow geometry={latheG("cest8", [[0, 0], [0.06, 0], [0.08, 0.1], [0.085, 0.13], [0.08, 0.13]], 24)}><meshStandardMaterial color="#b08a52" roughness={0.9} side={THREE.DoubleSide} /></mesh></group>,
      // rollo de venda
      <group><mesh position={[0, 0.045, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.045, 0.045, 0.1, 24]} /><meshStandardMaterial color="#e9dcc0" roughness={0.9} /></mesh></group>,
      // pincel de pintar marcas
      <group><mesh position={[0, 0.015, 0]} rotation={[PI / 2, 0, 0.3]} castShadow><cylinderGeometry args={[0.008, 0.008, 0.26, 8]} /><meshStandardMaterial map={wood} /></mesh><mesh position={[0.04, 0.015, -0.13]} rotation={[PI / 2, 0, 0.3]}><coneGeometry args={[0.014, 0.04, 10]} /><meshStandardMaterial color="#8a2a14" roughness={0.6} /></mesh></group>,
      // candil de aceite
      <group><mesh position={[0, 0.03, 0]} scale={[1.4, 0.6, 1]} castShadow><sphereGeometry args={[0.05, 20, 14]} /><meshStandardMaterial color="#a2552e" roughness={0.8} /></mesh><mesh position={[0.07, 0.05, 0]}><sphereGeometry args={[0.012, 10, 8]} />{M.glow({ col: "#ffc46a" })}</mesh></group>,
    ];
    return <>
      {/* la mesa de madera vieja */}
      <RBox s={[4.4, 0.06, 1.0]} r={0.01} p={[0, -0.03, 0]}><meshStandardMaterial map={tex.wood(5, 1, [92, 60, 34])} roughness={0.75} /></RBox>
      {T.map((t, i) => { const near = Math.max(0, 1 - Math.abs(lx - xs[i]) / 0.3), a = 0.15 + i * 0.12;
        return <group key={i} position={[xs[i], fallY(tt, a, 0.6) + 0.03 * near, 0]} rotation={[0, 0.25 * near * Math.sin(tt * 3), 0]} scale={2.1 * (1 + 0.15 * near)} visible={tt > a - 0.25}>{t}</group>; })}
      {/* el foco que recorre la mesa: siempre montado */}
      <spotLight position={[lx, 1.6, 0.4]} target-position={[lx, 0, 0]} angle={0.2} penumbra={0.45} intensity={60} distance={3} color="#fff1d6" castShadow />
      <mesh position={[lx, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.28, 40]} />{M.glow({ col: "#fff1d6", op: 0.2 })}</mesh>
    </>;
  }}</U3>;
};
