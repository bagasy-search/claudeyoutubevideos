// Main_lobos.tsx — Documental "14 Lobos de Yellowstone" (Planeta Reconstruido).
// Calidad cine, COLORES NATURALES (sin grade), letterbox sutil, cross-dissolve NatGeo,
// avatar full/oculto Federer-style, overlays de datos, cascada trófica, diseño de sonido.
import React from "react";
import {
  AbsoluteFill, Sequence, OffthreadVideo, Audio, Loop, staticFile,
  interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import LB from "../../public/lobos_beats.json";
import { TrophicWeb, TravelingTimeline, MigrationArc, AuthorityQuote } from "./FaunaKit";

const FPS = 30;
export const TOTAL_FRAMES_LOBOS: number = (LB as any).total;
const BEATS: any[] = (LB as any).beats;
const FONT = "Inter, 'Segoe UI', system-ui, sans-serif";
const ACCENT = "#DCE3B0";   // verde-salvia claro, brand fauna
const clip = (n: string) => staticFile(`broll/${n}.mp4`);
const aud = (n: string) => staticFile(`audio/${n}`);

// ── Ken-Burns b-roll full (natural, cross-dissolve entry) ──────────────────
const KB: React.FC<{ src: string; dur: number; kb?: number; avatar?: boolean; trim?: number; fadeF?: number }> = ({ src, dur, kb = 0, avatar, trim, fadeF = 8 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], { extrapolateRight: "clamp" });
  const dir = kb % 4;
  let scale = interpolate(p, [0, 1], [1.05, 1.14]);
  let tx = 0;
  if (dir === 1) { scale = 1.12; tx = interpolate(p, [0, 1], [-2.5, 2.5]); }
  if (dir === 2) scale = interpolate(p, [0, 1], [1.14, 1.05]);
  if (dir === 3) { scale = 1.12; tx = interpolate(p, [0, 1], [2.5, -2.5]); }
  if (avatar) scale = interpolate(p, [0, 1], [1.02, 1.08]); // push lento
  const fade = interpolate(f, [0, fadeF], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fade }}>
      <OffthreadVideo src={src} muted toneMapped={false} trimBefore={trim && trim > 0 ? trim : undefined}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale}) translateX(${tx}%)` }} />
    </AbsoluteFill>
  );
};

// ── Overlays ───────────────────────────────────────────────────────────────
const StatTag: React.FC<{ value: string; label: string; dur: number }> = ({ value, label, dur }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const sp = spring({ frame: f, fps, config: { damping: 14, stiffness: 140 } });
  const op = Math.min(interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" }), interpolate(f, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" }));
  const num = /^[0-9.]+/.test(value) ? value.replace(/[^0-9]/g, "") : null;
  const shown = num ? Math.round(interpolate(sp, [0, 1], [0, +num])).toLocaleString("es") + (value.includes("+") ? "+" : "") : value;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: "120px 80px", opacity: op }}>
      <div style={{ transform: `scale(${interpolate(sp, [0, 1], [0.8, 1])})`, textAlign: "right", background: "rgba(12,18,14,0.55)", backdropFilter: "blur(6px)", padding: "16px 26px", borderRadius: 14, borderRight: `4px solid ${ACCENT}` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 92, color: "#fff", lineHeight: 0.9, textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>{shown}</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", marginTop: 8 }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};
const LocationTag: React.FC<{ label: string; dur: number }> = ({ label, dur }) => {
  const f = useCurrentFrame();
  const op = Math.min(interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" }), interpolate(f, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" }));
  const drop = spring({ frame: f, fps: FPS, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 130px 80px", opacity: op }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(12,18,14,0.5)", backdropFilter: "blur(6px)", padding: "12px 22px", borderRadius: 40 }}>
        <div style={{ width: 14, height: 14, borderRadius: "50% 50% 50% 0", background: ACCENT, transform: `rotate(-45deg) translateY(${interpolate(drop, [0, 1], [-8, 0])}px)` }} />
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#fff", letterSpacing: 1 }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};
const PhraseTag: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const op = interpolate(f, [dur - 12, dur], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150, opacity: op }}>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", maxWidth: 1400 }}>
        {words.map((w, i) => {
          const acc = w.startsWith("*") && w.endsWith("*");
          const clean = w.replace(/\*/g, "");
          const wp = interpolate(f, [i * 3, i * 3 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <span key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: acc ? ACCENT : "#fff", opacity: wp, transform: `translateY(${interpolate(wp, [0, 1], [14, 0])}px)`, textShadow: "0 3px 20px rgba(0,0,0,0.85)" }}>{clean}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Cascada trófica (el momento WOW) — nodos + flechas (sin emoji) ──────────
const CHAIN = [
  { es: "LOBO", sub: "el depredador", c: "#C9C2B4" },
  { es: "CIERVO", sub: "se mueve", c: "#D8B98A" },
  { es: "SAUCE", sub: "vuelve a crecer", c: "#A7C68B" },
  { es: "CASTOR", sub: "construye", c: "#8FB6C9" },
  { es: "RÍO", sub: "cambia de curso", c: "#7FB0D8" },
];
const Cascade: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const op = Math.min(interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" }), interpolate(f, [dur - 14, dur], [1, 0], { extrapolateLeft: "clamp" }));
  const per = (dur - 24) / CHAIN.length;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg,#0b1210,#131c17)", justifyContent: "center", alignItems: "center", opacity: op }}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: ACCENT, textTransform: "uppercase", marginBottom: 54 }}>La cascada trófica</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {CHAIN.map((c, i) => {
          const t = interpolate(f, [i * per, i * per + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const arr = interpolate(f, [i * per + 8, i * per + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <React.Fragment key={i}>
              <div style={{ opacity: t, transform: `scale(${interpolate(t, [0, 1], [0.6, 1])}) translateY(${interpolate(t, [0, 1], [16, 0])}px)`, textAlign: "center", width: 210 }}>
                <div style={{ width: 128, height: 128, margin: "0 auto", borderRadius: "50%", border: `3px solid ${c.c}`, background: `radial-gradient(circle at 50% 35%, ${c.c}22, transparent)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${interpolate(t, [0, 1], [0, 30])}px ${c.c}55` }}>
                  <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, color: "#fff", letterSpacing: 1 }}>{c.es}</span>
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, color: c.c, marginTop: 14, letterSpacing: 1 }}>{c.sub}</div>
              </div>
              {i < CHAIN.length - 1 && (
                <div style={{ opacity: arr, width: 46, height: 3, background: `linear-gradient(90deg,${CHAIN[i].c},${CHAIN[i + 1].c})`, position: "relative", marginBottom: 34 }}>
                  <div style={{ position: "absolute", right: -2, top: -4, width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: `9px solid ${CHAIN[i + 1].c}` }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── letterbox sutil + viñeta muy leve (SIN grade de color) ─────────────────
const CineFrame: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 40px rgba(0,0,0,0.38)" }} />
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 44, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 44, background: "#000" }} />
  </AbsoluteFill>
);

// ── SFX: cama ambiental por sección + hits en reveals ──────────────────────
const WIND = new Set(["snow", "wolfDark", "human"]);
const BIRDS = new Set(["birds", "forest", "river", "beaver"]);
const DRONE = new Set(["wolfHunt"]);
function sfxEvents() {
  const ev: any[] = [];
  let lastBed = -999, lastKind = "";
  BEATS.forEach((b) => {
    // hits
    if (b.overlay?.type === "stat") ev.push({ from: b.from, src: "lo_sfx_boomlow.mp3", vol: 0.32 });
    if (b.kind === "comp") ev.push({ from: b.from, src: "lo_sfx_boom.mp3", vol: 0.42 });
    // cama ambiental (cada ~5s, cambia por pool)
    const pool = b.pool || "";
    let bed = WIND.has(pool) ? "lo_sfx_wind.mp3" : BIRDS.has(pool) ? "lo_sfx_birds.mp3" : DRONE.has(pool) ? "lo_sfx_drone.mp3" : "";
    if (bed && (b.from - lastBed > 150 || bed !== lastKind)) { ev.push({ from: b.from, src: bed, vol: bed === "lo_sfx_drone.mp3" ? 0.22 : 0.13, bed: true }); lastBed = b.from; lastKind = bed; }
  });
  return ev;
}
const SFX_EV = sfxEvents();

// fundido de entrada/salida para los componentes wow (que no entren/salgan de golpe)
const CompFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const op = Math.min(
    interpolate(f, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [dur - 16, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

export const MainLobos: React.FC = () => {
  const f = useCurrentFrame();
  const compBeat = BEATS.find((b) => b.kind === "comp");
  const climaxAt = compBeat ? compBeat.from : TOTAL_FRAMES_LOBOS - 3000;
  const musicVol = interpolate(f, [0, 60, climaxAt - 300, climaxAt + 300, TOTAL_FRAMES_LOBOS - 200, TOTAL_FRAMES_LOBOS], [0, 0.10, 0.10, 0.15, 0.13, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: FONT }}>
      {/* VISUAL BEATS */}
      {BEATS.map((b, i) => (
        <Sequence key={i} from={b.from} durationInFrames={b.dur + (b.trans === "diss" ? 16 : b.kind === "comp" ? 16 : 4)}>
          {b.kind === "avatar" ? (
            <KB src={staticFile("lobos_opt.mp4")} dur={b.dur} avatar trim={b.from} fadeF={16} />
          ) : b.kind === "comp" ? (
            <CompFade dur={b.dur}>
              {b.comp === "timeline" ? <TravelingTimeline /> :
               b.comp === "migration" ? <MigrationArc /> :
               b.comp === "quote" ? <AuthorityQuote /> :
               b.comp === "trophicweb" ? <TrophicWeb /> :
               <Cascade dur={b.dur} />}
            </CompFade>
          ) : (
            <KB src={clip(b.src)} dur={b.dur} kb={i} fadeF={b.trans === "diss" ? 16 : 4} />
          )}
          {b.overlay?.type === "stat" && <StatTag value={b.overlay.value} label={b.overlay.label} dur={b.dur} />}
          {b.overlay?.type === "loc" && <LocationTag label={b.overlay.label} dur={b.dur} />}
          {b.overlay?.type === "phrase" && <PhraseTag text={b.overlay.text} dur={b.dur} />}
        </Sequence>
      ))}

      <CineFrame />

      {/* AUDIO */}
      <Audio src={staticFile("lobos_narr.wav")} volume={1} />
      <Loop durationInFrames={50 * FPS}><Audio src={aud("lo_music_calm.wav")} volume={musicVol} /></Loop>
      <Sequence from={climaxAt - 200} durationInFrames={1600}><Audio src={aud("lo_music_build.wav")} volume={0.13} /></Sequence>
      {SFX_EV.map((e, i) => (
        <Sequence key={"s" + i} from={e.from}><Audio src={aud(e.src)} volume={e.vol} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
