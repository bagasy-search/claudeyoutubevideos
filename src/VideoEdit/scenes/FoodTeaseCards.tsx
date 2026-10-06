import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile, OffthreadVideo, Easing } from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// Apertura CINEMATOGRÁFICA (oner): la cámara VUELA sin cortes por una hilera de
// tarjetas-foto 3D sobre fondo oscuro con viñeta, parándose en cada plato. La tarjeta
// enfocada se adelanta, se ilumina (halo cálido + vapor) y se vuelve nítida; las demás
// recede, se oscurecen y se desenfocan. Título serif con subrayado que se dibuja.
export type TeaseCard = { src: string; label?: string };
const isVid = (s: string) => /\.(mp4|webm|mov)$/i.test(s);

export const FoodTeaseCards: React.FC<{
  durationInFrames: number;
  cards: TeaseCard[];
  eyebrow?: string;
  title?: string;
}> = ({ durationInFrames, cards, eyebrow = "Algunas merecen volver…", title = "¿Cuántas te acordás?" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const n = cards.length;

  // glide: la cámara recorre de la 1ª a la última tarjeta, con arranque/cierre suaves
  const focusF = interpolate(frame, [0, durationInFrames - 8], [0, n - 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  // geometría de la hilera
  const cw = Math.min(440, width * 0.27);
  const ch = cw * 1.16;
  const step = cw * 1.18; // separación entre centros
  const camX = width / 2 - (focusF * step) - cw / 2; // centra la tarjeta enfocada
  const pushIn = interpolate(frame, [0, durationInFrames], [1.0, 1.07]); // dolly-in lento

  // título
  const tIn = spring({ frame: frame - 4, fps, config: { damping: 22 } });
  const tOut = interpolate(frame, [durationInFrames - 20, durationInFrames - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tOp = tIn * (1 - tOut);
  const underline = interpolate(spring({ frame: frame - 16, fps, config: { damping: 26 } }), [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 120% at 50% 42%, #2B2218 0%, #1C1711 60%, #100C08 100%)` }}>
      {/* viñeta fílmica */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 320px 90px rgba(0,0,0,0.7)", pointerEvents: "none" }} />

      {/* CÁMARA: hilera de tarjetas que se desliza */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1600 }}>
        <div style={{ position: "absolute", top: height * 0.5 - ch * 0.5, left: 0, transform: `translateX(${camX}px) scale(${pushIn})`, transformStyle: "preserve-3d" }}>
          {cards.map((c, i) => {
            const dist = Math.abs(i - focusF);
            const focused = Math.max(0, 1 - dist);          // 1 enfocada -> 0
            const near = Math.max(0, 1 - dist / 1.6);
            const enter = spring({ frame: frame - 6 - i * 5, fps, config: { damping: 18 } });
            const bob = Math.sin((frame / fps) * 0.9 + i * 1.2) * 8 * (0.4 + focused);
            const tilt = (i - focusF) * 7;                  // las laterales giran hacia la cámara
            const z = interpolate(focused, [0, 1], [-180, 90]);
            const sc = interpolate(focused, [0, 1], [0.72, 1.12]) * interpolate(enter, [0, 1], [0.8, 1]);
            const blur = (1 - near) * 8;
            const dim = interpolate(focused, [0, 1], [0.62, 0]);
            const lift = -26 * focused;
            return (
              <div key={i} style={{
                position: "absolute", left: i * step, top: 0, width: cw, height: ch,
                transform: `translateX(0) translateY(${bob + lift}px) translateZ(${z}px) rotateY(${tilt}deg) scale(${sc})`,
                transformStyle: "preserve-3d", borderRadius: 18, overflow: "hidden",
                border: `3px solid ${focused > 0.5 ? COLORS.amber : "rgba(255,245,225,0.14)"}`,
                boxShadow: focused > 0.4
                  ? `0 30px 70px rgba(0,0,0,0.6), 0 0 ${40 + focused * 80}px ${focused * 18}px rgba(201,144,74,${0.35 * focused})`
                  : "0 18px 44px rgba(0,0,0,0.55)",
                opacity: enter, zIndex: Math.round(focused * 100),
              }}>
                {isVid(c.src) ? (
                  <OffthreadVideo src={staticFile(c.src)} muted playbackRate={0.55} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px) saturate(${0.65 + focused * 0.5}) brightness(${0.8 + focused * 0.35})` }} />
                ) : (
                  <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px) saturate(${0.65 + focused * 0.5}) brightness(${0.8 + focused * 0.35})` }} />
                )}
                {/* scrim de profundidad en las no enfocadas */}
                <AbsoluteFill style={{ background: `rgba(16,12,8,${dim})` }} />
                {/* label de la enfocada */}
                {focused > 0.55 && c.label && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px 18px", background: "linear-gradient(transparent, rgba(16,12,8,0.92))", color: COLORS.bg0, fontFamily: FONT_STACK, fontSize: 30, fontWeight: 500, textAlign: "center", letterSpacing: 0.4, opacity: (focused - 0.55) / 0.45, textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>
                    {c.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* VAPOR sobre la tarjeta enfocada (siempre al centro) */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {[0, 1, 2, 3].map((k) => {
          const t = ((frame / fps) * 0.5 + k * 0.27) % 1;
          const op = Math.sin(t * Math.PI) * 0.16;
          return (
            <div key={"st" + k} style={{
              position: "absolute", left: width / 2 + (k - 1.5) * 46, top: height * 0.5 - ch * 0.42 - t * 150,
              width: 90, height: 90, borderRadius: "50%", background: "rgba(255,240,220,1)",
              filter: "blur(26px)", opacity: op,
            }} />
          );
        })}
      </AbsoluteFill>

      {/* TÍTULO arriba con subrayado que se dibuja */}
      <div style={{ position: "absolute", top: height * 0.085, width: "100%", textAlign: "center", opacity: tOp }}>
        <div style={{ fontFamily: FONT_STACK, fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: COLORS.amber, marginBottom: 12 }}>{eyebrow}</div>
        <div style={{ fontFamily: FONT_STACK, fontSize: 74, fontWeight: 600, color: COLORS.bg0, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <div style={{ height: 4, width: 320, margin: "16px auto 0", background: COLORS.amber, borderRadius: 2, transform: `scaleX(${underline})`, transformOrigin: "center", opacity: 0.9 }} />
      </div>
    </AbsoluteFill>
  );
};
