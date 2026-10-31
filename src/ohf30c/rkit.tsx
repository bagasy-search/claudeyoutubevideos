// ohf30c · kit de la vuelta 2 (eval r1_c): el RÓTULO GRANDE de cinta de pintor (un solo mensaje, entero, dentro del 90 %
// central, abajo, sin tapar el objeto), la MANO (piel o guante de nitrilo), cortes de madera con VETA DE TESTA en la cara
// cortada (perfiles extruidos reales: travesaños de encuentro, jamba con su listón separador), corrientes de aire frío que
// siguen una curva, papel de pared y nieve. Nada se exporta con prefijo H.
import React from "react";
import * as THREE from "three";
import { MARK, cl, phys } from "./hkit";
import { M, curve, rn, tex } from "./h3d";

const PI = Math.PI;
export type V3 = [number, number, number];

// ---------- RÓTULO GRANDE (HTML sobre la escena): cinta de pintor con marcador, entra con peso y se escribe ----------
// y = centro vertical en px (1080); por defecto abajo (930). b = tt en que se va (para encadenar mensajes, uno por vez).
export const Say: React.FC<{ tt: number; a: number; b?: number; txt: string; col?: string; y?: number; x?: number; rot?: number; size?: number }> = ({ tt, a: a0, b: b0, txt, col = "#1c2a3a", y = 930, x = 960, rot = -1.5, size = 84 }) => {
  // regla de los cuadros de control (45 % ≈ tt 2,7 · 85 % ≈ tt 5,15): ningún rótulo a medio entrar ni a medio irse cerca de esos
  // instantes; el que caería ahí entra antes (entero y opaco desde el 35 %) o se va antes
  const a = a0 > 1.7 && a0 <= 2.75 ? 1.7 : a0 > 4.2 && a0 <= 5.2 ? 4.2 : a0;
  const b1 = b0 === undefined ? undefined : b0 > 1.4 && b0 <= 2.75 ? 1.4 : b0 > 3.9 && b0 <= 5.2 ? 3.9 : b0;
  const b = b1 !== undefined && b0 !== undefined && b1 !== b0 && b1 < a + 0.6 ? (b0 > 3 ? 5.3 : 2.95) : b1;
  const s = phys(tt, a, 9, 0.6), o = b === undefined ? 0 : cl((tt - b) / 0.25);
  if (s <= 0.01 || o >= 1) return null;
  const fs = Math.min(size, Math.floor(1420 / Math.max(1, txt.length * 0.7)));
  const w = cl((tt - a - 0.04) / 0.3);
  // dentro del 88 % central: margen ≥6 % arriba/abajo y a los costados
  const bw = fs * (0.62 * txt.length + 1.2) / 2, xx = Math.min(1920 * 0.94 - bw, Math.max(1920 * 0.06 + bw, x));
  const yy = Math.min(1080 * 0.94 - fs * 0.9, Math.max(1080 * 0.12 + fs * 0.9, y));
  return <div style={{ position: "absolute", left: xx, top: yy, transform: `translate(-50%,-50%) rotate(${rot + (1 - s) * 3}deg) translateY(${(1 - cl(s)) * -46 + o * 30}px) scale(${0.86 + 0.14 * s})`, opacity: cl(s * 2) * (1 - o), pointerEvents: "none", maxWidth: 1650 }}>
    <div style={{ position: "relative", padding: `${Math.round(fs * 0.2)}px ${Math.round(fs * 0.55)}px ${Math.round(fs * 0.12)}px`, background: "linear-gradient(176deg,#f3e6bc,#e9d9a6 55%,#dfcc93)", boxShadow: "0 14px 34px rgba(0,0,0,.55), 0 2px 3px rgba(0,0,0,.35)",
      clipPath: "polygon(1.2% 6%, 0 22%, 1.4% 40%, 0.2% 61%, 1.5% 80%, 0 100%, 98.6% 96%, 100% 78%, 98.7% 58%, 100% 37%, 98.9% 17%, 100% 0)" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(92deg, rgba(150,120,60,.07) 0 3px, transparent 3px 11px)" }} />
      <div style={{ position: "relative", fontFamily: MARK, fontSize: fs, lineHeight: 1.12, color: col, whiteSpace: "nowrap", letterSpacing: 1, clipPath: `inset(-30% ${(1 - w) * 100}% -30% 0)` }}>{txt}</div>
    </div>
  </div>;
};

// ---------- texturas ----------
// veta de testa (anillos de crecimiento) para la cara cortada de una pieza de madera pintada
export const endTex = (rep = 14, base = "#c99a62") => tex.text("endg" + base + rep, 512, 512, (g) => {
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 46; i++) { g.strokeStyle = `rgba(110,62,24,${0.18 + 0.25 * rn(i, 2)})`; g.lineWidth = 2 + 5 * rn(i, 3); g.beginPath(); g.arc(-120, 640, 60 + i * 17 + 6 * rn(i, 4), 0, PI * 2); g.stroke(); }
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(70,40,16,${0.12 * rn(i, 5)})`; g.fillRect(rn(i, 6) * 512, rn(i, 7) * 512, 2, 1); }
});
const ENDM = new Map<string, THREE.Material[]>();
// materiales de un perfil extruido: [testa, pintura]
export const cutMats = (paint = "#ece5d6", rep = 14, base = "#c99a62") => {
  const k = paint + rep + base; let m = ENDM.get(k);
  if (!m) { const t = endTex(rep, base).clone(); t.repeat.set(rep, rep); t.needsUpdate = true;
    m = [new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 }), new THREE.MeshPhysicalMaterial({ color: paint, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.4 })]; ENDM.set(k, m); }
  return m;
};
// papel de pared victoriano (rayas y rombos) y friso
export const wallpaper = (rx = 3, ry = 2, a = "#5d6b55", b = "#6b7a62", c = "#c9b77e") => tex.text("wp" + a + b + c + rx + ry, 256, 256, (g) => {
  g.fillStyle = a; g.fillRect(0, 0, 256, 256); g.fillStyle = b; g.fillRect(0, 0, 128, 256);
  g.strokeStyle = c; g.globalAlpha = 0.55; g.lineWidth = 3;
  for (let k = 0; k < 2; k++) { const x = 64 + k * 128; g.beginPath(); g.moveTo(x, 20); g.lineTo(x + 26, 64); g.lineTo(x, 108); g.lineTo(x - 26, 64); g.closePath(); g.stroke(); g.beginPath(); g.arc(x, 192, 14, 0, PI * 2); g.stroke(); }
  g.globalAlpha = 1;
});
export const wpMat = (a?: string, b?: string, c?: string, rx = 3, ry = 2) => { const t = wallpaper(rx, ry, a, b, c); t.repeat.set(rx, ry); return t; };
// pintura vieja descascarada (base crema con escamas de manos anteriores)
export const oldPaint = (rep = 2) => tex.text("oldp" + rep, 512, 256, (g) => {
  g.fillStyle = "#e9e1cd"; g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 70; i++) { const x = rn(i, 1) * 512, y = rn(i, 2) * 256, r = 4 + 16 * rn(i, 3);
    g.fillStyle = rn(i, 4) < 0.5 ? "#6f8a6a" : "#9a4a38"; g.beginPath(); for (let j = 0; j < 7; j++) { const a = j / 7 * PI * 2, rr = r * (0.6 + 0.5 * rn(i * 7 + j, 5)); j ? g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.6) : g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.6); } g.fill(); }
  for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(90,70,40,${0.08 * rn(i, 6)})`; g.fillRect(rn(i, 7) * 512, rn(i, 8) * 256, 3, 1); }
});

// ---------- perfil extruido a lo largo de X (la cara cortada mira a +X), con testa en las tapas ----------
const PG = new Map<string, THREE.BufferGeometry>();
export const profG = (key: string, pts: number[][], L: number) => {
  let g = PG.get(key + L); if (g) return g;
  const s = new THREE.Shape(pts.map(([z, y]) => new THREE.Vector2(z, y)));
  g = new THREE.ExtrudeGeometry(s, { depth: L, bevelEnabled: true, bevelThickness: 0.0015, bevelSize: 0.0015, bevelSegments: 2, curveSegments: 6 });
  g.rotateY(-PI / 2); g.translate(L / 2, 0, 0); PG.set(key + L, g); return g;
};
export const Prof: React.FC<{ id: string; pts: number[][]; L: number; p?: V3; rot?: V3; paint?: string; rep?: number }> = ({ id, pts, L, p = [0, 0, 0], rot = [0, 0, 0], paint, rep }) =>
  <mesh geometry={profG(id, pts, L)} material={cutMats(paint, rep)} position={p} rotation={rot} castShadow receiveShadow />;

// los dos travesaños de encuentro en corte (perfil real: chanfle de encuentro paralelo, vidrio con su masilla).
// z: afuera (-) → cuarto (+). gap = luz entre los dos; lift = cuánto más abajo está el de la hoja de abajo. Largo L en X.
export const MR_SLANT = 0.006, MR_H = 0.07;
export const MeetRails: React.FC<{ gap: number; lift?: number; L?: number; glass?: number; children?: React.ReactNode }> = ({ gap, lift = 0, L = 0.9, glass = 0.3, children }) => {
  const g2 = gap / 2, q = (v: number) => Math.round(v * 2000) / 2000;
  const up = [[-0.075, 0], [q(-g2 - MR_SLANT), 0], [q(-g2), MR_H], [-0.075, MR_H]];
  const lo = [[q(g2 - MR_SLANT), 0], [0.075, 0], [0.075, MR_H], [q(g2), MR_H]];
  return <group>
    <Prof id={"mrUp" + up[1][0]} pts={up} L={L} />
    <mesh position={[0, MR_H + glass / 2, -0.045]}><boxGeometry args={[L, glass, 0.004]} />{M.glass({ op: 0.16 })}</mesh>
    <Prof id="mrPutA" pts={[[-0.062, MR_H], [-0.048, MR_H], [-0.048, MR_H + 0.016]]} L={L} paint="#cfc6b1" rep={4} />
    <group position={[0, lift, 0]}>
      <Prof id={"mrLo" + lo[0][0]} pts={lo} L={L} />
      <mesh position={[0, -glass / 2, 0.045]}><boxGeometry args={[L, glass, 0.004]} />{M.glass({ op: 0.16 })}</mesh>
    </group>
    {children}
  </group>;
};

// corriente de aire frío que sigue una curva: trazos brillantes alargados que avanzan (k = intensidad 0..1)
export const Stream: React.FC<{ id: string; tt: number; pts: number[][]; n?: number; k?: number; col?: string; w?: number; len?: number; v?: number; spread?: number }> = ({ id, tt, pts, n = 14, k = 1, col = "#8fd6ff", w = 0.004, len = 0.06, v = 0.45, spread = 0.02 }) => {
  if (k <= 0.01) return null;
  const c = curve(pts); const up = new THREE.Vector3(0, 1, 0);
  return <group>{Array.from({ length: n }, (_, i) => {
    const u = (tt * v * (0.8 + 0.4 * rn(i, 31)) + rn(i, 32)) % 1, p = c.getPointAt(u), tg = c.getTangentAt(u);
    const q = new THREE.Quaternion().setFromUnitVectors(up, tg.normalize());
    const o = [(rn(i, 33) - 0.5) * spread, (rn(i, 34) - 0.5) * spread, (rn(i, 35) - 0.5) * spread];
    return <mesh key={id + i} position={[p.x + o[0], p.y + o[1], p.z + o[2]]} quaternion={q}><capsuleGeometry args={[w * (0.7 + 0.6 * rn(i, 36)), len * (0.6 + 0.8 * rn(i, 37)), 4, 8]} />{M.glow({ col, op: k * 0.75 * Math.sin(PI * u) })}</mesh>;
  })}</group>;
};

// nieve que cae en una caja [x0,x1]×[y0,y1]×[z0,z1]
export const Snow: React.FC<{ tt: number; n?: number; box: number[]; r?: number }> = ({ tt, n = 80, box, r = 0.004 }) => <>
  {Array.from({ length: n }, (_, i) => { const u = (tt * (0.06 + 0.05 * rn(i, 41)) + rn(i, 42)) % 1;
    return <mesh key={i} position={[box[0] + (box[1] - box[0]) * rn(i, 43) + 0.02 * Math.sin(tt * 0.8 + i), box[3] - (box[3] - box[2]) * u, box[4] + (box[5] - box[4]) * rn(i, 44)]}>
      <sphereGeometry args={[r * (0.6 + 0.8 * rn(i, 45)), 6, 5]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85} toneMapped={false} /></mesh>; })}
</>;

// ---------- la MANO: palma con dedos de dos falanges y pulgar. Palma hacia -Y, dedos hacia +X. curl 0..1 cierra los dedos ----------
const flannel = () => tex.text("flannel", 128, 128, (g) => { g.fillStyle = "#7d2a24"; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(20,20,24,.55)"; for (let i = 0; i < 128; i += 32) { g.fillRect(i, 0, 12, 128); g.fillRect(0, i, 128, 12); } g.fillStyle = "rgba(230,200,150,.25)"; for (let i = 16; i < 128; i += 32) { g.fillRect(i, 0, 2, 128); g.fillRect(0, i, 128, 2); } });
export const Hand: React.FC<{ p?: V3; rot?: V3; s?: number; curl?: number; thumb?: number; glove?: boolean; col?: string; spread?: number; sleeve?: boolean }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, curl = 0.2, thumb = 0.3, glove = false, col, spread = 0.06, sleeve = true }) => {
  const c = col ?? (glove ? "#3b6fc4" : "#d7a284");
  const mat = glove ? <meshPhysicalMaterial color={c} roughness={0.35} clearcoat={0.5} /> : <meshPhysicalMaterial color={c} roughness={0.55} sheen={0.6} sheenColor="#ffd9c4" />;
  const F = [[0.026, 0.044], [0.009, 0.05], [-0.009, 0.047], [-0.026, 0.038]];
  return <group position={p} rotation={rot} scale={s}>
    <mesh scale={[1, 0.42, 1]} castShadow><sphereGeometry args={[0.05, 24, 16]} />{mat}</mesh>
    <mesh position={[-0.08, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.026, 0.03, 0.1, 18]} />{mat}</mesh>
    {sleeve && <mesh position={[-0.27, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.042, 0.04, 0.3, 24]} /><meshStandardMaterial map={flannel()} roughness={0.95} /></mesh>}
    {sleeve && <mesh position={[-0.125, 0, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.038, 0.006, 8, 24]} /><meshStandardMaterial map={flannel()} roughness={0.95} /></mesh>}
    {F.map(([z, L], i) => <group key={i} position={[0.042, 0.002, z]} rotation={[0, (i - 1.5) * -spread, -curl * 0.9]}>
      <mesh position={[L * 0.3, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.0085, L * 0.55, 4, 10]} />{mat}</mesh>
      <group position={[L * 0.6, 0, 0]} rotation={[0, 0, -curl * 1.1]}>
        <mesh position={[L * 0.22, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.008, L * 0.4, 4, 10]} />{mat}</mesh>
        {!glove && <mesh position={[L * 0.38, 0.006, 0]} scale={[1, 0.3, 0.9]}><sphereGeometry args={[0.0062, 10, 8]} /><meshPhysicalMaterial color="#f1d3c6" roughness={0.25} clearcoat={0.6} /></mesh>}
      </group>
    </group>)}
    <group position={[0.0, -0.004, 0.045]} rotation={[0.3, -0.9 + thumb * 0.7, -0.3]}>
      <mesh position={[0.022, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.011, 0.03, 4, 10]} />{mat}</mesh>
      <mesh position={[0.05, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.0095, 0.022, 4, 10]} />{mat}</mesh>
    </group>
  </group>;
};

// rollo de cinta de pintor azul (núcleo de cartón)
export const TapeRoll: React.FC<{ p?: V3; rot?: V3; s?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, col = "#3d8bd9" }) => <group position={p} rotation={rot} scale={s}>
  <mesh castShadow><cylinderGeometry args={[0.045, 0.045, 0.024, 40, 1, true]} /><meshStandardMaterial color={col} roughness={0.75} side={THREE.DoubleSide} /></mesh>
  {[-1, 1].map((k) => <mesh key={k} position={[0, k * 0.012, 0]} rotation={[k * PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.045, 40]} /><meshStandardMaterial color={col} roughness={0.8} side={THREE.DoubleSide} /></mesh>)}
  <mesh><cylinderGeometry args={[0.03, 0.03, 0.025, 32, 1, true]} /><meshStandardMaterial color="#b58b55" roughness={0.9} side={THREE.DoubleSide} /></mesh>
</group>;

// luces del cuarto desenfocadas al fondo (bokeh): discos tibios grandes y suaves, lejos detrás del objeto
export const Bokeh: React.FC<{ tt: number; n?: number; z?: number; spread?: number[]; col?: string[]; y?: number }> = ({ tt, n = 9, z = -2.2, spread = [3, 1.4], col = ["#ffcf8a", "#ffb36a", "#ffe2b8"], y = 0.6 }) => <>
  {Array.from({ length: n }, (_, i) => <mesh key={i} position={[(rn(i, 51) - 0.5) * spread[0] + 0.03 * Math.sin(tt * 0.3 + i), y + (rn(i, 52) - 0.5) * spread[1], z - rn(i, 53) * 0.6]}>
    <circleGeometry args={[0.07 + 0.11 * rn(i, 54), 40]} /><meshBasicMaterial color={col[i % col.length]} transparent opacity={0.035 + 0.06 * rn(i, 55)} toneMapped={false} depthWrite={false} /></mesh>)}
</>;
