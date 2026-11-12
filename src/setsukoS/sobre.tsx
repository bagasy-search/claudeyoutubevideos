// serie Setsuko (de setsuko01) · piezas que van ENCIMA de la toma o del avatar, cada una sobre su palabra (ov en data.json).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, Palabras, Pincel, SANS, SERIF, cl, e, eo, lerp, spr, swing } from "./lib";

type OP = { t: number; a: number; b: number } & Record<string, any>;
const cap: React.CSSProperties = { fontFamily: SANS, fontWeight: 400, letterSpacing: "0.3em", textTransform: "uppercase" };
const sale = (t: number, b: number, d = 0.35) => 1 - e(t, b - d, b);
const papel: React.CSSProperties = { background: "linear-gradient(180deg,#f8f4ea,#eee7d8)", boxShadow: "0 18px 40px rgba(15,10,0,.35)" };

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
      <div style={{ fontFamily: SERIF, fontSize: 72, color: C.sumi, lineHeight: 1.1 }}>{name}</div>
      <div style={{ ...cap, fontSize: 26, color: C.sumi, opacity: 0.72, marginTop: 8 }}>{sub}</div>
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

