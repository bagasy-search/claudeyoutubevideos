// Kit del MECÁNICO (Claudio el Mecánico, serie "El auto de Doña Elena") — todo DENTRO del mundo: cama real del taller/auto + luz + sombra.
//   ClFuelGauge  el tablero real en perspectiva: la aguja sube, la LUPA pasa sobre el surtidor y agranda el triangulito; con `car`, el sedán
//                visto desde arriba entra y se enciende la tapa del lado que marca la flecha
//   ClCarMap     la hoja de "la revisión de 17 puntos" sobre el banco de trabajo (en perspectiva): el sedán desde arriba en línea de plano y
//                17 pines numerados. n=0 + all: caen los 17 · zone: se encienden los de esa parte · done: los 17 con tilde
//   ClKeyFob3D   el control en 3D (three.js): "tease" rayos X: adentro hay algo · "key": la traba y la llave de metal que sale · "dead": pila
//                en 0 % y la llave de metal igual abre · "windows": botón apretado 3-5 s y los 4 vidrios bajan · "range": la señal que no llega
//                (pila gastándose) · "battery": la tapa se abre en dos y aparece la pila CR2032
//   ClChildLock  el canto de la puerta de atrás en 3D CSS: la palanquita con el dibujo del niño · "locked": la manija de adentro no abre ·
//                "open": la llave de metal la baja y la manija abre
//   ClAirFlow    corte lateral del sedán con el aire: "recirc" el humo del camión choca contra la toma cerrada y adentro el aire da vueltas ·
//                "defog" entra aire de afuera, sube por el parabrisas y se lleva el empañado
//   ClTireLabel  la etiqueta de presión del marco de la puerta en perspectiva ("door") · "versus": la etiqueta ✓ contra el número de la
//                llanta ✗ (MAX. PRESS 44 PSI)
//   ClTread3D    corte 3D de la banda de la llanta (three.js): "bar" la rayita atravesada en el canal · "worn" el dibujo baja hasta la
//                rayita (se cambia) · "coin" la moneda en el canal: le queda vida
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, lin, pop, useOut } from "./ClParts";

const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};
const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${color === CL.nitrile ? CL.navy : CL.nitrile}` }}>{text}</div>
);
const Note: React.FC<{ x: number; y: number; o: number; big: string; small?: string; color?: string; w?: number }> = ({ x, y, o, big, small, color = CL.nitrile, w }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 16}px)`, width: w }}>
    <Card style={{ padding: "14px 30px", borderBottom: `6px solid ${color}` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CL.ink, lineHeight: 1.05 }}>{big}</div>
      {small ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color }}>{small}</div> : null}
    </Card>
  </div>
);
// círculo rojo dibujado a mano (como el de las miniaturas): se traza en `k`
const HandCircle: React.FC<{ cx: number; cy: number; rx: number; ry: number; k: number; color?: string; w?: number }> = ({ cx, cy, rx, ry, k, color = CL.nitrile, w = 10 }) => {
  const L = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2) * 1.08;
  const d = `M ${cx + rx} ${cy - 6} A ${rx} ${ry} 0 1 1 ${cx + rx - 4} ${cy - 22} A ${rx * 1.04} ${ry * 1.06} 0 0 1 ${cx + rx + 8} ${cy + 4}`;
  return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - clamp01(k))} />;
};
// el sedán visto DESDE ARRIBA (frente a la derecha), en línea de plano. fuel = lado de la tapa ("left" = lado del conductor, arriba en planta)
export const CarTop: React.FC<{ w?: number; fuel?: "left" | "right"; fuelK?: number; stroke?: string; fill?: string; sw?: number }> = ({ w = 900, fuel, fuelK = 0, stroke = CL.navy, fill = "#E9ECF0", sw = 5 }) => {
  const h = w * 0.45;
  return (
    <svg width={w} height={h} viewBox="0 0 900 405" style={{ overflow: "visible" }}>
      {/* llantas */}
      {[[200, 40], [200, 365], [690, 40], [690, 365]].map(([x, y], i) => <rect key={i} x={x - 60} y={y - 26} width={120} height={52} rx={14} fill="#2A2E36" />)}
      <path d="M 70 120 Q 60 60 130 52 L 760 52 Q 850 60 860 140 L 860 265 Q 850 345 760 353 L 130 353 Q 60 345 70 285 Z" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* techo y vidrios */}
      <path d="M 300 92 L 620 92 Q 690 110 700 202 Q 690 295 620 313 L 300 313 Q 250 300 245 202 Q 250 105 300 92 Z" fill="#C9D3DE" stroke={stroke} strokeWidth={sw * 0.7} />
      <path d="M 340 118 L 590 118 Q 640 130 645 202 Q 640 275 590 287 L 340 287 Q 305 275 302 202 Q 305 130 340 118 Z" fill="#B7C1CC" stroke={stroke} strokeWidth={sw * 0.5} />
      <line x1={470} y1={52} x2={470} y2={353} stroke={stroke} strokeWidth={sw * 0.5} opacity={0.6} />
      <line x1={70} y1={202} x2={150} y2={202} stroke={stroke} strokeWidth={sw * 0.5} opacity={0.4} />
      {/* espejos */}
      <path d="M 640 52 l 20 -26 l 34 0 l -6 26 Z M 640 353 l 20 26 l 34 0 l -6 -26 Z" fill={fill} stroke={stroke} strokeWidth={sw * 0.6} />
      {/* faros y luces de atrás */}
      <path d="M 840 85 q 18 20 18 50 l -22 -6 Z M 840 320 q 18 -20 18 -50 l -22 6 Z" fill="#F4E7B0" stroke={stroke} strokeWidth={2} />
      <path d="M 78 95 q -12 20 -10 48 l 18 -4 Z M 78 310 q -12 -20 -10 -48 l 18 4 Z" fill={CL.nitrile} stroke={stroke} strokeWidth={2} />
      {fuel ? (
        <g opacity={0.35 + 0.65 * fuelK}>
          <circle cx={170} cy={fuel === "left" ? 60 : 345} r={20 + 10 * fuelK} fill={hexA(CL.nitrile, 0.25 * fuelK)} />
          <rect x={155} y={fuel === "left" ? 46 : 331} width={30} height={28} rx={6} fill={CL.nitrile} stroke={stroke} strokeWidth={3} />
        </g>
      ) : null}
    </svg>
  );
};

// ───────────────── ClFuelGauge
export const ClFuelGauge: React.FC<{ side?: "left" | "right"; car?: boolean; bed?: string }> = ({ side = "left", car = false, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 15);
  const needle = interpolate(f, [4, 26], [-62, -38], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) + Math.sin(f * 0.4) * 0.6;
  const lensK = ease(clamp01((f - 14) / 16)), circleK = clamp01((f - 26) / 14);
  const carK = car ? ease(clamp01((f - T * 0.42) / 18)) : 0, fuelK = car ? clamp01((f - T * 0.42 - 16) / 10) : 0;
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.35);
  // tablero: centro del reloj de gasolina en pantalla
  const GX = car ? 640 : 900, GY = 560, R = 300;
  const arrowX = GX + 18, arrowY = GY + 108, dir = side === "left" ? -1 : 1;
  const tilt = interpolate(f, [0, T], [14, 6]);
  const Gauge = (
    <svg width={760} height={760} viewBox="-380 -380 760 760" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="fgFace" cx="50%" cy="40%" r="65%"><stop offset="0%" stopColor="#1C2330" /><stop offset="100%" stopColor="#07090D" /></radialGradient>
        <linearGradient id="fgRing" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EEF1F4" /><stop offset="50%" stopColor="#8D939B" /><stop offset="100%" stopColor="#D5D9DE" /></linearGradient>
      </defs>
      <circle r={R + 26} fill="url(#fgRing)" />
      <circle r={R + 8} fill="#0B0E13" />
      <circle r={R} fill="url(#fgFace)" />
      {Array.from({ length: 9 }, (_, i) => { const a = (-62 + i * 15.5) * Math.PI / 180 - Math.PI / 2; const big = i % 4 === 0; return <line key={i} x1={Math.cos(a) * (R - 26)} y1={Math.sin(a) * (R - 26)} x2={Math.cos(a) * (R - (big ? 80 : 54))} y2={Math.sin(a) * (R - (big ? 80 : 54))} stroke={i === 0 ? "#E0483A" : "#F2F2EE"} strokeWidth={big ? 10 : 6} strokeLinecap="round" />; })}
      <text x={-Math.sin(62 * Math.PI / 180) * (R - 120)} y={-Math.cos(62 * Math.PI / 180) * (R - 120) + 20} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={64} fill="#E0483A">E</text>
      <text x={Math.sin(62 * Math.PI / 180) * (R - 120)} y={-Math.cos(62 * Math.PI / 180) * (R - 120) + 20} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={64} fill="#F2F2EE">F</text>
      {/* surtidor + triangulito */}
      <g transform="translate(-34 80)">
        <rect x={-30} y={-46} width={50} height={78} rx={6} fill="#F2F2EE" /><rect x={-22} y={-38} width={34} height={22} rx={3} fill="#0B0E13" />
        <path d="M 20 -30 l 18 0 l 0 46 q 0 10 -8 10" stroke="#F2F2EE" strokeWidth={7} fill="none" />
        <rect x={-38} y={32} width={66} height={10} rx={3} fill="#F2F2EE" />
      </g>
      <polygon points={dir < 0 ? "36,108 72,86 72,130" : "72,108 36,86 36,130"} fill={circleK > 0 ? (pulse > 0.5 ? "#FFFFFF" : "#F7D9A8") : "#F2F2EE"} />
      <g transform={`rotate(${needle})`}>
        <path d={`M -9 0 L 0 ${-(R - 46)} L 9 0 Z`} fill="#F27A1A" /><circle r={34} fill="#20252E" stroke="#4A515C" strokeWidth={4} />
      </g>
      <ellipse cx={-80} cy={-170} rx={190} ry={70} fill="rgba(255,255,255,0.07)" transform="rotate(-24)" />
    </svg>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={611} dim={0.3} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 55%, rgba(10,14,22,0.55), rgba(10,14,22,0.1) 65%)" }} />
      {/* el tablero en perspectiva, con la visera del cluster */}
      <div style={{ position: "absolute", left: GX - 380, top: GY - 380, width: 760, height: 760, transform: `perspective(1800px) rotateX(${tilt}deg) rotateY(${-tilt * 0.8}deg) scale(${0.85 + 0.15 * p})`, opacity: clamp01(p * 1.4), filter: `drop-shadow(0 40px 50px rgba(0,0,0,0.5))` }}>
        <div style={{ position: "absolute", left: -60, right: -60, top: -90, height: 160, borderRadius: "50% 50% 0 0", background: "linear-gradient(#22262D, #101216)", opacity: 0.9 }} />
        {Gauge}
        <svg width={760} height={760} viewBox="-380 -380 760 760" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <HandCircle cx={54} cy={108} rx={72} ry={56} k={circleK} w={11} />
        </svg>
      </div>
      {/* LUPA que agranda el triangulito */}
      <div style={{ position: "absolute", left: arrowX + 120 + (1 - lensK) * 500, top: arrowY - 260 - (1 - lensK) * 200, width: 300, height: 300, borderRadius: "50%", overflow: "hidden", opacity: lensK * (1 - carK), border: "14px solid #2B2F36", boxShadow: "0 30px 50px rgba(0,0,0,0.45), inset 0 0 30px rgba(255,255,255,0.35)", background: "#07090D" }}>
        <div style={{ position: "absolute", left: 150 - 54 * 2.6, top: 150 - 108 * 2.6, transform: "scale(2.6)", transformOrigin: "0 0", width: 0, height: 0 }}>
          <svg width={760} height={760} viewBox="-380 -380 760 760" style={{ position: "absolute", left: -380, top: -380, overflow: "visible" }}>
            <g transform="translate(-34 80)"><rect x={-30} y={-46} width={50} height={78} rx={6} fill="#F2F2EE" /><rect x={-22} y={-38} width={34} height={22} rx={3} fill="#0B0E13" /></g>
            <polygon points={dir < 0 ? "36,108 72,86 72,130" : "72,108 36,86 36,130"} fill={pulse > 0.5 ? "#FFFFFF" : "#F7D9A8"} />
          </svg>
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), rgba(255,255,255,0) 45%)" }} />
      </div>
      <div style={{ position: "absolute", left: arrowX + 250 + (1 - lensK) * 500, top: arrowY + 20 - (1 - lensK) * 200, width: 46, height: 190, borderRadius: 20, background: "linear-gradient(90deg,#1E2228,#3A3F47)", rotate: "-38deg", transformOrigin: "50% 0", opacity: lensK * (1 - carK) }} />
      <Tag x={car ? 140 : 360} y={140} text={side === "left" ? "◀ La tapa está a la izquierda" : "La tapa está a la derecha ▶"} color={CL.nitrile} o={lin(f, 30, 42)} size={44} />
      {car ? (
        <div style={{ position: "absolute", left: 1000 + (1 - carK) * 900, top: 330, opacity: carK, transform: "perspective(1600px) rotateX(20deg) rotateZ(-90deg)", transformOrigin: "50% 50%", filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.4))" }}>
          <CarTop w={760} fuel={side} fuelK={fuelK} />
        </div>
      ) : null}
      {car ? <Note x={1480} y={760} o={fuelK} big="La tapa" small="del lado de la flecha" w={380} /> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ───────────────── ClCarMap
// posiciones de los 17 puntos sobre CarTop (viewBox 900x405, frente a la derecha; arriba = lado del conductor)
const PTS: [number, number, string][] = [
  [600, 150, "Flecha del tanque"], [575, 205, "Espejo"], [620, 240, "Recirculación"], [520, 120, "La llave de metal"], [455, 40, "Ventanillas"],
  [330, 60, "Traba de niños"], [480, 165, "Reposacabezas"], [655, 120, "Visera"], [430, 250, "Gancho"], [105, 205, "Manija del baúl"],
  [140, 120, "Ganchos del baúl"], [215, 275, "Respaldos"], [150, 290, "Repuesto"], [875, 205, "Gancho de remolque"], [540, 30, "Etiqueta"],
  [690, 380, "Llantas"], [640, 90, "Fusibles"],
];
const ZONES: Record<string, number[]> = { tablero: [1, 2, 3], llave: [4, 5], puertas: [6, 7, 8, 9], baul: [10, 11, 12, 13, 14], ahorro: [15, 16, 17] };
export const ClCarMap: React.FC<{ n?: number; all?: boolean; done?: boolean; zone?: string; bed?: string }> = ({ n = 0, all, done, zone, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const hot = new Set(zone ? ZONES[zone] || [] : []);
  const W = 1180, X0 = 360, Y0 = 250;
  const sheetTilt = interpolate(f, [0, T], [34, 28]);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={621} dim={0.22} />
      <Contact x={960} y={940} w={1500} o={0.35} />
      {/* la hoja de plano sobre el banco de trabajo, en perspectiva */}
      <div style={{ position: "absolute", left: 210, top: 120 + (1 - p) * 200, width: 1500, height: 860, transform: `perspective(2200px) rotateX(${sheetTilt}deg) rotateZ(-2deg)`, transformOrigin: "50% 100%", opacity: clamp01(p * 1.5) }}>
        <div style={{ position: "absolute", inset: 0, background: "#F3F0E7", borderRadius: 8, boxShadow: "0 50px 80px rgba(0,0,0,0.45)", backgroundImage: `linear-gradient(${hexA(CL.navy, 0.07)} 2px, transparent 2px), linear-gradient(90deg, ${hexA(CL.navy, 0.07)} 2px, transparent 2px)`, backgroundSize: "60px 60px" }} />
        {/* manchitas de grasa: es la hoja del taller */}
        <div style={{ position: "absolute", left: 1210, top: 640, width: 150, height: 110, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(60,45,30,0.22), rgba(60,45,30,0) 70%)" }} />
        <div style={{ position: "absolute", left: 70, top: 46, fontFamily: LABEL, fontWeight: 700, fontSize: 52, letterSpacing: 4, color: CL.navy }}>LA REVISIÓN · 17 PUNTOS</div>
        <div style={{ position: "absolute", right: 70, top: 52, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CL.nitrile }}>auto de Doña Elena</div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 120, height: 6, background: CL.navy }} />
        <div style={{ position: "absolute", left: X0 - 210, top: Y0 }}><CarTop w={W} stroke={CL.navy} fill="#FFFFFF" sw={6} /></div>
        <svg width={1500} height={860} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {PTS.map(([x, y], i) => {
            const k = i + 1, sx = X0 - 210 + x * (W / 900), sy = Y0 + y * (W / 900);
            const t0 = all ? 10 + i * Math.min(4, (T * 0.6) / 17) : 6 + i * 0.6;
            const pk = pop(f, fps, t0, 12);
            const isDone = done || (!all && k < n && !hot.has(k)) || (!!zone && k < Math.min(...(ZONES[zone] || [n])));
            const isHot = hot.has(k) || (!zone && !all && k === n);
            const r = 26 * pk * (isHot ? 1 + 0.12 * Math.sin(f * 0.3 + i) : 1);
            const col = isHot ? CL.nitrile : isDone ? CL.navy : all ? CL.nitrile : "#9AA1AD";
            return (
              <g key={i} opacity={clamp01(pk * 1.3)}>
                {isHot ? <circle cx={sx} cy={sy} r={r + 16} fill={hexA(CL.nitrile, 0.22)} /> : null}
                <circle cx={sx} cy={sy} r={r} fill={col} stroke="#fff" strokeWidth={4} />
                {isDone && done ? <path d={`M ${sx - 11} ${sy} l 8 9 l 15 -18`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" /> : <text x={sx} y={sy + 10} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={28} fill="#fff">{k}</text>}
              </g>
            );
          })}
        </svg>
        {zone ? (
          <div style={{ position: "absolute", left: 70, bottom: 40, display: "flex", gap: 18, flexWrap: "wrap", width: 1360 }}>
            {(ZONES[zone] || []).map((k, i) => (
              <div key={k} style={{ opacity: lin(f, 16 + i * 6, 26 + i * 6), background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 38, padding: "6px 20px", borderRadius: 8, borderBottom: `5px solid ${CL.nitrile}` }}>{k} · {PTS[k - 1][2]}</div>
            ))}
          </div>
        ) : null}
      </div>
      {done ? <div style={{ position: "absolute", right: 150, top: 110, rotate: "-8deg", opacity: lin(f, T * 0.5, T * 0.5 + 8), scale: String(1.6 - 0.6 * lin(f, T * 0.5, T * 0.5 + 8)), border: `8px solid ${CL.nitrile}`, color: CL.nitrile, fontFamily: LABEL, fontWeight: 700, fontSize: 72, padding: "4px 30px", borderRadius: 14, background: "rgba(255,255,255,0.75)" }}>17 / 17</div> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ───────────────── ClKeyFob3D
const roundedRect = (w: number, h: number, r: number) => {
  const s = new THREE.Shape(); const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
};
export const ClKeyFob3D: React.FC<{ mode?: "tease" | "key" | "dead" | "windows" | "range" | "battery"; bed?: string }> = ({ mode = "key", bed }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const geo = useMemo(() => {
    const body = new THREE.ExtrudeGeometry(roundedRect(1.0, 1.9, 0.42), { depth: 0.36, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 6, curveSegments: 18 });
    body.translate(0, 0, -0.18);
    const half = new THREE.ExtrudeGeometry(roundedRect(1.0, 1.9, 0.42), { depth: 0.16, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.06, bevelSegments: 5, curveSegments: 18 });
    half.translate(0, 0, -0.08);
    // hoja de la llave de metal (perfil con dientes)
    const k = new THREE.Shape(); k.moveTo(-0.11, 0); k.lineTo(-0.11, 1.35); k.lineTo(0.0, 1.5); k.lineTo(0.11, 1.38); k.lineTo(0.11, 1.15); k.lineTo(0.05, 1.08); k.lineTo(0.11, 0.98);
    k.lineTo(0.11, 0.8); k.lineTo(0.04, 0.72); k.lineTo(0.11, 0.62); k.lineTo(0.11, 0.42); k.lineTo(0.05, 0.36); k.lineTo(0.11, 0.28); k.lineTo(0.11, 0); k.lineTo(-0.11, 0);
    const blade = new THREE.ExtrudeGeometry(k, { depth: 0.05, bevelEnabled: false }); blade.translate(0, 0, -0.025);
    return { body, half, blade };
  }, []);
  const mats = useMemo(() => ({
    plastic: new THREE.MeshStandardMaterial({ color: "#1B1D21", roughness: 0.55, metalness: 0.1 }),
    plasticX: new THREE.MeshStandardMaterial({ color: "#2A3140", roughness: 0.4, metalness: 0.1, transparent: true, opacity: 0.32 }),
    rubber: new THREE.MeshStandardMaterial({ color: "#3A3D44", roughness: 0.85 }),
    red: new THREE.MeshStandardMaterial({ color: CL.nitrile, roughness: 0.6 }),
    metal: new THREE.MeshStandardMaterial({ color: "#D8DCE1", metalness: 0.85, roughness: 0.25 }),
    cell: new THREE.MeshStandardMaterial({ color: "#D9DDE2", metalness: 0.6, roughness: 0.25, emissive: "#8A8F96", emissiveIntensity: 0.45 }),
    board: new THREE.MeshStandardMaterial({ color: "#2E6B3A", roughness: 0.6 }),
  }), []);
  const p = pop(f, fps, 0, 15);
  const spin = mode === "tease" ? Math.sin(f * 0.05) * 0.55 : mode === "battery" ? interpolate(f, [0, T], [-0.25, 0.1]) : interpolate(f, [0, T], [-0.5, 0.35]);
  const keyK = mode === "key" ? ease(clamp01((f - 18) / 26)) : mode === "dead" ? 1 : mode === "tease" ? 0.1 + 0.06 * Math.sin(f * 0.2) : 0;
  const openK = mode === "battery" ? ease(clamp01((f - 16) / 24)) : 0;
  const cellK = mode === "battery" ? ease(clamp01((f - 34) / 22)) : 0;
  const pressK = mode === "windows" ? clamp01((f - 12) / 6) : 0;
  const xray = 0;
  const target = new THREE.Vector3(0, -0.45, 0), camPos = new THREE.Vector3(Math.sin(spin) * 8.4, 1.4, Math.cos(spin) * 8.4);
  const sx = mode === "windows" || mode === "range" || mode === "dead" ? -0.18 : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={631} dim={0.25} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, rgba(255,250,240,0.4), rgba(255,250,240,0) 60%)" }} />
      <Contact x={mode === "windows" || mode === "range" || mode === "dead" ? 640 : 960} y={900} w={560} o={0.3} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${sx * width}px) scale(${0.8 + 0.2 * p})`, opacity: clamp01(p * 1.4) }}>
        <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
          <Cam pos={camPos} target={target} />
          <ambientLight intensity={0.9} />
          <hemisphereLight args={["#FFFFFF", "#6B6257", 0.7]} />
          <directionalLight position={[-3, 5, 4]} intensity={1.6} color="#FFF3DF" />
          <directionalLight position={[4, 1, -2]} intensity={0.8} color="#CFE0FF" />
          <group rotation={[0.15, 0, -0.18]}>
            {mode === "battery" ? (
              <>
                {/* almeja: la mitad de atrás queda de frente con la placa y la pila; la tapa gira sobre la bisagra de arriba */}
                <mesh geometry={geo.half} material={mats.plastic} position={[0, 0, -0.12]} />
                <mesh material={mats.board} position={[0, 0.05, 0.0]}><boxGeometry args={[0.78, 1.45, 0.04]} /></mesh>
                <mesh material={mats.metal} position={[0, 0.3, 0.03]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.36, 0.03, 10, 40]} /></mesh>
                <mesh material={mats.cell} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.3 + 0.35 * cellK, 0.06 + 0.9 * cellK]}><cylinderGeometry args={[0.32, 0.32, 0.06, 48]} /></mesh>
                <group position={[0, 1.0, 0.04]} rotation={[-1.75 * openK, 0, 0]}>
                  <mesh geometry={geo.half} material={mats.plastic} position={[0, -1.0, 0.1]} />
                  {[0.5, 0.12, -0.26].map((y, i) => <mesh key={i} material={i === 2 ? mats.red : mats.rubber} position={[0, y - 1.0, 0.22]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.17, 0.17, 0.05, 32]} /></mesh>)}
                </group>
              </>
            ) : (
              <>
                <mesh geometry={geo.body} material={xray > 0 ? mats.plasticX : mats.plastic} />
                {[0.5, 0.12, -0.26].map((y, i) => (
                  <mesh key={i} material={i === 2 ? mats.red : mats.rubber} position={[0, y, 0.27 - (i === 1 ? pressK * 0.04 : 0)]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.17, 0.17, 0.05, 32]} /></mesh>
                ))}
                {/* argolla del llavero */}
                <mesh material={mats.metal} position={[0, 1.18, 0]}><torusGeometry args={[0.22, 0.035, 12, 32]} /></mesh>
                {/* traba lateral */}
                <mesh material={mats.metal} position={[0.55, -0.55, 0]}><boxGeometry args={[0.06, 0.26 - 0.08 * keyK, 0.12]} /></mesh>
                {/* la llave de metal: escondida adentro, sale por abajo */}
                <mesh geometry={geo.blade} material={mats.metal} position={[0.22, 0.55 - 1.55 * keyK, 0]} rotation={[0, 0, Math.PI]} />
                {xray > 0 ? <mesh material={mats.cell} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}><cylinderGeometry args={[0.32, 0.32, 0.06, 40]} /></mesh> : null}
              </>
            )}
          </group>
        </ThreeCanvas>
      </div>
      {mode === "tease" ? <Note x={1180} y={300} o={lin(f, 14, 26)} big="Adentro hay algo" small="que nadie le mostró" /> : null}
      {mode === "key" ? <><Tag x={1180} y={240} text="1 · Aprieta la traba" o={lin(f, 8, 18)} size={44} /><Tag x={1180} y={340} text="2 · Sale la llave de metal" color={CL.nitrile} o={lin(f, 34, 44)} size={44} /><Note x={1180} y={470} o={lin(f, 50, 62)} big="Una llave de verdad" small="abre la puerta" /></> : null}
      {mode === "dead" ? (
        <>
          <div style={{ position: "absolute", left: 1150, top: 250, opacity: lin(f, 6, 16) }}>
            <svg width={360} height={170}><rect x={8} y={20} width={300} height={130} rx={18} fill="none" stroke="#fff" strokeWidth={10} /><rect x={308} y={60} width={30} height={50} rx={6} fill="#fff" /><rect x={26} y={38} width={30} height={94} rx={8} fill={CL.red} opacity={0.5 + 0.5 * Math.sin(f * 0.5)} /></svg>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 52, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>PILA MUERTA</div>
          </div>
          <Note x={1150} y={560} o={lin(f, 24, 36)} big="La llave de metal" small="igual abre la puerta ✓" />
        </>
      ) : null}
      {mode === "windows" ? (() => {
        const hold = clamp01((f - 12) / Math.max(1, T * 0.55)), secs = Math.min(5, Math.floor(hold * 5) + (f > 12 ? 1 : 0));
        const down = clamp01((hold - 0.6) / 0.4);
        return (
          <>
            <div style={{ position: "absolute", left: 1120, top: 170, opacity: lin(f, 6, 14) }}>
              <svg width={260} height={260}><circle cx={130} cy={130} r={110} fill="rgba(20,27,46,0.75)" stroke="rgba(255,255,255,0.25)" strokeWidth={14} /><circle cx={130} cy={130} r={110} fill="none" stroke={CL.nitrile} strokeWidth={14} strokeDasharray={691} strokeDashoffset={691 * (1 - hold)} transform="rotate(-90 130 130)" strokeLinecap="round" /><text x={130} y={156} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={96} fill="#fff">{secs}</text></svg>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,0.6)", textAlign: "center", width: 260 }}>SEGUNDOS</div>
            </div>
            <div style={{ position: "absolute", left: 1440, top: 230, opacity: lin(f, 14, 24), display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ width: 150, height: 120, borderRadius: "18px 40px 8px 8px", border: "8px solid #fff", position: "relative", overflow: "hidden", background: "rgba(20,27,46,0.35)" }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: `${down * 100}%`, bottom: 0, background: "linear-gradient(#BFD7EA,#7FA6C4)" }} />
                </div>
              ))}
            </div>
            <Note x={1150} y={600} o={lin(f, T * 0.62, T * 0.62 + 10)} big="Se bajan los 4" small="el aire caliente se va" />
          </>
        );
      })() : null}
      {mode === "range" ? (() => {
        const k = clamp01((f - 8) / (T * 0.5));
        return (
          <>
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
              {[0, 1, 2, 3, 4].map((i) => { const t = (f * 0.05 + i / 5) % 1; const rr = 80 + t * 520 * (1 - 0.6 * k); return <circle key={i} cx={720} cy={520} r={rr} fill="none" stroke="#fff" strokeWidth={6} opacity={(1 - t) * 0.7} />; })}
              <line x1={1000} y1={860} x2={1700} y2={860} stroke="#fff" strokeWidth={4} strokeDasharray="14 12" opacity={0.7} />
            </svg>
            <div style={{ position: "absolute", left: 1460, top: 640, transform: "scale(0.42)", transformOrigin: "0 0", opacity: lin(f, 4, 14) }}><CarTop w={600} /></div>
            <Note x={1080} y={250} o={lin(f, 18, 30)} big="Sólo anda de cerca" small="la pila se está acabando" />
          </>
        );
      })() : null}
      {mode === "battery" ? <><Tag x={1200} y={250} text="CR2032" color={CL.nitrile} o={cellK} size={56} /><Note x={1200} y={380} o={lin(f, 50, 62)} big="Una pila de reloj" small="2 minutos para cambiarla" /></> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ───────────────── ClChildLock
export const ClChildLock: React.FC<{ mode?: "find" | "locked" | "open"; bed?: string }> = ({ mode = "find", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const swing = interpolate(f, [0, T], [-26, -18]);
  const lever = mode === "open" ? 1 - ease(clamp01((f - 12) / 14)) : 1; // 1 = trabado (abajo con el niño)
  const pull = mode === "locked" ? Math.max(0, Math.sin(clamp01((f - 16) / 30) * Math.PI * 3)) : mode === "open" ? ease(clamp01((f - 34) / 12)) : 0;
  const zoomK = mode === "find" ? ease(clamp01((f - 10) / 20)) : 1;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={641} dim={0.22} />
      <Contact x={760} y={960} w={900} o={0.3} />
      {/* la puerta de atrás abierta, vista desde el canto (3D CSS) */}
      <div style={{ position: "absolute", left: 380, top: 120 + (1 - p) * 160, width: 760, height: 820, transform: `perspective(1800px) rotateY(${swing}deg)`, transformStyle: "preserve-3d", opacity: clamp01(p * 1.4) }}>
        {/* panel interior */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "40px 120px 30px 30px", background: "linear-gradient(160deg,#9AA0A8,#6B717A)", boxShadow: "inset 0 0 0 10px #5C626B" }}>
          <div style={{ position: "absolute", left: 70, top: 60, right: 140, height: 300, borderRadius: "20px 90px 10px 10px", background: "linear-gradient(170deg, rgba(200,220,235,0.85), rgba(120,150,175,0.65))" }} />
          {/* manija de adentro */}
          <div style={{ position: "absolute", left: 120, top: 470, width: 170, height: 64, borderRadius: 30, background: "#4A4F57", boxShadow: "inset 0 6px 10px rgba(0,0,0,0.4)" }}>
            <div style={{ position: "absolute", left: 18 + 20 * pull, top: 12, width: 120, height: 40, borderRadius: 20, background: "linear-gradient(#D5D8DC,#9DA2A8)", transform: `rotateY(${pull * 25}deg)` }} />
          </div>
        </div>
        {/* el canto de la puerta con la palanquita */}
        <div style={{ position: "absolute", left: 700, top: 120, width: 120, height: 640, transform: "rotateY(90deg)", transformOrigin: "0 50%", background: "linear-gradient(90deg,#B8BEC6,#8E949C)", borderRadius: 10, boxShadow: "inset 0 0 0 6px #7A8088" }}>
          <div style={{ position: "absolute", left: 22, top: 260, width: 76, height: 150, borderRadius: 14, background: "#2B2F36" }}>
            <div style={{ position: "absolute", left: 18, top: 16 + 70 * lever, width: 40, height: 50, borderRadius: 8, background: "#E7E9EC", boxShadow: "0 4px 6px rgba(0,0,0,0.4)" }} />
          </div>
          {/* dibujito del niño */}
          <svg width={120} height={110} style={{ position: "absolute", top: 430 }}><circle cx={60} cy={26} r={14} fill="#2B2F36" /><path d="M42 50 h36 l-6 34 h-24 Z" fill="#2B2F36" /><path d="M30 92 l60 0" stroke="#2B2F36" strokeWidth={6} /></svg>
        </div>
      </div>
      {/* lupa sobre la palanquita (find) */}
      {mode === "find" ? (
        <div style={{ position: "absolute", left: 1180, top: 230, width: 420, height: 420, borderRadius: "50%", border: "16px solid #2B2F36", overflow: "hidden", opacity: zoomK, scale: String(0.6 + 0.4 * zoomK), background: "linear-gradient(90deg,#B8BEC6,#8E949C)", boxShadow: "0 30px 50px rgba(0,0,0,0.45)" }}>
          <div style={{ position: "absolute", left: 130, top: 70, width: 160, height: 280, borderRadius: 24, background: "#2B2F36" }}>
            <div style={{ position: "absolute", left: 36, top: 30 + 140 * lever, width: 88, height: 90, borderRadius: 14, background: "#E7E9EC" }} />
          </div>
          <svg width={120} height={110} style={{ position: "absolute", left: 300, top: 260 }}><circle cx={60} cy={26} r={14} fill="#2B2F36" /><path d="M42 50 h36 l-6 34 h-24 Z" fill="#2B2F36" /></svg>
        </div>
      ) : null}
      {mode !== "find" ? (
        <div style={{ position: "absolute", left: 1220, top: 560, width: 340, height: 340, borderRadius: "50%", border: "14px solid #2B2F36", overflow: "hidden", opacity: lin(f, 4, 14), background: "linear-gradient(90deg,#B8BEC6,#8E949C)", boxShadow: "0 24px 40px rgba(0,0,0,0.45)" }}>
          <div style={{ position: "absolute", left: 100, top: 50, width: 130, height: 230, borderRadius: 20, background: "#2B2F36" }}>
            <div style={{ position: "absolute", left: 28, top: 22 + 116 * lever, width: 74, height: 74, borderRadius: 12, background: lever > 0.5 ? CL.red : "#E7E9EC" }} />
          </div>
          <svg width={100} height={100} style={{ position: "absolute", left: 240, top: 210 }}><circle cx={50} cy={22} r={12} fill="#2B2F36" /><path d="M35 42 h30 l-5 28 h-20 Z" fill="#2B2F36" /></svg>
        </div>
      ) : null}
      {mode === "find" ? <Tag x={1200} y={700} text="El canto de la puerta" o={lin(f, 18, 28)} size={44} /> : null}
      {mode === "locked" ? (
        <>
          <Tag x={1200} y={230} text="Traba puesta" color={CL.red} o={lin(f, 6, 16)} size={46} />
          <Note x={1200} y={350} o={lin(f, 30, 42)} big="Desde adentro, no abre" small="sólo desde afuera" color={CL.red} />
          <svg width={200} height={200} style={{ position: "absolute", left: 420, top: 520, opacity: lin(f, 40, 48) }}><path d="M30 30 L170 170 M170 30 L30 170" stroke={CL.red} strokeWidth={22} strokeLinecap="round" /></svg>
        </>
      ) : null}
      {mode === "open" ? (
        <>
          <Tag x={1200} y={230} text="Traba quitada" color={CL.navy} o={lin(f, 18, 28)} size={46} />
          <Note x={1200} y={350} o={lin(f, 40, 52)} big="Y la manija abrió" small="no estaba rota ✓" />
        </>
      ) : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ───────────────── ClAirFlow
export const ClAirFlow: React.FC<{ mode?: "recirc" | "defog"; bed?: string }> = ({ mode = "recirc", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const fog = mode === "defog" ? 1 - ease(clamp01((f - T * 0.3) / (T * 0.5))) : 0;
  // corte lateral del sedán (frente a la derecha) en un viewBox 1400x600
  const body = "M 80 430 Q 70 360 150 345 L 330 330 Q 420 210 560 190 L 860 185 Q 960 190 1040 300 L 1250 330 Q 1330 345 1330 420 L 1320 460 L 80 460 Z";
  const flowR = (i: number) => { const t = ((f * 0.012 + i / 6) % 1); const a = t * Math.PI * 2; return { x: 720 + Math.cos(a) * 300, y: 330 + Math.sin(a) * 90, o: 0.9 }; };
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={651} dim={0.28} />
      <div style={{ position: "absolute", left: 260, top: 230 + (1 - p) * 120, opacity: clamp01(p * 1.4), filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.35))" }}>
        <svg width={1400} height={640} viewBox="0 0 1440 640" style={{ overflow: "visible" }}>
          <defs><linearGradient id="afBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E4E8EC" /><stop offset="100%" stopColor="#A7AEB7" /></linearGradient></defs>
          <path d={body} fill="url(#afBody)" stroke={CL.navy} strokeWidth={6} />
          {/* vidrios */}
          <path d="M 360 330 Q 440 225 560 208 L 700 205 L 700 330 Z" fill="#CFE0EE" stroke={CL.navy} strokeWidth={4} />
          <path d="M 720 205 L 860 203 Q 940 210 1010 320 L 720 330 Z" fill="#CFE0EE" stroke={CL.navy} strokeWidth={4} />
          {/* empañado del parabrisas */}
          {mode === "defog" ? <path d="M 720 205 L 860 203 Q 940 210 1010 320 L 720 330 Z" fill="#F4F6F8" opacity={0.85 * fog} /> : null}
          {[300, 1110].map((x) => <g key={x}><circle cx={x} cy={460} r={86} fill="#24272D" /><circle cx={x} cy={460} r={44} fill="#B9BFC7" /></g>)}
          {/* toma de aire del frente */}
          <rect x={1260} y={360} width={70} height={40} rx={8} fill={mode === "recirc" ? CL.nitrile : "#2B2F36"} />
          {mode === "recirc" ? (
            <>
              {[0, 1, 2, 3, 4, 5].map((i) => { const q = flowR(i); return <circle key={i} cx={q.x} cy={q.y} r={14} fill={CL.navy} opacity={q.o} />; })}
              <ellipse cx={720} cy={330} rx={300} ry={90} fill="none" stroke={CL.navy} strokeWidth={4} strokeDasharray="14 14" opacity={0.6} />
              {[0, 1, 2, 3, 4, 5].map((i) => { const t = ((f * 0.018 + i / 6) % 1); const x = 1395 - t * 50; return <circle key={i} cx={x} cy={300 + (i % 3) * 34 - t * 30} r={22 + t * 18} fill="#3A3A3A" opacity={0.75 * (1 - t * 0.6)} />; })}
              <path d="M 1240 340 l 26 26 M 1266 340 l -26 26" stroke={CL.red} strokeWidth={8} strokeLinecap="round" />
            </>
          ) : (
            <>
              {[0, 1, 2, 3, 4].map((i) => { const t = ((f * 0.02 + i / 5) % 1); const x = 1330 - t * 420, y = 380 - Math.max(0, t - 0.35) * 260; return <path key={i} d={`M ${x} ${y} l -40 0`} stroke="#6FB1E0" strokeWidth={12} strokeLinecap="round" opacity={0.9 * (1 - t)} />; })}
            </>
          )}
        </svg>
      </div>
      {mode === "recirc" ? <><Tag x={300} y={140} text="Recirculación: prendida" color={CL.nitrile} o={lin(f, 8, 18)} size={44} /><Note x={1180} y={760} o={lin(f, 24, 36)} big="El humo se queda afuera" small="adentro, el mismo aire" /></> : null}
      {mode === "defog" ? <><Tag x={300} y={140} text="Recirculación: apagada · aire: prendido" o={lin(f, 8, 18)} size={40} /><Note x={1180} y={760} o={lin(f, T * 0.55, T * 0.55 + 10)} big="Se desempaña" small="en un minuto" /></> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ───────────────── ClTireLabel
const Placard: React.FC<{ w?: number; hi?: number }> = ({ w = 640, hi = 0 }) => (
  <div style={{ width: w, background: "linear-gradient(170deg,#FBFBF6,#E9E7DD)", borderRadius: 10, padding: "22px 28px", boxShadow: "0 18px 34px rgba(0,0,0,0.35)", border: "3px solid #C9C6B8", fontFamily: LABEL }}>
    <div style={{ background: "#F2C230", color: "#111", fontWeight: 700, fontSize: 30, padding: "6px 14px", letterSpacing: 2 }}>TIRE AND LOADING INFORMATION</div>
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", marginTop: 14, fontSize: 30, color: "#222", rowGap: 8 }}>
      <div style={{ fontWeight: 700 }}>COLD TIRE</div><div style={{ fontWeight: 700 }}>SIZE</div><div style={{ fontWeight: 700 }}>PRESSURE</div>
      {[["FRONT", "195/65R15", "32 PSI"], ["REAR", "195/65R15", "32 PSI"], ["SPARE", "T125/70D16", "60 PSI"]].map((r, i) => (
        <React.Fragment key={i}><div>{r[0]}</div><div>{r[1]}</div><div style={{ fontWeight: 700, background: i < 2 ? `rgba(198,40,40,${0.25 * hi})` : undefined, borderRadius: 6 }}>{r[2]}</div></React.Fragment>
      ))}
    </div>
  </div>
);
export const ClTireLabel: React.FC<{ mode?: "door" | "versus"; bed?: string }> = ({ mode = "door", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16), hi = lin(f, 18, 30);
  const tilt = interpolate(f, [0, T], [-22, -14]);
  if (mode === "versus") {
    const pv = pop(f, fps, 10, 16);
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={661} dim={0.25} />
        <div style={{ position: "absolute", left: 140, top: 250, transform: `perspective(1600px) rotateY(18deg) scale(${0.85 + 0.15 * p})`, opacity: clamp01(p * 1.4) }}><Placard w={700} hi={1} /></div>
        <div style={{ position: "absolute", left: 340, top: 640, opacity: lin(f, 12, 22) }}><Tag x={0} y={0} text="✓ La de la puerta" color={CL.navy} size={50} /></div>
        {/* el costado de la llanta con letras en relieve */}
        <div style={{ position: "absolute", left: 1000, top: 200, width: 760, height: 520, borderRadius: 30, overflow: "hidden", transform: `perspective(1600px) rotateY(-18deg) scale(${0.85 + 0.15 * pv})`, opacity: clamp01(pv * 1.4), background: "radial-gradient(ellipse at 120% 50%, #3A3D42 0%, #1D1F23 55%, #121315 100%)", boxShadow: "0 30px 50px rgba(0,0,0,0.5)" }}>
          {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: i * 40, height: 2, background: "rgba(255,255,255,0.03)" }} />)}
          <div style={{ position: "absolute", left: 60, top: 180, fontFamily: LABEL, fontWeight: 700, fontSize: 62, letterSpacing: 4, color: "#2C2F34", textShadow: "-2px -2px 2px rgba(255,255,255,0.18), 3px 3px 4px rgba(0,0,0,0.9)" }}>MAX. PRESS 44 PSI</div>
          <svg width={760} height={520} style={{ position: "absolute", inset: 0 }}><HandCircle cx={380} cy={225} rx={330} ry={80} k={lin(f, 22, 38)} color={CL.red} /></svg>
        </div>
        <div style={{ position: "absolute", left: 1180, top: 760, opacity: lin(f, 30, 40) }}><Tag x={0} y={0} text="✗ El máximo que aguanta" color={CL.red} size={50} /></div>
        <RoomLight k={0.5} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={662} dim={0.22} />
      {/* el marco de la puerta (pilar) con la etiqueta pegada */}
      <div style={{ position: "absolute", left: 560, top: 60 + (1 - p) * 120, width: 800, height: 960, transform: `perspective(1800px) rotateY(${tilt}deg)`, opacity: clamp01(p * 1.4) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "linear-gradient(90deg,#9EA5AE,#D2D7DD 40%,#A9B0B8)", boxShadow: "0 40px 60px rgba(0,0,0,0.4), inset 0 0 0 8px #868D96" }} />
        <div style={{ position: "absolute", left: 30, right: 30, top: 70, height: 26, borderRadius: 13, background: "#2A2D33" }} />
        <div style={{ position: "absolute", left: 90, top: 300, rotate: "-1deg" }}><Placard w={620} hi={hi} /></div>
        <div style={{ position: "absolute", left: 300, top: 760, width: 200, height: 60, borderRadius: 12, background: "#5B6068" }} />
      </div>
      <Note x={150} y={300} o={lin(f, 22, 34)} big="32 PSI" small="la que pidió la fábrica" w={420} />
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ───────────────── ClTread3D
export const ClTread3D: React.FC<{ mode?: "bar" | "worn" | "coin"; bed?: string }> = ({ mode = "bar", bed }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const wear = mode === "worn" ? ease(clamp01((f - 14) / (T * 0.45))) : 0; // 0 = dibujo nuevo · 1 = a ras de la rayita
  const coinK = mode === "coin" ? ease(clamp01((f - 12) / 22)) : 0;
  const barGlow = mode === "bar" ? 0.5 + 0.5 * Math.sin(f * 0.3) : wear > 0.9 ? 1 : 0;
  const a = interpolate(f, [0, T], [-0.55, -0.25]);
  const target = new THREE.Vector3(-0.3, -0.2, 0), camPos = new THREE.Vector3(Math.sin(a) * 6.6, 2.6, Math.cos(a) * 6.6);
  const mats = useMemo(() => ({
    rubber: new THREE.MeshStandardMaterial({ color: "#3A3D43", roughness: 0.82 }),
    rubberDark: new THREE.MeshStandardMaterial({ color: "#1A1B1E", roughness: 0.95 }),
    bar: new THREE.MeshStandardMaterial({ color: "#3A3C41", roughness: 0.85, emissive: CL.nitrile, emissiveIntensity: 0 }),
    coin: new THREE.MeshStandardMaterial({ color: "#C9A85A", metalness: 0.85, roughness: 0.3 }),
  }), []);
  mats.bar.emissiveIntensity = 0.6 * barGlow;
  const BLOCK_H = 0.5 * (1 - wear * 0.82), BASE = -0.25;
  const blocks: [number, number][] = []; for (let i = -3; i <= 3; i++) for (let j = -1; j <= 1; j++) blocks.push([i * 0.8, j * 1.1]);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={671} dim={0.28} />
      <Contact x={900} y={860} w={1200} o={0.3} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${0.85 + 0.15 * p})`, opacity: clamp01(p * 1.4) }}>
        <ThreeCanvas width={width} height={height} camera={{ fov: 32, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
          <Cam pos={camPos} target={target} />
          <ambientLight intensity={0.8} />
          <hemisphereLight args={["#FFFFFF", "#5C544A", 0.7]} />
          <directionalLight position={[-3, 6, 3]} intensity={1.8} color="#FFF1DC" />
          <directionalLight position={[4, 2, -3]} intensity={0.6} />
          <group position={[-0.4, 0, 0]}>
            {/* carcasa de la banda */}
            <mesh material={mats.rubberDark} position={[0, BASE - 0.2, 0]}><boxGeometry args={[6.2, 0.4, 3.6]} /></mesh>
            {/* tacos del dibujo */}
            {blocks.map(([x, z], i) => <mesh key={i} material={mats.rubber} position={[x, BASE + BLOCK_H / 2, z]}><boxGeometry args={[0.62, BLOCK_H, 0.86]} /></mesh>)}
            {/* las rayitas de desgaste, atravesadas en los canales (más bajas que los tacos nuevos) */}
            {[-2.0, 0.4, 2.8].map((x, i) => <mesh key={i} material={mats.bar} position={[x, BASE + 0.05, 0.55]}><boxGeometry args={[0.18, 0.1, 0.3]} /></mesh>)}
            {[-2.0, 0.4, 2.8].map((x, i) => <mesh key={"z" + i} material={mats.bar} position={[x, BASE + 0.05, -0.55]}><boxGeometry args={[0.18, 0.1, 0.3]} /></mesh>)}
            {/* la moneda en el canal */}
            {mode === "coin" ? <mesh material={mats.coin} rotation={[0, 0, Math.PI / 2]} position={[0.4, 1.2 - 1.05 * coinK, 0.55]}><cylinderGeometry args={[0.4, 0.4, 0.06, 40]} /></mesh> : null}
          </group>
        </ThreeCanvas>
      </div>
      {mode === "bar" ? <><Tag x={1240} y={220} text="La rayita de desgaste" color={CL.nitrile} o={lin(f, 10, 20)} size={46} /><Note x={1240} y={340} o={lin(f, 26, 38)} big="Atravesada en el canal" small="más baja que el dibujo" /></> : null}
      {mode === "worn" ? <><Tag x={1240} y={220} text={wear > 0.9 ? "A ras: se cambia" : "El dibujo se gasta…"} color={wear > 0.9 ? CL.red : CL.navy} o={lin(f, 8, 18)} size={46} /><Note x={1240} y={340} o={lin(f, T * 0.7, T * 0.7 + 10)} big="Antes, no" small="no te la cambies" /></> : null}
      {mode === "coin" ? <><Tag x={1240} y={220} text="La moneda en el canal" o={lin(f, 8, 18)} size={46} /><Note x={1240} y={340} o={lin(f, 34, 46)} big="Le queda vida" small="un año más ✓" /></> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ═════════════════ ep. 2 (mecllave): la pila y el control ═════════════════
//   ClBatterySwap  la pila CR2032 de cerca, sobre el banco: "id" el número grabado (CR2032 · 3V) con lupa · "plus" el signo más hacia
//                  arriba y la pila que entra al soporte del control abierto · "edges" agarrarla por el borde ✓ vs con los dedos en la cara ✗
//   ClRangeMeter   la cochera de Elena desde arriba: casa → auto. "now" el control llega a 1 m · "compare" antes 20 m / ahora 1 m ·
//                  "drop" la pila baja y el círculo de alcance se achica
//   ClPanicWaves   el estacionamiento del súper desde arriba: "alarm" el auto de Elena titila y la bocina sale en ondas, la gente se da
//                  vuelta · "find" entre 30 autos plateados, un toque y el de Elena se ilumina con un pin
//   ClDoorUnlock   el sedán desde arriba con las 4 trabas: "once" un toque = sólo la del conductor (verde) · "twice" dos toques = las 4
//   ClProxStart    el botón de encendido en 3D CSS: "press" el control apoyado contra el botón y el motor arranca (aguja del cuentavueltas) ·
//                  "chip" corte del control: la pila muerta (gris) y el chip que el auto lee de cerca · "key" la llave que gira con el chip adentro
const Cell: React.FC<{ d?: number; flip?: boolean; glow?: number }> = ({ d = 420, flip, glow = 0 }) => (
  <div style={{ width: d, height: d, borderRadius: "50%", position: "relative", background: flip ? "radial-gradient(circle at 40% 35%, #F2F3F5, #A9ADB3 70%, #7D8187)" : "radial-gradient(circle at 35% 30%, #FFFFFF, #C9CDD2 55%, #8E9298)", boxShadow: `0 30px 50px rgba(0,0,0,0.45), inset 0 -10px 22px rgba(0,0,0,0.25), 0 0 ${60 * glow}px ${hexA(CL.nitrile, 0.6 * glow)}` }}>
    <div style={{ position: "absolute", inset: d * 0.06, borderRadius: "50%", border: `${Math.max(2, d * 0.008)}px solid rgba(0,0,0,0.12)` }} />
    {!flip ? (
      <>
        <div style={{ position: "absolute", left: "50%", top: "24%", translate: "-50% 0", fontFamily: SERIF, fontWeight: 900, fontSize: d * 0.28, color: "#6E737A", textShadow: "1px 1px 0 rgba(255,255,255,0.8), -1px -1px 0 rgba(0,0,0,0.15)" }}>+</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: "56%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: d * 0.13, letterSpacing: d * 0.01, color: "#6E737A", textShadow: "1px 1px 0 rgba(255,255,255,0.8)" }}>CR2032</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: "72%", textAlign: "center", fontFamily: LABEL, fontWeight: 600, fontSize: d * 0.08, color: "#7E838A" }}>3V</div>
      </>
    ) : <div style={{ position: "absolute", left: "50%", top: "40%", translate: "-50% 0", fontFamily: LABEL, fontWeight: 700, fontSize: d * 0.2, color: "#6E737A" }}>–</div>}
  </div>
);
export const ClBatterySwap: React.FC<{ mode?: "id" | "plus" | "edges"; bed?: string }> = ({ mode = "id", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 15);
  if (mode === "edges") {
    const a = pop(f, fps, 4, 14), b = pop(f, fps, 14, 14);
    const Fing: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => <div style={{ position: "absolute", left: x, top: y, width: 120, height: 220, borderRadius: 60, background: "linear-gradient(90deg,#C08E6B,#E2B694,#B98563)", rotate: `${r}deg`, boxShadow: "0 16px 26px rgba(0,0,0,0.35)" }}><div style={{ position: "absolute", left: 22, top: 12, width: 76, height: 70, borderRadius: "40px 40px 20px 20px", background: "rgba(255,235,220,0.7)" }} /></div>;
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={701} dim={0.3} />
        {[{ x: 220, ok: true, k: a }, { x: 1020, ok: false, k: b }].map((s, i) => (
          <div key={i} style={{ position: "absolute", left: s.x, top: 180, width: 680, height: 720, opacity: clamp01(s.k * 1.4), scale: String(0.85 + 0.15 * s.k) }}>
            <Card style={{ position: "absolute", inset: 0, padding: 0, borderRadius: 18, overflow: "hidden", borderBottom: `10px solid ${s.ok ? CL.navy : CL.red}` }}><div /></Card>
            <div style={{ position: "absolute", left: 150, top: 130 }}><Cell d={380} /></div>
            {s.ok ? <><Fing x={40} y={170} r={-80} /><Fing x={520} y={170} r={80} /></> : <><Fing x={250} y={-40} r={0} /><Fing x={260} y={430} r={180} /></>}
            {!s.ok ? <div style={{ position: "absolute", left: 300, top: 300, width: 90, height: 70, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(120,90,60,0.35), rgba(120,90,60,0) 70%)" }} /> : null}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 52, color: s.ok ? CL.navy : CL.red, letterSpacing: 2 }}>{s.ok ? "✓ POR LOS BORDES" : "✗ LOS DEDOS EN LA CARA"}</div>
          </div>
        ))}
        <RoomLight k={0.5} />
      </AbsoluteFill>
    );
  }
  const spin = interpolate(f, [0, T], [-14, 8]);
  const lensK = mode === "id" ? ease(clamp01((f - 12) / 16)) : 0;
  const drop = mode === "plus" ? ease(clamp01((f - T * 0.45) / 18)) : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={702} dim={0.28} />
      <Contact x={mode === "plus" ? 760 : 820} y={880} w={620} o={0.35} />
      {mode === "plus" ? (
        // el control abierto (media almeja) con el soporte de la pila
        <div style={{ position: "absolute", left: 420, top: 420, width: 680, height: 420, transform: "perspective(1400px) rotateX(48deg)", opacity: clamp01(p * 1.4) }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 160, background: "linear-gradient(#26292F,#121418)", boxShadow: "0 30px 50px rgba(0,0,0,0.5)" }} />
          <div style={{ position: "absolute", left: 90, top: 60, width: 500, height: 300, borderRadius: 40, background: "#2E6B3A" }} />
          <div style={{ position: "absolute", left: 180, top: 40, width: 320, height: 320, borderRadius: "50%", border: "12px solid #B9BDC2" }} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: mode === "plus" ? 550 : 600, top: mode === "plus" ? 140 + drop * 330 : 250, transform: `perspective(1400px) rotateX(${mode === "plus" ? 20 + 28 * drop : 18}deg) rotateZ(${spin}deg) scale(${(0.8 + 0.2 * p) * (mode === "plus" ? 1 - 0.25 * drop : 1)})`, opacity: clamp01(p * 1.4) }}>
        <Cell d={420} glow={mode === "plus" ? 0.6 + 0.4 * Math.sin(f * 0.3) : 0} />
      </div>
      {mode === "id" ? (
        <>
          <div style={{ position: "absolute", left: 980 + (1 - lensK) * 400, top: 260, width: 360, height: 360, borderRadius: "50%", overflow: "hidden", border: "16px solid #2B2F36", opacity: lensK, boxShadow: "0 30px 50px rgba(0,0,0,0.45)", background: "radial-gradient(circle at 35% 30%, #FFFFFF, #C9CDD2 60%, #9EA2A8)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 110, color: "#5E636A", textShadow: "2px 2px 0 rgba(255,255,255,0.9)" }}>2032</div>
          </div>
          <Note x={1400} y={680} o={lin(f, 28, 40)} big="CR2032" small="el número, en la pila vieja" w={440} />
        </>
      ) : null}
      {mode === "plus" ? <><Tag x={1200} y={200} text="El + hacia arriba" color={CL.nitrile} o={lin(f, 8, 18)} size={52} /><Note x={1200} y={330} o={lin(f, T * 0.55, T * 0.55 + 10)} big="Igual que la vieja" small="sácale una foto antes" /></> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// la cochera / el estacionamiento desde arriba: piso, casa, auto (CarTop) y el alcance del control
export const ClRangeMeter: React.FC<{ mode?: "now" | "compare" | "drop"; bed?: string }> = ({ mode = "now", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const pct = mode === "drop" ? 1 - ease(clamp01((f - 10) / (T * 0.6))) : mode === "now" ? 0.08 : 1;
  const HX = 360, CX = 1340, CY = 560; // Elena en la puerta de la casa → el auto
  const reach = (k: number) => 60 + 980 * k;
  const before = mode === "compare" ? 1 : pct, after = mode === "compare" ? ease(clamp01((f - T * 0.45) / 16)) : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={711} dim={0.3} />
      <div style={{ position: "absolute", left: 120, top: 140 + (1 - p) * 120, width: 1680, height: 820, transform: "perspective(2200px) rotateX(30deg)", transformOrigin: "50% 100%", opacity: clamp01(p * 1.4) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(#C9C5BC,#B4AFA5)", boxShadow: "0 40px 70px rgba(0,0,0,0.45)" }} />
        {/* la casa */}
        <div style={{ position: "absolute", left: 40, top: 120, width: 240, height: 580, borderRadius: 10, background: "#EDE6D8", border: `6px solid ${CL.navy}` }}>
          <div style={{ position: "absolute", right: -10, top: 250, width: 26, height: 110, background: "#6B4A2E", borderRadius: 4 }} />
          <div style={{ position: "absolute", left: 20, top: 20, fontFamily: LABEL, fontWeight: 700, fontSize: 34, color: CL.navy }}>CASA</div>
        </div>
        {/* Elena (punto) en la puerta */}
        <div style={{ position: "absolute", left: HX - 120 - 24, top: CY - 140 - 24, width: 48, height: 48, borderRadius: "50%", background: CL.nitrile, border: "6px solid #fff", boxShadow: "0 6px 12px rgba(0,0,0,0.4)" }} />
        {/* alcance */}
        <svg width={1680} height={820} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {mode !== "compare" ? <circle cx={HX - 120} cy={CY - 140} r={reach(pct)} fill={hexA(pct > 0.5 ? "#4CAF50" : CL.red, 0.14)} stroke={pct > 0.5 ? "#2E7D32" : CL.red} strokeWidth={6} strokeDasharray="20 12" /> : (
            <>
              <circle cx={HX - 120} cy={CY - 140} r={reach(1)} fill={hexA("#4CAF50", 0.1)} stroke="#2E7D32" strokeWidth={6} strokeDasharray="20 12" />
              <circle cx={CX - 120} cy={CY - 140} r={60 + 40 * after} fill={hexA(CL.red, 0.2 * after)} stroke={CL.red} strokeWidth={6} opacity={after} />
            </>
          )}
          <line x1={HX - 120} y1={CY - 140 + 90} x2={CX - 340} y2={CY - 140 + 90} stroke={CL.navy} strokeWidth={5} strokeDasharray="14 10" />
        </svg>
        <div style={{ position: "absolute", left: (HX + CX) / 2 - 260, top: CY - 30, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CL.navy }}>20 metros</div>
        <div style={{ position: "absolute", left: CX - 520, top: CY - 320 }}><CarTop w={560} /></div>
      </div>
      {mode === "now" ? <Note x={1240} y={100} o={lin(f, 12, 24)} big="Ahora: 1 metro" small="pegada a la puerta" color={CL.red} w={520} /> : null}
      {mode === "compare" ? <><Tag x={160} y={100} text="Antes: 20 m" color={CL.navy} o={lin(f, 6, 16)} size={52} /><Tag x={1260} y={100} text="Ahora: 1 m" color={CL.red} o={after} size={52} /></> : null}
      {mode === "drop" ? (
        <div style={{ position: "absolute", left: 1420, top: 110, opacity: lin(f, 4, 14) }}>
          <svg width={380} height={170}><rect x={8} y={20} width={300} height={130} rx={18} fill="rgba(20,27,46,0.6)" stroke="#fff" strokeWidth={10} /><rect x={308} y={60} width={30} height={50} rx={6} fill="#fff" /><rect x={26} y={38} width={264 * pct} height={94} rx={8} fill={pct > 0.5 ? "#4CAF50" : pct > 0.2 ? "#F2C230" : CL.red} /></svg>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 44, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>LA PILA SE ACABA</div>
        </div>
      ) : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

export const ClPanicWaves: React.FC<{ mode?: "alarm" | "find"; bed?: string }> = ({ mode = "alarm", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const on = f > 10, blink = on && Math.floor(f / 6) % 2 === 0;
  const cars: [number, number][] = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) cars.push([150 + c * 190, 90 + r * 260]);
  const ME = mode === "find" ? 13 : 10;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={721} dim={0.3} />
      <div style={{ position: "absolute", left: 120, top: 120 + (1 - p) * 120, width: 1680, height: 840, transform: "perspective(2200px) rotateX(32deg)", transformOrigin: "50% 100%", opacity: clamp01(p * 1.4) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: "#55595F", boxShadow: "0 40px 70px rgba(0,0,0,0.45)" }} />
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 190, top: 40, width: 6, height: 760, background: "rgba(255,255,255,0.55)" }} />)}
        {cars.map(([x, y], i) => {
          const me = i === ME, lit = me && (mode === "alarm" ? blink : f > T * 0.35 && blink);
          return (
            <div key={i} style={{ position: "absolute", left: x - 70, top: y, transform: "rotate(90deg)", transformOrigin: "70px 40px" }}>
              <div style={{ width: 200, height: 90, position: "relative", filter: lit ? `drop-shadow(0 0 26px ${CL.yellow})` : undefined }}>
                <CarTop w={200} fill={me ? "#F4F6F8" : ["#D7DBE0", "#9BA3AD", "#C9CED4", "#7E8792"][i % 4]} sw={4} />
              </div>
            </div>
          );
        })}
        <svg width={1680} height={840} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {on ? [0, 1, 2, 3].map((i) => { const t = ((f * 0.03 + i / 4) % 1); const [x, y] = cars[ME]; return <circle key={i} cx={x + 30} cy={y + 100} r={40 + t * 520} fill="none" stroke={CL.yellow} strokeWidth={8} opacity={(1 - t) * (mode === "alarm" ? 0.9 : f > T * 0.35 ? 0.9 : 0)} />; }) : null}
        </svg>
        {mode === "find" ? <div style={{ position: "absolute", left: cars[ME][0] + 4, top: cars[ME][1] - 70 - 30 * lin(f, T * 0.35, T * 0.45), opacity: lin(f, T * 0.35, T * 0.45) }}><svg width={60} height={80}><path d="M30 78 C 10 50 4 38 4 28 A 26 26 0 1 1 56 28 C 56 38 50 50 30 78 Z" fill={CL.nitrile} stroke="#fff" strokeWidth={4} /><circle cx={30} cy={28} r={9} fill="#fff" /></svg></div> : null}
      </div>
      {mode === "alarm" ? <><Tag x={160} y={80} text="Botón rojo: pánico" color={CL.red} o={lin(f, 6, 16)} size={52} /><Note x={1260} y={80} o={lin(f, 24, 36)} big="Bocina y luces" small="sin parar" color={CL.red} w={460} /></> : null}
      {mode === "find" ? <><Tag x={160} y={80} text="Un toque corto" color={CL.navy} o={lin(f, 6, 16)} size={52} /><Note x={1260} y={80} o={lin(f, T * 0.45, T * 0.45 + 10)} big="Ahí está" small="entre 30 autos iguales" w={460} /></> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

export const ClDoorUnlock: React.FC<{ mode?: "once" | "twice"; bed?: string }> = ({ mode = "once", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const t1 = 16, t2 = mode === "twice" ? 30 : 9999;
  const k1 = lin(f, t1, t1 + 6), k2 = lin(f, t2, t2 + 6);
  // posiciones de las 4 trabas en CarTop (w=1100 → escala 1100/900): conductor arriba-adelante
  const s = 1100 / 900, D = [[560, 52, true], [360, 52, false], [560, 353, false], [360, 353, false]] as [number, number, boolean][];
  const Press: React.FC<{ at: number; x: number }> = ({ at, x }) => { const k = lin(f, at, at + 4) * (1 - lin(f, at + 6, at + 12)); return <div style={{ position: "absolute", left: x, top: 70, width: 90, height: 90, borderRadius: "50%", background: CL.nitrile, opacity: 0.25 + 0.75 * lin(f, at - 2, at), scale: String(1 - 0.15 * k), boxShadow: `0 0 ${30 * k}px ${CL.nitrile}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: "#fff" }}>{at === t1 ? "1" : "2"}</div>; };
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={731} dim={0.3} />
      <Contact x={960} y={860} w={1200} o={0.32} />
      <div style={{ position: "absolute", left: 410, top: 300 + (1 - p) * 120, transform: "perspective(1800px) rotateX(36deg)", opacity: clamp01(p * 1.4), filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.35))" }}>
        <CarTop w={1100} fill="#F2F4F6" />
        <svg width={1100} height={495} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {D.map(([x, y, drv], i) => {
            const open = drv ? k1 : k2;
            return <g key={i}><circle cx={x * s} cy={y * s} r={46} fill={open > 0.5 ? "#4CAF50" : CL.red} stroke="#fff" strokeWidth={6} /><path d={open > 0.5 ? `M ${x * s - 14} ${y * s} l 9 10 l 18 -20` : `M ${x * s - 12} ${y * s - 12} l 24 24 M ${x * s + 12} ${y * s - 12} l -24 24`} stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" /></g>;
          })}
        </svg>
      </div>
      <Press at={t1} x={1460} />
      {mode === "twice" ? <Press at={t2} x={1580} /> : null}
      <Tag x={180} y={110} text={mode === "once" ? "Un toque: sólo tu puerta" : "Dos toques: las 4"} color={mode === "once" ? CL.navy : CL.nitrile} o={lin(f, 4, 14)} size={52} />
      {mode === "once" ? <Note x={180} y={230} o={lin(f, 28, 40)} big="Subes y cierras" small="nadie entra por atrás" w={520} /> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

export const ClProxStart: React.FC<{ mode?: "press" | "chip" | "key"; bed?: string }> = ({ mode = "press", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const near = ease(clamp01((f - 10) / 16)), go = clamp01((f - 34) / 10);
  const needle = -120 + 40 * go + (go > 0 ? Math.sin(f * 0.6) * 3 : 0);
  if (mode === "chip") {
    const k = ease(clamp01((f - 8) / 18));
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={741} dim={0.3} />
        <div style={{ position: "absolute", left: 300, top: 200, width: 760, height: 560, transform: "perspective(1600px) rotateX(30deg) rotateZ(-8deg)", opacity: clamp01(p * 1.4) }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 220, background: "linear-gradient(#26292F,#111316)", boxShadow: "0 40px 60px rgba(0,0,0,0.5)" }} />
          <div style={{ position: "absolute", left: 120, top: 90, width: 520, height: 380, borderRadius: 40, background: "#2E6B3A" }} />
          {/* pila muerta */}
          <div style={{ position: "absolute", left: 160, top: 130, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #9A9EA4, #6C7076)", filter: "grayscale(1)", opacity: 0.85 }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 60, color: "#3A3D42" }}>0%</div>
          </div>
          {/* el chip */}
          <div style={{ position: "absolute", left: 470, top: 190, width: 120, height: 120, background: "#15171A", borderRadius: 10, boxShadow: `0 0 ${50 * k}px ${hexA(CL.yellow, 0.9 * k)}`, border: `4px solid ${hexA(CL.yellow, k)}` }} />
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {[0, 1, 2].map((i) => { const t = ((f * 0.04 + i / 3) % 1); return <path key={i} d={`M ${930 + t * 260} ${420 - t * 90} q 40 60 0 120`} stroke={CL.yellow} strokeWidth={8} fill="none" opacity={(1 - t) * k} />; })}
        </svg>
        <Tag x={1240} y={260} text="El chip no usa pila" color={CL.navy} o={lin(f, 14, 24)} size={50} />
        <Note x={1240} y={380} o={lin(f, 30, 42)} big="El auto lo lee" small="de muy cerca" w={480} />
        <RoomLight k={0.5} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={742} dim={0.3} />
      {/* el botón de encendido / la llave en el tambor */}
      <div style={{ position: "absolute", left: 560, top: 300, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #3A3F46, #15181C 70%)", boxShadow: "0 30px 50px rgba(0,0,0,0.5), inset 0 0 0 14px #9EA4AB", transform: `perspective(1400px) rotateY(-18deg) scale(${0.85 + 0.15 * p})`, opacity: clamp01(p * 1.4) }}>
        {mode === "press" ? (
          <div style={{ position: "absolute", inset: 70, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #2B2F35, #0E1013)", boxShadow: `inset 0 0 0 6px ${go > 0 ? "#4CAF50" : "#C9CDD2"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 46, color: "#E7E9EC", letterSpacing: 2 }}>ENGINE</div>
            <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, color: "#C9CDD2" }}>START · STOP</div>
          </div>
        ) : (
          <div style={{ position: "absolute", inset: 120, borderRadius: "50%", background: "linear-gradient(#D8DCE1,#8E949B)", rotate: `${70 * go}deg` }}><div style={{ position: "absolute", left: "50%", top: 20, translate: "-50% 0", width: 26, height: 140, background: "#2B2F36", borderRadius: 6 }} /></div>
        )}
      </div>
      {mode === "press" ? (
        <div style={{ position: "absolute", left: 980 - 260 * near, top: 300, width: 220, height: 380, borderRadius: 90, background: "linear-gradient(#26292F,#111316)", boxShadow: "0 30px 40px rgba(0,0,0,0.45)", rotate: "-12deg" }}>
          {[70, 160, 250].map((y, i) => <div key={i} style={{ position: "absolute", left: 66, top: y, width: 88, height: 70, borderRadius: "50%", background: i === 2 ? CL.nitrile : "#3A3D44" }} />)}
        </div>
      ) : null}
      {/* cuentavueltas: el motor arranca */}
      <div style={{ position: "absolute", left: 1220, top: 520, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(#1C2330,#07090D)", boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 12px #9EA4AB", opacity: lin(f, 20, 30) }}>
        <div style={{ position: "absolute", left: 166, top: 40, width: 8, height: 130, background: "#F27A1A", borderRadius: 4, transformOrigin: "50% 100%", rotate: `${needle}deg` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 34, color: "#E7E9EC" }}>RPM</div>
      </div>
      <Tag x={1220} y={200} text={mode === "press" ? "Pegado al botón" : "La llave gira"} color={CL.navy} o={lin(f, 6, 16)} size={50} />
      <Note x={1220} y={320} o={go} big="Arranca igual" small="con la pila muerta ✓" w={480} />
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ═════════════════ ep. 3 (mecmillon): la PCV y los hábitos del motor ═════════════════
//   ClPCV3D          la válvula PCV en 3D (three.js) en corte: cuerpo, resorte y émbolo. "intro" gira y se rotula · "rattle" se sacude y el
//                    émbolo golpea (clic, clic: ondas) · "stuck" la mugre negra la llena y el émbolo no se mueve (muda)
//   ClEnginePressure corte del motor (bloque, tapa de válvulas y cárter): "flow" los gases salen por la PCV · "blocked" la PCV tapada, el
//                    manómetro sube, los gases empujan · "leak" el aceite sale por la junta y cae la gota al cartón
//   ClSevereChart    la tabla del manual sobre el asiento: "table" uso normal / uso severo, el resaltador pinta la columna severa ·
//                    "trips" los viajes de Elena (súper, iglesia, hermana) con su minutero: todos < 10 min → SEVERO
//   ClColdStart      el tablero en frío: "wait" 30 s con el motor andando parado · "gentle" el cuentavueltas con la franja suave hasta que
//                    la aguja de la temperatura se mueve
//   ClFilterLight    el filtro de aire contra el sol de la puerta del taller: "check" la luz atraviesa o no · "compare" el de Elena (gris)
//                    al lado de uno nuevo
//   ClLogbook        la libreta azul de Don Ernesto abierta: "ernesto" columnas fecha/km/qué/cuánto que se escriben · "last" la última
//                    línea y la hoja en blanco · "gap" los 6 años en blanco · "new" la letra de Elena · "two" las dos letras ·
//                    "consume" la tabla de cuánto aceite le falta cada 1.000 km
const PcvMesh: React.FC<{ plunger: number; gunk: number; mats: any }> = ({ plunger, gunk, mats }) => (
  <group rotation={[0, 0, Math.PI / 2]}>
    {/* cuerpo transparente (corte) */}
    <mesh material={mats.body}><cylinderGeometry args={[0.34, 0.34, 1.6, 40, 1, true]} /></mesh>
    <mesh material={mats.dark} position={[0, 0.86, 0]}><cylinderGeometry args={[0.2, 0.26, 0.2, 32]} /></mesh>
    <mesh material={mats.dark} position={[0, -0.86, 0]}><cylinderGeometry args={[0.26, 0.2, 0.2, 32]} /></mesh>
    <mesh material={mats.dark} position={[0, 1.15, 0]}><cylinderGeometry args={[0.12, 0.12, 0.45, 24]} /></mesh>
    {/* resorte */}
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} material={mats.spring} position={[0, -0.6 + i * 0.09 + plunger * 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.2, 0.025, 8, 24]} /></mesh>)}
    {/* émbolo */}
    <mesh material={mats.metal} position={[0, 0.3 + plunger * 0.25, 0]}><cylinderGeometry args={[0.24, 0.24, 0.35, 32]} /></mesh>
    {/* mugre */}
    {gunk > 0 ? <mesh material={mats.gunk} position={[0, -0.1, 0]} scale={[1, 0.2 + gunk * 0.8, 1]}><cylinderGeometry args={[0.32, 0.32, 1.3, 32]} /></mesh> : null}
  </group>
);
export const ClPCV3D: React.FC<{ mode?: "intro" | "rattle" | "stuck"; bed?: string }> = ({ mode = "intro", bed }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 15);
  const mats = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ color: "#2A2D33", roughness: 0.35, metalness: 0.1, transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
    dark: new THREE.MeshStandardMaterial({ color: "#1C1E22", roughness: 0.5 }),
    spring: new THREE.MeshStandardMaterial({ color: "#C9CDD2", metalness: 0.8, roughness: 0.3 }),
    metal: new THREE.MeshStandardMaterial({ color: "#D8DCE1", metalness: 0.85, roughness: 0.25, emissive: "#555A60", emissiveIntensity: 0.3 }),
    gunk: new THREE.MeshStandardMaterial({ color: "#14100A", roughness: 0.9, transparent: true, opacity: 0.92 }),
  }), []);
  const shake = mode === "rattle" ? Math.sin(f * 1.6) * 0.18 * clamp01((f - 10) / 6) : 0;
  const plunger = mode === "rattle" ? (Math.sin(f * 1.6) > 0 ? 1 : 0) : mode === "stuck" ? 0 : 0.5 + 0.5 * Math.sin(f * 0.1);
  const gunk = mode === "stuck" ? ease(clamp01((f - 8) / 26)) : 0;
  const a = mode === "intro" ? interpolate(f, [0, T], [-0.6, 0.5]) : -0.25;
  const target = new THREE.Vector3(0, 0, 0), camPos = new THREE.Vector3(Math.sin(a) * 6, 1.1, Math.cos(a) * 6);
  const click = mode === "rattle" && Math.sin(f * 1.6) > 0.9;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={801} dim={0.28} />
      <Contact x={760} y={820} w={760} o={0.3} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-0.12 * width}px) rotate(${shake * 8}deg) scale(${0.8 + 0.2 * p})`, opacity: clamp01(p * 1.4) }}>
        <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [camPos.x, camPos.y, camPos.z] }} gl={{ antialias: true, alpha: true }}>
          <Cam pos={camPos} target={target} />
          <ambientLight intensity={1} />
          <hemisphereLight args={["#FFFFFF", "#6B6257", 0.7]} />
          <directionalLight position={[-3, 5, 4]} intensity={1.6} color="#FFF3DF" />
          <directionalLight position={[4, 1, -2]} intensity={0.7} />
          <PcvMesh plunger={plunger} gunk={gunk} mats={mats} />
        </ThreeCanvas>
      </div>
      {mode === "rattle" ? <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{[0, 1, 2].map((i) => { const t = ((f * 0.06 + i / 3) % 1); return <path key={i} d={`M ${980 + t * 160} ${430 - t * 60} q 40 110 0 220`} stroke={CL.navy} strokeWidth={8} fill="none" opacity={(1 - t) * 0.8} />; })}</svg> : null}
      {click ? <div style={{ position: "absolute", left: 1000, top: 300, fontFamily: HAND, fontWeight: 700, fontSize: 90, color: CL.navy, rotate: "-8deg" }}>¡clic!</div> : null}
      {mode === "intro" ? <><Tag x={1180} y={240} text="Válvula PCV" color={CL.nitrile} o={lin(f, 10, 20)} size={56} /><Note x={1180} y={370} o={lin(f, 26, 38)} big="Del tamaño de un dedo" small="US$ 5 a 10" w={520} /></> : null}
      {mode === "rattle" ? <><Tag x={1180} y={240} text="Sana: suena" color={CL.navy} o={lin(f, 8, 18)} size={56} /><Note x={1180} y={370} o={lin(f, 24, 36)} big="Como un sonajero" small="clic, clic ✓" w={520} /></> : null}
      {mode === "stuck" ? <><Tag x={1180} y={240} text="Tapada: muda" color={CL.red} o={lin(f, 8, 18)} size={56} /><Note x={1180} y={370} o={lin(f, 30, 42)} big="Pegada de aceite viejo" small="los gases no salen" color={CL.red} w={520} /></> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

export const ClEnginePressure: React.FC<{ mode?: "flow" | "blocked" | "leak"; bed?: string }> = ({ mode = "flow", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const press = mode === "flow" ? 0.25 : mode === "blocked" ? ease(clamp01((f - 10) / (T * 0.5))) : 0.9;
  const drop = mode === "leak" ? ((f - 20) % 40) / 40 : -1;
  const dots = Array.from({ length: 14 }, (_, i) => i);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={811} dim={0.3} />
      <div style={{ position: "absolute", left: 300, top: 120 + (1 - p) * 120, opacity: clamp01(p * 1.4), filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.4))" }}>
        <svg width={1000} height={860} viewBox="0 0 1000 860">
          <defs><linearGradient id="epBlock" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8E949C" /><stop offset="50%" stopColor="#C2C7CD" /><stop offset="100%" stopColor="#8E949C" /></linearGradient></defs>
          {/* tapa de válvulas */}
          <rect x={180} y={90} width={640} height={110} rx={30} fill="#2B2F36" />
          {/* junta (roja si pierde) */}
          <rect x={170} y={196} width={660} height={14} rx={6} fill={mode === "leak" || press > 0.7 ? CL.red : "#4A4F57"} />
          {/* bloque con cilindros */}
          <rect x={200} y={210} width={600} height={380} fill="url(#epBlock)" stroke="#5E646C" strokeWidth={6} />
          {[290, 430, 570, 710].map((x, i) => { const y = 300 + Math.sin(f * 0.35 + i * 1.6) * 40; return <g key={i}><rect x={x - 50} y={230} width={100} height={300} fill="#6F757D" /><rect x={x - 46} y={y} width={92} height={70} rx={8} fill="#D8DCE1" /></g>; })}
          {/* cárter con aceite */}
          <path d="M 220 590 L 780 590 L 740 760 L 260 760 Z" fill="#3A3D42" />
          <path d="M 250 690 L 750 690 L 735 750 L 265 750 Z" fill="#7A4A12" opacity={0.95} />
          {/* gases (puntos) */}
          {dots.map((i) => { const t = ((f * (mode === "flow" ? 0.02 : 0.008) + i / 14) % 1); const x = 260 + (i % 7) * 80 + Math.sin(f * 0.1 + i) * 10; const y = mode === "flow" ? 560 - t * 470 : 560 - t * 330 * (1 - 0.3 * press); return <circle key={i} cx={x} cy={y} r={10 + 6 * press} fill={press > 0.6 ? hexA(CL.red, 0.55) : "rgba(150,160,170,0.6)"} />; })}
          {/* la PCV arriba */}
          <rect x={700} y={40} width={50} height={70} rx={10} fill={mode === "flow" ? "#4CAF50" : CL.red} />
          {mode === "flow" ? [0, 1, 2].map((i) => { const t = ((f * 0.03 + i / 3) % 1); return <path key={i} d={`M 725 ${40 - t * 40} q 30 -30 60 -10`} stroke="#9AA3AD" strokeWidth={10} fill="none" opacity={1 - t} />; }) : <path d="M 705 20 l 40 40 M 745 20 l -40 40" stroke="#fff" strokeWidth={8} strokeLinecap="round" />}
          {/* gota que sale por la junta */}
          {mode === "leak" && drop >= 0 ? <ellipse cx={830} cy={210 + drop * 600} rx={12} ry={16} fill="#3A2210" /> : null}
          {mode === "leak" ? <rect x={760} y={820} width={200} height={30} rx={4} fill="#C9A77A" /> : null}
        </svg>
      </div>
      {/* manómetro */}
      <div style={{ position: "absolute", left: 1350, top: 180, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(#FBFBF8,#E5E3DC)", boxShadow: `0 20px 40px ${CL.shadow}, inset 0 0 0 12px #9EA4AB`, opacity: lin(f, 6, 16) }}>
        <svg width={300} height={300} style={{ position: "absolute" }}><path d="M 60 220 A 110 110 0 1 1 240 220" fill="none" stroke="#4CAF50" strokeWidth={16} /><path d="M 196 72 A 110 110 0 0 1 240 220" fill="none" stroke={CL.red} strokeWidth={16} /></svg>
        <div style={{ position: "absolute", left: 146, top: 50, width: 8, height: 100, background: CL.ink, borderRadius: 4, transformOrigin: "50% 100%", rotate: `${-130 + 260 * press}deg` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 30, color: CL.ink }}>PRESIÓN</div>
      </div>
      {mode === "flow" ? <Note x={1300} y={560} o={lin(f, 18, 30)} big="Los gases salen" small="por la PCV ✓" w={460} /> : null}
      {mode === "blocked" ? <Note x={1300} y={560} o={lin(f, T * 0.5, T * 0.5 + 10)} big="La presión sube" small="y empuja el aceite" color={CL.red} w={460} /> : null}
      {mode === "leak" ? <Note x={1300} y={560} o={lin(f, 18, 30)} big="Sale por la junta" small="no es el motor gastado" color={CL.red} w={460} /> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

export const ClSevereChart: React.FC<{ mode?: "table" | "trips"; bed?: string }> = ({ mode = "table", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  if (mode === "trips") {
    const trips: [string, number][] = [["Súper", 6], ["Iglesia", 8], ["Su hermana", 9]];
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={821} dim={0.3} />
        <div style={{ position: "absolute", left: 200, top: 170, display: "flex", gap: 50, opacity: clamp01(p * 1.4) }}>
          {trips.map(([t, m], i) => {
            const k = pop(f, fps, 6 + i * 8, 14), arc = clamp01((f - 10 - i * 8) / 20) * (m / 10);
            return (
              <div key={i} style={{ width: 440, scale: String(0.85 + 0.15 * k), opacity: clamp01(k * 1.4) }}>
                <Card style={{ padding: "30px 30px 26px", borderBottom: `8px solid ${CL.nitrile}`, textAlign: "center" }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CL.ink }}>{t}</div>
                  <svg width={260} height={260} style={{ margin: "10px auto 0", display: "block" }}><circle cx={130} cy={130} r={104} fill="none" stroke="#E5E3DC" strokeWidth={24} /><circle cx={130} cy={130} r={104} fill="none" stroke={CL.nitrile} strokeWidth={24} strokeDasharray={653} strokeDashoffset={653 * (1 - arc)} transform="rotate(-90 130 130)" strokeLinecap="round" /><text x={130} y={148} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={64} fill={CL.ink}>{m}′</text></svg>
                  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CL.inkSoft }}>minutos</div>
                </Card>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: "50%", top: 790, translate: "-50% 0", rotate: "-4deg", opacity: lin(f, T * 0.55, T * 0.55 + 8), scale: String(1.5 - 0.5 * lin(f, T * 0.55, T * 0.55 + 8)), border: `10px solid ${CL.red}`, color: CL.red, fontFamily: LABEL, fontWeight: 700, fontSize: 86, padding: "6px 40px", borderRadius: 16, background: "rgba(255,255,255,0.85)" }}>USO SEVERO</div>
        <RoomLight k={0.5} />
      </AbsoluteFill>
    );
  }
  const rows: [string, string, string][] = [["Aceite y filtro", "10.000 km", "5.000 km"], ["Filtro de aire", "40.000 km", "20.000 km"], ["Revisar PCV", "—", "c/ 2-3 cambios"], ["Líquido de frenos", "2 años", "2 años"]];
  const hl = ease(clamp01((f - 18) / 22));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={822} dim={0.28} />
      <div style={{ position: "absolute", left: 300, top: 150 + (1 - p) * 120, width: 1320, transform: "perspective(1800px) rotateX(22deg) rotateZ(-1.5deg)", opacity: clamp01(p * 1.4) }}>
        <Card style={{ padding: "40px 50px", borderRadius: 8 }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 3, color: CL.navy, borderBottom: `4px solid ${CL.navy}`, paddingBottom: 10, marginBottom: 18 }}>TABLA DE MANTENIMIENTO</div>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", rowGap: 18, fontFamily: LABEL, fontSize: 40, color: CL.ink, position: "relative" }}>
            <div style={{ position: "absolute", left: "70.5%", top: -8, width: "29.5%", bottom: -8, background: hexA(CL.yellow, 0.55), transformOrigin: "top", scale: `1 ${hl}`, borderRadius: 6 }} />
            <div style={{ fontWeight: 700 }} />
            <div style={{ fontWeight: 700, color: CL.inkSoft }}>USO NORMAL</div>
            <div style={{ fontWeight: 700, color: CL.red, position: "relative" }}>USO SEVERO</div>
            {rows.map((r, i) => <React.Fragment key={i}><div>{r[0]}</div><div style={{ color: CL.inkSoft }}>{r[1]}</div><div style={{ fontWeight: 700, position: "relative" }}>{r[2]}</div></React.Fragment>)}
          </div>
        </Card>
      </div>
      <Note x={1260} y={760} o={lin(f, 44, 56)} big="Éste es el tuyo" small="trayectos cortos, tráfico, calor" w={560} />
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

export const ClColdStart: React.FC<{ mode?: "wait" | "gentle"; bed?: string }> = ({ mode = "wait", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const k = clamp01((f - 8) / (T * 0.7));
  const temp = mode === "gentle" ? -60 + 50 * ease(k) : -60;
  const rpm = mode === "gentle" ? -100 + 70 + Math.sin(f * 0.2) * 8 : -100 + 25;
  const secs = Math.min(30, Math.round(k * 30));
  const Dial: React.FC<{ x: number; label: string; ang: number; band?: boolean; red?: boolean }> = ({ x, label, ang, band, red }) => (
    <div style={{ position: "absolute", left: x, top: 260, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(#1C2330,#07090D)", boxShadow: "0 30px 50px rgba(0,0,0,0.5), inset 0 0 0 14px #9EA4AB" }}>
      <svg width={420} height={420} style={{ position: "absolute" }}>
        {band ? <path d="M 90 300 A 150 150 0 0 1 150 110" fill="none" stroke="#4CAF50" strokeWidth={18} opacity={0.9} /> : null}
        {red ? <path d="M 300 120 A 150 150 0 0 1 340 280" fill="none" stroke={CL.red} strokeWidth={16} /> : null}
        {Array.from({ length: 9 }, (_, i) => { const a = (-120 + i * 30) * Math.PI / 180 - Math.PI / 2; return <line key={i} x1={210 + Math.cos(a) * 170} y1={210 + Math.sin(a) * 170} x2={210 + Math.cos(a) * 145} y2={210 + Math.sin(a) * 145} stroke="#E7E9EC" strokeWidth={6} />; })}
      </svg>
      <div style={{ position: "absolute", left: 204, top: 60, width: 12, height: 150, background: "#F27A1A", borderRadius: 6, transformOrigin: "50% 100%", rotate: `${ang}deg` }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: "#E7E9EC" }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={831} dim={0.3} />
      <div style={{ position: "absolute", inset: 0, transform: `perspective(1800px) rotateX(10deg) scale(${0.85 + 0.15 * p})`, opacity: clamp01(p * 1.4) }}>
        <Dial x={340} label="RPM" ang={rpm} band={mode === "gentle"} />
        <Dial x={900} label="TEMP" ang={temp} red />
      </div>
      {mode === "wait" ? (
        <div style={{ position: "absolute", left: 1400, top: 300, opacity: lin(f, 6, 14) }}>
          <svg width={300} height={300}><circle cx={150} cy={150} r={124} fill="rgba(20,27,46,0.75)" stroke="rgba(255,255,255,0.25)" strokeWidth={16} /><circle cx={150} cy={150} r={124} fill="none" stroke={CL.nitrile} strokeWidth={16} strokeDasharray={779} strokeDashoffset={779 * (1 - secs / 30)} transform="rotate(-90 150 150)" strokeLinecap="round" /><text x={150} y={176} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={110} fill="#fff">{secs}</text></svg>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 44, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,0.6)", textAlign: "center", width: 300 }}>SEGUNDOS</div>
        </div>
      ) : null}
      <Tag x={340} y={130} text={mode === "wait" ? "30 segundos y salir despacio" : "Suave hasta que se mueva la aguja"} color={CL.navy} o={lin(f, 6, 16)} size={46} />
      {mode === "gentle" ? <Note x={1400} y={300} o={lin(f, T * 0.6, T * 0.6 + 10)} big="Aceite frío = espeso" small="el desgaste está acá" w={440} /> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

export const ClFilterLight: React.FC<{ mode?: "check" | "compare"; bed?: string }> = ({ mode = "check", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const sun = 0.6 + 0.4 * Math.sin(f * 0.05);
  const Filter: React.FC<{ dirt: number; x: number; label: string; ok: boolean; k: number }> = ({ dirt, x, label, ok, k }) => (
    <div style={{ position: "absolute", left: x, top: 200, width: 560, height: 680, opacity: clamp01(k * 1.4), scale: String(0.85 + 0.15 * k) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "#2B2F36", padding: 26 }}>
        <div style={{ position: "absolute", inset: 26, borderRadius: 8, overflow: "hidden", background: `repeating-linear-gradient(90deg, ${dirt > 0.5 ? "#4A4438" : "#F4EEDC"} 0 22px, ${dirt > 0.5 ? "#2E2A22" : "#E2D8BC"} 22px 44px)` }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, rgba(255,246,210,${(1 - dirt) * 0.85 * sun}), rgba(255,246,210,0) 70%)` }} />
          <div style={{ position: "absolute", inset: 0, background: `rgba(30,25,18,${dirt * 0.55})` }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", bottom: -80, translate: "-50% 0", whiteSpace: "nowrap", background: ok ? CL.navy : CL.red, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 46, padding: "6px 22px", borderRadius: 10, boxShadow: `0 12px 26px ${CL.shadow}` }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={841} dim={0.25} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, rgba(255,240,200,${0.45 * sun}), rgba(255,240,200,0) 60%)` }} />
      {mode === "check" ? (
        <>
          <Filter dirt={ease(clamp01((f - T * 0.4) / 20))} x={680} label={f < T * 0.4 ? "Pasa la luz ✓" : "No pasa la luz ✗"} ok={f < T * 0.4} k={p} />
          <Tag x={160} y={140} text="Contra el sol" color={CL.navy} o={lin(f, 6, 16)} size={52} />
          <Note x={1340} y={520} o={lin(f, T * 0.5, T * 0.5 + 10)} big="Se cambia" small="US$ 6" w={420} />
        </>
      ) : (
        <>
          <Filter dirt={0.95} x={340} label="El de Elena" ok={false} k={pop(f, fps, 2, 14)} />
          <Filter dirt={0} x={1020} label="Uno nuevo" ok k={pop(f, fps, 14, 14)} />
        </>
      )}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

export const ClLogbook: React.FC<{ mode?: "ernesto" | "last" | "gap" | "new" | "two" | "consume"; bed?: string; rows?: [string, string, string, string][]; elena?: string[]; tag?: string; note?: [string, string] }> = ({ mode = "ernesto", bed, rows, elena, tag, note }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 16);
  const ERN = "#1F3A8A", ELE = "#1B5E20";
  const lines: [string, string, string, string][] = rows ? rows : mode === "consume"
    ? [["1.000 km", "le faltó", "¼ litro", ""], ["2.000 km", "le faltó", "¼ litro", ""], ["3.000 km", "le faltó", "½ litro", "→ PCV"]]
    : [["03/13", "15.200", "aceite+filtro", ""], ["09/13", "20.100", "aceite+filtro", ""], ["04/14", "25.300", "f. aire", ""], ["…", "…", "…", ""], ["03/19", "248.900", "aceite+filtro", ""]];
  const step = Math.max(6, (T * 0.55) / lines.length);
  const showNew = mode === "new" || mode === "two";
  const gapK = mode === "gap" ? ease(clamp01((f - 12) / 20)) : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={851} dim={0.28} />
      <Contact x={960} y={940} w={1300} o={0.35} />
      <div style={{ position: "absolute", left: 260, top: 110 + (1 - p) * 140, width: 1400, height: 820, transform: "perspective(2200px) rotateX(26deg) rotateZ(-2deg)", opacity: clamp01(p * 1.4) }}>
        {/* tapas azules */}
        <div style={{ position: "absolute", inset: -24, borderRadius: 30, background: "linear-gradient(135deg,#2D4F8E,#1C3566)", boxShadow: "0 40px 70px rgba(0,0,0,0.5)" }} />
        {/* dos hojas */}
        {[0, 1].map((side) => (
          <div key={side} style={{ position: "absolute", left: side * 700, top: 0, width: 700, height: 820, background: "#FBF8EE", borderRadius: side ? "0 14px 14px 0" : "14px 0 0 14px", backgroundImage: "repeating-linear-gradient(#FBF8EE 0 118px, #C9D6E8 118px 120px)", boxShadow: side ? "inset 18px 0 30px rgba(0,0,0,0.08)" : "inset -18px 0 30px rgba(0,0,0,0.08)" }} />
        ))}
        {/* hoja izquierda: las entradas de Don Ernesto (o la tabla de consumo) */}
        <div style={{ position: "absolute", left: 40, top: 40, width: 640, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: mode === "consume" ? ELE : ERN, lineHeight: "120px" }}>
          {lines.map((l, i) => {
            const k = mode === "last" || mode === "gap" || mode === "two" || mode === "new" ? 1 : clamp01((f - 8 - i * step) / 8);
            return <div key={i} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1.6fr 0.4fr", clipPath: `inset(0 ${100 - k * 100}% 0 0)`, color: mode === "last" && i === lines.length - 1 ? CL.red : undefined }}><span>{l[0]}</span><span>{l[1]}</span><span>{l[2]}</span><span>{l[3]}</span></div>;
          })}
        </div>
        {/* hoja derecha: en blanco / los 6 años / la letra de Elena */}
        <div style={{ position: "absolute", left: 740, top: 40, width: 620, fontFamily: HAND, fontWeight: 700, fontSize: 60, lineHeight: "120px" }}>
          {mode === "gap" ? <div style={{ opacity: gapK, fontFamily: LABEL, fontSize: 64, color: CL.red, textAlign: "center", marginTop: 220 }}>6 AÑOS EN BLANCO</div> : null}
          {showNew ? (() => { const k = mode === "two" ? 1 : clamp01((f - 14) / (T * 0.4)); return <div style={{ color: ELE, clipPath: `inset(0 ${100 - k * 100}% 0 0)`, rotate: "-1deg" }}>{elena ? elena.map((l, i) => <div key={i} style={{ fontSize: elena.length > 4 ? 48 : 60, lineHeight: elena.length > 4 ? "106px" : "120px" }}>{l}</div>) : <><div>10/2026 · 280.400</div><div>PCV, f. aire, aceite</div><div style={{ fontSize: 34, opacity: 0.8 }}>— Elena</div></>}</div>; })() : null}
        </div>
      </div>
      {mode === "ernesto" ? <Tag x={180} y={70} text={tag || "Cada 5.000 km, sin faltar uno"} color={CL.navy} o={lin(f, 10, 20)} size={46} /> : null}
      {mode === "last" ? <Note x={1330} y={70} o={lin(f, 12, 24)} big={note ? note[0] : "La última línea"} small={note ? note[1] : "marzo, 6 años atrás"} color={CL.red} w={480} /> : null}
      {mode === "two" ? <Tag x={180} y={70} text="Dos letras" color={CL.navy} o={lin(f, 6, 16)} size={46} /> : null}
      {mode === "consume" ? <Tag x={180} y={70} text="Mide cada 1.000 km" color={CL.navy} o={lin(f, 6, 16)} size={46} /> : null}
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};
