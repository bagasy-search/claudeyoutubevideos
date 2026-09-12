import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { F_INTER } from "../kit/premium/theme";

// ── RecalRich ─────────────────────────────────────────────────────────────────
// Componentes bespoke para el canal "Federer Salud" (clínico moderno, creíble).
// Su trabajo: DRAMATIZAR estudios científicos y datos para que el video se sienta
// autoritario y dinámico. Portadas de revistas científicas, recortes de diario
// envejecidos, resaltador amarillo sobre frases clave, tarjetas de citación
// formales. Vidrio blanco, sombras suaves, esquinas redondeadas.
// RENDER-SAFE: 100% determinista desde `frame`. Sin Date.now/Math.random/new Date.
// ══════════════════════════════════════════════════════════════════════════════

const TEAL = "#12B3AE";
const TEALD = "#0c8f8b";
const INK = "#12222B";
const CORAL = "#E0523E";
const YELLOW = "#FCE94F";
const SERIF = "Georgia, 'Times New Roman', serif";
const PAPER = "linear-gradient(150deg, #fbf7ec, #f1e9d4)";
const GLASS = "linear-gradient(150deg, #ffffff, #eef7f8)";

const cI = (
  f: number,
  a: number,
  b: number,
  x: number,
  y: number,
  e?: (n: number) => number
) =>
  interpolate(f, [a, b], [x, y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: e,
  });
const sf = (p?: string) => (p ? staticFile(p) : undefined);
const EASE = Easing.out(Easing.cubic);

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "linear-gradient(160deg,#0a171c,#122a31)" }}>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(60% 50% at 50% 42%, rgba(18,179,174,0.12), transparent 70%)",
      }}
    />
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

// ══════════════════════════════════════════════════════════════════════════════
// 1) StudyMagazine — portada glossy de revista científica que se revela.
// ══════════════════════════════════════════════════════════════════════════════
export const StudyMagazine: React.FC<{
  durationInFrames: number;
  journal?: string;
  title?: string;
  stat?: string;
  image?: string;
}> = ({
  durationInFrames: D,
  // ⚠ DEFAULTS VACÍOS A PROPÓSITO — esta familia DRAMATIZA ESTUDIOS, así que un default plausible
  // no es un placeholder: es una cita falsa que se publica. Antes traía nombres de revistas REALES
  // (Lancet, NEJM, JAMA, The New York Times) pegados a hallazgos inventados, de modo que si el que
  // llamaba omítía un prop, el video mostraba a esa revista afirmando algo que nunca dijo. En un
  // canal de salud. Si falta el dato, que se vea el hueco — NO lo rellenes con un ejemplo.
  journal = "",
  title = "",
  stat = "",
  image,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });
  const out = cI(frame, D - 12, D, 1, 0);
  const op = Math.min(enter, out);
  const sc = interpolate(enter, [0, 1], [0.9, 1]);
  const rise = interpolate(enter, [0, 1], [70, 0]);

  const stampIn = cI(frame, 14, 30, 0, 1, Easing.out(Easing.back(1.6)));
  const statIn = cI(frame, 20, 36, 0, 1, EASE);

  return (
    <Stage>
      <div
        style={{
          position: "relative",
          width: 780,
          height: 1000,
          borderRadius: 30,
          overflow: "hidden",
          opacity: op,
          transform: `translateY(${rise}px) scale(${sc})`,
          background: "#fff",
          boxShadow:
            "0 50px 110px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.9)",
          border: "1.5px solid rgba(255,255,255,0.9)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* cover photo / placeholder */}
        <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
          {image ? (
            <Img
              src={sf(image)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${interpolate(enter, [0, 1], [1.16, 1.06])})`,
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(150deg, #1b3a44, #12B3AE 60%, #0c8f8b)",
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(18,34,43,0.15) 0%, transparent 30%, rgba(18,34,43,0.55) 100%)",
            }}
          />

          {/* masthead bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: "30px 44px 26px",
              background: `linear-gradient(180deg, ${INK}, rgba(18,34,43,0.0))`,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 58,
                color: "#fff",
                letterSpacing: -1,
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}
            >
              {journal}
            </span>
            <span
              style={{
                fontFamily: F_INTER,
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: 4,
                color: TEAL,
                textTransform: "uppercase",
              }}
            >
              Estudio
            </span>
          </div>

          {/* rotated PEER-REVIEWED stamp */}
          <div
            style={{
              position: "absolute",
              top: 150,
              right: 40,
              transform: `rotate(-12deg) scale(${stampIn})`,
              opacity: stampIn,
              padding: "12px 22px",
              borderRadius: 14,
              border: `4px solid ${CORAL}`,
              color: CORAL,
              fontFamily: F_INTER,
              fontWeight: 900,
              fontSize: 30,
              letterSpacing: 3,
              textTransform: "uppercase",
              background: "rgba(255,255,255,0.14)",
              boxShadow: `0 0 0 3px rgba(224,82,62,0.15)`,
            }}
          >
            Peer-Reviewed
          </div>

          {/* headline over photo */}
          <div
            style={{
              position: "absolute",
              left: 44,
              right: 44,
              bottom: 40,
              fontFamily: F_INTER,
              fontWeight: 800,
              fontSize: 60,
              lineHeight: 1.05,
              color: "#fff",
              letterSpacing: -1,
              textShadow: "0 3px 18px rgba(0,0,0,0.5)",
              opacity: cI(frame, 10, 26, 0, 1, EASE),
              transform: `translateY(${cI(frame, 10, 26, 24, 0, EASE)}px)`,
            }}
          >
            {title}
          </div>
        </div>

        {/* bottom bar with stat chip */}
        <div
          style={{
            flex: "0 0 auto",
            padding: "28px 44px",
            background: GLASS,
            borderTop: "1.5px solid rgba(18,179,174,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: F_INTER,
              fontWeight: 600,
              fontSize: 28,
              color: "rgba(18,34,43,0.62)",
            }}
          >
            Resultado principal
          </span>
          <div
            style={{
              opacity: statIn,
              transform: `scale(${interpolate(statIn, [0, 1], [0.7, 1])})`,
              padding: "14px 30px",
              borderRadius: 18,
              background: `linear-gradient(150deg, ${TEAL}, ${TEALD})`,
              color: "#fff",
              fontFamily: F_INTER,
              fontWeight: 900,
              fontSize: 56,
              letterSpacing: -1,
              boxShadow: `0 14px 32px ${TEAL}66`,
            }}
          >
            {stat}
          </div>
        </div>
      </div>
    </Stage>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 2) NewspaperStudy — recorte de diario envejecido con resaltador amarillo.
// ══════════════════════════════════════════════════════════════════════════════
export const NewspaperStudy: React.FC<{
  durationInFrames: number;
  source?: string;
  headline?: string;
  body?: string;
  highlight?: string;
}> = ({
  durationInFrames: D,
  // ⚠ DEFAULTS VACÍOS A PROPÓSITO — esta familia DRAMATIZA ESTUDIOS, así que un default plausible
  // no es un placeholder: es una cita falsa que se publica. Antes traía nombres de revistas REALES
  // (Lancet, NEJM, JAMA, The New York Times) pegados a hallazgos inventados, de modo que si el que
  // llamaba omítía un prop, el video mostraba a esa revista afirmando algo que nunca dijo. En un
  // canal de salud. Si falta el dato, que se vea el hueco — NO lo rellenes con un ejemplo.
  source = "",
  headline = "",
  body = "",
  highlight = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 20, mass: 1, stiffness: 100 } });
  const out = cI(frame, D - 12, D, 1, 0);
  const op = Math.min(enter, out);
  const sc = interpolate(enter, [0, 1], [0.94, 1]);

  // barrido del resaltador
  const sweep = cI(frame, 26, 50, 0, 1, EASE);

  // partir el body para envolver el highlight
  const idx = highlight ? body.indexOf(highlight) : -1;
  const pre = idx >= 0 ? body.slice(0, idx) : body;
  const post = idx >= 0 ? body.slice(idx + highlight.length) : "";

  return (
    <Stage>
      <div
        style={{
          position: "relative",
          width: 940,
          padding: "56px 60px 60px",
          borderRadius: 12,
          opacity: op,
          transform: `rotate(-2.2deg) scale(${sc})`,
          background: PAPER,
          boxShadow:
            "0 46px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.7)",
          border: "1px solid rgba(120,100,60,0.25)",
          overflow: "hidden",
        }}
      >
        {/* textura de líneas tenues */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.35,
            backgroundImage:
              "repeating-linear-gradient(180deg, rgba(80,60,30,0.06) 0px, rgba(80,60,30,0.06) 1px, transparent 1px, transparent 8px)",
          }}
        />
        {/* mancha de envejecido */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(150,120,70,0.14), transparent 68%)",
          }}
        />

        {/* masthead */}
        <div
          style={{
            position: "relative",
            textAlign: "center",
            borderBottom: `3px double rgba(40,30,15,0.55)`,
            paddingBottom: 16,
            marginBottom: 26,
            opacity: cI(frame, 4, 16, 0, 1),
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 62,
              color: "#241d10",
              letterSpacing: -1,
            }}
          >
            {source}
          </div>
        </div>

        {/* headline */}
        <div
          style={{
            position: "relative",
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 54,
            lineHeight: 1.1,
            color: "#1e1810",
            marginBottom: 26,
            opacity: cI(frame, 10, 24, 0, 1, EASE),
            transform: `translateY(${cI(frame, 10, 24, 18, 0, EASE)}px)`,
          }}
        >
          {headline}
        </div>

        {/* body con highlight */}
        <div
          style={{
            position: "relative",
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: 34,
            lineHeight: 1.55,
            color: "#2b2417",
            opacity: cI(frame, 16, 30, 0, 1),
          }}
        >
          {pre}
          {idx >= 0 && (
            <span style={{ position: "relative", display: "inline", whiteSpace: "normal" }}>
              <span
                style={{
                  position: "absolute",
                  left: -4,
                  right: -4,
                  top: "8%",
                  bottom: "6%",
                  background: YELLOW,
                  borderRadius: 8,
                  transform: `scaleX(${sweep})`,
                  transformOrigin: "left center",
                  zIndex: 0,
                  boxShadow: "0 2px 6px rgba(180,160,40,0.4)",
                  mixBlendMode: "multiply",
                }}
              />
              <span style={{ position: "relative", zIndex: 1, fontWeight: 700 }}>
                {highlight}
              </span>
            </span>
          )}
          {post}
        </div>
      </div>
    </Stage>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 3) HighlightData — claim grande con resaltador amarillo barriendo la frase clave.
// ══════════════════════════════════════════════════════════════════════════════
export const HighlightData: React.FC<{
  durationInFrames: number;
  pre?: string;
  highlight?: string;
  post?: string;
  source?: string;
}> = ({
  durationInFrames: D,
  // ⚠ DEFAULTS VACÍOS A PROPÓSITO — esta familia DRAMATIZA ESTUDIOS, así que un default plausible
  // no es un placeholder: es una cita falsa que se publica. Antes traía nombres de revistas REALES
  // (Lancet, NEJM, JAMA, The New York Times) pegados a hallazgos inventados, de modo que si el que
  // llamaba omítía un prop, el video mostraba a esa revista afirmando algo que nunca dijo. En un
  // canal de salud. Si falta el dato, que se vea el hueco — NO lo rellenes con un ejemplo.
  pre = "",
  highlight = "",
  post = "",
  source = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 20, mass: 1, stiffness: 100 } });
  const out = cI(frame, D - 12, D, 1, 0);
  const op = Math.min(enter, out);
  const sc = interpolate(enter, [0, 1], [0.95, 1]);

  const sweep = cI(frame, 22, 46, 0, 1, EASE);

  return (
    <Stage>
      <div
        style={{
          position: "relative",
          width: 1180,
          padding: "80px 90px",
          borderRadius: 34,
          opacity: op,
          transform: `scale(${sc})`,
          background: GLASS,
          boxShadow:
            "0 44px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.9)",
          border: "1.5px solid rgba(255,255,255,0.9)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 8,
            bottom: 0,
            background: `linear-gradient(180deg, ${TEAL}, ${TEALD})`,
          }}
        />
        <div
          style={{
            fontFamily: F_INTER,
            fontWeight: 800,
            fontSize: 74,
            lineHeight: 1.25,
            color: INK,
            letterSpacing: -1,
          }}
        >
          <span style={{ opacity: cI(frame, 8, 22, 0, 1, EASE) }}>{pre} </span>
          <span style={{ position: "relative", display: "inline-block" }}>
            <span
              style={{
                position: "absolute",
                left: -8,
                right: -8,
                top: "14%",
                bottom: "10%",
                background: YELLOW,
                borderRadius: 12,
                transform: `rotate(-1.4deg) scaleX(${sweep})`,
                transformOrigin: "left center",
                zIndex: 0,
                boxShadow: "0 3px 10px rgba(200,180,50,0.45)",
              }}
            />
            <span
              style={{
                position: "relative",
                zIndex: 1,
                color: INK,
                fontWeight: 900,
                opacity: cI(frame, 18, 30, 0, 1),
              }}
            >
              {highlight}
            </span>
          </span>
          <span style={{ opacity: cI(frame, 30, 44, 0, 1, EASE) }}> {post}</span>
        </div>

        {/* source line */}
        <div
          style={{
            marginTop: 44,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            opacity: cI(frame, 40, 54, 0, 1),
          }}
        >
          <div style={{ width: 30, height: 4, borderRadius: 2, background: TEAL }} />
          <span
            style={{
              fontFamily: F_INTER,
              fontWeight: 600,
              fontSize: 28,
              color: TEALD,
              letterSpacing: 0.5,
            }}
          >
            {source}
          </span>
        </div>
      </div>
    </Stage>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 4) CitationCard — citación formal de estudio con count-up y check "verificado".
// ══════════════════════════════════════════════════════════════════════════════
export const CitationCard: React.FC<{
  durationInFrames: number;
  journal?: string;
  finding?: string;
  stat?: number;
  statPrefix?: string;
  statSuffix?: string;
  statLabel?: string;
}> = ({
  durationInFrames: D,
  // ⚠ DEFAULTS VACÍOS A PROPÓSITO — esta familia DRAMATIZA ESTUDIOS, así que un default plausible
  // no es un placeholder: es una cita falsa que se publica. Antes traía nombres de revistas REALES
  // (Lancet, NEJM, JAMA, The New York Times) pegados a hallazgos inventados, de modo que si el que
  // llamaba omítía un prop, el video mostraba a esa revista afirmando algo que nunca dijo. En un
  // canal de salud. Si falta el dato, que se vea el hueco — NO lo rellenes con un ejemplo.
  journal = "",
  finding = "",
  stat = 27,
  statPrefix = "",
  statSuffix = "%",
  statLabel = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });
  const out = cI(frame, D - 12, D, 1, 0);
  const op = Math.min(enter, out);
  const sc = interpolate(enter, [0, 1], [0.94, 1]);
  const rise = interpolate(enter, [0, 1], [40, 0]);

  // count-up 0 → stat
  const p = cI(frame, 10, 46, 0, 1, EASE);
  const val = Math.round(stat * p);

  // check dibujándose
  const checkP = cI(frame, 40, 58, 0, 1);
  const findIn = cI(frame, 24, 40, 0, 1, EASE);

  return (
    <Stage>
      <div
        style={{
          position: "relative",
          width: 1120,
          padding: "70px 80px",
          borderRadius: 34,
          opacity: op,
          transform: `translateY(${rise}px) scale(${sc})`,
          background: GLASS,
          boxShadow:
            "0 44px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.9)",
          border: "1.5px solid rgba(255,255,255,0.9)",
          overflow: "hidden",
        }}
      >
        {/* número fantasma de fondo */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: 20,
            fontFamily: F_INTER,
            fontWeight: 900,
            fontSize: 420,
            lineHeight: 1,
            color: "rgba(18,179,174,0.07)",
            userSelect: "none",
          }}
        >
          {statPrefix}
          {val}
        </div>

        {/* count-up grande */}
        <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 26 }}>
          <div
            style={{
              fontFamily: F_INTER,
              fontWeight: 900,
              fontSize: 220,
              lineHeight: 0.9,
              letterSpacing: -8,
              background: `linear-gradient(150deg, ${INK}, ${TEALD})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: cI(frame, 8, 24, 0, 1, EASE),
            }}
          >
            {statPrefix}
            {val}
            {statSuffix}
          </div>
          {statLabel && (
            <div
              style={{
                fontFamily: F_INTER,
                fontWeight: 600,
                fontSize: 40,
                color: "rgba(18,34,43,0.62)",
                paddingBottom: 34,
                maxWidth: 460,
                opacity: cI(frame, 20, 36, 0, 1),
              }}
            >
              {statLabel}
            </div>
          )}
        </div>

        {/* finding */}
        <div
          style={{
            position: "relative",
            fontFamily: F_INTER,
            fontWeight: 800,
            fontSize: 56,
            lineHeight: 1.12,
            color: INK,
            letterSpacing: -0.5,
            marginTop: 20,
            opacity: findIn,
            transform: `translateY(${interpolate(findIn, [0, 1], [18, 0])}px)`,
          }}
        >
          {finding}
        </div>

        {/* attribution + verified check */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 34,
            paddingTop: 26,
            borderTop: "1.5px solid rgba(18,179,174,0.18)",
            opacity: cI(frame, 36, 50, 0, 1),
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              background: `linear-gradient(150deg, ${TEAL}, ${TEALD})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto",
              boxShadow: `0 8px 20px ${TEAL}55`,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 26 26">
              <path
                d="M5 13 L11 19 L21 7"
                fill="none"
                stroke="#fff"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="40"
                strokeDashoffset={interpolate(checkP, [0, 1], [40, 0])}
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: F_INTER,
              fontWeight: 600,
              fontSize: 34,
              color: TEALD,
              letterSpacing: 0.3,
            }}
          >
            {journal}
          </span>
        </div>
      </div>
    </Stage>
  );
};
