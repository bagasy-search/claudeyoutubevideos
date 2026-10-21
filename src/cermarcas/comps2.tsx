// cermarcas · componentes NUEVOS del resto del video (110-858 s), uno o varios por minuto, mismo lenguaje que el minuto 1:
// tarjetas oscuras con canto, texto extruido, resortes, nada de dibujitos de línea finos.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COL, FONT, P, e, ei, extrude, spr } from "./lib";
import { Avatar } from "./Min1";

const pop = (t: number, at: number, out: number, k = 1) => ({ k: Math.min(1.12, spr(t, at, k)), o: e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3)) });
const CARD: React.CSSProperties = { background: "linear-gradient(180deg, rgba(26,28,33,.95), rgba(13,14,17,.96))", borderRadius: 26, boxShadow: "0 50px 110px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT };
const H = (size: number, col: string, ex = "rgba(0,0,0,.55)"): React.CSSProperties => ({ fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 2, textShadow: extrude(5, ex), whiteSpace: "nowrap" });

// avatar a la izquierda (mitad, borde NÍTIDO, sin máscara) y el mundo a la derecha
export const SplitAv: React.FC<{ t: number; a: number; b: number; children: React.ReactNode; w?: number }> = ({ t, a, b, children, w = 960 }) => {
  const k = ei(t, a, a + 0.4) * (1 - ei(t, b - 0.35, b));
  const ww = 1920 - (1920 - w) * k;
  return (
    <AbsoluteFill>
      <AbsoluteFill>{children}</AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: ww, height: 1080, overflow: "hidden", boxShadow: "12px 0 0 rgba(255,214,10,.9), 30px 0 60px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", left: (ww - 1920) / 2, top: 0, width: 1920, height: 1080 }}><Avatar t={t} /></div>
      </div>
    </AbsoluteFill>
  );
};

// «¿QUÉ HACES?»: la llave inglesa entra y la pregunta se apoya arriba a la izquierda
export const QueHaces: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; text?: string }> = ({ t, at, out, x = 90, y = 90, text = "¿QUÉ HACES?" }) => {
  const { k, o } = pop(t, at, out, 1.2);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateX(${(1 - Math.min(1, k)) * -260}px)`, display: "flex", alignItems: "center", gap: 18, padding: "14px 30px 14px 18px", borderRadius: 999, background: "#ffd60a", boxShadow: "0 18px 40px rgba(0,0,0,.55), 0 8px 0 #8a6d00" }}>
      <div style={{ width: 62, height: 62, borderRadius: 31, background: "#16130a", display: "grid", placeItems: "center", fontSize: 38, transform: `rotate(${(1 - Math.min(1, k)) * -200}deg)` }}>🔧</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#16130a", letterSpacing: 2 }}>{text}</div>
    </div>
  );
};

// lista de pasos numerados; cada uno entra con resorte y se tilda
export const Steps: React.FC<{ t: number; items: { at: number; tx: string; bad?: boolean }[]; x: number; y: number; out: number; size?: number; w?: number }> = ({ t, items, x, y, out, size = 46, w = 760 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    {items.map((it, i) => {
      const { k, o } = pop(t, it.at, out);
      if (o <= 0.01) return null;
      const c = e(t, it.at + 0.25, it.at + 0.55);
      return (
        <div key={i} style={{ ...CARD, opacity: o, marginBottom: 18, padding: "18px 26px", display: "flex", alignItems: "center", gap: 22, transform: `translateX(${(1 - Math.min(1, k)) * 200}px) scale(${0.8 + 0.2 * Math.min(1, k)})`, transformOrigin: "0 50%" }}>
          <div style={{ width: 64, height: 64, flex: "0 0 64px", borderRadius: 18, background: it.bad ? COL.red : "#2fbf71", display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff", boxShadow: "0 6px 0 rgba(0,0,0,.35)" }}>
            <span style={{ transform: `scale(${c})` }}>{it.bad ? "✕" : "✓"}</span></div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, color: COL.ink, letterSpacing: 1 }}><span style={{ color: "#ffd60a", marginRight: 14 }}>{i + 1}</span>{it.tx}</div>
        </div>
      );
    })}
  </div>
);

// celular apaisado sacando la foto: el visor con la toma adentro, el obturador y la miniatura que vuela a la galería
export const PhoneCam: React.FC<{ t: number; at: number; snap: number; out: number; children: React.ReactNode; label?: string }> = ({ t, at, snap, out, children, label = "FOTO ANTES DE TOCAR" }) => {
  const { k, o } = pop(t, at, out, 0.8);
  if (o <= 0.01) return null;
  const fl = t >= snap ? 1 - e(t, snap, snap + 0.35) : 0, th = e(t, snap + 0.1, snap + 0.7);
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 1800, opacity: o }}>
      <div style={{ position: "absolute", left: 260, top: 150, width: 1400, height: 760, borderRadius: 70, padding: 26, background: "linear-gradient(160deg,#30333a,#0b0c0e)", boxShadow: "0 80px 140px rgba(0,0,0,.75), inset 0 0 0 4px #4b4f57",
        transform: `translateZ(${(1 - Math.min(1, k)) * -900}px) rotateX(${6 - 6 * Math.min(1, k)}deg) rotateY(${-8 + 3 * Math.sin(t * 0.6)}deg)` }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 48, overflow: "hidden", background: "#000" }}>
          {children}
          <svg width={1348} height={708} style={{ position: "absolute", inset: 0 }}>
            {[[1, 1], [2, 1], [1, 2], [2, 2]].map(([a, b], i) => <g key={i} stroke="rgba(255,255,255,.35)" strokeWidth={2}><line x1={1348 * a / 3} y1={0} x2={1348 * a / 3} y2={708} /><line x1={0} y1={708 * b / 3} x2={1348} y2={708 * b / 3} /></g>)}
            <rect x={560} y={240} width={230} height={230} fill="none" stroke="#ffd60a" strokeWidth={4} opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 4))} />
          </svg>
          <div style={{ position: "absolute", right: 34, top: "50%", transform: "translateY(-50%)", width: 110, height: 110, borderRadius: 55, border: "8px solid #fff", background: t >= snap && t < snap + 0.2 ? "#ddd" : "rgba(255,255,255,.9)" }} />
          <div style={{ position: "absolute", left: 30, top: 26, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#ffd60a", letterSpacing: 4, textShadow: "0 2px 8px #000" }}>📷 {label}</div>
          {fl > 0.01 && <AbsoluteFill style={{ background: "#fff", opacity: fl }} />}
          {th > 0.01 && <div style={{ position: "absolute", right: 30 + 0 * th, bottom: 30, width: 260 - 110 * th, height: (260 - 110 * th) * 0.56, borderRadius: 12, overflow: "hidden", border: "4px solid #fff", opacity: th, transform: `translate(${(1 - th) * -500}px, ${(1 - th) * -200}px)` }}>{children}</div>}
        </div>
      </div>
    </div>
  );
};

// la regla de alturas: dónde miras tú (1,60 m) y dónde está el plástico (0,50 m)
export const AlturaRegla: React.FC<{ t: number; at: number; at2: number; out: number; x?: number }> = ({ t, at, at2, out, x = 1380 }) => {
  const { k, o } = pop(t, at, out, 0.8);
  if (o <= 0.01) return null;
  const top = 160, bot = 960, Y = (m: number) => bot - (bot - top) * m / 2.0;
  const a2 = e(t, at2, at2 + 0.4);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, transform: `translateX(${(1 - Math.min(1, k)) * 300}px)` }}>
      <div style={{ ...CARD, position: "absolute", left: x - 40, top: top - 60, width: 480, height: bot - top + 120 }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={x + 40} y1={top} x2={x + 40} y2={bot} stroke="#e8e0cc" strokeWidth={8} />
        {Array.from({ length: 21 }, (_, i) => <line key={i} x1={x + 40} y1={Y(i * 0.1)} x2={x + 40 + (i % 5 === 0 ? 46 : 22)} y2={Y(i * 0.1)} stroke="#e8e0cc" strokeWidth={i % 5 === 0 ? 5 : 3} />)}
        <line x1={x + 40} y1={Y(1.6)} x2={x + 300} y2={Y(1.6)} stroke={COL.ice} strokeWidth={6} strokeDasharray="14 10" />
        <line x1={x + 40} y1={Y(0.5)} x2={x + 40 + 260 * a2} y2={Y(0.5)} stroke={COL.red} strokeWidth={8} />
      </svg>
      <div style={{ position: "absolute", left: x + 110, top: Y(1.6) - 70, ...H(40, COL.ice) }}>👁 TU MIRADA</div>
      <div style={{ position: "absolute", left: x + 110, top: Y(1.6) + 8, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: COL.dim }}>1,60 m</div>
      <div style={{ position: "absolute", left: x + 110, top: Y(0.5) - 74, opacity: a2, ...H(40, COL.red) }}>EL PLÁSTICO</div>
      <div style={{ position: "absolute", left: x + 110, top: Y(0.5) + 10, opacity: a2, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: COL.dim }}>0,50 m · NO LO VES</div>
    </div>
  );
};

// veredicto doble: lo inocente ✕ contra la mano ✓
export const Veredicto: React.FC<{ t: number; a: number; b: number; out: number; l: string; ls: string; r: string; rs: string; y?: number }> = ({ t, a, b, out, l, ls, r, rs, y = 640 }) => {
  const A = pop(t, a, out), B = pop(t, b, out);
  const card = (q: { k: number; o: number }, x: number, title: string, sub: string, ok: boolean, rot: number) => q.o > 0.01 && (
    <div style={{ ...CARD, position: "absolute", left: x, top: y, width: 520, padding: "26px 30px", opacity: q.o, transform: `translateY(${(1 - Math.min(1, q.k)) * 300}px) rotate(${rot}deg)`, border: `5px solid ${ok ? "#2fbf71" : COL.red}` }}>
      <div style={{ ...H(56, ok ? "#7dff9e" : COL.red) }}>{ok ? "✓" : "✕"} {title}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: COL.ink, marginTop: 8 }}>{sub}</div>
    </div>);
  return <>{card(A, 1000, l, ls, false, -3)}{card(B, 1360, r, rs, true, 2)}</>;
};

// la semana del vecino: L a D, cada día "abre y cierra"
export const Semana: React.FC<{ t: number; a: number; b: number; out: number; y?: number }> = ({ t, a, b, out, y = 760 }) => {
  const D = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 960, top: y, transform: "translateX(-50%)", display: "flex", gap: 16, opacity: o }}>
      {D.map((d, i) => {
        const at = a + (b - a) * i / 6, k = Math.min(1.1, spr(t, at, 1.1)), c = e(t, at + 0.15, at + 0.35);
        return (
          <div key={d} style={{ ...CARD, width: 190, height: 190, borderRadius: 22, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `translateY(${(1 - Math.min(1, k)) * 120}px)`, opacity: Math.min(1, k * 1.5), border: `4px solid rgba(47,191,113,${c})` }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: COL.dim, letterSpacing: 3 }}>{d}</div>
            <div style={{ fontSize: 70, transform: `scale(${c})` }}>🚪</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: "#7dff9e", opacity: c }}>ABRE Y CIERRA</div>
          </div>);
      })}
    </div>
  );
};

// LA CUADRA vista desde arriba (vector): casas, marcas que aparecen y alguien que recorre las puertas
type CMk = { at: number; h: number; icon: string; col?: string; out?: number };
export const Cuadra: React.FC<{ t: number; a: number; out: number; marks: CMk[]; walk?: { a: number; b: number; hs: number[]; icon?: string }; you?: number; title?: string; titleAt?: number; night?: boolean; old?: number[] }> = ({ t, a, out, marks, walk, you = 2, title, titleAt = 1e9, night, old = [] }) => {
  const k = ei(t, a, a + 0.6), o = e(t, a, a + 0.25) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const pos = (h: number) => ({ x: 260 + (h % 6) * 280, y: h < 6 ? 330 : 750, up: h < 6 });
  let wp: { x: number; y: number } | null = null;
  if (walk && t >= walk.a && t <= walk.b + 0.5) {
    const n = walk.hs.length - 1, q = Math.min(1, (t - walk.a) / (walk.b - walk.a)) * n, i = Math.min(n - 1, Math.floor(q)), f = ei(q - i, 0, 1);
    const A = pos(walk.hs[i]), B = pos(walk.hs[Math.min(n, i + 1)]);
    wp = { x: A.x + (B.x - A.x) * f, y: (A.up ? 470 : 610) + ((B.up ? 470 : 610) - (A.up ? 470 : 610)) * f };
  }
  return (
    <AbsoluteFill style={{ opacity: o, background: night ? "#070b14" : "#1b2a1f" }}>
      <div style={{ position: "absolute", inset: 0, transform: `perspective(1600px) rotateX(${(1 - k) * 35 + 18}deg) scale(${0.9 + 0.1 * k})`, transformOrigin: "50% 60%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 480, height: 120, background: "#2a2c30" }} />
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 170, top: 536, width: 90, height: 8, background: "#c9b979", opacity: 0.8 }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, height: 40, background: "#8a8478" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 600, height: 40, background: "#8a8478" }} />
        {Array.from({ length: 12 }, (_, h) => {
          const p = pos(h), mine = h === you;
          return (
            <div key={h} style={{ position: "absolute", left: p.x - 100, top: p.up ? 200 : 660, width: 200, height: 180, borderRadius: 14,
              background: mine ? "#e9d9b8" : night ? "#2b3140" : "#cfc6b4", boxShadow: mine ? "0 0 0 6px #ffd60a, 0 20px 40px rgba(0,0,0,.5)" : "0 16px 30px rgba(0,0,0,.45)" }}>
              <div style={{ position: "absolute", left: 80, [p.up ? "bottom" : "top"]: -6, width: 40, height: 16, borderRadius: 4, background: "#6a3a2a" } as React.CSSProperties} />
              {old.includes(h) && <div style={{ position: "absolute", left: 14, top: 14, fontSize: 44 }}>👵</div>}
              {mine && <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#3a2a10" }}>TU CASA</div>}
            </div>);
        })}
        {marks.map((m, i) => {
          const p = pos(m.h), q = Math.min(1.15, spr(t, m.at, 1.2)), mo = e(t, m.at, m.at + 0.1) * (1 - e(t, m.out ?? 1e9, (m.out ?? 1e9) + 0.3));
          if (mo <= 0.01) return null;
          return <div key={i} style={{ position: "absolute", left: p.x - 46, top: (p.up ? 350 : 640) - 46, width: 92, height: 92, borderRadius: 46, background: m.col ?? COL.red, display: "grid", placeItems: "center", fontSize: 52, opacity: mo, transform: `scale(${q})`, boxShadow: `0 0 0 ${10 * (1 - e(t, m.at, m.at + 0.8))}px ${m.col ?? COL.red}55, 0 10px 24px rgba(0,0,0,.5)` }}>{m.icon}</div>;
        })}
        {wp && <div style={{ position: "absolute", left: wp.x - 40, top: wp.y - 40, width: 80, height: 80, borderRadius: 40, background: "#111", border: "5px solid #ff8a3d", display: "grid", placeItems: "center", fontSize: 46, boxShadow: "0 0 30px rgba(255,138,61,.7)" }}>{walk?.icon ?? "🕵️"}</div>}
      </div>
      {title && <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", opacity: e(t, titleAt, titleAt + 0.2), transform: `scale(${0.7 + 0.3 * Math.min(1, spr(t, titleAt))})` }}><span style={H(76, "#fff3d6", "#3a1a00")}>{title}</span></div>}
    </AbsoluteFill>
  );
};

// llamada a la policía (número que NO es de emergencias) con lo que hay que contar
export const Llamada: React.FC<{ t: number; at: number; out: number; items: { at: number; tx: string }[]; x?: number; y?: number }> = ({ t, at, out, items, x = 1180, y = 120 }) => {
  const { k, o } = pop(t, at, out, 0.8);
  if (o <= 0.01) return null;
  const sec = Math.max(0, Math.floor(t - at));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 560, height: 860, borderRadius: 60, padding: 18, background: "linear-gradient(160deg,#30333a,#0b0c0e)", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 0 0 4px #4b4f57", opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 500}px) rotate(${3 - 3 * Math.min(1, k)}deg)` }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 44, background: "linear-gradient(180deg,#123a5c,#0a1626)", padding: "60px 34px", boxSizing: "border-box", fontFamily: FONT, textAlign: "center" }}>
        <div style={{ width: 120, height: 120, margin: "0 auto", borderRadius: 60, background: "#2b6cb0", display: "grid", placeItems: "center", fontSize: 64, boxShadow: `0 0 0 ${8 + 8 * Math.abs(Math.sin(t * 3))}px rgba(43,108,176,.35)` }}>👮</div>
        <div style={{ fontWeight: 900, fontSize: 40, color: "#fff", marginTop: 22 }}>POLICÍA</div>
        <div style={{ fontWeight: 800, fontSize: 26, color: "#8fd6ff", letterSpacing: 2 }}>NÚMERO QUE NO ES DE EMERGENCIAS</div>
        <div style={{ fontWeight: 700, fontSize: 30, color: COL.dim, marginTop: 8, fontFamily: "monospace" }}>00:{String(sec).padStart(2, "0")}</div>
        <div style={{ marginTop: 36, textAlign: "left" }}>
          {items.map((it, i) => { const q = pop(t, it.at, out); return q.o > 0.01 && (
            <div key={i} style={{ opacity: q.o, transform: `translateX(${(1 - Math.min(1, q.k)) * 120}px)`, padding: "16px 20px", marginBottom: 14, borderRadius: 18, background: "rgba(255,255,255,.1)", fontWeight: 900, fontSize: 36, color: "#fff" }}>✓ {it.tx}</div>); })}
        </div>
      </div>
    </div>
  );
};

// la tabla "de internet" con 40 símbolos (se dibuja como captura viral) → resaltados → sello INVENTADAS
const SYM = ["○", "✕", "△", "□", "◇", "⊕", "⊗", "∧", "∨", "≡", "⌒", "✓", "◎", "▽", "⊥", "⊤", "∥", "※", "⌂", "☐", "◐", "◑", "☓", "⊙", "∩", "∪", "≈", "⋈", "⊿", "◁", "▷", "♢", "✱", "⟂", "⊘", "⊚", "⊛", "⊝", "⌗", "∞"];
export const TablaFalsa: React.FC<{ t: number; at: number; out: number; hl: { at: number; i: number; tx: string }[]; stamp: number; x?: number; y?: number; sc?: number }> = ({ t, at, out, hl, stamp, x = 960, y = 540, sc = 1 }) => {
  const { k, o } = pop(t, at, out, 0.7);
  if (o <= 0.01) return null;
  const cur = [...hl].reverse().find((h) => t >= h.at);
  const st = Math.min(1.1, spr(t, stamp, 1.3)), so = e(t, stamp, stamp + 0.06);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc * (0.7 + 0.3 * Math.min(1, k))}) rotate(-2deg)` }}>
      <div style={{ width: 900, padding: 30, borderRadius: 10, background: "#f4efe2", boxShadow: "0 50px 100px rgba(0,0,0,.7)", fontFamily: FONT }}>
        <div style={{ fontWeight: 900, fontSize: 40, color: "#1a1a1a", textAlign: "center", letterSpacing: 2 }}>⚠ SÍMBOLOS DE LOS LADRONES ⚠</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10, marginTop: 20 }}>
          {SYM.map((s, i) => { const q = e(t, at + 0.2 + i * 0.03, at + 0.35 + i * 0.03), on = cur && cur.i === i;
            return <div key={i} style={{ height: 82, borderRadius: 8, border: `3px solid ${on ? COL.red : "#bbb3a0"}`, background: on ? "#ffe2dc" : "#fff", display: "grid", placeItems: "center", fontSize: 48, color: on ? COL.red : "#333", opacity: q, transform: `scale(${on ? 1.18 : q})` }}>{s}</div>; })}
        </div>
        <div style={{ height: 70, marginTop: 18, textAlign: "center", fontWeight: 900, fontSize: 48, color: COL.red }}>{cur ? cur.tx : ""}</div>
      </div>
      {so > 0.01 && <div style={{ position: "absolute", left: "50%", top: "48%", opacity: so, transform: `translate(-50%,-50%) rotate(-12deg) scale(${2.4 - 1.4 * Math.min(1, st)})`, border: `12px solid ${COL.red}`, borderRadius: 16, padding: "6px 34px", fontFamily: FONT, fontWeight: 900, fontSize: 120, color: COL.red, background: "rgba(255,240,235,.85)", whiteSpace: "nowrap" }}>INVENTADAS</div>}
    </div>
  );
};

// dos columnas: la marca de SERVICIO contra la que PREOCUPA (las filas entran con la voz)
export const Versus: React.FC<{ t: number; out: number; L: { at: number; title: string; rows: { at: number; tx: string }[] }; R: { at: number; title: string; rows: { at: number; tx: string }[] }; x?: number; y?: number; sc?: number }> = ({ t, out, L, R, x = 960, y = 560, sc = 1 }) => {
  const col = (c: typeof L, ok: boolean) => { const q = pop(t, c.at, out, 0.9); return q.o > 0.01 && (
    <div style={{ ...CARD, width: 660, minHeight: 640, padding: "30px 34px", opacity: q.o, transform: `translateY(${(1 - Math.min(1, q.k)) * 260}px)`, borderTop: `14px solid ${ok ? "#5f9ec0" : COL.red}` }}>
      <div style={{ ...H(60, ok ? COL.ice : COL.red) }}>{c.title}</div>
      {c.rows.map((r, i) => { const z = pop(t, r.at, out); return z.o > 0.01 && <div key={i} style={{ opacity: z.o, transform: `translateX(${(1 - Math.min(1, z.k)) * 100}px)`, marginTop: 22, padding: "16px 20px", borderRadius: 16, background: "rgba(255,255,255,.08)", fontFamily: FONT, fontWeight: 900, fontSize: 38, color: COL.ink }}>{ok ? "▸" : "⚠"} {r.tx}</div>; })}
    </div>); };
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${sc})`, display: "flex", gap: 60, alignItems: "flex-start" }}>{col(L, true)}{col(R, false)}</div>;
};

// contador de días grande (DÍA 1 → N) con la hoja que se da vuelta
export const Dias: React.FC<{ t: number; a: number; b: number; n: number; out: number; x?: number; y?: number; label?: string }> = ({ t, a, b, n, out, x = 1560, y = 300, label = "SIGUE AHÍ" }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const q = Math.min(n, 1 + Math.floor(Math.max(0, t - a) / ((b - a) / Math.max(1, n - 1))));
  const flip = ((t - a) / ((b - a) / Math.max(1, n - 1))) % 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: o, perspective: 900 }}>
      <div style={{ ...CARD, width: 300, height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderTop: "40px solid #c0392b", transform: `rotateX(${q < n && flip > 0.85 ? (flip - 0.85) * 400 : 0}deg)` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: COL.dim, letterSpacing: 4 }}>DÍA</div>
        <div style={{ ...H(170, COL.ink) }}>{q}</div>
      </div>
      {t >= b && <div style={{ textAlign: "center", marginTop: 20, ...H(46, COL.amber) }}>{label}</div>}
    </div>
  );
};

// la libreta del barrio: renglones vacíos → «NADA»
export const Libreta: React.FC<{ t: number; at: number; out: number; rows: { at: number; tx: string; col?: string }[]; title: string; x?: number; y?: number; w?: number }> = ({ t, at, out, rows, title, x = 1180, y = 170, w = 640 }) => {
  const { k, o } = pop(t, at, out, 0.8);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: o, transform: `rotate(${3 - 2 * Math.min(1, k)}deg) translateY(${(1 - Math.min(1, k)) * 400}px)`, background: "repeating-linear-gradient(180deg,#fbf6e6 0 62px,#9fc3e0 62px 64px)", borderRadius: 10, padding: "40px 40px 50px 90px", boxShadow: "0 50px 100px rgba(0,0,0,.7)", borderLeft: "6px solid #e07a7a" }}>
      <div style={{ fontFamily: "'Comic Sans MS', 'Segoe Print', cursive", fontWeight: 700, fontSize: 40, color: "#1d3557", height: 64 }}>{title}</div>
      {rows.map((r, i) => { const q = e(t, r.at, r.at + 0.5); return (
        <div key={i} style={{ height: 64, fontFamily: "'Comic Sans MS', 'Segoe Print', cursive", fontWeight: 700, fontSize: 40, color: r.col ?? "#1d3557", clipPath: `inset(0 ${(1 - q) * 100}% 0 0)`, whiteSpace: "nowrap" }}>{r.tx}</div>); })}
    </div>
  );
};

// el grupo de vecinos en el celular: mensajes que entran (o se tachan)
export type Msg = { at: number; from: string; tx: string; me?: boolean; x?: number; img?: string };
export const Chat: React.FC<{ t: number; at: number; out: number; msgs: Msg[]; x?: number; y?: number; title?: string; members?: number }> = ({ t, at, out, msgs, x = 1220, y = 90, title = "Vecinos de la cuadra 🏠", members = 4 }) => {
  const { k, o } = pop(t, at, out, 0.8);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 560, height: 900, borderRadius: 60, padding: 18, background: "linear-gradient(160deg,#30333a,#0b0c0e)", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 0 0 4px #4b4f57", opacity: o, transform: `perspective(1600px) translateZ(${(1 - Math.min(1, k)) * -700}px) rotateY(${-12 + 4 * Math.min(1, k)}deg)` }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 44, overflow: "hidden", background: "#0e1621", fontFamily: FONT, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "30px 26px 18px", background: "#17212b" }}>
          <div style={{ fontWeight: 900, fontSize: 32, color: "#fff" }}>{title}</div>
          <div style={{ fontWeight: 700, fontSize: 22, color: "#7fa7c9" }}>{members} miembros</div>
        </div>
        <div style={{ flex: 1, padding: "18px 18px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 14 }}>
          {msgs.filter((m) => t >= m.at).slice(-5).map((m, i) => { const q = pop(t, m.at, 1e9, 1.2), xx = m.x !== undefined ? e(t, m.x, m.x + 0.3) : 0;
            return (
              <div key={m.at + "" + i} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "86%", position: "relative", padding: "14px 18px", borderRadius: 20, background: m.me ? "#2b5278" : "#182533", transform: `scale(${0.7 + 0.3 * Math.min(1, q.k)})`, transformOrigin: m.me ? "100% 100%" : "0 100%", opacity: 1 - 0.5 * xx }}>
                {!m.me && <div style={{ fontWeight: 900, fontSize: 22, color: "#f6a35b" }}>{m.from}</div>}
                {m.img && <div style={{ width: 380, height: 210, borderRadius: 12, overflow: "hidden", marginTop: 6 }}><Img src={staticFile(P + m.img + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(10px)" }} /></div>}
                <div style={{ fontWeight: 700, fontSize: 30, color: "#fff", lineHeight: 1.25 }}>{m.tx}</div>
                <div style={{ textAlign: "right", fontSize: 18, color: "#7fa7c9" }}>11:0{i} ✓✓</div>
                {xx > 0.01 && <svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1={4} y1={8} x2={4 + 92 * xx} y2={92} stroke={COL.red} strokeWidth={6} vectorEffect="non-scaling-stroke" /><line x1={96} y1={8} x2={96 - 92 * xx} y2={92} stroke={COL.red} strokeWidth={6} vectorEffect="non-scaling-stroke" /></svg>}
              </div>);
          })}
        </div>
      </div>
    </div>
  );
};

// la balanza honesta: lo que cuesta una puerta forzada contra la guía
export const Balanza: React.FC<{ t: number; at: number; lAt: number; rAt: number; tip: number; out: number }> = ({ t, at, lAt, rAt, tip, out }) => {
  const { k, o } = pop(t, at, out, 0.8);
  if (o <= 0.01) return null;
  const ang = -10 * e(t, tip, tip + 1.0) + 2 * Math.sin(t * 2) * (1 - e(t, tip, tip + 1));
  const lo = e(t, lAt, lAt + 0.3), ro = e(t, rAt, rAt + 0.3);
  const cnt = Math.round(150 + 150 * e(t, lAt + 0.4, lAt + 1.6));
  const plate = (side: number, child: React.ReactNode, op: number) => (
    <div style={{ position: "absolute", left: 960 + side * 430 - 260, top: 470 - side * Math.sin(ang * Math.PI / 180) * 430, width: 520, opacity: o }}>
      <div style={{ height: 120, display: "flex", alignItems: "flex-end", justifyContent: "center", opacity: op, transform: `translateY(${(1 - op) * -200}px)` }}>{child}</div>
      <div style={{ height: 22, borderRadius: 11, background: "linear-gradient(180deg,#e9c46a,#9a7a2a)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    </div>);
  return (
    <AbsoluteFill style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 200}px)` }}>
      <div style={{ position: "absolute", left: 950, top: 470, width: 20, height: 420, background: "linear-gradient(90deg,#9a7a2a,#e9c46a,#9a7a2a)" }} />
      <div style={{ position: "absolute", left: 860, top: 870, width: 200, height: 40, borderRadius: 10, background: "#9a7a2a" }} />
      <div style={{ position: "absolute", left: 530, top: 460, width: 860, height: 16, borderRadius: 8, background: "#e9c46a", transform: `rotate(${-ang}deg)` }} />
      {plate(-1, <div style={{ ...CARD, padding: "20px 26px", textAlign: "center" }}><div style={{ fontWeight: 900, fontSize: 30, color: COL.dim }}>🚪 PUERTA FORZADA + MARCO + MANO DE OBRA</div><div style={H(84, COL.red)}>150-{cnt} US$</div></div>, lo)}
      {plate(1, <div style={{ ...CARD, padding: "20px 26px", textAlign: "center" }}><div style={{ fontWeight: 900, fontSize: 30, color: COL.dim }}>📚 LA GUÍA · 5 LIBROS</div><div style={H(70, "#7dff9e")}>BASTANTE MENOS</div></div>, ro)}
    </AbsoluteFill>
  );
};

// etiqueta de evidencia (lo que se guarda en la bolsita para la policía)
export const Evidencia: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 1260, y = 560 }) => {
  const { k, o } = pop(t, at, out, 1);
  if (o <= 0.01) return null;
  const ln = (l: string, v: string, a: number) => <div style={{ display: "flex", gap: 14, fontFamily: "monospace", fontWeight: 700, fontSize: 32, color: "#1a1a1a", marginTop: 10, clipPath: `inset(0 ${(1 - e(t, a, a + 0.5)) * 100}% 0 0)` }}><b>{l}</b><span>{v}</span></div>;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 520, padding: "26px 32px", background: "#f4e7b8", borderRadius: 8, boxShadow: "0 40px 80px rgba(0,0,0,.65)", opacity: o, transform: `rotate(${-6 + 2 * Math.min(1, k)}deg) translateY(${(1 - Math.min(1, k)) * 300}px)` }}>
      <div style={{ position: "absolute", left: 22, top: 22, width: 30, height: 30, borderRadius: 15, background: "#1a1a1a33" }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: COL.red, textAlign: "center", letterSpacing: 4 }}>EVIDENCIA</div>
      {ln("QUÉ:", "precinto en el portón", at + 0.3)}{ln("FECHA:", "martes", at + 0.6)}{ln("HORA:", "8:15 de la mañana", at + 0.9)}{ln("FOTO:", "sí ✓", at + 1.2)}
    </div>
  );
};

// lupa que recorre la toma y la agranda (los rayones del cilindro)
export const Lupa: React.FC<{ t: number; a: number; out: number; path: [number, number][]; dur: number; children: React.ReactNode; r?: number; z?: number }> = ({ t, a, out, path, dur, children, r = 210, z = 2.2 }) => {
  const o = e(t, a, a + 0.3) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const n = path.length - 1, q = Math.min(1, Math.max(0, (t - a) / dur)) * n, i = Math.min(n - 1, Math.floor(q)), f = ei(q - i, 0, 1);
  const x = path[i][0] + (path[i + 1][0] - path[i][0]) * f, y = path[i][1] + (path[i + 1][1] - path[i][1]) * f;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `circle(${r}px at ${x}px ${y}px)` }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: `${x}px ${y}px` }}>{children}</div>
      </div>
      <div style={{ position: "absolute", left: x - r - 14, top: y - r - 14, width: 2 * r + 28, height: 2 * r + 28, borderRadius: "50%", border: "14px solid #2a2b2e", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 0 0 3px rgba(255,255,255,.3)" }} />
      <div style={{ position: "absolute", left: x + r * 0.62, top: y + r * 0.62, width: 60, height: 230, borderRadius: 20, background: "linear-gradient(90deg,#3a2a1c,#6b4a33)", transform: "rotate(-45deg)", transformOrigin: "50% 0" }} />
    </div>
  );
};

// el portón de garaje (vector) que sube y el palito que se cae
export const Garaje: React.FC<{ t: number; a: number; up: number; out: number; x?: number; y?: number }> = ({ t, a, up, out, x = 1300, y = 540 }) => {
  const { k, o } = pop(t, a, out, 0.8);
  if (o <= 0.01) return null;
  const u = ei(t, up, up + 1.2), fall = e(t, up + 0.25, up + 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * Math.min(1, k)})`, opacity: o }}>
      <div style={{ ...CARD, width: 620, height: 560, padding: 30, boxSizing: "border-box" }}>
        <div style={{ position: "relative", width: 560, height: 420, background: "#0d0f12", borderRadius: 8, overflow: "hidden", border: "10px solid #8a8478" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 420 * (1 - u), background: "repeating-linear-gradient(180deg,#b9bcc2 0 46px,#8d9097 46px 52px)" }} />
          <div style={{ position: "absolute", left: 300, bottom: 0, width: 12, height: 150, background: "#c58b4a", borderRadius: 4, transformOrigin: "50% 100%", transform: `rotate(${-8 - 80 * fall}deg)`, boxShadow: fall < 0.05 ? "0 0 22px #ffd60a" : undefined }} />
        </div>
        <div style={{ textAlign: "center", marginTop: 16, ...H(40, fall > 0.5 ? COL.red : COL.amber) }}>{fall > 0.5 ? "SE CAYÓ: ALGUIEN ABRIÓ" : "EL PALITO"}</div>
      </div>
    </div>
  );
};

// la lista de "lo que la casa dice sola" que se va llenando
export const CasaDice: React.FC<{ t: number; items: { at: number; tx: string; ic: string }[]; out: number; x?: number; y?: number; sc?: number }> = ({ t, items, out, x = 1180, y = 110, sc = 1 }) => {
  const o = e(t, items[0].at - 0.3, items[0].at) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ ...CARD, position: "absolute", left: x, top: y, width: 640, padding: "28px 30px 14px", opacity: o, transform: `scale(${sc})`, transformOrigin: "0 0" }}>
      <div style={{ ...H(42, COL.amber) }}>LO QUE TU CASA DICE SOLA</div>
      {items.map((it, i) => { const q = pop(t, it.at, out, 1.1); return q.o > 0.01 && (
        <div key={i} style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 14, opacity: q.o, transform: `translateX(${(1 - Math.min(1, q.k)) * 120}px)` }}>
          <div style={{ width: 66, height: 66, borderRadius: 16, background: "rgba(255,74,61,.2)", border: `3px solid ${COL.red}`, display: "grid", placeItems: "center", fontSize: 38 }}>{it.ic}</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: COL.ink }}>{it.tx}</div>
        </div>); })}
    </div>
  );
};

// la publicación en redes (foto + texto que se tipea + corazones + ubicación)
export const Post: React.FC<{ t: number; at: number; out: number; img: string; cap: string; ta: number; tb: number; loc?: string; locAt?: number; x?: number; y?: number; w?: number; who?: string }> = ({ t, at, out, img, cap, ta, tb, loc, locAt = 1e9, x = 560, y = 60, w = 800, who = "abuela.marta" }) => {
  const { k, o } = pop(t, at, out, 0.8);
  if (o <= 0.01) return null;
  const n = Math.round(cap.length * e(t, ta, tb)), likes = Math.round(140 * e(t, at + 0.5, out));
  const lh = e(t, locAt, locAt + 0.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, borderRadius: 28, overflow: "hidden", background: "#fff", boxShadow: "0 70px 130px rgba(0,0,0,.7)", opacity: o, transform: `perspective(1600px) translateZ(${(1 - Math.min(1, k)) * -800}px) rotateX(${8 - 8 * Math.min(1, k)}deg)`, fontFamily: FONT }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "18px 22px" }}>
        <div style={{ width: 60, height: 60, borderRadius: 30, background: "linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)" }} />
        <div><div style={{ fontWeight: 900, fontSize: 28, color: "#111" }}>{who}</div>
          {loc && <div style={{ fontWeight: 800, fontSize: 24, color: lh > 0.5 ? "#fff" : "#555", background: `rgba(255,74,61,${lh})`, padding: "2px 10px", borderRadius: 8, display: "inline-block" }}>📍 {loc}</div>}</div>
      </div>
      <div style={{ width: w, height: w * 0.56, overflow: "hidden" }}><Img src={staticFile(P + img + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.05 * e(t, at, out)})` }} /></div>
      <div style={{ padding: "16px 22px 22px" }}>
        <div style={{ fontWeight: 900, fontSize: 28, color: "#111" }}>❤️ {likes} Me gusta</div>
        <div style={{ fontWeight: 700, fontSize: 32, color: "#111", marginTop: 6, minHeight: 44 }}>{cap.slice(0, n)}<span style={{ opacity: n < cap.length && Math.sin(t * 12) > 0 ? 1 : 0 }}>|</span></div>
      </div>
    </div>
  );
};

// el temporizador de enchufe: el dial gira, prende al atardecer y apaga a las 11
export const Timer: React.FC<{ t: number; at: number; on: number; off: number; out: number; x?: number; y?: number; sc?: number }> = ({ t, at, on, off, out, x = 1460, y = 470, sc = 1 }) => {
  const { k, o } = pop(t, at, out, 0.9);
  if (o <= 0.01) return null;
  const rot = -((t - at) * 40);
  const lit = t >= on && t < off + 0.8 ? 1 : 0.15;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${sc * (0.7 + 0.3 * Math.min(1, k))})`, opacity: o, textAlign: "center" }}>
      <div style={{ position: "relative", width: 420, height: 420, borderRadius: 210, background: "radial-gradient(circle,#fafafa,#d8d8d8)", boxShadow: `0 40px 80px rgba(0,0,0,.6), 0 0 ${80 * lit}px rgba(255,200,110,${0.8 * lit})` }}>
        {Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * 360 + rot, act = i >= 18 && i < 23; return <div key={i} style={{ position: "absolute", left: 200, top: 10, width: 20, height: 52, borderRadius: 6, background: act ? "#e67e22" : "#bbb", transformOrigin: "10px 200px", transform: `rotate(${a}deg)` }} />; })}
        <div style={{ position: "absolute", left: 110, top: 110, width: 200, height: 200, borderRadius: 100, background: "#fff", display: "grid", placeItems: "center", fontSize: 90 }}>{lit > 0.5 ? "💡" : "🔌"}</div>
      </div>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 20 }}>
        <div style={{ opacity: e(t, on, on + 0.3), ...H(40, "#ffd08a") }}>PRENDE 18:00</div>
        <div style={{ opacity: e(t, off, off + 0.3), ...H(40, COL.ice) }}>APAGA 23:00</div>
      </div>
    </div>
  );
};

// la caja de regalo que se abre: "una más"
export const Regalo: React.FC<{ t: number; at: number; open: number; out: number; x?: number; y?: number; text: string }> = ({ t, at, open, out, x = 1440, y = 560, text }) => {
  const { k, o } = pop(t, at, out, 1);
  if (o <= 0.01) return null;
  const op = ei(t, open, open + 0.5);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)}) rotate(${Math.sin(t * 9) * 3 * (1 - op)}deg)`, opacity: o, textAlign: "center" }}>
      <div style={{ position: "relative", width: 360, height: 300 }}>
        <div style={{ position: "absolute", left: 20, top: 100, width: 320, height: 200, background: "#c0392b", borderRadius: 12, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
        <div style={{ position: "absolute", left: 160, top: 100, width: 40, height: 200, background: "#ffd60a" }} />
        <div style={{ position: "absolute", left: 0, top: 50, width: 360, height: 70, background: "#e74c3c", borderRadius: 12, transformOrigin: "0 100%", transform: `translateY(${-op * 120}px) rotate(${-op * 35}deg)` }}><div style={{ position: "absolute", left: 160, top: 0, width: 40, height: 70, background: "#ffd60a" }} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120 - op * 170, opacity: op, ...H(56, "#fff3d6", "#3a1a00") }}>{text}</div>
      </div>
    </div>
  );
};

// globos de diálogo (en la puerta)
export const Globos: React.FC<{ t: number; items: { at: number; tx: string; side: "l" | "r"; y: number; x?: number }[]; out: number }> = ({ t, items, out }) => (
  <>{items.map((g, i) => { const q = pop(t, g.at, out, 1.2); return q.o > 0.01 && (
    <div key={i} style={{ position: "absolute", left: g.x ?? (g.side === "l" ? 140 : 1000), top: g.y, opacity: q.o, transform: `scale(${0.5 + 0.5 * Math.min(1, q.k)})`, transformOrigin: g.side === "l" ? "0 100%" : "100% 100%", maxWidth: 760, padding: "26px 36px", borderRadius: 40, borderBottomLeftRadius: g.side === "l" ? 6 : 40, borderBottomRightRadius: g.side === "r" ? 6 : 40,
      background: g.side === "l" ? "#fff" : "#ffd60a", boxShadow: "0 30px 60px rgba(0,0,0,.55)", fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#141414" }}>{g.tx}</div>); })}</>
);

// la frase: la que NO se dice (tachada) y la que sí
export const Frase: React.FC<{ t: number; at: number; xAt: number; good: string; goodAt: number; bad: string; out: number; x?: number; y?: number }> = ({ t, at, xAt, good, goodAt, bad, out, x = 1300, y = 540 }) => {
  const A = pop(t, at, out), G = pop(t, goodAt, out), xx = e(t, xAt, xAt + 0.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", gap: 30, alignItems: "center" }}>
      {A.o > 0.01 && <div style={{ ...CARD, position: "relative", padding: "24px 40px", opacity: A.o * (1 - 0.35 * xx), transform: `scale(${0.7 + 0.3 * Math.min(1, A.k)})` }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: COL.dim, letterSpacing: 4 }}>NUNCA DIGAS</div>
        <div style={H(70, COL.red)}>«{bad}»</div>
        <div style={{ position: "absolute", left: 20, right: 20, top: "58%", height: 12, borderRadius: 6, background: COL.red, transform: `scaleX(${xx})`, transformOrigin: "0 50%" }} /></div>}
      {G.o > 0.01 && <div style={{ ...CARD, padding: "24px 40px", opacity: G.o, transform: `scale(${0.7 + 0.3 * Math.min(1, G.k)})`, border: "5px solid #2fbf71" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: COL.dim, letterSpacing: 4 }}>DI</div>
        <div style={H(62, "#7dff9e")}>«{good}»</div></div>}
    </div>
  );
};

// las 7 (y la de regalo) en una tira: se encienden juntas
export const Recap: React.FC<{ t: number; at: number; out: number; y?: number }> = ({ t, at, out, y = 860 }) => {
  const it = ["🧾 PLÁSTICO", "🩹 CINTA", "✏️ TIZA", "📄 VOLANTE", "🔗 PRECINTO", "🪙 MONEDA", "📰 LA TUYA", "🔔 TIMBRE"];
  return (
    <div style={{ position: "absolute", left: 960, top: y, transform: "translateX(-50%)", display: "flex", gap: 12 }}>
      {it.map((s, i) => { const q = pop(t, at + i * 0.12, out, 1.2); return q.o > 0.01 && (
        <div key={i} style={{ ...CARD, borderRadius: 18, padding: "14px 16px", opacity: q.o, transform: `translateY(${(1 - Math.min(1, q.k)) * 140}px)`, fontWeight: 900, fontSize: 26, color: i === 7 ? "#ffd60a" : COL.ink, border: i === 7 ? "3px solid #ffd60a" : "3px solid rgba(255,255,255,.12)", whiteSpace: "nowrap" }}>{s}</div>); })}
    </div>
  );
};

// el tablero de los 5 pasos: las 5 tarjetas a la izquierda, la activa se adelanta
export const Pasos5: React.FC<{ t: number; at: number; out: number; items: { at: number; tx: string }[]; x?: number; y?: number }> = ({ t, at, out, items, x = 70, y = 150 }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const cur = items.reduce((c, it, i) => (t >= it.at ? i : c), -1);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      {items.map((it, i) => { const act = i === cur, done = i < cur, q = Math.min(1, spr(t, at + i * 0.1, 1));
        return (
          <div key={i} style={{ ...CARD, width: 640, marginBottom: 16, padding: "16px 22px", display: "flex", alignItems: "center", gap: 18, opacity: q * (act ? 1 : t >= it.at ? 0.75 : 0.45), transform: `translateX(${(1 - q) * -300 + (act ? 30 : 0)}px) scale(${act ? 1.06 : 1})`, transformOrigin: "0 50%", border: act ? "4px solid #ffd60a" : "4px solid transparent" }}>
            <div style={{ width: 70, height: 70, flex: "0 0 70px", borderRadius: 35, background: done ? "#2fbf71" : act ? "#ffd60a" : "#2a2d33", display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: act ? "#16130a" : "#fff" }}>{done ? "✓" : i + 1}</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: t >= it.at ? COL.ink : COL.dim }}>{t >= it.at ? it.tx : "· · ·"}</div>
          </div>);
      })}
    </div>
  );
};

// visor de foto sobre el mundo 3D (esquinas + REC + "FOTO")
export const Visor: React.FC<{ t: number; at: number; snap: number; out: number }> = ({ t, at, snap, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const c = "#ffd60a", L = 90, M = 120, fl = t >= snap ? 1 - e(t, snap, snap + 0.4) : 0;
  const cr = (x: number, y: number, sx: number, sy: number) => <path d={`M${x} ${y + sy * L} L${x} ${y} L${x + sx * L} ${y}`} fill="none" stroke={c} strokeWidth={7} />;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{cr(M, M, 1, 1)}{cr(1920 - M, M, -1, 1)}{cr(M, 1080 - M, 1, -1)}{cr(1920 - M, 1080 - M, -1, -1)}</svg>
      <div style={{ position: "absolute", left: M + 20, top: M + 10, ...H(34, c) }}>📷 CON LA PUERTA DE FONDO</div>
      {fl > 0.01 && <AbsoluteFill style={{ background: "#fff", opacity: fl }} />}
    </AbsoluteFill>
  );
};

// barras de costo: cilindro (antes) contra puerta entera (después)
export const Costos: React.FC<{ t: number; at: number; b2: number; out: number; x?: number; y?: number }> = ({ t, at, b2, out, x = 1060, y = 330 }) => {
  const { k, o } = pop(t, at, out, 0.8);
  if (o <= 0.01) return null;
  const a1 = e(t, at + 0.2, at + 0.8), a2 = e(t, b2, b2 + 1.2);
  const bar = (lab: string, sub: string, w: number, col: string) => (
    <div style={{ marginTop: 26 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: COL.ink }}>{lab} <span style={{ fontSize: 28, color: COL.dim }}>{sub}</span></div>
      <div style={{ height: 70, width: 760 * w, borderRadius: 14, background: col, marginTop: 10, boxShadow: "0 10px 0 rgba(0,0,0,.35)" }} />
    </div>);
  return (
    <div style={{ ...CARD, position: "absolute", left: x, top: y, width: 820, padding: "30px 36px 40px", opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 300}px)` }}>
      <div style={H(46, COL.amber)}>MUCHO MÁS BARATO</div>
      {bar("🔑 UN CILINDRO", "ANTES", 0.16 * a1 + 0.001, "#2fbf71")}
      {bar("🚪 UNA PUERTA ENTERA", "DESPUÉS", 0.98 * a2 + 0.001, COL.red)}
    </div>
  );
};

// los comentarios que caen (las preguntas del final)
export const Comentarios: React.FC<{ t: number; items: { at: number; who: string; tx: string }[]; out: number; x?: number; y?: number }> = ({ t, items, out, x = 1120, y = 160 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 700 }}>
    {items.map((c, i) => { const q = pop(t, c.at, out, 1); return q.o > 0.01 && (
      <div key={i} style={{ ...CARD, background: "#fff", marginBottom: 18, padding: "20px 24px", display: "flex", gap: 18, opacity: q.o, transform: `translateY(${(1 - Math.min(1, q.k)) * -200}px) rotate(${(i % 2 ? 1.5 : -1.5)}deg)` }}>
        <div style={{ width: 64, height: 64, flex: "0 0 64px", borderRadius: 32, background: ["#f6a35b", "#5f9ec0", "#58a383", "#c27a92"][i % 4] }} />
        <div><div style={{ fontWeight: 900, fontSize: 24, color: "#555" }}>@{c.who}</div><div style={{ fontWeight: 800, fontSize: 36, color: "#111" }}>{c.tx}</div></div>
      </div>); })}
  </div>
);
