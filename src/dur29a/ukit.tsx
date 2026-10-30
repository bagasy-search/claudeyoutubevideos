// ukit — base común de los componentes únicos de la tanda dur29 (Durarías 3 Segundos).
// Escenario en CADA pieza: foto del momento desenfocada que se hunde y oscurece mientras la pieza se arma, piso con luz,
// cámara que deriva en curva (nunca zoom lineal ni quieta), entrada desde la profundidad y salida que se aleja y desenfoca.
// Todo sale de useCurrentFrame() (sin estado entre cuadros, sin Math.random): ninguna costura entre chunks del farm.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile } from "remotion";
import { useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

export const { fontFamily: F } = loadFont("normal", { weights: ["700", "800", "900"], subsets: ["latin"] });
export const INK = "#f0ebe5", RED = "#f14536", ORA = "#edb269", GOLD = "#e9c762", SAND = "#d9b27c", DARK = "#0c0a09";
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ez = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], { ...cl, easing: Easing.bezier(0.22, 1, 0.36, 1) });
export const lin = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], cl);
// resorte con masa: llega, se pasa un poco y asienta
export const sp = (f: number, at: number, mass = 1, damping = 11) => spring({ frame: f - at, fps: 30, config: { damping, mass, stiffness: 120 } });
export const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
export const sf = (p: string) => staticFile(p);
export const at = (p: any, k: string, def: number) => (p && p.at && typeof p.at[k] === "number" ? p.at[k] : def);

export const Scene: React.FC<{ d: number; bg?: string; floor?: string; tint?: string; children: React.ReactNode; drift?: number; push?: number }> = ({ d, bg, floor = "255,170,90", tint = DARK, children, drift = 1, push = 0.045 }) => {
  const f = useCurrentFrame();
  const inn = ez(f, 0, 16), out = ez(f, Math.max(d - 10, 1), Math.max(d, 2));
  const k = Easing.bezier(0.45, 0, 0.25, 1)(Math.min(1, f / Math.max(d, 1)));
  const cx = (Math.sin(f / 72) * 14 + Math.sin(f / 31) * 3) * drift, cy = (Math.sin(f / 97 + 1.3) * 9) * drift, rot = Math.sin(f / 120) * 0.35 * drift;
  const s = (1 + push * k) * (0.93 + 0.07 * inn) * (1 - 0.03 * out);
  return (
    <AbsoluteFill style={{ background: tint, overflow: "hidden" }}>
      {bg && (
        <AbsoluteFill style={{ opacity: 0.85 - 0.25 * inn, filter: `blur(${4 + 9 * inn}px) brightness(${0.9 - 0.22 * inn})`, transform: `scale(${1.18 - 0.04 * inn}) translateX(${-f * 0.12}px)` }}>
          <Img src={sf(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 26% at 50% 88%, rgba(${floor},.22) 0%, rgba(${floor},0) 100%)` }} />
      <AbsoluteFill style={{ transform: `translate(${cx}px,${cy}px) rotate(${rot}deg) scale(${s})`, filter: `blur(${(1 - inn) * 9 + out * 7}px)`, opacity: 0.25 + 0.75 * inn }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
// palabra DENTRO de la escena (sobre el objeto), entra con física en su cuadro
export const Tag: React.FC<{ a: number; t: string; x: number; y: number; size?: number; color?: string; rot?: number; w?: number; align?: "center" | "left"; bg?: string }> = ({ a, t, x, y, size = 54, color = INK, rot = 0, w = 900, align = "center", bg }) => {
  const f = useCurrentFrame();
  const s = sp(f, a, 0.9, 10), o = ez(f, a, a + 5);
  return (
    <div style={{ position: "absolute", left: align === "center" ? x - w / 2 : x, top: y, width: w, textAlign: align, fontFamily: F, fontWeight: 900, fontSize: size, lineHeight: 1.05, color, opacity: o,
      transform: `translateY(${(1 - s) * 24}px) scale(${0.7 + 0.3 * s}) rotate(${rot * (2 - s)}deg)`, textShadow: bg ? "none" : "0 0 10px rgba(0,0,0,.9), 0 5px 18px rgba(0,0,0,.7)" }}>
      {bg ? <span style={{ background: bg, padding: "4px 18px", borderRadius: 8, boxShadow: "0 8px 22px rgba(0,0,0,.45)" }}>{t}</span> : t}
    </div>
  );
};
// sombra de contacto que se aprieta cuando el objeto se apoya (k = 0 en el aire, 1 apoyado)
export const Shadow: React.FC<{ x: number; y: number; w: number; k?: number }> = ({ x, y, w, k = 1 }) => (
  <ellipse cx={x} cy={y} rx={w * (0.6 + 0.4 * k)} ry={w * 0.09 * (0.6 + 0.4 * k)} fill="rgba(0,0,0,.55)" opacity={0.35 + 0.5 * k} style={{ filter: "blur(6px)" }} />
);
// polvo / partículas en suspensión (que nunca haya un cuadro quieto)
export const Motes: React.FC<{ n?: number; c?: string; up?: boolean }> = ({ n = 26, c = "255,220,170", up = false }) => {
  const f = useCurrentFrame();
  return <>{Array.from({ length: n }).map((_, i) => { const ph = (f / (300 + rnd(i, 3) * 260) + rnd(i, 4)) % 1; const x = rnd(i, 5) * 1920 + Math.sin(f / 50 + i) * 24; const y = up ? 1100 - ph * 1200 : 80 + rnd(i, 6) * 900 + Math.sin(f / 60 + i * 2) * 20; const r = 2 + rnd(i, 7) * 3.5;
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: `rgba(${c},${0.45 * Math.sin((up ? ph : 0.5) * Math.PI)})` }} />; })}</>;
};
// figura humana en silueta, de cuerpo entero y SIN cara (perfil), con pose paramétrica
export const Fig: React.FC<{ x: number; y: number; s?: number; lean?: number; step?: number; c?: string; load?: boolean; arm?: number }> = ({ x, y, s = 1, lean = 0, step = 0, c = "#1a120d", load = false, arm = 0 }) => {
  const sw = Math.sin(step) * 16;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <g transform={`rotate(${lean})`}>
        <path d={`M0,0 L${-8 + sw * 0.4},-2 L${-10 + sw},60`} stroke={c} strokeWidth={13} strokeLinecap="round" fill="none" />
        <path d={`M0,0 L${8 - sw * 0.4},-2 L${10 - sw},60`} stroke={c} strokeWidth={13} strokeLinecap="round" fill="none" />
        <path d="M0,0 L0,-78" stroke={c} strokeWidth={26} strokeLinecap="round" />
        <circle cx={6} cy={-100} r={17} fill={c} />
        <path d={`M0,-70 L${20 + arm * 10},${-40 - arm * 30} L${34 + arm * 12},${-22 - arm * 50}`} stroke={c} strokeWidth={10} strokeLinecap="round" fill="none" />
        {load && <rect x={-46} y={-96} width={34} height={58} rx={6} fill="#5a3a22" stroke="#2a1a10" strokeWidth={3} />}
      </g>
    </g>
  );
};
