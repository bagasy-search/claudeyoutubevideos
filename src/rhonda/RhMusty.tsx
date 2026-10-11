// Kit Rhonda · OLOR A HUMEDAD (rhmusty). Todo dentro del mundo: perspectiva, sombra, luz de ventana, movimiento hasta el último cuadro.
//   RhHousePlan3D  la casa en 3D (three.js) vista desde arriba en diagonal: paredes, 6 alfileres que aparecen en orden con contador N/6;
//                  `active` = el lugar del que se habla (pulsa con la mancha de humedad azul-verde); active 0 = recorrido de los 6
//   RhNoseMeter    el "olfatómetro": tarjeta en perspectiva con aguja que sube habitación por habitación hasta FOUND IT
//   RhDrainTrap    el codo del desagüe en corte: "full" el agua tapa el gas · "dry" el agua se evapora y el gas sube a la casa ·
//                  "oil" se rellena y una capa de aceite flota arriba
//   RhFridgeGrille la rejilla de abajo de la heladera se va de costado (flip) y la linterna barre la bandeja con agua y pelusa negra
//   RhHygrometer   higrómetro de aguja sobre la mesa: baja de lo húmedo (rojo, >60 %) a lo seco, sello UNDER 60%
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RH, LABEL, SERIF, HAND, rnd, clamp01 } from "./RhTheme";
import { lin, pop, useOut, Stamp } from "./RhParts";

const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};
const Bed: React.FC<{ src?: string; blur?: number; f: number; T: number; veil?: number }> = ({ src, blur = 12, f, T, veil = 0.4 }) => (
  <>
    {src ? <Img src={staticFile(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px) brightness(1.05)`, scale: String(1.08 + 0.05 * f / T) }} /> : null}
    <AbsoluteFill style={{ background: `rgba(246,243,236,${veil})` }} />
  </>
);
const Chip: React.FC<{ txt: string; bg?: string; style?: React.CSSProperties }> = ({ txt, bg = RH.blueDeep, style }) => (
  <div style={{ position: "absolute", background: bg, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 46, letterSpacing: 2, padding: "8px 26px", borderRadius: 12, whiteSpace: "nowrap", boxShadow: `0 12px 26px ${RH.shadow}`, textTransform: "uppercase", ...style }}>{txt}</div>
);

// ── la casa en 3D con los 6 lugares ────────────────────────────────────────────────────────────────────────────────────────────
const SPOTS: { x: number; z: number; label: string }[] = [
  { x: -2.6, z: -1.3, label: "Under the sinks" }, { x: 1.9, z: -1.6, label: "The towels" }, { x: -0.6, z: 0.9, label: "Rugs + pads" },
  { x: 2.7, z: 0.4, label: "Drains you never use" }, { x: -3.3, z: -0.1, label: "Under the fridge" }, { x: 0.9, z: 2.0, label: "Outside-wall closets" },
];
// paredes: [x, z, largo, rot] (planta 8 x 5,6)
const WALLS: [number, number, number, number][] = [
  [0, -2.8, 8, 0], [0, 2.8, 8, 0], [-4, 0, 5.6, 1], [4, 0, 5.6, 1],
  [-1.2, -1.6, 2.4, 1], [1.0, -1.4, 2.8, 1], [-2.6, 0.2, 2.8, 0], [2.5, -0.2, 3.0, 0], [0.2, 1.7, 2.2, 1],
];
export const RhHousePlan3D: React.FC<{ active?: number; bed?: string; title?: string }> = ({ active = 0, bed, title = "6 PLACES" }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T } = useVideoConfig();
  const a = interpolate(f, [0, T], [-0.5, 0.25]), dist = interpolate(f, [0, T], [12.8, 11.4]);
  const target = new THREE.Vector3(active ? SPOTS[active - 1].x * 0.18 : 0, 0, active ? SPOTS[active - 1].z * 0.18 : 0.2);
  const camPos = new THREE.Vector3(Math.sin(a) * dist * 0.55, dist * 0.78, Math.cos(a) * dist * 0.62);
  // recorrido: los alfileres aparecen uno por uno; con active, ya están todos y el activo pulsa
  const n = active ? 6 : Math.min(6, Math.floor(lin(f, 8, T * 0.85) * 6 + 0.001) + (f > 8 ? 1 : 0));
  const pinK = (i: number) => (active ? 1 : clamp01((f - 8 - (i * (T * 0.85 - 8)) / 6) / 9));
  const proj = (v: any) => {
    const c = new THREE.PerspectiveCamera(30, width / height, 0.1, 100); c.position.copy(camPos); c.lookAt(target); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const q = v.clone().project(c); return { x: (q.x * 0.5 + 0.5) * width, y: (-q.y * 0.5 + 0.5) * height };
  };
  const cur = active || Math.max(1, n);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: RH.white }}>
      <Bed src={bed} f={f} T={T} blur={14} veil={0.35} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 25% 15%, rgba(255,250,236,0.8), rgba(251,248,242,0.3) 55%, rgba(30,42,54,0.2) 100%)" }} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true }}>
        <Cam pos={camPos} target={target} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[-6, 9, 5]} intensity={1.3} color="#FFF3DE" />
        <directionalLight position={[5, 4, 7]} intensity={0.35} color="#DCE9F5" />
        <mesh position={[0, -0.08, 0]}><boxGeometry args={[8.4, 0.16, 6.0]} /><meshStandardMaterial color="#D9CFC0" roughness={0.95} /></mesh>
        <mesh position={[0, 0.005, 0]}><boxGeometry args={[8, 0.01, 5.6]} /><meshStandardMaterial color="#EFE8DC" roughness={0.9} /></mesh>
        {WALLS.map(([x, z, L, r], i) => (
          <mesh key={i} position={[x, 0.32, z]} rotation={[0, r ? Math.PI / 2 : 0, 0]}><boxGeometry args={[L, 0.64, 0.12]} /><meshStandardMaterial color="#FFFFFF" roughness={0.8} /></mesh>))}
        {SPOTS.map((s, i) => { const k = pinK(i); if (k <= 0 || i >= n) return null; const on = active ? active === i + 1 : i === n - 1;
          const pulse = on ? 1 + 0.18 * Math.sin(f / 4) : 1;
          return (<group key={i} position={[s.x, 0, s.z]}>
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={pulse * k}><circleGeometry args={[0.55, 32]} /><meshStandardMaterial color={on ? "#4C8C7A" : "#7FA7C9"} transparent opacity={on ? 0.55 : 0.3} /></mesh>
            <mesh position={[0, 0.55 + (1 - k) * 1.2, 0]} scale={k}><sphereGeometry args={[0.2, 20, 16]} /><meshStandardMaterial color={on ? RH.red : RH.blueDeep} roughness={0.4} /></mesh>
            <mesh position={[0, 0.28 + (1 - k) * 1.2, 0]} rotation={[Math.PI, 0, 0]} scale={k}><coneGeometry args={[0.1, 0.5, 16]} /><meshStandardMaterial color={on ? RH.red : RH.blueDeep} /></mesh>
          </group>); })}
      </ThreeCanvas>
      {SPOTS.map((s, i) => { const k = pinK(i); if (k <= 0.6 || i >= n) return null; const on = active ? active === i + 1 : i === n - 1; const p = proj(new THREE.Vector3(s.x, 0.95, s.z));
        return (<div key={i} style={{ position: "absolute", left: Math.max(260, Math.min(width - 260, p.x)), top: Math.max(170, p.y), translate: "-50% -100%", opacity: (k - 0.6) / 0.4 * (active && !on ? 0.55 : 1), scale: String(on ? 1.08 : 0.82) }}>
          <div style={{ background: on ? RH.red : RH.white, color: on ? "#fff" : RH.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 38, letterSpacing: 1, padding: "6px 18px", borderRadius: 10, whiteSpace: "nowrap", boxShadow: `0 10px 22px ${RH.shadow}` }}>{i + 1} · {s.label}</div>
        </div>); })}
      <Chip txt={title} style={{ left: 110, top: height - 170, opacity: lin(f, 2, 12) }} />
      <div style={{ position: "absolute", right: 110, top: 70, background: RH.white, borderRadius: 18, padding: "10px 30px", boxShadow: `0 14px 30px ${RH.shadow}`, fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: cur >= 6 ? RH.blue : RH.ink }}>{cur}<span style={{ fontSize: 50, color: RH.inkSoft }}>/6</span></div>
    </AbsoluteFill>
  );
};

// ── el olfatómetro: la aguja sube habitación por habitación ────────────────────────────────────────────────────────────────────
export const RhNoseMeter: React.FC<{ bed?: string; steps?: string[]; found?: string }> = ({ bed, steps = ["Living room", "Hallway", "Kitchen", "Under the sink"], found = "FOUND IT" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const k = lin(f, 8, T * 0.78), idx = Math.min(steps.length - 1, Math.floor(k * steps.length));
  const val = clamp01(k + 0.025 * Math.sin(f / 2.3)), ang = -120 + 240 * val;
  const fp = pop(f, fps, T * 0.8, 12);
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: RH.white }}>
      <Bed src={bed} f={f} T={T} />
      <AbsoluteFill style={{ perspective: 1500 }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 1240, height: 720, translate: "-50% -50%", transform: `rotateX(${16 - 4 * f / T}deg) rotateY(${-10 + 8 * f / T}deg) scale(${1 + 0.05 * f / T})`, background: "#FFFEF8", borderRadius: 34, boxShadow: "0 60px 80px rgba(20,25,30,0.32)" }}>
          <svg width={1240} height={720} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 24 }, (_, i) => { const a0 = (-120 + i * 10) * Math.PI / 180, a1 = (-120 + (i + 1) * 10) * Math.PI / 180, R = 300, cx = 420, cy = 430;
              const c = i < 8 ? "#BFD7C4" : i < 16 ? "#F2D68A" : "#E58F80";
              return <path key={i} d={`M ${cx + R * Math.sin(a0)} ${cy - R * Math.cos(a0)} A ${R} ${R} 0 0 1 ${cx + R * Math.sin(a1)} ${cy - R * Math.cos(a1)}`} stroke={c} strokeWidth={56} fill="none" />; })}
            <g transform={`translate(420 430) rotate(${ang})`}><line x1={0} y1={30} x2={0} y2={-270} stroke={RH.ink} strokeWidth={12} strokeLinecap="round" /></g>
            <circle cx={420} cy={430} r={34} fill={RH.ink} />
            <text x={150} y={560} fontFamily={LABEL} fontWeight={700} fontSize={38} fill={RH.inkSoft}>FAINT</text>
            <text x={600} y={560} fontFamily={LABEL} fontWeight={700} fontSize={38} fill={RH.red}>STRONG</text>
          </svg>
          <div style={{ position: "absolute", left: 420, top: 600, translate: "-50% 0", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 4, color: RH.ink }}>MUSTY</div>
          {steps.map((s, i) => { const on = i <= idx, cur = i === idx; return (
            <div key={i} style={{ position: "absolute", left: 800, top: 120 + i * 120, display: "flex", alignItems: "center", gap: 20, opacity: on ? 1 : 0.35, translate: `${cur ? 10 : 0}px 0` }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: on ? (i === steps.length - 1 ? RH.red : RH.blue) : "#D8D2C6" }} />
              <div style={{ fontFamily: SERIF, fontWeight: cur ? 900 : 700, fontSize: 50, color: RH.ink }}>{s}</div>
            </div>); })}
        </div>
      </AbsoluteFill>
      <Stamp text={found} at={Math.round(T * 0.8)} color={RH.red} x="64%" y="76%" rot={-8} size={88} />
      <div style={{ position: "absolute", left: 120, bottom: 90, opacity: fp, fontFamily: HAND, fontSize: 64, color: RH.ink }}>stronger as you get closer</div>
    </AbsoluteFill>
  );
};

// ── el codo del desagüe en corte ───────────────────────────────────────────────────────────────────────────────────────────────
export const RhDrainTrap: React.FC<{ mode?: "full" | "dry" | "oil"; bed?: string; labels?: { water?: string; gas?: string; oil?: string } }> = ({ mode = "dry", bed, labels = {} }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const k = lin(f, 10, T * 0.75);
  const level = mode === "dry" ? 1 - k * 0.92 : mode === "oil" ? 0.08 + 0.92 * clamp01(k / 0.6) : 1; // 0..1 del codo lleno
  const oil = mode === "oil" ? clamp01((k - 0.62) / 0.3) : 0;
  const gas = mode === "dry" ? clamp01((k - 0.55) / 0.3) : 0;
  const yW = 600 - level * 170; // nivel del agua dentro de la U (y menor = más alto)
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: RH.white }}>
      <Bed src={bed} f={f} T={T} blur={14} veil={0.45} />
      <AbsoluteFill style={{ perspective: 1500 }}>
        <div style={{ position: "absolute", left: "50%", top: "52%", width: 1300, height: 820, translate: "-50% -50%", transform: `rotateY(${-14 + 10 * f / T}deg) rotateX(6deg) scale(${1 + 0.06 * f / T})` }}>
          <svg width={1300} height={820} style={{ position: "absolute", inset: 0, overflow: "visible", filter: "drop-shadow(0 40px 40px rgba(20,25,30,0.3))" }}>
            <defs>
              <clipPath id="u"><path d="M 380 80 L 500 80 L 500 520 A 110 110 0 0 0 720 520 L 720 330 L 1120 330 L 1120 450 L 840 450 L 840 520 A 230 230 0 0 1 380 520 Z" /></clipPath>
              <linearGradient id="pipe" x1="0" x2="1"><stop offset="0" stopColor="#E9EDF1" /><stop offset="0.5" stopColor="#FFFFFF" /><stop offset="1" stopColor="#C9D1D9" /></linearGradient>
            </defs>
            <path d="M 380 80 L 500 80 L 500 520 A 110 110 0 0 0 720 520 L 720 330 L 1120 330 L 1120 450 L 840 450 L 840 520 A 230 230 0 0 1 380 520 Z" fill="url(#pipe)" stroke="#8E99A4" strokeWidth={8} />
            <g clipPath="url(#u)">
              <rect x={360} y={yW} width={520} height={820} fill="#7FB2D6" opacity={0.85} />
              <path d={`M 360 ${yW} Q 450 ${yW - 8 * Math.sin(f / 5)} 540 ${yW} T 720 ${yW} T 900 ${yW}`} stroke="#5E95BD" strokeWidth={6} fill="none" />
              {oil > 0 ? <rect x={360} y={yW - 26 * oil} width={520} height={26 * oil} fill="#E7C24A" opacity={0.95} /> : null}
            </g>
            {/* gas de la cloaca: flechas verdes que suben por el caño de arriba cuando el codo se seca */}
            {Array.from({ length: 5 }, (_, i) => { const ph = ((f / 40 + i / 5) % 1); const y = 760 - ph * 700; const show = mode === "full" ? (y > 560 ? 1 : 0) : gas;
              const yy = mode === "full" ? Math.max(560, y) : y;
              return <g key={i} opacity={show * (1 - ph * 0.6)} transform={`translate(${mode === "full" ? 1000 - i * 60 : 600 + (i % 2 ? 40 : -40)} ${mode === "full" ? 395 + (i % 2) * 20 : yy})`}>
                <path d="M 0 30 L 0 -20 M -16 -4 L 0 -22 L 16 -4" stroke="#5E9B52" strokeWidth={9} fill="none" strokeLinecap="round" /></g>; })}
            {mode === "full" ? <g><line x1={720} y1={390} x2={760} y2={390} stroke={RH.red} strokeWidth={10} /><text x={770} y={300} fontFamily={LABEL} fontWeight={700} fontSize={40} fill={RH.red}>BLOCKED</text></g> : null}
            <text x={1130} y={400} fontFamily={LABEL} fontWeight={700} fontSize={36} fill={RH.inkSoft}>SEWER</text>
            <text x={360} y={60} fontFamily={LABEL} fontWeight={700} fontSize={36} fill={RH.inkSoft}>YOUR HOUSE</text>
          </svg>
          <Chip txt={labels.water || "Water plug"} style={{ left: 560, top: 690, opacity: level > 0.3 ? lin(f, 6, 16) : 0.3 }} />
          {mode === "dry" ? <Chip txt={labels.gas || "Dried up: smell comes up"} bg={RH.red} style={{ left: 40, top: 300, opacity: gas }} /> : null}
          {mode === "oil" ? <Chip txt={labels.oil || "1 tbsp oil on top"} bg="#B8901C" style={{ left: 40, top: 300, opacity: oil }} /> : null}
        </div>
      </AbsoluteFill>
      {mode === "dry" ? <div style={{ position: "absolute", right: 110, top: 80, background: RH.white, borderRadius: 18, padding: "10px 30px", boxShadow: `0 14px 30px ${RH.shadow}`, fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: gas > 0.5 ? RH.red : RH.ink }}>week {1 + Math.floor(k * 5)}</div> : null}
    </AbsoluteFill>
  );
};

// ── la rejilla de la heladera: flip + linterna sobre la bandeja ─────────────────────────────────────────────────────────────────
export const RhFridgeGrille: React.FC<{ bed?: string; label?: string }> = ({ bed, label = "The drip pan" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const g = lin(f, 8, 26), beam = lin(f, 22, T * 0.8), lp = pop(f, fps, T * 0.45, 12);
  const bx = 300 + 700 * beam;
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: RH.white }}>
      <Bed src={bed} f={f} T={T} blur={10} veil={0.25} />
      <AbsoluteFill style={{ perspective: 1300 }}>
        <div style={{ position: "absolute", left: "50%", top: "55%", width: 1500, height: 640, translate: "-50% -50%", transform: `rotateX(${10 + 3 * f / T}deg) scale(${1.02 + 0.07 * f / T})` }}>
          {/* frente de la heladera */}
          <div style={{ position: "absolute", left: 0, top: 0, width: 1500, height: 330, background: "linear-gradient(180deg,#FAFAF8,#E7E6E2)", borderRadius: "12px 12px 0 0", boxShadow: "inset 0 -6px 0 #CFCFCA" }} />
          {/* hueco de abajo, oscuro, con la bandeja */}
          <div style={{ position: "absolute", left: 40, top: 330, width: 1420, height: 260, background: "#1C1E21", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 160, top: 120, width: 1100, height: 110, background: "#3A3D40", borderRadius: 10, boxShadow: "inset 0 10px 18px rgba(0,0,0,0.6)" }}>
              <div style={{ position: "absolute", left: 30, top: 34, width: 1040, height: 52, borderRadius: 8, background: "linear-gradient(90deg,#55634F,#3F4A3B 40%,#5B6A52)", opacity: 0.9 }} />
              {Array.from({ length: 26 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i * 7) * 1010, top: 30 + rnd(i * 3) * 50, width: 14 + rnd(i) * 26, height: 10 + rnd(i * 5) * 16, borderRadius: "50%", background: "#141414", opacity: 0.85 }} />)}
            </div>
            {/* cono de la linterna */}
            <div style={{ position: "absolute", left: bx - 260, top: -40, width: 520, height: 360, background: "radial-gradient(ellipse at 50% 60%, rgba(255,247,214,0.85), rgba(255,247,214,0.25) 45%, transparent 70%)", mixBlendMode: "screen", opacity: beam > 0 ? 1 : 0 }} />
          </div>
          {/* rejilla: se va de costado girando (flip) */}
          <div style={{ position: "absolute", left: 40, top: 330, width: 1420, height: 260, transformOrigin: "0% 100%", transform: `translateX(${-g * 900}px) rotateY(${g * 70}deg)`, opacity: 1 - g * 0.6,
            background: "repeating-linear-gradient(90deg,#2B2D30 0 14px,#4A4D51 14px 30px)", boxShadow: "0 20px 30px rgba(0,0,0,0.35)" }} />
          <div style={{ position: "absolute", left: 0, top: 590, width: 1500, height: 50, background: "#BDB6A9", filter: "blur(6px)", opacity: 0.6 }} />
        </div>
      </AbsoluteFill>
      <Chip txt={label} bg={RH.red} style={{ left: "50%", top: 820, translate: "-50% 0", scale: String(lp), opacity: lp }} />
      <div style={{ position: "absolute", left: 120, top: 90, fontFamily: HAND, fontSize: 64, color: RH.ink, opacity: lin(f, 4, 14) }}>pull the grille off</div>
    </AbsoluteFill>
  );
};

// ── higrómetro de aguja sobre la mesa ───────────────────────────────────────────────────────────────────────────────────────────
export const RhHygrometer: React.FC<{ bed?: string; from?: number; to?: number; stamp?: string }> = ({ bed, from = 72, to = 48, stamp = "UNDER 60%" }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const k = lin(f, 10, T * 0.7), v = from + (to - from) * k + 0.6 * Math.sin(f / 3), ang = -135 + 270 * (v / 100);
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: RH.white }}>
      <Bed src={bed} f={f} T={T} blur={10} veil={0.3} />
      <AbsoluteFill style={{ perspective: 1400 }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 760, height: 760, translate: "-50% -50%", transform: `rotateX(${24 - 6 * f / T}deg) rotateZ(${-4 + 4 * f / T}deg) scale(${1 + 0.06 * f / T})`, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#FFFFFF,#ECE8E0)", border: "26px solid #8C6A45", boxShadow: "0 70px 70px rgba(20,25,30,0.38)" }}>
          <svg width={708} height={708} style={{ position: "absolute", left: 0, top: 0 }}>
            {Array.from({ length: 51 }, (_, i) => { const a = (-135 + i * 5.4) * Math.PI / 180, r1 = 300, r2 = i % 5 ? 280 : 260, c = 354;
              return <line key={i} x1={c + r1 * Math.sin(a)} y1={c - r1 * Math.cos(a)} x2={c + r2 * Math.sin(a)} y2={c - r2 * Math.cos(a)} stroke={i * 2 > 60 ? RH.red : RH.ink} strokeWidth={i % 5 ? 3 : 6} />; })}
            {[0, 20, 40, 60, 80, 100].map((p) => { const a = (-135 + 2.7 * p) * Math.PI / 180; return <text key={p} x={354 + 215 * Math.sin(a)} y={354 - 215 * Math.cos(a) + 14} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={40} fill={p > 60 ? RH.red : RH.ink}>{p}</text>; })}
            <g transform={`translate(354 354) rotate(${ang})`}><line x1={0} y1={40} x2={0} y2={-270} stroke="#1F2A33" strokeWidth={10} strokeLinecap="round" /></g>
            <circle cx={354} cy={354} r={26} fill="#1F2A33" />
            <text x={354} y={520} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={40} letterSpacing={4} fill={RH.inkSoft}>HUMIDITY</text>
          </svg>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 120, top: 90, background: RH.white, borderRadius: 18, padding: "10px 30px", boxShadow: `0 14px 30px ${RH.shadow}`, fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: v > 60 ? RH.red : RH.blue }}>{Math.round(v)}%</div>
      <Stamp text={stamp} at={Math.round(T * 0.72)} color={RH.blue} x="24%" y="78%" rot={-8} size={84} />
    </AbsoluteFill>
  );
};
