// Kit Rhonda · MANCHAS AMARILLAS DEL COLCHÓN (rhmattress). Todo dentro del mundo: perspectiva, sombra, luz de ventana, movimiento
// hasta el último cuadro.
//   RhMattress3D     el colchón en corte en 3D (three.js): "layers" funda acolchada / espuma de confort / núcleo con la mancha
//                    arriba · "soak" el agua baja y se abre de costado (el anillo crece) · "mist" sólo la capa de arriba se humedece
//                    y se seca
//   RhDampMeter      "húmedo, no mojado": la mano aprieta y la aguja se queda en DAMP (la zona SOAKED en rojo)
//   RhDryTimer       ventilador girando + reloj de 1 a 3 h + barra de humedad que baja y el polvo blanco que aparece
//   RhCornerTest     la esquina del colchón en perspectiva, un rocío, 10 minutos y el veredicto (blanco OK / tela de color = parar)
//   RhPressureBottle la botella con tapa apretada: el manómetro sube, la botella se hincha · al lado la tapa floja, sin presión
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { RH, LABEL, SERIF, HAND, rnd, clamp01 } from "./RhTheme";
import { lin, pop, useOut, Stamp } from "./RhParts";

const Cam: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.set(pos[0], pos[1], pos[2]); camera.lookAt(target[0], target[1], target[2]); camera.updateProjectionMatrix(); return null;
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

// ── el colchón en corte, 3D ─────────────────────────────────────────────────────────────────────────────────────────────────────
// capas (alto en unidades): funda acolchada 0,35 · confort 0,55 · núcleo 1,1; ancho 6, fondo 3,4. El corte mira a cámara.
const LAY = [{ h: 1.1, c: "#E9E2D2", n: "Support core" }, { h: 0.55, c: "#F3EEE3", n: "Comfort foam" }, { h: 0.35, c: "#FFFFFF", n: "Quilted cover" }];
export const RhMattress3D: React.FC<{ mode?: "layers" | "soak" | "mist"; bed?: string; labels?: { cover?: string; foam?: string; core?: string; ring?: string } }> = ({ mode = "layers", bed, labels = {} }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const a = interpolate(f, [0, T], [-0.42, -0.12]), dist = interpolate(f, [0, T], [11.5, 10.2]);
  const pos: [number, number, number] = [Math.sin(a) * dist, 4.2 + 0.6 * f / T, Math.cos(a) * dist];
  const k = lin(f, 10, T * 0.8);
  // agua: "soak" baja por las 3 capas y se abre; "mist" sólo moja la funda y después se va (se seca)
  const depth = mode === "soak" ? 0.2 + 1.7 * k : mode === "mist" ? 0.3 * clamp01(k / 0.35) : 0; // desde arriba hacia abajo
  const spread = mode === "soak" ? 1.0 + 1.6 * k : 0.9;
  const wet = mode === "mist" ? 1 - clamp01((k - 0.5) / 0.4) : 1;
  const yTop = 2.0;
  const stainR = mode === "soak" ? 0.9 + 1.1 * k : 0.9;
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: RH.white }}>
      <Bed src={bed} f={f} T={T} blur={14} veil={0.4} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 22% 12%, rgba(255,250,236,0.8), rgba(251,248,242,0.25) 55%, rgba(30,42,54,0.2) 100%)" }} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: pos }} gl={{ antialias: true }}>
        <Cam pos={pos} target={[0, 0.9, 0]} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[-6, 9, 6]} intensity={1.25} color="#FFF3DE" />
        <directionalLight position={[6, 3, 7]} intensity={0.35} color="#DCE9F5" />
        {/* piso */}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[30, 20]} /><meshStandardMaterial color="#E4DCCD" roughness={1} /></mesh>
        {/* capas */}
        {LAY.map((l, i) => { const y0 = LAY.slice(0, i).reduce((s, x) => s + x.h, 0);
          return <mesh key={i} position={[0, y0 + l.h / 2, 0]}><boxGeometry args={[6, l.h, 3.4]} /><meshStandardMaterial color={l.c} roughness={0.92} /></mesh>; })}
        {/* acolchado: botones en la funda */}
        {Array.from({ length: 15 }, (_, i) => <mesh key={i} position={[-2.5 + (i % 5) * 1.25, yTop + 0.005, -1.2 + Math.floor(i / 5) * 1.2]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.06, 12]} /><meshStandardMaterial color="#D8D2C4" /></mesh>)}
        {/* la mancha amarilla arriba (sobre la cara superior) */}
        <mesh position={[0.2, yTop + 0.01, 0.1]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[stainR, 48]} /><meshStandardMaterial color="#D9B65C" transparent opacity={mode === "mist" ? 0.55 * (1 - 0.7 * clamp01((k - 0.55) / 0.35)) : 0.6} /></mesh>
        {/* el agua dentro del corte (frente, z = 1.7): una lámina azul que baja */}
        {depth > 0 ? <mesh position={[0.2, yTop - depth / 2, 1.705]}><planeGeometry args={[spread * 2, depth]} /><meshStandardMaterial color="#6FA8D6" transparent opacity={0.65 * wet} /></mesh> : null}
        {depth > 0 && mode === "soak" ? <mesh position={[0.2, yTop - depth + 0.02, 1.71]}><planeGeometry args={[spread * 2.3, 0.12]} /><meshStandardMaterial color="#A8834A" transparent opacity={0.7 * clamp01((k - 0.35) / 0.3)} /></mesh> : null}
      </ThreeCanvas>
      {/* rótulos fijos a la izquierda, con línea hacia cada capa */}
      {[{ t: labels.cover || "Quilted cover · the stain is here", y: 0.37 }, { t: labels.foam || "Comfort foam", y: 0.5 }, { t: labels.core || "Support core", y: 0.64 }].map((r, i) => (
        <div key={i} style={{ position: "absolute", left: 90, top: r.y * height, opacity: lin(f, 6 + i * 6, 16 + i * 6), translate: `${(1 - lin(f, 6 + i * 6, 16 + i * 6)) * -60}px 0`,
          background: i === 0 ? RH.blueDeep : RH.white, color: i === 0 ? "#fff" : RH.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 38, padding: "6px 18px", borderRadius: 10, boxShadow: `0 10px 22px ${RH.shadow}` }}>{r.t}</div>))}
      {mode === "soak" ? <Chip txt={labels.ring || "Soaked: the ring gets bigger"} bg={RH.red} style={{ right: 100, top: 90, opacity: lin(f, T * 0.45, T * 0.55) }} /> : null}
      {mode === "mist" ? <Chip txt={labels.ring || "Damp, top layer only"} bg={RH.blue} style={{ right: 100, top: 90, opacity: lin(f, T * 0.3, T * 0.4) }} /> : null}
    </AbsoluteFill>
  );
};

// ── húmedo, no mojado: la mano aprieta, la aguja queda en DAMP ──────────────────────────────────────────────────────────────────
export const RhDampMeter: React.FC<{ bed?: string; stamp?: string; over?: boolean }> = ({ bed, stamp = "DAMP, NOT WET", over = false }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const k = lin(f, 8, T * 0.6), target = over ? 0.9 : 0.5, v = target * Math.min(1, k * 1.15) - (over ? 0 : 0.06 * Math.max(0, k * 1.15 - 1)) + 0.01 * Math.sin(f / 3);
  const ang = -90 + 180 * v, press = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: RH.white }}>
      <Bed src={bed} f={f} T={T} blur={10} veil={0.3} />
      <AbsoluteFill style={{ perspective: 1400 }}>
        <div style={{ position: "absolute", left: "50%", top: "52%", width: 1100, height: 640, translate: "-50% -50%", transform: `rotateX(${16 - 5 * f / T}deg) rotateY(${-8 + 8 * f / T}deg) scale(${1 + 0.05 * f / T})`, background: "#FBF8F2", borderRadius: 28, boxShadow: "0 60px 70px rgba(20,25,30,0.35)" }}>
          <svg width={1100} height={640} style={{ position: "absolute", inset: 0 }}>
            {/* arco con 3 zonas */}
            {[["#D6E4EE", -90, -30, "DRY"], ["#BFDCC4", -30, 30, "DAMP"], ["#F0B7AE", 30, 90, "SOAKED"]].map(([c, a0, a1, n], i) => {
              const r = 330, cx = 550, cy = 500, p = (a: number) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
              const [x0, y0] = p(a0 as number), [x1, y1] = p(a1 as number), [xm, ym] = [cx + 250 * Math.sin(((a0 as number) + (a1 as number)) / 2 * Math.PI / 180), cy - 250 * Math.cos(((a0 as number) + (a1 as number)) / 2 * Math.PI / 180)];
              return <g key={i}><path d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`} stroke={c as string} strokeWidth={70} fill="none" />
                <text x={xm} y={ym} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={40} fill={i === 2 ? RH.red : RH.ink}>{n}</text></g>; })}
            <g transform={`translate(550 500) rotate(${ang})`}><line x1={0} y1={30} x2={0} y2={-300} stroke="#1F2A33" strokeWidth={12} strokeLinecap="round" /></g>
            <circle cx={550} cy={500} r={30} fill="#1F2A33" />
          </svg>
          {/* la mano: un guante amarillo que aprieta y se levanta */}
          <div style={{ position: "absolute", left: 870, top: 380 + 30 * press, width: 150, height: 170, borderRadius: "60px 60px 40px 40px", background: "linear-gradient(160deg,#FFE15A,#E8B91C)", boxShadow: `0 ${30 - 20 * press}px 30px rgba(0,0,0,0.25)` }} />
          <div style={{ position: "absolute", left: 830, top: 575, fontFamily: HAND, fontSize: 44, color: RH.ink }}>hand comes up dry</div>
        </div>
      </AbsoluteFill>
      <Stamp text={over ? "TOO WET" : stamp} at={Math.round(T * 0.66)} color={over ? RH.red : RH.blue} x="70%" y="18%" rot={-7} size={80} />
    </AbsoluteFill>
  );
};

// ── secado: ventilador + reloj + humedad que baja + el polvo blanco ────────────────────────────────────────────────────────────
export const RhDryTimer: React.FC<{ bed?: string; hours?: string; powder?: string }> = ({ bed, hours = "1 to 3 hours", powder = "White powder = done" }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const k = lin(f, 8, T * 0.85), moist = 1 - k, pw = clamp01((k - 0.7) / 0.25);
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: RH.white }}>
      <Bed src={bed} f={f} T={T} blur={10} veil={0.28} />
      <AbsoluteFill style={{ perspective: 1500 }}>
        <div style={{ position: "absolute", left: "50%", top: "54%", width: 1500, height: 720, translate: "-50% -50%", transform: `rotateX(${12 - 4 * f / T}deg) rotateY(${6 - 8 * f / T}deg) scale(${1 + 0.05 * f / T})` }}>
          {/* ventilador */}
          <div style={{ position: "absolute", left: 40, top: 60, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,#F7F7F4 30%,#DADAD5)", boxShadow: "0 50px 60px rgba(20,25,30,0.32)" }}>
            <svg width={520} height={520} style={{ position: "absolute", inset: 0 }}>
              <g transform={`translate(260 260) rotate(${f * 38})`} opacity={0.88}>
                {[0, 120, 240].map((r) => <path key={r} transform={`rotate(${r})`} d="M 0 0 C 60 -40 170 -60 200 -10 C 170 30 70 30 0 0 Z" fill="#9FB7C9" />)}
              </g>
              <circle cx={260} cy={260} r={36} fill="#5E7486" />
              {Array.from({ length: 12 }, (_, i) => <line key={i} x1={260} y1={260} x2={260 + 250 * Math.cos(i * Math.PI / 6)} y2={260 + 250 * Math.sin(i * Math.PI / 6)} stroke="#B9B9B3" strokeWidth={4} />)}
              <circle cx={260} cy={260} r={250} stroke="#B9B9B3" strokeWidth={10} fill="none" />
            </svg>
            {/* aire */}
            {Array.from({ length: 5 }, (_, i) => { const ph = (f / 24 + i / 5) % 1; return <div key={i} style={{ position: "absolute", left: 520 + ph * 420, top: 140 + i * 60, width: 120, height: 8, borderRadius: 4, background: "#9FB7C9", opacity: (1 - ph) * 0.7 }} />; })}
          </div>
          {/* reloj */}
          <div style={{ position: "absolute", left: 980, top: 40, width: 420, height: 420, borderRadius: "50%", background: "#FFFFFF", border: "18px solid #1F2A33", boxShadow: "0 40px 50px rgba(20,25,30,0.3)" }}>
            <svg width={384} height={384} style={{ position: "absolute", inset: 0 }}>
              <path d={`M 192 192 L 192 22 A 170 170 0 ${k > 0.5 ? 1 : 0} 1 ${192 + 170 * Math.sin(k * 2 * Math.PI * 0.75)} ${192 - 170 * Math.cos(k * 2 * Math.PI * 0.75)} Z`} fill="#BFDCC4" />
              <g transform={`translate(192 192) rotate(${k * 270})`}><line x1={0} y1={10} x2={0} y2={-150} stroke={RH.red} strokeWidth={10} strokeLinecap="round" /></g>
              <circle cx={192} cy={192} r={16} fill="#1F2A33" />
            </svg>
          </div>
          <div style={{ position: "absolute", left: 980, top: 480, width: 420, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: RH.ink }}>{hours}</div>
          {/* barra de humedad */}
          <div style={{ position: "absolute", left: 620, top: 600, width: 760, height: 56, borderRadius: 28, background: "#E6E2DA", overflow: "hidden", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.15)" }}>
            <div style={{ width: `${8 + 92 * moist}%`, height: "100%", background: "linear-gradient(90deg,#6FA8D6,#9CC5E6)" }} />
          </div>
          <div style={{ position: "absolute", left: 620, top: 548, fontFamily: LABEL, fontWeight: 700, fontSize: 38, color: RH.inkSoft }}>MOISTURE</div>
        </div>
      </AbsoluteFill>
      <Chip txt={powder} bg={RH.blue} style={{ left: "50%", bottom: 70, translate: "-50% 0", opacity: pw, scale: String(0.9 + 0.1 * pw) }} />
    </AbsoluteFill>
  );
};

// ── la prueba de la esquina ─────────────────────────────────────────────────────────────────────────────────────────────────────
export const RhCornerTest: React.FC<{ bed?: string; fabric?: "white" | "color"; verdict?: string }> = ({ bed, fabric = "white", verdict }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const sp = lin(f, 8, 20), tk = lin(f, 20, T * 0.7), vp = pop(f, fps, T * 0.72, 12);
  const top = fabric === "white" ? "#FFFFFF" : "#8E99A6";
  const patch = fabric === "white" ? 0 : 0.55 * tk; // en tela de color el anillo se aclara
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: RH.white }}>
      <Bed src={bed} f={f} T={T} blur={10} veil={0.28} />
      <AbsoluteFill style={{ perspective: 1300 }}>
        <div style={{ position: "absolute", left: "52%", top: "58%", width: 1200, height: 700, translate: "-50% -50%", transform: `rotateX(${58 - 6 * f / T}deg) rotateZ(${-24 + 6 * f / T}deg) scale(${1 + 0.06 * f / T})`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: fabric === "white" ? "radial-gradient(circle at 30% 30%,#FFFFFF,#EEEAE1)" : `repeating-linear-gradient(45deg,${top} 0 26px,#7D8895 26px 52px)`, boxShadow: "0 80px 70px rgba(20,25,30,0.35)" }} />
          {/* costura del borde */}
          <div style={{ position: "absolute", inset: 18, borderRadius: 30, border: "4px dashed rgba(120,110,95,0.45)" }} />
          {/* el parche probado, abajo a la derecha */}
          <div style={{ position: "absolute", right: 90, bottom: 80, width: 230, height: 230, borderRadius: "50%", background: `rgba(255,255,255,${patch})`, boxShadow: sp > 0 ? `0 0 0 ${6 * sp}px rgba(111,168,214,${0.5 * (1 - tk)})` : "none" }}>
            {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ position: "absolute", left: 115 + (rnd(i) - 0.5) * 200 * sp, top: 115 + (rnd(i + 9) - 0.5) * 200 * sp, width: 12, height: 12, borderRadius: "50%", background: "#6FA8D6", opacity: sp * (1 - tk) }} />)}
          </div>
        </div>
      </AbsoluteFill>
      {/* reloj de 10 min */}
      <div style={{ position: "absolute", left: 110, top: 90, display: "flex", alignItems: "center", gap: 20, background: RH.white, borderRadius: 18, padding: "10px 26px", boxShadow: `0 14px 30px ${RH.shadow}` }}>
        <svg width={80} height={80}><circle cx={40} cy={40} r={34} stroke="#E0DCD3" strokeWidth={10} fill="none" />
          <circle cx={40} cy={40} r={34} stroke={RH.blue} strokeWidth={10} fill="none" strokeDasharray={`${2 * Math.PI * 34 * tk} 999`} transform="rotate(-90 40 40)" /></svg>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: RH.ink }}>{Math.round(10 * tk)} min</div>
      </div>
      <div style={{ position: "absolute", right: 120, top: 100, fontFamily: HAND, fontSize: 60, color: RH.ink, opacity: lin(f, 4, 14) }}>a hidden corner first</div>
      <Chip txt={verdict || (fabric === "white" ? "Same white: go ahead" : "Lighter ring: stop")} bg={fabric === "white" ? RH.blue : RH.red} style={{ left: "50%", bottom: 70, translate: "-50% 0", scale: String(vp), opacity: vp }} />
    </AbsoluteFill>
  );
};

// ── la botella que se infla (tapa apretada) vs la tapa floja ───────────────────────────────────────────────────────────────────
export const RhPressureBottle: React.FC<{ bed?: string; title?: string }> = ({ bed, title = "Never store the mix" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const k = lin(f, 10, T * 0.75), bulge = 1 + 0.12 * k + 0.012 * Math.sin(f / 2) * k, sp = pop(f, fps, T * 0.6, 12);
  const Bottle: React.FC<{ tight: boolean; x: number }> = ({ tight, x }) => {
    const b = tight ? bulge : 1;
    return (
      <div style={{ position: "absolute", left: x, top: 120, width: 380, height: 640 }}>
        {/* cuerpo */}
        <div style={{ position: "absolute", left: 60, top: 190, width: 260, height: 420, borderRadius: "70px 70px 50px 50px", background: "linear-gradient(90deg,#E9EEF2,#FFFFFF 45%,#D3DBE2)", transform: `scaleX(${b})`, boxShadow: "0 40px 40px rgba(20,25,30,0.3)" }}>
          <div style={{ position: "absolute", left: 18, right: 18, bottom: 16, height: 170, borderRadius: "10px 10px 40px 40px", background: "rgba(111,168,214,0.55)" }} />
          {Array.from({ length: 8 }, (_, i) => { const ph = (f / (tight ? 20 : 36) + i / 8) % 1; return <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 160, bottom: 30 + ph * 150, width: 14, height: 14, borderRadius: "50%", border: "3px solid #FFFFFF", opacity: 1 - ph }} />; })}
        </div>
        {/* gatillo + tapa */}
        <div style={{ position: "absolute", left: 120, top: tight ? 110 : 80 + 8 * Math.sin(f / 8), width: 140, height: 90, borderRadius: 14, background: tight ? "#1F2A33" : "#5E7486", rotate: tight ? "0deg" : `${-8 + 3 * Math.sin(f / 10)}deg` }} />
        <div style={{ position: "absolute", left: 250, top: tight ? 120 : 92, width: 90, height: 30, borderRadius: 8, background: tight ? "#1F2A33" : "#5E7486" }} />
        {/* manómetro */}
        <div style={{ position: "absolute", left: 230, top: 10, width: 120, height: 120, borderRadius: "50%", background: "#fff", border: "8px solid #1F2A33" }}>
          <svg width={104} height={104}><g transform={`translate(52 52) rotate(${-120 + (tight ? 230 * k : 10)})`}><line x1={0} y1={6} x2={0} y2={-40} stroke={RH.red} strokeWidth={6} strokeLinecap="round" /></g></svg>
        </div>
        <div style={{ position: "absolute", left: 0, top: 620, width: 380, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: tight ? RH.red : RH.blue }}>{tight ? "CAP TIGHT, PUT AWAY" : "MIXED FRESH, CAP LOOSE"}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden", backgroundColor: RH.white }}>
      <Bed src={bed} f={f} T={T} blur={12} veil={0.35} />
      <AbsoluteFill style={{ perspective: 1500 }}>
        <div style={{ position: "absolute", left: "50%", top: "52%", width: 1300, height: 820, translate: "-50% -50%", transform: `rotateY(${-10 + 10 * f / T}deg) rotateX(4deg) scale(${1 + 0.05 * f / T})` }}>
          <Bottle tight={false} x={120} />
          <Bottle tight x={760} />
        </div>
      </AbsoluteFill>
      <Chip txt={title} bg={RH.red} style={{ left: "50%", top: 60, translate: "-50% 0", scale: String(sp), opacity: sp }} />
    </AbsoluteFill>
  );
};
