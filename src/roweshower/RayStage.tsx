// RayStage.tsx — ESCENARIO COMPARTIDO del canal "Dr. Emmett Rowe" (ES-MX, salud +60).
//
// Se escribe UNA vez y TODOS los componentes lo consumen: misma paleta, mismas primitivas,
// misma tipografía. Es lo que hace que un video hecho con muchos componentes se lea como UNO.
//
// MARCA: negro + BRASS/ÁMBAR (el acento del canal, el latón de la llave) + ROJO SÓLO para el
// punto débil / la alerta. Serie: "The Four Thousand Doors". Marca de esquina: brass keyring.
//
// ⛔ REGLA DURA DEL PIPELINE: todo video va con OffthreadVideo, NUNCA <Video> (en el render
// <Video> busca por tiempo y no acierta el cuadro exacto → tirón). El avatar y los clips van
// muteados; el audio sale de UN solo <Audio> con el master.
import React from "react";
import {
  AbsoluteFill, Easing, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { F_OSWALD, F_INTER } from "../VideoEdit/kit/premium/theme";

// ── PALETA / TIPOGRAFÍA ──────────────────────────────────────────────────────────────────────
export const V = {
  ink0: "#0A1220",       // tinta oscura del canal Federer (fondo)
  ink1: "#101B2C",
  ink2: "#18263A",
  brass: "#4AA8E0",      // TEAL — el acento clínico del canal
  brassSoft: "#B3DCF6",  // teal suave — títulos, resaltados
  amber: "#F2B544",      // ámbar — números y avisos (segundo acento)
  danger: "#D6453C",     // ROJO — SÓLO la advertencia / la señal de alerta
  dangerSoft: "#E4796F",
  white: "#F4F6F8",      // crema del canal
  bone: "#C9D2DC",
  steel: "#2F6D9A",
  ok: "#4E9E63",         // verde de "esto sí" (checks positivos)
};
export const F_DISPLAY = F_OSWALD;
export const F_BODY = F_INTER;

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// hash determinístico: reemplaza Math.random() (obligatorio, el farm rinde en paralelo)
export const rnd = (k: number) => {
  const x = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const rgba = (hex: string, a: number) => {
  if (!hex) return `rgba(0,0,0,${a})`;
  const m = hex.match(/rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)/i);
  if (m) return `rgba(${m[1]},${m[2]},${m[3]},${a})`;
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const x = parseInt(h, 16);
  if (!Number.isFinite(x)) return `rgba(0,0,0,${a})`;
  return `rgba(${(x >> 16) & 255},${(x >> 8) & 255},${x & 255},${a})`;
};

export const enter = (frame: number, frames = 8) => interpolate(frame, [0, frames], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad),
});
const shadow = `0 3px 14px ${rgba(V.ink0, 0.78)}`;

// ── TIPOGRAFÍA (legibilidad: titular grande, cama oscura obligatoria) ─────────────────────────
export const Kick: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = V.brass }) => (
  <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3.4, textTransform: "uppercase", color }}>{children}</div>
);
export const Head: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 74, color = V.white }) => (
  <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, lineHeight: 1.02, color, textShadow: "0 6px 30px rgba(0,0,0,0.92), 0 2px 6px rgba(0,0,0,0.85)", letterSpacing: "0.005em" }}>{children}</div>
);
export const Body: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 32, color = V.bone }) => (
  <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: size, lineHeight: 1.3, color, textShadow: "0 3px 16px rgba(0,0,0,0.85)" }}>{children}</div>
);

// ── LA CAMA DE FOTO — va debajo de TODO componente (regla 2.quater/2.ter) ─────────────────────
// El componente nunca muestra el fondo plano en su margen: una foto real, oscurecida, lo llena.
export const PhotoBed: React.FC<{ src?: string; dim?: number }> = ({ src, dim = 0.62 }) => {
  const frame = useCurrentFrame();
  const z = 1.04 + Math.sin(frame / 240) * 0.012;
  if (!src) return <AbsoluteFill style={{ background: `radial-gradient(120% 100% at 50% 0%, ${V.ink2} 0%, ${V.ink0} 70%)` }} />;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${(1 - dim).toFixed(2)}) saturate(0.82)`, transform: `scale(${z.toFixed(4)})` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${rgba(V.ink0, 0.5)} 0%, ${rgba(V.ink0, 0.32)} 46%, ${rgba(V.ink0, 0.72)} 100%)` }} />
      <AbsoluteFill style={{ opacity: 0.045, backgroundImage: "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)", backgroundSize: "3px 3px", mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  );
};

// ── CLIP a sangre: el plano real (Ray demostrando). OffthreadVideo SIEMPRE ────────────────────
const hrnd = (seed: number, salt: number) => {
  let h = Math.imul((seed | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(salt + 1, 0xc2b2ae35);
  h = Math.imul(h ^ (h >>> 13), 0x27d4eb2d); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
};
export const Clip: React.FC<{ src: string; rate?: number; seed?: number }> = ({ src, rate = 1, seed = 7 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  // sin fade de entrada (un frame negro por corte); Ken-Burns suave AL AZAR (los clips ya se mueven: mitad de velocidad)
  const acerca = hrnd(seed, 11) < 0.5;
  const amp = Math.min(0.08, (0.006 + hrnd(seed, 12) * 0.008) * (n / 30));
  const base = 1.03;
  const desde = acerca ? base : base + amp, hasta = acerca ? base + amp : base;
  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = desde + (hasta - desde) * k;
  const ox = 40 + hrnd(seed, 13) * 20, oy = 40 + hrnd(seed, 14) * 20;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`, transform: `scale(${z.toFixed(4)})` }} />
    </AbsoluteFill>
  );
};

// ── FOTO con Ken-Burns AL AZAR por plano (regla del creador: sentido, amplitud, foco y deriva sorteados) ─
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const secs = n / 30;
  const acerca = hrnd(seed, 1) < 0.5;
  const vel = 0.018 + hrnd(seed, 2) * 0.022;               // 1,8-4,0 %/s
  const amp = Math.min(0.2, vel * secs);
  const base = 1.06;
  const desde = acerca ? base : base + amp, hasta = acerca ? base + amp : base;
  const ox = 35 + hrnd(seed, 3) * 30, oy = 35 + hrnd(seed, 4) * 30;
  const ang = hrnd(seed, 5) * Math.PI * 2;
  const k = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = desde + (hasta - desde) * k;
  const kz = amp > 0 ? (z - base) / amp : 0;               // paneo atado a la escala: nunca asoma el borde
  const dx = Math.cos(ang) * 2.0 * kz, dy = Math.sin(ang) * 1.2 * kz;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`, transform: `scale(${z.toFixed(4)}) translate(${dx.toFixed(3)}%, ${dy.toFixed(3)}%)` }} />
    </AbsoluteFill>
  );
};
export const kbSentido = (seed: number) => (hrnd(seed, 1) < 0.5 ? "in" : "out");

// ── AVATAR por VENTANA (RunPod): a sangre, muteado (el audio sale del máster), push lento determinista ─
export const AvatarWin: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const s = 1.02 + Math.sin(f / 700) * 0.012 + f * 0.00002;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "50% 35%", transform: `scale(${s.toFixed(4)})` }} />
    </AbsoluteFill>
  );
};

// ── EL AVATAR — FONDO GARANTIZADO. Parcial (0..685s) + BUCLE muteado para la cola ─────────────
// Va MUTEADO: el audio sale del master. Nunca estático: push lento determinista.
export const RayAvatar: React.FC<{ src: string; loopFrames: number }> = ({ src, loopFrames }) => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.02;
  const dx = Math.sin(f / 1300) * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      <Loop durationInFrames={loopFrames}>
        <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)` }} />
      </Loop>
    </AbsoluteFill>
  );
};

// ── OVERLAYS (van ENCIMA, no ocultan la base) ─────────────────────────────────────────────────

/** Rótulo/lower-third breve con acento brass. */
export const Label: React.FC<{
  text?: string;
  sub?: string;
  pos?: "bl" | "tl" | "br";
  tone?: "brass" | "danger";
  durationInFrames?: number;
}> = ({
  text = "", sub = "", pos = "bl", tone = "brass",
}) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 8);
  const accent = tone === "danger" ? V.danger : V.brass;
  const anchor: React.CSSProperties = pos === "tl" ? { left: "5%", top: "8.5%" }
    : pos === "br" ? { right: "5%", bottom: "9%" } : { left: "5%", bottom: "9%" };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", ...anchor, maxWidth: "56%", opacity: a, transform: `translateY(${((1 - a) * 12).toFixed(1)}px)` }}>
        <div style={{ display: "inline-block", padding: "10px 18px 12px", borderLeft: `5px solid ${accent}`, background: rgba(V.ink0, 0.74), borderRadius: 3, textShadow: shadow }}>
          {text ? <div style={{ fontFamily: F_DISPLAY, fontSize: 40, lineHeight: 1.05, color: V.white, letterSpacing: "0.005em" }}>{text}</div> : null}
          {sub ? <div style={{ fontFamily: F_BODY, fontSize: 24, lineHeight: 1.14, color: V.bone, marginTop: text ? 5 : 0 }}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Bug de dato en la esquina + firma de la serie (para el HOOK y beats de número livianos). */
export const StatBug: React.FC<{
  value?: string;
  unit?: string;
  caption?: string;
  series?: string;
  tone?: "brass" | "danger";
  durationInFrames?: number;
}> = ({
  value = "", unit = "", caption = "", series = "Dr. Emmett Rowe", tone = "brass",
}) => {
  const frame = useCurrentFrame();
  const a = enter(frame, 9);
  const color = tone === "danger" ? V.danger : V.brass;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "5%", top: "9%", opacity: a, transform: `translateY(${((1 - a) * 12).toFixed(1)}px)` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 118, lineHeight: 0.9, color, textShadow: `0 0 42px ${rgba(color, 0.34)}, 0 6px 26px rgba(0,0,0,0.92)` }}>{value}</div>
          {unit ? <div style={{ fontFamily: F_DISPLAY, fontSize: 44, color: rgba(color, 0.9), textShadow: shadow }}>{unit}</div> : null}
        </div>
        {caption ? <div style={{ marginTop: 4, fontFamily: F_BODY, fontSize: 30, color: V.white, maxWidth: 640, textShadow: shadow }}>{caption}</div> : null}
      </div>
      <div style={{ position: "absolute", right: "5%", bottom: "8%", opacity: a * 0.9, display: "flex", alignItems: "center", gap: 10 }}>
        <Keyring size={30} />
        <div style={{ fontFamily: F_DISPLAY, fontSize: 24, letterSpacing: 2, color: V.brass, textShadow: shadow }}>{series}</div>
      </div>
    </AbsoluteFill>
  );
};

/** La marca de esquina del canal Dr. Emmett Rowe: gota de agua con cruz clínica (mismo nombre de export). */
export const Keyring: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ overflow: "visible" }}>
    <path d="M20 4 C 20 4 8 18 8 25 a12 12 0 0 0 24 0 C 32 18 20 4 20 4 z" fill="none" stroke={V.brass} strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M20 19 v12 M14 25 h12" fill="none" stroke={V.brass} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);
