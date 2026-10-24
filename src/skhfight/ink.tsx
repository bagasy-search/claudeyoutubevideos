// skhfight (de ssimple6) · piezas NUEVAS de este video (todas en el idioma de la casa: washi, sumi, bermellón).
// InkPortal = el portal del video: la TINTA se esparce (borde de mancha con lóbulos + gotas), nada de círculo borroso.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { BRUSH, COL, FONT, P, e, ei, extrude, rnd, s, spr, wordsIn } from "./lib";
import { World as WorldRaw, camSpeed } from "./osaka3d";
import AVW from "./avwin.json";
import REELJ from "./reel.json";
import LTXOK from "./ltx_ok.json";

const REEL = (REELJ as { reel: boolean }).reel;
const OK = new Set(LTXOK as string[]);
type Wn = { ms: number; me: number; off: number };
export const WIN: Wn[] = (AVW as unknown as { win: Wn[] }).win;

// ---------- el portal de tinta ----------
const blob = (x: number, y: number, R: number, seed: number, wob = 1) => {
  const N = 260, pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const n = 0.08 * Math.sin(a * 3 + seed) + 0.05 * Math.sin(a * 5 + seed * 2.3) + 0.025 * Math.sin(a * 9 + seed * 4.1) + 0.012 * Math.sin(a * 17 + seed);
    const rr = R * (1 + n * wob);
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  return pts;
};
export const InkPortal: React.FC<{ x: number; y: number; r: number; seed?: number; children: React.ReactNode }> = ({ x, y, r, seed = 1, children }) => {
  if (r <= 0.001) return null;
  if (r >= 0.999) return <AbsoluteFill>{children}</AbsoluteFill>;
  const far = Math.hypot(Math.max(x, 1920 - x), Math.max(y, 1080 - y));
  const R = r * far * 1.32;
  const pts = blob(x, y, R, seed);
  const poly = pts.map(([a, b]) => `${a.toFixed(1)}px ${b.toFixed(1)}px`).join(",");
  const d = "M" + pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join("L") + "Z";
  const band = 14 + 40 * (1 - r);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(${poly})` }}>{children}</AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path d={d} fill="none" stroke={COL.ink} strokeWidth={band} strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#4a3d30" strokeWidth={band * 1.9} strokeLinejoin="round" opacity={0.28} />
        {Array.from({ length: 26 }, (_, i) => {
          const a = rnd(i, seed) * Math.PI * 2, dd = R * (1.04 + rnd(i, seed + 3) * 0.1) + band, rr = (3 + rnd(i, seed + 5) * 14) * (0.4 + (1 - r));
          return <circle key={i} cx={x + Math.cos(a) * dd} cy={y + Math.sin(a) * dd} r={rr} fill={COL.ink} opacity={0.85} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- el avatar (SIN desenfoque, SIN halo: borde nítido, siempre a cuadro completo) ----------
export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const face = REEL ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.4 && t < w.me + 0.4 ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.01 + 0.01 * Math.sin(t * 0.7)})` }} />;
  // ella queda al centro del reel y las tarjetas van a la derecha → 1,22× y corrida 210 px a la izquierda (el máximo sin dejar borde), la derecha queda libre
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><AbsoluteFill style={{ transform: "translateX(-210px) scale(1.22)" }}>{face}</AbsoluteFill></AbsoluteFill>;
};
// puntos del cuarto del avatar (foto de referencia escalada a 1920x1080)
export const AVP = { shoji: { x: 1480, y: 380 }, cup: { x: 1510, y: 960 }, frame: { x: 170, y: 538 }, window: { x: 80, y: 170 }, hands: { x: 580, y: 960 } };  // con el 1,2× y el corrimiento

// el mundo con desenfoque de movimiento SÓLO cuando viaja la cámara
export const World: React.FC<{ t: number; sepia?: number }> = ({ t, sepia = 0 }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  const f = [v.bx + v.by > 0.6 ? `url(#${id})` : "", sepia > 0.01 ? `sepia(${sepia}) saturate(${1 - 0.3 * sepia})` : ""].join(" ").trim();
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: f || undefined }}><WorldRaw t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// toma LTX (si todavía no llegó de la cola, la foto de origen con zoom lento)
export const Clip: React.FC<{ k: string; img: string; t: number; a: number; z?: [number, number] }> = ({ k, img, t, a, z = [1.03, 1.12] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 7);
  return <AbsoluteFill style={{ transform: `scale(${sc})`, background: "#000" }}>
    <Img src={staticFile(P + img + ".jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
    {OK.has(k) && t < a + 4.95 ? <Sequence from={s(a)} layout="none"><OffthreadVideo src={staticFile(P + "ltx/" + k + ".mp4")} muted style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} /></Sequence> : null}
  </AbsoluteFill>;
};

// ---------- chip de washi (arriba a la izquierda) ----------
export const Chip: React.FC<{ t: number; at: number; out: number; text: string; col?: string; x?: number; y?: number }> = ({ t, at, out, text, col = COL.red, x = 100, y = 96 }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.25)); if (o <= 0.01) return null;
  const k = Math.min(1.06, spr(t, at));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `perspective(800px) rotateX(${(1 - Math.min(1, k)) * 70}deg)`, transformOrigin: "50% 0",
    padding: "12px 28px 14px", background: `linear-gradient(180deg, ${COL.cream}, ${COL.paper})`, borderRadius: 4, borderLeft: `10px solid ${col}`, boxShadow: "0 18px 36px rgba(0,0,0,.45)",
    fontFamily: FONT, fontWeight: 800, fontSize: 40, color: COL.ink, letterSpacing: 3, whiteSpace: "nowrap" }}>{text}</div>;
};

// ---------- NUEVO · el teléfono suena: ondas de tinta que salen del aparato ----------
export const RingWaves: React.FC<{ t: number; x: number; y: number; on: number }> = ({ t, x, y, on }) => {
  if (on <= 0.01) return null;
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {Array.from({ length: 4 }, (_, i) => {
      const ph = ((t * 0.8 + i / 4) % 1), R = 60 + ph * 420;
      return <g key={i} opacity={on * (1 - ph) * 0.9}>
        <path d={`M ${x - R * 0.7} ${y - R * 0.7} A ${R} ${R} 0 0 1 ${x + R * 0.7} ${y - R * 0.7}`} fill="none" stroke={COL.cream} strokeWidth={6 - ph * 4} strokeLinecap="round" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }} />
      </g>;
    })}
  </svg>;
};

// ---------- NUEVO · TRES SEMANAS: hoja de calendario de pared; los días se tachan con pincel rojo ----------
export const Weeks: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1480, y = 500 }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const cell = 74;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400 }}>
    <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -700}px) rotateY(${-14 + 3 * Math.sin(t * 0.6)}deg) rotateZ(2deg)`, background: COL.cream, padding: "26px 30px 30px", borderRadius: 6, boxShadow: "0 50px 90px rgba(0,0,0,.6)", borderTop: `16px solid ${COL.red}` }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cell}px)`, gap: 4, marginBottom: 8 }}>{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: i === 0 ? COL.red : COL.ink, textAlign: "center" }}>{d}</div>)}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cell}px)`, gap: 4 }}>
        {Array.from({ length: 21 }, (_, i) => {
          const xa = at + 0.5 + i * 0.075, xk = e(t, xa, xa + 0.12);
          return <div key={i} style={{ width: cell, height: cell, background: i % 7 === 0 ? "#f3dcd2" : "#efe6d2", position: "relative", fontFamily: FONT, fontWeight: 600, fontSize: 26, color: "#6b5a48", padding: 6 }}>
            {i + 1}
            <svg width={cell} height={cell} style={{ position: "absolute", inset: 0 }}>
              <line x1={10} y1={12} x2={10 + (cell - 20) * xk} y2={12 + (cell - 24) * xk} stroke={COL.red} strokeWidth={7} strokeLinecap="round" />
              {xk >= 1 && <line x1={cell - 10} y1={12} x2={10 + (cell - 20) * (1 - e(t, xa + 0.1, xa + 0.2))} y2={12 + (cell - 24) * e(t, xa + 0.1, xa + 0.2)} stroke={COL.red} strokeWidth={7} strokeLinecap="round" />}
            </svg>
          </div>;
        })}
      </div>
      <div style={{ fontFamily: BRUSH, fontSize: 64, color: COL.red, textAlign: "center", marginTop: 12, opacity: e(t, at + 2.2, at + 2.5) }}>3 weeks. No call.</div>
    </div>
  </div>;
};

// ---------- NUEVO · la frase escrita A PINCEL sobre una tira de washi, palabra por palabra al ritmo de la voz ----------
export const InkLine: React.FC<{ t: number; a: number; b: number; out: number; x?: number; y?: number; size?: number; col?: string; maxW?: number; rot?: number; hot?: string[] }> = ({ t, a, b, out, x = 960, y = 860, size = 78, col = COL.ink, maxW = 1500, rot = -1.5, hot = [] }) => {
  const words = wordsIn(a, b);
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const k = spr(t, a - 0.2, 0.9);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scaleX(${0.7 + 0.3 * Math.min(1, k)})` }}>
    <div style={{ maxWidth: maxW, padding: "22px 54px 30px", background: `linear-gradient(180deg, ${COL.cream}, ${COL.paper})`, boxShadow: "0 30px 60px rgba(0,0,0,.5)",
      clipPath: "polygon(0% 6%, 3% 0%, 12% 4%, 25% 0%, 41% 5%, 58% 1%, 74% 5%, 88% 0%, 100% 4%, 98% 52%, 100% 96%, 86% 100%, 70% 95%, 52% 100%, 33% 96%, 18% 100%, 4% 95%, 0% 100%, 2% 50%)" }}>
      <div style={{ fontFamily: BRUSH, fontSize: size, lineHeight: 1.18, color: col, textAlign: "center" }}>
        {words.map((w, i) => {
          const r = e(t, w.a - 0.04, w.a + 0.22);
          const isHot = hot.some((h) => w.text.toLowerCase().includes(h));
          return <span key={i} style={{ display: "inline-block", marginRight: size * 0.28, opacity: r > 0 ? 1 : 0, clipPath: `inset(-20% ${100 - r * 100}% -20% -5%)`, color: isHot ? COL.red : col, transform: `translateY(${(1 - r) * 6}px)` }}>{w.text}</span>;
        })}
      </div>
    </div>
  </div>;
};

// ---------- NUEVO · la línea se queda muda: la onda de la voz se aplana en una raya de tinta ----------
export const Flatline: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; w?: number; label?: string }> = ({ t, at, out, x = 960, y = 520, w = 1100, label = "silence." }) => {
  const o = e(t, at - 0.3, at) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const flat = e(t, at + 0.2, at + 1.2);
  const N = 140, pts = Array.from({ length: N }, (_, i) => {
    const u = i / (N - 1), env = Math.sin(Math.PI * u);
    const amp = 120 * env * (1 - flat) * (0.5 + 0.5 * Math.sin(i * 1.7 + t * 18)) * (0.6 + 0.4 * rnd(i, 3));
    return `${(x - w / 2 + u * w).toFixed(1)},${(y + amp * Math.sin(i * 0.9 + t * 25)).toFixed(1)}`;
  }).join(" ");
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
    <polyline points={pts} fill="none" stroke={COL.cream} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,.85))" }} />
    <text x={x} y={y + 130} textAnchor="middle" fontFamily={BRUSH} fontSize={92} fill={COL.cream} opacity={e(t, at + 1.0, at + 1.5)} style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,.85))" }}>{label}</text>
  </svg>;
};

// ---------- NUEVO · el trazo de sumi que TACHA (se dibuja de izquierda a derecha con borde áspero) ----------
export const BrushStrike: React.FC<{ t: number; at: number; out: number; x: number; y: number; w: number; rot?: number; th?: number; col?: string }> = ({ t, at, out, x, y, w, rot = -4, th = 34, col = COL.ink }) => {
  const k = ei(t, at, at + 0.35), o = 1 - e(t, out, out + 0.3); if (k <= 0.001 || o <= 0.01) return null;
  const N = 60, top: string[] = [], bot: string[] = [];
  for (let i = 0; i <= N; i++) { const u = (i / N) * k, px = -w / 2 + u * w, tap = Math.sin(Math.PI * Math.min(1, (i / N) * 1.1 + 0.05)); top.push(`${px.toFixed(1)},${(-th / 2 * tap - rnd(i, 2) * 5).toFixed(1)}`); bot.unshift(`${px.toFixed(1)},${(th / 2 * tap + rnd(i, 4) * 5).toFixed(1)}`); }
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <polygon points={[...top, ...bot].join(" ")} fill={col} opacity={0.94} />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={-w / 2 + rnd(i, 7) * w * k} y1={(rnd(i, 8) - 0.5) * th} x2={-w / 2 + rnd(i, 7) * w * k + 30 + rnd(i, 9) * 60} y2={(rnd(i, 8) - 0.5) * th} stroke={COL.paper} strokeWidth={1.5} opacity={0.35} />)}
    </g>
  </svg>;
};

// ---------- NUEVO · los 9 EMA en fila abajo (mientras habla el avatar) ----------
export const EmaRow: React.FC<{ t: number; at: number; out: number; y?: number; hi?: number }> = ({ t, at, out, y = 930, hi = -1 }) => {
  const o = 1 - e(t, out, out + 0.3); if (o <= 0.01 || t < at) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 18, opacity: o }}>
    {Array.from({ length: 9 }, (_, i) => {
      const a = at + i * 0.13, k = spr(t, a, 1.1), sw = Math.sin((t - a) * 5) * 10 * Math.exp(-(t - a) * 1.5);
      if (t < a) return <div key={i} style={{ width: 132 }} />;
      return <div key={i} style={{ width: 132, height: 104, transform: `translateY(${(1 - Math.min(1, k)) * 160}px) rotate(${sw}deg) scale(${i === hi ? 1.18 : 1})`, transformOrigin: "50% -30px",
        clipPath: "polygon(0 30%, 50% 0, 100% 30%, 100% 100%, 0 100%)", background: "linear-gradient(180deg,#e3c99a,#c9a46e)", boxShadow: "0 10px 20px rgba(0,0,0,.5)", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 28, height: 5, background: "#7a1d12" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily: BRUSH, fontSize: 64, color: COL.ink }}>{i + 1}</div>
      </div>;
    })}
  </div>;
};

// ---------- NUEVO · la línea de su vida: un trazo de pincel con fechas que caen como sellos ----------
export const LifeLine: React.FC<{ t: number; at: number; out: number; marks: { at: number; u: number; top: string; bot: string; red?: boolean }[]; y?: number }> = ({ t, at, out, marks, y = 820 }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const x0 = 170, x1 = 1750, grow = Math.max(...marks.filter((m) => t >= m.at - 0.3).map((m) => m.u), 0.35);
  const L = ei(t, at, at + 0.8) * grow;
  return <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
    <BrushStrike t={t} at={at} out={1e9} x={(x0 + x1) / 2} y={y} w={(x1 - x0)} rot={0} th={18} col={COL.cream} />
    {marks.map((m, i) => {
      const k = spr(t, m.at, 1.2), oo = e(t, m.at, m.at + 0.08); if (oo <= 0.01 || m.u > L + 0.05) return null;
      const px = x0 + m.u * (x1 - x0);
      return <div key={i} style={{ position: "absolute", left: px, top: y, transform: `translate(-50%,-50%)`, opacity: oo, textAlign: "center" }}>
        <div style={{ position: "absolute", left: "50%", bottom: 34, transform: `translateX(-50%) scale(${2 - Math.min(1, k)})`, whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 800, fontSize: 64, color: m.red ? "#ffb39a" : COL.cream, textShadow: extrude(5, "#000") }}>{m.top}</div>
        <div style={{ width: 30, height: 30, borderRadius: 4, background: m.red ? COL.red : COL.ink, border: `4px solid ${COL.cream}`, transform: `rotate(45deg) scale(${Math.min(1.1, k)})` }} />
        <div style={{ position: "absolute", left: "50%", top: 40, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: BRUSH, fontSize: 42, color: COL.cream, textShadow: "0 3px 8px rgba(0,0,0,.9)" }}>{m.bot}</div>
      </div>;
    })}
  </div>;
};

// ---------- la descripción (washi): el renglón 1 con el link se ilumina ----------
export const Desc: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; scale?: number }> = ({ t, at, out, x = 1150, y = 600, scale = 0.8 }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35)); if (o <= 0.01) return null;
  const hl = e(t, at + 0.7, at + 1.2), sweep = e(t, at + 0.7, at + 1.7);
  const L = (w: number) => <div style={{ height: 14, width: w, borderRadius: 7, background: "rgba(27,23,18,.16)", margin: "18px 0 0" }} />;
  return <div style={{ position: "absolute", left: x, top: y, perspective: 1500, opacity: o }}>
    <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${12 - 7 * Math.min(1, k)}deg) rotateY(${-10 + 3 * Math.sin(t * 0.8)}deg) scale(${scale})`, width: 1240, padding: "34px 44px 40px", borderRadius: 8,
      background: `linear-gradient(180deg, ${COL.cream}, ${COL.paper})`, boxShadow: "0 70px 120px rgba(0,0,0,.65)", borderTop: `14px solid ${COL.indigo}`, fontFamily: FONT }}>
      <div style={{ color: "#7a6a58", fontWeight: 800, fontSize: 24, letterSpacing: 5 }}>DESCRIPTION</div>
      <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 6, background: `rgba(200,50,30,${0.1 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 4px rgba(200,50,30,${0.85 * hl})` : undefined, overflow: "hidden" }}>
        <div style={{ color: COL.ink, fontWeight: 800, fontSize: 40, lineHeight: 1.25 }}>All 11 rules, written out for you to keep <span style={{ color: COL.indigo }}>← in the description</span></div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
      </div>
      {L(980)}{L(1040)}{L(760)}
    </div>
    <div style={{ position: "absolute", left: -600, top: -150, opacity: hl, transform: `translateX(${-30 * (1 - hl) + 10 * Math.sin(t * 6)}px)`, fontFamily: BRUSH, fontSize: 76, color: COL.red, textShadow: "0 0 14px rgba(251,246,234,.95), 0 0 4px rgba(251,246,234,.9)", whiteSpace: "nowrap" }}>all 11 rules →</div>
  </div>;
};

// ---------- rótulo inferior de washi con canto (el nombre) ----------
export const LowerThird: React.FC<{ t: number; at: number; out: number; name: string; l2: string; l2at: number }> = ({ t, at, out, name, l2, l2at }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35)); if (o <= 0.01) return null;
  const n2 = Math.round(l2.length * e(t, l2at, l2at + 1.0));
  return <div style={{ position: "absolute", left: 110, bottom: 110, perspective: 1100, opacity: o }}>
    <div style={{ transformOrigin: "0 50%", transform: `rotateY(${(1 - Math.min(1, k)) * 70 + 8}deg)` }}>
      <div style={{ display: "inline-block", padding: "14px 34px 18px 26px", background: `linear-gradient(180deg, ${COL.cream}, ${COL.paper})`, borderLeft: `12px solid ${COL.red}`, borderRadius: 4, boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
        <div style={{ fontFamily: BRUSH, fontSize: 84, color: COL.ink, lineHeight: 1.05 }}>{name}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: COL.red, letterSpacing: 4, minHeight: 40 }}>{l2.slice(0, n2)}</div>
      </div>
    </div>
  </div>;
};

// ---------- la tarjeta-foto que sale del portarretratos y viene hacia cámara (foto vieja de 1976) ----------
export const PhotoFly: React.FC<{ t: number; at: number; out: number; id: string; from: { x: number; y: number }; to?: { x: number; y: number }; w?: number; label?: string; rot?: number }> = ({ t, at, out, id, from, to = { x: 1180, y: 520 }, w = 640, label, rot = 4 }) => {
  const k = ei(t, at, at + 0.9), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const x = from.x + (to.x - from.x) * k, y = from.y + (to.y - from.y) * k, sc = 0.12 + 0.88 * k;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1600 }}>
    <div style={{ transform: `translate(-50%,-50%) scale(${sc}) rotateY(${(1 - k) * 40 - 8 + 2 * Math.sin(t * 0.7)}deg) rotateZ(${rot * k}deg)`, background: "#f4efe4", padding: "22px 22px 84px", boxShadow: "0 60px 110px rgba(0,0,0,.65)" }}>
      <Img src={staticFile(P + id + ".jpg")} style={{ width: w, height: w * 0.75, objectFit: "cover", display: "block" }} />
      {label && <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: BRUSH, fontSize: 50, color: COL.ink }}>{label}</div>}
    </div>
  </div>;
};

// la página real flotando junto al avatar (The 101 Day, pág. 45)
export const PageCard: React.FC<{ t: number; at: number; out: number; id: string; x?: number; y?: number; h?: number; tilt?: number; hiAt?: number }> = ({ t, at, out, id, x = 1460, y = 540, h = 900, tilt = -16, hiAt = 1e9 }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const w = h * 1445 / 1870, hl = e(t, hiAt, hiAt + 0.5);
  return <div style={{ position: "absolute", left: x, top: y, perspective: 1600, opacity: o }}>
    <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -900}px) rotateY(${tilt + 3 * Math.sin(t * 0.6)}deg) rotateX(4deg)`, width: w, height: h, boxShadow: "0 60px 110px rgba(0,0,0,.6)", position: "relative" }}>
      <Img src={staticFile(P + id + ".jpg")} style={{ width: "100%", height: "100%", display: "block" }} />
      <div style={{ position: "absolute", left: "7%", top: "7.4%", width: `${37 * hl}%`, height: "4%", background: "rgba(200,50,30,.25)", borderRadius: 4 }} />
    </div>
  </div>;
};
