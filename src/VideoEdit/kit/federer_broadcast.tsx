import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { F_INTER, F_OSWALD } from "./premium/theme";
import { slabShadow, specular } from "./premium/stagecraft";

// ═══════════════════════════════════════════════════════════════════════════
// DR. FEDERER · KIT BROADCAST — overlays tipo noticiero (lower-thirds, alertas,
// tickers, antes/después, mito vs realidad, badge de dato, callout).
// Paleta oscura de alto contraste = autoridad "en vivo" sobre el b-roll.
// RENDER-SAFE: todo determinista (useCurrentFrame). Nada depende del reloj.
// ═══════════════════════════════════════════════════════════════════════════
// ── PALETA CLÍNICA CLARA ────────────────────────────────────────────────────
// El kit era dark. Se pasó a claro porque es el idioma de la medicina (bata
// blanca, consultorio) y sobre todo porque el público es ADULTO MAYOR: texto
// oscuro sobre blanco da ~14:1 de contraste contra los 7-8:1 del oscuro.
// Además el resto del video ya venía claro (los kinds mapeados a THEME_MEDICO),
// así que antes convivían dos lenguajes en el mismo video.
const INK0 = "#071216";                      // se conserva para los takeover
// El celeste va CLARO: en la primera pasada quedó un teal medio con tinta
// oscura encima y "DR. FEDERER" no se leía. Chip claro + tinta teal profunda.
const TEAL = "#5FDED7";
const TEALd = "#2CC0B8";
const TEALhi = "#063B40";                    // tinta SOBRE el chip celeste
const ALERT = "#E02718";
const W = "#0D2A2E";                         // tinta principal sobre papel
const ON_ACCENT = "#FFFFFF";                 // tinta sobre chips rojos/oscuros
// ── SUSTRATO COMPARTIDO ──────────────────────────────────────────────────────
// Estos 7 son OVERLAYS: van ENCIMA del avatar, así que la consigna del canal
// ("menos es más") manda. No se les agregan capas: se les da MATERIA.
//   · una sola luz para todo el kit → mismo brillo especular y misma dirección
//     de sombra en las 7 piezas (es lo que las hace parecer del mismo mundo)
//   · sombra de objeto sólido: canto duro = espesor, más tres difusas
//   · desenfoque de lo que tienen detrás: es EL gesto de un lower-third de
//     broadcast — la barra no se apoya sobre el video, lo saca de foco
const FED_LIGHT = { x: 0.28, y: 0.14, sx: 0.52, sy: 0.854, angle: 58.6 };
const SURFACE = `${specular(FED_LIGHT, 0.5)}, linear-gradient(178deg, #FCFEFE 0%, #F2F8F8 46%, #E6F0F1 100%)`;
const BLUR = "blur(16px) saturate(1.06)";
// Canto DIRECCIONAL: un border uniforme tiene la misma luminancia en los 4 lados
// y ningún canto real se comporta así.
const EDGE = "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(16,54,58,0.13)";
// una tarjeta CLARA sobre video necesita más sombra que una oscura: es lo
// único que la despega del fondo.
const LIFT = `${slabShadow(FED_LIGHT, { lift: 1.7, edge: "rgba(16,54,58,0.28)", tint: "rgba(8,28,32,0.44)" })}, ${EDGE}`;

/** Scrim — mancha de sombra LOCAL debajo de un overlay. Sin esto el gráfico
 *  (grado dark teal, luma ~20) aterriza crudo sobre un b-roll que puede venir
 *  a luma 93 y cálido: ningún colorista deja eso sin scrim, y es lo que hace
 *  que se lea "PNG pegado sobre un JPG" en vez de un plano compuesto. */
const Scrim: React.FC<{ at: "bottom" | "top" | "corner"; opacity?: number }> = ({ at, opacity = 1 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      opacity,
      background:
        at === "bottom"
          ? "linear-gradient(0deg, rgba(4,14,16,0.9) 0%, rgba(4,14,16,0.5) 20%, transparent 34%)"
          : at === "top"
            ? "linear-gradient(180deg, rgba(4,14,16,0.88) 0%, rgba(4,14,16,0.42) 20%, transparent 32%)"
            : "radial-gradient(58% 46% at 78% 76%, rgba(4,14,16,0.86) 0%, rgba(4,14,16,0.4) 46%, transparent 76%)",
    }}
  />
);

/** grano animado — los degradados oscuros puros bandean: se midieron 19 valores
 *  únicos en medio cuadro contra 180+ del metraje real. La semilla va atada al
 *  frame o el grano queda quieto y se lee como textura pegada. */
const Dither: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => {
  const f = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id={`fbd${f % 97}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" seed={f % 97} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#fbd${f % 97})`} />
    </svg>
  );
};
/** sombra de texto para que CUALQUIER rótulo se lea sobre CUALQUIER b-roll */
// sobre papel claro la sombra de texto es un filo de luz, no un halo negro
const TSHADOW = "0 1px 0 rgba(255,255,255,0.75)";

// ── ESCALA TIPOGRÁFICA — el público de este canal es ADULTO MAYOR ───────────
// Auditoría jul 2026: el texto de apoyo estaba en 20-26px sobre 1080p. En un
// celular el frame se ve a ~1/5, o sea ~1,3 mm de altura de mayúscula: un ojo
// con presbicia no lo lee, lo saltea. Y el teal sobre negro daba ~4,5:1 de
// contraste cuando para texto de apoyo acá el piso es 7:1.
// La legibilidad manda sobre lo lindo.
// ★ NO es una escala pareja para los 7. Ese fue el error: subir todo por igual
//   convierte a los overlays de ESQUINA —que son piezas discretas, y su elegancia
//   está justamente en la contención— en bloques de texto que compiten con el
//   video. La escala depende de QUÉ ES cada pieza:
//     · overlay de esquina  → título 40-42, secundario 28-30  (contenido)
//     · takeover full-screen → título 64+, secundario 40+     (no hay a quién esquivar)
//   Lo que SÍ vale para todos es el COLOR: nada de teal ni gris sobre negro para
//   texto de apoyo (daba 4,5:1 y este público necesita 7:1). Blanco al 88%.
const T_PRIMARY = 42;   // título de overlay de esquina
const T_SECOND = 29;    // bajada, caption
const T_LABEL = 26;     // kicker de 1-2 palabras en caja alta
const T_BIG = 64;       // título en takeover full-screen
const T_BIG2 = 40;      // secundario en takeover
const WREAD = "rgba(13,42,46,0.72)";  // blanco de lectura para secundario
const SAFE = 96;        // área segura ÚNICA para los 7 componentes
const PAD = 32;         // padding interno de tarjeta, parejo en los 4 lados

// ── SEMÁNTICA DE COLOR (máx 2 acentos por frame) ────────────────────────────
// El teal hacía TRES trabajos a la vez —marca, "esto es verdad" y "mirá acá"—
// así que dejaba de ser señal y pasaba a ser decoración.
//   TEAL  = marca y señalización (lower third, flecha, etiqueta)
//   GOLD  = EL DATO (la cifra que hay que recordar)
//   ALERT = mito/falso, y NADA más
const GOLD = "#A8792B";   // oro que contrasta sobre blanco

const sf = (s?: string) => (s ? (s.startsWith("http") || s.startsWith("data:") ? s : staticFile(s)) : undefined);

// entrada spring 0→1
const useIn = (delay = 0) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 200, mass: 0.6 } });
};

// ícono cruz médica + pulso
const PulseCross: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = W }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M4 21h7l3-7 5 14 3-7h9" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────
// 1) LOWER-THIRD FEDERER — barra tipo "breaking news" con marca médica
// ─────────────────────────────────────────────────────────────────────────
export const LowerThirdFederer: React.FC<{ kicker?: string; title: string; subtitle?: string; durationInFrames?: number; x?: number }> = ({
  kicker = "DR. FEDERER", title, subtitle, x: xPos = 96,
}) => {
  const p = useIn(0);
  const p2 = useIn(6);
  const x = interpolate(p, [0, 1], [-80, 0]);
  const barW = interpolate(p2, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER }}>
      <Scrim at="bottom" />
      {/* ★ La POSICIÓN es una prop (`x`), no una constante. La tentación fue
          moverlo a la derecha porque en el plate de prueba el doctor está a la
          izquierda — pero dónde cae el sujeto depende de CADA video, así que
          hardcodearlo es tan arbitrario como dejarlo fijo. Default: el de
          siempre (96). El que monta lo corre si hace falta. */}
      <div style={{ position: "absolute", left: xPos, bottom: 118, display: "flex", alignItems: "stretch", opacity: p, transform: `translateX(${x}px)`, filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.55))" }}>
        {/* tag marca (paralelogramo teal) */}
        <div style={{ background: `linear-gradient(135deg, ${TEAL}, ${TEALd})`, display: "flex", alignItems: "center", gap: 12, padding: "0 26px 0 22px", transform: "skewX(-9deg)", borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>
          <div style={{ transform: "skewX(9deg)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(255,255,255,0.35)" }}>
              <PulseCross />
            </div>
            <span style={{ color: TEALhi, fontWeight: 800, fontSize: 27, letterSpacing: 2, whiteSpace: "nowrap" }}>{kicker}</span>
          </div>
        </div>
        {/* barra oscura título + subtítulo */}
        <div style={{ overflow: "hidden", transform: "skewX(-9deg)", transformOrigin: "left", width: barW * 960 }}>
          <div style={{ transform: "skewX(9deg)", background: SURFACE, backdropFilter: BLUR, WebkitBackdropFilter: BLUR, borderTop: `3px solid ${TEAL}`, padding: "14px 36px 16px 30px", minWidth: 620, height: "100%", boxSizing: "border-box" }}>
            <div style={{ color: W, fontWeight: 800, fontSize: 46, lineHeight: 1.04, letterSpacing: -0.5, whiteSpace: "nowrap", textShadow: TSHADOW }}>{title}</div>
            {/* ★ Acá el problema NUNCA fue el tamaño: era el COLOR. El subtítulo
                iba en teal sobre negro = 4,5:1, y este público necesita 7:1.
                Se arregla con blanco, no agrandándolo: subirlo a 42 hacía que
                compitiera con el título y tiraba abajo la jerarquía, que es
                justo lo que hacía elegante a este lower third. */}
            {subtitle && <div style={{ color: WREAD, fontWeight: 600, fontSize: 27, marginTop: 5, letterSpacing: 0.3, whiteSpace: "nowrap", textShadow: TSHADOW }}>{subtitle}</div>}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// 2) ALERTA ESQUINA (inferior-derecha) — titular super-alerta + descripción
// ─────────────────────────────────────────────────────────────────────────
export const AlertaCorner: React.FC<{ tag?: string; headline: string; desc?: string }> = ({ tag = "ALERTA", headline, desc }) => {
  const f = useCurrentFrame();
  const p = useIn(0);
  const p2 = useIn(8);
  const pulse = 0.5 + 0.5 * Math.sin(f / 6);
  const x = interpolate(p, [0, 1], [60, 0]);
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER }}>
      <Scrim at="corner" />
      <div style={{ position: "absolute", right: SAFE, bottom: SAFE + 24, width: 560, opacity: p, transform: `translateX(${x}px)`, filter: "drop-shadow(0 20px 46px rgba(0,0,0,0.6))" }}>
        {/* chip alerta pulsante */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: `linear-gradient(135deg, ${ALERT}, #B81A11)`, padding: "9px 22px 9px 16px", borderRadius: 10, marginBottom: -4, marginLeft: 10, boxShadow: `0 0 ${18 + pulse * 26}px rgba(255,59,48,${0.32 + pulse * 0.38})` }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: ON_ACCENT, boxShadow: `0 0 ${6 + pulse * 10}px ${ON_ACCENT}` }} />
          <span style={{ color: ON_ACCENT, fontWeight: 800, fontSize: T_LABEL, letterSpacing: 3, fontFamily: F_OSWALD }}>{tag}</span>
        </div>
        {/* cuerpo */}
        <div style={{ background: SURFACE, backdropFilter: BLUR, WebkitBackdropFilter: BLUR, borderRadius: 16, borderTopRightRadius: 4, border: `1.5px solid rgba(255,59,48,0.3)`, borderLeft: `5px solid ${ALERT}`, padding: "20px 26px 22px", opacity: p2 }}>
          <div style={{ color: W, fontWeight: 800, fontSize: T_PRIMARY, lineHeight: 1.14, letterSpacing: -0.3, textShadow: TSHADOW }}>{headline}</div>
          {desc && <div style={{ color: WREAD, fontWeight: 500, fontSize: T_SECOND, lineHeight: 1.34, marginTop: 10, textShadow: TSHADOW }}>{desc}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// 3) TICKER ALERTA — franja inferior full-width con tag + texto en scroll
// ─────────────────────────────────────────────────────────────────────────
export const TickerAlerta: React.FC<{ tag?: string; items: string[] }> = ({ tag = "SALUD", items }) => {
  const f = useCurrentFrame();
  const p = useIn(0);
  const y = interpolate(p, [0, 1], [90, 0]);
  // ★ YA NO ES UN TICKER. Un texto que scrollea exige velocidad de lectura
  //   sostenida, que es justo lo que se pierde con la edad: el espectador
  //   engancha una palabra, la procesa, levanta la vista y la frase ya salió de
  //   cuadro. Además arrancaba y terminaba cortando palabras contra los bordes
  //   (x=0, sin margen), que se lee como error de render, no como diseño.
  //   Ahora: UN dato por vez, quieto, con hold de 3s y cruce suave.
  const HOLD = 90;      // 3 s a 30fps
  const FADE = 8;
  const n = Math.max(1, items.length);
  const idx = Math.floor(f / HOLD) % n;
  const local = f % HOLD;
  const swap = local < FADE ? local / FADE : local > HOLD - FADE ? (HOLD - local) / FADE : 1;
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER }}>
      <Scrim at="bottom" opacity={0.9} />
      <div
        style={{
          position: "absolute",
          left: SAFE,
          right: SAFE,
          bottom: SAFE,
          display: "flex",
          alignItems: "stretch",
          opacity: p,
          transform: `translateY(${y}px)`,
          filter: "drop-shadow(0 -6px 24px rgba(0,0,0,0.45))",
        }}
      >
        <div style={{ background: `linear-gradient(135deg, ${TEAL}, ${TEALd})`, display: "flex", alignItems: "center", padding: `0 ${PAD}px`, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
          <span style={{ color: TEALhi, fontWeight: 800, fontSize: T_LABEL, letterSpacing: 3, fontFamily: F_OSWALD }}>{tag}</span>
        </div>
        <div style={{ flex: 1, background: SURFACE, backdropFilter: BLUR, WebkitBackdropFilter: BLUR, borderTop: `2px solid ${TEAL}`, borderTopRightRadius: 10, borderBottomRightRadius: 10, boxShadow: LIFT, display: "flex", alignItems: "center", padding: `${PAD - 6}px ${PAD}px`, minHeight: 96 }}>
          <div style={{ color: W, fontWeight: 600, fontSize: T_BIG2, lineHeight: 1.24, opacity: swap, transform: `translateY(${(1 - swap) * 10}px)`, textShadow: TSHADOW }}>
            {items[idx]}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// 4) ANTES / DESPUÉS — split con divisor animado + etiquetas (melasma)
// ─────────────────────────────────────────────────────────────────────────
export const AntesDespues: React.FC<{ before?: string; after?: string; labelA?: string; labelB?: string }> = ({
  before, after, labelA = "ANTES", labelB = "DESPUÉS",
}) => {
  const p = useIn(0);
  const split = interpolate(p, [0, 1], [50, 54], { extrapolateRight: "clamp" });
  const Chip: React.FC<{ t: string; c: string; side: "l" | "r" }> = ({ t, c, side }) => (
    <div style={{ position: "absolute", top: SAFE, [side === "l" ? "left" : "right"]: SAFE, background: c, color: ON_ACCENT, fontFamily: F_OSWALD, fontWeight: 700, fontSize: T_LABEL, letterSpacing: 3, padding: "12px 30px", borderRadius: 8, boxShadow: LIFT } as React.CSSProperties}>{t}</div>
  );
  const half = (side: "a" | "b"): React.CSSProperties => ({
    position: "absolute", inset: 0,
    background: side === "a"
      ? "radial-gradient(120% 100% at 60% 40%, #3a2a2e, #1a1013 75%)"   // ANTES: piel apagada/manchada
      : "radial-gradient(120% 100% at 40% 40%, #123b42, #061318 78%)",  // DESPUÉS: piel limpia/teal
  });
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER, opacity: p }}>
      {/* lado ANTES */}
      <div style={{ position: "absolute", inset: 0, clipPath: `polygon(0 0, ${split}% 0, ${split - 4}% 100%, 0 100%)`, overflow: "hidden" }}>
        {/* La mitad izquierda medía luma 131 y la derecha 71: casi un diafragma de
            diferencia, así que el lado "después" se veía PEOR. Se emparejan
            primero las exposiciones y recién después se tiñe. */}
        {before && /\.(jpe?g|png|webp)$/i.test(before) ? <Img src={sf(before)!} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.80) contrast(1.05) saturate(0.86)" }} /> : <div style={half("a")} />}
        <div style={{ position: "absolute", inset: 0, background: "#5A3A34", mixBlendMode: "color", opacity: 0.16 }} />
      </div>
      {/* lado DESPUÉS */}
      <div style={{ position: "absolute", inset: 0, clipPath: `polygon(${split}% 0, 100% 0, 100% 100%, ${split - 4}% 100%)`, overflow: "hidden" }}>
        {after && /\.(jpe?g|png|webp)$/i.test(after) ? <Img src={sf(after)!} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(1.28) contrast(1.10)" }} /> : <div style={half("b")} />}
        {/* el tinte va en `color`, nunca como overlay opaco que lava la mitad */}
        <div style={{ position: "absolute", inset: 0, background: "#0E3A3E", mixBlendMode: "color", opacity: 0.18 }} />
      </div>
      {/* divisor diagonal */}
      {/* COSTURA FÍSICA, no un divisor de UI: oclusión que cae a la izquierda +
          canto oscuro de 2px + filo de luz de 1px. La línea cian de 6px con glow
          simétrico era lo único que gritaba "esto es una interfaz". */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `calc(${split}% - 34px)`, width: 34, background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.55))", transform: "skewX(-3deg)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${split}%`, width: 2, background: "rgba(10,14,14,0.92)", boxShadow: "1px 0 0 rgba(226,232,230,0.16)", transform: "skewX(-3deg)" }} />
      {/* el chip "Antes" era el único cálido saturado de todo el sistema: a grafito */}
      <Chip t={labelA} c="rgba(38,40,42,0.92)" side="l" />
      <Chip t={labelB} c="#0E7C76" side="r" />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// 5) MITO vs REALIDAD — dos filas (✕ rojo / ✓ teal)
// ─────────────────────────────────────────────────────────────────────────
export const MitoVsRealidad: React.FC<{ myth: string; fact: string }> = ({ myth, fact }) => {
  const p1 = useIn(0);
  const p2 = useIn(14);
  // ★ Esta escena es a pantalla COMPLETA y no hay sujeto que respetar: las
  //   tarjetas ocupaban el 56% del ancho y el 24% del alto con el cuerpo a 34px.
  //   Si no hay a quién esquivar, achicar es cobardía. Y peor: mito y realidad
  //   pesaban IGUAL, así que el que mira a medias se llevaba EL MITO. La verdad
  //   tiene que ganar de un vistazo → se rompe la simetría a propósito.
  const Row: React.FC<{ p: number; icon: string; label: string; text: string; c: string; muted?: boolean }> = ({ p, icon, label, text, c, muted }) => (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 28,
        background: muted ? `linear-gradient(178deg, #F1F5F5, #E4EBEC)` : SURFACE, backdropFilter: BLUR, WebkitBackdropFilter: BLUR,
        border: `1.5px solid ${c}44`, borderLeft: `8px solid ${c}`, borderRadius: 20,
        padding: `${muted ? PAD : PAD + 14}px ${PAD + 8}px`,
        width: 1600,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-50, 0])}px) scale(${muted ? 0.88 : 1})`,
        transformOrigin: "left center",
        boxShadow: LIFT,
      }}
    >
      <div style={{ width: 74, height: 74, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center", color: ON_ACCENT, fontSize: 44, fontWeight: 900, flexShrink: 0, boxShadow: "0 2px 3px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.35)" }}>{icon}</div>
      <div style={{ position: "relative", flex: 1 }}>
        <div style={{ color: c, fontFamily: F_OSWALD, fontWeight: 700, fontSize: 30, letterSpacing: 3 }}>{label}</div>
        <div style={{ color: muted ? "rgba(13,42,46,0.56)" : W, fontWeight: 700, fontSize: muted ? T_BIG - 8 : T_BIG, lineHeight: 1.16, marginTop: 4, textShadow: TSHADOW }}>{text}</div>
        {/* el tachado es REFUERZO, no protagonista: la equis roja ya dice "falso".
            A 4px sobre el ojo tipográfico destruía el renglón. */}
        {muted && <div style={{ position: "absolute", left: 0, right: "18%", top: "72%", height: 2, background: "rgba(255,59,48,0.7)", transform: `scaleX(${p})`, transformOrigin: "left" }} />}
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER, alignItems: "center", justifyContent: "center", gap: 48 }}>
      <AbsoluteFill style={{ background: `radial-gradient(130% 100% at 25% 15%, #16454C, ${INK0} 74%)` }} />
      <Dither />
      <Row p={p1} icon="✕" label="MITO" text={myth} c={ALERT} muted />
      <Row p={p2} icon="✓" label="REALIDAD" text={fact} c={TEAL} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// 6) DATO CLAVE — badge de esquina con número count-up + etiqueta
// ─────────────────────────────────────────────────────────────────────────
export const DatoClaveBadge: React.FC<{ value: number; suffix?: string; label: string; corner?: "tl" | "tr" }> = ({
  value, suffix, label, corner = "tr",
}) => {
  const f = useCurrentFrame();
  const p = useIn(0);
  const n = Math.round(interpolate(f, [4, 26], [0, value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const pos: React.CSSProperties = corner === "tr" ? { top: SAFE, right: SAFE } : { top: SAFE, left: SAFE };
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER }}>
      <Scrim at="top" opacity={0.8} />
      {/* ★ El único trabajo de este componente es que se recuerde UNA cifra, y lo
          desperdiciaba: el "%" iba de superíndice a 28px sin alinear a baseline
          (o sea "78%" se leía "78", que no significa nada) y la caption iba en
          CAJA ALTA a 22px — la caja alta borra la silueta de la palabra, que es
          justo el atajo de lectura que más se usa cuando baja la agudeza visual.
          Además había 5 elementos donde la consigna del canal es "menos es más":
          se va el chip del ícono. El dato va en ORO, que acá es el color del dato. */}
      {/* Lo que SÍ estaba mal y se queda arreglado: el "%" iba de superíndice sin
          alinear a baseline (o sea "78%" se leía "78"), y la caption iba en CAJA
          ALTA — que borra la silueta de la palabra, el atajo de lectura que más
          se usa cuando baja la agudeza. El ORO es el color del DATO en este kit.
          Lo que NO había que tocar: el tamaño. Es un badge de esquina, no un
          cartel; su gracia es que no compite con el doctor. Y el ícono es marca. */}
      <div style={{ position: "absolute", ...pos, display: "flex", alignItems: "center", gap: 18, background: SURFACE, backdropFilter: BLUR, WebkitBackdropFilter: BLUR, border: `1.5px solid rgba(255,255,255,0.12)`, borderRadius: 22, padding: "18px 28px 18px 20px", opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.86, 1])})`, boxShadow: `${LIFT}, 0 0 40px rgba(216,174,78,0.14)`, maxWidth: 640 }}>
        <div style={{ width: 62, height: 62, borderRadius: 15, background: `linear-gradient(135deg, ${TEAL}, ${TEALd})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "inset 0 2px 8px rgba(255,255,255,0.25)" }}>
          <PulseCross size={36} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ color: GOLD, fontWeight: 800, fontSize: 68, lineHeight: 0.92, letterSpacing: -2, fontVariantNumeric: "tabular-nums", textShadow: TSHADOW }}>{n}</span>
            {suffix && <span style={{ color: GOLD, fontWeight: 800, fontSize: 37, lineHeight: 0.92, textShadow: TSHADOW }}>{suffix}</span>}
          </div>
          <div style={{ color: WREAD, fontWeight: 500, fontSize: T_SECOND, lineHeight: 1.25, marginTop: 4, textShadow: TSHADOW }}>{label}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// 7) CALLOUT FLECHA — flecha animada + etiqueta señalando un punto del b-roll
// ─────────────────────────────────────────────────────────────────────────
export const CalloutFlecha: React.FC<{ text: string; tx?: number; ty?: number; from?: "tl" | "tr" | "bl" | "br" }> = ({
  text, tx = 0.5, ty = 0.5, from = "tl",
}) => {
  const p = useIn(0);
  const draw = interpolate(p, [0, 1], [0, 1]);
  const W_ = 1920, H_ = 1080;
  const X = tx * W_, Y = ty * H_;
  const OFF: Record<string, [number, number]> = { tl: [-260, -170], tr: [260, -170], bl: [-260, 170], br: [260, 170], top: [0, -230], bottom: [0, 230], left: [-320, 0], right: [320, 0] };
  const off = OFF[from as string] || OFF.tr;
  const lx = X + off[0], ly = Y + off[1];
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER }}>
      <svg width={W_} height={H_} style={{ position: "absolute", inset: 0 }}>
        <defs>
                  </defs>
        {/* UN SOLO terminador. Antes había punta de flecha Y círculo en el mismo
            punto, y el círculo era más grande que la punta: dos terminadores
            compitiendo dispersan justo el punto que la flecha existe para señalar. */}
        <path d={`M ${lx} ${ly} Q ${(lx + X) / 2} ${(ly + Y) / 2 - 40} ${X} ${Y}`} fill="none" stroke={TEAL} strokeWidth={5} strokeLinecap="round" strokeDasharray={520} strokeDashoffset={520 * (1 - draw)} style={{ filter: `drop-shadow(0 0 8px ${TEAL})` }} />
        <circle cx={X} cy={Y} r={interpolate(p, [0, 1], [0, 10])} fill={TEALhi} style={{ filter: `drop-shadow(0 0 10px ${TEAL})` }} />
      </svg>
      <div style={{ position: "absolute", left: lx, top: ly, transform: "translate(-50%, -50%)", opacity: p }}>
        <div style={{ background: SURFACE, backdropFilter: BLUR, WebkitBackdropFilter: BLUR, border: `1.5px solid ${TEAL}`, borderRadius: 12, padding: "18px 28px", color: W, fontWeight: 700, fontSize: 36, whiteSpace: "nowrap", textShadow: TSHADOW, boxShadow: `${LIFT}, 0 0 24px rgba(22,199,192,0.2)` }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// DEMO — wrapper que dibuja un fondo clínico + monta un componente por `which`
// (para renderizar stills de aprobación)
// ─────────────────────────────────────────────────────────────────────────
export const BroadcastDemo: React.FC<{ which?: string }> = ({ which = "lowerthird" }) => {
  const bg = (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 30% 20%, #16323b, #0a171c 70%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.5))" }} />
      <div style={{ position: "absolute", right: 120, top: 120, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,199,192,0.10), transparent 70%)" }} />
    </AbsoluteFill>
  );
  let comp: React.ReactNode = null;
  if (which === "lowerthird") comp = <LowerThirdFederer title="El romero borra las manchas" subtitle="Melasma · manchas · arrugas — de noche" />;
  else if (which === "alerta") comp = <AlertaCorner headline="No lo uses de día sin protector" desc="El aceite de romero al sol puede oscurecer más la mancha. Aplícalo solo de noche." />;
  else if (which === "ticker") comp = <TickerAlerta items={["El romero mejora la microcirculación de la piel", "El frasco debe estar 100% seco o fermenta", "Prueba de alergia antes de aplicar en la cara"]} />;
  else if (which === "antesdespues") comp = <AntesDespues />;
  else if (which === "mito") comp = <MitoVsRealidad myth="Las cremas caras borran el melasma" fact="Sin tratar la causa, la mancha siempre vuelve" />;
  else if (which === "dato") comp = <DatoClaveBadge value={15} suffix="días" label="Maceración del aceite" />;
  else if (which === "callout") comp = <CalloutFlecha text="Aquí se acumula la melanina" tx={0.42} ty={0.5} from="tr" />;
  return (
    <AbsoluteFill>
      {bg}
      {comp}
    </AbsoluteFill>
  );
};
