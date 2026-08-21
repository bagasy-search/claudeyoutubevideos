import React from "react";
import { interpolate } from "remotion";
import { SfxCue, SFX } from "../../components/Sfx";
import { SPR, Theme, useTheme } from "./theme";
import {
  Card,
  Display,
  Eyebrow,
  ImgOr,
  Motas,
  Panel,
  Stage,
  Stroke,
  Support,
  kick,
  spread,
  useBeat,
} from "./core";
import { Cinema, Column, OnPaper, autoSize, useDrift, useInk } from "./stagecraft";

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIA: TEXTO / ÉNFASIS — HookCaption · PullQuote · KaraokePhrase ·
// HighlightSweep
// ═══════════════════════════════════════════════════════════════════════════

// ── HookCaption — gancho de apertura: palabras que golpean una a una, con ────
//    cajas de acento detrás de las claves.
export type HookWord = { text: string; boxed?: boolean };
export const HookCaption: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  words?: HookWord[];
  sub?: string;
  sfx?: boolean;
}> = ({
  durationInFrames,
  theme,
  words = [
    { text: "Esto" },
    { text: "te está" },
    { text: "COSTANDO", boxed: true },
    { text: "plata" },
    { text: "todos los días", boxed: true },
  ],
  sub = "y se arregla con lo que ya tenés en tu casa",
  sfx = true,
}) => {
  const t = useTheme(theme);
  const ink = useInk(t);
  const { frame, fps, op } = useBeat(durationInFrames);
  const subS = kick(frame, fps, spread(durationInFrames, words.length, words.length, { holdFrac: 0.45, maxStep: 16 }) + 6, SPR.settle);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={58}>
        <Motas theme={t} count={12} opacity={0.35} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 140px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", gap: "8px 26px", textAlign: "center" }}>
            {words.map((w, i) => {
              const at = spread(durationInFrames, words.length, i, { holdFrac: 0.45, maxStep: 16 });
              const s = kick(frame, fps, at, SPR.pop);
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: s,
                    transform: `translateY(${(1 - s) * 40}px) scale(${0.8 + s * 0.2})`,
                    fontFamily: t.fontDisplay,
                    fontWeight: t.displayWeight >= 800 ? 900 : t.displayWeight,
                    fontSize: w.boxed ? 108 : 92,
                    lineHeight: 1.12,
                    color: w.boxed ? t.color.onAccent : ink.text,
                    background: w.boxed ? `linear-gradient(160deg, ${t.color.accent}, ${t.color.accent}DD)` : "none",
                    padding: w.boxed ? "2px 30px 8px" : 0,
                    borderRadius: w.boxed ? t.radius * 0.6 : 0,
                    boxShadow: w.boxed ? `0 20px 44px ${t.color.shadow}` : "none",
                    textShadow: w.boxed ? "0 3px 10px rgba(0,0,0,0.3)" : ink.shadowStrong,
                    transformOrigin: "bottom center",
                  }}
                >
                  {w.text}
                </span>
              );
            })}
          </div>
          {sub && (
            <div style={{ marginTop: 46, opacity: subS, transform: `translateY(${(1 - subS) * 16}px)` }}>
              <Support theme={t} size={40}>{sub}</Support>
            </div>
          )}
        </div>
        {sfx && (
          <>
            <SfxCue at={2} src={SFX.whoosh} volume={0.24} />
            {words.map((w, i) => {
              const at = spread(durationInFrames, words.length, i, { holdFrac: 0.45, maxStep: 16 });
              return (
                <SfxCue
                  key={i}
                  at={at}
                  src={w.boxed ? SFX.boom1 : SFX.pop1}
                  volume={w.boxed ? 0.32 : 0.22}
                  durationInFrames={w.boxed ? 30 : 16}
                />
              );
            })}
          </>
        )}
      </Panel>
    </Stage>
  );
};

// ── PullQuote — cita con retrato circular, comillas gigantes y atribución ────
export const PullQuote: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  quote?: string;
  author?: string;
  role?: string;
  image?: string;
  sfx?: boolean;
}> = ({
  durationInFrames,
  theme,
  quote = "",
  author,
  role,
  image,
  sfx = true,
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  // ★ REESCRITO (jul 2026). Antes: cita de 58px centrada dentro de una tarjeta
  // crema, con el retrato al lado y el b-roll tapado — un slide de PowerPoint.
  // Ahora: COLUMNA de papel a la izquierda con canto vivo, la cita en grande,
  // y el retrato CRUZANDO ese canto (mitad sobre el papel, mitad sobre el
  // b-roll). Ese cruce de capas es lo que da sensación de plano compuesto.
  const COL_W = image ? 1180 : 1260;
  const qS = kick(frame, fps, 10, SPR.settle);
  const portS = kick(frame, fps, 18, SPR.settle);
  const authS = kick(frame, fps, 34, SPR.snappy);
  const markS = kick(frame, fps, 4, SPR.pop);
  const drift = useDrift(0.35, 4);
  const qSize = autoSize(quote, 74, 96, 46);
  const PR = 210; // radio del retrato

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Cinema theme={t} durationInFrames={durationInFrames} side="left" paper={0} grade={1} blur={26} shaftsX={74}>
        <Column theme={t} width={COL_W} at={2} />

        <OnPaper>
        {/* L8 — la cita. El ancho RESERVA el hueco del retrato: si el texto
            llegara hasta el canto del papel, el círculo le caería encima
            (pasaba con "…contra el moho" tapado por el retrato). */}
        <div
          style={{
            position: "absolute",
            left: 128,
            top: 0,
            bottom: 0,
            width: image ? COL_W - PR - 120 : COL_W - 240,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* comilla gigante = capa profunda detrás del texto */}
          <div
            style={{
              position: "absolute",
              top: -128,
              left: -30,
              fontFamily: t.fontDisplay,
              fontSize: 300,
              lineHeight: 1,
              color: t.color.gold,
              opacity: 0.3 * markS,
              transform: `scale(${markS}) translate(${drift.x * 0.5}px, ${drift.y * 0.5}px)`,
              pointerEvents: "none",
            }}
          >
            &ldquo;
          </div>
          <div style={{ opacity: qS, transform: `translateY(${(1 - qS) * 28}px)` }}>
            <Display
              theme={t}
              size={qSize}
              style={{ fontStyle: t.name === "alarm" ? "normal" : "italic", fontWeight: 600, lineHeight: 1.24 }}
            >
              {quote}
            </Display>
          </div>
          {author && (
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 52, opacity: authS, transform: `translateX(${(1 - authS) * -24}px)` }}>
              <div style={{ width: 84, height: 5, background: t.color.gold, borderRadius: 3, boxShadow: `0 0 20px ${t.color.gold}77` }} />
              <div>
                <Display theme={t} size={46} color={t.color.gold}>{author}</Display>
                {role && <Support theme={t} size={30} style={{ marginTop: 2 }}>{role}</Support>}
              </div>
            </div>
          )}
        </div>

        </OnPaper>

        {/* L7 — retrato pisando el canto del papel (mitad papel / mitad b-roll) */}
        {image && (
          <div
            style={{
              position: "absolute",
              left: COL_W - PR,
              top: 540 - PR,
              opacity: portS,
              transform: `scale(${0.86 + portS * 0.14}) translate(${drift.x}px, ${drift.y}px)`,
            }}
          >
            <div style={{ position: "relative", width: PR * 2, height: PR * 2 }}>
              <div style={{ position: "absolute", inset: -26, borderRadius: "50%", border: `2px dashed ${t.color.gold}`, opacity: 0.42 }} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `8px solid ${t.color.gold}`,
                  boxShadow: `0 40px 80px ${t.color.shadow}, 0 12px 26px ${t.color.shadow}, 0 0 70px ${t.color.glow}`,
                }}
              >
                <ImgOr src={image} seed={77} theme={t} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(150deg, rgba(255,255,255,0.28), rgba(255,255,255,0) 44%)" }} />
              </div>
            </div>
          </div>
        )}
        {sfx && (
          <>
            <SfxCue at={4} src={SFX.whoosh} volume={0.3} />
            {author && <SfxCue at={34} src={SFX.winnerChime} volume={0.3} />}
          </>
        )}
      </Cinema>
    </Stage>
  );
};

// ── KaraokePhrase — frase clave palabra por palabra, la activa se enciende ───
export const KaraokePhrase: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  phrase?: string;
  /** frames por palabra (default reparte en la duración) */
  wordDur?: number;
  eyebrow?: string;
}> = ({ durationInFrames, theme, phrase = "El error no es comprar mal. Es no medir nada.", wordDur, eyebrow = "Grabate esto" }) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const words = phrase.split(" ");
  const per = wordDur ?? Math.max(5, Math.floor((durationInFrames - 40) / words.length));
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={44}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 170px" }}>
          <div style={{ marginBottom: 44, opacity: kick(frame, fps, 2, SPR.settle) }}>
            <Eyebrow theme={t} size={30}>{eyebrow}</Eyebrow>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 22px" }}>
            {words.map((w, i) => {
              const at = 12 + i * per;
              const s = kick(frame, fps, at, SPR.snappy);
              const active = frame >= at && frame < at + per;
              const activeS = active ? 1 : 0;
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: t.fontDisplay,
                    fontWeight: t.displayWeight,
                    fontSize: 84,
                    lineHeight: 1.2,
                    opacity: 0.25 + s * 0.75,
                    color: frame >= at ? t.color.text : t.color.textDim,
                    transform: `translateY(${(1 - s) * 18}px) scale(${1 + activeS * 0.07})`,
                    textShadow: active ? `0 0 34px ${t.color.glow}` : "none",
                    transition: "none",
                    display: "inline-block",
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
          <svg viewBox="0 0 900 26" width={900} height={26} style={{ marginTop: 50 }}>
            <Stroke d="M 8 14 C 240 4, 620 24, 892 10" at={12 + words.length * per} dur={18} color={t.color.accent} width={6} length={920} />
          </svg>
        </div>
      </Panel>
    </Stage>
  );
};

// ── HighlightSweep — oración con marcador que BARRE detrás de la clave ───────
export const HighlightSweep: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  pre?: string;
  highlight?: string;
  post?: string;
  note?: string;
  sfx?: boolean;
}> = ({
  durationInFrames,
  theme,
  pre = "La garantía cubre todo,",
  highlight = "menos lo que más se rompe",
  post = ".",
  note = "cláusula 14, letra chica",
  sfx = true,
}) => {
  const t = useTheme(theme);
  const ink = useInk(t);
  const { frame, fps, op } = useBeat(durationInFrames);
  const enterS = kick(frame, fps, 4, SPR.settle);
  const sweep = interpolate(frame, [22, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const noteS = kick(frame, fps, 48, SPR.snappy);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={70}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 150px", textAlign: "center" }}>
          <div style={{ opacity: enterS, transform: `translateY(${(1 - enterS) * 26}px)`, fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontSize: 84, lineHeight: 1.28, color: ink.text, textShadow: ink.shadowStrong }}>
            <span style={{ color: ink.soft, fontWeight: 500 }}>{pre} </span>
            <span style={{ position: "relative", display: "inline-block" }}>
              {/* trazo marcador con borde irregular (skew + radius asimétrico) */}
              <span
                style={{
                  position: "absolute",
                  left: -14,
                  right: -14,
                  top: "10%",
                  bottom: "4%",
                  background: `linear-gradient(92deg, ${t.color.accent}CC, ${t.color.accent}99)`,
                  borderRadius: "14px 6px 16px 8px",
                  transform: `scaleX(${sweep}) skewX(-3deg)`,
                  transformOrigin: "left center",
                  boxShadow: `0 10px 30px ${t.color.shadow}`,
                }}
              />
              <span style={{ position: "relative", color: sweep > 0.4 ? t.color.onAccent : t.color.text }}>{highlight}</span>
            </span>
            <span style={{ color: ink.soft, fontWeight: 500 }}>{post}</span>
          </div>
          {note && (
            <div style={{ marginTop: 56, opacity: noteS, transform: `translateY(${(1 - noteS) * 14}px)` }}>
              <Card theme={t} style={{ padding: "12px 34px", display: "inline-block" }}>
                <Support theme={t} size={27}>{note}</Support>
              </Card>
            </div>
          )}
        </div>
        {sfx && (
          <>
            <SfxCue at={4} src={SFX.whoosh} volume={0.24} />
            <SfxCue at={22} src={SFX.markerDrive} volume={0.36} />
            {note && <SfxCue at={48} src={SFX.pop1} volume={0.22} />}
          </>
        )}
      </Panel>
    </Stage>
  );
};
