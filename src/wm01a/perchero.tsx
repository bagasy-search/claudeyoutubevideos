// wm01a · EL HILO «el perchero y la etiqueta de Feldman's». Riel de roble con 7 clavijas torneadas contra una pared crema
// (que recibe las sombras), estante abajo para los zapatos. Cada prenda (foto recortada) cae a su clavija, se mece y asienta;
// de la clavija cuelga una etiqueta de cartón de Feldman's que escribe a mano el precio de 1955 y abajo, en lápiz rojo, el de hoy.
// perch0 = el riel vacío, la última clavija con su etiqueta en blanco («?») · hilo<n> = cae la prenda n · precio<n> = la etiqueta
// escribe · recap = el perchero lleno y la etiqueta grande «$20 / $250 today» · gancho = la última clavija, vacía, que espera.
import React from "react";
import * as THREE from "three";
import { Stage } from "./base";
import { Blob, Esc, M, RBox, Ready, camA, canv, cl, edgeAlpha, extr, HAND, lerp, rn, spr, tubeG, useImg, win, type Pose, type V3 } from "./k3d";
import FX from "./fx.json";

export type Fi = { id: string; a: number; b: number; wow?: number | null; n?: number; k?: number; mo?: Record<string, number>; precio?: string; hoy?: string };
const FXA = FX as Fi[];
const FXM: Record<string, Fi> = Object.fromEntries(FXA.map((f) => [f.id, f]));

const RY = 1.7, PX = (i: number) => -1.26 + i * 0.42, SHY = 0.36;
// prenda: [foto, clavija (−1 = estante), ancho m, x en el estante]
const PZ: Record<number, [string, number, number, number?]> = {
  1: ["p01_camiseta", 0, 0.5], 2: ["p02_camisa", 1, 0.56], 3: ["p03_pantalon", 2, 0.44], 4: ["p04_tirantes", 3, 0.26], 5: ["p05_corbata", 4, 0.14],
  6: ["p06_pisacorbata", 4, 0.07], 7: ["p07_oxfords", -1, 0.36, -0.62], 8: ["p08_chanclos", -1, 0.36, -0.08], 9: ["p09_saco", 5, 0.62], 11: ["p11_peine", -1, 0.2, 0.5],
};
// cuándo cae cada pieza (sale de fx.json: el tramo hilo<n>, o precio<n> si no hay)
const land = (n: number) => { const f = FXM["hilo" + n] ?? FXM["precio" + n]; return f ? f.a + 0.3 : 1e9; };
const pr = (n: number) => FXM["precio" + n];

// ---------- la etiqueta ----------
// cartón manila, «FELDMAN'S» impreso arriba; el precio a mano en tinta azul (p1) y abajo, en lápiz rojo, el de hoy (p2)
const tagTex = (precio: string, p1: number, hoy: string, p2: number, tacha = 0) => {
  const q1 = Math.round(cl(p1) * 16) / 16, q2 = Math.round(cl(p2) * 16) / 16, qt = Math.round(cl(tacha) * 8) / 8;
  const ready = typeof document !== "undefined" && document.fonts.check(`700 40px "${HAND}"`);
  return canv(`tag|${precio}|${q1}|${hoy}|${q2}|${qt}|${ready}`, 320, 512, (g) => {
    g.fillStyle = "#d9bf8c"; g.fillRect(0, 0, 320, 512);
    for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? "120,88,40" : "250,236,200"},${0.07 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 320, rn(i, 4) * 512, 2, 2 + 3 * rn(i, 5)); }
    const gr = g.createRadialGradient(160, 260, 120, 160, 260, 330); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(90,60,20,.28)"); g.fillStyle = gr; g.fillRect(0, 0, 320, 512);
    g.fillStyle = "#4a2d16"; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = "700 34px Georgia, serif"; g.fillText("FELDMAN'S", 160, 118);
    g.font = "italic 400 20px Georgia, serif"; g.fillText("Men's Shop · Flatbush", 160, 150);
    g.strokeStyle = "rgba(74,45,22,.55)"; g.lineWidth = 2; g.beginPath(); g.moveTo(40, 172); g.lineTo(280, 172); g.stroke();
    const write = (txt: string, y: number, size: number, ink: string, q: number) => {
      if (q <= 0) return;
      g.font = `700 ${size}px "${HAND}"`; const m = g.measureText(txt), x0 = 160 - m.width / 2;
      g.save(); g.beginPath(); g.rect(0, y - size, x0 + m.width * q + 2, size * 2); g.clip(); g.fillStyle = ink; g.fillText(txt, 160, y); g.restore();
      return m.width;
    };
    const w1 = write(precio, 262, precio.length > 4 ? 104 : 124, "#1d2a4a", q1);
    if (qt > 0 && w1) { g.strokeStyle = "#b8231b"; g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.moveTo(160 - w1 / 2 - 8, 282); g.lineTo(160 - w1 / 2 - 8 + (w1 + 16) * qt, 236); g.stroke(); }
    if (hoy) {
      g.strokeStyle = "rgba(74,45,22,.3)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(50, 340); g.lineTo(270, 340); g.stroke();
      const t2 = hoy === "free" || hoy === "the suit" || hoy === "?" ? hoy : `${hoy} today`;
      write(t2, 402, t2.length > 9 ? 58 : 70, "#b8231b", q2);
    }
  });
};
// forma de etiqueta de envío: rectángulo con las esquinas de arriba cortadas, agujero con arandela
const TW = 0.075, TH = 0.12;
const tagG = () => extr("tagE", [[-TW / 2, -TH / 2], [TW / 2, -TH / 2], [TW / 2, TH / 2 - 0.016], [TW / 2 - 0.016, TH / 2], [-TW / 2 + 0.016, TH / 2], [-TW / 2, TH / 2 - 0.016]], 0.0012, 0.0004);
export const Etiqueta: React.FC<{ p: V3; hang: V3; precio: string; p1: number; hoy: string; p2: number; swing: number; tacha?: number; sc?: number }> = ({ p, hang, precio, p1, hoy, p2, swing, tacha = 0, sc = 1 }) => {
  const tex = tagTex(precio, p1, hoy, p2, tacha);
  const top: V3 = [p[0], p[1] + (TH / 2 - 0.008) * sc, p[2]];
  return <group>
    <mesh castShadow geometry={tubeG(`hilo${hang.join(",")}${top.map((x) => x.toFixed(3)).join(",")}`, [hang, [lerp(hang[0], top[0], 0.5), Math.min(hang[1], top[1]) - 0.012, lerp(hang[2], top[2], 0.5)], top], 0.0011, 30, 6)}>
      <meshStandardMaterial color="#e9e2d0" roughness={0.9} /></mesh>
    <group position={p} rotation={[0.05, 0.18 * Math.sin(swing * 2.1) * Math.exp(-swing * 0.5) - 0.12, 0.1 * Math.sin(swing * 2.9 + 1) * Math.exp(-swing * 0.6)]} scale={sc}>
      <mesh geometry={tagG()} castShadow receiveShadow>
        <meshStandardMaterial attach="material-0" map={tex} roughness={0.92} />
        <meshStandardMaterial attach="material-1" color="#c4a874" roughness={0.95} />
      </mesh>
      <mesh position={[0, TH / 2 - 0.014, 0.0009]}><ringGeometry args={[0.0034, 0.0072, 24]} /><meshStandardMaterial color="#f2e9d6" roughness={0.8} /></mesh>
    </group>
  </group>;
};
// la ExtrudeGeometry trae uvs en metros: se normalizan para que la textura cubra la etiqueta entera
const fixUV = (g: THREE.BufferGeometry) => {
  if (g.userData.uvok) return g; const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) + TW / 2) / TW, (uv.getY(i) + TH / 2) / TH);
  uv.needsUpdate = true; g.userData.uvok = true; return g;
};
fixUV(tagG());

// ---------- el mueble ----------
const roble = (k = "") => <meshPhysicalMaterial map={canv("roble" + k, 512, 128, (g) => {
  g.fillStyle = "#6b4325"; g.fillRect(0, 0, 512, 128);
  for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(${rn(i, 1) > 0.6 ? "160,110,62" : "40,20,8"},${0.12 + 0.18 * rn(i, 2)})`; g.lineWidth = 1 + 2 * rn(i, 3); g.beginPath(); const y = rn(i, 4) * 128; g.moveTo(0, y); g.bezierCurveTo(170, y + 10 * rn(i, 5) - 5, 340, y - 8 * rn(i, 6) + 4, 512, y + 6 * rn(i, 7) - 3); g.stroke(); }
  for (let i = 0; i < 6; i++) { g.strokeStyle = "rgba(30,14,4,.35)"; g.lineWidth = 1.2; g.beginPath(); g.ellipse(rn(i, 8) * 512, rn(i, 9) * 128, 14 + 10 * rn(i, 10), 4, 0, 0, 6.3); g.stroke(); }
})} roughness={0.42} clearcoat={0.55} clearcoatRoughness={0.35} />;
const pared = () => canv("pared", 512, 512, (g) => {
  g.fillStyle = "#cdbf9f"; g.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 43) { g.fillStyle = "rgba(70,55,30,.22)"; g.fillRect(x, 0, 2, 512); g.fillStyle = "rgba(255,248,230,.25)"; g.fillRect(x + 2, 0, 2, 512); }
  for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? "255,250,235" : "90,70,40"},${0.06 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 512, 2, 2); }
}, [3, 2]);
const Clavija: React.FC<{ x: number }> = ({ x }) => <group position={[x, RY, 0.03]} rotation={[-0.32, 0, 0]}>
  <mesh position={[0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.011, 0.014, 0.09, 20]} />{roble("c")}</mesh>
  <mesh position={[0, 0, 0.094]} castShadow><sphereGeometry args={[0.018, 24, 16]} />{roble("c")}</mesh>
</group>;
export const Mueble: React.FC = () => <group>
  <mesh position={[0, 1.05, -0.012]} receiveShadow><planeGeometry args={[4.2, 2.6]} /><meshStandardMaterial map={pared()} roughness={0.95} alphaMap={edgeAlpha()} transparent /></mesh>
  <RBox s={[3.15, 0.13, 0.026]} r={0.006} p={[0, RY, 0.013]}>{roble("r")}</RBox>
  <RBox s={[3.15, 0.012, 0.03]} r={0.004} p={[0, RY + 0.072, 0.02]}>{roble("m")}</RBox>
  {[0, 1, 2, 3, 4, 5, 6].map((i) => <Clavija key={i} x={PX(i)} />)}
  {/* estante de los zapatos con dos ménsulas */}
  <RBox s={[1.9, 0.03, 0.3]} r={0.006} p={[0, SHY, 0.15]}>{roble("e")}</RBox>
  {[-0.8, 0.8].map((x) => <mesh key={x} position={[x, SHY - 0.09, 0.07]} geometry={extr("mens", [[0, 0], [0.14, 0], [0, -0.16]], 0.022, 0.003)} rotation={[0, -Math.PI / 2, 0]} castShadow>{roble("e")}</mesh>)}
</group>;

// ---------- prendas ----------
// foto recortada con perchita o clavija arriba al centro: pivota en su punto de colgado
const Foto: React.FC<{ img: string; w: number; p: V3; rz?: number; ry?: number; drop?: number; o?: number; base?: boolean }> = ({ img, w, p, rz = 0, ry = 0, drop = 0, o = 1, base }) => {
  const [tex, done] = useImg("wm01a/prendas/" + img + ".png");
  const im = tex?.image as HTMLImageElement | undefined, h = im ? (w * im.height) / im.width : w;
  return <group position={[p[0], p[1] + drop, p[2]]} rotation={[0, ry, rz]}>
    {tex && <Ready dep={tex} done={done} />}
    {tex && <mesh position={[0, base ? h / 2 : -h / 2 + 0.01, 0]} castShadow receiveShadow>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={tex} transparent={o < 1} opacity={o} alphaTest={0.4} roughness={0.85} side={THREE.DoubleSide} />
    </mesh>}
  </group>;
};
// estado de una pieza en el segundo t: caída con resorte + vaivén que se apaga
const pieza = (t: number, n: number) => {
  const L = land(n); if (t < L - 0.35) return null;
  const k = spr(t, L - 0.3, 0.95, 1.7), d = t - L;
  return { drop: (1 - k) * 0.9, sw: d > 0 ? 0.13 * Math.exp(-d * 1.6) * Math.sin(d * 7.5) : 0 };
};
const PERCH_Z = (i: number) => 0.075 + (i % 2) * 0.018;
const Prendas: React.FC<{ t: number }> = ({ t }) => <>
  {Object.entries(PZ).map(([ns, [img, peg, w, sx]]) => {
    const n = +ns, st = pieza(t, n); if (!st) return null;
    if (peg < 0) return <group key={n}><Foto img={img} w={w} p={[sx!, SHY + 0.016, 0.17]} drop={st.drop} base ry={0.0} />
      {st.drop < 0.02 && <group position={[sx!, SHY + 0.016, 0.17]}><Blob w={w * 1.1} d={0.22} o={0.5} /></group>}</group>;
    if (n === 6) {   // el pisacorbata entra de costado y muerde la corbata (clic)
      const k = spr(t, land(6), 1.1, 1.5);
      return <Foto key={n} img={img} w={w} p={[PX(4) + (1 - k) * 0.25, RY - 0.36, PERCH_Z(4) + 0.012]} />;
    }
    const top = n === 4 || n === 5 ? RY - 0.004 : RY + 0.03;
    return <Foto key={n} img={img} w={w} p={[PX(peg), top, PERCH_Z(peg)]} drop={st.drop} rz={st.sw} />;
  })}
</>;

// dónde cuelga la etiqueta de cada pieza
const tagPos = (n: number): { p: V3; hang: V3 } => {
  const z = PZ[n];
  if (n === 10) return { p: [PX(6) + 0.006, RY - 0.1, 0.13], hang: [PX(6), RY + 0.004, 0.11] };
  if (z && z[1] < 0) return { p: [z[3]! + 0.15, SHY - 0.075, 0.31], hang: [z[3]! + 0.12, SHY - 0.012, 0.3] };
  const peg = z ? z[1] : 0;
  return { p: [PX(peg) + 0.07, RY - 0.11, 0.14], hang: [PX(peg) + 0.01, RY + 0.004, 0.11] };
};
const Etiquetas: React.FC<{ t: number; sin10?: boolean }> = ({ t, sin10 }) => <>
  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 11].map((n) => {
    const f = pr(n); if (!f || n === 6 || (sin10 && n === 10)) return null;
    const t0 = Math.min(land(n), f.a); if (t < t0) return null;
    const { p, hang } = tagPos(n), m = f.mo!;
    const p1 = win(t, m.p - 0.05, m.p + 0.55), p2 = win(t, m.h, m.h + 0.6);
    return <Etiqueta key={n} p={p} hang={hang} precio={f.precio!} p1={p1} hoy={f.hoy!} p2={n === 11 ? win(t, m.h + 0.45, m.h + 0.9) : p2} tacha={n === 11 ? win(t, m.h, m.h + 0.4) : 0} swing={Math.max(0, t - Math.max(t0, m.p - 0.1))} />;
  })}
  {/* la del pisacorbata va colgada de la corbata (n=6 escribe en la misma clavija que la corbata, más abajo) */}
  {pr(6) && t > pr(6).a - 0.1 && (() => { const m = pr(6).mo!; return <Etiqueta p={[PX(4) + 0.09, RY - 0.27, 0.15]} hang={[PX(4) + 0.03, RY - 0.2, 0.1]} precio={pr(6).precio!} p1={win(t, m.p - 0.05, m.p + 0.55)} hoy={pr(6).hoy!} p2={win(t, m.h, m.h + 0.6)} swing={t - pr(6).a} />; })()}
</>;

// ---------- cámaras ----------
const camPeg = (x: number, y = RY - 0.3, d = 1.25): Pose => ({ p: [x + 0.28, y + 0.12, d], l: [x, y, 0.05], fov: 34 });
const camTag = (p: V3): Pose => ({ p: [p[0] + 0.07, p[1] + 0.03, p[2] + 0.36], l: [p[0], p[1] - 0.004, p[2]], fov: 30 });
const near = (q: Pose, k: number): Pose => ({ p: [lerp(q.l[0], q.p[0], k), lerp(q.l[1], q.p[1], k), lerp(q.l[2], q.p[2], k)], l: q.l, fov: q.fov });

export const PercheroFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b, id } = f, n = f.n ?? 0;
  let c0: Pose, c1: Pose;
  if (id === "perch0") { c0 = { p: [-0.4, 1.55, 2.2], l: [-0.2, 1.4, 0], fov: 34 }; c1 = camTag(tagPos(10).p); c1 = { ...c1, p: [c1.p[0] - 0.06, c1.p[1] + 0.02, c1.p[2] + 0.12] }; }
  else if (id === "recap") { c0 = { p: [0.5, 1.25, 3.1], l: [0, 1.0, 0], fov: 36 }; c1 = { p: [0.85, 1.32, 2.15], l: [0.75, 1.12, 0], fov: 34 }; }
  else if (id === "gancho") { c0 = { p: [PX(4), 1.45, 1.8], l: [PX(5), 1.45, 0], fov: 34 }; c1 = { p: [PX(6) + 0.12, RY - 0.02, 0.72], l: [PX(6), RY - 0.06, 0.06], fov: 30 }; }
  else if (id.startsWith("precio")) { const tp = n === 6 ? [PX(4) + 0.09, RY - 0.27, 0.15] as V3 : tagPos(n).p; c0 = near(camTag(tp), 1.5); c1 = camTag(tp); }
  else { const z = PZ[n], sh = z && z[1] < 0; c0 = sh ? { p: [z[3]! + 0.35, 0.82, 1.4], l: [z[3]!, 0.48, 0.1], fov: 34 } : camPeg(PX(z ? z[1] : 0), RY - 0.32, 1.55); c1 = sh ? { p: [z[3]! + 0.22, 0.72, 1.05], l: [z[3]!, 0.46, 0.1], fov: 34 } : camPeg(PX(z ? z[1] : 0), RY - 0.3, 1.2); }
  const cam = camA(t, a, b, c0, c1, 0.6);
  // perch0 y gancho: la última clavija con su etiqueta; en perch0 escribe «?» (no se dice qué cuelga ahí todavía)
  const ult = id === "perch0" ? <Etiqueta p={tagPos(10).p} hang={tagPos(10).hang} precio="?" p1={win(t, f.wow! - 0.05, f.wow! + 0.4)} hoy="" p2={0} swing={t - a} /> : null;
  // recap: la etiqueta grande del total en la punta del riel
  const tot = id === "recap" ? <Etiqueta p={[1.0, RY - 0.24, 0.2]} hang={[1.45, RY, 0.04]} precio="$20" p1={win(t, f.mo!.v - 0.05, f.mo!.v + 0.6)} hoy="$250" p2={win(t, f.wow! - 0.05, f.wow! + 0.6)} swing={t - a} sc={2.4} /> : null;
  const tt = id === "perch0" ? -1 : id === "gancho" || id === "recap" ? 1e9 : t;   // perch0 = hoy, riel vacío; recap/gancho = todo colgado
  const dim = id === "gancho" ? 0.55 + 0.35 * win(t, f.wow!, b) : 0.5;
  return <Stage t={t} a={a} b={b} dim={dim} tint="#ffd9a8">
    <Esc cam={cam} key1={[-1.8, 2.9, 1.9]} warm={1.05} exposure={1.0} env={0.5}>
      <Mueble />
      {tt >= 0 && <Prendas t={tt} />}
      {tt >= 0 && <Etiquetas t={tt} sin10={id === "gancho"} />}
      {id === "gancho" && <Etiqueta p={tagPos(10).p} hang={tagPos(10).hang} precio="$3.50" p1={1} hoy="$44" p2={1} swing={Math.max(0, t - f.wow!) + 0.4} />}
      {ult}{tot}
      {id === "gancho" && <spotLight position={[PX(6) + 0.2, RY + 0.9, 0.9]} angle={0.25} penumbra={0.8} intensity={6 * win(t, f.wow! - 0.3, f.wow! + 1)} distance={3} color="#ffe2b8" />}
    </Esc>
  </Stage>;
};
export const HILO_RE = /^(perch0|hilo\d+|precio\d+|recap|gancho)$/;
