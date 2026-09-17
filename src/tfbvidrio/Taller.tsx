// Taller.tsx — ESCENARIO COMPARTIDO del canal El Constructor Libre (marca TALLER, terrosa vintage).
// Papel crema #F1E4C9 · tinta espresso · óxido #8B2D22 (alerta / tachado / sello) · oro #B1832F (reglas, acierto).
// Todo componente se arma con las mismas capas: cama de foto real (parallax + grade cálido) → mesa/papel →
// ficha con cinta de papel → tipografía serif → trazos a mano en óxido → polvo + grano + viñeta.
// ⛔ OffthreadVideo siempre, nunca <Video>. ⛔ Sin Math.random (farm en paralelo). ⛔ Sin backdrop-filter.
import React from "react";
import { AbsoluteFill, Easing, Img, Loop, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { F_PLAYFAIR, F_OSWALD, F_GARAMOND } from "../VideoEdit/kit/premium/theme";

export const T = {
  paper: "#F1E4C9", paper2: "#E6D3AC", paper3: "#D9C194",
  ink: "#2B1D14", ink2: "#4A3426", inkSoft: "rgba(43,29,20,0.66)",
  oxido: "#8B2D22", oxidoSoft: "#B4574A", oro: "#B1832F", oroSoft: "#D8B26A",
  wood: "#5A3C24", wood2: "#3A2616", ok: "#4F6B3A", night: "#2E3B4E", glass: "#BFD6DA",
};
export const FD = F_PLAYFAIR, FL = F_OSWALD, FB = F_GARAMOND;
export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const eOut = Easing.out(Easing.cubic);
export const ramp = (f: number, a: number, b: number, ease = eOut) => interpolate(f, [a, b], [0, 1], { ...CL, easing: ease });
export const rnd = (k: number) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const rgba = (hex: string, a: number) => { const x = parseInt(hex.replace("#", ""), 16); return `rgba(${(x >> 16) & 255},${(x >> 8) & 255},${x & 255},${a})`; };
export const sf = (p?: string) => (p ? (/^https?:/.test(p) ? p : staticFile(p)) : undefined);
export const useSpr = (delayF: number, damping = 14, mass = 0.7) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delayF, fps, config: { damping, mass } }); };

// hash entero para Ken-Burns al azar
const hr = (seed: number, salt: number) => { let h = Math.imul((seed | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(salt + 1, 0xc2b2ae35); h = Math.imul(h ^ (h >>> 13), 0x27d4eb2d); h ^= h >>> 15; return (h >>> 0) / 4294967296; };
export const kbDir = (seed: number) => hr(seed, 1) < 0.5;
const useKB = (seed: number, base: number, velMin: number, velMax: number) => {
  const frame = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames); const acerca = hr(seed, 1) < 0.5;
  const amp = Math.min(0.18, (velMin + hr(seed, 2) * (velMax - velMin)) * (n / 30));
  const desde = acerca ? base : base + amp, hasta = acerca ? base + amp : base;
  const k = interpolate(frame, [0, n], [0, 1], CL); const z = desde + (hasta - desde) * k;
  const ox = 35 + hr(seed, 3) * 30, oy = 35 + hr(seed, 4) * 30; const ang = hr(seed, 5) * Math.PI * 2; const kz = amp > 0 ? (z - base) / amp : 0;
  return { transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`, transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * 1.6 * kz).toFixed(3)}%, ${(Math.sin(ang) * 1.0 * kz).toFixed(3)}%)` };
};
const FILL: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

/** Clip de stock Pexels a sangre (sus cuadros reales en Loop si hiciera falta). */
export const Clip: React.FC<{ src: string; seed: number; frames?: number }> = ({ src, seed, frames }) => {
  const t = useKB(seed, 1.03, 0.004, 0.009);
  const v = <OffthreadVideo src={staticFile(src)} muted style={FILL} />;
  return <AbsoluteFill style={{ background: T.wood2, overflow: "hidden" }}><AbsoluteFill style={t}>{frames && frames > 1 ? <Loop durationInFrames={frames}>{v}</Loop> : v}</AbsoluteFill></AbsoluteFill>;
};
/** Clip de agnes: corre su duración; el resto = último cuadro (foto) con la MISMA curva Ken-Burns. */
export const AgClip: React.FC<{ src: string; still: string; seed: number; frames: number }> = ({ src, still, seed, frames }) => {
  const f = useCurrentFrame(); const t = useKB(seed, 1.04, 0.012, 0.024);
  return (
    <AbsoluteFill style={{ background: T.wood2, overflow: "hidden" }}>
      <AbsoluteFill style={t}>
        {f < frames - 1 ? <OffthreadVideo src={staticFile(src)} muted style={FILL} /> : <Img src={staticFile(still)} style={FILL} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const Foto: React.FC<{ src: string; seed: number }> = ({ src, seed }) => {
  const t = useKB(seed, 1.06, 0.018, 0.04);
  return <AbsoluteFill style={{ background: T.wood2, overflow: "hidden" }}><AbsoluteFill style={t}><Img src={staticFile(src)} style={FILL} /></AbsoluteFill></AbsoluteFill>;
};
/** Ventana de avatar (reel RunPod ya cortado a 1920x1080 30 CFR): a sangre, muteado, push lento. */
export const AvatarWin: React.FC<{ src: string; seed: number }> = ({ src, seed }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const inn = hr(seed, 9) < 0.6;
  const z = interpolate(f, [0, Math.max(2, durationInFrames)], inn ? [1.0, 1.05] : [1.05, 1.0], CL);
  return <AbsoluteFill style={{ background: T.wood2, overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${z.toFixed(4)})`, transformOrigin: "50% 36%" }}><OffthreadVideo src={staticFile(src)} muted style={FILL} /></AbsoluteFill></AbsoluteFill>;
};

/** Cama de TODO componente: foto real desenfocada + grade cálido + haz + polvo + grano + viñeta. */
export const Bed: React.FC<{ img?: string; dim?: number; blur?: number; paper?: boolean }> = ({ img, dim = 0.5, blur = 10, paper }) => {
  const f = useCurrentFrame();
  const z = 1.1 + Math.sin(f / 260) * 0.02 + f * 0.00004; const dx = Math.sin(f / 310) * 16;
  const sweep = ((f * 0.32) % 170) - 40;
  return (
    <AbsoluteFill style={{ background: paper ? T.paper : T.wood2, overflow: "hidden" }}>
      {img ? <Img src={staticFile(img)} style={{ ...FILL, position: "absolute", filter: `blur(${blur}px) brightness(${(1 - dim).toFixed(2)}) saturate(0.85) sepia(0.25)`, transform: `scale(${z.toFixed(4)}) translateX(${dx.toFixed(1)}px)` }} />
        : <AbsoluteFill style={{ background: paper ? `radial-gradient(120% 100% at 40% 30%, ${T.paper} 0%, ${T.paper2} 70%, ${T.paper3} 100%)` : `radial-gradient(120% 100% at 50% 20%, ${T.wood} 0%, ${T.wood2} 75%)` }} />}
      {!paper ? <AbsoluteFill style={{ background: `linear-gradient(180deg, ${rgba("#1A0F08", 0.35)} 0%, ${rgba("#1A0F08", 0.15)} 45%, ${rgba("#1A0F08", 0.6)} 100%)` }} /> : null}
      <AbsoluteFill style={{ background: `linear-gradient(115deg, transparent ${sweep - 14}%, ${rgba("#FFE9C2", 0.07)} ${sweep}%, transparent ${sweep + 14}%)` }} />
      <Motes />
      <AbsoluteFill style={{ opacity: 0.06, backgroundImage: "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)", backgroundSize: "3px 3px", mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ background: `radial-gradient(125% 110% at 50% 45%, transparent 55%, ${rgba("#140A04", 0.6)} 100%)` }} />
    </AbsoluteFill>
  );
};
export const Motes: React.FC<{ n?: number }> = ({ n = 18 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ pointerEvents: "none" }}>{Array.from({ length: n }).map((_, i) => {
    const x = (rnd(i * 3 + 9) * 100 + f * (0.01 + rnd(i) * 0.02)) % 100, y = (rnd(i * 13 + 4) * 100 - f * (0.02 + rnd(i * 2) * 0.03) + 200) % 100;
    const s = 2 + rnd(i * 17) * 4;
    return <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: s, height: s, borderRadius: "50%", background: rgba("#FFF3DA", 0.2 + rnd(i * 5) * 0.3) }} />;
  })}</AbsoluteFill>;
};

/** Ficha de papel crema con cinta de papel en las esquinas, sombra de objeto y leve rotación. Entra con spring. */
export const Ficha: React.FC<{ w: number; h?: number; rot?: number; delay?: number; children: React.ReactNode; tape?: boolean; style?: React.CSSProperties; pad?: number }> = ({ w, h, rot = -1.2, delay = 0, children, tape = true, style, pad = 44 }) => {
  const k = useSpr(delay, 13, 0.8); const f = useCurrentFrame();
  const bob = Math.sin((f - delay) / 55) * 0.35;
  return (
    <div style={{ position: "relative", width: w, height: h, padding: pad, boxSizing: "border-box", background: `linear-gradient(160deg, ${T.paper} 0%, ${T.paper2} 100%)`, borderRadius: 6,
      boxShadow: `0 30px 60px ${rgba("#140A04", 0.55)}, 0 6px 14px ${rgba("#140A04", 0.35)}, inset 0 0 60px ${rgba(T.paper3, 0.55)}`,
      transform: `translateY(${((1 - k) * 90).toFixed(1)}px) rotate(${(rot + bob + (1 - k) * 4).toFixed(2)}deg) scale(${(0.92 + 0.08 * k).toFixed(3)})`, opacity: Math.min(1, k * 1.8), ...style }}>
      {tape ? <><Tape x={-18} y={-16} rot={-32} /><Tape x={w - 92} y={-14} rot={28} /></> : null}
      {children}
    </div>
  );
};
export const Tape: React.FC<{ x: number; y: number; rot: number; w?: number }> = ({ x, y, rot, w = 110 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 34, background: rgba("#E9DDB8", 0.82), transform: `rotate(${rot}deg)`, boxShadow: `0 2px 5px ${rgba("#140A04", 0.25)}`, borderLeft: `3px dotted ${rgba("#FFFFFF", 0.4)}`, borderRight: `3px dotted ${rgba("#FFFFFF", 0.4)}` }} />
);

/** Kicker de taller: regla oro + mayúsculas condensadas. */
export const Kick: React.FC<{ text: string; delay?: number; color?: string; center?: boolean; size?: number }> = ({ text, delay = 0, color = T.oxido, center, size = 30 }) => {
  const f = useCurrentFrame(); const a = ramp(f, delay, delay + 12);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: center ? "center" : "flex-start", opacity: a }}>
      <div style={{ width: 70 * a, height: 4, background: T.oro }} />
      <div style={{ fontFamily: FL, fontWeight: 600, fontSize: size, letterSpacing: 5, textTransform: "uppercase", color }}>{text}</div>
      {center ? <div style={{ width: 70 * a, height: 4, background: T.oro }} /> : null}
    </div>
  );
};
/** Titular serif palabra por palabra; `hot` en óxido con subrayado a mano. */
export const Words: React.FC<{ text: string; delay?: number; size?: number; color?: string; hot?: string[]; center?: boolean; stagger?: number; weight?: number }> = ({ text, delay = 0, size = 84, color = T.ink, hot = [], center, stagger = 3, weight = 800 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const ws = text.split(/\s+/).filter(Boolean);
  const hotSet = new Set(hot.flatMap((h) => h.toLowerCase().split(/\s+/)));
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.26}px`, justifyContent: center ? "center" : "flex-start", fontFamily: FD, fontWeight: weight, fontSize: size, lineHeight: 1.08, color }}>
      {ws.map((w, i) => {
        const k = spring({ frame: f - delay - i * stagger, fps, config: { damping: 13, mass: 0.6 } });
        const isHot = hotSet.has(w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ""));
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", opacity: Math.min(1, k * 1.6), transform: `translateY(${((1 - k) * size * 0.45).toFixed(1)}px)`, color: isHot ? T.oxido : color }}>
            {w}
            {isHot ? <HandLine u={ramp(f, delay + i * stagger + 8, delay + i * stagger + 22)} /> : null}
          </span>
        );
      })}
    </div>
  );
};
export const HandLine: React.FC<{ u: number; color?: string }> = ({ u, color = T.oxido }) => (
  <svg style={{ position: "absolute", left: "-4%", bottom: "-0.12em", width: "108%", height: "0.3em", overflow: "visible" }} viewBox="0 0 100 10" preserveAspectRatio="none">
    <path d="M2 7 C 25 3, 55 9, 98 4" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} vectorEffect="non-scaling-stroke" />
  </svg>
);
/** Círculo/óvalo a mano (se dibuja con u 0..1). */
export const HandCircle: React.FC<{ u: number; w: number; h: number; color?: string; stroke?: number }> = ({ u, w, h, color = T.oxido, stroke = 9 }) => (
  <svg width={w} height={h} viewBox="0 0 200 120" preserveAspectRatio="none" style={{ overflow: "visible" }}>
    <path d="M110 8 C 170 6, 196 40, 190 66 C 182 104, 120 116, 80 112 C 30 108, 4 84, 8 56 C 12 26, 52 8, 104 10 C 130 11, 150 16, 162 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 3px 6px ${rgba("#140A04", 0.45)})` }} />
  </svg>
);
/** Sello de goma (óxido u oro) que cae con golpe. */
export const Sello: React.FC<{ text: string; delay: number; color?: string; rot?: number; size?: number }> = ({ text, delay, color = T.oxido, rot = -9, size = 54 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = spring({ frame: f - delay, fps, config: { damping: 9, mass: 0.5, stiffness: 180 } });
  if (f < delay) return null;
  return (
    <div style={{ display: "inline-block", padding: `${size * 0.18}px ${size * 0.42}px`, border: `${Math.round(size * 0.1)}px solid ${color}`, borderRadius: 10, color, fontFamily: FL, fontWeight: 700, fontSize: size, letterSpacing: 4, textTransform: "uppercase",
      transform: `rotate(${rot}deg) scale(${(2.1 - 1.1 * k).toFixed(3)})`, opacity: Math.min(1, k * 2) * 0.92, mixBlendMode: "multiply", background: rgba(T.paper, 0.15) }}>{text}</div>
  );
};
/** Cinta métrica que se despliega (identidad del canal). */
export const TapeMeasure: React.FC<{ u: number; width: number; height?: number }> = ({ u, width, height = 64 }) => {
  const n = Math.floor(width / 24);
  return (
    <div style={{ width: width * u, height, overflow: "hidden", position: "relative", background: `linear-gradient(180deg, #E8B83A 0%, #D9A42A 100%)`, boxShadow: `0 8px 18px ${rgba("#140A04", 0.45)}`, borderTop: "2px solid #F5D77A", borderBottom: "2px solid #9C7418" }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: i * 24 + 6, top: 0, width: 2, height: i % 5 === 0 ? height * 0.55 : i % 1 === 0 ? height * 0.3 : 0, background: "#2B1D14" }}>
          {i % 5 === 0 ? <div style={{ position: "absolute", top: height * 0.52, left: -10, fontFamily: FL, fontSize: 18, fontWeight: 600, color: "#2B1D14" }}>{i / 5}</div> : null}
        </div>
      ))}
    </div>
  );
};

// ── OVERLAYS ─────────────────────────────────────────────────────────────────────────────────
/** Frase cinética sobre la ventana de avatar: chip de papel abajo-izquierda con kicker + título. */
export const TalkOverlay: React.FC<{ kicker?: string; title?: string; hot?: string[]; durF: number }> = ({ kicker, title, hot, durF }) => {
  const f = useCurrentFrame();
  const out = ramp(f, durF - 12, durF - 1);
  const k = useSpr(4, 14, 0.7);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `linear-gradient(to top, ${rgba("#140A04", 0.55)} 0%, transparent 38%)`, opacity: (1 - out) * Math.min(1, k * 1.5) }} />
      <div style={{ position: "absolute", left: 90, bottom: 86, maxWidth: 1000, opacity: 1 - out, transform: `translateX(${((1 - k) * -60 - out * 40).toFixed(1)}px) rotate(-1deg)` }}>
        <div style={{ background: `linear-gradient(160deg, ${T.paper} 0%, ${T.paper2} 100%)`, padding: "22px 34px 26px", borderRadius: 4, borderLeft: `10px solid ${T.oxido}`, boxShadow: `0 20px 40px ${rgba("#140A04", 0.5)}` }}>
          {kicker ? <Kick text={kicker} delay={6} size={26} /> : null}
          {title ? <div style={{ marginTop: 8 }}><Words text={title} delay={10} size={62} hot={hot} /></div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
/** Trazo a mano sobre un plano: círculo, flecha o etiqueta. x,y en %. */
export const MarkOverlay: React.FC<{ kind: string; text?: string; x: number; y: number; durF: number }> = ({ kind, text, x, y, durF }) => {
  const f = useCurrentFrame();
  const d0 = Math.min(14, Math.round(durF * 0.15));
  const u = ramp(f, d0, d0 + 16); const out = ramp(f, durF - 8, durF - 1); const kt = useSpr(d0, 10, 0.5);
  const label = text ? (
    <div style={{ fontFamily: FL, fontWeight: 700, fontSize: 40, letterSpacing: 2, textTransform: "uppercase", color: T.paper, background: T.oxido, padding: "8px 18px", borderRadius: 4, boxShadow: `0 10px 22px ${rgba("#140A04", 0.5)}`, opacity: ramp(f, d0 + 12, d0 + 20), transform: `rotate(-3deg)`, whiteSpace: "nowrap" }}>{text}</div>
  ) : null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 1 - out }}>
      <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}>
        {kind === "circle" ? <div style={{ position: "relative" }}><HandCircle u={u} w={560} h={340} /><div style={{ position: "absolute", left: 360, top: -30 }}>{label}</div></div> : null}
        {kind === "arrow" ? (
          <div style={{ position: "relative", width: 1, height: 1 }}>
            <svg width={420} height={260} viewBox="0 0 420 260" style={{ position: "absolute", left: -430, top: -250, overflow: "visible" }}>
              <path d="M20 30 C 150 10, 300 60, 400 240" fill="none" stroke={T.oxido} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} style={{ filter: `drop-shadow(0 3px 6px ${rgba("#140A04", 0.5)})` }} />
              <path d="M360 215 L 402 244 L 410 196" fill="none" stroke={T.oxido} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={u > 0.95 ? 1 : 0} />
            </svg>
            <div style={{ position: "absolute", left: -520, top: -330 }}>{label}</div>
          </div>
        ) : null}
        {kind === "tag" ? <div style={{ transform: `scale(${(0.6 + 0.4 * kt).toFixed(3)})` }}>{label}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
