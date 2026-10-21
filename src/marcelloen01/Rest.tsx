// marcelloen01 · EL RESTO DEL VIDEO (76 s → final). Sigue el MISMO plano: la cámara de restkeys.ts recorre la cocina de la nonna,
// la olla cambia con cada cena (kitchen3d) y Marcello entra y sale por iris nítido. Cada cena tiene su pieza PROPIA (nada reciclado):
// fagioli = el almidón que se va por la pileta · pastina = la perilla del fuego · polenta = agua fría vs hirviendo ·
// ñoquis = 3 ollas → 1 sartén · escarola = el termómetro del ajo · risi e bisi = la proporción · spaghetti = el agua que baja ·
// la cuenta = el ticket · ribollita = día 1 / día 2 · purgatorio = los nidos y la tapa · lentejas = la sal al final.
// Todo clavado a la voz con at(). Audio FUERA de Remotion. Render SÓLO en el farm (acá sólo stills).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { screenOf, PT } from "./kitchen3d";
import { CH, END } from "./restkeys";
import { Avatar, World, WIN, irisR, MIN1_END, Min1, type Wn } from "./Min1";
import { FONT, SERIF, e, ei, spr, rnd, COL, at, extrude, Portal, Tag, BigNum, Stamp, s, Vid } from "./lib";
import shotsJson from "./shots.json";

export const FULL_FRAMES = s(END);
const WR = WIN.filter((w) => w.ms >= MIN1_END);
const k1 = (t: number, a: number, f = 1) => Math.min(1.1, spr(t, a, f));
const fade = (t: number, a: number, out: number, fi = 0.2, fo = 0.3) => e(t, a - 0.05, a + fi) * (1 - e(t, out - fo, out));
// cuánto se ve el presentador ahora (0..1, sigue al iris)
const avAmt = (t: number) => WR.reduce((m, w) => (t > w.ms - 0.05 && t < w.me + 0.35 ? Math.max(m, irisR(t, w)) : m), 0);
// zona de las piezas grandes: ×1.2; sólo mundo = pegada a la derecha; con Marcello en cuadro = se corre a la izquierda (nunca sobre la cara)
const Zone: React.FC<{ t: number; x0: number; w: number; children: React.ReactNode }> = ({ t, x0, w, children }) => {
  const S = 1.2, av = avAmt(t), xr = 1870 - S * w, xl = 50, x = xr + (xl - xr) * av;
  return <div style={{ position: "absolute", inset: 0, transformOrigin: `${x0}px 160px`, transform: `translateX(${x - x0}px) scale(${S})` }}>{children}</div>;
};
const onScreen = (p: { x: number; y: number }) => p.x > 160 && p.x < 1760 && p.y > 120 && p.y < 960;

// ======================= MARCELLO HACIENDO LO QUE DICE (fotos gpt + clips agnes) =======================
// cada foto entra por iris en SU frase y se queda hasta la próxima (tope 6,5 s); nunca pisa una ventana del avatar
// (si la frase cae dentro de una, arranca cuando el avatar se va); las de <2 s se descartan. Clip si existe, si no la foto con empuje lento.
type Shot = { n: string; ms: number; me: number; off: number; clip: boolean };
const SHOTS: Shot[] = (() => {
  const raw = (shotsJson as { n: string; at: string; clip: boolean }[]).map((x) => ({ ...x, a: at(x.at, 76) }));
  const out: Shot[] = [];
  raw.forEach((x, i) => {
    let ms = x.a - 0.15;
    for (const w of WR) if (ms > w.ms - 0.3 && ms < w.me + 0.3) ms = w.me + 0.3;
    let me = Math.min(ms + 6.5, (raw[i + 1]?.a ?? END) - 0.2);
    for (const w of WR) if (w.ms > ms && w.ms - 0.1 < me) me = w.ms - 0.1;
    if (x.clip) me = Math.min(me, ms + 2.9); // el clip agnes dura 3 s
    if (me - ms >= (i === raw.length - 1 ? 1.5 : 2)) out.push({ n: x.n, ms, me, off: 0, clip: x.clip });
  });
  return out;
})();
const Shots: React.FC<{ t: number }> = ({ t }) => {
  const sh = SHOTS.find((x) => t > x.ms - 0.05 && t < x.me + 0.35);
  if (!sh) return null;
  let p = { x: 960, y: 540 };
  for (const c of [PT.pot, PT.table, PT.stove]) { const q = screenOf(sh.ms, c); if (onScreen(q)) { p = q; break; } }
  const push = 1.04 + 0.07 * e(t, sh.ms, sh.me);
  return (
    <Portal x={p.x} y={p.y} r={irisR(t, sh)}>
      {sh.clip ? <Vid id={sh.n} at={sh.ms} style={{ transform: `scale(${push})` }} /> : <Vid id={"img_" + sh.n} style={{ transform: `scale(${push})` }} />}
    </Portal>
  );
};

// ======================= PIEZAS COMUNES DEL FORMATO (una por cena, con datos distintos) =======================

// pizarra de la cena: "DINNER Nº 3 · Polenta · with one sausage" (cae desde arriba, colgada de un clavo)
const DinnerCard: React.FC<{ t: number; a: number; n: number; it: string; en: string; out: number }> = ({ t, a, n, it, en, out }) => {
  const o = fade(t, a, out); if (o < 0.01) return null;
  const k = k1(t, a, 0.9), sw = Math.sin((t - a) * 5) * 5 * Math.exp(-(t - a) * 1.4);
  return (
    <div style={{ position: "absolute", left: 96, top: 60, opacity: o, transformOrigin: "50% -40px", transform: `translateY(${(1 - Math.min(1, k)) * -420}px) rotate(${sw}deg)` }}>
      <div style={{ position: "absolute", left: "50%", top: -60, width: 2, height: 64, background: "#c9a14a" }} />
      <div style={{ padding: "26px 44px 30px", background: "linear-gradient(160deg,#26302a,#141a16)", border: "12px solid #6a4529", borderRadius: 10, boxShadow: "0 40px 80px rgba(0,0,0,.65), inset 0 0 40px rgba(0,0,0,.6)", minWidth: 520 }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 8, color: COL.gold }}>DINNER Nº {n}</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 84, lineHeight: 1.02, color: "#f4f1ea", marginTop: 6, textShadow: "0 0 2px rgba(255,255,255,.4)" }}>{it}</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: "rgba(244,241,234,.75)", marginTop: 8, opacity: e(t, a + 0.6, a + 1) }}>{en}</div>
      </div>
    </div>
  );
};

// los ingredientes: cada uno aparece al costado en su palabra y vuela EN ARCO a la olla (si la olla está en cuadro)
const IntoPot: React.FC<{ t: number; items: [string, number][]; side?: 1 | -1 }> = ({ t, items, side = 1 }) => (
  <>
    {items.map(([label, a], i) => {
      const fly = ei(t, a + 1.0, a + 1.75);
      const o = e(t, a - 0.05, a + 0.15) * (1 - e(t, a + 1.55, a + 1.8));
      if (o < 0.01) return null;
      const x0 = side > 0 ? 1430 : 330, y0 = 250 + (i % 5) * 120;
      let p = screenOf(t, PT.pot); if (!onScreen(p)) p = { x: 960, y: 1180 };
      const x = x0 + (p.x - x0) * fly, y = y0 + (p.y - y0) * fly - Math.sin(fly * Math.PI) * 220;
      const k = k1(t, a);
      return (
        <div key={i} style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${(0.5 + 0.5 * k) * (1 - 0.7 * fly)}) rotate(${fly * 160 * side}deg)` }}>
          <div style={{ padding: "12px 28px", background: "#fbf3e4", color: "#3a2414", borderRadius: 40, fontFamily: FONT, fontWeight: 900, fontSize: 44, whiteSpace: "nowrap", boxShadow: "0 14px 30px rgba(0,0,0,.5)", borderBottom: `6px solid ${COL.terra}` }}>{label}</div>
        </div>
      );
    })}
  </>
);

// etiqueta de precio de papel colgada de un hilo (se balancea y se queda quieta)
const PriceTag: React.FC<{ t: number; a: number; out: number; price: string; sub?: string; x?: number }> = ({ t, a, out, price, sub = "A PLATE", x = 1560 }) => {
  const o = fade(t, a, out); if (o < 0.01) return null;
  const d = t - a, sw = Math.sin(d * 4.2) * 18 * Math.exp(-d * 1.1), drop = Math.min(1.04, spr(t, a, 0.8));
  return (
    <div style={{ position: "absolute", left: x, top: 0, opacity: o, transformOrigin: "50% 0", transform: `rotate(${sw}deg)` }}>
      <div style={{ width: 3, height: 140 + 120 * Math.min(1, drop), background: "#d9c7a0", margin: "0 auto" }} />
      <div style={{ position: "relative", padding: "26px 40px 22px 60px", background: "linear-gradient(180deg,#f6e7c6,#e3c995)", clipPath: "polygon(22% 0,100% 0,100% 100%,22% 100%,0 50%)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", textAlign: "center" }}>
        <div style={{ position: "absolute", left: 22, top: "50%", width: 18, height: 18, marginTop: -9, borderRadius: "50%", background: "#3a2414" }} />
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 92, color: "#7a1e10", lineHeight: 1 }}>{price}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 5, color: "#6a4529", marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};

// la regla de cada cena, escrita a mano abajo ("the pasta cooks where it lives.")
const Rule: React.FC<{ t: number; a: number; out: number; text: string }> = ({ t, a, out, text }) => {
  const o = fade(t, a, out); if (o < 0.01) return null;
  const n = Math.round(text.length * e(t, a, a + 1.3));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", opacity: o }}>
      <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 76, color: COL.gold, textShadow: extrude(6, "#1d0d03") }}>{text.slice(0, n)}</span>
    </div>
  );
};

// ======================= INTRO + CTA (76 → 116 s) =======================

// "a little boy sitting on a wooden stool... watching her hands": banquito de madera dibujado + "ABRUZZO"
const Stool: React.FC<{ t: number }> = ({ t }) => {
  const a = at("a little boy sitting"), out = at("her kitchen was made of stone") - 0.1;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const k = k1(t, a + 0.4);
  return (
    <div style={{ position: "absolute", left: 1330, top: 220, opacity: o, textAlign: "center" }}>
      <svg width={320} height={300} viewBox="0 0 320 300" style={{ transform: `scale(${k})`, transformOrigin: "50% 100%", filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
        <ellipse cx={160} cy={70} rx={130} ry={34} fill="#a8723e" /><rect x={30} y={70} width={260} height={22} fill="#7a4e28" />
        {[[60, 0.12], [260, -0.12], [120, 0.04], [200, -0.04]].map(([x, r], i) => <rect key={i} x={x - 9} y={86} width={18} height={200} fill="#6a4122" transform={`rotate(${r * 57} ${x} 86)`} />)}
        <rect x={50} y={200} width={220} height={12} fill="#5a3a22" />
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 6, color: COL.ink, textShadow: extrude(6, "#1d0d03"), opacity: e(t, at("in abruzzo"), at("in abruzzo") + 0.3) }}>ABRUZZO</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: COL.cream, opacity: e(t, at("watching her hands"), at("watching her hands") + 0.4) }}>watching her hands</div>
    </div>
  );
};

// "cold in the morning, warm all day": barra de temperatura de la piedra a lo largo del día
const StoneDay: React.FC<{ t: number }> = ({ t }) => {
  const a = at("cold in the morning"), out = at("over on my spanish channel");
  const o = fade(t, a, out); if (o < 0.01) return null;
  const warm = ei(t, at("warm all day") - 0.2, at("warm all day") + 1.0);
  return (
    <div style={{ position: "absolute", left: 110, top: 760, opacity: o, width: 760 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: COL.dim }}><span>6 AM</span><span>NOON</span><span>NIGHT</span></div>
      <div style={{ height: 30, borderRadius: 15, marginTop: 8, background: "rgba(0,0,0,.45)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${12 + 88 * warm}%`, background: "linear-gradient(90deg,#8fbfe0,#ffc15e 35%,#e8642e)", borderRadius: 15 }} />
      </div>
      <div style={{ marginTop: 10, fontFamily: FONT, fontWeight: 900, fontSize: 46, color: COL.ink, textShadow: extrude(5, "#1d0d03"), whiteSpace: "nowrap" }}>
        COLD STONE <span style={{ color: COL.gold, opacity: warm }}>→ WARM ALL DAY</span>
      </div>
    </div>
  );
};

// "it always smelled like garlic and wood smoke": dos estelas de olor que suben con su palabra
const Smell: React.FC<{ t: number }> = ({ t }) => {
  const a = at("garlic and wood smoke"), out = at("over on my spanish channel") + 0.4;
  const o = fade(t, a, out); if (o < 0.01) return null;
  return (
    <>
      {[["GARLIC", 700, a], ["WOOD SMOKE", 1220, a + 0.5]].map(([txt, x, st], i) => {
        const u = e(t, st as number, (st as number) + 3);
        return <div key={i} style={{ position: "absolute", left: (x as number) + Math.sin(t * 1.6 + i) * 40, top: 640 - 380 * u, opacity: o * e(t, st as number, (st as number) + 0.3), transform: `translate(-50%,-50%) scale(${0.8 + 0.4 * u})`, fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 72, color: "#fff6ea", textShadow: "0 0 30px rgba(255,220,170,.9), 0 4px 12px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{txt as string}</div>;
      })}
    </>
  );
};

// "the way Nonna cooked when there was nothing, but now for one": 9 → 1
const NineToOne: React.FC<{ t: number }> = ({ t }) => {
  const a = at("when there was nothing"), b = at("but now for one"), out = at("quick before we start");
  const o = fade(t, a, out); if (o < 0.01) return null;
  const go = ei(t, b, b + 0.8);
  return (
    <div style={{ position: "absolute", left: 1220, top: 660, opacity: o, display: "flex", gap: 14 }}>
      {Array.from({ length: 9 }, (_, i) => {
        const gone = i === 4 ? 0 : go, pop = k1(t, a + i * 0.06);
        return <div key={i} style={{ width: 56, height: 56, borderRadius: "50%", background: "radial-gradient(circle at 50% 45%, #8a4a26 0 44%, #f3ead8 46% 100%)", border: "3px solid #2f5e8c", opacity: 1 - gone, transform: `translateY(${gone * -200 * (1 + rnd(i, 3))}px) scale(${pop * (1 + (i === 4 ? go * 0.8 : 0))})` }} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 48, color: COL.gold, textShadow: extrude(5, "#1d0d03"), opacity: go }}>NOW, FOR ONE</div>
    </div>
  );
};

// CTA de voz: botón SUBSCRIBE que un cursor aprieta, campanita que suena, y el pan de la semana que viene (sin link)
const Subscribe: React.FC<{ t: number }> = ({ t }) => {
  const a = at("subscribe", 100), bell = at("ring the little bell"), bread = at("her bread", 100), out = at("and tell me in the comments", 100) + 0.2;
  const o = fade(t, a - 0.3, out); if (o < 0.01) return null;
  const click = e(t, a + 0.35, a + 0.45), press = Math.sin(Math.PI * e(t, a + 0.3, a + 0.55));
  const cx = 1100 + 380 * (1 - ei(t, a - 0.2, a + 0.35)), cy = 880 + 160 * (1 - ei(t, a - 0.2, a + 0.35));
  const ring = Math.sin((t - bell) * 28) * 22 * Math.exp(-Math.max(0, t - bell) * 2) * (t > bell ? 1 : 0);
  const bo = fade(t, bread, out);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o }}>
      <div style={{ position: "absolute", left: 960, top: 840, transform: `translate(-50%,-50%) scale(${k1(t, a - 0.3) * (1 - 0.06 * press)})`, display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ padding: "22px 54px", borderRadius: 50, background: click > 0.5 ? "#3d3d3d" : "#e62117", fontFamily: FONT, fontWeight: 900, fontSize: 54, letterSpacing: 3, color: "#fff", boxShadow: "0 20px 44px rgba(0,0,0,.55)" }}>{click > 0.5 ? "SUBSCRIBED" : "SUBSCRIBE"}</div>
        <svg width={100} height={100} viewBox="0 0 24 24" style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 10%", opacity: e(t, bell - 0.3, bell), filter: "drop-shadow(0 10px 20px rgba(0,0,0,.6))" }}>
          <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6V11c0-3.1-1.64-5.64-4.5-6.32V4a2.5 2.5 0 0 0-5 0v.68C6.63 5.36 5 7.9 5 11v5l-2 2v1h18v-1l-2-2z" fill={t > bell ? COL.gold : "#fff"} />
        </svg>
      </div>
      {/* cursor */}
      <svg width={64} height={64} viewBox="0 0 24 24" style={{ position: "absolute", left: cx, top: cy, opacity: 1 - e(t, a + 1.0, a + 1.3), transform: `scale(${1 - 0.15 * press})` }}><path d="M4 2l16 10-7 1.5L9.5 21z" fill="#fff" stroke="#000" strokeWidth={1.2} /></svg>
      {/* el pan de la semana que viene */}
      {bo > 0.01 && (
        <div style={{ position: "absolute", left: 1500, top: 300, opacity: bo, transform: `translate(-50%,-50%) scale(${k1(t, bread)})`, textAlign: "center" }}>
          <div style={{ width: 260, height: 150, margin: "0 auto", borderRadius: "130px 130px 40px 40px", background: "radial-gradient(ellipse at 40% 30%, #e7b267, #b9772f 60%, #8a531f)", boxShadow: "0 24px 50px rgba(0,0,0,.6)", position: "relative" }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 60 + i * 55, top: 40, width: 40, height: 8, borderRadius: 4, background: "rgba(90,50,15,.55)", transform: "rotate(-25deg)" }} />)}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 4, color: COL.ink, marginTop: 16, textShadow: extrude(5, "#1d0d03") }}>NEXT WEEK</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 50, color: COL.gold }}>Nonna's bread</div>
        </div>
      )}
    </div>
  );
};

// la pregunta del comentario, escribiéndose en una caja de comentario (es la 1ª línea de la descripción)
const CommentBox: React.FC<{ t: number; a: number; out: number; q: string; y?: number }> = ({ t, a, out, q, y = 760 }) => {
  const o = fade(t, a, out); if (o < 0.01) return null;
  const n = Math.round(q.length * e(t, a + 0.4, a + 2.4));
  const caret = Math.floor(t * 2.5) % 2 === 0 && n < q.length;
  return (
    <div style={{ position: "absolute", left: 960, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k1(t, a)})`, width: 1180 }}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", padding: "30px 36px", background: "rgba(20,12,6,.92)", border: `3px solid ${COL.gold}`, borderRadius: 24, boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
        <div style={{ width: 80, height: 80, flex: "0 0 80px", borderRadius: "50%", background: "radial-gradient(circle at 50% 38%, #f3d6b0 0 26%, #c98a52 27% 46%, #6a4529 47%)" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: COL.dim }}>TELL ME IN THE COMMENTS</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 58, lineHeight: 1.15, color: COL.ink, marginTop: 8, minHeight: 134 }}>{q.slice(0, n)}{caret ? "|" : ""}</div>
        </div>
      </div>
    </div>
  );
};

// ======================= LAS PIEZAS PROPIAS DE CADA CENA =======================

// 1 · el almidón: olla grande → colador → PILETA (se pierde) vs. la pasta EN los porotos (queda)
const StarchSink: React.FC<{ t: number }> = ({ t }) => {
  const a = at("all the starch"), sink = at("goes into the sink"), cream = at("makes the soup creamy"), two = at("wash two pots"), out = at("nonnas trick") + 0.3;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const flow = e(t, sink - 0.3, sink + 0.9), cr = e(t, cream, cream + 0.5);
  const drops = Array.from({ length: 14 }, (_, i) => { const ph = ((t * 1.3 + rnd(i, 4)) % 1); return { x: 160 + (rnd(i, 5) - 0.5) * 40, y: 120 + ph * 220, o: flow * (1 - ph) }; });
  return (
    <div style={{ position: "absolute", left: 1240, top: 110, opacity: o, width: 600, height: 620 }}>
      <svg width={600} height={420} viewBox="0 0 600 420">
        <defs><linearGradient id="wt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6efe0" /><stop offset="1" stopColor="#d9cdb4" /></linearGradient></defs>
        {/* olla grande de agua */}
        <path d="M60 30 h200 v80 q0 40 -40 40 h-120 q-40 0 -40 -40z" fill="#9aa3ad" stroke="#5c646d" strokeWidth={5} />
        <text x={160} y={95} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#26303a">WATER</text>
        {drops.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={7} fill="url(#wt)" opacity={d.o} />)}
        {/* pileta */}
        <path d="M40 340 h240 l-30 60 h-180z" fill="#6d757e" stroke="#40474e" strokeWidth={5} />
        <circle cx={160} cy={384} r={10} fill="#1d2126" />
        <text x={160} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={COL.tomato} opacity={flow}>STARCH → SINK</text>
        {/* la olla negra con la pasta adentro */}
        <path d="M360 200 h200 v90 q0 40 -40 40 h-120 q-40 0 -40 -40z" fill="#141416" stroke="#000" strokeWidth={5} opacity={cr} />
        <ellipse cx={460} cy={204} rx={96} ry={16} fill="#c9a06a" opacity={cr} />
        <text x={460} y={190} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={COL.olive} opacity={cr}>STARCH → SOUP</text>
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: COL.ink, textShadow: extrude(6, "#1d0d03"), opacity: e(t, two, two + 0.3) }}>
        <span style={{ textDecoration: "line-through", textDecorationColor: COL.tomato, textDecorationThickness: 8 }}>2 POTS</span> <span style={{ color: COL.gold }}>→ 1 POT</span>
      </div>
    </div>
  );
};

// 1 · el frasco de las cáscaras de parmesano "like treasure": cofre-frasco que brilla
const RindJar: React.FC<{ t: number }> = ({ t }) => {
  const a = at("like treasure"), out = at("when it boils you put in") + 0.2;
  const o = fade(t, a - 0.6, out); if (o < 0.01) return null;
  const k = k1(t, a - 0.6), glow = 0.5 + 0.5 * Math.sin(t * 4);
  return (
    <div style={{ position: "absolute", left: 300, top: 520, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center" }}>
      <div style={{ width: 200, height: 250, margin: "0 auto", borderRadius: "30px 30px 40px 40px", background: "rgba(220,240,245,.25)", border: "5px solid rgba(240,250,255,.7)", position: "relative", boxShadow: `0 0 ${40 + 40 * glow}px rgba(255,193,94,${0.4 + 0.3 * glow})` }}>
        <div style={{ position: "absolute", top: -26, left: 10, right: 10, height: 30, borderRadius: 8, background: "#8a6a4a" }} />
        {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 22 + (i % 3) * 52, bottom: 16 + Math.floor(i / 3) * 56, width: 52, height: 44, borderRadius: 8, background: "linear-gradient(135deg,#f2d27a,#c99a3a)", transform: `rotate(${(rnd(i, 7) - 0.5) * 40}deg)`, border: "3px solid #a0782a" }} />)}
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 3, color: COL.gold, marginTop: 14, textShadow: extrude(5, "#1d0d03") }}>PARMESAN RINDS</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 36, color: COL.cream }}>never throw them away</div>
    </div>
  );
};

// 2 · la perilla: EN el fuego = goma, FUERA del fuego = seda
const OffFire: React.FC<{ t: number }> = ({ t }) => {
  const a = at("you take the pot off the fire"), rub = at("becomes rubber"), silk = at("off the fire the egg becomes silk"), out = at("and it heals you") - 0.2;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const off = ei(t, a + 0.3, a + 1.0), flame = 1 - off;
  const card = (x: number, title: string, sub: string, col: string, st: number) => (
    <div style={{ position: "absolute", left: x, top: 380, width: 300, opacity: e(t, st, st + 0.25), transform: `perspective(800px) rotateY(${(1 - Math.min(1, k1(t, st))) * 70}deg)`, padding: "22px 24px", background: "rgba(20,12,6,.9)", borderTop: `8px solid ${col}`, borderRadius: 14, textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: COL.dim }}>{title}</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 66, color: col }}>{sub}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 1150, top: 120, opacity: o, width: 700, height: 640 }}>
      {/* perilla de la cocina que gira a OFF */}
      <div style={{ position: "absolute", left: 250, top: 0, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #e9e2d2, #a39a88)", boxShadow: "0 20px 40px rgba(0,0,0,.6)", transform: `rotate(${-120 * off}deg)` }}>
        <div style={{ position: "absolute", left: 92, top: 14, width: 16, height: 70, borderRadius: 8, background: "#2a1a10" }} />
      </div>
      <div style={{ position: "absolute", left: 250, top: 210, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: off > 0.5 ? COL.ice : COL.tomato }}>{off > 0.5 ? "OFF" : "ON"}</div>
      {/* llamitas que se apagan */}
      <div style={{ position: "absolute", left: 270, top: 270, display: "flex", gap: 18 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 28, height: 50 * flame * (0.8 + 0.2 * Math.sin(t * 12 + i)), borderRadius: "50% 50% 40% 40%", background: "linear-gradient(0deg,#ff6a1a,#ffd06a)", alignSelf: "flex-end" }} />)}</div>
      {card(0, "ON THE FIRE", "rubber", COL.tomato, rub)}
      {card(380, "OFF THE FIRE", "silk", COL.olive, silk)}
    </div>
  );
};

// 3 · polenta: el agua HIRVIENDO hace piedras, el agua FRÍA no; y "45 min" → "5 stirs"
const ColdWater: React.FC<{ t: number }> = ({ t }) => {
  const a = at("cold water everybody"), cold = at("nonna put the cornmeal in the cold water"), out = at("when it bubbles you put the lid") - 0.1;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const glass = (x: number, label: string, col: string, lumps: boolean, st: number) => {
    const fill = e(t, st + 0.3, st + 1.4);
    return (
      <div style={{ position: "absolute", left: x, top: 0, width: 240, textAlign: "center", opacity: e(t, st, st + 0.25) }}>
        <div style={{ width: 200, height: 260, margin: "0 auto", position: "relative", borderRadius: "0 0 26px 26px", border: "6px solid rgba(240,250,255,.8)", borderTop: "none", overflow: "hidden", background: "rgba(255,255,255,.06)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${70 * fill}%`, background: lumps ? "linear-gradient(180deg,#e8c04a,#d4a73a)" : "linear-gradient(180deg,#f1d36a,#e8c04a)" }} />
          {lumps && Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20 + rnd(i, 3) * 140, bottom: 10 + rnd(i, 4) * 120 * fill, width: 26 + rnd(i, 5) * 16, height: 22 + rnd(i, 6) * 14, borderRadius: "40%", background: "#b08a2a", opacity: fill, boxShadow: "inset -4px -4px 0 rgba(0,0,0,.25)" }} />)}
          {!lumps && Array.from({ length: 3 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 50, top: 30 + ((t * 40 + i * 30) % 60), width: 14, height: 14, borderRadius: "50%", background: "rgba(200,235,255,.6)" }} />)}
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: col, marginTop: 12 }}>{label}</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: COL.cream }}>{lumps ? "lumps like rocks" : "no lumps, ever"}</div>
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: 1180, top: 200, opacity: o, width: 640, height: 500 }}>
      {glass(0, "BOILING", COL.tomato, true, at("into boiling water"))}
      {glass(330, "COLD", COL.ice, false, cold)}
    </div>
  );
};
const StirCount: React.FC<{ t: number }> = ({ t }) => {
  const a = at("not 45 minutes of work"), out = at("in the same pot at the beginning") - 0.1;
  const o = fade(t, a - 0.3, out); if (o < 0.01) return null;
  const st = at("five times a"), n = Math.min(5, Math.floor(e(t, st, st + 1.4) * 5.99));
  return (
    <div style={{ position: "absolute", left: 120, top: 640, opacity: o }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.ink, textShadow: extrude(6, "#1d0d03") }}>
        <span style={{ textDecoration: "line-through", textDecorationColor: COL.tomato, textDecorationThickness: 10 }}>45 MIN OF WORK</span>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 16, alignItems: "center" }}>
        {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ width: 70, height: 70, borderRadius: "50%", border: `5px solid ${COL.gold}`, background: i < n ? COL.gold : "transparent", transform: `scale(${i < n ? 1.08 : 1})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#2a1a10" }}>{i < n ? "✓" : ""}</div>)}
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: COL.gold, marginLeft: 14, textShadow: extrude(5, "#1d0d03") }}>5 STIRS · 25 MIN</div>
      </div>
    </div>
  );
};

// 4 · ñoquis: tres ollas del restaurante caen; una sola sartén queda; el grill cuenta 3:00
const ThreePots: React.FC<{ t: number }> = ({ t }) => {
  const a = at("we boil the gnocchi"), alone = at("at home alone no"), out = at("the gnocchi do not need the water") + 0.4;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const gone = ei(t, alone, alone + 0.7);
  const steps = ["BOIL", "SAUCE", "BAKE"];
  return (
    <div style={{ position: "absolute", left: 1150, top: 220, opacity: o, width: 680 }}>
      <div style={{ display: "flex", gap: 24 }}>
        {steps.map((st, i) => {
          const pop = k1(t, at(i === 0 ? "we boil the gnocchi" : i === 1 ? "then we make the sauce" : "then we bake"));
          return <div key={i} style={{ width: 200, textAlign: "center", transform: `translateY(${gone * (400 + i * 80)}px) rotate(${gone * (i - 1) * 40}deg) scale(${pop})`, opacity: 1 - gone }}>
            <div style={{ width: 170, height: 120, margin: "0 auto", borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg,#5c646d,#aab3bc 45%,#6d757e)", boxShadow: "0 16px 30px rgba(0,0,0,.5)" }} />
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: COL.ink, marginTop: 10 }}>{i + 1}. {st}</div>
          </div>;
        })}
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, marginTop: 20, color: COL.ink, textShadow: extrude(6, "#1d0d03"), opacity: e(t, at("three pots", 310), at("three pots", 310) + 0.3) * (1 - gone) }}>3 POTS · 1 HOUR</div>
      <div style={{ position: "absolute", left: 0, top: 40, fontFamily: FONT, fontWeight: 900, fontSize: 84, color: COL.gold, textShadow: extrude(8, "#1d0d03"), opacity: gone, transform: `scale(${k1(t, alone + 0.5)})`, transformOrigin: "0 50%" }}>1 SKILLET.<br /><span style={{ fontSize: 46, color: COL.ink }}>NO WATER FOR THE GNOCCHI</span></div>
    </div>
  );
};
const Broiler: React.FC<{ t: number }> = ({ t }) => {
  const a = at("under the broiler"), out = at("look at this") + 1.6;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const left = Math.max(0, 180 - Math.floor(e(t, a + 0.5, at("look at this")) * 180));
  const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, "0");
  return (
    <div style={{ position: "absolute", left: 140, top: 300, opacity: o, transform: `scale(${k1(t, a)})`, transformOrigin: "0 0" }}>
      <div style={{ padding: "18px 40px", background: "#120a06", border: "4px solid #3a2a20", borderRadius: 18, fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 130, color: "#ff7a2e", textShadow: "0 0 24px #ff7a2e" }}>{mm}:{ss}</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 4, color: COL.ink, marginTop: 10 }}>BROILER · UNTIL BROWN SPOTS</div>
    </div>
  );
};

// 5 · escarola: termómetro del aceite. Caliente + ajo = 10 s quemado; frío + ajo = sube lento, color paja
const GarlicThermo: React.FC<{ t: number }> = ({ t }) => {
  const a = at("they heat the oil"), cold = at("nonna put the garlic in the cold oil"), straw = at("golden like straw"), out = at("you put in the greens") - 0.1;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const isCold = t > cold;
  const lvl = isCold ? 0.1 + 0.55 * e(t, cold + 0.8, straw) : 0.2 + 0.75 * ei(t, a, a + 1.4);
  const garlic = isCold ? (t > straw ? "#e2c46a" : "#f3ead6") : t > at("in 10 seconds the garlic") + 1.2 ? "#6a3a12" : "#f3ead6";
  return (
    <div style={{ position: "absolute", left: 1330, top: 140, opacity: o, width: 480, height: 700 }}>
      <div style={{ position: "absolute", left: 40, top: 0, width: 70, height: 560, borderRadius: 35, background: "rgba(255,255,255,.12)", border: "5px solid rgba(255,255,255,.65)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: isCold ? "linear-gradient(0deg,#ffc15e,#ffe08a)" : "linear-gradient(0deg,#e8432e,#ff8a3a)" }} />
      </div>
      <div style={{ position: "absolute", left: 22, top: 540, width: 106, height: 106, borderRadius: "50%", background: isCold ? "#ffc15e" : "#e8432e" }} />
      {/* láminas de ajo */}
      <div style={{ position: "absolute", left: 170, top: 180, display: "flex", gap: 14 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 70, height: 90, borderRadius: "50% 50% 45% 45%", background: garlic, border: "3px solid rgba(0,0,0,.25)", transform: `rotate(${(i - 1) * 14}deg)` }} />)}</div>
      <div style={{ position: "absolute", left: 170, top: 300, width: 300, fontFamily: FONT, fontWeight: 900, fontSize: 50, lineHeight: 1.05, color: isCold ? COL.gold : COL.tomato, textShadow: extrude(5, "#1d0d03") }}>{isCold ? (t > straw ? "GOLDEN LIKE STRAW" : "COLD OIL FIRST") : t > at("in 10 seconds the garlic") ? "10 SEC → BITTER" : "HOT OIL"}</div>
      {isCold && <div style={{ position: "absolute", left: 170, top: 430, width: 300, fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: COL.cream, opacity: e(t, at("sweet not bitter"), at("sweet not bitter") + 0.3) }}>sweet, not bitter</div>}
    </div>
  );
};

// 6 · risi e bisi: "30 minutos parado" tachado y la PROPORCIÓN 1/3 : 1¼ en dos vasos medidores
const Ratio: React.FC<{ t: number }> = ({ t }) => {
  const a = at("you think risotto"), rice = at("one third of a cup of rice"), broth = at("then one and a quarter"), out = at("toast the rice and the rice") - 0.2;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const cup = (x: number, fill: number, col: string, label: string, sub: string, st: number) => (
    <div style={{ position: "absolute", left: x, top: 150, width: 220, textAlign: "center", opacity: e(t, st, st + 0.3) }}>
      <div style={{ width: 170, height: 240, margin: "0 auto", position: "relative", border: "6px solid rgba(240,250,255,.8)", borderTop: "none", borderRadius: "0 0 20px 20px", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100 * e(t, st + 0.2, st + 1.1)}%`, background: col }} />
        {[0.25, 0.5, 0.75].map((m) => <div key={m} style={{ position: "absolute", right: 0, bottom: `${m * 100}%`, width: 40, height: 4, background: "rgba(255,255,255,.7)" }} />)}
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.ink, textShadow: extrude(5, "#1d0d03"), marginTop: 8 }}>{label}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: COL.dim }}>{sub}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 1200, top: 120, opacity: o, width: 640, height: 640 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: COL.ink, textShadow: extrude(5, "#1d0d03") }}>
        <span style={{ textDecoration: "line-through", textDecorationColor: COL.tomato, textDecorationThickness: 8, opacity: e(t, a + 0.2, a + 0.5) }}>30 MIN STANDING</span>
      </div>
      {cup(0, 0.33, "linear-gradient(180deg,#f3ead6,#d8cdb4)", "⅓", "CUP OF RICE", rice)}
      {cup(320, 1.0, "linear-gradient(180deg,#e8c06a,#c99a3a)", "1¼", "CUPS HOT BROTH", broth)}
      <div style={{ position: "absolute", left: 230, top: 250, fontFamily: FONT, fontWeight: 900, fontSize: 90, color: COL.gold, opacity: e(t, broth, broth + 0.3) }}>:</div>
    </div>
  );
};

// 7 · spaghetti: el agua (1¾ tazas) baja en 11 min y lo que queda es salsa
const WaterDrop: React.FC<{ t: number }> = ({ t }) => {
  const a = at("and now the measure"), gone = at("the water is gone"), sauce = at("it is sauce"), out = at("basil on top") - 0.1;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const lvl = 1 - e(t, a + 3, gone + 0.4);
  const mins = Math.round(11 * e(t, a + 3, gone + 0.4));
  return (
    <div style={{ position: "absolute", left: 1180, top: 230, opacity: o, width: 640 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.ice, textShadow: extrude(5, "#06121d") }}>1¾ CUPS <span style={{ color: COL.ink, fontSize: 40 }}>· NOT MORE</span></div>
      <div style={{ width: 600, height: 170, marginTop: 20, position: "relative", borderRadius: "0 0 90px 90px", background: "#1c1c1e", border: "6px solid #000", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${20 + 70 * lvl}%`, background: t > sauce ? "linear-gradient(180deg,#d8452a,#a8301c)" : `linear-gradient(180deg,rgba(150,200,240,${0.35 + 0.4 * lvl}),rgba(200,70,40,.85))` }} />
        {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 90, bottom: 20 + 60 * lvl, width: 180, height: 8, borderRadius: 4, background: "#f0d08a", transform: `rotate(${(rnd(i, 3) - 0.5) * 30}deg)` }} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: COL.ink }}>
        <span>{mins} MIN</span><span style={{ color: COL.gold, opacity: e(t, sauce, sauce + 0.3) }}>= SAUCE</span>
      </div>
    </div>
  );
};

// la cuenta: el ticket del delivery se imprime (7 × $14.15 ≈ $100) contra la semana entera de la nonna (< $10)
const Receipt: React.FC<{ t: number }> = ({ t }) => {
  const a = at("one dinner delivered to your door"), wk = at("every night for a week"), ten = at("all seven together"), out = at("on sunday") - 0.1;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const rows = Math.min(7, Math.floor(e(t, wk, wk + 1.6) * 7.99));
  const pr = e(t, a, a + 2.2);
  return (
    <div style={{ position: "absolute", left: 140, top: 0, opacity: o, display: "flex", gap: 60, alignItems: "flex-start" }}>
      <div style={{ width: 430, height: 140 + 640 * pr, overflow: "hidden", background: "#f7f4ec", boxShadow: "0 30px 60px rgba(0,0,0,.6)", fontFamily: "'Courier New', monospace", color: "#222", padding: "0 30px", boxSizing: "border-box", clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),95% 100%,90% calc(100% - 14px),85% 100%,80% calc(100% - 14px),75% 100%,70% calc(100% - 14px),65% 100%,60% calc(100% - 14px),55% 100%,50% calc(100% - 14px),45% 100%,40% calc(100% - 14px),35% 100%,30% calc(100% - 14px),25% 100%,20% calc(100% - 14px),15% 100%,10% calc(100% - 14px),5% 100%,0 calc(100% - 14px))" }}>
        <div style={{ fontWeight: 900, fontSize: 34, textAlign: "center", padding: "28px 0 10px" }}>DELIVERY · 1 PERSON</div>
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d, i) => <div key={d} style={{ display: "flex", justifyContent: "space-between", fontSize: 34, lineHeight: 1.6, opacity: i < Math.max(1, rows) ? 1 : 0 }}><span>{d}</span><span>$14.15</span></div>)}
        <div style={{ borderTop: "3px dashed #555", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 44, color: "#b3261e", opacity: rows >= 7 ? 1 : 0 }}><span>WEEK</span><span>≈$100</span></div>
      </div>
      <div style={{ marginTop: 200, opacity: e(t, ten, ten + 0.3), transform: `scale(${k1(t, ten)})`, transformOrigin: "0 50%" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 5, color: COL.dim }}>NONNA'S WEEK · 7 DINNERS</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 200, lineHeight: 1, color: COL.olive, textShadow: extrude(12, "#1d2a0d") }}>&lt;$10</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 54, color: COL.ink, opacity: e(t, ten + 0.8, ten + 1.1) }}>no villains. arithmetic.</div>
      </div>
    </div>
  );
};

// el domingo: una olla grande de porotos → lunes / martes / miércoles
const SundayPot: React.FC<{ t: number }> = ({ t }) => {
  const a = at("on sunday"), out = at("dinner number 8", 556) + 0.2;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const days: [string, string, number][] = [["MON", "Pasta e Fagioli", at("mondays pasta")], ["TUE", "Beans & Greens", at("tuesdays beans")], ["WED", "something better…", at("and wednesday")]];
  return (
    <div style={{ position: "absolute", left: 120, top: 180, opacity: o, width: 1680 }}>
      <div style={{ display: "inline-block", padding: "18px 40px", background: "#141416", border: `4px solid ${COL.gold}`, borderRadius: 18, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: COL.gold, transform: `scale(${k1(t, a)})`, transformOrigin: "0 50%" }}>SUNDAY · ONE BIG POT OF BEANS</div>
      <div style={{ display: "flex", gap: 40, marginTop: 60 }}>
        {days.map(([d, n, st], i) => (
          <div key={d} style={{ opacity: e(t, st, st + 0.25), transform: `translateY(${(1 - Math.min(1, k1(t, st))) * 120}px)`, padding: "22px 30px", background: "rgba(20,12,6,.88)", borderLeft: `8px solid ${[COL.terra, COL.olive, COL.gold][i]}`, borderRadius: 12, minWidth: 330 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 5, color: COL.dim }}>{d}</div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 52, color: COL.ink }}>{n}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 8 · ribollita = "boiled again": la palabra se parte y se traduce; día 1 → día 2 "better"
const BoiledAgain: React.FC<{ t: number }> = ({ t }) => {
  const a = at("in italian this means boiled again"), out = at("so you take what is left") - 0.1;
  const o = fade(t, a - 0.6, out); if (o < 0.01) return null;
  const split = ei(t, a + 0.6, a + 1.2);
  return (
    <div style={{ position: "absolute", left: 1150, top: 300, opacity: o, textAlign: "center", width: 680 }}>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 120, color: COL.ink, textShadow: extrude(8, "#1d0d03") }}>
        <span style={{ display: "inline-block", transform: `translateX(${-40 * split}px)`, color: COL.gold }}>ri</span><span style={{ display: "inline-block", transform: `translateX(${40 * split}px)` }}>bollita</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 120, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: COL.dim, opacity: split }}><span style={{ color: COL.gold }}>AGAIN</span><span>BOILED</span></div>
    </div>
  );
};
const DayTwo: React.FC<{ t: number }> = ({ t }) => {
  const a = at("nonna said the soup"), better = at("better the second day"), out = at("dinner number nine") - 0.2;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const flip = ei(t, better - 0.2, better + 0.5);
  return (
    <div style={{ position: "absolute", left: 160, top: 220, opacity: o, perspective: 1200 }}>
      <div style={{ width: 300, height: 330, position: "relative", transformStyle: "preserve-3d", transform: `rotateX(${flip * 180}deg)`, transformOrigin: "50% 50%" }}>
        {[["DAY 1", "good", 0], ["DAY 2", "better", 180]].map(([d, w, r]) => (
          <div key={d as string} style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: `rotateX(${r}deg)`, background: "#f4efe6", borderRadius: 12, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.6)", textAlign: "center", fontFamily: FONT } as React.CSSProperties}>
            <div style={{ background: COL.tomato, color: "#fff", fontWeight: 900, fontSize: 40, letterSpacing: 6, padding: "12px 0" }}>{d as string}</div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 88, color: "#2a1a10", marginTop: 60 }}>{w as string}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 30, fontFamily: FONT, fontWeight: 900, fontSize: 46, color: COL.ink, textShadow: extrude(5, "#1d0d03"), opacity: e(t, at("nothing thrown away"), at("nothing thrown away") + 0.3) }}>NOTHING THROWN AWAY</div>
    </div>
  );
};

// 9 · purgatorio: la sartén vista desde arriba, dos nidos con la cuchara, la tapa que baja y el vapor que cocina arriba
const Nests: React.FC<{ t: number }> = ({ t }) => {
  const a = at("with the back of a spoon"), egg = at("you crack one egg"), lid = at("then lid on"), out = at("a little cheese and one piece") - 0.1;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const nest = (i: number) => e(t, a + 0.8 + i * 0.5, a + 1.3 + i * 0.5), eg = (i: number) => k1(t, egg + 0.3 + i * 0.4), ld = ei(t, lid, lid + 0.7);
  const cook = e(t, lid + 1.5, lid + 5);
  return (
    <div style={{ position: "absolute", left: 1220, top: 160, opacity: o, width: 600, height: 700 }}>
      <svg width={600} height={560} viewBox="0 0 600 560">
        <rect x={470} y={250} width={130} height={36} rx={12} fill="#1c1c1e" />
        <circle cx={260} cy={270} r={230} fill="#1c1c1e" /><circle cx={260} cy={270} r={200} fill="#b52d1a" />
        {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={260 + (rnd(i, 1) - 0.5) * 340} cy={270 + (rnd(i, 2) - 0.5) * 340} r={4 + rnd(i, 3) * 5} fill="#8a1e10" opacity={0.6} />)}
        {[[190, 230], [330, 310]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={58 * nest(i)} fill="#7a1608" />
            <g transform={`translate(${x} ${y}) scale(${eg(i)})`}>
              <ellipse cx={0} cy={0} rx={62} ry={54} fill="#fbf7ee" opacity={0.75 + 0.25 * cook} />
              <circle cx={4} cy={-2} r={24} fill="#f2a516" />
            </g>
          </g>
        ))}
        {/* la tapa que baja, transparente */}
        <g opacity={ld}><circle cx={260} cy={270} r={215} fill="rgba(220,235,245,.18)" stroke="rgba(240,250,255,.8)" strokeWidth={8} /><circle cx={260} cy={270} r={22} fill="#2a2a2a" /></g>
        {ld > 0.5 && Array.from({ length: 6 }, (_, i) => { const ph = (t * 0.8 + i / 6) % 1; return <path key={i} d={`M${120 + i * 50} ${360 - ph * 160} q 20 -30 0 -60`} stroke="rgba(255,255,255,.6)" strokeWidth={6} fill="none" opacity={Math.sin(ph * Math.PI)} />; })}
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: COL.gold, textShadow: extrude(5, "#1d0d03"), opacity: ld }}>LID ON · 4 MIN</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: COL.cream, opacity: e(t, at("the yolk is still soft"), at("the yolk is still soft") + 0.3) }}>white set, yolk runny</div>
    </div>
  );
};

// 10 · lentejas: la línea de 30 min; el salero arriba al principio (✗ piel dura) y se muda al final (✓); monedas de año nuevo
const SaltLine: React.FC<{ t: number }> = ({ t }) => {
  const a = at("but the real trick is the salt"), end = at("nonna put the salt at the end"), out = at("so in the pot one sausage") - 0.1;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const mv = ei(t, end + 0.2, end + 1.2);
  const x = 30 + 540 * mv;
  return (
    <div style={{ position: "absolute", left: 1170, top: 330, opacity: o, width: 640 }}>
      <div style={{ position: "relative", height: 200 }}>
        <div style={{ position: "absolute", left: 30, right: 30, top: 150, height: 14, borderRadius: 7, background: "linear-gradient(90deg,#6a4529,#a8773e)" }} />
        {["0", "10", "20", "30 MIN"].map((m, i) => <div key={m} style={{ position: "absolute", left: 30 + i * 180, top: 176, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: COL.dim, whiteSpace: "nowrap" }}>{m}</div>)}
        {/* salero */}
        <div style={{ position: "absolute", left: x, top: 20, transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ width: 70, height: 100, borderRadius: "30px 30px 10px 10px", background: "linear-gradient(90deg,#d8d8d8,#fff 45%,#cfcfcf)", border: "3px solid #888", margin: "0 auto" }} />
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: mv > 0.5 ? COL.olive : COL.tomato }}>{mv > 0.5 ? "✓" : "✗"}</div>
        </div>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, marginTop: 30, color: mv > 0.5 ? COL.gold : COL.tomato, textShadow: extrude(5, "#1d0d03") }}>{mv > 0.5 ? "SALT AT THE END" : "SALT FIRST = TOUGH SKIN"}</div>
    </div>
  );
};
const Coins: React.FC<{ t: number }> = ({ t }) => {
  const a = at("every lentil is a little coin"), out = at("now let me be honest") - 0.2;
  const o = fade(t, a, out); if (o < 0.01) return null;
  return (
    <>
      {Array.from({ length: 26 }, (_, i) => {
        const st = a + rnd(i, 1) * 1.2, y = -80 + (t - st) * (420 + rnd(i, 2) * 300);
        if (t < st) return null;
        return <div key={i} style={{ position: "absolute", left: 80 + rnd(i, 3) * 1760, top: Math.min(y, 980 - rnd(i, 4) * 60), opacity: o, width: 54, height: 54, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ffe9a6, #d9a83a 55%, #9a6a1a)", border: "3px solid #8a5a12", transform: `rotateY(${t * 300 + i * 40}deg)` }} />;
      })}
      <div style={{ position: "absolute", left: 120, top: 240, opacity: o, fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 84, color: COL.gold, textShadow: extrude(7, "#1d0d03") }}>every lentil<br />is a little coin</div>
    </>
  );
};

// problemas → arreglos: fichas que se dan vuelta (frente = el problema, dorso = el arreglo de la nonna)
const FIXES: [string, string, string][] = [
  ["the beans were old", "BEANS STILL HARD?", "Old beans. Buy where people buy a lot."],
  ["one can is two dinners", "1 CAN = TOO MUCH?", "1 can = 2 dinners. Half in a jar, 4 days."],
  ["and when you warm up", "WARMING IT UP?", "Never the microwave on high. Pot, splash, lid, 5 min."],
  ["if your polenta is too thick", "POLENTA TOO THICK?", "A splash of hot water. It forgives everything."],
  ["if your pasta is too dry", "SPAGHETTI TOO DRY?", "¼ cup more water, one more minute."],
];
const FixCards: React.FC<{ t: number }> = ({ t }) => {
  const out = at("cooking for one is not about") + 0.1;
  return (
    <>
      {FIXES.map(([ph, q, fix], i) => {
        const a = at(ph), nx = i + 1 < FIXES.length ? at(FIXES[i + 1][0]) : out;
        const o = fade(t, a, nx + 0.2); if (o < 0.01) return null;
        const flip = ei(t, a + 1.4, a + 2.0);
        const left = 110;
        return (
          <div key={i} style={{ position: "absolute", left, top: 230, opacity: o, perspective: 1400 }}>
            <div style={{ width: 640, height: 330, position: "relative", transformStyle: "preserve-3d", transform: `translateY(${(1 - Math.min(1, k1(t, a))) * 160}px) rotateY(${flip * 180}deg)` }}>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(160deg,#3a1a10,#1d0d06)", border: `5px solid ${COL.tomato}`, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: 30, boxSizing: "border-box", fontFamily: FONT, fontWeight: 900, fontSize: 62, color: COL.ink, textAlign: "center" } as React.CSSProperties}>{q}</div>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(160deg,#f7ecd3,#e3cfa2)", border: `5px solid ${COL.olive}`, borderRadius: 20, display: "flex", flexDirection: "column", justifyContent: "center", padding: "30px 40px", boxSizing: "border-box" } as React.CSSProperties}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: "#6a7a3a" }}>NONNA'S FIX</div>
                <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 52, lineHeight: 1.12, color: "#2a1a10", marginTop: 8 }}>{fix}</div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

// la alacena para uno: los 16 de la lista entran al estante en su palabra
const SHELF: [string, string, number][] = [
  ["OLIVE OIL", "olive oil", 800], ["GARLIC", "garlic", 805], ["ONIONS", "onions", 805], ["BEANS ×3", "cans of beans", 805], ["CHICKPEAS", "chickpeas", 805],
  ["LENTILS", "bag of lentils", 805], ["TOMATOES", "can of crushed tomatoes", 805], ["CHERRY TOM.", "cherry tomatoes", 805], ["LITTLE PASTA", "of little pasta", 805], ["SPAGHETTI", "of spaghetti", 805],
  ["RICE", "bag of rice", 805], ["CORNMEAL", "bag of cornmeal", 805], ["EGGS", "eggs", 820], ["HARD CHEESE", "hard cheese", 805], ["FROZEN PEAS", "frozen peas", 805], ["BREAD", "the cheap loaf", 805],
];
const Shelf: React.FC<{ t: number }> = ({ t }) => {
  const a = at("so this is the shelf"), all = at("that is all", 830), out = at("and when something is left over") - 0.1;
  const o = fade(t, a, out); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: 90, opacity: o, width: 860 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: 5, color: COL.gold, textShadow: extrude(5, "#1d0d03"), whiteSpace: "nowrap" }}>THE SHELF FOR ONE · <span style={{ color: COL.ink }}>{SHELF.filter(([, p, af]) => t >= at(p, af)).length}</span> THINGS</div>
      {[0, 1, 2, 3].map((row) => (
        <div key={row} style={{ position: "relative", marginTop: row ? 26 : 24, height: 150 }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 22, background: "linear-gradient(180deg,#7a5232,#4a2f1c)", borderRadius: 4, boxShadow: "0 14px 24px rgba(0,0,0,.55)" }} />
          <div style={{ display: "flex", gap: 14, position: "absolute", left: 10, bottom: 22 }}>
            {SHELF.slice(row * 4, row * 4 + 4).map(([lab, p, af], i) => {
              const st = at(p, af), k = k1(t, st);
              if (t < st - 0.05) return <div key={i} style={{ width: 196 }} />;
              return <div key={i} style={{ width: 196, height: 120, transform: `translateY(${(1 - Math.min(1, k)) * -200}px)`, background: ["#c9a14a", "#efe6d6", "#b3261e", "#e8d9b0", "#d8c690", "#6a4a2a", "#c23b22", "#e04a2a"][(i + row * 3) % 8], borderRadius: 12, border: "4px solid rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 28, color: "#1d0d06", textAlign: "center", padding: 8, boxSizing: "border-box", boxShadow: "inset 0 -14px 0 rgba(0,0,0,.15)" }}>{lab}</div>;
            })}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 24, fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 58, color: COL.ink, textShadow: extrude(6, "#1d0d03"), opacity: e(t, all, all + 0.3), whiteSpace: "nowrap" }}>That is all. <span style={{ color: COL.gold }}>All ten dinners.</span></div>
    </div>
  );
};

// la tarea: sólo DOS cosas, se tildan; "< $3"
const Homework: React.FC<{ t: number }> = ({ t }) => {
  const a = at("so here is your homework"), t1 = at("make the pasta"), t2 = at("make the ribollita"), three = at("less than three dollars"), out = at("tell me something in the comments", 870) - 0.1;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const row = (n: number, txt: string, sub: string, st: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 26, opacity: e(t, st, st + 0.3) }}>
      <div style={{ width: 84, height: 84, borderRadius: 14, border: `6px solid ${COL.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.olive }}>{t > st + 1.4 ? "✓" : ""}</div>
      <div><div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 66, color: COL.ink }}>{n}. {txt}</div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: COL.dim }}>{sub}</div></div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 120, top: 170, opacity: o, padding: "40px 54px", background: "rgba(20,12,6,.86)", borderRadius: 24, border: `3px solid ${COL.gold}` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, letterSpacing: 6, color: COL.gold }}>HOMEWORK · ONLY TWO</div>
      {row(1, "Pasta e Fagioli", "WITH THE CHEESE RIND", t1)}
      {row(2, "Ribollita", "THE NEXT DAY, WITH WHAT IS LEFT", t2)}
      <div style={{ marginTop: 30, fontFamily: FONT, fontWeight: 900, fontSize: 60, color: COL.olive, opacity: e(t, three, three + 0.3) }}>2 DINNERS · 1 POT · &lt; $3</div>
    </div>
  );
};

// la semana que viene: el pan de 3 ingredientes (harina + agua + sal), sin máquina, sin amasar
const BreadNext: React.FC<{ t: number }> = ({ t }) => {
  const a = at("and next week"), ing = at("three ingredients"), out = at("nonna rosa used to say") - 0.1;
  const o = fade(t, a, out); if (o < 0.01) return null;
  const items: [string, number][] = [["FLOUR", at("flour")], ["WATER", at("water", 900)], ["SALT", at("salt", 900)]];
  return (
    <div style={{ position: "absolute", left: 1150, top: 180, opacity: o, width: 680, textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 6, color: COL.dim }}>NEXT WEEK</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 86, color: COL.gold, textShadow: extrude(7, "#1d0d03") }}>Nonna Rosa's bread</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 30, alignItems: "center", opacity: e(t, ing, ing + 0.2) }}>
        {items.map(([n, st], i) => (
          <React.Fragment key={n}>
            {i > 0 && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: COL.ink }}>+</div>}
            <div style={{ padding: "16px 26px", background: "#fbf3e4", borderRadius: 16, fontFamily: FONT, fontWeight: 900, fontSize: 42, color: "#3a2414", transform: `scale(${k1(t, st)})` }}>{n}</div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 3, color: COL.ink, opacity: e(t, at("no machine"), at("no machine") + 0.3) }}>NO MACHINE · NO KNEADING</div>
    </div>
  );
};

// cierre: la frase de la nonna, escrita, y "Ciao."
const Closing: React.FC<{ t: number }> = ({ t }) => {
  const a = at("when you cook for one person"), b = at("so cook for yourself"), c = at("ciao");
  const o = e(t, a - 0.1, a + 0.3); if (o < 0.01) return null;
  const q = "“When you cook for one person, you still cook for somebody who matters.”";
  const n = Math.round(q.length * e(t, a, b - 0.3));
  return (
    <div style={{ position: "absolute", left: 160, right: 160, top: 300, opacity: o, textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 80, lineHeight: 1.15, color: COL.ink, textShadow: extrude(7, "#1d0d03") }}>{q.slice(0, n)}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 8, color: COL.gold, marginTop: 24, opacity: e(t, b - 0.5, b) }}>— NONNA ROSA</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 150, color: COL.gold, marginTop: 30, opacity: e(t, c, c + 0.3), transform: `scale(${k1(t, c)})`, textShadow: extrude(10, "#1d0d03") }}>Ciao.</div>
    </div>
  );
};

// ======================= LAS 10 CENAS (datos) =======================
type Dn = { n: number; a: number; it: string; en: string; ing: [string, number][]; price: string; pAt: number; rule: string; rAt: number; next: number };
const DINNERS: Dn[] = [
  { n: 1, a: CH.d1, it: "Pasta e Fagioli", en: "pasta and beans, one pot", ing: [["1 SPOON OLIVE OIL", at("one spoon of olive oil")], ["½ ONION", at("half an onion", 150)], ["1 CLOVE GARLIC", at("one clove of garlic", 150)], ["1 CAN BEANS + LIQUID", at("one can of beans")], ["1½ CUPS WATER", at("1 and a half cups of water")], ["PARMESAN RIND", at("the rind of the parmesan")], ["2 OZ LITTLE PASTA", at("small handful of little pasta")]], price: "$1.40", pAt: at("about140"), rule: "the pasta cooks where it lives.", rAt: at("the pasta cooks where it lives"), next: CH.d2 },
  { n: 2, a: CH.d2, it: "Pastina in Brodo", en: "little stars in broth, with egg", ing: [["1½ CUPS BROTH", at("1 and a half cups of broth")], ["¼ CUP PASTINA", at("a quarter cup of pastina")], ["1 EGG + CHEESE", at("you beat one egg")], ["BLACK PEPPER · LEMON", at("a little black pepper")]], price: "90¢", pAt: at("80 90 cents"), rule: "off the fire, the egg becomes silk.", rAt: at("off the fire the egg becomes silk", 245), next: CH.d3 },
  { n: 3, a: CH.d3, it: "Polenta", en: "with one sausage", ing: [["1 CUP COLD WATER", at("one cup of cold water")], ["¼ CUP CORNMEAL", at("a quarter cup of cornmeal")], ["PINCH OF SALT", at("a pinch of salt", 268)], ["1 SAUSAGE, IN COINS", at("you brown one sausage")]], price: "$1.80", pAt: at("180"), rule: "cold water, no lumps.", rAt: at("cold water no lumps"), next: CH.d4 },
  { n: 4, a: CH.d4, it: "Gnocchi alla Sorrentina", en: "baked, in one skillet", ing: [["½ CAN CRUSHED TOMATOES", at("half a can of crushed tomatoes", 320)], ["¼ CUP WATER", at("a quarter cup of water", 327)], ["SHELF GNOCCHI, RAW", at("the raw gnocchi go in")], ["2 OZ MOZZARELLA", at("then you tear one ball")]], price: "$2.20", pAt: at("look at this") + 0.6, rule: "the gnocchi cook in the sauce.", rAt: at("the gnocchi cook in the sauce"), next: CH.d5 },
  { n: 5, a: CH.d5, it: "Scarola e Fagioli", en: "beans & greens", ing: [["2 SPOONS OIL", at("two spoons of oil")], ["2 CLOVES GARLIC", at("two cloves of garlic")], ["A BIG HANDFUL OF GREENS", at("a big handful")], ["1 CAN BEANS", at("the can of beans", 396)], ["1 SLICE OLD BREAD", at("one slice of yesterdays bread")]], price: "$1.30", pAt: at("everything130"), rule: "cold oil, sweet garlic.", rAt: at("cold oil sweet garlic"), next: CH.d6 },
  { n: 6, a: CH.d6, it: "Risi e Bisi", en: "rice and peas, from Venice", ing: [["1 SPOON BUTTER", at("one spoon of butter")], ["⅓ CUP RICE", at("one third of a cup of rice")], ["1¼ CUPS HOT BROTH", at("then one and a quarter") + 0.3], ["½ CUP FROZEN PEAS", at("half a cup of frozen peas")], ["CHEESE + COLD BUTTER", at("one spoon of cheese")]], price: "$1.10", pAt: at("toast the rice and the rice") - 1.4, rule: "toast the rice and the rice behaves.", rAt: at("toast the rice and the rice"), next: CH.d7 },
  { n: 7, a: CH.d7, it: "Spaghetti in One Pan", en: "with tomatoes, no big pot", ing: [["CHERRY TOMATOES", at("a few cherry tomatoes")], ["GARLIC · OIL · SALT", at("garlic oil a little salt")], ["3 OZ DRY SPAGHETTI", at("the dry spaghetti")]], price: "$1.20", pAt: at("only the water the pasta") - 1.0, rule: "only the water the pasta can drink.", rAt: at("only the water the pasta"), next: CH.arith },
  { n: 8, a: CH.d8, it: "Ribollita", en: "yesterday's soup, boiled again", ing: [["1 BOWL OF LEFTOVERS", at("maybe one bowl")], ["¼ CUP WATER", at("a quarter cup of water", 570)], ["1 SLICE STALE BREAD", at("one slice of stale bread")], ["RAW OLIVE OIL ON TOP", at("ribbon of olive oil")]], price: "$1", pAt: at("about one dollar"), rule: "yesterday's soup is today's dinner.", rAt: at("soup is todays dinner") - 0.7, next: CH.d9 },
  { n: 9, a: CH.d9, it: "Uova in Purgatorio", en: "eggs in purgatory", ing: [["½ CAN CRUSHED TOMATOES", at("half a can of crushed tomatoes", 610)], ["1 CLOVE GARLIC", at("one clove of garlic", 615)], ["RED PEPPER · SALT", at("a little red pepper", 615)], ["2 EGGS", at("you crack one egg")], ["CHEESE + BREAD", at("a little cheese and one piece")]], price: "$1.10", pAt: at("one dollar and ten cents"), rule: "the lid cooks the top.", rAt: at("the lid cooks"), next: CH.d10 },
  { n: 10, a: CH.d10, it: "Lenticchie", en: "lentils, for New Year's luck", ing: [["1 SAUSAGE OR PANCETTA", at("one sausage or a little piece")], ["CARROT · ONION · CELERY", at("half a carrot")], ["⅓ CUP LENTILS", at("of a cup of lentils")], ["1½ CUPS WATER · BAY LEAF", at("a bay leaf") - 0.8], ["SALT, AT THE END", at("then the salt")]], price: "$1.50", pAt: at("one dollar and 50 cents"), rule: "salt at the end.", rAt: at("salt at the end", 708), next: CH.trouble },
];

// ======================= COMPOSICIÓN DEL RESTO =======================
export const Rest: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [];

  // ---- intro + CTA de voz ----
  if (t < CH.d1 + 0.5) {
    L.push(<Stool key="st" t={t} />, <StoneDay key="sd" t={t} />, <Smell key="sm" t={t} />, <NineToOne key="91" t={t} />);
    {
      const a = CH.spanish, o = fade(t, a, at("here in this kitchen"));
      if (o > 0.01) L.push(<div key="es" style={{ position: "absolute", left: 120, top: 200, opacity: o, transform: `perspective(900px) rotateY(${(1 - Math.min(1, k1(t, a))) * -70}deg)`, transformOrigin: "0 50%", padding: "22px 36px", background: "rgba(20,12,6,.9)", borderLeft: `8px solid ${COL.terra}`, borderRadius: 14 }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: COL.dim }}>MY SPANISH CHANNEL</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 900, fontSize: 58, color: COL.ink }}>the whole family</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: COL.gold, marginTop: 6, opacity: e(t, at("here in this kitchen"), at("here in this kitchen") + 0.3) }}>HERE: FOR ONE</div>
      </div>);
    }
    L.push(<Subscribe key="sub" t={t} />);
    L.push(<CommentBox key="cm1" t={t} a={at("and tell me in the comments", 100)} out={CH.d1 - 0.4} q="What did your grandmother cook in one pot?" />);
  }

  // ---- las 10 cenas: pizarra + ingredientes a la olla + precio + regla ----
  DINNERS.forEach((d) => {
    if (t < d.a - 0.5 || t > d.next + 0.5) return;
    L.push(<DinnerCard key={"dc" + d.n} t={t} a={d.a} n={d.n} it={d.it} en={d.en} out={d.a + 6.5} />);
    L.push(<IntoPot key={"ip" + d.n} t={t} items={d.ing} side={d.n % 2 ? 1 : -1} />);
    L.push(<PriceTag key={"pt" + d.n} t={t} a={d.pAt} out={d.next - 0.3} price={d.price} />);
    L.push(<Rule key={"ru" + d.n} t={t} a={d.rAt} out={d.next - 0.2} text={d.rule} />);
  });
  // las piezas propias de cada cena
  if (t > CH.d1 && t < CH.d2) L.push(<Zone key="zss" t={t} x0={1240} w={600}><StarchSink t={t} /></Zone>, <RindJar key="rj" t={t} />);
  if (t > CH.d2 && t < CH.d3) L.push(<Zone key="zof" t={t} x0={1150} w={700}><OffFire t={t} /></Zone>);
  if (t > CH.d3 && t < CH.d4) L.push(<Zone key="zcw" t={t} x0={1180} w={640}><ColdWater t={t} /></Zone>, <StirCount key="sc" t={t} />);
  if (t > CH.d4 && t < CH.d5) L.push(<Zone key="z3p" t={t} x0={1150} w={680}><ThreePots t={t} /></Zone>, <Broiler key="br" t={t} />);
  if (t > CH.d5 && t < CH.d6) L.push(<Zone key="zgt" t={t} x0={1330} w={480}><GarlicThermo t={t} /></Zone>);
  if (t > CH.d6 && t < CH.d7) L.push(<Zone key="zra" t={t} x0={1200} w={640}><Ratio t={t} /></Zone>);
  if (t > CH.d7 && t < CH.arith) L.push(<Zone key="zwd" t={t} x0={1180} w={640}><WaterDrop t={t} /></Zone>);
  if (t > CH.arith - 0.5 && t < CH.d8 + 0.5) L.push(<Receipt key="rc" t={t} />, <SundayPot key="sp" t={t} />);
  if (t > CH.d8 && t < CH.d9) L.push(<Zone key="zba" t={t} x0={1150} w={680}><BoiledAgain t={t} /></Zone>, <DayTwo key="d2" t={t} />);
  if (t > CH.d9 && t < CH.d10) {
    L.push(<Zone key="zne" t={t} x0={1220} w={600}><Nests t={t} /></Zone>);
    L.push(<Stamp key="fri" t={t} at={at("on a friday")} text="FRIDAY · NO MONEY LEFT" x={560} y={760} out={at("half a can of crushed tomatoes", 610)} size={64} rot={-5} />);
  }
  if (t > CH.d10 && t < CH.trouble) {
    L.push(<Zone key="zsl" t={t} x0={1170} w={640}><SaltLine t={t} /></Zone>, <Coins key="co" t={t} />);
    L.push(<Stamp key="nye" t={t} at={at("new years eve")} text="NEW YEAR'S EVE" x={560} y={760} out={at("and here is the last old")} size={70} col={COL.gold} rot={-4} />);
  }
  if (t > CH.trouble - 0.3 && t < CH.pantry) {
    L.push(<Stamp key="nty" t={t} at={at("it is not", 715)} text="IT'S NOT YOU" x={1450} y={820} out={at("the beans were old") + 1.2} size={80} col={COL.gold} rot={-6} />);
    L.push(<FixCards key="fx" t={t} />);
    L.push(<Rule key="perf" t={t} a={at("cooking for one is not about")} out={CH.pantry - 0.2} text="not perfect. real, tonight." />);
  }
  if (t > CH.pantry - 0.3 && t < CH.homework) {
    L.push(<BigNum key="10t" t={t} at={at("maybe 10 things")} text="10" sub="THINGS · 9 KIDS" x={1480} y={420} size={260} col={COL.gold} out={at("so this is the shelf") - 0.1} />);
    L.push(<Shelf key="sh" t={t} />);
    L.push(<Stamp key="ch" t={t} at={at("there were the chickens")} text="NO GARBAGE CAN FOR FOOD" x={960} y={820} out={CH.homework - 0.2} size={64} rot={-4} />);
  }
  if (t > CH.homework - 0.3 && t < CH.comment) L.push(<Homework key="hw" t={t} />);
  if (t > CH.comment - 0.3 && t < CH.next) {
    L.push(<CommentBox key="cm2" t={t} a={CH.comment} out={at("on my spanish channel", 885) - 0.1} q="What did your grandmother cook in one pot?" y={540} />);
    L.push(<Tag key="wh" t={t} at={at("tell me hers")} x={960} y={720} dx={260} dy={110} text="HER DISH + WHERE SHE WAS FROM" out={at("on my spanish channel", 885)} />);
  }
  if (t > CH.next - 0.3 && t < at("nonna rosa used to say")) L.push(<Zone key="zbn" t={t} x0={1150} w={680}><BreadNext t={t} /></Zone>);
  if (t > at("nonna rosa used to say") - 0.3) L.push(<Closing key="cl" t={t} />);

  const AV: React.ReactNode[] = [];
  // ---- el presentador (debajo de las piezas, como en el minuto 1) por iris en todas sus ventanas del resto ----
  WR.forEach((w, i) => {
    if (t < w.ms - 0.05 || t > w.me + 0.35) return;
    const cands = [PT.pot, PT.table, PT.stove];
    let p = { x: 960, y: 540 };
    for (const c of cands) { const q = screenOf(w.ms, c); if (onScreen(q)) { p = q; break; } }
    AV.push(<Portal key={"av" + i} x={p.x} y={p.y} r={irisR(t, w)}><Avatar t={t} wins={WR} /></Portal>);
  });

  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><World t={t} />{AV}{L}<Shots t={t} /></AbsoluteFill>;
};

// el video entero: minuto 1 → resto, mismo plano (la cámara y el mundo son los mismos; no hay corte en 76 s)
export const Full: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return t < MIN1_END ? <Min1 /> : <Rest t={t} />;
};
