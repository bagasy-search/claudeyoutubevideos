// ot01a · KIT del sastre: relojes procedurales SIN marca (buzo, cockpit, smart, sobre-el-puño, oro con brillantes, el de Giuseppe),
// estuche de terciopelo de 6 lugares, puño de camisa con manga de franela, mesa de corte de nogal. Todo f(t); escala en metros.
import React from "react";
import * as THREE from "three";
import { M, RBox, canv, cl, geo, lerp, rn, tubeG, leatherTex, leatherRough, type V3 } from "./k3d";

export type Tipo = "diver" | "cockpit" | "smart" | "sopra" | "oro" | "giuseppe" | "steel36";
const R: Record<Tipo, number> = { diver: 0.0235, cockpit: 0.022, smart: 0.02, sopra: 0.0185, oro: 0.021, giuseppe: 0.0172, steel36: 0.018 };
export const radio = (k: Tipo) => R[k];

// ---------- esferas (canvas) ----------
const dialTex = (k: Tipo, glow = 0) => canv("dial" + k + Math.round(glow * 8), 512, 512, (g) => {
  const c = 256, white = k === "giuseppe" || k === "steel36" || k === "sopra";
  const bg = k === "diver" ? "#0d0f12" : k === "cockpit" ? "#16191d" : k === "oro" ? "#d8b46a" : k === "smart" ? "#000" : "#efe9dc";
  g.fillStyle = bg; g.fillRect(0, 0, 512, 512);
  if (k === "smart") {   // pantalla: anillos de actividad + hora digital (sin marca)
    const a = 0.25 + 0.75 * glow;
    g.globalAlpha = a; [["#ff3b5c", 150], ["#a6ff3d", 118], ["#3de1ff", 86]].forEach(([col, r], i) => { g.strokeStyle = String(col); g.lineWidth = 24; g.lineCap = "round"; g.beginPath(); g.arc(c, c - 20, Number(r), -Math.PI / 2, -Math.PI / 2 + 6.28 * (0.55 + 0.15 * i)); g.stroke(); });
    g.fillStyle = "#fff"; g.font = "800 64px Montserrat, Arial"; g.textAlign = "center"; g.fillText("10:08", c, 450); g.globalAlpha = 1; return;
  }
  if (k === "oro") { const gr = g.createRadialGradient(c, c, 20, c, c, 256); gr.addColorStop(0, "#f6dc98"); gr.addColorStop(1, "#a97d32"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 90; i++) { g.strokeStyle = "rgba(255,240,200,.18)"; g.beginPath(); g.moveTo(c, c); g.lineTo(c + 260 * Math.cos(i * 0.07), c + 260 * Math.sin(i * 0.07)); g.stroke(); } }
  if (white) { const gr = g.createRadialGradient(c, c - 40, 20, c, c, 260); gr.addColorStop(0, "#fbf7ee"); gr.addColorStop(1, k === "giuseppe" ? "#e2d6bd" : "#e9e3d6"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); }
  const ink = white ? "#15171b" : k === "oro" ? "#5a3d10" : "#f2f2ee";
  // índices de minutos + horas
  for (let i = 0; i < 60; i++) {
    const a = i / 60 * 6.283, big = i % 5 === 0, r0 = big ? 196 : 214, r1 = 232;
    g.strokeStyle = ink; g.lineWidth = big ? (k === "diver" ? 18 : 9) : 3; g.beginPath(); g.moveTo(c + r0 * Math.sin(a), c - r0 * Math.cos(a)); g.lineTo(c + r1 * Math.sin(a), c - r1 * Math.cos(a)); g.stroke();
    if (k === "diver" && big) { g.fillStyle = "#e8f3d0"; g.beginPath(); g.arc(c + 168 * Math.sin(a), c - 168 * Math.cos(a), 14, 0, 6.3); g.fill(); }
  }
  if (k === "cockpit") {   // tres subesferas + escala taquimétrica + números alrededor (lo que se lee como diario)
    [[-92, 30], [92, 30], [0, 120]].forEach(([x, y]) => { g.strokeStyle = "#d9d9d4"; g.lineWidth = 4; g.beginPath(); g.arc(c + x, c + y, 52, 0, 6.3); g.stroke(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.28; g.beginPath(); g.moveTo(c + x + 40 * Math.sin(a), c + y - 40 * Math.cos(a)); g.lineTo(c + x + 50 * Math.sin(a), c + y - 50 * Math.cos(a)); g.stroke(); } g.fillStyle = "#f2f2ee"; g.font = "700 18px Montserrat"; g.textAlign = "center"; g.fillText(String(30 + x / 10 | 0), c + x, c + y - 18); });
    g.fillStyle = "#e7e7e2"; g.font = "800 30px Montserrat"; g.textAlign = "center"; g.textBaseline = "middle"; for (let i = 1; i <= 12; i++) { const a = i / 12 * 6.283; g.fillText(String(i), c + 160 * Math.sin(a), c - 160 * Math.cos(a)); }
    g.font = "700 15px Montserrat"; for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283; g.save(); g.translate(c + 243 * Math.sin(a), c - 243 * Math.cos(a)); g.rotate(a); g.fillText(String(400 - i * 12), 0, 0); g.restore(); }
  }
  if (k === "giuseppe" || k === "steel36") { g.fillStyle = ink; g.font = "600 46px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; [12, 3, 6, 9].forEach((n, i) => g.fillText(String(n), c + 150 * Math.sin(i * 1.5708), c - 150 * Math.cos(i * 1.5708))); }
  if (k === "giuseppe") { for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(150,120,70,${0.06 * rn(i, 3)})`; g.beginPath(); g.arc(rn(i, 1) * 512, rn(i, 2) * 512, 1 + 3 * rn(i, 4), 0, 6.3); g.fill(); } }
  if (k === "steel36" || k === "giuseppe") { g.fillStyle = "#fff"; g.strokeStyle = ink; g.lineWidth = 2; g.fillRect(c + 120, c - 16, 44, 32); g.strokeRect(c + 120, c - 16, 44, 32); g.fillStyle = ink; g.font = "700 24px Montserrat"; g.textAlign = "center"; g.fillText("14", c + 142, c + 1); }
});
const bezelTex = () => canv("bezelDiver", 1024, 64, (g) => {
  g.fillStyle = "#0b0c0e"; g.fillRect(0, 0, 1024, 64);
  g.fillStyle = "#e6e6e0"; g.font = "800 34px Montserrat"; g.textBaseline = "middle"; g.textAlign = "center";
  for (let i = 0; i < 60; i++) { const x = i / 60 * 1024; if (i % 10 === 0) { if (i) g.fillText(String(i), x, 32); else { g.beginPath(); g.moveTo(x - 14, 14); g.lineTo(x + 14, 14); g.lineTo(x, 46); g.fill(); } } else g.fillRect(x - 2, i % 5 === 0 ? 12 : 22, 4, i % 5 === 0 ? 40 : 20); }
});

// ---------- materiales ----------
const metal = (k: Tipo) => k === "oro" ? <meshPhysicalMaterial color="#e2b14c" metalness={1} roughness={0.18} clearcoat={0.6} /> : k === "smart" ? <meshPhysicalMaterial color="#1a1b1e" metalness={0.6} roughness={0.3} /> : k === "giuseppe" ? <meshStandardMaterial color="#c4c5c2" metalness={0.92} roughness={0.36} /> : <meshStandardMaterial color="#d5d8dc" metalness={0.95} roughness={0.22} />;
export const piel = (key: string, base = [104, 62, 34]) => <meshPhysicalMaterial map={leatherTex(base, key)} roughnessMap={leatherRough()} roughness={0.62} clearcoat={0.15} clearcoatRoughness={0.5} />;

// manecillas a la hora h (12h) y minuto m
const Hands: React.FC<{ r: number; h: number; m: number; s?: number; col: string; lum?: boolean }> = ({ r, h, m, s, col, lum }) => {
  const H = -((h % 12) + m / 60) / 12 * 6.283, Mi = -m / 60 * 6.283;
  return <group>
    <group rotation={[0, 0, H]}><mesh position={[0, r * 0.28, 0.0009]}><boxGeometry args={[r * 0.11, r * 0.56, 0.0006]} />{lum ? <meshStandardMaterial color="#e8f3d0" emissive="#c8e0a0" emissiveIntensity={0.3} /> : <meshStandardMaterial color={col} metalness={0.6} roughness={0.3} />}</mesh></group>
    <group rotation={[0, 0, Mi]}><mesh position={[0, r * 0.4, 0.0016]}><boxGeometry args={[r * 0.07, r * 0.82, 0.0006]} />{lum ? <meshStandardMaterial color="#e8f3d0" emissive="#c8e0a0" emissiveIntensity={0.3} /> : <meshStandardMaterial color={col} metalness={0.6} roughness={0.3} />}</mesh></group>
    {s !== undefined && <group rotation={[0, 0, -s / 60 * 6.283]}><mesh position={[0, r * 0.38, 0.0022]}><boxGeometry args={[r * 0.025, r * 0.95, 0.0004]} /><meshStandardMaterial color={col === "#15171b" ? "#a3241c" : col} /></mesh></group>}
    <mesh position={[0, 0, 0.0026]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[r * 0.06, r * 0.06, 0.001, 16]} /><meshStandardMaterial color={col} metalness={0.7} roughness={0.3} /></mesh>
  </group>;
};

// ---------- el reloj, cara hacia +Z, centro en el origen; correa a lo largo de Y ----------
// glow: pantalla del smart (0..1) · sec: segundero · strap: largo de la correa a cada lado (m) · sp: destello de brillantes 0..1
export const Reloj: React.FC<{ k: Tipo; h?: number; m?: number; sec?: number; glow?: number; strap?: number; sp?: number; bend?: number }> = ({ k, h = 10, m = 9, sec, glow = 0, strap = 0.05, sp = 0, bend = 0 }) => {
  const r = R[k], th = k === "diver" ? 0.0135 : k === "cockpit" ? 0.014 : k === "giuseppe" ? 0.009 : 0.011;
  const white = k === "giuseppe" || k === "steel36" || k === "sopra";
  const ink = white ? "#15171b" : k === "oro" ? "#4a3210" : "#e9e9e4";
  const lugW = k === "smart" ? r * 1.6 : r * 1.0;
  const sq = k === "smart";
  return <group>
    {/* caja */}
    {sq ? <RBox s={[r * 1.7, r * 2.06, th]} r={r * 0.42}>{metal(k)}</RBox>
      : <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[r, r * 0.97, th, 64]} />{metal(k)}</mesh>}
    {/* bisel */}
    {k === "diver" && <mesh position={[0, 0, th / 2 + 0.0012]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[r * 1.04, r * 1.04, 0.0028, 96, 1, true]} /><meshStandardMaterial map={bezelTex()} metalness={0.3} roughness={0.35} side={THREE.DoubleSide} /></mesh>}
    {k === "diver" && <mesh position={[0, 0, th / 2 + 0.0026]}><ringGeometry args={[r * 0.82, r * 1.04, 96]} /><meshStandardMaterial map={bezelTex()} metalness={0.25} roughness={0.35} /></mesh>}
    {k === "oro" && Array.from({ length: 36 }, (_, i) => { const a = i / 36 * 6.283, tw = 0.5 + 0.5 * Math.sin(sp * 30 + i * 2.7); return <mesh key={i} position={[r * 0.93 * Math.cos(a), r * 0.93 * Math.sin(a), th / 2 + 0.0012]} rotation={[Math.PI / 2, 0, 0]}><octahedronGeometry args={[r * 0.07, 0]} /><meshPhysicalMaterial color="#ffffff" metalness={0} roughness={0} transmission={0.6} ior={2.4} emissive="#fff6e0" emissiveIntensity={sp * tw * 2.2} /></mesh>; })}
    {!sq && <mesh position={[0, 0, th / 2 + 0.0004]}><ringGeometry args={[r * 0.86, r * 0.99, 96]} />{metal(k)}</mesh>}
    {/* esfera + manecillas */}
    <mesh position={[0, 0, th / 2 + 0.0002]}>{sq ? <planeGeometry args={[r * 1.45, r * 1.8]} /> : <circleGeometry args={[r * (k === "diver" ? 0.8 : 0.87), 96]} />}
      <meshStandardMaterial map={dialTex(k, glow)} roughness={white ? 0.55 : 0.4} metalness={k === "oro" ? 0.6 : 0} emissive={sq ? "#ffffff" : "#000"} emissiveMap={sq ? dialTex(k, glow) : null} emissiveIntensity={sq ? 1.6 * glow : 0} /></mesh>
    {!sq && <group position={[0, 0, th / 2 + 0.0004]}><Hands r={r * (k === "diver" ? 0.8 : 0.87)} h={h} m={m} s={sec} col={ink} lum={k === "diver"} /></group>}
    {/* cristal */}
    {sq ? <RBox s={[r * 1.6, r * 1.96, 0.0012]} r={r * 0.4} p={[0, 0, th / 2 + 0.0008]}><meshPhysicalMaterial color="#0a0a0c" roughness={0.03} clearcoat={1} transparent opacity={0.25} /></RBox>
      : <mesh position={[0, 0, th / 2 + 0.003]} scale={[1, 1, 0.12]}><sphereGeometry args={[r * 0.9, 48, 16, 0, 6.283, 0, 0.9]} /><meshPhysicalMaterial color="#fff" roughness={0.02} transparent opacity={0.14} clearcoat={1} depthWrite={false} /></mesh>}
    {/* corona (y pulsadores del cockpit / botón del smart) */}
    <mesh position={[r * (sq ? 0.88 : 1.02) + 0.002, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[r * 0.17, r * 0.17, 0.005, 20]} />{metal(k)}</mesh>
    {k === "cockpit" && [-0.6, 0.6].map((a) => <mesh key={a} position={[r * 1.02 * Math.cos(a) + 0.002, r * Math.sin(a), 0]} rotation={[0, 0, Math.PI / 2 + a]}><cylinderGeometry args={[r * 0.11, r * 0.13, 0.006, 16]} />{metal(k)}</mesh>)}
    {/* asas + correa (cuero) o malla de eslabones (buzo, oro) */}
    {[1, -1].map((sy) => <group key={sy}>
      {[1, -1].map((sx) => <RBox key={sx} s={[0.003, r * 0.42, th * 0.6]} r={0.001} p={[sx * lugW * 0.42, sy * r * (sq ? 1.12 : 1.0), -th * 0.1]}>{metal(k)}</RBox>)}
      {k === "diver" || k === "oro"
        ? Array.from({ length: Math.round(strap / 0.0062) }, (_, i) => { const y = sy * (r * 1.12 + i * 0.0062), z = -th * 0.15 - bend * Math.pow(i * 0.0062, 2) * 30; return <group key={i} position={[0, y, z]}>
            <RBox s={[lugW * 0.38, 0.0056, 0.0042]} r={0.0012}>{metal(k)}</RBox>
            {[1, -1].map((sx) => <RBox key={sx} s={[lugW * 0.26, 0.0056, 0.0038]} r={0.0012} p={[sx * lugW * 0.33, 0.0031 * (i % 2 ? 1 : -1), 0]}>{metal(k)}</RBox>)}
          </group>; })
        : null}
      {!(k === "diver" || k === "oro") && <Correa sy={sy} r={r * (sq ? 1.15 : 1.02)} w={lugW * 0.8} L={strap} th={th} k={k} bend={bend} />}
    </group>)}
  </group>;
};
// correa de cuero: tira curvada (segmentos) con costura y, abajo, la hebilla
const Correa: React.FC<{ sy: number; r: number; w: number; L: number; th: number; k: Tipo; bend: number }> = ({ sy, r, w, L, th, k, bend }) => {
  const n = 10, col = k === "smart" ? [26, 26, 28] : k === "giuseppe" ? [112, 70, 38] : [86, 50, 26];
  return <group>{Array.from({ length: n }, (_, i) => {
    const u0 = i / n, u1 = (i + 1) / n, y0 = sy * (r + u0 * L), y1 = sy * (r + u1 * L), z0 = -th * 0.2 - bend * u0 * u0 * L * 0.9, z1 = -th * 0.2 - bend * u1 * u1 * L * 0.9;
    const len = Math.hypot(y1 - y0, z1 - z0), ang = Math.atan2(z1 - z0, y1 - y0);
    return <group key={i} position={[0, (y0 + y1) / 2, (z0 + z1) / 2]} rotation={[ang * (sy > 0 ? 1 : -1) * (sy > 0 ? 1 : 1), 0, 0]}>
      <RBox s={[w * (1 - 0.12 * u1), len + 0.0004, 0.0032]} r={0.0012}>{k === "smart" ? <meshStandardMaterial color="#17181a" roughness={0.75} /> : piel("correa" + k, col)}</RBox>
      {k !== "smart" && [1, -1].map((sx) => <mesh key={sx} position={[sx * w * 0.4 * (1 - 0.12 * u1), 0, 0.0017]}><boxGeometry args={[0.0006, len * 0.7, 0.0003]} /><meshStandardMaterial color="#e6d5b4" roughness={0.9} /></mesh>)}
    </group>;
  })}</group>;
};

// ---------- estuche de terciopelo: 6 cojines en fila, tapa con bisagra ----------
export const velvetTex = (base = "#3a1426") => canv("velvet" + base, 256, 256, (g) => {
  g.fillStyle = base; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9000; i++) { const v = rn(i, 2); g.fillStyle = v > 0.5 ? `rgba(255,190,210,${0.05 * rn(i, 3)})` : `rgba(0,0,0,${0.12 * rn(i, 4)})`; g.fillRect(rn(i, 5) * 256, rn(i, 6) * 256, 1.2, 1.2); }
});
const velvet = (base?: string) => <meshPhysicalMaterial map={velvetTex(base)} roughness={0.95} sheen={0.5} sheenColor={"#8a3a58"} sheenRoughness={0.5} />;
export const EW = 0.42, ED = 0.11, EH = 0.045;
export const slotX = (i: number) => (i - 2.5) * (EW / 6.3);
// open 0..1 · gold = ribete dorado
export const Estuche: React.FC<{ open: number; children?: React.ReactNode; vacio?: number }> = ({ open, children }) => {
  const ang = 1.95 * open;
  return <group>
    <RBox s={[EW, EH, ED]} r={0.008} p={[0, EH / 2, 0]}>{piel("estuche", [40, 22, 18])}</RBox>
    {/* bandeja de terciopelo con 6 cojines */}
    <RBox s={[EW - 0.014, 0.004, ED - 0.014]} r={0.002} p={[0, EH + 0.0005, 0]}>{velvet()}</RBox>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[slotX(i), EH + 0.012, 0.004]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 1.0]} castShadow receiveShadow>
      <capsuleGeometry args={[0.014, 0.034, 8, 24]} />{velvet("#331a28")}</mesh>)}
    {[[0, ED / 2 - 0.004, EW], [0, -ED / 2 + 0.004, EW]].map(([x, z, L], i) => <mesh key={i} position={[x, EH + 0.0025, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.0022, 0.0022, L - 0.01, 12]} />{M.brass({ col: "#caa05a" })}</mesh>)}
    {/* tapa: gira en la bisagra de atrás; adentro, satén crema */}
    <group position={[0, EH, -ED / 2]} rotation={[-ang, 0, 0]}>
      <RBox s={[EW, 0.03, ED]} r={0.008} p={[0, 0.015, ED / 2]}>{piel("estucheT", [40, 22, 18])}</RBox>
      <mesh position={[0, -0.0008, ED / 2]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[EW - 0.016, ED - 0.016]} /><meshPhysicalMaterial color="#8a6f58" roughness={0.45} sheen={0.4} sheenColor={"#c9a98a"} side={THREE.DoubleSide} /></mesh>
    </group>
    {/* cierre de bronce al frente */}
    <RBox s={[0.022, 0.012, 0.004]} r={0.002} p={[0, EH - 0.006, ED / 2 + 0.002]}>{M.brass()}</RBox>
    {children}
  </group>;
};
// reloj apoyado en el cojín i del estuche (abrazando el cojín: correa doblada hacia abajo)
export const EnCojin: React.FC<{ i: number; k: Tipo; lift?: number; rz?: number; children?: React.ReactNode; sp?: number; glow?: number }> = ({ i, k, lift = 0, rz = 0, sp, glow }) => (
  <group position={[slotX(i), EH + 0.028 + lift, 0.004]} rotation={[-Math.PI / 2 + 0.25, 0, rz]}>
    <Reloj k={k} strap={0.035} bend={0.9} sp={sp} glow={glow} />
  </group>
);

// ---------- tiza de sastre: X que se dibuja (k 0..1) sobre un plano local XY ----------
export const TizaX: React.FC<{ k: number; s?: number; col?: string }> = ({ k, s = 0.05, col = "#f2efe6" }) => <group>
  {[0.78, -0.78].map((r, i) => { const kk = cl(k * 2 - i); return kk > 0.01 && <mesh key={i} rotation={[0, 0, r]} position={[0, 0, 0.001 + i * 0.0005]} scale={[kk, 1, 1]}><planeGeometry args={[s, s * 0.11]} /><meshStandardMaterial map={chalkTex(col)} transparent alphaTest={0.05} roughness={1} /></mesh>; })}
</group>;
export const chalkTex = (col = "#f2efe6") => canv("chalk" + col, 256, 32, (g) => {
  g.clearRect(0, 0, 256, 32);
  for (let i = 0; i < 2600; i++) { const x = rn(i, 1) * 256, y = 16 + (rn(i, 2) - 0.5) * 26 * (0.6 + 0.4 * Math.sin(x * 0.05)); g.fillStyle = col; g.globalAlpha = 0.35 + 0.6 * rn(i, 3); g.fillRect(x, y, 1.6, 1.6); }
}, [1, 1], true);

// ---------- puño de camisa + manga de franela (eje X = antebrazo, mano hacia +X) ----------
// lift: cuánto sube el puño (por un reloj grande debajo) · tent: el puño se monta encima («like a tent») · open: puño abierto
export const flannelTex = () => canv("flannel", 512, 512, (g) => {
  g.fillStyle = "#47494f"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 26000; i++) { const v = rn(i, 1); g.fillStyle = v > 0.5 ? `rgba(200,200,206,${0.05 * rn(i, 2)})` : `rgba(20,20,24,${0.12 * rn(i, 3)})`; g.fillRect(rn(i, 4) * 512, rn(i, 5) * 512, 1 + rn(i, 6) * 3, 1); }
  for (let x = 0; x < 512; x += 32) { g.fillStyle = "rgba(190,190,196,.05)"; g.fillRect(x, 0, 2, 512); }
}, [2, 2]);
export const shirtTex = () => canv("poplin", 256, 256, (g) => { g.fillStyle = "#f5f4f0"; g.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 2) { g.fillStyle = "rgba(160,170,190,.06)"; g.fillRect(0, y, 256, 1); } }, [3, 3]);
const skin = <meshPhysicalMaterial color="#c99a7a" roughness={0.55} sheen={0.3} sheenColor={"#ffd6c0"} />;
export const Brazo: React.FC<{ cuff: number; sleeve: number; lift?: number; tent?: number; band?: boolean; skinOp?: number }> = ({ cuff, sleeve, lift = 0, tent = 0, band = true, skinOp = 1 }) => {
  // muñeca en x=0, mano hacia +X; el puño cubre desde x=cuff-0.045 hasta x=cuff+0.02 (cuff<0 = corrido hacia el codo)
  const rr = 0.028, sk = skinOp < 1 ? <meshPhysicalMaterial color="#c99a7a" roughness={0.5} transparent opacity={skinOp} depthWrite={false} /> : skin;
  return <group>
    <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.13, 0, 0]} castShadow><cylinderGeometry args={[0.0245, 0.03, 0.26, 40]} />{sk}</mesh>
    <mesh position={[0.012, 0, 0]} scale={[0.6, 0.85, 1]}><sphereGeometry args={[0.026, 32, 20]} />{sk}</mesh>
    <RBox s={[0.075, 0.02, 0.062]} r={0.009} p={[0.05, -0.004, 0]}>{sk}</RBox>
    {[0, 1, 2, 3].map((i) => <RBox key={i} s={[0.03, 0.017, 0.0135]} r={0.0065} p={[0.093, -0.01, -0.022 + i * 0.0148]} rot={[0, 0, -0.5]}>{sk}</RBox>)}
    {band && <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.012, 0, 0]}><cylinderGeometry args={[0.0262, 0.0262, 0.017, 40, 1, true]} />{piel("banda", [86, 50, 26])}</mesh>}
    {/* puño de camisa */}
    <group position={[cuff - 0.012, lift, 0]} rotation={[0, 0, tent * 0.16]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow><cylinderGeometry args={[rr + 0.007 + tent * 0.012, rr + 0.007 + tent * 0.004, 0.065, 48, 1, true]} /><meshPhysicalMaterial map={shirtTex()} roughness={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0.0325, 0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[rr + 0.007 + tent * 0.012, 0.0022, 8, 48]} /><meshPhysicalMaterial color="#f2f1ec" roughness={0.6} /></mesh>
      <mesh position={[0.012, rr + 0.0085 + tent * 0.012, 0.004]}><cylinderGeometry args={[0.0045, 0.0045, 0.0018, 20]} /><meshPhysicalMaterial color="#e8e0cf" roughness={0.2} clearcoat={1} /></mesh>
    </group>
    {/* manga del saco de franela (por dentro, oscura) */}
    <group position={[sleeve - 0.075, lift * 1.3, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow><cylinderGeometry args={[rr + 0.017, rr + 0.021, 0.2, 48, 1, true]} /><meshStandardMaterial map={flannelTex()} roughness={0.95} side={THREE.FrontSide} /></mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[rr + 0.0165, rr + 0.0205, 0.2, 48, 1, true]} /><meshStandardMaterial color="#1c1a1c" roughness={1} side={THREE.BackSide} /></mesh>
      <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[rr + 0.017, 0.0028, 8, 48]} /><meshStandardMaterial map={flannelTex()} roughness={0.95} /></mesh>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.085 - i * 0.016, -0.006, -(rr + 0.019)]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.0055, 0.0055, 0.002, 18]} /><meshPhysicalMaterial color="#2a1d14" roughness={0.3} clearcoat={0.8} /></mesh>)}
    </group>
  </group>;
};
// cabeza del reloj montada arriba de la muñeca (la correa la pone Brazo con band)
export const EnMuneca: React.FC<{ k: Tipo; x?: number; up?: number }> = ({ k, x = -0.012, up = 0 }) => <group position={[x, 0.0262 + 0.006 + up, 0]} rotation={[-Math.PI / 2, 0, 0]}><Reloj k={k} strap={0.004} /></group>;

// ---------- mesa de corte de nogal (superficie finita que se funde) ----------
export const Mesa: React.FC<{ w?: number; d?: number }> = ({ w = 1.2, d = 0.8 }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, d]} />
    <meshStandardMaterial map={canv("nogal", 512, 512, (g) => {
      g.fillStyle = "#4a2f1d"; g.fillRect(0, 0, 512, 512);
      for (let y = 0; y < 512; y += 1) { const v = Math.sin(y * 0.09 + Math.sin(y * 0.013) * 6) * 0.5 + 0.5; g.fillStyle = `rgba(${v > 0.5 ? "120,80,50" : "30,18,10"},${0.12 + 0.1 * v})`; g.fillRect(0, y, 512, 1); }
      for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(230,220,200,${0.04 + 0.05 * rn(i, 3)})`; g.lineWidth = 1; g.beginPath(); const x = rn(i, 1) * 512, y = rn(i, 2) * 512; g.moveTo(x, y); g.lineTo(x + 80 * rn(i, 4), y + 4); g.stroke(); }
    }, [1, 1])} roughness={0.55} alphaMap={canv("edgeA2", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 50, 128, 128, 128); gr.addColorStop(0, "#fff"); gr.addColorStop(0.7, "#fff"); gr.addColorStop(1, "#000"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); }, [1, 1], false)} transparent /></mesh>
);
export { lerp, cl, geo, rn };
export type { V3 };
