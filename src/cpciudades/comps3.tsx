// comps3.tsx — componentes "nivel 2" de los documentales: el dato vive DENTRO del mundo (escarcha, brasas),
// nunca un número suelto sobre negro. Todo por código: SVG + canvas determinístico (rnd), sin IA ni filtros de imagen.
import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { continueRender, delayRender } from "remotion";
import { SANS, ROMAN, MONO, EMBER, EMBER2, ICE, W, H, k01, lerp, ease, easeOut, easeIn, rnd, shadow } from "./lib";

// ---------- escarcha que trepa desde los bordes del cuadro (dendritas) ----------
type Seg = { x0: number; y0: number; x1: number; y1: number; w: number; d: number };
const frostSegs = (seed: number, n: number) => {
  // helecho de escarcha: tallo casi recto con púas a ±60° en cada nudo y, a veces, un sub-tallo (como en un vidrio helado)
  const out: Seg[] = [];
  const stem = (x: number, y: number, ang: number, nodes: number, step: number, w: number, d0: number, k: number, lvl: number) => {
    for (let j = 0; j < nodes; j++) {
      const a2 = ang + (rnd(k * 31 + j, seed) - 0.5) * 0.18;
      const x1 = x + Math.cos(a2) * step, y1 = y + Math.sin(a2) * step, d = d0 + j * 0.55;
      out.push({ x0: x, y0: y, x1, y1, w, d });
      const sp = step * (1.25 - j / nodes) * (0.7 + 0.5 * rnd(k * 7 + j, seed + 1));
      for (const sg of [1, -1]) {
        const as = a2 + sg * 1.05;
        out.push({ x0: x1, y0: y1, x1: x1 + Math.cos(as) * sp, y1: y1 + Math.sin(as) * sp, w: w * 0.55, d: d + 0.3 });
        if (lvl < 1 && rnd(k * 13 + j * 2 + (sg > 0 ? 1 : 0), seed + 2) > 0.82)
          stem(x1, y1, as, Math.max(3, Math.round((nodes - j) * 0.55)), step * 0.6, w * 0.6, d + 0.3, k * 5 + j + (sg > 0 ? 1 : 2), lvl + 1);
      }
      x = x1; y = y1; ang = a2;
    }
  };
  for (let i = 0; i < n; i++) {
    const side = i % 4, u = rnd(i, seed + 9);
    const [x, y, a] = side === 0 ? [u * W, -4, Math.PI / 2] : side === 1 ? [W + 4, u * H, Math.PI] : side === 2 ? [u * W, H + 4, -Math.PI / 2] : [-4, u * H, 0];
    const corner = Math.min(u, 1 - u) < 0.2 ? 1.6 : 1;   // en las esquinas crece más
    stem(x, y, a + (rnd(i, seed + 4) - 0.5) * 1.1, Math.round((6 + rnd(i, seed + 5) * 8) * corner), 15 + rnd(i, seed + 6) * 8, 2.2, 0, i + 1, 0);
  }
  return out;
};
export const FrostCreep: React.FC<{ t: number; a: number; b: number; seed?: number; reach?: number; children?: React.ReactNode }> = ({ t, a, b, seed = 3, reach = 1, children }) => {
  const segs = useMemo(() => frostSegs(seed, 150), [seed]);
  if (t < a - 0.01 || t > b + 0.6) return null;
  const g = easeOut(k01(t, a, a + 1.8)) * reach * 9, melt = k01(t, b, b + 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - melt }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs><filter id="frGlow"><feGaussianBlur stdDeviation="2.2" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <g filter="url(#frGlow)" strokeLinecap="round">
          {segs.map((s, i) => {
            const p = Math.min(1, Math.max(0, g - s.d)); if (p <= 0) return null;
            const x2 = lerp(s.x0, s.x1, p), y2 = lerp(s.y0, s.y1, p), w = Math.max(0.8, s.w);
            return <g key={i}>
              <line x1={s.x0} y1={s.y0} x2={x2} y2={y2} stroke="#2a5f86" strokeOpacity={0.22} strokeWidth={w + 2} />
              <line x1={s.x0} y1={s.y0} x2={x2} y2={y2} stroke={s.d < 3 ? "#ffffff" : "#d8f0ff"} strokeOpacity={0.7 + 0.3 * rnd(i, 7)} strokeWidth={w} />
            </g>;
          })}
        </g>
      </svg>
      {children}
    </div>
  );
};
// texto RAYADO en la escarcha: se revela por trazos, con un destello de luz que lo recorre
export const IceEtch: React.FC<{ t: number; a: number; b: number; x: number; y: number; text: string; kicker?: string; size?: number; tally?: { at: number; n: number; label: string } }> = ({ t, a, b, x, y, text, kicker, size = 210, tally }) => {
  if (t < a || t > b + 0.5) return null;
  const rev = ease(k01(t, a + 0.15, a + 0.85)), glint = k01(t, a + 0.7, a + 1.5), o = 1 - k01(t, b, b + 0.5);
  const id = "ie" + Math.round(a * 100);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      {kicker && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: 14, color: "#ffffff", textShadow: `0 0 20px rgba(10,35,60,.9), ${shadow}`, opacity: k01(t, a, a + 0.3) }}>{kicker}</div>}
      <svg width={size * text.length * 0.62 + 40} height={size * 1.12} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={id + "g"} x1="0" x2="1" y1="0" y2="0.3">
            <stop offset="0" stopColor="#bfe6ff" /><stop offset={Math.max(0, glint - 0.08)} stopColor="#bfe6ff" />
            <stop offset={glint} stopColor="#ffffff" /><stop offset={Math.min(1, glint + 0.08)} stopColor="#bfe6ff" /><stop offset="1" stopColor="#9fd0f0" />
          </linearGradient>
          <clipPath id={id + "c"}><rect x={0} y={0} width={(size * text.length * 0.62 + 40) * rev} height={size * 1.2} /></clipPath>
        </defs>
        <g clipPath={`url(#${id}c)`}>
          <text x={0} y={size * 0.9} fontFamily={SANS} fontWeight={800} fontSize={size} letterSpacing={-4} fill={`url(#${id}g)`} stroke="#ffffff" strokeOpacity={0.85} strokeWidth={2}
            style={{ filter: "drop-shadow(0 0 3px rgba(8,30,55,.95)) drop-shadow(0 0 26px rgba(10,40,70,.8)) drop-shadow(0 0 18px rgba(159,216,255,.6))" }}>{text}</text>
        </g>
        {/* chispa de hielo en la punta del trazo */}
        {rev > 0 && rev < 1 && <circle cx={(size * text.length * 0.62 + 40) * rev} cy={size * 0.55} r={9} fill="#fff" style={{ filter: "drop-shadow(0 0 14px #bfe6ff)" }} />}
      </svg>
      {tally && t >= tally.at && (() => {
        const n = tally.n, step = 0.16;
        return <div style={{ marginTop: 8 }}>
          <svg width={60 * n + 60} height={130}>
            {Array.from({ length: n }, (_, i) => {
              const p = easeOut(k01(t, tally.at + i * step, tally.at + i * step + 0.14)); if (p <= 0) return null;
              const cross = i === 4, gx = (i > 4 ? i + 0.8 : i) * 46 + 10;
              const [x0, y0, x1, y1] = cross ? [-2, 96, 4 * 46 + 26, 22] : [gx, 110, gx + 6, 14];
              return <line key={i} x1={x0} y1={y0} x2={lerp(x0, x1, p)} y2={lerp(y0, y1, p)} stroke="#f4fbff" strokeWidth={cross ? 10 : 13} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 3px rgba(8,30,55,.95)) drop-shadow(0 0 14px rgba(10,40,70,.7))" }} />;
            })}
          </svg>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, letterSpacing: 8, whiteSpace: "nowrap", color: "#ffffff", textShadow: `0 0 20px rgba(10,35,60,.95), ${shadow}`, opacity: k01(t, tally.at + n * step, tally.at + n * step + 0.3) }}>{tally.label}</div>
        </div>;
      })()}
    </div>
  );
};

// ---------- número hecho de BRASAS: suben del fuego y se juntan en la cifra; al salir se vuelan como chispas ----------
const useFont = (font: string) => {
  const [h] = useState(() => delayRender("font " + font));
  const [ok, setOk] = useState(false);
  useEffect(() => { document.fonts.load(font).then(() => { setOk(true); continueRender(h); }, () => { setOk(true); continueRender(h); }); }, [font]);
  return ok;
};
const samplePts = (text: string, font: string, step: number) => {
  const c = document.createElement("canvas"); c.width = W; c.height = 420; const g = c.getContext("2d")!;
  g.font = font; g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, W / 2, 210);
  const d = g.getImageData(0, 0, W, 420).data, pts: [number, number][] = [];
  for (let y = 0; y < 420; y += step) for (let x = 0; x < W; x += step) if (d[(y * W + x) * 4 + 3] > 128) pts.push([x, y - 210]);
  return pts;
};
export const EmberForm: React.FC<{ t: number; a: number; b: number; text: string; y?: number; size?: number; kicker?: string; unit?: string; step?: number; from?: "bottom" | "left" }> =
  ({ t, a, b, text, y = 470, size = 300, kicker, unit, step = 6, from = "bottom" }) => {
    const font = `800 ${size}px ${ROMAN}`;
    const ok = useFont(font);
    const pts = useMemo(() => (ok ? samplePts(text, font, step) : []), [ok, text, font, step]);
    const ref = useRef<HTMLCanvasElement>(null);
    const on = t >= a - 0.05 && t <= b + 0.9;
    useLayoutEffect(() => {
      const c = ref.current; if (!c) return; const g = c.getContext("2d")!; g.clearRect(0, 0, W, H);
      if (!on) return;
      g.globalCompositeOperation = "lighter";
      for (let i = 0; i < pts.length; i++) {
        const [tx, ty] = pts[i], r1 = rnd(i, 1), r2 = rnd(i, 2), r3 = rnd(i, 3);
        const d0 = a + r1 * 0.55 + (tx / W) * 0.25, d1 = d0 + 0.75 + r2 * 0.35;
        const p = easeOut(k01(t, d0, d1)); if (p <= 0) continue;
        const sx = from === "bottom" ? tx + (r2 - 0.5) * 1100 : -60 - r2 * 400, sy = from === "bottom" ? H + 40 + r3 * 260 : y + ty + (r3 - 0.5) * 700;
        const wob = Math.sin(t * 7 + i) * 26 * (1 - p);
        // salida: se desprenden hacia arriba como chispas
        const out = easeIn(k01(t, b - 0.1 + r3 * 0.5, b + 0.8 + r3 * 0.3));
        const x = lerp(sx, tx, p) + wob + out * (r1 - 0.5) * 160, yy = lerp(sy, y + ty, p) - out * (180 + r2 * 320);
        const fl = 0.65 + 0.35 * Math.sin(t * (9 + r1 * 8) + i * 1.7);
        const al = (p < 1 ? 0.55 + 0.45 * p : fl) * (1 - out);
        const rad = 1.6 + r3 * 1.6 + (1 - p) * 1.2;
        g.fillStyle = `rgba(255,${Math.round(120 + 90 * fl)},${Math.round(40 + 60 * fl * p)},${(al * 0.28).toFixed(3)})`;
        g.beginPath(); g.arc(x, yy, rad * 3.2, 0, 6.283); g.fill();
        g.fillStyle = `rgba(255,${Math.round(210 + 40 * fl)},${Math.round(150 + 80 * fl)},${al.toFixed(3)})`;
        g.beginPath(); g.arc(x, yy, rad, 0, 6.283); g.fill();
      }
    }, [t, pts, on]);
    const ko = k01(t, a, a + 0.35) * (1 - k01(t, b - 0.2, b + 0.3));
    const uo = k01(t, a + 1.0, a + 1.3) * (1 - k01(t, b - 0.2, b + 0.3));
    return (
      <div style={{ position: "absolute", inset: 0, display: on ? "block" : "none" }}>
        <div style={{ position: "absolute", left: W / 2 - size * 2.6, top: y - size * 1.2, width: size * 5.2, height: size * 2.4, borderRadius: "50%", opacity: 0.85 * ko,
          background: "radial-gradient(ellipse at 50% 50%, rgba(14,7,4,.82) 0%, rgba(14,7,4,.55) 40%, rgba(14,7,4,0) 70%)" }} />
        <canvas ref={ref} width={W} height={H} style={{ position: "absolute", inset: 0 }} />
        {kicker && <div style={{ position: "absolute", left: 0, right: 0, top: y - size * 0.72, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 16, color: "#fff", textShadow: shadow, opacity: ko }}>{kicker}</div>}
        {unit && <div style={{ position: "absolute", left: 0, right: 0, top: y + size * 0.45, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 70, letterSpacing: 18, color: "#fff", textShadow: `0 0 34px rgba(255,138,43,.9), ${shadow}`, opacity: uo, transform: `translateY(${(1 - easeOut(k01(t, a + 1.0, a + 1.5))) * 24}px)` }}>{unit}</div>}
      </div>
    );
  };

// ---------- rollo de papiro que se desenrolla (De Architectura): columnas de escritura + croquis de pilae ----------
export const Scroll: React.FC<{ t: number; a: number; b: number; title: string; sub?: string; books?: { at: number; n: number; hi?: number } }> = ({ t, a, b, title, sub, books }) => {
  if (t < a || t > b) return null;
  const u = ease(k01(t, a, a + 1.3)), wMax = 1300, w = 80 + (wMax - 80) * u, h = 560, x0 = W / 2 - w / 2, y0 = 210;
  const o = k01(t, a, a + 0.2) * (1 - k01(t, b - 0.25, b));
  const roller = (x: number) => <div style={{ position: "absolute", left: x - 26, top: y0 - 30, width: 52, height: h + 60, borderRadius: 26,
    background: "linear-gradient(90deg,#5a3a1c,#c79a5e 35%,#f1d39a 50%,#b07d42 70%,#4a2e14)", boxShadow: "0 18px 40px rgba(0,0,0,.6)" }} />;
  const cols = 4, cw = (wMax - 160) / cols;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: x0, top: y0, width: w, height: h, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.55)",
        background: "repeating-linear-gradient(90deg, rgba(120,80,30,.06) 0 3px, rgba(255,240,200,.05) 3px 7px), repeating-linear-gradient(0deg, rgba(120,80,30,.05) 0 2px, transparent 2px 9px), linear-gradient(180deg,#e9d3a2,#dcbf86 60%,#d2b175)" }}>
        <div style={{ position: "absolute", left: (w - wMax) / 2, top: 0, width: wMax, height: h }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 34, textAlign: "center", fontFamily: ROMAN, fontWeight: 800, fontSize: 52, letterSpacing: 10, color: "#3b2210" }}>{title}</div>
          {sub && <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center", fontFamily: ROMAN, fontWeight: 600, fontSize: 28, letterSpacing: 8, color: "#6b4220" }}>{sub}</div>}
          <svg width={wMax} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
            {Array.from({ length: cols }, (_, c) => Array.from({ length: 13 }, (_, r) => {
              const x = 80 + c * cw + 14, y = 170 + r * 28, wl = cw - 40 - rnd(c * 20 + r, 3) * 70;
              if (c === 2 && r > 3 && r < 11) return null;   // hueco para el croquis
              const k = k01(t, a + 0.8 + c * 0.25 + r * 0.03, a + 1.1 + c * 0.25 + r * 0.03);
              const pts = Array.from({ length: 24 }, (_, i) => `${x + (i / 23) * wl * k},${y + Math.sin(i * 2.3 + r + c) * 2.2}`).join(" ");
              return <polyline key={c * 99 + r} points={pts} fill="none" stroke="#2a1a0c" strokeOpacity={0.62} strokeWidth={3} strokeLinecap="round" strokeDasharray="9 5 14 4" />;
            }))}
            {(() => {   // croquis: piso inclinado + pilae + tejas
              const cx = 80 + 2 * cw + 20, cy = 300, k = k01(t, a + 1.4, a + 2.4);
              return <g stroke="#3b2210" strokeWidth={3} fill="none" opacity={k}>
                <line x1={cx} y1={cy + 140} x2={cx + cw - 50} y2={cy + 125} />
                {Array.from({ length: 6 }, (_, i) => { const px = cx + 16 + i * ((cw - 80) / 5); const ph = 70 * k01(k, i * 0.1, i * 0.1 + 0.4); return <rect key={i} x={px} y={cy + 138 - i * 2.5 - ph} width={16} height={ph} />; })}
                <line x1={cx - 6} y1={cy + 60} x2={cx + cw - 44} y2={cy + 45} strokeWidth={5} opacity={k01(k, 0.7, 1)} />
              </g>;
            })()}
          </svg>
        </div>
      </div>
      {roller(x0)}{roller(x0 + w)}
      {books && t >= books.at && <div style={{ position: "absolute", left: 0, right: 0, top: y0 + h + 60, display: "flex", justifyContent: "center", gap: 18 }}>
        {Array.from({ length: books.n }, (_, i) => {
          const k = easeOut(k01(t, books.at + i * 0.09, books.at + i * 0.09 + 0.3)), hi = books.hi === i + 1 && t > books.at + books.n * 0.09 + 0.3;
          return <div key={i} style={{ width: 74, height: 74, borderRadius: 37, transform: `translateY(${(1 - k) * 60}px)`, opacity: k,
            background: "radial-gradient(circle at 50% 50%, #3b2210 0 14%, #e3c78f 15% 55%, #a9773f 56% 64%, #e9d3a2 65%)", boxShadow: hi ? `0 0 0 5px ${EMBER}, 0 0 34px ${EMBER}` : "0 8px 18px rgba(0,0,0,.6)",
            display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <div style={{ fontFamily: ROMAN, fontWeight: 800, fontSize: 26, color: "#fff", textShadow: shadow, marginBottom: -40 }}>{["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][i]}</div>
          </div>;
        })}
      </div>}
    </div>
  );
};

// ---------- tablilla de cera: el texto se INCISA con el estilete, las palabras clave quedan encendidas ----------
export const WaxTablet: React.FC<{ t: number; a: number; b: number; author: string; work: string; lines: string[]; hot: string[]; en: string; dur?: number; papyrus?: boolean }> = ({ t, a, b, author, work, lines, hot, en, dur = 2.2, papyrus }) => {
  if (t < a || t > b) return null;
  const o = k01(t, a, a + 0.25) * (1 - k01(t, b - 0.3, b)), k = easeOut(k01(t, a, a + 0.7));
  const total = lines.join(" ").length; let acc = 0;
  const cut = total * k01(t, a + 0.5, a + 0.5 + dur);
  const tw = 1240, th = 640;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: W / 2 - tw / 2, top: 150, width: tw, height: th, transform: `perspective(1600px) rotateX(${(1 - k) * 18 + 8}deg) translateY(${(1 - k) * 80}px)`, transformOrigin: "50% 100%",
        borderRadius: 14, padding: 34, boxSizing: "border-box", boxShadow: "0 50px 90px rgba(0,0,0,.65)",
        background: papyrus ? "linear-gradient(180deg,#d9bf88,#c9a76a)" : "repeating-linear-gradient(92deg, rgba(0,0,0,.08) 0 2px, transparent 2px 11px), linear-gradient(180deg,#8a5a32,#6a4122 55%,#5a361b)" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 6, boxShadow: "inset 0 6px 18px rgba(0,0,0,.75)", overflow: "hidden",
          background: papyrus ? "repeating-linear-gradient(90deg, rgba(120,80,30,.07) 0 3px, rgba(255,240,200,.05) 3px 7px), repeating-linear-gradient(0deg, rgba(120,80,30,.06) 0 2px, transparent 2px 9px), linear-gradient(180deg,#ecd8a8,#dfc28a)" : "radial-gradient(ellipse at 30% 20%, #3d3020 0%, #241b11 60%, #1b140c 100%)", padding: "0 56px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          {lines.map((ln, li) => {
            const words = ln.split(" ");
            return <div key={li} style={{ fontFamily: ROMAN, fontWeight: 600, fontSize: 54, lineHeight: 1.5, letterSpacing: 2, whiteSpace: "nowrap" }}>
              {words.map((w, wi) => {
                const s0 = acc; acc += w.length + 1;
                const vis = Math.max(0, Math.min(w.length, Math.ceil(cut - s0)));
                if (vis <= 0) return <span key={wi}>{" ".repeat(w.length + 1)}</span>;
                const isHot = hot.includes(w.replace(/[^a-z]/gi, "").toLowerCase()), lit = isHot ? k01(t, a + 0.5 + dur, a + 1.0 + dur) : 0;
                return <span key={wi} style={papyrus ? { color: isHot && lit > 0 ? `rgb(${Math.round(lerp(42, 170, lit))},${Math.round(lerp(26, 40, lit))},14)` : "#2a1a0c", fontStyle: "italic",
                  boxShadow: isHot && lit > 0 ? `inset 0 -${10 * lit}px 0 rgba(255,138,43,.35)` : undefined } : { color: isHot && lit > 0 ? `rgb(255,${Math.round(lerp(214, 170, lit))},${Math.round(lerp(170, 90, lit))})` : "#c9b48d",
                  textShadow: isHot && lit > 0 ? `0 0 ${18 * lit}px rgba(255,138,43,${0.9 * lit}), 0 -1px 0 rgba(0,0,0,.9)` : "0 -1px 0 rgba(0,0,0,.95), 0 1px 0 rgba(255,230,180,.18)" }}>
                  {w.slice(0, vis)}{vis === w.length ? " " : ""}</span>;
              })}
            </div>;
          })}
          {/* reflejo rasante que recorre la cera */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, transparent ${lerp(-30, 120, k01(t, a + 0.3, b)) - 12}%, rgba(255,235,200,.10) ${lerp(-30, 120, k01(t, a + 0.3, b))}%, transparent ${lerp(-30, 120, k01(t, a + 0.3, b)) + 12}%)` }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: W / 2 - tw / 2, top: 150 + th + 30, width: tw, color: "#fff", textShadow: shadow, opacity: k01(t, a + 0.4, a + 0.8) }}>
        <span style={{ fontFamily: ROMAN, fontWeight: 800, fontSize: 40, letterSpacing: 6 }}>{author}</span>
        <span style={{ fontFamily: SANS, fontSize: 26, marginLeft: 18, opacity: 0.8 }}>{work}</span>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, marginTop: 8, opacity: k01(t, a + 0.8 + dur, a + 1.2 + dur) }}>{en}</div>
      </div>
    </div>
  );
};

// ---------- planta de la casa que se dibuja ACOSTADA sobre la escena (perspectiva), con el área que se llena ----------
// rooms en metros dentro de un cuadrado de side×side; split = muro nuevo que parte una sala grande
export const PlanGrid: React.FC<{ t: number; a: number; b: number; side?: number; area: string; label?: string; split?: { at: number; x1: number; y1: number; x2: number; y2: number; label: string } }> = ({ t, a, b, side = 50, area, label, split }) => {
  if (t < a || t > b) return null;
  const o = k01(t, a, a + 0.25) * (1 - k01(t, b - 0.3, b)), S = 640, m = S / side;
  const R: [number, number, number, number][] = [[0, 0, 50, 50], [16, 14, 18, 20], [0, 0, 16, 14], [16, 0, 18, 14], [34, 0, 16, 14], [0, 14, 16, 20], [34, 14, 16, 20], [0, 34, 22, 16], [22, 34, 12, 16], [34, 34, 16, 16]];
  const draw = (i: number) => k01(t, a + 0.15 + i * 0.12, a + 0.55 + i * 0.12);
  const fill = ease(k01(t, a + 1.4, a + 2.4));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: W / 2 - S / 2, top: 230, width: S, height: S, transform: "perspective(1400px) rotateX(52deg) rotateZ(-18deg)", transformOrigin: "50% 60%" }}>
        <svg width={S} height={S} style={{ overflow: "visible" }}>
          <defs><pattern id="pgh" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke={EMBER} strokeWidth="5" strokeOpacity=".55" /></pattern></defs>
          <rect x={0} y={0} width={S * fill} height={S} fill="url(#pgh)" />
          {R.map(([x, y, w, h], i) => { const p = draw(i), L = 2 * (w + h) * m;
            return <rect key={i} x={x * m} y={y * m} width={w * m} height={h * m} fill="none" stroke="#fff" strokeWidth={i ? 5 : 9} strokeDasharray={L} strokeDashoffset={L * (1 - p)} style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,.6))" }} />; })}
          {split && t > split.at && (() => { const p = easeOut(k01(t, split.at, split.at + 0.6));
            return <line x1={split.x1 * m} y1={split.y1 * m} x2={lerp(split.x1, split.x2, p) * m} y2={lerp(split.y1, split.y2, p) * m} stroke={EMBER2} strokeWidth={10} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${EMBER})` }} />; })()}
        </svg>
      </div>
      <div style={{ position: "absolute", left: 130, top: 300, color: "#fff", textShadow: shadow }}>
        {label && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, letterSpacing: 10, opacity: k01(t, a + 0.3, a + 0.6) }}>{label}</div>}
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 150, letterSpacing: -3, color: EMBER2, opacity: k01(t, a + 1.4, a + 1.8), textShadow: `0 0 40px rgba(255,138,43,.5), ${shadow}` }}>{area}</div>
        {split && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: 6, marginTop: 10, opacity: k01(t, split.at + 0.4, split.at + 0.8) }}>{split.label}</div>}
      </div>
    </div>
  );
};

// ---------- manómetro/termómetro de esfera años 50 (bisel de bronce, aguja con rebote, vidrio) ----------
export const DialGauge: React.FC<{ t: number; a: number; b: number; value: number; max: number; unit?: string; caption?: string; sub?: string; red?: [number, number]; band?: [number, number]; from?: number }> =
  ({ t, a, b, value, max, unit = "°C", caption, sub, red, band, from = 0 }) => {
  if (t < a || t > b) return null;
  const o = k01(t, a, a + 0.25) * (1 - k01(t, b - 0.3, b)), R = 290, cx = W / 2, cy = 455;
  const A0 = -225 * Math.PI / 180, A1 = 45 * Math.PI / 180;
  const ang = (v: number) => A0 + (A1 - A0) * (v / max);
  // aguja: sube con rebote amortiguado
  const u = k01(t, a + 0.35, a + 1.9), spring = 1 - Math.exp(-5 * u) * Math.cos(9 * u);
  const v = from + (value - from) * Math.min(1.08, spring), na = ang(v) + 0.006 * Math.sin(t * 40);
  const pt = (an: number, r: number) => [cx + Math.cos(an) * r, cy + Math.sin(an) * r];
  const arc = (v0: number, v1: number, r: number) => { const [x0, y0] = pt(ang(v0), r), [x1, y1] = pt(ang(v1), r); return `M${x0},${y0} A${r},${r} 0 ${ang(v1) - ang(v0) > Math.PI ? 1 : 0} 1 ${x1},${y1}`; };
  const step = max <= 60 ? 5 : max <= 120 ? 10 : 50, big = max <= 60 ? 10 : max <= 120 ? 20 : 100;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, transform: `scale(${0.92 + 0.08 * easeOut(k01(t, a, a + 0.5))})` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="dgB" cx="40%" cy="30%"><stop offset="0" stopColor="#f6dd9a" /><stop offset=".5" stopColor="#b8873a" /><stop offset="1" stopColor="#5e3d14" /></radialGradient>
          <radialGradient id="dgF" cx="50%" cy="40%"><stop offset="0" stopColor="#f7f0dd" /><stop offset="1" stopColor="#d8ccad" /></radialGradient>
          <linearGradient id="dgG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="rgba(255,255,255,.35)" /><stop offset=".4" stopColor="rgba(255,255,255,0)" /></linearGradient>
        </defs>
        <circle cx={cx} cy={cy + 18} r={R + 46} fill="rgba(0,0,0,.55)" style={{ filter: "blur(18px)" }} />
        <circle cx={cx} cy={cy} r={R + 40} fill="url(#dgB)" />
        <circle cx={cx} cy={cy} r={R + 14} fill="#3a2810" />
        <circle cx={cx} cy={cy} r={R} fill="url(#dgF)" />
        {band && <path d={arc(band[0], band[1], R - 40)} stroke="#2f6b3a" strokeWidth={22} fill="none" opacity={0.75} />}
        {red && <path d={arc(red[0], red[1], R - 40)} stroke="#b0281c" strokeWidth={22} fill="none" opacity={0.85} />}
        {Array.from({ length: Math.round(max / step) + 1 }, (_, i) => { const vv = i * step, isB = vv % big === 0, [x0, y0] = pt(ang(vv), R - 14), [x1, y1] = pt(ang(vv), R - (isB ? 62 : 38)), [tx, ty] = pt(ang(vv), R - 104);
          return <g key={i}><line x1={x0} y1={y0} x2={x1} y2={y1} stroke="#1c140c" strokeWidth={isB ? 6 : 3} />
            {isB && <text x={tx} y={ty + 16} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={44} fill="#1c140c">{vv}</text>}</g>; })}
        <text x={cx} y={cy + 150} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={54} fill="#1c140c">{unit}</text>
        <text x={cx} y={cy + 205} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={60} fill="#b0281c">{Math.round(v)}</text>
        <g transform={`rotate(${(na * 180) / Math.PI} ${cx} ${cy})`} style={{ filter: "drop-shadow(4px 8px 6px rgba(0,0,0,.45))" }}>
          <polygon points={`${cx - 40},${cy - 9} ${cx + R - 30},${cy} ${cx - 40},${cy + 9}`} fill="#121212" />
        </g>
        <circle cx={cx} cy={cy} r={26} fill="url(#dgB)" stroke="#2a1a08" strokeWidth={3} />
        <ellipse cx={cx - 70} cy={cy - 120} rx={R * 0.82} ry={R * 0.55} fill="url(#dgG)" />
      </svg>
      {caption && <div style={{ position: "absolute", left: 0, right: 0, top: cy + R + 62, textAlign: "center", color: "#fff", textShadow: shadow }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 48, letterSpacing: 8 }}>{caption}</div>
        {sub && <div style={{ fontFamily: SANS, fontSize: 30, opacity: 0.85, marginTop: 4 }}>{sub}</div>}
      </div>}
    </div>
  );
};

// ---------- calor radiante: frentes de onda que salen del piso y de las paredes hacia el centro ----------
export const RadiantWaves: React.FC<{ t: number; a: number; b: number; sides?: ("b" | "l" | "r")[] }> = ({ t, a, b, sides = ["b", "l", "r"] }) => {
  if (t < a || t > b) return null;
  const o = k01(t, a, a + 0.5) * (1 - k01(t, b - 0.4, b));
  const waves = (side: "b" | "l" | "r", i: number) => {
    const life = (((t - a) * 0.45 + i / 5) % 1 + 1) % 1, d = life * 560, al = Math.sin(Math.PI * life) * 0.45;
    const p = side === "b" ? `M ${120 + d * 0.3} ${H - 40 - d} Q ${W / 2} ${H - 40 - d - 160} ${W - 120 - d * 0.3} ${H - 40 - d}` : side === "l" ? `M ${80 + d} 200 Q ${80 + d + 70} ${H / 2} ${80 + d} ${H - 160}` : `M ${W - 80 - d} 200 Q ${W - 80 - d - 70} ${H / 2} ${W - 80 - d} ${H - 160}`;
    return <path key={side + i} d={p} fill="none" stroke={EMBER2} strokeOpacity={al} strokeWidth={4 + 10 * (1 - life)} strokeLinecap="round" style={{ filter: `blur(2px) drop-shadow(0 0 18px ${EMBER})` }} />;
  };
  return <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: o }}>{sides.map((s) => [0, 1, 2, 3, 4].map((i) => waves(s, i)))}</svg>;
};

// ---------- cámara térmica: una persona y lo que la rodea; las superficies pasan de frías a tibias y las flechas de pérdida se apagan ----------
export const ThermalBody: React.FC<{ t: number; a: number; b: number; warmAt: number; labels?: { at: number; text: string; sub?: string }[] }> = ({ t, a, b, warmAt, labels = [] }) => {
  if (t < a || t > b) return null;
  const o = k01(t, a, a + 0.3) * (1 - k01(t, b - 0.3, b)), w = ease(k01(t, warmAt, warmAt + 1.4));
  const surf = `rgb(${Math.round(lerp(30, 230, w))},${Math.round(lerp(40, 120, w))},${Math.round(lerp(150, 40, w))})`;
  const cx = W / 2, top = 210;
  const arrows = Array.from({ length: 10 }, (_, i) => {
    const an = -Math.PI / 2 + (i - 4.5) * 0.32 + (i > 4 ? 0.6 : -0.6), life = (((t - a) * 0.9 + i * 0.13) % 1 + 1) % 1;
    const r0 = 230 + life * 260, x = cx + Math.cos(an + Math.PI / 2 * (i % 2 ? 1 : -1)) * r0, y = 560 + Math.sin(an) * r0 * 0.6;
    return <circle key={i} cx={x} cy={y} r={14} fill="#9fd8ff" opacity={Math.sin(Math.PI * life) * (1 - w)} style={{ filter: "drop-shadow(0 0 10px #5fb8ff)" }} />;
  });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: "#05060f" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="tbB" cx="50%" cy="40%"><stop offset="0" stopColor="#fff6c8" /><stop offset=".35" stopColor="#ffb02a" /><stop offset=".7" stopColor="#e2401c" /><stop offset="1" stopColor="#6a1a6a" /></radialGradient>
          <filter id="tbBl"><feGaussianBlur stdDeviation="16" /></filter>
        </defs>
        {/* superficies: piso y paredes */}
        <rect x={0} y={H - 170} width={W} height={170} fill={surf} filter="url(#tbBl)" />
        <rect x={-40} y={0} width={170} height={H} fill={surf} filter="url(#tbBl)" />
        <rect x={W - 130} y={0} width={170} height={H} fill={surf} filter="url(#tbBl)" />
        {/* cuerpo (silueta térmica) */}
        <g filter="url(#tbBl)" fill="url(#tbB)">
          <circle cx={cx} cy={top + 70} r={70} />
          <rect x={cx - 120} y={top + 150} width={240} height={330} rx={90} />
          <rect x={cx - 170} y={top + 170} width={60} height={280} rx={30} /><rect x={cx + 110} y={top + 170} width={60} height={280} rx={30} />
          <rect x={cx - 100} y={top + 440} width={80} height={330} rx={36} /><rect x={cx + 20} y={top + 440} width={80} height={330} rx={36} />
        </g>
        {arrows}
      </svg>
      <div style={{ position: "absolute", right: 210, top: 120, fontFamily: MONO, fontSize: 30, color: "#fff", letterSpacing: 4, opacity: 0.85 }}>THERMAL · °C</div>
      {labels.map((l, i) => {
        const al = k01(t, l.at, l.at + 0.35); if (al <= 0) return null;
        return <div key={i} style={{ position: "absolute", left: 210, top: 300 + i * 150, opacity: al, color: "#fff", textShadow: shadow, transform: `translateX(${(1 - easeOut(k01(t, l.at, l.at + 0.5))) * -40}px)` }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, letterSpacing: 6 }}>{l.text}</div>
          {l.sub && <div style={{ fontFamily: SANS, fontSize: 30, opacity: 0.85 }}>{l.sub}</div>}
        </div>;
      })}
    </div>
  );
};

// ---------- reloj de horas: anillo de 24 h que se llena dos vueltas (día 1, día 2) mientras el piso se calienta ----------
export const HourRing: React.FC<{ t: number; a: number; b: number; hours?: number; caption?: string }> = ({ t, a, b, hours = 48, caption }) => {
  if (t < a || t > b) return null;
  const o = k01(t, a, a + 0.3) * (1 - k01(t, b - 0.3, b)), h = hours * ease(k01(t, a + 0.3, b - 0.6));
  const cx = W - 330, cy = 330, R = 170;
  const seg = (i: number, lap: number) => { const a0 = -Math.PI / 2 + (i / 24) * Math.PI * 2 + 0.02, a1 = a0 + Math.PI * 2 / 24 - 0.04, r = R - lap * 34;
    return `M${cx + Math.cos(a0) * r},${cy + Math.sin(a0) * r} A${r},${r} 0 0 1 ${cx + Math.cos(a1) * r},${cy + Math.sin(a1) * r}`; };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <circle cx={cx} cy={cy} r={R + 30} fill="rgba(10,8,6,.55)" />
        {[0, 1].map((lap) => Array.from({ length: 24 }, (_, i) => {
          const on = h - lap * 24 > i;
          return <path key={lap * 24 + i} d={seg(i, lap)} stroke={on ? (lap ? EMBER : EMBER2) : "rgba(255,255,255,.18)"} strokeWidth={22} fill="none" style={on ? { filter: `drop-shadow(0 0 8px ${EMBER})` } : undefined} />;
        }))}
        <text x={cx} y={cy + 8} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={74} fill="#fff">{Math.floor(h)}</text>
        <text x={cx} y={cy + 52} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={26} letterSpacing={6} fill="#fff">HOURS</text>
      </svg>
      {caption && <div style={{ position: "absolute", left: cx - 300, width: 600, top: cy + R + 50, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: "#fff", textShadow: shadow }}>{caption}</div>}
    </div>
  );
};

// ---------- lo que el sistema necesitaba: cada requisito entra con su ícono y al final todos se apagan tachados ----------
export const NeedList: React.FC<{ t: number; a: number; b: number; title: string; items: { at: number; text: string; ico: "brick" | "wood" | "hand" | "coin" }[]; strikeAt: number }> = ({ t, a, b, title, items, strikeAt }) => {
  if (t < a || t > b) return null;
  const o = k01(t, a, a + 0.3) * (1 - k01(t, b - 0.3, b));
  const ico = (k: string) => {
    const s = { stroke: "#fff", strokeWidth: 4, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
    if (k === "brick") return <g {...s}><rect x={6} y={10} width={28} height={12} /><rect x={22} y={26} width={28} height={12} /><rect x={-6} y={26} width={24} height={12} /></g>;
    if (k === "wood") return <g {...s}><circle cx={14} cy={30} r={10} /><circle cx={36} cy={30} r={10} /><circle cx={25} cy={12} r={10} /></g>;
    if (k === "hand") return <g {...s}><path d="M8 40 L8 20 Q8 14 14 14 L14 30 M14 18 Q14 8 20 8 L20 30 M20 12 Q20 6 26 8 L26 30 M26 14 Q32 12 32 18 L32 34 Q32 44 20 44 Z" /></g>;
    return <g {...s}><circle cx={24} cy={24} r={16} /><path d="M24 14 L24 34 M18 18 L30 18" /></g>;
  };
  const st = ease(k01(t, strikeAt, strikeAt + 0.7));
  return (
    <div style={{ position: "absolute", right: 110, top: 230, width: 760, opacity: o, color: "#fff", textShadow: shadow }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 10, marginBottom: 22, opacity: 0.9 }}>{title}</div>
      {items.map((it, i) => {
        const k = easeOut(k01(t, it.at, it.at + 0.45)); if (k <= 0) return null;
        const si = k01(st, i * 0.18, i * 0.18 + 0.4);
        return <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 26, height: 104, opacity: k * (1 - 0.6 * si), transform: `translateX(${(1 - k) * 60}px)` }}>
          <svg width={56} height={52} style={{ overflow: "visible", filter: `drop-shadow(0 0 10px ${EMBER})` }}>{ico(it.ico)}</svg>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, letterSpacing: 4, whiteSpace: "nowrap", color: si > 0.5 ? "#aaa" : "#fff" }}>{it.text}</div>
          <div style={{ position: "absolute", left: 82, top: 50, height: 6, width: `${si * 470}px`, background: EMBER, boxShadow: `0 0 14px ${EMBER}` }} />
        </div>;
      })}
    </div>
  );
};
