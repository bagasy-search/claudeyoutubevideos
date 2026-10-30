// r3c · piezas compartidas de mar29c (termostato) sobre el kit r3k: termostato digital, termostato redondo, foto real como textura.
import React, { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { img } from "./hkit";
import { BOLD, Bx, Cy, D2R, MONO, Pl, Sp, To, Txt, V3, canvasTex } from "../kits/r3k/r3k";

// foto del propio video como textura (espera a que cargue antes del cuadro: nunca un recuadro negro)
const PH = new Map<string, THREE.Texture>();
// ThreeCanvas de Remotion no repinta solo: cuando llega la textura se fuerza un cuadro (advance) y recién ahí se libera el render
export const usePhoto = (id: string) => {
  const [t, setT] = useState<THREE.Texture | null>(PH.get(id) ?? null);
  const [hd] = useState(() => (PH.has(id) ? null : delayRender("foto " + id)));
  const { advance } = useThree();
  useEffect(() => {
    if (PH.has(id)) { setT(PH.get(id)!); return; }
    new THREE.TextureLoader().load(img(id), (tx: THREE.Texture) => { tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; PH.set(id, tx); setT(tx); }, undefined, () => { if (hd !== null) continueRender(hd); });
  }, [id]);
  useEffect(() => { if (t && hd !== null) requestAnimationFrame(() => { advance(performance.now()); requestAnimationFrame(() => continueRender(hd)); }); }, [t]);
  return t;
};
// foto enmarcada (papel de foto con borde blanco), de frente a +z
export const PhotoCard: React.FC<{ id: string; w: number; h: number; p?: V3; r?: V3; s?: number; border?: number }> = ({ id, w, h, p = [0, 0, 0], r = [0, 0, 0], s = 1, border = 0.025 }) => {
  const t = usePhoto(id);
  return <group position={p} rotation={r} scale={s}>
    <Bx s={[w + border * 2, h + border * 2, 0.006]} c="#f4f1ea" ro={0.8} rad={0.003} />
    {t && <Pl w={w} h={h} p={[0, 0, 0.0035]} map={t} c="#ffffff" ro={0.6} ns />}
  </group>;
};
// pantalla LCD verde con un texto (se cachea por texto)
export const lcd = (v: string, dark = false) => canvasTex(`lcd|${v}|${dark}`, 512, 256, (g) => {
  const r = g.createLinearGradient(0, 0, 0, 256); r.addColorStop(0, dark ? "#2c3a2a" : "#b9d6a6"); r.addColorStop(1, dark ? "#1c271b" : "#93b882"); g.fillStyle = r; g.fillRect(0, 0, 512, 256);
  g.fillStyle = dark ? "#9fe08a" : "#1e2a18"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = MONO(v.length > 4 ? 120 : 170); g.fillText(v, 256, 136);
});
// termostato digital de pared: centro en p, de frente a +z; glow = brillo de la pantalla
export const Thermo3: React.FC<{ v: string; p?: V3; r?: V3; s?: number; glow?: number; dark?: boolean }> = ({ v, p = [0, 0, 0], r = [0, 0, 0], s = 1, glow = 0.25, dark }) =>
  <group position={p} rotation={r} scale={s}>
    <Bx s={[0.34, 0.24, 0.045]} c="#efece4" ro={0.42} rad={0.03} />
    <Bx s={[0.22, 0.11, 0.006]} p={[0, 0.025, 0.024]} c="#1a1c18" ro={0.3} rad={0.006} />
    <Pl w={0.205} h={0.1} p={[0, 0.025, 0.0275]} map={lcd(v, dark)} c="#ffffff" e="#9fd08a" ei={glow} ro={0.35} ns />
    <Bx s={[0.05, 0.03, 0.012]} p={[-0.06, -0.075, 0.024]} c="#d6d2c8" ro={0.4} rad={0.008} />
    <Bx s={[0.05, 0.03, 0.012]} p={[0.06, -0.075, 0.024]} c="#d6d2c8" ro={0.4} rad={0.008} />
  </group>;
// termostato redondo viejo (aro de color, cara con escala): centro en p, de frente a +z; deg = número leído; ring = color del aro
export const roundFace = (deg: number) => canvasTex(`round|${Math.round(deg)}`, 512, 512, (g) => {
  g.fillStyle = "#ece6d6"; g.beginPath(); g.arc(256, 256, 256, 0, Math.PI * 2); g.fill();
  g.strokeStyle = "#3a332a"; g.fillStyle = "#3a332a"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 0; i <= 30; i++) { const a = (-120 + i * 8) * D2R, r1 = 230, r2 = i % 5 === 0 ? 195 : 212; g.lineWidth = i % 5 === 0 ? 7 : 3; g.beginPath(); g.moveTo(256 + r1 * Math.sin(a), 256 - r1 * Math.cos(a)); g.lineTo(256 + r2 * Math.sin(a), 256 - r2 * Math.cos(a)); g.stroke(); }
  [50, 60, 70, 80].forEach((v, k) => { const a = (-120 + k * 80) * D2R; g.font = BOLD(46); g.fillText(String(v), 256 + 160 * Math.sin(a), 256 - 160 * Math.cos(a)); });
  const a = (-120 + (deg - 50) * 8) * D2R; g.strokeStyle = "#c8302a"; g.lineWidth = 9; g.beginPath(); g.moveTo(256, 256); g.lineTo(256 + 205 * Math.sin(a), 256 - 205 * Math.cos(a)); g.stroke();
  g.fillStyle = "#c8302a"; g.beginPath(); g.arc(256, 256, 16, 0, Math.PI * 2); g.fill();
});
export const RoundThermo: React.FC<{ deg: number; p?: V3; r?: V3; s?: number; ring?: string }> = ({ deg, p = [0, 0, 0], r = [0, 0, 0], s = 1, ring = "#b8a37a" }) =>
  <group position={p} rotation={r} scale={s}>
    <Cy rt={0.2} h={0.05} r={[Math.PI / 2, 0, 0]} c="#d9d2c0" ro={0.45} seg={64} />
    <To R={0.2} t={0.022} p={[0, 0, 0.02]} c={ring} m={0.6} ro={0.3} />
    <mesh position={[0, 0, 0.027]}><circleGeometry args={[0.175, 64]} /><meshStandardMaterial map={roundFace(deg)} roughness={0.55} /></mesh>
    <Sp rad={0.03} p={[0, 0, 0.03]} sc={[1, 1, 0.5]} c="#f2efe6" ro={0.3} />
  </group>;
// rótulo que se lee de frente (sombra suave atrás para que nunca se pierda sobre la foto)
export const Lbl: React.FC<{ t: string; w: number; p: V3; c?: string; o?: number; r?: V3 }> = ({ t, w, p, c = "#fff7e6", o = 1, r = [0, 0, 0] }) =>
  <group position={p} rotation={r}>
    <Txt t={t} w={w * 1.02} c="#000000" o={0.45 * o} p={[0.006, -0.006, -0.002]} />
    <Txt t={t} w={w} c={c} o={o} />
  </group>;

// vuelta 2 (EVALUADOR: carteles 3D cortados por el borde): rótulo 2D en la zona segura, siempre dentro del cuadro; va como hermano del <S3>
export const Cap: React.FC<{ t: string; o: number; c?: string; top?: boolean; sz?: number }> = ({ t, o, c = "#ffd27a", top, sz = 64 }) => o <= 0.01 ? null :
  <div style={{ position: "absolute", left: 0, right: 0, [top ? "top" : "bottom"]: top ? 70 : 84, textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * (top ? -18 : 18)}px)`,
    fontFamily: "Montserrat, Arial Black, sans-serif", fontWeight: 900, fontSize: sz, letterSpacing: 1, color: c, textShadow: "0 3px 0 rgba(0,0,0,.55), 0 0 26px rgba(0,0,0,.7)" } as React.CSSProperties}>{t}</div>;
// contador mecánico de tambores: v puede ser fraccionario (los tambores ruedan con arrastre, como un odómetro de verdad)
const drum = (pos: number) => canvasTex(`drum|${Math.round(pos * 24) / 24}`, 128, 192, (g) => {
  const q = Math.round(pos * 24) / 24, d0 = Math.floor(q) % 10, f = q - Math.floor(q);
  g.fillStyle = "#f4efe2"; g.fillRect(0, 0, 128, 192); g.fillStyle = "#1a1a1a"; g.font = BOLD(130); g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(String(d0), 64, 100 - f * 170); g.fillText(String((d0 + 1) % 10), 64, 100 - f * 170 + 170);
  const sh = g.createLinearGradient(0, 0, 0, 192); sh.addColorStop(0, "rgba(0,0,0,.55)"); sh.addColorStop(0.3, "rgba(0,0,0,0)"); sh.addColorStop(0.7, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(0,0,0,.55)"); g.fillStyle = sh; g.fillRect(0, 0, 128, 192);
});
export const Odo: React.FC<{ v: number; n?: number; pre?: string; p?: V3; r?: V3; s?: number; nz?: boolean }> = ({ v, n = 3, pre, p = [0, 0, 0], r = [0, 0, 0], s = 1, nz }) => {
  const W = 0.13, pos = (i: number) => { const b = Math.pow(10, i), w = Math.floor(v / b) % 10; return i === 0 ? v % 10 : w + Math.max(0, (v % b) - (b - 1)); };
  const off = pre ? 1 : 0, tot = (n + off) * W;
  return <group position={p} rotation={r} scale={s}>
    <Bx s={[tot + 0.05, 0.24, 0.05]} p={[0, 0, -0.03]} c="#1c1a17" m={0.3} ro={0.4} rad={0.015} />
    {pre && <Txt t={pre} w={0.09} c="#c8302a" p={[-tot / 2 + W / 2, 0, 0.002]} />}
    {Array.from({ length: n }, (_, k) => { const i = n - 1 - k; return nz && i > 0 && v < Math.pow(10, i) ? null : <Pl key={k} w={W - 0.012} h={0.19} p={[-tot / 2 + (k + off + 0.5) * W, 0, 0]} map={drum(pos(i))} c="#ffffff" ro={0.5} ns />; })}
  </group>;
};
// esfera con borde luminoso (fresnel): se ve el contorno aunque sea casi transparente
export const Fres: React.FC<{ p: V3; r: number; c?: string; o?: number; sc?: V3 }> = ({ p, r, c = "#ff9a3a", o = 1, sc = [1, 1, 1] }) => {
  const m = React.useMemo(() => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { col: { value: new THREE.Color(c) }, op: { value: o } },
    vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }",
    fragmentShader: "uniform vec3 col; uniform float op; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0-abs(dot(vN,vV)),2.2); gl_FragColor = vec4(col*(0.18+1.6*f), (0.1+0.9*f)*op); }" }), [c]);
  m.uniforms.op.value = o;
  return <mesh position={p} scale={[r * sc[0], r * sc[1], r * sc[2]]} material={m}><sphereGeometry args={[1, 48, 32]} /></mesh>;
};
// corcho para el tablero
export const CORK = () => canvasTex("cork", 512, 512, (g) => { g.fillStyle = "#b8895a"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 2600; i++) { const v = (Math.sin(i * 12.9898) * 43758.5453) % 1, w = (Math.sin(i * 78.233) * 12345.678) % 1; g.fillStyle = `rgba(${v > 0 ? 90 : 230},${v > 0 ? 60 : 190},${v > 0 ? 30 : 140},.35)`; g.fillRect(Math.abs(v) * 512, Math.abs(w) * 512, 3, 3); } });
export const PEG = () => canvasTex("pegboard", 512, 512, (g) => { g.fillStyle = "#c79a66"; g.fillRect(0, 0, 512, 512); g.fillStyle = "#5a4024"; for (let x = 16; x < 512; x += 32) for (let y = 16; y < 512; y += 32) { g.beginPath(); g.arc(x, y, 5, 0, Math.PI * 2); g.fill(); } });
