import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";

// ── COMPONENTE A MEDIDA (video AGUA OXIGENADA / peróxido en la huerta) ────────
// Componente estrella y único. Mismo lenguaje visual del canal (parchment, serif,
// ámbar/óxido, verde profundo) — hermano de OllaDiagram / ZeerPotDiagram.
// Dos modos con la MISMA familia visual:
//   "molecule" → el "aha": H₂O (un oxígeno) vs H₂O₂ (dos oxígenos, uno "de más"
//                mal pegado que tiembla y se SUELTA subiendo como burbuja de O₂).
//   "roots"    → corte transversal de tierra con raíces blancas que "respiran":
//                burbujitas de oxígeno llegando a la raíz.
//
// RENDER-SAFE: cero Date.now / Math.random / new Date. Toda animación deriva de
// useCurrentFrame(). La "aleatoriedad" de burbujas es determinística por índice.

const OXY = COLORS.danger; // oxígeno = óxido / terracota faded
const HYD = COLORS.amber; // hidrógeno = sepia claro
const O2 = COLORS.cold; // burbuja de O₂ liberada = eucalipto
const ROOT = "#EDE4CE"; // raíz blanca-crema
const SOIL = "#3a2b1c";
const SOIL2 = "#4a3826";
const GREEN = COLORS.good;

// posiciones DETERMINÍSTICAS de burbujas (i*primo % rango) — sin Math.random
const bubbleSeed = (i: number, base: number, span: number) => base + ((i * 37) % span);

export const PeroxidoDiagram: React.FC<{
  durationInFrames: number;
  mode: "molecule" | "roots";
  title?: string;
  accent?: string;
}> = ({ durationInFrames, mode, title, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });
  const acc = accent ?? COLORS.accent;

  // ── helper de etiqueta (mismo patrón que OllaDiagram/ZeerPotDiagram) ─────────
  const Label: React.FC<{ x: number; y: number; text: string; at: number; color?: string; anchor?: "start" | "middle" | "end"; size?: number }> = ({ x, y, text, at, color = COLORS.text, anchor = "middle", size = 36 }) => {
    const s = lab(at);
    return (
      <g opacity={s} transform={`translate(${x} ${y + (1 - s) * 12})`} textAnchor={anchor}>
        <text fontSize={size} fontWeight={900} fill={color} fontFamily={FONT_STACK} style={{ paintOrder: "stroke", stroke: COLORS.bg0, strokeWidth: 6 }}>{text}</text>
      </g>
    );
  };
  const Lead: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; color: string }> = ({ x1, y1, x2, y2, at, color }) => {
    const s = lab(at);
    return <line x1={x1} y1={y1} x2={interpolate(s, [0, 1], [x1, x2])} y2={interpolate(s, [0, 1], [y1, y2])} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={s} />;
  };

  // átomo reutilizable con brillo suave
  const Atom: React.FC<{ cx: number; cy: number; r: number; fill: string; label: string; op?: number; wobble?: number }> = ({ cx, cy, r, fill, label, op = 1, wobble = 0 }) => (
    <g opacity={op} transform={`translate(${wobble} 0)`}>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <ellipse cx={cx - r * 0.32} cy={cy - r * 0.34} rx={r * 0.42} ry={r * 0.28} fill="#fff" opacity={0.28} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a2620" strokeWidth={3} opacity={0.22} />
      <text x={cx} y={cy + r * 0.34} fontSize={r * 0.9} fontWeight={900} fill="#fff" fontFamily={FONT_STACK} textAnchor="middle" opacity={0.92}>{label}</text>
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={mode === "molecule" ? 42 : 50} glowY={26} hue="amber" drift={0.3} />
      <SfxCue at={0} src={SFX.whoosh} volume={0.4} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "92%", maxWidth: 1600, opacity: enter, transform: `translateY(${(1 - enter) * 24}px)`, fontFamily: FONT_STACK }}>
          {title && (
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 50, fontWeight: 800, color: COLORS.text }}>{title}</div>
            </div>
          )}
          <svg viewBox="0 0 1600 900" width="100%" style={{ display: "block" }}>
            {mode === "molecule" ? (
              // ═══════════════ MODO MOLECULE ═══════════════
              // izq: agua común H₂O · der: agua oxigenada H₂O₂ (O de más que se suelta)
              (() => {
                const wobble = Math.sin(frame / 5) * 6; // temblor del O "de más"
                // el oxígeno extra se suelta y sube en loop
                const releaseSpan = 150;
                const rel = ((frame + 40) % releaseSpan) / releaseSpan; // 0→1
                const extraX = 1075 + Math.sin(frame / 6) * 4;
                const extraY0 = 360;
                const extraY = extraY0 - rel * 300;
                const extraOp = 1 - rel; // se desvanece al subir
                const boundOp = interpolate(rel, [0, 0.12], [0, 1]); // el nuevo O aparece de nuevo
                return (
                  <g>
                    {/* ── AGUA COMÚN (izquierda) ── */}
                    <g opacity={lab(0.3)}>
                      {/* enlaces */}
                      <line x1={360} y1={430} x2={470} y2={360} stroke="#7a5a36" strokeWidth={12} opacity={0.55} />
                      <line x1={360} y1={430} x2={470} y2={500} stroke="#7a5a36" strokeWidth={12} opacity={0.55} />
                      <Atom cx={360} cy={430} r={72} fill={OXY} label="O" />
                      <Atom cx={478} cy={352} r={44} fill={HYD} label="H" />
                      <Atom cx={478} cy={508} r={44} fill={HYD} label="H" />
                    </g>

                    {/* ── AGUA OXIGENADA (derecha) ── */}
                    <g opacity={lab(0.9)}>
                      {/* enlaces del O base */}
                      <line x1={940} y1={430} x2={840} y2={360} stroke="#7a5a36" strokeWidth={12} opacity={0.55} />
                      <line x1={940} y1={430} x2={840} y2={500} stroke="#7a5a36" strokeWidth={12} opacity={0.55} />
                      {/* enlace DÉBIL O–O (punteado, tiembla) — el que se rompe */}
                      <line x1={940} y1={430} x2={extraX} y2={extraY0} stroke={OXY} strokeWidth={7} strokeDasharray="10 12" opacity={0.7 * boundOp * (1 - rel * 0.6)} />
                      <Atom cx={840} cy={352} r={44} fill={HYD} label="H" />
                      <Atom cx={840} cy={508} r={44} fill={HYD} label="H" />
                      <Atom cx={940} cy={430} r={72} fill={OXY} label="O" />
                      {/* el OXÍGENO "de más": mal pegado, tiembla, se suelta y sube */}
                      <g opacity={boundOp * extraOp}>
                        <Atom cx={extraX} cy={extraY} r={58} fill={OXY} label="O" wobble={rel < 0.15 ? wobble : 0} />
                        {/* halo de "se libera" */}
                        <circle cx={extraX} cy={extraY} r={58 + rel * 40} fill="none" stroke={O2} strokeWidth={4} opacity={0.5 * (1 - rel)} />
                      </g>
                    </g>

                    {/* ── burbujas de O₂ liberándose (loop, determinístico por índice) ── */}
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                      const bspan = 132;
                      const p = ((frame * 2.0 + bubbleSeed(i, 0, 132) + i * 22) % bspan) / bspan;
                      const bx = 1010 + bubbleSeed(i, 0, 160) + Math.sin((frame + i * 30) / 14) * 10;
                      const by = 360 - p * 300;
                      const br = 12 + (i % 3) * 5;
                      const op = Math.sin(p * Math.PI) * 0.85 * lab(1.6);
                      return (
                        <g key={"b" + i} opacity={op}>
                          <circle cx={bx} cy={by} r={br} fill={O2} opacity={0.5} />
                          <circle cx={bx} cy={by} r={br} fill="none" stroke={O2} strokeWidth={3} />
                          <ellipse cx={bx - br * 0.3} cy={by - br * 0.3} rx={br * 0.35} ry={br * 0.25} fill="#fff" opacity={0.5} />
                        </g>
                      );
                    })}

                    {/* símbolo O₂ arriba (a dónde va) */}
                    <g opacity={lab(1.9)} transform="translate(1075 120)">
                      <rect x={-92} y={-40} width={184} height={80} rx={40} fill={O2} opacity={0.16} />
                      <text x={0} y={16} fontSize={46} fontWeight={900} fill={O2} fontFamily={FONT_STACK} textAnchor="middle">O₂ ↑</text>
                    </g>

                    {/* ETIQUETAS */}
                    <Label x={418} y={640} text="Agua común (H₂O)" at={0.6} color={COLORS.text} size={40} />
                    <Label x={900} y={640} text="Agua oxigenada (H₂O₂)" at={1.2} color={OXY} size={40} />
                    <Lead x1={1075} y1={230} x2={1075} y2={300} at={1.7} color={O2} />
                    <Label x={1075} y={210} text="El oxígeno de más se libera" at={1.7} color={O2} size={34} />
                    {/* separador sutil entre las dos moléculas */}
                    <line x1={660} y1={330} x2={660} y2={560} stroke={COLORS.textDim} strokeWidth={2} strokeDasharray="4 10" opacity={0.4 * enter} />
                  </g>
                );
              })()
            ) : (
              // ═══════════════ MODO ROOTS ═══════════════
              // corte transversal: banda de tierra oscura arriba con plantita,
              // tierra abajo, raíces blancas y burbujas de O₂ llegando a la raíz.
              (() => {
                const groundY = 300; // línea del suelo (aire arriba)
                const bandY = groundY; // banda marrón oscura arriba
                return (
                  <g>
                    {/* sol suave arriba izq (lejos de la esquina inf-der del PiP) */}
                    <circle cx={200} cy={130} r={54} fill={COLORS.amber} opacity={0.85 * lab(0.2)} />

                    {/* cielo/aire (transparente sobre parchment) */}
                    {/* banda de tierra oscura arriba + tierra abajo */}
                    <rect x={0} y={bandY} width={1600} height={120} fill={SOIL} />
                    <rect x={0} y={bandY + 120} width={1600} height={900 - bandY - 120} fill={SOIL2} />
                    <line x1={0} y1={groundY} x2={1600} y2={groundY} stroke="#1d160d" strokeWidth={4} />
                    {/* textura granos de tierra (determinística) */}
                    {[...Array(46)].map((_, i) => {
                      const gx = bubbleSeed(i, 40, 1520);
                      const gy = groundY + 40 + ((i * 53) % 520);
                      const gr = 2 + (i % 3);
                      return <circle key={"g" + i} cx={gx} cy={gy} r={gr} fill="#2a1e12" opacity={0.5} />;
                    })}

                    {/* plantita (tallo + hojas) — centrada-izquierda */}
                    <g opacity={lab(0.3)}>
                      <line x1={560} y1={groundY} x2={560} y2={groundY - 150} stroke="#2f5a23" strokeWidth={9} />
                      <path d={`M 560 ${groundY - 150} C 512 ${groundY - 186}, 494 ${groundY - 240}, 536 ${groundY - 264} C 554 ${groundY - 216}, 558 ${groundY - 186}, 560 ${groundY - 150}`} fill={GREEN} />
                      <path d={`M 560 ${groundY - 150} C 608 ${groundY - 186}, 626 ${groundY - 240}, 584 ${groundY - 264} C 566 ${groundY - 216}, 562 ${groundY - 186}, 560 ${groundY - 150}`} fill={GREEN} opacity={0.92} />
                      <path d={`M 560 ${groundY - 90} C 520 ${groundY - 110}, 508 ${groundY - 146}, 534 ${groundY - 164} C 550 ${groundY - 132}, 556 ${groundY - 112}, 560 ${groundY - 90}`} fill={GREEN} opacity={0.85} />
                    </g>

                    {/* RAÍCES blancas que bajan y se ramifican (opacas por spring) */}
                    <g opacity={lab(0.5)} fill="none" stroke={ROOT} strokeLinecap="round">
                      <path d={`M 560 ${groundY} C 560 ${groundY + 90}, 520 ${groundY + 150}, 470 ${groundY + 250} C 440 ${groundY + 320}, 430 ${groundY + 380}, 440 ${groundY + 440}`} strokeWidth={9} />
                      <path d={`M 560 ${groundY} C 570 ${groundY + 100}, 620 ${groundY + 160}, 690 ${groundY + 250} C 740 ${groundY + 315}, 760 ${groundY + 380}, 760 ${groundY + 450}`} strokeWidth={9} />
                      <path d={`M 560 ${groundY + 30} C 560 ${groundY + 120}, 560 ${groundY + 200}, 570 ${groundY + 300} C 576 ${groundY + 360}, 578 ${groundY + 410}, 574 ${groundY + 470}`} strokeWidth={8} />
                      {/* raicillas finas */}
                      <path d={`M 500 ${groundY + 200} C 470 ${groundY + 230}, 452 ${groundY + 258}, 448 ${groundY + 300}`} strokeWidth={4} opacity={0.85} />
                      <path d={`M 640 ${groundY + 210} C 672 ${groundY + 236}, 690 ${groundY + 268}, 694 ${groundY + 312}`} strokeWidth={4} opacity={0.85} />
                      <path d={`M 566 ${groundY + 250} C 540 ${groundY + 286}, 528 ${groundY + 320}, 528 ${groundY + 360}`} strokeWidth={4} opacity={0.85} />
                    </g>

                    {/* BURBUJAS de O₂ que llegan a las raíces (suben suave, loop, determinístico) */}
                    {[...Array(12)].map((_, i) => {
                      const bspan = 140;
                      const p = ((frame * 1.7 + bubbleSeed(i, 0, 140) + i * 17) % bspan) / bspan;
                      const bx = 380 + bubbleSeed(i, 0, 460) + Math.sin((frame + i * 24) / 15) * 8;
                      const baseY = groundY + 180 + ((i * 41) % 240);
                      const by = baseY - p * 90; // sube hacia la raíz
                      const br = 8 + (i % 3) * 4;
                      const op = Math.sin(p * Math.PI) * 0.8 * lab(1.2);
                      return (
                        <g key={"rb" + i} opacity={op}>
                          <circle cx={bx} cy={by} r={br} fill={O2} opacity={0.5} />
                          <circle cx={bx} cy={by} r={br} fill="none" stroke={O2} strokeWidth={2.5} />
                          <ellipse cx={bx - br * 0.3} cy={by - br * 0.3} rx={br * 0.35} ry={br * 0.25} fill="#fff" opacity={0.55} />
                        </g>
                      );
                    })}

                    {/* ETIQUETAS (mantengo la esquina inf-der más libre para el PiP) */}
                    <Lead x1={870} y1={groundY - 110} x2={640} y2={groundY - 130} at={0.9} color={GREEN} />
                    <Label x={1100} y={groundY - 118} text="Las raíces respiran" at={0.9} color={acc} size={40} />
                    <Lead x1={300} y1={groundY + 320} x2={452} y2={groundY + 320} at={1.6} color={O2} />
                    <Label x={296} y={groundY + 330} text="El oxígeno llega a la raíz" at={1.6} color={O2} anchor="end" size={36} />
                  </g>
                );
              })()
            )}
          </svg>
        </div>
      </AbsoluteFill>
      <SfxCue at={sec(1.2)} src={SFX.popUp} volume={0.35} />
    </AbsoluteFill>
  );
};

export default PeroxidoDiagram;
