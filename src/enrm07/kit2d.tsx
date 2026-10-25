// piezas 2D del resto (min 2 al final). Mismo lenguaje que el minuto 1: fichas con volumen, tipografía extruida,
// entradas con resorte. Cada una maneja su entrada (at) y su salida (out). Sin desenfoque en ninguna.
import React from "react";
import { Img, staticFile } from "remotion";
import { COL, FONT, P, e, ei, extrude, spr } from "./lib";

export const pop = (t: number, at: number, out: number, sp = 1) => ({ k: Math.min(1.1, spr(t, at, sp)), o: e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3)) });
const K = (k: number) => Math.min(1, k);
export const card: React.CSSProperties = { background: "linear-gradient(180deg, rgba(250,248,242,.97), rgba(226,222,212,.97))", boxShadow: "0 40px 80px rgba(0,0,0,.55), inset 0 -4px 0 rgba(0,0,0,.08)", borderRadius: 24, fontFamily: FONT };
export const dark: React.CSSProperties = { background: "linear-gradient(180deg, rgba(22,30,44,.96), rgba(10,15,24,.96))", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.15)", borderRadius: 24, fontFamily: FONT };
export const Big: React.FC<{ s: number; c?: string; edge?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ s, c = COL.ink, edge = "#2a2014", children, style }) => <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: s, color: c, textShadow: extrude(Math.round(s / 14), edge), lineHeight: 1, whiteSpace: "nowrap", ...style }}>{children}</div>;

// reloj circular que se llena (minutos, segundos)
export const MaxTimer: React.FC<{ t: number; at: number; out: number; x: number; y: number; label: string; sub?: string; col?: string; fill?: number }> = ({ t, at, out, x, y, label, sub, col = "#ff9f43", fill = 1.3 }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const f = ei(t, at + 0.15, at + fill), R = 120, C = 2 * Math.PI * R, beat = f >= 1 ? 1 + 0.04 * Math.sin(t * 9) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${(0.6 + 0.4 * K(k)) * beat})`, display: "flex", alignItems: "center", gap: 30 }}>
      <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ filter: "drop-shadow(0 25px 40px rgba(0,0,0,.6))" }}>
        <circle r={140} fill="rgba(12,18,28,.9)" /><circle r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={22} />
        <circle r={R} fill="none" stroke={col} strokeWidth={22} strokeDasharray={`${C * f} ${C}`} transform="rotate(-90)" strokeLinecap="round" />
        <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={label.length > 3 ? 50 : 64} fill="#fff">{label}</text>
      </svg>
      {sub && <Big s={64} c={col} edge="#3a2006">{sub}</Big>}
    </div>
  );
};

// la bandeja: cada cosa entra con su frase y queda en fila; las prohibidas se tachan
export const KitTray: React.FC<{ t: number; items: { at: number; ic: string; tx: string; no?: boolean }[]; out: number; y?: number }> = ({ t, items, out, y = 760 }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: y, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 18, perspective: 1200 }}>
    {items.map((it, i) => { const { k, o } = pop(t, it.at, out); if (o < 0.01) return null;
      const st = it.no ? e(t, it.at + 0.35, it.at + 0.6) : 0;
      return <div key={i} style={{ ...(it.no ? dark : card), opacity: o, position: "relative", padding: "12px 22px", display: "flex", alignItems: "center", gap: 14, transform: `translateY(${(1 - K(k)) * 160}px) rotateX(${(1 - K(k)) * 60}deg)`, borderRadius: 18 }}>
        <span style={{ fontSize: 50 }}>{it.ic}</span><span style={{ fontWeight: 900, fontSize: 36, color: it.no ? COL.ink : "#1d2733" }}>{it.tx}</span>
        {st > 0 && <div style={{ position: "absolute", left: 10, right: 10, top: "50%", height: 10, borderRadius: 5, background: COL.red, transformOrigin: "0 50%", transform: `scaleX(${st}) rotate(-4deg)`, boxShadow: "0 0 14px rgba(255,60,40,.8)" }} />}
      </div>; })}
  </div>
);

// placa de PASO / sección que entra girando
export const StepPlate: React.FC<{ t: number; at: number; out: number; n: string; tx: string; x?: number; y?: number; c1?: [string, string]; ink?: string }> = ({ t, at, out, n, tx, x = 960, y = 200, c1 = ["#ffe28a", "#f2b632"], ink = "#3a2400" }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400, transform: "translate(-50%,-50%)" }}>
      <div style={{ display: "flex", alignItems: "stretch", transform: `rotateY(${(1 - K(k)) * 100 - 6 + 3 * Math.sin(t)}deg)`, borderRadius: 22, overflow: "hidden", boxShadow: "0 50px 90px rgba(0,0,0,.65)" }}>
        <div style={{ background: `linear-gradient(180deg,${c1[0]},${c1[1]})`, padding: "16px 34px", fontFamily: FONT, fontWeight: 900, fontSize: 84, color: ink, whiteSpace: "nowrap" }}>{n}</div>
        <div style={{ background: "linear-gradient(180deg,#1d2a3d,#0e1622)", padding: "16px 40px", fontFamily: FONT, fontWeight: 900, fontSize: Math.min(72, 72 * 26 / Math.max(1, tx.length)), color: COL.ink, letterSpacing: 3, display: "flex", alignItems: "center", whiteSpace: "nowrap", textShadow: extrude(6, "#000") }}>{tx}</div>
      </div>
    </div>
  );
};

// ficha de ERROR / ADVERTENCIA n de N que cae desde arriba
export const ErrorCard: React.FC<{ t: number; at: number; out: number; n: number; of: number; tx: string; head?: string; x?: number; y?: number; col?: [string, string] }> = ({ t, at, out, n, of, tx, head = "ERROR", x = 960, y = 170, col = ["#ff5a4a", "#a3170e"] }) => {
  const { k, o } = pop(t, at, out, 0.9); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - K(k)) * -260}px) rotate(${(1 - K(k)) * -14 - 2}deg)`, display: "flex", alignItems: "center", borderRadius: 22, overflow: "hidden", boxShadow: "0 50px 90px rgba(0,0,0,.65)", fontFamily: FONT }}>
      <div style={{ background: `linear-gradient(180deg,${col[0]},${col[1]})`, padding: "14px 30px", color: "#fff", fontWeight: 900, fontSize: head.length > 6 ? 30 : 40, letterSpacing: 4, textAlign: "center" }}>{head}<div style={{ fontSize: 96, lineHeight: 1 }}>{n}<span style={{ fontSize: 40, opacity: 0.7 }}>/{of}</span></div></div>
      <div style={{ background: "linear-gradient(180deg,#fbf8f1,#dcd6c8)", padding: "30px 44px", fontWeight: 900, fontSize: 72, color: "#1d2733", whiteSpace: "nowrap" }}>{tx}</div>
    </div>
  );
};

// cadena de cajas con flechas que se arma con la voz (el camino del aire, el orden de las cosas)
export const Flow: React.FC<{ t: number; items: { at: number; ic: string; tx: string; sub?: string; col?: string }[]; out: number; y?: number; sc?: number; dot?: boolean }> = ({ t, items, out, y = 800, sc = 1, dot = true }) => {
  const o = e(t, items[0].at - 0.1, items[0].at + 0.1) * (1 - e(t, out, out + 0.3)); if (o < 0.01) return null;
  const last = items.filter((it) => t >= it.at).length;
  const run = ((t * 0.55) % 1) * Math.max(1, last - 1);
  return (
    <div style={{ position: "absolute", left: 960, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc})`, display: "flex", alignItems: "center", gap: 0, perspective: 1300 }}>
      {items.map((it, i) => { const k = K(spr(t, it.at, 1)); return (
        <React.Fragment key={i}>
          {i > 0 && <div style={{ width: 90, height: 12, margin: "0 8px", borderRadius: 6, position: "relative", background: `linear-gradient(90deg, rgba(255,255,255,.25), ${it.col ?? COL.ice})`, opacity: k, transform: `scaleX(${k})`, transformOrigin: "0 50%" }}>
            <div style={{ position: "absolute", right: -14, top: -11, width: 0, height: 0, borderLeft: `24px solid ${it.col ?? COL.ice}`, borderTop: "17px solid transparent", borderBottom: "17px solid transparent" }} />
            {dot && last > i && Math.floor(run) === i - 1 && <div style={{ position: "absolute", top: -6, left: `${(run % 1) * 100}%`, width: 24, height: 24, borderRadius: 12, background: "#fff", boxShadow: "0 0 16px #fff" }} />}
          </div>}
          <div style={{ ...dark, opacity: k, padding: "18px 26px", minWidth: 220, textAlign: "center", transform: `translateY(${(1 - k) * 120}px) rotateX(${(1 - k) * 50}deg)`, boxShadow: `0 0 0 3px ${it.col ?? "rgba(255,255,255,.2)"}, 0 40px 80px rgba(0,0,0,.6)` }}>
            <div style={{ fontSize: 64 }}>{it.ic}</div>
            <div style={{ fontWeight: 900, fontSize: 38, color: it.col ?? COL.ink, whiteSpace: "nowrap" }}>{it.tx}</div>
            {it.sub && <div style={{ fontWeight: 700, fontSize: 26, color: COL.dim, whiteSpace: "nowrap" }}>{it.sub}</div>}
          </div>
        </React.Fragment>); })}
    </div>
  );
};

// dos columnas que se enfrentan: SÍ ✓ contra NO ✗ (cada renglón con su frase)
export const VsCard: React.FC<{ t: number; at: number; out: number; l: { h: string; rows: { at: number; tx: string }[] }; r: { h: string; rows: { at: number; tx: string }[] }; x?: number; y?: number; sc?: number }> = ({ t, at, out, l, r, x = 960, y = 560, sc = 1 }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  const col = (side: typeof l, ok: boolean, ry: number) => (
    <div style={{ ...(ok ? card : dark), width: 640, padding: "24px 30px", transform: `rotateY(${ry * (1 - K(k)) * 4 + ry}deg)` }}>
      <div style={{ fontWeight: 900, fontSize: 52, color: ok ? "#1d8a4c" : COL.red, marginBottom: 10 }}>{ok ? "✓" : "✗"} {side.h}</div>
      {side.rows.map((rw, i) => { const kk = K(spr(t, rw.at)); return <div key={i} style={{ fontWeight: 800, fontSize: 36, color: ok ? "#1d2733" : COL.ink, padding: "8px 0", opacity: kk, transform: `translateX(${(1 - kk) * (ok ? -80 : 80)}px)`, whiteSpace: "nowrap" }}>{rw.tx}</div>; })}
    </div>);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1600, transform: `translate(-50%,-50%) scale(${sc * (0.7 + 0.3 * K(k))})`, display: "flex", gap: 40 }}>
      {col(l, true, 8)}{col(r, false, -8)}
    </div>
  );
};

// EL REPASO: la libreta se arma renglón por renglón y cada uno se tilda
export const Recap: React.FC<{ t: number; rows: { at: number; tx: string; no?: boolean }[]; out: number; title: string }> = ({ t, rows, out, title }) => {
  const o = e(t, rows[0].at - 0.2, rows[0].at) * (1 - e(t, out, out + 0.3)); if (o < 0.01) return null;
  return (
    <div style={{ ...card, position: "absolute", left: 40, top: 100, width: 900, height: 880, padding: "26px 30px", opacity: o, overflow: "hidden", transform: "perspective(1400px) rotateY(8deg)", background: "repeating-linear-gradient(180deg, #fbf8ef 0 57px, #c9d6e6 57px 58px)" }}>
      <div style={{ fontWeight: 900, fontSize: 38, color: "#8a5a1e", letterSpacing: 4, marginBottom: 14 }}>{title}</div>
      {rows.map((r, i) => { const w = e(t, r.at, r.at + 0.35), ck = e(t, r.at + 0.35, r.at + 0.55); return (
        <div key={i} style={{ height: 58, display: "flex", alignItems: "center", gap: 14, clipPath: `inset(0 ${100 - 100 * w}% 0 0)` }}>
          <span style={{ fontSize: 40, color: r.no ? COL.red : "#1d8a4c", fontWeight: 900, transform: `scale(${ck})`, width: 44 }}>{r.no ? "✗" : "✓"}</span>
          <span style={{ fontWeight: 800, fontSize: 27, color: "#1f3557", whiteSpace: "nowrap" }}>{r.tx}</span>
        </div>); })}
    </div>
  );
};

// el comentario que se escribe solo
export const Comment: React.FC<{ t: number; at: number; typeAt: number; out: number; text: string; x: number; y: number }> = ({ t, at, typeAt, out, text, x, y }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const n = Math.round(e(t, typeAt, typeAt + 1.4) * text.length), sent = e(t, typeAt + 1.7, typeAt + 2.0);
  return (
    <div style={{ ...dark, position: "absolute", left: x, top: y, opacity: o, width: 980, padding: "24px 30px", transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * K(k)})`, display: "flex", gap: 22, alignItems: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: 40, background: "linear-gradient(135deg,#6fb4ff,#2f6db3)", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ color: COL.dim, fontWeight: 800, fontSize: 26 }}>Add a comment…</div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: Math.min(46, 1500 / Math.max(1, text.length)), borderBottom: "3px solid rgba(255,255,255,.4)", paddingBottom: 6, minHeight: 60, whiteSpace: "nowrap" }}>{text.slice(0, n)}<span style={{ opacity: Math.sin(t * 8) > 0 && n < text.length ? 1 : 0 }}>|</span></div>
      </div>
      <div style={{ padding: "12px 24px", borderRadius: 30, background: sent > 0.5 ? "#7dff9e" : "#3a7bd5", color: sent > 0.5 ? "#0a3a1a" : "#fff", fontWeight: 900, fontSize: 32, transform: `scale(${1 + 0.15 * Math.sin(sent * Math.PI)})` }}>{sent > 0.5 ? "✓" : "COMMENT"}</div>
    </div>
  );
};

// el avatar dentro de una medalla de borde nítido (sin halo ni desenfoque)
export const AvBadge: React.FC<{ t: number; at: number; out: number; x: number; y: number; label?: string; children: React.ReactNode }> = ({ t, at, out, x, y, label = "CLAUDIO", children }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * K(k)})` }}>
      <div style={{ width: 500, height: 500, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 12px #f2b632, 0 50px 100px rgba(0,0,0,.7)", position: "relative" }}>{children}</div>
      <div style={{ position: "absolute", left: "50%", bottom: -30, transform: "translateX(-50%)", padding: "8px 30px", borderRadius: 12, background: "linear-gradient(180deg,#ffe28a,#f2b632)", fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#3a2400", whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

// LA GUÍA: el manual entra cerrado, la tapa se abre y la cámara se acerca a la página REAL; un marco resalta la ficha
export const Libro: React.FC<{ t: number; at: number; openAt: number; out: number; page: number; hl?: { at: number; x: number; y: number; w: number; h: number }; x?: number; y?: number }> = ({ t, at, openAt, out, page, hl, x = 960, y = 545 }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  const op = ei(t, openAt, openAt + 0.9), W = 470, H = 610;
  const zm = hl ? ei(t, hl.at, hl.at + 0.8) : 0, hk = hl ? e(t, hl.at + 0.5, hl.at + 0.9) : 0;
  const sc = (0.55 + 0.45 * K(k)) * (1 + 0.55 * zm);
  const fx = hl ? (hl.x + hl.w / 2 - 0.5) * W * 0.9 * zm : 0, fy = hl ? (hl.y + hl.h / 2 - 0.5) * H * 0.9 * zm : 0;
  const pg = String(page).padStart(3, "0");
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 2000, transform: `translate(-50%,-50%)` }}>
      <div style={{ position: "relative", width: W * 2, height: H, transformStyle: "preserve-3d", transform: `translate(${-fx * 1.1 + (1 - op) * (W / 2)}px, ${-fy * 1.1}px) scale(${sc}) rotateX(${(1 - K(k)) * 40 + 12 * (1 - zm)}deg) rotateZ(${(1 - op) * -6}deg)` }}>
        {/* página derecha: la ficha real */}
        <div style={{ position: "absolute", left: W, top: 0, width: W, height: H, background: "#fbf9f3", boxShadow: "0 40px 90px rgba(0,0,0,.65)", overflow: "hidden", borderRadius: "0 8px 8px 0" }}>
          <Img src={staticFile(P + `p${pg}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {hl && hk > 0 && <div style={{ position: "absolute", left: `${hl.x * 100}%`, top: `${hl.y * 100}%`, width: `${hl.w * 100}%`, height: `${hl.h * 100}%`, border: `6px solid rgba(255,190,20,${hk})`, borderRadius: 12, background: `rgba(255,214,10,${0.12 * hk})`, boxShadow: `0 0 30px rgba(255,190,20,${0.6 * hk})` }} />}
        </div>
        {/* página izquierda (el reverso de la tapa) */}
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: "linear-gradient(90deg,#efe9dc,#fbf9f3 85%,#d8d0bf)", opacity: op, borderRadius: "8px 0 0 8px", boxShadow: "0 40px 90px rgba(0,0,0,.5)" }} />
        {/* la tapa: gira sobre el lomo */}
        <div style={{ position: "absolute", left: W, top: 0, width: W, height: H, transformOrigin: "0 50%", transform: `rotateY(${-178 * op}deg)`, backfaceVisibility: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.6)", borderRadius: "0 8px 8px 0", overflow: "hidden" }}>
          <Img src={staticFile(P + "p001.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: W * 0.55, top: -H * 0.62, opacity: e(t, openAt + 0.6, openAt + 0.9) * (1 - zm * 0.6) }}>
        <Big s={92} c="#ffd60a" edge="#5a4500">PAGE {page}</Big>
      </div>
    </div>
  );
};

// "link en la 1ª línea de la descripción" — sin URL en pantalla (sólo el nombre del manual)
export const Desc: React.FC<{ t: number; at: number; out: number; name?: string }> = ({ t, at, out, name = "THE $2 MECHANIC" }) => {
  const k = spr(t, at, 0.8), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const hl = e(t, at + 0.4, at + 0.9), sweep = e(t, at + 0.4, at + 1.4);
  const L = (w: number, op = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${op})`, margin: "18px 0 0" }} />;
  return (
    <div style={{ position: "absolute", left: 960, top: 600, perspective: 1500, opacity: o }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${14 - 8 * Math.min(1, k)}deg) rotateY(${-6 + 3 * Math.sin(t * 0.8)}deg)`, width: 1180, padding: "34px 44px 40px", borderRadius: 26,
        background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.12)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPTION</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,214,10,${0.18 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,214,10,${0.9 * hl}), 0 0 40px rgba(255,214,10,${0.35 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: 44, lineHeight: 1.3 }}>🔧 {name} <span style={{ color: "#ffd60a" }}>· LINE 1</span></div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(980)}{L(1040)}{L(760)}{L(900, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -560, top: -260, opacity: hl, transform: `translateY(${-20 * (1 - hl)}px)` }}>
        <Big s={54} c="#ffd60a" edge="#5a4500">LINK IN THE FIRST LINE OF THE DESCRIPTION ↓</Big>
      </div>
    </div>
  );
};

// suscribirse + campanita: el botón rojo se aprieta y pasa a gris, la campana se sacude
export const Subscribe: React.FC<{ t: number; at: number; clickAt: number; out: number; x?: number; y?: number }> = ({ t, at, clickAt, out, x = 960, y = 860 }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const c = e(t, clickAt, clickAt + 0.15), press = Math.sin(Math.min(1, Math.max(0, (t - clickAt) / 0.3)) * Math.PI), bell = t > clickAt + 0.4 ? Math.sin((t - clickAt) * 22) * 18 * Math.max(0, 1 - (t - clickAt - 0.4) / 1.2) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * K(k)})`, display: "flex", alignItems: "center", gap: 26, fontFamily: FONT }}>
      <div style={{ ...dark, display: "flex", alignItems: "center", gap: 20, padding: "16px 26px 16px 18px", borderRadius: 60 }}>
        <div style={{ width: 84, height: 84, borderRadius: 42, background: "linear-gradient(135deg,#ffb257,#c2541b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46 }}>🔧</div>
        <div style={{ whiteSpace: "nowrap" }}><div style={{ color: "#fff", fontWeight: 900, fontSize: 40 }}>Ramón the Mechanic</div><div style={{ color: COL.dim, fontWeight: 700, fontSize: 24 }}>one shop fix every week</div></div>
      </div>
      <div style={{ padding: "22px 40px", borderRadius: 40, background: c > 0.5 ? "#3a3f47" : "#e62117", color: "#fff", fontWeight: 900, fontSize: 40, letterSpacing: 2, transform: `scale(${1 - 0.1 * press})`, boxShadow: "0 25px 50px rgba(0,0,0,.6)" }}>{c > 0.5 ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
      <div style={{ fontSize: 76, transform: `rotate(${bell}deg)`, transformOrigin: "50% 10%", opacity: e(t, clickAt + 0.2, clickAt + 0.4) }}>🔔</div>
    </div>
  );
};

// lista con íconos que se arma con la voz (lo que se borra, lo que hay que tener a mano…)
export const Rows: React.FC<{ t: number; title: string; rows: { at: number; ic: string; tx: string; sub?: string; no?: boolean }[]; out: number; x?: number; y?: number; sc?: number; hl?: number }> = ({ t, title, rows, out, x = 1440, y = 540, sc = 1, hl = -1 }) => {
  const o = e(t, rows[0].at - 0.25, rows[0].at) * (1 - e(t, out, out + 0.3)); if (o < 0.01) return null;
  return (
    <div style={{ ...dark, position: "absolute", left: x, top: y, padding: "26px 30px", width: 760, opacity: o, transform: `translate(-50%,-50%) scale(${sc}) perspective(1400px) rotateY(-10deg)` }}>
      <div style={{ fontWeight: 800, fontSize: 30, color: COL.dim, letterSpacing: 6, marginBottom: 12 }}>{title}</div>
      {rows.map((r, i) => { const k = K(spr(t, r.at)), on = i === hl; if (t < r.at - 0.3) return null; return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 14px", borderRadius: 14, marginTop: 8, opacity: k, transform: `translateX(${(1 - k) * 120}px) scale(${on ? 1.04 : 1})`, background: on ? "linear-gradient(90deg, rgba(255,214,10,.28), rgba(255,214,10,.05))" : "rgba(255,255,255,.04)", boxShadow: on ? "0 0 0 3px rgba(255,214,10,.8)" : undefined }}>
          <span style={{ fontSize: 50, width: 64, textAlign: "center" }}>{r.ic}</span>
          <div><div style={{ fontWeight: 900, fontSize: 40, color: r.no ? COL.red : on ? "#ffd60a" : COL.ink, textDecoration: r.no ? "line-through" : undefined }}>{r.tx}</div>{r.sub && <div style={{ fontWeight: 700, fontSize: 28, color: COL.dim }}>{r.sub}</div>}</div>
        </div>); })}
    </div>
  );
};

// tarjeta del próximo video (sin URL): portada de una toma + título + "LA SEMANA QUE VIENE"
export const NextCard: React.FC<{ t: number; at: number; out: number; img: string; title: string; x?: number; y?: number }> = ({ t, at, out, img, title, x = 1340, y = 520 }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  return (
    <div style={{ ...dark, position: "absolute", left: x, top: y, opacity: o, width: 800, padding: 18, transform: `translate(-50%,-50%) perspective(1400px) rotateY(${(1 - K(k)) * 70 - 10}deg) rotateX(4deg)` }}>
      <div style={{ position: "relative", height: 430, borderRadius: 16, overflow: "hidden" }}>
        <Img src={staticFile(P + img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", right: 14, bottom: 14, padding: "6px 14px", borderRadius: 8, background: "rgba(0,0,0,.78)", color: "#ffd60a", fontWeight: 900, fontSize: 28 }}>LA SEMANA QUE VIENE</div>
      </div>
      <div style={{ color: COL.ink, fontWeight: 900, fontSize: 44, marginTop: 16 }}>{title}</div>
    </div>
  );
};
