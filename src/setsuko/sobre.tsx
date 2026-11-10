// setsuko01 · piezas que van ENCIMA de la toma o del avatar, cada una sobre su palabra (ov en data.json).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, Hanko, PZ, Palabras, Pincel, Prenda, SANS, SERIF, cl, e, eo, lerp, spr, swing } from "./lib";
import { Tarjeta } from "./piezas";

type OP = { t: number; a: number; b: number } & Record<string, any>;
const cap: React.CSSProperties = { fontFamily: SANS, fontWeight: 400, letterSpacing: "0.3em", textTransform: "uppercase" };
const sale = (t: number, b: number, d = 0.35) => 1 - e(t, b - d, b);
const papel: React.CSSProperties = { background: "linear-gradient(180deg,#f8f4ea,#eee7d8)", boxShadow: "0 18px 40px rgba(15,10,0,.35)" };

// regla N: el sello cae y la regla se escribe al lado
export const Regla: React.FC<OP> = ({ t, a, b, n, txt }) => {
  const p = eo(t, a, 0.45) * sale(t, b);
  return <div style={{ position: "absolute", left: 90, bottom: 86, ...papel, padding: "30px 46px 30px 190px", minHeight: 150, opacity: p, transform: `translateY(${(1 - eo(t, a, 0.45)) * 50}px)`, borderLeft: `5px solid ${C.hanko}` }}>
    <Hanko t={t} at={a + 0.4} x={100} y={76} size={118} txt={"掟" + ["一", "二", "三"][n - 1]} />
    <div style={{ ...cap, fontSize: 21, color: C.hanko }}>the Kyoto closet rule · {["one", "two", "three"][n - 1]}</div>
    <Palabras t={t} at={a + 0.55} txt={txt} gap={0.09} style={{ fontFamily: SERIF, fontSize: 50, color: C.sumi, marginTop: 10, maxWidth: 900 }} />
  </div>;
};

// remate kinético: sólo en los golpes
export const Kin: React.FC<OP> = ({ t, a, b, txt, big, rojo }) => (
  <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 110, opacity: sale(t, b, 0.25) }}>
    <div style={{ display: "flex", gap: "0.3em", fontFamily: SERIF, fontSize: big ? 190 : 120, color: "#fbf8f1", textShadow: "0 4px 30px rgba(0,0,0,.65), 0 1px 2px rgba(0,0,0,.6)", lineHeight: 1 }}>
      {String(txt).split(" ").map((w: string, i: number) => { const at = a + i * 0.32, p = eo(t, at, 0.22); return <span key={i} style={{ display: "inline-block", opacity: p, transform: `scale(${lerp(1.35, 1, p)})`, color: rojo === i ? "#f1b3a8" : undefined }}>{w}</span>; })}
    </div>
  </AbsoluteFill>
);

// etiqueta de precio colgada de un hilo
export const Tag: React.FC<OP> = ({ t, a, b, txt, sub }) => {
  const p = spr(t, a, 1.1), r = swing(t, a, 16, 1.6, 6.5);
  return <div style={{ position: "absolute", left: 1380, top: -40, transformOrigin: "50% 0", transform: `rotate(${r}deg) translateY(${(cl(p) - 1) * 520}px)`, opacity: sale(t, b) }}>
    <div style={{ width: 2, height: 230, background: "#d9cfb8", margin: "0 auto" }} />
    <div style={{ ...papel, width: 330, padding: "34px 30px 30px", borderRadius: "40px 40px 6px 6px", textAlign: "center", position: "relative" }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#3a342b", margin: "0 auto 18px", boxShadow: "inset 0 2px 4px rgba(0,0,0,.6)" }} />
      <div style={{ fontFamily: SERIF, fontSize: 96, color: C.sumi, lineHeight: 1, transform: "rotate(-3deg)" }}>{txt}</div>
      <Pincel t={t} at={a + 0.5} x={50} y={176} w={230} hgt={7} col={C.hanko} rot={-3} />
      <div style={{ ...cap, fontSize: 19, color: C.sumi, opacity: 0.7, marginTop: 30 }}>{sub}</div>
    </div>
  </div>;
};

// contador grande sobre la foto
export const Cuenta: React.FC<OP> = ({ t, a, b, n, lab }) => {
  const v = Math.round(n * eo(t, a, 1.1));
  return <div style={{ position: "absolute", right: 110, top: 80, textAlign: "right", opacity: eo(t, a, 0.25) * sale(t, b), color: "#fbf8f1", textShadow: "0 6px 40px rgba(0,0,0,.7), 0 1px 3px rgba(0,0,0,.7)" }}>
    <div style={{ fontFamily: SERIF, fontSize: 300, lineHeight: 0.95 }}>{v}</div>
    <div style={{ ...cap, fontSize: 34 }}>{lab}</div>
  </div>;
};

export const Lower: React.FC<OP> = ({ t, a, b, name, sub }) => {
  const p = eo(t, a, 0.5) * sale(t, b);
  return <div style={{ position: "absolute", left: 100, bottom: 96, opacity: p, transform: `translateX(${(1 - eo(t, a, 0.5)) * -40}px)`, display: "flex", alignItems: "stretch", gap: 24 }}>
    <div style={{ width: 5, background: C.hanko }} />
    <div style={{ ...papel, padding: "22px 40px 24px" }}>
      <div style={{ fontFamily: SERIF, fontSize: 58, color: C.sumi, lineHeight: 1.1 }}>{name}</div>
      <div style={{ ...cap, fontSize: 21, color: C.sumi, opacity: 0.72, marginTop: 8 }}>{sub}</div>
    </div>
  </div>;
};

// lugar o dato: kanji vertical + rótulo
export const Chip: React.FC<OP> = ({ t, a, b, kan, txt }) => {
  const p = eo(t, a + 0.15, 0.45) * sale(t, b);
  return <div style={{ position: "absolute", left: 84, top: 76, display: "flex", gap: 20, alignItems: "flex-start", opacity: p, color: "#fbf8f1", textShadow: "0 3px 22px rgba(0,0,0,.75), 0 1px 2px rgba(0,0,0,.7)" }}>
    {kan && <div style={{ fontFamily: SERIF, fontSize: 54, writingMode: "vertical-rl", letterSpacing: "0.12em", lineHeight: 1, clipPath: `inset(0 0 ${(1 - eo(t, a + 0.15, 0.6)) * 100}% 0)` }}>{kan}</div>}
    <div style={{ marginTop: 6 }}>
      <div style={{ width: 70 * eo(t, a + 0.3, 0.4), height: 3, background: "#fbf8f1", marginBottom: 14 }} />
      <div style={{ ...cap, fontSize: 25 }}>{txt}</div>
    </div>
  </div>;
};

// muestrario: la tarjeta de tela cae sobre la pila, abajo a la izquierda
export const Muestra: React.FC<OP> = ({ t, a, b, i }) => {
  const p = spr(t, a, 1.15), q = cl(p);
  return <div style={{ position: "absolute", left: 96 + i * 34, bottom: 80 + i * 10, transform: `translateY(${(q - 1) * 900}px) rotate(${lerp(-18, [-5, 3, -2, 4, -3][i], q)}deg)`, opacity: sale(t, b, 0.3) }}>
    <Tarjeta i={i} t={t} at={a + 0.25} w={300} />
  </div>;
};

// CTA suave: sin link, nueve prendas chiquitas para elegir
export const Cta: React.FC<OP> = ({ t, a, b }) => {
  const p = eo(t, a, 0.5) * sale(t, b);
  return <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 250, ...papel, opacity: p, transform: `translateY(${(1 - eo(t, a, 0.5)) * 250}px)`, borderTop: `4px solid ${C.hanko}` }}>
    <div style={{ position: "absolute", left: 90, top: 46 }}>
      <div style={{ ...cap, fontSize: 22, color: C.hanko }}>tell me below</div>
      <Palabras t={t} at={a + 0.35} txt="Which one piece would you keep?" gap={0.08} style={{ fontFamily: SERIF, fontSize: 62, color: C.sumi, marginTop: 12 }} />
    </div>
    {PZ.map((q, i) => <Prenda key={i} f={q.f} hook={0} x={1130 + i * 86} y={30 + (1 - cl(spr(t, a + 0.5 + i * 0.06, 1.4))) * 260} w={118} rot={swing(t, a + 0.6 + i * 0.06, 6, 2, 7)} />)}
  </div>;
};

// final: funde a papel con el nombre del canal
export const Fin: React.FC<OP> = ({ t, a }) => (
  <AbsoluteFill style={{ background: "#f2ede2", opacity: e(t, a, a + 0.8), alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: SERIF, fontSize: 96, color: C.sumi, opacity: e(t, a + 0.5, a + 1.1) }}>Setsuko&rsquo;s Kyoto Wardrobe</div>
    <div style={{ ...cap, fontSize: 26, color: C.hanko, marginTop: 26, opacity: e(t, a + 0.8, a + 1.3) }}>nine pieces · five colours · three rules</div>
  </AbsoluteFill>
);
