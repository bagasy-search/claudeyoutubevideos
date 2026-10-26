// Hospice Chaplain Rosa (EN) · MUNDO del canal (enhr01, 26-oct). Piezas firma de la serie, todas sobre objetos de la cocina de Rosa:
// la LIBRETA con los nombres escritos a mano (los "9 things" se tachan o se tildan), el RELOJ de la cocina, la TARJETA del número
// de noche pegada en la heladera con un imán, la LÍNEA weeks → days → hours y las CINCO FRASES en tiras de papel.
// Paleta: azulejo amarillo, lila del cárdigan, papel, tinta azul. Sin filtros, grano ni viñeta. Textos en props.
import React from "react";
import { FONT, e, ei, extrude, spr } from "./lib";
import { MANO, SERIF } from "./funerario";

export const RO = { ink: "#f7f1e6", dim: "rgba(247,241,230,.74)", azulejo: "#f0c24b", azulejo2: "#ffdc7a", lila: "#b49ad8", lila2: "#d9c8f0", papel: "#f6efdc", tinta: "#22325a", rojo: "#b8322a", verde: "#2f8a4e", noche: "#14110f" };
const K = (k: number) => Math.min(1, k);
const vis = (t: number, at: number, out: number) => e(t, at, at + 0.18) * (1 - e(t, out, out + 0.35));

// ---------- 1. LIBRETA de Rosa: hoja de espiral con renglones; cada renglón se escribe en su frase, se tilda o se tacha ----------
export const Libreta: React.FC<{ t: number; at: number; out: number; title?: string; rows: { at: number; tx: string; tacha?: number; ok?: number }[]; x?: number; y?: number; w?: number; rot?: number }> = ({ t, at, out, title, rows, x = 1500, y = 540, w = 780, rot = 2.5 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.8)), lh = Math.min(84, 700 / Math.max(6, rows.length + 1)), fz = Math.min(lh * 0.78, (w - 170) / (Math.max(...rows.map((r) => r.tx.length), 8) * 0.355)), h = (rows.length + (title ? 1.6 : 0.6)) * lh + 90;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, opacity: o, transform: `perspective(1600px) rotateX(${(1 - k) * 28}deg) rotate(${rot + (1 - k) * 6}deg) translateY(${(1 - k) * 120}px)` }}>
      <div style={{ position: "relative", height: h, borderRadius: 8, background: RO.papel, boxShadow: "0 40px 90px rgba(0,0,0,.6)", overflow: "hidden",
        backgroundImage: `repeating-linear-gradient(180deg, transparent 0, transparent ${lh - 2}px, rgba(70,110,180,.28) ${lh - 2}px, rgba(70,110,180,.28) ${lh}px)`, backgroundPosition: `0 ${title ? lh * 1.6 + 40 : 40}px` }}>
        <div style={{ position: "absolute", left: 92, top: 0, bottom: 0, width: 3, background: "rgba(200,60,60,.45)" }} />
        {Array.from({ length: Math.floor(h / 46) }).map((_, i) => <div key={i} style={{ position: "absolute", left: 22, top: 24 + i * 46, width: 26, height: 26, borderRadius: 13, background: "#2a2622", boxShadow: "inset 0 3px 4px rgba(0,0,0,.6)" }} />)}
        {title && <div style={{ position: "absolute", left: 116, top: 30, fontFamily: MANO, fontWeight: 700, fontSize: lh * 0.95, color: RO.rojo, opacity: e(t, at + 0.25, at + 0.6) }}>{title}</div>}
        {rows.map((r, i) => {
          const top = (title ? lh * 1.6 : 0) + 40 + i * lh - lh * 0.82, wq = ei(t, r.at, r.at + 0.55), tq = r.tacha ? ei(t, r.tacha, r.tacha + 0.45) : 0, okq = r.ok ? K(spr(t, r.ok, 1)) : 0;
          return <div key={i} style={{ position: "absolute", left: 116, top, right: 40, height: lh }}>
            <div style={{ fontFamily: MANO, fontWeight: 700, fontSize: fz, lineHeight: `${lh}px`, color: RO.tinta, whiteSpace: "nowrap", clipPath: `inset(0 ${(1 - wq) * 100}% 0 0)`, opacity: tq > 0.5 ? 0.5 : 1 }}>{r.tx}</div>
            {tq > 0 && <svg width={w - 170} height={lh} style={{ position: "absolute", left: -6, top: 0, overflow: "visible" }}>
              <path d={`M0,${lh * 0.55} C${(w - 170) * 0.3},${lh * 0.42} ${(w - 170) * 0.6},${lh * 0.66} ${(w - 170) * tq},${lh * 0.5}`} stroke={RO.rojo} strokeWidth={5} fill="none" strokeLinecap="round" /></svg>}
            {okq > 0 && <div style={{ position: "absolute", left: -66, top: -lh * 0.1, fontFamily: MANO, fontSize: lh * 0.95, color: RO.verde, transform: `scale(${okq})` }}>✓</div>}
          </div>;
        })}
      </div>
    </div>
  );
};

// ---------- 2. RELOJ de la cocina: las agujas corren hasta la hora; el cartel dice qué pasa a esa hora ----------
export const Reloj: React.FC<{ t: number; at: number; out: number; h: number; m?: number; label?: string; sub?: string; x?: number; y?: number; r?: number }> = ({ t, at, out, h, m = 0, label, sub, x = 1460, y = 430, r = 210 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.8)), q = ei(t, at + 0.2, at + 1.6), mins = (h % 12) * 60 + m, cur = (mins + 720) * q;  // da una vuelta entera de más
  const am = ((cur % 60) / 60) * 360, ah = ((cur % 720) / 720) * 360;
  const sw = Math.sin((t - at) * 2.4) * 1.8 * (1 - e(t, at, at + 3));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${sw}deg) scale(${0.8 + 0.2 * k})`, textAlign: "center" }}>
      <div style={{ position: "relative", width: r * 2, height: r * 2, borderRadius: r, background: "radial-gradient(circle at 45% 40%, #fffaf0, #efe4cc)", border: `${r * 0.09}px solid ${RO.azulejo}`, boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 0 30px rgba(0,0,0,.12)", margin: "0 auto" }}>
        {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: i % 3 ? 6 : 12, height: i % 3 ? r * 0.1 : r * 0.16, background: RO.tinta, transform: `translate(-50%,-50%) rotate(${i * 30}deg) translateY(${-r * 0.74}px)`, borderRadius: 3 }} />)}
        <div style={{ position: "absolute", left: "50%", top: "50%", width: r * 0.07, height: r * 0.5, background: RO.tinta, borderRadius: 8, transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${ah}deg)` }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", width: r * 0.045, height: r * 0.72, background: RO.tinta, borderRadius: 6, transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${am}deg)` }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", width: r * 0.14, height: r * 0.14, borderRadius: "50%", background: RO.rojo, transform: "translate(-50%,-50%)" }} />
      </div>
      {label && <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: RO.ink, marginTop: 34, textShadow: "0 6px 28px rgba(0,0,0,.8)", opacity: e(t, at + 1.2, at + 1.6) }}>{label}</div>}
      {sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 3, color: RO.azulejo2, marginTop: 10, textShadow: "0 3px 14px rgba(0,0,0,.9)", opacity: e(t, at + 1.6, at + 2.0) }}>{sub}</div>}
    </div>
  );
};

// ---------- 3. TARJETA pegada en la heladera con un imán: el dato o el número de noche ----------
export const Tarjeta: React.FC<{ t: number; at: number; out: number; kicker?: string; title: string; dato?: string; mano?: string; x?: number; y?: number; w?: number; rot?: number }> = ({ t, at, out, kicker, title, dato, mano, x = 1500, y = 540, w = 600, rot = -2 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.7)), mq = K(spr(t, at + 0.35, 1.2));
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.4, width: w, opacity: o, transform: `perspective(1500px) rotateY(${(1 - k) * -40}deg) rotate(${rot + (1 - k) * 8}deg) translateX(${(1 - k) * 160}px)` }}>
      <div style={{ position: "relative", background: "#fffdf6", borderRadius: 6, padding: `${w * 0.09}px ${w * 0.08}px ${w * 0.07}px`, boxShadow: "0 36px 80px rgba(0,0,0,.6)", textAlign: "center", color: RO.tinta,
        backgroundImage: `linear-gradient(180deg, transparent ${w * 0.2}px, rgba(200,60,60,.4) ${w * 0.2}px, rgba(200,60,60,.4) ${w * 0.2 + 2}px, transparent ${w * 0.2 + 2}px)` }}>
        <div style={{ position: "absolute", left: "50%", top: -w * 0.05, width: w * 0.12, height: w * 0.12, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, ${RO.lila2}, ${RO.lila} 60%, #7a5fa8)`, boxShadow: "0 8px 16px rgba(0,0,0,.45)", transform: `translateX(-50%) scale(${mq})` }} />
        {kicker && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: w * 0.045, letterSpacing: w * 0.006, color: RO.rojo, opacity: e(t, at + 0.3, at + 0.6) }}>{kicker}</div>}
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: w * 0.07, lineHeight: 1.15, marginTop: w * 0.03, textWrap: "balance" as any, opacity: e(t, at + 0.45, at + 0.8) }}>{title}</div>
        {dato && <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: w * 0.2, lineHeight: 1, marginTop: w * 0.04, color: RO.tinta, transform: `scale(${0.85 + 0.15 * K(spr(t, at + 0.8, 0.9))})`, opacity: e(t, at + 0.75, at + 1.05) }}>{dato}</div>}
        {mano && <div style={{ fontFamily: MANO, fontWeight: 700, fontSize: w * 0.075, color: "#2b4a8a", marginTop: w * 0.04, transform: "rotate(-2deg)", clipPath: `inset(0 ${(1 - ei(t, at + 1.1, at + 2.0)) * 100}% 0 0)` }}>{mano}</div>}
      </div>
    </div>
  );
};

// ---------- 4. LÍNEA weeks → days → hours: el marcador camina por las etapas, cada una con su nota ----------
export const Linea: React.FC<{ t: number; at: number; out: number; title?: string; stages: { at: number; tx: string; sub?: string }[]; y?: number }> = ({ t, at, out, title, stages, y = 560 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.8)), n = stages.length, W = 1380, x0 = 270;
  const lit = stages.filter((s) => t >= s.at).length, idx = Math.max(0, lit - 1), prv = Math.max(0, idx - 1);
  const mq = lit ? ei(t, stages[idx].at, stages[idx].at + 0.6) : 0, px = x0 + (W * (prv + (idx - prv) * mq)) / Math.max(1, n - 1);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: y - 330, height: 560, background: "linear-gradient(180deg, rgba(20,17,15,0), rgba(20,17,15,.62) 30%, rgba(20,17,15,.62) 72%, rgba(20,17,15,0))" }} />
      {title && <div style={{ position: "absolute", left: 0, right: 0, top: y - 250, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 68, color: RO.ink, textShadow: "0 6px 28px rgba(0,0,0,.8)", opacity: k }}>{title}</div>}
      <div style={{ position: "absolute", left: x0, top: y - 5, width: W * ei(t, at, at + 0.9), height: 10, borderRadius: 5, background: "rgba(247,241,230,.35)" }} />
      <div style={{ position: "absolute", left: x0, top: y - 5, width: Math.max(0, px - x0), height: 10, borderRadius: 5, background: RO.azulejo }} />
      {stages.map((s, i) => {
        const sx = x0 + (W * i) / Math.max(1, n - 1), q = K(spr(t, s.at, 1.1)), on = t >= s.at;
        return <div key={i} style={{ position: "absolute", left: sx, top: y, transform: "translate(-50%,-50%)", textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, margin: "0 auto", background: on ? RO.azulejo : "rgba(247,241,230,.4)", boxShadow: on ? `0 0 0 ${10 + 5 * Math.sin(t * 4)}px ${RO.azulejo}44` : "none", transform: `scale(${0.7 + 0.3 * q})` }} />
          <div style={{ position: "absolute", left: 22 - 300, width: 600, top: 70, transform: `translateY(${(1 - q) * 20}px)`, whiteSpace: "nowrap", opacity: 0.3 + 0.7 * q }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: on ? RO.ink : RO.dim, textShadow: "0 5px 22px rgba(0,0,0,.85)" }}>{s.tx}</div>
            {s.sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: RO.azulejo2, marginTop: 6, textShadow: "0 3px 12px rgba(0,0,0,.9)" }}>{s.sub}</div>}
          </div>
        </div>;
      })}
      {lit > 0 && <div style={{ position: "absolute", left: px, top: y, width: 70, height: 70, borderRadius: 35, border: `6px solid ${RO.lila}`, boxShadow: `0 0 24px ${RO.lila}`, transform: "translate(-50%,-50%)" }} />}
    </div>
  );
};

// ---------- 5. LAS CINCO FRASES: tiras de papel escritas a mano que caen sobre la mesa, una por frase ----------
export const Cinco: React.FC<{ t: number; at: number; out: number; title?: string; items: { at: number; tx: string }[] }> = ({ t, at, out, title, items }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.8));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 900, background: "linear-gradient(180deg, rgba(20,17,15,0), rgba(20,17,15,.62) 18%, rgba(20,17,15,.62) 85%, rgba(20,17,15,0))" }} />
      {title && <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 38, letterSpacing: 10, color: RO.azulejo2, textShadow: "0 3px 14px rgba(0,0,0,.9)", opacity: k }}>{title}</div>}
      {items.map((it, i) => {
        const q = K(spr(t, it.at, 0.8)), rot = [-3, 2.5, -1.5, 3, -2][i % 5], yy = 210 + i * 158, xx = 960 + [-60, 70, -30, 50, -10][i % 5];
        if (t < it.at - 0.05) return null;
        return <div key={i} style={{ position: "absolute", left: xx, top: yy, transform: `translateX(-50%) rotate(${rot + (1 - q) * 10}deg) translateY(${(1 - q) * -80}px) scale(${0.9 + 0.1 * q})`, opacity: e(t, it.at, it.at + 0.12) }}>
          <div style={{ background: RO.papel, padding: "14px 54px 10px", borderRadius: 4, boxShadow: "0 18px 40px rgba(0,0,0,.55)", fontFamily: MANO, fontWeight: 700, fontSize: 92, color: RO.tinta, whiteSpace: "nowrap", lineHeight: 1.05 }}>{it.tx}</div>
        </div>;
      })}
    </div>
  );
};

// ---------- 6. NÚMERO del punto en azulejo amarillo (reemplaza al capítulo de veladora del funerario) ----------
export const Numero: React.FC<{ t: number; at: number; out: number; n: string; title: string; sub?: string; kicker?: string }> = ({ t, at, out, n, title, sub, kicker = "NUMBER" }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.8)), k2 = ei(t, at + 0.25, at + 0.9);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 55%, rgba(20,14,8,.3), rgba(16,12,8,.86) 70%)" }} />
      <div style={{ position: "absolute", left: 170, top: 270, width: 440, height: 440, borderRadius: 26, background: `linear-gradient(145deg, ${RO.azulejo2}, ${RO.azulejo})`, boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 0 0 10px rgba(255,255,255,.25)", transform: `translateX(${(1 - k) * -160}px) rotate(${(1 - k) * -12}deg) scale(${0.8 + 0.2 * k})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: SERIF, fontSize: 340, fontWeight: 900, lineHeight: 1, color: RO.tinta, textShadow: extrude(8, "#9a7a20") }}>{n}</div>
      </div>
      <div style={{ position: "absolute", left: 680, top: 360, width: 1120 }}>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 10, color: RO.dim, opacity: k2 }}>{kicker} {n}</div>
        <div style={{ height: 5, width: 820 * k2, background: RO.lila, margin: "18px 0 22px", borderRadius: 3 }} />
        <div style={{ fontFamily: SERIF, fontSize: 96, fontWeight: 900, color: RO.ink, lineHeight: 1.05, textWrap: "balance" as any, transform: `translateY(${(1 - k2) * 40}px)`, opacity: k2, textShadow: "0 6px 30px rgba(0,0,0,.6)" }}>{title}</div>
        {sub && <div style={{ fontSize: 40, fontWeight: 700, color: RO.azulejo2, marginTop: 20, opacity: e(t, at + 0.8, at + 1.2) }}>{sub}</div>}
      </div>
    </div>
  );
};
