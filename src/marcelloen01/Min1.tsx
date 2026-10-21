// marcelloen01 · MINUTO 1 (0 → 76 s). UN SOLO PLANO: el mundo 3D (departamento → cocina de la nonna) + Marcello, que entra
// y sale SIEMPRE por un iris nítido (nunca corte, nunca blur sobre el presentador). Todo clavado a la voz con at().
// Audio FUERA de Remotion (mezcla aparte + encfin). Render sólo en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, getInputProps, staticFile, useCurrentFrame } from "remotion";
import { KitchenWorld, camSpeed, screenOf, PT, M } from "./kitchen3d";
import { FONT, SERIF, P, s, e, ei, spr, rnd, COL, at, extrude, Vid, Portal, Tag, Card3D, BigNum, Stamp, LowerThird, Flash } from "./lib";
import avwin from "./avwin.json";

export const MIN1_END = 76;
export const MIN1_FRAMES = s(MIN1_END);
export const REEL = !(getInputProps() as { noreel?: boolean }).noreel; // el farm rinde con el reel; los stills locales con STILL_NOREEL=1 (la foto)
// tomas reales: mp4 cuando agnes las devuelve; mientras, la foto con movimiento lento
export const HAS: Record<string, boolean> = { m_fridge: true, m_crackers: true, m_pot: true, m_stir: true, m_eat: true };

export type Wn = { ms: number; me: number; off: number };
export const WIN: Wn[] = (avwin as { win: Wn[] }).win.map((w) => ({ ms: w.ms, me: w.me, off: w.off }));
const W1 = WIN.filter((w) => w.ms < MIN1_END);

// ---------------- el presentador (preroll de 10 cuadros, sólo dentro de su ventana) ----------------
export const Avatar: React.FC<{ t: number; wins?: Wn[] }> = ({ t, wins = W1 }) => (
  <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    {REEL ? wins.map((w, i) => (
      <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 22} layout="none">
        <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.3 ? 1 : 0 }}>
          <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - (s(w.ms) >= 10 ? 10 : s(w.ms)))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </Sequence>
    )) : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.01 + 0.012 * Math.sin(t * 0.6)})` }} />}
  </AbsoluteFill>
);

// toma real (o foto con empuje lento mientras no está el mp4)
const Clip: React.FC<{ id: string; t: number; a: number; push?: number }> = ({ id, t, a, push = 0.06 }) =>
  HAS[id] ? <Vid id={id} at={a} /> : <Vid id={"img_" + id} style={{ transform: `scale(${1.04 + push * e(t, a, a + 6)})` }} />;

// mundo con blur de movimiento real (sólo el mundo, nunca el presentador)
export const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(4, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><KitchenWorld t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// iris: el presentador abre desde un punto del mundo y cierra hacia otro (borde nítido con aro de luz)
export const irisR = (t: number, w: Wn) => Math.min(ei(t, w.ms, w.ms + 0.42), 1 - ei(t, w.me - 0.18, w.me + 0.28));

// ======================= PIEZAS NUEVAS DEL MINUTO 1 =======================

// A · el reloj LED "7:00" que vuela del lado del presentador al microondas
const Clock7: React.FC<{ t: number }> = ({ t }) => {
  const o = e(t, 0.15, 0.4) * (1 - e(t, 3.6, 3.8));
  if (o < 0.01) return null;
  const k = Math.min(1.1, spr(t, 0.2, 0.9)), fly = ei(t, 2.75, 3.5);
  const x = 420, y = 330, sc = (0.6 + 0.4 * k) * (1 - 0.75 * fly);
  const blink = Math.floor(t * 2) % 2 === 0 ? 1 : 0.25;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(900px) rotateY(${(1 - Math.min(1, k)) * -60 + 14 * (1 - fly)}deg) scale(${sc})` }}>
      <div style={{ padding: "18px 40px", background: "linear-gradient(180deg,#15181d,#07080a)", borderRadius: 18, border: "3px solid #2c3036", boxShadow: "0 30px 70px rgba(0,0,0,.7), inset 0 2px 0 rgba(255,255,255,.08)" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 170, color: "#4dff8a", letterSpacing: 8, textShadow: "0 0 24px #4dff8a, 0 0 60px rgba(77,255,138,.5)" }}>7<span style={{ opacity: blink }}>:</span>00</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 10, color: "rgba(77,255,138,.75)", textAlign: "center", marginTop: -8 }}>P.M.</div>
      </div>
    </div>
  );
};

// B · "$14" que cae con la caja de delivery; "TASTES LIKE THE BOX" se estampa sobre la caja
const Takeout: React.FC<{ t: number }> = ({ t }) => {
  const a = M.price, o = e(t, a - 0.1, a + 0.1) * (1 - e(t, 15.55, 15.75));
  if (o < 0.01) return null;
  const drop = spr(t, a + 0.05, 0.9), y = -300 + 900 * Math.min(1.04, drop);
  return (
    <div style={{ position: "absolute", left: 1390, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1000px) rotateX(18deg) rotateZ(${(1 - Math.min(1, drop)) * 24 - 4}deg)` }}>
      {/* caja de cartón con tapa */}
      <div style={{ width: 420, height: 230, position: "relative", transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#c99b62,#a87a45)", borderRadius: 10, boxShadow: "0 40px 80px rgba(0,0,0,.7), inset 0 -18px 0 rgba(0,0,0,.18)" }} />
        <div style={{ position: "absolute", left: -10, right: -10, top: -40, height: 60, background: "linear-gradient(180deg,#dcb47e,#b98a52)", borderRadius: 8, transformOrigin: "50% 100%", transform: `rotateX(${-30 + 30 * e(t, a + 0.5, a + 0.8)}deg)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 8, color: "rgba(60,30,10,.55)" }}>FAST · HOT · YUM</div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: -150, transform: `translate(-50%,0) scale(${0.5 + 0.5 * Math.min(1.1, spr(t, a + 0.15))})`, fontFamily: FONT, fontWeight: 900, fontSize: 190, color: COL.ink, textShadow: extrude(14, "#6b1c10"), whiteSpace: "nowrap" }}>$14</div>
    </div>
  );
};

// D · el calendario que pasa hojas hasta "2 YEARS"
const Calendar: React.FC<{ t: number }> = ({ t }) => {
  const a = M.years, o = e(t, a - 0.2, a + 0.1) * (1 - e(t, at("remembered") - 0.2, at("remembered") + 0.2));
  if (o < 0.01) return null;
  const flips = Math.min(24, Math.floor(e(t, a, a + 1.2) * 24));
  const p = screenOf(t, [2.35, 1.45, -1.72]);
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, opacity: o, transform: "translate(-50%,-50%)" }}>
      <div style={{ width: 230, background: "#f4efe6", borderRadius: 10, boxShadow: "0 24px 50px rgba(0,0,0,.6)", overflow: "hidden", fontFamily: FONT, textAlign: "center" }}>
        <div style={{ background: COL.tomato, color: "#fff", fontWeight: 900, fontSize: 30, letterSpacing: 6, padding: "8px 0" }}>{["OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"][flips % 12]}</div>
        <div style={{ fontWeight: 900, fontSize: 96, color: "#222", padding: "4px 0 10px" }}>{(flips * 7) % 28 + 1}</div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: 250, transform: `translate(-50%,0) scale(${Math.min(1.1, spr(t, a + 1.25))})`, fontFamily: FONT, fontWeight: 900, fontSize: 70, letterSpacing: 6, color: COL.ink, whiteSpace: "nowrap", textShadow: extrude(8, "#0b1220") }}>2 YEARS</div>
    </div>
  );
};

// E · lo que la nonna NO tenía: tres fichas de madera tachadas, y la frase que importa
const NoChips: React.FC<{ t: number }> = ({ t }) => {
  const items: [string, number][] = [["NO FRIDGE", at("no fridge")], ["NO MONEY", at("no money")], ["NOTHING", at("nothing", 33)]];
  const out = 36.75;
  return (
    <>
      {items.map(([txt, a], i) => {
        const k = Math.min(1.1, spr(t, a)), o = e(t, a, a + 0.1) * (1 - e(t, out - 0.2, out));
        if (o < 0.01) return null;
        const strike = e(t, a + 0.35, a + 0.6);
        return (
          <div key={i} style={{ position: "absolute", left: 120, top: 210 + i * 150, opacity: o, transform: `perspective(900px) rotateY(${(1 - Math.min(1, k)) * -80}deg)`, transformOrigin: "0 50%" }}>
            <div style={{ position: "relative", padding: "14px 34px", background: "linear-gradient(180deg,#6a4529,#432a17)", borderRadius: 12, borderLeft: `8px solid ${COL.tomato}`, boxShadow: "0 20px 40px rgba(0,0,0,.6)", fontFamily: FONT, fontWeight: 900, fontSize: 62, letterSpacing: 4, color: COL.ink }}>
              {txt}
              <div style={{ position: "absolute", left: 20, top: "52%", height: 9, width: `calc(${strike * 100}% - 40px)`, background: COL.tomato, borderRadius: 5, transform: "rotate(-3deg)", boxShadow: `0 0 14px ${COL.tomato}` }} />
            </div>
          </div>
        );
      })}
      {(() => {
        const a = at("nobody ever went"), o = e(t, a, a + 0.2) * (1 - e(t, out - 0.2, out));
        if (o < 0.01) return null;
        const n = Math.round(30 * e(t, a, a + 1.5));
        const txt = "and nobody went to bed hungry.";
        return <div style={{ position: "absolute", left: 110, top: 690, opacity: o, fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 66, color: COL.gold, textShadow: extrude(5, "#1d0d03"), whiteSpace: "nowrap" }}>{txt.slice(0, n)}</div>;
      })()}
    </>
  );
};

// F · la receta de la nonna "SERVES 6": 6 platos, se van 5, queda 1
const RecipeCard: React.FC<{ t: number }> = ({ t }) => {
  const a = at("family of 6"), b = at("cook for 1"), out = 48.45;
  const o = e(t, a - 0.3, a) * (1 - e(t, out - 0.25, out));
  if (o < 0.01) return null;
  const k = Math.min(1.08, spr(t, a - 0.3, 0.8));
  const six = e(t, a + 0.3, a + 0.4);
  const cross = e(t, b + 0.15, b + 0.4);
  return (
    <div style={{ position: "absolute", left: 1290, top: 140, opacity: o, perspective: 1300 }}>
      <div style={{ width: 520, padding: "34px 40px", background: "linear-gradient(180deg,#f7ecd3,#e9d6af)", borderRadius: 8, boxShadow: "0 50px 90px rgba(0,0,0,.7)", transform: `rotateX(${(1 - Math.min(1, k)) * 70 + 8}deg) rotateZ(${3 - 2 * k}deg) translateZ(${(1 - Math.min(1, k)) * -400}px)`, transformOrigin: "50% 100%", fontFamily: SERIF, color: "#3a2414" }}>
        <div style={{ fontStyle: "italic", fontWeight: 900, fontSize: 54 }}>Pasta e Fagioli</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 5, color: "#8a5a32", marginTop: 4 }}>NONNA ROSA'S RECIPE</div>
        <div style={{ height: 2, background: "#c9a676", margin: "18px 0" }} />
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: 4, position: "relative", display: "inline-block" }}>
          SERVES <span style={{ color: COL.tomato, opacity: six * (1 - cross) }}>6</span>
          <span style={{ position: "absolute", right: -6, top: -10, color: COL.olive, fontSize: 86, opacity: cross, transform: `scale(${Math.min(1.1, spr(t, b + 0.2))})` }}>1</span>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 26, height: 80 }}>
          {Array.from({ length: 6 }, (_, i) => {
            const pop = Math.min(1.1, spr(t, a + 0.35 + i * 0.1));
            const gone = i > 0 ? ei(t, b + 0.2 + (i - 1) * 0.12, b + 0.75 + (i - 1) * 0.12) : 0;
            return <div key={i} style={{ width: 64, height: 64, borderRadius: "50%", background: "radial-gradient(circle at 50% 45%, #8a4a26 0 44%, #f3ead8 46% 100%)", border: "3px solid #2f5e8c", boxShadow: "0 8px 14px rgba(0,0,0,.35)", opacity: 1 - gone, transform: `translate(${gone * 380}px, ${gone * -40}px) rotate(${gone * 200}deg) scale(${pop})` }} />;
          })}
        </div>
      </div>
    </div>
  );
};

// G · fila de 10 ollitas de cobre (debajo, sin tapar la cara)
const TenPots: React.FC<{ t: number }> = ({ t }) => {
  const a = at("10 one pot dinners"), out = 52.85;
  const o = e(t, a - 0.1, a + 0.1) * (1 - e(t, out - 0.2, out));
  if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: 620, opacity: o, width: 640 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
        {Array.from({ length: 10 }, (_, i) => {
          const k = Math.min(1.12, spr(t, a + 0.05 + i * 0.09));
          return (
            <div key={i} style={{ width: 104, height: 86, position: "relative", transform: `translateY(${(1 - Math.min(1, k)) * 160}px) scale(${k})` }}>
              <div style={{ position: "absolute", left: 6, right: 6, top: 22, bottom: 0, borderRadius: "10px 10px 34px 34px", background: "linear-gradient(90deg,#7a3c1c,#d88a52 40%,#9a4c24)", boxShadow: "0 10px 18px rgba(0,0,0,.5)" }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 14, height: 14, borderRadius: 8, background: "#e6a46a" }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 34, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff4e4", textShadow: "0 2px 6px rgba(0,0,0,.6)" }}>{i + 1}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, fontFamily: FONT, fontWeight: 900, fontSize: 48, letterSpacing: 3, color: COL.ink, textShadow: extrude(6, "#1d0d03"), opacity: e(t, a + 1.0, a + 1.3) }}>ONE-POT DINNERS <span style={{ color: COL.gold }}>FOR ONE</span></div>
    </div>
  );
};

// H · los 10 nombres suben de la olla como vapor
const NAMES = ["Pasta e Fagioli", "Pastina in Brodo", "Polenta & Sausage", "Skillet Gnocchi", "Beans & Greens", "Risi e Bisi", "One-Pot Spaghetti", "Ribollita", "Eggs in Purgatory", "Lentil Stew"];
const SteamNames: React.FC<{ t: number }> = ({ t }) => {
  const a = M.tenDinners, out = M.coffee + 0.2;
  if (t < a - 0.1 || t > out + 0.6) return null;
  const pot = screenOf(t, PT.pot);
  return (
    <>
      {NAMES.map((n, i) => {
        const st = a + 0.2 + i * 0.3, u = e(t, st, st + 2.6);
        const o = e(t, st, st + 0.3) * (1 - e(t, st + 2.1, st + 2.7)) * (1 - e(t, out, out + 0.5));
        if (o < 0.01) return null;
        const x = pot.x + (i % 2 ? 1 : -1) * (90 + 140 * u) + Math.sin(t * 1.3 + i) * 20, y = pot.y - 80 - 560 * u;
        return <div key={i} style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.75 + 0.35 * u})`, fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 54, color: "#fff6ea", whiteSpace: "nowrap", textShadow: "0 0 24px rgba(255,210,150,.8), 0 4px 12px rgba(0,0,0,.6)" }}>{n}</div>;
      })}
    </>
  );
};

// H · balanza: el café del drive-thru pesa más que la cena
const Scale: React.FC<{ t: number }> = ({ t }) => {
  const a = M.coffee, out = M.trick - 0.15;
  const o = e(t, a, a + 0.2) * (1 - e(t, out - 0.25, out));
  if (o < 0.01) return null;
  const tilt = -14 * ei(t, at("drive-thru") - 0.1, at("drive-thru") + 0.6) + 2 * Math.sin(t * 2);
  const k = Math.min(1.08, spr(t, a, 0.9));
  const pan = (side: number, label: string, price: string, col: string, icon: React.ReactNode) => (
    <div style={{ position: "absolute", left: 300 + side * 260, top: 120 - side * Math.sin((tilt * Math.PI) / 180) * 260, transform: "translate(-50%,0)", textAlign: "center" }}>
      <div style={{ width: 2, height: 70, background: "#c9a14a", margin: "0 auto" }} />
      <div style={{ height: 120, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>{icon}</div>
      <div style={{ width: 240, height: 22, borderRadius: "0 0 120px 120px", background: "linear-gradient(180deg,#e8c070,#9a6a2a)", margin: "0 auto" }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: col, textShadow: extrude(6, "#120802"), marginTop: 8 }}>{price}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: COL.dim }}>{label}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 1180, top: 160, width: 600, height: 520, opacity: o, transform: `scale(${0.6 + 0.4 * k})`, transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", left: 296, top: 0, width: 8, height: 420, background: "linear-gradient(90deg,#9a6a2a,#e8c070,#9a6a2a)" }} />
      <div style={{ position: "absolute", left: 300, top: 120, width: 540, height: 10, marginLeft: -270, background: "#d9a95a", borderRadius: 5, transform: `rotate(${tilt}deg)` }} />
      {pan(-1, "DRIVE-THRU", "$4.50", COL.tomato,
        <div style={{ width: 70, height: 96, background: "linear-gradient(90deg,#f2f2f2,#d9d9d9)", borderRadius: "4px 4px 14px 14px", position: "relative" }}><div style={{ position: "absolute", top: -14, left: -6, right: -6, height: 16, background: "#5a3a22", borderRadius: 6 }} /><div style={{ position: "absolute", top: 34, left: 0, right: 0, height: 26, background: "#8a5a32" }} /></div>)}
      {pan(1, "A DINNER", "$0.80", COL.olive,
        <div style={{ width: 120, height: 60, borderRadius: "0 0 60px 60px", background: "radial-gradient(ellipse at 50% 0%, #8a4a26 0 55%, #f3ead8 57%)", border: "3px solid #2f5e8c", borderTop: "none" }} />)}
    </div>
  );
};

// I · "alguien de tu familia te va a discutir": globos que entran de los costados
const Argue: React.FC<{ t: number }> = ({ t }) => {
  const a = at("somebody in your family"), out = 69.05;
  const lines: [string, number, number, number][] = [["That's NOT how Nonna did it!", 120, 230, a + 0.9], ["No cream?!", 1510, 160, at("argue") - 0.05], ["Pasta goes in SEPARATE!", 150, 520, at("argue") + 0.35]];
  return (
    <>
      {lines.map(([txt, x, y, st], i) => {
        const k = Math.min(1.12, spr(t, st, 1.1)), o = e(t, st, st + 0.08) * (1 - e(t, out - 0.2, out));
        if (o < 0.01) return null;
        const wob = Math.sin((t - st) * 9) * 2 * (1 - e(t, st, st + 0.8));
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${k}) rotate(${(i % 2 ? 4 : -4) + wob}deg)`, transformOrigin: i === 1 ? "100% 100%" : "0 100%" }}>
            <div style={{ position: "relative", padding: "20px 34px", background: "#fffaf0", borderRadius: 40, border: "5px solid #2a1a10", fontFamily: FONT, fontWeight: 900, fontSize: 48, color: "#2a1a10", boxShadow: "8px 12px 0 rgba(0,0,0,.35)", whiteSpace: "nowrap" }}>
              {txt}
              <div style={{ position: "absolute", bottom: -30, [i === 1 ? "right" : "left"]: 50, width: 0, height: 0, borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderTop: "34px solid #2a1a10" } as React.CSSProperties} />
            </div>
          </div>
        );
      })}
    </>
  );
};

// ======================= COMPOSICIÓN =======================
export const Min1: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const L: React.ReactNode[] = [];
  const [A, C, E, G, I] = W1;

  // ---- el mundo, siempre detrás (sólo se monta cuando se ve) ----
  const worldOn = !(t < A.me - 0.25) && t < 69.4 || t > 71.5;
  if (worldOn || t < A.me + 0.4) L.push(<World key="w" t={t} />);

  // ---- B · departamento ----
  if (t > 3.3 && t < 16.2) {
    const on = PT;
    // rótulos: la línea sale hacia el lado libre de la pantalla (nunca se cortan en el borde)
    const tg = (key: string, a: number, q: [number, number, number], text: string, dy: number, sub?: string) => {
      const p = screenOf(t, q); const dx = p.x > 960 ? -280 : 280;
      return <Tag key={key} t={t} at={a} x={p.x} y={p.y} dx={dx} dy={dy} text={text} sub={sub} out={7.35} />;
    };
    L.push(tg("t1", at("half an onion"), on.onion, "HALF AN ONION", -110));
    L.push(tg("t2", at("one egg"), on.egg, "ONE EGG", 70));
    L.push(tg("t3", at("bag of beans"), on.beans, "A BAG OF BEANS", -40, "BOUGHT IN MARCH"));
    // la toma real de la heladera: lo poco que hay, de verdad (la puerta se cierra después en el 3D)
    const pr0 = Math.min(ei(t, 7.35, 7.85), 1 - ei(t, 10.15, 10.6));
    if (pr0 > 0.001) { const f = screenOf(t, PT.fridge); L.push(<Portal key="pf0" x={f.x} y={f.y} r={pr0}><Clip id="m_fridge" t={t} a={7.35} /></Portal>); }
    L.push(<Stamp key="s1" t={t} at={at("never made")} text="NEVER MADE" x={560} y={820} out={10.2} size={92} />);
    L.push(<Takeout key="to" t={t} />);
    L.push(<Stamp key="s2" t={t} at={at("tastes like the box")} text="TASTES LIKE THE BOX" x={1390} y={860} out={15.55} size={70} rot={-6} />);
  }
  // ---- D · la mesa para dos, el calendario, la ventana ----
  if (t > 19 && t < 31.9) {
    L.push(<Calendar key="cal" t={t} />);
    const wp = at("wife passed"), o = e(t, wp, wp + 0.6) * (1 - e(t, at("and then one night") - 0.3, at("and then one night")));
    if (o > 0.01) { const c = screenOf(t, [1.4, 0.95, 1.24]); L.push(<div key="ch" style={{ position: "absolute", left: c.x, top: c.y - 150, opacity: o * 0.95, transform: "translate(-50%,-50%)", fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 46, color: COL.cream, textShadow: "0 3px 14px #000", whiteSpace: "nowrap" }}>her chair</div>); }
    // velo de luz cálida: la ventana se enciende, la luz lo llena todo y se abre adentro de la cocina de la nonna
    const veil = Math.min(e(t, M.kitchen - 0.2, M.kitchen + 0.1), 1 - e(t, M.rosa - 0.25, M.rosa + 0.2));
    if (veil > 0.01) L.push(<AbsoluteFill key="veil" style={{ opacity: veil, background: "radial-gradient(ellipse at 50% 48%, #fff1d6 0%, #ffc27a 45%, #e08a3c 100%)" }} />);
    L.push(<BigNum key="n9" t={t} at={M.kids} text="9" sub="KIDS" x={1480} y={330} size={300} col={COL.gold} out={at("with 1 pot") - 0.1} />);
    const pt = screenOf(t, PT.pot);
    L.push(<Tag key="t4" t={t} at={M.onePot} x={pt.x} y={pt.y} dx={220} dy={-160} text="1 BLACK POT" col={COL.gold} out={31.6} />);
    const sv = screenOf(t, PT.stove);
    L.push(<Tag key="t5" t={t} at={M.stove} x={sv.x} y={sv.y} dx={260} dy={60} text="A WOOD STOVE" sub="NO FRIDGE · NO GAS" out={31.6} />);
  }
  // ---- F · la mesa larga: no eras vos ----
  if (t > 36.5 && t < 49) {
    const a = M.neverYou, o = e(t, a, a + 0.25) * (1 - e(t, at("every recipe") - 0.3, at("every recipe")));
    if (o > 0.01) L.push(
      <div key="nv" style={{ position: "absolute", left: 130, top: 300, opacity: o, perspective: 1000 }}>
        <div style={{ transform: `rotateY(${(1 - Math.min(1, spr(t, a))) * -60}deg)`, transformOrigin: "0 50%", fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 120, lineHeight: 1.05, color: COL.ink, textShadow: extrude(10, "#1d0d03") }}>It was never<br /><span style={{ color: COL.gold }}>you.</span></div>
      </div>);
    L.push(<Stamp key="s3" t={t} at={at("not lazy")} text="LAZY ✗" x={1500} y={360} out={at("every recipe") - 0.2} size={96} rot={8} />);
    L.push(<Stamp key="s4" t={t} at={at("bad cook")} text="BAD COOK ✗" x={1450} y={600} out={at("every recipe") - 0.2} size={96} rot={-7} />);
    L.push(<RecipeCard key="rc" t={t} />);
    L.push(<Stamp key="s5" t={t} at={at("not you", 47)} text="THE RECIPE WAS WRONG" x={560} y={800} out={48.45} size={64} col={COL.gold} rot={-4} />);
  }
  // ---- H · sobre la olla ----
  if (t > 52.7 && t < 64.3) {
    L.push(<SteamNames key="sn" t={t} />);
    L.push(<Scale key="sc" t={t} />);
    // portal a Marcello revolviendo (la toma real) en "the old trick"
    const tr = M.trick, pr = Math.min(ei(t, tr - 0.1, tr + 0.5), 1 - ei(t, 63.05, 63.5));
    if (pr > 0.001) { const p = screenOf(t, PT.pot); L.push(<Portal key="ps" x={p.x} y={p.y} r={pr}><Clip id="m_stir" t={t} a={tr - 0.1} /></Portal>); }
    L.push(<Tag key="t6" t={t} at={at("costs on the plate")} x={1180} y={640} dx={160} dy={-80} text="$1.40" sub="A PLATE · PASTA E FAGIOLI" col={COL.gold} out={63.6} size={72} />);
    L.push(<Tag key="t7" t={t} at={tr + 0.3} x={760} y={560} dx={-180} dy={-120} text="THE OLD TRICK" sub="IN EVERY POT" out={63.6} />);
  }

  // ---- el presentador por iris (5 ventanas) ----
  const irisAt: [Wn, (tt: number) => { x: number; y: number }][] = [
    [A, () => ({ x: 420, y: 330 })],
    [C, () => screenOf(15.7, PT.phone)],
    [E, () => screenOf(31.7, PT.pot)],
    [G, (tt) => screenOf(tt, PT.table)],
    [I, (tt) => screenOf(tt, PT.pot)],
  ];
  irisAt.forEach(([w, pt], i) => {
    if (t < w.ms - 0.05 || t > w.me + 0.35) return;
    const r = i === 0 ? (t < w.me - 0.18 ? 1 : irisR(t, w)) : irisR(t, w);
    const p = pt(t);
    L.push(<Portal key={"av" + i} x={p.x} y={p.y} r={r}><Avatar t={t} /></Portal>);
  });
  // piezas sobre el presentador (a los costados, nunca sobre la cara)
  if (t < 4) L.push(<Clock7 key="c7" t={t} />);
  if (t > C.ms && t < C.me + 0.3) {
    const a = at("crackers"), o = e(t, a - 0.1, a + 0.2) * (1 - e(t, C.me - 0.35, C.me - 0.1));
    const k = Math.min(1.08, spr(t, a - 0.1, 0.8));
    L.push(<Card3D key="cr" id={HAS.m_crackers ? "m_crackers" : "img_m_crackers"} at={HAS.m_crackers ? a - 0.1 : undefined} x={90} y={200} w={600} h={338} ry={18 + (1 - Math.min(1, k)) * 50} rz={-2} z={(1 - Math.min(1, k)) * -500} o={o} label="DINNER, OVER THE SINK" />);
  }
  if (t > E.ms && t < E.me + 0.3) L.push(<NoChips key="nc" t={t} />);
  if (t > G.ms && t < G.me + 0.3) L.push(<TenPots key="tp" t={t} />);
  if (t > I.ms && t < I.me + 0.3) L.push(<Argue key="ar" t={t} />);

  // ---- J · "You will be eating": toma real de Marcello comiendo, y el rótulo ----
  if (t > I.me - 0.3 && t < 72.1) {
    const r = Math.min(ei(t, I.me - 0.2, I.me + 0.3), 1 - ei(t, 71.55, 72.05));
    L.push(<Portal key="pe" x={1080} y={330} r={r}><Clip id="m_eat" t={t} a={I.me - 0.2} push={0.08} /></Portal>);
  }
  {
    const a = at("you will be eating"), o = e(t, a, a + 0.3) * (1 - e(t, at("you know me") - 0.25, at("you know me")));
    if (o > 0.01) L.push(<div key="ye" style={{ position: "absolute", left: 120, top: 760, opacity: o, fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 96, color: COL.ink, textShadow: extrude(8, "#1d0d03") }}>You will be <span style={{ color: COL.gold }}>eating.</span></div>);
  }
  L.push(<LowerThird key="lt" t={t} at={at("im marcelo") - 0.2} out={MIN1_END - 0.5} name="Marcello" l2="30 YEARS IN RESTAURANT KITCHENS" l2at={at("thirty years")} />);

  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>{L}</AbsoluteFill>;
};
