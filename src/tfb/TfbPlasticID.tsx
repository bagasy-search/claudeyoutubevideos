// TfbPlasticID — el símbolo de reciclaje que se DIBUJA (tres flechas persiguiéndose) y se "lee": el número rueda como
// odómetro hasta el código, aparecen las letras debajo y un sello ✓ / ✗ según sirva o no. Con varios `items` los
// muestra en fila (p. ej. 2 PE ✓ · 4 PE ✓ · 5 PP ✗) y resalta el `focus` actual. Todo texto viene por props.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EIO, EO, F_DISPLAY, F_SANS, lin, pop } from "./theme";

export type PlasticItem = { code: string; letters: string; name?: string; ok?: boolean; at?: number };

const Triangle: React.FC<{ size: number; p: number; color: string }> = ({ size, p, color }) => {
  // tres flechas en triángulo (símbolo de Möbius simplificado), cada una se traza en su tercio de `p`
  const s = size, h = s * 0.87, pts = [[s / 2, 0], [s, h], [0, h]] as const;
  const seg = (a: readonly number[], b: readonly number[], k: number) => {
    const x1 = a[0] + (b[0] - a[0]) * 0.14, y1 = a[1] + (b[1] - a[1]) * 0.14, x2 = a[0] + (b[0] - a[0]) * 0.8, y2 = a[1] + (b[1] - a[1]) * 0.8;
    const q = Math.max(0, Math.min(1, p * 3 - k));
    const ang = Math.atan2(y2 - y1, x2 - x1), L = s * 0.13;
    return (
      <g key={k}>
        <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * q} y2={y1 + (y2 - y1) * q} stroke={color} strokeWidth={s * 0.075} strokeLinecap="round" />
        {q >= 1 ? <path d={`M ${x2 + Math.cos(ang) * L * 0.6} ${y2 + Math.sin(ang) * L * 0.6} L ${x2 + Math.cos(ang + 2.4) * L} ${y2 + Math.sin(ang + 2.4) * L} L ${x2 + Math.cos(ang - 2.4) * L} ${y2 + Math.sin(ang - 2.4) * L} Z`} fill={color} /> : null}
      </g>
    );
  };
  return <svg width={s} height={h} viewBox={`-10 -10 ${s + 20} ${h + 20}`} style={{ overflow: "visible" }}>{[seg(pts[0], pts[1], 0), seg(pts[1], pts[2], 1), seg(pts[2], pts[0], 2)]}</svg>;
};

const Card: React.FC<{ it: PlasticItem; f: number; big: boolean; dim: boolean }> = ({ it, f, big, dim }) => {
  const { fps } = useVideoConfig();
  const t0 = it.at ?? 0, local = f - t0;
  const inn = pop(local, fps, 0, 190, 15), draw = lin(local, [2, 22], [0, 1], EO);
  const roll = lin(local, [12, 26], [0, 1], EO), n = Number(it.code);
  const shown = Number.isFinite(n) ? String(Math.round(lin(roll, [0, 1], [n + 6, n]))) : it.code;
  const stamp = pop(local, fps, 30, 260, 11);
  const S = big ? 330 : 230;
  return (
    <div style={{ width: S + 60, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.max(0, inn) * (dim ? 0.45 : 1), transform: `scale(${(0.6 + 0.4 * Math.max(0, inn)) * (big ? 1 : 0.92)})`, transition: "none" }}>
      <div style={{ position: "relative", width: S, height: S * 0.87 }}>
        <Triangle size={S} p={draw} color={C.white} />
        <div style={{ position: "absolute", left: 0, right: 0, top: S * 0.3, textAlign: "center", fontFamily: F_DISPLAY, fontSize: S * 0.36, color: C.yellow, textShadow: "0 4px 0 rgba(0,0,0,0.5)", opacity: lin(local, [10, 14], [0, 1]) }}>{shown}</div>
      </div>
      <div style={{ marginTop: 14, fontFamily: F_DISPLAY, fontSize: S * 0.22, color: C.white, letterSpacing: 3, clipPath: `inset(0 ${100 - lin(local, [20, 30], [0, 100], EO)}% 0 0)` }}>{it.letters}</div>
      {it.name ? <div style={{ fontFamily: F_SANS, fontWeight: 700, fontSize: S * 0.085, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: 2, opacity: lin(local, [24, 32], [0, 1]) }}>{it.name}</div> : null}
      {it.ok != null ? (
        <div style={{ marginTop: 12, width: S * 0.3, height: S * 0.3, borderRadius: "50%", backgroundColor: it.ok ? C.green : C.red, display: "flex", alignItems: "center", justifyContent: "center",
          transform: `scale(${Math.max(0, stamp)}) rotate(${(1 - stamp) * -30}deg)`, boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}>
          <svg width="60%" height="60%" viewBox="0 0 100 100">
            {it.ok ? <path d="M18 54 L42 76 L84 26" stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              : <path d="M24 24 L76 76 M76 24 L24 76" stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" />}
          </svg>
        </div>
      ) : null}
    </div>
  );
};

export const TfbPlasticID: React.FC<{ dur: number; items: PlasticItem[]; focus?: { f: number; i: number }[]; title?: string }> = ({ dur, items, focus = [], title }) => {
  const f = useCurrentFrame();
  const out = lin(f, [dur - 8, dur], [1, 0], EIO);
  const cur = focus.filter((q) => q.f <= f).slice(-1)[0]?.i ?? -1;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0.55), rgba(0,0,0,0.78))", opacity: lin(f, [0, 8], [0, 1]) }} />
      {title ? <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: F_DISPLAY, fontSize: 70, color: C.white, letterSpacing: 2, opacity: lin(f, [2, 10], [0, 1]) }}>{title}</div> : null}
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 70, paddingTop: title ? 60 : 0 }}>
        {items.map((it, i) => <Card key={i} it={it} f={f} big={items.length === 1 || cur === i} dim={cur >= 0 && cur !== i} />)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
