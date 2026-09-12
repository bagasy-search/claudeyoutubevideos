// Main_fedtrailer.tsx — TRAILER cinematográfico "LA CIRCULACIÓN" (Dr. Federer, 60s)
// Bespoke: montaje ultra-dinámico sync a música, avatar full en segmentos,
// texto cinético BUM, beat de silencio, drop. Todo anclado a los ms de Whisper.
import React from "react";
import {
  AbsoluteFill, Sequence, OffthreadVideo, Audio, Img, staticFile,
  interpolate, spring, useCurrentFrame, useVideoConfig, Easing,
} from "remotion";

const FPS = 30;
export const TOTAL_FRAMES_FEDTRAILER = 60 * FPS; // 1800
const S = (sec: number) => Math.round(sec * FPS);

const FONT = "Inter, 'Segoe UI', 'Arial Black', sans-serif";
const TEAL = "#15C7C0";
const RED = "#FF3B30";
const INK = "#0A0F12";

const clip = (n: string) => staticFile(`broll/${n}.mp4`);
const aud = (n: string) => staticFile(`audio/${n}`);

// ─────────────────────────────────────────────────────────────────────────
// Ken-Burns full-frame media (siempre en movimiento — nunca estático)
// ─────────────────────────────────────────────────────────────────────────
const KB: React.FC<{
  src: string; localDur: number; trim?: number;
  from?: "in" | "out" | "left" | "right"; dim?: number;
}> = ({ src, localDur, trim = 0, from = "in", dim = 0 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, localDur], [0, 1], { extrapolateRight: "clamp" });
  let scale = 1.1, tx = 0, ty = 0;
  if (from === "in") scale = interpolate(p, [0, 1], [1.06, 1.20]);
  if (from === "out") scale = interpolate(p, [0, 1], [1.20, 1.06]);
  if (from === "left") { scale = 1.16; tx = interpolate(p, [0, 1], [-3.5, 3.5]); }
  if (from === "right") { scale = 1.16; tx = interpolate(p, [0, 1], [3.5, -3.5]); }
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <OffthreadVideo
        src={src}
        muted
        toneMapped={false}
        trimBefore={trim > 0 ? trim : undefined}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
        }}
      />
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(4,8,10,${dim})` }} />}
    </AbsoluteFill>
  );
};

// Kinetic word — golpe (BUM): entra con rebote + blur→nítido + flash acento
const Word: React.FC<{
  text: string; localDur: number; color?: string; sub?: string;
  y?: number; size?: number;
}> = ({ text, localDur, color = "#fff", sub, y = 0, size = 132 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f, fps, config: { damping: 12, stiffness: 170, mass: 0.7 } });
  const scale = interpolate(sp, [0, 1], [1.42, 1.0]);
  const blur = interpolate(f, [0, 6], [16, 0], { extrapolateRight: "clamp" });
  const opIn = interpolate(f, [0, 4], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(f, [localDur - 6, localDur], [1, 0], { extrapolateLeft: "clamp" });
  const flash = interpolate(f, [0, 8], [1, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `translateY(${y}px) scale(${scale})`, opacity: Math.min(opIn, opOut), textAlign: "center" }}>
        <div style={{
          fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: -2,
          lineHeight: 0.95, color, textTransform: "uppercase",
          filter: `blur(${blur}px)`,
          textShadow: `0 6px 40px rgba(0,0,0,0.8), 0 0 ${18 + flash * 40}px ${color}`,
          WebkitTextStroke: color === "#fff" ? "0px" : "0px",
        }}>{text}</div>
        {sub && (
          <div style={{
            fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 8,
            color: TEAL, textTransform: "uppercase", marginTop: 6, opacity: 0.92,
          }}>{sub}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Lower label discreto
const Label: React.FC<{ text: string; localDur: number }> = ({ text, localDur }) => {
  const f = useCurrentFrame();
  const op = Math.min(
    interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(f, [localDur - 6, localDur], [1, 0], { extrapolateLeft: "clamp" })
  );
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 140 }}>
      <div style={{
        opacity: op, fontFamily: FONT, fontWeight: 700, fontSize: 34, letterSpacing: 1,
        color: "#fff", textShadow: "0 3px 20px rgba(0,0,0,0.9)",
        borderLeft: `4px solid ${TEAL}`, paddingLeft: 16,
      }}>{text}</div>
    </AbsoluteFill>
  );
};

type Shot = {
  a: number; b: number; kind: "stock" | "av";
  src?: string; trim?: number; kb?: "in" | "out" | "left" | "right"; dim?: number;
  word?: string; wordColor?: string; sub?: string; wsize?: number;
  label?: string;
};

// ─── SHOT LIST (segundos reales, anclados a Whisper) ───────────────────────
const SHOTS: Shot[] = [
  // COLD OPEN 0–4
  { a: 0.0, b: 2.3, kind: "stock", src: "t_red_cells", kb: "in", dim: 0.35 },
  { a: 2.3, b: 4.0, kind: "stock", src: "t_blood_vessel", kb: "left", dim: 0.3, label: "circulación" },
  // HOOK A (narr1) 4–13
  { a: 4.0, b: 6.2, kind: "av", trim: 0, kb: "in" },                                   // "Tu corazón late…"
  { a: 6.2, b: 8.0, kind: "stock", src: "t_heart_beat", kb: "in", dim: 0.15, word: "100.000", sub: "latidos / día", wordColor: "#fff", wsize: 150 },
  { a: 8.0, b: 9.8, kind: "stock", src: "t_red_cells", kb: "right", dim: 0.2, label: "empujando tu sangre" },
  { a: 9.8, b: 11.5, kind: "stock", src: "t_artery_network", kb: "in", dim: 0.15, word: "100.000 KM", wordColor: TEAL, wsize: 118 },
  { a: 11.5, b: 13.0, kind: "stock", src: "t_veins_arm", kb: "left", dim: 0.2, label: "venas y arterias" },
  // TURN B 13–16
  { a: 13.0, b: 15.1, kind: "av", trim: 270, kb: "in" },                               // "Pero cuando la circulación falla"
  { a: 15.1, b: 16.0, kind: "stock", src: "t_body_glow", kb: "in", dim: 0.25, word: "CIRCULACIÓN", wordColor: RED, wsize: 116 },
  // SYMPTOMS C 16–25.3
  { a: 16.0, b: 17.85, kind: "stock", src: "t_stethoscope", kb: "out", dim: 0.4, label: "el cuerpo se apaga…" },
  { a: 17.85, b: 18.84, kind: "stock", src: "t_tired_senior", kb: "in", dim: 0.35, word: "SILENCIO", wordColor: "#fff", wsize: 128 },
  { a: 18.84, b: 20.19, kind: "stock", src: "t_cold_hands", kb: "in", dim: 0.15, word: "MANOS FRÍAS", wordColor: TEAL, wsize: 104 },
  { a: 20.19, b: 21.7, kind: "stock", src: "t_legs_elderly", kb: "left", dim: 0.15, word: "PIERNAS PESADAS", wordColor: TEAL, wsize: 86 },
  { a: 21.7, b: 24.0, kind: "stock", src: "t_old_hands", kb: "in", dim: 0.2, word: "CANSANCIO", wordColor: RED, wsize: 112 },
  { a: 24.0, b: 25.3, kind: "av", trim: 600, kb: "out", dim: 0.1 },                     // "…explicarte" (cara → oscuro)
  // SILENCE BEAT 25.3–30.5 (un solo clip lento + una frase, música casi muda)
  { a: 25.3, b: 30.5, kind: "stock", src: "t_tired_senior", kb: "in", dim: 0.5, label: "Nadie te explicó por qué." },
  // DROP (narr2) 30.5–39.9
  { a: 30.5, b: 32.4, kind: "av", trim: 0, kb: "in" },                                 // "Hoy voy a mostrarte"
  { a: 32.4, b: 33.8, kind: "stock", src: "t_body_glow", kb: "in", dim: 0.1, word: "DENTRO DE TI", wordColor: TEAL, wsize: 100 },
  { a: 33.8, b: 35.3, kind: "stock", src: "t_red_cells", kb: "in", dim: 0.15, label: "lo que de verdad pasa" },
  { a: 35.3, b: 37.5, kind: "av", trim: 144, kb: "in" },                               // "y cómo empezar a cambiarlo"
  { a: 37.5, b: 39.9, kind: "stock", src: "t_sunrise_window", kb: "in", dim: 0.1, word: "ESTA NOCHE", wordColor: "#FFD36B", wsize: 112 },
  // CLIMAX wordless 39.9–53
  { a: 39.9, b: 40.7, kind: "stock", src: "t_jog", kb: "in", dim: 0.1 },
  { a: 40.7, b: 41.5, kind: "stock", src: "t_walk_park", kb: "left", dim: 0.1 },
  { a: 41.5, b: 42.3, kind: "stock", src: "t_ecg_line", kb: "right", dim: 0.1 },
  { a: 42.3, b: 43.1, kind: "stock", src: "t_pulse_wrist", kb: "in", dim: 0.1 },
  { a: 43.1, b: 43.9, kind: "stock", src: "t_red_cells", kb: "out", dim: 0.1 },
  { a: 43.9, b: 45.4, kind: "stock", src: "t_artery_network", kb: "in", dim: 0.2, word: "CIRCULACIÓN", wordColor: TEAL, wsize: 122 },
  { a: 45.4, b: 46.2, kind: "stock", src: "t_blood_vessel", kb: "left", dim: 0.1 },
  { a: 46.2, b: 47.1, kind: "stock", src: "t_body_glow", kb: "in", dim: 0.1 },
  { a: 47.1, b: 48.2, kind: "stock", src: "t_pulse_wrist", kb: "right", dim: 0.1 },
  { a: 48.2, b: 49.4, kind: "stock", src: "t_jog", kb: "in", dim: 0.1 },
  { a: 49.4, b: 51.0, kind: "stock", src: "t_sunrise_window", kb: "in", dim: 0.12 },
  { a: 51.0, b: 53.0, kind: "stock", src: "t_red_cells", kb: "in", dim: 0.4 },
  // ENDCARD 53–60
  { a: 53.0, b: 60.0, kind: "stock", src: "t_blood_vessel", kb: "in", dim: 0.62 },
];

// Letterbox + viñeta cinematográfica (encima de TODO)
const CineFrame: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ boxShadow: "inset 0 0 320px 60px rgba(0,0,0,0.75)" }} />
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 78, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 78, background: "#000" }} />
  </AbsoluteFill>
);

// Endcard
const Endcard: React.FC<{ localDur: number }> = ({ localDur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f, fps, config: { damping: 16, stiffness: 120 } });
  const scale = interpolate(sp, [0, 1], [0.86, 1.0]);
  const op = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(sp, [0, 1], [0, 300]);
  const subOp = interpolate(f, [18, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outOp = interpolate(f, [localDur - 18, localDur], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: outOp }}>
      <div style={{ transform: `scale(${scale})`, opacity: op, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: 10, color: TEAL, textTransform: "uppercase", marginBottom: 14 }}>
          Dr. Federer
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, letterSpacing: -2, color: "#fff", lineHeight: 0.98, textShadow: "0 8px 50px rgba(0,0,0,0.8)" }}>
          LA VERDAD SOBRE<br />TU CIRCULACIÓN
        </div>
        <div style={{ height: 4, width: lineW, background: TEAL, margin: "26px auto 0", borderRadius: 2 }} />
        <div style={{ opacity: subOp, fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", marginTop: 22 }}>
          Suscríbete · Nuevo episodio
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SFX: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 0.8 }) => (
  <Sequence from={S(at)}><Audio src={aud(src)} volume={vol} /></Sequence>
);

export const MainFedtrailer: React.FC = () => {
  const f = useCurrentFrame();
  // Música: build → duck en silencio → drop → clímax → fade
  const musicVol = interpolate(
    f,
    [0, 120, 155, 758, 790, 905, 918, 1200, 1210, 1590, 1770, 1800],
    [0, 0.48, 0.24, 0.24, 0.10, 0.10, 0.5, 0.5, 0.82, 0.66, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      {/* VISUAL SHOTS */}
      {SHOTS.map((s, i) => {
        const from = S(s.a);
        const dur = S(s.b) - S(s.a);
        const isEnd = s.a >= 53.0;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {s.kind === "av" ? (
              <KB src={staticFile(s.a < 26 ? "av1.mp4" : "av2.mp4")} localDur={dur} trim={s.trim} from={s.kb} dim={s.dim} />
            ) : (
              <KB src={clip(s.src!)} localDur={dur} from={s.kb} dim={s.dim} />
            )}
            {s.label && <Label text={s.label} localDur={dur} />}
            {s.word && <Word text={s.word} localDur={dur} color={s.wordColor} sub={s.sub} size={s.wsize} />}
            {isEnd && <Endcard localDur={dur} />}
          </Sequence>
        );
      })}

      <CineFrame />

      {/* AUDIO */}
      <Audio src={aud("trailer_music.wav")} volume={musicVol} />
      <Sequence from={S(4.0)}><Audio src={staticFile("narr1.wav")} volume={1.15} /></Sequence>
      <Sequence from={S(30.5)}><Audio src={staticFile("narr2.wav")} volume={1.15} /></Sequence>

      {/* SFX */}
      <SFX at={0.3} src="heartbeat.mp3" vol={0.85} />
      <SFX at={2.1} src="heartbeat.mp3" vol={0.7} />
      <SFX at={6.2} src="hit.mp3" vol={0.5} />
      <SFX at={9.8} src="whoosh.mp3" vol={0.4} />
      <SFX at={10.5} src="hit.mp3" vol={0.45} />
      <SFX at={13.0} src="whoosh.mp3" vol={0.45} />
      <SFX at={17.85} src="hit.mp3" vol={0.55} />
      <SFX at={18.84} src="hit.mp3" vol={0.55} />
      <SFX at={20.19} src="hit.mp3" vol={0.55} />
      <SFX at={21.7} src="hit.mp3" vol={0.5} />
      <SFX at={29.3} src="heartbeat.mp3" vol={0.7} />
      <SFX at={30.5} src="boom.mp3" vol={0.95} />
      <SFX at={37.5} src="whoosh.mp3" vol={0.4} />
      <SFX at={39.9} src="whoosh.mp3" vol={0.45} />
      <SFX at={40.7} src="whoosh.mp3" vol={0.4} />
      <SFX at={42.3} src="whoosh.mp3" vol={0.4} />
      <SFX at={43.9} src="brass.mp3" vol={0.75} />
      <SFX at={51.0} src="whoosh.mp3" vol={0.45} />
      <SFX at={53.0} src="boom.mp3" vol={0.95} />
    </AbsoluteFill>
  );
};
