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

// ── FoodLockReveal ────────────────────────────────────────────────────────────
// Los 4 alimentos como MAPA en zig-zag de tarjetas con CANDADO. Al decir "número N",
// la cámara RECORRE la ruta hasta esa tarjeta, el candado se ROMPE, la foto borrosa
// se ENFOCA y se escribe el nombre. Animaciones limpias estilo iOS.
const TEAL = "#12B3AE";
const INK = "#12222B";

const CARDS = [
  { img: "img/food_arroz.png", label: "ARROZ", num: "01" },
  { img: "img/food_pollo.png", label: "POLLO", num: "02" },
  { img: "img/food_espinaca.png", label: "ESPINACA", num: "03" },
  { img: "img/food_huevos.png", label: "HUEVOS", num: "04" },
];
const POS = [
  { x: 610, y: 230 },
  { x: 1310, y: 415 },
  { x: 610, y: 640 },
  { x: 1310, y: 850 },
];
const CW = 440, CH = 270;

const cI = (f: number, a: number, b: number, x: number, y: number, e?: (n: number) => number) =>
  interpolate(f, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

export const FoodLockReveal: React.FC<{ durationInFrames: number; index?: number }> = ({ durationInFrames: D, index = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = Math.max(0, Math.min(3, index));

  const fC = D * 0.42, fL = D * 0.60, fF = D * 0.80;
  const target = POS[idx];
  const camScale = cI(frame, D * 0.06, fC, 0.86, 1.42, Easing.inOut(Easing.cubic));
  const focusX = cI(frame, D * 0.06, fC, 960, target.x, Easing.inOut(Easing.cubic));
  const focusY = cI(frame, D * 0.06, fC, 560, target.y, Easing.inOut(Easing.cubic));
  const camTX = 960 - focusX * camScale;
  const camTY = 430 - focusY * camScale;
  const mapOpacity = cI(frame, 0, D * 0.08, 0, 1, Easing.out(Easing.cubic));
  const outOp = cI(frame, D - 8, D, 1, 0);

  const drawn = cI(frame, D * 0.1, fC, 0, 1, Easing.inOut(Easing.cubic));
  const fullD = `M ${POS[0].x} ${POS[0].y} L ${POS[1].x} ${POS[1].y} L ${POS[2].x} ${POS[2].y} L ${POS[3].x} ${POS[3].y}`;
  let brightD = `M ${POS[0].x} ${POS[0].y}`;
  for (let i = 1; i <= idx; i++) brightD += ` L ${POS[i].x} ${POS[i].y}`;
  // punto de luz que viaja por la ruta hasta la tarjeta activa (iOS)
  const dotT = cI(frame, D * 0.1, fC, 0, idx, Easing.inOut(Easing.cubic));
  const di = Math.min(idx, Math.floor(dotT)), df = dotT - di;
  const a = POS[Math.min(di, 3)], b = POS[Math.min(di + 1, 3)];
  const dotX = a.x + (b.x - a.x) * df, dotY = a.y + (b.y - a.y) * df;

  return (
    <AbsoluteFill style={{ opacity: outOp, background: "linear-gradient(160deg,#0a171c,#122a31)" }}>
      <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 50% 42%, rgba(18,179,174,0.10), transparent 70%)" }} />
      <AbsoluteFill style={{ opacity: mapOpacity }}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${camTX}px, ${camTY}px) scale(${camScale})`, transformOrigin: "0 0" }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path d={fullD} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={5} strokeDasharray="2 14" strokeLinecap="round" />
            {idx > 0 && <path d={brightD} fill="none" stroke={TEAL} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawn} style={{ filter: `drop-shadow(0 0 10px ${TEAL}aa)` }} />}
            {frame < fC && <circle cx={dotX} cy={dotY} r={10} fill="#fff" style={{ filter: `drop-shadow(0 0 12px ${TEAL})` }} />}
          </svg>

          {CARDS.map((card, i) => {
            const revealed = i < idx, isActive = i === idx, locked = i > idx;
            const activeBlur = cI(frame, fL, fF, 16, 0, Easing.out(Easing.cubic));
            const blurPx = revealed ? 0 : locked ? 16 : activeBlur;
            const dim = revealed ? 0.12 : locked ? 0.55 : cI(frame, fL, fF, 0.5, 0, Easing.out(Easing.cubic));
            const appear = spring({ frame: frame - i * 3, fps, config: { damping: 18, mass: 0.8 } });
            const pop = isActive ? cI(frame, fL, fF, 1, 1.05, Easing.out(Easing.back(1.6))) : 1;
            const glow = isActive ? cI(frame, fL, fF, 0, 1) : revealed ? 1 : 0;
            return (
              <div key={i} style={{ position: "absolute", left: POS[i].x - CW / 2, top: POS[i].y - CH / 2, width: CW, height: CH, transform: `scale(${(0.9 + appear * 0.1) * pop})`, transformOrigin: "center" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden", boxShadow: `0 26px 60px rgba(0,0,0,0.5)`, border: `3px solid ${isActive || revealed ? TEAL : "rgba(255,255,255,0.5)"}`, filter: glow ? `drop-shadow(0 0 ${18 * glow}px ${TEAL}cc)` : "none" }}>
                  <Img src={staticFile(card.img)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blurPx}px) saturate(${revealed || isActive ? 1.05 : 0.7})`, transform: "scale(1.08)" }} />
                  <div style={{ position: "absolute", inset: 0, background: `rgba(6,16,20,${dim})` }} />
                  <div style={{ position: "absolute", top: 14, left: 16, fontFamily: F_INTER, fontWeight: 800, fontSize: 28, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.7)", opacity: 0.9 }}>{card.num}</div>
                </div>
                <LockBadge active={isActive} locked={locked} frame={frame} fL={fL} />
              </div>
            );
          })}
          <LabelWrite text={CARDS[idx].label} x={target.x} y={target.y + CH / 2 + 60} frame={frame} start={fF} D={D} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const LockBadge: React.FC<{ active: boolean; locked: boolean; frame: number; fL: number }> = ({ active, locked, frame, fL }) => {
  if (!locked && !active) return null;
  const shakeT = active ? interpolate(frame, [fL - 8, fL + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const shake = active ? Math.sin(frame * 1.6) * 6 * shakeT * (frame < fL + 8 ? 1 : 0) : 0;
  const brk = active ? interpolate(frame, [fL + 8, fL + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;
  const lockOp = active ? interpolate(brk, [0, 0.7, 1], [1, 1, 0]) : 1;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: lockOp, transform: `translateX(${shake}px)` }}>
      <svg width={132} height={150} viewBox="0 0 150 170" style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.6))" }}>
        <g style={{ transform: `translateY(${brk * -46}px) rotate(${brk * 38}deg)`, transformOrigin: "58px 60px" }}>
          <path d="M45 70 L45 48 A30 30 0 0 1 105 48 L105 70" fill="none" stroke="#E9EEF0" strokeWidth={13} strokeLinecap="round" />
        </g>
        <g style={{ transform: `translate(${-brk * 34}px, ${brk * 60}px)` }}>
          <path d="M35 72 h40 v70 a10 10 0 0 1 -10 10 H45 a10 10 0 0 1 -10 -10 Z" fill={active ? "#F3F7F8" : "#C9D3D6"} />
        </g>
        <g style={{ transform: `translate(${brk * 34}px, ${brk * 60}px)` }}>
          <path d="M75 72 h40 v70 a10 10 0 0 1 -10 10 H85 a10 10 0 0 1 -10 -10 Z" fill={active ? "#DCE4E6" : "#B4C0C3"} />
          <circle cx="95" cy="104" r="7" fill={INK} opacity={1 - brk} />
        </g>
        {active && brk > 0 && brk < 0.6 && <circle cx="75" cy="95" r={20 + brk * 40} fill="none" stroke={TEAL} strokeWidth={4} opacity={0.8 - brk} />}
      </svg>
    </div>
  );
};

const LabelWrite: React.FC<{ text: string; x: number; y: number; frame: number; start: number; D: number }> = ({ text, x, y, frame, start, D }) => {
  const reveal = interpolate(frame, [start, start + (D - start) * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const rise = interpolate(frame, [start, start + 14], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: x - 400, top: y, width: 800, textAlign: "center", transform: `translateY(${rise}px)` }}>
      <div style={{ position: "relative", display: "inline-block", overflow: "hidden" }}>
        <div style={{ fontFamily: F_INTER, fontWeight: 900, fontSize: 84, letterSpacing: 3, color: "#fff", clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>{text}</div>
      </div>
      <div style={{ height: 8, width: 200, margin: "16px auto 0", borderRadius: 5, background: TEAL, transform: `scaleX(${reveal})`, transformOrigin: "center", boxShadow: `0 0 20px ${TEAL}` }} />
    </div>
  );
};
