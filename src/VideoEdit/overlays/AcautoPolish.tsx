// AcautoPolish.tsx — SET DE PULIDO de nivel cine para el video "acauto" (Constructor
// Libre, Tomás). Tema: CARGAR EL AIRE ACONDICIONADO DEL AUTO UNO MISMO. Gemelo temático
// de MaderaPolish/CementoPolish/SalitrePolish: MISMO ADN (clip vivo detrás borroso +
// scrim; encima contenido premium serif/pergamino/tinta sepia, SVG a medida, springs
// suaves, partículas deterministas, todo determinista por frame). Acá los heroes son
// PROPIOS del aire de auto / recarga de gas:
//   1) AcGauge    — el MANÓMETRO con zona VERDE (correcta) y ROJA (bajo/sobrecarga); la
//                   aguja sube a la zona verde durante la recarga. "Mirá el reloj, no la lata."
//   2) AcPorts    — los DOS puertos: BAJA (caño grueso, cargás acá) vs ALTA (caño fino, JAMÁS)
//   3) AcOverfill — EL ERROR: sobrecargar → la aguja se dispara al rojo → enfría PEOR + daña el compresor
//   4) AcSteps    — los pasos de la recarga que entran escalonados (coupler en baja → motor +
//                   aire al máximo → cargar de a poco mirando el manómetro → medir la rejilla 30°→6°)
//   5) AcCircuit  — el circuito CERRADO de gas (compresor→condensador→evaporador) y la fuga lenta
//   (+) AcNameTag — lower-third rústico opcional para Tomás
// CERO filtro retro, CERO shake, CERO flicker. Imágenes (no video) → seguro para el
// render por chunks del farm.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS } from "./ui";

// ── paleta de marca (idéntica a Madera/Cemento/Salitre para coherencia del canal) ──
const PAPER = "#efe7d3"; // pergamino
const PAPER_HI = "#f6f0e0"; // pergamino claro (luz)
const INK = "#2a2620"; // tinta marrón oscura
const SAGE = "#7C8A5A"; // salvia (correcto/sano)
const SAGE_HI = "#a9ba8c";
const TERRA = "#B0503C"; // terracota (peligro/error)
const TERRA_HI = "#e08a72";
const GOLD = "#c9a56a"; // acento cálido
// propios del aire de auto
const COLD = "#5a86a8"; // gas frío / lado de baja (azul apagado)
const COLD_HI = "#7fa8c4";
const STEEL = "#8f8c86"; // metal del compresor/caños
const STEEL_HI = "#b4b0a8";
const HEAT = "#d98c3a"; // calor / lado de alta

const A: Record<string, string> = { sage: SAGE, green: SAGE, good: SAGE, terra: TERRA, red: TERRA, danger: TERRA, amber: "#c98a3c", gold: GOLD, blue: COLD, cold: COLD, ink: INK };
const ac = (k?: string) => (k && A[k]) || SAGE;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

// mulberry32: pseudo-random determinista (por índice) para partículas repetibles
const rnd = (seed: number) => { let t = (seed + 0x6d2b79f5) | 0; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// ── scrim compartido (difumina + oscurece el clip vivo detrás) ──
const Scrim: React.FC<{ op: number; strength?: number }> = ({ op, strength = 14 }) => (
  <AbsoluteFill
    style={{
      backdropFilter: `blur(${strength * op}px) saturate(${1 - 0.2 * op})`,
      WebkitBackdropFilter: `blur(${strength * op}px)`,
      background: "radial-gradient(120% 120% at 50% 44%, rgba(24,17,10,0.36), rgba(16,11,6,0.7))",
      opacity: op,
    }}
  />
);

// entra/sostiene/sale (fade global del overlay)
const useOp = (durationInFrames: number) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const inEnd = Math.round(fps * 0.42);
  const outStart = Math.max(inEnd + 1, durationInFrames - Math.round(fps * 0.5));
  return interpolate(f, [0, inEnd, outStart, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

// eyebrow superior compartido (uppercase, tracking)
const Eyebrow: React.FC<{ text: string; f: number; fps: number }> = ({ text, f, fps }) => (
  <div style={{ fontFamily: SANS, color: PAPER, fontSize: 27, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", opacity: easeOut(Math.min(1, f / (fps * 0.5))), marginBottom: 14, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>{text}</div>
);

// ── nube de escarcha/gotitas frías que caen (para el gas helado) ──
const FrostFall: React.FC<{ seed: number; f: number; x: number; y: number; w: number; n?: number; color?: string; start?: number }> = ({ seed, f, x, y, w, n = 22, color = "rgba(127,168,196,0.6)", start = 0 }) => {
  const fl = f - start;
  if (fl < 0) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const r0 = rnd(seed + i * 7.3), r1 = rnd(seed + i * 13.7), r2 = rnd(seed + i * 19.1);
        const life = 34 + r1 * 34;
        const t = ((fl + r2 * life) % life) / life;
        const px = x + (r0 - 0.5) * w;
        const py = y + t * (60 + r1 * 90);
        const op = Math.sin(t * Math.PI) * (0.4 + r0 * 0.5);
        const sz = 1.2 + r2 * 2.4;
        return <circle key={i} cx={px} cy={py} r={sz} fill={color} opacity={op} />;
      })}
    </>
  );
};

// ── carátula del manómetro (reutilizable): arco con zona ROJA baja, VERDE media y ROJA
//    alta; aguja que apunta a un ángulo dado (0..1 sobre el arco). Determinista por props.
//    Ángulo del arco: -130° (izq/vacío) → +130° (der/sobrecarga). needle = 0..1.
const GaugeFace: React.FC<{ cx: number; cy: number; R: number; needle: number; glow?: number }> = ({ cx, cy, R, needle, glow = 0 }) => {
  const A0 = -130, A1 = 130; // grados
  const deg = A0 + clamp01(needle) * (A1 - A0);
  const rad = (deg - 90) * (Math.PI / 180); // 0 arriba
  const nx = cx + Math.cos(rad) * (R - 14);
  const ny = cy + Math.sin(rad) * (R - 14);
  // arcos de zona (path por sweep de ángulos)
  const arcPath = (d0: number, d1: number, rr: number) => {
    const p0 = ((d0 - 90) * Math.PI) / 180, p1 = ((d1 - 90) * Math.PI) / 180;
    const x0 = cx + Math.cos(p0) * rr, y0 = cy + Math.sin(p0) * rr;
    const x1 = cx + Math.cos(p1) * rr, y1 = cy + Math.sin(p1) * rr;
    const large = d1 - d0 > 180 ? 1 : 0;
    return `M ${x0} ${y0} A ${rr} ${rr} 0 ${large} 1 ${x1} ${y1}`;
  };
  return (
    <g>
      {/* cuerpo del reloj */}
      <circle cx={cx} cy={cy} r={R + 14} fill="#1c1712" stroke={INK} strokeWidth="4" />
      <circle cx={cx} cy={cy} r={R + 6} fill={PAPER} stroke={INK} strokeWidth="2" />
      {/* zonas: roja baja / verde media / roja alta */}
      <path d={arcPath(A0, -44, R - 4)} fill="none" stroke={TERRA} strokeWidth="16" strokeLinecap="round" opacity="0.9" />
      <path d={arcPath(-40, 44, R - 4)} fill="none" stroke={SAGE} strokeWidth="16" strokeLinecap="round" opacity="0.95" />
      <path d={arcPath(48, A1, R - 4)} fill="none" stroke={TERRA} strokeWidth="16" strokeLinecap="round" opacity="0.9" />
      {/* halo verde cuando está en zona (glow 0..1) */}
      {glow > 0.01 && <path d={arcPath(-40, 44, R - 4)} fill="none" stroke={SAGE_HI} strokeWidth="20" strokeLinecap="round" opacity={0.5 * glow} filter="blur(1px)" />}
      {/* ticks */}
      {Array.from({ length: 13 }).map((_, i) => {
        const d = A0 + (i / 12) * (A1 - A0);
        const p = ((d - 90) * Math.PI) / 180;
        const r0 = R - 12, r1 = R - 2;
        return <line key={i} x1={cx + Math.cos(p) * r0} y1={cy + Math.sin(p) * r0} x2={cx + Math.cos(p) * r1} y2={cy + Math.sin(p) * r1} stroke={INK} strokeWidth="2" opacity="0.5" />;
      })}
      {/* aguja */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx - Math.cos(rad) * 18} y2={cy - Math.sin(rad) * 18} stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="9" fill={INK} />
      <circle cx={cx} cy={cy} r="4" fill={PAPER_HI} />
    </g>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 1) AcGauge — EL MANÓMETRO MANDA. El relojito del kit con la zona ROJA baja (vacío),
//    la zona VERDE del medio (correcta) y la ROJA alta (sobrecarga). La aguja arranca en
//    el rojo bajo y SUBE de a poco hasta clavarse en el verde y quedarse ahí latiendo.
//    Remate: "Mirá el reloj, no la lata." Contra-etiquetas de las tres zonas.
// ══════════════════════════════════════════════════════════════════════════════
export const AcGauge: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "El manómetro te dice cuándo parar" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  // la aguja sube desde el rojo bajo (0.06) al centro verde (0.5) entre 0.6s y 3.0s
  const riseP = easeInOut(interpolate(f, [fps * 0.6, fps * 3.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const inGreen = interpolate(f, [fps * 2.7, fps * 3.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // respiración suave al llegar al verde
  const breathe = riseP > 0.98 ? 0.012 * Math.sin(f * 0.18) : 0;
  const needle = 0.06 + riseP * (0.5 - 0.06) + breathe;
  const lab = (d: number) => interpolate(f, [fps * d, fps * (d + 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = 500, cy = 300, R = 170;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Eyebrow text="Cargá hasta el verde · ni una pizca más" f={f} fps={fps} />
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 8, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="1000" height="560" viewBox="0 0 1000 560" style={{ overflow: "visible" }}>
          <GaugeFace cx={cx} cy={cy} R={R} needle={needle} glow={inGreen} />
          {/* etiquetas de las tres zonas */}
          <g opacity={lab(0.7)}>
            <text x={cx - R - 40} y={cy + 96} textAnchor="middle" fontFamily={SANS} fontSize="24" fontWeight="800" fill={TERRA_HI}>VACÍO</text>
            <text x={cx - R - 40} y={cy + 122} textAnchor="middle" fontFamily={SANS} fontSize="18" fontWeight="700" fill={PAPER}>le falta gas</text>
          </g>
          <g opacity={lab(2.6)}>
            <text x={cx} y={cy - R - 26} textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="900" fill={SAGE_HI}>ZONA CORRECTA</text>
            <text x={cx} y={cy - R - 2} textAnchor="middle" fontFamily={SANS} fontSize="19" fontWeight="700" fill={PAPER}>parás acá</text>
          </g>
          <g opacity={lab(1.1)}>
            <text x={cx + R + 40} y={cy + 96} textAnchor="middle" fontFamily={SANS} fontSize="24" fontWeight="800" fill={TERRA_HI}>DE MÁS</text>
            <text x={cx + R + 40} y={cy + 122} textAnchor="middle" fontFamily={SANS} fontSize="18" fontWeight="700" fill={PAPER}>peligro</text>
          </g>
          {/* flecha "sube" que acompaña la aguja al principio */}
          <g opacity={interpolate(f, [fps * 0.8, fps * 1.2, fps * 2.9, fps * 3.2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <path d={`M ${cx + 250} ${cy + 60} q 30 -70 8 -150`} fill="none" stroke={SAGE_HI} strokeWidth="4" strokeDasharray="6 8" />
            <path d={`M ${cx + 250} ${cy + 60} l -8 -18 l 20 6 Z`} fill={SAGE_HI} />
          </g>
        </svg>
        <div style={{ marginTop: 6, fontFamily: SANS, color: SAGE_HI, fontSize: 32, fontWeight: 800, fontStyle: "italic", opacity: interpolate(f, [fps * 3.0, fps * 3.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>Mirá el reloj, no la lata.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 2) AcPorts — LOS DOS PUERTOS. Un tramo del circuito con el compresor al centro. A la
//    IZQUIERDA el puerto de BAJA (caño GRUESO, tapa 'L', remarcado en VERDE, el conector
//    del kit calza con un clic). A la DERECHA el de ALTA (caño FINO, tapa 'H', remarcado
//    en ROJO, prohibición, el mismo conector NO entra). Baja=tuyo, alta=peligro.
// ══════════════════════════════════════════════════════════════════════════════
export const AcPorts: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "Dónde SÍ y dónde NUNCA" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const inL = spring({ frame: f - 6, fps, config: { damping: 15, stiffness: 120, mass: 0.8 } });
  const inR = spring({ frame: f - 14, fps, config: { damping: 15, stiffness: 120, mass: 0.8 } });
  // el conector del kit desciende y CALZA en la baja (con un clic ~1.6s)
  const clickP = easeInOut(interpolate(f, [fps * 1.0, fps * 1.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const clickPop = f >= Math.round(fps * 1.7) && f < Math.round(fps * 1.9) ? 1 : 0;
  // el conector rebota en la alta (no calza) ~2.6s
  const bounce = interpolate(f, [fps * 2.3, fps * 2.6, fps * 2.9], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lab = (d: number) => interpolate(f, [fps * d, fps * (d + 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // un puerto (válvula tipo pico con tapa + caño). thick = caño grueso.
  const Port: React.FC<{ x: number; low: boolean; inP: number }> = ({ x, low, inP }) => {
    const col = low ? SAGE : TERRA;
    const pipeW = low ? 46 : 24;
    const Y = 300;
    return (
      <g transform={`translate(0,0)`} opacity={inP} style={{ transform: `translateY(${(1 - inP) * 40}px)` }}>
        {/* caño (grueso vs fino) que baja del compresor central */}
        <rect x={x - pipeW / 2} y={Y} width={pipeW} height={150} rx={pipeW / 2} fill={STEEL} stroke={INK} strokeWidth="3" />
        <rect x={x - pipeW / 2 + 4} y={Y + 6} width={6} height={138} rx={3} fill={STEEL_HI} opacity="0.7" />
        {/* pico de válvula con tapa (L/H) */}
        <rect x={x - 20} y={Y - 40} width={40} height={46} rx="8" fill="#5c574e" stroke={INK} strokeWidth="3" />
        <circle cx={x} cy={Y - 44} r="22" fill={PAPER} stroke={col} strokeWidth="4" />
        <text x={x} y={Y - 36} textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="900" fill={col}>{low ? "L" : "H"}</text>
        {/* aro de énfasis (verde/rojo) alrededor del pico */}
        <circle cx={x} cy={Y - 44} r="40" fill="none" stroke={col} strokeWidth="3" strokeDasharray="6 7" opacity={0.85 * inP} />
      </g>
    );
  };

  const LX = 300, HX = 700, Y = 300;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={15} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Eyebrow text="Los dos puertos de carga" f={f} fps={fps} />
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 6, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="1000" height="560" viewBox="0 0 1000 560" style={{ overflow: "visible" }}>
          {/* compresor central del que salen los dos caños */}
          <g opacity={easeOut(Math.min(1, f / (fps * 0.5)))}>
            <rect x={LX} y={Y - 40} width={HX - LX} height={70} rx="14" fill={STEEL} stroke={INK} strokeWidth="3" />
            <ellipse cx={500} cy={Y - 5} rx="46" ry="30" fill="#6f6a60" stroke={INK} strokeWidth="3" />
            <ellipse cx={500} cy={Y - 5} rx="18" ry="12" fill={STEEL_HI} />
            <text x={500} y={Y - 56} textAnchor="middle" fontFamily={SANS} fontSize="22" fontWeight="800" fill={PAPER}>compresor</text>
          </g>

          <Port x={LX} low inP={inL} />
          <Port x={HX} low={false} inP={inR} />

          {/* CONECTOR del kit que baja y CALZA en la baja (izq) */}
          <g transform={`translate(${LX}, ${Y - 44 - 150 + clickP * 150})`} opacity={inL}>
            <rect x="-18" y="-60" width="36" height="56" rx="8" fill={COLD} stroke={INK} strokeWidth="3" />
            <rect x="-26" y="-8" width="52" height="18" rx="6" fill="#3f6580" stroke={INK} strokeWidth="3" />
            {/* manguera */}
            <path d={`M 0 -60 q 60 -40 130 -30`} fill="none" stroke={COLD} strokeWidth="8" strokeLinecap="round" opacity="0.9" />
          </g>
          {/* clic al calzar */}
          {clickPop > 0 && (
            <text x={LX + 70} y={Y - 70} fontFamily={SANS} fontSize="30" fontWeight="900" fill={SAGE_HI}>clic ✓</text>
          )}

          {/* CONECTOR fantasma que REBOTA en la alta (no entra) */}
          {bounce > 0.02 && (
            <g transform={`translate(${HX}, ${Y - 44 - 70 - bounce * 26})`} opacity={0.9}>
              <rect x="-18" y="-56" width="36" height="52" rx="8" fill={COLD} stroke={INK} strokeWidth="3" />
              <text x={0} y="-72" textAnchor="middle" fontFamily={SANS} fontSize="30" fontWeight="900" fill={TERRA_HI}>no entra ✕</text>
            </g>
          )}

          {/* etiquetas SÍ / NO */}
          <g opacity={lab(1.7)}>
            <rect x={LX - 130} y={Y + 160} width={260} height={72} rx="12" fill={PAPER} stroke={SAGE} strokeWidth="4" />
            <text x={LX} y={Y + 190} textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="900" fill={SAGE}>BAJA · caño grueso</text>
            <text x={LX} y={Y + 216} textAnchor="middle" fontFamily={SANS} fontSize="20" fontWeight="700" fill={INK}>acá cargás vos</text>
          </g>
          <g opacity={lab(2.5)}>
            <rect x={HX - 130} y={Y + 160} width={260} height={72} rx="12" fill={PAPER} stroke={TERRA} strokeWidth="4" />
            <text x={HX} y={Y + 190} textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="900" fill={TERRA}>ALTA · caño fino</text>
            <text x={HX} y={Y + 216} textAnchor="middle" fontFamily={SANS} fontSize="20" fontWeight="700" fill={INK}>nunca la tocás</text>
          </g>
        </svg>
        <div style={{ marginTop: 6, fontFamily: SANS, color: SAGE_HI, fontSize: 30, fontWeight: 800, opacity: interpolate(f, [fps * 3.0, fps * 3.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>La 'L' es tuya. La 'H', jamás.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 3) AcOverfill — EL ERROR: SOBRECARGAR. Un manómetro cuya aguja, en vez de parar en el
//    verde, SIGUE y se dispara a la zona ROJA alta (con un temblor). El compresor al lado
//    RECALIENTA (ondas de calor + tinte rojo). Tarjeta/sello con peso: enfría PEOR + rompés
//    el compresor sano. "Más gas, más frío" = mentira.
// ══════════════════════════════════════════════════════════════════════════════
export const AcOverfill: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "Más gas NO es más frío" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  // la aguja pasa de largo el verde (0.5) y se dispara al rojo alto (~0.94) entre 0.6 y 2.6s
  const push = easeInOut(interpolate(f, [fps * 0.6, fps * 2.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const overshoot = f > fps * 2.6 ? 0.02 * Math.sin(f * 0.7) : 0; // temblor en el tope
  const needle = 0.5 + push * (0.94 - 0.5) + overshoot;
  const heat = interpolate(f, [fps * 1.8, fps * 3.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // el compresor recalienta
  const stampP = interpolate(f, [fps * 3.2, fps * 3.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = 400, cy = 290, R = 150;
  // compresor al costado
  const compX = 760, compY = 290;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={15} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Eyebrow text="El error: sobrecargar" f={f} fps={fps} />
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 6, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="1000" height="560" viewBox="0 0 1000 560" style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="acHeatGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor={TERRA_HI} stopOpacity="0.8" /><stop offset="1" stopColor={TERRA} stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* manómetro que se dispara al rojo alto */}
          <GaugeFace cx={cx} cy={cy} R={R} needle={needle} />
          {/* etiqueta "por las nubes" cuando llega al rojo */}
          <g opacity={interpolate(f, [fps * 2.3, fps * 2.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <path d={`M ${cx + R - 6} ${cy - R + 30} q 70 -30 130 -70`} fill="none" stroke={TERRA_HI} strokeWidth="4" strokeDasharray="6 8" />
            <text x={cx + R + 120} y={cy - R - 46} textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="900" fill={TERRA_HI}>por las nubes</text>
          </g>

          {/* COMPRESOR que recalienta */}
          <g>
            {heat > 0.05 && <ellipse cx={compX} cy={compY} rx={110 * heat} ry={110 * heat} fill="url(#acHeatGlow)" opacity={heat} />}
            <rect x={compX - 70} y={compY - 60} width={140} height={120} rx="16" fill={STEEL} stroke={INK} strokeWidth="4" style={{ mixBlendMode: "normal" }} />
            {/* tinte rojo del recalentamiento */}
            {heat > 0.05 && <rect x={compX - 70} y={compY - 60} width={140} height={120} rx="16" fill={TERRA} opacity={0.5 * heat} />}
            <ellipse cx={compX} cy={compY} rx="34" ry="34" fill="#6f6a60" stroke={INK} strokeWidth="3" />
            {/* ondas de calor que suben */}
            {heat > 0.2 && Array.from({ length: 3 }).map((_, i) => {
              const ph = ((f * 0.03 + i * 0.33) % 1);
              return <path key={i} d={`M ${compX - 30 + i * 30} ${compY - 62} q 12 -20 -4 -40 q -12 -18 8 -38`} fill="none" stroke={TERRA_HI} strokeWidth="3" opacity={Math.sin(ph * Math.PI) * heat * 0.8} />;
            })}
            <text x={compX} y={compY + 96} textAnchor="middle" fontFamily={SANS} fontSize="24" fontWeight="800" fill={heat > 0.5 ? TERRA_HI : PAPER} opacity={interpolate(f, [fps * 1.6, fps * 2.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>compresor forzado</text>
          </g>
        </svg>
        {/* sello con peso: el error */}
        <div style={{ fontFamily: SANS, color: "#fff", background: "rgba(160,60,44,0.94)", fontSize: 36, fontWeight: 900, padding: "14px 38px", borderRadius: 14, borderLeft: `7px solid ${PAPER}`, boxShadow: "0 18px 46px rgba(0,0,0,0.6)", opacity: stampP, transform: `translateY(${(1 - stampP) * 24}px) scale(${0.92 + 0.08 * easeOut(stampP)})`, textShadow: "0 2px 10px rgba(0,0,0,0.5)", textAlign: "center", maxWidth: 820 }}>De más → se ahoga → enfría PEOR y rompés el compresor sano</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 4) AcSteps — LOS PASOS DE LA RECARGA que entran escalonados (sello de tinta: scale-down
//    + leve rotación al asentar). 4 fichas: conectar el coupler a la BAJA → motor en marcha
//    + aire al máximo → cargar de a poco mirando el manómetro → medir la rejilla (30°→6°).
//    Cada ficha con su ícono a medida (SVG) y número. La última se resalta (el payoff).
// ══════════════════════════════════════════════════════════════════════════════
export const AcSteps: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "La recarga, paso a paso" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const steps = [
    { n: "1", name: "Conectás la BAJA", sub: "el coupler hace clic", icon: "plug" as const, key: false },
    { n: "2", name: "Motor + aire al máximo", sub: "el compresor pide gas", icon: "fan" as const, key: false },
    { n: "3", name: "De a poco, mirando el reloj", sub: "un poquito, parás, mirás", icon: "gauge" as const, key: false },
    { n: "4", name: "Medís la rejilla", sub: "de 30° a 6°", icon: "therm" as const, key: true },
  ];
  const dim = interpolate(f, [fps * 3.0, fps * 3.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + 0.03 * Math.sin(f * 0.16);

  const StepIcon: React.FC<{ kind: "plug" | "fan" | "gauge" | "therm"; on: boolean }> = ({ kind, on }) => {
    const c = on ? SAGE : COLD;
    if (kind === "plug") return (<g><rect x="-14" y="-22" width="28" height="30" rx="6" fill={c} stroke={INK} strokeWidth="2.5" /><rect x="-22" y="6" width="44" height="12" rx="4" fill="#3f6580" stroke={INK} strokeWidth="2.5" /><line x1="-6" y1="-30" x2="-6" y2="-22" stroke={INK} strokeWidth="3" /><line x1="6" y1="-30" x2="6" y2="-22" stroke={INK} strokeWidth="3" /></g>);
    if (kind === "fan") return (<g>{[0, 1, 2, 3].map((k) => <ellipse key={k} cx="0" cy="0" rx="8" ry="20" fill={c} opacity="0.9" transform={`rotate(${k * 45})`} />)}<circle cx="0" cy="0" r="6" fill={INK} /></g>);
    if (kind === "gauge") return (<g><circle cx="0" cy="0" r="22" fill={PAPER} stroke={INK} strokeWidth="2.5" /><path d="M -18 8 A 20 20 0 0 1 -6 -18" fill="none" stroke={TERRA} strokeWidth="5" /><path d="M -6 -18 A 20 20 0 0 1 18 4" fill="none" stroke={SAGE} strokeWidth="5" /><line x1="0" y1="0" x2="8" y2="-14" stroke={INK} strokeWidth="3" strokeLinecap="round" /><circle cx="0" cy="0" r="3" fill={INK} /></g>);
    // therm
    return (<g><rect x="-6" y="-24" width="12" height="34" rx="6" fill={PAPER} stroke={INK} strokeWidth="2.5" /><circle cx="0" cy="14" r="11" fill={c} stroke={INK} strokeWidth="2.5" /><rect x="-3" y="-8" width="6" height="20" rx="3" fill={c} /></g>);
  };

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Eyebrow text="Con el auto en marcha y el aire al máximo" f={f} fps={fps} />
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 48, fontWeight: 800, marginBottom: 30, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <div style={{ display: "flex", gap: 26, alignItems: "stretch" }}>
          {steps.map((st, i) => {
            const s = spring({ frame: f - (6 + i * 13), fps, config: { damping: 13, stiffness: 160, mass: 0.8 } });
            const settleRot = interpolate(s, [0, 1], [i % 2 ? 6 : -6, i % 2 ? 1.2 : -1.2]);
            const isKey = st.key;
            const faded = !isKey ? 1 - 0.5 * dim : 1;
            const scaleKey = isKey ? (1 + 0.08 * dim) * pulse : 1;
            return (
              <div key={i} style={{ position: "relative", opacity: s * faded, transform: `translateY(${(1 - s) * 44}px) rotate(${settleRot}deg) scale(${(0.75 + 0.25 * s) * scaleKey})`, transformOrigin: "center bottom" }}>
                <div style={{ width: 226, background: PAPER, borderRadius: 16, padding: "24px 20px", textAlign: "center", boxShadow: isKey ? `0 24px 60px rgba(0,0,0,0.55), 0 0 0 4px ${SAGE}66` : "0 18px 44px rgba(0,0,0,0.5)", border: `2px solid ${isKey ? SAGE : "rgba(42,38,32,0.18)"}` }}>
                  {/* número en chapa */}
                  <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", width: 40, height: 40, borderRadius: "50%", background: isKey ? SAGE : INK, color: PAPER_HI, display: "grid", placeItems: "center", fontFamily: SANS, fontSize: 24, fontWeight: 900, border: `3px solid ${PAPER}`, boxShadow: "0 6px 16px rgba(0,0,0,0.4)" }}>{st.n}</div>
                  <svg width="70" height="70" viewBox="-35 -35 70 70" style={{ marginTop: 12 }}><StepIcon kind={st.icon} on={isKey} /></svg>
                  <div style={{ fontFamily: SANS, color: INK, fontSize: 24, fontWeight: 800, marginTop: 10, lineHeight: 1.1 }}>{st.name}</div>
                  <div style={{ fontFamily: SANS, color: isKey ? SAGE : "rgba(42,38,32,0.6)", fontSize: 19, fontWeight: 700, marginTop: 6 }}>{st.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 40, fontFamily: SANS, color: SAGE_HI, fontSize: 32, fontWeight: 800, opacity: interpolate(f, [fps * 3.4, fps * 3.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateY(${(1 - interpolate(f, [fps * 3.4, fps * 3.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) * 14}px)`, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>De horno a heladera, en 20 minutos.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 5) AcCircuit — EL CIRCUITO CERRADO. Un anillo de caño que se muerde la cola, con el GAS
//    (puntitos) dando toda la vuelta. Tres piezas etiquetadas en el anillo: COMPRESOR
//    (aprieta), CONDENSADOR (suelta calor, tinte cálido) y EVAPORADOR (se pone helado,
//    tinte frío + escarcha). En una junta, una fuga LENTA (flechitas). "El 80% es gas bajo."
// ══════════════════════════════════════════════════════════════════════════════
export const AcCircuit: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "Un circuito cerrado de gas" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const draw = easeInOut(interpolate(f, [fps * 0.5, fps * 2.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })); // el anillo se dibuja
  const leakP = interpolate(f, [fps * 2.8, fps * 3.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // fuga lenta aparece
  const lab = (d: number) => interpolate(f, [fps * d, fps * (d + 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = 500, cy = 285, RX = 240, RY = 170;
  // punto sobre la elipse a un ángulo t (0..1)
  const P = (t: number) => ({ x: cx + Math.cos(t * Math.PI * 2 - Math.PI / 2) * RX, y: cy + Math.sin(t * Math.PI * 2 - Math.PI / 2) * RY });
  // piezas ancladas a posiciones del anillo
  const comp = P(0.0), cond = P(0.34), evap = P(0.66);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Eyebrow text="No fabrica frío de la nada: mueve un gas" f={f} fps={fps} />
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 6, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="1000" height="560" viewBox="0 0 1000 560" style={{ overflow: "visible" }}>
          {/* ANILLO de caño que se dibuja (se muerde la cola) */}
          <ellipse cx={cx} cy={cy} rx={RX} ry={RY} fill="none" stroke={STEEL} strokeWidth="18" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} strokeLinecap="round" />
          <ellipse cx={cx} cy={cy} rx={RX} ry={RY} fill="none" stroke={INK} strokeWidth="2" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} opacity="0.5" />
          {/* GAS: puntitos que dan la vuelta (frío en el evaporador, cálido en el condensador) */}
          {draw > 0.9 && Array.from({ length: 22 }).map((_, i) => {
            const t = ((f * 0.006 + i / 22) % 1);
            const p = P(t);
            // color según la zona del anillo
            const col = t > 0.2 && t < 0.48 ? HEAT : t > 0.52 && t < 0.8 ? COLD_HI : PAPER_HI;
            return <circle key={i} cx={p.x} cy={p.y} r={3.4} fill={col} opacity="0.9" />;
          })}
          {/* flecha de dirección */}
          {draw > 0.95 && (() => { const a = P(0.16); return <text x={a.x + 30} y={a.y} fontFamily={SANS} fontSize="30" fontWeight="900" fill={PAPER}>↻</text>; })()}

          {/* COMPRESOR (arriba) */}
          <g opacity={lab(1.8)}>
            <rect x={comp.x - 46} y={comp.y - 30} width={92} height={60} rx="12" fill={STEEL} stroke={INK} strokeWidth="3" />
            <ellipse cx={comp.x} cy={comp.y} rx="16" ry="16" fill="#6f6a60" stroke={INK} strokeWidth="2.5" />
            <text x={comp.x} y={comp.y - 44} textAnchor="middle" fontFamily={SANS} fontSize="22" fontWeight="800" fill={PAPER}>Compresor</text>
            <text x={comp.x} y={comp.y + 52} textAnchor="middle" fontFamily={SANS} fontSize="17" fontWeight="700" fill={SAGE_HI}>aprieta el gas</text>
          </g>
          {/* CONDENSADOR (der) — suelta calor */}
          <g opacity={lab(2.1)}>
            <rect x={cond.x - 34} y={cond.y - 34} width={68} height={68} rx="8" fill={HEAT} stroke={INK} strokeWidth="3" opacity="0.85" />
            {[0, 1, 2].map((k) => <line key={k} x1={cond.x - 26} y1={cond.y - 20 + k * 18} x2={cond.x + 26} y2={cond.y - 20 + k * 18} stroke="rgba(42,38,32,0.4)" strokeWidth="3" />)}
            <text x={cond.x + 66} y={cond.y - 8} fontFamily={SANS} fontSize="22" fontWeight="800" fill={PAPER}>Condensador</text>
            <text x={cond.x + 66} y={cond.y + 18} fontFamily={SANS} fontSize="17" fontWeight="700" fill={TERRA_HI}>suelta el calor afuera</text>
          </g>
          {/* EVAPORADOR (izq) — se pone helado */}
          <g opacity={lab(2.4)}>
            <rect x={evap.x - 34} y={evap.y - 34} width={68} height={68} rx="8" fill={COLD} stroke={INK} strokeWidth="3" opacity="0.9" />
            {[0, 1, 2].map((k) => <line key={k} x1={evap.x - 26} y1={evap.y - 20 + k * 18} x2={evap.x + 26} y2={evap.y - 20 + k * 18} stroke="rgba(255,255,255,0.4)" strokeWidth="3" />)}
            {lab(2.4) > 0.5 && <FrostFall seed={23} f={f} x={evap.x} y={evap.y + 30} w={60} n={12} start={fps * 2.4} />}
            <text x={evap.x - 66} y={evap.y - 8} textAnchor="end" fontFamily={SANS} fontSize="22" fontWeight="800" fill={PAPER}>Evaporador</text>
            <text x={evap.x - 66} y={evap.y + 18} textAnchor="end" fontFamily={SANS} fontSize="17" fontWeight="700" fill={COLD_HI}>se pone helado, sopla frío</text>
          </g>

          {/* FUGA LENTA en una junta de abajo */}
          {leakP > 0.02 && (() => {
            const j = P(0.5); // junta abajo
            return (
              <g opacity={leakP}>
                <circle cx={j.x} cy={j.y} r="9" fill="none" stroke={TERRA} strokeWidth="3" />
                {Array.from({ length: 4 }).map((_, i) => {
                  const ph = ((f * 0.02 + i * 0.25) % 1);
                  return <circle key={i} cx={j.x + (i - 1.5) * 8} cy={j.y + 20 + ph * 26} r={2.6} fill={TERRA_HI} opacity={Math.sin(ph * Math.PI) * leakP} />;
                })}
                <text x={j.x} y={j.y + 70} textAnchor="middle" fontFamily={SANS} fontSize="20" fontWeight="800" fill={TERRA_HI}>pierde de a poco por las juntas</text>
              </g>
            );
          })()}
        </svg>
        <div style={{ marginTop: 4, fontFamily: SANS, color: SAGE_HI, fontSize: 32, fontWeight: 800, opacity: interpolate(f, [fps * 3.4, fps * 3.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>El 80% de las veces es gas bajo, no el compresor.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// (+) AcNameTag — lower-third rústico opcional para Tomás (pergamino + tinta). Cinta que
//    entra desde la izquierda + subrayado a mano. (por si no se reutiliza el genérico)
// ══════════════════════════════════════════════════════════════════════════════
export const AcNameTag: React.FC<{ durationInFrames: number; name?: string; role?: string; accent?: string }> = ({ durationInFrames, name = "Tomás", role = "El Constructor Libre", accent }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const a = ac(accent);
  const ribbon = spring({ frame: f - 3, fps, config: { damping: 17, stiffness: 90 } });
  const line = interpolate(f, [fps * 0.6, fps * 1.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "flex-end", paddingLeft: 120, paddingBottom: 120 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, transform: `translateX(${(1 - ribbon) * -90}px)`, opacity: ribbon }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: `linear-gradient(145deg, ${PAPER_HI}, ${STEEL_HI})`, display: "grid", placeItems: "center", boxShadow: "0 16px 36px rgba(0,0,0,0.5), inset 0 2px 6px rgba(255,255,255,0.4)", border: `3px solid ${PAPER}` }}>
            <span style={{ fontFamily: SANS, color: INK, fontSize: 46, fontWeight: 900 }}>{name.charAt(0)}</span>
          </div>
          <div>
            <div style={{ fontFamily: SANS, color: "#fff", fontSize: 58, fontWeight: 900, lineHeight: 1.02, textShadow: "0 3px 16px rgba(0,0,0,0.7)" }}>{name}</div>
            <div style={{ fontFamily: SANS, color: a === SAGE ? SAGE_HI : PAPER, fontSize: 28, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>{role}</div>
            <svg width="420" height="22" style={{ marginTop: 4, overflow: "visible" }}>
              <path d="M 4 12 q 100 10 210 5 t 200 -4" fill="none" stroke={a} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - easeOut(line)} />
            </svg>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
