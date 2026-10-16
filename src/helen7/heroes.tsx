// helen7 · componentes PROPIOS (12 trucos: papas en grasa de tocino, sin olla de agua). PURO CSS: cero imágenes.
// Identidad: la COCINA DE ATRÁS del mercado de Iowa — hierro fundido negro, esmalte crema de la cocina vieja, grasa blanca en frasco,
// pared de bloques pintados, tablero de corcho con notas amarillas, ticket de balanza. Materiales dibujados con gradientes.
// Fuentes (2): Alfa Slab One (cartel de diner) + Kalam (letra de Helen). Paleta: hierro, manteca/oro, rojo tocino, crema esmalte, azul enamel.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadSlab } from "@remotion/google-fonts/AlfaSlabOne";
import { loadFont as loadKalam } from "@remotion/google-fonts/Kalam";
import { sp, ez, cl, fr } from "../lkit/core";

const SLAB = loadSlab().fontFamily;
const PEN = loadKalam("normal", { weights: ["400", "700"] }).fontFamily;
const IRON = "#1F1D1B", GOLD = "#E8B53A", BACON = "#B23A2E", CREAM = "#F5EFE1", BLUE = "#2F5D7C", INK = "#2A231C", TAN = "#C99B5F", GREEN = "#3F7A4E", FAT = "#F4EEDB";
const SH = "0 2px 3px rgba(0,0,0,.25), 0 14px 26px rgba(0,0,0,.28), 0 44px 80px rgba(0,0,0,.32)";
type B = { a: number; a0?: number; d: number };
const useT0 = (a: number, a0?: number) => { const f0 = useCurrentFrame(); const s = a0 ?? a; return { f: f0 + fr(a) - fr(s), at: (t: number) => fr(t) - fr(s) }; };
const rnd = (i: number) => { const x = Math.sin(i * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const pos = (p: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...p });
const fsz = (txt: string, maxW: number, base: number, k = 0.76) => Math.min(base, maxW / Math.max(1, txt.length * k));

// ── materiales ──
const BLOCK = "linear-gradient(rgba(0,0,0,.09) 0 4px, transparent 4px) 0 0/100% 110px, linear-gradient(90deg, rgba(0,0,0,.08) 0 4px, transparent 4px) 0 0/240px 220px, linear-gradient(90deg, rgba(0,0,0,.08) 0 4px, transparent 4px) 120px 110px/240px 220px, radial-gradient(ellipse 80% 60% at 30% 10%, #FFFFFF, #ECE8DF 60%, #D9D3C6)";
const CORK = "radial-gradient(circle at 20% 30%, rgba(90,50,20,.35) 0 2px, transparent 3px) 0 0/23px 19px, radial-gradient(circle at 70% 60%, rgba(255,230,190,.25) 0 1.5px, transparent 2.5px) 0 0/17px 21px, radial-gradient(circle at 40% 80%, rgba(60,30,10,.3) 0 1px, transparent 2px) 0 0/11px 13px, linear-gradient(160deg, #C49565, #A97848)";
const ENAMEL = "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(255,255,255,.75), transparent), linear-gradient(90deg, #E7E1D2, #FBF8F0 30%, #F0EADC 70%, #DAD3C2)";
const STEEL = "repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 1px, transparent 1px 3px), linear-gradient(180deg, #C9CDD0, #9EA4A8 60%, #8A9094)";
const BUTCHER = "repeating-linear-gradient(92deg, rgba(120,100,70,.05) 0 2px, transparent 2px 7px), radial-gradient(ellipse at 30% 20%, #FFFDF7, #F1EBDD 70%)";
const KRAFT = "radial-gradient(ellipse at 30% 20%, rgba(255,240,210,.3), transparent 55%), repeating-linear-gradient(95deg, rgba(90,60,30,.07) 0 2px, transparent 2px 6px), #B98F5E";
const WOOD = "repeating-linear-gradient(88deg, rgba(70,40,15,.18) 0 3px, transparent 3px 22px), repeating-linear-gradient(91deg, rgba(255,220,170,.10) 0 1px, transparent 1px 9px), linear-gradient(180deg, #A9784A, #8A5C34)";
const FROST = "radial-gradient(circle at 20% 30%, rgba(255,255,255,.75) 0 1.5px, transparent 2.5px) 0 0/34px 30px, radial-gradient(circle at 70% 60%, rgba(255,255,255,.55) 0 1px, transparent 2px) 0 0/22px 26px, linear-gradient(180deg, #E6F0F6, #B9D0DF)";
const Light: React.FC<{ x?: number; y?: number; o?: number }> = ({ x = 70, y = 0, o = 0.3 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse 70% 80% at ${x}% ${y}%, rgba(255,246,225,${o}), transparent 60%), linear-gradient(180deg, transparent 62%, rgba(0,0,0,.22))` }} />
);
const Bg: React.FC<{ m: string; f: number; x?: number }> = ({ m, f, x }) => (
  <>
    <AbsoluteFill style={{ transform: `scale(${1.05 + 0.0001 * f}) translateX(${0.02 * f}px)` }}><AbsoluteFill style={{ background: m }} /></AbsoluteFill>
    <Light x={x} />
  </>
);
// mesa de acero en perspectiva bajo la pared de bloques
const Kitchen: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ perspective: 1600 }}>
    <AbsoluteFill style={{ background: BLOCK, transform: `scale(${1.04 + 0.00008 * f})` }} />
    <div style={pos({ left: -200, right: -200, top: 640, bottom: -400, background: STEEL, transform: "rotateX(52deg)", transformOrigin: "50% 0%", boxShadow: "inset 0 30px 60px rgba(0,0,0,.35)" })} />
    <div style={pos({ left: 0, right: 0, top: 628, height: 18, background: "linear-gradient(180deg,#E3E6E8,#7E8488)", boxShadow: "0 6px 14px rgba(0,0,0,.35)" })} />
    <Light x={25} y={0} o={0.35} />
  </AbsoluteFill>
);
const Sheen: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const u = (f - at) / 26; if (u < 0 || u > 1) return null;
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", background: `linear-gradient(110deg, transparent ${u * 140 - 40}%, rgba(255,255,255,.32) ${u * 140 - 30}%, transparent ${u * 140 - 20}%)` }} />;
};
// ── piezas ──
const Slab: React.FC<{ txt: string; size: number; color?: string; style?: React.CSSProperties; ls?: number }> = ({ txt, size, color = INK, style, ls = 1 }) => (
  <div style={{ fontFamily: SLAB, fontSize: size, color, lineHeight: 1, letterSpacing: ls, whiteSpace: "nowrap", ...style }}>{txt}</div>
);
const Pen: React.FC<{ txt: string; size: number; color?: string; f?: number; at?: number; dur?: number; style?: React.CSSProperties; w?: number }> = ({ txt, size, color = INK, f = 999, at = -999, dur = 16, style, w = 700 }) => (
  <div style={{ fontFamily: PEN, fontWeight: w, fontSize: size, color, lineHeight: 1.08, whiteSpace: "nowrap", clipPath: `inset(-30% ${100 - 100 * ez((f - at) / dur)}% -30% 0)`, ...style }}>{txt}</div>
);
const pop = (f: number, at: number) => { const u = sp(f, at, 10, 200); return { opacity: cl(u * 3), transform: `scale(${0.5 + 0.5 * u})` }; };
const drop = (f: number, at: number, dy = -500, rot = 8) => { const u = sp(f, at, 12, 150); return { opacity: cl(u * 2), transform: `translateY(${dy * (1 - u)}px) rotate(${rot * (1 - u)}deg)` }; };
const slideL = (f: number, at: number, dx = -700) => { const u = sp(f, at, 14, 130); return { opacity: cl(u * 2), transform: `translateX(${dx * (1 - u)}px)` }; };
const Tick: React.FC<{ f: number; at: number; s?: number; c?: string }> = ({ f, at, s = 54, c = GREEN }) => {
  const u = sp(f, at, 11, 200);
  return <div style={{ width: s * 0.45, height: s * 0.9, borderRight: `${s * 0.18}px solid ${c}`, borderBottom: `${s * 0.18}px solid ${c}`, transform: `rotate(40deg) scale(${u})`, opacity: cl(u * 3), flex: "none", marginRight: s * 0.35, marginLeft: s * 0.1 }} />;
};
const Cross: React.FC<{ f: number; at: number; s?: number; c?: string }> = ({ f, at, s = 54, c = BACON }) => {
  const u = ez((f - at) / 8), v = ez((f - at - 6) / 8);
  return (
    <div style={{ position: "relative", width: s, height: s, flex: "none", marginRight: s * 0.35 }}>
      <div style={pos({ left: 0, top: s * 0.42, width: s * 1.15 * u, height: s * 0.17, background: c, borderRadius: 6, transform: "rotate(45deg)", transformOrigin: "0 50%" })} />
      <div style={pos({ left: 0, top: s * 0.42 + s * 0.8, width: s * 1.15 * v, height: s * 0.17, background: c, borderRadius: 6, transform: "rotate(-45deg)", transformOrigin: "0 50%" })} />
    </div>
  );
};
const Strike: React.FC<{ f: number; at: number; c?: string }> = ({ f, at, c = BACON }) => (
  <div style={pos({ left: -14, right: -14, top: "46%", height: 13, borderRadius: 7, background: c, transformOrigin: "left", transform: `rotate(-4deg) scaleX(${ez((f - at) / 9)})`, boxShadow: "0 2px 4px rgba(0,0,0,.3)" })} />
);
// papa dibujada en CSS
const Potato: React.FC<{ w: number; kind?: "russet" | "gold" | "red"; rot?: number; style?: React.CSSProperties }> = ({ w, kind = "russet", rot = 0, style }) => {
  const c = kind === "russet" ? ["#C49364", "#8E623B"] : kind === "gold" ? ["#E9C779", "#B68D3E"] : ["#B5483F", "#7A2A25"];
  const h = kind === "russet" ? w * 0.58 : w * 0.78;
  return (
    <div style={{ position: "relative", width: w, height: h, transform: `rotate(${rot}deg)`, ...style }}>
      <div style={pos({ inset: 0, borderRadius: "48% 52% 46% 54% / 55% 48% 52% 45%", background: `radial-gradient(ellipse 50% 40% at 35% 30%, rgba(255,255,255,.35), transparent 70%), radial-gradient(ellipse at 60% 65%, ${c[0]}, ${c[1]})`,
        boxShadow: `inset -${w * 0.06}px -${w * 0.07}px ${w * 0.12}px rgba(0,0,0,.35), 0 ${w * 0.08}px ${w * 0.12}px rgba(0,0,0,.35)` })} />
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={pos({ left: `${15 + rnd(i + w) * 70}%`, top: `${15 + rnd(i * 3 + w) * 65}%`, width: w * 0.035, height: w * 0.025, borderRadius: "50%", background: "rgba(60,35,15,.55)" })} />)}
    </div>
  );
};
const Cube: React.FC<{ s: number; c?: string; style?: React.CSSProperties }> = ({ s, c = "#E7B85A", style }) => (
  <div style={{ width: s, height: s, borderRadius: s * 0.22, background: `radial-gradient(ellipse 60% 50% at 35% 30%, #FBE7A8, ${c} 60%, #A86A22)`, boxShadow: `inset -3px -4px 6px rgba(120,60,10,.5), 0 3px 5px rgba(0,0,0,.35)`, ...style }} />
);
// cartel de diner esmaltado
const EnamelSign: React.FC<{ w: number; h: number; children: React.ReactNode; c?: string; style?: React.CSSProperties }> = ({ w, h, children, c = BLUE, style }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 28, background: `radial-gradient(ellipse 70% 60% at 30% 20%, rgba(255,255,255,.22), transparent 60%), linear-gradient(160deg, ${c}, #1C3A50)`, boxShadow: `${SH}, inset 0 0 0 10px ${CREAM}, inset 0 0 0 16px ${c}, inset 0 0 0 19px rgba(255,255,255,.5)`, ...style }}>
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, y], i) => <div key={i} style={pos({ [x < 0 ? "left" : "right"]: 34, [y < 0 ? "top" : "bottom"]: 34, width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fff, #8d9399 70%)", boxShadow: "0 2px 3px rgba(0,0,0,.5)" } as any)} />)}
    {children}
  </div>
);
const Note: React.FC<{ w: number; rot?: number; children: React.ReactNode; c?: string; style?: React.CSSProperties }> = ({ w, rot = 0, children, c = "#F7E27A", style }) => (
  <div style={{ position: "relative", width: w, padding: "26px 30px 22px", transform: `rotate(${rot}deg)`, background: `linear-gradient(180deg, rgba(255,255,255,.35), transparent 30%), ${c}`, boxShadow: "0 3px 4px rgba(0,0,0,.2), 0 16px 28px rgba(0,0,0,.28)", ...style }}>
    <div style={pos({ left: "50%", top: -12, width: 28, height: 28, marginLeft: -14, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ff9d8a, ${BACON} 60%, #5e1a14)`, boxShadow: "0 4px 6px rgba(0,0,0,.45)" })} />
    {children}
  </div>
);

// ═════════════ COMPONENTES ═════════════

// Capítulo: cartel esmaltado de diner sobre la pared de bloques, el número en un plato de hierro
export const Chapter: React.FC<B & { n: number; title: string; sub: string; tw: number }> = ({ a, a0, n, title, sub, tw }) => {
  const { f, at } = useT0(a, a0); const u = sp(f, at(tw) - 4, 13, 120);
  const ts = fsz(title, 1000, 96, 0.78);
  return (
    <AbsoluteFill>
      <Bg m={BLOCK} f={f} x={30} />
      <div style={pos({ left: 0, top: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", perspective: 1400 })}>
        <div style={{ transform: `rotateX(${(1 - u) * -70}deg) translateY(${(1 - u) * -120}px)`, transformOrigin: "50% 0%", opacity: cl(u * 2) }}>
          <EnamelSign w={1560} h={520}>
            <div style={pos({ left: 70, top: 92, width: 336, height: 336, borderRadius: "50%", background: `radial-gradient(circle at 38% 32%, #4a4642, ${IRON} 55%, #0d0c0b)`, boxShadow: "inset 0 0 0 16px #2b2825, inset 0 0 0 20px #46413c, 0 14px 24px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${(1 - sp(f, at(tw) + 4, 12, 150)) * -160}deg)` })}>
              <Slab txt={String(n)} size={n > 9 ? 170 : 200} color={GOLD} style={{ textShadow: "0 4px 0 #7a5410, 0 10px 18px rgba(0,0,0,.6)" }} />
            </div>
            <div style={pos({ left: 460, top: 96 })}><Pen txt={`trick number ${n}`} size={52} color={GOLD} f={f} at={at(tw) + 2} dur={12} /></div>
            <div style={pos({ left: 456, top: 176 })}><Slab txt={title} size={ts} color={CREAM} style={{ textShadow: "0 5px 0 rgba(0,0,0,.35)" }} /></div>
            <div style={pos({ left: 462, top: 196 + ts + 26 })}><Pen txt={sub} size={fsz(sub, 1010, 54, 0.45)} color="#D9E6EE" f={f} at={at(tw) + 12} dur={22} w={400} /></div>
          </EnamelSign>
        </div>
      </div>
      <Sheen f={f} at={at(tw) + 16} />
    </AbsoluteFill>
  );
};

// Etiqueta de precio sobre la bolsa congelada: precio grande, después tachado + lo que es por libra
export const FrozenTag: React.FC<B & { price: string; item: string; lb: string; t: number; tLb: number; per?: string; tPer?: number }> = ({ a, a0, price, item, lb, t, tLb, per, tPer }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={FROST} f={f} x={40} />
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={pos({ left: `${rnd(i) * 100}%`, top: `${rnd(i * 7) * 100}%`, width: 6 + rnd(i * 3) * 14, height: 6 + rnd(i * 3) * 14, borderRadius: 3, background: "rgba(255,255,255,.55)", transform: `rotate(${rnd(i) * 90}deg)` })} />)}
      <div style={pos({ left: 330, top: 150, width: 1260, height: 780, borderRadius: 40, background: "linear-gradient(120deg, rgba(255,255,255,.55), rgba(220,235,245,.35) 40%, rgba(255,255,255,.5)), repeating-linear-gradient(80deg, rgba(255,255,255,.2) 0 6px, transparent 6px 40px)", boxShadow: SH, border: "3px solid rgba(255,255,255,.7)", ...drop(f, at(t) - 10, -300, 4) })}>
        {Array.from({ length: 28 }, (_, i) => <div key={i} style={pos({ left: 60 + rnd(i * 5) * 1100, top: 60 + rnd(i * 11) * 640, opacity: 0.85, transform: `rotate(${rnd(i) * 60}deg)` })}><Cube s={44 + rnd(i) * 24} c="#E9D7A6" /></div>)}
        <div style={pos({ left: 280, top: 170, width: 700, height: 440, background: CREAM, borderRadius: 18, boxShadow: SH, transform: "rotate(-3deg)", ...pop(f, at(t)) })}>
          <div style={pos({ left: 0, right: 0, top: 0, height: 92, background: BACON, borderRadius: "18px 18px 0 0", display: "flex", alignItems: "center", justifyContent: "center" })}><Slab txt={item} size={fsz(item, 640, 52)} color={CREAM} /></div>
          <div style={pos({ left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" })}>
            <div style={{ position: "relative" }}><Slab txt={price} size={190} color={INK} />{tPer ? <Strike f={f} at={at(tPer)} /> : null}</div>
          </div>
          <div style={pos({ left: 0, right: 0, top: 340, display: "flex", justifyContent: "center", opacity: cl((f - at(tLb)) / 8) })}><Pen txt={lb} size={64} color={BLUE} f={f} at={at(tLb)} /></div>
        </div>
        {per && tPer ? <div style={pos({ left: 840, top: 520, ...pop(f, at(tPer) + 6) })}><div style={{ padding: "18px 34px", background: GOLD, borderRadius: 16, transform: "rotate(6deg)", boxShadow: SH }}><Slab txt={per} size={66} color={INK} /></div></div> : null}
      </div>
    </AbsoluteFill>
  );
};

// Ticket de la balanza que se imprime fila por fila
export const Ticket: React.FC<B & { head: string; rows: { t: number; a: string; b: string }[]; total?: { t: number; a: string; b: string }; foot?: string }> = ({ a, a0, head, rows, total, foot }) => {
  const { f, at } = useT0(a, a0);
  const n = rows.length + (total ? 1.6 : 0) + (foot ? 0.8 : 0);
  const shown = rows.filter((r) => f >= at(r.t)).length + (total && f >= at(total.t) ? 1.6 : 0) + (foot && total && f >= at(total.t) + 12 ? 0.8 : 0);
  const H = 190 + n * 104; const vis = 190 + shown * 104;
  return (
    <AbsoluteFill>
      <Kitchen f={f} />
      <div style={pos({ left: 560, top: 60, width: 800, height: 150, borderRadius: 26, background: `linear-gradient(180deg, #F2F3F1, #BFC4C6)`, boxShadow: SH, zIndex: 2 })}>
        <div style={pos({ left: 40, top: 30, width: 260, height: 80, borderRadius: 10, background: "linear-gradient(180deg,#1d2a22,#0f1712)", boxShadow: "inset 0 3px 8px rgba(0,0,0,.8)", display: "flex", alignItems: "center", justifyContent: "center" })}><Slab txt={total ? total.b : rows[0]?.b ?? ""} size={46} color="#7CF2A6" style={{ opacity: 0.9 }} /></div>
        <div style={pos({ left: 330, bottom: 22, width: 440, height: 14, borderRadius: 7, background: "#2a2a2a" })} />
      </div>
      <div style={pos({ left: 600, top: 196, width: 720, height: Math.min(H, vis + 40), overflow: "hidden", zIndex: 1 })}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: H, background: BUTCHER, boxShadow: SH, padding: "50px 56px", boxSizing: "border-box",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 96% 98%, 92% 100%, 88% 98%, 84% 100%, 80% 98%, 76% 100%, 72% 98%, 68% 100%, 64% 98%, 60% 100%, 56% 98%, 52% 100%, 48% 98%, 44% 100%, 40% 98%, 36% 100%, 32% 98%, 28% 100%, 24% 98%, 20% 100%, 16% 98%, 12% 100%, 8% 98%, 4% 100%, 0 98%)" }}>
          <Slab txt={head} size={fsz(head, 600, 54)} color={BACON} style={{ textAlign: "center", width: "100%" }} />
          <div style={{ height: 3, background: "repeating-linear-gradient(90deg, #555 0 10px, transparent 10px 18px)", margin: "26px 0 18px" }} />
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", height: 104, opacity: f >= at(r.t) ? 1 : 0 }}>
              <Pen txt={r.a} size={fsz(r.a, 360, 50, 0.48)} color={INK} />
              <Slab txt={r.b} size={fsz(r.b, 230, 56)} color={INK} />
            </div>
          ))}
          {total ? (
            <div style={{ borderTop: `5px double ${INK}`, marginTop: 6, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: f >= at(total.t) ? 1 : 0 }}>
              <Slab txt={total.a} size={fsz(total.a, 280, 50)} color={BACON} />
              <div style={{ ...pop(f, at(total.t) + 4) }}><Slab txt={total.b} size={fsz(total.b, 300, 92)} color={BACON} /></div>
            </div>
          ) : null}
          {foot ? <div style={{ marginTop: 18, opacity: total && f >= at(total.t) + 12 ? 1 : 0, textAlign: "center" }}><Pen txt={foot} size={fsz(foot, 600, 46, 0.46)} color={BLUE} f={f} at={total ? at(total.t) + 12 : 0} /></div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Tarjeta de receta de Helen (fichero rayado) que se escribe línea por línea
export const RecipeCard: React.FC<B & { title: string; lines: { t: number; txt: string }[] }> = ({ a, a0, title, lines }) => {
  const { f, at } = useT0(a, a0);
  const u = sp(f, at(lines[0]?.t ?? a) - 8, 14, 120);
  const ls = Math.min(62, 560 / Math.max(5, lines.length * 1.0) * 0.62);
  return (
    <AbsoluteFill>
      <Bg m={WOOD} f={f} x={20} />
      <div style={pos({ left: 1380, top: 640, transform: `rotate(-14deg) translateY(${(1 - u) * 300}px)` })}><Potato w={360} kind="gold" /></div>
      <div style={pos({ left: 260, top: 110, width: 1220, height: 860, background: `linear-gradient(180deg, transparent 0 150px, rgba(200,40,40,.55) 150px 153px, transparent 153px), repeating-linear-gradient(180deg, transparent 0 ${ls * 1.45 - 3}px, rgba(70,120,190,.38) ${ls * 1.45 - 3}px ${ls * 1.45}px), ${CREAM}`,
        backgroundPosition: "0 0, 0 160px, 0 0", boxShadow: SH, transform: `rotate(${-2 + (1 - u) * -12}deg) translateX(${(1 - u) * -900}px)`, borderRadius: 6 })}>
        <div style={pos({ left: 0, top: 0, bottom: 0, width: 120, borderRight: "3px solid rgba(200,40,40,.45)" })} />
        <div style={pos({ left: 160, top: 46 })}><Slab txt={title} size={fsz(title, 1000, 70)} color={BACON} /></div>
        <div style={pos({ left: 160, top: 160 + ls * 0.25 })}>
          {lines.map((l, i) => (
            <div key={i} style={{ height: ls * 1.45, display: "flex", alignItems: "flex-end" }}>
              <Pen txt={l.txt} size={fsz(l.txt, 1000, ls, 0.47)} color={i % 2 ? "#22314F" : INK} f={f} at={at(l.t)} dur={18} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Las tres papas en la tabla con su etiqueta de uso
export const Trio: React.FC<B & { items: { t: number; kind: "russet" | "gold" | "red"; name: string; use: string }[]; best?: number }> = ({ a, a0, items, best }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={WOOD} f={f} x={50} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent, rgba(0,0,0,.35))" }} />
      {items.map((it, i) => {
        const x = 150 + i * 560; const on = f >= at(it.t) - 4;
        return (
          <div key={i} style={pos({ left: x, top: 150, width: 500, height: 800, ...drop(f, at(it.t) - 4, -700, i % 2 ? -10 : 10), opacity: on ? 1 : 0 })}>
            <div style={pos({ left: 40, top: 60 })}><Potato w={420} kind={it.kind} rot={i === 1 ? -6 : 8} /></div>
            <div style={pos({ left: 30, top: 420, width: 440, padding: "26px 0", background: BUTCHER, borderRadius: 10, boxShadow: SH, textAlign: "center", transform: `rotate(${i === 1 ? 2 : -2}deg)` })}>
              <Slab txt={it.name} size={fsz(it.name, 400, 70)} color={it.kind === "red" ? BACON : it.kind === "gold" ? "#9A6E12" : "#6B4423"} />
              <Pen txt={it.use} size={fsz(it.use, 400, 50, 0.46)} color={INK} f={f} at={at(it.t) + 8} style={{ marginTop: 14 }} />
            </div>
            {best === i ? <div style={pos({ left: 300, top: 0, ...pop(f, at(it.t) + 24) })}><div style={{ width: 170, height: 170, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ffe08a, ${GOLD})`, boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(12deg)", border: `6px dashed ${CREAM}` }}><Slab txt="BEST" size={48} color={INK} /></div></div> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// La heladera esmaltada: la papa adentro tachada y "almidón → azúcar"
export const Fridge: React.FC<B & { tNo: number; tSugar: number; tOk?: number; ok?: string }> = ({ a, a0, tNo, tSugar, tOk, ok }) => {
  const { f, at } = useT0(a, a0);
  const door = ez((f - at(tNo) + 14) / 16);
  return (
    <AbsoluteFill>
      <Bg m={BLOCK} f={f} x={20} />
      <div style={pos({ left: 200, top: 70, width: 640, height: 1010, borderRadius: "60px 60px 10px 10px", background: ENAMEL, boxShadow: SH })}>
        <div style={pos({ left: 40, top: 40, right: 40, bottom: 40, borderRadius: "40px 40px 6px 6px", background: FROST, boxShadow: "inset 0 10px 40px rgba(0,40,80,.35)" })}>
          {[0, 1, 2].map((i) => <div key={i} style={pos({ left: 20, right: 20, top: 240 + i * 230, height: 10, background: "linear-gradient(180deg,#fff,#9fb3c1)", borderRadius: 5 })} />)}
          <div style={pos({ left: 140, top: 520 })}><Potato w={260} kind="russet" /></div>
          <div style={pos({ left: 150, top: 470, ...pop(f, at(tNo) + 4) })}><Cross f={f} at={at(tNo) + 4} s={240} /></div>
        </div>
        <div style={pos({ left: 0, top: 0, width: 640, height: 1010, borderRadius: "60px 60px 10px 10px", background: ENAMEL, transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-100 * door}deg)`, boxShadow: SH, opacity: door > 0.98 ? 0 : 1 })}>
          <div style={pos({ right: 50, top: 380, width: 34, height: 220, borderRadius: 16, background: "linear-gradient(90deg,#9aa0a5,#f2f3f4,#8b9196)" })} />
        </div>
      </div>
      <div style={pos({ left: 920, top: 230, ...slideL(f, at(tSugar), 700) })}>
        <Slab txt="COLD TURNS" size={70} color={BLUE} />
        <div style={{ display: "flex", alignItems: "center", marginTop: 34 }}>
          <div style={{ padding: "22px 34px", background: CREAM, borderRadius: 14, boxShadow: SH }}><Slab txt="STARCH" size={62} color={INK} /></div>
          <div style={{ width: 120, height: 14, background: BACON, margin: "0 18px", position: "relative", transform: `scaleX(${ez((f - at(tSugar) - 8) / 10)})`, transformOrigin: "left" }}><div style={pos({ right: -24, top: -20, borderLeft: `40px solid ${BACON}`, borderTop: "27px solid transparent", borderBottom: "27px solid transparent" })} /></div>
          <div style={{ padding: "22px 34px", background: "#F7D9E0", borderRadius: 14, boxShadow: SH, ...pop(f, at(tSugar) + 16) }}><Slab txt="SUGAR" size={62} color={BACON} /></div>
        </div>
        <Pen txt="sweet, and they burn dark" size={62} color={INK} f={f} at={at(tSugar) + 26} dur={20} style={{ marginTop: 40 }} />
        {ok && tOk ? <div style={{ marginTop: 50, display: "flex", alignItems: "center", ...pop(f, at(tOk)) }}><Tick f={f} at={at(tOk)} s={70} /><Slab txt={ok} size={fsz(ok, 760, 66)} color={GREEN} /></div> : null}
      </div>
    </AbsoluteFill>
  );
};

// Perilla de la cocina / dial del horno que gira hasta su marca
export const Dial: React.FC<B & { label: string; steps: { t: number; v: number; txt: string; c?: string }[]; marks: string[]; foot?: string; tFoot?: number }> = ({ a, a0, label, steps, marks, foot, tFoot }) => {
  const { f, at } = useT0(a, a0);
  let ang = -135, cur = steps[0];
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i]; const u = sp(f, at(s.t), 14, 110);
    const prev = i ? -135 + 270 * steps[i - 1].v : -135;
    if (f >= at(s.t)) { ang = prev + (-135 + 270 * s.v - prev) * u; cur = s; }
    else if (i === 0) ang = -135;
  }
  return (
    <AbsoluteFill>
      <Bg m={ENAMEL} f={f} x={30} />
      <div style={pos({ left: 0, right: 0, top: 0, height: 120, background: "linear-gradient(180deg,#d8d1c0,#efe9dc)", boxShadow: "0 8px 14px rgba(0,0,0,.18)" })} />
      <div style={pos({ left: 230, top: 200, width: 680, height: 680 })}>
        {marks.map((m, i) => { const t = -135 + (270 * i) / Math.max(1, marks.length - 1); const r = 330;
          return <div key={i} style={pos({ left: 340 + r * Math.sin((t * Math.PI) / 180) - 120, top: 340 - r * Math.cos((t * Math.PI) / 180) - 26, width: 240, textAlign: "center" })}><Slab txt={m} size={fsz(m, 220, 44)} color={INK} /></div>; })}
        <div style={pos({ left: 80, top: 80, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ffffff, #d3d6d8 55%, #9aa0a4)", boxShadow: `${SH}, inset 0 -10px 20px rgba(0,0,0,.25)`, transform: `rotate(${ang}deg)` })}>
          <div style={pos({ left: 210, top: 30, width: 100, height: 460, borderRadius: 40, background: "linear-gradient(90deg,#2b2b2b,#555 40%,#1e1e1e)", boxShadow: "0 6px 12px rgba(0,0,0,.5)" })} />
          <div style={pos({ left: 244, top: 46, width: 32, height: 90, borderRadius: 16, background: BACON })} />
        </div>
      </div>
      <div style={pos({ left: 1020, top: 250, width: 800 })}>
        <Pen txt={label} size={60} color={BLUE} f={f} at={at(steps[0].t) - 6} />
        {steps.map((s, i) => (
          <div key={i} style={{ marginTop: 30, opacity: f >= at(s.t) ? (s === cur ? 1 : 0.45) : 0, transform: s === cur ? "scale(1)" : "scale(.82)", transformOrigin: "left", position: "relative" }}>
            <Slab txt={s.txt} size={fsz(s.txt, 780, 104)} color={s.c ?? INK} />
            {s !== cur && f >= at(s.t) ? <Strike f={f} at={at(steps[i + 1]?.t ?? 0)} /> : null}
          </div>
        ))}
        {foot && tFoot ? <Pen txt={foot} size={fsz(foot, 780, 56, 0.46)} color={INK} f={f} at={at(tFoot)} dur={20} style={{ marginTop: 44 }} /> : null}
      </div>
      {cur && cur.v < 0.5 ? <div style={pos({ left: 470, top: 930, width: 200, height: 60, display: "flex", justifyContent: "center", gap: 10 })}>{Array.from({ length: 7 }, (_, i) => <div key={i} style={{ width: 16, height: 36 + 10 * Math.sin(f / 3 + i), borderRadius: "50% 50% 40% 40%", background: "linear-gradient(180deg, rgba(120,170,255,.2), #3b6fe0)" }} />)}</div> : null}
    </AbsoluteFill>
  );
};

// Ecuación grande en papel de carnicería: 1 lb tocino = ½ taza = 8 cucharadas = 8 sartenes
export const Equation: React.FC<B & { parts: { t: number; big: string; sub: string; c?: string }[]; foot?: string; tFoot?: number }> = ({ a, a0, parts, foot, tFoot }) => {
  const { f, at } = useT0(a, a0);
  const w = Math.min(420, 1700 / parts.length - 60);
  return (
    <AbsoluteFill>
      <Bg m={BUTCHER} f={f} x={40} />
      <div style={pos({ left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", alignItems: "center" })}>
        {parts.map((p, i) => (
          <React.Fragment key={i}>
            {i ? <div style={{ ...pop(f, at(p.t) - 2), margin: "0 14px" }}><Slab txt="=" size={110} color={TAN} /></div> : null}
            <div style={{ width: w, textAlign: "center", ...drop(f, at(p.t), -400, i % 2 ? 6 : -6) }}>
              <div style={{ display: "inline-block", padding: "34px 20px", minWidth: w - 40, borderRadius: 24, background: i === parts.length - 1 ? `linear-gradient(160deg, #fff4c9, ${GOLD})` : CREAM, boxShadow: SH }}>
                <Slab txt={p.big} size={fsz(p.big, w - 60, 130)} color={p.c ?? INK} />
              </div>
              <Pen txt={p.sub} size={fsz(p.sub, w, 52, 0.46)} color={INK} f={f} at={at(p.t) + 6} style={{ marginTop: 30 }} />
            </div>
          </React.Fragment>
        ))}
      </div>
      {foot && tFoot ? <div style={pos({ left: 0, right: 0, top: 820, display: "flex", justifyContent: "center" })}><Pen txt={foot} size={fsz(foot, 1600, 74, 0.46)} color={BACON} f={f} at={at(tFoot)} dur={22} /></div> : null}
    </AbsoluteFill>
  );
};

// Frasco de grasa con etiquetas de cinta: cuánto dura y cuándo tirarlo
export const Jar: React.FC<B & { rows: { t: number; txt: string; bad?: boolean }[]; title?: string }> = ({ a, a0, rows, title }) => {
  const { f, at } = useT0(a, a0);
  const fill = ez((f - at(rows[0].t) + 30) / 40);
  return (
    <AbsoluteFill>
      <Kitchen f={f} />
      <div style={pos({ left: 260, top: 170, width: 520, height: 720 })}>
        <div style={pos({ left: 60, top: 0, width: 400, height: 90, borderRadius: 14, background: "repeating-linear-gradient(90deg, #c9a24a 0 6px, #e8c46a 6px 12px)", boxShadow: "0 8px 14px rgba(0,0,0,.4)", transform: `translateY(${(1 - sp(f, at(rows[0].t), 12, 160)) * -200}px)` })} />
        <div style={pos({ left: 30, top: 80, width: 460, height: 620, borderRadius: "40px 40px 60px 60px", background: "linear-gradient(90deg, rgba(255,255,255,.55), rgba(255,255,255,.12) 20%, rgba(255,255,255,.05) 70%, rgba(255,255,255,.4))", border: "5px solid rgba(255,255,255,.75)", boxShadow: SH, overflow: "hidden" })}>
          <div style={pos({ left: 0, right: 0, bottom: 0, height: `${80 * fill}%`, background: `radial-gradient(ellipse 60% 30% at 40% 0%, #fffdf2, ${FAT} 50%, #e4dbc0)`, boxShadow: "inset 0 10px 20px rgba(255,255,255,.6)" })} />
          <div style={pos({ left: 40, top: 30, width: 50, bottom: 40, borderRadius: 25, background: "linear-gradient(90deg, rgba(255,255,255,.6), transparent)" })} />
        </div>
        {title ? <div style={pos({ left: 70, top: 380, width: 380, padding: "18px 10px", background: "#F1E3B5", textAlign: "center", transform: "rotate(-3deg)", boxShadow: "0 4px 8px rgba(0,0,0,.3)" })}><Pen txt={title} size={fsz(title, 360, 54, 0.46)} color={INK} /></div> : null}
      </div>
      <div style={pos({ left: 900, top: 200, width: 900 })}>
        {rows.map((r, i) => (
          <div key={i} style={{ marginBottom: 44, display: "flex", alignItems: "center", ...slideL(f, at(r.t), 800) }}>
            {r.bad ? <Cross f={f} at={at(r.t) + 6} s={60} /> : <Tick f={f} at={at(r.t) + 6} s={64} />}
            <div style={{ padding: "16px 30px", background: r.bad ? "#F6D7D2" : CREAM, borderRadius: 12, boxShadow: SH, transform: `rotate(${i % 2 ? 1 : -1}deg)` }}><Slab txt={r.txt} size={fsz(r.txt, 700, 64)} color={r.bad ? BACON : INK} /></div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Regla de madera: el pedazo del tamaño de la punta del pulgar (¾")
export const Ruler: React.FC<B & { t: number; tSkin?: number }> = ({ a, a0, t, tSkin }) => {
  const { f, at } = useT0(a, a0);
  const u = ez((f - at(t)) / 18);
  const PX = 520; // una pulgada
  return (
    <AbsoluteFill>
      <Bg m={WOOD} f={f} x={40} />
      <div style={pos({ left: 160, top: 640, width: 1600, height: 170, background: "linear-gradient(180deg,#f3d58a,#d9b25a)", boxShadow: SH, borderRadius: 8 })}>
        {Array.from({ length: 49 }, (_, i) => <div key={i} style={pos({ left: 60 + i * (PX / 16), top: 0, width: 4, height: i % 16 === 0 ? 90 : i % 8 === 0 ? 64 : i % 4 === 0 ? 46 : 28, background: INK })} />)}
        {[0, 1, 2].map((i) => <div key={i} style={pos({ left: 60 + i * PX - 20, top: 100 })}><Slab txt={String(i)} size={50} color={INK} /></div>)}
      </div>
      <div style={pos({ left: 60 + 160, top: 640 - 26, width: PX * 0.75 * u, height: 16, background: BACON, borderRadius: 8 })} />
      <div style={pos({ left: 60 + 160, top: 640 - 40 - PX * 0.75, ...pop(f, at(t) + 6) })}><Cube s={PX * 0.75} c="#E9C779" style={{ borderRadius: 40 }} /></div>
      {tSkin ? <div style={pos({ left: 60 + 160, top: 640 - 40 - PX * 0.75, width: PX * 0.75, height: 60, borderRadius: "40px 40px 6px 6px", background: "linear-gradient(180deg,#9b6b3e,#7a5230)", opacity: ez((f - at(tSkin)) / 10) })} /> : null}
      <div style={pos({ left: 900, top: 170 })}>
        <Slab txt={'¾"'} size={240} color={BACON} style={{ ...pop(f, at(t) + 10) }} />
        <Pen txt="the end of your thumb" size={70} color={INK} f={f} at={at(t) + 4} dur={20} />
        {tSkin ? <Pen txt="skin on · scrub it first" size={58} color={BLUE} f={f} at={at(tSkin)} dur={20} style={{ marginTop: 20 }} /> : null}
      </div>
    </AbsoluteFill>
  );
};

// Sartén de hierro vista de arriba: grasa, papas en una capa, la tapa baja con vapor, reloj de 8 minutos
export const Skillet: React.FC<B & { tFat: number; tPot: number; tWater: number; tLid: number; tMin: number; mins?: number }> = ({ a, a0, tFat, tPot, tWater, tLid, tMin, mins = 8 }) => {
  const { f, at } = useT0(a, a0);
  const fat = ez((f - at(tFat)) / 20), lid = sp(f, at(tLid), 13, 120), splash = ez((f - at(tWater)) / 14);
  const CX = 700, CY = 560, R0 = 400;
  const prog = cl((f - at(tMin)) / 90);
  return (
    <AbsoluteFill>
      <Bg m={ENAMEL} f={f} x={30} />
      {/* rejilla de la hornalla */}
      {[0, 1, 2, 3].map((i) => <div key={i} style={pos({ left: CX - 520, top: CY - 10, width: 1040, height: 20, background: "#222", transform: `rotate(${i * 45}deg)`, borderRadius: 6, boxShadow: "0 4px 8px rgba(0,0,0,.4)" })} />)}
      <div style={pos({ left: CX + R0 - 30, top: CY - 50, width: 520, height: 100, borderRadius: 40, background: `linear-gradient(180deg, #3d3936, ${IRON})`, boxShadow: SH })} />
      <div style={pos({ left: CX - R0, top: CY - R0, width: R0 * 2, height: R0 * 2, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #46413c, ${IRON} 60%, #0c0b0a)`, boxShadow: `${SH}, inset 0 0 0 26px #2a2724, inset 0 0 0 30px #4a4540` })}>
        <div style={pos({ left: 40, top: 40, right: 40, bottom: 40, borderRadius: "50%", background: `radial-gradient(circle at 45% 40%, rgba(255,230,160,${0.5 * fat}), rgba(220,170,60,${0.35 * fat}) 50%, transparent 75%)` })} />
        {Array.from({ length: 34 }, (_, i) => { const r = 60 + rnd(i) * 270, th = rnd(i * 5) * Math.PI * 2; const on = f >= at(tPot) + (i % 10) * 2;
          return <div key={i} style={pos({ left: R0 + r * Math.cos(th) - 34, top: R0 + r * Math.sin(th) - 34, transform: `rotate(${rnd(i) * 80}deg) scale(${on ? sp(f, at(tPot) + (i % 10) * 2, 12, 200) : 0})` })}><Cube s={68} c={f > at(tMin) + 60 ? "#D39A3C" : "#E9C779"} /></div>; })}
        {splash > 0 && splash < 1 ? Array.from({ length: 16 }, (_, i) => <div key={i} style={pos({ left: R0 + Math.cos(i) * 200 * splash, top: R0 + Math.sin(i * 1.7) * 200 * splash, width: 22, height: 22, borderRadius: "50%", background: "rgba(200,230,255,.8)", opacity: 1 - splash })} />) : null}
      </div>
      {/* tapa de vidrio */}
      <div style={pos({ left: CX - R0 - 10, top: CY - R0 - 10, width: R0 * 2 + 20, height: R0 * 2 + 20, borderRadius: "50%", border: "16px solid #9aa3aa", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.45), rgba(255,255,255,.12) 50%, rgba(230,240,250,.25))", boxShadow: SH, opacity: cl(lid * 1.5), transform: `translateY(${(1 - lid) * -500}px) scale(${1.1 - 0.1 * lid})` })}>
        <div style={pos({ left: R0 - 60, top: R0 - 60, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #555, ${IRON})`, boxShadow: "0 10px 16px rgba(0,0,0,.5)" })} />
        {Array.from({ length: 10 }, (_, i) => <div key={i} style={pos({ left: 120 + rnd(i) * 560, top: 120 + rnd(i * 3) * 560, width: 90 + rnd(i) * 80, height: 50 + rnd(i * 2) * 40, borderRadius: "50%", background: "rgba(255,255,255,.35)", opacity: cl((f - at(tLid) - 10) / 20) })} />)}
      </div>
      {/* reloj */}
      <div style={pos({ left: 1340, top: 150, ...pop(f, at(tMin)) })}>
        <div style={{ width: 420, height: 420, borderRadius: "50%", background: `conic-gradient(${BACON} 0 ${prog * 360}deg, ${CREAM} ${prog * 360}deg)`, boxShadow: `${SH}, inset 0 0 0 18px #fff`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 300, height: 300, borderRadius: "50%", background: CREAM, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", boxShadow: "inset 0 6px 12px rgba(0,0,0,.15)" }}>
            <Slab txt={String(mins)} size={150} color={INK} /><Pen txt="minutes" size={44} color={INK} />
          </div>
        </div>
      </div>
      <div style={pos({ left: 1300, top: 640, width: 560 })}>
        {[[tFat, "1 tbsp bacon fat"], [tWater, "¼ cup water"], [tLid, "lid on · medium low"]].map(([t, s], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 22, opacity: f >= at(t as number) ? 1 : 0 }}><Tick f={f} at={at(t as number)} s={46} /><Pen txt={s as string} size={56} color={INK} /></div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Lado a lado: lo que hace la gente vs lo que hace Helen
export const Versus: React.FC<B & { L: { t: number; head: string; big: string; sub: string }; R: { t: number; head: string; big: string; sub: string }; tWin?: number }> = ({ a, a0, L, R, tWin }) => {
  const { f, at } = useT0(a, a0);
  const side = (s: { t: number; head: string; big: string; sub: string }, i: number) => (
    <div style={{ width: 760, height: 760, position: "relative", ...drop(f, at(s.t), -600, i ? 6 : -6) }}>
      <div style={pos({ inset: 0, background: i ? BUTCHER : KRAFT, borderRadius: 18, boxShadow: SH, transform: `rotate(${i ? 1.5 : -1.5}deg)` })} />
      <div style={pos({ left: 0, right: 0, top: 70, textAlign: "center" })}><Slab txt={s.head} size={fsz(s.head, 660, 64)} color={i ? GREEN : CREAM} /></div>
      <div style={pos({ left: 0, right: 0, top: 230, textAlign: "center" })}><Slab txt={s.big} size={fsz(s.big, 680, 190)} color={i ? INK : CREAM} style={{ textShadow: i ? "none" : "0 6px 0 rgba(0,0,0,.25)" }} /></div>
      <div style={pos({ left: 0, right: 0, top: 520, display: "flex", justifyContent: "center" })}><Pen txt={s.sub} size={fsz(s.sub, 660, 60, 0.46)} color={i ? BLUE : "#FFF3DA"} f={f} at={at(s.t) + 10} dur={18} /></div>
      {!i && tWin ? <div style={pos({ left: 60, right: 60, top: 300 })}><Strike f={f} at={at(tWin)} /></div> : null}
      {i && tWin ? <div style={pos({ right: -30, top: -40, ...pop(f, at(tWin) + 6) })}><div style={{ width: 160, height: 160, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SH, border: `6px solid ${CREAM}` }}><Tick f={f} at={at(tWin) + 8} s={80} c={CREAM} /></div></div> : null}
    </div>
  );
  return (
    <AbsoluteFill>
      <Kitchen f={f} />
      <div style={pos({ left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", gap: 120 })}>{side(L, 0)}{side(R, 1)}</div>
      <div style={pos({ left: 905, top: 470, width: 110, height: 110, borderRadius: "50%", background: IRON, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SH, ...pop(f, at(R.t) - 4) })}><Slab txt="VS" size={44} color={GOLD} /></div>
    </AbsoluteFill>
  );
};

// Tablero de corcho del mercado con notas amarillas: lista que se va clavando
export const Cork: React.FC<B & { head: string; items: { t: number; txt: string; no?: boolean }[] }> = ({ a, a0, head, items }) => {
  const { f, at } = useT0(a, a0);
  const cols = items.length > 4 ? 2 : 1; const w = cols === 2 ? 760 : 1100;
  return (
    <AbsoluteFill>
      <Bg m={BLOCK} f={f} x={30} />
      <div style={pos({ left: 110, top: 60, width: 1700, height: 960, background: CORK, borderRadius: 10, boxShadow: `${SH}, inset 0 0 0 26px #7a5634, inset 0 0 0 30px #5c3f24, inset 0 0 50px rgba(0,0,0,.35)` })}>
        <div style={pos({ left: 0, right: 0, top: 70, display: "flex", justifyContent: "center" })}><Note w={760} rot={-1.5} c={CREAM}><Slab txt={head} size={fsz(head, 700, 64)} color={BACON} style={{ textAlign: "center" }} /></Note></div>
        <div style={pos({ left: 90, right: 90, top: 260, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "34px 60px" })}>
          {items.map((it, i) => (
            <div key={i} style={{ ...drop(f, at(it.t), -300, i % 2 ? 7 : -7) }}>
              <Note w={w} rot={(rnd(i) - 0.5) * 4} c={it.no ? "#F6C9C0" : "#F7E27A"}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {it.no ? <Cross f={f} at={at(it.t) + 8} s={50} /> : <Tick f={f} at={at(it.t) + 8} s={54} />}
                  <Pen txt={it.txt} size={fsz(it.txt, w - 150, 58, 0.47)} color={INK} />
                </div>
              </Note>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Ganchos de comanda: problema → arreglo (el riel de tickets de la cocina)
export const Trouble: React.FC<B & { rows: { t: number; a: string; b: string }[] }> = ({ a, a0, rows }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={BLOCK} f={f} x={60} />
      <div style={pos({ left: 80, right: 80, top: 120, height: 34, background: STEEL, borderRadius: 8, boxShadow: SH })} />
      <div style={pos({ left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", gap: 46 })}>
        {rows.map((r, i) => {
          const u = sp(f, at(r.t), 12, 130); const sw = Math.sin((f - at(r.t)) / 9) * 3 * Math.exp(-(f - at(r.t)) / 40);
          const w = Math.min(540, 1640 / rows.length - 46);
          return (
            <div key={i} style={{ width: w, transformOrigin: "50% 0", transform: `translateY(${(1 - u) * -900}px) rotate(${sw}deg)`, opacity: f >= at(r.t) - 2 ? 1 : 0 }}>
              <div style={{ background: BUTCHER, boxShadow: SH, padding: "60px 30px 50px", marginTop: 14, minHeight: 600, boxSizing: "border-box",
                clipPath: "polygon(0 0, 100% 0, 100% 97%, 94% 100%, 88% 97%, 82% 100%, 76% 97%, 70% 100%, 64% 97%, 58% 100%, 52% 97%, 46% 100%, 40% 97%, 34% 100%, 28% 97%, 22% 100%, 16% 97%, 10% 100%, 4% 97%, 0 100%)" }}>
                <Pen txt={`#${i + 1}`} size={44} color={BLUE} />
                <Slab txt={r.a} size={fsz(r.a, w - 60, 66)} color={BACON} style={{ marginTop: 10, whiteSpace: "normal" }} />
                <div style={{ height: 3, background: "repeating-linear-gradient(90deg, #777 0 10px, transparent 10px 18px)", margin: "28px 0" }} />
                {r.b.split(" · ").map((x, j) => <Pen key={j} txt={x} size={fsz(x, w - 60, 52, 0.47)} color={INK} f={f} at={at(r.t) + 14 + j * 10} style={{ marginTop: 8 }} />)}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Número grande sobre papel de carnicería con cuenta (12 trucos, 20 minutos, $500 al año)
export const BigStat: React.FC<B & { t: number; big: string; pre?: string; sub?: string; tSub?: number; n?: number }> = ({ a, a0, t, big, pre, sub, tSub, n }) => {
  const { f, at } = useT0(a, a0);
  const u = ez((f - at(t)) / 24);
  const txt = n !== undefined ? big.replace("#", String(Math.round(n * u))) : big;
  return (
    <AbsoluteFill>
      <Bg m={BUTCHER} f={f} x={40} />
      <div style={pos({ left: 1380, top: 600, transform: `rotate(18deg) translateX(${(1 - sp(f, at(t), 14, 110)) * 600}px)` })}><Potato w={520} kind="russet" /></div>
      <div style={pos({ left: 1560, top: 240, transform: `rotate(-12deg) translateX(${(1 - sp(f, at(t) + 6, 14, 110)) * 600}px)` })}><Potato w={300} kind="gold" /></div>
      <div style={pos({ left: 170, top: 180, width: 1200 })}>
        {pre ? <Pen txt={pre} size={74} color={BLUE} f={f} at={at(t) - 8} /> : null}
        <div style={{ ...pop(f, at(t)) }}><Slab txt={txt} size={fsz(big, 1150, 300, 0.7)} color={BACON} style={{ textShadow: "0 8px 0 rgba(90,20,15,.25)" }} /></div>
        {sub ? <Pen txt={sub} size={fsz(sub, 1150, 80, 0.46)} color={INK} f={f} at={at(tSub ?? t) + 6} dur={22} style={{ marginTop: 20 }} /> : null}
      </div>
    </AbsoluteFill>
  );
};

// Sobre de la pregunta para los comentarios (tarjeta del fichero de Helen)
export const AskCard: React.FC<B & { q: string; q2?: string; t: number }> = ({ a, a0, q, q2, t }) => {
  const { f, at } = useT0(a, a0); const u = sp(f, at(t) - 6, 14, 110);
  return (
    <AbsoluteFill>
      <Bg m={WOOD} f={f} x={30} />
      <div style={pos({ left: 300, top: 160, width: 1320, height: 760, background: CREAM, boxShadow: SH, borderRadius: 8, transform: `rotate(${-2 + (1 - u) * 10}deg) translateY(${(1 - u) * 900}px)`,
        backgroundImage: "repeating-linear-gradient(180deg, transparent 0 77px, rgba(70,120,190,.35) 77px 80px)" })}>
        <div style={pos({ left: 80, top: 60 })}><Slab txt="TELL ME IN THE COMMENTS" size={70} color={BACON} /></div>
        <div style={pos({ left: 90, top: 230 })}><Pen txt={q} size={fsz(q, 1150, 70, 0.46)} color={INK} f={f} at={at(t) + 6} dur={26} /></div>
        {q2 ? <div style={pos({ left: 90, top: 390 })}><Pen txt={q2} size={fsz(q2, 1150, 70, 0.46)} color="#22314F" f={f} at={at(t) + 34} dur={26} /></div> : null}
        <div style={pos({ right: 90, bottom: 70 })}><Pen txt="— I read every one. Helen" size={56} color={BLUE} f={f} at={at(t) + 60} dur={20} /></div>
      </div>
    </AbsoluteFill>
  );
};
