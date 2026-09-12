import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import {
  rand,
  wobble,
  PaperGrain,
  GodRays,
  ParticleField,
  WaxSeal,
  DepthShadow,
  InkDraw,
  SvgFilters,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// PxSevenSeal — PIEZA ÚNICA para el CIERRE del video de AGUA OXIGENADA.
// Momento exacto: recap de LOS 7 trucos. Los 7 aparecen como entradas LACRADAS
// (WaxSeal) en una página de almanaque; al final la página se DA VUELTA como un
// libro que se cierra (page-turn 3D con Frame3D-style rotateY sobre bisagra
// izquierda), dejando la tapa de cuero del almanaque cerrada con un lacre grande.
//
// Etapas (todas derivadas de useCurrentFrame — RENDER-SAFE, sin Date/Math.random):
//   1. Entrada de la página abierta (parchment) + título con InkDraw subrayado.
//   2. Los 7 renglones se escriben (InkDraw) y se estampan sus lacres uno a uno.
//   3. Clímax: la página se pliega sobre la bisagra izquierda (page-turn 3D),
//      revela la contratapa/tapa de cuero y se estampa el LACRE MAESTRO.
//   4. Idle: brasas + polvo suben, god-rays respiran, grano de papel vivo.
//
// Esquina inf-derecha LIBRE para el avatar PiP: la lista ocupa columna izq-centro
// y el turn pivota hacia la izquierda, así que el frente cerrado deja esa esquina
// despejada.
// ═══════════════════════════════════════════════════════════════════════════

const PARCH = COLORS.bg0; // pergamino claro
const PARCH2 = COLORS.bg2; // papel envejecido
const LEATHER = "#463122"; // cuero de tapa
const LEATHER_HI = "#5c4230";
const INK = COLORS.ink;
const AMBER = COLORS.amber;
const SAGE = COLORS.accent;
const OXY = COLORS.danger;

// Paleta determinística de lacres — alterna sepia / sage / terracota por índice.
const sealColor = (i: number): string => {
  const pal = [OXY, AMBER, SAGE, COLORS.cold, AMBER, SAGE, OXY];
  return pal[i % pal.length];
};

export const PxSevenSeal: React.FC<{
  durationInFrames: number;
  items?: string[];
  title?: string;
  kicker?: string;
}> = ({
  durationInFrames,
  items,
  title = "Los 7 secretos",
  kicker = "Agua oxigenada en la huerta",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const list =
    items && items.length
      ? items.slice(0, 7)
      : [
          "Semillas que germinan más rápido",
          "Raíces que respiran mejor",
          "Adiós al moho de la tierra",
          "Pulgones y plagas a raya",
          "Herramientas desinfectadas",
          "Agua de riego más limpia",
          "Rebrote de plantas cansadas",
        ];
  const N = Math.min(7, Math.max(1, list.length));

  // ── línea de tiempo (en frames) ────────────────────────────────────────────
  const enterEnd = sec(0.8);
  const rowStart = sec(1.0);
  const rowStep = sec(0.42); // cadencia de aparición de cada renglón/lacre
  const lastRow = rowStart + (N - 1) * rowStep;
  // el page-turn arranca poco después del último sello (con margen mínimo)
  const turnStart = Math.max(lastRow + sec(1.1), durationInFrames - sec(3.4));
  const turnDur = sec(1.9);
  const masterAt = turnStart + Math.round(turnDur * 0.62);

  // ── entrada global de la página ──────────────────────────────────────────────
  const enter = spring({
    frame,
    fps,
    config: { damping: 200, mass: 1, stiffness: 60 },
    durationInFrames: enterEnd,
  });

  // ── page-turn: 0 (abierta) → 1 (cerrada sobre bisagra izquierda) ─────────────
  const turn = spring({
    frame: frame - turnStart,
    fps,
    config: { damping: 16, mass: 1.05, stiffness: 90 },
  });
  const turnAngle = interpolate(turn, [0, 1], [0, -178]); // grados rotateY
  const pageVisible = turn < 0.985;
  // sombra de pliegue que barre la página mientras gira
  const foldShade = interpolate(turn, [0, 0.5, 1], [0, 0.55, 0.12]);
  // el contenido de la lista se apaga al pasar los 90°
  const listFade = interpolate(turn, [0.42, 0.6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // respiración idle sutil de toda la escena
  const idle = 1 + Math.sin(frame / 46) * 0.006;

  // geometría del "libro" (en coords de pantalla, no SVG)
  const bookW = 1180;
  const bookH = 760;

  // ── un renglón lacrado ───────────────────────────────────────────────────────
  const Row: React.FC<{ i: number }> = ({ i }) => {
    const at = rowStart + i * rowStep;
    const s = spring({
      frame: frame - at,
      fps,
      config: { damping: 20, mass: 0.8, stiffness: 120 },
    });
    if (s <= 0.001) return null;
    const rowH = 82;
    const drift = wobble(i, frame, 0.5) * 1.2; // micro-vida del renglón
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          height: rowH,
          opacity: s,
          transform: `translateX(${(1 - s) * -60}px) translateY(${drift}px)`,
        }}
      >
        {/* lacre pequeño con el número grabado */}
        <div style={{ width: 86, flex: "0 0 86px", display: "flex", justifyContent: "center" }}>
          <WaxSeal at={at + 4} size={78} color={sealColor(i)} initials={String(i + 1)} />
        </div>
        {/* texto del truco sobre reglón punteado */}
        <div style={{ position: "relative", flex: 1, paddingBottom: 6 }}>
          <div
            style={{
              fontFamily: FONT_STACK,
              fontSize: 40,
              fontWeight: 800,
              color: INK,
              lineHeight: 1.12,
              textShadow: "0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            {list[i]}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: interpolate(s, [0, 1], [420, 0]),
              bottom: 0,
              height: 2,
              background:
                "repeating-linear-gradient(90deg, rgba(42,38,32,0.34) 0 10px, transparent 10px 22px)",
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: LEATHER, fontFamily: FONT_STACK }}>
      <SvgFilters prefix="pxs" />

      {/* ── FONDO: mesa de cuero + viñeta cálida ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(1300px 900px at 46% 40%, ${LEATHER_HI} 0%, ${LEATHER} 58%, #2c1d13 100%)`,
        }}
      />
      {/* god-rays de taller cayendo (lejos de la esquina inf-der) */}
      <GodRays x={30} y={-14} angle={20} color="rgba(201,153,94,0.20)" intensity={1} rays={7} />

      {/* ── EL LIBRO ── centrado-izquierda, perspectiva real ── */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            width: bookW,
            height: bookH,
            marginRight: 220, // deja la esquina inf-der para el PiP
            perspective: 2000,
            transform: `scale(${(0.9 + enter * 0.1) * idle})`,
            opacity: enter,
          }}
        >
          {/* ── TAPA DE CUERO (debajo): se revela cuando la página se pliega ── */}
          <DepthShadow
            layers={6}
            distance={54}
            color="rgba(0,0,0,0.5)"
            radius={16}
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(150deg, ${LEATHER_HI} 0%, ${LEATHER} 55%, #33241a 100%)`,
              border: "3px solid rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}
          >
            {/* marco grabado en la tapa */}
            <div
              style={{
                position: "absolute",
                inset: 34,
                border: "2px solid rgba(201,153,94,0.4)",
                borderRadius: 8,
                boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 46,
                border: "1px solid rgba(201,153,94,0.22)",
                borderRadius: 6,
              }}
            />
            {/* título grabado en oro en la tapa (aparece con el cierre) */}
            <div
              style={{
                position: "absolute",
                top: 96,
                left: 0,
                right: 0,
                textAlign: "center",
                color: "#c9995e",
                opacity: interpolate(turn, [0.55, 0.9], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                textShadow: "0 2px 3px rgba(0,0,0,0.6)",
              }}
            >
              <div style={{ fontSize: 30, letterSpacing: 6, fontWeight: 700, opacity: 0.85 }}>
                {kicker.toUpperCase()}
              </div>
              <div style={{ fontSize: 82, fontWeight: 900, marginTop: 8, lineHeight: 1 }}>
                {title}
              </div>
            </div>
            {/* grano/relieve del cuero */}
            <PaperGrain opacity={0.18} scale={0.7} seed={12} blend="overlay" />
          </DepthShadow>

          {/* LACRE MAESTRO grande sobre la tapa cerrada (centro-bajo, no en la esquina) */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 118,
              transform: "translateX(-50%)",
              opacity: interpolate(turn, [0.6, 0.95], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              zIndex: 5,
            }}
          >
            <WaxSeal at={masterAt} size={172} color={OXY} initials="H₂O₂" />
          </div>

          {/* ── LA PÁGINA (encima): pergamino con los 7 · pivota sobre bisagra izq ── */}
          {pageVisible && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
                transform: `rotateY(${turnAngle}deg)`,
                borderRadius: 16,
                backfaceVisibility: "hidden",
                boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
                overflow: "hidden",
                background: `linear-gradient(135deg, ${PARCH} 0%, ${PARCH2} 100%)`,
              }}
            >
              {/* borde interno del papel */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  border: "3px solid rgba(42,38,32,0.14)",
                  boxShadow: "inset 0 0 60px rgba(122,90,54,0.18)",
                }}
              />
              {/* lomo/gutter oscuro a la izquierda (bisagra del libro) */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 60,
                  background:
                    "linear-gradient(90deg, rgba(42,38,32,0.32), rgba(42,38,32,0))",
                }}
              />

              {/* CABECERA de la página: kicker + título con subrayado a pluma */}
              <div
                style={{
                  position: "absolute",
                  top: 44,
                  left: 96,
                  right: 70,
                  opacity: listFade,
                }}
              >
                <div
                  style={{
                    fontSize: 26,
                    letterSpacing: 4,
                    color: AMBER,
                    fontWeight: 700,
                    opacity: interpolate(enter, [0.4, 1], [0, 1]),
                  }}
                >
                  {kicker.toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: 66,
                    fontWeight: 900,
                    color: INK,
                    lineHeight: 1.05,
                    marginTop: 4,
                    transform: `translateY(${(1 - enter) * 14}px)`,
                    opacity: enter,
                  }}
                >
                  {title}
                </div>
                {/* subrayado dibujado a pluma bajo el título */}
                <svg
                  viewBox="0 0 900 40"
                  width="72%"
                  height={34}
                  style={{ display: "block", marginTop: 2, overflow: "visible" }}
                >
                  <InkDraw
                    d="M 6 22 C 180 8, 420 34, 690 16 C 780 10, 850 20, 892 14"
                    at={enterEnd}
                    duration={sec(0.7)}
                    color={OXY}
                    width={7}
                    length={940}
                    dropShadow
                  />
                </svg>
              </div>

              {/* LISTA de los 7 renglones lacrados */}
              <div
                style={{
                  position: "absolute",
                  top: 214,
                  left: 84,
                  right: 70,
                  bottom: 54,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  opacity: listFade,
                }}
              >
                {Array.from({ length: N }, (_, i) => (
                  <Row key={i} i={i} />
                ))}
              </div>

              {/* sombra de pliegue que barre la página al girar (gradiente vivo) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background: `linear-gradient(90deg, rgba(0,0,0,${foldShade}) 0%, rgba(0,0,0,0) 34%, rgba(0,0,0,0) 66%, rgba(0,0,0,${foldShade * 0.7}) 100%)`,
                }}
              />
              {/* grano de papel vivo */}
              <PaperGrain opacity={0.13} scale={0.9} seed={7} blend="multiply" />
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* ── ATMÓSFERA delante: brasas (O₂/calor) suben + polvo cálido flota ── */}
      <ParticleField count={16} kind="embers" rise drift={26} width={1920} height={1080} opacity={0.5} />
      <ParticleField count={20} kind="dust" rise={false} drift={30} width={1920} height={1080} opacity={0.35} />
      {/* chispa de "estampado" cuando cae el lacre maestro: burbujas de O₂ brotan */}
      {frame >= masterAt && frame < masterAt + sec(1.6) && (
        <MasterBurst at={masterAt} />
      )}

      {/* viñeta general para foco + grano global del cuero */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(1200px 900px at 46% 42%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.42) 100%)",
        }}
      />
      <PaperGrain opacity={0.08} scale={0.6} seed={21} blend="overlay" />
    </AbsoluteFill>
  );
};

// Estallido de burbujas de O₂ al estampar el lacre maestro (determinístico por índice).
const MasterBurst: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const span = sec(1.6);
  const p = interpolate(t, [0, span], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // centro aprox. del lacre maestro en la pantalla (libro centrado con marginRight)
  const cx = 960 - 110 - 60; // desplazado a la izq por el marginRight del libro
  const cy = 1080 - 118 - 86 - 60;
  const O2 = COLORS.cold;
  return (
    <svg
      viewBox="0 0 1920 1080"
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {Array.from({ length: 18 }, (_, i) => {
        const ang = (i / 18) * Math.PI * 2 + rand(i) * 0.6;
        const dist = (60 + rand(i, 2) * 220) * p;
        const bx = cx + Math.cos(ang) * dist + wobble(i, frame, 1.4) * 8;
        const by = cy + Math.sin(ang) * dist - p * (120 + rand(i, 3) * 120);
        const br = 6 + rand(i, 4) * 14;
        const op = Math.sin(p * Math.PI) * (0.4 + rand(i, 5) * 0.4);
        return (
          <g key={i} opacity={op}>
            <circle cx={bx} cy={by} r={br} fill={O2} opacity={0.5} />
            <circle cx={bx} cy={by} r={br} fill="none" stroke={O2} strokeWidth={2.5} />
            <ellipse cx={bx - br * 0.3} cy={by - br * 0.3} rx={br * 0.35} ry={br * 0.25} fill="#fff" opacity={0.55} />
          </g>
        );
      })}
    </svg>
  );
};

export default PxSevenSeal;
