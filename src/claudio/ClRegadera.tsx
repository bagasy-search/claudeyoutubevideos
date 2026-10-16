// Kit del video clregadera: set-pieces DENTRO del mundo del hotel (cama real, sombra, luz de techo), ≤12 palabras.
//   ClNozzleCut   3D real (three.js): la cara de la regadera con sus agujeritos; mode "clog" = piedra blanca tapando casi todos,
//                 "grow" = la piedra crece capa sobre capa, "dissolve" = el vinagre la deshace con burbujitas.
//   ClFinishCheck las dos regaderas: CROMO (toda la noche) · DORADA o NEGRA (media hora, no más). hi 0/1.
//   ClBagTie      la bolsa con vinagre atada al cuello de la regadera: la liga da 1, 2, 3 vueltas.
//   ClNubRub      la cara de goma en primer plano: el pulgar con guante pasa y la costra blanca se cae.
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
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: k, scale: String(0.85 + 0.15 * k), background: alert ? CL.red : `linear-gradient(160deg, ${CL.brassLight}, ${CL.brass} 50%, #8C6831)`, color: alert ? "#fff" : CL.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 42, letterSpacing: 2, padding: "6px 24px", borderRadius: 8, boxShadow: `0 10px 22px ${CL.shadow}, inset 0 2px 0 rgba(255,255,255,0.45)`, whiteSpace: "nowrap" }}>{txt.toUpperCase()}</div>
);
const tick = (ok: boolean, s = 70): React.ReactNode => (
  <svg width={s} height={s} viewBox="0 0 70 70">{ok ? <path d="M10 38 L28 56 L60 16" stroke="#2F8F48" strokeWidth={11} fill="none" strokeLinecap="round" /> : <path d="M14 14 L56 56 M56 14 L14 56" stroke={CL.red} strokeWidth={11} strokeLinecap="round" />}</svg>
);

// ── 3D: la cara de la regadera y la piedra en los agujeritos
const HOLES = (() => {
  const h: { x: number; z: number; i: number }[] = []; let i = 0;
  [[0, 1], [0.62, 7], [1.2, 13], [1.76, 19]].forEach(([r, n]) => { for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2 + r; h.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, i: i++ }); } });
  return h;
})();
export const ClNozzleCut: React.FC<{ mode?: "clog" | "grow" | "dissolve"; bed?: string }> = ({ mode = "clog", bed }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T, fps } = useVideoConfig();
  const mats = useMemo(() => ({
    chrome: new THREE.MeshStandardMaterial({ color: "#D6DADF", metalness: 0.85, roughness: 0.22 }),
    rim: new THREE.MeshStandardMaterial({ color: "#B9BEC5", metalness: 0.9, roughness: 0.3 }),
    hole: new THREE.MeshStandardMaterial({ color: "#16181B", roughness: 0.8 }),
    crust: new THREE.MeshStandardMaterial({ color: "#F2EEE2", roughness: 1 }),
    bubble: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.1, transparent: true, opacity: 0.55, depthWrite: false }),
    liquid: new THREE.MeshStandardMaterial({ color: "#DDEBF2", roughness: 0.1, transparent: true, opacity: 0.16, depthWrite: false }),
  }), []);
  const dist = interpolate(f, [0, T], [7.6, 6.4], { easing: Easing.out(Easing.quad) });
  const orbit = interpolate(f, [0, T], [-0.25, 0.2]);
  const pos = new THREE.Vector3(Math.sin(orbit) * dist, 4.6, Math.cos(orbit) * dist);
  const crustOf = (i: number) => {
    const d = rnd(i * 3 + 1);
    if (mode === "clog") return d < 0.72 ? 1 : 0.35;
    if (mode === "grow") return interpolate(f, [6 + d * (T * 0.45), 6 + d * (T * 0.45) + T * 0.35], [0.05, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return interpolate(f, [8 + d * (T * 0.4), 8 + d * (T * 0.4) + T * 0.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };
  const label = mode === "clog" ? "Piedra en cada agujerito" : mode === "grow" ? "Capa sobre capa" : "El vinagre la deshace";
  const k = pop(f, fps, 12);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={181} dim={0.24} />
      <Contact x={width / 2} y={height * 0.8} w={1000} o={0.34} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [pos.x, pos.y, pos.z] }} gl={{ antialias: true, alpha: true }}>
        <Cam pos={pos} target={new THREE.Vector3(0, 0, 0)} />
        <ambientLight intensity={0.7} />
        <hemisphereLight args={["#FFFFFF", "#8A8F96", 0.6]} />
        <directionalLight position={[-3, 7, 4]} intensity={1.4} color="#FFF3E0" />
        <directionalLight position={[5, 3, -2]} intensity={0.7} />
        <group rotation={[0, 0, 0]}>
          <mesh material={mats.rim} position={[0, -0.2, 0]}><cylinderGeometry args={[2.35, 2.2, 0.32, 72]} /></mesh>
          <mesh material={mats.chrome}><cylinderGeometry args={[2.2, 2.2, 0.1, 72]} /></mesh>
          {HOLES.map((h) => {
            const c = crustOf(h.i);
            return (
              <group key={h.i} position={[h.x, 0.06, h.z]}>
                <mesh material={mats.hole}><cylinderGeometry args={[0.1, 0.1, 0.02, 20]} /></mesh>
                {c > 0.02 ? <mesh material={mats.crust} position={[0, 0.02 + 0.05 * c, 0]} scale={[0.6 + 0.9 * c, 0.4 + 1.4 * c, 0.6 + 0.9 * c]}><sphereGeometry args={[0.12, 14, 10]} /></mesh> : null}
                {mode === "dissolve" && c > 0.05 && c < 0.98 ? Array.from({ length: 3 }, (_, b) => { const t = ((f * 0.03 + rnd(h.i + b * 7)) % 1); return <mesh key={b} material={mats.bubble} position={[(rnd(h.i * 5 + b) - 0.5) * 0.2, 0.15 + t * 1.6, (rnd(h.i * 9 + b) - 0.5) * 0.2]}><sphereGeometry args={[0.035 + 0.02 * rnd(b + h.i), 8, 6]} /></mesh>; }) : null}
              </group>
            );
          })}
          {mode === "dissolve" ? <mesh material={mats.liquid} position={[0, 0.9, 0]}><cylinderGeometry args={[2.6, 2.6, 1.7, 48, 1, true]} /></mesh> : null}
        </group>
      </ThreeCanvas>
      <RoomLight k={0.7} />
      {brass(label, width * 0.5, height * 0.12, k, mode !== "dissolve")}
      <div style={{ position: "absolute", left: width * 0.76, top: height * 0.74, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CL.navy, rotate: "-4deg", opacity: lin(f, 26, 40) }}>{mode === "dissolve" ? "toda la noche" : "por dentro"}</div>
    </AbsoluteFill>
  );
};

// ── cromo o dorada: la cara de la regadera dibujada, con su tiempo
const headSvg = (gold: boolean): React.ReactNode => (
  <svg width={300} height={300} viewBox="0 0 300 300">
    <defs>
      <radialGradient id={gold ? "fcG" : "fcC"} cx="38%" cy="32%" r="75%">
        {gold ? (<><stop offset="0" stopColor="#FFF0B8" /><stop offset="0.45" stopColor="#D8A845" /><stop offset="1" stopColor="#8E6420" /></>) : (<><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.45" stopColor="#C9CED5" /><stop offset="1" stopColor="#7D838B" /></>)}
      </radialGradient>
    </defs>
    <circle cx={150} cy={150} r={132} fill={`url(#${gold ? "fcG" : "fcC"})`} stroke={gold ? "#7A561C" : "#6E747C"} strokeWidth={6} />
    {HOLES.map((h) => <circle key={h.i} cx={150 + h.x * 62} cy={150 + h.z * 62} r={6.5} fill={gold ? "#5A3F12" : "#2A2D31"} />)}
  </svg>
);
export const ClFinishCheck: React.FC<{ hi?: number; bed?: string }> = ({ hi = 0, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const card = (i: number) => {
    const gold = i === 1, on = hi === i, k = pop(f, fps, 4 + i * 8, 15);
    return (
      <div style={{ position: "absolute", left: 210 + i * 800, top: 150, width: 700, height: 760, borderRadius: 34, background: on ? "#FFFDF6" : "#F2EFE8", boxShadow: on ? `0 0 0 10px ${gold ? "#C8962F" : CL.navy}, 24px 30px 60px ${CL.shadow}` : `14px 18px 34px ${CL.shadow}`, opacity: out * k * (on ? 1 : 0.42), translate: `0 ${(1 - k) * 80}px`, scale: String(on ? 1 + 0.03 * lin(f, 14, 30) : 0.94), display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 50 }}>
        {headSvg(gold)}
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 74, color: CL.ink, marginTop: 26 }}>{gold ? "Dorada o negra" : "Cromo, plateada"}</div>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 18 }}>
          {tick(true, 64)}
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 52, color: gold ? "#8E6420" : CL.navy, letterSpacing: 2 }}>{gold ? "MEDIA HORA" : "TODA LA NOCHE"}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={183} dim={0.22} />
      {card(0)}
      {card(1)}
      {hi === 1 ? <Stamp text="Nunca toda la noche" at={20} color={CL.red} x="72%" y="90%" rot={-4} size={60} /> : null}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── la bolsa atada: la liga da 1, 2, 3 vueltas
export const ClBagTie: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, width } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const turns = Math.min(3, Math.floor(interpolate(f, [14, 70], [0, 3.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const slosh = Math.sin(f * 0.12) * 6;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={185} dim={0.22} />
      <div style={{ position: "absolute", inset: 0, opacity: out * p, translate: `0 ${(1 - p) * 80}px` }}>
        <svg width={width} height={1080} viewBox={`0 0 ${width} 1080`} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs><linearGradient id="btArm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F4F6F8" /><stop offset="0.5" stopColor="#B8BEC6" /><stop offset="1" stopColor="#7E858E" /></linearGradient></defs>
          {/* pared y brazo de la regadera */}
          <rect x={0} y={0} width={width} height={1080} fill="none" />
          <rect x={300} y={170} width={520} height={46} rx={23} fill="url(#btArm)" />
          <rect x={790} y={170} width={70} height={150} rx={20} fill="url(#btArm)" transform="rotate(-18 825 190)" />
          {/* la bolsa con vinagre */}
          <path d={`M700 300 Q660 520 700 700 Q800 800 920 790 Q1040 780 1060 680 Q1090 520 1010 300 Z`} fill="rgba(235,244,250,0.55)" stroke="#AFC3D2" strokeWidth={5} />
          <path d={`M682 ${470 + slosh} Q860 ${455 - slosh} 1050 ${470 + slosh} Q1080 560 1060 680 Q1040 780 920 790 Q800 800 700 700 Q660 600 682 ${470 + slosh} Z`} fill="rgba(214,226,206,0.75)" />
          {/* la cara de la regadera dentro, bajo el vinagre */}
          <ellipse cx={860} cy={560} rx={150} ry={60} fill="#C9CED5" stroke="#7D838B" strokeWidth={5} />
          {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={760 + i * 25} cy={560 + Math.sin(i) * 8} r={5} fill="#2A2D31" />)}
          {/* la liga: vueltas que se suman */}
          {Array.from({ length: turns }, (_, i) => <ellipse key={i} cx={850} cy={300 + i * 16} rx={170 - i * 4} ry={20} fill="none" stroke="#C8562E" strokeWidth={12} />)}
        </svg>
        <div style={{ position: "absolute", left: 1260, top: 300, width: 520, textAlign: "center" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: CL.ink, lineHeight: 1 }}>{turns}</div>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 52, color: CL.navy, letterSpacing: 2 }}>{turns === 1 ? "VUELTA" : "VUELTAS"} DE LIGA</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CL.navy, rotate: "-3deg", marginTop: 26, opacity: lin(f, 60, 74) }}>que no se caiga de noche</div>
        </div>
      </div>
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── las puntitas de goma: el pulgar pasa y la costra se cae
export const ClNubRub: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, width, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const sweep = interpolate(f, [16, Math.max(40, T - 20)], [260, 1660], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const nubs: { x: number; y: number; i: number }[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) nubs.push({ x: 330 + c * 160 + (r % 2) * 80, y: 330 + r * 140, i: r * 9 + c });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={187} dim={0.22} />
      <div style={{ position: "absolute", inset: 0, opacity: out * p }}>
        <svg width={width} height={1080} viewBox={`0 0 ${width} 1080`} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs><radialGradient id="nrFace" cx="40%" cy="30%" r="80%"><stop offset="0" stopColor="#F3F5F7" /><stop offset="0.6" stopColor="#BFC5CC" /><stop offset="1" stopColor="#868C94" /></radialGradient></defs>
          <rect x={200} y={220} width={1520} height={640} rx={60} fill="url(#nrFace)" stroke="#6E747C" strokeWidth={8} />
          {nubs.map((n) => {
            const passed = sweep > n.x + 30; const t = passed ? Math.min(1, (sweep - n.x - 30) / 260) : 0;
            return (
              <g key={n.i}>
                <circle cx={n.x} cy={n.y} r={34} fill="#2A2C2F" />
                <circle cx={n.x - 9} cy={n.y - 10} r={10} fill="#4A4D52" />
                {t < 1 ? <ellipse cx={n.x + 6 * t} cy={n.y - 4 + 160 * t * t} rx={30 - 6 * t} ry={22 - 4 * t} fill="#F1EDE1" opacity={1 - t} /> : null}
              </g>
            );
          })}
        </svg>
        {/* el pulgar con guante azul */}
        <div style={{ position: "absolute", left: sweep - 120, top: 360 + Math.sin(f * 0.5) * 12, width: 240, height: 420, borderRadius: "120px 120px 90px 90px", background: "linear-gradient(100deg, #3F78D8, #2B5BB8 60%, #234C9C)", boxShadow: "18px 24px 40px rgba(0,0,0,0.28), inset 10px 10px 0 rgba(255,255,255,0.18)", opacity: lin(f, 10, 18) * (1 - lin(f, T - 10, T)) }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", opacity: out * pop(f, fps, 6) }}>{brass("Las puntitas de goma", 0, 0, 1)}</div>
      <Stamp text="Se cae sola" at={Math.round(T * 0.55)} color="#2F8F48" x="50%" y="90%" rot={-4} size={66} />
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};
