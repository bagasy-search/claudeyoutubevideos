import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Media } from "../components/Media";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

// ── FedGuideCTA ─────────────────────────────────────────────────────────────
// Reveal de la guía: portada del libro + QR REAL (escaneable, sin degradar) + CTA
// suave "link en la descripción / escaneá". Look Federer: fondo oscuro cinematográfico,
// tarjeta clara, acentos teal/brass. Corte limpio (sin fade de salida sobre el avatar).
const INTER = loadInter().fontFamily;
const PLAYFAIR = loadPlayfair().fontFamily;
const TEAL = "#12B3AE";
const DEEP = "#063B40";
const BG = "#0E1D23";
const CREAM = "#F5F1E6";
const INK = "#12222B";
const BRASS = "#C79A3B";

export const FedGuideCTA: React.FC<{
  durationInFrames: number;
  cover: string;
  qr?: string;
  domain?: string;
  scanTitle?: string;
  scanSub?: string;
  title?: string;
  kicker?: string;
  desc?: string;
}> = ({ durationInFrames: D, cover, qr, domain = "docfederer.com", scanTitle = "Scan me",
        scanSub = "or the free link in the description",
        title = "The Youthful Skin Method", kicker = "The complete guide", desc = "" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const enter = spring({ frame, fps, config: { damping: 20, mass: 0.9, stiffness: 105 } });
  const y = interpolate(enter, [0, 1], [46, 0]);
  const sc = interpolate(enter, [0, 1], [0.95, 1]);
  const kb = 1 + 0.012 * Math.sin(frame / 26); // respiración muy suave
  const qrPulse = 1 + 0.03 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ fontFamily: INTER, backgroundColor: BG }}>
      <AbsoluteFill style={{ background: "radial-gradient(75% 65% at 50% 45%, rgba(18,179,174,0.12), rgba(7,13,17,0.86))" }} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 64, transform: `translateY(${y}px) scale(${sc})`, opacity: enter }}>
          {/* PORTADA DE LA GUÍA */}
          <div style={{ transform: `rotate(-3deg) scale(${kb})`, boxShadow: "0 40px 90px rgba(0,0,0,0.55)", borderRadius: 14, overflow: "hidden", border: "3px solid rgba(255,255,255,0.9)" }}>
            <Media src={cover} style={{ display: "block", width: 470, height: 660, objectFit: "cover" }} />
          </div>

          {/* PANEL DERECHO: título + CTA + QR */}
          <div style={{ width: 720 }}>
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, letterSpacing: 5, textTransform: "uppercase", color: TEAL, opacity: interpolate(frame, [8, 22], [0, 1], cl) }}>{kicker}</div>
            <div style={{ fontFamily: PLAYFAIR, fontWeight: 800, fontSize: 74, lineHeight: 1.02, color: CREAM, marginTop: 10, opacity: interpolate(frame, [12, 26], [0, 1], cl) }}>{title}</div>
            {desc ? (
              <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 30, lineHeight: 1.35, color: "rgba(245,241,230,0.82)", marginTop: 18, maxWidth: 660, opacity: interpolate(frame, [18, 32], [0, 1], cl) }}>{desc}</div>
            ) : null}

            {/* fila QR */}
            <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 40, opacity: interpolate(frame, [26, 40], [0, 1], cl) }}>
              {qr ? (
                <div style={{ background: "#fff", padding: 16, borderRadius: 18, boxShadow: `0 14px 34px rgba(0,0,0,0.4)`, transform: `scale(${qrPulse})`, border: `3px solid ${TEAL}` }}>
                  <Media src={qr} style={{ display: "block", width: 168, height: 168, objectFit: "contain" }} />
                </div>
              ) : null}
              <div>
                <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 34, color: CREAM, letterSpacing: 1 }}>{scanTitle}</div>
                <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 25, color: "rgba(245,241,230,0.72)", marginTop: 6 }}>{scanSub}</div>
                <div style={{ display: "inline-block", marginTop: 12, padding: "9px 20px", borderRadius: 999, background: `linear-gradient(150deg, ${TEAL}, #0c8f8b)`, color: "#04252a", fontWeight: 900, fontSize: 24, letterSpacing: 0.5, boxShadow: `0 10px 26px ${TEAL}55` }}>{domain}</div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
