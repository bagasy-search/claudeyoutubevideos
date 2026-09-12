// VoltPops.tsx — LOS MICRO-EFECTOS del video `cmebateria`.
//
// Esto es la mitad de la vara que pidió el creador: además de que cada micro-acción tenga su imagen o
// su clip real, **cada cifra que Claudio dice aparece en pantalla en el milisegundo exacto**, con su
// sonidito y, al lado, un ícono PNG sin fondo. Nueve efectos, exactamente los que pidieron los
// directores de sección en `_v3/cmebateria_moments.json`:
//
//   OVERLAY (van ENCIMA del avatar hablando, fondo transparente):
//     · numberpop  — el número grande + su bajada + el ícono al lado  (19 usos)
//     · chip       — etiqueta corta voltio que entra de costado        (9)
//     · meterjump  — la lectura de la pinza: dígitos que tiemblan y SALTAN al valor (7)
//     · cross      — la X ámbar de dos trazos sobre lo que no sirve    (6)
//     · arrowup    — flecha voltio que sube junto a una cifra          (1)
//     · qrfloat    — la tarjeta del QR flotando al costado             (1)
//
//   PANTALLA COMPLETA (escena propia):
//     · whitebeat  — la escena casi blanca, limpia y hermosa           (7)
//     · costfly    — la camionetita cruza el mapa y el COSTO LE SALTA  (2)
//     · splitprice — dos cifras enfrentadas                            (5)
//
// El pedido literal del creador, para que no se pierda: *"cuando dice 18 aparece el número dieciocho
// con un sonidito suave sobre la pantalla encima del avatar, al lado un calendario PNG sin fondo"* y
// *"cuando dice los costos, un efecto tipo escena sencilla pero hermosa, casi blanca: una camionetita
// PNG por un mapita, y cuando dice el precio del envío, en el ms exacto, que ese costo SALTE desde la
// camionetita"*. `numberpop` y `costfly` son eso, literal.
//
// CONTRATO TÉCNICO: nada de Math.random()/Date.now() (el farm rinde en chunks paralelos) · nada de
// backdrop-filter · Easing.quint NO EXISTE → Easing.poly(5) · safe area 60 px.
import React from "react";
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, lerp, rnd, WhiteRoom, IconPng } from "./VoltStage";

// ── SONIDO ──────────────────────────────────────────────────────────────────────────────────
// El "sonidito suave" del pedido. Cada efecto trae su `sfx` en la spec; acá se mapea al archivo real.
const SFX: Record<string, string> = {
  tick: "sfx/digit_tick.mp3",
  chime: "sfx/sfx_chime.mp3",
  whoosh: "sfx/sfx_whoosh_soft.mp3",
  swipe: "sfx/whoosh.mp3",
  swoosh: "sfx/whoosh.mp3",
  buzz: "sfx/sfx_thump.mp3",
  buzz_off: "sfx/sfx_thump.mp3",
  beep: "sfx/node_pop.mp3",
  shimmer: "sfx/px_sparkleClean.mp3",
  clank: "sfx/impacto_hit.mp3",
  cash: "sfx/winner_chime.mp3",
  thunder_soft: "sfx/deep-cinematic-impact-1.mp3",
  pop: "sfx/sfx_pop.mp3",
};
const Sfx: React.FC<{ name?: string | null; at?: number; vol?: number }> = ({ name, at = 0, vol = 0.5 }) => {
  const f = SFX[name || ""] || null;
  if (!f) return null;
  return <Audio src={staticFile(f)} startFrom={0} volume={vol} />;
};

const icon = (n?: string | null) => (n ? `img/cmebateria/cmeb_ic_${n}.png` : null);

// entrada con overshoot + salida limpia (nunca un fade largo: 6 frames)
const useLife = (D: number, inF = 9, outF = 7) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 13, mass: 0.52, stiffness: 150 } });
  const out = clamp01((frame - (D - outF)) / outF);
  return { frame, s, out, alive: 1 - out };
};

export type Efecto = {
  kind: string; texto?: string; sub?: string; icono?: string | null; sfx?: string | null;
  left?: string; right?: string; leftSub?: string; rightSub?: string; unit?: string; nota?: string;
};

// ══════════════════════════════════════════════════════════════════════════════════════════
// OVERLAYS — encima del avatar, fondo TRANSPARENTE
// ══════════════════════════════════════════════════════════════════════════════════════════

// ── numberpop — el pedido literal: el número + su bajada + el ícono PNG al lado ─────────────
export const NumberPop: React.FC<{ e: Efecto; durationInFrames: number }> = ({ e, durationInFrames: D }) => {
  const { frame, s, alive } = useLife(D);
  const ic = icon(e.icono);
  const y = lerp(26, 0, s);
  const glow = 0.22 + Math.sin(frame / 17) * 0.06;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Sfx name={e.sfx || "tick"} vol={0.42} />
      <div style={{
        position: "absolute", right: 96, top: "50%",
        transform: `translateY(calc(-50% + ${y.toFixed(1)}px)) scale(${(0.9 + s * 0.1).toFixed(3)})`,
        opacity: alive, display: "flex", alignItems: "center", gap: 26,
      }}>
        {ic && (
          <div style={{ opacity: clamp01(s * 1.4 - 0.25), transform: `translateX(${lerp(34, 0, s).toFixed(1)}px)` }}>
            <Img src={staticFile(ic)} style={{ width: 132, height: "auto", filter: `drop-shadow(0 14px 30px ${rgba(V.ink0, 0.85)})` }} />
          </div>
        )}
        <div style={{
          padding: "20px 30px", borderRadius: 18, textAlign: "right",
          background: "linear-gradient(180deg, rgba(8,9,6,0.90) 0%, rgba(8,9,6,0.70) 100%)",
          boxShadow: `0 22px 64px rgba(0,0,0,0.66), inset 0 1px 0 ${rgba(V.volt, 0.22)}`,
        }}>
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 156, lineHeight: 0.86, color: V.volt,
            textShadow: `0 0 62px ${rgba(V.volt, glow)}, 0 6px 26px rgba(0,0,0,0.92)`,
          }}>{e.texto}</div>
          {e.sub && (
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 3.4, marginTop: 8,
              color: rgba(V.white, 0.78), textTransform: "uppercase",
            }}>{e.sub}</div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── chip — etiqueta corta que entra de costado ──────────────────────────────────────────────
export const Chip: React.FC<{ e: Efecto; durationInFrames: number }> = ({ e, durationInFrames: D }) => {
  const { s, alive } = useLife(D);
  const ic = icon(e.icono);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Sfx name={e.sfx || "pop"} vol={0.34} />
      <div style={{
        position: "absolute", left: 96, bottom: 128,
        transform: `translateX(${lerp(-90, 0, s).toFixed(1)}px)`, opacity: alive,
        display: "flex", alignItems: "center", gap: 16,
        padding: "16px 28px", borderRadius: 999,
        background: V.volt, boxShadow: `0 16px 44px ${rgba(V.volt, 0.24)}, 0 10px 30px rgba(0,0,0,0.6)`,
      }}>
        {ic && <Img src={staticFile(ic)} style={{ width: 46, height: "auto" }} />}
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 38, letterSpacing: 2.2, color: V.ink0, textTransform: "uppercase" }}>
          {e.texto}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── meterjump — la pinza: los dígitos tiemblan y SALTAN al valor ────────────────────────────
export const MeterJump: React.FC<{ e: Efecto; durationInFrames: number }> = ({ e, durationInFrames: D }) => {
  const { frame, s, alive } = useLife(D);
  const jump = Math.round(D * 0.34);                 // el salto ocurre acá
  const settled = frame >= jump;
  const shown = settled ? e.texto : String(Math.floor(rnd(frame * 2.3) * 9)) + "," + String(Math.floor(rnd(frame * 5.7) * 9));
  const kick = clamp01(1 - (frame - jump) / 8);
  const ic = icon(e.icono || "pinza");
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Sfx name={e.sfx || "beep"} vol={0.4} />
      <div style={{
        position: "absolute", left: 96, top: "50%",
        transform: `translateY(-50%) scale(${(0.94 + s * 0.06 + (settled ? kick * 0.07 : 0)).toFixed(3)})`,
        opacity: alive, padding: 26, borderRadius: 20, minWidth: 470,
        background: "linear-gradient(180deg, rgba(10,11,8,0.94) 0%, rgba(16,18,12,0.86) 100%)",
        boxShadow: `0 26px 70px rgba(0,0,0,0.7), inset 0 1px 0 ${rgba(V.volt, 0.24)}`,
        border: `1px solid ${rgba(V.volt, 0.2)}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          {ic && <Img src={staticFile(ic)} style={{ width: 44, height: "auto", opacity: 0.9 }} />}
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3.4, color: rgba(V.white, 0.6), textTransform: "uppercase" }}>
            {e.sub || "LA PINZA"}
          </div>
        </div>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 132, lineHeight: 0.9,
          color: settled ? V.volt : rgba(V.white, 0.42),
          textShadow: settled ? `0 0 60px ${rgba(V.volt, 0.34 + kick * 0.4)}` : "none",
          letterSpacing: 2,
        }}>
          {shown}
          {e.unit && <span style={{ fontSize: 46, marginLeft: 12, color: rgba(settled ? V.volt : V.white, 0.8) }}>{e.unit}</span>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── cross — la X ámbar de dos trazos sobre lo que no sirve ──────────────────────────────────
export const Cross: React.FC<{ e: Efecto; durationInFrames: number }> = ({ e, durationInFrames: D }) => {
  const { frame, alive } = useLife(D);
  const a = clamp01(frame / 7);                       // primer trazo
  const b = clamp01((frame - 6) / 8);                 // segundo trazo
  const S = 300;
  const stroke = (p: number, rot: number) => (
    <div style={{
      position: "absolute", left: "50%", top: "50%", width: S * p, height: 20, borderRadius: 10,
      background: V.danger, transformOrigin: "0% 50%",
      transform: `translate(${-S / 2}px, -10px) rotate(${rot}deg)`,
      boxShadow: `0 0 42px ${rgba(V.danger, 0.5)}`,
    }} />
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: alive }}>
      <Sfx name={e.sfx || "buzz"} vol={0.42} />
      <div style={{ position: "absolute", left: "50%", top: "46%", width: 0, height: 0 }}>
        {stroke(a, 34)}
        {b > 0 && stroke(b, -34)}
      </div>
      {e.texto && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: "62%", textAlign: "center",
          opacity: clamp01((frame - 10) / 8),
        }}>
          <span style={{
            display: "inline-block", padding: "14px 30px", borderRadius: 14,
            background: "rgba(8,9,6,0.88)", fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 52,
            letterSpacing: 2.4, color: V.danger, textTransform: "uppercase",
          }}>{e.texto}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── arrowup — la flecha voltio que sube junto a una cifra ───────────────────────────────────
export const ArrowUp: React.FC<{ e: Efecto; durationInFrames: number }> = ({ e, durationInFrames: D }) => {
  const { frame, s, alive } = useLife(D);
  const rise = interpolate(clamp01(frame / (D * 0.5)), [0, 1], [0, 1], { easing: Easing.bezier(0.2, 0.7, 0.25, 1) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: alive }}>
      <Sfx name={e.sfx || "whoosh"} vol={0.36} />
      <div style={{ position: "absolute", right: 150, bottom: 150, display: "flex", alignItems: "flex-end", gap: 22 }}>
        <div style={{ position: "relative", width: 60, height: 300 }}>
          <div style={{
            position: "absolute", left: 22, bottom: 0, width: 16, height: 300 * rise, borderRadius: 8,
            background: `linear-gradient(180deg, ${V.volt} 0%, ${rgba(V.volt, 0.25)} 100%)`,
            boxShadow: `0 0 36px ${rgba(V.volt, 0.4)}`,
          }} />
          <div style={{
            position: "absolute", left: 0, bottom: 300 * rise - 12, width: 0, height: 0,
            borderLeft: "30px solid transparent", borderRight: "30px solid transparent",
            borderBottom: `40px solid ${V.volt}`, opacity: rise > 0.06 ? 1 : 0,
          }} />
        </div>
        <div style={{ transform: `translateY(${lerp(20, 0, s).toFixed(1)}px)` }}>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 128, lineHeight: 0.9, color: V.volt, textShadow: "0 6px 26px rgba(0,0,0,0.9)" }}>{e.texto}</div>
          {e.sub && <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: rgba(V.white, 0.76), textTransform: "uppercase" }}>{e.sub}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── qrfloat — la tarjeta del QR flotando al costado mientras Claudio habla ──────────────────
// ⛔ Regla dura del canal: el QR NUNCA va a pantalla completa. Va al costado, con el presentador full.
export const QrFloat: React.FC<{ e: Efecto; durationInFrames: number; qr?: string; portada?: string }> = ({
  e, durationInFrames: D, qr = "img/cmebateria/cmeb_qr.png", portada,
}) => {
  const { frame, s, alive } = useLife(D, 12, 9);
  const drift = Math.sin(frame / 44) * 4;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: alive }}>
      <Sfx name={e.sfx || "shimmer"} vol={0.3} />
      <div style={{
        position: "absolute", right: 110, top: "50%",
        transform: `translate(${lerp(120, 0, s).toFixed(1)}px, calc(-50% + ${drift.toFixed(1)}px))`,
        width: 430, padding: 24, borderRadius: 22,
        background: "linear-gradient(180deg, #FBFAF5 0%, #EFEDE3 100%)",
        boxShadow: "0 34px 90px rgba(0,0,0,0.72), 0 6px 22px rgba(0,0,0,0.5)",
      }}>
        {portada && (
          <Img src={staticFile(portada)} style={{ width: "100%", borderRadius: 12, marginBottom: 16, boxShadow: "0 10px 26px rgba(0,0,0,0.34)" }} />
        )}
        <Img src={staticFile(qr)} style={{ width: "100%", borderRadius: 10, display: "block" }} />
        <div style={{
          marginTop: 16, textAlign: "center", fontFamily: F_BODY, fontWeight: 700, fontSize: 26,
          lineHeight: 1.24, color: "#25281C",
        }}>{e.texto || "Apunta la cámara de tu teléfono"}</div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════════════════
// PANTALLA COMPLETA — escena propia
// ══════════════════════════════════════════════════════════════════════════════════════════

// ── whitebeat — la escena casi blanca, limpia y hermosa ─────────────────────────────────────
export const WhiteBeat: React.FC<{ e: Efecto; durationInFrames: number }> = ({ e, durationInFrames: D }) => {
  const { frame, s, alive } = useLife(D, 10, 8);
  const ic = icon(e.icono);
  const float = Math.sin(frame / 38) * 7;
  return (
    <AbsoluteFill style={{ opacity: alive }}>
      <Sfx name={e.sfx || "chime"} vol={0.34} />
      <WhiteRoom at={0} dur={10}>
        {ic && (
          <Img src={staticFile(ic)} style={{
            position: "absolute", left: "50%", top: "38%", width: 300, height: "auto",
            transform: `translate(-50%,-50%) translateY(${float.toFixed(1)}px) scale(${(0.86 + s * 0.14).toFixed(3)})`,
            filter: "drop-shadow(0 26px 40px rgba(90,86,70,0.34))",
          }} />
        )}
        <div style={{
          position: "absolute", left: 0, right: 0, top: "62%", textAlign: "center",
          transform: `translateY(${lerp(24, 0, s).toFixed(1)}px)`,
        }}>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 168, lineHeight: 0.9, color: "#1E2116" }}>{e.texto}</div>
          {e.sub && (
            <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 5, marginTop: 12, color: "#6E6B5C", textTransform: "uppercase" }}>{e.sub}</div>
          )}
        </div>
      </WhiteRoom>
    </AbsoluteFill>
  );
};

// ── costfly — la camionetita cruza el mapa y el COSTO le SALTA (pedido literal) ─────────────
export const CostFly: React.FC<{ e: Efecto; durationInFrames: number }> = ({ e, durationInFrames: D }) => {
  const { frame, alive } = useLife(D, 10, 8);
  const jump = Math.round(D * 0.46);                       // el ms exacto en que se dice el precio
  const t = clamp01(frame / (D * 0.9));
  const tx = lerp(-14, 96, interpolate(t, [0, 1], [0, 1], { easing: Easing.bezier(0.35, 0, 0.3, 1) }));
  const p = clamp01((frame - jump) / 16);                   // el salto del costo
  const arcY = -170 * Math.sin(p * Math.PI * 0.85);
  const pop = p > 0 ? 1 + (1 - clamp01(p * 3)) * 0.4 : 0;
  return (
    <AbsoluteFill style={{ opacity: alive }}>
      <Sfx name={e.sfx || "whoosh"} vol={0.38} />
      <WhiteRoom at={0} dur={10}>
        {/* el mapita: plano de papel con su ruta */}
        <Img src={staticFile("img/cmebateria/cmeb_ic_mapa.png")} style={{
          position: "absolute", left: "50%", top: "54%", width: 1180, height: "auto",
          transform: "translate(-50%,-50%)", opacity: 0.9,
          filter: "drop-shadow(0 30px 46px rgba(90,86,70,0.28))",
        }} />
        {/* la línea de ruta que se va dibujando bajo la camioneta */}
        <div style={{
          position: "absolute", left: "6%", top: "58%", height: 8, width: `${clamp01(t) * 84}%`,
          borderRadius: 4, background: `linear-gradient(90deg, ${rgba(V.amber, 0.25)}, ${V.amber})`,
        }} />
        {/* la camionetita */}
        <Img src={staticFile("img/cmebateria/cmeb_ic_camioneta.png")} style={{
          position: "absolute", left: `${tx.toFixed(2)}%`, top: "50%", width: 260, height: "auto",
          transform: "translate(-50%,-50%)",
          filter: "drop-shadow(0 20px 30px rgba(90,86,70,0.36))",
        }} />
        {/* EL COSTO QUE SALTA DE LA CAMIONETA */}
        {p > 0 && (
          <div style={{
            position: "absolute", left: `${tx.toFixed(2)}%`, top: "50%",
            transform: `translate(-50%,-50%) translateY(${arcY.toFixed(1)}px) scale(${pop.toFixed(3)})`,
          }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 152, lineHeight: 0.9, color: "#1E2116",
              textShadow: `0 10px 30px rgba(120,110,80,${(0.3 * (1 - p)).toFixed(2)})`,
            }}>{e.texto}</div>
            {e.sub && (
              <div style={{ textAlign: "center", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "#6E6B5C", textTransform: "uppercase" }}>{e.sub}</div>
            )}
          </div>
        )}
      </WhiteRoom>
    </AbsoluteFill>
  );
};

// ── splitprice — dos cifras enfrentadas ─────────────────────────────────────────────────────
export const SplitPrice: React.FC<{ e: Efecto; durationInFrames: number }> = ({ e, durationInFrames: D }) => {
  const { frame, s, alive } = useLife(D, 10, 8);
  const open = interpolate(clamp01(frame / 14), [0, 1], [0, 1], { easing: Easing.bezier(0.2, 0.7, 0.25, 1) });
  const side = (txt: string, sub: string | undefined, color: string, dir: -1 | 1) => (
    <div style={{
      position: "absolute", left: dir < 0 ? 0 : "50%", top: 0, width: "50%", height: "100%",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      transform: `translateX(${(dir * (1 - open) * 34).toFixed(1)}%)`,
      background: dir < 0
        ? `linear-gradient(120deg, ${rgba(V.ink1, 0.96)} 0%, ${rgba(V.ink0, 0.92)} 100%)`
        : `linear-gradient(240deg, ${rgba(V.ink1, 0.96)} 0%, ${rgba(V.ink0, 0.92)} 100%)`,
    }}>
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 176, lineHeight: 0.88, color,
        textShadow: `0 0 70px ${rgba(color, 0.3)}, 0 8px 30px rgba(0,0,0,0.9)`,
        transform: `scale(${(0.9 + s * 0.1).toFixed(3)})`,
      }}>{txt}</div>
      {sub && (
        <div style={{
          marginTop: 18, maxWidth: "78%", textAlign: "center",
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 2.6,
          color: rgba(V.white, 0.74), textTransform: "uppercase", lineHeight: 1.2,
        }}>{sub}</div>
      )}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: alive, overflow: "hidden" }}>
      <Sfx name={e.sfx || "clank"} vol={0.4} />
      {side(e.left || e.texto || "", e.leftSub, V.white, -1)}
      {side(e.right || "", e.rightSub, V.volt, 1)}
      {/* el filo voltio del medio */}
      <div style={{
        position: "absolute", left: "50%", top: 0, width: 6, height: "100%", marginLeft: -3,
        background: `linear-gradient(180deg, rgba(0,0,0,0), ${V.volt} 22%, ${V.volt} 78%, rgba(0,0,0,0))`,
        boxShadow: `0 0 40px ${rgba(V.volt, 0.5)}`, opacity: open,
      }} />
      {e.nota && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 84, textAlign: "center",
          fontFamily: F_BODY, fontWeight: 600, fontSize: 30, color: rgba(V.white, 0.7),
        }}>{e.nota}</div>
      )}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════════════════
// EL DESPACHADOR — el build llama sólo a esto
// ══════════════════════════════════════════════════════════════════════════════════════════
export const OVERLAY_KINDS = new Set(["numberpop", "chip", "meterjump", "cross", "arrowup", "qrfloat"]);

export const VoltPop: React.FC<{ e: Efecto; durationInFrames: number; qr?: string; portada?: string }> = ({ e, durationInFrames, qr, portada }) => {
  const D = Math.max(6, durationInFrames);
  switch (e.kind) {
    case "numberpop": return <NumberPop e={e} durationInFrames={D} />;
    case "chip": return <Chip e={e} durationInFrames={D} />;
    case "meterjump": return <MeterJump e={e} durationInFrames={D} />;
    case "cross": return <Cross e={e} durationInFrames={D} />;
    case "arrowup": return <ArrowUp e={e} durationInFrames={D} />;
    case "qrfloat": return <QrFloat e={e} durationInFrames={D} qr={qr} portada={portada} />;
    case "whitebeat": return <WhiteBeat e={e} durationInFrames={D} />;
    case "costfly": return <CostFly e={e} durationInFrames={D} />;
    case "splitprice": return <SplitPrice e={e} durationInFrames={D} />;
    // fallback seguro: cualquier kind desconocido cae al numberpop en vez de dejar el cuadro vacío
    default: return <NumberPop e={e} durationInFrames={D} />;
  }
};
