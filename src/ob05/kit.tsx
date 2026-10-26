// Kit propio de ob05 (vuelta del director): textos en zona segura, persona acostada, la app de "Screen Time",
// el ojo grande, el cuerpo con la sangre que se va a los músculos, el celular-tragamonedas y utilería chica.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useVideoConfig } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD, F_MANO } from "../anikit/pantalla";

export const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
// minutos → «2h 12m»
export const hm = (v: number) => { const m = Math.max(0, Math.round(v)); return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`; };
export const reloj = (claves: number | { f: number; v: number; d?: number }[], extra: Record<string, unknown> = {}) => ({ claves, icono: "reloj" as const, fmt: hm, ...extra });
export const ent = (f: number, a: number, b: number, d = 6) => interpolate(f, [a, a + d, b - d, b], [0, 1, 1, 0], cl);

// ---------- texto de pantalla en ZONA SEGURA (HUD arriba-izq 0-560×0-130 y reloj arriba-der 1560-1920×0-110 libres) ----------
type PosT = "arriba" | "abajo" | "izq" | "der" | "centro";
export const Rot: React.FC<{ t: string; a: number; b: number; pos?: PosT; tam?: number; color?: string; mano?: boolean; top?: number; chip?: boolean; rot?: number }> = ({ t, a, b, pos = "arriba", tam = 60, color = "#f4efe4", mano, top, chip = true, rot = 0 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < a - 1 || f > b) return null;
  const s = spring({ frame: f - a, fps, config: { damping: 13, stiffness: 160 } });
  const o = Math.min(s, interpolate(f, [b - 6, b], [1, 0], cl));
  const y = top ?? (pos === "abajo" ? 1080 - 110 - tam * 1.3 : pos === "centro" ? 540 - tam * 0.7 : 150);
  const st: React.CSSProperties = { position: "absolute", top: y, display: "flex", justifyContent: pos === "izq" ? "flex-start" : pos === "der" ? "flex-end" : "center", left: 110, right: 110 };
  return (
    <div style={st}>
      <div style={{ transform: `rotate(${rot}deg) scale(${0.7 + 0.3 * s})`, opacity: o, fontFamily: mano ? F_MANO : F_HUD, fontWeight: mano ? 700 : 600, fontSize: mano ? tam * 1.15 : tam, color, lineHeight: 1.1, whiteSpace: "pre-line", textAlign: "center",
        background: chip ? "rgba(12,16,22,0.74)" : undefined, padding: chip ? `${tam * 0.12}px ${tam * 0.42}px` : undefined, borderRadius: tam * 0.3, textShadow: "0 3px 12px rgba(0,0,0,0.6)", boxShadow: chip ? "0 10px 26px rgba(0,0,0,0.3)" : undefined }}>{t}</div>
    </div>
  );
};

// ---------- persona ACOSTADA: pies en (x, y), gira rot grados (‑90 = cabeza a la izquierda, mirando al techo con dir 1) ----------
export const Acostado: React.FC<{ x: number; y: number; rot?: number; children: React.ReactNode }> = ({ x, y, rot = -90, children }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>{children}</g>
);

// ---------- mano negra (stickman) que sostiene algo desde abajo ----------
export const ManoPOV: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-60,40 q-10,240 40,700 h150 q-20,-420 30,-700 Z" fill="#141016" />
    <rect x={-92} y={-40} width={60} height={150} rx={30} fill="#141016" transform="rotate(-18)" />
    <rect x={120} y={-150} width={52} height={120} rx={26} fill="#141016" transform="rotate(14)" />
    <rect x={130} y={-60} width={52} height={120} rx={26} fill="#141016" transform="rotate(10)" />
    <rect x={124} y={30} width={50} height={110} rx={25} fill="#141016" transform="rotate(6)" />
  </g>
);

// ---------- la app «Screen Time» en un celular grande (SVG en coordenadas de pantalla 1920×1080) ----------
const HORAS_BARRA = [0.1, 0.05, 0.3, 0, 0, 0.6, 0.9, 0.7, 0.5, 0.4, 0.8, 0.6, 0.7, 0.5, 0.6, 0.8, 0.9, 1, 0.8, 0.95, 1, 0.9, 0.7, 0.4];
export const AppUso: React.FC<{ x: number; y: number; esc?: number; min: number; llenar: number; f: number; titulo?: string; apps?: [string, number, string][]; color?: string }> = ({ x, y, esc = 1, min, llenar, f, titulo = "SCREEN TIME · TODAY", apps = [["Social", 0.9, "#ff8a5a"], ["Video", 0.7, "#7ab8ff"], ["Games", 0.35, "#ffc94a"]], color = "#43e0b4" }) => (
  <g transform={`translate(${x},${y}) scale(${esc})`}>
    <rect x={-250} y={-470} width={500} height={940} rx={64} fill="#141418" />
    <rect x={-228} y={-446} width={456} height={892} rx={46} fill="#f4f6f8" />
    <rect x={-60} y={-440} width={120} height={26} rx={13} fill="#141418" />
    <text x={-200} y={-360} fontFamily={F_HUD} fontWeight={600} fontSize={26} letterSpacing={2} fill="#6a7280">{titulo}</text>
    <text x={-200} y={-280} fontFamily={F_HUD} fontWeight={600} fontSize={84} fill="#20242c" style={{ fontVariantNumeric: "tabular-nums" }}>{hm(min)}</text>
    <g transform="translate(-200,-130)">
      {HORAS_BARRA.map((h, i) => {
        const u = interpolate(llenar * 24 - i, [0, 1], [0, 1], cl);
        const alto = 150 * h * u;
        return <rect key={i} x={i * 16.6} y={-alto} width={12} height={alto} rx={4} fill={i % 6 === 5 ? "#9aa4ac" : color} />;
      })}
      <rect x={0} y={2} width={400} height={3} fill="#c9ced6" />
      {["12A", "6A", "12P", "6P"].map((t, i) => <text key={t} x={i * 100} y={34} fontFamily={F_HUD} fontWeight={500} fontSize={20} fill="#9aa4ac">{t}</text>)}
    </g>
    {apps.map(([n, v, c], i) => {
      const u = interpolate(llenar, [0.3 + i * 0.15, 0.8 + i * 0.1], [0, 1], cl);
      return (
        <g key={n} transform={`translate(-200,${-20 + i * 130})`}>
          <rect x={0} y={0} width={70} height={70} rx={18} fill={c} />
          <text x={92} y={30} fontFamily={F_HUD} fontWeight={600} fontSize={32} fill="#20242c">{n}</text>
          <rect x={92} y={44} width={300} height={14} rx={7} fill="#e2e6ea" />
          <rect x={92} y={44} width={300 * v * u} height={14} rx={7} fill={c} />
        </g>
      );
    })}
    <rect x={-80} y={420} width={160} height={8} rx={4} fill="#20242c" opacity={0.5} />
    <rect x={-228} y={-446} width={456} height={892} rx={46} fill="url(#brilloCel)" opacity={0.0} />
    <circle cx={150} cy={-300} r={10 + 4 * Math.sin(f / 5)} fill={color} opacity={0.5} />
  </g>
);

// ---------- el OJO grande: párpados que parpadean, iris, brillo, venitas que se ponen rojas, película de lágrima que se seca ----------
export const OjoGrande: React.FC<{ x: number; y: number; esc?: number; abre: number; rojo?: number; seco?: number; f: number; mira?: number }> = ({ x, y, esc = 1, abre, rojo = 0, seco = 0, f, mira = 0 }) => {
  const a = Math.max(0.02, abre);
  const W = 420, Hs = 230 * a, Hi = 200 * a;
  const contorno = `M${-W},0 Q${-W * 0.3},${-Hs * 1.45} ${W * 0.15},${-Hs * 1.2} Q${W * 0.8},${-Hs * 0.8} ${W},0 Q${W * 0.4},${Hi * 1.3} ${-W * 0.2},${Hi * 1.05} Q${-W * 0.75},${Hi * 0.8} ${-W},0 Z`;
  const id = `ojo${Math.round(x)}${Math.round(y)}`;
  const piel = "#2a1e1c";
  return (
    <g transform={`translate(${x},${y}) scale(${esc})`}>
      {/* piel alrededor (la cara del stickman, en primerísimo plano) */}
      <ellipse rx={W * 1.5} ry={W * 0.95} fill={piel} />
      <path d={`M${-W * 1.05},${-260} Q0,${-420 - 40 * (1 - a)} ${W * 1.05},${-250}`} stroke="#120c0c" strokeWidth={46} fill="none" strokeLinecap="round" />
      <clipPath id={id}><path d={contorno} /></clipPath>
      <path d={contorno} fill={`rgb(${248},${Math.round(244 - 70 * rojo)},${Math.round(236 - 80 * rojo)})`} />
      <g clipPath={`url(#${id})`}>
        {/* venitas */}
        {Array.from({ length: 9 }).map((_, i) => {
          const lado = i % 2 ? 1 : -1, yy = -120 + (i * 37) % 240;
          return <path key={i} d={`M${lado * W},${yy} q${-lado * 90},${-20 + (i % 3) * 20} ${-lado * 160},${10 - (i % 4) * 8} q${-lado * 40},${-10} ${-lado * 70},${14}`} stroke="#d83a3a" strokeWidth={4 + (i % 3)} fill="none" opacity={0.15 + 0.85 * rojo} />;
        })}
        <g transform={`translate(${mira * 60},0)`}>
          <circle r={150} fill="#3e7fa6" />
          {Array.from({ length: 24 }).map((_, i) => <path key={i} d={`M${Math.cos(i / 3.8) * 70},${Math.sin(i / 3.8) * 70} L${Math.cos(i / 3.8) * 146},${Math.sin(i / 3.8) * 146}`} stroke="#2a5a7e" strokeWidth={5} />)}
          <circle r={64 + 10 * Math.sin(f / 40)} fill="#0b1018" />
          <circle cx={46} cy={-50} r={26} fill="#ffffff" opacity={0.95} />
          <circle cx={-40} cy={44} r={10} fill="#ffffff" opacity={0.6} />
        </g>
        {/* película de lágrima: brillo que se apaga al secarse */}
        <path d={`M${-W * 0.7},${-Hs * 0.6} Q0,${-Hs * 1.1} ${W * 0.6},${-Hs * 0.55}`} stroke="#ffffff" strokeWidth={14} fill="none" opacity={0.55 * (1 - seco)} strokeLinecap="round" />
        {seco > 0 && Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${-260 + i * 100},${120 + (i % 2) * 30} l${18},-30 l14,22 l20,-26`} stroke="#c98a6a" strokeWidth={4} fill="none" opacity={seco} />)}
      </g>
      {/* párpados (piel) que tapan según abre */}
      <path d={contorno} fill="none" stroke="#120c0c" strokeWidth={22} />
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${-W * 0.7 + i * W * 0.24},${-Hs * 1.05 - 6} l${-8 + i * 3},${-46}`} stroke="#120c0c" strokeWidth={10} strokeLinecap="round" opacity={a > 0.2 ? 1 : 0} />)}
    </g>
  );
};

// ---------- el CUERPO por dentro: estómago + intestinos en el centro, músculos de brazos y piernas, la sangre que se va ----------
export const CuerpoAnat: React.FC<{ x: number; y: number; esc?: number; flujo: number; f: number; nudo?: number }> = ({ x, y, esc = 1, flujo, f, nudo = 0 }) => {
  const piel = "#1f2a33", borde = "#f4efe4";
  const musc = (d: string, k: number) => <path key={k} d={d} fill={`rgb(${Math.round(150 + 105 * flujo)},${Math.round(60 - 20 * flujo)},${Math.round(70 - 20 * flujo)})`} opacity={0.55 + 0.45 * flujo} stroke="#ff9a9a" strokeWidth={3} />;
  const panzaC = `rgb(${Math.round(242 - 120 * flujo)},${Math.round(176 - 90 * flujo)},${Math.round(110 - 40 * flujo)})`;
  const venas: [number, number, number, number][] = [[0, -40, -210, -150], [0, -40, 210, -150], [0, 40, -90, 470], [0, 40, 90, 470], [0, -40, -230, 120], [0, -40, 230, 120]];
  return (
    <g transform={`translate(${x},${y}) scale(${esc})`}>
      {/* silueta */}
      <circle cy={-470} r={95} fill={piel} stroke={borde} strokeWidth={6} />
      <path d="M-150,-350 Q-190,-340 -250,-160 L-280,120 L-220,130 L-180,-110 L-150,40 L-150,170 L-130,600 L-40,600 L-10,230 L10,230 L40,600 L130,600 L150,170 L150,40 L180,-110 L220,130 L280,120 L250,-160 Q190,-340 150,-350 Z" fill={piel} stroke={borde} strokeWidth={6} strokeLinejoin="round" />
      {/* músculos: brazos y muslos */}
      {[
        "M-215,-250 q-30,90 -40,190 q30,10 50,-6 q10,-90 22,-170 Z", "M215,-250 q30,90 40,190 q-30,10 -50,-6 q-10,-90 -22,-170 Z",
        "M-130,220 q-10,140 0,250 q40,10 60,-4 q10,-120 10,-240 Z", "M130,220 q10,140 0,250 q-40,10 -60,-4 q-10,-120 -10,-240 Z",
      ].map(musc)}
      {/* estómago e intestinos */}
      <g transform={`translate(0,${-60}) scale(${1 - 0.18 * nudo},${1 - 0.1 * nudo})`}>
        <path d="M-30,-140 q-90,-10 -100,80 q-6,90 90,100 q90,8 110,-60 q14,-60 -40,-60 q-30,0 -30,-60 Z" fill={panzaC} stroke="#5a3020" strokeWidth={5} />
        <path d="M-110,70 q-20,40 10,70 q40,30 90,10 q40,-20 80,10 q30,30 0,60 q-40,30 -100,10 q-60,-10 -90,20" fill="none" stroke={panzaC} strokeWidth={26} strokeLinecap="round" />
        {nudo > 0.1 && <path d="M-60,-40 q30,-30 60,0 q-30,30 -60,0 Z M-30,-40 l0,0" stroke="#5a3020" strokeWidth={6} fill="none" opacity={nudo} />}
      </g>
      {/* corazón */}
      <path d="M40,-250 c-30,-40 -90,-10 -60,40 l60,50 l60,-50 c30,-50 -30,-80 -60,-40 Z" fill="#e2483a" transform={`scale(${1 + 0.08 * Math.max(0, Math.sin(f / 3)) ** 6})`} />
      {/* vasos y la sangre que viaja: hacia la panza (antes) o hacia los músculos (después) */}
      {venas.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1 - 180} x2={x2} y2={y2} stroke="#b8323a" strokeWidth={8} opacity={0.6} />)}
      {Array.from({ length: 36 }).map((_, i) => {
        const v = venas[i % venas.length];
        const t = ((f / 22 + i / 36 * 3) % 1);
        const aMusc = i % 6 < Math.round(6 * flujo);
        const [x2, y2] = aMusc ? [v[2], v[3]] : [0, -20];
        const px = v[0] + (x2 - v[0]) * t, py = v[1] - 180 + (y2 - (v[1] - 180)) * t;
        return <circle key={i} cx={px} cy={py} r={9} fill="#ff4a5a" opacity={0.95} />;
      })}
    </g>
  );
};

// ---------- flecha animada (se dibuja de a poco) ----------
export const Flecha: React.FC<{ x1: number; y1: number; x2: number; y2: number; u: number; color?: string; w?: number; curva?: number }> = ({ x1, y1, x2, y2, u, color = "#ff4a5a", w = 14, curva = 0 }) => {
  if (u <= 0) return null;
  const mx = (x1 + x2) / 2 - (y2 - y1) * curva, my = (y1 + y2) / 2 + (x2 - x1) * curva;
  const L = Math.hypot(x2 - x1, y2 - y1) * 1.2;
  const t = 0.98;
  const ex = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, ey = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
  const ang = Math.atan2(y2 - ey, x2 - ex) * 180 / Math.PI;
  return (
    <g>
      <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - u)} />
      {u > 0.95 && <path d={`M0,0 l${-w * 2.6},${-w * 1.8} l0,${w * 3.6} Z`} fill={color} transform={`translate(${x2},${y2}) rotate(${ang})`} />}
    </g>
  );
};

// ---------- despertador/reloj chico de mesa (para el «5:12» en primer plano) ----------
export const Despertador: React.FC<{ x: number; y: number; t: string; esc?: number; brillo?: number }> = ({ x, y, t, esc = 1, brillo = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${esc})`}>
    <rect x={-58} y={-44} width={116} height={50} rx={10} fill="#1d1f24" />
    <rect x={-50} y={-38} width={100} height={36} rx={6} fill="#2a0e0c" />
    <text x={0} y={-10} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill="#ff4a3d" textAnchor="middle" style={{ fontVariantNumeric: "tabular-nums" }}>{t}</text>
    {brillo > 0 && <circle r={90} cy={-20} fill="#ff4a3d" opacity={0.15 * brillo} />}
  </g>
);

// ---------- celular con pantalla de video (partido) para el hombre del traje ----------
export const CeluPartido: React.FC<{ f: number; s?: number }> = ({ f, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-34} y={-20} width={68} height={40} rx={7} fill="#15151a" />
    <rect x={-30} y={-16} width={60} height={32} rx={4} fill="#2f8a3a" />
    <rect x={-30} y={-2} width={60} height={2} fill="#ffffff" opacity={0.7} />
    <circle cx={-14 + 28 * ((f % 40) / 40)} cy={-6 + 6 * Math.sin(f / 4)} r={3} fill="#ffffff" />
    {[0, 1, 2].map((i) => <path key={i} d={`M${40 + i * 12},-10 q8,10 0,20`} stroke="#f4efe4" strokeWidth={3} fill="none" opacity={0.3 + 0.7 * Math.abs(Math.sin(f / 4 + i))} />)}
  </g>
);

// ---------- chispa/aparición del cartel (destellos alrededor de un punto) ----------
export const Chispas: React.FC<{ x: number; y: number; f: number; desde: number; color?: string; r?: number }> = ({ x, y, f, desde, color = "#7dff6a", r = 120 }) => {
  const t = (f - desde) / 18;
  if (t < 0 || t > 1) return null;
  return <g>{Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2 + random(`ch${i}`); const d = r * (0.3 + t); return <path key={i} d={`M${x + Math.cos(a) * d * 0.7},${y + Math.sin(a) * d * 0.7} L${x + Math.cos(a) * d},${y + Math.sin(a) * d}`} stroke={color} strokeWidth={6} strokeLinecap="round" opacity={1 - t} />; })}</g>;
};

// ---------- fondo plano cálido de pantalla (para insertos de celular) ----------
export const FondoCalido: React.FC<{ a?: string; b?: string; children?: React.ReactNode }> = ({ a = "#3a2a3a", b = "#140e16", children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 60% 40%, ${a}, ${b} 75%)` }}>{children}</AbsoluteFill>
);

export const TXT = { F_HUD, F_MANO };
