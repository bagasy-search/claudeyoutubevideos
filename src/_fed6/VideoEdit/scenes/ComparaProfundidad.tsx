import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const INTER = loadInter().fontFamily;

// ═══════════════════════════════════════════════════════════════════════════
// ComparaProfundidad — la comparación con CUERPO del canal (_fed6).
// Reemplaza al gráfico de barras plano: acá cada magnitud es una PLACA que
// sale del piso, con cara frontal, cara lateral en sombra y tapa superior
// (falso 3D por skew + gradientes), reflejo tenue en el piso y una foto de
// fondo desenfocada con Ken-Burns lentísimo.
//
// Capas (de atrás hacia adelante):
//   L1 FOTO     imagen a pantalla completa, blur fuerte + oscurecida, con
//               Ken-Burns de deriva mínima (o degradé si no hay foto)
//   L2 GRADO    scrim vertical teal-profundo que hunde la foto
//   L3 REJILLA  líneas guía tenues con parallax MÁS LENTO que la foto
//   L4 PISO     línea de horizonte + placa de luz bajo la ganadora
//   L5 COLUMNAS crecen desde abajo con rebote, escalonadas
//   L6 HALO     resplandor + destello de la ganadora al aterrizar
//   L7 TIPO     valor arriba, etiqueta (máx. 2 líneas) y nota abajo
//   L8 CABEZAL  título con filete de acento + unidad
//   L9 LENTE    viñeta que respira
//
// DETERMINISTA: cero Math.random / Date.now. Todo sale de `frame`.
// Todos los tiempos son FRACCIONES de durationInFrames.
// ═══════════════════════════════════════════════════════════════════════════

const CANVAS_W = 1920;
const CANVAS_H = 1080;
const SAFE = 110; // margen seguro (> 90 px exigidos)
const FLOOR_Y = 800; // línea de piso donde apoyan las columnas
const PLOT_TOP = 392; // techo de la columna más alta (deja aire para el valor)
const PLOT_H = FLOOR_Y - PLOT_TOP;
const MIN_FRAC = 0.055; // piso mínimo: un valor 0 igual se ve como placa fina

const BG = "#0E1D23";
const TEAL = "#12B3AE";
const TEAL_LIGHT = "#3FE0D6";
const CREAM = "#F3ECDD";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type ToneName = "teal" | "warn" | "danger";

type Skin = {
  light: string;
  base: string;
  dark: string;
  edge: string;
  glow: string;
};

const SKINS: Record<ToneName, Skin> = {
  teal: {
    light: TEAL_LIGHT,
    base: TEAL,
    dark: "#0A6F6D",
    edge: "#7DF3EB",
    glow: "rgba(63,224,214,0.55)",
  },
  warn: {
    light: "#F3D6A2",
    base: "#E8B96B",
    dark: "#9C7233",
    edge: "#FFE9C2",
    glow: "rgba(232,185,107,0.52)",
  },
  danger: {
    light: "#F0836F",
    base: "#E0523E",
    dark: "#8E2E1E",
    edge: "#FFAB99",
    glow: "rgba(224,82,62,0.50)",
  },
};

// columna apagada (todo lo que no es la ganadora)
const MUTED: Skin = {
  light: "#8CA1A8",
  base: "#5D7278",
  dark: "#2C4046",
  edge: "#AEC0C5",
  glow: "rgba(140,161,168,0.28)",
};

// ── formateo de números en castellano (miles con ".", decimal con ",") ──────
const groupThousands = (s: string): string =>
  s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const fmtNumber = (n: number): string => {
  if (!isFinite(n)) return "0";
  const neg = n < 0;
  const a = Math.abs(n);
  let out: string;
  if (a > 0 && a < 100 && Math.abs(a - Math.round(a)) > 0.049) {
    const fixed = a.toFixed(1);
    const parts = fixed.split(".");
    out = groupThousands(parts[0]) + "," + parts[1];
  } else {
    out = groupThousands(String(Math.round(a)));
  }
  return neg ? "−" + out : out;
};

// ── etiqueta en DOS líneas como mucho, partida por palabras ────────────────
const splitLabel = (raw: string): string[] => {
  const text = (raw || "").trim();
  if (!text) return [];
  const words = text.split(/\s+/);
  if (words.length === 1) return [text];
  // busca el corte que deje las dos líneas más parejas
  let best = 1;
  let bestDiff = Number.MAX_VALUE;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const b = words.slice(i).join(" ").length;
    const diff = Math.abs(a - b);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  const l1 = words.slice(0, best).join(" ");
  const l2 = words.slice(best).join(" ");
  return l2 ? [l1, l2] : [l1];
};

// ── L1 · foto de fondo con Ken-Burns lentísimo (o degradé si no hay foto) ───
const Backdrop: React.FC<{ src: string | null; t: number }> = ({ src, t }) => {
  const ease = Easing.inOut(Easing.quad)(t);
  const scale = 1.1 + ease * 0.085;
  const dx = interpolate(ease, [0, 1], [-16, 14]);
  const dy = interpolate(ease, [0, 1], [10, -12]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: BG }}>
      {src ? (
        <AbsoluteFill
          style={{
            transform: `scale(${scale}) translate(${dx}px, ${dy}px)`,
            filter: "blur(30px) brightness(0.40) saturate(0.72)",
          }}
        >
          <Img
            src={src}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            transform: `scale(${scale}) translate(${dx}px, ${dy}px)`,
            background:
              "radial-gradient(120% 90% at 28% 18%, #17414A 0%, #0E1D23 58%, #08151A 100%)",
          }}
        />
      )}
      {/* L2 · grado: hunde la cama y unifica el color */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,24,29,0.86) 0%, rgba(10,32,38,0.50) 34%, rgba(6,20,25,0.78) 72%, rgba(4,14,18,0.94) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(78% 62% at 50% 62%, rgba(18,179,174,0.16) 0%, rgba(0,0,0,0) 68%)",
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

// ── L3 · rejilla de líneas guía, parallax MÁS LENTO que la foto ────────────
const GuideGrid: React.FC<{ t: number; appear: number }> = ({ t, appear }) => {
  const ease = Easing.inOut(Easing.sin)(t);
  const gy = interpolate(ease, [0, 1], [0, -26]);
  const gx = interpolate(ease, [0, 1], [0, 18]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: appear * 0.5 }}>
      <AbsoluteFill
        style={{
          transform: `translate(${gx}px, ${gy}px)`,
          background:
            "repeating-linear-gradient(180deg, rgba(243,236,221,0.075) 0px, rgba(243,236,221,0.075) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 92px)",
        }}
      />
      <AbsoluteFill
        style={{
          transform: `translate(${gx * 1.6}px, ${gy * 0.4}px)`,
          background:
            "repeating-linear-gradient(90deg, rgba(243,236,221,0.05) 0px, rgba(243,236,221,0.05) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 154px)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ── L5/L6/L7 · una columna en perspectiva ──────────────────────────────────
type ColumnProps = {
  frame: number;
  left: number;
  width: number;
  depth: number;
  height: number;
  grow: number;
  skin: Skin;
  winner: boolean;
  valueText: string;
  label: string;
  note?: string;
  landAt: number;
  pulseLen: number;
  fadeIn: number;
  dim: number;
};

const Column: React.FC<ColumnProps> = ({
  frame,
  left,
  width,
  depth,
  height,
  grow,
  skin,
  winner,
  valueText,
  label,
  note,
  landAt,
  pulseLen,
  fadeIn,
  dim,
}) => {
  const capH = depth * 0.344; // altura aparente de la tapa (rima con el skew lateral)
  const top = FLOOR_Y - height;
  const lines = splitLabel(label);

  // destello al terminar de crecer (sólo la ganadora)
  const flashWin = Math.max(6, pulseLen * 0.7);
  const flash = winner
    ? interpolate(
        frame,
        [landAt - flashWin * 0.15, landAt + flashWin * 0.22, landAt + flashWin],
        [0, 1, 0],
        { ...CLAMP, easing: Easing.out(Easing.quad) }
      )
    : 0;

  // barrido especular que sube por la cara frontal mientras crece
  const sweep = interpolate(grow, [0.15, 1], [1.15, -0.18], CLAMP);

  // respiración del halo una vez aterrizada
  const breathe = 0.72 + 0.28 * Math.sin((frame - landAt) / 26);
  const halo = winner
    ? interpolate(frame, [landAt - flashWin, landAt + flashWin * 0.6], [0, 1], CLAMP) *
      breathe
    : 0;

  const solidW = width + depth;

  return (
    <>
      {/* L6 · halo suave detrás de la ganadora */}
      {winner && halo > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: left - width * 0.55,
            top: top - capH - width * 0.5,
            width: solidW + width * 1.1,
            height: height + capH + width * 0.9,
            background: `radial-gradient(50% 50% at 50% 62%, ${skin.glow} 0%, rgba(0,0,0,0) 70%)`,
            filter: "blur(34px)",
            opacity: halo * 0.55,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      ) : null}

      {/* L4 · placa de luz de contacto en el piso */}
      <div
        style={{
          position: "absolute",
          left: left - width * 0.22,
          top: FLOOR_Y - 16,
          width: solidW + width * 0.44,
          height: 44,
          borderRadius: "50%",
          background: winner
            ? `radial-gradient(50% 50% at 50% 50%, ${skin.glow} 0%, rgba(0,0,0,0) 72%)`
            : "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 72%)",
          filter: "blur(9px)",
          opacity: grow * (winner ? 0.85 : 0.6),
        }}
      />

      {/* L5 · el sólido */}
      <div
        style={{
          position: "absolute",
          left,
          top,
          width,
          height,
          opacity: dim,
        }}
      >
        {/* tapa superior */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: -capH,
            width,
            height: capH,
            transform: "skewX(-71deg)",
            transformOrigin: "0% 100%",
            background: `linear-gradient(90deg, ${skin.light} 0%, ${skin.edge} 55%, ${skin.light} 100%)`,
            opacity: 0.96,
          }}
        />
        {/* cara lateral en sombra */}
        <div
          style={{
            position: "absolute",
            left: width,
            top: 0,
            width: depth,
            height,
            transform: "skewY(-19deg)",
            transformOrigin: "0% 100%",
            background: `linear-gradient(180deg, ${skin.dark} 0%, rgba(6,20,25,0.96) 100%)`,
          }}
        />
        {/* cara frontal */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            background: `linear-gradient(180deg, ${skin.light} 0%, ${skin.base} 42%, ${skin.dark} 100%)`,
            boxShadow: winner
              ? `0 26px 60px rgba(0,0,0,0.55), inset 0 0 0 1px ${skin.edge}55`
              : "0 22px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(243,236,221,0.10)",
          }}
        >
          {/* filo de luz izquierdo */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: Math.max(3, width * 0.035),
              background: `linear-gradient(180deg, ${skin.edge} 0%, rgba(255,255,255,0) 88%)`,
              opacity: 0.55,
            }}
          />
          {/* barrido especular que acompaña el crecimiento */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${sweep * 100}%`,
              height: Math.max(26, height * 0.16),
              background:
                "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0) 100%)",
              opacity: grow < 0.99 ? 0.75 : 0,
              mixBlendMode: "screen",
            }}
          />
          {/* destello de aterrizaje */}
          {flash > 0.01 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.12) 100%)",
                opacity: flash * 0.7,
                mixBlendMode: "screen",
              }}
            />
          ) : null}
        </div>
      </div>

      {/* reflejo tenue en el piso */}
      <div
        style={{
          position: "absolute",
          left,
          top: FLOOR_Y,
          width: solidW,
          height: Math.min(96, Math.max(16, height * 0.34)),
          background: `linear-gradient(180deg, ${skin.base} 0%, rgba(0,0,0,0) 100%)`,
          opacity: grow * (winner ? 0.2 : 0.12) * dim,
          filter: "blur(7px)",
          transform: "scaleY(-1)",
          transformOrigin: "top center",
          pointerEvents: "none",
        }}
      />

      {/* L7 · valor encima de la columna */}
      <div
        style={{
          position: "absolute",
          left: left - width * 0.4,
          top: top - capH - 104,
          width: solidW + width * 0.8,
          textAlign: "center",
          fontFamily: INTER,
          fontSize: 82,
          fontWeight: 900,
          letterSpacing: -2,
          lineHeight: 1,
          color: winner ? skin.edge : "rgba(243,236,221,0.80)",
          textShadow: winner
            ? `0 0 34px ${skin.glow}, 0 10px 26px rgba(0,0,0,0.65)`
            : "0 8px 22px rgba(0,0,0,0.6)",
          opacity: fadeIn,
          transform: `translateY(${(1 - fadeIn) * 16}px)`,
        }}
      >
        {valueText}
      </div>

      {/* L7 · etiqueta (máx. 2 líneas) + nota chica */}
      <div
        style={{
          position: "absolute",
          left: left - width * 0.3,
          top: FLOOR_Y + 40,
          width: solidW + width * 0.6,
          textAlign: "center",
          fontFamily: INTER,
          opacity: fadeIn,
          transform: `translateY(${(1 - fadeIn) * 12}px)`,
        }}
      >
        {lines.map((ln, i) => (
          <div
            key={i}
            style={{
              fontSize: 34,
              fontWeight: 800,
              lineHeight: 1.18,
              letterSpacing: -0.3,
              color: winner ? CREAM : "rgba(243,236,221,0.66)",
              textShadow: "0 6px 20px rgba(0,0,0,0.7)",
            }}
          >
            {ln}
          </div>
        ))}
        {note ? (
          <div
            style={{
              marginTop: 10,
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.2,
              color: "rgba(243,236,221,0.40)",
              textShadow: "0 4px 14px rgba(0,0,0,0.7)",
            }}
          >
            {note}
          </div>
        ) : null}
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════

export const ComparaProfundidad: React.FC<{
  durationInFrames: number;
  title?: string;
  unit?: string;
  image?: string;
  bars?: {
    label: string;
    value: number;
    note?: string;
    winner?: boolean;
    tone?: "teal" | "warn" | "danger";
  }[];
}> = ({ durationInFrames, title, unit, image, bars = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const D = Math.max(1, durationInFrames);
  const t = interpolate(frame, [0, D], [0, 1], CLAMP); // progreso 0→1 de la escena

  // NUNCA staticFile(undefined): sin foto → degradé
  const src =
    image && image.length > 0
      ? /^(https?:)?\/\//.test(image) || image.indexOf("data:") === 0
        ? image
        : staticFile(image)
      : null;

  // ── cabezal ──────────────────────────────────────────────────────────────
  const headIn = spring({
    frame,
    fps,
    config: { damping: 200, mass: 0.7 },
    durationInFrames: Math.max(8, Math.round(D * 0.12)),
  });
  const rule = interpolate(headIn, [0, 1], [0, 1], CLAMP);

  const list = (bars || []).slice(0, 4);
  const n = list.length;

  // ── tiempos SIEMPRE como fracción de la duración ─────────────────────────
  const start = D * 0.13;
  const stagger =
    n > 1 ? Math.min(D * 0.12, (D * 0.56 - start) / (n - 1)) : 0;
  const growLen = Math.max(10, Math.round(D * 0.2));

  // ── normalización ────────────────────────────────────────────────────────
  const vals = list.map((b) =>
    isFinite(b.value) ? Math.max(0, b.value) : 0
  );
  const maxV = vals.length ? Math.max(...vals) : 0;
  const positives = vals.filter((v) => v > 0);
  const minPos = positives.length ? Math.min(...positives) : 0;
  const ratio = minPos > 0 ? maxV / minPos : 1;
  // valores muy dispares (1 vs 30, 9 vs 300): escala RAÍZ para que la chica
  // siga siendo legible — el rótulo igual muestra el valor REAL.
  const compress = ratio > 8;
  const normalize = (v: number): number => {
    if (maxV <= 0) return 0;
    return compress ? Math.sqrt(v) / Math.sqrt(maxV) : v / maxV;
  };

  // ganadora: la marcada; si nadie está marcado, la de mayor valor
  let winnerIdx = -1;
  for (let i = 0; i < list.length; i++) {
    if (list[i].winner) {
      winnerIdx = i;
      break;
    }
  }
  if (winnerIdx < 0 && n > 0 && maxV > 0) {
    let bi = 0;
    for (let i = 1; i < vals.length; i++) if (vals[i] > vals[bi]) bi = i;
    winnerIdx = bi;
  }

  // ── geometría ────────────────────────────────────────────────────────────
  const plotW = CANVAS_W - SAFE * 2;
  const slot = n > 0 ? plotW / n : plotW;
  const colW = Math.min(300, Math.max(120, slot * 0.5));
  const depth = Math.min(58, colW * 0.22);

  // viñeta que respira
  const vig = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 0.6);

  return (
    <AbsoluteFill
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        backgroundColor: BG,
        fontFamily: INTER,
        overflow: "hidden",
      }}
    >
      <Backdrop src={src} t={t} />
      <GuideGrid t={t} appear={headIn} />

      {/* L4 · línea de piso */}
      <div
        style={{
          position: "absolute",
          left: SAFE * 0.5,
          top: FLOOR_Y,
          width: CANVAS_W - SAFE,
          height: 2,
          background:
            "linear-gradient(90deg, rgba(243,236,221,0) 0%, rgba(243,236,221,0.32) 22%, rgba(243,236,221,0.32) 78%, rgba(243,236,221,0) 100%)",
          opacity: headIn * 0.9,
          transform: `scaleX(${0.72 + headIn * 0.28})`,
          transformOrigin: "center center",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: FLOOR_Y,
          width: CANVAS_W,
          height: 190,
          background:
            "linear-gradient(180deg, rgba(9,28,34,0.62) 0%, rgba(6,18,23,0) 100%)",
          opacity: headIn,
          pointerEvents: "none",
        }}
      />

      {/* L5-L7 · columnas */}
      {list.map((b, i) => {
        const t0 = start + i * stagger;
        const growRaw = spring({
          frame: frame - t0,
          fps,
          config: { damping: 12, mass: 0.85, stiffness: 120 },
          durationInFrames: growLen,
        });
        const grow = Math.max(0, growRaw);
        const growC = Math.min(1, grow);
        const landAt = t0 + growLen * 0.82;

        const value = vals[i];
        const frac = Math.max(MIN_FRAC, normalize(value));
        const height = Math.max(6, PLOT_H * frac * grow);

        const isWin = i === winnerIdx;
        const skinBase = b.tone ? SKINS[b.tone] : SKINS.teal;
        const skin = isWin ? skinBase : b.tone ? skinBase : MUTED;
        const dim = isWin ? 1 : b.tone ? 0.62 : 0.78;

        const counted = value * Easing.out(Easing.cubic)(growC);
        const valueText = fmtNumber(counted);

        const fadeIn = interpolate(
          frame,
          [t0 + growLen * 0.35, t0 + growLen * 0.85],
          [0, 1],
          { ...CLAMP, easing: Easing.out(Easing.cubic) }
        );

        const left = SAFE + slot * (i + 0.5) - colW / 2 - depth / 2;

        return (
          <Column
            key={i}
            frame={frame}
            left={left}
            width={colW}
            depth={depth}
            height={height}
            grow={growC}
            skin={skin}
            winner={isWin}
            valueText={valueText}
            label={b.label}
            note={b.note}
            landAt={landAt}
            pulseLen={growLen}
            fadeIn={fadeIn}
            dim={dim}
          />
        );
      })}

      {/* L8 · título con filete de acento (arriba a la izquierda) */}
      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 96,
          maxWidth: 1020,
          opacity: headIn,
          transform: `translateY(${(1 - headIn) * -14}px)`,
        }}
      >
        <div
          style={{
            width: 92 * rule,
            height: 5,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${TEAL_LIGHT} 0%, ${TEAL} 100%)`,
            boxShadow: `0 0 18px ${SKINS.teal.glow}`,
            marginBottom: 20,
          }}
        />
        <div
          style={{
            fontFamily: INTER,
            fontSize: 46,
            fontWeight: 800,
            letterSpacing: -0.8,
            lineHeight: 1.14,
            color: CREAM,
            textShadow: "0 10px 30px rgba(0,0,0,0.72)",
          }}
        >
          {title && title.length > 0 ? title : "La comparación"}
        </div>
      </div>

      {/* L8 · unidad (arriba a la derecha) + aviso de escala comprimida */}
      {unit && unit.length > 0 ? (
        <div
          style={{
            position: "absolute",
            right: SAFE,
            top: 100,
            textAlign: "right",
            opacity: headIn,
            transform: `translateY(${(1 - headIn) * -10}px)`,
          }}
        >
          <div
            style={{
              width: 76,
              height: 1,
              marginLeft: "auto",
              marginBottom: 14,
              background: "rgba(243,236,221,0.30)",
            }}
          />
          <div
            style={{
              fontFamily: INTER,
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "rgba(243,236,221,0.58)",
            }}
          >
            {unit}
          </div>
        </div>
      ) : null}

      {n > 0 && compress ? (
        <div
          style={{
            position: "absolute",
            right: SAFE,
            top: 172,
            textAlign: "right",
            fontFamily: INTER,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 2.6,
            textTransform: "uppercase",
            color: "rgba(243,236,221,0.30)",
            opacity: interpolate(frame, [D * 0.3, D * 0.42], [0, 1], CLAMP),
          }}
        >
          Escala comprimida · valores reales
        </div>
      ) : null}

      {/* L9 · viñeta que respira */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(72% 62% at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.58) 100%)",
          opacity: 0.72 + vig * 0.14,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
