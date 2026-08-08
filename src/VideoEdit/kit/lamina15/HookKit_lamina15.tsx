// ═══════════════════════════════════════════════════════════════════════════
// HOOK KIT — variantes PROPIAS del video `lamina15` (barrera radiante).
// Regla del canal: variante propia SÍ, tocar el componente compartido NO.
//
// Las tres existen porque el primer minuto de este video tiene que MOSTRAR algo
// que la voz no puede decir (una temperatura, un espesor, una degradación), en
// vez de repetir la frase con un cartel y un scrim que oscurece — que es
// exactamente el recurso que el creador marcó como flojo.
//
// Contrato estándar del kit: `durationInFrames` + `theme?` + props de contenido.
// Se montan FULL-BLEED (traen su propio plate) — NO van dentro de PremiumOverlay,
// porque el efecto ES la imagen, no una pieza flotando sobre ella.
// ═══════════════════════════════════════════════════════════════════════════
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ImgOr, useBeat } from "../premium/core";
import { OnFootage, useInk } from "../premium/stagecraft";
import { useTheme, type Theme } from "../premium/theme";

/** número con coma decimal, ancho fijo (no salta el layout mientras corre) */
const num = (v: number, dec = 0) =>
  v.toFixed(dec).replace(".", ",");

/** lectura de instrumento: etiqueta chica + cifra grande, sin caja ni scrim */
const Readout: React.FC<{
  theme: Theme;
  label: string;
  value: string;
  unit?: string;
  accent: string;
  style?: React.CSSProperties;
}> = ({ theme, label, value, unit, accent, style }) => {
  const ink = useInk(theme);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <div
        style={{
          fontFamily: theme.fontLabel,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: accent,
          textShadow: ink.shadow,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <div
          style={{
            fontFamily: theme.fontDisplay,
            fontSize: 132,
            fontWeight: theme.displayWeight,
            lineHeight: 1,
            color: ink.text,
            textShadow: ink.shadowStrong,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </div>
        {unit ? (
          <div
            style={{
              fontFamily: theme.fontDisplay,
              fontSize: 52,
              color: ink.soft,
              textShadow: ink.shadow,
            }}
          >
            {unit}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 1) ThermalWipe — el barrido termográfico.
//    Una línea de escaneo cruza el cuadro y DETRÁS de ella la misma imagen
//    queda en falso color térmico. El dato (la temperatura de la superficie)
//    sube sincronizado con la línea: la imagen se convierte en el dato.
// ───────────────────────────────────────────────────────────────────────────
export const ThermalWipe_lamina15: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  image?: string;
  label?: string;
  from?: number;
  to?: number;
  unit?: string;
  /** frames que tarda el barrido en cruzar el cuadro */
  sweepDur?: number;
  /** true = la lámina entra y ENFRÍA (segundo beat del hook) */
  cooling?: boolean;
  coolTo?: number;
  coolAt?: number;
}> = ({
  durationInFrames,
  theme,
  image,
  label = "SUP. TECHO",
  from = 24,
  to = 67,
  unit = "°C",
  sweepDur = 36,
  cooling = false,
  coolTo = 52,
  coolAt = 70,
}) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const { op } = useBeat(durationInFrames);

  // progreso del barrido 0→1 (arranca en el frame 2, no en el 0: deja ver el
  // plano crudo un instante para que el cambio se lea como cambio)
  const p = interpolate(frame, [2, 2 + sweepDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yPct = p * 100;

  // la cifra sigue a la línea; si hay enfriado, después baja
  const heat = interpolate(p, [0, 1], [from, to]);
  const cooled = cooling
    ? interpolate(frame, [coolAt, coolAt + 30], [heat, coolTo], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : heat;

  // falso color: capa CALIENTE (blanco/amarillo/naranja) + capa FRÍA (multiply
  // azul-violeta sobre las zonas oscuras). Es lo que da lectura de termografía
  // sin necesitar una LUT real.
  const hot: React.CSSProperties = {
    filter: "grayscale(1) brightness(1.06) contrast(1.55) sepia(1) saturate(7) hue-rotate(-28deg)",
  };
  const cold: React.CSSProperties = {
    filter: "grayscale(1) invert(1) contrast(1.4) sepia(1) saturate(6) hue-rotate(178deg)",
    mixBlendMode: "multiply",
    opacity: 0.58,
  };

  return (
    <AbsoluteFill style={{ opacity: op, background: "#0B0A10" }}>
      {/* L1 — el plano crudo, sin tocar */}
      <AbsoluteFill>
        <ImgOr src={image} seed={3} theme={t} />
      </AbsoluteFill>

      {/* L2 — el mismo plano en falso color, revelado por el barrido */}
      <AbsoluteFill style={{ clipPath: `inset(0 0 ${100 - yPct}% 0)` }}>
        <AbsoluteFill style={hot}>
          <ImgOr src={image} seed={3} theme={t} />
        </AbsoluteFill>
        <AbsoluteFill style={cold}>
          <ImgOr src={image} seed={3} theme={t} />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* la línea de escaneo (sólo mientras cruza) */}
      {p > 0 && p < 1 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${yPct}%`,
              height: 3,
              background: "#FFF4D2",
              boxShadow: "0 0 26px 6px rgba(255,214,120,0.85), 0 0 90px 26px rgba(255,150,60,0.35)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${yPct}%`,
              height: 120,
              transform: "translateY(-120px)",
              background: "linear-gradient(to bottom, rgba(255,190,90,0) 0%, rgba(255,190,90,0.22) 100%)",
            }}
          />
        </>
      ) : null}

      {/* la lectura del instrumento — flota, sin caja y sin oscurecer nada */}
      <OnFootage>
        <Readout
          theme={t}
          label={label}
          value={num(cooled)}
          unit={unit}
          accent="#FFC761"
          style={{ position: "absolute", left: 96, top: 92 }}
        />
      </OnFootage>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 2) CaliperReveal — el espesor comparado con un OBJETO, no con una barra.
//    Un calibre se cierra sobre la lámina (una línea de 3px) y al lado queda,
//    a la misma escala, el bloque de lana mineral. La desproporción es el dato.
// ───────────────────────────────────────────────────────────────────────────
export const CaliperReveal_lamina15: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  image?: string;
  leftLabel?: string;
  leftNote?: string;
  rightLabel?: string;
  rightNote?: string;
}> = ({
  durationInFrames,
  theme,
  image,
  leftLabel = "LA LÁMINA",
  leftNote = "una hoja",
  rightLabel = "AISLANTE CONVENCIONAL",
  rightNote = "para el mismo trabajo",
}) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { op } = useBeat(durationInFrames);
  void fps;

  // el calibre se cierra en ~0,9 s y rebota mínimo al tocar
  const close = interpolate(frame, [6, 33], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gap = 210 * close + 7; // separación de las mordazas, en px
  const blockGrow = interpolate(frame, [34, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ink = useInk(t);

  const BLOCK_H = 300; // lana mineral a escala, junto a los 7px de la lámina

  return (
    <AbsoluteFill style={{ opacity: op, background: "#141118" }}>
      <AbsoluteFill style={{ filter: "brightness(0.5) saturate(0.7)" }}>
        <ImgOr src={image} seed={11} theme={t} />
      </AbsoluteFill>

      <OnFootage>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 190,
          }}
        >
          {/* IZQUIERDA — la lámina entre las mordazas del calibre */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
            <div style={{ position: "relative", width: 420, height: BLOCK_H, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* mordaza superior */}
              <div
                style={{
                  position: "absolute",
                  left: 40,
                  right: 40,
                  height: 26,
                  bottom: `calc(50% + ${gap / 2}px)`,
                  background: "linear-gradient(180deg,#D9DDE4,#8E96A3)",
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
                }}
              />
              {/* la lámina */}
              <div
                style={{
                  width: 340,
                  height: 7,
                  background: "linear-gradient(90deg,#EDEFF3,#FFFFFF,#C9CFD8)",
                  boxShadow: "0 0 26px rgba(255,255,255,0.7)",
                }}
              />
              {/* mordaza inferior */}
              <div
                style={{
                  position: "absolute",
                  left: 40,
                  right: 40,
                  height: 26,
                  top: `calc(50% + ${gap / 2}px)`,
                  background: "linear-gradient(0deg,#D9DDE4,#8E96A3)",
                  borderRadius: 3,
                  boxShadow: "0 -8px 24px rgba(0,0,0,0.55)",
                }}
              />
            </div>
            <div
              style={{
                fontFamily: t.fontLabel,
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: 5,
                color: "#FFC761",
                textShadow: ink.shadow,
              }}
            >
              {leftLabel}
            </div>
            <div style={{ fontFamily: t.fontBody, fontSize: 28, color: ink.soft, textShadow: ink.shadow }}>{leftNote}</div>
          </div>

          {/* DERECHA — el bloque de aislante a la misma escala */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
            <div style={{ width: 420, height: BLOCK_H, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div
                style={{
                  width: 340,
                  height: BLOCK_H * blockGrow,
                  background: "repeating-linear-gradient(135deg,#C8B79A 0 12px,#B9A688 12px 24px)",
                  borderRadius: 4,
                  boxShadow: "0 26px 60px rgba(0,0,0,0.6)",
                }}
              />
            </div>
            <div
              style={{
                fontFamily: t.fontLabel,
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: 5,
                color: ink.soft,
                textShadow: ink.shadow,
              }}
            >
              {rightLabel}
            </div>
            <div style={{ fontFamily: t.fontBody, fontSize: 28, color: ink.dim, textShadow: ink.shadow }}>{rightNote}</div>
          </div>
        </AbsoluteFill>
      </OnFootage>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 3) DustDecay — el loop grande, plantado sin explicarlo.
//    El espejo se apaga bajo el polvo y la emisividad trepa. Se corta antes de
//    decir por qué: eso es lo que arrastra al espectador 25 minutos.
// ───────────────────────────────────────────────────────────────────────────
export const DustDecay_lamina15: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  image?: string;
  label?: string;
  from?: number;
  to?: number;
  fromNote?: string;
  toNote?: string;
  /** frame en el que arranca la degradación */
  at?: number;
  /** cuántos frames tarda en apagarse */
  decayDur?: number;
}> = ({
  durationInFrames,
  theme,
  image,
  label = "EMISIVIDAD",
  from = 0.05,
  to = 0.3,
  fromNote = "AÑO 1",
  toNote = "AÑO 3",
  at = 14,
  decayDur = 60,
}) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const { op } = useBeat(durationInFrames);
  const ink = useInk(t);

  const d = interpolate(frame, [at, at + decayDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const val = from + (to - from) * d;

  // el espejo pierde brillo, saturación y contraste: no se rompe, se apaga
  const plate: React.CSSProperties = {
    filter: `brightness(${1 - d * 0.3}) saturate(${1 - d * 0.62}) contrast(${1 - d * 0.22})`,
  };

  return (
    <AbsoluteFill style={{ opacity: op, background: "#0E0D0B" }}>
      <AbsoluteFill style={plate}>
        <ImgOr src={image} seed={5} theme={t} />
      </AbsoluteFill>

      {/* el destello especular del espejo — existe al principio y se muere */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(118deg, rgba(255,255,255,0) 34%, rgba(255,252,236,0.55) 47%, rgba(255,255,255,0) 60%)",
          opacity: Math.max(0, 1 - d * 1.35),
          mixBlendMode: "screen",
        }}
      />

      {/* la capa de polvo que se asienta */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 22% 18%, rgba(196,184,160,0.5), rgba(150,140,120,0.34) 45%, rgba(120,112,96,0.42) 100%)",
          opacity: d * 0.72,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 30% 40%, rgba(255,255,255,0.05) 0 1px, rgba(0,0,0,0) 1px 5px), repeating-radial-gradient(circle at 70% 65%, rgba(255,255,255,0.04) 0 1px, rgba(0,0,0,0) 1px 7px)",
          opacity: d * 0.9,
        }}
      />

      <OnFootage>
        <div style={{ position: "absolute", left: 96, bottom: 104, display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              fontFamily: t.fontLabel,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 6,
              color: "#FFC761",
              textShadow: ink.shadow,
            }}
          >
            {label}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
            <div
              style={{
                fontFamily: t.fontDisplay,
                fontSize: 138,
                fontWeight: t.displayWeight,
                lineHeight: 1,
                color: ink.text,
                textShadow: ink.shadowStrong,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {num(val, 2)}
            </div>
            <div style={{ fontFamily: t.fontBody, fontSize: 34, color: ink.soft, textShadow: ink.shadow }}>
              {d < 0.5 ? fromNote : toNote}
            </div>
          </div>
        </div>
      </OnFootage>
    </AbsoluteFill>
  );
};
