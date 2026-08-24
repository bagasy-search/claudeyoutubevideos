import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "../components/Media";
import { THEME_MEDICO, SPR } from "../kit/premium/theme";
import { autoSize, mblur, slabShadow, specular, tilt3d, useDrift, useKeyLight, usePush } from "../kit/premium/stagecraft";

// ═══════════════════════════════════════════════════════════════════════════
// GlassTestScene — LA PRUEBA DEL VASO (diascopia), partida en dos y filmada.
//
// La MISMA foto de piel a izquierda y derecha, separada por una fina línea de
// luz. Un vaso de vidrio baja y PRESIONA los dos lados a la vez; debajo del
// vidrio la piel se blanquea. A la izquierda los puntitos rojos DESAPARECEN
// (casi siempre no es nada). A la derecha SIGUEN ahí a través del vidrio
// (hay que ir al médico). Dos rótulos claros, escalonados; el de alerta late.
//
// Capas a ritmos distintos (modelo stagecraft):
//   L1 BED     foto de cama a 1.2, borrosa, con parallax invertido
//   L2 GRADE   scrim teal-profundo + halo de luz de escena
//   L3 PANELS  los dos paneles de piel, con push propio y sombra de contacto
//   L4 BLANCH  el blanqueo radial que crece bajo el vaso
//   L5 DOTS    12 puntitos deterministas (rand) — izquierda se van, derecha no
//   L6 GLASS   el vaso: rim claro, cuerpo de vidrio, reflejo especular en
//              diagonal, sombra elíptica debajo, y squash al apoyar
//   L7 SEAM    la línea de luz vertical con un nodo que viaja
//   L8 CARDS   los dos rótulos claros con tinta oscura
//   L9 ATMOS   motas + grano + viñeta
// Determinista: cero Date.now / Math.random.
// ═══════════════════════════════════════════════════════════════════════════

const T = THEME_MEDICO;
const BG = "#0E1D23";
const DEEP = "#063B40";
const TEAL = "#12B3AE";
const CREAM = "#F5F9FA";
const INK = "#0E1B22";
const GOLD = "#E6A23C";
const ALERT = "#E0523E";

const rand = (i: number, salt = 0): number =>
  (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const GLASS_AT = 6; // frame en que el vaso empieza a bajar
const CONTACT = 28; // frame en que apoya sobre la piel
const GLASS_RX = 196; // radio del vaso en px (horizontal)
const GLASS_RY = 182;

// 12 puntitos rojos, colocados de forma determinista dentro del vaso
const DOTS = Array.from({ length: 12 }, (_, i) => {
  const a = rand(i, 1) * Math.PI * 2;
  const r = 0.16 + rand(i, 2) * 0.68;
  return {
    dx: Math.cos(a) * r * GLASS_RX * 0.92,
    dy: Math.sin(a) * r * GLASS_RY * 0.92,
    s: 8 + rand(i, 3) * 10,
    fade: rand(i, 4), // escalona el desvanecido del lado izquierdo
  };
});

// ── L6 · el VASO ────────────────────────────────────────────────────────────
const Glass: React.FC<{ frame: number; press: number; squash: number }> = ({ frame, press, squash }) => {
  const shimmer = 0.72 + 0.28 * Math.sin(frame / 46);
  const w = GLASS_RX * 2;
  const h = GLASS_RY * 2;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        transform: `scale(${(1 + squash * 0.055).toFixed(4)}, ${(1 - squash * 0.045).toFixed(4)})`,
        opacity: press,
      }}
    >
      {/* sombra del vaso sobre la piel */}
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: -22,
          height: 70,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.55), rgba(0,0,0,0) 76%)",
          filter: "blur(14px)",
        }}
      />
      <svg width={w} height={h} viewBox="0 0 400 400" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id="gtsBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(245,249,250,0.30)" />
            <stop offset="38%" stopColor="rgba(245,249,250,0.05)" />
            <stop offset="72%" stopColor="rgba(18,179,174,0.10)" />
            <stop offset="100%" stopColor="rgba(245,249,250,0.24)" />
          </linearGradient>
          <radialGradient id="gtsRimGlow" cx="50%" cy="50%" r="50%">
            <stop offset="76%" stopColor="rgba(18,179,174,0)" />
            <stop offset="100%" stopColor="rgba(18,179,174,0.42)" />
          </radialGradient>
        </defs>

        {/* cuerpo de vidrio */}
        <ellipse cx="200" cy="200" rx="190" ry="190" fill="url(#gtsBody)" />
        <ellipse cx="200" cy="200" rx="190" ry="190" fill="url(#gtsRimGlow)" />
        {/* canto grueso del vaso (el borde que apoya) */}
        <ellipse
          cx="200"
          cy="200"
          rx="190"
          ry="190"
          fill="none"
          stroke="rgba(245,249,250,0.88)"
          strokeWidth={9}
        />
        <ellipse
          cx="200"
          cy="200"
          rx="174"
          ry="174"
          fill="none"
          stroke="rgba(245,249,250,0.34)"
          strokeWidth={4}
        />
        {/* reflejo especular en diagonal */}
        <path
          d="M74 292 C 30 224, 46 116, 132 62"
          fill="none"
          stroke="rgba(255,255,255,0.72)"
          strokeWidth={22}
          strokeLinecap="round"
          opacity={shimmer}
        />
        <path
          d="M110 316 C 66 250, 80 148, 158 92"
          fill="none"
          stroke="rgba(255,255,255,0.34)"
          strokeWidth={9}
          strokeLinecap="round"
          opacity={shimmer * 0.8}
        />
        {/* chispa del canto, del lado de la luz */}
        <circle cx="298" cy="96" r="12" fill="rgba(255,255,255,0.85)" opacity={shimmer} />
      </svg>
    </div>
  );
};

// ── L9 · motas + grano ──────────────────────────────────────────────────────
const DustMotes: React.FC<{ frame: number; count?: number }> = ({ frame, count = 22 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.5 }}>
    {Array.from({ length: count }, (_, i) => {
      const depth = rand(i, 9);
      const span = 240 + rand(i, 1) * 190;
      const p = ((frame * (0.45 + depth) + rand(i, 2) * span) % span) / span;
      const x = rand(i) * 100 + Math.sin(frame / 62 + i * 1.6) * (1 + depth * 3);
      const y = 105 - p * 118;
      const r = 1.3 + depth * 5;
      const life = Math.sin(p * Math.PI);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            background: i % 4 === 0 ? GOLD : CREAM,
            opacity: life * (0.12 + depth * 0.4),
            filter: `blur(${depth * 3}px)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

const FilmGrain: React.FC<{ frame: number }> = ({ frame }) => {
  const dx = Math.round(rand(frame % 23, 3) * 60) - 30;
  const dy = Math.round(rand(frame % 31, 5) * 60) - 30;
  return (
    <svg
      width="118%"
      height="118%"
      style={{
        position: "absolute",
        left: -60,
        top: -60,
        opacity: 0.13,
        mixBlendMode: "screen",
        pointerEvents: "none",
        transform: `translate(${dx}px, ${dy}px)`,
      }}
    >
      <filter id="gtsGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves={3} seed={19} stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.88  0 0 0 0 0.92  0 0 0 0 0.9  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#gtsGrain)" />
    </svg>
  );
};

export type GlassTestSceneProps = {
  durationInFrames: number;
  /** foto de piel con puntitos rojos (la MISMA de los dos lados) */
  image: string;
  leftLabel?: string;
  rightLabel?: string;
  leftVerdict?: string;
  rightVerdict?: string;
  bed?: string;
};

export const GlassTestScene: React.FC<GlassTestSceneProps> = ({
  durationInFrames,
  image,
  leftLabel = "SE BORRAN",
  rightLabel = "NO SE BORRAN",
  leftVerdict = "Casi siempre no es nada",
  rightVerdict = "Análisis de sangre pronto",
  bed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bedSrc = bed ?? image;

  const light = useKeyLight("center");
  const push = usePush(durationInFrames, 0.04);
  const back = useDrift(0.16, 4);
  const fore = useDrift(0.6, 11);

  // ── el vaso baja y ASIENTA ────────────────────────────────────────────────
  const drop = spring({ frame: frame - GLASS_AT, fps, config: SPR.settle, durationInFrames: 26 });
  const glassY = (1 - drop) * -430;
  const press = interpolate(frame, [GLASS_AT, GLASS_AT + 6], [0, 1], CLAMP);
  // squash: rebote corto al tocar la piel
  const squash = interpolate(frame, [CONTACT - 4, CONTACT + 2, CONTACT + 12], [0, 1, 0], CLAMP);

  // ── blanqueo bajo el vaso ─────────────────────────────────────────────────
  const blanch = interpolate(frame, [CONTACT - 2, CONTACT + 16], [0, 1], CLAMP);

  // ── paneles ───────────────────────────────────────────────────────────────
  const panelSp = spring({ frame, fps, config: SPR.settle, durationInFrames: 26 });
  const panelBlur = interpolate(frame, [0, 16], [10, 0], CLAMP);

  // ── rótulos escalonados ───────────────────────────────────────────────────
  const leftSp = spring({ frame: frame - 44, fps, config: SPR.snappy, durationInFrames: 24 });
  const rightSp = spring({ frame: frame - 54, fps, config: SPR.snappy, durationInFrames: 24 });
  const alertPulse = 1 + 0.012 * Math.sin(frame / 8.5); // muy sutil, nada estroboscópico
  const alertGlow = 0.4 + 0.3 * (0.5 + 0.5 * Math.sin(frame / 8.5));

  // ── salida ────────────────────────────────────────────────────────────────
  const outAt = Math.max(1, durationInFrames - 12);
  const out = interpolate(frame, [outAt, durationInFrames], [1, 0], CLAMP);
  const outScale = interpolate(frame, [outAt, durationInFrames], [1, 0.965], CLAMP);

  const R = T.radius + 6;

  // ── un lado del test ──────────────────────────────────────────────────────
  const Side: React.FC<{ side: "left" | "right" }> = ({ side }) => {
    const isLeft = side === "left";
    const accent = isLeft ? TEAL : ALERT;
    const sp = isLeft ? leftSp : rightSp;
    const label = isLeft ? leftLabel : rightLabel;
    const verdict = isLeft ? leftVerdict : rightVerdict;
    const seed = isLeft ? 0 : 40;

    return (
      <div
        style={{
          flex: "1 1 0",
          display: "flex",
          flexDirection: "column",
          gap: 22,
          minWidth: 0,
        }}
      >
        {/* PANEL DE PIEL */}
        <div
          style={{
            position: "relative",
            flex: "1 1 auto",
            borderRadius: R,
            overflow: "hidden",
            background: DEEP,
            opacity: Math.min(1, panelSp * 1.8),
            boxShadow: `${slabShadow(light, { lift: 1.4, edge: "rgba(3,16,20,0.9)", tint: "rgba(0,0,0,0.48)" })}, inset 0 0 0 1px rgba(245,249,250,0.12)`,
            transform: `${tilt3d({ amount: 0.35, seed: isLeft ? 2 : 5, frame, ry: isLeft ? 1.4 : -1.4 })} translateY(${((1 - panelSp) * 34 + fore.y * 0.18).toFixed(2)}px)`,
          }}
        >
          <Media
            src={image}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 46%",
              transform: `scale(${(1.04 * push).toFixed(4)})`,
              filter: `${panelBlur > 0.2 ? `blur(${panelBlur.toFixed(2)}px) ` : ""}saturate(1.05) contrast(1.04)`,
            }}
          />
          {/* grade del panel + specular de escena */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, rgba(6,59,64,0.14) 0%, rgba(0,0,0,0) 40%, rgba(7,18,22,0.52) 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              mixBlendMode: "screen",
              opacity: 0.34,
              background: specular(light, 0.3),
            }}
          />

          {/* L4 · BLANQUEO bajo el vaso */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: GLASS_RX * 2 * 0.94,
              height: GLASS_RY * 2 * 0.94,
              marginLeft: -GLASS_RX * 0.94,
              marginTop: -GLASS_RY * 0.94,
              borderRadius: "50%",
              transform: `scale(${(0.25 + blanch * 0.75).toFixed(3)})`,
              opacity: blanch * 0.9,
              mixBlendMode: "screen",
              background:
                "radial-gradient(circle, rgba(255,248,244,0.82) 0%, rgba(255,244,238,0.5) 54%, rgba(255,255,255,0) 78%)",
              filter: "blur(6px)",
            }}
          />

          {/* L5 · PUNTITOS ROJOS */}
          <div style={{ position: "absolute", left: "50%", top: "50%" }}>
            {DOTS.map((d, i) => {
              // izquierda: se desvanecen bajo el vidrio (escalonados por rand)
              const gone = isLeft
                ? interpolate(frame, [CONTACT + 2 + d.fade * 8, CONTACT + 16 + d.fade * 10], [1, 0], CLAMP)
                : 1;
              // derecha: siguen ahí, sólo se refractan un poco a través del vidrio
              const refract = isLeft ? 0 : blanch * 3.4 * (rand(i, seed + 6) - 0.5);
              const breathe = 0.86 + 0.14 * Math.sin(frame / (52 + i * 5) + i);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: d.dx + refract,
                    top: d.dy + refract * 0.6,
                    width: d.s,
                    height: d.s * 0.94,
                    marginLeft: -d.s / 2,
                    marginTop: -d.s / 2,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 40% 36%, #E85B48 0%, #C2311F 62%, rgba(150,32,20,0.35) 100%)`,
                    boxShadow: isLeft ? "none" : `0 0 ${6 + blanch * 8}px rgba(224,82,62,${(0.35 * blanch).toFixed(2)})`,
                    opacity: gone * breathe * (isLeft ? 1 : 0.96),
                    filter: `blur(${(0.5 + rand(i, seed + 7) * 0.7).toFixed(2)}px)`,
                  }}
                />
              );
            })}
          </div>

          {/* L6 · EL VASO */}
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${glassY.toFixed(2)}px)` }}>
            <Glass frame={frame} press={press} squash={squash} />
          </div>

          {/* canto interno del panel, para que no flote sin borde */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: R,
              boxShadow: `inset 0 0 0 2px ${accent}3A, inset 0 -80px 100px -70px rgba(0,0,0,0.8)`,
            }}
          />
        </div>

        {/* L8 · RÓTULO: tarjeta CLARA con tinta oscura */}
        <div
          style={{
            flex: "0 0 auto",
            borderRadius: T.radius,
            background: `linear-gradient(180deg, ${CREAM} 0%, #E7F0F2 100%)`,
            padding: "20px 30px 24px",
            borderTop: `6px solid ${accent}`,
            boxShadow: isLeft
              ? "0 24px 56px rgba(0,0,0,0.44)"
              : `0 24px 56px rgba(0,0,0,0.44), 0 0 ${(26 * alertGlow).toFixed(0)}px ${ALERT}${Math.round(alertGlow * 90).toString(16).padStart(2, "0")}`,
            transform: `translateY(${((1 - sp) * 34).toFixed(2)}px) scale(${(isLeft ? 1 : alertPulse * (0.94 + 0.06 * sp)).toFixed(4)})`,
            opacity: Math.min(1, sp * 1.7),
            filter: mblur(sp, 7),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: 24,
                flex: "0 0 auto",
                background: accent,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {isLeft ? "✓" : "!"}
            </span>
            <span
              style={{
                fontSize: autoSize(label, 50, 15, 34),
                fontWeight: 900,
                letterSpacing: -0.4,
                color: isLeft ? "#0B6F6C" : "#A8331F",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {label}
            </span>
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: autoSize(verdict, 34, 30, 26),
              lineHeight: 1.26,
              fontWeight: 600,
              color: "rgba(14,27,34,0.86)",
            }}
          >
            {verdict}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        fontFamily: T.fontBody,
        background: `radial-gradient(118% 90% at 50% 8%, ${DEEP} 0%, ${BG} 54%, #071216 100%)`,
        overflow: "hidden",
        opacity: out,
      }}
    >
      {/* L1 · CAMA borrosa con parallax invertido */}
      <AbsoluteFill
        style={{
          transform: `translate(${(-back.x).toFixed(2)}px, ${(-back.y).toFixed(2)}px) scale(${(1.2 * push).toFixed(4)})`,
        }}
      >
        <Media
          src={bedSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(26px) saturate(0.66) brightness(0.7)",
          }}
        />
      </AbsoluteFill>

      {/* L2 · GRADE + halo de la luz de escena */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(6,59,64,0.6) 0%, rgba(14,29,35,0.6) 46%, rgba(7,18,22,0.9) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: 0.45,
          background: `radial-gradient(64% 48% at ${(light.x * 100).toFixed(0)}% ${(light.y * 100).toFixed(0)}%, ${TEAL}22 0%, rgba(0,0,0,0) 68%)`,
        }}
      />

      {/* L3..L8 · los dos lados + la costura de luz */}
      <AbsoluteFill
        style={{
          padding: "52px 58px 58px",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: 26,
          transform: `scale(${outScale.toFixed(4)})`,
        }}
      >
        <Side side="left" />

        {/* L7 · fina línea de luz vertical con un nodo que viaja */}
        <div style={{ position: "relative", width: 3, flex: "0 0 auto", alignSelf: "stretch" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, rgba(245,249,250,0) 0%, rgba(245,249,250,0.85) 16%, ${TEAL} 50%, rgba(245,249,250,0.85) 84%, rgba(245,249,250,0) 100%)`,
              boxShadow: `0 0 22px ${TEAL}88, 0 0 60px ${TEAL}44`,
              opacity: Math.min(1, panelSp * 1.6),
              transform: `scaleY(${(0.5 + 0.5 * panelSp).toFixed(3)})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -7,
              width: 17,
              height: 130,
              borderRadius: 12,
              top: `${(((frame * 0.62) % 138) - 20).toFixed(1)}%`,
              background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)`,
              filter: "blur(7px)",
              opacity: 0.5 * Math.min(1, panelSp * 1.6),
            }}
          />
        </div>

        <Side side="right" />
      </AbsoluteFill>

      {/* L9 · atmósfera */}
      <DustMotes frame={frame} />
      <FilmGrain frame={frame} />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(126% 96% at 50% 46%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.22) 78%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export default GlassTestScene;
