import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Media } from "../components/Media";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── PriceWar — SPLIT de guerra de precios para el HOOK ───────────────────────
// Izquierda: el remedio barato ($2, teal, glow). Derecha: el producto caro ($60,
// rojo, tachado "/year"). Cada mitad entra desde su lado, las etiquetas de precio
// caen con spring, un "VS" en el centro. Pattern-interrupt de apertura: el contraste
// ES el gancho. Data-driven, self-contained (no depende del resto del kit).

const INTER = loadInter().fontFamily;
const TEAL = "#12B3AE", CREAM = "#F5F9FA", INK = "#0B1418", DANGER = "#E4141B", GOLD = "#E9C46A";

const Half: React.FC<{
  side: "left" | "right";
  image: string;
  price: string;
  label: string;
  strike?: string;      // ej "/ year" que aparece tachado
  tone: "teal" | "danger";
  frame: number;
  fps: number;
}> = ({ side, image, price, label, strike, tone, frame, fps }) => {
  const accent = tone === "teal" ? TEAL : DANGER;
  const dir = side === "left" ? -1 : 1;
  // la mitad entra desde su lado
  const slide = interpolate(frame, [0, 16], [dir * 120, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // ken-burns lento
  const kb = interpolate(frame, [0, 300], [1.08, 1.18], { extrapolateRight: "clamp" });
  // la etiqueta de precio cae con spring
  const tag = spring({ frame: frame - 22, fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });
  const tagY = interpolate(tag, [0, 1], [-140, 0]);
  // el precio "late" al aterrizar
  const punch = interpolate(frame, [22, 30, 40], [0.7, 1.14, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // el strike ("/year") se tacha
  const strikeSp = spring({ frame: frame - 46, fps, config: { damping: 18, stiffness: 120 } });

  return (
    <div style={{ position: "absolute", top: 0, [side]: 0, width: "50%", height: "100%", overflow: "hidden", transform: `translateX(${slide}%)` }}>
      <AbsoluteFill style={{ transform: `scale(${kb})` }}>
        <Media src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* grade + viñeta para legibilidad del precio */}
      <AbsoluteFill style={{ background: `linear-gradient(${side === "left" ? "125deg" : "235deg"}, rgba(6,14,18,0.15), rgba(6,14,18,0.72))` }} />
      <AbsoluteFill style={{ boxShadow: `inset 0 0 220px rgba(0,0,0,0.6)`, borderBottom: tone === "teal" ? `6px solid ${TEAL}` : "none" }} />

      {/* PRECIO */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", flexDirection: "column", alignItems: "center", opacity: tag }}>
        <div style={{ transform: `translateY(${tagY}px) scale(${punch})` }}>
          <span style={{ fontSize: Math.min(250, Math.round(250 * 6 / Math.max(6, String(price).length))), fontWeight: 900, lineHeight: 0.9, color: tone === "teal" ? TEAL : CREAM, textShadow: `0 12px 50px ${accent}77, 0 4px 0 rgba(0,0,0,0.4)`, WebkitTextStroke: tone === "teal" ? "0" : `2px ${DANGER}` }}>{price}</span>
        </div>
        {strike && (
          <div style={{ position: "relative", marginTop: 6, opacity: strikeSp }}>
            <span style={{ fontSize: 58, fontWeight: 800, color: CREAM, opacity: 0.9 }}>{strike}</span>
            <div style={{ position: "absolute", top: "52%", left: -6, height: 7, width: `${strikeSp * 112}%`, background: DANGER, borderRadius: 4, transform: "rotate(-8deg)", boxShadow: `0 0 18px ${DANGER}` }} />
          </div>
        )}
      </div>

      {/* etiqueta inferior */}
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 70, textAlign: "center", opacity: interpolate(frame, [30, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <span style={{ fontSize: 40, fontWeight: 800, color: CREAM, letterSpacing: 0.3, textShadow: "0 2px 14px rgba(0,0,0,0.8)" }}>{label}</span>
      </div>
    </div>
  );
};

export const PriceWar: React.FC<{
  durationInFrames: number;
  leftImage: string;
  rightImage: string;
  leftPrice?: string;
  rightPrice?: string;
  leftLabel?: string;
  rightLabel?: string;
  strike?: string;
  subtitle?: string;
  verdict?: string;      // ej "SAME HAIR · 6 MONTHS" — el VS muta a "=" y cae la estampa
  equalsAt?: number;     // frame en que VS→= y aparece el veredicto (default ~55% del beat)
}> = ({ durationInFrames, leftImage, rightImage, leftPrice = "$2", rightPrice = "$60", leftLabel = "Rosemary + a glass of water", rightLabel = "“Beauty water” in a bottle", strike = "/ year", subtitle, verdict, equalsAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // barrido de luz dorada sobre el divisor
  const sweep = interpolate(frame, [14, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vsSp = spring({ frame: frame - 30, fps, config: { damping: 11, stiffness: 160 } });
  const subSp = spring({ frame: frame - 52, fps, config: { damping: 20, stiffness: 120 } });
  // ── VEREDICTO: el VS se convierte en "=" y cae la estampa (el giro shockeante) ──
  const eqF = equalsAt ?? Math.round(durationInFrames * 0.55);
  const eq = verdict ? spring({ frame: frame - eqF, fps, config: { damping: 13, stiffness: 150 } }) : 0;
  const verdictSp = verdict ? spring({ frame: frame - eqF - 8, fps, config: { damping: 12, stiffness: 140 } }) : 0;

  return (
    <AbsoluteFill style={{ fontFamily: INTER, backgroundColor: INK, overflow: "hidden" }}>
      <Half side="left" image={leftImage} price={leftPrice} label={leftLabel} tone="teal" frame={frame} fps={fps} />
      <Half side="right" image={rightImage} price={rightPrice} label={rightLabel} strike={strike} tone="danger" frame={frame} fps={fps} />

      {/* divisor con barrido dorado */}
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, transform: "translateX(-50%)", background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`, opacity: 0.35 + sweep * 0.65, boxShadow: `0 0 ${20 + sweep * 40}px ${GOLD}` }} />

      {/* VS badge → muta a "=" cuando hay veredicto */}
      <div style={{ position: "absolute", left: "50%", top: "42%", transform: `translate(-50%,-50%) scale(${interpolate(vsSp, [0, 1], [0.4, 1]) * (1 + eq * 0.18)}) rotate(${interpolate(vsSp, [0, 1], [-30, 0])}deg)`, opacity: vsSp }}>
        <div style={{ width: 128, height: 128, borderRadius: 70, background: "rgba(11,20,24,0.94)", border: `3px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 12px 50px rgba(0,0,0,0.6), 0 0 ${30 + eq * 30}px ${GOLD}${eq > 0.5 ? "AA" : "55"}` }}>
          <span style={{ position: "absolute", fontSize: 54, fontWeight: 900, color: GOLD, letterSpacing: 1, opacity: 1 - eq }}>VS</span>
          <span style={{ position: "absolute", fontSize: 72, fontWeight: 900, color: GOLD, opacity: eq }}>=</span>
        </div>
      </div>

      {/* subtítulo cinético (oculto cuando entra el veredicto) */}
      {subtitle && (
        <div style={{ position: "absolute", left: "50%", bottom: 148, transform: `translateX(-50%) translateY(${(1 - subSp) * 20}px)`, opacity: subSp * (1 - eq), width: "82%" }}>
          <div style={{ background: "rgba(11,20,24,0.9)", border: `1px solid ${GOLD}44`, borderRadius: 18, padding: "20px 40px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.55)" }}>
            <span style={{ fontSize: 46, fontWeight: 800, color: CREAM }}>{subtitle}</span>
          </div>
        </div>
      )}

      {/* ESTAMPA DE VEREDICTO — el giro: mismo resultado */}
      {verdict && (
        <div style={{ position: "absolute", left: "50%", bottom: 130, transform: `translateX(-50%) translateY(${(1 - verdictSp) * 26}px) scale(${interpolate(verdictSp, [0, 1], [0.7, 1])}) rotate(${interpolate(verdictSp, [0, 1], [-4, 0])}deg)`, opacity: verdictSp }}>
          <div style={{ background: GOLD, borderRadius: 20, padding: "24px 56px", textAlign: "center", boxShadow: `0 24px 70px rgba(0,0,0,0.6), 0 0 40px ${GOLD}66` }}>
            <span style={{ fontSize: 58, fontWeight: 900, color: INK, letterSpacing: 1 }}>{verdict}</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
