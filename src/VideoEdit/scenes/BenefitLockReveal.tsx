import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { F_INTER } from "../kit/premium/theme";

// ── BenefitLockReveal ─────────────────────────────────────────────────────────
// Momento de lujo para los 3 beneficios (arrugas / várices / dolores). Un MAPA
// vertical en zig-zag de 3 tarjetas: cada una es una imagen BORROSA con un CANDADO.
// Cuando toca revelar la nº (index), la cámara SUBE hasta esa tarjeta, el candado se
// ROMPE con animación, la imagen pasa de desenfocada a enfocada, y debajo se ESCRIBE
// el texto (ARRUGAS / VÁRICES / DOLORES). Pausado y profesional — cada fase su tiempo.
const TEAL = "#12B3AE";
const INK = "#12222B";
const CORAL = "#E0523E";

const CARDS = [
  { img: "img/fe_arrugas_cara.png", label: "ARRUGAS", num: "01" },
  { img: "img/fe_varices.png", label: "VÁRICES", num: "02" },
  { img: "img/fe_rodilla_dolor.png", label: "DOLORES", num: "03" },
];
// posiciones (centro de cada tarjeta) en el lienzo 1920x1080 — zig-zag hacia abajo
const POS = [
  { x: 660, y: 300 },
  { x: 1270, y: 560 },
  { x: 660, y: 820 },
];
const CW = 500;
const CH = 320;

const clampInt = (f: number, a: number, b: number, from: number, to: number, ease?: (n: number) => number) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

export const BenefitLockReveal: React.FC<{
  durationInFrames: number;
  index?: number; // 0,1,2 → cuál se revela ahora
}> = ({ durationInFrames: D, index = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── fases (fracciones de D) — pausadas, con easing ──
  const pEstablish = 0.14; // aparece el mapa
  const pCamera = 0.42; // la cámara sube/zooma a la tarjeta activa
  const pLock = 0.60; // el candado tiembla y se rompe
  const pFocus = 0.80; // borrosa → enfocada
  // resto (pFocus→1) = se escribe el texto

  const t = frame / D; // progreso 0..1
  const fE = D * pEstablish, fC = D * pCamera, fL = D * pLock, fF = D * pFocus;

  const target = POS[index];
  // cámara: de vista amplia (todo el mapa) a zoom en la tarjeta activa
  const camScale = clampInt(frame, D * 0.06, fC, 0.9, 1.5, Easing.inOut(Easing.cubic));
  const focusX = clampInt(frame, D * 0.06, fC, 960, target.x, Easing.inOut(Easing.cubic));
  const focusY = clampInt(frame, D * 0.06, fC, 620, target.y, Easing.inOut(Easing.cubic));
  // centrar el punto de foco un poco ARRIBA del centro para dejar lugar al texto debajo
  const camTX = 960 - focusX * camScale;
  const camTY = 430 - focusY * camScale;

  const mapOpacity = clampInt(frame, 0, D * 0.08, 0, 1, Easing.out(Easing.cubic));
  const outOp = clampInt(frame, D - 8, D, 1, 0);

  // camino brillante 0..index (se dibuja durante la fase de cámara)
  const drawn = clampInt(frame, D * 0.1, fC, 0, 1, Easing.inOut(Easing.cubic));
  let brightD = `M ${POS[0].x} ${POS[0].y}`;
  for (let i = 1; i <= index; i++) brightD += ` L ${POS[i].x} ${POS[i].y}`;
  const fullD = `M ${POS[0].x} ${POS[0].y} L ${POS[1].x} ${POS[1].y} L ${POS[2].x} ${POS[2].y}`;

  return (
    <AbsoluteFill style={{ opacity: outOp, background: "linear-gradient(160deg,#0c1a20,#132b33)" }}>
      {/* leve textura/viñeta */}
      <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 50% 42%, rgba(18,179,174,0.10), transparent 70%)" }} />

      {/* CÁMARA — todo el mapa se transforma (translate+scale) */}
      <AbsoluteFill style={{ opacity: mapOpacity }}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${camTX}px, ${camTY}px) scale(${camScale})`, transformOrigin: "0 0" }}>
          {/* líneas del zig-zag */}
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path d={fullD} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={5} strokeDasharray="2 14" strokeLinecap="round" />
            {index > 0 && (
              <path d={brightD} fill="none" stroke={TEAL} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawn} style={{ filter: `drop-shadow(0 0 10px ${TEAL}aa)` }} />
            )}
          </svg>

          {/* tarjetas */}
          {CARDS.map((card, i) => {
            const revealed = i < index; // ya reveladas antes
            const isActive = i === index;
            const locked = i > index;

            // blur: reveladas=0, bloqueadas=16, activa=anima 16→0 en pFocus
            const activeBlur = clampInt(frame, fL, fF, 16, 0, Easing.out(Easing.cubic));
            const blurPx = revealed ? 0 : locked ? 16 : activeBlur;
            const dim = revealed ? 0.12 : locked ? 0.55 : clampInt(frame, fL, fF, 0.5, 0, Easing.out(Easing.cubic));

            // la activa hace un “pop” al enfocar; entrada con leve subida
            const appear = spring({ frame: frame - i * 3, fps, config: { damping: 18, mass: 0.8 } });
            const pop = isActive ? clampInt(frame, fL, fF, 1, 1.04, Easing.out(Easing.back(1.6))) : 1;
            const ringGlow = isActive ? clampInt(frame, fL, fF, 0, 1) : revealed ? 1 : 0;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: POS[i].x - CW / 2,
                  top: POS[i].y - CH / 2,
                  width: CW,
                  height: CH,
                  transform: `scale(${(0.9 + appear * 0.1) * pop})`,
                  transformOrigin: "center",
                }}
              >
                {/* tarjeta */}
                <div style={{ position: "absolute", inset: 0, borderRadius: 30, overflow: "hidden", boxShadow: `0 26px 60px rgba(0,0,0,0.5)`, border: `3px solid ${isActive || revealed ? TEAL : "rgba(255,255,255,0.5)"}`, outline: ringGlow ? `0px solid ${TEAL}` : "none", filter: ringGlow ? `drop-shadow(0 0 ${18 * ringGlow}px ${TEAL}cc)` : "none" }}>
                  <Img src={staticFile(card.img)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blurPx}px) saturate(${revealed || isActive ? 1.05 : 0.7})`, transform: "scale(1.08)" }} />
                  {/* scrim de bloqueo */}
                  <div style={{ position: "absolute", inset: 0, background: `rgba(6,16,20,${dim})` }} />
                  {/* número */}
                  <div style={{ position: "absolute", top: 16, left: 18, fontFamily: F_INTER, fontWeight: 800, fontSize: 30, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.7)", opacity: 0.9 }}>{card.num}</div>
                </div>

                {/* CANDADO */}
                <LockBadge active={isActive} locked={locked} frame={frame} fL={fL} D={D} />
              </div>
            );
          })}

          {/* TEXTO que se escribe debajo de la tarjeta activa */}
          <LabelWrite text={CARDS[index].label} x={target.x} y={target.y + CH / 2 + 70} frame={frame} start={fF} D={D} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── candado: quieto en tarjetas bloqueadas; en la activa tiembla y se ROMPE ──
const LockBadge: React.FC<{ active: boolean; locked: boolean; frame: number; fL: number; D: number }> = ({ active, locked, frame, fL, D }) => {
  if (!locked && !active) return null; // reveladas: sin candado
  // temblor previo + rotura en la activa
  const breakStart = fL + (D * 0.60 - fL) * 0.0 + 6; // arranca a romper poco después de fL
  const shakeT = active ? interpolate(frame, [fL - 8, fL + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const shake = active ? Math.sin(frame * 1.6) * 6 * shakeT * (frame < fL + 8 ? 1 : 0) : 0;
  const brk = active ? interpolate(frame, [fL + 8, fL + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;
  const lockOpacity = active ? interpolate(brk, [0, 0.7, 1], [1, 1, 0]) : 1;
  const shackleLift = brk * -46;
  const shackleRot = brk * 38;
  const bodyDrop = brk * 60;
  const bodySplit = brk * 34;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: lockOpacity, transform: `translateX(${shake}px)` }}>
      <svg width={150} height={170} viewBox="0 0 150 170" style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.6))" }}>
        {/* arco (shackle) — se levanta y rota al romper */}
        <g style={{ transform: `translateY(${shackleLift}px) rotate(${shackleRot}deg)`, transformOrigin: "58px 60px" }}>
          <path d="M45 70 L45 48 A30 30 0 0 1 105 48 L105 70" fill="none" stroke="#E9EEF0" strokeWidth={13} strokeLinecap="round" />
        </g>
        {/* cuerpo — se parte en dos mitades que caen */}
        <g style={{ transform: `translate(${-bodySplit}px, ${bodyDrop}px)` }}>
          <path d="M35 72 h40 v70 a10 10 0 0 1 -10 10 H45 a10 10 0 0 1 -10 -10 Z" fill={active ? "#F3F7F8" : "#C9D3D6"} />
        </g>
        <g style={{ transform: `translate(${bodySplit}px, ${bodyDrop}px)` }}>
          <path d="M75 72 h40 v70 a10 10 0 0 1 -10 10 H85 a10 10 0 0 1 -10 -10 Z" fill={active ? "#DCE4E6" : "#B4C0C3"} />
          <circle cx="95" cy="104" r="7" fill={INK} opacity={1 - brk} />
        </g>
        {/* destello al romper */}
        {active && brk > 0 && brk < 0.6 && (
          <circle cx="75" cy="95" r={20 + brk * 40} fill="none" stroke={TEAL} strokeWidth={4} opacity={0.8 - brk} />
        )}
      </svg>
    </div>
  );
};

// ── texto que se escribe (clip reveal + subrayado que se dibuja) ──
const LabelWrite: React.FC<{ text: string; x: number; y: number; frame: number; start: number; D: number }> = ({ text, x, y, frame, start, D }) => {
  const reveal = interpolate(frame, [start, start + (D - start) * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const rise = interpolate(frame, [start, start + 14], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: x - 400, top: y, width: 800, textAlign: "center", transform: `translateY(${rise}px)` }}>
      <div style={{ position: "relative", display: "inline-block", overflow: "hidden" }}>
        <div style={{ fontFamily: F_INTER, fontWeight: 900, fontSize: 92, letterSpacing: 4, color: "#fff", clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
          {text}
        </div>
      </div>
      <div style={{ height: 8, width: 220, margin: "18px auto 0", borderRadius: 5, background: TEAL, transform: `scaleX(${reveal})`, transformOrigin: "center", boxShadow: `0 0 20px ${TEAL}` }} />
    </div>
  );
};
