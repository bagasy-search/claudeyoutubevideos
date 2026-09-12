import React from "react";
import { interpolate } from "remotion";
import { SPR, Theme, useTheme } from "./theme";
import {
  Burst,
  Card,
  ContactShadow,
  Cross,
  Display,
  Eyebrow,
  ImgOr,
  Odo,
  Panel,
  PhotoBlock,
  Stage,
  Support,
  Tick,
  kick,
  useBeat,
} from "./core";
import { Grain, Kicker, LensVignette, autoSize, usePush } from "./stagecraft";

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIA: COMPARACIÓN — VsDuel · BeforeAfter · DuelColumns · TierRanking
// ═══════════════════════════════════════════════════════════════════════════

export type VsSide = {
  label: string;
  sub?: string;
  image?: string;
  value?: number;
  unit?: string;
  good?: boolean;
};

// ── VsDuel — dos contendientes cara a cara con medallón VS que ESTAMPA ───────
export const VsDuel: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  title?: string;
  left?: VsSide;
  right?: VsSide;
}> = ({
  durationInFrames,
  theme,
  eyebrow = "Frente a frente",
  title = "¿Cuál conviene de verdad?",
  left = { label: "Comprado", sub: "$60.000 por temporada", value: 60000, unit: "$", good: false },
  right = { label: "Casero", sub: "una tarde de trabajo", value: 900, unit: "$", good: true },
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const VS_AT = 22;
  const vsS = kick(frame, fps, VS_AT, SPR.slam);

  const Side: React.FC<{ side: VsSide; at: number; flip?: boolean }> = ({ side, at, flip }) => {
    const s = kick(frame, fps, at, SPR.settle);
    const accent = side.good === undefined ? t.color.accent : side.good ? t.color.good : t.color.danger;
    return (
      <div
        style={{
          opacity: s,
          transform: `translateX(${(1 - s) * (flip ? 70 : -70)}px)`,
          textAlign: "center",
          width: 560,
        }}
      >
        <PhotoBlock theme={t} src={side.image} seed={at} width={560} height={370} accent={accent}>
          {side.good !== undefined && (
            <div style={{ position: "absolute", top: 16, left: 16 }}>
              {side.good ? <Tick at={at + 16} color={t.color.good} size={64} /> : <Cross at={at + 16} color={t.color.danger} size={64} />}
            </div>
          )}
        </PhotoBlock>
        <Display theme={t} size={52} style={{ marginTop: 22 }}>{side.label}</Display>
        {side.value !== undefined && (
          <div style={{ marginTop: 6 }}>
            <Odo theme={t} value={side.value} prefix={side.unit === "$" ? "$" : ""} suffix={side.unit !== "$" ? side.unit : ""} size={68} color={accent} at={at + 10} />
          </div>
        )}
        {side.sub && <Support theme={t} size={27} style={{ marginTop: 6 }}>{side.sub}</Support>}
      </div>
    );
  };

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={30}>
        <div style={{ position: "absolute", top: 56, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Eyebrow theme={t}>{eyebrow}</Eyebrow>
          <Display theme={t} size={62}>{title}</Display>
        </div>
        <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 130 }}>
          <Side side={left} at={8} />
          <Side side={right} at={16} flip />
        </div>
        {/* medallón VS que cae y estampa con polvo */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 400,
            transform: `translateX(-50%) scale(${vsS}) rotate(${(1 - vsS) * -24}deg)`,
            opacity: Math.min(1, vsS * 2),
          }}
        >
          <div style={{ position: "relative", width: 150, height: 150 }}>
            <Burst at={VS_AT + 3} color={t.color.gold} size={150} />
            <div
              style={{
                position: "absolute",
                inset: 8,
                borderRadius: "50%",
                background: `radial-gradient(circle at 36% 30%, ${t.color.gold}, ${t.color.accent} 78%)`,
                border: `4px solid ${t.color.surfaceStrong}`,
                boxShadow: `0 20px 40px ${t.color.shadow}, inset 0 -8px 18px rgba(0,0,0,0.3)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: t.fontDisplay,
                fontWeight: 900,
                fontSize: 56,
                color: t.color.onAccent,
                textShadow: "0 2px 6px rgba(0,0,0,0.35)",
              }}
            >
              VS
            </div>
          </div>
        </div>
      </Panel>
    </Stage>
  );
};

// ── BeforeAfter — barrido: la cortina "después" cruza y revela el cambio ─────
export const BeforeAfter: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeImage?: string;
  afterImage?: string;
  caption?: string;
}> = ({
  durationInFrames,
  theme,
  eyebrow = "El cambio",
  beforeLabel = "Antes",
  afterLabel = "Después",
  beforeImage,
  afterImage,
  caption = "El mismo lugar, 3 semanas más tarde",
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  // ★ REESCRITO (jul 2026). Antes: la comparación vivía en una cajita de
  // 1460x700 DENTRO de una tarjeta crema dentro de otra tarjeta crema, y a
  // escala 0.61 el divisor quedaba en 4px. Ahora sangra a todo el frame: la
  // comparación ES el plano, con el divisor como pieza real (manija, luz que
  // corre, sombra a los costados) y las etiquetas como chips grandes.
  const W = 1920;
  const H = 1080;
  const sweep = interpolate(frame, [14, 58], [0.985, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wipe = sweep * W;
  const tagB = kick(frame, fps, 22, SPR.snappy);
  const tagA = kick(frame, fps, 48, SPR.snappy);
  const capS = kick(frame, fps, 58, SPR.settle);
  const push = usePush(durationInFrames, 0.04);
  const glow = 0.7 + 0.3 * Math.sin(frame / 18);

  const Tag: React.FC<{ label: string; accent: string; s: number; right?: boolean }> = ({ label, accent, s, right }) => (
    <div
      style={{
        position: "absolute",
        top: 74,
        ...(right ? { right: 78 } : { left: 78 }),
        opacity: s,
        transform: `translateY(${(1 - s) * -20}px)`,
        background: accent,
        color: t.color.onAccent,
        fontFamily: t.fontLabel,
        fontWeight: 800,
        fontSize: 40,
        letterSpacing: t.labelSpacing + 1,
        textTransform: t.upperLabels ? "uppercase" : "none",
        padding: "16px 40px",
        borderRadius: t.radius * 0.6,
        boxShadow: `0 18px 40px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.28)`,
        textShadow: "0 2px 6px rgba(0,0,0,0.35)",
      }}
    >
      {label}
    </div>
  );

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {/* L1/L7 — las dos imágenes a sangre, con push de cámara compartido */}
        <div style={{ position: "absolute", inset: 0, transform: `scale(${push})` }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <ImgOr src={afterImage} seed={31} theme={t} />
          </div>
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${W - wipe}px 0 0)` }}>
            <div style={{ position: "absolute", inset: 0, filter: "saturate(0.42) brightness(0.78) sepia(0.24)" }}>
              <ImgOr src={beforeImage} seed={12} theme={t} />
            </div>
          </div>
        </div>

        {/* L2 — grade: viñeta y caída arriba/abajo para que el texto viva */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(24,18,12,0.72) 0%, rgba(24,18,12,0.12) 26%, rgba(24,18,12,0.12) 66%, rgba(24,18,12,0.8) 100%)",
          }}
        />

        {/* L7b — el divisor como objeto físico */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: wipe - 90, width: 180, background: `linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.45) 46%, rgba(0,0,0,0) 100%)` }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: wipe - 4,
            width: 8,
            background: `linear-gradient(180deg, ${t.color.gold}44, ${t.color.gold}, ${t.color.gold}44)`,
            boxShadow: `0 0 ${28 * glow}px ${t.color.glow}, 0 0 ${70 * glow}px ${t.color.glow}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: `${H / 2}px`,
            left: wipe,
            transform: "translate(-50%, -50%)",
            width: 104,
            height: 104,
            borderRadius: "50%",
            background: `radial-gradient(circle at 36% 30%, ${t.color.gold}, ${t.color.accent})`,
            border: `5px solid ${t.color.surfaceStrong}`,
            boxShadow: `0 20px 44px rgba(0,0,0,0.55), 0 0 ${40 * glow}px ${t.color.glow}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: t.color.onAccent,
            fontWeight: 900,
            fontSize: 44,
            fontFamily: t.fontLabel,
          }}
        >
          ⇄
        </div>

        <Tag label={beforeLabel} accent={t.color.danger} s={tagB} />
        <Tag label={afterLabel} accent={t.color.good} s={tagA} right />

        {/* L8 — kicker arriba, caption abajo, ambos sobre el grade */}
        <div style={{ position: "absolute", top: 76, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Kicker theme={t} at={2} size={32} color={t.color.gold}>{eyebrow}</Kicker>
        </div>
        {caption && (
          <div
            style={{
              position: "absolute",
              bottom: 78,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: capS,
              transform: `translateY(${(1 - capS) * 20}px)`,
              padding: "0 160px",
            }}
          >
            <div style={{ fontFamily: t.fontDisplay, fontWeight: t.displayWeight, fontSize: autoSize(caption, 54, 44, 36), color: "#F7F1DF", lineHeight: 1.16, textShadow: "0 3px 12px rgba(0,0,0,0.7), 0 18px 44px rgba(0,0,0,0.6)" }}>
              {caption}
            </div>
          </div>
        )}

        <Grain theme={t} />
        <LensVignette theme={t} strength={1.15} />
      </div>
    </Stage>
  );
};

// ── DuelColumns — tabla de atributos con ganador por fila (ticks/cruces) ─────
export type DuelRow = { attr: string; leftWins: boolean };
export const DuelColumns: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  leftName?: string;
  rightName?: string;
  rows?: DuelRow[];
}> = ({
  durationInFrames,
  theme,
  title = "Punto por punto",
  leftName = "Química",
  rightName = "Remedio casero",
  rows = [
    { attr: "Precio", leftWins: false },
    { attr: "Velocidad", leftWins: true },
    { attr: "Seguridad", leftWins: false },
    { attr: "Duración", leftWins: false },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }}>
        <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center" }}>
          <Display theme={t} size={60}>{title}</Display>
        </div>
        <div style={{ position: "absolute", top: 196, left: "50%", transform: "translateX(-50%)", width: 1280 }}>
          {/* header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px 300px", gap: 18, marginBottom: 16, alignItems: "center" }}>
            <div />
            {[leftName, rightName].map((n, i) => {
              const s = kick(frame, fps, 6 + i * 5, SPR.settle);
              return (
                <div key={i} style={{ opacity: s, transform: `translateY(${(1 - s) * -12}px)` }}>
                  <Card theme={t} accent={i === 0 ? t.color.accent2 : t.color.accent} style={{ padding: "14px 10px", textAlign: "center" }}>
                    <Display theme={t} size={33} color={i === 0 ? t.color.accent2 : t.color.accent}>{n}</Display>
                  </Card>
                </div>
              );
            })}
          </div>
          {rows.map((r, i) => {
            const at = 16 + i * 9;
            const s = kick(frame, fps, at, SPR.snappy);
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 300px 300px",
                  gap: 18,
                  alignItems: "center",
                  opacity: s,
                  transform: `translateX(${(1 - s) * -34}px)`,
                  padding: "30px 0",
                  borderBottom: i < rows.length - 1 ? `1.5px solid ${t.color.line}` : "none",
                }}
              >
                <Display theme={t} size={44}>{r.attr}</Display>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {r.leftWins ? <Tick at={at + 6} color={t.color.good} /> : <Cross at={at + 6} color={t.color.danger} />}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {r.leftWins ? <Cross at={at + 9} color={t.color.danger} /> : <Tick at={at + 9} color={t.color.good} />}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </Stage>
  );
};

// ── TierRanking — podio S/A/B/C: filas de tier con items que aterrizan ───────
export type TierRow = { tier: string; color?: string; items: string[] };
export const TierRanking: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  rows?: TierRow[];
}> = ({
  durationInFrames,
  theme,
  title = "Ranking final",
  rows = [
    { tier: "S", items: ["Vinagre blanco", "Bicarbonato"] },
    { tier: "A", items: ["Bórax", "Cal apagada"] },
    { tier: "B", items: ["Sal gruesa"] },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const tierColors = [t.color.gold, t.color.accent, t.color.accent2, t.color.textDim];
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={22}>
        <div style={{ position: "absolute", top: 52, left: 110 }}>
          <Eyebrow theme={t}>Del mejor al peor</Eyebrow>
          <Display theme={t} size={62} style={{ marginTop: 10 }}>{title}</Display>
        </div>
        <div style={{ position: "absolute", top: 246, left: 110, right: 110, display: "flex", flexDirection: "column", gap: 34 }}>
          {rows.map((row, i) => {
            const at = 12 + i * 12;
            const s = kick(frame, fps, at, SPR.settle);
            const col = row.color ?? tierColors[i % tierColors.length];
            return (
              <div key={i} style={{ display: "flex", gap: 24, alignItems: "stretch", opacity: s, transform: `translateX(${(1 - s) * -50}px)` }}>
                <div
                  style={{
                    width: 152,
                    borderRadius: t.radius,
                    background: `linear-gradient(150deg, ${col}, ${col}CC)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: t.fontDisplay,
                    fontWeight: 900,
                    fontSize: 76,
                    color: t.color.onAccent,
                    boxShadow: `0 18px 36px ${t.color.shadow}, inset 0 -6px 14px rgba(0,0,0,0.25)`,
                    textShadow: "0 3px 8px rgba(0,0,0,0.3)",
                    flexShrink: 0,
                  }}
                >
                  {row.tier}
                </div>
                <Card theme={t} style={{ flex: 1, display: "flex", alignItems: "center", gap: 20, padding: "28px 36px" }}>
                  {row.items.map((it, j) => {
                    const js = kick(frame, fps, at + 8 + j * 6, SPR.pop);
                    return (
                      <div
                        key={j}
                        style={{
                          opacity: js,
                          transform: `scale(${0.7 + js * 0.3})`,
                          background: t.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(42,38,32,0.06)",
                          border: `1.5px solid ${col}`,
                          borderRadius: t.radius * 0.7,
                          padding: "12px 28px",
                          fontFamily: t.fontBody,
                          fontWeight: 700,
                          fontSize: 36,
                          color: t.color.text,
                        }}
                      >
                        {it}
                      </div>
                    );
                  })}
                </Card>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <ContactShadow theme={t} width={900} opacity={0.25} />
        </div>
      </Panel>
    </Stage>
  );
};
