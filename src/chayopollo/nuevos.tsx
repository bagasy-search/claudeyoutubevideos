// chayopollo · piezas NUEVAS de este video (caldo de pollo): página real del libro, orden de las verduras, hervor, salpicadura,
// gelatina de las patitas, platitos de la mesa. Mismo estilo del kit (barro/maíz/crema, serif + letra a mano, 2.5D con canto).
import React from "react";
import { Img, staticFile } from "remotion";
import { CH, FONT, HAND, P, SERIF, e, ei, extrude, spr } from "./lib";

type B = { t: number; at: number; out: number };
const op = (t: number, at: number, out: number) => e(t, at, at + 0.18) * (1 - e(t, out, out + 0.3));

// la PÁGINA REAL del libro (render del PDF) que se levanta del recetario con su canto, un marcatextos barre el título y una etiqueta dice la página
export const PaginaReal: React.FC<B & { x: number; y: number; src: string; pag: string; libro: string; hl?: number; w?: number; rot?: number }> = ({ t, at, out, x, y, src, pag, libro, hl, w = 560, rot = -4 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.06, spr(t, at, 0.8)), h = w * 1.294;
  const sweep = hl === undefined ? 0 : ei(t, hl, hl + 0.7);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, perspective: 1600, opacity: o }}>
      <div style={{ width: w, height: h, transformOrigin: "50% 100%", transform: `rotateX(${(1 - Math.min(1, k)) * 75 + 8}deg) rotateZ(${rot + Math.sin((t - at) * 0.6) * 0.8}deg) translateZ(${(1 - Math.min(1, k)) * -300}px)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, background: "#f4ecd8", borderRadius: 6, boxShadow: "0 50px 90px rgba(0,0,0,.65), 0 0 0 1px rgba(0,0,0,.2)", overflow: "hidden" }}>
          <Img src={staticFile(P + src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 26, bottom: 0, background: "linear-gradient(90deg, rgba(0,0,0,.25), transparent)" }} />
          {hl !== undefined && <div style={{ position: "absolute", left: "6%", top: "15.5%", height: "7%", width: `${88 * sweep}%`, background: "rgba(255,214,64,.42)", mixBlendMode: "multiply", borderRadius: 4 }} />}
        </div>
        <div style={{ position: "absolute", right: -40, top: -46, transform: `rotate(6deg) scale(${Math.min(1, spr(t, at + 0.4))})`, background: CH.guinda, color: CH.crema, fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "12px 24px", borderRadius: 10, boxShadow: "0 18px 30px rgba(0,0,0,.55)", whiteSpace: "nowrap", letterSpacing: 2 }}>{pag}</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -74, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CH.maiz, textShadow: "0 3px 12px #000" }}>{libro}</div>
      </div>
    </div>
  );
};

// orden de las verduras: una regla de tiempo (30 → 0 min) y cada verdura cae en su minuto
export const VerdurasOrden: React.FC<B & { x: number; y: number; rows: { at: number; label: string; min: number; c: string }[]; bad?: number }> = ({ t, at, out, x, y, rows, bad }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const W = 1100, b = bad === undefined ? 0 : e(t, bad, bad + 0.4);
  return (
    <div style={{ position: "absolute", left: x - W / 2, top: y, width: W, opacity: o, perspective: 1400 }}>
      <div style={{ transform: "rotateX(14deg)", background: "linear-gradient(180deg, rgba(42,18,12,.92), rgba(24,10,6,.92))", borderRadius: 18, padding: "26px 36px 30px", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.12)", border: `3px solid ${CH.barro}` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: CH.maiz, letterSpacing: 2, marginBottom: 80 }}>CADA VERDURA, SU TIEMPO</div>
        <div style={{ position: "relative", height: 150 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 110, height: 6, background: CH.crema, opacity: 0.6, borderRadius: 3 }} />
          {[30, 20, 10, 0].map((m) => <div key={m} style={{ position: "absolute", left: `${(1 - m / 30) * 100}%`, top: 122, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: CH.crema, opacity: 0.8 }}>{m === 0 ? "APAGAR" : `${m} min`}</div>)}
          {rows.map((r, i) => {
            const k = Math.min(1.1, spr(t, r.at)), ro = e(t, r.at, r.at + 0.12);
            return <div key={i} style={{ position: "absolute", left: `${(1 - r.min / 30) * 100}%`, top: 100 - 90 * Math.min(1, k), transform: `translate(-50%,-100%) rotate(${(i - 1) * 3}deg)`, opacity: ro * (1 - 0.7 * b), background: r.c, color: "#1d0f08", fontFamily: FONT, fontWeight: 900, fontSize: 30, padding: "10px 18px", borderRadius: 12, whiteSpace: "nowrap", boxShadow: "0 14px 24px rgba(0,0,0,.5)" }}>{r.label}</div>;
          })}
          {b > 0 && <div style={{ position: "absolute", left: 0, top: 10, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#ff6a50", opacity: b, transform: `rotate(-4deg) scale(${0.8 + 0.2 * b})`, textShadow: "0 3px 10px #000" }}>¡todo de un jalón = atole!</div>}
        </div>
      </div>
    </div>
  );
};

// hervor: la olla vista de lado con burbujas; "tiembla" (pocas, en una orilla) contra "borbotones" (muchas, turbio)
export const Hervor: React.FC<B & { x: number; y: number; fuerte: number; label: string }> = ({ t, at, out, x, y, fuerte, label }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const n = Math.round(4 + 26 * fuerte), turb = 0.15 + 0.6 * fuerte;
  return (
    <div style={{ position: "absolute", left: x - 230, top: y - 210, width: 460, opacity: o, transform: `scale(${0.8 + 0.2 * Math.min(1, spr(t, at))})` }}>
      <svg width={460} height={360} viewBox="0 0 460 360">
        <defs><linearGradient id="hv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={`rgba(232,170,60,${1 - turb * 0.4})`} /><stop offset="1" stopColor={`rgba(${180 - 40 * fuerte},${120 - 20 * fuerte},40,1)`} /></linearGradient></defs>
        <path d="M60 90 L400 90 L370 320 Q230 350 90 320 Z" fill="#6b3a22" stroke="#2a120c" strokeWidth={8} />
        <path d="M74 112 L386 112 L362 305 Q230 332 98 305 Z" fill="url(#hv)" />
        <rect x={74} y={112} width={312} height={200} fill={`rgba(220,210,190,${turb * 0.5})`} />
        {Array.from({ length: n }, (_, i) => {
          const side = fuerte < 0.4 ? 0.82 + 0.12 * ((i * 37) % 10) / 10 : ((i * 53) % 100) / 100;
          const ph = ((t * (0.7 + fuerte * 1.6) + i * 0.37) % 1);
          const bx = 95 + side * 270, by = 300 - ph * 190, r = 4 + ((i * 7) % 5) * (1 + fuerte);
          return <circle key={i} cx={bx + Math.sin(ph * 9 + i) * 4} cy={by} r={r} fill="none" stroke="rgba(255,250,235,.85)" strokeWidth={2.5} opacity={1 - ph * 0.6} />;
        })}
        <ellipse cx={230} cy={90} rx={170} ry={16} fill="#3a1c10" />
      </svg>
      <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: fuerte > 0.5 ? "#ff7a5c" : CH.maiz, textShadow: extrude(4, "#000"), marginTop: -8 }}>{label}</div>
    </div>
  );
};

// salpicadura: del pollo en el fregadero salen gotitas hacia el trapo, la tabla y los platos (que se marcan en rojo)
export const Salpica: React.FC<B & { x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const tg = [{ l: "EL TRAPO", dx: -380, dy: -160 }, { l: "LA TABLA", dx: 360, dy: -190 }, { l: "LOS PLATOS", dx: 420, dy: 90 }, { l: "TUS MANOS", dx: -400, dy: 120 }];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      <svg width={1000} height={600} viewBox="-500 -300 1000 600" style={{ position: "absolute", left: -500, top: -300 }}>
        <ellipse cx={0} cy={10} rx={110} ry={70} fill="#f2d2b0" stroke="#c09070" strokeWidth={4} />
        {tg.map((g, i) => { const k = e(t, at + 0.3 + i * 0.25, at + 0.9 + i * 0.25); return Array.from({ length: 7 }, (_, j) => {
          const f = (j / 7) * k; return <circle key={i + "-" + j} cx={g.dx * f} cy={g.dy * f - Math.sin(f * Math.PI) * 60} r={7 - j * 0.6} fill="#8fd6ff" opacity={k > 0 ? 0.9 : 0} />; }); })}
      </svg>
      {tg.map((g, i) => { const k = e(t, at + 0.9 + i * 0.25, at + 1.1 + i * 0.25); return k > 0 ? <div key={i} style={{ position: "absolute", left: g.dx, top: g.dy, transform: `translate(-50%,-50%) scale(${Math.min(1.1, spr(t, at + 0.9 + i * 0.25))})`, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", background: "#c0392b", padding: "8px 16px", borderRadius: 10, whiteSpace: "nowrap", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}>{g.l}</div> : null; })}
    </div>
  );
};

// gelatina: un bloque dorado que tiembla cuando la cuchara lo toca
export const Gelatina: React.FC<B & { x: number; y: number; hitAt: number; label: string }> = ({ t, at, out, x, y, hitAt, label }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const d = t - hitAt, wob = d > 0 ? Math.exp(-d * 2.2) * Math.sin(d * 18) : 0;
  return (
    <div style={{ position: "absolute", left: x - 200, top: y - 160, width: 400, opacity: o, textAlign: "center" }}>
      <div style={{ margin: "0 auto", width: 300, height: 190, borderRadius: "28px 28px 60px 60px", background: "linear-gradient(180deg, rgba(255,214,110,.95), rgba(214,140,40,.95))", boxShadow: "inset 0 10px 24px rgba(255,255,255,.45), inset 0 -18px 30px rgba(120,60,10,.5), 0 30px 50px rgba(0,0,0,.6)",
        transform: `skewX(${wob * 9}deg) scaleY(${1 + wob * 0.06})`, transformOrigin: "50% 100%" }} />
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CH.crema, textShadow: "0 3px 12px #000", marginTop: 14 }}>{label}</div>
    </div>
  );
};

// los platitos de la mesa: cada uno cae en su lugar con su nombre
export const Platitos: React.FC<{ t: number; out: number; y: number; rows: { at: number; label: string; c: string }[] }> = ({ t, out, y, rows }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 30 }}>
    {rows.map((r, i) => { const k = Math.min(1.1, spr(t, r.at)), o = e(t, r.at, r.at + 0.12) * (1 - e(t, out, out + 0.3)); return (
      <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * -160}px)`, textAlign: "center", width: 230 }}>
        <div style={{ margin: "0 auto", width: 170, height: 66, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 45%, ${r.c} 0 52%, #a55a32 54% 70%, #6b3a22 72%)`, boxShadow: "0 18px 26px rgba(0,0,0,.55)" }} />
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: CH.crema, marginTop: 12, textShadow: "0 2px 8px #000", letterSpacing: 1 }}>{r.label}</div>
      </div>); })}
  </div>
);

// dos tazas a contraluz: el caldo pálido de la fonda contra el dorado "como de té" del comal
export const DosTazas: React.FC<B & { x: number; y: number; goodAt: number }> = ({ t, at, out, x, y, goodAt }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const g = e(t, goodAt, goodAt + 1.2);
  const taza = (c: string, label: string, k: number, lc: string) => (
    <div style={{ textAlign: "center", transform: `scale(${0.75 + 0.25 * Math.min(1, k)})` }}>
      <div style={{ width: 230, height: 250, margin: "0 auto", borderRadius: "14px 14px 60px 60px", background: "rgba(255,255,255,.12)", boxShadow: "inset 0 0 0 5px rgba(255,255,255,.75), 0 30px 50px rgba(0,0,0,.6)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 6, right: 6, bottom: 6, height: "78%", borderRadius: "6px 6px 54px 54px", background: c }} />
        <div style={{ position: "absolute", left: 26, top: 20, width: 26, height: 200, borderRadius: 13, background: "rgba(255,255,255,.28)" }} />
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: lc, marginTop: 14, textShadow: "0 2px 10px #000", letterSpacing: 2 }}>{label}</div>
    </div>);
  return (
    <div style={{ position: "absolute", left: x - 360, top: y - 170, width: 720, display: "flex", justifyContent: "space-between", opacity: o }}>
      {taza("linear-gradient(180deg, rgba(225,215,190,.75), rgba(200,190,160,.8))", "PÁLIDO", spr(t, at), "#c9c2b6")}
      {taza(`linear-gradient(180deg, rgba(240,${170 + 20 * g},60,${0.4 + 0.5 * g}), rgba(190,110,30,${0.5 + 0.45 * g}))`, "COMO DE TÉ", spr(t, goodAt), CH.maiz)}
    </div>
  );
};
