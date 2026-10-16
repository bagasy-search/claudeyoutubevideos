// helen5 · componentes PROPIOS (25 trucos: 20 dólares de carne para toda la semana, cocinando para una). PURO CSS: cero imágenes.
// Identidad distinta de helen4: la COCINA DE HELEN y la semana. Materiales dibujados con gradientes: mantel a cuadros rojo, linóleo,
// esmalte de heladera, cinta de papel, papel kraft de bolsa, etiqueta térmica de balanza, cartón de huevos, hojalata de molde.
// Fuentes (2): Bebas Neue (rótulos) + Patrick Hand (letra de Helen). Paleta: rojo sangre de buey, mostaza, verde pizarra, crema heladera.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadPatrick } from "@remotion/google-fonts/PatrickHand";
import { sp, ez, cl, fr } from "../lkit/core";

const BEB = loadBebas().fontFamily;
const PEN = loadPatrick().fontFamily;
const OX = "#7A1F1F", MUS = "#D9A520", SLATE = "#2E4A5A", CREAM = "#FBF6EA", INK = "#262019", GREEN = "#3C6E57", PINK = "#E39A86", SKY = "#BFD9E8", TAPEC = "#EADFB8";
const SH = "0 2px 3px rgba(0,0,0,.25), 0 12px 24px rgba(0,0,0,.25), 0 40px 70px rgba(0,0,0,.30)";
type B = { a: number; a0?: number; d: number };
const useT0 = (a: number, a0?: number) => { const f0 = useCurrentFrame(); const s = a0 ?? a; return { f: f0 + fr(a) - fr(s), at: (t: number) => fr(t) - fr(s) }; };
const rnd = (i: number) => { const x = Math.sin(i * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const pos = (p: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...p });

// ── materiales ──
const GINGHAM = "repeating-linear-gradient(0deg, rgba(160,30,30,.55) 0 44px, transparent 44px 88px), repeating-linear-gradient(90deg, rgba(160,30,30,.55) 0 44px, transparent 44px 88px), repeating-linear-gradient(45deg, rgba(255,255,255,.05) 0 2px, transparent 2px 6px), #F4E9E0";
const LINO = "conic-gradient(#E8E1D3 0 25%, #B9AE98 0 50%, #E8E1D3 0 75%, #B9AE98 0) 0 0/180px 180px";
const ENAMEL = "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(255,255,255,.7), transparent), linear-gradient(90deg, #E9E4D6, #FBF8F0 30%, #EFEADC 70%, #DCD6C6)";
const KRAFTB = "radial-gradient(ellipse at 30% 20%, rgba(255,240,210,.3), transparent 55%), repeating-linear-gradient(95deg, rgba(90,60,30,.07) 0 2px, transparent 2px 6px), repeating-linear-gradient(5deg, rgba(255,255,255,.05) 0 1px, transparent 1px 4px), #B98F5E";
const SLATEBG = "radial-gradient(ellipse 50% 40% at 25% 25%, rgba(255,255,255,.08), transparent), repeating-linear-gradient(-8deg, rgba(255,255,255,.02) 0 2px, transparent 2px 8px), linear-gradient(160deg, #36566A, #22394A)";
const FROST = "radial-gradient(circle at 20% 30%, rgba(255,255,255,.7) 0 1.5px, transparent 2.5px) 0 0/34px 30px, radial-gradient(circle at 70% 60%, rgba(255,255,255,.5) 0 1px, transparent 2px) 0 0/22px 26px, linear-gradient(180deg, #E8F2F8, #BCD3E2)";
const Light: React.FC<{ x?: number; y?: number; o?: number }> = ({ x = 70, y = 0, o = 0.28 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse 70% 80% at ${x}% ${y}%, rgba(255,246,225,${o}), transparent 60%), linear-gradient(180deg, transparent 60%, rgba(0,0,0,.25))` }} />
);
const Bg: React.FC<{ m: string; f: number; x?: number }> = ({ m, f, x }) => (
  <>
    <AbsoluteFill style={{ transform: `scale(${1.05 + 0.0001 * f}) translateX(${0.02 * f}px)` }}><AbsoluteFill style={{ background: m }} /></AbsoluteFill>
    <Light x={x} />
  </>
);
const Table: React.FC<{ f: number; top?: number }> = ({ f, top = 0 }) => (
  <AbsoluteFill style={{ perspective: 1600, background: "radial-gradient(ellipse 60% 70% at 50% 10%, rgba(255,240,215,.5), transparent 70%), repeating-linear-gradient(90deg, rgba(120,90,60,.06) 0 3px, transparent 3px 120px), linear-gradient(180deg, #E9DCC6, #CDB99A)" }}>
    <div style={pos({ left: 0, right: 0, top: 0, height: 60, background: "linear-gradient(180deg,#8a6a48,#6d5236)", boxShadow: "0 6px 12px rgba(0,0,0,.25)" })} />
    <div style={pos({ left: -200, right: -200, top: top - 300, bottom: -300, background: GINGHAM, transform: `rotateX(38deg) translateY(${-0.03 * f}px)`, transformOrigin: "50% 100%", boxShadow: "inset 0 0 200px rgba(0,0,0,.25)" })} />
    <Light x={30} y={0} o={0.3} />
  </AbsoluteFill>
);
const Sheen: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const u = (f - at) / 24; if (u < 0 || u > 1) return null;
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", background: `linear-gradient(110deg, transparent ${u * 140 - 40}%, rgba(255,255,255,.3) ${u * 140 - 30}%, transparent ${u * 140 - 20}%)` }} />;
};
// ── piezas ──
const Big: React.FC<{ txt: string; size: number; color?: string; style?: React.CSSProperties; ls?: number }> = ({ txt, size, color = INK, style, ls = 2 }) => (
  <div style={{ fontFamily: BEB, fontSize: size, color, lineHeight: 0.92, letterSpacing: ls, whiteSpace: "nowrap", ...style }}>{txt}</div>
);
const Pen: React.FC<{ txt: string; size: number; color?: string; f?: number; at?: number; dur?: number; style?: React.CSSProperties }> = ({ txt, size, color = INK, f = 999, at = 0, dur = 14, style }) => (
  <div style={{ fontFamily: PEN, fontSize: size, color, lineHeight: 1.05, whiteSpace: "nowrap", clipPath: `inset(-30% ${100 - 100 * ez((f - at) / dur)}% -30% 0)`, ...style }}>{txt}</div>
);
const Tape: React.FC<{ w: number; children?: React.ReactNode; rot?: number; style?: React.CSSProperties }> = ({ w, children, rot = 0, style }) => (
  <div style={{ width: w, padding: "10px 22px", transform: `rotate(${rot}deg)`, background: `linear-gradient(180deg, rgba(255,255,255,.25), transparent 40%), ${TAPEC}`, boxShadow: "0 4px 8px rgba(0,0,0,.25)",
    clipPath: "polygon(0 4%, 3% 0, 6% 6%, 10% 1%, 100% 0, 98% 30%, 100% 60%, 97% 100%, 4% 98%, 0 70%, 2% 40%)", ...style }}>{children}</div>
);
const Sticker: React.FC<{ children: React.ReactNode; c?: string; rot?: number; style?: React.CSSProperties }> = ({ children, c = MUS, rot = -6, style }) => (
  <div style={{ display: "inline-block", padding: "14px 34px", borderRadius: 14, background: `linear-gradient(160deg, rgba(255,255,255,.35), transparent 40%), ${c}`, transform: `rotate(${rot}deg)`, boxShadow: SH,
    border: "3px dashed rgba(255,255,255,.55)", outline: `6px solid ${c}`, ...style }}>{children}</div>
);
const pop = (f: number, at: number) => { const u = sp(f, at, 10, 200); return { opacity: cl(u * 3), transform: `scale(${0.5 + 0.5 * u})` }; };
const drop = (f: number, at: number, dy = -500, rot = 8) => { const u = sp(f, at, 12, 150); return { opacity: cl(u * 2), transform: `translateY(${dy * (1 - u)}px) rotate(${rot * (1 - u)}deg)` }; };
const flipIn = (f: number, at: number) => { const u = sp(f, at, 14, 120); return { opacity: cl(u * 2), transform: `perspective(1200px) rotateY(${(1 - u) * -80}deg)` }; };
const Tick: React.FC<{ f: number; at: number; s?: number; c?: string }> = ({ f, at, s = 54, c = GREEN }) => {
  const u = sp(f, at, 11, 200);
  return <div style={{ width: s * 0.45, height: s * 0.9, borderRight: `${s * 0.18}px solid ${c}`, borderBottom: `${s * 0.18}px solid ${c}`, transform: `rotate(40deg) scale(${u})`, opacity: cl(u * 3), flex: "none", marginRight: s * 0.3 }} />;
};
const Strike: React.FC<{ f: number; at: number; c?: string }> = ({ f, at, c = OX }) => (
  <div style={pos({ left: -10, right: -10, top: "48%", height: 12, borderRadius: 6, background: c, transformOrigin: "left", transform: `rotate(-5deg) scaleX(${ez((f - at) / 9)})` })} />
);
const Container: React.FC<{ w: number; label?: string; fill?: string; style?: React.CSSProperties }> = ({ w, label, fill = "#8B5A3C", style }) => (
  <div style={{ position: "relative", width: w, height: w * 0.62, ...style }}>
    <div style={pos({ left: 0, right: 0, top: w * 0.08, bottom: 0, borderRadius: 16, background: `linear-gradient(90deg, rgba(255,255,255,.5), rgba(255,255,255,.15) 30%, rgba(255,255,255,.35)), ${fill}`, border: "4px solid rgba(255,255,255,.8)", boxShadow: SH, overflow: "hidden" })}>
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={pos({ left: rnd(i) * (w - 30), top: 10 + rnd(i * 3) * w * 0.4, width: 18 + rnd(i * 5) * 16, height: 12 + rnd(i * 7) * 10, borderRadius: 6, background: i % 3 ? "#6E4026" : "#A8744C" })} />)}
    </div>
    <div style={pos({ left: -6, right: -6, top: 0, height: w * 0.12, borderRadius: 10, background: "linear-gradient(180deg,#5B9BD5,#2F6EA8)", boxShadow: "0 4px 8px rgba(0,0,0,.3)" })} />
    {label ? <Tape w={w * 0.7} rot={-3} style={pos({ left: w * 0.15, top: w * 0.2 })}><Big txt={label} size={w * 0.18} color={INK} /></Tape> : null}
  </div>
);
const Bill: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => (
  <div style={{ position: "relative", width: w, height: w * 0.43, borderRadius: 8, boxShadow: SH, overflow: "hidden", ...style,
    background: "repeating-linear-gradient(45deg, rgba(40,80,50,.10) 0 2px, transparent 2px 7px), repeating-linear-gradient(-45deg, rgba(40,80,50,.08) 0 2px, transparent 2px 7px), linear-gradient(90deg, #C9D8B9, #E4EBD6 50%, #C3D2B3)" }}>
    <div style={pos({ inset: w * 0.03, border: "4px solid rgba(40,80,50,.55)", borderRadius: 6 })} />
    <div style={pos({ left: "38%", top: "16%", width: "24%", height: "68%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(40,80,50,.35), rgba(40,80,50,.1) 70%)", border: "3px solid rgba(40,80,50,.5)" })} />
    {[["8%", "10%"], ["78%", "62%"]].map(([x, y], i) => <Big key={i} txt="20" size={w * 0.16} color="rgba(30,60,40,.85)" style={pos({ left: x, top: y })} />)}
  </div>
);

// ═════════════════ COMPONENTES ═════════════════
// 1 · un billete de 20 sobre el mostrador: se corta en 7 franjas (lun-dom)
export const Twenty: React.FC<B & { t: number }> = ({ a, a0, t }) => {
  const { f, at } = useT0(a, a0);
  const s = sp(f, at(t) + 12, 14, 110);
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  return (
    <AbsoluteFill>
      <Table f={f} />
      <div style={pos({ left: 360, top: 260, width: 1200, height: 516, ...drop(f, 2, -700, -10) })}>
        {days.map((d, i) => (
          <div key={d} style={pos({ left: (1200 / 7) * i + (i - 3) * 22 * s, top: (i % 2 ? 1 : -1) * 18 * s, width: 1200 / 7, height: 516, overflow: "hidden", transform: `rotate(${(i - 3) * 2 * s}deg)` })}>
            <div style={pos({ left: -(1200 / 7) * i, top: 0 })}><Bill w={1200} /></div>
            <Big txt={d} size={64} color={OX} style={pos({ left: 30, top: 440, opacity: s, background: "rgba(251,246,234,.9)", padding: "0 8px", borderRadius: 6 })} />
          </div>
        ))}
      </div>
      <div style={pos({ left: 620, top: 840, ...pop(f, at(t) + 30) })}><Sticker c={OX}><Big txt="ONE BILL · ONE WEEK" size={80} color={CREAM} /></Sticker></div>
    </AbsoluteFill>
  );
};

// 2 · 14 comidas: platos que caen en una grilla de la semana
export const FourteenMeals: React.FC<B & { t: number }> = ({ a, a0, t }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={LINO} f={f} />
      <Big txt="14" size={360} color={OX} style={pos({ left: 110, top: 230, ...pop(f, at(t)) })} />
      <Pen txt="meals with real meat" size={70} f={f} at={at(t) + 8} style={pos({ left: 120, top: 600 })} />
      {Array.from({ length: 14 }, (_, i) => (
        <div key={i} style={pos({ left: 760 + (i % 7) * 160, top: 280 + Math.floor(i / 7) * 260, ...drop(f, at(t) + 4 + i * 2, -600, 20) })}>
          <div style={{ width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, #fff 0 56%, #e7e1d4 58%, #fff 66%, #d6cfc0 100%)", boxShadow: SH, position: "relative" }}>
            <div style={pos({ left: 38, top: 40, width: 64, height: 50, borderRadius: "40%", background: i % 2 ? "#8B5A3C" : "#C98A5C", boxShadow: "inset -4px -6px 8px rgba(0,0,0,.25)" })} />
            <div style={pos({ left: 30, top: 80, width: 40, height: 26, borderRadius: "50%", background: "#7FA35B" })} />
          </div>
          <Big txt={["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][i % 7]} size={38} color={SLATE} style={{ textAlign: "center", marginTop: 8 }} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

// 3 · ruta de la semana: domingo en el mostrador → sábado, 25 mojones
export const WeekRoad: React.FC<B & { t: number }> = ({ a, a0, t }) => {
  const { f, at } = useT0(a, a0);
  const p = ez((f - at(t)) / 45);
  const stops = [["COUNTER", 1], ["SUNDAY", 7], ["WEEKNIGHTS", 14], ["SATURDAY", 25]] as const;
  return (
    <AbsoluteFill>
      <Bg m={SLATEBG} f={f} x={20} />
      <Big txt="25 BUTCHER TRICKS" size={150} color={MUS} style={pos({ left: 120, top: 90, ...pop(f, at(t)) })} />
      <div style={pos({ left: 160, right: 160, top: 560, height: 16, borderRadius: 8, background: "rgba(255,255,255,.18)" })}>
        <div style={pos({ left: 0, top: 0, bottom: 0, width: `${p * 100}%`, borderRadius: 8, background: `linear-gradient(90deg, ${MUS}, ${PINK})` })} />
      </div>
      {Array.from({ length: 25 }, (_, i) => { const x = 160 + (1600 / 24) * i; const on = p * 24 >= i; return (
        <div key={i} style={pos({ left: x - 14, top: 554, width: 28, height: 28, borderRadius: "50%", background: on ? MUS : "rgba(255,255,255,.3)", boxShadow: on ? "0 0 14px rgba(217,165,32,.7)" : "none", transform: `scale(${on ? 1.1 : 0.8})` })} />); })}
      {stops.map(([w, n], i) => (
        <div key={w} style={pos({ left: 160 + (1600 / 24) * (n - 1) - 90, top: i % 2 ? 640 : 400, width: 180, textAlign: "center", ...pop(f, at(t) + 6 + ((n - 1) / 24) * 45) })}>
          <Big txt={w} size={50} color={CREAM} /><Pen txt={`#${n}`} size={44} color={MUS} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

// 4 · ticket térmico de la balanza: se imprime línea por línea, total $19.91
export const ScaleTicket: React.FC<B & { rows: { n: string; w: string; p: string; t: number }[]; tot: string; tTot: number }> = ({ a, a0, rows, tot, tTot }) => {
  const { f, at } = useT0(a, a0);
  const shown = rows.filter((r) => f >= at(r.t) - 2).length;
  const totOn = f >= at(tTot);
  const h = 250 + shown * 92 + (totOn ? 190 : 0);
  return (
    <AbsoluteFill>
      <Bg m="linear-gradient(90deg,#9aa3ab,#d5dade 40%,#a7afb6)" f={f} x={50} />
      <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 1px, transparent 1px 3px)" }} />
      <div style={pos({ left: 470, top: 30, width: 980, height: 110, borderRadius: 18, background: "linear-gradient(180deg,#F1EEE6,#C9C4B8)", boxShadow: SH, zIndex: 3 })}>
        <div style={pos({ left: 60, top: 28, width: 240, height: 54, borderRadius: 6, background: "#1b2a1e", boxShadow: "inset 0 0 10px #000" })}>
          <Big txt={totOn ? tot : rows[Math.max(0, shown - 1)]?.p || "0.00"} size={52} color="#7CFF9A" style={{ textAlign: "center", marginTop: 2, textShadow: "0 0 8px #3f8" }} />
        </div>
        <div style={pos({ left: 340, right: 60, top: 82, height: 10, borderRadius: 5, background: "#111" })} />
      </div>
      <div style={pos({ left: 540, top: 110, width: 840, height: Math.min(960, h), overflow: "hidden", zIndex: 2 })}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "30px 44px 50px", background: "linear-gradient(90deg, rgba(0,0,0,.04), transparent 6%, transparent 94%, rgba(0,0,0,.04)), #FFFFFD", boxShadow: SH }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><Big txt="HELEN'S MEAT MARKET" size={52} color={OX} /><Big txt="MON" size={52} color="#666" /></div>
          <div style={{ borderTop: "3px dashed #aaa", margin: "10px 0" }} />
          {rows.slice(0, shown).map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", height: 92 }}>
              <Big txt={r.n} size={52} style={{ flex: 1 }} /><Pen txt={r.w} size={42} color="#555" style={{ width: 170 }} /><Big txt={r.p} size={60} color={INK} style={{ width: 130, textAlign: "right" }} />
            </div>
          ))}
          {totOn ? <><div style={{ borderTop: "4px solid #222", margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Big txt="TOTAL" size={80} /><Big txt={tot} size={140} color={OX} style={pop(f, at(tTot))} /></div></> : null}
        </div>
      </div>
      {totOn ? <div style={pos({ left: 1440, top: 640, ...pop(f, at(tTot) + 12) })}><Sticker c={GREEN} rot={8}><Big txt="UNDER $20" size={84} color={CREAM} /></Sticker></div> : null}
    </AbsoluteFill>
  );
};

// 5 · plan de la semana en una hoja pegada en la heladera con imán
export const WeekPlan: React.FC<B & { days: [string, string][]; t: number }> = ({ a, a0, days, t }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={ENAMEL} f={f} x={20} />
      <div style={pos({ left: 1650, top: 0, width: 26, bottom: 0, background: "linear-gradient(90deg,#c9c3b2,#f5f1e6,#bdb6a4)" })} />
      <div style={pos({ left: 470, top: 50, width: 980, height: 980, padding: "70px 70px", background: "repeating-linear-gradient(180deg, transparent 0 104px, rgba(80,120,190,.3) 104px 106px), #FFFEF8", boxShadow: SH, transform: "rotate(-1.5deg)", ...drop(f, 0, -900, -6) })}>
        <div style={pos({ left: 440, top: -26, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ff9a8a, ${OX} 65%)`, boxShadow: "0 10px 14px rgba(0,0,0,.4)" })} />
        <Big txt="THIS WEEK'S SUPPERS" size={78} color={OX} />
        {days.map(([d, m], i) => (
          <div key={d} style={{ display: "flex", alignItems: "baseline", height: 104 }}>
            <Big txt={d} size={64} color={SLATE} style={{ width: 160 }} />
            <Pen txt={m} size={66} f={f} at={at(t) + i * 7} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 6 · "I cook for one": globo de diálogo + una sola chuleta envuelta en el mostrador
export const MagicWords: React.FC<B & { line: string; t: number }> = ({ a, a0, line, t }) => {
  const { f, at } = useT0(a, a0);
  const u = sp(f, at(t) - 6, 12, 140);
  return (
    <AbsoluteFill>
      <Bg m={KRAFTB} f={f} />
      <div style={pos({ left: 230, top: 160, transform: `scale(${u})`, transformOrigin: "20% 100%", opacity: cl(u * 2) })}>
        <div style={{ position: "relative", background: CREAM, borderRadius: 60, padding: "70px 110px", boxShadow: SH, border: `8px solid ${INK}` }}>
          <Pen txt={`"${line}"`} size={170} color={OX} f={f} at={at(t)} dur={16} />
          <div style={pos({ left: 120, bottom: -86, width: 0, height: 0, borderLeft: "40px solid transparent", borderRight: "60px solid transparent", borderTop: `90px solid ${INK}` })} />
        </div>
      </div>
      <div style={pos({ left: 1080, top: 620, ...drop(f, at(t) + 14, 400, -10) })}>
        <div style={{ width: 520, height: 300, background: "linear-gradient(118deg, transparent 30%, rgba(255,255,255,.35) 33%, transparent 36%), #F3EBE2", boxShadow: SH, transform: "rotate(-6deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 300, height: 200, borderRadius: "45% 55% 50% 50%", background: "radial-gradient(ellipse at 35% 30%, #F2B8A8, #D9826C 60%, #B9614E)", boxShadow: "inset 0 0 0 16px #F4E6DA, 0 10px 18px rgba(0,0,0,.3)" }} />
        </div>
        <Sticker c={MUS} rot={8} style={pos({ left: 300, top: -60 })}><Big txt="JUST ONE" size={60} /></Sticker>
      </div>
    </AbsoluteFill>
  );
};

// 7 · etiqueta de precio con pistola etiquetadora: $6.00 tachado → ends $2.50
export const EndsPrice: React.FC<B & { a_?: string; ap: string; b: string; bp: string; tA: number; tB: number }> = (p: any) => {
  const { a, a0, ap, b, bp, tA, tB } = p;
  const { f, at } = useT0(a, a0);
  const Lbl: React.FC<{ name: string; price: string; c: string; at0: number; dim?: boolean }> = ({ name, price, c, at0, dim }) => (
    <div style={{ position: "relative", width: 640, padding: "40px 50px", borderRadius: 20, background: `linear-gradient(160deg, rgba(255,255,255,.4), transparent 40%), ${c}`, boxShadow: SH, opacity: dim ? 0.75 : 1, ...flipIn(f, at0) }}>
      <Big txt={name} size={72} color={INK} />
      <Big txt={price} size={210} color={INK} />
    </div>
  );
  return (
    <AbsoluteFill>
      <Bg m={LINO} f={f} />
      <div style={pos({ left: 140, top: 240, transform: "rotate(-4deg)" })}>
        <Lbl name="SLICED BACON" price={ap} c="#F1F0EA" at0={2} dim={f > at(tA) + 10} />
        <div style={pos({ left: 30, right: 30, top: 230 })}><div style={{ position: "relative", height: 1 }}><Strike f={f} at={Math.max(at(tA), at(tB)) + 4} /></div></div>
      </div>
      <div style={pos({ left: 1060, top: 300, transform: "rotate(4deg)" })}><Lbl name={b} price={bp} c={MUS} at0={at(tB)} /></div>
      <div style={pos({ left: 1240, top: 820, ...pop(f, at(tB) + 14) })}><Sticker c={OX}><Big txt="SAME TASTE · HALF THE PRICE" size={56} color={CREAM} /></Sticker></div>
    </AbsoluteFill>
  );
};

// 8 · precio por libra: barras de cinta sobre papel kraft
export const PerLb: React.FC<B & { rows: { n: string; v: number; t: number }[] }> = ({ a, a0, rows }) => {
  const { f, at } = useT0(a, a0);
  const mx = Math.max(...rows.map((r) => r.v));
  return (
    <AbsoluteFill>
      <Bg m={KRAFTB} f={f} />
      <Big txt="PRICE PER POUND" size={110} color={CREAM} style={pos({ left: 120, top: 90, textShadow: "0 4px 12px rgba(0,0,0,.5)" })} />
      {rows.map((r, i) => { const w = 1300 * (r.v / mx) * ez((f - at(r.t)) / 18); return (
        <div key={i} style={pos({ left: 120, top: 330 + i * 300 })}>
          <Pen txt={r.n} size={70} color={CREAM} style={{ marginBottom: 12, textShadow: "0 3px 8px rgba(0,0,0,.5)" }} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: w, height: 120, borderRadius: 10, background: i ? `linear-gradient(180deg, #5c9a7c, ${GREEN})` : `linear-gradient(180deg, #a53a3a, ${OX})`, boxShadow: SH }} />
            <Big txt={`$${r.v.toFixed(2)}`} size={120} color={CREAM} style={{ marginLeft: 30, opacity: cl((f - at(r.t) - 10) / 8), textShadow: "0 4px 12px rgba(0,0,0,.5)" }} />
          </div>
        </div>); })}
      <div style={pos({ left: 1250, top: 800, ...pop(f, at(rows[1].t) + 22) })}><Sticker c={MUS}><Big txt="LESS THAN HALF" size={80} /></Sticker></div>
    </AbsoluteFill>
  );
};

// 9 · un aro de salchicha ahumada que se corta en 8 rodajas = 8 comidas
export const RingSlices: React.FC<B & { n: number; t: number }> = ({ a, a0, n, t }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Table f={f} />
      <div style={pos({ left: 560, top: 180, width: 800, height: 800, ...pop(f, 2) })}>
        <div style={pos({ inset: 0, borderRadius: "50%", background: "radial-gradient(circle, transparent 0 52%, #5A2414 53%, #8A3A1E 62%, #B05A2E 70%, #6E2A15 78%, transparent 79%)", filter: "none" })} />
        {Array.from({ length: n }, (_, i) => { const ang = (i / n) * 360 + 22.5; const u = sp(f, at(t) + i * 3, 12, 160); const r = 330 + 90 * u; return (
          <div key={i} style={pos({ left: 400 + Math.sin(ang * Math.PI / 180) * r - 60, top: 400 - Math.cos(ang * Math.PI / 180) * r - 60, width: 120, height: 120, borderRadius: "50%", opacity: cl(u * 3),
            background: "radial-gradient(circle, #E7A08A 0 10%, #C9705A 11% 70%, #6E2A15 72% 100%)", boxShadow: "0 8px 12px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center" })}>
            <Big txt={`${i + 1}`} size={52} color={CREAM} />
          </div>); })}
        <div style={pos({ left: 250, top: 300, width: 300, textAlign: "center" })}>
          <Big txt="1 RING" size={110} color={OX} /><Pen txt={`= ${n} servings`} size={60} f={f} at={at(t) + 20} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 10 · una porción = un mazo de cartas (3 oz) sobre la balanza de cocina
export const DeckSize: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  const ang = -60 + 70 * sp(f, at(t), 14, 90);
  return (
    <AbsoluteFill>
      <Table f={f} />
      <div style={pos({ left: 250, top: 300, ...pop(f, 2) })}>
        <div style={{ width: 640, height: 420, borderRadius: 40, background: "linear-gradient(180deg,#fdfdfd,#d9dcde)", boxShadow: SH, position: "relative" }}>
          <div style={pos({ left: 190, top: 160, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle,#fff 0 60%,#ccc 62%,#fff 70%)", border: "8px solid #bbb" })}>
            <div style={pos({ left: 124, top: 20, width: 10, height: 110, background: OX, transformOrigin: "5px 110px", transform: `rotate(${ang}deg)` })} />
            <Big txt="OZ" size={40} color="#888" style={pos({ left: 106, top: 160 })} />
          </div>
          <div style={pos({ left: 60, right: 60, top: -50, height: 70, borderRadius: 14, background: "linear-gradient(180deg,#eef0f1,#bfc4c8)" })} />
          <div style={pos({ left: 210, top: -150, width: 220, height: 120, borderRadius: 20, background: "radial-gradient(ellipse at 35% 30%, #D8A27E, #9E5E3E 70%)", boxShadow: "0 10px 14px rgba(0,0,0,.35)", ...pop(f, at(t) - 4) })} />
        </div>
        <Big txt="3 OZ" size={150} color={OX} style={{ marginTop: 30, ...pop(f, at(t)) }} />
      </div>
      <div style={pos({ left: 1150, top: 260, ...flipIn(f, at(t2)) })}>
        <div style={{ width: 360, height: 500, borderRadius: 24, background: "repeating-linear-gradient(45deg, #A33 0 10px, #C44 10px 20px)", border: "16px solid #fff", boxShadow: SH }} />
        <Pen txt="the size of a deck of cards" size={58} color={INK} style={{ marginTop: 30, background: CREAM, padding: "6px 18px", borderRadius: 10, marginLeft: -120 }} f={f} at={at(t2) + 8} />
      </div>
    </AbsoluteFill>
  );
};

// 11 · 1 libra → 4 cenas: cuatro tuppers con cinta, cada uno con su noche
export const FourNights: React.FC<B & { rows: { d: string; m: string; t: number }[]; t: number }> = ({ a, a0, rows, t }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={FROST} f={f} x={40} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 0 46%, rgba(255,255,255,.6) 46% 47.5%, rgba(120,150,170,.3) 47.5% 48.5%, transparent 48.5% 90%, rgba(255,255,255,.6) 90% 91.5%, transparent 91.5%)" }} />
      <Big txt="1 LB GROUND BEEF" size={110} color={SLATE} style={pos({ left: 120, top: 60, ...pop(f, 2) })} />
      {rows.map((r, i) => (
        <div key={i} style={pos({ left: 110 + i * 440, top: 300 + (i % 2) * 40, ...drop(f, at(r.t) - 4, -500, i % 2 ? 6 : -6) })}>
          <Container w={400} label={r.d} />
          <Pen txt={r.m} size={70} color={OX} f={f} at={at(r.t) + 4} style={{ marginTop: 30, textAlign: "center" }} />
        </div>
      ))}
      <div style={pos({ left: 680, top: 840, ...pop(f, at(t)) })}><Sticker c={OX}><Big txt="ONE POUND · FOUR SUPPERS" size={74} color={CREAM} /></Sticker></div>
    </AbsoluteFill>
  );
};

// 12 · dorado vs gris: dos sartenes partidas al medio
export const BrownGray: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  const Pan: React.FC<{ c1: string; c2: string; x: number; at0: number; lbl: string; sub: string; good?: boolean }> = ({ c1, c2, x, at0, lbl, sub, good }) => (
    <div style={pos({ left: x, top: 220, ...pop(f, at0) })}>
      <div style={{ position: "relative", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, #2b2b2b 0 60%, #111 62%, #3a3a3a 70%, #0d0d0d 100%)", boxShadow: SH }}>
        <div style={pos({ inset: 90, borderRadius: "50%", overflow: "hidden", background: c2 })}>
          {Array.from({ length: 60 }, (_, i) => <div key={i} style={pos({ left: rnd(i) * 460, top: rnd(i * 3) * 460, width: 30 + rnd(i * 5) * 30, height: 24 + rnd(i * 7) * 20, borderRadius: "40%", background: i % 3 ? c1 : c2, boxShadow: good ? "inset -3px -4px 5px rgba(40,15,0,.6)" : "none" })} />)}
        </div>
        <div style={pos({ right: -220, top: 300, width: 260, height: 70, borderRadius: 30, background: "linear-gradient(180deg,#333,#0b0b0b)" })} />
      </div>
      <Big txt={lbl} size={110} color={good ? "#7A3C12" : "#777"} style={{ marginTop: 20 }} /><Pen txt={sub} size={56} />
    </div>
  );
  return (
    <AbsoluteFill>
      <Bg m={ENAMEL} f={f} />
      <Pan c1="#6B3510" c2="#8B4A1F" x={110} at0={at(t)} lbl="BROWN = FLAVOR" sub="leave it 3-4 minutes" good />
      <Pan c1="#9D8F84" c2="#B2A69B" x={1080} at0={at(t2)} lbl="GRAY = NOTHING" sub="stirred too soon" />
    </AbsoluteFill>
  );
};

// 13 · ficha de receta: carne + avena + huevo → 5 albóndigas en vez de 3
export const OatsCard: React.FC<B & { rows: { q: string; w: string; t: number }[]; t3: number }> = ({ a, a0, rows, t3 }) => {
  const { f, at } = useT0(a, a0);
  const Ball: React.FC<{ i: number; at0: number }> = ({ i, at0 }) => <div style={{ width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #C98A6A, #8C4A30 70%)", boxShadow: "0 10px 14px rgba(0,0,0,.35)", ...pop(f, at0 + i * 3) }} />;
  return (
    <AbsoluteFill>
      <Table f={f} />
      <div style={pos({ left: 130, top: 120, width: 900, padding: "60px 60px 50px 110px", transform: "rotate(-2deg)", boxShadow: SH, ...drop(f, 0, -800, -6),
        background: "linear-gradient(90deg, transparent 84px, rgba(200,50,50,.5) 84px 87px, transparent 87px), repeating-linear-gradient(180deg, transparent 0 74px, rgba(80,120,190,.3) 74px 76px), #FFFDF5" })}>
        <Big txt="MOM'S MEATBALLS" size={90} color={OX} />
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", height: 120 }}>
            <Pen txt={r.q} size={100} color={SLATE} f={f} at={at(r.t)} style={{ width: 260 }} /><Pen txt={r.w} size={80} f={f} at={at(r.t) + 6} />
          </div>
        ))}
      </div>
      <div style={pos({ left: 1120, top: 260, padding: "40px 50px", borderRadius: 24, background: CREAM, boxShadow: SH })}>
        <div style={{ display: "flex", gap: 14, opacity: 0.55 }}>{[0, 1, 2].map((i) => <Ball key={i} i={i} at0={8} />)}</div>
        <Pen txt="without" size={56} style={{ marginBottom: 40 }} />
        <div style={{ display: "flex", gap: 14 }}>{[0, 1, 2, 3, 4].map((i) => <Ball key={i} i={i} at0={at(t3) - 10} />)}</div>
        <Pen txt="with oats + egg" size={56} color={GREEN} />
      </div>
    </AbsoluteFill>
  );
};

// 14 · perilla del horno a 425 °F + termómetro de carne que sube a 175 °F
export const OvenDial: React.FC<B & { temp: number; int_: number; tT: number; tI: number }> = ({ a, a0, temp, int_, tT, tI }) => {
  const { f, at } = useT0(a, a0);
  const r = -140 + 280 * ((temp - 200) / 350) * sp(f, at(tT), 14, 80);
  const lvl = ez((f - at(tI)) / 30);
  return (
    <AbsoluteFill>
      <Bg m="linear-gradient(180deg,#F3F0E8,#DCD6C8)" f={f} />
      <div style={pos({ left: 0, right: 0, top: 640, bottom: 0, background: "linear-gradient(180deg,#2a2a2a,#111)", boxShadow: "inset 0 10px 30px rgba(0,0,0,.6)" })}>
        <div style={pos({ left: 140, right: 140, top: 60, bottom: 40, borderRadius: 20, background: "radial-gradient(ellipse, rgba(255,140,60,.35), rgba(0,0,0,.2) 70%)", border: "10px solid #555" })} />
      </div>
      <div style={pos({ left: 200, top: 120, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%, #fff, #c8ccd0 70%)", boxShadow: SH, ...pop(f, 2) })}>
        {[200, 250, 300, 350, 400, 450, 500, 550].map((v) => { const ag = -140 + 280 * ((v - 200) / 350); return <Big key={v} txt={`${v}`} size={38} color={INK} style={pos({ left: 230 + Math.sin(ag * Math.PI / 180) * 180 - 26, top: 230 - Math.cos(ag * Math.PI / 180) * 180 - 18 })} />; })}
        <div style={pos({ left: 130, top: 130, width: 200, height: 200, borderRadius: "50%", background: "linear-gradient(180deg,#f5f5f5,#b9bec2)", boxShadow: "0 10px 16px rgba(0,0,0,.35)", transform: `rotate(${r}deg)` })}>
          <div style={pos({ left: 90, top: 6, width: 20, height: 90, borderRadius: 10, background: OX })} />
        </div>
      </div>
      <Big txt={`${temp}°F`} size={170} color={OX} style={pos({ left: 720, top: 220, ...pop(f, at(tT)) })} />
      <div style={pos({ left: 1350, top: 80, width: 120, height: 560, ...pop(f, at(tI) - 4) })}>
        <div style={pos({ left: 30, top: 0, width: 60, height: 480, borderRadius: 30, background: "#fff", boxShadow: SH, overflow: "hidden" })}>
          <div style={pos({ left: 14, right: 14, bottom: 10, height: `${20 + 70 * lvl}%`, borderRadius: 20, background: `linear-gradient(180deg, #e0523c, ${OX})` })} />
        </div>
        <div style={pos({ left: 10, top: 440, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ff7a62, ${OX})`, boxShadow: SH })} />
      </div>
      <div style={pos({ left: 1500, top: 220, ...pop(f, at(tI) + 20) })}><Big txt={`${int_}°F`} size={130} color={GREEN} /><Pen txt="thickest thigh" size={50} /></div>
    </AbsoluteFill>
  );
};

// 15 · frascos de caldo que se llenan: 2 cuartos gratis
export const BrothJars: React.FC<B & { jars: number; t: number }> = ({ a, a0, jars, t }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={ENAMEL} f={f} />
      <div style={pos({ left: 0, right: 0, top: 820, bottom: 0, background: "linear-gradient(180deg,#d9d1c0,#bfb6a2)" })} />
      {Array.from({ length: jars }, (_, i) => { const lv = ez((f - at(t) - i * 10) / 30); return (
        <div key={i} style={pos({ left: 330 + i * 520, top: 230, ...pop(f, 2 + i * 4) })}>
          <div style={{ position: "relative", width: 420, height: 600 }}>
            <div style={pos({ left: 70, right: 70, top: 0, height: 70, borderRadius: 10, background: "linear-gradient(180deg,#e8d38a,#b8962e)", boxShadow: SH })} />
            <div style={pos({ left: 0, right: 0, top: 60, bottom: 0, borderRadius: "50px 50px 40px 40px", overflow: "hidden", background: "linear-gradient(90deg, rgba(255,255,255,.55), rgba(220,235,245,.2) 30%, rgba(255,255,255,.45))", border: "6px solid rgba(255,255,255,.9)", boxShadow: SH })}>
              <div style={pos({ left: 0, right: 0, bottom: 0, height: `${lv * 88}%`, background: "linear-gradient(180deg, rgba(236,180,80,.9), rgba(190,120,40,.95))" })} />
              <div style={pos({ left: 30, top: 20, width: 40, bottom: 20, borderRadius: 20, background: "rgba(255,255,255,.35)" })} />
            </div>
            <Tape w={260} rot={-4} style={pos({ left: 80, top: 330 })}><Big txt="1 QUART" size={60} /></Tape>
          </div>
        </div>); })}
      <div style={pos({ left: 1450, top: 120, ...pop(f, at(t) + 30) })}><Sticker c={GREEN}><Big txt="FREE" size={120} color={CREAM} /></Sticker></div>
    </AbsoluteFill>
  );
};

// 16 · tiras de cinta con el día sobre las tapas, en la heladera
export const TapeLids: React.FC<B & { days: string[]; t: number }> = ({ a, a0, days, t }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={FROST} f={f} />
      {days.map((d, i) => (
        <div key={d} style={pos({ left: 120 + (i % 3) * 580, top: 160 + Math.floor(i / 3) * 430 })}>
          <Container w={480} fill={["#8B5A3C", "#C98A5C", "#B4552F", "#D2B48C", "#7FA35B"][i]} style={pop(f, 2 + i * 2)} />
          <div style={pos({ left: 70, top: 60, ...drop(f, at(t) + i * 6, -200, 10) })}><Tape w={340} rot={i % 2 ? 4 : -4}><Big txt={d} size={100} color={OX} /></Tape></div>
        </div>
      ))}
      <div style={pos({ left: 1300, top: 640, ...pop(f, at(t) + 40) })}><Pen txt="the day you EAT it" size={74} color={SLATE} /></div>
    </AbsoluteFill>
  );
};

// 17 · orden de la semana: lo más perecedero primero (escalera de colores)
export const EatOrder: React.FC<B & { rows: { n: string; d: string; t: number }[] }> = ({ a, a0, rows }) => {
  const { f, at } = useT0(a, a0);
  const cs = [OX, MUS, SLATE];
  return (
    <AbsoluteFill>
      <Bg m={LINO} f={f} />
      <Big txt="EAT IN THIS ORDER" size={120} color={INK} style={pos({ left: 120, top: 70 })} />
      {rows.map((r, i) => { const u = sp(f, at(r.t), 14, 130); return (
        <div key={i} style={pos({ left: 140 + i * 160, top: 280 + i * 230, width: 1400 - i * 160, height: 190, borderRadius: 20, background: `linear-gradient(160deg, rgba(255,255,255,.25), transparent 40%), ${cs[i]}`, boxShadow: SH,
          opacity: cl(u * 2), transform: `translateX(${(1 - u) * -1200}px)`, display: "flex", alignItems: "center", padding: "0 50px", justifyContent: "space-between" })}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}><Big txt={`${i + 1}`} size={140} color="rgba(255,255,255,.4)" /><Big txt={r.n.toUpperCase()} size={90} color={CREAM} /></div>
          <Pen txt={r.d} size={70} color={CREAM} />
        </div>); })}
    </AbsoluteFill>
  );
};

// 18 · plato dividido: 1 parte carne, 3 partes verdura/arroz (conic-gradient)
export const PlateRatio: React.FC<B & { t: number }> = ({ a, a0, t }) => {
  const { f, at } = useT0(a, a0);
  const p = ez((f - at(t)) / 24);
  return (
    <AbsoluteFill>
      <Table f={f} />
      <div style={pos({ left: 300, top: 160, width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle, #fff 0 64%, #ebe6db 66%, #fff 72%, #d3ccbd 100%)", boxShadow: SH, ...pop(f, 2) })}>
        <div style={pos({ inset: 110, borderRadius: "50%", background: `conic-gradient(#9E5E3E 0 ${90 * p}deg, #7FA35B ${90 * p}deg ${180 * p}deg, #F2EEE2 ${180 * p}deg ${270 * p}deg, #E9A24A ${270 * p}deg ${360 * p}deg, #f7f4ee ${360 * p}deg)` })} />
        <div style={pos({ inset: 110, borderRadius: "50%", background: "repeating-radial-gradient(circle at 40% 40%, rgba(0,0,0,.05) 0 6px, transparent 6px 14px)" })} />
      </div>
      <div style={pos({ left: 1170, top: 240 })}>
        {[["1", "meat", "#9E5E3E"], ["3", "vegetables, rice, noodles", "#7FA35B"]].map(([n, w, c], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 50, ...pop(f, at(t) + 8 + i * 14) }}>
            <div style={{ width: 130, height: 130, borderRadius: 24, background: c, boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center" }}><Big txt={n} size={110} color={CREAM} /></div>
            <Pen txt={w} size={64} />
          </div>
        ))}
        <div style={pop(f, at(t) + 40)}><Sticker c={OX}><Big txt="ABOUT A THIRD THE COST" size={64} color={CREAM} /></Sticker></div>
      </div>
    </AbsoluteFill>
  );
};

// 19 · el bife que se abre como un libro (3D) → dos milanesas de ¼ pulgada
export const Butterfly: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  const o = sp(f, at(t), 15, 90);
  const sl = sp(f, at(t2), 14, 110);
  const meat = "radial-gradient(ellipse at 30% 30%, #F4BBA8, #DB8B73 50%, #C46E58), repeating-linear-gradient(30deg, rgba(255,255,255,.25) 0 3px, transparent 3px 26px)";
  return (
    <AbsoluteFill>
      <Bg m="repeating-linear-gradient(91deg, rgba(120,70,30,.16) 0 3px, transparent 3px 13px), linear-gradient(180deg,#D7AC74,#BF8E54)" f={f} />
      <div style={pos({ left: 960, top: 300, width: 0, height: 480, perspective: 1800 })}>
        <div style={pos({ left: -560 - 120 * sl, top: 0, width: 560, height: 480, transformOrigin: "100% 50%", transform: `scaleX(${1 - 2 * o})` })}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "8px 48% 48% 8px", background: o > 0.5 ? "radial-gradient(ellipse at 40% 40%, #F7C9B9, #E39A86)" : meat, boxShadow: SH }} />
        </div>
        <div style={pos({ left: 120 * sl, top: 0, width: 560, height: 480, borderRadius: "8px 48% 48% 8px", background: meat, boxShadow: SH })} />
      </div>
      <Big txt="1 STEAK" size={120} color={CREAM} style={pos({ left: 140, top: 80, textShadow: "0 4px 12px rgba(0,0,0,.5)" })} />
      <div style={pos({ left: 640, top: 840, ...pop(f, at(t2)) })}><Sticker c={OX}><Big txt="= 2 CUTLETS · ¼ INCH THIN" size={76} color={CREAM} /></Sticker></div>
    </AbsoluteFill>
  );
};

// 20 · fino vs grueso: las mismas 2 oz en dos platos
export const ThinThick: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  const Plate: React.FC<{ x: number; thin: boolean; at0: number }> = ({ x, thin, at0 }) => (
    <div style={pos({ left: x, top: 220, ...pop(f, at0) })}>
      <div style={{ position: "relative", width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle, #fff 0 64%, #ebe6db 66%, #fff 72%, #d3ccbd 100%)", boxShadow: SH }}>
        <div style={pos({ left: 140, top: 160, width: 360, height: 320, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #fbf8ef, #e6dfcd)" })} />
        {thin ? Array.from({ length: 7 }, (_, i) => <div key={i} style={pos({ left: 150 + i * 46, top: 220 + (i % 2) * 20, width: 120, height: 200, borderRadius: "40%", background: "linear-gradient(90deg, #B97A58, #DDA484 50%, #B97A58)", transform: `rotate(${-20 + i * 6}deg)`, boxShadow: "0 3px 5px rgba(0,0,0,.25)", opacity: cl((f - at0 - i * 2) / 6) })} />)
          : <div style={pos({ left: 250, top: 250, width: 140, height: 120, borderRadius: 22, background: "radial-gradient(ellipse at 35% 30%, #DDA484, #A2603F)", boxShadow: "0 8px 10px rgba(0,0,0,.35)" })} />}
      </div>
      <Big txt={thin ? "THIN = A MEAL" : "ONE CHUNK = A SNACK"} size={78} color={thin ? GREEN : OX} style={{ marginTop: 20, textAlign: "center", background: CREAM, borderRadius: 14, padding: "8px 20px", boxShadow: SH }} />
    </div>
  );
  return (
    <AbsoluteFill>
      <Table f={f} />
      <Big txt="SAME 2 OUNCES" size={100} color={INK} style={pos({ left: 700, top: 50 })} />
      <Plate x={160} thin at0={at(t)} />
      <Plate x={1100} thin={false} at0={at(t2)} />
    </AbsoluteFill>
  );
};

// 21 · etiqueta de precio pistola: $1 el desayuno
export const PriceSticker: React.FC<B & { p: string; sub: string; t: number }> = ({ a, a0, p, sub, t }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={LINO} f={f} />
      <div style={pos({ left: 300, top: 260, width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle, #2b2b2b 0 62%, #111 64%, #3a3a3a 72%, #0d0d0d 100%)", boxShadow: SH, ...pop(f, 2) })}>
        <div style={pos({ inset: 90, borderRadius: "50%", overflow: "hidden", background: "#C98A4A" })}>
          {Array.from({ length: 40 }, (_, i) => <div key={i} style={pos({ left: rnd(i) * 420, top: rnd(i * 3) * 420, width: 50, height: 46, borderRadius: 10, background: i % 4 ? "#E2B36A" : "#9E4A30", boxShadow: "inset -3px -4px 5px rgba(80,30,0,.4)" })} />)}
          <div style={pos({ left: 150, top: 140, width: 170, height: 170, borderRadius: "50%", background: "radial-gradient(circle, #F4B728 0 30%, #fff 32% 100%)", boxShadow: "0 6px 10px rgba(0,0,0,.3)" })} />
        </div>
      </div>
      <div style={pos({ left: 1060, top: 300, transform: `rotate(-8deg) scale(${sp(f, at(t), 9, 240)})` })}>
        <div style={{ width: 600, height: 380, borderRadius: 30, background: `linear-gradient(160deg, rgba(255,255,255,.4), transparent 40%), ${MUS}`, boxShadow: SH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "6px dashed rgba(255,255,255,.6)" }}>
          <Big txt={p} size={260} color={OX} /><Pen txt={sub} size={70} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 22 · molde de muffins: se llenan las 12 cavidades y saltan los discos congelados
export const MuffinTin: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  const cols = ["#8E3B22", "#C9A15A", "#B4552F", "#D8B26C"];
  const jump = sp(f, at(t2), 12, 140);
  return (
    <AbsoluteFill>
      <Bg m={FROST} f={f} />
      <div style={pos({ left: 260, top: 230, width: 1400, height: 720, borderRadius: 40, background: "linear-gradient(135deg,#c9ced2,#8f979e 50%,#b8bec3)", boxShadow: SH, ...pop(f, 2) })}>
        {Array.from({ length: 12 }, (_, i) => { const x = 70 + (i % 4) * 320, y = 60 + Math.floor(i / 4) * 220; const fl = ez((f - at(t) - i * 2) / 10); return (
          <div key={i} style={pos({ left: x, top: y, width: 260, height: 190, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 35%, #5f676e, #9aa2a9 70%)", boxShadow: "inset 0 14px 20px rgba(0,0,0,.45)" })}>
            <div style={pos({ inset: 22, borderRadius: "50%", background: `radial-gradient(ellipse at 40% 35%, rgba(255,255,255,.25), transparent 50%), ${cols[i % 4]}`, opacity: fl,
              transform: `translateY(${-160 * jump * (i % 2 ? 1 : 0.8)}px) rotate(${jump * (i % 2 ? 12 : -10)}deg)`, boxShadow: jump > 0.1 ? "0 20px 20px rgba(0,0,0,.3)" : "none",
              border: jump > 0.1 ? "4px solid rgba(255,255,255,.8)" : "none" })} />
          </div>); })}
      </div>
      <div style={pos({ left: 300, top: 70, ...pop(f, at(t)) })}><Big txt="1 CUP = 1 PORTION" size={120} color={SLATE} /></div>
    </AbsoluteFill>
  );
};

// 23 · el mismo pollo, tres platos: tarjetas de menú que rotan
export const Remix: React.FC<B & { rows: { d: string; m: string; t: number }[] }> = ({ a, a0, rows }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={SLATEBG} f={f} />
      <Big txt="SAME PULLED CHICKEN" size={110} color={MUS} style={pos({ left: 120, top: 70 })} />
      {rows.map((r, i) => (
        <div key={i} style={pos({ left: 120 + i * 580, top: 290, ...flipIn(f, at(r.t)) })}>
          <div style={{ width: 520, height: 600, borderRadius: 24, background: CREAM, boxShadow: SH, padding: 40, transform: `rotate(${[-3, 2, -1][i]}deg)` }}>
            <Big txt={r.d} size={90} color={OX} />
            <div style={{ height: 250, margin: "20px 0", borderRadius: "50%", background: ["radial-gradient(ellipse, #F3E3B8 30%, #E8CF8F 60%, #fff 62%)", "radial-gradient(ellipse, #A06A3A 25%, #D9B27A 50%, #fff 62%)", "radial-gradient(ellipse, #E9B85A 30%, #F2D58E 55%, #fff 62%)"][i], boxShadow: "inset 0 0 0 14px #fff, 0 10px 16px rgba(0,0,0,.2)" }} />
            <Pen txt={r.m} size={58} color={INK} style={{ whiteSpace: "normal" }} />
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// 24 · el pastel del sábado en capas (corte transversal)
export const PieLayers: React.FC<B & { rows: string[]; t: number }> = ({ a, a0, rows, t }) => {
  const { f, at } = useT0(a, a0);
  const cs = ["linear-gradient(180deg,#8B4A2B,#6E3520)", "linear-gradient(180deg,#E7B661,#C98E3C)", "linear-gradient(180deg,#FBF1D6,#EBD49C)"];
  return (
    <AbsoluteFill>
      <Table f={f} />
      <div style={pos({ left: 200, top: 230, width: 900, height: 620, borderRadius: "20px 20px 60px 60px", background: "linear-gradient(90deg,#7a2b20,#b44a36 40%,#8a3324)", boxShadow: SH, padding: 40, display: "flex", flexDirection: "column-reverse", gap: 10 })}>
        {rows.map((r, i) => { const u = sp(f, at(t) + i * 16, 13, 140); return (
          <div key={i} style={{ height: i === 2 ? 190 : 160, borderRadius: i === 2 ? "60px 60px 10px 10px" : 10, background: cs[i], transform: `translateY(${(1 - u) * -500}px)`, opacity: cl(u * 2), boxShadow: "0 6px 10px rgba(0,0,0,.25)",
            ...(i === 2 ? { backgroundImage: "radial-gradient(circle at 20% 30%, rgba(170,110,40,.5) 0 10px, transparent 12px), radial-gradient(circle at 60% 50%, rgba(170,110,40,.45) 0 14px, transparent 16px), radial-gradient(circle at 80% 25%, rgba(170,110,40,.4) 0 9px, transparent 11px), linear-gradient(180deg,#FBF1D6,#EBD49C)" } : {}) }} />); })}
      </div>
      <div style={pos({ left: 1160, top: 220, padding: "30px 40px", borderRadius: 20, background: CREAM, boxShadow: SH })}>
        {rows.slice().reverse().map((r, i) => <Pen key={i} txt={`${3 - i}. ${r}`} size={70} f={f} at={at(t) + (2 - i) * 16 + 6} style={{ height: 130 }} />)}
        <div style={pop(f, at(t) + 54)}><Sticker c={OX}><Big txt="40 MIN · BEST SUPPER" size={70} color={CREAM} /></Sticker></div>
      </div>
    </AbsoluteFill>
  );
};

// 25 · calendario: cocinar sólo domingo y miércoles, el resto calentar
export const TwiceWeek: React.FC<B & { t: number }> = ({ a, a0, t }) => {
  const { f, at } = useT0(a, a0);
  const D = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return (
    <AbsoluteFill>
      <Bg m={ENAMEL} f={f} />
      <Big txt="COOK TWICE A WEEK" size={120} color={OX} style={pos({ left: 120, top: 80 })} />
      {D.map((d, i) => { const cook = i === 0 || i === 3; return (
        <div key={d} style={pos({ left: 110 + i * 250, top: 330, width: 220, height: 400, borderRadius: 18, background: cook ? OX : CREAM, boxShadow: SH, padding: 20, ...flipIn(f, at(t) + i * 3) })}>
          <Big txt={d} size={80} color={cook ? CREAM : SLATE} />
          <div style={{ marginTop: 40 }}><Pen txt={cook ? "COOK" : "warm up"} size={cook ? 64 : 52} color={cook ? MUS : "#888"} /></div>
        </div>); })}
    </AbsoluteFill>
  );
};

// 26 · la cuenta de Dolores: total → 14 → $1.42 por comida, con lo demás $35
export const WeekMath: React.FC<B & { tot: string; meals: number; per: string; t1: number; t2: number; t3: number; side: string; tS: number }> = ({ a, a0, tot, meals, per, t1, t2, t3, side, tS }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={KRAFTB} f={f} />
      <div style={pos({ left: 160, top: 120, width: 1000, padding: "50px 70px", background: "repeating-linear-gradient(180deg, transparent 0 96px, rgba(80,120,190,.28) 96px 98px), #FFFDF4", boxShadow: SH, transform: "rotate(-1.5deg)" })}>
        <Big txt="DOLORES'S WEEK" size={90} color={OX} />
        <div style={{ display: "flex", justifyContent: "space-between", height: 130, alignItems: "center" }}><Pen txt="meat" size={80} f={f} at={at(t1)} /><Big txt={tot} size={110} style={pop(f, at(t1))} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", height: 130, alignItems: "center" }}><Pen txt="meals" size={80} f={f} at={at(t2)} /><Big txt={`÷ ${meals}`} size={110} style={pop(f, at(t2))} /></div>
        <div style={{ height: 6, background: INK, transformOrigin: "left", transform: `scaleX(${ez((f - at(t3)) / 10)})` }} />
        <div style={{ display: "flex", justifyContent: "space-between", height: 170, alignItems: "center" }}><Pen txt="per meal" size={80} color={GREEN} f={f} at={at(t3)} /><Big txt={per} size={170} color={GREEN} style={pop(f, at(t3) + 4)} /></div>
      </div>
      <div style={pos({ left: 1280, top: 330, ...pop(f, at(tS)) })}>
        <Sticker c={MUS} rot={6}><Pen txt="whole week, everything" size={56} /><Big txt={side} size={190} color={OX} /></Sticker>
      </div>
    </AbsoluteFill>
  );
};

// 27 · $49 de cenas congeladas vs $35 → 700 al año (alcancía de hojalata que se llena)
export const YearKeep: React.FC<B & { a_?: string; aT: string; b: string; bT: string; big: string; bigT: string; tA: number; tB: number; tBig: number } & { cans?: string }> = (p: any) => {
  const { a, a0, aT, b, bT, big, bigT, tA, tB, tBig } = p;
  const { f, at } = useT0(a, a0);
  const lv = ez((f - at(tBig)) / 36);
  return (
    <AbsoluteFill>
      <Bg m={LINO} f={f} />
      <div style={pos({ left: 110, top: 150, ...flipIn(f, at(tA)) })}>
        <div style={{ position: "relative", width: 640, padding: "30px 46px", borderRadius: 20, background: "#EDEDED", boxShadow: SH }}>
          <Big txt={p.cans || "$49"} size={170} color="#666" /><Pen txt={aT} size={56} />
          <Strike f={f} at={at(tB)} />
        </div>
      </div>
      <div style={pos({ left: 110, top: 560, ...flipIn(f, at(tB) - 8) })}>
        <div style={{ width: 640, padding: "30px 46px", borderRadius: 20, background: GREEN, boxShadow: SH }}><Big txt={b} size={170} color={CREAM} /><Pen txt={bT} size={56} color={CREAM} /></div>
      </div>
      <div style={pos({ left: 960, top: 180, width: 420, height: 640, ...pop(f, at(tBig) - 6) })}>
        <div style={pos({ left: 0, right: 0, top: 0, bottom: 0, borderRadius: 30, overflow: "hidden", background: "linear-gradient(90deg,#8d959c,#e4e8eb 30%,#a7afb6 60%,#7a8289)", boxShadow: SH })}>
          <div style={pos({ left: 0, right: 0, bottom: 0, height: `${lv * 100}%`, background: "repeating-linear-gradient(180deg, #C9D8B9 0 26px, #9FB58A 26px 30px)" })} />
          <div style={pos({ left: 0, right: 0, top: 200, height: 220, background: `linear-gradient(90deg, ${OX}, #a53a3a 40%, ${OX})`, display: "flex", alignItems: "center", justifyContent: "center" })}><Big txt="SAVINGS" size={90} color={CREAM} /></div>
        </div>
        <div style={pos({ left: 140, top: -16, width: 140, height: 24, borderRadius: 12, background: "#222" })} />
      </div>
      <div style={pos({ left: 1440, top: 330, ...pop(f, at(tBig)) })}><Big txt={big} size={230} color={OX} /><Pen txt={bigT} size={80} /></div>
    </AbsoluteFill>
  );
};

// 28 · tarea: tarjetas de cinta pegadas en la puerta de la heladera
export const Homework5: React.FC<B & { items: { txt: string; t: number }[] }> = ({ a, a0, items }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={ENAMEL} f={f} />
      <Big txt="YOUR HOMEWORK" size={130} color={OX} style={pos({ left: 120, top: 70 })} />
      {items.map((it, i) => (
        <div key={i} style={pos({ left: 140 + (i % 2) * 840, top: 300 + Math.floor(i / 2) * 330, ...drop(f, at(it.t), -300, i % 2 ? 5 : -5) })}>
          <Tape w={800} rot={i % 2 ? 2 : -2}>
            <div style={{ display: "flex", alignItems: "center", height: 170 }}>
              <div style={{ width: 80, height: 80, border: `6px solid ${SLATE}`, borderRadius: 10, marginRight: 30, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{f >= at(it.t) + 8 ? <Tick f={f} at={at(it.t) + 8} s={60} /> : null}</div>
              <Pen txt={it.txt} size={60} f={f} at={at(it.t)} />
            </div>
          </Tape>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// 29 · pregunta para comentarios en papelito amarillo + lápiz
export const AskSlip: React.FC<B & { q: string; t: number }> = ({ a, a0, q, t }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Table f={f} />
      <div style={pos({ left: 260, top: 220, width: 1400, padding: "60px 70px", background: "repeating-linear-gradient(180deg, transparent 0 70px, rgba(70,90,140,.25) 70px 72px), linear-gradient(180deg,#FBEFB0,#F2DC86)", boxShadow: SH, transform: "rotate(-2deg)", ...drop(f, 2, -700, -6) })}>
        <Big txt="TELL ME IN THE COMMENTS" size={80} color={OX} />
        <Pen txt={q} size={100} color={SLATE} f={f} at={at(t)} dur={22} style={{ marginTop: 30 }} />
      </div>
      <div style={pos({ left: 1280, top: 700, width: 520, height: 44, borderRadius: 22, transform: `rotate(-24deg) translateX(${Math.sin(f / 5) * 8}px)`, background: "linear-gradient(90deg, #f5d36b 0 82%, #f2b2a2 82% 90%, #888 90%)", boxShadow: SH })} />
    </AbsoluteFill>
  );
};

// overlay · número de truco: etiqueta de pistola de precios mostaza con "TRICK n /25" + cinta con el título
export const TrickBadge: React.FC<{ n: number; txt: string; d: number; a?: number }> = ({ n, txt, d }) => {
  const f = useCurrentFrame();
  const u = sp(f, 0, 10, 200), o = 1 - ez((f - (d - 10)) / 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 54, top: 44, opacity: o, display: "flex", alignItems: "flex-start" }}>
        <div style={{ transform: `rotate(-6deg) scale(${u})`, background: `linear-gradient(160deg, rgba(255,255,255,.4), transparent 40%), ${MUS}`, borderRadius: 16, padding: "10px 26px 6px", boxShadow: SH, border: "4px dashed rgba(255,255,255,.6)", zIndex: 2 }}>
          <Big txt="TRICK" size={36} color={OX} ls={6} /><div style={{ display: "flex", alignItems: "baseline" }}><Big txt={`${n}`} size={110} color={OX} /><Big txt="/25" size={44} color={INK} style={{ marginLeft: 6 }} /></div>
        </div>
        <div style={{ marginLeft: -16, marginTop: 40, clipPath: `inset(0 ${100 - 100 * ez((f - 6) / 12)}% 0 0)` }}>
          <Tape w={Math.min(900, 120 + txt.length * 30)}><Pen txt={txt} size={58} color={INK} /></Tape>
        </div>
      </div>
    </AbsoluteFill>
  );
};
export const TrickNo = TrickBadge;
