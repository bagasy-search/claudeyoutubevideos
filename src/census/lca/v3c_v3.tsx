// lc01 · vuelta 3 (v3c, planos 30-43): componentes nuevos. Todo ADITIVO; no toca los compartidos.
// · SuperSinCarro: el Supermercado sin el carrito suelto del primer término (la «rueda que flota» de P35).
// · CartelColgante: cartel de pasillo colgado del techo con cadenas, cae con resorte y se balancea; puede voltearse (cara B).
// · LataGrande: lata en la mano con la etiqueta «BEST BY» y el año que rueda (el dato vive en el objeto).
// · MatafuegoColgado (agarrado de la manija, cuelga), SoporteMatafuego (ancla el extintor de pared del Lobby).
// · Silla, PizarraGrande (texto que entra en la pizarra), LagoCielo (silueta del Lago Superior dibujada en el cielo),
//   Casilleros2 (tira de 4 casilleros que entran con resorte), ManoLapizB (inserto con la mano abajo a la derecha),
//   Manometro2 (en el caño, en el mundo), Ecuacion2 (2 renglones), CartelER, marcas de dolor, mejilla hinchada.
import React from "react";
import { Easing, interpolate, spring, useVideoConfig } from "remotion";
import { useF } from "../../anikit/camara";
import { F_HUD, F_MANO } from "../../anikit/pantalla";
import { Supermercado } from "../../anikit/sets/super";
import { AMBAR, ROJO_CENSO } from "../elenco";
import { F_MONO } from "../hud";
import { Icono, LapizP, tw } from "./lc01_planos2_comp";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

// ---------------------------------------------------------------- set
export const SuperSinCarro: React.FC<any> = (p) => (p.capa === "frente" ? null : <Supermercado {...p} />);

// ---------------------------------------------------------------- cartel colgante (mundo)
// x = centro, y = borde de arriba del cartel; cuelga de dos cadenas hasta techo (y techo). cara B desde `voltea`.
export const CartelColgante: React.FC<{ x: number; y: number; w: number; h: number; desde: number; hasta?: number; voltea?: number; techo?: number; color?: string; colorB?: string; a: React.ReactNode; b?: React.ReactNode }> = ({ x, y, w, h, desde, hasta = 1e9, voltea, techo = -200, color = "#2c6e57", colorB = "#2f8a4a", a, b }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 9, stiffness: 120 } });
  const dy = (1 - s) * -420;
  const sw = Math.sin((f - desde) / 7) * 5 * Math.exp(-(f - desde) / 30);
  const o = interpolate(f, [hasta, hasta + 10], [1, 0], CL);
  // volteo: escala X 1 → 0 → -1 (se ve la cara B), 14 cuadros
  const v = voltea !== undefined ? tw(f, voltea, voltea + 14, 0, 1) : 0;
  const sx = Math.cos(v * Math.PI);
  const caraB = v > 0.5;
  return (
    <g opacity={o}>
      <g transform={`translate(${x},${y + dy}) rotate(${sw})`}>
        {[-w * 0.36, w * 0.36].map((cx) => <line key={cx} x1={cx} y1={0} x2={cx} y2={techo - y - dy - 200} stroke="#5a5e62" strokeWidth={4} strokeDasharray="10 5" />)}
        <g transform={`scale(${Math.max(0.02, Math.abs(sx))},1)`}>
          <rect x={-w / 2 + 6} y={8} width={w} height={h} rx={14} fill="#000" opacity={0.22} />
          <rect x={-w / 2} y={0} width={w} height={h} rx={14} fill={caraB ? colorB : color} stroke="#f6f1e2" strokeWidth={5} />
          {caraB ? b : a}
        </g>
      </g>
    </g>
  );
};
// renglón de texto para el cartel (coordenadas locales del cartel: x centro 0)
export const TxtCartel: React.FC<{ t: string; y: number; tam?: number; color?: string; x?: number; ancla?: "middle" | "start" }> = ({ t, y, tam = 46, color = "#f6f1e2", x = 0, ancla = "middle" }) => (
  <text x={x} y={y} textAnchor={ancla} fontFamily={F_HUD} fontWeight={600} fontSize={tam} letterSpacing={3} fill={color}>{t}</text>
);

// ---------------------------------------------------------------- lata con BEST BY que rueda (mundo; base en 0,0)
export const LataGrande: React.FC<{ anio: number; s?: number; color?: string }> = ({ anio, s = 1, color = "#c0352c" }) => (
  <g transform={`scale(${s}) translate(0,-8)`}>
    <rect x={-30} y={-80} width={60} height={80} rx={8} fill={color} />
    <ellipse cx={0} cy={-80} rx={30} ry={7} fill="#d8d8dc" />
    <rect x={-30} y={-62} width={60} height={42} fill="#f6f1e2" />
    <text x={0} y={-48} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={10} letterSpacing={1} fill="#6a4a32">BEST BY</text>
    <text x={0} y={-26} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={19} fill={ROJO_CENSO}>{Math.round(anio)}</text>
  </g>
);

// ---------------------------------------------------------------- extintor
// colgado: la manija en la mano (0,0) y el cuerpo cuelga abajo
export const MatafuegoColgado: React.FC = () => (
  <g transform="translate(0,4)"><path d="M-10,0 h20" stroke="#2a2228" strokeWidth={8} strokeLinecap="round" /><rect x={-8} y={0} width={16} height={16} fill="#2a2228" /><rect x={-16} y={14} width={32} height={90} rx={12} fill="#c0352c" /><rect x={-16} y={44} width={32} height={18} fill="#f2ece0" /><path d="M8,6 q26,4 26,40" stroke="#2a2228" strokeWidth={6} fill="none" /></g>
);
// soporte de pared que ancla el extintor rojo del descanso del Lobby (rect del set: x 2550, y 360-440)
export const SoporteMatafuego: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 26} y={y - 50} width={86} height={150} rx={6} fill="#b8c2c6" stroke="#8a949a" strokeWidth={3} />
    <rect x={x} y={y - 30} width={34} height={80} rx={10} fill="#c0352c" />
    <rect x={x - 6} y={y + 4} width={46} height={10} rx={3} fill="#3a4048" />
    <rect x={x + 6} y={y - 44} width={22} height={14} fill="#2a2228" />
    <rect x={x - 20} y={y + 64} width={74} height={24} rx={4} fill="#c0352c" />
    <text x={x + 17} y={y + 82} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={15} fill="#fff">FIRE</text>
  </g>
);

// ---------------------------------------------------------------- silla de perfil (mundo; x = centro del asiento, mira a +x con dir)
export const Silla: React.FC<{ x: number; piso: number; dir?: 1 | -1; color?: string }> = ({ x, piso, dir = 1, color = "#6a4630" }) => (
  <g transform={`translate(${x},${piso}) scale(${dir},1)`}>
    <rect x={-34} y={-62} width={70} height={12} rx={4} fill={color} />
    <rect x={-34} y={-50} width={8} height={50} fill={color} /><rect x={28} y={-50} width={8} height={50} fill={color} />
    <rect x={-40} y={-170} width={9} height={120} rx={3} fill={color} /><rect x={-40} y={-168} width={9} height={30} fill="#000" opacity={0.15} />
  </g>
);

// ---------------------------------------------------------------- pizarra del lobby con texto que entra
export const PizarraGrande: React.FC<{ x: number; y: number; w: number; h: number; l1: string; l2: string; s1: number; s2: number }> = ({ x, y, w, h, l1, l2, s1, s2 }) => (
  <g>
    <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={8} fill="#8a9094" />
    <rect x={x} y={y} width={w} height={h} rx={4} fill="#f6f6f2" />
    <rect x={x + w * 0.3} y={y + h + 4} width={w * 0.4} height={10} rx={3} fill="#7a8084" />
    <text x={x + w / 2} y={y + h * 0.4} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={46} fill="#1d3a8a" textLength={w - 56} lengthAdjust="spacingAndGlyphs">{l1}</text>
    <text x={x + w / 2} y={y + h * 0.78} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={50} fill="#1d3a8a" textLength={w * 0.66} lengthAdjust="spacingAndGlyphs">{l2}</text>
    {s1 > 0 && <path d={`M${x + 30},${y + h * 0.47} L${x + 30 + (w - 60) * s1},${y + h * 0.46}`} stroke="#d8382c" strokeWidth={7} strokeLinecap="round" />}
    {s2 > 0 && <path d={`M${x + w * 0.17},${y + h * 0.86} Q${x + w / 2},${y + h * 0.9} ${x + w * 0.17 + w * 0.66 * s2},${y + h * 0.85}`} stroke="#d8382c" strokeWidth={7} strokeLinecap="round" fill="none" />}
  </g>
);

// ---------------------------------------------------------------- Lago Superior dibujado en el cielo (pantalla, sin caja)
// silueta simplificada pero reconocible: punta oeste (Duluth) fina, cuerpo ancho al este, la península de Keweenaw abajo
const SUP: [number, number][] = [[0, 52], [8, 46], [16, 40], [24, 33], [31, 27], [38, 21], [44, 15], [50, 12], [56, 8], [62, 5], [68, 4], [74, 6], [79, 4], [85, 7], [90, 12], [95, 18], [100, 26], [99, 33], [94, 37], [88, 41], [82, 40], [76, 44], [70, 47], [66, 44], [64, 36], [61, 33], [58, 38], [55, 46], [50, 48], [44, 47], [38, 49], [32, 49], [26, 50], [20, 52], [14, 54], [8, 55], [3, 55]];
export const LagoCielo: React.FC<{ x: number; y: number; w: number; desde: number; hasta?: number }> = ({ x, y, w, desde, hasta = 1e9 }) => {
  const f = useF();
  if (f < desde) return null;
  const k = w / 100;
  const pts = SUP.map(([a, b]) => [a * k, b * k]);
  let L = 0; for (let i = 1; i <= pts.length; i++) { const p = pts[i - 1], q = pts[i % pts.length]; L += Math.hypot(q[0] - p[0], q[1] - p[1]); }
  const d = "M" + pts.map((p) => p.join(",")).join(" L") + " Z";
  const u = tw(f, desde, desde + 36, 0, 1);
  const r = tw(f, desde + 26, desde + 44, 0, 1);
  const o = interpolate(f, [hasta, hasta + 10], [1, 0], CL);
  const pulso = 1 + 0.25 * Math.max(0, Math.sin((f - desde) / 5));
  return (
    <svg style={{ position: "absolute", left: x, top: y, width: w, height: 60 * k + 110, overflow: "visible", opacity: o }} viewBox={`0 0 ${w} ${60 * k + 110}`}>
      <path d={d} fill="#2f6fa8" opacity={0.85 * r} stroke="#ffffff" strokeOpacity={0.0} />
      <path d={d} fill="none" stroke="#f6f1e2" strokeWidth={5} strokeDasharray={L} strokeDashoffset={L * (1 - u)} strokeLinejoin="round" />
      {r > 0 && <>
        <circle cx={0} cy={52 * k} r={11 * pulso} fill={AMBAR} stroke="#120f18" strokeWidth={3} opacity={r} />
        <text x={18} y={52 * k + 40} fontFamily={F_HUD} fontWeight={600} fontSize={30} fill={AMBAR} stroke="#120f18" strokeWidth={6} paintOrder="stroke" opacity={r}>DULUTH</text>
        <text x={w * 0.6} y={24 * k} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={40} letterSpacing={4} fill="#f6f1e2" opacity={r}>LAKE SUPERIOR</text>
      </>}
      <text x={w * 0.55} y={60 * k + 50} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={30} letterSpacing={2} fill="#f6f1e2" stroke="#120f18" strokeWidth={6} paintOrder="stroke" opacity={tw(f, desde + 40, desde + 52, 0, 1)}>LARGEST FRESHWATER LAKE ON EARTH</text>
    </svg>
  );
};

// ---------------------------------------------------------------- tira de 4 casilleros (pantalla) con resorte en cada uno
export const Casilleros2: React.FC<{ x: number; y: number; desde: number; llenos: { f: number; icono: string; rot: string }[]; titulo?: string; tam?: number; gap?: number; hasta?: number; tachar?: { f: number; i: number } }> = ({ x, y, desde, llenos, titulo = "WHAT KILLS TWO PEOPLE?", tam = 112, gap = 52, hasta = 1e9 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde || f > hasta + 10) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 16, stiffness: 120 } });
  const o = interpolate(f, [hasta, hasta + 10], [1, 0], CL) * interpolate(f, [desde, desde + 10], [0, 1], CL);
  const W = 4 * tam + 3 * gap;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: W, opacity: o, transform: `translateY(${(1 - s) * 16}px)` }}>
      <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 34, letterSpacing: 3, color: "#f6ecd2", textShadow: "0 3px 10px rgba(0,0,0,0.8)", marginBottom: 10, whiteSpace: "nowrap", textAlign: "center" }}>{titulo}</div>
      <div style={{ display: "flex", gap }}>
        {[0, 1, 2, 3].map((i) => {
          const l = llenos[i];
          const on = l && f >= l.f;
          const sp = on ? spring({ frame: f - l.f, fps, config: { damping: 12, stiffness: 150 } }) : 0;
          return (
            <div key={i} style={{ width: tam, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative", width: tam, height: tam }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 18, border: "5px dashed #8a8090", background: "rgba(18,15,24,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_HUD, fontWeight: 600, fontSize: 56, color: "#8a8090", opacity: 1 - Math.min(1, sp) }}>?</div>
                {on && <div style={{ position: "absolute", inset: 0, borderRadius: 18, border: `5px solid #e2483a`, background: "#f6f0e2", transform: `scale(${0.4 + 0.6 * sp})`, opacity: Math.min(1, sp * 1.6), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={tam} height={tam} viewBox="-60 -60 120 120"><Icono n={l.icono} f={f} /></svg>
                </div>}
              </div>
              <div style={{ height: 30, marginTop: 8, fontFamily: F_HUD, fontWeight: 700, fontSize: 25, letterSpacing: 1.2, color: "#f6ecd2", textAlign: "center", whiteSpace: "nowrap", opacity: on ? Math.min(1, sp) : 0, textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{l?.rot}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- mano de inserto que viene de ABAJO a la derecha (la letra queda a la vista)
export const ManoLapizB: React.FC<{ x: number; y: number; manga?: string; puno?: string; giro?: number }> = ({ x, y, manga = "#c8582b", puno = "#efe3c8", giro = 70 }) => (
  <g transform={`translate(${x},${y}) rotate(${giro})`}>
    <path d="M150,-60 L1400,1400" stroke={manga} strokeWidth={150} strokeLinecap="round" />
    <path d="M128,-80 L178,-28" stroke={puno} strokeWidth={150} strokeLinecap="butt" opacity={0.95} />
    <LapizP s={2.6} />
    <ellipse cx={74} cy={-74} rx={70} ry={58} fill="#17100d" transform="rotate(-38 74 -74)" />
    <ellipse cx={30} cy={-40} rx={26} ry={18} fill="#17100d" transform="rotate(-50 30 -40)" />
  </g>
);

// ---------------------------------------------------------------- manómetro en el caño (mundo)
export const Manometro2: React.FC<{ x: number; y: number; v: number; r?: number; caño?: number }> = ({ x, y, v, r = 70, caño = 260 }) => {
  const a = -120 + 240 * v;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-14} y={r - 4} width={28} height={caño} fill="#6a747c" />
      <rect x={-24} y={r - 8} width={48} height={20} rx={4} fill="#4a545c" />
      <circle r={r + 12} fill="#3a4048" />
      <circle r={r} fill="#ece6dc" stroke="#8a949a" strokeWidth={6} />
      <path d={`M${-r * 0.62},${r * 0.62} A${r * 0.88},${r * 0.88} 0 0 1 ${-r * 0.78},${-r * 0.42}`} stroke={ROJO_CENSO} strokeWidth={10} fill="none" />
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-2.5} y={-r + 8} width={5} height={13} fill="#3a3440" transform={`rotate(${-120 + i * 30})`} />)}
      <g transform={`rotate(${a})`}><path d={`M-5,8 L0,${-r + 14} L5,8 Z`} fill={ROJO_CENSO} /></g><circle r={9} fill="#2a2228" />
      <text x={0} y={r * 0.5} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={r * 0.2} letterSpacing={1} fill="#3a3440">PSI</text>
    </g>
  );
};

// ---------------------------------------------------------------- ecuación en 2 renglones (pantalla)
export const Ecuacion2: React.FC<{ x: number; y: number; t: number[]; w?: number }> = ({ x, y, t, w = 980 }) => {
  // t = [2 personas, ×2,000, ×365, resultado]
  const f = useF();
  const { fps } = useVideoConfig();
  const sp = (a: number) => (f < a ? 0 : spring({ frame: f - a, fps, config: { damping: 13, stiffness: 140 } }));
  const term = (a: number, el: React.ReactNode, ww: number) => { const s = sp(a); return <div style={{ width: ww, transform: `translateY(${(1 - s) * 30}px) scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 1.5), textAlign: "center" }}>{el}</div>; };
  const tx = (s: string, c = "#f6ecd2", tam = 80) => <div style={{ fontFamily: F_MONO, fontWeight: 800, fontSize: tam, color: c, textShadow: "0 6px 18px rgba(0,0,0,0.7)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{s}</div>;
  const sub = (s: string) => <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: "#e8dcc2", marginTop: 2, whiteSpace: "nowrap", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{s}</div>;
  const res = interpolate(f, [t[3], t[3] + 40], [0, 1500000], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 8 }}>
        {term(t[0], <>{tx("2", AMBAR)}{sub("PEOPLE")}</>, 150)}
        {term(t[1], <>{tx("× 2,000")}{sub("KCAL A DAY")}</>, 340)}
        {term(t[2], <>{tx("× 365")}{sub("DAYS")}</>, 250)}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
        {term(t[3], <div style={{ display: "flex", alignItems: "baseline", gap: 18, justifyContent: "center" }}>{tx("=", "#f6ecd2", 84)}<div>{tx(fmt(res), AMBAR, 104)}{sub("CALORIES A YEAR")}</div></div>, w)}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- cartel EMERGENCY + años (mundo, pared del ER)
export const CartelER: React.FC<{ x: number; y: number; anios: number; desdeAnios: number }> = ({ x, y, anios, desdeAnios }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const s = f < desdeAnios ? 0 : spring({ frame: f - desdeAnios, fps, config: { damping: 12, stiffness: 150 } });
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-210} y={-40} width={420} height={80} rx={10} fill="#c0352c" stroke="#f6f1e2" strokeWidth={4} />
      <rect x={-190} y={-18} width={14} height={36} fill="#fff" /><rect x={-201} y={-7} width={36} height={14} fill="#fff" />
      <text x={20} y={16} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={44} letterSpacing={5} fill="#fff">EMERGENCY</text>
      {s > 0 && <g transform={`translate(0,${86}) scale(${0.5 + 0.5 * s})`} opacity={Math.min(1, s * 1.5)}>
        <rect x={-150} y={-6} width={300} height={92} rx={12} fill="#120f18" />
        <text x={0} y={60} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={58} fill={AMBAR}>{Math.round(anios)} YEARS</text>
      </g>}
    </g>
  );
};

// ---------------------------------------------------------------- marcas de dolor / corte / mejilla (mundo)
export const Dolor: React.FC<{ x: number; y: number; o: number; r?: number }> = ({ x, y, o, r = 34 }) => {
  const f = useF();
  if (o <= 0) return null;
  const p = 1 + 0.15 * Math.sin(f / 3);
  return <g opacity={o} transform={`translate(${x},${y}) scale(${p})`}>{[0, 60, 120, 180, 240, 300].map((a) => <path key={a} d={`M0,${-r} l0,${-r * 0.6}`} stroke="#ff4a3d" strokeWidth={6} strokeLinecap="round" transform={`rotate(${a})`} />)}</g>;
};
export const CorteDedo: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => {
  const f = useF();
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={20 + 3 * Math.sin(f / 4)} fill="#ff4a3d" opacity={0.35} />
      <path d={`M${x - 12},${y + 6} L${x + 12},${y - 6}`} stroke="#c0352c" strokeWidth={5} strokeLinecap="round" />
      <circle cx={x + 4} cy={y + 14 + ((f * 0.6) % 14)} r={3.5} fill="#c0352c" />
    </g>
  );
};
export const Mejilla: React.FC<{ x: number; y: number; o: number; r?: number }> = ({ x, y, o, r = 22 }) => (o <= 0 ? null : (
  <g opacity={o}><circle cx={x} cy={y} r={r * (0.6 + 0.4 * o)} fill="#17100d" /><circle cx={x} cy={y} r={r * 0.62 * o} fill="#ff4a3d" opacity={0.45} /></g>
));
