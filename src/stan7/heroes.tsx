// ── HÉROES de stan7 (StanTheButcher, video 7: la kielbasa no se fríe, se baña). Claude, 16-oct-2026.
//    Juego PROPIO (no recicla stan1-6): sartén que falla con sellos, pizarra de beer garden, plato $19 vs $2, cartel del local, foto 1961,
//    cita en polaco, capítulo = azulejo esmaltado con número, etiqueta al dorso, firme vs pasta, ahumada vs fresca, tenedor = puertas,
//    manómetro de vapor, olla fría en corte, termómetro "tiembla no baila", ficha de tiempos, receta del agua, frasco de caldo, cerveza
//    1 + agua, mojada vs seca, olla vs sartén, cronómetro de sartén, pasos de la cebolla, monedas vs óvalos, pizarra de problemas,
//    balanza de plata, 1 anillo = 2 cenas, rollo de ticket del resumen, tarea, tarjeta de comentarios.
//    PURO CSS (cero imágenes): texturas dibujadas con gradientes + perspectiva + sombras en capas + brillo que barre.
//    Tipografías: 2 familias (Bebas Neue = rótulos y números · Patrick Hand = mano). Paleta del local: azulejo blanco, rojo de la gorra, kraft, hierro, kielbasa.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadPH } from "@remotion/google-fonts/PatrickHand";
import { useT, sp, ez, eo, cl, P } from "../lkit/core";

const BEB = loadBebas("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const PH = loadPH("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const RED = "#C3312A", OX = "#7E1D18", CREAM = "#F7F1E4", INK = "#211C18", BRASS = "#C59A45", OK = "#2F7A4A", SAUS = "#8A3A1E", SAUS2 = "#5E2210", STEEL = "#B9BEC2", BLUE = "#3E7FC1";
type A0 = { a0?: number };
type It = { t: number; txt: string };

// ── texturas del oficio (gradientes) ─────────────────────────────────────
const TX: Record<string, string> = {
  tile: "linear-gradient(90deg, rgba(150,145,135,0.55) 0 4px, transparent 4px), linear-gradient(0deg, rgba(150,145,135,0.55) 0 4px, transparent 4px), radial-gradient(ellipse 60% 50% at 30% 20%, rgba(255,255,255,0.9), transparent 70%), linear-gradient(170deg, #F6F4EE, #DCD8CE)",
  kraft: "repeating-linear-gradient(23deg, rgba(80,50,20,0.06) 0 1px, transparent 1px 9px), repeating-linear-gradient(-67deg, rgba(255,240,210,0.07) 0 1px, transparent 1px 13px), radial-gradient(ellipse 35% 25% at 80% 70%, rgba(255,230,190,0.18), transparent 70%), linear-gradient(170deg, #CDA878, #B08454)",
  block: "repeating-linear-gradient(90deg, rgba(50,25,8,0.22) 0 3px, transparent 3px 120px), repeating-linear-gradient(0deg, rgba(50,25,8,0.22) 0 3px, transparent 3px 120px), repeating-radial-gradient(circle at 30% 40%, rgba(60,30,10,0.10) 0 2px, transparent 2px 9px), linear-gradient(160deg, #A06C3E, #77492A)",
  chalk: "radial-gradient(ellipse 40% 18% at 30% 35%, rgba(255,255,255,0.08), transparent 70%), radial-gradient(ellipse 30% 14% at 70% 65%, rgba(255,255,255,0.07), transparent 70%), repeating-linear-gradient(170deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 9px), linear-gradient(180deg, #2C302D, #1D211E)",
  steel: "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px), conic-gradient(from 200deg at 50% 50%, #8E9499, #D6DADD, #9DA3A8, #E3E6E8, #8E9499)",
  paper: "repeating-linear-gradient(0deg, rgba(120,110,90,0.05) 0 1px, transparent 1px 7px), radial-gradient(ellipse 45% 35% at 30% 30%, rgba(255,255,255,0.6), transparent 70%), linear-gradient(170deg, #FBF7EE, #ECE4D3)",
  stove: "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(255,255,255,0.35), transparent 70%), linear-gradient(180deg, #33302C, #171513)",
};
// fondo de azulejo con tamaño de azulejo
const tileSize = { backgroundSize: "150px 75px, 150px 75px, 100% 100%, 100% 100%" } as React.CSSProperties;
const Bg: React.FC<{ k: keyof typeof TX; f: number; d: number }> = ({ k, f, d }) => {
  const sweep = -30 + 160 * (f / Math.max(1, d));
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ background: TX[k], ...(k === "tile" ? tileSize : {}), transform: `scale(${1.05 + 0.03 * f / Math.max(1, d)})` }} />
    <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(255,250,235,0.12) ${sweep}%, transparent ${sweep + 12}%)` }} />
    <AbsoluteFill style={{ background: k === "tile" || k === "paper" ? "radial-gradient(ellipse 90% 70% at 50% 40%, transparent 55%, rgba(60,45,30,0.25))" : "radial-gradient(ellipse 80% 60% at 35% 0%, rgba(255,226,180,0.16), rgba(255,226,180,0) 70%)" }} />
  </AbsoluteFill>;
};
const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${-7 * Math.sin(f / 45)}px, ${5 * Math.cos(f / 51)}px) scale(${1.02 + 0.01 * Math.sin(f / 59)})` }}>{children}</AbsoluteFill>;
};
const shell = (bg: React.ReactNode, c: React.ReactNode) => <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{bg}<Drift>{c}</Drift></AbsoluteFill>;
const Beb: React.FC<{ txt: string; size: number; color?: string; u?: number; style?: React.CSSProperties; sh?: boolean }> = ({ txt, size, color = INK, u = 1, style, sh = false }) => (
  <div style={{ fontFamily: BEB, fontSize: size, color, lineHeight: 0.98, letterSpacing: 2, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 26}px) scale(${0.9 + 0.1 * u})`,
    textShadow: sh ? "0 3px 0 rgba(0,0,0,0.25), 0 10px 26px rgba(0,0,0,0.45)" : undefined, whiteSpace: "nowrap", ...style }}>{txt}</div>
);
const Hand: React.FC<{ txt: string; u: number; size: number; color?: string; style?: React.CSSProperties }> = ({ txt, u, size, color = INK, style }) => (
  <div style={{ fontFamily: PH, fontSize: size, color, whiteSpace: "nowrap", lineHeight: 1.08, paddingRight: "0.5em", clipPath: `inset(-25% ${(100 - 100 * ez(u)) * 1.1 - 8}% -25% -2%)`, ...style }}>{txt}</div>
);
const Tick: React.FC<{ u: number; no?: boolean; size?: number; color?: string }> = ({ u, no, size = 70, color }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" style={{ overflow: "visible", flex: "none" }}>
    <path d={no ? "M 10 10 L 42 42 M 42 10 L 10 42" : "M 8 28 L 21 40 L 44 12"} stroke={color || (no ? RED : OK)} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);
const Strike: React.FC<{ u: number; w: number; color?: string; top?: string }> = ({ u, w, color = RED, top = "52%" }) => (
  <div style={{ position: "absolute", left: -10, top, width: (w + 20) * eo(u), height: 9, borderRadius: 5, background: color, transform: "rotate(-3deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.25)" }} />
);
const SH = "0 2px 3px rgba(0,0,0,0.35), 0 18px 30px rgba(0,0,0,0.32), 0 44px 80px rgba(0,0,0,0.28)";
const start = (a: number, a0?: number) => (a0 ?? a);
const fade = (f: number, at: number, n = 10) => cl((f - at) / n);

// kielbasa dibujada (anillo en U o tramo recto). burn = 0..1 quemado; split = tajo abierto
const Saus: React.FC<{ w: number; h: number; burn?: number; split?: number; pale?: boolean; style?: React.CSSProperties }> = ({ w, h, burn = 0, split = 0, pale, style }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: h / 2, boxShadow: "0 8px 14px rgba(0,0,0,0.35)", ...style,
    background: pale ? "linear-gradient(180deg, #F2E3D3, #D9C2AA 60%, #B89C80)" : `linear-gradient(180deg, ${burn > 0.5 ? "#4A1E10" : "#B5572E"}, ${SAUS} 45%, ${SAUS2})` }}>
    <div style={{ position: "absolute", left: "8%", right: "12%", top: h * 0.14, height: h * 0.16, borderRadius: h, background: "linear-gradient(90deg, transparent, rgba(255,235,210,0.55), transparent)" }} />
    {burn > 0 ? <div style={{ position: "absolute", inset: 0, borderRadius: h / 2, opacity: burn, background: "radial-gradient(ellipse 18% 60% at 20% 40%, #120804 30%, transparent 70%), radial-gradient(ellipse 22% 55% at 68% 60%, #1A0B05 30%, transparent 70%), radial-gradient(ellipse 12% 50% at 88% 30%, #120804 30%, transparent 70%)" }} /> : null}
    {split > 0 ? <div style={{ position: "absolute", left: "26%", top: h * 0.3, width: `${44 * split}%`, height: h * 0.34, borderRadius: h, background: "radial-gradient(ellipse at 50% 50%, #F0B9A0, #C8735A 60%, #6E2A16)", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.5)" }} /> : null}
  </div>
);
// sartén de hierro vista desde arriba
const Pan: React.FC<{ x: number; y: number; r: number; hot?: number; children?: React.ReactNode }> = ({ x, y, r, hot = 0, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2 }}>
    <div style={{ position: "absolute", left: r * 1.85, top: r * 0.86, width: r * 1.1, height: r * 0.28, borderRadius: 18, background: "linear-gradient(180deg, #3A3836, #121110)", boxShadow: SH }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #4A4744, #1C1B1A 60%, #0C0B0B)", boxShadow: SH + ", inset 0 0 0 16px #2A2826, inset 0 0 0 19px #46423F" }} />
    <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: `radial-gradient(circle at 50% 50%, rgba(255,120,40,${0.22 * hot}), transparent 70%), repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0 3px, transparent 3px 9px)` }} />
    {children}
  </div>
);
// olla de acero de costado (corte): agua azul, nivel lv (0..1)
const Pot: React.FC<{ x: number; y: number; w: number; h: number; water?: string; lv?: number; children?: React.ReactNode }> = ({ x, y, w, h, water = "linear-gradient(180deg, rgba(120,180,230,0.75), rgba(40,100,170,0.85))", lv = 0.7, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
    {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", top: 40, [s < 0 ? "left" : "right"]: -60, width: 70, height: 30, borderRadius: 14, background: TX.steel, boxShadow: "0 6px 10px rgba(0,0,0,0.35)" }} />)}
    <div style={{ position: "absolute", inset: 0, borderRadius: "10px 10px 46px 46px", background: TX.steel, boxShadow: SH, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 18, borderRadius: "6px 6px 34px 34px", background: "linear-gradient(180deg, #2F3336, #4A4F53)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lv * 100}%`, background: water, boxShadow: "inset 0 6px 0 rgba(255,255,255,0.35)" }} />
        {children}
      </div>
    </div>
  </div>
);
// azulejo esmaltado con texto (cartel)
const Plaque: React.FC<{ w: number; h: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ w, h, color = RED, style, children }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 22, background: `linear-gradient(170deg, ${color}, ${OX})`, boxShadow: SH + ", inset 0 3px 0 rgba(255,255,255,0.3)", ...style }}>
    <div style={{ position: "absolute", inset: 18, borderRadius: 14, border: `5px solid ${CREAM}` }} />
    {children}
  </div>
);
// tarjeta de papel (ficha) con renglones
const Card: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; u?: number; children: React.ReactNode; tex?: keyof typeof TX }> = ({ x, y, w, h, rot = 0, u = 1, children, tex = "paper" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 8, background: TX[tex], boxShadow: SH,
    transform: `perspective(1600px) rotateX(${(1 - u) * 30}deg) rotate(${rot}deg) translateY(${(1 - u) * 300}px)`, opacity: cl(u * 2) }}>{children}</div>
);
// lista animada: cada renglón aparece en SU t
const Rows: React.FC<{ rows: It[]; f: number; at: (t: number) => number; size: number; gap: number; color?: string; mark?: boolean }> = ({ rows, f, at, size, gap, color = INK, mark = true }) => (
  <div style={{ display: "flex", flexDirection: "column", gap }}>
    {rows.map((r, i) => { const k = sp(f, at(r.t), 14, 150); return (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, opacity: cl(k * 2), transform: `translateX(${(1 - k) * 60}px)` }}>
        {mark ? <Tick u={cl((f - at(r.t)) / 12)} size={size * 0.85} /> : null}
        <Hand txt={r.txt} u={cl((f - at(r.t)) / 16)} size={size} color={color} />
      </div>); })}
  </div>
);

// 1 · sartén que falla: kielbasa que se parte y se quema; sellos rojos en su palabra
export const PanFail: P<{ items: It[] } & A0> = ({ a, d, items, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 120);
  const k = (i: number) => cl((f - at(items[i]?.t ?? 1e9)) / 18);
  return shell(<Bg k="stove" f={f} d={d} />, <>
    <div style={{ transform: `translateY(${(1 - u) * 200}px) rotate(${-4 + Math.sin(f / 9) * 0.3 * k(1)}deg)`, opacity: cl(u * 2) }}>
      <Pan x={240} y={170} r={370} hot={1}>
        <Saus w={520} h={120} burn={k(2)} split={k(0)} style={{ position: "absolute", left: 110, top: 250, transform: "rotate(-14deg)" }} />
        <Saus w={460} h={110} burn={k(2) * 0.8} split={k(0) * 0.8} style={{ position: "absolute", left: 160, top: 420, transform: "rotate(8deg)" }} />
        {Array.from({ length: 14 }).map((_, i) => { const ph = (f * 0.9 + i * 13) % 40, on = k(1); return <div key={i} style={{ position: "absolute", left: 200 + (i * 71) % 380, top: 260 + (i * 53) % 260 - ph * 4 * on, width: 12, height: 12, borderRadius: 6, background: "rgba(255,220,140,0.9)", opacity: on * (1 - ph / 40) }} />; })}
      </Pan>
    </div>
    <div style={{ position: "absolute", left: 1120, top: 170, display: "flex", flexDirection: "column", gap: 34 }}>
      {items.map((it, i) => { const s = sp(f, at(it.t), 10, 200); return (
        <div key={i} style={{ transform: `rotate(${[-5, 3, -2, 4][i % 4]}deg) scale(${2 - s})`, opacity: cl(s * 3), border: `8px solid ${RED}`, borderRadius: 12, padding: "6px 26px", alignSelf: "flex-start", background: "rgba(195,49,42,0.08)" }}>
          <Beb txt={it.txt} size={104} color={RED} />
        </div>); })}
    </div>
  </>);
};

// 2 · pizarra del beer garden: POLISH SAUSAGE PLATE … $19 (rodeado dos veces)
export const MenuBoard: P<{ tItem: number; tPrice: number; tAgain: number } & A0> = ({ a, d, tItem, tPrice, tAgain, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), p = sp(f, at(tPrice), 10, 180), r1 = cl((f - at(tPrice) - 4) / 14), r2 = cl((f - at(tAgain)) / 14);
  return shell(<Bg k="block" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 260, top: 90, width: 1400, height: 900, borderRadius: 16, background: TX.chalk, boxShadow: SH + ", inset 0 0 0 26px #6B4524, inset 0 0 0 30px #3C2512", transform: `perspective(1800px) rotateY(${(1 - u) * -25}deg)`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Beb txt="— BEER GARDEN —" size={84} color="#EDE7D8" style={{ letterSpacing: 14, opacity: 0.85 }} /></div>
      {[["PRETZEL & MUSTARD", "11"], ["POLISH SAUSAGE PLATE", "19"], ["BRAT ON A BUN", "14"]].map(([n, pr], i) => { const hi = i === 1; const k = hi ? sp(f, at(tItem), 12, 150) : 1; return (
        <div key={i} style={{ position: "absolute", left: 110, right: 110, top: 240 + i * 200, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: hi ? 1 : 0.4 }}>
          <Hand txt={n} u={hi ? cl((f - at(tItem)) / 20) : 1} size={hi ? 96 : 76} color="#F4F0E6" style={{ textShadow: "0 0 8px rgba(255,255,255,0.35)", transform: `scale(${hi ? 0.9 + 0.1 * k : 1})` }} />
          <div style={{ position: "relative" }}>
            <Beb txt={`$${pr}`} size={hi ? 190 * (0.6 + 0.4 * p) : 100} color={hi ? "#FFD25A" : "#F4F0E6"} style={{ opacity: hi ? cl(p * 2) : 1 }} />
            {hi ? <svg width={330} height={230} viewBox="0 0 330 230" style={{ position: "absolute", left: -70, top: -20, overflow: "visible" }}>
              <ellipse cx={165} cy={115} rx={150} ry={95} stroke={RED} strokeWidth={10} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - r1} transform="rotate(-6 165 115)" />
              <ellipse cx={165} cy={115} rx={160} ry={104} stroke={RED} strokeWidth={8} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - r2} transform="rotate(5 165 115)" opacity={0.85} />
            </svg> : null}
          </div>
        </div>); })}
    </div>
  </>);
};

// 3 · plato $19 tachado vs $2 por persona en papel de envolver
export const PlateVs: P<{ tL: number; tR: number } & A0> = ({ a, d, tL, tR, a0 }) => {
  const { f, at } = useT(a);
  const l = sp(f, at(Math.min(tL, start(a, a0) + 0.2)), 13, 140), r = sp(f, at(tR), 12, 150), x = cl((f - at(tR) + 6) / 14);
  const plate = (cx: number, burnt: boolean, k: number) => (
    <div style={{ position: "absolute", left: cx - 300, top: 260, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #FFFFFF, #E9E5DD 62%, #CFC9BE 63%, #F4F1EA 70%, #D8D2C6)", boxShadow: SH, transform: `scale(${0.7 + 0.3 * k}) rotate(${(1 - k) * 30}deg)`, opacity: cl(k * 2) }}>
      <Saus w={330} h={92} burn={burnt ? 0.9 : 0} split={burnt ? 1 : 0} style={{ position: "absolute", left: 130, top: 230, transform: "rotate(-18deg)" }} />
      {!burnt ? <div style={{ position: "absolute", left: 120, top: 330, width: 360, height: 120, borderRadius: 60, background: "repeating-linear-gradient(110deg, #D9A14C 0 10px, #F0C877 10px 18px, #B87A2E 18px 24px)", opacity: 0.95 }} /> : null}
    </div>);
  return shell(<Bg k="kraft" f={f} d={d} />, <>
    {plate(520, true, l)}{plate(1400, false, r)}
    <div style={{ position: "absolute", left: 360, top: 100 }}><Beb txt="BEER GARDEN" size={70} color={INK} u={l} /></div>
    <div style={{ position: "absolute", left: 1240, top: 100 }}><Beb txt="STAN'S WAY" size={70} color={INK} u={r} /></div>
    <div style={{ position: "absolute", left: 400, top: 880 }}>
      <div style={{ position: "relative" }}><Beb txt="$19" size={150} color={INK} u={l} /><Strike u={x} w={210} /></div>
    </div>
    <div style={{ position: "absolute", left: 1200, top: 880, display: "flex", alignItems: "baseline", gap: 20 }}><Beb txt="$2" size={170} color={RED} u={r} /><Hand txt="a person" u={cl((f - at(tR) - 8) / 16)} size={72} /></div>
  </>);
};

// 4 · cartel del local: WOZNIAK MEATS · 52 YEARS · SOUTH SIDE CHICAGO · since Poland · every Thursday
export const ShopSign: P<{ t52: number; tPl: number; tTh: number } & A0> = ({ a, d, t52, tPl, tTh, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), n = eo(cl((f - at(t52)) / 30)), p = sp(f, at(tPl), 13, 150), t = sp(f, at(tTh), 13, 150);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 260, top: 110, transform: `perspective(1600px) rotateX(${(1 - u) * -40}deg)`, transformOrigin: "50% 0", opacity: cl(u * 2) }}>
      <Plaque w={1400} h={380}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center" }}><Beb txt="WOZNIAK MEATS" size={220} color={CREAM} sh /></div>
      </Plaque>
    </div>
    <div style={{ position: "absolute", left: 300, top: 560, display: "flex", alignItems: "center", gap: 30 }}>
      <Beb txt={String(Math.round(52 * n))} size={300} color={OX} u={cl(n * 3)} />
      <div><Beb txt="YEARS BEHIND" size={84} color={INK} u={cl(n * 3)} /><Beb txt="THE SAME COUNTER" size={84} color={INK} u={cl(n * 3)} /></div>
    </div>
    <div style={{ position: "absolute", left: 1180, top: 560, transform: `rotate(-4deg) scale(${0.8 + 0.2 * p})`, opacity: cl(p * 2), background: TX.kraft, padding: "22px 36px", boxShadow: SH, borderRadius: 6 }}>
      <Hand txt="Poland → South Side" u={cl((f - at(tPl)) / 18)} size={66} />
    </div>
    <div style={{ position: "absolute", left: 1240, top: 760, transform: `rotate(3deg) scale(${0.8 + 0.2 * t})`, opacity: cl(t * 2), background: TX.paper, padding: "22px 36px", boxShadow: SH, borderRadius: 6 }}>
      <Hand txt="kielbasa every Thursday" u={cl((f - at(tTh)) / 18)} size={60} color={OX} />
    </div>
  </>);
};

// 5 · foto de 1961 que se revela (polaroid de borde blanco) + "STAN, AGE 7" + sábado
export const Snapshot61: P<{ t61: number; t7: number; tSat: number } & A0> = ({ a, d, t61, t7, tSat, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 100), dev = cl((f - at(t61)) / 40), k7 = sp(f, at(t7), 12, 150), ks = sp(f, at(tSat), 12, 150);
  return shell(<Bg k="block" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 360, top: 120, width: 760, height: 860, background: "linear-gradient(170deg, #FBF6EA, #E8DFCB)", boxShadow: SH, transform: `rotate(${-5 + (1 - u) * -20}deg) translateY(${(1 - u) * 400}px)`, padding: 44 }}>
      <div style={{ width: 672, height: 620, position: "relative", overflow: "hidden", background: "#1A1410" }}>
        <div style={{ position: "absolute", inset: 0, opacity: dev, background: "linear-gradient(180deg, #D8C6A2 0 38%, #A88A62 38% 40%, #C9B490 40%)" }}>
          {/* cocina de 1961: azulejo, estufa, sartén humeando */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "38%", background: "linear-gradient(90deg, rgba(120,100,70,0.35) 0 2px, transparent 2px), linear-gradient(0deg, rgba(120,100,70,0.35) 0 2px, transparent 2px)", backgroundSize: "60px 30px" }} />
          <div style={{ position: "absolute", left: 120, top: 230, width: 420, height: 330, borderRadius: 14, background: "linear-gradient(180deg, #F0E8D6, #C8BCA2)", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>
            <div style={{ position: "absolute", left: 40, top: 120, width: 340, height: 170, borderRadius: 10, border: "8px solid #8C826E" }} />
          </div>
          <div style={{ position: "absolute", left: 230, top: 170, width: 220, height: 60, borderRadius: "50%", background: "#1E1A16" }} />
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 250 + i * 60, top: 20 + ((f * 1.2 + i * 30) % 120), width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(90,85,80,0.55), transparent 70%)" }} />)}
        </div>
        <AbsoluteFill style={{ background: "linear-gradient(160deg, rgba(255,200,120,0.18), rgba(120,60,20,0.2))", mixBlendMode: "multiply" }} />
      </div>
      <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between" }}>
        <Hand txt="Stan, age 7" u={cl((f - at(t7)) / 20)} size={66} color="#3B2F7A" />
        <Hand txt="Sat. '61" u={cl((f - at(tSat)) / 20)} size={66} color="#3B2F7A" />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1220, top: 260, opacity: cl(dev * 2) }}><Beb txt="1961" size={360} color={CREAM} sh /></div>
    <div style={{ position: "absolute", left: 1240, top: 640, display: "flex", gap: 24, alignItems: "center", opacity: cl(k7 * 2), transform: `translateX(${(1 - k7) * 40}px)` }}>
      <div style={{ width: 120, height: 120, borderRadius: 60, background: RED, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SH }}><Beb txt="7" size={100} color={CREAM} /></div>
      <Beb txt="YEARS OLD" size={92} color={CREAM} sh />
    </div>
    <div style={{ position: "absolute", left: 1240, top: 800, opacity: cl(ks * 2) }}><Hand txt="Saturday morning…" u={cl((f - at(tSat)) / 20)} size={70} color={CREAM} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.6)" }} /></div>
  </>);
};

// 6 · cita del padre: polaco a mano sobre papel + traducción en rótulo
export const PolishQuote: P<{ t1: number; t2: number } & A0> = ({ a, d, t1, t2, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), q1 = cl((f - at(t1)) / 28), q2 = sp(f, at(t2), 12, 140);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <Card x={260} y={140} w={1400} h={800} rot={-1.5} u={u} tex="paper">
      <div style={{ position: "absolute", left: 70, top: 20, fontFamily: BEB, fontSize: 300, color: RED, opacity: 0.25 }}>“</div>
      <div style={{ position: "absolute", left: 140, top: 150 }}>
        <Hand txt="Kiełbasa się nie smaży, Stasiu." u={q1} size={92} color={OX} />
        <Hand txt="Kiełbasa bierze kąpiel." u={cl((f - at(t2)) / 24)} size={92} color={OX} style={{ marginTop: 10 }} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 460, width: 1120, height: 6, background: `linear-gradient(90deg, ${RED}, transparent)`, transform: `scaleX(${q2})`, transformOrigin: "0 50%" }} />
      <div style={{ position: "absolute", left: 140, top: 500, opacity: cl(q2 * 2), transform: `translateY(${(1 - q2) * 30}px)` }}>
        <Beb txt="THE KIELBASA DOESN'T FRY." size={100} color={INK} />
        <Beb txt="THE KIELBASA TAKES A BATH." size={100} color={RED} />
      </div>
      <div style={{ position: "absolute", right: 70, bottom: 40 }}><Hand txt="— my father" u={cl((f - at(t2) - 14) / 20)} size={58} color="#6B5E50" /></div>
    </Card>
  </>);
};

// 7 · capítulo: azulejo esmaltado rojo con el número, pegado a la pared de azulejo blanco; banda de kraft con el truco
export const Chapter: P<{ n: number; title: string; sub: string; tw: number } & A0> = ({ a, d, n, title, sub, tw, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 12, 120), s = sp(f, at(tw) + 8, 14, 140), g = cl((f - at(tw) - 18) / 22);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 200, top: 190, transform: `perspective(1400px) rotateY(${(1 - u) * 70}deg) scale(${0.8 + 0.2 * u})`, transformOrigin: "0 50%", opacity: cl(u * 2) }}>
      <Plaque w={560} h={700}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Beb txt="TRICK" size={90} color="#F6CFC4" style={{ letterSpacing: 18 }} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}><Beb txt={String(n)} size={480} color={CREAM} sh /></div>
      </Plaque>
    </div>
    <div style={{ position: "absolute", left: 820, top: 330, width: 960, padding: "40px 50px", background: TX.kraft, boxShadow: SH, borderRadius: 6, transform: `rotate(-1.5deg) translateX(${(1 - s) * 500}px)`, opacity: cl(s * 2),
      clipPath: "polygon(0 4%, 3% 0, 97% 2%, 100% 0, 99% 96%, 96% 100%, 3% 98%, 0 100%)" }}>
      <div style={{ fontFamily: BEB, fontSize: title.length > 16 ? 112 : 150, lineHeight: 0.95, color: INK, letterSpacing: 2 }}>{title}</div>
    </div>
    <div style={{ position: "absolute", left: 860, top: 690 }}><Hand txt={sub} u={g} size={76} color={OX} /></div>
  </>);
};

// 8 · dorso del paquete: lista corta ✓ (pork, salt…) y palabras malas ✗ (water added, corn syrup)
export const LabelRead: P<{ good: It[]; bad: It[] } & A0> = ({ a, d, good, bad, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  return shell(<Bg k="block" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 240, top: 90, width: 1440, height: 900, borderRadius: 40, background: "linear-gradient(160deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.25))", boxShadow: SH, transform: `perspective(1800px) rotateY(${(1 - u) * 180}deg)`, opacity: cl(u * 3) }}>
      <div style={{ position: "absolute", inset: 30, borderRadius: 26, background: "linear-gradient(180deg, #F8F4EA, #E9E1CE)", boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.08)" }}>
        <div style={{ position: "absolute", left: 60, top: 40 }}><Beb txt="INGREDIENTS" size={96} color={INK} /></div>
        <div style={{ position: "absolute", left: 60, top: 150, width: 1240, height: 4, background: INK }} />
        <div style={{ position: "absolute", left: 60, top: 190 }}><Rows rows={good} f={f} at={at} size={84} gap={12} /></div>
        <div style={{ position: "absolute", left: 800, top: 190, display: "flex", flexDirection: "column", gap: 30 }}>
          {bad.map((b, i) => { const k = sp(f, at(b.t), 12, 160); return (
            <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, opacity: cl(k * 2), transform: `scale(${0.85 + 0.15 * k})`, background: "rgba(195,49,42,0.08)", padding: "10px 24px", borderRadius: 10 }}>
              <Tick u={cl((f - at(b.t) - 6) / 12)} no size={70} />
              <div style={{ position: "relative" }}><Beb txt={b.txt} size={88} color={OX} /><Strike u={cl((f - at(b.t) - 8) / 12)} w={b.txt.length * 38} /></div>
            </div>); })}
          {bad.length ? <div style={{ marginTop: 20, opacity: cl((f - at(bad[bad.length - 1].t) - 20) / 12) }}><Hand txt="→ put it back" u={cl((f - at(bad[bad.length - 1].t) - 20) / 20)} size={74} color={RED} /></div> : null}
        </div>
        <div style={{ position: "absolute", left: 60, bottom: 50 }}><Hand txt="short list = real kielbasa" u={cl((f - at(good[good.length - 1].t) - 10) / 24)} size={64} color={OK} /></div>
      </div>
    </div>
  </>);
};

// 9 · corte: firme (trozos de carne y grasa) vs blanda (pasta lisa)
export const FirmSoft: P<{ tL: number; tR: number; tP: number } & A0> = ({ a, d, tL, tR, tP, a0 }) => {
  const { f, at } = useT(a);
  const l = sp(f, at(Math.min(tL, start(a, a0) + 0.2)), 13, 140), r = sp(f, at(tR), 13, 140), p = sp(f, at(tP), 12, 160);
  const disc = (x: number, coarse: boolean, k: number) => (
    <div style={{ position: "absolute", left: x, top: 230, width: 520, height: 520, borderRadius: "50%", boxShadow: SH + ", inset 0 0 0 22px " + (coarse ? SAUS2 : "#C98A7E"), transform: `scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * -40}deg)`, opacity: cl(k * 2),
      background: coarse ? "radial-gradient(circle at 30% 30%, #F4E6D8 0 5%, transparent 6%), radial-gradient(circle at 62% 40%, #F4E6D8 0 4%, transparent 5%), radial-gradient(circle at 45% 70%, #F1E2D2 0 6%, transparent 7%), radial-gradient(circle at 72% 68%, #F4E6D8 0 3%, transparent 4%), radial-gradient(circle at 25% 60%, #A84C3A 0 7%, transparent 8%), radial-gradient(circle at 55% 22%, #9E4232 0 6%, transparent 7%), radial-gradient(circle at 80% 45%, #A84C3A 0 5%, transparent 6%), radial-gradient(circle at 40% 45%, #B65A44 0 8%, transparent 9%), #C46E58"
        : "radial-gradient(circle at 40% 35%, #F6C2B6, #E9A79A 70%)" }} />);
  return shell(<Bg k="block" f={f} d={d} />, <>
    {disc(300, true, l)}{disc(1100, false, r)}
    <div style={{ position: "absolute", left: 360, top: 90 }}><Beb txt="GOOD · FIRM" size={110} color={CREAM} u={l} sh /></div>
    <div style={{ position: "absolute", left: 1150, top: 90 }}><Beb txt="CHEAP · SOFT" size={110} color={CREAM} u={r} sh /></div>
    <div style={{ position: "absolute", left: 340, top: 800 }}><Hand txt="pieces of meat & fat" u={cl((f - at(tL) - 10) / 24)} size={68} color={CREAM} style={{ textShadow: "0 3px 10px rgba(0,0,0,0.7)" }} /></div>
    <div style={{ position: "absolute", left: 1180, top: 800, background: RED, padding: "6px 30px", borderRadius: 8, transform: `rotate(-4deg) scale(${p})`, opacity: cl(p * 2), boxShadow: SH }}><Beb txt="= PASTE" size={110} color={CREAM} /></div>
  </>);
};

// 10 · ahumada (ya cocida, sólo calentar) vs fresca blanca biała (cruda) en papel de carnicería
export const SmokedFresh: P<{ tL: number; tR: number; tB: number } & A0> = ({ a, d, tL, tR, tB, a0 }) => {
  const { f, at } = useT(a);
  const l = sp(f, at(Math.min(tL, start(a, a0) + 0.2)), 13, 140), r = sp(f, at(tR), 13, 140), b = sp(f, at(tB), 12, 150);
  const col = (x: number, pale: boolean, k: number, name: string, note: string, tag: string, c: string) => (
    <div style={{ position: "absolute", left: x, top: 150, width: 720, opacity: cl(k * 2), transform: `translateY(${(1 - k) * 80}px)` }}>
      <Beb txt={name} size={120} color={INK} />
      <Saus w={640} h={140} pale={pale} style={{ marginTop: 40, transform: "rotate(-4deg)" }} />
      <div style={{ marginTop: 60, display: "inline-block", background: c, padding: "8px 30px", borderRadius: 8, boxShadow: SH }}><Beb txt={tag} size={84} color={CREAM} /></div>
      <div style={{ marginTop: 26 }}><Hand txt={note} u={cl((f - at(pale ? tR : tL) - 12) / 22)} size={64} /></div>
    </div>);
  return shell(<Bg k="paper" f={f} d={d} />, <>
    {col(180, false, l, "SMOKED", "just needs to get hot", "ALREADY COOKED", OK)}
    {col(1020, true, r, "FRESH · BIAŁA", "cook all the way through", "RAW", RED)}
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", opacity: cl(b * 2) }}><Beb txt="SAME TRICK · MORE TIME FOR THE WHITE ONE" size={70} color={OX} u={b} /></div>
  </>);
};

// 11 · tenedor = puertas: la kielbasa con agujeros que pierden jugo hacia la sartén
export const ForkDoors: P<{ tH: number; tJ: number; tB: number } & A0> = ({ a, d, tH, tJ, tB, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 120), h = cl((f - at(tH)) / 20), j = cl((f - at(tJ)) / 30), b = sp(f, at(tB), 12, 160);
  return shell(<Bg k="stove" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 260, top: 300, transform: `scale(${0.85 + 0.15 * u})`, opacity: cl(u * 2) }}>
      <Saus w={1400} h={260} />
      {[0, 1, 2, 3, 4].map((i) => { const on = cl(h * 5 - i); return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: 220 + i * 230, top: 80, width: 70, height: 100, borderRadius: 8, background: "linear-gradient(180deg, #2A0F06, #5A2412)", transform: `perspective(400px) rotateY(${-60 * on}deg)`, transformOrigin: "0 50%", boxShadow: "inset 0 0 0 4px rgba(255,220,180,0.3)", opacity: on }} />
        {[0, 1, 2].map((q) => { const y = ((f * 2.2 + q * 23 + i * 9) % 70) / 70; return <div key={q} style={{ position: "absolute", left: 245 + i * 230, top: 200 + y * 360, width: 20, height: 28, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "linear-gradient(180deg, #FFD27A, #D98A2B)", opacity: j * (1 - y) }} />; })}
      </React.Fragment>; })}
    </div>
    <div style={{ position: "absolute", left: 260, top: 110 }}><Beb txt="EVERY HOLE = A DOOR" size={130} color={CREAM} u={cl(h * 2)} sh /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", transform: `scale(${0.8 + 0.2 * b})`, opacity: cl(b * 2) }}><Beb txt="YOU'RE BLEEDING IT DRY" size={120} color="#FF6A55" sh /></div>
  </>);
};

// 12 · manómetro de vapor: muy caliente → vapor → ¡POP! ; regla final: tenedor al cajón, tenazas en la mano
export const SteamPop: P<{ tHot: number; tSt: number; tPop: number; tFix: number } & A0> = ({ a, d, tHot, tSt, tPop, tFix, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 120), n = ez(cl((f - at(tHot)) / ((at(tPop) - at(tHot)) || 30))), pop = sp(f, at(tPop), 8, 220), fx = sp(f, at(tFix), 13, 150);
  const ang = -120 + 240 * n;
  return shell(<Bg k="steel" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 260, top: 160, width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFFFFF, #E7E3DA 70%)", boxShadow: SH + ", inset 0 0 0 26px #9EA4A9, inset 0 0 0 30px #5E6368", transform: `scale(${0.8 + 0.2 * u})`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", inset: 70, borderRadius: "50%", background: `conic-gradient(from 240deg, ${OK} 0 25%, #E3B23C 25% 45%, ${RED} 45% 66.6%, transparent 66.6%)`, WebkitMask: "radial-gradient(circle, transparent 62%, #000 63%)", mask: "radial-gradient(circle, transparent 62%, #000 63%)" } as React.CSSProperties} />
      <div style={{ position: "absolute", left: 335, top: 120, width: 10, height: 230, borderRadius: 5, background: INK, transformOrigin: "50% 100%", transform: `rotate(${ang + (pop > 0.1 ? Math.sin(f) * 3 : 0)}deg)` }} />
      <div style={{ position: "absolute", left: 310, top: 310, width: 60, height: 60, borderRadius: 30, background: "radial-gradient(circle at 35% 35%, #fff, #777)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center" }}><Beb txt="STEAM" size={70} color={INK} /></div>
    </div>
    <div style={{ position: "absolute", left: 1040, top: 200, display: "flex", flexDirection: "column", gap: 16 }}>
      <Beb txt="TOO HOT, TOO FAST" size={96} color={INK} u={sp(f, at(tHot), 13, 150)} />
      <Beb txt="JUICE → STEAM" size={96} color={INK} u={sp(f, at(tSt), 13, 150)} />
      <div style={{ transform: `scale(${0.5 + 0.7 * pop - 0.2 * cl(pop - 1)}) rotate(-6deg)`, opacity: cl(pop * 3), transformOrigin: "0 50%" }}><Beb txt="POP!" size={230} color={RED} sh /></div>
    </div>
    <div style={{ position: "absolute", left: 1000, top: 800, background: TX.kraft, padding: "18px 34px", boxShadow: SH, borderRadius: 6, transform: `rotate(2deg) translateY(${(1 - fx) * 200}px)`, opacity: cl(fx * 2) }}>
      <Hand txt="fork in the drawer · tongs in your hand" u={cl((f - at(tFix)) / 24)} size={56} />
    </div>
  </>);
};

// 13 · olla en corte: arranque FRÍO (calienta parejo, flechas desde todos lados) vs CALIENTE (afuera cocido, medio crudo)
export const ColdStart: P<{ tC: number; tH: number } & A0> = ({ a, d, tC, tH, a0 }) => {
  const { f, at } = useT(a);
  const c = sp(f, at(Math.min(tC, start(a, a0) + 0.2)), 13, 140), h = sp(f, at(tH), 13, 140), wc = cl((f - at(tC)) / 60), wh = cl((f - at(tH)) / 30);
  const cut = (x: number, even: boolean, w: number, k: number) => (
    <div style={{ position: "absolute", left: x, top: 330, opacity: cl(k * 2), transform: `translateY(${(1 - k) * 80}px)` }}>
      <Pot x={0} y={0} w={640} h={420} lv={0.72} water={even ? `linear-gradient(180deg, rgba(${120 + 80 * w},${180 - 40 * w},${230 - 120 * w},0.75), rgba(40,100,170,0.85))` : "linear-gradient(180deg, rgba(230,110,60,0.8), rgba(180,60,30,0.9))"}>
        <div style={{ position: "absolute", left: 130, top: 200, width: 340, height: 120, borderRadius: 60, boxShadow: "0 0 0 10px " + (even ? `rgba(${140 + 60 * w},60,40,1)` : "#5A2412"),
          background: even ? `radial-gradient(ellipse, rgba(${200 + 30 * w},${110 + 20 * w},90,1), rgba(${170 + 40 * w},80,60,1))` : `radial-gradient(ellipse, #F3C6B8 0 35%, #B8573A 60%, #6E2A16)` }} />
      </Pot>
    </div>);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    {cut(220, true, wc, c)}{cut(1080, false, wh, h)}
    <div style={{ position: "absolute", left: 300, top: 120 }}><Beb txt="START COLD" size={130} color={BLUE} u={c} /></div>
    <div style={{ position: "absolute", left: 1170, top: 120 }}><Beb txt="START HOT" size={130} color={RED} u={h} /></div>
    <div style={{ position: "absolute", left: 250, top: 830 }}><Hand txt="inside + outside, together" u={cl((f - at(tC) - 20) / 24)} size={62} color={OK} /></div>
    <div style={{ position: "absolute", left: 1110, top: 830 }}><Hand txt="outside done, middle raw" u={cl((f - at(tH) - 14) / 24)} size={62} color={RED} /></div>
  </>);
};

// 14 · termómetro: zona SHIVER 170-180°F (verde) vs BOIL 212 (roja) ; "tiembla, no baila"
export const ShiverGauge: P<{ tNo: number; tSh: number; tT: number; tBub: number } & A0> = ({ a, d, tNo, tSh, tT, tBub, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), t = ez(cl((f - at(tT)) / 30)), b = sp(f, at(tBub), 12, 160), no = sp(f, at(tNo), 10, 200);
  const temp = 115 + 60 * t + (b > 0.1 ? 30 * cl((f - at(tBub)) / 15) - 30 * cl((f - at(tBub) - 22) / 15) : 0);
  const y = (T: number) => 820 - (T - 110) / (225 - 110) * 640;
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 300, top: 120, width: 170, height: 860, borderRadius: 85, background: "linear-gradient(90deg, #E9EDF0, #FFFFFF 40%, #C9CFD3)", boxShadow: SH, transform: `translateY(${(1 - u) * 300}px)`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 62, top: 60, width: 46, height: 700, borderRadius: 23, background: "#DDE2E6", boxShadow: "inset 0 3px 8px rgba(0,0,0,0.25)" }} />
      <div style={{ position: "absolute", left: 62, top: y(temp) - 120, width: 46, height: 880 - y(temp), borderRadius: 23, background: `linear-gradient(180deg, ${temp > 195 ? RED : OK}, #8A1F1A)` }} />
      <div style={{ position: "absolute", left: 30, bottom: 30, width: 110, height: 110, borderRadius: 55, background: "radial-gradient(circle at 35% 35%, #E9645A, #8A1F1A)" }} />
      {[{ T: 212, l: "BOIL 212°F", c: RED, o: 0 }, { T: 180, l: "180°F", c: OK, o: -14 }, { T: 170, l: "170°F", c: OK, o: 14 }].map((m) => <div key={m.T} style={{ position: "absolute", left: 180, top: y(m.T) - 150 + m.o, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 60, height: 6, background: m.c }} /><Beb txt={m.l} size={60} color={m.c} />
      </div>)}
      <div style={{ position: "absolute", left: 178, top: y(180) - 120, width: 330, height: (y(170) - y(180)) + 10, background: "rgba(47,122,74,0.18)", display: "none", border: `4px solid ${OK}`, borderRadius: 8 }} />
    </div>
    <div style={{ position: "absolute", left: 960, top: 150, transform: `rotate(-3deg) scale(${0.6 + 0.4 * no})`, opacity: cl(no * 2), border: `10px solid ${RED}`, borderRadius: 14, padding: "4px 30px" }}><Beb txt="NEVER BOILS" size={140} color={RED} /></div>
    <div style={{ position: "absolute", left: 960, top: 420 }}>
      <Beb txt="SHIVER" size={190} color={OK} u={sp(f, at(tSh), 12, 160)} style={{ transform: `translateX(${Math.sin(f * 1.3) * 3}px)` }} />
      <div style={{ position: "relative", marginTop: 6 }}><Beb txt="NOT DANCE" size={140} color={INK} u={sp(f, at(tSh) + 14, 12, 160)} /><Strike u={cl((f - at(tSh) - 24) / 12)} w={420} /></div>
    </div>
    <div style={{ position: "absolute", left: 960, top: 820, opacity: cl(b * 2) }}><Hand txt="big bubble? → turn it down" u={cl((f - at(tBub)) / 22)} size={66} color={RED} /></div>
  </>);
};

// 15 · ficha de tiempos del baño (tarjeta de fichero vieja con renglones azules y margen rojo)
const IndexCard: React.FC<{ title: string; rows: It[]; f: number; at: (t: number) => number; u: number; size?: number; h?: number }> = ({ title, rows, f, at, u, size = 84, h = 780 }) => (
  <Card x={300} y={(1080 - h) / 2} w={1320} h={h} rot={-1.2} u={u}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: "repeating-linear-gradient(180deg, transparent 0 117px, rgba(62,127,193,0.35) 117px 120px)", backgroundPosition: "0 40px" }} />
    <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 4, background: "rgba(195,49,42,0.55)" }} />
    <div style={{ position: "absolute", left: 170, top: 40 }}><Beb txt={title} size={title.length > 20 ? 92 : 110} color={OX} /></div>
    <div style={{ position: "absolute", left: 170, top: 190 }}><Rows rows={rows} f={f} at={at} size={size} gap={size > 76 ? 30 : 18} /></div>
  </Card>
);
export const BathCard: P<{ rows: It[] } & A0> = ({ a, d, rows, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  return shell(<Bg k="block" f={f} d={d} />, <IndexCard title="THE BATH · HOW LONG" rows={rows} f={f} at={at} u={u} size={92} h={720} />);
};
// 16 · receta del agua del padre: 5 renglones
export const WaterRecipe: P<{ rows: It[]; title?: string } & A0> = ({ a, d, rows, title = "FATHER'S BATH WATER", a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  return shell(<Bg k="block" f={f} d={d} />, <IndexCard title={title} rows={rows} f={f} at={at} u={u} size={76} h={900} />);
};

// 17 · frasco: el agua se vuelve caldo (se tiñe de ámbar) — "no lo tires por la pileta"
export const BrothJar: P<{ tA: number; tB: number; tC: number } & A0> = ({ a, d, tA, tB, tC, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), c = ez(cl((f - at(tA)) / 50)), b = sp(f, at(tB), 12, 150), no = sp(f, at(tC), 10, 200);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 360, top: 140, width: 560, height: 800, transform: `translateY(${(1 - u) * 300}px)`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 90, top: 0, width: 380, height: 90, borderRadius: 14, background: "linear-gradient(180deg, #D7B45A, #8C6A22)", boxShadow: SH }} />
      <div style={{ position: "absolute", left: 0, top: 80, width: 560, height: 720, borderRadius: "60px 60px 80px 80px", background: "linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0.3))", boxShadow: SH + ", inset 0 0 0 6px rgba(255,255,255,0.5)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "82%", background: `linear-gradient(180deg, rgba(${170 + 50 * c},${200 - 60 * c},${230 - 170 * c},0.8), rgba(${120 + 60 * c},${140 - 60 * c},${190 - 170 * c},0.9))` }} />
        {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: "absolute", left: 80 + (i * 67) % 380, top: 200 + (i * 91) % 300, width: 26 + i * 3, height: 18, borderRadius: "50%", background: "rgba(255,220,120,0.75)", opacity: c }} />)}
        <div style={{ position: "absolute", left: 40, top: 30, width: 60, height: 620, borderRadius: 30, background: "linear-gradient(90deg, rgba(255,255,255,0.5), transparent)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1040, top: 220 }}><Beb txt="WATER" size={120} color={BLUE} u={sp(f, at(tA), 13, 150)} /></div>
    <div style={{ position: "absolute", left: 1040, top: 360 }}><Beb txt="→ SMOKY BROTH" size={140} color={OX} u={b} /></div>
    <div style={{ position: "absolute", left: 1030, top: 620, border: `10px solid ${RED}`, borderRadius: 14, padding: "4px 30px", transform: `rotate(-4deg) scale(${1.6 - 0.6 * no})`, opacity: cl(no * 3) }}><Beb txt="NOT DOWN THE SINK" size={100} color={RED} /></div>
  </>);
};

// 18 · cerveza: 1 botella + el resto agua ✓ · toda cerveza ✗ (amarga)
export const BeerRule: P<{ tOk: number; tNo: number } & A0> = ({ a, d, tOk, tNo, a0 }) => {
  const { f, at } = useT(a);
  const o = sp(f, at(Math.min(tOk, start(a, a0) + 0.2)), 13, 140), n = sp(f, at(tNo), 13, 140);
  const bottle = (x: number, k: number) => <div style={{ position: "absolute", left: x, top: 220, width: 150, height: 520, opacity: cl(k * 2), transform: `translateY(${(1 - k) * 100}px)` }}>
    <div style={{ position: "absolute", left: 50, top: 0, width: 50, height: 170, borderRadius: "14px 14px 0 0", background: "linear-gradient(90deg, #3A1D08, #7A4214 40%, #2A1405)" }} />
    <div style={{ position: "absolute", left: 0, top: 150, width: 150, height: 370, borderRadius: "50px 50px 18px 18px", background: "linear-gradient(90deg, #3A1D08, #8A4C18 35%, #5A2E0C 70%, #2A1405)", boxShadow: SH }} />
    <div style={{ position: "absolute", left: 22, top: 300, width: 106, height: 120, background: TX.paper, borderRadius: 6 }} />
  </div>;
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 160, top: 120, width: 760, height: 840, borderRadius: 30, background: "rgba(47,122,74,0.08)", border: `6px solid ${OK}` }}>
      {bottle(90, o)}
      <div style={{ position: "absolute", left: 270, top: 380 }}><Beb txt="+" size={160} color={INK} u={o} /></div>
      <Pot x={370} y={300} w={340} h={360} lv={0.8} />
      <div style={{ position: "absolute", left: 60, top: 720, display: "flex", alignItems: "center", gap: 18 }}><Tick u={cl((f - at(tOk) - 8) / 14)} /><Beb txt="1 BOTTLE + WATER" size={86} color={OK} u={o} /></div>
    </div>
    <div style={{ position: "absolute", left: 1000, top: 120, width: 760, height: 840, borderRadius: 30, background: "rgba(195,49,42,0.06)", border: `6px solid ${RED}`, opacity: cl(n * 2) }}>
      {[0, 1, 2, 3].map((i) => <React.Fragment key={i}>{bottle(60 + i * 160, n)}</React.Fragment>)}
      <div style={{ position: "absolute", left: 60, top: 720, display: "flex", alignItems: "center", gap: 18 }}><Tick u={cl((f - at(tNo) - 8) / 14)} no /><Beb txt="ALL BEER = BITTER" size={86} color={RED} u={n} /></div>
    </div>
  </>);
};

// 19 · mojada = vapor (pálida) | seca = dora — split con vapor animado
export const WetDry: P<{ tW: number; tD: number } & A0> = ({ a, d, tW, tD, a0 }) => {
  const { f, at } = useT(a);
  const w = sp(f, at(Math.min(tW, start(a, a0) + 0.2)), 13, 140), dr = sp(f, at(tD), 13, 140), br = ez(cl((f - at(tD)) / 40));
  return shell(<Bg k="stove" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, background: "linear-gradient(180deg, rgba(62,127,193,0.18), transparent)" }} />
    <div style={{ position: "absolute", left: 958, top: 80, width: 4, height: 920, background: "rgba(255,255,255,0.3)" }} />
    <div style={{ opacity: cl(w * 2) }}><Pan x={120} y={260} r={330}>
      <Saus w={440} h={120} pale style={{ position: "absolute", left: 110, top: 270, transform: "rotate(-10deg)" }} />
      {[0, 1, 2, 3, 4].map((i) => { const y = ((f * 1.5 + i * 25) % 90) / 90; return <div key={i} style={{ position: "absolute", left: 150 + i * 80, top: 250 - y * 300, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.45), transparent 70%)", opacity: 1 - y }} />; })}
    </Pan></div>
    <div style={{ opacity: cl(dr * 2) }}><Pan x={1040} y={260} r={330} hot={1}>
      <div style={{ position: "absolute", left: 110, top: 270, transform: "rotate(-10deg)" }}><Saus w={440} h={120} /><div style={{ position: "absolute", inset: 0, borderRadius: 60, background: "linear-gradient(180deg, #D27B33, #7A3510)", opacity: 1 - br * 0 }} /><div style={{ position: "absolute", left: "10%", right: "15%", top: 16, height: 18, borderRadius: 10, background: "rgba(255,230,180,0.55)" }} /></div>
    </Pan></div>
    <div style={{ position: "absolute", left: 170, top: 90 }}><Beb txt="WET → STEAMS" size={120} color="#9CC8F0" u={w} sh /></div>
    <div style={{ position: "absolute", left: 1100, top: 90 }}><Beb txt="DRY → BROWNS" size={120} color="#F2B25A" u={dr} sh /></div>
  </>);
};

// 20 · dos trabajos: OLLA = cocinar · SARTÉN = color y chasquido
export const TwoJobs: P<{ tA: number; tB: number } & A0> = ({ a, d, tA, tB, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(Math.min(tA, start(a, a0) + 0.2)), 13, 140), b = sp(f, at(tB), 12, 150);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ opacity: cl(u * 2), transform: `translateY(${(1 - u) * 100}px)` }}>
      <Pot x={260} y={330} w={520} h={380} lv={0.7}><div style={{ position: "absolute", left: 90, top: 180, width: 300, height: 100, borderRadius: 50, background: `linear-gradient(180deg, #B5572E, ${SAUS2})` }} /></Pot>
      <div style={{ position: "absolute", left: 1040, top: 260, transform: "scale(0.8)", transformOrigin: "0 0" }}><Pan x={0} y={0} r={300} hot={1} /></div>
      <div style={{ position: "absolute", left: 300, top: 160 }}><Beb txt="JOB 1 · THE POT" size={96} color={BLUE} /></div>
      <div style={{ position: "absolute", left: 1040, top: 160 }}><Beb txt="JOB 2 · THE PAN" size={96} color={RED} /></div>
      <div style={{ position: "absolute", left: 330, top: 780 }}><Hand txt="cooks it through" u={cl((f - at(tA) - 8) / 20)} size={72} /></div>
      <div style={{ position: "absolute", left: 1080, top: 780 }}><Hand txt="color + snap only" u={cl((f - at(tA) - 18) / 20)} size={72} /></div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", opacity: cl(b * 2) }}><Beb txt="NEVER ASK THE PAN TO DO BOTH" size={84} color={OX} u={b} /></div>
  </>);
};

// 21 · cronómetro de sartén: 2 min lado plano + 1 min piel = 3 min (anillo que se llena)
export const PanTimer: P<{ t2: number; t1: number; t3: number } & A0> = ({ a, d, t2, t1, t3, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 120), p1 = ez(cl((f - at(t2)) / 30)), p2 = ez(cl((f - at(t1)) / 20)), tt = sp(f, at(t3), 10, 180);
  const deg = 240 * p1 + 120 * p2;
  return shell(<Bg k="stove" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 220, top: 160, width: 720, height: 720, borderRadius: "50%", background: `conic-gradient(${RED} 0 ${240 * p1}deg, #E3B23C ${240 * p1}deg ${deg}deg, #3A3633 ${deg}deg 360deg)`, boxShadow: SH, transform: `scale(${0.8 + 0.2 * u})`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", inset: 60, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FBF8F1, #DAD5CA)", boxShadow: "inset 0 6px 14px rgba(0,0,0,0.25)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center" }}><Beb txt={`${Math.min(3, Math.floor(2 * p1 + p2 + 0.0001))}:00`} size={220} color={INK} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center" }}><Beb txt="MINUTES" size={60} color="#6B6257" /></div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1060, top: 200, display: "flex", flexDirection: "column", gap: 40 }}>
      <div style={{ display: "flex", gap: 20, alignItems: "center", opacity: cl(p1 * 4) }}><div style={{ width: 50, height: 50, borderRadius: 10, background: RED }} /><Beb txt="2 MIN · FLAT SIDE DOWN" size={80} color={CREAM} /></div>
      <div style={{ display: "flex", gap: 20, alignItems: "center", opacity: cl(p2 * 4) }}><div style={{ width: 50, height: 50, borderRadius: 10, background: "#E3B23C" }} /><Beb txt="1 MIN · ON THE SKIN" size={80} color={CREAM} /></div>
      <div style={{ transform: `scale(${0.6 + 0.4 * tt})`, transformOrigin: "0 50%", opacity: cl(tt * 2), marginTop: 30 }}><Beb txt="3 MIN TOTAL" size={170} color="#F2B25A" sh /></div>
      <Hand txt="don't touch them" u={cl((f - at(t2) - 10) / 20)} size={64} color={CREAM} />
    </div>
  </>);
};

// 22 · pasos de la cebolla (la parte de mamá) en pizarra de tiza
export const OnionSteps: P<{ rows: It[] } & A0> = ({ a, d, rows, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 300, top: 130, width: 1320, height: 820, borderRadius: 14, background: TX.chalk, boxShadow: SH + ", inset 0 0 0 22px #6B4524, inset 0 0 0 26px #3C2512", transform: `perspective(1800px) rotateX(${(1 - u) * 30}deg)`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 90, top: 60 }}><Beb txt="MOTHER'S PART" size={120} color="#F4F0E6" /></div>
      <div style={{ position: "absolute", left: 90, top: 210 }}><Rows rows={rows} f={f} at={at} size={96} gap={44} color="#F4F0E6" /></div>
      <div style={{ position: "absolute", right: 90, bottom: 60 }}><Hand txt="sauce in one minute" u={cl((f - at(rows[0].t) - 20) / 24)} size={66} color="#FFD25A" /></div>
    </div>
  </>);
};

// 23 · monedas vs óvalos: corte recto vs en diagonal; la superficie dorada crece
export const SlantCut: P<{ tS: number; tO: number; tM: number } & A0> = ({ a, d, tS, tO, tM, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 13, 130), s = cl((f - at(tS)) / 20), o = sp(f, at(tO), 12, 150), m = sp(f, at(tM), 12, 150);
  return shell(<Bg k="block" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 200, top: 180, opacity: cl(u * 2) }}>
      <Beb txt="STRAIGHT DOWN" size={80} color={CREAM} sh />
      <div style={{ display: "flex", gap: 26, marginTop: 30 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle, #D9876C, #B5573E 60%)", boxShadow: "0 0 0 10px " + SAUS2 + ", " + SH }} />)}</div>
      <div style={{ marginTop: 30 }}><Hand txt="little coins" u={u} size={64} color={CREAM} /></div>
    </div>
    <div style={{ position: "absolute", left: 1000, top: 180, opacity: cl(s * 2) }}>
      <Beb txt="ON A SLANT" size={80} color="#F2B25A" sh />
      <div style={{ display: "flex", gap: 26, marginTop: 30 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 230, height: 130, borderRadius: "50%", background: "radial-gradient(ellipse, #D9876C, #B5573E 60%)", boxShadow: `0 0 0 ${10 + 8 * m}px #8C4A1C, ${SH}`, transform: `scale(${0.6 + 0.4 * o}) rotate(-8deg)`, opacity: cl(o * 2) }} />)}</div>
      <div style={{ marginTop: 30 }}><Hand txt="long ovals" u={cl((f - at(tO)) / 18)} size={64} color={CREAM} /></div>
    </div>
    {/* el cuchillo en ángulo */}
    <div style={{ position: "absolute", left: 1180, top: 560, width: 520, height: 70, transform: `rotate(-35deg) translateX(${(1 - s) * 300}px)`, opacity: cl(s * 2) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 360, height: 70, borderRadius: "0 40px 40px 0", background: TX.steel, boxShadow: SH }} />
      <div style={{ position: "absolute", left: 360, top: 10, width: 170, height: 50, borderRadius: 12, background: "linear-gradient(180deg, #3A2414, #1A0E06)" }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", opacity: cl(m * 2) }}><Beb txt="MORE SURFACE = MORE CRUST" size={110} color="#F2B25A" u={m} sh /></div>
  </>);
};

// 24 · pizarra de problemas (2 tramos: done = renglones ya escritos)
export const FixBoard: P<{ rows: { t: number; a: string; b: string }[]; done?: [string, string][] } & A0> = ({ a, d, rows, done = [], a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 120), all = done.length;
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 200, top: 80, width: 1520, height: 920, borderRadius: 14, background: TX.chalk, boxShadow: SH + ", inset 0 0 0 22px #6B4524, inset 0 0 0 26px #3C2512", opacity: all ? 1 : cl(u * 2), transform: all ? undefined : `scale(${0.9 + 0.1 * u})` }}>
      <div style={{ position: "absolute", left: 80, top: 50 }}><Beb txt="IF IT WENT WRONG…" size={100} color="#F4F0E6" /></div>
      <div style={{ position: "absolute", left: 80, top: 190, display: "flex", flexDirection: "column", gap: 26 }}>
        {[...done.map(([x, y]) => ({ t: -1e9, a: x, b: y })), ...rows].map((r, i) => { const k = r.t < 0 ? 1 : sp(f, at(r.t), 13, 150); return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, opacity: r.t < 0 ? 0.55 : cl(k * 2), transform: `translateX(${(1 - k) * 60}px)` }}>
            <div style={{ width: 300, background: "rgba(255,90,70,0.15)", border: "4px solid #FF6A55", borderRadius: 10, textAlign: "center", padding: "2px 0" }}><Beb txt={r.a} size={74} color="#FF8A75" /></div>
            <Hand txt={r.b} u={r.t < 0 ? 1 : cl((f - at(r.t) - 6) / 22)} size={70} color="#F4F0E6" />
          </div>); })}
      </div>
    </div>
  </>);
};

// 25 · balanza de plata: $19 (un plato) vs anillo $8-9/lb → 3 personas → $2-3 el plato
export const MoneyScale: P<{ t19: number; tRing: number; t3: number; tP: number } & A0> = ({ a, d, t19, tRing, t3, tP, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110), r = sp(f, at(tRing), 13, 150), t = sp(f, at(t3), 13, 150), p = sp(f, at(tP), 12, 160);
  const tilt = -10 * p;
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 940, top: 300, width: 40, height: 600, background: "linear-gradient(90deg, #8C6A22, #E3C27A, #8C6A22)", boxShadow: SH, opacity: cl(u * 2) }} />
    <div style={{ position: "absolute", left: 760, top: 880, width: 400, height: 60, borderRadius: 14, background: "linear-gradient(180deg, #E3C27A, #8C6A22)", boxShadow: SH, opacity: cl(u * 2) }} />
    <div style={{ position: "absolute", left: 360, top: 280, width: 1200, height: 24, borderRadius: 12, background: "linear-gradient(180deg, #E3C27A, #8C6A22)", transform: `rotate(${tilt}deg)`, transformOrigin: "50% 50%", opacity: cl(u * 2) }}>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: i ? 980 : -80, top: 20, width: 300, transform: `rotate(${-tilt}deg)`, transformOrigin: "50% 0" }}>
        <div style={{ position: "absolute", left: 146, top: 0, width: 8, height: 160, background: "#8C6A22" }} />
        <div style={{ position: "absolute", left: 0, top: 160, width: 300, height: 50, borderRadius: "0 0 150px 150px", background: "linear-gradient(180deg, #E3C27A, #8C6A22)", boxShadow: SH }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 225, textAlign: "center" }}>{i === 0 ? <Beb txt="$19" size={130} color={RED} u={sp(f, at(t19), 12, 150)} sh /> : <Beb txt={p > 0.05 ? "$3" : "$8-9 / LB"} size={p > 0.05 ? 130 : 80} color={OK} u={r} sh />}</div>
      </div>)}
    </div>
    <div style={{ position: "absolute", left: 230, top: 640 }}><Hand txt="one plate, beer garden" u={cl((f - at(t19) - 10) / 20)} size={60} color={OX} /></div>
    <div style={{ position: "absolute", left: 1250, top: 600, display: "flex", gap: 14, opacity: cl(t * 2) }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 90, height: 90, borderRadius: 45, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #DAD5CA)", boxShadow: SH, transform: `scale(${cl(t * 3 - i)})` }} />)}</div>
    <div style={{ position: "absolute", left: 1230, top: 720 }}><Hand txt="1 lb feeds 3" u={cl((f - at(t3)) / 20)} size={66} color={OK} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", opacity: cl(p * 2) }}><Beb txt="$19 AGAINST $3" size={130} color={INK} u={p} /></div>
  </>);
};

// 26 · un anillo = dos cenas (sábado plato · domingo sopa)
export const TwoDinners: P<{ t1: number; t2: number } & A0> = ({ a, d, t1, t2, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(Math.min(t1, start(a, a0) + 0.2)), 13, 140), v = sp(f, at(t2), 12, 160);
  return shell(<Bg k="kraft" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 160, top: 300, width: 520, height: 520, borderRadius: "50%", border: `90px solid ${SAUS}`, boxShadow: SH + ", inset 0 0 0 4px rgba(0,0,0,0.3)", transform: `scale(${0.7 + 0.3 * u}) rotate(${(1 - u) * -90}deg)`, opacity: cl(u * 2), clipPath: "polygon(0 0, 100% 0, 100% 100%, 60% 100%, 50% 60%, 40% 100%, 0 100%)" }} />
    <div style={{ position: "absolute", left: 210, top: 140 }}><Beb txt="1 RING" size={120} color={INK} u={u} /></div>
    <div style={{ position: "absolute", left: 760, top: 470 }}><Beb txt="=" size={200} color={INK} u={v} /></div>
    {[["SATURDAY", "the plate"], ["SUNDAY", "rye soup"]].map(([dd, w], i) => { const k = cl(v * 2 - i * 0.6); return (
      <div key={i} style={{ position: "absolute", left: 960 + i * 440, top: 300, width: 400, height: 520, borderRadius: 12, background: TX.paper, boxShadow: SH, transform: `rotate(${i ? 3 : -3}deg) translateY(${(1 - k) * 200}px)`, opacity: cl(k * 2) }}>
        <div style={{ height: 110, background: RED, borderRadius: "12px 12px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}><Beb txt={dd} size={80} color={CREAM} /></div>
        <div style={{ position: "absolute", left: 90, top: 170, width: 220, height: 220, borderRadius: "50%", background: i ? "radial-gradient(circle, #EFE4C8 0 40%, #E2D3AE 60%, #FFFFFF 62%, #DAD5CA)" : "radial-gradient(circle, #B5573E 0 25%, #E7B85F 30% 50%, #FFFFFF 52%, #DAD5CA)", boxShadow: SH }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center" }}><Hand txt={w} u={k} size={64} /></div>
      </div>); })}
  </>);
};

// 27 · rollo de ticket con los 8 trucos (se imprime renglón por renglón en su palabra)
export const RecapRoll: P<{ items: It[] } & A0> = ({ a, d, items, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  const shown = items.filter((it) => f >= at(it.t)).length, last = items[Math.max(0, shown - 1)];
  const pr = shown ? cl((f - at(last.t)) / 12) : 0;
  const H_ROW = 96, h = 160 + (shown - 1 + pr) * H_ROW;
  return shell(<Bg k="block" f={f} d={d} />, <>
    <div style={{ position: "absolute", left: 560, top: 40, width: 800, height: 90, borderRadius: 20, background: "linear-gradient(180deg, #F6F3EC, #CFC9BE)", boxShadow: SH, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 60, top: 55, width: 680, height: 14, borderRadius: 7, background: "#2B2A27" }} />
    </div>
    <div style={{ position: "absolute", left: 610, top: 110, width: 700, height: Math.max(0, Math.min(940, h)), overflow: "hidden", background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.025) 0 2px, transparent 2px 5px), linear-gradient(180deg, #FFFEFA, #F1ECE1)", boxShadow: "0 20px 30px rgba(0,0,0,0.35)" }}>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 0, top: -Math.max(0, h - 940) }}>
        <div style={{ textAlign: "center", paddingTop: 30 }}><Beb txt="WOZNIAK MEATS · THE BATH" size={58} color={OX} /></div>
        <div style={{ borderTop: "4px dashed #B9B2A4", margin: "16px 0 10px" }} />
        {items.map((it, i) => f >= at(it.t) ? <div key={i} style={{ display: "flex", gap: 20, alignItems: "baseline", height: H_ROW }}>
          <Beb txt={`${i + 1}`} size={70} color={RED} style={{ width: 50 }} /><Hand txt={it.txt} u={cl((f - at(it.t)) / 14)} size={i === 3 ? 44 : 52} />
        </div> : null)}
      </div>
    </div>
  </>);
};

// 28 · tarea: tarjeta de kraft "TRY THE BATH. ONCE." con tres pasos
export const Homework: P<{ t1: number; t2: number; t3: number } & A0> = ({ a, d, t1, t2, t3, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  return shell(<Bg k="tile" f={f} d={d} />, <>
    <Card x={360} y={160} w={1200} h={760} rot={-2} u={u} tex="kraft">
      <div style={{ position: "absolute", left: 80, top: 50 }}><Beb txt="YOUR HOMEWORK" size={130} color={OX} /></div>
      <div style={{ position: "absolute", left: 90, top: 230 }}><Rows rows={[{ t: t1, txt: "try the bath · one time" }, { t: t2, txt: "cold water · don't let it boil" }, { t: t3, txt: "brown it · taste the difference" }]} f={f} at={at} size={80} gap={34} /></div>
      <div style={{ position: "absolute", right: 60, bottom: 40, transform: "rotate(-8deg)", border: `8px solid ${RED}`, borderRadius: 12, padding: "0 24px", opacity: cl((f - at(t3) - 16) / 8) }}><Beb txt="THIS WEEK" size={90} color={RED} /></div>
    </Card>
  </>);
};

// 29 · comentarios: tarjeta de pedido del mostrador con las tres preguntas
export const CommentCard: P<{ t1: number; t2: number; t3: number } & A0> = ({ a, d, t1, t2, t3, a0 }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(start(a, a0)), 14, 110);
  return shell(<Bg k="block" f={f} d={d} />, <>
    <Card x={360} y={150} w={1200} h={780} rot={1.5} u={u}>
      <div style={{ height: 150, background: `repeating-linear-gradient(90deg, ${RED} 0 60px, ${CREAM} 60px 120px)`, borderRadius: "8px 8px 0 0", opacity: 0.9 }} />
      <div style={{ position: "absolute", left: 80, top: 30 }}><Beb txt="TELL STAN IN THE COMMENTS" size={96} color={INK} style={{ background: CREAM, padding: "6px 24px", borderRadius: 8 }} /></div>
      <div style={{ position: "absolute", left: 90, top: 230, display: "flex", flexDirection: "column", gap: 40 }}>
        {[[t1, "Who taught you to cook kielbasa?"], [t2, "Did they poke it with a fork?"], [t3, "Where's your family from?"]].map(([t, q], i) => <div key={i} style={{ display: "flex", gap: 24, alignItems: "center", opacity: cl((f - at(t as number)) / 8) }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}><Beb txt="?" size={60} color={CREAM} /></div>
          <Hand txt={q as string} u={cl((f - at(t as number)) / 20)} size={78} />
        </div>)}
      </div>
    </Card>
  </>);
};
