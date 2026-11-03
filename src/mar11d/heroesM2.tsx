// mar11d · componentes únicos 17-31 + la CTA del manual. Misma regla: UN objeto grande al centro con margen, una acción
// física a mitad de camino en el cuadro del medio, números impresos EN el objeto. Registro: D:/rtmp/mar11_COMPONENTES.md
import React from "react";
import { BOLD, Bx, Cy, Dot, Env, Flame, Pl, Puff, Sp, To, Tube, V3, canvasTex, cl, drop, lerp, lv, rnd, win } from "../kits/r3k/r3k";
import { H, Stage } from "./hkit";
import { ManualCTA } from "./book3d";
import { Hand, U, bump, mixc } from "./props11";
import { PhotoGround, PhotoPl, PhotoWall } from "./tex11";
import { Furnace, S3, Table, Wall, billTex, plate } from "./heroesM1";

// 17 · el telégrafo: la llave de bronce golpea y la cinta de papel sale con puntos ·· ·· ··· ···, como habla el furnace
const tapeTex = (k: number) => canvasTex(`tape11d|${Math.round(k * 60)}`, 1024, 128, (g) => {
  g.fillStyle = "#f6f0de"; g.fillRect(0, 0, 1024, 128); g.fillStyle = "#1c1c1c";
  const D = [0, 1, 3, 4, 7, 8, 9, 11, 12, 13], W = 1024 * k;
  D.forEach((d) => { const x = 1000 - d * 70; if (1024 - x < W) { g.beginPath(); g.arc(x, 64, 26, 0, Math.PI * 2); g.fill(); } });
});
export const MTelegraph: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.08, 0.8), beat = (k * 14) % 1, D = [0, 1, 3, 4, 7, 8, 9, 11, 12, 13], i = Math.floor(k * 14), dn = D.includes(i) && beat < 0.5 && k < 1 ? 1 : 0;
  return <S3 p={lv([0, 0.8, 1.7], [0, 0.78, 1.45], u)} l={[0, 0.3, 0]} fov={38} floor={null} warm="#ffe6c0">
    <Table w={4} d={3} tint="#9a7a5a" /><Wall w={6} z={-1.0} c="#c8bca8" />
    <group position={[-0.1, 0, 0]}>
      <Bx s={[0.7, 0.06, 0.36]} p={[0, 0.03, 0]} c="#5a3418" ro={0.45} rad={0.01} />
      <Cy rt={0.03} h={0.1} p={[-0.2, 0.11, 0]} c="#c9a14a" m={1} ro={0.25} />
      <group position={[-0.2, 0.16, 0]} rotation={[0, 0, -0.06 * dn]}>
        <Bx s={[0.52, 0.03, 0.05]} p={[0.24, 0, 0]} c="#c9a14a" m={1} ro={0.25} />
        <Cy rt={0.06} h={0.03} p={[0.46, 0.04, 0]} c="#1c1c1c" ro={0.4} /><Cy rt={0.012} h={0.04} p={[0.46, 0.015, 0]} c="#c9a14a" m={1} ro={0.25} />
      </group>
      <Cy rt={0.025} h={0.04} p={[0.26, 0.08, 0]} c="#c9a14a" m={1} ro={0.25} />
      <Sp rad={0.04} p={[0.3, 0.22, -0.12]} c="#ff3a2a" e="#ff3a2a" ei={0.3 + 3 * dn} ns />
    </group>
    <group position={[0.15 - 0.95 * k * 0.5, 0.075, 0.28]} rotation={[-Math.PI / 2, 0, 0]}><Pl w={0.95 * Math.max(0.02, k) + 0.02} h={0.1} map={tapeTex(k)} c="#ffffff" ro={0.8} ns /></group>
  </S3>;
}}</Stage>;

// 18 · la camioneta de juguete: el técnico sabe el código, carga la pieza justa y hace un solo viaje; la vuelta fantasma se borra
export const MToytruck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.1, 0.55), gh = win(u, 0.55, 0.85), x = lerp(-1.0, 0.45, k);
  const Van: React.FC<{ o?: number }> = ({ o }) => <group>
    <Bx s={[0.44, 0.2, 0.22]} p={[0, 0.15, 0]} c="#f2f0ea" ro={0.45} rad={0.03} o={o} />
    <Bx s={[0.16, 0.14, 0.21]} p={[0.27, 0.12, 0]} c="#f2f0ea" ro={0.45} rad={0.03} o={o} />
    <Bx s={[0.02, 0.08, 0.18]} p={[0.355, 0.15, 0]} c="#3a5a7a" ro={0.1} o={o} />
    <Bx s={[0.44, 0.04, 0.225]} p={[0, 0.1, 0]} c="#c0392b" ro={0.5} o={o} />
    {[-0.14, 0.24].map((wx) => [-0.11, 0.11].map((wz) => <Cy key={`${wx}${wz}`} rt={0.05} h={0.03} p={[wx, 0.05, wz]} r={[Math.PI / 2, 0, 0]} c="#1c1c1c" ro={0.6} o={o} />))}
  </group>;
  return <S3 p={lv([0, 1.1, 2.2], [0, 1.0, 1.9], u)} l={[0, 0.15, 0]} fov={40} floor={null} warm="#fff0dc">
    <PhotoGround w={5} d={4} name="t_pasto.jpg" rep={1} tint="#a8b098" />
    <Bx s={[3.2, 0.012, 0.36]} p={[0, 0.006, 0]} c="#4a4a4c" ro={0.85} />
    {Array.from({ length: 10 }, (_, i) => <Bx key={i} s={[0.14, 0.003, 0.02]} p={[-1.4 + i * 0.32, 0.014, 0]} c="#f2e8b0" ro={0.6} ns />)}
    <group position={[0.95, 0, -0.45]}>
      <Bx s={[0.5, 0.36, 0.42]} p={[0, 0.18, 0]} c="#c88a6a" ro={0.7} rad={0.01} />
      <PhotoPl w={0.5} h={0.36} name="t_ladrillo.jpg" p={[0, 0.18, 0.212]} rep={[1, 0.8]} />
      <mesh position={[0, 0.46, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.42, 0.22, 4]} /><meshStandardMaterial color="#3a2c26" roughness={0.8} /></mesh>
      <Bx s={[0.1, 0.16, 0.01]} p={[0, 0.08, 0.215]} c="#5a3420" ro={0.6} />
    </group>
    <group position={[x, 0, 0.06]}><Van />
      <Bx s={[0.12, 0.08, 0.1]} p={[-0.06, 0.29, 0]} c="#c8a070" ro={0.85} />
    </group>
    {gh < 1 && <group position={[lerp(0.45, -1.0, gh * 0.4), 0, -0.1]} rotation={[0, Math.PI, 0]}><Van o={0.35 * (1 - gh)} /></group>}
  </S3>;
}}</Stage>;

// 19 · tan frágil como una galletita: la punta del destornillador toca el encendedor gris y se raja igual que la galletita de al lado
export const MCookiesnap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), tap = win(u, 0.18, 0.32) * (1 - win(u, 0.36, 0.5)), cr = win(u, 0.32, 0.36), fall = win(u, 0.36, 0.6), ck = win(u, 0.6, 0.66), cf = win(u, 0.66, 0.85);
  return <S3 p={lv([0, 0.75, 1.35], [0, 0.72, 1.15], u)} l={[0, 0.28, 0]} fov={38} floor={null} warm="#fff0d8">
    <Table w={3} d={2} tint="#b89878" /><Wall w={5} z={-0.8} c="#d4ccbc" />
    <group position={[-0.25, 0.0, 0]}>
      <Bx s={[0.16, 0.1, 0.1]} p={[0, 0.05, 0]} c="#efe9da" ro={0.6} />
      <Bx s={[0.06, 0.36, 0.012]} p={[0, 0.28, 0]} c="#5c5c5a" ro={0.8} rad={0.004} />
      <Bx s={[0.06, 0.12, 0.012]} p={[0.03 * fall, 0.4 - fall * 0.3, 0.02 * fall]} r={[0, 0, fall * 1.2]} c="#5c5c5a" ro={0.8} rad={0.004} />
      {cr > 0.5 && <Bx s={[0.065, 0.004, 0.014]} p={[0, 0.34, 0.001]} r={[0, 0, 0.3]} c="#1c1c1c" ro={0.9} ns />}
      <group position={[0.22 - tap * 0.18, 0.38, 0.06]} rotation={[0, 0, Math.PI / 2 + 0.2]}>
        <Cy rt={0.008} h={0.3} p={[0, 0.15, 0]} c="#c9ccd0" m={1} ro={0.25} />
        <Cy rt={0.026} h={0.18} p={[0, 0.38, 0]} c="#f2c230" ro={0.45} />
      </group>
    </group>
    <group position={[0.3, 0.02, 0.05]}>
      <group position={[-0.03 * cf, 0, 0]} rotation={[0, 0, cf * 0.25]}><Cy rt={0.15} h={0.03} p={[0, 0.015, 0]} c="#c8904a" ro={0.85} seg={40} />
        {Array.from({ length: 6 }, (_, i) => <Sp key={i} rad={0.016} p={[-0.1 + rnd(i, 1) * 0.1, 0.03, -0.08 + rnd(i, 2) * 0.16]} c="#3a2214" ro={0.6} ns />)}</group>
      {ck > 0.5 && <group position={[0.06 + 0.05 * cf, 0.01, 0]} rotation={[0, 0, -cf * 0.3]}><Cy rt={0.07} h={0.03} p={[0.02, 0.015, 0]} c="#c8904a" ro={0.85} seg={20} /></group>}
    </group>
  </S3>;
}}</Stage>;

// 20 · el monóxido: la alarma del techo marca CO 150 y titila roja mientras una neblina gris baja y llena el cuarto
const coTex = (n: number, on: number) => canvasTex(`co11d|${n}|${on}`, 512, 512, (g) => {
  g.fillStyle = "#f6f6f2"; g.beginPath(); g.arc(256, 256, 250, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#14201a"; g.fillRect(126, 170, 260, 130); g.fillStyle = on ? "#ff4a3a" : "#9df0b8"; g.font = BOLD(110); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(n), 256, 238);
  g.fillStyle = "#1c1c1c"; g.font = BOLD(64); g.fillText("CO", 256, 100); g.font = BOLD(40); g.fillText("PPM", 256, 340);
  for (let i = 0; i < 5; i++) { g.fillStyle = "#c8c8c4"; g.fillRect(180 + i * 34, 390, 20, 50); }
});
export const MCocloud: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), fog = win(u, 0.06, 0.6), n = Math.round(lerp(0, 150, win(u, 0.1, 0.6))), on = n >= 100 && Math.floor(tt * 3) % 2 === 0 ? 1 : 0;
  return <S3 p={lv([0, 1.05, 1.8], [0, 1.05, 1.55], u)} l={[0, 1.15, 0]} fov={40} floor={null} warm="#eef0f4">
    <Wall w={6} z={-0.15} c="#e4e0d8" />
    <group position={[0, 1.15, 0]}>
      <Cy rt={0.38} rb={0.4} h={0.1} p={[0, 0, -0.05]} r={[Math.PI / 2, 0, 0]} c="#f6f6f2" ro={0.4} />
      <Pl w={0.72} h={0.72} p={[0, 0, 0.004]} map={coTex(n, on)} c="#ffffff" ro={0.5} ns />
      <Sp rad={0.03} p={[0.26, 0.2, 0.01]} c="#ff3a2a" e="#ff3a2a" ei={0.3 + 5 * on} ns />
    </group>
    {on > 0 && <pointLight position={[0.2, 1.3, 0.4]} color="#ff3a2a" intensity={2.5} distance={3} />}
    {Array.from({ length: 16 }, (_, i) => <Puff key={i} p={[-1.2 + rnd(i, 1) * 2.4 + Math.sin(tt * 0.5 + i) * 0.1, 2.0 - fog * (0.4 + rnd(i, 2) * 1.6), 0.2 + rnd(i, 3) * 0.4]} s={0.7 + rnd(i, 4) * 0.6} c="#7a7a78" o={0.22 * fog} add={false} />)}
  </S3>;
}}</Stage>;

// 21 · las pilas de plata: cuatro pilas de billetes suben a lo que cobra un service ($289, $150, $120, $150); al final la cajita del filtro, $8
export const MCashstack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), V = [289, 150, 120, 150], L = ["CALL-OUT", "SENSOR", "FILTER", "DRAIN"], fi = drop(u, 0.66, 0.8);
  return <S3 zk={1.15} p={lv([0, 0.95, 2.4], [0, 0.92, 2.1], u)} l={[0, 0.5, 0]} fov={40} floor={null} warm="#fff0d8">
    <Table w={4} d={3} tint="#a88868" /><Wall w={6} z={-0.9} c="#d0c6b4" />
    {V.map((v, i) => { const k = win(u, 0.08 + i * 0.1, 0.26 + i * 0.1), n = Math.round((v / 289) * 22 * k), x = -0.9 + i * 0.5;
      return <group key={i} position={[x, 0, 0]}>
        {Array.from({ length: n }, (_, j) => <group key={j} position={[(rnd(j, i) - 0.5) * 0.01, 0.012 + j * 0.026, 0]} rotation={[0, (rnd(j, i + 3) - 0.5) * 0.08, 0]}><Bx s={[0.36, 0.024, 0.16]} c="#c9d0b4" ro={0.85} rad={0.004} /><Pl w={0.34} h={0.15} p={[0, 0.0125, 0]} r={[-Math.PI / 2, 0, 0]} map={billTex("100")} c="#ffffff" ro={0.85} ns /></group>)}
        <group position={[0, 0.012 + n * 0.026 + 0.12, 0.02]}><Pl w={0.4} h={0.16} map={plate(`$${v}`, "#c0392b", "#ffffff", 150)} c="#ffffff" ro={0.6} side={2} ns /></group>
        <Pl w={0.42} h={0.09} p={[0, 0.06, 0.12]} r={[-0.3, 0, 0]} map={plate(L[i], "#2a2622", "#ffffff", 90)} c="#ffffff" ro={0.6} ns />
      </group>; })}
    <group position={[1.15, (1 - fi) * 1.2, 0.05]}>
      <Bx s={[0.3, 0.2, 0.06]} p={[0, 0.1, 0]} c="#f4f2ea" ro={0.7} />
      <PhotoPl w={0.26} h={0.12} name="t_aletas.jpg" p={[0, 0.12, 0.031]} tint="#e0dccc" rep={[1, 1]} />
      <group position={[0, 0.34, 0]}><Pl w={0.3} h={0.15} map={plate("$8", "#1f8a4c", "#ffffff", 170)} c="#ffffff" ro={0.6} side={2} ns /></group>
    </group>
  </S3>;
}}</Stage>;

// 22 · el salón de la iglesia: sillas plegables en fila con luz fría; la guirnalda de lamparitas se prende de a una y el salón entibia
export const MStringlights: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), N = 14, warm = win(u, 0.2, 0.75);
  const yy = (i: number) => 1.75 - 0.28 * Math.sin((i / (N - 1)) * Math.PI);
  return <S3 p={lv([0, 1.2, 3.0], [0, 1.15, 2.6], u)} l={[0, 1.0, 0]} fov={42} floor={null} exp={0.85} warm={mixc("#cfe0ff", "#ffd8a0", warm)}>
    <PhotoGround w={6} d={5} name="t_madera.jpg" rep={1.6} tint={mixc("#8a8c94", "#c09870", warm)} />
    <Wall w={7} hh={3.2} z={-1.2} c={mixc("#9aa0ac", "#e8d4b8", warm)} />
    <Tube pts={Array.from({ length: N }, (_, i) => [-1.6 + i * (3.2 / (N - 1)), yy(i) + 0.03, -0.4] as V3)} rad={0.006} c="#2a2a2a" ro={0.6} />
    {Array.from({ length: N }, (_, i) => { const on = win(u, 0.18 + i * 0.035, 0.22 + i * 0.035); return <group key={i} position={[-1.6 + i * (3.2 / (N - 1)), yy(i), -0.4]}>
      <Sp rad={0.045} sc={[1, 1.3, 1]} c={mixc("#bfbab0", "#ffd890", on)} e="#ffc860" ei={on * 3.5} ro={0.2} ns />
      {on > 0.5 && <Puff p={[0, 0, 0.02]} s={0.4} c="#ffc860" o={0.35 * on} />}
    </group>; })}
    {[-1.2, -0.6, 0, 0.6, 1.2].map((x) => [0.3].map((z) => <group key={`${x}${z}`} position={[x, 0, 0.1 + z]}>
      <Bx s={[0.4, 0.03, 0.38]} p={[0, 0.45, 0]} c="#7a7c80" m={0.5} ro={0.4} />
      <Bx s={[0.4, 0.42, 0.03]} p={[0, 0.68, -0.18]} c="#7a7c80" m={0.5} ro={0.4} />
      {[-0.18, 0.18].map((lx) => <Cy key={lx} rt={0.012} h={0.9} p={[lx, 0.44, -0.04]} r={[0.2, 0, 0]} c="#5a5c60" m={0.6} ro={0.4} />)}
    </group>))}
    {warm > 0.6 && <pointLight position={[0, 1.6, 0.2]} color="#ffc070" intensity={3 * warm} distance={5} />}
  </S3>;
}}</Stage>;

// 23 · el charco: del caño de plástico gotea y por debajo del furnace se abre un charco que refleja la luz del sótano
export const MFloorpuddle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.08, 0.75), R = 0.08 + 0.75 * k, dr = (tt * 1.6) % 1;
  return <S3 p={lv([0.6, 1.0, 2.2], [0.5, 0.92, 1.9], u)} l={[0, 0.4, 0]} fov={40} floor={null} exp={0.9} warm="#eef2ff">
    <PhotoGround w={5} d={4} name="t_concreto.jpg" rep={1.2} tint="#8a8680" /><Wall w={6} z={-0.6} c="#a8a49c" name="t_concreto.jpg" />
    <Furnace p={[-0.15, 0.0, -0.1]} s={0.85} />
    <Tube pts={[[0.2, 0.25, 0.1], [0.36, 0.22, 0.24], [0.42, 0.12, 0.34]]} rad={0.022} c="#f2f2ee" ro={0.4} />
    <Dot p={[0.42, 0.1 - dr * 0.1, 0.34]} r={0.012} c="#cfe6ff" o={1 - dr} />
    <mesh position={[0.15, 0.004, 0.2]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.7, 1]}><circleGeometry args={[R, 48]} /><meshStandardMaterial color="#2a3442" metalness={0.9} roughness={0.05} transparent opacity={0.8} /></mesh>
    {Array.from({ length: 3 }, (_, i) => { const r = ((tt * 0.8 + i / 3) % 1); return <mesh key={i} position={[0.42, 0.006, 0.34]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r * 0.25, r * 0.25 + 0.008, 40]} /><meshBasicMaterial color="#cfe6ff" transparent opacity={0.5 * (1 - r) * k} /></mesh>; })}
  </S3>;
}}</Stage>;

// 24 · el encendedor al rojo: la tira gris se pone rojo opaco, naranja brillante con calor que tiembla, y la llama azul prende de él
export const MIgniterglow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), g = win(u, 0.1, 0.55), fl = win(u, 0.6, 0.66), col = g < 0.5 ? mixc("#5c5c5a", "#8a2a10", g * 2) : mixc("#8a2a10", "#ffa030", (g - 0.5) * 2);
  return <S3 zk={1.12} p={lv([0, 0.62, 1.2], [0, 0.6, 1.0], u)} l={[0, 0.48, 0]} fov={38} floor={null} exp={0.8} warm="#ffe0c0">
    <PhotoGround w={4} d={3} name="t_chapa.jpg" rep={1.3} tint="#4a4e52" /><PhotoWall w={4} h={2} z={-0.6} name="t_chapa.jpg" tint="#3a3e42" />
    <Bx s={[1.0, 0.12, 0.2]} p={[0, 0.3, -0.1]} c="#6a6e72" m={0.6} ro={0.4} />
    {fl > 0.5 && [-0.36, -0.12, 0.12, 0.36].map((x, i) => <Flame key={i} p={[x, 0.36, -0.08]} s={1.6} u={tt + i} i={i} />)}
    <group position={[0.0, 0.55, 0.08]}>
      <Bx s={[0.14, 0.1, 0.1]} p={[0, -0.12, 0]} c="#efe9da" ro={0.6} />
      <Bx s={[0.07, 0.3, 0.015]} p={[0, 0.07, 0]} c={col} e={g > 0.2 ? col : undefined} ei={g * 3} ro={0.7} rad={0.004} />
      {g > 0.6 && <pointLight position={[0, 0.1, 0.2]} color="#ff8a30" intensity={2 * g} distance={1.5} />}
      {g > 0.6 && Array.from({ length: 5 }, (_, i) => <Puff key={i} p={[Math.sin(tt * 3 + i) * 0.02, 0.25 + i * 0.06, 0.02]} s={0.16} c="#ffb060" o={0.1 * g} />)}
    </group>
    <group position={[0.42, 0.72, 0.1]}><Bx s={[0.34, 0.16, 0.02]} c="#2a2622" ro={0.5} /><Pl w={0.32} h={0.14} p={[0, 0, 0.012]} map={plate(`${Math.round(lerp(0, 30, win(u, 0.1, 0.6)))} s`, "#2a2622", "#ffa030", 150)} c="#ffffff" ro={0.6} ns /></group>
  </S3>;
}}</Stage>;

// 25 · la caja de la pieza: el técnico llega con la caja justa; se abren las solapas y de la espuma sube el encendedor nuevo
export const MPartbox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), fl = win(u, 0.12, 0.38), up = win(u, 0.4, 0.66);
  return <S3 p={lv([0, 0.95, 1.55], [0, 0.9, 1.3], u)} l={[0, 0.32, 0]} fov={38} floor={null} warm="#fff0d8">
    <Table w={3} d={2} tint="#a88a6a" /><Wall w={5} z={-0.8} c="#cfc6b4" />
    <group position={[0, 0, 0]}>
      <Bx s={[0.62, 0.3, 0.42]} p={[0, 0.15, 0]} c="#c49a62" ro={0.9} rad={0.006} />
      <Bx s={[0.6, 0.06, 0.4]} p={[0, 0.27, 0]} c="#3a3e44" ro={0.95} />
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.31, 0.3, 0]} rotation={[0, 0, sd * (Math.PI - fl * 2.4) * -1 * 0 + sd * fl * 2.2]}><Bx s={[0.3, 0.008, 0.42]} p={[-sd * 0.15, 0, 0]} c="#c49a62" ro={0.9} /></group>)}
      <Pl w={0.4} h={0.12} p={[0, 0.17, 0.212]} map={plate("PART #", "#c49a62", "#2a2018", 80)} c="#ffffff" ro={0.85} ns />
      <group position={[0, 0.3 + up * 0.3, 0]} rotation={[0, up * 1.2, 0]}>
        <Bx s={[0.1, 0.08, 0.08]} p={[0, 0, 0]} c="#efe9da" ro={0.6} />
        <Bx s={[0.05, 0.24, 0.012]} p={[0, 0.16, 0]} c="#5c5c5a" ro={0.8} rad={0.004} />
        <Tube pts={[[0, -0.04, 0], [0.08, -0.08, 0], [0.16, -0.06, 0.02]]} rad={0.005} c="#1c1c1c" ro={0.5} />
      </group>
      {up > 0.8 && <Puff p={[0, 0.7, 0.05]} s={0.6} c="#fff4d0" o={0.25} />}
    </group>
  </S3>;
}}</Stage>;

// 26 · la perilla del piloto: el dedo aprieta la perilla PILOT, prende la llamita azul; cuando suelta, la llama se achica y se apaga
export const MPilotknob: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), push = win(u, 0.1, 0.2) * (1 - win(u, 0.52, 0.6)), fl = win(u, 0.22, 0.3) * (1 - win(u, 0.6, 0.8));
  return <S3 p={lv([0, 0.6, 1.35], [0, 0.58, 1.15], u)} l={[0, 0.48, 0]} fov={38} floor={null} exp={0.85} warm="#ffe8d0">
    <PhotoGround w={4} d={3} name="t_chapa.jpg" rep={1.3} tint="#5a5e62" /><PhotoWall w={4} h={2} z={-0.5} name="t_chapa.jpg" tint="#6a6e72" />
    <group position={[-0.2, 0.52, 0]}>
      <Bx s={[0.5, 0.4, 0.2]} c="#2b2d31" m={0.4} ro={0.4} rad={0.03} />
      <Pl w={0.46} h={0.14} p={[0, 0.13, 0.102]} map={plate("PILOT · ON · OFF", "#2b2d31", "#f2c230", 60, 768, 192)} c="#ffffff" ro={0.5} ns />
      <group position={[0, -0.04, 0.1 + 0.06 - push * 0.04]}>
        <Cy rt={0.1} h={0.08} r={[Math.PI / 2, 0, 0]} c="#c0392b" ro={0.4} />
        <Bx s={[0.17, 0.035, 0.04]} p={[0, 0, 0.05]} c="#e8e4dc" ro={0.4} />
      </group>
      <group position={[0.02, -0.04, 0.42 - push * 0.2]} rotation={[Math.PI / 2 - 0.3, 0, 0]}><Hand s={1.4} curl={0.2} sleeve="#55606a" /></group>
    </group>
    <group position={[0.4, 0.3, 0.05]}>
      <Cy rt={0.02} h={0.12} p={[0, 0.06, 0]} c="#8a8e92" m={0.7} ro={0.35} />
      {fl > 0.02 && <Flame p={[0, 0.12, 0]} s={0.9 * fl + 0.1} u={tt} />}
      <Bx s={[0.008, 0.16, 0.008]} p={[0.04, 0.08, 0]} r={[0, 0, -0.2]} c="#c9a14a" m={1} ro={0.3} />
    </group>
  </S3>;
}}</Stage>;

// 27 · dos llamas: a la izquierda azul y quieta; a la derecha amarilla, perezosa, que se acuesta y baila cuando arranca el soplador
const LFlame: React.FC<{ p: V3; tt: number; i: number; lean: number }> = ({ p, tt, i, lean }) => {
  const f = 1 + 0.25 * Math.sin(tt * 7 + i * 1.3) + 0.15 * Math.sin(tt * 13 + i);
  return <group position={p} rotation={[0, 0, lean * (0.6 + 0.4 * Math.sin(tt * 5 + i))]}>
    <mesh position={[0, 0.12 * f, 0]}><coneGeometry args={[0.05, 0.24 * f, 14, 1, true]} /><meshBasicMaterial color="#ffb030" transparent opacity={0.8} blending={2} depthWrite={false} side={2} /></mesh>
    <mesh position={[0, 0.06 * f, 0]}><coneGeometry args={[0.025, 0.12 * f, 10, 1, true]} /><meshBasicMaterial color="#fff0a0" transparent opacity={0.8} blending={2} depthWrite={false} side={2} /></mesh>
  </group>;
};
export const MTwoflames: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), bl = win(u, 0.4, 0.5), ring = win(u, 0.55, 0.7);
  return <S3 zk={1.25} p={lv([0, 0.7, 1.7], [0, 0.66, 1.45], u)} l={[0, 0.4, 0]} fov={38} floor={null} exp={0.8} warm="#f0f0ff">
    <PhotoGround w={4} d={3} name="t_chapa.jpg" rep={1.3} tint="#3e4246" /><PhotoWall w={5} h={2} z={-0.6} name="t_chapa.jpg" tint="#33373b" />
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.45, 0.25, 0]}>
      <Bx s={[0.6, 0.1, 0.16]} c="#6a6e72" m={0.6} ro={0.4} />
      {[-0.18, 0, 0.18].map((x, i) => sd < 0 ? <Flame key={i} p={[x, 0.05, 0]} s={1.5} u={tt + i} i={i} /> : <LFlame key={i} p={[x, 0.05, 0]} tt={tt} i={i} lean={0.5 * bl} />)}
      <Pl w={0.36} h={0.12} p={[0, -0.16, 0.09]} map={plate(sd < 0 ? "OK" : "STOP", sd < 0 ? "#1f5fbf" : "#c0392b", "#ffffff", 120)} c="#ffffff" ro={0.6} ns />
    </group>)}
    {ring > 0 && <To R={0.4} t={0.012} p={[0.45, 0.42, 0.05]} c="#ff3a2a" e="#ff3a2a" ei={1.5} arc={Math.PI * 2 * ring} />}
    {bl > 0 && Array.from({ length: 8 }, (_, i) => { const f = (tt * 1.2 + i / 8) % 1; return <Dot key={i} p={[0.05 + f * 0.8, 0.35 + rnd(i, 1) * 0.15, 0.1]} r={0.01} c="#cfe0ff" o={0.4 * bl * (1 - f)} add />; })}
  </S3>;
}}</Stage>;

// 28 · el estetoscopio: el auricular se apoya en la puerta del furnace, salen anillos de sonido y la luz de la mirilla late 1-2-3
export const MStethoscope: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), on = win(u, 0.1, 0.28), ph = (tt * 1.1) % 2, led = ph < 1.4 && (ph % 0.45) < 0.22 ? 1 : 0;
  return <S3 p={lv([0.2, 0.75, 1.75], [0.15, 0.72, 1.5], u)} l={[0, 0.55, 0]} fov={38} floor={null} exp={0.9} warm="#ffe6c8">
    <PhotoGround w={5} d={4} name="t_concreto.jpg" rep={1.2} tint="#7a746c" /><Wall w={6} z={-0.6} c="#a8a094" name="t_concreto.jpg" />
    <Furnace p={[0, 0, -0.2]} s={0.95} led={led} />
    <group position={[-0.12, 0.62 + (1 - on) * 0.2, 0.12 + (1 - on) * 0.3]}>
      <Cy rt={0.05} h={0.03} r={[Math.PI / 2, 0, 0]} c="#c9ccd0" m={1} ro={0.2} />
      <Tube pts={[[0, 0, 0.02], [0.05, 0.15, 0.12], [0.25, 0.3, 0.2], [0.42, 0.25, 0.22]]} rad={0.012} c="#1c1c1c" ro={0.5} />
    </group>
    {on > 0.8 && Array.from({ length: 3 }, (_, i) => { const r = ((tt * 0.9 + i / 3) % 1); return <To key={i} R={0.08 + r * 0.45} t={0.006} p={[-0.12, 0.62, 0.12]} c="#ffd27a" e="#ffd27a" ei={1} o={0.7 * (1 - r)} />; })}
    <pointLight position={[0.15, 0.4, 0.4]} color="#ff3a2a" intensity={led * 1.4} distance={1.2} />
  </S3>;
}}</Stage>;

// 29 · la espera del soplador: el termómetro del plenum sube de 60 a 130; recién ahí la turbina arranca y sale aire naranja
const plenTex = (v: number) => canvasTex(`plen11d|${Math.round(v)}`, 512, 512, (g) => {
  g.fillStyle = "#f4f1ea"; g.beginPath(); g.arc(256, 256, 250, 0, Math.PI * 2); g.fill(); g.textAlign = "center"; g.textBaseline = "middle";
  g.strokeStyle = "#1f5fbf"; g.lineWidth = 26; g.beginPath(); g.arc(256, 256, 200, Math.PI * 0.75, Math.PI * 1.35); g.stroke();
  g.strokeStyle = "#e07a20"; g.beginPath(); g.arc(256, 256, 200, Math.PI * 1.35, Math.PI * 2.25); g.stroke();
  for (let x = 60; x <= 140; x += 20) { const a = Math.PI * (0.75 + 1.5 * (x - 60) / 80); g.fillStyle = "#1c1c1c"; g.font = BOLD(50); g.fillText(String(x), 256 + Math.cos(a) * 140, 256 + Math.sin(a) * 140); }
  const a = Math.PI * (0.75 + 1.5 * (v - 60) / 80); g.strokeStyle = "#c0392b"; g.lineWidth = 12; g.beginPath(); g.moveTo(256, 256); g.lineTo(256 + Math.cos(a) * 190, 256 + Math.sin(a) * 190); g.stroke();
  g.fillStyle = "#1c1c1c"; g.beginPath(); g.arc(256, 256, 22, 0, Math.PI * 2); g.fill(); g.font = BOLD(44); g.fillText("°F", 256, 380);
});
export const MWarmup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), v = lerp(60, 130, win(u, 0.08, 0.6)), go = win(u, 0.55, 0.65), sp = go * (tt * 16);
  return <S3 p={lv([0, 0.95, 2.0], [0, 0.92, 1.75], u)} l={[0, 0.75, 0]} fov={40} floor={null} warm="#fff0dc">
    <PhotoGround w={5} d={4} name="t_concreto.jpg" rep={1.2} tint="#8a8278" /><Wall w={6} z={-0.8} c="#b8b0a4" name="t_concreto.jpg" />
    <group position={[-0.45, 0.85, 0]}>
      <Cy rt={0.36} h={0.08} r={[Math.PI / 2, 0, 0]} c="#c9ccd0" m={0.8} ro={0.25} />
      <Pl w={0.66} h={0.66} p={[0, 0, 0.042]} map={plenTex(v)} c="#ffffff" ro={0.5} ns />
      <Cy rt={0.04} h={0.6} p={[0, -0.55, -0.04]} c="#8a8e92" m={0.7} ro={0.35} />
    </group>
    <group position={[0.55, 0.75, 0]}>
      <Bx s={[0.66, 0.66, 0.4]} p={[0, 0, -0.1]} c="#5f6368" m={0.5} ro={0.4} rad={0.02} />
      <Cy rt={0.27} h={0.3} p={[0, 0, 0.0]} r={[Math.PI / 2, 0, 0]} c="#3a3d42" m={0.5} ro={0.4} open />
      <group position={[0, 0, 0.1]} rotation={[0, 0, sp]}>{Array.from({ length: 20 }, (_, i) => <Bx key={i} s={[0.012, 0.08, 0.2]} p={[Math.cos(i * 0.314) * 0.21, Math.sin(i * 0.314) * 0.21, 0]} r={[0, 0, i * 0.314 + 0.4]} c="#9ea3a8" m={0.6} ro={0.35} ns />)}</group>
      <Cy rt={0.06} h={0.32} p={[0, 0, 0.0]} r={[Math.PI / 2, 0, 0]} c="#2b2d31" m={0.6} ro={0.3} />
      {go > 0 && Array.from({ length: 22 }, (_, i) => { const f = (tt * 1.1 + rnd(i, 1)) % 1; return <Dot key={i} p={[(rnd(i, 2) - 0.5) * 0.4, (rnd(i, 3) - 0.5) * 0.4, 0.2 + f * 0.9]} r={0.014} c="#ffa040" o={0.8 * go * (1 - f)} add />; })}
    </group>
  </S3>;
}}</Stage>;

// 30 · el fichero giratorio: seis fichas grandes pasan de a una, 1 a 6, cada una con el dibujo de su chequeo
const cardTex = (n: number) => canvasTex(`rolo11d|${n}`, 640, 400, (g) => {
  g.fillStyle = "#fbfaf4"; g.fillRect(0, 0, 640, 400); g.strokeStyle = "rgba(90,130,200,0.35)"; g.lineWidth = 2; for (let y = 90; y < 400; y += 40) { g.beginPath(); g.moveTo(20, y); g.lineTo(620, y); g.stroke(); }
  g.fillStyle = "#c0392b"; g.fillRect(0, 0, 640, 14); g.fillStyle = "#1c1c1c"; g.font = BOLD(220); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(n), 150, 220);
  const cx = 450, cy = 220; g.lineWidth = 12; g.strokeStyle = "#2a3a5a"; g.fillStyle = "#2a3a5a";
  if (n === 1) { g.strokeRect(cx - 90, cy - 70, 180, 140); g.font = BOLD(70); g.fillText("AUTO", cx, cy); }
  if (n === 2) { [0, 1, 2].forEach((i) => { g.fillStyle = "#ff3a2a"; g.beginPath(); g.arc(cx - 70 + i * 70, cy, 26, 0, Math.PI * 2); g.fill(); }); }
  if (n === 3) { g.strokeRect(cx - 90, cy - 80, 180, 160); for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(cx - 90 + i * 30, cy - 80); g.lineTo(cx - 90 + i * 30, cy + 80); g.stroke(); } }
  if (n === 4) { g.fillStyle = "#c4c9ad"; g.fillRect(cx - 110, cy - 50, 220, 100); g.strokeRect(cx - 110, cy - 50, 220, 100); g.fillStyle = "#2a3a5a"; g.font = BOLD(70); g.fillText("$1", cx, cy + 4); }
  if (n === 5) { g.beginPath(); g.moveTo(cx - 90, cy - 60); g.lineTo(cx - 20, cy - 60); g.arc(cx + 10, cy, 60, -Math.PI / 2, Math.PI / 2); g.lineTo(cx - 90, cy + 60); g.stroke(); }
  if (n === 6) { g.fillStyle = "#ff8a20"; g.fillRect(cx - 20, cy - 90, 40, 180); }
});
export const MRolodex: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), f = win(u, 0.06, 0.86) * 5.4;
  return <S3 p={lv([0, 0.85, 1.6], [0, 0.82, 1.35], u)} l={[0, 0.45, 0]} fov={38} floor={null} warm="#fff0d8">
    <Table w={3} d={2} tint="#a88a6a" /><Wall w={5} z={-0.8} c="#cfc6b4" />
    <Bx s={[0.8, 0.06, 0.4]} p={[0, 0.03, 0]} c="#2b2d31" m={0.4} ro={0.4} />
    {[-1, 1].map((sd) => <Bx key={sd} s={[0.03, 0.4, 0.06]} p={[sd * 0.36, 0.25, 0]} c="#2b2d31" m={0.4} ro={0.4} />)}
    <Cy rt={0.015} h={0.74} p={[0, 0.42, 0]} r={[0, 0, Math.PI / 2]} c="#c9ccd0" m={1} ro={0.3} />
    {[6, 5, 4, 3, 2, 1].map((n) => { const a = cl(f - (n - 1)), ang = -0.15 - a * 2.9;
      return <group key={n} position={[0, 0.42, 0]} rotation={[ang, 0, 0]}><Pl w={0.64} h={0.4} p={[0, 0.2, 0.002 * n]} map={cardTex(n)} c="#ffffff" ro={0.8} side={0} ns /><group position={[0, 0.2, 0.002 * n - 0.001]} rotation={[0, Math.PI, 0]}><Pl w={0.64} h={0.4} c="#efe9da" ro={0.85} side={0} ns /></group></group>; })}
  </S3>;
}}</Stage>;

// 31 · la caja de recuerdos: la tapa de madera se abre, el cuadrito con el dólar baja adentro, la tapa se cierra con luz tibia
export const MKeepsake: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), op = win(u, 0.08, 0.26) * (1 - win(u, 0.66, 0.84)), dn = win(u, 0.3, 0.6), gl = win(u, 0.75, 0.9);
  return <S3 p={lv([0, 0.85, 1.55], [0, 0.82, 1.3], u)} l={[0, 0.3, 0]} fov={38} floor={null} warm="#ffd8a8">
    <Table w={3} d={2} tint="#9a7a5a" /><Wall w={5} z={-0.8} c="#c8b8a0" />
    <Bx s={[0.7, 0.24, 0.46]} p={[0, 0.12, 0]} c="#6a4426" ro={0.5} rad={0.01} />
    <PhotoPl w={0.68} h={0.22} name="t_madera.jpg" p={[0, 0.12, 0.232]} tint="#8a5a32" />
    <Bx s={[0.62, 0.02, 0.38]} p={[0, 0.235, 0]} c="#7a1e2a" ro={0.95} />
    <group position={[0, 0.245, -0.23]} rotation={[-op * 1.9, 0, 0]}><Bx s={[0.72, 0.05, 0.48]} p={[0, 0.025, 0.24]} c="#6a4426" ro={0.5} rad={0.01} /><Bx s={[0.08, 0.02, 0.04]} p={[0, 0.01, 0.48]} c="#c9a14a" m={1} ro={0.25} /></group>
    {dn < 1 && <group position={[0, 0.3 + (1 - dn) * 0.5, 0]} rotation={[-Math.PI / 2 * dn, 0, 0]}>
      <Bx s={[0.42, 0.3, 0.025]} c="#5a3a1e" ro={0.45} rad={0.008} />
      <Pl w={0.36} h={0.16} p={[0, 0.02, 0.014]} map={billTex()} c="#ffffff" ro={0.8} ns />
    </group>}
    {gl > 0 && <Puff p={[0, 0.3, 0.2]} s={0.9} c="#ffcc80" o={0.3 * gl} />}
  </S3>;
}}</Stage>;

export const MCta: React.FC<{ t: number; h: H }> = ({ t, h }) => <ManualCTA t={t} h={h} page={h.page} under={h.under} />;
