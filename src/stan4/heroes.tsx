// ── HÉROES de Stan the Butcher · video 4 (stan4, 16-oct): "25 poor man tricks: US$5 de carne picada para toda la familia" ──
// PURO CSS (pedido del creador 16-oct): cero imágenes adentro. Texturas dibujadas: azulejo del local, mostrador de madera,
// papel de carnicería, acero cepillado, pizarra de tiza, papel de ticket. Capas: fondo → sombra/luz → objeto → dato → acento.
// Dos familias: SLAB (Alfa Slab One: lo impreso/cartel) y HANDK (Kalam: lo escrito a mano: lápiz, tiza, marcador).
// Cada golpe en SU palabra: todo `t` es el segundo absoluto de words.json y cae dentro del plano.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadAlfa } from "@remotion/google-fonts/AlfaSlabOne";
import { loadFont as loadKalam } from "@remotion/google-fonts/Kalam";
import { useT, sp, cl, ez, eo, lin, fr, type P } from "../lkit/core";

const SLAB = loadAlfa().fontFamily;
const HANDK = loadKalam("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;

const RED = "#B3262B", INK = "#231C17", CREAM = "#F5EFE3", MEAT = "#9E2A2B", FAT = "#F3E6D6", GRAPH = "#3B3A3C", GOLD = "#E2B33C", GREEN = "#2F6B45";
const SH = "0 40px 80px rgba(0,0,0,0.45), 0 14px 24px rgba(0,0,0,0.30), 0 2px 4px rgba(0,0,0,0.25)";

// ── texturas CSS ──
const TILE: React.CSSProperties = {
  backgroundColor: "#ECE8DE",
  backgroundImage: [
    "radial-gradient(ellipse at 20% 15%, rgba(255,255,255,0.55), transparent 55%)",
    "repeating-linear-gradient(0deg, #c9c2b4 0 3px, transparent 3px 96px)",
    "repeating-linear-gradient(90deg, #c9c2b4 0 3px, transparent 3px 192px)",
    "repeating-linear-gradient(90deg, rgba(255,255,255,0.45) 0 30px, transparent 30px 192px)",
    "repeating-linear-gradient(0deg, rgba(0,0,0,0.035) 0 48px, transparent 48px 96px)",
    "linear-gradient(180deg, #f2efe7, #d9d3c6)",
  ].join(","),
};
const WOOD: React.CSSProperties = {
  backgroundImage: [
    "linear-gradient(180deg, rgba(255,214,170,0.22), rgba(0,0,0,0.5))",
    "repeating-linear-gradient(90deg, rgba(0,0,0,0.0) 0 11px, rgba(0,0,0,0.18) 11px 13px, rgba(0,0,0,0) 13px 37px)",
    "repeating-linear-gradient(90deg, #5c3b22 0 7px, #6e472a 7px 16px, #4f321d 16px 20px, #7a5232 20px 33px, #5f3d24 33px 47px)",
  ].join(","),
};
const PAPER: React.CSSProperties = {
  backgroundColor: "#F1E9DC",
  backgroundImage: [
    "radial-gradient(circle at 25% 20%, rgba(255,255,255,0.7), transparent 55%)",
    "radial-gradient(circle at 80% 85%, rgba(150,110,70,0.10), transparent 50%)",
    "repeating-linear-gradient(17deg, rgba(120,90,60,0.05) 0 2px, transparent 2px 7px)",
    "repeating-linear-gradient(-29deg, rgba(120,90,60,0.04) 0 1px, transparent 1px 5px)",
  ].join(","),
};
const KRAFT: React.CSSProperties = {
  backgroundColor: "#C9A577",
  backgroundImage: [
    "radial-gradient(circle at 30% 25%, rgba(255,240,210,0.35), transparent 60%)",
    "repeating-linear-gradient(13deg, rgba(90,60,30,0.10) 0 2px, transparent 2px 6px)",
    "repeating-linear-gradient(-41deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 4px)",
  ].join(","),
};
const STEEL: React.CSSProperties = {
  backgroundImage: [
    "repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 3px)",
    "conic-gradient(from 210deg at 50% 50%, #8f989d, #dfe4e6, #858e93, #ccd3d6, #9aa2a6, #e6eaec, #8f989d)",
  ].join(","),
};
const CHALK: React.CSSProperties = {
  backgroundColor: "#1E2522",
  backgroundImage: [
    "radial-gradient(ellipse at 28% 35%, rgba(255,255,255,0.08), transparent 55%)",
    "radial-gradient(ellipse at 72% 70%, rgba(255,255,255,0.06), transparent 45%)",
    "repeating-linear-gradient(8deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 9px)",
  ].join(","),
};
const chalkTxt = "0 0 2px rgba(255,255,255,0.7), 0 0 8px rgba(255,255,255,0.25), 1px 1px 0 rgba(255,255,255,0.15)";

// ── capas comunes ──
// local: pared de azulejo + mostrador de madera en perspectiva + empuje lento de cámara + luz que barre
const Shop: React.FC<{ f: number; d: number; children: React.ReactNode; counter?: number; dark?: boolean }> = ({ f, d, children, counter = 0.36, dark }) => {
  const z = 1 + 0.045 * ez(f / Math.max(1, d));
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#1a1512" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <AbsoluteFill style={{ ...TILE, transform: `translateX(${-12 * f / Math.max(1, d)}px)` }} />
        <div style={{ position: "absolute", left: -100, right: -100, bottom: -60, height: `${counter * 100 + 6}%`, transform: "perspective(1400px) rotateX(38deg)", transformOrigin: "50% 0%", ...WOOD,
          boxShadow: "0 -18px 40px rgba(0,0,0,0.35), inset 0 10px 0 rgba(255,230,200,0.18)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: `${counter * 100}%`, height: 26, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.22))" }} />
        {dark ? <AbsoluteFill style={{ background: "rgba(15,10,8,0.45)" }} /> : null}
        {children}
      </AbsoluteFill>
      <Sweep f={f} d={d} />
    </AbsoluteFill>
  );
};
const Sweep: React.FC<{ f: number; d: number; op?: number }> = ({ f, d, op = 0.22 }) => {
  const x = lin(f, 8, Math.min(d, 110), -60, 160, ez);
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "soft-light", background: `linear-gradient(105deg, transparent ${x - 18}%, rgba(255,255,255,${op * 2}) ${x}%, transparent ${x + 18}%)` }} />;
};
const In: React.FC<{ f: number; at: number; y?: number; x?: number; s0?: number; rot?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ f, at, y = 60, x = 0, s0 = 0.9, rot = 0, style, children }) => {
  const k = sp(f, at, 14, 150);
  return <div style={{ opacity: cl(k * 1.6), transform: `translate(${x * (1 - k)}px, ${y * (1 - k)}px) scale(${s0 + (1 - s0) * k}) rotate(${rot * (1 - k)}deg)`, ...style }}>{children}</div>;
};
// número de truco: ficha redonda con la raya roja del gorro
const TrickNo: React.FC<{ n: number; f: number; at?: number }> = ({ n, f, at = 0 }) => {
  const k = sp(f, at, 12, 160);
  return (
    <div style={{ position: "absolute", left: 70, top: 60, display: "flex", alignItems: "center", gap: 18, transform: `translateX(${-260 * (1 - k)}px)`, opacity: cl(k * 2) }}>
      <div style={{ width: 128, height: 128, borderRadius: 64, background: `radial-gradient(circle at 35% 30%, #fff, ${CREAM} 60%, #d9cfbd)`, boxShadow: SH, border: `8px solid ${RED}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SLAB, fontSize: 64, color: INK }}>{n}</div>
      <div style={{ fontFamily: SLAB, fontSize: 40, color: INK, letterSpacing: 2, background: CREAM, padding: "8px 20px", boxShadow: SH, borderLeft: `8px solid ${RED}` }}>TRICK #{n}</div>
    </div>
  );
};
// sello de goma que cae
const Stamp: React.FC<{ txt: string; f: number; at: number; color?: string; rot?: number; size?: number; style?: React.CSSProperties }> = ({ txt, f, at, color = RED, rot = -8, size = 64, style }) => {
  const k = sp(f, at, 9, 220); if (f < at) return null;
  return (
    <div style={{ position: "absolute", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * k})`, opacity: cl(k * 1.5) * 0.92, border: `7px solid ${color}`, borderRadius: 10, padding: "6px 24px",
      fontFamily: SLAB, fontSize: size, color, letterSpacing: 3, mixBlendMode: "multiply", boxShadow: `inset 0 0 0 3px rgba(255,255,255,0.15)`, whiteSpace: "nowrap", ...style }}>{txt}</div>
  );
};
// escritura a mano: revela de izquierda a derecha
const Write: React.FC<{ txt: string; f: number; at: number; dur?: number; size?: number; color?: string; shadow?: string; style?: React.CSSProperties }> = ({ txt, f, at, dur = 18, size = 60, color = GRAPH, shadow, style }) => {
  const p = cl((f - at) / Math.max(1, dur));
  return <div style={{ fontFamily: HANDK, fontWeight: 700, fontSize: size, color, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - p * 100}% -20% -5%)`, textShadow: shadow, ...style }}>{txt}</div>;
};
// montón de carne picada (cúpula con grano y vetas de grasa)
const Mince: React.FC<{ w: number; h: number; dark?: boolean; lean?: boolean }> = ({ w, h, dark, lean }) => (
  <div style={{ width: w, height: h, borderRadius: "50% 50% 46% 46% / 70% 70% 30% 30%", boxShadow: "0 18px 26px rgba(0,0,0,0.35), inset -14px -18px 30px rgba(60,0,0,0.45), inset 10px 12px 24px rgba(255,160,150,0.35)",
    backgroundColor: dark ? "#5E1518" : lean ? "#C0444A" : MEAT,
    backgroundImage: [
      `radial-gradient(circle at 30% 30%, rgba(255,255,255,${lean ? 0.12 : 0.22}) 0 3px, transparent 4px)`,
      `radial-gradient(circle at 70% 60%, rgba(255,240,225,${lean ? 0.18 : 0.55}) 0 3px, transparent 4px)`,
      "repeating-radial-gradient(circle at 40% 40%, rgba(0,0,0,0.0) 0 5px, rgba(0,0,0,0.12) 5px 7px)",
    ].join(","), backgroundSize: "23px 19px, 31px 27px, 100% 100%" }} />
);
// plato visto de arriba
const Plate: React.FC<{ size: number; children?: React.ReactNode }> = ({ size, children }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: "radial-gradient(circle, #fbfaf6 0 52%, #e9e4da 53% 60%, #f7f4ee 61% 100%)", boxShadow: "0 16px 30px rgba(0,0,0,0.35), inset 0 -6px 12px rgba(0,0,0,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${RED}22` }}>{children}</div>
);
const Price: React.FC<{ txt: string; sub?: string; w?: number; color?: string; ink?: string }> = ({ txt, sub, w = 300, color = GOLD, ink = INK }) => (
  <div style={{ position: "relative", width: w }}>
    <div style={{ background: `linear-gradient(160deg, ${color}, ${color}cc)`, clipPath: "polygon(18% 0, 100% 0, 100% 100%, 18% 100%, 0 50%)", padding: `18px 26px 18px ${w * 0.24}px`, boxShadow: SH }}>
      <div style={{ fontFamily: SLAB, fontSize: 70, lineHeight: 1, color: ink }}>{txt}</div>
      {sub ? <div style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 34, color: ink, marginTop: 4 }}>{sub}</div> : null}
    </div>
    <div style={{ position: "absolute", left: w * 0.09, top: "50%", width: 20, height: 20, marginTop: -10, borderRadius: 10, background: "#2a2522", boxShadow: "inset 0 3px 5px rgba(0,0,0,0.7)" }} />
  </div>
);

// 1 ── HOOK: 1 libra, 5 dólares → alimenta a 5 (+ el almuerzo de mañana)
export const PoundFeeds: P<{ price: string; lb: string; tFeed: number; tLeft: number; n: number }> = ({ a, d, price, lb, tFeed, tLeft, n }) => {
  const { f, at } = useT(a);
  const pk = sp(f, 0, 13, 120);
  return (
    <Shop f={f} d={d}>
      <div style={{ position: "absolute", left: 140, top: 250, transform: `perspective(1200px) rotateX(${14 - 4 * pk}deg) rotateZ(-4deg) translateY(${80 * (1 - pk)}px)`, opacity: cl(pk * 2) }}>
        <div style={{ position: "relative", width: 560, height: 400, ...PAPER, borderRadius: 8, boxShadow: SH }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 49%, rgba(0,0,0,0.08) 50%, transparent 51%), linear-gradient(45deg, transparent 49%, rgba(0,0,0,0.06) 50%, transparent 51%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: "48%", height: 6, background: "#7b6a58" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "48%", width: 6, background: "#7b6a58" }} />
          <div style={{ position: "absolute", left: 90, top: 80, transform: "rotate(-3deg)" }}><Mince w={380} h={240} /></div>
        </div>
        <div style={{ position: "absolute", right: -150, top: -40, transform: `rotate(8deg) scale(${sp(f, 10, 11, 170)})` }}><Price txt={price} sub={lb} w={320} /></div>
      </div>
      <div style={{ position: "absolute", right: 90, top: 150, width: 820 }}>
        <In f={f} at={at(tFeed) - 6}><div style={{ fontFamily: SLAB, fontSize: 92, color: INK, textAlign: "center", textShadow: "0 3px 0 rgba(255,255,255,0.6)" }}>FEEDS <span style={{ color: RED }}>{n}</span></div></In>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 26, marginTop: 30 }}>
          {Array.from({ length: n }).map((_, i) => {
            const k = sp(f, at(tFeed) + i * 5, 11, 170);
            return <div key={i} style={{ transform: `translateY(${-120 * (1 - k)}px) scale(${k})`, opacity: cl(k * 2) }}><Plate size={190}><Mince w={92} h={60} /></Plate></div>;
          })}
        </div>
        {f >= at(tLeft) ? <In f={f} at={at(tLeft)} y={40}><div style={{ marginTop: 34, textAlign: "center" }}>
          <span style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 58, color: CREAM, background: GREEN, padding: "6px 30px", borderRadius: 8, boxShadow: SH }}>+ lunch tomorrow</span></div></In> : null}
      </div>
    </Shop>
  );
};

// 2 ── HOOK_2: la lista en el dorso del papel de carnicería
export const PaperList: P<{ lines: { t: number; txt: string }[]; foot: number }> = ({ a, d, lines, foot }) => {
  const { f, at } = useT(a);
  const k = sp(f, 0, 14, 110);
  return (
    <AbsoluteFill style={{ ...WOOD, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,230,190,0.25), rgba(0,0,0,0.35))" }} />
      <div style={{ position: "absolute", left: 360, top: 70, width: 1200, height: 940, transform: `perspective(1600px) rotateX(${22 - 8 * k}deg) rotateZ(${-3 + 2 * k}deg) translateY(${200 * (1 - k)}px) scale(${1 + 0.04 * ez(f / d)})`, transformOrigin: "50% 80%" }}>
        <div style={{ position: "absolute", inset: 0, ...PAPER, boxShadow: SH,
          clipPath: "polygon(0 2%, 6% 0, 14% 2%, 22% 0, 31% 1.5%, 40% 0, 50% 2%, 61% 0, 70% 1.8%, 81% 0, 90% 2%, 100% 0.5%, 100% 100%, 0 100%)" }} />
        <div style={{ position: "absolute", left: 120, top: 70, fontFamily: HANDK, fontWeight: 700, fontSize: 54, color: RED, transform: "rotate(-2deg)" }}>Mrs. K — one pound, all week</div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 150, height: 3, background: `${RED}55` }} />
        {lines.map((l, i) => (
          <div key={i} style={{ position: "absolute", left: 140, top: 200 + i * 150, display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: GRAPH, opacity: f >= at(l.t) ? 0.85 : 0 }} />
            <Write txt={l.txt} f={f} at={at(l.t)} size={i === lines.length - 1 ? 100 : 86} color={i === lines.length - 1 ? RED : GRAPH} dur={9} />
          </div>
        ))}
        {f >= at(lines[lines.length - 1].t) + 8 ? (
          <svg style={{ position: "absolute", left: 90, top: 170 + (lines.length - 1) * 150, overflow: "visible" }} width={520} height={170}>
            <ellipse cx={250} cy={85} rx={240} ry={70} fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round"
              strokeDasharray={1200} strokeDashoffset={1200 * (1 - ez((f - at(lines[lines.length - 1].t) - 8) / 10))} transform="rotate(-4 250 85)" />
          </svg>) : null}
        <Stamp txt="SPENT LESS" f={f} at={Math.min(at(foot), at(lines[lines.length - 1].t) + 22, d - 26)} style={{ right: 70, bottom: 90 }} rot={-10} size={72} />
      </div>
    </AbsoluteFill>
  );
};

// 3 ── HOOK_3: letrero de letras blancas sobre fieltro negro, contador 0→25 + pestañas BUY / STRETCH / COOK
export const TrickBoard: P<{ n: number; t: number; tabs: { t: number; txt: string }[] }> = ({ a, d, n, t, tabs }) => {
  const { f, at } = useT(a);
  const c = Math.round(n * eo(cl((f - at(t)) / 40)));
  const k = sp(f, 0, 14, 120);
  const felt: React.CSSProperties = { backgroundColor: "#151515", backgroundImage: "repeating-linear-gradient(180deg, #0b0b0b 0 4px, #1d1d1d 4px 26px)" };
  return (
    <Shop f={f} d={d} dark>
      <div style={{ position: "absolute", left: 260, top: 90, width: 1400, height: 640, transform: `perspective(1600px) rotateY(${-10 + 6 * k}deg) translateY(${120 * (1 - k)}px)`, opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", inset: 0, padding: 26, background: "linear-gradient(135deg, #6d4a2b, #3e2816)", boxShadow: SH, borderRadius: 6 }}>
          <div style={{ position: "relative", width: "100%", height: "100%", ...felt, boxShadow: "inset 0 0 40px rgba(0,0,0,0.9)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: SLAB, fontSize: 330, lineHeight: 1, color: "#F7F4EC",
              textShadow: "0 6px 0 rgba(0,0,0,0.5), 0 0 1px #fff" }}>{c}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", fontFamily: SLAB, fontSize: 76, letterSpacing: 10, color: "#F7F4EC", textShadow: "0 4px 0 rgba(0,0,0,0.5)" }}>POOR MAN TRICKS</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontFamily: HANDK, fontWeight: 700, fontSize: 52, color: GOLD }}>one pound · five dollars · whole family</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", gap: 70 }}>
        {tabs.map((tb, i) => {
          const kk = sp(f, at(tb.t), 10, 170);
          return (
            <div key={i} style={{ transform: `translateY(${180 * (1 - kk)}px) rotate(${(i - 1) * 4 * (1 - kk) + (i - 1) * 2}deg)`, opacity: cl(kk * 2) }}>
              <div style={{ width: 380, padding: "22px 0", textAlign: "center", ...PAPER, boxShadow: SH, borderTop: `14px solid ${[RED, GOLD, GREEN][i % 3]}`, fontFamily: SLAB, fontSize: 64, color: INK }}>{tb.txt}</div>
            </div>
          );
        })}
      </div>
    </Shop>
  );
};

// 4 ── STORY: 1959, calendario de pared que se arranca hoja por hoja, 116 días de huelga
export const StrikeDays: P<{ year: string; days: number; t: number; tNo: number }> = ({ a, d, year, days, t, tNo }) => {
  const { f, at } = useT(a);
  const p = eo(cl((f - at(t)) / 70)); const c = Math.max(1, Math.round(days * p));
  const k = sp(f, 0, 14, 120);
  const flips = [0, 1, 2, 3, 4, 5].map((i) => cl((f - at(t) - i * 10) / 12));
  return (
    <AbsoluteFill style={{ ...TILE, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(60,40,20,0.15), rgba(30,20,10,0.45))" }} />
      <div style={{ position: "absolute", left: 230, top: 110, width: 700, height: 860, transform: `perspective(1400px) rotateY(${12 - 4 * k}deg) translateY(${100 * (1 - k)}px)`, opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", left: 330, top: -40, width: 40, height: 40, borderRadius: 20, background: "radial-gradient(circle at 35% 35%, #ddd, #555)", boxShadow: "0 6px 10px rgba(0,0,0,0.5)", zIndex: 5 }} />
        <div style={{ position: "absolute", inset: 0, ...PAPER, boxShadow: SH }}>
          <div style={{ height: 170, background: `linear-gradient(180deg, ${RED}, #8d1d22)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SLAB, fontSize: 130, color: CREAM, letterSpacing: 8 }}>{year}</div>
          <div style={{ padding: 40, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 14 }}>
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} style={{ height: 70, borderBottom: "2px solid rgba(0,0,0,0.12)", fontFamily: HANDK, fontSize: 34, color: i % 7 === 0 ? RED : GRAPH, position: "relative" }}>
                {i < 31 ? i + 1 : ""}
                {i < 31 && i / 31 < p ? <div style={{ position: "absolute", left: 4, top: 6, fontFamily: HANDK, fontWeight: 700, fontSize: 52, color: RED, lineHeight: 0.8 }}>✕</div> : null}
              </div>
            ))}
          </div>
        </div>
        {flips.map((q, i) => q > 0 && q < 1 ? (
          <div key={i} style={{ position: "absolute", inset: 0, ...PAPER, transformOrigin: "50% 0%", transform: `rotateX(${q * 110}deg) translateY(${-q * 40}px)`, opacity: 1 - q, boxShadow: SH }} />
        ) : null)}
      </div>
      <div style={{ position: "absolute", left: 1040, top: 220, width: 760 }}>
        <In f={f} at={at(t)}><div style={{ fontFamily: SLAB, fontSize: 250, lineHeight: 1, color: INK, textShadow: "0 5px 0 rgba(255,255,255,0.6)" }}>{c}</div></In>
        <In f={f} at={at(t) + 6}><div style={{ fontFamily: SLAB, fontSize: 64, color: RED, letterSpacing: 4 }}>DAYS ON STRIKE</div></In>
        <In f={f} at={at(t) + 12}><div style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 52, color: GRAPH, marginTop: 20 }}>the mills went quiet</div></In>
        <div style={{ position: "relative", height: 200 }}><Stamp txt="NO PAYCHECK" f={f} at={at(tNo)} size={80} style={{ left: 0, top: 60 }} rot={-7} /></div>
      </div>
    </AbsoluteFill>
  );
};

// 5 ── BUY truco 1: ticket de pedido que se imprime ("grind this for me") + sello
export const GrindTicket: P<{ no: number; t: number; rows: { t: number; txt: string; val: string }[]; stamp: { t: number; txt: string } }> = ({ a, d, no, t, rows, stamp }) => {
  const { f, at } = useT(a);
  const grow = eo(cl((f - at(t)) / 24));
  return (
    <AbsoluteFill style={{ ...STEEL, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.25), rgba(0,0,0,0.45))" }} />
      <TrickNo n={no} f={f} />
      <div style={{ position: "absolute", left: 560, top: 110, width: 800, height: 120, borderRadius: 18, background: "linear-gradient(180deg, #3a3f43, #1b1e20)", boxShadow: SH }}>
        <div style={{ position: "absolute", left: 60, right: 60, bottom: 26, height: 14, borderRadius: 7, background: "#000", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.9)" }} />
      </div>
      <div style={{ position: "absolute", left: 640, top: 210, width: 640, height: 30 + 720 * grow, overflow: "hidden", transform: `perspective(1400px) rotateX(10deg) scale(${1 + 0.03 * ez(f / d)})`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 750, background: "#FBFAF5", boxShadow: SH,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.025) 0 1px, transparent 1px 4px)", padding: "40px 46px", boxSizing: "border-box",
          clipPath: "polygon(0 0, 100% 0, 100% 97%, 95% 100%, 90% 97%, 85% 100%, 80% 97%, 75% 100%, 70% 97%, 65% 100%, 60% 97%, 55% 100%, 50% 97%, 45% 100%, 40% 97%, 35% 100%, 30% 97%, 25% 100%, 20% 97%, 15% 100%, 10% 97%, 5% 100%, 0 97%)" }}>
          <div style={{ fontFamily: SLAB, fontSize: 52, color: INK, textAlign: "center" }}>STAN'S MEATS</div>
          <div style={{ fontFamily: "monospace", fontSize: 26, color: "#555", textAlign: "center", letterSpacing: 4, marginTop: 4 }}>SOUTH SIDE · CHICAGO</div>
          <div style={{ borderTop: "3px dashed #999", margin: "26px 0" }} />
          <div style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 56, color: RED, transform: "rotate(-2deg)" }}>"grind this for me"</div>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontWeight: 700, fontSize: 38, color: INK, marginTop: 30, opacity: f >= at(r.t) ? 1 : 0.0,
              transform: `translateX(${f >= at(r.t) ? 0 : 30}px)` }}><span>{r.txt}</span><span>{r.val}</span></div>
          ))}
          <div style={{ borderTop: "3px dashed #999", margin: "34px 0 0" }} />
        </div>
      </div>
      <Stamp txt={stamp.txt} f={f} at={at(stamp.t)} size={70} style={{ left: 760, top: 760 }} rot={-9} />
    </AbsoluteFill>
  );
};

// 6 ── BUY truco 2: 80/20 vs 90/10, medidor de sabor
export const FatGauge: P<{ no: number; t: number; lean: { t: number; txt: string; price: string }; card: number; flav: number }> = ({ a, d, no, t, lean, card, flav }) => {
  const { f, at } = useT(a);
  const fat = lin(f, at(flav), at(flav) + 26, 0.62, 1, eo), lv = lin(f, at(card), at(card) + 20, 0.55, 0.16, eo);
  const Col: React.FC<{ txt: string; lean?: boolean; lvl: number; at0: number; tag?: React.ReactNode; bad?: boolean }> = ({ txt, lean: ln, lvl, at0, tag, bad }) => (
    <In f={f} at={at0} y={120}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 420, height: 300, borderRadius: 16, background: "linear-gradient(180deg, #ffffff, #e6e6e6)", boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center",
            border: "10px solid #f4f4f4" }}><Mince w={330} h={210} lean={ln} /></div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "linear-gradient(120deg, rgba(255,255,255,0.45) 0 18%, transparent 30% 100%)" }} />
          <div style={{ textAlign: "center", fontFamily: SLAB, fontSize: 96, color: INK, marginTop: 18 }}>{txt}</div>
          {tag ? <div style={{ position: "absolute", right: -80, top: -60 }}>{tag}</div> : null}
        </div>
        <div style={{ width: 70, height: 420, borderRadius: 35, background: "linear-gradient(90deg, #ddd, #fff, #ccc)", boxShadow: SH, position: "relative", overflow: "hidden", border: "5px solid #fff" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: bad ? "linear-gradient(180deg, #b9a58c, #8b7a64)" : `linear-gradient(180deg, ${GOLD}, #c4561f)` }} />
          {[0.25, 0.5, 0.75].map((y) => <div key={y} style={{ position: "absolute", left: 0, width: 24, bottom: `${y * 100}%`, height: 3, background: "rgba(0,0,0,0.3)" }} />)}
        </div>
      </div>
    </In>
  );
  return (
    <Shop f={f} d={d} counter={0.3}>
      <TrickNo n={no} f={f} />
      
      <div style={{ position: "absolute", left: 160, right: 160, top: 280, display: "flex", justifyContent: "space-between" }}>
        <Col txt="80/20" lvl={fat} at0={at(t)} />
        <Col txt={lean.txt} lean lvl={lv} at0={at(lean.t)} bad={f >= at(card)} tag={f >= at(lean.t) + 6 ? <In f={f} at={at(lean.t) + 6}><Price txt={lean.price} w={300} color="#E7E2D6" /></In> : null} />
      </div>
      <Stamp txt="CARDBOARD" f={f} at={at(card)} color="#6b5a46" style={{ right: 330, top: 420 }} rot={12} size={66} />
      {f >= at(flav) ? <div style={{ position: "absolute", left: 230, top: 170 }}><In f={f} at={at(flav)}><span style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 74, color: CREAM, background: RED, padding: "4px 30px", borderRadius: 8, boxShadow: SH }}>fat = flavor</span></In></div> : null}
    </Shop>
  );
};

// 7 ── BUY truco 5: 1 parte de corazón + 4 de chuck (cubos en el taco de madera)
export const HeartRatio: P<{ no: number; t: number; price: number }> = ({ a, d, no, t, price }) => {
  const { f, at } = useT(a);
  const Cube: React.FC<{ dark?: boolean }> = ({ dark }) => {
    const base = dark ? "#5A1418" : MEAT;
    const tex = dark ? "repeating-linear-gradient(35deg, rgba(0,0,0,0.18) 0 3px, transparent 3px 14px)"
      : "repeating-linear-gradient(28deg, transparent 0 16px, rgba(255,240,225,0.55) 16px 19px), repeating-linear-gradient(-50deg, transparent 0 26px, rgba(255,240,225,0.45) 26px 28px)";
    return (
      <div style={{ position: "relative", width: 250, height: 250 }}>
        <div style={{ position: "absolute", left: 20, bottom: -26, width: 230, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.35)" }} />
        <div style={{ position: "absolute", left: 0, top: 50, width: 190, height: 190, backgroundColor: base, backgroundImage: tex, boxShadow: "inset 0 0 30px rgba(0,0,0,0.35)", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 25, top: 0, width: 190, height: 50, backgroundColor: base, backgroundImage: tex, filter: "brightness(1.25)", transform: "skewX(-27deg)", transformOrigin: "0 100%", borderRadius: 4 }} />
        <div style={{ position: "absolute", left: 190, top: 25, width: 50, height: 190, backgroundColor: base, backgroundImage: tex, filter: "brightness(0.7)", transform: "skewY(-63deg)", transformOrigin: "0 0", borderRadius: 4 }} />
      </div>
    );
  };
  return (
    <Shop f={f} d={d} counter={0.42}>
      <TrickNo n={no} f={f} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", gap: 70, perspective: 1600 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const k = sp(f, at(t) + (i === 0 ? 0 : 10 + i * 5), 11, 160);
          return <div key={i} style={{ transform: `translateY(${-300 * (1 - k)}px)`, opacity: cl(k * 2) }}><Cube dark={i === 0} /></div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 210, top: 690 }}><In f={f} at={at(t) + 4}><div style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 60, color: CREAM, textShadow: "0 3px 8px rgba(0,0,0,0.7)" }}>1 part heart</div></In></div>
      <div style={{ position: "absolute", left: 820, top: 690 }}><In f={f} at={at(t) + 30}><div style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 60, color: CREAM, textShadow: "0 3px 8px rgba(0,0,0,0.7)" }}>4 parts chuck</div></In></div>
      <div style={{ position: "absolute", left: 120, top: 190 }}>{f >= at(t) + 14 ? <In f={f} at={at(t) + 14}><Price txt="½ PRICE" w={340} /></In> : null}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 850, textAlign: "center" }}>{f >= at(price) ? <In f={f} at={at(price)}><span style={{ fontFamily: SLAB, fontSize: 70, color: INK, background: CREAM, padding: "10px 40px", boxShadow: SH }}>NOBODY WILL KNOW</span></In> : null}</div>
    </Shop>
  );
};

// 8 ── STRETCH: balanza de mostrador, la aguja va de 1 lb a 2 lb
export const StretchScale: P<{ t: number; adds: { t: number; txt: string }[] }> = ({ a, d, t, adds }) => {
  const { f, at } = useT(a);
  const v = 1 + lin(f, at(adds[0].t), at(adds[0].t) + 40, 0, 1, eo);
  const ang = -60 + (v - 1) * 120 * 0.85;
  const k = sp(f, 0, 14, 120);
  return (
    <Shop f={f} d={d} counter={0.32}>
      <div style={{ position: "absolute", left: 160, top: 130, width: 760, height: 760, transform: `translateY(${120 * (1 - k)}px)`, opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", ...STEEL, boxShadow: SH }} />
        <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ffffff, #efe9dc 70%, #ddd4c3)", boxShadow: "inset 0 10px 30px rgba(0,0,0,0.25)" }} />
        <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: "repeating-conic-gradient(from -60deg at 50% 50%, #333 0 0.6deg, transparent 0.6deg 6deg)", WebkitMaskImage: "radial-gradient(circle, transparent 0 62%, #000 63% 68%, transparent 69%)", maskImage: "radial-gradient(circle, transparent 0 62%, #000 63% 68%, transparent 69%)" }} />
        {[[1, -60], [1.5, 0], [2, 60]].map(([lb, deg]) => (
          <div key={lb} style={{ position: "absolute", left: 380, top: 380, transform: `rotate(${deg}deg) translateY(-230px) rotate(${-deg}deg)`, fontFamily: SLAB, fontSize: 52, color: lb === 2 ? RED : INK, marginLeft: -40, marginTop: -30, width: 80, textAlign: "center" }}>{lb}</div>
        ))}
        <div style={{ position: "absolute", left: 380, top: 470, marginLeft: -60, width: 120, textAlign: "center", fontFamily: SLAB, fontSize: 40, color: GRAPH }}>LB</div>
        <div style={{ position: "absolute", left: 376, top: 120, width: 8, height: 270, background: RED, borderRadius: 4, transformOrigin: "50% 260px", transform: `rotate(${ang}deg)`, boxShadow: "2px 4px 6px rgba(0,0,0,0.35)" }} />
        <div style={{ position: "absolute", left: 350, top: 350, width: 60, height: 60, borderRadius: 30, ...STEEL, boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 140, right: 140, top: 520, height: 120, borderRadius: 12, background: "#1d2a24", boxShadow: "inset 0 4px 12px rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "monospace", fontWeight: 700, fontSize: 76, color: "#9df5a8", textShadow: "0 0 10px rgba(120,255,140,0.6)" }}>{v.toFixed(2)} LB</div>
      </div>
      <div style={{ position: "absolute", left: 1000, top: 200, width: 820 }}>
        <In f={f} at={at(t)}><div style={{ fontFamily: SLAB, fontSize: 104, lineHeight: 1.02, color: INK }}>ONE POUND<br /><span style={{ color: RED }}>TURNS INTO TWO</span></div></In>
        {adds.map((ad, i) => (
          <div key={i} style={{ marginTop: 60 }}>{f >= at(ad.t) ? <In f={f} at={at(ad.t)} y={-140}><span style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 72, color: INK, ...KRAFT, padding: "10px 34px", boxShadow: SH, display: "inline-block", transform: "rotate(-3deg)" }}>+ {ad.txt.toLowerCase()}</span></In> : null}</div>
        ))}
      </div>
    </Shop>
  );
};

// 9 ── STRETCH truco 12: bandeja con 16 golabki que aparecen en grilla + "2 cada uno × 8"
export const RollCount: P<{ n: number; t: number; fam: number }> = ({ a, d, n, t, fam }) => {
  const { f, at } = useT(a);
  const shown = Math.min(n, Math.max(0, Math.floor((f - at(t) + 2) / 3)));
  return (
    <Shop f={f} d={d} counter={0.55}>
      <div style={{ position: "absolute", left: 180, top: 180, width: 1000, height: 760, transform: "perspective(1500px) rotateX(34deg)", transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "linear-gradient(135deg, #3d3f42, #1d1e20)", boxShadow: SH, padding: 40, boxSizing: "border-box" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 18, background: "radial-gradient(ellipse at 50% 50%, #b6402a, #7d2416)", boxShadow: "inset 0 10px 30px rgba(0,0,0,0.6)",
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(4, 1fr)", gap: 16, padding: 24, boxSizing: "border-box" }}>
            {Array.from({ length: n }).map((_, i) => {
              const k = i < shown ? sp(f, at(t) + i * 3, 10, 180) : 0;
              return (
                <div key={i} style={{ borderRadius: "46% 46% 42% 42%", transform: `scale(${k}) rotate(${(i % 3 - 1) * 4}deg)`,
                  background: "radial-gradient(ellipse at 40% 35%, #d9e6a8, #9bb366 55%, #6d8a43)", boxShadow: "inset -8px -10px 18px rgba(40,60,10,0.5), 0 8px 12px rgba(0,0,0,0.4)",
                  backgroundImage: "repeating-linear-gradient(70deg, rgba(255,255,255,0.0) 0 14px, rgba(255,255,255,0.35) 14px 16px), radial-gradient(ellipse at 40% 35%, #d9e6a8, #9bb366 55%, #6d8a43)",
                  position: "relative" }}>
                  <div style={{ position: "absolute", left: "10%", right: "10%", top: "52%", height: "28%", borderRadius: "50%", background: "rgba(170,40,25,0.75)" }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1260, top: 150, width: 560, textAlign: "center" }}>
        <div style={{ fontFamily: SLAB, fontSize: 300, lineHeight: 1, color: INK, textShadow: "0 6px 0 rgba(255,255,255,0.6)" }}>{shown}</div>
        <div style={{ fontFamily: SLAB, fontSize: 64, color: RED, letterSpacing: 3 }}>ROLLS</div>
        <div style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 50, color: GRAPH }}>from 1 pound</div>
        {f >= at(fam) ? <In f={f} at={at(fam)}><div style={{ marginTop: 40, fontFamily: HANDK, fontWeight: 700, fontSize: 54, color: CREAM, background: GREEN, padding: "8px 20px", borderRadius: 10, boxShadow: SH, whiteSpace: "nowrap", marginLeft: -40, marginRight: -40 }}>2 each · family of 8</div></In> : null}
      </div>
    </Shop>
  );
};

// 10 ── COOK truco 14: timer de cocina 3:00, "no revolver", barra de dorado
export const SearClock: P<{ no: number; t: number; crust: number }> = ({ a, d, no, t, crust }) => {
  const { f, at } = useT(a);
  const p = cl((f - at(t)) / Math.max(30, d - at(t) - 10));
  const secs = Math.round(180 * (1 - p)); const mm = Math.floor(secs / 60), ss = secs % 60;
  const k = sp(f, 0, 14, 120);
  const brown = lin(f, at(crust), at(crust) + 40, 0, 1, eo);
  return (
    <Shop f={f} d={d} dark>
      <TrickNo n={no} f={f} />
      <div style={{ position: "absolute", left: 220, top: 210, width: 640, height: 640, transform: `scale(${0.7 + 0.3 * k}) rotate(${-8 * (1 - k)}deg)`, opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #f6f1e6, #e3d8c3 60%, #b9ab92)`, boxShadow: SH, border: `22px solid ${RED}` }} />
        <div style={{ position: "absolute", inset: 60, borderRadius: "50%", background: `conic-gradient(${RED}cc 0 ${(1 - p) * 360}deg, transparent ${(1 - p) * 360}deg 360deg)`, opacity: 0.85,
          WebkitMaskImage: "radial-gradient(circle, transparent 0 58%, #000 59%)", maskImage: "radial-gradient(circle, transparent 0 58%, #000 59%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SLAB, fontSize: 150, color: INK }}>{mm}:{String(ss).padStart(2, "0")}</div>
        <div style={{ position: "absolute", left: "50%", top: -60, width: 90, height: 70, marginLeft: -45, borderRadius: "14px 14px 0 0", background: "linear-gradient(180deg, #666, #333)" }} />
      </div>
      <div style={{ position: "absolute", left: 1000, top: 230, width: 780 }}>
        <In f={f} at={at(t)}><div style={{ fontFamily: SLAB, fontSize: 110, lineHeight: 1, color: CREAM, textShadow: "0 5px 14px rgba(0,0,0,0.6)" }}>DON'T<br />STIR IT</div></In>
        <In f={f} at={at(t) + 8}><div style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 58, color: GOLD, marginTop: 14 }}>one flat layer · 3 minutes</div></In>
        <div style={{ marginTop: 80, opacity: f >= at(crust) ? 1 : 0 }}>
          <div style={{ fontFamily: SLAB, fontSize: 44, color: CREAM, letterSpacing: 3, marginBottom: 14 }}>CRUST</div>
          <div style={{ width: 700, height: 70, borderRadius: 35, background: "linear-gradient(90deg, #d9898a, #a85a3a, #5a2c14, #2e160a)", boxShadow: SH, position: "relative" }}>
            <div style={{ position: "absolute", top: -14, left: `${brown * 92}%`, width: 46, height: 98, borderRadius: 12, background: CREAM, boxShadow: SH }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: HANDK, fontWeight: 700, fontSize: 40, color: CREAM, marginTop: 10 }}><span>grey</span><span>dark brown = flavor</span></div>
        </div>
      </div>
    </Shop>
  );
};

// 11 ── COOK truco 15: lata de café con la grasa que sube
export const DripCan: P<{ t: number; tag: number }> = ({ a, d, t, tag }) => {
  const { f, at } = useT(a);
  const lvl = lin(f, at(t), at(t) + 60, 0.12, 0.78, eo);
  const k = sp(f, 0, 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#2b211b" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 30%, rgba(255,210,150,0.35), transparent 60%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 340, background: "linear-gradient(180deg, #f2efe8, #cfc8bb)", boxShadow: "0 -10px 30px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 300, height: 40, background: "repeating-linear-gradient(90deg, #111 0 120px, #333 120px 128px)" }} />
      <div style={{ position: "absolute", left: 300, bottom: 250, width: 520, height: 640, transform: `translateY(${150 * (1 - k)}px)`, opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50% / 8%", overflow: "hidden", boxShadow: SH,
          background: "linear-gradient(90deg, #6f7477 0%, #c9ced0 18%, #f2f4f5 30%, #a3a9ac 52%, #7d8386 75%, #b9bfc2 90%, #5c6164 100%)" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0.0) 0 60px, rgba(0,0,0,0.18) 60px 64px, rgba(255,255,255,0.25) 64px 67px)" }} />
          <div style={{ position: "absolute", left: 60, right: 60, top: 230, height: 120, ...PAPER, transform: "rotate(-3deg)", boxShadow: "0 6px 10px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: HANDK, fontWeight: 700, fontSize: 64, color: GRAPH }}>drippings</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: -40, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse, #2a2420 0 60%, #9da3a6 62%, #e6e9ea 72%, #7a8083 100%)", boxShadow: "0 4px 10px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 30, right: 30, top: -40 + (1 - lvl) * 100 + 10, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, #fbf6e8, #eadfc6)", opacity: 0.95 }} />
      </div>
      <div style={{ position: "absolute", left: 470, top: 0, width: 26, height: lin(f, at(t), at(t) + 50, 0, 200, ez), background: "linear-gradient(90deg, rgba(240,200,120,0.4), rgba(255,235,180,0.95), rgba(240,200,120,0.4))", borderRadius: 13, opacity: f < at(t) + 70 ? 1 : 0 }} />
      <div style={{ position: "absolute", left: 960, top: 230, width: 840 }}>
        <In f={f} at={at(t)}><div style={{ fontFamily: SLAB, fontSize: 112, lineHeight: 1, color: CREAM }}>FREE<br /><span style={{ color: GOLD }}>FLAVOR</span></div></In>
        <In f={f} at={at(t) + 10}><div style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 56, color: CREAM, marginTop: 24 }}>fry the onions in it · the potatoes tomorrow</div></In>
        <div style={{ position: "relative", height: 220 }}><Stamp txt="NOTHING WASTED" f={f} at={at(tag)} color={GOLD} style={{ left: 20, top: 10 }} rot={-5} size={58} /></div>
      </div>
    </AbsoluteFill>
  );
};

// 12 ── MEALS truco 19: ficha de receta vieja (salsa de carne) con tildes + sello
export const SauceCard: P<{ no: number; items: { t: number; txt: string }[]; feeds: { t: number; txt: string } }> = ({ a, d, no, items, feeds }) => {
  const { f, at } = useT(a);
  const k = sp(f, 0, 14, 110);
  return (
    <AbsoluteFill style={{ ...WOOD, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,230,190,0.28), rgba(0,0,0,0.4))" }} />
      <TrickNo n={no} f={f} />
      <div style={{ position: "absolute", left: 420, top: 150, width: 1080, height: 760, transform: `perspective(1600px) rotateX(${16 - 6 * k}deg) rotateZ(${3 - 4 * k}deg) translateY(${160 * (1 - k)}px)`, opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 14, boxShadow: SH, backgroundColor: "#F8F3E4",
          backgroundImage: `linear-gradient(180deg, transparent 0 128px, ${RED}aa 128px 132px, transparent 132px), repeating-linear-gradient(180deg, transparent 0 86px, rgba(70,110,170,0.35) 86px 88px), radial-gradient(circle at 85% 80%, transparent 0 70px, rgba(120,80,40,0.18) 72px 80px, transparent 82px)` }} />
        <div style={{ position: "absolute", left: 60, top: 36, fontFamily: HANDK, fontWeight: 700, fontSize: 70, color: INK }}>Meat Sauce · Mama W.</div>
        {items.map((it, i) => (
          <div key={i} style={{ position: "absolute", left: 90, top: 166 + i * 88, display: "flex", alignItems: "center", gap: 24, height: 86 }}>
            <div style={{ width: 44, height: 44, border: `4px solid ${GRAPH}`, borderRadius: 6, position: "relative" }}>
              {f >= at(it.t) + 6 ? <div style={{ position: "absolute", left: 6, top: -16, fontFamily: HANDK, fontWeight: 700, fontSize: 64, color: RED, transform: `scale(${sp(f, at(it.t) + 6, 10, 200)})` }}>✓</div> : null}
            </div>
            <Write txt={it.txt} f={f} at={at(it.t)} size={60} color="#24324d" dur={14} />
          </div>
        ))}
        <Stamp txt={feeds.txt} f={f} at={at(feeds.t)} size={58} style={{ right: 50, bottom: 50 }} rot={-8} />
      </div>
    </AbsoluteFill>
  );
};

// 13 ── MEALS truco 21: 3 hamburguesas gordas vs 4 aplastadas finitas
export const SmashMath: P<{ no: number; t: number; thin: number; dbl: number }> = ({ a, d, no, t, thin, dbl }) => {
  const { f, at } = useT(a);
  const Patty: React.FC<{ w: number; h: number }> = ({ w, h }) => (
    <div style={{ width: w, height: h, borderRadius: "50%", boxShadow: "0 14px 22px rgba(0,0,0,0.45), inset 0 -10px 18px rgba(0,0,0,0.5), inset 0 8px 14px rgba(255,200,150,0.25)",
      background: "radial-gradient(ellipse at 45% 40%, #8a4a26, #5c2c14 60%, #3a1a0a)", backgroundImage: "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,190,120,0.18) 0 4deg, transparent 4deg 13deg), radial-gradient(ellipse at 45% 40%, #8a4a26, #5c2c14 60%, #3a1a0a)" }} />
  );
  const sq = lin(f, at(t), at(t) + 24, 0, 1, eo);
  return (
    <Shop f={f} d={d} counter={0.5} dark>
      <TrickNo n={no} f={f} />
      <div style={{ position: "absolute", left: 140, top: 250, width: 760, textAlign: "center" }}>
        <div style={{ fontFamily: SLAB, fontSize: 60, color: CREAM, marginBottom: 40 }}>THICK</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 30 }}>{[0, 1, 2].map((i) => <In key={i} f={f} at={i * 4}><Patty w={210} h={130} /></In>)}</div>
        <div style={{ fontFamily: SLAB, fontSize: 160, color: CREAM, marginTop: 40 }}>3</div>
      </div>
      <div style={{ position: "absolute", left: 900, top: 380, fontFamily: SLAB, fontSize: 110, color: GOLD }}>vs</div>
      <div style={{ position: "absolute", left: 1040, top: 250, width: 820, textAlign: "center" }}>
        <div style={{ fontFamily: SLAB, fontSize: 60, color: GOLD, marginBottom: 40 }}>SMASHED</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ opacity: cl(sp(f, at(t) + i * 4) * 2) }}><Patty w={140 + 50 * sq} h={130 - 90 * sq} /></div>)}</div>
        <div style={{ fontFamily: SLAB, fontSize: 160, color: GOLD, marginTop: 40 + 90 * sq }}>{f >= at(t) ? 4 : ""}</div>
      </div>
      {f >= at(dbl) ? <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center" }}><In f={f} at={at(dbl)}><span style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 64, color: INK, background: CREAM, padding: "6px 34px", borderRadius: 8, boxShadow: SH }}>two thin on one bun beat one fat one</span></In></div> : null}
    </Shop>
  );
};

// 14 ── MONEY: ticket de caja que se imprime: 5 + 4 = 9 · alimenta a 5
export const TillReceipt: P<{ rows: { t: number; txt: string; val: string }[]; total: { t: number; val: string }; feeds: number }> = ({ a, d, rows, total, feeds }) => {
  const { f, at } = useT(a);
  const shown = rows.filter((r) => f >= at(r.t)).length + (f >= at(total.t) ? 2 : 0);
  return (
    <Shop f={f} d={d} counter={0.4}>
      <div style={{ position: "absolute", left: 600, top: 40, width: 720, height: 140, borderRadius: "24px 24px 8px 8px", ...STEEL, boxShadow: SH }}>
        <div style={{ position: "absolute", left: 80, right: 80, bottom: 24, height: 16, borderRadius: 8, background: "#111" }} />
      </div>
      <div style={{ position: "absolute", left: 610, top: 160, width: 700, height: 90 + shown * 120, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, minHeight: 760, background: "#FCFBF6", boxShadow: SH, padding: "34px 40px", boxSizing: "border-box",
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 5px)" }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontWeight: 700, fontSize: 38, color: INK, height: 120, alignItems: "center", opacity: f >= at(r.t) ? 1 : 0 }}><span>{r.txt}</span><span>{r.val}</span></div>
          ))}
          <div style={{ borderTop: "4px dashed #888", opacity: f >= at(total.t) ? 1 : 0 }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SLAB, fontSize: 74, color: RED, height: 130, alignItems: "center", opacity: f >= at(total.t) ? 1 : 0 }}><span>TOTAL</span><span style={{ marginLeft: 40 }}>${total.val}</span></div>
        </div>
      </div>
      <Stamp txt="FEEDS 5 + LEFTOVERS" f={f} at={Math.min(at(feeds), d - 40)} size={60} color={GREEN} style={{ left: 1180, top: 700 }} rot={-8} />
    </Shop>
  );
};

// 15 ── MONEY_2: ahorro que crece (3,50 → 14 → 60 → 700) con frasco de vidrio que se llena de billetes
export const YearSave: P<{ steps: { t: number; val: number; txt: string }[] }> = ({ a, d, steps }) => {
  const { f, at } = useT(a);
  let cur = 0, prev = 0, lab = steps[0].txt, si = 0;
  steps.forEach((s, i) => { if (f >= at(s.t)) { prev = i ? steps[i - 1].val : 0; cur = s.val; lab = s.txt; si = i; } });
  const tt = f >= at(steps[0].t) ? at(steps[si].t) : 0;
  const v = prev + (cur - prev) * eo(cl((f - tt) / 18));
  const fill = cl(v / 760);
  return (
    <Shop f={f} d={d} counter={0.3}>
      <div style={{ position: "absolute", left: 260, top: 170, width: 520, height: 720 }}>
        <div style={{ position: "absolute", left: 90, right: 90, top: 0, height: 70, borderRadius: 12, ...STEEL, boxShadow: SH }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, bottom: 0, borderRadius: "60px 60px 70px 70px", background: "linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0.3))",
          border: "5px solid rgba(255,255,255,0.65)", boxShadow: "0 30px 60px rgba(0,0,0,0.35), inset 0 0 30px rgba(255,255,255,0.3)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`,
            backgroundColor: "#7da36a", backgroundImage: "repeating-linear-gradient(-12deg, #6f9a5e 0 26px, #8db37a 26px 30px, #5d8a4e 30px 54px, #a4c48f 54px 57px)", boxShadow: "inset 0 10px 20px rgba(0,0,0,0.25)" }} />
          <div style={{ position: "absolute", left: 40, top: 30, width: 40, bottom: 40, borderRadius: 20, background: "linear-gradient(90deg, rgba(255,255,255,0.6), transparent)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 900, top: 260, width: 900 }}>
        <div style={{ fontFamily: SLAB, fontSize: 210, lineHeight: 1, color: INK, textShadow: "0 6px 0 rgba(255,255,255,0.6)" }}>${v < 10 ? v.toFixed(2) : Math.round(v)}{si === steps.length - 1 && f >= at(steps[si].t) ? "+" : ""}</div>
        <div style={{ fontFamily: SLAB, fontSize: 72, color: RED, letterSpacing: 4, marginTop: 10 }}>{lab}</div>
        <div style={{ display: "flex", gap: 14, marginTop: 50 }}>
          {steps.map((s, i) => <div key={i} style={{ width: 150, height: 14, borderRadius: 7, background: f >= at(s.t) ? RED : "rgba(0,0,0,0.15)" }} />)}
        </div>
        <div style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 54, color: GRAPH, marginTop: 30 }}>same pound of meat, used smarter</div>
      </div>
    </Shop>
  );
};

// 16 ── RECAP: pizarra de menú con marco de madera, 4 columnas escritas con tiza
export const ChalkMenu: P<{ cols: { h: string; t: number; items: string[] }[]; done?: { h: string; items: string[] }[] }> = ({ a, d, cols: c0, done = [] }) => {
  const { f, at } = useT(a);
  const pre = done.length;
  const cols = [...done.map((c) => ({ ...c, t: a - 30 })), ...c0];
  const k = pre ? 1 : sp(f, 0, 14, 110);
  return (
    <AbsoluteFill style={{ ...TILE, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 70, top: 60, right: 70, bottom: 60, transform: `perspective(1800px) rotateX(${8 - 6 * k}deg) scale(${0.94 + 0.06 * k})`, opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", inset: 0, padding: 30, ...WOOD, boxShadow: SH, borderRadius: 8 }}>
          <div style={{ position: "relative", width: "100%", height: "100%", ...CHALK, boxShadow: "inset 0 0 50px rgba(0,0,0,0.8)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 20, textAlign: "center", fontFamily: HANDK, fontWeight: 700, fontSize: 70, color: "#F6F2E6", textShadow: chalkTxt }}>25 Poor Man Tricks</div>
            <div style={{ position: "absolute", left: 40, right: 40, top: 130, bottom: 30, display: "flex", gap: 30 }}>
              {cols.map((c, ci) => {
                const per = Math.max(6, Math.min(12, (ci + 1 < cols.length ? at(cols[ci + 1].t) - at(c.t) : d - at(c.t) - 20) / (c.items.length + 1)));
                return (
                  <div key={ci} style={{ flex: 1 }}>
                    <Write txt={c.h} f={f} at={at(c.t)} size={58} color={[GOLD, "#E8A3A3", "#A9D6B4", "#9EC3E6"][ci]} shadow={chalkTxt} dur={10} />
                    <div style={{ height: 4, background: "rgba(255,255,255,0.5)", width: `${100 * ez((f - at(c.t)) / 14)}%`, margin: "6px 0 14px" }} />
                    {c.items.map((it, ii) => (
                      <Write key={ii} txt={"· " + it} f={f} at={at(c.t) + 8 + ii * per} size={c.items.length > 6 ? 40 : 44} color="#F4F0E4" shadow={chalkTxt} dur={10} style={{ marginBottom: 8 }} />
                    ))}
                  </div>
                );
              })}
              {Array.from({ length: Math.max(0, 4 - cols.length) }).map((_, i) => <div key={"e" + i} style={{ flex: 1 }} />)}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 17 ── STRETCH truco 9: dos montones iguales — ¿cuál es la carne? → se revela: lentejas
export const LookAlike: P<{ t: number; rev: number }> = ({ a, d, t, rev }) => {
  const { f, at } = useT(a);
  const r = sp(f, at(rev), 12, 150);
  const Bowl: React.FC<{ lab: string; i: number; lent?: boolean }> = ({ lab, i, lent }) => (
    <In f={f} at={at(t) + i * 6} y={140}>
      <div style={{ position: "relative", width: 560, height: 560 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f8f4ea, #d9cfbd 70%, #b5a78f)", boxShadow: SH }} />
        <div style={{ position: "absolute", inset: 46, borderRadius: "50%", overflow: "hidden", boxShadow: "inset 0 14px 30px rgba(0,0,0,0.5)",
          backgroundColor: "#6b2a1c",
          backgroundImage: lent
            ? "radial-gradient(ellipse at 50% 50%, rgba(120,60,30,0.95) 0 7px, transparent 8px), radial-gradient(ellipse at 50% 50%, rgba(150,80,40,0.9) 0 6px, transparent 7px), radial-gradient(circle at 40% 30%, rgba(255,180,120,0.25), transparent 60%)"
            : "radial-gradient(circle at 50% 50%, rgba(120,50,30,0.95) 0 8px, transparent 9px), radial-gradient(circle at 50% 50%, rgba(90,35,20,0.9) 0 6px, transparent 7px), radial-gradient(circle at 40% 30%, rgba(255,180,120,0.25), transparent 60%)",
          backgroundSize: lent ? "22px 18px, 27px 23px, 100% 100%" : "24px 21px, 31px 26px, 100% 100%" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -110, textAlign: "center" }}>
          <div style={{ display: "inline-block", perspective: 800 }}>
            <div style={{ fontFamily: SLAB, fontSize: 70, color: INK, background: CREAM, padding: "8px 40px", boxShadow: SH, borderTop: `10px solid ${lent ? GREEN : RED}`,
              transform: `rotateX(${(1 - r) * 90}deg)`, opacity: r > 0.02 ? 1 : 0 }}>{lab}</div>
          </div>
          <div style={{ fontFamily: SLAB, fontSize: 90, color: INK, opacity: 1 - r, marginTop: -90 }}>?</div>
        </div>
      </div>
    </In>
  );
  return (
    <Shop f={f} d={d} counter={0.5}>
      <TrickNo n={9} f={f} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", gap: 140 }}>
        <Bowl lab="BEEF" i={0} />
        <Bowl lab="LENTILS" i={1} lent />
      </div>
      {f >= at(rev) + 10 ? <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><In f={f} at={at(rev) + 10}><span style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 64, color: CREAM, background: GREEN, padding: "4px 30px", borderRadius: 8, boxShadow: SH }}>same color · a dollar a bag</span></In></div> : null}
    </Shop>
  );
};

// 18 ── LAST truco 25: el cliente fijo — chapa con el nombre, el mismo día cada semana, "¿qué hay bueno?"
export const Regular: P<{ name: number; day: number; ask: number }> = ({ a, d, name, day, ask }) => {
  const { f, at } = useT(a);
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return (
    <Shop f={f} d={d} counter={0.3}>
      <TrickNo n={25} f={f} />
      <div style={{ position: "absolute", left: 200, top: 260 }}>
        <In f={f} at={at(name)} rot={-12}>
          <div style={{ width: 560, borderRadius: 18, overflow: "hidden", boxShadow: SH, transform: "rotate(-4deg)" }}>
            <div style={{ background: RED, color: CREAM, fontFamily: SLAB, fontSize: 52, textAlign: "center", padding: "16px 0", letterSpacing: 4 }}>HELLO, MY NAME IS</div>
            <div style={{ ...PAPER, height: 230, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HANDK, fontWeight: 700, fontSize: 150, color: INK }}>Stan</div>
            <div style={{ background: RED, height: 30 }} />
          </div>
        </In>
      </div>
      <div style={{ position: "absolute", left: 900, top: 230, width: 880 }}>
        <div style={{ display: "flex", gap: 14 }}>
          {days.map((dd, i) => (
            <div key={dd} style={{ flex: 1, height: 170, ...PAPER, boxShadow: SH, opacity: cl(sp(f, at(day) + i * 2) * 2), position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SLAB, fontSize: 38, color: dd === "SAT" ? RED : INK }}>
              {dd}
              {dd === "SAT" && f >= at(day) + 16 ? <svg style={{ position: "absolute", left: -18, top: -18, overflow: "visible" }} width={170} height={206}>
                <ellipse cx={85} cy={103} rx={78} ry={92} fill="none" stroke={RED} strokeWidth={7} strokeDasharray={560} strokeDashoffset={560 * (1 - ez((f - at(day) - 16) / 14))} /></svg> : null}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: HANDK, fontWeight: 700, fontSize: 54, color: GRAPH, marginTop: 20, opacity: f >= at(day) + 10 ? 1 : 0 }}>same day · every week</div>
        {f >= at(ask) ? <In f={f} at={at(ask)} y={50}>
          <div style={{ marginTop: 60, position: "relative", display: "inline-block", background: "#fff", borderRadius: 40, padding: "30px 50px", boxShadow: SH, fontFamily: HANDK, fontWeight: 700, fontSize: 72, color: INK }}>
            "What's good this week?"
            <div style={{ position: "absolute", left: 80, bottom: -38, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: "44px solid #fff" }} />
          </div></In> : null}
      </div>
    </Shop>
  );
};
