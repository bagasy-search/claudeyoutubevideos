import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { THEME_AMISH } from "../kit/premium/theme";
import { AgedPaper, FilmWear } from "./AmishKit";

// ═══════════════════════════════════════════════════════════════════════════
// MOUSE KIT — componentes propios del video `cymouse`
// "Two Cheap Metals Eliminate Any Mouse Forever" · canal claudio yoder
//
// Por qué existen en vez de reusar el kit plano (regla 11 de `video-pipeline`):
// los seis momentos que sostienen este video son MECANISMOS, y un lower-third o
// una tarjeta de texto no explica un mecanismo — lo enuncia. Acá se dibujan:
//   · ToothChisel    — por qué el diente gana contra la madera y pierde contra la malla
//   · MouseGapScale  — el cuarto de pulgada, contra un lápiz, con la silueta pasando
//   · EntryPointMap  — el corte de la casa con los OCHO puntos de entrada
//   · HuntTool       — las tres herramientas de la caza (luz rasante, mancha, harina)
//   · PackLayers     — el agujero armándose por capas: limpiar, cobre, tapa
//   · MetalVsWool    — el split del enemigo (cobre contra lana de acero)
//
// Todo es SVG/CSS: no cargan ninguna imagen, así que no pueden tirar el chunk por
// un archivo faltante (el `EncodingError` que ya mató tres renders en este repo).
//
// Idioma del canal: entradas por FADE largo, deriva mínima, `FilmWear` encima.
// Cero springs con rebote, cero brillo especular. Todo el texto viene por props
// con defaults neutros — no hay copy de otro video quemado adentro.
// ═══════════════════════════════════════════════════════════════════════════

const C = THEME_AMISH.color;
const SERIF = THEME_AMISH.fontDisplay;

/** fade largo: la entrada canónica del canal */
const useFade = (at: number, dur = 26) => {
  const f = useCurrentFrame();
  return interpolate(f - at, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

/** versión PURA del fade: se usa dentro de .map(), donde un hook sería ilegal */
const fadeAt = (frame: number, at: number, dur = 26) =>
  interpolate(frame - at, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** salida suave sobre el final del beat, para que nada corte en seco */
const useOut = (durationInFrames: number, dur = 18) => {
  const f = useCurrentFrame();
  return interpolate(f, [durationInFrames - dur, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** progreso 0→1 de una animación interna, con easing parejo */
const useRun = (at: number, dur: number) => {
  const f = useCurrentFrame();
  return interpolate(f - at, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
};

/** marco común: fondo pergamino a pantalla completa + título + pie + desgaste */
const Sheet: React.FC<{
  durationInFrames: number;
  title: string;
  caption?: string;
  children: React.ReactNode;
}> = ({ durationInFrames, title, caption, children }) => {
  const inP = useFade(0, 26);
  const outP = useOut(durationInFrames);
  const drift = interpolate(useCurrentFrame(), [0, durationInFrames], [0, 10], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: Math.min(inP, outP) }}>
      <AbsoluteFill style={{ background: C.bg1 }} />
      <AbsoluteFill style={{ padding: "62px 96px", transform: `translateY(${-drift * 0.35}px)` }}>
        <AgedPaper seed={7} deckle={1} style={{ width: "100%", height: "100%" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              padding: "48px 64px 40px",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 46,
                letterSpacing: 1.5,
                color: C.ink,
                textAlign: "center",
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>
            <div
              style={{
                width: 180,
                height: 2,
                background: C.accentSoft,
                margin: "18px auto 0",
                opacity: 0.75,
              }}
            />
            <div style={{ flex: 1, position: "relative", marginTop: 18 }}>{children}</div>
            {caption ? (
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 27,
                  lineHeight: 1.35,
                  color: C.textSoft,
                  textAlign: "center",
                  maxWidth: 1250,
                  margin: "0 auto",
                }}
              >
                {caption}
              </div>
            ) : null}
          </div>
        </AgedPaper>
      </AbsoluteFill>
      <FilmWear strength={0.85} />
    </AbsoluteFill>
  );
};

// ── ToothChisel ─────────────────────────────────────────────────────────────
// mode "purchase": el diente entra en una superficie sólida y levanta una viruta.
// mode "nothing" : el mismo diente sobre alambre redondo — la hebra rueda y vuelve.
export const ToothChisel: React.FC<{
  durationInFrames: number;
  mode?: "purchase" | "nothing";
  title?: string;
  caption?: string;
}> = ({ durationInFrames, mode = "purchase", title = "", caption = "" }) => {
  const p = useRun(24, 58);
  const bite = Math.sin(p * Math.PI * 2.5) * 0.5 + 0.5; // el vaivén de la mandíbula
  const push = mode === "purchase" ? bite * 26 : bite * 14;
  const chip = interpolate(p, [0.35, 1], [0, 74], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const roll = mode === "nothing" ? bite * 30 : 0;

  return (
    <Sheet durationInFrames={durationInFrames} title={title} caption={caption}>
      <svg viewBox="0 0 1200 430" style={{ width: "100%", height: "100%" }}>
        {/* el diente-cincel */}
        <g transform={`translate(${430 + push}, ${120})`}>
          <path
            d="M0 0 L96 0 L96 132 L60 178 L36 178 L0 132 Z"
            fill="#E8D9AE"
            stroke={C.ink}
            strokeWidth={3.5}
          />
          <path d="M36 178 L60 178 L48 196 Z" fill={C.ink} opacity={0.85} />
          <path d="M0 0 L96 0 L96 22 L0 22 Z" fill={C.accentSoft} opacity={0.5} />
        </g>

        {mode === "purchase" ? (
          <>
            {/* superficie sólida: da una cara donde apoyar */}
            <rect x={120} y={300} width={960} height={92} fill={C.bg2} stroke={C.ink} strokeWidth={3.5} />
            <line x1={120} y1={300} x2={1080} y2={300} stroke={C.ink} strokeWidth={5} />
            {/* la viruta que se levanta */}
            <path
              d={`M${470 + push} 300 q ${chip * 0.6} -${28 + chip * 0.5} ${chip} -${chip * 0.35}`}
              fill="none"
              stroke={C.accent}
              strokeWidth={7}
              strokeLinecap="round"
              opacity={chip > 4 ? 0.95 : 0}
            />
            <text x={150} y={365} fontFamily={SERIF} fontSize={30} fill={C.textSoft}>
              a face that holds still
            </text>
          </>
        ) : (
          <>
            {/* malla: alambres redondos que ruedan y vuelven */}
            {Array.from({ length: 11 }, (_, i) => {
              const cx = 190 + i * 76;
              const near = Math.abs(cx - (478 + push)) < 120;
              const dx = near ? roll * (cx < 478 + push ? -1 : 1) * 0.9 : 0;
              return (
                <g key={i}>
                  <circle
                    cx={cx + dx}
                    cy={332}
                    r={27}
                    fill={C.accentSoft}
                    stroke={C.ink}
                    strokeWidth={3.5}
                    opacity={0.95}
                  />
                  <circle cx={cx + dx - 8} cy={324} r={7} fill="#F3E7C8" opacity={0.75} />
                </g>
              );
            })}
            {/* la hebra que se estira y vuelve */}
            <path
              d={`M160 332 Q ${478 + push} ${332 + roll * 1.5} 1090 332`}
              fill="none"
              stroke={C.accent}
              strokeWidth={4}
              opacity={0.5}
            />
            <text x={150} y={402} fontFamily={SERIF} fontSize={30} fill={C.textSoft}>
              nothing to set a tooth against
            </text>
          </>
        )}
      </svg>
    </Sheet>
  );
};

// ── MouseGapScale ───────────────────────────────────────────────────────────
// La cifra del video. mode "pencil": el hueco contra un lápiz, con la silueta
// cruzando. mode "mesh": por qué media pulgada y la mosquitera son una puerta.
export const MouseGapScale: React.FC<{
  durationInFrames: number;
  mode?: "pencil" | "mesh";
  title?: string;
  caption?: string;
}> = ({ durationInFrames, mode = "pencil", title = "", caption = "" }) => {
  const frame = useCurrentFrame();
  const p = useRun(26, 66);
  const walk = interpolate(p, [0.25, 1], [-260, 1240], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Sheet durationInFrames={durationInFrames} title={title} caption={caption}>
      <svg viewBox="0 0 1200 430" style={{ width: "100%", height: "100%" }}>
        {mode === "pencil" ? (
          <>
            {/* la pared con el hueco */}
            <rect x={0} y={0} width={1200} height={188} fill={C.bg2} stroke={C.ink} strokeWidth={3.5} />
            <rect x={0} y={244} width={1200} height={186} fill={C.bg2} stroke={C.ink} strokeWidth={3.5} />
            <rect x={0} y={188} width={1200} height={56} fill="#241C12" />

            {/* la silueta que camina y pasa por el hueco */}
            <g transform={`translate(${walk}, 216)`} opacity={0.92}>
              <ellipse cx={0} cy={0} rx={58} ry={22} fill="#1C150C" />
              <circle cx={52} cy={-6} r={16} fill="#1C150C" />
              <path d="M-56 2 q -54 10 -74 -8" fill="none" stroke="#1C150C" strokeWidth={5} strokeLinecap="round" />
            </g>

            {/* el lápiz de referencia, a la misma altura que el hueco */}
            <g transform="translate(760, 300)">
              <rect x={0} y={0} width={330} height={56} rx={4} fill="#D8A93C" stroke={C.ink} strokeWidth={3} />
              <path d="M330 0 L392 28 L330 56 Z" fill="#E8D9AE" stroke={C.ink} strokeWidth={3} />
              <path d="M374 19 L392 28 L374 37 Z" fill={C.ink} />
              <text x={0} y={104} fontFamily={SERIF} fontSize={30} fill={C.textSoft}>
                the width of a pencil
              </text>
            </g>

            {/* cota del hueco */}
            <g>
              <line x1={150} y1={188} x2={150} y2={244} stroke={C.accent} strokeWidth={5} />
              <line x1={128} y1={188} x2={172} y2={188} stroke={C.accent} strokeWidth={5} />
              <line x1={128} y1={244} x2={172} y2={244} stroke={C.accent} strokeWidth={5} />
              <text x={196} y={232} fontFamily={SERIF} fontSize={44} fill={C.accent}>
                1/4 in.
              </text>
            </g>
          </>
        ) : (
          <>
            {/* tres tramas comparadas: 1/4 galvanizada · 1/2 · mosquitera */}
            {[
              { x: 60, step: 74, label: "1/4 in. galvanized", ok: true },
              { x: 450, step: 132, label: "1/2 in. mesh", ok: false },
              { x: 840, step: 26, label: "window screen", ok: false },
            ].map((m, k) => (
              <g key={k}>
                <rect x={m.x} y={30} width={300} height={240} fill="#F3ECD8" stroke={C.ink} strokeWidth={3.5} />
                {Array.from({ length: Math.ceil(300 / m.step) + 1 }, (_, i) => (
                  <line
                    key={`v${i}`}
                    x1={m.x + i * m.step}
                    y1={30}
                    x2={m.x + i * m.step}
                    y2={270}
                    stroke={C.ink}
                    strokeWidth={2.2}
                    opacity={0.7}
                  />
                ))}
                {Array.from({ length: Math.ceil(240 / m.step) + 1 }, (_, i) => (
                  <line
                    key={`h${i}`}
                    x1={m.x}
                    y1={30 + i * m.step}
                    x2={m.x + 300}
                    y2={30 + i * m.step}
                    stroke={C.ink}
                    strokeWidth={2.2}
                    opacity={0.7}
                  />
                ))}
                <text
                  x={m.x + 150}
                  y={310}
                  fontFamily={SERIF}
                  fontSize={28}
                  fill={C.ink}
                  textAnchor="middle"
                >
                  {m.label}
                </text>
                <text
                  x={m.x + 150}
                  y={358}
                  fontFamily={SERIF}
                  fontSize={32}
                  fill={m.ok ? C.good : C.danger}
                  textAnchor="middle"
                  opacity={fadeAt(frame, 34 + k * 12, 20)}
                >
                  {m.ok ? "HOLDS" : "A DOOR"}
                </text>
              </g>
            ))}
          </>
        )}
      </svg>
    </Sheet>
  );
};

// ── EntryPointMap ───────────────────────────────────────────────────────────
// El corte de la casa con los OCHO puntos. `active` 0 = todos tenues (mapa
// general); 1..8 = ese punto encendido y numerado.
const POINTS: { n: number; x: number; y: number; label: string }[] = [
  { n: 1, x: 300, y: 300, label: "sill plate seam" },
  { n: 2, x: 470, y: 330, label: "pipe & wire" },
  { n: 3, x: 880, y: 372, label: "garage door corners" },
  { n: 4, x: 210, y: 352, label: "foundation vents" },
  { n: 5, x: 620, y: 352, label: "weep holes" },
  { n: 6, x: 760, y: 250, label: "under the siding" },
  { n: 7, x: 560, y: 118, label: "soffit & gable" },
  { n: 8, x: 380, y: 402, label: "utility trench" },
];

export const EntryPointMap: React.FC<{
  durationInFrames: number;
  active?: number;
  title?: string;
  caption?: string;
}> = ({ durationInFrames, active = 0, title = "", caption = "" }) => {
  const f = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin((f / 30) * Math.PI * 1.6);

  return (
    <Sheet durationInFrames={durationInFrames} title={title} caption={caption}>
      <svg viewBox="0 0 1200 470" style={{ width: "100%", height: "100%" }}>
        {/* terreno */}
        <rect x={0} y={392} width={1200} height={78} fill={C.bg2} opacity={0.85} />
        <line x1={0} y1={392} x2={1200} y2={392} stroke={C.ink} strokeWidth={3} opacity={0.6} />

        {/* cuerpo de la casa */}
        <path d="M180 392 L180 210 L560 62 L940 210 L940 392 Z" fill="#F3ECD8" stroke={C.ink} strokeWidth={4} />
        {/* techo */}
        <path d="M150 222 L560 62 L970 222" fill="none" stroke={C.ink} strokeWidth={5} />
        {/* cimiento */}
        <rect x={180} y={330} width={760} height={62} fill={C.bg2} stroke={C.ink} strokeWidth={4} />
        {/* piso alto */}
        <line x1={180} y1={252} x2={940} y2={252} stroke={C.ink} strokeWidth={2.5} opacity={0.55} />
        {/* garaje anexo */}
        <rect x={940} y={286} width={210} height={106} fill="#F3ECD8" stroke={C.ink} strokeWidth={4} />
        <rect x={962} y={318} width={166} height={74} fill={C.bg2} stroke={C.ink} strokeWidth={3} />
        {/* zanja de servicios */}
        <path d="M180 402 Q 300 424 380 402" fill="none" stroke={C.ink} strokeWidth={3} strokeDasharray="10 8" opacity={0.7} />

        {POINTS.map((pt) => {
          const on = active === pt.n;
          const dim = active !== 0 && !on;
          const r = on ? 26 + pulse * 6 : 15;
          return (
            <g key={pt.n} opacity={dim ? 0.24 : 1}>
              {on ? (
                <circle cx={pt.x} cy={pt.y} r={r + 16} fill={C.accent} opacity={0.16 + pulse * 0.12} />
              ) : null}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={r}
                fill={on ? C.accent : C.surfaceStrong}
                stroke={C.ink}
                strokeWidth={3.5}
              />
              <text
                x={pt.x}
                y={pt.y + (on ? 11 : 7)}
                fontFamily={SERIF}
                fontSize={on ? 32 : 20}
                fill={on ? C.onAccent : C.ink}
                textAnchor="middle"
              >
                {pt.n}
              </text>
              {on ? (
                <text
                  x={pt.x}
                  y={pt.y - r - 22}
                  fontFamily={SERIF}
                  fontSize={30}
                  fill={C.ink}
                  textAnchor="middle"
                >
                  {pt.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </Sheet>
  );
};

// ── HuntTool ────────────────────────────────────────────────────────────────
export const HuntTool: React.FC<{
  durationInFrames: number;
  mode?: "rake" | "smudge" | "flour";
  title?: string;
  caption?: string;
}> = ({ durationInFrames, mode = "rake", title = "", caption = "" }) => {
  const p = useRun(24, 70);

  return (
    <Sheet durationInFrames={durationInFrames} title={title} caption={caption}>
      <svg viewBox="0 0 1200 430" style={{ width: "100%", height: "100%" }}>
        {/* pared y piso, comunes a los tres modos */}
        <rect x={0} y={40} width={1200} height={286} fill="#F3ECD8" stroke={C.ink} strokeWidth={3.5} />
        <rect x={0} y={326} width={1200} height={104} fill={C.bg2} stroke={C.ink} strokeWidth={3.5} />
        {/* el hueco que hay que encontrar */}
        <rect x={742} y={300} width={92} height={26} fill="#241C12" />

        {mode === "rake" ? (
          <>
            {/* haz de luz casi paralelo al piso */}
            <g opacity={0.9}>
              <path
                d={`M120 312 L ${240 + p * 900} 288 L ${240 + p * 900} 330 L120 322 Z`}
                fill={C.gold}
                opacity={0.32}
              />
              <circle cx={112} cy={317} r={20} fill={C.ink} />
            </g>
            {/* la sombra larga que delata el hueco */}
            <rect
              x={834}
              y={300}
              width={p > 0.62 ? 172 : 0}
              height={26}
              fill={C.ink}
              opacity={0.72}
            />
            <text x={120} y={392} fontFamily={SERIF} fontSize={30} fill={C.textSoft}>
              beam laid flat — almost parallel
            </text>
          </>
        ) : mode === "smudge" ? (
          <>
            {/* la mancha grasosa a lo largo del rodapié */}
            <path
              d={`M${742 - p * 620} 306 L742 306 L742 322 L${742 - p * 620} 322 Z`}
              fill="#3A2C18"
              opacity={0.8}
            />
            <ellipse cx={716} cy={314} rx={54} ry={17} fill="#241C12" opacity={0.85} />
            <text x={120} y={392} fontFamily={SERIF} fontSize={30} fill={C.textSoft}>
              the same route, every night, along the same wall
            </text>
          </>
        ) : (
          <>
            {/* la línea de harina y las huellas que la cruzan */}
            <rect x={120} y={334} width={960} height={20} fill="#F7F2E2" stroke={C.line} strokeWidth={2} />
            {Array.from({ length: 14 }, (_, i) => {
              const x = 800 - i * 46;
              const show = p > i / 16;
              return show ? (
                <g key={i} opacity={0.9}>
                  <ellipse cx={x} cy={338 + (i % 2 ? -6 : 8)} rx={7} ry={5} fill="#5C4526" />
                  <ellipse cx={x - 16} cy={344 + (i % 2 ? 6 : -8)} rx={6} ry={4} fill="#5C4526" />
                </g>
              ) : null;
            })}
            {/* la raya de la cola */}
            <path
              d={`M800 344 q -${p * 340} 8 -${p * 660} 2`}
              fill="none"
              stroke="#5C4526"
              strokeWidth={3}
              opacity={0.7}
            />
            <text x={120} y={400} fontFamily={SERIF} fontSize={30} fill={C.textSoft}>
              tracks, and a tail line
            </text>
          </>
        )}
      </svg>
    </Sheet>
  );
};

// ── PackLayers ──────────────────────────────────────────────────────────────
// El agujero armándose por capas. step 0 = los cuatro títulos; 1 = limpio;
// 2 = cobre empacado; 3 = tapa de mortero.
export const PackLayers: React.FC<{
  durationInFrames: number;
  step?: number;
  title?: string;
  caption?: string;
}> = ({ durationInFrames, step = 0, title = "", caption = "" }) => {
  const p = useRun(26, 56);
  const STEPS = ["CLEAN", "PACK", "CAP", "FASTEN"];

  return (
    <Sheet durationInFrames={durationInFrames} title={title} caption={caption}>
      <svg viewBox="0 0 1200 430" style={{ width: "100%", height: "100%" }}>
        {/* corte del muro */}
        <rect x={80} y={40} width={1040} height={300} fill={C.bg2} stroke={C.ink} strokeWidth={4} />
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={i}
            x1={80}
            y1={40 + i * 60}
            x2={1120}
            y2={40 + i * 60}
            stroke={C.ink}
            strokeWidth={2}
            opacity={0.28}
          />
        ))}
        {/* la cavidad */}
        <rect x={430} y={116} width={340} height={148} fill="#241C12" />

        {/* paso 1 — limpia: los restos salen */}
        {step >= 1 ? (
          <g opacity={step === 1 ? 1 : 0.55}>
            <rect
              x={430}
              y={116}
              width={340}
              height={148}
              fill="#241C12"
              stroke={C.accentSoft}
              strokeWidth={4}
            />
            {step === 1
              ? Array.from({ length: 7 }, (_, i) => (
                  <circle
                    key={i}
                    cx={470 + i * 46}
                    cy={200 + Math.sin(i) * 26 + p * 150}
                    r={11 - i * 0.6}
                    fill="#7A6440"
                    opacity={1 - p}
                  />
                ))
              : null}
          </g>
        ) : null}

        {/* paso 2 — cobre empacado en toda la profundidad */}
        {step >= 2 ? (
          <g>
            {Array.from({ length: 9 }, (_, r) =>
              Array.from({ length: 18 }, (_, c) => (
                <circle
                  key={`${r}-${c}`}
                  cx={442 + c * 19}
                  cy={128 + r * 17}
                  r={8}
                  fill={C.accentSoft}
                  stroke={C.accent}
                  strokeWidth={1.6}
                  opacity={step === 2 ? Math.min(1, Math.max(0, p * 14 - (r * 18 + c) / 22)) : 0.9}
                />
              ))
            )}
          </g>
        ) : null}

        {/* paso 3 — tapa de mortero sobre la cara */}
        {step >= 3 ? (
          <rect
            x={424}
            y={110}
            width={352}
            height={step === 3 ? 30 + p * 26 : 56}
            fill={C.bg1}
            stroke={C.ink}
            strokeWidth={3.5}
          />
        ) : null}

        {/* la banda de pasos abajo */}
        {STEPS.map((s, i) => {
          const on = step === 0 || step === i + 1;
          return (
            <g key={s} opacity={on ? 1 : 0.3}>
              <rect
                x={110 + i * 252}
                y={362}
                width={228}
                height={54}
                rx={4}
                fill={step === i + 1 ? C.accent : C.surfaceStrong}
                stroke={C.ink}
                strokeWidth={3}
              />
              <text
                x={224 + i * 252}
                y={399}
                fontFamily={SERIF}
                fontSize={30}
                fill={step === i + 1 ? C.onAccent : C.ink}
                textAnchor="middle"
              >
                {s}
              </text>
            </g>
          );
        })}
      </svg>
    </Sheet>
  );
};

// ── MetalVsWool ─────────────────────────────────────────────────────────────
// El split del enemigo: dos hojas de papel con profundidad, una a cada lado.
export type VsSide = { tag?: string; price?: string; lines?: string[] };

export const MetalVsWool: React.FC<{
  durationInFrames: number;
  title?: string;
  left?: VsSide;
  right?: VsSide;
}> = ({ durationInFrames, title = "", left = {}, right = {} }) => {
  const inP = useFade(0, 26);
  const outP = useOut(durationInFrames);
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, durationInFrames], [0, 8], { extrapolateRight: "clamp" });

  const Col: React.FC<{ side: VsSide; at: number; accent: string; dir: number }> = ({
    side,
    at,
    accent,
    dir,
  }) => {
    const p = fadeAt(f, at, 24);
    return (
      <div
        style={{
          flex: 1,
          opacity: p,
          transform: `translateX(${(1 - p) * 22 * dir}px) translateY(${-drift * 0.4}px)`,
        }}
      >
        <AgedPaper seed={at} deckle={1} style={{ width: "100%", height: "100%" }}>
          <div
            style={{
              position: "relative",
              height: "100%",
              padding: "44px 46px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 40,
                letterSpacing: 1.4,
                color: accent,
                lineHeight: 1.1,
              }}
            >
              {side.tag ?? ""}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 27, color: C.textSoft, marginTop: 8 }}>
              {side.price ?? ""}
            </div>
            <div style={{ height: 2, background: C.line, margin: "22px 0 24px" }} />
            {(side.lines ?? []).map((l, i) => (
              <div
                key={i}
                style={{
                  fontFamily: SERIF,
                  fontSize: 29,
                  lineHeight: 1.36,
                  color: C.ink,
                  marginBottom: 18,
                  opacity: fadeAt(f, at + 12 + i * 9, 18),
                  display: "flex",
                  gap: 14,
                }}
              >
                <span style={{ color: accent }}>—</span>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </AgedPaper>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: Math.min(inP, outP) }}>
      <AbsoluteFill style={{ background: C.bg1 }} />
      <AbsoluteFill style={{ padding: "56px 84px", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 44,
            letterSpacing: 1.6,
            color: C.ink,
            textAlign: "center",
            marginBottom: 26,
          }}
        >
          {title}
        </div>
        <div style={{ flex: 1, display: "flex", gap: 42 }}>
          <Col side={left} at={10} accent={C.accent2} dir={-1} />
          <Col side={right} at={22} accent={C.danger} dir={1} />
        </div>
      </AbsoluteFill>
      <FilmWear strength={0.8} />
    </AbsoluteFill>
  );
};
