// fe02 · piezas 2.5D NUEVAS del video (además de la firma del canal en funerario.tsx): ETIQUETA colgante que gira y se da vuelta
// con el precio, PLUMA que tacha en vivo los renglones, BALANZA paquete vs. por separado, SOBRE amarillo que se abre con la regla
// escrita, LISTA DE PRECIOS con el renglón que se ilumina. Modelo «stagecraft»: UNA luz (arriba-izquierda) → sombra de losa abajo-
// derecha, brillo especular que barre, inclinación con perspective() (nunca preserve-3d), foco que entra (blur 2,2 → 0) y sale (→ 1,8).
import React from "react";
import { FONT, e, ei, spr } from "./lib";
import { FE, SERIF, SERIF_GRAB, MANO } from "./funerario";

const cl = (x: number) => Math.max(0, Math.min(1, x));
const vis = (t: number, at: number, out: number) => e(t, at, at + 0.2) * (1 - e(t, out, out + 0.35));
// el escenario común: losa con sombra de la única luz, inclinación suave que respira, foco que entra y sale
const Slab: React.FC<{ t: number; at: number; out: number; x: number; y: number; w: number; h: number; rx?: number; ry?: number; children: React.ReactNode; bg?: string; radius?: number }> = ({ t, at, out, x, y, w, h, rx = 6, ry = -8, children, bg = FE.papel, radius = 10 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, at, 0.75)), q = t - at;
  const blur = 2.2 * (1 - e(t, at, at + 0.45)) + 1.8 * e(t, out - 0.05, out + 0.3);
  const tx = rx * (1 - k) + 2.2 * Math.sin(q * 0.55), ty = ry * (1 - k) + 3 * Math.sin(q * 0.4 + 1);
  const spec = ((q * 0.22) % 1.6) - 0.3;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: o, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
      transform: `perspective(1700px) rotateX(${tx.toFixed(2)}deg) rotateY(${ty.toFixed(2)}deg) translateY(${(1 - Math.min(1, k)) * 70}px) scale(${0.94 + 0.06 * Math.min(1, k)})` }}>
      {/* sombra de losa: la luz viene de arriba a la izquierda */}
      <div style={{ position: "absolute", left: 26, top: 34, width: w, height: h, borderRadius: radius, background: "rgba(0,0,0,.55)", filter: "blur(22px)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: radius, background: bg, overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.25), 0 2px 0 rgba(0,0,0,.25)" }}>
        {children}
        {/* luz única: más clara arriba-izquierda + brillo especular que barre lento */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(140deg, rgba(255,250,235,.22) 0%, rgba(255,250,235,0) 45%, rgba(0,0,0,.16) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, rgba(255,255,255,0) ${(spec * 100 - 8).toFixed(1)}%, rgba(255,255,255,.16) ${(spec * 100).toFixed(1)}%, rgba(255,255,255,0) ${(spec * 100 + 8).toFixed(1)}%)`, pointerEvents: "none" }} />
      </div>
    </div>
  );
};
const Kicker: React.FC<{ tx: string; col?: string; size?: number }> = ({ tx, col = "#5a4a36", size = 26 }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: 4, color: col, textTransform: "uppercase" }}>{tx}</div>
);

// ---------- ETIQUETA colgante: cuelga de su hilo, se balancea y se da vuelta (frente «¿Cuánto?» → dorso con el precio) ----------
export const Etiqueta: React.FC<{ t: number; at: number; out: number; flipAt: number; front?: string; back: string; sub?: string; note?: string; x?: number; y?: number; w?: number }> = ({ t, at, out, flipAt, front = "¿Cuánto?", back, sub, note, x = 1340, y = 470, w = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const h = w * 0.62, q = t - at;
  const drop = Math.min(1.04, spr(t, at, 0.7));
  const fl = ei(t, flipAt, flipAt + 0.8);
  const sway = (Math.sin(q * 2.1) * 7 * Math.exp(-q * 0.35) + Math.sin(q * 0.9) * 2) * (1 - fl * 0.5);
  const ang = fl * 180 + Math.sin(q * 1.7) * 9 * (1 - fl) + (fl > 0 && fl < 1 ? 0 : 0);
  const showBack = ang % 360 > 90 && ang % 360 < 270;
  const sq = Math.abs(Math.cos((ang * Math.PI) / 180)); // ancho aparente al girar (sin preserve-3d)
  const blur = 2.2 * (1 - e(t, at, at + 0.45)) + 1.8 * e(t, out - 0.05, out + 0.3);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2 - 260 * (1 - drop), width: w, height: h + 220, opacity: o, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined, transformOrigin: "50% 0", transform: `rotate(${sway.toFixed(2)}deg)` }}>
      {/* hilo desde arriba */}
      <div style={{ position: "absolute", left: w / 2 - 1.5, top: -400, width: 3, height: 400 + 60, background: "linear-gradient(#d8c9a6, #b9a77f)" }} />
      <div style={{ position: "absolute", left: w / 2 - (w / 2) * sq, top: 60, width: w * Math.max(0.02, sq), height: h }}>
        <div style={{ position: "absolute", left: 30, top: 36, width: "100%", height: h, borderRadius: 18, background: "rgba(0,0,0,.5)", filter: "blur(20px)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: showBack ? "#f4ead2" : "#efe3c8", border: "6px solid #8a6a3a", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 26, top: 22, width: 26, height: 26, borderRadius: 13, background: "#2b2219", boxShadow: "inset 0 2px 3px rgba(255,255,255,.3)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: showBack ? "scaleX(-1) scaleX(-1)" : undefined }}>
            {showBack ? <>
              <div style={{ fontFamily: SERIF_GRAB, fontWeight: 900, fontSize: w * 0.22, color: "#9e2a24", lineHeight: 1, transform: `scale(${0.85 + 0.15 * Math.min(1, spr(t, flipAt + 0.4, 1))})` }}>{back}</div>
              {sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: w * 0.06, color: "#5a4a36", marginTop: 14, letterSpacing: 2, textTransform: "uppercase" }}>{sub}</div>}
            </> : <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: w * 0.15, color: "#2a2219" }}>{front}</div>}
          </div>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${showBack ? 220 : 140}deg, rgba(255,255,255,.25), rgba(255,255,255,0) 50%, rgba(0,0,0,.15))` }} />
        </div>
      </div>
      {note && <div style={{ position: "absolute", left: 0, right: 0, top: h + 100, textAlign: "center", fontFamily: MANO, fontWeight: 700, fontSize: w * 0.1, color: FE.ink, textShadow: "0 3px 12px rgba(0,0,0,.8)", opacity: e(t, flipAt + 0.7, flipAt + 1.1) }}>{note}</div>}
    </div>
  );
};

// ---------- PLUMA que tacha: la hoja de cotización y la pluma que cruza el renglón en vivo; el total baja ----------
export const PlumaTacha: React.FC<{ t: number; at: number; out: number; title?: string; rows: { tx: string; v: string; at?: number }[]; total?: { from: string; to: string; at: number }; x?: number; y?: number; w?: number }> = ({ t, at, out, title = "COTIZACIÓN", rows, total, x = 1300, y = 540, w = 860 }) => {
  const rh = 64, h = 170 + rows.length * rh + (total ? 120 : 30);
  // la pluma va al renglón que se está tachando (o descansa al costado)
  const cur = rows.map((r, i) => ({ r, i })).filter(({ r }) => r.at !== undefined && t >= r.at - 0.45 && t < r.at + 0.75).pop();
  const pk = cur ? cl((t - cur.r.at!) / 0.55) : 0;
  const px = cur ? 70 + (w - 150) * pk : w - 40, py = cur ? 150 + cur.i * rh + rh * 0.42 : h - 70;
  return (
    <Slab t={t} at={at} out={out} x={x} y={y} w={w} h={h} rx={10} ry={-10}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 34, textAlign: "center", fontFamily: SERIF_GRAB, fontWeight: 900, fontSize: 52, color: "#2a2219", letterSpacing: 4 }}>{title}</div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 112, height: 3, background: "#2a2219" }} />
      {rows.map((r, i) => {
        const sk = r.at !== undefined ? cl((t - r.at) / 0.55) : 0, ry = 150 + i * rh;
        const fade = r.at !== undefined && t > r.at + 0.6 ? 0.45 : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 60, right: 60, top: ry, height: rh, opacity: e(t, at + 0.25 + i * 0.08, at + 0.55 + i * 0.08) }}>
            <div style={{ position: "absolute", left: 0, top: 10, fontFamily: FONT, fontWeight: 700, fontSize: 31, color: "#2a2219", opacity: fade, whiteSpace: "nowrap", maxWidth: w - 300, overflow: "hidden" }}>{r.tx}</div>
            <div style={{ position: "absolute", right: 0, top: 8, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#2a2219", opacity: fade }}>{r.v}</div>
            {sk > 0 && <svg width={w - 120} height={rh} style={{ position: "absolute", left: -6, top: 0, overflow: "visible" }}>
              <path d={`M0,${rh * 0.45} Q${(w - 120) * 0.5},${rh * 0.36} ${(w - 120) * sk},${rh * 0.43}`} stroke={FE.rojo} strokeWidth={7} strokeLinecap="round" fill="none" />
            </svg>}
          </div>
        );
      })}
      {total && <div style={{ position: "absolute", left: 60, right: 60, bottom: 34, height: 70, borderTop: "3px solid #2a2219" }}>
        <div style={{ position: "absolute", left: 0, top: 16, fontFamily: SERIF_GRAB, fontWeight: 900, fontSize: 42, color: "#2a2219" }}>TOTAL</div>
        <div style={{ position: "absolute", right: 0, top: 12, fontFamily: SERIF_GRAB, fontWeight: 900, fontSize: 46, color: "#2a2219", opacity: 1 - e(t, total.at, total.at + 0.25), textDecoration: t > total.at ? "line-through" : undefined }}>{total.from}</div>
        <div style={{ position: "absolute", right: 0, top: 6, fontFamily: SERIF_GRAB, fontWeight: 900, fontSize: 54, color: "#2f7a46", opacity: e(t, total.at + 0.2, total.at + 0.5), transform: `scale(${0.8 + 0.2 * Math.min(1, spr(t, total.at + 0.2, 1))})`, transformOrigin: "100% 50%" }}>{total.to}</div>
      </div>}
      {/* la pluma fuente (negra, anillo dorado), inclinada como en la mano */}
      <div style={{ position: "absolute", left: px - 8, top: py - 230, width: 26, height: 240, transformOrigin: "50% 100%", transform: `rotate(${cur ? 24 : 34}deg)`, transition: "none" }}>
        <div style={{ position: "absolute", left: 20, top: 20, width: 26, height: 230, background: "rgba(0,0,0,.35)", filter: "blur(8px)", borderRadius: 13 }} />
        <div style={{ position: "absolute", left: 2, top: 0, width: 22, height: 190, borderRadius: 11, background: "linear-gradient(90deg, #0d0c0b, #3a3633 45%, #0d0c0b)" }} />
        <div style={{ position: "absolute", left: 1, top: 120, width: 24, height: 14, background: "linear-gradient(90deg, #8a6a2a, #f1d58a 50%, #8a6a2a)" }} />
        <div style={{ position: "absolute", left: 5, top: 188, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "48px solid #d4b05c" }} />
      </div>
    </Slab>
  );
};

// ---------- BALANZA: «PAQUETE» (una caja que pesa) contra «POR SEPARADO» (lo que de verdad necesita) ----------
export const Balanza: React.FC<{ t: number; at: number; out: number; left: string; right: string; lv: string; rv: string; tiltAt: number; x?: number; y?: number; w?: number }> = ({ t, at, out, left, right, lv, rv, tiltAt, x = 960, y = 560, w = 1100 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.7));
  const tilt = 9 * ei(t, at + 0.3, at + 1.0) - 18 * ei(t, tiltAt, tiltAt + 0.9) + 1.2 * Math.sin((t - at) * 1.3) * (1 - e(t, tiltAt, tiltAt + 1));
  const blur = 2.2 * (1 - e(t, at, at + 0.45)) + 1.8 * e(t, out - 0.05, out + 0.3);
  const arm = w * 0.8, rad = (tilt * Math.PI) / 180;
  const pan = (side: -1 | 1, label: string, v: string, col: string) => {
    const px = w / 2 + side * (arm / 2) * Math.cos(rad), py = 170 + side * (arm / 2) * Math.sin(rad);
    return (
      <div style={{ position: "absolute", left: px - 190, top: py, width: 380, height: 330 }}>
        <svg width={380} height={150} style={{ position: "absolute", left: 0, top: 0 }}><path d="M190,0 L40,150 M190,0 L340,150" stroke="#b08a3e" strokeWidth={4} /></svg>
        <div style={{ position: "absolute", left: 0, top: 140, width: 380, height: 30, borderRadius: "0 0 190px 190px", background: "linear-gradient(#e2c27a, #8a6a2a)", boxShadow: "18px 26px 30px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: 10, top: -40, width: 360, height: 180, borderRadius: 14, background: col, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "14px 18px 24px rgba(0,0,0,.45), inset 0 2px 0 rgba(255,255,255,.3)", transform: `scale(${Math.min(1, spr(t, at + 0.5 + (side + 1) * 0.15, 1))})` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff", letterSpacing: 2 }}>{label}</div>
          <div style={{ fontFamily: SERIF_GRAB, fontWeight: 900, fontSize: 46, color: "#fff6dc", marginTop: 6 }}>{v}</div>
        </div>
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - 300, width: w, height: 640, opacity: o, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined, transform: `perspective(1700px) rotateX(${(1 - k) * 14}deg) translateY(${(1 - k) * 60}px)` }}>
      {/* poste y base */}
      <div style={{ position: "absolute", left: w / 2 - 14, top: 150, width: 28, height: 400, background: "linear-gradient(90deg, #6a4f1e, #e2c27a 50%, #6a4f1e)", boxShadow: "20px 20px 30px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", left: w / 2 - 170, top: 540, width: 340, height: 50, borderRadius: 10, background: "linear-gradient(#e2c27a, #6a4f1e)", boxShadow: "24px 30px 40px rgba(0,0,0,.55)" }} />
      {/* brazo que se inclina */}
      <div style={{ position: "absolute", left: w / 2 - arm / 2, top: 162, width: arm, height: 16, borderRadius: 8, background: "linear-gradient(#f1d58a, #8a6a2a)", transform: `rotate(${tilt}deg)`, boxShadow: "14px 18px 20px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", left: w / 2 - 22, top: 148, width: 44, height: 44, borderRadius: 22, background: "radial-gradient(circle at 35% 35%, #fff3c8, #b08a3e)" }} />
      {pan(-1, left, lv, "#7a2a22")}
      {pan(1, right, rv, "#2f6a46")}
    </div>
  );
};

// ---------- SOBRE amarillo: llega, se abre la solapa y sale la tarjeta con la frase escrita a mano ----------
export const Sobre: React.FC<{ t: number; at: number; out: number; text: string; who?: string; openAt?: number; x?: number; y?: number; w?: number }> = ({ t, at, out, text, who, openAt, x = 960, y = 560, w = 820 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const oa = openAt ?? at + 0.7, h = w * 0.58;
  const k = Math.min(1, spr(t, at, 0.7)), fk = ei(t, oa, oa + 0.55), ck = ei(t, oa + 0.4, oa + 1.1);
  const blur = 2.2 * (1 - e(t, at, at + 0.45)) + 1.8 * e(t, out - 0.05, out + 0.3);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2 + 90, width: w, height: h, opacity: o, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined, transform: `perspective(1700px) rotateX(${(1 - k) * 25 + 4}deg) rotateZ(${(1 - k) * -6 - 1.5}deg) translateY(${(1 - k) * 120}px)` }}>
      <div style={{ position: "absolute", left: 30, top: 40, width: w, height: h, background: "rgba(0,0,0,.5)", filter: "blur(24px)", borderRadius: 8 }} />
      {/* la tarjeta que sale */}
      <div style={{ position: "absolute", left: w * 0.07, top: 20 - ck * h * 0.62, width: w * 0.86, height: h * 0.9, background: FE.papel, borderRadius: 6, boxShadow: "0 10px 26px rgba(0,0,0,.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: h * 0.08, boxSizing: "border-box" }}>
        <div style={{ fontFamily: MANO, fontWeight: 700, fontSize: w * 0.07, color: FE.tinta, textAlign: "center", lineHeight: 1.1, padding: `0 ${w * 0.06}px`, opacity: e(t, oa + 0.8, oa + 1.2) }}>{text}</div>
        {who && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: w * 0.035, color: "#5a4a36", marginTop: 14, opacity: e(t, oa + 1.2, oa + 1.5) }}>— {who}</div>}
      </div>
      {/* cuerpo del sobre (adelante) */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #f0c85e, #d6a73c 60%, #b8892a)", borderRadius: 8, clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)" }}>
        <div style={{ position: "absolute", left: 40, bottom: 34, fontFamily: SERIF_GRAB, fontWeight: 700, fontSize: w * 0.032, color: "#6a4a12", letterSpacing: 3 }}>FUNERALES NAVARRO · ANALCO</div>
      </div>
      {/* la solapa: se aplasta en Y (sin preserve-3d) y pasa atrás */}
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h * 0.55, transformOrigin: "50% 0", transform: `scaleY(${1 - 2 * fk})`, zIndex: fk > 0.5 ? -1 : 1,
        background: fk > 0.5 ? "#c9982e" : "linear-gradient(180deg, #e8bd52, #d4a238)", clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
    </div>
  );
};

// ---------- LISTA DE PRECIOS (General Price List): renglones uno por uno y el que importa se ilumina ----------
export const Lista: React.FC<{ t: number; at: number; out: number; title: string; sub?: string; rows: { tx: string; v?: string }[]; hi: number; hiAt: number; x?: number; y?: number; w?: number }> = ({ t, at, out, title, sub, rows, hi, hiAt, x = 1300, y = 540, w = 820 }) => {
  const rh = 60, h = 190 + rows.length * rh + 30;
  const hk = ei(t, hiAt, hiAt + 0.5);
  return (
    <Slab t={t} at={at} out={out} x={x} y={y} w={w} h={h} rx={8} ry={10}>
      <div style={{ position: "absolute", left: 50, top: 34 }}><Kicker tx={sub ?? "por escrito · cada cosa por separado"} /></div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 70, fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: "#2a2219", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "clip" }}>{title}</div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 150, height: 3, background: "#2a2219" }} />
      {rows.map((r, i) => {
        const ry = 172 + i * rh, on = i === hi;
        return (
          <div key={i} style={{ position: "absolute", left: 30, right: 30, top: ry, height: rh - 8, borderRadius: 8, opacity: e(t, at + 0.3 + i * 0.12, at + 0.6 + i * 0.12) * (on ? 1 : 1 - 0.55 * hk),
            background: on ? `rgba(243,154,30,${0.9 * hk})` : "transparent", transform: on ? `scale(${1 + 0.04 * hk})` : undefined, boxShadow: on && hk > 0 ? `0 ${10 * hk}px ${24 * hk}px rgba(0,0,0,.3)` : undefined }}>
            <div style={{ position: "absolute", left: 20, top: 9, fontFamily: FONT, fontWeight: on ? 900 : 700, fontSize: 30, color: on && hk > 0.5 ? "#1c120a" : "#2a2219" }}>{r.tx}</div>
            {r.v && <div style={{ position: "absolute", right: 20, top: 8, fontFamily: FONT, fontWeight: 900, fontSize: 31, color: "#2a2219" }}>{r.v}</div>}
          </div>
        );
      })}
    </Slab>
  );
};
