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
  // ⚠️ Medido en el proof del farm: con la capa fría a 0.58 y brillo 1.06 el cuadro
  // se aplastaba a negro y se perdía la mitad de la escena. La termografía real NO
  // tiene negros: tiene un piso azul-violeta. Por eso el brillo sube, el multiply
  // baja, y abajo de todo va un piso de color que levanta las sombras.
  const hot: React.CSSProperties = {
    filter: "grayscale(1) brightness(1.34) contrast(1.32) sepia(1) saturate(7) hue-rotate(-28deg)",
  };
  const cold: React.CSSProperties = {
    filter: "grayscale(1) invert(1) contrast(1.15) sepia(1) saturate(5) hue-rotate(178deg)",
    mixBlendMode: "multiply",
    opacity: 0.3,
  };
  // piso frío: lo que en la imagen es sombra tiene que quedar AZUL, no negro
  const floor: React.CSSProperties = {
    background: "linear-gradient(180deg,#2A1E5C,#141A4A)",
    mixBlendMode: "screen",
    opacity: 0.34,
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
        <AbsoluteFill style={floor} />
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

  const BLOCK_H = 340; // lana mineral a escala, junto a los 7px de la lámina

  return (
    <AbsoluteFill style={{ opacity: op, background: "#141118" }}>
      {/* ⚠️ Medido en el proof: con brightness(0.5) el plate quedaba CLARO y la tinta
          de `OnFootage` (que es clara) desaparecía sobre él. El plate va hundido de
          verdad, y encima un degradado que garantiza el contraste de los rótulos. */}
      <AbsoluteFill style={{ filter: "brightness(0.22) saturate(0.3) contrast(1.1)" }}>
        <ImgOr src={image} seed={11} theme={t} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(10,9,14,0.35), rgba(10,9,14,0.86) 78%)" }}
      />
      {/* LÍNEA DE BASE compartida: sin una mesa donde apoyar las dos piezas, el ojo no
          las compara. Es lo que faltaba en los dos primeros proofs. */}
      <div
        style={{
          position: "absolute",
          left: 300,
          right: 300,
          bottom: 250,
          height: 2,
          background: "linear-gradient(90deg,rgba(255,199,97,0) 0%,rgba(255,199,97,0.55) 18%,rgba(255,199,97,0.55) 82%,rgba(255,199,97,0) 100%)",
        }}
      />

      <OnFootage>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "row",
            // ⚠️ Medido en el 2º proof: centradas verticalmente, las dos piezas se leían
            // como "una pastilla" y "un cuadrado", NO como una desproporción. Una
            // comparación de espesor sólo funciona si las dos se apoyan en la MISMA
            // línea de base, como dos objetos sobre una mesa.
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 170,
            paddingBottom: 250,
          }}
        >
          {/* IZQUIERDA — la lámina entre las mordazas del calibre */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
            <div style={{ position: "relative", width: 420, height: 26, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
              {/* mordaza superior — fina, para que NO le gane a la lámina */}
              <div
                style={{
                  position: "absolute",
                  left: 90,
                  right: 90,
                  height: 12,
                  bottom: 7 + gap,
                  background: "linear-gradient(180deg,#AEB6C2,#6E7684)",
                  borderRadius: 2,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
                }}
              />
              {/* la lámina — el punto del plano es que casi no exista, pero tiene que
                  VERSE que está: línea brillante + halo, no una raya perdida */}
              <div
                style={{
                  width: 340,
                  height: 7,
                  background: "linear-gradient(90deg,#EDEFF3,#FFFFFF,#C9CFD8)",
                  boxShadow: "0 0 10px 3px rgba(255,255,255,0.95), 0 0 44px 14px rgba(190,225,255,0.55)",
                }}
              />
              {/* línea guía + rótulo del espesor, para que la raya se lea como medida */}
              <div
                style={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  width: 34,
                  height: 2,
                  background: "#FFC761",
                  transform: "translateY(-1px)",
                  opacity: 1 - close,
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

          {/* la regla de escala: prueba de que las dos piezas están dibujadas igual */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: BLOCK_H, justifyContent: "flex-end", marginBottom: 96 }}>
            <div style={{ width: 2, height: BLOCK_H * blockGrow, background: "rgba(255,199,97,0.35)" }} />
            <div style={{ width: 22, height: 2, background: "rgba(255,199,97,0.55)" }} />
          </div>

          {/* DERECHA — el bloque de aislante a la misma escala */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
            <div style={{ width: 420, height: BLOCK_H, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
              <div
                style={{
                  width: 300,
                  height: BLOCK_H * blockGrow,
                  background:
                    "linear-gradient(180deg,#D6C6A6,#B9A688 55%,#8E7F63), repeating-linear-gradient(135deg,rgba(255,255,255,0.10) 0 10px,rgba(0,0,0,0.06) 10px 20px)",
                  backgroundBlendMode: "overlay",
                  borderRadius: 4,
                  borderTop: "3px solid #E6DAC0",
                  boxShadow: "0 30px 70px rgba(0,0,0,0.75), inset 0 -18px 40px rgba(0,0,0,0.35)",
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
    filter: `brightness(${1 - d * 0.16}) saturate(${1 - d * 0.62}) contrast(${1 - d * 0.14})`,
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
      {/* ⚠️ Medido en el proof: con el polvo a 0.72 y el ruido a 0.9 la imagen quedaba
          LAVADA a un gris plano y ya no se veía qué era. El polvo tiene que APAGAR el
          espejo, no borrar la escena. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 22% 18%, rgba(196,184,160,0.5), rgba(150,140,120,0.34) 45%, rgba(120,112,96,0.42) 100%)",
          opacity: d * 0.42,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 30% 40%, rgba(255,255,255,0.05) 0 1px, rgba(0,0,0,0) 1px 5px), repeating-radial-gradient(circle at 70% 65%, rgba(255,255,255,0.04) 0 1px, rgba(0,0,0,0) 1px 7px)",
          opacity: d * 0.3,
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
              {d < 0.72 ? fromNote : toNote}
            </div>
          </div>
        </div>
      </OnFootage>
    </AbsoluteFill>
  );
};
