// ── HÉROES de mickey5 (Mickey's Butcher Shop, video 5: el pavo de Thanksgiving que nunca sale seco). Claude, 16-oct-2026.
//    Juego PROPIO (no recicla los de mickey1-4): termómetros gemelos pecho/muslo, etiqueta de balanza naranja, botón pop-up que salta,
//    capítulo = plato de la cena con su número, álbum de recortes, lupa sobre la etiqueta, calendario de noviembre, cucharas de sal,
//    mapa de frío/calor del pavo con hielo, corte del horno, puntos del termómetro, curva del reposo, tarjeta de la salsa, pasos del
//    trinchado, notas adhesivas en la heladera, balanza de dos platos, bloc amarillo.
//    PURO CSS/SVG (cero imágenes): textura dibujada (lino, kraft, acero, arce, heladera) + luz + sombra proyectada + objeto/foto + dato + acento.
//    Tipografías: 2 familias (Alfa Slab One = rótulos y números · Kalam = mano). Paleta otoño: calabaza, arándano, salvia, crema, nogal, manteca.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Tex, Sketch } from "./sketch";
import { loadFont as loadSlab } from "@remotion/google-fonts/AlfaSlabOne";
import { loadFont as loadKalam } from "@remotion/google-fonts/Kalam";
import { useT, sp, ez, eo, cl, P } from "../lkit/core";

const SLAB = loadSlab("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const KAL = loadKalam("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const PUMP = "#D9772B", CRAN = "#8C1D2F", SAGE = "#5F7F52", CREAM = "#F7EEDD", WAL = "#3E2A1C", BUT = "#F2C14E", ICE = "#6FB7E8", INK = "#2B2118", OK = "#3E7D4F";
type B = { t: number; txt: string };

// ── capas base ───────────────────────────────────────────────────────────
const Photo: React.FC<{ k: string; w: number; h: number; x: number; y: number; u: number; rot?: number; f: number; children?: React.ReactNode }> = ({ k, w, h, x, y, u, rot = -2, f, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w + 24, opacity: cl(u * 2), transform: `translateX(${(1 - u) * -120}px) rotate(${rot * u}deg) scale(${0.92 + 0.08 * u})` }}>
    <div style={{ background: "#FFFCF5", padding: 12, borderRadius: 4, boxShadow: "0 34px 64px rgba(30,15,0,0.55), 0 6px 12px rgba(0,0,0,0.3)" }}>
      <div style={{ position: "relative", width: w, height: h, overflow: "hidden", borderRadius: 2 }}>
        <Sketch k={k} w={w} h={h} f={f} style="flat" />
        {children}
      </div>
    </div>
    {[[-10, -10, -40], [w + 4, h + 4, -40]].map(([cx, cy, r], i) => <div key={i} style={{ position: "absolute", left: cx, top: cy, width: 44, height: 44, background: "rgba(62,42,28,0.85)", clipPath: i ? "polygon(100% 0,100% 100%,0 100%)" : "polygon(0 0,100% 0,0 100%)" }} />)}
  </div>
);
const Hand: React.FC<{ txt: string; u: number; size: number; color?: string; style?: React.CSSProperties }> = ({ txt, u, size, color = INK, style }) => (
  <div style={{ fontFamily: KAL, fontWeight: 700, fontSize: size, color, whiteSpace: "nowrap", lineHeight: 1.1, paddingRight: "0.3em", clipPath: `inset(-25% ${(100 - 100 * ez(u)) * 1.06 - 6}% -25% -2%)`, ...style }}>{txt}</div>
);
const Tick: React.FC<{ u: number; no?: boolean; size?: number }> = ({ u, no, size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" style={{ overflow: "visible", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.35))" }}>
    <path d={no ? "M 10 10 L 42 42 M 42 10 L 10 42" : "M 8 28 L 21 40 L 44 12"} stroke={no ? CRAN : OK} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);
const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${-9 * Math.sin(f / 41)}px, ${6 * Math.cos(f / 47)}px) scale(${1.03 + 0.012 * Math.sin(f / 53)})` }}>{children}</AbsoluteFill>;
};
const shell = (c: React.ReactNode) => <AbsoluteFill style={{ overflow: "hidden" }}><Drift>{c}</Drift></AbsoluteFill>;
const Big: React.FC<{ txt: string; size: number; color?: string; u?: number; style?: React.CSSProperties }> = ({ txt, size, color = CREAM, u = 1, style }) => (
  <div style={{ fontFamily: SLAB, fontSize: size, color, lineHeight: 1, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 30}px) scale(${0.85 + 0.15 * u})`, textShadow: color === CREAM ? "0 8px 24px rgba(0,0,0,0.55)" : undefined, whiteSpace: "nowrap", ...style }}>{txt}</div>
);
// termómetro de vidrio vertical: el líquido sube hasta v (escala lo..hi)
const Tube: React.FC<{ x: number; y: number; h: number; v: number; lo: number; hi: number; color: string; label: string; f: number }> = ({ x, y, h, v, lo, hi, color, label, f }) => {
  const p = cl((v - lo) / (hi - lo));
  return <div style={{ position: "absolute", left: x, top: y }}>
    <div style={{ position: "relative", width: 90, height: h, borderRadius: 45, background: "rgba(255,255,255,0.9)", boxShadow: "0 24px 40px rgba(0,0,0,0.4), inset 0 0 0 6px #e7dccb" }}>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 30, height: (h - 70) * p + 10, borderRadius: 21, background: color }} />
      <div style={{ position: "absolute", left: 5, bottom: -40, width: 80, height: 80, borderRadius: 40, background: color, boxShadow: "inset 0 -6px 10px rgba(0,0,0,0.2)" }} />
    </div>
    <div style={{ position: "absolute", left: 120, top: (h - 70) * (1 - p) + 10, fontFamily: SLAB, fontSize: 72, color: CREAM, textShadow: "0 6px 18px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>{Math.round(v)}°</div>
    <div style={{ position: "absolute", left: -40, top: h + 60, width: 170, textAlign: "center", fontFamily: SLAB, fontSize: 40, color: CREAM, textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}>{label}</div>
  </div>;
};

// 1 · pecho vs muslo: dos termómetros que suben a 160 y 175; la llave marca los 20 grados de diferencia
export const TempGap: P<{ breast: number; thigh: number; gap: number; bed?: string }> = ({ a, d, breast, thigh, gap, bed = "tex_linen" }) => {
  const { f, at } = useT(a);
  const vb = 40 + 120 * ez((f - at(breast)) / 30), vt = 40 + 135 * ez((f - at(thigh)) / 34), g = cl((f - at(gap)) / 14);
  return shell(<>
    <Tex k={bed} f={f} T={d} dark={0.35} />
    <Big txt="WHITE vs DARK" size={84} u={sp(f, 0, 14, 120)} style={{ position: "absolute", left: 140, top: 90 }} />
    <Tube x={520} y={250} h={560} v={vb} lo={40} hi={190} color={ICE} label="BREAST" f={f} />
    <Tube x={1100} y={250} h={560} v={vt} lo={40} hi={190} color={PUMP} label="THIGH" f={f} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M 760 300 C 880 230 1000 230 1100 280" stroke={BUT} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(g)} />
    </svg>
    <div style={{ position: "absolute", left: 1450, top: 330, opacity: cl(g * 2) }}><Big txt="20°" size={170} color={BUT} u={sp(f, at(gap), 12, 170)} /><Hand txt="apart" u={g} size={70} color={CREAM} /></div>
  </>);
};

// 2 · etiqueta naranja de balanza de mercado (peso · $/lb · total) pegada sobre la foto; opcional sello "WASTED"
export const PriceSticker: P<{ k: string; item: string; lb: string; per: string; total: string; t1: number; t2: number; waste?: number; bed?: string }> = ({ a, d, k, item, lb, per, total, t1, t2, waste, bed = "tex_kraft" }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t1) - 4, 12, 160), w = waste != null ? sp(f, at(waste), 11, 200) : 0;
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={1000} h={640} x={120} y={190} u={sp(f, 0, 14, 120)} rot={-1.5} f={f} />
    <div style={{ position: "absolute", left: 1150, top: 300, width: 620, height: 400, background: `linear-gradient(160deg, #F59A45, ${PUMP})`, borderRadius: 18, boxShadow: "0 30px 50px rgba(0,0,0,0.45)",
      transform: `rotate(${5 - 2 * u}deg) scale(${0.6 + 0.4 * u})`, opacity: cl(u * 2), padding: "28px 36px", color: "#fff" }}>
      <div style={{ fontFamily: SLAB, fontSize: 44, letterSpacing: 2 }}>{item}</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, fontFamily: SLAB, fontSize: 36, opacity: cl((f - at(t2)) / 8) }}>
        <span>NET WT LB<br /><span style={{ fontSize: 64 }}>{lb}</span></span><span style={{ textAlign: "right" }}>$/LB<br /><span style={{ fontSize: 64 }}>{per}</span></span>
      </div>
      <div style={{ marginTop: 20, background: "#fff", color: CRAN, borderRadius: 10, padding: "6px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: SLAB, fontSize: 34 }}>TOTAL</span><span style={{ fontFamily: SLAB, fontSize: 92 }}>${total}</span>
      </div>
    </div>
    {waste != null ? <div style={{ position: "absolute", left: 300, top: 420, transform: `rotate(-10deg) scale(${1.8 - 0.8 * Math.min(1, w)})`, opacity: cl(w * 3) * 0.92, border: `9px double ${CRAN}`, color: CRAN, fontFamily: SLAB, fontSize: 96, padding: "6px 30px", background: "rgba(255,250,240,0.55)" }}>6 LB IN THE TRASH</div> : null}
  </>);
};

// 3 · el botón pop-up: dibujo grande del botón que salta en su palabra + aviso "pops ~180°F · breast done at 160°"
export const PopButton: P<{ k: string; pop: number; note: number; bed?: string }> = ({ a, d, k, pop, note, bed = "tex_linen" }) => {
  const { f, at } = useT(a);
  const p = sp(f, at(pop), 8, 260), n = cl((f - at(note)) / 16);
  return shell(<>
    <Tex k={bed} f={f} T={d} dark={0.2} />
    <Photo k={k} w={760} h={520} x={1030} y={250} u={sp(f, 0, 14, 120)} rot={2.5} f={f} />
    <svg width={700} height={800} style={{ position: "absolute", left: 220, top: 160, overflow: "visible" }}>
      <ellipse cx={330} cy={640} rx={260} ry={60} fill="rgba(0,0,0,0.25)" />
      <rect x={250} y={420 - 170 * p} width={160} height={230} rx={22} fill="#E33A2E" stroke="#9c1b14" strokeWidth={8} />
      <rect x={180} y={560} width={300} height={70} rx={20} fill="#D02B22" stroke="#9c1b14" strokeWidth={8} />
      <rect x={270} y={440 - 170 * p} width={30} height={160} rx={10} fill="rgba(255,255,255,0.35)" />
    </svg>
    <div style={{ position: "absolute", left: 200, top: 120, opacity: cl(p * 2) }}><Big txt="POP!" size={130} color={BUT} u={p} /></div>
    <div style={{ position: "absolute", left: 120, top: 860, opacity: cl(n * 3) }}>
      <Hand txt="pops at ~180° · the breast was done at 160°" u={n} size={58} color={CREAM} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.7)" }} />
    </div>
  </>);
};

// 4 · capítulo: plato de la cena visto de arriba, cubiertos, el número pintado en el centro y el truco en la servilleta
export const PlateChapter: P<{ n: number; title: string; k: string; sub?: string; t?: number; big?: boolean; bed?: string }> = ({ a, d, n, title, k, sub, t, big, bed = "tex_linen" }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 13, 130), r = (1 - u) * -90;
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 180, top: 140, width: 800, height: 800, transform: `rotate(${r}deg) scale(${0.7 + 0.3 * u})`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 400, background: "radial-gradient(circle at 45% 40%, #ffffff, #EFE7DA)", boxShadow: "0 40px 70px rgba(40,20,0,0.45)" }} />
      <div style={{ position: "absolute", inset: 70, borderRadius: 400, border: `6px solid ${SAGE}`, opacity: 0.6 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: SLAB, fontSize: 52, color: SAGE, letterSpacing: 10 }}>{n === 8 && sub ? "OLD" : "TRICK"}</div>
        <div style={{ fontFamily: SLAB, fontSize: big ? 330 : 300, color: big ? CRAN : PUMP, lineHeight: 1 }}>{n}</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 100, top: 300, width: 34, height: 520, borderRadius: 17, background: "linear-gradient(90deg,#c9ccd0,#f4f5f6,#a9adb2)", boxShadow: "0 18px 30px rgba(0,0,0,0.35)", opacity: cl(u * 2) }} />
    <div style={{ position: "absolute", left: 1010, top: 300, width: 30, height: 520, borderRadius: 15, background: "linear-gradient(90deg,#c9ccd0,#f4f5f6,#a9adb2)", boxShadow: "0 18px 30px rgba(0,0,0,0.35)", opacity: cl(u * 2) }} />
    <Photo k={k} w={640} h={400} x={1140} y={140} u={sp(f, 6, 14, 120)} rot={3} f={f} />
    <div style={{ position: "absolute", left: 1120, top: 640, width: 700, background: CREAM, padding: "26px 34px", transform: "rotate(-2deg)", boxShadow: "0 24px 40px rgba(0,0,0,0.35)", opacity: cl((f - 10) / 10) }}>
      <Hand txt={title} u={cl((f - 12) / 20)} size={title.length > 18 ? 64 : 80} color={CRAN} />
      {sub && t != null ? <Hand txt={sub} u={cl((f - at(t)) / 18)} size={46} color={WAL} /> : null}
    </div>
  </>);
};

// 5 · álbum de recortes: foto vieja con esquineros, fecha estampada y epígrafe a mano
export const Scrapbook: P<{ k: string; caption: string; date: string; t: number; bed?: string }> = ({ a, d, k, caption, date, t, bed = "tex_kraft" }) => {
  const { f, at } = useT(a);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 300, top: 70, width: 1320, height: 900, background: "#2f2a25", boxShadow: "0 40px 80px rgba(0,0,0,0.5)", borderRadius: 8 }} />
    <Photo k={k} w={1000} h={620} x={440} y={130} u={sp(f, 0, 14, 110)} rot={-2} f={f} />
    <div style={{ position: "absolute", left: 1220, top: 700, fontFamily: SLAB, fontSize: 40, color: "#FF8A2A", opacity: cl((f - at(t)) / 8), textShadow: "0 0 8px rgba(255,120,30,0.6)" }}>{date}</div>
    <div style={{ position: "absolute", left: 470, top: 850 }}><Hand txt={caption} u={cl((f - at(t) - 6) / 24)} size={62} color={CREAM} /></div>
  </>);
};

// 6 · lupa que recorre la etiqueta: cada palabra prohibida aparece subrayada; veredicto en sello
export const LabelScan: P<{ k: string; lines: string[]; ts: number[]; verdict: number; verdict_txt: string; bed?: string }> = ({ a, d, k, lines, ts, verdict, verdict_txt, bed = "tex_steel" }) => {
  const { f, at } = useT(a);
  const cur = ts.reduce((m, t, i) => (f >= at(t) ? i : m), 0), ly = 300 + cur * 150;
  const v = sp(f, at(verdict), 11, 200);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={640} h={420} x={110} y={330} u={sp(f, 0, 14, 120)} rot={-3} f={f} />
    <div style={{ position: "absolute", left: 860, top: 200, width: 920, height: 560, background: "#FFFEFA", borderRadius: 16, boxShadow: "0 30px 60px rgba(0,0,0,0.4)", padding: "40px 50px" }}>
      <div style={{ fontFamily: SLAB, fontSize: 64, color: INK }}>WHOLE TURKEY</div>
      {lines.map((l, i) => <div key={i} style={{ marginTop: 34, position: "relative", fontFamily: SLAB, fontSize: l.length > 16 ? 40 : 54, color: f >= at(ts[i]) ? CRAN : "#9b9184" }}>{l}
        <div style={{ position: "absolute", left: 0, bottom: -8, height: 8, width: `${100 * ez((f - at(ts[i])) / 12)}%`, background: CRAN, borderRadius: 4 }} /></div>)}
    </div>
    <div style={{ position: "absolute", left: 1300, top: ly - 120, width: 260, height: 260, borderRadius: 130, border: "18px solid #3a2a1c", background: "rgba(255,255,255,0.12)", boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 0 30px rgba(255,255,255,0.4)", transition: "none" }}>
      <div style={{ position: "absolute", left: 210, top: 210, width: 40, height: 170, background: "#3a2a1c", borderRadius: 14, transform: "rotate(-45deg)", transformOrigin: "20px 0" }} />
    </div>
    <div style={{ position: "absolute", left: 880, top: 820, transform: `rotate(-4deg) scale(${1.7 - 0.7 * Math.min(1, v)})`, opacity: cl(v * 3) * 0.95, border: `8px double ${CRAN}`, color: CRAN, fontFamily: SLAB, fontSize: 62, padding: "4px 26px", background: "rgba(255,250,240,0.85)" }}>{verdict_txt}</div>
  </>);
};

// 7 · guía de tamaño: 1½ lb por persona, la franja 12-14 lb resaltada, más de 18 = no, y "dos chicos"
export const SizeGuide: P<{ per: number; sweet: number; past: number; two: number; bed?: string }> = ({ a, d, per, sweet, past, two, bed = "tex_kraft" }) => {
  const { f, at } = useT(a);
  const X = (lb: number) => 220 + (lb - 8) * 100, s = cl((f - at(sweet)) / 14), p = cl((f - at(past)) / 14), w = sp(f, at(two), 12, 170);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 160, top: 110 }}><Big txt="1½ LB" size={150} color={CRAN} u={sp(f, at(per), 12, 160)} /><Hand txt="per person" u={cl((f - at(per) - 6) / 14)} size={70} /></div>
    <div style={{ position: "absolute", left: 220, top: 560, width: 1400, height: 24, background: "rgba(62,42,28,0.25)", borderRadius: 12 }} />
    <div style={{ position: "absolute", left: X(12), top: 540, width: 200 * ez(s), height: 64, background: SAGE, borderRadius: 14, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }} />
    <div style={{ position: "absolute", left: X(18), top: 540, width: 400 * ez(p), height: 64, background: CRAN, borderRadius: 14, opacity: 0.85 }} />
    {[8, 10, 12, 14, 16, 18, 20, 22].map((lb) => <div key={lb} style={{ position: "absolute", left: X(lb) - 40, top: 620, width: 80, textAlign: "center", fontFamily: SLAB, fontSize: 40, color: WAL }}>{lb}</div>)}
    <div style={{ position: "absolute", left: X(12) - 20, top: 420, opacity: cl(s * 2) }}><Hand txt="sweet spot · 12-14 lb" u={s} size={60} color={SAGE} /></div>
    <div style={{ position: "absolute", left: X(18), top: 700, opacity: cl(p * 2) }}><Hand txt="past 18 · dries out" u={p} size={60} color={CRAN} /></div>
    <div style={{ position: "absolute", left: 300, top: 820, opacity: cl(w * 2), transform: `scale(${0.8 + 0.2 * w})`, transformOrigin: "0 50%" }}><Big txt="BIG CROWD = 2 SMALL BIRDS" size={64} color={WAL} /></div>
  </>);
};

// 8 · calendario de noviembre: la regla, los 3 días y la cuenta de domingo a jueves con tachones
export const ThawCalendar: P<{ rule: number; three: number; sun: number; thu: number; bed?: string }> = ({ a, d, rule, three, sun, thu, bed = "tex_kraft" }) => {
  const { f, at } = useT(a);
  const days = ["SUN", "MON", "TUE", "WED", "THU"], u = sp(f, 0, 14, 120);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 120, top: 120, width: 1100, height: 760, background: "#FFFDF7", boxShadow: "0 36px 70px rgba(0,0,0,0.45)", transform: `translateY(${(1 - u) * 200}px) rotate(-1deg)`, opacity: cl(u * 2) }}>
      <div style={{ height: 130, background: CRAN, color: CREAM, fontFamily: SLAB, fontSize: 72, display: "flex", alignItems: "center", paddingLeft: 50 }}>NOVEMBER</div>
      <div style={{ display: "flex", padding: "40px 30px", gap: 20 }}>
        {days.map((dn, i) => { const ti = at(sun) + (at(thu) - at(sun)) * i / 4, x = cl((f - ti) / 10), last = i === 4;
          return <div key={dn} style={{ flex: 1, height: 460, border: `4px solid ${last ? PUMP : "#d9cfbf"}`, borderRadius: 10, position: "relative", background: last ? "rgba(217,119,43,0.12)" : undefined }}>
            <div style={{ fontFamily: SLAB, fontSize: 40, color: WAL, padding: 14 }}>{dn}</div>
            {i < 4 ? <svg width={190} height={300} style={{ position: "absolute", left: 10, top: 110 }}><path d="M 20 30 L 170 260 M 170 30 L 20 260" stroke={CRAN} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - x} /></svg>
              : <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", opacity: x }}><Hand txt="DINNER" u={x} size={56} color={PUMP} /></div>}
          </div>; })}
      </div>
    </div>
    <div style={{ position: "absolute", left: 1290, top: 220, width: 560 }}>
      <Big txt="1 DAY" size={110} u={sp(f, at(rule), 12, 160)} /><Hand txt="per 4-5 lb, in the fridge" u={cl((f - at(rule) - 6) / 18)} size={54} color={CREAM} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.7)" }} />
      <div style={{ marginTop: 60 }}><Big txt="14 LB = 3 DAYS" size={66} color={BUT} u={sp(f, at(three), 12, 160)} /></div>
    </div>
  </>);
};

// 9 · cucharadas de sal: 1 cucharada por 4-5 lb → tres cucharadas para el pavo de 14
export const SpoonMath: P<{ one: number; per: number; bird: number; three: number; bed?: string }> = ({ a, d, one, per, bird, three, bed = "tex_wood" }) => {
  const { f, at } = useT(a);
  const spoon = (x: number, y: number, u: number) => <div style={{ position: "absolute", left: x, top: y, opacity: cl(u * 2), transform: `translateY(${(1 - u) * -120}px) rotate(-18deg)` }}>
    <svg width={340} height={160}><ellipse cx={90} cy={80} rx={84} ry={58} fill="#cfd3d7" stroke="#8d949a" strokeWidth={6} /><ellipse cx={90} cy={74} rx={64} ry={40} fill="#FBFBF8" />
      {[...Array(14)].map((_, i) => <rect key={i} x={50 + (i * 37) % 80} y={52 + (i * 23) % 40} width={10} height={10} fill="#e9e9e4" stroke="#c9c9c2" />)}
      <rect x={170} y={70} width={170} height={20} rx={10} fill="#b4babf" /></svg></div>;
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    {spoon(160, 220, sp(f, at(one), 12, 150))}
    <div style={{ position: "absolute", left: 560, top: 240 }}><Big txt="1 TBSP" size={110} u={sp(f, at(one) + 4, 12, 160)} /><Hand txt="kosher salt · per 4-5 lb" u={cl((f - at(per)) / 18)} size={60} color={CREAM} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.7)" }} /></div>
    {[0, 1, 2].map((i) => spoon(200 + i * 360, 620, sp(f, at(three) + i * 4, 12, 170)))}
    <div style={{ position: "absolute", left: 1320, top: 640 }}><Big txt="14 LB" size={70} color={BUT} u={sp(f, at(bird), 12, 160)} /><Big txt="= 3 TBSP" size={110} u={sp(f, at(three) + 10, 12, 160)} /></div>
  </>);
};

// 10 · el truco: pavo visto de arriba (dibujo) con las patas calentándose (naranja) y el pecho bajo hielo (azul); "-10 a -15°"
export const IceMap: P<{ warm: number; cold: number; diff: number; together: number; bed?: string }> = ({ a, d, warm, cold, diff, together, bed = "tex_steel" }) => {
  const { f, at } = useT(a);
  const w = cl((f - at(warm)) / 20), c = cl((f - at(cold)) / 20), df = sp(f, at(diff), 12, 160), tg = sp(f, at(together), 12, 160);
  const pulse = 0.85 + 0.15 * Math.sin(f / 9);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <radialGradient id="wm"><stop offset="0" stopColor="#FF8A2A" stopOpacity={0.85} /><stop offset="1" stopColor="#FF8A2A" stopOpacity={0} /></radialGradient>
        <radialGradient id="cd"><stop offset="0" stopColor="#7cc6ff" stopOpacity={0.9} /><stop offset="1" stopColor="#7cc6ff" stopOpacity={0} /></radialGradient>
      </defs>
      <ellipse cx={700} cy={560} rx={330} ry={270} fill="#E9C9A0" stroke={WAL} strokeWidth={8} />
      <path d="M 430 700 C 330 760 300 880 380 920 C 460 940 500 840 520 760" fill="#E9C9A0" stroke={WAL} strokeWidth={8} />
      <path d="M 970 700 C 1070 760 1100 880 1020 920 C 940 940 900 840 880 760" fill="#E9C9A0" stroke={WAL} strokeWidth={8} />
      <circle cx={400} cy={830} r={190 * w * pulse} fill="url(#wm)" />
      <circle cx={1000} cy={830} r={190 * w * pulse} fill="url(#wm)" />
      <ellipse cx={700} cy={500} rx={260 * c} ry={200 * c} fill="url(#cd)" />
      {[0, 1].map((i) => <rect key={i} x={540 + i * 170} y={380 - (1 - c) * 300} width={150} height={190} rx={26} fill="rgba(220,240,255,0.7)" stroke="#bfe2ff" strokeWidth={6} opacity={cl(c * 2)} />)}
    </svg>
    <div style={{ position: "absolute", left: 260, top: 940, opacity: cl(w * 2) }}><Hand txt="legs warm up" u={w} size={60} color={BUT} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.7)" }} /></div>
    <div style={{ position: "absolute", left: 560, top: 150, opacity: cl(c * 2) }}><Hand txt="breast stays ice cold" u={c} size={64} color={CREAM} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.7)" }} /></div>
    <div style={{ position: "absolute", left: 1220, top: 300 }}><Big txt="−10 to 15°" size={110} color={ICE} u={df} /><Hand txt="colder at the start" u={cl((f - at(diff) - 6) / 16)} size={60} color={CREAM} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.75)" }} /></div>
    <div style={{ position: "absolute", left: 1220, top: 640, opacity: cl(tg * 2) }}><Big txt="DONE TOGETHER" size={80} color={BUT} u={tg} /></div>
  </>);
};

// 11 · corte del horno: el fondo arde, la rejilla baja, la flecha manda las patas atrás; el dial pasa de 425 a 325
export const OvenMap: P<{ legs: number; hot: number; t425: number; t325: number; bed?: string }> = ({ a, d, legs, hot, t425, t325, bed = "tex_steel" }) => {
  const { f, at } = useT(a);
  const h = cl((f - at(hot)) / 16), l = eo((f - at(legs)) / 18);
  const temp = f < at(t425) ? 0 : f < at(t325) ? 425 : Math.round(425 - 100 * ez((f - at(t325)) / 20));
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 160, top: 140, width: 1060, height: 780, borderRadius: 26, background: "#2b2622", border: "20px solid #ddd6cb", boxShadow: "0 40px 80px rgba(0,0,0,0.5)", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 420, background: `linear-gradient(270deg, rgba(255,90,30,${0.75 * h}), rgba(255,90,30,0))` }} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 520, height: 12, background: "#9aa0a6", borderRadius: 6 }} />
      <svg width={1020} height={740} style={{ position: "absolute", left: 0, top: 0 }}>
        <ellipse cx={500} cy={440} rx={250} ry={90} fill="#C98A4B" stroke="#5a3a1c" strokeWidth={6} />
        <path d={`M 690 430 C 760 400 800 420 830 450`} stroke="#5a3a1c" strokeWidth={30} strokeLinecap="round" fill="none" />
        <path d={`M 300 360 L ${300 + 520 * l} 300`} stroke={BUT} strokeWidth={12} strokeLinecap="round" fill="none" />
        <path d={`M ${300 + 520 * l - 30} 270 L ${300 + 520 * l} 300 L ${300 + 520 * l - 36} 320`} stroke={BUT} strokeWidth={12} strokeLinecap="round" fill="none" opacity={l > 0.95 ? 1 : 0} />
      </svg>
      <div style={{ position: "absolute", left: 60, top: 600, opacity: cl(f / 12) }}><Hand txt="rack: lower third" u={cl(f / 18)} size={52} color={CREAM} /></div>
      <div style={{ position: "absolute", left: 300, top: 180, opacity: cl(l * 2) }}><Hand txt="legs to the back" u={l} size={58} color={BUT} /></div>
      <div style={{ position: "absolute", right: 30, top: 40, opacity: cl(h * 2) }}><Hand txt="hottest" u={h} size={58} color="#FFB37A" /></div>
    </div>
    <div style={{ position: "absolute", left: 1300, top: 280, width: 460, height: 460, borderRadius: 230, background: "#F4F1EA", border: "16px solid #2a2a2a", boxShadow: "0 30px 50px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: cl((f - at(t425) + 6) / 8) }}>
      <div style={{ fontFamily: SLAB, fontSize: 150, color: temp > 400 ? CRAN : INK }}>{temp || 425}°</div>
      <Hand txt={temp > 400 ? "first 30 min" : "the rest"} u={1} size={52} color={WAL} />
    </div>
  </>);
};

// 12 · foto con los dos puntos del termómetro: anillo que late + lectura; al final "OUT IT COMES"
export const ProbePoints: P<{ k: string; pts: { t: number; x: number; y: number; txt: string; val: string }[]; done: number; bed?: string }> = ({ a, d, k, pts, done, bed = "tex_wood" }) => {
  const { f, at } = useT(a);
  const dn = sp(f, at(done), 12, 170);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={1080} h={700} x={110} y={170} u={sp(f, 0, 14, 120)} rot={-1} f={f}>
      {pts.map((p, i) => { const u = sp(f, at(p.t), 11, 190); const r = 30 + 10 * Math.sin(f / 6);
        return <div key={i} style={{ position: "absolute", left: p.x - r, top: p.y - r, width: 2 * r, height: 2 * r, borderRadius: r, border: `7px solid ${i ? PUMP : ICE}`, opacity: cl(u * 2), transform: `scale(${u})` }} />; })}
    </Photo>
    {pts.map((p, i) => { const u = sp(f, at(p.t) + 4, 12, 170);
      return <div key={i} style={{ position: "absolute", left: 1290, top: 200 + i * 290, opacity: cl(u * 2), transform: `translateX(${(1 - u) * 80}px)` }}>
        <div style={{ fontFamily: SLAB, fontSize: 44, color: i ? PUMP : ICE, textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>{p.txt}</div>
        <Big txt={p.val} size={150} />
      </div>; })}
    <div style={{ position: "absolute", left: 1270, top: 820, opacity: cl(dn * 2), transform: `rotate(-3deg) scale(${dn})`, background: OK, color: CREAM, fontFamily: SLAB, fontSize: 52, padding: "10px 30px", boxShadow: "0 14px 26px rgba(0,0,0,0.4)" }}>BOTH THERE = OUT</div>
  </>);
};

// 13 · curva del reposo: la temperatura del pecho sigue subiendo de 160 a 165 sobre papel cuadriculado
export const CarryChart: P<{ t0: number; climb: number; top: number; bed?: string }> = ({ a, d, t0, climb, top, bed = "tex_kraft" }) => {
  const { f, at } = useT(a);
  const pr = ez((f - at(climb)) / 40), u = sp(f, 0, 14, 120);
  const X = (m: number) => 260 + m * 30, Y = (t: number) => 820 - (t - 150) * 36;
  const pts = Array.from({ length: 41 }, (_, i) => i).filter((m) => m / 40 <= pr).map((m) => `${X(m)},${Y(160 + 5 * (1 - Math.exp(-m / 9)) / (1 - Math.exp(-40 / 9)))}`).join(" ");
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 160, top: 120, width: 1500, height: 820, background: "#FFFDF6", backgroundImage: "linear-gradient(#e3eef6 2px, transparent 2px), linear-gradient(90deg, #e3eef6 2px, transparent 2px)", backgroundSize: "60px 60px",
      boxShadow: "0 36px 70px rgba(0,0,0,0.4)", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 120}px)` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <line x1={260} y1={820} x2={1500} y2={820} stroke={WAL} strokeWidth={5} /><line x1={260} y1={820} x2={260} y2={200} stroke={WAL} strokeWidth={5} />
      <line x1={260} y1={Y(165)} x2={1500} y2={Y(165)} stroke={OK} strokeWidth={4} strokeDasharray="16 12" opacity={cl((f - at(top)) / 10)} />
      {pts ? <polyline points={pts} stroke={CRAN} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
    </svg>
    {[150, 155, 160, 165].map((t) => <div key={t} style={{ position: "absolute", left: 170, top: Y(t) - 22, fontFamily: SLAB, fontSize: 34, color: WAL }}>{t}°</div>)}
    {[0, 10, 20, 30, 40].map((m) => <div key={m} style={{ position: "absolute", left: X(m) - 30, top: 840, fontFamily: SLAB, fontSize: 32, color: WAL }}>{m}′</div>)}
    <div style={{ position: "absolute", left: 300, top: 160 }}><Big txt="REST 30-40 MIN" size={70} color={CRAN} u={sp(f, at(t0), 12, 150)} /></div>
    <div style={{ position: "absolute", left: 1180, top: Y(165) - 120, opacity: cl((f - at(top)) / 10) }}><Hand txt="165° · done & juicy" u={cl((f - at(top)) / 16)} size={56} color={OK} /></div>
  </>);
};

// 14 · tarjeta de la salsa de mamá (kraft, cordel) + foto; renglones a mano en su palabra
export const GravyCard: P<{ k: string; lines: B[]; bed?: string }> = ({ a, d, k, lines, bed = "tex_wood" }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 15, 110);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={640} h={460} x={1150} y={160} u={sp(f, 4, 14, 120)} rot={3} f={f} />
    <div style={{ position: "absolute", left: 130, top: 130, width: 960, height: 800, background: "linear-gradient(170deg,#d9b98d,#c9a274)", transform: `rotate(${-2 + (1 - u) * -6}deg) translateY(${(1 - u) * 200}px)`, opacity: cl(u * 2),
      boxShadow: "0 40px 80px rgba(0,0,0,0.5)", padding: "50px 60px" }}>
      <div style={{ position: "absolute", left: 460, top: -30, width: 8, height: 120, background: "#efe6d2" }} />
      <div style={{ fontFamily: SLAB, fontSize: 70, color: CRAN }}>Mom's gravy</div>
      <div style={{ height: 6, width: 420, background: CRAN, marginTop: 8, marginBottom: 30 }} />
      {lines.map((l, i) => <div key={i} style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 24, height: 24, borderRadius: 12, background: WAL, opacity: cl((f - at(l.t)) / 6) }} /><Hand txt={l.txt} u={cl((f - at(l.t)) / 18)} size={l.txt.length > 22 ? 56 : 66} color={WAL} /></div>)}
    </div>
  </>);
};

// 15 · trinchado en 3 pasos: tres fotos numeradas en fila que llegan en su palabra
export const CarveSteps: P<{ steps: { k: string; txt: string; t: number }[]; bed?: string }> = ({ a, d, steps, bed = "tex_wood" }) => {
  const { f, at } = useT(a);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    {steps.map((s, i) => { const u = sp(f, at(s.t), 13, 140), x = 90 + i * 600;
      return <React.Fragment key={i}>
        <Photo k={s.k} w={520} h={400} x={x} y={260} u={u} rot={i === 1 ? 1.5 : -1.5} f={f} />
        <div style={{ position: "absolute", left: x + 20, top: 180, width: 110, height: 110, borderRadius: 55, background: PUMP, color: "#fff", fontFamily: SLAB, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 24px rgba(0,0,0,0.4)", transform: `scale(${u})` }}>{i + 1}</div>
        <div style={{ position: "absolute", left: x + 10, top: 720, width: 540 }}><Hand txt={s.txt} u={cl((f - at(s.t) - 6) / 18)} size={56} color={CREAM} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.75)" }} /></div>
      </React.Fragment>; })}
  </>);
};

// 16 · notas adhesivas en la puerta de la heladera: problema arriba, arreglo abajo, con imán
export const StickyFix: P<{ notes: { t: number; prob: string; fix: string }[]; bed?: string }> = ({ a, d, notes, bed = "tex_fridge" }) => {
  const { f, at } = useT(a);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 120, top: 70 }}><Big txt="IF IT GOES WRONG" size={70} color={CRAN} u={sp(f, 0, 14, 140)} /></div>
    {notes.map((n, i) => { const u = sp(f, at(n.t), 12, 150), x = 140 + i * 860;
      return <div key={i} style={{ position: "absolute", left: x, top: 220, width: 760, transform: `rotate(${i ? 2 : -2}deg) translateY(${(1 - u) * -200}px)`, opacity: cl(u * 2) }}>
        <div style={{ background: "#FFE27A", padding: "40px 40px", boxShadow: "0 26px 40px rgba(0,0,0,0.3)", minHeight: 300 }}>
          <div style={{ fontFamily: SLAB, fontSize: 64, color: CRAN, textTransform: "uppercase" }}>{n.prob}</div>
        </div>
        <div style={{ background: "#BFE3B4", padding: "34px 40px", marginTop: 30, marginLeft: 50, boxShadow: "0 26px 40px rgba(0,0,0,0.3)", transform: "rotate(-2deg)", minHeight: 200 }}>
          <Hand txt={"→ " + n.fix} u={cl((f - at(n.t) - 10) / 22)} size={n.fix.length > 24 ? 40 : n.fix.length > 18 ? 48 : 56} color={WAL} />
        </div>
        <div style={{ position: "absolute", left: 340, top: -26, width: 70, height: 70, borderRadius: 35, background: i ? PUMP : CRAN, boxShadow: "0 8px 14px rgba(0,0,0,0.4), inset 0 -6px 10px rgba(0,0,0,0.25)" }} />
      </div>; })}
  </>);
};

// 17 · balanza de dos platos: $74 seco contra $32 que alimenta a diez; se inclina hacia el bueno
export const Balance: P<{ left: { txt: string; sub: string; t: number }; right: { txt: string; sub: string; t: number }; plate: number; bed?: string }> = ({ a, d, left, right, plate, bed = "tex_wood" }) => {
  const { f, at } = useT(a);
  const lu = sp(f, at(left.t) - 4, 12, 150), ru = sp(f, at(right.t), 12, 150), tilt = -9 * ez((f - at(right.t) - 6) / 20), pu = sp(f, at(plate), 12, 170);
  const pan = (x: number, c: { txt: string; sub: string }, u: number, col: string, dy: number) => <div style={{ position: "absolute", left: x - 230, top: 470 + dy, width: 460, textAlign: "center" }}>
    <div style={{ height: 90, borderBottom: "6px solid #8c7a62", borderLeft: "4px solid transparent", borderRight: "4px solid transparent" }} />
    <div style={{ height: 40, background: "linear-gradient(180deg,#d9c79f,#a8946c)", borderRadius: "0 0 230px 230px", boxShadow: "0 18px 26px rgba(0,0,0,0.35)" }} />
    <div style={{ marginTop: -170, opacity: cl(u * 2), transform: `translateY(${(1 - u) * -80}px)` }}><Big txt={c.txt} size={120} color={col} /></div>
    <div style={{ marginTop: 120, display: "flex", justifyContent: "center" }}><Hand txt={c.sub} u={u} size={48} color={CREAM} style={{ textShadow: "0 4px 12px rgba(0,0,0,0.75)" }} /></div>
  </div>;
  const s = Math.sin(tilt * Math.PI / 180) * 420;
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 940, top: 260, width: 40, height: 560, background: "linear-gradient(90deg,#8c7a62,#cdb991,#8c7a62)", borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 540, top: 250, width: 840, height: 24, background: "#a8946c", borderRadius: 12, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 50%" }} />
    {pan(540 + 10, left, lu, CRAN, s)}
    {pan(1380 - 10, right, ru, BUT, -s)}
    <div style={{ position: "absolute", left: 740, top: 880, opacity: cl(pu * 2), transform: `scale(${pu})`, background: OK, color: CREAM, fontFamily: SLAB, fontSize: 56, padding: "10px 34px", boxShadow: "0 14px 26px rgba(0,0,0,0.4)" }}>≈ $3 A PLATE</div>
  </>);
};

// 18 · bloc amarillo de renglones: el resumen numerado se escribe en birome
export const LegalPad: P<{ head: string; items: B[]; num: number; bed?: string }> = ({ a, d, head, items, num, bed = "tex_wood" }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 120);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 300, top: 60, width: 1320, height: 960, background: "#FBEFA0", backgroundImage: "repeating-linear-gradient(0deg, transparent 0 88px, #9fc3e0 88px 91px)", backgroundPosition: "0 40px",
      boxShadow: "0 40px 80px rgba(0,0,0,0.45)", transform: `rotate(${-1.5 + (1 - u) * 4}deg) translateY(${(1 - u) * 300}px)`, opacity: cl(u * 2) }}>
      <div style={{ height: 70, background: CRAN }} />
      <div style={{ position: "absolute", left: 150, top: 0, bottom: 0, width: 4, background: "#e58f8f" }} />
      <div style={{ position: "absolute", left: 190, top: 110 }}><Hand txt={head} u={cl(f / 18)} size={76} color={CRAN} /></div>
      {items.map((it, i) => <div key={i} style={{ position: "absolute", left: 120, top: 300 + i * 180, display: "flex", gap: 30, alignItems: "center" }}>
        <div style={{ fontFamily: SLAB, fontSize: 80, color: PUMP, width: 70, opacity: cl((f - at(it.t)) / 8) }}>{num + i}</div>
        <Hand txt={it.txt} u={cl((f - at(it.t)) / 20)} size={it.txt.length > 24 ? 70 : 82} color="#1d2c4f" />
      </div>)}
    </div>
  </>);
};

// 19 · cierre: nota en la heladera con imán + foto de Mickey; la pregunta del canal
export const FridgeNote: P<{ k: string; q: string; t: number; sub: number; sub_txt: string; bed?: string }> = ({ a, d, k, q, t, sub, sub_txt, bed = "tex_fridge" }) => {
  const { f, at } = useT(a);
  const u = sp(f, Math.max(0, at(t) - 6), 13, 130);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={620} h={420} x={1160} y={170} u={sp(f, 0, 14, 120)} rot={4} f={f} />
    <div style={{ position: "absolute", left: 140, top: 220, width: 900, background: "#FFFDF4", padding: "60px 56px", boxShadow: "0 30px 60px rgba(0,0,0,0.35)", transform: `rotate(-2deg) translateY(${(1 - u) * -120}px)`, opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 410, top: -30, width: 80, height: 80, borderRadius: 40, background: PUMP, boxShadow: "0 8px 14px rgba(0,0,0,0.4)" }} />
      <div style={{ fontFamily: SLAB, fontSize: 34, color: SAGE, letterSpacing: 4 }}>MICKEY ASKS</div>
      <div style={{ fontFamily: SLAB, fontSize: 76, color: INK, lineHeight: 1.12, marginTop: 18 }}>{q}</div>
      <div style={{ marginTop: 20 }}><Hand txt={sub_txt} u={cl((f - at(sub)) / 18)} size={44} color={CRAN} /></div>
    </div>
  </>);
};
