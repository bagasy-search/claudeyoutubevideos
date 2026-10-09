// OleSaltAcidTimeline — línea de receta que AVANZA como una olla en el tiempo ("pot goes on" → "tender" → "rest 15 min").
// Las fichas de ingredientes CAEN en su momento: al inicio sal, salt pork, cebolla, laurel, pimienta; al final vinagre,
// tomate, melaza, mostaza. mode "wrong": la melaza (ítem con wrong:true) cae al INICIO con cruz + candado y el poroto
// queda "STILL HARD" al final. Tiempos en SEGUNDOS relativos al inicio de la Sequence.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SERIF, LABEL, HAND, kraftBg, woodBg, hexA, rnd } from "./OleTheme";

const Bed: React.FC<{ src?: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!src) return <AbsoluteFill style={woodBg()} />;
  const s = 1.04 + 0.05 * (f / Math.max(1, durationInFrames));
  const url = /^(https?:|\/|data:)/.test(src) ? src : staticFile(src);
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", scale: String(s), filter: "blur(6px) saturate(0.9)" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: OLE.kraftL }}>
      {/\.(mp4|webm|mov)$/i.test(src) ? <OffthreadVideo src={url} muted style={st} /> : <Img src={url} style={st} />}
      <AbsoluteFill style={{ backgroundColor: hexA(OLE.cream, 0.2) }} />
    </AbsoluteFill>
  );
};

export type TimelineItem = { label: string; amount?: string; at: "start" | "end"; t?: number; wrong?: boolean };

export const OLE_TIMELINE_ITEMS: TimelineItem[] = [
  { label: "Salt", amount: "1 TBSP", at: "start" },
  { label: "Salt pork", amount: "½ LB", at: "start" },
  { label: "Onion", amount: "1 BIG", at: "start" },
  { label: "Bay leaf", amount: "2", at: "start" },
  { label: "Black pepper", amount: "1 TSP", at: "start" },
  { label: "Vinegar", amount: "1 TBSP", at: "end" },
  { label: "Tomato", amount: "1 CUP", at: "end" },
  { label: "Molasses", amount: "¼ CUP", at: "end" },
  { label: "Mustard", amount: "1 TSP", at: "end" },
];
export const OLE_TIMELINE_WRONG: TimelineItem[] = [
  { label: "Salt", amount: "1 TBSP", at: "start" },
  { label: "Salt pork", amount: "½ LB", at: "start" },
  { label: "Onion", amount: "1 BIG", at: "start" },
  { label: "Molasses", amount: "¼ CUP", at: "start", wrong: true },
  { label: "Tomato", amount: "1 CUP", at: "start", wrong: true },
  { label: "Vinegar", amount: "1 TBSP", at: "end" },
  { label: "Mustard", amount: "1 TSP", at: "end" },
];

const BW = 1800, BH = 960;
const TRACK_Y = 812, X_ON = 170, X_TENDER = 1270, X_REST = 1640;

const Padlock: React.FC = () => (
  <svg width={54} height={62} viewBox="0 0 54 62" style={{ position: "absolute", right: -18, top: -26, filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.3))" }}>
    <path d="M14,28 L14,18 C14,4 40,4 40,18 L40,28" stroke="#6E6E6C" strokeWidth={7} fill="none" />
    <rect x={4} y={26} width={46} height={34} rx={6} fill={OLE.plaid} />
    <circle cx={27} cy={40} r={5} fill={OLE.iron} /><rect x={25} y={42} width={4} height={10} fill={OLE.iron} />
  </svg>
);

const Chip: React.FC<{ it: TimelineItem; p: number; seed: number; wrongMode: boolean }> = ({ it, p, seed, wrongMode }) => {
  const rot = (rnd(seed) - 0.5) * 7;
  const y = (1 - p) * -760;
  const bad = wrongMode && !!it.wrong;
  const crossP = bad ? Math.max(0, Math.min(1, (p - 0.98) * 50)) : 0;
  return (
    <div style={{ position: "relative", translate: `0 ${y}px`, rotate: `${rot + (1 - p) * 18}deg`, opacity: p > 0 ? 1 : 0 }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "16px 34px 16px 58px", ...kraftBg(bad ? "#EBD6C4" : "#E6CFA2"), clipPath: "polygon(22px 0, 100% 0, 100% 100%, 22px 100%, 0 50%)", filter: "drop-shadow(0 6px 6px rgba(40,25,10,0.35))" }}>
        <div style={{ position: "absolute", left: 22, top: "50%", width: 16, height: 16, marginTop: -8, borderRadius: "50%", background: OLE.paper, boxShadow: "inset 0 2px 3px rgba(0,0,0,0.35)" }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: OLE.iron, lineHeight: 1, whiteSpace: "nowrap" }}>{it.label}</div>
        {it.amount ? <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 2, color: bad ? OLE.plaid : OLE.fire, whiteSpace: "nowrap" }}>{it.amount}</div> : null}
      </div>
      {bad ? (
        <>
          <svg style={{ position: "absolute", inset: -6, width: "calc(100% + 12px)", height: "calc(100% + 12px)", overflow: "visible" }} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M4,8 L96,92" stroke="#B3262B" strokeWidth={7} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, crossP * 2)} strokeLinecap="round" />
            <path d="M96,8 L4,92" stroke="#B3262B" strokeWidth={7} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, Math.min(1, crossP * 2 - 1))} strokeLinecap="round" />
          </svg>
          <div style={{ opacity: crossP, scale: String(0.6 + 0.4 * crossP) }}><Padlock /></div>
        </>
      ) : null}
    </div>
  );
};

// olla de hierro con tapa torcida y vapor
const Pot: React.FC<{ t: number; heat: number; lidOpen: number }> = ({ t, heat, lidOpen }) => (
  <svg width={220} height={200} viewBox="-110 -150 220 200" style={{ overflow: "visible" }}>
    {Array.from({ length: 4 }).map((_, i) => {
      const ph = ((t * 0.5 + i * 0.25) % 1);
      return <circle key={i} cx={Math.sin(ph * 5 + i) * 16 + (i - 1.5) * 14} cy={-70 - ph * 80} r={10 + ph * 18} fill="#fff" opacity={(1 - ph) * 0.55 * heat} />;
    })}
    <path d="M-66,-40 C-66,-110 66,-110 66,-40" stroke={OLE.ironL} strokeWidth={5} fill="none" />
    <g transform={`translate(0,-44) rotate(${-10 * lidOpen}) translate(${-8 * lidOpen},${-6 * lidOpen})`}>
      <ellipse cx={0} cy={0} rx={74} ry={12} fill={OLE.ironL} />
      <rect x={-12} y={-18} width={24} height={10} rx={4} fill={OLE.iron} />
    </g>
    <path d="M-76,-40 L76,-40 L70,20 C66,40 40,44 0,44 C-40,44 -66,40 -70,20 Z" fill={OLE.iron} />
    <path d="M-74,-30 L74,-30" stroke={OLE.ironL} strokeWidth={4} />
    <ellipse cx={-30} cy={-8} rx={16} ry={26} fill="#fff" opacity={0.07} />
  </svg>
);

export const OleSaltAcidTimeline: React.FC<{
  items?: TimelineItem[];
  mode?: "right" | "wrong";
  /** [s] = [la olla va al fuego, llega a "tender", llega a "rest"] */
  progressAt?: number[];
  title?: string;
  startLabel?: string;
  endLabel?: string;
  milestones?: [string, string, string];
  hardLabel?: string;
  bed?: string;
  seed?: number;
}> = ({ items, mode = "right", progressAt, title, startLabel = "AT THE START", endLabel = "AT THE END", milestones = ["POT GOES ON", "TENDER", "REST 15 MIN"], hardLabel = "STILL HARD", bed, seed = 31 }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const dur = durationInFrames / fps;
  const t = f / fps;
  const wrong = mode === "wrong";
  const list = items ?? (wrong ? OLE_TIMELINE_WRONG : OLE_TIMELINE_ITEMS);
  const ttl = title ?? (wrong ? "The mistake most folks make" : "When things go in");
  const starts = list.filter((i) => i.at === "start"), ends = list.filter((i) => i.at === "end");
  const pOn = progressAt?.[0] ?? 0.5;
  const pTender = Math.max(pOn + 2, progressAt?.[1] ?? dur * 0.58);
  const pRest = Math.max(pTender + 1.5, progressAt?.[2] ?? dur * 0.86);
  const tStart = (i: number) => starts[i].t ?? pOn + 0.5 + i * Math.min(0.5, (pTender - pOn - 1.8) / Math.max(1, starts.length));
  const tEnd = (i: number) => ends[i].t ?? pTender + 0.35 + i * Math.min(0.5, (pRest - pTender - 0.6) / Math.max(1, ends.length));
  const moveFrom = Math.min(pTender - 0.8, (starts.length ? tStart(starts.length - 1) : pOn) + 0.6);
  const potX = interpolate(t, [moveFrom, pTender, pRest - 0.9, pRest], [X_ON, X_TENDER, X_TENDER, X_REST], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const potIn = spring({ frame: f - pOn * fps, fps, config: { damping: 13 } });
  const heat = interpolate(t, [pRest - 0.6, pRest + 0.6], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lidOpen = interpolate(t, [pOn + 1.2, pOn + 1.8, pRest - 0.6, pRest], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inP = interpolate(f, [0, 0.6 * fps], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const outP = interpolate(f, [durationInFrames - 0.4 * fps, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drop = (at: number, k: number) => spring({ frame: f - at * fps, fps, config: { damping: 12, stiffness: 140, mass: 0.7 }, durationInFrames: 22 + (k % 2) * 4 });
  const trackP = interpolate(f, [0.2 * fps, 1 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const reached = (x: number) => potX >= x - 4;
  const hardP = wrong ? spring({ frame: f - (pTender + 0.2) * fps, fps, config: { damping: 11 } }) : 0;
  const zoneHl = (a: number, b: number) => interpolate(t, [a - 0.2, a + 0.2, b, b + 0.4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hlStart = zoneHl(pOn, moveFrom), hlEnd = zoneHl(pTender, pRest);
  return (
    <AbsoluteFill style={{ opacity: outP }}>
      <Bed src={bed} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: BW, height: BH, ...kraftBg("#EFE2C4"), borderRadius: 12, boxShadow: `0 26px 56px ${OLE.shadow}, 0 3px 8px rgba(0,0,0,0.18), inset 0 0 70px rgba(120,80,30,0.16)`, overflow: "hidden", opacity: inP, translate: `0 ${(1 - inP) * 80}px`, rotate: "-0.5deg" }}>
          <div style={{ position: "absolute", left: 70, top: 36, fontFamily: SERIF, fontWeight: 900, fontSize: 66, color: wrong ? OLE.plaid : OLE.forest, letterSpacing: -1 }}>{ttl}</div>
          {/* zonas */}
          <div style={{ position: "absolute", left: 50, top: 150, width: 960, height: 520, borderRadius: 16, border: `3px dashed ${hexA(OLE.forest, 0.35)}`, background: hexA(OLE.forest, 0.05 + 0.06 * hlStart) }} />
          <div style={{ position: "absolute", left: 1040, top: 150, width: 710, height: 520, borderRadius: 16, border: `3px dashed ${hexA(OLE.fire, 0.5)}`, background: hexA(OLE.fire, 0.05 + 0.07 * hlEnd) }} />
          <div style={{ position: "absolute", left: 80, top: 170, fontFamily: LABEL, fontWeight: 700, fontSize: 42, letterSpacing: 6, color: OLE.forest }}>{startLabel}</div>
          <div style={{ position: "absolute", left: 1070, top: 170, fontFamily: LABEL, fontWeight: 700, fontSize: 42, letterSpacing: 6, color: OLE.fire }}>{endLabel}</div>
          <div style={{ position: "absolute", left: 80, top: 250, width: 900, display: "flex", flexWrap: "wrap", gap: "30px 26px", alignContent: "flex-start" }}>
            {starts.map((it, i) => <Chip key={i} it={it} p={drop(tStart(i), i)} seed={seed + i} wrongMode={wrong} />)}
          </div>
          <div style={{ position: "absolute", left: 1070, top: 250, width: 660, display: "flex", flexWrap: "wrap", gap: "30px 26px", alignContent: "flex-start" }}>
            {ends.map((it, i) => <Chip key={i} it={it} p={drop(tEnd(i), i + 5)} seed={seed + 40 + i} wrongMode={wrong} />)}
          </div>
          {/* vía de la olla */}
          <svg width={BW} height={BH} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={X_ON - 60} y1={TRACK_Y} x2={X_ON - 60 + (X_REST + 110 - X_ON) * trackP} y2={TRACK_Y} stroke={hexA(OLE.pencil, 0.55)} strokeWidth={10} strokeLinecap="round" />
            <line x1={X_ON} y1={TRACK_Y} x2={potX} y2={TRACK_Y} stroke={wrong && potX > X_TENDER - 200 ? OLE.plaid : OLE.fire} strokeWidth={10} strokeLinecap="round" />
            {[X_ON, X_TENDER, X_REST].map((x, i) => (
              <g key={i} opacity={trackP}>
                <circle cx={x} cy={TRACK_Y} r={20} fill={reached(x) ? (wrong && i === 1 ? OLE.plaid : OLE.forest) : OLE.paper} stroke={OLE.pencil} strokeWidth={5} />
              </g>
            ))}
          </svg>
          {[X_ON, X_TENDER, X_REST].map((x, i) => (
            <div key={i} style={{ position: "absolute", left: x, top: TRACK_Y + 34, translate: i === 0 ? "-20% 0" : i === 2 ? "-75% 0" : "-50% 0", fontFamily: LABEL, fontWeight: 700, fontSize: 38, letterSpacing: 3, color: wrong && i === 1 ? OLE.plaid : OLE.pencil, opacity: trackP, whiteSpace: "nowrap", textDecoration: wrong && i === 1 && hardP > 0.5 ? "line-through" : undefined }}>{milestones[i]}</div>
          ))}
          {/* olla */}
          <div style={{ position: "absolute", left: potX - 110, top: TRACK_Y - 176, opacity: potIn, translate: `0 ${(1 - potIn) * -60}px` }}>
            <Pot t={t} heat={heat} lidOpen={lidOpen} />
          </div>
          {/* modo wrong: "STILL HARD" */}
          {wrong && hardP > 0 ? (
            <div style={{ position: "absolute", left: X_TENDER - 640, top: TRACK_Y - 124, scale: String(interpolate(hardP, [0, 1], [2, 1])), opacity: Math.min(1, hardP * 1.5), rotate: "-8deg", display: "flex", alignItems: "center", gap: 14, padding: "8px 22px", border: "7px solid #B3262B", borderRadius: 14, background: hexA(OLE.paper, 0.85) }}>
              <svg width={70} height={48} viewBox="-44 -30 88 60"><path d="M-40,-2 C-40,-24 -18,-28 2,-26 C26,-24 42,-14 42,4 C42,22 24,28 8,27 C-6,26 -10,20 -18,21 C-28,22 -40,16 -40,-2 Z" fill="#C9A27A" stroke="#6E4630" strokeWidth={4} /><path d="M-6,-24 l6,12 l-8,8 l6,12" stroke="#6E4630" strokeWidth={3} fill="none" /></svg>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 54, letterSpacing: 5, color: "#B3262B", whiteSpace: "nowrap" }}>{hardLabel}</div>
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
