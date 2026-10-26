// ck2510d · 2ª pasada de piezas (26-oct, pedido del creador: "calidad impresionante, profesional, con profundidad; el
// cartel rojo en toda la pantalla queda trucho y tapa el avatar → un zócalo de noticiero abajo a la izquierda").
// Un solo lenguaje: papel crema de libro de iglesia + vino + dorado, serif DM Serif Display para lo que se lee lindo,
// Inter para las etiquetas. Todo lo que es texto vive en el ZÓCALO (abajo-izq, apilable); lo demás va a los costados,
// nunca sobre la cara (el avatar está al centro).
import React from "react";
import { loadFont as loadSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { e, ei, spr } from "../kits/yanqui3d/lib";

export const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
export const { fontFamily: SANS } = loadSans("normal", { weights: ["500", "700", "800", "900"], subsets: ["latin"] });
export const { fontFamily: HAND } = loadHand("normal", { weights: ["600", "700"], subsets: ["latin"] });
export const C = { cream: "#fbf3e4", paper: "#f3e5cb", ink: "#22150d", wine: "#8e1d2b", wineD: "#4d0c16", gold: "#e3b25c", goldL: "#f8dda4", red: "#d8392b", rule: "rgba(70,110,170,.22)" };

const cl = (x: number) => Math.min(1, Math.max(0, x));
const blur = (px: number) => (px > 0.15 ? `blur(${px.toFixed(2)}px)` : "none");
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
const Book3D: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const kO = ei(t, out + 0.1, out + 0.5);
  const k = spr(t, a + 0.15, 0.9), ry = -32 + 10 * Math.sin((t - a) * 0.9) - kO * 30, lift = (1 - Math.min(1, k)) * 60 + kO * 70;
  const W = 134, H = 178, D = 26;
  return (
    <div style={{ position: "absolute", left: 18, bottom: 28, width: W, height: H, perspective: 900, transform: `translateY(${lift}px) rotate(${(1 - Math.min(1, k)) * -12 + kO * -8}deg)`, opacity: cl(k * 2) * (1 - kO), filter: blur((1 - cl(k * 1.4)) * 8 + kO * 8) }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${ry}deg) rotateX(8deg)` }}>
        {/* canto de las hojas */}
        <div style={{ position: "absolute", left: W - D / 2, top: 4, width: D, height: H - 8, transform: `rotateY(90deg)`, background: "repeating-linear-gradient(0deg,#f6ecd6 0 2px,#e2d3b4 2px 3px)" }} />
        {/* lomo */}
        <div style={{ position: "absolute", left: -D / 2, top: 0, width: D, height: H, transform: `rotateY(-90deg)`, background: `linear-gradient(90deg, ${C.wineD}, #6e1520)` }} />
        {/* tapa */}
        <div style={{ position: "absolute", inset: 0, transform: `translateZ(${D / 2}px)`, borderRadius: "3px 8px 8px 3px", background: `radial-gradient(120% 90% at 30% 20%, #a82a39, ${C.wine} 45%, ${C.wineD})`, boxShadow: "0 20px 40px rgba(0,0,0,.55)", border: `2px solid ${C.gold}`, outline: `1px solid ${C.gold}66`, outlineOffset: -9, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 10 }}>
          <div style={{ fontFamily: SERIF, fontSize: 17, lineHeight: 1.05, ...goldText(2) }}>Loretta's<br />Church Supper<br />Cookbook</div>
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

// entrada: pestaña → hoja vino → barra → ícono → texto (sube y se enfoca) → línea dorada → brillo.
// salida al revés, escalonada: el texto se va hacia arriba desenfocándose, la línea se recoge, la barra y la hoja se
// cierran hacia la izquierda y la pestaña se repliega última (nunca un fundido plano).
const Zocalo: React.FC<{ t: number; z: ZItem; y: number }> = ({ t, z, y }) => {
  const { a, out, tone } = z;
  if (t < a - 0.05 || t > out + 0.75) return null;
  const T = TONE[tone];
  const O = (d: number, len = 0.32) => 1 - ei(t, out + d, out + d + len);    // salida escalonada (1 → 0)
  const kIn = spr(t, a, 0.85);
  const kTab = ei(t, a, a + 0.3) * O(0.38, 0.28), kPlate = ei(t, a + 0.12, a + 0.55) * O(0.02, 0.26), kBar = ei(t, a + 0.08, a + 0.5) * O(0.12, 0.36);
  const kLine = ei(t, a + 0.45, a + 1.0) * O(0, 0.22), kTxt = e(t, a + 0.28, a + 0.7), kTxtO = ei(t, out, out + 0.26);
  const kIcon = spr(t, a + 0.32, 1.1) * O(0.06, 0.25);
  const ry = (1 - Math.min(1, kIn)) * -26;                                     // entra girando un poco (bisagra en el borde)
  const sweep = e(t, a + 0.55, a + 1.35);                                      // brillo que cruza una vez
  const book = tone === "book";
  const size = z.txt.length > 40 ? 42 : z.txt.length > 30 ? 48 : 54;
  const left = book ? 186 : 0;
  const txt = (k: number): React.CSSProperties => ({ opacity: k * (1 - kTxtO), transform: `translateY(${(1 - k) * 18 - kTxtO * 16}px)`, filter: `blur(${(1 - k) * 7 + kTxtO * 6}px)` });
  const sub = (k: number) => txt(k);
  return (
    <div style={{ position: "absolute", left: 70, bottom: y, perspective: 1400, opacity: cl(O(0.55, 0.15) + 0.0001) }}>
      <div style={{ transformOrigin: "0% 50%", transform: `rotateY(${ry}deg) translateX(${(1 - ei(t, a, a + 0.5)) * -24}px)`, transformStyle: "preserve-3d" }}>
        {book && <Book3D t={t} a={a} out={out} />}
        {/* pestaña */}
        <div style={{ marginLeft: left, display: "inline-flex", alignItems: "center", gap: 12, padding: "9px 20px 9px 16px", borderRadius: "10px 10px 0 0", background: T.tab, color: T.tabInk, fontFamily: SANS, fontWeight: 800, fontSize: 25, letterSpacing: 4.5 + (1 - kTab) * 4, clipPath: `inset(0 ${100 - kTab * 100}% 0 0)`, boxShadow: "0 1px 0 rgba(255,255,255,.18) inset", transform: `translateY(${(1 - kBar) * 30}px)` }}>
          {tone === "warn" ? <span style={{ display: "inline-flex", width: 26, height: 26, borderRadius: 13, background: "#fff", color: C.red, fontWeight: 900, fontSize: 18, alignItems: "center", justifyContent: "center", letterSpacing: 0, transform: `scale(${Math.min(1.15, spr(t, a + 0.2, 1.2))})` }}>{z.n ?? "!"}</span>
            : <span style={{ width: 9, height: 9, borderRadius: 5, background: C.gold, boxShadow: `0 0 ${6 + 10 * Math.abs(Math.sin((t - a) * 2.2))}px ${C.gold}` }} />}
          {z.label}
        </div>
        {/* barra de papel, con una segunda hoja color vino asomando detrás (profundidad) */}
        <div style={{ position: "relative", marginLeft: left, width: "fit-content" }}>
        <div style={{ position: "absolute", left: 12, right: -12, top: 12, bottom: -12, borderRadius: "0 14px 14px 14px", background: `linear-gradient(180deg, ${tone === "warn" ? C.red : C.wine}, ${C.wineD})`, opacity: 0.92, clipPath: `inset(0 ${100 - kPlate * 100}% 0 0 round 0 14px 14px 14px)`, boxShadow: "0 18px 30px rgba(0,0,0,.35)", transform: `translate(${(1 - kPlate) * -10}px, ${(1 - kPlate) * -8}px)` }} />
        <div style={{ position: "relative", display: "flex", alignItems: "stretch", minHeight: book ? 108 : 86, borderRadius: "0 14px 14px 14px", background: `linear-gradient(180deg, #fffaf0 0%, ${C.cream} 40%, ${C.paper} 100%)`, boxShadow: DEPTH, clipPath: `inset(0 ${100 - kBar * 100}% 0 0 round 0 14px 14px 14px)`, overflow: "hidden" }}>
          <div style={{ width: 12, background: `linear-gradient(180deg, ${T.mark}, ${T.mark}cc)` }} />
          <ZIcon tone={tone} col={T.mark} k={kIcon} />
          <div style={{ padding: tone === "name" ? "12px 34px 14px 24px" : "14px 38px 14px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {tone === "name" ? <>
              <div style={{ fontFamily: SERIF, fontSize: 62, color: C.ink, lineHeight: 1, letterSpacing: 0.5 + (1 - kTxt) * 3, ...txt(kTxt) }}>{z.txt}</div>
              {z.sub && <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.wine, marginTop: 8, ...sub(e(t, a + 0.55, a + 0.9)) }}>{z.sub}</div>}
            </> : tone === "book" ? <>
              <div style={{ fontFamily: SERIF, fontSize: 60, color: C.ink, lineHeight: 1.02, ...txt(kTxt) }}>{z.txt}</div>
              {z.sub && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: 3.5, color: C.wine, marginTop: 8, ...sub(e(t, a + 0.55, a + 0.9)) }}>{z.sub}</div>}
            </> : tone === "list" && z.items ? (
              <div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: SANS, fontWeight: 800, fontSize: 46, color: C.ink, whiteSpace: "nowrap" }}>
                {z.items.map((it, i) => {
                  const k = e(t, it.at, it.at + 0.38), kd = spr(t, it.at - 0.1, 1.3);
                  return <React.Fragment key={i}>{i > 0 && <span style={{ width: 10, height: 10, borderRadius: 5, background: C.gold, opacity: cl(kd) * (1 - kTxtO), transform: `scale(${Math.min(1.3, kd)})` }} />}<span style={{ display: "inline-block", ...txt(k) }}>{it.txt}</span></React.Fragment>;
                })}
              </div>
            ) : (
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, color: tone === "warn" ? "#2a0d08" : C.ink, letterSpacing: 0.6 + (1 - kTxt) * 2.5, whiteSpace: "nowrap", lineHeight: 1.05, ...txt(kTxt) }}>{z.txt}</div>
            )}
          </div>
          {/* brillo de entrada + línea dorada que se dibuja (y se recoge al salir) */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + sweep * 140}%`, width: "22%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent)", opacity: sweep > 0 && sweep < 1 ? 1 : 0 }} />
          <div style={{ position: "absolute", left: 12, bottom: 0, height: 4, width: `${kLine * 100}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.goldL}, ${C.gold}00)`, boxShadow: `0 0 10px ${C.gold}88` }} />
        </div>
        </div>
      </div>
    </div>
  );
};

// apila los zócalos que se pisan (el 2º sube encima del 1º); cuando el de abajo se va, el de arriba BAJA deslizándose
export const ZocaloStack: React.FC<{ t: number; items: ZItem[] }> = ({ t, items }) => {
  // el que REEMPLAZA al anterior (entra justo cuando el otro sale) no se apila: espera a que se recoja y entra en su lugar
  const list = [...items].sort((p, q) => p.a - q.a).map((z, i, arr) => {
    const prev = arr.slice(0, i).find((q) => Math.abs(q.out - z.a) < 0.4);
    return prev ? { ...z, a: Math.max(z.a, prev.out + 0.42), relevo: prev.key } : { ...z, relevo: "" };
  });
  const lvl: number[] = [];
  list.forEach((z, i) => {
    let y = 0;
    for (let j = 0; j < i; j++) if (list[j].key !== z.relevo && list[j].out + 0.5 > z.a && lvl[j] + ZH[list[j].tone] + 18 > y) y = lvl[j] + ZH[list[j].tone] + 18;
    lvl.push(y > 2 * 160 ? 0 : y);
  });
  // altura viva: cada zócalo de abajo que ya salió deja de empujar (con resorte suave)
  const yAt = (i: number): number => {
    if (lvl[i] === 0) return 0;
    let y = 0;
    for (let j = 0; j < i; j++) {
      if (list[j].key === list[i].relevo || !(list[j].out + 0.5 > list[i].a) || lvl[j] >= lvl[i]) continue;
      y = Math.max(y, yAt(j) + (ZH[list[j].tone] + 18) * (1 - ei(t, list[j].out + 0.45, list[j].out + 1.0)));
    }
    return y;
  };
  return <>{list.map((z, i) => <Zocalo key={z.key} t={t} z={z} y={64 + yAt(i)} />)}</>;
};

// ================================================ TÍTULO DEL PASTEL ================================================
// número dorado enorme con relieve a la izquierda (el avatar queda libre al centro), "PIE ONE OF NINE", nombre en serif
const NUM = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];
export const PieTitle: React.FC<{ t: number; at: number; out: number; n: number; name: string }> = ({ t, at, out, n, name }) => {
  if (t < at - 0.05 || t > out + 0.9) return null;
  // entrada: el número cae enfocándose con resorte → la etiqueta se cierra (tracking) → el nombre sube desde su renglón
  // → la regla dorada se dibuja. Salida escalonada hacia la izquierda: nombre, etiqueta, número, y el velo al final.
  const O = (d: number, len = 0.36) => 1 - ei(t, out + d, out + d + len);
  const kN = spr(t, at, 0.8), kNb = e(t, at, at + 0.5), kL = ei(t, at + 0.25, at + 0.75), kName = ei(t, at + 0.38, at + 0.95), kRule = ei(t, at + 0.6, at + 1.35);
  const oName = O(0), oL = O(0.07), oN = O(0.14, 0.42), oRule = O(0, 0.22), oV = O(0.3, 0.5);
  const drift = (t - at) * 6;
  const nm = name.replace(/\b(\w)(\w*)/g, (_, f, r) => f + r.toLowerCase());
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, opacity: ei(t, at - 0.05, at + 0.45) * oV, background: "linear-gradient(90deg, rgba(14,8,4,.8) 0%, rgba(14,8,4,.55) 24%, rgba(14,8,4,0) 44%)" }} />
      <div style={{ position: "absolute", left: 96 - drift, top: 150, perspective: 1200 }}>
        <div style={{ transform: `rotateY(${(1 - Math.min(1, kN)) * 40 + 10}deg)`, transformOrigin: "0% 50%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, maxWidth: 700 }}>
          <div style={{ opacity: cl(kNb * 1.6) * oN, filter: blur((1 - kNb) * 16 + (1 - oN) * 12), transform: `translate(${(1 - oN) * -50}px, ${(1 - Math.min(1, kN)) * -30}px) scale(${0.7 + 0.3 * Math.min(1.05, kN) - (1 - oN) * 0.1})`, transformOrigin: "0% 70%" }}>
            <div style={{ fontFamily: SERIF, fontSize: 260, lineHeight: 0.82, ...goldText(14, e(t, at + 0.5, at + 1.5)) }}>{n}</div>
          </div>
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: 7 + (1 - kL) * 12, color: C.goldL, opacity: kL * oL, filter: blur((1 - kL) * 5 + (1 - oL) * 8), transform: `translateX(${(1 - kL) * -24 - (1 - oL) * 60}px)` }}>PIE {NUM[n]} OF NINE</div>
            <div style={{ overflow: "hidden", padding: "4px 30px 40px 0", margin: "6px -30px -40px 0" }}>
              <div style={{ fontFamily: SERIF, fontSize: 86, color: C.cream, lineHeight: 1, textShadow: "0 3px 0 rgba(0,0,0,.35), 0 14px 34px rgba(0,0,0,.6)", opacity: cl(kName * 1.5) * oName, filter: blur((1 - oName) * 10), transform: `translate(${(1 - oName) * -70}px, ${(1 - kName) * 105}%)` }}>{nm}</div>
            </div>
            <div style={{ height: 3, marginTop: 18, width: 420 * kRule * oRule, background: `linear-gradient(90deg, ${C.gold}, ${C.gold}00)`, boxShadow: `0 0 12px ${C.gold}66` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ================================== FICHA DEL PASTEL (arriba-der, mientras dura) ==================================
export const PieBadge: React.FC<{ t: number; at: number; out: number; n: number; name: string }> = ({ t, at, out, n, name }) => {
  if (t < at - 0.05 || t > out + 0.6) return null;
  // baja desde arriba con resorte y se enfoca; los puntos del anillo se prenden uno por uno hasta el pastel actual
  const k = spr(t, at + 0.3, 0.9), kb = e(t, at + 0.3, at + 0.7), kO = ei(t, out, out + 0.45);
  return (
    <div style={{ position: "absolute", right: 58, top: 50, opacity: cl(kb * 1.5) * (1 - kO), filter: blur((1 - kb) * 9 + kO * 8), transformOrigin: "100% 0%", transform: `translateY(${(1 - Math.min(1, k)) * -50 - kO * 40}px) scale(${1.18 - kO * 0.08})`, display: "flex", alignItems: "center", gap: 16, padding: "12px 24px 12px 14px", borderRadius: 20, background: "linear-gradient(180deg, rgba(40,26,16,.86), rgba(20,12,7,.9))", boxShadow: `0 1px 0 rgba(255,255,255,.12) inset, 0 16px 34px rgba(0,0,0,.5), 0 0 0 1.5px ${C.gold}55` }}>
      <svg width={62} height={62} viewBox="0 0 62 62">
        {Array.from({ length: 9 }, (_, i) => {
          const ang = (i / 9) * Math.PI * 2 - Math.PI / 2, kd = e(t, at + 0.5 + i * 0.06, at + 0.7 + i * 0.06), on = i < n && kd > 0.5, cur = i === n - 1;
          const pop = cur ? 1 + 0.5 * Math.max(0, 1 - Math.abs(t - (at + 0.6 + i * 0.06)) * 4) : 1;
          return <circle key={i} cx={31 + 23 * Math.cos(ang)} cy={31 + 23 * Math.sin(ang)} r={(cur ? 5.5 : 4) * pop} fill={on ? C.gold : "rgba(255,255,255,.18)"} style={cur && on ? { filter: `drop-shadow(0 0 ${4 + 3 * Math.abs(Math.sin((t - at) * 2))}px ${C.gold})` } : undefined} />;
        })}
        <text x={31} y={39} textAnchor="middle" fontFamily={SERIF} fontSize={24} fill={C.goldL} opacity={e(t, at + 0.45, at + 0.8)}>{n}</text>
      </svg>
      <div style={{ opacity: e(t, at + 0.5, at + 0.85), transform: `translateX(${(1 - e(t, at + 0.5, at + 0.85)) * 14}px)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 17, letterSpacing: 4, color: C.gold }}>PIE {n} OF 9</div>
        <div style={{ fontFamily: SERIF, fontSize: 32, color: C.cream, lineHeight: 1.05, whiteSpace: "nowrap" }}>{name.replace(/\b(\w)(\w*)/g, (_, f, r) => f + r.toLowerCase())}'s</div>
      </div>
    </div>
  );
};

// ============================ TARJETA DE RECETA (a la derecha, como las fichas de la iglesia) ============================
export const RecipeCard: React.FC<{ t: number; title: string; rows: { at: number; txt: string }[]; out: number }> = ({ t, title, rows, out }) => {
  const a = rows[0].at - 0.4;
  if (t < a - 0.05 || t > out + 0.6) return null;
  const kO = ei(t, out, out + 0.55), o = e(t, a, a + 0.3) * (1 - ei(t, out + 0.3, out + 0.55)), k = spr(t, a, 0.75), drift = Math.sin((t - a) * 0.6) * 1.5;
  const shown = rows.filter((r) => t >= r.at - 0.05).length;
  const RH = 58, H = 128 + Math.max(1, rows.length) * RH;
  return (
    <div style={{ position: "absolute", right: 70, top: 150, perspective: 1500, opacity: o, filter: blur((1 - e(t, a, a + 0.45)) * 10 + kO * 9) }}>
      <div style={{ position: "relative", transformOrigin: "100% 50%", transform: `translateX(${kO * 120}px) rotateY(${(1 - Math.min(1, k)) * 55 - 9 + drift + kO * 38}deg) rotateZ(${1.4 - (1 - Math.min(1, k)) * 4 + kO * 5}deg) translateY(${(1 - Math.min(1, k)) * 40 - kO * 20}px)` }}>
      <div style={{ width: 560, height: H, borderRadius: 10, position: "relative", overflow: "hidden",
        background: `linear-gradient(180deg, transparent 0 102px, ${C.rule} 102px 104px, transparent 104px) , repeating-linear-gradient(180deg, transparent 0 ${RH - 2}px, ${C.rule} ${RH - 2}px ${RH}px) 0 104px / 100% 100% no-repeat, linear-gradient(170deg, #fffdf6, #f7ecd6 60%, #efdfc0)`,
        boxShadow: "0 2px 0 rgba(255,255,255,.7) inset, 0 4px 8px rgba(0,0,0,.25), 0 26px 50px rgba(0,0,0,.45), 0 60px 90px rgba(0,0,0,.25)" }}>
        <svg width={560} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.16 }}><filter id="grano"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={7} /><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .32  0 0 0 0 .18  0 0 0 1 0" /></filter><rect width="100%" height="100%" filter="url(#grano)" /></svg>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0) 60%, rgba(120,80,30,.12))" }} />
        <div style={{ position: "absolute", left: 62, top: 0, bottom: 0, width: 2, background: "rgba(200,60,60,.45)" }} />
        <div style={{ position: "absolute", right: 0, bottom: 0, width: 54, height: 54, background: "linear-gradient(135deg, rgba(0,0,0,0) 50%, rgba(90,60,25,.22) 50%, #e9d6b0 62%, #f7ecd6 100%)", boxShadow: "-4px -4px 10px rgba(0,0,0,.12)" }} />
        <div style={{ position: "absolute", left: 82, right: 24, top: 26, fontFamily: SERIF, fontSize: title.length > 22 ? 32 : 40, color: C.wine, lineHeight: 1.05, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title.replace(/\b(\w)(\w*)/g, (_, f, r) => f + r.toLowerCase()).replace(/ · Page (\d+)/, " · page $1").replace(/(\d)–(\d) Pies/, "$1–$2 pies")}</div>
        <div style={{ position: "absolute", left: 84, top: 74, fontFamily: SANS, fontWeight: 700, fontSize: 15, letterSpacing: 4, color: "rgba(60,40,25,.55)" }}>FROM LORETTA'S KITCHEN</div>
        {rows.map((r, i) => {
          const kr = e(t, r.at, r.at + 0.38) * (1 - ei(t, out - 0.15 + (rows.length - 1 - i) * 0.05, out + 0.1 + (rows.length - 1 - i) * 0.05)), kc = e(t, r.at + 0.15, r.at + 0.5), cur = i === shown - 1;
          return (
            <div key={i} style={{ position: "absolute", left: 18, right: 20, top: 104 + i * RH, height: RH, display: "flex", alignItems: "center", opacity: kr, filter: blur((1 - kr) * 5), transform: `translateX(${(1 - kr) * 30}px)` }}>
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
  const kO = ei(t, out, out + 0.5), o = e(t, at, at + 0.25) * (1 - ei(t, out + 0.2, out + 0.5)), k = spr(t, at, 0.85), kc = e(t, at, at + 0.9), ks = e(t, at + 0.35, at + 0.7) * (1 - ei(t, out - 0.15, out + 0.15));
  const m = /^\d+$/.exec(text); const v = m ? parseInt(text) : 0;
  const shown = m ? String(Math.round(v > 1800 && v < 2100 ? 1900 + (v - 1900) * kc : v * kc)) : text;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${-kO * 30}px) scale(${1 - kO * 0.14})`, opacity: o, filter: blur((1 - e(t, at, at + 0.4)) * 12 + kO * 12), textAlign: "center", perspective: 1000 }}>
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
  const kO = ei(t, out, out + 0.45), T = parseInt(deg[1]), o = e(t, at, at + 0.25) * (1 - ei(t, out + 0.15, out + 0.45)), k = spr(t, at, 0.8), kn = e(t, at + 0.15, at + 1.1), glow = e(t, at + 0.8, at + 1.4);
  const gid = "d" + Math.round(at * 100), fr = (T - 200) / 300, ang = -135 + 270 * fr * kn, R = 128;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * 40 - kO * 20}px) scale(${0.8 + 0.2 * Math.min(1.03, k) - kO * 0.12})`, opacity: o, filter: blur((1 - e(t, at, at + 0.4)) * 10 + kO * 10), textAlign: "center", padding: "26px 34px 24px", borderRadius: 34, background: "linear-gradient(180deg, rgba(38,24,14,.82), rgba(16,10,6,.88))", boxShadow: `0 1px 0 rgba(255,255,255,.12) inset, 0 30px 60px rgba(0,0,0,.55), 0 0 0 1.5px ${C.gold}44` }}>
      <div style={{ position: "absolute", left: "50%", top: R + 26, width: 2 * R + 160, height: 2 * R + 160, transform: "translate(-50%,-50%)", borderRadius: "50%", background: `radial-gradient(closest-side, rgba(255,140,40,${0.42 * glow}), rgba(255,120,30,0))` }} />
      <svg width={2 * R} height={2 * R} viewBox={`0 0 ${2 * R} ${2 * R}`} style={{ position: "relative" }}>
        <defs>
          <radialGradient id={gid + "f"} cx="40%" cy="32%" r="75%"><stop offset="0" stopColor="#fffaf0" /><stop offset=".65" stopColor="#efe1c4" /><stop offset="1" stopColor="#cdb48a" /></radialGradient>
          <linearGradient id={gid + "r"} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2f2f2" /><stop offset=".5" stopColor="#9a9a9a" /><stop offset="1" stopColor="#5a5a5a" /></linearGradient>
        </defs>
        <circle cx={R} cy={R} r={R - 2} fill={`url(#${gid}r)`} />
        <circle cx={R} cy={R} r={R - 12} fill={`url(#${gid}f)`} />
        {Array.from({ length: 31 }, (_, i) => { const a = ((-135 + i * 9) - 90) * Math.PI / 180, big = i % 5 === 0, r1 = R - 20, r2 = R - (big ? 40 : 30), hot = i / 30 <= fr * kn; return <line key={i} x1={R + r1 * Math.cos(a)} y1={R + r1 * Math.sin(a)} x2={R + r2 * Math.cos(a)} y2={R + r2 * Math.sin(a)} stroke={hot ? "#d0521f" : "#6b5a44"} strokeWidth={big ? 4 : 2} strokeLinecap="round" />; })}
        {[200, 300, 400, 500].map((v, i) => { const a = ((-135 + i * 90) - 90) * Math.PI / 180, r = R - 58; return <text key={v} x={R + r * Math.cos(a)} y={R + r * Math.sin(a) + 7} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={18} fill="#5a4630">{v}</text>; })}
        <g transform={`rotate(${ang} ${R} ${R})`}>
          <path d={`M ${R - 7} ${R + 14} L ${R} ${R - (R - 34)} L ${R + 7} ${R + 14} Z`} fill={C.wine} />
        </g>
        <circle cx={R} cy={R} r={20} fill={`url(#${gid}r)`} stroke="#444" strokeWidth={1} />
      </svg>
      <div style={{ position: "relative", marginTop: 6, fontFamily: SERIF, fontSize: 92, lineHeight: 1, ...goldText(8, e(t, at + 1.0, at + 2.0)) }}>{Math.round(200 + (T - 200) * kn)}°F</div>
      {sub && <div style={{ position: "relative", display: "inline-block", marginTop: 8, padding: "7px 18px", borderRadius: 30, background: `linear-gradient(180deg, ${C.wine}, ${C.wineD})`, color: C.goldL, fontFamily: SANS, fontWeight: 800, fontSize: 20, letterSpacing: 4, opacity: glow, boxShadow: "0 10px 24px rgba(0,0,0,.45)", whiteSpace: "nowrap" }}>{sub}</div>}
    </div>
  );
};

// ============================== RELOJ DE ENFRIADO (esfera crema, arco vino que avanza) · der-arriba ==============================
export const CoolClock: React.FC<{ t: number; at: number; out: number; label: string; x?: number; y?: number }> = ({ t, at, out, label, x = 1600, y = 360 }) => {
  if (t < at - 0.05 || t > out + 0.6) return null;
  const kO = ei(t, out, out + 0.45), o = e(t, at, at + 0.25) * (1 - ei(t, out + 0.15, out + 0.45)), k = spr(t, at, 0.8), p = e(t, at + 0.3, out), R = 110, c = 2 * Math.PI * (R - 18);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * 40 - kO * 20}px) rotate(${(1 - Math.min(1, k)) * -14}deg) scale(${0.8 + 0.2 * Math.min(1.03, k) - kO * 0.12})`, opacity: o, filter: blur((1 - e(t, at, at + 0.4)) * 10 + kO * 10), textAlign: "center" }}>
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
export const Quote: React.FC<{ t: number; a1: number; a2: number; out: number; l1: string; l2: string; avUntil?: number }> = ({ t, a1, a2, out, l1, l2, avUntil = 0 }) => {
  if (t < a1 - 0.3 || t > out + 0.7) return null;
  const kP = spr(t, a1 - 0.25, 0.9), kPb = e(t, a1 - 0.25, a1 + 0.15), kO = ei(t, out, out + 0.55);
  // mientras habla el avatar la cita va ABAJO (nunca sobre la cara); cuando entra la toma siguiente sube deslizándose
  const top = 60 + 650 * (1 - ei(t, avUntil - 0.1, avUntil + 0.6));
  const words = (l: string, a: number, gold: boolean) => l.split(" ").map((w, i) => {
    const k = e(t, a + i * 0.07, a + i * 0.07 + 0.42);
    return <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: k, filter: blur((1 - k) * 8), transform: `translateY(${(1 - k) * 26}px)` }}><span style={gold ? goldText(5, e(t, a + 0.9, a + 1.9)) : undefined}>{w + (i < l.split(" ").length - 1 ? " " : "")}</span></span>;
  });
  return (
    <div style={{ position: "absolute", left: "50%", top, transform: `translateX(-50%) translateY(${(1 - Math.min(1, kP)) * 30 - kO * 40}px) scale(${0.92 + 0.08 * Math.min(1.02, kP) - kO * 0.04})`, textAlign: "center", opacity: cl(kPb * 1.4) * (1 - kO), filter: blur((1 - kPb) * 10 + kO * 10), padding: "30px 70px 40px", borderRadius: 36, background: "linear-gradient(180deg, rgba(30,18,10,.86), rgba(14,8,4,.9))", boxShadow: `0 1px 0 rgba(255,255,255,.1) inset, 0 40px 80px rgba(0,0,0,.5), 0 0 0 1.5px ${C.gold}44`, whiteSpace: "nowrap" }}>
      <div style={{ position: "relative", fontFamily: SERIF, fontSize: 150, lineHeight: 0.6, height: 70, ...goldText(6), opacity: e(t, a1 - 0.1, a1 + 0.3), transform: `scale(${0.6 + 0.4 * Math.min(1.1, spr(t, a1 - 0.1, 1))})` }}>“</div>
      <div style={{ position: "relative", fontFamily: SERIF, fontSize: 78, color: C.cream, textShadow: "0 4px 26px rgba(0,0,0,.75)" }}>{words(l1, a1, false)}</div>
      <div style={{ position: "relative", fontFamily: SERIF, fontSize: 78, marginTop: 4 }}>{words(l2, a2, true)}</div>
    </div>
  );
};
