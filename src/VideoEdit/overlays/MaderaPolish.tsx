// MaderaPolish.tsx — SET DE PULIDO de nivel cine para el video "madera" (Constructor
// Libre, Tomás). Cada componente está pensado para quedar HERMOSO, nunca básico:
// SVG a medida, springs suaves, partículas de polvillo, tinta que asienta, gotas que
// resbalan/absorben, sellos con peso. Mismo ADN que MaderaCards (clip vivo detrás,
// borroso + scrim; encima contenido premium serif/pergamino/tinta sepia). Todo
// determinista por frame (useCurrentFrame/interpolate/spring, imágenes no video) →
// seguro para el render por chunks del farm. CERO filtro retro, CERO shake, CERO flicker.
import { AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS } from "./ui";

// ── paleta de marca ──
const PAPER = "#efe7d3"; // pergamino
const PAPER_HI = "#f6f0e0"; // pergamino claro (luz)
const INK = "#2a2620"; // tinta marrón oscura
const SAGE = "#7C8A5A"; // salvia (sano/bueno)
const SAGE_HI = "#a9ba8c";
const TERRA = "#B0503C"; // terracota (podrido/peligro)
const TERRA_HI = "#e08a72";
const GOLD = "#c9a56a"; // madera cálida

// acento por token (versión terrosa; NO usa el mapa cyan de ui.acc)
const A: Record<string, string> = { sage: SAGE, green: SAGE, good: SAGE, terra: TERRA, red: TERRA, danger: TERRA, amber: "#c98a3c", gold: GOLD, blue: "#5a86a8", ink: INK };
const ac = (k?: string) => (k && A[k]) || SAGE;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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

// ── nube de polvillo sepia que cae (partículas deterministas) ──
const DustFall: React.FC<{ seed: number; f: number; x: number; y: number; w: number; n?: number; color?: string; start?: number }> = ({ seed, f, x, y, w, n = 22, color = "rgba(160,120,70,0.5)", start = 0 }) => {
  const fl = f - start;
  if (fl < 0) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const r0 = rnd(seed + i * 7.3), r1 = rnd(seed + i * 13.7), r2 = rnd(seed + i * 19.1);
        const life = 34 + r1 * 34; // frames
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

// ══════════════════════════════════════════════════════════════════════════════
// 1) MdTwoPlanks — LA PRUEBA DE LOS 2 TABLONES (el momento más viral)
//    IZQ podrido: fibras que se desarman + micro-jitter que decae + polvillo cayendo,
//    corte transversal que se abre como puerta (rotateY) mostrando centro hueco/negro.
//    DER sano: veta cálida, macizo, corte firme. Sello inferior "$2 de diferencia".
// ══════════════════════════════════════════════════════════════════════════════
export const MdTwoPlanks: React.FC<{ durationInFrames: number; title?: string; buried?: string; note?: string; accent?: string }> = ({
  durationInFrames,
  title = "Del mismo tablón",
  buried = "2 años enterrados",
  note = "La única diferencia: líquido de $2",
}) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  // entrada con leve tilt de "objeto sobre mesa"
  const inL = spring({ frame: f - 4, fps, config: { damping: 16, stiffness: 90 } });
  const inR = spring({ frame: f - 9, fps, config: { damping: 16, stiffness: 90 } });
  // el corte se abre como puerta a mitad
  const cut = interpolate(f, [fps * 0.9, fps * 1.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cutE = easeInOut(cut);
  // el izquierdo se "afloja": micro-jitter 2px que decae
  const jAmp = interpolate(f, [fps * 1.2, fps * 3.2], [2.2, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const jit = Math.sin(f * 0.9) * jAmp;
  // count-up del "2 años"
  const buriedP = interpolate(f, [fps * 0.5, fps * 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const noteP = interpolate(f, [fps * 1.6, fps * 2.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // un tablón dibujado en SVG (frente + corte transversal que rota)
  const Plank: React.FC<{ side: "rot" | "ok"; inP: number; jitter: number }> = ({ side, inP, jitter }) => {
    const rot = side === "rot";
    const label = rot ? "PODRIDO" : "SANO";
    const lc = rot ? TERRA : SAGE;
    return (
      <div style={{ transform: `translateY(${(1 - inP) * 70}px) rotate(${rot ? -2.2 : 2.0}deg) scale(${0.9 + 0.1 * inP})`, opacity: inP }}>
        <svg width="440" height="560" viewBox="0 0 440 560" style={{ overflow: "visible", filter: "drop-shadow(0 26px 46px rgba(0,0,0,0.55))" }}>
          {/* sombra en la mesa */}
          <ellipse cx="220" cy="512" rx="150" ry="24" fill="rgba(0,0,0,0.4)" />
          {/* cuerpo del tablón (frente) con micro-jitter solo si podrido */}
          <g transform={`translate(${rot ? jitter : 0},0)`}>
            {/* cara frontal */}
            <rect x="120" y="70" width="200" height="420" rx="8" fill={rot ? "#8a7350" : GOLD} stroke={INK} strokeWidth="3" />
            {/* veta */}
            {[0, 1, 2, 3].map((k) => (
              <path key={k} d={`M ${150 + k * 45} 78 q ${rot ? 10 : 6} 210 ${rot ? -6 : 0} 404`} fill="none" stroke={rot ? "rgba(42,38,32,0.4)" : "rgba(42,38,32,0.28)"} strokeWidth="2.4" />
            ))}
            {/* si podrido: manchas de moho verde-grisáceo + fibras que se desarman */}
            {rot && (
              <>
                <ellipse cx="180" cy="180" rx="46" ry="30" fill="#6b6f4e" opacity="0.6" />
                <ellipse cx="255" cy="300" rx="40" ry="52" fill="#575a44" opacity="0.5" />
                {/* fibras sueltas en el borde inferior */}
                {Array.from({ length: 9 }).map((_, i) => {
                  const bx = 132 + i * 20, sway = Math.sin(f * 0.12 + i) * 3;
                  return <path key={i} d={`M ${bx} 488 q ${sway} 20 ${sway * 1.6} 40`} fill="none" stroke="#7a6748" strokeWidth="2.6" opacity="0.8" />;
                })}
              </>
            )}
          </g>
          {/* CORTE TRANSVERSAL: tapa que se abre como puerta (rotateY simulado con escala X) */}
          <g transform={`translate(220,70)`} style={{ transformBox: "fill-box" }}>
            <g transform={`translate(-220,0)`}>
              {/* la "puerta" del corte, pivot en el borde derecho del tablón */}
              <g style={{ transform: `perspective(900px) rotateY(${-72 * cutE}deg)`, transformOrigin: "320px 280px" }}>
                <rect x="320" y="70" width="86" height="420" rx="6" fill={rot ? "#1c1712" : "#b98f52"} stroke={INK} strokeWidth="2.5" opacity={cutE} />
                {/* interior revelado: podrido = centro hueco/negro pulverulento; sano = macizo con anillos */}
                {rot ? (
                  <>
                    <rect x="326" y="120" width="74" height="320" rx="40" fill="#0f0b08" opacity={cutE} />
                    {Array.from({ length: 12 }).map((_, i) => (
                      <circle key={i} cx={340 + rnd(i * 3.1) * 46} cy={150 + rnd(i * 5.7) * 260} r={2 + rnd(i) * 3} fill="#3a2f22" opacity={cutE * 0.9} />
                    ))}
                  </>
                ) : (
                  [0, 1, 2, 3].map((k) => <ellipse key={k} cx="363" cy="280" rx={12 + k * 9} ry={80 + k * 60} fill="none" stroke="rgba(42,38,32,0.4)" strokeWidth="2" opacity={cutE} />)
                )}
              </g>
            </g>
          </g>
          {/* etiqueta manuscrita */}
          <g opacity={easeOut(Math.min(1, Math.max(0, (f - fps * 1.4) / (fps * 0.4))))}>
            <rect x="118" y="30" width="204" height="46" rx="8" fill={PAPER} stroke={lc} strokeWidth="3" transform={`rotate(${rot ? -3 : 2} 220 53)`} />
            <text x="220" y="62" textAnchor="middle" fontFamily={SANS} fontSize="30" fontWeight="800" fill={lc} transform={`rotate(${rot ? -3 : 2} 220 53)`}>{label}</text>
          </g>
          {/* polvillo cayendo del podrido */}
          {rot && <DustFall seed={41} f={f} x={220} y={470} w={200} n={26} start={fps * 1.1} />}
        </svg>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={15} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {/* eyebrow + count-up "2 años enterrados" */}
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <div style={{ fontFamily: SANS, color: PAPER, fontSize: 30, fontWeight: 700, letterSpacing: 3, opacity: easeOut(Math.min(1, f / (fps * 0.5))) }}>{title}</div>
          <div style={{ display: "inline-block", marginTop: 8, fontFamily: SANS, color: PAPER, fontSize: 24, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", background: "rgba(176,80,60,0.9)", padding: "6px 20px", borderRadius: 30, opacity: buriedP, transform: `translateY(${(1 - buriedP) * -10}px)` }}>⏳ {buried}</div>
        </div>
        <div style={{ display: "flex", gap: 70, alignItems: "flex-end" }}>
          <Plank side="rot" inP={inL} jitter={jit} />
          <Plank side="ok" inP={inR} jitter={0} />
        </div>
        {/* sello inferior */}
        <div style={{ marginTop: 8, fontFamily: SANS, color: INK, background: PAPER, fontSize: 40, fontWeight: 800, padding: "12px 34px", borderRadius: 12, borderLeft: `6px solid ${TERRA}`, boxShadow: "0 16px 40px rgba(0,0,0,0.5)", opacity: noteP, transform: `translateY(${(1 - noteP) * 24}px) scale(${0.94 + 0.06 * noteP})` }}>{note}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 2) MdSealTrap — EL ERROR: sellar madera húmeda encierra el agua.
//    Corte de tabla con gotas de humedad dentro. Baja una "tapa" de barniz brillante
//    que las atrapa. Bajo la capa crece el hongo (spores) mientras la superficie sigue
//    impecable. Timelapse "2 años" y al final la superficie cede (grieta).
// ══════════════════════════════════════════════════════════════════════════════
export const MdSealTrap: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "Sellaste con la madera húmeda" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const lidDrop = easeInOut(interpolate(f, [fps * 0.5, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const trap = interpolate(f, [fps * 1.4, fps * 2.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const grow = interpolate(f, [fps * 2.0, fps * 3.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // hongo bajo la capa
  const crack = interpolate(f, [fps * 3.6, fps * 4.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const yearsP = interpolate(f, [fps * 2.0, fps * 3.6], [0, 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lab = (d: number) => interpolate(f, [fps * d, fps * (d + 0.35)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const BX = 190, BY = 190, BW = 640, BH = 300; // caja del corte de madera
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 20, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="1040" height="560" viewBox="0 0 1040 560" style={{ overflow: "visible" }}>
          {/* cuerpo de la madera en corte */}
          <rect x={BX} y={BY} width={BW} height={BH} rx="8" fill={GOLD} stroke={INK} strokeWidth="3" />
          {[0, 1, 2, 3, 4].map((k) => <line key={k} x1={BX} y1={BY + 46 + k * 50} x2={BX + BW} y2={BY + 46 + k * 50} stroke="rgba(42,38,32,0.22)" strokeWidth="2" />)}
          {/* gotas de humedad ATRAPADAS dentro */}
          {Array.from({ length: 14 }).map((_, i) => {
            const gx = BX + 60 + rnd(i * 3.7) * (BW - 120);
            const gy = BY + 70 + rnd(i * 8.1) * (BH - 120);
            const wob = Math.sin(f * 0.08 + i) * 2 * trap;
            return <ellipse key={i} cx={gx + wob} cy={gy} rx={6 + rnd(i) * 4} ry={9 + rnd(i) * 5} fill="#5a86a8" opacity={0.35 + 0.45 * trap} />;
          })}
          {/* HONGO que crece bajo la capa (manchas terracota-a-negro pulverulentas) */}
          {grow > 0.01 && Array.from({ length: 10 }).map((_, i) => {
            const cx = BX + 90 + rnd(i * 5.3) * (BW - 180);
            const cy = BY + 110 + rnd(i * 2.9) * (BH - 160);
            const r = (10 + rnd(i) * 26) * grow;
            return <circle key={i} cx={cx} cy={cy} r={r} fill="#3a2118" opacity={0.55 * grow} />;
          })}
          {/* TAPA de barniz brillante que baja y sella (con highlight de brillo) */}
          <g transform={`translate(0, ${(-1 + lidDrop) * -0})`}>
            <rect x={BX - 6} y={BY - 26 + (1 - lidDrop) * -60} width={BW + 12} height={30} rx="6" fill="url(#varnishGrad)" stroke={INK} strokeWidth="2" opacity={0.5 + 0.5 * lidDrop} />
            <rect x={BX + 30} y={BY - 22 + (1 - lidDrop) * -60} width={BW - 200} height={6} rx="3" fill="rgba(255,255,255,0.6)" opacity={lidDrop} />
          </g>
          <defs>
            <linearGradient id="varnishGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e9c98f" /><stop offset="0.5" stopColor="#c99a54" /><stop offset="1" stopColor="#9a7238" />
            </linearGradient>
          </defs>
          {/* grieta final: la superficie cede */}
          {crack > 0.01 && (
            <path d={`M ${BX + BW * 0.5} ${BY - 10} l -12 30 l 20 26 l -14 34`} fill="none" stroke="#1a120c" strokeWidth={3 * crack} opacity={crack} strokeLinejoin="round" />
          )}
          {/* etiquetas */}
          <g opacity={lab(1.5)}>
            <line x1={BX + BW + 10} y1={BY - 12} x2={BX + BW + 70} y2={BY - 40} stroke={GOLD} strokeWidth="3" />
            <text x={BX + BW + 78} y={BY - 44} fontFamily={SANS} fontSize="28" fontWeight="800" fill={PAPER}>La tapa: barniz</text>
            <text x={BX + BW + 78} y={BY - 14} fontFamily={SANS} fontSize="22" fill={SAGE_HI}>el agua ya no puede salir</text>
          </g>
          <g opacity={lab(2.3)}>
            <line x1={BX + BW * 0.4} y1={BY + BH} x2={BX + 100} y2={BY + BH + 56} stroke={TERRA_HI} strokeWidth="3" />
            <text x={BX - 30} y={BY + BH + 84} fontFamily={SANS} fontSize="28" fontWeight="800" fill={TERRA_HI}>El hongo come bajo la pintura</text>
            <text x={BX - 30} y={BY + BH + 112} fontFamily={SANS} fontSize="22" fill={PAPER}>por fuera impecable, por dentro polvo</text>
          </g>
        </svg>
        {/* contador de años del timelapse */}
        <div style={{ marginTop: 10, fontFamily: SANS, color: "#e08a72", fontSize: 34, fontWeight: 800, opacity: interpolate(f, [fps * 1.9, fps * 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>+ {yearsP.toFixed(1)} años sellada</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 3) MdRotFromInside — SE PUDRE DE ADENTRO HACIA AFUERA.
//    Corte de viga: por fuera pintada/prolija; adentro una mancha negra crece desde el
//    centro (radial). La superficie sigue impecable → contraste. Al final un
//    destornillador entra "como en manteca" con un puff de polvo.
// ══════════════════════════════════════════════════════════════════════════════
export const MdRotFromInside: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "Se pudre de adentro hacia afuera" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const rot = easeOut(interpolate(f, [fps * 0.6, fps * 2.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })); // mancha interna
  const drive = interpolate(f, [fps * 2.9, fps * 3.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // destornillador entra
  const driveE = easeInOut(drive);
  const lab = (d: number) => interpolate(f, [fps * d, fps * (d + 0.35)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = 470, cy = 300;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 18, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="940" height="560" viewBox="0 0 940 560" style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="rotCore" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#0d0906" /><stop offset="0.55" stopColor="#2b1a10" /><stop offset="0.85" stopColor="#5a3a24" /><stop offset="1" stopColor="#5a3a2400" />
            </radialGradient>
            <clipPath id="beamClip"><rect x="150" y="120" width="640" height="360" rx="10" /></clipPath>
          </defs>
          {/* viga en corte, pintada por fuera (superficie impecable) */}
          <rect x="150" y="120" width="640" height="360" rx="10" fill={GOLD} stroke={INK} strokeWidth="3" />
          {/* capa de pintura prolija arriba */}
          <rect x="150" y="120" width="640" height="26" rx="10" fill="#3f6b52" opacity="0.9" />
          <rect x="180" y="126" width="360" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
          {/* veta */}
          <g clipPath="url(#beamClip)">
            {[0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1="150" y1={160 + k * 56} x2="790" y2={160 + k * 56} stroke="rgba(42,38,32,0.2)" strokeWidth="2" />)}
            {/* MANCHA de pudrición que crece desde el centro */}
            <ellipse cx={cx} cy={cy} rx={300 * rot} ry={150 * rot} fill="url(#rotCore)" />
            {/* polvillo dentro de la mancha */}
            {rot > 0.4 && Array.from({ length: 16 }).map((_, i) => {
              const ang = rnd(i) * Math.PI * 2, rr = rnd(i * 3.1) * 260 * rot;
              return <circle key={i} cx={cx + Math.cos(ang) * rr} cy={cy + Math.sin(ang) * rr * 0.5} r={1.6 + rnd(i) * 2.4} fill="#1a120c" opacity={0.7 * rot} />;
            })}
          </g>
          {/* DESTORNILLADOR que baja y entra como en manteca */}
          <g transform={`translate(${cx}, ${120 - 150 + driveE * 150})`} opacity={interpolate(f, [fps * 2.7, fps * 2.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            {/* mango */}
            <rect x="-26" y="-150" width="52" height="90" rx="14" fill="#B0503C" stroke={INK} strokeWidth="2.5" />
            <rect x="-26" y="-130" width="52" height="8" fill="rgba(0,0,0,0.2)" /><rect x="-26" y="-108" width="52" height="8" fill="rgba(0,0,0,0.2)" />
            {/* vástago */}
            <rect x="-6" y="-62" width="12" height="120" fill="#c9ccd2" stroke="#7a7d84" strokeWidth="1.5" />
            {/* punta */}
            <path d="M -8 58 L 8 58 L 0 78 Z" fill="#c9ccd2" />
          </g>
          {/* puff de polvo cuando entra */}
          {drive > 0.7 && <DustFall seed={77} f={f} x={cx} y={cy - 20} w={90} n={20} color="rgba(60,40,24,0.7)" />}
          {/* etiquetas */}
          <g opacity={lab(0.8)}>
            <line x1="150" y1="133" x2="70" y2="90" stroke={SAGE_HI} strokeWidth="3" />
            <text x="20" y="76" fontFamily={SANS} fontSize="26" fontWeight="800" fill={SAGE_HI}>Por fuera: impecable</text>
          </g>
          <g opacity={lab(1.6)}>
            <line x1={cx} y1={cy} x2="880" y2="470" stroke={TERRA_HI} strokeWidth="3" />
            <circle cx={cx} cy={cy} r="6" fill={TERRA_HI} />
            <text x="740" y="504" fontFamily={SANS} fontSize="26" fontWeight="800" fill={TERRA_HI}>Por dentro: ya es polvo</text>
          </g>
        </svg>
        <div style={{ marginTop: 6, fontFamily: SANS, color: PAPER, fontSize: 30, fontWeight: 700, fontStyle: "italic", opacity: interpolate(f, [fps * 3.6, fps * 3.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>…y el destornillador entra como en manteca.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 4) MdRuleStamp — SELLO DE REGLA (reutilizable ×3). Un sello de tinta que baja y
//    golpea el pergamino: cae rápido (spring stiff), impacto con micro-shake de 1 frame
//    + polvillo, la tinta "asienta" (opacity con textura, bordes gastados/desalineados,
//    salpicaduras). Debajo, "REGLA #n". Crea identidad de serie ("las reglas de Tomás").
// ══════════════════════════════════════════════════════════════════════════════
export const MdRuleStamp: React.FC<{ durationInFrames: number; text?: string; num?: string; label?: string; accent?: string }> = ({ durationInFrames, text = "LA MADERA SECA NO SE PUDRE", num = "1", label = "Regla", accent }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const a = ac(accent);
  // el sello cae rápido y golpea en ~frame de impacto
  const HIT = Math.round(fps * 0.55);
  const drop = spring({ frame: f, fps, config: { damping: 12, stiffness: 220, mass: 0.7 } });
  const preHit = interpolate(f, [0, HIT], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampScale = 1.5 - 0.5 * drop; // entra grande, asienta
  const stampY = (1 - drop) * -260;
  // micro-shake de 1 frame en el impacto
  const shake = f === HIT ? 6 : f === HIT + 1 ? -3 : 0;
  // la tinta asienta después del impacto
  const ink = interpolate(f, [HIT, HIT + Math.round(fps * 0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={15} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ position: "relative", transform: `translate(${shake}px, ${stampY}px)` }}>
          {/* marca de tinta impresa (asienta con textura) */}
          <div style={{ position: "relative", padding: "34px 60px", opacity: Math.max(ink, 0.001) }}>
            {/* borde de sello gastado, doble línea, leve desalineado */}
            <div style={{ position: "absolute", inset: 0, border: `5px solid ${a}`, borderRadius: 14, transform: "rotate(-1.4deg)", opacity: 0.9 * ink, filter: "url(#rough)" }} />
            <div style={{ position: "absolute", inset: 8, border: `2px solid ${a}`, borderRadius: 10, transform: "rotate(-1.1deg)", opacity: 0.7 * ink }} />
            <div style={{ fontFamily: SANS, color: a, fontSize: 20, fontWeight: 800, letterSpacing: 5, textTransform: "uppercase", textAlign: "center", transform: "rotate(-1.3deg)", opacity: 0.85 * ink }}>{label} #{num}</div>
            <div style={{ fontFamily: SANS, color: INK, fontSize: 62, fontWeight: 900, lineHeight: 1.05, textAlign: "center", maxWidth: 900, transform: "rotate(-1.3deg)", textShadow: `0 0 1px ${a}`, opacity: ink, mixBlendMode: "multiply" }}>{text}</div>
          </div>
          {/* salpicaduras de tinta alrededor */}
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
            {Array.from({ length: 14 }).map((_, i) => {
              const ang = rnd(i) * Math.PI * 2, dd = 220 + rnd(i * 3.1) * 160;
              return <circle key={i} cx={`calc(50% + ${Math.cos(ang) * dd}px)`} cy={`calc(50% + ${Math.sin(ang) * dd * 0.5}px)`} r={1.5 + rnd(i) * 4} fill={INK} opacity={0.5 * ink} />;
            })}
            <filter id="rough"><feTurbulence baseFrequency="0.04" numOctaves="2" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="4" /></filter>
          </svg>
          {/* el "cuerpo" del sello descendiendo (antes del impacto) */}
          {preHit > 0.01 && (
            <div style={{ position: "absolute", inset: "-30px -30px", background: "linear-gradient(180deg, rgba(42,38,32,0.14), rgba(42,38,32,0))", borderRadius: 20, transform: `scale(${stampScale})`, opacity: preHit * 0.6 }} />
          )}
          {/* polvillo del impacto */}
          {f >= HIT && f < HIT + fps * 0.8 && (
            <svg width="700" height="200" style={{ position: "absolute", left: "50%", bottom: -40, transform: "translateX(-50%)", overflow: "visible" }}>
              <DustFall seed={11} f={f} x={350} y={40} w={480} n={24} start={HIT} color="rgba(42,38,32,0.4)" />
            </svg>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 5) MdFungusNeeds — LAS 4 COSAS DEL HONGO → solo AGUA queda encendida.
//    4 fichas rústicas entran en secuencia (sello de tinta: scale-down + rotación al
//    asentar). Las 3 primeras se atenúan con un tachado sutil; la 4ª (AGUA) se resalta,
//    pulsa suave y se subraya a mano ("la única que controlás").
// ══════════════════════════════════════════════════════════════════════════════
export const MdFungusNeeds: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "El hongo necesita 4 cosas" }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const items = [
    { glyph: "🪵", name: "Madera", sub: "siempre está", key: false },
    { glyph: "💨", name: "Oxígeno", sub: "siempre está", key: false },
    { glyph: "🌡️", name: "Temperatura", sub: "templada", key: false },
    { glyph: "💧", name: "Agua", sub: "humedad > 20%", key: true },
  ];
  // fase "solo agua queda": empieza cuando ya entraron las 4
  const dim = interpolate(f, [fps * 2.6, fps * 3.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + 0.03 * Math.sin(f * 0.16);
  const underline = interpolate(f, [fps * 3.2, fps * 3.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 52, fontWeight: 800, marginBottom: 34, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
          {items.map((it, i) => {
            // entra como sello de tinta: baja de escala + leve rotación al asentar
            const s = spring({ frame: f - (6 + i * 12), fps, config: { damping: 13, stiffness: 160, mass: 0.8 } });
            const settleRot = interpolate(s, [0, 1], [i % 2 ? 6 : -6, i % 2 ? 1.4 : -1.4]);
            const isKey = it.key;
            const faded = !isKey ? 1 - 0.66 * dim : 1;
            const scaleKey = isKey ? 1 + 0.12 * dim : 1;
            return (
              <div key={i} style={{ position: "relative", opacity: s * faded, transform: `translateY(${(1 - s) * 40}px) rotate(${settleRot}deg) scale(${(0.7 + 0.3 * s) * scaleKey * (isKey ? pulse : 1)})`, transformOrigin: "center" }}>
                <div style={{ width: 240, background: PAPER, borderRadius: 16, padding: "28px 22px", textAlign: "center", boxShadow: isKey ? `0 24px 60px rgba(0,0,0,0.55), 0 0 0 4px ${SAGE}66` : "0 18px 44px rgba(0,0,0,0.5)", border: `2px solid ${isKey ? SAGE : "rgba(42,38,32,0.18)"}` }}>
                  <div style={{ fontSize: 66, lineHeight: 1 }}>{it.glyph}</div>
                  <div style={{ fontFamily: SANS, color: INK, fontSize: 36, fontWeight: 800, marginTop: 12 }}>{it.name}</div>
                  <div style={{ fontFamily: SANS, color: isKey ? SAGE : "rgba(42,38,32,0.6)", fontSize: 24, fontWeight: 700, marginTop: 4 }}>{it.sub}</div>
                </div>
                {/* tachado sutil sobre las 3 que no controlás */}
                {!isKey && (
                  <svg width="240" height="100%" style={{ position: "absolute", left: 0, top: "40%", overflow: "visible" }}>
                    <line x1={12} y1={20} x2={12 + 216 * easeOut(dim)} y2={16} stroke={TERRA} strokeWidth="4" opacity={0.7 * dim} strokeLinecap="round" />
                  </svg>
                )}
                {/* subrayado a mano bajo AGUA */}
                {isKey && (
                  <svg width="260" height="40" style={{ position: "absolute", left: -10, bottom: -34, overflow: "visible" }}>
                    <path d={`M 20 20 q 60 14 110 8 t 110 -6`} fill="none" stroke={SAGE} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - easeOut(underline)} />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 62, fontFamily: SANS, color: SAGE_HI, fontSize: 34, fontWeight: 800, opacity: underline, transform: `translateY(${(1 - underline) * 14}px)` }}>El agua es la única que controlás.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 6) MdBeforeAfterSlider — COMPARADOR con divisor tipo cuerda/regla vintage.
//    Una imagen (o dos) divididas por una línea de soga que barre izq→der revelando
//    "antes" (podrido) vs "después" (sano). Etiquetas flotantes con años.
// ══════════════════════════════════════════════════════════════════════════════
export const MdBeforeAfterSlider: React.FC<{ durationInFrames: number; beforeImg?: string; afterImg?: string; beforeLabel?: string; afterLabel?: string; beforeYears?: string; afterYears?: string; eyebrow?: string; accent?: string }> = ({
  durationInFrames,
  beforeImg,
  afterImg,
  beforeLabel = "Sin defender",
  afterLabel = "Defendida",
  beforeYears = "5 años",
  afterYears = "100 años",
  eyebrow = "La misma madera, distinto final",
}) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  // el divisor barre del 15% al 62% con wobble de cuerda que decae
  const sweep = easeInOut(interpolate(f, [fps * 0.5, fps * 2.2], [0.16, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const wob = Math.sin(f * 0.5) * interpolate(f, [fps * 0.5, fps * 2.6], [10, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const split = sweep * 100;
  const W = 1400, H = 720;
  const beforeP = interpolate(f, [fps * 0.8, fps * 1.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const afterP = interpolate(f, [fps * 1.6, fps * 2.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // fondos de respaldo (si no hay imagen, textura de madera dibujada)
  const Side: React.FC<{ img?: string; rot: boolean }> = ({ img, rot }) =>
    img ? (
      <Img src={staticFile(img)} style={{ width: W, height: H, objectFit: "cover" }} />
    ) : (
      <div style={{ width: W, height: H, background: rot ? "repeating-linear-gradient(85deg,#6e5a3e,#6e5a3e 22px,#5c4a32 22px,#5c4a32 44px)" : "repeating-linear-gradient(85deg,#c9a56a,#c9a56a 22px,#bd9a5e 22px,#bd9a5e 44px)" }} />
    );
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={12} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 22 }}>
        <div style={{ fontFamily: SANS, color: PAPER, fontSize: 26, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", opacity: easeOut(Math.min(1, f / (fps * 0.5))) }}>{eyebrow}</div>
        <div style={{ position: "relative", width: W, height: H, borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", border: `3px solid ${PAPER}` }}>
          {/* AFTER (sano) de fondo, full */}
          <div style={{ position: "absolute", inset: 0 }}><Side img={afterImg} rot={false} /></div>
          {/* BEFORE (podrido) recortado hasta el divisor */}
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - split}% 0 0)` }}><Side img={beforeImg} rot={true} /></div>
          {/* velo terracota tenue sobre el lado podrido para diferenciar */}
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - split}% 0 0)`, background: "rgba(90,40,26,0.22)" }} />
          {/* DIVISOR tipo cuerda/soga vintage */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `calc(${split}% + ${wob}px)`, width: 0 }}>
            <svg width="60" height={H} style={{ position: "absolute", left: -30, top: 0, overflow: "visible" }}>
              {/* soga trenzada */}
              <path d={`M 30 0 ${Array.from({ length: 24 }).map((_, k) => `Q ${30 + (k % 2 ? 9 : -9)} ${k * 30 + 15} 30 ${k * 30 + 30}`).join(" ")}`} fill="none" stroke="#b89b6a" strokeWidth="10" strokeLinecap="round" />
              <path d={`M 30 0 ${Array.from({ length: 24 }).map((_, k) => `Q ${30 + (k % 2 ? 9 : -9)} ${k * 30 + 15} 30 ${k * 30 + 30}`).join(" ")}`} fill="none" stroke="rgba(42,38,32,0.35)" strokeWidth="3" strokeDasharray="6 10" />
            </svg>
          </div>
          {/* etiquetas flotantes con años */}
          <div style={{ position: "absolute", top: 30, left: 34, fontFamily: SANS, background: PAPER, color: TERRA, fontWeight: 800, fontSize: 34, padding: "10px 22px", borderRadius: 10, borderLeft: `5px solid ${TERRA}`, boxShadow: "0 12px 30px rgba(0,0,0,0.5)", opacity: beforeP, transform: `translateY(${(1 - beforeP) * -14}px)` }}>{beforeLabel} · {beforeYears}</div>
          <div style={{ position: "absolute", top: 30, right: 34, fontFamily: SANS, background: PAPER, color: SAGE, fontWeight: 800, fontSize: 34, padding: "10px 22px", borderRadius: 10, borderRight: `5px solid ${SAGE}`, boxShadow: "0 12px 30px rgba(0,0,0,0.5)", opacity: afterP, transform: `translateY(${(1 - afterP) * -14}px)` }}>{afterLabel} · {afterYears}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 7) MdChapterKicker — RÓTULO DE CAPÍTULO/MÉTODO elegante. Cinta de papel kraft que
//    entra lateral, el número hace un flip corto, la línea se dibuja. Entra y sale suave.
// ══════════════════════════════════════════════════════════════════════════════
export const MdChapterKicker: React.FC<{ durationInFrames: number; num?: string; title?: string; kicker?: string; glyph?: string; accent?: string }> = ({ durationInFrames, num = "1", title = "Aceite de linaza", kicker = "Método", glyph = "🪵", accent }) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const a = ac(accent);
  const ribbon = spring({ frame: f - 3, fps, config: { damping: 17, stiffness: 90 } });
  // flip corto del número (rotateX)
  const flip = interpolate(f, [fps * 0.4, fps * 0.9], [90, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line = interpolate(f, [fps * 0.7, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleP = interpolate(f, [fps * 0.55, fps * 1.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", paddingLeft: 120 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, transform: `translateX(${(1 - ribbon) * -80}px)`, opacity: ribbon }}>
          {/* sello de número (kraft) con flip */}
          <div style={{ width: 128, height: 128, borderRadius: 20, background: "linear-gradient(145deg,#b79366,#9c7b4f)", display: "grid", placeItems: "center", boxShadow: "0 20px 46px rgba(0,0,0,0.55), inset 0 2px 6px rgba(255,255,255,0.25)", border: `3px solid ${PAPER}`, transform: `perspective(700px) rotateX(${flip}deg)` }}>
            <span style={{ fontFamily: SANS, color: PAPER_HI, fontSize: 74, fontWeight: 900, textShadow: "0 3px 8px rgba(0,0,0,0.4)" }}>{num}</span>
          </div>
          {/* cinta de título */}
          <div>
            <div style={{ fontFamily: SANS, color: a, fontSize: 26, fontWeight: 800, letterSpacing: 6, textTransform: "uppercase" }}>{kicker}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontFamily: SANS, color: "#fff", fontSize: 74, fontWeight: 900, lineHeight: 1.02, opacity: titleP, transform: `translateX(${(1 - titleP) * 20}px)`, textShadow: "0 3px 18px rgba(0,0,0,0.6)" }}>{title}</div>
              <span style={{ fontSize: 56, opacity: titleP }}>{glyph}</span>
            </div>
            {/* subrayado a mano que se dibuja */}
            <svg width="560" height="26" style={{ marginTop: 6, overflow: "visible" }}>
              <path d="M 4 14 q 130 12 270 6 t 280 -4" fill="none" stroke={a} strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - easeOut(line)} />
            </svg>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 8) MdEndcardManual — ENDCARD PREMIUM de cierre: libro 3D del Manual + card del
//    próximo video + lema de marca + CTA. Un solo cierre profesional (no cortar seco).
// ══════════════════════════════════════════════════════════════════════════════
export const MdEndcardManual: React.FC<{ durationInFrames: number; manualImg?: string; nextImg?: string; manualTitle?: string; nextKicker?: string; nextTitle?: string; motto?: string; cta?: string; accent?: string }> = ({
  durationInFrames,
  manualImg = "real/manual_cover.png",
  nextImg = "real/md_rising_damp_next_video.png",
  manualTitle = "Manual de Reparaciones Caseras",
  nextKicker = "En el próximo video",
  nextTitle = "La humedad que sube por la pared",
  motto = "La independencia no se compra, se construye.",
  cta = "Accedé en la descripción",
}) => {
  const op = useOp(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const book = spring({ frame: f - 6, fps, config: { damping: 15, stiffness: 90 } });
  const nextP = spring({ frame: f - 16, fps, config: { damping: 15, stiffness: 100 } });
  const mottoP = interpolate(f, [fps * 1.2, fps * 1.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bookRotY = interpolate(book, [0, 1], [-38, -22]); // libro 3D
  const spineW = 40;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ background: "radial-gradient(120% 120% at 50% 40%, #241a10 0%, #14100a 100%)" }} />
      {/* grano/viñeta de papel muy sutil */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px rgba(0,0,0,0.7)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
          {/* LIBRO 3D del manual */}
          <div style={{ perspective: 1400, opacity: book, transform: `translateY(${(1 - book) * 50}px)` }}>
            <div style={{ position: "relative", width: 340, height: 460, transformStyle: "preserve-3d", transform: `rotateY(${bookRotY}deg)` }}>
              {/* lomo */}
              <div style={{ position: "absolute", left: 0, top: 0, width: spineW, height: 460, background: "linear-gradient(90deg,#4a3722,#6b4f30)", transform: `rotateY(90deg) translateZ(-${spineW / 2}px) translateX(-${spineW / 2}px)`, borderRadius: "2px 0 0 2px" }} />
              {/* tapa */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "4px 10px 10px 4px", overflow: "hidden", boxShadow: "0 34px 80px rgba(0,0,0,0.7)", border: "1px solid rgba(0,0,0,0.4)" }}>
                <Img src={staticFile(manualImg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 40%)" }} />
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 14, background: "linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0))" }} />
              </div>
              {/* páginas (canto derecho) */}
              <div style={{ position: "absolute", right: -10, top: 6, width: 12, height: 448, background: "repeating-linear-gradient(0deg,#efe7d3,#efe7d3 2px,#d9cdb0 2px,#d9cdb0 4px)", transform: "rotateY(20deg)", borderRadius: 2 }} />
            </div>
            <div style={{ fontFamily: SANS, color: PAPER, fontSize: 30, fontWeight: 800, textAlign: "center", marginTop: 26, maxWidth: 360, lineHeight: 1.1 }}>{manualTitle}</div>
            <div style={{ display: "inline-flex", width: "100%", justifyContent: "center", marginTop: 14 }}>
              <div style={{ fontFamily: SANS, color: INK, background: "#c9a56a", fontSize: 24, fontWeight: 800, padding: "10px 24px", borderRadius: 40, boxShadow: "0 10px 26px rgba(0,0,0,0.4)" }}>{cta}</div>
            </div>
          </div>
          {/* separador */}
          <div style={{ width: 2, height: 380, background: "linear-gradient(180deg, rgba(239,231,211,0), rgba(239,231,211,0.4), rgba(239,231,211,0))", opacity: nextP }} />
          {/* CARD del próximo video */}
          <div style={{ width: 560, opacity: nextP, transform: `translateY(${(1 - nextP) * 50}px)` }}>
            <div style={{ borderRadius: 16, overflow: "hidden", border: `2px solid ${SAGE}`, boxShadow: "0 24px 60px rgba(0,0,0,0.6)", aspectRatio: "16/9" }}>
              <Img src={staticFile(nextImg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ fontFamily: SANS, color: SAGE_HI, fontSize: 24, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginTop: 18 }}>{nextKicker}</div>
            <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, lineHeight: 1.08, marginTop: 6, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{nextTitle}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 16, fontFamily: SANS, color: PAPER, fontSize: 26, fontWeight: 700, background: "rgba(124,138,90,0.92)", padding: "10px 24px", borderRadius: 40 }}>▶ No te lo pierdas</div>
          </div>
        </div>
        {/* lema de marca */}
        <div style={{ fontFamily: SANS, color: PAPER, fontSize: 40, fontWeight: 700, fontStyle: "italic", opacity: mottoP, transform: `translateY(${(1 - mottoP) * 16}px)`, textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}>{motto}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 9) MdTransition — TRANSICIONES DE MARCA entre capítulos (overlay corto ~0.5s).
//    variantes: "grain" (wipe de veta de madera), "paper" (paper-slide), "ink"
//    (ink-dissolve). Sutiles, no tapan contenido (se van rápido). Determinista.
// ══════════════════════════════════════════════════════════════════════════════
export const MdTransition: React.FC<{ durationInFrames: number; variant?: "grain" | "paper" | "ink"; accent?: string }> = ({ durationInFrames, variant = "grain", accent }) => {
  const f = useCurrentFrame();
  const a = ac(accent);
  // barrido 0..1 que entra y sale (sube hasta ~mitad, baja): panel cubre y descubre
  const half = durationInFrames / 2;
  const cover = f < half ? easeInOut(interpolate(f, [0, half], [0, 1], { extrapolateRight: "clamp" })) : easeInOut(interpolate(f, [half, durationInFrames], [1, 0], { extrapolateLeft: "clamp" }));
  if (variant === "paper") {
    // hoja de pergamino que se corre de izquierda a derecha
    const x = f < half ? interpolate(f, [0, half], [-100, 0]) : interpolate(f, [half, durationInFrames], [0, 100]);
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${x}%)`, background: "linear-gradient(100deg,#efe7d3,#e3d8bd)", boxShadow: "0 0 120px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(92deg, rgba(42,38,32,0.05) 0 3px, transparent 3px 9px)" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 40, background: "linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.28))" }} />
        </div>
      </AbsoluteFill>
    );
  }
  if (variant === "ink") {
    // disolvencia con textura de tinta que se expande desde el centro
    const r = cover * 150;
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }} preserveAspectRatio="none" viewBox="0 0 100 56">
          <defs><filter id="inkT"><feTurbulence type="fractalNoise" baseFrequency="0.05 0.08" numOctaves="2" seed="7" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="8" /></filter></defs>
          <circle cx="50" cy="28" r={r} fill={INK} filter="url(#inkT)" opacity={0.94} />
        </svg>
      </AbsoluteFill>
    );
  }
  // "grain": wipe de veta de madera que barre la pantalla
  const x = f < half ? interpolate(f, [0, half], [-110, 0]) : interpolate(f, [half, durationInFrames], [0, 110]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${x}%) skewX(-8deg)`, background: `repeating-linear-gradient(88deg, ${GOLD} 0 26px, #b8945a 26px 34px, #a07f48 34px 40px)` }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(0,0,0,0.3), rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.3))` }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 6, background: a, opacity: 0.7 }} />
      </div>
    </AbsoluteFill>
  );
};
