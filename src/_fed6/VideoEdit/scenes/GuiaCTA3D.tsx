import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  random,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── GuiaCTA3D ───────────────────────────────────────────────────────────────
// Cierre comercial SUAVE de un canal de salud: la guía en PDF montada como un
// libro con volumen real (lomo en perspectiva + sombra larga + reflejo en el
// piso), el QR en su propia tarjeta clara con marcas de visor, y el bloque de
// texto escalonado. Escena limpia (sin foto del video), fondo oscuro con motas.
//
// El QR se mantiene NÍTIDO: nunca lleva blur, ni overlay de color, ni la línea
// de escaneo encima — la línea corre POR DETRÁS de la tarjeta blanca, así que
// sólo se ve en el marco. El código queda escaneable desde una tele.

const INTER = loadInter().fontFamily;

const BG = "#0E1D23";
const TEAL = "#12B3AE";
const TEAL_L = "#3FE0D6";
const CREAM = "#F3ECDD";
const AMBER = "#E8B96B";
const CORAL = "#E0523E";

const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// Lienzo fijo de la comp: 1920x1080 @ 30fps.
const W = 1920;
const H = 1080;

// Geometría del libro.
const BOOK_W = 430;
const BOOK_H = 610;
const SPINE = 46;

// Geometría del QR (el módulo mínimo en pantalla es 320px → escaneable).
const QR_FRAME = 470;
const QR_CARD = 380;
const QR_IMG = 320;
const QR_INSET = 8;
const QR_ARM = 60;

const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);

type Mote = { x: number; y: number; r: number; d: number; a: number; c: string };

const buildMotes = (): Mote[] => {
  const out: Mote[] = [];
  for (let i = 0; i < 16; i++) {
    const t = random(`gcta-t-${i}`);
    out.push({
      x: random(`gcta-x-${i}`) * 100,
      y: random(`gcta-y-${i}`) * 100,
      r: 3 + random(`gcta-r-${i}`) * 9,
      d: 0.35 + random(`gcta-d-${i}`) * 1.15,
      a: 0.06 + random(`gcta-a-${i}`) * 0.16,
      c: t > 0.86 ? CORAL : t > 0.6 ? AMBER : TEAL_L,
    });
  }
  return out;
};

const MOTES = buildMotes();

// Tapa de reemplazo cuando no llega `cover` — panel de marca, nunca staticFile(undefined).
const CoverFallback: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div
    style={{
      width: w,
      height: h,
      background: `linear-gradient(155deg, #14424A 0%, #0B2A31 55%, #071E24 100%)`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: 34,
      boxSizing: "border-box",
    }}
  >
    <div style={{ height: 5, width: "34%", background: AMBER, borderRadius: 3, opacity: 0.9 }} />
    <div style={{ height: 15, width: "82%", background: "rgba(243,236,221,0.86)", borderRadius: 4, marginTop: 20 }} />
    <div style={{ height: 15, width: "60%", background: "rgba(243,236,221,0.60)", borderRadius: 4, marginTop: 12 }} />
    <div style={{ height: 9, width: "42%", background: `${TEAL}CC`, borderRadius: 4, marginTop: 24 }} />
  </div>
);

// QR de reemplazo: patrón determinista (random con semilla), con los tres ojos
// de posicionamiento para que lea como un código y no como ruido.
const QrFallback: React.FC<{ size: number }> = ({ size }) => {
  const n = 21;
  const c = size / n;
  const isFinder = (r: number, k: number) => {
    const inBox = (r0: number, k0: number) => r >= r0 && r < r0 + 7 && k >= k0 && k < k0 + 7;
    const ring = (r0: number, k0: number) => {
      const dr = r - r0;
      const dk = k - k0;
      const edge = dr === 0 || dr === 6 || dk === 0 || dk === 6;
      const core = dr >= 2 && dr <= 4 && dk >= 2 && dk <= 4;
      return edge || core;
    };
    if (inBox(0, 0)) return ring(0, 0);
    if (inBox(0, 14)) return ring(0, 14);
    if (inBox(14, 0)) return ring(14, 0);
    return null;
  };
  const cells: React.ReactElement[] = [];
  for (let r = 0; r < n; r++) {
    for (let k = 0; k < n; k++) {
      const f = isFinder(r, k);
      const on = f === null ? random(`gcta-qr-${r}-${k}`) > 0.52 : f;
      if (!on) continue;
      cells.push(
        <rect key={`${r}-${k}`} x={k * c} y={r * c} width={c} height={c} fill="#0E1D23" />
      );
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect x={0} y={0} width={size} height={size} fill="#FFFFFF" />
      {cells}
    </svg>
  );
};

export const GuiaCTA3D: React.FC<{
  durationInFrames: number;
  cover?: string;
  qr?: string;
  domain?: string;
  kicker?: string;
  title?: string;
  desc?: string;
  scanTitle?: string;
  scanSub?: string;
}> = ({
  durationInFrames: D,
  cover,
  qr,
  domain = "www.drfederer.com",
  kicker = "La guía completa",
  title = "El Método Piel Joven",
  desc = "Las rutinas, los tiempos y las mezclas exactas que uso en consulta, reunidas en un solo PDF.",
  scanTitle = "Escanea el código",
  scanSub = "o toca el enlace de la descripción",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Tiempos: SIEMPRE fracciones de la duración, nunca frames absolutos ─────
  const f = (p: number) => Math.round(p * D);
  const springAt = (delayP: number, durP: number, damping = 20) =>
    spring({
      frame: frame - f(delayP),
      fps,
      durationInFrames: Math.max(6, f(durP)),
      config: { damping, mass: 0.9, stiffness: 100 },
    });

  const fadeAt = (startP: number, endP: number) =>
    interpolate(frame, [f(startP), f(endP)], [0, 1], { ...CL, easing: easeOut });

  // Libro
  const book = springAt(0, 0.2, 21);
  const bookRotY = interpolate(book, [0, 1], [-22, -8]) + 0.9 * Math.sin(frame / 47);
  const bookScale = interpolate(book, [0, 1], [0.9, 1]);
  const float = Math.sin(frame / 34) * 7 + Math.sin(frame / 21) * 2.2;

  // QR
  const qrIn = springAt(0.11, 0.18, 22);
  const qrScale = interpolate(qrIn, [0, 1], [0.86, 1]);
  const cornerTrace = interpolate(frame, [f(0.15), f(0.29)], [1, 0], { ...CL, easing: easeOut });

  // Barrido de escaneo: una sola pasada, y siempre POR DETRÁS de la tarjeta.
  const scanP = interpolate(frame, [f(0.2), f(0.42)], [0, 1], { ...CL, easing: easeInOut });
  const scanY = interpolate(scanP, [0, 1], [QR_INSET + 6, QR_FRAME - QR_INSET - 6]);
  const scanOp = interpolate(scanP, [0, 0.1, 0.78, 1], [0, 1, 1, 0], CL);

  // Texto escalonado
  const kickIn = springAt(0.24, 0.16);
  const titleIn = springAt(0.28, 0.18);
  const descIn = fadeAt(0.34, 0.44);
  const pillIn = springAt(0.4, 0.16, 17);
  const scanTxt = fadeAt(0.31, 0.41);

  // Parallax global muy lento de las motas
  const gx = Math.sin(frame / 118) * 16;
  const gy = Math.cos(frame / 151) * 11;

  return (
    <AbsoluteFill style={{ fontFamily: INTER, backgroundColor: BG }}>
      {/* Fondo: degradé radial oscuro */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(78% 70% at 34% 42%, rgba(18,179,174,0.16) 0%, rgba(12,38,44,0.55) 42%, rgba(6,14,18,0.94) 100%)",
        }}
      />

      {/* Motas de luz con parallax (máx. 16) */}
      <AbsoluteFill>
        {MOTES.map((m, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: m.r * 2,
              height: m.r * 2,
              borderRadius: "50%",
              background: m.c,
              opacity: m.a * interpolate(frame, [0, f(0.08)], [0, 1], CL),
              filter: `blur(${2 + m.r * 0.55}px)`,
              transform: `translate(${gx * m.d}px, ${gy * m.d + Math.sin(frame / 90 + i) * 6 * m.d}px)`,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* Piso: banda sutil que separa el reflejo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 812,
          width: W,
          height: H - 812,
          background: "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      {/* ── LIBRO 3D ───────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: 108,
          top: 150,
          width: 470,
          height: 780,
          opacity: interpolate(book, [0, 0.35], [0, 1], CL),
        }}
      >
        {/* Sombra proyectada larga y difusa */}
        <div
          style={{
            position: "absolute",
            left: -40,
            top: 636,
            width: 560,
            height: 116,
            borderRadius: "50%",
            background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 72%)",
            filter: "blur(20px)",
            transform: `translateX(${interpolate(book, [0, 1], [26, 8])}px) scaleX(${interpolate(
              book,
              [0, 1],
              [0.86, 1]
            )}) scaleY(${1 + float * 0.008})`,
            opacity: interpolate(book, [0, 1], [0, 0.9]) * (1 - float * 0.01),
          }}
        />

        {/* Reflejo espejado sobre el piso */}
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 648 + float * 0.5,
            width: BOOK_W,
            height: 210,
            overflow: "hidden",
            opacity: 0.2 * book,
            transform: `scaleY(-1) rotate(${bookRotY * 0.06}deg)`,
            transformOrigin: "center top",
            filter: "blur(3px)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 90%)",
            maskImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 90%)",
          }}
        >
          <div style={{ position: "absolute", left: 0, bottom: 0, width: BOOK_W, height: BOOK_H }}>
            {cover ? (
              <Img
                src={staticFile(cover)}
                style={{ display: "block", width: BOOK_W, height: BOOK_H, objectFit: "cover" }}
              />
            ) : (
              <CoverFallback w={BOOK_W} h={BOOK_H} />
            )}
          </div>
        </div>

        {/* Cuerpo del libro */}
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 30,
            width: BOOK_W,
            height: BOOK_H,
            perspective: 1700,
          }}
        >
          <div
            style={{
              position: "relative",
              width: BOOK_W,
              height: BOOK_H,
              transformStyle: "preserve-3d",
              transform: `translateY(${float - interpolate(book, [0, 1], [44, 0])}px) scale(${bookScale}) rotateY(${bookRotY}deg) rotateX(${interpolate(
                book,
                [0, 1],
                [5, 1.6]
              )}deg)`,
            }}
          >
            {/* Lomo en perspectiva */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: SPINE,
                height: BOOK_H,
                transformOrigin: "left center",
                transform: "rotateY(90deg)",
                background:
                  "linear-gradient(90deg, #0A2C32 0%, #14545C 26%, #0D3A42 62%, #061E23 100%)",
                borderTop: "1px solid rgba(243,236,221,0.16)",
                borderBottom: "1px solid rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 4,
                  height: BOOK_H * 0.62,
                  borderRadius: 2,
                  background: `linear-gradient(180deg, rgba(232,185,107,0) 0%, ${AMBER}AA 30%, ${AMBER}AA 70%, rgba(232,185,107,0) 100%)`,
                }}
              />
            </div>

            {/* Cara frontal: la tapa */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: BOOK_W,
                height: BOOK_H,
                borderRadius: "4px 12px 12px 4px",
                overflow: "hidden",
                boxShadow:
                  "0 46px 96px rgba(0,0,0,0.62), 0 10px 26px rgba(0,0,0,0.42), inset 0 0 0 1px rgba(243,236,221,0.14)",
                background: "#0B2A31",
              }}
            >
              {cover ? (
                <Img
                  src={staticFile(cover)}
                  style={{ display: "block", width: BOOK_W, height: BOOK_H, objectFit: "cover" }}
                />
              ) : (
                <CoverFallback w={BOOK_W} h={BOOK_H} />
              )}
              {/* Brillo de tapa + pliegue junto al lomo */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(102deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.10) 9%, rgba(255,255,255,0.12) 34%, rgba(255,255,255,0) 62%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Viñeta — va ANTES del texto y del QR: así nunca queda un velo de color
          encima del código (tiene que poder escanearse de verdad). */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(72% 66% at 50% 48%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.42) 78%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* ── COLUMNA DE TEXTO ───────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 0,
          width: 660,
          height: H,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Kicker con filete de acento */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: kickIn,
            transform: `translateX(${interpolate(kickIn, [0, 1], [-22, 0])}px)`,
          }}
        >
          <div
            style={{
              width: interpolate(kickIn, [0, 1], [0, 52]),
              height: 5,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${TEAL}, ${AMBER})`,
            }}
          />
          <div
            style={{
              fontWeight: 800,
              fontSize: 25,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: TEAL_L,
            }}
          >
            {kicker}
          </div>
        </div>

        {/* Título */}
        <div
          style={{
            fontWeight: 800,
            fontSize: 72,
            lineHeight: 1.04,
            letterSpacing: -1.4,
            color: CREAM,
            marginTop: 20,
            opacity: titleIn,
            transform: `translateY(${interpolate(titleIn, [0, 1], [30, 0])}px)`,
            textShadow: "0 16px 40px rgba(0,0,0,0.55)",
          }}
        >
          {title}
        </div>

        {/* Descripción: dos líneas como máximo */}
        {desc ? (
          <div
            style={{
              fontWeight: 500,
              fontSize: 29,
              lineHeight: 1.4,
              color: "rgba(243,236,221,0.78)",
              marginTop: 22,
              maxWidth: 630,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              opacity: descIn,
              transform: `translateY(${interpolate(descIn, [0, 1], [16, 0])}px)`,
            }}
          >
            {desc}
          </div>
        ) : null}

        {/* Píldora de dominio */}
        <div
          style={{
            marginTop: 40,
            opacity: pillIn,
            transform: `translateY(${interpolate(pillIn, [0, 1], [22, 0])}px) scale(${interpolate(
              pillIn,
              [0, 1],
              [0.94, 1]
            )})`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "14px 30px",
              borderRadius: 999,
              background: `linear-gradient(140deg, ${TEAL_L} 0%, ${TEAL} 48%, #0B8A86 100%)`,
              color: "#04252A",
              fontWeight: 900,
              fontSize: 30,
              letterSpacing: 0.4,
              boxShadow: `0 16px 40px rgba(18,179,174,0.34), inset 0 1px 0 rgba(255,255,255,0.45)`,
            }}
          >
            {domain}
          </div>
        </div>
      </div>

      {/* ── COLUMNA DEL QR ─────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: 1352,
          top: 0,
          width: 478,
          height: H,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: QR_FRAME,
            height: QR_FRAME,
            opacity: interpolate(qrIn, [0, 0.4], [0, 1], CL),
            transform: `scale(${qrScale}) translateY(${interpolate(qrIn, [0, 1], [26, 0])}px)`,
          }}
        >
          {/* Línea de escaneo — POR DETRÁS de la tarjeta, nunca sobre el QR */}
          <svg
            width={QR_FRAME}
            height={QR_FRAME}
            viewBox={`0 0 ${QR_FRAME} ${QR_FRAME}`}
            style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}
          >
            <defs>
              <linearGradient id="gcta-scanband" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TEAL_L} stopOpacity={0} />
                <stop offset="100%" stopColor={TEAL_L} stopOpacity={0.42} />
              </linearGradient>
            </defs>
            <g opacity={scanOp}>
              <rect
                x={QR_INSET}
                y={Math.max(QR_INSET, scanY - 74)}
                width={QR_FRAME - QR_INSET * 2}
                height={Math.min(74, scanY - QR_INSET)}
                fill="url(#gcta-scanband)"
              />
              <line
                x1={QR_INSET}
                y1={scanY}
                x2={QR_FRAME - QR_INSET}
                y2={scanY}
                stroke={TEAL_L}
                strokeWidth={3}
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* Halo detrás de la tarjeta */}
          <div
            style={{
              position: "absolute",
              left: 45,
              top: 45,
              width: QR_CARD,
              height: QR_CARD,
              borderRadius: 34,
              background: TEAL,
              opacity: 0.22,
              filter: "blur(34px)",
              zIndex: 2,
            }}
          />

          {/* TARJETA DEL QR — sin filtros, sin overlays, margen blanco alrededor */}
          <div
            style={{
              position: "absolute",
              left: 45,
              top: 45,
              width: QR_CARD,
              height: QR_CARD,
              borderRadius: 30,
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
              zIndex: 3,
            }}
          >
            {qr ? (
              <Img
                src={staticFile(qr)}
                style={{ display: "block", width: QR_IMG, height: QR_IMG, objectFit: "contain" }}
              />
            ) : (
              <QrFallback size={QR_IMG} />
            )}
          </div>

          {/* Marcas de esquina del visor (se trazan) */}
          <svg
            width={QR_FRAME}
            height={QR_FRAME}
            viewBox={`0 0 ${QR_FRAME} ${QR_FRAME}`}
            style={{ position: "absolute", left: 0, top: 0, zIndex: 4 }}
          >
            {[0, 1, 2, 3].map((i) => {
              const a = QR_ARM;
              const s = QR_INSET;
              const e = QR_FRAME - QR_INSET;
              const d =
                i === 0
                  ? `M ${s} ${s + a} L ${s} ${s} L ${s + a} ${s}`
                  : i === 1
                  ? `M ${e - a} ${s} L ${e} ${s} L ${e} ${s + a}`
                  : i === 2
                  ? `M ${e} ${e - a} L ${e} ${e} L ${e - a} ${e}`
                  : `M ${s + a} ${e} L ${s} ${e} L ${s} ${e - a}`;
              const len = a * 2;
              const off = interpolate(
                frame,
                [f(0.15 + i * 0.018), f(0.27 + i * 0.018)],
                [len, 0],
                { ...CL, easing: easeOut }
              );
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={i % 2 === 0 ? TEAL_L : TEAL}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={len}
                  strokeDashoffset={off}
                  opacity={interpolate(cornerTrace, [0, 1], [1, 0.35], CL)}
                />
              );
            })}
          </svg>
        </div>

        {/* Texto del escaneo */}
        <div
          style={{
            marginTop: 30,
            width: 470,
            textAlign: "center",
            opacity: scanTxt,
            transform: `translateY(${interpolate(scanTxt, [0, 1], [14, 0])}px)`,
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 33, color: CREAM, letterSpacing: 0.3 }}>
            {scanTitle}
          </div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 23,
              lineHeight: 1.3,
              color: "rgba(243,236,221,0.66)",
              marginTop: 8,
            }}
          >
            {scanSub}
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};
