import React from "react";
import { interpolate } from "remotion";
import { SPR, Theme, useTheme } from "./theme";
import {
  Card,
  Display,
  Eyebrow,
  Panel,
  Stage,
  Support,
  kick,
  rand,
  useBeat,
} from "./core";

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIA: LUGAR / TIEMPO — TimelinePlayhead · MapPinPoint · RouteTrace ·
// DateStampCorner
// ═══════════════════════════════════════════════════════════════════════════

// TerrainMap — mapa estilizado determinista (curvas de nivel + costa) que sirve
// de fondo para pines y rutas cuando no hay imagen satelital.
const TerrainMap: React.FC<{ theme?: Theme; seed?: number }> = ({ theme, seed = 0 }) => {
  const t = useTheme(theme);
  const dark = t.mode === "dark";
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <rect width={1600} height={900} fill={dark ? t.color.bg0 : t.color.bg1} />
      {/* masa de agua */}
      <path
        d={`M 0 ${620 + rand(seed, 1) * 80} C 300 ${560 + rand(seed, 2) * 60}, 700 ${700 + rand(seed, 3) * 60}, 1100 ${640 + rand(seed, 4) * 40} S 1500 ${700}, 1600 ${660} L 1600 900 L 0 900 Z`}
        fill={t.color.accent2}
        opacity={dark ? 0.3 : 0.35}
      />
      {/* curvas de nivel concéntricas */}
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse
          key={i}
          cx={480 + rand(seed, 5) * 300}
          cy={300 + rand(seed, 6) * 120}
          rx={140 + i * 95}
          ry={80 + i * 62}
          fill="none"
          stroke={t.color.ink}
          strokeWidth={1.6}
          opacity={0.16 - i * 0.018}
        />
      ))}
      {/* retícula */}
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`v${i}`} x1={(i + 1) * 200} y1={0} x2={(i + 1) * 200} y2={900} stroke={t.color.ink} strokeWidth={1} opacity={0.07} />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={(i + 1) * 180} x2={1600} y2={(i + 1) * 180} stroke={t.color.ink} strokeWidth={1} opacity={0.07} />
      ))}
      {/* caminos secundarios */}
      <path d={`M 100 100 C 500 ${200 + rand(seed, 7) * 100}, 900 ${140 + rand(seed, 8) * 120}, 1520 ${320 + rand(seed, 9) * 100}`} fill="none" stroke={t.color.ink} strokeWidth={2.4} strokeDasharray="12 10" opacity={0.2} />
      <path d={`M 300 900 C 460 ${600 + rand(seed, 10) * 80}, 700 ${500 + rand(seed, 11) * 100}, 1300 ${80 + rand(seed, 12) * 120}`} fill="none" stroke={t.color.ink} strokeWidth={2.4} strokeDasharray="12 10" opacity={0.16} />
    </svg>
  );
};

// ── TimelinePlayhead — línea de tiempo con playhead que viaja y eventos que ──
//    se encienden a su paso.
export type TimeEvent = { year: string; label: string };
export const TimelinePlayhead: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  events?: TimeEvent[];
}> = ({
  durationInFrames,
  theme,
  title = "Cien años del mismo truco",
  events = [
    { year: "1920", label: "Los abuelos lo usaban" },
    { year: "1965", label: "La industria lo reemplaza" },
    { year: "1998", label: "Se pierde la receta" },
    { year: "2026", label: "Vuelve, probado" },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const X0 = 200;
  const X1 = 1600;
  const Y = 560;
  const n = events.length;
  const travel = interpolate(frame, [16, durationInFrames - 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headX = X0 + travel * (X1 - X0);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={40}>
        <div style={{ position: "absolute", top: 66, left: 0, right: 0, textAlign: "center" }}>
          <Eyebrow theme={t} style={{ justifyContent: "center" }}>Línea de tiempo</Eyebrow>
          <Display theme={t} size={56} style={{ marginTop: 10 }}>{title}</Display>
        </div>
        <svg viewBox="0 0 1800 960" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          {/* riel */}
          <line x1={X0} y1={Y} x2={X1} y2={Y} stroke={t.color.line} strokeWidth={6} strokeLinecap="round" />
          {/* progreso recorrido */}
          <line x1={X0} y1={Y} x2={headX} y2={Y} stroke={t.color.accent} strokeWidth={6} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${t.color.glow})` }} />
          {/* playhead */}
          <g transform={`translate(${headX} ${Y})`}>
            <circle r={22} fill={t.color.gold} stroke={t.color.surfaceStrong} strokeWidth={5} style={{ filter: `drop-shadow(0 6px 14px ${t.color.shadow})` }} />
            <circle r={34} fill="none" stroke={t.color.gold} strokeWidth={2} opacity={0.5} />
          </g>
          {events.map((_, i) => {
            const ex = X0 + (i / (n - 1)) * (X1 - X0);
            const passed = headX >= ex - 4;
            return <circle key={i} cx={ex} cy={Y} r={13} fill={passed ? t.color.accent : t.color.bg2} stroke={t.color.ink} strokeWidth={2.5} />;
          })}
        </svg>
        {events.map((ev, i) => {
          const ex = X0 + (i / (n - 1)) * (X1 - X0);
          const passed = headX >= ex - 4;
          const activeS = kick(frame, fps, 16, SPR.settle); // base enter
          const lift = passed ? 1 : 0.4;
          const up = i % 2 === 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: ex - 175, // el svg 1800x960 mapea 1:1 con el panel (inset 60)
                top: up ? Y - 218 : Y + 46,
                width: 350,
                textAlign: "center",
                opacity: activeS * lift,
                transform: `translateY(${passed ? 0 : up ? 8 : -8}px) scale(${passed ? 1 : 0.94})`,
              }}
            >
              <Card theme={t} accent={passed ? t.color.accent : undefined} style={{ padding: "14px 20px" }}>
                <Display theme={t} size={44} color={passed ? t.color.gold : t.color.textDim}>{ev.year}</Display>
                <Support theme={t} size={25} color={passed ? t.color.textSoft : t.color.textDim}>{ev.label}</Support>
              </Card>
            </div>
          );
        })}
      </Panel>
    </Stage>
  );
};

// ── MapPinPoint — pin que CAE sobre el mapa + anillos de radar + placa ───────
export const MapPinPoint: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  place?: string;
  region?: string;
  x?: number; // 0..1 posición del pin en el mapa
  y?: number;
}> = ({ durationInFrames, theme, place = "Valle de Uco", region = "Mendoza, Argentina", x = 0.42, y = 0.44 }) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const DROP_AT = 14;
  const drop = kick(frame, fps, DROP_AT, SPR.slam);
  const px = 1800 * x;
  const py = 960 * y;
  const plateS = kick(frame, fps, DROP_AT + 12, SPR.snappy);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} transparent>
        <TerrainMap theme={t} seed={3} />
        {/* viñeta y textura del panel encima del mapa */}
        <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 130px ${t.color.shadow}`, borderRadius: t.radius }} />
        {/* anillos de radar */}
        <svg viewBox="0 0 1800 960" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 3 }, (_, i) => {
            const cycle = 70;
            const p = ((frame - DROP_AT - i * (cycle / 3) + cycle * 10) % cycle) / cycle;
            const visible = frame > DROP_AT + 4 ? 1 : 0;
            return <circle key={i} cx={px} cy={py} r={26 + p * 150} fill="none" stroke={t.color.accent} strokeWidth={4 - p * 3} opacity={visible * (1 - p) * 0.8} />;
          })}
        </svg>
        {/* pin que cae con squash de contacto */}
        <div
          style={{
            position: "absolute",
            left: px - 40,
            top: py - 104 + (1 - drop) * -240,
            opacity: Math.min(1, drop * 3),
            transform: `scaleY(${1 + (1 - drop) * 0.25})`,
            transformOrigin: "bottom center",
            filter: `drop-shadow(0 14px 18px ${t.color.shadow})`,
          }}
        >
          <svg viewBox="0 0 80 104" width={80} height={104}>
            <path d="M 40 102 C 40 102 8 58 8 38 C 8 18 22 4 40 4 C 58 4 72 18 72 38 C 72 58 40 102 40 102 Z" fill={t.color.danger} stroke={t.color.surfaceStrong} strokeWidth={4} />
            <circle cx={40} cy={37} r={14} fill={t.color.surfaceStrong} />
          </svg>
        </div>
        {/* sombra de contacto del pin */}
        <div style={{ position: "absolute", left: px - 34, top: py - 7, width: 68, height: 15, borderRadius: "50%", background: "rgba(0,0,0,0.35)", filter: "blur(4px)", opacity: drop }} />
        {/* placa de lugar */}
        <div style={{ position: "absolute", left: px + 66, top: py - 92, opacity: plateS, transform: `translateX(${(1 - plateS) * -20}px)` }}>
          <Card theme={t} accent={t.color.gold} strong style={{ padding: "20px 34px" }}>
            <Display theme={t} size={46}>{place}</Display>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
              <div style={{ width: 26, height: 3, background: t.color.gold }} />
              <Support theme={t} size={26}>{region}</Support>
            </div>
          </Card>
        </div>
      </Panel>
    </Stage>
  );
};

// ── RouteTrace — ruta que se dibuja entre dos puntos del mapa ────────────────
export const RouteTrace: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  from?: { label: string; x: number; y: number };
  to?: { label: string; x: number; y: number };
  distance?: string;
}> = ({
  durationInFrames,
  theme,
  from = { label: "Puerto Madryn", x: 0.22, y: 0.68 },
  to = { label: "Península Valdés", x: 0.74, y: 0.28 },
  distance = "97 km",
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const x0 = 1800 * from.x;
  const y0 = 960 * from.y;
  const x1 = 1800 * to.x;
  const y1 = 960 * to.y;
  const mx = (x0 + x1) / 2 + 120;
  const my = (y0 + y1) / 2 - 160;
  const dist = Math.hypot(x1 - x0, y1 - y0) * 1.35;
  const p = interpolate(frame, [18, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // posición del caminante sobre la curva (bezier cuadrática)
  const bez = (t0: number) => ({
    x: (1 - t0) * (1 - t0) * x0 + 2 * (1 - t0) * t0 * mx + t0 * t0 * x1,
    y: (1 - t0) * (1 - t0) * y0 + 2 * (1 - t0) * t0 * my + t0 * t0 * y1,
  });
  const head = bez(p);
  const fromS = kick(frame, fps, 8, SPR.snappy);
  const toS = kick(frame, fps, 60, SPR.snappy);
  const distS = kick(frame, fps, 66, SPR.settle);

  const Dot: React.FC<{ x: number; y: number; s: number; color: string }> = ({ x, y, s, color }) => (
    <div style={{ position: "absolute", left: x - 17, top: y - 17, width: 34, height: 34, borderRadius: "50%", background: color, border: `5px solid ${t.color.surfaceStrong}`, boxShadow: `0 8px 18px ${t.color.shadow}`, opacity: s, transform: `scale(${s})` }} />
  );
  const Plate: React.FC<{ x: number; y: number; s: number; label: string }> = ({ x, y, s, label }) => (
    <div style={{ position: "absolute", left: x + 34, top: y - 32, opacity: s, transform: `translateY(${(1 - s) * 10}px)` }}>
      <Card theme={t} strong style={{ padding: "10px 24px" }}>
        <Display theme={t} size={32}>{label}</Display>
      </Card>
    </div>
  );

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} transparent>
        <TerrainMap theme={t} seed={9} />
        <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 130px ${t.color.shadow}`, borderRadius: t.radius }} />
        <svg viewBox="0 0 1800 960" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          {/* ruta que se dibuja de punta a punta */}
          <path
            d={`M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`}
            fill="none"
            stroke={t.color.danger}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={dist}
            strokeDashoffset={dist * (1 - p)}
            style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.3))" }}
          />
          {/* cabeza viajera */}
          <circle cx={head.x} cy={head.y} r={16} fill={t.color.gold} stroke={t.color.surfaceStrong} strokeWidth={4} opacity={p > 0 && p < 1 ? 1 : 0} style={{ filter: `drop-shadow(0 0 12px ${t.color.glow})` }} />
        </svg>
        <Dot x={x0} y={y0} s={fromS} color={t.color.accent2} />
        <Plate x={x0} y={y0} s={fromS} label={from.label} />
        <Dot x={x1} y={y1} s={toS} color={t.color.danger} />
        <Plate x={x1} y={y1} s={toS} label={to.label} />
        {/* distancia sobre el punto medio */}
        <div style={{ position: "absolute", left: mx - 110, top: my + 60, opacity: distS, transform: `translateY(${(1 - distS) * 12}px)` }}>
          <div style={{ background: t.color.gold, color: t.mode === "dark" ? "#141B12" : "#fff", fontFamily: t.fontLabel, fontWeight: 900, fontSize: 34, padding: "10px 28px", borderRadius: 40, boxShadow: `0 14px 30px ${t.color.shadow}`, letterSpacing: 1 }}>
            {distance}
          </div>
        </div>
      </Panel>
    </Stage>
  );
};

// ── DateStampCorner — sello de fecha/lugar de esquina con reveal typewriter ──
export const DateStampCorner: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  date?: string;
  place?: string;
  corner?: "tl" | "tr" | "bl" | "br";
}> = ({ durationInFrames, theme, date = "MARZO DE 1987", place = "Chernóbil, Ucrania", corner = "tl" }) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const s = kick(frame, fps, 4, SPR.settle);
  const chars = Math.floor(interpolate(frame, [10, 10 + date.length * 1.6], [0, date.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const placeS = kick(frame, fps, 12 + date.length * 1.6, SPR.snappy);
  const pos: React.CSSProperties =
    corner === "tl" ? { top: 90, left: 90 } : corner === "tr" ? { top: 90, right: 90 } : corner === "bl" ? { bottom: 90, left: 90 } : { bottom: 90, right: 90 };
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <div style={{ position: "absolute", ...pos, opacity: s, transform: `translateY(${(1 - s) * -16}px)` }}>
        <Card theme={t} strong style={{ padding: "22px 36px", borderLeft: `8px solid ${t.color.gold}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: t.color.danger, boxShadow: `0 0 0 5px ${t.color.danger}33` }} />
            <div style={{ fontFamily: t.fontLabel, fontWeight: 800, fontSize: 40, letterSpacing: 3, color: t.color.text, textTransform: "uppercase", minHeight: 48 }}>
              {date.slice(0, chars)}
              <span style={{ opacity: Math.sin(frame / 4) > 0 && chars < date.length ? 1 : 0, color: t.color.gold }}>|</span>
            </div>
          </div>
          <div style={{ opacity: placeS, transform: `translateX(${(1 - placeS) * -12}px)`, marginTop: 6, marginLeft: 30 }}>
            <Support theme={t} size={28}>{place}</Support>
          </div>
        </Card>
      </div>
    </Stage>
  );
};
