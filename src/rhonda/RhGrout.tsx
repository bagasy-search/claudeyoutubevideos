// Kit Rhonda · LECHADA (rhgrout). Todo vive DENTRO del mundo: piso de cerámica real, luz de ventana, sombra, perspectiva.
//   RhGroutJoint3D  corte 3D (three.js) de una junta entre dos baldosas, con los poros de la lechada a la vista:
//                   "mop"   el trapeador pasa, la arenilla se hace barro y baja a los poros (contador de semanas)
//                   "paste" la pasta blanca entra en la junta, burbujea desde los poros y la mugre SUBE a la pasta
//                   "clean" la junta limpia (poros vacíos, color original) · "seal" el sellador llena los poros y la gota queda arriba
//                   "drop"  prueba en vivo: gota sobre la baldosa (queda) vs gota sobre la junta (se la chupa en 2 s)
//   RhQuoteStamp    el presupuesto de US$1.200 tirado en el piso, en perspectiva: marcador rojo lo tacha + sello + la caja de bicarbonato
//   RhFloorMap      el piso de la cocina visto en perspectiva: las juntas pasan de gris a blanco línea por línea, contador N/M y
//                   las 3 zonas (cocina, pileta, puerta) que se encienden
//   RhBrushCompare  cepillo de alambre (raya el esmalte, saca lechada) vs nylon (la línea queda blanca) sobre la misma baldosa
import React, { useMemo } from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RH, LABEL, SERIF, HAND, rnd, clamp01 } from "./RhTheme";
import { lin, pop, useOut, Stamp } from "./RhParts";

const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};
const mix = (a: string, b: string, k: number) => { const A = new THREE.Color(a), B = new THREE.Color(b); return "#" + A.lerp(B, clamp01(k)).getHexString(); };

type JMode = "mop" | "paste" | "clean" | "seal" | "drop";
type JLabels = { pore?: string; dirt?: string; paste?: string; tile?: string; grout?: string; seal?: string; week?: string };
const JW = 0.13, DEP = 2.2, TW = 1.5;   // media junta, profundidad del tramo, ancho de baldosa
const NP = 26;

export const RhGroutJoint3D: React.FC<{ mode?: JMode; labels?: JLabels; bed?: string }> = ({ mode = "paste", labels = {}, bed }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames: T } = useVideoConfig();
  const t0 = 6, t1 = Math.max(t0 + 12, T * 0.8), u = clamp01((f - t0) / (t1 - t0));
  // cámara: órbita LINEAL hasta el último cuadro (nunca se queda quieta)
  const a = interpolate(f, [0, T], [-0.55, 0.35]);
  const dist = interpolate(f, [0, T], [3.5, 2.75]);
  const target = new THREE.Vector3(0, -0.12, 0.6);
  const camPos = new THREE.Vector3(Math.sin(a) * dist, 1.05 + 0.15 * (f / T), 0.6 + Math.cos(a) * dist);
  const dirty = mode === "mop" ? u : mode === "paste" ? 1 - clamp01((u - 0.35) / 0.55) : mode === "drop" ? 0.15 : 0;
  const pasteK = mode === "paste" ? clamp01(u / 0.22) * (1 - clamp01((u - 0.9) / 0.1) * 0) : 0;
  const sealK = mode === "seal" ? clamp01(u / 0.5) : 0;
  const mats = useMemo(() => ({
    tile: new THREE.MeshStandardMaterial({ color: "#E9E4DA", roughness: 0.35 }),
    glaze: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.06, metalness: 0.05, emissive: "#F4F1EA", emissiveIntensity: 0.12 }),
    pore: new THREE.MeshStandardMaterial({ color: "#8E877A", roughness: 1 }),
    dirt: new THREE.MeshStandardMaterial({ color: "#3A2E22", roughness: 0.9 }),
    paste: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.7, emissive: "#FFFFFF", emissiveIntensity: 0.08 }),
    bub: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.05, transparent: true, opacity: 0.85 }),
    seal: new THREE.MeshStandardMaterial({ color: "#9FD0F0", roughness: 0.05, transparent: true, opacity: 0.6 }),
    drop: new THREE.MeshStandardMaterial({ color: "#CFE8F8", roughness: 0.02, transparent: true, opacity: 0.8 }),
    mop: new THREE.MeshStandardMaterial({ color: "#7FA7C9", roughness: 0.95 }),
    mud: new THREE.MeshStandardMaterial({ color: "#4A3B2B", roughness: 0.9 }),
  }), []);
  const groutColor = mix("#E7E2D7", "#6F675B", dirty);
  const pores = useMemo(() => Array.from({ length: NP }, (_, i) => ({ x: (rnd(i * 3) - 0.5) * JW * 1.5, y: -0.05 - rnd(i * 7) * 0.2, z: DEP / 2 + 0.002, r: 0.012 + rnd(i * 11) * 0.016 })), []);
  // barro que baja a los poros (mop) · mugre que sube a la pasta (paste)
  const mud: { p: any; s: number }[] = [];
  if (mode === "mop") for (let i = 0; i < 18; i++) { const ph = clamp01((u * 1.4 - rnd(i * 5) * 0.5)); const x0 = (rnd(i) - 0.5) * 1.6; mud.push({ p: new THREE.Vector3(x0 * (1 - ph), 0.02 - ph * (0.08 + rnd(i * 9) * 0.14), DEP / 2 - 0.05 - rnd(i * 13) * 0.6), s: 1 - ph * 0.3 }); }
  const lift = mode === "paste" ? clamp01((u - 0.3) / 0.5) : 0;
  const bubbles: any[] = [];
  if (mode === "paste" && pasteK > 0.8) for (let i = 0; i < 16; i++) { const ph = ((f * 0.025 + rnd(i * 17)) % 1); bubbles.push(new THREE.Vector3((rnd(i * 3) - 0.5) * JW * 1.4, -0.12 + ph * 0.2, DEP / 2 - 0.04 - rnd(i * 5) * 0.8)); }
  // gotas (drop / seal)
  const soak = mode === "drop" ? clamp01((u - 0.25) / 0.35) : 0;
  const mopX = mode === "mop" ? -2.2 + 4.4 * ((u * 2) % 1) : -9;
  const weeks = mode === "mop" ? Math.max(1, Math.round(u * 52)) : 0;
  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(32, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const LB: { at: any; text: string; dx: number; dy: number; t0: number; alert?: boolean }[] = [];
  const lt = (k: number) => Math.round(t0 + (t1 - t0) * k);
  if (labels.tile) LB.push({ at: new THREE.Vector3(-0.8, 0.02, 1.0), text: labels.tile, dx: -220, dy: -190, t0: lt(0.02) });
  if (labels.grout) LB.push({ at: new THREE.Vector3(0, -0.06, DEP / 2), text: labels.grout, dx: 260, dy: 170, t0: lt(0.08) });
  if (labels.pore) LB.push({ at: new THREE.Vector3(pores[3].x, pores[3].y, pores[3].z), text: labels.pore, dx: -320, dy: 170, t0: lt(0.15) });
  if (labels.dirt) LB.push({ at: new THREE.Vector3(pores[8].x, pores[8].y, pores[8].z), text: labels.dirt, dx: 300, dy: 120, t0: lt(0.3), alert: true });
  if (labels.paste) LB.push({ at: new THREE.Vector3(0, 0.05, DEP / 2 - 0.2), text: labels.paste, dx: 280, dy: -200, t0: lt(0.18) });
  if (labels.seal) LB.push({ at: new THREE.Vector3(0, 0.06, 0.6), text: labels.seal, dx: 280, dy: -210, t0: lt(0.55) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: RH.white }}>
      {bed ? <Img src={staticFile(bed)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(14px) brightness(1.05) saturate(0.85)", scale: String(1.08 + 0.05 * f / T) }} /> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 22% 18%, rgba(255,250,236,0.85), rgba(251,248,242,0.35) 55%, rgba(30,42,54,0.18) 100%)" }} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true }}>
        <Cam pos={camPos} target={target} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[-5, 6, 5]} intensity={1.35} color="#FFF3DE" />
        <directionalLight position={[4, 2, 6]} intensity={0.35} color="#DCE9F5" />
        {/* dos baldosas con su esmalte */}
        {[-1, 1].map((s) => (<group key={s}>
          <mesh position={[s * (JW + TW / 2), -0.13, 0]} material={mats.tile}><boxGeometry args={[TW, 0.26, DEP]} /></mesh>
          <mesh position={[s * (JW + TW / 2), 0.005, 0]} material={mats.glaze}><boxGeometry args={[TW, 0.012, DEP]} /></mesh>
        </group>))}
        {/* la junta (un poquito más baja que la baldosa) */}
        <mesh position={[0, -0.145, 0]}><boxGeometry args={[JW * 2, 0.27, DEP]} /><meshStandardMaterial color={groutColor} roughness={1} /></mesh>
        {/* poros en la cara del corte, con mugre adentro */}
        {pores.map((p, i) => { const dk = clamp01(dirty * 1.3 - rnd(i * 19) * 0.3); const up = lift * (0.12 + rnd(i) * 0.1);
          return (<group key={i}>
            <mesh position={[p.x, p.y, p.z]} material={mats.pore}><sphereGeometry args={[p.r, 10, 8]} /></mesh>
            {dk > 0.05 ? <mesh position={[p.x, p.y + up, p.z + 0.004]} scale={dk * (1 - lift * 0.6)} material={mats.dirt}><sphereGeometry args={[p.r * 0.85, 10, 8]} /></mesh> : null}
            {sealK > 0.05 ? <mesh position={[p.x, p.y, p.z + 0.006]} scale={sealK} material={mats.seal}><sphereGeometry args={[p.r * 0.9, 10, 8]} /></mesh> : null}
          </group>); })}
        {/* la pasta: cordón blanco dentro de la junta */}
        {pasteK > 0.02 ? <mesh position={[0, -0.01, DEP / 2 - pasteK * DEP / 2]} rotation={[Math.PI / 2, 0, 0]} scale={[1, pasteK, 1]} material={mats.paste}><cylinderGeometry args={[JW * 1.05, JW * 1.05, DEP, 24]} /></mesh> : null}
        {bubbles.map((b, i) => <mesh key={"b" + i} position={b} material={mats.bub}><sphereGeometry args={[0.014 + rnd(i) * 0.01, 8, 6]} /></mesh>)}
        {lift > 0.05 ? Array.from({ length: 14 }, (_, i) => <mesh key={"m" + i} position={[(rnd(i * 23) - 0.5) * JW * 1.6, 0.03 + rnd(i * 29) * 0.06, DEP / 2 - 0.1 - rnd(i * 31) * (DEP - 0.3)]} scale={lift} material={mats.dirt}><sphereGeometry args={[0.012, 6, 5]} /></mesh>) : null}
        {/* sellador: película sobre la junta */}
        {sealK > 0.05 ? <mesh position={[0, -0.006, DEP / 2 - sealK * DEP / 2]} scale={[1, 1, sealK]} material={mats.seal}><boxGeometry args={[JW * 2, 0.008, DEP]} /></mesh> : null}
        {/* trapeador + barro */}
        {mode === "mop" ? <mesh position={[mopX, 0.06, 0.4]} rotation={[0, 0.1, 0]} material={mats.mop}><boxGeometry args={[0.7, 0.1, 1.6]} /></mesh> : null}
        {mud.map((m, i) => <mesh key={"u" + i} position={m.p} scale={m.s} material={mats.mud}><sphereGeometry args={[0.022, 8, 6]} /></mesh>)}
        {/* gotas: sobre la baldosa queda · sobre la junta se la chupa (drop) / queda (seal) */}
        {mode === "drop" ? <mesh position={[-0.75, 0.05, 0.7]} scale={[1, 0.62, 1]} material={mats.drop}><sphereGeometry args={[0.09, 18, 14]} /></mesh> : null}
        {mode === "drop" && soak < 0.98 ? <mesh position={[0, 0.03 - soak * 0.04, 0.7]} scale={[1 - soak * 0.4, 0.6 * (1 - soak), 1 - soak * 0.4]} material={mats.drop}><sphereGeometry args={[0.09, 18, 14]} /></mesh> : null}
        {mode === "drop" && soak > 0.1 ? <mesh position={[0, -0.009, 0.7]} scale={[1, 1, 1.4]}><cylinderGeometry args={[JW * 0.98 * soak, JW * 0.98 * soak, 0.005, 20]} /><meshStandardMaterial color="#4E483F" transparent opacity={0.55 * soak} /></mesh> : null}
        {mode === "seal" && sealK > 0.6 ? <mesh position={[0, 0.05, 0.6]} scale={[1, 0.62, 1]} material={mats.drop}><sphereGeometry args={[0.085 * clamp01((sealK - 0.6) / 0.3 + 0.3), 18, 14]} /></mesh> : null}
      </ThreeCanvas>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {LB.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0, l.t0 + 12); if (k <= 0) return null; const ex = p.x + l.dx, ey = p.y + l.dy;
          return (<g key={i} opacity={k}><circle cx={p.x} cy={p.y} r={9} fill={l.alert ? RH.red : RH.yellow} stroke={RH.ink} strokeWidth={3} /><line x1={p.x} y1={p.y} x2={p.x + (ex - p.x) * k} y2={p.y + (ey - p.y) * k} stroke={RH.ink} strokeWidth={4} strokeLinecap="round" /></g>); })}
      </svg>
      {LB.map((l, i) => { const p = proj(l.at), k = lin(f, l.t0 + 6, l.t0 + 18); if (k <= 0) return null;
        const est = l.text.length * 25 + 50; let x = l.dx < 0 ? p.x + l.dx - est : p.x + l.dx; x = Math.max(30, Math.min(width - est - 30, x));
        return (<div key={i} style={{ position: "absolute", left: x, top: Math.max(40, Math.min(height - 90, p.y + l.dy)), translate: "0 -50%", opacity: k, scale: String(0.85 + 0.15 * k), background: l.alert ? RH.red : RH.blueDeep, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 42, letterSpacing: 2, padding: "8px 22px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 10px 24px ${RH.shadow}` }}>{l.text}</div>);
      })}
      {mode === "mop" ? <div style={{ position: "absolute", right: 110, top: 90, background: RH.white, borderRadius: 18, padding: "12px 30px", boxShadow: `0 14px 30px ${RH.shadow}`, textAlign: "center" }}>
        <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 3, color: RH.inkSoft }}>{labels.week || "MOPPING"}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: RH.ink, lineHeight: 1 }}>week {weeks}</div></div> : null}
      {mode === "drop" ? <div style={{ position: "absolute", right: 110, top: 90, background: RH.white, borderRadius: 18, padding: "12px 30px", boxShadow: `0 14px 30px ${RH.shadow}`, fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: soak >= 0.98 ? RH.red : RH.ink }}>0:0{Math.min(2, Math.floor(soak * 2.2))}</div> : null}
    </AbsoluteFill>
  );
};

// ── el presupuesto en el piso, en perspectiva, con sombra; marcador rojo + sello + la caja de bicarbonato
export const RhQuoteStamp: React.FC<{ bed?: string; price?: string; job?: string; lines?: string[]; stamp?: string; instead?: string }> = ({ bed, price = "$1,200", job = "Grind out & regrout · kitchen", lines = ["Labor · 2 days", "Remove old grout", "New grout + sealer"], stamp = "NOT NEEDED", instead = "1 box of baking soda" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14), strike = lin(f, T * 0.32, T * 0.32 + 10), st = Math.round(T * 0.48), note = pop(f, fps, T * 0.62, 12);
  const z = 1 + 0.07 * f / T, rx = 38 - 6 * f / T;
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: RH.white }}>
      {bed ? <Img src={staticFile(bed)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(10px) brightness(1.04)", scale: String(1.06 + 0.06 * f / T) }} /> : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(251,248,242,0.15), rgba(30,42,54,0.18))" }} />
      <AbsoluteFill style={{ perspective: 1400, scale: String(z) }}>
        <div style={{ position: "absolute", left: "50%", top: "52%", width: 900, height: 620, translate: `-50% -50%`, transform: `rotateX(${rx}deg) rotateZ(${-6 + 2 * f / T}deg) translateY(${(1 - p) * -260}px)`, background: "#FFFEF8", boxShadow: "0 50px 60px rgba(20,25,30,0.35)", padding: "46px 60px", opacity: Math.min(1, p * 1.4) }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: RH.inkSoft }}>ESTIMATE</div>
          <div style={{ height: 3, background: RH.ink, opacity: 0.25, margin: "14px 0 26px" }} />
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 50, color: RH.ink }}>{job}</div>
          {lines.map((t, i) => <div key={i} style={{ fontFamily: SERIF, fontSize: 38, color: RH.inkSoft, marginTop: 14 }}>{t}</div>)}
          <div style={{ position: "absolute", right: 60, bottom: 50, fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: RH.ink }}>{price}</div>
          <svg style={{ position: "absolute", right: 30, bottom: 60, overflow: "visible" }} width={460} height={140}>
            <path d="M 0 90 C 140 60, 300 80, 460 40" fill="none" stroke={RH.red} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} />
          </svg>
        </div>
      </AbsoluteFill>
      <Stamp text={stamp} at={st} color={RH.red} x="58%" y="40%" rot={-12} size={92} />
      <div style={{ position: "absolute", right: 120, bottom: 110, opacity: Math.min(1, note * 1.4), rotate: `${4 - 2 * note}deg`, translate: `${(1 - note) * 200}px 0`, background: RH.yellow, padding: "18px 30px", boxShadow: `0 18px 36px ${RH.shadow}` }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 32, letterSpacing: 3, color: RH.ink, opacity: 0.75 }}>INSTEAD</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: RH.ink }}>{instead}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── el piso de la cocina en perspectiva: juntas gris → blanco línea por línea + zonas + contador
export const RhFloorMap: React.FC<{ bed?: string; zones?: { label: string; x: number; y: number }[]; cols?: number; rows?: number; title?: string }> = ({ bed, zones = [], cols = 8, rows = 6, title = "LINE BY LINE" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const lines = cols - 1 + rows - 1, k = lin(f, 10, T * 0.82) * lines, done = Math.min(lines, Math.floor(k));
  const W = 1200, H = 760, cw = W / cols, ch = H / rows;
  const rot = interpolate(f, [0, T], [52, 44]), rz = interpolate(f, [0, T], [-14, -6]);
  const col = (i: number) => mix("#7A7266", "#F4F0E8", clamp01(k - i));
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: RH.white }}>
      {bed ? <Img src={staticFile(bed)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(12px) brightness(1.06)", scale: String(1.08 + 0.05 * f / T) }} /> : null}
      <AbsoluteFill style={{ background: "rgba(246,243,236,0.45)" }} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", left: "50%", top: "56%", width: W, height: H, translate: "-50% -50%", transform: `rotateX(${rot}deg) rotateZ(${rz}deg) scale(${1 + 0.05 * f / T})`, background: "#EFEBE3", boxShadow: "0 80px 80px rgba(20,25,30,0.3)", border: "10px solid #CFC8BC" }}>
          {Array.from({ length: cols * rows }, (_, i) => <div key={i} style={{ position: "absolute", left: (i % cols) * cw + 5, top: Math.floor(i / cols) * ch + 5, width: cw - 10, height: ch - 10, background: `linear-gradient(135deg,#FFFFFF,#ECE7DE)` }} />)}
          {Array.from({ length: cols - 1 }, (_, i) => <div key={"v" + i} style={{ position: "absolute", left: (i + 1) * cw - 5, top: 0, width: 10, height: H, background: col(i) }} />)}
          {Array.from({ length: rows - 1 }, (_, i) => <div key={"h" + i} style={{ position: "absolute", top: (i + 1) * ch - 5, left: 0, height: 10, width: W, background: col(cols - 1 + i) }} />)}
          {zones.map((z, i) => { const zp = pop(f, fps, 14 + i * 12, 12); return (
            <div key={i} style={{ position: "absolute", left: z.x * W, top: z.y * H, translate: "-50% -50%", width: 210, height: 210, borderRadius: "50%", border: `8px solid ${RH.red}`, opacity: zp, scale: String(0.6 + 0.4 * zp + 0.03 * Math.sin(f / 6 + i)) }} />); })}
        </div>
      </AbsoluteFill>
      {zones.map((z, i) => { const zp = pop(f, fps, 18 + i * 12, 12);
        return <div key={"l" + i} style={{ position: "absolute", left: 160 + i * 560, bottom: 90, opacity: zp, translate: `0 ${(1 - zp) * 60}px`, background: RH.red, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 2, padding: "8px 24px", borderRadius: 10, boxShadow: `0 10px 24px ${RH.shadow}` }}>{z.label}</div>; })}
      <div style={{ position: "absolute", left: 110, top: 80, background: RH.blueDeep, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 50, letterSpacing: 2, padding: "8px 28px", borderRadius: 12, opacity: lin(f, 4, 14) }}>{title}</div>
      <div style={{ position: "absolute", right: 110, top: 70, background: RH.white, borderRadius: 18, padding: "10px 30px", boxShadow: `0 14px 30px ${RH.shadow}`, fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: done >= lines ? RH.blue : RH.ink }}>{done}<span style={{ fontSize: 48, color: RH.inkSoft }}>/{lines}</span></div>
    </AbsoluteFill>
  );
};

// ── alambre vs nylon sobre la MISMA baldosa (foto real de cerca en perspectiva), rayas dibujadas, cruz y tilde
export const RhBrushCompare: React.FC<{ img: string; wire: string; nylon: string }> = ({ img, wire, nylon }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const k = lin(f, 8, T * 0.7), sw = Math.sin(f / 3.2) * 70;
  const verdict = pop(f, fps, T * 0.68, 11);
  const Side: React.FC<{ left: boolean }> = ({ left }) => (
    <div style={{ position: "absolute", left: left ? 90 : 990, top: 190, width: 840, height: 560, borderRadius: 18, overflow: "hidden", boxShadow: `0 40px 60px ${RH.shadow}`, transform: `perspective(1400px) rotateX(18deg) rotateY(${left ? 8 : -8}deg)` }}>
      <Img src={staticFile(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: String(1.1 + 0.08 * f / T), filter: left ? undefined : `brightness(${1 + 0.12 * k})` }} />
      {left ? <svg width={840} height={560} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 22 }, (_, i) => { const y = 120 + rnd(i * 5) * 320, x = 60 + rnd(i * 7) * 600, L = 80 + rnd(i * 9) * 140, v = clamp01(k * 1.6 - rnd(i) * 0.6);
          return <line key={i} x1={x} y1={y} x2={x + L * v} y2={y + (rnd(i * 3) - 0.5) * 30 * v} stroke="rgba(255,255,255,0.9)" strokeWidth={2.5} />; })}
        {Array.from({ length: 16 }, (_, i) => <circle key={"c" + i} cx={380 + (rnd(i * 13) - 0.5) * 180} cy={260 + rnd(i * 17) * 200 * k} r={4 + rnd(i) * 4} fill="#9A9184" opacity={k} />)}
      </svg> : <AbsoluteFill style={{ background: `linear-gradient(90deg, transparent ${46 - 3 * k}%, rgba(255,255,255,${0.55 * k}) 48%, rgba(255,255,255,${0.55 * k}) 52%, transparent ${54 + 3 * k}%)` }} />}
      <Img src={staticFile(left ? wire : nylon)} style={{ position: "absolute", width: 360, height: 240, objectFit: "cover", left: 240 + (left ? sw : sw * 0.6), top: 160, borderRadius: 14, boxShadow: "0 24px 30px rgba(0,0,0,0.35)", rotate: `${left ? -14 : 12}deg` }} />
      <div style={{ position: "absolute", left: 24, top: 20, background: left ? RH.red : RH.blueDeep, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 46, letterSpacing: 2, padding: "6px 22px", borderRadius: 10 }}>{left ? "WIRE BRUSH" : "NYLON BRUSH"}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: RH.white }}>
      <Img src={staticFile(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(16px) brightness(1.08)", scale: "1.15" }} />
      <AbsoluteFill style={{ background: "rgba(246,243,236,0.55)" }} />
      <Side left /><Side left={false} />
      <div style={{ position: "absolute", left: 510, top: 780, translate: "-50% 0", scale: String(verdict), fontFamily: LABEL, fontWeight: 700, fontSize: 54, color: "#fff", background: RH.red, padding: "8px 28px", borderRadius: 12, whiteSpace: "nowrap" }}>✕ SCRATCHES THE GLAZE</div>
      <div style={{ position: "absolute", left: 1410, top: 780, translate: "-50% 0", scale: String(verdict), fontFamily: LABEL, fontWeight: 700, fontSize: 54, color: "#fff", background: RH.blue, padding: "8px 28px", borderRadius: 12, whiteSpace: "nowrap" }}>✓ LIFTS THE DIRT</div>
    </AbsoluteFill>
  );
};
