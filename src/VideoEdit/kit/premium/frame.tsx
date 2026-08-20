import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SfxCue, SFX } from "../../components/Sfx";
import { SPR, Theme, useTheme } from "./theme";
import {
  Burst,
  Card,
  Cross,
  Display,
  Eyebrow,
  ImgOr,
  Motas,
  Odo,
  Panel,
  Stage,
  Stroke,
  Support,
  Tick,
  kick,
  useBeat,
} from "./core";
import { Cinema, autoSize, useDrift } from "./stagecraft";

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIA: MARCO / IDENTIDAD — CornerEyebrow · ChapterTitle · LowerThirdId ·
// CtaCard · StampBadge · MythTruth
// ═══════════════════════════════════════════════════════════════════════════

// ── CornerEyebrow — placa mínima de esquina (kicker de canal / de sección) ───
export const CornerEyebrow: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  text?: string;
  corner?: "tl" | "tr";
}> = ({ durationInFrames, theme, eyebrow = "EL CONSTRUCTOR LIBRE", text = "Capítulo 2 · La mezcla", corner = "tl" }) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const s = kick(frame, fps, 2, SPR.snappy);
  const pos: React.CSSProperties = corner === "tl" ? { top: 76, left: 76 } : { top: 76, right: 76 };
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <div style={{ position: "absolute", ...pos, opacity: s, transform: `translateX(${(1 - s) * (corner === "tl" ? -40 : 40)}px)` }}>
        <Card theme={t} accent={t.color.accent} style={{ display: "inline-flex", alignItems: "center", gap: 20, padding: "18px 36px" }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: t.color.accent, boxShadow: `0 0 0 6px ${t.color.accent}33` }} />
          <div>
            <div style={{ fontFamily: t.fontLabel, fontSize: 22, letterSpacing: t.labelSpacing + 1, fontWeight: 700, textTransform: "uppercase", color: t.color.gold }}>{eyebrow}</div>
            <Display theme={t} size={36}>{text}</Display>
          </div>
        </Card>
      </div>
    </Stage>
  );
};

// ── ChapterTitle — portada de capítulo: número romano gigante + regla + título ─
export const ChapterTitle: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  number?: string;
  title?: string;
  sub?: string;
}> = ({ durationInFrames, theme, number = "III", title = "El error que arruina todo", sub = "y cómo esquivarlo en 30 segundos" }) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const numS = kick(frame, fps, 4, SPR.soft);
  const titleS = kick(frame, fps, 16, SPR.settle);
  const subS = kick(frame, fps, 28, SPR.settle);
  const ruleP = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={60}>
        <Motas theme={t} count={18} opacity={0.45} />
        {/* número romano gigante de fondo, desenfocado = capa profunda */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: t.fontDisplay,
            fontWeight: 900,
            fontSize: 620,
            color: t.color.accent,
            opacity: 0.13 * numS,
            transform: `scale(${1.15 - numS * 0.15})`,
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        >
          {number}
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30, marginBottom: 26, opacity: numS }}>
            <div style={{ width: 130 * ruleP, height: 3, background: t.color.gold }} />
            <div style={{ fontFamily: t.fontLabel, fontWeight: 700, fontSize: 30, letterSpacing: 8, textTransform: "uppercase", color: t.color.gold }}>
              Capítulo {number}
            </div>
            <div style={{ width: 130 * ruleP, height: 3, background: t.color.gold }} />
          </div>
          <div style={{ opacity: titleS, transform: `translateY(${(1 - titleS) * 30}px)`, textAlign: "center", maxWidth: 1300 }}>
            <Display theme={t} size={104} style={{ textShadow: `0 10px 40px ${t.color.shadow}` }}>{title}</Display>
          </div>
          {sub && (
            <div style={{ opacity: subS, transform: `translateY(${(1 - subS) * 18}px)`, marginTop: 26 }}>
              <Support theme={t} size={38}>{sub}</Support>
            </div>
          )}
        </div>
      </Panel>
    </Stage>
  );
};

// ── LowerThirdId — identificación abajo-izquierda con barra y regla dibujada ─
export const LowerThirdId: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  name?: string;
  role?: string;
  image?: string;
}> = ({ durationInFrames, theme, name = "Tomás Herrera", role = "Maestro mayor de obra · 40 años de oficio", image }) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const barS = kick(frame, fps, 2, SPR.settle);
  const nameS = kick(frame, fps, 8, SPR.snappy);
  const roleS = kick(frame, fps, 16, SPR.snappy);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <div style={{ position: "absolute", left: 90, bottom: 90, display: "flex", alignItems: "center", gap: 26 }}>
        {/* retrato chico opcional */}
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: "50%",
            overflow: "hidden",
            border: `5px solid ${t.color.gold}`,
            boxShadow: `0 18px 36px ${t.color.shadow}`,
            opacity: barS,
            transform: `scale(${barS})`,
            flexShrink: 0,
          }}
        >
          <ImgOr src={image} seed={21} theme={t} />
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, borderRadius: 5, background: `linear-gradient(180deg, ${t.color.gold}, ${t.color.accent})`, transform: `scaleY(${barS})`, transformOrigin: "bottom" }} />
          <div style={{ paddingLeft: 34 }}>
            <div style={{ overflow: "hidden" }}>
              <div style={{ opacity: nameS, transform: `translateY(${(1 - nameS) * 60}px)` }}>
                <Display theme={t} size={56} style={{ textShadow: `0 4px 18px ${t.color.shadow}` }}>{name}</Display>
              </div>
            </div>
            <div style={{ overflow: "hidden", marginTop: 4 }}>
              <div style={{ opacity: roleS, transform: `translateY(${(1 - roleS) * 40}px)` }}>
                <Card theme={t} style={{ display: "inline-block", padding: "8px 22px" }}>
                  <Support theme={t} size={26}>{role}</Support>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
};

// ── CtaCard — producto/CTA: portada + precio con odómetro + botón que respira ─
export const CtaCard: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  title?: string;
  bullet?: string;
  price?: number;
  cta?: string;
  image?: string;
  sfx?: boolean;
}> = ({
  durationInFrames,
  theme,
  eyebrow = "El manual completo",
  title = "Manual del Constructor Libre",
  bullet = "84 técnicas probadas, con planos",
  price = 27,
  cta = "LINK EN LA DESCRIPCIÓN",
  image,
  sfx = true,
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const cardS = kick(frame, fps, 6, SPR.settle);
  const ctaS = kick(frame, fps, 34, SPR.snappy);
  const pulse = 1 + Math.sin(frame / 9) * 0.02;
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={76}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 90 }}>
          {/* portada 3D con leve giro */}
          <div style={{ perspective: 1400, opacity: cardS }}>
            <div
              style={{
                width: 440,
                height: 580,
                borderRadius: t.radius,
                overflow: "hidden",
                border: `${t.strokeW}px solid ${t.color.ink}`,
                transform: `rotateY(${-16 + cardS * 6}deg) rotateX(3deg)`,
                boxShadow: `-40px 40px 80px ${t.color.shadow}`,
                position: "relative",
                background: t.color.surfaceStrong,
              }}
            >
              <ImgOr src={image} seed={55} theme={t} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 34%)" }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 30px", background: "linear-gradient(0deg, rgba(0,0,0,0.72), rgba(0,0,0,0))" }}>
                <div style={{ fontFamily: t.fontDisplay, fontWeight: 800, fontSize: 42, color: "#F5EFDE", lineHeight: 1.1 }}>{title}</div>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: 700 }}>
            <div style={{ opacity: cardS, transform: `translateY(${(1 - cardS) * 20}px)` }}>
              <Eyebrow theme={t} size={28}>{eyebrow}</Eyebrow>
              <Display theme={t} size={66} style={{ marginTop: 16 }}>{title}</Display>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20 }}>
                <Tick at={20} color={t.color.good} size={48} />
                <Support theme={t} size={32}>{bullet}</Support>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 44, marginTop: 40 }}>
              {price > 0 && <Odo theme={t} value={price} prefix="$" size={110} color={t.color.gold} at={22} dur={40} grouped={false} />}
              <div
                style={{
                  opacity: ctaS,
                  transform: `scale(${ctaS * pulse})`,
                  background: `linear-gradient(160deg, ${t.color.accent}, ${t.color.accent}CC)`,
                  color: t.color.onAccent,
                  fontFamily: t.fontLabel,
                  fontWeight: 900,
                  fontSize: 33,
                  letterSpacing: 2,
                  padding: "20px 46px",
                  borderRadius: 60,
                  boxShadow: `0 20px 44px ${t.color.shadow}, 0 0 40px ${t.color.glow}`,
                  textTransform: "uppercase",
                }}
              >
                {cta} →
              </div>
            </div>
          </div>
        </div>
        {sfx && (
          <>
            <SfxCue at={6} src={SFX.whoosh} volume={0.3} />
            {price > 0 && <SfxCue at={22} src={SFX.digitTick} volume={0.2} durationInFrames={14} />}
            <SfxCue at={34} src={SFX.winnerChime} volume={0.4} />
          </>
        )}
      </Panel>
    </Stage>
  );
};

// ── QrAside — tarjeta de vidrio con el QR al LADO del avatar hablando ─────────
// (el PremiumOverlay desenfoca suave el avatar detrás; la tarjeta redondeada flota a la derecha)
export const QrAside: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  qr?: string;
  title?: string;
  caption?: string;
}> = ({ durationInFrames, theme, qr, title = "La Guía del Constructor Libre", caption = "Apuntá la cámara del celular al código" }) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const enter = kick(frame, fps, 4, SPR.settle);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          right: 92,
          top: "50%",
          transform: `translate(${(1 - enter) * 90}px, -50%)`,
          opacity: op * enter,
          width: 452,
          padding: 34,
          background: t.color.surfaceStrong,
          border: `${t.strokeW}px solid ${t.color.ink}`,
          borderRadius: 36,
          boxShadow: `-34px 46px 100px ${t.color.shadow}, 0 0 64px ${t.color.glow}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ fontFamily: t.fontLabel, fontWeight: 800, fontSize: 27, color: t.color.ink, textAlign: "center", letterSpacing: 0.5, lineHeight: 1.15 }}>{title}</div>
        <div style={{ width: 344, height: 344, borderRadius: 22, overflow: "hidden", background: "#ffffff", border: "8px solid #ffffff", boxShadow: `0 10px 26px ${t.color.shadow}` }}>
          <ImgOr src={qr} seed={7} theme={t} style={{ objectFit: "contain" }} />
        </div>
        <div style={{ fontFamily: t.fontLabel, fontWeight: 600, fontSize: 23, color: t.color.ink, textAlign: "center", opacity: 0.86, lineHeight: 1.22 }}>{caption}</div>
      </div>
      <SfxCue at={4} src={SFX.whoosh} volume={0.26} />
    </AbsoluteFill>
  );
};

// ── StampBadge — sello de goma que SLAMEA en diagonal con polvo ──────────────
export const StampBadge: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  text?: string;
  sub?: string;
  color?: string;
  x?: number; // 0..1 en el canvas
  y?: number;
}> = ({ durationInFrames, theme, text = "PROBADO", sub = "en 3 inviernos", color, x = 0.5, y = 0.5 }) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const col = color ?? t.color.danger;
  // ★ REESCRITO (jul 2026). Antes: el sello caía sobre la tarjeta crema del
  // overlay (a 0.69 de escala → chico y sin peso), el <Burst> estaba anclado
  // con inset:0 y tamaño fijo, así que el polvo salía del ÁNGULO del sello en
  // vez del centro, y la textura de gastado se estiraba a un viewBox 100x100.
  // Ahora golpea SOBRE el b-roll: onda expansiva, oscurecimiento de impacto,
  // polvo centrado y punch de escala (sin temblor de cámara — regla del canal).
  const AT = 8;
  const s = kick(frame, fps, AT, SPR.slam);
  const hit = interpolate(frame - AT, [0, 4, 16], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring = interpolate(frame - AT, [2, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const settle = 1 + Math.sin(Math.max(0, frame - AT) / 26) * 0.006; // respira, no queda clavado
  const scale = (1.75 - s * 0.75) * settle;
  const drift = useDrift(0.3, 8);
  const tSize = autoSize(text, 132, 10, 74);

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Cinema theme={t} durationInFrames={durationInFrames} side="center" paper={0} grade={0.72} blur={18} shaftsX={30} dust={26}>
        {/* L2b — oscurecimiento de impacto: el frame "acusa" el golpe */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(60% 60% at ${x * 100}% ${y * 100}%, rgba(0,0,0,0) 30%, rgba(0,0,0,${0.42 * hit}) 100%)`,
            pointerEvents: "none",
          }}
        />
        {/* L7b — onda expansiva sobre el b-roll */}
        <div
          style={{
            position: "absolute",
            left: `${x * 100}%`,
            top: `${y * 100}%`,
            width: 300 + ring * 1500,
            height: 300 + ring * 1500,
            marginLeft: -(150 + ring * 750),
            marginTop: -(150 + ring * 750),
            borderRadius: "50%",
            border: `${Math.max(0, 10 - ring * 9)}px solid ${col}`,
            opacity: (1 - ring) * 0.5,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${x * 100}%`,
            top: `${y * 100}%`,
            transform: `translate(-50%, -50%) rotate(-9deg) scale(${scale}) translate(${drift.x * 0.5}px, ${drift.y * 0.5}px)`,
            opacity: Math.min(1, s * 2.4),
          }}
        >
          <div style={{ position: "relative", padding: 60 }}>
            {/* polvo CENTRADO en el sello (antes salía del ángulo) */}
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 620, height: 620, marginLeft: -310, marginTop: -310 }}>
              <Burst at={AT + 3} color={col} size={620} count={24} />
            </div>
            <div
              style={{
                position: "relative",
                border: `11px solid ${col}`,
                borderRadius: 26,
                padding: "30px 68px",
                textAlign: "center",
                background: t.color.surfaceStrong,
                boxShadow: `0 40px 90px ${t.color.shadow}, 0 14px 30px ${t.color.shadow}, inset 0 0 0 4px ${t.color.surfaceStrong}, inset 0 0 40px ${col}2A`,
                overflow: "hidden",
              }}
            >
              {/* tinta gastada del sello, DENTRO del box y a escala real */}
              <svg
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0, mixBlendMode: t.mode === "dark" ? "multiply" : "screen", opacity: 0.42, pointerEvents: "none" }}
              >
                <filter id="pxstampwear">
                  <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={3} seed={11} stitchTiles="stitch" />
                  <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.7 0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#pxstampwear)" />
              </svg>
              <div
                style={{
                  position: "relative",
                  fontFamily: t.fontLabel,
                  fontWeight: 900,
                  fontSize: tSize,
                  letterSpacing: 7,
                  textTransform: "uppercase",
                  color: col,
                  lineHeight: 1,
                  textShadow: `0 3px 0 ${col}3A`,
                }}
              >
                {text}
              </div>
              {sub && (
                <div
                  style={{
                    position: "relative",
                    fontFamily: t.fontLabel,
                    fontWeight: 700,
                    fontSize: Math.max(30, tSize * 0.31),
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    color: t.color.textSoft,
                    marginTop: 12,
                    borderTop: `2px solid ${col}44`,
                    paddingTop: 12,
                  }}
                >
                  {sub}
                </div>
              )}
            </div>
          </div>
        </div>
      </Cinema>
    </Stage>
  );
};

// ── MythTruth — MITO tachado que se apaga vs VERDAD que se enciende ──────────
// ── FIX i18n/contraste: la chip de VERDAD pintaba `onAccent` sobre `good`. En
// temas donde `good` es BLANCO (THEME_PEROXIDE) quedaba blanco-sobre-blanco e
// invisible. Elegimos texto oscuro cuando el fondo `good` es claro.
const _onGood = (t: Theme): string => {
  const h = (t.color.good || "#000000").replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) || 0, g = parseInt(h.slice(2, 4), 16) || 0, b = parseInt(h.slice(4, 6), 16) || 0;
  return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? (t.color.bg0 || "#0A0A0B") : t.color.onAccent;
};

export const MythTruth: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  myth?: string;
  truth?: string;
  mythLabel?: string;
  truthLabel?: string;
  sfx?: boolean;
}> = ({ durationInFrames, theme, myth = "Más abono = más cosecha", truth = "El exceso quema la raíz", mythLabel = "Mito", truthLabel = "Verdad", sfx = true }) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const mythS = kick(frame, fps, 6, SPR.settle);
  const strikeAt = 26;
  // piso 0.66: con la Card de vidrio sobre fondo oscuro, 0.45 dejaba el mito
  // ilegible (hay que poder LEER lo que se tacha).
  const dim = interpolate(frame, [strikeAt + 6, strikeAt + 22], [1, 0.66], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const truthS = kick(frame, fps, strikeAt + 18, SPR.slam);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={34}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 66 }}>
          {/* MITO */}
          <div style={{ opacity: mythS * dim, transform: `translateY(${(1 - mythS) * 26}px) scale(${0.9 + mythS * 0.1})`, position: "relative" }}>
            <Card theme={t} accent={t.color.danger} style={{ padding: "34px 70px", display: "flex", alignItems: "center", gap: 34 }}>
              <div style={{ fontFamily: t.fontLabel, fontWeight: 900, fontSize: 30, letterSpacing: 5, color: t.color.danger, textTransform: "uppercase", border: `3px solid ${t.color.danger}`, borderRadius: 12, padding: "6px 18px", flexShrink: 0 }}>
                {mythLabel}
              </div>
              <Display theme={t} size={62}>{myth}</Display>
              <Cross at={strikeAt - 6} color={t.color.danger} size={72} />
            </Card>
            {/* tachado a pluma cruzando toda la card */}
            <svg viewBox="0 0 900 160" width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} preserveAspectRatio="none">
              <Stroke d="M 30 96 C 260 66, 620 118, 872 62" at={strikeAt} dur={14} color={t.color.danger} width={11} length={900} shadow />
            </svg>
          </div>
          {/* flecha bajando */}
          <svg viewBox="0 0 60 70" width={60} height={70} style={{ margin: "-30px 0" }}>
            <Stroke d="M 30 4 L 30 48 M 12 34 L 30 54 L 48 34" at={strikeAt + 8} dur={14} color={t.color.gold} width={7} length={130} />
          </svg>
          {/* VERDAD */}
          <div style={{ opacity: Math.min(1, truthS * 1.4), transform: `scale(${0.7 + truthS * 0.3})` }}>
            <Card theme={t} accent={t.color.good} strong style={{ padding: "40px 76px", display: "flex", alignItems: "center", gap: 34, boxShadow: `0 30px 70px ${t.color.shadow}, 0 0 70px ${t.color.glow}` }}>
              <div style={{ fontFamily: t.fontLabel, fontWeight: 900, fontSize: 30, letterSpacing: 5, color: _onGood(t), background: t.color.good, textTransform: "uppercase", borderRadius: 12, padding: "8px 20px", flexShrink: 0 }}>
                {truthLabel}
              </div>
              <Display theme={t} size={70}>{truth}</Display>
              <Tick at={strikeAt + 24} color={t.color.good} size={78} />
            </Card>
          </div>
        </div>
        {sfx && (
          <>
            <SfxCue at={6} src={SFX.whoosh} volume={0.28} />
            <SfxCue at={strikeAt} src={SFX.swish} volume={0.3} />
            <SfxCue at={strikeAt + 24} src={SFX.sparkleClean} volume={0.42} />
          </>
        )}
      </Panel>
    </Stage>
  );
};
