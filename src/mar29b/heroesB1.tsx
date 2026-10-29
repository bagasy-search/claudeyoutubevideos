// mar29b · componentes únicos 1-16, en 3D de verdad (three.js, kit r3k: luz con sombra suave, reflejos, ACES) sobre la foto desenfocada del momento.
// La acción se reparte en TODO el plano (u = 0..1) para que entrada, medio y salida sean distintos. Mecanismos que no están en mar29a (ver D:/rtmp/mar29_COMPONENTES.md).
import React from "react";
import { H, Stage } from "./hkit";
import { BLOCKS, BOLD, Bx, Cy, D2R, Dot, Flame, HANDF, MONO, PLANKS, PLASTER, Pl, Puff, S3, Sp, To, Tube, Txt, V3, canvasTex, cl, drop, lerp, lv, rnd, win } from "../kits/r3k/r3k";

const dur = (h: H) => h.out - h.at;
const U = (tt: number, h: H) => cl(tt / dur(h));
const STEEL = { c: "#b9c0c7", m: 0.75, ro: 0.32 };
// pantalla de 7 segmentos / LCD: texto que cambia en pasos (una textura por valor)
const lcd = (txt: string, fg = "#ff3b2f", bg = "#120606", w = 512, hh = 200, px = 150) => canvasTex(`lcd|${txt}|${fg}|${bg}|${w}`, w, hh, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, hh); g.fillStyle = fg; g.font = MONO(px); g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = fg; g.shadowBlur = 18; g.fillText(txt, w / 2, hh / 2 + 6); });

// 1 · dolor de cabeza: la mesa de luz a las 2 de la mañana; la cabeza en la almohada y anillos rojos que laten desde la frente
export const HHeadache: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), beat = (u * 9) % 1, ache = win(u, 0.15, 0.45);
  return <S3 p={lv([0.7, 0.95, 1.35], [0.35, 0.85, 1.0], win(u, 0, 1))} l={[-0.25, 0.6, -0.15]} fov={38} floor="wood" env={0.25} exp={0.8} warm="#9fb4ff">
    <Bx s={[1.6, 0.36, 1.2]} p={[0.35, 0.18, -0.2]} c="#d9d4e4" ro={0.9} rad={0.08} />
    <Bx s={[0.62, 0.16, 0.42]} p={[-0.05, 0.44, -0.2]} c="#f1eef6" ro={0.95} rad={0.08} />
    <group position={[0.02, 0.62, -0.2]} rotation={[0, 0, -1.35]}>
      <Sp rad={0.15} sc={[1, 1.18, 1.05]} c="#8a5a40" ro={0.65} />
      <Sp rad={0.155} p={[0, 0.06, -0.03]} sc={[1.02, 1.0, 1.05]} c="#b0b0b0" ro={0.95} />
      <Sp rad={0.05} p={[0.0, -0.06, 0.13]} sc={[1.2, 0.5, 0.6]} c="#c8c8c8" ro={0.95} />
      <Sp rad={0.03} p={[0, -0.02, 0.15]} c="#b88e74" ro={0.7} />
    </group>
    {Array.from({ length: 4 }, (_, i) => { const ph = (beat + i / 4) % 1; return <To key={i} R={0.06 + ph * 0.3} t={0.012} p={[-0.06, 0.82, -0.1]} r={[0.2, 0.9, 0]} c="#ff3a2a" e="#ff2a1a" ei={1.4} o={ache * 0.8 * (1 - ph)} />; })}
    <Bx s={[0.5, 0.55, 0.45]} p={[-0.85, 0.275, -0.15]} c="#6a4a30" ro={0.6} rad={0.02} />
    <Bx s={[0.3, 0.14, 0.12]} p={[-0.85, 0.62, -0.05]} c="#16171a" ro={0.4} rad={0.02} />
    <Pl w={0.26} h={0.1} p={[-0.85, 0.62, 0.011]} map={lcd(u < 0.08 ? "1:59" : "2:00")} c="#ffffff" e="#ff3b2f" ei={0.6} ns />
    <pointLight position={[-0.85, 0.64, 0.3]} intensity={0.9} distance={1.2} color="#ff4030" />
    <pointLight position={[-0.06, 0.82, 0.2]} intensity={1.6 * ache * (1 - beat)} distance={1.0} color="#ff3020" />
  </S3>;
}}</Stage>;

// 2 · el colgante de la puerta: se balancea en el picaporte con la oferta de $49.99, se da vuelta solo y del otro lado está la llave inglesa
const hangerF = () => canvasTex("hangF", 360, 900, (g) => { g.fillStyle = "#f6d24a"; g.fillRect(0, 0, 360, 900); g.fillStyle = "#fff"; g.beginPath(); g.arc(180, 130, 78, 0, Math.PI * 2); g.fill(); g.fillStyle = "#1d1d1d"; g.font = BOLD(64); g.textAlign = "center"; g.fillText("TUNE-UP", 180, 360); g.font = BOLD(104); g.fillStyle = "#c62828"; g.fillText("$49", 180, 520); g.font = BOLD(56); g.fillText(".99", 180, 590); g.fillStyle = "#1d1d1d"; g.font = BOLD(40); g.fillText("CALL TODAY", 180, 760); });
const hangerB = () => canvasTex("hangB", 360, 900, (g) => { g.fillStyle = "#2b2e33"; g.fillRect(0, 0, 360, 900); g.fillStyle = "#fff"; g.beginPath(); g.arc(180, 130, 78, 0, Math.PI * 2); g.fill();
  g.save(); g.translate(180, 520); g.rotate(-0.6); g.fillStyle = "#d8dde2"; g.fillRect(-26, -200, 52, 330); g.beginPath(); g.arc(0, -220, 80, 0, Math.PI * 2); g.fill(); g.fillStyle = "#2b2e33"; g.fillRect(-30, -320, 60, 110); g.restore();
  g.fillStyle = "#ff6a4a"; g.font = BOLD(56); g.textAlign = "center"; g.fillText("+ UPSELL", 180, 820); });
export const HDoorhanger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), sw = Math.sin(u * 16) * 0.32 * Math.exp(-u * 3), fl = win(u, 0.48, 0.66);
  return <S3 p={lv([0.7, 1.15, 1.7], [0.3, 1.0, 1.15], win(u, 0, 1))} l={[0, 0.85, 0]} fov={36} floor="wood">
    <mesh position={[0, 1.2, -0.03]} receiveShadow><planeGeometry args={[1.0, 2.4]} /><meshStandardMaterial map={PLANKS()} color="#c9a27a" roughness={0.6} /></mesh>
    <Bx s={[0.08, 2.4, 0.08]} p={[-0.54, 1.2, 0]} c="#efe9dc" ro={0.6} /><Bx s={[0.08, 2.4, 0.08]} p={[0.54, 1.2, 0]} c="#efe9dc" ro={0.6} />
    <Bx s={[0.07, 0.2, 0.02]} p={[0.32, 1.02, 0.0]} c="#b08a3e" m={0.9} ro={0.25} />
    <Cy rt={0.012} h={0.08} p={[0.32, 1.02, 0.04]} r={[Math.PI / 2, 0, 0]} c="#b08a3e" m={0.9} ro={0.25} />
    <Sp rad={0.05} p={[0.32, 1.02, 0.09]} c="#c99a46" m={0.95} ro={0.2} />
    <group position={[0.32, 1.02, 0.07]} rotation={[0, fl * Math.PI, sw]}>
      <Pl w={0.17} h={0.42} p={[0, -0.17, 0.004]} map={hangerF()} c="#ffffff" ro={0.75} />
      <Pl w={0.17} h={0.42} p={[0, -0.17, -0.004]} r={[0, Math.PI, 0]} map={hangerB()} c="#ffffff" ro={0.75} />
    </group>
  </S3>;
}}</Stage>;

// 3 · el tester: las puntas tocan los bornes del capacitor; la pantalla corre de 0 a 44.6 y queda al lado del 45 µF impreso: coinciden y ambos se prenden verde
const capLab = () => canvasTex("capLab", 512, 512, (g) => { g.fillStyle = "#d8dde2"; g.fillRect(0, 0, 512, 512); g.fillStyle = "#1b2a48"; g.fillRect(0, 150, 512, 230); g.fillStyle = "#fff"; g.font = BOLD(150); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("45 µF", 256, 268); });
export const HMeter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), touch = win(u, 0.08, 0.25), run = win(u, 0.28, 0.62), v = run < 1 ? Math.round(446 * run * (0.9 + 0.1 * run)) / 10 : 44.6, ok = u > 0.64;
  const pr = (x: number): V3 => [x, lerp(0.75, 0.56, touch), lerp(0.2, 0.02, touch)];
  return <S3 p={lv([0.15, 1.0, 1.8], [0.05, 0.85, 1.3], win(u, 0, 1))} l={[0.05, 0.4, 0]} fov={36}>
    <Cy rt={0.17} h={0.48} p={[-0.3, 0.24, 0]} c="#d8dde2" m={0.6} ro={0.35} seg={48} />
    <mesh position={[-0.3, 0.24, 0]} rotation={[0, -0.3, 0]}><cylinderGeometry args={[0.172, 0.172, 0.32, 48, 1, true, -0.8, 1.6]} /><meshStandardMaterial map={capLab()} roughness={0.5} /></mesh>
    {[-0.36, -0.24].map((x, i) => <Cy key={i} rt={0.018} h={0.06} p={[x, 0.51, 0]} c="#d0a24a" m={0.9} ro={0.25} />)}
    {ok && <pointLight position={[-0.3, 0.3, 0.4]} intensity={1.8} distance={1.2} color="#46ff8a" />}
    <group position={[0.38, 0.3, 0.05]} rotation={[-0.25, -0.35, 0]}>
      <Bx s={[0.36, 0.56, 0.08]} c="#f2c230" ro={0.5} rad={0.04} />
      <Bx s={[0.28, 0.16, 0.02]} p={[0, 0.14, 0.04]} c="#101410" ro={0.3} />
      <Pl w={0.26} h={0.13} p={[0, 0.14, 0.052]} map={lcd(v.toFixed(1), ok ? "#5dff9a" : "#e6f2d8", "#0e140e")} c="#ffffff" e={ok ? "#3dff8a" : "#9ab08a"} ei={0.5} ns />
      <Cy rt={0.07} h={0.03} p={[0, -0.1, 0.045]} r={[Math.PI / 2, 0, 0]} c="#2a2c30" m={0.4} />
    </group>
    <Tube pts={[[0.3, 0.06, 0.1], [0.05, 0.2, 0.25], pr(-0.36)]} rad={0.008} c="#c62828" ro={0.5} />
    <Tube pts={[[0.44, 0.06, 0.1], [0.1, 0.3, 0.3], pr(-0.24)]} rad={0.008} c="#1b1b1b" ro={0.5} />
    {ok && <Txt t="MATCH" w={0.34} c="#7dffb0" e={0.6} p={[0.0, 0.92, 0]} />}
  </S3>;
}}</Stage>;

// 4 · el frasco: cae una moneda por mes (12 meses) y el frasco se llena; la etiqueta de precio sube $15 en cada golpe hasta $180
export const HJar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), N = 12, land = (i: number) => 0.06 + i * 0.06, got = Array.from({ length: N }, (_, i) => u > land(i) + 0.05).filter(Boolean).length;
  return <S3 p={lv([0.6, 0.95, 1.9], [0.3, 0.8, 1.35], win(u, 0, 1))} l={[0.05, 0.35, 0]} fov={36}>
    <Cy rt={0.2} rb={0.19} h={0.5} p={[-0.1, 0.25, 0]} c="#e9f3f6" ro={0.03} m={0.05} o={0.24} open seg={48} />
    <Cy rt={0.19} h={0.012} p={[-0.1, 0.006, 0]} c="#e9f3f6" ro={0.05} o={0.4} />
    <To R={0.2} t={0.014} p={[-0.1, 0.5, 0]} r={[Math.PI / 2, 0, 0]} c="#e9f3f6" ro={0.05} o={0.55} />
    {Array.from({ length: N }, (_, i) => { const k = cl((u - land(i)) / 0.05); if (k <= 0) return null;
      const end: V3 = [-0.1 + Math.cos(i * 2.3) * 0.08, 0.016 + i * 0.011, Math.sin(i * 2.3) * 0.06];
      const p: V3 = k < 1 ? [lerp(-0.1, end[0], k), lerp(0.95, end[1], k * k), lerp(0, end[2], k)] : end;
      return <Cy key={i} rt={0.06} h={0.01} p={p} r={k < 1 ? [k * 7, 0, k * 3] : [rnd(i) * 0.15, 0, rnd(i, 2) * 0.15]} c="#d6ae4c" m={0.95} ro={0.25} />; })}
    {Array.from({ length: N }, (_, i) => { const k = cl((u - land(i) - 0.05) / 0.06); return k > 0 && k < 1 ? <Dot key={`s${i}`} p={[-0.1, 0.05 + i * 0.011 + k * 0.08, 0.2]} r={0.01} c="#fff2b0" add o={1 - k} /> : null; })}
    <group position={[0.35, 0.42, 0.05]} rotation={[0, -0.25, Math.sin(u * 30) * 0.03]}>
      <Bx s={[0.38, 0.2, 0.012]} c="#f1e6c8" ro={0.8} rad={0.01} />
      <Txt t={`$${got * 15}`} w={0.3} c="#2a2620" p={[0, 0, 0.008]} />
    </group>
    <Tube pts={[[0.2, 0.47, 0.03], [0.1, 0.52, 0.02], [-0.02, 0.5, 0.0]]} rad={0.003} c="#d8d2c4" seg={10} />
  </S3>;
}}</Stage>;

// 5 · la frase que más asusta: en el presupuesto impreso sobre la mesa, el resaltador amarillo pasa por «HEAT EXCHANGER — CRACKED» y la cámara se acerca a ese renglón
const quoteT = () => canvasTex("quote5", 820, 1060, (g) => { g.fillStyle = "#fbfaf4"; g.fillRect(0, 0, 820, 1060); g.fillStyle = "#26231e"; g.font = BOLD(64); g.fillText("ESTIMATE", 60, 110); g.fillRect(60, 140, 700, 6);
  g.font = BOLD(44); [["Filter", "$12"], ["Igniter check", "$0"], ["HEAT EXCHANGER", ""], ["Labor", "$180"]].forEach(([a, b], i) => { g.fillText(a, 60, 250 + i * 150); g.textAlign = "right"; g.fillText(b, 760, 250 + i * 150); g.textAlign = "left"; });
  g.fillStyle = "#c62828"; g.font = BOLD(60); g.fillText("CRACKED", 60, 610); g.fillStyle = "#26231e"; g.font = BOLD(56); g.fillText("TOTAL  $4,800", 60, 960); });
export const HHighlighter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), sw = win(u, 0.2, 0.55), up = win(u, 0.6, 0.75), LY = 0.035;
  const hx = lerp(-0.3, 0.32, sw), hy = 0.06 + 0.12 * (1 - win(u, 0.12, 0.2)) + up * 0.25;
  return <S3 p={lv([0.1, 1.15, 1.2], [0.0, 0.62, 0.42], win(u, 0.05, 0.95))} l={lv([0, 0, 0], [0, 0, LY], win(u, 0.05, 0.95))} fov={38} floor="wood">
    <Pl w={0.82} h={1.06} p={[0, 0.003, 0]} r={[-Math.PI / 2, 0, 0.04]} map={quoteT()} c="#ffffff" ro={0.85} />
    <Pl w={0.62 * sw + 0.001} h={0.075} p={[-0.32 + 0.31 * sw, 0.005, LY]} r={[-Math.PI / 2, 0, 0.04]} c="#fff12a" o={0.55} ro={0.6} ns />
    <group position={[hx, hy, LY + 0.02]} rotation={[0, 0.2, -0.9]}>
      <Cy rt={0.026} h={0.26} p={[0, 0.13, 0]} c="#fff04a" ro={0.4} />
      <Cy rt={0.027} h={0.08} p={[0, 0.3, 0]} c="#3a3d42" ro={0.4} />
      <Bx s={[0.03, 0.04, 0.01]} p={[0, -0.01, 0]} c="#f4e23a" ro={0.4} />
    </group>
  </S3>;
}}</Stage>;

// 6 · la cámara de combustión en corte: fuego y humo de un lado, el aire de la casa del otro, y una pared de acero que no deja pasar nada
export const HChamber: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), fire = win(u, 0.05, 0.25), wall = win(u, 0.55, 0.7);
  return <S3 p={lv([0.3, 1.2, 2.4], [0.1, 0.95, 1.9], win(u, 0, 1))} l={[0, 0.55, 0]} fov={38} floor="conc">
    <Bx s={[1.5, 0.05, 0.6]} p={[0, 0.025, 0]} {...STEEL} /><Bx s={[1.5, 0.05, 0.6]} p={[0, 1.1, 0]} {...STEEL} />
    <Bx s={[1.5, 1.1, 0.03]} p={[0, 0.55, -0.3]} c="#8d949c" m={0.6} ro={0.4} />
    <Bx s={[0.06, 1.05, 0.6]} p={[0, 0.55, 0]} c="#c0c6cc" m={0.85} ro={0.22} e="#5aa0ff" ei={0.25 * wall} />
    {Array.from({ length: 5 }, (_, i) => <group key={i} scale={[1, fire, 1]} position={[-0.6 + i * 0.12, 0.06, 0]}><Flame p={[0, 0, 0]} s={1.6} u={u} i={i} warm={0.6} /></group>)}
    <pointLight position={[-0.4, 0.35, 0.3]} intensity={2.4 * fire} distance={1.4} color="#ff8a40" />
    {Array.from({ length: 12 }, (_, i) => { const ph = (u * 1.5 + i / 12) % 1, x = -0.65 + rnd(i) * 0.5 + ph * 0.18; return <Puff key={i} p={[Math.min(-0.08, x), 0.3 + ph * 0.75, (rnd(i, 2) - 0.5) * 0.3]} s={0.22 + ph * 0.2} c="#5a5650" add={false} o={0.55 * Math.sin(ph * Math.PI) * fire} />; })}
    {Array.from({ length: 30 }, (_, i) => { const ph = (u * 1.2 + i / 30) % 1; return <Dot key={i} p={[0.15 + rnd(i) * 0.55, 0.1 + ((rnd(i, 2) + ph) % 1) * 0.95, (rnd(i, 3) - 0.5) * 0.4]} r={0.016} st={[1, 2.4, 1]} c="#9fd2ff" add o={0.8} />; })}
    <pointLight position={[0.4, 0.6, 0.4]} intensity={1.2} distance={1.3} color="#8fc4ff" />
    <group position={[-0.4, 1.28, 0.2]}><Txt t="FIRE" w={0.3} c="#ffb37a" /></group>
    <group position={[0.42, 1.28, 0.2]}><Txt t="YOUR AIR" w={0.42} c="#a8d8ff" /></group>
  </S3>;
}}</Stage>;

// 7 · la cámara en el cable: el cuello de ganso se mete por la mirilla con su lucecita; en el monitor de mano aparece la costura de adentro
const scopeT = (k: number) => canvasTex(`scope${k}`, 512, 384, (g) => { g.fillStyle = "#0b0d10"; g.fillRect(0, 0, 512, 384); const r = g.createRadialGradient(256, 192, 10, 256, 192, 230); r.addColorStop(0, "#9aa3ad"); r.addColorStop(0.6, "#4a5058"); r.addColorStop(1, "#0b0d10"); g.fillStyle = r; g.fillRect(0, 0, 512, 384);
  g.strokeStyle = "#2a2e33"; g.lineWidth = 16; g.beginPath(); g.moveTo(40 + k * 30, 0); g.bezierCurveTo(200, 140, 260, 220, 470 - k * 20, 384); g.stroke(); g.fillStyle = "#c8ccd0"; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(70 + k * 30 + i * 46, 30 + i * 42, 7, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = "#ff3b2f"; g.beginPath(); g.arc(30, 30, 9, 0, Math.PI * 2); g.fill(); g.fillStyle = "#fff"; g.font = MONO(26); g.fillText("REC", 48, 40); if (k >= 3) { g.strokeStyle = "#ff3b2f"; g.lineWidth = 7; g.beginPath(); g.moveTo(150, 170); g.lineTo(200, 200); g.lineTo(240, 185); g.lineTo(300, 230); g.lineTo(350, 215); g.stroke(); g.lineWidth = 5; g.beginPath(); g.ellipse(250, 200, 130, 60, 0.2, 0, Math.PI * 2); g.stroke(); } });
export const HScope: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), go = win(u, 0.05, 0.5), on = win(u, 0.42, 0.55);
  const tip: V3 = lv([0.9, 0.95, 0.6], [0.02, 0.55, 0.06], go), mid: V3 = [lerp(1.2, 0.45, go), lerp(0.7, 0.85, go), lerp(0.9, 0.5, go)];
  return <S3 p={lv([0.6, 1.0, 2.1], [0.75, 0.75, 1.25], win(u, 0, 1))} l={lv([0.15, 0.55, 0], [0.55, 0.6, 0.35], win(u, 0.3, 0.8))} fov={38} floor="conc">
    <Bx s={[1.0, 1.1, 0.04]} p={[-0.2, 0.55, -0.02]} c="#d6d0c1" ro={0.45} m={0.15} />
    <Cy rt={0.06} h={0.03} p={[0, 0.55, 0.0]} r={[Math.PI / 2, 0, 0]} c="#050505" ro={0.9} />
    <Tube pts={[[1.2, 0.2, 0.5], [1.25, 0.5, 0.8], mid, tip]} rad={0.012} c="#1b1d20" ro={0.4} />
    <Cy rt={0.018} h={0.06} p={tip} r={[Math.PI / 2, 0, 0]} c="#9aa0a7" m={0.9} ro={0.2} />
    <Sp rad={0.01} p={[tip[0], tip[1], tip[2] - 0.035]} c="#ffffff" e="#fff4d0" ei={3} ns />
    <group position={[0.6, 0.6, 0.4]} rotation={[-0.1, -0.25, 0.04]} scale={[1.5, 1.5, 1.5]}>
      <Bx s={[0.42, 0.34, 0.05]} c="#2b2d31" ro={0.45} rad={0.03} />
      <Pl w={0.36} h={0.27} p={[0, 0.0, 0.027]} map={on > 0.5 ? scopeT(Math.min(4, Math.floor(win(u, 0.55, 1) * 5))) : lcd("", "#000", "#0b0d10")} c="#ffffff" e="#ffffff" ei={0.35 * on} ns />
      <Bx s={[0.1, 0.2, 0.06]} p={[0, -0.25, 0]} c="#f2c230" ro={0.5} rad={0.02} />
    </group>
  </S3>;
}}</Stage>;

// 8 · la tarjeta roja: el técnico la ata al caño del gas y queda balanceándose; de atrás se desliza el presupuesto de $7,800
const redTag = () => canvasTex("redtag8", 400, 640, (g) => { g.fillStyle = "#c62828"; g.fillRect(0, 0, 400, 640); g.fillStyle = "#fff"; g.beginPath(); g.arc(200, 70, 36, 0, Math.PI * 2); g.fill(); g.font = BOLD(86); g.textAlign = "center"; g.fillText("DO NOT", 200, 260); g.fillText("USE", 200, 360); g.fillRect(40, 420, 320, 8); g.font = BOLD(44); g.fillText("UNSAFE", 200, 520); });
const quote8 = () => canvasTex("quote8", 600, 400, (g) => { g.fillStyle = "#fbfaf4"; g.fillRect(0, 0, 600, 400); g.fillStyle = "#26231e"; g.font = BOLD(54); g.fillText("NEW FURNACE", 40, 100); g.fillRect(40, 130, 520, 5); g.fillStyle = "#c62828"; g.font = BOLD(140); g.fillText("$7,800", 40, 320); });
export const HRedtag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), hang = drop(u, 0.05, 0.3), sw = Math.sin(u * 14) * 0.25 * Math.exp(-u * 2.5), q = win(u, 0.5, 0.78);
  return <S3 p={lv([0.6, 1.25, 1.9], [0.25, 1.1, 1.3], win(u, 0, 1))} l={[0.05, 0.9, 0]} fov={36} floor="conc">
    <mesh position={[0, 1.4, -0.25]} receiveShadow><planeGeometry args={[4, 3]} /><meshStandardMaterial map={BLOCKS()} roughness={0.95} /></mesh>
    <Cy rt={0.035} h={1.8} p={[0, 1.2, 0]} r={[0, 0, Math.PI / 2]} c="#e2b320" m={0.5} ro={0.4} />
    <Bx s={[0.1, 0.1, 0.1]} p={[0.35, 1.2, 0]} c="#e2b320" m={0.5} ro={0.4} />
    <Bx s={[0.2, 0.04, 0.04]} p={[0.35, 1.29, 0.0]} r={[0, 0, 0.1]} c="#d22a24" ro={0.4} rad={0.01} />
    <To R={0.045} t={0.004} p={[-0.1, 1.2, 0]} r={[0, Math.PI / 2, 0]} c="#cfd3d6" m={0.9} ro={0.3} />
    <group position={[-0.1, lerp(1.9, 1.16, hang), 0.04]} rotation={[0, 0.1, sw]}>
      <Pl w={0.22} h={0.36} p={[0, -0.2, 0]} map={redTag()} c="#ffffff" ro={0.8} />
    </group>
    <group position={[lerp(-0.1, -0.45, q), lerp(1.0, 0.72, q), lerp(0.0, 0.25, q)]} rotation={[0, 0.2 * q, lerp(0, -0.12, q)]}>
      <Pl w={0.42} h={0.28} map={quote8()} c="#ffffff" ro={0.85} o={q > 0.02 ? 0.999 : 0} />
    </group>
  </S3>;
}}</Stage>;

// 9 · la lupa sobre la chapa del intercambiador: el aro de bronce avanza; adentro del vidrio la costura de fábrica se ve grande, recta y limpia (no hay grieta)
const seamT = () => canvasTex("seam9", 512, 512, (g) => { g.fillStyle = "#8d949c"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${rnd(i) > 0.5 ? "255,255,255" : "20,20,20"},${0.04 + rnd(i, 2) * 0.05})`; g.fillRect(rnd(i, 3) * 512, rnd(i, 4) * 512, 6, 1); }
  g.fillStyle = "#5c636b"; g.fillRect(0, 236, 512, 40); for (let x = 0; x < 512; x += 24) { g.fillStyle = "#b0b7be"; g.beginPath(); g.ellipse(x + 12, 256, 12, 18, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = "#6a7178"; g.beginPath(); g.ellipse(x + 14, 260, 6, 9, 0, 0, Math.PI * 2); g.fill(); } });
export const HLoupe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), mv = win(u, 0.1, 0.85), lx = lerp(-0.45, 0.42, mv), ly = 0.002, R = 0.17;
  const tx = seamT(), mag = canvasTex("seam9m", 4, 4, () => {}); mag.image = tx.image; mag.wrapS = mag.wrapT = 1000; mag.repeat.set(0.35, 0.35); mag.offset.set((lx + 0.9) / 1.8 * 0.65 + 0.01, 0.33); mag.needsUpdate = true;
  return <S3 p={lv([0.2, 0.95, 1.1], [0.1, 0.75, 0.75], win(u, 0, 1))} l={[lx * 0.6, 0, 0.0]} fov={38} floor={null}>
    <Pl w={1.8} h={1.2} p={[0, 0, 0]} r={[-Math.PI / 2, 0, 0]} map={tx} c="#ffffff" m={0.7} ro={0.4} />
    <group position={[lx, 0.09, ly]}>
      <mesh position={[0, -0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[R, 48]} /><meshStandardMaterial map={mag} m={0.7} roughness={0.35} /></mesh>
      <To R={R} t={0.018} p={[0, -0.07, 0]} r={[Math.PI / 2, 0, 0]} c="#b8893a" m={0.95} ro={0.25} />
      <mesh position={[0, -0.068, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[R, 48]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.12} roughness={0} clearcoat={1} /></mesh>
      <Cy rt={0.022} h={0.32} p={[0.3, -0.06, 0.12]} r={[Math.PI / 2, 0, -1.0]} c="#3a2618" ro={0.5} />
    </group>
    <spotLight position={[lx - 0.4, 0.9, 0.5]} angle={0.4} penumbra={0.7} intensity={10} distance={3} color="#fff0d8" />
  </S3>;
}}</Stage>;

// 10 · la fórmula: dos placas caen sobre la balanza de la regla (edad × costo) y la aguja del dial grande va a FIX (8 × $300) y después a REPLACE (15 × $400)
const gauge10 = () => canvasTex("gauge10", 1024, 560, (g) => { g.translate(512, 520); for (let i = 0; i < 60; i++) { const a0 = Math.PI + i / 60 * Math.PI, a1 = a0 + Math.PI / 60; g.fillStyle = i < 30 ? "#2e9e5a" : "#c62828"; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 480, a0, a1); g.closePath(); g.fill(); }
  g.fillStyle = "#f4efe6"; g.beginPath(); g.arc(0, 0, 250, 0, Math.PI * 2); g.fill(); g.fillStyle = "#fff"; g.font = BOLD(60); g.textAlign = "center"; g.fillText("FIX", -350, -150); g.fillText("REPLACE", 350, -150); g.fillStyle = "#2a2620"; g.font = BOLD(52); g.fillText("$5,000", 0, -360 + 0); });
export const HMultiply: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a1 = drop(u, 0.06, 0.2), n1 = win(u, 0.2, 0.36), g1 = 1 - win(u, 0.44, 0.52), a2 = drop(u, 0.5, 0.64), n2 = win(u, 0.64, 0.82);
  const v = u < 0.48 ? 2400 * n1 : lerp(2400, 6000, n2), ang = lerp(-90, 90, cl(v / 10000)) * D2R;
  return <S3 p={lv([0.25, 1.15, 2.6], [0.05, 1.1, 2.2], win(u, 0, 1))} l={[0, 1.0, 0]} fov={40}>
    <mesh position={[0, 0.65, -0.05]}><planeGeometry args={[1.4, 0.77]} /><meshStandardMaterial map={gauge10()} transparent roughness={0.5} /></mesh>
    <group position={[0, 0.27, -0.03]} rotation={[0, 0, -ang]}><Bx s={[0.03, 0.62, 0.02]} p={[0, 0.3, 0]} c="#1b1b1b" ro={0.4} /></group>
    <Cy rt={0.05} h={0.04} p={[0, 0.27, -0.02]} r={[Math.PI / 2, 0, 0]} c="#2a2520" m={0.6} />
    <group position={[0, lerp(2.6, 1.42, a1), 0.05]} scale={[0.75 + 0.25 * g1, 0.75 + 0.25 * g1, 1]}><Bx s={[1.2, 0.2, 0.04]} c="#efe6d0" ro={0.7} rad={0.02} /><Txt t={`8 yrs × $300 = $${Math.round(2400 * n1).toLocaleString("en-US")}`} w={1.1} c="#1e5e38" o={0.45 + 0.55 * g1} p={[0, 0, 0.022]} /></group>
    {u > 0.48 && <group position={[0, lerp(2.6, 1.19, a2), 0.12]}><Bx s={[1.2, 0.2, 0.04]} c="#efe6d0" ro={0.7} rad={0.02} /><Txt t={`15 yrs × $400 = ${n2 > 0 ? "$" + Math.round(6000 * n2).toLocaleString("en-US") : "?"}`} w={1.1} c="#9e1f1f" p={[0, 0, 0.022]} /></group>}
  </S3>;
}}</Stage>;

// 11 · las pilas: se abre la tapa del termostato, las dos AA se vacían (la franja de carga baja) y la pantalla se apaga de a poco
export const HCells: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), open = win(u, 0.05, 0.25), ch = 1 - win(u, 0.3, 0.75), scr = cl(ch * 1.4);
  return <S3 p={lv([0.25, 1.2, 0.95], [0.08, 1.12, 0.68], win(u, 0, 1))} l={[0, 1.08, 0]} fov={36} floor={null}>
    <mesh position={[0, 1.1, -0.02]} receiveShadow><planeGeometry args={[3, 2]} /><meshStandardMaterial map={PLASTER()} color="#c9bea8" roughness={0.95} /></mesh>
    <Bx s={[0.42, 0.3, 0.05]} p={[0, 1.1, 0.01]} c="#ecebe6" ro={0.4} rad={0.02} />
    {[-0.07, 0.07].map((x, i) => <group key={i} position={[x, 1.1, 0.05]} rotation={[0, 0, Math.PI / 2]}>
      <Cy rt={0.03} h={0.2} c="#1b1b1b" ro={0.4} m={0.3} /><Cy rt={0.031} h={0.06} p={[0, 0.07, 0]} c="#c8862e" m={0.8} ro={0.3} />
      <Cy rt={0.0315} h={0.18 * ch + 0.001} p={[0, -0.09 + 0.09 * ch, 0]} c={ch > 0.3 ? "#3dd27a" : "#e8402f"} e={ch > 0.3 ? "#3dd27a" : "#e8402f"} ei={0.5} ro={0.4} o={0.9} />
    </group>)}
    <group position={[0, 1.25, 0.04]} rotation={[-open * 2.2, 0, 0]}>
      <Bx s={[0.42, 0.3, 0.035]} p={[0, -0.15, 0.02]} c="#f4f3ee" ro={0.35} rad={0.02} />
      <Bx s={[0.26, 0.11, 0.01]} p={[0, -0.12, 0.04]} c="#1b2620" ro={0.3} />
      <Pl w={0.24} h={0.09} p={[0, -0.12, 0.046]} map={lcd("68°", "#cfe8d0", "#1b2620", 512, 200, 160)} c="#ffffff" e="#9fd0a0" ei={0.8 * scr} o={0.15 + 0.85 * scr} ns />
    </group>
  </S3>;
}}</Stage>;

// 12 · el subibaja: cae del cielo la factura de $150 de un lado; del otro, dos pilas de $2. La tabla se inclina hacia los $150 y la pila sale volando
export const HSeesaw: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), b = drop(u, 0.08, 0.25), bigD = drop(u, 0.35, 0.5), tilt = lerp(-0.18, 0.22, win(u, 0.47, 0.58)) * (u > 0.3 ? 1 : 0) + (u <= 0.3 ? -0.18 * b : 0);
  return <S3 p={lv([0.2, 1.0, 2.6], [0.1, 0.85, 2.1], win(u, 0, 1))} l={[0, 0.35, 0]} fov={36}>
    <mesh position={[0, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.16, 0.16, 0.3, 3]} /><meshStandardMaterial color="#6a4a30" roughness={0.6} /></mesh>
    <group position={[0, 0.3, 0]} rotation={[0, 0, -tilt]}>
      <Bx s={[1.7, 0.04, 0.32]} c="#c9a27a" ro={0.6} rad={0.01} />
      <group position={[0.65, lerp(1.4, 0.03, b), 0]}>
        {[0, 1].map((k) => <group key={k} position={[k * 0.08 - 0.04, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}><Cy rt={0.03} h={0.15} c="#1b1b1b" ro={0.4} /><Cy rt={0.031} h={0.05} p={[0, 0.05, 0]} c="#c8862e" m={0.8} ro={0.3} /></group>)}
        <group position={[0, 0.2, 0]}><Txt t="$2" w={0.2} c="#7be0a0" /></group>
      </group>
      <group position={[-0.6, lerp(1.6, 0.03, bigD), 0]}>
        <Bx s={[0.42, 0.24, 0.3]} p={[0, 0.12, 0]} c="#3a5a3a" ro={0.8} rad={0.02} />
        <group position={[0, 0.12, 0.152]}><Txt t="$150" w={0.36} c="#f4efe6" /></group>
      </group>
    </group>
  </S3>;
}}</Stage>;

// 13 · el interruptor del furnace: alguien lo baja sin querer (la luz se apaga), vuelve arriba y una tira de cinta de pintor lo tapa con «LEAVE ON» escrito a mano
const tapeT = () => canvasTex("tape13", 900, 220, (g) => { g.fillStyle = "#efe2b8"; g.fillRect(0, 0, 900, 220); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(120,100,60,${rnd(i) * 0.08})`; g.fillRect(rnd(i, 2) * 900, rnd(i, 3) * 220, 3, 3); } g.fillStyle = "#1f2a6a"; g.font = HANDF(110); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("LEAVE ON", 450, 118); });
export const HSwitchtape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), down = win(u, 0.1, 0.18) * (1 - win(u, 0.36, 0.44)), lit = 1 - down, tp = win(u, 0.5, 0.72);
  return <S3 p={lv([0.45, 1.3, 1.5], [0.15, 1.2, 0.95], win(u, 0, 1))} l={[0, 1.15, 0]} fov={36} floor={null}>
    <mesh position={[0, 1.2, -0.02]} receiveShadow><planeGeometry args={[3, 2]} /><meshStandardMaterial map={BLOCKS()} roughness={0.95} /></mesh>
    <Bx s={[0.22, 0.36, 0.03]} p={[0, 1.15, 0.0]} c="#e9e6dc" ro={0.4} rad={0.012} />
    <Bx s={[0.07, 0.14, 0.02]} p={[0, 1.15, 0.022]} c="#d8d4c8" ro={0.4} />
    <group position={[0, 1.15, 0.03]} rotation={[lerp(-0.5, 0.5, down), 0, 0]}><Bx s={[0.045, 0.1, 0.045]} p={[0, 0.03, 0.02]} c="#f4f2ea" ro={0.35} rad={0.01} /></group>
    <Sp rad={0.014} p={[0.2, 1.32, 0.02]} c={lit > 0.5 ? "#ff6a3a" : "#3a2018"} e={lit > 0.5 ? "#ff5a2a" : undefined} ei={2} ns />
    {lit > 0.5 && <pointLight position={[0.2, 1.32, 0.2]} intensity={0.8} distance={0.8} color="#ff6a3a" />}
    <Tube pts={[[0.2, 1.32, 0.0], [0.6, 1.4, -0.01], [1.2, 1.38, -0.01]]} rad={0.008} c="#7a7a7a" />
    {tp > 0 && <group position={[-0.3 + 0.3 * tp, 1.15, 0.065]} rotation={[0, 0, 0.06]}><Pl w={0.6 * tp + 0.001} h={0.14} map={tapeT()} c="#ffffff" ro={0.85} /></group>}
  </S3>;
}}</Stage>;

// 14 · el fantasma: en el sótano oscuro el gas no se ve; sólo cuando pasa el haz de la linterna aparece la nube gris adentro del cono
export const HGhost: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), bx = lerp(-1.0, 1.0, win(u, 0.08, 0.92)), yaw = Math.atan2(bx, 2.2);
  return <S3 p={lv([0.2, 0.85, 2.4], [0.0, 0.8, 2.0], win(u, 0, 1))} l={[0, 0.75, 0]} fov={44} floor="conc" env={0.28} exp={0.85}>
    <mesh position={[0, 1.2, -0.8]} receiveShadow><planeGeometry args={[5, 3]} /><meshStandardMaterial map={BLOCKS()} roughness={0.95} /></mesh>
    <Bx s={[0.8, 1.3, 0.6]} p={[1.0, 0.65, -0.45]} c="#8d9298" m={0.5} ro={0.4} rad={0.03} /><Cy rt={0.09} h={0.9} p={[1.0, 1.75, -0.45]} c="#9aa0a7" m={0.8} ro={0.3} />
    <spotLight position={[0, 0.9, 2.2]} target-position={[bx, 0.6, -0.8]} angle={0.2} penumbra={0.4} intensity={40} distance={6} color="#fff1c8" decay={1.4} />
    <group position={[0, 0.9, 2.2]} rotation={[0.08, yaw, 0]}>
      <mesh position={[0, 0, -1.4]} rotation={[-Math.PI / 2, 0, 0]}><coneGeometry args={[0.55, 2.8, 32, 1, true]} /><meshBasicMaterial color="#fff2c8" transparent opacity={0.06} blending={2} depthWrite={false} side={2} /></mesh>
    </group>
    {Array.from({ length: 260 }, (_, i) => { const x = -1.3 + rnd(i) * 2.6 + Math.sin(u * 2 + i) * 0.04, z = -0.6 + rnd(i, 2) * 1.5, y = 0.25 + rnd(i, 3) * 1.0 + Math.sin(u * 3 + i) * 0.04;
      const bxz = bx * (2.2 - z) / 3.0, vis = cl(1 - Math.abs(x - bxz) / 0.3); return vis > 0.02 ? <Dot key={i} p={[x, y, z]} r={0.012 + rnd(i, 4) * 0.012} c="#ffe9c0" add o={0.9 * vis} /> : null; })}
    <group position={[bx * 0.9, 0.75, -0.3]}><Txt t="CO" w={0.32} c="#ffd7a0" e={0.8} o={0.9 * win(u, 0.2, 0.3)} /></group>
  </S3>;
}}</Stage>;

// 15 · el caño de la chimenea: la unión se afloja, el tramo de arriba se ladea y la mitad del humo vuelve al sótano
export const HFlue: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), sep = win(u, 0.2, 0.42), J: V3 = [0, 1.05, 0];
  return <S3 p={lv([0.9, 1.25, 2.4], [0.55, 1.15, 1.8], win(u, 0, 1))} l={[0, 1.0, 0]} fov={38} floor="conc">
    <mesh position={[0, 1.4, -0.45]} receiveShadow><planeGeometry args={[4, 3]} /><meshStandardMaterial map={BLOCKS()} roughness={0.95} /></mesh>
    <Bx s={[0.7, 0.75, 0.6]} p={[0, 0.375, -0.1]} c="#d6d0c1" ro={0.45} m={0.15} rad={0.03} />
    <Cy rt={0.09} h={0.3} p={[0, 0.9, -0.1]} c="#c9cfd5" m={0.85} ro={0.28} />
    <Cy rt={0.09} h={0.12} p={[0, J[1] - 0.03, -0.1]} c="#c9cfd5" m={0.85} ro={0.28} />
    <group position={[sep * 0.07, J[1] + 0.02 + sep * 0.06, -0.1]} rotation={[0, 0, -sep * 0.22]}>
      <Cy rt={0.092} h={0.8} p={[0, 0.4, 0]} c="#c9cfd5" m={0.85} ro={0.28} />
      <To R={0.093} t={0.008} p={[0, 0.03, 0]} r={[Math.PI / 2, 0, 0]} c="#8d949c" m={0.9} />
    </group>
    {Array.from({ length: 16 }, (_, i) => { const ph = (u * 1.4 + i / 16) % 1, back = i % 2 === 0 && sep > 0.3;
      const p: V3 = back ? [0.05 + ph * 0.6, J[1] + 0.05 - ph * 0.3 + ph * ph * 0.5, -0.1 + ph * 0.5] : [sep * 0.07 + ph * 0.18 * sep, J[1] + ph * 0.9, -0.1];
      return <Puff key={i} p={p} s={0.18 + ph * 0.3} c={back ? "#7a7670" : "#9a968e"} add={false} o={(back ? 0.55 : 0.3) * Math.sin(ph * Math.PI)} />; })}
  </S3>;
}}</Stage>;

// 16 · el plano de la casa visto de arriba: una alarma cae en cada piso y el pasillo de los dormitorios se ilumina
export const HFloorplan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), hall = win(u, 0.55, 0.7), WL = { c: "#efe9dc", ro: 0.6 };
  const al: V3[] = [[-0.55, 0, 0.3], [0.45, 0, -0.35], [0.05, 0, 0.0]];
  return <S3 p={lv([0.0, 2.3, 1.3], [0.0, 2.0, 0.75], win(u, 0, 1))} l={[0, 0, 0.05]} fov={40} floor="wood" exp={lerp(1, 0.7, hall)}>
    <Bx s={[1.9, 0.02, 1.3]} p={[0, 0.01, 0]} c="#d8cdb6" ro={0.85} />
    <Bx s={[1.9, 0.16, 0.04]} p={[0, 0.08, -0.65]} {...WL} /><Bx s={[1.9, 0.16, 0.04]} p={[0, 0.08, 0.65]} {...WL} />
    <Bx s={[0.04, 0.16, 1.3]} p={[-0.95, 0.08, 0]} {...WL} /><Bx s={[0.04, 0.16, 1.3]} p={[0.95, 0.08, 0]} {...WL} />
    <Bx s={[0.04, 0.16, 0.5]} p={[-0.25, 0.08, -0.4]} {...WL} /><Bx s={[0.04, 0.16, 0.5]} p={[0.35, 0.08, -0.4]} {...WL} />
    <Bx s={[1.9, 0.16, 0.04]} p={[0, 0.08, -0.12]} {...WL} />
    <Bx s={[0.04, 0.16, 0.6]} p={[0.2, 0.08, 0.35]} {...WL} />
    <Bx s={[1.8, 0.005, 0.2]} p={[0, 0.023, 0.0]} c="#ffd27a" e="#ffc04a" ei={3 * hall} o={0.2 + 0.8 * hall} ns />
    <pointLight position={[0, 0.45, 0]} intensity={6 * hall} distance={1.4} color="#ffd27a" />
    {[[-0.6, -0.4], [0.05, -0.4], [0.65, -0.4]].map(([x, z], i) => <Bx key={`b${i}`} s={[0.28, 0.06, 0.18]} p={[x, 0.04, z]} c="#a8b4c8" ro={0.9} rad={0.02} />)}
    {al.map((q, i) => { const d = drop(u, 0.1 + i * 0.13, 0.25 + i * 0.13), on = i === 2 && hall > 0.3;
      return <group key={i} position={[q[0], lerp(1.6, 0.04, d), q[2]]}>
        <Cy rt={0.11} h={0.05} c="#f4f3ee" ro={0.4} /><Sp rad={0.022} p={[0.05, 0.03, 0]} c={on ? "#3dff8a" : "#ff3b2f"} e={on ? "#3dff8a" : "#ff3b2f"} ei={2} ns />
        {on && <To R={0.15 + 0.12 * ((u * 3) % 1)} t={0.012} p={[0, 0.02, 0]} r={[Math.PI / 2, 0, 0]} c="#3dff8a" e="#3dff8a" ei={1} o={1 - ((u * 3) % 1)} />}
      </group>; })}
  </S3>;
}}</Stage>;
