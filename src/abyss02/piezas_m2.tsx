// abyss02 · MINUTO 2 (68,7–153,7 s): sigue el MISMO mundo, una sola cámara, todo colgado del segundo GLOBAL t.
// el fondo a 10.800 m (se encienden los focos y el piso se mueve) → la cámara sube y se ve el PERFIL del planeta
// (Challenger #1, Horizon #2) → las cinco reglas cruzan la fosa y se rompen → el mar desde arriba (Tonga, 2.000 km)
// → el agua se abre en una cicatriz de 1.400 km → el mapa se inclina y debajo la placa del Pacífico se hunde → 24 cm/año vs tus uñas.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { FPS } from "../abysskit/lib";
import { FONT } from "../abysskit/kit";
import { MAPS } from "../abysskit/maps";
import { O, SV, mix, rnd } from "../abysskit/ocean";

const k01 = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / Math.max(0.001, b - a)));
const sm = (t: number, a: number, b: number) => { const k = k01(t, a, b); return k * k * (3 - 2 * k); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const TX: React.CSSProperties = { position: "absolute", fontFamily: FONT, fontWeight: 900, color: O.ink, textShadow: "0 4px 22px rgba(0,0,0,.75)" };

// anfípodo propio de este minuto: caparazón segmentado translúcido, patas que reman, antenas; brilla con el foco
const Hopper: React.FC<{ x: number; y: number; s: number; t: number; ph: number; lit: number; flip?: boolean }> = ({ x, y, s, t, ph, lit, flip }) => {
  const w = Math.sin(t * 14 + ph) * 8;
  return <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} opacity={0.08 + 0.8 * lit} style={{ filter: `drop-shadow(0 0 ${6 * lit}px rgba(255,230,190,.8))` }}>
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={"l" + i} d={`M${-30 + i * 12},6 l${-6 + (i % 2 ? w : -w) * 0.6},16`} stroke="#d9c3a2" strokeWidth={3} strokeLinecap="round" />)}
    <path d="M-44,0 Q-40,-22 -10,-24 Q30,-26 44,-8 Q48,4 36,8 L-36,10 Q-46,8 -44,0 Z" fill={mix("#3a3128", "#efd9bd", lit)} fillOpacity={0.82} />
    {[0, 1, 2, 3, 4].map((i) => <path key={"s" + i} d={`M${-28 + i * 14},-22 q4,14 0,30`} stroke="#5a4a3a" strokeWidth={2} fill="none" opacity={0.6} />)}
    <circle cx={38} cy={-8} r={4} fill="#1a1010" />
    <path d={`M44,-12 q20,${-14 + w} 36,-8 M42,-8 q22,${-4 - w} 34,4`} stroke="#d9c3a2" strokeWidth={2.4} fill="none" />
    <path d={`M-44,0 q-14,-4 -20,${6 + w * 0.5}`} stroke="#d9c3a2" strokeWidth={3} fill="none" />
  </g>;
};

// el lander visto desde adentro: dos focos en primer plano arriba, puntales oscuros con borde de luz
const Lamps: React.FC<{ on: number; t: number }> = ({ on, t }) => <g>
  {[[140, -1], [1780, 1]].map(([x, d]) => <g key={x} transform={`translate(${x},-6) rotate(${d * -22}) scale(0.7)`}>
    <path d={`M${d * -260},-120 L${d * -40},-10`} stroke="#0b0f14" strokeWidth={34} strokeLinecap="round" />
    <path d={`M${d * -260},-134 L${d * -40},-24`} stroke="#6f8aa0" strokeWidth={3} opacity={0.5} />
    <rect x={-70} y={-46} width={140} height={84} rx={18} fill="#10151b" stroke="#55697a" strokeWidth={3} />
    <ellipse cx={0} cy={36} rx={56} ry={14} fill={on > 0 ? "#fffbea" : "#1b2229"} opacity={0.3 + 0.7 * on} />
    <ellipse cx={0} cy={36} rx={90} ry={30} fill="#fff3cf" opacity={0.45 * on} style={{ filter: "blur(16px)" }} />
  </g>)}
  <circle cx={960} cy={22} r={7} fill="#ff4a3a" opacity={0.4 + 0.5 * Math.sin(t * 5)} />
</g>;

// la esfera con sus focos (vista lateral, más chica que en el minuto 1: ya llegamos)
const Pod: React.FC<{ x: number; y: number; on: number; t: number }> = ({ x, y, on, t }) => <g transform={`translate(${x},${y})`}>
  <path d="M-60,-250 L-60,-120 M60,-250 L60,-120" stroke="#3b4652" strokeWidth={6} />
  <circle r={120} fill="#9aa6b2" /><circle r={120} fill="url(#podsh)" />
  <circle cx={-30} cy={30} r={34} fill={on > 0.5 ? "#ffd27a" : "#2a3440"} stroke="#3b4652" strokeWidth={10} />
  {[-80, 80].map((dx) => <g key={dx} transform={`translate(${dx},${96})`}><rect x={-26} y={-14} width={52} height={28} rx={6} fill="#2b3540" />
    <circle cy={14} r={12} fill={on > 0 ? "#fff8e0" : "#444"} opacity={0.4 + 0.6 * on} /></g>)}
  <circle cx={0} cy={-128} r={8} fill="#ff4a3a" opacity={0.5 + 0.5 * Math.sin(t * 5)} />
</g>;

// perfil del océano Pacífico de oeste a este con las dos fosas (escala real de profundidad: 10.935 m → y 925)
const DEP = (m: number) => 150 + m * 0.062;
const profile = (shift: number) => {
  const pts: [number, number][] = [[-100, 2400], [200, 4200], [430, 5800], [520, 9600], [560, 10935], [610, 8200], [760, 5200], [1080, 4800], [1240, 5600], [1330, 9200], [1380, 10800], [1430, 7600], [1560, 3000], [1700, 1400], [2020, 3000]];
  const out: string[] = [];
  pts.forEach(([x, d], i) => { if (i === 0) { out.push(`L${x + shift},${DEP(d)}`); return; }
    const [x0, d0] = pts[i - 1];
    for (let k = 1; k <= 8; k++) { const u = k / 8, j = k < 8 ? (rnd(i * 13 + k, 61) - 0.5) * 22 : 0;
      out.push(`L${(x0 + (x - x0) * u + shift).toFixed(1)},${(DEP(d0 + (d - d0) * u) + j).toFixed(1)}`); } });
  return "M-100,1100 " + out.join(" ") + " L2020,1100 Z";
};

const ROCKF = <defs>
  <filter id="rock2" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.03 0.07" numOctaves={4} seed={3} result="n" />
          <feDiffuseLighting in="n" lightingColor="#e6d6c2" surfaceScale={6} result="l"><feDistantLight azimuth={235} elevation={48} /></feDiffuseLighting>
          <feComposite in="l" in2="SourceGraphic" operator="in" result="c" /><feBlend in="SourceGraphic" in2="c" mode="multiply" /></filter>
</defs>;

const RULES = ["PRESSURE", "FOOD", "SHELL", "SIZE", "CLEAN"];

export const Plunge: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame(), t = t0 + f / FPS;
  // ---------- fase A: el piso ----------
  const flick = t < 72.2 ? 0 : t < 72.9 ? (Math.sin(t * 90) > 0 ? 1 : 0.2) : 1;
  const move = sm(t, 74.5, 75.6);
  const pullB = sm(t, 78.9, 81.4); // la cámara sube: del piso al perfil
  const zA = lerp(1, 0.035, pullB);
  // ---------- fase B: el perfil ----------
  const lives = sm(t, 85.1, 86.4), rules = sm(t, 88.2, 89.4), brk = (i: number) => sm(t, 93.4 + i * 1.4, 94.0 + i * 1.4);
  const toMap = sm(t, 101.0, 106.4);
  const zl = sm(t, 85.1, 86.4) * (1 - sm(t, 87.2, 88.1)); // sube más: el mar visto desde arriba
  // ---------- fase C: el mapa ----------
  const m = MAPS.swpac, W = 1920, H = W / m.ar, X = 0, Y = (1080 - H) / 2;
  const P = (k: string): [number, number] => [X + m.pts[k][0] * W, Y + m.pts[k][1] * H];
  const pins = sm(t, 109.6, 110.6), nz = sm(t, 111.0, 112.0), dist = sm(t, 112.4, 114.2);
  const empty = sm(t, 115.1, 116.0) * (1 - sm(t, 117.6, 118.4));
  const tear = sm(t, 118.0, 122.4), tilt = sm(t, 124.4, 127.0);
  const fast = sm(t, 134.8, 135.8), nails = sm(t, 143.4, 144.4), six = sm(t, 146.3, 147.0);
  const [hx, hy] = P("horizon");
  const slab = (t - 124) * (40 + 120 * fast); // la placa avanza: más rápido desde "24 cm"
  const scar = ["tonga_n", "horizon", "tonga_s", "kerm_s"].map(P);
  const scarD = scar.map(([x, y], i) => `${i ? "L" : "M"}${x + (i % 2 ? 1 : -1) * 6 * Math.sin(t * 9 + i)},${y}`).join(" ");
  const scarLen = 1 - tear;
  return (
    <AbsoluteFill style={{ background: "#01050b", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><defs>
        <radialGradient id="podsh" cx="35%" cy="30%" r="70%"><stop offset="0%" stopColor="#ffffff" stopOpacity={0.55} /><stop offset="60%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.55} /></radialGradient>
        <linearGradient id="cone2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff4d0" stopOpacity={0.55} /><stop offset="100%" stopColor="#fff4d0" stopOpacity={0} /></linearGradient>
        <linearGradient id="rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5b4a3a" /><stop offset="100%" stopColor="#0b0806" /></linearGradient>

      </defs></svg>

      {/* ---------- A · el piso a 10.800 m (se achica hasta ser un punto en el fondo de la fosa del perfil) ---------- */}
      {pullB < 1 && toMap === 0 && <AbsoluteFill style={{ transform: `scale(${zA})`, transformOrigin: `1380px ${DEP(10800)}px`, opacity: 1 - sm(t, 80.6, 81.4) }}>
        <AbsoluteFill style={{ background: "#010409" }} />
        <AbsoluteFill style={{ opacity: 0.06 + 0.94 * flick }}>
          <OffthreadVideo src={staticFile("abyss02/real/naut_cex094.mp4")} muted playbackRate={0.45} startFrom={Math.max(0, Math.round((t0 - 68.7) * FPS * 0.45))} style={{ width: 1920, height: 1080, objectFit: "cover", filter: "brightness(0.85) contrast(1.15) saturate(0.85)" }} />
        </AbsoluteFill>
        {/* el agua negra se come los bordes: sólo lo que tocan los focos */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 62% at 50% 72%, rgba(1,4,9,0) 35%, rgba(1,4,9,.75) 72%, rgba(1,4,9,.96) 100%)" }} />
        {flick > 0 && <AbsoluteFill style={{ mixBlendMode: "screen", opacity: flick }}>
          <AbsoluteFill style={{ clipPath: "polygon(5% 0%, 10% 0%, 58% 100%, 0% 100%)", background: "linear-gradient(180deg, rgba(255,244,208,.16), rgba(255,244,208,0) 85%)", filter: "blur(18px)" }} />
          <AbsoluteFill style={{ clipPath: "polygon(90% 0%, 95% 0%, 100% 100%, 42% 100%)", background: "linear-gradient(180deg, rgba(255,244,208,.16), rgba(255,244,208,0) 85%)", filter: "blur(18px)" }} />
        </AbsoluteFill>}
        {/* nieve marina real cruzando los haces */}
        <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.12 + 0.5 * flick }}>
          <OffthreadVideo src={staticFile("abyss02/real/snow_32048613.mp4")} muted playbackRate={0.5} startFrom={Math.max(0, Math.round((t0 - 68.7) * FPS * 0.5))} style={{ width: 1920, height: 1080, objectFit: "cover", filter: "grayscale(1) contrast(1.4) brightness(0.9)" }} />
        </AbsoluteFill>
        <SV>
          {/* el piso que se mueve: cientos de anfípodos, sólo se ven con luz */}
          {Array.from({ length: 110 }).map((_, i) => { const r0 = rnd(i, 21), yy = 790 + rnd(i, 22) * 300, sp = (0.3 + rnd(i, 23)) * 60 * move;
            const xx = ((r0 * 2200 + (t - 74.5) * sp * (rnd(i, 24) < 0.5 ? 1 : -1)) % 2200 + 2200) % 2200 - 140;
            const inCone = Math.max(0, 1 - Math.abs(xx - 960) / (300 + (yy - 420) * 0.55));
            return <Hopper key={i} x={xx} y={yy} s={0.6 + rnd(i, 25) * 0.5 + (yy - 790) / 500} t={t} ph={i} lit={flick * inCone} flip={rnd(i, 24) < 0.5} />; })}
          <Lamps on={flick} t={t} />
        </SV>
        <div style={{ ...TX, left: 0, right: 0, top: 600, textAlign: "center", fontSize: 150, letterSpacing: 10, opacity: sm(t, 76.2, 77.0) }}>HORIZON DEEP</div>
        <div style={{ ...TX, left: 0, right: 0, top: 770, textAlign: "center", fontSize: 46, color: O.gold, opacity: sm(t, 76.8, 77.6) }}>10,800 m · bottom of the Tonga Trench</div>
        <div style={{ ...TX, right: 230, top: 420, textAlign: "right", fontSize: 60, color: "#ffe9b0", opacity: move * (1 - sm(t, 76.0, 76.4)) }}>the floor is <span style={{ color: O.red }}>alive</span></div>
      </AbsoluteFill>}

      {/* ---------- B · el perfil del planeta ---------- */}
      {pullB > 0 && toMap < 1 && <AbsoluteFill style={{ opacity: sm(t, 80.4, 81.4) * (1 - sm(t, 105.4, 106.6)), transform: `scale(${lerp(1, 0.6, toMap) * (1 + 2.2 * zl)}) translateY(${-260 * toMap}px)`, transformOrigin: zl > 0 ? `1380px ${DEP(10800) - 30}px` : "960px 150px" }}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #1b2a3a 0%, #4d5f70 8%, #c98a5a 12.6%, #e8b07a 13.8%, #1a5f80 13.9%, #0a2a44 40%, #01060c 100%)" }} />
        <AbsoluteFill style={{ top: 150, mixBlendMode: "screen", opacity: 0.22 }}>
          <OffthreadVideo src={staticFile("abyss02/real/snow_5191074.mp4")} muted playbackRate={0.4} startFrom={Math.max(0, Math.round((t0 - 79) * FPS * 0.4))} style={{ width: 1920, height: 930, objectFit: "cover", filter: "grayscale(1) contrast(1.3)" }} />
        </AbsoluteFill>
        <SV>
          {ROCKF}
          <path d={profile(0)} fill="#2e2219" filter="url(#rock2)" />
          <path d={profile(0)} fill="url(#rock)" opacity={0.25} />
          <path d={profile(0)} fill="none" stroke="#9fc7da" strokeWidth={3} opacity={0.4} />
          <line x1={0} x2={1920} y1={150} y2={150} stroke="#ffe6c0" strokeWidth={2} opacity={0.7} />
          {/* regla de profundidad a la izquierda */}
          {[0, 2000, 4000, 6000, 8000, 10000].map((dd) => <g key={dd}><line x1={60} x2={110} y1={DEP(dd)} y2={DEP(dd)} stroke={O.dim} strokeWidth={3} /><text x={120} y={DEP(dd) + 10} fill={O.dim} fontFamily={FONT} fontWeight={800} fontSize={28}>{dd.toLocaleString("en")} m</text></g>)}
          {/* el bicho vive: el fondo de Horizon se llena de puntos de vida que se multiplican */}
          {Array.from({ length: 90 }).map((_, i) => { const on = sm(t, 85.4 + rnd(i, 41) * 2.6, 85.8 + rnd(i, 41) * 2.6);
            return <circle key={i} cx={1380 + (rnd(i, 42) - 0.5) * 46} cy={DEP(10800) - 4 - rnd(i, 43) * 36} r={2.6 + rnd(i, 44) * 2} fill="#ffe2a6" opacity={on * lives * (1 - 0.6 * rules)} style={{ filter: "drop-shadow(0 0 4px #ffd27a)" }} />; })}
          {/* las cinco reglas cruzan la fosa como líneas y se rompen una por una (la última queda) */}
          {RULES.map((r, i) => { const yy = DEP(6200 + i * 1000), b = i < 4 ? brk(i) : 0, gap = 260 * b;
            return <g key={r} opacity={rules}>
              <line x1={1200} x2={1380 - gap / 2} y1={yy} y2={yy} stroke={i === 4 ? O.gold : O.red} strokeWidth={7} />
              <line x1={1380 + gap / 2} x2={1560} y1={yy + b * 30} y2={yy + b * 30} stroke={i === 4 ? O.gold : O.red} strokeWidth={7} opacity={1 - 0.6 * b} />
              <text x={1185} y={yy + 12} textAnchor="end" fill={i === 4 ? O.gold : b > 0.5 ? O.dim : O.red} fontFamily={FONT} fontWeight={900} fontSize={34} textDecoration={b > 0.5 ? "line-through" : undefined}>{r}{i === 4 ? (t > 98 ? " · ?" : "") : ""}</text>
            </g>; })}
        </SV>
        {/* podio: #1 Challenger · #2 Horizon */}
        {[["#1", "Challenger Deep", "10,935 m", 560, O.orange, 81.6], ["#2", "Horizon Deep", "10,800 m", 1380, O.red, 82.6]].map(([n, nm, dd, x, col, a]) => <div key={n as string} style={{ ...TX, left: (x as number) - 300, width: 600, top: 330, textAlign: "center", opacity: sm(t, a as number, (a as number) + 0.8) * (1 - lives) }}>
          <div style={{ fontSize: 110, lineHeight: 1, color: col as string }}>{n}</div><div style={{ fontSize: 40 }}>{nm} · {dd}</div>
          {n === "#2" && <div style={{ fontSize: 34, color: O.dim, opacity: sm(t, 83.4, 84.2) }}>almost nobody talks about this one</div>}</div>)}
        <div style={{ ...TX, left: 0, right: 0, top: 820, textAlign: "center", fontSize: 64, color: "#ffe2a6", opacity: zl }}>something lives down here</div>
        <div style={{ ...TX, right: 230, top: 300, textAlign: "right", fontSize: 58, opacity: sm(t, 93.4, 94.0) * (1 - sm(t, 100.2, 100.6)) }}>one by one · <span style={{ color: O.gold }}>the last one</span></div>
      </AbsoluteFill>}

      {/* ---------- C · el mar desde arriba → la cicatriz → la placa ---------- */}
      {toMap > 0 && <AbsoluteFill style={{ opacity: sm(t, 105.6, 106.8), perspective: 1500 }}>
        <AbsoluteFill style={{ background: "#071b2e" }} />
        <AbsoluteFill style={{ transform: `translateY(${-300 * tilt}px) rotateX(${58 * tilt}deg) scale(${lerp(lerp(1.0, 1.18, sm(t, 109, 124)), 1.4, tilt)})`, transformOrigin: `${hx}px ${hy}px` }}>
          <Img src={staticFile("abyss02/map/swpac_sat.png")} style={{ position: "absolute", left: X, top: Y, width: W, height: H }} />
          {/* "en un mapa parece agua azul vacía" */}
          <AbsoluteFill style={{ background: "#1d6b95", opacity: 0.35 * empty, mixBlendMode: "screen" }} />
          {/* el piso se abre: la cicatriz roja de 1.400 km */}
          <SV>
            <path d={scarD} fill="none" stroke="#2a0606" strokeWidth={46} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={scarLen} opacity={0.85} />
            <path d={scarD} fill="none" stroke={O.red} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={scarLen} style={{ filter: "drop-shadow(0 0 14px #ff3b30)" }} />
            {pins > 0 && <><circle cx={P("nukualofa")[0]} cy={P("nukualofa")[1]} r={12} fill={O.ink} opacity={pins} /><circle cx={P("auckland")[0]} cy={P("auckland")[1]} r={12} fill={O.orange} opacity={nz} /></>}
            <line x1={P("auckland")[0]} y1={P("auckland")[1]} x2={lerp(P("auckland")[0], P("nukualofa")[0], dist)} y2={lerp(P("auckland")[1], P("nukualofa")[1], dist)} stroke={O.ink} strokeWidth={5} strokeDasharray="16 14" opacity={dist * (1 - tear)} />
          </SV>
          <div style={{ ...TX, left: P("nukualofa")[0] + 26, top: P("nukualofa")[1] - 30, fontSize: 44, opacity: pins * (1 - tilt) }}>TONGA</div>
          <div style={{ ...TX, left: P("auckland")[0] - 330, top: P("auckland")[1] - 30, fontSize: 44, color: O.orange, opacity: nz * (1 - tilt) }}>NEW ZEALAND</div>
          <div style={{ ...TX, left: (P("auckland")[0] + P("nukualofa")[0]) / 2 + 40, top: (P("auckland")[1] + P("nukualofa")[1]) / 2 - 20, fontSize: 52, color: O.gold, opacity: dist * (1 - tear) }}>~2,000 km</div>
          <div style={{ ...TX, left: P("tonga_s")[0] + 60, top: P("tonga_s")[1] - 10, fontSize: 64, color: O.red, opacity: sm(t, 121.6, 122.4) * (1 - tilt) }}>1,400 km</div>
        </AbsoluteFill>
        {/* la cara del bloque que aparece debajo al inclinarse: la placa del Pacífico entra por la derecha y se hunde */}
        {tilt > 0 && <SV style={{ opacity: tilt }}>
          {ROCKF}
          <defs><pattern id="strata" width="120" height="40" patternUnits="userSpaceOnUse" patternTransform={`translate(${-slab % 120},0)`}><rect width="120" height="40" fill="#6b3f26" /><rect y={20} width="120" height="8" fill="#8a5434" /></pattern></defs>
          <rect x={0} y={560} width={1920} height={520} fill="#1a0f0a" filter="url(#rock2)" />
          {/* placa de arriba (Tonga) */}
          {/* placa del Pacífico: viene de la derecha y se dobla hacia abajo bajo la otra */}
          <path d="M1920,560 L1020,560 Q930,600 820,760 L560,1100 L800,1100 Q940,820 1080,700 L1920,700 Z" fill="url(#strata)" filter="url(#rock2)" />
          <path d="M0,560 L1020,560 L940,720 L0,740 Z" fill="#3e3128" filter="url(#rock2)" /><path d="M0,560 L1020,560" stroke="#8a7a68" strokeWidth={4} />
          <path d="M1020,560 Q930,600 820,760 L560,1100" stroke="#ffb27a" strokeWidth={5} fill="none" opacity={0.6} />
          {/* magma/calor donde se funde */}
          <ellipse cx={640} cy={1060} rx={200} ry={60} fill="#ff5a1a" opacity={0.25 + 0.15 * Math.sin(t * 3)} style={{ filter: "blur(18px)" }} />
          {/* flechas de avance: se aceleran con "24 cm" */}
          {[0, 1, 2].map((i) => { const xx = 1800 - (((t * (60 + 260 * fast)) + i * 300) % 700); return <path key={i} d={`M${xx},630 l-70,0 m24,-22 l-24,22 l24,22`} stroke={O.ink} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.8} />; })}
        </SV>}
        <div style={{ ...TX, right: 230, top: 700, textAlign: "right", fontSize: 54, opacity: tilt * (1 - nails) * (1 - fast) }}>PACIFIC PLATE <span style={{ color: O.orange }}>diving into the Earth</span></div>
        <div style={{ ...TX, left: 120, top: 600, fontSize: 40, color: O.dim, opacity: tilt * (1 - nails) }}>Tonga plate</div>
        <div style={{ ...TX, left: 1060, top: 720, fontSize: 170, color: O.red, opacity: fast * (1 - nails), lineHeight: 1 }}>24 cm<span style={{ fontSize: 60, color: O.ink }}> / year</span></div>
        {/* tus uñas contra la fosa: dos barras que crecen en el mismo año */}
        {nails > 0 && <AbsoluteFill style={{ background: `rgba(1,5,11,${0.82 * nails})` }}>
          {[["your fingernails", 4, O.ink, 360], ["Tonga Trench", 24, O.red, 620]].map(([n, cm, col, y]) => { const g = sm(t, 144.0, 148.4) * (cm as number);
            return <React.Fragment key={n as string}>
              <div style={{ ...TX, left: 230, top: (y as number) - 70, fontSize: 44, color: O.dim, opacity: nails }}>{n as string}</div>
              <div style={{ position: "absolute", left: 230, top: y as number, height: 90, width: 40 + g * 46, borderRadius: 14, background: col as string, opacity: nails }} />
              <div style={{ ...TX, left: 300 + g * 46, top: (y as number) + 6, fontSize: 64, color: col as string, opacity: nails }}>{g.toFixed(0)} cm</div>
            </React.Fragment>; })}
          <div style={{ ...TX, right: 230, top: 760, fontSize: 200, color: O.red, opacity: six }}>×6</div>
        </AbsoluteFill>}
      </AbsoluteFill>}

      {/* reloj de profundidad que sigue desde el minuto 1, hasta que la cámara sale del agua */}
      <div style={{ ...TX, right: 220, bottom: 110, textAlign: "right", opacity: 1 - sm(t, 79.4, 80.4) }}>
        <div style={{ fontSize: 30, color: O.dim, letterSpacing: 4 }}>DEPTH</div><div style={{ fontSize: 110, lineHeight: 1 }}>10,800 m</div>
      </div>
    </AbsoluteFill>
  );
};
