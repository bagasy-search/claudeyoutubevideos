// SalitrePolish.tsx — SET DE PULIDO de nivel cine para el video "salitre" (Constructor
// Libre, Tomás). Gemelo temático de MaderaPolish/CementoPolish: MISMO ADN (clip vivo
// detrás borroso + scrim; encima contenido premium serif/pergamino/tinta sepia, SVG a
// medida, springs suaves, partículas deterministas, determinista por frame). Acá los
// heroes son PROPIOS de la HUMEDAD ASCENDENTE y el SALITRE:
//   1) SlCapillary — el agua del SUELO SUBE por la pared por capilaridad (mecha/servilleta)
//   2) SlSalt      — la sal cristaliza al evaporarse el agua y REVIENTA la pintura (eflorescencia)
//   3) SlSeal      — EL ERROR: pintura plástica sobre pared húmeda encierra el agua y la sube más
//   4) SlBarrier   — la barrera anti-capilar: perforar + inyectar hidrofugante (pasos)
//   5) SlLime      — cal que RESPIRA vs plástica que SELLA (comparación)
//   (+) SlNameTag  — lower-third rústico opcional para Tomás
// CERO filtro retro, CERO shake, CERO flicker. Imágenes (no video) → seguro para el
// render por chunks del farm.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS } from "./ui";

// ── paleta de marca (idéntica a Madera/Cemento para coherencia del canal) ──
const PAPER = "#efe7d3"; // pergamino
const PAPER_HI = "#f6f0e0"; // pergamino claro (luz)
const INK = "#2a2620"; // tinta marrón oscura
const SAGE = "#7C8A5A"; // salvia (sano/bueno)
const SAGE_HI = "#a9ba8c";
const TERRA = "#B0503C"; // terracota (peligro/daño)
const TERRA_HI = "#e08a72";
const GOLD = "#c9a56a"; // acento cálido
// propios del salitre / humedad
const WATER = "#5a86a8"; // agua/humedad (azul apagado)
const WATER_HI = "#7fa8c4";
const WALL = "#cbb48a"; // revoque/ladrillo cálido
const WALL_DK = "#a68c60"; // revoque húmedo/oscuro
const SALT = "#f4efe4"; // sal / eflorescencia (casi blanca cálida)
const SOIL = "#6a5638"; // tierra húmeda

const A: Record<string, string> = { sage: SAGE, green: SAGE, good: SAGE, terra: TERRA, red: TERRA, danger: TERRA, amber: "#c98a3c", gold: GOLD, blue: WATER, water: WATER, ink: INK };
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

// ── nube de polvillo blanco (sal/eflorescencia) que cae ──
const SaltFall: React.FC<{ seed: number; f: number; x: number; y: number; w: number; n?: number; color?: string; start?: number }> = ({ seed, f, x, y, w, n = 22, color = "rgba(244,239,228,0.7)", start = 0 }) => {
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

// ══════════════════════════════════════════════════════════════════════════════
// 1) SlCapillary — EL AGUA DEL SUELO SUBE POR LA PARED (capilaridad).
//    Corte de pared apoyada sobre tierra húmeda, llena de canalitos verticales (poros).
//    El agua azul TREPA por esos canalitos como por una mecha; una LÍNEA DE HÚMEDO
//    oscurece la pared a medida que sube y una MARCA DE ALTURA acompaña el frente.
//    A la derecha, la analogía de la servilleta chupando agua de un charco. Sin bomba.
// ══════════════════════════════════════════════════════════════════════════════
export const SlCapillary: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "El agua del suelo sube sola" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  // el frente de humedad trepa de 0 a ~1 (0.6–3.4s), con leve respiración
  const rise = easeInOut(interpolate(f, [fps * 0.6, fps * 3.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const lab = (d: number) => interpolate(f, [fps * d, fps * (d + 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const BX = 150, BW = 470, BTOP = 90, BBOT = 470; // pared en corte
  const SOILY = BBOT; // línea del suelo
  const maxRise = BBOT - BTOP - 20;
  const frontY = BBOT - 8 - rise * maxRise; // frente de humedad (sube)
  const NCH = 9; // canalitos
  // servilleta (analogía derecha)
  const NX = 720, NW = 150, NTOP = 150, NBOT = 470;
  const napFront = NBOT - 8 - rise * (NBOT - NTOP - 20);

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Eyebrow text="Humedad ascendente · capilaridad" f={f} fps={fps} />
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 14, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="1000" height="560" viewBox="0 0 1000 560" style={{ overflow: "visible" }}>
          <defs>
            <clipPath id="slWallClip"><rect x={BX} y={BTOP} width={BW} height={BBOT - BTOP} rx="8" /></clipPath>
            <linearGradient id="slDampGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={WATER} stopOpacity="0.9" /><stop offset="0.7" stopColor={WATER} stopOpacity="0.5" /><stop offset="1" stopColor={WATER} stopOpacity="0" />
            </linearGradient>
            <clipPath id="slNapClip"><path d={`M ${NX} ${NTOP} L ${NX + NW} ${NTOP} L ${NX + NW} ${NBOT} L ${NX} ${NBOT} Z`} /></clipPath>
          </defs>

          {/* TIERRA HÚMEDA debajo */}
          <rect x={BX - 60} y={SOILY} width={BW + 260} height={90} fill={SOIL} />
          {Array.from({ length: 20 }).map((_, i) => (
            <circle key={i} cx={BX - 40 + rnd(i * 3.7) * (BW + 220)} cy={SOILY + 12 + rnd(i * 5.1) * 66} r={2 + rnd(i) * 3} fill="#4c3c26" opacity="0.6" />
          ))}
          <text x={BX + BW / 2} y={SOILY + 60} textAnchor="middle" fontFamily={SANS} fontSize="24" fontWeight="700" fill={PAPER} opacity={lab(0.4)}>tierra húmeda</text>

          {/* CUERPO de la pared en corte */}
          <rect x={BX} y={BTOP} width={BW} height={BBOT - BTOP} rx="8" fill={WALL} stroke={INK} strokeWidth="3" />
          <g clipPath="url(#slWallClip)">
            {/* mampostería (ladrillos leves) */}
            {Array.from({ length: 7 }).map((_, r) => (
              <line key={r} x1={BX} y1={BTOP + 34 + r * 56} x2={BX + BW} y2={BTOP + 34 + r * 56} stroke="rgba(42,38,32,0.16)" strokeWidth="2" />
            ))}
            {/* CANALITOS verticales (poros) */}
            {Array.from({ length: NCH }).map((_, i) => {
              const cx = BX + 34 + i * ((BW - 68) / (NCH - 1));
              return <line key={i} x1={cx} y1={BTOP} x2={cx} y2={BBOT} stroke="rgba(42,38,32,0.22)" strokeWidth="2.4" />;
            })}
            {/* zona HÚMEDA (oscurece la pared bajo el frente) */}
            <rect x={BX} y={frontY} width={BW} height={BBOT - frontY} fill={WALL_DK} opacity="0.55" />
            <rect x={BX} y={frontY - 60} width={BW} height={BBOT - frontY + 60} fill="url(#slDampGrad)" opacity="0.5" />
            {/* AGUA que trepa por cada canalito (columnas azules hasta el frente) */}
            {Array.from({ length: NCH }).map((_, i) => {
              const cx = BX + 34 + i * ((BW - 68) / (NCH - 1));
              const wob = Math.sin(f * 0.14 + i * 1.3) * 6 * rise;
              const top = frontY - 8 + wob - rnd(i * 4.1) * 18;
              return <rect key={i} x={cx - 3} y={top} width={6} height={BBOT - top} rx={3} fill={WATER} opacity={0.55 + 0.3 * rise} />;
            })}
            {/* meniscos que suben (puntitos en la cabeza de cada columna) */}
            {Array.from({ length: NCH }).map((_, i) => {
              const cx = BX + 34 + i * ((BW - 68) / (NCH - 1));
              const wob = Math.sin(f * 0.14 + i * 1.3) * 6 * rise;
              return <circle key={i} cx={cx} cy={frontY - 8 + wob - rnd(i * 4.1) * 18} r={4} fill={WATER_HI} opacity={rise} />;
            })}
          </g>

          {/* MARCA DE ALTURA del frente de humedad (línea + etiqueta que sube) */}
          <g opacity={interpolate(f, [fps * 1.0, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <line x1={BX - 26} y1={frontY} x2={BX + BW + 26} y2={frontY} stroke={TERRA_HI} strokeWidth="2.5" strokeDasharray="8 8" />
            <g transform={`translate(${BX + BW + 30}, ${frontY})`}>
              <rect x="0" y="-20" width="188" height="40" rx="8" fill={PAPER} stroke={TERRA} strokeWidth="2.5" />
              <text x="94" y="7" textAnchor="middle" fontFamily={SANS} fontSize="21" fontWeight="800" fill={TERRA}>hasta acá llegó</text>
            </g>
          </g>
          {/* flecha de subida grande al costado izquierdo */}
          <g opacity={lab(0.8)}>
            <line x1={BX - 40} y1={BBOT - 10} x2={BX - 40} y2={BTOP + 40} stroke={WATER_HI} strokeWidth="6" strokeLinecap="round" />
            <path d={`M ${BX - 52} ${BTOP + 58} L ${BX - 40} ${BTOP + 34} L ${BX - 28} ${BTOP + 58} Z`} fill={WATER_HI} />
            <text x={BX - 40} y={BTOP + 8} textAnchor="middle" fontFamily={SANS} fontSize="20" fontWeight="800" fill={WATER_HI}>sube</text>
          </g>

          {/* ANALOGÍA: servilleta chupando agua de un charco */}
          <g opacity={lab(1.6)}>
            {/* charco */}
            <ellipse cx={NX + NW / 2} cy={NBOT + 16} rx={NW * 0.8} ry="16" fill={WATER} opacity="0.75" />
            {/* servilleta (papel) */}
            <path d={`M ${NX} ${NTOP} L ${NX + NW} ${NTOP} L ${NX + NW} ${NBOT + 8} L ${NX} ${NBOT + 8} Z`} fill={SALT} stroke={INK} strokeWidth="2.5" />
            <g clipPath="url(#slNapClip)">
              <rect x={NX} y={napFront} width={NW} height={NBOT + 8 - napFront} fill={WATER} opacity="0.55" />
              <rect x={NX} y={napFront - 30} width={NW} height="30" fill="url(#slDampGrad)" opacity="0.6" />
            </g>
            {/* líneas de textura del papel */}
            {[0, 1, 2].map((k) => <line key={k} x1={NX + 30 + k * 40} y1={NTOP} x2={NX + 30 + k * 40} y2={NBOT} stroke="rgba(42,38,32,0.12)" strokeWidth="2" />)}
            <text x={NX + NW / 2} y={NTOP - 18} textAnchor="middle" fontFamily={SANS} fontSize="23" fontWeight="800" fill={PAPER}>como una servilleta</text>
            <text x={NX + NW / 2} y={NBOT + 54} textAnchor="middle" fontFamily={SANS} fontSize="20" fontWeight="700" fill={WATER_HI}>el agua trepa sola</text>
          </g>
        </svg>
        <div style={{ marginTop: 8, fontFamily: SANS, color: WATER_HI, fontSize: 30, fontWeight: 800, fontStyle: "italic", opacity: interpolate(f, [fps * 3.0, fps * 3.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>Sin bomba, sin nada: la pared chupa como esponja.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 2) SlSalt — LA SAL CRISTALIZA Y REVIENTA LA PINTURA (eflorescencia).
//    Superficie de pared: el agua salada llega, el AGUA se EVAPORA (vapor subiendo) y
//    las SALES quedan atrás de la pintura. Los cristales crecen, se juntan y EMPUJAN
//    como cuñitas → la pintura se AMPOLLA y salta, cae polvillo blanco. Sello final.
// ══════════════════════════════════════════════════════════════════════════════
export const SlSalt: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "El agua se va, la sal queda" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const evap = interpolate(f, [fps * 0.5, fps * 1.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // vapor sale
  const grow = interpolate(f, [fps * 1.4, fps * 3.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // cristales crecen
  const burst = interpolate(f, [fps * 2.8, fps * 3.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // pintura ampolla/salta
  const lab = (d: number) => interpolate(f, [fps * d, fps * (d + 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const BX = 190, BY = 150, BW = 640, BH = 320; // pared en corte
  const PAINTX = BX + BW - 40; // capa de pintura (franja derecha = la cara)
  // ampollas (blisters) en la cara de la pintura
  const blisters = [
    { y: BY + 70, r: 26 }, { y: BY + 150, r: 34 }, { y: BY + 235, r: 22 },
  ];
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Eyebrow text="El salitre: sal que cristaliza y empuja" f={f} fps={fps} />
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 16, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="1040" height="560" viewBox="0 0 1040 560" style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="slCrystGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#ffffff" /><stop offset="0.6" stopColor={SALT} /><stop offset="1" stopColor="#f4efe400" />
            </radialGradient>
          </defs>
          {/* cuerpo de la pared */}
          <rect x={BX} y={BY} width={BW} height={BH} rx="8" fill={WALL} stroke={INK} strokeWidth="3" />
          {[0, 1, 2, 3].map((k) => <line key={k} x1={BX} y1={BY + 50 + k * 56} x2={PAINTX} y2={BY + 50 + k * 56} stroke="rgba(42,38,32,0.16)" strokeWidth="2" />)}
          {/* agua salada que SUBE desde abajo */}
          {Array.from({ length: 6 }).map((_, i) => {
            const gx = BX + 60 + i * 90;
            return <rect key={i} x={gx - 3} y={BY + BH * 0.35} width={6} height={BH * 0.65} rx={3} fill={WATER} opacity="0.5" />;
          })}
          <text x={BX + 40} y={BY + BH + 34} fontFamily={SANS} fontSize="22" fontWeight="700" fill={WATER_HI} opacity={lab(0.5)}>agua salada sube ↑</text>

          {/* VAPOR que sale por la cara (el agua se evapora) */}
          {Array.from({ length: 8 }).map((_, i) => {
            const r0 = rnd(i * 5.3);
            const prog = ((f * 0.02 + r0) % 1);
            const yy = BY + 40 + i * 34;
            return <path key={i} d={`M ${PAINTX + 8} ${yy} q 26 -18 14 -46 q -12 -24 16 -44`} fill="none" stroke="rgba(210,215,220,0.55)" strokeWidth="3" opacity={Math.sin(prog * Math.PI) * evap * 0.85} />;
          })}
          <text x={PAINTX + 96} y={BY - 10} textAnchor="middle" fontFamily={SANS} fontSize="24" fontWeight="800" fill={WATER_HI} opacity={evap}>el agua se evapora</text>

          {/* CAPA DE PINTURA en la cara (franja) que se ampolla */}
          <rect x={PAINTX} y={BY} width={40} height={BH} fill="#e7e0d0" stroke={INK} strokeWidth="2" />
          {/* CRISTALES de sal creciendo justo detrás de la pintura */}
          {grow > 0.02 && Array.from({ length: 20 }).map((_, i) => {
            const seg = i / 20;
            const cy = BY + 20 + seg * (BH - 40);
            const cx = PAINTX - 8 - rnd(i * 3.1) * 26;
            const r = (4 + rnd(i) * 8) * clamp01(grow * 1.4 - seg * 0.15);
            if (r <= 0) return null;
            return <circle key={i} cx={cx} cy={cy} r={r} fill="url(#slCrystGlow)" opacity="0.95" />;
          })}
          {/* AMPOLLAS: la pintura se levanta como cúpulas y se agrieta */}
          {blisters.map((bl, i) => {
            const g = clamp01(burst * 1.3 - i * 0.18);
            if (g <= 0) return null;
            const bulge = 24 * g;
            return (
              <g key={i}>
                <path d={`M ${PAINTX + 40} ${bl.y - bl.r} Q ${PAINTX + 40 + bulge} ${bl.y} ${PAINTX + 40} ${bl.y + bl.r}`} fill="#efe9db" stroke={INK} strokeWidth="2" opacity={g} />
                <path d={`M ${PAINTX + 40} ${bl.y - bl.r} Q ${PAINTX + 40 + bulge} ${bl.y} ${PAINTX + 40} ${bl.y + bl.r}`} fill="rgba(255,255,255,0.4)" opacity={g * 0.6} />
                {/* grieta en la ampolla ya reventada */}
                {g > 0.7 && <path d={`M ${PAINTX + 40 + bulge * 0.6} ${bl.y - 6} l 6 12 l -8 8`} fill="none" stroke={INK} strokeWidth="2" opacity={(g - 0.7) * 3} />}
              </g>
            );
          })}
          {/* polvillo blanco que cae al piso desde la cara */}
          {burst > 0.4 && <SaltFall seed={31} f={f} x={PAINTX + 30} y={BY + BH - 10} w={90} n={22} start={fps * 2.8} />}

          {/* etiquetas */}
          <g opacity={lab(1.5)}>
            <line x1={PAINTX - 20} y1={BY + BH * 0.5} x2={BX + 40} y2={BY + BH + 70} stroke={SAGE_HI} strokeWidth="3" />
            <text x={BX + 20} y={BY + BH + 96} fontFamily={SANS} fontSize="25" fontWeight="800" fill={SAGE_HI}>la sal cristaliza y empuja</text>
          </g>
          <g opacity={lab(2.8)}>
            <line x1={PAINTX + 40} y1={BY + 60} x2={PAINTX + 150} y2={BY + 40} stroke={TERRA_HI} strokeWidth="3" />
            <text x={PAINTX + 158} y={BY + 34} fontFamily={SANS} fontSize="25" fontWeight="800" fill={TERRA_HI}>revienta la pintura</text>
            <text x={PAINTX + 158} y={BY + 62} fontFamily={SANS} fontSize="20" fontWeight="700" fill={PAPER}>como mil cuñitas</text>
          </g>
        </svg>
        <div style={{ marginTop: 6, fontFamily: SANS, color: SALT, fontSize: 30, fontWeight: 800, opacity: interpolate(f, [fps * 3.4, fps * 3.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>Ese polvillo blanco es salitre: sal reventando el revoque.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 3) SlSeal — EL ERROR: sellar una pared húmeda encierra el agua (equivalente al
//    mdsealtrap de madera, ahora en pared). Baja una TAPA de pintura plástica brillante
//    sobre una pared que ya toma agua de abajo → el agua no puede evaporar, se ACUMULA
//    y SUBE MÁS ARRIBA (mancha nueva medio metro más alto); detrás el revoque se pudre.
// ══════════════════════════════════════════════════════════════════════════════
export const SlSeal: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "Sellaste la pared húmeda" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const lidDrop = easeInOut(interpolate(f, [fps * 0.5, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })); // la tapa baja
  const trap = interpolate(f, [fps * 1.4, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // agua atrapada
  const climb = interpolate(f, [fps * 2.2, fps * 3.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // sube más arriba
  const rotP = interpolate(f, [fps * 2.6, fps * 4.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // revoque se pudre
  const lab = (d: number) => interpolate(f, [fps * d, fps * (d + 0.35)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const BX = 260, BY = 110, BW = 380, BH = 400; // pared vertical en corte
  const SEALX = BX + BW - 22; // capa de pintura plástica (cara derecha)
  const baseWater = BY + BH - 70; // nivel base del agua atrapada
  const trapTop = baseWater - climb * (BH * 0.62); // el agua sube con climb
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 20, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="1040" height="560" viewBox="0 0 1040 560" style={{ overflow: "visible" }}>
          <defs>
            <clipPath id="slSealClip"><rect x={BX} y={BY} width={BW} height={BH} rx="8" /></clipPath>
            <linearGradient id="slPlastic" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8fb8c9" /><stop offset="0.5" stopColor="#6b93a8" /><stop offset="1" stopColor="#4d7286" />
            </linearGradient>
            <linearGradient id="slTrapGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={WATER} stopOpacity="0.85" /><stop offset="1" stopColor={WATER} stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {/* tierra húmeda al pie */}
          <rect x={BX - 40} y={BY + BH} width={BW + 200} height={70} fill={SOIL} />
          {/* cuerpo de la pared */}
          <rect x={BX} y={BY} width={BW} height={BH} rx="8" fill={WALL} stroke={INK} strokeWidth="3" />
          <g clipPath="url(#slSealClip)">
            {[0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1={BX} y1={BY + 50 + k * 60} x2={SEALX} y2={BY + 50 + k * 60} stroke="rgba(42,38,32,0.16)" strokeWidth="2" />)}
            {/* AGUA ATRAPADA que sube porque no puede salir */}
            <rect x={BX} y={trapTop} width={BW - 22} height={BY + BH - trapTop} fill="url(#slTrapGrad)" opacity={0.35 + 0.5 * trap} />
            {/* frente que sube: línea de humedad */}
            <rect x={BX} y={trapTop - 6} width={BW - 22} height={12} fill={WATER_HI} opacity={trap * 0.7} />
            {/* REVOQUE PODRIDO detrás de la pintura (mancha oscura pulverulenta) */}
            {rotP > 0.02 && Array.from({ length: 12 }).map((_, i) => {
              const cx = BX + 40 + rnd(i * 5.3) * (BW - 90);
              const cy = trapTop + 20 + rnd(i * 2.9) * (BY + BH - trapTop - 30);
              const r = (10 + rnd(i) * 24) * rotP;
              return <circle key={i} cx={cx} cy={cy} r={r} fill="#3a2118" opacity={0.5 * rotP} />;
            })}
          </g>
          {/* CAPA de PINTURA PLÁSTICA que baja y sella la cara (con brillo) */}
          <g>
            <rect x={SEALX} y={BY - (1 - lidDrop) * 60} width={22} height={BH * lidDrop} fill="url(#slPlastic)" stroke={INK} strokeWidth="2" opacity={0.6 + 0.4 * lidDrop} />
            <rect x={SEALX + 4} y={BY + 8} width={5} height={BH * lidDrop - 16} rx="2.5" fill="rgba(255,255,255,0.55)" opacity={lidDrop} />
          </g>
          {/* MANCHA NUEVA medio metro más arriba (la humedad busca salir arriba de la tapa) */}
          <g opacity={climb}>
            <ellipse cx={BX + BW * 0.5} cy={trapTop + 10} rx={BW * 0.42 * climb} ry={40 * climb} fill={WALL_DK} opacity="0.6" />
          </g>

          {/* flecha: el agua sube más arriba */}
          <g opacity={lab(2.2)}>
            <line x1={BX - 34} y1={baseWater} x2={BX - 34} y2={trapTop + 14} stroke={WATER_HI} strokeWidth="6" strokeLinecap="round" />
            <path d={`M ${BX - 46} ${trapTop + 30} L ${BX - 34} ${trapTop + 8} L ${BX - 22} ${trapTop + 30} Z`} fill={WATER_HI} />
          </g>

          {/* etiquetas */}
          <g opacity={lab(0.9)}>
            <line x1={SEALX + 22} y1={BY + 80} x2={SEALX + 130} y2={BY + 50} stroke={TERRA_HI} strokeWidth="3" />
            <text x={SEALX + 138} y={BY + 44} fontFamily={SANS} fontSize="25" fontWeight="800" fill={TERRA_HI}>le pusiste una tapa</text>
            <text x={SEALX + 138} y={BY + 72} fontFamily={SANS} fontSize="20" fontWeight="700" fill={PAPER}>el agua ya no puede salir</text>
          </g>
          <g opacity={lab(2.6)}>
            <line x1={BX + BW * 0.5} y1={trapTop + 10} x2={BX - 60} y2={trapTop - 40} stroke={WATER_HI} strokeWidth="3" />
            <text x={BX - 300} y={trapTop - 44} fontFamily={SANS} fontSize="24" fontWeight="800" fill={WATER_HI}>la mancha sube más arriba</text>
          </g>
          <g opacity={lab(3.2)}>
            <text x={BX + BW * 0.5} y={BY + BH + 50} textAnchor="middle" fontFamily={SANS} fontSize="23" fontWeight="800" fill={TERRA_HI}>por afuera prolijo, por dentro polvo</text>
          </g>
        </svg>
        <div style={{ marginTop: 8, fontFamily: SANS, color: TERRA_HI, fontSize: 30, fontWeight: 800, fontStyle: "italic", opacity: interpolate(f, [fps * 3.6, fps * 4.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>Sellar una pared que toma agua no la protege: la condena.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 4) SlBarrier — LA BARRERA ANTI-CAPILAR: perforar la base + inyectar hidrofugante.
//    3 pasos escalonados: (1) taladro perfora una FILA de agujeros arriba del zócalo;
//    (2) se INYECTA líquido de siliconas que se reparte por los poros; (3) se forma una
//    FAJA impermeable que corta la subida → arriba la pared se seca sola.
// ══════════════════════════════════════════════════════════════════════════════
export const SlBarrier: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "La barrera del albañil" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const drill = interpolate(f, [fps * 0.5, fps * 1.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // perfora
  const inject = interpolate(f, [fps * 1.6, fps * 2.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // inyecta
  const band = interpolate(f, [fps * 2.6, fps * 3.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // faja
  const dryUp = interpolate(f, [fps * 3.4, fps * 4.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // arriba seca
  const lab = (d: number) => interpolate(f, [fps * d, fps * (d + 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const BX = 210, BY = 110, BW = 620, BH = 380;
  const BANDY = BY + BH - 96; // altura de la faja (arriba del zócalo)
  const NH = 7; // agujeros
  const holeX = (i: number) => BX + 60 + i * ((BW - 120) / (NH - 1));
  // paso activo (para resaltar el número)
  const step = f < fps * 1.6 ? 0 : f < fps * 2.6 ? 1 : 2;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Eyebrow text="Cortar la capilaridad en la base" f={f} fps={fps} />
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 14, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="1040" height="560" viewBox="0 0 1040 560" style={{ overflow: "visible" }}>
          <defs>
            <clipPath id="slBarClip"><rect x={BX} y={BY} width={BW} height={BH} rx="8" /></clipPath>
            <linearGradient id="slBandGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#c98a3c" /><stop offset="0.5" stopColor="#e0a85a" /><stop offset="1" stopColor="#c98a3c" />
            </linearGradient>
          </defs>
          {/* tierra húmeda */}
          <rect x={BX - 40} y={BY + BH} width={BW + 80} height={60} fill={SOIL} />
          {/* pared */}
          <rect x={BX} y={BY} width={BW} height={BH} rx="8" fill={WALL} stroke={INK} strokeWidth="3" />
          <g clipPath="url(#slBarClip)">
            {[0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1={BX} y1={BY + 46 + k * 56} x2={BX + BW} y2={BY + 46 + k * 56} stroke="rgba(42,38,32,0.16)" strokeWidth="2" />)}
            {/* humedad de abajo (siempre presente bajo la faja) */}
            <rect x={BX} y={BANDY + 14} width={BW} height={BY + BH - BANDY - 14} fill={WALL_DK} opacity="0.5" />
            {/* arriba de la faja: se SECA (aclara) a medida que dryUp sube */}
            <rect x={BX} y={BY} width={BW} height={BANDY - BY} fill="#e8dcc0" opacity={0.55 * dryUp} />
            {/* AGUA que sube y se DETIENE en la faja */}
            {Array.from({ length: NH }).map((_, i) => {
              const cx = holeX(i);
              const stopY = band > 0.2 ? BANDY + 10 : BY + 60;
              const top = stopY + Math.sin(f * 0.12 + i) * 4;
              return <rect key={i} x={cx - 3} y={top} width={6} height={BY + BH - top} rx={3} fill={WATER} opacity="0.5" />;
            })}
            {/* FAJA impermeable inyectada (halo que se reparte desde cada agujero) */}
            {inject > 0.02 && Array.from({ length: NH }).map((_, i) => {
              const cx = holeX(i);
              const r = 46 * clamp01(inject * 1.3 - i * 0.05);
              return <ellipse key={i} cx={cx} cy={BANDY} rx={r} ry={r * 0.5} fill="#e0a85a" opacity={0.35 * inject} />;
            })}
            {band > 0.02 && <rect x={BX} y={BANDY - 12} width={BW * band} height={24} rx="6" fill="url(#slBandGrad)" opacity="0.92" />}
          </g>
          {/* AGUJEROS perforados en fila (aparecen con drill) */}
          {Array.from({ length: NH }).map((_, i) => {
            const g = clamp01(drill * (NH + 1) - i);
            if (g <= 0) return null;
            const cx = holeX(i);
            return <g key={i} opacity={g}><ellipse cx={cx} cy={BANDY} rx="7" ry="5" fill="#1a120c" transform={`rotate(18 ${cx} ${BANDY})`} /></g>;
          })}
          {/* TALADRO que recorre la fila mientras perfora (paso 1) */}
          {drill > 0.02 && drill < 0.98 && (() => {
            const px = interpolate(drill, [0, 1], [holeX(0), holeX(NH - 1)]);
            return (
              <g transform={`translate(${px}, ${BANDY})`}>
                {/* mecha */}
                <rect x="-4" y="-2" width="46" height="8" rx="2" fill="#c9ccd2" stroke="#7a7d84" strokeWidth="1.5" transform="rotate(18)" />
                {/* cuerpo del taladro */}
                <rect x="30" y="-30" width="80" height="56" rx="10" fill="#B0503C" stroke={INK} strokeWidth="2.5" transform="rotate(18)" />
                <rect x="46" y="18" width="22" height="50" rx="6" fill="#7a3527" stroke={INK} strokeWidth="2" transform="rotate(18)" />
              </g>
            );
          })()}
          {/* JERINGA/pico inyectando (paso 2) */}
          {inject > 0.02 && inject < 0.98 && (() => {
            const px = interpolate(inject, [0, 1], [holeX(0), holeX(NH - 1)]);
            return (
              <g transform={`translate(${px}, ${BANDY})`} opacity={inject < 0.1 ? inject * 10 : 1}>
                <rect x="6" y="-46" width="18" height="44" rx="4" fill="#dfe3e8" stroke={INK} strokeWidth="2" />
                <rect x="2" y="-52" width="26" height="8" rx="3" fill="#B0503C" stroke={INK} strokeWidth="1.5" />
                <path d="M 15 -2 L 15 8" stroke="#7a7d84" strokeWidth="3" />
              </g>
            );
          })()}

          {/* etiquetas de pasos (números que se resaltan según el paso activo) */}
          {[
            { n: "1", txt: "perforar en fila", x: BX + 20, y: BY - 20, on: step >= 0, at: 0.6 },
            { n: "2", txt: "inyectar hidrofugante", x: BX + BW * 0.42, y: BY - 20, on: step >= 1, at: 1.7 },
            { n: "3", txt: "faja que corta la subida", x: BX + BW - 260, y: BY - 20, on: step >= 2, at: 2.8 },
          ].map((s, i) => (
            <g key={i} opacity={lab(s.at)}>
              <circle cx={s.x} cy={s.y} r="16" fill={s.on ? TERRA : "rgba(255,255,255,0.2)"} stroke={PAPER} strokeWidth="2" />
              <text x={s.x} y={s.y + 7} textAnchor="middle" fontFamily={SANS} fontSize="20" fontWeight="900" fill={PAPER}>{s.n}</text>
              <text x={s.x + 26} y={s.y + 6} fontFamily={SANS} fontSize="21" fontWeight="800" fill={PAPER}>{s.txt}</text>
            </g>
          ))}
          {/* etiqueta "arriba se seca sola" */}
          <g opacity={dryUp}>
            <text x={BX + BW * 0.5} y={BY + 40} textAnchor="middle" fontFamily={SANS} fontSize="24" fontWeight="800" fill={SAGE_HI}>arriba se seca sola</text>
          </g>
        </svg>
        <div style={{ marginTop: 8, fontFamily: SANS, color: TERRA_HI, fontSize: 28, fontWeight: 800, opacity: interpolate(f, [fps * 4.0, fps * 4.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>El líquido sale monedas. Lo caro es el misterio.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 5) SlLime — CAL QUE RESPIRA vs PLÁSTICA QUE SELLA (comparación de dos paredes).
//    IZQ: pintura plástica → el vapor golpea la tapa y NO sale, se ampolla (RAJADA).
//    DER: revoque/pintura a la CAL → el vapor ATRAVIESA y sale al aire (la pared respira,
//    SANA). Sellos RESPIRA / SE AHOGA. La pared que respira "late" suave.
// ══════════════════════════════════════════════════════════════════════════════
export const SlLime: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "Sellar ahoga · la cal respira" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const flow = interpolate(f, [fps * 0.6, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampP = interpolate(f, [fps * 3.0, fps * 3.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const breathe = 1 + 0.012 * Math.sin(f * 0.18);
  const lab = (d: number) => interpolate(f, [fps * d, fps * (d + 0.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Panel: React.FC<{ x: number; breathes: boolean }> = ({ x, breathes }) => {
    const W = 360, Y = 140, H = 320;
    const faceX = x + W - 26; // cara pintada
    return (
      <g transform={`translate(0,0)`} style={breathes ? { transform: `scale(${breathe})`, transformOrigin: `${x + W / 2}px ${Y + H / 2}px` } : undefined}>
        {/* tierra */}
        <rect x={x - 10} y={Y + H} width={W + 20} height={40} fill={SOIL} />
        {/* cuerpo */}
        <rect x={x} y={Y} width={W} height={H} rx="8" fill={WALL} stroke={INK} strokeWidth="3" />
        {[0, 1, 2, 3].map((k) => <line key={k} x1={x} y1={Y + 44 + k * 56} x2={faceX} y2={Y + 44 + k * 56} stroke="rgba(42,38,32,0.16)" strokeWidth="2" />)}
        {/* agua que sube por adentro (ambas) */}
        {[0, 1, 2, 3].map((k) => <rect key={k} x={x + 46 + k * 66} y={Y + H * 0.4} width={6} height={H * 0.6} rx={3} fill={WATER} opacity="0.45" />)}
        {breathes ? (
          <>
            {/* CAL: cara permeable (punteada) → el vapor la ATRAVIESA y sale */}
            <rect x={faceX} y={Y} width={26} height={H} fill={SALT} stroke={INK} strokeWidth="2" strokeDasharray="4 4" />
            {Array.from({ length: 7 }).map((_, i) => {
              const r0 = rnd(i * 4.1);
              const prog = ((f * 0.02 + r0) % 1);
              const yy = Y + 30 + i * 40;
              return <path key={i} d={`M ${faceX + 26} ${yy} q 30 -16 18 -46 q -10 -22 18 -40`} fill="none" stroke="rgba(210,215,220,0.6)" strokeWidth="3" opacity={Math.sin(prog * Math.PI) * flow * 0.85} />;
            })}
            <text x={faceX + 96} y={Y - 8} textAnchor="middle" fontFamily={SANS} fontSize="22" fontWeight="800" fill={SAGE_HI} opacity={flow}>el vapor sale</text>
          </>
        ) : (
          <>
            {/* PLÁSTICO: cara sellada (sólida) → el vapor golpea la tapa y NO sale */}
            <rect x={faceX} y={Y} width={26} height={H} fill="#6b93a8" stroke={INK} strokeWidth="2" />
            <rect x={faceX + 6} y={Y + 8} width={5} height={H - 16} rx="2.5" fill="rgba(255,255,255,0.5)" />
            {/* vapor que rebota contra la tapa (flechitas que chocan) */}
            {Array.from({ length: 5 }).map((_, i) => {
              const yy = Y + 40 + i * 56;
              return <path key={i} d={`M ${faceX - 60} ${yy} q 30 0 46 0`} fill="none" stroke={WATER_HI} strokeWidth="3" markerEnd="url(#slLimeArrow)" opacity={flow * 0.8} />;
            })}
            {/* ampollas en la cara sellada */}
            {[0, 1].map((i) => (
              <path key={i} d={`M ${faceX + 26} ${Y + 90 + i * 120} q ${18 * flow} 26 0 52`} fill="#efe9db" stroke={INK} strokeWidth="2" opacity={flow} />
            ))}
            <text x={faceX + 96} y={Y - 8} textAnchor="middle" fontFamily={SANS} fontSize="22" fontWeight="800" fill={TERRA_HI} opacity={flow}>el vapor no sale</text>
          </>
        )}
        {/* sello RESPIRA / SE AHOGA */}
        <g opacity={stampP} transform={`translate(${x + W * 0.5}, ${Y + H + 66}) rotate(${breathes ? 2 : -3})`}>
          <rect x="-104" y="-30" width="208" height="52" rx="10" fill={PAPER} stroke={breathes ? SAGE : TERRA} strokeWidth="4" />
          <text x="0" y="8" textAnchor="middle" fontFamily={SANS} fontSize="28" fontWeight="900" fill={breathes ? SAGE : TERRA}>{breathes ? "RESPIRA" : "SE AHOGA"}</text>
        </g>
        {/* etiqueta superior */}
        <text x={x + W * 0.5} y={Y - 54} textAnchor="middle" fontFamily={SANS} fontSize="25" fontWeight="800" fill={breathes ? SAGE_HI : TERRA_HI} opacity={lab(breathes ? 1.4 : 0.9)}>{breathes ? "Revoque y pintura a la CAL" : "Pintura PLÁSTICA impermeable"}</text>
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Eyebrow text="Encerrar el agua vs dejarla salir" f={f} fps={fps} />
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 8, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="1040" height="560" viewBox="0 0 1040 560" style={{ overflow: "visible" }}>
          <defs>
            <marker id="slLimeArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={WATER_HI} />
            </marker>
          </defs>
          <Panel x={70} breathes={false} />
          <line x1="520" y1="120" x2="520" y2="470" stroke="rgba(239,231,211,0.3)" strokeWidth="2" strokeDasharray="6 8" />
          <Panel x={600} breathes={true} />
        </svg>
        <div style={{ marginTop: 4, fontFamily: SANS, color: SAGE_HI, fontSize: 30, fontWeight: 800, opacity: interpolate(f, [fps * 3.4, fps * 3.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>La cal es lo opuesto a sellar: le sacás la tapa a la olla.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// (+) SlTwoWalls — LA PRUEBA de las 2 paredes (re-angulado del MdTwoPlanks de madera):
//    IZQ sellada: pintura plástica ampollada + polvillo blanco cayendo (RAJADA).
//    DER dejada secar: revoque firme, cara sana (SECA). Sello inferior con la decisión.
// ══════════════════════════════════════════════════════════════════════════════
export const SlTwoWalls: React.FC<{ durationInFrames: number; title?: string; buried?: string; note?: string; accent?: string }> = ({
  durationInFrames,
  title = "De la misma casa",
  buried = "el mismo revoque",
  note = "La única diferencia: sellar vs dejar secar",
}) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const inL = spring({ frame: f - 4, fps, config: { damping: 16, stiffness: 90 } });
  const inR = spring({ frame: f - 9, fps, config: { damping: 16, stiffness: 90 } });
  const buriedP = interpolate(f, [fps * 0.5, fps * 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const noteP = interpolate(f, [fps * 1.7, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const decay = interpolate(f, [fps * 1.2, fps * 3.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // la sellada se arruina

  const Wall: React.FC<{ bad: boolean; inP: number }> = ({ bad, inP }) => {
    const label = bad ? "SELLADA" : "DEJADA SECAR";
    const lc = bad ? TERRA : SAGE;
    return (
      <div style={{ transform: `translateY(${(1 - inP) * 70}px) rotate(${bad ? -2.2 : 2.0}deg) scale(${0.9 + 0.1 * inP})`, opacity: inP }}>
        <svg width="380" height="540" viewBox="0 0 380 540" style={{ overflow: "visible", filter: "drop-shadow(0 26px 46px rgba(0,0,0,0.55))" }}>
          {/* sombra */}
          <ellipse cx="190" cy="500" rx="140" ry="22" fill="rgba(0,0,0,0.4)" />
          {/* tierra al pie */}
          <rect x="30" y="470" width="320" height="30" fill={SOIL} />
          {/* cuerpo del panel de pared */}
          <rect x="60" y="70" width="260" height="400" rx="8" fill={bad ? WALL_DK : WALL} stroke={INK} strokeWidth="3" />
          {[0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1="60" y1={110 + k * 60} x2="320" y2={110 + k * 60} stroke="rgba(42,38,32,0.16)" strokeWidth="2" />)}
          {bad ? (
            <>
              {/* mancha de humedad que sube */}
              <rect x="60" y={470 - decay * 300} width="260" height={decay * 300} fill={WALL_DK} opacity="0.5" />
              {/* ampollas de pintura */}
              {[0, 1, 2].map((i) => (
                <ellipse key={i} cx={110 + i * 80} cy={200 + i * 70} rx={18 * decay} ry={22 * decay} fill="#efe9db" stroke={INK} strokeWidth="2" opacity={decay} />
              ))}
              {/* eflorescencia (polvillo blanco) */}
              {decay > 0.3 && Array.from({ length: 14 }).map((_, i) => (
                <circle key={i} cx={80 + rnd(i * 3.7) * 220} cy={380 + rnd(i * 5.1) * 80} r={2 + rnd(i) * 3} fill={SALT} opacity={0.7 * decay} />
              ))}
              {decay > 0.4 && <SaltFall seed={51} f={f} x={190} y={468} w={200} n={20} start={fps * 1.4} />}
            </>
          ) : (
            <>
              {/* cara sana firme, con leve textura a la cal */}
              {Array.from({ length: 22 }).map((_, i) => (
                <circle key={i} cx={80 + rnd(i * 3.1) * 220} cy={100 + rnd(i * 5.7) * 350} r={1 + rnd(i) * 1.8} fill="rgba(42,38,32,0.1)" />
              ))}
              {/* brillo de "seca y firme" */}
              <rect x="72" y="82" width="120" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
            </>
          )}
          {/* etiqueta manuscrita */}
          <g opacity={easeOut(Math.min(1, Math.max(0, (f - fps * 1.4) / (fps * 0.4))))}>
            <rect x="58" y="30" width="264" height="46" rx="8" fill={PAPER} stroke={lc} strokeWidth="3" transform={`rotate(${bad ? -3 : 2} 190 53)`} />
            <text x="190" y="62" textAnchor="middle" fontFamily={SANS} fontSize="28" fontWeight="800" fill={lc} transform={`rotate(${bad ? -3 : 2} 190 53)`}>{label}</text>
          </g>
        </svg>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={15} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <div style={{ fontFamily: SANS, color: PAPER, fontSize: 30, fontWeight: 700, letterSpacing: 3, opacity: easeOut(Math.min(1, f / (fps * 0.5))) }}>{title}</div>
          <div style={{ display: "inline-block", marginTop: 8, fontFamily: SANS, color: PAPER, fontSize: 24, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", background: "rgba(90,134,168,0.9)", padding: "6px 20px", borderRadius: 30, opacity: buriedP, transform: `translateY(${(1 - buriedP) * -10}px)` }}>💧 {buried}</div>
        </div>
        <div style={{ display: "flex", gap: 60, alignItems: "flex-end" }}>
          <Wall bad inP={inL} />
          <Wall bad={false} inP={inR} />
        </div>
        <div style={{ marginTop: 8, fontFamily: SANS, color: INK, background: PAPER, fontSize: 38, fontWeight: 800, padding: "12px 34px", borderRadius: 12, borderLeft: `6px solid ${SAGE}`, boxShadow: "0 16px 40px rgba(0,0,0,0.5)", opacity: noteP, transform: `translateY(${(1 - noteP) * 24}px) scale(${0.94 + 0.06 * noteP})` }}>{note}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// (+) SlNameTag — lower-third rústico opcional para Tomás (pergamino + tinta). Cinta que
//    entra desde la izquierda + subrayado a mano. (por si no se reutiliza el genérico)
// ══════════════════════════════════════════════════════════════════════════════
export const SlNameTag: React.FC<{ durationInFrames: number; name?: string; role?: string; accent?: string }> = ({ durationInFrames, name = "Tomás", role = "El Constructor Libre", accent }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const a = ac(accent);
  const ribbon = spring({ frame: f - 3, fps, config: { damping: 17, stiffness: 90 } });
  const line = interpolate(f, [fps * 0.6, fps * 1.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "flex-end", paddingLeft: 120, paddingBottom: 120 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, transform: `translateX(${(1 - ribbon) * -90}px)`, opacity: ribbon }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: `linear-gradient(145deg, ${PAPER_HI}, ${WALL})`, display: "grid", placeItems: "center", boxShadow: "0 16px 36px rgba(0,0,0,0.5), inset 0 2px 6px rgba(255,255,255,0.4)", border: `3px solid ${PAPER}` }}>
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
