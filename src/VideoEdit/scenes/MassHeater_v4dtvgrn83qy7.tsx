import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { COLORS, FONT_STACK, sec } from "../theme";
import { TechBackground } from "../components/TechBackground";
import { SfxCue, SFX } from "../components/Sfx";

// ── MassHeaterV4dt — variante ES-MX de MassHeaterDiagram ─────────────────────
// Adaptada al calefactor casero de macetas de barro: LLAMA → MASA → CALOR.
// La vela carga el barro y el barro te irradia. Mismas piezas, dos modos:
//   "flow"   — la llama abajo → el calor serpentea por el cuerpo de barro → el
//              barro se lo toma (rojo→sepia) → el aire sale tibio arriba → la
//              masa irradia por los costados.
//   "rocket" — versión banco/túnel: la llama entra abajo y el escape recorre una
//              masa larga de barro que irradia.
// Todo SVG, siempre vivo. Paleta terrosa: terracota, ocre, madera, barro.
type Tag = { text: string; sub?: string };

export const MassHeaterV4dt: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  mode?: "flow" | "rocket";
  fire?: Tag;
  mass?: Tag;
  out?: Tag;
  coolTag?: string;
  effTag?: string;
  hotColor?: string;
  coldColor?: string;
}> = ({
  durationInFrames,
  eyebrow,
  title,
  mode = "flow",
  fire = { text: "Llama chica", sub: "una sola vela" },
  mass = { text: "El barro se toma el calor", sub: "capa sobre capa" },
  out = { text: "Irradia 30 a 45 min", sub: "calor parejo" },
  coolTag = "el aire sale tibio",
  effTag = "80–90% guardado",
  hotColor = COLORS.danger,
  coldColor = COLORS.amber,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 60 } });
  const lab = (d: number) => spring({ frame: frame - sec(d), fps, config: { damping: 200, mass: 1, stiffness: 70 } });
  const draw = spring({ frame: frame - 6, fps, config: { damping: 200, mass: 1, stiffness: 36 } });
  const flow = interpolate(frame, [0, fps * 4], [0, -240], { extrapolateRight: "extend" });
  const flick = 0.6 + 0.4 * Math.abs(Math.sin(frame / 5));

  const Label: React.FC<{ x: number; y: number; t: Tag; at: number; color?: string; anchor?: string }> = ({ x, y, t, at, color = COLORS.text, anchor = "middle" }) => {
    const s = lab(at);
    return (
      <g opacity={s} transform={`translate(${x} ${y + (1 - s) * 12})`} textAnchor={anchor as "middle"}>
        <text fontSize={38} fontWeight={900} fill={color} fontFamily={FONT_STACK}>{t.text}</text>
        {t.sub && <text y={32} fontSize={22} fontWeight={600} fill={COLORS.textDim} fontFamily={FONT_STACK}>{t.sub}</text>}
      </g>
    );
  };

  // ondas de calor radiante saliendo de una cara del barro
  const Waves: React.FC<{ x: number; y: number; dir: number; at: number }> = ({ x, y, dir, at }) => (
    <g opacity={0.6 * lab(at)} stroke={hotColor} strokeWidth={4} fill="none" strokeLinecap="round">
      {[0, 1, 2].map((i) => {
        const ph = frame / 14 + i * 0.7;
        const off = (Math.sin(ph) * 0.5 + 0.5) * 40;
        return <path key={i} d={`M ${x + dir * (20 + i * 26 + off)} ${y - 24} q ${dir * 16} 24 0 48`} opacity={1 - i * 0.25} />;
      })}
    </g>
  );

  // ── FLOW (cuerpo de barro) ──
  const flowSvg = () => {
    const bodyX = 600, bodyW = 420, bodyTop = 150, bodyBot = 760;
    // canal serpenteante: llama → zigzag hacia arriba → salida
    const PATH = `M 740 690 L 740 600 L 900 600 L 900 480 L 700 480 L 700 360 L 900 360 L 900 250 L 820 250 L 820 150`;
    return (
      <svg viewBox="0 0 1600 900" style={{ width: "100%", height: "auto" }}>
        <defs>
          <linearGradient id="mhv4_flue" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={hotColor} />
            <stop offset="100%" stopColor={coldColor} />
          </linearGradient>
          <radialGradient id="mhv4_fire" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#ffd24a" />
            <stop offset="60%" stopColor={hotColor} />
            <stop offset="100%" stopColor={hotColor} stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* piso */}
        <rect x={0} y={760} width={1600} height={140} fill="#5c4a30" opacity={0.28} />
        <line x1={0} y1={760} x2={1600} y2={760} stroke={COLORS.bg2} strokeWidth={3} />
        {/* calor radiante por las dos caras */}
        <Waves x={bodyX} y={460} dir={-1} at={1.1} />
        <Waves x={bodyX + bodyW} y={460} dir={1} at={1.1} />
        {/* cuerpo de barro */}
        <g opacity={lab(0.4)}>
          <rect x={bodyX} y={bodyTop} width={bodyW} height={bodyBot - bodyTop} rx={14} fill="url(#mhv4_flue)" opacity={0.13} />
          <rect x={bodyX} y={bodyTop} width={bodyW} height={bodyBot - bodyTop} rx={14} fill="none" stroke={COLORS.text} strokeWidth={3} opacity={0.6} />
          {/* hiladas de barro */}
          {[230, 310, 390, 470, 550, 630, 710].map((y) => (
            <line key={y} x1={bodyX} y1={y} x2={bodyX + bodyW} y2={y} stroke={COLORS.text} strokeWidth={1} opacity={0.12} />
          ))}
        </g>
        {/* salida de aire */}
        <rect x={795} y={60} width={50} height={100} fill={COLORS.bg2} opacity={0.6} stroke={COLORS.text} strokeWidth={2} />
        {/* el canal: base + flujo animado */}
        <path d={PATH} fill="none" stroke={COLORS.bg2} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
        <path d={PATH} fill="none" stroke="url(#mhv4_flue)" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <path d={PATH} fill="none" stroke={COLORS.bg0} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 30" strokeDashoffset={flow} opacity={0.6 * draw} />
        {/* hueco de la vela + llama */}
        <g opacity={lab(0.3)}>
          <rect x={660} y={620} width={170} height={120} rx={8} fill="#1a1410" stroke={COLORS.text} strokeWidth={2} opacity={0.85} />
          <ellipse cx={745} cy={700} rx={70} ry={70 * flick} fill="url(#mhv4_fire)" />
          <path d={`M 710 730 Q 725 ${680 - flick * 30} 745 720 Q 765 ${670 - flick * 30} 780 730 Z`} fill="#ffcf4d" opacity={0.9} />
        </g>
        {/* etiquetas */}
        <text x={820} y={120} fontSize={26} fontWeight={800} fill={coldColor} fontFamily={FONT_STACK} textAnchor="middle" opacity={lab(1.0)}>{coolTag}</text>
        <Label x={745} y={800} t={fire} at={0.5} color={hotColor} />
        <Label x={bodyX + bodyW / 2} y={210} t={mass} at={0.8} color={COLORS.amber} />
        <Label x={1330} y={470} t={out} at={1.2} color={hotColor} />
        <g opacity={lab(1.3)} transform="translate(310 470)">
          <rect x={-150} y={-34} width={300} height={68} rx={34} fill={coldColor} opacity={0.16} />
          <text x={0} y={12} fontSize={36} fontWeight={900} fill={coldColor} fontFamily={FONT_STACK} textAnchor="middle">{effTag}</text>
        </g>
      </svg>
    );
  };

  // ── ROCKET (banco largo de barro) ──
  const rocketSvg = () => {
    // entrada de la llama (izquierda), túnel, tiro + campana, escape por el banco de barro
    const PATH = `M 340 560 L 340 660 L 470 660 L 470 470 L 470 660 L 1430 660`;
    return (
      <svg viewBox="0 0 1600 900" style={{ width: "100%", height: "auto" }}>
        <defs>
          <radialGradient id="mhv4_fire2" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#ffd24a" />
            <stop offset="60%" stopColor={hotColor} />
            <stop offset="100%" stopColor={hotColor} stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect x={0} y={770} width={1600} height={130} fill="#5c4a30" opacity={0.28} />
        <line x1={0} y1={770} x2={1600} y2={770} stroke={COLORS.bg2} strokeWidth={3} />
        {/* banco de barro (la masa) */}
        <g opacity={lab(0.6)}>
          <rect x={640} y={620} width={820} height={150} rx={16} fill="#b9682f" opacity={0.35} stroke="#5e2f12" strokeWidth={3} />
          {/* calor subiendo del banco */}
          {[760, 900, 1040, 1180, 1320].map((x, i) => {
            const prog = ((frame * 2 + i * 30) % 130) / 130;
            return <path key={x} d={`M ${x} ${620 - prog * 70}`} stroke={hotColor} strokeWidth={5} strokeLinecap="round" opacity={Math.sin(prog * Math.PI) * 0.7} transform={`translate(0 0)`} />;
          })}
          {[760, 900, 1040, 1180, 1320].map((x, i) => {
            const prog = ((frame * 2 + i * 30) % 130) / 130;
            const y = 620 - prog * 70;
            return <circle key={"d" + x} cx={x} cy={y} r={5} fill={hotColor} opacity={Math.sin(prog * Math.PI) * 0.7} />;
          })}
        </g>
        {/* campana sobre el tiro */}
        <rect x={400} y={300} width={150} height={330} rx={20} fill={COLORS.bg2} opacity={0.5} stroke={COLORS.text} strokeWidth={2} />
        {/* recorrido: entrada → túnel → tiro → banco */}
        <path d={PATH} fill="none" stroke={COLORS.bg2} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
        <path d={PATH} fill="none" stroke={hotColor} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} opacity={0.8} />
        <path d={PATH} fill="none" stroke={COLORS.bg0} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 26" strokeDashoffset={flow} opacity={0.6 * draw} />
        {/* brillo del tiro */}
        <rect x={455} y={330} width={30} height={300} rx={10} fill="url(#mhv4_fire2)" opacity={0.8 * lab(0.6)} />
        {/* boca de carga con la vela */}
        <g opacity={lab(0.3)}>
          <rect x={300} y={470} width={80} height={120} rx={6} fill="#1a1410" stroke={COLORS.text} strokeWidth={2} opacity={0.85} />
          <rect x={324} y={420} width={14} height={120} rx={3} fill="#6b4f2e" />
          <rect x={344} y={430} width={14} height={110} rx={3} fill="#6b4f2e" />
          <ellipse cx={340} cy={585} rx={36} ry={36 * flick} fill="url(#mhv4_fire2)" />
        </g>
        {/* etiquetas */}
        <text x={490} y={690} fontSize={24} fontWeight={800} fill={coldColor} fontFamily={FONT_STACK} textAnchor="middle" opacity={lab(1.0)}>{coolTag}</text>
        <Label x={340} y={760} t={fire} at={0.5} color={hotColor} />
        <Label x={1050} y={840} t={mass} at={0.8} color={COLORS.amber} />
        <Label x={1050} y={560} t={out} at={1.2} color={hotColor} />
        <g opacity={lab(1.3)} transform="translate(490 250)">
          <rect x={-130} y={-32} width={260} height={64} rx={32} fill={hotColor} opacity={0.16} />
          <text x={0} y={11} fontSize={34} fontWeight={900} fill={hotColor} fontFamily={FONT_STACK} textAnchor="middle">{effTag}</text>
        </g>
      </svg>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TechBackground glowX={50} glowY={30} hue="amber" drift={0.3} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "92%", maxWidth: 1600, opacity: enter, transform: `translateY(${(1 - enter) * 26}px)` }}>
          {(eyebrow || title) && (
            <div style={{ textAlign: "center", marginBottom: 8, fontFamily: FONT_STACK }}>
              {eyebrow && <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 800, textTransform: "uppercase", color: COLORS.amber }}>{eyebrow}</div>}
              {title && <div style={{ fontSize: 50, fontWeight: 900, color: COLORS.text, marginTop: 4 }}>{title}</div>}
            </div>
          )}
          {mode === "rocket" ? rocketSvg() : flowSvg()}
        </div>
      </AbsoluteFill>
      <SfxCue at={6} src={SFX.popUp} volume={0.4} />
      <SfxCue at={sec(1.1)} src={SFX.ui5} volume={0.4} />
    </AbsoluteFill>
  );
};
