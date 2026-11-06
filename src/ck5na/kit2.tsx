// ck5na · kit 2: las piezas del último tercio (mesa para 40, freezer, la semana, lo que Hazel nunca hizo, preguntas, balanza, el bol que quedó)
import React from "react";
import { e, ei } from "../kits/yanqui3d/lib";
import { C, HAND, SANS, SERIF } from "./ui";
import { Kicker, PAPER, SH, Shell, lerp, pop, popS } from "./kit";

// 34 · LA CUENTA DE LA MESA: tres fichas 1½ × 40 = 60 y debajo dos boles y medio
export const CrowdMath: React.FC<{ t: number; a: number; b: number; c: number; out: number }> = ({ t, a, b, c, out }) => {
  const T = [{ at: a, v: "1½", s: "PER PERSON" }, { at: b, v: "× 40", s: "PEOPLE" }, { at: b + 0.6, v: "= 60", s: "ROLLS" }];
  return (
    <Shell t={t} a={a - 0.3} out={out} w={640} h={380} y={350}>
      <div style={{ position: "absolute", left: 24, top: 18 }}><Kicker txt="THE CROWD CHART · PAGE 7" /></div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 70, display: "flex", gap: 16 }}>
        {T.map((x) => (
          <div key={x.v} style={{ flex: 1, height: 130, borderRadius: 14, background: `linear-gradient(180deg, ${C.wine}, ${C.wineD})`, color: C.goldL, textAlign: "center", boxShadow: "0 10px 16px rgba(0,0,0,.35), inset 0 2px 0 rgba(255,255,255,.25)", ...popS(t, x.at) }}>
            <div style={{ fontFamily: SERIF, fontSize: 70, lineHeight: 1.3 }}>{x.v}</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 17, letterSpacing: 2 }}>{x.s}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 230, display: "flex", alignItems: "flex-end", gap: 24 }}>
        {[1, 1, 0.5].map((f, i) => (
          <div key={i} style={{ width: 120, height: 90, position: "relative", ...popS(t, c + i * 0.25) }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80, borderRadius: "0 0 60px 60px", background: "linear-gradient(180deg,#f6c94b,#cf8f15)", boxShadow: "0 8px 12px rgba(0,0,0,.3)", clipPath: f < 1 ? "inset(0 50% 0 0)" : undefined }} />
          </div>
        ))}
        <div style={{ fontFamily: SERIF, fontSize: 60, color: C.wine, opacity: e(t, c + 0.6, c + 0.9) }}>2½ bowls</div>
      </div>
    </Shell>
  );
};

// 35 · DEL HORNO AL FREEZER: la bandeja que se escarcha (2 h), la bolsa y el almanaque «1 MONTH»
export const FreezerSteps: React.FC<{ t: number; a: number; bag: number; month: number; out: number }> = ({ t, a, bag, month, out }) => {
  const fr = ei(t, a + 0.4, a + 2.2);
  return (
    <Shell t={t} a={a} out={out} w={680} h={320} x={1440} y={330} bg="linear-gradient(180deg,#f4f8fa,#dde8ec)">
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 20px" }}>
        <div style={{ textAlign: "center", ...popS(t, a) }}>
          <div style={{ width: 180, height: 110, borderRadius: 10, background: "linear-gradient(160deg,#cfd3d6,#8d9296)", padding: 12, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, boxShadow: "0 10px 14px rgba(0,0,0,.3)" }}>
            {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ffffff, ${fr > 0.5 ? "#e6eef2" : "#efd9b2"} 70%)`, boxShadow: `0 0 ${10 * fr}px rgba(170,215,240,${fr})` }} />)}
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 20, marginTop: 12 }}>UNCOVERED · 2 HOURS</div>
        </div>
        <div style={{ textAlign: "center", ...popS(t, bag) }}>
          <div style={{ width: 150, height: 130, borderRadius: "10px 10px 18px 18px", background: "linear-gradient(160deg, rgba(255,255,255,.85), rgba(210,225,232,.6))", border: "3px solid #9fb6c0", boxShadow: "0 10px 14px rgba(0,0,0,.25)", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 14, height: 8, background: "#4a8fbf" }} />
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 18 + (i % 2) * 60, top: 40 + Math.floor(i / 2) * 42, width: 50, height: 36, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #e6eef2)" }} />)}
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 20, marginTop: 12 }}>INTO A FREEZER BAG</div>
        </div>
        <div style={{ textAlign: "center", ...popS(t, month) }}>
          <div style={{ width: 130, height: 140, borderRadius: 10, background: "#fff", boxShadow: "0 10px 14px rgba(0,0,0,.25)", overflow: "hidden" }}>
            <div style={{ height: 36, background: C.wine, color: C.goldL, fontFamily: SANS, fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>KEEPS</div>
            <div style={{ fontFamily: SERIF, fontSize: 60, color: C.ink, lineHeight: 1.2 }}>1</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 18 }}>MONTH</div>
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 20, marginTop: 12 }}>THAW IN THE FRIDGE</div>
        </div>
      </div>
    </Shell>
  );
};

// 36 · LA PIZARRA DE LA SEMANA: pizarrita de cocina, los días escritos a tiza de a uno
export const WeekBoard: React.FC<{ t: number; rows: { at: number; d: string; w: string }[]; out: number }> = ({ t, rows, out }) => (
  <Shell t={t} a={rows[0].at - 0.3} out={out} w={560} h={640} y={480} bg="radial-gradient(120% 100% at 30% 20%, #3c4a3f, #22302a)">
    <div style={{ position: "absolute", inset: 0, border: "16px solid #8a5a34", borderRadius: 14 }} />
    <div style={{ position: "absolute", left: 40, top: 34, fontFamily: HAND, fontSize: 50, color: "#f4efe2" }}>{"Loretta’s week"}</div>
    {rows.map((r, i) => {
      const w = ei(t, r.at, r.at + 0.9);
      return (
        <div key={r.d + i} style={{ position: "absolute", left: 44, top: 112 + i * 66, display: "flex", gap: 18, fontFamily: HAND, color: "#f4efe2", clipPath: `inset(0 ${100 - w * 100}% 0 0)`, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 40, width: 110, color: C.goldL }}>{r.d}</span><span style={{ fontSize: 36 }}>{r.w}</span>
        </div>
      );
    })}
  </Shell>
);

// 37 · LO QUE HAZEL NUNCA HIZO: ficha de cinco renglones; el sello rojo NEVER golpea cada uno
export const NeverCard: React.FC<{ t: number; rows: { at: number; txt: string }[]; out: number; notyet: number }> = ({ t, rows, out, notyet }) => (
  <Shell t={t} a={rows[0].at - 0.5} out={out} w={620} h={580} y={450}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0 74px, ${C.rule} 74px 76px)`, padding: "24px 30px" }}>
      <div style={{ fontFamily: SERIF, fontSize: 48, color: C.ink }}>{"Hazel never…"}</div>
      {rows.map((r, i) => (
        <div key={i} style={{ position: "relative", height: 76, display: "flex", alignItems: "center", opacity: e(t, r.at, r.at + 0.3) }}>
          <span style={{ fontFamily: HAND, fontSize: 36, color: "#24306a" }}>{r.txt}</span>
          <span style={{ position: "absolute", right: 0, fontFamily: SANS, fontWeight: 900, fontSize: 22, color: C.red, border: `3px solid ${C.red}`, padding: "2px 8px", borderRadius: 4, transform: `rotate(-8deg) scale(${lerp(2, 1, pop(t, r.at + 0.25))})`, opacity: e(t, r.at + 0.25, r.at + 0.35) * 0.9 }}>NEVER</span>
        </div>
      ))}
      <div style={{ position: "absolute", left: 30, bottom: 20, fontFamily: HAND, fontSize: 48, color: C.wine, opacity: e(t, notyet, notyet + 0.4) }}>{"“Not yet, honey.”"}</div>
    </div>
  </Shell>
);

// 38 · EL BUZÓN DE PREGUNTAS: sobres que se abren de a uno con la pregunta y la respuesta corta
export const AskMail: React.FC<{ t: number; rows: { at: number; q: string; ans: string }[]; out: number }> = ({ t, rows, out }) => {
  const cur = Math.max(0, rows.filter((r) => t >= r.at).length - 1), r = rows[cur], k = pop(t, r.at), op = ei(t, r.at + 0.2, r.at + 0.9);
  const left = rows.length - cur - 1;
  return (
    <Shell t={t} a={rows[0].at - 0.3} out={out} w={580} h={380} y={350} noCard>
      {Array.from({ length: Math.min(2, left) }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + (i + 1) * 12, top: 40 - (i + 1) * 10, width: 500, height: 300, background: "#efe2c6", borderRadius: 8, boxShadow: "0 6px 10px rgba(0,0,0,.25)" }} />)}
      <div style={{ position: "absolute", left: 30, top: 40, width: 500, height: 300, background: PAPER, borderRadius: 8, boxShadow: SH, transform: `translateY(${(1 - k) * 60}px) rotate(${(1 - k) * -6}deg)`, overflow: "hidden" }}>
        <svg width={500} height={300} style={{ position: "absolute", inset: 0 }}><path d={`M0 0 L250 ${lerp(150, 10, op)} L500 0`} fill="#e6d3ab" stroke="#c9b282" strokeWidth={2} /></svg>
        <div style={{ position: "absolute", left: 30, right: 30, top: 72, fontFamily: SERIF, fontSize: 40, color: C.ink, lineHeight: 1.15, opacity: op }}>{r.q}</div>
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 24, fontFamily: HAND, fontSize: 40, color: C.wine, opacity: e(t, r.at + 1.2, r.at + 1.6) }}>{r.ans}</div>
        <div style={{ position: "absolute", right: 20, top: 16, fontFamily: SANS, fontWeight: 800, fontSize: 18, color: C.wine, opacity: op }}>{cur + 1} / {rows.length}</div>
      </div>
    </Shell>
  );
};

// 39 · LA BALANZA: el platillo de 1962 (98¢) contra el de hoy ($5.16); al final, «still half of what the store wants»
export const KitchenScale: React.FC<{ t: number; a: number; b: number; c: number; out: number }> = ({ t, a, b, c, out }) => {
  const tilt = lerp(0, -9, ei(t, b, b + 0.8)) + lerp(0, 4, ei(t, c, c + 0.8));
  return (
    <Shell t={t} a={a} out={out} w={640} h={420} y={370}>
      <div style={{ position: "absolute", left: 316, top: 110, width: 8, height: 220, background: "linear-gradient(90deg,#b98a3a,#f1d08a,#b98a3a)" }} />
      <div style={{ position: "absolute", left: 230, top: 320, width: 180, height: 30, borderRadius: 10, background: "linear-gradient(180deg,#d9b25c,#9a6d22)" }} />
      <div style={{ position: "absolute", left: 60, top: 100, width: 520, height: 8, background: "linear-gradient(180deg,#f1d08a,#9a6d22)", transform: `rotate(${tilt}deg)`, transformOrigin: "50% 50%" }}>
        {[{ x: -20, l: "1962", v: "98¢", s: "4¢ A ROLL", at: a + 0.3 }, { x: 380, l: "TODAY", v: "$5.16", s: "21¢ A ROLL", at: b }].map((p) => (
          <div key={p.l} style={{ position: "absolute", left: p.x, top: 8, width: 160, transform: `rotate(${-tilt}deg)`, transformOrigin: "50% 0", ...popS(t, p.at) }}>
            <div style={{ margin: "0 auto", width: 2, height: 50, background: "#9a6d22" }} />
            <div style={{ height: 30, borderRadius: "0 0 80px 80px", background: "linear-gradient(180deg,#f1d08a,#b98a3a)" }} />
            <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 18, color: C.ink, marginTop: 6 }}>{p.l}</div>
            <div style={{ textAlign: "center", fontFamily: SERIF, fontSize: 54, color: C.wine, lineHeight: 1 }}>{p.v}</div>
            <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 16 }}>{p.s}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 368, textAlign: "center", fontFamily: HAND, fontSize: 38, color: "#2f7a45", opacity: e(t, c, c + 0.4) }}>still half of what the store wants</div>
    </Shell>
  );
};

// 40 · EL BOL QUE QUEDÓ: el bol amarillo con su plato de tapa en el estante y la tarjetita de recuerdo de Hazel 1889–1974
export const KeptBowl: React.FC<{ t: number; a: number; b: number; out: number }> = ({ t, a, b, out }) => {
  const lift = ei(t, b, b + 1.2);
  return (
    <Shell t={t} a={a} out={out} w={580} h={420} y={390} bg="linear-gradient(180deg,#eef4f5,#d6e2e5)">
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, height: 14, background: "#b8c6ca" }} />
      <div style={{ position: "absolute", left: 60, top: 180, width: 230, height: 120, borderRadius: "0 0 115px 115px", background: "linear-gradient(180deg,#f6c94b,#cf8f15)", boxShadow: "0 10px 16px rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", left: 80, top: 186 - lift * 16, width: 190, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%, #fffaf0, #efd9b2)", opacity: lift }} />
      <div style={{ position: "absolute", left: 46, top: 162 - lift * 46, width: 258, height: 34, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #ffffff, #e6e3dc)", border: "3px solid #cfcac0", transform: `rotate(${-lift * 8}deg)` }} />
      <div style={{ position: "absolute", right: 30, top: 60, width: 190, height: 220, background: "#fbf8f0", boxShadow: "0 10px 14px rgba(0,0,0,.25)", border: `2px solid ${C.gold}`, textAlign: "center", padding: "18px 10px", transform: "rotate(4deg)", ...popS(t, a + 0.6) }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 14, letterSpacing: 2, color: C.wine }}>IN LOVING MEMORY</div>
        <div style={{ fontFamily: SERIF, fontSize: 34, color: C.ink, marginTop: 14, lineHeight: 1.1 }}>Hazel Nordquist</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 20, color: C.ink, marginTop: 14 }}>1889 – 1974</div>
        <div style={{ fontFamily: HAND, fontSize: 26, color: C.wine, marginTop: 12 }}>{"“I tell the dough.”"}</div>
      </div>
    </Shell>
  );
};
