import React from "react";
import { interpolate } from "remotion";
import { SfxCue, SFX } from "../../components/Sfx";
import { SPR, Theme, useTheme } from "./theme";
import {
  Arrow,
  Card,
  ContactShadow,
  Display,
  Eyebrow,
  ImgOr,
  Motas,
  Panel,
  PhotoBlock,
  Stage,
  Support,
  kick,
  spread,
  useBeat,
} from "./core";
import { Band, Cinema, Headline, Kicker, OnPaper, Plinth, Reflection, autoSize, mblur, tilt3d, useDrift, useKeyLight, usePush, useRack, slabShadow } from "./stagecraft";

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIA: DIAGRAMAS — CutawayCallouts · FlowSteps · CycleLoop · LayerStack
// ═══════════════════════════════════════════════════════════════════════════

// ── CutawayCallouts — lámina central + rótulos con líneas codo que se dibujan ─
export type Callout = {
  text: string;
  sub?: string;
  /** punto señalado dentro de la lámina, en fracción 0..1 */
  tx: number;
  ty: number;
  /** lado del rótulo */
  side?: "left" | "right";
};
export const CutawayCallouts: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  title?: string;
  image?: string;
  callouts?: Callout[];
}> = ({
  durationInFrames,
  theme,
  eyebrow = "Por dentro",
  title = "Dónde falla realmente",
  image,
  callouts = [
    { text: "Entrada de aire", sub: "acá se tapa primero", tx: 0.3, ty: 0.3, side: "left" },
    { text: "Sello de goma", sub: "se reseca en 2 años", tx: 0.72, ty: 0.42, side: "right" },
    { text: "Drenaje", sub: "el 80% de las fallas", tx: 0.5, ty: 0.78, side: "left" },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  // lámina central
  const PW = 760;
  const PH = 620;
  const PX = (1800 - PW) / 2; // coords dentro del panel (1800x960 aprox)
  const PY = 210;
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={50}>
        <div style={{ position: "absolute", top: 48, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Eyebrow theme={t}>{eyebrow}</Eyebrow>
          <Display theme={t} size={56}>{title}</Display>
        </div>
        {/* midground: la lámina */}
        <div style={{ position: "absolute", left: PX, top: PY }}>
          <PhotoBlock theme={t} src={image} seed={5} width={PW} height={PH} />
        </div>
        {/* foreground: leaders + rótulos */}
        <svg viewBox="0 0 1800 960" width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {callouts.map((c, i) => {
            const at = spread(durationInFrames, callouts.length, i);
            const px = PX + c.tx * PW;
            const py = PY + c.ty * PH;
            const left = (c.side ?? (c.tx < 0.5 ? "left" : "right")) === "left";
            const lx = left ? PX - 96 : PX + PW + 96;
            return (
              <g key={i}>
                <circle cx={px} cy={py} r={13} fill={t.color.gold} stroke={t.color.surfaceStrong} strokeWidth={4} opacity={kick(frame, fps, at, SPR.pop)} />
                <Arrow x1={lx} y1={py - 6} x2={px + (left ? -20 : 20)} y2={py} curve={left ? 26 : -26} at={at + 4} dur={16} color={t.color.ink} width={5} />
              </g>
            );
          })}
        </svg>
        {callouts.map((c, i) => {
          const at = spread(durationInFrames, callouts.length, i);
          const s = kick(frame, fps, at + 10, SPR.snappy);
          const py = PY + c.ty * PH;
          const left = (c.side ?? (c.tx < 0.5 ? "left" : "right")) === "left";
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: py - 58,
                ...(left ? { right: 1800 - PX + 100 } : { left: PX + PW + 100 }),
                opacity: s,
                transform: `translateX(${(1 - s) * (left ? 26 : -26)}px)`,
                maxWidth: 380,
              }}
            >
              <Card theme={t} accent={t.color.gold} style={{ padding: "16px 26px", textAlign: left ? "right" : "left" }}>
                <Display theme={t} size={32}>{c.text}</Display>
                {c.sub && <Support theme={t} size={23} style={{ marginTop: 4 }}>{c.sub}</Support>}
              </Card>
            </div>
          );
        })}
      </Panel>
    </Stage>
  );
};

// ── FlowSteps — proceso A→B→C con nodos que aterrizan y flechas dibujadas ────
export type FlowNode = { label: string; sub?: string; image?: string };
export const FlowSteps: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  nodes?: FlowNode[];
  kicker?: string;
  sfx?: boolean;
}> = ({
  durationInFrames,
  theme,
  kicker = "Paso a paso",
  title = "Del problema a la solución",
  nodes = [
    { label: "Juntar", sub: "ceniza fina" },
    { label: "Mezclar", sub: "con agua de lluvia" },
    { label: "Colar", sub: "y reposar 24 hs" },
    { label: "Aplicar", sub: "al pie de la planta" },
  ],
  sfx = true,
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const n = Math.min(nodes.length, 5);
  // ★ REESCRITO (jul 2026). Antes: 3 circulitos de 220px flotando en el medio de
  // una tarjeta crema, con el título chico arriba y ~30% del alto vacío. Ahora
  // el proceso vive en una BANDA de papel con canto vivo (contraste real contra
  // el b-roll oscurecido arriba y abajo), medallones grandes, y las flechas
  // llevan un pulso que viaja: se lee el SENTIDO del proceso, no tres fotos.
  const BAND_TOP = 322;
  const BAND_H = 486;
  const CY = BAND_TOP + 214;
  const R = n <= 3 ? 132 : n === 4 ? 112 : 96;
  const cellW = 1920 / n;
  const drift = useDrift(0.5, 2);
  const push = usePush(durationInFrames, 0.02);
  const titleSize = autoSize(title, 82, 26, 54);
  const light = useKeyLight("top");
  // el foco viaja de un paso al siguiente, como lo va contando el avatar
  const rack = useRack(nodes.length, durationInFrames, { blur: 2.3, dim: 0.26, shrink: 0.035 });

  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Cinema theme={t} durationInFrames={durationInFrames} side="top" paper={0} grade={1.05} blur={20} shaftsX={22}>
        <Band theme={t} top={BAND_TOP} height={BAND_H} at={4} />

        {/* scrim local del titular: el grade general es parejo, pero el título va
            centrado justo donde el b-roll suele tener su zona más clara. Sin
            esto la tinta clara pelea contra el fondo. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: -60,
            height: 460,
            background: "radial-gradient(58% 100% at 50% 62%, rgba(18,13,8,0.66) 0%, rgba(18,13,8,0) 72%)",
            pointerEvents: "none",
          }}
        />
        {/* L8 — título sobre el b-roll graduado, arriba de la banda */}
        <div style={{ position: "absolute", top: 118, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Kicker theme={t} at={2} size={30}>{kicker}</Kicker>
          <Headline theme={t} at={8} size={titleSize} style={{ textAlign: "center", maxWidth: 1500 }}>
            {title}
          </Headline>
        </div>

        {/* L7b — flechas de tinta con pulso viajero */}
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {Array.from({ length: n - 1 }, (_, i) => {
            const x0 = cellW * (i + 0.5) + R + 34;
            const x1 = cellW * (i + 1.5) - R - 34;
            const at = spread(durationInFrames, nodes.length, i) + 12;
            const pulse = ((frame - at) % 46) / 46;
            const px = x0 + (x1 - x0) * pulse;
            const alive = frame > at + 16 && pulse < 0.94;
            return (
              <g key={i}>
                <Arrow x1={x0} y1={CY} x2={x1} y2={CY} curve={-26} at={at} dur={16} color={t.color.accent} width={9} />
                {alive && (
                  <circle
                    cx={px}
                    cy={CY - 13 * Math.sin(pulse * Math.PI)}
                    r={9}
                    fill={t.color.gold}
                    opacity={Math.sin(pulse * Math.PI) * 0.95}
                    style={{ filter: `drop-shadow(0 0 12px ${t.color.gold})` }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* L7 — medallones */}
        {nodes.slice(0, n).map((node, i) => {
          const at = spread(durationInFrames, nodes.length, i);
          const s = kick(frame, fps, at, SPR.settle);
          const cx = cellW * (i + 0.5);
          const dy = Math.sin(frame / 78 + i * 1.4) * 4; // vida propia por nodo
          const labelS = kick(frame, fps, at + 8, SPR.snappy);
          const f = rack(i);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cx - cellW / 2,
                top: CY - R - 34,
                width: cellW,
                textAlign: "center",
                opacity: s * f.opacity,
                filter: [mblur(s, 9), f.blur > 0.2 ? `blur(${f.blur.toFixed(2)}px)` : ""].filter(Boolean).join(" ") || undefined,
                transform: `translateY(${(1 - s) * 52 + dy}px) translateX(${drift.x * (0.3 + i * 0.12)}px) scale(${(push * f.scale).toFixed(4)})`,
              }}
            >
              <div style={{ position: "relative", width: R * 2, height: R * 2, margin: "0 auto" }}>
                <Plinth theme={t} width={R * 1.9} y={R * 2 - 6} opacity={0.6} />
                <Reflection theme={t} width={R * 1.5} height={R * 0.7} y={R * 2 + 4} opacity={0.16} />
                {/* anillo exterior de tinta + halo de acento */}
                <div style={{ position: "absolute", inset: -14, borderRadius: "50%", border: `2px solid ${t.color.gold}`, opacity: 0.45 }} />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `${t.strokeW + 2}px solid ${t.color.ink}`,
                    boxShadow: `${slabShadow(light, { lift: 1.6, edge: "rgba(0,0,0,0.5)" })}, inset 0 0 34px rgba(0,0,0,0.34)`,
                    background: t.color.surfaceStrong,
                    transform: tilt3d({ amount: 1.1, seed: i * 2.4, frame, z: f.focus * 26 }),
                  }}
                >
                  {node.image ? (
                    <ImgOr src={node.image} seed={i + 12} theme={t} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(circle at 34% 28%, ${t.color.bg1}, ${t.color.bg2})`, fontFamily: t.fontDisplay, fontSize: R * 0.95, fontWeight: 900, color: t.color.accent }}>
                      {i + 1}
                    </div>
                  )}
                  {/* rim light del medallón */}
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(150deg, rgba(255,255,255,0.34), rgba(255,255,255,0) 46%)" }} />
                </div>
                {node.image && (
                  <div
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      width: 74,
                      height: 74,
                      borderRadius: "50%",
                      background: `radial-gradient(circle at 36% 30%, ${t.color.gold}, ${t.color.accent})`,
                      border: `4px solid ${t.color.surfaceStrong}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: t.color.onAccent,
                      fontWeight: 900,
                      fontSize: 36,
                      fontFamily: t.fontLabel,
                      boxShadow: `0 12px 24px ${t.color.shadow}`,
                      transform: `scale(${kick(frame, fps, at + 6, SPR.pop)})`,
                    }}
                  >
                    {i + 1}
                  </div>
                )}
              </div>
              <OnPaper>
                <div style={{ opacity: labelS, transform: `translateY(${(1 - labelS) * 14}px)`, marginTop: 26, padding: "0 24px" }}>
                  <Display theme={t} size={autoSize(node.label, 48, 18, 34)}>{node.label}</Display>
                  {node.sub && (
                    <Support theme={t} size={30} style={{ marginTop: 6 }}>
                      {node.sub}
                    </Support>
                  )}
                </div>
              </OnPaper>
            </div>
          );
        })}
        {sfx && (
          <>
            <SfxCue at={2} src={SFX.whoosh} volume={0.26} />
            {nodes.slice(0, n).map((_, i) => (
              <SfxCue key={i} at={spread(durationInFrames, nodes.length, i)} src={i % 2 ? SFX.pop2 : SFX.pop1} volume={0.24} durationInFrames={16} />
            ))}
            {Array.from({ length: n - 1 }, (_, i) => (
              <SfxCue key={`a${i}`} at={spread(durationInFrames, nodes.length, i) + 12} src={SFX.swish} volume={0.18} />
            ))}
          </>
        )}
      </Cinema>
    </Stage>
  );
};

// ── CycleLoop — ciclo circular con cometa orbitando y nodos en stagger ───────
export type CycleNode = { label: string; sub?: string };
export const CycleLoop: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  center?: string;
  nodes?: CycleNode[];
}> = ({
  durationInFrames,
  theme,
  title = "El ciclo que se mantiene solo",
  center = "COMPOST",
  nodes = [
    { label: "Restos", sub: "de cocina" },
    { label: "Descompone", sub: "6 semanas" },
    { label: "Abono", sub: "listo" },
    { label: "Huerta", sub: "alimenta" },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const CX = 900;
  const CY = 545;
  const R = 310;
  const orbit = interpolate(frame, [12, durationInFrames], [0, 320], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const centerS = kick(frame, fps, 8, SPR.settle);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={84}>
        <Motas theme={t} count={12} opacity={0.35} />
        <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center" }}>
          <Display theme={t} size={54}>{title}</Display>
        </div>
        <svg viewBox="0 0 1800 960" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <circle cx={CX} cy={CY - 60} r={R} fill="none" stroke={t.color.line} strokeWidth={3} strokeDasharray="4 16" />
          {/* cometa orbital con estela */}
          {Array.from({ length: 7 }, (_, k) => {
            const a = ((orbit - k * 5) * Math.PI) / 180 - Math.PI / 2;
            return (
              <circle
                key={k}
                cx={CX + Math.cos(a) * R}
                cy={CY - 60 + Math.sin(a) * R}
                r={11 - k * 1.3}
                fill={t.color.gold}
                opacity={(1 - k / 7) * 0.9}
              />
            );
          })}
        </svg>
        {/* centro */}
        <div
          style={{
            position: "absolute",
            left: CX - 130,
            top: CY - 60 - 130,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: `radial-gradient(circle at 36% 28%, ${t.color.bg2}, ${t.color.bg0})`,
            border: `3px solid ${t.color.gold}`,
            boxShadow: `0 26px 50px ${t.color.shadow}, inset 0 0 40px ${t.color.shadow}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: centerS,
            transform: `scale(${0.8 + centerS * 0.2})`,
          }}
        >
          <Display theme={t} size={42} color={t.color.gold}>{center}</Display>
        </div>
        {nodes.slice(0, 6).map((node, i) => {
          const count = Math.min(nodes.length, 6);
          const a = (i / count) * Math.PI * 2 - Math.PI / 2;
          const nx = CX + Math.cos(a) * R;
          const ny = CY - 60 + Math.sin(a) * R;
          const at = 14 + i * 10;
          const s = kick(frame, fps, at, SPR.snappy);
          return (
            <div key={i} style={{ position: "absolute", left: nx - 132, top: ny - 62, width: 264, opacity: s, transform: `scale(${0.8 + s * 0.2})` }}>
              <Card theme={t} accent={t.color.accent} style={{ padding: "14px 22px", textAlign: "center" }}>
                <Display theme={t} size={33}>{node.label}</Display>
                {node.sub && <Support theme={t} size={23}>{node.sub}</Support>}
              </Card>
            </div>
          );
        })}
      </Panel>
    </Stage>
  );
};

// ── LayerStack — ensamblado por capas: planos 3D que caen y se apilan ────────
export type StackLayer = { label: string; color?: string };
export const LayerStack: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  layers?: StackLayer[];
}> = ({
  durationInFrames,
  theme,
  title = "Las capas, en orden",
  layers = [
    { label: "Tierra negra" },
    { label: "Compost maduro" },
    { label: "Ramas finas" },
    { label: "Troncos gruesos" },
  ],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const colors = [t.color.accent, t.color.gold, t.color.accent2, t.color.accentSoft, t.color.good];
  const n = layers.length;
  const CX = 660;
  const BASE_Y = 700;
  const LH = 92; // separación vertical entre capas apiladas
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={30}>
        <div style={{ position: "absolute", top: 58, left: 120 }}>
          <Eyebrow theme={t}>Cómo se arma</Eyebrow>
          <Display theme={t} size={58} style={{ marginTop: 10 }}>{title}</Display>
        </div>
        {/* las capas caen desde arriba, la de abajo primero (índice n-1) */}
        {layers.map((ly, i) => {
          const fromBottom = n - 1 - i; // 0 = capa de abajo
          const at = spread(durationInFrames, layers.length, fromBottom);
          const s = kick(frame, fps, at, SPR.settle);
          const y = BASE_Y - fromBottom * LH;
          const col = ly.color ?? colors[i % colors.length];
          const drop = (1 - s) * -260;
          const labelS = kick(frame, fps, at + 10, SPR.snappy);
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: CX - 330, top: y + drop, opacity: s, filter: `drop-shadow(0 ${18 + fromBottom * 4}px 24px ${t.color.shadow})` }}>
                {/* plano isométrico (rombo) con cara lateral = profundidad real */}
                <svg viewBox="0 0 660 210" width={660} height={210}>
                  <path d={`M 330 10 L 640 92 L 330 174 L 20 92 Z`} fill={col} stroke={t.color.ink} strokeWidth={3} />
                  <path d={`M 20 92 L 330 174 L 330 206 L 20 124 Z`} fill={col} style={{ filter: "brightness(0.72)" }} stroke={t.color.ink} strokeWidth={2} />
                  <path d={`M 640 92 L 330 174 L 330 206 L 640 124 Z`} fill={col} style={{ filter: "brightness(0.55)" }} stroke={t.color.ink} strokeWidth={2} />
                  <path d={`M 330 10 L 640 92 L 330 174 L 20 92 Z`} fill="rgba(255,255,255,0.14)" opacity={0.6} />
                </svg>
              </div>
              <div style={{ position: "absolute", left: CX + 380, top: y + 40, opacity: labelS, transform: `translateX(${(1 - labelS) * -24}px)`, display: "flex", alignItems: "center", gap: 18 }}>
                <svg viewBox="0 0 90 12" width={90} height={12}>
                  <line x1={0} y1={6} x2={86} y2={6} stroke={col} strokeWidth={5} strokeLinecap="round" />
                </svg>
                <div>
                  <Display theme={t} size={38}>{ly.label}</Display>
                  <Support theme={t} size={23}>capa {n - i} de {n}</Support>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <ContactShadow theme={t} width={720} opacity={0.5} style={{ position: "absolute", left: CX - 360, top: BASE_Y + 176 }} />
      </Panel>
    </Stage>
  );
};
