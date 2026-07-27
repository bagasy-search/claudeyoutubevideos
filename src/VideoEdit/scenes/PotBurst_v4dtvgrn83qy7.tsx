import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";

// ── COMPONENTE A MEDIDA (video maceta de barro) ──────────────────────────────
// EL PAGO DEL LOOP: corte de la pared de barro. El barro es POROSO y guarda agua
// adentro de sus huecos. El fuego entra por abajo, el frente de calor sube, cada
// gota se vuelve VAPOR y ocupa ~1000 veces más volumen. No tiene por dónde salir
// → la presión sube, el barro se abomba, se raja y REVIENTA una esquirla hacia
// afuera. Todo SVG animado por frame, sin imágenes ni fuentes externas.
// Hermano de CureDiagram / ZeerPotDiagram (misma paleta terrosa, mismo serif).

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const mulberry32 = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// ── geometría fija del corte de pared ────────────────────────────────────────
const WX0 = 640; // cara interna (lado de adentro de la olla)
const WX1 = 920; // cara externa (lado de afuera → por acá sale la esquirla)
const WY0 = 145;
const WY1 = 670;
const BX = 920; // punto del estallido
const BY = 470;

// poros del barro (grilla jitterada, determinista)
const PORES = (() => {
  const r = mulberry32(7);
  const cols = [675, 743, 811, 879];
  const out: { x: number; y: number; r: number; ph: number }[] = [];
  for (let row = 0; row < 7; row++) {
    for (let c = 0; c < 4; c++) {
      out.push({
        x: cols[c] + (r() - 0.5) * 26,
        y: 180 + row * 72 + (r() - 0.5) * 22,
        r: 8 + r() * 7,
        ph: r(),
      });
    }
  }
  return out;
})();

// esquirlas chicas que salen disparadas con la grande
const FRAGS = (() => {
  const r = mulberry32(23);
  return Array.from({ length: 11 }, () => ({
    ang: -1.2 + r() * 1.35, // radianes (negativo = hacia arriba, y baja)
    v: 150 + r() * 290,
    s: 4 + r() * 8,
    spin: (r() - 0.5) * 620,
  }));
})();

// cráter/esquirla — contorno dentado en coordenadas locales respecto de (BX,BY)
const SHARD_PTS: [number, number][] = [
  [0, -92],
  [-40, -70],
  [-60, -30],
  [-44, 2],
  [-68, 38],
  [-32, 64],
  [-16, 92],
  [0, 92],
];
const shardPath = (ox: number, oy: number) =>
  SHARD_PTS.map((p, i) => `${i === 0 ? "M" : "L"} ${ox + p[0]} ${oy + p[1]}`).join(" ") + " Z";

const CLAY_EDGE = "#5E3320";
const CLAY_DEEP = "#7A4028";
const VAPOR = "#F3E8D0";

export const PotBurstV4dt: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  accent?: string;
}> = ({
  durationInFrames,
  eyebrow = "Por qué truena",
  title = "El vapor no tiene salida",
  accent = COLORS.danger,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = Math.max(1, durationInFrames);
  const t = clamp01(frame / total); // 0..1 → todo el timing va en fracciones

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 62 } });
  const TB = 0.79; // el estallido
  const tau = clamp01((t - TB) / (1 - TB)); // 0..1 después del estallido
  const burst = t >= TB;

  // frente de calor subiendo desde el fuego
  const yFront = interpolate(t, [0.12, 0.5], [WY1 + 30, WY0 - 15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // presión adentro: sube y se libera de golpe al reventar
  const pressure = burst
    ? interpolate(t, [TB, TB + 0.05], [0.98, 0.11], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : interpolate(t, [0.22, TB], [0.05, 0.98], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.quad),
      });

  // la pared se abomba hacia afuera con la presión
  const bulge = burst ? 4 : pressure * 22;
  const wall =
    `M ${WX0} ${WY0} L ${WX1} ${WY0} ` +
    `Q ${WX1 + bulge} ${(WY0 + WY1) / 2} ${WX1} ${WY1} ` +
    `L ${WX0} ${WY1} Z`;

  // rajaduras que se abren antes del estallido
  const crackReveal = interpolate(t, [0.57, TB], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const CRACKS = [
    "M 876 452 L 896 430 L 906 438 L 920 414",
    "M 878 476 L 900 482 L 909 472 L 920 478",
    "M 874 496 L 890 516 L 902 510 L 920 536",
    "M 872 466 L 846 436 L 852 402 L 836 372",
  ];

  // contador ×1000
  const mult = Math.round(
    interpolate(t, [0.34, 0.6], [1, 1000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }),
  );

  // vuelo de la esquirla grande
  const shardX = interpolate(tau, [0, 1], [BX, BX + 520], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shardY = BY - 340 * tau + 170 * tau * tau;
  const shardRot = tau * 205;
  const shardScale = 1 - 0.18 * tau;

  const flash = clamp01((t - TB) / 0.055);

  // las flechas de calor pesan al principio y se apagan cuando ya cocinó todo
  const heatArrows = interpolate(t, [0.1, 0.19, 0.52, 0.64], [0, 1, 1, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // texto que va cambiando (siempre hay algo legible en un still suelto)
  const pill =
    t < 0.4
      ? { txt: "el barro guarda agua en sus poros", col: COLORS.cold }
      : burst
        ? { txt: "Sin crujido. Sin humo.", col: accent }
        : { txt: "el vapor empuja desde adentro", col: COLORS.amber };
  const tag =
    t < 0.4
      ? { txt: "agua en los poros", col: COLORS.cold }
      : burst
        ? { txt: "no tenía salida", col: accent }
        : { txt: "ahora es vapor", col: COLORS.amber };

  // ── medidor de presión ─────────────────────────────────────────────────────
  const GCX = 1330;
  const GCY = 540;
  const GR = 110;
  const gpt = (v: number, rad: number) => {
    const th = ((180 - 180 * v) * Math.PI) / 180;
    return [GCX + Math.cos(th) * rad, GCY - Math.sin(th) * rad] as const;
  };
  const gA = gpt(0, GR);
  const gB = gpt(1, GR);
  const gRed = gpt(0.72, GR);
  const needle = gpt(pressure, GR - 26);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={54} glowY={62} hue="amber" drift={0.25} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: "94%",
            maxWidth: 1520,
            opacity: enter,
            transform: `translateY(${(1 - enter) * 22}px)`,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 2, fontFamily: FONT_STACK }}>
            {eyebrow && (
              <div
                style={{
                  letterSpacing: 7,
                  fontSize: 20,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: COLORS.amber,
                }}
              >
                {eyebrow}
              </div>
            )}
            {title && (
              <div style={{ fontSize: 52, fontWeight: 900, color: COLORS.text, marginTop: 2 }}>
                {title}
              </div>
            )}
          </div>

          <svg viewBox="0 0 1600 900" style={{ width: "100%", height: "auto" }}>
            <defs>
              <linearGradient id="pb_clay" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8E4C2C" />
                <stop offset="45%" stopColor="#B96D45" />
                <stop offset="100%" stopColor="#C98A5C" />
              </linearGradient>
              <linearGradient id="pb_clay2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8E4C2C" />
                <stop offset="48%" stopColor="#BC7047" />
                <stop offset="100%" stopColor="#CE8A5A" />
              </linearGradient>
              <linearGradient id="pb_heat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.04} />
                <stop offset="100%" stopColor={accent} stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="pb_flame" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.95} />
                <stop offset="100%" stopColor={accent} stopOpacity={0.15} />
              </linearGradient>
              <radialGradient id="pb_flash">
                <stop offset="0%" stopColor="#FFF3DC" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#FFF3DC" stopOpacity={0} />
              </radialGradient>
              <mask id="pb_wallmask">
                <path d={wall} fill="#fff" />
                {burst && <path d={shardPath(BX, BY)} fill="#000" />}
              </mask>
            </defs>

            {/* ── izquierda: la olla y de dónde sale el corte ── */}
            <g opacity={0.9}>
              <path
                d="M 196 196 L 404 196 L 380 236 L 372 356 Q 300 386 228 356 L 220 236 Z"
                fill="none"
                stroke={CLAY_EDGE}
                strokeWidth={5}
                opacity={0.55}
              />
              <path
                d="M 186 176 L 414 176 L 414 200 L 186 200 Z"
                fill={CLAY_EDGE}
                opacity={0.32}
              />
              <rect
                x={352}
                y={238}
                width={30}
                height={70}
                fill="none"
                stroke={COLORS.amber}
                strokeWidth={4}
              />
              <text
                x={300}
                y={424}
                fontSize={27}
                fontWeight={700}
                fill={COLORS.textSoft}
                fontFamily={FONT_STACK}
                textAnchor="middle"
              >
                la maceta de barro
              </text>
              <path
                d={`M 382 240 L ${WX0} ${WY0}`}
                stroke={COLORS.amber}
                strokeWidth={2}
                strokeDasharray="8 8"
                opacity={0.45}
              />
              <path
                d={`M 382 308 L ${WX0} ${WY1}`}
                stroke={COLORS.amber}
                strokeWidth={2}
                strokeDasharray="8 8"
                opacity={0.45}
              />
            </g>

            {/* insignia ×1000 */}
            <g transform="translate(300 585)">
              <rect
                x={-176}
                y={-84}
                width={352}
                height={168}
                rx={20}
                fill={COLORS.bg2}
                opacity={0.72}
              />
              <rect
                x={-176}
                y={-84}
                width={352}
                height={168}
                rx={20}
                fill="none"
                stroke={COLORS.amber}
                strokeWidth={2}
                opacity={0.5}
              />
              <text
                x={0}
                y={-42}
                fontSize={24}
                fontWeight={800}
                letterSpacing={3}
                fill={COLORS.textSoft}
                fontFamily={FONT_STACK}
                textAnchor="middle"
              >
                UNA GOTA DE AGUA
              </text>
              <text
                x={0}
                y={26}
                fontSize={74}
                fontWeight={900}
                fill={mult > 900 ? accent : COLORS.amber}
                fontFamily={FONT_STACK}
                textAnchor="middle"
              >
                ×{mult}
              </text>
              <text
                x={0}
                y={62}
                fontSize={26}
                fontWeight={700}
                fill={COLORS.textSoft}
                fontFamily={FONT_STACK}
                textAnchor="middle"
              >
                de volumen, en vapor
              </text>
            </g>

            {/* ── el corte de pared ── */}
            <text
              x={(WX0 + WX1) / 2}
              y={108}
              fontSize={25}
              fontWeight={800}
              letterSpacing={5}
              fill={COLORS.textSoft}
              fontFamily={FONT_STACK}
              textAnchor="middle"
            >
              CORTE DE LA PARED
            </text>

            <path d={wall} fill="url(#pb_clay2)" stroke={CLAY_EDGE} strokeWidth={5} />

            <g mask="url(#pb_wallmask)">
              {/* cara interna, más oscura */}
              <rect x={WX0} y={WY0} width={16} height={WY1 - WY0} fill={CLAY_EDGE} opacity={0.35} />
              {/* vetas del barro */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <path
                  key={i}
                  d={`M ${WX0 + 8} ${WY0 + 60 + i * 88} Q ${(WX0 + WX1) / 2} ${WY0 + 46 + i * 88} ${WX1 - 6} ${WY0 + 64 + i * 88}`}
                  stroke={CLAY_EDGE}
                  strokeWidth={2}
                  fill="none"
                  opacity={0.16}
                />
              ))}

              {/* calor que sube desde el fuego */}
              <rect
                x={WX0}
                y={yFront}
                width={WX1 - WX0 + 24}
                height={Math.max(0, WY1 + 30 - yFront)}
                fill="url(#pb_heat)"
              />
              <line
                x1={WX0}
                y1={yFront}
                x2={WX1 + 20}
                y2={yFront}
                stroke={accent}
                strokeWidth={3}
                opacity={yFront < WY1 ? 0.55 : 0}
              />
              {/* poros: agua → vapor */}
              {PORES.map((p, i) => {
                const c = clamp01((p.y - yFront) / 70);
                const wig = Math.sin(frame * 0.22 + p.ph * 6.28) * 1.6 * c;
                const vr = p.r * (1 + 1.5 * c) + wig;
                return (
                  <g key={i}>
                    {/* hueco del poro */}
                    <circle cx={p.x} cy={p.y} r={p.r + 2.5} fill={CLAY_DEEP} opacity={0.55} />
                    {/* vapor expandido */}
                    {c > 0.01 && (
                      <>
                        <circle cx={p.x} cy={p.y} r={vr} fill={VAPOR} opacity={0.2 + 0.52 * c} />
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={vr}
                          fill="none"
                          stroke={COLORS.amber}
                          strokeWidth={2.6}
                          strokeDasharray="6 7"
                          opacity={0.9 * c}
                        />
                      </>
                    )}
                    {/* gota de agua */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={p.r}
                      fill={COLORS.cold}
                      opacity={0.92 * (1 - c)}
                    />
                    <circle
                      cx={p.x - p.r * 0.3}
                      cy={p.y - p.r * 0.34}
                      r={p.r * 0.28}
                      fill="#FFFFFF"
                      opacity={0.5 * (1 - c)}
                    />
                  </g>
                );
              })}

              {/* flechas de calor subiendo por la pared (encima de los poros) */}
              <g opacity={heatArrows}>
                {[0, 1, 2, 3].map((i) => {
                  const cx = WX0 + 44 + i * 66;
                  const span = WY1 - Math.max(WY0, yFront) + 40;
                  const yy = WY1 - ((frame * 4.5 + i * 47) % span);
                  const on = yy > yFront && yy < WY1 - 6;
                  return (
                    <path
                      key={i}
                      d={`M ${cx - 17} ${yy + 17} L ${cx} ${yy} L ${cx + 17} ${yy + 17}`}
                      fill="none"
                      stroke="#FFE0AE"
                      strokeWidth={5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={on ? 0.9 : 0}
                    />
                  );
                })}
              </g>

              {/* rajaduras */}
              {CRACKS.map((d, i) => {
                const r0 = clamp01((crackReveal - i * 0.12) * 1.5);
                return (
                  <path
                    key={i}
                    d={d}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - r0}
                    stroke={CLAY_EDGE}
                    strokeWidth={5}
                    strokeLinecap="round"
                    fill="none"
                    opacity={0.9}
                  />
                );
              })}
            </g>

            {/* cráter que quedó al reventar */}
            {burst && (
              <g>
                <path d={shardPath(BX, BY)} fill={CLAY_DEEP} />
                <path
                  d={shardPath(BX, BY)}
                  fill="none"
                  stroke={CLAY_EDGE}
                  strokeWidth={5}
                  strokeLinejoin="round"
                />
                <path d={shardPath(BX - 9, BY)} fill="#000" opacity={0.16} />
              </g>
            )}

            {/* vapor escapando por el hueco */}
            {burst &&
              [0, 1, 2, 3, 4].map((i) => {
                const pr = clamp01((tau - i * 0.09) * 1.8);
                if (pr <= 0) return null;
                return (
                  <circle
                    key={i}
                    cx={BX + 26 + pr * (70 + i * 26)}
                    cy={BY - 18 - pr * (40 + i * 22)}
                    r={16 + pr * 46}
                    fill={VAPOR}
                    opacity={(1 - pr) * 0.5}
                  />
                );
              })}

            {/* destello del estallido */}
            {burst && flash < 1 && (
              <circle
                cx={BX}
                cy={BY}
                r={50 + flash * 300}
                fill="url(#pb_flash)"
                opacity={1 - flash}
              />
            )}

            {/* esquirlas chicas */}
            {burst &&
              FRAGS.map((f, i) => {
                const fx = BX + Math.cos(f.ang) * f.v * tau;
                const fy = BY + Math.sin(f.ang) * f.v * tau + 300 * tau * tau;
                return (
                  <g key={i} transform={`translate(${fx} ${fy}) rotate(${f.spin * tau})`}>
                    <path
                      d={`M ${-f.s} ${-f.s} L ${f.s * 1.3} ${-f.s * 0.4} L ${f.s * 0.3} ${f.s * 1.2} Z`}
                      fill="#A85C34"
                      stroke={CLAY_EDGE}
                      strokeWidth={1.6}
                      opacity={clamp01(1 - tau * 1.15)}
                    />
                  </g>
                );
              })}

            {/* LA esquirla que sale disparada */}
            {burst && (
              <>
                <g
                  transform={`translate(${shardX} ${shardY}) rotate(${shardRot}) scale(${shardScale})`}
                >
                  <path
                    d={shardPath(0, 0)}
                    fill="url(#pb_clay)"
                    stroke={CLAY_EDGE}
                    strokeWidth={5}
                    strokeLinejoin="round"
                  />
                  <path
                    d={shardPath(0, 0)}
                    fill={VAPOR}
                    opacity={0.1}
                  />
                </g>
                <text
                  x={1436}
                  y={196}
                  fontSize={34}
                  fontWeight={900}
                  fill={accent}
                  fontFamily={FONT_STACK}
                  textAnchor="middle"
                  opacity={clamp01((tau - 0.12) * 5)}
                >
                  sale disparado
                </text>
              </>
            )}

            {/* etiqueta con guía al poro */}
            <g>
              <line
                x1={996}
                y1={252}
                x2={902}
                y2={254}
                stroke={tag.col}
                strokeWidth={2}
                opacity={0.5}
              />
              <circle cx={996} cy={252} r={5} fill={tag.col} opacity={0.7} />
              <text
                x={1012}
                y={264}
                fontSize={36}
                fontWeight={900}
                fill={tag.col}
                fontFamily={FONT_STACK}
              >
                {tag.txt}
              </text>
              <text
                x={1012}
                y={306}
                fontSize={26}
                fontWeight={700}
                fill={COLORS.textSoft}
                fontFamily={FONT_STACK}
              >
                adentro de la pared
              </text>
            </g>

            {/* ── el fuego debajo ── */}
            <g>
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const cx = WX0 + 30 + i * 46;
                const h = 74 + Math.sin(frame * 0.34 + i * 1.7) * 22;
                const sway = Math.sin(frame * 0.26 + i) * 8;
                const base = WY1 + 108;
                return (
                  <g key={i}>
                    <path
                      d={
                        `M ${cx - 26} ${base} ` +
                        `C ${cx - 27} ${base - h * 0.5} ${cx - 6 + sway} ${base - h * 0.42} ${cx + sway} ${base - h} ` +
                        `C ${cx + 9 + sway} ${base - h * 0.5} ${cx + 27} ${base - h * 0.52} ${cx + 26} ${base} Z`
                      }
                      fill="url(#pb_flame)"
                      opacity={0.9}
                    />
                    <path
                      d={
                        `M ${cx - 11} ${base} ` +
                        `C ${cx - 12} ${base - h * 0.32} ${cx - 3 + sway * 0.6} ${base - h * 0.3} ${cx + sway * 0.6} ${base - h * 0.62} ` +
                        `C ${cx + 5 + sway * 0.6} ${base - h * 0.3} ${cx + 12} ${base - h * 0.34} ${cx + 11} ${base} Z`
                      }
                      fill="#F6D9A4"
                      opacity={0.65}
                    />
                  </g>
                );
              })}
              <rect
                x={WX0 - 30}
                y={WY1 + 104}
                width={WX1 - WX0 + 60}
                height={7}
                rx={3}
                fill={CLAY_EDGE}
                opacity={0.5}
              />
              <text
                x={WX0 - 46}
                y={WY1 + 96}
                fontSize={28}
                fontWeight={700}
                fill={COLORS.amber}
                fontFamily={FONT_STACK}
                textAnchor="end"
              >
                el fuego
              </text>
            </g>

            {/* ── medidor de presión ── */}
            <g>
              <path
                d={`M ${gA[0]} ${gA[1]} A ${GR} ${GR} 0 0 1 ${gB[0]} ${gB[1]}`}
                fill="none"
                stroke={COLORS.textDim}
                strokeWidth={12}
                strokeLinecap="round"
              />
              <path
                d={`M ${gRed[0]} ${gRed[1]} A ${GR} ${GR} 0 0 1 ${gB[0]} ${gB[1]}`}
                fill="none"
                stroke={accent}
                strokeWidth={12}
                strokeLinecap="round"
                opacity={0.85}
              />
              {[0, 0.25, 0.5, 0.75, 1].map((v, i) => {
                const a = gpt(v, GR - 20);
                const b = gpt(v, GR - 34);
                return (
                  <line
                    key={i}
                    x1={a[0]}
                    y1={a[1]}
                    x2={b[0]}
                    y2={b[1]}
                    stroke={COLORS.textSoft}
                    strokeWidth={3}
                    opacity={0.55}
                  />
                );
              })}
              <line
                x1={GCX}
                y1={GCY}
                x2={needle[0]}
                y2={needle[1]}
                stroke={pressure > 0.72 ? accent : COLORS.text}
                strokeWidth={7}
                strokeLinecap="round"
              />
              <circle cx={GCX} cy={GCY} r={13} fill={COLORS.text} />
              <text
                x={GCX}
                y={GCY + 58}
                fontSize={30}
                fontWeight={800}
                fill={COLORS.textSoft}
                fontFamily={FONT_STACK}
                textAnchor="middle"
              >
                presión adentro
              </text>
              <text
                x={GCX}
                y={GCY + 102}
                fontSize={38}
                fontWeight={900}
                fill={burst ? accent : pressure > 0.72 ? accent : COLORS.amber}
                fontFamily={FONT_STACK}
                textAnchor="middle"
              >
                {burst ? "revienta" : pressure > 0.6 ? "al límite" : "sube"}
              </text>
            </g>

            {/* ── píldora de abajo: la frase ── */}
            <g transform="translate(780 838)">
              <rect
                x={-420}
                y={-42}
                width={840}
                height={84}
                rx={42}
                fill={COLORS.bg2}
                opacity={0.85}
              />
              <rect
                x={-420}
                y={-42}
                width={840}
                height={84}
                rx={42}
                fill="none"
                stroke={pill.col}
                strokeWidth={3}
                opacity={0.6}
              />
              <text
                x={0}
                y={14}
                fontSize={42}
                fontWeight={900}
                fill={pill.col}
                fontFamily={FONT_STACK}
                textAnchor="middle"
              >
                {pill.txt}
              </text>
            </g>
          </svg>
        </div>
      </AbsoluteFill>

      <SfxCue at={4} src={SFX.popUp} volume={0.35} />
      <SfxCue at={Math.round(0.34 * total)} src={SFX.ui5} volume={0.3} />
      <SfxCue at={Math.round(TB * total)} src={SFX.boom1} volume={0.6} durationInFrames={60} />
    </AbsoluteFill>
  );
};
