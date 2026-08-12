import React from "react";
import { interpolate } from "remotion";
import { SfxCue, SFX } from "../../components/Sfx";
import { SPR, Theme, useTheme } from "./theme";
import {
  Card,
  Display,
  Eyebrow,
  Motas,
  Odo,
  Panel,
  Stage,
  Stroke,
  Support,
  fmt,
  kick,
  useBeat,
} from "./core";

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIA: NÚMEROS / STATS — BigStatReveal · StatGrid · RankBars · GaugeDial ·
// DonutPercent
// ═══════════════════════════════════════════════════════════════════════════

// ── BigStatReveal — UN dato dominante gigante con subrayado que barre ────────
export const BigStatReveal: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  value?: number;
  prefix?: string;
  suffix?: string;
  support?: string;
  source?: string;
  sfx?: boolean;
}> = ({
  durationInFrames,
  theme,
  // ⚠ DEFAULTS VACÍOS A PROPÓSITO — no los vuelvas a llenar con texto de ejemplo.
  // Antes decían: eyebrow="El dato que nadie mira", value=12400, support="se va por
  // año en calefacción mal aislada", y en otra copia prefix="$" y source="Fuente:
  // ENARGAS 2025". Como son valores POR DEFECTO, quien llamaba al componente sólo
  // pasaba `value` y `suffix` y el resto se colaba al video sin que nadie lo
  // escribiera: salió al aire un "$3 costumbres" (el $ era de la plantilla) citando
  // al ente del gas argentino en un video de SALUD. O sea, el componente FABRICABA
  // una cita que nadie hizo. Un default vacío se ve como un hueco y se arregla;
  // un default plausible se publica. (Este arreglo vivía sólo en la copia _fed6.)
  eyebrow = "",
  value = 0,
  prefix = "",
  suffix = "",
  support = "",
  source = "",
  sfx = true,
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const eyeS = kick(frame, fps, 4, SPR.settle);
  const supS = kick(frame, fps, 34, SPR.settle);
  const srcS = kick(frame, fps, 48, SPR.settle);
  const underline = interpolate(frame, [26, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={70}>
        <Motas theme={t} count={14} opacity={0.4} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {eyebrow && (
            <div style={{ opacity: eyeS, transform: `translateY(${(1 - eyeS) * -14}px)`, marginBottom: 18 }}>
              <Eyebrow theme={t} size={30}>{eyebrow}</Eyebrow>
            </div>
          )}
          <div style={{ position: "relative", filter: `drop-shadow(0 18px 34px ${t.color.shadow})` }}>
            <Odo theme={t} value={value} prefix={prefix} suffix={suffix} size={210} at={8} dur={58} />
            {/* subrayado marcador que barre bajo la cifra */}
            <div
              style={{
                position: "absolute",
                left: "2%",
                bottom: -26,
                width: `${underline * 96}%`,
                height: 16,
                borderRadius: 8,
                background: `linear-gradient(90deg, ${t.color.accent}, ${t.color.gold})`,
                boxShadow: `0 6px 22px ${t.color.glow}`,
              }}
            />
          </div>
          {support && (
            <div style={{ opacity: supS, transform: `translateY(${(1 - supS) * 18}px)`, marginTop: 52, maxWidth: 1100, textAlign: "center" }}>
              <Support theme={t} size={42}>{support}</Support>
            </div>
          )}
          {source && (
            <div style={{ opacity: srcS, marginTop: 22 }}>
              <Support theme={t} size={22}>{source}</Support>
            </div>
          )}
        </div>
        {sfx && (
          <>
            <SfxCue at={2} src={SFX.whoosh} volume={0.28} />
            {[10, 18, 26, 34, 42].map((f) => (
              <SfxCue key={f} at={f} src={SFX.digitTick} volume={0.18} durationInFrames={12} />
            ))}
            <SfxCue at={50} src={SFX.boom1} volume={0.34} />
          </>
        )}
      </Panel>
    </Stage>
  );
};

// ── StatGrid — 2x2 de datos con odómetros en stagger ─────────────────────────
export type StatCell = { value: number; prefix?: string; suffix?: string; label: string; accent?: string };
export const StatGrid: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  stats?: StatCell[];
}> = ({
  durationInFrames,
  theme,
  title = "Los números del año",
  stats = [
    { value: 340, suffix: "kg", label: "cosecha total" },
    { value: 92, suffix: "%", label: "menos plagas" },
    { value: 14000, prefix: "$", label: "ahorrados" },
    { value: 6, suffix: "hs", label: "de trabajo semanal" },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const accents = [t.color.accent, t.color.gold, t.color.accent2, t.color.good];
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={28}>
        <div style={{ position: "absolute", top: 54, left: 0, right: 0, textAlign: "center" }}>
          <Display theme={t} size={58}>{title}</Display>
        </div>
        <div
          style={{
            position: "absolute",
            top: 200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1400,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 34,
          }}
        >
          {stats.slice(0, 4).map((st, i) => {
            const at = 10 + i * 8;
            const s = kick(frame, fps, at, SPR.settle);
            const accent = st.accent ?? accents[i % accents.length];
            return (
              <div key={i} style={{ opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${0.94 + s * 0.06})` }}>
                <Card theme={t} style={{ padding: "48px 52px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: `linear-gradient(180deg, ${accent}, ${accent}66)` }} />
                  <Odo theme={t} value={st.value} prefix={st.prefix ?? ""} suffix={st.suffix ?? ""} size={104} color={accent} at={at + 6} dur={48} />
                  <Support theme={t} size={32} style={{ marginTop: 12 }}>{st.label}</Support>
                </Card>
              </div>
            );
          })}
        </div>
      </Panel>
    </Stage>
  );
};

// ── RankBars — carrera de barras horizontales con valores que asientan ───────
export type BarRow = { label: string; value: number; accent?: string };
export const RankBars: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  unit?: string;
  rows?: BarRow[];
}> = ({
  durationInFrames,
  theme,
  title = "Cuánto rinde cada uno",
  unit = "kg",
  rows = [
    { label: "Tomate", value: 96 },
    { label: "Zapallo", value: 71 },
    { label: "Maíz", value: 55 },
    { label: "Lechuga", value: 32 },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const max = Math.max(...rows.map((r) => r.value), 1);
  const BARW = 900;
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }}>
        <div style={{ position: "absolute", top: 56, left: 120 }}>
          <Display theme={t} size={58}>{title}</Display>
        </div>
        <div style={{ position: "absolute", top: 200, left: 120, right: 120, display: "flex", flexDirection: "column", gap: 34 }}>
          {rows.map((r, i) => {
            const at = 10 + i * 9;
            const s = kick(frame, fps, at, SPR.settle);
            const grow = kick(frame, fps, at + 6, SPR.soft);
            const w = (r.value / max) * BARW * grow;
            const isTop = r.value === max;
            const accent = r.accent ?? (isTop ? t.color.gold : t.color.accent);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
                <div style={{ width: 250, textAlign: "right" }}>
                  <Display theme={t} size={37}>{r.label}</Display>
                </div>
                <div style={{ position: "relative", flex: `0 0 ${BARW}px`, height: 62 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: t.radius * 0.6, background: t.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(42,38,32,0.07)", border: `1px solid ${t.color.line}` }} />
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: w,
                      borderRadius: t.radius * 0.6,
                      background: `linear-gradient(90deg, ${accent}AA, ${accent})`,
                      boxShadow: `0 10px 24px ${t.color.shadow}, inset 0 2px 0 rgba(255,255,255,0.25)`,
                    }}
                  />
                  {isTop && (
                    <div style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontFamily: t.fontLabel, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: t.color.onAccent, opacity: grow, textTransform: "uppercase" }}>
                      ★ líder
                    </div>
                  )}
                </div>
                <div style={{ width: 190 }}>
                  <Odo theme={t} value={r.value} suffix={unit} size={48} color={accent} at={at + 6} dur={44} />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </Stage>
  );
};

// ── GaugeDial — medidor semicircular con aguja spring + cifra central ────────
export const GaugeDial: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  label?: string;
  value?: number; // 0..100
  suffix?: string;
  zones?: boolean; // pinta zonas verde/oro/rojo
}> = ({
  durationInFrames,
  theme,
  eyebrow = "Nivel de riesgo",
  label = "humedad en la madera",
  value = 78,
  suffix = "%",
  zones = true,
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const CX = 400;
  const CY = 400;
  const R = 300;
  const sweep = kick(frame, fps, 12, SPR.soft);
  const v = (value / 100) * sweep;
  const ang = Math.PI * (1 - v); // 180° → 0°
  const nx = CX + Math.cos(ang) * (R - 60);
  const ny = CY - Math.sin(ang) * (R - 60);
  const arc = (a0: number, a1: number, color: string, opac = 1) => {
    const x0 = CX + Math.cos(Math.PI * (1 - a0)) * R;
    const y0 = CY - Math.sin(Math.PI * (1 - a0)) * R;
    const x1 = CX + Math.cos(Math.PI * (1 - a1)) * R;
    const y1 = CY - Math.sin(Math.PI * (1 - a1)) * R;
    return <path d={`M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`} fill="none" stroke={color} strokeWidth={44} strokeLinecap="butt" opacity={opac} />;
  };
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={80}>
        <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Eyebrow theme={t} size={28}>{eyebrow}</Eyebrow>
        </div>
        <div style={{ position: "absolute", left: "50%", top: 168, transform: "translateX(-50%)" }}>
          <svg viewBox="0 0 800 460" width={830} height={477} style={{ filter: `drop-shadow(0 20px 30px ${t.color.shadow})` }}>
            {/* riel de fondo */}
            {arc(0, 1, t.mode === "dark" ? "rgba(255,255,255,0.09)" : "rgba(42,38,32,0.1)")}
            {zones ? (
              <>
                {arc(0, 0.45, t.color.good, 0.85)}
                {arc(0.45, 0.72, t.color.gold, 0.85)}
                {arc(0.72, 1, t.color.danger, 0.85)}
              </>
            ) : (
              arc(0, v, t.color.accent)
            )}
            {/* ticks */}
            {Array.from({ length: 11 }, (_, i) => {
              const a = Math.PI * (1 - i / 10);
              const x0 = CX + Math.cos(a) * (R + 34);
              const y0 = CY - Math.sin(a) * (R + 34);
              const x1 = CX + Math.cos(a) * (R + 48);
              const y1 = CY - Math.sin(a) * (R + 48);
              return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={t.color.textDim} strokeWidth={4} strokeLinecap="round" />;
            })}
            {/* aguja con contrapeso */}
            <g style={{ filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.35))" }}>
              <line x1={CX} y1={CY} x2={nx} y2={ny} stroke={t.color.ink} strokeWidth={13} strokeLinecap="round" />
              <circle cx={CX} cy={CY} r={34} fill={t.color.ink} />
              <circle cx={CX} cy={CY} r={14} fill={t.color.gold} />
            </g>
          </svg>
        </div>
        <div style={{ position: "absolute", bottom: 64, left: 0, right: 0, textAlign: "center" }}>
          <Odo theme={t} value={value} suffix={suffix} size={110} color={value > 66 ? t.color.danger : value > 40 ? t.color.gold : t.color.good} at={14} dur={50} />
          <Support theme={t} size={32} style={{ marginTop: 6 }}>{label}</Support>
        </div>
      </Panel>
    </Stage>
  );
};

// ── DonutPercent — anillo que se dibuja hasta el % + cifra centrada ──────────
export const DonutPercent: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  value?: number; // 0..100
  title?: string;
  support?: string;
}> = ({
  durationInFrames,
  theme,
  value = 68,
  title = "De cada 100 hogares",
  support = "pagan de más sin saberlo",
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const R = 235;
  const C = 2 * Math.PI * R;
  const grow = kick(frame, fps, 10, SPR.soft);
  const p = (value / 100) * grow;
  const titleS = kick(frame, fps, 6, SPR.settle);
  const supS = kick(frame, fps, 40, SPR.settle);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={26}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 110 }}>
          <div style={{ position: "relative", width: 560, height: 560, filter: `drop-shadow(0 24px 44px ${t.color.shadow})` }}>
            <svg viewBox="0 0 560 560" width={560} height={560}>
              <circle cx={280} cy={280} r={R} fill="none" stroke={t.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(42,38,32,0.09)"} strokeWidth={52} />
              <circle
                cx={280}
                cy={280}
                r={R}
                fill="none"
                stroke={t.color.accent}
                strokeWidth={52}
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - p)}
                transform="rotate(-90 280 280)"
                style={{ filter: `drop-shadow(0 0 18px ${t.color.glow})` }}
              />
              {/* cabeza brillante del anillo */}
              <circle
                cx={280 + Math.cos(Math.PI * 2 * p - Math.PI / 2) * R}
                cy={280 + Math.sin(Math.PI * 2 * p - Math.PI / 2) * R}
                r={30}
                fill={t.color.gold}
                opacity={grow}
                style={{ filter: `drop-shadow(0 0 14px ${t.color.glow})` }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Odo theme={t} value={value} suffix="%" size={128} at={12} dur={50} grouped={false} />
            </div>
          </div>
          <div style={{ maxWidth: 560 }}>
            <div style={{ opacity: titleS, transform: `translateY(${(1 - titleS) * 16}px)` }}>
              <Display theme={t} size={64}>{title}</Display>
            </div>
            <div style={{ opacity: supS, transform: `translateY(${(1 - supS) * 16}px)`, marginTop: 18 }}>
              <Support theme={t} size={40}>
                <span style={{ color: t.color.accent, fontWeight: 800 }}>{fmt(value)}</span> {support}
              </Support>
            </div>
            <svg viewBox="0 0 500 30" width={500} height={30} style={{ marginTop: 26 }}>
              <Stroke d="M 6 18 C 120 8, 320 26, 494 12" at={46} dur={20} color={t.color.gold} width={5} length={520} />
            </svg>
          </div>
        </div>
      </Panel>
    </Stage>
  );
};
