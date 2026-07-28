// FocusCards_v2pd88ko0ud8.tsx — componente PROPIO del slug (no toca archivos compartidos).
// Recap numerado: 5 tarjetas flotantes con la imagen BORROSA; cuando el avatar dice
// "uno… dos… tres…" (anclado al ms del caption, en FRAMES relativos al inicio del beat)
// se ENFOCA la que toca — se le quita el blur, sube opacidad, escala y se ilumina con
// borde teal. Las demás siguen borrosas. Regla del canal (2026-07-21).
// ⛔ Cada `image` NECESITA su hermano `_blur.jpg` en disco (scripts/preblur_<slug>.mjs).
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const TEAL = "#12B3AE";
const BG = "#0E1D23";
const F = "Inter, system-ui, sans-serif";

type Item = { image: string; label: string; at: number };

const blurOf = (img: string) => img.replace(/\.(png|jpg|jpeg|webp)$/i, "_blur.jpg");

export const FocusCardsV2pd: React.FC<{ durationInFrames: number; items: Item[]; title?: string }> = ({ items, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let active = -1;
  for (let i = 0; i < items.length; i++) if (frame >= items[i].at) active = i;

  const n = items.length;
  const GAP = 30;
  const CARD_W = Math.min(330, Math.floor((1920 - 180 - GAP * (n - 1)) / n));
  const CARD_H = Math.round(CARD_W * 1.18);
  const totalW = CARD_W * n + GAP * (n - 1);
  const titleOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: F }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 42%, rgba(18,179,174,0.10), transparent 60%)" }} />
      {title ? (
        <div style={{ position: "absolute", top: 92, width: "100%", textAlign: "center", opacity: titleOp }}>
          <div style={{ color: "#8FB6B4", fontSize: 26, letterSpacing: 6, textTransform: "uppercase", fontWeight: 700 }}>Repaso</div>
          <div style={{ color: "#F2F7F6", fontSize: 60, fontWeight: 800, marginTop: 6 }}>{title}</div>
        </div>
      ) : null}

      <div style={{ position: "absolute", top: 292, left: (1920 - totalW) / 2, width: totalW, height: CARD_H + 120, display: "flex", gap: GAP }}>
        {items.map((it, i) => {
          const isActive = i === active;
          const appear = spring({ frame: frame - i * 4, fps, config: { damping: 200 }, durationInFrames: 22 });
          const focus = interpolate(frame, [it.at - 6, it.at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const scale = (0.9 + 0.1 * appear) * (isActive ? 1.06 : 1);
          const y = (1 - appear) * 40;
          const dim = isActive ? 1 : 0.5;
          return (
            <div key={i} style={{ width: CARD_W, transform: `translateY(${y}px) scale(${scale})`, opacity: appear * dim }}>
              <div style={{
                position: "relative", width: CARD_W, height: CARD_H, borderRadius: 20, overflow: "hidden",
                border: `3px solid ${isActive ? TEAL : "rgba(255,255,255,0.10)"}`,
                boxShadow: isActive ? "0 0 0 4px rgba(18,179,174,0.25), 0 18px 50px rgba(0,0,0,0.55)" : "0 10px 30px rgba(0,0,0,0.4)",
              }}>
                <Img src={staticFile(blurOf(it.image))} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.3)" }} />
                <Img src={staticFile(it.image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: focus }} />
                <div style={{ position: "absolute", inset: 0, background: isActive ? "linear-gradient(180deg, rgba(14,29,35,0.05), rgba(14,29,35,0.72))" : "linear-gradient(180deg, rgba(14,29,35,0.35), rgba(14,29,35,0.82))" }} />
                <div style={{
                  position: "absolute", top: 12, left: 12, width: 54, height: 54, borderRadius: 14,
                  background: isActive ? TEAL : "rgba(255,255,255,0.14)", color: isActive ? "#04211F" : "#CFE6E4",
                  fontSize: 33, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center",
                }}>{i + 1}</div>
                <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, color: "#F2F7F6", fontSize: 23, fontWeight: 700, lineHeight: 1.15, textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>{it.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
