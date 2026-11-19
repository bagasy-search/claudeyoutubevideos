// serie Linda · piezas que van ENCIMA de la toma o del avatar, cada una sobre su palabra (ov en data.json).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, HAND, Palabras, Pincel, SANS, SERIF, cl, e, eo, lerp, spr, swing } from "./lib";

type OP = { t: number; a: number; b: number } & Record<string, any>;
const cap: React.CSSProperties = { fontFamily: SANS, fontWeight: 400, letterSpacing: "0.3em", textTransform: "uppercase" };
const sale = (t: number, b: number, d = 0.35) => 1 - e(t, b - d, b);
const papel: React.CSSProperties = { background: "linear-gradient(180deg,#FFFCF5,#F1E8D6)", boxShadow: "0 18px 40px rgba(15,10,0,.35)", outline: "1px solid rgba(169,132,63,.55)", outlineOffset: -7 };

// remate kinético: cada palabra cae con peso (resorte), sombra de contacto, y la última se subraya con trazo rojo
export const Kin: React.FC<OP> = ({ t, a, b, txt, big, rojo }) => {
  const ws = String(txt).split(" "), fs = big ? 200 : 140, sal = e(t, b - 0.25, b);
  return <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120, opacity: 1 - sal }}>
    <AbsoluteFill style={{ background: `radial-gradient(70% 45% at 50% 82%, rgba(8,8,12,${0.55 * eo(t, a - 0.1, 0.3)}), rgba(8,8,12,0) 70%)` }} />
    <div style={{ position: "relative", display: "flex", gap: "0.28em", fontFamily: SERIF, fontWeight: 600, fontSize: fs, color: "#FFFCF5", lineHeight: 1 }}>
      {ws.map((w: string, i: number) => { const at = a + i * 0.28, p = spr(t, at, 1.3), q = cl(p);
        return <span key={i} style={{ position: "relative", display: "inline-block", opacity: eo(t, at, 0.1), transform: `translateY(${(1 - p) * -90}px) scale(${lerp(1.25, 1, q)})`,
          textShadow: `0 ${8 + (1 - q) * 30}px ${20 + (1 - q) * 30}px rgba(0,0,0,.7), 0 2px 3px rgba(0,0,0,.7)`, color: rojo === i ? "#f6c3b8" : undefined }}>{w}
          {i === ws.length - 1 && <div style={{ position: "absolute", left: "2%", bottom: -fs * 0.12, width: `${96 * eo(t, at + 0.25, 0.3)}%`, height: fs * 0.07, background: C.hanko, borderRadius: fs, boxShadow: "0 3px 8px rgba(0,0,0,.5)", transform: "rotate(-1.5deg)" }} />}
        </span>; })}
    </div>
  </AbsoluteFill>;
};

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
  return <div style={{ position: "absolute", right: 110, top: 80, textAlign: "right", opacity: eo(t, a, 0.25) * sale(t, b), color: "#FFFCF5", textShadow: "0 6px 40px rgba(0,0,0,.7), 0 1px 3px rgba(0,0,0,.7)" }}>
    <div style={{ fontFamily: SERIF, fontSize: 300, lineHeight: 0.95 }}>{v}</div>
    <div style={{ ...cap, fontSize: 34 }}>{lab}</div>
  </div>;
};

// gafete de tripulación de latón con las alas: entra desde la izquierda con resorte, un brillo lo cruza, sale por donde vino
export const Lower: React.FC<OP> = ({ t, a, b, name, sub }) => {
  const p = spr(t, a, 1.0), sal = e(t, b - 0.35, b), brillo = cl((t - a - 0.5) / 0.7);
  return <div style={{ position: "absolute", left: 90, bottom: 90, transform: `translateX(${(1 - cl(p)) * -720 - sal * 760}px) rotate(${(1 - cl(p)) * -4}deg)` }}>
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 28, padding: "24px 46px 26px 32px", borderRadius: 16, overflow: "hidden",
      background: "linear-gradient(180deg,#f3dc9c 0%,#d9b866 45%,#a8823a 100%)", border: "3px solid #8a6a2c", boxShadow: "0 26px 50px rgba(0,0,0,.55), inset 0 2px 2px rgba(255,255,255,.6), inset 0 -3px 4px rgba(80,55,15,.5)" }}>
      <svg width="120" height="56" viewBox="0 0 120 56"><g fill="#5a4214" opacity=".85">
        <path d="M60 18 C48 10 26 8 2 12 C18 18 34 22 52 26 Z" /><path d="M60 18 C72 10 94 8 118 12 C102 18 86 22 68 26 Z" />
        <path d="M54 30 C42 26 28 26 14 30 C28 34 40 36 54 36 Z" /><path d="M66 30 C78 26 92 26 106 30 C92 34 80 36 66 36 Z" /><circle cx="60" cy="27" r="9" /></g></svg>
      <div>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 78, color: "#3b2a0b", lineHeight: 1.02, textShadow: "0 1px 0 rgba(255,240,200,.6)" }}>{name}</div>
        <div style={{ ...cap, fontSize: 28, fontWeight: 500, color: "#4a3510", marginTop: 6, letterSpacing: "0.16em" }}>{sub}</div>
      </div>
      <div style={{ position: "absolute", top: -40, bottom: -40, width: 120, left: `${lerp(-20, 110, brillo)}%`, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0))", transform: "rotate(18deg)", opacity: brillo > 0 && brillo < 1 ? 1 : 0 }} />
    </div>
  </div>;
};

// lugar o dato: filete + rótulo (y una línea a mano si hace falta)
export const Chip: React.FC<OP> = ({ t, a, b, kan, txt }) => {
  const p = eo(t, a + 0.15, 0.45) * sale(t, b);
  return <div style={{ position: "absolute", left: 84, top: 76, opacity: p, color: "#FFFCF5", textShadow: "0 3px 22px rgba(0,0,0,.75), 0 1px 2px rgba(0,0,0,.7)" }}>
    <div style={{ width: 70 * eo(t, a + 0.3, 0.4), height: 3, background: "#f1d9a8", marginBottom: 14 }} />
    <div style={{ ...cap, fontSize: 25 }}>{txt}</div>
    {kan && <div style={{ fontFamily: HAND, fontSize: 44, marginTop: 4, opacity: eo(t, a + 0.5, 0.4) }}>{kan}</div>}
  </div>;
};
