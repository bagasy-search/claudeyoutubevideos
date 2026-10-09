// Kit NUEVO de ollarder2 — todo DENTRO del mundo del sótano:
//  LarCellar3D: corte en 3D del rincón del sótano (2 paredes de cimiento contra la tierra fría, 2 paredes de montantes y
//               espuma, puerta aislada, estantes de listones con cajones) y el aire: entra frío por el caño de abajo y el
//               tibio sale por el de arriba (partículas). Modos: tour · corner · earth · vents.
//  LarThermo:   el termómetro de mínima y máxima clavado en la puerta de tablones, con las marcas en tiza al lado.
//  LarDoorTag:  la tarjeta de papel clavada en la puerta: cada método con su página; en el CTA lleva el QR IMPRESO.
//  LarZones:    las etiquetas clavadas en los estantes: frío y húmedo / frío y seco / tibio (y el orden para comerlo).
import React, { useMemo } from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { OLE, HAND, LABEL, SANS, SERIF, hexA } from "../ole/OleTheme";
import { CamRig, Motes, V3, canvasTex, dots, softTex, flick } from "../olsup/Ole3DKit";
import { rnd } from "../olsup/OleSupTheme";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const Scene: React.FC<{ src: string; push?: number }> = ({ src, push = 0.05 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], [1.04, 1.04 + push], CL);
  return <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#1f1a14" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} /></AbsoluteFill>;
};
const reveal = (p: number) => (p >= 99.9 ? "none" : `inset(-30% ${100 - p}% -30% 0)`);
const PinTag: React.FC<{ x: number; y: number; w?: number; rot?: number; at?: number; children: React.ReactNode; tone?: string }> = ({ x, y, w = 520, rot = -2, at = 0.2, children, tone = "#F4EBD3" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f - Math.round(at * fps), fps, config: { damping: 12, stiffness: 140 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: "26px 34px", background: tone, borderRadius: 4, boxShadow: "0 14px 26px rgba(0,0,0,0.45)", transform: `rotate(${rot}deg) translateY(${(1 - p) * -60}px)`, opacity: Math.min(1, p * 1.6) }}>
      <div style={{ position: "absolute", top: 10, left: "50%", width: 14, height: 14, borderRadius: 7, background: "#5b5b5b", boxShadow: "0 0 0 3px #2e2e2e" }} />
      {children}
    </div>
  );
};

// ───────────────────────────── LarCellar3D
export const LarCellar3D: React.FC<{ mode?: "tour" | "corner" | "earth" | "vents" }> = ({ mode = "corner" }) => {
  const frame = useCurrentFrame(); const { width, height, fps, durationInFrames } = useVideoConfig();
  const t = frame / fps; const k = frame / Math.max(1, durationInFrames);
  const T = useMemo(() => ({
    concrete: canvasTex((c, W, H) => { c.fillStyle = "#8d8a83"; c.fillRect(0, 0, W, H); dots(c, W, H, 3, 900, "#6f6b64", 1, 3, 0.6); dots(c, W, H, 9, 300, "#a8a59e", 1, 3, 0.5); for (let i = 1; i < 4; i++) { c.fillStyle = "rgba(60,58,54,0.5)"; c.fillRect(0, (i * H) / 4, W, 3); } }, 512, 512, [2, 1]),
    earth: canvasTex((c, W, H) => { c.fillStyle = "#4a3624"; c.fillRect(0, 0, W, H); dots(c, W, H, 5, 1400, "#2f2215", 1, 4, 0.7); dots(c, W, H, 11, 500, "#6b5137", 2, 6, 0.6); dots(c, W, H, 17, 60, "#8a8174", 4, 10, 0.8); }, 512, 512, [2, 2]),
    foam: canvasTex((c, W, H) => { c.fillStyle = "#e8a7b4"; c.fillRect(0, 0, W, H); for (let i = 0; i < W; i += 64) { c.fillStyle = "rgba(120,60,70,0.35)"; c.fillRect(i, 0, 3, H); } dots(c, W, H, 21, 300, "#f5c6cf", 1, 2, 0.5); }, 512, 512, [2, 1]),
    stud: canvasTex((c, W, H) => { c.fillStyle = "#c79b62"; c.fillRect(0, 0, W, H); for (let i = 0; i < 30; i++) { c.strokeStyle = `rgba(110,70,30,${0.2 + rnd(i) * 0.3})`; c.beginPath(); c.moveTo(0, rnd(i * 3) * H); c.lineTo(W, rnd(i * 3 + 1) * H); c.stroke(); } }, 128, 512),
    floor: canvasTex((c, W, H) => { c.fillStyle = "#77736b"; c.fillRect(0, 0, W, H); dots(c, W, H, 31, 800, "#5e5a53", 1, 3, 0.5); }, 512, 512, [3, 3]),
  }), []);
  const soft = softTex();
  // cámara: cada modo mira otra cosa, órbita lenta, nunca vuelve a 0
  const base = mode === "earth" ? 2.35 : mode === "vents" ? 0.9 : mode === "tour" ? 0.4 : 0.7;
  const ang = base + (mode === "tour" ? k * 1.6 : k * 0.45);
  const dist = mode === "vents" ? 5.2 : 6.6 - k * 0.8;
  const pos: V3 = [Math.sin(ang) * dist, mode === "earth" ? 2.6 : 3.4 - k * 0.4, Math.cos(ang) * dist];
  const look: V3 = [0.2, mode === "vents" ? 1.0 : 1.1, 0.2];
  const L = 3, Hh = 2.4; // cuarto de 3x3 m, 2,4 m de alto; esquina en (-L/2,-L/2)
  const box = (key: any, p: V3, s: V3, mat: React.ReactNode, r: V3 = [0, 0, 0]) => <mesh key={key} position={p} rotation={r}><boxGeometry args={s} />{mat}</mesh>;
  // partículas del aire: frío entra por el caño bajo (x=-1.5, y=0.3), cruza el piso, sube al calentarse y sale por el alto
  const N = 46;
  const air = Array.from({ length: N }, (_, i) => {
    const ph = (t * 0.12 + i / N) % 1;
    const sx = -L / 2 - 0.6, sy = 0.3, sz = -0.6;
    const ex = -L / 2 - 0.6, ey = 2.15, ez = 0.8;
    let x: number, y: number, z: number;
    if (ph < 0.25) { const q = ph / 0.25; x = sx + q * 1.4; y = sy; z = sz; }
    else if (ph < 0.65) { const q = (ph - 0.25) / 0.4; x = -L / 2 + 0.8 + q * 1.4; y = 0.25 + q * 0.6; z = -0.6 + q * 1.6; }
    else { const q = (ph - 0.65) / 0.35; x = -L / 2 + 2.2 - q * 2.8; y = 0.85 + q * 1.3; z = 1.0 - q * 0.2; }
    const warm = ph > 0.5;
    return <sprite key={i} position={[x, y, z]} scale={[0.22, 0.22, 0.22]}><spriteMaterial map={soft} color={warm ? "#FFB070" : "#8EC5FF"} transparent opacity={0.55 * Math.sin(Math.PI * ph)} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>;
  });
  const showAir = mode === "vents" || mode === "tour";
  const earthGlow = mode === "earth" ? 0.6 + 0.4 * Math.sin(t * 2) : 0;
  const labels: { x: number; y: number; t: string; s?: string; at: number }[] =
    mode === "earth" ? [{ x: 120, y: 120, t: "the cold earth", s: "don't insulate these two walls", at: 0.5 }]
    : mode === "vents" ? [{ x: 120, y: 760, t: "cold air in · low", at: 0.4 }, { x: 120, y: 160, t: "warm air out · high", at: 1.4 }]
    : mode === "tour" ? [{ x: 120, y: 120, t: "1 · basement corner", at: 0.3 }, { x: 120, y: 230, t: "2 · buried barrel", at: 1.3 }, { x: 120, y: 340, t: "3 · garage cooler box", at: 2.3 }]
    : [{ x: 120, y: 120, t: "coldest corner · north or east", s: "two outside walls, away from the furnace", at: 0.4 }];
  return (
    <AbsoluteFill style={{ background: "#0f0c09" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 34, position: pos, near: 0.1, far: 60 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <CamRig pos={pos} look={look} />
        <color attach="background" args={["#0f0c09"]} />
        <fog attach="fog" args={["#1a140e", 10, 24]} />
        <hemisphereLight args={["#9aa3b0", "#2a1d10", 1.0]} />
        <pointLight position={[0.3, 2.1, 0.3]} color="#FFD7A0" intensity={14 * flick(frame, 3, 0.3)} distance={7} decay={1.5} />
        <directionalLight position={[4, 6, 5]} intensity={0.8} color="#E8EEF5" />
        {/* tierra alrededor de las dos paredes exteriores (cortada para verla) */}
        {box("e1", [-L / 2 - 0.9, Hh / 2 - 0.2, 0], [1.4, Hh + 0.4, L + 1.6], <meshStandardMaterial map={T.earth} roughness={1} emissive="#3a6aa8" emissiveIntensity={earthGlow * 0.25} />)}
        {box("e2", [0, Hh / 2 - 0.2, -L / 2 - 0.9], [L + 0.4, Hh + 0.4, 1.4], <meshStandardMaterial map={T.earth} roughness={1} emissive="#3a6aa8" emissiveIntensity={earthGlow * 0.25} />)}
        {/* paredes de cimiento (sin aislar) */}
        {box("c1", [-L / 2 - 0.1, Hh / 2, 0], [0.2, Hh, L], <meshStandardMaterial map={T.concrete} roughness={0.95} />)}
        {box("c2", [0, Hh / 2, -L / 2 - 0.1], [L, Hh, 0.2], <meshStandardMaterial map={T.concrete} roughness={0.95} />)}
        {/* paredes interiores: montantes + espuma (la de enfrente medio transparente: es un corte) */}
        {[0, 1, 2, 3, 4].map((i) => box("s" + i, [L / 2, Hh / 2, -L / 2 + 0.15 + i * 0.68], [0.09, Hh, 0.09], <meshStandardMaterial map={T.stud} />))}
        {box("f1", [L / 2 + 0.06, Hh / 2, 0], [0.06, Hh, L], <meshStandardMaterial map={T.foam} transparent opacity={0.55} />)}
        {box("f2", [0, Hh / 2, L / 2 + 0.06], [L, Hh, 0.06], <meshStandardMaterial map={T.foam} transparent opacity={0.35} />)}
        {/* puerta aislada (en la pared de espuma) */}
        {box("door", [L / 2 + 0.1, 1.0, 0.8], [0.08, 2.0, 0.8], <meshStandardMaterial color="#7a5a38" roughness={0.9} />)}
        {/* piso */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}><planeGeometry args={[L + 3, L + 3]} /><meshStandardMaterial map={T.floor} roughness={1} /></mesh>
        {/* estantes de listones con cajones de papas y manzanas, despegados del cemento */}
        {[0.35, 1.0, 1.65].map((y, r) => (
          <group key={r}>
            {box("sh" + r, [-L / 2 + 0.55, y, -0.3], [0.7, 0.05, 2.0], <meshStandardMaterial color="#9b7446" roughness={0.9} />)}
            {[0, 1, 2].map((c) => (
              <group key={c} position={[-L / 2 + 0.55, y + 0.15, -1.0 + c * 0.7]}>
                {box("cr" + r + c, [0, 0, 0], [0.5, 0.25, 0.55], <meshStandardMaterial color="#b58b55" roughness={0.9} />)}
                {Array.from({ length: 6 }, (_, q) => <mesh key={q} position={[(rnd(r * 9 + c * 3 + q) - 0.5) * 0.36, 0.14, (rnd(q * 7 + r) - 0.5) * 0.4]}><sphereGeometry args={[0.07, 10, 8]} /><meshStandardMaterial color={r === 2 ? "#a3312a" : "#b58a55"} roughness={0.8} /></mesh>)}
              </group>
            ))}
          </group>
        ))}
        {/* los dos caños de ventilación atravesando la pared de cimiento: uno abajo (entra), uno arriba (sale) */}
        <mesh position={[-L / 2 - 0.5, 0.3, -0.6]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 1.4, 16]} /><meshStandardMaterial color="#c9ccd0" metalness={0.6} roughness={0.4} emissive="#4a8ad8" emissiveIntensity={mode === "vents" ? 0.35 : 0} /></mesh>
        <mesh position={[-L / 2 - 0.5, 2.15, 0.8]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 1.4, 16]} /><meshStandardMaterial color="#c9ccd0" metalness={0.6} roughness={0.4} emissive="#d8823a" emissiveIntensity={mode === "vents" ? 0.35 : 0} /></mesh>
        {showAir ? air : null}
        <Motes frame={frame} center={[0, 1.2, 0]} span={[3, 2.2, 3]} n={50} seed={7} opacity={0.35} size={0.03} />
      </ThreeCanvas>
      {labels.map((l, i) => (
        <div key={i} style={{ position: "absolute", left: l.x, top: l.y, opacity: interpolate(t, [l.at, l.at + 0.3], [0, 1], CL), transform: `translateY(${interpolate(t, [l.at, l.at + 0.4], [16, 0], CL)}px)`, background: "rgba(244,235,211,0.93)", padding: "14px 26px", borderRadius: 4, boxShadow: "0 10px 20px rgba(0,0,0,0.45)" }}>
          <div style={{ fontFamily: HAND, fontSize: 56, color: "#2e2a22", fontWeight: 700 }}>{l.t}</div>
          {l.s ? <div style={{ fontFamily: HAND, fontSize: 36, color: "#8e2b2b" }}>{l.s}</div> : null}
        </div>
      ))}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(5,3,0,0.6) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ───────────────────────────── LarThermo
export const LarThermo: React.FC<{ mode?: string; lo: number; hi: number; marks?: { v: number; t: string }[]; bed?: string }> = ({ mode = "intro", lo, hi, marks = [], bed = "img/ollarder2/bed_door.jpg" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const out = interpolate(f, [durationInFrames - 7, durationInFrames], [1, 0], CL);
  const jerky = mode === "jerky";
  const vmin = jerky ? 60 : 20, vmax = jerky ? 180 : 70;
  const Y0 = 860, Y1 = 170; const yv = (v: number) => Y0 - ((v - vmin) / (vmax - vmin)) * (Y0 - Y1);
  const rise = interpolate(t, [0.3, 1.8], [0, 1], { ...CL, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const cur = jerky ? vmin + (160 - vmin) * rise : lo + (hi - lo) * (0.5 + 0.5 * Math.sin(t * 1.2)) * rise + (1 - rise) * vmin;
  const zone = (a: number, b: number, c: string) => <div style={{ position: "absolute", left: 0, width: 160, top: yv(b), height: yv(a) - yv(b), background: c }} />;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Scene src={bed} push={0.05} />
      <AbsoluteFill style={{ perspective: 2000 }}>
        {/* la tabla del termómetro atornillada a la puerta */}
        <div style={{ position: "absolute", left: 720, top: 90, width: 300, height: 900, borderRadius: 16, background: "linear-gradient(90deg,#e9e2cf,#f7f2e3 50%,#ddd4bd)", boxShadow: "0 24px 40px rgba(0,0,0,0.5)", transform: "rotateY(-8deg) rotate(1deg)" }}>
          {[24, 876].map((y) => <div key={y} style={{ position: "absolute", left: 140, top: y - 8, width: 16, height: 16, borderRadius: 8, background: "#7b7b7b" }} />)}
          <div style={{ position: "absolute", left: 70, top: 0, width: 160, height: "100%" }}>
            {!jerky ? <>{zone(32, 45, "rgba(90,150,220,0.16)")}{zone(45, 55, "rgba(230,190,90,0.14)")}</> : zone(158, 162, "rgba(210,80,60,0.18)")}
          </div>
          {/* escala */}
          {Array.from({ length: (vmax - vmin) / 5 + 1 }, (_, i) => vmin + i * 5).map((v) => (
            <div key={v} style={{ position: "absolute", left: 40, top: yv(v) - 10, width: 220, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ width: v % 10 === 0 ? 34 : 18, height: 3, background: "#3a3a3a" }} />
              {v % 10 === 0 ? <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#2a2a2a" }}>{v}°</div> : null}
            </div>
          ))}
          {/* tubo y columna */}
          <div style={{ position: "absolute", left: 136, top: Y1 - 30, width: 28, height: Y0 - Y1 + 90, borderRadius: 14, background: "rgba(255,255,255,0.7)", boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.25)" }} />
          <div style={{ position: "absolute", left: 142, top: yv(cur), width: 16, height: Y0 + 40 - yv(cur), borderRadius: 8, background: "linear-gradient(90deg,#9a1d18,#e0473c,#9a1d18)" }} />
          <div style={{ position: "absolute", left: 124, top: Y0 + 30, width: 52, height: 52, borderRadius: 26, background: "radial-gradient(circle at 35% 35%,#ff7a6a,#b0241c)" }} />
          {/* marcadores azules de mínima y máxima */}
          {!jerky ? [lo, hi].map((v, i) => <div key={i} style={{ position: "absolute", left: 128, top: yv(v) - 4, width: 44, height: 8, borderRadius: 3, background: "#2f5d8a", opacity: interpolate(t, [1.9 + i * 0.3, 2.2 + i * 0.3], [0, 1], CL) }} />) : null}
        </div>
        {/* tiza sobre la puerta al costado del termómetro */}
        <div style={{ position: "absolute", left: 1080, top: yv(jerky ? 160 : (lo + hi) / 2) - 40, fontFamily: HAND, fontSize: 70, color: "rgba(250,248,240,0.94)", textShadow: "0 0 3px rgba(0,0,0,0.6)", clipPath: reveal(interpolate(t, [1.0, 1.8], [0, 100], CL)), whiteSpace: "nowrap" }}>{jerky ? "160°F first" : `${lo}–${hi}°F`}</div>
        {marks.map((m, i) => (
          <div key={i} style={{ position: "absolute", left: 1080, top: yv(m.v) - 30, fontFamily: HAND, fontSize: 50, color: "#F3C46B", textShadow: "0 0 3px rgba(0,0,0,0.7)", clipPath: reveal(interpolate(t, [2.0 + i * 0.6, 2.6 + i * 0.6], [0, 100], CL)), whiteSpace: "nowrap" }}>← {m.v}°: {m.t}</div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────────── LarDoorTag
export const LarDoorTag: React.FC<{ title: string; sub: string; page: string; cta?: boolean; qr?: string; bed?: string }> = ({ title, sub, page, cta = false, qr, bed = "img/ollarder2/bed_door.jpg" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const out = interpolate(f, [durationInFrames - 7, durationInFrames], [1, 0], CL);
  const p = spring({ frame: f, fps, config: { damping: 13, stiffness: 130 } });
  const W = cta ? 1300 : 1100, H = cta ? 760 : 520;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Scene src={bed} push={0.06} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 2000 }}>
        <div style={{ width: W, height: H, position: "relative", transform: `rotateY(-6deg) rotate(${cta ? -0.8 : -2}deg) translateX(${(1 - p) * 900}px)`, background: "#F4EBD3", backgroundImage: `repeating-linear-gradient(0deg, transparent 0 58px, ${hexA("#6F8FB0", 0.3)} 58px 60px), radial-gradient(ellipse at 20% 80%, rgba(140,100,50,0.16), transparent 30%)`, borderRadius: 4, boxShadow: "0 26px 44px rgba(0,0,0,0.5)" }}>
          {[[40, 30], [W - 54, 30], [40, H - 44], [W - 54, H - 44]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 14, height: 14, borderRadius: 7, background: "#4a4a4a", boxShadow: "0 0 0 3px #2b2b2b" }} />)}
          {!cta ? (
            <div style={{ position: "absolute", left: 80, top: 70, right: 80 }}>
              <div style={{ fontFamily: LABEL, fontSize: 26, letterSpacing: 6, color: OLE.mute }}>THE WINTER LARDER</div>
              <div style={{ fontFamily: HAND, fontSize: title.length > 26 ? 76 : 92, color: "#2e2a22", fontWeight: 700, marginTop: 10, clipPath: reveal(interpolate(t, [0.3, 1.2], [0, 100], CL)), whiteSpace: "nowrap" }}>{title}</div>
              <div style={{ fontFamily: HAND, fontSize: 54, color: OLE.forest, marginTop: 14, opacity: interpolate(t, [1.1, 1.4], [0, 1], CL) }}>{sub}</div>
              <div style={{ position: "absolute", right: 0, top: 300, fontFamily: HAND, fontSize: 64, color: "#8e2b2b", fontWeight: 700, opacity: interpolate(t, [1.4, 1.7], [0, 1], CL), transform: "rotate(-4deg)" }}>{page}</div>
            </div>
          ) : (
            <>
              <div style={{ position: "absolute", left: 80, top: 70, width: 700 }}>
                <div style={{ fontFamily: LABEL, fontSize: 28, letterSpacing: 7, color: OLE.mute }}>OLE'S LITTLE CELLAR BOOK</div>
                <div style={{ fontFamily: HAND, fontSize: 96, color: "#2e2a22", fontWeight: 700, marginTop: 14, lineHeight: 1 }}>{title}</div>
                <div style={{ fontFamily: HAND, fontSize: 50, color: OLE.forest, marginTop: 26, lineHeight: 1.15 }}>{sub}</div>
                <div style={{ fontFamily: HAND, fontSize: 50, color: "#8e2b2b", marginTop: 26, lineHeight: 1.15 }}>{page}</div>
              </div>
              {qr ? (
                <div style={{ position: "absolute", right: 80, top: 110, background: "#FBF7EE", padding: 20, borderRadius: 4, boxShadow: "0 6px 14px rgba(0,0,0,0.25)" }}>
                  <Img src={staticFile(qr)} style={{ width: 420, height: 420, imageRendering: "pixelated", display: "block" }} />
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#2a2a2a", textAlign: "center", marginTop: 10 }}>Point your phone here</div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────────── LarZones
export const LarZones: React.FC<{ mode?: "rule" | "three" | "apple" | "order"; bed?: string }> = ({ mode = "three", bed = "img/ollarder2/bed_shelves.jpg" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const out = interpolate(f, [durationInFrames - 7, durationInFrames], [1, 0], CL);
  const H1: React.CSSProperties = { fontFamily: HAND, fontSize: 58, fontWeight: 700, color: "#2e2a22", lineHeight: 1 };
  const H2: React.CSSProperties = { fontFamily: HAND, fontSize: 40, color: OLE.forest, lineHeight: 1.15, marginTop: 8 };
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Scene src={bed} push={0.05} />
      {mode === "rule" ? (
        <PinTag x={560} y={300} w={800} at={0.2}><div style={{ ...H1, fontSize: 72 }}>A cellar is any spot</div><div style={{ ...H2, fontSize: 52 }}>between freezing and about 45°F · dark · a little moisture in the air</div></PinTag>
      ) : null}
      {mode === "three" ? <>
        <PinTag x={140} y={720} w={600} rot={-2} at={0.3} tone="#E3EEF4"><div style={H1}>COLD & DAMP</div><div style={H2}>potatoes · carrots in sand · cabbage · apples</div></PinTag>
        <PinTag x={760} y={420} w={500} rot={2} at={1.1} tone="#F1EBD8"><div style={H1}>COLD & DRY</div><div style={H2}>onions · garlic, hung where the air moves</div></PinTag>
        <PinTag x={1290} y={150} w={520} rot={-3} at={1.9} tone="#F6E2C6"><div style={H1}>WARM & DRY</div><div style={H2}>squash · pumpkins · sweet potatoes</div></PinTag>
      </> : null}
      {mode === "apple" ? (
        <AbsoluteFill>
          <svg width="1920" height="1080" style={{ position: "absolute" }}>
            {[0, 1, 2].map((i) => { const p = interpolate(t, [0.6 + i * 0.3, 1.6 + i * 0.3], [0, 1], CL); return <path key={i} d={`M 1300 ${230 + i * 20} C 1100 ${380 + i * 60}, 700 ${520 + i * 40}, 420 ${800 + i * 20}`} stroke="#F3C46B" strokeWidth="7" fill="none" strokeDasharray="12 16" opacity={0.85 * p} strokeDashoffset={-t * 40} />; })}
          </svg>
          <PinTag x={1180} y={60} w={560} rot={2} at={0.2}><div style={H1}>ripening gas</div><div style={H2}>from one apple…</div></PinTag>
          <PinTag x={200} y={820} w={640} rot={-2} at={1.6}><div style={H1}>…sprouts the potatoes</div><div style={H2}>apples get their own room</div></PinTag>
        </AbsoluteFill>
      ) : null}
      {mode === "order" ? <>
        <PinTag x={1290} y={140} w={520} rot={-2} at={0.3} tone="#F6E2C6"><div style={H1}>1 · eat first</div><div style={H2}>acorn squash · bruised apples · thick-necked onions</div></PinTag>
        <PinTag x={760} y={430} w={500} rot={2} at={1.2}><div style={H1}>2 · then</div><div style={H2}>cabbage · celery</div></PinTag>
        <PinTag x={140} y={730} w={620} rot={-2} at={2.1} tone="#E3EEF4"><div style={H1}>3 · last of all</div><div style={H2}>potatoes · carrots in sand · Hubbard · dried goods</div></PinTag>
      </> : null}
    </AbsoluteFill>
  );
};
