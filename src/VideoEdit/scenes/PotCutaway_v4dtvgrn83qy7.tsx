import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";

// ── COMPONENTE A MEDIDA (video mini calefactor de macetas) ───────────────────
// CORTE TRANSVERSAL del aparato: dos macetas de barro ANIDADAS boca abajo, con
// un dedo de CÁMARA DE AIRE entre las dos, atravesadas por una VARILLA ROSCADA
// vertical con tuercas y rondanas que (a) fijan el escalón que separa las
// macetas y (b) TAPAN el hoyo del fondo — si queda abierto, el aparato se
// vuelve chimenea y calienta el techo.
//
// La lectura en 6,5 s, sin narración:
//   llama abajo → el calor golpea la maceta interior → cruza DESPACIO la
//   cámara de aire → se reparte por la maceta exterior → sale como radiación
//   en línea recta hacia el espectador.
//
// Todo SVG animado por frame. Sin imágenes, sin fuentes ni librerías externas.
// CÁMARA QUIETA a propósito: el follow-cam de CrossSection.tsx hace zoom capa
// por capa y termina tapando el título — acá sólo hay un push uniforme mínimo
// (1 → 1.022) aplicado al SVG entero, así las etiquetas y sus guías nunca se
// desalinean ni pisan el texto de cabecera (que vive fuera del SVG).

// ── GEOMETRÍA (viewBox 1600 × 900) ───────────────────────────────────────────
const CX = 800; // eje del aparato = eje de la varilla
const FLOOR = 740; // piso donde se apoyan las velas

type Pot = {
  bw: number; // medio ancho del BORDE (abajo, porque va boca abajo)
  tw: number; // medio ancho del FONDO (arriba)
  yTop: number; // cara exterior del fondo
  yBot: number; // borde
  t: number; // espesor de la pared de barro
  hw: number; // medio ancho del hoyo de drenaje
};

const OUT: Pot = { bw: 250, tw: 165, yTop: 300, yBot: 700, t: 24, hw: 34 };
const INN: Pot = { bw: 170, tw: 106, yTop: 372, yBot: 672, t: 20, hw: 28 };

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

// medio ancho de la cara EXTERIOR de la maceta grande a la altura y
const oOut = (y: number) =>
  lerp(OUT.tw, OUT.bw, (y - OUT.yTop) / (OUT.yBot - OUT.yTop));
// medio ancho de la cara INTERIOR de la maceta grande (el lado del hueco de aire)
const oIn = (y: number) =>
  lerp(
    OUT.tw - OUT.t,
    OUT.bw - OUT.t,
    (y - (OUT.yTop + OUT.t)) / (OUT.yBot - (OUT.yTop + OUT.t)),
  );
// medio ancho de la cara EXTERIOR de la maceta chica
const iOut = (y: number) =>
  lerp(INN.tw, INN.bw, (y - INN.yTop) / (INN.yBot - INN.yTop));

// Media maceta en corte: pared exterior → cara del fondo → labio del hoyo →
// cara interior del fondo → pared interior. Con el hoyo de drenaje ABIERTO en
// el centro (por ahí pasa la varilla).
const potHalf = (p: Pot, s: number) => {
  const x = (v: number) => CX + s * v;
  return [
    `M ${x(p.bw)} ${p.yBot}`,
    `L ${x(p.tw)} ${p.yTop}`,
    `L ${x(p.hw)} ${p.yTop}`,
    `L ${x(p.hw)} ${p.yTop + p.t}`,
    `L ${x(p.tw - p.t)} ${p.yTop + p.t}`,
    `L ${x(p.bw - p.t)} ${p.yBot}`,
    "Z",
  ].join(" ");
};

// La CÁMARA DE AIRE: la franja de arriba (entre el techo de la grande y el
// fondo de la chica) + los dos costados.
const GAP_TOP = [
  `M ${CX - oIn(OUT.yTop + OUT.t)} ${OUT.yTop + OUT.t}`,
  `L ${CX + oIn(OUT.yTop + OUT.t)} ${OUT.yTop + OUT.t}`,
  `L ${CX + oIn(INN.yTop)} ${INN.yTop}`,
  `L ${CX - oIn(INN.yTop)} ${INN.yTop}`,
  "Z",
].join(" ");

const gapSide = (s: number) =>
  [
    `M ${CX + s * oIn(INN.yTop)} ${INN.yTop}`,
    `L ${CX + s * oIn(INN.yBot)} ${INN.yBot}`,
    `L ${CX + s * INN.bw} ${INN.yBot}`,
    `L ${CX + s * INN.tw} ${INN.yTop}`,
    "Z",
  ].join(" ");

// Velas de té bajo la maceta chica
const CANDLES = [CX - 115, CX - 45, CX + 45, CX + 115];
const CANDLE_W = 58;
const CANDLE_TOP = 706;

// Rayos de radiación: alturas elegidas para NO cruzar las etiquetas
const RAD_L = [440, 520, 600, 660];
const RAD_R = [340, 420, 620, 690];
const RAD_T = [CX - 150, CX - 100, CX + 100, CX + 150];

export const PotCutawayV4dt: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  accent?: string;
}> = ({
  durationInFrames,
  eyebrow = "El corte",
  title = "Dos paredes y un dedo de aire",
  accent = COLORS.danger,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── tiempos ────────────────────────────────────────────────────────────────
  const head = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 62 } });
  const gate = (t: number, dur = 0.5) =>
    interpolate(frame, [sec(t), sec(t + dur)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const rise = (t: number, stiffness = 70) =>
    spring({ frame: frame - sec(t), fps, config: { damping: 200, mass: 1, stiffness } });

  const gOuterPot = rise(0.05, 58); // entra la maceta grande
  const gInnerPot = rise(0.25, 58); // entra la maceta chica
  const gRod = rise(0.45, 40); // baja la varilla
  const gFlame = gate(0.3, 0.4); // se prenden las velas
  const gRiseHeat = gate(0.7, 0.5); // el calor sube y golpea la maceta interior
  const gInnerHot = gate(1.3, 0.8); // la maceta interior se calienta
  const gGap = gate(2.1, 0.7); // el calor CRUZA la cámara de aire (despacio)
  const gSpread = gate(3.2, 0.9); // se reparte por la maceta exterior
  const gRad = gate(4.2, 0.8); // sale como radiación recta

  const flick = 0.74 + 0.26 * Math.abs(Math.sin(frame / 4.5));

  // push uniforme mínimo — nunca pisa el título (que está fuera del SVG)
  const camZ = interpolate(frame, [0, Math.max(1, durationInFrames)], [1, 1.022], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── paleta terrosa ─────────────────────────────────────────────────────────
  const CLAY_OUT = "#B4713E"; // terracota de la maceta grande
  const CLAY_OUT_D = "#8A5227";
  const CLAY_IN = "#9A5E31"; // barro más oscuro de la chica
  const CLAY_IN_D = "#6F3F1E";
  const SLATE = "#332F29"; // negro pizarra: herrajes
  const SLATE_HI = "#6B635A";
  const EMBER = "#D98A3A"; // ocre de brasa
  const AIR = "rgba(252,246,231,0.82)";

  // ── partículas ─────────────────────────────────────────────────────────────
  const loop = (period: number, offset: number) =>
    ((((frame + offset) % period) + period) % period) / period;

  // dosis de calor que sube desde la llama hasta el techo de la maceta chica
  const RisePart = () => (
    <g opacity={gRiseHeat}>
      {[CX - 108, CX - 58, CX + 58, CX + 108].map((x, i) => {
        const p = loop(38, i * 11);
        const y = lerp(676, INN.yTop + INN.t + 6, p);
        const o = Math.sin(p * Math.PI) * 0.9;
        return (
          <g key={"rp" + x}>
            <circle cx={x} cy={y} r={6} fill={EMBER} opacity={o} />
            <line
              x1={x}
              y1={y + 16}
              x2={x}
              y2={y + 2}
              stroke={EMBER}
              strokeWidth={4}
              strokeLinecap="round"
              opacity={o * 0.55}
            />
          </g>
        );
      })}
    </g>
  );

  // el calor CRUZA el hueco de aire: de la cara de la maceta chica a la grande
  const GapPart = () => (
    <g opacity={gGap}>
      {[-1, 1].map((s) =>
        [418, 480, 542, 604, 656].map((y, i) => {
          const p = loop(58, i * 12 + (s < 0 ? 0 : 29)); // lento a propósito
          const x0 = CX + s * iOut(y);
          const x1 = CX + s * oIn(y);
          const x = lerp(x0, x1, p);
          const o = Math.sin(p * Math.PI) * 0.95;
          return (
            <g key={`gp${s}${y}`}>
              <line
                x1={x - s * 15}
                y1={y}
                x2={x}
                y2={y}
                stroke={accent}
                strokeWidth={5}
                strokeLinecap="round"
                opacity={o * 0.5}
              />
              <circle cx={x} cy={y} r={5.5} fill={accent} opacity={o} />
            </g>
          );
        }),
      )}
      {/* también cruza por arriba, hacia el techo de la maceta grande */}
      {[CX - 90, CX + 90].map((x, i) => {
        const p = loop(58, i * 29 + 14);
        const y = lerp(INN.yTop - 4, OUT.yTop + OUT.t + 6, p);
        const o = Math.sin(p * Math.PI) * 0.9;
        return <circle key={"gt" + x} cx={x} cy={y} r={5} fill={accent} opacity={o} />;
      })}
    </g>
  );

  // ya cruzado, el calor SE REPARTE subiendo por la cara interna de la grande
  const SpreadPart = () => (
    <g opacity={gSpread * 0.85}>
      {[-1, 1].map((s) =>
        [0, 1, 2].map((k) => {
          const p = loop(50, k * 17 + (s < 0 ? 0 : 25));
          const y = lerp(686, OUT.yTop + OUT.t + 10, p);
          const x = CX + s * (oIn(y) - 7);
          const o = Math.sin(p * Math.PI) * 0.85;
          return (
            <circle key={`sp${s}${k}`} cx={x} cy={y} r={4.5} fill={EMBER} opacity={o} />
          );
        }),
      )}
    </g>
  );

  // radiación EN LÍNEA RECTA saliendo de la maceta exterior
  const ray = (
    key: string,
    x0: number,
    y0: number,
    dx: number,
    dy: number,
    i: number,
    reach: number,
    len: number,
  ) => (
    <g key={key}>
      {[0, 1, 2].map((k) => {
        const p = ((((frame * 1.7 + i * 23 + k * 44) % 132) + 132) % 132) / 132;
        const d = 16 + p * reach;
        const o = Math.sin(p * Math.PI) * 0.9 * gRad;
        return (
          <line
            key={k}
            x1={x0 + dx * d}
            y1={y0 + dy * d}
            x2={x0 + dx * (d + len)}
            y2={y0 + dy * (d + len)}
            stroke={accent}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={o}
          />
        );
      })}
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={50} glowY={54} hue="amber" drift={0.25} />

      <AbsoluteFill
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div
          style={{
            width: "92%",
            maxWidth: 1600,
            opacity: head,
            transform: `translateY(${(1 - head) * 22}px)`,
          }}
        >
          {/* CABECERA — fuera del SVG, la cámara jamás la toca */}
          <div style={{ textAlign: "center", marginBottom: 2, fontFamily: FONT_STACK }}>
            {eyebrow && (
              <div
                style={{
                  letterSpacing: 6,
                  fontSize: 19,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: COLORS.amber,
                }}
              >
                {eyebrow}
              </div>
            )}
            {title && (
              <div
                style={{ fontSize: 50, fontWeight: 900, color: COLORS.text, marginTop: 4 }}
              >
                {title}
              </div>
            )}
          </div>

          <svg viewBox="0 0 1600 900" style={{ width: "100%", height: "auto" }}>
            <defs>
              <radialGradient id="pc_fire" cx="50%" cy="82%" r="62%">
                <stop offset="0%" stopColor="#FFDA85" />
                <stop offset="55%" stopColor={EMBER} />
                <stop offset="100%" stopColor={EMBER} stopOpacity={0} />
              </radialGradient>
              <radialGradient id="pc_halo" cx="50%" cy="50%" r="50%">
                <stop offset="35%" stopColor={accent} stopOpacity={0} />
                <stop offset="100%" stopColor={accent} stopOpacity={0.16} />
              </radialGradient>
              {/* el calor TREPA por la pared: el corte del degradado sube con la fase */}
              <linearGradient id="pc_heatIn" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor={accent} stopOpacity={0.85} />
                <stop offset={0.06 + gInnerHot * 0.92} stopColor={accent} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pc_heatOut" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor={accent} stopOpacity={0.72} />
                <stop offset={0.04 + gSpread * 0.94} stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>

            <g
              style={{
                transformOrigin: "800px 480px",
                transform: `scale(${camZ})`,
              }}
            >
              {/* halo cálido detrás del aparato */}
              <ellipse
                cx={CX}
                cy={500}
                rx={520}
                ry={330}
                fill="url(#pc_halo)"
                opacity={gRad * (0.75 + 0.25 * Math.sin(frame / 22))}
              />

              {/* piso + ladrillos que levantan la maceta grande */}
              <rect x={0} y={FLOOR} width={1600} height={160} fill="#5C4A30" opacity={0.26} />
              <line x1={0} y1={FLOOR} x2={1600} y2={FLOOR} stroke={COLORS.bg2} strokeWidth={3} />
              {[-1, 1].map((s) => (
                <rect
                  key={"br" + s}
                  x={s < 0 ? CX - 272 : CX + 192}
                  y={OUT.yBot}
                  width={80}
                  height={FLOOR - OUT.yBot}
                  rx={4}
                  fill="#8A5227"
                  opacity={0.5 * gOuterPot}
                  stroke={CLAY_OUT_D}
                  strokeWidth={2}
                />
              ))}

              {/* ── LA CÁMARA DE AIRE (el dedo de aire) ── */}
              <g opacity={gInnerPot}>
                <path d={GAP_TOP} fill={AIR} />
                {[-1, 1].map((s) => (
                  <path key={"gs" + s} d={gapSide(s)} fill={AIR} />
                ))}
                {[-1, 1].map((s) => (
                  <path
                    key={"gso" + s}
                    d={gapSide(s)}
                    fill="none"
                    stroke={COLORS.amber}
                    strokeWidth={2.5}
                    strokeDasharray="9 8"
                    opacity={0.55 * gate(2.6, 0.5)}
                  />
                ))}
              </g>

              {/* ── MACETA GRANDE (exterior) ── */}
              <g opacity={gOuterPot}>
                {[-1, 1].map((s) => (
                  <g key={"po" + s}>
                    <path
                      d={potHalf(OUT, s)}
                      fill={CLAY_OUT}
                      stroke={CLAY_OUT_D}
                      strokeWidth={3}
                    />
                    <path d={potHalf(OUT, s)} fill="url(#pc_heatOut)" />
                  </g>
                ))}
              </g>

              {/* ── MACETA MEDIANA (interior) ── */}
              <g opacity={gInnerPot}>
                {[-1, 1].map((s) => (
                  <g key={"pi" + s}>
                    <path
                      d={potHalf(INN, s)}
                      fill={CLAY_IN}
                      stroke={CLAY_IN_D}
                      strokeWidth={3}
                    />
                    <path d={potHalf(INN, s)} fill="url(#pc_heatIn)" />
                  </g>
                ))}
              </g>

              {/* ── VELAS + LLAMA ── */}
              <g opacity={gFlame}>
                {CANDLES.map((x) => (
                  <rect
                    key={"cc" + x}
                    x={x - CANDLE_W / 2}
                    y={CANDLE_TOP}
                    width={CANDLE_W}
                    height={FLOOR - CANDLE_TOP}
                    rx={4}
                    fill={SLATE_HI}
                    opacity={0.55}
                    stroke={SLATE}
                    strokeWidth={2}
                  />
                ))}
                {CANDLES.map((x, i) => {
                  const f = flick * (0.9 + 0.1 * Math.sin(frame / 6 + i));
                  const h = 56 * f;
                  const b = CANDLE_TOP + 2;
                  return (
                    <g key={"fl" + x}>
                      <ellipse cx={x} cy={b - h * 0.42} rx={40 * f} ry={44 * f} fill="url(#pc_fire)" />
                      <path
                        d={`M ${x} ${b} Q ${x - 15} ${b - h * 0.44} ${x - 6} ${b - h * 0.76} Q ${x} ${b - h} ${x + 6} ${b - h * 0.76} Q ${x + 15} ${b - h * 0.44} ${x} ${b} Z`}
                        fill="#F2B24A"
                      />
                      <path
                        d={`M ${x} ${b - 4} Q ${x - 7} ${b - h * 0.4} ${x} ${b - h * 0.62} Q ${x + 7} ${b - h * 0.4} ${x} ${b - 4} Z`}
                        fill="#FFE7A8"
                      />
                    </g>
                  );
                })}
              </g>

              <RisePart />
              <GapPart />
              <SpreadPart />

              {/* ── VARILLA ROSCADA + TUERCAS + RONDANAS ── */}
              <g opacity={gRod}>
                {(() => {
                  const y0 = 246;
                  const y1 = lerp(y0, 704, gRod);
                  return (
                    <g>
                      <rect x={CX - 5.5} y={y0} width={11} height={y1 - y0} fill={SLATE} />
                      <line
                        x1={CX}
                        y1={y0}
                        x2={CX}
                        y2={y1}
                        stroke="rgba(239,231,211,0.34)"
                        strokeWidth={11}
                        strokeDasharray="2 7"
                      />
                      <line
                        x1={CX - 3}
                        y1={y0}
                        x2={CX - 3}
                        y2={y1}
                        stroke={SLATE_HI}
                        strokeWidth={2}
                        opacity={0.7}
                      />
                    </g>
                  );
                })()}

                {/* rondanas (arandelas) */}
                {[
                  { y: 291, w: 76 }, // encima del fondo de la grande → TAPA EL HOYO
                  { y: 324, w: 76 }, // por debajo del techo de la grande
                  { y: 361, w: 66 }, // encima del fondo de la chica → fija el escalón
                  { y: 392, w: 66 }, // por debajo del techo de la chica
                ].map((r) => (
                  <rect
                    key={"wa" + r.y}
                    x={CX - r.w / 2}
                    y={r.y}
                    width={r.w}
                    height={9}
                    rx={2}
                    fill={SLATE_HI}
                    stroke={SLATE}
                    strokeWidth={2}
                  />
                ))}

                {/* tuercas */}
                {[267, 333, 401, 680].map((y) => (
                  <polygon
                    key={"nu" + y}
                    points={`${CX - 23},${y + 5} ${CX - 16},${y} ${CX + 16},${y} ${CX + 23},${y + 5} ${CX + 23},${y + 17} ${CX + 16},${y + 22} ${CX - 16},${y + 22} ${CX - 23},${y + 17}`}
                    fill={SLATE}
                    stroke={SLATE_HI}
                    strokeWidth={2}
                  />
                ))}
              </g>

              {/* ── RADIACIÓN EN LÍNEA RECTA ── */}
              {RAD_L.map((y, i) => ray(`rl${y}`, CX - oOut(y), y, -1, 0, i, 176, 34))}
              {RAD_R.map((y, i) => ray(`rr${y}`, CX + oOut(y), y, 1, 0, i + 4, 176, 34))}
              {RAD_T.map((x, i) => ray(`rt${x}`, x, OUT.yTop, 0, -1, i + 8, 60, 24))}

              {/* ── ETIQUETAS (4, ni una más) ── */}
              <Tag
                at={0.8}
                x={CX}
                y={128}
                anchor="middle"
                text="Varilla roscada"
                sub="atraviesa todo el aparato"
                from={[CX, 174]}
                to={[CX, 242]}
                rise={rise}
                accent={COLORS.amber}
              />
              <Tag
                at={1.5}
                x={1210}
                y={252}
                anchor="start"
                text="El hoyo, tapado"
                sub="abierto, calienta el techo"
                from={[1196, 246]}
                to={[846, 280]}
                rise={rise}
                accent={accent}
              />
              <Tag
                at={2.2}
                x={1210}
                y={472}
                anchor="start"
                text="Tuercas y rondanas"
                sub="fijan el escalón"
                from={[1196, 466]}
                to={[834, 352]}
                rise={rise}
                accent={COLORS.amber}
              />
              <Tag
                at={2.9}
                x={430}
                y={252}
                anchor="end"
                text="Un dedo de aire"
                sub="≈ 2 cm, el secreto"
                from={[446, 264]}
                to={[650, 470]}
                rise={rise}
                accent={COLORS.good}
              />
            </g>
          </svg>
        </div>
      </AbsoluteFill>

      <SfxCue at={sec(0.1)} src={SFX.layerDrop} volume={0.4} />
      <SfxCue at={sec(0.45)} src={SFX.markerDrive} volume={0.4} durationInFrames={sec(0.9)} />
      <SfxCue at={sec(2.1)} src={SFX.whoosh} volume={0.34} durationInFrames={sec(1.2)} />
      <SfxCue at={sec(4.2)} src={SFX.ui5} volume={0.38} />
    </AbsoluteFill>
  );
};

// Etiqueta con guía recta al punto señalado. Sin caja pesada: tipografía serif
// de la marca + una línea punteada fina, como plano técnico.
const Tag: React.FC<{
  at: number;
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  text: string;
  sub?: string;
  from: [number, number];
  to: [number, number];
  rise: (t: number, stiffness?: number) => number;
  accent: string;
}> = ({ at, x, y, anchor, text, sub, from, to, rise, accent }) => {
  const s = rise(at, 74);
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  return (
    <g opacity={s}>
      <line
        x1={from[0]}
        y1={from[1]}
        x2={from[0] + dx * s}
        y2={from[1] + dy * s}
        stroke={accent}
        strokeWidth={2.5}
        strokeDasharray="7 6"
        opacity={0.85}
      />
      <circle cx={to[0]} cy={to[1]} r={6 * s} fill={accent} />
      <g transform={`translate(${x} ${y + (1 - s) * 12})`} textAnchor={anchor}>
        <text fontSize={36} fontWeight={900} fill={COLORS.text} fontFamily={FONT_STACK}>
          {text}
        </text>
        {sub && (
          <text y={31} fontSize={22} fontWeight={600} fill={COLORS.textSoft} fontFamily={FONT_STACK}>
            {sub}
          </text>
        )}
      </g>
    </g>
  );
};
