// lcf2510a · piezas copiadas del molde ck2510d/ui.tsx (nivel nuevo); antes: ck2510d · 2ª pasada de piezas (26-oct, pedido del creador: "calidad impresionante, profesional, con profundidad; el
// cartel rojo en toda la pantalla queda trucho y tapa el avatar → un zócalo de noticiero abajo a la izquierda").
// Un solo lenguaje: papel crema de libro de iglesia + vino + dorado, serif DM Serif Display para lo que se lee lindo,
// Inter para las etiquetas. Todo lo que es texto vive en el ZÓCALO (abajo-izq, apilable); lo demás va a los costados,
// nunca sobre la cara (el avatar está al centro).
import React from "react";
import { loadFont as loadSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { e, spr } from "../kits/yanqui3d/lib";

export const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
export const { fontFamily: SANS } = loadSans("normal", { weights: ["500", "700", "800", "900"], subsets: ["latin"] });
export const { fontFamily: HAND } = loadHand("normal", { weights: ["600", "700"], subsets: ["latin"] });
export const C = { cream: "#fbf3e4", paper: "#f3e5cb", ink: "#22150d", wine: "#8e1d2b", wineD: "#4d0c16", gold: "#e3b25c", goldL: "#f8dda4", red: "#d8392b", rule: "rgba(70,110,170,.22)" };

const cl = (x: number) => Math.min(1, Math.max(0, x));
const inOut = (t: number, a: number, out: number, fi = 0.35, fo = 0.4) => e(t, a, a + fi) * (1 - e(t, out, out + fo));
// sombra en capas = profundidad (contacto + ambiente + borde de luz arriba)
const DEPTH = "0 1px 0 rgba(255,255,255,.55) inset, 0 -2px 0 rgba(0,0,0,.12) inset, 0 3px 6px rgba(0,0,0,.28), 0 18px 34px rgba(0,0,0,.38), 0 42px 80px rgba(0,0,0,.28)";
const goldText = (deep = 10, sheen = -1): React.CSSProperties => ({
  background: `${sheen > 0 && sheen < 1 ? `linear-gradient(112deg, rgba(255,255,255,0) ${sheen * 150 - 40}%, rgba(255,255,255,.95) ${sheen * 150 - 30}%, rgba(255,255,255,0) ${sheen * 150 - 20}%), ` : ""}linear-gradient(180deg, #fff3cf 0%, ${C.goldL} 28%, ${C.gold} 58%, #a8722a 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
  filter: `drop-shadow(0 ${Math.round(deep / 3)}px 0 #6a3f12) drop-shadow(0 ${deep}px ${deep * 1.6}px rgba(0,0,0,.55))`,
});

// ===================================================== ZÓCALO =====================================================
export type ZTone = "tip" | "note" | "warn" | "name" | "list" | "book";
export type ZItem = { key: string; a: number; out: number; tone: ZTone; label: string; txt: string; sub?: string; items?: { at: number; txt: string }[]; n?: number };
export const ZH: Record<ZTone, number> = { tip: 132, note: 132, warn: 132, name: 150, list: 132, book: 190 };
const TONE: Record<ZTone, { tab: string; tabInk: string; mark: string }> = {
  tip: { tab: `linear-gradient(180deg, ${C.wine}, ${C.wineD})`, tabInk: C.goldL, mark: C.wine },
  note: { tab: `linear-gradient(180deg, #3a2a1c, #1f150d)`, tabInk: C.goldL, mark: C.gold },
  warn: { tab: `linear-gradient(180deg, #e2483a, #8f1a12)`, tabInk: "#fff", mark: C.red },
  name: { tab: `linear-gradient(180deg, #3a2a1c, #1f150d)`, tabInk: C.goldL, mark: C.gold },
  list: { tab: `linear-gradient(180deg, ${C.wine}, ${C.wineD})`, tabInk: C.goldL, mark: C.gold },
  book: { tab: `linear-gradient(180deg, ${C.wine}, ${C.wineD})`, tabInk: C.goldL, mark: C.gold },
};

// el librito 3D (tapa vino con dorado, lomo y canto de hojas) que asoma del zócalo del libro
const Book3D: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = spr(t, a + 0.15, 0.9), ry = -32 + 10 * Math.sin((t - a) * 0.9), lift = (1 - Math.min(1, k)) * 60;
  const W = 134, H = 178, D = 26;
  return (
    <div style={{ position: "absolute", left: 18, bottom: 28, width: W, height: H, perspective: 900, transform: `translateY(${lift}px)`, opacity: cl(k * 2) }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${ry}deg) rotateX(8deg)` }}>
        {/* canto de las hojas */}
        <div style={{ position: "absolute", left: W - D / 2, top: 4, width: D, height: H - 8, transform: `rotateY(90deg)`, background: "repeating-linear-gradient(0deg,#f6ecd6 0 2px,#e2d3b4 2px 3px)" }} />
        {/* lomo */}
        <div style={{ position: "absolute", left: -D / 2, top: 0, width: D, height: H, transform: `rotateY(-90deg)`, background: `linear-gradient(90deg, ${C.wineD}, #6e1520)` }} />
        {/* tapa */}
        <div style={{ position: "absolute", inset: 0, transform: `translateZ(${D / 2}px)`, borderRadius: "3px 8px 8px 3px", background: `radial-gradient(120% 90% at 30% 20%, #a82a39, ${C.wine} 45%, ${C.wineD})`, boxShadow: "0 20px 40px rgba(0,0,0,.55)", border: `2px solid ${C.gold}`, outline: `1px solid ${C.gold}66`, outlineOffset: -9, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 10 }}>
          <div style={{ fontFamily: SERIF, fontSize: 22, lineHeight: 1.05, ...goldText(2) }}>Supper<br />for One</div>
          <div style={{ width: 26, height: 26, marginTop: 8, borderRadius: 13, border: `1.5px solid ${C.gold}`, color: C.gold, fontFamily: SERIF, fontSize: 16, lineHeight: "24px" }}>✝</div>
        </div>
      </div>
    </div>
  );
};

// ícono de cada tono (cuchara de madera = truco, porción de pastel = nota, triángulo = error, cruz = la mujer que lo horneaba)
const ZIcon: React.FC<{ tone: ZTone; col: string; k: number }> = ({ tone, col, k }) => {
  if (tone === "list" || tone === "book") return null;
  return (
    <div style={{ alignSelf: "center", marginLeft: 18, width: 58, height: 58, flex: "0 0 58px", borderRadius: 29, transform: `scale(${Math.min(1.08, k)}) rotate(${(1 - Math.min(1, k)) * -40}deg)`, opacity: cl(k * 2),
      background: "radial-gradient(circle at 35% 30%, #fffdf7, #efe0c2 70%, #dcc59a)", boxShadow: "0 2px 0 rgba(255,255,255,.8) inset, 0 -3px 6px rgba(120,80,30,.25) inset, 0 6px 12px rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={34} height={34} viewBox="0 0 34 34" fill="none" stroke={col} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        {tone === "tip" && <><ellipse cx={11} cy={10} rx={6} ry={8} transform="rotate(-40 11 10)" fill={col} fillOpacity={0.18} /><path d="M15 15 L28 29" strokeWidth={3.4} /></>}
        {tone === "note" && <><path d="M5 26 L29 26 L17 6 Z" fill={col} fillOpacity={0.2} /><path d="M5 26 Q17 31 29 26" strokeWidth={3.4} /><path d="M12 19 L14 17 M19 19 L21 17" /></>}
        {tone === "warn" && <><path d="M17 4 L31 29 L3 29 Z" fill={col} fillOpacity={0.18} /><path d="M17 13 L17 20" strokeWidth={3.4} /><circle cx={17} cy={24.5} r={1.6} fill={col} /></>}
        {tone === "name" && <path d="M17 5 L17 29 M9 13 L25 13" strokeWidth={3.2} />}
      </svg>
    </div>
  );
};

const Zocalo: React.FC<{ t: number; z: ZItem; y: number }> = ({ t, z, y }) => {
  const { a, out, tone } = z;
  if (t < a - 0.05 || t > out + 0.6) return null;
  const T = TONE[tone];
  const kIn = spr(t, a, 0.85), kTab = e(t, a, a + 0.32), kBar = e(t, a + 0.1, a + 0.55), kLine = e(t, a + 0.35, a + 0.9);
  const kOut = e(t, out, out + 0.45);
  const ry = (1 - Math.min(1, kIn)) * -38 + kOut * 30;                      // entra girando desde la izquierda (bisagra en el borde)
  const sweep = e(t, a + 0.45, a + 1.25);                                      // brillo que cruza una vez
  const book = tone === "book";
  const size = z.txt.length > 40 ? 42 : z.txt.length > 30 ? 48 : 54;
  const left = book ? 186 : 0, kIcon = spr(t, a + 0.35, 1.1), kPlate = e(t, a + 0.2, a + 0.7);
  return (
    <div style={{ position: "absolute", left: 70, bottom: y, perspective: 1400, opacity: 1 - kOut }}>
      <div style={{ transformOrigin: "0% 50%", transform: `rotateY(${ry}deg) translateX(${-kOut * 60}px)`, transformStyle: "preserve-3d" }}>
        {book && <Book3D t={t} a={a} />}
        {/* pestaña */}
        <div style={{ marginLeft: left, display: "inline-flex", alignItems: "center", gap: 12, padding: "9px 20px 9px 16px", borderRadius: "10px 10px 0 0", background: T.tab, color: T.tabInk, fontFamily: SANS, fontWeight: 800, fontSize: 25, letterSpacing: 4.5, clipPath: `inset(0 ${100 - kTab * 100}% 0 0)`, boxShadow: "0 1px 0 rgba(255,255,255,.18) inset" }}>
          {tone === "warn" ? <span style={{ display: "inline-flex", width: 26, height: 26, borderRadius: 13, background: "#fff", color: C.red, fontWeight: 900, fontSize: 18, alignItems: "center", justifyContent: "center", letterSpacing: 0 }}>{z.n ?? "!"}</span>
            : <span style={{ width: 9, height: 9, borderRadius: 5, background: C.gold, boxShadow: `0 0 10px ${C.gold}` }} />}
          {z.label}
        </div>
        {/* barra de papel, con una segunda hoja color vino asomando detrás (profundidad) */}
        <div style={{ position: "relative", marginLeft: left, width: "fit-content" }}>
        <div style={{ position: "absolute", left: 12, right: -12, top: 12, bottom: -12, borderRadius: "0 14px 14px 14px", background: `linear-gradient(180deg, ${tone === "warn" ? C.red : C.wine}, ${C.wineD})`, opacity: 0.92, clipPath: `inset(0 ${100 - kPlate * 100}% 0 0 round 0 14px 14px 14px)`, boxShadow: "0 18px 30px rgba(0,0,0,.35)" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "stretch", minHeight: book ? 108 : 86, borderRadius: "0 14px 14px 14px", background: `linear-gradient(180deg, #fffaf0 0%, ${C.cream} 40%, ${C.paper} 100%)`, boxShadow: DEPTH, clipPath: `inset(0 ${100 - kBar * 100}% 0 0 round 0 14px 14px 14px)`, overflow: "hidden" }}>
          <div style={{ width: 12, background: `linear-gradient(180deg, ${T.mark}, ${T.mark}cc)` }} />
          <ZIcon tone={tone} col={T.mark} k={kIcon} />
          <div style={{ padding: tone === "name" ? "12px 34px 14px 24px" : "14px 38px 14px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {tone === "name" ? <>
              <div style={{ fontFamily: SERIF, fontSize: 62, color: C.ink, lineHeight: 1, letterSpacing: 0.5 }}>{z.txt}</div>
              {z.sub && <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.wine, marginTop: 8, opacity: e(t, a + 0.6, a + 0.9) }}>{z.sub}</div>}
            </> : tone === "book" ? <>
              <div style={{ fontFamily: SERIF, fontSize: 60, color: C.ink, lineHeight: 1.02 }}>{z.txt}</div>
              {z.sub && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: 3.5, color: C.wine, marginTop: 8, opacity: e(t, a + 0.6, a + 0.9) }}>{z.sub}</div>}
            </> : tone === "list" && z.items ? (
              <div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: SANS, fontWeight: 800, fontSize: 46, color: C.ink, whiteSpace: "nowrap" }}>
                {z.items.map((it, i) => {
                  const k = e(t, it.at, it.at + 0.35);
                  return <React.Fragment key={i}>{i > 0 && <span style={{ width: 10, height: 10, borderRadius: 5, background: C.gold, opacity: k }} />}<span style={{ opacity: k, transform: `translateY(${(1 - k) * 16}px)`, display: "inline-block" }}>{it.txt}</span></React.Fragment>;
                })}
              </div>
            ) : (
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, color: tone === "warn" ? "#2a0d08" : C.ink, letterSpacing: 0.6, whiteSpace: "nowrap", lineHeight: 1.05 }}>{z.txt}</div>
            )}
          </div>
          {/* brillo de entrada + línea dorada que se dibuja */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + sweep * 140}%`, width: "22%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent)", opacity: sweep > 0 && sweep < 1 ? 1 : 0 }} />
          <div style={{ position: "absolute", left: 12, bottom: 0, height: 4, width: `${kLine * 100}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.goldL}, ${C.gold}00)` }} />
        </div>
        </div>
      </div>
    </div>
  );
};

// apila los zócalos que se pisan (el 2º sube encima del 1º) y los dibuja
export const ZocaloStack: React.FC<{ t: number; items: ZItem[] }> = ({ t, items }) => {
  const list = [...items].sort((p, q) => p.a - q.a);
  const lvl: number[] = [];
  list.forEach((z, i) => {
    let y = 0;
    for (let j = 0; j < i; j++) if (list[j].out + 0.5 > z.a && lvl[j] + ZH[list[j].tone] + 18 > y) y = lvl[j] + ZH[list[j].tone] + 18;
    lvl.push(y > 2 * 160 ? 0 : y);
  });
  return <>{list.map((z, i) => <Zocalo key={z.key} t={t} z={z} y={64 + lvl[i]} />)}</>;
};

// ================================================ TÍTULO DEL PASTEL ================================================
// número dorado enorme con relieve a la izquierda (el avatar queda libre al centro), "PIE ONE OF NINE", nombre en serif
const NUM = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"];
export const PieTitle: React.FC<{ t: number; at: number; out: number; n: number; name: string }> = ({ t, at, out, n, name }) => {
  if (t < at - 0.05 || t > out + 0.6) return null;
  const o = inOut(t, at, out, 0.3, 0.45), kN = spr(t, at, 0.8), kL = e(t, at + 0.25, at + 0.6), kName = e(t, at + 0.4, at + 0.9), kRule = e(t, at + 0.6, at + 1.3);
  const drift = (t - at) * 6;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(14,8,4,.8) 0%, rgba(14,8,4,.55) 24%, rgba(14,8,4,0) 44%)" }} />
      <div style={{ position: "absolute", left: 96 - drift, top: 150, perspective: 1200 }}>
        <div style={{ transform: `rotateY(${(1 - Math.min(1, kN)) * 40 + 10}deg)`, transformOrigin: "0% 50%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, maxWidth: 700 }}>
          <div style={{ fontFamily: SERIF, fontSize: 260, lineHeight: 0.82, ...goldText(14, e(t, at + 0.5, at + 1.5)), transform: `scale(${0.7 + 0.3 * Math.min(1.05, kN)})`, transformOrigin: "0% 70%" }}>{n}</div>
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: 7, color: C.goldL, opacity: kL, transform: `translateX(${(1 - kL) * -24}px)` }}>SUPPER {NUM[n]} OF TEN</div>
            <div style={{ fontFamily: SERIF, fontSize: 86, color: C.cream, lineHeight: 1, marginTop: 10, textShadow: "0 3px 0 rgba(0,0,0,.35), 0 14px 34px rgba(0,0,0,.6)", opacity: kName, transform: `translateY(${(1 - kName) * 22}px)` }}>{name.replace(/\b(\w)(\w*)/g, (_, f, r) => f + r.toLowerCase())}</div>
            <div style={{ height: 3, marginTop: 18, width: 420 * kRule, background: `linear-gradient(90deg, ${C.gold}, ${C.gold}00)` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================ FICHA DE LA CENA (arriba-der, mientras dura: página real + precio por plato) ============================
export const SupBadge: React.FC<{ t: number; at: number; out: number; n: number; name: string; page: number; price: string }> = ({ t, at, out, n, name, page, price }) => {
  if (t < at - 0.05 || t > out + 0.5) return null;
  const o = inOut(t, at, out, 0.4, 0.4), k = e(t, at, at + 0.5), kp = spr(t, at + 0.35, 1.1);
  return (
    <div style={{ position: "absolute", right: 58, top: 50, opacity: o, transformOrigin: "100% 0%", transform: `translateY(${(1 - k) * -24}px) scale(1.1)`, display: "flex", alignItems: "center", gap: 16, padding: "12px 18px 12px 14px", borderRadius: 20, background: "linear-gradient(180deg, rgba(40,26,16,.86), rgba(20,12,7,.9))", boxShadow: `0 1px 0 rgba(255,255,255,.12) inset, 0 16px 34px rgba(0,0,0,.5), 0 0 0 1.5px ${C.gold}55` }}>
      <svg width={62} height={62} viewBox="0 0 62 62">
        {Array.from({ length: 10 }, (_, i) => { const ang = (i / 10) * Math.PI * 2 - Math.PI / 2, on = i < n, cur = i === n - 1; return <circle key={i} cx={31 + 23 * Math.cos(ang)} cy={31 + 23 * Math.sin(ang)} r={cur ? 5.5 : 4} fill={on ? C.gold : "rgba(255,255,255,.18)"} style={cur ? { filter: `drop-shadow(0 0 5px ${C.gold})` } : undefined} />; })}
        <text x={31} y={39} textAnchor="middle" fontFamily={SERIF} fontSize={24} fill={C.goldL}>{n}</text>
      </svg>
      <div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 17, letterSpacing: 4, color: C.gold }}>SUPPER {n} OF 10 · PAGE {page}</div>
        <div style={{ fontFamily: SERIF, fontSize: 32, color: C.cream, lineHeight: 1.05, whiteSpace: "nowrap" }}>{name.replace(/(\w)(\w*)/g, (_, f, r) => f + r.toLowerCase()).replace(/ & /g, " & ")}</div>
      </div>
      <div style={{ marginLeft: 6, padding: "8px 14px", borderRadius: 14, background: `linear-gradient(180deg, ${C.wine}, ${C.wineD})`, boxShadow: `0 1px 0 rgba(255,255,255,.18) inset, 0 8px 18px rgba(0,0,0,.4), 0 0 0 1.5px ${C.gold}66`, textAlign: "center", transform: `scale(${0.6 + 0.4 * Math.min(1.06, kp)})`, opacity: cl(kp * 2) }}>
        <div style={{ fontFamily: SERIF, fontSize: 36, lineHeight: 1, ...goldText(3) }}>{price}</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 13, letterSpacing: 3, color: C.goldL, marginTop: 3 }}>A PLATE</div>
      </div>
    </div>
  );
};

// ============================ TARJETA DE RECETA (a la derecha, como las fichas de la iglesia) ============================
export const RecipeCard: React.FC<{ t: number; title: string; rows: { at: number; txt: string }[]; out: number }> = ({ t, title, rows, out }) => {
  const a = rows[0].at - 0.4;
  if (t < a - 0.05 || t > out + 0.6) return null;
  const o = inOut(t, a, out, 0.3, 0.45), k = spr(t, a, 0.75), drift = Math.sin((t - a) * 0.6) * 1.5;
  const shown = rows.filter((r) => t >= r.at - 0.05).length;
  const RH = 58, H = 128 + Math.max(1, rows.length) * RH;
  return (
    <div style={{ position: "absolute", right: 70, top: 190, perspective: 1500, opacity: o }}>
      <div style={{ position: "relative", transformOrigin: "100% 50%", transform: `rotateY(${(1 - Math.min(1, k)) * 55 - 9 + drift}deg) rotateZ(${1.4 - (1 - Math.min(1, k)) * 4}deg) translateY(${(1 - Math.min(1, k)) * 40}px)` }}>
      <div style={{ width: 560, height: H, borderRadius: 10, position: "relative", overflow: "hidden",
        background: `linear-gradient(180deg, transparent 0 102px, ${C.rule} 102px 104px, transparent 104px) , repeating-linear-gradient(180deg, transparent 0 ${RH - 2}px, ${C.rule} ${RH - 2}px ${RH}px) 0 104px / 100% 100% no-repeat, linear-gradient(170deg, #fffdf6, #f7ecd6 60%, #efdfc0)`,
        boxShadow: "0 2px 0 rgba(255,255,255,.7) inset, 0 4px 8px rgba(0,0,0,.25), 0 26px 50px rgba(0,0,0,.45), 0 60px 90px rgba(0,0,0,.25)" }}>
        <svg width={560} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.16 }}><filter id="grano"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={7} /><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .32  0 0 0 0 .18  0 0 0 1 0" /></filter><rect width="100%" height="100%" filter="url(#grano)" /></svg>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0) 60%, rgba(120,80,30,.12))" }} />
        <div style={{ position: "absolute", left: 62, top: 0, bottom: 0, width: 2, background: "rgba(200,60,60,.45)" }} />
        <div style={{ position: "absolute", right: 0, bottom: 0, width: 54, height: 54, background: "linear-gradient(135deg, rgba(0,0,0,0) 50%, rgba(90,60,25,.22) 50%, #e9d6b0 62%, #f7ecd6 100%)", boxShadow: "-4px -4px 10px rgba(0,0,0,.12)" }} />
        <div style={{ position: "absolute", left: 82, right: 24, top: 26, fontFamily: SERIF, fontSize: title.length > 22 ? 32 : 40, color: C.wine, lineHeight: 1.05, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title.replace(/\b(\w)(\w*)/g, (_, f, r) => f + r.toLowerCase()).replace(/ · Page (\d+)/, " · page $1").replace(/(\d)–(\d) Pies/, "$1–$2 pies")}</div>
        <div style={{ position: "absolute", left: 84, top: 74, fontFamily: SANS, fontWeight: 700, fontSize: 15, letterSpacing: 4, color: "rgba(60,40,25,.55)" }}>FROM SUPPER FOR ONE</div>
        {rows.map((r, i) => {
          const kr = e(t, r.at, r.at + 0.35), kc = e(t, r.at + 0.15, r.at + 0.5), cur = i === shown - 1;
          return (
            <div key={i} style={{ position: "absolute", left: 18, right: 20, top: 104 + i * RH, height: RH, display: "flex", alignItems: "center", opacity: kr, transform: `translateX(${(1 - kr) * 30}px)` }}>
              <svg width={34} height={34} viewBox="0 0 34 34" style={{ marginRight: 30 }}>
                <circle cx={17} cy={17} r={13} fill="none" stroke={C.wine} strokeOpacity={0.35} strokeWidth={2} />
                <path d="M10 18 L15 23 L25 11" fill="none" stroke={C.wine} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={26} strokeDashoffset={26 * (1 - kc)} />
              </svg>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: r.txt.length > 26 ? 34 : 40, color: cur ? "#1c2f63" : "#2b3a62", whiteSpace: "nowrap", letterSpacing: 0.3 }}>{r.txt.toLowerCase().replace(/\b(tsp|tbsp|lb|in)\b/g, (m) => m).replace(/^(\S)/, (m) => m.toUpperCase())}</div>
            </div>
          );
        })}
      </div>
      {/* cinta de papel que la sostiene */}
      <div style={{ position: "absolute", left: 210, top: -18, width: 150, height: 40, transform: "rotate(-4deg)", background: "linear-gradient(180deg, rgba(240,226,190,.85), rgba(222,204,160,.8))", boxShadow: "0 3px 6px rgba(0,0,0,.18)", clipPath: "polygon(3% 0, 97% 4%, 100% 50%, 96% 100%, 2% 96%, 0 50%)" }} />
      </div>
    </div>
  );
};

// ================================ NÚMERO GRANDE (dorado con relieve, cuenta hasta su valor) ================================
export const Stat: React.FC<{ t: number; at: number; out: number; text: string; sub?: string; x?: number; y?: number; size?: number }> = ({ t, at, out, text, sub, x = 330, y = 300, size = 230 }) => {
  if (t < at - 0.05 || t > out + 0.6) return null;
  const o = inOut(t, at, out, 0.25, 0.4), k = spr(t, at, 0.85), kc = e(t, at, at + 0.9), ks = e(t, at + 0.35, at + 0.7);
  const m = /^\d+$/.exec(text); const v = m ? parseInt(text) : 0;
  const shown = m ? String(Math.round(v > 1800 && v < 2100 ? 1900 + (v - 1900) * kc : v * kc)) : text;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%)`, opacity: o, textAlign: "center", perspective: 1000 }}>
      <div style={{ position: "absolute", left: "50%", top: "45%", width: size * 3, height: size * 1.6, transform: "translate(-50%,-50%)", background: "radial-gradient(closest-side, rgba(10,6,3,.55), rgba(10,6,3,0))" }} />
      <div style={{ position: "relative", fontFamily: SERIF, fontSize: size, lineHeight: 0.9, ...goldText(12, e(t, at + 0.6, at + 1.6)), transform: `rotateX(${(1 - Math.min(1, k)) * 50}deg) scale(${0.75 + 0.25 * Math.min(1.04, k)})`, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{shown}</div>
      {sub && <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 14, opacity: ks }}>
        <span style={{ width: 60 * ks, height: 2, background: `linear-gradient(90deg, ${C.gold}00, ${C.gold})` }} /><span style={{ width: 9, height: 9, background: C.gold, transform: "rotate(45deg)", boxShadow: `0 0 8px ${C.gold}` }} />
        <div style={{ position: "relative", display: "inline-block", padding: "8px 20px", borderRadius: 30, background: `linear-gradient(180deg, ${C.wine}, ${C.wineD})`, color: C.goldL, fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: 4, opacity: ks, transform: `translateY(${(1 - ks) * 14}px)`, boxShadow: "0 10px 24px rgba(0,0,0,.45)", whiteSpace: "nowrap" }}>{sub}</div>
        <span style={{ width: 9, height: 9, background: C.gold, transform: "rotate(45deg)", boxShadow: `0 0 8px ${C.gold}` }} /><span style={{ width: 60 * ks, height: 2, background: `linear-gradient(90deg, ${C.gold}, ${C.gold}00)` }} />
      </div>}
    </div>
  );
};

// ==================== PERILLA DEL HORNO (la aguja gira hasta la temperatura, brillo cálido) · izq-arriba ====================
export const OvenDial: React.FC<{ t: number; at: number; out: number; text: string; sub?: string; x?: number; y?: number }> = ({ t, at, out, text, sub, x = 300, y = 330 }) => {
  const deg = /^(\d{3})°F$/.exec(text);
  if (!deg) return <Stat t={t} at={at} out={out} text={text} sub={sub} x={x} y={y} size={150} />;
  if (t < at - 0.05 || t > out + 0.6) return null;
  const T = parseInt(deg[1]), o = inOut(t, at, out, 0.25, 0.4), k = spr(t, at, 0.8), kn = e(t, at + 0.15, at + 1.1), glow = e(t, at + 0.8, at + 1.4);
  const fr = (T - 200) / 300, ang = -135 + 270 * fr * kn, R = 128;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * Math.min(1.03, k)})`, opacity: o, textAlign: "center", padding: "26px 34px 24px", borderRadius: 34, background: "linear-gradient(180deg, rgba(38,24,14,.82), rgba(16,10,6,.88))", boxShadow: `0 1px 0 rgba(255,255,255,.12) inset, 0 30px 60px rgba(0,0,0,.55), 0 0 0 1.5px ${C.gold}44` }}>
      <div style={{ position: "absolute", left: "50%", top: R + 26, width: 2 * R + 160, height: 2 * R + 160, transform: "translate(-50%,-50%)", borderRadius: "50%", background: `radial-gradient(closest-side, rgba(255,140,40,${0.42 * glow}), rgba(255,120,30,0))` }} />
      <svg width={2 * R} height={2 * R} viewBox={`0 0 ${2 * R} ${2 * R}`} style={{ position: "relative", filter: "drop-shadow(0 20px 30px rgba(0,0,0,.55))" }}>
        <defs>
          <radialGradient id="dface" cx="40%" cy="32%" r="75%"><stop offset="0" stopColor="#fffaf0" /><stop offset=".65" stopColor="#efe1c4" /><stop offset="1" stopColor="#cdb48a" /></radialGradient>
          <linearGradient id="drim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2f2f2" /><stop offset=".5" stopColor="#9a9a9a" /><stop offset="1" stopColor="#5a5a5a" /></linearGradient>
        </defs>
        <circle cx={R} cy={R} r={R - 2} fill="url(#drim)" />
        <circle cx={R} cy={R} r={R - 12} fill="url(#dface)" />
        {Array.from({ length: 31 }, (_, i) => { const a = ((-135 + i * 9) - 90) * Math.PI / 180, big = i % 5 === 0, r1 = R - 20, r2 = R - (big ? 40 : 30), hot = i / 30 <= fr * kn; return <line key={i} x1={R + r1 * Math.cos(a)} y1={R + r1 * Math.sin(a)} x2={R + r2 * Math.cos(a)} y2={R + r2 * Math.sin(a)} stroke={hot ? "#d0521f" : "#6b5a44"} strokeWidth={big ? 4 : 2} strokeLinecap="round" />; })}
        {[200, 300, 400, 500].map((v, i) => { const a = ((-135 + i * 90) - 90) * Math.PI / 180, r = R - 58; return <text key={v} x={R + r * Math.cos(a)} y={R + r * Math.sin(a) + 7} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={18} fill="#5a4630">{v}</text>; })}
        <g transform={`rotate(${ang} ${R} ${R})`}>
          <path d={`M ${R - 7} ${R + 14} L ${R} ${R - (R - 34)} L ${R + 7} ${R + 14} Z`} fill={C.wine} />
        </g>
        <circle cx={R} cy={R} r={20} fill="url(#drim)" stroke="#444" strokeWidth={1} />
      </svg>
      <div style={{ position: "relative", marginTop: 6, fontFamily: SERIF, fontSize: 92, lineHeight: 1, ...goldText(8, e(t, at + 1.0, at + 2.0)) }}>{Math.round(200 + (T - 200) * kn)}°F</div>
      {sub && <div style={{ position: "relative", display: "inline-block", marginTop: 8, padding: "7px 18px", borderRadius: 30, background: `linear-gradient(180deg, ${C.wine}, ${C.wineD})`, color: C.goldL, fontFamily: SANS, fontWeight: 800, fontSize: 20, letterSpacing: 4, opacity: glow, boxShadow: "0 10px 24px rgba(0,0,0,.45)", whiteSpace: "nowrap" }}>{sub}</div>}
    </div>
  );
};

// ============================== RELOJ DE ENFRIADO (esfera crema, arco vino que avanza) · der-arriba ==============================
export const CoolClock: React.FC<{ t: number; at: number; out: number; label: string; x?: number; y?: number }> = ({ t, at, out, label, x = 1600, y = 360 }) => {
  if (t < at - 0.05 || t > out + 0.6) return null;
  const o = inOut(t, at, out, 0.25, 0.4), k = spr(t, at, 0.8), p = e(t, at + 0.3, out), R = 110, c = 2 * Math.PI * (R - 18);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * Math.min(1.03, k)})`, opacity: o, textAlign: "center" }}>
      <svg width={2 * R} height={2 * R} style={{ filter: "drop-shadow(0 18px 28px rgba(0,0,0,.5))" }}>
        <circle cx={R} cy={R} r={R - 3} fill="#fdf6e8" stroke={C.gold} strokeWidth={5} />
        <circle cx={R} cy={R} r={R - 18} fill="none" stroke="rgba(142,29,43,.15)" strokeWidth={14} />
        <circle cx={R} cy={R} r={R - 18} fill="none" stroke={C.wine} strokeWidth={14} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} transform={`rotate(-90 ${R} ${R})`} />
        {Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return <circle key={i} cx={R + (R - 40) * Math.sin(a)} cy={R - (R - 40) * Math.cos(a)} r={i % 3 ? 2 : 4} fill="#6b5a44" />; })}
        <line x1={R} y1={R} x2={R + (R - 50) * Math.sin(p * 2 * Math.PI)} y2={R - (R - 50) * Math.cos(p * 2 * Math.PI)} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
        <circle cx={R} cy={R} r={8} fill={C.wine} />
      </svg>
      <div style={{ marginTop: 10, display: "inline-block", padding: "8px 20px", borderRadius: 30, background: "linear-gradient(180deg, rgba(40,26,16,.9), rgba(20,12,7,.92))", color: C.goldL, fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: 4, boxShadow: "0 10px 24px rgba(0,0,0,.45)", whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

// ================================== LA CITA FINAL (serif, al centro-arriba, con comillas doradas) ==================================
export const Quote: React.FC<{ t: number; a1: number; a2: number; out: number; l1: string; l2: string }> = ({ t, a1, a2, out, l1, l2 }) => {
  if (t < a1 - 0.1 || t > out + 0.6) return null;
  const o = 1 - e(t, out, out + 0.45);
  return (
    <div style={{ position: "absolute", left: "50%", top: 60, transform: "translateX(-50%)", textAlign: "center", opacity: o, padding: "30px 70px 40px", borderRadius: 36, background: "linear-gradient(180deg, rgba(30,18,10,.86), rgba(14,8,4,.9))", boxShadow: `0 1px 0 rgba(255,255,255,.1) inset, 0 40px 80px rgba(0,0,0,.5), 0 0 0 1.5px ${C.gold}44`, whiteSpace: "nowrap" }}>
            <div style={{ position: "relative", fontFamily: SERIF, fontSize: 150, lineHeight: 0.6, height: 70, ...goldText(6), opacity: e(t, a1, a1 + 0.4) }}>“</div>
      <div style={{ position: "relative", fontFamily: SERIF, fontSize: 78, color: C.cream, textShadow: "0 4px 26px rgba(0,0,0,.75)", opacity: e(t, a1, a1 + 0.45), transform: `translateY(${(1 - e(t, a1, a1 + 0.6)) * 22}px)` }}>{l1}</div>
      <div style={{ position: "relative", fontFamily: SERIF, fontSize: 78, marginTop: 4, ...goldText(5), opacity: e(t, a2, a2 + 0.45), transform: `translateY(${(1 - e(t, a2, a2 + 0.6)) * 22}px)` }}>{l2}</div>
    </div>
  );
};
