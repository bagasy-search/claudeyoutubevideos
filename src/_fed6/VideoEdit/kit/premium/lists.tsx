import React from "react";
import { SPR, Theme, useTheme } from "./theme";
import {
  Card,
  Display,
  Eyebrow,
  Panel,
  PhotoBlock,
  Stage,
  Stroke,
  Support,
  Tick,
  kick,
  spread,
  useBeat,
} from "./core";
import { Cinema, Column, Headline, Kicker, OnPaper, autoSize, mblur, slabShadow, tilt3d, useDrift, useInk, useKeyLight, useRack } from "./stagecraft";

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIA: LISTAS — NumberedSteps · ChecklistReveal · BulletCascade
// ═══════════════════════════════════════════════════════════════════════════

// ── NumberedSteps — pasos con espina de tinta vertical + medallas numeradas ──
export type Step = { title: string; sub?: string; image?: string };
export const NumberedSteps: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  title?: string;
  steps?: Step[];
}> = ({
  durationInFrames,
  theme,
  eyebrow = "Paso a paso",
  title = "Se hace una sola vez",
  steps = [
    { title: "Marcá el contorno", sub: "con estacas y soga" },
    { title: "Cavá 40 cm", sub: "guardando la tierra buena" },
    { title: "Rellená por capas", sub: "grueso abajo, fino arriba" },
    { title: "Regá y esperá", sub: "una semana antes de plantar" },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const rowH = 148;
  const light = useKeyLight("left");
  const rack = useRack(steps.length, durationInFrames, { blur: 2.0, dim: 0.24, shrink: 0.018 });
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={82}>
        <div style={{ position: "absolute", top: 56, left: 130 }}>
          <Eyebrow theme={t}>{eyebrow}</Eyebrow>
          <Display theme={t} size={58} style={{ marginTop: 10 }}>{title}</Display>
        </div>
        <div style={{ position: "absolute", top: 224, left: 130, right: 130 }}>
          {/* espina de tinta que baja conectando los pasos */}
          <svg viewBox={`0 0 20 ${steps.length * rowH}`} width={20} height={steps.length * rowH} style={{ position: "absolute", left: 48, top: 10 }}>
            <Stroke d={`M 10 6 L 10 ${steps.length * rowH - rowH + 40}`} at={10} dur={46} color={t.color.gold} width={5} length={steps.length * rowH} shadow />
          </svg>
          {steps.map((st, i) => {
            const at = spread(durationInFrames, steps.length, i);
            const s = kick(frame, fps, at, SPR.settle);
            const f = rack(i);
            const mb = mblur(s, 7);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 30,
                  height: rowH,
                  opacity: s * f.opacity,
                  filter: [mb, f.blur > 0.2 ? `blur(${f.blur.toFixed(2)}px)` : ""].filter(Boolean).join(" ") || undefined,
                  transform: `translateX(${(1 - s) * -36}px) scale(${f.scale.toFixed(4)})`,
                  transformOrigin: "left center",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 104,
                    height: 104,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 36% 26%, #FFFFFF55 0%, rgba(255,255,255,0) 44%), radial-gradient(circle at 34% 28%, ${t.color.gold}, ${t.color.accent} 82%)`,
                    border: `3px solid ${t.color.ink}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: t.fontDisplay,
                    fontWeight: 900,
                    fontSize: 48,
                    color: t.color.onAccent,
                    flexShrink: 0,
                    boxShadow: `${slabShadow(light, { lift: 1.4, edge: "rgba(0,0,0,0.55)" })}, inset 0 -7px 14px rgba(0,0,0,0.34), inset 0 5px 10px rgba(255,255,255,0.28)`,
                    textShadow: "0 2px 6px rgba(0,0,0,0.45)",
                    transform: tilt3d({ amount: 1.2, seed: i * 1.9, frame }),
                    zIndex: 1,
                  }}
                >
                  <div style={{ position: "absolute", inset: -9, borderRadius: "50%", border: `2px solid ${t.color.gold}`, opacity: 0.5 }} />
                  {i + 1}
                </div>
                {st.image && (
                  <PhotoBlock theme={t} src={st.image} seed={i + 40} width={170} height={116} radius={t.radius * 0.6} style={{ flexShrink: 0 }} />
                )}
                <Card theme={t} seed={i * 3 + 1} style={{ flex: 1, padding: "18px 32px", display: "flex", alignItems: "baseline", gap: 22 }}>
                  <Display theme={t} size={40}>{st.title}</Display>
                  {st.sub && <Support theme={t} size={28}>{st.sub}</Support>}
                </Card>
              </div>
            );
          })}
        </div>
      </Panel>
    </Stage>
  );
};

// ── ChecklistReveal — tarjeta con tildes que se DIBUJAN una a una ────────────
export const ChecklistReveal: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  items?: string[];
  stamp?: string;
  eyebrow?: string;
}> = ({
  durationInFrames,
  theme,
  title = "Antes de empezar, tené esto",
  items = ["Guantes gruesos", "Balde de 20 litros", "Vinagre blanco", "Un día sin lluvia"],
  stamp = "TODO LISTO",
  eyebrow = "Cómo darte cuenta",
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  // ★ REESCRITO (jul 2026). Antes: tarjeta crema centrada sobre panel crema
  // (misma luminancia → no se leía como capa), y el sello a `right:-60/top:-46`
  // le CAÍA ENCIMA AL TÍTULO. Ahora: columna de papel, ítems grandes con su
  // propia fila, y el sello vive en su lugar reservado abajo — nunca pisa texto.
  const COL_W = 1290;
  const stampAt = spread(durationInFrames, items.length, items.length) + 8;
  const stampS = kick(frame, fps, stampAt, SPR.slam);
  const titleSize = autoSize(title, 74, 30, 48);
  const itemSize = items.length >= 5 ? 38 : 46;
  // RACK FOCUS: el ítem que se está contando queda nítido y adelante; los otros
  // se van de foco. Cuando terminó de revelarse la lista, todo vuelve a foco.
  const rack = useRack(items.length, durationInFrames, { blur: 1.8, dim: 0.22, shrink: 0.016 });
  const drift = useDrift(0.25, 6);

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Cinema theme={t} durationInFrames={durationInFrames} side="left" paper={0} grade={1} blur={26} shaftsX={78}>
        <Column theme={t} width={COL_W} at={2} />

        <OnPaper>
        {/* bloque centrado en vertical: antes arrancaba en top:118 fijo y
            dejaba media columna vacía abajo en listas cortas */}
        <div
          style={{
            position: "absolute",
            left: 122,
            top: 0,
            bottom: 190,
            width: COL_W - 250,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Kicker theme={t} at={2} size={28}>{eyebrow}</Kicker>
          <Headline theme={t} at={8} size={titleSize} style={{ marginTop: 18 }}>
            {title}
          </Headline>
          {/* regla bajo el título: separa cabecera de lista */}
          <div style={{ height: 3, marginTop: 26, background: `linear-gradient(90deg, ${t.color.gold}, ${t.color.gold}22)`, width: `${Math.min(100, 30 + frame * 4)}%` }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 40 }}>
            {items.map((it, i) => {
              const at = spread(durationInFrames, items.length, i);
              const s = kick(frame, fps, at, SPR.snappy);
              const f = rack(i);
              const mb = mblur(s, 6);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 26,
                    opacity: s * f.opacity,
                    // el desenfoque de entrada y el de foco se suman en un filter
                    filter: [mb, f.blur > 0.2 ? `blur(${f.blur.toFixed(2)}px)` : ""].filter(Boolean).join(" ") || undefined,
                    transform: `translateX(${(1 - s) * -32}px) scale(${f.scale.toFixed(4)})`,
                    transformOrigin: "left center",
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div
                      style={{
                        position: "absolute",
                        inset: -6,
                        borderRadius: "50%",
                        background: t.color.good,
                        opacity: 0.14 * s,
                        transform: `scale(${0.6 + s * 0.4})`,
                      }}
                    />
                    <Tick at={at + 6} color={t.color.good} size={62} />
                  </div>
                  <Display theme={t} size={autoSize(it, itemSize, 46, 32)} style={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {it}
                  </Display>
                </div>
              );
            })}
          </div>
        </div>

        </OnPaper>

        {/* L7 — sello: lugar RESERVADO abajo del papel, jamás sobre el texto */}
        {stamp && (
          <div
            style={{
              position: "absolute",
              left: COL_W - 470,
              top: 858,
              transform: `rotate(-9deg) scale(${1.5 - stampS * 0.5}) translate(${drift.x * 0.6}px, 0)`,
              opacity: Math.min(1, stampS * 2.2),
            }}
          >
            <div
              style={{
                border: `7px solid ${t.color.good}`,
                borderRadius: 16,
                padding: "14px 40px",
                fontFamily: t.fontLabel,
                fontWeight: 900,
                fontSize: 50,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: t.color.good,
                background: t.color.surfaceStrong,
                boxShadow: `0 22px 46px ${t.color.shadow}, inset 0 0 0 3px ${t.color.surfaceStrong}, inset 0 0 26px ${t.color.good}22`,
              }}
            >
              {stamp}
            </div>
          </div>
        )}
      </Cinema>
    </Stage>
  );
};

// ── BulletCascade — 3 ideas grandes en cascada con keyword acentuada ─────────
export type Bullet = { pre?: string; key: string; post?: string };
export const BulletCascade: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  bullets?: Bullet[];
}> = ({
  durationInFrames,
  theme,
  eyebrow = "Lo que tenés que saber",
  bullets = [
    { pre: "No es la humedad,", key: "es el drenaje", post: "" },
    { pre: "No es el precio,", key: "es la mezcla", post: "" },
    { pre: "No es magia,", key: "es química simple", post: "" },
  ],
}) => {
  const t = useTheme(theme);
  const ink = useInk(t);
  const { frame, fps, op } = useBeat(durationInFrames);
  // ⛔ El renglon va con `whiteSpace: nowrap` (para que la barra de resaltado no se parta) y el
  // fontSize estaba CLAVADO en 66: cualquier bullet de mas de ~42 caracteres se salia del panel
  // y quedaba CORTADO al medio (medido en fedrodillas: "…la cabeza queda sobre" de 59). El cuerpo
  // se achica lo justo para que entre el bullet mas largo.
  const AVAIL = 1444;               // 1920 - inset 60*2 - left/right 150*2 - punto 22 - gap 34
  const CHAR_W = 0.52;              // ancho medio de caracter, en unidades de fontSize
  const longest = Math.max(1, ...bullets.map((b) =>
    (b.pre ? b.pre.length + 1 : 0) + (b.key || "").length + (b.post ? b.post.length + 1 : 0)));
  const bodySize = Math.max(38, Math.min(66, Math.floor(AVAIL / (longest * CHAR_W))));
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={18}>
        <div style={{ position: "absolute", top: 92, left: 150 }}>
          <Eyebrow theme={t} size={30}>{eyebrow}</Eyebrow>
        </div>
        <div style={{ position: "absolute", top: 210, left: 150, right: 150, display: "flex", flexDirection: "column", gap: 62 }}>
          {bullets.map((b, i) => {
            const at = spread(durationInFrames, bullets.length, i);
            const s = kick(frame, fps, at, SPR.settle);
            const hl = kick(frame, fps, at + 10, SPR.soft);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 34, opacity: s, transform: `translateY(${(1 - s) * 34}px)` }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: t.color.gold,
                    boxShadow: `0 0 0 ${8 * s}px ${t.color.gold}22, 0 6px 14px ${t.color.shadow}`,
                    flexShrink: 0,
                  }}
                />
                <div style={{ fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontSize: bodySize, lineHeight: 1.15, color: ink.text, textShadow: ink.shadowStrong }}>
                  {b.pre && <span style={{ color: ink.soft, fontWeight: 500 }}>{b.pre} </span>}
                  <span style={{ position: "relative", whiteSpace: "nowrap" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: -8,
                        right: -8,
                        bottom: 2,
                        height: "48%",
                        background: t.color.accent,
                        opacity: 0.32,
                        borderRadius: 8,
                        transform: `scaleX(${hl})`,
                        transformOrigin: "left center",
                      }}
                    />
                    <span style={{ position: "relative", color: ink.text }}>{b.key}</span>
                  </span>
                  {b.post && <span style={{ color: ink.soft, fontWeight: 500 }}> {b.post}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </Stage>
  );
};
