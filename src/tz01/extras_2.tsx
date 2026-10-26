// tz01 · helpers de la vuelta 3 para planos2 (Vaishali): humo del farol que dibuja la ciudad, placa de contador legible,
// calendario de los 4 meses del monzón, inserto del cuenco que recibe arroz, halo del Buda, Buda en primer término,
// revelado circular desde la llama y nubes de lluvia. Pantalla = coords del cuadro (hud). Mundo = SVG del set (medio).
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD, valorEn } from "../anikit/pantalla";
import { Halo } from "../anikit/luz";
import { ORO } from "../tenzo/elenco";
import { FarolPapel } from "../tenzo/utileria";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const lp = (f: number, a: number, b: number, v0: number, v1: number) => interpolate(f, [a, b], [v0, v1], cl);
const TINTA = "#221c18";

// ---------- inserto: el farol en primer plano y su humo dorado que dibuja Vaishali en el aire ----------
const CIUDAD_TRAZO = [
  // casas, cúpulas y torres (un solo trazo largo que se dibuja)
  "M420,520 L420,400 L500,360 L580,400 L580,520",
  "M600,520 L600,330 L640,300 L680,330 L680,520",
  "M700,520 L700,380 Q790,250 880,380 L880,520",
  "M900,520 L900,260 L935,200 L970,260 L970,520",
  "M990,520 L990,370 Q1090,230 1190,370 L1190,520",
  "M1210,520 L1210,320 L1250,290 L1290,320 L1290,520",
  "M1310,520 L1310,400 L1400,350 L1490,400 L1490,520",
  "M380,520 L1530,520",
];
const PUERTAS: [number, number][] = [[490, 470], [630, 480], [775, 460], [925, 470], [1075, 455], [1240, 475], [1390, 465]];
export const HumoCiudad: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const f = useF() - desde;
  const luz = 0.85 + 0.15 * Math.sin(f / 3.1) * Math.sin(f / 1.7);
  const dib = lp(f, 6, 40, 1, 0); // 1 = sin dibujar
  const relleno = lp(f, 30, 50, 0, 0.32);
  const zoom = 1 + 0.0016 * f;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 85%, #4a2e18 0%, #1c130d 55%, #0d0907 100%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", transform: `scale(${zoom})`, transformOrigin: "50% 90%" }}>
        {/* humo: hebras que suben de la boca del farol hacia la ciudad */}
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const pts: string[] = [];
          for (let i = 0; i <= 24; i++) {
            const t = i / 24;
            const x = 960 + (k - 2.5) * 30 * t * 6 + 40 * Math.sin(t * 7 + f / 7 + k * 1.3) * t;
            const y = 700 - t * lp(f, 0, 26, 120, 520);
            pts.push(`${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`);
          }
          return <path key={k} d={pts.join(" ")} stroke={ORO} strokeWidth={10 - k} fill="none" opacity={0.28} strokeLinecap="round" />;
        })}
        {/* la ciudad de humo */}
        <g opacity={lp(f, 4, 12, 0, 1)}>
          {CIUDAD_TRAZO.map((d, k) => <path key={k} d={d} fill={ORO} fillOpacity={relleno} stroke="#ffe2a6" strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={Math.min(1, dib * 1.4 - k * 0.05 + 0.05)} />)}
          {PUERTAS.map(([x, y], k) => { const s = spring({ frame: f - 34 - k * 2, fps: 30, config: { damping: 11 } }); return <rect key={k} x={x - 14 * s} y={y - 50 * s + 50} width={28 * s} height={50 * s} rx={12 * s} fill="#ffcf4a" />; })}
        </g>
        {/* chispas doradas que suben */}
        {Array.from({ length: 34 }).map((_, k) => {
          const t = ((f * (1 + random(`hc${k}`)) + random(`hd${k}`) * 90) % 90) / 90;
          const x = 960 + (random(`hx${k}`) - 0.5) * 900 * t + 30 * Math.sin(f / 9 + k);
          return <circle key={k} cx={x} cy={700 - t * 560} r={2 + 3 * random(`hr${k}`)} fill="#fff1c4" opacity={Math.sin(t * Math.PI) * 0.9} />;
        })}
        <FarolPapel x={960} y={1060} s={3.4} luz={luz} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- placa de contador legible (caja oscura, letra grande) ----------
export type LineaPlaca = { etiqueta: string; claves: { f: number; v: number; d?: number }[]; color: string; desde?: number };
export const PlacaContador: React.FC<{ lineas: LineaPlaca[]; x: number; y: number; tam?: number; desde?: number; hasta?: number; der?: boolean }> = ({ lineas, x, y, tam = 44, desde = 0, hasta, der }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 15, stiffness: 140 } });
  return (
    <div style={{ position: "absolute", left: der ? undefined : x, right: der ? x : undefined, top: y, transform: `translateY(${(1 - s) * 16}px)`, opacity: s, background: "rgba(22,14,10,0.84)", borderRadius: 18, padding: "12px 26px 14px", boxShadow: "0 6px 18px rgba(0,0,0,0.35)", fontFamily: F_HUD, fontWeight: 600, fontSize: tam, lineHeight: 1.2, color: "#f4efe4", whiteSpace: "nowrap" }}>
      {lineas.filter((l) => f >= (l.desde ?? 0)).map((l, i) => {
        const { v, pop } = valorEn(l.claves, f);
        return <div key={i}>{l.etiqueta} <span style={{ color: l.color, display: "inline-block", fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.15 * pop})`, transformOrigin: "0% 70%" }}>{Math.round(v)}</span></div>;
      })}
    </div>
  );
};

// ---------- 4 meses del monzón: cuatro hojas de calendario que se llenan de lluvia ----------
const MESES = ["JUN", "JUL", "AUG", "SEP"];
export const CuatroMeses: React.FC<{ desde: number; hasta?: number }> = ({ desde, hasta }) => {
  const f = useF() - desde;
  if (f < 0 || (hasta !== undefined && f > hasta - desde)) return null;
  const o = Math.min(lp(f, 0, 8, 0, 1), hasta !== undefined ? lp(f, hasta - desde - 8, hasta - desde, 1, 0) : 1);
  const W = 300, G = 44, x0 = (1920 - (4 * W + 3 * G)) / 2;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "rgba(18,20,32,0.82)" }} />
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 60, color: "#f4efe4", letterSpacing: 2 }}>MONKS STAY IN ONE PLACE</div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {MESES.map((m, k) => {
          const s = spring({ frame: f - 6 - k * 9, fps: 30, config: { damping: 12, stiffness: 160 } });
          if (s <= 0.01) return null;
          const x = x0 + k * (W + G), y = 300;
          const lluvia = lp(f, 14 + k * 9, 24 + k * 9, 0, 1);
          return (
            <g key={m} transform={`translate(${x + W / 2},${y + 200}) scale(${s}) translate(${-W / 2},-200)`}>
              <rect x={0} y={0} width={W} height={400} rx={22} fill="#f6f1e6" />
              <rect x={0} y={0} width={W} height={84} rx={22} fill="#4a7ab0" /><rect x={0} y={60} width={W} height={24} fill="#4a7ab0" />
              <text x={W / 2} y={60} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={52} fill="#fff">{m}</text>
              {/* nube y lluvia */}
              <g transform={`translate(${W / 2},170)`}>
                {[[-50, 10, 46], [0, -12, 58], [52, 8, 44], [0, 22, 50]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#8796ad" />)}
                {Array.from({ length: 9 }).map((_, i) => {
                  const t = ((f * 1.4 + i * 11) % 30) / 30;
                  return <line key={i} x1={-90 + i * 22} y1={60 + t * 140} x2={-98 + i * 22} y2={84 + t * 140} stroke="#4a7ab0" strokeWidth={6} strokeLinecap="round" opacity={lluvia * Math.sin(t * Math.PI)} />;
                })}
              </g>
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ opacity: lp(f, 44, 54, 0, 1), transform: `scale(${0.8 + 0.2 * lp(f, 44, 54, 0, 1)})`, background: "#4a7ab0", borderRadius: 48, padding: "14px 44px", fontFamily: F_HUD, fontWeight: 600, fontSize: 64, color: "#fff", boxShadow: "0 6px 18px rgba(0,0,0,0.4)" }}>4 MONTHS · MONSOON</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- inserto: el cuenco de limosna que recibe arroz (manos del monje abajo, cucharón de una vecina arriba) ----------
export const InsertoCuenco: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const f = useF() - desde;
  const inc = lp(f, 2, 12, 0, 38); // el cucharón se inclina
  const monton = lp(f, 10, 40, 0, 1);
  const bx = 960, by = 760;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#e9b878, #d99a5a)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* pared con puerta de oro, fuera de foco */}
        <g style={{ filter: "blur(10px)" }} opacity={0.8}>
          <rect x={1180} y={60} width={420} height={760} rx={200} fill="#e8b84a" />
          <rect x={200} y={140} width={220} height={300} rx={40} fill="#7a4a2a" />
        </g>
        {/* mangas naranjas y manos que sostienen el cuenco */}
        <path d={`M${bx - 520},1080 Q${bx - 380},${by + 80} ${bx - 230},${by + 40} L${bx - 170},${by + 150} Q${bx - 320},${by + 220} ${bx - 330},1080 Z`} fill="#e07a2c" stroke={TINTA} strokeWidth={5} />
        <path d={`M${bx + 520},1080 Q${bx + 380},${by + 80} ${bx + 230},${by + 40} L${bx + 170},${by + 150} Q${bx + 320},${by + 220} ${bx + 330},1080 Z`} fill="#d06a24" stroke={TINTA} strokeWidth={5} />
        <ellipse cx={bx - 200} cy={by + 90} rx={70} ry={52} fill="#d9a273" stroke={TINTA} strokeWidth={5} />
        <ellipse cx={bx + 200} cy={by + 90} rx={70} ry={52} fill="#d9a273" stroke={TINTA} strokeWidth={5} />
        {/* cuenco */}
        <path d={`M${bx - 230},${by - 20} Q${bx - 220},${by + 190} ${bx},${by + 200} Q${bx + 220},${by + 190} ${bx + 230},${by - 20} Z`} fill="#5a3a24" stroke={TINTA} strokeWidth={6} />
        <ellipse cx={bx} cy={by - 20} rx={230} ry={52} fill="#3a2414" stroke={TINTA} strokeWidth={6} />
        {/* montón de arroz que crece */}
        <path d={`M${bx - 200 * monton},${by - 18} Q${bx},${by - 18 - 120 * monton} ${bx + 200 * monton},${by - 18} Z`} fill="#f7f2e6" />
        {Array.from({ length: 30 }).map((_, k) => monton > 0.15 && <ellipse key={k} cx={bx + (random(`ra${k}`) - 0.5) * 340 * monton} cy={by - 26 - random(`rb${k}`) * 80 * monton} rx={6} ry={3.5} fill="#e4dccb" transform={`rotate(${random(`rc${k}`) * 180},${bx},${by})`} />)}
        {/* brazo de la vecina con el cucharón */}
        <g transform={`translate(${bx + 120},${by - 520}) rotate(${-inc})`}>
          <path d="M520,-200 Q300,-60 120,-20 L110,60 Q320,40 560,-80 Z" fill="#c8603a" stroke={TINTA} strokeWidth={5} />
          <ellipse cx={100} cy={20} rx={52} ry={44} fill="#cf9468" stroke={TINTA} strokeWidth={5} />
          <path d="M80,20 L-80,60" stroke="#6a4a2a" strokeWidth={14} strokeLinecap="round" />
          <path d="M-60,40 Q-110,120 -170,70 Q-150,30 -60,40 Z" fill="#7a5a3a" stroke={TINTA} strokeWidth={5} />
        </g>
        {/* granos que caen */}
        {inc > 20 && Array.from({ length: 26 }).map((_, k) => {
          const t = ((f * 1.6 + k * 7) % 26) / 26;
          const x0 = bx - 10 + (random(`gx${k}`) - 0.5) * 50;
          return <ellipse key={k} cx={x0 + t * 20} cy={by - 420 + t * 380} rx={5} ry={3} fill="#fbf7ee" opacity={lp(f, 12, 16, 0, 1) * (f < 44 ? 1 : lp(f, 44, 52, 1, 0))} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- halo del Buda (MUNDO): resplandor + aro + rayos suaves que giran lento. Va ANTES del <Buda> ----------
export const HaloBuda: React.FC<{ x: number; y: number; r?: number; fuerza?: number }> = ({ x, y, r = 150, fuerza = 1 }) => {
  const f = useF();
  return (
    <g>
      <Halo x={x} y={y} r={r * 2.6} color={ORO} fuerza={0.6 * fuerza} />
      <g transform={`translate(${x},${y}) rotate(${f * 0.25})`} opacity={0.22 * fuerza}>
        {Array.from({ length: 12 }).map((_, k) => <path key={k} d={`M0,0 L${-r * 0.16},${-r * 2} L${r * 0.16},${-r * 2} Z`} fill="#fff1c4" transform={`rotate(${k * 30})`} />)}
      </g>
      <circle cx={x} cy={y} r={r} fill="#ffe6a8" opacity={0.35 * fuerza} />
      <circle cx={x} cy={y} r={r} fill="none" stroke="#fff1c4" strokeWidth={6} opacity={0.75 * fuerza} />
    </g>
  );
};

// ---------- el Buda en primer término (contraplano por encima del hombro): nuca, oreja larga, hombro granate, halo ----------
export const BudaPrimerTermino: React.FC<{ x: number; y: number; r?: number; brillo?: number }> = ({ x, y, r = 230, brillo = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", filter: "blur(3px)" }}>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <g transform={`translate(${x},${y})`}>
        <Halo x={0} y={0} r={r * 2.2} color={ORO} fuerza={0.5 * brillo} />
        <circle cx={0} cy={0} r={r * 1.18} fill="none" stroke="#fff1c4" strokeWidth={8} opacity={0.6 * brillo} />
        <path d={`M${-r * 1.3},${r * 2.6} Q${-r * 1.2},${r * 0.95} 0,${r * 0.85} Q${r * 1.3},${r * 0.95} ${r * 1.5},${r * 2.6} Z`} fill="#9c3b22" stroke={TINTA} strokeWidth={6} />
        <path d={`M${-r * 0.9},${r * 2.6} Q${-r * 0.4},${r * 1.4} ${r * 0.5},${r * 1.0}`} stroke="#c7861f" strokeWidth={r * 0.22} fill="none" />
        <circle cx={0} cy={0} r={r} fill="#e2ad78" stroke={TINTA} strokeWidth={6} />
        {/* de espaldas (3/4): el pelo cubre la nuca; sólo asoma la mejilla del lado del monje */}
        <path d={`M${-r * 0.55},${-r * 0.84} Q${-r * 0.1},${-r * 1.08} ${r * 0.55},${-r * 0.84} Q${r * 1.02},${-r * 0.4} ${r * 0.98},${r * 0.2} Q${r * 0.8},${r * 0.75} ${r * 0.2},${r * 0.98} Q${-r * 0.2},${r * 0.5} ${-r * 0.35},${-r * 0.1} Q${-r * 0.45},${-r * 0.55} ${-r * 0.55},${-r * 0.84} Z`} fill="#1d2340" />
        <path d={`M${-r * 0.92},${-r * 0.1} Q${-r * 1.22},${r * 0.1} ${-r * 1.06},${r * 0.75} Q${-r * 0.92},${r * 0.86} ${-r * 0.82},${r * 0.3}`} fill="#e2ad78" stroke={TINTA} strokeWidth={6} />
        <path d={`M${-r * 0.5},${r * 0.9} Q0,${r * 1.2} ${r * 0.6},${r * 0.9}`} stroke="#6b4224" strokeWidth={12} fill="none" strokeDasharray="2 18" strokeLinecap="round" />
      </g>
    </svg>
  </AbsoluteFill>
);

// ---------- revelado circular desde un punto de la pantalla (la llama que abre otro mundo) ----------
export const Revela: React.FC<{ x: number; y: number; r: number; children: React.ReactNode }> = ({ x, y, r, children }) => (
  r <= 0 ? null : <AbsoluteFill style={{ clipPath: `circle(${r}px at ${x}px ${y}px)` }}>{children}</AbsoluteFill>
);

// ---------- nubes de lluvia (MUNDO) que entran por la derecha; y0 = altura de las nubes ----------
export const NubesLluvia: React.FC<{ desde: number; x0: number; x1: number; y0?: number; llueve?: number }> = ({ desde, x0, x1, y0 = 200, llueve = 30 }) => {
  const f = useF() - desde;
  if (f < 0) return null;
  const dx = lp(f, 0, 50, 900, 0);
  return (
    <g>
      {[0, 1, 2, 3, 4].map((k) => {
        const cx = x0 + ((x1 - x0) * k) / 4 + dx * (1 + k * 0.2), cy = y0 + (k % 2) * 40;
        return <g key={k}>{[[-90, 10, 80], [0, -30, 100], [90, 6, 76], [10, 40, 90]].map(([a, b, r], i) => <circle key={i} cx={cx + a} cy={cy + b} r={r} fill={i % 2 ? "#7a6a72" : "#8a7a80"} />)}</g>;
      })}
      {f > llueve && Array.from({ length: 70 }).map((_, k) => {
        const t = ((f * 1.3 + k * 5) % 24) / 24;
        const x = x0 - 100 + random(`ll${k}`) * (x1 - x0 + 200) + dx;
        return <line key={k} x1={x} y1={y0 + 60 + t * 700} x2={x - 8} y2={y0 + 96 + t * 700} stroke="#e8eef8" strokeWidth={4} opacity={0.55 * lp(f, llueve, llueve + 10, 0, 1)} strokeLinecap="round" />;
      })}
    </g>
  );
};
