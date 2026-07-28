// LoopLock_v43tq6jgz3dw.tsx — componente PROPIO del slug (aislado). Tarjeta CANDADO para plantar el
// loop grande del hook: "el error que lo arruina para 9 de cada 10… te lo digo al final". Fondo oscuro, candado teal.
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";

const TEAL = "#12B3AE";
const BG = "#0E1D23";
const F = "Inter, system-ui, sans-serif";

export const LoopLockV43: React.FC<{ durationInFrames: number; title?: string; sub?: string }> = ({ title = "EL ERROR", sub = "te lo digo al final" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 12);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: F, alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, rgba(18,179,174,0.12), transparent 62%)" }} />
      <div style={{ transform: `scale(${0.9 + 0.1 * pop})`, opacity: pop, width: 1000, textAlign: "center" }}>
        <div style={{ margin: "0 auto 26px", width: 150, height: 150, borderRadius: 34, background: "rgba(18,179,174,0.12)", border: `3px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${30 + pulse * 40}px rgba(18,179,174,${0.25 + pulse * 0.25})` }}>
          <svg width="78" height="78" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="10.5" width="16" height="10.5" rx="2.4" fill="rgba(18,179,174,0.18)" />
            <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
            <circle cx="12" cy="15.5" r="1.5" fill={TEAL} stroke="none" />
          </svg>
        </div>
        <div style={{ color: "#8FB6B4", fontSize: 28, letterSpacing: 6, textTransform: "uppercase", fontWeight: 800 }}>Quédate hasta el final</div>
        <div style={{ color: "#F2F7F6", fontSize: 66, fontWeight: 900, marginTop: 10, lineHeight: 1.05 }}>{title}</div>
        <div style={{ margin: "22px auto 0", width: 560, height: 30, borderRadius: 8, background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 22px, rgba(255,255,255,0.03) 22px 44px)", filter: "blur(2px)" }} />
        <div style={{ color: "#CFE6E4", fontSize: 30, fontWeight: 600, marginTop: 22 }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};
