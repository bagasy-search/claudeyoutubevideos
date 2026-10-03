// DocHighlighter — hoja tipeada (tarjeta de cita en estilo informe, NO documento oficial falso) sobre un escritorio
// oscuro. La cámara empuja hacia la frase clave mientras un resaltador amarillo la barre (borde irregular,
// multiply) y el resto de la página se apaga. El encabezado muestra la fuente real como texto plano.
import React, { useMemo } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, MONO, HK, clamp, ease, easeInOut, rnd, lerp } from "../theme";

export type DocHighlighterProps = {
  source: string;
  lines: string[]; // "" o "~" = renglón de contexto ilegible (barra gris)
  highlight: [number, number] | string;
  kicker?: string;
};

const PW = 1100, PH = 1424; // hoja carta
const MX = 110; // margen
const CW_EM = 0.6; // avance de Courier Prime

const makeWood = (): string => {
  if (typeof document === "undefined") return "";
  const W = 1400, H = 900;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  if (!g) return "";
  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#2a1a10"); bg.addColorStop(1, "#1a0f08");
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  let s = 3;
  const r = () => rnd(s++ * 0.917);
  for (let i = 0; i < 520; i++) {
    const y0 = r() * H, amp = 2 + r() * 10, fr = 0.002 + r() * 0.006, ph = r() * 6.28;
    const light = r() < 0.5;
    g.strokeStyle = light ? `rgba(120,78,44,${0.05 + r() * 0.12})` : `rgba(8,4,2,${0.1 + r() * 0.25})`;
    g.lineWidth = 0.6 + r() * 2.4;
    g.beginPath();
    for (let x = -10; x <= W + 10; x += 14) {
      const y = y0 + amp * Math.sin(x * fr + ph) + 3 * Math.sin(x * 0.03 + ph * 2);
      if (x < 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
  }
  return c.toDataURL("image/jpeg", 0.88);
};

const makePaper = (): string => {
  if (typeof document === "undefined") return "";
  const W = 550, H = 712;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  if (!g) return "";
  g.fillStyle = "#f3eee2"; g.fillRect(0, 0, W, H);
  let s = 11;
  const r = () => rnd(s++ * 0.613);
  for (let i = 0; i < 14000; i++) {
    g.fillStyle = r() < 0.5 ? `rgba(120,100,70,${r() * 0.07})` : `rgba(255,255,255,${r() * 0.2})`;
    g.fillRect(r() * W, r() * H, 0.6 + r() * 1.6, 0.5 + r() * 0.8);
  }
  for (let i = 0; i < 160; i++) {
    g.strokeStyle = `rgba(130,110,80,${0.03 + r() * 0.05})`;
    g.lineWidth = 0.5;
    const x = r() * W, y = r() * H, a = r() * 6.28, l = 4 + r() * 12;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  return c.toDataURL("image/jpeg", 0.9);
};

// borde irregular del marcador (path en caja 0..1000 x 0..100)
const raggedPath = (seed: number) => {
  const pts: string[] = [];
  const n = 40;
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 1000},${4 + rnd(seed + i) * 9}`);
  pts.push(`${1000 + rnd(seed + 77) * 8},50`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 1000},${88 + rnd(seed + i * 3.3) * 9}`);
  pts.push(`${-rnd(seed + 99) * 8},50`);
  return `M ${pts.join(" L ")} Z`;
};

const Grain: React.FC<{ f: number; o?: number }> = ({ f, o = 0.22 }) => (
  <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "overlay", opacity: o, pointerEvents: "none" }} />
);

export const DocHighlighter: React.FC<DocHighlighterProps> = ({ source = "", lines = [], highlight = [0, 0], kicker }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const wood = useMemo(makeWood, []);
  const paper = useMemo(makePaper, []);

  // ---- tipografía ----
  const maxLen = Math.max(20, ...lines.map((l) => l.length));
  const fs = Math.min(36, (PW - MX * 2) / (maxLen * CW_EM));
  const cw = fs * CW_EM;
  const lh = fs * 1.75;
  const headerH = 250;
  const preBars = 5; // renglones de contexto arriba
  const bodyTop = headerH + 60 + preBars * lh + lh * 0.8;
  const lineY = (i: number) => bodyTop + i * lh;

  // ---- rangos a resaltar: [linea, c0, c1] ----
  const segs: { li: number; c0: number; c1: number }[] = useMemo(() => {
    const out: { li: number; c0: number; c1: number }[] = [];
    if (typeof highlight === "string") {
      let joined = "";
      const starts: number[] = [];
      lines.forEach((l, i) => { starts.push(joined.length); joined += l + (i < lines.length - 1 ? " " : ""); });
      const at = joined.toLowerCase().indexOf(highlight.toLowerCase());
      if (at >= 0) {
        const end = at + highlight.length;
        lines.forEach((l, i) => {
          const a = Math.max(at, starts[i]), b = Math.min(end, starts[i] + l.length);
          if (b > a) out.push({ li: i, c0: a - starts[i], c1: b - starts[i] });
        });
      }
    } else {
      const [a, b] = highlight;
      for (let i = Math.max(0, a); i <= Math.min(lines.length - 1, b); i++) {
        const l = lines[i];
        const c0 = l.length - l.trimStart().length;
        out.push({ li: i, c0, c1: l.trimEnd().length });
      }
    }
    return out;
  }, [highlight, lines]);

  const totalChars = segs.reduce((a, s) => a + (s.c1 - s.c0), 0) || 1;
  const hiLines = new Set(segs.map((s) => s.li));
  const hx = segs.length ? MX + (Math.min(...segs.map((s) => s.c0)) + Math.max(...segs.map((s) => s.c1))) * cw * 0.5 : PW / 2;
  const hy = segs.length ? (lineY(segs[0].li) + lineY(segs[segs.length - 1].li)) / 2 + lh * 0.1 : PH / 2;
  const spanW = segs.length ? (Math.max(...segs.map((s) => s.c1)) - Math.min(...segs.map((s) => s.c0))) * cw : 600;

  // ---- agenda ----
  const inP = ease(f / Math.max(8, D * 0.14));
  const push = easeInOut((f - D * 0.06) / (D * 0.62));
  const sweepA = D * 0.32, sweepB = D * 0.7;
  const sweep = clamp((f - sweepA) / (sweepB - sweepA));
  const dimP = ease((f - D * 0.36) / (D * 0.22));
  const exitP = clamp((f - (D - 11)) / 11);

  // ---- cámara ----
  const targetSc = clamp((1920 * 0.8) / (spanW + 120), 1.2, 2.0);
  const sc = lerp(0.66, targetSc, push) * (1 + 0.012 * Math.sin(f / 23)) * (1 - exitP * 0.05);
  let cx = lerp(PW * 0.5, hx, push);
  let cy = lerp(PH * 0.47, hy, push);
  cx += 9 * Math.sin(f / 31) + 4 * Math.sin(f / 12.7 + 2);
  cy += 7 * Math.sin(f / 27 + 1) + 3 * Math.sin(f / 9.9);
  const rx = lerp(20, 11, push) + 1.2 * Math.sin(f / 43);
  const rz = lerp(-5, -2.2, push) + 0.4 * Math.sin(f / 37);
  const ry = 2.5 * Math.sin(f / 61) + lerp(-4, 0, push);

  // posición del marcador (punta) para el cuerpo del resaltador
  let tipX = 0, tipY = 0, tipOn = sweep > 0 && sweep < 1;
  {
    let acc = sweep * totalChars;
    for (const s of segs) {
      const n = s.c1 - s.c0;
      if (acc <= n) { tipX = MX + (s.c0 + acc) * cw; tipY = lineY(s.li) + lh * 0.5; break; }
      acc -= n;
      tipX = MX + s.c1 * cw; tipY = lineY(s.li) + lh * 0.5;
    }
  }
  const penIn = ease((f - sweepA + 10) / 10) * (1 - ease((f - sweepB - 2) / 12));

  const bar = (key: string, y: number, w: number, o = 1) => (
    <div key={key} style={{ position: "absolute", left: MX, top: y + lh * 0.3, width: w, height: fs * 0.52, borderRadius: 3, background: "rgba(40,36,30,0.26)", opacity: o, filter: "blur(1.2px)" }} />
  );
  const ctxO = 1 - 0.55 * dimP;

  return (
    <AbsoluteFill style={{ background: "#070504", overflow: "hidden", opacity: 1 - exitP }}>
      <AbsoluteFill style={{ perspective: 2000, perspectiveOrigin: "50% 42%" }}>
        <div style={{ position: "absolute", left: 960, top: 540, width: 0, height: 0, transformStyle: "preserve-3d", transform: `scale(${sc}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) translate(${-cx}px, ${-cy}px)` }}>
          {/* escritorio */}
          <div style={{ position: "absolute", left: -1800, top: -1300, width: PW + 3600, height: PH + 2600, backgroundImage: wood ? `url(${wood})` : undefined, backgroundColor: "#1d120a", backgroundSize: "1400px 900px" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(1500px 1200px at ${1800 + cx}px ${1300 + cy - 200}px, rgba(255,200,130,0.16), rgba(0,0,0,0) 55%), radial-gradient(3200px 2600px at ${1800 + cx}px ${1300 + cy}px, rgba(0,0,0,0) 25%, rgba(0,0,0,0.75) 70%)` }} />
          </div>
          {/* hoja de abajo (pila) */}
          <div style={{ position: "absolute", left: 40, top: 30, width: PW, height: PH, transform: "translateZ(1px) rotate(3.2deg)", background: "#d9d2c2", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }} />
          {/* sombra de la hoja principal: más larga del lado que se levanta */}
          <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, transform: `translateZ(2px) translate(${26 + (1 - inP) * 40}px, ${38 + (1 - inP) * 70}px)`, background: "rgba(0,0,0,0.6)", filter: "blur(22px)", clipPath: "polygon(-10% -10%, 110% -5%, 115% 115%, -5% 110%)" }} />
          {/* hoja principal */}
          <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, transform: `translateZ(${3 + (1 - inP) * 240}px) translateY(${(1 - inP) * 220}px) rotate(${(1 - inP) * -6}deg)`, opacity: clamp(inP * 2) }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: paper ? `url(${paper})` : undefined, backgroundColor: "#f3eee2", backgroundSize: `${PW}px ${PH}px`, overflow: "hidden" }}>
              {/* encabezado: la fuente real, texto plano */}
              <div style={{ position: "absolute", left: MX, right: MX, top: 96, fontFamily: MONO, fontWeight: 700, fontSize: 27, lineHeight: 1.4, letterSpacing: 0.5, color: "#2a2620", textTransform: "uppercase", opacity: ctxO }}>{source}</div>
              <div style={{ position: "absolute", left: MX, right: MX, top: headerH, height: 3, background: "#2a2620", opacity: 0.75 * ctxO }} />
              <div style={{ position: "absolute", left: MX, right: MX, top: headerH + 8, height: 1, background: "#2a2620", opacity: 0.5 * ctxO }} />
              {/* contexto ilegible arriba */}
              {Array.from({ length: preBars }).map((_, i) => bar(`pre${i}`, headerH + 60 + i * lh, (PW - MX * 2) * (i === preBars - 1 ? 0.46 : 0.82 + rnd(i * 5.1) * 0.18), ctxO))}
              {/* párrafo */}
              {lines.map((l, i) => {
                const y = lineY(i);
                if (l === "" || l === "~") return bar(`b${i}`, y, (PW - MX * 2) * (0.7 + rnd(i * 3.7) * 0.3), ctxO);
                const hi = hiLines.has(i);
                return (
                  <div key={i} style={{ position: "absolute", left: MX, top: y, height: lh, display: "flex", alignItems: "center", whiteSpace: "pre", fontFamily: MONO, fontSize: fs, color: "#1c1914", opacity: hi ? 1 : 1 - 0.62 * dimP, textShadow: "0 0 0.6px rgba(0,0,0,0.5)" }}>{l}</div>
                );
              })}
              {/* contexto abajo */}
              {Array.from({ length: 9 }).map((_, i) => bar(`post${i}`, lineY(lines.length) + lh * 0.8 + i * lh, (PW - MX * 2) * (i === 4 ? 0.38 : 0.78 + rnd(i * 9.3) * 0.22), ctxO))}

              {/* resaltador */}
              {(() => {
                let acc = sweep * totalChars;
                return segs.map((s, k) => {
                  const n = s.c1 - s.c0;
                  const p = clamp(acc / n);
                  acc -= n;
                  if (p <= 0) return null;
                  const x0 = MX + s.c0 * cw - 8, w = n * cw + 16;
                  const y = lineY(s.li) + lh * 0.14;
                  const h = lh * 0.74;
                  return (
                    <svg key={k} width={w} height={h} viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ position: "absolute", left: x0, top: y, mixBlendMode: "multiply", overflow: "visible", transform: `rotate(${(rnd(k + 3) - 0.5) * 0.8}deg)` }}>
                      <defs>
                        <clipPath id={`hc${k}`}><rect x={-20} y={-20} width={1040 * p} height={140} /></clipPath>
                        <linearGradient id={`hg${k}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0" stopColor="#ffd92e" />
                          <stop offset="0.5" stopColor="#ffe45a" />
                          <stop offset="1" stopColor="#f7cf1f" />
                        </linearGradient>
                      </defs>
                      <g clipPath={`url(#hc${k})`}>
                        <path d={raggedPath(k * 13 + 1)} fill={`url(#hg${k})`} opacity={0.9} />
                        {/* segunda pasada más densa en los bordes */}
                        <path d={raggedPath(k * 29 + 5)} fill="#f2c200" opacity={0.18} transform="translate(0,3) scale(1,0.92)" />
                      </g>
                    </svg>
                  );
                });
              })()}

              {/* sombreado de curvatura: esquina inferior derecha levantada + luz */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 35%, rgba(0,0,0,0) 70%, rgba(60,40,20,0.18) 92%, rgba(40,25,10,0.32) 100%)" }} />
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(${520 + 300 * (1 - dimP)}px ${260 + 400 * (1 - dimP)}px at ${hx}px ${hy}px, rgba(0,0,0,0) 40%, rgba(15,10,5,${0.42 * dimP}) 100%)` }} />
            </div>
            {/* esquina doblada */}
            <svg width={160} height={160} style={{ position: "absolute", right: 0, bottom: 0 }} viewBox="0 0 160 160">
              <defs>
                <linearGradient id="curl" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fbf8ef" />
                  <stop offset="0.55" stopColor="#d9d1bf" />
                  <stop offset="1" stopColor="#a39880" />
                </linearGradient>
              </defs>
              <path d="M 160 70 Q 120 110 70 160 L 160 160 Z" fill="#cfc7b5" />
              <path d="M 160 70 Q 128 96 112 118 Q 96 140 70 160 Q 104 128 118 110 Q 138 90 160 70 Z" fill="rgba(0,0,0,0.25)" />
              <path d="M 160 70 Q 124 98 70 160 Q 92 104 160 70 Z" fill="url(#curl)" />
            </svg>
          </div>

          {/* resaltador físico: cuerpo sobre la hoja, sigue la punta */}
          {penIn > 0.01 && (
            <div style={{ position: "absolute", left: tipX, top: tipY, transform: `translateZ(${40 + (1 - penIn) * 160}px)`, opacity: penIn }}>
              <div style={{ position: "absolute", left: 20, top: 30, width: 380, height: 58, borderRadius: 22, background: "rgba(0,0,0,0.45)", filter: "blur(10px)", transform: "rotate(32deg)", transformOrigin: "0 50%" }} />
              <div style={{ position: "absolute", left: 0, top: -29, width: 400, height: 58, transform: "rotate(32deg)", transformOrigin: "0 50%" }}>
                <div style={{ position: "absolute", left: 0, top: 14, width: 26, height: 30, background: "linear-gradient(180deg,#ffe86a,#e6b800)", clipPath: "polygon(0 30%, 100% 0, 100% 100%, 0 70%)" }} />
                <div style={{ position: "absolute", left: 24, top: 8, width: 50, height: 42, background: "linear-gradient(180deg,#3a3a3a,#111 60%,#2a2a2a)", borderRadius: 4 }} />
                <div style={{ position: "absolute", left: 70, top: 0, width: 330, height: 58, borderRadius: "10px 26px 26px 10px", background: "linear-gradient(180deg,#fff27a 0%,#f4d321 35%,#d7a90a 80%,#b88c06 100%)" }} />
                <div style={{ position: "absolute", left: 90, top: 10, width: 280, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.55)" }} />
              </div>
            </div>
          )}
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: "radial-gradient(115% 90% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)", pointerEvents: "none" }} />
      <Grain f={f} />

      {kicker && (
        <div style={{ position: "absolute", left: 80, top: 70, display: "flex", alignItems: "center", gap: 18, opacity: ease((f - D * 0.05) / 12), transform: `translateX(${(1 - ease((f - D * 0.05) / 14)) * -30}px)` }}>
          <div style={{ width: 8, height: 44, background: HK.orange }} />
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: HK.bone, textShadow: "0 3px 14px rgba(0,0,0,0.9)" }}>{kicker}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
