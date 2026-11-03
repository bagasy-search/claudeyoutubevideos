// mar11b · componentes únicos 1-13 (los 5 hábitos del termostato), 3D en el kit r3k. Cada uno es UNA acción física que se ve
// entera en el plano (u = 0..1) y está a mitad de camino en el cuadro del medio; sin rótulos que repitan la voz.
// Lecciones de mar11a (EVALUADOR): suelo de foto, objetos grandes y enteros en cuadro, cámara casi quieta, números impresos EN el objeto.
// Registro: D:/rtmp/mar11_COMPONENTES.md
import React from "react";
import { BOLD, Bx, Cy, env, MONO, Pl, Puff, S3 as S3k, Sp, To, Tube, V3, canvasTex, cl, lerp, lv, rnd, win } from "../kits/r3k/r3k";
import { H, Stage } from "./hkit";
import { FrostGround, HPU, U, bump, cum, mixc } from "./props11";
import { PhotoGround, PhotoPl, PhotoWall } from "./tex11";

const S3: React.FC<React.ComponentProps<typeof S3k> & { k?: number }> = ({ k = 1, p, l, ...r }) =>
  <S3k p={[l[0] + (p[0] - l[0]) * k, l[1] + (p[1] - l[1]) * k, l[2] + (p[2] - l[2]) * k]} l={l} {...r} />;
const Table: React.FC<{ w?: number; d?: number }> = ({ w = 4, d = 2.4 }) => <PhotoGround w={w} d={d} name="t_madera.jpg" rep={1.4} />;
const Wall: React.FC<{ w?: number; hh?: number; z?: number; c?: string }> = ({ w = 6, hh = 3.2, z = -0.5, c = "#ffffff" }) =>
  <PhotoWall w={w} h={hh} z={z} y={hh / 2 - 0.3} name="t_pared.jpg" tint={c} />;
env(Wall); env(Table);
// cartel impreso (fondo + texto centrado), para la cara de un objeto
export const plate = (t: string, bg: string, fg: string, px = 150, w = 512, hh = 256, font = BOLD) => canvasTex(`pl11b|${t}|${bg}|${fg}|${px}|${w}|${hh}`, w, hh, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, hh); g.fillStyle = fg; g.font = font(px); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(t, w / 2, hh / 2 + px * 0.04);
});
// bobina de resistencia (hélice) que se pone al rojo con k
const Coil: React.FC<{ p: V3; k: number; len?: number; r?: V3 }> = ({ p, k, len = 0.9, r = [0, 0, 0] }) => {
  const pts: V3[] = Array.from({ length: 90 }, (_, i) => { const a = i * 0.62; return [-len / 2 + (len * i) / 89, Math.sin(a) * 0.05, Math.cos(a) * 0.05]; });
  const c = mixc("#5a5550", "#ff5a1e", k);
  return <group position={p} rotation={r}><Tube pts={pts} rad={0.009} seg={360} c={c} e={k > 0.05 ? "#ff4a14" : undefined} ei={3.2 * k} m={0.6} ro={0.35} /></group>;
};

// 1 · la caja registradora vieja: salta la banderita de $240; baja, y salta la de $480 en rojo con el timbre
export const MPopuptabs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), t1 = win(u, 0.04, 0.12) * (1 - win(u, 0.28, 0.36)), t2 = win(u, 0.4, 0.5), b2 = bump(u, 0.5, 40, 10), ring = win(u, 0.48, 0.52) * (1 - win(u, 0.52, 0.75)), dr = win(u, 0.4, 0.46);
  const Tab: React.FC<{ x: number; k: number; txt: string; c: string; b?: number }> = ({ x, k, txt, c, b = 0 }) =>
    <group position={[x, 1.08 + 0.36 * k + 0.03 * b, 0.16]}><Bx s={[0.5, 0.3, 0.02]} c="#f4efe2" ro={0.5} /><Pl w={0.48} h={0.28} p={[0, 0, 0.012]} map={plate(txt, "#f4efe2", c, 160)} c="#ffffff" ro={0.5} ns /></group>;
  return <S3 zk={1.12} p={lv([0, 1.2, 2.6], [0, 1.15, 2.3], u)} l={[0, 0.95, 0]} fov={36} floor={null} warm="#ffe0b8">
    <Table w={5} d={3} /><Wall w={7} />
    <Bx s={[1.5, 0.62, 0.9]} p={[0, 0.31, 0]} c="#6b3f22" m={0.2} ro={0.4} rad={0.04} />
    <Bx s={[1.36, 0.42, 0.55]} p={[0, 0.78, -0.12]} c="#a87a3a" m={0.75} ro={0.28} rad={0.05} />
    <Bx s={[1.2, 0.5, 0.06]} p={[0, 1.2, 0.12]} c="#2a1c12" ro={0.4} />
    <Pl w={1.12} h={0.44} p={[0, 1.2, 0.152]} c="#ffffff" o={0.12} m={0.9} ro={0.05} ns />
    {Array.from({ length: 12 }, (_, i) => <Cy key={i} rt={0.045} h={0.05} r={[Math.PI / 2.6, 0, 0]} p={[-0.55 + (i % 6) * 0.22, 0.42 + Math.floor(i / 6) * 0.11, 0.48 - Math.floor(i / 6) * 0.05]} c="#f2ead6" ro={0.4} />)}
    <Tab x={-0.28} k={t1} txt="$240" c="#2a2724" />
    <Tab x={0.28} k={t2} txt="$480" c="#c4261c" b={b2} />
    <group position={[0, 0.12, 0.2 + 0.32 * dr]}><Bx s={[1.3, 0.18, 0.55]} c="#5a3420" ro={0.45} rad={0.02} /><Bx s={[0.3, 0.05, 0.03]} p={[0, 0.02, 0.29]} c="#c9a24a" m={1} ro={0.25} />{[-0.4, -0.15, 0.1, 0.35].map((x) => <Bx key={x} s={[0.2, 0.02, 0.38]} p={[x, 0.1, 0]} c="#7fae6a" ro={0.8} />)}</group>
    <Sp rad={0.07} p={[0.62, 1.02, 0.15]} c="#d9b25a" m={1} ro={0.2} />
    {ring > 0 && <><Puff p={[0.62, 1.05, 0.3]} s={0.6 * ring + 0.2} c="#ffe08a" o={0.5 * ring} /><pointLight position={[0.3, 1.5, 0.6]} intensity={3 * ring} distance={3} color="#ff8a5a" /></>}
  </S3>;
}}</Stage>;

// 2 · la bola de nieve: se sacude, la nieve se arremolina y la bomba de calor chiquita de adentro se va cubriendo de hielo
export const MSnowglobe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), shake = Math.sin(tt * 26) * 0.08 * (1 - win(u, 0.05, 0.22)) * win(u, 0, 0.04), fr = win(u, 0.1, 0.55);
  return <S3 p={[0, 0.82, 1.6]} l={[0, 0.62, 0]} fov={38} floor={null} warm="#e8eeff">
    <Table w={5} d={3} /><Wall w={7} c="#c8cfdc" />
    <group rotation={[0, 0, shake]}>
      <Cy rt={0.42} rb={0.5} h={0.22} p={[0, 0.11, 0]} c="#4a2c18" ro={0.45} />
      <Cy rt={0.4} h={0.03} p={[0, 0.235, 0]} c="#f4f6fa" ro={0.8} />
      <group position={[0, 0.25, 0]}><HPU s={0.62} frost={fr} ice={fr} fan={tt * 5 * (1 - fr)} /></group>
      {Array.from({ length: 70 }, (_, i) => { const a = rnd(i, 1) * 6.28 + tt * (0.6 + rnd(i, 2)) * (1 - fr * 0.7), rr = 0.08 + 0.3 * rnd(i, 3), y = 0.28 + ((0.75 - ((tt * 0.12 * (0.5 + rnd(i, 4)) + rnd(i, 5)) % 0.75)));
        return <Sp key={i} rad={0.008 + 0.006 * rnd(i, 6)} p={[Math.cos(a) * rr, y, Math.sin(a) * rr]} c="#ffffff" e="#ffffff" ei={0.4} ns />; })}
      <Sp rad={0.5} p={[0, 0.7, 0]} c="#dfeaff" o={0.12} ro={0.02} m={0.1} ns />
      <Sp rad={0.51} p={[0, 0.7, 0]} c="#ffffff" o={0.05} ro={0.0} m={0.9} ns />
    </group>
  </S3>;
}}</Stage>;

// 3 · el pozo frío: del aljibe de piedra sube un balde con una bola de calor naranja; la bola vuela a la casita y le prende las ventanas
export const MWellbucket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), up = win(u, 0.06, 0.45), fly = win(u, 0.5, 0.7), lit = win(u, 0.68, 0.78);
  const by = lerp(-0.2, 0.95, up), orb: V3 = [lerp(-0.55, 0.85, fly), by + 0.18 + Math.sin(fly * Math.PI) * 0.45 - fly * 0.65, lerp(0, 0.05, fly)];
  return <S3 p={[0.15, 1.35, 3.1]} l={[0.15, 0.6, 0]} fov={36} floor={null} warm="#cfe0ff">
    <FrostGround w={10} d={7} />
    <group position={[-0.55, 0, 0]}>
      <Cy rt={0.42} h={0.55} p={[0, 0.275, 0]} c="#7d7a74" ro={0.9} seg={18} open />
      <Cy rt={0.36} h={0.56} p={[0, 0.275, 0]} c="#1b1c20" ro={1} seg={18} open />
      <To R={0.42} t={0.06} r={[Math.PI / 2, 0, 0]} p={[0, 0.55, 0]} c="#8a867e" ro={0.9} />
      {[-0.45, 0.45].map((x) => <Bx key={x} s={[0.07, 1.1, 0.07]} p={[x, 0.95, 0]} c="#6a4426" ro={0.7} />)}
      <Cy rt={0.04} h={1.0} r={[0, 0, Math.PI / 2]} p={[0, 1.42, 0]} c="#5a3a20" ro={0.7} />
      <Cy rt={0.006} h={1.42 - by - 0.12} p={[0, (1.42 + by + 0.12) / 2, 0]} c="#c9b08a" ro={0.9} />
      <Cy rt={0.13} rb={0.1} h={0.2} p={[0, by, 0]} c="#7a7f86" m={0.7} ro={0.35} open />
    </group>
    {fly < 1 && <><Sp rad={0.17} p={orb} c="#ffb04a" e="#ff8a1e" ei={2.4} ns /><Puff p={orb} s={0.9} c="#ffa040" o={0.45} />{[0.06, 0.12, 0.18].map((d) => <Sp key={d} rad={0.1 - d * 0.4} p={[orb[0] - d * 2.2 * (fly > 0 ? 1 : 0), orb[1] - d * (fly > 0 ? 0.3 : 1.5), orb[2]]} c="#ffb04a" e="#ff8a1e" ei={1.5} o={0.6} ns />)}</>}
    <pointLight position={orb} intensity={2.2 * (1 - lit)} distance={2.4} color="#ff9a3a" />
    <group position={[0.95, 0, -0.1]}>
      <Bx s={[0.8, 0.55, 0.6]} p={[0, 0.275, 0]} c="#e2d6c0" ro={0.8} />
      <mesh position={[0, 0.72, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[0.62, 0.36, 4]} /><meshStandardMaterial color="#5a3328" roughness={0.8} /></mesh>
      {[-0.2, 0.2].map((x) => <Pl key={x} w={0.16} h={0.16} p={[x, 0.32, 0.302]} c={mixc("#1c2230", "#ffc46a", lit)} e={lit > 0.05 ? "#ffb04a" : undefined} ei={0.7 * lit} ns />)}
      <pointLight position={[0, 0.35, 0.5]} intensity={1.8 * lit} distance={1.6} color="#ffb04a" />
    </group>
    {Array.from({ length: 18 }, (_, i) => <Sp key={i} rad={0.03 + 0.02 * rnd(i, 1)} p={[-2.2 + 4.6 * rnd(i, 2), 0.01, -0.6 + 1.6 * rnd(i, 3)]} sc={[1, 0.25, 1]} c="#eef3fa" ro={0.6} ns />)}
  </S3>;
}}</Stage>;

// 4 · el termómetro de pared al lado del reloj: el minutero da una vuelta entera y la columna roja apenas trepa un grado y medio
const thermoTex = () => canvasTex("thermo11b", 256, 1024, (g) => {
  g.fillStyle = "#f4efe2"; g.fillRect(0, 0, 256, 1024); g.fillStyle = "#2a2724"; g.font = BOLD(64); g.textAlign = "right"; g.textBaseline = "middle";
  for (let i = 0; i <= 6; i++) { const y = 900 - i * 130; g.fillRect(150, y - 4, 70, 8); g.fillText(String(64 + i), 135, y); }
});
const clockTex = () => canvasTex("clock11b", 512, 512, (g) => {
  g.fillStyle = "#f6f1e4"; g.beginPath(); g.arc(256, 256, 250, 0, 6.29); g.fill(); g.fillStyle = "#1c1a18"; g.font = BOLD(64); g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 1; i <= 12; i++) { const a = (i / 12) * 6.283; g.fillText(String(i), 256 + Math.sin(a) * 195, 256 - Math.cos(a) * 195); }
});
export const MFloordial: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), r = win(u, 0.08, 0.9), deg = 66 + 1.5 * r, col = (deg - 64) / 6;
  return <S3 zk={1.35} p={[0, 1.12, 1.95]} l={[0, 1.1, 0]} fov={38} floor={null}>
    <Wall w={7} c="#efe4d2" z={-0.08} />
    <group position={[-0.5, 1.1, 0]}>
      <Bx s={[0.34, 1.5, 0.05]} p={[0, 0, 0]} c="#6a4426" ro={0.6} />
      <Pl w={0.28} h={1.12} p={[0, 0.05, 0.027]} map={thermoTex()} c="#ffffff" ro={0.6} ns />
      <Cy rt={0.022} h={1.1} p={[0.06, 0.05, 0.05]} c="#ffffff" o={0.35} ro={0.05} />
      <Cy rt={0.013} h={0.06 + 0.98 * col} p={[0.06, -0.47 + (0.06 + 0.98 * col) / 2, 0.05]} c="#d0201a" e="#d0201a" ei={0.5} />
      <Sp rad={0.05} p={[0.06, -0.55, 0.05]} c="#d0201a" e="#d0201a" ei={0.5} />
    </group>
    <group position={[0.55, 1.2, 0.02]}>
      <Cy rt={0.46} h={0.08} r={[Math.PI / 2, 0, 0]} c="#2a2724" ro={0.4} seg={64} />
      <mesh position={[0, 0, 0.042]}><circleGeometry args={[0.42, 64]} /><meshStandardMaterial map={clockTex()} roughness={0.6} /></mesh>
      <group position={[0, 0, 0.055]} rotation={[0, 0, -r * Math.PI * 2]}><Bx s={[0.025, 0.36, 0.01]} p={[0, 0.16, 0]} c="#1c1a18" /></group>
      <group position={[0, 0, 0.05]} rotation={[0, 0, -(7 + r) / 12 * Math.PI * 2]}><Bx s={[0.04, 0.24, 0.01]} p={[0, 0.1, 0]} c="#1c1a18" /></group>
      <Sp rad={0.03} p={[0, 0, 0.06]} c="#b5321f" />
    </group>
  </S3>;
}}</Stage>;

// 5 · el pastillero de la semana: las siete tapas se abren de a una y en cada casilla se prende una resistencia al rojo
export const MPillbox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), D = ["S", "M", "T", "W", "T", "F", "S"];
  return <S3 p={[0, 0.95, 1.45]} l={[0, 0.08, 0.05]} fov={40} floor={null}>
    <Table w={4} d={2.6} />
    <Bx s={[1.9, 0.12, 0.42]} p={[0, 0.06, 0]} c="#e9e4da" ro={0.35} />
    {D.map((d, i) => { const k = win(u, 0.08 + i * 0.09, 0.15 + i * 0.09), x = -0.81 + i * 0.27;
      return <group key={i}>
        <Bx s={[0.23, 0.02, 0.34]} p={[x, 0.121, 0]} c="#2a2724" ro={0.6} ns />
        <Coil p={[x, 0.15, 0]} k={win(u, 0.14 + i * 0.09, 0.22 + i * 0.09)} len={0.24} r={[0, Math.PI / 2, 0]} />
        <Pl w={0.16} h={0.1} p={[x, 0.06, 0.211]} map={plate(d, "#e9e4da", "#2a2724", 200, 256, 160)} c="#ffffff" ns />
        <pointLight position={[x, 0.3, 0.05]} intensity={0.9 * win(u, 0.14 + i * 0.09, 0.22 + i * 0.09)} distance={0.6} color="#ff5a1e" />
        <group position={[x, 0.125, -0.17]} rotation={[-k * 1.9, 0, 0]}>
          <Bx s={[0.25, 0.025, 0.36]} p={[0, 0.013, 0.18]} c={["#d9443a", "#e8853a", "#e8c23a", "#5ab85a", "#3a8fd9", "#7a5ad9", "#d95aa8"][i]} o={0.92} ro={0.25} />
        </group>
      </group>; })}
    <pointLight position={[0, 0.5, 0.3]} intensity={1.6 * win(u, 0.2, 0.8)} distance={2} color="#ff6a2a" />
  </S3>;
}}</Stage>;

// 6 · el acelerador: el pedal se hunde solo hasta el piso con un golpe y la resistencia de atrás se pone al rojo de punta a punta
export const MPedal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), dn = win(u, 0.14, 0.3), b = bump(u, 0.3, 50, 14), hot = win(u, 0.3, 0.75);
  return <S3 p={[0.75, 0.62, 1.55]} l={[0, 0.3, 0.1]} fov={38} floor={null} warm="#ffd8b0">
    <PhotoGround w={5} d={4} name="t_concreto.jpg" rep={1} tint="#a0a0a0" />
    <Bx s={[1.2, 0.02, 1.4]} p={[0, 0.01, 0.2]} c="#4a4a4e" ro={0.95} />
    <group position={[0, 0.03, 0.55]} rotation={[-0.75 + dn * 0.55 + b * 0.04, 0, 0]} scale={1.7}>
      <Bx s={[0.08, 0.06, 0.12]} c="#3a3a3e" m={0.7} ro={0.3} />
      <Bx s={[0.36, 0.035, 0.62]} p={[0, 0.03, -0.32]} c="#2a2a2c" m={0.5} ro={0.5} rad={0.02} />
      {Array.from({ length: 7 }, (_, i) => <Bx key={i} s={[0.3, 0.012, 0.03]} p={[0, 0.052, -0.08 - i * 0.075]} c="#2c2c2c" ro={0.6} ns />)}
    </group>
    <Puff p={[0, 0.06, 0.2]} s={0.5 * win(u, 0.3, 0.34) + 0.1} c="#c8c0b0" o={0.4 * (1 - win(u, 0.34, 0.5)) * win(u, 0.29, 0.31)} add={false} />
    <Bx s={[2.2, 0.7, 0.08]} p={[0, 0.65, -0.9]} c="#2a2c30" m={0.5} ro={0.4} />
    {[0, 1, 2].map((i) => <Coil key={i} p={[0, 0.42 + i * 0.22, -0.82]} k={win(u, 0.3 + i * 0.08, 0.5 + i * 0.08) * (0.85 + 0.15 * Math.sin(tt * 9 + i))} len={1.9} />)}
    <pointLight position={[0, 0.7, -0.4]} intensity={3.2 * hot} distance={3} color="#ff5a1e" />
  </S3>;
}}</Stage>;

// 7 · el sombrero en la percha: vuela un sombrero de fieltro y cae en el gancho; al lado el termostato salta de 68 a 80 en rojo
export const MHathook: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), fl = win(u, 0.06, 0.3), b = bump(u, 0.3, 36, 9), jump = win(u, 0.42, 0.56), n = Math.round(lerp(68, 80, jump)), hotp = n >= 78 ? 0.5 + 0.5 * Math.sin(tt * 8) : 0;
  const hp: V3 = [lerp(-2.4, -0.55, fl), lerp(1.9, 1.26, fl) + Math.sin(fl * Math.PI) * 0.35 + b * 0.02, lerp(0.8, 0.16, fl)];
  return <S3 p={[0, 1.18, 2.1]} l={[0, 1.15, 0]} fov={38} floor={null}>
    <Wall w={7} c="#e6dccb" z={-0.08} />
    <Bx s={[0.9, 0.12, 0.05]} p={[-0.55, 1.2, 0]} c="#6a4426" ro={0.6} />
    <Tube pts={[[-0.55, 1.2, 0.02], [-0.55, 1.2, 0.16], [-0.55, 1.3, 0.22], [-0.55, 1.38, 0.18]]} rad={0.022} c="#c9a24a" m={1} ro={0.22} />
    <group position={hp} rotation={[0.25 * (1 - fl), fl * 6.28 * 1.5, -0.2 * (1 - fl) + b * 0.15]}>
      <Cy rt={0.32} h={0.025} c="#4a3a2c" ro={0.85} seg={48} />
      <Cy rt={0.17} rb={0.2} h={0.2} p={[0, 0.11, 0]} c="#4a3a2c" ro={0.85} />
      <Cy rt={0.205} h={0.05} p={[0, 0.04, 0]} c="#1c1612" ro={0.6} />
    </group>
    <group position={[0.6, 1.15, 0.02]}>
      <Bx s={[0.62, 0.62, 0.07]} c="#f2f0ea" ro={0.35} rad={0.05} />
      <Pl w={0.5} h={0.34} p={[0, 0.04, 0.037]} map={plate(String(n), "#10161c", n >= 78 ? "#ff3a2a" : "#ffffff", 230, 512, 340)} c="#ffffff" e={"#ffffff"} ei={0.25} ns />
      <pointLight position={[0, 0, 0.4]} intensity={1.6 * hotp * jump} distance={1.3} color="#ff3a2a" />
    </group>
  </S3>;
}}</Stage>;

// 8 · la escalera de tacos: los tacos de madera caen de a uno con una pausa entre cada uno y una bolita de bronce sube un escalón cada vez
export const MStairstep: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), N = 4, at = (i: number) => 0.08 + i * 0.2;
  const done = Array.from({ length: N }, (_, i) => win(u, at(i), at(i) + 0.06)), lvl = done.reduce((s, x) => s + (x >= 1 ? 1 : 0), 0);
  const hop = lvl > 0 ? win(u, at(lvl - 1) + 0.07, at(lvl - 1) + 0.13) : 0, from = Math.max(0, lvl - 1), to = lvl;
  const sx = (i: number) => -0.75 + i * 0.42, sh = (i: number) => 0.14 + i * 0.14;
  const bx = lvl === 0 ? -1.15 : lerp(from === 0 && lvl === 1 ? -1.15 : sx(from - 1 < 0 ? 0 : from - 1), sx(to - 1), hop), byv = lvl === 0 ? 0.07 : lerp(lvl === 1 ? 0.07 : sh(from - 1) + 0.07, sh(to - 1) + 0.07, hop) + Math.sin(hop * Math.PI) * 0.12;
  return <S3 zk={1.3} p={[0.1, 0.8, 1.9]} l={[-0.1, 0.32, 0]} fov={38} floor={null}>
    <Table w={5} d={3} /><Wall w={7} c="#e9dfcf" z={-0.7} />
    {done.map((k, i) => <group key={i} position={[sx(i), sh(i) / 2 + (1 - k) * 0.9, 0]}>
      <Bx s={[0.4, sh(i), 0.5]} c={["#c99a62", "#b8874f", "#a8763f", "#966532"][i]} ro={0.7} rad={0.02} />
      <Pl w={0.34} h={0.11} p={[0, sh(i) / 2 - 0.065, 0.252]} map={plate(String(68 + i + 1), "#2a1a0e", "#fff4dc", 200, 384, 128)} c="#ffffff" ns />
    </group>)}
    <Sp rad={0.07} p={[bx, byv, 0.05]} c="#c9a14a" m={1} ro={0.2} />
  </S3>;
}}</Stage>;

// 9 · la llave de cuchilla: la palanca de cobre baja de un golpe con chispas y las tres resistencias de la emergencia se prenden en fila
export const MKnifeswitch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), cls = win(u, 0.14, 0.3), sp = win(u, 0.29, 0.31) * (1 - win(u, 0.31, 0.48));
  return <S3 p={[0, 1.08, 2.0]} l={[0, 1.02, 0]} fov={38} floor={null} warm="#ffd8b0">
    <Wall w={7} c="#8a7e70" z={-0.12} />
    <Bx s={[0.85, 1.0, 0.06]} p={[-0.6, 1.0, 0]} c="#5a3a20" ro={0.65} />
    <Pl w={0.6} h={0.18} p={[-0.6, 1.36, 0.032]} map={plate("EM HEAT", "#b08a3a", "#1a120a", 96, 512, 160)} c="#ffffff" m={0.6} ro={0.3} ns />
    {[-0.16, 0.16].map((x) => <group key={x}>
      <Bx s={[0.06, 0.1, 0.06]} p={[-0.6 + x, 0.72, 0.05]} c="#c97a3a" m={1} ro={0.25} />
      <Bx s={[0.07, 0.12, 0.08]} p={[-0.6 + x, 1.12, 0.06]} c="#c97a3a" m={1} ro={0.25} />
    </group>)}
    <group position={[-0.6, 0.72, 0.09]} rotation={[-(1 - cls) * 1.6, 0, 0]}>
      {[-0.16, 0.16].map((x) => <Bx key={x} s={[0.025, 0.44, 0.05]} p={[x, 0.22, 0]} c="#d88a48" m={1} ro={0.22} />)}
      <Bx s={[0.4, 0.03, 0.04]} p={[0, 0.44, 0]} c="#222" ro={0.5} />
      <Cy rt={0.035} h={0.2} p={[0, 0.52, 0.05]} r={[Math.PI / 2.4, 0, 0]} c="#141414" ro={0.4} />
    </group>
    {sp > 0 && [-0.16, 0.16].map((x) => <group key={x}>
      <Puff p={[-0.6 + x, 1.12, 0.2]} s={0.55 * sp + 0.1} c="#bfe0ff" o={0.9 * sp} />
      {Array.from({ length: 8 }, (_, i) => <Sp key={i} rad={0.008} p={[-0.6 + x + (rnd(i, x + 2) - 0.5) * 0.5 * (1 - sp), 1.12 + (rnd(i, 7) - 0.3) * 0.4 * (1 - sp), 0.2]} c="#fff6c0" e="#ffe08a" ei={3} ns />)}
    </group>)}
    <pointLight position={[-0.6, 1.12, 0.6]} intensity={6 * sp} distance={2.5} color="#cfe6ff" />
    <Bx s={[1.0, 0.95, 0.1]} p={[0.55, 1.0, -0.02]} c="#2a2c30" m={0.5} ro={0.4} />
    {[0, 1, 2].map((i) => <Coil key={i} p={[0.55, 0.72 + i * 0.28, 0.06]} k={win(u, 0.34 + i * 0.1, 0.5 + i * 0.1) * (0.9 + 0.1 * Math.sin(tt * 7 + i))} len={0.82} />)}
    <pointLight position={[0.55, 1.0, 0.5]} intensity={2.6 * win(u, 0.36, 0.7)} distance={2.2} color="#ff5a1e" />
  </S3>;
}}</Stage>;

// 10 · la cuenta en el pizarrón: la tiza marca palito por palito siete grupos de cinco, uno por semana
const chalkTex = (k: number) => canvasTex(`chalk11b|${Math.round(k * 140)}`, 1024, 512, (g) => {
  g.fillStyle = "#24332b"; g.fillRect(0, 0, 1024, 512); g.strokeStyle = "rgba(240,240,232,.92)"; g.lineCap = "round"; g.lineWidth = 15;
  const n = Math.round(k * 35);
  for (let i = 0; i < n; i++) { const gi = Math.floor(i / 5), j = i % 5, col = gi % 4, row = Math.floor(gi / 4), x0 = 70 + col * 240, y0 = 70 + row * 230;
    g.beginPath(); if (j < 4) { g.moveTo(x0 + j * 40 + rnd(i, 1) * 6, y0); g.lineTo(x0 + j * 40 + rnd(i, 2) * 8, y0 + 160); } else { g.moveTo(x0 - 18, y0 + 130); g.lineTo(x0 + 150, y0 + 30); } g.stroke(); }
});
export const MChalktally: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.04, 0.86), n = Math.round(k * 35), i = Math.min(34, n), gi = Math.floor(i / 5), j = i % 5;
  const cx = -1.1 + ((70 + (gi % 4) * 240 + (j < 4 ? j * 40 : 60)) / 1024) * 2.2, cy = 1.1 + 0.55 - ((70 + Math.floor(gi / 4) * 230 + 80) / 512) * 1.1;
  return <S3 p={[0, 1.1, 2.6]} l={[0, 1.05, 0]} fov={36} floor={null}>
    <Wall w={7} c="#d8cdbb" z={-0.1} />
    <group><Bx s={[2.4, 1.3, 0.06]} p={[0, 1.1, 0]} c="#6a4426" ro={0.6} />
    <Pl w={2.2} h={1.1} p={[0, 1.1, 0.032]} map={chalkTex(k)} c="#ffffff" ro={0.95} ns />
    <Bx s={[2.3, 0.04, 0.12]} p={[0, 0.44, 0.06]} c="#5a3a20" ro={0.6} />
    {k < 1 && <><Cy rt={0.03} h={0.2} p={[cx + 0.05, cy + 0.06, 0.12]} r={[0.5, 0, -0.5]} c="#f4f2ea" ro={0.9} /><Puff p={[cx, cy - 0.06, 0.08]} s={0.12} c="#ffffff" o={0.35} add={false} /></>}</group>
  </S3>;
}}</Stage>;

// 11 · la rueda de auxilio: el «donut» entra rodando, tambalea y se acuesta al lado de la rueda de verdad; la etiqueta amarilla dice 50 MPH
const Tire: React.FC<{ R: number; w: number; rim: string }> = ({ R, w, rim }) => <group>
  <Cy rt={R} h={w} r={[Math.PI / 2, 0, 0]} c="#1a1a1a" ro={0.85} seg={48} />
  <Cy rt={R * 0.62} h={w + 0.01} r={[Math.PI / 2, 0, 0]} c={rim} m={0.7} ro={0.35} seg={40} />
  {Array.from({ length: 5 }, (_, i) => <Sp key={i} rad={R * 0.05} p={[Math.cos(i * 1.2566) * R * 0.3, Math.sin(i * 1.2566) * R * 0.3, w / 2 + 0.01]} c="#ddd" m={1} ro={0.2} ns />)}
</group>;
export const MDonut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), roll = win(u, 0.06, 0.4), wob = win(u, 0.4, 0.62), x = lerp(-2.6, 0.45, roll), R = 0.34;
  const lean = wob * (Math.PI / 2 - 0.0) - Math.sin(wob * 18) * 0.25 * (1 - wob), tag = win(u, 0.66, 0.74);
  return <S3 p={[0, 1.25, 2.6]} l={[0, 0.3, 0]} fov={36} floor={null}>
    <PhotoGround w={7} d={5} name="t_concreto.jpg" rep={1} tint="#8a8a8a" />
    <group position={[-0.6, 0.48, -0.1]}><Tire R={0.48} w={0.24} rim="#9aa0a6" /></group>
    <group position={[x, R * Math.cos(lean) + 0.06 * Math.sin(lean), 0.25]} rotation={[lean, 0, 0]}>
      <group rotation={[0, 0, -(x + 2.6) / R]}><Tire R={R} w={0.12} rim="#c4c9ce" /></group>
    </group>
    <group position={[0.2, 0.15, 0.85]} rotation={[-Math.PI / 2 + 0.35, 0, 0]} scale={tag}>
      <Pl w={0.9} h={0.26} map={plate("MAX 50 MPH", "#f2c230", "#141414", 110, 900, 256)} c="#ffffff" ro={0.5} />
    </group>
  </S3>;
}}</Stage>;

// 12 · las seis bombitas: seis lamparitas viejas en sus portalámparas de loza, sobre una tabla, se prenden de a una
export const MSixbulbs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h);
  return <S3 p={[0, 0.72, 1.85]} l={[0, 0.3, 0]} fov={40} floor={null} exp={0.95}>
    <Table w={5} d={3} /><Wall w={7} c="#8c8070" z={-0.7} />
    <Bx s={[2.3, 0.07, 0.4]} p={[0, 0.035, 0]} c="#7a5230" ro={0.6} />
    {Array.from({ length: 6 }, (_, i) => { const k = win(u, 0.08 + i * 0.13, 0.12 + i * 0.13) * (0.96 + 0.04 * Math.sin(tt * 30 + i)), x = -0.95 + i * 0.38;
      return <group key={i} position={[x, 0.07, 0]}>
        <Cy rt={0.07} rb={0.08} h={0.1} p={[0, 0.05, 0]} c="#f2eee4" ro={0.3} />
        <Cy rt={0.045} h={0.07} p={[0, 0.135, 0]} c="#b8a070" m={1} ro={0.3} />
        <Sp rad={0.12} p={[0, 0.3, 0]} sc={[1, 1.15, 1]} c={mixc("#e8e4d8", "#fff2c0", k)} e={k > 0.02 ? "#ffd27a" : undefined} ei={2.6 * k} o={0.88} ro={0.1} ns />
        <To R={0.035} t={0.004} p={[0, 0.3, 0]} c="#ffb04a" e={k > 0.02 ? "#ffb04a" : undefined} ei={5 * k} /><Cy rt={0.003} h={0.12} p={[0, 0.2, 0]} c="#555" />
        <pointLight position={[0, 0.3, 0.1]} intensity={0.9 * k} distance={1.3} color="#ffc46a" />
      </group>; })}
  </S3>;
}}</Stage>;

// 13 · los engranajes atados: el de la llama y el del ventilador giran juntos, frenan juntos y vuelven a arrancar juntos
const Gear: React.FC<{ R: number; n: number; c: string; a: number; p: V3 }> = ({ R, n, c, a, p }) => <group position={p} rotation={[0, 0, a]}>
  <Cy rt={R} h={0.12} r={[Math.PI / 2, 0, 0]} c={c} m={0.8} ro={0.3} seg={64} />
  {Array.from({ length: n }, (_, i) => { const q = (i / n) * Math.PI * 2; return <Bx key={i} s={[0.11, 0.12, 0.12]} p={[Math.cos(q) * (R + 0.04), Math.sin(q) * (R + 0.04), 0]} r={[0, 0, q]} c={c} m={0.8} ro={0.3} />; })}
  <Cy rt={0.07} h={0.16} r={[Math.PI / 2, 0, 0]} c="#2a2a2a" m={0.6} ro={0.4} />
</group>;
export const MLinkedgears: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), sp = (x: number) => win(x, 0.04, 0.12) * (1 - win(x, 0.3, 0.4)) + win(x, 0.62, 0.72);
  const a = 6 * (h.out - h.at) * cum(sp, u, 60), R1 = 0.5, R2 = 0.5;
  const fl = sp(u);
  return <S3 zk={1.35} p={[0, 1.15, 2.7]} l={[0, 1.05, 0]} fov={36} floor={null}>
    <Wall w={7} c="#5a5650" z={-0.2} />
    <Gear R={R1} n={14} c="#c98a3a" a={a} p={[-0.57, 1.05, 0]} />
    <Gear R={R2} n={14} c="#8a9aa8" a={-a + Math.PI / 14} p={[0.57, 1.05, 0]} />
    <group position={[-0.57, 1.05, 0.08]}>
      {fl > 0.03 && <><Sp rad={0.13 * fl} p={[0, -0.02, 0]} sc={[1, 1.9 + 0.2 * Math.sin(tt * 11), 1]} c="#ffb04a" e="#ff6a14" ei={2.6} o={0.9} ns /><Sp rad={0.07 * fl} p={[0, -0.06, 0.05]} sc={[1, 1.6, 1]} c="#9fd0ff" e="#4aa8ff" ei={2.5} ns /><Puff p={[0, 0.1, 0.02]} s={0.45 * fl} c="#ff8a2a" o={0.6} /></>}
      <pointLight position={[0, 0, 0.3]} intensity={1.8 * fl} distance={1.5} color="#ff8a2a" />
    </group>
    <group position={[0.57, 1.05, 0.08]} rotation={[0, 0, a * 3]}>
      {[0, 1, 2, 3].map((i) => <Bx key={i} s={[0.09, 0.32, 0.02]} p={[Math.cos(i * 1.5708) * 0.17, Math.sin(i * 1.5708) * 0.17, 0]} r={[0, 0.5, i * 1.5708 + 1.5708]} c="#e8eef2" m={0.4} ro={0.3} />)}
    </group>
  </S3>;
}}</Stage>;
