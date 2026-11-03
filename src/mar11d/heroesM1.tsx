// mar11d · componentes únicos 1-15 (5 razones por las que el furnace tira aire frío), 3D en el kit r3k.
// Lección de mar11a/b/c (EVALUADOR): UN objeto grande al centro con margen, cámara de frente, la acción a mitad de camino en el
// cuadro del medio, números impresos EN el objeto y grandes, foto real en las superficies. Registro: D:/rtmp/mar11_COMPONENTES.md
import React from "react";
import { BOLD, Bx, Cy, Dot, Env, Flame, HANDF, MONO, Pl, Puff, S3 as S3k, Sp, To, Tube, V3, canvasTex, cl, drop, env, lerp, lv, rnd, win } from "../kits/r3k/r3k";
import { H, Stage } from "./hkit";
import { Hand, U, bump, mixc } from "./props11";
import { PhotoGround, PhotoPl, PhotoWall } from "./tex11";

export const S3: React.FC<React.ComponentProps<typeof S3k> & { k?: number }> = ({ k = 1, p, l, ...r }) =>
  <S3k p={[l[0] + (p[0] - l[0]) * k, l[1] + (p[1] - l[1]) * k, l[2] + (p[2] - l[2]) * k]} l={l} {...r} />;
export const Wall: React.FC<{ w?: number; hh?: number; z?: number; c?: string; name?: string }> = ({ w = 6, hh = 3.2, z = -0.6, c = "#ffffff", name = "t_pared.jpg" }) =>
  <PhotoWall w={w} h={hh} z={z} y={hh / 2 - 0.3} name={name} tint={c} />;
export const Table: React.FC<{ w?: number; d?: number; tint?: string }> = ({ w = 4, d = 2.6, tint = "#ffffff" }) => <PhotoGround w={w} d={d} name="t_madera.jpg" rep={1.4} tint={tint} />;
env(Wall); env(Table);
export const plate = (t: string, bg: string, fg: string, px = 150, w = 512, hh = 256, font = BOLD) => canvasTex(`pl11d|${t}|${bg}|${fg}|${px}|${w}|${hh}`, w, hh, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, hh); g.fillStyle = fg; g.font = font(px); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(t, w / 2, hh / 2 + px * 0.04);
});
// billete de un dólar (verde grisáceo, óvalo central y el 1 en las esquinas)
export const billTex = (n = "1") => canvasTex(`bill11d|${n}`, 512, 218, (g) => {
  g.fillStyle = "#d9dcc6"; g.fillRect(0, 0, 512, 218); g.strokeStyle = "#3d5a40"; g.lineWidth = 10; g.strokeRect(10, 10, 492, 198);
  g.lineWidth = 2; for (let i = 0; i < 26; i++) { g.beginPath(); g.moveTo(24, 24 + i * 6.6); g.lineTo(488, 24 + i * 6.6); g.strokeStyle = `rgba(61,90,64,${0.08 + 0.05 * rnd(i, 2)})`; g.stroke(); }
  g.fillStyle = "#c4c9ad"; g.beginPath(); g.ellipse(256, 109, 62, 74, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = "#3d5a40"; g.lineWidth = 5; g.stroke();
  g.fillStyle = "#2e4632"; g.font = BOLD(64); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(n, 56, 52); g.fillText(n, 456, 52); g.fillText(n, 56, 168); g.fillText(n, 456, 168);
  g.font = BOLD(30); g.fillText("ONE DOLLAR", 256, 196);
});
// el furnace del sótano: gabinete gris, puerta de arriba con rejilla, puerta de abajo con mirilla y luz que parpadea
export const Furnace: React.FC<{ p?: V3; s?: number; led?: number; ledc?: string; door?: number }> = ({ p = [0, 0, 0], s = 1, led = 0, ledc = "#ff3a2a", door = 1 }) => <group position={p} scale={s}>
  <Bx s={[0.72, 1.2, 0.62]} p={[0, 0.6, 0]} c="#b9bcbf" m={0.35} ro={0.45} rad={0.01} />
  <PhotoPl w={0.7} h={1.18} name="t_chapa.jpg" p={[0, 0.6, 0.312]} tint="#d4d7da" m={0.4} ro={0.45} />
  {door > 0 && <group>
    <Bx s={[0.66, 0.5, 0.012]} p={[0, 0.9, 0.318]} c="#c6c9cc" m={0.35} ro={0.4} />
    {Array.from({ length: 7 }, (_, i) => <Bx key={i} s={[0.46, 0.012, 0.012]} p={[0, 0.76 + i * 0.04, 0.33]} c="#7c8085" m={0.4} ro={0.5} ns />)}
    <Bx s={[0.66, 0.48, 0.012]} p={[0, 0.3, 0.318]} c="#c6c9cc" m={0.35} ro={0.4} />
    <Cy rt={0.032} h={0.016} p={[0.16, 0.36, 0.326]} r={[Math.PI / 2, 0, 0]} c="#1a1c1e" ro={0.2} />
    <Sp rad={0.012} p={[0.16, 0.36, 0.33]} c={ledc} e={ledc} ei={0.2 + 4 * led} ro={0.3} ns />
  </group>}
  <Cy rt={0.06} h={0.3} p={[-0.18, 1.35, 0]} c="#e8e8e6" ro={0.5} /><Cy rt={0.06} h={0.3} p={[0.18, 1.35, 0]} c="#e8e8e6" ro={0.5} />
</group>;
env(Furnace);

// 1 · la rejilla del piso: por las ranuras sube aire azul que levanta una tira de papel, y el termómetro de esfera baja de 72 a 48
const dialTex = canvasTex("dial11d", 512, 512, (g) => {
  g.fillStyle = "#f4f1ea"; g.beginPath(); g.arc(256, 256, 250, 0, Math.PI * 2); g.fill();
  g.strokeStyle = "#1e1e1e"; g.lineWidth = 8; g.textAlign = "center"; g.textBaseline = "middle";
  for (let v = 40; v <= 90; v += 2) { const a = Math.PI * (1.25 - 1.5 * (v - 40) / 50), big = v % 10 === 0; g.lineWidth = big ? 8 : 3;
    g.beginPath(); g.moveTo(256 + Math.cos(a) * 230, 256 - Math.sin(a) * 230); g.lineTo(256 + Math.cos(a) * (big ? 190 : 210), 256 - Math.sin(a) * (big ? 190 : 210)); g.stroke();
    if (big) { g.fillStyle = v < 60 ? "#1f5fbf" : "#c0392b"; g.font = BOLD(56); g.fillText(String(v), 256 + Math.cos(a) * 145, 256 - Math.sin(a) * 145); } }
  g.fillStyle = "#1e1e1e"; g.font = BOLD(44); g.fillText("°F", 256, 380);
});
export const MRegisterblue: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), blow = win(u, 0.1, 0.3), cold = win(u, 0.25, 0.8), v = lerp(72, 48, cold), a = Math.PI * (1.25 - 1.5 * (v - 40) / 50) - Math.PI / 2;
  return <S3 p={lv([0, 0.95, 1.35], [0, 0.85, 1.15], u)} l={[0, 0.22, 0]} fov={38} floor={null} warm="#dfe9ff">
    <PhotoGround w={5} d={4} name="t_madera.jpg" rep={1.4} tint="#b09070" />
    <Wall w={6} z={-0.9} c="#c9c4ba" />
    <group position={[-0.22, 0.01, 0.05]}>
      <Bx s={[0.62, 0.02, 0.34]} c="#e9e6e0" m={0.5} ro={0.35} />
      {Array.from({ length: 9 }, (_, i) => <Bx key={i} s={[0.04, 0.012, 0.26]} p={[-0.24 + i * 0.06, 0.014, 0]} c="#9a9894" m={0.5} ro={0.4} ns />)}
      {Array.from({ length: 40 }, (_, i) => { const ph = (tt * 0.9 + rnd(i, 1)) % 1; return <Dot key={i} p={[-0.25 + rnd(i, 2) * 0.5, 0.02 + ph * 0.9 * blow, -0.1 + rnd(i, 3) * 0.2 + ph * 0.1]} r={0.012 + 0.01 * rnd(i, 4)} c="#9ec8ff" o={0.7 * blow * (1 - ph)} add />; })}
      {Array.from({ length: 6 }, (_, i) => <Puff key={i} p={[-0.1 + i * 0.05, 0.25 + i * 0.1, 0]} s={0.35 + i * 0.05} c="#bcd8ff" o={0.12 * blow} />)}
      <group position={[0.3, 0.02, 0.16]} rotation={[-1.2 * blow + 0.25 * Math.sin(tt * 18) * blow, 0, 0]}>
        <Pl w={0.05} h={0.26} p={[0, 0.13, 0]} c="#fdfdfb" ro={0.9} side={2} ns />
      </group>
    </group>
    <group position={[0.42, 0.34, 0.1]} rotation={[0, -0.25, 0]}>
      <Cy rt={0.26} h={0.06} r={[Math.PI / 2, 0, 0]} c="#c9ccd0" m={0.8} ro={0.25} />
      <Pl w={0.46} h={0.46} p={[0, 0, 0.032]} map={dialTex} c="#ffffff" ro={0.6} ns />
      <group position={[0, 0, 0.04]} rotation={[0, 0, a]}><Bx s={[0.014, 0.19, 0.006]} p={[0, 0.08, 0]} c="#c0392b" ro={0.4} ns /></group>
      <Cy rt={0.018} h={0.012} p={[0, 0, 0.046]} r={[Math.PI / 2, 0, 0]} c="#222" m={0.6} ro={0.3} />
      <Bx s={[0.06, 0.34, 0.06]} p={[0, -0.36, -0.02]} c="#5c5f63" m={0.6} ro={0.4} />
      <Bx s={[0.3, 0.03, 0.2]} p={[0, -0.52, -0.02]} c="#3e4145" m={0.6} ro={0.4} />
    </group>
  </S3>;
}}</Stage>;

// 2 · el ticket que no termina: una impresora de mostrador escupe la boleta de $289, + PARTS, + LABOR, TOTAL ???
const tickTex = canvasTex("tick11d", 300, 1024, (g) => {
  g.fillStyle = "#fbfaf5"; g.fillRect(0, 0, 300, 1024); g.fillStyle = "#1c1c1c"; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = MONO(30); g.fillText("AFTER-HOURS", 150, 70); g.font = BOLD(120); g.fillText("$289", 150, 170);
  g.fillStyle = "#555"; g.fillRect(30, 250, 240, 4);
  g.fillStyle = "#1c1c1c"; g.font = BOLD(64); g.fillText("+ PARTS", 150, 340); g.fillText("+ LABOR", 150, 470);
  g.fillStyle = "#555"; g.fillRect(30, 560, 240, 4); g.fillStyle = "#c0392b"; g.font = BOLD(70); g.fillText("TOTAL", 150, 650); g.font = BOLD(110); g.fillText("???", 150, 770);
  for (let i = 0; i < 12; i++) { g.fillStyle = "#fbfaf5"; g.beginPath(); g.moveTo(i * 25, 1024); g.lineTo(i * 25 + 12, 1004); g.lineTo(i * 25 + 25, 1024); g.fill(); }
});
export const MReceiptroll: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.08, 0.78), H0 = 1.3, y = 0.3 - H0 / 2 - H0 * 0.02 + H0 * k * 0.96, sh = Math.sin(tt * 40) * 0.002 * (k > 0 && k < 1 ? 1 : 0);
  return <S3 zk={1.18} p={lv([0, 0.75, 2.2], [0, 0.85, 1.9], u)} l={[0, 0.62, 0]} fov={40} floor={null} warm="#ffe8cc">
    <Table w={4} d={3} tint="#c8a888" />
    <Wall w={6} z={-0.8} c="#d8d0c4" />
    <group position={[0, 0, 0]}>
      <Bx s={[0.62, 0.3, 0.44]} p={[0, 0.15, 0]} c="#2b2d31" ro={0.45} rad={0.03} />
      <Bx s={[0.4, 0.012, 0.04]} p={[0, 0.305, 0.05]} c="#0d0d0e" ro={0.3} ns />
      <Sp rad={0.014} p={[0.24, 0.24, 0.222]} c="#3cd16a" e="#3cd16a" ei={1.5 + Math.sin(tt * 12)} ns />
      <group position={[sh, y, 0.05]}><Pl w={0.36} h={H0} map={tickTex} c="#ffffff" ro={0.85} side={2} ns /></group>
    </group>
  </S3>;
}}</Stage>;

// 3 · el tablero de clavijas: en la pared de herramientas se cuelgan de a uno, con su balanceo, los cuatro arreglos de esta noche
const pegTex = canvasTex("peg11d", 1024, 640, (g) => {
  g.fillStyle = "#b88a5a"; g.fillRect(0, 0, 1024, 640);
  for (let x = 0; x < 32; x++) for (let y = 0; y < 20; y++) { g.fillStyle = "#3a2614"; g.beginPath(); g.arc(16 + x * 32, 16 + y * 32, 5, 0, Math.PI * 2); g.fill(); }
});
const Swing: React.FC<{ k: number; tt: number; p: V3; children: React.ReactNode }> = ({ k, tt, p, children }) => {
  const sw = k >= 1 ? 0.25 * Math.sin((tt) * 7) * Math.exp(-(tt) * 0.4) * 0 + 0 : 0;
  return <group position={[p[0], p[1] + (1 - k) * 0.6, p[2] + (1 - k) * 0.3]} rotation={[0, 0, (1 - k) * 0.5 + sw]}>{children}</group>;
};
export const MPegboard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), K = [0, 1, 2, 3].map((i) => drop(u, 0.06 + i * 0.16, 0.2 + i * 0.16)), sw = (i: number) => bump(u, 0.2 + i * 0.16, 30, 7) * 0.12;
  return <S3 p={lv([0, 1.05, 2.35], [0, 1.05, 2.05], u)} l={[0, 1.0, 0]} fov={40} floor={null} warm="#ffe6c8">
    <PhotoGround w={5} d={4} name="t_concreto.jpg" rep={1.2} tint="#8a8278" />
    <Env><Bx s={[2.6, 1.5, 0.03]} p={[0, 1.0, -0.05]} c="#b88a5a" ro={0.8} /><Pl w={2.56} h={1.46} p={[0, 1.0, -0.03]} map={pegTex} c="#ffffff" ro={0.85} ns /></Env>
    {[-0.84, -0.28, 0.28, 0.84].map((x, i) => <Bx key={i} s={[0.02, 0.02, 0.08]} p={[x, 1.42, 0.0]} c="#c9ccd0" m={1} ro={0.3} ns />)}
    <Swing k={K[0]} tt={tt} p={[-0.84, 1.42, 0.03]}><group rotation={[0, 0, sw(0)]}>
      <Bx s={[0.3, 0.46, 0.05]} p={[0, -0.27, 0]} c="#f1ece2" ro={0.45} rad={0.02} />
      <Bx s={[0.08, 0.15, 0.04]} p={[0, -0.27, 0.03]} c="#fdfcf8" ro={0.4} />
      <Bx s={[0.04, 0.06, 0.03]} p={[0, -0.25, 0.06]} c="#e4dfd2" ro={0.4} />
    </group></Swing>
    <Swing k={K[1]} tt={tt} p={[-0.28, 1.42, 0.03]}><group rotation={[0, 0, sw(1)]}>
      <Bx s={[0.44, 0.56, 0.05]} p={[0, -0.32, 0]} c="#d8d0b8" ro={0.8} />
      <PhotoPl w={0.4} h={0.52} name="t_aletas.jpg" p={[0, -0.32, 0.027]} tint="#d6cdb4" rep={[1.5, 1.5]} />
      <Pl w={0.38} h={0.1} p={[0, -0.12, 0.03]} map={plate("16x25x1", "#f3f0e6", "#1c1c1c", 90)} c="#ffffff" ro={0.7} ns />
    </group></Swing>
    <Swing k={K[2]} tt={tt} p={[0.28, 1.42, 0.03]}><group rotation={[0, 0, sw(2)]}>
      <Pl w={0.42} h={0.18} p={[0, -0.2, 0.01]} map={billTex()} c="#ffffff" ro={0.8} ns />
      <Bx s={[0.02, 0.06, 0.02]} p={[0, -0.08, 0.01]} c="#c9a14a" m={1} ro={0.3} ns />
    </group></Swing>
    <Swing k={K[3]} tt={tt} p={[0.84, 1.42, 0.03]}><group rotation={[0, 0, sw(3)]}>
      <Cy rt={0.14} rb={0.12} h={0.26} p={[0, -0.3, 0.06]} c="#e8f2f4" o={0.55} ro={0.05} />
      <Cy rt={0.125} rb={0.115} h={0.17} p={[0, -0.34, 0.06]} c="#f4f0d8" o={0.75} ro={0.1} />
      <Bx s={[0.03, 0.14, 0.03]} p={[0.15, -0.26, 0.06]} c="#e8f2f4" o={0.6} ro={0.05} ns />
      <Pl w={0.16} h={0.06} p={[0, -0.32, 0.2]} map={plate("1 CUP", "#ffffff", "#c0392b", 90)} c="#ffffff" ro={0.7} ns />
    </group></Swing>
  </S3>;
}}</Stage>;

// 5 · la llave del ventilador: un pulgar baja el interruptor ON → AUTO del termostato grande y la turbina de al lado frena
const thermoTex = (k: number) => canvasTex(`thermo11d|${Math.round(k * 20)}`, 768, 512, (g) => {
  g.fillStyle = "#efeae0"; g.fillRect(0, 0, 768, 512); g.fillStyle = "#1e2a24"; g.fillRect(60, 50, 420, 210);
  g.fillStyle = "#9df0b8"; g.font = BOLD(150); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("68°", 270, 160);
  g.fillStyle = "#2a2a2a"; g.font = BOLD(54); g.fillText("FAN", 620, 70); g.fillStyle = "#d8d2c4"; g.fillRect(585, 110, 70, 340);
  g.font = BOLD(58); g.fillStyle = k < 0.5 ? "#c0392b" : "#9a948a"; g.fillText("ON", 520, 160); g.fillStyle = k >= 0.5 ? "#1f8a4c" : "#9a948a"; g.fillText("AUTO", 470 - 10, 400);
  g.fillStyle = "#2a2a2a"; g.font = BOLD(46); g.fillText("HEAT", 270, 360);
});
export const MFanslider: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.34, 0.5), hand = win(u, 0.14, 0.32) * (1 - win(u, 0.66, 0.84)), spin = Math.max(0, 1 - win(u, 0.5, 0.8)), b = bump(u, 0.5, 40, 10);
  const sy = lerp(0.29, -0.15, k);
  return <S3 zk={1.15} p={lv([0, 1.0, 1.95], [0, 1.0, 1.7], u)} l={[0.1, 1.0, 0]} fov={40} floor={null} warm="#fff0d8">
    <Wall w={6} z={-0.1} c="#e2d8c6" />
    <group position={[0, 1.0 + b * 0.004, 0]}>
      <Bx s={[1.16, 0.78, 0.08]} p={[0, 0, 0]} c="#efeae0" ro={0.4} rad={0.04} />
      <Pl w={1.1} h={0.73} p={[0, 0, 0.042]} map={thermoTex(k)} c="#ffffff" ro={0.5} ns />
      <Bx s={[0.08, 0.12, 0.05]} p={[0.36, sy * 0.73 / 0.78 * 0.8 + 0.02, 0.07]} c="#3a3a3a" ro={0.35} />
    </group>
    <group position={[0.36 + 0.06, 1.0 + sy * 0.75 + 0.12, 0.2 + (1 - hand) * 0.5]} rotation={[0.3, 0, 0.2]}><Hand s={1.6} curl={0.75} sleeve="#55606a" /></group>
    <group position={[-0.95, 0.85, 0.1]}>
      <Cy rt={0.22} h={0.24} r={[Math.PI / 2, 0, 0]} c="#5f6368" m={0.5} ro={0.4} open />
      <group rotation={[0, 0, tt * 18 * spin + (1 - spin) * 3]}>{Array.from({ length: 18 }, (_, i) => <Bx key={i} s={[0.012, 0.07, 0.22]} p={[Math.cos(i * 0.349) * 0.17, Math.sin(i * 0.349) * 0.17, 0]} r={[0, 0, i * 0.349 + 0.4]} c="#9ea3a8" m={0.6} ro={0.35} ns />)}</group>
      <Cy rt={0.05} h={0.26} r={[Math.PI / 2, 0, 0]} c="#2b2d31" m={0.6} ro={0.3} />
    </group>
  </S3>;
}}</Stage>;

// 6 · el ducto del sótano frío: corte del entrepiso, el aire entra tibio al ducto plateado, se enfría por la tierra escarchada y sale azul
export const MCrawlduct: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), f = win(u, 0.1, 0.3), fr = win(u, 0.2, 0.6);
  const P: V3[] = [[-1.3, 0.55, 0], [-0.6, 0.5, 0.02], [0.2, 0.5, 0], [0.9, 0.56, 0], [1.1, 0.9, 0], [1.1, 1.18, 0]];
  return <S3 p={lv([0, 0.95, 2.9], [0, 0.85, 2.6], u)} l={[0, 0.72, 0]} fov={40} floor={null} warm="#e4ecff">
    <PhotoGround w={6} d={3} name="t_tierra.jpg" rep={1.2} tint={mixc("#a08070", "#c8d4e4", fr)} />
    {Array.from({ length: 60 }, (_, i) => <Dot key={i} p={[-1.6 + rnd(i, 1) * 3.2, 0.01, -0.6 + rnd(i, 2) * 1.0]} r={0.015} c="#f4f8ff" o={0.8 * fr} />)}
    <Env><Bx s={[3.4, 0.12, 1.4]} p={[0, 1.28, -0.2]} c="#8a6a4a" ro={0.7} /><PhotoPl w={3.4} h={0.12} name="t_madera.jpg" p={[0, 1.28, 0.501]} tint="#9a7a5a" />
      {[-1.2, -0.4, 0.4, 1.2].map((x) => <Bx key={x} s={[0.1, 0.3, 1.2]} p={[x, 1.07, -0.2]} c="#7a5a3a" ro={0.7} />)}
      <PhotoWall w={4} h={1.4} z={-0.9} y={0.6} name="t_concreto.jpg" tint="#8a8680" /></Env>
    <Tube pts={P} rad={0.13} c="#c4c8cc" m={0.75} ro={0.35} />
    {Array.from({ length: 7 }, (_, i) => <Cy key={i} rt={0.135} h={0.02} p={[-1.1 + i * 0.3, 0.52, 0]} r={[0, 0, Math.PI / 2]} c="#9a9ea2" m={0.7} ro={0.4} />)}
    {Array.from({ length: 26 }, (_, i) => { const s = ((tt * 0.35 + i / 26) % 1), seg = s * 5, j = Math.min(4, Math.floor(seg)), w = seg - j, q = lv(P[j], P[j + 1], w);
      return <Dot key={i} p={[q[0], q[1], q[2] + 0.15]} r={0.03} c={mixc("#ff9a40", "#5aa8ff", cl(s * 1.6))} o={0.9 * f} add />; })}
    <Bx s={[0.36, 0.03, 0.36]} p={[1.1, 1.35, 0]} c="#e9e6e0" m={0.5} ro={0.35} />
    {Array.from({ length: 5 }, (_, i) => <Puff key={i} p={[1.1, 1.45 + i * 0.1, 0.05]} s={0.3 + i * 0.06} c="#9ec8ff" o={0.14 * f} />)}
    <group position={[0.2, 0.82, 0.15]}><Bx s={[0.42, 0.2, 0.02]} c="#1f3f6a" ro={0.5} /><Pl w={0.4} h={0.18} p={[0, 0, 0.012]} map={plate("38°", "#1f3f6a", "#ffffff", 170)} c="#ffffff" ro={0.6} ns /></group>
  </S3>;
}}</Stage>;

// 7 · el budín de la señora Sutton: el cuchillo baja, la tajada se inclina y cae sobre el plato; banderita de palillo con $0
export const MPoundcake: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), kn = win(u, 0.12, 0.36), sl = win(u, 0.38, 0.56), fl = drop(u, 0.58, 0.72);
  return <S3 p={lv([0.1, 0.8, 1.45], [0.1, 0.72, 1.25], u)} l={[0, 0.2, 0]} fov={38} floor={null} warm="#ffe0b0">
    <Table w={4} d={3} tint="#d0b090" /><Wall w={6} z={-1.0} c="#efe4cf" />
    <Cy rt={0.42} rb={0.38} h={0.03} p={[0, 0.015, 0]} c="#fbfaf6" ro={0.25} />
    <To R={0.4} t={0.012} p={[0, 0.03, 0]} r={[Math.PI / 2, 0, 0]} c="#3a6a9a" ro={0.3} />
    <group position={[-0.08, 0.03, 0]}>
      <Bx s={[0.5, 0.2, 0.22]} p={[0, 0.1, 0]} c="#e6b864" ro={0.7} rad={0.03} />
      <Bx s={[0.5, 0.03, 0.22]} p={[0, 0.205, 0]} c="#9a5a22" ro={0.6} rad={0.012} />
      <Bx s={[0.012, 0.19, 0.2]} p={[0.252, 0.1, 0]} c="#f6dc94" ro={0.85} ns />
    </group>
    <group position={[0.26 + fl * 0.08, 0.03, 0]} rotation={[0, 0, -fl * 1.45]}>
      <group position={[0.03, 0, 0]}><Bx s={[0.06, 0.2, 0.22]} p={[0, 0.1, 0]} c="#f2d088" ro={0.8} rad={0.01} /><Bx s={[0.06, 0.03, 0.22]} p={[0, 0.205, 0]} c="#9a5a22" ro={0.6} /></group>
    </group>
    <group position={[0.205, 0.55 - kn * 0.36 - sl * 0.02, 0]} rotation={[0, 0, 0]}>
      <Bx s={[0.006, 0.26, 0.05]} p={[0, -0.02, 0]} c="#dfe3e6" m={1} ro={0.15} />
      <Bx s={[0.03, 0.18, 0.05]} p={[0, 0.2, 0]} c="#3a2618" ro={0.5} />
    </group>
    <group position={[-0.18, 0.2, 0.02]}><Cy rt={0.004} h={0.3} p={[0, 0.15, 0]} c="#e8d4a8" ro={0.8} />
      <Pl w={0.2} h={0.12} p={[0.1, 0.25, 0]} map={plate("$0", "#ffffff", "#1f8a4c", 190)} c="#ffffff" ro={0.7} side={2} ns /></group>
  </S3>;
}}</Stage>;

// 8 · el pasillo de filtros: en el estante de la ferretería hay doce cajas de medidas distintas y sale adelante, sola, la 16x25x1
const SZ = ["14x20x1", "16x20x1", "20x20x1", "20x25x1", "16x25x2", "14x25x1", "16x25x1", "20x30x1", "12x24x1", "18x24x1", "20x24x1", "24x24x1"];
export const MFilterwall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), pk = win(u, 0.42, 0.6), gl = win(u, 0.55, 0.7);
  return <S3 zk={1.15} p={lv([0.15, 1.0, 2.6], [0.1, 0.98, 2.1], u)} l={[0, 0.95, 0]} fov={40} floor={null} warm="#f4f6ff">
    <PhotoGround w={6} d={4} name="t_concreto.jpg" rep={1.4} tint="#b8b4ac" />
    <Env><Bx s={[2.8, 1.8, 0.04]} p={[0, 1.0, -0.4]} c="#3a5a8a" ro={0.6} />{[0.36, 0.98, 1.6].map((y) => <Bx key={y} s={[2.8, 0.03, 0.5]} p={[0, y - 0.02, -0.15]} c="#e8eaec" m={0.4} ro={0.4} />)}</Env>
    {SZ.map((s, i) => { const r = Math.floor(i / 6), c = i % 6, me = i === 6, x = -1.1 + c * 0.44, y = 0.36 + (1 - r) * 0.62 + 0.26, z = -0.15 + (me ? pk * 0.55 : 0);
      return <group key={i} position={[x, y + (me ? pk * 0.05 : 0), z]} rotation={[0, me ? -pk * 0.15 : 0, 0]}>
        <Bx s={[0.4, 0.5, 0.06]} c={me ? "#f4f2ea" : "#e4e0d6"} ro={0.75} rad={0.005} e={me ? "#ffe9a8" : undefined} ei={me ? gl * 0.35 : 0} />
        <PhotoPl w={0.36} h={0.3} name="t_aletas.jpg" p={[0, 0.03, 0.031]} tint="#e0dccc" rep={[1, 1]} />
        <Pl w={0.38} h={0.12} p={[0, -0.18, 0.032]} map={plate(s, me ? "#1f8a4c" : "#2a3a5a", "#ffffff", 74)} c="#ffffff" ro={0.6} ns />
      </group>; })}
  </S3>;
}}</Stage>;

// 9 · el registrador de papel: la pluma dibuja la temperatura del intercambiador: sube, el límite corta, baja, vuelve: un serrucho toda la noche
const chartTex = (sh: number) => canvasTex(`chart11d|${Math.round(sh * 60)}`, 1024, 512, (g) => {
  g.fillStyle = "#fbf8ef"; g.fillRect(0, 0, 1024, 512);
  g.fillStyle = "rgba(192,57,43,0.12)"; g.fillRect(0, 40, 1024, 90); g.fillStyle = "rgba(31,95,191,0.12)"; g.fillRect(0, 380, 1024, 90);
  g.strokeStyle = "rgba(120,140,160,0.35)"; g.lineWidth = 2; for (let x = 0; x < 1024; x += 64) { g.beginPath(); g.moveTo(x - (sh * 640) % 64, 0); g.lineTo(x - (sh * 640) % 64, 512); g.stroke(); }
  for (let y = 40; y < 512; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y); g.stroke(); }
  g.fillStyle = "#c0392b"; g.font = BOLD(56); g.textBaseline = "middle"; g.fillText("HOT · LIMIT", 24, 85); g.fillStyle = "#1f5fbf"; g.fillText("COLD AIR", 24, 425);
  g.strokeStyle = "#1c1c1c"; g.lineWidth = 9; g.lineJoin = "round"; g.beginPath();
  const W = 860 * cl(sh * 1.2);
  for (let x = 0; x <= W; x += 6) { const ph = ((x + 40) / 215) % 1, yv = ph < 0.6 ? 400 - (ph / 0.6) * 300 : 100 + ((ph - 0.6) / 0.4) * 300; x === 0 ? g.moveTo(x + 40, yv) : g.lineTo(x + 40, yv); }
  g.stroke();
});
export const MChartpen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), sh = win(u, 0.06, 0.86), W = 860 * cl(sh * 1.2), ph = ((W + 40) / 215) % 1, yv = ph < 0.6 ? 400 - (ph / 0.6) * 300 : 100 + ((ph - 0.6) / 0.4) * 300, on = ph < 0.6;
  const px = -0.8 + (W + 40) / 1024 * 1.6, py = 0.8 / 2 - yv / 512 * 0.8;
  return <S3 p={lv([0, 0.95, 2.0], [0, 0.92, 1.75], u)} l={[0, 0.85, 0]} fov={40} floor={null} warm="#fff2dc">
    <Table w={4} d={3} tint="#a08868" /><Wall w={6} z={-0.9} c="#cfc6b6" />
    <group position={[0, 0.85, 0]}>
      <Bx s={[1.8, 1.0, 0.14]} p={[0, 0, -0.08]} c="#3c4046" m={0.4} ro={0.45} rad={0.03} />
      <Pl w={1.6} h={0.8} p={[0, 0, 0.0]} map={chartTex(sh)} c="#ffffff" ro={0.8} ns />
      <Cy rt={0.05} h={1.66} p={[0, 0.43, 0.02]} r={[0, 0, Math.PI / 2]} c="#d0d2d4" m={0.8} ro={0.3} /><Cy rt={0.05} h={1.66} p={[0, -0.43, 0.02]} r={[0, 0, Math.PI / 2]} c="#d0d2d4" m={0.8} ro={0.3} />
      <group position={[px, py, 0.05]}><Bx s={[0.02, 0.36, 0.02]} p={[0.0, 0.18, 0]} r={[0, 0, -0.25]} c="#c9ccd0" m={1} ro={0.3} /><Sp rad={0.018} c="#1c1c1c" ro={0.3} /></group>
    </group>
    <group position={[0, 0.06, 0.3]}>
      <Bx s={[0.7, 0.06, 0.12]} p={[0, 0.03, 0]} c="#6a6e72" m={0.6} ro={0.4} />
      {[-0.24, -0.08, 0.08, 0.24].map((x, i) => on && sh > 0.02 ? <Flame key={i} p={[x, 0.06, 0]} s={0.8} u={tt + i} i={i} /> : null)}
    </group>
  </S3>;
}}</Stage>;

// 10 · el presupuesto roto: la hoja "NEW FURNACE $4,900" se rompe en dos, las mitades caen, y aterriza un filtro nuevo de $8
const quoteTex = canvasTex("quote11d", 512, 680, (g) => {
  g.fillStyle = "#fbfaf5"; g.fillRect(0, 0, 512, 680); g.fillStyle = "#2a3a5a"; g.fillRect(0, 0, 512, 90);
  g.fillStyle = "#fff"; g.font = BOLD(48); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("ESTIMATE", 256, 46);
  g.fillStyle = "#1c1c1c"; g.font = BOLD(68); g.fillText("NEW", 256, 200); g.fillText("FURNACE", 256, 280);
  g.fillStyle = "#c0392b"; g.font = BOLD(130); g.fillText("$4,900", 256, 450);
  g.fillStyle = "#9a9a9a"; for (let i = 0; i < 4; i++) g.fillRect(70, 540 + i * 30, 372 - i * 40, 8);
});
export const MTornquote: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), tr = win(u, 0.3, 0.42), fa = win(u, 0.42, 0.62), fl = drop(u, 0.58, 0.74), W = 0.62, HH = 0.82;
  const half = (sd: number) => <group position={[sd * (0.01 + tr * 0.06 + fa * 0.5), 0.75 - fa * fa * 0.9, 0.05 + fa * 0.2]} rotation={[fa * 0.6, 0, sd * (tr * 0.15 + fa * 1.2)]}>
    <Pl w={W / 2} h={HH} p={[sd * W / 4, 0, 0]} map={quoteTex} c="#ffffff" ro={0.85} side={2} ns sc={1} />
  </group>;
  return <S3 zk={1.22} p={lv([0, 0.85, 1.9], [0, 0.82, 1.6], u)} l={[0, 0.6, 0]} fov={40} floor={null} warm="#fff0dc">
    <Table w={4} d={3} tint="#b89878" /><Wall w={6} z={-0.8} c="#d4cab8" />
    {tr < 0.02 ? <group position={[0, 0.75, 0.05]}><Pl w={W} h={HH} map={quoteTex} c="#ffffff" ro={0.85} side={2} ns /></group> : <>{half(-1)}{half(1)}</>}
    <group position={[0, 0.0 + (1 - fl) * 1.4, 0.15]} rotation={[-0.2 * (1 - fl), 0.15, 0]}>
      <Bx s={[0.62, 0.05, 0.44]} p={[0, 0.025, 0]} c="#d8d0b8" ro={0.8} />
      <PhotoPl w={0.58} h={0.4} name="t_aletas.jpg" p={[0, 0.052, 0]} r={[-Math.PI / 2, 0, 0]} tint="#f4f0e4" rep={[1.4, 1]} />
      <group position={[0.2, 0.12, 0.2]} rotation={[-0.4, 0, 0]}><Pl w={0.24} h={0.14} map={plate("$8", "#1f8a4c", "#ffffff", 170)} c="#ffffff" ro={0.6} side={2} ns /></group>
    </group>
  </S3>;
}}</Stage>;

// 11 · la línea plana: en la pantalla verde la señal del sensor late 4 veces y se aplana; los quemadores de abajo se apagan con ella
const scopeTex = (k: number, rep: number) => canvasTex(`scope11d|${Math.round(k * 80)}|${rep}`, 1024, 600, (g) => {
  g.fillStyle = "#06140c"; g.fillRect(0, 0, 1024, 600); g.strokeStyle = "rgba(80,255,140,0.14)"; g.lineWidth = 2;
  for (let x = 0; x < 1024; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 600); g.stroke(); } for (let y = 0; y < 600; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y); g.stroke(); }
  g.strokeStyle = "#5cff9a"; g.lineWidth = 8; g.shadowColor = "#5cff9a"; g.shadowBlur = 18; g.beginPath();
  const W = 1000 * k; for (let x = 0; x <= W; x += 4) { const s = x / 180; const y = s < 4 ? 330 - 170 * Math.max(0, Math.sin((s % 1) * Math.PI)) ** 3 : 330; x === 0 ? g.moveTo(12, y) : g.lineTo(12 + x, y); }
  g.stroke(); g.shadowBlur = 0;
  g.fillStyle = "#5cff9a"; g.font = BOLD(90); g.textAlign = "left"; g.fillText(`${Math.min(4, Math.floor(k * 1000 / 180))} s`, 40, 100);
  if (k * 1000 > 760) { g.fillStyle = "#ff5a4a"; g.font = BOLD(80); g.fillText("NO FLAME", 560, 100); }
});
export const MFlatline: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.06, 0.82), lit = k * 1000 / 180 < 4 && k > 0.01;
  return <S3 zk={1.1} p={lv([0, 0.95, 2.05], [0, 0.92, 1.8], u)} l={[0, 0.82, 0]} fov={40} floor={null} warm="#e8fff0">
    <Table w={4} d={3} tint="#7a6a5a" /><Wall w={6} z={-0.9} c="#7a8088" />
    <group position={[0, 0.98, 0]}>
      <Bx s={[1.5, 0.98, 0.5]} p={[0, 0, -0.2]} c="#c8c2b0" ro={0.6} rad={0.05} />
      <Bx s={[1.26, 0.76, 0.02]} p={[0, 0.04, 0.05]} c="#101412" ro={0.2} />
      <Pl w={1.2} h={0.7} p={[0, 0.04, 0.062]} map={scopeTex(k, 0)} c="#ffffff" e="#5cff9a" ei={0.15} ro={0.2} ns />
      {[-0.5, -0.35].map((x) => <Cy key={x} rt={0.035} h={0.04} p={[x, -0.42, 0.06]} r={[Math.PI / 2, 0, 0]} c="#2b2d31" ro={0.4} />)}
    </group>
    <group position={[0, 0.04, 0.45]}>
      <Bx s={[0.9, 0.08, 0.14]} p={[0, 0.04, 0]} c="#6a6e72" m={0.6} ro={0.4} />
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => lit ? <Flame key={i} p={[x, 0.08, 0]} s={1.1} u={tt + i} i={i} /> : null)}
    </group>
  </S3>;
}}</Stage>;

// 12 · el parquímetro: entra la moneda, la aguja recorre 10 minutos y salta la bandera roja con $289
const meterTex = (k: number) => canvasTex(`meter11d|${Math.round(k * 30)}`, 512, 400, (g) => {
  g.fillStyle = "#f2efe6"; g.fillRect(0, 0, 512, 400); g.textAlign = "center"; g.textBaseline = "middle";
  g.strokeStyle = "#1c1c1c"; g.lineWidth = 6; g.beginPath(); g.arc(256, 330, 220, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  for (let m = 0; m <= 10; m++) { const a = Math.PI * (1.1 + 0.08 * m); g.lineWidth = m % 5 === 0 ? 8 : 4; g.beginPath(); g.moveTo(256 + Math.cos(a) * 220, 330 + Math.sin(a) * 220); g.lineTo(256 + Math.cos(a) * 185, 330 + Math.sin(a) * 185); g.stroke(); if (m % 5 === 0) { g.font = BOLD(60); g.fillStyle = "#1c1c1c"; g.fillText(String(m), 256 + Math.cos(a) * 140, 330 + Math.sin(a) * 140); } }
  g.font = BOLD(56); g.fillStyle = "#1c1c1c"; g.fillText("MIN", 256, 300);
  const a = Math.PI * (1.1 + 0.8 * k); g.strokeStyle = "#c0392b"; g.lineWidth = 10; g.beginPath(); g.moveTo(256, 330); g.lineTo(256 + Math.cos(a) * 200, 330 + Math.sin(a) * 200); g.stroke();
});
export const MParkmeter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), coin = win(u, 0.06, 0.2), k = win(u, 0.22, 0.62), fl = drop(u, 0.62, 0.74);
  return <S3 zk={1.1} p={lv([0, 1.15, 2.0], [0, 1.12, 1.75], u)} l={[0, 1.02, 0]} fov={40} floor={null} warm="#fff4e0">
    <PhotoGround w={5} d={4} name="t_concreto.jpg" rep={1.4} tint="#a8a49c" /><PhotoWall w={6} h={3} z={-1.2} name="t_ladrillo.jpg" tint="#b09080" />
    <Cy rt={0.05} h={0.8} p={[0, 0.4, 0]} c="#3a3d40" m={0.6} ro={0.4} />
    <group position={[0, 1.08, 0]}>
      <Bx s={[0.5, 0.52, 0.3]} c="#7a8a6a" m={0.5} ro={0.4} rad={0.08} />
      <Sp rad={0.25} p={[0, 0.2, 0]} sc={[1, 0.55, 0.62]} c="#7a8a6a" m={0.5} ro={0.4} />
      <Bx s={[0.42, 0.33, 0.02]} p={[0, 0.06, 0.155]} c="#101214" ro={0.2} />
      <Pl w={0.4} h={0.31} p={[0, 0.06, 0.168]} map={meterTex(k)} c="#ffffff" ro={0.5} ns />
      <Pl w={0.4} h={0.31} p={[0, 0.06, 0.172]} c="#d8eaf4" o={0.18} ro={0.05} ns />
      <Bx s={[0.12, 0.012, 0.02]} p={[0, -0.18, 0.16]} c="#0d0d0e" ro={0.3} ns />
      <group position={[0.0, 0.28 - (1 - fl) * 0.3, 0.17]}><Pl w={0.34} h={0.14} map={plate("$289", "#c0392b", "#ffffff", 150)} c="#ffffff" ro={0.5} side={2} ns /></group>
    </group>
    {coin < 1 && <group position={[0, 0.89 + (1 - coin) * 0.35, 0.18 + (1 - coin) * 0.1]} rotation={[0, 0, Math.PI / 2]}><Cy rt={0.045} h={0.008} r={[0, 0, 0]} c="#c9ccd0" m={1} ro={0.25} /></group>}
  </S3>;
}}</Stage>;

// 13 · la costra: la varilla del sensor frente a la llama azul se cubre de un polvillo blanco y la luz verde de la placa pasa a rojo
export const MCrustrod: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), cr = win(u, 0.14, 0.7), led = win(u, 0.6, 0.66);
  return <S3 p={lv([0.05, 0.62, 1.15], [0.05, 0.6, 0.95], u)} l={[0, 0.48, 0]} fov={38} floor={null} exp={0.85} warm="#dfe8ff">
    <PhotoGround w={4} d={3} name="t_chapa.jpg" rep={1.3} tint="#5a5e62" /><PhotoWall w={4} h={2} z={-0.6} name="t_chapa.jpg" tint="#4a4e52" />
    <Bx s={[0.9, 0.12, 0.2]} p={[0, 0.3, -0.1]} c="#6a6e72" m={0.6} ro={0.4} />
    {[-0.3, -0.1, 0.1, 0.3].map((x, i) => <Flame key={i} p={[x, 0.36, -0.08]} s={1.6} u={tt + i} i={i} />)}
    <group position={[0.36, 0.52, 0.06]}>
      <Bx s={[0.08, 0.14, 0.08]} p={[0.12, 0, 0]} c="#efe9da" ro={0.6} />
      <Cy rt={0.012} h={0.36} p={[-0.06, 0, 0]} r={[0, 0, Math.PI / 2 + 0.15]} c={mixc("#c9ccd0", "#e9e4d4", cr)} m={1 - cr * 0.85} ro={0.2 + cr * 0.7} />
      {Array.from({ length: 70 }, (_, i) => { const s = rnd(i, 1); return s < cr ? <Dot key={i} p={[-0.22 + rnd(i, 2) * 0.32, (rnd(i, 3) - 0.5) * 0.03 + (rnd(i, 2) - 0.5) * 0.05, (rnd(i, 4) - 0.5) * 0.026]} r={0.004 + 0.004 * rnd(i, 5)} c={rnd(i, 6) > 0.5 ? "#f4efe0" : "#b08a5a"} /> : null; })}
      <Tube pts={[[0.16, 0, 0], [0.3, 0.05, 0], [0.4, 0.2, 0.02]]} rad={0.006} c="#2a62c8" ro={0.5} />
    </group>
    <group position={[-0.5, 0.75, -0.2]}>
      <Bx s={[0.34, 0.24, 0.02]} c="#1f6a3a" ro={0.5} />
      <Sp rad={0.03} p={[0.08, 0.04, 0.02]} c={mixc("#3cd16a", "#ff3a2a", led)} e={mixc("#3cd16a", "#ff3a2a", led)} ei={2.4} ns />
      <Bx s={[0.08, 0.06, 0.02]} p={[-0.08, -0.05, 0.015]} c="#1c1c1c" ro={0.4} />
    </group>
  </S3>;
}}</Stage>;

// 14 · el dólar: el billete doblado sube y baja frotando la varilla; caen escamas blancas y la varilla vuelve a brillar
export const MDollarrub: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), rub = win(u, 0.12, 0.2) * (1 - win(u, 0.72, 0.8)), cl2 = win(u, 0.2, 0.7), x = 0.12 * Math.sin(tt * 9) * rub;
  return <S3 p={lv([0, 0.75, 1.25], [0, 0.72, 1.05], u)} l={[0, 0.55, 0]} fov={38} floor={null} warm="#fff2dc">
    <Table w={3} d={2} tint="#a88a6a" /><Wall w={5} z={-0.7} c="#d0c8b8" />
    <group position={[0, 0.55, 0]}>
      <Bx s={[0.1, 0.16, 0.1]} p={[0.36, 0, 0]} c="#efe9da" ro={0.6} />
      <Cy rt={0.016} h={0.6} p={[0.0, 0, 0]} r={[0, 0, Math.PI / 2]} c={mixc("#e2dcc8", "#d7dadd", cl2)} m={0.2 + 0.8 * cl2} ro={0.75 - 0.6 * cl2} />
      {Array.from({ length: 50 }, (_, i) => rnd(i, 1) > cl2 ? <Dot key={i} p={[-0.28 + rnd(i, 2) * 0.56, (rnd(i, 3) - 0.5) * 0.03, (rnd(i, 4) - 0.5) * 0.03]} r={0.005} c="#efe6d0" /> : null)}
      {Array.from({ length: 24 }, (_, i) => { const f = ((tt * 0.7 + rnd(i, 1)) % 1); return rub > 0.1 ? <Dot key={`f${i}`} p={[x - 0.06 + rnd(i, 2) * 0.12, -f * 0.5, 0.02 + rnd(i, 3) * 0.04]} r={0.005} c="#f4efe0" o={1 - f} /> : null; })}
      <Sp rad={0.05} p={[-0.3, 0, 0]} c="#ffffff" e="#ffffff" ei={2 * cl2 * win(u, 0.7, 0.8)} o={0.5 * win(u, 0.7, 0.8)} ns />
      <group position={[x - 0.02, 0, 0]}>
        <Pl w={0.3} h={0.13} p={[0, 0.03, 0.02]} r={[0.35, 0, 0]} map={billTex()} c="#ffffff" ro={0.85} side={2} ns />
        <Pl w={0.3} h={0.13} p={[0, -0.03, 0.02]} r={[-0.35, 0, 0]} map={billTex()} c="#ffffff" ro={0.85} side={2} ns />
        <group position={[0.02, 0.0, 0.16]} rotation={[0, 0.2, -Math.PI / 2]}><Hand s={1.2} curl={0.85} sleeve="#55606a" /></group>
      </group>
    </group>
  </S3>;
}}</Stage>;

// 15 · el bolsillo: el fajo con la faja de $289 baja y se mete en el bolsillo trasero del jean
const denimTex = canvasTex("denim11d", 512, 512, (g) => {
  g.fillStyle = "#2f4a72"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 900; i++) { g.strokeStyle = `rgba(${rnd(i, 1) > 0.5 ? "200,214,236" : "20,32,56"},${0.08 + 0.1 * rnd(i, 2)})`; g.lineWidth = 1.5; const x = rnd(i, 3) * 512, y = rnd(i, 4) * 512; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 10, y + 10); g.stroke(); }
});
const pocketTex = canvasTex("pocket11d", 512, 560, (g) => {
  g.drawImage(denimTex.image as CanvasImageSource, 0, 0, 512, 560);
  g.strokeStyle = "#e0a040"; g.lineWidth = 6; g.setLineDash([16, 10]);
  g.beginPath(); g.moveTo(24, 30); g.lineTo(24, 400); g.lineTo(256, 530); g.lineTo(488, 400); g.lineTo(488, 30); g.stroke();
  g.beginPath(); g.moveTo(24, 58); g.lineTo(488, 58); g.stroke();
});
export const MJeanspocket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.12, 0.6), y = lerp(0.95, 0.42, k);
  return <S3 zk={1.2} p={lv([0, 0.62, 1.5], [0, 0.6, 1.3], u)} l={[0, 0.5, 0]} fov={38} floor={null} warm="#fff0d8">
    <Env><Bx s={[1.6, 1.4, 0.1]} p={[0, 0.5, -0.06]} c="#2f4a72" ro={0.9} /><Pl w={1.6} h={1.4} p={[0, 0.5, -0.008]} map={denimTex} c="#ffffff" ro={0.95} ns /></Env>
    <group position={[0, y, 0.0]}>
      <Bx s={[0.42, 0.04, 0.2]} p={[0, 0, 0]} r={[Math.PI / 2, 0, 0]} c="#cfd6c0" ro={0.85} />
      <Pl w={0.42} h={0.2} p={[0, 0, 0.022]} map={billTex("100")} c="#ffffff" ro={0.85} ns />
      <Bx s={[0.1, 0.22, 0.05]} p={[0, 0, 0.0]} c="#f2efe2" ro={0.7} ns />
      <Pl w={0.1} h={0.2} p={[0, 0, 0.027]} map={plate("$289", "#f2efe2", "#1c1c1c", 70, 512, 256)} c="#ffffff" r={[0, 0, Math.PI / 2]} ro={0.6} ns />
    </group>
    <group position={[0, 0.42, 0.04]}><Bx s={[0.6, 0.62, 0.02]} c="#2f4a72" ro={0.9} /><Pl w={0.6} h={0.66} p={[0, 0, 0.012]} map={pocketTex} c="#ffffff" ro={0.95} ns /></group>
  </S3>;
}}</Stage>;

// 16 · el cuadro del señor Reese: el marco cae desde arriba, engancha el clavo sobre el furnace y se balancea hasta quedar derecho
const frameIn = canvasTex("framein11d", 640, 480, (g) => {
  g.fillStyle = "#efe6cc"; g.fillRect(0, 0, 640, 480);
  g.save(); g.translate(320, 190); g.rotate(-0.04); g.drawImage(billTex().image as CanvasImageSource, -230, -98, 460, 196); g.restore();
  g.fillStyle = "#2a2622"; g.font = HANDF(58); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("Marcus fixed it", 320, 360); g.fillText("with this", 320, 420);
});
export const MFramedbill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = drop(u, 0.08, 0.3), sw = bump(u, 0.3, 14, 4) * 0.22;
  return <S3 p={lv([0, 1.25, 2.1], [0, 1.25, 1.75], u)} l={[0, 1.15, 0]} fov={40} floor={null} warm="#ffe4c0">
    <PhotoGround w={5} d={4} name="t_concreto.jpg" rep={1.2} tint="#7a746c" /><Wall w={6} z={-0.4} c="#d8cdb8" />
    <Furnace p={[0, 0, 0]} s={0.75} />
    <Bx s={[0.02, 0.02, 0.06]} p={[0, 1.66, -0.37]} c="#8a8a8a" m={1} ro={0.3} ns />
    <group position={[0, 1.66 + (1 - k) * 1.0, -0.36]} rotation={[0, 0, sw]}>
      <Tube pts={[[-0.22, -0.12, 0.01], [0, 0.0, 0.01], [0.22, -0.12, 0.01]]} rad={0.003} c="#9a8a6a" />
      <group position={[0, -0.36, 0]}>
        <Bx s={[0.74, 0.58, 0.04]} c="#5a3a1e" ro={0.45} rad={0.01} />
        <Pl w={0.64} h={0.48} p={[0, 0, 0.022]} map={frameIn} c="#ffffff" ro={0.7} ns />
        <Pl w={0.64} h={0.48} p={[0, 0, 0.026]} c="#eaf2f8" o={0.12} ro={0.05} ns />
      </group>
    </group>
  </S3>;
}}</Stage>;
