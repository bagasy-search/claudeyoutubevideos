// OleShelf — el estante de la despensa que se vacía a la vista (serie olworld). Dos tablones de madera a la luz del farol; cada cosa
// en su lugar con su etiqueta de papel colgada de un hilo y la cuenta que BAJA (from → to) mientras el objeto se vacía.
// Arriba, la viga con las marcas de cuchillo de los días (`marks`) y la nueva tallándose si es un día del trineo (`day` > 0).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SLAB, HAND, woodBg, paperBg, rnd } from "../olsup/OleSupTheme";
import { Bed, CL, easeOut, fadeOut, flicker } from "../olsup/OleBits";

export type ShelfItem = { kind: string; label: string; from: number; to: number; cap?: number };

const Thing: React.FC<{ kind: string; lvl: number; seed: number }> = ({ kind, lvl, seed }) => {
  const W = 300, H = 230;
  const L = Math.max(0, Math.min(1, lvl));
  const dots = (n: number, col: string, r: number, rows = 3) => Array.from({ length: n }).map((_, i) => {
    const cx = 40 + (i % 7) * 36 + rnd(seed + i) * 10, cy = H - 30 - Math.floor(i / 7) * (r * 1.5) - rnd(seed + i * 3) * 6;
    return <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.82} fill={col} stroke="rgba(0,0,0,0.35)" strokeWidth={2} />;
  });
  const k = kind;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {k === "sack" ? (
        <g>
          <path d={`M60 ${H} Q40 ${H - 60} ${70 + (1 - L) * 20} ${H - 40 - 150 * L} Q150 ${H - 60 - 165 * L} ${230 - (1 - L) * 20} ${H - 40 - 150 * L} Q260 ${H - 60} 240 ${H} Z`} fill="#b08a55" stroke="#5b4326" strokeWidth={4} />
          <path d={`M90 ${H - 30} L210 ${H - 30}`} stroke="rgba(60,40,20,0.35)" strokeWidth={3} />
          {L > 0.05 ? <ellipse cx={150} cy={H - 44 - 150 * L} rx={60 * L + 10} ry={10} fill="#8c5a3a" /> : null}
        </g>
      ) : null}
      {k === "potatoes" || k === "apples" || k === "eggs" || k === "onions" ? (
        <g>
          <rect x={20} y={H - 120} width={260} height={120} fill="#7a5532" stroke="#3d2a17" strokeWidth={4} />
          {[0, 1, 2].map((i) => <rect key={i} x={20} y={H - 112 + i * 38} width={260} height={10} fill="rgba(0,0,0,0.28)" />)}
          {dots(Math.round(21 * L), k === "apples" ? "#b8342a" : k === "eggs" ? "#e7d6b8" : k === "onions" ? "#c79a4a" : "#a8875a", k === "eggs" ? 13 : 16)}
        </g>
      ) : null}
      {k === "cabbage" ? (
        <g>
          <line x1={150} y1={0} x2={150} y2={40} stroke="#3a2a18" strokeWidth={3} />
          {Array.from({ length: Math.max(0, Math.round(4 * L)) }).map((_, i) => (
            <g key={i} transform={`translate(${60 + i * 60},${60 + (i % 2) * 20})`}>
              <line x1={0} y1={-30} x2={0} y2={0} stroke="#3a2a18" strokeWidth={2} />
              <circle cx={0} cy={36} r={34} fill="#9cbf6a" stroke="#4f6a2c" strokeWidth={3} />
              <path d="M-20 30 Q0 10 20 30" stroke="#6f8f3e" strokeWidth={3} fill="none" />
            </g>
          ))}
        </g>
      ) : null}
      {k === "carrots" ? (
        <g>
          <rect x={30} y={H - 110} width={240} height={110} fill="#c9b48a" stroke="#6b5636" strokeWidth={4} />
          {Array.from({ length: Math.round(9 * L) }).map((_, i) => <g key={i}><path d={`M${50 + i * 24} ${H - 110} l6 -34 l6 34 z`} fill="#e07b2a" /><path d={`M${56 + i * 24} ${H - 144} l-6 -20 M${56 + i * 24} ${H - 144} l6 -22`} stroke="#5f8f2e" strokeWidth={4} /></g>)}
        </g>
      ) : null}
      {k === "barrel" ? (
        <g>
          <path d={`M70 ${H - 200} Q60 ${H - 100} 70 ${H} L230 ${H} Q240 ${H - 100} 230 ${H - 200} Z`} fill="#8a5b33" stroke="#3d2a17" strokeWidth={4} />
          {[0.15, 0.5, 0.85].map((p, i) => <rect key={i} x={62} y={H - 200 + 200 * p} width={176} height={10} fill="#3b3631" />)}
          <rect x={80} y={H - 200} width={140} height={14} fill="#f2ede0" opacity={L > 0.02 ? 1 : 0} />
          <text x={150} y={H - 80} textAnchor="middle" fontFamily="serif" fontSize={34} fill="rgba(30,15,5,0.6)">FLOUR</text>
          <rect x={200} y={H - 40 - 150 * L} width={10} height={6} fill="#ddd" />
        </g>
      ) : null}
      {k === "crock" ? (
        <g>
          <path d={`M90 ${H - 160} Q70 ${H - 80} 90 ${H} L210 ${H} Q230 ${H - 80} 210 ${H - 160} Z`} fill="#9a9488" stroke="#4b4740" strokeWidth={4} />
          <rect x={86} y={H - 172} width={128} height={18} rx={6} fill="#7d776c" />
          <rect x={92} y={H - 20 - 120 * L} width={116} height={6} fill="rgba(255,255,255,0.5)" opacity={L > 0.02 ? 1 : 0} />
          <path d={`M110 ${H - 110} q40 -10 80 0`} stroke="#2b4c8c" strokeWidth={5} fill="none" />
        </g>
      ) : null}
      {k === "pork" ? (
        <g>
          <rect x={40} y={H - 26} width={220} height={18} fill="#6b4a2a" />
          {Array.from({ length: Math.round(5 * L) }).map((_, i) => <rect key={i} x={50 + i * 42} y={H - 26 - 46} width={36} height={46} rx={4} fill="#f1e6d9" stroke="#c9a28a" strokeWidth={3} />)}
        </g>
      ) : null}
      {k === "jar" || k === "cans" ? (
        <g>
          {Array.from({ length: Math.max(1, k === "cans" ? Math.round(6 * L) : 3) }).map((_, i) => k === "cans" ? (
            <g key={i}><rect x={40 + i * 40} y={H - 70} width={34} height={70} rx={4} fill="#b9b2a6" stroke="#5b564e" strokeWidth={3} /><rect x={40 + i * 40} y={H - 52} width={34} height={28} fill="#c45c3a" /></g>
          ) : (
            <g key={i}><rect x={50 + i * 80} y={H - 130} width={66} height={130} rx={10} fill="rgba(220,235,240,0.25)" stroke="#d9e3e6" strokeWidth={3} />
              <rect x={53 + i * 80} y={H - 3 - 124 * (i === 0 ? L : Math.min(1, L * 1.4))} width={60} height={124 * (i === 0 ? L : Math.min(1, L * 1.4))} rx={8} fill="#efe6c9" opacity={0.9} /></g>
          ))}
        </g>
      ) : null}
      {k === "strings" ? (
        <g>
          {Array.from({ length: Math.round(4 * L) }).map((_, i) => <path key={i} d={`M${60 + i * 55} 0 q-10 60 0 120 q10 60 0 100`} stroke="#8a6a3a" strokeWidth={10} fill="none" strokeDasharray="14 6" />)}
        </g>
      ) : null}
    </svg>
  );
};

export const OleShelf: React.FC<{ title?: string; day?: number; marks?: number; items: ShelfItem[]; bed?: string }> = ({ title, day = 0, marks = 0, items, bed }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const D = durationInFrames;
  const inP = interpolate(f, [0, 14], [0, 1], { ...CL, easing: easeOut });
  const out = fadeOut(f, D, 8);
  const dep = interpolate(f, [D * 0.25, D * 0.75], [0, 1], { ...CL, easing: easeOut });
  const glow = flicker(f, 2);
  const I = items.slice(0, 6);
  const cut = day > 0 ? interpolate(f, [8, 26], [0, 1], CL) : 1; // la marca nueva se talla
  const nMarks = Math.max(0, Math.min(14, marks + (day > 0 ? 1 : 0)));
  return (
    <AbsoluteFill style={{ opacity: out, backgroundColor: OLE.wood0 }}>
      <Bed src={bed} dim={0.5} blur={10} />
      {!bed ? <AbsoluteFill style={{ ...woodBg(OLE.wood1, 1) }} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 22% 40%, rgba(255,185,95,${0.3 * glow}), transparent 60%)` }} />
      {/* viga con marcas */}
      <div style={{ position: "absolute", left: 0, top: 40, width: 1920, height: 110, ...woodBg(OLE.wood3, 3), boxShadow: "0 18px 26px rgba(0,0,0,0.55), inset 0 -8px 0 rgba(0,0,0,0.3)", opacity: inP }}>
        {Array.from({ length: nMarks }).map((_, i) => {
          const last = day > 0 && i === nMarks - 1;
          const h = last ? 70 * cut : 70;
          return <div key={i} style={{ position: "absolute", left: 1150 + i * 46, top: 20, width: 9, height: h, borderRadius: 3, background: last ? "linear-gradient(90deg,#f0d3a2,#c89b62)" : "linear-gradient(90deg,#3a2414,#6b4524)", boxShadow: "inset 2px 0 2px rgba(0,0,0,0.5)", rotate: `${(rnd(i * 7) - 0.5) * 8}deg` }} />;
        })}
        {title ? <div style={{ position: "absolute", left: 60, top: 18, fontFamily: SLAB, fontSize: 60, color: OLE.cream, textShadow: "0 4px 0 rgba(0,0,0,0.55)", whiteSpace: "nowrap" }}>{title}</div> : null}
      </div>
      {/* dos tablones */}
      {[0, 1].map((row) => (
        <div key={row} style={{ position: "absolute", left: 80, top: 470 + row * 400, width: 1760, height: 40, ...woodBg(OLE.wood2, 5 + row), boxShadow: "0 22px 28px rgba(0,0,0,0.55), inset 0 4px 0 rgba(255,225,170,0.2)", opacity: inP }} />
      ))}
      {I.map((it, i) => {
        const row = Math.floor(i / 3), col = i % 3;
        const x = 150 + col * 580, y = 470 + row * 400 - 230;
        const cur = Math.round(it.from + (it.to - it.from) * dep);
        const lvl = cur / Math.max(1, it.cap ?? it.from);
        const sw = Math.sin((f + i * 20) * 0.05) * 3;
        const empty = cur === 0 && it.to === 0 && dep > 0.95;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y + (1 - inP) * 40, opacity: inP }}>
            <div style={{ opacity: empty ? 0.25 : 1, transform: "scale(1.42)", transformOrigin: "50% 100%" }}><Thing kind={it.kind} lvl={lvl} seed={i * 17 + 3} /></div>
            {/* etiqueta de papel colgando del tablón */}
            <div style={{ position: "absolute", left: 300, top: 236, width: 2, height: 30, background: "rgba(40,30,20,0.8)" }} />
            <div style={{ position: "absolute", left: 220, top: 262, width: 250, padding: "10px 14px 12px", ...paperBg(OLE.paperLight), borderRadius: 6, boxShadow: "6px 10px 14px rgba(0,0,0,0.45)", rotate: `${sw - 3 + (i % 2) * 5}deg`, transformOrigin: "50% 0" }}>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 34, lineHeight: "38px", color: OLE.ink, whiteSpace: "nowrap", overflow: "hidden" }}>{it.label}</div>
              <div style={{ fontFamily: SLAB, fontSize: 52, lineHeight: 1, color: cur === 0 ? OLE.plaid : OLE.ink }}>{cur}{it.to !== it.from ? <span style={{ fontFamily: HAND, fontSize: 30, color: OLE.inkSoft }}> {it.to < it.from ? "▼" : "▲"}</span> : null}</div>
            </div>
          </div>
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(10,5,2,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};
