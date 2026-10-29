// lou29 · EL VIDEO ENTERO (locución 0 → final). Un solo mundo (el diner Blue Moon de noche: plancha, barra, tablero de letras,
// vitrina de pasteles) y una sola cámara; el avatar entra y sale con CORTE SECO en sus ventanas pagadas; Veo / fotos / platos por
// tramos anclados a su frase (plan_lou.py); un componente único por minuto (heroes.json). Audio fuera de Remotion (encfin).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import HEROES from "./heroes.json";
import { COL, FONT, LowerThird, Vid, e } from "./lib";
import { Avatar, OK, Shot, WIN, World } from "./parts";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { H, phys, cl, eIn, TX, DIM, AMB, MARK, HAND } from "./hkit";
import { HC1 } from "./lou_h1";
import { HC2 } from "./lou_h2";
import { HC3 } from "./lou_h3";
import { R3X } from "./lou_c3d";
import nudgeList from "./nudge.json";
const NUDGE = new Set<number>(nudgeList as number[]);
import { preload } from "./props3d";

type Seg = [number, number, string, string];
type Ov = { k: string; at: number; out: number; [x: string]: any };
type Item = { n: number; name: string; price: string; at: number; end: number };
const PL = PLAN as unknown as { segs: Seg[]; ov: Ov[]; items: Item[]; end: number; lower: [number, number]; cta: { sub: number; ask: number; end: number; coffee: number } };
export const END = PL.end;

// ===== la BASE: Veo (8 s con su movimiento), foto con zoom lento, o el diner 3D =====
const base = (t: number): React.ReactNode => {
  const g = PL.segs.find(([a, b]) => t >= a && t < b);
  if (!g) return <World t={t} />;
  const [a, , k, id] = g;
  if (k === "veo") return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.03 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : <World t={t} />;
  if (k === "shot") return <Shot k={id} t={t} a={a} />;
  return <World t={t} />;
};
const Stage: React.FC<{ t: number }> = ({ t }) => (WIN.some((x) => t >= x.ms && t < x.me) ? <Avatar t={t} /> : <>{base(t)}</>);
const nowAv = (t: number) => WIN.some((w) => t >= w.ms && t < w.me);

// foto más cercana a un segundo (fondo desenfocado de cada componente)
const imgNear = (t: number, used: Set<string>): string | undefined => {
  let best: string | undefined, bd = 40;
  for (const [a, b, k, id] of PL.segs) { if (k !== "shot" || used.has(id)) continue; const d = t < a ? a - t : t > b ? t - b : 0; if (d < bd) { bd = d; best = id; } }
  if (best) used.add(best); return best;
};
const HC: Record<string, React.FC<{ t: number; h: H }>> = { ...HC1, ...HC2, ...HC3, ...R3X };
const HS: H[] = (HEROES as H[]).map((h) => {
  const out: H = { ...h, bg: imgNear(h.at + 1, new Set()) };
  if (h.k === "ticketRail") out.items = PL.items.map((it, i) => ({ n: it.n, price: it.price, at: h.at + 0.4 + i * ((h.out - h.at - 1.6) / 15) }));
  return out;
});
preload(HS.map((h) => h.bg).filter((x): x is string => !!x));   // fondos desenfocados de los componentes 3D
const heroOn = (t: number) => HS.some((h) => t > h.at - 0.3 && t < h.out + 0.6);
const Heroes: React.FC<{ t: number }> = ({ t }) => <>{HS.map((h, i) => { const C = HC[h.k]; return C && t > h.at - 0.1 && t < h.out + 0.9 ? <C key={i} t={t} h={h} /> : null; })}</>;

// ===== el número de cada plato: plaqueta de menú esmaltada que baja colgada de dos cadenas (sobre el avatar, chica y a la izquierda) =====
const ItemTag: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  if (t < o.at - 0.1 || t > o.out + 0.9 || heroOn(t)) return null;
  const s = phys(t, o.at, 6, 0.38), x = eIn(t, o.out, o.out + 0.7), av = nowAv(o.at + 1);
  const sw = 3 * Math.sin((t - o.at) * 2.2) * Math.exp(-(t - o.at) * 0.6);
  return <div style={{ position: "absolute", left: av ? 70 : 960 - 330, top: av ? 60 : 120, transformOrigin: "50% -200px", transform: `translateY(${(1 - s) * -420 - x * 420}px) rotate(${sw}deg) scale(${av ? 0.72 : 1})`, opacity: cl(s * 3) * (1 - x), fontFamily: FONT }}>
    {[90, 570].map((cx) => <div key={cx} style={{ position: "absolute", left: cx, top: -200, width: 6, height: 210, background: "repeating-linear-gradient(#c9ced4 0 10px,#6d727a 10px 16px)" }} />)}
    <div style={{ width: 660, padding: "22px 36px", borderRadius: 18, background: "linear-gradient(#fbf6ea,#e7dcc6)", border: "8px solid #b3241b", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 3px #fbf6ea", display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ width: 130, height: 130, borderRadius: "50%", background: "#b3241b", color: "#fbf6ea", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MARK, fontSize: 66, flexShrink: 0 }}>{o.n}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 900, fontSize: 52, color: "#1d2440", lineHeight: 1, letterSpacing: 1 }}>{o.name}</div>
        <div style={{ fontFamily: HAND, fontSize: 60, color: "#b3241b", marginTop: 6 }}>{o.price}</div>
      </div>
    </div>
  </div>;
};

// ===== CTA (sin guía): la campanita del mostrador para suscribirse, la pregunta en una comanda, y el café de despedida =====
const CTA: React.FC<{ t: number }> = ({ t }) => {
  const c = PL.cta;
  const sub = phys(t, c.sub, 6, 0.42) * (1 - eIn(t, c.ask - 0.2, c.ask + 0.5));
  const ask = phys(t, c.ask, 6, 0.42) * (1 - eIn(t, c.end - 0.6, c.end));
  const cof = phys(t, c.coffee - 0.2, 5, 0.5);
  const ring = Math.max(0, 1 - Math.abs(t - c.sub - 1.2) * 3) * Math.sin(t * 40) * 10;
  const left = nowAv(c.sub + 1);
  return <>
    {sub > 0.01 && <div style={{ position: "absolute", left: left ? 90 : 760, bottom: 90, display: "flex", alignItems: "center", gap: 26, opacity: cl(sub * 2), transform: `translateY(${(1 - sub) * 120}px)`, fontFamily: FONT }}>
      <div style={{ width: 150, height: 110, position: "relative", transform: `rotate(${ring}deg)` }}><div style={{ position: "absolute", left: 10, right: 10, top: 10, bottom: 18, borderRadius: "75px 75px 6px 6px", background: "linear-gradient(90deg,#8a6a22,#f0d27a 35%,#b38a2e)" }} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 20, borderRadius: 6, background: "#2a2522" }} /></div>
      <div style={{ padding: "18px 34px", borderRadius: 14, background: "#b3241b", color: "#fbf6ea", fontWeight: 900, fontSize: 46, letterSpacing: 2, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>SUBSCRIBE · 15 MORE</div>
    </div>}
    {ask > 0.01 && <div style={{ position: "absolute", left: left ? 90 : 1180, top: 160, width: 520, padding: "34px 38px", background: "linear-gradient(#fffdf6,#efe7d4)", borderRadius: "6px 6px 14px 14px", boxShadow: "0 30px 60px rgba(0,0,0,.55)", transformOrigin: "50% 0", transform: `translateY(${(1 - ask) * -300}px) rotate(${2 * Math.sin(t * 1.3)}deg)`, opacity: cl(ask * 2) }}>
      <div style={{ fontWeight: 900, fontSize: 26, letterSpacing: 4, color: "#8a8270" }}>TELL ME BELOW</div>
      <div style={{ fontFamily: HAND, fontSize: 64, color: "#26324f", lineHeight: 1.05, marginTop: 10 }}>Your diner's plate — and what it cost?</div>
    </div>}
    {t > c.coffee - 0.3 && <div style={{ position: "absolute", left: 960, top: 600, transform: `translate(-50%,-50%) translateY(${(1 - cof) * 200}px) scale(${0.8 + 0.2 * cof})`, opacity: cl(cof * 2) }}>
      <div style={{ width: 260, height: 220, borderRadius: "0 0 90px 90px", background: "linear-gradient(90deg,#d9d4ca,#fff 35%,#cfc8bb)", position: "relative", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}><div style={{ position: "absolute", right: -70, top: 40, width: 90, height: 110, borderRadius: "50%", border: "22px solid #e9e4da" }} /><div style={{ position: "absolute", left: 14, right: 14, top: 8, height: 40, borderRadius: "50%", background: "#2a1306" }} /></div>
      <div style={{ textAlign: "center", fontFamily: MARK, fontSize: 60, color: AMB, marginTop: 30, whiteSpace: "nowrap", textShadow: "0 10px 30px rgba(0,0,0,.7)" }}>COFFEE'S ON ME</div>
    </div>}
  </>;
};

export const Body: React.FC = () => {
  // cuadros donde el 3D salía con un cuadro roto en el farm (swangle): se dibujan medio cuadro corrido
  const fr = useCurrentFrame(), t = (fr + (NUDGE.has(fr) ? 0.5 : 0)) / 30;
  const fade = e(t, END - 1.2, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    {/* cámara a mano virtual (balanceo lento, no temblor) sobre todo lo filmado */}
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    <LowerThird t={t} at={PL.lower[0]} out={PL.lower[1]} name="LOU" l2="NIGHT GRILL · BLUE MOON 1970-78" l2at={PL.lower[0] + 1} />
    {PL.ov.filter((o) => o.k === "item").map((o, i) => <ItemTag key={i} t={t} o={o} />)}
    <Heroes t={t} />
    <CTA t={t} />
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};
