import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK, glass } from "../theme";
import { SceneFrame } from "../components/SceneFrame";
import { stagger, drift } from "../lib/anim";
import { SfxCue, SFX } from "../components/Sfx";

// ─────────────────────────────────────────────────────────────────────────────
// HumedadKit — variantes PARAMETRIZABLES de seis componentes de TermiteKit.tsx.
// Mismo look (paleta terrosa/parchment de ./theme, serif EB Garamond, tarjetas de
// papel, diagramas SVG que se dibujan solos) y mismas animaciones (spring de
// entrada + stagger + loops continuos), pero TODO el contenido entra por props.
// Cero contenido quemado, cero Math.random / Date.now → render determinista.
// ─────────────────────────────────────────────────────────────────────────────

const SAGE = COLORS.accent; // verde salvia — la solución / lo bueno
const SEPIA = COLORS.amber; // sepia tabaco — la advertencia templada
const TERRA = COLORS.danger; // terracota apagado — el problema / lo caro
const GREEN = COLORS.good; // verde huerta — lo seguro
const EUCA = COLORS.cold; // eucalipto — acento frío pero terroso

const INK_SOFT = "rgba(42,38,32,0.22)";
const INK_FAINT = "rgba(42,38,32,0.10)";

// Fase 0..1 de un loop de `period` frames (determinista, sin random).
const loopT = (frame: number, period: number, offset = 0) =>
  ((((frame + offset) % period) + period) % period) / period;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// Separador de miles manual: toLocaleString depende del locale del runner.
const fmt = (v: number) => {
  const r = Math.round(v);
  const s = String(Math.abs(r));
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += ".";
    out += s.charAt(i);
  }
  return (r < 0 ? "-" : "") + out;
};

// Paleta rotativa para listas de N ítems (siempre dentro de la marca).
const CYCLE = [SAGE, SEPIA, EUCA, GREEN, TERRA];
const cyc = (i: number) => CYCLE[i % CYCLE.length];

const Eyebrow: React.FC<{ children: React.ReactNode; opacity: number }> = ({
  children,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      textAlign: "center",
      letterSpacing: 6,
      fontSize: 22,
      fontWeight: 800,
      textTransform: "uppercase",
      color: COLORS.textDim,
      opacity,
      zIndex: 4,
    }}
  >
    {children}
  </div>
);

const Caption: React.FC<{ children: React.ReactNode; opacity: number }> = ({
  children,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: -6,
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 30,
      fontWeight: 700,
      color: COLORS.textSoft,
      opacity,
      zIndex: 4,
    }}
  >
    {children}
  </div>
);

const Legend: React.FC<{ col: string; label: string }> = ({ col, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <span
      style={{
        width: 28,
        height: 6,
        borderRadius: 6,
        background: col,
        flexShrink: 0,
      }}
    />
    <span
      style={{
        fontSize: 24,
        fontWeight: 700,
        color: COLORS.text,
        fontFamily: FONT_STACK,
        lineHeight: 1.2,
      }}
    >
      {label}
    </span>
  </div>
);

// Tilde / cruz dibujadas (sin emojis, sin texto quemado).
const Mark: React.FC<{ ok: boolean; col: string; size?: number }> = ({
  ok,
  col,
  size = 22,
}) =>
  ok ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12.5l5 5L20 6.5"
        stroke={col}
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke={col}
        strokeWidth={3.2}
        strokeLinecap="round"
      />
    </svg>
  );

// SFX que no se dispara fuera de la escena (evita colas cortadas).
const Cue: React.FC<{
  at: number;
  dur: number;
  src: string;
  volume?: number;
}> = ({ at, dur, src, volume = 0.4 }) =>
  at >= 0 && at < dur - 2 ? <SfxCue at={at} src={src} volume={volume} /> : null;

// Paso de stagger que se ADAPTA a la duración: todo entra en el primer ~45% de
// la escena, nunca importa cuán corta sea.
const stepFor = (durationInFrames: number, n: number, max = 18, min = 5) => {
  const raw = Math.round((durationInFrames * 0.45) / Math.max(1, n));
  return Math.max(min, Math.min(max, raw));
};

// ── 1) TRES MÉTODOS — tarjetas numeradas con dial que se dibuja ───────────────
export const ThreeMethodsH: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  methods: { title: string; sub: string; note: string }[];
}> = ({ durationInFrames, eyebrow, methods }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.9 } });

  const n = Math.max(1, methods.length);
  const gap = n > 3 ? 30 : 44;
  const cardW = Math.min(430, Math.floor((1760 - gap * (n - 1)) / n));
  const cardH = n > 3 ? 430 : 470;
  const step = stepFor(durationInFrames, n);

  const Dial: React.FC<{ col: string; s: number; i: number }> = ({
    col,
    s,
    i,
  }) => {
    const R = 50;
    const C = 2 * Math.PI * R;
    const orbit = loopT(frame, 190, i * 34) * Math.PI * 2;
    const size = Math.min(126, Math.round(cardW * 0.3));
    return (
      <svg width={size} height={size} viewBox="0 0 126 126">
        <circle
          cx={63}
          cy={63}
          r={R}
          fill="none"
          stroke={INK_FAINT}
          strokeWidth={8}
        />
        <circle
          cx={63}
          cy={63}
          r={R}
          fill="none"
          stroke={col}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - s * 0.78)}
          transform="rotate(-90 63 63)"
          opacity={0.9}
        />
        <circle
          cx={63 + Math.cos(orbit) * R}
          cy={63 + Math.sin(orbit) * R}
          r={6}
          fill={col}
          opacity={s}
        />
        <text
          x={63}
          y={80}
          textAnchor="middle"
          fontSize={46}
          fontWeight={900}
          fill={col}
          fontFamily={FONT_STACK}
          opacity={s}
        >
          {i + 1}
        </text>
      </svg>
    );
  };

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue="amber"
      glowY={44}
      bg="grid"
    >
      <div style={{ fontFamily: FONT_STACK, textAlign: "center" }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: COLORS.textDim,
              marginBottom: 38,
              opacity: enter,
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <div style={{ display: "flex", gap, justifyContent: "center" }}>
          {methods.map((m, i) => {
            const s = stagger(frame, fps, i, step, 8);
            const d = drift(frame, i * 3 + 1, 0.5, 6);
            const col = cyc(i);
            return (
              <div
                key={i}
                style={{
                  ...glass("light"),
                  width: cardW,
                  minHeight: cardH,
                  borderRadius: 28,
                  padding: "34px 28px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  opacity: s,
                  transform: `translateY(${(1 - s) * 56 + d.y}px) scale(${0.93 + s * 0.07})`,
                  border: `1.5px solid ${col}66`,
                  boxShadow: `0 22px 54px rgba(42,38,32,0.20)`,
                }}
              >
                <Dial col={col} s={s} i={i} />
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 900,
                    color: COLORS.text,
                    marginTop: 10,
                    lineHeight: 1.1,
                  }}
                >
                  {m.title}
                </div>
                <div
                  style={{
                    fontSize: 23,
                    fontWeight: 800,
                    color: col,
                    marginTop: 8,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    lineHeight: 1.2,
                  }}
                >
                  {m.sub}
                </div>
                <div
                  style={{
                    width: 70,
                    height: 2,
                    background: INK_SOFT,
                    margin: "18px 0",
                    transform: `scaleX(${clamp01(s * 1.2)})`,
                  }}
                />
                <div
                  style={{
                    fontSize: 25,
                    fontWeight: 600,
                    color: COLORS.textSoft,
                    lineHeight: 1.35,
                  }}
                >
                  {m.note}
                </div>
                <Cue
                  at={8 + i * step}
                  dur={durationInFrames}
                  src={SFX.pop1}
                  volume={0.34}
                />
              </div>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};

// ── 2) GRILLA SÍ/NO — ítems con tilde o cruz, entrada escalonada ──────────────
export const SafetyGridH: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  items: { text: string; ok: boolean }[];
}> = ({ durationInFrames, eyebrow, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.9 } });

  const n = Math.max(1, items.length);
  const cols = n > 4 ? 2 : 1;
  const step = stepFor(durationInFrames, n, 14, 4);
  const d = drift(frame, 2.4, 0.4, 5);

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue="cold"
      glowY={46}
      bg="grid"
    >
      <div style={{ fontFamily: FONT_STACK, position: "relative", width: 1440 }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: COLORS.textDim,
              textAlign: "center",
              marginBottom: 36,
              opacity: enter,
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <div
          style={{
            ...glass("light"),
            borderRadius: 30,
            padding: cols === 2 ? "44px 48px" : "40px 56px",
            display: "grid",
            gridTemplateColumns: cols === 2 ? "1fr 1fr" : "1fr",
            columnGap: 54,
            rowGap: 18,
            opacity: enter,
            transform: `translateY(${(1 - enter) * 34 + d.y}px)`,
            border: `1.5px solid rgba(42,38,32,0.14)`,
            boxShadow: `0 26px 64px rgba(42,38,32,0.20)`,
          }}
        >
          {items.map((it, i) => {
            const s = stagger(frame, fps, i, step, 6);
            const col = it.ok ? GREEN : TERRA;
            // latido lento del recuadro para que nada quede clavado al final
            const beat = 0.82 + 0.18 * (0.5 + 0.5 * Math.cos(loopT(frame, 96, i * 13) * Math.PI * 2));
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  opacity: s,
                  transform: `translateX(${(1 - s) * -26}px)`,
                }}
              >
                <span
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${col}1f`,
                    border: `2px solid ${col}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: `0 0 0 ${(1 - beat) * 8}px ${col}14`,
                  }}
                >
                  <Mark ok={it.ok} col={col} size={24} />
                </span>
                <span
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: COLORS.text,
                    lineHeight: 1.25,
                  }}
                >
                  {it.text}
                </span>
                <Cue
                  at={6 + i * step}
                  dur={durationInFrames}
                  src={it.ok ? SFX.pop2 : SFX.pop3}
                  volume={0.3}
                />
              </div>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};

// ── 3) COMPARACIÓN SELECTIVA — dos paneles, bueno vs malo ────────────────────
export const SelectiveCompareH: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  good: { title: string; sub: string };
  bad: { title: string; sub: string };
}> = ({ durationInFrames, eyebrow, good, bad }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.8 } });
  const lDelay = 6;
  const rDelay = Math.max(12, Math.min(22, Math.round(durationInFrames * 0.12)));
  const lIn = spring({ frame: frame - lDelay, fps, config: { damping: 18, mass: 0.8 } });
  const rIn = spring({ frame: frame - rDelay, fps, config: { damping: 18, mass: 0.8 } });

  const Panel: React.FC<{
    inn: number;
    side: number;
    title: string;
    sub: string;
    col: string;
    ok: boolean;
  }> = ({ inn, side, title, sub, col, ok }) => {
    const d = drift(frame, side * 4 + 2, 0.5, 7);
    const R = 46;
    const C = 2 * Math.PI * R;
    return (
      <div
        style={{
          ...glass("light"),
          width: 620,
          padding: "46px 40px",
          borderRadius: 30,
          textAlign: "center",
          opacity: inn,
          transform: `translateY(${(1 - inn) * 50 + d.y}px) scale(${0.94 + inn * 0.06})`,
          border: `1.5px solid ${col}66`,
          boxShadow: `0 26px 68px rgba(42,38,32,0.20)`,
        }}
      >
        <svg width={112} height={112} viewBox="0 0 112 112">
          <circle cx={56} cy={56} r={R} fill={`${col}14`} stroke={INK_FAINT} strokeWidth={5} />
          <circle
            cx={56}
            cy={56}
            r={R}
            fill="none"
            stroke={col}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - inn)}
            transform="rotate(-90 56 56)"
          />
          <g transform="translate(34 34) scale(1.85)" opacity={inn}>
            <Mark ok={ok} col={col} size={24} />
          </g>
        </svg>
        <div
          style={{
            fontSize: 46,
            fontWeight: 900,
            color: COLORS.text,
            marginTop: 12,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: COLORS.textSoft,
            marginTop: 14,
            lineHeight: 1.35,
          }}
        >
          {sub}
        </div>
        <div
          style={{
            marginTop: 28,
            height: 8,
            borderRadius: 8,
            background: INK_FAINT,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${clamp01(inn) * 100}%`,
              background: col,
              borderRadius: 8,
            }}
          />
        </div>
      </div>
    );
  };

  const pulse = 0.5 + 0.5 * Math.cos(loopT(frame, 120) * Math.PI * 2);

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue="amber"
      glowY={46}
      bg="grid"
    >
      <div style={{ position: "relative", width: 1520, fontFamily: FONT_STACK }}>
        {eyebrow ? <Eyebrow opacity={enter}>{eyebrow}</Eyebrow> : null}
        <div
          style={{
            display: "flex",
            gap: 44,
            justifyContent: "center",
            alignItems: "center",
            marginTop: eyebrow ? 62 : 0,
          }}
        >
          <Panel inn={lIn} side={0} title={good.title} sub={good.sub} col={SAGE} ok />
          <div
            style={{
              width: 2,
              alignSelf: "stretch",
              background: INK_SOFT,
              position: "relative",
              opacity: enter,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: -7,
                top: "50%",
                width: 16,
                height: 16,
                marginTop: -8,
                background: COLORS.bg0,
                border: `2px solid ${COLORS.textDim}`,
                transform: `rotate(45deg) scale(${0.85 + pulse * 0.25})`,
              }}
            />
          </div>
          <Panel inn={rIn} side={1} title={bad.title} sub={bad.sub} col={TERRA} ok={false} />
        </div>
        <Cue at={lDelay} dur={durationInFrames} src={SFX.ui2} />
        <Cue at={rDelay} dur={durationInFrames} src={SFX.ui5} />
      </div>
    </SceneFrame>
  );
};

// ── 4) COSTO ACUMULADO — el consumible que sube vs el gasto único plano ───────
// La lectura visual es la TIJERA que se abre entre las dos series.
export const CostCumulativeH: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  years?: number;
  aLabel: string;
  aPerYear: number;
  bLabel: string;
  bOnce: number;
}> = ({
  durationInFrames,
  eyebrow,
  years = 5,
  aLabel,
  aPerYear,
  bLabel,
  bOnce,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22, mass: 0.9 } });

  const YRS = Math.max(1, Math.round(years));
  const BOX_W = 1700;
  const BOX_H = 800;
  const padL = 120;
  const padR = 560; // el panel de cifras vive a la derecha del plot
  const padT = 110;
  const padB = 110;
  const plotW = BOX_W - padL - padR;
  const plotH = BOX_H - padT - padB;

  const aTotal = Math.max(0, aPerYear) * YRS;
  const maxV = Math.max(aTotal, Math.max(0, bOnce), 1) * 1.14;
  const X = (t: number) => padL + (t / YRS) * plotW;
  const Y = (v: number) => padT + plotH - (v / maxV) * plotH;

  // Avance del dibujo: termina al ~72% de la escena, deja aire para leer.
  const prog = interpolate(frame, [10, Math.max(24, durationInFrames * 0.72)], [0, YRS], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Serie A: recta que acumula aPerYear por año.
  const aAt = (t: number) => Math.max(0, aPerYear) * t;
  const bV = Math.max(0, bOnce);

  // Cruce: desde ahí se abre la tijera.
  const cross = aPerYear > 0 ? bV / aPerYear : YRS + 1;
  const showGap = prog > cross && cross <= YRS;

  const gapPath = showGap
    ? `M ${X(cross)} ${Y(bV)} L ${X(prog)} ${Y(aAt(prog))} L ${X(prog)} ${Y(bV)} Z`
    : "";

  const ticks = Array.from({ length: YRS + 1 }).map((_, i) => i);
  const tickStep = YRS > 10 ? 2 : 1;

  const endPulse = loopT(frame, 54);
  const sideDrift = drift(frame, 5.1, 0.4, 5);

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue="red"
      glowY={42}
      bg="grid"
    >
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <Cue at={0} dur={durationInFrames} src={SFX.whoosh} />
        {eyebrow ? <Eyebrow opacity={enter}>{eyebrow}</Eyebrow> : null}

        <svg
          viewBox={`0 0 ${BOX_W} ${BOX_H}`}
          width={BOX_W}
          height={BOX_H}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          {/* grilla horizontal tenue */}
          {[0.25, 0.5, 0.75, 1].map((g, i) => (
            <line
              key={"g" + i}
              x1={padL}
              x2={padL + plotW}
              y1={padT + plotH * (1 - g)}
              y2={padT + plotH * (1 - g)}
              stroke={INK_FAINT}
              strokeWidth={1.5}
              opacity={enter}
            />
          ))}

          {/* ejes */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={INK_SOFT} strokeWidth={2.4} opacity={enter} />
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={INK_SOFT} strokeWidth={2.4} opacity={enter} />
          {ticks.map((t) =>
            t % tickStep === 0 ? (
              <text
                key={"t" + t}
                x={X(t)}
                y={padT + plotH + 40}
                textAnchor="middle"
                fontSize={22}
                fontWeight={700}
                fill={COLORS.textDim}
                fontFamily={FONT_STACK}
                opacity={enter}
              >
                {t}
              </text>
            ) : null,
          )}

          {/* la TIJERA: el área entre las dos series */}
          {showGap ? (
            <path
              d={gapPath}
              fill={TERRA}
              opacity={0.12 + 0.05 * (0.5 + 0.5 * Math.cos(loopT(frame, 110) * Math.PI * 2))}
            />
          ) : null}

          {/* B: gasto único → línea plana */}
          <line
            x1={X(0)}
            y1={Y(bV)}
            x2={X(prog)}
            y2={Y(bV)}
            stroke={SAGE}
            strokeWidth={7}
            strokeLinecap="round"
          />
          <circle cx={X(0)} cy={Y(bV)} r={10} fill={SAGE} opacity={enter} />

          {/* A: consumible → recta que se acumula, con hito por año */}
          <path
            d={`M ${X(0)} ${Y(0)} L ${X(prog)} ${Y(aAt(prog))}`}
            fill="none"
            stroke={TERRA}
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {ticks.map((t) =>
            t > 0 && t <= prog ? (
              <circle key={"m" + t} cx={X(t)} cy={Y(aAt(t))} r={8} fill={TERRA} />
            ) : null,
          )}
          {/* punta viva: anillo que late aunque el dibujo ya terminó */}
          <circle
            cx={X(prog)}
            cy={Y(aAt(prog))}
            r={12 + endPulse * 24}
            fill="none"
            stroke={TERRA}
            strokeWidth={2.5}
            opacity={(1 - endPulse) * 0.7}
          />
        </svg>

        {/* leyenda bajo el plot */}
        <div
          style={{
            position: "absolute",
            left: padL + 8,
            top: padT + 8,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            opacity: enter,
            maxWidth: plotW - 40,
          }}
        >
          <Legend col={TERRA} label={aLabel} />
          <Legend col={SAGE} label={bLabel} />
        </div>

        {/* panel de cifras */}
        <div
          style={{
            position: "absolute",
            right: 10,
            top: padT + 20,
            width: 480,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            opacity: enter,
            transform: `translateY(${sideDrift.y}px)`,
          }}
        >
          {[
            { col: TERRA, label: aLabel, val: aAt(prog) },
            { col: SAGE, label: bLabel, val: bV },
          ].map((row, i) => (
            <div
              key={i}
              style={{
                ...glass("light"),
                padding: "22px 28px",
                borderRadius: 24,
                border: `1.5px solid ${row.col}55`,
                boxShadow: `0 20px 48px rgba(42,38,32,0.18)`,
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  color: row.col,
                  lineHeight: 1.05,
                }}
              >
                {fmt(row.val)}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLORS.textSoft,
                  marginTop: 4,
                  lineHeight: 1.25,
                }}
              >
                {row.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SceneFrame>
  );
};

// ── 5) INSPECCIÓN DE LA CASA — corte esquemático con zonas en (x,y) % ─────────
export const HouseInspectionH: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  caption?: string;
  zones: { label: string; x: number; y: number; hot: boolean }[];
}> = ({ durationInFrames, eyebrow, caption, zones }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.9 } });

  const BOX_W = 1720;
  const BOX_H = 800;
  // rectángulo útil del corte de casa: las (x,y) porcentuales mapean acá adentro
  const hx = 520;
  const hy = 150;
  const hw = 1140;
  const hh = 520;

  const n = Math.max(1, zones.length);
  const step = stepFor(durationInFrames, n, 22, 8);
  const colOf = (z: { hot: boolean }, i: number) =>
    z.hot ? (i % 2 === 0 ? TERRA : SEPIA) : i % 2 === 0 ? GREEN : EUCA;

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue="cold"
      glowX={62}
      glowY={44}
      bg="grid"
    >
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <Cue at={0} dur={durationInFrames} src={SFX.ui4} />
        {eyebrow ? <Eyebrow opacity={enter}>{eyebrow}</Eyebrow> : null}

        <svg
          viewBox={`0 0 ${BOX_W} ${BOX_H}`}
          width={BOX_W}
          height={BOX_H}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          {/* terreno */}
          <rect x={hx - 90} y={hy + hh} width={hw + 180} height={110} fill="rgba(169,121,74,0.16)" opacity={enter} />
          <line x1={hx - 90} y1={hy + hh} x2={hx + hw + 90} y2={hy + hh} stroke={`${SEPIA}88`} strokeWidth={3} opacity={enter} />
          {/* rayado del suelo */}
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={"s" + i}
              x1={hx - 70 + i * ((hw + 140) / 16)}
              y1={hy + hh + 12}
              x2={hx - 100 + i * ((hw + 140) / 16)}
              y2={hy + hh + 92}
              stroke="rgba(42,38,32,0.10)"
              strokeWidth={2}
              opacity={enter}
            />
          ))}

          <g opacity={enter}>
            {/* cuerpo */}
            <rect
              x={hx}
              y={hy + hh * 0.34}
              width={hw}
              height={hh * 0.66}
              fill="rgba(239,231,211,0.72)"
              stroke="rgba(42,38,32,0.42)"
              strokeWidth={3}
            />
            {/* techo a dos aguas */}
            <path
              d={`M ${hx - 60} ${hy + hh * 0.34} L ${hx + hw / 2} ${hy} L ${hx + hw + 60} ${hy + hh * 0.34} Z`}
              fill="rgba(169,121,74,0.18)"
              stroke="rgba(42,38,32,0.42)"
              strokeWidth={3}
            />
            {/* entrepiso */}
            <line x1={hx} y1={hy + hh * 0.66} x2={hx + hw} y2={hy + hh * 0.66} stroke="rgba(42,38,32,0.28)" strokeWidth={5} />
            {/* montantes */}
            {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
              <line
                key={"v" + i}
                x1={hx + hw * p}
                y1={hy + hh * 0.34}
                x2={hx + hw * p}
                y2={hy + hh}
                stroke="rgba(42,38,32,0.12)"
                strokeWidth={6}
              />
            ))}
            {/* cabios del techo */}
            {[0.28, 0.5, 0.72].map((p, i) => (
              <line
                key={"r" + i}
                x1={hx + hw * p}
                y1={hy + hh * 0.34}
                x2={hx + hw / 2}
                y2={hy + hh * 0.06}
                stroke="rgba(42,38,32,0.12)"
                strokeWidth={4}
              />
            ))}
            {/* puerta y ventana */}
            <rect x={hx + hw * 0.46} y={hy + hh * 0.74} width={110} height={hh * 0.26} fill="rgba(42,38,32,0.10)" stroke="rgba(42,38,32,0.34)" strokeWidth={3} />
            <rect x={hx + hw * 0.14} y={hy + hh * 0.44} width={130} height={100} fill="rgba(111,132,120,0.16)" stroke="rgba(42,38,32,0.34)" strokeWidth={3} />
            <line x1={hx + hw * 0.14 + 65} y1={hy + hh * 0.44} x2={hx + hw * 0.14 + 65} y2={hy + hh * 0.44 + 100} stroke="rgba(42,38,32,0.28)" strokeWidth={2} />
            {/* cimiento */}
            <rect x={hx - 26} y={hy + hh - 6} width={hw + 52} height={26} fill="rgba(42,38,32,0.14)" stroke="rgba(42,38,32,0.30)" strokeWidth={2} />
          </g>

          {/* zonas marcadas */}
          {zones.map((z, i) => {
            const s = spring({
              frame: frame - (16 + i * step),
              fps,
              config: { damping: 16, mass: 0.7 },
            });
            const col = colOf(z, i);
            const pulse = loopT(frame, z.hot ? 42 : 70, i * 11);
            const px = hx + clamp01(z.x) * hw;
            const py = hy + clamp01(z.y) * hh;
            return (
              <g key={i} opacity={s}>
                <circle
                  cx={px}
                  cy={py}
                  r={24 + pulse * (z.hot ? 52 : 30)}
                  fill="none"
                  stroke={col}
                  strokeWidth={3}
                  opacity={(1 - pulse) * (z.hot ? 0.95 : 0.6)}
                />
                <circle cx={px} cy={py} r={22} fill={`${col}2e`} stroke={col} strokeWidth={3.4} />
                <text
                  x={px}
                  y={py + 8}
                  textAnchor="middle"
                  fontSize={26}
                  fontWeight={900}
                  fill={col}
                  fontFamily={FONT_STACK}
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>

        {/* lista lateral */}
        <div
          style={{
            position: "absolute",
            left: 24,
            top: 96,
            width: 460,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {zones.map((z, i) => {
            const s = spring({
              frame: frame - (20 + i * step),
              fps,
              config: { damping: 18, mass: 0.8 },
            });
            const col = colOf(z, i);
            return (
              <div
                key={i}
                style={{
                  ...glass("light"),
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 18px",
                  borderRadius: 18,
                  opacity: s,
                  transform: `translateX(${(1 - s) * -30}px)`,
                  border: `1.5px solid ${col}55`,
                  boxShadow: `0 14px 34px rgba(42,38,32,0.16)`,
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: `${col}22`,
                    border: `2px solid ${col}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 900,
                    color: col,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: 25, fontWeight: 700, color: COLORS.text, lineHeight: 1.25 }}>
                  {z.label}
                </span>
                <Cue at={20 + i * step} dur={durationInFrames} src={SFX.pop2} volume={0.3} />
              </div>
            );
          })}
        </div>

        {caption ? <Caption opacity={enter}>{caption}</Caption> : null}
      </div>
    </SceneFrame>
  );
};

// ── 6) MAPA CON PINES — globo DIBUJADO (sin imagen externa) ──────────────────
export const WorldMapPinsH: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  caption?: string;
  pins: { label: string; sub: string; x: number; y: number }[];
}> = ({ durationInFrames, eyebrow, caption, pins }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.9 } });

  const BOX_W = 1560;
  const BOX_H = 780;
  const cx = BOX_W * 0.5;
  const cy = BOX_H * 0.52;
  const R = 300;

  const n = Math.max(1, pins.length);
  const step = stepFor(durationInFrames, n, 20, 7);

  return (
    <SceneFrame
      durationInFrames={durationInFrames}
      hue="cold"
      glowY={48}
      bg="grid"
    >
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT_STACK }}>
        <Cue at={0} dur={durationInFrames} src={SFX.whoosh} />
        {eyebrow ? <Eyebrow opacity={enter}>{eyebrow}</Eyebrow> : null}

        <svg
          viewBox={`0 0 ${BOX_W} ${BOX_H}`}
          width={BOX_W}
          height={BOX_H}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          {/* esfera */}
          <circle cx={cx} cy={cy} r={R} fill="rgba(111,132,120,0.10)" stroke="rgba(42,38,32,0.28)" strokeWidth={2.4} opacity={enter} />
          {/* paralelos */}
          {[-0.62, -0.32, 0, 0.32, 0.62].map((p, i) => (
            <ellipse
              key={"lat" + i}
              cx={cx}
              cy={cy + p * R}
              rx={R * Math.cos(Math.asin(p))}
              ry={R * 0.14}
              fill="none"
              stroke="rgba(42,38,32,0.16)"
              strokeWidth={1.4}
              opacity={enter}
            />
          ))}
          {/* meridianos girando lento (movimiento constante, sin temblor) */}
          {[0, 1, 2, 3].map((i) => {
            const rot = (i / 4) * Math.PI + frame / 300;
            return (
              <ellipse
                key={"lon" + i}
                cx={cx}
                cy={cy}
                rx={Math.abs(R * Math.cos(rot)) + 1}
                ry={R}
                fill="none"
                stroke="rgba(42,38,32,0.14)"
                strokeWidth={1.4}
                opacity={enter}
              />
            );
          })}
          {/* textura de tierra: puntos en espiral áurea (determinista) */}
          {Array.from({ length: 150 }).map((_, i) => {
            const a = (i * 137.5 * Math.PI) / 180;
            const rr = Math.sqrt((i % 50) / 50) * R * 0.94;
            const px = cx + Math.cos(a) * rr;
            const py = cy + Math.sin(a) * rr;
            const tw = 0.5 + 0.5 * Math.cos(loopT(frame, 150, i * 7) * Math.PI * 2);
            return (
              <circle
                key={"d" + i}
                cx={px}
                cy={py}
                r={2.2}
                fill={i % 5 === 0 ? `${SAGE}` : "rgba(42,38,32,0.22)"}
                opacity={enter * (0.5 + tw * 0.4)}
              />
            );
          })}
          {/* terminador suave para dar volumen */}
          <circle cx={cx} cy={cy} r={R} fill="url(#humGlobeShade)" opacity={enter * 0.55} />
          <defs>
            <radialGradient id="humGlobeShade" cx="34%" cy="30%" r="78%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#2A2620" stopOpacity={0.16} />
            </radialGradient>
          </defs>
        </svg>

        {/* pines */}
        {pins.map((p, i) => {
          const s = stagger(frame, fps, i, step, 12);
          const px = cx + (clamp01(p.x) - 0.5) * 2 * R * 0.82;
          const py = cy + (clamp01(p.y) - 0.5) * 2 * R * 0.82;
          const bob = Math.cos(loopT(frame, 108, i * 17) * Math.PI * 2) * 5;
          const col = i % 2 === 0 ? SAGE : SEPIA;
          return (
            <div key={i}>
              <div
                style={{
                  position: "absolute",
                  left: px,
                  top: py + bob - 86,
                  transform: `translate(-50%, 0) scale(${0.72 + s * 0.28})`,
                  opacity: s,
                  transformOrigin: "bottom center",
                  zIndex: 5,
                }}
              >
                <div
                  style={{
                    ...glass("light"),
                    padding: "10px 20px",
                    borderRadius: 16,
                    textAlign: "center",
                    border: `1.5px solid ${col}88`,
                    whiteSpace: "nowrap",
                    boxShadow: `0 14px 34px rgba(42,38,32,0.24)`,
                  }}
                >
                  <div style={{ fontSize: 30, fontWeight: 900, color: COLORS.text, lineHeight: 1.15 }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: col, lineHeight: 1.2 }}>
                    {p.sub}
                  </div>
                </div>
                <div
                  style={{
                    width: 0,
                    height: 0,
                    margin: "0 auto",
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderTop: `14px solid ${col}`,
                  }}
                />
              </div>
              {/* chinche sobre el globo */}
              <div
                style={{
                  position: "absolute",
                  left: px,
                  top: py,
                  width: 16,
                  height: 16,
                  marginLeft: -8,
                  marginTop: -8,
                  borderRadius: 99,
                  background: col,
                  opacity: s,
                  transform: `scale(${0.8 + 0.3 * (0.5 + 0.5 * Math.cos(loopT(frame, 96, i * 21) * Math.PI * 2))})`,
                  zIndex: 4,
                }}
              />
              <Cue at={12 + i * step} dur={durationInFrames} src={SFX.pop1} volume={0.34} />
            </div>
          );
        })}

        {caption ? <Caption opacity={enter}>{caption}</Caption> : null}
      </div>
    </SceneFrame>
  );
};
