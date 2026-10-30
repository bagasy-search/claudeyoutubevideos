// mar29c · componentes únicos 18-34, vuelta 3 en 3D (kit r3k) sobre la foto desenfocada del momento. Mecanismos que no están en mar29a/b
// (ver D:/rtmp/mar29_COMPONENTES.md). Vuelta 3: objeto protagonista enorme, nada cortado, sin rótulos que repitan la voz, la cámara acompaña la salida (no se achica).
import React, { useContext, useMemo } from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { BLOCKS, BOLD, Bx, Cy, Dot, Flame, HANDF, PLANKS, PLASTER, Pl, Puff, R3T, S3 as S3k, Sp, To, Tube, Txt, V3, canvasTex, cl, drop, lerp, lv, rnd, sm, win } from "../kits/r3k/r3k";
import { Lbl, Thermo3 } from "./r3c";

// cámara: sigue al mundo en la salida (el kit aleja los objetos 0,9 m al final; la cámara los acompaña y el objeto no se achica)
const S3: React.FC<React.ComponentProps<typeof S3k>> = ({ p, l, ...r }) => {
  const { tt, d } = useContext(R3T), x = sm((tt - (d - 0.75)) / 0.75);
  return <S3k p={[p[0], p[1] - 0.12 * x, p[2] - 0.9 * x]} l={[l[0], l[1] - 0.12 * x, l[2] - 0.9 * x]} {...r} />;
};
const U = (tt: number, h: H) => cl(tt / (h.out - h.at));
const Wall: React.FC<{ y?: number; w?: number; hh?: number; z?: number; c?: string; x?: number }> = ({ y = 1.3, w = 7, hh = 4, z = -0.03, c = "#ffffff", x = 0 }) =>
  <Bx s={[w, hh, 0.05]} p={[x, y, z]} map={PLASTER()} c={c} ro={0.95} ns />;
const bump = (u: number, a: number, f = 26, k = 8) => (u > a ? Math.sin((u - a) * f) * Math.exp(-(u - a) * k) : 0);
// aspas de ventilador (n palas) que giran en el plano XZ
const Blades: React.FC<{ a: number; R?: number; n?: number; c?: string; p?: V3; r?: V3 }> = ({ a, R = 0.5, n = 5, c = "#6b4a2e", p = [0, 0, 0], r = [0, 0, 0] }) =>
  <group position={p} rotation={r}><group rotation={[0, a, 0]}>
    <Cy rt={0.06} h={0.08} c="#c9a24a" m={0.9} ro={0.3} />
    {Array.from({ length: n }, (_, i) => <group key={i} rotation={[0, (i / n) * Math.PI * 2, 0]}><Bx s={[R, 0.014, 0.13]} p={[R / 2 + 0.05, 0, 0]} r={[0.12, 0, 0]} c={c} ro={0.5} rad={0.004} /></group>)}
  </group></group>;
// termómetro de vidrio vertical: base en p, columna roja hasta "deg" (escala 58-80)
const tY = (deg: number) => 0.1 + (deg - 58) * 0.022;
const Glass: React.FC<{ deg: number; p?: V3; s?: number; hot?: number }> = ({ deg, p = [0, 0, 0], s = 1, hot = 0 }) =>
  <group position={p} scale={s}>
    <Bx s={[0.12, 0.64, 0.02]} p={[0, 0.3, -0.02]} c="#f2eee4" ro={0.6} rad={0.01} />
    {[60, 65, 70, 75, 80].map((d) => <Bx key={d} s={[0.04, 0.005, 0.005]} p={[0.04, tY(d), -0.008]} c="#2a2520" ns />)}
    <Cy rt={0.03} h={0.56} p={[0, 0.32, 0]} c="#e8f0f4" o={0.3} ro={0.05} />
    <Sp rad={0.045} p={[0, 0.07, 0]} c="#d22a22" ro={0.25} e="#ff2a10" ei={0.3} />
    <Cy rt={0.017} h={tY(deg) - 0.07} p={[0, 0.07 + (tY(deg) - 0.07) / 2, 0]} c="#d22a22" ro={0.3} e="#ff2a10" ei={0.3 + hot} />
  </group>;

// 18 · el duelo: el termómetro de vidrio, grande, pegado con cinta junto al termostato; la columna sube de a poco hasta 73 y un corchete rojo grueso marca los 3° con un «3°» enorme al costado
export const HDuel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), tape = drop(u, 0.06, 0.22), deg = lerp(64, 73, win(u, 0.22, 0.66)), br = win(u, 0.62, 0.78), S = 1.2, gy = 0.62, gx = 0.2;
  const yy = (d: number) => gy + tY(d) * S, mid = (yy(70) + yy(73)) / 2, xb = gx + 0.13;
  return <S3 p={lv([0.35, 1.0, 1.75], [0.2, 1.0, 1.4], win(u, 0, 1))} l={[0.12, 1.0, 0]} fov={36} floor={null}>
    <Wall />
    <Thermo3 v="70" p={[-0.42, 1.0, 0.02]} s={1.5} glow={0.5} />
    <Tube pts={[[-0.14, yy(70), 0.05], [0.0, yy(70), 0.06], [gx - 0.08, yy(70), 0.06]]} rad={0.007} c="#ffffff" e="#ffffff" ei={0.6} o={0.7 * win(u, 0.2, 0.3)} />
    <group position={[gx, gy + (1 - tape) * 0.4, 0.03]}>
      <Glass deg={deg} s={S} hot={win(u, 0.55, 0.7)} />
      <Bx s={[0.26, 0.06, 0.004]} p={[0, 0.82 * S, 0.02]} r={[0, 0, 0.12]} c="#e8d9a8" o={0.9} ro={0.7} />
      <Bx s={[0.26, 0.06, 0.004]} p={[0, 0.18 * S, 0.02]} r={[0, 0, -0.1]} c="#e8d9a8" o={0.9} ro={0.7} />
    </group>
    <Lbl t={`${Math.round(deg)}°`} w={0.2} p={[gx + 0.3, yy(deg), 0.06]} c="#ff9a7a" o={win(u, 0.22, 0.3) * (1 - br)} />
    {br > 0.01 && <>
      <Tube pts={[[xb - 0.04, yy(70), 0.07], [xb + 0.05 * br, mid, 0.07], [xb - 0.04, yy(73), 0.07]]} rad={0.014} c="#e2342a" e="#e2342a" ei={1} />
      <Tube pts={[[xb + 0.06, mid, 0.07], [xb + 0.06 + 0.2 * br, mid, 0.07]]} rad={0.01} c="#e2342a" e="#e2342a" ei={1} />
      <mesh position={[xb + 0.28 * br, mid, 0.07]} rotation={[0, 0, -Math.PI / 2]} scale={br}><coneGeometry args={[0.03, 0.07, 16]} /><meshStandardMaterial color="#e2342a" emissive="#e2342a" emissiveIntensity={1} /></mesh>
      <Lbl t="3°" w={0.34} p={[xb + 0.55, mid, 0.07]} c="#ff7a5a" o={br} />
    </>}
  </S3>;
}}</Stage>;

const frost = () => canvasTex("frostwall2", 256, 256, (g) => { g.fillStyle = "#b9d3ea"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 3; for (let i = 0; i < 70; i++) { const x = (i * 53) % 256, y = (i * 97) % 256; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 18, y + 10); g.moveTo(x, y); g.lineTo(x - 10, y + 18); g.moveTo(x, y); g.lineTo(x + 4, y - 16); g.stroke(); } });
// 19 · el traslado: la pared de la chimenea escarchada a la izquierda, la tibia a la derecha; el termostato grande se despega y desliza 8 ft con una cinta métrica gruesa que se despliega pie por pie
export const HSlide8: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), off = win(u, 0.12, 0.24), mv = win(u, 0.26, 0.76), x = lerp(-0.9, 0.9, mv), v = Math.round(lerp(64, 70, win(u, 0.55, 0.8))), tp = win(u, 0.26, 0.76);
  return <S3 p={[lerp(-0.25, 0.25, mv), 1.05, 2.0]} l={[lerp(-0.25, 0.25, mv), 1.0, 0]} fov={40} floor={null}>
    <Bx s={[3, 3.4, 0.05]} p={[-1.5, 1.3, -0.03]} map={frost()} c="#ffffff" ro={0.9} ns />
    <Bx s={[3, 3.4, 0.05]} p={[1.5, 1.3, -0.03]} map={PLASTER()} c="#f5ddb0" ro={0.95} ns />
    <pointLight position={[0.6, 1.3, 0.8]} intensity={1.4} distance={2.2} color="#ffc070" />
    <pointLight position={[-0.7, 1.3, 0.8]} intensity={1.1} distance={2.2} color="#9fd0ff" />
    {Array.from({ length: 7 }, (_, i) => { const f = (tt * 0.35 + i / 7) % 1; return <Sp key={i} rad={0.025} sc={[1, 1.5, 1]} p={[-0.08 - rnd(i) * 0.5, 1.5 - f * 0.9, 0.02]} c="#cfe8ff" m={0.1} ro={0.05} o={0.9 * (1 - f)} ns />; })}
    {Array.from({ length: 5 }, (_, i) => <Puff key={i} p={[-0.3 - rnd(i) * 0.7, 0.9 + ((tt * 0.2 + i / 5) % 1) * 0.8, 0.05]} s={0.3} c="#cfe8ff" o={0.22} />)}
    {Array.from({ length: 8 }, (_, i) => { const k = cl(tp * 8 - i);
      return k > 0 && <group key={i}>
        <Bx s={[0.225 * k + 0.001, 0.15, 0.012]} p={[-0.9 + 0.225 * i + 0.1125 * k, 0.76, 0.02]} c="#f2c230" ro={0.4} rad={0.003} />
        <Bx s={[0.008, 0.15, 0.014]} p={[-0.9 + 0.225 * i, 0.76, 0.021]} c="#1a1a1a" ns />
        {k > 0.9 && <Txt t={`${i + 1}'`} w={0.1} c="#1a1a1a" p={[-0.9 + 0.225 * i + 0.115, 0.76, 0.03]} />}
      </group>; })}
    <Bx s={[0.05, 0.17, 0.03]} p={[-0.9 + 1.8 * tp, 0.76, 0.03]} c="#b0b4b8" m={0.9} ro={0.25} sc={tp > 0.01 ? 1 : 0} />
    <group position={[x, 1.2, 0.03 + off * 0.06]}>
      <Bx s={[0.62, 0.45, 0.02]} p={[0.02, -0.03, -0.03]} c="#000000" o={0.25 * off} ns />
      <Thermo3 v={`${v}`} s={1.7} glow={0.7} />
    </group>
  </S3>;
}}</Stage>;

const OFS = ["70", "MENU", "SETUP", "OFFSET", "-1", "-2", "-3"], OFC = ["MENU", "SETUP", "OFFSET"];
// 20 · el ajuste escondido: el dedo aprieta el botón y con cada clic la pantalla pasa MENU → SETUP → OFFSET (tres fichas se encienden) y el valor baja −1, −2, −3
export const HOffset: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), q = cl((u - 0.12) / 0.7) * 7, k = Math.min(6, Math.floor(q)), ph = q % 1, ap = win(u, 0.0, 0.1), press = u > 0.12 && u < 0.82 ? Math.max(0, Math.sin(cl(ph * 2.2) * Math.PI)) : 0;
  const bx = 0.144, by = 0.8;
  return <S3 p={lv([0.25, 1.1, 1.55], [0.1, 1.08, 1.4], win(u, 0, 1))} l={[0.02, 1.02, 0]} fov={34} floor={null}>
    <Wall />
    <Thermo3 v={OFS[k]} p={[0, 0.98, 0.02]} s={2.4} glow={0.7 + 0.6 * press} />
    {OFC.map((w, i) => { const lit = k >= i + 1 ? 1 : 0; return <group key={w} position={[(i - 1) * 0.36, 1.43, 0.03]}>
      <Bx s={[0.32, 0.1, 0.03]} c={lit ? "#ffb14a" : "#3a3530"} e={lit ? "#ff9a2a" : undefined} ei={0.7} ro={0.5} rad={0.012} />
      <Txt t={w} w={0.22} c={lit ? "#1a1208" : "#8a8278"} p={[0, 0, 0.018]} />
    </group>; })}
    <group position={[bx + 0.3 * (1 - ap), by - 0.3 * (1 - ap), 0.1 + 0.12 * (1 - ap) - 0.03 * press]} rotation={[-1.0, 0, 0.35]}>
      <Cy rt={0.043} rb={0.05} h={0.8} p={[0, -0.4, 0]} c="#d9a07a" ro={0.6} />
      <Sp rad={0.043} c="#d9a07a" ro={0.6} />
      <Bx s={[0.045, 0.012, 0.05]} p={[0, 0.0, 0.03]} r={[0.3, 0, 0]} c="#f1cdb4" ro={0.3} rad={0.005} />
    </group>
    <Dot p={[bx, by, 0.1]} r={0.06} c="#fff3c0" o={0.5 * press} add />
  </S3>;
}}</Stage>;

// 21 · el pincel: sin la tapa se ve la placa cubierta de mechones de pelusa; un pincel ancho de cerdas claras barre en zigzag, los mechones suben en volutas y quedan franjas de metal limpio y brillante
export const HSweep: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), cover = win(u, 0.02, 0.18), s = win(u, 0.22, 0.8), row = Math.min(2, Math.floor(s * 3)), ph = Math.min(1, s * 3 - row), bx = row % 2 === 0 ? lerp(-0.34, 0.34, ph) : lerp(0.34, -0.34, ph), by = lerp(0.127, -0.127, row / 2), PS = 1.15;
  return <S3 p={lv([0.25, 1.2, 1.55], [0.04, 1.05, 1.4], win(u, 0, 1))} l={[0, 1.0, 0]} fov={32} floor={null}>
    <Wall />
    <group position={[0, 1.0, 0.02]} scale={PS}>
      <Bx s={[0.82, 0.52, 0.03]} c="#e8e4da" ro={0.5} rad={0.03} />
      <Bx s={[0.66, 0.38, 0.01]} p={[0, 0, 0.02]} c="#2c6a3a" ro={0.4} m={0.2} />
      {[0, 1, 2].map((r) => { const k = cl(s * 3 - r); return k > 0 && <Bx key={r} s={[0.66 * k + 0.001, 0.12, 0.004]} p={[r % 2 === 0 ? -0.33 + 0.33 * k : 0.33 - 0.33 * k, lerp(0.127, -0.127, r / 2), 0.0255]} c="#46c26a" e="#46c26a" ei={0.35} m={0.5} ro={0.2} />; })}
      <To R={0.09} t={0.012} p={[-0.15, 0.02, 0.035]} c="#d0d4d8" m={1} ro={0.12} />
      <To R={0.06} t={0.01} p={[-0.15, 0.02, 0.04]} c="#d0d4d8" m={1} ro={0.12} />
      <Bx s={[0.1, 0.06, 0.02]} p={[0.15, 0.06, 0.035]} c="#1a1a1a" ro={0.4} />
      {[-0.2, -0.05, 0.1, 0.25].map((x, i) => <Cy key={i} rt={0.008} h={0.03} p={[x, -0.13, 0.04]} r={[Math.PI / 2, 0, 0]} c="#c9a24a" m={0.9} ro={0.3} />)}
      {Array.from({ length: 46 }, (_, i) => { const x = (rnd(i) - 0.5) * 0.62, y = (rnd(i + 70) - 0.5) * 0.34, r = y > 0.063 ? 0 : y > -0.063 ? 1 : 2, pr = (x + 0.31) / 0.62, fly = cl((s * 3 - r - (r % 2 === 0 ? pr : 1 - pr)) * 2.5);
        if (fly >= 1) return null;
        const pts = Array.from({ length: 8 }, (_, k) => [x + Math.cos(i + k * 0.9) * 0.025 + fly * 0.1 * (k / 7) * (rnd(i + 5) - 0.3), y + Math.sin(i * 2 + k * 1.3) * 0.02 + fly * 0.3 + Math.sin(fly * 9 + k) * 0.03 * fly, 0.045 + k * 0.002 + fly * 0.28] as V3);
        return <Tube key={i} pts={pts} rad={0.011 * (1 - fly * 0.4)} seg={20} c="#a9a398" ro={1} o={1 - fly} />; })}
      <group position={[bx, by, 0.07]} rotation={[0.3, 0, -0.6]} scale={win(u, 0.16, 0.24)}>
        <Bx s={[0.22, 0.06, 0.045]} p={[0, 0.03, 0]} c="#efe2c0" ro={1} rad={0.01} />
        <Bx s={[0.2, 0.03, 0.05]} p={[0, 0.075, 0]} c="#9a9ea4" m={0.9} ro={0.3} />
        <Bx s={[0.19, 0.05, 0.045]} p={[0, 0.115, 0]} c="#b07a44" ro={0.5} rad={0.015} />
        <Cy rt={0.018} h={0.34} p={[0, 0.3, 0]} c="#5a3a22" ro={0.4} />
      </group>
    </group>
    <group position={[0.8 - cover * 0.5, 1.3 + cover * 0.4, 0.3]} rotation={[0, -0.6, 0.4]} scale={1 - win(u, 0.15, 0.22)}><Bx s={[0.82, 0.52, 0.03]} c="#efece4" ro={0.42} rad={0.03} /></group>
  </S3>;
}}</Stage>;

const RUNS = [[0.08, 0.26], [0.42, 0.58], [0.78, 0.92]];
// 22 · los carriles: dos pistas de tiempo completas con un ventilador grande sobre cada una; en AUTO gira sólo mientras hay llama, en ON gira todo el día; un hilo de luz recorre las dos
export const HLanes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), cur = win(u, 0.08, 0.88), onA = RUNS.some(([a, b]) => cur > a && cur < b), LW = 1.7;
  const lane = (z: number, lab: string, all: boolean) => <group position={[0, 0, z]}>
    <Bx s={[LW, 0.05, 0.38]} p={[0, 0.025, 0]} c="#2c2a27" ro={0.6} />
    {(all ? [[0, 1]] : RUNS).map(([a, b], i) => cur > a && <Bx key={i} s={[LW * (Math.min(b, cur) - a) + 0.001, 0.04, 0.3]} p={[-LW / 2 + LW * (a + (Math.min(b, cur) - a) / 2), 0.06, 0]} c={all ? "#e2342a" : "#3fbf6a"} e={all ? "#e2342a" : "#3fbf6a"} ei={0.6} />)}
    {!all && RUNS.map(([a, b], i) => cur > a && cur < b && <Flame key={i} p={[-LW / 2 + LW * cur, 0.08, 0]} s={1.5} u={tt} i={i} />)}
    <Txt t={lab} w={all ? 0.28 : 0.4} c="#f3ead6" p={[-LW / 2 + 0.28, 0.085, 0.0]} r={[-Math.PI / 2, 0, 0]} />
    <Cy rt={0.012} h={0.4} p={[0.68, 0.22, -0.05]} c="#9aa0a6" m={0.9} ro={0.3} />
    <Blades a={((all || onA) ? 1 : 0.02) * tt * 10} R={0.2} n={4} c="#c9cdd2" p={[0.68, 0.46, -0.05]} r={[Math.PI / 2 - 0.5, 0, 0]} />
    <Dot p={[0.68, 0.46, -0.05]} r={0.04} c="#c9a24a" />
  </group>;
  return <S3 p={lv([0.1, 1.2, 1.6], [-0.05, 1.05, 1.4], win(u, 0, 1))} l={[0, 0.12, 0]} fov={38} floor={null}>
    <Bx s={[3.6, 0.06, 1.7]} p={[0, -0.03, 0]} c="#c8a06c" map={PLANKS()} ro={0.7} />
    {lane(-0.32, "AUTO", false)}{lane(0.32, "ON", true)}
    <Bx s={[0.012, 0.05, 1.0]} p={[-LW / 2 + LW * cur, 0.09, 0]} c="#ffffff" e="#ffffff" ei={1.2} ns />
    <pointLight position={[-LW / 2 + LW * cur, 0.5, 0.3]} intensity={0.7} distance={1} color="#ffffff" />
  </S3>;
}}</Stage>;

const money = (v: number) => canvasTex(`moneyv3|${v}`, 512, 220, (g) => { g.fillStyle = "#cfe0c0"; g.fillRect(0, 0, 512, 220); g.strokeStyle = "#3f6a3a"; g.lineWidth = 10; g.strokeRect(14, 14, 484, 192); g.fillStyle = "#3f6a3a"; g.font = BOLD(110); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(`$${v}`, 256, 116); });
const STACK: [number, number][] = [[30, 7], [40, 10], [50, 13]];
// 23 · el microondas: un microondas de verdad prendido sin parar (puerta de vidrio con luz ámbar adentro y plato girando con comida, reloj verde 24:00) y al lado crecen con rebote las pilas de billetes de cada mes, $30, $40 y $50
export const HMicrowave: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h);
  return <S3 p={lv([0.3, 0.85, 1.7], [0.15, 0.78, 1.5], win(u, 0, 1))} l={[0.18, 0.3, 0]} fov={38}>
    <group position={[-0.4, 0, 0]}>
      <Bx s={[0.8, 0.48, 0.5]} p={[0, 0.24, 0]} c="#2a2c30" m={0.6} ro={0.35} rad={0.02} />
      <Bx s={[0.52, 0.38, 0.03]} p={[-0.1, 0.24, 0.255]} c="#3a3d42" m={0.7} ro={0.3} rad={0.01} />
      <Pl w={0.46} h={0.32} p={[-0.1, 0.24, 0.272]} c="#ffcf7a" e="#ffb14a" ei={1.1} ns />
      <group position={[-0.1, 0.12, 0.3]} rotation={[-0.45, 0, 0]}>
        <Cy rt={0.16} h={0.012} c="#f2f2ee" ro={0.1} m={0.2} />
        <group rotation={[0, tt * 1.4, 0]}>
          <Cy rt={0.075} rb={0.06} h={0.05} p={[0.07, 0.03, 0]} c="#e8e4da" ro={0.4} />
          <Sp rad={0.05} sc={[1, 0.6, 1]} p={[0.07, 0.065, 0]} c="#c86a3a" ro={0.6} />
        </group>
      </group>
      <Bx s={[0.5, 0.36, 0.01]} p={[-0.1, 0.24, 0.285]} c="#0c0d10" m={0.1} ro={0.05} o={0.3} ns />
      <pointLight position={[-0.1, 0.3, 0.4]} intensity={0.9} distance={0.9} color="#ffcf8a" />
      <Bx s={[0.025, 0.26, 0.03]} p={[0.2, 0.24, 0.285]} c="#c0c4c8" m={0.9} ro={0.2} />
      <Bx s={[0.2, 0.38, 0.02]} p={[0.28, 0.24, 0.255]} c="#202226" ro={0.4} />
      <Bx s={[0.16, 0.07, 0.006]} p={[0.28, 0.38, 0.268]} c="#0a1a0a" />
      <Txt t="24:00" w={0.14} c="#7dff8a" e={1} p={[0.28, 0.38, 0.274]} />
      {[0, 1, 2, 3].map((i) => <Cy key={i} rt={0.022} h={0.012} p={[0.28, 0.28 - i * 0.055, 0.268]} r={[Math.PI / 2, 0, 0]} c="#6a6e75" m={0.8} ro={0.3} />)}
    </group>
    {STACK.map(([v, n], j) => { const a = 0.2 + j * 0.2, k = drop(u, a, a + 0.2), m = Math.ceil(Math.min(1, k) * n);
      return <group key={j} position={[0.22 + j * 0.34, 0, 0.1 - j * 0.04]}>
        {Array.from({ length: m }, (_, i) => <Bx key={i} s={[0.27, 0.02, 0.12]} p={[(rnd(i + j * 9) - 0.5) * 0.02, 0.01 + i * 0.021, 0]} r={[0, (rnd(i) - 0.5) * 0.35, 0]} map={money(v)} c="#ffffff" ro={0.8} rad={0.004} />)}
        <Lbl t={`$${v}`} w={0.2} p={[0, 0.07 + m * 0.021 + 0.08, 0.02]} c="#9ff0b0" o={cl(k * 3)} />
      </group>; })}
  </S3>;
}}</Stage>;

const coilT = () => canvasTex("coilfins", 256, 256, (g) => { g.fillStyle = "#b87333"; g.fillRect(0, 0, 256, 256); g.fillStyle = "rgba(60,30,10,.5)"; for (let x = 0; x < 256; x += 6) g.fillRect(x, 0, 2, 256); });
// 24 · las dos estaciones: invierno, la rejilla grande sopla cintas gruesas de aire azul; la cámara cruza la pared y en verano el serpentín de cobre mojado gotea gotas grandes sobre la bandeja
export const HSeasons: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), pan = win(u, 0.4, 0.62), cx = lerp(-0.55, 0.55, pan);
  return <S3 p={[cx, 0.66, 1.5]} l={[cx, 0.66, 0]} fov={38}>
    <Bx s={[3, 2.6, 0.05]} p={[-1.5, 1.1, -0.4]} map={PLASTER()} c="#cfe0f2" ro={0.95} ns />
    <Bx s={[3, 2.6, 0.05]} p={[1.5, 1.1, -0.4]} map={PLASTER()} c="#f4dcc0" ro={0.95} ns />
    <group position={[-0.55, 0.85, -0.34]}>
      <Bx s={[0.95, 0.52, 0.06]} c="#d9dde2" m={0.5} ro={0.3} rad={0.015} />
      <Bx s={[0.86, 0.44, 0.02]} p={[0, 0, 0.03]} c="#14181c" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <Bx key={i} s={[0.84, 0.03, 0.05]} p={[0, -0.19 + i * 0.063, 0.05]} r={[0.5, 0, 0]} c="#9aa0a8" m={0.8} ro={0.3} />)}
    </group>
    {Array.from({ length: 6 }, (_, j) => { const f = (tt * 0.45 + j / 6) % 1, a = f * 0.62, x0 = -0.55 + (j - 2.5) * 0.14;
      const pts = Array.from({ length: 10 }, (_, k) => { const s = a + 0.38 * (k / 9); return [x0 + Math.sin(s * 6 + j) * 0.05 + (j - 2.5) * 0.04 * s, 0.85 + 0.22 * s - 0.045 * Math.sin(s * 5 + j), -0.28 + 1.0 * s] as V3; });
      return <Tube key={j} pts={pts} rad={0.02} seg={30} c="#7fc4ff" e="#4aa0ff" ei={1.2} o={0.85 * Math.sin(f * Math.PI)} />; })}
    <group position={[0.55, 0.85, -0.32]}>
      <Bx s={[0.85, 0.52, 0.14]} map={coilT()} c="#ffffff" m={0.85} ro={0.3} e="#7a4a20" ei={0.12} />
      <Bx s={[0.92, 0.04, 0.12]} p={[0, 0.28, 0.01]} c="#7a7e84" m={0.6} ro={0.4} />
      <Bx s={[0.92, 0.03, 0.12]} p={[0, -0.28, 0.01]} c="#7a7e84" m={0.6} ro={0.4} />
    </group>
    <Bx s={[1.0, 0.04, 0.36]} p={[0.55, 0.2, -0.2]} c="#7a7e84" m={0.6} ro={0.4} />
    <Cy rt={0.17} h={0.012} p={[0.55, 0.225, -0.2]} c="#9fd0ff" o={0.65} m={0.2} ro={0.05} sc={[1.2, 1, 0.7]} />
    {Array.from({ length: 10 }, (_, i) => { const f = (tt * 0.9 + i / 10) % 1, x = 0.55 + (rnd(i) - 0.5) * 0.7; return <group key={i}>
      <Sp rad={0.034} p={[x, 0.55 - f * 0.31, -0.2]} sc={[1, 1.5, 1]} c="#dff0ff" m={0.1} ro={0.02} o={0.92} />
      {f > 0.92 && <To R={0.05 + (f - 0.92) * 1.5} t={0.006} p={[x, 0.236, -0.2]} r={[-Math.PI / 2, 0, 0]} c="#dff0ff" o={0.7} />}
    </group>; })}
  </S3>;
}}</Stage>;

const LINES = ["Marcus,", "I thought that", "hum was the", "refrigerator."];
const cardIn = (n: number) => canvasTex(`okafor3|${Math.round(n * 60)}`, 512, 640, (g) => {
  g.fillStyle = "#fbf6ea"; g.fillRect(0, 0, 512, 640); g.fillStyle = "#24304a"; g.font = HANDF(54); g.textAlign = "left";
  LINES.forEach((s, i) => { const k = cl(n * 4 - i); if (k > 0) g.fillText(s.slice(0, Math.ceil(s.length * k)), 30, 130 + i * 96); });
  if (n > 0.995) { g.font = HANDF(44); g.fillText("— Mr. Okafor", 190, 560); }
});
// 25 · la tarjeta del señor Okafor: una tarjeta grande con lomo se abre como un libro sobre la mesa, una pluma escribe la frase renglón por renglón hasta «refrigerator.» y la hoja queda completa y legible; al lado una taza humeante
export const HCard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), open = win(u, 0.05, 0.2), wr = win(u, 0.2, 0.62), lp = wr * 4, li = Math.min(3, Math.floor(lp)), lk = wr >= 1 ? 1 : lp % 1, cw = 0.5, chh = 0.62;
  const nch = Math.ceil(LINES[li].length * lk), cx = 36 + nch * 28, cy = 130 + li * 96 - 30;
  const px = cw / 2 + (cx / 512 - 0.5) * (cw - 0.02), py = (0.5 - cy / 640) * (chh - 0.02), pen = win(u, 0.18, 0.24), lift = win(u, 0.66, 0.8) * 0.12;
  return <S3 p={lv([0.25, 1.25, 0.95], [0.1, 1.15, 0.75], win(u, 0, 1))} l={[0, 0, 0.03]} fov={36} floor="wood">
    <group position={[-0.1, 0.012, 0]} rotation={[-Math.PI / 2, 0, -0.05]}>
      <Bx s={[cw, chh, 0.008]} p={[cw / 2, 0, -0.006]} c="#3d6a8a" ro={0.7} />
      <Pl w={cw - 0.02} h={chh - 0.02} p={[cw / 2, 0, 0.0012]} map={cardIn(wr)} c="#ffffff" ro={0.85} />
      <group rotation={[0, -open * Math.PI * 0.96, 0]}>
        <Bx s={[cw, chh, 0.008]} p={[cw / 2, 0, 0.008]} c="#3d6a8a" ro={0.7} />
        <Txt t="THANK" w={0.3} c="#f4e3b0" p={[cw / 2, 0.07, 0.0125]} />
        <Txt t="YOU" w={0.22} c="#f4e3b0" p={[cw / 2, -0.07, 0.0125]} />
        <Pl w={cw - 0.02} h={chh - 0.02} p={[cw / 2, 0, 0.0035]} c="#fbf6ea" ro={0.85} />
        <Txt t="with thanks" w={0.3} font={HANDF} c="#7a3a2a" p={[cw / 2, 0, 0.0028]} r={[0, Math.PI, 0]} />
      </group>
      <Cy rt={0.008} h={chh} p={[0, 0, 0.004]} c="#2a4a62" ro={0.6} />
      <group position={[px, py, 0.015 + lift + 0.004 * Math.abs(Math.sin(tt * 18)) * (wr < 1 ? 1 : 0)]} rotation={[1.0, 0, -0.4]} scale={pen}>
        <Cy rt={0.003} rb={0.013} h={0.06} p={[0, 0.03, 0]} c="#c9a24a" m={0.9} ro={0.25} />
        <Cy rt={0.014} h={0.34} p={[0, 0.23, 0]} c="#1a1a1a" ro={0.3} m={0.4} />
      </group>
    </group>
    <group position={[0.6, 0, -0.18]}>
      <Cy rt={0.085} rb={0.07} h={0.16} p={[0, 0.08, 0]} c="#efe8da" ro={0.35} />
      <Cy rt={0.077} h={0.006} p={[0, 0.155, 0]} c="#4a2a14" ro={0.2} />
      <To R={0.045} t={0.012} p={[0.09, 0.085, 0]} r={[0, 0, Math.PI / 2]} c="#efe8da" ro={0.35} />
      {[0, 1, 2].map((i) => { const f = (tt * 0.3 + i / 3) % 1; return <Puff key={i} p={[Math.sin(f * 6 + i) * 0.03, 0.2 + f * 0.3, 0]} s={0.12 + f * 0.1} o={0.3 * Math.sin(f * Math.PI)} />; })}
    </group>
  </S3>;
}}</Stage>;

// 26 · la prueba de oído: la cocina con el horno abierto y los tres quemadores apagados (cruz roja); la cámara empuja hacia la rejilla del conducto que sopla cintas de aire y una oreja enorme recibe las ondas que salen de la rejilla
export const HListen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), w = win(u, 0.28, 0.45), lx = lerp(-0.12, 0.15, win(u, 0.1, 0.6)), xo = win(u, 0.1, 0.22);
  return <S3 p={[lx, 0.95, 1.75]} l={[lx, 0.5, 0]} fov={38}>
    <Bx s={[4, 2.4, 0.05]} p={[0, 1.1, -0.5]} map={PLASTER()} c="#e2dccd" ro={0.95} ns />
    <group position={[-0.62, 0, -0.1]}>
      <Bx s={[0.64, 0.8, 0.5]} p={[0, 0.4, 0]} c="#e9e6de" m={0.3} ro={0.4} rad={0.02} />
      <Bx s={[0.66, 0.04, 0.52]} p={[0, 0.82, 0]} c="#1a1a1c" m={0.5} ro={0.3} />
      {[-0.19, 0, 0.19].map((x, i) => <group key={i}>
        <To R={0.065} t={0.016} p={[x, 0.85, 0.08]} r={[-Math.PI / 2, 0, 0]} c="#2a2a2e" m={0.7} ro={0.4} />
        <To R={0.03} t={0.01} p={[x, 0.85, 0.08]} r={[-Math.PI / 2, 0, 0]} c="#2a2a2e" m={0.7} ro={0.4} />
        <group position={[x, 1.0, 0.22]} scale={xo}>
          <Bx s={[0.15, 0.025, 0.02]} r={[0, 0, 0.78]} c="#e2342a" e="#e2342a" ei={0.9} />
          <Bx s={[0.15, 0.025, 0.02]} r={[0, 0, -0.78]} c="#e2342a" e="#e2342a" ei={0.9} />
        </group>
      </group>)}
      <Bx s={[0.52, 0.34, 0.02]} p={[0, 0.34, 0.255]} c="#0e0e10" ro={0.5} />
      <group position={[0, 0.17, 0.27]} rotation={[1.4, 0, 0]}><Bx s={[0.56, 0.46, 0.04]} p={[0, 0.23, 0]} c="#d8d4cc" m={0.3} ro={0.4} rad={0.01} /><Bx s={[0.4, 0.3, 0.01]} p={[0, 0.23, 0.025]} c="#15161a" ro={0.2} /></group>
    </group>
    <group position={[0.2, 0.52, -0.45]}>
      <Bx s={[0.56, 0.4, 0.06]} c="#d9dde2" m={0.5} ro={0.3} rad={0.015} />
      <Bx s={[0.5, 0.34, 0.02]} p={[0, 0, 0.03]} c="#14181c" />
      {[0, 1, 2, 3, 4].map((i) => <Bx key={i} s={[0.5, 0.025, 0.05]} p={[0, -0.14 + i * 0.07, 0.05]} r={[0.5, 0, 0]} c="#9aa0a8" m={0.8} ro={0.3} />)}
    </group>
    {Array.from({ length: 4 }, (_, j) => { const f = (tt * 0.5 + j / 4) % 1, a = f * 0.6;
      const pts = Array.from({ length: 10 }, (_, k) => { const s = a + 0.4 * (k / 9); return [0.2 + s * 0.65 + (j - 1.5) * 0.02, 0.55 + (j - 1.5) * 0.07 + Math.sin(s * 8 + j + tt * 3) * 0.03, -0.4 + s * 0.5] as V3; });
      return <Tube key={j} pts={pts} rad={0.016} seg={26} c="#e8f2ff" e="#cfe4ff" ei={1} o={0.8 * Math.sin(f * Math.PI)} />; })}
    {[0, 1, 2].map((i) => { const f = ((tt * 0.6 + i / 3) % 1), R = 0.07 + f * 0.2; return <To key={i} R={R} t={0.016} arc={Math.PI * 0.7} p={[0.3 + f * 0.35, 0.56, 0.0]} r={[0, 0, -Math.PI * 0.35]} c="#ffd27a" e="#ffb14a" ei={1.2} o={w * Math.sin(f * Math.PI)} />; })}
    <group position={[0.88, 0.62, 0.05]} rotation={[0, -0.5, 0]} scale={Math.max(0.001, w * 1.4)}>
      <Sp rad={0.22} sc={[0.75, 1, 0.35]} c="#c98e6a" ro={0.6} />
      <Sp rad={0.15} sc={[0.6, 0.85, 0.3]} p={[-0.02, 0, 0.05]} c="#8a5438" ro={0.7} />
      <To R={0.17} t={0.03} arc={Math.PI * 1.5} p={[0, 0.02, 0.06]} r={[0, 0, Math.PI * 0.75]} c="#b27a58" ro={0.6} />
      <Sp rad={0.07} p={[0, -0.2, 0.03]} sc={[1, 1, 0.5]} c="#c98e6a" ro={0.6} />
    </group>
  </S3>;
}}</Stage>;

const gauge = () => canvasTex("gaugev2", 512, 512, (g) => {
  g.fillStyle = "#f4efe2"; g.beginPath(); g.arc(256, 256, 256, 0, Math.PI * 2); g.fill(); g.lineWidth = 30;
  g.strokeStyle = "#4caf6a"; g.beginPath(); g.arc(256, 256, 200, Math.PI * 0.8, Math.PI * 1.4); g.stroke();
  g.strokeStyle = "#e9b33a"; g.beginPath(); g.arc(256, 256, 200, Math.PI * 1.4, Math.PI * 1.8); g.stroke();
  g.strokeStyle = "#d8402e"; g.beginPath(); g.arc(256, 256, 200, Math.PI * 1.8, Math.PI * 2.2); g.stroke();
  g.fillStyle = "#2a2520"; g.font = BOLD(64); g.textAlign = "center"; g.fillText("WATTS", 256, 400);
});
// 27 · dos motores: sobre la mesa de trabajo del sótano, el viejo vibra y humea con la aguja golpeando el rojo; el nuevo gira casi quieto con la aguja en verde; cada uno con su etiqueta colgada
export const HEfficient: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), nA = lerp(-0.7, 0.85, drop(u, 0.15, 0.45)) + bump(u, 0.45, 40, 10) * 0.12 + (u > 0.45 ? Math.sin(tt * 40) * 0.04 : 0), nB = lerp(-0.7, -0.45, win(u, 0.35, 0.6)), vib = Math.sin(tt * 60) * 0.005;
  const motor = (x: number, c: string, n: number, lab: string, old: boolean) => <group position={[x + (old ? vib : 0), 0, 0]} scale={1.1}>
    <Cy rt={0.15} h={0.34} p={[0, 0.18, 0]} r={[0, 0, Math.PI / 2]} c={c} m={0.6} ro={0.35} e={old ? undefined : "#2fbf6a"} ei={0.06} />
    {[-0.1, 0, 0.1].map((dx, i) => <To key={i} R={0.152} t={0.01} p={[dx, 0.18, 0]} r={[0, Math.PI / 2, 0]} c="#3a3a3a" m={0.6} ro={0.4} />)}
    <Bx s={[0.36, 0.03, 0.26]} p={[0, 0.015, 0]} c="#2a2a2c" m={0.5} ro={0.4} />
    <Cy rt={0.022} h={0.12} p={[0.22, 0.18, 0]} r={[0, 0, Math.PI / 2]} c="#c0c4c8" m={1} ro={0.2} />
    <group position={[0.3, 0.18, 0]} rotation={[tt * (old ? 14 : 5), 0, 0]}>{[0, 1, 2].map((i) => <Bx key={i} s={[0.012, 0.24, 0.07]} r={[(i / 3) * Math.PI * 2, 0, 0]} c="#9aa0a6" />)}</group>
    {old && Array.from({ length: 6 }, (_, i) => { const f = (tt * 0.5 + i / 6) % 1; return <Puff key={i} p={[-0.05 + rnd(i) * 0.1 + f * 0.05, 0.35 + f * 0.5, 0.05]} s={0.14 + f * 0.2} c="#9a9692" o={0.5 * Math.sin(f * Math.PI) * win(u, 0.2, 0.3)} add={false} />; })}
    <group position={[0, 0.72, 0]}>
      <Cy rt={0.19} h={0.04} r={[Math.PI / 2, 0, 0]} c="#2c2c2c" m={0.6} ro={0.3} />
      <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.175, 48]} /><meshStandardMaterial map={gauge()} roughness={0.6} /></mesh>
      <group position={[0, 0, 0.03]} rotation={[0, 0, -n]}><Bx s={[0.014, 0.15, 0.004]} p={[0, 0.07, 0]} c="#c8302a" ns /></group>
    </group>
    <Tube pts={[[-0.1, 0.52, 0.02], [-0.08, 0.5, 0.1], [-0.08, 0.46, 0.17]]} rad={0.004} c="#3a3a3a" />
    <Tube pts={[[0.1, 0.52, 0.02], [0.08, 0.5, 0.1], [0.08, 0.46, 0.17]]} rad={0.004} c="#3a3a3a" />
    <group position={[0, 0.4, 0.17]} rotation={[0, 0, Math.sin(tt * 2 + x) * 0.05]}>
      <Bx s={[0.32, 0.1, 0.006]} c="#f5efdc" ro={0.85} rad={0.01} />
      <Txt t={lab} w={0.28} c={old ? "#8a3a2a" : "#1f5a3a"} p={[0, 0, 0.004]} />
    </group>
  </group>;
  return <S3 p={lv([0, 0.78, 1.95], [0, 0.7, 1.7], win(u, 0, 1))} l={[0, 0.48, 0]} fov={36} floor={null}>
    <Bx s={[4, 2.6, 0.05]} p={[0, 1.2, -0.5]} map={BLOCKS()} c="#a9b6c4" ro={0.9} ns />
    <Bx s={[3.2, 0.1, 1.1]} p={[0, -0.05, 0.05]} map={PLANKS()} c="#c8a06c" ro={0.6} />
    {motor(-0.5, "#7a5a44", nA, "OLD MOTOR", true)}{motor(0.5, "#2f5a7a", nB, "NEW MOTOR", false)}
  </S3>;
}}</Stage>;

// 28 · la regla de Earl: primer plano fijo del termostato; el dedo aprieta la flecha y el número sube 68, 69, 70 con su clic; un sello de goma grande baja girando, estampa con rebote «EARL'S RULE» en la etiqueta del costado y se levanta
export const HTwice: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), p1 = Math.sin(win(u, 0.1, 0.22) * Math.PI), p2 = Math.sin(win(u, 0.3, 0.42) * Math.PI), v = 68 + (u > 0.16 ? 1 : 0) + (u > 0.36 ? 1 : 0), st = drop(u, 0.56, 0.68), up = win(u, 0.76, 0.9), pr = p1 + p2;
  const pulse = bump(u, 0.16, 30, 10) + bump(u, 0.36, 30, 10), ap = win(u, 0.04, 0.1);
  return <S3 p={[0.05, 1.0, 1.35]} l={[0.05, 0.98, 0]} fov={34} floor={null}>
    <Wall />
    <Thermo3 v={`${v}`} p={[-0.34, 1.0, 0.02]} s={1.8} glow={0.7 + 0.4 * pr + 1.2 * Math.abs(pulse)} />
    <group position={[-0.34 + 0.108 + 0.25 * (1 - ap), 1.0 - 0.162 - 0.25 * (1 - ap), 0.1 + 0.1 * (1 - ap) - 0.03 * pr]} rotation={[-1.0, 0, 0.35]}>
      <Cy rt={0.04} rb={0.047} h={0.7} p={[0, -0.35, 0]} c="#d9a07a" ro={0.6} />
      <Sp rad={0.04} c="#d9a07a" ro={0.6} />
    </group>
    <Bx s={[0.66, 0.32, 0.012]} p={[0.4, 0.98, 0.006]} c="#f3ead2" ro={0.8} rad={0.004} />
    <Bx s={[0.62, 0.28, 0.002]} p={[0.4, 0.98, 0.013]} c="#c9b98a" ro={0.9} ns />
    {st > 0.88 && <Txt t="EARL'S RULE" w={0.52} c="#c8302a" o={0.9} p={[0.4, 0.98, 0.016]} r={[0, 0, 0.05]} />}
    <group position={[0.4, 0.98, 0.02 + (1 - st) * 0.5 + up * 0.5]} rotation={[Math.PI / 2, (1 - st) * 2, 0]} scale={Math.max(0.001, win(u, 0.5, 0.56))}>
      <Bx s={[0.5, 0.05, 0.2]} p={[0, -0.02, 0]} c="#3a2a1c" ro={0.7} rad={0.01} />
      <Bx s={[0.46, 0.012, 0.16]} p={[0, -0.05, 0]} c="#c8302a" ro={0.9} />
      <Cy rt={0.045} rb={0.06} h={0.2} p={[0, 0.1, 0]} c="#6b4a2e" ro={0.6} /><Sp rad={0.075} p={[0, 0.22, 0]} c="#6b4a2e" ro={0.5} />
    </group>
  </S3>;
}}</Stage>;

const RING: [number, number, string, string][] = [[6, 8, "#e9b33a", "70"], [8, 17, "#4caf6a", "68"], [17, 22, "#e9803a", "70"], [22, 30, "#4f7ea6", "65"]];
const dial24 = () => canvasTex("dial24v3", 512, 512, (g) => {
  g.fillStyle = "#f6f1e4"; g.beginPath(); g.arc(256, 256, 256, 0, Math.PI * 2); g.fill(); g.fillStyle = "#2a2520"; g.font = BOLD(46); g.textAlign = "center"; g.textBaseline = "middle";
  [0, 6, 12, 18].forEach((hr) => { const a = hr / 24 * Math.PI * 2; g.fillText(["12a", "6a", "12p", "6p"][hr / 6], 256 + 150 * Math.sin(a), 256 - 150 * Math.cos(a)); });
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; g.fillRect(256 + 236 * Math.sin(a) - 3, 256 - 236 * Math.cos(a) - 3, 6, 6); }
});
// 29 · el anillo de 24 h: un reloj enorme acostado en la mesa; la aguja barre el día y deja cuatro arcos de color gruesos que se levantan del disco, cada uno con su número grabado (70, 68, 70, 65)
export const HRing24: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), sw = win(u, 0.08, 0.8), hr = 6 + sw * 24, a = lerp(0.25, -0.25, win(u, 0, 1)), A = (x: number) => (x / 24) * Math.PI * 2, rise = drop(u, 0.82, 0.92);
  return <S3 p={[1.15 * Math.sin(a), 1.15, 1.15 * Math.cos(a)]} l={[0, 0.03, 0.02]} fov={38}>
    <Cy rt={0.58} h={0.06} p={[0, 0.03, 0]} c="#6b4a2e" ro={0.45} seg={64} />
    <mesh position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.55, 64]} /><meshStandardMaterial map={dial24()} roughness={0.6} /></mesh>
    <group position={[0, 0.07, 0]} rotation={[0, -A(hr), 0]}><Bx s={[0.016, 0.01, 0.5]} p={[0, 0, -0.25]} c="#1a1a1a" ns /><Sp rad={0.03} c="#c9a24a" m={0.9} ro={0.3} /></group>
    {RING.map(([s, e, c, lab], i) => { const k = cl((hr - s) / (e - s)), mid = A((s + e) / 2);
      return <group key={i}>
        {k > 0.01 && <group position={[0, 0.075 + 0.05 * rise, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2 - A(s) - A(e - s) * k]}><To R={0.47} t={0.05} arc={A(e - s) * k} c={c} e={c} ei={0.5} ro={0.4} /></group>}
        <Lbl t={lab} w={0.17} p={[0.23 * Math.sin(mid), 0.1 + 0.05 * rise, -0.23 * Math.cos(mid)]} r={[-Math.PI / 2, 0, 0]} c={c} o={k > 0.3 ? 1 : 0} />
      </group>; })}
  </S3>;
}}</Stage>;

// 30 · el candado: el termostato «HOLD 72» en primer plano; una cadena gruesa de acero se enrolla eslabón por eslabón y un candado dorado enorme cae con rebote, se cierra de golpe y suelta chispas
export const HPadlock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ch = win(u, 0.08, 0.48), fall = drop(u, 0.5, 0.62), lk = win(u, 0.64, 0.7), sp = win(u, 0.62, 0.66) * (1 - win(u, 0.7, 0.8)), N = 34;
  return <S3 p={lv([0.1, 1.02, 1.5], [0.02, 1.0, 1.3], win(u, 0, 1))} l={[0, 1.0, 0]} fov={36} floor={null}>
    <Wall />
    <group position={[0, 1.02, 0.03]}>
      <Cy rt={0.3} h={0.07} r={[Math.PI / 2, 0, 0]} c="#1c1d20" m={0.4} ro={0.25} seg={64} />
      <To R={0.3} t={0.018} p={[0, 0, 0.035]} c="#c0c4c8" m={1} ro={0.2} />
      <Txt t="HOLD" w={0.2} c="#ffb14a" e={1} p={[0, 0.1, 0.04]} />
      <Txt t="72" w={0.26} c="#ffffff" e={1} p={[0, -0.06, 0.04]} />
    </group>
    {Array.from({ length: N }, (_, i) => { const f = i / N; if (f > ch) return null; const a = f * Math.PI * 2 + 0.3, R = 0.42;
      return <To key={i} R={0.045} t={0.013} p={[R * Math.cos(a), 1.02 + R * Math.sin(a), 0.09 + (i % 2) * 0.01]} r={[i % 2 ? Math.PI / 2 : 0, 0, a + Math.PI / 2]} sc={[1.35, 1, 1]} c="#5a5f66" m={1} ro={0.3} e="#8a93a0" ei={0.12} />; })}
    <group position={[0.0, 0.8 + (1 - fall) * 0.9, 0.2]} scale={Math.max(0.001, win(u, 0.46, 0.5))}>
      <Bx s={[0.4, 0.32, 0.12]} c="#d4a93c" m={0.95} ro={0.22} rad={0.035} e="#8a6a1c" ei={0.15} />
      <To R={0.12} t={0.026} arc={Math.PI} p={[0, 0.16 + 0.1 * (1 - lk), 0]} c="#c0c4c8" m={1} ro={0.2} />
      <Cy rt={0.028} h={0.015} p={[0, 0.0, 0.062]} r={[Math.PI / 2, 0, 0]} c="#2a2a2a" />
      <Bx s={[0.02, 0.07, 0.015]} p={[0, -0.05, 0.062]} c="#2a2a2a" />
      <Dot p={[0.14, 0.18, 0.1]} r={0.12 * sp + 0.001} c="#fff3c0" o={sp} add />
      {Array.from({ length: 6 }, (_, i) => <Dot key={i} p={[Math.cos(i * 1.05) * (0.1 + 0.25 * sp), Math.sin(i * 1.05) * (0.1 + 0.25 * sp), 0.1]} r={0.02} c="#ffe08a" o={sp} add />)}
    </group>
  </S3>;
}}</Stage>;

const TERM: [string, string][] = [["R", "#d4231c"], ["W", "#eeeeee"], ["G", "#2f9a4a"], ["Y", "#e9c23a"], ["C", "#3a6ad4"]];
// 31 · los cables: en la bornera, R, W, G e Y se iluminan en secuencia con un pulso de luz que corre por cada cable; el borne C queda vacío, rojo y parpadeando con chispas, y el termostato del fondo se apaga
export const HWires: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), blink = u > 0.5 ? (Math.sin(tt * 12) > 0 ? 1 : 0.2) : 0, off = win(u, 0.72, 0.8), spk = Math.floor(tt * 12);
  return <S3 p={lv([0.2, 0.95, 1.45], [0.05, 0.88, 1.25], win(u, 0, 1))} l={[0.05, 0.86, 0]} fov={36} floor={null}>
    <Wall />
    <Thermo3 v={off > 0.5 ? "  " : "72"} p={[0.58, 1.18, -0.0]} s={1.2} glow={0.6 * (1 - off)} dark={off > 0.5} />
    <Bx s={[0.95, 0.46, 0.03]} p={[-0.16, 0.92, 0.0]} c="#efece4" ro={0.45} rad={0.02} />
    <Bx s={[0.2, 0.3, 0.04]} p={[-0.16, 0.5, 0.0]} c="#5a5c60" ro={0.5} />
    {TERM.map(([n, c], i) => { const x = -0.5 + i * 0.17, on = win(u, 0.06 + i * 0.1, 0.14 + i * 0.1), isC = n === "C", pf = cl((u - 0.06 - i * 0.1) / 0.12);
      const pts: V3[] = [[x, 0.92, 0.04], [x, 0.78, 0.08], [x * 0.4 - 0.1, 0.64, 0.07], [-0.16, 0.5, 0.05]];
      return <group key={n}>
        <Cy rt={0.04} h={0.03} p={[x, 0.92, 0.03]} r={[Math.PI / 2, 0, 0]} c={isC ? "#201010" : "#c9a24a"} m={0.9} ro={0.3} e={isC ? "#ff2a10" : c} ei={isC ? blink * 1.2 : on * 0.8} />
        <Bx s={[0.05, 0.008, 0.008]} p={[x, 0.92, 0.048]} c="#2a2a28" ns />
        <Txt t={n} w={0.07} c={isC ? "#c8302a" : "#2a2a28"} p={[x, 1.07, 0.02]} />
        {!isC && <Tube pts={pts} rad={0.015} c={c} ro={0.5} e={c} ei={0.25 + 0.5 * on} />}
        {!isC && pf > 0 && pf < 1 && <Dot p={lv(pts[3], pts[0], pf)} r={0.04} c="#ffffff" o={0.9} add />}
        {isC && <>
          <To R={0.062} t={0.01} p={[x, 0.92, 0.05]} c="#ff2a10" e="#ff2a10" ei={blink * 2} o={0.4 + 0.6 * blink} />
          <Dot p={[x, 0.92, 0.07]} r={0.08} c="#ff2a10" o={0.45 * blink} add />
          {blink > 0.5 && [0, 1, 2].map((j) => <Tube key={j} pts={[[x, 0.92, 0.07], [x + (rnd(spk + j) - 0.5) * 0.12, 0.92 - 0.06 - rnd(spk + j + 4) * 0.05, 0.1], [x + (rnd(spk + j + 8) - 0.5) * 0.25, 0.92 - 0.17 - rnd(spk + j + 3) * 0.08, 0.12]]} rad={0.008} c="#ffb040" e="#ff8a20" ei={1.5} />)}
        </>}
      </group>; })}
  </S3>;
}}</Stage>;

// 32 · el ventilador de techo: el ventilador entero en cuadro, las aspas giran y bajan cintas de aire sobre una persona sentada en el sillón (el pelo se mueve); el termómetro del cuarto queda en 78 y el de la persona baja a 74
export const HCeilingfan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), spin = win(u, 0.05, 0.25), fl = Math.round(lerp(78, 74, win(u, 0.35, 0.7)));
  return <S3 p={lv([0.25, 0.78, 2.15], [0.05, 0.75, 1.9], win(u, 0, 1))} l={[0, 0.72, 0]} fov={40} floor={null}>
    <Bx s={[6, 1.7, 0.05]} p={[0, 0.85, -0.6]} map={PLASTER()} c="#f0e8da" ro={0.95} ns />
    <Bx s={[6, 0.05, 3]} p={[0, 1.5, 0.7]} c="#f4f0e6" ro={0.9} ns />
    <Bx s={[6, 0.04, 3]} p={[0, -0.02, 0.7]} map={PLANKS()} c="#c8a06c" ro={0.6} />
    <Cy rt={0.015} h={0.12} p={[0, 1.43, 0]} c="#c9a24a" m={0.9} ro={0.3} />
    <Blades a={spin * tt * 8} R={0.55} p={[0, 1.34, 0]} r={[-0.4, 0, 0]} />
    {Array.from({ length: 6 }, (_, i) => { const f = (tt * 0.5 + i / 6) % 1, ph = (i / 6) * 6.28;
      const pts = Array.from({ length: 12 }, (_, k) => [Math.cos(ph) * 0.4 + Math.sin(k * 0.5 + tt * 2 + i) * 0.03, 1.25 - 0.45 * (k / 11), 0.1 + Math.sin(ph) * 0.2] as V3);
      return <Tube key={i} pts={pts} rad={0.014} seg={24} c="#dff2ff" e="#bfe0ff" ei={1} o={0.7 * spin * Math.sin(f * Math.PI)} />; })}
    <group>
      <Bx s={[0.7, 0.2, 0.62]} p={[0, 0.14, 0]} c="#8b4f3a" ro={0.8} rad={0.06} />
      <Bx s={[0.7, 0.55, 0.14]} p={[0, 0.45, -0.28]} c="#8b4f3a" ro={0.8} rad={0.06} />
      <Bx s={[0.1, 0.3, 0.55]} p={[-0.38, 0.27, 0]} c="#7a4332" ro={0.8} rad={0.04} /><Bx s={[0.1, 0.3, 0.55]} p={[0.38, 0.27, 0]} c="#7a4332" ro={0.8} rad={0.04} />
      <Cy rt={0.085} h={0.38} p={[-0.1, 0.3, 0.3]} r={[Math.PI / 2, 0, 0]} c="#3a4a6a" ro={0.8} /><Cy rt={0.085} h={0.38} p={[0.1, 0.3, 0.3]} r={[Math.PI / 2, 0, 0]} c="#3a4a6a" ro={0.8} />
      <Cy rt={0.12} rb={0.14} h={0.4} p={[0, 0.5, -0.05]} c="#4f7ea6" ro={0.7} />
      <Cy rt={0.045} h={0.45} p={[-0.17, 0.46, 0.03]} r={[0.5, 0, 0.2]} c="#4f7ea6" ro={0.7} /><Cy rt={0.045} h={0.45} p={[0.17, 0.46, 0.03]} r={[0.5, 0, -0.2]} c="#4f7ea6" ro={0.7} />
      <Sp rad={0.1} p={[0, 0.84, -0.05]} c="#e0b896" ro={0.6} />
      {Array.from({ length: 7 }, (_, i) => <Tube key={i} pts={[[(i - 3) * 0.02, 0.92, -0.05 + (i % 2) * 0.03], [(i - 3) * 0.035 + Math.sin(tt * 6 + i) * 0.04 * spin, 0.98, -0.05], [(i - 3) * 0.05 + Math.sin(tt * 6 + i * 2) * 0.07 * spin, 1.0 - 0.04 * Math.abs(i - 3), -0.03 + 0.02 * spin]]} rad={0.009} c="#3a2a1c" ro={0.7} />)}
      <Dot p={[-0.035, 0.85, 0.045]} r={0.012} c="#222222" /><Dot p={[0.035, 0.85, 0.045]} r={0.012} c="#222222" />
    </group>
    <Glass deg={78} p={[-1.0, 0.28, 0.0]} s={1.35} />
    <Lbl t="78°" w={0.34} p={[-0.72, 0.62, 0.05]} c="#ff9a7a" o={win(u, 0.15, 0.25)} />
    <Glass deg={fl} p={[1.0, 0.28, 0.0]} s={1.35} />
    <Lbl t={`${fl}°`} w={0.34} p={[0.72, 0.62, 0.05]} c="#9fd4ff" o={win(u, 0.35, 0.45)} />
  </S3>;
}}</Stage>;

// 33 · nunca llega: el sol grande en la ventana; un termómetro gordo y entero baja, baja… y choca con chispas contra un piso de vidrio en 74; la marca verde 62 queda debajo, fuera de alcance
export const HNeverthere: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.12, 0.6), cur = Math.max(74, lerp(84, 70, k)) + (k > 0.71 ? Math.abs(bump(u, 0.52, 34, 9)) * 0.6 : 0), yOf = (d: number) => 0.2 + (d - 60) * 0.04, hit = win(u, 0.5, 0.53) * (1 - win(u, 0.56, 0.64)), cx = 0.4;
  return <S3 p={lv([0.45, 0.78, 2.1], [0.25, 0.74, 1.95], win(u, 0, 1))} l={[0.2, 0.72, 0]} fov={38}>
    <Bx s={[5, 2.6, 0.05]} p={[0, 1.1, -0.7]} map={PLASTER()} c="#f0e2cc" ro={0.95} ns />
    <Pl w={0.9} h={0.8} p={[-0.75, 1.0, -0.67]} c="#bfe2ff" e="#9fd0ff" ei={0.6} ns />
    <Sp rad={0.22} p={[-0.7, 1.05, -0.64]} c="#ffd26a" e="#ffb020" ei={2.2} ns />
    <Puff p={[-0.7, 1.05, -0.6]} s={1.0} c="#ffd080" o={0.45} />
    <pointLight position={[-0.6, 1.2, -0.3]} intensity={1.5} distance={2.4} color="#ffd080" />
    <Cy rt={0.085} h={1.2} p={[cx, 0.75, 0]} c="#e8f0f4" o={0.22} ro={0.05} />
    <Sp rad={0.14} p={[cx, 0.13, 0]} c="#e8603a" e="#e8603a" ei={0.5} />
    <Cy rt={0.05} h={yOf(cur) - 0.13} p={[cx, 0.13 + (yOf(cur) - 0.13) / 2, 0]} c="#e8603a" e="#e8603a" ei={0.5} />
    {[60, 65, 70, 75, 80].map((d) => <Bx key={d} s={[0.05, 0.006, 0.006]} p={[cx + 0.11, yOf(d), 0.02]} c="#2a2520" ns />)}
    <Bx s={[0.62, 0.025, 0.46]} p={[cx, yOf(74) - 0.012, 0]} c="#bfe6ff" o={0.6} m={0.2} ro={0.05} />
    <Bx s={[0.62, 0.006, 0.01]} p={[cx, yOf(74), 0.23]} c="#dff4ff" e="#9fd8ff" ei={1} ns />
    {Array.from({ length: 10 }, (_, i) => { const a = i * 0.65, d = 0.05 + 0.2 * win(u, 0.5, 0.58); return <Dot key={i} p={[cx + Math.cos(a) * d, yOf(74) + Math.abs(Math.sin(a * 1.7)) * d * 0.7, Math.sin(a) * d]} r={0.016} c="#fff2a0" o={hit} add />; })}
    {[0, 1, 2, 3, 4, 5].map((i) => <Sp key={i} rad={0.012} p={[cx, yOf(74) - 0.06 - i * 0.07, 0]} c="#7ce0a2" e="#7ce0a2" ei={0.6} ns />)}
    <Bx s={[0.46, 0.025, 0.24]} p={[cx, yOf(62), 0]} c="#3fbf6a" e="#3fbf6a" ei={1.1} />
    <group position={[cx + 0.62, yOf(62), 0.05]}><Bx s={[0.4, 0.13, 0.02]} c="#0f2a18" ro={0.5} rad={0.01} /><Txt t="SET 62" w={0.3} c="#7ce0a2" p={[0, 0, 0.012]} /></group>
    <group position={[cx + 0.62, yOf(cur), 0.05]}><Bx s={[0.34, 0.13, 0.02]} c="#2a1410" ro={0.5} rad={0.01} /><Txt t={`${Math.round(cur)}°`} w={0.22} c="#ffffff" p={[0, 0, 0.012]} /></group>
  </S3>;
}}</Stage>;

const mapTex = () => canvasTex("mapa_ohio3", 1024, 640, (g) => {
  g.fillStyle = "#e6dcc4"; g.fillRect(0, 0, 1024, 640); g.strokeStyle = "#b9ab8a"; g.lineWidth = 3;
  for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(0, 70 * i + 20); g.bezierCurveTo(300, 70 * i - 30, 700, 70 * i + 60, 1024, 70 * i); g.stroke(); }
  g.strokeStyle = "#8aa8c4"; g.lineWidth = 12; g.beginPath(); g.moveTo(80, 330); g.bezierCurveTo(300, 250, 520, 420, 960, 300); g.stroke();
  g.fillStyle = "#2a2520"; g.font = BOLD(54); g.textAlign = "center"; g.fillText("DAYTON", 250, 590); g.fillText("SPRINGFIELD", 760, 262);
  g.fillStyle = "#c8302a"; g.beginPath(); g.arc(838, 153, 14, 0, Math.PI * 2); g.fill();
});
const arc = (f: number): V3 => [lerp(-0.32, 0.35, f), 0.04 + Math.sin(f * Math.PI) * 0.25, lerp(0.15, -0.18, f)];
// avión de papel plegado (dos alas en V, quilla al centro), de frente a +x
const Paper: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const g1 = useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0.14, 0, 0, -0.09, 0.035, -0.1, -0.09, -0.02, 0]), 3)); g.computeVertexNormals(); return g; }, []);
  const g2 = useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0.14, 0, 0, -0.09, -0.02, 0, -0.09, 0.035, 0.1]), 3)); g.computeVertexNormals(); return g; }, []);
  return <group scale={s}>
    <mesh geometry={g1} castShadow><meshStandardMaterial color="#f0592a" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    <mesh geometry={g2} castShadow><meshStandardMaterial color="#c8381a" roughness={0.6} side={THREE.DoubleSide} /></mesh>
  </group>;
};
// 34 · el viaje: un avión de papel naranja grande despega de la casita (termostato en 55 con halo azul en la puerta) y recorre el arco punteado sobre el mapa con su sombra, de Dayton a Springfield
export const HFlight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), f = win(u, 0.16, 0.76), q = arc(f), nx = arc(Math.min(1, f + 0.02));
  const lc = lv(lv([-0.2, 0.05, 0.14], [lerp(-0.2, 0.3, f), 0.05, lerp(0.14, -0.12, f)], win(u, 0.1, 0.8)), [0.28, 0.05, -0.1], win(u, 0.8, 1));
  return <S3 p={[lc[0] + 0.02, 0.95, lc[2] + 0.8]} l={lc} fov={38}>
    <Bx s={[3, 0.02, 2]} p={[0, -0.02, 0]} c="#c8a06c" map={PLANKS()} ro={0.6} />
    <Pl w={1.1} h={0.69} p={[0, 0.004, 0]} r={[-Math.PI / 2, 0, 0]} map={mapTex()} c="#ffffff" ro={0.85} />
    {Array.from({ length: 30 }, (_, i) => i / 30 < f && <Sp key={i} rad={0.0095} p={arc(i / 30)} c="#c8302a" ns />)}
    <group position={q} rotation={[0, Math.atan2(-(nx[2] - q[2]), nx[0] - q[0]), (nx[1] - q[1]) * 6]} scale={1.9}><Paper /></group>
    <Sp rad={0.03} p={[q[0], 0.006, q[2]]} sc={[2.6, 0.05, 1.4]} c="#000000" o={0.3} ns />
    <group position={[-0.32, 0.004, 0.15]} scale={1.3}>
      <Bx s={[0.16, 0.11, 0.13]} p={[0, 0.055, 0]} c="#e8dcc0" ro={0.8} />
      <mesh position={[0, 0.145, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[0.13, 0.09, 4]} /><meshStandardMaterial color="#8a3a2a" roughness={0.7} /></mesh>
      <Bx s={[0.045, 0.07, 0.01]} p={[-0.05, 0.035, 0.066]} c="#6b4a2e" ro={0.6} />
      <Thermo3 v="55" p={[0.025, 0.06, 0.068]} s={0.3} glow={1.2} />
      <Dot p={[0.025, 0.06, 0.1]} r={0.1} c="#5ab0ff" o={0.4 + 0.12 * Math.sin(tt * 3)} add />
    </group>
  </S3>;
}}</Stage>;
