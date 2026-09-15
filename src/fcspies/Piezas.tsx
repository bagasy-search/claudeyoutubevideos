// Piezas.tsx — componentes self-contained para fcsflema (canal Federer Consejos Salud).
// Look CLÍNICO premium: teal #12B3AE + crema + tinta oscura, Inter. Capas y profundidad.
// ⛔ TODO video/clip va con OffthreadVideo, NUNCA <Video>. Movimiento por transform (sub-píxel).
import React from "react";
import {
  AbsoluteFill, Img, OffthreadVideo, Loop, staticFile,
  interpolate, useCurrentFrame, useVideoConfig, spring, Easing,
} from "remotion";

const FPS = 30;
// paleta
const INK = "#0A141A";
const INK2 = "#10222B";
const TEAL = "#12B3AE";
const TEALD = "#0C6B68";
const CREAM = "#F4F1EA";
const AMBER = "#E8A33D";
const WHITE = "#FFFFFF";
const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";

// hash pseudoaleatorio determinista (mulberry-ish) — NO Math.sin
const rnd = (seed: number) => {
  let t = (Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) >>> 0) + 0x27d4eb2f;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Ken-Burns aleatorio por plano (sentido/amplitud/foco/deriva sorteados) — regla dura del creador.
const useKB = (seed: number, base: number, ampMax: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const r1 = rnd(seed * 1.7 + 11), r2 = rnd(seed * 3.1 + 37), r3 = rnd(seed * 5.3 + 71);
  const r4 = rnd(seed * 7.9 + 113), r5 = rnd(seed * 11.3 + 167);
  const zin = r1 < 0.5;
  const amp = 0.045 + r2 * (ampMax - 0.045);
  const lo = base, hi = base + amp;
  const desde = zin ? lo : hi, hasta = zin ? hi : lo;
  const ox = 30 + r3 * 40, oy = 30 + r4 * 40;
  const techo = Math.min(ox, 100 - ox, oy, 100 - oy) * (Math.min(desde, hasta) - 1);
  const dMax = Math.min(1.2, Math.max(0, techo));
  const ang = r5 * Math.PI * 2;
  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = desde + (hasta - desde) * k;
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

const fadeIn = (frame: number, dur = 8) => interpolate(frame, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// viñeta + grano sutil para dar profundidad cinematográfica
const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", boxShadow: "inset 0 0 320px 60px rgba(0,0,0,0.55)", background: "radial-gradient(120% 90% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)" }} />
);

// ---------- CAPAS BASE ----------
export const Foto: React.FC<{ src: string; seed: number; amp?: number }> = ({ src, seed, amp = 0.09 }) => {
  const kb = useKB(seed, 1.06, amp);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
      <Grade />
    </AbsoluteFill>
  );
};

export const Clip: React.FC<{ src: string; seed: number; frames: number }> = ({ src, seed, frames }) => {
  const kb = useKB(seed, 1.03, 0.05);
  const video = (
    <OffthreadVideo src={staticFile(src)} muted playbackRate={1}
      style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      {frames && frames > 1 ? <Loop durationInFrames={frames}>{video}</Loop> : video}
      <Grade />
    </AbsoluteFill>
  );
};

// ventana de avatar: recorte del mp4 InfiniteTalk (832x464) a pantalla completa, arranca en avStart
export const AvatarWin: React.FC<{ src: string; startFrom: number; seed: number }> = ({ src, startFrom, seed }) => {
  const frame = useCurrentFrame();
  const s = 1.02 + Math.sin((frame + seed) / 240) * 0.012; // push lento
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})` }} />
      <Grade />
    </AbsoluteFill>
  );
};

// cama para overlays: foto de fondo desenfocada + oscurecida (da profundidad al texto)
const Bed: React.FC<{ src?: string; seed: number }> = ({ src, seed }) => {
  const kb = useKB(seed, 1.08, 0.06);
  if (!src) return <AbsoluteFill style={{ background: `radial-gradient(120% 120% at 30% 20%, ${INK2} 0%, ${INK} 70%)` }} />;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(9px) brightness(0.42) saturate(0.9)", ...kb }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(6,14,18,0.55) 0%, rgba(6,14,18,0.35) 45%, rgba(6,14,18,0.72) 100%)" }} />
    </AbsoluteFill>
  );
};

// pill / eyebrow del canal
const Eyebrow: React.FC<{ t: string; f: number }> = ({ t, f }) => (
  <div style={{ opacity: fadeIn(f, 10), display: "inline-flex", alignItems: "center", gap: 12, padding: "8px 18px", borderRadius: 999, background: "rgba(18,179,174,0.14)", border: `1px solid ${TEAL}55` }}>
    <div style={{ width: 8, height: 8, borderRadius: 999, background: TEAL }} />
    <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: TEAL, textTransform: "uppercase" }}>{t}</span>
  </div>
);

// ---------- COMPONENTES ----------
// título de sección / capítulo
export const Chapter: React.FC<{ title: string; bed?: string; seed: number }> = ({ title, bed, seed }) => {
  const f = useCurrentFrame();
  const y = interpolate(spring({ frame: f, fps: FPS, config: { damping: 200 } }), [0, 1], [40, 0]);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={seed} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", padding: "0 130px" }}>
        <div style={{ transform: `translateY(${y}px)`, opacity: fadeIn(f, 12) }}>
          <div style={{ width: 96, height: 6, background: TEAL, borderRadius: 4, marginBottom: 34 }} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 92, lineHeight: 1.03, color: WHITE, maxWidth: 1400, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>{title}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// frase cinética (palabra a palabra) sobre cama
export const Frase: React.FC<{ text: string; bed?: string; seed: number }> = ({ text, bed, seed }) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={seed} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 150px" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 82, lineHeight: 1.12, color: WHITE, textAlign: "center", maxWidth: 1500, textShadow: "0 6px 28px rgba(0,0,0,0.65)" }}>
          {words.map((w, i) => {
            const at = i * 2.6;
            const o = interpolate(f, [at, at + 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const yy = interpolate(f, [at, at + 7], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const hot = /[A-ZÁÉÍÓÚ]{2,}/.test(w);
            return <span key={i} style={{ opacity: o, display: "inline-block", transform: `translateY(${yy}px)`, marginRight: 20, color: hot ? TEAL : WHITE }}>{w}</span>;
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// stat / dato grande
export const Stat: React.FC<{ text: string; bed?: string; seed: number }> = ({ text, bed, seed }) => {
  const f = useCurrentFrame();
  const sc = interpolate(spring({ frame: f, fps: FPS, config: { damping: 180 } }), [0, 1], [0.9, 1]);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={seed} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 140px" }}>
        <div style={{ transform: `scale(${sc})`, opacity: fadeIn(f, 10), background: "linear-gradient(160deg, rgba(18,179,174,0.16), rgba(10,20,26,0.5))", border: `1.5px solid ${TEAL}66`, borderRadius: 34, padding: "60px 80px", boxShadow: "0 30px 90px rgba(0,0,0,0.5)", maxWidth: 1500 }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 74, lineHeight: 1.1, color: WHITE, textAlign: "center" }}>{text}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// mito vs verdad
export const MitoVerdad: React.FC<{ text: string; verdad?: boolean; bed?: string; seed: number }> = ({ text, verdad, bed, seed }) => {
  const f = useCurrentFrame();
  const x = interpolate(spring({ frame: f, fps: FPS, config: { damping: 200 } }), [0, 1], [50, 0]);
  const col = verdad ? TEAL : AMBER;
  const label = verdad ? "LA VERDAD" : "MITO";
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={seed} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 150px" }}>
        <div style={{ transform: `translateX(${x}px)`, opacity: fadeIn(f, 10), maxWidth: 1500 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "10px 24px", borderRadius: 12, background: `${col}22`, border: `2px solid ${col}`, marginBottom: 28 }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: col }}>{label}</span>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 76, lineHeight: 1.14, color: WHITE, textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}>{text}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// checklist / lista que se construye (items separados por " · " o "  ")
export const Checklist: React.FC<{ title?: string; items: string[]; bed?: string; seed: number; danger?: boolean }> = ({ title, items, bed, seed, danger }) => {
  const f = useCurrentFrame();
  const col = danger ? AMBER : TEAL;
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={seed} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", padding: "0 150px" }}>
        <div style={{ maxWidth: 1500 }}>
          {title ? <div style={{ opacity: fadeIn(f, 8), fontFamily: FONT, fontWeight: 800, fontSize: 60, color: WHITE, marginBottom: 40, textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>{title}</div> : null}
          {items.map((it, i) => {
            const at = 10 + i * 12;
            const o = interpolate(f, [at, at + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const xx = interpolate(f, [at, at + 9], [-26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ opacity: o, transform: `translateX(${xx}px)`, display: "flex", alignItems: "center", gap: 26, marginBottom: 26 }}>
                <div style={{ minWidth: 46, height: 46, borderRadius: 12, background: `${col}22`, border: `2px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", color: col, fontFamily: FONT, fontWeight: 800, fontSize: 30 }}>{i + 1}</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 50, color: CREAM, lineHeight: 1.15 }}>{it}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// pizarra / diagrama (escena de mecanismo con capas) — pocos por video
export const Pizarra: React.FC<{ text: string; bed?: string; seed: number }> = ({ text, bed, seed }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [8, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(130% 120% at 50% 30%, ${INK2} 0%, ${INK} 72%)` }}>
      {bed ? <AbsoluteFill><Img src={staticFile(bed)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.14, filter: "blur(3px) saturate(0.85)" }} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 150px" }}>
        <div style={{ position: "relative", padding: "70px 90px", borderRadius: 30, border: `2px solid ${TEAL}55`, background: "rgba(8,18,24,0.55)", boxShadow: "0 30px 90px rgba(0,0,0,0.55)", maxWidth: 1550 }}>
          <svg width="140" height="60" style={{ position: "absolute", top: -30, left: 60 }}>
            <path d={`M0,40 C40,10 100,10 140,34`} stroke={TEAL} strokeWidth="5" fill="none" strokeDasharray="200" strokeDashoffset={200 - 200 * draw} strokeLinecap="round" />
          </svg>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 66, lineHeight: 1.15, color: WHITE, textAlign: "center", opacity: fadeIn(f, 12) }}>{text}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// círculo vicioso (rueda)
export const Circulo: React.FC<{ text: string; bed?: string; seed: number }> = ({ text, bed, seed }) => {
  const f = useCurrentFrame();
  const rot = interpolate(f, [0, 90], [0, 300], { extrapolateRight: "extend" });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(130% 120% at 50% 40%, ${INK2} 0%, ${INK} 72%)` }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <svg width="520" height="520" style={{ opacity: fadeIn(f, 10) }}>
          <circle cx="260" cy="260" r="180" fill="none" stroke={`${TEAL}40`} strokeWidth="14" />
          <path d="M260,80 A180,180 0 0 1 440,260" fill="none" stroke={TEAL} strokeWidth="16" strokeLinecap="round" transform={`rotate(${rot} 260 260)`} />
          <polygon points="430,235 460,262 428,285" fill={TEAL} transform={`rotate(${rot} 260 260)`} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 200px" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.18, color: WHITE, textAlign: "center", maxWidth: 900, opacity: fadeIn(f, 14) }}>{text}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// alerta (una señal) / panel de alarma
export const Alerta: React.FC<{ text: string; bed?: string; seed: number; panel?: boolean }> = ({ text, bed, seed, panel }) => {
  const f = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(f / 10);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={seed} />
      <AbsoluteFill style={{ background: `radial-gradient(120% 120% at 50% 50%, ${AMBER}14 0%, rgba(0,0,0,0) 60%)` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 150px" }}>
        <div style={{ opacity: fadeIn(f, 8), maxWidth: 1500, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 16, marginBottom: 30 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, border: `3px solid ${AMBER}`, display: "flex", alignItems: "center", justifyContent: "center", color: AMBER, fontFamily: FONT, fontWeight: 900, fontSize: 44, boxShadow: `0 0 ${20 + pulse * 26}px ${AMBER}80` }}>!</div>
            {panel ? <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: 5, color: AMBER }}>{text}</span> : null}
          </div>
          {!panel ? <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 68, lineHeight: 1.14, color: WHITE, textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}>{text}</div> : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// CTA a la guía (en la descripción) — sin precio, sin link hablado
export const Cta: React.FC<{ text: string; bed?: string; seed: number }> = ({ text, bed, seed }) => {
  const f = useCurrentFrame();
  const arrow = 6 + Math.sin(f / 8) * 6;
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={seed} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 150px" }}>
        <div style={{ opacity: fadeIn(f, 10), textAlign: "center", maxWidth: 1500 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "10px 22px", borderRadius: 999, background: `${TEAL}1e`, border: `1.5px solid ${TEAL}66`, marginBottom: 30 }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: TEAL }}>📘 GUÍA GRATIS · DR. FEDERER</span>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, lineHeight: 1.14, color: WHITE, textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}>{text}</div>
          <div style={{ marginTop: 26, fontSize: 60, transform: `translateY(${arrow}px)` }}>👇</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// split de dos conceptos
export const SplitDos: React.FC<{ text: string; bed?: string; seed: number }> = ({ text, bed, seed }) => {
  const f = useCurrentFrame();
  const parts = text.split(" vs ");
  const a = parts[0] || text, b = parts[1] || "";
  return (
    <AbsoluteFill style={{ flexDirection: "row" }}>
      <AbsoluteFill style={{ background: `radial-gradient(120% 120% at 30% 30%, ${INK2}, ${INK})` }} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: fadeIn(f, 8) }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 72, color: TEAL, textAlign: "center", padding: "0 40px" }}>{a}</span>
      </div>
      <div style={{ width: 3, background: `${WHITE}22` }} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: fadeIn(f, 16) }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 72, color: AMBER, textAlign: "center", padding: "0 40px" }}>{b}</span>
      </div>
    </AbsoluteFill>
  );
};

// hook de apertura sobre el avatar (scrim) — texto grande
export const HookOverlay: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120 }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(6,14,18,0.85) 0%, rgba(6,14,18,0) 45%)" }} />
      <div style={{ opacity: fadeIn(f, 10), fontFamily: FONT, fontWeight: 800, fontSize: 66, color: WHITE, textAlign: "center", maxWidth: 1500, padding: "0 120px", textShadow: "0 6px 24px rgba(0,0,0,0.7)" }}>{text}</div>
    </AbsoluteFill>
  );
};

// marca permanente (esquina)
export const Brand: React.FC = () => (
  <div style={{ position: "absolute", top: 44, right: 56, display: "flex", alignItems: "center", gap: 12, opacity: 0.9 }}>
    <div style={{ width: 12, height: 12, borderRadius: 999, background: TEAL }} />
    <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 2, color: CREAM, textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>DR. FEDERER</span>
  </div>
);
