// mar29a · componentes únicos 1-14, vuelta 3: objetos 3D de verdad (three.js, kit r3k: luz con sombra suave, reflejos, ACES) sobre la
// foto desenfocada del momento. La acción se reparte en TODO el plano (u = 0..1) para que entrada, medio y salida sean distintos.
// Mecanismos propios de la tanda (ver D:/rtmp/mar29_COMPONENTES.md).
import React from "react";
import { H, HAND, Photo, Stage, eio, phys } from "./hkit";
import { BLOCKS, BOLD, Bx, Cy, D2R, Dot, Filt, Flame, HANDF, PLASTER, Pl, Puff, S3, Sp, To, Tube, Txt, V3, canvasTex, cl, drop, lerp, lv, rnd, sm, win } from "../kits/r3k/r3k";

const dur = (h: H) => h.out - h.at;
const U = (tt: number, h: H) => cl(tt / dur(h));
const C: React.FC<{ x?: number; y?: number; children: React.ReactNode }> = ({ x = 960, y = 560, children }) =>
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}>{children}</div>;
// sello de goma (cara de tinta hacia -z): base roja, cuerpo de metal, mango de madera
const Stamp: React.FC<{ w?: number; hh?: number }> = ({ w = 0.3, hh = 0.13 }) => <>
  <Bx s={[w, hh, 0.03]} p={[0, 0, 0.015]} c="#b8242a" ro={0.7} rad={0.008} />
  <Bx s={[w + 0.03, hh + 0.03, 0.06]} p={[0, 0, 0.06]} c="#3a3d42" m={0.5} ro={0.35} rad={0.01} />
  <Cy rt={0.03} rb={0.045} h={0.16} p={[0, 0, 0.17]} r={[Math.PI / 2, 0, 0]} c="#8a5a30" ro={0.5} />
  <Sp rad={0.055} p={[0, 0, 0.27]} c="#9c6a3a" ro={0.45} />
</>;
// trayecto del sello: llega desde arriba a la derecha, golpea y se va por donde vino
const stampAt = (base: V3, hit: number, back: number): V3 => { const k = (1 - hit) + back; return [base[0] + 0.55 * k, base[1] + 0.7 * k, base[2] + 0.04 + 0.35 * k]; };

// 1 · termostato de esfera en la pared de yeso: la aguja cae 68→61 con rebote, la escarcha crece desde el aro y empaña el 61, sale aliento frío
const dialFace = () => canvasTex("dial61face", 1024, 1024, (g) => {
  const r = g.createRadialGradient(440, 400, 60, 512, 512, 512); r.addColorStop(0, "#fbf6ea"); r.addColorStop(0.8, "#e2d6ba"); r.addColorStop(1, "#b3a47e"); g.fillStyle = r; g.fillRect(0, 0, 1024, 1024);
  g.strokeStyle = "#2f2a22"; g.fillStyle = "#2f2a22"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 0; i <= 40; i++) { const a = (-135 + i * 6.75) * D2R, r1 = 420, r2 = i % 5 === 0 ? 350 : 385; g.lineWidth = i % 5 === 0 ? 12 : 5; g.beginPath(); g.moveTo(512 + r1 * Math.sin(a), 512 - r1 * Math.cos(a)); g.lineTo(512 + r2 * Math.sin(a), 512 - r2 * Math.cos(a)); g.stroke(); }
  [50, 60, 70, 80, 90].forEach((v, k) => { const a = (-135 + k * 67.5) * D2R; g.font = BOLD(92); g.fillText(String(v), 512 + 275 * Math.sin(a), 512 - 275 * Math.cos(a)); });
  g.font = BOLD(44); g.fillText("°F", 512, 700);
});
const frost = (k: number) => canvasTex(`frost${k}`, 1024, 1024, (g) => {
  g.strokeStyle = "rgba(240,250,255,.95)"; g.lineCap = "round"; const f = k / 10;
  for (let i = 0; i < 46; i++) { const a = i / 46 * Math.PI * 2 + rnd(i) * 0.15, L = 470 * f * (0.45 + 0.7 * rnd(i, 3)), x0 = 512 + 505 * Math.cos(a), y0 = 512 + 505 * Math.sin(a), x1 = 512 + (505 - L) * Math.cos(a), y1 = 512 + (505 - L) * Math.sin(a);
    g.lineWidth = 13; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    for (let j = 1; j < 6; j++) { const q = j / 6, bx = lerp(x0, x1, q), by = lerp(y0, y1, q), l = 110 * f * (1 - q) * (0.6 + rnd(i, j)); g.lineWidth = 7;
      g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(a + 2.5) * l, by + Math.sin(a + 2.5) * l); g.moveTo(bx, by); g.lineTo(bx + Math.cos(a - 2.5) * l, by + Math.sin(a - 2.5) * l); g.stroke(); } }
  const r = g.createRadialGradient(512, 512, 300 - 250 * f, 512, 512, 512); r.addColorStop(0, "rgba(230,242,255,0)"); r.addColorStop(1, `rgba(230,242,255,${0.92 * f})`); g.fillStyle = r; g.fillRect(0, 0, 1024, 1024);
});
export const HDial61: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = sm(win(u, 0.06, 0.3)), bo = u > 0.3 ? 0.9 * Math.sin((u - 0.3) * 38) * Math.exp(-(u - 0.3) * 14) : 0, deg = lerp(68, 61, k) + bo;
  const ang = (-135 + (deg - 50) * 6.75) * D2R, fr = Math.round(8 * win(u, 0.3, 0.78)), big = drop(u, 0.32, 0.5);
  return <S3 p={lv([0.25, 1.25, 2.05], [0.1, 1.2, 1.8], win(u, 0, 1))} l={[0.15, 1.2, 0]} fov={40} floor={null} exp={0.85}>
    <mesh position={[0, 1.2, -0.01]} receiveShadow><planeGeometry args={[8, 5]} /><meshStandardMaterial map={PLASTER()} color="#d3c8b2" roughness={0.95} /></mesh>
    <spotLight position={[-1.6, 2.4, 1.6]} angle={0.5} penumbra={0.7} intensity={14} distance={6} color="#fff0d8" castShadow />
    <Cy rt={0.66} h={0.05} p={[-0.35, 1.2, 0.025]} r={[Math.PI / 2, 0, 0]} c="#efe8d8" ro={0.4} seg={64} />
    <Cy rt={0.58} rb={0.6} h={0.14} p={[-0.35, 1.2, 0.11]} r={[Math.PI / 2, 0, 0]} c="#b8924a" m={0.45} ro={0.5} seg={64} />
    <mesh position={[-0.35, 1.2, 0.181]}><circleGeometry args={[0.53, 64]} /><meshStandardMaterial map={dialFace()} roughness={0.6} /></mesh>
    <group position={[-0.35, 1.2, 0.2]} rotation={[0, 0, -ang]}><Bx s={[0.03, 0.46, 0.014]} p={[0, 0.17, 0]} c="#d8352a" ro={0.4} /></group>
    <Cy rt={0.05} h={0.04} p={[-0.35, 1.2, 0.205]} r={[Math.PI / 2, 0, 0]} c="#2a2520" m={0.6} ro={0.3} />
    {fr > 0 && <mesh position={[-0.35, 1.2, 0.24]}><circleGeometry args={[0.53, 64]} /><meshBasicMaterial map={frost(fr)} transparent depthWrite={false} /></mesh>}
    {big > 0 && <group position={[0.72, 1.2, 0.1]} scale={[big, big, big]}><Txt t="61°" w={0.62} c="#a8dcff" e={0.45} /></group>}
  </S3>;
}}</Stage>;

// 2 · impresora térmica en el mostrador: el ticket sube renglón por renglón; un sello de goma entra desde la cámara y golpea la zona libre
const receipt = () => canvasTex("ticket2", 460, 1000, (g) => {
  g.fillStyle = "#fbfaf4"; g.fillRect(0, 0, 460, 1000); g.fillStyle = "#26231e"; g.textBaseline = "top";
  g.textAlign = "left"; g.font = BOLD(64);
  [["TRIP", "$150"], ["TIME", "90 s"]].forEach(([a, b], i) => { g.fillText(a, 26, 60 + i * 120); g.textAlign = "right"; g.fillText(b, 434, 60 + i * 120); g.textAlign = "left"; });
  g.fillRect(26, 290, 408, 6); g.font = BOLD(84); g.fillText("FILTER", 26, 330); g.textAlign = "right"; g.fillText("$6", 434, 330);
});
const stampMark = () => canvasTex("stamp2", 600, 240, (g) => { g.strokeStyle = "#c8242a"; g.lineWidth = 18; g.strokeRect(14, 14, 572, 212); g.fillStyle = "#c8242a"; g.font = BOLD(110); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("A $6 FIX", 300, 124); });
export const HTicket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), Lmax = 0.62, L = Math.max(0.01, Lmax * (Math.round(win(u, 0.06, 0.5) * 3) / 3 * 0.85 + 0.15 * win(u, 0.06, 0.5))), rx = receipt();
  rx.repeat.set(1, L / Lmax); rx.offset.set(0, 1 - L / Lmax);
  const hit = drop(u, 0.55, 0.64), back = win(u, 0.74, 0.9), mark = u > 0.62, sAt = 0.1;
  const tilt = -0.12, at = (q: number, dz = 0): V3 => [0, 0.245 + q * Math.cos(tilt), -0.06 + q * Math.sin(tilt) + dz];
  return <S3 p={lv([0.3, 0.72, 1.3], [0.12, 0.62, 1.05], win(u, 0, 1))} l={[0, 0.5, 0]} fov={40}>
    <mesh position={[0, 1.2, -0.6]} receiveShadow><planeGeometry args={[8, 5]} /><meshStandardMaterial map={PLASTER()} color="#c9bca2" roughness={0.95} /></mesh>
    <Bx s={[0.72, 0.24, 0.52]} p={[0, 0.12, 0]} c="#2b2e33" ro={0.45} m={0.2} rad={0.04} />
    <Bx s={[0.52, 0.02, 0.06]} p={[0, 0.245, -0.06]} c="#0c0d0f" ro={0.6} ns />
    <Cy rt={0.03} h={0.5} p={[0, 0.25, -0.03]} r={[0, 0, Math.PI / 2 + u * 30]} c="#6a6e74" m={0.6} />
    <Sp rad={0.018} p={[-0.28, 0.17, 0.262]} c="#38e07b" e="#38e07b" ei={3} ns />
    <Pl w={0.46} h={L} p={at(L / 2)} r={[tilt, 0, 0]} c="#ffffff" ro={0.8} map={rx} />
    {mark && <Pl w={0.4} h={0.16} p={at(sAt, 0.004)} r={[tilt, 0, 0]} map={stampMark()} c="#ffffff" o={0.92} ns />}
    <group position={[0, at(sAt)[1] + 0.9 * (1 - hit) + 0.9 * back, at(sAt)[2] + 0.04]} rotation={[tilt, 0, 0]}><Stamp w={0.38} hh={0.15} /></group>
  </S3>;
}}</Stage>;

// 3 · el circuito del aire: ductos de vidrio, el soplador lo hace girar y el polvo se amontona contra el filtro hasta taparlo
export const HAirpath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), clog = win(u, 0.1, 0.85), FX = 0.25, GL = { c: "#cfe3f5", o: 0.3, ro: 0.05, m: 0.3 };
  return <S3 p={lv([0.2, 0.75, 2.0], [0.05, 0.6, 1.6], win(u, 0, 1))} l={[0, 0.45, 0]} fov={40} floor="conc">
    <mesh position={[0, 1.2, -0.7]} receiveShadow><planeGeometry args={[8, 5]} /><meshStandardMaterial map={BLOCKS()} color="#a89e8e" roughness={0.95} /></mesh>
    <Bx s={[2.2, 0.03, 0.5]} p={[0, 0.2, 0]} c="#b9c0c7" m={0.7} ro={0.32} /><Bx s={[2.2, 0.03, 0.5]} p={[0, 0.72, -0.0]} {...GL} />
    <Bx s={[2.2, 0.55, 0.03]} p={[0, 0.46, -0.25]} c="#9aa1a8" m={0.7} ro={0.35} />
    <Filt w={0.5} h={0.5} d={0.06} g={clog * 0.95} p={[FX, 0.46, 0]} r={[0, Math.PI / 2, 0]} />
    <Bx s={[0.02 + 0.08 * clog, 0.48, 0.46]} p={[FX + 0.04 + 0.04 * clog, 0.46, 0]} c="#7d776c" ro={1} o={0.999 * win(u, 0.15, 0.5)} />
    <group position={[-0.7, 0.46, 0]} rotation={[0, Math.PI / 2, 0]}>
      <Cy rt={0.25} h={0.04} r={[Math.PI / 2, 0, 0]} c="#30343a" m={0.5} ro={0.4} open />
      <group rotation={[0, 0, u * (60 - 45 * clog)]}>{Array.from({ length: 6 }, (_, i) => <Bx key={i} s={[0.1, 0.22, 0.012]} p={[Math.sin(i * 1.047) * 0.12, Math.cos(i * 1.047) * 0.12, 0]} r={[0.35, 0, -i * 1.047]} c="#d6dbe0" m={0.7} ro={0.25} />)}<Cy rt={0.04} h={0.06} r={[Math.PI / 2, 0, 0]} c="#22252a" m={0.6} /></group>
    </group>
    {Array.from({ length: 70 }, (_, i) => { const ph = (u * 1.4 + i / 70) % 1, x = lerp(1.15, -0.65, ph), y = 0.25 + rnd(i) * 0.42, z = (rnd(i, 2) - 0.5) * 0.4;
      const stuck = rnd(i, 3) < clog && x < FX + 0.06; if (stuck) return <Dot key={i} p={[FX + 0.07 + rnd(i, 4) * 0.05 * clog, y, z]} r={0.022} c="#8a8274" o={0.95} />;
      return <Dot key={i} p={[x, y, z]} r={0.02} st={[2.6, 1, 1]} c="#e9f6ff" add o={0.9 * (x < FX ? 1 - clog : 1)} />; })}
  </S3>;
}}</Stage>;

// 4 · el fajo del año: los billetes de arriba se despegan, caen en la llama del quemador y se hacen ceniza; el odómetro pasa de $200 a $400
const bill = () => canvasTex("bill4", 512, 232, (g) => { g.fillStyle = "#9cc08c"; g.fillRect(0, 0, 512, 232); g.strokeStyle = "#466b3c"; g.lineWidth = 8; g.strokeRect(14, 14, 484, 204); g.beginPath(); g.ellipse(256, 116, 60, 76, 0, 0, Math.PI * 2); g.stroke(); g.fillStyle = "#466b3c"; g.font = BOLD(64); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("$", 256, 120); g.font = BOLD(40); g.fillText("100", 70, 60); g.fillText("100", 442, 172); });
export const HCash: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  // los billetes salen del fajo de a uno, giran en el aire y aterrizan EN la llama; se enroscan, se ennegrecen y quedan cenizas; la etiqueta de precio da vuelta $200 → $400
  const u = U(tt, h), N = 6, flip = win(u, 0.74, 0.86), BX = 0.45, top = 16 - N;
  const hits = Array.from({ length: N }, (_, i) => { const a = 0.1 + i * 0.1, f = cl((u - a) / 0.16); return f >= 1 ? Math.exp(-(u - a - 0.16) * 18) : 0; });
  const lick = 1 + 0.9 * Math.max(...hits);
  return <S3 p={lv([0.1, 0.95, 1.55], [0.0, 0.8, 1.2], win(u, 0, 1))} l={[0, 0.3, 0]} fov={42}>
    <Pl w={0.62} h={0.28} p={[-0.48, 0.0125 + top * 0.012 - 0.006, 0]} r={[-Math.PI / 2, 0, 0]} map={bill()} c="#ffffff" ro={0.85} />
    {Array.from({ length: top }, (_, i) => <Bx key={i} s={[0.62, 0.011, 0.28]} p={[-0.48 + (rnd(i, 3) - 0.5) * 0.03, 0.006 + i * 0.012, (rnd(i, 4) - 0.5) * 0.02]} r={[0, rnd(i) * 0.08 - 0.04, 0]} c={i % 2 ? "#b8d6a8" : "#7fa56f"} ro={0.85} rad={0.002} />)}
    <Bx s={[0.1, top * 0.012 + 0.006, 0.29]} p={[-0.48, top * 0.006, 0]} c="#f1e6c8" ro={0.8} />
    {Array.from({ length: N }, (_, i) => { const a = 0.1 + i * 0.1, f = cl((u - a) / 0.16), y0 = 0.006 + (top + (N - 1 - i)) * 0.012;
      if (f <= 0) return <Bx key={i} s={[0.62, 0.012, 0.28]} p={[-0.48, y0, 0]} c="#9cc08c" ro={0.85} rad={0.002} />;
      const fl = sm(f), x = lerp(-0.48, BX, fl), y = lerp(y0, 0.3, fl) + Math.sin(fl * Math.PI) * 0.35, burn = cl((u - a - 0.16) / 0.12);
      if (burn >= 1) return null;
      const k = Math.round(lerp(255, 40, burn));
      return <group key={i} position={[x, y - burn * 0.06, (rnd(i) - 0.5) * 0.12]} rotation={[-Math.PI / 2 + fl * 0.4 + burn * 1.2, fl * 2.4 * (i % 2 ? 1 : -1), 0]} scale={[1 - 0.75 * burn, 1, 1 - 0.55 * burn]}>
        <Pl w={0.62} h={0.28} map={bill()} c={`rgb(${k},${Math.round(k * 0.92)},${Math.round(k * 0.8)})`} ro={0.85} e={burn > 0 ? "#ff6a10" : undefined} ei={0.6 * Math.sin(burn * Math.PI)} />
      </group>; })}
    {Array.from({ length: 10 }, (_, i) => { const a = 0.1 + (i % N) * 0.1 + 0.2, f = cl((u - a) / 0.5); if (f <= 0) return null;
      return <Dot key={i} p={[BX + (rnd(i) - 0.5) * 0.3, 0.32 + f * 0.6, (rnd(i, 2) - 0.5) * 0.15]} r={0.012} c="#2a2622" o={0.9 * (1 - f)} />; })}
    {Array.from({ length: 8 }, (_, i) => <Dot key={`a${i}`} p={[BX + (rnd(i, 4) - 0.5) * 0.4, 0.185, (rnd(i, 5) - 0.5) * 0.2]} r={0.018} st={[1.6, 0.4, 1]} c="#3a3631" o={win(u, 0.25 + i * 0.06, 0.32 + i * 0.06)} />)}
    <Bx s={[0.6, 0.18, 0.36]} p={[BX, 0.09, 0]} c="#2a2c30" m={0.3} ro={0.5} />
    {Array.from({ length: 7 }, (_, i) => <group key={i} scale={[1, lick, 1]} position={[BX - 0.24 + i * 0.08, 0.18, 0]}><Fire p={[0, 0, 0]} u={u} i={i} /></group>)}
    <pointLight position={[BX, 0.5, 0.15]} intensity={2.2 * lick} distance={2} color="#ffb060" />
    <group position={[0.0, 0.66 + 0.03 * Math.sin(u * 7), -0.15]} rotation={[0, 0, 0.06 * Math.sin(u * 5)]} scale={[1.45, 1.45, 1.45]}>
      <Tube pts={[[-0.08, 0.2, 0], [0, 0.28, 0], [0.08, 0.2, 0]]} rad={0.004} c="#d8d2c4" />
      <group rotation={[flip * Math.PI, 0, 0]}>
        <Bx s={[0.5, 0.24, 0.012]} c="#f1e6c8" ro={0.8} rad={0.01} />
        <Txt t="$200" w={0.4} c="#2a2620" p={[0, 0, 0.008]} />
        <Txt t="$400" w={0.4} c="#c62828" p={[0, 0, -0.008]} r={[Math.PI, 0, 0]} />
      </group>
    </group>
  </S3>;
}}</Stage>;

// fuego de quemador con billetes encima: lenguas naranjas opacas (no aditivas: sobre piso claro se queman a blanco), parpadeo ≤2 Hz
const Fire: React.FC<{ p: V3; u: number; i: number }> = ({ p, u, i }) => {
  const f = 1 + 0.1 * Math.sin(u * 60 * 1.7 + i * 2.1), hgt = 0.2 * f;
  return <group position={p}>
    <mesh position={[0, hgt / 2, 0]}><coneGeometry args={[0.042, hgt, 14]} /><meshBasicMaterial color="#ff7a1e" transparent opacity={0.85} depthWrite={false} /></mesh>
    <mesh position={[0, hgt * 0.32, 0.005]}><coneGeometry args={[0.025, hgt * 0.6, 12]} /><meshBasicMaterial color="#ffd44a" transparent opacity={0.95} depthWrite={false} /></mesh>
    <mesh position={[0, 0.012, 0]}><sphereGeometry args={[0.02, 10, 8]} /><meshBasicMaterial color="#4a7dff" /></mesh>
  </group>;
};

// 5 · la polaroid que se revela: Mrs. Kowalski, Kettering, 1991 (vuelta 2: 8, se queda)
export const HPolaroid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const d = phys(tt, 0.3, 5, 0.5), dev = eio(tt, 0.9, 4.0);
  return <>
    <C x={960} y={540}><div style={{ transform: `translateY(${(1 - d) * -500}px) rotate(${lerp(-24, -4, d) + 2 * eio(tt, 3, dur(h))}deg) scale(${1 + 0.05 * eio(tt, 3, dur(h))})`, background: "#f5f2ea", padding: "30px 30px 120px", boxShadow: "0 50px 100px rgba(0,0,0,.7)" }}>
      <div style={{ position: "relative" }}><Photo id="f_kowalski" w={640} h={480} r={2} z={1.04} style={{ filter: `sepia(${0.5 - 0.3 * dev}) brightness(${lerp(2.6, 1, dev)}) contrast(${lerp(0.3, 1, dev)})` }} /></div>
      <div style={{ fontFamily: HAND, fontSize: 64, color: "#2a3a6a", textAlign: "center", marginTop: 22, opacity: cl((tt - 2.6) * 2) }}>Kettering, 1991</div>
    </div></C>
  </>;
}}</Stage>;

// 6 · la flecha: el filtro gira 180° a la vista (la flecha roja apuntaba al revés), queda apuntando al furnace y entra de canto por la ranura; la flecha se enciende verde
const arrowT = (dir: 1 | -1, col: string) => canvasTex(`arr${dir}${col}`, 512, 256, (g) => { g.translate(256, 128); g.scale(dir, 1); g.fillStyle = col; g.strokeStyle = "#1b1b1b"; g.lineWidth = 10;
  g.beginPath(); g.moveTo(-210, -40); g.lineTo(80, -40); g.lineTo(80, -100); g.lineTo(220, 0); g.lineTo(80, 100); g.lineTo(80, 40); g.lineTo(-210, 40); g.closePath(); g.fill(); g.stroke(); });
export const HFlipcard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), fl = win(u, 0.28, 0.56), sl = win(u, 0.62, 0.86), ok = u > 0.86, lift = Math.sin(fl * Math.PI) * 0.15;
  return <S3 p={lv([-0.9, 1.2, 2.4], [-0.3, 0.95, 1.9], win(u, 0, 1))} l={[0.1, 0.55, 0]} fov={36} floor="conc">
    <mesh position={[0.2, 1.4, -0.7]} receiveShadow><planeGeometry args={[6, 3]} /><meshStandardMaterial map={BLOCKS()} roughness={0.95} /></mesh>
    <Bx s={[0.95, 1.45, 0.8]} p={[0.85, 0.725, 0]} c="#d9d3c4" ro={0.45} m={0.15} rad={0.03} />
    <Bx s={[0.85, 0.5, 0.01]} p={[0.85, 0.36, 0.402]} c="#cfc8b6" ro={0.5} m={0.15} ns /><Bx s={[0.85, 0.42, 0.01]} p={[0.85, 0.96, 0.402]} c="#cfc8b6" ro={0.5} m={0.15} ns />
    <spotLight position={[-1.6, 0.6, 0.9]} angle={0.5} penumbra={0.6} intensity={18} distance={4} color="#fff0d8" />
    {Array.from({ length: 7 }, (_, i) => <Bx key={i} s={[0.55, 0.02, 0.02]} p={[0.85, 1.05 + i * 0.045, 0.405]} c="#5c5a55" ro={0.5} ns />)}
    {Array.from({ length: 8 }, (_, i) => <Sp key={i} rad={0.012} p={[0.41 + (i % 2) * 0.88, 0.1 + Math.floor(i / 2) * 0.4, 0.405]} c="#9a9a9a" m={0.8} ro={0.3} ns />)}
    <Bx s={[0.012, 0.6, 0.1]} p={[0.372, 0.5, 0]} c="#0b0b0c" ro={0.8} ns />
    <pointLight position={[0.2, 0.55, 0.3]} intensity={ok ? 1.8 : 0} distance={1.4} color="#4dff8a" />
    <group position={[lerp(-0.5, 0.95, sl), 0.5 + lift, 0]} rotation={[0, Math.PI - Math.PI * fl, 0]}>
      <Filt w={0.62} h={0.56} d={0.06} />
      <Pl w={0.58} h={0.3} p={[0, 0, 0.034]} map={arrowT(1, fl > 0.92 ? "#45e07f" : "#e8402f")} c="#ffffff" e={ok ? "#45e07f" : undefined} ei={0.5} ns />
      <Pl w={0.58} h={0.3} p={[0, 0, -0.034]} r={[0, Math.PI, 0]} map={arrowT(-1, "#e8402f")} c="#ffffff" ns />
    </group>
  </S3>;
}}</Stage>;

// 7 · tres filtros (MERV 8 · 11 · 13) con malla de distinto tamaño: la nube de polvo los cruza; casi todo pasa el 8, la mitad queda en el 11, casi todo en el 13, que se adelanta
const meshT = (gap: number) => canvasTex(`mesh${gap}`, 512, 512, (g) => { g.fillStyle = "#f6f3ea"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "#5d5850"; g.lineWidth = Math.max(2, gap / 6); for (let x = 0; x <= 512; x += gap) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 512); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(512, x); g.stroke(); } });
export const HMervSlider: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), fw = win(u, 0.72, 0.9), F = [{ n: "8", x: -0.8, gap: 64 }, { n: "11", x: 0, gap: 28 }, { n: "13", x: 0.8, gap: 11 }];
  return <S3 p={lv([0.9, 1.25, 2.9], [0.6, 1.05, 2.45], win(u, 0, 1))} l={[0, 0.45, 0]} fov={38}>
    {F.map((f, i) => { const fwd = i === 2 ? fw : 0;
      return <group key={i} position={[f.x, fwd * 0.12, 0]} rotation={[0, Math.PI / 2 - 0.35, 0]}>
        <Bx s={[0.62, 0.05, 0.06]} p={[0, 0.715, 0]} c="#b8935a" ro={0.85} /><Bx s={[0.62, 0.12, 0.06]} p={[0, 0.06, 0]} c="#b8935a" ro={0.85} />
        <Bx s={[0.05, 0.7, 0.06]} p={[-0.285, 0.39, 0]} c="#b8935a" ro={0.85} /><Bx s={[0.05, 0.7, 0.06]} p={[0.285, 0.39, 0]} c="#b8935a" ro={0.85} />
        <Pl w={0.52} h={0.6} p={[0, 0.42, 0]} map={meshT(f.gap)} c="#ffffff" ro={0.9} />
        <group position={[0, 0.9, 0]} rotation={[0, -(Math.PI / 2 - 0.35), 0]}><Txt t={`MERV ${f.n}`} w={0.56} c={i === 2 ? "#ffd27a" : "#f4efe6"} e={i === 2 ? fw * 0.8 : 0} /></group>
      </group>; })}
    {Array.from({ length: 180 }, (_, i) => {
      const r = rnd(i, 3), stop = r < 0.06 ? 0 : r < 0.5 ? 1 : r < 0.97 ? 2 : 3, sx = [-0.83, -0.03, 0.77, 9][stop], st = rnd(i) * 0.6;
      if (u < st) return null;
      const x = -1.6 + (u - st) * 6, held = x >= sx, y = 0.15 + rnd(i, 5) * 0.55, z = (rnd(i, 6) - 0.5) * 0.4;
      const p: V3 = held ? [sx + (rnd(i, 8) - 0.5) * 0.02, y + (stop === 2 ? fw * 0.12 : 0), z] : [x, y, z];
      return <Dot key={i} p={p} r={0.02} st={held ? [1, 1, 1] : [3.2, 1, 1]} c={held ? "#6e6456" : "#e6dccb"} o={0.95} />;
    })}
  </S3>;
}}</Stage>;

// 8 · la cinta métrica sobre el filtro acostado: la cinta se estira con números grandes, el marcador tacha «16 x 25» y escribe a mano la medida real
const ruler = () => canvasTex("ruler8b", 1024, 160, (g) => { g.fillStyle = "#f3c62c"; g.fillRect(0, 0, 1024, 160); g.fillStyle = "#1b1b1b"; for (let i = 0; i <= 16; i++) { const x = i * 64, L = i % 4 === 0 ? 70 : 40; g.fillRect(x, 0, 6, L); } g.font = BOLD(80); g.textAlign = "center"; for (let k = 1; k <= 4; k++) g.fillText(String(k), k * 256 - 4, 150); });
const label8 = () => canvasTex("lab8", 700, 180, (g) => { g.fillStyle = "#ffffff"; g.fillRect(0, 0, 700, 180); g.fillStyle = "#1a1a1a"; g.font = BOLD(120); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("16 x 25 x 1", 350, 96); });
export const HTape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ext = drop(u, 0.06, 0.38), L = 1.0 * ext + 0.001, rl = ruler(), sk = win(u, 0.3, 0.38), wr = win(u, 0.4, 0.52);
  rl.repeat.set(L / 1.0 * 4, 1);
  return <S3 p={lv([0.1, 0.8, 1.6], [0.03, 0.75, 1.35], win(u, 0, 1))} l={[0, 0.68, 0]} fov={42}>
    <mesh position={[0, 1.2, -0.4]} receiveShadow><planeGeometry args={[8, 5]} /><meshStandardMaterial map={PLASTER()} color="#c9bca2" roughness={0.95} /></mesh>
    <Filt w={1.0} h={0.75} d={0.05} p={[0, 0.42, -0.2]} r={[-0.06, 0, 0]} />
    <Pl w={0.62} h={0.16} p={[0, 0.82, -0.15]} map={label8()} c="#ffffff" ns />
    <Bx s={[0.64 * sk + 0.001, 0.022, 0.004]} p={[-0.32 + 0.32 * sk, 0.82, -0.143]} r={[0, 0, 0.05]} c="#d7262c" ns />
    <Bx s={[0.17, 0.17, 0.09]} p={[-0.6, 0.42, -0.1]} c="#f2c230" ro={0.4} rad={0.04} />
    <Pl w={L} h={0.09} p={[-0.52 + L / 2, 0.42, -0.14]} map={rl} c="#ffffff" ro={0.5} m={0.2} />
    {wr > 0 && <group position={[0, 1.08, -0.15]} scale={[wr, wr, wr]}><Txt t="15½ x 24½" w={0.95} c="#1f3f8a" font={HANDF} /></group>}
  </S3>;
}}</Stage>;

// 9 · el aire es vago: motas gordas con estela vienen hacia el filtro, rebotan en la trama y se escurren por la rendija del costado, que se enciende
export const HGapflow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), glow = win(u, 0.22, 0.45);
  return <S3 p={lv([1.7, 1.15, 2.6], [0.8, 0.95, 2.3], win(u, 0, 1))} l={[0.12, 0.5, 0]} fov={36} floor="conc">
    <Bx s={[1.0, 0.06, 0.14]} p={[0, 0.94, 0]} c="#aeb5bd" m={0.8} ro={0.3} /><Bx s={[1.0, 0.06, 0.14]} p={[0, 0.06, 0]} c="#aeb5bd" m={0.8} ro={0.3} />
    <Bx s={[0.06, 0.94, 0.14]} p={[-0.47, 0.5, 0]} c="#aeb5bd" m={0.8} ro={0.3} /><Bx s={[0.06, 0.94, 0.14]} p={[0.47, 0.5, 0]} c="#aeb5bd" m={0.8} ro={0.3} />
    <Filt w={0.78} h={0.82} d={0.08} g={0.35} n={16} p={[-0.05, 0.5, 0]} />
    <spotLight position={[-1.4, 0.9, 0.7]} angle={0.5} penumbra={0.7} intensity={14} distance={4} color="#fff0d8" />
    <Pl w={0.07} h={0.82} p={[0.4, 0.5, 0.01]} c="#ffb35a" o={0.25 + 0.7 * glow} add />
    <pointLight position={[0.4, 0.5, 0.25]} intensity={2.5 * glow} distance={1.2} color="#ffa040" />
    {Array.from({ length: 26 }, (_, i) => {
      const k = (u * 1.4 + rnd(i)) % 1, y = 0.15 + rnd(i, 1) * 0.7, x0 = -0.35 + rnd(i, 2) * 0.6; let p: V3, st: V3 = [1, 1, 4.2], c = "#d9cfbc";
      if (k < 0.45) p = [x0, y, lerp(1.8, 0.08, k / 0.45)];
      else if (k < 0.55) { const b = (k - 0.45) / 0.1; p = [x0 + b * 0.08, y, 0.08 + Math.sin(b * Math.PI) * 0.3]; st = [1.5, 1.5, 1]; }
      else if (k < 0.75) { const b = win((k - 0.55) / 0.2, 0, 1); p = [lerp(x0, 0.4, b), y, 0.1]; st = [2.4, 1, 1]; c = "#ffd29a"; }
      else { const b = (k - 0.75) / 0.25; p = [0.4, y, lerp(0.1, -1.2, b)]; c = "#ffc070"; }
      return <Dot key={i} p={p} r={0.03} st={st} c={c} add={k >= 0.55} o={k > 0.95 ? 0 : 1} />;
    })}
  </S3>;
}}</Stage>;

// 10 · el taco de calendario en la pared de bloques: las hojas se arrancan y caen al piso, el filtro colgado al lado se llena de pelusa, y un sello baja sobre el 35
const page = (n: number) => canvasTex(`page${n}`, 400, 420, (g) => { g.fillStyle = "#f7f4ec"; g.fillRect(0, 0, 400, 420); g.fillStyle = "#cf2e2e"; g.fillRect(0, 0, 400, 80); g.fillStyle = "#fff"; g.font = BOLD(44); g.textAlign = "center"; g.fillText("DAYS", 200, 58); g.fillStyle = "#2a2620"; g.font = BOLD(220); g.textBaseline = "middle"; g.fillText(String(n), 200, 262); });
const ring = () => canvasTex("ring35", 400, 400, (g) => { g.strokeStyle = "rgba(205,30,36,.9)"; g.lineWidth = 26; g.beginPath(); g.arc(200, 200, 168, 0, Math.PI * 2); g.stroke(); });
export const HCalendar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), day = Math.min(35, 1 + Math.floor(win(u, 0.04, 0.64) * 34)), g = (day - 1) / 34, hit = drop(u, 0.68, 0.76), back = win(u, 0.82, 0.96);
  return <S3 p={lv([0.7, 1.35, 2.7], [0.0, 1.2, 2.15], win(u, 0, 1))} l={[-0.05, 1.0, 0]} fov={36} floor="conc" key2={[-2, 4, 3.5]}>
    <mesh position={[0, 1.5, -0.01]} receiveShadow><planeGeometry args={[7, 3]} /><meshStandardMaterial map={BLOCKS()} roughness={0.95} /></mesh>
    <Bx s={[0.48, 0.62, 0.03]} p={[-0.45, 1.25, 0.015]} c="#5a3d22" ro={0.7} />
    <Bx s={[0.42, 0.44, 0.04]} p={[-0.45, 1.2, 0.04]} c="#f2eee4" ro={0.85} />
    <Pl w={0.42} h={0.44} p={[-0.45, 1.2, 0.062]} map={page(day)} c="#ffffff" ro={0.85} ns />
    {u > 0.72 && <Pl w={0.36} h={0.36} p={[-0.45, 1.16, 0.064]} map={ring()} c="#ffffff" o={0.95} ns />}
    {Array.from({ length: 24 }, (_, i) => { const s = 0.04 + i * 0.025, f = cl((u - s) / 0.12); if (f <= 0) return null;
      const land: V3 = [-0.45 + (rnd(i) - 0.5) * 0.7, 0.003 + i * 0.002, 0.35 + rnd(i, 2) * 0.6], p = f < 1 ? lv([-0.45, 1.2, 0.08], land, f) : land;
      const rot: V3 = f < 1 ? [-f * 1.57 + Math.sin(f * 9 + i) * 0.4, rnd(i, 3) * f * 2, f * 0.6] : [-Math.PI / 2, 0, rnd(i, 3) * 2];
      return <Pl key={i} w={0.42} h={0.44} p={[p[0], f < 1 ? p[1] + Math.sin(f * Math.PI) * 0.12 : p[1], p[2]]} r={rot} map={page(1 + i * 2)} c="#ffffff" ro={0.9} />; })}
    <Filt w={0.62} h={0.62} d={0.05} g={g} p={[0.4, 1.15, 0.04]} />
    {Array.from({ length: 26 }, (_, i) => <Puff key={i} p={[0.4 + (rnd(i) - 0.5) * 0.5, 1.15 + (rnd(i, 2) - 0.5) * 0.5, 0.08 + i * 0.001]} s={0.16} c="#7d766a" add={false} o={0.75 * win(g, i / 26 * 0.8, i / 26 * 0.8 + 0.2)} />)}
    {u > 0.72 && Array.from({ length: 12 }, (_, i) => { const a = rnd(i) * Math.PI * 2, r = 0.2 + rnd(i, 2) * 0.08 * (1 + win(u, 0.72, 0.8)); return <Dot key={`k${i}`} p={[-0.45 + Math.cos(a) * r, 1.16 + Math.sin(a) * r, 0.066]} r={0.008 + rnd(i, 3) * 0.01} c="#c51e24" />; })}
    <group position={stampAt([-0.45, 1.16, 0.065], hit, back)}><Stamp w={0.4} hh={0.4} /></group>
      </S3>;
}}</Stage>;

// 11 · el interruptor de límite: la lámina bimetálica se curva con el calor y se pone al rojo, abre el contacto de cobre con chispas y las llamas se achican
export const HLimit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), heat = win(u, 0.05, 0.55), open = u > 0.56, jump = open ? win(u, 0.56, 0.62) : 0, sp = open ? Math.exp(-(u - 0.56) * 40) : 0;
  const fl = open ? 1 - win(u, 0.6, 0.85) : 1, bend = heat * 0.12 + jump * 0.06;
  const pts = (dy: number): V3[] => Array.from({ length: 7 }, (_, i) => { const x = -0.42 + i * 0.14, k = i / 6; return [x, 0.66 + dy + bend * k * k, 0]; });
  const hot = `rgb(${Math.round(lerp(190, 255, heat))},${Math.round(lerp(196, 120, heat))},${Math.round(lerp(204, 50, heat))})`;
  return <S3 p={lv([0.75, 0.95, 1.45], [0.25, 0.85, 1.1], win(u, 0, 1))} l={[0.05, 0.55, 0]} fov={34} floor="conc">
    <Bx s={[1.1, 0.22, 0.42]} p={[0, 0.11, 0]} c="#2b2d31" m={0.3} ro={0.5} />
    {Array.from({ length: 9 }, (_, i) => <group key={i} position={[-0.4 + i * 0.1, 0.22, 0]} scale={[1, Math.max(0.05, fl), 1]}><Flame p={[0, 0, 0]} s={1.5} u={u} i={i} /></group>)}
    <pointLight position={[0, 0.4, 0.2]} intensity={2.5 * fl} distance={1.6} color="#7fb0ff" />
    <Bx s={[0.08, 0.5, 0.12]} p={[-0.46, 0.5, 0]} c="#3a3d42" m={0.4} ro={0.4} /><Bx s={[0.1, 0.48, 0.12]} p={[0.5, 0.48, 0]} c="#3a3d42" m={0.4} ro={0.4} />
    <Tube pts={pts(0.012)} rad={0.022} c={hot} m={0.7} ro={0.3} e={heat > 0.4 ? "#ff6a20" : undefined} ei={heat * 0.6} />
    <Tube pts={pts(-0.03)} rad={0.02} c="#9aa1a8" m={0.85} ro={0.25} />
    <Sp rad={0.03} p={[0.43, 0.705 + bend, 0]} c="#d89a52" m={0.9} ro={0.25} /><Cy rt={0.032} h={0.05} p={[0.5, 0.735, 0]} c="#d89a52" m={0.9} ro={0.25} />
    {sp > 0.02 && Array.from({ length: 44 }, (_, i) => { const a = rnd(i) * Math.PI - Math.PI / 2, b = rnd(i, 2) * Math.PI, r = (1 - sp) * (0.25 + rnd(i, 3) * 0.35); return <Dot key={i} p={[0.46 + Math.cos(a) * Math.sin(b) * r, 0.74 + Math.abs(Math.cos(b)) * r * 0.7 - (1 - sp) * (1 - sp) * 0.25, Math.sin(a) * Math.sin(b) * r]} r={0.012} st={[1, 1, 2.2]} c="#ffd27a" add o={sp} />; })}
    {sp > 0.02 && <pointLight position={[0.46, 0.74, 0.1]} intensity={9 * sp} distance={1.6} color="#ffd080" />}
  </S3>;
}}</Stage>;

// 12 · la prueba de la linterna: el haz atraviesa el filtro sano y pinta un círculo en la pared de ladrillo; entra el filtro usado y el haz muere en el papel
export const HGlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), sw = win(u, 0.56, 0.72), pass = (1 - sw) * (1 - sw) + 0.02;
  // el foco apunta al origen: pared en z = 0, filtro en z = 1.3, linterna en z = 2.4 (y = 0 = altura del haz)
  return <S3 p={lv([2.3, 0.6, 3.4], [1.8, 0.45, 3.1], win(u, 0, 1))} l={[0, 0, 1.2]} fov={42} floor={null} env={0.35} exp={0.95}>
    <mesh position={[0, 0, 0]} receiveShadow><planeGeometry args={[6, 3.5]} /><meshStandardMaterial map={BLOCKS()} roughness={0.95} /></mesh>
    <mesh position={[0, -0.75, 1.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6, 4]} /><meshStandardMaterial color="#3e3a35" roughness={0.95} /></mesh>
    <spotLight position={[0, 0, 2.4]} angle={0.2} penumbra={0.45} intensity={pass * 60} distance={6} color="#fff1c8" decay={1.4} />
    <group position={[0, 0, 2.4]} rotation={[Math.PI / 2, 0, 0]} scale={1.5}>
      <Cy rt={0.06} h={0.42} p={[0, -0.25, 0]} c="#2e3136" m={0.5} ro={0.35} />
      <Cy rt={0.1} rb={0.065} h={0.12} p={[0, 0, 0]} c="#3b3f45" m={0.6} ro={0.3} />
      <mesh position={[0, 0.061, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.092, 32]} /><meshBasicMaterial color="#fff6d8" /></mesh>
    </group>
    <mesh position={[0, 0, 1.85]} rotation={[-Math.PI / 2, 0, 0]}><coneGeometry args={[0.24, 1.1, 32, 1, true]} /><meshBasicMaterial color="#fff2c8" transparent opacity={0.13} blending={2} depthWrite={false} side={2} /></mesh>
    <mesh position={[0, 0, 0.65]} rotation={[-Math.PI / 2, 0, 0]}><coneGeometry args={[0.5, 1.3, 32, 1, true]} /><meshBasicMaterial color="#fff2c8" transparent opacity={0.1 * pass} blending={2} depthWrite={false} side={2} /></mesh>
    <Filt w={0.62} h={0.62} d={0.05} g={0} p={[0, -sw * 1.3, 1.3]} />
    <Filt w={0.62} h={0.62} d={0.05} g={0.95} p={[0, (1 - sw) * 1.3, 1.3]} />
    {Array.from({ length: 22 }, (_, i) => { const ph = (u * 0.6 + rnd(i)) % 1, z = lerp(2.3, 1.35, rnd(i, 2)); return <Dot key={i} p={[(rnd(i, 3) - 0.5) * 0.25 + Math.sin(ph * 6 + i) * 0.03, (rnd(i, 4) - 0.5) * 0.25 + ph * 0.05, z]} r={0.007} c="#fff4d0" add o={0.6 * sw + 0.25} />; })}
  </S3>;
}}</Stage>;

// 13 · el reloj de bolsillo sobre la mesa: la tapa con bisagra se abre, la aguja barre 10 segundos pintando el sector, la tapa se cierra y deja leer «10 SEC»
const watchFace = () => canvasTex("watch13", 1024, 1024, (g) => { const r = g.createRadialGradient(470, 450, 40, 512, 512, 512); r.addColorStop(0, "#fffdf6"); r.addColorStop(1, "#e8dfc8"); g.fillStyle = r; g.fillRect(0, 0, 1024, 1024);
  g.fillStyle = "#2a2620"; g.strokeStyle = "#2a2620"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 0; i < 60; i++) { const a = i * 6 * D2R, r1 = 480, r2 = i % 5 ? 450 : 410; g.lineWidth = i % 5 ? 4 : 12; g.beginPath(); g.moveTo(512 + r1 * Math.sin(a), 512 - r1 * Math.cos(a)); g.lineTo(512 + r2 * Math.sin(a), 512 - r2 * Math.cos(a)); g.stroke(); }
  g.font = BOLD(84); for (let k = 0; k < 12; k++) { const a = k * 30 * D2R; g.fillText(String(k === 0 ? 60 : k * 5), 512 + 335 * Math.sin(a), 512 - 335 * Math.cos(a)); } });
export const HStopwatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), op = drop(u, 0.04, 0.2) * (1 - win(u, 0.82, 0.94)), sec = win(u, 0.22, 0.78) * 10, a = sec * 6 * D2R;
  return <S3 p={lv([0.85, 1.25, 1.35], [0.45, 1.0, 1.0], win(u, 0, 1))} l={[0, 0.06, 0]} fov={34} key2={[-2, 5, 2.5]}>
    <Cy rt={0.32} h={0.08} p={[0, 0.04, 0]} c="#d9b25a" m={0.95} ro={0.22} seg={72} />
    <To R={0.315} t={0.018} p={[0, 0.082, 0]} r={[Math.PI / 2, 0, 0]} c="#e4c06a" m={0.95} ro={0.2} />
    <mesh position={[0, 0.0815, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.3, 64]} /><meshStandardMaterial map={watchFace()} roughness={0.5} /></mesh>
    <mesh position={[0, 0.083, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}><circleGeometry args={[0.27, 48, -a, a + 0.0001]} /><meshBasicMaterial color="#3fe08a" transparent opacity={0.28} depthWrite={false} /></mesh>
    <group position={[0, 0.088, 0]} rotation={[0, -a, 0]}><Bx s={[0.012, 0.006, 0.27]} p={[0, 0, -0.11]} c="#d8352a" ns /></group>
    <Cy rt={0.022} h={0.012} p={[0, 0.09, 0]} c="#2a2520" m={0.7} />
    <Cy rt={0.03} h={0.06} p={[0.35, 0.04, 0]} r={[0, 0, Math.PI / 2]} c="#d9b25a" m={0.95} ro={0.25} />
    <To R={0.06} t={0.012} p={[0.44, 0.04, 0]} c="#d9b25a" m={0.95} ro={0.25} />
    {Array.from({ length: 16 }, (_, i) => <To key={i} R={0.025} t={0.007} p={[0.52 + i * 0.045, 0.008, Math.sin(i * 0.45) * 0.12]} r={[Math.PI / 2, i % 2 ? 0.6 : 0, i % 2 ? Math.PI / 2 : 0]} c="#c9a24a" m={0.95} ro={0.3} />)}
    <group position={[-0.32, 0.082, 0]} rotation={[0, 0, op * 1.95]}>
      <group position={[0.32, 0.012, 0]}>
        <Cy rt={0.32} h={0.022} c="#dcb862" m={0.95} ro={0.2} seg={72} />
        <Txt t="10 SEC" w={0.44} c="#3e2a08" font={BOLD} p={[0, 0.0125, 0]} r={[-Math.PI / 2, 0, -Math.PI / 2]} />
      </group>
    </group>
  </S3>;
}}</Stage>;

// 14 · el filtro lavable bajo la manguera: el chorro lo limpia, pero la malla se abre en huecos grandes y las pelotas de polvo pasan de largo hacia la cámara
const grid = (k: number) => canvasTex(`grid14_${k}`, 512, 512, (g) => { g.clearRect(0, 0, 512, 512); g.strokeStyle = "#d7dce2"; for (let i = 0; i <= 32; i++) { const w = 5 - k * 0.6; if (k > 0 && i % 4 && rnd(i, k) < k * 0.17) continue; g.lineWidth = Math.max(1.5, w); const x = i * 16 + (k > 0 ? (rnd(i, 9) - 0.5) * k * 6 : 0); g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (rnd(i, 2) - 0.5) * k * 8, 512); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(512, x + (rnd(i, 3) - 0.5) * k * 8); g.stroke(); } });
export const HRinse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), wash = win(u, 0.05, 0.5), k = Math.round(5 * win(u, 0.5, 0.7)), leak = u > 0.66, water = u < 0.64;
  return <S3 p={lv([1.0, 1.0, 2.3], [0.45, 0.92, 1.85], win(u, 0, 1))} l={[0, 0.5, 0]} fov={36} floor="conc">
    <Bx s={[0.8, 0.04, 0.04]} p={[0, 0.9, 0]} c="#9c7a4a" ro={0.9} /><Bx s={[0.8, 0.04, 0.04]} p={[0, 0.1, 0]} c="#9c7a4a" ro={0.9} />
    <Bx s={[0.04, 0.84, 0.04]} p={[-0.38, 0.5, 0]} c="#9c7a4a" ro={0.9} /><Bx s={[0.04, 0.84, 0.04]} p={[0.38, 0.5, 0]} c="#9c7a4a" ro={0.9} />
    <Pl w={0.72} h={0.76} p={[0, 0.5, 0]} map={grid(k)} c="#ffffff" m={0.6} ro={0.3} o={0.999} />
    <Pl w={0.72} h={0.76} p={[0, 0.5, 0.004]} c="#6e6252" o={0.8 * (1 - wash)} ro={1} ns />
    <Tube pts={[[-1.4, 1.5, 0.9], [-1.0, 1.2, 0.8], [-0.7, 1.05, 0.7], [-0.5, 0.95, 0.55]]} rad={0.035} c="#2f8a3e" ro={0.45} />
    <Cy rt={0.03} rb={0.045} h={0.16} p={[-0.45, 0.92, 0.5]} r={[0.9, 0, 0.9]} c="#c99a3a" m={0.9} ro={0.3} />
    {water && Array.from({ length: 34 }, (_, i) => { const ph = (u * 9 + i / 34) % 1; return <Dot key={i} p={lv([-0.4, 0.9, 0.46], [(rnd(i) - 0.5) * 0.5, 0.35 + rnd(i, 2) * 0.45, 0.03], ph)} r={0.012} st={[1, 1, 3]} c="#bfe4ff" add o={0.85 * (1 - win(u, 0.56, 0.64))} />; })}
    {water && Array.from({ length: 8 }, (_, i) => <Puff key={i} p={[(rnd(i) - 0.5) * 0.5, 0.4 + rnd(i, 2) * 0.4, 0.06]} s={0.18} c="#dff1ff" o={0.35 * (1 - win(u, 0.56, 0.64))} />)}
    {leak && Array.from({ length: 12 }, (_, i) => { const ph = (u * 2.2 + i / 12) % 1; return <Sp key={i} rad={0.035} p={[(rnd(i) - 0.5) * 0.5, 0.25 + rnd(i, 2) * 0.5, lerp(-1.2, 1.4, ph)]} c="#7a6650" ro={1} />; })}
  </S3>;
}}</Stage>;
