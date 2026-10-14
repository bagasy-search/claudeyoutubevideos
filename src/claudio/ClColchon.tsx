// Kit del video 9 (clcolchon): set-pieces DENTRO del mundo del hotel (cama real, sombra, luz de techo), ≤12 palabras.
//   ClMattressLayers3D  colchón en 3D real (three.js) con el corte de sus capas: el rociado cae arriba y la humedad baja.
//                       mode "damp" = la humedad se queda en la tela de arriba · "soaked" = baja por todas las capas y se lleva
//                       la mancha amarilla hacia adentro. Rótulos de latón opcionales (top/inner).
//   ClDampSoaked        la diferencia que importa: HÚMEDA ✓ (la tela cambia de color y brilla) · EMPAPADA ✗ (apoya la mano y sale agua). hi 0/1
//   ClSprayMix          el rociador que se llena: 1 taza (240 ml) agua oxigenada + 3 cucharadas de bicarbonato + 1 gota de detergente,
//                       la tapa que se afloja ("sin apretar") y el sello "se arma cada vez"
//   ClDryFan            el ventilador apuntando a la mancha, el reloj de 1 a 3 h y el polvito blanco que queda al final → aspirar
//   ClThreeRounds       tres vueltas tildadas; si a la tercera sigue → "capas de adentro" → el protector lavable
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, SERIF, HAND, rnd } from "./ClTheme";
import { Bed, Contact, RoomLight, Stamp, lin, pop, useOut } from "./ClParts";

const Cam: React.FC<{ pos: THREE.Vector3; target: THREE.Vector3 }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};
const brass = (txt: string, x: number, y: number, k: number, alert = false): React.ReactNode => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: k, scale: String(0.85 + 0.15 * k), background: alert ? CL.red : `linear-gradient(160deg, ${CL.brassLight}, ${CL.brass} 50%, #8C6831)`, color: alert ? "#fff" : CL.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 2, padding: "6px 24px", borderRadius: 8, boxShadow: `0 10px 22px ${CL.shadow}, inset 0 2px 0 rgba(255,255,255,0.45)`, whiteSpace: "nowrap" }}>{txt.toUpperCase()}</div>
);
const tick = (ok: boolean, s = 70): React.ReactNode => (
  <svg width={s} height={s} viewBox="0 0 70 70">{ok ? <path d="M10 38 L28 56 L60 16" stroke="#2F8F48" strokeWidth={11} fill="none" strokeLinecap="round" /> : <path d="M14 14 L56 56 M56 14 L14 56" stroke={CL.red} strokeWidth={11} strokeLinecap="round" />}</svg>
);

// ── 3D: el colchón con el corte de sus capas, el rociado y la humedad que baja (o no)
const LAYERS: [number, string][] = [[0.12, "#FFFFFF"], [0.2, "#F3EEDF"], [0.26, "#E9E1C8"], [0.26, "#E2D8BA"], [0.14, "#D9CDA9"]];
export const ClMattressLayers3D: React.FC<{ mode?: "damp" | "soaked"; top?: string; inner?: string; bed?: string }> = ({ mode = "damp", top, inner, bed }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T, fps } = useVideoConfig();
  const soaked = mode === "soaked";
  const W = 5.4, D = 3.4, Htot = LAYERS.reduce((a, [h]) => a + h, 0);
  const mats = useMemo(() => LAYERS.map(([, c]) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.95 })), []);
  const wet = useMemo(() => new THREE.MeshStandardMaterial({ color: "#9FC4E2", roughness: 0.4, transparent: true, opacity: 0.55, depthWrite: false }), []);
  const stain = useMemo(() => new THREE.MeshStandardMaterial({ color: "#E0A92A", roughness: 0.9, transparent: true, opacity: 0.32, depthWrite: false }), []);
  const drop = useMemo(() => new THREE.MeshStandardMaterial({ color: "#BFE0F7", roughness: 0.05, transparent: true, opacity: 0.85 }), []);
  const quilt = useMemo(() => new THREE.MeshStandardMaterial({ color: "#E6E2D6", roughness: 1 }), []);
  // cuánto bajó la humedad (0 = nada · 1 = hasta el fondo)
  const depth = interpolate(f, [30, T - 20], [0, soaked ? 1 : 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const sprayOn = f > 8 && f < (soaked ? T - 30 : 60);
  const dist = interpolate(f, [0, T], [9.2, 8.0], { easing: Easing.out(Easing.quad) });
  const orbit = interpolate(f, [0, T], [0.62, 0.38]);
  const pos = new THREE.Vector3(Math.sin(orbit) * dist, 4.2, Math.cos(orbit) * dist);
  const target = new THREE.Vector3(0, -0.1, 0);
  let y0 = -Htot / 2;
  const slabs = LAYERS.map(([h], i) => { const y = y0 + h / 2; y0 += h; return { h, y, i }; }).reverse();
  const topY = Htot / 2;
  const wetH = Math.max(0.02, depth * Htot);
  const pl = pop(f, fps, 10);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={161} dim={0.24} />
      <Contact x={width / 2} y={height * 0.8} w={900} o={0.4} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [pos.x, pos.y, pos.z] }} gl={{ antialias: true, alpha: true }}>
        <Cam pos={pos} target={target} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[-3, 7, 4]} intensity={1.2} color="#FFF0D8" />
        <directionalLight position={[5, 2, 3]} intensity={0.4} />
        <group rotation={[0, -0.2, 0]}>
          {slabs.map(({ h, y, i }) => (
            <mesh key={i} position={[0, y, 0]} material={mats[LAYERS.length - 1 - i]}><boxGeometry args={[W, h, D]} /></mesh>
          ))}
          {/* acolchado de arriba */}
          {Array.from({ length: 5 }, (_, i) => <mesh key={`q${i}`} position={[-W / 2 + (i + 0.5) * (W / 5), topY + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={quilt}><planeGeometry args={[0.02, D * 0.96]} /></mesh>)}
          {/* la mancha amarilla arriba (se aclara en "damp", se hunde en "soaked") */}
          {[1.0, 0.8, 0.6, 0.42].map((r, k) => <mesh key={`s${k}`} position={[0.3, topY + 0.01 + k * 0.002, 0.1]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.25, 1, 1]} material={stain}><circleGeometry args={[r * (soaked ? 1 : 1 - 0.35 * depth / 0.16), 48]} /></mesh>)}
          {/* la humedad que baja, vista en el corte del frente */}
          <mesh position={[0.3, topY - wetH / 2, D / 2 + 0.005]} material={wet}><planeGeometry args={[1.5 + depth * 0.6, wetH]} /></mesh>
          {soaked ? [0, 1].map((k) => <mesh key={`st${k}`} position={[0.3, topY - wetH * 0.5, D / 2 + 0.008 + k * 0.002]} material={stain}><planeGeometry args={[1.2 - k * 0.4, wetH * (0.8 - k * 0.25)]} /></mesh>) : null}
          {/* el rociado */}
          {sprayOn ? Array.from({ length: soaked ? 26 : 12 }, (_, k) => {
            const ph = ((f * 0.06 + rnd(k) * 3) % 1);
            return <mesh key={`d${k}`} position={[0.3 + (rnd(k + 7) - 0.5) * 1.2, topY + 2.2 - ph * 2.2, 0.1 + (rnd(k + 11) - 0.5) * 1.0]} material={drop}><sphereGeometry args={[soaked ? 0.06 : 0.035, 10, 10]} /></mesh>;
          }) : null}
        </group>
      </ThreeCanvas>
      {top ? brass(top, width * 0.3, height * 0.2, pl) : null}
      {inner ? brass(inner, width * 0.74, height * 0.72, lin(f, 50, 62), soaked) : null}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── húmeda ✓ / empapada ✗
export const ClDampSoaked: React.FC<{ hi?: number; bed?: string }> = ({ hi = -1, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const panel = (i: number) => {
    const ok = i === 0, k = pop(f, fps, 4 + i * 10, 15), dim = hi >= 0 && hi !== i;
    const drip = lin(f, 30, 90);
    return (
      <div style={{ position: "absolute", left: 170 + i * 840, top: 120, width: 720, opacity: out * k * (dim ? 0.45 : 1), translate: `0 ${(1 - k) * 80}px` }}>
        <div style={{ height: 470, borderRadius: 30, position: "relative", overflow: "hidden", boxShadow: `22px 28px 50px ${CL.shadow}`, background: "repeating-linear-gradient(45deg, #FBFAF6 0 26px, #F1EEE5 26px 52px)" }}>
          {/* la mancha tratada */}
          <div style={{ position: "absolute", left: 180, top: 110, width: 360, height: 250, borderRadius: "50%", background: ok ? "radial-gradient(ellipse, rgba(170,190,205,0.55), rgba(170,190,205,0.15) 70%, transparent)" : "radial-gradient(ellipse, rgba(120,160,200,0.8), rgba(120,160,200,0.45) 70%, rgba(120,160,200,0.1))" }} />
          {ok ? <div style={{ position: "absolute", left: 260, top: 150, width: 120, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.7)", filter: "blur(6px)" }} /> : null}
          {/* la mano apoyada y el agua que sale (sólo empapada) */}
          {!ok ? <>
            <div style={{ position: "absolute", left: 270, top: 150 - 30 * (1 - lin(f, 20, 34)), width: 190, height: 150, borderRadius: "45% 45% 40% 40%", background: "linear-gradient(180deg, #4C8BE0, #2F6CC2)", boxShadow: "0 12px 20px rgba(0,0,0,0.25)" }} />
            {Array.from({ length: 9 }, (_, j) => <div key={j} style={{ position: "absolute", left: 250 + j * 26, top: 300 + ((f * 2 + j * 23) % 120) * drip, width: 14, height: 20, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#7FB2D8", opacity: drip * 0.9 }} />)}
          </> : null}
        </div>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 20, justifyContent: "center" }}>
          {tick(ok)}
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: CL.ink }}>{ok ? "Húmeda" : "Empapada"}</div>
        </div>
        <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: ok ? CL.navy : CL.red, opacity: lin(f, 40 + i * 8, 52 + i * 8) }}>{ok ? "cambia de color y brilla" : "apoya la mano y sale agua"}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={163} dim={0.22} />
      {panel(0)}
      {panel(1)}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── el rociador que se llena con la mezcla + la tapa sin apretar
export const ClSprayMix: React.FC<{ stamp?: string; bed?: string }> = ({ stamp = "Se arma cada vez", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const a = lin(f, 14, 40), b = lin(f, 44, 66), c = lin(f, 70, 80);
  const capTurn = lin(f, 86, 104) * -38;
  const fizz = lin(f, 60, 90);
  const lines: [string, string, number][] = [["1 taza · 240 ml", "agua oxigenada", a], ["3 cucharadas", "bicarbonato", b], ["1 gota", "detergente", c]];
  const BOT = 760, BH = 470, fill = (0.55 * a + 0.22 * b + 0.03 * c);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={167} dim={0.2} />
      <div style={{ position: "absolute", left: 300, top: 0, width: 520, height: 1080, opacity: out, translate: `0 ${(1 - p) * 140}px` }}>
        <svg width={520} height={1080} viewBox="0 0 520 1080">
          <defs><clipPath id="sbody"><rect x={110} y={BOT - BH} width={300} height={BH} rx={46} /></clipPath></defs>
          {/* cuerpo */}
          <rect x={110} y={BOT - BH} width={300} height={BH} rx={46} fill="rgba(235,244,250,0.85)" stroke="#B9C6D2" strokeWidth={8} />
          <g clipPath="url(#sbody)">
            <rect x={110} y={BOT - fill * BH} width={300} height={fill * BH} fill="rgba(150,195,230,0.75)" />
            <rect x={110} y={BOT - 0.08 * BH * b} width={300} height={0.08 * BH * b} fill="rgba(250,250,245,0.95)" />
            {Array.from({ length: 12 }, (_, j) => <circle key={j} cx={140 + rnd(j) * 240} cy={BOT - ((f * 2.2 + j * 37) % (fill * BH + 1))} r={4 + rnd(j + 4) * 4} fill="#FFFFFF" opacity={0.7 * fizz} />)}
          </g>
          {/* gatillo y tapa (se afloja) */}
          <g transform={`rotate(${capTurn} 260 ${BOT - BH - 40})`}>
            <rect x={200} y={BOT - BH - 80} width={120} height={80} rx={14} fill="#2B3A5A" />
            <path d={`M320 ${BOT - BH - 70} L420 ${BOT - BH - 60} L420 ${BOT - BH - 36} L320 ${BOT - BH - 30} Z`} fill="#2B3A5A" />
            <path d={`M250 ${BOT - BH - 30} Q240 ${BOT - BH + 40} 270 ${BOT - BH + 70}`} stroke="#2B3A5A" strokeWidth={22} fill="none" strokeLinecap="round" />
          </g>
          {capTurn < -5 ? <path d={`M170 ${BOT - BH - 120} A90 90 0 0 1 350 ${BOT - BH - 120}`} stroke={CL.red} strokeWidth={8} fill="none" markerEnd="" /> : null}
        </svg>
        <div style={{ position: "absolute", left: -60, top: BOT - BH - 170, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CL.red, rotate: "-4deg", opacity: lin(f, 96, 108) }}>sin apretar</div>
      </div>
      <div style={{ position: "absolute", left: 960, top: 230 }}>
        {lines.map(([q, what, k], i) => (
          <div key={i} style={{ marginBottom: 46, opacity: out * k, translate: `${(1 - k) * 80}px 0` }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: CL.ink, lineHeight: 1 }}>{q}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CL.navy }}>{what}</div>
          </div>
        ))}
      </div>
      {stamp ? <Stamp text={stamp} at={110} color={CL.red} x="66%" y="84%" rot={-4} size={64} /> : null}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── el ventilador, el reloj de 1 a 3 h y el polvito blanco → aspirar
export const ClDryFan: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const dry = lin(f, 20, 90);
  const powder = lin(f, 80, 100), vac = lin(f, 104, 130);
  const hand = interpolate(f, [20, 90], [30, 30 + 2 * 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // 1 h → 3 h
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={171} dim={0.2} />
      {/* el ventilador */}
      <div style={{ position: "absolute", left: 120, top: 260, opacity: out * p, translate: `${(1 - p) * -120}px 0` }}>
        <svg width={460} height={600} viewBox="0 0 460 600">
          <circle cx={230} cy={230} r={200} fill="rgba(255,255,255,0.85)" stroke="#9AA3AE" strokeWidth={10} />
          <g transform={`rotate(${f * 24} 230 230)`}>{[0, 1, 2].map((i) => <ellipse key={i} cx={230} cy={130} rx={46} ry={96} fill="#C9D3E6" transform={`rotate(${i * 120} 230 230)`} />)}</g>
          <circle cx={230} cy={230} r={30} fill="#2B3A5A" />
          <rect x={215} y={430} width={30} height={120} fill="#9AA3AE" /><rect x={140} y={540} width={180} height={30} rx={14} fill="#7D8692" />
        </svg>
      </div>
      {/* el aire */}
      {Array.from({ length: 6 }, (_, j) => <div key={j} style={{ position: "absolute", left: 600 + ((f * 9 + j * 70) % 380), top: 380 + j * 42, width: 120, height: 6, borderRadius: 3, background: "#AFC6DA", opacity: 0.6 * out * (1 - powder * 0.6) }} />)}
      {/* el parche de colchón: mojado → seco → polvito → aspirado */}
      <div style={{ position: "absolute", left: 1000, top: 300, width: 640, height: 420, borderRadius: 26, overflow: "hidden", opacity: out * p, boxShadow: `22px 28px 50px ${CL.shadow}`, background: "repeating-linear-gradient(45deg, #FBFAF6 0 26px, #F1EEE5 26px 52px)" }}>
        <div style={{ position: "absolute", left: 150, top: 90, width: 340, height: 240, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(140,175,205,0.7), transparent 70%)", opacity: 1 - dry }} />
        {Array.from({ length: 70 }, (_, j) => <div key={j} style={{ position: "absolute", left: 170 + rnd(j) * 300, top: 110 + rnd(j + 9) * 200, width: 6 + rnd(j + 2) * 6, height: 6 + rnd(j + 5) * 6, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 0 2px rgba(0,0,0,0.18)", opacity: powder * (1 - (rnd(j + 1) < vac ? 1 : 0)) }} />)}
      </div>
      {/* el reloj */}
      <div style={{ position: "absolute", left: 1530, top: 120, opacity: out * lin(f, 14, 26) }}>
        <svg width={240} height={240} viewBox="0 0 240 240">
          <circle cx={120} cy={120} r={104} fill="#FFFDF6" stroke={CL.navy} strokeWidth={10} />
          <path d={`M120 120 L${120 + 80 * Math.sin((30 * Math.PI) / 180)} ${120 - 80 * Math.cos((30 * Math.PI) / 180)} A80 80 0 ${hand - 30 > 180 ? 1 : 0} 1 ${120 + 80 * Math.sin((hand * Math.PI) / 180)} ${120 - 80 * Math.cos((hand * Math.PI) / 180)} Z`} fill={CL.yellowSoft} />
          <line x1={120} y1={120} x2={120 + 70 * Math.sin((hand * Math.PI) / 180)} y2={120 - 70 * Math.cos((hand * Math.PI) / 180)} stroke={CL.navy} strokeWidth={10} strokeLinecap="round" />
        </svg>
        <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: CL.ink }}>1 a 3 h</div>
      </div>
      <div style={{ position: "absolute", left: 1040, top: 760, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CL.navy, rotate: "-2deg", opacity: out * powder }}>{vac > 0.3 ? "aspírelo" : "el polvito blanco: ya terminó"}</div>
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── tres vueltas → capas de adentro → protector lavable
export const ClThreeRounds: React.FC<{ bed?: string; stamp?: string }> = ({ bed, stamp = "Protector lavable" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const k3 = lin(f, 60, 72), shield = pop(f, fps, 80, 13);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={173} dim={0.2} />
      <div style={{ position: "absolute", left: 180, top: 170, display: "flex", gap: 60 }}>
        {[0, 1, 2].map((i) => {
          const k = pop(f, fps, 6 + i * 16, 14);
          return (
            <div key={i} style={{ width: 300, height: 360, borderRadius: 26, background: "#FFFDF6", boxShadow: `20px 26px 46px ${CL.shadow}`, opacity: out * k, translate: `0 ${(1 - k) * 90}px`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 2, color: CL.navy }}>VUELTA</div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: CL.ink, lineHeight: 1 }}>{i + 1}</div>
              <div style={{ opacity: lin(f, 16 + i * 16, 24 + i * 16) }}>{tick(true, 80)}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 200, top: 600, fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: CL.red, opacity: out * k3, translate: `${(1 - k3) * -60}px 0` }}>¿Sigue? Capas de adentro</div>
      {/* el protector */}
      <div style={{ position: "absolute", left: 1330, top: 220, opacity: out * shield, scale: String(0.6 + 0.4 * shield) }}>
        <svg width={420} height={480} viewBox="0 0 420 480">
          <path d="M210 20 L380 80 Q380 320 210 450 Q40 320 40 80 Z" fill="#E7F0F8" stroke={CL.navy} strokeWidth={12} />
          <path d="M120 230 L190 300 L310 170" stroke="#2F8F48" strokeWidth={22} fill="none" strokeLinecap="round" />
        </svg>
      </div>
      {stamp ? <Stamp text={stamp} at={96} color={CL.navy} x="80%" y="84%" rot={-4} size={62} /> : null}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};
