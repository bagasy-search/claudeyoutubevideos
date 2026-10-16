// ── HÉROES de mickey6 (Mickey's Butcher Shop, video 6: la paleta de cerdo que se deshace sola). Claude, 16-oct-2026.
//    Juego PROPIO (no recicla mickey1-5): ticket de balanza de deli, horno a 400 que se quema, sellos de falla, etiqueta de promesa,
//    capítulo = cartel esmaltado con número, mapa del cerdo partido butt/picnic, etiqueta kraft con tildes, cuenta de tiza, grasa en rombos,
//    ficha de receta, reloj de heladera 12/24 h, perilla 400→275, colágeno→gelatina, calculadora de horas, curva del estancamiento,
//    termómetro de fin, conservadora en corte, pizarra de problemas, recibo de papel, billetes $120 vs $16, tres noches, lista de ticket.
//    PURO CSS (cero imágenes): texturas dibujadas con gradientes + perspectiva + sombras en capas + brillo que barre.
//    Tipografías: 2 familias (Anton = rótulos y números · Caveat = mano). Paleta del local: boiserie verde, rayado rojo del delantal, crema, bronce.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { useT, sp, ez, eo, cl, P } from "../lkit/core";

const ANT = loadAnton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const CAV = loadCaveat("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const GRN = "#1F4A3A", GRN2 = "#2E6450", RED = "#B3282D", CREAM = "#F5ECDB", BRASS = "#C9A04A", INK = "#221E1A", PINK = "#E7A39C", BARK = "#5A2E16", FAT = "#F6EBDD", OK = "#2F7A4A";
type A0 = { a0?: number };

// ── texturas del oficio (gradientes) ─────────────────────────────────────
const TX: Record<string, string> = {
  green: "repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 6px), radial-gradient(ellipse 40% 30% at 25% 20%, rgba(255,255,255,0.07), transparent 70%), linear-gradient(180deg, #2A5C49, #1B4033)",
  paper: "repeating-linear-gradient(90deg, rgba(120,70,60,0.05) 0 1px, transparent 1px 9px), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 13px), radial-gradient(ellipse 45% 35% at 30% 30%, rgba(255,255,255,0.35), transparent 70%), linear-gradient(170deg, #E9CFC4, #D7B2A5)",
  marble: "linear-gradient(115deg, transparent 0 30%, rgba(120,120,125,0.18) 30.5%, transparent 32% 58%, rgba(120,120,125,0.12) 58.4%, transparent 60%), linear-gradient(35deg, transparent 0 44%, rgba(140,140,145,0.16) 44.4%, transparent 46%), radial-gradient(ellipse 50% 40% at 70% 30%, rgba(255,255,255,0.7), transparent 70%), linear-gradient(160deg, #F2F1EE, #DCDAD5)",
  chalk: "radial-gradient(ellipse 40% 18% at 30% 35%, rgba(255,255,255,0.08), transparent 70%), radial-gradient(ellipse 30% 14% at 70% 65%, rgba(255,255,255,0.07), transparent 70%), repeating-linear-gradient(170deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 9px), linear-gradient(180deg, #2E3632, #20271F)",
  kraft: "repeating-linear-gradient(23deg, rgba(80,50,20,0.06) 0 1px, transparent 1px 9px), repeating-linear-gradient(-67deg, rgba(255,240,210,0.07) 0 1px, transparent 1px 13px), radial-gradient(ellipse 35% 25% at 80% 70%, rgba(255,230,190,0.18), transparent 70%), linear-gradient(170deg, #CDA878, #B88D5C)",
  wood: "repeating-linear-gradient(92deg, rgba(60,30,10,0.18) 0 3px, transparent 3px 26px, rgba(255,220,170,0.08) 26px 31px, transparent 31px 57px), repeating-linear-gradient(88deg, rgba(60,30,10,0.10) 0 1px, transparent 1px 9px), linear-gradient(180deg, #8E5F37, #6E4628)",
  enamel: "radial-gradient(ellipse 50% 40% at 35% 25%, rgba(255,255,255,0.9), transparent 70%), linear-gradient(180deg, #F4F2EC, #DAD7CE)",
};
const Bg: React.FC<{ k: keyof typeof TX; f: number; d: number; panels?: boolean }> = ({ k, f, d, panels }) => {
  const sweep = -30 + 160 * (f / Math.max(1, d));
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ background: TX[k], transform: `scale(${1.05 + 0.03 * f / Math.max(1, d)})` }} />
    {panels ? <AbsoluteFill>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 90 + i * 600, top: 110, width: 540, height: 860, borderRadius: 10,
        boxShadow: "inset 6px 6px 0 rgba(0,0,0,0.22), inset -5px -5px 0 rgba(255,255,255,0.08), 0 0 0 10px rgba(255,255,255,0.03)" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 54, height: 22, background: "linear-gradient(180deg, #3A7860, #163628)", boxShadow: "0 6px 10px rgba(0,0,0,0.35)" }} />
    </AbsoluteFill> : null}
    <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(255,250,235,0.10) ${sweep}%, transparent ${sweep + 12}%)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 35% 0%, rgba(255,226,180,0.18), rgba(255,226,180,0) 70%)" }} />
  </AbsoluteFill>;
};
const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${-8 * Math.sin(f / 43)}px, ${5 * Math.cos(f / 49)}px) scale(${1.02 + 0.01 * Math.sin(f / 57)})` }}>{children}</AbsoluteFill>;
};
const shell = (bg: React.ReactNode, c: React.ReactNode) => <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{bg}<Drift>{c}</Drift></AbsoluteFill>;
const Ant: React.FC<{ txt: string; size: number; color?: string; u?: number; style?: React.CSSProperties; sh?: boolean }> = ({ txt, size, color = CREAM, u = 1, style, sh = true }) => (
  <div style={{ fontFamily: ANT, fontSize: size, color, lineHeight: 1.02, letterSpacing: 1, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 28}px) scale(${0.88 + 0.12 * u})`,
    textShadow: sh ? "0 3px 0 rgba(0,0,0,0.25), 0 10px 26px rgba(0,0,0,0.45)" : undefined, whiteSpace: "nowrap", ...style }}>{txt}</div>
);
const Hand: React.FC<{ txt: string; u: number; size: number; color?: string; style?: React.CSSProperties }> = ({ txt, u, size, color = INK, style }) => (
  <div style={{ fontFamily: CAV, fontWeight: 700, fontSize: size, color, whiteSpace: "nowrap", lineHeight: 1.05, paddingRight: "0.3em", clipPath: `inset(-25% ${(100 - 100 * ez(u)) * 1.06 - 6}% -25% -2%)`, ...style }}>{txt}</div>
);
const Tick: React.FC<{ u: number; no?: boolean; size?: number; color?: string }> = ({ u, no, size = 74, color }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" style={{ overflow: "visible" }}>
    <path d={no ? "M 10 10 L 42 42 M 42 10 L 10 42" : "M 8 28 L 21 40 L 44 12"} stroke={color || (no ? RED : OK)} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);
// sombra de contacto + sombra ambiente (dos capas)
const SH = "0 2px 3px rgba(0,0,0,0.35), 0 18px 30px rgba(0,0,0,0.35), 0 44px 80px rgba(0,0,0,0.30)";
const start = (a: number, a0?: number) => (a0 ?? a);

// 1 · capítulo: cartel esmaltado (rojo con filete crema) colgado de dos cadenitas sobre la boiserie verde; número enorme + truco
export const Chapter: P<{ n: number; title: string; sub: string; tw: number } & A0> = ({ a, d, n, title, sub, tw, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 12, 110), s = sp(f, at(tw) + 10, 14, 140), sw = Math.sin(f / 16) * 1.6 * (1 - cl((f - at(start(a, a0))) / 60));
  return shell(<Bg k="green" f={f} d={d} panels />, <>
    <div style={{ position: "absolute", left: 360, top: 0, width: 1200, height: 900, transformOrigin: "50% 0", transform: `rotate(${sw + (1 - u) * -6}deg) translateY(${(1 - u) * -500}px)` }}>
      {[420, 780].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 0, width: 6, height: 150, background: "repeating-linear-gradient(180deg, #8C8C8C 0 10px, #D8D8D8 10px 14px, #6A6A6A 14px 22px)" }} />)}
      <div style={{ position: "absolute", left: 0, top: 140, width: 1200, height: 620, borderRadius: 28, background: `linear-gradient(170deg, #C93A35, ${RED} 55%, #8F1E22)`, boxShadow: SH + ", inset 0 3px 0 rgba(255,255,255,0.3)" }}>
        <div style={{ position: "absolute", inset: 22, borderRadius: 18, border: `6px solid ${CREAM}`, boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.15)" }} />
        {[[40, 40], [1136, 40], [40, 556], [1136, 556]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 24, height: 24, borderRadius: 12, background: "radial-gradient(circle at 35% 35%, #fff, #9A9A9A 60%, #555)" }} />)}
        <div style={{ position: "absolute", left: 80, top: 64, display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ fontFamily: ANT, fontSize: 380, lineHeight: 1, color: CREAM, textShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>{n}</div>
          <div>
            <div style={{ fontFamily: ANT, fontSize: 64, letterSpacing: 10, color: "#F8D9C9" }}>TRICK №{n}</div>
            <div style={{ fontFamily: ANT, fontSize: title.length > 18 ? 92 : 112, lineHeight: 1, color: CREAM, maxWidth: 760, whiteSpace: "normal", opacity: cl(s * 2), transform: `translateX(${(1 - s) * 40}px)` }}>{title}</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640 - 140 + 0, textAlign: "center" }} />
      </div>
      <div style={{ position: "absolute", left: 240, top: 800, width: 720, textAlign: "center", opacity: cl((f - at(tw) - 18) / 10) }}>
        <Hand txt={sub} u={cl((f - at(tw) - 18) / 22)} size={70} color={CREAM} style={{ textShadow: "0 4px 14px rgba(0,0,0,0.6)", display: "inline-block" }} />
      </div>
    </div>
  </>);
};

// 2 · ticket de balanza de deli que se imprime (sale de la ranura) : PULLED PORK 1.00 LB · TOTAL $24.00
export const PriceTicket: P<{ item: string; lb: string; total: string; where: string; t1: number; t2: number } & A0> = ({ a, d, item, lb, total, where, t1, t2, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 120), pr = ez((f - at(t1) + 6) / 26), t = sp(f, at(t2), 11, 180);
  return shell(<Bg k="marble" f={f} d={d} />, <>
    {/* la balanza: cuerpo de esmalte con ranura */}
    <div style={{ position: "absolute", left: 460, top: 120, width: 1000, height: 300, borderRadius: 40, background: "linear-gradient(180deg, #FBFAF6, #D9D5CB)", boxShadow: SH, transform: `translateY(${(1 - u) * -300}px)` }}>
      <div style={{ position: "absolute", left: 60, top: 50, width: 420, height: 150, borderRadius: 16, background: "linear-gradient(180deg, #13261C, #0B1711)", boxShadow: "inset 0 4px 12px rgba(0,0,0,0.8)" }}>
        <div style={{ position: "absolute", right: 24, top: 26, fontFamily: ANT, fontSize: 96, color: "#6CFF9A", textShadow: "0 0 14px rgba(108,255,154,0.6)" }}>{(24 * cl(pr * 1.4)).toFixed(2)}</div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 70, fontFamily: ANT, fontSize: 52, color: "#6C665C", letterSpacing: 4 }}>$ TOTAL</div>
      <div style={{ position: "absolute", left: 200, bottom: 26, width: 600, height: 18, borderRadius: 9, background: "#2B2A27", boxShadow: "inset 0 4px 6px rgba(0,0,0,0.8)" }} />
    </div>
    {/* el ticket sale de la ranura */}
    <div style={{ position: "absolute", left: 680, top: 395, width: 560, height: 560, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: -560 + 560 * pr, width: 560, height: 540, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.025) 0 2px, transparent 2px 5px), linear-gradient(180deg, #FFFEFA, #F1ECE1)",
        boxShadow: "0 20px 30px rgba(0,0,0,0.3)", clipPath: "polygon(0 0,100% 0,100% 97%,95% 100%,90% 97%,85% 100%,80% 97%,75% 100%,70% 97%,65% 100%,60% 97%,55% 100%,50% 97%,45% 100%,40% 97%,35% 100%,30% 97%,25% 100%,20% 97%,15% 100%,10% 97%,5% 100%,0 97%)", padding: "34px 40px", color: INK }}>
        <div style={{ fontFamily: ANT, fontSize: 38, letterSpacing: 6, color: "#7A746A" }}>BBQ · {where.toUpperCase()}</div>
        <div style={{ fontFamily: ANT, fontSize: 70, marginTop: 14 }}>{item}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: ANT, fontSize: 44, marginTop: 20, color: "#4A453D" }}><span>NET WT</span><span>{lb} LB</span></div>
        <div style={{ borderTop: "4px dashed #B9B2A4", margin: "24px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: ANT }}><span style={{ fontSize: 50 }}>TOTAL</span><span style={{ fontSize: 120, color: RED, transform: `scale(${0.8 + 0.2 * t})`, display: "inline-block" }}>${total}</span></div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1300, top: 700, transform: "rotate(-6deg)", opacity: cl(t * 2) }}><Hand txt="one pound!" u={t} size={96} color={RED} /></div>
  </>);
};

// horno de esmalte de frente (puerta con ventana); prop hot = brillo naranja del calor
const Oven: React.FC<{ x: number; y: number; hot: number; children?: React.ReactNode }> = ({ x, y, hot, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 760, height: 640, borderRadius: 26, background: "linear-gradient(180deg, #FAF8F2, #D8D4C9)", boxShadow: SH }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, borderRadius: "26px 26px 0 0", background: "linear-gradient(180deg, #E9E5DB, #CFCABE)", borderBottom: "6px solid #B9B3A5" }}>{children}</div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 160, height: 26, borderRadius: 13, background: "linear-gradient(180deg, #F3F3F3, #9C9C9C)", boxShadow: "0 6px 10px rgba(0,0,0,0.35)" }} />
    <div style={{ position: "absolute", left: 110, right: 110, top: 230, height: 330, borderRadius: 18, background: `radial-gradient(ellipse 60% 55% at 50% 70%, rgba(255,${150 - 80 * hot},40,${0.25 + 0.7 * hot}), rgba(40,20,10,0.95) 75%), #1A120D`, boxShadow: "inset 0 0 0 10px #2C2620, inset 0 10px 30px rgba(0,0,0,0.8)" }}>
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 70, height: 90, borderRadius: "50% 50% 40% 40%", background: `radial-gradient(ellipse at 45% 35%, ${hot > 0.5 ? "#6B4A3A" : "#C77B5A"}, ${hot > 0.5 ? "#2E1C14" : "#7A3B22"})`, boxShadow: "0 10px 14px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 52, height: 26, borderRadius: 6, background: "linear-gradient(180deg, #555, #222)" }} />
    </div>
  </div>
);
const Knob: React.FC<{ x: number; y: number; deg: number; size?: number; marks?: [number, string][] }> = ({ x, y, deg, size = 92, marks }) => (
  <div style={{ position: "absolute", left: x, top: y, width: size, height: size }}>
    {marks?.map(([m, l]) => <div key={l} style={{ position: "absolute", left: size / 2 - 40, top: size / 2 - 40, width: 80, height: 80, transform: `rotate(${m}deg) translateY(${-size * 0.66}px) rotate(${-m}deg)`, textAlign: "center", fontFamily: ANT, fontSize: Math.min(26, size * 0.28) + (size > 200 ? 30 : 0), color: "#5A544A" }}>{l}</div>)}
    <div style={{ width: size, height: size, borderRadius: size, background: "radial-gradient(circle at 35% 30%, #FFFFFF, #C9C9C9 55%, #8A8A8A)", boxShadow: "0 8px 14px rgba(0,0,0,0.45)", transform: `rotate(${deg}deg)` }}>
      <div style={{ position: "absolute", left: size / 2 - 7, top: 6, width: 14, height: size * 0.42, borderRadius: 7, background: "#2B2A27" }} />
    </div>
  </div>
);

// 3 · el error del chofer: horno de esmalte, perilla a fondo (400), reloj de 3 h, la carne se oscurece; la "receta del teléfono"
export const OvenFail: P<{ t400: number; t3: number; tr: number } & A0> = ({ a, d, t400, t3, tr, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 120), k = ez((f - at(t400) + 4) / 16), c = cl((f - at(t3)) / 40), r = sp(f, at(tr), 12, 160);
  return shell(<Bg k="green" f={f} d={d} panels />, <>
    <div style={{ transform: `translateY(${(1 - u) * 200}px)`, opacity: cl(u * 2) }}>
      <Oven x={200} y={260} hot={k}>
        <Knob x={330} y={14} deg={-120 + 240 * k} />
      </Oven>
    </div>
    <div style={{ position: "absolute", left: 1060, top: 240 }}><Ant txt={`${Math.round(200 + 200 * k)}°F`} size={210} color={k > 0.95 ? "#FF6B3D" : CREAM} u={sp(f, at(t400), 12, 170)} /></div>
    {/* reloj: el arco de 3 horas se llena */}
    <div style={{ position: "absolute", left: 1100, top: 520, width: 300, height: 300, borderRadius: 150, background: "radial-gradient(circle at 40% 35%, #FFFDF7, #E3DCCD)", boxShadow: SH, opacity: cl(c * 4) }}>
      <div style={{ position: "absolute", inset: 22, borderRadius: 130, background: `conic-gradient(rgba(201,58,53,0.85) ${270 * c}deg, transparent 0)` }} />
      <div style={{ position: "absolute", inset: 70, borderRadius: 90, background: "#FBF8F1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANT, fontSize: 84, color: INK }}>3 H</div>
    </div>
    <div style={{ position: "absolute", left: 1450, top: 640, transform: "rotate(-5deg)" }}><Hand txt="…the recipe said so" u={r} size={64} color={CREAM} style={{ textShadow: "0 3px 10px rgba(0,0,0,0.7)" }} /></div>
  </>);
};

// 4 · sellos de falla sobre papel de aluminio arrugado: GRAY · DRY OUTSIDE · CHEWY MIDDLE · HARD STRINGS
export const FailStamps: P<{ items: { t: number; txt: string }[] } & A0> = ({ a, d, items, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 120);
  return shell(<AbsoluteFill style={{ background: "repeating-linear-gradient(115deg, rgba(255,255,255,0.35) 0 18px, rgba(120,128,136,0.25) 18px 30px, transparent 30px 60px), repeating-linear-gradient(-35deg, rgba(255,255,255,0.25) 0 25px, rgba(90,98,106,0.2) 25px 40px, transparent 40px 80px), linear-gradient(160deg, #A9AFB5, #E6E8EA 45%, #979EA5)" }} />, <>
    {/* el pedazo gris en el centro del aluminio */}
    <div style={{ position: "absolute", left: 640, top: 330, width: 640, height: 420, borderRadius: "46% 54% 40% 60% / 55% 45% 55% 45%", background: "radial-gradient(ellipse at 40% 35%, #A79D93, #776D63 60%, #5B524A)", boxShadow: SH, transform: `scale(${0.8 + 0.2 * u}) rotate(-4deg)`,
      opacity: cl(u * 2) }}>
      {[...Array(9)].map((_, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 60, top: 80 + (i % 3) * 70, width: 120, height: 8, borderRadius: 4, background: "rgba(60,52,46,0.6)", transform: `rotate(${(i % 2 ? 1 : -1) * 18}deg)` }} />)}
    </div>
    {items.map((it, i) => {
      const s = sp(f, at(it.t), 10, 220); const pos = [[150, 150, -9], [1180, 190, 7], [180, 760, 6], [1150, 770, -6]][i % 4];
      return <div key={i} style={{ position: "absolute", left: pos[0], top: pos[1], transform: `rotate(${pos[2]}deg) scale(${2 - Math.min(1, s)})`, opacity: cl(s * 3) * 0.95,
        border: `10px double ${RED}`, borderRadius: 14, padding: "8px 34px", fontFamily: ANT, fontSize: 104, color: RED, background: "rgba(255,248,240,0.75)", boxShadow: "0 10px 20px rgba(0,0,0,0.2)", whiteSpace: "nowrap" }}>{it.txt}</div>;
    })}
  </>);
};

// 5 · la promesa: etiqueta de precio colgada con hilo sobre papel de carnicería: $16 → 3 NIGHTS · 7 TRICKS
export const PromiseTag: P<{ t16: number; tn: number; t7: number } & A0> = ({ a, d, t16, tn, t7, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 12, 100), n = sp(f, at(tn), 12, 160), s7 = sp(f, at(t7), 12, 160), sw = Math.sin(f / 18) * 3 * (1 - cl((f - at(start(a, a0))) / 70));
  return shell(<Bg k="paper" f={f} d={d} />, <>
    <svg width={1920} height={1080} style={{ position: "absolute" }}><path d={`M 560 0 C 600 120 640 180 ${700 + sw * 4} 250`} stroke="#F8F3EA" strokeWidth={5} fill="none" /></svg>
    <div style={{ position: "absolute", left: 420, top: 230, width: 820, height: 520, transformOrigin: "35% 0", transform: `rotate(${-8 + sw}deg) translateY(${(1 - u) * -400}px)` }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg, #FFFDF8, #EFE6D6)", clipPath: "polygon(16% 0,100% 0,100% 100%,16% 100%,0 50%)", boxShadow: SH }} />
      <div style={{ position: "absolute", left: 92, top: 236, width: 46, height: 46, borderRadius: 23, background: "#D7B2A5", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 210, top: 40 }}>
        <div style={{ fontFamily: ANT, fontSize: 56, letterSpacing: 6, color: "#7B7367" }}>PORK SHOULDER</div>
        <div style={{ fontFamily: ANT, fontSize: 250, lineHeight: 1, color: RED, transform: `scale(${0.7 + 0.3 * sp(f, at(t16), 10, 200)})`, transformOrigin: "0 50%" }}>$16</div>
        <div style={{ opacity: cl(n * 2), transform: `translateX(${(1 - n) * 50}px)`, fontFamily: ANT, fontSize: 92, color: GRN }}>= 3 NIGHTS</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1300, top: 330, opacity: cl(s7 * 2), transform: `rotate(5deg) scale(${0.8 + 0.2 * s7})` }}>
      <div style={{ width: 380, height: 380, borderRadius: 190, background: `radial-gradient(circle at 35% 30%, #3A7A60, ${GRN})`, boxShadow: SH + ", inset 0 0 0 12px rgba(245,236,219,0.85), inset 0 0 0 18px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: ANT, fontSize: 170, lineHeight: 1, color: CREAM }}>7</div>
        <div style={{ fontFamily: ANT, fontSize: 38, letterSpacing: 4, color: CREAM, textAlign: "center" }}>OLD IRISH<br />BUTCHER TRICKS</div>
      </div>
    </div>
  </>);
};

// cerdo de perfil dibujado con CSS (cuerpo, cabeza, oreja, patas) con la paleta partida en dos (arriba butt / abajo picnic)
const Pig: React.FC<{ hi: "top" | "bottom"; g: number }> = ({ hi, g }) => {
  const lit = (on: boolean) => on ? `rgba(201,58,53,${0.35 + 0.55 * g})` : "rgba(255,255,255,0.05)";
  return <div style={{ position: "absolute", left: 300, top: 260, width: 1200, height: 600 }}>
    <div style={{ position: "absolute", left: 100, top: 60, width: 1000, height: 440, borderRadius: "48% 52% 46% 54% / 55% 55% 45% 45%", background: "radial-gradient(ellipse at 40% 30%, #F4C9C0, #DE9C92 70%)", boxShadow: SH, overflow: "hidden" }}>
      {/* la paleta: zona delantera (derecha), partida en dos */}
      <div style={{ position: "absolute", left: 650, top: 0, width: 300, height: 220, background: lit(hi === "top"), borderBottom: "6px dashed rgba(90,30,30,0.7)" }} />
      <div style={{ position: "absolute", left: 650, top: 220, width: 300, height: 240, background: lit(hi === "bottom") }} />
      <div style={{ position: "absolute", left: 646, top: 0, width: 8, height: 460, background: "rgba(90,30,30,0.7)" }} />
    </div>
    <div style={{ position: "absolute", left: 1010, top: 110, width: 230, height: 230, borderRadius: "50% 45% 50% 50%", background: "radial-gradient(circle at 40% 35%, #F6CFC6, #DE9C92)", boxShadow: "0 14px 24px rgba(0,0,0,0.3)" }}>
      <div style={{ position: "absolute", right: -40, top: 100, width: 80, height: 70, borderRadius: 30, background: "#E7A39C", boxShadow: "inset -6px 0 0 rgba(0,0,0,0.12)" }}>
        <div style={{ position: "absolute", left: 40, top: 18, width: 12, height: 18, borderRadius: 6, background: "#8E4E48" }} /><div style={{ position: "absolute", left: 58, top: 18, width: 12, height: 18, borderRadius: 6, background: "#8E4E48" }} /></div>
      <div style={{ position: "absolute", left: 110, top: 70, width: 22, height: 22, borderRadius: 11, background: INK }} />
      <div style={{ position: "absolute", left: 40, top: -60, width: 100, height: 120, background: "#D88F86", clipPath: "polygon(0 100%, 40% 0, 100% 90%)" }} />
    </div>
    {[180, 380, 760, 930].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 450, width: 80, height: 140, borderRadius: "20px 20px 14px 14px", background: "linear-gradient(180deg, #DE9C92, #C98178)" }} />)}
    <svg width={140} height={140} style={{ position: "absolute", left: 30, top: 120 }}><path d="M 110 60 C 60 20 20 70 60 90 C 90 104 70 130 40 120" stroke="#D88F86" strokeWidth={14} fill="none" strokeLinecap="round" /></svg>
  </div>;
};
// 6 · mapa del cerdo: la paleta se parte en dos y se ilumina la mitad que nombra (BOSTON BUTT arriba · PICNIC abajo)
export const PigMap: P<{ hi: "top" | "bottom"; tHi: number; tName: number; name: string; note: string } & A0> = ({ a, d, hi, tHi, tName, name, note, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), g = ez((f - at(tHi)) / 14), nm = sp(f, at(tName), 12, 170);
  return shell(<Bg k="chalk" f={f} d={d} />, <>
    <div style={{ opacity: cl(u * 2), transform: `scale(${0.9 + 0.1 * u})` }}><Pig hi={hi} g={g} /></div>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d={hi === "top" ? "M 1100 360 C 1180 230 1300 170 1420 170" : "M 1100 640 C 1180 780 1300 860 1420 860"} stroke={CREAM} strokeWidth={7} fill="none" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - eo((f - at(tName)) / 16)} strokeLinecap="round" />
    </svg>
    <div style={{ position: "absolute", left: 1330, top: hi === "top" ? 80 : 780 }}>
      <Ant txt={name} size={name.length > 8 ? 92 : 110} color={CREAM} u={nm} />
      <Hand txt={note} u={cl((f - at(tName) - 10) / 20)} size={56} color="#F2D9A6" />
    </div>
    <div style={{ position: "absolute", left: 120, top: 70 }}><Ant txt="THE SHOULDER" size={72} color="rgba(245,236,219,0.85)" u={u} /></div>
  </>);
};

// 7 · etiqueta kraft atada con hilo: lista con tildes en su palabra (+ una tachada en rojo)
export const CheckTag: P<{ head: string; items: { t: number; txt: string }[]; no?: { t: number; txt: string } } & A0> = ({ a, d, head, items, no, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 110);
  return shell(<Bg k="marble" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 420, top: 120, width: 1080, height: 840, transform: `rotate(${-2 + 2 * (1 - u)}deg) translateY(${(1 - u) * 300}px)`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", inset: 0, background: TX.kraft, borderRadius: 18, boxShadow: SH, clipPath: "polygon(10% 0,90% 0,100% 8%,100% 100%,0 100%,0 8%)" }} />
      <div style={{ position: "absolute", left: 510, top: 34, width: 60, height: 60, borderRadius: 30, background: "#7A5733", boxShadow: "inset 0 4px 8px rgba(0,0,0,0.5), 0 0 0 10px rgba(255,255,255,0.18)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: ANT, fontSize: 70, letterSpacing: 8, color: "#3E2A17" }}>{head}</div>
      {items.map((it, i) => {
        const s = sp(f, at(it.t), 12, 170);
        return <div key={i} style={{ position: "absolute", left: 120, top: 250 + i * 150, display: "flex", alignItems: "center", gap: 30, opacity: cl(s * 2), transform: `translateX(${(1 - s) * 60}px)` }}>
          <div style={{ width: 92, height: 92, borderRadius: 14, border: "6px solid #3E2A17", display: "flex", alignItems: "center", justifyContent: "center" }}><Tick u={cl((f - at(it.t) - 4) / 10)} /></div>
          <div style={{ fontFamily: ANT, fontSize: 96, color: INK }}>{it.txt}</div>
        </div>;
      })}
      {no ? (() => { const s = sp(f, at(no.t), 12, 170); const y = 250 + items.length * 150; return <div style={{ position: "absolute", left: 120, top: y, display: "flex", alignItems: "center", gap: 30, opacity: cl(s * 2) }}>
        <div style={{ width: 92, height: 92, borderRadius: 14, border: `6px solid ${RED}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Tick no u={cl((f - at(no.t) - 4) / 10)} /></div>
        <div style={{ position: "relative", fontFamily: ANT, fontSize: 80, color: "#6B4E33" }}>{no.txt}<div style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 10, background: RED, transformOrigin: "0 50%", transform: `scaleX(${eo((f - at(no.t) - 8) / 12)})` }} /></div>
      </div>; })() : null}
    </div>
  </>);
};

// 8 · cuenta de tiza en la pizarra del local con marco de madera: $2/lb × 8 lb = $16
export const ChalkMath: P<{ rows: { t: number; txt: string }[]; total: { t: number; txt: string }; foot: string } & A0> = ({ a, d, rows, total, foot, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), tt = sp(f, at(total.t), 11, 190);
  const chalk = { color: "#F4F1E8", textShadow: "0 0 3px rgba(255,255,255,0.55), 0 0 1px rgba(255,255,255,0.9)" };
  return shell(<Bg k="green" f={f} d={d} panels />, <>
    <div style={{ position: "absolute", left: 300, top: 110, width: 1320, height: 860, borderRadius: 10, background: TX.wood, boxShadow: SH, transform: `translateY(${(1 - u) * 260}px)`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", inset: 36, borderRadius: 6, background: TX.chalk, boxShadow: "inset 0 6px 18px rgba(0,0,0,0.6)" }}>
        {rows.map((r, i) => <div key={i} style={{ position: "absolute", left: 140, top: 70 + i * 170 }}><Hand txt={r.txt} u={cl((f - at(r.t)) / 18)} size={150} color={chalk.color} style={{ textShadow: chalk.textShadow }} /></div>)}
        <div style={{ position: "absolute", left: 120, right: 120, top: 70 + rows.length * 170 + 20, height: 8, borderRadius: 4, background: "rgba(244,241,232,0.85)", transformOrigin: "0 50%", transform: `scaleX(${eo((f - at(total.t) + 8) / 12)})` }} />
        <div style={{ position: "absolute", left: 140, top: 70 + rows.length * 170 + 50, fontFamily: ANT, fontSize: 210, lineHeight: 1, ...chalk, color: "#F6D26B", opacity: cl(tt * 2), transform: `scale(${0.7 + 0.3 * tt})`, transformOrigin: "0 50%" }}>= {total.txt}</div>
        <div style={{ position: "absolute", right: 70, bottom: 50, transform: "rotate(-4deg)" }}><Hand txt={foot} u={cl((f - at(total.t)) / 16)} size={58} color="#CFE4D6" /></div>
      </div>
    </div>
  </>);
};

// 9 · la capa de grasa vista de arriba: el cuchillo traza los rombos (1" de separación) y aparece el corte de 1/4" en perfil
export const ScoreFat: P<{ tCut: number; tInch: number; tDeep: number } & A0> = ({ a, d, tCut, tInch, tDeep, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), c = cl((f - at(tCut)) / 50), inch = sp(f, at(tInch), 12, 170), deep = sp(f, at(tDeep), 12, 170);
  const L = 9;
  return shell(<Bg k="wood" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 160, top: 170, width: 1000, height: 720, perspective: 1400, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", inset: 0, transform: "rotateX(28deg)", borderRadius: "38% 42% 36% 40% / 30% 34% 30% 36%", background: "radial-gradient(ellipse at 40% 35%, #FFF8EE, #F0DFC9 60%, #E2C9AE)", boxShadow: SH + ", inset 0 -20px 40px rgba(170,120,90,0.35)", overflow: "hidden" }}>
        <svg width={1000} height={720} style={{ position: "absolute" }}>
          {[...Array(L)].map((_, i) => { const p = cl(c * L * 2 - i); return <line key={"a" + i} x1={-200 + i * 150} y1={0} x2={-200 + i * 150 + 720} y2={720} stroke="#B98463" strokeWidth={7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />; })}
          {[...Array(L)].map((_, i) => { const p = cl(c * L * 2 - L - i); return <line key={"b" + i} x1={1200 - i * 150} y1={0} x2={1200 - i * 150 - 720} y2={720} stroke="#B98463" strokeWidth={7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />; })}
        </svg>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1230, top: 170, opacity: cl(inch * 2) }}>
      <Ant txt="1 INCH" size={130} color={CREAM} u={inch} /><Hand txt="apart, like tic-tac-toe" u={cl((f - at(tInch) - 8) / 20)} size={56} color={CREAM} style={{ textShadow: "0 3px 10px rgba(0,0,0,0.6)" }} />
    </div>
    {/* perfil: grasa sobre carne, el corte para justo en la carne */}
    <div style={{ position: "absolute", left: 1230, top: 560, width: 560, height: 300, opacity: cl(deep * 2), transform: `translateY(${(1 - deep) * 40}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 560, height: 110, borderRadius: "20px 20px 0 0", background: `linear-gradient(180deg, ${FAT}, #EAD3B8)` }} />
      <div style={{ position: "absolute", left: 0, top: 110, width: 560, height: 170, borderRadius: "0 0 20px 20px", background: "repeating-linear-gradient(170deg, rgba(255,255,255,0.12) 0 6px, transparent 6px 22px), linear-gradient(180deg, #D9727A, #B5525C)" }} />
      {[120, 280, 440].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 0, width: 10, height: 110 * ez((f - at(tDeep)) / 14), background: "#7A4A35", clipPath: "polygon(0 0,100% 0,50% 100%)" }} />)}
      <div style={{ position: "absolute", left: 0, top: 300 }}><Ant txt="¼ INCH DEEP" size={88} color={CREAM} u={deep} /></div>
    </div>
  </>);
};

// 10 · ficha de receta de fichero (cartulina con renglones azules y margen rojo) escrita a mano línea por línea
export const RecipeCard: P<{ title: string; lines: { t: number; txt: string }[] } & A0> = ({ a, d, title, lines, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 100);
  return shell(<Bg k="wood" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 300, top: 120, width: 1320, height: 840, transform: `rotate(${-2.5 + (1 - u) * 6}deg) translateY(${(1 - u) * 300}px)`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 30, top: 24, width: 1320, height: 840, background: "#E8DEC9", borderRadius: 8, transform: "rotate(3deg)", boxShadow: SH }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 8, boxShadow: SH,
        background: "linear-gradient(90deg, transparent 150px, rgba(201,58,53,0.6) 150px 154px, transparent 154px), repeating-linear-gradient(180deg, transparent 0 132px, rgba(70,110,180,0.35) 132px 135px), radial-gradient(ellipse 30% 20% at 80% 85%, rgba(150,110,60,0.18), transparent 70%), linear-gradient(170deg, #FFFCF4, #F2E9D6)" }} />
      <div style={{ position: "absolute", left: 190, top: 34 }}><Hand txt={title} u={u} size={100} color={RED} /></div>
      {lines.map((l, i) => <div key={i} style={{ position: "absolute", left: 190, top: 178 + i * 135 }}><Hand txt={l.txt} u={cl((f - at(l.t)) / 22)} size={96} color="#1F2A44" /></div>)}
    </div>
  </>);
};

// 11 · reloj de heladera: puerta de esmalte con manija cromada; el arco de horas se llena (12 h GOOD → 24 h BETTER)
export const FridgeClock: P<{ t12: number; t24: number } & A0> = ({ a, d, t12, t24, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), h = 12 * ez((f - at(t12) + 10) / 24) + 12 * ez((f - at(t24)) / 24), g12 = sp(f, at(t12), 12, 170), g24 = sp(f, at(t24), 12, 170);
  return shell(<Bg k="enamel" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "linear-gradient(90deg, rgba(0,0,0,0.06), transparent 8%, transparent 92%, rgba(0,0,0,0.08))" }} />
    <div style={{ position: "absolute", left: 1700, top: 220, width: 60, height: 640, borderRadius: 30, background: "linear-gradient(90deg, #8E8E8E, #F4F4F4 40%, #A7A7A7)", boxShadow: "0 18px 30px rgba(0,0,0,0.35)" }} />
    <div style={{ position: "absolute", left: 360, top: 140, width: 800, height: 800, borderRadius: 400, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #E4E1D8)", boxShadow: SH, transform: `scale(${0.85 + 0.15 * u})`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", inset: 40, borderRadius: 360, background: `conic-gradient(${GRN2} ${15 * Math.min(h, 12)}deg, ${OK} ${15 * Math.min(h, 12)}deg ${15 * h}deg, rgba(0,0,0,0.06) ${15 * h}deg)` }} />
      <div style={{ position: "absolute", inset: 130, borderRadius: 270, background: "#FBFAF6", boxShadow: "inset 0 6px 16px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: ANT, fontSize: 230, lineHeight: 1, color: INK }}>{Math.round(h)}</div>
        <div style={{ fontFamily: ANT, fontSize: 60, letterSpacing: 8, color: "#7A746A" }}>HOURS</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1220, top: 260, opacity: cl(g12 * 2) }}><Ant txt="12 H = GOOD" size={110} color={GRN2} u={g12} sh={false} /></div>
    <div style={{ position: "absolute", left: 1220, top: 470, opacity: cl(g24 * 2) }}><Ant txt="24 H = BETTER" size={110} color={OK} u={g24} sh={false} /></div>
    <div style={{ position: "absolute", left: 1230, top: 680 }}><Hand txt="uncovered · no plastic wrap" u={cl((f - at(t24) - 12) / 24)} size={60} color={RED} /></div>
  </>);
};

// 12 · perilla grande del horno: 400 (CHICKEN, tachado) → gira a 275 (PORK SHOULDER)
export const OvenDial: P<{ t400: number; t275: number } & A0> = ({ a, d, t400, t275, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), k4 = ez((f - at(t400)) / 14), k2 = ez((f - at(t275)) / 22);
  const deg = -150 + 230 * k4 - 85 * k2;
  const marks: [number, string][] = [[-150, "200"], [-110, "250"], [-65, "275"], [-20, "300"], [20, "350"], [80, "400"], [120, "450"]];
  return shell(<Bg k="enamel" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 140, background: "linear-gradient(180deg, #E8E4DA, #CFCABE)", borderBottom: "8px solid #B5AF9F" }} />
    <div style={{ position: "absolute", left: 300, top: 260, opacity: cl(u * 2), transform: `scale(${0.85 + 0.15 * u})` }}>
      <Knob x={0} y={0} deg={deg} size={520} marks={marks} />
    </div>
    <div style={{ position: "absolute", left: 1150, top: 250, opacity: cl(k4 * 2) }}>
      <div style={{ position: "relative", display: "inline-block" }}><Ant txt="400° = CHICKEN" size={110} color="#6A6359" u={k4} sh={false} />
        <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 12, background: RED, transformOrigin: "0 50%", transform: `scaleX(${eo((f - at(t275) + 6) / 10)})` }} /></div>
    </div>
    <div style={{ position: "absolute", left: 1150, top: 470, opacity: cl(k2 * 2) }}>
      <Ant txt="275°F" size={240} color={RED} u={sp(f, at(t275), 11, 180)} sh={false} />
      <Hand txt="for a long time" u={cl((f - at(t275) - 12) / 22)} size={70} color={GRN} />
    </div>
  </>);
};

// 13 · colágeno → gelatina: hilos plateados tensos que se aflojan y se derriten en un charco dorado brillante
export const CollagenMelt: P<{ t0: number; tg: number; ts: number } & A0> = ({ a, d, t0, tg, ts, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), m = ez((f - at(tg) + 20) / 50), s = sp(f, at(ts), 12, 170), c0 = sp(f, at(t0), 12, 170);
  return shell(<Bg k="chalk" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 200, top: 200, width: 1100, height: 680, borderRadius: 40, background: "repeating-linear-gradient(170deg, rgba(255,255,255,0.10) 0 8px, transparent 8px 30px), radial-gradient(ellipse at 40% 35%, #D67C80, #A84B55)", boxShadow: SH, overflow: "hidden", opacity: cl(u * 2) }}>
      {[...Array(10)].map((_, i) => {
        const y = 60 + i * 62, wob = Math.sin(f / 9 + i) * 10 * m;
        return <div key={i} style={{ position: "absolute", left: 40, top: y, width: 1020, height: 10 + 26 * m, borderRadius: 20,
          background: m < 0.5 ? "linear-gradient(90deg, #E9EEF2, #FFFFFF, #C9D1D8)" : `linear-gradient(90deg, rgba(240,190,90,${0.5 + 0.4 * m}), rgba(255,226,140,${0.6 + 0.4 * m}), rgba(220,160,60,${0.5 + 0.4 * m}))`,
          transform: `translateY(${wob + 18 * m}px) scaleX(${1 - 0.1 * m})`, opacity: 1 - 0.15 * m, boxShadow: m > 0.5 ? "0 0 18px rgba(255,210,120,0.45)" : "0 2px 3px rgba(0,0,0,0.3)" }} />;
      })}
    </div>
    <div style={{ position: "absolute", left: 1380, top: 250 }}>
      <div style={{ position: "relative" }}><Ant txt="COLLAGEN" size={120} color="#E9EEF2" u={c0} />
        <div style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 10, background: RED, transformOrigin: "0 50%", transform: `scaleX(${eo((f - at(tg)) / 12)})` }} /></div>
      <div style={{ fontFamily: ANT, fontSize: 90, color: CREAM, margin: "18px 0", opacity: cl((f - at(tg)) / 8) }}>↓</div>
      <Ant txt="GELATIN" size={140} color="#FFD27A" u={sp(f, at(tg), 12, 170)} />
      <Hand txt="soft and silky" u={s} size={70} color={CREAM} />
    </div>
  </>);
};

// 14 · calculadora de horas: temporizador de cocina + cuenta (1½ h × 8 lb ≈ 10-11 h) en papel de carnicería
export const CookCalc: P<{ t1: number; t2: number; t3: number } & A0> = ({ a, d, t1, t2, t3, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), s1 = sp(f, at(t1), 12, 170), s2 = sp(f, at(t2), 12, 170), s3 = sp(f, at(t3), 11, 190), hh = 11 * ez((f - at(t3) + 6) / 30);
  return shell(<Bg k="paper" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 180, top: 220, width: 620, height: 620, borderRadius: 310, background: `radial-gradient(circle at 35% 30%, #E84D44, ${RED} 60%, #7E1A1E)`, boxShadow: SH, transform: `scale(${0.8 + 0.2 * u}) rotate(${(1 - u) * -30}deg)`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", inset: 60, borderRadius: 250, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #E9E4D8)", boxShadow: "inset 0 8px 16px rgba(0,0,0,0.2)" }}>
        <div style={{ position: "absolute", inset: 30, borderRadius: 220, background: `conic-gradient(rgba(31,74,58,0.85) ${(hh / 12) * 360}deg, transparent 0)` }} />
        <div style={{ position: "absolute", inset: 110, borderRadius: 140, background: "#FBF8F1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANT, fontSize: 130, color: INK }}>{Math.round(hh)}h</div>
      </div>
      <div style={{ position: "absolute", left: 270, top: -50, width: 80, height: 70, borderRadius: 14, background: "linear-gradient(180deg, #F2F2F2, #8C8C8C)" }} />
    </div>
    <div style={{ position: "absolute", left: 920, top: 230 }}>
      <div style={{ opacity: cl(s1 * 2) }}><Ant txt="1½ HOURS" size={130} color={GRN} u={s1} sh={false} /><Hand txt="for every pound" u={cl((f - at(t1) - 8) / 18)} size={64} color={INK} /></div>
      <div style={{ opacity: cl(s2 * 2), marginTop: 30 }}><Ant txt="× 8 LB" size={130} color={GRN} u={s2} sh={false} /></div>
      <div style={{ height: 8, background: INK, margin: "20px 0", transformOrigin: "0 50%", transform: `scaleX(${eo((f - at(t3) + 4) / 10)})`, width: 640 }} />
      <Ant txt="≈ 10 – 11 H" size={160} color={RED} u={s3} sh={false} />
    </div>
  </>);
};

// 15 · la curva del estancamiento: la temperatura sube, se queda plana en 160 (THE STALL) y el "subir a 400" se tacha
export const StallCurve: P<{ t160: number; tFlat: number; t165: number; tPanic: number } & A0> = ({ a, d, t160, tFlat, t165, tPanic, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  const p1 = ez((f - at(t160) + 30) / 30), p2 = ez((f - at(tFlat)) / 40), p3 = ez((f - at(t165)) / 30), pn = sp(f, at(tPanic), 11, 200);
  const X0 = 200, Y = (v: number) => 880 - (v - 40) * 3.4;
  const pts = [[X0, Y(40)], [X0 + 420 * p1, Y(40 + 120 * p1)]] as number[][];
  if (p2 > 0) pts.push([X0 + 420 + 380 * p2, Y(160)]);
  if (p3 > 0) pts.push([X0 + 800 + 260 * p3, Y(160 + 5 * p3)]);
  const dpath = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return shell(<Bg k="paper" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 120, top: 120, width: 1680, height: 860, borderRadius: 18, background: "repeating-linear-gradient(0deg, rgba(31,74,58,0.10) 0 2px, transparent 2px 68px), repeating-linear-gradient(90deg, rgba(31,74,58,0.10) 0 2px, transparent 2px 68px), #FBF6EC", boxShadow: SH, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 200}px)` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", opacity: cl(u * 2) }}>
      <line x1={X0} y1={Y(160)} x2={1700} y2={Y(160)} stroke="rgba(31,74,58,0.45)" strokeWidth={4} strokeDasharray="14 12" />
      <line x1={X0} y1={Y(203)} x2={1700} y2={Y(203)} stroke="rgba(47,122,74,0.6)" strokeWidth={4} strokeDasharray="14 12" />
      <path d={dpath} stroke={RED} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div style={{ position: "absolute", left: 140, top: Y(160) - 60, fontFamily: ANT, fontSize: 50, color: GRN }}>160°</div>
    <div style={{ position: "absolute", left: 140, top: Y(203) - 60, fontFamily: ANT, fontSize: 50, color: OK }}>203°</div>
    <div style={{ position: "absolute", left: 760, top: Y(160) - 240, opacity: cl(p2 * 3) }}><Ant txt="THE STALL" size={120} color={GRN} u={cl(p2 * 2)} sh={false} /><Hand txt="1 hour… 2 hours… still 160" u={cl(p2 * 1.4)} size={58} color={INK} /></div>
    <div style={{ position: "absolute", left: 1220, top: 640, transform: `rotate(-8deg) scale(${2 - Math.min(1, pn)})`, opacity: cl(pn * 3), border: `9px double ${RED}`, padding: "6px 28px", fontFamily: ANT, fontSize: 88, color: RED, background: "rgba(255,250,240,0.8)" }}>DON'T CRANK IT</div>
  </>);
};

// 16 · termómetro de cocina enorme con zonas: 145 SAFE·SLICE / 170 STILL TIGHT / 195 LETS GO / 200-205 PULL IT
export const DoneScale: P<{ t145: number; t170: number; t195: number; tGo: number } & A0> = ({ a, d, t145, t170, t195, tGo, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  const v = 120 + 25 * ez((f - at(t145) + 8) / 18) + 25 * ez((f - at(t170)) / 18) + 25 * ez((f - at(t195)) / 18) + 8 * ez((f - at(tGo)) / 18);
  const Y = (t: number) => 900 - (t - 120) * 8.2;
  const zones = [{ t: 145, at: t145, a: "145°", b: "safe · sliceable", c: "#6A6359" }, { t: 170, at: t170, a: "170°", b: "still tight", c: "#6A6359" }, { t: 195, at: t195, a: "195°", b: "the meat lets go", c: GRN2 }, { t: 203, at: tGo, a: "200–205°", b: "PULLED PORK", c: RED }];
  return shell(<Bg k="green" f={f} d={d} panels />, <>
    <div style={{ position: "absolute", left: 520, top: 120, width: 120, height: 840, borderRadius: 60, background: "linear-gradient(90deg, #C9C9C9, #FFFFFF 40%, #BDBDBD)", boxShadow: SH, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 38, right: 38, bottom: 60, height: (900 - Y(v)), borderRadius: 20, background: `linear-gradient(180deg, #E8564C, ${RED})` }} />
      <div style={{ position: "absolute", left: 10, bottom: -40, width: 100, height: 100, borderRadius: 50, background: `radial-gradient(circle at 35% 30%, #F06A5F, ${RED})` }} />
    </div>
    <div style={{ position: "absolute", left: 360, top: Y(v) - 40, fontFamily: ANT, fontSize: 80, color: CREAM, textShadow: "0 6px 16px rgba(0,0,0,0.5)" }}>{Math.round(v)}°</div>
    {zones.map((z, i) => { const s = sp(f, at(z.at), 12, 170); return <div key={i} style={{ position: "absolute", left: 700, top: Y(z.t) - 50, display: "flex", alignItems: "center", gap: 24, opacity: cl(s * 2), transform: `translateX(${(1 - s) * 60}px)` }}>
      <div style={{ width: 70, height: 8, background: CREAM }} />
      <div style={{ background: i === 3 ? RED : "rgba(245,236,219,0.95)", borderRadius: 12, padding: "6px 26px", boxShadow: "0 10px 20px rgba(0,0,0,0.35)", display: "flex", alignItems: "baseline", gap: 20 }}>
        <span style={{ fontFamily: ANT, fontSize: 76, color: i === 3 ? CREAM : z.c }}>{z.a}</span><span style={{ fontFamily: CAV, fontWeight: 700, fontSize: 56, color: i === 3 ? CREAM : INK }}>{z.b}</span></div>
    </div>; })}
  </>);
};

// 17 · conservadora en corte: paquete de aluminio envuelto en toallas a rayas dentro; marcas 1 H · 2 FINE · HOT 4 H
export const CoolerRest: P<{ t1: number; t2: number; t4: number } & A0> = ({ a, d, t1, t2, t4, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), lid = ez((f - at(start(a, a0)) - 8) / 18), s1 = sp(f, at(t1), 12, 170), s2 = sp(f, at(t2), 12, 170), s4 = sp(f, at(t4), 12, 170);
  return shell(<Bg k="wood" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 180, top: 300, width: 1000, height: 600, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 200}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 80, width: 1000, height: 520, borderRadius: 40, background: "linear-gradient(180deg, #3D7FB8, #2A5E8C)", boxShadow: SH }}>
        <div style={{ position: "absolute", inset: 40, borderRadius: 24, background: "linear-gradient(180deg, #F3F1EA, #DDD9CF)", boxShadow: "inset 0 10px 20px rgba(0,0,0,0.25)" }}>
          <div style={{ position: "absolute", left: 100, right: 100, top: 70, bottom: 50, borderRadius: 60, background: "repeating-linear-gradient(90deg, #E9D7B0 0 40px, #C66B4E 40px 54px, #E9D7B0 54px 96px, #6D8CB3 96px 106px)", boxShadow: "0 12px 20px rgba(0,0,0,0.3)" }}>
            <div style={{ position: "absolute", left: 120, right: 120, top: 60, bottom: 60, borderRadius: 40, background: TX.marble.replace("#F2F1EE", "#E9ECEF").replace("#DCDAD5", "#AAB1B8"), boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.4)" }} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: -10, top: 30, width: 1020, height: 110, borderRadius: 30, background: "linear-gradient(180deg, #F4F2EC, #D9D5CB)", boxShadow: "0 14px 24px rgba(0,0,0,0.35)", transformOrigin: "0 100%", transform: `rotate(${-24 * (1 - lid)}deg)` }} />
      {[...Array(5)].map((_, i) => <div key={i} style={{ position: "absolute", left: 200 + i * 140, top: -30 - ((f / 2 + i * 13) % 50), width: 8, height: 50, borderRadius: 4, background: "rgba(255,255,255,0.35)", opacity: 1 - lid * 0.9 }} />)}
    </div>
    <div style={{ position: "absolute", left: 1290, top: 230 }}>
      <div style={{ opacity: cl(s1 * 2) }}><Ant txt="1 HOUR" size={150} color={CREAM} u={s1} /></div>
      <div style={{ opacity: cl(s2 * 2), marginTop: 10 }}><Hand txt="two is fine" u={cl((f - at(t2)) / 18)} size={84} color="#F2D9A6" style={{ textShadow: "0 3px 10px rgba(0,0,0,0.6)" }} /></div>
      <div style={{ opacity: cl(s4 * 2), marginTop: 30 }}><Ant txt="HOT FOR 4 H" size={110} color="#FFB37A" u={s4} /></div>
    </div>
  </>);
};

// 18 · pizarra de "qué salió mal": cada problema a la izquierda en mayúsculas de tiza, la causa→arreglo a mano
export const TroubleBoard: P<{ rows: { t: number; a: string; b: string }[]; done?: [string, string][] } & A0> = ({ a, d, rows, done = [], a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  const all = [...done.map(([x, y]) => ({ a: x, b: y, t: -999 })), ...rows];
  return shell(<Bg k="green" f={f} d={d} panels />, <>
    <div style={{ position: "absolute", left: 160, top: 90, width: 1600, height: 900, borderRadius: 10, background: TX.wood, boxShadow: SH, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 200}px)` }}>
      <div style={{ position: "absolute", inset: 34, borderRadius: 6, background: TX.chalk, boxShadow: "inset 0 6px 18px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", left: 70, top: 30, fontFamily: ANT, fontSize: 74, letterSpacing: 6, color: "#F6D26B", textShadow: "0 0 3px rgba(246,210,107,0.5)" }}>IF IT WENT WRONG…</div>
        {all.map((r, i) => { const old = r.t < 0; const p = old ? 1 : cl((f - at(r.t)) / 18);
          return <div key={i} style={{ position: "absolute", left: 70, top: 150 + i * 160, display: "flex", alignItems: "center", gap: 40, opacity: old ? 0.55 : 1 }}>
            <div style={{ width: 300, fontFamily: ANT, fontSize: 96, color: "#F4F1E8", textShadow: "0 0 3px rgba(255,255,255,0.5)", opacity: cl(p * 3) }}>{r.a}</div>
            <Hand txt={r.b} u={old ? 1 : cl((f - at(r.t) - 10) / 24)} size={74} color="#CFE4D6" />
          </div>; })}
      </div>
    </div>
  </>);
};

// 19 · recibo del local en papel de carnicería (rollo) con totales que se imprimen
export const Receipt: P<{ rows: { t: number; a: string; b: string }[]; total: { t: number; a: string; b: string } } & A0> = ({ a, d, rows, total, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 100), tt = sp(f, at(total.t), 11, 190);
  return shell(<Bg k="marble" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 540, top: 70, width: 840, height: 940, transform: `rotate(${2 - 2 * u}deg) translateY(${(1 - u) * -600}px)` }}>
      <div style={{ position: "absolute", inset: 0, background: TX.paper, boxShadow: SH, clipPath: "polygon(0 0,100% 0,100% 98%,96% 100%,92% 98%,88% 100%,84% 98%,80% 100%,76% 98%,72% 100%,68% 98%,64% 100%,60% 98%,56% 100%,52% 98%,48% 100%,44% 98%,40% 100%,36% 98%,32% 100%,28% 98%,24% 100%,20% 98%,16% 100%,12% 98%,8% 100%,4% 98%,0 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center" }}>
        <div style={{ fontFamily: ANT, fontSize: 70, color: GRN, letterSpacing: 4 }}>MICKEY'S</div>
        <div style={{ fontFamily: ANT, fontSize: 36, color: "#7B5B52", letterSpacing: 10 }}>BUTCHER SHOP · DORCHESTER</div>
      </div>
      {rows.map((r, i) => { const s = sp(f, at(r.t), 12, 170); return <div key={i} style={{ position: "absolute", left: 70, right: 70, top: 260 + i * 140, display: "flex", justifyContent: "space-between", fontFamily: ANT, fontSize: 64, color: INK, opacity: cl(s * 2), transform: `translateY(${(1 - s) * 20}px)` }}><span>{r.a}</span><span>{r.b}</span></div>; })}
      <div style={{ position: "absolute", left: 60, right: 60, top: 260 + rows.length * 140, borderTop: "6px dashed #8E6A60" }} />
      <div style={{ position: "absolute", left: 70, right: 70, top: 300 + rows.length * 140, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: cl(tt * 2) }}>
        <span style={{ fontFamily: ANT, fontSize: 60, color: INK }}>{total.a}</span><span style={{ fontFamily: ANT, fontSize: 170, color: RED, transform: `scale(${0.7 + 0.3 * tt})`, display: "inline-block" }}>{total.b}</span></div>
    </div>
  </>);
};

// billete dibujado (verde, guarda, círculo con el valor)
const Bill: React.FC<{ v: string; x: number; y: number; r: number; dim?: boolean }> = ({ v, x, y, r, dim }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 520, height: 230, borderRadius: 10, transform: `rotate(${r}deg)`, background: dim ? "linear-gradient(160deg, #B9C4B2, #94A38C)" : "linear-gradient(160deg, #CFE0C4, #9FBE90)", boxShadow: "0 10px 18px rgba(0,0,0,0.3)" }}>
    <div style={{ position: "absolute", inset: 14, borderRadius: 6, border: "5px solid rgba(40,80,50,0.55)", background: "repeating-linear-gradient(45deg, rgba(40,80,50,0.07) 0 3px, transparent 3px 9px)" }} />
    <div style={{ position: "absolute", left: 190, top: 45, width: 140, height: 140, borderRadius: 70, border: "5px solid rgba(40,80,50,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANT, fontSize: 64, color: "#2D5A3A" }}>{v}</div>
  </div>
);
// 20 · $120 vs $16: a la izquierda la pila de billetes del restaurante, a la derecha uno solo; balanza que se inclina
export const VsBills: P<{ tL: number; tR: number } & A0> = ({ a, d, tL, tR, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), l = sp(f, at(tL), 12, 160), r = sp(f, at(tR), 12, 160);
  return shell(<Bg k="paper" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 958, top: 120, width: 6, height: 860, background: "rgba(90,46,22,0.35)" }} />
    <div style={{ position: "absolute", left: 120, top: 120, opacity: cl(u * 2) }}><Ant txt="DOWNTOWN" size={80} color={INK} u={u} sh={false} /></div>
    <div style={{ position: "absolute", left: 1060, top: 120, opacity: cl(u * 2) }}><Ant txt="YOUR OVEN" size={80} color={GRN} u={u} sh={false} /></div>
    {[...Array(6)].map((_, i) => <div key={i} style={{ opacity: cl(l * 3 - i * 0.3), transform: `translateY(${(1 - cl(l * 2 - i * 0.15)) * -300}px)` }}><Bill v="$20" x={180 + (i % 2) * 40} y={560 - i * 46} r={-6 + i * 3} dim /></div>)}
    <div style={{ position: "absolute", left: 160, top: 820, opacity: cl(l * 2) }}><Ant txt="$120" size={190} color={RED} u={l} sh={false} /></div>
    <div style={{ opacity: cl(r * 2), transform: `translateY(${(1 - r) * -300}px)` }}><Bill v="$16" x={1180} y={530} r={4} /></div>
    <div style={{ position: "absolute", left: 1180, top: 820, opacity: cl(r * 2) }}><Ant txt="$16" size={190} color={OK} u={r} sh={false} /></div>
  </>);
};

// 21 · tres noches: tres hojas de calendario de pared (SUN / TUE / THU) que se arrancan una a una con su plato a mano
export const ThreeNights: P<{ days: { t: number; d: string; txt: string }[] } & A0> = ({ a, d, days, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  return shell(<Bg k="green" f={f} d={d} panels />, <>
    {days.map((dy, i) => { const s = sp(f, at(dy.t), 12, 150); const x = 170 + i * 560;
      return <div key={i} style={{ position: "absolute", left: x, top: 200, width: 480, height: 640, opacity: cl(s * 2) * cl(u * 2), transform: `rotate(${(i - 1) * 3}deg) translateY(${(1 - s) * 120}px) perspective(1200px) rotateX(${(1 - s) * 40}deg)`, transformOrigin: "50% 0" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "linear-gradient(180deg, #FFFEFA, #EFE7D7)", boxShadow: SH }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 150, borderRadius: "10px 10px 0 0", background: `linear-gradient(180deg, #CF3C36, ${RED})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANT, fontSize: 100, color: CREAM, letterSpacing: 8 }}>{dy.d}</div>
        {[60, 200, 340].map((rx) => <div key={rx} style={{ position: "absolute", left: rx + 20, top: -16, width: 26, height: 40, borderRadius: 13, background: "linear-gradient(90deg, #888, #EEE, #888)" }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", fontFamily: ANT, fontSize: 200, color: INK, lineHeight: 1 }}>{i + 1}</div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 470, textAlign: "center" }}><Hand txt={dy.txt} u={cl((f - at(dy.t) - 8) / 22)} size={66} color={GRN} style={{ display: "inline-block" }} /></div>
      </div>; })}
  </>);
};

// 22 · el repaso: rollo de tickets de turno ("now serving") con los 7 trucos; el actual en rojo, los dichos con tilde
export const TicketList: P<{ items: { t: number; txt: string }[] } & A0> = ({ a, d, items, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  const sec = a + f / 30; let cur = -1; items.forEach((it, i) => { if (sec >= it.t - 0.1) cur = i; });
  return shell(<Bg k="marble" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 120, top: 110, opacity: cl(u * 2) }}><Ant txt="7 OLD BUTCHER TRICKS" size={84} color={GRN} u={u} sh={false} /></div>
    {items.map((it, i) => { const s = sp(f, at(it.t), 12, 170), on = i === cur, y = 240 + i * 112;
      return <div key={i} style={{ position: "absolute", left: 120 + (on ? 30 : 0), top: y, width: 1500, height: 96, display: "flex", alignItems: "center", opacity: cl(s * 2) * (on ? 1 : 0.8), transform: `translateX(${(1 - s) * -80}px)` }}>
        <div style={{ width: 150, height: 96, background: on ? RED : "#E6DCC9", clipPath: "polygon(0 0,100% 0,88% 50%,100% 100%,0 100%,12% 50%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANT, fontSize: 64, color: on ? CREAM : INK, boxShadow: SH }}>{i + 1}</div>
        <div style={{ marginLeft: 24, fontFamily: ANT, fontSize: on ? 70 : 58, color: on ? INK : "#5A544A" }}>{it.txt.toUpperCase()}</div>
        {i < cur ? <div style={{ marginLeft: 20 }}><Tick u={1} size={58} /></div> : null}
      </div>; })}
  </>);
};
