import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";
import {
  ParallaxLayer,
  ParticleField,
  PaperGrain,
  GodRays,
  RimLight,
  DepthShadow,
  Odometer,
  SvgFilters,
  rand,
  wobble,
} from "./depth";

// ═══════════════════════════════════════════════════════════════════════════
// PxCostCart — PIEZA ÚNICA · "el vecino que compró todo" vs el abuelo.
// A la IZQUIERDA: un CARRITO isométrico que se va APILANDO de frascos caros de
// tienda (fungicida, insecticida, clarificador, enraizante...) uno sobre otro,
// con su odómetro de costo trepando frasco a frasco (rueda hasta un total alto).
// A la DERECHA: UNA sola botellita de peróxido que BRILLA sola, con su cartelito
// de precio ridículo — y su rim-light dorado la hace destacar contra todo.
//
// PROFUNDIDAD REAL: proyección isométrica real (skew + escalado) para el carrito
// y los frascos, sombra multicapa que los ancla al piso, rim-light en la botella
// ganadora, parallax de fondo, partículas de polvo de tienda vs. destello de la
// botellita, física de resorte en cada frasco que cae al carrito y en el
// odómetro. Esquina inf-derecha libre para el avatar PiP.
//
// RENDER-SAFE: cero Date.now / Math.random / new Date. Determinístico por índice.
// 1920×1080. Texto ES por props con DEFAULT.
// ═══════════════════════════════════════════════════════════════════════════

const CART = "#7a5a36";
const GLOW = COLORS.amber;
const PX = COLORS.cold; // peróxido = eucalipto claro
const JAR_COLORS = ["#8a5a4a", "#5a6b7a", "#7a6a4a", "#6a5a6a", "#8a7a4a"];

// frascos caros: label + precio
type Jar = { label: string; price: number };
const DEFAULT_JARS: Jar[] = [
  { label: "Fungicida", price: 4200 },
  { label: "Insecticida", price: 3800 },
  { label: "Enraizante", price: 3100 },
  { label: "Clarificador", price: 2900 },
  { label: "Antimosquito", price: 2600 },
];

export const PxCostCart: React.FC<{
  durationInFrames: number;
  title?: string;
  jars?: Jar[];
  peroxidoPrice?: number;
}> = ({ durationInFrames, title = "El vecino vs el abuelo", jars = DEFAULT_JARS, peroxidoPrice = 900 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });

  // cada frasco cae escalonado
  const jarAt = (i: number) => 0.6 + i * 0.42;
  // total acumulado hasta el último frasco visible (para el odómetro)
  const jarsIn = jars.filter((_, i) => frame >= sec(jarAt(i)) + 6).length;
  const runningTotal = jars.slice(0, Math.max(jarsIn, 0)).reduce((a, j) => a + j.price, 0);
  // la botellita del abuelo entra al final, después de todos los frascos
  const bottleAt = jarAt(jars.length - 1) + 0.8;
  const bottle = spring({ frame: frame - sec(bottleAt), fps, config: { damping: 12, mass: 0.7, stiffness: 160 } });

  const Label: React.FC<{ x: number; y: number; text: string; at: number; color?: string; anchor?: "start" | "middle" | "end"; size?: number }> = ({ x, y, text, at, color = COLORS.text, anchor = "middle", size = 36 }) => {
    const s = lab(at);
    return (
      <g opacity={s} transform={`translate(${x} ${y + (1 - s) * 12})`} textAnchor={anchor}>
        <text fontSize={size} fontWeight={900} fill={color} fontFamily={FONT_STACK} style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 7 }}>{text}</text>
      </g>
    );
  };

  // dibuja un frasco isométrico (caja 3D) en (cx, baseY) con altura h
  const IsoJar: React.FC<{ cx: number; baseY: number; w: number; h: number; fill: string; label?: string; drop: number }> = ({ cx, baseY, w, h, fill, label, drop }) => {
    const dy = interpolate(drop, [0, 1], [-160, 0]); // cae desde arriba
    const op = interpolate(drop, [0, 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const squash = interpolate(drop, [0.85, 1], [1, 1], { extrapolateLeft: "clamp" });
    const dw = w * 0.5; // profundidad iso
    const top = baseY - h + dy;
    const bot = baseY + dy;
    return (
      <g opacity={op} transform={`translate(0 ${dy}) scale(1 ${squash})`}>
        {/* cara frontal */}
        <path d={`M ${cx - w / 2} ${top - dy} L ${cx + w / 2} ${top - dy} L ${cx + w / 2} ${bot - dy} L ${cx - w / 2} ${bot - dy} Z`} fill={fill} />
        {/* cara lateral (más oscura, iso) */}
        <path d={`M ${cx + w / 2} ${top - dy} L ${cx + w / 2 + dw} ${top - dy - dw * 0.55} L ${cx + w / 2 + dw} ${bot - dy - dw * 0.55} L ${cx + w / 2} ${bot - dy} Z`} fill={fill} opacity={0.62} />
        {/* tapa (más clara, iso) */}
        <path d={`M ${cx - w / 2} ${top - dy} L ${cx + w / 2} ${top - dy} L ${cx + w / 2 + dw} ${top - dy - dw * 0.55} L ${cx - w / 2 + dw} ${top - dy - dw * 0.55} Z`} fill={fill} opacity={1} style={{ filter: "brightness(1.25)" }} />
        {/* tapón */}
        <rect x={cx - w * 0.18} y={top - dy - 18} width={w * 0.36} height={16} rx={4} fill="#2a2620" opacity={0.5} />
        {/* etiqueta blanca */}
        <rect x={cx - w * 0.36} y={top - dy + h * 0.28} width={w * 0.72} height={h * 0.4} rx={4} fill="#EDE4CE" opacity={0.9} />
        {label && <text x={cx} y={top - dy + h * 0.54} fontSize={13} fontWeight={800} fill="#2a2620" fontFamily={FONT_STACK} textAnchor="middle">{label}</text>}
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <SvgFilters prefix="cost" />
      <TechBackground glowX={70} glowY={40} hue="amber" drift={0.3} />
      <GodRays x={78} y={-10} angle={16} intensity={0.9} rays={6} />
      <SfxCue at={0} src={SFX.whoosh} volume={0.4} />
      {jars.map((_, i) => (
        <SfxCue key={i} at={sec(jarAt(i)) + 6} src={SFX.popUp} volume={0.32} />
      ))}
      <SfxCue at={sec(bottleAt)} src={SFX.popUp} volume={0.45} />

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "92%", maxWidth: 1600, opacity: enter, transform: `translateY(${(1 - enter) * 26}px)`, fontFamily: FONT_STACK }}>
          {title && (
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 52, fontWeight: 800, color: COLORS.text }}>{title}</div>
            </div>
          )}

          <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
            {/* piso iso (rombos sutiles) */}
            <g opacity={0.25 * enter}>
              {Array.from({ length: 7 }, (_, i) => (
                <line key={"fl" + i} x1={120 + i * 90} y1={760} x2={120 + i * 90 - 180} y2={860} stroke={CART} strokeWidth={2} opacity={0.4} />
              ))}
            </g>

            {/* ═══ IZQUIERDA · EL VECINO · carrito que se apila ═══ */}
            {/* sombra del carrito en el piso */}
            <ellipse cx={430} cy={790} rx={230} ry={44} fill="#2a2620" opacity={0.16 * enter} />

            {/* frascos apilados (de abajo hacia arriba) */}
            <g opacity={enter}>
              {jars.map((j, i) => {
                const drop = lab(jarAt(i));
                const col = JAR_COLORS[i % JAR_COLORS.length];
                // apilados en 2 columnas dentro del carrito
                const colIdx = i % 2;
                const rowIdx = Math.floor(i / 2);
                const cx = 360 + colIdx * 150;
                const baseY = 700 - rowIdx * 118;
                return <IsoJar key={"j" + i} cx={cx} baseY={baseY} w={110} h={100} fill={col} label={j.label} drop={drop} />;
              })}
            </g>

            {/* CARRITO isométrico (por delante de la carga baja) */}
            <g opacity={enter} stroke={CART} fill="none" strokeLinecap="round" strokeLinejoin="round">
              {/* canasta iso: trapecio frontal + lateral */}
              <path d="M 280 700 L 600 700 L 560 560 L 320 560 Z" fill={CART} fillOpacity={0.12} strokeWidth={7} />
              <path d="M 600 700 L 690 660 L 650 522 L 560 560 Z" fill={CART} fillOpacity={0.2} strokeWidth={6} />
              {/* rejilla */}
              {[0, 1, 2, 3].map((k) => (
                <line key={"vb" + k} x1={340 + k * 62} y1={560} x2={330 + k * 62} y2={700} strokeWidth={3} opacity={0.5} />
              ))}
              {/* manija */}
              <path d="M 280 700 L 250 700 L 250 500 L 210 500" strokeWidth={7} />
              {/* ruedas */}
              <circle cx={360} cy={740} r={26} strokeWidth={7} />
              <circle cx={540} cy={740} r={26} strokeWidth={7} />
              <circle cx={360} cy={740} r={8} fill={CART} stroke="none" />
              <circle cx={540} cy={740} r={8} fill={CART} stroke="none" />
            </g>

            {/* etiqueta + odómetro de COSTO del vecino */}
            <Label x={430} y={490} text="El vecino compró todo" at={0.4} color={COLORS.text} size={38} />

            {/* ═══ DERECHA · EL ABUELO · UNA botellita que brilla sola ═══ */}
            {/* halo/destello determinístico detrás de la botella */}
            <g opacity={bottle} transform="translate(1180 560)">
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2;
                const pulse = 90 + Math.sin(frame / 8 + i) * 16;
                return <line key={"ray" + i} x1={Math.cos(a) * 40} y1={Math.sin(a) * 40} x2={Math.cos(a) * pulse} y2={Math.sin(a) * pulse} stroke={GLOW} strokeWidth={4} opacity={0.5} strokeLinecap="round" />;
              })}
              <circle cx={0} cy={0} r={interpolate(bottle, [0, 1], [0, 150])} fill={GLOW} opacity={0.1} />
            </g>

            {/* la botellita de peróxido (iso, con brillo) */}
            <g opacity={interpolate(bottle, [0, 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} transform={`translate(1180 560) scale(${interpolate(bottle, [0, 1], [0.4, 1])})`}>
              {/* sombra */}
              <ellipse cx={0} cy={160} rx={90} ry={22} fill="#2a2620" opacity={0.18} />
              {/* cuerpo iso */}
              <path d="M -55 -120 L 55 -120 L 55 150 L -55 150 Z" fill={PX} opacity={0.85} />
              <path d="M 55 -120 L 95 -150 L 95 118 L 55 150 Z" fill={PX} opacity={0.55} />
              <path d="M -55 -120 L 55 -120 L 95 -150 L -15 -150 Z" fill={PX} opacity={1} style={{ filter: "brightness(1.3)" }} />
              {/* cuello marrón (frasco típico de peróxido) */}
              <rect x={-24} y={-160} width={48} height={44} rx={6} fill="#5a3a2a" />
              <rect x={-30} y={-176} width={60} height={20} rx={6} fill="#3a2418" />
              {/* etiqueta */}
              <rect x={-46} y={-60} width={92} height={130} rx={8} fill="#EDE4CE" opacity={0.95} />
              <text x={0} y={-10} fontSize={22} fontWeight={900} fill={COLORS.danger} fontFamily={FONT_STACK} textAnchor="middle">H₂O₂</text>
              <text x={0} y={26} fontSize={13} fontWeight={800} fill="#2a2620" fontFamily={FONT_STACK} textAnchor="middle">agua</text>
              <text x={0} y={44} fontSize={13} fontWeight={800} fill="#2a2620" fontFamily={FONT_STACK} textAnchor="middle">oxigenada</text>
              {/* reflejo especular */}
              <rect x={-40} y={-110} width={14} height={230} rx={7} fill="#fff" opacity={0.35} />
              {/* burbujitas de O₂ saliendo (vivo) */}
              {Array.from({ length: 6 }, (_, i) => {
                const span = 60;
                const p = ((frame + i * 14) % span) / span;
                const bx = -20 + rand(i) * 40 + wobble(i, frame, 2) * 6;
                const by = -150 - p * 70;
                return <circle key={"pb" + i} cx={bx} cy={by} r={4 + (i % 2) * 3} fill={PX} opacity={Math.sin(p * Math.PI) * 0.8} />;
              })}
            </g>

            <Label x={1180} y={330} text="El abuelo: una botella" at={bottleAt} color={PX} size={38} />
          </svg>
        </div>
      </AbsoluteFill>

      {/* ODÓMETROS de costo — capa HTML por encima para tipografía nítida */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {/* costo del vecino (trepa) */}
        <div style={{ position: "absolute", left: "8%", top: "78%", opacity: enter }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <Odometer value={runningTotal} digits={5} durationInFrames={20} size={64} color={COLORS.danger} prefix="$" />
          </div>
        </div>
        {/* precio del abuelo (fijo, chico, brillante) */}
        <div style={{ position: "absolute", left: "60%", top: "78%", opacity: interpolate(bottle, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <RimLight color={GLOW} spread={22} x={0.5} y={0.4}>
            <DepthShadow layers={4} distance={24} radius={16} color="rgba(30,22,14,0.18)" style={{ padding: "6px 22px", background: "rgba(239,231,211,0.9)" }}>
              <div style={{ fontFamily: FONT_STACK, fontSize: 64, fontWeight: 900, color: PX }}>${peroxidoPrice}</div>
            </DepthShadow>
          </RimLight>
        </div>
      </AbsoluteFill>

      {/* polvo de tienda a la izq · destellos a la der */}
      <ParallaxLayer depth={0.6} driftY={14} driftX={22}>
        <ParticleField count={14} kind="dust" rise={false} drift={20} opacity={0.28 * enter} />
      </ParallaxLayer>

      <PaperGrain opacity={0.1} />
    </AbsoluteFill>
  );
};

export default PxCostCart;
