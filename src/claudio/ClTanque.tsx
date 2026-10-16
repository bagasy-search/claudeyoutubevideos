// Kit del video cltanque: set-pieces DENTRO del mundo del hotel (cama real, sombra, luz de techo), ≤12 palabras.
//   ClFlapperBite  3D real (three.js): la goma NUEVA (roja, firme, plana) al lado de la VIEJA (negra, hinchada, deformada, mordida)
//                  con la pastilla azul de cloro deshaciéndose al lado. hi 0 = la nueva · 1 = la vieja.
//   ClDyeTest      el tanque y la taza en corte: caen gotas de colorante en el tanque, corre el reloj de 15 min y, si la goma pierde
//                  (mode "leak"), el agua de la taza se tiñe de a poco; verdict = sello "la goma pierde".
//   ClLidTowel     la tapa del tanque: PARADA contra la pared ✗ (resbala, cae y se parte) · SOBRE LA TOALLA, boca arriba ✓. hi 0/1.
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

// ── 3D: las dos gomas del tanque (la nueva y la que se comió la pastilla)
const flapperGeo = (bad: boolean) => {
  // disco de goma con labio: perfil torneado; la vieja más gruesa e hinchada, con el borde ondulado (deformada)
  const prof = bad
    ? [[0, 0.34], [0.5, 0.36], [0.95, 0.3], [1.18, 0.12], [1.22, -0.08], [1.05, -0.22], [0.6, -0.26], [0, -0.24]]
    : [[0, 0.16], [0.6, 0.16], [1.0, 0.12], [1.1, 0.02], [1.08, -0.08], [0.7, -0.12], [0, -0.12]];
  const g = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 64);
  if (bad) {
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = Math.atan2(z, x), r = Math.hypot(x, z);
      const k = 1 + 0.09 * Math.sin(a * 5 + 0.7) + 0.06 * Math.sin(a * 11) - (Math.cos(a - 0.6) > 0.82 ? 0.22 * (r / 1.2) : 0); // mordida
      p.setX(i, x * k); p.setZ(i, z * k); p.setY(i, y + 0.05 * Math.sin(a * 3) * (r / 1.2));
    }
    g.computeVertexNormals();
  }
  return g;
};
export const ClFlapperBite: React.FC<{ hi?: number; bed?: string; a?: string; b?: string }> = ({ hi = 1, bed, a = "Nueva", b = "Comida por el cloro" }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T, fps } = useVideoConfig();
  const geoGood = useMemo(() => flapperGeo(false), []), geoBad = useMemo(() => flapperGeo(true), []);
  const mats = useMemo(() => ({
    red: new THREE.MeshStandardMaterial({ color: "#C7352A", roughness: 0.55 }),
    black: new THREE.MeshStandardMaterial({ color: "#26241F", roughness: 0.95 }),
    slime: new THREE.MeshStandardMaterial({ color: "#3E3A2C", roughness: 1, transparent: true, opacity: 0.85 }),
    tab: new THREE.MeshStandardMaterial({ color: "#2E2C27", roughness: 0.9 }),
    tabRed: new THREE.MeshStandardMaterial({ color: "#B22F25", roughness: 0.6 }),
    tablet: new THREE.MeshStandardMaterial({ color: "#2F6FD6", roughness: 0.5 }),
    cloud: new THREE.MeshStandardMaterial({ color: "#5B95F0", roughness: 1, transparent: true, opacity: 0.22, depthWrite: false }),
    floor: new THREE.MeshStandardMaterial({ color: "#F4F2EC", roughness: 0.4 }),
  }), []);
  const dist = interpolate(f, [0, T], [8.4, 7.2], { easing: Easing.out(Easing.quad) });
  const orbit = interpolate(f, [0, T], [-0.35, 0.25]);
  const pos = new THREE.Vector3(Math.sin(orbit) * dist, 5.2, Math.cos(orbit) * dist);
  const target = new THREE.Vector3(0, 0, 0);
  const melt = lin(f, 10, T - 10); // la pastilla se achica
  const swell = 1 + 0.06 * Math.sin(f * 0.08); // la vieja "respira" blanda
  const kA = pop(f, fps, 10), kB = pop(f, fps, 22);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={171} dim={0.24} />
      <Contact x={width / 2} y={height * 0.78} w={1100} o={0.36} />
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [pos.x, pos.y, pos.z] }} gl={{ antialias: true, alpha: true }}>
        <Cam pos={pos} target={target} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[-3, 7, 4]} intensity={1.3} color="#FFF0D8" />
        <directionalLight position={[5, 2, 3]} intensity={0.45} />
        <mesh position={[0, -0.36, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.floor}><circleGeometry args={[5, 48]} /></mesh>
        {/* la nueva */}
        <group position={[-1.7, 0, 0.2]} scale={hi === 1 ? 0.92 : 1.05}>
          <mesh geometry={geoGood} material={mats.red} />
          <mesh position={[0, 0.05, -1.35]} material={mats.tabRed}><boxGeometry args={[0.5, 0.08, 0.55]} /></mesh>
        </group>
        {/* la vieja: hinchada, deformada, con baba */}
        <group position={[1.6, 0.04, 0]} scale={[(hi === 0 ? 0.92 : 1.05) * swell, hi === 0 ? 0.92 : 1.05, (hi === 0 ? 0.92 : 1.05) * swell]} rotation={[0.08, 0.5, -0.06]}>
          <mesh geometry={geoBad} material={mats.black} />
          {Array.from({ length: 9 }, (_, i) => <mesh key={i} material={mats.slime} position={[Math.cos(i * 0.7) * (0.5 + rnd(i) * 0.5), 0.34, Math.sin(i * 0.7) * (0.5 + rnd(i) * 0.5)]} scale={[1, 0.3, 1]}><sphereGeometry args={[0.1 + rnd(i + 3) * 0.08, 10, 8]} /></mesh>)}
          <mesh position={[0, 0.08, -1.32]} rotation={[0.2, 0, 0.1]} material={mats.tab}><boxGeometry args={[0.5, 0.1, 0.5]} /></mesh>
        </group>
        {/* la pastilla azul deshaciéndose al lado de la vieja */}
        <group position={[3.1, -0.22, 1.1]}>
          <mesh material={mats.tablet} scale={[1 - 0.45 * melt, 1 - 0.3 * melt, 1 - 0.45 * melt]}><cylinderGeometry args={[0.42, 0.42, 0.22, 32]} /></mesh>
          <mesh material={mats.cloud} scale={1 + 1.6 * melt}><sphereGeometry args={[0.5, 16, 12]} /></mesh>
        </group>
      </ThreeCanvas>
      <RoomLight k={0.7} />
      {brass(a, width * 0.3, height * 0.24, kA, false)}
      {brass(b, width * 0.68, height * 0.2, kB, true)}
      <div style={{ position: "absolute", left: width * 0.78, top: height * 0.72, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CL.navy, rotate: "-4deg", opacity: lin(f, 30, 44) }}>la pastilla</div>
    </AbsoluteFill>
  );
};

// ── la prueba del colorante: tanque y taza en corte, reloj de 15 min
export const ClDyeTest: React.FC<{ mode?: "leak" | "ok"; verdict?: boolean; bed?: string }> = ({ mode = "leak", verdict = false, bed }) => {
  const f = useCurrentFrame(); const { fps, width, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const leak = mode === "leak";
  const tankBlue = lin(f, 8, 34);                       // el colorante se reparte en el tanque
  const clock = interpolate(f, [verdict ? 0 : 20, verdict ? 20 : T - 10], [verdict ? 0.85 : 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // 15 min
  const bowlBlue = leak ? (verdict ? lin(f, 4, 40, 0.35, 0.9) : clock * 0.55) : 0;
  const blue = (k: number) => `rgba(${Math.round(200 - 150 * k)},${Math.round(225 - 120 * k)},${Math.round(240 - 10 * k)},0.9)`;
  const drops = Array.from({ length: 6 }, (_, i) => { const t = (f - 4 - i * 4) / 14; return t > 0 && t < 1 ? t : -1; });
  const TX = 520, TY = 170;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={173} dim={0.22} />
      <div style={{ position: "absolute", inset: 0, opacity: out * p, translate: `0 ${(1 - p) * 90}px` }}>
        <svg width={width} height={1080} viewBox={`0 0 ${width} 1080`} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs><clipPath id="dtTank"><rect x={TX + 14} y={TY + 14} width={472} height={292} rx={14} /></clipPath><clipPath id="dtBowl"><path d={`M${TX - 40} 560 Q${TX - 20} 900 ${TX + 250} 930 Q${TX + 520} 900 ${TX + 540} 560 Z`} /></clipPath></defs>
          {/* tanque */}
          <rect x={TX} y={TY} width={500} height={320} rx={24} fill="#FBFBF8" stroke="#C9C6BE" strokeWidth={10} />
          <g clipPath="url(#dtTank)"><rect x={TX} y={TY + 90} width={500} height={240} fill={blue(tankBlue)} /></g>
          {/* goma del fondo y caño a la taza */}
          <rect x={TX + 210} y={TY + 300} width={80} height={250} fill="#E9E7E1" stroke="#C9C6BE" strokeWidth={6} />
          <ellipse cx={TX + 250} cy={TY + 298} rx={62} ry={16} fill={leak ? "#2B2925" : "#C7352A"} />
          {leak ? Array.from({ length: 5 }, (_, i) => { const t = ((f * 0.04 + i / 5) % 1); return <circle key={i} cx={TX + 250 + (rnd(i) - 0.5) * 30} cy={TY + 320 + t * 220} r={7} fill={blue(Math.max(tankBlue, 0.4))} opacity={tankBlue * 0.9} />; }) : null}
          {/* taza */}
          <path d={`M${TX - 40} 560 Q${TX - 20} 900 ${TX + 250} 930 Q${TX + 520} 900 ${TX + 540} 560 Z`} fill="#FBFBF8" stroke="#C9C6BE" strokeWidth={10} />
          <g clipPath="url(#dtBowl)"><rect x={TX - 60} y={760} width={640} height={200} fill={blue(bowlBlue)} /></g>
          <rect x={TX - 70} y={540} width={640} height={36} rx={18} fill="#FFFFFF" stroke="#C9C6BE" strokeWidth={8} />
          {/* gotas de colorante */}
          {drops.map((t, i) => t < 0 ? null : <ellipse key={i} cx={TX + 160 + i * 34} cy={TY - 120 + t * 210} rx={11} ry={15} fill="#1E5FD0" />)}
          <rect x={TX + 130} y={TY - 190} width={120} height={70} rx={14} fill="#FFFFFF" stroke="#C9C6BE" strokeWidth={6} opacity={lin(f, 0, 6) * (1 - lin(f, 34, 42))} />
        </svg>
        {/* reloj de 15 min */}
        <div style={{ position: "absolute", left: 1240, top: 230, width: 380, height: 380, borderRadius: "50%", background: "#FFFDF6", boxShadow: `20px 26px 50px ${CL.shadow}, inset 0 0 0 14px ${CL.navy}` }}>
          <svg width={380} height={380} viewBox="0 0 380 380" style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={`M190 190 L190 40 A150 150 0 ${clock > 0.5 ? 1 : 0} 1 ${190 + 150 * Math.sin(clock * Math.PI * 2)} ${190 - 150 * Math.cos(clock * Math.PI * 2)} Z`} fill={CL.yellowSoft} />
            <line x1={190} y1={190} x2={190 + 120 * Math.sin(clock * Math.PI * 2)} y2={190 - 120 * Math.cos(clock * Math.PI * 2)} stroke={CL.ink} strokeWidth={10} strokeLinecap="round" />
            <circle cx={190} cy={190} r={14} fill={CL.ink} />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 1250, top: 640, width: 360, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: CL.ink }}>15 min</div>
        <div style={{ position: "absolute", left: 1235, top: 740, width: 390, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CL.navy, rotate: "-3deg" }}>sin descargar</div>
      </div>
      {verdict ? <Stamp text={leak ? "La goma pierde" : "La goma está bien"} at={18} color={leak ? CL.red : "#2F8F48"} x={`${(770 / width) * 100}%`} y="88%" rot={-4} size={70} /> : null}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── la tapa: parada contra la pared ✗ (cae y se parte) · sobre la toalla ✓
export const ClLidTowel: React.FC<{ hi?: number; crack?: boolean; bed?: string }> = ({ hi = -1, crack = false, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const fall = interpolate(f, [26, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const broke = crack && fall >= 1;
  const side = (i: number, ok: boolean, label: string) => {
    const dim = hi >= 0 && hi !== i, k = pop(f, fps, 4 + i * 10, 15);
    return (
      <div style={{ position: "absolute", left: 170 + i * 840, top: 120, width: 720, opacity: out * k * (dim ? 0.45 : 1), translate: `0 ${(1 - k) * 80}px` }}>
        <div style={{ height: 520, borderRadius: 30, background: "linear-gradient(180deg, #EFE9DF 0 62%, #D8CFC1 62% 63%, #E6E1D7 63%)", boxShadow: `22px 28px 50px ${CL.shadow}`, position: "relative", overflow: "hidden" }}>
          {/* azulejos de la pared */}
          {Array.from({ length: 4 }, (_, r) => Array.from({ length: 5 }, (_, c) => <div key={`${r}-${c}`} style={{ position: "absolute", left: c * 150, top: r * 82, width: 146, height: 78, background: "#F3EEE5", borderRadius: 3 }} />))}
          {ok ? (
            <>
              {/* toalla y tapa acostada boca arriba */}
              <div style={{ position: "absolute", left: 120, top: 380, width: 480, height: 90, borderRadius: 14, background: "repeating-linear-gradient(90deg, #9DB7D8 0 18px, #8DA9CE 18px 36px)", boxShadow: "0 10px 18px rgba(0,0,0,0.18)" }} />
              <div style={{ position: "absolute", left: 160, top: 340, width: 400, height: 70, borderRadius: 18, background: "linear-gradient(180deg, #FFFFFF, #E9E7E1)", boxShadow: "0 12px 16px rgba(0,0,0,0.22)" }} />
            </>
          ) : (
            <>
              {/* tapa parada que resbala y cae */}
              <div style={{ position: "absolute", left: 300, top: 70, width: 70, height: 380, borderRadius: 16, background: "linear-gradient(90deg, #E9E7E1, #FFFFFF 40%, #E2DFD8)", boxShadow: "8px 10px 16px rgba(0,0,0,0.25)", transformOrigin: "50% 100%", rotate: `${-8 - 80 * fall}deg`, opacity: broke ? 0 : 1 }} />
              {broke ? (
                <>
                  <div style={{ position: "absolute", left: 40, top: 420, width: 200, height: 60, borderRadius: 14, background: "#F4F2EC", rotate: "-6deg", clipPath: "polygon(0 0, 100% 0, 86% 100%, 0 100%)", boxShadow: "0 8px 12px rgba(0,0,0,0.22)" }} />
                  <div style={{ position: "absolute", left: 230, top: 430, width: 190, height: 56, borderRadius: 14, background: "#ECE9E2", rotate: "9deg", clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)", boxShadow: "0 8px 12px rgba(0,0,0,0.22)" }} />
                </>
              ) : null}
            </>
          )}
        </div>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 20, justifyContent: "center" }}>
          {tick(ok)}
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: CL.ink }}>{label}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={179} dim={0.2} />
      {side(0, false, "Parada en la pared")}
      {side(1, true, "Sobre la toalla")}
      {broke ? <Stamp text="Se parte en dos" at={48} color={CL.red} x="27%" y="10%" rot={-5} size={62} /> : null}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};
