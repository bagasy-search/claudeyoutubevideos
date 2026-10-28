// piezas PREMIUM (28-oct, pedido del creador: «llevalos a nivel premium, hay textos que sobrecargan»). Un solo lenguaje para todo:
// panel oscuro limpio con filo fino, tipografía plana (sin relieve), entrada = sube + se aclara el desenfoque (sin rebote), salida = se apaga.
// Una idea por pieza, pocas palabras, nada se pisa. Todo determinista y anclado a la palabra (at/out en segundos de locución).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COL, FONT, P, e, ei } from "./lib";

export const G = {
  panel: "linear-gradient(180deg, rgba(22,23,27,.9), rgba(13,14,17,.9))",
  line: "rgba(255,255,255,.10)",
  txt: "#f7f4ee",
  dim: "rgba(247,244,238,.58)",
  shadow: "0 30px 80px rgba(0,0,0,.55), 0 2px 0 rgba(255,255,255,.04) inset",
  soft: "0 6px 30px rgba(0,0,0,.55)",
};
const ACC: Record<string, string> = { amber: COL.amber, red: "#ff5a4a", ice: COL.ice, green: "#6fe39a", ink: G.txt };
export const acc = (c?: string) => (c && ACC[c]) || (c && c.startsWith("#") ? c : COL.amber);

// resorte con PESO (masa-amortiguación, determinista en t): llega, se pasa un poco y asienta. w = rigidez, z = amortiguación
export const phys = (t: number, a: number, w = 7, z = 0.42) => {
  const x = t - a; if (x <= 0) return 0;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
};
const cl = (x: number) => Math.max(0, Math.min(1, x));
// curva de salida (arranca lento y acelera): irse en profundidad sin corte
const eIn = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c * c * c; };
const img = (id: string) => staticFile("img/" + P + id + ".jpg");

// entrada/salida común (28-oct, «nada brusco, con peso, todo fundido»): llega desde la profundidad con resorte (se pasa y asienta,
// inclinada que se endereza) y se va hacia atrás acelerando, desenfocándose. Nunca lineal.
const vis = (t: number, at: number, out: number) => e(t, at, at + 0.22) * (1 - eIn(t, out - 0.05, out + 0.5));
const rise = (t: number, at: number, out: number, d = 26) => {
  const s = phys(t, at, 6.5, 0.48), x = eIn(t, out - 0.05, out + 0.5);
  const bl = Math.max(1 - cl(s * 1.4), x) * 9;
  return { opacity: vis(t, at, out), transform: `perspective(1400px) translateY(${(1 - s) * d * 1.8 - x * 18}px) rotateX(${(1 - s) * 24 - x * 12}deg) scale(${0.92 + 0.08 * s - 0.06 * x})`, filter: bl > 0.2 ? `blur(${bl}px)` : undefined };
};
const Panel: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: G.panel, border: `1px solid ${G.line}`, borderRadius: 26, boxShadow: G.shadow, fontFamily: FONT, color: G.txt, ...style }}>{children}</div>
);
const Kicker: React.FC<{ txt: string; col?: string; w?: number }> = ({ txt, col = COL.amber, w = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: G.dim, textTransform: "uppercase" }}>
    <div style={{ width: 34 * w, height: 3, borderRadius: 2, background: col }} />{txt}
  </div>
);

// ---------- íconos que se dibujan (el chip deja de ser un cartelito: lleva el OBJETO de la frase) ----------
type IcoK = "clock" | "flame" | "box" | "battery" | "wind" | "ruler" | "chat" | "no" | "num" | "dot";
const icoOf = (s: string): [IcoK, string, string] => {
  const m = s.match(/^(?:PASO\s+)?(\d)\s*·\s*(.+)$/);
  if (m) return ["num", m[1], m[2]];
  if (s.startsWith("💬")) return ["chat", "", s.replace("💬", "").trim()];
  if (/(=|:)\s*NO$|\bERROR\b|\bNUNCA\b/.test(s)) return ["no", "", s];
  if (/BATER/.test(s)) return ["battery", "", s];
  if (/\bAIRE\b/.test(s)) return ["wind", "", s];
  if (/HORAS?\b/.test(s)) return ["clock", "", s];
  if (/\bGAS\b|HIERVE|HERVOR|HORNALLA|DORA/.test(s)) return ["flame", "", s];
  if (/CAJA|CAJÓN|CONSERVADORA|HELADERA/.test(s)) return ["box", "", s];
  if (/MEDIDA|\bCM\b/.test(s)) return ["ruler", "", s];
  return ["dot", "", s];
};
const Ico: React.FC<{ k: IcoK; c: string; p: number; t: number; n?: string }> = ({ k, c, p, t, n }) => {
  const d = { fill: "none", stroke: c, strokeWidth: 3.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - cl(p) };
  const w = Math.sin(t * 2.2) * 0.5 + 0.5;
  if (k === "num") return <div style={{ fontWeight: 900, fontSize: 40, color: c, lineHeight: 1, transform: `translateY(${(1 - cl(p)) * 30}px)` }}>{n}</div>;
  return <svg width={46} height={46} viewBox="0 0 48 48">
    {k === "clock" && <><circle cx={24} cy={24} r={18} {...d} /><line x1={24} y1={24} x2={24} y2={13} {...d} strokeDashoffset={0} opacity={cl(p)} transform={`rotate(${p * 300 + t * 20} 24 24)`} /><line x1={24} y1={24} x2={31} y2={24} {...d} strokeDashoffset={0} opacity={cl(p)} transform={`rotate(${p * 40} 24 24)`} /></>}
    {k === "flame" && <path d="M24 42c-8 0-12-6-12-12 0-7 6-10 7-17 4 3 5 7 4 10 3-1 5-4 5-7 5 4 8 9 8 14 0 7-5 12-12 12z" {...d} transform={`translate(24 42) scale(${1 + 0.05 * w} ${1 + 0.1 * w}) translate(-24 -42)`} />}
    {k === "box" && <><path d="M8 17 L24 9 L40 17 L40 35 L24 43 L8 35 Z" {...d} /><path d="M8 17 L24 25 L40 17 M24 25 L24 43" {...d} /></>}
    {k === "battery" && <><rect x={7} y={14} width={30} height={20} rx={4} {...d} /><line x1={40} y1={20} x2={40} y2={28} {...d} /><rect x={11} y={18} width={22 * cl(p) * (0.75 + 0.25 * w)} height={12} rx={2} fill={c} opacity={0.9} /></>}
    {k === "wind" && <>{[14, 24, 34].map((y, i) => <path key={i} d={`M6 ${y} H${30 - i * 4} q6 0 6 -5 t-6 -5`} {...d} transform={`translate(${Math.sin(t * 2 + i) * 2} 0)`} />)}</>}
    {k === "ruler" && <><rect x={5} y={17} width={38} height={14} rx={2} {...d} />{[11, 17, 23, 29, 35].map((x, i) => <line key={i} x1={x} y1={17} x2={x} y2={i % 2 ? 22 : 25} {...d} />)}</>}
    {k === "chat" && <path d="M8 12 h32 a4 4 0 0 1 4 4 v14 a4 4 0 0 1 -4 4 h-18 l-9 8 v-8 h-5 a4 4 0 0 1 -4 -4 v-14 a4 4 0 0 1 4 -4z" {...d} />}
    {k === "no" && <><circle cx={24} cy={24} r={17} {...d} /><line x1={12} y1={36} x2={36} y2={12} {...d} strokeDashoffset={1 - cl(p * 1.6 - 0.6)} /></>}
    {k === "dot" && <circle cx={24} cy={24} r={7 + 2 * w} fill={c} opacity={cl(p)} />}
  </svg>;
};

// ---------- chip: el ícono salta (resorte) y de él se desenrolla la pastilla con la frase; al irse se enrolla de vuelta ----------
export const Chip: React.FC<{ t: number; at: number; out: number; text: string; col?: string; x?: number; y?: number }> = ({ t, at, out, text, col, x = 96, y = 92 }) => {
  if (t < at - 0.05 || t > out + 0.6) return null;
  const [k, n, txt] = icoOf(text);
  const c = k === "no" ? ACC.red : acc(col);
  const pop = phys(t, at, 8, 0.38), roll = phys(t, at + 0.18, 5.5, 0.62), draw = ei(t, at + 0.1, at + 0.9);
  const xo = eIn(t, out - 0.25, out + 0.2), xo2 = eIn(t, out + 0.05, out + 0.5);
  const open = cl(roll) * (1 - xo);
  return <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", fontFamily: FONT, color: G.txt, opacity: 1 - xo2 }}>
    <div style={{ position: "relative", zIndex: 2, flex: "none", width: 86, height: 86, borderRadius: 24, background: `linear-gradient(160deg, ${c}38, rgba(14,15,18,.95) 70%)`, border: `1px solid ${c}66`,
      boxShadow: `${G.shadow}, 0 0 ${24 * cl(pop)}px ${c}33`, display: "flex", alignItems: "center", justifyContent: "center",
      transform: `perspective(600px) scale(${Math.max(0, pop) * (1 - 0.3 * xo2)}) rotateY(${(1 - pop) * -50}deg)` }}>
      <Ico k={k} c={c} p={draw} t={t} n={n} />
    </div>
    <div style={{ marginLeft: -26, clipPath: `inset(-20px ${(1 - open) * 100}% -20px 0 round 0 40px 40px 0)` }}>
      <div style={{ background: G.panel, border: `1px solid ${G.line}`, borderLeft: "none", borderRadius: "0 40px 40px 0", boxShadow: G.shadow, padding: "20px 32px 20px 50px", whiteSpace: "nowrap",
        fontWeight: 800, fontSize: 36, letterSpacing: 1.5 }}>
        <span style={{ display: "inline-block", opacity: cl(roll * 1.3 - 0.2), transform: `translateX(${(1 - roll) * -30}px)` }}>{txt}</span>
      </div>
    </div>
  </div>;
};

// ---------- titular: letras macizas que caen de a una con peso (de izquierda a derecha), filete que se dibuja; se van hacia
// atrás en cascada. (La foto dentro de las letras se leía sucia: descartado 28-oct.) side: sobre el avatar, abajo a la izquierda y chico ----------
export const Headline: React.FC<{ t: number; at: number; out: number; text: string; y?: number; side?: boolean; img?: string }> = ({ t, at, out, text, y = 230, side }) => {
  if (t < at - 0.05 || t > out + 0.8) return null;
  const warn = /(NO|NUNCA|SIN|NADA)|¡/.test(text), c = warn ? ACC.red : COL.amber;
  const ch = [...text], N = ch.length, st = Math.min(0.035, 0.5 / N);
  const band = cl(phys(t, at, 5, 0.8)) * (1 - eIn(t, out, out + 0.6)), w = phys(t, at + 0.3 + N * st, 5, 0.6);
  const fs = side ? 64 : text.length > 18 ? 100 : 124;
  return <AbsoluteFill>
    {!side && <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(4,4,6,${0.8 * band}) 0%, rgba(4,4,6,${0.5 * band}) 40%, transparent 68%)` }} />}
    <div style={{ position: "absolute", left: side ? 60 : 0, right: side ? undefined : 0, top: side ? 830 : y, textAlign: side ? "left" : "center", fontFamily: FONT, perspective: 1200 }}>
      <div style={{ display: "inline-block", fontWeight: 900, fontSize: fs, lineHeight: 1, whiteSpace: "pre", color: G.txt, textShadow: "0 10px 34px rgba(0,0,0,.65)" }}>
        {ch.map((g, i) => {
          const s1 = phys(t, at + i * st, 7, 0.42), x = eIn(t, out - 0.1 + i * st * 0.6, out + 0.45 + i * st * 0.6);
          return <span key={i} style={{ display: "inline-block", opacity: cl(s1 * 2) * (1 - x), transform: `translateY(${(1 - s1) * -0.7 * fs}px) rotateX(${(1 - s1) * 70}deg) translateZ(${-x * 300}px)`, filter: x > 0.05 ? `blur(${x * 8}px)` : undefined }}>{g}</span>;
        })}
      </div>
      <div style={{ margin: side ? "14px 0 0" : "18px auto 0", height: 6, borderRadius: 3, width: `${cl(w) * (side ? 50 : 26)}%`, background: c, boxShadow: `0 0 22px ${c}`, opacity: 1 - eIn(t, out - 0.1, out + 0.4) }} />
    </div>
  </AbsoluteFill>;
};

// ---------- número grande = ODÓMETRO: cada cifra es un tambor que gira, da una vuelta y clava con resorte (de derecha a izquierda) ----------
export const BigNum: React.FC<{ t: number; at: number; out: number; text: string; sub?: string; col?: string; x?: number; y?: number }> = ({ t, at, out, text, sub, col, x = 1480, y = 500 }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const c = acc(col), k2 = ei(t, at + 0.6, at + 1.2);
  const size = text.length > 7 ? 140 : 190, H = Math.round(size * 1.08);
  const ch = [...text], N = ch.length;
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontFamily: FONT, textAlign: "center", whiteSpace: "nowrap" }}><div style={rise(t, at, out)}>
    <div style={{ position: "absolute", inset: "-80px -140px", background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,0,0,.6), transparent 72%)" }} />
    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "flex-end", height: H, fontWeight: 900, fontSize: size, lineHeight: `${H}px`, letterSpacing: -2, color: G.txt, textShadow: G.soft,
      WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 7%, #000 93%, transparent 100%)" } as React.CSSProperties}>
      {ch.map((g, i) => {
        const dl = at + 0.05 + (N - 1 - i) * 0.06;
        if (!/\d/.test(g)) { const p = phys(t, dl + 0.2, 7, 0.5); return <div key={i} style={{ opacity: cl(p * 1.5), transform: `translateY(${(1 - p) * H * 0.6}px)`, fontSize: /[°%gkmh/]/.test(g) ? size * 0.55 : size, color: /[°%]/.test(g) ? G.dim : G.txt, whiteSpace: "pre" }}>{g}</div>; }
        const dgt = +g, pos = phys(t, dl, 6.2 + 0.3 * i, 0.66) * (dgt + 10);
        return <div key={i} style={{ height: H, overflow: "hidden" }}>
          <div style={{ transform: `translateY(${-pos * H}px)` }}>{Array.from({ length: 21 }, (_, j) => <div key={j} style={{ height: H }}>{j % 10}</div>)}</div>
        </div>;
      })}
    </div>
    <div style={{ position: "relative", margin: "10px auto 14px", height: 5, width: 140 * k2, borderRadius: 3, background: c, boxShadow: `0 0 16px ${c}` }} />
    {sub && <div style={{ position: "relative", opacity: k2, transform: `translateY(${(1 - k2) * 12}px)`, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: G.dim }}>{sub}</div>}
  </div></div>;
};

// ---------- medidor de temperatura: arco que baja de a → b, lectura grande al centro ----------
export const TempGauge: React.FC<{ t: number; at: number; out: number; a: number; b: number; sub: string; col?: string; x?: number; y?: number }> = ({ t, at, out, a, b, sub, col, x = 1440, y = 520 }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const v = a + (b - a) * phys(t, at + 0.3, 3.2, 0.62), R = 190, SW = 22, SPAN = 270;
  const C = 2 * Math.PI * R, arc = (C * SPAN) / 360, f = Math.max(0, Math.min(1, v / 100));
  const hot = v > 60 ? "#ff6a3d" : v > 35 ? COL.amber : COL.ice, c = col === "red" && v < 60 ? COL.ice : hot;
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}><div style={rise(t, at, out)}>
    <Panel style={{ width: 520, padding: "34px 30px 30px", textAlign: "center" }}>
      <div style={{ position: "relative", width: 460, height: 400, margin: "0 auto" }}>
        <svg width={460} height={460} viewBox="-230 -230 460 460" style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${90 + (360 - SPAN) / 2}deg)` }}>
          <circle r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={SW} strokeLinecap="round" strokeDasharray={`${arc} ${C}`} />
          <circle r={R} fill="none" stroke={c} strokeWidth={SW} strokeLinecap="round" strokeDasharray={`${arc * f * cl(phys(t, at, 4, 0.7))} ${C}`} style={{ filter: `drop-shadow(0 0 12px ${c})` }} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -4 }}>{Math.round(v)}<span style={{ fontSize: 56, color: G.dim, letterSpacing: 0 }}>°C</span></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 290, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: G.dim }}>DESDE {a} °C</div>
      </div>
      <div style={{ marginTop: -6, fontWeight: 800, fontSize: 26, lineHeight: 1.3, letterSpacing: 2, color: G.txt }}>{sub}</div>
    </Panel>
  </div></div>;
};

// ---------- comparación = DUELO: dos tarjetas 9:16 con foto caen frente a frente; en el veredicto la ganadora avanza y brilla,
// la perdedora se apaga, se va hacia atrás y gira. Cámara en curva lenta; sale alejándose. ----------
type Col2 = { label: string; val: string; h: number; col: string; mark?: "ok" | "x" };
export const Versus: React.FC<{ t: number; at: number; out: number; L: Col2; R: Col2; title?: string; imgs?: (string | undefined)[] }> = ({ t, at, out, L, R, title, imgs = [] }) => {
  if (t < at - 0.05 || t > out + 0.9) return null;
  const inn = phys(t, at, 4, 0.7), xo = eIn(t, out - 0.1, out + 0.8), o = e(t, at, at + 0.3) * (1 - xo);
  if (o <= 0.01) return null;
  const verdict = phys(t, at + 1.7, 4.5, 0.45);
  const card = (cc: Col2, i: number) => {
    const s = phys(t, at + 0.2 + i * 0.35, 6, 0.4), land = 1 - s, sg = i ? 1 : -1, win = cc.mark === "ok";
    const v = win ? verdict : -verdict;
    const num = cc.val.match(/^[-+−]?\d+/), cnt = ei(t, at + 0.5 + i * 0.35, at + 1.6 + i * 0.35);
    const shown = num ? cc.val.replace(num[0], String(Math.round(+num[0].replace("−", "-") * cnt))) : cc.val;
    return <div key={i} style={{ position: "absolute", left: -210 + sg * 270, top: -373, width: 420, height: 746, opacity: cl(s * 2),
      transform: `translate3d(${land * sg * 300}px, ${Math.max(land, -0.04) * 700}px, ${Math.max(0, v) * 110 + Math.min(0, v) * 160}px) rotateY(${sg * -14 * (1 - Math.abs(v)) + Math.min(0, v) * sg * -22}deg) rotateZ(${land * sg * 16}deg) rotateX(${land * 30}deg)`,
      WebkitBoxReflect: "below 14px linear-gradient(transparent 76%, rgba(255,255,255,.18))" } as React.CSSProperties}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 26, overflow: "hidden", background: "#16171a",
        boxShadow: `0 50px 110px rgba(0,0,0,.65), 0 0 0 ${2 + 3 * Math.max(0, v)}px ${win && v > 0.3 ? cc.col : "rgba(255,255,255,.14)"}, 0 0 ${80 * Math.max(0, v)}px ${cc.col}55` }}>
        {imgs[i] && <Img src={img(imgs[i]!)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + 0.06 * e(t, at, out)})`, filter: `grayscale(${Math.max(0, -v)}) brightness(${1 - 0.45 * Math.max(0, -v)})` }} />}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,.5) 0%, transparent 26%, transparent 48%, rgba(0,0,0,.92) 100%)` }} />
        <div style={{ position: "absolute", left: 30, top: 28, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: G.txt }}>{cc.label}</div>
        <div style={{ position: "absolute", left: 28, bottom: 30, fontWeight: 900, fontSize: 104, lineHeight: 1, letterSpacing: -3, color: cc.col, textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>{shown}</div>
        {cc.mark && <div style={{ position: "absolute", right: 26, top: 22, width: 64, height: 64, borderRadius: 32, background: win ? "#2fbf71" : ACC.red, color: "#fff", fontWeight: 900, fontSize: 38, lineHeight: "64px", textAlign: "center",
          transform: `scale(${Math.max(0, phys(t, at + 1.75 + (win ? 0 : 0.15), 8, 0.4))})`, boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>{win ? "✓" : "✕"}</div>}
      </div>
    </div>;
  };
  const vs = phys(t, at + 0.9, 8, 0.4) * (1 - cl(verdict));
  return <AbsoluteFill style={{ opacity: o, fontFamily: FONT, color: G.txt }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 48%, #1e1a16, #08080a 65%)" }} />
    {title && <div style={{ position: "absolute", left: 0, right: 0, top: 60, display: "flex", justifyContent: "center", opacity: cl(phys(t, at + 0.3, 6, 0.7)), transform: `translateY(${(1 - cl(phys(t, at + 0.3, 6, 0.7))) * -20}px)` }}><Kicker txt={title} /></div>}
    <div style={{ position: "absolute", left: 960, top: 560, perspective: 1900 }}>
      <div style={{ transformStyle: "preserve-3d", transform: `translateZ(${-420 * (1 - inn) - 700 * xo + 30 * Math.sin((t - at) * 0.4)}px) rotateX(${5 + 6 * xo}deg) rotateY(${3.5 * Math.sin((t - at) * 0.25 + 0.4) + 12 * (1 - inn)}deg)` }}>
        {card(L, 0)}{card(R, 1)}
      </div>
    </div>
    <div style={{ position: "absolute", left: 960, top: 540, width: 110, height: 110, marginLeft: -55, marginTop: -55, borderRadius: 55, background: "#0d0d10", border: `2px solid ${G.line}`,
      fontWeight: 900, fontSize: 40, lineHeight: "106px", textAlign: "center", color: G.dim, transform: `scale(${Math.max(0, vs)})` }}>VS</div>
  </AbsoluteFill>;
};

// ---------- lista que se tilda: cada renglón cae con peso en su palabra, con la FOTO de lo que se nombra; sólo lo ya dicho ----------
export const CheckList: React.FC<{ t: number; title: string; rows: { at: number; txt: string }[]; out: number; x?: number; y?: number; imgs?: (string | undefined)[] }> = ({ t, title, rows, out, x = 1150, y = 150, imgs = [] }) => {
  const at = rows[0].at - 0.4; if (vis(t, at, out) <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, ...rise(t, at, out) }}>
    <Panel style={{ width: 680, padding: "28px 30px 18px" }}>
      <Kicker txt={title} />
      <div style={{ marginTop: 14, perspective: 900 }}>
        {rows.filter((r) => t >= r.at - 0.1).map((r, i) => {
          const s = phys(t, r.at - 0.1, 6.5, 0.42), d = ei(t, r.at + 0.2, r.at + 0.6), bad = r.txt.startsWith("✗"), c = bad ? ACC.red : "#2fbf71";
          return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 0", borderTop: i ? `1px solid ${G.line}` : undefined, opacity: cl(s * 1.6),
            transform: `translateY(${(1 - s) * -40}px) rotateX(${(1 - s) * -50}deg)`, transformOrigin: "50% 0" }}>
            <div style={{ flex: "none", width: 84, height: 84, borderRadius: 16, overflow: "hidden", background: "#222", boxShadow: "0 10px 24px rgba(0,0,0,.5)" }}>
              {imgs[i] && <Img src={img(imgs[i]!)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.25 - 0.15 * cl(s)})`, filter: bad ? "grayscale(.6)" : undefined }} />}
            </div>
            <div style={{ flex: 1, fontWeight: 800, fontSize: 32, color: bad ? "#ffb3aa" : G.txt }}>{r.txt.replace(/^✗\s*/, "")}</div>
            <svg width={40} height={40} viewBox="0 0 36 36" style={{ flex: "none", transform: `scale(${0.6 + 0.4 * phys(t, r.at + 0.2, 8, 0.4)})` }}>
              <circle cx={18} cy={18} r={16} fill={c} opacity={0.18 + 0.82 * d} />
              {bad ? <path d="M12 12 L24 24 M24 12 L12 24" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
                : <path d="M10 18.5 L16 24 L26 12.5" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={30} strokeDashoffset={30 * (1 - d)} />}
            </svg>
          </div>;
        })}
      </div>
    </Panel>
  </div>;
};

// ---------- barras de tiempo: cada fila cae con su FOTO; la barra crece con resorte (se pasa y vuelve) ----------
export const TimeBars: React.FC<{ t: number; rows: { at: number; label: string; val: string; frac: number; col?: string }[]; out: number; x?: number; y?: number; imgs?: (string | undefined)[] }> = ({ t, rows, out, x = 110, y = 150, imgs = [] }) => {
  const at = rows[0].at - 0.3; if (vis(t, at, out) <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, ...rise(t, at, out) }}>
    <Panel style={{ width: 1000, padding: "24px 34px 12px" }}>
      {rows.map((r, i) => {
        if (t < r.at - 0.1) return null;
        const s = phys(t, r.at - 0.1, 6.5, 0.45), g = phys(t, r.at + 0.15, 4.2, 0.5), c = r.col ?? COL.amber;
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, padding: "10px 0 14px", opacity: cl(s * 1.6), transform: `translateX(${(1 - s) * -60}px)` }}>
          <div style={{ flex: "none", width: 76, height: 76, borderRadius: 14, overflow: "hidden", background: "#222", boxShadow: "0 8px 20px rgba(0,0,0,.5)" }}>
            {imgs[i] && <Img src={img(imgs[i]!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: 2 }}>{r.label}</div>
              <div style={{ fontWeight: 900, fontSize: 40, color: c, opacity: e(t, r.at + 0.4, r.at + 0.8) }}>{r.val}</div>
            </div>
            <div style={{ marginTop: 8, height: 12, borderRadius: 6, background: "rgba(255,255,255,.07)" }}>
              <div style={{ height: "100%", width: `${r.frac * Math.max(0, g) * 100}%`, borderRadius: 6, background: `linear-gradient(90deg, ${c}aa, ${c})`, boxShadow: `0 0 16px ${c}66` }} />
            </div>
          </div>
        </div>;
      })}
    </Panel>
  </div>;
};

// ---------- reloj del día (arriba a la derecha) ----------
export const DayClock: React.FC<{ t: number; at: number; out: number; marks: [number, number][] }> = ({ t, at, out, marks }) => {
  if (vis(t, at, out) <= 0.01) return null;
  let h = marks[0][1];
  for (let i = 1; i < marks.length; i++) h += (marks[i][1] - marks[i - 1][1]) * cl(phys(t, marks[i][0], 3.5, 0.75));
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60), day = h >= 8 && h < 18.5;
  return <div style={{ position: "absolute", right: 96, top: 92, ...rise(t, at, out, 16) }}>
    <Panel style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 30px 16px 18px", borderRadius: 60 }}>
      <svg width={92} height={92} viewBox="-50 -50 100 100">
        <circle r={46} fill="#101114" stroke="rgba(255,255,255,.18)" strokeWidth={2} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-40} x2={0} y2={-34} stroke="rgba(255,255,255,.55)" strokeWidth={2.5} transform={`rotate(${i * 30})`} />)}
        <line x1={0} y1={4} x2={0} y2={-22} stroke="#fff" strokeWidth={5} strokeLinecap="round" transform={`rotate(${(h % 12) * 30})`} />
        <line x1={0} y1={6} x2={0} y2={-34} stroke={COL.amber} strokeWidth={3} strokeLinecap="round" transform={`rotate(${(h % 1) * 360})`} />
        <circle r={4} fill="#fff" />
      </svg>
      <div>
        <div style={{ fontWeight: 800, fontSize: 52, lineHeight: 1, letterSpacing: -1 }}>{String(hh).padStart(2, "0")}:{String(mm).padStart(2, "0")}</div>
        <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: 4, color: day ? COL.amber : COL.ice, marginTop: 6 }}>{day ? "DE DÍA" : "SALAMANDRA"}</div>
      </div>
    </Panel>
  </div>;
};

// ---------- error n (sólo sobre el avatar): abajo a la izquierda, el cuadro rojo cae con peso y de él sale la frase ----------
export const Mistake: React.FC<{ t: number; at: number; n: number; txt: string; out: number }> = ({ t, at, n, txt, out }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const p = phys(t, at, 8, 0.4), r = phys(t, at + 0.2, 5.5, 0.6);
  return <div style={{ position: "absolute", left: 96, bottom: 110, ...rise(t, at, out) }}>
    <Panel style={{ display: "flex", alignItems: "center", gap: 26, padding: "20px 38px 20px 20px", maxWidth: 980 }}>
      <div style={{ flex: "none", width: 96, height: 96, borderRadius: 18, background: "linear-gradient(180deg,#ff5a4a,#c62a1e)", fontWeight: 900, fontSize: 60, lineHeight: "96px", textAlign: "center", boxShadow: "0 0 30px rgba(255,90,74,.35)", transform: `scale(${Math.max(0, p)}) rotate(${(1 - p) * -20}deg)` }}>{n}</div>
      <div style={{ opacity: cl(r * 1.4), transform: `translateX(${(1 - r) * -24}px)` }}>
        <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 6, color: ACC.red }}>ERROR</div>
        <div style={{ fontWeight: 800, fontSize: 42, lineHeight: 1.12, marginTop: 4 }}>{txt}</div>
      </div>
    </Panel>
  </div>;
};

// ---------- pregunta para los comentarios ----------
export const AskCard: React.FC<{ t: number; at: number; out: number; q: [string, string, string]; side?: boolean }> = ({ t, at, out, q, side }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const r = phys(t, at + 0.5, 6, 0.6);
  return <div style={{ position: "absolute", left: side ? 70 : 960, top: side ? 820 : 300, transform: side ? "translateY(-50%) scale(.66)" : "translate(-50%,-50%)", transformOrigin: "0 50%" }}>
    <div style={rise(t, at, out)}>
      <Panel style={{ width: 1060, padding: "30px 44px 34px" }}>
        <Kicker txt={q[0]} w={ei(t, at, at + 0.6)} />
        <div style={{ fontWeight: 800, fontSize: 54, lineHeight: 1.15, marginTop: 14 }}>{q[1]}</div>
        <div style={{ fontWeight: 600, fontSize: 36, color: COL.amber, marginTop: 8, opacity: cl(r * 1.4), transform: `translateY(${(1 - r) * 18}px)` }}>{q[2]}</div>
      </Panel>
    </div>
  </div>;
};

// ---------- PUNTO n = capítulo: el número cae con peso a la izquierda y la FOTO del punto entra girando como una placa 3D
// a la derecha (con reflejo); sale alejándose. Sobre el avatar (sc<1) va compacto, sin placa. ----------
export const StepTitle: React.FC<{ t: number; at: number; n: number; name: string; out: number; col?: string; x?: number; y?: number; sc?: number; img?: string }> = ({ t, at, n, name, out, col, x = 960, y = 520, sc = 1, img: im }) => {
  if (t < at - 0.05 || t > out + 0.6) return null;
  const c = acc(col), plate = !!im && sc === 1;
  const s = phys(t, at, 6, 0.42), k2 = phys(t, at + 0.3, 5.5, 0.6), ps = phys(t, at + 0.15, 3.6, 0.5), xo = eIn(t, out - 0.05, out + 0.55);
  const o = e(t, at, at + 0.25) * (1 - xo);
  const tx = plate ? 540 : x;
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ background: plate ? `radial-gradient(ellipse 80% 80% at 50% 50%, rgba(10,10,12,${0.75 * cl(s)}), rgba(4,4,6,${0.9 * cl(s)}))` : `radial-gradient(ellipse 45% 50% at ${(x / 1920) * 100}% ${(y / 1080) * 100}%, rgba(0,0,0,.6), transparent 78%)` }} />
    {plate && <div style={{ position: "absolute", left: 1370, top: 520, perspective: 1700 }}>
      <div style={{ position: "absolute", left: -370, top: -208, width: 740, height: 416, borderRadius: 18, overflow: "hidden",
        transform: `translateZ(${(1 - ps) * -500 - xo * 400}px) rotateY(${(1 - ps) * -75 - 14 + 4 * Math.sin((t - at) * 0.5)}deg) rotateX(${3 + xo * 8}deg)`,
        boxShadow: `0 60px 120px rgba(0,0,0,.7), 0 0 0 2px ${c}55`, WebkitBoxReflect: "below 12px linear-gradient(transparent 80%, rgba(255,255,255,.16))" } as React.CSSProperties}>
        <Img src={img(im!)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.15 - 0.08 * e(t, at, out)})` }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-40 + 170 * ei(t, at + 0.4, at + 1.4)}%`, width: "26%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,.18), transparent)" }} />
      </div>
    </div>}
    <div style={{ position: "absolute", left: tx, top: y, transform: `translate(-50%,-50%) scale(${sc}) perspective(1400px) translateZ(${-xo * 300}px)`, textAlign: "center", fontFamily: FONT, color: G.txt, whiteSpace: "nowrap" }}>
      <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: 18 * cl(k2) + 4, color: G.dim, opacity: cl(k2), marginRight: -18 }}>PUNTO</div>
      <div style={{ overflow: "hidden", paddingTop: 10 }}>
        <div style={{ transform: `translateY(${(1 - s) * 100}%) rotateX(${(1 - s) * 40}deg)`, fontWeight: 900, fontSize: 250, lineHeight: 1.05, letterSpacing: -6, color: c, textShadow: `0 0 60px ${c}44` }}>{n}</div>
      </div>
      <div style={{ margin: "4px auto 18px", height: 4, width: 160 * cl(k2), borderRadius: 2, background: c }} />
      <div style={{ fontWeight: 800, fontSize: plate && name.length > 14 ? 50 : 64, letterSpacing: 4, opacity: cl(k2 * 1.3), transform: `translateY(${(1 - k2) * 22}px)`, textShadow: G.soft }}>{name}</div>
    </div>
  </AbsoluteFill>;
};

// ---------- palabras que caen de a una con peso, cada una en su palabra ----------
export const Words: React.FC<{ t: number; items: { at: number; txt: string; col?: string }[]; out: number; y?: number; size?: number }> = ({ t, items, out, y = 200, size = 96 }) => {
  if (t < items[0].at - 0.05 || t > out + 0.6) return null;
  const xo = eIn(t, out - 0.05, out + 0.5);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 56, opacity: 1 - xo, fontFamily: FONT, perspective: 1200 }}>
    {items.map((w, i) => {
      const s = phys(t, w.at, 6.5, 0.4);
      return <div key={i} style={{ fontWeight: 900, fontSize: size, letterSpacing: 1, color: w.col ?? G.txt, textShadow: G.soft, opacity: cl(s * 1.8),
        transform: `translateY(${(1 - s) * -90 - xo * 20}px) rotateX(${(1 - s) * 60}deg) scale(${1 - xo * 0.06})`, whiteSpace: "nowrap" }}>{w.txt}</div>;
    })}
  </div>;
};

// ---------- CTA: la página real del manual + QR chico pegado (sin chips de más) ----------
export const GuidePage: React.FC<{ t: number; at: number; out: number; img: string; tag: string }> = ({ t, at, out, img, tag }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const k = phys(t, at, 4.2, 0.5), z = 1 + 0.04 * e(t, at, out), q = cl(phys(t, at + 1.0, 6, 0.6));
  return <AbsoluteFill style={{ opacity: vis(t, at, out) }}>
    <AbsoluteFill style={{ background: "rgba(5,5,6,.82)" }} />
    <div style={{ position: "absolute", left: 1180, top: 545, perspective: 1800 }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - k) * -400}px) translateY(${(1 - k) * 80}px) rotateY(${-10 - 40 * (1 - k) + 4 * cl(k)}deg) rotateX(3deg) scale(${z})`, width: 660, borderRadius: 10, overflow: "hidden", boxShadow: "0 60px 120px rgba(0,0,0,.75)" }}>
        <Img src={staticFile(P + img + ".jpg")} style={{ width: "100%", display: "block" }} />
        <div style={{ position: "absolute", left: "7%", right: "6%", top: "7.6%", height: "4.8%", background: "rgba(255,200,60,.35)", borderRadius: 6, transformOrigin: "0 50%", transform: `scaleX(${e(t, at + 0.8, at + 1.4)})` }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 470, top: 545, transform: `translate(-50%,-50%) translateY(${(1 - q) * 30}px)`, opacity: q, textAlign: "center", fontFamily: FONT, color: G.txt }}>
      <Kicker txt={tag} />
      <div style={{ margin: "22px auto 0", width: 300, padding: 18, borderRadius: 22, background: "#fff", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
        <Img src={staticFile(P + "qr.png")} style={{ width: 264, height: 264, imageRendering: "pixelated", display: "block" }} />
      </div>
      <div style={{ marginTop: 18, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: G.dim }}>ESCANEA CON LA CÁMARA</div>
    </div>
  </AbsoluteFill>;
};

// ---------- la descripción del video: renglón 1 iluminado (nunca URL; sólo el nombre de la guía) ----------
export const Desc: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; scale?: number }> = ({ t, at, out, x = 960, y = 640, scale = 0.8 }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const hl = ei(t, at + 0.6, at + 1.1), sweep = e(t, at + 0.7, at + 1.7);
  const L = (w: number) => <div style={{ height: 14, width: w, borderRadius: 7, background: "rgba(255,255,255,.12)", marginTop: 18 }} />;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${scale})` }}>
    <div style={rise(t, at, out)}>
      <div style={{ marginBottom: 16, fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: COL.amber, opacity: hl }}>1ª LÍNEA DE LA DESCRIPCIÓN ↓</div>
      <Panel style={{ width: 1180, padding: "30px 40px 36px" }}>
        <div style={{ position: "relative", padding: "16px 22px", borderRadius: 14, background: `rgba(255,200,60,${0.14 * hl})`, boxShadow: `0 0 0 2px rgba(255,200,60,${0.85 * hl})`, overflow: "hidden" }}>
          <div style={{ fontWeight: 800, fontSize: 40 }}>🔥 El Invierno Sin Gas · mis 5 manuales, paso a paso</div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "22%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(940)}{L(1010)}{L(720)}
      </Panel>
    </div>
  </div>;
};

// ---------- CARRUSEL 3D de tarjetas 9:16 con foto (los 5 errores, el repaso). Movimiento (28-oct, «nada brusco, con peso, cámara curva, todo fundido»):
// ENTRADA = la escena se tiñe desde el centro como tinta (iris radial suave) y la cámara llega desde lejos girando, con resorte.
// Cada tarjeta entra SOLA en su palabra: cae desde abajo con giro y masa, se pasa y asienta; el carrusel se desliza con resorte.
// Cámara viva en curvas (órbita lenta + empujón suave en cada llegada). SALIDA = la cámara se aleja acelerando y el iris se cierra. ----------
export type Card = { img?: string; at: number; n: number | string; title: string };
export const CoverFlow: React.FC<{ t: number; at: number; out: number; cards: Card[]; kicker: string; title: string; col?: string; hide?: boolean }> = ({ t, at, out, cards, kicker, title, col, hide }) => {
  if (hide || !cards.length || t < at - 0.1 || t > out + 1.2) return null;
  const c = acc(col), N = cards.length;
  const inn = phys(t, at, 3.6, 0.7), xo = eIn(t, out - 0.2, out + 1.1);
  const iris = cl(inn) * (1 - xo);
  if (iris <= 0.005) return null;
  // índice activo: cada llegada desliza el carrusel con resorte (se pasa un poco y vuelve)
  let act = 0; for (let i = 1; i < N; i++) act += phys(t, cards[i].at - 0.25, 6.2, 0.5);
  // empujón de cámara en cada llegada: sube y baja en curva (seno amortiguado), nunca lineal
  let push = 0; for (let i = 0; i < N; i++) { const x = t - (cards[i].at - 0.25); if (x > 0) push += Math.sin(Math.min(x, 1.6) / 1.6 * Math.PI) * Math.exp(-x * 0.6); }
  const camZ = -520 * (1 - inn) + 40 * push + 26 * Math.sin((t - at) * 0.21) - 900 * xo;
  const camRY = 16 * (1 - inn) + 4.2 * Math.sin((t - at) * 0.17 + 0.6) - 10 * xo;
  const camRX = 6 + 1.6 * Math.sin((t - at) * 0.13) + 8 * xo;
  const camY = 10 * Math.sin((t - at) * 0.11 + 1.2);
  const R = iris * 1500;
  const mask = `radial-gradient(circle at 50% 52%, #000 ${R}px, transparent ${R + 520}px)`;
  const hdr = cl(phys(t, at + 0.35, 6, 0.7)) * (1 - eIn(t, out - 0.4, out + 0.4));
  return <AbsoluteFill style={{ opacity: cl(iris * 2.2), fontFamily: FONT, color: G.txt, WebkitMaskImage: mask, maskImage: mask } as React.CSSProperties}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 60% at 50% 46%, ${c}22, #0b0b0d 62%), #0b0b0d` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 220, background: "linear-gradient(180deg, rgba(255,255,255,.04), transparent)" }} />
    <div style={{ position: "absolute", left: 110, top: 86, opacity: hdr, transform: `translateX(${(1 - hdr) * -40}px)` }}>
      <Kicker txt={kicker} col={c} w={hdr} />
      <div style={{ fontWeight: 800, fontSize: 58, marginTop: 6, opacity: cl(hdr * 1.5), clipPath: `inset(0 ${(1 - cl(hdr)) * 100}% 0 0)` }}>{title}</div>
    </div>
    {/* contador: el número nuevo cae desde arriba con resorte y empuja al anterior hacia abajo */}
    <div style={{ position: "absolute", right: 110, top: 96, fontWeight: 800, fontSize: 64, letterSpacing: -1, opacity: cl(phys(t, cards[0].at - 0.3, 6, 0.7)) * (1 - xo), display: "flex", alignItems: "baseline" }}>
      <div style={{ height: 78, overflow: "hidden", position: "relative", width: 52 }}>
        {cards.map((cd, i) => { const p = phys(t, cd.at - 0.25, 7, 0.55), q = i + 1 < N ? phys(t, cards[i + 1].at - 0.25, 7, 0.55) : 0;
          if (p <= 0.01 || q >= 0.99) return null;
          return <div key={i} style={{ position: "absolute", right: 0, top: 0, color: c, transform: `translateY(${(1 - p) * -80 + q * 80}px)` }}>{i + 1}</div>; })}
      </div>
      <span style={{ color: G.dim, fontSize: 40 }}>&nbsp;/ {N}</span>
    </div>
    <div style={{ position: "absolute", left: 960 - 330, top: 170, width: 660, height: 780, opacity: 0.6 + 0.4 * cl(push), background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${c}33, transparent 70%)` }} />
    <div style={{ position: "absolute", left: 960, top: 560 + camY, perspective: 1900 }}>
      <div style={{ transformStyle: "preserve-3d", transform: `translateZ(${camZ}px) rotateX(${camRX}deg) rotateY(${camRY}deg)` }}>
        {cards.map((cd, i) => {
          // cada tarjeta entra en SU palabra (la 1ª con el carrusel): cae con masa desde abajo-derecha, girada, y asienta
          const s = phys(t, i === 0 ? Math.min(at + 0.45, cd.at - 0.6) : cd.at - 0.6, 6.4, 0.38);
          if (s <= 0.002) return null;
          const d = i - act, ad = Math.abs(d), sg = Math.sign(d);
          const x = sg * (Math.min(ad, 1) * 360 + Math.max(ad - 1, 0) * 210);
          const z = -Math.min(ad, 3) * 230, ry = -Math.max(-1, Math.min(1, d)) * 50;
          // salida escalonada: las de los costados se van primero, hacia atrás
          const xi = eIn(t, out - 0.3 + ad * 0.08, out + 0.8 + ad * 0.08);
          const op = (ad < 3.4 ? 1 - Math.max(0, ad - 2.4) : 0) * cl(s * 2.2) * (1 - xi);
          if (op <= 0.01) return null;
          const front = Math.max(0, 1 - ad), land = 1 - s; // lo que le falta para apoyarse (negativo = se pasó)
          return <div key={i} style={{ position: "absolute", left: -180, top: -320, width: 360, height: 640, opacity: op, zIndex: 100 - Math.round(ad * 10),
            transform: `translate3d(${x + land * 260}px, ${Math.max(land, -0.04) * 760}px, ${z - xi * 500}px) rotateY(${ry - land * 30}deg) rotateX(${land * 40}deg) rotateZ(${land * 14}deg) scale(${0.9 + 0.2 * front})`,
            WebkitBoxReflect: "below 14px linear-gradient(transparent 74%, rgba(255,255,255,.2))" } as React.CSSProperties}>
            <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 24, overflow: "hidden", background: "#16171a",
              boxShadow: `0 ${40 + Math.abs(land) * 60}px ${90 + Math.abs(land) * 80}px rgba(0,0,0,${0.6 - Math.min(0.3, Math.abs(land) * 0.3)}), 0 0 0 ${2 + 2 * front}px ${front > 0.5 ? c : "rgba(255,255,255,.12)"}` }}>
              {cd.img && <Img src={staticFile("img/" + P + cd.img + ".jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 + 0.06 * front * ei(t, cd.at, cd.at + 6)})` }} />}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.35) 0%, transparent 28%, transparent 46%, rgba(0,0,0,.92) 100%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "#000", opacity: Math.min(1, ad) * 0.5 }} />
              <div style={{ position: "absolute", left: 26, top: 22, fontWeight: 800, fontSize: 104, lineHeight: 1, color: c, textShadow: "0 6px 24px rgba(0,0,0,.6)" }}>{cd.n}</div>
              <div style={{ position: "absolute", left: 26, right: 24, bottom: 30, fontWeight: 800, fontSize: 31, lineHeight: 1.18, opacity: front * front * cl((s - 0.6) * 2.5), transform: `translateY(${(1 - front) * 16}px)` }}>{cd.title}</div>
              {/* barrido de luz al apoyarse */}
              {s > 0.5 && t < cd.at + 1.4 && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-40 + 160 * ei(t, cd.at - 0.1, cd.at + 1.2)}%`, width: "30%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,.2), transparent)" }} />}
            </div>
          </div>;
        })}
      </div>
    </div>
  </AbsoluteFill>;
};
