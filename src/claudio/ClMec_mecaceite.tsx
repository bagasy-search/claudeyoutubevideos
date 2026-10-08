// Kit del ep. 6 (mecaceite: los 9 errores después de cambiar el aceite) — todo DENTRO del mundo (cama real + luz + sombra).
//   ClDipstick     la punta de la varilla sobre el trapo blanco con las 2 marcas: "over" el aceite muy por encima y gotea · "ok" justo debajo
//                  de la de arriba ✓ · "low" debajo de la de abajo · "how" los 3 pasos (plano · 5 min apagado · limpiar y volver a meter)
//   ClCrankFoam    el cárter en corte con el cigüeñal girando: "high" el nivel lo toca, lo bate y sale espuma · "ok" gira por encima, aceite liso
//   ClDoubleGasket el filtro de aceite en corte contra el motor: "ok" una sola goma aceitada con el dedo · "double" la goma vieja pegada + la
//                  nueva encima: al arrancar la de abajo se sale y el aceite sale a chorro
//   ClOilLabel     el bidón de aceite con la etiqueta de atrás en perspectiva: "grade" el número (0W = en frío · 20 = en caliente) · "norm" la
//                  norma (API SP / la de la marca): número correcto + norma equivocada = aceite equivocado
//   ClOilLight     el tablero con la luz ROJA de la aceitera que se prende andando: los segundos corren y "APAGA YA" · "amber" la llavecita
//                  de servicio (no es lo mismo)
//   ClCrushWasher  el tapón del cárter con su arandela: "new" la nueva se aplasta una vez y sella · "reused" la aplastada 3 veces deja la gota
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, lin, pop, useOut } from "./ClParts";
import { Cam, Tag, Note, Dial } from "./ClMecParts";

const GREEN = "#2E7D32", OIL = "#C08A2A", OILD = "#8A5A12";
const rnd = (s: number) => { const x = Math.sin(s * 127.1) * 43758.5453; return x - Math.floor(x); };

// ── ClDipstick ───────────────────────────────────────────────────────────────
export const ClDipstick: React.FC<{ mode?: "over" | "ok" | "low" | "how"; bed?: string }> = ({ mode = "over", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  if (mode === "how") {
    const steps: [string, string][] = [["Lugar plano", "no en la bajada"], ["5 minutos apagado", "que baje todo"], ["Limpiar y volver a meter", "con un trapo blanco"]];
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={1101} dim={0.3} />
        <div style={{ position: "absolute", left: 160, top: 260, display: "flex", gap: 46 }}>
          {steps.map(([a, b], i) => { const k = pop(f, fps, 6 + i * 12, 14); return (
            <div key={i} style={{ width: 500, opacity: clamp01(k * 1.4), translate: `0 ${(1 - clamp01(k)) * 40}px` }}>
              <Card style={{ padding: "26px 30px", borderBottom: `8px solid ${CL.nitrile}` }}>
                <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: CL.nitrile, lineHeight: 1 }}>{i + 1}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CL.ink, lineHeight: 1.05 }}>{a}</div>
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CL.inkSoft }}>{b}</div>
              </Card>
            </div>); })}
        </div>
        <Tag x={160} y={120} text="Cómo se mide bien" color={CL.navy} o={lin(f, 4, 12)} size={52} />
        <RoomLight k={0.5} />
      </AbsoluteFill>
    );
  }
  // la varilla de costado; la PUNTA (lo que entra al fondo del motor) a la derecha: MIN cerca de la punta (x=1380), MAX más arriba (x=1180); el aceite sube desde la punta hacia la izquierda
  const lvl = mode === "over" ? 960 : mode === "ok" ? 1205 : 1460; // x donde termina la película de aceite (menor = más alto)
  const k = ease(clamp01((f - 8) / 20));
  const edge = 1700 - (1700 - lvl) * k;
  const drop = mode === "over" ? ((f - 30) % 34) / 34 : -1;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1102} dim={0.25} />
      {/* trapo blanco */}
      <div style={{ position: "absolute", left: 300, top: 520, width: 1500, height: 360, background: "linear-gradient(170deg,#FFFFFF,#ECEBE6)", borderRadius: 26, rotate: "-2deg", boxShadow: "0 30px 50px rgba(0,0,0,0.3)", opacity: clamp01(p * 1.4) }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: clamp01(p * 1.4) }}>
        <defs><linearGradient id="ds_m" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E3E6EA" /><stop offset="50%" stopColor="#9EA5AD" /><stop offset="100%" stopColor="#D0D4D9" /></linearGradient></defs>
        <rect x={120} y={560} width={1600} height={36} rx={14} fill="url(#ds_m)" />
        <path d="M 1718 560 q 40 18 0 36 Z" fill="#9EA5AD" />
        {/* zona rayada entre marcas */}
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={1190 + i * 22} y1={562} x2={1178 + i * 22} y2={594} stroke="#6F767E" strokeWidth={3} />)}
        <circle cx={1180} cy={578} r={9} fill="#5E646C" /><circle cx={1380} cy={578} r={9} fill="#5E646C" />
        {/* el aceite */}
        <rect x={edge} y={556} width={1720 - edge} height={44} rx={16} fill={hexA(OIL, 0.88)} />
        <rect x={edge} y={558} width={1720 - edge} height={10} rx={5} fill="rgba(255,240,200,0.6)" />
        {drop >= 0 ? <ellipse cx={edge + 40} cy={606 + drop * 260} rx={11} ry={15} fill={OIL} opacity={1 - drop * 0.3} /> : null}
        <text x={1145} y={650} fontFamily={LABEL} fontWeight={700} fontSize={40} fill={CL.ink}>MAX</text>
        <text x={1352} y={650} fontFamily={LABEL} fontWeight={700} fontSize={40} fill={CL.ink}>MIN</text>
        {mode === "over" ? <path d={`M 1180 700 L 1180 740 L ${edge} 740 L ${edge} 700`} fill="none" stroke={CL.red} strokeWidth={8} opacity={lin(f, 30, 40)} /> : null}
      </svg>
      {mode === "over" ? <><Tag x={300} y={200} text="Muy por encima de la marca" color={CL.red} o={lin(f, 8, 18)} size={50} /><Note x={300} y={790} o={lin(f, 34, 46)} big="Casi 1 litro de más" small="y gotea" color={CL.red} w={520} /></> : null}
      {mode === "ok" ? <><Tag x={300} y={200} text="Entre las marcas, cerca de la de arriba" color={GREEN} o={lin(f, 8, 18)} size={46} /><Note x={300} y={790} o={lin(f, 30, 42)} big="Así ✓" small="nunca por encima" w={420} /></> : null}
      {mode === "low" ? <><Tag x={300} y={200} text="Debajo de la de abajo" color={CL.red} o={lin(f, 8, 18)} size={50} /><Note x={300} y={790} o={lin(f, 30, 42)} big="Falta aceite" small="se calienta y se gasta" color={CL.red} w={520} /></> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ── ClCrankFoam ──────────────────────────────────────────────────────────────
export const ClCrankFoam: React.FC<{ mode?: "high" | "ok"; bed?: string }> = ({ mode = "high", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const ang = f * 22; // grados por cuadro: gira rápido
  const level = mode === "high" ? 540 : 650; // y de la superficie
  const foam = mode === "high" ? ease(clamp01((f - 14) / (T * 0.5))) : 0;
  const cx = 960, cy = 520;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1111} dim={0.3} />
      <div style={{ position: "absolute", inset: 0, opacity: clamp01(p * 1.4), scale: String(0.9 + 0.1 * p) }}>
        <svg width={1920} height={1080}>
          <defs><clipPath id="cf_pan"><path d="M 560 380 L 1360 380 L 1300 820 L 620 820 Z" /></clipPath></defs>
          {/* bloque arriba */}
          <rect x={540} y={150} width={840} height={240} fill="#8E949C" stroke="#5E646C" strokeWidth={6} />
          {[680, 880, 1080, 1260].map((x, i) => <rect key={i} x={x - 55} y={170} width={110} height={200} fill="#6F757D" />)}
          {/* cárter */}
          <path d="M 560 380 L 1360 380 L 1300 820 L 620 820 Z" fill="#3A3D42" stroke="#26282C" strokeWidth={6} />
          <g clipPath="url(#cf_pan)">
            <rect x={540} y={level} width={860} height={400} fill={hexA(OIL, 0.92)} />
            <path d={`M 540 ${level} ${Array.from({ length: 18 }, (_, i) => `Q ${560 + i * 48 + 24} ${level - 10 * Math.sin(f * 0.4 + i)} ${560 + (i + 1) * 48} ${level}`).join(" ")}`} fill="none" stroke="rgba(255,235,190,0.7)" strokeWidth={5} />
            {/* espuma */}
            {foam > 0 ? Array.from({ length: 90 }, (_, i) => { const x = 580 + rnd(i) * 760, y = level - 30 + rnd(i + 7) * 220 * foam; return <circle key={i} cx={x + Math.sin(f * 0.3 + i) * 4} cy={y} r={(6 + rnd(i + 3) * 14) * foam} fill="rgba(255,248,225,0.85)" stroke="rgba(190,150,80,0.6)" strokeWidth={2} />; }) : null}
          </g>
          {/* cigüeñal */}
          <g transform={`translate(${cx} ${cy}) rotate(${ang})`}>
            <rect x={-26} y={-26} width={52} height={52} rx={10} fill="#AEB3B9" />
            <path d="M -20 0 L -40 120 L 40 120 L 20 0 Z" fill="#C9CDD2" stroke="#7D858F" strokeWidth={4} />
            <ellipse cx={0} cy={135} rx={90} ry={34} fill="#9AA1A9" stroke="#6F767E" strokeWidth={4} />
            <circle cx={0} cy={0} r={18} fill="#5E646C" />
          </g>
          {mode === "high" ? Array.from({ length: 10 }, (_, i) => { const t = ((f * 0.05 + i / 10) % 1); const a = (ang + i * 36) * Math.PI / 180; return <circle key={i} cx={cx + Math.sin(a) * (140 + t * 120)} cy={cy - Math.cos(a) * (140 + t * 60) + t * 80} r={7} fill={OIL} opacity={1 - t} />; }) : null}
        </svg>
      </div>
      {mode === "high" ? <><Tag x={1420} y={210} text="Aceite de más" color={CL.red} o={lin(f, 6, 16)} size={52} /><Note x={1420} y={330} o={lin(f, T * 0.45, T * 0.45 + 10)} big="Lo bate: espuma" small="las burbujas no lubrican" color={CL.red} w={440} /></> : null}
      {mode === "ok" ? <><Tag x={1420} y={210} text="Nivel correcto" color={GREEN} o={lin(f, 6, 16)} size={52} /><Note x={1420} y={330} o={lin(f, 20, 32)} big="Gira por encima" small="aceite liso ✓" w={420} /></> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ── ClDoubleGasket (three.js) ────────────────────────────────────────────────
const FilterMesh: React.FC<{ mats: any; dbl: boolean; slip: number; oiled: number }> = ({ mats, dbl, slip, oiled }) => (
  <group rotation={[0.35, 0, 0]}>
    {/* el motor (la base donde asienta) */}
    <mesh material={mats.block} position={[0, 1.35, 0]}><boxGeometry args={[3.4, 0.6, 3.4]} /></mesh>
    {/* goma vieja pegada (si doble) */}
    {dbl ? <mesh material={mats.old} position={[slip * 1.6, 0.98 - slip * 0.2, slip * 0.4]} rotation={[Math.PI / 2, 0, slip * 0.6]}><torusGeometry args={[0.85, 0.08, 14, 48]} /></mesh> : null}
    {/* goma nueva */}
    <mesh material={oiled > 0.5 ? mats.oiled : mats.rubber} position={[0, dbl ? 0.84 : 0.98, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.85, 0.08, 14, 48]} /></mesh>
    {/* el filtro (lata) */}
    <mesh material={mats.can} position={[0, dbl ? -0.05 : 0.1, 0]}><cylinderGeometry args={[1.05, 1.05, 1.6, 48]} /></mesh>
    <mesh material={mats.cap} position={[0, dbl ? 0.76 : 0.91, 0]}><cylinderGeometry args={[1.05, 1.05, 0.08, 48]} /></mesh>
  </group>
);
export const ClDoubleGasket: React.FC<{ mode?: "ok" | "double"; bed?: string }> = ({ mode = "double", bed }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 15);
  const mats = useMemo(() => ({
    block: new THREE.MeshStandardMaterial({ color: "#8E949C", roughness: 0.5, metalness: 0.4 }),
    rubber: new THREE.MeshStandardMaterial({ color: "#1E1F22", roughness: 0.8 }),
    oiled: new THREE.MeshStandardMaterial({ color: "#2A2015", roughness: 0.2, metalness: 0.2 }),
    old: new THREE.MeshStandardMaterial({ color: "#3A2A18", roughness: 0.9 }),
    can: new THREE.MeshStandardMaterial({ color: "#1F4FA0", roughness: 0.35, metalness: 0.5 }),
    cap: new THREE.MeshStandardMaterial({ color: "#C9CDD2", roughness: 0.3, metalness: 0.8 }),
  }), []);
  const dbl = mode === "double";
  const slip = dbl ? ease(clamp01((f - T * 0.45) / 12)) : 0;
  const oiled = mode === "ok" ? clamp01((f - 14) / 10) : 1;
  const a = interpolate(f, [0, T], [-0.4, 0.3]);
  const target = new THREE.Vector3(0, 0.6, 0), camPos = new THREE.Vector3(Math.sin(a) * 11, 1.2, Math.cos(a) * 11);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1121} dim={0.28} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-0.12 * width}px) scale(${0.82 + 0.18 * p})`, opacity: clamp01(p * 1.4) }}>
        <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
          <Cam pos={camPos} target={target} />
          <ambientLight intensity={1} />
          <hemisphereLight args={["#FFFFFF", "#6B6257", 0.7]} />
          <directionalLight position={[-3, 5, 4]} intensity={1.6} color="#FFF3DF" />
          <directionalLight position={[4, 1, -2]} intensity={0.6} />
          <FilterMesh mats={mats} dbl={dbl} slip={slip} oiled={oiled} />
        </ThreeCanvas>
      </div>
      {dbl && slip > 0 ? <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 16 }, (_, i) => { const t = ((f * 0.05 + i / 16) % 1); return <circle key={i} cx={980 + t * 500} cy={430 + t * t * 420 + (i % 3) * 12} r={12 - t * 5} fill={OIL} opacity={slip * (1 - t * 0.6)} />; })}</svg> : null}
      {mode === "ok" ? <><Tag x={1220} y={210} text="Una sola goma, aceitada" color={GREEN} o={lin(f, 8, 18)} size={46} /><Note x={1220} y={330} o={lin(f, 26, 38)} big="Con el dedo" small="mano + ¼ de vuelta ✓" w={520} /></> : null}
      {dbl ? <><Tag x={1220} y={210} text="La goma vieja quedó pegada" color={CL.red} o={lin(f, 8, 18)} size={46} /><Note x={1220} y={330} o={lin(f, T * 0.5, T * 0.5 + 10)} big="Sale a chorro" small="en minutos, sin aceite" color={CL.red} w={520} /></> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ── ClOilLabel ───────────────────────────────────────────────────────────────
export const ClOilLabel: React.FC<{ mode?: "grade" | "norm"; bed?: string }> = ({ mode = "grade", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const k1 = lin(f, 14, 24), k2 = lin(f, 30, 40);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1131} dim={0.28} />
      <Contact x={720} y={940} w={700} o={0.35} />
      {/* el bidón */}
      <div style={{ position: "absolute", left: 360, top: 140 + (1 - p) * 120, width: 700, height: 800, opacity: clamp01(p * 1.4), transform: "perspective(1600px) rotateY(16deg)" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "60px 120px 40px 40px", background: "linear-gradient(90deg,#D9B640,#F2D35A 45%,#C9A632)", boxShadow: "0 40px 70px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 470, top: -60, width: 140, height: 90, borderRadius: 14, background: "#2B2F36" }} />
        <div style={{ position: "absolute", left: 60, top: 160, width: 580, height: 560, background: "#FBF8EE", borderRadius: 12, padding: 30, boxSizing: "border-box" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, color: CL.inkSoft, letterSpacing: 2 }}>ACEITE DE MOTOR</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: CL.ink, lineHeight: 1, marginTop: 10, position: "relative" }}>
            <span style={{ background: mode === "grade" ? hexA("#7FB7D6", 0.55 * k1) : "transparent", borderRadius: 10 }}>0W</span>-<span style={{ background: mode === "grade" ? hexA(CL.yellow, 0.6 * k2) : "transparent", borderRadius: 10 }}>20</span>
          </div>
          <div style={{ marginTop: 40, fontFamily: LABEL, fontWeight: 700, fontSize: 64, color: CL.navy, display: "inline-block", padding: "6px 18px", border: `5px solid ${mode === "norm" ? CL.nitrile : "transparent"}`, borderRadius: 12, opacity: mode === "norm" ? 1 : 0.7 }}>API SP</div>
          <div style={{ marginTop: 24, fontFamily: LABEL, fontSize: 32, color: CL.inkSoft }}>4 L</div>
        </div>
      </div>
      {mode === "grade" ? <>
        <Note x={1180} y={230} o={k1} big="0W = en frío" small="qué tan bien fluye al arrancar" color="#3F86B0" w={600} />
        <Note x={1180} y={470} o={k2} big="20 = en caliente" small="qué tan espeso trabajando" color="#B08A10" w={600} />
        <Tag x={1180} y={730} text="El que dice tu manual" color={CL.navy} o={lin(f, 46, 56)} size={46} />
      </> : <>
        <Note x={1180} y={230} o={k1} big="La norma: API SP" small="o la de la marca de tu auto" w={600} />
        <Note x={1180} y={470} o={k2} big="Número bien + norma mal" small="= aceite equivocado" color={CL.red} w={600} />
      </>}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ── ClOilLight ───────────────────────────────────────────────────────────────
const OilCan: React.FC<{ c: string; size?: number }> = ({ c, size = 160 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 160 96"><path d="M 20 40 L 70 40 L 80 30 L 110 30 L 150 50 L 150 58 L 120 50 L 110 78 L 30 78 Q 20 78 20 68 Z M 0 30 L 22 42 L 22 52 L 0 44 Z" fill={c} /><ellipse cx={152} cy={72} rx={6} ry={9} fill={c} /></svg>
);
export const ClOilLight: React.FC<{ mode?: "red" | "amber"; bed?: string }> = ({ mode = "red", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const on = mode === "red" ? lin(f, 10, 13) * (0.7 + 0.3 * Math.sin(f * 0.6)) : lin(f, 10, 14);
  const secs = mode === "red" ? Math.max(0, 60 - Math.floor(Math.max(0, f - 16) / 2)) : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1141} dim={0.2} />
      <div style={{ position: "absolute", left: 260, top: 150 + (1 - p) * 120, width: 1400, height: 720, transform: "perspective(2000px) rotateX(14deg) rotateY(-6deg)", opacity: clamp01(p * 1.4) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 220, background: "linear-gradient(#22262D,#0E1014)", boxShadow: "0 50px 80px rgba(0,0,0,0.55)" }} />
        <Dial x={120} y={150} d={440} ang={-70 + Math.sin(f * 0.3) * 2} label="RPM" />
        <Dial x={840} y={150} d={440} ang={-10} label="KM/H" />
        <div style={{ position: "absolute", left: 600, top: 300, width: 200, height: 140, display: "flex", alignItems: "center", justifyContent: "center", opacity: on, filter: `drop-shadow(0 0 ${30 * on}px ${mode === "red" ? "rgba(255,40,30,0.9)" : "rgba(255,170,30,0.9)"})` }}>
          {mode === "red" ? <OilCan c="#FF3B30" /> : <svg width={120} height={120} viewBox="0 0 120 120"><path d="M 80 14 a 26 26 0 1 0 22 36 l -54 54 a 12 12 0 0 1 -17 -17 l 54 -54 a 26 26 0 0 0 -5 -19 Z" fill="#FFB020" /></svg>}
        </div>
      </div>
      {mode === "red" ? <>
        <Tag x={200} y={70} text="Luz roja del aceite" color={CL.red} o={lin(f, 12, 20)} size={52} />
        <div style={{ position: "absolute", left: 1240, top: 830, opacity: lin(f, 16, 24) }}>
          <Card style={{ padding: "16px 34px", background: CL.red, borderBottom: `8px solid ${CL.navy}` }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: "#fff", lineHeight: 1 }}>APAGA YA</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: "#FFE3E3" }}>sin presión de aceite · {secs} s</div>
          </Card>
        </div>
      </> : <>
        <Tag x={200} y={70} text="La llavecita: aviso de servicio" color="#B07A10" o={lin(f, 12, 20)} size={48} />
        <Note x={1240} y={830} o={lin(f, 22, 32)} big="No es la roja" small="te recuerda el próximo cambio" color="#B07A10" w={520} />
      </>}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ── ClCrushWasher ────────────────────────────────────────────────────────────
export const ClCrushWasher: React.FC<{ mode?: "new" | "reused"; bed?: string }> = ({ mode = "reused", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const tight = ease(clamp01((f - 10) / 18));
  const drop = mode === "reused" ? ((f - 30) % 36) / 36 : -1;
  const crushed = mode === "reused" ? 1 : tight;
  const Washer: React.FC<{ x: number; flat: number; label: string; bad?: boolean; k: number }> = ({ x, flat, label, bad, k }) => (
    <div style={{ position: "absolute", left: x, top: 300, width: 420, opacity: clamp01(k * 1.4), scale: String((0.85 + 0.15 * k) * 1.45), transformOrigin: "top left" }}>
      <svg width={420} height={300} viewBox="0 0 420 300">
        <ellipse cx={210} cy={170} rx={180} ry={70} fill={bad ? "#9C6B3A" : "#D08A4A"} />
        <ellipse cx={210} cy={170 - 26 + 18 * flat} rx={180} ry={70} fill={bad ? "#B27A44" : "#E7A15E"} stroke="rgba(0,0,0,0.25)" strokeWidth={4} />
        <ellipse cx={210} cy={170 - 26 + 18 * flat} rx={80} ry={30} fill="#2B2F36" />
        {bad ? [0, 1, 2].map((i) => <path key={i} d={`M ${90 + i * 40} ${150 + i * 6} q 20 10 40 0`} stroke="#5A3A1C" strokeWidth={4} fill="none" />) : null}
      </svg>
      <div style={{ textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 42, color: "#fff", background: bad ? CL.red : GREEN, borderRadius: 10, padding: "6px 14px", marginTop: 6 }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1151} dim={0.28} />
      {mode === "new" ? <Washer x={300} flat={crushed} label="Nueva: se aplasta 1 vez" k={p} /> : <>
        <Washer x={140} flat={0} label="Nueva" k={pop(f, fps, 2, 14)} />
        <Washer x={680} flat={1} label="Aplastada 3 veces" bad k={pop(f, fps, 12, 14)} />
      </>}
      {drop >= 0 ? <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><ellipse cx={1000} cy={640 + drop * 300} rx={12} ry={17} fill={OIL} opacity={1 - drop * 0.4} /></svg> : null}
      <Tag x={1260} y={210} text="La arandela del tapón" color={CL.navy} o={lin(f, 6, 16)} size={46} />
      {mode === "new" ? <Note x={1260} y={330} o={lin(f, 26, 38)} big="Sella" small="cuesta centavos ✓" w={460} /> : <Note x={1260} y={330} o={lin(f, 30, 42)} big="Ya no sella" small="ésa era la gota de Elena" color={CL.red} w={540} />}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};
