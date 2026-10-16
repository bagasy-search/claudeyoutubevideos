// ── HÉROES de mickey4 (Mickey's Butcher Shop, video 4: el jamón de las fiestas). Claude, 16-oct-2026.
//    Juego PROPIO de este video (no recicla los de mickey1/2/3): etiquetas de supermercado, tickets que se imprimen, etiquetas de
//    kraft colgadas de ganchos, balanza/horno/termómetro de aguja, mapa de la pierna, tarjeta de fichero, reloj de cocina.
//    PURO CSS/SVG (cero imágenes): textura del oficio dibujada (papel de carnicería, pizarra, boiserie verde, arce, acero, aluminio) + luz cenital +
//    sombra proyectada + objeto dibujado + dato + acento animado con resorte, anclado a SU palabra.
//    Tipografías: 2 familias (Fraunces = rótulos/números de etiqueta antigua · Caveat = mano y tiza).
//    Paleta navideña del local: verde boiserie, arándano (rojo del delantal), ámbar del glaseado, clavo, crema, kraft.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Tex, Sketch } from "./sketch";
import { useT, sp, ez, eo, cl, SERIF, HAND, fit, P } from "../lkit/core";

const GREEN = "#1E4637", CRAN = "#9E1F2A", AMBER = "#C9802F", CLOVE = "#3B2417", CREAM = "#F6EEDC", CHALK = "#F1EEE6", KRAFT = "#C9A27A", INK = "#2A231C", GOLD = "#E2B04A", OK = "#3F8A5C";
type B = { t: number; txt: string };
const F = SERIF;

// ── capas base ───────────────────────────────────────────────────────────
const Photo: React.FC<{ k: string; w: number; h: number; x: number; y: number; u: number; rot?: number; tape?: boolean; f: number; children?: React.ReactNode }> =
  ({ k, w, h, x, y, u, rot = -2, tape = true, f, children }) => (
    <div style={{ position: "absolute", left: x, top: y, width: w + 28, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 90}px) rotate(${rot * u + (1 - u) * rot * 3}deg) scale(${0.9 + 0.1 * u})`, transformOrigin: "50% 0" }}>
      <div style={{ background: "#FBF8F1", padding: 14, boxShadow: "0 38px 70px rgba(0,0,0,0.55), 0 8px 16px rgba(0,0,0,0.3)" }}>
        <div style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "#888" }}>
          <Sketch k={k} w={w} h={h} f={f} style="ink" />
          {children}
        </div>
      </div>
      {tape ? <div style={{ position: "absolute", left: "50%", top: -18, width: 150, height: 40, marginLeft: -75, background: "rgba(236,226,196,0.82)", transform: "rotate(-3deg)", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} /> : null}
    </div>
  );
const Write: React.FC<{ txt: string; u: number; size: number; color?: string; font?: string; w?: number; style?: React.CSSProperties }> = ({ txt, u, size, color = CHALK, font = HAND, w, style }) => (
  <div style={{ fontFamily: font, fontWeight: 700, fontSize: w ? Math.min(size, fit(txt, w, size, font === HAND ? "hand" : "serif")) : size, color, whiteSpace: "nowrap", lineHeight: 1.08, paddingRight: "0.35em",
    clipPath: `inset(-20% ${(100 - 100 * ez(u)) * 1.06 - 6}% -20% -2%)`, textShadow: color === CHALK ? "0 0 2px rgba(255,255,255,0.35)" : undefined, ...style }}>{txt}</div>
);
const Mark2: React.FC<{ u: number; no?: boolean; size?: number; color?: string }> = ({ u, no, size = 90, color }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" style={{ overflow: "visible", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))" }}>
    {no ? <path d="M 10 10 L 42 42 M 42 10 L 10 42" stroke={color || CRAN} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
      : <path d="M 8 28 L 21 40 L 44 12" stroke={color || OK} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />}
  </svg>
);
const Arrow: React.FC<{ d: string; u: number; color?: string; w?: number }> = ({ d, u, color = CHALK, w = 7 }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
    <path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.45))" }} />
  </svg>
);
// sello de goma: entra grande y se asienta, tinta un poco transparente
const Stamp: React.FC<{ txt: string; u: number; color?: string; size?: number; rot?: number }> = ({ txt, u, color = CRAN, size = 84, rot = -8 }) => (
  <div style={{ display: "inline-block", opacity: cl(u * 3) * 0.92, transform: `rotate(${rot}deg) scale(${1.9 - 0.9 * Math.min(1, u)})`, border: `8px double ${color}`, color, fontFamily: F, fontWeight: 800,
    fontSize: size, letterSpacing: 6, padding: `${size * 0.1}px ${size * 0.35}px`, textTransform: "uppercase", whiteSpace: "nowrap", mixBlendMode: "multiply" }}>{txt}</div>
);
const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${10 * Math.sin(f / 37)}px, ${6 * Math.cos(f / 51)}px) scale(${1.03 + 0.012 * Math.sin(f / 45)})` }}>{children}</AbsoluteFill>;
};
const shell = (children: React.ReactNode) => <AbsoluteFill style={{ overflow: "hidden" }}><Drift>{children}</Drift></AbsoluteFill>;
// vaivén amortiguado de algo que cuelga (etiqueta en un gancho)
const swing = (f: number, at: number, amp = 9) => { const x = Math.max(0, f - at); return amp * Math.exp(-x / 22) * Math.sin(x / 4.2); };

// 1 · la etiqueta del jamón: foto del paquete + calco gigante de la etiqueta; "WATER ADDED" se encierra en rojo y cae el sello
export const LabelRead: P<{ k: string; name: string; sub: string; circle: number; stamp: number; stamp_txt: string; bed?: string }> = ({ a, d, k, name, sub, circle, stamp, stamp_txt, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const u = sp(f, 4, 14, 120);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={720} h={540} x={110} y={240} u={sp(f, 0, 14, 120)} rot={-3} f={f} />
    <div style={{ position: "absolute", left: 980, top: 250, width: 800, height: 520, background: "#FFFEF9", borderRadius: 22, boxShadow: "0 40px 80px rgba(0,0,0,0.45)", opacity: cl(u * 2),
      transform: `translateX(${(1 - u) * 260}px) rotate(${3 - 1 * u}deg)`, border: "3px solid #e7e1d2" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 74, background: GREEN, borderRadius: "20px 20px 0 0", color: CREAM, fontFamily: F, fontSize: 38, letterSpacing: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>HOLIDAY · SMOKED</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 190, color: INK, letterSpacing: 6 }}>{name}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: F, fontWeight: 600, fontSize: 64, color: INK, letterSpacing: 8 }}>{sub}</div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 440, borderTop: "2px dashed #c9c0ad", paddingTop: 10, textAlign: "center", fontFamily: F, fontSize: 28, color: "#8a8174", letterSpacing: 4 }}>KEEP REFRIGERATED · FULLY COOKED</div>
      <svg width={800} height={520} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d="M 120 372 C 120 300 690 296 694 366 C 698 440 140 444 112 380 C 100 350 160 318 260 312" stroke={CRAN} strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo((f - at(circle)) / 16)} />
      </svg>
    </div>
    <div style={{ position: "absolute", left: 1090, top: 780 }}><Stamp txt={stamp_txt} u={sp(f, at(stamp), 11, 220)} size={92} /></div>
  </>);
};

// 2 · ticket térmico que se imprime renglón a renglón (con su foto al lado); el total sale grande
export const Ticket: P<{ k: string; head: string; rows: { t: number; l: string; r: string }[]; total: { t: number; l: string; r: string; bad?: boolean }; bed?: string }> = ({ a, d, k, head, rows, total, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const shown = rows.filter((r) => f >= at(r.t) - 3).length + (f >= at(total.t) - 3 ? 1 : 0);
  const h = 190 + 120 * Math.min(rows.length, shown) + (f >= at(total.t) - 3 ? 230 * ez((f - at(total.t) + 3) / 10) : 0);
  const tu = sp(f, at(total.t), 12, 160);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={820} h={560} x={100} y={230} u={sp(f, 0, 14, 120)} rot={-2} f={f} />
    <div style={{ position: "absolute", left: 1060, top: 40, width: 720, height: 30, background: "#2b2b2b", borderRadius: 10, boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
    <div style={{ position: "absolute", left: 1090, top: 56, width: 660, height: Math.min(980, h), overflow: "hidden", background: "#FBFAF6", boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
      backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0) 40px)" }}>
      <div style={{ padding: "40px 46px", fontFamily: F, color: INK }}>
        <div style={{ textAlign: "center", fontSize: 40, fontWeight: 700, letterSpacing: 6, borderBottom: "3px dashed #b9b1a3", paddingBottom: 16 }}>{head}</div>
        {rows.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 34, opacity: cl((f - at(r.t) + 3) / 6), fontSize: 38, letterSpacing: 2 }}>
          <span style={{ maxWidth: 420, lineHeight: 1.1 }}>{r.l}</span><span style={{ fontWeight: 700, fontSize: 46 }}>{r.r}</span></div>)}
        <div style={{ borderTop: "3px dashed #b9b1a3", marginTop: 34, paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: cl(tu * 2) }}>
          <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: 2, maxWidth: 280, lineHeight: 1.15 }}>{total.l}</span>
          <span style={{ fontSize: total.r.length > 6 ? 76 : 96, fontWeight: 800, whiteSpace: "nowrap", color: total.bad ? CRAN : INK, transform: `scale(${0.7 + 0.3 * tu})`, display: "inline-block" }}>{total.r}</span>
        </div>
      </div>
    </div>
  </>);
};

// 3 · foto con notas a mano y flechas que señalan el defecto exacto; leak = aire caliente que baja y gotas que se escapan
export const PhotoNotes: P<{ k: string; notes: { t: number; txt: string; x: number; y: number; px: number; py: number }[]; leak?: boolean; bed?: string }> = ({ a, d, k, notes, leak, bed = "n_tex_wood" }) => {
  const { f, at } = useT(a);
  return shell(<>
    <Tex k={bed} f={f} T={d} dark={0.15} />
    <Photo k={k} w={900} h={640} x={110} y={200} u={sp(f, 0, 14, 120)} rot={-1.5} f={f}>
      {leak ? [0, 1, 2, 3, 4].map((i) => { const y = ((f * 3.2 + i * 130) % 640); return <div key={i} style={{ position: "absolute", left: 160 + i * 140, top: y, width: 14, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(120,190,255,0.85)", opacity: cl((f - at(notes[notes.length - 1].t)) / 10) }} />; }) : null}
      {leak ? [0, 1, 2].map((i) => <svg key={"h" + i} width={900} height={640} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={`M ${240 + i * 200} -10 C ${200 + i * 200} 90 ${290 + i * 200} 150 ${250 + i * 200} 260`} stroke={AMBER} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="26 22" strokeDashoffset={-f * 2.5} opacity={cl((f - at(notes[0].t)) / 12) * 0.9} />
      </svg>) : null}
    </Photo>
    {notes.map((n, i) => {
      const u = cl((f - at(n.t)) / 16);
      const p = sp(f, at(n.t) + 10, 10, 160);
      return <React.Fragment key={i}>
        <Arrow d={`M ${n.x - 20} ${n.y + 40} C ${(n.x + n.px) / 2} ${n.y + 60} ${n.px + 60} ${n.py - 40} ${n.px} ${n.py}`} u={cl((f - at(n.t) - 6) / 14)} color={GOLD} w={8} />
        <div style={{ position: "absolute", left: n.px - 34, top: n.py - 34, width: 68, height: 68, borderRadius: 40, border: `6px solid ${GOLD}`, transform: `scale(${p})`, opacity: cl(p) }} />
        <div style={{ position: "absolute", left: n.x, top: n.y - 20 }}><Write txt={n.txt} u={u} size={92} color={CREAM} style={{ textShadow: "0 4px 18px rgba(0,0,0,0.85)" }} /></div>
      </React.Fragment>;
    })}
  </>);
};

// 4 · nueve etiquetas de kraft caen una por una en los ganchos del riel; después "54 años detrás de este mostrador"
export const NineHooks: P<{ t: number; yrs: number; bed?: string }> = ({ a, d, t, yrs, bed = "n_tex_green" }) => {
  const { f, at } = useT(a);
  const yu = sp(f, at(yrs), 14, 120);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 80, right: 80, top: 120, height: 26, borderRadius: 13, background: "linear-gradient(180deg,#e9ecef,#8d949b 60%,#5d646b)", boxShadow: "0 14px 24px rgba(0,0,0,0.5)" }} />
    {Array.from({ length: 9 }).map((_, i) => {
      const t0 = at(t) + i * 4, u = sp(f, t0, 12, 170), x = 150 + i * 190;
      return <div key={i} style={{ position: "absolute", left: x, top: 126, width: 130, transformOrigin: "65px 0", transform: `translateY(${(1 - u) * -420}px) rotate(${swing(f, t0)}deg)`, opacity: cl(u * 3) }}>
        <svg width={130} height={70} style={{ display: "block" }}><path d="M 65 0 L 65 30 C 65 60 40 60 40 44" stroke="#9aa1a8" strokeWidth={7} fill="none" strokeLinecap="round" /></svg>
        <div style={{ margin: "0 auto", width: 120, height: 170, background: KRAFT, borderRadius: "14px 14px 8px 8px", clipPath: "polygon(22% 0,78% 0,100% 16%,100% 100%,0 100%,0 16%)", boxShadow: "0 18px 26px rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 16, width: 18, height: 18, borderRadius: 9, background: "#5b4630" }} />
          <span style={{ fontFamily: F, fontWeight: 800, fontSize: 92, color: CLOVE, marginTop: 20 }}>{i + 1}</span>
        </div>
      </div>;
    })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", opacity: cl(yu * 2), transform: `translateY(${(1 - yu) * 40}px)` }}>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 150, color: CREAM, letterSpacing: 8, textShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>54 YEARS</div>
      <div style={{ display: "inline-block" }}><Write txt="behind this counter" u={cl((f - at(yrs) - 8) / 18)} size={90} color={GOLD} /></div>
    </div>
  </>);
};

// 5 · capítulo: etiqueta de kraft colgada de un hilo que baja y se mece; número grande + el truco escrito a mano; foto clavada
export const TrickTag: P<{ n: number; title: string; k: string; teaser?: boolean; bed?: string }> = ({ a, d, n, title, k, teaser, bed = "n_tex_green" }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 12, 150);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={760} h={520} x={1030} y={250} u={sp(f, 6, 14, 120)} rot={3} f={f} />
    <div style={{ position: "absolute", left: 200, top: -40, width: 640, transformOrigin: "320px 0", transform: `translateY(${(1 - u) * -700}px) rotate(${swing(f, 0, 7)}deg)` }}>
      <div style={{ margin: "0 auto", width: 6, height: 190, background: "#e9e2d0", boxShadow: "2px 0 3px rgba(0,0,0,0.3)" }} />
      <div style={{ width: 640, height: 640, background: `linear-gradient(160deg, #d8b48a, ${KRAFT} 50%, #b38b5f)`, clipPath: "polygon(24% 0,76% 0,100% 18%,100% 100%,0 100%,0 18%)", boxShadow: "0 40px 70px rgba(0,0,0,0.5)", position: "relative" }}>
        <div style={{ position: "absolute", left: 300, top: 40, width: 40, height: 40, borderRadius: 20, background: "#4a3826", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.6)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: F, fontSize: 46, letterSpacing: 18, color: CLOVE }}>{teaser ? "COMING UP" : "TRICK"}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 250, color: CRAN, lineHeight: 1 }}>{`Nº${n}`}</div>
        <div style={{ position: "absolute", left: 50, right: 50, top: 440, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: title.length > 22 ? 58 : 70, lineHeight: 1.05, color: CLOVE,
          clipPath: `inset(0 ${100 - 100 * ez((f - 14) / 22)}% 0 0)` }}>{title}</div>
      </div>
    </div>
  </>);
};

// 6 · marco de madera con la foto vieja, fecha naranja impresa de los 70 y epígrafe a mano; opcional: la frase del padre
export const OldFrame: P<{ k: string; caption: string; date: string; t: number; quote?: number; quote_txt?: string; bed?: string }> = ({ a, d, k, caption, date, t, quote, quote_txt, bed = "n_tex_green" }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 110), q = quote != null ? cl((f - at(quote)) / 22) : 0;
  const x = quote != null ? 150 : 420;
  return shell(<>
    <Tex k={bed} f={f} T={d} dark={0.1} />
    <div style={{ position: "absolute", left: x, top: 130, width: 1000, padding: 34, background: "linear-gradient(135deg,#6b4a2c,#3d2a18 55%,#5a3d22)", boxShadow: "0 50px 90px rgba(0,0,0,0.6), inset 0 0 0 4px rgba(255,220,170,0.15)",
      opacity: cl(u * 2), transform: `translateY(${(1 - u) * 80}px) rotate(${-1.5 * u}deg)` }}>
      <div style={{ position: "relative", height: 620, overflow: "hidden", boxShadow: "inset 0 0 30px rgba(0,0,0,0.6)" }}>
        <Sketch k={k} w={932} h={620} f={f} style="ink" />
        <div style={{ position: "absolute", right: 30, bottom: 22, fontFamily: F, fontWeight: 700, fontSize: 40, color: "#FF8A2A", letterSpacing: 4, textShadow: "0 0 8px rgba(255,120,30,0.7)", opacity: cl((f - at(t)) / 8) }}>{date}</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: x + 60, top: 900 }}><Write txt={caption} u={cl((f - at(t) - 6) / 22)} size={70} color={CREAM} style={{ textShadow: "0 4px 14px rgba(0,0,0,0.8)" }} /></div>
    {quote != null && quote_txt ? <div style={{ position: "absolute", left: 1220, top: 360, width: 600, background: CREAM, padding: "40px 40px", transform: `rotate(2deg) translateY(${(1 - ez(q * 2)) * 40}px)`, opacity: cl(q * 3), boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 72, color: CLOVE, lineHeight: 1.1 }}>{quote_txt}</div>
      <div style={{ fontFamily: F, fontSize: 30, color: "#8a7a66", marginTop: 18, letterSpacing: 4 }}>— POP</div>
    </div> : null}
  </>);
};

// 7 · pizarra: título a tiza con subrayado, renglones que se escriben (numerados o con tachón rojo)
export const ChalkLines: P<{ head: string; items: B[]; strike?: boolean; num?: number; bed?: string }> = ({ a, d, head, items, strike, num, bed = "n_tex_chalk" }) => {
  const { f, at } = useT(a);
  const n = items.length, gap = n > 4 ? 140 : 170, top = n > 4 ? 270 : 320;
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 200, top: 110 }}><Write txt={head} u={cl(f / 18)} size={110} color={GOLD} /></div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d="M 200 250 C 500 236 800 246 1100 238" stroke={GOLD} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo((f - 10) / 16)} opacity={0.85} /></svg>
    {items.map((it, i) => {
      const u = cl((f - at(it.t)) / 18);
      return <div key={i} style={{ position: "absolute", left: 230, top: top + i * gap, display: "flex", alignItems: "center", gap: 34 }}>
        <div style={{ width: 110, textAlign: "right", fontFamily: F, fontWeight: 800, fontSize: 92, color: CHALK, opacity: cl(u * 3) }}>{num != null ? `${num + i}.` : "·"}</div>
        <div style={{ position: "relative" }}>
          <Write txt={it.txt} u={u} size={n > 4 ? 100 : 118} />
          {strike ? <div style={{ position: "absolute", left: -10, top: "52%", height: 9, width: `${100 * ez((f - at(it.t) - 16) / 10)}%`, background: CRAN, borderRadius: 5, transform: "rotate(-2deg)" }} /> : null}
        </div>
      </div>;
    })}
  </>);
};

// 8 · escalera de etiquetas legales: cada etiqueta entra con su vaso medidor que se llena del % de agua y su tilde o cruz
export const LabelLadder: P<{ rows: { t: number; txt: string; sub: string; ok: boolean; pct: number }[]; bed?: string }> = ({ a, d, rows, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    {rows.map((r, i) => {
      const u = sp(f, at(r.t), 13, 140), y = 170 + i * 420, fill = Math.min(1, r.pct * 3) * ez((f - at(r.t) - 8) / 24);
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: 120, top: y, width: 1180, height: 300, background: "#FFFEF9", borderRadius: 20, border: `5px solid ${r.ok ? GREEN : CRAN}`, boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
          opacity: cl(u * 2), transform: `translateX(${(1 - u) * -300}px) rotate(${i ? 1 : -1}deg)`, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 60 }}>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: Math.min(100, fit(r.txt, 1000, 100, "serif")), color: INK, letterSpacing: 3 }}>{r.txt}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: r.ok ? GREEN : CRAN, marginTop: 6 }}>{r.sub}</div>
          <div style={{ position: "absolute", right: 40, top: 100 }}><Mark2 u={cl((f - at(r.t) - 14) / 12)} no={!r.ok} size={110} /></div>
        </div>
        <div style={{ position: "absolute", left: 1400, top: y, width: 300, height: 320, opacity: cl(u * 2) }}>
          <svg width={300} height={240} viewBox="0 0 300 320">
            <defs><clipPath id={`gl${i}`}><path d="M 60 20 L 240 20 L 222 300 L 78 300 Z" /></clipPath></defs>
            <rect x={0} y={300 - 280 * fill} width={300} height={320} fill="rgba(110,170,230,0.75)" clipPath={`url(#gl${i})`} />
            <path d="M 60 20 L 240 20 L 222 300 L 78 300 Z" fill="rgba(255,255,255,0.18)" stroke="#e8eef3" strokeWidth={8} strokeLinejoin="round" />
            {[0.25, 0.5, 0.75].map((m) => <line key={m} x1={66 + 10 * m} x2={110} y1={300 - 280 * m} y2={300 - 280 * m} stroke="#e8eef3" strokeWidth={5} />)}
          </svg>
          <div style={{ position: "absolute", left: -40, right: -40, top: 250, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 46, whiteSpace: "nowrap", color: r.pct ? CRAN : GREEN }}>{r.pct ? `+${Math.round(r.pct * 100 * ez((f - at(r.t) - 8) / 24))}% water` : "no water"}</div>
        </div>
      </React.Fragment>;
    })}
  </>);
};

// 9 · aguja: balanza de carnicero / perilla del horno / termómetro de carne (zonas), con lectura y nota a mano
export const Dial: P<{ skin: "scale" | "oven" | "thermo"; k: string; v0: number; v1: number; t0: number; t1: number; tag: number; tag_txt: string; bed?: string }> = ({ a, d, skin, k, v0, v1, t0, t1, tag, tag_txt, bed = "n_tex_steel" }) => {
  const { f, at } = useT(a);
  const [lo, hi, step, unit] = skin === "scale" ? [0, 12, 1, " lb"] : skin === "oven" ? [150, 500, 50, "°"] : [0, 200, 20, "°F"];
  const v = f < at(t0) ? lo + (v0 - lo) * ez(f / 14) : lo + (v0 - lo) + (v1 - v0) * ez((f - at(t0)) / Math.max(12, at(t1) - at(t0) + 10));
  const ang = (x: number) => -130 + 260 * (x - lo) / (hi - lo);
  const R = 300, cx = 1260, cy = 540, u = sp(f, 0, 14, 110), tg = sp(f, at(tag), 11, 200);
  const pt = (x: number, r: number) => { const t = (ang(x) - 90) * Math.PI / 180; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; };
  const arc = (x0: number, x1: number, r: number) => { const [ax, ay] = pt(x0, r), [bx, by] = pt(x1, r); return `M ${ax} ${ay} A ${r} ${r} 0 ${ang(x1) - ang(x0) > 180 ? 1 : 0} 1 ${bx} ${by}`; };
  const ticks = []; for (let x = lo; x <= hi; x += step) ticks.push(x);
  const shown = skin === "scale" ? v.toFixed(1) : Math.round(v).toString();
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={640} h={480} x={110} y={300} u={sp(f, 2, 14, 120)} rot={-3} f={f} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: cl(u * 2), transform: `scale(${0.85 + 0.15 * u})`, transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx + 14} cy={cy + 24} r={R + 46} fill="rgba(0,0,0,0.45)" />
      <circle cx={cx} cy={cy} r={R + 46} fill={skin === "oven" ? "#2a2a2a" : "#d9dde1"} stroke="#8b939a" strokeWidth={10} />
      <circle cx={cx} cy={cy} r={R + 18} fill={skin === "oven" ? "#F4F1EA" : "#FBFAF5"} />
      {skin === "thermo" ? <><path d={arc(130, 145, R - 30)} stroke={OK} strokeWidth={34} fill="none" /><path d={arc(150, 200, R - 30)} stroke={CRAN} strokeWidth={34} fill="none" opacity={0.85} /></> : null}
      {ticks.map((x) => { const [ax, ay] = pt(x, R), [bx, by] = pt(x, R - 36), [tx, ty] = pt(x, R - 84);
        return <g key={x}><line x1={ax} y1={ay} x2={bx} y2={by} stroke={INK} strokeWidth={6} />
          <text x={tx} y={ty + 14} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={skin === "scale" ? 40 : 34} fill={INK}>{x}</text></g>; })}
      {(() => { const [nx, ny] = pt(v, R - 20); return <><line x1={cx} y1={cy} x2={nx} y2={ny} stroke={CRAN} strokeWidth={12} strokeLinecap="round" /><circle cx={cx} cy={cy} r={30} fill={CLOVE} /></>; })()}
      <text x={cx} y={cy + 118} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={78} fill={INK}>{shown + unit}</text>
      {skin === "thermo" ? [160, 170].map((x, i) => { const [mx, my] = pt(x, R + 90); const q = cl((f - at(tag) - i * 6) / 10);
        return <path key={x} d={`M ${mx - 26} ${my - 26} L ${mx + 26} ${my + 26} M ${mx + 26} ${my - 26} L ${mx - 26} ${my + 26}`} stroke={CRAN} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - q} />; }) : null}
    </svg>
    <div style={{ position: "absolute", left: 120, top: 860, opacity: cl(tg * 2), transform: `rotate(-3deg) scale(${0.8 + 0.2 * tg})`, transformOrigin: "0 50%" }}>
      <div style={{ display: "inline-block", background: CRAN, color: CREAM, fontFamily: HAND, fontWeight: 700, fontSize: 82, padding: "4px 34px", boxShadow: "0 16px 30px rgba(0,0,0,0.45)" }}>{tag_txt}</div>
    </div>
  </>);
};

// 10 · dos tarjetas enfrentadas (mal / bien): foto, faja con el título, renglones a mano, cruz y tilde
type Card = { k: string; head: string; lines: string[]; t: number; good?: boolean };
export const TwoCards: P<{ left: Card; right: Card; bed?: string }> = ({ a, d, left, right, bed = "n_tex_wood" }) => {
  const { f, at } = useT(a);
  const one = (c: Card, x: number, rot: number) => {
    const u = sp(f, Math.min(at(c.t), x < 900 ? 0 : at(c.t)), 13, 130);
    return <div style={{ position: "absolute", left: x, top: 120, width: 760, background: "#FBF8F1", padding: 18, boxShadow: "0 40px 70px rgba(0,0,0,0.5)", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 120}px) rotate(${rot}deg)` }}>
      <div style={{ position: "relative", height: 430, overflow: "hidden" }}><Sketch k={c.k} w={724} h={430} f={f} style="ink" />
        <div style={{ position: "absolute", right: 18, top: 18 }}><Mark2 u={cl((f - at(c.t) - 10) / 12)} no={!c.good} size={120} /></div></div>
      <div style={{ background: c.good ? GREEN : CRAN, color: CREAM, fontFamily: F, fontWeight: 800, fontSize: 76, letterSpacing: 4, textAlign: "center", padding: "10px 0", marginTop: 14 }}>{c.head}</div>
      {c.lines.map((l, i) => <div key={i} style={{ marginTop: 12, display: "flex", justifyContent: "center" }}><Write txt={l} u={cl((f - at(c.t) - 8 - i * 10) / 18)} size={64} color={INK} w={700} /></div>)}
    </div>;
  };
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    {one(left, 130, -2.5)}
    {one(right, 1010, 2)}
  </>);
};

// 11 · tarjeta de fichero de receta (renglones celestes, margen rojo, aro de café) + foto clavada; los renglones se escriben en su palabra
export const RecipeCard: P<{ head: string; k: string; lines: B[]; bed?: string }> = ({ a, d, head, k, lines, bed = "n_tex_wood" }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 16, 100);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={620} h={440} x={90} y={170} u={sp(f, 4, 14, 120)} rot={-4} f={f} />
    <div style={{ position: "absolute", left: 760, top: 150, width: 1060, height: 780, transform: `translateX(${(1 - u) * 400}px) rotate(${1.5 + (1 - u) * 5}deg)`, background: "#FBF7EC",
      backgroundImage: "repeating-linear-gradient(0deg, transparent 0 104px, #9fc0de 104px 107px)", boxShadow: "0 50px 90px rgba(0,0,0,0.55)", opacity: cl(u * 2) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, height: 4, background: "#d35d5d" }} />
      <div style={{ position: "absolute", right: 70, bottom: 60, width: 200, height: 200, borderRadius: 100, border: "14px solid rgba(140,90,40,0.16)" }} />
      <div style={{ position: "absolute", left: 70, top: 44, fontFamily: HAND, fontWeight: 700, fontSize: 100, color: CRAN }}>{head}</div>
      {lines.map((l, i) => <div key={i} style={{ position: "absolute", left: 80, top: 196 + i * 107 }}>
        <Write txt={l.txt} u={cl((f - at(l.t)) / 20)} size={80} color="#1d2c4f" w={900} />
      </div>)}
    </div>
  </>);
};

// 12 · la pierna del cerdo dibujada en papel de carnicero: se marca el corte, se ilumina SHANK (abajo) y después BUTT (arriba)
export const LegMap: P<{ butt: number; shank: number; bone: number; meat: number; bed?: string }> = ({ a, d, butt, shank, bone, meat, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const leg = "M 520 210 C 760 150 1120 170 1300 250 C 1440 320 1450 470 1360 560 L 1080 760 C 1000 820 960 880 930 930 L 820 930 C 800 860 790 790 760 730 C 640 560 420 520 400 380 C 390 290 440 240 520 210 Z";
  const draw = eo(f / 30), sh = cl((f - at(shank)) / 14), mt = cl((f - at(meat)) / 14), bt = cl((f - at(butt)) / 12);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <clipPath id="lgU"><rect x={0} y={0} width={1920} height={590} /></clipPath>
        <clipPath id="lgL"><rect x={0} y={590} width={1920} height={500} /></clipPath>
      </defs>
      <path d={leg} fill="rgba(0,0,0,0.18)" transform="translate(16,22)" opacity={draw} />
      <path d={leg} fill="#E9B7A4" opacity={draw} />
      <path d={leg} fill={GREEN} opacity={0.55 * mt} clipPath="url(#lgU)" />
      <path d={leg} fill={AMBER} opacity={0.6 * sh} clipPath="url(#lgL)" />
      <path d={leg} stroke={CLOVE} strokeWidth={9} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} strokeLinejoin="round" />
      <path d="M 560 610 C 800 560 1100 570 1420 520" stroke={CLOVE} strokeWidth={7} strokeDasharray="22 16" fill="none" opacity={cl((f - 20) / 10)} />
      <ellipse cx={940} cy={420} rx={60} ry={40} fill="#FFF6E8" stroke={CLOVE} strokeWidth={6} opacity={draw} />
      <path d="M 940 460 C 930 600 920 760 880 900" stroke="#FFF6E8" strokeWidth={30} strokeLinecap="round" fill="none" opacity={cl((f - at(bone)) / 10)} />
      <ellipse cx={900} cy={370} rx={520 * ez(bt * 1.4)} ry={240 * ez(bt * 1.4)} stroke={GOLD} strokeWidth={9} fill="none" opacity={bt * (1 - mt * 0.6)} />
    </svg>
    <div style={{ position: "absolute", left: 1330, top: 120, opacity: cl(mt * 2) }}>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 76, color: GREEN }}>BUTT END</div><Write txt="top of the leg · more ham" u={cl((f - at(meat) - 6) / 18)} size={56} color={INK} />
    </div>
    <div style={{ position: "absolute", left: 1130, top: 800, opacity: cl(sh * 2) }}>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 76, color: "#A35F1C" }}>SHANK END</div><Write txt="lower leg · more bone" u={cl((f - at(bone)) / 18)} size={56} color={INK} />
    </div>
    <div style={{ position: "absolute", left: 120, top: 120, opacity: cl(bt * 2) }}><Write txt="ask for this end" u={bt} size={80} color={CRAN} /></div>
  </>);
};

// 13 · "PORTION": el jamón dibujado en 3 partes; las tijeras marcan el centro, el centro se va como bifes y te quedan las puntas
export const PortionCut: P<{ cut: number; sold: number; you: number; bed?: string }> = ({ a, d, cut, sold, you, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const c = eo((f - at(cut)) / 18), s = sp(f, at(sold), 14, 110), y = cl((f - at(you)) / 14);
  const seg = (x: number, w: number, fill: string, dx = 0, dy = 0, r = 0) => <div style={{ position: "absolute", left: x, top: 380, width: w, height: 330, background: fill, borderRadius: 40,
    boxShadow: "0 30px 50px rgba(0,0,0,0.35), inset 0 -20px 30px rgba(120,40,30,0.25)", transform: `translate(${dx}px, ${dy}px) rotate(${r}deg)` }} />;
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 120, color: CRAN, letterSpacing: 6, opacity: cl(f / 10) }}>“PORTION”</div>
    {seg(260, 440, "#D98F7C")}
    {seg(720, 480, "#E5A190", 40 * s, 360 * s, 5 * s)}
    {seg(1220, 440, "#D98F7C")}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {[710, 1210].map((x) => <line key={x} x1={x} y1={340} x2={x} y2={760} stroke={CLOVE} strokeWidth={8} strokeDasharray="20 14" pathLength={1} opacity={c} />)}
    </svg>
    <div style={{ position: "absolute", left: 1290, top: 820, opacity: cl(s * 2), transform: "rotate(-3deg)" }}>
      <div style={{ background: KRAFT, padding: "16px 34px", fontFamily: F, fontWeight: 800, fontSize: 54, color: CLOVE, boxShadow: "0 16px 30px rgba(0,0,0,0.4)" }}>HAM STEAKS</div>
      <Write txt="sold separately" u={cl((f - at(sold) - 8) / 16)} size={60} color={CRAN} />
    </div>
    <div style={{ position: "absolute", left: 300, top: 250, opacity: cl(y * 2) }}>
      <Write txt="you get: the ends + the bone" u={y} size={96} color={INK} />
      <div style={{ height: 8, width: 1100 * ez((f - at(you) - 10) / 14), background: CRAN, borderRadius: 4 }} />
    </div>
  </>);
};

// 14 · mesa redonda vista de arriba: 10 platos aparecen uno a uno, cada uno con su ¾; la cuenta y la etiqueta de la media pata
export const TableTen: P<{ t: number; sum: number; half: number; bed?: string }> = ({ a, d, t, sum, half, bed = "n_tex_wood" }) => {
  const { f, at } = useT(a);
  const cx = 640, cy = 560, su = sp(f, at(sum), 13, 140), hu = sp(f, at(half), 12, 170);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: cx - 340, top: cy - 340, width: 680, height: 680, borderRadius: 340, background: "radial-gradient(circle at 40% 35%, #FFFDF6, #EDE4D2)", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }} />
    {Array.from({ length: 10 }).map((_, i) => {
      const ang = (i / 10) * Math.PI * 2 - Math.PI / 2, x = cx + 260 * Math.cos(ang), y = cy + 260 * Math.sin(ang), u = sp(f, at(t) + i * 3, 12, 180);
      return <div key={i} style={{ position: "absolute", left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: 60, background: "#fff", border: `6px solid ${GREEN}`, boxShadow: "0 8px 14px rgba(0,0,0,0.25)",
        transform: `scale(${u})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 800, fontSize: 52, color: CRAN }}>¾</div>;
    })}
    <div style={{ position: "absolute", left: cx - 120, top: cy - 70, width: 240, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: CLOVE, opacity: cl((f - at(t)) / 10) }}>table of 10</div>
    <div style={{ position: "absolute", left: 1100, top: 300, opacity: cl(su * 2), transform: `translateY(${(1 - su) * 40}px)` }}>
      <div style={{ fontFamily: F, fontWeight: 600, fontSize: 70, color: CREAM, textShadow: "0 6px 20px rgba(0,0,0,0.7)" }}>10 × ¾ lb =</div>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 190, color: GOLD, textShadow: "0 8px 26px rgba(0,0,0,0.7)", lineHeight: 1 }}>7½ lb</div>
    </div>
    <div style={{ position: "absolute", left: 1130, top: 700, transformOrigin: "50% 0", transform: `rotate(${swing(f, at(half), 6) - 3}deg) scale(${hu})` }}>
      <div style={{ background: KRAFT, padding: "22px 40px", fontFamily: HAND, fontWeight: 700, fontSize: 72, color: CLOVE, clipPath: "polygon(8% 0,100% 0,100% 100%,8% 100%,0 50%)", boxShadow: "0 18px 30px rgba(0,0,0,0.45)" }}>half ham · butt end</div>
    </div>
  </>);
};

// 15 · línea de pasos del termómetro: la barra ámbar avanza y cada parada salta en su palabra
export const StepLine: P<{ k: string; steps: { t: number; big: string; txt: string }[]; bed?: string }> = ({ a, d, k, steps, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const n = steps.length, x0 = 220, x1 = 1700, X = (i: number) => x0 + (x1 - x0) * i / (n - 1);
  let prog = 0; steps.forEach((s, i) => { if (f >= at(s.t)) prog = i + (i < n - 1 ? 0 : 0); });
  const pf = steps.reduce((m, s, i) => (f >= at(s.t) ? Math.max(m, i - 1 + ez((f - at(s.t)) / 16)) : m), 0);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={760} h={380} x={580} y={60} u={sp(f, 0, 14, 120)} rot={-1.5} f={f} />
    <div style={{ position: "absolute", left: x0, top: 668, width: x1 - x0, height: 28, borderRadius: 14, background: "rgba(60,40,20,0.25)" }} />
    <div style={{ position: "absolute", left: x0, top: 668, width: (x1 - x0) * Math.max(0, pf) / (n - 1) + 1, height: 28, borderRadius: 14, background: `linear-gradient(90deg, ${AMBER}, ${CRAN})` }} />
    {steps.map((s, i) => { const u = sp(f, at(s.t), 11, 180);
      return <div key={i} style={{ position: "absolute", left: X(i) - 170, top: 560, width: 340, textAlign: "center" }}>
        <div style={{ margin: "0 auto", width: 90, height: 90, borderRadius: 45, background: f >= at(s.t) ? CRAN : "#bfb2a0", border: `8px solid ${CREAM}`, transform: `translateY(66px) scale(${0.7 + 0.3 * u})`, boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }} />
        <div style={{ marginTop: 100, fontFamily: F, fontWeight: 800, fontSize: 100, color: INK, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 30}px)` }}>{s.big}</div>
        <div style={{ display: "flex", justifyContent: "center" }}><Write txt={s.txt} u={cl((f - at(s.t) - 6) / 16)} size={64} color={CRAN} /></div>
      </div>; })}
  </>);
};

// 16 · reloj de cocina de cuerda (rojo) que corre + la foto + la lista de pasos que se tildan
export const Timer: P<{ k: string; head: string; mins?: number; marks: B[]; bed?: string }> = ({ a, d, k, head, mins = 20, marks, bed = "n_tex_steel" }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 13, 130), rot = -360 * (f / Math.max(1, d)) * 0.5;
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={820} h={560} x={100} y={120} u={sp(f, 2, 14, 120)} rot={-2} f={f} />
    <div style={{ position: "absolute", left: 1170, top: 90, width: 560, height: 560, opacity: cl(u * 2), transform: `scale(${0.8 + 0.2 * u})` }}>
      <svg width={560} height={560} viewBox="0 0 560 560">
        <circle cx={292} cy={300} r={250} fill="rgba(0,0,0,0.35)" />
        <circle cx={280} cy={280} r={250} fill={CRAN} />
        <circle cx={280} cy={280} r={200} fill="#FBF8F1" />
        <g transform={`rotate(${rot} 280 280)`}>
          {Array.from({ length: 12 }).map((_, i) => { const t = (i / 12) * 2 * Math.PI; return <g key={i}><line x1={280 + 175 * Math.sin(t)} y1={280 - 175 * Math.cos(t)} x2={280 + 195 * Math.sin(t)} y2={280 - 195 * Math.cos(t)} stroke={INK} strokeWidth={6} />
            <text x={280 + 140 * Math.sin(t)} y={292 - 140 * Math.cos(t)} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={34} fill={INK}>{Math.round(i * mins / 12 * (60 / mins) / 5) * 5}</text></g>; })}
        </g>
        <path d="M 280 60 L 266 96 L 294 96 Z" fill={INK} />
        <circle cx={280} cy={280} r={60} fill={CRAN} /><rect x={262} y={250} width={36} height={60} rx={8} fill="#7d1620" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: -6, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 64, color: CREAM, textShadow: "0 6px 16px rgba(0,0,0,0.7)" }}>{head}</div>
    </div>
    <div style={{ position: "absolute", left: 140, top: 760, display: "flex", gap: 50 }}>
      {marks.map((m, i) => { const q = cl((f - at(m.t)) / 16);
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: cl(q * 3), background: "rgba(251,248,241,0.94)", padding: "10px 26px 10px 14px", boxShadow: "0 14px 24px rgba(0,0,0,0.35)", transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>
          <Mark2 u={cl((f - at(m.t) - 8) / 10)} size={62} /><Write txt={m.txt} u={q} size={58} color={INK} /></div>; })}
    </div>
  </>);
};

// 17 · el rombo: la grilla de cortes se dibuja sobre la grasa de la foto, con las medidas acotadas
export const ScoreGrid: P<{ k: string; t: number; deep: number; apart: number; bed?: string }> = ({ a, d, k, t, deep, apart, bed = "n_tex_wood" }) => {
  const { f, at } = useT(a);
  const g = (i: number) => eo((f - at(t) - i * 2) / 14);
  const L: JSX.Element[] = [];
  for (let i = -6; i <= 8; i++) {
    L.push(<line key={"a" + i} x1={i * 150} y1={0} x2={i * 150 + 700} y2={700} stroke={GOLD} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - g(i + 6)} />);
    L.push(<line key={"b" + i} x1={i * 150 + 700} y1={0} x2={i * 150} y2={700} stroke={GOLD} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - g(i + 8)} />);
  }
  const du = sp(f, at(deep), 12, 160), au = sp(f, at(apart), 12, 160);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={1100} h={680} x={110} y={180} u={sp(f, 0, 14, 120)} rot={-1} f={f}>
      <svg width={1100} height={680} style={{ position: "absolute", left: 0, top: 0, opacity: 0.9 }}>{L}</svg>
    </Photo>
    <div style={{ position: "absolute", left: 1330, top: 260, opacity: cl(du * 2), transform: `translateX(${(1 - du) * 60}px)` }}>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 150, color: CREAM, textShadow: "0 8px 22px rgba(0,0,0,0.7)", lineHeight: 1 }}>¼"</div>
      <Write txt="deep" u={cl((f - at(deep) - 6) / 14)} size={84} color={GOLD} />
    </div>
    <div style={{ position: "absolute", left: 1330, top: 600, opacity: cl(au * 2), transform: `translateX(${(1 - au) * 60}px)` }}>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 150, color: CREAM, textShadow: "0 8px 22px rgba(0,0,0,0.7)", lineHeight: 1 }}>1"</div>
      <Write txt="apart" u={cl((f - at(apart) - 6) / 14)} size={84} color={GOLD} />
    </div>
  </>);
};

// 18 · número de turno de fiambrería (talón rojo) + tarjeta problema tachado → arreglo a mano, con la foto del problema
export const FixStub: P<{ n: number; k: string; prob: string; fix: string; t: number; bed?: string }> = ({ a, d, n, k, prob, fix, t, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 12, 160), x = cl((f - at(t)) / 12);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={760} h={520} x={1050} y={230} u={sp(f, 4, 14, 120)} rot={3} f={f} />
    <div style={{ position: "absolute", left: 120, top: 150, width: 300, height: 220, background: CRAN, transform: `rotate(${-6 + swing(f, 0, 5)}deg) translateY(${(1 - u) * -300}px)`,
      clipPath: "polygon(0 0,100% 0,100% 40%,94% 50%,100% 60%,100% 100%,0 100%,0 60%,6% 50%,0 40%)", boxShadow: "0 18px 30px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: F, fontSize: 22, letterSpacing: 3, color: CREAM, whiteSpace: "nowrap" }}>IF IT GOES WRONG</div>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 120, color: CREAM, lineHeight: 1 }}>{n}</div>
    </div>
    <div style={{ position: "absolute", left: 100, top: 430, width: 920, background: "#FFFDF7", padding: "40px 50px", boxShadow: "0 30px 60px rgba(0,0,0,0.4)", transform: "rotate(-1deg)", opacity: cl(u * 2) }}>
      <div style={{ position: "relative", display: "inline-block", fontFamily: F, fontWeight: 800, fontSize: 96, color: INK, textTransform: "uppercase" }}>{prob}
        <div style={{ position: "absolute", left: -8, top: "54%", height: 10, width: `${100 * ez(x)}%`, background: CRAN, borderRadius: 5 }} /></div>
      <div style={{ marginTop: 26 }}><Write txt={"→ " + fix} u={cl((f - at(t) - 8) / 24)} size={70} color={GREEN} w={820} /></div>
    </div>
  </>);
};

// 19 · tarjeta de comentario (cierre): la pregunta del canal sobre papel + la foto de Mickey
export const CommentCard: P<{ k: string; q: string; t: number; sub: number; sub_txt: string; bed?: string }> = ({ a, d, k, q, t, sub, sub_txt, bed = "n_tex_paper" }) => {
  const { f, at } = useT(a);
  const u = sp(f, Math.max(0, at(t) - 6), 14, 120);
  return shell(<>
    <Tex k={bed} f={f} T={d} />
    <Photo k={k} w={640} h={420} x={1150} y={140} u={sp(f, 0, 14, 120)} rot={4} f={f} />
    <div style={{ position: "absolute", left: 130, top: 300, width: 980, background: "#fff", borderRadius: 26, padding: "40px 50px", boxShadow: "0 36px 70px rgba(0,0,0,0.45)", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 60}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, background: GREEN, color: CREAM, fontFamily: F, fontWeight: 800, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>M</div>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 38, color: "#555" }}>Mickey's Butcher Shop · asks</div>
      </div>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 76, color: INK, marginTop: 24, lineHeight: 1.1 }}>{q}</div>
      <div style={{ fontFamily: HAND, fontSize: 66, color: CRAN, marginTop: 14, opacity: cl((f - at(sub)) / 10) }}>{sub_txt}</div>
    </div>
  </>);
};
