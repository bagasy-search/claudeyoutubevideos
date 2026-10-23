// abyss03 · MINUTO 2 (66,9–141,5 s): UN cuerpo en el agua, una cámara, todo colgado del segundo GLOBAL t.
// busto grande a ras del agua con RAYOS X bajo la superficie (pulmones y corazón que brillan): los dos mitos se tachan
// → la regla 1·10·1 se arma a la derecha → "1": el frío pinta la piel, la boqueada infla los pulmones, la ola entra y los llena,
// el reloj del primer minuto, el corazón se dispara → "10": la cámara BAJA por el brazo hasta la mano en primer plano,
// el frío sube desde la punta de los dedos, ya no cierran, la soga se escapa → la cámara vuelve a subir y la cabeza se hunde.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "../abysskit/lib";
import { FONT } from "../abysskit/kit";
import { O, SV, mix, rnd } from "../abysskit/ocean";

const k01 = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / Math.max(0.001, b - a)));
const sm = (t: number, a: number, b: number) => { const k = k01(t, a, b); return k * k * (3 - 2 * k); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const TX: React.CSSProperties = { position: "absolute", fontFamily: FONT, fontWeight: 900, color: O.ink, textShadow: "0 4px 22px rgba(0,0,0,.75)" };
const BX = 600, WL = 640; // centro del busto · línea de agua (en el plano de arriba)
const XR = "#7fe6ff";

// la mano en RAYOS X: silueta translúcida con borde de luz, huesos que brillan y nervios con pulsos que el frío apaga
// desde la punta de los dedos. grip 1 = cerrada · cold 0..1 = cuánto subió el frío (de la punta a la muñeca)
const XHand: React.FC<{ x: number; y: number; s: number; grip: number; cold: number; t: number }> = ({ x, y, s, grip, cold, t }) => {
  const g = Math.min(1, Math.max(0, grip));
  const bone = (k: number) => mix(XR, "#3f6a8a", Math.min(1, Math.max(0, cold * 1.7 - k)));
  const F: [number, number, number, number][] = [[-60, 64, 46, 34], [-21, 76, 54, 38], [18, 72, 50, 36], [55, 58, 40, 30]];
  const finger = (fx: number, L1: number, L2: number, L3: number, i: number) => { const a1 = g * (62 + i * 4), a2 = g * 80, a3 = g * 60;
    const off = (k: number) => cold * 1.7 > k ? 0.25 : 1; // pulso del nervio: se apaga cuando llega el frío
    const pk = ((t * 1.6 + i * 0.27) % 1);
    return <g key={i} transform={`translate(${fx},112) rotate(${a1})`}>
      <rect x={-21} y={-6} width={42} height={L1 + L2 + L3 + 16} rx={20} fill="rgba(20,60,90,.35)" stroke="rgba(127,230,255,.35)" strokeWidth={2} />
      <rect x={-8} y={0} width={16} height={L1} rx={8} fill={bone(0.75)} opacity={0.85} />
      <g transform={`translate(0,${L1 + 4}) rotate(${a2})`}>
        <rect x={-7} y={0} width={14} height={L2} rx={7} fill={bone(0.45)} opacity={0.85} />
        <g transform={`translate(0,${L2 + 4}) rotate(${a3})`}>
          <rect x={-6} y={0} width={12} height={L3} rx={6} fill={bone(0.15)} opacity={0.85} />
          {cold > 0.05 && Array.from({ length: 5 }).map((_, j) => <path key={j} d={`M${(rnd(i * 7 + j, 3) - 0.5) * 30},${L3 - rnd(i * 7 + j, 4) * 30} l8,0 m-4,-4 l0,8`} stroke="#eaf8ff" strokeWidth={2} opacity={Math.min(1, cold * 2)} />)}
        </g>
      </g>
      {/* nervio: línea fina con un pulso que viaja hacia la punta */}
      <line x1={11} y1={0} x2={11} y2={L1} stroke="#ffe7a8" strokeWidth={2} opacity={0.35 * off(0.6)} />
      <circle cx={11} cy={pk * L1} r={4} fill="#fff1c4" opacity={0.9 * off(0.6) * (1 - pk)} style={{ filter: "drop-shadow(0 0 6px #ffd27a)" }} />
    </g>; };
  return <g transform={`translate(${x},${y}) scale(${s}) rotate(-12)`}>
    <defs><filter id="xb" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" /></filter></defs>
    {/* antebrazo y palma: piel translúcida */}
    <path d="M-86,-40 L-160,-440 L50,-460 L86,-40 Q100,40 88,120 L-84,120 Q-100,40 -86,-40 Z" fill="rgba(16,48,72,.55)" stroke="rgba(127,230,255,.45)" strokeWidth={3} />
    {/* radio y cúbito, carpo, metacarpos: el brillo de fondo (bloom) y el hueso nítido arriba */}
    <g filter="url(#xb)" opacity={0.55}><path d="M-110,-430 L-40,-60 M10,-450 L40,-60" stroke={bone(1)} strokeWidth={26} /></g>
    <path d="M-110,-430 L-40,-60 M10,-450 L40,-60" stroke={bone(1)} strokeWidth={14} strokeLinecap="round" opacity={0.9} />
    {[[-40, -40], [-10, -46], [20, -42], [-30, -12], [0, -16], [30, -12]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={13} ry={11} fill={bone(0.95)} opacity={0.85} />)}
    {F.map(([fx], i) => <rect key={i} x={fx - 7} y={4} width={14} height={104} rx={7} fill={bone(0.9)} opacity={0.85} transform={`rotate(${(fx) * 0.08},${fx},4)`} />)}
    {F.map(([fx, L1, L2, L3], i) => finger(fx, L1, L2, L3, i))}
    {/* pulgar */}
    <g transform={`translate(-82,0) rotate(${42 + g * 48})`}>
      <rect x={-20} y={-6} width={40} height={120} rx={19} fill="rgba(20,60,90,.35)" stroke="rgba(127,230,255,.35)" strokeWidth={2} />
      <rect x={-8} y={0} width={16} height={62} rx={8} fill={bone(0.5)} opacity={0.85} />
      <g transform={`translate(0,64) rotate(${g * 40})`}><rect x={-7} y={0} width={14} height={44} rx={7} fill={bone(0.2)} opacity={0.85} /></g>
    </g>
  </g>;
};

export const Body: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame(), t = t0 + f / FPS;
  // mitos
  const m1 = sm(t, 72.9, 73.8) * (1 - sm(t, 79.4, 80.0)), m2 = sm(t, 76.3, 77.2) * (1 - sm(t, 79.4, 80.0)), strike = sm(t, 79.5, 80.2);
  const sink = sm(t, 73.2, 76.2) * (1 - sm(t, 79.4, 80.4)) * 260, frost = m2;
  // regla 1·10·1
  const rule = sm(t, 85.6, 86.3), act = t < 87.9 ? -1 : t < 120 ? 0 : 1;
  // "1": frío, boqueada, ola, reloj, corazón
  const cold = sm(t, 89.8, 93.0) * 0.5 + sm(t, 121, 137) * 0.5;
  const gasp = t < 91.1 ? 0 : t < 94.4 ? sm(t, 91.2, 92.0) : 0.5 + 0.5 * Math.abs(Math.sin((t - 94.4) * (2.2 + (t - 94.4) * 0.4)));
  const breaths = Math.round(lerp(14, 60, sm(t, 94.4, 99.5)));
  const wave = sm(t, 101.0, 101.7) * (1 - sm(t, 103.2, 104.2)), sea = sm(t, 101.5, 104.4) * (1 - sm(t, 113.6, 114.4));
  const clock = sm(t, 106.0, 106.8) * (1 - sm(t, 113.8, 114.4)), sweep = sm(t, 106.4, 113.4);
  const heartOn = sm(t, 114.2, 114.9) * (1 - sm(t, 119.8, 120.3)), bpm = lerp(72, 165, sm(t, 114.4, 117.4));
  const beat = Math.max(0, Math.sin(t * (bpm / 60) * Math.PI * 2)) ** 6;
  // "10": la cámara baja a la mano (y=1080..2160) y vuelve a subir
  const pan = sm(t, 120.4, 122.4) * (1 - sm(t, 137.6, 139.0)), dip = sm(t, 138.8, 140.8);
  const up = sm(t, 124.8, 131.0), grip = t < 128.3 ? 0.5 + 0.5 * Math.abs(Math.sin(t * 2.4)) : (1 - sm(t, 128.3, 130.2)) * (0.5 + 0.5 * Math.abs(Math.sin(t * 2.4))) * 0.9 + 0.06;
  const heavy = sm(t, 130.0, 131.4), list = (i: number) => sm(t, 132.0 + i * 1.9, 132.7 + i * 1.9);
      const headY = 420 + sink + dip * 330, water = WL - wave * 330;
  const ECG = Array.from({ length: 60 }).map((_, i) => { const x = i * 10, ph = ((i * 10 + t * 260 * (bpm / 72)) % 160); const y = ph > 60 && ph < 70 ? -70 : ph > 70 && ph < 80 ? 50 : ph > 50 && ph < 60 ? 10 : 0; return `${i ? "L" : "M"}${x},${y}`; }).join(" ");
  return (
    <AbsoluteFill style={{ background: "#041624", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateY(${-1080 * pan}px)` }}>
        {/* ======= plano de arriba: busto en silueta a ras del agua, noche ======= */}
        <AbsoluteFill style={{ background: `linear-gradient(180deg, #0b1724 0%, #1d3346 ${(water / 1080) * 100 - 18}%, #3a5468 ${(water / 1080) * 100}%, #0a3550 ${(water / 1080) * 100 + 0.1}%, #020c16 100%)` }} />
        {/* contraluz: el halo frío detrás de la cabeza */}
        <div style={{ position: "absolute", left: BX - 420, top: headY - 420, width: 840, height: 640, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(150,190,220,.30) 0%, rgba(80,120,160,.10) 45%, transparent 70%)" }} />
        <SV>
          <defs>
            <radialGradient id="xr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={XR} stopOpacity={0.35} /><stop offset="100%" stopColor={XR} stopOpacity={0.05} /></radialGradient>
            <linearGradient id="seaF" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0c4664" stopOpacity={0.62} /><stop offset="100%" stopColor="#010a12" stopOpacity={0.9} /></linearGradient>
            <radialGradient id="hs" cx="0.5" cy="0.3" r="0.8"><stop offset="0" stopColor="#1a2632" /><stop offset="1" stopColor="#05090e" /></radialGradient>
            <linearGradient id="ts" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a3a12" /><stop offset="0.4" stopColor="#2a1408" /><stop offset="1" stopColor="#05080c" /></linearGradient>
            <filter id="xg" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" /></filter>
          </defs>
          {/* rayos de luz bajo el agua */}
          {Array.from({ length: 7 }).map((_, i) => { const x0 = 120 + i * 270 + Math.sin(t * 0.4 + i) * 40;
            return <path key={i} d={`M${x0},${water} L${x0 + 60},${water} L${x0 + 260},1100 L${x0 + 80},1100 Z`} fill="#6fb8d8" opacity={0.05 + 0.04 * Math.sin(t * 0.8 + i * 1.3)} />; })}
          <g transform={`translate(0,${sink + dip * 330})`}>
            {/* torso con el chaleco en sombra, brazos abiertos */}
            <path d={`M${BX - 330},1100 L${BX - 300},770 Q${BX - 260},660 ${BX - 90},640 L${BX + 90},640 Q${BX + 260},660 ${BX + 300},770 L${BX + 330},1100 Z`} fill="url(#ts)" />
            <path d={`M${BX - 300},770 Q${BX - 260},660 ${BX - 90},640 L${BX + 90},640 Q${BX + 260},660 ${BX + 300},770`} stroke="#c9ddea" strokeWidth={4} fill="none" opacity={0.45} />
            <path d={`M${BX - 300},770 Q${BX - 300},860 ${BX - 360},960`} stroke="#0a121a" strokeWidth={90} strokeLinecap="round" fill="none" transform={`rotate(${heavy * 8},${BX - 300},770)`} />
            <path d={`M${BX + 300},770 Q${BX + 300},860 ${BX + 360},960`} stroke="#0a121a" strokeWidth={90} strokeLinecap="round" fill="none" transform={`rotate(${-heavy * 8},${BX + 300},770)`} />
            <rect x={BX - 48} y={560} width={96} height={100} fill="#080d13" />
          </g>
          {/* el mar por delante del cuerpo */}
          <path d={`M-40,1100 L-40,${water} ${Array.from({ length: 42 }).map((_, i) => `L${i * 50},${water + Math.sin(i * 0.5 + t * 2.3) * (9 + wave * 34)}`).join(" ")} L2040,${water} L2040,1100 Z`} fill="url(#seaF)" />
          {/* RAYOS X: pulmones y corazón brillan a través del agua */}
          <g transform={`translate(0,${sink + dip * 330})`} opacity={0.35 + 0.65 * sm(t, 88.0, 89.4) - 0.2 * m1}>
            {/* columna y costillas */}
            {Array.from({ length: 9 }).map((_, i) => <rect key={"v" + i} x={BX - 13} y={700 + i * 38} width={26} height={28} rx={8} fill="none" stroke={XR} strokeWidth={3} opacity={0.45} />)}
            {Array.from({ length: 7 }).map((_, i) => [-1, 1].map((sd) => <path key={"r" + i + sd} d={`M${BX + sd * 14},${712 + i * 40} Q${BX + sd * (150 + i * 6)},${690 + i * 40} ${BX + sd * (200 - i * 4)},${770 + i * 46}`} stroke={XR} strokeWidth={4} fill="none" opacity={0.35} />))}
            <path d={`M${BX - 190},700 Q${BX - 90},680 ${BX - 14},700 M${BX + 190},700 Q${BX + 90},680 ${BX + 14},700`} stroke={XR} strokeWidth={6} fill="none" opacity={0.55} />
            <path d={`M${BX},600 L${BX},700 M${BX},700 Q${BX - 30},720 ${BX - 60},760 M${BX},700 Q${BX + 30},720 ${BX + 60},760`} stroke={XR} strokeWidth={5} fill="none" opacity={0.8} />
            {[-1, 1].map((sd) => { const sx = 1 + 0.32 * gasp, cx = BX + sd * 92, cy = 860;
              const d = `M${cx - sd * 30},730 Q${cx + sd * 90},720 ${cx + sd * 92},860 Q${cx + sd * 80},1000 ${cx},1010 Q${cx - sd * 50},1000 ${cx - sd * 42},880 Z`;
              return <g key={sd} transform={`translate(${cx},${cy}) scale(${sx}) translate(${-cx},${-cy})`}>
                <clipPath id={`lg${sd}`}><path d={d} /></clipPath>
                <path d={d} fill="none" stroke={XR} strokeWidth={14} opacity={0.4} filter="url(#xg)" />
                <path d={d} fill="url(#xr)" stroke={XR} strokeWidth={4} />
                <rect x={cx - 140} y={1010 - 300 * sea} width={280} height={300} fill="#2f8fd0" opacity={0.85} clipPath={`url(#lg${sd})`} />
                {[0, 1, 2].map((b) => <path key={b} d={`M${cx - sd * 30},${770 + b * 6} q${sd * (40 + b * 10)},${60 + b * 40} ${sd * (20 + b * 20)},${150 + b * 30}`} stroke={XR} strokeWidth={2} fill="none" opacity={0.5} />)}
              </g>; })}
            <g transform={`translate(${BX + 30},${880}) scale(${1 + 0.3 * beat * heartOn + 0.06 * beat})`}>
              <path d="M0,-20 c-30,-36 -84,-8 -60,32 l60,58 l60,-58 c24,-40 -30,-68 -60,-32 Z" fill={O.red} opacity={0.55 + 0.45 * heartOn} style={{ filter: `drop-shadow(0 0 ${10 + 20 * heartOn * beat}px #ff3b30)` }} />
            </g>
          </g>
          {/* cabeza en SILUETA (sin rasgos): borde de luz frío, pelo mojado; la boqueada se ve en el vapor */}
          <g transform={`translate(0,${headY - 420})`}>
            <ellipse cx={BX - 104} cy={430} rx={20} ry={34} fill="#070b10" /><ellipse cx={BX + 104} cy={430} rx={20} ry={34} fill="#070b10" />
            <ellipse cx={BX} cy={420} rx={106} ry={132} fill="url(#hs)" />
            <path d={`M${BX - 100},360 Q${BX - 92},282 ${BX},280 Q${BX + 92},282 ${BX + 100},360`} stroke={mix("#b9d0e2", "#e6f6ff", cold)} strokeWidth={6} fill="none" opacity={0.8} strokeLinecap="round" />
            <path d={`M${BX - 106},400 Q${BX - 108},470 ${BX - 70},530 M${BX + 106},400 Q${BX + 108},470 ${BX + 70},530`} stroke={mix("#7f9ab2", "#cfe8f8", cold)} strokeWidth={4} fill="none" opacity={0.55} strokeLinecap="round" />
            {[-60, -26, 8, 40, 70].map((hx, i) => <path key={i} d={`M${BX + hx},290 Q${BX + hx - 10},330 ${BX + hx - 4},360`} stroke="#2a3a4c" strokeWidth={4} fill="none" opacity={0.8} />)}
            {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={BX - 70 + i * 34} cy={360 + ((t * 60 + i * 37) % 160)} r={3.5} fill="#cfe6f4" opacity={0.6} />)}
            {/* vapor de la respiración: más rápido y más grande con la boqueada */}
            {gasp > 0.05 && t < 101 && Array.from({ length: 5 }).map((_, i) => { const k = ((t * (0.8 + gasp * 1.4) + i / 5) % 1);
              return <ellipse key={i} cx={BX + 20 + 160 * k} cy={520 - 60 * k} rx={30 + 90 * k * gasp} ry={18 + 40 * k * gasp} fill="#dfeef8" opacity={0.28 * (1 - k) * gasp} style={{ filter: "blur(8px)" }} />; })}
          </g>
          {/* escarcha del mito 2 */}
          {frost > 0 && Array.from({ length: 46 }).map((_, i) => <path key={i} d={`M${BX + (rnd(i, 3) - 0.5) * 460},${300 + rnd(i, 4) * 520 + sink} l14,0 m-7,-7 l0,14 m-5,-5 l10,10 m0,-10 l-10,10`} stroke="#eaf8ff" strokeWidth={3} opacity={frost * 0.85} />)}
        </SV>
        {/* ======= plano de abajo (la cámara baja por el brazo): la mano ======= */}
        <div style={{ position: "absolute", left: 0, top: 1080, width: 1920, height: 1080, background: "linear-gradient(180deg, #06263c 0%, #02101b 100%)" }}>
          <SV>
            {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={rnd(i, 71) * 1920} cy={(rnd(i, 72) * 1080 - t * 18 * (0.5 + rnd(i, 73))) % 1080 + (rnd(i, 72) * 1080 - t * 18 * (0.5 + rnd(i, 73)) < 0 ? 1080 : 0)} r={2 + rnd(i, 74) * 3} fill="#9fd3e6" opacity={0.35} />)}
            {/* la soga: pasa al lado de la mano y se va */}
            {Array.from({ length: 6 }).map((_, i) => { const x0 = 200 + i * 320 + Math.sin(t * 0.3 + i) * 50;
              return <path key={"g" + i} d={`M${x0},0 L${x0 + 70},0 L${x0 + 300},1080 L${x0 + 110},1080 Z`} fill="#6fb8d8" opacity={0.045 + 0.03 * Math.sin(t * 0.7 + i)} />; })}
            <g opacity={sm(t, 131.6, 132.4)} transform={`translate(${sm(t, 133.2, 136.0) * 420},${-sm(t, 133.2, 136.0) * 160})`}>
              <path d="M1180,-40 Q1060,420 1120,1120" stroke="#2a2014" strokeWidth={40} fill="none" />
              <path d="M1180,-40 Q1060,420 1120,1120" stroke="#8d7046" strokeWidth={32} fill="none" />
              <path d="M1180,-40 Q1060,420 1120,1120" stroke="#3a2c18" strokeWidth={32} strokeDasharray="6 16" fill="none" />
              <path d="M1170,-40 Q1050,420 1110,1120" stroke="#d8c08c" strokeWidth={4} fill="none" opacity={0.5} />
            </g>
            <XHand x={820 - heavy * 40} y={560 + heavy * 120} s={1.55} grip={grip} cold={up} t={t} />
          </SV>
        </div>
      </AbsoluteFill>

      {/* ---------- panel de la derecha (fuera de la cámara) ---------- */}
      {[["slowly getting tired and sinking", m1, 330], ["freezing like the movies", m2, 420]].map(([s0, k, y]) => <div key={s0 as string} style={{ ...TX, right: 230, top: y as number, textAlign: "right", fontSize: 52, opacity: k as number }}>
        <span style={{ position: "relative" }}>{s0 as string}<span style={{ position: "absolute", left: 0, top: "52%", height: 7, width: `${strike * 100}%`, background: O.red }} /></span>
        <span style={{ color: O.red, fontSize: 38, border: `4px solid ${O.red}`, padding: "0 12px", borderRadius: 8, marginLeft: 16 }}>MYTH</span></div>)}
      {rule > 0 && <div style={{ position: "absolute", right: 230, top: 300, display: "flex", gap: 46, opacity: rule, fontFamily: FONT, fontWeight: 900, transform: `scale(${lerp(1.5, 1, sm(t, 85.6, 86.6))})`, transformOrigin: "right top" }}>
        {[["1", "minute"], ["10", "minutes"], ["1", "hour"]].map(([n, u], i) => <div key={i} style={{ textAlign: "center", color: act === i ? XR : act >= 0 ? "rgba(244,239,230,.3)" : O.ink, textShadow: "0 6px 30px rgba(0,0,0,.7)" }}>
          <div style={{ fontSize: 130, lineHeight: 1 }}>{n}</div><div style={{ fontSize: 30, letterSpacing: 3 }}>{u}</div></div>)}
      </div>}
      <div style={{ ...TX, right: 230, top: 520, textAlign: "right", fontSize: 72, color: XR, opacity: sm(t, 90.0, 90.8) * (1 - sm(t, 94.2, 94.6)) }}>COLD SHOCK</div>
      <div style={{ ...TX, right: 230, top: 520, textAlign: "right", opacity: sm(t, 94.6, 95.4) * (1 - sm(t, 100.6, 101.0)) }}>
        <div style={{ fontSize: 30, color: O.dim, letterSpacing: 4 }}>BREATHS / MIN</div><div style={{ fontSize: 150, lineHeight: 1, color: breaths > 40 ? O.red : O.ink }}>{breaths}</div>
        <div style={{ fontSize: 38, color: O.dim }}>and you can't stop it</div></div>
      <div style={{ ...TX, right: 230, top: 560, textAlign: "right", fontSize: 72, color: "#7fd0ff", opacity: sea * (1 - clock) }}>you inhale<br />the sea</div>
      {clock > 0 && <svg width={380} height={420} viewBox="-190 -190 380 420" style={{ position: "absolute", right: 250, top: 470, opacity: clock }}>
        <circle r={170} fill="rgba(1,5,11,.6)" stroke={O.ink} strokeWidth={8} />
        <path d={`M0,0 L0,-160 A160,160 0 ${sweep > 0.5 ? 1 : 0} 1 ${160 * Math.sin(Math.max(0.001, sweep) * 2 * Math.PI)},${-160 * Math.cos(Math.max(0.001, sweep) * 2 * Math.PI)} Z`} fill={O.red} opacity={0.75} />
        <line x1={0} y1={0} x2={160 * Math.sin(sweep * 2 * Math.PI)} y2={-160 * Math.cos(sweep * 2 * Math.PI)} stroke={O.ink} strokeWidth={8} strokeLinecap="round" />
        <text y={225} textAnchor="middle" fill={O.ink} fontFamily={FONT} fontWeight={900} fontSize={38}>the first minute</text>
      </svg>}
      <div style={{ ...TX, right: 230, top: 920, textAlign: "right", fontSize: 38, color: O.gold, opacity: sm(t, 108.4, 109.2) * clock }}>a large share of cold-water deaths</div>
      <div style={{ ...TX, right: 230, top: 500, textAlign: "right", opacity: heartOn }}>
        <div style={{ fontSize: 30, color: O.dim, letterSpacing: 4 }}>HEART RATE</div>
        <div style={{ fontSize: 150, lineHeight: 1, color: bpm > 130 ? O.red : O.ink }}>{Math.round(bpm)}</div>
        <svg width={600} height={160} viewBox="0 -90 600 160" style={{ display: "block", marginLeft: "auto" }}><path d={ECG} stroke={O.red} strokeWidth={5} fill="none" /></svg>
        <div style={{ fontSize: 40, color: O.orange, opacity: sm(t, 115.4, 116.0) }}>blood pressure ↑↑</div>
        <div style={{ fontSize: 44, color: O.ink, marginTop: 14, opacity: sm(t, 117.6, 118.3) }}>for some, that's enough</div></div>
      <div style={{ ...TX, right: 230, top: 500, textAlign: "right", fontSize: 50, color: XR, opacity: sm(t, 125.4, 126.2) * pan * (1 - sm(t, 128.0, 128.4)) }}>cold steals the heat<br />from muscles and nerves</div>
      <div style={{ ...TX, right: 230, top: 520, textAlign: "right", fontSize: 64, color: XR, opacity: sm(t, 128.4, 129.0) * (1 - sm(t, 131.6, 132.0)) }}>fingers stop closing{heavy > 0 && <><br /><span style={{ opacity: heavy }}>arms get heavy</span></>}</div>
      {[["grab a rope", 0], ["climb a ladder", 1], ["hold your head up", 2]].map(([s0, i]) => <div key={s0 as string} style={{ ...TX, right: 230, top: 470 + (i as number) * 92, textAlign: "right", fontSize: 58, opacity: list(i as number) * (1 - dip) }}>
        {s0 as string} <span style={{ color: O.red }}>✕</span></div>)}
      <div style={{ ...TX, left: 0, right: 0, top: 880, textAlign: "center", fontSize: 56, opacity: dip }}>they survived the gasp · <span style={{ color: O.red }}>and still drown</span></div>
      <div style={{ ...TX, right: 220, bottom: 100, textAlign: "right", opacity: sm(t, 88.2, 89.0) * (1 - dip) }}>
        <div style={{ fontSize: 26, color: O.dim, letterSpacing: 4 }}>IN THE WATER</div>
        <div style={{ fontSize: 76, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{(() => { const s = t < 120 ? (t - 87.9) * 1.9 : 60 + (t - 120) * 26; return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`; })()}</div>
      </div>
    </AbsoluteFill>
  );
};
