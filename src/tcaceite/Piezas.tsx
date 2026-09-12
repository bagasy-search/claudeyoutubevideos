// Piezas.tsx — las tres primitivas de la capa base/overlay del montaje de `tcaceite`.
// Las escenas premium viven en Mov*.tsx; esto es lo que dibuja el material CRUDO entre medio.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, rgba, rnd } from "./VoltStage";

/** ⛔⛔ VA CON `OffthreadVideo`, NUNCA CON `<Video>`: al rendear, `<Video>` busca POR TIEMPO con un
 *  elemento HTML y no acierta el cuadro exacto -> repite y saltea de forma IRREGULAR = TIRÓN.
 *  CLIP real. Va a sangre y NO se corta (`noSplit`): el movimiento ya es dinámico.
 *  Cama de negro abajo para que nunca asome el avatar por los bordes del objectFit. */
export const Clip: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  return (
  <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
    <OffthreadVideo src={staticFile(src)} muted
      style={{
        width: "100%", height: "100%", objectFit: "cover",
        // ⛔ MUCHOS clips quedaron como PLANO QUIETO (el i2v se inventaba una persona a partir del
        // segundo 1). Sin esto se ven CONGELADOS 5 s, que es peor que una foto — a la foto el kit
        // si le da Ken-Burns. El empuje va por CSS, que es subpixel; horneado con ffmpeg cuantiza
        // a pixel entero y eso SI se lee como tiron.
        transform: `scale(${(1.02 + frame * 0.00035).toFixed(5)})`,
      }} />
  </AbsoluteFill>
  );
};

/** FOTO con Ken-Burns lento. `seed` la hace determinista (nunca Math.random: el farm
 *  renderiza en 60 chunks separados y cada uno tiene que dar exactamente lo mismo). */
export const Foto: React.FC<{ src: string; seed: number }> = ({ src, seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const r = rnd(seed);
  const dir = r > 0.5 ? 1 : -1;
  const z = interpolate(frame, [0, Math.max(2, durationInFrames)], [1.04, 1.11], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const px = interpolate(frame, [0, Math.max(2, durationInFrames)], [0, dir * 1.6], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{
        width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${z.toFixed(4)}) translateX(${px.toFixed(2)}%)`,
      }} />
    </AbsoluteFill>
  );
};

/** ICONO + número. Va ENCIMA de lo que ya se está viendo y NO tapa la capa de abajo:
 *  el número nunca va solo ni sobre fondo plano (regla de la vara). */
export const IconoNum: React.FC<{ src: string; texto?: string }> = ({ src, texto }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [Math.max(8, durationInFrames - 6), durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const a = Math.min(inP, out);
  const y = (1 - inP) * 26;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: "6.5%", top: "12%",
        display: "flex", alignItems: "center", gap: 22,
        opacity: a, transform: `translateY(${y.toFixed(1)}px)`,
      }}>
        <Img src={staticFile(src)} style={{
          width: 118, height: 118, objectFit: "contain",
          filter: `drop-shadow(0 10px 26px ${rgba(V.ink0, 0.75)})`,
        }} />
        {texto ? (
          <div style={{
            fontFamily: F_DISPLAY, fontSize: 96, lineHeight: 1, letterSpacing: "-0.01em",
            color: V.volt, textShadow: `0 6px 30px ${rgba(V.ink0, 0.9)}`,
            padding: "10px 22px", borderLeft: `5px solid ${rgba(V.volt, 0.85)}`,
          }}>{texto}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** ⛔ ROTULO DE VLOG — lo unico grafico que se permite sobre un plano real.
 *  Se ESCRIBE letra por letra con cursor, y abajo se dibuja un subrayado a mano alzada.
 *  Pedido del creador (ago-2026): "que no parezca edicion de plantilla; tipo animacion de tipeo,
 *  mas casero y super legible desde lejos". El sonido de tecla NO va aca: va mezclado en el WAV
 *  MASTER, porque el stitch del farm reemplaza el audio del render y se lo llevaria puesto.
 *  `bottom: 150` lo deja FUERA de los controles del reproductor web. */
export const Rotulo: React.FC<{ kick?: string; head: string; cps?: number }> = ({ head, cps = 26 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const texto = String(head || "");
  const escritos = Math.max(0, Math.min(texto.length, Math.floor((frame / fps) * cps)));
  const listo = escritos >= texto.length;
  const finEscritura = Math.ceil((texto.length / cps) * fps);
  const salida = interpolate(frame, [Math.max(12, durationInFrames - 10), durationInFrames], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // el subrayado se dibuja a mano apenas termina de escribir
  const sub = interpolate(frame, [finEscritura + 2, finEscritura + 20], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // el cursor late mientras escribe y se va cuando termina
  const cursor = listo ? (frame - finEscritura < 26 ? (Math.floor(frame / 8) % 2 ? 1 : 0) : 0) : 1;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: salida }}>
      <div style={{ position: "absolute", left: 64, bottom: 150, maxWidth: 1300 }}>
        <div style={{
          display: "inline-block", padding: "16px 26px 18px",
          background: rgba(V.ink0, 0.72), borderLeft: `5px solid ${V.volt}`,
        }}>
          <div style={{
            fontFamily: F_DISPLAY, fontSize: 76, lineHeight: 1.03, color: V.white,
            textTransform: "uppercase", fontWeight: 800, letterSpacing: "-0.005em",
            textShadow: `0 4px 24px ${rgba(V.ink0, 0.95)}`, whiteSpace: "pre-wrap",
          }}>
            {texto.slice(0, escritos)}
            <span style={{ opacity: cursor, color: V.volt }}>▌</span>
          </div>
          {/* subrayado a mano: dos trazos apenas desalineados, nunca una linea recta de plantilla */}
          <svg width="100%" height="14" style={{ display: "block", marginTop: 6, overflow: "visible" }}>
            <path d={`M2,8 C120,3 300,11 ${Math.round(60 + 620 * sub)},6`} stroke={V.volt} strokeWidth="5"
              fill="none" strokeLinecap="round" opacity={0.92 * sub} />
            <path d={`M6,11 C140,7 320,13 ${Math.round(50 + 560 * sub)},9`} stroke={V.volt} strokeWidth="2"
              fill="none" strokeLinecap="round" opacity={0.4 * sub} />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** CIFRA suelta sobre un plano real: sólo donde el número ES la idea. Arriba a la
 *  derecha, lejos del rótulo, sin barras ni campos ni gráficos alrededor. */
export const Cifra: React.FC<{ valor: string; unidad?: string; pie?: string }> = ({ valor, unidad, pie }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 74, top: 96, textAlign: "right", opacity: a }}>
        <div style={{
          fontFamily: F_DISPLAY, fontSize: 132, lineHeight: 0.92, fontWeight: 800, color: V.volt,
          textShadow: `0 6px 30px ${rgba(V.ink0, 0.95)}`,
        }}>
          {valor}{unidad ? <span style={{ fontSize: 46, marginLeft: 8, opacity: 0.85 }}>{unidad}</span> : null}
        </div>
        {pie ? (
          <div style={{
            fontFamily: F_DISPLAY, fontSize: 24, letterSpacing: "0.12em", color: V.bone,
            textTransform: "uppercase", marginTop: 8, textShadow: `0 3px 14px ${rgba(V.ink0, 0.95)}`,
          }}>{pie}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** CTA DE CIERRE — el QR de la landing sobre el ultimo plano real.
 *  ⛔ Vivia SOLO dentro de MovCierre.tsx, que en modo VLOG no se monta: el video salia SIN QR.
 *  Por eso ahora es una pieza de la capa `over`, independiente de los movimientos.
 *  ⛔ El QR se verifica AL TAMANO DE PANTALLA (420-560 px), nunca sobre el PNG gigante:
 *  cv2 falla con modulos enormes aunque el codigo este perfecto (me costo un diagnostico entero).
 *  Sobrio a proposito: el creador pidio edicion limpia, no sobrecargada. */
export const CierreQR: React.FC<{ src: string; dominio: string; pie?: string }> = ({ src, dominio, pie }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = (1 - a) * 24;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", right: 96, bottom: 150,
        display: "flex", alignItems: "center", gap: 28,
        opacity: a, transform: `translateY(${y.toFixed(1)}px)`,
      }}>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: F_DISPLAY, fontSize: 62, lineHeight: 1.05, letterSpacing: "-0.01em",
            color: "#F2F4E9", textShadow: `0 6px 30px ${rgba(V.ink0, 0.95)}`,
          }}>{dominio}</div>
          {pie ? (
            <div style={{
              fontFamily: F_DISPLAY, fontSize: 34, marginTop: 10, letterSpacing: "0.04em",
              color: V.volt, textShadow: `0 4px 22px ${rgba(V.ink0, 0.95)}`,
            }}>{pie}</div>
          ) : null}
        </div>
        <div style={{
          background: "#F2F4E9", padding: 18, borderRadius: 10,
          boxShadow: `0 18px 48px ${rgba(V.ink0, 0.85)}`,
        }}>
          <Img src={staticFile(src)} style={{ width: 240, height: 240, display: "block" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
