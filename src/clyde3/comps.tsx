// clyde3 · componentes PROPIOS del video del brisket (Bk*). Otro mundo visual que el del tocino: carbón, brasa, papel rosado de
// brisket, sebo dorado, acero de la parrilla. Capas: textura real (papel peach, tabla quemada, acero, roble, pizarra) + sombra
// proyectada + foto real impresa + datos + acento animado con resorte. 2 familias: Bebas Neue + Permanent Marker.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import { img, fr, sp, useT, type P } from "../lkit/core";

const BEBAS = loadBebas("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const MARK = loadMarker("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const K = { char: "#141210", ember: "#D9622B", peach: "#E9B9A0", tallow: "#E8B64C", smoke: "#B9B4AC", cream: "#F1E7D6", steel: "#3A3D40", ink: "#1E1A17", red: "#B3261E", green: "#5E8C4A", blue: "#6E9CC2" };
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ez = (x: number) => { const t = cl(x); return t * t * (3 - 2 * t); };
const fitW = (txt: string, w: number, max: number, k = 0.42) => Math.max(26, Math.min(max, Math.floor(w / Math.max(1, String(txt).length * k))));

const Bed: React.FC<{ k: string; f: number; d: number; blur?: number; dim?: number }> = ({ k, f, d, blur = 18, dim = 0.42 }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.14 - 0.05 * (f / Math.max(1, d))})`, filter: `blur(${blur}px) brightness(${dim}) saturate(0.9)` }} />
  </AbsoluteFill>
);
const Tex: React.FC<{ k: string; style?: React.CSSProperties; tint?: string }> = ({ k, style, tint }) => (
  <div style={{ position: "absolute", overflow: "hidden", ...style }}>
    <Img src={img(k)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    {tint ? <div style={{ position: "absolute", inset: 0, background: tint }} /> : null}
  </div>
);
// foto sin borde blanco: "recorte" con canto oscuro y sombra larga; entra deslizando de costado
const Shot: React.FC<{ k: string; x: number; y: number; w: number; h: number; rot?: number; f: number; at: number; from?: number }> = ({ k, x, y, w, h, rot = 0, f, at, from = -1 }) => {
  const s = sp(f, at, 16, 110);
  return (
    <div style={{ position: "absolute", left: x + (1 - s) * 90 * from, top: y, width: w, height: h, opacity: cl(s * 1.4), transform: `rotate(${rot}deg)`, borderRadius: 6, overflow: "hidden",
      boxShadow: "0 40px 70px rgba(0,0,0,0.7), 0 0 0 3px rgba(20,18,16,0.9)" }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 - 0.04 * cl(f / 150)})` }} />
    </div>
  );
};
const B: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties }> = ({ children, size, color = K.cream, style }) => (
  <div style={{ fontFamily: BEBAS, fontSize: size, color, letterSpacing: 2, lineHeight: 0.95, ...style }}>{children}</div>
);
const M: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties }> = ({ children, size, color = K.ink, style }) => (
  <div style={{ fontFamily: MARK, fontSize: size, color, lineHeight: 1.1, ...style }}>{children}</div>
);
const Pop: React.FC<{ f: number; at: number; children: React.ReactNode; style?: React.CSSProperties; dx?: number; dy?: number }> = ({ f, at, children, style, dx = 0, dy = 22 }) => {
  const s = sp(f, at, 15, 160);
  return <div style={{ opacity: cl(s * 1.6), transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px)`, ...style }}>{children}</div>;
};
const Scrawl: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 16, children, style }) => {
  const p = ez((f - at) / dur);
  return <div style={{ clipPath: `inset(-25% ${100 - p * 100}% -25% -2%)`, opacity: p > 0 ? 1 : 0, ...style }}>{children}</div>;
};
const Line: React.FC<{ d: string; f: number; at: number; dur?: number; color?: string; w?: number; vb?: string }> = ({ d, f, at, dur = 12, color = K.ember, w = 9, vb = "0 0 1920 1080" }) => {
  const p = ez((f - at) / dur), L = 2600;
  return (
    <svg viewBox={vb} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} opacity={p > 0 ? 0.95 : 0} />
    </svg>
  );
};
// marca de hierro candente: aparece con brillo de brasa que se enfría
const Brand: React.FC<{ f: number; at: number; txt: string; size?: number; style?: React.CSSProperties }> = ({ f, at, txt, size = 72, style }) => {
  const s = sp(f, at, 12, 200), hot = cl(1 - (f - at) / 24);
  return (
    <div style={{ position: "absolute", opacity: cl(s * 2), transform: `scale(${1.25 - 0.25 * s})`, fontFamily: BEBAS, fontSize: size, letterSpacing: 4, padding: "6px 26px", whiteSpace: "nowrap",
      color: hot > 0.05 ? `rgb(${255},${Math.round(150 + 60 * hot)},${Math.round(60 + 80 * hot)})` : K.cream, background: K.char, border: `4px solid ${K.ember}`, borderRadius: 6,
      textShadow: `0 0 ${18 * hot}px rgba(255,140,40,${0.9 * hot})`, boxShadow: `0 18px 34px rgba(0,0,0,0.6), 0 0 ${40 * hot}px rgba(217,98,43,${0.7 * hot})`, ...style }}>{txt}</div>
  );
};
const Ember: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: 14 }).map((_, i) => {
      const x = (i * 137) % 1920, sp_ = 0.6 + (i % 5) * 0.18, y = 1080 - ((f * sp_ * 3 + i * 211) % 1250);
      return <div key={i} style={{ position: "absolute", left: x + 30 * Math.sin((f + i * 40) / 30), top: y, width: 5 + (i % 3) * 2, height: 5 + (i % 3) * 2, borderRadius: 6, background: "#FF9A3C", opacity: 0.35 + 0.25 * Math.sin((f + i * 17) / 12), boxShadow: "0 0 10px #FF7A1C" }} />;
    })}
  </AbsoluteFill>
);

// ═══ 1 · Nunca tocó el papel aluminio ═══
export const BkNoFoil: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={160} y={120} w={1100} h={820} rot={-1.5} f={f} at={0} />
      <Pop f={f} at={at(t)} dx={60} dy={0} style={{ position: "absolute", left: 1320, top: 260, width: 520 }}>
        <div style={{ position: "relative", width: 360, height: 220, background: "linear-gradient(135deg,#e9ecef,#9aa1a8 45%,#f4f6f8 60%,#8b939b)", borderRadius: 8, boxShadow: "0 20px 40px rgba(0,0,0,0.55)" }}>
          <B size={64} color={K.ink} style={{ position: "absolute", left: 24, top: 70 }}>FOIL</B>
        </div>
      </Pop>
      <Line f={f} at={at(t) + 8} d="M 1300 230 L 1720 520 M 1720 230 L 1300 520" color={K.red} w={16} />
      <Pop f={f} at={at(t2)} style={{ position: "absolute", left: 1310, top: 600 }}>
        <B size={120} color={K.cream} style={{ textShadow: "0 8px 22px rgba(0,0,0,0.7)" }}>0 MINUTES</B>
        <M size={52} color={K.tallow}>not one</M>
      </Pop>
    </AbsoluteFill>
  );
};

// ═══ 2 · Tablero de madera de la carnicería (lista) ═══
export const BkBoard: P<{ head: string; items: { txt: string; t: number; hot?: boolean }[] }> = ({ a, d, head, items }) => {
  const { f, at } = useT(a);
  const s0 = sp(f, 0, 14, 90);
  return (
    <AbsoluteFill style={{ background: K.char }}>
      <Tex k="t_char" style={{ inset: 0 }} tint="rgba(0,0,0,0.35)" />
      <Ember f={f} />
      <div style={{ position: "absolute", left: 260, top: 60, width: 1400, transform: `translateY(${(1 - s0) * -80}px) rotate(${(1 - s0) * -2}deg)`, opacity: cl(s0 * 1.5) }}>
        <div style={{ position: "relative", height: 150, borderRadius: 10, overflow: "hidden", boxShadow: "0 30px 50px rgba(0,0,0,0.7)" }}>
          <Tex k="t_oak" style={{ inset: 0 }} tint="rgba(30,15,5,0.35)" />
          <B size={118} color={K.cream} style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", letterSpacing: 14, textShadow: "0 4px 0 rgba(0,0,0,0.5)" }}>{head}</B>
        </div>
        {items.map((it, i) => {
          const s = sp(f, at(it.t), 12, 140);
          return (
            <div key={i} style={{ position: "relative", height: 150, marginTop: 22, borderRadius: 10, overflow: "hidden", opacity: cl(s * 1.6), transform: `translateX(${(1 - s) * (i % 2 ? 120 : -120)}px) rotate(${(i % 2 ? 0.6 : -0.6)}deg)`, boxShadow: "0 24px 40px rgba(0,0,0,0.65)" }}>
              <Tex k="t_oak" style={{ inset: 0 }} tint={it.hot ? "rgba(120,40,10,0.45)" : "rgba(20,10,4,0.45)"} />
              <B size={104} color={it.hot ? K.tallow : K.cream} style={{ position: "absolute", left: 50, top: 26 }}>{(it as any).n ?? i + 1}</B>
              <B size={fitW(it.txt, 1100, 104)} color={it.hot ? K.tallow : K.cream} style={{ position: "absolute", left: 170, top: 26, letterSpacing: 6 }}>{it.txt}</B>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══ 3 · 55 años grabado en tabla quemada ═══
export const BkYears: P<{ k: string; num: number; txt: string; t: number }> = ({ a, d, k, num, txt, t }) => {
  const { f, at } = useT(a);
  const n = Math.round(num * ez((f - at(t)) / 22));
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={860} y={120} w={960} h={840} rot={1.5} f={f} at={0} from={1} />
      <Pop f={f} at={2} dx={-60} dy={0} style={{ position: "absolute", left: 110, top: 280, width: 700, height: 520, borderRadius: 12, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.7)" }}>
        <Tex k="t_char" style={{ inset: 0 }} />
        <B size={300} color={K.tallow} style={{ position: "absolute", left: 50, top: 30, textShadow: "0 0 30px rgba(232,182,76,0.35)" }}>{n}</B>
        <B size={74} color={K.cream} style={{ position: "absolute", left: 56, top: 360, letterSpacing: 6 }}>{txt}</B>
      </Pop>
    </AbsoluteFill>
  );
};

// ═══ 4 · Instantánea 1958 sobre papel rosado ═══
export const BkSnap: P<{ k: string; cap: string; date: string; t: number }> = ({ a, d, k, cap, date, t }) => {
  const { f, at } = useT(a);
  const s = sp(f, 0, 14, 100);
  return (
    <AbsoluteFill>
      <Tex k="t_peach" style={{ inset: 0 }} tint="rgba(60,20,10,0.25)" />
      <div style={{ position: "absolute", left: 470, top: 80 + (1 - s) * 60, width: 980, height: 780, background: "#f3ecdf", padding: 28, transform: `rotate(${2 - s * 3.5}deg)`, boxShadow: "0 40px 70px rgba(0,0,0,0.55)", opacity: cl(s * 1.5) }}>
        <Img src={img(k)} style={{ width: "100%", height: 650, objectFit: "cover", filter: "sepia(0.25)" }} />
        <Scrawl f={f} at={Math.max(6, at(t))} dur={20} style={{ marginTop: 10 }}><M size={46} color="#3a2a20">{cap}</M></Scrawl>
      </div>
      <Brand f={f} at={Math.max(12, at(t) + 10)} txt={date} size={90} style={{ left: 1380, top: 760 }} />
    </AbsoluteFill>
  );
};

// ═══ 5 · El dicho del abuelo quemado en una tabla ═══
export const BkPlank: P<{ k: string; lines: { txt: string; t: number }[]; sig: string }> = ({ a, d, k, lines, sig }) => {
  const { f, at } = useT(a);
  const s = sp(f, 0, 14, 90);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.35} />
      <Ember f={f} />
      <div style={{ position: "absolute", left: 180, top: 230 + (1 - s) * 50, width: 1560, height: 600, borderRadius: 14, overflow: "hidden", boxShadow: "0 50px 90px rgba(0,0,0,0.75)", opacity: cl(s * 1.5) }}>
        <Tex k="t_oak" style={{ inset: 0 }} tint="rgba(60,30,10,0.25)" />
        <div style={{ position: "absolute", left: 90, right: 90, top: 70 }}>
          {lines.map((l, i) => {
            const p = ez((f - at(l.t)) / 20);
            return (
              <div key={i} style={{ position: "relative", marginTop: i ? 20 : 0 }}>
                <M size={96} color="#2a160b" style={{ clipPath: `inset(-25% ${100 - p * 100}% -25% -2%)`, textShadow: `0 0 ${14 * cl(1 - (f - at(l.t) - 20) / 20)}px rgba(255,120,30,0.9)` }}>{l.txt}</M>
              </div>
            );
          })}
          <Scrawl f={f} at={at(lines[lines.length - 1].t) + 22} dur={12} style={{ marginTop: 34, textAlign: "right" }}><M size={54} color="#4a2a14">— {sig}</M></Scrawl>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 6 · Pieza: hoja de papel rosado arrancada con número de plantilla ═══
export const BkPiece: P<{ n: number; name: string; sub: string; k: string; t: number }> = ({ a, d, n, name, sub, k, t }) => {
  const { f, at } = useT(a);
  const s = sp(f, 0, 13, 120);
  const torn = "polygon(0% 3%, 6% 0%, 14% 2%, 22% 0%, 31% 3%, 40% 1%, 52% 3%, 63% 0%, 74% 2%, 85% 0%, 93% 3%, 100% 1%, 100% 97%, 92% 100%, 81% 98%, 70% 100%, 58% 97%, 47% 100%, 35% 98%, 24% 100%, 12% 97%, 0% 100%)";
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} blur={8} dim={0.5} />
      <div style={{ position: "absolute", left: 360, top: 170, width: 1200, height: 740, transform: `translateY(${(1 - s) * 120}px) rotate(${-2 + (1 - s) * 4}deg)`, opacity: cl(s * 1.5), filter: "drop-shadow(0 40px 50px rgba(0,0,0,0.65))" }}>
        <div style={{ position: "absolute", inset: 0, clipPath: torn }}>
          <Tex k="t_peach" style={{ inset: 0 }} />
        </div>
        <B size={360} color="transparent" style={{ position: "absolute", left: 70, top: 120, WebkitTextStroke: `10px ${K.char}`, letterSpacing: 0 }}>{String(n).padStart(2, "0")}</B>
        <div style={{ position: "absolute", left: 480, top: 150, width: 650 }}>
          <B size={52} color="#6b3a2a" style={{ letterSpacing: 12 }}>PIECE {n} OF 7</B>
          <B size={fitW(name, 640, 150)} color={K.char} style={{ marginTop: 10 }}>{name}</B>
          <Scrawl f={f} at={Math.max(6, at(t))} dur={16} style={{ marginTop: 24 }}><M size={fitW(sub, 640, 58, 0.55)} color={K.red}>{sub}</M></Scrawl>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 7 · La pieza entera: chata + punta + grasa ═══
export const BkCuts: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const tag = (x: number, y: number, txt: string, sub: string, when: number, col: string) => (
    <Pop f={f} at={when} style={{ position: "absolute", left: x, top: y, background: K.char, borderLeft: `12px solid ${col}`, padding: "12px 26px", borderRadius: 6, boxShadow: "0 18px 30px rgba(0,0,0,0.6)" }}>
      <B size={74} color={K.cream}>{txt}</B><M size={34} color={K.smoke}>{sub}</M>
    </Pop>
  );
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={140} y={110} w={1640} h={860} f={f} at={0} />
      <Line f={f} at={at(t)} d="M 380 640 C 600 600, 820 610, 1000 640" color={K.blue} w={14} />
      {tag(260, 720, "THE FLAT", "lean · long", at(t), K.blue)}
      <Line f={f} at={at(t2)} d={"M 1500 520 C 1600 420, 1420 360, 1340 450 C 1260 540, 1400 640, 1500 520"} color={K.ember} w={14} />
      {tag(1260, 150, "THE POINT", "fat · forgiving", at(t2), K.ember)}
      {tag(760, 860, "FAT STILL ON", "12–14 LB", at(t3), K.tallow)}
    </AbsoluteFill>
  );
};

// ═══ 8 · Prueba de doblar: blanda ✓ / dura ✗ ═══
export const BkBend: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const p1 = ez((f - at(t)) / 18), p2 = ez((f - at(t2)) / 14);
  const arc = (k: number) => `M 60 ${60 + 12 * k} L 620 ${60 + 12 * k}`;
  const flop = (dr: number) => `M 60 ${60 + 160 * dr} Q 200 ${60 + 20 * dr} 340 40 Q 480 ${60 + 20 * dr} 620 ${60 + 160 * dr}`;
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={110} y={140} w={960} h={800} rot={-1} f={f} at={0} />
      <div style={{ position: "absolute", left: 1150, top: 160, width: 680, height: 330, background: "rgba(20,18,16,0.88)", borderRadius: 12, boxShadow: "0 24px 40px rgba(0,0,0,0.6)", opacity: cl(sp(f, at(t) - 6) * 1.5) }}>
        <svg viewBox="0 0 680 300" style={{ position: "absolute", left: 0, top: 20, width: 680, height: 300 }}>
          <path d={flop(p1)} fill="none" stroke={K.peach} strokeWidth={46} strokeLinecap="round" />
          <circle cx={340} cy={60} r={22} fill={K.smoke} />
        </svg>
        <B size={56} color={K.green} style={{ position: "absolute", left: 30, top: 262, whiteSpace: "nowrap" }}>✓ FLOPS = TENDER</B>
      </div>
      <div style={{ position: "absolute", left: 1150, top: 560, width: 680, height: 330, background: "rgba(20,18,16,0.88)", borderRadius: 12, boxShadow: "0 24px 40px rgba(0,0,0,0.6)", opacity: cl(sp(f, at(t2) - 4) * 1.5) }}>
        <svg viewBox="0 0 680 300" style={{ position: "absolute", left: 0, top: 20, width: 680, height: 300 }}>
          <path d={arc(p2)} fill="none" stroke="#B87F6A" strokeWidth={46} strokeLinecap="round" />
          <circle cx={340} cy={60} r={22} fill={K.smoke} />
        </svg>
        <B size={56} color={K.red} style={{ position: "absolute", left: 30, top: 262, whiteSpace: "nowrap" }}>✗ STIFF = TOUGH</B>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 9 · Corte transversal de la grasa: 1" → ¼" ═══
export const BkTrim: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const cut = ez((f - at(t2)) / 22);
  const fat = 260 - 195 * cut;
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={120} y={150} w={840} h={780} rot={-1.5} f={f} at={0} />
      <div style={{ position: "absolute", left: 1060, top: 200, width: 760, height: 720 }}>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 760, height: 360, background: "linear-gradient(180deg,#9c2f2a,#6e1f1c)", borderRadius: "0 0 14px 14px", boxShadow: "0 30px 50px rgba(0,0,0,0.6)" }}>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 120, top: 40 + (i % 3) * 70, width: 90, height: 6, background: "rgba(255,230,220,0.35)", borderRadius: 3 }} />)}
          <B size={60} color={K.cream} style={{ position: "absolute", left: 30, bottom: 26 }}>MEAT</B>
        </div>
        <div style={{ position: "absolute", left: 0, bottom: 360, width: 760, height: fat, background: "linear-gradient(180deg,#fff8ec,#efe0c6)", borderRadius: "14px 14px 0 0", opacity: cl(sp(f, at(t) - 4) * 1.5) }}>
          <B size={60} color="#8a7a60" style={{ position: "absolute", left: 30, top: 14 }}>FAT CAP</B>
        </div>
        <Pop f={f} at={at(t)} style={{ position: "absolute", left: 470, top: 360 - fat + 10 + 140 }}>
          <Brand f={f} at={at(t)} txt={cut > 0.6 ? "¼ INCH" : "1 INCH"} size={70} style={{ position: "relative" }} />
        </Pop>
        {cut > 0 && cut < 1 ? <div style={{ position: "absolute", left: -40, bottom: 360 + fat, width: 840, height: 6, background: K.smoke, boxShadow: "0 0 12px rgba(255,255,255,0.6)" }} /> : null}
      </div>
    </AbsoluteFill>
  );
};

// ═══ 10 · Sebo: el frasco se llena de oro ═══
export const BkTallow: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const lvl = ez((f - at(t)) / 50);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={110} y={140} w={1000} h={800} rot={-1} f={f} at={0} />
      <div style={{ position: "absolute", left: 1290, top: 220, width: 380, height: 560, borderRadius: "40px 40px 50px 50px", background: "rgba(255,255,255,0.12)", border: "8px solid rgba(255,255,255,0.55)", boxShadow: "0 40px 60px rgba(0,0,0,0.6), inset 0 0 30px rgba(255,255,255,0.15)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 88}%`, background: "linear-gradient(180deg,#f6cf6a,#d99a2b)", boxShadow: "inset 0 10px 18px rgba(255,255,255,0.35)" }} />
        <div style={{ position: "absolute", left: 40, top: 30, width: 30, height: 440, background: "rgba(255,255,255,0.25)", borderRadius: 15 }} />
      </div>
      <div style={{ position: "absolute", left: 1270, top: 170, width: 420, height: 70, background: K.steel, borderRadius: 10, boxShadow: "0 10px 18px rgba(0,0,0,0.5)" }} />
      <Pop f={f} at={at(t2)} style={{ position: "absolute", left: 1210, top: 820 }}><B size={96} color={K.tallow}>BEEF TALLOW</B></Pop>
      <Brand f={f} at={at(t3)} txt="COST: $0" size={70} style={{ left: 1500, top: 100 }} />
    </AbsoluteFill>
  );
};

// ═══ 11 · El rub: pimienta + sal, mitad y mitad ═══
export const BkRub: P<{ t: number; t2: number; t3: number }> = ({ a, d, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t2)) / 26);
  const jar = (x: number, label: string, col: string, dots: string, when: number) => (
    <Pop f={f} at={when} style={{ position: "absolute", left: x, top: 220, width: 460, height: 620 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "30px 30px 40px 40px", background: "rgba(255,255,255,0.10)", border: "8px solid rgba(255,255,255,0.5)", overflow: "hidden", boxShadow: "0 40px 60px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${10 + 40 * p}%`, background: col, backgroundImage: dots, backgroundSize: "18px 18px" }} />
      </div>
      <B size={80} color={K.cream} style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center" }}>{label}</B>
    </Pop>
  );
  return (
    <AbsoluteFill>
      <Tex k="t_slate" style={{ inset: 0 }} tint="rgba(0,0,0,0.2)" />
      {jar(420, "COARSE PEPPER", "#2a2622", "radial-gradient(circle, #6b645c 2px, transparent 3px)", at(t))}
      {jar(1040, "KOSHER SALT", "#efeae0", "radial-gradient(circle, #ffffff 2px, transparent 3px)", at(t) + 8)}
      <Pop f={f} at={at(t2)} style={{ position: "absolute", left: 760, top: 420 }}><B size={150} color={K.tallow}>50/50</B></Pop>
      <Brand f={f} at={at(t3)} txt="THAT'S IT" size={78} style={{ left: 790, top: 80 }} />
    </AbsoluteFill>
  );
};

// ═══ 12 · La parrilla vista desde arriba: brasa a un lado, brisket al otro ═══
export const BkPit: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const glow = 0.6 + 0.4 * Math.sin(f / 9);
  return (
    <AbsoluteFill>
      <Tex k="t_steel" style={{ inset: 0 }} tint="rgba(0,0,0,0.45)" />
      <Shot k={k} x={1180} y={120} w={640} h={460} rot={2} f={f} at={0} from={1} />
      <div style={{ position: "absolute", left: 150, top: 120, width: 840, height: 840, borderRadius: 420, background: "radial-gradient(circle,#2b2b2b,#141414)", boxShadow: "0 40px 70px rgba(0,0,0,0.7), inset 0 0 0 18px #0c0c0c", overflow: "hidden" }}>
        {Array.from({ length: 13 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 60, top: 0, width: 8, height: 840, background: "#5a5a5a" }} />)}
        <div style={{ position: "absolute", left: 20, top: 180, width: 300, height: 480, borderRadius: "240px 0 0 240px", opacity: cl(sp(f, at(t)) * 1.5), background: `radial-gradient(circle at 60% 50%, rgba(255,${Math.round(120 + 40 * glow)},40,0.95), #7a1e08 60%, #2a0a02)`, boxShadow: `0 0 ${60 * glow}px rgba(255,110,30,0.7)` }} />
        <div style={{ position: "absolute", left: 420, top: 240, width: 360, height: 360, borderRadius: 60, background: "linear-gradient(135deg,#3a1d10,#1b0d07)", opacity: cl(sp(f, at(t2)) * 1.5), boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }} />
      </div>
      <Pop f={f} at={at(t)} style={{ position: "absolute", left: 160, top: 70 }}><B size={64} color={K.ember}>COALS</B></Pop>
      <Pop f={f} at={at(t2)} style={{ position: "absolute", left: 640, top: 70 }}><B size={64} color={K.cream}>BRISKET · POINT TO THE FIRE</B></Pop>
      <Brand f={f} at={at(t3)} txt="250°F AT THE GRATE" size={84} style={{ left: 1150, top: 700 }} />
    </AbsoluteFill>
  );
};

// ═══ 13 · Cada vistazo = +30 min ═══
export const BkPeek: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const drop = ez((f - at(t)) / 20);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={120} y={130} w={1000} h={820} rot={-1} f={f} at={0} />
      <Pop f={f} at={at(t) - 4} style={{ position: "absolute", left: 1220, top: 160, width: 560, background: "rgba(20,18,16,0.9)", borderRadius: 12, padding: "24px 34px", boxShadow: "0 24px 40px rgba(0,0,0,0.6)" }}>
        <B size={44} color={K.smoke} style={{ letterSpacing: 6 }}>GRATE TEMP</B>
        <B size={170} color={drop > 0.5 ? K.blue : K.ember}>{Math.round(250 - 60 * drop)}°</B>
      </Pop>
      <Brand f={f} at={at(t2)} txt="+30 MIN" size={130} style={{ left: 1260, top: 640 }} />
    </AbsoluteFill>
  );
};

// ═══ 14 · El estancamiento: la curva se aplana ═══
export const BkStall: P<{ t: number; t2: number; t3: number }> = ({ a, d, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t) + 10) / Math.max(30, at(t3) - at(t) + 20));
  const pts: [number, number][] = [[0, 70], [0.25, 140], [0.38, 160], [0.75, 163], [0.88, 185], [1, 203]];
  const X = (x: number) => 200 + x * 1500, Y = (y: number) => 900 - (y - 60) * 4.6;
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"} ${X(x)} ${Y(y)}`).join(" ");
  const sx = X(0.38), ex = X(0.75);
  return (
    <AbsoluteFill style={{ background: K.char }}>
      <Tex k="t_slate" style={{ inset: 0 }} tint="rgba(0,0,0,0.25)" />
      {[100, 140, 160, 180, 200].map((v) => (
        <div key={v} style={{ position: "absolute", left: 200, top: Y(v), width: 1500, height: 2, background: "rgba(241,231,214,0.15)" }}>
          <B size={36} color="rgba(241,231,214,0.6)" style={{ position: "absolute", left: -110, top: -20 }}>{v}°</B>
        </div>
      ))}
      <div style={{ position: "absolute", left: sx, top: Y(178), width: ex - sx, height: Y(145) - Y(178), background: "rgba(217,98,43,0.18)", border: `3px dashed ${K.ember}`, borderRadius: 10, opacity: cl((f - at(t2)) / 10) }} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <path d={path} fill="none" stroke={K.tallow} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={4000} strokeDashoffset={4000 * (1 - p)} />
      </svg>
      <Pop f={f} at={at(t2)} style={{ position: "absolute", left: sx + 30, top: Y(178) - 130 }}><B size={110} color={K.ember}>THE STALL</B></Pop>
      <Pop f={f} at={at(t3)} style={{ position: "absolute", left: sx + 30, top: Y(145) + 20 }}><M size={58} color={K.cream}>1 hr… 2 hrs… 4 hrs</M></Pop>
      <B size={44} color={K.smoke} style={{ position: "absolute", left: 200, top: 960, letterSpacing: 6 }}>INSIDE TEMP · HOURS ON THE FIRE →</B>
    </AbsoluteFill>
  );
};

// ═══ 15 · Vapor: papel aluminio lo encierra / papel lo deja salir ═══
export const BkSteam: P<{ k: string; t: number; t2: number; good?: boolean }> = ({ a, d, k, t, t2, good = false }) => {
  const { f, at } = useT(a);
  const S = Array.from({ length: 9 });
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={110} y={140} w={980} h={800} rot={-1} f={f} at={0} />
      <div style={{ position: "absolute", left: 1180, top: 160, width: 640, height: 640, borderRadius: 16, background: "rgba(20,18,16,0.88)", boxShadow: "0 30px 50px rgba(0,0,0,0.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 120, top: 330, width: 400, height: 180, borderRadius: 30, background: good ? "#c99a7e" : "linear-gradient(135deg,#e9ecef,#9aa1a8 45%,#f4f6f8 60%,#8b939b)" }} />
        {S.map((_, i) => {
          const ph = ((f - at(t)) * 2 + i * 23) % 140;
          const y = good ? 320 - ph * 2.2 : 320 - (ph % 50);
          const x = 150 + i * 42 + (good ? 0 : 8 * Math.sin((f + i * 20) / 8));
          return f > at(t) ? <div key={i} style={{ position: "absolute", left: x, top: y, width: 26, height: 26, borderRadius: 13, background: "rgba(240,240,240,0.55)", filter: "blur(4px)", opacity: good ? cl(1 - ph / 140) : 0.85 }} /> : null;
        })}
        <B size={70} color={good ? K.green : K.red} style={{ position: "absolute", left: 40, top: 40 }}>{good ? "PAPER: STEAM OUT" : "FOIL: STEAM TRAPPED"}</B>
        <Pop f={f} at={at(t2)} style={{ position: "absolute", left: 40, top: 540 }}><M size={58} color={K.cream}>{good ? "bark stays crisp" : "bark turns to mush"}</M></Pop>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 16 · Envolver: 3 pasos ═══
export const BkWrap: P<{ k: string; steps: { txt: string; t: number }[] }> = ({ a, d, k, steps }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Tex k="t_peach" style={{ inset: 0 }} tint="rgba(40,15,8,0.35)" />
      <Shot k={k} x={100} y={150} w={1000} h={780} rot={-1.5} f={f} at={0} />
      {steps.map((s, i) => (
        <Pop key={i} f={f} at={at(s.t)} dx={80} dy={0} style={{ position: "absolute", left: 1180, top: 190 + i * 250, width: 640, display: "flex", alignItems: "center", gap: 24, background: "rgba(20,18,16,0.9)", padding: "18px 28px", borderRadius: 12, boxShadow: "0 20px 34px rgba(0,0,0,0.55)" }}>
          <B size={120} color={K.tallow}>{i + 1}</B>
          <M size={fitW(s.txt, 460, 52, 0.55)} color={K.cream}>{s.txt}</M>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

// ═══ 17 · Tierno como manteca: la sonda entra ═══
export const BkButter: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t)) / 20);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={110} y={130} w={1020} h={820} rot={-1} f={f} at={0} />
      <div style={{ position: "absolute", left: 1240, top: 260, width: 560, height: 360, background: "rgba(20,18,16,0.88)", borderRadius: 14, boxShadow: "0 24px 40px rgba(0,0,0,0.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 60, bottom: 40, width: 440, height: 140, background: "#6b2e1a", borderRadius: 12 }} />
        <div style={{ position: "absolute", left: 270, top: -40 + 190 * p, width: 16, height: 220, background: "linear-gradient(90deg,#ddd,#888)", borderRadius: 8 }} />
        <M size={50} color={K.tallow} style={{ position: "absolute", left: 30, top: 20 }}>like soft butter</M>
      </div>
      <Brand f={f} at={at(t2)} txt="≈ 203°F · GO BY FEEL" size={74} style={{ left: 1230, top: 690 }} />
    </AbsoluteFill>
  );
};

// ═══ 18 · La caja: corte de la heladerita con capas ═══
export const BkBox: P<{ k: string; t: number; t2: number; t3: number; t4: number }> = ({ a, d, k, t, t2, t3, t4 }) => {
  const { f, at } = useT(a);
  const layer = (y: number, h: number, bg: string, label: string, when: number) => (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, height: h, background: bg, borderRadius: 10, opacity: cl(sp(f, when) * 1.5), transform: `translateY(${(1 - sp(f, when)) * -60}px)` }}>
      <B size={48} color={K.char} style={{ position: "absolute", left: 24, top: h / 2 - 26 }}>{label}</B>
    </div>
  );
  const drops = f > at(t4) ? Array.from({ length: 8 }) : [];
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={110} y={150} w={820} h={780} rot={-1.5} f={f} at={0} />
      <div style={{ position: "absolute", left: 1040, top: 180, width: 780, height: 640, background: "#e9e6e0", borderRadius: 26, boxShadow: "0 40px 70px rgba(0,0,0,0.65), inset 0 0 0 26px #cfcac0" }}>
        <div style={{ position: "absolute", left: 26, right: 26, top: 26, bottom: 26, background: "#2a2826", borderRadius: 10, overflow: "hidden" }}>
          {layer(420, 120, "#d9cdb5", "OLD TOWEL", at(t))}
          {layer(250, 160, "#c99a7e", "BRISKET IN PAPER", at(t2))}
          {layer(100, 140, "#d9cdb5", "MORE TOWELS", at(t3))}
          {drops.map((_, i) => {
            const ph = ((f - at(t4)) + i * 9) % 40 / 40;
            return <div key={i} style={{ position: "absolute", left: 80 + i * 75 + (i % 2 ? 1 : -1) * 120 * ph, top: 300 + 40 * Math.sin(i), width: 18, height: 18, borderRadius: 9, background: K.tallow, opacity: 1 - ph }} />;
          })}
        </div>
      </div>
      <Brand f={f} at={at(t4)} txt="LID SHUT · 2–4 HOURS" size={76} style={{ left: 1090, top: 860 }} />
    </AbsoluteFill>
  );
};

// ═══ 19 · Las vetas: punta y chata van distinto ═══
export const BkGrain: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const rot = 90 * ez((f - at(t2)) / 20);
  const grain = (ang: number) => `repeating-linear-gradient(${ang}deg, #7a2f1d 0px, #7a2f1d 10px, #5c2214 10px, #5c2214 16px)`;
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={100} y={140} w={900} h={800} rot={-1} f={f} at={0} />
      <div style={{ position: "absolute", left: 1090, top: 200, width: 440, height: 300, borderRadius: 14, background: grain(0), boxShadow: "0 24px 40px rgba(0,0,0,0.6)", opacity: cl(sp(f, at(t)) * 1.5) }}>
        <B size={60} color={K.cream} style={{ position: "absolute", left: 20, top: 220 }}>FLAT</B>
      </div>
      <div style={{ position: "absolute", left: 1560, top: 200, width: 280, height: 300, borderRadius: 14, background: grain(60), boxShadow: "0 24px 40px rgba(0,0,0,0.6)", transform: `rotate(${rot}deg)`, opacity: cl(sp(f, at(t)) * 1.5) }}>
        <B size={60} color={K.cream} style={{ position: "absolute", left: 20, top: 220 }}>POINT</B>
      </div>
      <Line f={f} at={at(t3)} d="M 1130 580 L 1130 860 M 1190 580 L 1190 860 M 1250 580 L 1250 860 M 1310 580 L 1310 860" color={K.cream} w={6} />
      <Pop f={f} at={at(t3)} style={{ position: "absolute", left: 1370, top: 640 }}><B size={84} color={K.tallow}>ACROSS THE GRAIN</B><M size={56} color={K.cream}>pencil thick</M></Pop>
    </AbsoluteFill>
  );
};

// ═══ 20 · Problema → arreglo ═══
export const BkFix: P<{ k: string; n: number; problem: string; fix: string; t: number; t2: number }> = ({ a, d, k, n, problem, fix, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={110} y={150} w={1000} h={780} rot={-1} f={f} at={0} />
      <Pop f={f} at={at(t)} style={{ position: "absolute", left: 1190, top: 170, width: 640 }}>
        <B size={46} color={K.smoke} style={{ letterSpacing: 8 }}>TROUBLE {n}</B>
        <B size={fitW(problem, 640, 150)} color={K.red} style={{ textShadow: "0 6px 18px rgba(0,0,0,0.7)" }}>{problem}</B>
      </Pop>
      <Pop f={f} at={at(t2)} style={{ position: "absolute", left: 1190, top: 520, width: 640, background: K.peach, padding: "22px 30px", borderRadius: 10, boxShadow: "0 24px 40px rgba(0,0,0,0.6)" }}>
        <B size={44} color="#6b3a2a" style={{ letterSpacing: 8 }}>FIX</B>
        <M size={60} color={K.char} style={{ whiteSpace: "normal", lineHeight: 1.15, marginTop: 6 }}>{fix}</M>
      </Pop>
    </AbsoluteFill>
  );
};

// ═══ 21 · Ticket de la cuenta ═══
export const BkTicket: P<{ rows: { txt: string; val: string; t: number; strike?: boolean }[] }> = ({ a, d, rows }) => {
  const { f, at } = useT(a);
  const s = sp(f, 0, 14, 100);
  return (
    <AbsoluteFill style={{ background: K.char }}>
      <Tex k="t_slate" style={{ inset: 0 }} tint="rgba(0,0,0,0.3)" />
      <div style={{ position: "absolute", left: 420, top: 70 + (1 - s) * 80, width: 1080, height: 920, transform: `rotate(${-1 + (1 - s) * 2}deg)`, boxShadow: "0 40px 70px rgba(0,0,0,0.65)", opacity: cl(s * 1.5), overflow: "hidden" }}>
        <Tex k="t_peach" style={{ inset: 0 }} />
        <div style={{ position: "absolute", left: 70, right: 70, top: 50 }}>
          <B size={70} color="#6b3a2a" style={{ letterSpacing: 12, borderBottom: "4px dashed #6b3a2a", paddingBottom: 14 }}>ONE BRISKET · THE MATH</B>
          {rows.map((r, i) => (
            <Pop key={i} f={f} at={at(r.t)} style={{ position: "relative", display: "flex", justifyContent: "space-between", marginTop: 50 }}>
              <M size={60} color={K.char}>{r.txt}</M><B size={110} color={r.strike ? K.red : K.char}>{r.val}</B>
              {r.strike ? <Line f={f} at={at(r.t) + 14} d="M 0 70 L 940 50" color={K.red} w={8} vb="0 0 940 120" /> : null}
            </Pop>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 22 · Lo que te queda: $150 ═══
export const BkKeep: P<{ k: string; val: number; t: number; t2: number }> = ({ a, d, k, val, t, t2 }) => {
  const { f, at } = useT(a);
  const n = Math.round(val * ez((f - at(t)) / 24));
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={980} y={150} w={840} h={760} rot={1.5} f={f} at={0} from={1} />
      <Pop f={f} at={at(t) - 4} style={{ position: "absolute", left: 130, top: 230 }}>
        <B size={70} color={K.smoke} style={{ letterSpacing: 8 }}>YOU KEEP</B>
        <B size={330} color={K.tallow} style={{ textShadow: "0 0 40px rgba(232,182,76,0.35)" }}>${n}</B>
      </Pop>
      <Brand f={f} at={at(t2)} txt="ON ONE BRISKET" size={76} style={{ left: 150, top: 820 }} />
    </AbsoluteFill>
  );
};

// ═══ 23 · Recalentar entero: horno 250° · 45 min ═══
export const BkOven: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t2)) / 30);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={110} y={140} w={1040} h={800} rot={-1} f={f} at={0} />
      <Brand f={f} at={at(t)} txt="250°F OVEN" size={100} style={{ left: 1260, top: 200 }} />
      <svg viewBox="0 0 400 400" style={{ position: "absolute", left: 1320, top: 420, width: 400, height: 400, opacity: cl(sp(f, at(t2) - 4) * 1.5) }}>
        <circle cx={200} cy={200} r={180} fill={K.char} stroke={K.smoke} strokeWidth={10} />
        <circle cx={200} cy={200} r={140} fill="none" stroke={K.ember} strokeWidth={34} strokeDasharray={880} strokeDashoffset={880 * (1 - 0.75 * p)} transform="rotate(-90 200 200)" strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 1320, top: 545, width: 400, textAlign: "center", opacity: cl(sp(f, at(t2)) * 1.5) }}><B size={130} color={K.cream}>{Math.round(45 * p)}</B><B size={52} color={K.smoke}>MINUTES</B></div>
      <div style={{ position: "absolute", left: 1270, top: 850, width: 500, textAlign: "center", opacity: cl(sp(f, at(t2) + 10) * 1.5) }}><M size={56} color={K.tallow} style={{ textShadow: "0 4px 14px rgba(0,0,0,0.8)" }}>whole piece, paper on</M></div>
    </AbsoluteFill>
  );
};

// ═══ 24 · Comentarios: tu estancamiento más largo ═══
export const BkComment: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} />
      <Shot k={k} x={110} y={160} w={900} h={760} rot={-1} f={f} at={0} />
      <Pop f={f} at={at(t) - 4} style={{ position: "absolute", left: 1050, top: 210, width: 800, padding: "34px 40px", borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
        <Tex k="t_peach" style={{ inset: 0 }} />
        <div style={{ position: "relative" }}>
          <B size={50} color="#6b3a2a" style={{ letterSpacing: 8 }}>TELL ME IN THE COMMENTS</B>
          <Scrawl f={f} at={at(t)} dur={18} style={{ marginTop: 20 }}><M size={58} color={K.char} style={{ whiteSpace: "nowrap" }}>longest stall: __ hrs</M></Scrawl>
          <Scrawl f={f} at={at(t2)} dur={18} style={{ marginTop: 14 }}><M size={56} color={K.red} style={{ whiteSpace: "nowrap" }}>Clyde's record: 5 hrs</M></Scrawl>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

// ═══ superposición: marca de hierro a un costado (nunca sobre la cara) ═══
export const BkBrand: P<{ txt: string; side?: "l" | "r" }> = ({ a, d, txt, side = "r" }) => {
  const { f } = useT(a);
  return (
    <AbsoluteFill style={{ opacity: cl((d - f) / 8) }}>
      <Brand f={f} at={0} txt={txt} size={78} style={{ [side === "r" ? "right" : "left"]: 90, top: 90 } as any} />
    </AbsoluteFill>
  );
};
