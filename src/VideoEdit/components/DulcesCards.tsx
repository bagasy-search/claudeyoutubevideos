import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { Media } from "./Media";
import { SfxCue, SFX, POPS } from "./Sfx";

// ═══════════════════════════════════════════════════════════════════════════
//  DULCES BESPOKE — "cocina de la abuela"
//  Paleta crema/ámbar/caramelo/marrón cálido, serif elegante, sombras suaves,
//  grano de film sutil, viñeta cálida, movimiento LENTO (easeOutCubic / spring
//  suave). El fondo cuando se blurea = el propio asset blureado + oscurecido +
//  viñeta cálida (BlurBackdrop), tal como piden las specs.
// ═══════════════════════════════════════════════════════════════════════════

const AMBER = COLORS.amber; // "#A9794A" sepia/tobacco
const CARAMEL = "#C8904A"; // caramelo dorado (acento cálido de estas cards)
const CREAM = COLORS.bg0; // "#EFE7D3" parchment
const CREAM_HI = "#F7F0DD"; // papel más claro (superficie de tarjetas)
const INK = COLORS.text; // "#2A2620" marrón tinta

const EASE = Easing.bezier(0.22, 1, 0.36, 1); // easeOutCubic-ish, muy suave

// grano de film sutil + viñeta cálida — capa reutilizable que "hornea" el clima.
const WarmGrain: React.FC<{ vignette?: number }> = ({ vignette = 0.9 }) => {
  const frame = useCurrentFrame();
  const jx = Math.sin(frame * 1.9) * 0.6;
  const jy = Math.cos(frame * 2.3) * 0.6;
  return (
    <>
      {/* viñeta cálida */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(78% 74% at 50% 46%, rgba(0,0,0,0) 42%, rgba(38,26,14,${
            0.34 * vignette
          }) 100%)`,
          pointerEvents: "none",
        }}
      />
      {/* wash ámbar sutil arriba (calidez de cocina) */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(201,144,74,0.10), transparent 55%)",
          pointerEvents: "none",
          mixBlendMode: "soft-light",
        }}
      />
      {/* grano de film que tiembla apenas */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 0.5px, transparent 0.5px)",
          backgroundSize: "3px 3px",
          backgroundPosition: `${jx}px ${jy}px`,
          opacity: 0.5,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </>
  );
};

// fondo = asset (foto/clip) blureado + oscurecido + Ken-Burns lentísimo. Cuando
// no hay asset, cae a un degradé cálido de cocina.
const BlurBackdrop: React.FC<{
  src?: string;
  blur?: number;
  darken?: number;
  dur: number;
}> = ({ src, blur = 26, darken = 0.55, dur }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, dur], [1.06, 1.14], {
    extrapolateRight: "clamp",
  });
  if (!src) {
    return (
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 110% at 50% 40%, #3A2C1B 0%, #241A10 60%, #150F08 100%)",
        }}
      />
    );
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Media
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `blur(${blur}px) saturate(0.9) brightness(0.92)`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(20,13,6,${darken})` }} />
    </AbsoluteFill>
  );
};

// marco de FOTO enmarcada, estilo foto vieja: passe-partout crema, sombra suave,
// leve rotación. Aparece con escala 0.9→1 + fade, easing suave.
const FramedPhoto: React.FC<{
  src: string;
  w: number;
  rot?: number;
  inAt?: number;
  dur: number;
}> = ({ src, w, rot = -2, inAt = 4, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - inAt, fps, config: { damping: 20, mass: 0.9, stiffness: 110 } });
  const kb = interpolate(frame, [0, dur], [1.0, 1.05], { extrapolateRight: "clamp" });
  const h = w * 1.14;
  return (
    <div
      style={{
        width: w,
        height: h,
        padding: 14,
        background: `linear-gradient(160deg, ${CREAM_HI}, ${CREAM})`,
        borderRadius: 10,
        boxShadow: `0 30px 70px rgba(30,18,8,0.5), 0 6px 18px rgba(30,18,8,0.35), inset 0 1px 0 rgba(255,255,255,0.6)`,
        transform: `rotate(${rot}deg) scale(${0.9 + s * 0.1})`,
        opacity: s,
        border: "1px solid rgba(42,38,32,0.10)",
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${kb})` }}>
          <Media src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* barnizado cálido + brillo esquina */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,240,215,0.10), rgba(40,26,12,0.14))", pointerEvents: "none" }} />
      </div>
    </div>
  );
};

// subrayado dibujado a mano que barre debajo del título
const HandUnderline: React.FC<{ w: number; at: number; color?: string }> = ({ w, at, color = CARAMEL }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <svg width={w} height={16} style={{ display: "block", marginTop: 6, overflow: "visible" }}>
      <path
        d={`M2 9 C ${w * 0.22} 2, ${w * 0.42} 15, ${w * 0.6} 8 S ${w * 0.86} 3, ${w - 4} 9`}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        style={{ strokeDasharray: w * 1.3, strokeDashoffset: (1 - p) * w * 1.3, filter: "drop-shadow(0 1px 2px rgba(30,18,8,0.35))" }}
      />
    </svg>
  );
};

// ── 1) FICHA DULCE (protagónico) ─────────────────────────────────────────────
// foto enmarcada de un lado + panel de papel crema con NOMBRE (serif + subrayado
// dibujado a mano) + notas en stagger (fade + slide-up). Fondo = clip blureado.
export const FichaDulce: React.FC<{
  durationInFrames: number;
  image: string;
  title: string;
  notes?: string[];
  bg?: string; // clip/foto de fondo a blurear
  side?: "left" | "right"; // lado de la FOTO
  eyebrow?: string;
}> = ({ durationInFrames, image, title, notes = [], bg, side = "left", eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const photoLeft = side === "left";
  const photoW = Math.min(560, width * 0.34);
  const panelIn = spring({ frame: frame - sec(0.5), fps, config: { damping: 22, mass: 1, stiffness: 100 } });
  const titleAt = sec(0.7);
  const titleS = spring({ frame: frame - titleAt, fps, config: { damping: 20, stiffness: 120 } });
  const underlineAt = titleAt + sec(0.35);
  const panelW = Math.min(660, width * 0.4);

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <BlurBackdrop src={bg || image} dur={durationInFrames} blur={30} darken={0.6} />
      <WarmGrain vignette={1} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: photoLeft ? "row" : "row-reverse",
          gap: 56,
          padding: "0 96px",
        }}
      >
        <div style={{ transform: `translateY(${(1 - panelIn) * 10}px)` }}>
          <FramedPhoto src={image} w={photoW} rot={photoLeft ? -2.2 : 2.2} inAt={4} dur={durationInFrames} />
        </div>

        {/* panel de papel crema */}
        <div
          style={{
            width: panelW,
            padding: "44px 48px 48px",
            background: `linear-gradient(155deg, ${CREAM_HI} 0%, ${CREAM} 100%)`,
            borderRadius: 20,
            boxShadow: `0 26px 60px rgba(30,18,8,0.42), inset 0 1px 0 rgba(255,255,255,0.55)`,
            border: "1px solid rgba(42,38,32,0.12)",
            opacity: panelIn,
            transform: `translateY(${(1 - panelIn) * 24}px)`,
          }}
        >
          {eyebrow && (
            <div style={{ fontSize: 20, letterSpacing: 5, textTransform: "uppercase", color: AMBER, fontWeight: 700, marginBottom: 14, opacity: titleS }}>
              {eyebrow}
            </div>
          )}
          <div style={{ fontSize: 64, lineHeight: 1.04, fontWeight: 600, color: INK, opacity: titleS, transform: `translateY(${(1 - titleS) * 14}px)` }}>
            {title}
          </div>
          <HandUnderline w={Math.min(panelW - 96, title.length * 26)} at={underlineAt} />

          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
            {notes.map((n, i) => {
              const at = underlineAt + sec(0.35) + i * sec(0.42);
              const ns = spring({ frame: frame - at, fps, config: { damping: 22, stiffness: 110 } });
              return (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 14, opacity: ns, transform: `translateY(${(1 - ns) * 16}px)` }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: CARAMEL, flex: "0 0 auto", transform: "translateY(-2px)", boxShadow: `0 0 10px ${CARAMEL}88` }} />
                  <span style={{ fontSize: 30, lineHeight: 1.28, color: COLORS.textSoft, fontWeight: 500 }}>{n}</span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      <SfxCue at={4} src={SFX.shutter} volume={0.32} />
      <SfxCue at={sec(0.5)} src={SFX.whoosh} volume={0.22} />
      <SfxCue at={titleAt} src={SFX.click} volume={0.34} />
      {notes.map((_, i) => (
        <SfxCue key={i} at={underlineAt + sec(0.35) + i * sec(0.42)} src={POPS[i % POPS.length]} volume={0.3} />
      ))}
    </AbsoluteFill>
  );
};

// ── 2) ANTES / AHORA ─────────────────────────────────────────────────────────
// wipe diagonal SUAVE: izquierda "ANTES" (casera, tinte dorado), derecha "AHORA"
// (industrial, desaturada fría). Línea divisoria fina que se dibuja + labels.
export const AntesAhora: React.FC<{
  durationInFrames: number;
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}> = ({ durationInFrames, beforeImage, afterImage, beforeLabel = "Antes", afterLabel = "Ahora" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  // el lado AHORA entra con un wipe diagonal desde la derecha
  const wipe = interpolate(frame, [sec(0.3), sec(1.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  // diagonal: clip-path que va del 100% (oculto) al reparto ~52%
  const cut = interpolate(wipe, [0, 1], [110, 52]);
  const skew = 7; // grados de diagonal
  const dx = (height * Math.tan((skew * Math.PI) / 180)) / width * 100;
  // escala base ALTA (1.28+) → recorta banners/watermarks quemados en los bordes de
  // las fotos stock (dulce_de_leche_1 trae un título arriba, _2 una marca de agua).
  const kbA = interpolate(frame, [0, durationInFrames], [1.30, 1.40], { extrapolateRight: "clamp" });
  const kbB = interpolate(frame, [0, durationInFrames], [1.40, 1.30], { extrapolateRight: "clamp" });
  const labIn = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, background: "#150F08" }}>
      {/* ANTES (fondo completo, cálido dorado). transformOrigin abajo → el zoom
          recorta desde ARRIBA y empuja fuera de cuadro los banners del borde superior. */}
      <AbsoluteFill>
        <AbsoluteFill style={{ transform: `scale(${kbA})`, transformOrigin: "50% 78%" }}>
          {/* blur suave (7px): mantiene legible "casero vs industrial" pero disuelve
              cualquier título/marca de agua quemada en las fotos stock. */}
          <Media src={beforeImage} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(7px) saturate(1.14) sepia(0.2) brightness(1.02)" }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "linear-gradient(120deg, rgba(201,144,74,0.22), rgba(120,70,20,0.12))", mixBlendMode: "soft-light" }} />
        <AbsoluteFill style={{ background: "rgba(20,13,6,0.18)" }} />
      </AbsoluteFill>

      {/* AHORA (derecha, desaturada fría) recortado en diagonal */}
      <AbsoluteFill
        style={{
          clipPath: `polygon(${cut - dx}% 0, 110% 0, 110% 110%, ${cut + dx}% 110%)`,
          WebkitClipPath: `polygon(${cut - dx}% 0, 110% 0, 110% 110%, ${cut + dx}% 110%)`,
        }}
      >
        <AbsoluteFill style={{ transform: `scale(${kbB})`, transformOrigin: "50% 78%" }}>
          <Media src={afterImage} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(7px) saturate(0.4) brightness(0.9) contrast(1.03)" }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "linear-gradient(200deg, rgba(120,140,160,0.28), rgba(40,50,60,0.34))", mixBlendMode: "multiply" }} />
        <AbsoluteFill style={{ background: "rgba(18,20,24,0.22)" }} />
      </AbsoluteFill>

      {/* línea divisoria fina que se dibuja, en diagonal */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <line
          x1={(cut - dx) / 100 * width}
          y1={0}
          x2={(cut + dx) / 100 * width}
          y2={height}
          stroke="rgba(247,240,221,0.85)"
          strokeWidth={3}
          style={{ strokeDasharray: height * 1.2, strokeDashoffset: (1 - wipe) * height * 1.2, filter: "drop-shadow(0 0 8px rgba(0,0,0,0.5))" }}
        />
      </svg>

      {/* scrim arriba+abajo FUERTE — sepulta cualquier banner/marca de agua de las
          fotos stock (aparecen en los bordes superior/inferior). */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(12,8,4,0.92) 0%, rgba(12,8,4,0.55) 9%, rgba(12,8,4,0) 22%, rgba(12,8,4,0) 78%, rgba(12,8,4,0.7) 100%)", pointerEvents: "none" }} />
      <WarmGrain vignette={0.85} />

      {/* labels */}
      <div style={{ position: "absolute", left: "9%", top: "50%", transform: `translateY(-50%) translateY(${(1 - labIn(0.6)) * 20}px)`, opacity: labIn(0.6) }}>
        <div style={{ fontSize: 26, letterSpacing: 8, textTransform: "uppercase", color: CARAMEL, fontWeight: 800, textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>{beforeLabel}</div>
        <div style={{ width: 60, height: 4, background: CARAMEL, borderRadius: 2, marginTop: 10, boxShadow: `0 0 12px ${CARAMEL}` }} />
      </div>
      <div style={{ position: "absolute", right: "9%", top: "50%", textAlign: "right", transform: `translateY(-50%) translateY(${(1 - labIn(1.1)) * 20}px)`, opacity: labIn(1.1) }}>
        <div style={{ fontSize: 26, letterSpacing: 8, textTransform: "uppercase", color: "#B9C4CC", fontWeight: 800, textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>{afterLabel}</div>
        <div style={{ width: 60, height: 4, background: "#B9C4CC", borderRadius: 2, marginTop: 10, marginLeft: "auto" }} />
      </div>

      <SfxCue at={sec(0.3)} src={SFX.swish} volume={0.34} />
      <SfxCue at={sec(1.1)} src={SFX.click} volume={0.3} />
    </AbsoluteFill>
  );
};

// ── 3) CITA ABUELA (manuscrita, palabra por palabra sincronizada) ────────────
// frase textual en serif itálica sobre imagen blureada cálida + comilla decorativa.
// Si `words` (con {t, at} en segundos absolutos del clip) viene, sincroniza cada
// palabra a su voz; si no, cae a un stagger parejo.
export const CitaAbuela: React.FC<{
  durationInFrames: number;
  text: string;
  image?: string;
  words?: { t: string; at: number }[]; // at = segundos relativos al inicio de la escena
  fontSize?: number;
}> = ({ durationInFrames, text, image, words, fontSize = 74 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const toks = words && words.length ? words : text.split(/\s+/).filter(Boolean).map((t, i) => ({ t, at: 0.5 + i * 0.28 }));
  const head = spring({ frame, fps, config: { damping: 22 } });
  const charCount = toks.reduce((a, w) => a + w.t.length + 1, 0);
  const fitFs = Math.min(fontSize, Math.max(44, Math.round((1160 * 5.4) / Math.max(charCount, 12))));

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      {/* blur FUERTE + oscurece: además de dar foco al texto, disuelve cualquier
          banner/marca de agua quemada en las fotos stock del fondo. */}
      <BlurBackdrop src={image} dur={durationInFrames} blur={34} darken={0.72} />
      <WarmGrain vignette={1} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 12%" }}>
        {/* comilla decorativa cálida */}
        <div
          style={{
            position: "absolute",
            top: "16%",
            left: "12%",
            fontSize: 300,
            lineHeight: 1,
            color: CARAMEL,
            opacity: head * 0.26,
            fontFamily: "Georgia, serif",
            textShadow: "0 6px 30px rgba(0,0,0,0.5)",
            pointerEvents: "none",
          }}
        >
          &ldquo;
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "baseline",
            gap: "0.18em 0.46em",
            maxWidth: 1220,
            textAlign: "center",
            fontStyle: "italic",
            lineHeight: 1.3,
          }}
        >
          {toks.map((w, i) => {
            const at = Math.round(w.at * fps);
            const s = spring({ frame: frame - at, fps, config: { damping: 20, stiffness: 130 } });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontSize: fitFs,
                  fontWeight: 500,
                  color: CREAM,
                  opacity: s,
                  transform: `translateY(${(1 - s) * 20}px)`,
                  textShadow: "0 3px 20px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)",
                }}
              >
                {w.t}
              </span>
            );
          })}
        </div>

        {/* firma cálida bajo la cita */}
        <div style={{ marginTop: 46, opacity: interpolate(frame - Math.round((toks[toks.length - 1]?.at || 1) * fps), [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ width: 120, height: 2, background: `linear-gradient(90deg, transparent, ${CARAMEL}, transparent)`, margin: "0 auto" }} />
        </div>
      </AbsoluteFill>

      {toks.map((w, i) => (
        <SfxCue key={i} at={Math.round(w.at * fps)} src={SFX.click} volume={0.22} />
      ))}
    </AbsoluteFill>
  );
};

// ── 4) INGREDIENTES FLOTAN ───────────────────────────────────────────────────
// chips/etiquetas suaves que entran y flotan hacia arriba con drift gentil + fade,
// sobre el proceso blureado.
export const IngredientesFlotan: React.FC<{
  durationInFrames: number;
  items: string[];
  image?: string;
  title?: string;
  ats?: number[]; // seg (relativos a la escena) en que entra CADA chip — ms exacto de su palabra
}> = ({ durationInFrames, items, image, title, ats }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const titleS = spring({ frame: frame - sec(0.3), fps, config: { damping: 22 } });

  // posiciones base en calles SEPARADAS a lo ancho + alturas de arranque escalonadas
  // → cada chip sube por su propia columna y nunca se encima con el vecino.
  const n = items.length;
  const lanes = items.map((_, i) => {
    const frac = n === 1 ? 0.5 : i / (n - 1);
    const baseX = width * (0.2 + frac * 0.6); // repartidos 20%..80% del ancho
    const baseY = height * (0.78 - (i % 2) * 0.1); // zig-zag de altura para variar
    return { baseX, baseY };
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <BlurBackdrop src={image} dur={durationInFrames} blur={20} darken={0.5} />
      <WarmGrain vignette={0.9} />

      {title && (
        <div style={{ position: "absolute", top: "12%", width: "100%", textAlign: "center", opacity: titleS, transform: `translateY(${(1 - titleS) * 16}px)` }}>
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: CARAMEL, fontWeight: 700, marginBottom: 8 }}>Con lo de la alacena</div>
          <div style={{ fontSize: 58, fontWeight: 600, color: CREAM, textShadow: "0 3px 18px rgba(0,0,0,0.7)" }}>{title}</div>
        </div>
      )}

      {items.map((it, i) => {
        // born = ms EXACTO de la palabra (ats[i]) si viene; si no, stagger parejo.
        const born = ats && ats[i] != null ? Math.round(ats[i] * fps) : sec(0.5) + i * sec(0.5);
        const life = frame - born;
        const s = spring({ frame: life, fps, config: { damping: 18, stiffness: 90 } });
        const rise = interpolate(life, [0, 90], [0, -130], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
        const drift = Math.sin(life / 26 + i) * 16;
        // desvanece al final de su vuelo
        const fadeOut = interpolate(life, [70, 120], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const { baseX, baseY } = lanes[i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: baseX,
              top: baseY,
              transform: `translate(-50%,-50%) translate(${drift}px, ${rise}px) scale(${0.86 + s * 0.14})`,
              opacity: s * fadeOut,
            }}
          >
            <div
              style={{
                padding: "16px 30px",
                borderRadius: 999,
                background: `linear-gradient(150deg, ${CREAM_HI}, ${CREAM})`,
                border: "1px solid rgba(42,38,32,0.14)",
                boxShadow: `0 16px 36px rgba(30,18,8,0.4), inset 0 1px 0 rgba(255,255,255,0.6)`,
                fontSize: 34,
                fontWeight: 600,
                color: INK,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: CARAMEL, boxShadow: `0 0 10px ${CARAMEL}` }} />
              {it}
            </div>
          </div>
        );
      })}

      {items.map((_, i) => (
        <SfxCue key={i} at={ats && ats[i] != null ? Math.round(ats[i] * fps) : sec(0.5) + i * sec(0.5)} src={POPS[i % POPS.length]} volume={0.3} />
      ))}
    </AbsoluteFill>
  );
};

// ── TOP DULCE (medalla de ranking vintage, abre cada dulce) ──────────────────
// b-roll blureado + viñeta caramelo; NÚMERO gigante en oro foil con un número
// "fantasma" contorneado detrás (profundidad) + barrido de luz al entrar. Contador
// "N.º 1 · de 20" arriba + escalera de 20 muescas que se prenden en dorado según
// index. Listón/laurel finito (vibe medalla antigua). Nombre en serif abajo con
// subrayado dorado dibujado a mano.
const GOLD_HI = "#F6E4A6";
const GOLD = "#D9A94B";
const GOLD_DK = "#9C6E2E";

export const TopDulce: React.FC<{
  durationInFrames: number;
  index: number;
  total?: number;
  title: string;
  image?: string;
  nameAt?: number; // seg relativos a la escena en que aparece el nombre (def: tras el número)
}> = ({ durationInFrames, index, total = 20, title, image, nameAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numS = spring({ frame: frame - sec(0.15), fps, config: { damping: 15, mass: 0.9, stiffness: 130 } });
  // barrido de luz que cruza el número al entrar
  const shine = interpolate(frame, [sec(0.2), sec(1.1)], [-120, 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const railS = spring({ frame: frame - sec(0.4), fps, config: { damping: 24 } });
  const nAt = nameAt != null ? sec(nameAt) : sec(0.85);
  const nameS = spring({ frame: frame - nAt, fps, config: { damping: 22, stiffness: 110 } });
  const num = String(index);

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <BlurBackdrop src={image} dur={durationInFrames} blur={30} darken={0.64} />
      {/* viñeta caramelo un poco más marcada */}
      <AbsoluteFill style={{ background: "radial-gradient(76% 72% at 50% 46%, rgba(0,0,0,0) 40%, rgba(48,28,10,0.5) 100%)", pointerEvents: "none" }} />
      <WarmGrain vignette={0.4} />

      {/* contador fino arriba */}
      <div style={{ position: "absolute", top: "13%", width: "100%", textAlign: "center", opacity: numS }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, fontSize: 26, letterSpacing: 4, color: GOLD_HI, fontWeight: 700, textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>
          <span style={{ fontVariant: "small-caps" }}>N.º {index}</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
          <span style={{ color: "rgba(246,228,166,0.7)" }}>de {total}</span>
        </div>
        {/* escalera de muescas */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
          {Array.from({ length: total }).map((_, i) => {
            const on = i < index;
            const pop = interpolate(railS, [0, 1], [0, 1]) * (i <= index ? 1 : 0.4);
            return (
              <div
                key={i}
                style={{
                  width: i === index - 1 ? 26 : 16,
                  height: 6,
                  borderRadius: 3,
                  background: on ? `linear-gradient(90deg, ${GOLD}, ${GOLD_HI})` : "rgba(246,228,166,0.18)",
                  boxShadow: i === index - 1 ? `0 0 12px ${GOLD}` : "none",
                  opacity: 0.4 + pop * 0.6,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* NÚMERO gigante — fantasma contorneado detrás + oro foil delante */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", opacity: numS, transform: `scale(${0.86 + numS * 0.14}) translateY(${(1 - numS) * 24}px)` }}>
          {/* fantasma contorneado más grande */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "48%",
              transform: "translate(-50%,-50%) scale(1.42)",
              fontSize: 380,
              fontWeight: 700,
              color: "transparent",
              WebkitTextStroke: `2px rgba(246,228,166,0.18)`,
              lineHeight: 0.8,
            }}
          >
            {num}
          </div>
          {/* laurel finito a los lados (medalla antigua) */}
          <svg width={520} height={420} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: 0.5 }}>
            {[-1, 1].map((sgn) => (
              <g key={sgn} transform={`translate(260,210) scale(${sgn},1)`}>
                <path d="M-150 130 C -210 40, -210 -60, -150 -140" fill="none" stroke={GOLD} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
                {Array.from({ length: 7 }).map((_, k) => {
                  const ty = 120 - k * 42;
                  const tx = -150 - Math.sin(k / 6 * Math.PI) * 18 - 6;
                  return <path key={k} d={`M${tx} ${ty} q -26 -8 -34 -26`} fill="none" stroke={GOLD_HI} strokeWidth={3} strokeLinecap="round" opacity={0.6} />;
                })}
              </g>
            ))}
          </svg>
          {/* número foil */}
          <div style={{ position: "relative", overflow: "hidden", display: "inline-block" }}>
            <div
              style={{
                fontSize: 340,
                fontWeight: 700,
                lineHeight: 0.8,
                color: "transparent",
                backgroundImage: `linear-gradient(160deg, ${GOLD_HI} 0%, ${GOLD} 42%, ${GOLD_DK} 70%, ${GOLD_HI} 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                filter: "drop-shadow(0 8px 20px rgba(30,18,8,0.6))",
              }}
            >
              {num}
            </div>
            {/* barrido de luz */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: shine,
                width: 90,
                background: "linear-gradient(100deg, transparent, rgba(255,252,240,0.85), transparent)",
                mixBlendMode: "screen",
                transform: "skewX(-14deg)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* NOMBRE del dulce abajo con subrayado dorado dibujado a mano */}
      <div style={{ position: "absolute", bottom: "12%", width: "100%", textAlign: "center", opacity: nameS, transform: `translateY(${(1 - nameS) * 16}px)` }}>
        <div style={{ fontSize: 66, fontWeight: 600, color: CREAM, textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <HandUnderline w={Math.min(640, title.length * 26)} at={nAt + sec(0.25)} color={GOLD} />
        </div>
      </div>

      <SfxCue at={sec(0.15)} src={SFX.textSlam} volume={0.3} />
      <SfxCue at={sec(0.4)} src={SFX.winnerChime} volume={0.34} />
      <SfxCue at={nAt} src={SFX.click} volume={0.3} />
    </AbsoluteFill>
  );
};

// ── 5) BONUS: NÚMERO GRANDE TEXTURADO (conteo de cada dulce) ─────────────────
// número enorme en serif con textura de papel/caramelo + nombre del dulce, sobre
// fondo blureado. Un abre-sección hermoso y cálido para variar los "rule".
export const NumeroDulce: React.FC<{
  durationInFrames: number;
  number: string;
  name: string;
  total?: string;
  image?: string;
  eyebrow?: string;
}> = ({ durationInFrames, number, name, total = "20", image, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numS = spring({ frame: frame - sec(0.2), fps, config: { damping: 16, mass: 0.9, stiffness: 130 } });
  const nameAt = sec(0.55);
  const nameS = spring({ frame: frame - nameAt, fps, config: { damping: 22, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK }}>
      <BlurBackdrop src={image} dur={durationInFrames} blur={28} darken={0.62} />
      <WarmGrain vignette={1} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {eyebrow && (
          <div style={{ fontSize: 24, letterSpacing: 8, textTransform: "uppercase", color: CARAMEL, fontWeight: 700, marginBottom: 6, opacity: nameS, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
            {eyebrow}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, opacity: numS, transform: `translateY(${(1 - numS) * 26}px) scale(${0.9 + numS * 0.1})` }}>
          <span
            style={{
              fontSize: 340,
              lineHeight: 0.8,
              fontWeight: 700,
              color: "transparent",
              backgroundImage: `linear-gradient(165deg, ${CREAM_HI} 0%, ${CARAMEL} 55%, ${AMBER} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              textShadow: "0 14px 44px rgba(0,0,0,0.45)",
              filter: "drop-shadow(0 3px 8px rgba(30,18,8,0.5))",
            }}
          >
            {number}
          </span>
          <span style={{ fontSize: 90, fontWeight: 600, color: "rgba(247,240,221,0.55)", textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>/{total}</span>
        </div>
        <div style={{ marginTop: 8, opacity: nameS, transform: `translateY(${(1 - nameS) * 16}px)`, textAlign: "center" }}>
          <div style={{ fontSize: 68, fontWeight: 600, color: CREAM, textShadow: "0 4px 20px rgba(0,0,0,0.7)" }}>{name}</div>
          <HandUnderline w={Math.min(560, name.length * 26)} at={nameAt + sec(0.25)} />
        </div>
      </AbsoluteFill>

      <SfxCue at={sec(0.2)} src={SFX.textSlam} volume={0.32} />
      <SfxCue at={nameAt} src={SFX.click} volume={0.32} />
    </AbsoluteFill>
  );
};
