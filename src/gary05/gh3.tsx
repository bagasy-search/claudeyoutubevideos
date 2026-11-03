// gary05 · componentes únicos 3/4 (min 10-15).
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, lerp, rn, tubeG } from "./h3d";
import { PI, Txt3, PBox, roll } from "./gk";
import { Cage, Flame, Thermostat } from "./fk";

type V = [number, number, number];
const z1 = (k: number) => Math.max(0.001, k);

// 10:35 · EL TRANSFORMADOR LO MULTIPLICA: corte del tacho del poste; la corriente de la casa entra a la bobina chica
// (pocas vueltas) y sale por la grande (muchas vueltas); el tambor de números trepa de 120 a 7,200 voltios.
export const HStepUp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#090b10"
  cam={{ at: [0.02, 0.12, 0], az: [-0.25, 0.1], el: [0.1, 0.07], r: [1.95, 1.8], fov: 34 }}>{(tt) => {
  const flow = cl((tt - 0.6) / 0.6), v = roll(tt, 1.6, 3.6, 120, 7200), hot = cl((tt - 1.6) / 2);
  const coil = (x: number, n: number, r: number, col: string, k: string) => { const pts = Array.from({ length: n * 16 + 1 }, (_, i) => { const a = i / 16 * 2 * PI; return [x + r * Math.cos(a), -0.2 + 0.4 * i / (n * 16), r * Math.sin(a)]; }); return <mesh geometry={tubeG(k, pts, 0.006, n * 24, 6)}>{M.brass({ col })}</mesh>; };
  return <>
    {/* el núcleo de hierro */}
    <mesh position={[0, 0.27, 0]}><boxGeometry args={[0.62, 0.06, 0.08]} />{M.steel({ col: "#555b61" })}</mesh>
    <mesh position={[0, -0.27, 0]}><boxGeometry args={[0.62, 0.06, 0.08]} />{M.steel({ col: "#555b61" })}</mesh>
    {[-0.22, 0.22].map((x) => <mesh key={x} position={[x, 0, 0]}><boxGeometry args={[0.07, 0.6, 0.07]} />{M.steel({ col: "#555b61" })}</mesh>)}
    {coil(-0.22, 4, 0.07, "#c98a3a", "su1")}
    {coil(0.22, 18, 0.07, "#c98a3a", "su2")}
    {/* chispitas que entran y salen */}
    {Array.from({ length: 12 }, (_, i) => { const u = (tt * 0.5 + i / 12) % 1; return <mesh key={"a" + i} position={[lerp(-0.75, -0.3, u), -0.15, 0.08]}><sphereGeometry args={[0.009, 8, 6]} />{M.glow({ col: "#ffcf4a", op: flow })}</mesh>; })}
    {Array.from({ length: 30 }, (_, i) => { const u = (tt * 0.9 + i / 30) % 1; return <mesh key={"b" + i} position={[lerp(0.3, 0.85, u), 0.15 + 0.01 * Math.sin(i), 0.08]}><sphereGeometry args={[0.009 + 0.008 * hot, 8, 6]} />{M.glow({ col: "#ff5a3a", op: hot })}</mesh>; })}
    <mesh geometry={tubeG("sui", [[-0.8, -0.15, 0.08], [-0.29, -0.15, 0.08]], 0.007, 10, 6)}>{M.rubber({ col: "#2b2c2e" })}</mesh>
    <mesh geometry={tubeG("suo", [[0.29, 0.15, 0.08], [0.9, 0.15, 0.08]], 0.007, 10, 6)}>{M.rubber({ col: "#2b2c2e" })}</mesh>
    <Txt3 txt="120 V · YOUR HOUSE" w={0.36} h={0.05} col="#ffcf4a" p={[-0.55, -0.24, 0.08]} />
    <group position={[0.55, 0.32, 0.05]}><DigitDrum v={v} w={0.05} r={0.04} /></group>
    <Txt3 txt="VOLTS ON THE LINE" w={0.32} h={0.045} col="#ff6a5a" glow p={[0.55, 0.22, 0.08]} op={hot} />
    <Txt3 txt={`${(v < 300 ? 120 : Math.round(v / 100) * 100).toLocaleString("en-US")} V`} w={0.5} h={0.13} col="#ff5a3a" glow p={[0.6, 0.5, 0.08]} op={flow} />
    <Txt3 txt="DEADLY FOR LINE WORKERS" w={0.6} h={0.07} col="#f7f4ee" bg="#b3221b" p={[0.6, -0.12, 0.1]} op={cl((tt - 3.6) / 0.4)} />
  </>;
}}</Scene3D>;

// 11:47 · EL CICLO: un reloj de una hora; mientras el calefactor anda, la aguja pinta naranja; cuando para, pinta azul;
// a la vuelta queda la torta pintada: un tercio a la mitad del tiempo encendido → promedio ~250 W.
export const HDutyCycle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#0c0d11"
  cam={{ at: [0.1, -0.06, 0], az: [-0.25, 0.1], el: [0.1, 0.06], r: [1.7, 1.55], fov: 34 }}>{(tt) => {
  const u = cl((tt - 0.4) / 4.0), ang = u * 2 * PI, ON = [[0, 0.14], [0.36, 0.5], [0.72, 0.86]];
  const isOn = (x: number) => ON.some(([a, b]) => x >= a && x < b), now = isOn(u);
  const N = 72, R = 0.3;
  return <>
    <mesh rotation={[PI / 2, 0, 0]} position={[0, 0, -0.03]}><cylinderGeometry args={[R + 0.03, R + 0.03, 0.03, 64]} />{M.matte({ col: "#1b1d21" })}</mesh>
    {Array.from({ length: N }, (_, i) => { const a0 = i / N; if (a0 > u) return null; return <mesh key={i} rotation={[0, 0, PI / 2 - a0 * 2 * PI - PI / N]}>
      <ringGeometry args={[0.05, R, 2, 1, 0, 2 * PI / N + 0.002]} /><meshBasicMaterial color={isOn(a0) ? "#ff8a3a" : "#2c5f9a"} side={2} toneMapped={false} /></mesh>; })}
    <group rotation={[0, 0, -ang]}><mesh position={[0, R / 2, 0.01]}><boxGeometry args={[0.012, R, 0.008]} />{M.matte({ col: "#f2f2f2" })}</mesh></group>
    <mesh position={[0, 0, 0.015]}><cylinderGeometry args={[0.018, 0.018, 0.01, 20]} />{M.chrome()}</mesh>
    {[0, 0.25, 0.5, 0.75].map((q) => <Txt3 key={q} txt={["0", "15", "30", "45"][q * 4]} w={0.06} h={0.04} col="#cfd5dc" p={[Math.sin(q * 2 * PI) * (R + 0.08), Math.cos(q * 2 * PI) * (R + 0.08), 0]} />)}
    <group position={[0.62, -0.05, 0]}><Flame k={now ? 1 : 0.001} t={tt} s={2.4} /></group>
    <Txt3 txt={now ? "HEATING" : "RESTING"} w={0.22} h={0.05} col={now ? "#ff8a3a" : "#5ab8ff"} glow p={[0.62, -0.17, 0]} />
    <Txt3 txt="AVERAGE ≈ 250 W" w={0.38} h={0.06} col="#ffffff" glow p={[0.1, -0.46, 0]} op={cl((tt - 4.4) / 0.4)} />
  </>;
}}</Scene3D>;

// 12:22 · LA BATERÍA EN REBANADAS: el bloque de 1000 Wh pierde su 15 % (la cáscara se va) y el cuchillo lo corta en
// rebanadas de 250 Wh: cada rebanada es una hora; salen tres y media. Al lado, el de 2000: siete.
export const HSlices: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#0f0e0d"
  cam={{ at: [0.05, 0.12, 0], az: [-0.5, -0.2], el: [0.3, 0.22], r: [1.6, 1.35], fov: 34 }}>{(tt) => {
  const peel = eio(tt, 0.5, 1.1), cuts = [1.4, 1.9, 2.4], L = 0.85 * 0.8, sw = L / 3.4;
  const kx = cuts.reduce((x, c, i) => (tt > c - 0.25 && tt < c + 0.25 ? -L / 2 + sw * (i + 1) : x), -9);
  return <>
    <group position={[0, 0.09, 0]}>
      {/* la cáscara que se pierde (15 %) */}
      <mesh position={[L / 2 + 0.06 * 0.8 + peel * 0.25, 0.0, 0]} rotation={[0, 0, -peel * 0.6]}><boxGeometry args={[0.12 * 0.8, 0.16, 0.22]} />{M.matte({ col: "#7a7f86" })}</mesh>
      <Txt3 txt="−15 %" w={0.12} h={0.045} col="#ff6a5a" p={[L / 2 + 0.06 + peel * 0.25, 0.12, 0.12]} op={peel} />
      {Array.from({ length: 4 }, (_, i) => { const w = i < 3 ? sw : L - 3 * sw, x0 = -L / 2 + sw * i + w / 2, cut = i < 3 ? cl((tt - cuts[i] - 0.2) / 0.5) : cl((tt - cuts[2] - 0.2) / 0.5);
        return <group key={i} position={[x0 + (i - 1.5) * 0.06 * cut, 0, 0]}>
          <RBox s={[w - 0.006, 0.16, 0.22]} r={0.01}><meshPhysicalMaterial color={i < 3 ? "#4fa36a" : "#87c49a"} roughness={0.45} clearcoat={0.4} /></RBox>
          <Txt3 txt={i < 3 ? "1 HR" : "½"} w={0.1} h={0.05} col="#ffffff" p={[0, 0, 0.112]} op={cut} />
        </group>; })}
      {/* el cuchillo */}
      <group position={[kx, 0.2 - (kx > -5 ? 0.18 * Math.sin(PI * cl(((tt - 1.15) % 0.5) / 0.5)) : 0), 0]} visible={kx > -5}>
        <mesh><boxGeometry args={[0.004, 0.22, 0.3]} />{M.chrome()}</mesh>
        <mesh position={[0, 0.14, 0]}><boxGeometry args={[0.03, 0.06, 0.16]} />{M.wood({ base: [80, 50, 30] })}</mesh>
      </group>
    </group>
    <Txt3 txt="1000 Wh → 3½ HOURS" w={0.5} h={0.06} col="#ffffff" glow p={[0, 0.36, 0]} op={cl((tt - 2.9) / 0.3)} />
    <Txt3 txt="2000 Wh → 7 HOURS" w={0.46} h={0.055} col="#6fe39a" glow p={[0, 0.29, 0]} op={cl((tt - 3.5) / 0.3)} />
  </>;
}}</Scene3D>;

// 12:54 · CASI NUEVE HORAS: por la ventana la luna cruza el cielo de la noche y del otro lado empieza a clarear; la
// estación baja de 100 a 10 %, el contador de horas llega a 8:50 y la llama sigue azul toda la noche.
export const HNineH: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#05070c"
  cam={{ at: [0, 0.45, 0], az: [-0.2, 0.15], el: [0.08, 0.05], r: [1.7, 1.45], fov: 34 }}>{(tt) => {
  const u = cl((tt - 0.3) / 4.2), pct = Math.round(lerp(100, 10, u)), hr = u * 8.83, dawn = cl((u - 0.75) / 0.25);
  const sky = `rgb(${Math.round(lerp(8, 70, dawn))},${Math.round(lerp(12, 80, dawn))},${Math.round(lerp(28, 120, dawn))})`;
  return <>
    {/* la ventana con el cielo */}
    <mesh position={[0, 0.6, -0.4]}><planeGeometry args={[1.2, 0.7]} /><meshBasicMaterial color={sky} toneMapped={false} /></mesh>
    {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 1.15, 0.3 + rn(i, 2) * 0.65, -0.39]}><circleGeometry args={[0.003 + 0.003 * rn(i, 3), 6]} />{M.glow({ col: "#ffffff", op: (1 - dawn) * (0.5 + 0.5 * rn(i, 4)) })}</mesh>)}
    <mesh position={[lerp(-0.5, 0.5, u), 0.55 + 0.3 * Math.sin(PI * u), -0.38]}><circleGeometry args={[0.05, 32]} />{M.glow({ col: "#f3efe0", op: 1 - dawn * 0.6 })}</mesh>
    <mesh position={[0, 0.6, -0.37]}><boxGeometry args={[1.24, 0.03, 0.02]} />{M.wood({ base: [190, 180, 160] })}</mesh>
    <mesh position={[0, 0.6, -0.37]}><boxGeometry args={[0.03, 0.74, 0.02]} />{M.wood({ base: [190, 180, 160] })}</mesh>
    <mesh position={[0, 0.6, -0.375]}><boxGeometry args={[1.28, 0.78, 0.01]} /><meshStandardMaterial color="#d9d2c2" transparent opacity={0} /></mesh>
    <PBox w={0.34} h={0.26} d={0.2} p={[-0.3, 0.0, 0.1]} scr={`${pct}%`} scrCol={pct < 20 ? "#ff6a5a" : "#4dff9a"} />
    <group position={[0.35, 0.04, 0.1]}>
      <mesh position={[0, 0.03, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.18, 16]} />{M.steel({ col: "#8a8f94" })}</mesh>
      <Flame k={1} t={tt} s={2.6} p={[0, 0.07, 0]} />
    </group>
    <Txt3 txt={`${Math.floor(hr)}:${String(Math.floor((hr % 1) * 60)).padStart(2, "0")} HRS`} w={0.34} h={0.07} col="#ffffff" glow p={[0, 0.3, 0.1]} />
  </>;
}}</Scene3D>;

// 13:26 · BAJÁ EL TERMOSTATO: la perilla redonda gira de 68 a 62; abajo, la tira de la noche: cada bloque naranja es una
// vez que el calefactor arranca; con cada grado los bloques se achican y aparece más hueco oscuro (batería que sobra).
export const HStretch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#0c0d11"
  cam={{ at: [0.1, 0.05, 0], az: [-0.2, 0.15], el: [0.12, 0.08], r: [1.85, 1.62], fov: 34 }}>{(tt) => {
  const temp = roll(tt, 0.6, 2.8, 68, 62), k = (68 - temp) / 6, len = lerp(0.12, 0.06, k);
  return <>
    <Thermostat temp={temp} p={[0, 0.2, 0]} s={1.6} flame={1} />
    <mesh position={[0, -0.22, -0.01]}><boxGeometry args={[1.2, 0.08, 0.02]} />{M.matte({ col: "#16181c" })}</mesh>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.5 + i * 0.2, -0.22, 0.005]} scale={[z1(len / 0.12), Math.max(0.001, cl(6 - 2 * k - i)), 1]}><boxGeometry args={[0.12, 0.06, 0.012]} /><meshStandardMaterial color="#ff8a3a" visible={cl(6 - 2 * k - i) > 0.02} emissive="#ff6a10" emissiveIntensity={0.6} /></mesh>)}
    <Txt3 txt="FURNACE STARTS / NIGHT" w={0.6} h={0.065} col="#cfd5dc" p={[0, -0.32, 0]} />
    <Txt3 txt={`+${Math.round(k * 45)}% BATTERY`} w={0.32} h={0.06} col="#6fe39a" glow p={[0.45, 0.25, 0]} op={cl((tt - 1.2) / 0.4)} />
  </>;
}}</Scene3D>;

// 14:08 · TIBIO A RÁFAGAS: la cinta de la temperatura de la casa se dibuja en el aire: sube a 66, baja a 58 (ahí la
// frazada cubre el bulto de la cama) y vuelve a 66 a la mañana; el tramo bajo es el que salva la batería.
export const HBursts: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#0b0c10"
  cam={{ at: [0, 0.3, 0], az: [-0.3, 0.1], el: [0.14, 0.1], r: [1.7, 1.45], fov: 34 }}>{(tt) => {
  const Y = (f: number) => 0.1 + (f - 56) * 0.045, xs = [-0.7, -0.4, -0.2, 0.25, 0.42, 0.7], fs = [60, 66, 58, 58, 66, 66];
  const u = cl((tt - 0.4) / 3.0), n = 80, pts = Array.from({ length: n }, (_, i) => { const x = lerp(-0.7, 0.7, i / (n - 1) * u + 1e-4); let j = 0; while (j < xs.length - 2 && x > xs[j + 1]) j++; const f = cl((x - xs[j]) / (xs[j + 1] - xs[j])), s = f * f * (3 - 2 * f); return [x, Y(lerp(fs[j], fs[j + 1], s)), 0]; });
  const cover = eio(tt, 1.6, 2.2) * (1 - eio(tt, 3.0, 3.5));
  return <>
    <mesh geometry={tubeG("bu" + Math.round(u * 40), pts, 0.012, 120, 8)}>{M.glow({ col: "#ff8a3a" })}</mesh>
    {[[66, -0.4], [58, 0.0], [66, 0.55]].map(([f, x], i) => <Txt3 key={i} txt={`${f}°`} w={0.1} h={0.05} col="#ffffff" p={[x, Y(f) + 0.07, 0]} op={cl((u - (x + 0.7) / 1.4) * 8)} />)}
    {/* la cama con la frazada */}
    <group position={[0.02, 0.0, 0.1]}>
      <RBox s={[0.42, 0.08, 0.26]} p={[0, 0.04, 0]} r={0.02}>{M.wood({ base: [110, 78, 50] })}</RBox>
      <mesh position={[0.08, 0.11, 0]} scale={[1.6, 0.6, 1]}><sphereGeometry args={[0.07, 20, 14]} />{M.matte({ col: "#cfc6b6" })}</mesh>
      <mesh position={[-0.14, 0.11, 0]}><sphereGeometry args={[0.04, 18, 12]} />{M.matte({ col: "#e0b48f" })}</mesh>
      <mesh position={[0.04, 0.1 + 0.03 * cover, 0]} scale={[1, z1(cover), 1]}><boxGeometry args={[0.36, 0.06, 0.27]} />{M.matte({ col: "#b5342b" })}</mesh>
    </group>
    <Txt3 txt="BATTERY SAVED HERE" w={0.38} h={0.05} col="#6fe39a" glow p={[0.02, -0.06, 0.12]} op={cover} />
  </>;
}}</Scene3D>;

// 14:35 · EL PANEL DE DICIEMBRE: el sol hace un arco bajito y corto sobre el patio nevado; la sombra del panel es larga;
// el contador del panel suma despacito hasta ~500 Wh, al lado de la raya de 2000 que no alcanza.
export const HSolar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#7e95b4"
  cam={{ at: [0, 0.25, 0], az: [-0.5, -0.25], el: [0.14, 0.1], r: [1.85, 1.7], fov: 34 }}>{(tt) => {
  const u = cl((tt - 0.3) / 3.6), sx = lerp(-1.2, 1.2, u), sy = 0.3 + 0.35 * Math.sin(PI * u), wh = Math.round(lerp(0, 500, u));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, -0.001, 0]}><planeGeometry args={[6, 6]} /><meshStandardMaterial color="#eef2f7" roughness={0.9} /></mesh>
    <mesh position={[sx, sy + 0.75, -1.6]}><sphereGeometry args={[0.08, 24, 16]} />{M.glow({ col: "#fff1c0" })}</mesh>
    <directionalLight position={[sx * 2, sy * 2 + 0.2, -2]} intensity={1.6 * Math.sin(PI * u)} color="#ffe6b0" />
    {/* el panel de 200 W apoyado mirando al sur */}
    <group position={[0, 0, 0]} rotation={[-1.0, 0, 0]}>
      <RBox s={[0.6, 0.012, 0.36]} p={[0, 0.2, 0]} r={0.004}><meshPhysicalMaterial color="#1b2a4a" metalness={0.4} roughness={0.25} clearcoat={0.8} /></RBox>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.24 + i * 0.12, 0.207, 0]}><boxGeometry args={[0.004, 0.002, 0.34]} />{M.steel({ col: "#9aa0a6" })}</mesh>)}
    </group>
    {[-0.25, 0.25].map((x) => <mesh key={x} position={[x, 0.1, 0.12]} rotation={[0.5, 0, 0]}><boxGeometry args={[0.02, 0.24, 0.02]} />{M.steel()}</mesh>)}
    <mesh rotation={[-PI / 2, 0, -sx * 0.3]} position={[-sx * 0.25, 0.002, 0.45]}><planeGeometry args={[0.55, 0.9 / Math.max(0.35, Math.sin(PI * u))]} /><meshBasicMaterial color="#9fb0c6" transparent opacity={0.45 * Math.sin(PI * u)} depthWrite={false} /></mesh>
    <PBox w={0.3} h={0.22} d={0.18} p={[0.55, 0, 0.2]} scr={`${wh} Wh`} />
    <Txt3 txt="200 W PANEL · DECEMBER" w={0.8} h={0.1} col="#f7f4ee" p={[0, 0.5, 0.3]} />
    <Txt3 txt="400–600 Wh / DAY" w={0.5} h={0.075} col="#f7f4ee" bg="#b3221b" p={[0.4, 0.38, 0.35]} op={cl((tt - 3.6) / 0.4)} />
  </>;
}}</Scene3D>;

// 15:13 · EL INVERSOR AL AUTO: las pinzas muerden los bornes de la batería del auto con resorte, el fusible entra en su
// porta, el inversor con aletas se prende y la estación de al lado sube rápido; el escape del auto sale al cielo.
export const HCarInv: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark" bg="#0c0e12"
  cam={{ at: [0.12, 0.15, 0], az: [-0.45, -0.15], el: [0.22, 0.16], r: [1.95, 1.7], fov: 34 }}>{(tt) => {
  const bite = (a: number) => tt < a ? 0 : phys(tt, a, 12, 0.4), fz = tt < 1.8 ? 0 : phys(tt, 1.8, 12, 0.45), on = cl((tt - 2.3) / 0.3), pct = roll(tt, 2.5, 4.4, 20, 80);
  return <>
    {/* la batería del auto */}
    <RBox s={[0.34, 0.22, 0.2]} p={[-0.45, 0.11, 0]} r={0.012}>{M.plastic({ col: "#1f2125" })}</RBox>
    {[[-0.55, "#c62a22"], [-0.35, "#222"]].map(([x, c], i) => <group key={i} position={[x as number, 0.24, 0]}>
      <mesh><cylinderGeometry args={[0.018, 0.02, 0.03, 16]} />{M.steel({ col: "#9aa0a6" })}</mesh>
      {/* la pinza que baja y muerde */}
      <group position={[0, 0.03 + 0.25 * (1 - bite(0.5 + i * 0.45)), 0]} rotation={[0, 0, 0.3 * (1 - bite(0.5 + i * 0.45))]}>
        <RBox s={[0.03, 0.09, 0.05]} p={[0, 0.045, 0]} r={0.008}>{M.plastic({ col: c as string })}</RBox>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.016, -0.005, 0]} rotation={[0, 0, s * 0.25 * (1 - bite(0.5 + i * 0.45))]}><boxGeometry args={[0.006, 0.04, 0.04]} />{M.brass()}</mesh>)}
      </group>
      <mesh geometry={tubeG("ci" + i, [[0, 0.12, 0], [0.12 + i * 0.03, 0.28, 0.02], [0.32, 0.18, 0.02]], 0.01, 30, 8)}>{M.rubber({ col: c as string })}</mesh>
    </group>)}
    {/* el porta fusible */}
    <group position={[-0.08, 0.18, 0.04]}>
      <RBox s={[0.1, 0.05, 0.05]} r={0.006}>{M.glass({ op: 0.4 })}</RBox>
      <mesh position={[0, 0.2 * (1 - fz), 0]}><boxGeometry args={[0.07, 0.012, 0.02]} /><meshStandardMaterial color="#e2352a" emissive="#e2352a" emissiveIntensity={0.3} /></mesh>
      <Txt3 txt="FUSE" w={0.1} h={0.035} col="#f2c21b" p={[0, -0.05, 0.03]} />
    </group>
    {/* el inversor de aletas */}
    <group position={[0.18, 0.06, 0]}>
      <RBox s={[0.24, 0.1, 0.16]} p={[0, 0.05, 0]} r={0.01}>{M.steel({ col: "#7d848b" })}</RBox>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.1 + i * 0.025, 0.11, 0]}><boxGeometry args={[0.005, 0.03, 0.15]} />{M.steel({ col: "#9aa0a6" })}</mesh>)}
      <mesh position={[0.1, 0.06, 0.081]}><circleGeometry args={[0.008, 12]} /><meshStandardMaterial color="#132" emissive="#3aff6a" emissiveIntensity={3 * on} toneMapped={false} /></mesh>
      <Txt3 txt="PURE SINE" w={0.12} h={0.03} col="#f7f4ee" p={[-0.03, 0.05, 0.082]} />
    </group>
    <mesh geometry={tubeG("cio", [[0.3, 0.06, 0], [0.4, 0.02, 0.05], [0.5, 0.05, 0.05]], 0.008, 20, 6)}>{M.rubber({ col: "#18191b" })}</mesh>
    <PBox w={0.26} h={0.2} d={0.16} p={[0.62, 0, 0]} scr={`${pct}%`} />
    {/* el escape afuera: humo que sube al cielo */}
    {Array.from({ length: 8 }, (_, i) => { const k = ((tt * 0.4 + i / 8) % 1); return <mesh key={i} position={[-0.85 - 0.05 * k, 0.1 + k * 0.6, -0.2]}><sphereGeometry args={[0.03 + 0.05 * k, 12, 8]} /><meshBasicMaterial color="#c9ccd1" transparent opacity={0.35 * (1 - k)} depthWrite={false} /></mesh>; })}
    <mesh position={[-0.8, 0.08, -0.2]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.02, 0.02, 0.12, 14]} />{M.steel({ col: "#6f757b" })}</mesh>
    <Txt3 txt="ENGINE RUNNING · OUTSIDE" w={0.46} h={0.05} col="#6fe39a" glow p={[0.25, 0.5, 0.05]} op={cl((tt - 2.6) / 0.4)} />
  </>;
}}</Scene3D>;
