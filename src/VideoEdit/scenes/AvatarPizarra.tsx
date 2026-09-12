import { useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, AbsoluteFill, OffthreadVideo, Img, Easing } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { SfxCue, SFX } from "../components/Sfx";

// ── AVATAR PIZARRA ────────────────────────────────────────────────────────────
// El avatar viene hablando full. Sobre el MISMO video: la cámara hace un zoom+paneo
// suave hacia el lado del avatar (se abre espacio del otro lado), el fondo se OSCURECE
// y BLUREA con animación suave, y en el espacio libre entra un PNG RECORTADO
// (transparente) con animación hermosa + título + cuerpo tipeado + flecha/subrayado
// dibujado. Tomás sigue hablando atenuado detrás → arma la pizarra en vivo.
//
// El clip del avatar se pasa YA RECORTADO a la ventana (split_avatar_diagrams) y se
// reproduce con OffthreadVideo DESDE FRAME 0 (sin deep-seek → no sale negro en el farm).
//
// Modos:  items.length === 1 → HERO (1 PNG grande + título + cuerpo + flecha)
//         items.length  >  1 → COLECCIÓN (entran en secuencia en columna: especies, métodos)
export type PizarraItem = { png: string; title?: string; body?: string };

const easeOutCubic = Easing.out(Easing.cubic);

export const AvatarPizarra: React.FC<{
  durationInFrames: number;
  clip: string; // avatar_clips/<id>.mp4 (recortado a la ventana)
  items: PizarraItem[];
  side?: "right" | "left"; // dónde va el contenido (default derecha) → el avatar se corre al lado opuesto
  eyebrow?: string;
  accent?: string;
}> = ({ durationInFrames, clip, items, side = "right", eyebrow, accent = COLORS.accent }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const hero = items.length <= 1;
  const contentRight = side === "right";

  // ── cámara: zoom suave + paneo hacia el avatar (abre el lado del contenido) ──
  const camT = interpolate(frame, [0, sec(1.1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic });
  // OVERFILL: base 1.06 (cubre el bleed del blur desde frame 0) → 1.20. El paneo NUNCA
  // supera (scale-1)/2·width, así el video del avatar siempre cubre y NO asoma el fondo.
  const scale = 1.06 + 0.14 * camT; // 1.06 → 1.20
  // el avatar se corre hacia el borde OPUESTO al contenido (si contenido a la derecha, Tomás va a la izq)
  const panX = (contentRight ? -1 : 1) * 0.075 * width * camT;

  // ── oscurecer + blurear el fondo (avatar) con animación suave ──
  const dim = interpolate(frame, [sec(0.35), sec(1.15)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blurPx = 7 * dim;

  // ── fade in/out del CONJUNTO de overlay (el avatar NO desaparece) ──
  const inOp = interpolate(frame, [0, sec(0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [durationInFrames - sec(0.45), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(inOp, outOp);

  // ── timing de los items ──
  const firstAt = sec(1.0);
  const perItem = hero ? 0 : Math.max(sec(1.4), (durationInFrames - firstAt - sec(0.6)) / items.length);

  // panel del contenido
  const panelW = hero ? width * 0.42 : width * 0.40;
  const panelLeft = contentRight ? width - panelW - width * 0.045 : width * 0.045;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, background: COLORS.bg1, overflow: "hidden" }}>
      {/* ── FONDO: clip del avatar, zoom+paneo+blur ── */}
      <AbsoluteFill style={{ transform: `translateX(${panX}px) scale(${scale})`, filter: `blur(${blurPx}px)` }}>
        <OffthreadVideo src={staticFile(clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      {/* ── scrim: gradiente que oscurece MÁS del lado del contenido (para que el PNG resalte) ── */}
      <AbsoluteFill
        style={{
          opacity: dim,
          background: contentRight
            ? `linear-gradient(90deg, rgba(20,17,13,0.05) 0%, rgba(20,17,13,0.30) 40%, rgba(20,17,13,0.68) 100%)`
            : `linear-gradient(270deg, rgba(20,17,13,0.05) 0%, rgba(20,17,13,0.30) 40%, rgba(20,17,13,0.68) 100%)`,
        }}
      />
      {/* viñeta cálida sutil */}
      <AbsoluteFill style={{ opacity: dim * 0.9, boxShadow: "inset 0 0 260px rgba(20,17,13,0.5)" }} />

      {/* ── eyebrow ── */}
      {eyebrow && (
        <div style={{ position: "absolute", top: 54, left: contentRight ? panelLeft : undefined, right: contentRight ? undefined : width - panelLeft - panelW, width: panelW, fontSize: 23, fontWeight: 800, letterSpacing: 6, textTransform: "uppercase", color: "rgba(239,231,211,0.82)", opacity: op * dim, textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
          <span style={{ color: accent }}>—</span> {eyebrow}
        </div>
      )}

      {/* ── CONTENIDO ── */}
      {hero ? (
        <HeroContent frame={frame} fps={fps} durationInFrames={durationInFrames} item={items[0]} left={panelLeft} width={panelW} height={height} op={op} accent={accent} firstAt={firstAt} contentRight={contentRight} />
      ) : (
        <div style={{ position: "absolute", top: 118, left: panelLeft, width: panelW, height: height - 180, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, opacity: op }}>
          {items.map((it, i) => (
            <CollectionRow key={i} item={it} frame={frame} fps={fps} at={firstAt + i * perItem} accent={accent} />
          ))}
        </div>
      )}

      {/* SFX: un whoosh suave al abrir la pizarra + tick por item */}
      <SfxCue at={sec(0.35)} src={SFX.sectionSwell} volume={0.16} />
      {items.map((_, i) => (i > 0 || !hero) && <SfxCue key={"it" + i} at={Math.round(firstAt + i * perItem)} src={SFX.kickerType} volume={0.34} />)}
    </AbsoluteFill>
  );
};

// ── HERO: 1 PNG grande + título + cuerpo tipeado + flecha dibujada ──
const HeroContent: React.FC<{ frame: number; fps: number; durationInFrames: number; item: PizarraItem; left: number; width: number; height: number; op: number; accent: string; firstAt: number; contentRight: boolean }> = ({ frame, fps, item, left, width, height, op, accent, firstAt, contentRight }) => {
  const t = frame - firstAt;
  const pop = spring({ frame: t, fps, config: { damping: 14, mass: 0.9, stiffness: 110 } });
  const pngScale = interpolate(pop, [0, 1], [0.82, 1]);
  const pngOp = interpolate(t, [0, sec(0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floatY = Math.sin((frame / fps) * 1.1) * 7; // flote continuo suave

  // título aparece tras el PNG; cuerpo se tipea
  const titleT = t - sec(0.35);
  const titleOp = interpolate(titleT, [0, sec(0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const underline = interpolate(titleT, [sec(0.25), sec(0.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic });
  const body = item.body || "";
  const bodyStart = sec(0.9);
  const shown = Math.max(0, Math.min(body.length, Math.floor((t - bodyStart) / 1.1)));
  const bodyTxt = body.slice(0, shown);

  const pngH = Math.min(height * 0.46, 460);

  return (
    <div style={{ position: "absolute", top: 0, left, width, height, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: op, padding: "0 10px" }}>
      {/* PNG recortado */}
      <div style={{ height: pngH, display: "flex", alignItems: "flex-end", transform: `translateY(${floatY}px) scale(${pngScale})`, opacity: pngOp, filter: "drop-shadow(0 26px 40px rgba(0,0,0,0.55))" }}>
        <Img src={staticFile(item.png)} style={{ maxHeight: pngH, maxWidth: width - 40, objectFit: "contain" }} />
      </div>

      {/* flecha curva dibujada apuntando al PNG */}
      {item.title && (
        <svg width={width} height={90} style={{ marginTop: -6 }}>
          <path
            d={contentRight ? `M ${width * 0.22} 78 C ${width * 0.30} 30, ${width * 0.42} 18, ${width * 0.5} 12` : `M ${width * 0.78} 78 C ${width * 0.70} 30, ${width * 0.58} 18, ${width * 0.5} 12`}
            fill="none" stroke={accent} strokeWidth={4} strokeLinecap="round"
            strokeDasharray={260} strokeDashoffset={260 - 260 * underline}
          />
        </svg>
      )}

      {/* título con subrayado que se dibuja */}
      {item.title && (
        <div style={{ opacity: titleOp, textAlign: "center" }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: "#F3ECDA", lineHeight: 1.05, textShadow: "0 3px 16px rgba(0,0,0,0.65)" }}>{item.title}</div>
          <div style={{ height: 6, marginTop: 8, borderRadius: 4, background: accent, width: `${underline * 100}%`, marginLeft: "auto", marginRight: "auto", boxShadow: `0 0 16px ${accent}` }} />
        </div>
      )}

      {/* cuerpo tipeado */}
      {body && (
        <div style={{ marginTop: 22, fontSize: 30, lineHeight: 1.4, color: "rgba(243,236,218,0.92)", textAlign: "center", maxWidth: width - 30, textShadow: "0 2px 12px rgba(0,0,0,0.6)", fontStyle: "italic" }}>
          {bodyTxt}
          <span style={{ opacity: shown < body.length ? 0.8 : 0, color: accent }}>▌</span>
        </div>
      )}
    </div>
  );
};

// ── COLECCIÓN: una fila (PNG chico + nombre) que entra desde el lado ──
const CollectionRow: React.FC<{ item: PizarraItem; frame: number; fps: number; at: number; accent: string }> = ({ item, frame, fps, at, accent }) => {
  const t = frame - at;
  if (t < -sec(0.3)) return null;
  const pop = spring({ frame: t, fps, config: { damping: 15, mass: 0.8, stiffness: 120 } });
  const x = interpolate(pop, [0, 1], [70, 0]);
  const op = interpolate(t, [0, sec(0.35)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floatY = Math.sin((frame / fps) * 1.2 + at) * 4;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, transform: `translate(${x}px, ${floatY}px)`, opacity: op }}>
      <div style={{ width: 128, height: 128, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", filter: "drop-shadow(0 16px 26px rgba(0,0,0,0.5))" }}>
        <Img src={staticFile(item.png)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
      </div>
      <div>
        {item.title && <div style={{ fontSize: 40, fontWeight: 800, color: "#F3ECDA", lineHeight: 1.05, textShadow: "0 3px 14px rgba(0,0,0,0.65)" }}>{item.title}</div>}
        {item.body && <div style={{ fontSize: 24, color: "rgba(243,236,218,0.85)", marginTop: 4, textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>{item.body}</div>}
        <div style={{ height: 4, marginTop: 8, width: 54, borderRadius: 3, background: accent, boxShadow: `0 0 12px ${accent}` }} />
      </div>
    </div>
  );
};
