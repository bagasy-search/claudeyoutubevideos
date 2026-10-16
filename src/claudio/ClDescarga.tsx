// Kit del video 8 (cldescarga): set-pieces DENTRO del mundo del hotel (cama real, sombra, luz de techo), ≤12 palabras.
//   ClFlushJet3D  inodoro de porcelana en 3D real (three.js): por los agujeritos del borde bajan hilos de agua en espiral y por el
//                 AGUJERO DEL FONDO sale el chorro que empuja. mode "weak" = agujeros con costra, hilos finos, remolino perezoso ·
//                 "strong" = sin costra, chorro fuerte, remolino que se lleva todo. Rótulos de latón opcionales (rim/jet).
//   ClRiseOrSpin  la prueba de 10 s: dos tazas en corte lado a lado — SUBE (tapón → plomero) · GIRA DÉBIL (los agujeros → siga). hi 0/1
//   ClTankMark    el tanque abierto en corte: tubo de rebalse con su marca; el agua sube y se queda baja (state "low") o llega a la marca
//   ClTwoDays     dos hojas de almanaque de la pared del depósito: DÍA 1 frasco marrón · DÍA 2 vinagre + sello "nunca el mismo día"
//   ClStickWire   palito plástico ✓ contra alambre ✗, con la lupa sobre la raya de la porcelana donde se agarra el sarro
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

// ── 3D: la taza (perfil torneado), el borde con N agujeros, el agujero del fondo adelante, el agua en espiral
const NH = 18;
export const ClFlushJet3D: React.FC<{ mode?: "weak" | "strong"; rim?: string; jet?: string; bed?: string }> = ({ mode = "weak", rim, jet, bed }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T, fps } = useVideoConfig();
  const strong = mode === "strong";
  const bowlG = useMemo(() => new THREE.LatheGeometry([[0.28, -0.9], [0.55, -0.82], [0.95, -0.45], [1.25, 0.1], [1.42, 0.62], [1.5, 0.92], [1.58, 1.0], [1.62, 1.08], [1.5, 1.12]].map(([r, y]) => new THREE.Vector2(r, y)), 72), []);
  const mats = useMemo(() => ({
    porc: new THREE.MeshPhysicalMaterial({ color: "#FBFBF8", roughness: 0.12, clearcoat: 1, side: THREE.DoubleSide }),
    hole: new THREE.MeshStandardMaterial({ color: "#2A2C30", roughness: 0.8 }),
    crust: new THREE.MeshStandardMaterial({ color: "#E8E2D2", roughness: 1 }),
    slime: new THREE.MeshStandardMaterial({ color: "#3C3A2E", roughness: 0.6 }),
    water: new THREE.MeshPhysicalMaterial({ color: "#CFE6F5", roughness: 0.02, transparent: true, opacity: 0.55, depthWrite: false }),
    drop: new THREE.MeshStandardMaterial({ color: "#8FC3E8", roughness: 0.05, transparent: true, opacity: 0.8 }),
  }), []);
  const flowK = lin(f, 10, 26);
  const swirl = f * (strong ? 0.11 : 0.03);
  const dist = interpolate(f, [0, T], [8.6, 7.4], { easing: Easing.out(Easing.quad) });
  const orbit = interpolate(f, [0, T], [-0.3, 0.12]);
  const pos = new THREE.Vector3(Math.sin(orbit) * dist, 7.4, Math.cos(orbit) * dist);
  const target = new THREE.Vector3(0, -0.6, 0);
  const holes = Array.from({ length: NH }, (_, i) => (i / NH) * Math.PI * 2);
  const streams = strong ? 3 : 1;
  const pl = pop(f, fps, 8);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={131} dim={0.24} />
      <Contact x={width / 2} y={height * 0.86} w={720} o={0.4} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [pos.x, pos.y, pos.z] }} gl={{ antialias: true, alpha: true }}>
        <Cam pos={pos} target={target} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[-2, 7, 3]} intensity={1.3} color="#FFF0D8" />
        <directionalLight position={[4, 2, 5]} intensity={0.45} />
        <group scale={[1, 1, 1.25]}>
          <mesh geometry={bowlG} material={mats.porc} />
          {/* labio grueso del borde */}
          <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.porc}><torusGeometry args={[1.56, 0.1, 16, 72]} /></mesh>
        </group>
        {/* pie y tanque: que se lea inodoro */}
        <mesh position={[0, -1.6, -0.15]} material={mats.porc}><cylinderGeometry args={[0.55, 0.8, 1.5, 40]} /></mesh>
        {/* agujeritos debajo del borde (+ costra en "weak") */}
        {holes.map((a, i) => (
          <group key={i} position={[Math.cos(a) * 1.36, 0.97, Math.sin(a) * 1.36 * 1.25]}>
            <mesh material={mats.hole} scale={strong ? 1 : 0.55}><sphereGeometry args={[0.055, 10, 8]} /></mesh>
            {!strong ? <mesh material={i % 3 === 0 ? mats.slime : mats.crust} position={[0, -0.02, 0]} scale={[1, 0.6, 1]}><sphereGeometry args={[0.07 + rnd(i) * 0.03, 10, 8]} /></mesh> : null}
          </group>
        ))}
        {/* agujero grande del fondo, adelante (el chorro) */}
        <group position={[0, -0.47, 0.18]} rotation={[0, 0, 0]}>
          <mesh material={mats.hole}><cylinderGeometry args={[0.2, 0.2, 0.03, 28]} /></mesh>
          {!strong ? <mesh material={mats.crust} position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.19, 0.06, 10, 28]} /></mesh> : null}
        </group>
        {/* agua del fondo, girando */}
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, swirl]} scale={[1, 1.25, 1]} material={mats.water}><circleGeometry args={[0.98, 48]} /></mesh>
        {/* hilos que bajan en espiral desde los agujeros */}
        {holes.map((a, i) => Array.from({ length: streams }, (_, j) => {
          const t = ((f * (strong ? 0.035 : 0.012) + j / streams + rnd(i * 5)) % 1);
          const ang = a + swirl * 0.6 + t * (strong ? 1.6 : 0.6);
          const y = 0.9 - t * 1.4, r = 1.34 - t * 0.55;
          return <mesh key={`${i}-${j}`} material={mats.drop} position={[Math.cos(ang) * r, y, Math.sin(ang) * r * 1.25]} scale={[(strong ? 1 : 0.5) * flowK, (strong ? 3.2 : 1.6) * flowK, (strong ? 1 : 0.5) * flowK]}><sphereGeometry args={[0.035, 8, 6]} /></mesh>;
        }))}
        {/* el chorro del fondo: gotas que salen del agujero hacia atrás */}
        {Array.from({ length: strong ? 26 : 6 }, (_, i) => {
          const t = (f * (strong ? 0.06 : 0.015) + i / (strong ? 26 : 6)) % 1;
          return <mesh key={i} material={mats.drop} position={[(rnd(i) - 0.5) * 0.12, -0.45 + t * 0.06, 0.18 - t * 0.9]} scale={(strong ? 1.4 : 0.6) * flowK * (1 - t * 0.5)}><sphereGeometry args={[0.05, 8, 6]} /></mesh>;
        })}
      </ThreeCanvas>
      <RoomLight k={0.7} />
      {rim ? brass(rim, width * 0.24, height * 0.26, pl, !strong) : null}
      {jet ? brass(jet, width * 0.7, height * 0.6, pop(f, fps, 18), !strong) : null}
    </AbsoluteFill>
  );
};

// ── la prueba: dos tazas en corte (SVG) — SUBE vs GIRA
const BowlCut: React.FC<{ kind: "rise" | "spin"; f: number; on: boolean; dim: boolean }> = ({ kind, f, on, dim }) => {
  const lvl = kind === "rise" ? interpolate(f, [14, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }) : 0.18 + 0.04 * Math.sin(f * 0.2);
  const wy = 360 - lvl * 230;
  const sw = f * 0.05;
  return (
    <svg width={620} height={460} viewBox="0 0 620 460" style={{ opacity: dim ? 0.4 : 1 }}>
      <defs><clipPath id={`cb${kind}`}><path d="M70 80 Q90 380 310 400 Q530 380 550 80 Z" /></clipPath></defs>
      <path d="M70 80 Q90 380 310 400 Q530 380 550 80 Z" fill="#FBFBF8" stroke="#C9C6BE" strokeWidth={8} />
      <g clipPath={`url(#cb${kind})`}>
        <rect x={0} y={wy} width={620} height={460} fill={kind === "rise" ? "#B9C9A6" : "#CFE6F5"} opacity={0.9} />
        {kind === "spin" ? [0, 1, 2].map((i) => <ellipse key={i} cx={310 + Math.cos(sw + i * 2.1) * 60} cy={wy + 22} rx={90 - i * 22} ry={14} fill="none" stroke="#7FB2D8" strokeWidth={5} opacity={0.7} />) : null}
        {kind === "rise" ? [0, 1, 2, 3].map((i) => <circle key={i} cx={200 + i * 70} cy={wy + 10 - ((f * 1.3 + i * 17) % 40)} r={8} fill="#E8EEDD" opacity={0.8} />) : null}
      </g>
      <rect x={40} y={56} width={540} height={34} rx={17} fill="#FFFFFF" stroke="#C9C6BE" strokeWidth={8} />
      {on ? <rect x={30} y={46} width={560} height={370} rx={30} fill="none" stroke={kind === "rise" ? CL.red : "#3DBE5A"} strokeWidth={10} /> : null}
    </svg>
  );
};
export const ClRiseOrSpin: React.FC<{ hi?: number; bed?: string }> = ({ hi = -1, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const col = (i: number, kind: "rise" | "spin", head: string, verdict: string, c: string) => (
    <div style={{ position: "absolute", left: 140 + i * 860, top: 130, width: 660, opacity: out * p, translate: `0 ${(1 - p) * 80}px` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: CL.ink, textAlign: "center", textShadow: "0 3px 0 rgba(255,255,255,0.8)" }}>{head}</div>
      <BowlCut kind={kind} f={f} on={hi === i} dim={hi >= 0 && hi !== i} />
      <div style={{ margin: "10px auto 0", width: "fit-content", background: c, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 56, letterSpacing: 2, padding: "8px 30px", borderRadius: 12, boxShadow: `0 14px 28px ${CL.shadow}`, opacity: lin(f, 30 + i * 10, 40 + i * 10) * (hi >= 0 && hi !== i ? 0.45 : 1) }}>{verdict.toUpperCase()}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={137} dim={0.22} />
      {col(0, "rise", "Sube", "Tapón · plomero", CL.red)}
      {col(1, "spin", "Gira débil", "Los agujeros", "#2F8F48")}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── el tanque en corte con la marca del tubo de rebalse
export const ClTankMark: React.FC<{ state?: "low" | "ok"; note?: string; bed?: string }> = ({ state = "low", note = "2 a 3 cm debajo de la punta", bed }) => {
  const f = useCurrentFrame(); const { fps, width } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const target = state === "ok" ? 0.78 : 0.52;
  const lvl = interpolate(f, [12, 60], [0.1, target], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const TOP = 160, H = 720, wy = TOP + H - lvl * H, markY = TOP + H - 0.78 * H;
  const ok = state === "ok", reached = lvl >= target - 0.01;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={149} dim={0.2} />
      <div style={{ position: "absolute", left: 360, top: TOP - 30, width: 900, height: H + 60, borderRadius: 26, background: "linear-gradient(90deg, #E9E7E1, #FFFFFF 40%, #EEECE6)", boxShadow: `30px 34px 60px ${CL.shadow}, inset 0 0 0 14px #F7F6F2`, opacity: out, translate: `0 ${(1 - p) * 120}px`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 14, right: 14, top: wy - TOP + 30, bottom: 14, background: "linear-gradient(180deg, rgba(150,200,235,0.75), rgba(110,170,215,0.85))", borderRadius: "0 0 14px 14px" }} />
        {/* tubo de rebalse */}
        <div style={{ position: "absolute", left: 560, top: 70, width: 70, height: H - 40, background: "linear-gradient(90deg, #C9CDD3, #F4F5F7 45%, #B9BEC6)", borderRadius: "10px 10px 0 0", boxShadow: "inset 0 10px 14px rgba(0,0,0,0.25)" }} />
        {/* la marca */}
        <div style={{ position: "absolute", left: 540, top: markY - TOP + 30, width: 110, height: 8, background: CL.red, borderRadius: 4 }} />
        {/* flotante y llave de llenado */}
        <div style={{ position: "absolute", left: 150, top: wy - TOP - 10, width: 120, height: 80, borderRadius: 40, background: "linear-gradient(180deg, #3C4250, #262A33)" }} />
        <div style={{ position: "absolute", left: 196, top: 70, width: 28, height: wy - TOP - 60, background: "#3C4250", borderRadius: 6 }} />
      </div>
      <div style={{ position: "absolute", left: 1300, top: markY - 40, opacity: out * lin(f, 20, 30) }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CL.navy, rotate: "-3deg", maxWidth: 520, lineHeight: 1.05 }}>{note}</div>
      </div>
      {reached ? <Stamp text={ok ? "Bien" : "Le falta agua"} at={64} color={ok ? "#2F8F48" : CL.red} x={`${(810 / width) * 100}%`} y="12%" rot={-4} size={68} /> : null}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── las dos hojas de almanaque
type Day = [string, string, string, string];
export const ClTwoDays: React.FC<{ hi?: number; bed?: string; stamp?: string; d1?: Day; d2?: Day }> = ({ hi = -1, bed, stamp = "Nunca el mismo día", d1 = ["DÍA 1", "Frasco marrón", "½ taza por el tubo + 1 taza · 30 min", "#5A3418"], d2 = ["DÍA 2", "Vinagre blanco", "2 tazas · toda la noche", "#3E6E8E"] }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const page = (i: number, day: string, what: string, how: string, c: string) => {
    const p = pop(f, fps, 4 + i * 10, 15), dim = hi >= 0 && hi !== i;
    return (
      <div style={{ position: "absolute", left: 250 + i * 760, top: 120, width: 640, height: 780, background: "#FFFDF6", borderRadius: 10, boxShadow: `24px 30px 54px ${CL.shadow}`, rotate: `${i ? 2 : -2}deg`, opacity: out * p * (dim ? 0.45 : 1), translate: `0 ${(1 - p) * -200}px`, overflow: "hidden" }}>
        <div style={{ height: 170, background: c, color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 104, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 2 }}>{day}</div>
        {[0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{ position: "absolute", top: -14, left: 60 + k * 100, width: 26, height: 44, borderRadius: 13, background: "#3A3F4B" }} />)}
        <div style={{ padding: "50px 46px 0", fontFamily: SERIF, fontWeight: 900, fontSize: 74, color: CL.ink, lineHeight: 1.05 }}>{what}</div>
        <div style={{ padding: "26px 46px 0", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CL.navy, lineHeight: 1.15 }}>{how}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={151} dim={0.2} />
      {page(0, ...d1)}
      {page(1, ...d2)}
      {stamp ? <Stamp text={stamp} at={36} color={CL.red} x="50%" y="84%" rot={-4} size={66} /> : null}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── palito plástico ✓ vs alambre ✗ (con la raya de la porcelana bajo la lupa)
export const ClStickWire: React.FC<{ hi?: number; bed?: string }> = ({ hi = -1, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const crust = lin(f, 30, 70);
  const side = (i: number, ok: boolean, label: string) => {
    const dim = hi >= 0 && hi !== i, k = pop(f, fps, 6 + i * 10, 15);
    return (
      <div style={{ position: "absolute", left: 170 + i * 840, top: 150, width: 720, opacity: out * k * (dim ? 0.45 : 1), translate: `0 ${(1 - k) * 80}px` }}>
        <div style={{ height: 420, borderRadius: 30, background: "radial-gradient(ellipse at 50% 30%, #FFFFFF, #ECEAE4 80%)", boxShadow: `22px 28px 50px ${CL.shadow}`, position: "relative", overflow: "hidden" }}>
          {/* el objeto */}
          {ok ? <div style={{ position: "absolute", left: 120, top: 190, width: 480, height: 26, borderRadius: 13, background: "linear-gradient(180deg, #F2E3C2, #D9C08F)", rotate: "-14deg", boxShadow: "0 8px 14px rgba(0,0,0,0.2)" }} />
            : <svg width={720} height={420} style={{ position: "absolute", left: 0, top: 0 }}><path d="M110 300 L380 180 Q420 160 440 190 Q455 215 420 232 L600 150" stroke="#8A9099" strokeWidth={10} fill="none" strokeLinecap="round" /></svg>}
          {/* la raya en la porcelana, con el sarro que se agarra */}
          {!ok ? <>
            <div style={{ position: "absolute", left: 160, top: 330, width: 420, height: 5, background: "#B9B4A8", rotate: "-6deg" }} />
            {Array.from({ length: 14 }, (_, j) => <div key={j} style={{ position: "absolute", left: 170 + j * 29, top: 318 - j * 3 + rnd(j) * 8, width: 18 + rnd(j + 3) * 14, height: 14 + rnd(j + 5) * 10, borderRadius: "50%", background: "#E2DCCB", opacity: crust, scale: String(0.4 + 0.6 * crust) }} />)}
          </> : null}
        </div>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 20, justifyContent: "center" }}>
          <svg width={70} height={70}>{ok ? <path d="M10 38 L28 56 L60 16" stroke="#2F8F48" strokeWidth={11} fill="none" strokeLinecap="round" /> : <path d="M14 14 L56 56 M56 14 L14 56" stroke={CL.red} strokeWidth={11} strokeLinecap="round" />}</svg>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: CL.ink }}>{label}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={157} dim={0.2} />
      <div style={{ opacity: p }}>
        {side(0, true, "Palito plástico")}
        {side(1, false, "Alambre")}
      </div>
      <div style={{ position: "absolute", left: 1090, top: 70, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CL.red, rotate: "-3deg", opacity: out * lin(f, 40, 52) }}>la raya agarra el sarro</div>
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};
