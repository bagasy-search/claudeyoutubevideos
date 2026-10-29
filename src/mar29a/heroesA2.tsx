// mar29a · componentes únicos 15-28, vuelta 3: objetos 3D de verdad (three.js, kit r3k) sobre la foto desenfocada del momento.
// La acción se reparte en TODO el plano (u = 0..1). Mecanismos propios de la tanda (ver D:/rtmp/mar29_COMPONENTES.md).
import React from "react";
import { H, Stage } from "./hkit";
import { BLOCKS, BOLD, Bx, Cy, D2R, Dot, Filt, Flame, HANDF, PLASTER, Pl, Puff, S3, Sp, To, Tube, Txt, V3, canvasTex, cl, drop, lerp, lv, rnd, win } from "../kits/r3k/r3k";

const dur = (h: H) => h.out - h.at;
const U = (tt: number, h: H) => cl(tt / dur(h));
const C: React.FC<{ x?: number; y?: number; children: React.ReactNode }> = ({ x = 960, y = 560, children }) =>
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}>{children}</div>;
const STEEL = { c: "#b9c0c7", m: 0.75, ro: 0.32 };

// 15 · macro de la malla mojada: gotas brillantes en la trama; si no se seca, crecen colonias peludas desde las esquinas y sueltan esporas hacia la cámara
export const HMold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), dry = win(u, 0.05, 0.3), sp = win(u, 0.55, 0.75);
  const CORN: V3[] = [[-0.8, 0.55, 0], [0.8, 0.55, 0], [-0.8, -0.55, 0], [0.8, -0.55, 0]];
  return <S3 p={lv([0.35, 0.25, 2.5], [0.12, 0.05, 1.45], win(u, 0, 1))} l={[0, 0, 0]} fov={34} floor={null} exp={0.95}>
    <mesh position={[0, 0, -0.08]}><planeGeometry args={[3.2, 2.2]} /><meshStandardMaterial color="#3c3a33" roughness={0.9} transparent opacity={0.75} /></mesh>
    {Array.from({ length: 11 }, (_, i) => <Cy key={`h${i}`} rt={0.006} h={2.4} p={[0, -0.75 + i * 0.15 + (rnd(i, 7) - 0.5) * 0.03, 0]} r={[0, 0, Math.PI / 2 + (rnd(i, 8) - 0.5) * 0.04]} c="#d9d2bf" ro={0.95} seg={8} />)}
    {Array.from({ length: 16 }, (_, i) => <Cy key={`v${i}`} rt={0.006} h={1.7} p={[-1.125 + i * 0.15 + (rnd(i, 9) - 0.5) * 0.03, 0, 0.012]} r={[0, 0, (rnd(i, 6) - 0.5) * 0.05]} c="#d9d2bf" ro={0.95} seg={8} />)}
    {Array.from({ length: 26 }, (_, i) => { const s = (0.035 + rnd(i, 2) * 0.04) * (1 - 0.35 * dry); return <Sp key={`d${i}`} rad={s} p={[-1.05 + Math.floor(rnd(i) * 15) * 0.15, -0.6 + Math.floor(rnd(i, 3) * 9) * 0.15, 0.03]} sc={[1, 1.15, 0.7]} c="#eaf6ff" m={0.4} ro={0.02} o={0.85} />; })}
    {CORN.map((c, j) => Array.from({ length: 44 }, (_, i) => { const n = i + j * 50, a = rnd(n) * Math.PI * 2, rr = Math.sqrt(rnd(n, 2)), r = rr * lerp(0.3, 0.75, win(u, 0.3, 0.95)), g = win(u, 0.12 + rr * 0.45, 0.4 + rr * 0.5);
      if (g <= 0) return null;
      return <group key={`m${j}_${i}`} position={[c[0] - Math.sign(c[0]) * Math.abs(Math.cos(a)) * r * 0.9, c[1] - Math.sign(c[1]) * Math.abs(Math.sin(a)) * r * 0.8, 0.03 + rnd(i, 6) * 0.05]} scale={g}>
        <Sp rad={0.035 + rnd(i, 7) * 0.03} c={i % 3 ? "#56603a" : "#2e3524"} ro={1} />
        <Tube pts={[[0, 0, 0], [0.02 * Math.cos(a), 0.03, 0.05], [0.05 * Math.cos(a), 0.05, 0.1]]} rad={0.005} c="#d8dcc4" ro={1} seg={8} />
        <Sp rad={0.012} p={[0.05 * Math.cos(a), 0.05, 0.1]} c="#eef0de" ro={1} />
      </group>; }))}
    {sp > 0 && Array.from({ length: 110 }, (_, i) => { const c = CORN[i % 4], k = cl((u - 0.5 - rnd(i) * 0.3) / 0.35); if (k <= 0) return null;
      return <Dot key={`s${i}`} p={[c[0] * (1 - 0.7 * k) + (rnd(i, 2) - 0.5) * 0.4, c[1] * (1 - 0.7 * k) + (rnd(i, 3) - 0.5) * 0.4, 0.1 + k * (0.8 + rnd(i, 4) * 0.7)]} r={0.01 + 0.012 * k} c="#c9d98a" add o={0.85 * (1 - k * 0.5)} />; })}
  </S3>;
}}</Stage>;

// 16 · el ducto de retorno con la ranura del filtro vacía (el filtro quedó apoyado detrás del calefón): el polvo entra en espiral por el hueco
export const HSuction: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), SLOT: V3 = [0, 0.62, 0.23], go = win(u, 0.05, 0.3);
  return <S3 p={lv([0.35, 1.25, 1.75], [0.1, 1.0, 1.35], win(u, 0, 1))} l={[0, 0.58, 0.1]} fov={40} floor="conc">
    <mesh position={[0, 1.2, -0.5]} receiveShadow><planeGeometry args={[8, 5]} /><meshStandardMaterial map={BLOCKS()} color="#a89e8e" roughness={0.95} /></mesh>
    <Bx s={[1.6, 0.5, 0.46]} p={[0, 0.37, 0]} {...STEEL} rad={0.01} />
    {[-0.75, 0.75].map((x, i) => <Bx key={i} s={[0.03, 0.54, 0.5]} p={[x, 0.37, 0]} {...STEEL} ro={0.25} />)}
    <Bx s={[0.62, 0.012, 0.09]} p={[SLOT[0], SLOT[1] + 0.001, SLOT[2] - 0.06]} c="#020202" ro={1} ns />
    <Bx s={[0.66, 0.02, 0.025]} p={[SLOT[0], SLOT[1] + 0.006, SLOT[2] - 0.115]} {...STEEL} ro={0.2} /><Bx s={[0.66, 0.02, 0.025]} p={[SLOT[0], SLOT[1] + 0.006, SLOT[2] - 0.005]} {...STEEL} ro={0.2} />
    <pointLight position={[0.3, 1.3, 0.9]} intensity={3} distance={2.5} color="#ffe8c8" />
    {Array.from({ length: 4 }, (_, sp) => Array.from({ length: 18 }, (_, j) => {
      const k = (u * 1.2 + j / 18 + sp * 0.25) % 1, ang = k * 10 + sp * 1.57, R = 0.6 * (1 - k) + 0.02, y = SLOT[1] + 0.75 * (1 - k) ** 1.3;
      return <Dot key={`${sp}_${j}`} p={[SLOT[0] + Math.cos(ang) * R, y, SLOT[2] - 0.06 + Math.sin(ang) * R * 0.5]} r={0.016 + 0.012 * (1 - k)} st={[1, 1, 2.5]} c={j % 3 ? "#d8cfbd" : "#8b8170"} o={0.92 * go * win(k, 0, 0.1) * (1 - win(k, 0.9, 1))} />;
    }))}
    <group position={[0.5, 0.95, 0.1]}><Txt t="NO FILTER" w={0.45} c="#ff9a7a" o={win(u, 0.2, 0.35)} /></group>
  </S3>;
}}</Stage>;

// 17 · dos máscaras: el aire pasa por dos filtros seguidos antes del soplador; se frena en cada uno, el rotor afloja y el motor se pone al rojo
export const HTwoMasks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), heat = win(u, 0.35, 0.9), rot = u * 34 - u * u * 14, F = [0.75, 1.35];
  return <S3 p={lv([1.6, 1.1, 3.2], [1.15, 0.9, 2.65], win(u, 0, 1))} l={[0, 0.45, 0.6]} fov={36}>
    <Cy rt={0.4} h={0.42} p={[0, 0.45, 0]} r={[Math.PI / 2, 0, 0]} {...STEEL} open seg={48} />
    <To R={0.4} t={0.025} p={[0, 0.45, 0.21]} c="#9aa1a8" m={0.8} ro={0.3} />
    <group position={[0, 0.45, 0]} rotation={[0, 0, rot]}>{Array.from({ length: 24 }, (_, i) => { const a = i / 24 * Math.PI * 2; return <Bx key={i} s={[0.08, 0.012, 0.38]} p={[Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0]} r={[0, 0, a + 0.5]} c="#5c636b" m={0.7} ro={0.35} ns />; })}</group>
    <Cy rt={0.12} h={0.3} p={[0, 0.45, -0.25]} r={[Math.PI / 2, 0, 0]} c="#3a3d42" m={0.4} ro={0.4} e="#ff3a10" ei={heat * 1.6} />
    {heat > 0.3 && <pointLight position={[0, 0.45, -0.1]} intensity={2.5 * heat} distance={1.2} color="#ff5a20" />}
    <Bx s={[0.5, 0.08, 0.5]} p={[0, 0.04, 0]} c="#2e3136" m={0.3} ro={0.5} />
    {F.map((z, i) => <Filt key={i} w={0.96} h={0.86} d={0.07} g={win(u, 0.1 + i * 0.1, 0.8) * (i ? 0.25 : 0.85)} p={[0, 0.45, z]} />)}
    <mesh position={[0, 0.45, 0.02]}><circleGeometry args={[0.34, 40]} /><meshBasicMaterial color="#8a929b" transparent opacity={0.35 * (1 - u * 0.7)} depthWrite={false} /></mesh>
    {heat > 0.3 && <Puff p={[0, 0.45, -0.2]} s={1.2} c="#ff4a1a" o={0.35 * heat} />}
    {Array.from({ length: 120 }, (_, i) => {
      const k = (u * (1.3 - 0.6 * u) + rnd(i)) % 1, x = (rnd(i, 2) - 0.5) * 0.7, y = 0.45 + (rnd(i, 3) - 0.5) * 0.7, stick = rnd(i, 4);
      const s2 = stick < 0.7 * win(u, 0.1, 0.6), s1 = !s2 && stick < 0.82 * win(u, 0.15, 0.7), z0 = lerp(2.6, -0.1, k), stop = s1 ? F[1] + 0.04 : s2 ? F[0] + 0.04 : -9;
      const held = z0 < stop, z = held ? stop : z0;
      return <Dot key={i} p={[x, y, z]} r={held ? 0.016 : 0.012} st={held ? [1, 1, 1] : [1, 1, 3]} c={held ? "#7d7362" : "#e8f3ff"} add={!held} o={0.9} />;
    })}
  </S3>;
}}</Stage>;

// 18 · la caja del filtro en el estante: la etiqueta con la fecha («CHANGED 3/14») se despega como una curita, cae al piso y deja la marca del pegamento
const boxT = () => canvasTex("box18", 1024, 640, (g) => { g.fillStyle = "#c39c63"; g.fillRect(0, 0, 1024, 640); for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(90,60,25,${rnd(i) * 0.08})`; g.fillRect(rnd(i, 2) * 1024, rnd(i, 3) * 640, 4, 2 + rnd(i, 4) * 30); }
  g.fillStyle = "#2a3b55"; g.fillRect(0, 0, 1024, 120); g.fillStyle = "#fff"; g.font = BOLD(72); g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("AIR FILTER", 40, 62); g.fillStyle = "#2a3b55"; g.font = BOLD(110); g.fillText("16 x 25 x 1", 40, 560); });
const labelT = () => canvasTex("lab18", 600, 300, (g) => { g.fillStyle = "#fbf8ee"; g.fillRect(0, 0, 600, 300); g.fillStyle = "#d4372c"; g.fillRect(0, 0, 600, 70); g.fillStyle = "#fff"; g.font = BOLD(46); g.textAlign = "center"; g.fillText("CHANGED", 300, 52); g.fillStyle = "#1f3a7a"; g.font = HANDF(130); g.textBaseline = "middle"; g.fillText("3/14", 300, 190); });
const glueT = () => canvasTex("glue18", 600, 300, (g) => { g.fillStyle = "rgba(235,222,190,.85)"; g.fillRect(10, 10, 580, 280); for (let i = 0; i < 14; i++) { g.fillStyle = "rgba(252,248,238,.95)"; g.beginPath(); const x = rnd(i) * 560 + 20, y = rnd(i, 2) * 260 + 20; g.moveTo(x, y); g.lineTo(x + 20 + rnd(i, 3) * 40, y + 6); g.lineTo(x + 8, y + 18 + rnd(i, 4) * 20); g.fill(); } });
export const HSticker: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), peel = win(u, 0.08, 0.5), fall = drop(u, 0.5, 0.72), BW = 1.0, BH = 0.62, BD = 0.12, top: V3 = [0.1, 0.42 + 0.22, BD / 2 + 0.002];
  const fallen = u > 0.5, p: V3 = fallen ? lv(top, [0.05, 0.006, 0.36], fall) : top;
  const rx = fallen ? lerp(-peel * 1.3, -Math.PI / 2, fall) : -peel * 1.3;
  return <S3 p={lv([0.35, 0.75, 2.2], [0.25, 0.6, 1.45], win(u, 0, 1))} l={lv([0.05, 0.4, 0], [0.05, 0.2, 0.2], win(u, 0.4, 0.9))} fov={36}>
    <Bx s={[BW, BH, BD]} p={[0, BH / 2 + 0.11, 0]} c="#c39c63" ro={0.9} rad={0.005} />
    <Pl w={BW} h={BH} p={[0, BH / 2 + 0.11, BD / 2 + 0.001]} map={boxT()} c="#ffffff" ro={0.9} ns />
    <Bx s={[0.9, 0.11, 0.1]} p={[0.15, 0.055, -0.1]} c="#c39c63" ro={0.9} rad={0.005} />
    {peel > 0.05 && <Pl w={0.44} h={0.22} p={[0.1, 0.42 + 0.11, BD / 2 + 0.0015]} map={glueT()} c="#ffffff" ro={0.15} o={0.99} ns />}
    <group position={p} rotation={[rx, fallen ? fall * 0.5 : 0, 0]}>
      <Pl w={0.44} h={0.22} p={[0, -0.11, 0]} map={labelT()} c="#ffffff" ro={0.7} />
    </group>
  </S3>;
}}</Stage>;

// 19 · las reglas de Earl: el filtro empieza a salir con el furnace prendido; cae una cruz roja pesada; el filtro vuelve, la llama se apaga y recién ahí sale
export const HRules: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), out1 = win(u, 0.04, 0.24) * (1 - win(u, 0.4, 0.52)), xdrop = drop(u, 0.24, 0.36), xgo = win(u, 0.58, 0.7), off = win(u, 0.5, 0.62), out2 = win(u, 0.72, 0.95);
  const fz = lerp(-0.08, 0.5, Math.max(out1, out2));
  return <S3 p={lv([1.0, 2.0, 2.7], [0.5, 1.75, 2.1], win(u, 0, 1))} l={[0, 0.85, 0.2]} fov={36} floor="conc">
    <Bx s={[0.95, 1.45, 0.75]} p={[0, 0.725, -0.05]} c="#d6d0c1" ro={0.45} m={0.15} rad={0.03} />
    <Bx s={[0.85, 0.62, 0.01]} p={[0, 0.45, 0.325]} c="#cbc4b2" ro={0.5} m={0.15} ns />
    {Array.from({ length: 6 }, (_, i) => <Sp key={`r${i}`} rad={0.012} p={[i % 2 ? 0.43 : -0.43, 0.2 + Math.floor(i / 2) * 0.45, 0.332]} c="#8d949c" m={0.9} ro={0.3} ns />)}
    <Cy rt={0.17} h={0.04} p={[0.15, 0.5, 0.33]} r={[Math.PI / 2, 0, 0]} c="#2a2c30" m={0.5} ro={0.4} />
    <mesh position={[0.15, 0.5, 0.352]}><circleGeometry args={[0.145, 32]} /><meshStandardMaterial color="#120c08" /></mesh>
    {Array.from({ length: 3 }, (_, i) => <group key={i} position={[0.08 + i * 0.07, 0.4, 0.356]} scale={[1, Math.max(0.02, (1 - off) * (1 + 0.3 * win(u, 0.3, 0.45))), 1]}><Flame p={[0, 0, 0]} s={1.3} u={u} i={i} warm={0} /></group>)}
    <pointLight position={[0.15, 0.5, 0.5]} intensity={1.6 * (1 - off)} distance={1} color="#6aa0ff" />
    <Bx s={[0.68, 0.06, 0.02]} p={[0, 1.1, 0.33]} c="#050505" ns />
    <Filt w={0.62} h={0.55} d={0.05} g={0.5} p={[0, 1.1, fz]} r={[-Math.PI / 2, 0, 0]} />
    <group position={[0, lerp(2.9, 1.2, xdrop) + xgo * 2.0, 0.5]} rotation={[-Math.PI / 2 + 0.25, 0, Math.PI / 4]}>
      <Bx s={[0.7, 0.14, 0.1]} c="#d22a24" ro={0.4} rad={0.03} /><Bx s={[0.14, 0.7, 0.1]} c="#d22a24" ro={0.4} rad={0.03} />
    </group>
  </S3>;
}}</Stage>;

// 20 · el motor del soplador en el banco, visto como cámara térmica: pasa de azul a rojo, la retícula sube 90→210 °F, larga humo y se balancea la etiqueta de $650
const tagT = () => canvasTex("tag20", 400, 220, (g) => { g.fillStyle = "#f4e7c4"; g.beginPath(); g.moveTo(60, 0); g.lineTo(400, 0); g.lineTo(400, 220); g.lineTo(60, 220); g.lineTo(0, 110); g.closePath(); g.fill(); g.fillStyle = "#3a2a10"; g.beginPath(); g.arc(50, 110, 16, 0, Math.PI * 2); g.fill(); g.fillStyle = "#b8221c"; g.font = BOLD(120); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("$650", 235, 118); });
const thermal = (k: number) => { const S = ["#1a2bd8", "#5a22c8", "#c4205a", "#ff2a14"]; const x = cl(k) * (S.length - 1), i = Math.min(S.length - 2, Math.floor(x)); const a = parseInt(S[i].slice(1), 16), b = parseInt(S[i + 1].slice(1), 16), f = x - i;
  const ch = (s: number) => Math.round(lerp((a >> s) & 255, (b >> s) & 255, f)); return `rgb(${ch(16)},${ch(8)},${ch(0)})`; };
export const HThermal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.08, 0.7), col = thermal(k), deg = Math.round(lerp(90, 210, k)), smoke = win(u, 0.5, 0.75), sw = Math.sin(u * 14) * 0.35 * (1 - u * 0.5);
  return <>
    <S3 p={lv([1.0, 0.95, 1.95], [0.55, 0.72, 1.3], win(u, 0, 1))} l={[0.05, 0.42, 0]} fov={34} floor="wood" env={0.3} exp={0.9}>
      <Bx s={[1.6, 0.06, 0.8]} p={[0, 0.17, 0]} c="#6a4a2c" ro={0.7} /><Bx s={[0.06, 0.17, 0.06]} p={[-0.7, 0.085, 0.3]} c="#4a3420" /><Bx s={[0.06, 0.17, 0.06]} p={[0.7, 0.085, 0.3]} c="#4a3420" />
      <Bx s={[0.42, 0.03, 0.26]} p={[0, 0.215, 0]} c="#2b2d31" m={0.5} ro={0.4} />
      <group position={[0, 0.43, 0]} rotation={[0, 0, Math.PI / 2]}>
        <Cy rt={0.17} h={0.44} c={col} e={col} ei={0.75} ro={0.5} m={0.2} seg={48} />
        {Array.from({ length: 18 }, (_, i) => { const a = i / 18 * Math.PI * 2; return <Bx key={i} s={[0.028, 0.4, 0.012]} p={[Math.cos(a) * 0.18, 0, Math.sin(a) * 0.18]} r={[0, -a, 0]} c={col} e={col} ei={0.6} ro={0.5} ns />; })}
        <Cy rt={0.19} rb={0.16} h={0.07} p={[0, 0.255, 0]} c="#3a3d42" m={0.6} ro={0.35} /><Cy rt={0.16} rb={0.19} h={0.07} p={[0, -0.255, 0]} c="#3a3d42" m={0.6} ro={0.35} />
        <To R={0.11} t={0.03} p={[0, 0.296, 0]} r={[Math.PI / 2, 0, 0]} c="#c8742e" m={0.9} ro={0.3} e="#ff3a10" ei={k * 0.9} />
        <Cy rt={0.022} h={0.22} p={[0, -0.38, 0]} c="#9aa0a7" m={0.9} ro={0.2} />
      </group>
      <Tube pts={[[0.1, 0.62, 0.05], [0.2, 0.52, 0.18], [0.26, 0.4, 0.24]]} rad={0.003} c="#cfc6a8" seg={10} />
      <group position={[0.26, 0.4, 0.24]} rotation={[0, 0.3, sw]}><Pl w={0.34} h={0.19} p={[0.17, 0, 0]} map={tagT()} c="#ffffff" ro={0.8} /></group>
      {smoke > 0 && Array.from({ length: 12 }, (_, i) => { const ph = (u * 1.6 + i / 12) % 1; return <Puff key={i} p={[(rnd(i) - 0.5) * 0.3 + ph * 0.1, 0.6 + ph * 0.7, (rnd(i, 2) - 0.5) * 0.1]} s={0.22 + ph * 0.45} c="#8d8d96" add={false} o={0.5 * smoke * Math.sin(ph * Math.PI)} />; })}
      {k > 0.4 && <pointLight position={[0, 0.5, 0.4]} intensity={2.5 * k} distance={1.4} color="#ff4a20" />}
    </S3>
    <C x={1500} y={190}><div style={{ fontFamily: "Arial Black, Arial", fontWeight: 900, fontSize: 120, color: "#fff", textShadow: "0 6px 30px rgba(0,0,0,.8)", background: "rgba(0,0,0,.45)", padding: "6px 30px", borderRadius: 16 }}>{String(deg).padStart(3, "0")}°F</div></C>
  </>;
}}</Stage>;

// 21 · el intercambiador de calor de concha dentro del furnace abierto: los quemadores calientan, la grieta avanza entre los remaches y las mitades se separan con luz naranja
const CRACK: V3[] = [[-0.02, 0.98, 0.17], [0.03, 0.88, 0.17], [-0.03, 0.8, 0.17], [0.04, 0.7, 0.17], [-0.01, 0.6, 0.17], [0.05, 0.5, 0.17], [0.0, 0.42, 0.17]];
export const HCrack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), n = Math.max(2, Math.round(lerp(2, CRACK.length, win(u, 0.15, 0.6)))), sp = win(u, 0.65, 0.9), glow = win(u, 0.15, 0.6);
  return <S3 p={lv([0.9, 1.05, 2.6], [0.35, 0.85, 2.0], win(u, 0, 1))} l={[0, 0.7, 0]} fov={38} floor="conc">
    <Cy rt={0.17} h={0.28} p={[0, 0.17, -0.12]} r={[Math.PI / 2, 0, 0]} c="#6f757c" m={0.6} ro={0.4} />
    <Tube pts={[[0.48, 0.33, 0.1], [0.3, 0.33, 0.1], [0.1, 0.33, 0.12]]} rad={0.018} c="#c9a227" m={0.6} ro={0.35} />
    <Bx s={[0.9, 0.02, 0.7]} p={[0, 0.02, 0]} c="#3b3e43" m={0.4} ro={0.5} />
    <Bx s={[1.0, 1.4, 0.05]} p={[0, 0.7, -0.4]} c="#d8d2c4" ro={0.5} />
    <Bx s={[0.05, 1.4, 0.8]} p={[-0.5, 0.7, 0]} c="#d8d2c4" ro={0.5} /><Bx s={[0.05, 1.4, 0.8]} p={[0.5, 0.7, 0]} c="#d8d2c4" ro={0.5} />
    <Bx s={[1.0, 0.05, 0.8]} p={[0, 1.4, 0]} c="#d8d2c4" ro={0.5} />
    {[-1, 1].map((sgn, k) => <group key={k} position={[sgn * sp * 0.12, 0, 0]} rotation={[0, sgn * sp * 0.25, 0]}>
      <Bx s={[0.34, 0.6, 0.3]} p={[sgn * 0.17, 0.7, 0]} c="#7d8288" m={0.7} ro={0.45} rad={0.08} />
      {Array.from({ length: 6 }, (_, i) => <Sp key={i} rad={0.016} p={[sgn * 0.04, 0.45 + i * 0.1, 0.16]} c="#3d4045" m={0.9} ro={0.3} />)}
    </group>)}
    <Tube pts={CRACK.slice(0, n)} rad={0.01} c="#ff7a20" e="#ff6a10" ei={2.2 * glow} seg={40} />
    <pointLight position={[0, 0.7, 0.35]} intensity={0.6 * glow + 4 * sp} distance={1.4} color="#ff8a30" />
    {sp > 0 && <Pl w={0.12 * sp + 0.01} h={0.58} p={[0, 0.7, 0.1]} c="#ffb060" o={0.9} add />}
    <Bx s={[0.8, 0.06, 0.2]} p={[0, 0.3, 0.05]} c="#2b2d31" m={0.4} />
    {Array.from({ length: 7 }, (_, i) => <Flame key={i} p={[-0.3 + i * 0.1, 0.33, 0.05]} s={1.2} u={u} i={i} />)}
  </S3>;
}}</Stage>;

// 22 · la serpentina del aire acondicionado: el cobre zigzaguea entre las aletas, la escarcha sube desde abajo aleta por aleta, gotea, y un bloque de hielo cae a la bandeja
export const HIce: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), NF = 22, slab = drop(u, 0.68, 0.82), fz = win(u, 0.06, 0.6);
  const pipe: V3[] = []; for (let r = 0; r < 5; r++) { const y = 0.25 + r * 0.17, z = r % 2 ? 0.05 : -0.05; pipe.push(r % 2 ? [0.62, y, z] : [-0.62, y, z], r % 2 ? [-0.62, y, z] : [0.62, y, z]); }
  return <S3 p={lv([1.2, 1.0, 2.6], [0.55, 0.8, 1.9], win(u, 0, 1))} l={[0, 0.5, 0]} fov={38} floor="conc">
    {Array.from({ length: NF }, (_, i) => { const x = -0.55 + i * (1.1 / (NF - 1)), fh = 0.9 * win(u, 0.05 + rnd(i) * 0.08, 0.62 + rnd(i, 2) * 0.1);
      return <group key={i}>
        <Bx s={[0.006, 0.9, 0.24]} p={[x, 0.6, 0]} c="#c8ced4" m={0.85} ro={0.3} ns />
        {fh > 0.01 && slab < 0.05 && <Bx s={[0.03, fh, 0.3]} p={[x, 0.15 + fh / 2, 0]} c="#f2f8ff" ro={0.8} o={0.95} ns />}
      </group>; })}
    <Tube pts={pipe} rad={0.022} c="#d0824a" m={0.9} ro={0.25} seg={120} />
    <Bx s={[1.4, 0.06, 0.45]} p={[0, 0.03, 0]} c="#3a3d42" m={0.5} ro={0.4} />
    <Bx s={[1.36, 0.02, 0.41]} p={[0, 0.062, 0]} c="#9fc3d8" ro={0.05} o={0.6 * win(u, 0.3, 0.7) + 0.01} ns />
    {u > 0.3 && Array.from({ length: 10 }, (_, i) => { const ph = (u * 3 + rnd(i)) % 1; return <Dot key={i} p={[-0.5 + rnd(i, 2), lerp(0.15, 0.07, ph), (rnd(i, 3) - 0.5) * 0.2]} r={0.012} st={[1, 1.6, 1]} c="#cfefff" add o={0.8} />; })}
    {fz > 0.3 && <group position={[0, -0.5 * slab, 0.02 + 0.06 * slab]} rotation={[slab * 0.12, 0, 0]}>
      <Bx s={[1.18, 0.9 * fz, 0.32]} p={[0, 0.15 + 0.45 * fz, 0]} c="#eef6ff" ro={0.55} m={0.05} o={0.9} rad={0.03} />
      {Array.from({ length: 14 }, (_, i) => <Sp key={i} rad={0.05 + rnd(i) * 0.04} p={[-0.55 + i * 0.085, 0.15 + 0.9 * fz, (rnd(i, 2) - 0.5) * 0.2]} sc={[1, 0.6, 1]} c="#f4faff" ro={0.6} o={0.9} />)}
    </group>}
    {slab > 0.9 && Array.from({ length: 14 }, (_, i) => { const k = cl((u - 0.8) / 0.15); return <Dot key={`w${i}`} p={[(rnd(i) - 0.5) * 1.3, 0.08 + Math.sin(k * Math.PI) * 0.15 * rnd(i, 2), 0.25 + (rnd(i, 3) - 0.3) * 0.2 * k]} r={0.012} c="#cfefff" add o={1 - k} />; })}
  </S3>;
}}</Stage>;

// 23 · la pregunta de siempre («¿necesito filtro si limpio los ductos?»): el filtro baja a la ranura del ducto y cae una placa de acero con un solo «YES.»
export const HFaq: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ins = drop(u, 0.06, 0.4), pl = drop(u, 0.5, 0.66), vib = u > 0.64 ? Math.sin(u * 90) * Math.exp(-(u - 0.64) * 20) * 0.02 : 0;
  return <S3 p={lv([0.7, 1.15, 2.1], [0.3, 0.95, 1.6], win(u, 0, 1))} l={[0, 0.5, -0.3]} fov={38} floor="conc">
    <spotLight position={[1.2, 1.6, 0.8]} angle={0.35} penumbra={0.5} intensity={16} distance={4} color="#fff0d8" />
    <Bx s={[1.6, 0.5, 0.5]} p={[0, 0.25, -0.35]} {...STEEL} rad={0.01} />
    {[-0.7, -0.05, 0.6].map((x, i) => <Bx key={i} s={[0.03, 0.54, 0.54]} p={[x, 0.27, -0.35]} {...STEEL} ro={0.25} />)}
    <Bx s={[0.07, 0.012, 0.48]} p={[0.25, 0.505, -0.35]} c="#050505" ns />
    <Filt w={0.48} h={0.5} d={0.05} g={0} p={[0.25, lerp(0.95, 0.3, ins), -0.35]} r={[0, Math.PI / 2, 0]} />
    <group position={[-0.35, lerp(1.8, 0.71, pl), -0.35]} rotation={[vib, 0, vib * 0.5]}>
      <Bx s={[0.95, 0.4, 0.07]} c="#9ea6ae" m={0.9} ro={0.28} rad={0.02} />
      <Txt t="YES." w={0.62} c="#1f2226" p={[0, 0, 0.037]} />
      {[[-0.42, 0.15], [0.42, 0.15], [-0.42, -0.15], [0.42, -0.15]].map(([x, y], i) => <Sp key={i} rad={0.016} p={[x, y, 0.037]} c="#5c636b" m={0.9} />)}
    </group>
    {pl > 0.6 && Array.from({ length: 10 }, (_, i) => { const k = cl((u - 0.6) / 0.25); return <Puff key={i} p={[-0.35 + (rnd(i) - 0.5) * (0.6 + k), 0.52 + k * 0.1, -0.1 + (rnd(i, 2) - 0.5) * 0.3]} s={0.2 + k * 0.3} c="#a59a88" add={false} o={0.35 * (1 - k)} />; })}
  </S3>;
}}</Stage>;

// 24 · el filtro gordo de 4": entra en el gabinete y la ronda de los 12 meses gira alrededor; sólo enero y julio se levantan en verde, el resto cae
const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
export const HHelpers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ins = win(u, 0.04, 0.32), pick = win(u, 0.5, 0.68), fall = win(u, 0.52, 0.78), spin = u * 1.6;
  return <S3 p={lv([0.3, 1.7, 3.6], [0.1, 1.45, 3.0], win(u, 0, 1))} l={[0, 0.5, 0]} fov={38}>
    <spotLight position={[1.4, 1.0, 1.2]} angle={0.45} penumbra={0.6} intensity={12} distance={4} color="#fff0d8" />
    <Bx s={[0.62, 0.62, 0.32]} p={[0, 0.5, 0]} c="#e2ddd0" ro={0.45} rad={0.02} />
    <Bx s={[0.04, 0.56, 0.26]} p={[0.31, 0.5, 0]} c="#0a0a0a" ns />
    <Filt w={0.28} h={0.56} d={0.12} p={[lerp(0.95, 0.15, ins), 0.5, 0]} r={[0, Math.PI / 2, 0]} />
    {pick > 0 && <pointLight position={[0.2, 0.9, 0.5]} intensity={4 * pick} distance={1.6} color="#46ff8a" />}
    {MON.map((m, i) => { const a = i / 12 * Math.PI * 2 + spin, keep = i === 0 || i === 6, R = 1.05, on = keep && pick > 0.2;
      const y = keep ? 0.5 + 0.55 * pick : lerp(0.5, 0.06, fall * fall), tilt = keep ? 0 : fall * (rnd(i) - 0.5) * 2;
      return <group key={i} position={[Math.cos(a) * R, y, Math.sin(a) * R * 0.75]} rotation={[tilt * 0.7, -a + Math.PI / 2, tilt]}>
        <Bx s={[0.38, 0.24, 0.05]} c={on ? "#1f7a43" : "#f2eee4"} e={keep ? "#2aff7a" : undefined} ei={0.5 * pick} ro={0.6} rad={0.02} />
        <Txt t={m} w={0.32} c={on ? "#ffffff" : "#2a2620"} p={[0, 0, 0.027]} />
        <Txt t={m} w={0.32} c={on ? "#ffffff" : "#2a2620"} p={[0, 0, -0.027]} r={[0, Math.PI, 0]} />
      </group>; })}
  </S3>;
}}</Stage>;

// 25 · la rejilla del piso en el rincón del cuarto frío: los anillos de aire salen ásperos y nerviosos (naranja); después lisos y parejos (azul)
export const HWave: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), calm = win(u, 0.45, 0.6);
  return <S3 p={lv([0.15, 0.95, 1.6], [0.05, 0.85, 1.3], win(u, 0, 1))} l={[0, 0.45, 0]} fov={42}>
    <mesh position={[0, 1.4, -0.6]} receiveShadow><planeGeometry args={[6, 3]} /><meshStandardMaterial map={PLASTER()} color="#c6bba4" roughness={0.95} /></mesh>
    <Bx s={[0.8, 0.03, 0.36]} p={[0, 0.015, 0]} c="#cfd3d6" m={0.8} ro={0.3} />
    {Array.from({ length: 14 }, (_, i) => <Bx key={i} s={[0.03, 0.004, 0.27]} p={[-0.33 + i * 0.05, 0.031, 0]} c="#141414" ns />)}
    {calm < 0.98 && Array.from({ length: 7 }, (_, i) => {
      const ph = (u * 2.2 + i / 7) % 1, y = 0.06 + ph * 0.95, R = 0.18 + ph * 0.25, j = (rnd(i, Math.floor(u * 24)) - 0.5) * (1 - calm);
      return <To key={i} R={R} t={0.06} p={[j * 0.25, y, j * 0.12]} r={[Math.PI / 2 + j * 0.7, j * 0.6, 0]} sc={[1 + j * 0.6, 1 - j * 0.5, 1]} c="#ff7a2a" e="#ff6a1a" ei={0.7} ro={0.2} o={0.85 * Math.sin(ph * Math.PI) * (1 - calm)} />;
    })}
    {calm > 0.02 && [0, 1, 2].map((k) => { const ph = (u * 1.2 + k / 3) % 1; return <To key={k} R={0.3} t={0.09} p={[0, 0.08 + ph * 0.9, 0]} r={[Math.PI / 2, 0, 0]} c="#4aa8ff" e="#3a90ff" ei={0.7} ro={0.1} o={0.85 * calm * Math.sin(ph * Math.PI)} />; })}
    <group position={[0, 1.05, 0]}><Txt t="ROUGH" w={0.4} c="#ffb07a" o={(1 - calm) * win(u, 0.08, 0.18)} /></group>
    <group position={[0, 1.05, 0]}><Txt t="SMOOTH" w={0.46} c="#9fd2ff" o={calm} /></group>
  </S3>;
}}</Stage>;

// 26 · el fuelle: el filtro de 4" abre sus pliegues como un acordeón al lado del de 1"; las cintas de papel se desenrollan sobre la mesa: 1x contra 9x
export const HAccordion: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ex = win(u, 0.04, 0.28), r1 = win(u, 0.3, 0.38), r9 = win(u, 0.34, 0.66), L1 = 0.12 * r1 + 0.001, L9 = 1.08 * r9 + 0.001;
  return <S3 p={lv([0.15, 1.0, 1.85], [0.05, 0.9, 1.5], win(u, 0, 1))} l={[0, 0.38, 0.2]} fov={42}>
    <mesh position={[0, 1.4, -0.6]} receiveShadow><planeGeometry args={[6, 3]} /><meshStandardMaterial map={PLASTER()} color="#c6bba4" roughness={0.95} /></mesh>
    <spotLight position={[-1.6, 0.9, 0.8]} angle={0.5} penumbra={0.5} intensity={22} distance={5} color="#fff0d8" />
    <Filt w={0.22} h={0.32} d={0.03} n={8} p={[-0.45, 0.16, -0.2]} />
    <Filt w={0.62} h={0.62} d={lerp(0.04, 0.26, ex)} n={9} p={[0.22, 0.31, -0.25]} />
    <group position={[-0.45, 0.42, -0.2]}><Txt t={`1"`} w={0.14} c="#ffffff" /></group>
    <group position={[0.22, 0.72, -0.25]}><Txt t={`4"`} w={0.2} c="#ffffff" /></group>
    <Pl w={0.14} h={L1} p={[-0.45, 0.003, -0.08 + L1 / 2]} r={[-Math.PI / 2, 0, 0]} c="#f8f5ec" ro={0.85} />
    <Pl w={0.3} h={L9} p={[0.22, 0.003, -0.05 + L9 / 2]} r={[-Math.PI / 2, 0, 0]} c="#f8f5ec" ro={0.85} />
    <Cy rt={0.03 + 0.05 * (1 - r9)} h={0.3} p={[0.22, 0.03 + 0.05 * (1 - r9), -0.05 + L9]} r={[0, 0, Math.PI / 2]} c="#f8f5ec" ro={0.85} />
    {r1 > 0.9 && <group position={[-0.45, 0.01, 0.2]} rotation={[-Math.PI / 2, 0, 0]}><Txt t="1x" w={0.2} c="#f4efe6" /></group>}
    {r9 > 0.6 && <group position={[0.62, 0.01, 0.75]} rotation={[-Math.PI / 2, 0, 0]}><Txt t="9x" w={0.34} c="#7be0a0" o={win(r9, 0.6, 0.8)} /></group>}
  </S3>;
}}</Stage>;

// 27 · el frasco en la balanza de cocina: caen monedas y billetes doblados, el montón crece y la aguja del dial sube hasta $400
const scaleFace = () => canvasTex("scale27", 512, 512, (g) => { g.fillStyle = "#fbf8f0"; g.beginPath(); g.arc(256, 256, 250, 0, Math.PI * 2); g.fill(); g.fillStyle = "#2a2620"; g.strokeStyle = "#2a2620"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 0; i <= 40; i++) { const a = (-135 + i * 6.75) * D2R, r2 = i % 5 ? 212 : 190; g.lineWidth = i % 5 ? 3 : 7; g.beginPath(); g.moveTo(256 + 232 * Math.sin(a), 256 - 232 * Math.cos(a)); g.lineTo(256 + r2 * Math.sin(a), 256 - r2 * Math.cos(a)); g.stroke(); }
  g.font = BOLD(40); [0, 100, 200, 300, 400].forEach((v, k) => { const a = (-135 + k * 67.5) * D2R; g.fillText(`$${v}`, 256 + 150 * Math.sin(a), 256 - 150 * Math.cos(a)); }); });
export const HLedger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), N = 36, fill = win(u, 0.08, 0.85), trem = u > 0.85 ? Math.sin(u * 80) * 0.03 * Math.exp(-(u - 0.85) * 25) : 0, ang = (-135 + 270 * fill) * D2R + trem;
  const JX = 0.2, slot = (j: number): V3 => { const ly = Math.floor(j / 6), a = (j % 6) / 6 * Math.PI * 2 + ly * 0.5, r = j % 6 === 5 ? 0 : 0.1; return [JX + Math.cos(a) * r * (j % 2 ? 1 : 0.7), 0.215 + ly * 0.04, Math.sin(a) * r * 0.8]; };
  return <S3 p={lv([0.35, 1.0, 2.1], [0.2, 0.82, 1.55], win(u, 0, 1))} l={[0.02, 0.4, 0]} fov={36}>
    <Bx s={[0.5, 0.18, 0.46]} p={[JX, 0.09, 0]} c="#d8d3c8" ro={0.4} m={0.1} rad={0.05} />
    <Cy rt={0.22} h={0.02} p={[JX, 0.19, 0]} c="#c7cdd3" m={0.85} ro={0.25} seg={48} />
    <Bx s={[0.36, 0.42, 0.08]} p={[-0.42, 0.21, 0.05]} c="#d8d3c8" ro={0.4} m={0.1} rad={0.04} />
    <mesh position={[-0.42, 0.25, 0.092]}><circleGeometry args={[0.15, 48]} /><meshStandardMaterial map={scaleFace()} roughness={0.5} /></mesh>
    <To R={0.152} t={0.01} p={[-0.42, 0.25, 0.092]} c="#b9c0c7" m={0.9} ro={0.2} />
    <group position={[-0.42, 0.25, 0.1]} rotation={[0, 0, -ang]}><Bx s={[0.008, 0.13, 0.003]} p={[0, 0.05, 0]} c="#d8352a" ns /></group>
    <Cy rt={0.17} rb={0.16} h={0.45} p={[JX, 0.43, 0]} c="#e8f2f6" ro={0.04} m={0.05} o={0.25} open seg={48} />
    <To R={0.17} t={0.012} p={[JX, 0.655, 0]} r={[Math.PI / 2, 0, 0]} c="#e8f2f6" ro={0.04} o={0.5} />
    {Array.from({ length: N }, (_, i) => { const a = 0.06 + i * 0.021, k = cl((u - a) / 0.08); if (k <= 0) return null; const coin = i % 3 !== 0, end = slot(i);
      const p: V3 = k < 1 ? [lerp(JX + (rnd(i) - 0.5) * 0.1, end[0], k), lerp(1.1, end[1], k * k) + (k > 0.85 ? Math.sin((k - 0.85) / 0.15 * Math.PI) * 0.02 : 0), lerp(0, end[2], k)] : end;
      const r: V3 = k < 1 ? [k * 6 + i, 0, k * 4] : [rnd(i, 4) * 0.3, rnd(i, 5) * 3, rnd(i, 6) * 0.3];
      return coin ? <Cy key={i} rt={0.035} h={0.008} p={p} r={r} c="#d6ae4c" m={0.95} ro={0.25} /> : <Bx key={i} s={[0.13, 0.03, 0.06]} p={p} r={r} c="#8fb880" ro={0.85} rad={0.006} />; })}
  </S3>;
}}</Stage>;

// 28 · la cadena: cuatro fichas gruesas talladas (filtro → soplador → llama → serpentina) caen una sobre otra hacia la izquierda; la cara tallada mira a la cámara baja
const iconT = (k: number) => canvasTex(`dom${k}`, 256, 512, (g) => { g.fillStyle = "#efe6d2"; g.fillRect(0, 0, 256, 512); g.strokeStyle = "#2a2620"; g.fillStyle = "#2a2620"; g.lineWidth = 16; g.lineCap = "round"; g.lineJoin = "round";
  g.fillRect(20, 250, 216, 8); g.save(); g.translate(128, 130);
  if (k === 0) { g.strokeRect(-80, -70, 160, 140); for (let x = -50; x <= 50; x += 25) { g.beginPath(); g.moveTo(x, -60); g.lineTo(x, 60); g.stroke(); } }
  if (k === 1) { g.beginPath(); g.arc(0, 0, 80, 0, Math.PI * 2); g.stroke(); for (let a = 0; a < 3; a++) { g.save(); g.rotate(a * 2.094); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(55, -25, 40, -70); g.quadraticCurveTo(10, -40, 0, 0); g.fill(); g.restore(); } }
  if (k === 2) { g.beginPath(); g.moveTo(0, -85); g.bezierCurveTo(60, -20, 70, 30, 40, 70); g.bezierCurveTo(20, 90, -20, 90, -40, 70); g.bezierCurveTo(-70, 30, -50, -20, 0, -85); g.fill(); }
  if (k === 3) { g.beginPath(); g.moveTo(-85, -60); g.lineTo(70, -60); g.arc(70, -30, 30, -Math.PI / 2, Math.PI / 2); g.lineTo(-70, 0); g.arc(-70, 30, 30, -Math.PI / 2, Math.PI / 2, true); g.lineTo(85, 60); g.stroke(); }
  g.restore(); g.font = BOLD(56); g.textAlign = "center"; g.fillText(["FILTER", "BLOWER", "HEAT", "COIL"][k], 128, 380); g.font = BOLD(40); g.fillText(["clogs", "cooks", "cracks", "freezes"][k], 128, 450); });
export const HDomino: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), W = 0.13, HH = 0.72, D = 0.36, GAP = 0.55, REST = [70, 72, 76, 90];
  return <S3 p={lv([3.0, 0.9, 1.7], [2.5, 1.05, 1.2], win(u, 0, 1))} l={[0.8, 0.4, 0]} fov={42}>
    {Array.from({ length: 4 }, (_, i) => { const a0 = 0.08 + i * 0.17, ang = REST[i] * D2R * drop(u, a0, a0 + 0.17), x = (3 - i) * GAP;
      return <group key={i} position={[x - W / 2, 0, 0]} rotation={[0, 0, ang]}>
        <Bx s={[W, HH, D]} p={[W / 2, HH / 2, 0]} c="#e6dcc4" ro={0.55} rad={0.02} />
        <Pl w={D * 0.9} h={HH * 0.9} p={[W + 0.002, HH / 2, 0]} r={[0, Math.PI / 2, 0]} map={iconT(i)} c="#ffffff" ro={0.6} ns />
        {i === 3 && u > 0.76 && <group position={[W + 0.01, HH / 2, 0]}>
          <Pl w={D * 0.95 * win(u, 0.76, 0.9)} h={HH * 0.95 * win(u, 0.76, 0.9)} r={[0, Math.PI / 2, 0]} c="#eef7ff" ro={0.4} o={0.75} ns />
          {Array.from({ length: 16 }, (_, k) => { const a = rnd(k) * Math.PI * 2, r = win(u, 0.76, 0.92) * 0.2 * (0.4 + rnd(k, 2)); return <Sp key={k} rad={0.012} p={[0.01, Math.sin(a) * r * 1.6, Math.cos(a) * r]} c="#f4faff" ro={0.3} m={0.2} />; })}
        </group>}
      </group>; })}
    {u > 0.76 && <pointLight position={[0.3, 0.6, 0.6]} intensity={2 * win(u, 0.76, 0.9)} distance={2} color="#bfe2ff" />}
  </S3>;
}}</Stage>;
