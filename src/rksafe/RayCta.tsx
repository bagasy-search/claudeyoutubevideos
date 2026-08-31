// RayCta.tsx — CTA OVERLAY (NO full-screen): tarjeta en la esquina inferior derecha sobre el video.
// Borde brass, Keyring arriba, título de la oferta, sub, y QR placeholder (grilla CSS, sin asset).
// ⛔ qr=undefined por default → nada 404ea. Si pasan qr (relativo), se muestra guardado con <Img>.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, Img } from "remotion";
import { V, F_DISPLAY, F_BODY, Keyring, rgba, enter, rnd, clamp01 } from "./RayStage";

export const RayCta: React.FC<{
  title?: string;
  sub?: string;
  domain?: string;
  qr?: string;
  durationInFrames?: number;
}> = ({
  title = "The One Afternoon Door",
  sub = "The exact spots, the bolt-down, the decoy — the whole afternoon laid out.",
  domain = "[ walkthrough below ]",
  qr = undefined,
}) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 14);
  const slide = (1 - a) * 60; // entra deslizando desde la derecha
  const rule = clamp01(interpolate(frame, [10, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));

  // Grilla QR-ish determinista (rnd, nunca Math.random)
  const N = 11;
  const cells: boolean[] = [];
  for (let i = 0; i < N * N; i++) {
    const r = Math.floor(i / N);
    const c = i % N;
    // esquinas tipo "finder pattern"
    const inFinder = (rr: number, cc: number) => rr < 3 && cc < 3;
    const finder = inFinder(r, c) || inFinder(r, N - 1 - c) || inFinder(N - 1 - r, c);
    cells.push(finder ? (r % 2 === 0 || c % 2 === 0) : rnd(i * 3.7 + 1.3) > 0.5);
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: "5%", bottom: "8%", width: 640, opacity: a, transform: `translateX(${slide.toFixed(1)}px)` }}>
        {/* Scrim oscuro SOLO detrás de la tarjeta */}
        <div style={{ position: "relative", background: `linear-gradient(160deg, ${rgba(V.ink1, 0.96)}, ${rgba(V.ink0, 0.97)})`, border: `2px solid ${V.brass}`, borderRadius: 14, boxShadow: `0 18px 60px rgba(0,0,0,0.78), 0 0 0 1px ${rgba(V.brass, 0.25)}, inset 0 0 40px ${rgba(V.brass, 0.06)}`, padding: "26px 28px", overflow: "hidden" }}>
          {/* Keyring + eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <Keyring size={40} />
            <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: V.brass }}>
              Free walkthrough
            </div>
          </div>

          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            {/* Texto */}
            <div style={{ flex: "1 1 auto", minWidth: 0 }}>
              <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, lineHeight: 1.04, color: V.white, textShadow: "0 3px 14px rgba(0,0,0,0.85)" }}>
                {title}
              </div>
              <div style={{ height: 3, width: `${(rule * 100).toFixed(0)}%`, maxWidth: 200, background: `linear-gradient(90deg, ${V.brass}, ${rgba(V.brass, 0.15)})`, borderRadius: 2, margin: "10px 0 12px", boxShadow: `0 0 14px ${rgba(V.brass, 0.4)}` }} />
              <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 21, lineHeight: 1.32, color: V.bone, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
                {sub}
              </div>
            </div>

            {/* QR: real si lo pasan, si no placeholder dibujado */}
            <div style={{ flex: "0 0 auto", width: 150, height: 150, borderRadius: 10, padding: 10, background: rgba(V.ink0, 0.7), border: `2px dashed ${V.brass}`, boxShadow: `inset 0 0 0 1px ${rgba(V.brass, 0.2)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              {qr ? (
                <Img src={staticFile(qr)} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 4 }} />
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${N}, 1fr)`, gridTemplateRows: `repeat(${N}, 1fr)`, gap: 1, width: 104, height: 104 }}>
                    {cells.map((on, i) => (
                      <div key={i} style={{ background: on ? V.brassSoft : "transparent", borderRadius: 1 }} />
                    ))}
                  </div>
                  <div style={{ marginTop: 8, fontFamily: F_BODY, fontWeight: 600, fontSize: 12, letterSpacing: 0.4, color: V.steel, textAlign: "center" }}>
                    {domain}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
