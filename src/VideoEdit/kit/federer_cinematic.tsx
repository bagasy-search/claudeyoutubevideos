import React from "react";
import { AbsoluteFill, Sequence, OffthreadVideo, Audio, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { F_INTER, F_OSWALD } from "./premium/theme";
import { PremiumBackdrop } from "./federer_premium";
import { LowerThirdFederer } from "./federer_broadcast";

const TEAL = "#19CDC6", TEALhi = "#8BF6EF", GOLD = "#E7C27D", W = "#FFFFFF", INK0 = "#040d10";

// ── CÁMARA VIVA — Ken Burns determinista sobre cualquier clip ────────────────
export const LiveShot: React.FC<{ src: string; from?: number; seed?: number; mode?: "drift" | "punch"; z0?: number; z1?: number }> = ({
  src, from = 0, seed = 0, mode = "drift", z0, z1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 1], { extrapolateRight: "clamp" });
  const zoomIn = seed % 2 === 0;
  const a = z0 ?? (mode === "punch" ? 1.16 : 1.05);
  const b = z1 ?? (mode === "punch" ? 1.30 : 1.16);
  const scale = zoomIn ? interpolate(p, [0, 1], [a, b]) : interpolate(p, [0, 1], [b, a]);
  const dx = interpolate(p, [0, 1], [0, (seed % 4 < 2 ? 1 : -1) * (mode === "punch" ? 8 : 26)]);
  const dy = interpolate(p, [0, 1], [0, (seed % 2 ? 1 : -1) * (mode === "punch" ? 6 : 18)]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: INK0 }}>
      <div style={{ position: "absolute", inset: -60, transform: `scale(${scale}) translate(${dx}px, ${dy}px)` }}>
        <OffthreadVideo src={staticFile(src)} muted startFrom={from} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </AbsoluteFill>
  );
};

// ── COLD OPEN — teaser rítmico de 3s: flash de los mejores momentos + título ──
const TEASER = [
  { src: "broll/rnrb003.mp4", from: 20, len: 15 },
  { src: "broll/rnrb010.mp4", from: 12, len: 13 },
  { src: "broll/rnrb011.mp4", from: 10, len: 12 },
  { src: "broll/rnrb183.mp4", from: 18, len: 10 },
  { src: "broll/rnrb130.mp4", from: 14, len: 10 },
];
const STABS = [{ at: 26, text: "MELASMA" }, { at: 48, text: "MANCHAS" }, { at: 62, text: "ARRUGAS" }];

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  // flashes blancos en cada corte
  let cut = 0; const bounds: number[] = [];
  for (const c of TEASER) { bounds.push(cut); cut += c.len; }
  const flash = bounds.reduce((m, b) => Math.max(m, interpolate(frame, [b - 1, b, b + 3], [0, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), 0);
  const titleStart = cut; // ~60
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER, backgroundColor: INK0 }}>
      {/* cortes rápidos con punch-zoom */}
      {TEASER.map((c, i) => (
        <Sequence key={i} from={bounds[i]} durationInFrames={c.len}>
          <LiveShot src={c.src} from={c.from} seed={i} mode="punch" />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,13,16,0.1), rgba(4,13,16,0.55))" }} />
          <AbsoluteFill style={{ boxShadow: `inset 0 0 220px rgba(4,13,16,0.7)` }} />
        </Sequence>
      ))}
      {/* text stabs */}
      {STABS.map((s, i) => {
        const op = interpolate(frame, [s.at - 2, s.at, s.at + 6, s.at + 9], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const sc = interpolate(frame, [s.at - 2, s.at + 9], [1.15, 1.0]);
        if (op <= 0) return null;
        return (
          <AbsoluteFill key={i} style={{ alignItems: "center", justifyContent: "center", opacity: op }}>
            <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 150, letterSpacing: 6, color: W, transform: `scale(${sc})`, textShadow: "0 8px 40px rgba(0,0,0,0.8)", WebkitTextStroke: `2px ${TEAL}55` }}>{s.text}</div>
          </AbsoluteFill>
        );
      })}
      {/* flash blanco */}
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
      {/* TÍTULO final */}
      {frame >= titleStart && (
        <Sequence from={titleStart} layout="none">
          <TeaserTitle />
        </Sequence>
      )}
      {/* SFX — whoosh grave en cada corte rápido (se superponen = riser que crece) */}
      {bounds.map((b, i) => (
        <Sequence key={"a" + i} from={Math.max(0, b - 3)} durationInFrames={45} layout="none">
          <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.8} />
        </Sequence>
      ))}
      {/* (el GOLPE del título se dispara desde el nivel de arriba para que no se recorte su cola) */}
    </AbsoluteFill>
  );
};

// frame absoluto donde aparece el título (suma de las duraciones del teaser)
export const COLDOPEN_TITLE_FRAME = TEASER.reduce((s, c) => s + c.len, 0);

const TeaserTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 200, mass: 0.6 } });
  const lineW = interpolate(p, [0, 1], [0, 520]);
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER, alignItems: "center", justifyContent: "center" }}>
      <PremiumBackdrop />
      <div style={{ textAlign: "center", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)` }}>
        <div style={{ fontFamily: F_OSWALD, fontWeight: 700, letterSpacing: 6, color: GOLD, fontSize: 26, marginBottom: 14 }}>DR. FEDERER</div>
        <div style={{ fontWeight: 900, fontSize: 104, letterSpacing: -2, lineHeight: 1, background: `linear-gradient(180deg, ${W}, ${TEALhi})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>ADIÓS A LAS MANCHAS</div>
        <div style={{ height: 3, width: lineW, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "22px auto 0" }} />
        <div style={{ color: W, fontWeight: 600, fontSize: 34, marginTop: 20, opacity: interpolate(p, [0.5, 1], [0, 0.92]) }}>El truco del romero, de noche</div>
      </div>
    </AbsoluteFill>
  );
};

// ── COLD OPEN "REVELACIÓN" — oscuro, fragmentos que insinúan, cortes-impacto ──
// Pensado para caer sobre un sub-bass IMAX: cada IMPACTO = flash a negro + punch
// que asienta + pulso de viñeta. Retiene la info (curiosity gap), no spoilea.
const FRAGS = [
  { src: "broll/rnrb003.mp4", from: 30, at: 0, len: 34, text: "Tu piel esconde algo…" },
  { src: "broll/rnrb130.mp4", from: 16, at: 34, len: 24, text: "" },
  { src: "broll/rnrb011.mp4", from: 12, at: 58, len: 22, text: "Y casi nadie sabe por qué" },
  { src: "broll/rnrb183.mp4", from: 20, at: 80, len: 22, text: "" },
];
const TITLE_AT = 102;
const Letterbox: React.FC<{ h?: number }> = ({ h = 74 }) => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: h, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h, background: "#000" }} />
  </>
);

export const ColdOpenRevelation: React.FC = () => {
  const frame = useCurrentFrame();
  // (fps no se usa en esta escena; se deja el hook fuera para no romper el orden)
  // flash a negro en cada impacto (inicio de cada fragmento) + en el título
  const impacts = [...FRAGS.map((f) => f.at), TITLE_AT];
  const black = impacts.reduce((m, b) => Math.max(m, interpolate(frame, [b - 2, b, b + 4], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), 0);
  const vign = impacts.reduce((m, b) => Math.max(m, interpolate(frame, [b, b + 8], [0.9, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), 0.4);
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER, backgroundColor: "#000" }}>
      {FRAGS.map((f, i) => (
        <Sequence key={i} from={f.at} durationInFrames={f.len}>
          {/* punch que ASIENTA (grande→chico) para sensación de peso */}
          <LiveShot src={f.src} from={f.from} seed={0} z0={1.36} z1={1.12} />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.72))" }} />
          {f.text && (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 170 }}>
              <div style={{ color: W, fontWeight: 700, fontSize: 46, letterSpacing: 0.5, textShadow: "0 6px 30px rgba(0,0,0,0.9)", opacity: interpolate(frame - f.at, [4, 12, f.len - 6, f.len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{f.text}</div>
            </AbsoluteFill>
          )}
        </Sequence>
      ))}
      {/* viñeta pulsante (respira con los impactos) */}
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${260 + vign * 180}px rgba(0,0,0,${0.55 + vign * 0.3})`, pointerEvents: "none" }} />
      {/* TÍTULO impacto */}
      {frame >= TITLE_AT && (
        <Sequence from={TITLE_AT} layout="none"><RevealTitle /></Sequence>
      )}
      {/* flash a negro de los impactos (encima de todo salvo letterbox) */}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: black }} />
      <Letterbox />
    </AbsoluteFill>
  );
};

const RevealTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 220, mass: 0.9 } });
  const sc = interpolate(p, [0, 1], [1.22, 1.0]);
  const lineW = interpolate(p, [0, 1], [0, 560]);
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER, alignItems: "center", justifyContent: "center" }}>
      <PremiumBackdrop />
      <div style={{ textAlign: "center", opacity: p, transform: `scale(${sc})` }}>
        <div style={{ fontFamily: F_OSWALD, fontWeight: 700, letterSpacing: 7, color: GOLD, fontSize: 24, marginBottom: 16 }}>DR. FEDERER</div>
        <div style={{ fontWeight: 900, fontSize: 112, letterSpacing: -2.5, lineHeight: 0.98, background: `linear-gradient(180deg, ${W}, ${TEALhi})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", textShadow: "0 0 60px rgba(25,205,198,0.3)" }}>ADIÓS A LAS MANCHAS</div>
        <div style={{ height: 3, width: lineW, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "24px auto 0" }} />
        <div style={{ color: W, fontWeight: 600, fontSize: 32, marginTop: 20, letterSpacing: 1, opacity: interpolate(p, [0.5, 1], [0, 0.9]) }}>Lo que tu piel te pide de noche</div>
      </div>
    </AbsoluteFill>
  );
};

// ── MUESTRA — cold open (3s) + sección con cámara viva (6s) ───────────────────
const KB = [
  { src: "broll/rnrb060.mp4", from: 8 },
  { src: "broll/rnrb200.mp4", from: 8 },
  { src: "broll/rnrb100.mp4", from: 8 },
];
export const FedererSample: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: INK0 }}>
      {/* MÚSICA — New Horizon (cama melódica de marca) */}
      <Audio src={staticFile("sfx/music_federer.mp3")} volume={0.62} />
      {/* CAMA — rumble grave constante bajo todo (tu SFX) */}
      <Audio src={staticFile("sfx/rumble_const.mp3")} volume={0.38} />
      {/* GOLPE del título — al nivel de arriba: su cola RESUENA hasta el final, sin recortarse */}
      <Sequence from={Math.max(0, COLDOPEN_TITLE_FRAME - 9)} layout="none"><Audio src={staticFile("sfx/impacto_hit.mp3")} volume={1} /></Sequence>
      {/* 0-90: COLD OPEN */}
      <Sequence from={0} durationInFrames={90}><ColdOpen /></Sequence>
      {/* 90-270: CÁMARA VIVA (Ken Burns) en b-roll */}
      <Sequence from={90} durationInFrames={64}><LiveShot src={KB[0].src} from={KB[0].from} seed={0} mode="drift" />
        <LowerThirdFederer title="Así trabaja el romero de noche" subtitle="Cámara viva — nada queda estático" /></Sequence>
      <Sequence from={154} durationInFrames={58}><LiveShot src={KB[1].src} from={KB[1].from} seed={1} mode="drift" /></Sequence>
      <Sequence from={212} durationInFrames={58}><LiveShot src={KB[2].src} from={KB[2].from} seed={2} mode="drift" /></Sequence>
      {/* whoosh en los cambios de escena de la sección cámara-viva */}
      <Sequence from={151} layout="none"><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.6} /></Sequence>
      <Sequence from={209} layout="none"><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.6} /></Sequence>
      {/* viñeta constante para cohesión cine */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 300px rgba(0,0,0,0.55)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
