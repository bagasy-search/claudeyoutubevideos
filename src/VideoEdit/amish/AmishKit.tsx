import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME_AMISH, type Theme, useTheme } from "../kit/premium/theme";
import { ImgOr, Stage, useBeat } from "../kit/premium/core";
import {
  Grain,
  OnPaper,
  Reflection,
  autoSize,
  slabShadow,
  tilt3d,
  useDrift,
  useInk,
  useKeyLight,
  usePush,
  useRack,
} from "../kit/premium/stagecraft";

// ═══════════════════════════════════════════════════════════════════════════
// AMISH KIT — modo FACELESS del canal Amish/homesteading.
//
// La skill `amish-doc` especificaba estos 8 componentes desde hace tiempo pero
// nunca se habían construido: `Main_amish.tsx` armaba todo inline. Acá nacen ya
// sobre el motor de capas del kit premium (`stagecraft`), así que arrancan con
// profundidad real en vez de tener que rescatarlos después.
//
// ★ TRADUCCIÓN DEL MOTOR AL IDIOMA AMISH. El vocabulario premium es de
//   broadcast: specular, aberración cromática, springs con overshoot, bokeh.
//   Acá la consigna de marca es la opuesta —"sobrios, analógicos, con fade,
//   nada moderno/flashy"— así que se usa la MISMA profundidad técnica con otro
//   vocabulario:
//     · entradas por FADE largo + deriva mínima, nunca springs que rebotan
//     · papel con canto DECKLE irregular, foxing (manchitas de humedad) y fibra
//     · sombras de objeto real y una sola luz (eso sí se conserva: es física)
//     · desgaste de película encima de todo (`FilmWear`) = el aire investigativo
//     · CERO aberración cromática, cero bokeh, cero brillo especular moderno
//
// Pacing: este canal respira. Las entradas son de ~22-30 frames, no de 8.
// ═══════════════════════════════════════════════════════════════════════════

const A = (theme?: Theme) => theme ?? THEME_AMISH;

/** azar determinístico local (mismo LCG que el resto del kit) */
const rnd = (i: number, salt = 0): number =>
  (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

/** fade largo y parejo — la entrada canónica del canal (nada de springs) */
const useFade = (at: number, dur = 26) => {
  const frame = useCurrentFrame();
  return interpolate(frame - at, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// ── AgedPaper — el sustrato de TODO el kit ──────────────────────────────────
// No es un rectángulo beige: tiene canto deckle (borde irregular de papel hecho
// a mano), foxing, fibra, y una sombra de objeto real proyectada sobre el metraje.
export const AgedPaper: React.FC<{
  theme?: Theme;
  at?: number;
  seed?: number;
  /** 0 = borde recto, 1 = deckle marcado */
  deckle?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ theme, at = 0, seed = 0, deckle = 1, style, children }) => {
  const t = useTheme(A(theme));
  const frame = useCurrentFrame();
  const light = useKeyLight("center");
  const p = useFade(at, 24);

  // canto deckle: polígono con ondulación determinista por lado
  const pts: string[] = [];
  const N = 14;
  const amp = 1.1 * deckle;
  for (let i = 0; i <= N; i++) pts.push(`${(i / N) * 100}% ${(rnd(i, seed) * amp).toFixed(2)}%`);
  for (let i = 0; i <= N; i++) pts.push(`${100 - rnd(i, seed + 3) * amp}% ${(i / N) * 100}%`);
  for (let i = N; i >= 0; i--) pts.push(`${(i / N) * 100}% ${100 - rnd(i, seed + 6) * amp}%`);
  for (let i = N; i >= 0; i--) pts.push(`${(rnd(i, seed + 9) * amp).toFixed(2)}% ${(i / N) * 100}%`);
  const clip = `polygon(${pts.join(",")})`;

  return (
    <div
      style={{
        position: "relative",
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
        filter: `drop-shadow(${slabShadow(light, { lift: 1.2 }).split(",")[2] ?? "0 20px 40px rgba(0,0,0,0.4)"})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: clip,
          background: `
            radial-gradient(58% 44% at 22% 18%, ${t.color.surfaceStrong} 0%, rgba(0,0,0,0) 60%),
            linear-gradient(168deg, #F7F0DE 0%, ${t.color.bg0} 46%, ${t.color.bg2} 100%)`,
          boxShadow: `inset 0 0 90px rgba(120,96,62,0.22), inset 0 0 22px rgba(120,96,62,0.14)`,
        }}
      >
        {/* foxing: las manchitas de humedad del papel viejo */}
        {Array.from({ length: 9 }, (_, i) => {
          const r = 30 + rnd(i, seed + 11) * 90;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${rnd(i, seed + 12) * 96}%`,
                top: `${rnd(i, seed + 13) * 94}%`,
                width: r,
                height: r * (0.7 + rnd(i, seed + 14) * 0.6),
                borderRadius: "50%",
                background: `radial-gradient(circle, rgba(150,112,64,${0.05 + rnd(i, seed + 15) * 0.06}) 0%, rgba(0,0,0,0) 70%)`,
                filter: "blur(6px)",
              }}
            />
          );
        })}
        {/* fibra del papel */}
        <Grain theme={t} amount={0.09} />
        {/* luz raspando el papel: lo separa del fondo sin brillo "moderno" */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(${(100 + Math.sin(frame / 240) * 6).toFixed(1)}deg, rgba(255,252,240,0.34) 0%, rgba(255,252,240,0) 42%)`,
          }}
        />
      </div>
      <div style={{ position: "relative" }}>
        <OnPaper>{children}</OnPaper>
      </div>
    </div>
  );
};

// ── 8 · FilmWear — la capa que da el aire investigativo/histórico ────────────
// Va ENCIMA de casi todos los clips. Viñeta extrema + grano + parpadeo de
// proyector. Sin temblor de cámara: el canal lo tiene prohibido, y además el
// weave de puerta es un artefacto de proyección, no de mano.
export const FilmWear: React.FC<{ theme?: Theme; strength?: number }> = ({ theme, strength = 1 }) => {
  const t = useTheme(A(theme));
  const frame = useCurrentFrame();
  // parpadeo de lámpara: muy leve, determinista, sin patrón audible
  const flicker = 1 - (rnd(frame % 17, 2) * 0.035 + rnd(frame % 7, 5) * 0.02) * strength;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: (1 - flicker) * 0.9 }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(108% 82% at 50% 46%, rgba(0,0,0,0) 38%, rgba(28,20,10,${0.34 * strength}) 76%, rgba(18,12,6,${0.72 * strength}) 100%)`,
        }}
      />
      {/* sangrado cálido: el metraje viejo nunca es neutro */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: "multiply",
          background: `linear-gradient(160deg, rgba(214,186,140,${0.1 * strength}), rgba(120,86,44,${0.16 * strength}))`,
        }}
      />
      <Grain theme={t} amount={0.16 * strength} />
    </div>
  );
};

// ── 1 · ParchmentCard — LA firma visual. Para CADA dato clave. ───────────────
export const ParchmentCard: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  body?: string;
  image?: string;
  /** posición en el frame */
  side?: "left" | "right" | "center";
}> = ({ durationInFrames, theme, title = "", body = "", image, side = "left" }) => {
  const t = useTheme(A(theme));
  const { op } = useBeat(durationInFrames, { outLen: 14 });
  const drift = useDrift(0.3, 3);
  const push = usePush(durationInFrames, 0.02);
  const bodyP = useFade(18, 30);
  const W = 980;
  const pos =
    side === "left" ? { left: 150 } : side === "right" ? { right: 150 } : { left: "50%", marginLeft: -W / 2 };

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          ...pos,
          width: W,
          transform: `translateY(-50%) translate(${drift.x * 0.5}px, ${drift.y * 0.5}px) scale(${push})`,
        }}
      >
        <AgedPaper theme={t} at={2} seed={4} style={{ padding: "56px 64px" }}>
          {image && (
            <div
              style={{
                width: "100%",
                height: 340,
                marginBottom: 34,
                overflow: "hidden",
                border: `8px solid ${t.color.ink}`,
                filter: "sepia(0.32) saturate(0.82) contrast(1.04)",
              }}
            >
              <ImgOr src={image} seed={9} theme={t} />
            </div>
          )}
          {title && (
            <div
              style={{
                fontFamily: t.fontDisplay,
                fontSize: autoSize(title, 62, 34, 40),
                fontWeight: 700,
                color: t.color.text,
                lineHeight: 1.14,
                letterSpacing: -0.3,
              }}
            >
              {title}
            </div>
          )}
          {title && body && (
            <div style={{ height: 2, background: t.color.gold, opacity: 0.5, margin: "24px 0 22px", width: `${60 + bodyP * 40}%` }} />
          )}
          {body && (
            <div
              style={{
                fontFamily: t.fontBody,
                fontSize: autoSize(body, 36, 120, 28),
                color: t.color.textSoft,
                lineHeight: 1.45,
                opacity: bodyP,
              }}
            >
              {body}
            </div>
          )}
        </AgedPaper>
      </div>
      <FilmWear theme={t} strength={0.7} />
    </Stage>
  );
};

// ── 2 · BigNumber — cifra gigante sobre el metraje ──────────────────────────
export const BigNumber: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  value?: string;
  label?: string;
  sub?: string;
}> = ({ durationInFrames, theme, value = "", label = "", sub = "" }) => {
  const t = useTheme(A(theme));
  const { op } = useBeat(durationInFrames, { outLen: 16 });
  const p = useFade(4, 34);
  const labelP = useFade(20, 28);
  const push = usePush(durationInFrames, 0.05);
  // el número NO entra con spring: se revela como una impresión que aparece
  const size = autoSize(value, 340, 5, 150);

  return (
    <Stage theme={t} style={{ opacity: op }}>
      {/* el metraje se hunde para que la cifra respire */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(24,17,8,0.5)" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${push})`,
        }}
      >
        {label && (
          <div
            style={{
              fontFamily: t.fontLabel,
              fontSize: 34,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#E8C88A",
              opacity: labelP,
              marginBottom: 18,
              textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.8)",
            }}
          >
            {label}
          </div>
        )}
        <div
          style={{
            fontFamily: t.fontDisplay,
            fontSize: size,
            fontWeight: 700,
            color: "#F6EEDA",
            lineHeight: 0.94,
            letterSpacing: -6,
            opacity: p,
            // la tinta "cala" en el papel: sombra corta dura + halo largo
            textShadow: "0 3px 0 rgba(60,40,18,0.55), 0 16px 44px rgba(0,0,0,0.7), 0 44px 110px rgba(0,0,0,0.5)",
            transform: `translateY(${(1 - p) * 16}px)`,
          }}
        >
          {value}
        </div>
        {sub && (
          <div
            style={{
              fontFamily: t.fontBody,
              fontSize: 38,
              color: "rgba(246,238,218,0.82)",
              marginTop: 26,
              opacity: labelP,
              textShadow: "0 2px 12px rgba(0,0,0,0.75)",
              maxWidth: 1200,
              textAlign: "center",
              lineHeight: 1.32,
            }}
          >
            {sub}
          </div>
        )}
      </div>
      <FilmWear theme={t} />
    </Stage>
  );
};

// ── 3 · PaperChart — barras que se dibujan, tierra sólida, sin ejes ─────────
export type PaperRow = { label: string; value: number; accent?: string };
export const PaperChart: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  unit?: string;
  rows?: PaperRow[];
}> = ({ durationInFrames, theme, title = "", unit = "", rows = [] }) => {
  const t = useTheme(A(theme));
  const { op } = useBeat(durationInFrames, { outLen: 14 });
  const frame = useCurrentFrame();
  const max = Math.max(1, ...rows.map((r) => r.value));
  const earth = ["#A8562F", "#8A6B3A", "#6E7A4A", "#9C7B45", "#7A4A32"];
  const rack = useRack(rows.length, durationInFrames, { blur: 1.4, dim: 0.2, shrink: 0.01 });

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(24,17,8,0.42)" }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 1300, transform: "translate(-50%,-50%)" }}>
        <AgedPaper theme={t} at={0} seed={17} style={{ padding: "52px 62px" }}>
          {title && (
            <div style={{ fontFamily: t.fontDisplay, fontSize: autoSize(title, 56, 32, 38), fontWeight: 700, color: t.color.text, marginBottom: 38 }}>
              {title}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            {rows.map((r, i) => {
              const at = 10 + i * 16;
              const grow = interpolate(frame - at, [0, 34], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const f = rack(i);
              const col = r.accent ?? earth[i % earth.length];
              return (
                <div key={i} style={{ opacity: f.opacity, filter: f.blur > 0.2 ? `blur(${f.blur.toFixed(2)}px)` : undefined }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontFamily: t.fontBody, fontSize: 32, color: t.color.text }}>{r.label}</span>
                    <span style={{ fontFamily: t.fontDisplay, fontSize: 36, fontWeight: 700, color: col }}>
                      {Math.round(r.value * grow)}
                      {unit}
                    </span>
                  </div>
                  <div style={{ height: 26, background: "rgba(90,70,44,0.16)", position: "relative", overflow: "hidden" }}>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: `${(r.value / max) * 100 * grow}%`,
                        background: `linear-gradient(180deg, ${col}, ${col}CC)`,
                        boxShadow: `inset 0 -3px 0 rgba(0,0,0,0.22), 2px 3px 0 rgba(60,44,24,0.3)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </AgedPaper>
      </div>
      <FilmWear theme={t} strength={0.7} />
    </Stage>
  );
};

// ── 4 · SectionDiagram — corte transversal con pasos numerados ──────────────
export type SectionStep = { text: string; tx: number; ty: number };
export const SectionDiagram: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  image?: string;
  steps?: SectionStep[];
}> = ({ durationInFrames, theme, title = "", image, steps = [] }) => {
  const t = useTheme(A(theme));
  const { op } = useBeat(durationInFrames, { outLen: 14 });
  const light = useKeyLight("center");
  const frame = useCurrentFrame();
  const W = 900;
  const H = 560;
  const rack = useRack(steps.length, durationInFrames, { blur: 1.6, dim: 0.24, shrink: 0.012 });

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(24,17,8,0.46)" }} />
      {title && (
        <div style={{ position: "absolute", top: 92, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontFamily: t.fontDisplay, fontSize: autoSize(title, 60, 34, 40), fontWeight: 700, color: "#F4ECD8", textShadow: "0 3px 14px rgba(0,0,0,0.7)" }}>
            {title}
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: "50%", top: 268, width: W, marginLeft: -W / 2 }}>
        <div
          style={{
            position: "relative",
            width: W,
            height: H,
            border: `10px solid ${t.color.ink}`,
            overflow: "hidden",
            filter: "sepia(0.34) saturate(0.8) contrast(1.05)",
            boxShadow: slabShadow(light, { lift: 1.5 }),
            transform: tilt3d({ amount: 0.35, seed: 2, frame }),
          }}
        >
          <ImgOr src={image} seed={31} theme={t} />
        </div>
        {/* pasos numerados. ★ Los rótulos NO cuelgan del punto: viven en COLUMNAS
            fijas en los márgenes y una línea en codo los une con la lámina. Colgarlos
            del punto los hacía chocar entre sí, envolverse en 3 líneas y —el peor
            caso— caer ENCIMA de la imagen, ilegibles. Un corte anatómico de verdad
            se rotula así. */}
      </div>
      {steps.map((st, i) => {
        const at = 16 + i * 20;
        const p = interpolate(frame - at, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const f = rack(i);
        const IMG_X = 960 - W / 2;
        const px = IMG_X + st.tx * W;
        const py = 268 + st.ty * H;
        const left = st.tx < 0.5;
        const GUT = 470; // borde interno de la columna de rótulos
        const lx = left ? GUT : 1920 - GUT;
        return (
          <React.Fragment key={i}>
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
              {/* codo: sale horizontal del rótulo y baja/sube al punto */}
              <path
                d={`M ${lx} ${py} L ${lx + (left ? 1 : -1) * (Math.abs(px - lx) - 26) * p} ${py}`}
                stroke={t.color.gold}
                strokeWidth={3}
                fill="none"
                opacity={p * 0.85}
              />
              <circle cx={px} cy={py} r={9} fill={t.color.gold} stroke="#2A2014" strokeWidth={3} opacity={p} />
            </svg>
            <div
              style={{
                position: "absolute",
                top: py - 34,
                ...(left ? { right: 1920 - GUT + 22 } : { left: 1920 - GUT + 22 }),
                width: 400,
                opacity: p * f.opacity,
                filter: f.blur > 0.2 ? `blur(${f.blur.toFixed(2)}px)` : undefined,
                display: "flex",
                alignItems: "center",
                gap: 18,
                flexDirection: left ? "row-reverse" : "row",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: t.color.accent,
                  border: `3px solid ${t.color.ink}`,
                  color: "#F7F1E0",
                  fontFamily: t.fontDisplay,
                  fontWeight: 700,
                  fontSize: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: slabShadow(light, { lift: 1 }),
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  fontFamily: t.fontBody,
                  fontSize: 32,
                  color: "#F4ECD8",
                  lineHeight: 1.24,
                  textAlign: left ? "right" : "left",
                  textShadow: "0 2px 10px rgba(0,0,0,0.85)",
                  flex: 1,
                }}
              >
                {st.text}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <FilmWear theme={t} strength={0.8} />
    </Stage>
  );
};

// ── 5 · ChecklistCard — bullets con tildes sobre pergamino ──────────────────
export const ChecklistCard: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  items?: string[];
}> = ({ durationInFrames, theme, title = "", items = [] }) => {
  const t = useTheme(A(theme));
  const { op } = useBeat(durationInFrames, { outLen: 14 });
  const frame = useCurrentFrame();
  const rack = useRack(items.length, durationInFrames, { blur: 1.5, dim: 0.2, shrink: 0.012 });
  const drift = useDrift(0.22, 7);

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(24,17,8,0.42)" }} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1180,
          transform: `translate(-50%,-50%) translate(${drift.x * 0.4}px, ${drift.y * 0.4}px)`,
        }}
      >
        <AgedPaper theme={t} at={0} seed={23} style={{ padding: "54px 66px" }}>
          {title && (
            <div style={{ fontFamily: t.fontDisplay, fontSize: autoSize(title, 56, 32, 38), fontWeight: 700, color: t.color.text, marginBottom: 12 }}>
              {title}
            </div>
          )}
          <div style={{ height: 2, background: t.color.ink, opacity: 0.28, marginBottom: 34 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {items.map((it, i) => {
              const at = 12 + i * 18;
              const p = interpolate(frame - at, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const f = rack(i);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 22,
                    opacity: p * f.opacity,
                    filter: f.blur > 0.2 ? `blur(${f.blur.toFixed(2)}px)` : undefined,
                  }}
                >
                  {/* tilde dibujada a pluma, no un icono */}
                  <svg width={44} height={44} viewBox="0 0 40 40" style={{ flexShrink: 0, marginTop: 4 }}>
                    <path
                      d="M 8 21 L 16 29 L 32 9"
                      fill="none"
                      stroke={t.color.accent}
                      strokeWidth={5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={48}
                      strokeDashoffset={48 * (1 - p)}
                    />
                  </svg>
                  <div style={{ fontFamily: t.fontBody, fontSize: autoSize(it, 38, 52, 30), color: t.color.text, lineHeight: 1.28 }}>
                    {it}
                  </div>
                </div>
              );
            })}
          </div>
        </AgedPaper>
      </div>
      <FilmWear theme={t} strength={0.7} />
    </Stage>
  );
};

// ── 6 · CornerLabel — placa chica de dato ambiental ─────────────────────────
export const CornerLabel: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  text?: string;
  sub?: string;
  corner?: "tl" | "tr" | "bl" | "br";
}> = ({ durationInFrames, theme, text = "", sub = "", corner = "bl" }) => {
  const t = useTheme(A(theme));
  const { op } = useBeat(durationInFrames, { outLen: 12 });
  const p = useFade(3, 22);
  const M = 96;
  const pos: React.CSSProperties =
    corner === "tl" ? { top: M, left: M } : corner === "tr" ? { top: M, right: M } : corner === "br" ? { bottom: M, right: M } : { bottom: M, left: M };

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <div style={{ position: "absolute", ...pos, opacity: p, transform: `translateY(${(1 - p) * 8}px)` }}>
        <AgedPaper theme={t} at={0} seed={41} deckle={0.6} style={{ padding: "20px 30px", minWidth: 260 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 10, height: 44, background: t.color.accent, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: t.fontDisplay, fontSize: 42, fontWeight: 700, color: t.color.text, lineHeight: 1.05 }}>{text}</div>
              {sub && (
                <div style={{ fontFamily: t.fontLabel, fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: t.color.textSoft, marginTop: 3 }}>
                  {sub}
                </div>
              )}
            </div>
          </div>
        </AgedPaper>
      </div>
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 200px rgba(0,0,0,0.34)`, pointerEvents: "none" }} />
    </Stage>
  );
};

// ── 7 · QuoteCard — cita de manual / comentario, sobre pergamino ────────────
export const QuoteCard: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  quote?: string;
  source?: string;
}> = ({ durationInFrames, theme, quote = "", source = "" }) => {
  const t = useTheme(A(theme));
  const { op } = useBeat(durationInFrames, { outLen: 14 });
  const srcP = useFade(26, 26);
  const drift = useDrift(0.26, 11);
  const push = usePush(durationInFrames, 0.02);

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(24,17,8,0.46)" }} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1240,
          transform: `translate(-50%,-50%) translate(${drift.x * 0.5}px, ${drift.y * 0.5}px) scale(${push})`,
        }}
      >
        <AgedPaper theme={t} at={0} seed={53} style={{ padding: "64px 74px" }}>
          <div
            style={{
              fontFamily: t.fontDisplay,
              fontSize: 190,
              lineHeight: 0.6,
              color: t.color.gold,
              opacity: 0.36,
              height: 60,
            }}
          >
            &ldquo;
          </div>
          <div
            style={{
              fontFamily: t.fontDisplay,
              fontSize: autoSize(quote, 54, 130, 36),
              fontStyle: "italic",
              fontWeight: 600,
              color: t.color.text,
              lineHeight: 1.38,
            }}
          >
            {quote}
          </div>
          {source && (
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 34, opacity: srcP }}>
              <div style={{ width: 70, height: 2, background: t.color.ink, opacity: 0.5 }} />
              <div style={{ fontFamily: t.fontLabel, fontSize: 27, letterSpacing: 2, color: t.color.textSoft }}>{source}</div>
            </div>
          )}
        </AgedPaper>
      </div>
      <FilmWear theme={t} strength={0.75} />
    </Stage>
  );
};

/** Reflejo reexportado por comodidad para composiciones bespoke del canal */
export { Reflection, useInk };
