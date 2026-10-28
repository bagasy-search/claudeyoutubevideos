// piezas PREMIUM (28-oct, pedido del creador: «llevalos a nivel premium, hay textos que sobrecargan»). Un solo lenguaje para todo:
// panel oscuro limpio con filo fino, tipografía plana (sin relieve), entrada = sube + se aclara el desenfoque (sin rebote), salida = se apaga.
// Una idea por pieza, pocas palabras, nada se pisa. Todo determinista y anclado a la palabra (at/out en segundos de locución).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COL, FONT, P, e, ei } from "./lib";

export const G = {
  panel: "linear-gradient(180deg, rgba(22,23,27,.9), rgba(13,14,17,.9))",
  line: "rgba(255,255,255,.10)",
  txt: "#f7f4ee",
  dim: "rgba(247,244,238,.58)",
  shadow: "0 30px 80px rgba(0,0,0,.55), 0 2px 0 rgba(255,255,255,.04) inset",
  soft: "0 6px 30px rgba(0,0,0,.55)",
};
const ACC: Record<string, string> = { amber: COL.amber, red: "#ff5a4a", ice: COL.ice, green: "#6fe39a", ink: G.txt };
export const acc = (c?: string) => (c && ACC[c]) || (c && c.startsWith("#") ? c : COL.amber);

// entrada/salida común
const vis = (t: number, at: number, out: number, fi = 0.4, fo = 0.35) => e(t, at, at + fi * 0.6) * (1 - e(t, out, out + fo));
const rise = (t: number, at: number, out: number, d = 26) => {
  const k = ei(t, at, at + 0.55), x = e(t, out, out + 0.35);
  return { opacity: vis(t, at, out), transform: `translateY(${(1 - k) * d - x * 10}px) scale(${0.97 + 0.03 * k})`, filter: k < 0.99 ? `blur(${(1 - k) * 8}px)` : undefined };
};
const Panel: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: G.panel, border: `1px solid ${G.line}`, borderRadius: 26, boxShadow: G.shadow, fontFamily: FONT, color: G.txt, ...style }}>{children}</div>
);
const Kicker: React.FC<{ txt: string; col?: string; w?: number }> = ({ txt, col = COL.amber, w = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: G.dim, textTransform: "uppercase" }}>
    <div style={{ width: 34 * w, height: 3, borderRadius: 2, background: col }} />{txt}
  </div>
);

// ---------- chip: pastilla arriba a la izquierda (punto de color + frase corta) ----------
export const Chip: React.FC<{ t: number; at: number; out: number; text: string; col?: string; x?: number; y?: number }> = ({ t, at, out, text, col, x = 96, y = 92 }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const c = acc(col);
  return <div style={{ position: "absolute", left: x, top: y, ...rise(t, at, out, 16) }}>
    <Panel style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 28px 16px 22px", borderRadius: 40, whiteSpace: "nowrap" }}>
      <div style={{ width: 14, height: 14, borderRadius: 7, background: c, boxShadow: `0 0 14px ${c}` }} />
      <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: 1.5 }}>{text}</div>
    </Panel>
  </div>;
};

// ---------- titular (reemplaza al sello torcido): frase recta + filete que se dibuja ----------
// side: sobre el avatar va abajo a la izquierda, más chico (nunca tapa la cara)
export const Headline: React.FC<{ t: number; at: number; out: number; text: string; y?: number; side?: boolean }> = ({ t, at, out, text, y = 210, side }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const warn = /\b(NO|NUNCA|SIN|NADA)\b|¡/.test(text), c = warn ? ACC.red : COL.amber;
  const w = ei(t, at + 0.25, at + 0.85);
  return <div style={{ position: "absolute", left: side ? 60 : 0, right: side ? undefined : 0, top: side ? 800 : y, display: "flex", justifyContent: "center", ...rise(t, at, out) }}>
    <div style={{ position: "relative", padding: "18px 44px 26px", fontFamily: FONT, textAlign: side ? "left" : "center", transform: side ? "scale(.7)" : undefined, transformOrigin: "0 50%" }}>
      <div style={{ position: "absolute", inset: -40, background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,0,0,.55), transparent 70%)" }} />
      <div style={{ position: "relative", fontWeight: 800, fontSize: text.length > 22 ? 66 : 80, letterSpacing: 2, color: G.txt, whiteSpace: "nowrap", textShadow: G.soft }}>{text}</div>
      <div style={{ position: "relative", margin: side ? "14px 0 0" : "14px auto 0", height: 5, borderRadius: 3, width: `${w * 100}%`, background: c, boxShadow: `0 0 18px ${c}` }} />
    </div>
  </div>;
};

// ---------- número grande: sube desde una máscara, filete de color y bajada corta ----------
export const BigNum: React.FC<{ t: number; at: number; out: number; text: string; sub?: string; col?: string; x?: number; y?: number }> = ({ t, at, out, text, sub, col, x = 1480, y = 500 }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const c = acc(col), k = ei(t, at, at + 0.6), k2 = ei(t, at + 0.3, at + 0.9);
  const size = text.length > 7 ? 150 : 200;
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: vis(t, at, out), fontFamily: FONT, textAlign: "center", whiteSpace: "nowrap" }}>
    <div style={{ position: "absolute", inset: "-60px -120px", background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,0,0,.5), transparent 72%)" }} />
    <div style={{ position: "relative", overflow: "hidden", paddingTop: 10 }}>
      <div style={{ transform: `translateY(${(1 - k) * 105}%)`, fontWeight: 800, fontSize: size, lineHeight: 1.02, color: G.txt, letterSpacing: -2, textShadow: G.soft }}>{text}</div>
    </div>
    <div style={{ position: "relative", margin: "8px auto 14px", height: 5, width: 120 * k2, borderRadius: 3, background: c, boxShadow: `0 0 16px ${c}` }} />
    {sub && <div style={{ position: "relative", opacity: k2, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: G.dim }}>{sub}</div>}
  </div>;
};

// ---------- medidor de temperatura: arco que baja de a → b, lectura grande al centro ----------
export const TempGauge: React.FC<{ t: number; at: number; out: number; a: number; b: number; sub: string; col?: string; x?: number; y?: number }> = ({ t, at, out, a, b, sub, col, x = 1440, y = 520 }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const v = a + (b - a) * ei(t, at + 0.3, at + 1.8), R = 190, SW = 22, SPAN = 270;
  const C = 2 * Math.PI * R, arc = (C * SPAN) / 360, f = Math.max(0, Math.min(1, v / 100));
  const hot = v > 60 ? "#ff6a3d" : v > 35 ? COL.amber : COL.ice, c = col === "red" && v < 60 ? COL.ice : hot;
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}><div style={rise(t, at, out)}>
    <Panel style={{ width: 520, padding: "34px 30px 30px", textAlign: "center" }}>
      <div style={{ position: "relative", width: 460, height: 400, margin: "0 auto" }}>
        <svg width={460} height={460} viewBox="-230 -230 460 460" style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${90 + (360 - SPAN) / 2}deg)` }}>
          <circle r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={SW} strokeLinecap="round" strokeDasharray={`${arc} ${C}`} />
          <circle r={R} fill="none" stroke={c} strokeWidth={SW} strokeLinecap="round" strokeDasharray={`${arc * f} ${C}`} style={{ filter: `drop-shadow(0 0 12px ${c})` }} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -4 }}>{Math.round(v)}<span style={{ fontSize: 56, color: G.dim, letterSpacing: 0 }}>°C</span></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 290, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: G.dim }}>DESDE {a} °C</div>
      </div>
      <div style={{ marginTop: -6, fontWeight: 800, fontSize: 26, lineHeight: 1.3, letterSpacing: 2, color: G.txt }}>{sub}</div>
    </Panel>
  </div></div>;
};

// ---------- comparación: dos columnas dentro de un panel, título arriba sin pisar nada ----------
type Col2 = { label: string; val: string; h: number; col: string; mark?: "ok" | "x" };
export const Versus: React.FC<{ t: number; at: number; out: number; L: Col2; R: Col2; title?: string }> = ({ t, at, out, L, R, title }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const H = 330;
  const col = (c: Col2, i: number) => {
    const a = at + 0.3 + i * 0.3, g = ei(t, a, a + 0.9), m = ei(t, a + 0.8, a + 1.1);
    return <div key={i} style={{ width: 300, textAlign: "center" }}>
      <div style={{ height: H + 96, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 70, letterSpacing: -1, marginBottom: 14, opacity: e(t, a + 0.2, a + 0.5) }}>{c.val}</div>
        <div style={{ width: 170, height: Math.max(6, H * c.h * g), borderRadius: "18px 18px 6px 6px", background: `linear-gradient(180deg, ${c.col}, ${c.col}88)`, boxShadow: `0 0 40px ${c.col}44` }} />
      </div>
      <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: G.dim }}>
        {c.mark && <div style={{ width: 40, height: 40, borderRadius: 20, background: c.mark === "ok" ? "#2fbf71" : ACC.red, color: "#fff", fontSize: 26, lineHeight: "40px", transform: `scale(${m})` }}>{c.mark === "ok" ? "✓" : "✕"}</div>}
        {c.label}
      </div>
    </div>;
  };
  return <AbsoluteFill style={{ opacity: vis(t, at, out) }}>
    <AbsoluteFill style={{ background: "rgba(0,0,0,.35)" }} />
    <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)" }}><div style={rise(t, at, out)}>
      <Panel style={{ padding: "40px 70px 44px" }}>
        {title && <Kicker txt={title} />}
        <div style={{ display: "flex", gap: 90, marginTop: 10 }}>{col(L, 0)}{col(R, 1)}</div>
      </Panel>
    </div></div>
  </AbsoluteFill>;
};

// ---------- lista que se tilda: sólo aparece lo que ya se dijo ----------
export const CheckList: React.FC<{ t: number; title: string; rows: { at: number; txt: string }[]; out: number; x?: number; y?: number }> = ({ t, title, rows, out, x = 1190, y = 170 }) => {
  const at = rows[0].at - 0.4; if (vis(t, at, out) <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, ...rise(t, at, out) }}>
    <Panel style={{ width: 640, padding: "30px 36px 20px" }}>
      <Kicker txt={title} />
      <div style={{ marginTop: 14 }}>
        {rows.filter((r) => t >= r.at - 0.05).map((r, i) => {
          const k = ei(t, r.at, r.at + 0.45), d = ei(t, r.at + 0.15, r.at + 0.5);
          return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "11px 0", borderTop: i ? `1px solid ${G.line}` : undefined, opacity: k, transform: `translateX(${(1 - k) * 20}px)` }}>
            <svg width={36} height={36} viewBox="0 0 36 36" style={{ flex: "none" }}>
              <circle cx={18} cy={18} r={16} fill="#2fbf71" opacity={0.18 + 0.82 * d} />
              <path d="M10 18.5 L16 24 L26 12.5" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={30} strokeDashoffset={30 * (1 - d)} />
            </svg>
            <div style={{ fontWeight: 800, fontSize: 32 }}>{r.txt}</div>
          </div>;
        })}
      </div>
    </Panel>
  </div>;
};

// ---------- barras de tiempo: etiqueta a la izquierda, valor a la derecha, barra fina debajo (nada se pisa) ----------
export const TimeBars: React.FC<{ t: number; rows: { at: number; label: string; val: string; frac: number; col?: string }[]; out: number; x?: number; y?: number }> = ({ t, rows, out, x = 110, y = 150 }) => {
  const at = rows[0].at - 0.3; if (vis(t, at, out) <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, ...rise(t, at, out) }}>
    <Panel style={{ width: 980, padding: "28px 40px 14px" }}>
      {rows.map((r, i) => {
        const k = ei(t, r.at, r.at + 0.4), g = ei(t, r.at + 0.1, r.at + 1.0), c = r.col ?? COL.amber;
        if (t < r.at - 0.05) return null;
        return <div key={i} style={{ padding: "12px 0 18px", opacity: k, transform: `translateX(${(1 - k) * 20}px)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 2 }}>{r.label}</div>
            <div style={{ fontWeight: 800, fontSize: 40, color: c, opacity: e(t, r.at + 0.4, r.at + 0.8) }}>{r.val}</div>
          </div>
          <div style={{ marginTop: 10, height: 12, borderRadius: 6, background: "rgba(255,255,255,.07)" }}>
            <div style={{ height: "100%", width: `${r.frac * g * 100}%`, borderRadius: 6, background: `linear-gradient(90deg, ${c}aa, ${c})`, boxShadow: `0 0 16px ${c}66` }} />
          </div>
        </div>;
      })}
    </Panel>
  </div>;
};

// ---------- reloj del día (arriba a la derecha) ----------
export const DayClock: React.FC<{ t: number; at: number; out: number; marks: [number, number][] }> = ({ t, at, out, marks }) => {
  if (vis(t, at, out) <= 0.01) return null;
  let h = marks[0][1];
  for (let i = 1; i < marks.length; i++) h += (marks[i][1] - marks[i - 1][1]) * ei(t, marks[i][0], marks[i][0] + 1.2);
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60), day = h >= 8 && h < 18.5;
  return <div style={{ position: "absolute", right: 96, top: 92, ...rise(t, at, out, 16) }}>
    <Panel style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 30px 16px 18px", borderRadius: 60 }}>
      <svg width={92} height={92} viewBox="-50 -50 100 100">
        <circle r={46} fill="#101114" stroke="rgba(255,255,255,.18)" strokeWidth={2} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-40} x2={0} y2={-34} stroke="rgba(255,255,255,.55)" strokeWidth={2.5} transform={`rotate(${i * 30})`} />)}
        <line x1={0} y1={4} x2={0} y2={-22} stroke="#fff" strokeWidth={5} strokeLinecap="round" transform={`rotate(${(h % 12) * 30})`} />
        <line x1={0} y1={6} x2={0} y2={-34} stroke={COL.amber} strokeWidth={3} strokeLinecap="round" transform={`rotate(${(h % 1) * 360})`} />
        <circle r={4} fill="#fff" />
      </svg>
      <div>
        <div style={{ fontWeight: 800, fontSize: 52, lineHeight: 1, letterSpacing: -1 }}>{String(hh).padStart(2, "0")}:{String(mm).padStart(2, "0")}</div>
        <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: 4, color: day ? COL.amber : COL.ice, marginTop: 6 }}>{day ? "DE DÍA" : "SALAMANDRA"}</div>
      </div>
    </Panel>
  </div>;
};

// ---------- error n: abajo a la izquierda, número en cuadro rojo + la frase ----------
export const Mistake: React.FC<{ t: number; at: number; n: number; txt: string; out: number }> = ({ t, at, n, txt, out }) => {
  if (vis(t, at, out) <= 0.01) return null;
  return <div style={{ position: "absolute", left: 96, bottom: 110, ...rise(t, at, out) }}>
    <Panel style={{ display: "flex", alignItems: "center", gap: 26, padding: "20px 38px 20px 20px", maxWidth: 980 }}>
      <div style={{ flex: "none", width: 96, height: 96, borderRadius: 18, background: "linear-gradient(180deg,#ff5a4a,#c62a1e)", fontWeight: 800, fontSize: 60, lineHeight: "96px", textAlign: "center", boxShadow: "0 0 30px rgba(255,90,74,.35)" }}>{n}</div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 6, color: ACC.red }}>ERROR</div>
        <div style={{ fontWeight: 800, fontSize: 42, lineHeight: 1.12, marginTop: 4 }}>{txt}</div>
      </div>
    </Panel>
  </div>;
};

// ---------- «LOS 5 ERRORES»: título limpio y cinco fichas que entran en fila ----------
export const MistakesDeal: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  if (vis(t, at, out) <= 0.01) return null;
  return <AbsoluteFill style={{ opacity: vis(t, at, out), background: "radial-gradient(ellipse at 50% 42%, #1d1212, #08080a 72%)", fontFamily: FONT, color: G.txt }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", ...rise(t, at, out) }}>
      <Kicker txt="ANTES DE QUE LA USES" col={ACC.red} />
      <div style={{ fontWeight: 800, fontSize: 130, letterSpacing: 2, marginTop: 6 }}>LOS 5 ERRORES</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 600, display: "flex", justifyContent: "center", gap: 26 }}>
      {[1, 2, 3, 4, 5].map((n, i) => {
        const a = at + 0.4 + i * 0.1, k = ei(t, a, a + 0.45);
        return <div key={n} style={{ width: 120, height: 140, borderRadius: 20, background: "linear-gradient(180deg,#ff5a4a,#b8261b)", fontWeight: 800, fontSize: 76, lineHeight: "140px", textAlign: "center", opacity: k, transform: `translateY(${(1 - k) * 40}px)`, boxShadow: "0 24px 50px rgba(0,0,0,.5)" }}>{n}</div>;
      })}
    </div>
  </AbsoluteFill>;
};

// ---------- repaso: sólo aparece lo ya dicho; el actual en ámbar, los anteriores tildados ----------
export const Recap: React.FC<{ t: number; at: number; out: number; rows: number[]; title: string; names: string[] }> = ({ t, at, out, rows, title, names }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const items = [...names, "Los 5 errores"];
  return <AbsoluteFill style={{ opacity: vis(t, at, out) }}>
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(6,7,9,.86) 0%, rgba(6,7,9,.6) 55%, rgba(6,7,9,.2) 100%)" }} />
    <div style={{ position: "absolute", left: 150, top: 150, fontFamily: FONT, color: G.txt, ...rise(t, at, out) }}>
      <Kicker txt="EN RESUMEN" />
      <div style={{ fontWeight: 800, fontSize: 64, margin: "8px 0 26px" }}>{title}</div>
      {items.map((n, i) => {
        if (rows[i] === undefined || t < rows[i] - 0.05) return null;
        const k = ei(t, rows[i], rows[i] + 0.45), cur = t < (rows[i + 1] ?? 1e9), err = i === names.length;
        const c = err ? ACC.red : COL.amber;
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 74, opacity: k * (cur ? 1 : 0.7), transform: `translateX(${(1 - k) * 24}px)` }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: cur ? c : "rgba(255,255,255,.1)", color: cur ? "#160d04" : G.txt, fontWeight: 800, fontSize: 26, lineHeight: "48px", textAlign: "center" }}>{err ? 5 : i + 1}</div>
          <div style={{ fontWeight: 800, fontSize: cur ? 44 : 38, color: cur ? G.txt : G.dim }}>{n}</div>
        </div>;
      })}
    </div>
  </AbsoluteFill>;
};

// ---------- pregunta para los comentarios ----------
export const AskCard: React.FC<{ t: number; at: number; out: number; q: [string, string, string]; side?: boolean }> = ({ t, at, out, q, side }) => {
  if (vis(t, at, out) <= 0.01) return null;
  return <div style={{ position: "absolute", left: side ? 70 : 960, top: side ? 820 : 300, transform: side ? "translateY(-50%) scale(.66)" : "translate(-50%,-50%)", transformOrigin: "0 50%" }}>
    <div style={rise(t, at, out)}>
      <Panel style={{ width: 1060, padding: "30px 44px 34px" }}>
        <Kicker txt={q[0]} />
        <div style={{ fontWeight: 800, fontSize: 54, lineHeight: 1.15, marginTop: 14 }}>{q[1]}</div>
        <div style={{ fontWeight: 600, fontSize: 36, color: COL.amber, marginTop: 8 }}>{q[2]}</div>
      </Panel>
    </div>
  </div>;
};

// ---------- PUNTO n: capítulo limpio, número grande plano y nombre; filete que se dibuja ----------
export const StepTitle: React.FC<{ t: number; at: number; n: number; name: string; out: number; col?: string; x?: number; y?: number; sc?: number }> = ({ t, at, n, name, out, col, x = 960, y = 520, sc = 1 }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const c = acc(col), k = ei(t, at, at + 0.6), k2 = ei(t, at + 0.25, at + 0.85);
  return <AbsoluteFill style={{ opacity: vis(t, at, out) }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 45% 50% at ${(x / 1920) * 100}% ${(y / 1080) * 100}%, rgba(0,0,0,.6), transparent 78%)` }} />
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${sc})`, textAlign: "center", fontFamily: FONT, color: G.txt, whiteSpace: "nowrap" }}>
      <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: 18, color: G.dim, opacity: k2, marginRight: -18 }}>PUNTO</div>
      <div style={{ overflow: "hidden" }}>
        <div style={{ transform: `translateY(${(1 - k) * 100}%)`, fontWeight: 800, fontSize: 250, lineHeight: 1.05, letterSpacing: -6, color: c, textShadow: `0 0 60px ${c}44` }}>{n}</div>
      </div>
      <div style={{ margin: "4px auto 18px", height: 4, width: 160 * k2, borderRadius: 2, background: c }} />
      <div style={{ fontWeight: 800, fontSize: 64, letterSpacing: 4, opacity: k2, transform: `translateY(${(1 - k2) * 16}px)`, textShadow: G.soft }}>{name}</div>
    </div>
  </AbsoluteFill>;
};

// ---------- palabras que entran de a una (planas, sin relieve) ----------
export const Words: React.FC<{ t: number; items: { at: number; txt: string; col?: string }[]; out: number; y?: number; size?: number }> = ({ t, items, out, y = 200, size = 92 }) => {
  if (vis(t, items[0].at - 0.05, out) <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 56, opacity: 1 - e(t, out, out + 0.35), fontFamily: FONT }}>
    {items.map((w, i) => {
      const k = ei(t, w.at, w.at + 0.5);
      return <div key={i} style={{ fontWeight: 800, fontSize: size, letterSpacing: 1, color: w.col ?? G.txt, textShadow: G.soft, opacity: k, transform: `translateY(${(1 - k) * 24}px)`, filter: k < 0.99 ? `blur(${(1 - k) * 8}px)` : undefined, whiteSpace: "nowrap" }}>{w.txt}</div>;
    })}
  </div>;
};

// ---------- CTA: la página real del manual + QR chico pegado (sin chips de más) ----------
export const GuidePage: React.FC<{ t: number; at: number; out: number; img: string; tag: string }> = ({ t, at, out, img, tag }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const k = ei(t, at, at + 0.8), z = 1 + 0.04 * e(t, at, out), q = ei(t, at + 1.0, at + 1.6);
  return <AbsoluteFill style={{ opacity: vis(t, at, out) }}>
    <AbsoluteFill style={{ background: "rgba(5,5,6,.82)" }} />
    <div style={{ position: "absolute", left: 1180, top: 545, perspective: 1800 }}>
      <div style={{ transform: `translate(-50%,-50%) translateY(${(1 - k) * 60}px) rotateY(${-10 + 4 * k}deg) rotateX(3deg) scale(${z})`, width: 660, borderRadius: 10, overflow: "hidden", boxShadow: "0 60px 120px rgba(0,0,0,.75)" }}>
        <Img src={staticFile(P + img + ".jpg")} style={{ width: "100%", display: "block" }} />
        <div style={{ position: "absolute", left: "7%", right: "6%", top: "7.6%", height: "4.8%", background: "rgba(255,200,60,.35)", borderRadius: 6, transformOrigin: "0 50%", transform: `scaleX(${e(t, at + 0.8, at + 1.4)})` }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 470, top: 545, transform: `translate(-50%,-50%) translateY(${(1 - q) * 30}px)`, opacity: q, textAlign: "center", fontFamily: FONT, color: G.txt }}>
      <Kicker txt={tag} />
      <div style={{ margin: "22px auto 0", width: 300, padding: 18, borderRadius: 22, background: "#fff", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
        <Img src={staticFile(P + "qr.png")} style={{ width: 264, height: 264, imageRendering: "pixelated", display: "block" }} />
      </div>
      <div style={{ marginTop: 18, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: G.dim }}>ESCANEA CON LA CÁMARA</div>
    </div>
  </AbsoluteFill>;
};

// ---------- la descripción del video: renglón 1 iluminado (nunca URL; sólo el nombre de la guía) ----------
export const Desc: React.FC<{ t: number; at: number; out: number; x?: number; y?: number; scale?: number }> = ({ t, at, out, x = 960, y = 640, scale = 0.8 }) => {
  if (vis(t, at, out) <= 0.01) return null;
  const hl = ei(t, at + 0.6, at + 1.1), sweep = e(t, at + 0.7, at + 1.7);
  const L = (w: number) => <div style={{ height: 14, width: w, borderRadius: 7, background: "rgba(255,255,255,.12)", marginTop: 18 }} />;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${scale})` }}>
    <div style={rise(t, at, out)}>
      <div style={{ marginBottom: 16, fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: COL.amber, opacity: hl }}>1ª LÍNEA DE LA DESCRIPCIÓN ↓</div>
      <Panel style={{ width: 1180, padding: "30px 40px 36px" }}>
        <div style={{ position: "relative", padding: "16px 22px", borderRadius: 14, background: `rgba(255,200,60,${0.14 * hl})`, boxShadow: `0 0 0 2px rgba(255,200,60,${0.85 * hl})`, overflow: "hidden" }}>
          <div style={{ fontWeight: 800, fontSize: 40 }}>🔥 El Invierno Sin Gas · mis 5 manuales, paso a paso</div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "22%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(940)}{L(1010)}{L(720)}
      </Panel>
    </div>
  </div>;
};

// ---------- CARRUSEL 3D de tarjetas 9:16 con foto (los 5 errores, el repaso): la tarjeta activa al frente, las demás giradas
// hacia atrás con reflejo en el piso; gira a la siguiente justo cuando se nombra. Entrada: las tarjetas suben del piso en abanico. ----------
export type Card = { img?: string; at: number; n: number | string; title: string };
export const CoverFlow: React.FC<{ t: number; at: number; out: number; cards: Card[]; kicker: string; title: string; col?: string; hide?: boolean }> = ({ t, at, out, cards, kicker, title, col, hide }) => {
  const o = vis(t, at, out, 0.5, 0.45);
  if (o <= 0.01 || hide) return null;
  const c = acc(col), N = cards.length;
  let act = 0; for (let i = 1; i < N; i++) act += ei(t, cards[i].at - 0.35, cards[i].at + 0.55);
  const cur = Math.round(act), arrive = ei(t, cards[cur].at - 0.35, cards[cur].at + 0.55);
  return <AbsoluteFill style={{ opacity: o, fontFamily: FONT, color: G.txt, background: `radial-gradient(ellipse 70% 60% at 50% 46%, ${c}22, #0b0b0d 62%), #0b0b0d` }}>
    {/* piso: un brillo suave bajo las tarjetas */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 220, background: "linear-gradient(180deg, rgba(255,255,255,.04), transparent)" }} />
    <div style={{ position: "absolute", left: 110, top: 86, ...rise(t, at, out) }}>
      <Kicker txt={kicker} col={c} />
      <div style={{ fontWeight: 800, fontSize: 58, marginTop: 6 }}>{title}</div>
    </div>
    <div style={{ position: "absolute", right: 110, top: 96, fontWeight: 800, fontSize: 64, letterSpacing: -1, opacity: e(t, cards[0].at - 0.3, cards[0].at) }}>
      <span style={{ color: c }}>{cur + 1}</span><span style={{ color: G.dim, fontSize: 40 }}> / {N}</span>
    </div>
    {/* haz de luz de color detrás de la tarjeta activa */}
    <div style={{ position: "absolute", left: 960 - 330, top: 170, width: 660, height: 780, background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${c}33, transparent 70%)` }} />
    <div style={{ position: "absolute", left: 960, top: 560, perspective: 1900 }}>
      <div style={{ transformStyle: "preserve-3d", transform: `rotateX(5deg) rotateY(${Math.sin((t - at) * 0.3) * 3}deg)` }}>
        {cards.map((cd, i) => {
          const d = i - act, ad = Math.abs(d), sg = Math.sign(d);
          const k = ei(t, at + 0.1 + i * 0.09, at + 0.8 + i * 0.09);
          const x = sg * (Math.min(ad, 1) * 360 + Math.max(ad - 1, 0) * 210);
          const z = -Math.min(ad, 3) * 230, ry = -Math.max(-1, Math.min(1, d)) * 50;
          const op = (ad < 3.4 ? 1 - Math.max(0, ad - 2.4) : 0) * k;
          if (op <= 0.01) return null;
          const front = Math.max(0, 1 - ad);
          return <div key={i} style={{ position: "absolute", left: -180, top: -320, width: 360, height: 640, opacity: op, zIndex: 100 - Math.round(ad * 10),
            transform: `translate3d(${x}px, ${(1 - k) * 700}px, ${z}px) rotateY(${ry}deg) rotateX(${(1 - k) * 35}deg) scale(${0.9 + 0.2 * front})`,
            WebkitBoxReflect: "below 14px linear-gradient(transparent 74%, rgba(255,255,255,.2))" } as React.CSSProperties}>
            <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 24, overflow: "hidden", background: "#16171a", boxShadow: `0 40px 90px rgba(0,0,0,.6), 0 0 0 ${2 + 2 * front}px ${front > 0.5 ? c : "rgba(255,255,255,.12)"}` }}>
              {cd.img && <Img src={staticFile("img/" + P + cd.img + ".jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 + 0.06 * front * e(t, cd.at, cd.at + 6)})` }} />}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.35) 0%, transparent 28%, transparent 46%, rgba(0,0,0,.92) 100%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "#000", opacity: Math.min(1, ad) * 0.5 }} />
              <div style={{ position: "absolute", left: 26, top: 22, fontWeight: 800, fontSize: 104, lineHeight: 1, color: c, textShadow: "0 6px 24px rgba(0,0,0,.6)" }}>{cd.n}</div>
              <div style={{ position: "absolute", left: 26, right: 24, bottom: 30, fontWeight: 800, fontSize: 31, lineHeight: 1.18, opacity: front * front, transform: `translateY(${(1 - front) * 16}px)` }}>{cd.title}</div>
              {i === cur && arrive < 1 && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-40 + 160 * arrive}%`, width: "30%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,.18), transparent)" }} />}
            </div>
          </div>;
        })}
      </div>
    </div>
  </AbsoluteFill>;
};
