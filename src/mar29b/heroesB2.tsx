// mar29b · componentes únicos 17-31, en 3D de verdad (kit r3k) sobre la foto desenfocada del momento.
// Cada uno con su propio mecanismo (ver D:/rtmp/mar29_COMPONENTES.md); la acción ocupa todo el plano.
import React from "react";
import { H, Stage } from "./hkit";
import { BOLD, Bx, Cy, D2R, Dot, HANDF, MONO, PLASTER, Pl, Puff, S3, Sp, To, Tube, Txt, V3, canvasTex, cl, drop, lerp, lv, rnd, win } from "../kits/r3k/r3k";

const dur = (h: H) => h.out - h.at;
const U = (tt: number, h: H) => cl(tt / dur(h));
const lcd = (txt: string, fg = "#ff3b2f", bg = "#120606", w = 512, hh = 200, px = 150) => canvasTex(`lcd|${txt}|${fg}|${bg}|${w}`, w, hh, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, hh); g.fillStyle = fg; g.font = MONO(px); g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = fg; g.shadowBlur = 18; g.fillText(txt, w / 2, hh / 2 + 6); });

// 17 · la fecha de vencimiento: la alarma se da vuelta en el aire, aparece la etiqueta «MFD 2014» y un contador de años corre hasta 10: vencida
const backT = () => canvasTex("mfd17", 512, 512, (g) => { g.fillStyle = "#f1efe8"; g.fillRect(0, 0, 512, 512); g.fillStyle = "#fff"; g.fillRect(96, 150, 320, 210); g.strokeStyle = "#2a2620"; g.lineWidth = 6; g.strokeRect(96, 150, 320, 210); g.fillStyle = "#2a2620"; g.font = BOLD(54); g.textAlign = "center"; g.fillText("MFD", 256, 228); g.font = BOLD(90); g.fillText("2014", 256, 326); });
export const HDatewheel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), fl = win(u, 0.08, 0.3), yrs = Math.min(10, Math.floor(win(u, 0.35, 0.75) * 10.99)), old = u > 0.76;
  return <S3 p={lv([0.3, 0.75, 1.6], [0.1, 0.65, 1.15], win(u, 0, 1))} l={[0.05, 0.55, 0]} fov={36}>
    <group position={[-0.15, 0.55 + Math.sin(fl * Math.PI) * 0.12, 0]} rotation={[0, fl * Math.PI, Math.sin(fl * Math.PI) * 0.2]}>
      <Cy rt={0.24} h={0.06} r={[Math.PI / 2, 0, 0]} c="#f4f3ee" ro={0.4} seg={48} />
      {Array.from({ length: 12 }, (_, i) => <Bx key={i} s={[0.012, 0.09, 0.01]} p={[Math.cos(i * 0.52) * 0.15, Math.sin(i * 0.52) * 0.15, 0.032]} r={[0, 0, i * 0.52 + Math.PI / 2]} c="#c9c6bc" />)}
      <Sp rad={0.015} p={[0.12, -0.12, 0.033]} c="#ff3b2f" e="#ff3b2f" ei={1.5} ns />
      <mesh position={[0, 0, -0.032]} rotation={[0, Math.PI, 0]}><circleGeometry args={[0.235, 48]} /><meshStandardMaterial map={backT()} roughness={0.7} /></mesh>
    </group>
    <group position={[0.42, 0.62, 0.05]} rotation={[0, -0.25, 0]}>
      <Bx s={[0.34, 0.2, 0.06]} c="#1b1d20" ro={0.4} rad={0.02} />
      <Pl w={0.3} h={0.16} p={[0, 0, 0.031]} map={lcd(`${yrs} YRS`, old ? "#ff3b2f" : "#ffd24a", "#120a06", 512, 240, 130)} c="#ffffff" e={old ? "#ff3b2f" : "#ffc04a"} ei={0.5} ns />
    </group>
    {old && <group position={[0.42, 0.88, 0.05]}><Txt t="EXPIRED" w={0.36} c="#ff6a5a" e={0.5} /></group>}
  </S3>;
}}</Stage>;

// 18 · el cajón de los trastos: se abre y adentro, entre menús de delivery y gomitas, está la alarma desenchufada con la pila afuera
export const HDrawer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), op = drop(u, 0.08, 0.32), pick = win(u, 0.55, 0.8), D = op * 0.42;
  return <S3 p={lv([0.15, 1.35, 1.6], [0.05, 1.2, 1.0], win(u, 0, 1))} l={[0, 0.65, 0.2]} fov={38} floor={null}>
    <Bx s={[1.2, 0.7, 0.6]} p={[0, 0.35, -0.3]} c="#a87a50" ro={0.55} />
    <Bx s={[1.24, 0.04, 0.64]} p={[0, 0.72, -0.3]} c="#e8e2d4" ro={0.3} />
    <group position={[0, 0.5, D]}>
      <Bx s={[0.9, 0.025, 0.5]} p={[0, -0.09, -0.25]} c="#8a5e3a" ro={0.6} />
      <Bx s={[0.9, 0.18, 0.02]} p={[0, 0, -0.5]} c="#8a5e3a" ro={0.6} /><Bx s={[0.02, 0.18, 0.5]} p={[-0.44, 0, -0.25]} c="#8a5e3a" ro={0.6} /><Bx s={[0.02, 0.18, 0.5]} p={[0.44, 0, -0.25]} c="#8a5e3a" ro={0.6} />
      <Bx s={[0.96, 0.2, 0.03]} p={[0, 0, 0.0]} c="#b5875c" ro={0.5} />
      <Bx s={[0.16, 0.025, 0.025]} p={[0, 0.02, 0.03]} c="#c9c6bc" m={0.9} ro={0.25} />
      <Bx s={[0.3, 0.004, 0.4]} p={[-0.25, -0.07, -0.28]} r={[0, 0.3, 0]} c="#e86a3a" ro={0.8} />
      <Bx s={[0.28, 0.004, 0.36]} p={[0.25, -0.068, -0.3]} r={[0, -0.5, 0]} c="#f4e7a8" ro={0.8} />
      {Array.from({ length: 6 }, (_, i) => <To key={i} R={0.03} t={0.004} p={[-0.32 + rnd(i) * 0.6, -0.065, -0.1 - rnd(i, 2) * 0.35]} r={[Math.PI / 2, 0, 0]} c={["#e8402f", "#3a7ad8", "#e8c02f"][i % 3]} ro={0.6} />)}
      <group position={[0.05, -0.05 + pick * 0.45, -0.22 + pick * 0.25]} rotation={[-Math.PI / 2 + pick * 1.2, 0, 0.2]}>
        <Cy rt={0.09} h={0.035} c="#f4f3ee" ro={0.4} />
        <Sp rad={0.008} p={[0.05, 0.02, 0.0]} c="#3a2018" ns />
      </group>
      <group position={[0.2, -0.06, -0.15]} rotation={[0, 0, Math.PI / 2]}><Cy rt={0.022} h={0.1} c="#1b1b1b" ro={0.4} /><Cy rt={0.023} h={0.03} p={[0, 0.04, 0]} c="#c8862e" m={0.8} ro={0.3} /></group>
    </group>
    {pick > 0.95 && <group position={[0.05, 1.0, 0.45]}><Txt t="UNPLUGGED" w={0.4} c="#ff6a5a" /></group>}
  </S3>;
}}</Stage>;

// 19 · por debajo de la puerta: el humo del garaje se arrastra por el piso, entra por la rendija y avanza hacia el pasillo
export const HUnderdoor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), go = win(u, 0.1, 0.9);
  return <S3 p={lv([0.35, 0.3, 1.3], [0.1, 0.2, 0.85], win(u, 0, 1))} l={[0, 0.12, -0.2]} fov={44} floor="wood">
    <Bx s={[0.9, 2.0, 0.05]} p={[0, 1.07, -0.3]} c="#efe9dc" ro={0.6} />
    <Bx s={[3, 2.2, 0.05]} p={[-1.95, 1.1, -0.3]} c="#d8cfbd" ro={0.9} /><Bx s={[3, 2.2, 0.05]} p={[1.95, 1.1, -0.3]} c="#d8cfbd" ro={0.9} />
    <Sp rad={0.035} p={[0.33, 1.0, -0.25]} c="#c99a46" m={0.95} ro={0.2} />
    <pointLight position={[0, 0.03, -0.6]} intensity={4} distance={2} color="#ffb070" />
    <Pl w={0.9} h={0.07} p={[0, 0.035, -0.32]} c="#ffb070" e="#ff9a50" ei={2.5} ns />
    {Array.from({ length: 60 }, (_, i) => { const ph = (go * 1.2 + i / 60) % 1, k = cl(go * 1.3 - i / 60 * 0.6);
      const p: V3 = [(rnd(i) - 0.5) * 0.8 + (rnd(i, 2) - 0.5) * ph * 0.8, 0.16 + ph * 0.1 + rnd(i, 3) * 0.06, -0.28 + ph * 1.1];
      return <Puff key={i} p={p} s={0.3 + ph * 0.4} c="#6f7468" add={false} o={0.95 * k * Math.sin(Math.min(1, ph * 1.4) * Math.PI * 0.9 + 0.1)} />; })}
    <group position={[0, 0.36, 0.2]}><Txt t="CO" w={0.3} c="#ff7a4a" e={0.6} o={win(u, 0.5, 0.65)} /></group>
  </S3>;
}}</Stage>;

// 20 · el radio de 20 pies: el generador ronronea en el césped; los anillos se abren de a 5 pies y la casa queda afuera del último
export const HRadius: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), vib = Math.sin(u * 160) * 0.004, n = win(u, 0.1, 0.7) * 4;
  return <S3 p={lv([0.6, 2.1, 2.6], [0.8, 1.8, 2.2], win(u, 0, 1))} l={[0.9, 0, 0]} fov={44} floor={null}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#4f7a3a" roughness={1} /></mesh>
    <group position={[0, 0.24 + vib, 0]} scale={[1.8, 1.8, 1.8]}>
      {[[-0.22, -0.15], [0.22, -0.15], [-0.22, 0.15], [0.22, 0.15]].map(([x, z], i) => <Cy key={i} rt={0.012} h={0.3} p={[x, 0, z]} c="#1b1b1b" m={0.6} ro={0.4} />)}
      <Bx s={[0.4, 0.26, 0.28]} c="#e8b020" ro={0.45} rad={0.03} />
      <Bx s={[0.42, 0.04, 0.3]} p={[0, 0.15, 0]} c="#1b1b1b" ro={0.5} />
      <Cy rt={0.03} h={0.1} p={[0.18, 0.05, 0.16]} r={[Math.PI / 2, 0, 0]} c="#6a6e74" m={0.8} />
    </group>
    {Array.from({ length: 10 }, (_, i) => { const ph = (u * 2 + i / 10) % 1; return <Puff key={i} p={[0.18 + ph * 0.3, 0.2 + ph * 0.35, 0.25 + ph * 0.4]} s={0.12 + ph * 0.25} c="#6a6660" add={false} o={0.4 * (1 - ph)} />; })}
    {[1, 2, 3, 4].map((k) => { const a = cl(n - (k - 1)); return a > 0 ? <group key={k}>
      <To R={k * 0.42 * (0.7 + 0.3 * a)} t={0.012} p={[0, 0.01, 0]} r={[Math.PI / 2, 0, 0]} c={k === 4 ? "#ff5a3a" : "#f4efe6"} e={k === 4 ? "#ff3a1a" : undefined} ei={0.6} o={a} />
      <group position={[0.1 + k * 0.08, 0.04, k * 0.42 * (0.7 + 0.3 * a) + 0.06]} rotation={[-1.1, 0, 0]}><Txt t={`${k * 5} FT`} w={0.26} c={k === 4 ? "#ffb08a" : "#ffffff"} o={win(a, 0.8, 1)} /></group>
    </group> : null; })}
    <group position={[2.2, 0, -0.4]}>
      <Bx s={[0.8, 0.5, 0.7]} p={[0, 0.25, 0]} c="#e9e2d2" ro={0.6} />
      <mesh position={[0, 0.65, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[0.62, 0.32, 4]} /><meshStandardMaterial color="#6a3a2a" roughness={0.7} /></mesh>
      <Bx s={[0.14, 0.24, 0.01]} p={[-0.2, 0.12, 0.351]} c="#6a4a30" ro={0.6} />
    </group>
  </S3>;
}}</Stage>;

// 21 · el alargue caliente: el calor sube por el cable desde el enchufe, tramo por tramo, del gris al rojo, y la zapatilla echa humito
export const HHotcord: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), heat = win(u, 0.1, 0.8), N = 12;
  const P = (i: number): V3 => [-0.75 + i * 0.12, 0.02 + Math.sin(i * 0.9) * 0.008, Math.sin(i * 0.7) * 0.15];
  return <S3 p={lv([0.3, 0.9, 1.6], [0.1, 0.7, 1.1], win(u, 0, 1))} l={[-0.05, 0.05, 0]} fov={38} floor="wood" env={0.2} exp={0.75}>
    <Bx s={[0.08, 0.16, 0.04]} p={[-0.85, 0.3, -0.35]} c="#f4f3ee" ro={0.4} rad={0.01} />
    <Tube pts={[[-0.85, 0.25, -0.33], [-0.84, 0.08, -0.2], P(0)]} rad={0.012} c="#e8e4da" ro={0.5} />
    {Array.from({ length: N - 1 }, (_, i) => { const k = cl(heat * N * 1.15 - i), c = k > 0.6 ? "#ff3a1a" : k > 0.2 ? "#e88a3a" : "#e8e4da";
      return <Tube key={i} pts={[P(i), P(i + 0.5), P(i + 1)]} rad={0.012} c={c} e={k > 0.2 ? "#ff3a1a" : undefined} ei={k * 0.9} ro={0.5} seg={8} />; })}
    <group position={[0.65, 0.03, 0.12]} rotation={[0, -0.3, 0]}>
      <Bx s={[0.42, 0.05, 0.11]} c="#f4f3ee" ro={0.4} rad={0.012} />
      {[0, 1, 2].map((k) => <Bx key={k} s={[0.05, 0.012, 0.06]} p={[-0.12 + k * 0.12, 0.03, 0]} c="#1b1b1b" />)}
      <Sp rad={0.008} p={[-0.18, 0.03, 0.04]} c="#ff3b2f" e="#ff3b2f" ei={2} ns />
    </group>
    {heat > 0.85 && Array.from({ length: 8 }, (_, i) => { const ph = (u * 2 + i / 8) % 1; return <Puff key={i} p={[0.62 + rnd(i) * 0.1, 0.06 + ph * 0.4, 0.12]} s={0.08 + ph * 0.18} c="#8a8680" add={false} o={0.45 * (1 - ph)} />; })}
    <pointLight position={[0.2, 0.15, 0.2]} intensity={1.6 * heat} distance={1.2} color="#ff5a2a" />
  </S3>;
}}</Stage>;

// 22 · el círculo de 3 pies: el anillo se expande desde la base del calefactor y empuja la manta, el diario y la cortina hacia afuera
export const HClearring: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), R = lerp(0.12, 0.9, win(u, 0.15, 0.6)), glow = 0.6 + 0.4 * Math.sin(u * 20);
  const push = (r0: number) => Math.max(0, R + 0.08 - r0);
  return <S3 p={lv([0.0, 2.3, 1.9], [0.2, 1.9, 1.5], win(u, 0, 1))} l={[0, 0, 0]} fov={42} floor="wood">
    <group position={[0, 0, 0]}>
      <Bx s={[0.3, 0.42, 0.16]} p={[0, 0.21, 0]} c="#2a2c30" ro={0.4} m={0.4} rad={0.02} />
      {Array.from({ length: 5 }, (_, i) => <Bx key={i} s={[0.22, 0.012, 0.01]} p={[0, 0.12 + i * 0.05, 0.082]} c="#ff5a2a" e="#ff4a1a" ei={1.5 * glow} ns />)}
      <pointLight position={[0, 0.3, 0.3]} intensity={2 * glow} distance={1.4} color="#ff6a2a" />
    </group>
    <To R={R} t={0.015} p={[0, 0.01, 0]} r={[Math.PI / 2, 0, 0]} c="#ffd24a" e="#ffc02a" ei={0.8} />
    <group position={[0.5, 0.03, 0.68]} rotation={[-Math.PI / 2, 0, 0]}><Txt t="3 FT" w={0.26} c="#ffe08a" o={win(u, 0.55, 0.7)} /></group>
    {(() => { const r0 = 0.45, a = -2.3, d = r0 + push(r0); return <Bx s={[0.4, 0.04, 0.3]} p={[Math.cos(a) * d, 0.02, Math.sin(a) * d]} r={[0, 0.4, 0]} c="#3a6ad8" ro={0.95} rad={0.02} />; })()}
    {(() => { const r0 = 0.5, a = -0.6, d = r0 + push(r0); return <Bx s={[0.3, 0.012, 0.22]} p={[Math.cos(a) * d, 0.007, Math.sin(a) * d]} r={[0, -0.3, 0]} c="#e8e4da" ro={0.9} />; })()}
    {(() => { const r0 = 0.55, a = Math.PI + 0.4, d = r0 + push(r0); return <group position={[Math.cos(a) * d, 0, Math.sin(a) * d]}>{Array.from({ length: 6 }, (_, i) => <Cy key={i} rt={0.03} h={1.2} p={[i * 0.06 - 0.15, 0.6, Math.sin(i * 1.3) * 0.02]} c="#c94a4a" ro={0.95} />)}</group>; })()}
  </S3>;
}}</Stage>;

// 23 · los caños tapados: la nieve sube y entierra los dos caños de PVC del costado de la casa; entra la pala y los destapa
export const HSnowdrift: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), snow = win(u, 0.05, 0.4), dig = win(u, 0.5, 0.8), hY = 0.42 * snow;
  return <S3 p={lv([0.9, 0.7, 1.9], [0.5, 0.6, 1.4], win(u, 0, 1))} l={[0, 0.3, 0]} fov={38} floor={null} warm="#a8c4ff">
    <mesh position={[0, 1.2, -0.05]} receiveShadow><planeGeometry args={[4, 3]} /><meshStandardMaterial color="#9a8a76" roughness={0.95} /></mesh>
    {[-0.15, 0.15].map((x, i) => <group key={i}><Cy rt={0.05} h={0.3} p={[x, 0.32, 0.12]} r={[Math.PI / 2, 0, 0]} c="#f4f3ee" ro={0.4} /><Cy rt={0.04} h={0.02} p={[x, 0.32, 0.27]} r={[Math.PI / 2, 0, 0]} c="#2a2a2a" ro={0.9} /></group>)}
    <mesh position={[0, hY / 2, 0.3]} castShadow receiveShadow><boxGeometry args={[1.6, hY + 0.001, 0.7]} /><meshStandardMaterial color="#f4f8ff" roughness={0.9} /></mesh>
    <mesh position={[0, hY + 0.001, 0.3]} scale={[1.6, 0.12 * snow + 0.001, 0.7]}><sphereGeometry args={[0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f4f8ff" roughness={0.9} /></mesh>
    {dig > 0 && <mesh position={[0, 0.3, 0.32]}><boxGeometry args={[0.6 * dig, 0.24, 0.72]} /><meshStandardMaterial color="#5a5048" roughness={1} /></mesh>}
    {Array.from({ length: 30 }, (_, i) => { const ph = (u * 0.8 + rnd(i)) % 1; return <Dot key={i} p={[(rnd(i, 2) - 0.5) * 2, 1.4 - ph * 1.4, (rnd(i, 3) - 0.3) * 0.9]} r={0.01} c="#ffffff" add o={0.8 * (1 - win(u, 0.45, 0.55))} />; })}
    {u > 0.45 && <group position={[lerp(0.9, 0.2, win(u, 0.45, 0.55)) - dig * 0.4, 0.4 + Math.sin(u * 40) * 0.04 * dig, 0.6]} rotation={[0.3, 0, -0.7]}>
      <Bx s={[0.26, 0.02, 0.22]} p={[0, -0.02, 0]} c="#c62828" m={0.4} ro={0.4} />
      <Cy rt={0.015} h={0.7} p={[0.02, 0.35, 0]} c="#8a5e3a" ro={0.6} />
    </group>}
    {Array.from({ length: 14 }, (_, i) => { const k = (dig * 4 + i / 14) % 1; return dig > 0.05 && dig < 0.98 ? <Puff key={`p${i}`} p={[0.2 - dig * 0.4 + k * 0.5, 0.35 + Math.sin(k * Math.PI) * 0.3, 0.6]} s={0.06} c="#ffffff" add={false} o={0.7 * (1 - k)} /> : null; })}
  </S3>;
}}</Stage>;

// 24 · el caño del drenaje: la baba sube por el tubo transparente, el flotante de la bomba sube con el agua y se prende la luz roja
export const HSlimetube: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), lvl = win(u, 0.1, 0.65), red = u > 0.66, bl = red && Math.sin(u * 22) > -0.3;
  return <S3 p={lv([0.6, 0.75, 1.6], [0.3, 0.6, 1.15], win(u, 0, 1))} l={[0, 0.45, 0]} fov={38} floor="conc">
    <Cy rt={0.06} h={0.9} p={[-0.25, 0.45, 0]} c="#e9f3f6" ro={0.03} o={0.28} open seg={32} />
    <Cy rt={0.055} h={0.85 * lvl + 0.001} p={[-0.25, 0.02 + 0.425 * lvl, 0]} c="#6a7a3a" ro={0.4} o={0.92} />
    {Array.from({ length: 10 }, (_, i) => <Sp key={i} rad={0.012} p={[-0.25 + (rnd(i) - 0.5) * 0.07, 0.04 + rnd(i, 2) * 0.82 * lvl, 0.04]} c="#3a4a1a" ro={0.3} />)}
    <Bx s={[0.42, 0.42, 0.34]} p={[0.25, 0.21, 0]} c="#d6d0c1" ro={0.45} m={0.15} rad={0.03} />
    <Bx s={[0.08, 0.5, 0.06]} p={[0.08, 0.45, 0.2]} c="#f4f3ee" ro={0.4} o={0.4} />
    <Bx s={[0.06, 0.04, 0.04]} p={[0.08, 0.04 + 0.42 * lvl, 0.2]} c="#e8402f" ro={0.4} />
    <Bx s={[0.14, 0.08, 0.02]} p={[0.25, 0.32, 0.18]} c="#1b1b1b" ro={0.3} />
    <Sp rad={0.022} p={[0.25, 0.32, 0.2]} c={bl ? "#ff3b2f" : "#3a1a14"} e={bl ? "#ff2a1a" : undefined} ei={3} ns />
    <pointLight position={[0.25, 0.35, 0.5]} intensity={red ? 1.2 + 1.3 * (0.5 + 0.5 * Math.sin(u * 22)) : 0} distance={1.4} color="#ff3020" />
    <Tube pts={[[-0.25, 0.9, 0], [-0.1, 1.0, 0], [0.25, 0.95, 0], [0.25, 0.42, 0]]} rad={0.012} c="#f4f3ee" ro={0.4} />
    {red && <group position={[0.25, 0.6, 0.25]}><Txt t="CLOGGED" w={0.36} c="#ff8a7a" /></group>}
  </S3>;
}}</Stage>;

// 25 · el humidificador: la niebla sale en espiral, la aguja del higrómetro sube de 30 a 45 % y el termostato dice 68 pero «se siente 70»
const hygT = () => canvasTex("hyg25", 512, 512, (g) => { g.fillStyle = "#fbf8f0"; g.beginPath(); g.arc(256, 256, 250, 0, Math.PI * 2); g.fill(); g.fillStyle = "#2a2620"; g.textAlign = "center"; g.font = BOLD(44); for (let k = 0; k <= 5; k++) { const a = (-120 + k * 48) * D2R; g.fillText(`${10 + k * 10}`, 256 + 170 * Math.sin(a), 270 - 170 * Math.cos(a)); } g.font = BOLD(40); g.fillText("% RH", 256, 400); g.fillStyle = "#3a8a5a"; g.beginPath(); g.arc(256, 256, 215, (-90 - 120 + 3 * 48) * D2R, (-90 - 120 + 4 * 48) * D2R); g.arc(256, 256, 195, (-90 - 120 + 4 * 48) * D2R, (-90 - 120 + 3 * 48) * D2R, true); g.fill(); });
export const HMist: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), m = win(u, 0.05, 0.25), rh = lerp(30, 45, win(u, 0.2, 0.7)), ang = (-120 + (rh - 10) * 4.8) * D2R, feel = u > 0.72;
  return <S3 p={lv([0.3, 0.85, 1.9], [0.1, 0.75, 1.4], win(u, 0, 1))} l={[0.05, 0.5, 0]} fov={36}>
    <Cy rt={0.13} rb={0.16} h={0.36} p={[-0.4, 0.18, 0]} c="#f4f3ee" ro={0.3} seg={40} />
    <Cy rt={0.04} h={0.04} p={[-0.4, 0.38, 0]} c="#cfd8de" ro={0.3} />
    {Array.from({ length: 22 }, (_, i) => { const ph = (u * 1.3 + i / 22) % 1, a = ph * 6 + i; return <Puff key={i} p={[-0.4 + Math.cos(a) * ph * 0.2, 0.42 + ph * 0.8, Math.sin(a) * ph * 0.2]} s={0.1 + ph * 0.3} c="#eef6ff" add={false} o={0.5 * m * (1 - ph)} />; })}
    <group position={[0.15, 0.55, -0.1]}>
      <Cy rt={0.17} h={0.05} r={[Math.PI / 2, 0, 0]} c="#b8893a" m={0.9} ro={0.25} seg={48} />
      <mesh position={[0, 0, 0.026]}><circleGeometry args={[0.155, 48]} /><meshStandardMaterial map={hygT()} roughness={0.5} /></mesh>
      <group position={[0, 0, 0.032]} rotation={[0, 0, -ang]}><Bx s={[0.008, 0.13, 0.004]} p={[0, 0.05, 0]} c="#d8352a" ns /></group>
      <Sp rad={0.012} p={[0, 0, 0.035]} c="#2a2520" m={0.6} />
    </group>
    <group position={[0.58, 0.55, 0.0]} rotation={[0, -0.3, 0]}>
      <Bx s={[0.3, 0.22, 0.04]} c="#ecebe6" ro={0.4} rad={0.02} />
      <Pl w={0.24} h={0.1} p={[0, 0.02, 0.021]} map={lcd("68°", "#cfe8d0", "#1b2620", 512, 200, 160)} c="#ffffff" e="#9fd0a0" ei={0.6} ns />
    </group>
    {feel && <group position={[0.58, 0.82, 0.05]}><Txt t="FEELS LIKE 70" w={0.5} c="#ffd58a" o={win(u, 0.72, 0.8)} /></group>}
  </S3>;
}}</Stage>;

// 26 · el árbol de ductos: el aire sale del furnace por las ramas; las rejillas se cierran una por una y el aire se escapa silbando por las uniones
export const HDucts: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), shut = (k: number) => win(u, 0.2 + k * 0.1, 0.28 + k * 0.1), closed = [0, 1, 2].reduce((a, k) => a + shut(k), 0);
  const BR = [-0.6, 0, 0.6], DM = { c: "#c9cfd5", m: 0.85, ro: 0.3 };
  return <S3 p={lv([0.3, 1.35, 2.1], [0.1, 1.2, 1.7], win(u, 0, 1))} l={[0, 0.9, 0]} fov={40} floor="conc">
    <Bx s={[0.5, 0.6, 0.45]} p={[0, 0.3, 0]} c="#d6d0c1" ro={0.45} m={0.15} rad={0.03} />
    <Bx s={[1.5, 0.18, 0.22]} p={[0, 0.95, 0]} {...DM} /><Bx s={[0.22, 0.3, 0.22]} p={[0, 0.72, 0]} {...DM} />
    {BR.map((x, k) => <group key={k}>
      <Bx s={[0.14, 0.4, 0.14]} p={[x, 1.24, 0]} {...DM} />
      <group position={[x, 1.45, 0]} rotation={[0, 0, 0]}>{Array.from({ length: 4 }, (_, j) => <Bx key={j} s={[0.18, 0.006, 0.03]} p={[0, 0, -0.06 + j * 0.04]} r={[lerp(0.1, 1.45, 1 - shut(k)) , 0, 0]} c="#efe9dc" ro={0.5} />)}</group>
      {Array.from({ length: 6 }, (_, i) => { const ph = (u * 2 + i / 6) % 1; return <Dot key={i} p={[x + (rnd(i + k) - 0.5) * 0.05, 1.45 + ph * 0.4, (rnd(i, k) - 0.5) * 0.05]} r={0.014} st={[1, 2.5, 1]} c="#9fd2ff" add o={0.8 * (1 - shut(k)) * (1 - ph)} />; })}
    </group>)}
    {[-0.3, 0.3].map((x, k) => Array.from({ length: 8 }, (_, i) => { const ph = (u * 2.4 + i / 8) % 1, dir = k ? 1 : -1; return <Dot key={`l${k}${i}`} p={[x + dir * ph * 0.1, 0.95 + (rnd(i, k) - 0.5) * 0.1, 0.12 + ph * 0.45]} r={0.032} st={[1, 1, 2.5]} c="#ff9a6a" add o={cl((closed - 0.5) / 1.5) * (1 - ph)} />; }))}
    {[-0.3, 0.3].map((x, k) => Array.from({ length: 5 }, (_, i) => { const ph = (u * 1.6 + i / 5) % 1; return <Puff key={`p${k}${i}`} p={[x + (k ? 1 : -1) * ph * 0.15, 0.95, 0.12 + ph * 0.5]} s={0.08 + ph * 0.2} c="#e8e4dc" add={false} o={0.5 * cl((closed - 0.5) / 1.5) * Math.sin(ph * Math.PI)} />; }))}
    {closed > 2 && <group position={[0, 0.55, 0.45]}><Txt t="LEAKS" w={0.3} c="#ffb08a" /></group>}
  </S3>;
}}</Stage>;

// 27 · la escalera y la nota de Earl: la escalera de madera apoyada; una tarjeta escrita a mano cae girando y queda pegada al peldaño
const earlT = () => canvasTex("earl27", 600, 400, (g) => { g.fillStyle = "#fbf6e6"; g.fillRect(0, 0, 600, 400); g.strokeStyle = "#9ab8d8"; g.lineWidth = 3; for (let y = 90; y < 400; y += 60) { g.beginPath(); g.moveTo(20, y); g.lineTo(580, y); g.stroke(); }
  g.fillStyle = "#1f2a6a"; g.font = HANDF(76); g.fillText("Never climb", 40, 140); g.fillText("alone.", 40, 220); g.font = HANDF(64); g.fillText("— Earl", 300, 340); });
export const HLadder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), fall = drop(u, 0.25, 0.55), spin = (1 - fall) * 6, wob = Math.sin(u * 10) * 0.01 * win(u, 0.0, 0.2);
  return <S3 p={lv([0.9, 1.0, 2.4], [0.5, 1.0, 1.8], win(u, 0, 1))} l={[0, 0.95, 0]} fov={38} floor="conc">
    <mesh position={[0, 1.4, -0.42]} receiveShadow><planeGeometry args={[4, 3]} /><meshStandardMaterial map={PLASTER()} color="#d8cfbd" roughness={0.95} /></mesh>
    <group position={[0, 0, 0]} rotation={[-0.22 + wob, 0, 0]}>
      {[-0.22, 0.22].map((x, i) => <Bx key={i} s={[0.05, 2.0, 0.08]} p={[x, 1.0, 0]} c="#b5875c" ro={0.6} />)}
      {Array.from({ length: 7 }, (_, i) => <Bx key={i} s={[0.44, 0.04, 0.07]} p={[0, 0.25 + i * 0.27, 0]} c="#a87a50" ro={0.6} />)}
    </group>
    <group position={[0, lerp(2.3, 0.92, fall), lerp(0.4, 0.22, fall)]} rotation={[-0.22 + Math.sin(spin) * 0.4, spin, Math.cos(spin) * 0.2 * (1 - fall)]}>
      <Pl w={0.36} h={0.24} map={earlT()} c="#ffffff" ro={0.85} />
    </group>
    <spotLight position={[0.8, 2.2, 1.5]} angle={0.5} penumbra={0.6} intensity={12} distance={5} color="#fff0d8" />
  </S3>;
}}</Stage>;

// 28 · el teléfono de pared: suena y tiembla; en la pantallita «URGENT»; la mano lo levanta y lo cuelga de un golpe
export const HPhone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ring = u > 0.05 && u < 0.5 ? Math.sin(u * 220) * 0.02 : 0, lift = win(u, 0.5, 0.62) * (1 - drop(u, 0.68, 0.78)), slam = u > 0.78 && u < 0.82;
  return <S3 p={lv([0.5, 1.3, 1.5], [0.15, 1.2, 1.0], win(u, 0, 1))} l={[0, 1.15, 0]} fov={36} floor={null}>
    <mesh position={[0, 1.2, -0.02]} receiveShadow><planeGeometry args={[3, 2]} /><meshStandardMaterial map={PLASTER()} color="#d6c8a8" roughness={0.95} /></mesh>
    <group position={[ring, 1.15, 0.02]} rotation={[0, 0, ring * 3]}>
      <Bx s={[0.3, 0.46, 0.08]} c="#e8e2d0" ro={0.35} rad={0.03} />
      <Bx s={[0.18, 0.06, 0.01]} p={[0, 0.08, 0.042]} c="#101410" ro={0.3} />
      <Pl w={0.17} h={0.05} p={[0, 0.08, 0.048]} map={lcd(u > 0.05 && u < 0.5 ? "URGENT" : "", "#ff5a3a", "#100806", 512, 160, 110)} c="#ffffff" e="#ff4a2a" ei={0.6} ns />
      {Array.from({ length: 12 }, (_, i) => <Cy key={i} rt={0.014} h={0.01} p={[-0.06 + (i % 3) * 0.06, -0.02 - Math.floor(i / 3) * 0.045, 0.045]} r={[Math.PI / 2, 0, 0]} c="#f4f3ee" ro={0.4} />)}
    </group>
    <group position={[0.26 + lift * 0.25, 1.15 + lift * 0.15 + ring, 0.08 + lift * 0.3]} rotation={[0, 0, lift * 0.6 + ring * 4]}>
      <Bx s={[0.08, 0.4, 0.07]} c="#e8e2d0" ro={0.35} rad={0.03} />
      <Bx s={[0.12, 0.08, 0.09]} p={[0, 0.18, 0.02]} c="#e8e2d0" ro={0.35} rad={0.03} /><Bx s={[0.12, 0.08, 0.09]} p={[0, -0.18, 0.02]} c="#e8e2d0" ro={0.35} rad={0.03} />
    </group>
    <Tube pts={[[0.26, 0.95, 0.05], [0.3, 0.7, 0.12], [0.18, 0.65, 0.1], [0.24, 0.9, 0.06]]} rad={0.006} c="#d8d2c0" />
    {u > 0.05 && u < 0.5 && [0, 1, 2].map((k) => { const ph = (u * 6 + k / 3) % 1; return <To key={k} R={0.25 + ph * 0.25} t={0.006} p={[0, 1.15, 0.03]} c="#ffcf6a" e="#ffb84a" ei={1} o={0.6 * (1 - ph)} />; })}
    {slam && Array.from({ length: 10 }, (_, i) => <Dot key={i} p={[0.26 + (rnd(i) - 0.5) * 0.3, 1.15 + (rnd(i, 2) - 0.5) * 0.4, 0.15]} r={0.01} c="#fff2c8" add o={0.9} />)}
  </S3>;
}}</Stage>;

// 29 · el certificado: enmarcado en la pared; se raja por la mitad y las dos partes caen con el vidrio
const certT = () => canvasTex("cert29", 800, 600, (g) => { g.fillStyle = "#fbf6e6"; g.fillRect(0, 0, 800, 600); g.strokeStyle = "#b08a3e"; g.lineWidth = 14; g.strokeRect(30, 30, 740, 540); g.fillStyle = "#2a2620"; g.textAlign = "center"; g.font = BOLD(64); g.fillText("CERTIFIED", 400, 170); g.font = BOLD(46); g.fillText("COMFORT EXPERT", 400, 250); g.font = HANDF(54); g.fillText("Gold Star Club", 400, 360); g.fillStyle = "#c9a23a"; g.beginPath(); g.arc(400, 470, 50, 0, Math.PI * 2); g.fill(); });
export const HCertificate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), crk = win(u, 0.3, 0.45), f = drop(u, 0.48, 0.75), sep = crk * 0.02 + f * 0.15;
  const half = (s: number) => { const tx = certT(), m = canvasTex(`cert29${s}`, 4, 4, () => {}); m.image = tx.image; m.repeat.set(0.5, 1); m.offset.set(s > 0 ? 0.5 : 0, 0); m.needsUpdate = true; return m; };
  return <S3 p={lv([0.4, 1.25, 1.6], [0.15, 1.1, 1.15], win(u, 0, 1))} l={[0, 1.0, 0]} fov={38} floor="wood">
    <mesh position={[0, 1.3, -0.03]} receiveShadow><planeGeometry args={[3, 2.4]} /><meshStandardMaterial map={PLASTER()} color="#cfc4ae" roughness={0.95} /></mesh>
    {[-1, 1].map((s) => <group key={s} position={[s * (0.2 + sep), lerp(1.2, 0.2, f), 0.02 + f * 0.15]} rotation={[f * 0.3 * s, 0, s * -(crk * 0.04 + f * 0.6)]}>
      <Bx s={[0.4, 0.6, 0.03]} p={[s * 0.0, 0, -0.01]} c="#3a2618" ro={0.4} />
      <Pl w={0.36} h={0.54} p={[0, 0, 0.007]} map={half(s)} c="#ffffff" ro={0.8} />
    </group>)}
    {crk > 0 && f < 0.5 && <Bx s={[0.006, 0.6 * crk, 0.01]} p={[0, 1.2 + 0.3 * (1 - crk), 0.03]} c="#1b1b1b" ns />}
    {f > 0.95 && Array.from({ length: 12 }, (_, i) => <Bx key={i} s={[0.03, 0.002, 0.02]} p={[(rnd(i) - 0.5) * 0.7, 0.003, 0.15 + rnd(i, 2) * 0.3]} r={[0, rnd(i, 3) * 3, 0]} c="#e9f3f6" m={0.3} ro={0.05} o={0.6} />)}
  </S3>;
}}</Stage>;

// 30 · los quemadores: el piloto del encendedor se pone al rojo y los cinco quemadores se prenden en cadena, de izquierda a derecha, en azul
export const HBurners: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ig = win(u, 0.05, 0.2), on = (i: number) => win(u, 0.25 + i * 0.08, 0.3 + i * 0.08);
  return <S3 p={lv([0.6, 0.55, 1.4], [0.2, 0.45, 0.95], win(u, 0, 1))} l={[0, 0.2, 0]} fov={38} floor="conc" env={0.15} exp={0.75}>
    <Bx s={[1.3, 0.04, 0.4]} p={[0, 0.06, 0]} c="#6a6e74" m={0.6} ro={0.4} />
    {Array.from({ length: 5 }, (_, i) => { const x = -0.48 + i * 0.24, k = on(i); return <group key={i}>
      <Cy rt={0.035} h={0.36} p={[x, 0.12, 0]} r={[Math.PI / 2, 0, 0]} c="#9aa0a7" m={0.85} ro={0.3} />
      {Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[x, 0.16, -0.14 + j * 0.056]} scale={[1, k, 1]}><coneGeometry args={[0.018, 0.12, 12]} /><meshBasicMaterial color="#4a8aff" transparent opacity={0.8 * k} blending={2} depthWrite={false} /></mesh>)}
      {k > 0 && <pointLight position={[x, 0.25, 0.1]} intensity={0.9 * k} distance={0.6} color="#5a9aff" />}
    </group>; })}
    <Bx s={[0.02, 0.06, 0.02]} p={[-0.62, 0.14, 0]} c={ig > 0.5 ? "#ff6a2a" : "#4a4e54"} e={ig > 0.5 ? "#ff4a1a" : undefined} ei={2 * ig} />
    {ig > 0.5 && <pointLight position={[-0.62, 0.18, 0.1]} intensity={1.2} distance={0.5} color="#ff6a2a" />}
  </S3>;
}}</Stage>;

// 31 · la tarjeta en la heladera: entre dibujos de chicos, la tarjeta de «MARCUS HVAC» llega volando y un imán la clava de un golpe
const kid = (k: number) => canvasTex(`kid31${k}`, 300, 360, (g) => { g.fillStyle = "#ffffff"; g.fillRect(0, 0, 300, 360); g.lineWidth = 10; g.strokeStyle = ["#e8402f", "#3a7ad8", "#3a9a5a"][k]; g.beginPath(); if (k === 0) { g.arc(150, 120, 60, 0, Math.PI * 2); g.moveTo(150, 180); g.lineTo(150, 300); } else if (k === 1) { g.moveTo(40, 300); g.lineTo(150, 80); g.lineTo(260, 300); g.closePath(); } else { g.rect(60, 120, 180, 160); g.moveTo(40, 130); g.lineTo(150, 40); g.lineTo(260, 130); } g.stroke(); });
const cardT = () => canvasTex("card31", 600, 340, (g) => { g.fillStyle = "#fbfaf4"; g.fillRect(0, 0, 600, 340); g.fillStyle = "#1b3a6a"; g.fillRect(0, 0, 600, 90); g.fillStyle = "#fff"; g.font = BOLD(60); g.fillText("MARCUS HVAC", 30, 66); g.fillStyle = "#2a2620"; g.font = BOLD(40); g.fillText("Honest tune-ups", 30, 170); g.font = MONO(40); g.fillText("Dayton, OH", 30, 260); });
export const HMagnet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), fly = win(u, 0.12, 0.38), mg = drop(u, 0.4, 0.5), hit = u > 0.48 && u < 0.56;
  return <S3 p={lv([0.35, 1.25, 1.4], [0.1, 1.15, 0.85], win(u, 0, 1))} l={[0.05, 1.15, 0]} fov={38} floor={null}>
    <Bx s={[1.1, 2.2, 0.6]} p={[0, 1.1, -0.32]} c="#e9ecef" m={0.35} ro={0.25} rad={0.03} />
    <Bx s={[0.04, 0.5, 0.05]} p={[0.48, 1.25, 0.0]} c="#c9cfd5" m={0.85} ro={0.25} />
    {[[-0.32, 1.45, 0.1], [0.22, 1.5, -0.08], [-0.28, 0.95, 0.06]].map(([x, y, r], k) => <group key={k} position={[x, y, -0.012]} rotation={[0, 0, r]}>
      <Pl w={0.24} h={0.29} map={kid(k)} c="#ffffff" ro={0.85} /><Sp rad={0.022} p={[0, 0.13, 0.01]} sc={[1, 1, 0.5]} c={["#3a9a5a", "#e8c02f", "#e8402f"][k]} ro={0.3} />
    </group>)}
    <group position={[lerp(1.2, 0.12, fly), lerp(1.6, 1.08, fly), lerp(0.8, -0.008, fly)]} rotation={[0, (1 - fly) * 1.5, (1 - fly) * 2 - 0.05]}>
      <Pl w={0.5} h={0.28} map={cardT()} c="#ffffff" ro={0.8} />
    </group>
    {u > 0.38 && <group position={[0.34, 1.2, lerp(0.5, 0.012, mg)]}><Cy rt={0.035} h={0.025} r={[Math.PI / 2, 0, 0]} c="#c62828" ro={0.35} m={0.2} /></group>}
    {hit && Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2; return <Dot key={i} p={[0.34 + Math.cos(a) * 0.08, 1.2 + Math.sin(a) * 0.08, 0.02]} r={0.008} c="#fff2c8" add o={0.9} />; })}
  </S3>;
}}</Stage>;
