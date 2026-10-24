// reikohands · piezas de PAPEL del estilo avatar-bertha (biblioteca: pb-polaroids-lista, pb-notas-papel, círculo rojo punteado).
// Van sobre la toma real o el mundo; papel con textura, cinta, sombra al piso, letra a mano (Caveat) + sans pesada para números.
import React from "react";
import { Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Caveat";
import { FONT, COL, e, spr } from "../kits/yanqui3d/lib";

const { fontFamily: HAND } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const op = (t: number, a: number, out: number) => e(t, a, a + 0.18) * (1 - e(t, out, out + 0.3));
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const PAPER = "linear-gradient(180deg,#fbf7ee,#f1e9d8)";
const tape = (rot: number): React.CSSProperties => ({ position: "absolute", top: -16, left: "50%", width: 120, height: 34, marginLeft: -60, transform: `rotate(${rot}deg)`, background: "rgba(236,226,196,.82)", boxShadow: "0 2px 6px rgba(0,0,0,.18)" });

// fila de polaroids numeradas: anuncian la lista (las 8 cosas). `on` = cuándo cae cada una; `hi` = cuál se destaca
export const Polaroids: React.FC<{ t: number; items: { at: number; img: string; label: string }[]; out: number; hi?: number; y?: number }> = ({ t, items, out, hi = -1, y = 540 }) => {
  const n = items.length, W0 = n > 5 ? 200 : 260, gap = n > 5 ? 22 : 40;
  const o = op(t, items[0].at - 0.1, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: "translateY(-50%)", display: "flex", justifyContent: "center", gap, opacity: o }}>
      {items.map((it, i) => {
        const k = Math.min(1.08, spr(t, it.at, 0.9)), rot = (rnd(i) - 0.5) * 12, on = t >= it.at - 0.02;
        const lift = hi === i ? -26 : 0, dim = hi >= 0 && hi !== i ? 0.45 : 1;
        return (
          <div key={i} style={{ width: W0, padding: "12px 12px 0", background: PAPER, boxShadow: "0 22px 40px rgba(0,0,0,.55)", position: "relative", opacity: on ? Math.min(1, k * 1.5) * dim : 0,
            transform: `translateY(${(1 - Math.min(1, k)) * -260 + lift}px) rotate(${rot * (2 - Math.min(1, k))}deg) scale(${hi === i ? 1.12 : 1})` }}>
            <div style={tape(-rot * 0.6)} />
            <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", background: "#222" }}><Img src={staticFile(it.img)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.85)" }} /></div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: n > 5 ? 30 : 38, color: "#2a2520", textAlign: "center", lineHeight: 1.05, padding: "8px 2px 14px", minHeight: n > 5 ? 74 : 90 }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, color: "#c0392b", marginRight: 8 }}>{i + 1}</span>{it.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// notas de papel que se apilan (un proceso en 2-4 pasos) sobre la toma real
export const Notes: React.FC<{ t: number; rows: { at: number; txt: string }[]; out: number; x?: number; y?: number; title?: string }> = ({ t, rows, out, x = 1430, y = 300, title }) => {
  const o = op(t, rows[0].at - 0.1, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translateX(-50%)", opacity: o, width: 520 }}>
      {title && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 5, color: COL.ink, textShadow: "0 3px 10px rgba(0,0,0,.8)", marginBottom: 14, textAlign: "center" }}>{title}</div>}
      {rows.map((r, i) => {
        const k = Math.min(1.1, spr(t, r.at, 1.1)), on = t >= r.at - 0.02, rot = (rnd(i, 3) - 0.5) * 6;
        return (
          <div key={i} style={{ position: "relative", marginTop: i ? -6 : 0, padding: "20px 26px 18px 76px", background: i % 2 ? "#fff6c9" : PAPER, boxShadow: "0 16px 30px rgba(0,0,0,.5)",
            opacity: on ? Math.min(1, k * 1.6) : 0, transform: `translateX(${(1 - Math.min(1, k)) * 300}px) rotate(${rot}deg)` }}>
            <div style={{ position: "absolute", left: 18, top: 14, width: 44, height: 44, borderRadius: 22, background: "#c0392b", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#2a2520", lineHeight: 1.05 }}>{r.txt}</div>
          </div>
        );
      })}
    </div>
  );
};

// círculo rojo punteado que se dibuja a mano alrededor de algo de la toma real (+ nota escrita al lado)
export const RedRing: React.FC<{ t: number; at: number; out: number; x: number; y: number; rx?: number; ry?: number; note?: string; nx?: number; ny?: number }> = ({ t, at, out, x, y, rx = 170, ry = 120, note, nx = 230, ny = -170 }) => {
  const o = op(t, at - 0.05, out); if (o <= 0.01) return null;
  const k = e(t, at, at + 0.7), L = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2) * 1.08;
  const nk = Math.min(1, spr(t, at + 0.45, 1.1));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke="#e8352a" strokeWidth={9} strokeLinecap="round" strokeDasharray="22 16" transform={`rotate(-8 ${x} ${y})`}
          style={{ strokeDashoffset: 0, clipPath: "none" }} pathLength={L} opacity={0.95}
          mask={`url(#rr${Math.round(at * 10)})`} />
        <defs><mask id={`rr${Math.round(at * 10)}`}><ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke="#fff" strokeWidth={44} strokeDasharray={`${k * L} ${L}`} pathLength={L} transform={`rotate(-8 ${x} ${y})`} /></mask></defs>
      </svg>
      {note && <div style={{ position: "absolute", left: x + nx, top: y + ny, transform: `translate(-50%,-50%) rotate(-4deg) scale(${nk})`, padding: "12px 24px", background: "#fff6c9", boxShadow: "0 14px 28px rgba(0,0,0,.5)",
        fontFamily: HAND, fontWeight: 700, fontSize: 46, color: "#2a2520", whiteSpace: "nowrap" }}>{note}</div>}
    </div>
  );
};

// título de cada regla: tarjeta de papel grande que cae al centro ("RULE 4" / "REGLA 4" + el nombre a mano)
export const RuleTitle: React.FC<{ t: number; at: number; out: number; word: string; n: number; name: string }> = ({ t, at, out, word, n, name }) => {
  const o = op(t, at - 0.05, out); if (o <= 0.01) return null;
  const k = Math.min(1.06, spr(t, at, 0.85)), k2 = Math.min(1, spr(t, at + 0.3, 1));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: `radial-gradient(ellipse 55% 50% at 50% 50%, rgba(0,0,0,${0.5 * o}), transparent 75%)` }}>
      <div style={{ position: "absolute", left: 960, top: 540, width: 1040, padding: "40px 60px 44px", background: PAPER, boxShadow: "0 40px 80px rgba(0,0,0,.6)", textAlign: "center",
        transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * -700}px) rotate(${-3 + (1 - Math.min(1, k)) * 14}deg)` }}>
        <div style={tape(4)} />
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, letterSpacing: 22, color: "#8a7a66" }}>{word}</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 250, lineHeight: 0.95, color: "#c0392b" }}>{n}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: Math.min(92, Math.floor(1900 / Math.max(10, name.length))), color: "#2a2520", lineHeight: 1.05, opacity: k2, transform: `translateY(${(1 - k2) * 30}px)` }}>{name}</div>
      </div>
    </div>
  );
};

// el error (lo que hace la otra mujer): ficha de papel con X roja
export const Oops: React.FC<{ t: number; at: number; out: number; label: string; txt: string; x?: number; y?: number }> = ({ t, at, out, label, txt, x = 960, y = 880 }) => {
  const o = op(t, at - 0.05, out); if (o <= 0.01) return null;
  const k = Math.min(1.08, spr(t, at, 1.1)), xk = e(t, at + 0.35, at + 0.65);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * Math.min(1, k)}) rotate(-2deg)`, display: "flex", alignItems: "center", gap: 22, padding: "18px 40px 18px 24px", background: PAPER, boxShadow: "0 24px 50px rgba(0,0,0,.55)", whiteSpace: "nowrap" }}>
      <svg width={84} height={84} viewBox="0 0 84 84"><path d="M14 14 L70 70" stroke="#e8352a" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.min(1, xk * 2)} 1`} /><path d="M70 14 L14 70" stroke="#e8352a" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.max(0, xk * 2 - 1)} 1`} /></svg>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, letterSpacing: 8, color: "#c0392b" }}>{label}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: "#2a2520", lineHeight: 1 }}>{txt}</div>
      </div>
    </div>
  );
};

// suscribirse + campanita (CTA del canal sin guía): botón rojo que se aprieta y campana que se mueve
export const SubBell: React.FC<{ t: number; at: number; bellAt: number; out: number; sub: string; done: string; x?: number; y?: number }> = ({ t, at, bellAt, out, sub, done, x = 960, y = 860 }) => {
  const o = op(t, at - 0.05, out); if (o <= 0.01) return null;
  const k = Math.min(1.1, spr(t, at, 1.1)), pressed = t > at + 0.7, press = t > at + 0.6 && t < at + 0.8 ? 0.92 : 1;
  const b = Math.min(1.1, spr(t, bellAt, 1.2)), ring = t > bellAt + 0.3 ? Math.sin((t - bellAt) * 22) * 18 * Math.exp(-(t - bellAt - 0.3) * 2.2) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: o, display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ transform: `scale(${Math.min(1, k) * press})`, padding: "24px 58px", borderRadius: 60, background: pressed ? "#2b2b2b" : "#e62117", fontFamily: FONT, fontWeight: 900, fontSize: 54, letterSpacing: 3, color: "#fff", boxShadow: "0 24px 50px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{pressed ? done : sub}</div>
      {t >= bellAt - 0.05 && <div style={{ width: 110, height: 110, borderRadius: 55, background: "#fff", boxShadow: "0 20px 40px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${Math.min(1, b)}) rotate(${ring}deg)` }}>
        <svg width={64} height={64} viewBox="0 0 24 24"><path d="M12 22a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.8V3a1.5 1.5 0 0 0-3 0v1.2A7 7 0 0 0 5 11v5l-2 2v1h18v-1z" fill="#222" /></svg>
      </div>}
    </div>
  );
};
