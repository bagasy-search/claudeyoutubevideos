// OleMythTrick — tarjeta de papel kraft sujeta con un clip que se DA VUELTA (rotateY 3D CSS):
// frente "WHAT THEY TELL YOU" + sello rojo MYTH que cae; dorso "WHAT WE DID IN CAMP" + sello verde.
// Reusable con textos distintos (front/back por props). Tiempos en SEGUNDOS relativos al inicio de la Sequence.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SERIF, LABEL, HAND, kraftBg, woodBg, hexA, rnd } from "./OleTheme";

const Bed: React.FC<{ src?: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!src) return <AbsoluteFill style={woodBg()} />;
  const s = 1.04 + 0.05 * (f / Math.max(1, durationInFrames));
  const url = /^(https?:|\/|data:)/.test(src) ? src : staticFile(src);
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", scale: String(s), filter: "blur(5px) saturate(0.92)" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: OLE.kraftL }}>
      {/\.(mp4|webm|mov)$/i.test(src) ? <OffthreadVideo src={url} muted style={st} /> : <Img src={url} style={st} />}
      <AbsoluteFill style={{ backgroundColor: hexA(OLE.cream, 0.18) }} />
    </AbsoluteFill>
  );
};

export type MythFace = { kicker?: string; text: string; stamp?: string; note?: string };

const CW = 1180, CH = 660;

// sello de goma (anillo doble, texto espaciado, tinta irregular)
const Stamp: React.FC<{ text: string; color: string; p: number; rot: number; seed: number }> = ({ text, color, p, rot, seed }) => {
  if (p <= 0) return null;
  const sc = interpolate(p, [0, 1], [2.3, 1]);
  const op = interpolate(p, [0, 0.25, 1], [0, 1, 1]);
  return (
    <div style={{ position: "absolute", right: 60, bottom: 52, rotate: `${rot}deg`, scale: String(sc), opacity: op * 0.92, transformOrigin: "center" }}>
      <div style={{ position: "relative", padding: "10px 40px", border: `8px solid ${color}`, borderRadius: 18, boxShadow: `inset 0 0 0 5px ${OLE.kraftL}, inset 0 0 0 9px ${color}` }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: text.length > 6 ? 70 : 96, letterSpacing: text.length > 6 ? 7 : 10, color, lineHeight: 1.05, paddingLeft: 10, whiteSpace: "nowrap" }}>{text}</div>
        {/* tinta que no agarró */}
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: `${rnd(seed + i) * 100}%`, top: `${rnd(seed + i + 40) * 100}%`, width: 6 + rnd(seed + i + 80) * 16, height: 3 + rnd(seed + i + 90) * 6, borderRadius: 4, background: OLE.kraftL, opacity: 0.85, rotate: `${rnd(seed + i + 7) * 180}deg` }} />
        ))}
      </div>
    </div>
  );
};

// clip de oficina (bulldog) de hierro
const Clip: React.FC = () => (
  <svg width={240} height={150} viewBox="0 0 240 150" style={{ position: "absolute", left: CW / 2 - 120, top: -70, filter: "drop-shadow(0 6px 5px rgba(0,0,0,0.35))" }}>
    <defs>
      <linearGradient id="omt-steel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8C8C8C" />
        <stop offset="0.45" stopColor="#E4E4E2" />
        <stop offset="1" stopColor="#5E5E5C" />
      </linearGradient>
    </defs>
    <path d="M70,58 C70,10 170,10 170,58" stroke="url(#omt-steel)" strokeWidth={9} fill="none" />
    <path d="M86,58 C86,26 154,26 154,58" stroke="#6F6F6D" strokeWidth={5} fill="none" />
    <rect x={20} y={54} width={200} height={82} rx={10} fill={OLE.iron} />
    <rect x={20} y={54} width={200} height={16} rx={6} fill={OLE.ironL} />
    <rect x={30} y={120} width={180} height={6} rx={3} fill="#000" opacity={0.35} />
  </svg>
);

const Face: React.FC<{ face: MythFace; kind: "front" | "back"; stampP: number; seed: number }> = ({ face, kind, stampP, seed }) => {
  const front = kind === "front";
  const color = front ? OLE.plaid : OLE.forest;
  return (
    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: front ? undefined : "rotateY(180deg)", borderRadius: 14, ...kraftBg(front ? OLE.kraftL : "#EFE3C6"), boxShadow: "inset 0 0 0 2px rgba(120,80,30,0.25), inset 0 0 60px rgba(120,80,30,0.18)", overflow: "hidden" }}>
      {/* borde picado tipo tarjeta de campamento */}
      <div style={{ position: "absolute", inset: 22, border: `3px dashed ${hexA(OLE.bean, 0.35)}`, borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 110, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 8, color, borderBottom: `4px solid ${hexA(color, 0.6)}`, paddingBottom: 6 }}>{face.kicker ?? (front ? "WHAT THEY TELL YOU" : "WHAT WE DID IN CAMP")}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 104, lineHeight: 1.02, color: front ? OLE.iron : OLE.forest, marginTop: 34, letterSpacing: -1.5, maxWidth: 1000 }}>{face.text}</div>
        {face.note ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: front ? OLE.mute : OLE.fire, marginTop: 20, rotate: "-1.5deg" }}>{face.note}</div> : null}
      </div>
      <Stamp text={face.stamp ?? (front ? "MYTH" : "CAMP WAY")} color={front ? "#B3262B" : "#2F6B3A"} p={stampP} rot={front ? -12 : -8} seed={seed + (front ? 0 : 50)} />
    </div>
  );
};

export const OleMythTrick: React.FC<{
  front?: MythFace;
  back?: MythFace;
  /** s en que la tarjeta se da vuelta (default ≈ 45 % de la duración) */
  flipAt?: number;
  /** s en que cae el sello MYTH (default: flipAt − 1.2) */
  stampAt?: number;
  /** s en que cae el sello del dorso (default: flipAt + 0.9) */
  backStampAt?: number;
  bed?: string;
  seed?: number;
}> = ({ front = { text: "Soak beans overnight" }, back = { text: "Hot pot, one hour", note: "then on to the stove" }, flipAt, stampAt, backStampAt, bed, seed = 3 }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const dur = durationInFrames / fps;
  const flip = flipAt ?? Math.max(1.8, dur * 0.45);
  const sA = stampAt ?? Math.max(0.8, flip - 1.2);
  const sB = backStampAt ?? flip + 0.9;

  const inS = spring({ frame: f, fps, config: { damping: 16, mass: 0.9 } });
  const flipS = spring({ frame: f - flip * fps, fps, config: { damping: 15, stiffness: 70, mass: 1 } });
  const rotY = flipS * 180;
  const lift = Math.sin(Math.min(1, flipS) * Math.PI);
  const stF = interpolate(f, [sA * fps, sA * fps + 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const stB = interpolate(f, [sB * fps, sB * fps + 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  // golpe del sello: sacudida corta
  const thud = (st: number, at: number) => (st >= 1 ? Math.exp(-(f - (at * fps + 7)) / 3) * Math.sin((f - at * fps) * 2.2) * 5 : 0);
  const shake = thud(stF, sA) + thud(stB, sB);
  const outP = interpolate(f, [durationInFrames - 0.4 * fps, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const baseRot = -2 + rnd(seed) * 1.6;

  return (
    <AbsoluteFill style={{ opacity: outP }}>
      <Bed src={bed} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 2200 }}>
        {/* sombra en la mesa */}
        <div style={{ position: "absolute", width: CW * (1 - 0.25 * lift), height: CH, borderRadius: 20, background: "rgba(20,15,8,0.28)", filter: `blur(${24 + lift * 30}px)`, translate: `${10 + lift * 40}px ${40 + lift * 50}px`, opacity: inS }} />
        <div style={{ position: "relative", width: CW, height: CH, transformStyle: "preserve-3d", transform: `translateY(${(1 - inS) * 700 + shake}px) rotateZ(${baseRot * (1 - lift)}deg) rotateX(${(1 - inS) * 20}deg) rotateY(${rotY}deg) scale(${1 + lift * 0.06})` }}>
          <Face face={front} kind="front" stampP={stF} seed={seed * 11} />
          <Face face={back} kind="back" stampP={stB} seed={seed * 11} />
          {/* el clip sobresale arriba, visible de los dos lados */}
          <div style={{ position: "absolute", inset: 0, transform: "translateZ(3px)", backfaceVisibility: "hidden" }}><Clip /></div>
          <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg) translateZ(3px)", backfaceVisibility: "hidden" }}><Clip /></div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
