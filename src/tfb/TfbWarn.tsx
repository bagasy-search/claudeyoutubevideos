// TfbWarn — seguridad a la vista: fichas con íconos dibujados en SVG (guantes, lentes, máscara, ventana, disco) que
// entran de a una, y la variante "NUNCA" (dos elementos tachados en rojo: p.ej. ÁCIDO + CLORO). Rótulos por props.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TFB, F_DISPLAY, F_SANS, clamp } from "./theme";

export type WarnIcon = "guantes" | "lentes" | "mascara" | "ventana" | "disco" | "acido" | "cloro" | "piedra";
const Icon: React.FC<{ k: WarnIcon; c?: string }> = ({ k, c = TFB.ink }) => {
  const s = { fill: "none", stroke: c, strokeWidth: 7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (k) {
    case "guantes": return <g {...s}><path d="M30 92 L30 50 Q30 40 38 40 Q46 40 46 50 L46 30 Q46 22 53 22 Q60 22 60 30 L60 26 Q60 18 67 18 Q74 18 74 26 L74 34 Q74 28 80 28 Q87 28 87 36 L87 70 Q87 92 66 96 L42 96 Q30 96 30 92 Z" /></g>;
    case "lentes": return <g {...s}><circle cx="34" cy="58" r="18" /><circle cx="80" cy="58" r="18" /><path d="M52 56 Q57 50 62 56 M16 54 L6 44 M98 54 L108 44" /></g>;
    case "mascara": return <g {...s}><path d="M20 48 Q57 28 94 48 L90 76 Q57 100 24 76 Z M20 52 L6 44 M94 52 L108 44 M36 62 L78 62 M40 74 L74 74" /></g>;
    case "ventana": return <g {...s}><rect x="22" y="18" width="70" height="80" rx="4" /><path d="M57 18 L57 98 M22 58 L92 58" /><path d="M96 40 Q108 48 96 56 M100 64 Q112 72 100 80" /></g>;
    case "disco": return <g {...s}><circle cx="57" cy="57" r="40" /><circle cx="57" cy="57" r="10" /><path d="M57 17 L57 27 M57 87 L57 97 M17 57 L27 57 M87 57 L97 57 M29 29 L36 36 M78 78 L85 85 M29 85 L36 78 M78 36 L85 29" /></g>;
    case "acido": return <g {...s}><path d="M40 18 L74 18 M46 18 L46 44 L24 94 L90 94 L68 44 L68 18" /><path d="M34 74 L80 74" /></g>;
    case "cloro": return <g {...s}><path d="M44 14 L70 14 L70 28 L82 40 L82 98 L32 98 L32 40 L44 28 Z" /><path d="M44 62 L70 62 M57 50 L57 74" /></g>;
    case "piedra": return <g {...s}><path d="M22 70 Q18 40 46 34 Q70 22 90 44 Q102 66 82 84 Q54 98 30 86 Z" /><circle cx="48" cy="56" r="3" /><circle cx="66" cy="64" r="3" /><circle cx="58" cy="44" r="3" /></g>;
  }
};

export type TfbWarnProps = { items: { icon: WarnIcon; label: string }[]; mode?: "row" | "never"; step?: number; dur: number; title?: string };

export const TfbWarn: React.FC<TfbWarnProps> = ({ items, mode = "row", step = 7, dur, title }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(f, [dur - 8, dur], [0, 1], clamp);
  if (mode === "never") {
    const a = spring({ frame: f, fps, config: { damping: 14 } }), x = interpolate(f, [14, 22], [0, 1], clamp);
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: 1 - out }}>
        <div style={{ position: "relative", background: "rgba(16,17,20,0.9)", borderRadius: 26, padding: "34px 56px", border: `6px solid ${TFB.red}`, transform: `scale(${0.7 + 0.3 * a})`, boxShadow: TFB.shadow, textAlign: "center" }}>
          <div style={{ fontFamily: F_DISPLAY, fontSize: 88, color: TFB.red, letterSpacing: 4, lineHeight: 1 }}>{title || "NUNCA"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 20 }}>
            {items.map((it, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ fontFamily: F_DISPLAY, fontSize: 90, color: "#fff" }}>+</div>}
                <div style={{ position: "relative", width: 150, textAlign: "center" }}>
                  <div style={{ width: 130, height: 130, margin: "0 auto", borderRadius: 24, background: "#fff" }}><svg viewBox="0 0 114 114" width={130} height={130}><Icon k={it.icon} /></svg></div>
                  <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 40, color: "#fff", marginTop: 8 }}>{it.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div style={{ position: "absolute", left: 40, right: 40, top: "58%", height: 12, background: TFB.red, borderRadius: 6, transform: `rotate(-12deg) scaleX(${x})`, transformOrigin: "0 50%", boxShadow: "0 3px 10px rgba(0,0,0,.5)" }} />
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ opacity: 1 - out, pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 60, top: 60, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end" }}>
        {title && <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: TFB.yellow, textShadow: TFB.textShadow }}>{title}</div>}
        {items.map((it, i) => {
          const a = spring({ frame: f - i * step, fps, config: { damping: 14, stiffness: 170 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(16,17,20,0.86)", borderRadius: 16, padding: "10px 24px 10px 12px", borderLeft: `8px solid ${TFB.yellow}`, transform: `translateX(${(1 - a) * 420}px)`, opacity: a, boxShadow: TFB.shadow }}>
              <div style={{ width: 78, height: 78, borderRadius: 14, background: TFB.yellow }}><svg viewBox="0 0 114 114" width={78} height={78}><Icon k={it.icon} /></svg></div>
              <div style={{ fontFamily: F_DISPLAY, fontSize: 50, color: "#fff", letterSpacing: 1 }}>{it.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
