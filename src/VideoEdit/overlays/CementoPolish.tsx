// CementoPolish.tsx — SET DE PULIDO de nivel cine para el video "cemento" (Constructor
// Libre, Tomás). Gemelo temático de MaderaPolish: mismo ADN (clip vivo detrás borroso +
// scrim; encima contenido premium serif/pergamino/tinta sepia, SVG a medida, springs
// suaves, determinista por frame). Acá los heroes son PROPIOS del cemento y la CAL:
//   1) CmRecipe    — la receta 1:1:6 (cemento gris → CAL blanca "el secreto" → arena)
//   2) CmYears     — barra 5 años (moderno) vs 2000 años (romano/con cal), count-up
//   3) CmSelfHeal  — la cal se autorrepara: microfisura que se cierra con carbonato
//   4) CmCure      — el curado: húmedo (fragua sano) vs secado rápido al sol (grietas)
//   5) CmError     — el error: + cemento + agua + secado = la máquina de grietas
//   (+) CmNameTag  — lower-third rústico opcional para Tomás
// CERO filtro retro, CERO shake, CERO flicker. Imágenes (staticFile) no video → seguro
// para el render por chunks del farm.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS } from "./ui";

// ── paleta de marca (idéntica a MaderaPolish para coherencia visual del canal) ──
const PAPER = "#efe7d3"; // pergamino
const PAPER_HI = "#f6f0e0"; // pergamino claro (luz)
const INK = "#2a2620"; // tinta marrón oscura
const SAGE = "#7C8A5A"; // salvia (sano/bueno)
const SAGE_HI = "#a9ba8c";
const TERRA = "#B0503C"; // terracota (grieta/peligro)
const TERRA_HI = "#e08a72";
const GOLD = "#c9a56a"; // acento cálido
// grises propios del cemento
const CEM = "#8f8c86"; // cemento gris fraguado
const CEM_HI = "#b4b0a8";
const LIME = "#f4efe4"; // cal (casi blanca, cálida)
const LIME_HI = "#ffffff";
const SANDC = "#cdae76"; // arena

const A: Record<string, string> = { sage: SAGE, green: SAGE, good: SAGE, terra: TERRA, red: TERRA, danger: TERRA, amber: "#c98a3c", gold: GOLD, blue: "#5a86a8", ink: INK };
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

// ── nube de polvillo (partículas deterministas, para desmorones) ──
const DustFall: React.FC<{ seed: number; f: number; x: number; y: number; w: number; n?: number; color?: string; start?: number }> = ({ seed, f, x, y, w, n = 22, color = "rgba(160,150,135,0.55)", start = 0 }) => {
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
        const sz = 1.4 + r2 * 2.6;
        return <circle key={i} cx={px} cy={py} r={sz} fill={color} opacity={op} />;
      })}
    </>
  );
};

// eyebrow superior compartido (uppercase, tracking)
const Eyebrow: React.FC<{ text: string; f: number; fps: number }> = ({ text, f, fps }) => (
  <div style={{ fontFamily: SANS, color: PAPER, fontSize: 27, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", opacity: easeOut(Math.min(1, f / (fps * 0.5))), marginBottom: 14, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>{text}</div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 1) CmRecipe — LA RECETA 1:1:6 (cemento : cal : arena).
//    3 baldes rústicos que se llenan de a uno al mencionarse. El del centro (CAL) es
//    el "secreto": entra resaltado, con un anillo salvia que pulsa + subrayado a mano
//    "el ingrediente perdido". Cada balde muestra su proporción en números grandes.
//    Escalonado por spring (idéntico ADN al set de madera). SVG a medida.
// ══════════════════════════════════════════════════════════════════════════════
export const CmRecipe: React.FC<{ durationInFrames: number; title?: string; note?: string; accent?: string }> = ({
  durationInFrames,
  title = "La mezcla vieja del revoque",
  note = "1 : 1 : 6 — el revoque que no se raja",
}) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const items = [
    { name: "Cemento", qty: "1", role: "agarre y velocidad", fill: CEM, fillHi: CEM_HI, key: false },
    { name: "Cal", qty: "1", role: "flexibilidad · se cura sola", fill: LIME, fillHi: LIME_HI, key: true },
    { name: "Arena", qty: "6", role: "el cuerpo", fill: SANDC, fillHi: "#e0c993", key: false },
  ];
  const noteP = interpolate(f, [fps * 2.0, fps * 2.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const underline = interpolate(f, [fps * 1.6, fps * 2.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + 0.03 * Math.sin(f * 0.16);

  // balde en SVG con nivel de llenado animado (fillP 0..1)
  const Bucket: React.FC<{ it: typeof items[number]; fillP: number; isKey: boolean }> = ({ it, fillP, isKey }) => {
    // trapecio del balde: ancho arriba 210, abajo 150, alto 200. Nivel sube de abajo.
    const topY = 40, botY = 240, level = botY - easeInOut(fillP) * (botY - topY - 14);
    return (
      <svg width="260" height="300" viewBox="0 0 260 300" style={{ overflow: "visible", filter: "drop-shadow(0 22px 40px rgba(0,0,0,0.5))" }}>
        <defs>
          <clipPath id={`bk_${it.name}`}><path d="M 27 40 L 233 40 L 213 240 L 47 240 Z" /></clipPath>
        </defs>
        {/* sombra en la mesa */}
        <ellipse cx="130" cy="262" rx="98" ry="16" fill="rgba(0,0,0,0.4)" />
        {/* material que llena el balde */}
        <g clipPath={`url(#bk_${it.name})`}>
          <rect x="20" y={level} width="220" height="220" fill={it.fill} />
          {/* superficie con textura granular */}
          <rect x="20" y={level} width="220" height="10" fill={it.fillHi} opacity="0.8" />
          {fillP > 0.05 && Array.from({ length: 26 }).map((_, i) => (
            <circle key={i} cx={40 + rnd(i * 3.7) * 180} cy={level + 8 + rnd(i * 5.1) * (botY - level - 8)} r={1.4 + rnd(i) * 2.2} fill={it.fillHi} opacity={0.25 + rnd(i) * 0.3} />
          ))}
        </g>
        {/* cuerpo del balde (pared metálica/plástica) */}
        <path d="M 27 40 L 233 40 L 213 240 L 47 240 Z" fill="none" stroke={INK} strokeWidth="4" />
        <path d="M 27 40 L 233 40 L 213 240 L 47 240 Z" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" transform="translate(2,2)" />
        {/* aro superior */}
        <ellipse cx="130" cy="40" rx="103" ry="16" fill="none" stroke={INK} strokeWidth="4" />
        <ellipse cx="130" cy="40" rx="103" ry="16" fill={fillP > 0.5 ? it.fill : "rgba(0,0,0,0.15)"} opacity="0.5" />
        {/* número de proporción grande, sobre el material */}
        <text x="130" y="170" textAnchor="middle" fontFamily={SANS} fontSize="96" fontWeight="900" fill={isKey ? INK : "rgba(42,38,32,0.85)"} opacity={easeOut(clamp01(fillP * 1.4))} style={{ mixBlendMode: "multiply" }}>{it.qty}</text>
      </svg>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={15} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 30, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <div style={{ display: "flex", gap: 40, alignItems: "flex-end" }}>
          {items.map((it, i) => {
            const s = spring({ frame: f - (6 + i * 16), fps, config: { damping: 15, stiffness: 130, mass: 0.8 } });
            const isKey = it.key;
            const scaleKey = isKey ? 1.08 * pulse : 1;
            return (
              <div key={i} style={{ position: "relative", opacity: s, transform: `translateY(${(1 - s) * 40}px) scale(${(0.85 + 0.15 * s) * scaleKey})`, transformOrigin: "bottom center" }}>
                {/* aureola salvia bajo la CAL (el secreto) */}
                {isKey && <div style={{ position: "absolute", left: "50%", top: 20, width: 250, height: 250, transform: "translateX(-50%)", borderRadius: "50%", background: `radial-gradient(circle, ${SAGE}44, transparent 68%)`, filter: "blur(2px)" }} />}
                <Bucket it={it} fillP={s} isKey={isKey} />
                <div style={{ textAlign: "center", marginTop: 2 }}>
                  <div style={{ fontFamily: SANS, color: isKey ? LIME_HI : PAPER, fontSize: 34, fontWeight: 800, textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>{it.name}</div>
                  <div style={{ fontFamily: SANS, color: isKey ? SAGE_HI : "rgba(239,231,211,0.72)", fontSize: 21, fontWeight: 600, marginTop: 2 }}>{it.role}</div>
                </div>
                {/* etiqueta "el ingrediente perdido" bajo la CAL */}
                {isKey && (
                  <div style={{ position: "absolute", left: "50%", bottom: -58, transform: "translateX(-50%)", opacity: underline }}>
                    <div style={{ fontFamily: SANS, color: INK, background: SAGE, fontSize: 20, fontWeight: 800, letterSpacing: 1, padding: "6px 16px", borderRadius: 20, whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}>el ingrediente perdido</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* sello inferior con la proporción */}
        <div style={{ marginTop: 78, fontFamily: SANS, color: INK, background: PAPER, fontSize: 34, fontWeight: 800, padding: "12px 32px", borderRadius: 12, borderLeft: `6px solid ${SAGE}`, boxShadow: "0 16px 40px rgba(0,0,0,0.5)", opacity: noteP, transform: `translateY(${(1 - noteP) * 22}px) scale(${0.94 + 0.06 * noteP})` }}>{note}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 2) CmYears — LA BARRA DE VIDA: 5 años (cemento puro moderno) vs 2000 años (romano/
//    con cal). Dos barras que crecen de izq→der con count-up de años. La de arriba
//    (moderno) se frena corta y se raja; la de abajo (romano) llena toda la pista con
//    un brillo dorado. Contraste brutal del ratio.
// ══════════════════════════════════════════════════════════════════════════════
export const CmYears: React.FC<{ durationInFrames: number; title?: string; low?: { label: string; years: number }; high?: { label: string; years: number }; accent?: string }> = ({
  durationInFrames,
  title = "Cuánto dura, según cómo lo mezcles",
  low = { label: "Cemento puro, hoy", years: 5 },
  high = { label: "Con cal, como los romanos", years: 2000 },
}) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const TRACK = 980, H = 96;
  // la barra baja (romana) marca la escala completa (2000 = 100%). la de arriba es
  // proporcional pero con un mínimo visible para que se lea "corta".
  const maxY = Math.max(low.years, high.years);
  const growLow = easeInOut(interpolate(f, [fps * 0.5, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const growHigh = easeInOut(interpolate(f, [fps * 1.2, fps * 3.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const lowFrac = Math.max(0.05, low.years / maxY);
  const lowW = TRACK * lowFrac * growLow;
  const highW = TRACK * (high.years / maxY) * growHigh;
  const lowCount = Math.round(low.years * growLow);
  const highCount = Math.round(high.years * growHigh);
  // la barra corta se raja al terminar
  const crack = interpolate(f, [fps * 1.5, fps * 2.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Bar: React.FC<{ label: string; w: number; count: number; danger: boolean; y: number; showCrack?: boolean }> = ({ label, w, count, danger, showCrack }) => (
    <div style={{ marginBottom: 34 }}>
      <div style={{ fontFamily: SANS, color: danger ? TERRA_HI : SAGE_HI, fontSize: 26, fontWeight: 800, marginBottom: 8, textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>{label}</div>
      <div style={{ position: "relative", width: TRACK, height: H, background: "rgba(30,24,16,0.55)", borderRadius: 12, border: "2px solid rgba(239,231,211,0.28)", overflow: "visible" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: w, borderRadius: 12, background: danger ? `linear-gradient(90deg, #8a3a2c, ${TERRA})` : `linear-gradient(90deg, ${GOLD}, #e0c07a)`, boxShadow: danger ? "none" : "0 0 28px rgba(224,192,122,0.55)" }}>
          {/* textura de bloques */}
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 34px)", borderRadius: 12 }} />
          {/* grieta al final de la barra corta */}
          {danger && showCrack && crack > 0.01 && (
            <svg width="40" height={H} style={{ position: "absolute", right: -6, top: 0, overflow: "visible" }}>
              <path d={`M 14 6 l -8 ${H * 0.28} l 12 ${H * 0.2} l -9 ${H * 0.34}`} fill="none" stroke="#1a120c" strokeWidth={3.4 * crack} opacity={crack} strokeLinejoin="round" />
            </svg>
          )}
        </div>
        {/* número de años flotando al borde de la barra */}
        <div style={{ position: "absolute", left: Math.min(w + 16, TRACK - 4), top: "50%", transform: "translateY(-50%)", fontFamily: SANS, color: "#fff", fontSize: 44, fontWeight: 900, textShadow: "0 2px 12px rgba(0,0,0,0.7)", whiteSpace: "nowrap" }}>
          {count.toLocaleString("es")} <span style={{ fontSize: 26, fontWeight: 700, color: PAPER }}>años</span>
        </div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Eyebrow text="El mismo material, distinto final" f={f} fps={fps} />
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 44, fontWeight: 800, marginBottom: 34, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <div>
          <Bar label={low.label} w={lowW} count={lowCount} danger y={0} showCrack />
          <Bar label={high.label} w={highW} count={highCount} danger={false} y={1} />
        </div>
        <div style={{ marginTop: 10, fontFamily: SANS, color: SAGE_HI, fontSize: 30, fontWeight: 800, opacity: interpolate(f, [fps * 3.2, fps * 3.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>No era mejor material: lo hacían flexible.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 3) CmSelfHeal — LA CAL SE AUTORREPARA. Corte de revoque de cal con una microfisura
//    fina que aparece; del aire bajan gotitas + "CO₂"; en la fisura crecen cristales
//    blancos de carbonato de calcio que la CIERRAN sola. 3 pasos anclados por tiempo.
//    Contra-ejemplo pequeño al costado: el cemento puro se queda rajado.
// ══════════════════════════════════════════════════════════════════════════════
export const CmSelfHeal: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "La cal se cura sola" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  // paso 1: aparece la microfisura (0.5–1.4s). paso 2: CO2/humedad entra (1.4–2.6s).
  // paso 3: cristales crecen y cierran (2.6–4.2s).
  const crackP = interpolate(f, [fps * 0.5, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const co2P = interpolate(f, [fps * 1.4, fps * 2.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const healP = interpolate(f, [fps * 2.6, fps * 4.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const healE = easeInOut(healP);
  const lab = (d: number) => interpolate(f, [fps * d, fps * (d + 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const BX = 150, BY = 150, BW = 560, BH = 340;
  // trazado de la fisura (quebrada, vertical)
  const crackPath = `M ${BX + BW * 0.5} ${BY} l -18 ${BH * 0.22} l 22 ${BH * 0.2} l -16 ${BH * 0.24} l 20 ${BH * 0.34}`;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 18, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="1000" height="560" viewBox="0 0 1000 560" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="limeBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#efe9dc" /><stop offset="1" stopColor="#d8d0bd" />
            </linearGradient>
            <radialGradient id="crystalGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#ffffff" /><stop offset="0.6" stopColor="#f4efe4" /><stop offset="1" stopColor="#f4efe400" />
            </radialGradient>
          </defs>
          {/* cuerpo del revoque de cal en corte */}
          <rect x={BX} y={BY} width={BW} height={BH} rx="10" fill="url(#limeBody)" stroke={INK} strokeWidth="3" />
          {/* textura del revoque */}
          {Array.from({ length: 40 }).map((_, i) => (
            <circle key={i} cx={BX + 20 + rnd(i * 3.1) * (BW - 40)} cy={BY + 20 + rnd(i * 5.7) * (BH - 40)} r={1 + rnd(i) * 2} fill="rgba(42,38,32,0.14)" />
          ))}
          {/* la MICROFISURA (se dibuja en paso 1, luego se cierra con healE) */}
          <path d={crackPath} fill="none" stroke="#2a2620" strokeWidth={interpolate(healE, [0, 1], [5, 0.4])} opacity={crackP * (1 - 0.85 * healE)} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - easeOut(crackP)} />
          {/* CO2 + humedad bajando del aire hacia la fisura */}
          {co2P > 0.02 && Array.from({ length: 9 }).map((_, i) => {
            const r0 = rnd(i * 4.1);
            const startX = BX + 140 + r0 * (BW - 280);
            const prog = clamp01(co2P * 1.2 - r0 * 0.3);
            const y = BY - 90 + prog * 110;
            return (
              <g key={i} opacity={Math.sin(prog * Math.PI) * (1 - 0.5 * healE)}>
                <circle cx={startX} cy={y} r={4 + rnd(i) * 3} fill="#5a86a8" opacity="0.7" />
              </g>
            );
          })}
          {co2P > 0.15 && (
            <text x={BX + BW * 0.5} y={BY - 58} textAnchor="middle" fontFamily={SANS} fontSize="30" fontWeight="800" fill="#7fa8c4" opacity={co2P * (1 - 0.6 * healE)}>CO₂ + humedad</text>
          )}
          {/* CRISTALES de carbonato de calcio que crecen y sellan la fisura */}
          {healP > 0.02 && Array.from({ length: 16 }).map((_, i) => {
            const seg = i / 16;
            const cy = BY + 12 + seg * (BH - 24);
            const jitter = Math.sin(seg * 7) * 22;
            const cx = BX + BW * 0.5 + jitter * (1 - seg * 0.2);
            const r = (5 + rnd(i) * 7) * clamp01(healP * 1.4 - seg * 0.25);
            if (r <= 0) return null;
            return <circle key={i} cx={cx} cy={cy} r={r} fill="url(#crystalGlow)" opacity={0.9} />;
          })}
          {/* destello cuando cierra */}
          {healP > 0.6 && (
            <path d={crackPath} fill="none" stroke="#ffffff" strokeWidth="3" opacity={(healP - 0.6) * 2 * (1 - (healP - 0.6) * 2)} strokeLinejoin="round" />
          )}
          {/* etiquetas de pasos */}
          <g opacity={lab(0.9)}>
            <line x1={BX + BW * 0.5 + 30} y1={BY + 60} x2={BX + BW + 60} y2={BY + 30} stroke={TERRA_HI} strokeWidth="3" />
            <text x={BX + BW + 68} y={BY + 24} fontFamily={SANS} fontSize="26" fontWeight="800" fill={TERRA_HI}>1 · aparece una microfisura</text>
          </g>
          <g opacity={lab(2.8)}>
            <line x1={BX + BW * 0.5} y1={BY + BH * 0.6} x2={BX + BW + 60} y2={BY + BH - 30} stroke={SAGE_HI} strokeWidth="3" />
            <circle cx={BX + BW * 0.5} cy={BY + BH * 0.6} r="6" fill={SAGE_HI} />
            <text x={BX + BW + 68} y={BY + BH - 46} fontFamily={SANS} fontSize="26" fontWeight="800" fill={SAGE_HI}>2 · la cal forma carbonato</text>
            <text x={BX + BW + 68} y={BY + BH - 16} fontFamily={SANS} fontSize="22" fontWeight="700" fill={PAPER}>y cierra la grieta sola</text>
          </g>
        </svg>
        {/* remate: el cemento puro NO hace esto */}
        <div style={{ marginTop: 8, fontFamily: SANS, color: TERRA_HI, fontSize: 28, fontWeight: 800, fontStyle: "italic", opacity: interpolate(f, [fps * 3.8, fps * 4.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>El cemento puro se raja… y se queda rajado para siempre.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 4) CmCure — EL CURADO: dos losas comparadas. IZQ secado rápido al sol (evaporación
//    veloz → grietas de retracción). DER curado húmedo tapado (agua reacciona por
//    dentro → maciza y sana). Sol que pega en una, gotas + tapa en la otra. Contador
//    de "días" y sellos SANA / RAJADA.
// ══════════════════════════════════════════════════════════════════════════════
export const CmCure: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "Secar ≠ fraguar" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const evap = interpolate(f, [fps * 0.6, fps * 2.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // izq pierde agua
  const cracks = interpolate(f, [fps * 1.8, fps * 3.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // izq se raja
  const keep = interpolate(f, [fps * 0.8, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // der se mantiene húmeda
  const stampP = interpolate(f, [fps * 3.2, fps * 3.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const days = Math.round(interpolate(f, [fps * 0.8, fps * 3.2], [0, 7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const lab = (d: number) => interpolate(f, [fps * d, fps * (d + 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Slab: React.FC<{ x: number; bad: boolean }> = ({ x, bad }) => {
    const W = 360, Y = 210, H = 150;
    return (
      <g transform={`translate(${x},0)`}>
        {/* sol sobre la mala / tapa sobre la buena */}
        {bad ? (
          <g opacity={easeOut(Math.min(1, f / (fps * 0.6)))}>
            <circle cx={W * 0.5} cy={70} r="34" fill="#e6b74e" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <line key={i} x1={W * 0.5 + Math.cos(a) * 44} y1={70 + Math.sin(a) * 44} x2={W * 0.5 + Math.cos(a) * 60} y2={70 + Math.sin(a) * 60} stroke="#e6b74e" strokeWidth="4" strokeLinecap="round" />;
            })}
          </g>
        ) : (
          <g opacity={keep}>
            {/* tapa de plástico/arpillera */}
            <rect x={-4} y={Y - 40} width={W + 8} height={30} rx="8" fill="#6e7f9a" stroke={INK} strokeWidth="2" />
            <rect x={20} y={Y - 34} width={W - 120} height={6} rx="3" fill="rgba(255,255,255,0.4)" />
          </g>
        )}
        {/* vapor que sube (mala) o gotas retenidas (buena) */}
        {bad
          ? Array.from({ length: 7 }).map((_, i) => {
              const r0 = rnd(i * 5.3);
              const prog = ((f * 0.02 + r0) % 1);
              return <path key={i} d={`M ${60 + i * 40} ${Y - 6} q 8 -30 -4 -60`} fill="none" stroke="rgba(210,210,210,0.5)" strokeWidth="3" opacity={Math.sin(prog * Math.PI) * evap * 0.8} />;
            })
          : Array.from({ length: 10 }).map((_, i) => (
              <circle key={i} cx={40 + rnd(i * 3.1) * (W - 80)} cy={Y + 30 + rnd(i * 7.7) * (H - 60)} r={4 + rnd(i) * 3} fill="#5a86a8" opacity={0.4 + 0.45 * keep} />
            ))}
        {/* cuerpo de la losa */}
        <rect x={0} y={Y} width={W} height={H} rx="8" fill={bad ? "#b8b2a4" : GOLD} stroke={INK} strokeWidth="3" />
        {/* grietas de retracción (mala) */}
        {bad && cracks > 0.02 && (
          <g stroke="#1a120c" strokeWidth={2.6 * cracks} fill="none" opacity={cracks} strokeLinejoin="round">
            <path d={`M ${W * 0.3} ${Y} l 12 40 l -16 30 l 10 50`} />
            <path d={`M ${W * 0.62} ${Y + 4} l -14 44 l 18 34 l -8 46`} />
            <path d={`M ${W * 0.2} ${Y + 70} l 60 8 l 50 -12`} />
          </g>
        )}
        {/* la buena: reacción por dentro (engranaje sutil de cristales) */}
        {!bad && Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={30 + rnd(i * 4.3) * (W - 60)} cy={Y + 24 + rnd(i * 2.9) * (H - 48)} r={2 + rnd(i) * 2} fill="#e0c07a" opacity={0.5 * keep} />
        ))}
        {/* sello SANA / RAJADA */}
        <g opacity={stampP} transform={`translate(${W * 0.5}, ${Y + H + 44}) rotate(${bad ? -3 : 2})`}>
          <rect x="-92" y="-30" width="184" height="52" rx="10" fill={PAPER} stroke={bad ? TERRA : SAGE} strokeWidth="4" />
          <text x="0" y="8" textAnchor="middle" fontFamily={SANS} fontSize="30" fontWeight="900" fill={bad ? TERRA : SAGE}>{bad ? "RAJADA" : "SANA"}</text>
        </g>
        {/* etiqueta superior */}
        <text x={W * 0.5} y={Y - 58} textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="800" fill={bad ? TERRA_HI : SAGE_HI} opacity={lab(bad ? 1.0 : 1.4)}>{bad ? "Secado rápido al sol" : "Curado húmedo, tapado"}</text>
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Eyebrow text="La reacción necesita agua y días" f={f} fps={fps} />
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 6, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="1000" height="500" viewBox="0 0 1000 500" style={{ overflow: "visible" }}>
          <Slab x={40} bad />
          {/* separador vertical */}
          <line x1="500" y1="120" x2="500" y2="440" stroke="rgba(239,231,211,0.3)" strokeWidth="2" strokeDasharray="6 8" />
          <Slab x={560} bad={false} />
        </svg>
        <div style={{ marginTop: 4, fontFamily: SANS, color: "#5a86a8", fontSize: 32, fontWeight: 800, opacity: interpolate(f, [fps * 0.8, fps * 1.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>Curá húmedo · {days} días</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 5) CmError — EL ERROR: la máquina de hacer grietas. Una losa al centro con TRES
//    flechas rojas grandes tirando de ella a la vez, cada una etiquetada (mucho
//    cemento → retracción, mucha agua → porosidad, secado al sol → grietas). Al
//    juntarse las tres, la losa se cuartea con una red de grietas. Sello/tarjeta con peso.
// ══════════════════════════════════════════════════════════════════════════════
export const CmError: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "La máquina perfecta de hacer grietas" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const forces = [
    { label: "Mucho cemento", sub: "retracción", ang: -140 },
    { label: "Mucha agua", sub: "porosidad", ang: -40 },
    { label: "Secado al sol", sub: "grietas", ang: 90 },
  ];
  // cada fuerza entra escalonada; cuando las 3 están, la losa se cuartea
  const forceP = (i: number) => easeOut(interpolate(f, [fps * (0.5 + i * 0.5), fps * (1.2 + i * 0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const shatter = interpolate(f, [fps * 2.3, fps * 3.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampP = interpolate(f, [fps * 3.4, fps * 4.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = 500, cy = 270, R = 120;
  // temblor sutil de la losa mientras la estiran (decae)
  const shake = Math.sin(f * 0.7) * interpolate(f, [fps * 1.0, fps * 3.4], [3, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={15} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Eyebrow text="El error: las tres fuerzas juntas" f={f} fps={fps} />
        <svg width="1000" height="600" viewBox="0 0 1000 600" style={{ overflow: "visible" }}>
          <defs>
            <marker id="cmArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={TERRA} />
            </marker>
          </defs>
          {/* losa central */}
          <g transform={`translate(${shake},0)`}>
            <rect x={cx - R} y={cy - R * 0.7} width={R * 2} height={R * 1.4} rx="10" fill={GOLD} stroke={INK} strokeWidth="3" />
            {[0, 1, 2].map((k) => <line key={k} x1={cx - R} y1={cy - R * 0.35 + k * (R * 0.7)} x2={cx + R} y2={cy - R * 0.35 + k * (R * 0.7)} stroke="rgba(42,38,32,0.18)" strokeWidth="2" />)}
            {/* red de grietas cuando se cuartea */}
            {shatter > 0.02 && (
              <g stroke="#1a120c" strokeWidth={2.6 * shatter} fill="none" opacity={shatter} strokeLinejoin="round">
                <path d={`M ${cx} ${cy - R * 0.7} L ${cx - 8} ${cy} L ${cx + 14} ${cy + R * 0.7}`} />
                <path d={`M ${cx - R} ${cy} L ${cx - 8} ${cy} L ${cx + 40} ${cy - 20} L ${cx + R} ${cy - 10}`} />
                <path d={`M ${cx - 8} ${cy} L ${cx - 50} ${cy + 40} L ${cx - R} ${cy + R * 0.5}`} />
                <path d={`M ${cx + 14} ${cy + R * 0.7} L ${cx + 50} ${cy + 20} L ${cx + R} ${cy + R * 0.4}`} />
              </g>
            )}
            {shatter > 0.5 && <DustFall seed={91} f={f} x={cx} y={cy + R * 0.7} w={R * 1.6} n={18} start={fps * 2.6} />}
          </g>
          {/* las tres flechas tirando hacia afuera */}
          {forces.map((fc, i) => {
            const p = forceP(i);
            const a = (fc.ang * Math.PI) / 180;
            const x0 = cx + Math.cos(a) * (R + 6);
            const y0 = cy + Math.sin(a) * (R * 0.7 + 6);
            const x1 = cx + Math.cos(a) * (R + 6 + 150 * p);
            const y1 = cy + Math.sin(a) * (R * 0.7 + 6 + 150 * p);
            // etiqueta al final de la flecha
            const lx = cx + Math.cos(a) * (R + 210);
            const ly = cy + Math.sin(a) * (R * 0.7 + 210);
            return (
              <g key={i} opacity={p}>
                <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={TERRA} strokeWidth="7" markerEnd="url(#cmArrow)" strokeLinecap="round" />
                <g transform={`translate(${lx},${ly})`}>
                  <rect x="-104" y="-34" width="208" height="66" rx="12" fill={PAPER} stroke={TERRA} strokeWidth="3" transform={`translate(${lx > cx ? 6 : -6},0)`} />
                  <text x={lx > cx ? 6 : -6} y="-6" textAnchor="middle" fontFamily={SANS} fontSize="27" fontWeight="900" fill={INK}>{fc.label}</text>
                  <text x={lx > cx ? 6 : -6} y="20" textAnchor="middle" fontFamily={SANS} fontSize="20" fontWeight="700" fill={TERRA}>→ {fc.sub}</text>
                </g>
              </g>
            );
          })}
        </svg>
        {/* sello con peso: el título como tarjeta que golpea */}
        <div style={{ fontFamily: SANS, color: "#fff", background: "rgba(160,60,44,0.94)", fontSize: 40, fontWeight: 900, padding: "14px 40px", borderRadius: 14, borderLeft: `7px solid ${PAPER}`, boxShadow: "0 18px 46px rgba(0,0,0,0.6)", opacity: stampP, transform: `translateY(${(1 - stampP) * 26}px) scale(${0.92 + 0.08 * easeOut(stampP)})`, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{title}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// (+) CmNameTag — lower-third rústico opcional para Tomás (pergamino + tinta), por si
//    no se reutiliza el genérico. Cinta que entra desde la izquierda + subrayado a mano.
// ══════════════════════════════════════════════════════════════════════════════
export const CmNameTag: React.FC<{ durationInFrames: number; name?: string; role?: string; accent?: string }> = ({ durationInFrames, name = "Tomás", role = "El Constructor Libre", accent }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const a = ac(accent);
  const ribbon = spring({ frame: f - 3, fps, config: { damping: 17, stiffness: 90 } });
  const line = interpolate(f, [fps * 0.6, fps * 1.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "flex-end", paddingLeft: 120, paddingBottom: 120 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, transform: `translateX(${(1 - ribbon) * -90}px)`, opacity: ribbon }}>
          {/* sello redondo de cal/cemento */}
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: `linear-gradient(145deg, ${PAPER_HI}, ${CEM_HI})`, display: "grid", placeItems: "center", boxShadow: "0 16px 36px rgba(0,0,0,0.5), inset 0 2px 6px rgba(255,255,255,0.4)", border: `3px solid ${PAPER}` }}>
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
