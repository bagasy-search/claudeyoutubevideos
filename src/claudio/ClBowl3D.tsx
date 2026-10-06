// ClBowl3D — corte 3D real (three.js) de la TAZA de un inodoro apoyada dentro del baño del hotel (cama real + sombra + luz del cuarto),
// con el ANILLO DE SARRO en la línea del agua hecho de capas: piedra del agua (calcio, gris claro, una capa por día) + la capa marrón
// de arriba (mugre y óxido). Una LUPA anclada al punto 3D real del anillo muestra el corte de las capas. Modos (reusable por el canal):
//   "layers"  el agua se evapora de a poquito y deja su línea: las capas crecen con el contador de días, al final se tiñen de marrón
//   "brush"   un cepillo pasa por el anillo: la capa marrón apenas se aclara, la piedra queda (el cepillo resbala)
//   "lower"   el agua de la taza baja hasta el fondo: el anillo queda AFUERA del agua
//   "paste"   la pasta blanca encima del anillo, burbujitas, y la capa marrón se va (queda la piedra gris)
//   "vinegar" tiras de papel con vinagre envuelven el anillo, luna → sol, la piedra se disuelve capa por capa → porcelana blanca
// labels.{ring,top,stone,water} = rótulos dentro del mundo (proyectados desde el punto 3D real).
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease } from "./ClTheme";
import { Bed, Contact, RoomLight, lin } from "./ClParts";

type Mode = "layers" | "brush" | "lower" | "paste" | "vinegar";
type Labels = { ring?: string; top?: string; stone?: string; water?: string };
const YW = 0.22;                       // línea del agua (normal)
const NL = 7;                          // capas de piedra
const rAt = (y: number) => 0.34 + 0.86 * Math.pow(clamp01((y + 0.62) / 1.52), 0.78); // radio interior de la taza a la altura y
const A0 = Math.PI * 0.04, A1 = Math.PI * 0.96;                                      // media taza (corte)

const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};
const lathe = (prof: [number, number][], seg = 64) => new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), seg, Math.PI / 2 + A0, A1 - A0);
function bowlGeo() { const p: [number, number][] = []; for (let i = 0; i <= 30; i++) { const y = -0.62 + 1.52 * (i / 30); p.push([rAt(y), y]); } return lathe(p); }
function outerGeo() { const p: [number, number][] = []; for (let i = 0; i <= 24; i++) { const t = i / 24, y = -1.05 + 2.03 * t; p.push([0.62 + 0.72 * Math.pow(t, 0.85), y]); } return lathe(p); }
// banda del anillo pegada a la pared: espesor th, alto [y0, y1], borde de arriba irregular
function bandGeo(th: number, y0: number, y1: number, seed: number) {
  const p: [number, number][] = []; const n = 10;
  for (let i = 0; i <= n; i++) { const y = y0 + (y1 - y0) * (i / n); const bump = 1 + 0.25 * Math.sin(i * 2.3 + seed); p.push([rAt(y) - 0.004 - th * bump * Math.sin(Math.PI * (0.15 + 0.7 * i / n)), y]); }
  return lathe(p, 72);
}
const ringPt = (a: number, y = YW, inset = 0.02) => new THREE.Vector3((rAt(y) - inset) * Math.cos(a), y, -(rAt(y) - inset) * Math.sin(a));

export const ClBowl3D: React.FC<{ mode?: Mode; labels?: Labels; days?: number; bed?: string; lupa?: boolean; orbit?: number }> = ({ mode = "layers", labels = {}, days = 365, bed, lupa = true, orbit = 0.25 }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: T } = useVideoConfig();
  const u = clamp01((f - 8) / Math.max(1, T * 0.78 - 8));
  // estado de las capas según el modo
  const grow = mode === "layers" ? ease(u) : 1;                                       // cuántas capas de piedra hay (0..1)
  const brownK = mode === "layers" ? clamp01((u - 0.55) / 0.35) : mode === "paste" ? 1 - clamp01((u - 0.35) / 0.45) : mode === "vinegar" ? 0 : mode === "brush" ? 1 - 0.3 * clamp01((u - 0.2) / 0.6) : 1;
  const stoneLeft = mode === "vinegar" ? 1 - ease(clamp01((u - 0.2) / 0.7)) : 1;      // piedra que queda (vinagre la disuelve)
  const water = mode === "lower" ? YW - (YW + 0.5) * ease(clamp01((u - 0.05) / 0.7)) : mode === "paste" || mode === "vinegar" ? -0.5 : YW + (mode === "layers" ? -0.06 * (0.5 + 0.5 * Math.sin(f * 0.12)) : 0);
  const pasteK = mode === "paste" ? clamp01(lin(f, 4, 20)) * (1 - 0.0 * u) : 0;
  const stripK = mode === "vinegar" ? clamp01(lin(f, 4, 26)) * (1 - clamp01((u - 0.9) / 0.1)) : 0;
  const nL = Math.max(0, Math.round(NL * grow * stoneLeft + (stoneLeft < 1 && stoneLeft > 0 ? 0.49 : 0)));

  const a = interpolate(f, [0, T], [-orbit, orbit * 0.5], { easing: Easing.inOut(Easing.cubic) });
  const dist = interpolate(f, [0, T], [4.3, 3.55]);
  const target = new THREE.Vector3(0, 0.05, -0.35);
  const camPos = new THREE.Vector3(Math.sin(a) * dist, 2.35 - 0.2 * (f / T), -0.35 + Math.cos(a) * dist);

  const geo = useMemo(() => ({
    bowl: bowlGeo(), outer: outerGeo(),
    rim: new THREE.TorusGeometry(1.27, 0.09, 12, 64, A1 - A0),
    layers: Array.from({ length: NL }, (_, k) => bandGeo(0.016 + k * 0.013, YW - 0.1 - k * 0.006, YW + 0.09 + k * 0.006, k * 1.7)),
    brown: bandGeo(0.016 + NL * 0.013 + 0.014, YW - 0.09, YW + 0.1, 9.1),
    paste: bandGeo(0.016 + NL * 0.013 + 0.05, YW - 0.13, YW + 0.13, 3.3),
    cut: new THREE.PlaneGeometry(1, 1),
  }), []);
  const mats = useMemo(() => ({
    porcelain: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.16, side: THREE.DoubleSide }),
    porcelainOut: new THREE.MeshStandardMaterial({ color: "#F3F1EC", roughness: 0.3, side: THREE.DoubleSide }),
    cutFace: new THREE.MeshStandardMaterial({ color: "#E9E4DA", roughness: 0.8, side: THREE.DoubleSide }),
    water: new THREE.MeshStandardMaterial({ color: "#BFDDF2", transparent: true, opacity: 0.45, roughness: 0.05, depthWrite: false, side: THREE.DoubleSide }),
    stone: Array.from({ length: NL }, (_, k) => new THREE.MeshStandardMaterial({ color: new THREE.Color("#D9CFB6").lerp(new THREE.Color("#A89A7C"), k / NL), roughness: 0.97, side: THREE.DoubleSide })),
    brown: new THREE.MeshStandardMaterial({ color: "#7B4A22", roughness: 0.85, transparent: true, opacity: 1, side: THREE.DoubleSide }),
    paste: new THREE.MeshStandardMaterial({ color: "#FAFAF7", roughness: 0.95, transparent: true, opacity: 1, side: THREE.DoubleSide }),
    bubble: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.2, transparent: true, opacity: 0.85 }),
    strip: new THREE.MeshStandardMaterial({ color: "#F4EFE2", roughness: 0.9, transparent: true, opacity: 0.92, side: THREE.DoubleSide }),
    brush: new THREE.MeshStandardMaterial({ color: "#2F6FD0", roughness: 0.5 }),
    bristle: new THREE.MeshStandardMaterial({ color: "#F2F2F2", roughness: 0.7 }),
  }), []);
  mats.brown.opacity = clamp01(brownK);
  mats.paste.opacity = pasteK;

  // agua: disco a la altura del nivel, cortado a la media taza
  const waterGeo = useMemo(() => new THREE.CircleGeometry(1, 48, A0, A1 - A0), []);
  const wr = rAt(Math.max(-0.6, water)) - 0.01;
  // cepillo (modo brush): recorre el anillo de izquierda a derecha
  const ba = A1 - 0.25 - (A1 - A0 - 0.5) * ease(clamp01((f - 10) / Math.max(1, T * 0.7)));
  const bp = ringPt(ba, YW + 0.02, 0.18);
  // burbujas de la pasta
  const bubbles = mode === "paste" ? Array.from({ length: 46 }, (_, i) => { const t = u * 1.4 - rnd(i) * 0.5; if (t <= 0 || t > 1) return null; const aa = A0 + 0.1 + rnd(i + 3) * (A1 - A0 - 0.2); const p = ringPt(aa, YW - 0.05 + rnd(i + 9) * 0.12, 0.12 + rnd(i + 4) * 0.02); return { p, s: Math.sin(Math.PI * t) * (0.012 + rnd(i + 2) * 0.02), i }; }).filter(Boolean) as any[] : [];
  // tiras de papel (modo vinagre): rectángulos curvos apoyados sobre el anillo
  const strips = mode === "vinegar" ? Array.from({ length: 9 }, (_, i) => { const aa = A0 + 0.12 + i * ((A1 - A0 - 0.24) / 8); const k = clamp01(stripK * 9 - i); return { aa, k, i }; }) : [];

  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(34, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const ringP = proj(ringPt(Math.PI * 0.32, YW, 0.06));
  const base = proj(new THREE.Vector3(0, -1.05, -0.4));
  const L: { at: any; text: string; dx: number; dy: number; t0: number; alert?: boolean }[] = [];
  if (labels.ring) L.push({ at: ringPt(Math.PI * 0.6, YW, 0.05), text: labels.ring, dx: -60, dy: 260, t0: 10 });
  if (labels.water) L.push({ at: new THREE.Vector3(-0.2, Math.max(-0.55, water), -0.45), text: labels.water, dx: -320, dy: 150, t0: Math.round(T * 0.35) });
  // día (modo layers) / reloj noche (modo vinagre)
  const day = Math.max(1, Math.round(days * ease(u)));
  const night = mode === "vinegar" ? clamp01((f - 6) / Math.max(1, T * 0.8)) : 0;

  // LUPA: corte de las capas en 2D (porcelana | piedra x nL | marrón | agua) anclada al anillo
  const LX = width - 470, LY = 330, LR = 235, lk = lupa ? lin(f, 14, 28) : 0;
  const layerW = 26, porcW = 150;
  const lupaSvg = (
    <svg width={LR * 2} height={LR * 2} viewBox={`0 0 ${LR * 2} ${LR * 2}`} style={{ position: "absolute", left: LX - LR, top: LY - LR, opacity: lk, scale: String(0.8 + 0.2 * lk) }}>
      <defs><clipPath id="lupaC"><circle cx={LR} cy={LR} r={LR - 10} /></clipPath>
        <linearGradient id="porcG" x1="0" x2="1"><stop offset="0" stopColor="#EDEBE6" /><stop offset="0.8" stopColor="#FFFFFF" /><stop offset="1" stopColor="#F7F7F4" /></linearGradient></defs>
      <g clipPath="url(#lupaC)">
        <rect x={0} y={0} width={LR * 2} height={LR * 2} fill={mode === "lower" && u > 0.6 ? "#F3F0EA" : mode === "paste" || mode === "vinegar" ? "#F3F0EA" : "#CFE6F6"} />
        <rect x={0} y={0} width={porcW} height={LR * 2} fill="url(#porcG)" />
        <line x1={porcW} y1={0} x2={porcW} y2={LR * 2} stroke="#FFFFFF" strokeWidth={6} />
        {Array.from({ length: nL }, (_, k) => {
          const x0 = porcW + k * layerW; let d = `M ${x0} 0`;
          for (let yy = 0; yy <= LR * 2; yy += 18) d += ` L ${x0 + layerW + 5 * Math.sin(yy * 0.09 + k * 2.1) + 3 * rnd(k * 50 + yy)} ${yy}`;
          d += ` L ${x0} ${LR * 2} Z`;
          return <path key={k} d={d} fill={k % 2 ? "#D8D0BC" : "#E6DFCD"} stroke="#BFB49B" strokeWidth={1.5} />;
        })}
        {brownK > 0.02 ? (() => { const x0 = porcW + nL * layerW; let d = `M ${x0} 0`; for (let yy = 0; yy <= LR * 2; yy += 14) d += ` L ${x0 + 30 + 9 * Math.sin(yy * 0.13) + 6 * rnd(yy)} ${yy}`; d += ` L ${x0} ${LR * 2} Z`;
          return <g opacity={brownK}><path d={d} fill="#7B4A22" />{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={x0 + 8 + rnd(i) * 22} cy={20 + i * 33} r={3 + rnd(i + 1) * 4} fill="#4E2C12" />)}</g>; })() : null}
        {pasteK > 0.02 ? <g opacity={pasteK}><rect x={porcW + nL * layerW + 28} y={0} width={70} height={LR * 2} fill="#FBFBF8" />{Array.from({ length: 16 }, (_, i) => { const t = (u * 1.6 - rnd(i) * 0.6); if (t <= 0 || t > 1) return null; return <circle key={i} cx={porcW + nL * layerW + 20 + rnd(i + 5) * 40} cy={LR * 2 * rnd(i + 7)} r={4 + 10 * Math.sin(Math.PI * t)} fill="none" stroke="#9BB8D0" strokeWidth={2.5} />; })}</g> : null}
        {mode === "brush" ? (() => { const by = (LR * 2 + 160) * ((f * 0.022) % 1) - 80; return <g><rect x={porcW + nL * layerW + 34} y={by - 60} width={150} height={120} rx={14} fill={CL.nitrile} />{Array.from({ length: 9 }, (_, i) => <rect key={i} x={porcW + nL * layerW + 6} y={by - 52 + i * 13} width={34} height={6} rx={3} fill="#F4F4F4" />)}</g>; })() : null}
        {stripK > 0.02 ? <rect x={porcW + nL * layerW + 6} y={0} width={44} height={LR * 2} fill="#F4EFE2" opacity={0.9 * stripK} /> : null}
      </g>
      <circle cx={LR} cy={LR} r={LR - 6} fill="none" stroke={CL.navy} strokeWidth={14} />
      <circle cx={LR} cy={LR} r={LR - 16} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={3} />
    </svg>
  );
  const lupaLabels = lupa ? [
    { y: LY + LR + 34, text: "porcelana", x: LX - LR + 40, show: true },
  ] : [];

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={11} dim={0.38} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 42% 50%, rgba(255,252,246,0.8), rgba(255,252,246,0) 60%)" }} />
      <Contact x={base.x} y={base.y + 26} w={820} o={0.42} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 34, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
        <Cam pos={camPos} target={target} />
        <ambientLight intensity={0.78} />
        <directionalLight position={[-1.5, 7, 4]} intensity={1.15} color="#FFF1DA" />
        <directionalLight position={[3, 2, 3]} intensity={0.35} />
        <mesh geometry={geo.bowl} material={mats.porcelain} />
        <mesh geometry={geo.outer} material={mats.porcelainOut} />
        <mesh geometry={geo.rim} material={mats.porcelainOut} rotation={[-Math.PI / 2, 0, A0]} position={[0, 0.93, 0]} />
        <mesh position={[0, -1.2, -0.35]} material={mats.porcelainOut}><cylinderGeometry args={[0.62, 0.78, 0.35, 40, 1, false, Math.PI / 2 + A0, A1 - A0]} /></mesh>
        {water > -0.58 ? <mesh geometry={waterGeo} material={mats.water} rotation={[-Math.PI / 2, 0, 0]} position={[0, water, 0]} scale={[wr, wr, 1]} /> : null}
        {Array.from({ length: nL }, (_, k) => <mesh key={k} geometry={geo.layers[k]} material={mats.stone[k]} />)}
        {brownK > 0.02 && nL > 0 ? <mesh geometry={geo.brown} material={mats.brown} /> : null}
        {pasteK > 0.02 ? <mesh geometry={geo.paste} material={mats.paste} /> : null}
        {bubbles.map((b) => <mesh key={b.i} position={b.p} scale={b.s * 40} material={mats.bubble}><sphereGeometry args={[0.025, 8, 6]} /></mesh>)}
        {strips.map((s) => s.k > 0.02 ? (
          <mesh key={s.i} position={ringPt(s.aa, YW, 0.05 + 0.02 * s.k)} rotation={[0, s.aa - Math.PI / 2, -0.25]} scale={[0.26, 0.24 * s.k, 1]} material={mats.strip}><planeGeometry args={[1, 1]} /></mesh>
        ) : null)}
        {mode === "brush" ? (
          <group position={bp} rotation={[0, ba - Math.PI / 2, 0.35]}>
            <mesh material={mats.brush} position={[0, 0.5, 0.05]}><cylinderGeometry args={[0.035, 0.035, 1.1, 12]} /></mesh>
            <mesh material={mats.brush} position={[0, -0.05, 0.05]}><boxGeometry args={[0.32, 0.12, 0.12]} /></mesh>
            {Array.from({ length: 14 }, (_, i) => <mesh key={i} material={mats.bristle} position={[-0.14 + (i % 7) * 0.047, -0.05, -0.04 - Math.floor(i / 7) * 0.05]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.12, 6]} /></mesh>)}
          </group>
        ) : null}
      </ThreeCanvas>
      <RoomLight k={0.7} />
      {/* línea de la lupa al anillo real */}
      {lupa ? <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: lk }}>
        <circle cx={ringP.x} cy={ringP.y} r={16} fill="none" stroke={CL.navy} strokeWidth={5} />
        <line x1={ringP.x + 12} y1={ringP.y - 8} x2={LX - LR * 0.72} y2={LY + LR * 0.5} stroke={CL.navy} strokeWidth={5} strokeLinecap="round" />
      </svg> : null}
      {lupa ? lupaSvg : null}
      {lupa ? (
        <div style={{ position: "absolute", left: LX - LR - 10, top: LY + LR + 14, width: LR * 2 + 20, display: "flex", justifyContent: "space-between", opacity: lk, fontFamily: HAND, fontWeight: 700, fontSize: 42, color: CL.navy }}>
          <span>porcelana</span><span>{nL > 0 ? "piedra" : ""}</span><span style={{ color: "#6B3D18", opacity: brownK > 0.3 && nL > 0 ? 1 : 0 }}>marrón</span>
        </div>
      ) : null}
      {lupaLabels.length ? null : null}
      {/* rótulos proyectados */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0, l.t0 + 12); if (k <= 0) return null; const ex = p.x + l.dx, ey = p.y + l.dy;
          return (<g key={i} opacity={k}><circle cx={p.x} cy={p.y} r={10} fill={l.alert ? CL.red : CL.yellow} stroke={CL.ink} strokeWidth={3} /><line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * k} y2={p.y + (ey - p.y) * k} stroke={CL.ink} strokeWidth={4} strokeLinecap="round" /></g>); })}
      </svg>
      {L.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0 + 6, l.t0 + 18); if (k <= 0) return null;
        return (<div key={i} style={{ position: "absolute", left: p.x + l.dx, top: p.y + l.dy, translate: `${l.dx < 0 ? "-100%" : "0%"} -50%`, opacity: k, scale: String(0.85 + 0.15 * k), background: l.alert ? CL.red : CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 42, letterSpacing: 2, padding: "8px 22px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${CL.shadow}`, borderBottom: `4px solid ${CL.yellow}` }}>{l.text}</div>);
      })}
      {mode === "layers" ? (
        <div style={{ position: "absolute", left: 110, bottom: 110, opacity: lin(f, 4, 14), background: CL.white, borderRadius: 14, padding: "10px 30px 14px", boxShadow: `0 14px 30px ${CL.shadow}`, borderTop: `10px solid ${CL.navy}` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 3, color: CL.inkSoft }}>DÍA</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: CL.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{day}</div>
        </div>
      ) : null}
      {mode === "vinegar" ? (
        <div style={{ position: "absolute", left: 120, bottom: 190, width: 190, height: 190, borderRadius: "50%", opacity: lin(f, 4, 14), background: `radial-gradient(circle at 40% 40%, ${night < 0.75 ? "#F6F0D8" : "#FFE07A"}, ${night < 0.75 ? "#C9C2A6" : "#F2B330"})`, boxShadow: night < 0.75 ? `0 0 0 14px rgba(30,45,79,0.85), 0 0 60px rgba(30,45,79,0.6)` : "0 0 70px rgba(242,194,48,0.8)" }}>
          {night < 0.75 ? <div style={{ position: "absolute", left: 70, top: -6, width: 150, height: 150, borderRadius: "50%", background: "rgba(30,45,79,0.95)" }} /> : null}
          <div style={{ position: "absolute", top: 210, left: -30, width: 250, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CL.navy }}>{night < 0.75 ? "toda la noche" : "a la mañana"}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
