import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME_EARTH, SPR } from "../kit/premium";

// ═══════════════════════════════════════════════════════════════════════════
// PEROXIDO MUERTO — pago del open loop grande del video.
// El agua oxigenada se descompone con la LUZ y con el TIEMPO: la botella de
// farmacia es café y opaca por eso. Acá se VE morir el producto en el envase:
//   · la botella ámbar pierde nivel de "potencia" sola (luz de ventana + tiempo)
//   · tres errores entran como tarjetas y se APAGAN, cada uno arranca potencia
//   · el líquido cambia de ámbar a agua y la etiqueta H₂O₂ 3% pasa a H₂O
//   · remate: "LE DISTE AGUA"
// Overlay 1920x1080. 100% determinista (frame → pixeles), sin assets externos.
// ═══════════════════════════════════════════════════════════════════════════

// Paleta THEME_EARTH en versión "papel oscuro" (marca terrosa vintage).
const T = THEME_EARTH;
const SERIF = T.fontDisplay; // EB Garamond + fallbacks Georgia/serif
const SANS = "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif";

const PAPER = "#1b1712";
const PAPER_DEEP = "#120f0b";
const CREAM = "#f4ead8";
const GOLD = "#d99b3e";
const DANGER = "#b4472e";
const GOOD = "#6f8f5a";
const WATER = "#93a7ad";
const INK = "#241d16";
const LINE = "rgba(244,234,216,0.16)";

// Guion de los tres errores: cuándo entra y cuándo se apaga (fracción del clip).
const ERRORES: { n: string; t: string; in: number; kill: number; loss: number }[] = [
  { n: "I", t: "FRASCO CLARO AL SOL", in: 0.16, kill: 0.3, loss: 0.22 },
  { n: "II", t: "OCHO MESES DESTAPADA", in: 0.34, kill: 0.48, loss: 0.2 },
  { n: "III", t: "DILUIDA PARA RENDIR", in: 0.52, kill: 0.66, loss: 0.26 },
];

const REMATE_AT = 0.78;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const PeroxidoMuerto: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const D = Math.max(2, durationInFrames);
  const p = clamp01(frame / (D - 1));
  const F = (frac: number) => frac * D;

  // ── entrada / salida ──────────────────────────────────────────────────────
  const entry = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.7, stiffness: 190 },
  });
  const out = interpolate(frame, [D - 12, D - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  // ── POTENCIA: se va sola (luz + tiempo) y cae a golpes con cada error ─────
  const drift = interpolate(p, [0.05, 0.86], [0, 0.34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const golpe = (start: number, amount: number) =>
    interpolate(p, [start, start + 0.075], [0, amount], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  const perdida =
    drift +
    ERRORES.reduce((acc, e) => acc + golpe(e.kill, e.loss), 0);
  const potency = clamp01(1 - perdida);
  const pct = Math.max(0, Math.round(potency * 100));

  // ── luz de la ventana: cada vez más agresiva a medida que muere ───────────
  const beam =
    (0.42 + 0.58 * (1 - potency)) * (0.94 + 0.06 * Math.sin(frame / 11));

  // ── el líquido se vuelve agua ─────────────────────────────────────────────
  const water = interpolate(p, [0.7, 0.82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const liquidColor = interpolateColors(
    potency,
    [0, 0.5, 1],
    [WATER, "#c07a2c", GOLD],
  );
  const liquidTop = interpolate(potency, [0, 1], [712, 300]);

  // ── remate ────────────────────────────────────────────────────────────────
  const remF = F(REMATE_AT);
  const rem = frame < remF ? 0 : spring({ frame: frame - remF, fps, config: SPR.slam });
  const remClamped = clamp01(rem);

  // ── titular: wipe desde la izquierda ─────────────────────────────────────
  const wipe = interpolate(frame, [3, 22], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const ruleW = interpolate(frame, [14, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // burbujas de oxígeno escapando (determinista: índice + frame)
  const bubbles = new Array(16).fill(0).map((_, i) => {
    const bx = 132 + ((i * 71) % 196);
    const speed = 0.9 + (i % 5) * 0.22;
    const span = Math.max(46, 770 - liquidTop);
    const ph = (((frame * speed + i * 37) % 132) + 132) % 132 / 132;
    const by = 770 - ph * span;
    const r = 2.5 + ((i * 13) % 5) * 0.7;
    const op = potency * 0.5 * Math.sin(Math.PI * Math.min(1, ph * 1.12));
    return { bx, by, r, op, i };
  });

  return (
    <AbsoluteFill style={{ opacity: out, backgroundColor: PAPER }}>
      {/* fondo papel oscuro */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 95% at 20% 10%, #33261a 0%, ${PAPER} 56%, ${PAPER_DEEP} 100%)`,
        }}
      />
      {/* grano de papel (feTurbulence con semilla fija = determinista) */}
      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay" }}>
        <svg width={width} height={height}>
          <filter id="pm-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves={3}
              seed={7}
            />
          </filter>
          <rect width={width} height={height} filter="url(#pm-grain)" />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          opacity: clamp01(entry),
          transform: `scale(${0.986 + 0.014 * clamp01(entry)})`,
        }}
      >
        {/* ── LUZ DE LA VENTANA DEL BAÑO ─────────────────────────────────── */}
        <svg
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <defs>
            <linearGradient id="pm-beam" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0" stopColor={GOLD} stopOpacity={0.34} />
              <stop offset="0.55" stopColor={GOLD} stopOpacity={0.12} />
              <stop offset="1" stopColor={GOLD} stopOpacity={0} />
            </linearGradient>
            <radialGradient id="pm-halo">
              <stop offset="0" stopColor={GOLD} stopOpacity={0.3} />
              <stop offset="1" stopColor={GOLD} stopOpacity={0} />
            </radialGradient>
          </defs>
          <g opacity={beam}>
            <polygon points="128,30 318,30 720,1080 44,1080" fill="url(#pm-beam)" />
            <polygon
              points="160,30 268,30 500,1080 262,1080"
              fill="url(#pm-beam)"
              opacity={0.65}
            />
          </g>
          <ellipse
            cx="374"
            cy="470"
            rx="330"
            ry="390"
            fill="url(#pm-halo)"
            opacity={beam * 0.75}
          />
          {/* silueta de la ventana de donde entra la luz */}
          <g fill={PAPER_DEEP}>
            <rect x="124" y="-12" width="196" height="64" />
            <rect x="214" y="-12" width="14" height="82" />
          </g>
        </svg>

        {/* ── LA BOTELLA ─────────────────────────────────────────────────── */}
        <div style={{ position: "absolute", left: 132, top: 108, width: 470, height: 812 }}>
          <svg viewBox="0 0 470 812" width={470} height={812}>
            <defs>
              <clipPath id="pm-body">
                <path d="M196 132 C196 158 176 164 148 186 C118 210 104 246 104 292 L104 736 Q104 776 144 776 L326 776 Q366 776 366 736 L366 292 C366 246 352 210 322 186 C294 164 274 158 274 132 Z" />
              </clipPath>
              <linearGradient id="pm-glass" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#4a2c14" />
                <stop offset="0.42" stopColor="#2e1c0e" />
                <stop offset="1" stopColor="#1d1208" />
              </linearGradient>
              <linearGradient id="pm-cap" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#3c3128" />
                <stop offset="0.4" stopColor="#241d16" />
                <stop offset="1" stopColor="#171208" />
              </linearGradient>
              <linearGradient id="pm-liq" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={liquidColor} stopOpacity={0.95} />
                <stop offset="1" stopColor={liquidColor} stopOpacity={0.72} />
              </linearGradient>
            </defs>

            {/* sombra de contacto */}
            <ellipse cx="235" cy="788" rx="150" ry="20" fill="#000" opacity={0.42} />

            {/* tapa + cuello */}
            <rect x="176" y="18" width="118" height="62" rx="9" fill="url(#pm-cap)" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={`rib-${i}`}
                x={186 + i * 19}
                y={24}
                width={5}
                height={50}
                rx={2.5}
                fill="#0d0a06"
                opacity={0.45}
              />
            ))}
            <rect x="168" y="76" width="134" height="16" rx="7" fill="url(#pm-cap)" />
            <rect x="196" y="88" width="78" height="50" fill="url(#pm-glass)" />

            {/* cuerpo ámbar */}
            <path
              d="M196 132 C196 158 176 164 148 186 C118 210 104 246 104 292 L104 736 Q104 776 144 776 L326 776 Q366 776 366 736 L366 292 C366 246 352 210 322 186 C294 164 274 158 274 132 Z"
              fill="url(#pm-glass)"
            />

            {/* líquido = potencia */}
            <g clipPath="url(#pm-body)">
              <rect
                x="104"
                y={liquidTop}
                width="262"
                height={Math.max(0, 780 - liquidTop)}
                fill="url(#pm-liq)"
              />
              <ellipse
                cx="235"
                cy={liquidTop}
                rx="131"
                ry="9"
                fill={liquidColor}
                opacity={0.95}
              />
              <rect
                x="104"
                y={liquidTop}
                width="262"
                height="3"
                fill={CREAM}
                opacity={0.28}
              />
              {bubbles.map((b) =>
                b.by > liquidTop + 6 ? (
                  <circle
                    key={`bub-${b.i}`}
                    cx={b.bx}
                    cy={b.by}
                    r={b.r}
                    fill={CREAM}
                    opacity={Math.max(0, b.op)}
                  />
                ) : null,
              )}
              {/* rastro de lo que ya se perdió: marca de nivel original */}
              <rect x="104" y="300" width="262" height="2" fill={GOLD} opacity={0.3} />
            </g>

            {/* reflejo de vidrio */}
            <g clipPath="url(#pm-body)">
              <rect x="130" y="196" width="26" height="520" rx="13" fill={CREAM} opacity={0.1} />
              <rect x="164" y="210" width="10" height="470" rx="5" fill={CREAM} opacity={0.06} />
              <rect x="336" y="200" width="18" height="540" rx="9" fill="#000" opacity={0.3} />
            </g>
            <path
              d="M196 132 C196 158 176 164 148 186 C118 210 104 246 104 292 L104 736 Q104 776 144 776 L326 776 Q366 776 366 736 L366 292 C366 246 352 210 322 186 C294 164 274 158 274 132 Z"
              fill="none"
              stroke={GOLD}
              strokeOpacity={0.4}
              strokeWidth={3}
            />

            {/* etiqueta: H₂O₂ 3% → H₂O */}
            <g>
              <rect x="126" y="424" width="218" height="164" rx="7" fill="#e6d9bd" opacity={0.94} />
              <rect
                x="126"
                y="424"
                width="218"
                height="164"
                rx="7"
                fill="none"
                stroke={INK}
                strokeOpacity={0.28}
                strokeWidth={2}
              />
              <text
                x="235"
                y="470"
                textAnchor="middle"
                fontFamily={SANS}
                fontSize="17"
                letterSpacing="5"
                fill={INK}
                opacity={0.6}
              >
                FARMACIA
              </text>
              <rect x="158" y="482" width="154" height="2" fill={INK} opacity={0.22} />
              <text
                x="235"
                y="536"
                textAnchor="middle"
                fontFamily={SERIF}
                fontSize="46"
                fontWeight={700}
                fill={INK}
                opacity={1 - water}
              >
                H₂O₂ 3%
              </text>
              <text
                x="235"
                y="536"
                textAnchor="middle"
                fontFamily={SERIF}
                fontSize="52"
                fontWeight={700}
                fill={DANGER}
                opacity={water}
              >
                H₂O
              </text>
              <text
                x="235"
                y="568"
                textAnchor="middle"
                fontFamily={SANS}
                fontSize="15"
                letterSpacing="4"
                fill={INK}
                opacity={0.45 * (1 - water)}
              >
                OPACA POR ALGO
              </text>
            </g>

            {/* regla de potencia al costado + puntero */}
            <g>
              <rect x="404" y="296" width="2" height="420" fill={CREAM} opacity={0.22} />
              {new Array(11).fill(0).map((_, i) => (
                <rect
                  key={`tk-${i}`}
                  x={i % 5 === 0 ? 392 : 398}
                  y={298 + i * 41.2}
                  width={i % 5 === 0 ? 16 : 10}
                  height={2}
                  fill={CREAM}
                  opacity={i % 5 === 0 ? 0.4 : 0.22}
                />
              ))}
              <g transform={`translate(0 ${liquidTop})`}>
                <polygon
                  points="418,-11 440,0 418,11"
                  fill={interpolateColors(potency, [0, 0.4, 1], [WATER, DANGER, GOLD])}
                />
                <rect
                  x="386"
                  y="-1.5"
                  width="30"
                  height="3"
                  fill={interpolateColors(potency, [0, 0.4, 1], [WATER, DANGER, GOLD])}
                />
              </g>
            </g>
          </svg>
        </div>

        {/* ── COLUMNA DERECHA ────────────────────────────────────────────── */}
        <div style={{ position: "absolute", left: 690, top: 96, width: 1130, height: 900 }}>
          {/* eyebrow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: clamp01(entry),
            }}
          >
            <div style={{ width: 54, height: 2, background: GOLD }} />
            <div
              style={{
                fontFamily: SANS,
                fontSize: 23,
                fontWeight: 600,
                letterSpacing: 7,
                color: GOLD,
              }}
            >
              AGUA OXIGENADA AL 3%
            </div>
          </div>

          {/* titular */}
          <div
            style={{
              position: "absolute",
              top: 42,
              left: 0,
              width: 1090,
              clipPath: `inset(0 ${wipe}% 0 0)`,
            }}
          >
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 92,
                fontWeight: 800,
                lineHeight: 0.98,
                letterSpacing: 1,
                color: CREAM,
                textShadow: "0 10px 30px rgba(0,0,0,0.55)",
              }}
            >
              SE MUERE
              <br />
              <span style={{ color: GOLD }}>EN EL ENVASE</span>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: 250,
              left: 0,
              height: 3,
              width: 1090 * ruleW,
              background: `linear-gradient(90deg, ${GOLD}, rgba(217,155,62,0))`,
            }}
          />

          {/* tres errores */}
          {ERRORES.map((e, i) => {
            const inF = F(e.in);
            const killF = F(e.kill);
            const a = frame < inF ? 0 : clamp01(
              spring({
                frame: frame - inF,
                fps,
                config: { damping: 14, mass: 0.7, stiffness: 190 },
              }),
            );
            const dead = interpolate(frame, [killF, killF + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const bg = interpolateColors(dead, [0, 1], ["#f4ead8", "#2b231b"]);
            const fg = interpolateColors(dead, [0, 1], [INK, "#7a6a56"]);
            const lamp = interpolateColors(dead, [0, 1], [GOOD, DANGER]);
            const flash = interpolate(frame, [killF, killF + 4, killF + 12], [0, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={e.n}
                style={{
                  position: "absolute",
                  top: 288 + i * 138,
                  left: 0,
                  width: 1090,
                  height: 122,
                  borderRadius: 16,
                  background: bg,
                  border: `2px solid ${dead > 0.5 ? "rgba(180,71,46,0.55)" : "rgba(36,29,22,0.18)"}`,
                  boxShadow: `0 ${18 - 10 * dead}px ${38 - 18 * dead}px rgba(0,0,0,${0.42 - 0.2 * dead})`,
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  padding: "0 28px",
                  opacity: a * (1 - 0.32 * dead),
                  transform: `translateX(${(1 - a) * 90}px) translateY(${dead * 8}px) rotate(${dead * -0.5}deg) scale(${0.965 + 0.035 * a})`,
                  overflow: "hidden",
                }}
              >
                {/* numeral */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    flexShrink: 0,
                    borderRadius: 12,
                    background: interpolateColors(dead, [0, 1], [INK, "#b4472e"]),
                    color: interpolateColors(dead, [0, 1], [GOLD, "#f4ead8"]),
                    fontFamily: SERIF,
                    fontSize: 34,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {e.n}
                </div>

                {/* texto del error */}
                <div
                  style={{
                    flex: 1,
                    fontFamily: SERIF,
                    fontSize: 48,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    color: fg,
                  }}
                >
                  {e.t}
                </div>

                {/* foquito: vivo → muerto */}
                <div
                  style={{
                    width: 22,
                    height: 22,
                    flexShrink: 0,
                    borderRadius: 11,
                    background: lamp,
                    boxShadow: `0 0 ${10 + 26 * flash}px ${lamp}`,
                  }}
                />

                {/* tachado */}
                <div
                  style={{
                    position: "absolute",
                    left: 118,
                    top: 60,
                    height: 5,
                    borderRadius: 3,
                    width: (1090 - 118 - 78) * dead,
                    background: DANGER,
                    opacity: 0.92,
                  }}
                />
              </div>
            );
          })}

          {/* barra de POTENCIA */}
          <div style={{ position: "absolute", top: 716, left: 0, width: 1090 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: 7,
                  color: "rgba(244,234,216,0.66)",
                }}
              >
                POTENCIA
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 54,
                  fontWeight: 800,
                  lineHeight: 0.9,
                  color: interpolateColors(potency, [0, 0.35, 1], [WATER, DANGER, CREAM]),
                }}
              >
                {pct}%
              </div>
            </div>
            <div
              style={{
                position: "relative",
                height: 24,
                borderRadius: 12,
                background: "rgba(0,0,0,0.45)",
                border: `1px solid ${LINE}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${potency * 100}%`,
                  background: `linear-gradient(90deg, rgba(140,90,34,0.9), ${liquidColor})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${potency * 100}%`,
                  width: 3,
                  background: CREAM,
                  opacity: 0.7 * potency,
                }}
              />
              {new Array(9).fill(0).map((_, i) => (
                <div
                  key={`bt-${i}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${(i + 1) * 10}%`,
                    width: 1,
                    background: "rgba(27,23,18,0.55)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── REMATE ─────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 138,
            background: `linear-gradient(180deg, rgba(18,15,11,0.0) 0%, ${PAPER_DEEP} 32%, ${PAPER_DEEP} 100%)`,
            borderTop: `3px solid ${DANGER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: clamp01(remClamped * 1.2),
            transform: `translateY(${(1 - remClamped) * 130}px)`,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 94,
              fontWeight: 800,
              letterSpacing: 3,
              color: CREAM,
              transform: `scale(${0.94 + 0.06 * remClamped})`,
              textShadow: "0 8px 26px rgba(0,0,0,0.6)",
            }}
          >
            LE DISTE{" "}
            <span
              style={{
                color: WATER,
                borderBottom: `5px solid ${DANGER}`,
                paddingBottom: 4,
              }}
            >
              AGUA
            </span>
          </div>
        </div>
      </AbsoluteFill>

      {/* viñeta */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 100% at 50% 45%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
