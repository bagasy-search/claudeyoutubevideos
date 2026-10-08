// Kit del ep. 4 (mecvinagre: el lavado del sistema de enfriamiento con vinagre) — todo DENTRO del mundo (cama real + luz + sombra).
//   ClRadiator3D  el panal del radiador en corte (three.js): tubitos con el líquido que corre · "clean" corre azul/verde · "scale" el sarro
//                 blanco crece adentro, el líquido se vuelve marrón y casi no pasa · "flush" el vinagre burbujea, el sarro se despega y vuelve a correr
//   ClTempGauge   la aguja de la temperatura del tablero en perspectiva · "traffic" sube por encima del medio (no al rojo) · "fixed" en el medio,
//                 quieta · "red" llega al rojo: para, apaga, espera
//   ClBubbleTest  el depósito de plástico de costado con el líquido · "normal" unas burbujas que paran (aire) · "gasket" burbujas sin parar
//                 como soda (la junta) · "crust" la costra blanca en las paredes y el líquido marrón
//   ClMixJug      la jarra medidora sobre el banco: "mix" 1 parte de vinagre + 4 de agua destilada (las rayas suben y se marca 1 : 4) ·
//                 "timer" el reloj de 15-20 min con la aguja de temperatura y "nunca más de 1 hora"
//   ClHotCap      la tapa del radiador en caliente: termómetro a +100 °C, el manómetro en presión, el vapor y la mano que NO la toca
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, lin, pop, useOut } from "./ClParts";
import { Cam, Tag, Note, Dial } from "./ClMecParts";

const rnd = (s: number) => { const x = Math.sin(s * 127.1) * 43758.5453; return x - Math.floor(x); };

// ── ClRadiator3D ─────────────────────────────────────────────────────────────
const TUBES = 7;
const RadMesh: React.FC<{ crust: number; f: number; flow: number; fluid: THREE.Color; mats: any; fizz: number }> = ({ crust, f, flow, fluid, mats, fizz }) => (
  <group rotation={[0.18, -0.5, 0]}>
    {/* tanques de arriba y abajo */}
    <mesh material={mats.tank} position={[0, 1.85, 0]}><boxGeometry args={[4.6, 0.5, 0.9]} /></mesh>
    <mesh material={mats.tank} position={[0, -1.85, 0]}><boxGeometry args={[4.6, 0.5, 0.9]} /></mesh>
    {Array.from({ length: TUBES }, (_, i) => {
      const x = -1.8 + i * 0.6;
      return (
        <group key={i} position={[x, 0, 0]}>
          {/* tubo (vidrio de corte) */}
          <mesh material={mats.tube}><cylinderGeometry args={[0.2, 0.2, 3.2, 28, 1, true]} /></mesh>
          {/* sarro: anillo blanco que crece hacia adentro */}
          {crust > 0.01 ? <mesh material={mats.crust}><cylinderGeometry args={[0.19, 0.19, 3.1 * (0.4 + 0.6 * crust), 24, 1, true]} /></mesh> : null}
          {crust > 0.01 ? <mesh material={mats.crust} position={[0, -0.2, 0]}><cylinderGeometry args={[0.19 * crust * 0.95, 0.19 * crust * 0.95, 2.2 * crust, 20]} /></mesh> : null}
          {/* el líquido que baja */}
          {Array.from({ length: 6 }, (_, k) => { const t = ((f * 0.02 * flow + k / 6 + i * 0.13) % 1); return <mesh key={k} position={[0, 1.5 - t * 3, 0]}><sphereGeometry args={[0.085 * (1 - crust * 0.6), 12, 12]} /><meshStandardMaterial color={fluid} emissive={fluid} emissiveIntensity={0.25} /></mesh>; })}
          {/* burbujas del vinagre */}
          {fizz > 0 ? Array.from({ length: 4 }, (_, k) => { const t = ((f * 0.035 + k / 4 + i * 0.29) % 1); return <mesh key={"z" + k} position={[(rnd(i * 9 + k) - 0.5) * 0.22, -1.5 + t * 3, (rnd(i * 5 + k) - 0.5) * 0.2]}><sphereGeometry args={[0.035 * fizz, 8, 8]} /><meshStandardMaterial color="#FFFFFF" transparent opacity={0.85} /></mesh>; }) : null}
        </group>
      );
    })}
    {/* aletas */}
    {Array.from({ length: 16 }, (_, j) => <mesh key={j} material={mats.fin} position={[0, -1.5 + j * 0.2, -0.05]}><boxGeometry args={[4.3, 0.025, 0.7]} /></mesh>)}
  </group>
);
export const ClRadiator3D: React.FC<{ mode?: "clean" | "scale" | "flush"; bed?: string }> = ({ mode = "scale", bed }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 15);
  const mats = useMemo(() => ({
    tank: new THREE.MeshStandardMaterial({ color: "#2A2D33", roughness: 0.55, metalness: 0.2 }),
    tube: new THREE.MeshStandardMaterial({ color: "#C8CDD3", metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.32, side: THREE.DoubleSide }),
    crust: new THREE.MeshStandardMaterial({ color: "#EDE6D4", roughness: 0.95, side: THREE.DoubleSide }),
    fin: new THREE.MeshStandardMaterial({ color: "#B8BDC3", metalness: 0.7, roughness: 0.35, transparent: true, opacity: 0.5 }),
  }), []);
  const k = clamp01((f - 8) / (T * 0.55));
  const crust = mode === "clean" ? 0 : mode === "scale" ? ease(k) : 1 - ease(k);
  const flow = mode === "clean" ? 1 : mode === "scale" ? 1 - 0.85 * ease(k) : 0.2 + 0.8 * ease(k);
  const fluid = new THREE.Color(mode === "clean" ? "#3FA34D" : mode === "scale" ? new THREE.Color("#3FA34D").lerp(new THREE.Color("#7A4A1E"), ease(k)).getStyle() : new THREE.Color("#7A4A1E").lerp(new THREE.Color("#D9C9A0"), ease(k)).getStyle());
  const fizz = mode === "flush" ? 1 - 0.6 * k : 0;
  const a = interpolate(f, [0, T], [-0.25, 0.25]);
  const target = new THREE.Vector3(0, 0, 0), camPos = new THREE.Vector3(Math.sin(a) * 8, 0.6, Math.cos(a) * 8);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={901} dim={0.28} />
      <Contact x={760} y={900} w={900} o={0.3} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-0.1 * width}px) scale(${0.82 + 0.18 * p})`, opacity: clamp01(p * 1.4) }}>
        <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
          <Cam pos={camPos} target={target} />
          <ambientLight intensity={1} />
          <hemisphereLight args={["#FFFFFF", "#6B6257", 0.7]} />
          <directionalLight position={[-3, 5, 4]} intensity={1.6} color="#FFF3DF" />
          <directionalLight position={[4, 1, -2]} intensity={0.6} />
          <RadMesh crust={crust} f={f} flow={flow} fluid={fluid} mats={mats} fizz={fizz} />
        </ThreeCanvas>
      </div>
      <Tag x={1240} y={210} text={mode === "clean" ? "Tubitos limpios" : mode === "scale" ? "El sarro tapa los tubitos" : "El vinagre lo despega"} color={mode === "scale" ? CL.red : CL.navy} o={lin(f, 8, 18)} size={46} />
      {mode === "clean" ? <Note x={1240} y={330} o={lin(f, 22, 34)} big="El líquido pasa" small="y el motor se enfría ✓" w={560} /> : null}
      {mode === "scale" ? <Note x={1240} y={330} o={lin(f, T * 0.5, T * 0.5 + 10)} big="Casi no pasa" small="la aguja sube" color={CL.red} w={560} /> : null}
      {mode === "flush" ? <Note x={1240} y={330} o={lin(f, T * 0.5, T * 0.5 + 10)} big="Vuelve a correr" small="15 a 20 minutos" w={560} /> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ── ClTempGauge ──────────────────────────────────────────────────────────────
export const ClTempGauge: React.FC<{ mode?: "traffic" | "fixed" | "red"; bed?: string }> = ({ mode = "traffic", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const k = ease(clamp01((f - 10) / (T * 0.6)));
  // -120 = frío · 0 = medio · +120 = rojo
  const ang = mode === "fixed" ? Math.sin(f * 0.15) * 1.5 : mode === "traffic" ? 0 + 52 * k + Math.sin(f * 0.4) * 1.2 : 0 + 112 * k;
  const glow = mode === "red" ? clamp01((f - T * 0.55) / 10) * (0.6 + 0.4 * Math.sin(f * 0.5)) : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={911} dim={0.25} />
      {/* el tablero en perspectiva */}
      <div style={{ position: "absolute", left: 260, top: 150 + (1 - p) * 120, width: 1400, height: 720, transform: "perspective(2000px) rotateX(14deg) rotateY(-8deg)", opacity: clamp01(p * 1.4) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 220, background: "linear-gradient(#22262D,#0E1014)", boxShadow: "0 50px 80px rgba(0,0,0,0.55), inset 0 6px 0 rgba(255,255,255,0.06)" }} />
        <Dial x={120} y={150} d={440} ang={-70} label="RPM" />
        <Dial x={800} y={150} d={440} ang={ang} label="TEMP" lo="C" hi="H" glow={glow} marks={[{ a0: 78, a1: 118, c: CL.red }, { a0: -25, a1: 25, c: "rgba(255,255,255,0.18)" }]} />
      </div>
      {mode === "traffic" ? <><Tag x={200} y={70} text="En el tráfico" color={CL.navy} o={lin(f, 6, 16)} size={52} /><Note x={1360} y={640} o={lin(f, T * 0.6, T * 0.6 + 10)} big="Más arriba que nunca" small="no al rojo, pero sube" color={CL.red} w={500} /></> : null}
      {mode === "fixed" ? <><Tag x={200} y={70} text="Una semana después" color={CL.navy} o={lin(f, 6, 16)} size={52} /><Note x={1360} y={640} o={lin(f, 18, 30)} big="En el medio" small="quieta ✓" w={440} /></> : null}
      {mode === "red" ? <Note x={1300} y={620} o={lin(f, T * 0.6, T * 0.6 + 10)} big="Para, apaga y espera" small="nunca sigas en el rojo" color={CL.red} w={560} /> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ── ClBubbleTest ─────────────────────────────────────────────────────────────
export const ClBubbleTest: React.FC<{ mode?: "normal" | "gasket" | "crust"; bed?: string }> = ({ mode = "normal", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const W = 620, Hh = 640, level = 300; // líquido desde y=level hasta abajo
  const liquid = mode === "crust" ? "#7A5A2E" : "#46A85A";
  // intensidad de burbujas en el tiempo: normal = sólo al principio
  const rate = mode === "gasket" ? 1 : mode === "normal" ? clamp01(1 - (f - 14) / (T * 0.35)) : 0;
  const N = 34;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={921} dim={0.28} />
      <Contact x={760} y={930} w={760} o={0.32} />
      <div style={{ position: "absolute", left: 450, top: 170 + (1 - p) * 120, width: W, height: Hh, opacity: clamp01(p * 1.4), transform: "perspective(1600px) rotateY(-14deg)" }}>
        <svg width={W} height={Hh + 60} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="bt_tank" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="rgba(240,236,224,0.55)" /><stop offset="45%" stopColor="rgba(255,255,255,0.25)" /><stop offset="100%" stopColor="rgba(220,214,200,0.6)" /></linearGradient>
            <clipPath id="bt_clip"><rect x={40} y={60} width={W - 80} height={Hh - 80} rx={40} /></clipPath>
          </defs>
          {/* tapón */}
          <rect x={W / 2 - 70} y={0} width={140} height={70} rx={14} fill={mode === "crust" ? "#2B2F36" : "#2B2F36"} opacity={0.35} />
          <g clipPath="url(#bt_clip)">
            <rect x={40} y={level} width={W - 80} height={Hh} fill={liquid} opacity={0.82} />
            <rect x={40} y={level - 6} width={W - 80} height={12} fill="rgba(255,255,255,0.35)" />
            {mode === "crust" ? <>
              <path d={`M 40 ${level - 40} q 30 20 10 80 q -10 160 6 340 L 40 ${Hh}`} fill="#EFE8D6" />
              <path d={`M ${W - 40} ${level - 40} q -30 30 -12 90 q 14 150 -6 330 L ${W - 40} ${Hh}`} fill="#EFE8D6" />
              {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={60 + rnd(i) * (W - 120)} cy={level + 20 + rnd(i + 40) * (Hh - level - 60)} r={4 + rnd(i + 9) * 8} fill="#F4EFE2" opacity={0.85} />)}
            </> : null}
            {Array.from({ length: N }, (_, i) => {
              const born = (i / N) * T * (mode === "gasket" ? 1 : 0.45);
              const age = (f - born) / 26; if (age < 0 || age > 1) return null;
              if (mode === "normal" && born > T * 0.4) return null;
              const x = W / 2 + (rnd(i) - 0.5) * 260, y = Hh - 40 - age * (Hh - 40 - level);
              return <circle key={i} cx={x + Math.sin(f * 0.3 + i) * 6} cy={y} r={6 + rnd(i + 3) * 10} fill="none" stroke="#fff" strokeWidth={3} opacity={(1 - age * 0.6) * (mode === "gasket" ? 1 : 0.95)} />;
            })}
          </g>
          {/* el plástico del depósito */}
          <rect x={40} y={60} width={W - 80} height={Hh - 80} rx={40} fill="url(#bt_tank)" stroke="rgba(120,115,100,0.7)" strokeWidth={6} />
          <line x1={W - 40} y1={level - 60} x2={W - 110} y2={level - 60} stroke={CL.ink} strokeWidth={5} /><text x={W - 30} y={level - 50} fontFamily={LABEL} fontWeight={700} fontSize={34} fill={CL.ink}>MAX</text>
          <line x1={W - 40} y1={level + 140} x2={W - 110} y2={level + 140} stroke={CL.ink} strokeWidth={5} /><text x={W - 30} y={level + 150} fontFamily={LABEL} fontWeight={700} fontSize={34} fill={CL.ink}>MIN</text>
        </svg>
      </div>
      {mode === "normal" ? <><Tag x={1180} y={210} text="Motor frío · tapa abierta" color={CL.navy} o={lin(f, 6, 16)} size={44} /><Note x={1180} y={330} o={lin(f, T * 0.5, T * 0.5 + 10)} big="Unas burbujas y paran" small="aire atrapado ✓" w={560} /></> : null}
      {mode === "gasket" ? <><Tag x={1180} y={210} text="Burbujas sin parar" color={CL.red} o={lin(f, 6, 16)} size={44} /><Note x={1180} y={330} o={lin(f, T * 0.45, T * 0.45 + 10)} big="Como un vaso de soda" small="la junta: al taller" color={CL.red} w={560} /></> : null}
      {mode === "crust" ? <><Tag x={1180} y={210} text="Marrón, como café aguado" color={CL.red} o={lin(f, 6, 16)} size={44} /><Note x={1180} y={330} o={lin(f, 22, 34)} big="La costra blanca" small="es sarro" color={CL.red} w={520} /></> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ── ClMixJug ─────────────────────────────────────────────────────────────────
export const ClMixJug: React.FC<{ mode?: "mix" | "timer"; bed?: string }> = ({ mode = "mix", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  if (mode === "timer") {
    const k = ease(clamp01((f - 8) / (T * 0.6)));
    const mins = Math.round(20 * k);
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={931} dim={0.28} />
        <div style={{ position: "absolute", left: 300, top: 200, opacity: clamp01(p * 1.4), scale: String(0.85 + 0.15 * p) }}>
          <svg width={560} height={560}>
            <circle cx={280} cy={280} r={250} fill="#FBF8EE" stroke={CL.navy} strokeWidth={22} />
            <path d={`M 280 280 L 280 30 A 250 250 0 0 1 ${280 + 250 * Math.sin(2 * Math.PI * 15 / 60)} ${280 - 250 * Math.cos(2 * Math.PI * 15 / 60)} Z`} fill={hexA(CL.yellow, 0.35)} />
            <path d={`M 280 280 L ${280 + 250 * Math.sin(2 * Math.PI * 15 / 60)} ${280 - 250 * Math.cos(2 * Math.PI * 15 / 60)} A 250 250 0 0 1 ${280 + 250 * Math.sin(2 * Math.PI * 20 / 60)} ${280 - 250 * Math.cos(2 * Math.PI * 20 / 60)} Z`} fill={hexA("#4CAF50", 0.45)} />
            {Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return <line key={i} x1={280 + Math.sin(a) * 210} y1={280 - Math.cos(a) * 210} x2={280 + Math.sin(a) * 235} y2={280 - Math.cos(a) * 235} stroke={CL.ink} strokeWidth={8} />; })}
            <line x1={280} y1={280} x2={280 + Math.sin(2 * Math.PI * mins / 60) * 190} y2={280 - Math.cos(2 * Math.PI * mins / 60) * 190} stroke={CL.nitrile} strokeWidth={14} strokeLinecap="round" />
            <circle cx={280} cy={280} r={18} fill={CL.navy} />
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{mins} min</div>
        </div>
        <Tag x={980} y={230} text="Calefacción al máximo" color={CL.navy} o={lin(f, 8, 18)} size={48} />
        <Note x={980} y={350} o={lin(f, 20, 32)} big="15 a 20 minutos" small="mirando la aguja" w={600} />
        <Note x={980} y={600} o={lin(f, T * 0.6, T * 0.6 + 10)} big="Nunca más de 1 hora" small="ni días, ni manejando" color={CL.red} w={600} />
        <RoomLight k={0.5} />
      </AbsoluteFill>
    );
  }
  // mezcla: 1 parte de vinagre + 4 de agua destilada (5 rayas)
  const v = ease(clamp01((f - 10) / 16)), w = ease(clamp01((f - 30) / (T * 0.45)));
  const fill = 0.2 * v + 0.8 * w; // 0..1 de la jarra
  const H0 = 560, X0 = 120;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={932} dim={0.28} />
      <Contact x={620} y={930} w={620} o={0.35} />
      <div style={{ position: "absolute", left: 300, top: 220 + (1 - p) * 120, opacity: clamp01(p * 1.4) }}>
        <svg width={700} height={720} style={{ overflow: "visible" }}>
          <defs><clipPath id="mj_c"><path d={`M ${X0} 60 L ${X0 + 420} 60 L ${X0 + 400} ${60 + H0} Q ${X0 + 395} ${80 + H0} ${X0 + 370} ${80 + H0} L ${X0 + 50} ${80 + H0} Q ${X0 + 25} ${80 + H0} ${X0 + 20} ${60 + H0} Z`} /></clipPath></defs>
          <g clipPath="url(#mj_c)">
            <rect x={X0} y={60 + H0 - H0 * 0.2 * v} width={420} height={H0 * 0.2 * v + 30} fill="#EADFB8" opacity={0.85} />
            <rect x={X0} y={60 + H0 - H0 * fill} width={420} height={H0 * (fill - 0.2 * v) + 2} fill="#D7E8F2" opacity={0.75} />
            <rect x={X0} y={60 + H0 - H0 * fill - 6} width={420} height={10} fill="rgba(255,255,255,0.6)" />
          </g>
          <path d={`M ${X0} 60 L ${X0 + 420} 60 L ${X0 + 400} ${60 + H0} Q ${X0 + 395} ${80 + H0} ${X0 + 370} ${80 + H0} L ${X0 + 50} ${80 + H0} Q ${X0 + 25} ${80 + H0} ${X0 + 20} ${60 + H0} Z`} fill="rgba(255,255,255,0.18)" stroke="rgba(90,95,105,0.8)" strokeWidth={8} />
          <path d={`M ${X0 + 420} 120 q 110 10 110 160 q 0 150 -110 170`} fill="none" stroke="rgba(90,95,105,0.8)" strokeWidth={18} />
          {[1, 2, 3, 4, 5].map((i) => <g key={i}><line x1={X0 + 24} y1={60 + H0 - H0 * 0.2 * i} x2={X0 + 110} y2={60 + H0 - H0 * 0.2 * i} stroke={CL.ink} strokeWidth={5} /><text x={X0 + 120} y={60 + H0 - H0 * 0.2 * i + 12} fontFamily={LABEL} fontWeight={700} fontSize={36} fill={CL.ink}>{i}</text></g>)}
        </svg>
      </div>
      <div style={{ position: "absolute", left: 1060, top: 200, display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ opacity: v, translate: `0 ${(1 - v) * 20}px` }}><Card style={{ padding: "18px 34px", borderBottom: `8px solid ${CL.yellow}` }}><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: CL.ink, lineHeight: 1 }}>1</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CL.inkSoft }}>vinagre blanco</div></Card></div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: "#fff", opacity: w, textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>:</div>
        <div style={{ opacity: w, translate: `0 ${(1 - w) * 20}px` }}><Card style={{ padding: "18px 34px", borderBottom: `8px solid #7FB7D6` }}><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: CL.ink, lineHeight: 1 }}>4</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CL.inkSoft }}>agua destilada</div></Card></div>
      </div>
      <Note x={1060} y={560} o={lin(f, T * 0.7, T * 0.7 + 10)} big="Nunca vinagre puro" small="ataca el aluminio" color={CL.red} w={620} />
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ── ClHotCap ─────────────────────────────────────────────────────────────────
export const ClHotCap: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const temp = Math.round(20 + 88 * ease(clamp01((f - 6) / 26)));
  const hand = lin(f, T * 0.45, T * 0.45 + 12);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={941} dim={0.22} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 42% 50%, rgba(255,90,40,${0.22 * lin(f, 10, 30)}), rgba(255,90,40,0) 55%)` }} />
      {/* la tapa vista de arriba en perspectiva */}
      <div style={{ position: "absolute", left: 480, top: 240 + (1 - p) * 100, opacity: clamp01(p * 1.4), transform: "perspective(1400px) rotateX(48deg)" }}>
        <div style={{ width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #D9DDE2, #8E949C 60%, #5E646C)", boxShadow: "0 40px 60px rgba(0,0,0,0.5), inset 0 0 0 26px #6F757D" }}>
          {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 60, top: 230, width: 400, height: 60, borderRadius: 30, background: "linear-gradient(#A9AEB5,#70767E)", rotate: `${i * 0}deg`, boxShadow: "0 6px 0 rgba(0,0,0,0.25)" }} />)}
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: CL.red }}>⚠ NO ABRIR EN CALIENTE</div>
        </div>
      </div>
      {/* vapor */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 7 }, (_, i) => { const t = ((f * 0.025 + i / 7) % 1); return <path key={i} d={`M ${640 + i * 40} ${430 - t * 300} q ${30 * Math.sin(i + f * 0.05)} -40 0 -80 q ${-30 * Math.sin(i + f * 0.05)} -40 0 -80`} stroke="rgba(255,255,255,0.75)" strokeWidth={14} fill="none" strokeLinecap="round" opacity={(1 - t) * lin(f, 14, 24)} />; })}
      </svg>
      {/* termómetro */}
      <div style={{ position: "absolute", left: 1220, top: 190, opacity: lin(f, 4, 14) }}>
        <Card style={{ padding: "18px 34px", borderBottom: `8px solid ${CL.red}` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: CL.inkSoft, letterSpacing: 2 }}>ADENTRO</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: temp > 99 ? CL.red : CL.ink, lineHeight: 1 }}>{temp > 99 ? "+100" : temp} °C</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CL.red }}>y a presión</div>
        </Card>
      </div>
      {/* la mano que NO */}
      <div style={{ position: "absolute", left: 1180, top: 600, opacity: hand, scale: String(0.8 + 0.2 * hand) }}>
        <Card style={{ padding: "16px 34px", background: CL.red, borderBottom: `8px solid ${CL.navy}` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: "#fff", lineHeight: 1.05 }}>La tapa no se toca</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: "#FFE3E3" }}>se espera a que enfríe</div>
        </Card>
      </div>
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};
