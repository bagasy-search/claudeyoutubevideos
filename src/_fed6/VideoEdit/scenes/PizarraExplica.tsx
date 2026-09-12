import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Media } from "../components/Media";
import { SfxCue } from "../components/Sfx";
import { SFX } from "../components/Sfx";

// ── PizarraExplica ───────────────────────────────────────────────────────────
// Layout que el usuario pidió: AVATAR hablando a la DERECHA (AvatarLayer en modo
// "right") + a la IZQUIERDA una PIZARRA clínica donde van APARECIENDO, escalonados
// mientras el avatar explica, elementos con imagen + texto + gráficos (badge, línea
// espina que se dibuja, subrayado teal, conectores). Look THEME_MEDICO (blanco/teal).
//
// Uso (beat kind "board"):
//   { kind:"board", eyebrow, title, items:[{image?, title, sub?, tone?}], side?:"left" }
// En el Main, poné la ventana del AvatarLayer en "right" (o "left" si side="right").

const C = {
  bg: "#F4F7F9",
  panel: "#FFFFFF",
  ink: "#14232B",
  soft: "rgba(20,35,43,0.66)",
  dim: "rgba(20,35,43,0.40)",
  teal: "#109C99",
  tealSoft: "#7FC9C6",
  blue: "#2E7DB0",
  coral: "#E0523E",
  line: "rgba(16,156,153,0.22)",
};
const FONT = "Inter, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

export type BoardItem = { image?: string; title: string; sub?: string; tone?: "teal" | "blue" | "coral" };

export const PizarraExplica: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  items: BoardItem[];
  side?: "left" | "right";
}> = ({ durationInFrames, eyebrow, title, items, side = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // El avatar ocupa ~760px de un lado; la pizarra toma el resto.
  const BOARD_W = 1010;
  const boardX = side === "left" ? 48 : 1920 - BOARD_W - 48;

  // entrada del panel
  const pin = spring({ frame, fps, config: { damping: 16, mass: 0.7, stiffness: 110 } });
  const panelY = interpolate(pin, [0, 1], [40, 0]);
  const panelOp = interpolate(pin, [0, 1], [0, 1]);

  // tiempos de aparición de cada ítem (escalonado)
  const headDelay = 6;
  const stagger = Math.max(10, Math.min(24, Math.floor((durationInFrames - 40) / Math.max(1, items.length))));
  const itemStart = (i: number) => headDelay + 12 + i * stagger;

  // header
  const headP = spring({ frame: frame - headDelay, fps, config: { damping: 18, stiffness: 120 } });

  // altura de fila según haya imagen
  const hasImg = items.some((it) => it.image);
  const rowH = hasImg ? 150 : 104;
  // El título (58px, peso 900) entra en ~24 caracteres por línea dentro del panel
  // (BOARD_W 1010 − 128 de padding ≈ 882px). Si es más largo, SE PARTE en 2 líneas
  // y su segunda línea pisaba el primer ítem (listTop fijo 210). Empujamos la lista
  // hacia abajo SOLO cuando el título realmente envuelve — los títulos cortos de
  // otros videos siguen en 210 (sin cambio visual para ellos).
  const titleWraps = (title?.length ?? 0) > 24;
  const listTop = titleWraps ? 300 : 210;
  const spineX = 96;

  // progreso de la línea "espina" (se dibuja hasta el último ítem visible)
  let lastVisible = -1;
  for (let i = 0; i < items.length; i++) if (frame >= itemStart(i)) lastVisible = i;
  const spineTargetY = listTop + (lastVisible + 0.5) * rowH;
  const spineTop = listTop - 14;
  const spineDraw = interpolate(frame, [itemStart(0) - 4, itemStart(0) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spineY = spineTop + (spineTargetY - spineTop) * (lastVisible < 0 ? 0 : 1);

  const toneColor = (t?: string) => (t === "blue" ? C.blue : t === "coral" ? C.coral : C.teal);

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent", fontFamily: FONT }}>
      {/* PANEL PIZARRA */}
      <div
        style={{
          position: "absolute",
          left: boardX,
          top: 48,
          width: BOARD_W,
          height: 984,
          transform: `translateY(${panelY}px)`,
          opacity: panelOp,
          background: C.panel,
          borderRadius: 30,
          boxShadow: "0 30px 80px rgba(20,35,43,0.18), 0 2px 0 rgba(16,156,153,0.10)",
          border: "1px solid rgba(20,35,43,0.06)",
          overflow: "hidden",
        }}
      >
        {/* textura de grilla muy sutil */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(16,156,153,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,156,153,0.05) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
            opacity: 0.7,
          }}
        />
        {/* borde superior teal */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: `linear-gradient(90deg, ${C.teal}, ${C.blue})` }} />

        {/* HEADER */}
        <div style={{ position: "absolute", top: 56, left: 64, right: 64, opacity: headP, transform: `translateY(${interpolate(headP, [0, 1], [16, 0])}px)` }}>
          {eyebrow && (
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: C.teal, marginBottom: 12 }}>
              {eyebrow}
            </div>
          )}
          {title && (
            <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.04, color: C.ink, letterSpacing: -0.5 }}>{title}</div>
          )}
          {/* subrayado que se dibuja */}
          <div
            style={{
              marginTop: 18,
              height: 6,
              borderRadius: 4,
              width: interpolate(headP, [0, 1], [0, 260]),
              background: `linear-gradient(90deg, ${C.teal}, ${C.tealSoft})`,
            }}
          />
        </div>

        {/* ESPINA vertical (timeline de la explicación) */}
        <div
          style={{
            position: "absolute",
            left: spineX,
            top: spineTop,
            width: 4,
            height: Math.max(0, (spineY - spineTop) * spineDraw),
            background: `linear-gradient(${C.teal}, ${C.tealSoft})`,
            borderRadius: 4,
            opacity: 0.5,
          }}
        />

        {/* ÍTEMS */}
        {items.map((it, i) => {
          const s0 = itemStart(i);
          const p = spring({ frame: frame - s0, fps, config: { damping: 17, mass: 0.6, stiffness: 130 } });
          if (frame < s0 - 2) return null;
          const rowY = listTop + i * rowH;
          const tone = toneColor(it.tone);
          const appearX = interpolate(p, [0, 1], [34, 0]);
          return (
            <div key={i} style={{ position: "absolute", left: 64, right: 60, top: rowY, opacity: p, transform: `translateX(${appearX}px)` }}>
              {/* nodo sobre la espina */}
              <div
                style={{
                  position: "absolute",
                  left: spineX - 64 - 15,
                  top: (rowH - 34) / 2 - 8,
                  width: 34,
                  height: 34,
                  borderRadius: 20,
                  background: tone,
                  boxShadow: `0 0 0 6px ${C.panel}, 0 0 0 8px ${tone}33`,
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </div>

              {/* fila: (thumb imagen) + textos */}
              <div style={{ display: "flex", alignItems: "center", gap: 26,
                // sin miniatura el texto arrancaba en x=8 y el NODO numerado (x=17..51) le
                // tapaba las primeras letras ("Cierra"->"erra"). Con thumb el nodo pisa la
                // imagen a proposito (badge), asi que solo se corrige el caso sin imagen.
                marginLeft: hasImg ? 8 : (spineX - 64 - 15) + 34 + 22,
                height: rowH - 20 }}>
                {it.image && (
                  <div
                    style={{
                      flex: "0 0 auto",
                      width: 190,
                      height: 122,
                      borderRadius: 18,
                      overflow: "hidden",
                      border: `3px solid ${tone}`,
                      boxShadow: "0 10px 26px rgba(20,35,43,0.18)",
                      transform: `scale(${interpolate(p, [0, 1], [0.9, 1])})`,
                    }}
                  >
                    <Media src={it.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: it.image ? 40 : 44, fontWeight: 850, color: C.ink, lineHeight: 1.08, letterSpacing: -0.3 }}>
                    {it.title}
                  </div>
                  {it.sub && (
                    <div style={{ fontSize: 27, color: C.soft, marginTop: 8, lineHeight: 1.24, fontWeight: 500 }}>{it.sub}</div>
                  )}
                  {/* subrayado teal del ítem activo (barrido) */}
                  <div
                    style={{
                      marginTop: 10,
                      height: 5,
                      borderRadius: 3,
                      width: interpolate(p, [0.4, 1], [0, it.image ? 300 : 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                      background: `${tone}66`,
                    }}
                  />
                </div>
              </div>
              <SfxCue at={s0} src={SFX.kickerType} volume={0.28} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
