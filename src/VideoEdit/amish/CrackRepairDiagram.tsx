import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { THEME_AMISH, type Theme, useTheme } from "../kit/premium/theme";
import { AgedPaper, FilmWear } from "./AmishKit";

// ═══════════════════════════════════════════════════════════════════════════
// CrackRepairDiagram — el componente de MECANISMO del video `crackpowder`.
//
// Por qué existe: la regla 9 del pipeline pide pizarra/diagrama en los beats de
// mecanismo, y el kit amish no tenía ninguno que explicara un CORTE de losa. Los
// dos candidatos del kit (SafetyGrid / SelectiveCompare de TermiteKit) sólo
// aceptan `eyebrow`: su contenido está quemado al video de termitas.
//
// Es UN escenario compartido —el corte transversal de la losa, dibujado a mano
// sobre papel— con una capa distinta por `mode`. Así los nueve momentos de
// mecanismo del video se sienten del mismo cuaderno y no nueve gráficos sueltos.
//
// Lenguaje del canal (ver AmishKit): entradas por FADE largo (22-30f), nunca
// springs; tinta y terracota; cero brillo especular; FilmWear encima de todo.
// ═══════════════════════════════════════════════════════════════════════════

export type CrackMode =
  | "hydration"   // los granos toman el agua y crecen cristales que traban
  | "healing"     // autogenous healing: la grieta se cierra sola
  | "straw"       // la capilar bebe agua y el hielo hace palanca
  | "sweep"       // barrer CRUZADO mete el polvo en la grieta
  | "undercut"    // el corte en cola de milano que atrapa el parche
  | "balltest"    // el test del puño
  | "voids"       // el agua de más deja túneles
  | "drypack"     // llenado por capas apisonadas
  | "ssd"         // saturated surface dry: la losa llena no roba agua
  | "recipe"      // concreto = piedra + arena + cemento + agua
  | "ratio"       // 1 : 2.5
  | "bondcoat"    // lechada forzada en los poros
  | "settlement"  // un lado baja: problema de suelo
  | "horizontal"; // grieta horizontal = empuje desde afuera

const INK = "#2a2620";
const TERRA = "#a8552f";
const RUST = "#8c3b1e";
const WATER = "#3f6b7d";

/** fade largo y parejo — la entrada canónica del canal */
const useFade = (at: number, dur = 26) => {
  const f = useCurrentFrame();
  return interpolate(f - at, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};
/** progreso 0→1 de la animación del mecanismo (empieza después del título) */
const useRun = (at: number, dur: number) => {
  const f = useCurrentFrame();
  return interpolate(f - at, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
};
const rnd = (i: number, salt = 0) => (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

/** trama de hormigón: áridos dibujados a mano dentro del corte */
const Aggregate: React.FC<{ x: number; y: number; w: number; h: number; seed?: number; op?: number }> = ({
  x, y, w, h, seed = 0, op = 0.5,
}) => (
  <g opacity={op}>
    {Array.from({ length: 46 }).map((_, i) => {
      const cx = x + rnd(i, seed) * w;
      const cy = y + rnd(i, seed + 7) * h;
      const r = 5 + rnd(i, seed + 3) * 11;
      return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={1.6} opacity={0.45} />;
    })}
  </g>
);

/** el bloque de losa en corte, con su cara superior */
const Slab: React.FC<{ tone?: string }> = ({ tone = "#cdc3b1" }) => (
  <>
    <rect x={80} y={150} width={1040} height={300} fill={tone} stroke={INK} strokeWidth={3} />
    <line x1={80} y1={150} x2={1120} y2={150} stroke={INK} strokeWidth={5} />
    <Aggregate x={90} y={160} w={1020} h={280} />
  </>
);

const Label: React.FC<{ x: number; y: number; text: string; anchor?: "start" | "middle" | "end"; color?: string; size?: number }> = ({
  x, y, text, anchor = "middle", color = INK, size = 26,
}) => (
  <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size} fontFamily="Georgia, 'EB Garamond', serif" fontStyle="italic">
    {text}
  </text>
);

// ── las capas por modo ──────────────────────────────────────────────────────
const Scene: React.FC<{ mode: CrackMode; p: number }> = ({ mode, p }) => {
  switch (mode) {
    // el agua entra y los granos crecen hasta trabarse
    case "hydration":
    case "healing": {
      const grow = p;
      const healed = mode === "healing" ? p : 0;
      return (
        <>
          <Slab />
          {/* la grieta: dos caras que se acercan al curar */}
          <path d={`M600 150 L${592 + healed * 6} 300 L${596 + healed * 4} 450`} stroke={INK} strokeWidth={4} fill="none" />
          <path d={`M600 150 L${614 - healed * 6} 300 L${610 - healed * 4} 450`} stroke={INK} strokeWidth={4} fill="none" />
          {/* cristales creciendo desde las dos paredes */}
          {Array.from({ length: 14 }).map((_, i) => {
            const y = 170 + i * 20;
            const len = grow * (14 + rnd(i, 2) * 26);
            return (
              <g key={i} opacity={grow}>
                <line x1={594} y1={y} x2={594 + len} y2={y + (rnd(i, 4) - 0.5) * 10} stroke={TERRA} strokeWidth={2.4} />
                <line x1={612} y1={y} x2={612 - len} y2={y + (rnd(i, 5) - 0.5) * 10} stroke={TERRA} strokeWidth={2.4} />
              </g>
            );
          })}
          {/* gotas de agua bajando por la grieta */}
          {Array.from({ length: 5 }).map((_, i) => {
            const t = (p * 1.6 + i * 0.2) % 1;
            return <circle key={i} cx={603} cy={150 + t * 290} r={5} fill={WATER} opacity={(1 - t) * 0.8} />;
          })}
          <Label x={603} y={110} text={mode === "healing" ? "the crack closes itself" : "crystals knit and lock"} color={TERRA} />
        </>
      );
    }
    // la capilar bebe y el hielo hace palanca
    case "straw": {
      const ice = p;
      return (
        <>
          <Slab />
          <path d={`M600 150 L${600 - ice * 10} 450`} stroke={INK} strokeWidth={3 + ice * 8} fill="none" />
          <path d={`M600 150 L${600 + ice * 10} 450`} stroke={INK} strokeWidth={3 + ice * 8} fill="none" />
          <rect x={600 - ice * 12} y={150} width={ice * 24} height={300} fill="#bcd6de" opacity={ice * 0.75} />
          {Array.from({ length: 6 }).map((_, i) => {
            const t = (p * 1.4 + i * 0.16) % 1;
            return <circle key={i} cx={601} cy={140 + t * 300} r={6} fill={WATER} opacity={(1 - t) * 0.85} />;
          })}
          {/* la palanca: la cara se abre hacia arriba */}
          <path d={`M300 150 L560 ${150 - ice * 14}`} stroke={RUST} strokeWidth={4} fill="none" opacity={ice} />
          <path d={`M900 150 L644 ${150 - ice * 14}`} stroke={RUST} strokeWidth={4} fill="none" opacity={ice} />
          <Label x={600} y={110} text="water · then ice · then leverage" color={RUST} />
        </>
      );
    }
    // barrer cruzado empuja el polvo adentro
    case "sweep": {
      const x = 200 + p * 780;
      return (
        <>
          <Slab />
          <path d="M600 150 L600 330" stroke={INK} strokeWidth={9} fill="none" />
          <rect x={600 - 5} y={150} width={10} height={p * 175} fill={TERRA} opacity={0.9} />
          {/* cerdas cruzando la línea */}
          <g transform={`translate(${x} 0)`}>
            <rect x={-70} y={54} width={140} height={30} fill={INK} opacity={0.85} />
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={i} x1={-66 + i * 9} y1={84} x2={-66 + i * 9} y2={144} stroke={INK} strokeWidth={2.4} />
            ))}
          </g>
          <Label x={600} y={505} text="across the line — not along it" color={TERRA} />
        </>
      );
    }
    // el corte en cola de milano
    case "undercut": {
      const cut = p;
      const topHalf = 26 * cut;
      const botHalf = 62 * cut;
      return (
        <>
          <Slab />
          <path
            d={`M${600 - topHalf} 150 L${600 - botHalf} ${150 + 150 * cut} L${600 + botHalf} ${150 + 150 * cut} L${600 + topHalf} 150 Z`}
            fill="#efe7d8"
            stroke={RUST}
            strokeWidth={4}
          />
          <g opacity={cut}>
            <line x1={600 - topHalf} y1={126} x2={600 + topHalf} y2={126} stroke={TERRA} strokeWidth={3} />
            <Label x={600} y={112} text="narrow at the top" color={TERRA} size={23} />
            <line x1={600 - botHalf} y1={318} x2={600 + botHalf} y2={318} stroke={TERRA} strokeWidth={3} />
            <Label x={600} y={352} text="wider at the bottom — it cannot lift out" color={TERRA} size={23} />
          </g>
        </>
      );
    }
    // el test del puño
    case "balltest": {
      const split = p;
      return (
        <>
          <circle cx={600} cy={300} r={120} fill="#b9ad97" stroke={INK} strokeWidth={3} opacity={1 - split * 0.1} />
          <g transform={`translate(${-split * 120} 0)`}>
            <path d="M600 180 A120 120 0 0 0 600 420 L600 300 Z" fill="#b9ad97" stroke={INK} strokeWidth={3} />
          </g>
          <g transform={`translate(${split * 120} 0)`}>
            <path d="M600 180 A120 120 0 0 1 600 420 L600 300 Z" fill="#b9ad97" stroke={INK} strokeWidth={3} />
          </g>
          <g opacity={split}>
            <Label x={600} y={150} text="breaks clean" color={TERRA} />
            <Label x={600} y={470} text="neither half crumbles · no water on your palm" color={INK} size={23} />
          </g>
        </>
      );
    }
    // el agua de más deja túneles
    case "voids": {
      const v = p;
      return (
        <>
          <Slab tone="#c6bca9" />
          {Array.from({ length: 30 }).map((_, i) => {
            const cx = 140 + rnd(i, 11) * 920;
            const cy = 180 + rnd(i, 12) * 240;
            return <circle key={i} cx={cx} cy={cy} r={4 + rnd(i, 13) * 13} fill="#efe7d8" stroke={RUST} strokeWidth={2} opacity={v} />;
          })}
          <Label x={600} y={110} text="where the water used to be" color={RUST} />
        </>
      );
    }
    // llenado por capas apisonadas
    case "drypack": {
      const layers = 4;
      const filled = Math.min(layers, Math.floor(p * layers + 0.001));
      const partial = p * layers - filled;
      return (
        <>
          <Slab />
          <path d="M556 150 L520 320 L680 320 L644 150 Z" fill="#efe7d8" stroke={RUST} strokeWidth={4} />
          {Array.from({ length: layers }).map((_, i) => {
            const yTop = 320 - (i + 1) * 42;
            const on = i < filled ? 1 : i === filled ? partial : 0;
            return (
              <g key={i} opacity={on}>
                <rect x={524 + i * 9} y={yTop} width={152 - i * 18} height={40} fill="#9c907a" stroke={INK} strokeWidth={2} />
              </g>
            );
          })}
          {/* el pisón bajando */}
          <g opacity={p > 0.1 ? 1 : 0} transform={`translate(0 ${-40 + Math.sin(p * 22) * 14})`}>
            <rect x={588} y={40} width={24} height={92} fill={INK} />
          </g>
          <Label x={600} y={400} text="a quarter inch at a time · tamped hard" color={TERRA} />
        </>
      );
    }
    // saturated surface dry
    case "ssd": {
      const soak = Math.min(1, p * 1.5);
      const wipe = Math.max(0, (p - 0.7) / 0.3);
      return (
        <>
          <Slab tone="#cdc3b1" />
          <rect x={80} y={150} width={1040} height={300} fill={WATER} opacity={soak * 0.42} />
          {/* la película de agua en la CARA, que se retira */}
          <rect x={80 + wipe * 1040} y={140} width={Math.max(0, 1040 - wipe * 1040)} height={14} fill={WATER} opacity={0.9} />
          <g opacity={wipe}>
            <rect x={60 + wipe * 1040} y={104} width={44} height={44} fill={INK} />
            <Label x={600} y={110} text="dry on the face" color={TERRA} />
          </g>
          <Label x={600} y={320} text="saturated on the inside" color="#2f4d5a" size={30} />
          <Label x={600} y={505} text="now it has nothing left to steal from your patch" color={INK} size={23} />
        </>
      );
    }
    // concreto = receta
    case "recipe": {
      const parts = [
        { t: "rock", filler: true },
        { t: "sand", filler: true },
        { t: "cement", filler: false },
        { t: "water", filler: false },
      ];
      return (
        <>
          {parts.map((q, i) => {
            const on = interpolate(p, [i * 0.2, i * 0.2 + 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const x = 210 + i * 260;
            return (
              <g key={i} opacity={on}>
                <circle cx={x} cy={280} r={82} fill={q.filler ? "#c6bca9" : TERRA} stroke={INK} strokeWidth={3} />
                <Label x={x} y={410} text={q.t} size={30} />
                <Label x={x} y={446} text={q.filler ? "filler" : "the glue"} size={21} color={q.filler ? INK : RUST} />
              </g>
            );
          })}
        </>
      );
    }
    // la proporción 1 : 2.5
    case "ratio": {
      const w1 = interpolate(p, [0, 0.5], [0, 200], { extrapolateRight: "clamp" });
      const w2 = interpolate(p, [0.35, 1], [0, 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <>
          <rect x={300} y={190} width={w1} height={92} fill={TERRA} stroke={INK} strokeWidth={3} />
          <Label x={300 + w1 + 24} y={250} text="1 · portland cement" anchor="start" size={30} />
          <rect x={300} y={318} width={w2} height={92} fill="#c6bca9" stroke={INK} strokeWidth={3} />
          <Label x={300 + w2 + 24} y={378} text="2½ · sharp sand" anchor="start" size={30} />
        </>
      );
    }
    // la lechada forzada en los poros
    case "bondcoat": {
      const soak = p;
      return (
        <>
          <Slab />
          <path d="M556 150 L520 330 L680 330 L644 150 Z" fill="#efe7d8" stroke={INK} strokeWidth={3} />
          <path d="M556 150 L520 330 L680 330 L644 150 Z" fill={TERRA} opacity={soak * 0.75} />
          {Array.from({ length: 18 }).map((_, i) => {
            const y = 165 + i * 9;
            const l = soak * (10 + rnd(i, 9) * 22);
            return (
              <g key={i} opacity={soak}>
                <line x1={532} y1={y} x2={532 - l} y2={y} stroke={TERRA} strokeWidth={2.2} />
                <line x1={668} y1={y} x2={668 + l} y2={y} stroke={TERRA} strokeWidth={2.2} />
              </g>
            );
          })}
          <Label x={600} y={110} text="forced into every pore" color={TERRA} />
          <Label x={600} y={400} text="one piece of stone — not two sitting side by side" color={INK} size={23} />
        </>
      );
    }
    // asentamiento: un lado baja
    case "settlement": {
      const drop = p * 46;
      return (
        <>
          <rect x={80} y={150} width={510} height={300} fill="#cdc3b1" stroke={INK} strokeWidth={3} />
          <Aggregate x={90} y={160} w={490} h={280} />
          <g transform={`translate(0 ${drop})`}>
            <rect x={610} y={150} width={510} height={300} fill="#cdc3b1" stroke={INK} strokeWidth={3} />
            <Aggregate x={620} y={160} w={490} h={280} seed={5} />
          </g>
          {/* el suelo que se va */}
          <g opacity={p}>
            <path d={`M610 ${450 + drop} L1120 ${450 + drop} L1120 ${470 + drop} L610 470 Z`} fill={RUST} opacity={0.35} />
            {Array.from({ length: 5 }).map((_, i) => (
              <path key={i} d={`M${680 + i * 90} ${476 + drop} l14 26`} stroke={RUST} strokeWidth={3} fill="none" />
            ))}
          </g>
          <g opacity={p}>
            <line x1={590} y1={150} x2={590} y2={150 + drop} stroke={RUST} strokeWidth={5} />
            <Label x={600} y={110} text="a step you can feel with your hand" color={RUST} />
            <Label x={600} y={520} text="the ground is going down · a soil problem, not a concrete one" color={INK} size={23} />
          </g>
        </>
      );
    }
    // grieta horizontal: empuje desde afuera
    case "horizontal": {
      const push = p;
      return (
        <>
          {/* la pared en corte, vista de frente al empuje */}
          <g transform={`translate(${push * 26} 0)`}>
            <rect x={430} y={150} width={220} height={140} fill="#cdc3b1" stroke={INK} strokeWidth={3} />
          </g>
          <rect x={430} y={310} width={220} height={140} fill="#cdc3b1" stroke={INK} strokeWidth={3} />
          <line x1={430} y1={300} x2={650 + push * 26} y2={300} stroke={RUST} strokeWidth={6 + push * 5} />
          {/* la tierra empujando */}
          {Array.from({ length: 4 }).map((_, i) => {
            const y = 180 + i * 34;
            return (
              <g key={i} opacity={push}>
                <line x1={300} y1={y} x2={410} y2={y} stroke={RUST} strokeWidth={4} />
                <path d={`M410 ${y} l-20 -9 v18 z`} fill={RUST} />
              </g>
            );
          })}
          <Label x={330} y={140} text="soil pressure" color={RUST} size={24} />
          <Label x={600} y={505} text="that is a phone call — not a Saturday job" color={RUST} size={26} />
        </>
      );
    }
    default:
      return <Slab />;
  }
};

export const CrackRepairDiagram: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  mode?: CrackMode;
  title?: string;
  caption?: string;
}> = ({ durationInFrames, theme, mode = "hydration", title, caption }) => {
  const t = useTheme(theme ?? THEME_AMISH);
  const inFade = useFade(0, 26);
  const outFade = interpolate(useCurrentFrame(), [durationInFrames - 18, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // el mecanismo corre después de que entró el título, y termina antes de salir
  const run = useRun(22, Math.max(30, durationInFrames - 52));
  const op = Math.min(inFade, outFade);

  return (
    <AbsoluteFill style={{ background: "#1c1710" }}>
      <AbsoluteFill style={{ opacity: op }}>
        {/* ⛔ AgedPaper es position:relative y su papel va en un hijo con inset:0 — sin darle
            dimensiones el contenedor COLAPSA y no pinta nada. Renderizado así, la tinta oscura
            del diagrama quedaba sobre el fondo oscuro de la comp y el componente salía ilegible.
            Tampoco acepta durationInFrames (su firma es at/seed/deckle/style/children). */}
        <AgedPaper theme={t} style={{ position: "absolute", inset: 0 }} />
        <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 90px" }}>
          {title && (
            <div
              style={{
                fontFamily: "Georgia, 'EB Garamond', serif",
                fontSize: 58,
                letterSpacing: 2,
                color: INK,
                textAlign: "center",
                marginBottom: 14,
                opacity: useFade(4, 24),
              }}
            >
              {title}
            </div>
          )}
          <svg viewBox="0 0 1200 560" style={{ width: "100%", height: 560 }}>
            <Scene mode={mode} p={run} />
          </svg>
          {caption && (
            <div
              style={{
                fontFamily: "Georgia, 'EB Garamond', serif",
                fontSize: 33,
                lineHeight: 1.34,
                color: "#4a4136",
                textAlign: "center",
                marginTop: 18,
                maxWidth: 1400,
                alignSelf: "center",
                opacity: useFade(34, 26),
              }}
            >
              {caption}
            </div>
          )}
        </AbsoluteFill>
      </AbsoluteFill>
      <FilmWear theme={t} strength={0.85} />
    </AbsoluteFill>
  );
};
