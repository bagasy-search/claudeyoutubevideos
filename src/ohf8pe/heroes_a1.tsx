// ohf8pe · componentes únicos 1-11: dos camas, bloques en orden, la isla, tarjeta en la costura, plana a redonda, moneda, marcador, hisopo, arriba y abajo, 8 pies, cinta y tarjeta
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { Tape } from "./okit";
import { Bug, MiniBed, PI, SlickCup, Specks, faceTex, quilt, sv } from "./bkit";

const cloth = (c: string) => <meshStandardMaterial color={c} roughness={0.95} />;

// ---- DOS CAMAS: una impecable, otra revuelta; la misma chinche sube a las dos ----
export const HTwoBeds: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[0.5, 2.4, 2]}
  cam={{ at: [0, 0.32, 0], az: [-0.2, 0.14], el: [0.3, 0.24], r: [2.85, 2.6], fov: 32 }}>{(tt) => { const u = eio(tt, 0.8, 3.4);
  return <>
    <MiniBed p={[-0.62, 0.04, 0]} id="tl" />
    <MiniBed p={[0.62, 0.04, 0]} id="tr" messy />
    <RBox s={[0.16, 0.16, 0.12]} p={[1.0, 0.13, 0.5]} rot={[0, 0.5, 0.1]} r={0.01}>{cloth("#7c5f43")}</RBox>
    <RBox s={[0.3, 0.05, 0.22]} p={[0.28, 0.07, 0.56]} rot={[0, -0.4, 0]} r={0.012}>{cloth("#8a8f6d")}</RBox>
    {[-1, 1].map((k) => <Bug key={k} p={[k * 0.62 + lerp(0.1, 0.05, u), 0.38, lerp(0.7, 0.05, u)]} ry={PI / 2} s={1.5} run={tt} />)}
    <Tape txt="SAME BUGS" p={[0, 0.84, 0.1]} w={0.72} k={phys(tt, 3.5, 8, 0.45)} rev={cl((tt - 3.5) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- BLOQUES: las mismas seis piezas, tiradas; se ordenan solas ----
export const HOrderBlocks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="none" key1={[-0.8, 2.3, 2]}
  cam={{ at: [0, 0.22, 0], az: [0.26, -0.12], el: [0.3, 0.22], r: [2.1, 1.9], fov: 32 }}>{(tt) => <>
    {[0, 1, 2, 3, 4, 5].map((i) => { const k = phys(tt, 1.6 + i * 0.32, 7, 0.5), x0 = (rn(i, 3) - 0.5) * 1.6, z0 = (rn(i, 5) - 0.5) * 0.9, a0 = (rn(i, 6) - 0.5) * 2.4, X = lerp(x0, -0.75 + i * 0.3, k), Z = lerp(z0, 0.05, k), A = lerp(a0, 0, k);
      return <group key={i} position={[X, 0.13, Z]} rotation={[0, A, 0]}>
        <RBox s={[0.25, 0.25, 0.25]} r={0.02}>{M.wood({ rx: 1, ry: 1, base: [204, 164, 112] })}</RBox>
        <mesh position={[0, 0, 0.1345]}><planeGeometry args={[0.2, 0.2]} /><meshStandardMaterial map={faceTex(`ob${i}`, String(i + 1), "#d9bd8e")} roughness={0.8} /></mesh>
      </group>; })}
    <Tape txt="THE ORDER" p={[0, 0.58, 0.12]} w={0.72} k={phys(tt, 3.9, 8, 0.45)} rev={cl((tt - 3.9) / 0.7)} />
  </>}</Scene3D>;

// ---- LA ISLA: el agua nace en los vasos y rodea la cama; la chinche frena en la orilla ----
export const HIsland: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[0.8, 2.6, 1.6]}
  cam={{ at: [0, 0.2, 0], az: [0.46, 0.2], el: [0.56, 0.42], r: [2.9, 2.6], fov: 32 }}>{(tt) => { const f = eio(tt, 1.2, 3.4), b = eio(tt, 2.4, 4.6), bx = lerp(1.38, 0.98, b), turn = eio(tt, 4.7, 5.5);
  return <>
    <mesh position={[0, 0.05, 0]} scale={[sv(f), 1, sv(f)]}><cylinderGeometry args={[0.9, 0.9, 0.012, 80]} />{M.water()}</mesh>
    <MiniBed p={[0, 0.04, 0]} id="is" />
    {[[-0.4, -0.24], [0.4, -0.24], [-0.4, 0.24], [0.4, 0.24]].map(([x, z], i) => <SlickCup key={i} p={[x, 0.045, z]} />)}
    <Bug p={[bx, 0.045, 0.12]} ry={PI + turn * 2.6} s={2} run={b < 1 || turn > 0 ? tt : 0} />
    <Tape txt="ISLAND" p={[0, 0.7, 0.05]} w={0.56} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- LA COSTURA: la tarjeta recorre el borde y la tela se abre: adentro, los puntos ----
export const HCardSeam: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[0.4, 2, 2.3]}
  cam={{ at: [0, 0.55, 0.2], az: [-0.2, 0.12], el: [0.16, 0.1], r: [1.5, 1.36], fov: 32 }}>{(tt) => { const cx = lerp(-1.0, 0.72, eio(tt, 0.7, 4.8));
  return <>
    <RBox s={[3, 0.38, 0.9]} p={[0, 0.82, -0.05]} r={0.05}>{quilt("csA")}</RBox>
    <RBox s={[3, 0.38, 0.9]} p={[0, 0.28, -0.05]} r={0.05}>{quilt("csB")}</RBox>
    <RBox s={[3, 0.16, 0.02]} p={[0, 0.55, 0.3]} r={0.002}>{cloth("#b49a7a")}</RBox>
    <group position={[-0.1, 0.55, 0.316]} rotation={[PI / 2, 0, 0]}><Specks id={31} n={60} w={1.7} d={0.12} size={0.014} /></group>
    {Array.from({ length: 56 }, (_, i) => { const x = -1.5 + i * 0.054, op = cl((cx - x) / 0.32); return <mesh key={i} position={[x, 0.55 + 0.135 * op, 0.4 + 0.03 * op]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.052, 0.052, 0.056, 16]} /><meshStandardMaterial color="#e6dfcf" roughness={0.9} /></mesh>; })}
    <RBox s={[0.42, 0.26, 0.012]} p={[cx + 0.16, 0.56, 0.48]} rot={[0, 0.5, 0]} r={0.012}><meshStandardMaterial color="#3c6e9e" metalness={0.2} roughness={0.35} /></RBox>
    <mesh position={[cx + 0.1, 0.6, 0.5]}><circleGeometry args={[0.5, 40]} /><meshBasicMaterial color="#ffe9b0" transparent opacity={0.14} depthWrite={false} /></mesh>
    <group position={[cx + 0.75, 0.86, 0.72]} rotation={[0.3, 0.2, 2.4]}><mesh castShadow><cylinderGeometry args={[0.05, 0.04, 0.42, 22]} />{M.matte({ col: "#1b1b1d" })}</mesh></group>
  </>;
}}</Scene3D>;

// ---- DE HOJA A UVA: de perfil, plana y canela; come, se hincha y se pone roja ----
export const HFlatRound: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[0.4, 2, 2]}
  cam={{ at: [0, 0.1, 0], az: [0.42, 0.16], el: [0.62, 0.5], r: [1.1, 0.98], fov: 32 }}>{(tt) => { const f = eio(tt, 2.0, 4.0), a = phys(tt, 0.4, 8, 0.45) * (1 - eio(tt, 1.9, 2.3)), b = phys(tt, 3.9, 8, 0.45);
  return <>
    <RBox s={[2.6, 0.08, 1.4]} p={[0, -0.04, 0]} r={0.02}>{quilt("frq")}</RBox>
    <Bug p={[0, 0, 0]} s={3.6} fed={f} run={f < 1 ? tt * 0.25 : 0} />
    {a > 0.01 && <Tape txt="PAPER FLAT" p={[0, 0.4, 0.1]} w={0.5} k={a} rev={1} />}
    {b > 0.01 && <Tape txt="DARK RED" col="#b3261e" p={[0, 0.4, 0.1]} w={0.44} k={b} rev={cl((tt - 3.9) / 0.6)} />}
  </>;
}}</Scene3D>;

// ---- LA MONEDA: sobre un centavo, adulta, cría y huevo por tamaño ----
export const HCoinScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[0.5, 2.5, 1.4]}
  cam={{ at: [0, 0.07, 0], az: [0.3, -0.16], el: [0.92, 0.78], r: [1.32, 1.18], fov: 32 }}>{(tt) => { const a = phys(tt, 0.7, 7, 0.5), b = phys(tt, 2.0, 7, 0.5), c = phys(tt, 3.3, 7, 0.5);
  return <>
    <mesh position={[0, 0.058, 0]} castShadow><cylinderGeometry args={[0.36, 0.36, 0.022, 70]} /><meshStandardMaterial color="#a8603a" metalness={0.75} roughness={0.36} /></mesh>
    {[0.3, 0.2].map((r) => <mesh key={r} position={[0, 0.0705, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[r, 0.004, 8, 70]} /><meshStandardMaterial color="#8a4b2c" metalness={0.75} roughness={0.4} /></mesh>)}
    <Bug p={[-0.18, 0.07, 0.04]} s={sv(a)} ry={0.5} run={tt * 0.2} />
    <Bug p={[0.09, 0.07, -0.06]} s={sv(0.2 * b)} ry={-0.6} run={tt * 0.3} pale />
    <mesh position={[0.19, 0.08, 0.13]} scale={[sv(c), sv(c), sv(c * 1.5)]}><sphereGeometry args={[0.0085, 14, 10]} /><meshPhysicalMaterial color="#fbf6e6" roughness={0.3} clearcoat={0.6} /></mesh>
    <Tape txt="ADULT" p={[-0.18, 0.3, 0.2]} w={0.24} k={a} rev={cl((tt - 0.7) / 0.5)} />
    <Tape txt="BABY" p={[0.06, 0.24, -0.14]} w={0.22} k={b} rev={cl((tt - 2.0) / 0.5)} />
    <Tape txt="EGG" p={[0.33, 0.3, 0.22]} w={0.18} k={c} rev={cl((tt - 3.3) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- EL MARCADOR: la punta toca la tela y va dejando los puntos, uno por uno ----
export const HMarkerDots: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[0.6, 2.5, 1.7]}
  cam={{ at: [0, 0.2, 0], az: [-0.3, 0.1], el: [0.62, 0.5], r: [1.45, 1.3], fov: 32 }}>{(tt) => { const P = 10, cyc = cl((tt - 0.5) / 3.9) * P, i = Math.min(P - 1, Math.floor(cyc)), f = cyc - i, tap = Math.sin(f * PI), xy = (k: number) => [(rn(k, 41) - 0.5) * 1.1, (rn(k, 42) - 0.5) * 0.55] as const, q = xy(i), n = i === P - 1 ? xy(i) : xy(i + 1), X = lerp(q[0], n[0], eio(f, 0.55, 1)), Z = lerp(q[1], n[1], eio(f, 0.55, 1));
  return <>
    <RBox s={[3, 0.12, 1.8]} p={[0, 0.03, 0]} r={0.03}>{quilt("mdq")}</RBox>
    {Array.from({ length: P }, (_, k) => { const [x, z] = xy(k), v = cyc > k + 0.5 ? 1 : 0.001; return <mesh key={k} position={[x, 0.094, z]} scale={[v, 0.25, v]}><sphereGeometry args={[0.027 + rn(k, 44) * 0.012, 16, 10]} /><meshStandardMaterial color="#120e0c" roughness={0.65} /></mesh>; })}
    <group position={[X, 0.1 + 0.17 * (1 - tap) + (f > 0.5 ? 0.1 : 0), Z]} rotation={[0.12, 0, -0.24]}>
      <mesh position={[0, 0.03, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.022, 0.06, 16]} /><meshStandardMaterial color="#17120f" roughness={0.6} /></mesh>
      <mesh position={[0, 0.3, 0]} castShadow rotation={[PI, 0, 0]}><cylinderGeometry args={[0.052, 0.04, 0.5, 26]} />{M.matte({ col: "#20201f" })}</mesh>
    </group>
    <Tape txt="BLACK MARKER DOTS" p={[0.1, 0.52, 0.48]} w={0.7} k={phys(tt, 2.2, 8, 0.45)} rev={cl((tt - 2.2) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- EL HISOPO: moja, toca un punto y arrastra una mancha rojiza ----
export const HSwabSmear: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.5, 2.3, 1.9]}
  cam={{ at: [0, 0.14, 0], az: [0.3, -0.12], el: [0.5, 0.4], r: [1.0, 0.88], fov: 32 }}>{(tt) => { const go = eio(tt, 1.1, 1.9), dn = eio(tt, 1.9, 2.4), dr = eio(tt, 2.5, 4.2), up = eio(tt, 4.4, 4.9), X = lerp(-0.42, -0.12, go) + 0.42 * dr, Y = lerp(0.14, 0.05, dn - up * 0.8) + 0.2 * up;
  return <>
    <RBox s={[2, 0.08, 1.2]} p={[0, -0.03, 0]} r={0.02}>{quilt("ssq")}</RBox>
    <mesh position={[-0.42, 0.015, 0.05]} scale={[1.2, 0.22, 1]}><sphereGeometry args={[0.1, 26, 18]} />{M.water()}</mesh>
    <mesh position={[-0.12, 0.014, 0.05]} scale={[1, 0.25, 0.9]}><sphereGeometry args={[0.034, 18, 12]} /><meshStandardMaterial color="#110c0a" roughness={0.6} /></mesh>
    <mesh position={[-0.12 + 0.21 * dr, 0.0145, 0.05]} scale={[sv(dr * 0.21) / 0.05, 0.06, 0.6]}><sphereGeometry args={[0.05, 22, 14]} /><meshStandardMaterial color="#7d2c1c" roughness={0.75} transparent opacity={0.9} /></mesh>
    <group position={[X, Y + 0.03, 0.05]} rotation={[0, 0, -0.42]}>
      <mesh scale={[0.8, 1.35, 0.8]} castShadow><sphereGeometry args={[0.042, 22, 16]} /><meshStandardMaterial color={dr > 0.3 ? "#c9a596" : "#f4f2ec"} roughness={1} /></mesh>
      <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.009, 0.009, 0.6, 12]} /><meshStandardMaterial color="#f3f1ea" roughness={0.5} /></mesh>
    </group>
    <Tape txt="OLD BLOOD" col="#b3261e" p={[0.1, 0.25, 0.16]} w={0.3} k={phys(tt, 4.2, 8, 0.45)} rev={cl((tt - 4.2) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- ARRIBA Y ABAJO: entra en la rendija; las dos maderas se encienden donde la tocan ----
export const HTopBottom: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[0.8, 2, 2]}
  cam={{ at: [-0.05, 0.5, 0], az: [0.18, -0.12], el: [0.08, 0.05], r: [1.2, 1.08], fov: 32 }}>{(tt) => { const u = eio(tt, 0.6, 3.1), x = lerp(0.9, 0.05, u), g = eio(tt, 3.1, 3.9), G = "#ffb255";
  return <>
    <RBox s={[2.8, 0.46, 0.8]} p={[0, 0.81, 0]} r={0.006}>{M.wood({ rx: 3, ry: 1, base: [152, 110, 70] })}</RBox>
    <RBox s={[2.8, 0.46, 0.8]} p={[0, 0.185, 0]} r={0.006}>{M.wood({ rx: 3, ry: 1, base: [132, 92, 58] })}</RBox>
    <RBox s={[1.5, 0.17, 0.3]} p={[-0.82, 0.5, -0.22]} r={0.002}><meshStandardMaterial color="#0d0a08" /></RBox>
    <Bug p={[x, 0.417, 0.1]} ry={PI} s={3.1} run={u < 1 ? tt : 0} />
    <mesh position={[0.05, 0.5745, 0.42]} scale={[1, 1, 0.4]}><boxGeometry args={[0.46, 0.012, 0.3]} /><meshBasicMaterial color={G} transparent opacity={g * 0.88} /></mesh>
    <mesh position={[0.05, 0.4215, 0.42]} scale={[1, 1, 0.4]}><boxGeometry args={[0.46, 0.012, 0.3]} /><meshBasicMaterial color={G} transparent opacity={g * 0.88} /></mesh>
    <Tape txt="TOP AND BOTTOM" p={[0.26, 0.98, 0.42]} w={0.6} k={phys(tt, 3.9, 8, 0.45)} rev={cl((tt - 3.9) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- OCHO PIES: cuarto visto de arriba; el aro crece desde la cama y atrapa casi todo ----
export const HEightFeet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[0.3, 3, 1]}
  cam={{ at: [0, 0.06, 0.05], az: [0.34, 0.2], el: [1.08, 0.95], r: [3.3, 3.0], fov: 32 }}>{(tt) => { const g = eio(tt, 1.0, 3.6);
  return <>
    {[[0, -1.28, 3.3, 0.08], [0, 1.28, 3.3, 0.08]].map(([x, z, w, d], i) => <RBox key={i} s={[w, 0.16, d]} p={[x, 0.08, z]} r={0.005}><meshStandardMaterial color="#dcd3bf" roughness={0.9} /></RBox>)}
    {[-1.64, 1.64].map((x) => <RBox key={x} s={[0.08, 0.16, 2.6]} p={[x, 0.08, 0]} r={0.005}><meshStandardMaterial color="#dcd3bf" roughness={0.9} /></RBox>)}
    <MiniBed p={[-0.5, 0.04, -0.15]} id="ef" />
    <mesh position={[-0.5, 0.06, -0.15]} rotation={[-PI / 2, 0, 0]} scale={[sv(g), sv(g), 1]}><circleGeometry args={[1.02, 72]} /><meshBasicMaterial color="#c8432b" transparent opacity={0.2} depthWrite={false} /></mesh>
    <mesh position={[-0.5, 0.065, -0.15]} rotation={[PI / 2, 0, 0]} scale={[sv(g), sv(g), 1]}><torusGeometry args={[1.02, 0.014, 8, 90]} /><meshBasicMaterial color="#e3593a" /></mesh>
    {Array.from({ length: 44 }, (_, i) => { const a = rn(i, 51) * PI * 2, R = 0.5 + rn(i, 52) * (i % 11 === 0 ? 1.4 : 0.48); return <Bug key={i} p={[-0.5 + Math.cos(a) * R, 0.045, -0.15 + Math.sin(a) * R * 0.86]} ry={rn(i, 53) * 6} s={0.8} />; })}
    <Tape txt="8 FEET" p={[0.86, 0.36, 0.5]} w={0.62} k={phys(tt, 3.6, 8, 0.45)} rev={cl((tt - 3.6) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- CINTA Y TARJETA: la cinta baja, levanta a la chinche y la pega en la tarjeta blanca ----
export const HTapeCard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.4, 2.4, 1.8]}
  cam={{ at: [0.1, 0.18, 0], az: [-0.26, 0.14], el: [0.5, 0.4], r: [1.2, 1.08], fov: 32 }}>{(tt) => { const dn = eio(tt, 0.7, 1.6), lift = eio(tt, 2.0, 2.7), mv = eio(tt, 2.7, 3.7), put = eio(tt, 3.7, 4.3), X = lerp(-0.32, 0.42, mv), Y = lerp(lerp(0.5, 0.076, dn), 0.42, lift) - lerp(0, 0.326, put), bugOn = tt > 1.6;
  return <>
    <RBox s={[2.2, 0.08, 1.2]} p={[0, -0.03, 0]} r={0.02}>{quilt("tcq")}</RBox>
    <RBox s={[0.72, 0.01, 0.46]} p={[0.42, 0.083, 0]} r={0.003}><meshStandardMaterial color="#fdfcf7" roughness={0.75} /></RBox>
    <Bug p={bugOn ? [X, Y - 0.02, 0] : [-0.32, 0.016, 0]} s={1.5} fed={0.3} />
    <RBox s={[0.56, 0.008, 0.2]} p={[X, Y, 0]} r={0.002}><meshPhysicalMaterial color="#f4f1e0" transparent opacity={0.34} roughness={0.08} clearcoat={1} depthWrite={false} /></RBox>
    <Tape txt="GO BY THE BUG" p={[0.1, 0.44, 0.1]} w={0.62} k={phys(tt, 3.3, 8, 0.45)} rev={cl((tt - 3.3) / 0.6)} />
  </>;
}}</Scene3D>;
