// helen3 · componentes PROPIOS (pollo entero vs pechuga deshuesada). Capas: textura real del oficio → luz/sombra → foto real con cinta → datos → acento.
// Fuentes: SERIF (Fraunces) + LABEL (Oswald). Paleta: papel de carnicería, mostaza, rojo etiqueta, verde lista, tinta.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { img, sp, useT, ez, cl, Mark, LABEL, SERIF, fit, FPS } from "../lkit/core";

const PAPER = "#FBF7EE", MUST = "#D99A1E", RED = "#A3262A", GREEN = "#2F5D46", INK = "#23201C", ICE = "#5D8FB3", GOLD = "#E2B04A";
type Base = { a: number; a0?: number; d: number };
const useT0 = (a: number, a0?: number) => { const { f } = useT(a); const s = a0 ?? a; const R = (t: number) => Math.round(t * FPS); return { f: f + R(a) - R(s), at: (t: number) => R(t) - R(s) }; };

const Tex: React.FC<{ k: string; f: number; d: number }> = ({ k, f, d }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#222" }}>
    <AbsoluteFill style={{ transform: `scale(${1.03 + 0.04 * f / Math.max(1, d)})` }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 85% at 78% 6%, rgba(255,246,220,0.22), rgba(255,246,220,0) 60%), linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.30))" }} />
  </AbsoluteFill>
);
// foto real pegada con dos tiras de cinta, entra deslizando
const Photo: React.FC<{ k: string; w: number; h: number; x: number; y: number; rot?: number; f: number; at?: number; from?: "up" | "left" | "right" | "down"; z?: number }> =
  ({ k, w, h, x, y, rot = 0, f, at = 0, from = "up", z = 1 }) => {
    const u = sp(f, at, 16, 120);
    const dx = from === "left" ? -800 : from === "right" ? 800 : 0, dy = from === "up" ? -600 : from === "down" ? 600 : 0;
    return (
      <div style={{ position: "absolute", left: x, top: y, zIndex: z, opacity: cl(u * 2), transform: `translate(${dx * (1 - u)}px, ${dy * (1 - u)}px) rotate(${rot + (1 - u) * -5}deg)` }}>
        <div style={{ width: w, height: h, overflow: "hidden", borderRadius: 6, boxShadow: `0 ${26 + 18 * u}px 60px rgba(15,10,5,0.55), 0 0 0 6px ${PAPER}` }}>
          <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.05 * Math.min(1, f / 300)})` }} />
        </div>
        {[[-30, -18, -38], [w - 110, h - 22, -35]].map(([tx, ty, r], i) => (
          <div key={i} style={{ position: "absolute", left: tx, top: ty, width: 140, height: 40, background: "rgba(236,226,196,0.85)", transform: `rotate(${r}deg)`, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
        ))}
      </div>
    );
  };
const Lbl: React.FC<{ txt: string; size: number; color?: string; ls?: number; style?: React.CSSProperties }> = ({ txt, size, color = INK, ls = 2, style }) => (
  <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: size, color, letterSpacing: ls, textTransform: "uppercase", lineHeight: 1.05, whiteSpace: "nowrap", ...style }}>{txt}</div>
);
const Ser: React.FC<{ txt: string; size: number; color?: string; italic?: boolean; style?: React.CSSProperties }> = ({ txt, size, color = INK, italic, style }) => (
  <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: size, color, fontStyle: italic ? "italic" : undefined, lineHeight: 1.08, whiteSpace: "nowrap", ...style }}>{txt}</div>
);
const pop = (f: number, at: number) => { const u = sp(f, at, 12, 170); return { opacity: cl(u * 3), transform: `scale(${0.7 + 0.3 * u})` }; };
const rise = (f: number, at: number) => { const u = sp(f, at, 15, 140); return { opacity: cl(u * 2.5), transform: `translateY(${(1 - u) * 40}px)` }; };
// tilde verde dibujado
const Check: React.FC<{ f: number; at: number; s?: number; c?: string }> = ({ f, at, s = 56, c = GREEN }) => (
  <svg width={s} height={s} viewBox="0 0 60 60" style={{ overflow: "visible", flex: "none" }}>
    <rect x={3} y={3} width={54} height={54} rx={8} fill="none" stroke={INK} strokeWidth={4} opacity={0.7} />
    <path d="M 12 32 L 26 46 L 52 10" fill="none" stroke={c} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez((f - at) / 9)} />
  </svg>
);
const Stamp: React.FC<{ txt: string; f: number; at: number; c?: string; size?: number; rot?: number; x: number; y: number }> = ({ txt, f, at, c = RED, size = 90, rot = -8, x, y }) => {
  const u = sp(f, at, 10, 220);
  return f < at - 1 ? null : (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 8, opacity: cl(u * 3), transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * u})` }}>
      <div style={{ border: `9px solid ${c}`, borderRadius: 14, padding: "8px 34px", color: c, background: "rgba(251,247,238,0.88)", boxShadow: "0 18px 30px rgba(0,0,0,0.4)" }}><Lbl txt={txt} size={size} color={c} ls={3} /></div>
    </div>
  );
};

// 1 · dos bandejas con su etiqueta de balanza; sello rojo "12¢ LESS"
type Tag = { name: string; lb: string; per: string; tot: string; t: number };
const PriceTag: React.FC<{ g: Tag; f: number; at: number; x: number; y: number; rot: number }> = ({ g, f, at, x, y, rot }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 520, zIndex: 5, transform: `rotate(${rot}deg)`, ...pop(f, at) }}>
    <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 22px 34px rgba(0,0,0,0.45)" }}>
      <div style={{ background: RED, padding: "8px 22px" }}><Lbl txt={g.name} size={fit(g.name, 470, 42, "label", 1, 2)} color="#fff" /></div>
      <div style={{ padding: "12px 22px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><Lbl txt="NET WT" size={30} color="#777" /><Lbl txt={g.lb} size={34} color="#333" /></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}><Lbl txt="PRICE / LB" size={30} color="#777" /><Lbl txt={g.per} size={34} color="#333" /></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "3px solid #222", marginTop: 8, paddingTop: 6 }}><Lbl txt="TOTAL" size={40} /><Lbl txt={g.tot} size={84} color={RED} /></div>
      </div>
    </div>
  </div>
);
export const PriceStickers: React.FC<Base & { kL: string; kR: string; L: Tag; R_: Tag; stamp: string; tS: number }> = ({ a, a0, d, kL, kR, L, R_, stamp, tS }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Tex k="tx_steel" f={f} d={d} />
      <Photo k={kL} w={800} h={470} x={70} y={110} rot={-2} f={f} at={2} from="left" />
      <Photo k={kR} w={800} h={470} x={1040} y={130} rot={1.5} f={f} at={Math.min(at(R_.t), 14)} from="right" />
      <PriceTag g={L} f={f} at={at(L.t)} x={250} y={560} rot={-3} />
      <PriceTag g={R_} f={f} at={at(R_.t)} x={1220} y={575} rot={2} />
      <Stamp txt={stamp} f={f} at={at(tS)} x={1300} y={70} rot={-10} size={100} />
    </AbsoluteFill>
  );
};

// 2 · un pollo = nueve piezas: lista que cuenta con contador grande
export const PieceCount: React.FC<Base & { k: string; rows: { txt: string; t: number }[] }> = ({ a, a0, d, k, rows }) => {
  const { f, at } = useT0(a, a0);
  const shown = rows.filter((r) => f >= at(r.t)).length;
  return (
    <AbsoluteFill>
      <Tex k="tx_block" f={f} d={d} />
      <Photo k={k} w={860} h={560} x={70} y={250} rot={-1.5} f={f} at={2} from="left" />
      <div style={{ position: "absolute", left: 90, top: 70, ...rise(f, 4) }}><Ser txt="One whole chicken gives you…" size={64} color={PAPER} style={{ textShadow: "0 4px 14px #000c" }} /></div>
      <div style={{ position: "absolute", left: 1040, top: 210, width: 800, padding: "34px 40px", background: PAPER, borderRadius: 8, boxShadow: "0 30px 50px rgba(0,0,0,0.5)", transform: "rotate(1deg)", ...rise(f, 6) }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, height: 104, borderBottom: i < rows.length - 1 ? "2px solid #e4dccb" : undefined, ...rise(f, at(r.t)) }}>
            <Check f={f} at={at(r.t) + 3} />
            <Ser txt={r.txt} size={Math.max(46, fit(r.txt, 640, 58, "serif"))} style={{ whiteSpace: "normal", maxWidth: 640 }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 1500, top: 60, width: 300, textAlign: "center", ...pop(f, at(rows[0].t)) }}>
        <div style={{ background: MUST, borderRadius: 120, width: 200, height: 200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 26px #0007" }}>
          <Lbl txt={`${shown}/${rows.length}`} size={86} color={INK} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · precio por libra en barras que crecen, con foto en cada fila; corchete "MORE THAN 2×"
export const PerPound: React.FC<Base & { head: string; bars: { name: string; v: number; lbl: string; k: string; t: number }[]; x2: string; tX: number }> = ({ a, a0, d, head, bars, x2, tX }) => {
  const { f, at } = useT0(a, a0);
  const max = Math.max(...bars.map((b) => b.v)), W = 900;
  return (
    <AbsoluteFill>
      <Tex k="tx_paper" f={f} d={d} />
      <div style={{ position: "absolute", left: 110, top: 70, ...rise(f, 3) }}><Lbl txt={head} size={80} color={INK} ls={5} /></div>
      <div style={{ position: "absolute", left: 110, top: 168, width: 640, height: 8, background: MUST, transformOrigin: "left", transform: `scaleX(${ez((f - 8) / 14)})` }} />
      {bars.map((b, i) => {
        const y = 250 + i * 250, u = sp(f, at(b.t) + 4, 18, 70);
        return (
          <div key={i} style={{ position: "absolute", left: 110, top: y, ...rise(f, at(b.t)) }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 190, overflow: "hidden", borderRadius: 6, boxShadow: "0 14px 24px #0006, 0 0 0 5px #fff" }}><Img src={img(b.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div style={{ position: "absolute", left: 340, top: 0 }}><Ser txt={b.name} size={50} /></div>
            <div style={{ position: "absolute", left: 340, top: 80, width: (b.v / max) * W * u, height: 92, background: i === 0 ? RED : GREEN, borderRadius: "0 10px 10px 0", boxShadow: "0 10px 18px #0004" }} />
            <div style={{ position: "absolute", left: 360 + (b.v / max) * W * u, top: 84, opacity: cl(u * 2) }}><Lbl txt={b.lbl} size={76} color={i === 0 ? RED : GREEN} /></div>
          </div>
        );
      })}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
        <path d="M 1640 380 Q 1720 380 1720 470 L 1720 560 Q 1720 630 1640 630" fill="none" stroke={RED} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez((f - at(tX)) / 12)} />
      </svg>
      <Stamp txt={x2} f={f} at={at(tX) + 6} x={1380} y={660} rot={-6} size={70} />
    </AbsoluteFill>
  );
};

// 4 · tablilla con pinza y lista de chequeo para elegir el pollo
export const BirdCheck: React.FC<Base & { k: string; head: string; items: { txt: string; t: number }[] }> = ({ a, a0, d, k, head, items }) => {
  const { f, at } = useT0(a, a0);
  const u = sp(f, 4, 15, 110);
  return (
    <AbsoluteFill>
      <Tex k="tx_tile" f={f} d={d} />
      <Photo k={k} w={860} h={560} x={70} y={260} rot={-2} f={f} at={2} from="left" />
      <div style={{ position: "absolute", left: 1030, top: 90, width: 780, height: 900, transform: `rotate(1.5deg) translateY(${(1 - u) * 1000}px)` }}>
        <div style={{ position: "absolute", inset: 0, background: "#8B5E34", borderRadius: 24, boxShadow: "0 40px 60px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 40, top: 90, right: 40, bottom: 40, background: PAPER, padding: "50px 46px" }}>
          <Ser txt={head} size={66} italic color={INK} />
          <div style={{ height: 5, width: 300, background: MUST, margin: "14px 0 26px" }} />
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, height: 140, ...rise(f, at(it.t)) }}>
              <Check f={f} at={at(it.t) + 4} s={66} />
              <Lbl txt={it.txt} size={fit(it.txt.toUpperCase(), 560, 54, "label", 1, 2)} color={INK} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 250, top: 30, width: 280, height: 110, borderRadius: 18, background: "linear-gradient(180deg,#d9dde0,#8d949a)", boxShadow: "0 10px 16px #0007" }} />
      </div>
    </AbsoluteFill>
  );
};

// 5 · no / sí: chorro en la pileta tachado, toalla de papel aprobada
export const NoRinse: React.FC<Base & { k: string; kOk: string; no: string; yes: string; tNo: number; tYes: number }> = ({ a, a0, d, k, kOk, no, yes, tNo, tYes }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Tex k="tx_tile" f={f} d={d} />
      <Photo k={k} w={780} h={520} x={90} y={200} rot={-2} f={f} at={2} from="left" />
      <svg style={{ position: "absolute", left: 0, top: 0, zIndex: 4, overflow: "visible" }} width={1920} height={1080}>
        {[["M 160 260 L 820 680"], ["M 820 260 L 160 680"]].map(([p], i) => (
          <path key={i} d={p} stroke={RED} strokeWidth={26} strokeLinecap="round" opacity={0.92} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez((f - at(tNo) - i * 6) / 8)} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 250, top: 790, zIndex: 5, ...pop(f, at(tNo)) }}><div style={{ background: RED, padding: "12px 40px", transform: "rotate(-2deg)", boxShadow: "0 16px 26px #0007" }}><Lbl txt={no} size={78} color="#fff" ls={4} /></div></div>
      <Photo k={kOk} w={780} h={520} x={1050} y={220} rot={2} f={f} at={at(tYes)} from="right" />
      <div style={{ position: "absolute", left: 1220, top: 800, zIndex: 5, display: "flex", alignItems: "center", gap: 20, ...pop(f, at(tYes) + 8) }}>
        <div style={{ background: GREEN, padding: "12px 40px", transform: "rotate(2deg)", boxShadow: "0 16px 26px #0007", display: "flex", alignItems: "center", gap: 20 }}><Lbl txt={yes} size={78} color="#fff" ls={4} /></div>
      </div>
    </AbsoluteFill>
  );
};

// 6 · plano de tiza sobre tabla: dónde se abre el pollo (pierna como libro, pop en la cadera)
export const BirdChart: React.FC<Base & { head: string; marks: { part: string; txt: string; t: number }[] }> = ({ a, a0, d, head, marks }) => {
  const { f, at } = useT0(a, a0);
  const leg = marks.find((m) => m.part === "leg"), hip = marks.find((m) => m.part === "hip");
  const bend = leg ? sp(f, at(leg.t), 12, 60) : 0;
  const draw = ez((f - 4) / 30);
  const pulse = hip ? (f >= at(hip.t) ? 1 + 0.18 * Math.abs(Math.sin((f - at(hip.t)) / 5)) : 0) : 0;
  return (
    <AbsoluteFill>
      <Tex k="tx_board" f={f} d={d} />
      <div style={{ position: "absolute", left: 100, top: 70, ...rise(f, 3) }}><Lbl txt={head} size={78} color={INK} ls={5} /></div>
      <svg style={{ position: "absolute", left: 260, top: 160, overflow: "visible" }} width={900} height={860} viewBox="0 0 900 860">
        <g fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 450 120 C 640 120 700 300 690 470 C 680 640 580 740 450 740 C 320 740 220 640 210 470 C 200 300 260 120 450 120 Z" fill="#F3E6CF" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          <path d="M 450 150 L 450 560" strokeDasharray="18 16" opacity={0.6 * draw} />
          <path d="M 250 260 C 150 250 110 340 170 400" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="#F3E6CF" />
          <path d="M 650 260 C 750 250 790 340 730 400" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="#F3E6CF" />
          <g transform={`rotate(${-38 * bend} 300 620)`}>
            <path d="M 300 620 C 220 650 170 720 190 800 C 205 850 260 850 280 800 C 300 740 330 690 360 660" fill="#F3E6CF" stroke={bend > 0.05 ? RED : INK} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          </g>
          <path d="M 600 620 C 680 650 730 720 710 800 C 695 850 640 850 620 800 C 600 740 570 690 540 660" fill="#F3E6CF" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        </g>
        {hip && f >= at(hip.t) && <circle cx={310} cy={625} r={40 * pulse} fill="none" stroke={MUST} strokeWidth={10} />}
        {hip && f >= at(hip.t) && <circle cx={310} cy={625} r={14} fill={MUST} />}
      </svg>
      {leg && <div style={{ position: "absolute", left: 1180, top: 330, ...rise(f, at(leg.t)) }}>
        <Lbl txt="THE LEG" size={44} color={RED} ls={4} /><Ser txt={leg.txt} size={fit(leg.txt, 680, 64, "serif")} italic />
      </div>}
      {hip && <div style={{ position: "absolute", left: 1180, top: 560, ...rise(f, at(hip.t)) }}>
        <Lbl txt="THE HIP" size={44} color={MUST} ls={4} /><Ser txt={hip.txt} size={fit(hip.txt, 680, 64, "serif")} italic />
      </div>}
      {hip && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
        <path d="M 1170 640 Q 900 700 620 790" fill="none" stroke={MUST} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez((f - at(hip.t) - 6) / 12)} />
      </svg>}
    </AbsoluteFill>
  );
};

// 7 · la línea de grasa: foto grande con trazo punteado mostaza y el cuchillo que la sigue
export const FatLine: React.FC<Base & { k: string; txt: string; tLine: number; tCut: number }> = ({ a, a0, d, k, txt, tLine, tCut }) => {
  const { f, at } = useT0(a, a0);
  const u = ez((f - at(tLine)) / 18), v = ez((f - at(tCut)) / 40);
  const P = "M 700 330 C 820 420 900 520 960 640 C 1000 720 1060 780 1120 820";
  return (
    <AbsoluteFill>
      <Tex k="tx_block" f={f} d={d} />
      <Photo k={k} w={1500} h={800} x={210} y={130} rot={-0.8} f={f} at={2} from="down" />
      <svg style={{ position: "absolute", left: 0, top: 0, zIndex: 4, overflow: "visible" }} width={1920} height={1080}>
        <path d={P} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={20} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} transform="translate(4 6)" />
        <path d={P} fill="none" stroke={GOLD} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
        {f >= at(tCut) && (() => {
          const t = v, x = 700 + (1120 - 700) * t, y = 330 + (820 - 330) * (t * t * 0.3 + t * 0.7);
          return <g transform={`translate(${x} ${y}) rotate(52)`}><path d="M -10 -150 L 14 -150 L 18 20 L 0 40 L -14 20 Z" fill="#dfe3e6" stroke="#555" strokeWidth={3} /><rect x={-14} y={-260} width={28} height={110} rx={8} fill="#2b2420" /></g>;
        })()}
      </svg>
      <div style={{ position: "absolute", left: 1260, top: 170, zIndex: 5, ...pop(f, at(tLine) + 6) }}>
        <div style={{ background: PAPER, padding: "14px 34px", borderRadius: 6, transform: "rotate(3deg)", boxShadow: "0 18px 30px #0007" }}><Ser txt={txt} size={66} italic color={INK} /></div>
      </div>
    </AbsoluteFill>
  );
};

// 8 · tres pasos numerados para sacar la pechuga
export const BreastSteps: React.FC<Base & { k: string; steps: { txt: string; t: number }[] }> = ({ a, a0, d, k, steps }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Tex k="tx_steel" f={f} d={d} />
      <Photo k={k} w={860} h={560} x={70} y={250} rot={-1.5} f={f} at={2} from="left" />
      <div style={{ position: "absolute", left: 90, top: 80, ...rise(f, 4) }}><Lbl txt="THE BREAST, OFF THE BONE" size={66} color={PAPER} ls={4} style={{ textShadow: "0 4px 14px #000c" }} /></div>
      {steps.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: 1010, top: 230 + i * 230, display: "flex", alignItems: "center", gap: 30, ...rise(f, at(s.t)) }}>
          <div style={{ width: 150, height: 150, borderRadius: 75, background: [RED, MUST, GREEN][i], display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 24px #0007", flex: "none" }}>
            <Ser txt={`${i + 1}`} size={100} color="#fff" />
          </div>
          <div style={{ background: PAPER, padding: "18px 30px", borderRadius: 6, boxShadow: "0 16px 24px #0006", maxWidth: 720 }}>
            <Ser txt={s.txt} size={Math.max(48, fit(s.txt, 660, 56, "serif"))} style={{ whiteSpace: "normal", maxWidth: 640 }} />
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// 9 · una pechuga abierta = dos milanesas; reloj de 4 minutos
export const SplitCutlet: React.FC<Base & { k: string; kB: string; one: string; two: string; tSplit: number; tTime: number }> = ({ a, a0, d, k, kB, one, two, tSplit, tTime }) => {
  const { f, at } = useT0(a, a0);
  const m = ez((f - at(tTime)) / 30);
  return (
    <AbsoluteFill>
      <Tex k="tx_board" f={f} d={d} />
      <Photo k={k} w={760} h={500} x={80} y={200} rot={-2} f={f} at={2} from="left" />
      <div style={{ position: "absolute", left: 230, top: 760, ...pop(f, 10) }}><Lbl txt={one} size={92} color={INK} ls={4} /></div>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
        <path d="M 880 450 Q 960 380 1040 450" fill="none" stroke={RED} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez((f - at(tSplit)) / 10)} />
        <path d="M 1010 420 L 1045 455 L 1000 470" fill="none" stroke={RED} strokeWidth={12} strokeLinecap="round" opacity={cl((f - at(tSplit) - 8) / 3)} />
      </svg>
      <Photo k={kB} w={760} h={500} x={1080} y={220} rot={2} f={f} at={at(tSplit)} from="right" />
      <div style={{ position: "absolute", left: 1240, top: 770, ...pop(f, at(tSplit) + 8) }}><Lbl txt={two} size={92} color={GREEN} ls={4} /></div>
      {f >= at(tTime) && <div style={{ position: "absolute", left: 800, top: 60, display: "flex", alignItems: "center", gap: 22, ...pop(f, at(tTime)) }}>
        <svg width={130} height={130} viewBox="0 0 130 130"><circle cx={65} cy={65} r={58} fill={PAPER} stroke={INK} strokeWidth={6} />
          <path d={`M 65 65 L 65 12 A 53 53 0 ${m > 0.5 ? 1 : 0} 1 ${65 + 53 * Math.sin(m * 2 * Math.PI * 0.999)} ${65 - 53 * Math.cos(m * 2 * Math.PI * 0.999)} Z`} fill={MUST} /></svg>
        <div style={{ background: INK, padding: "8px 26px", borderRadius: 8 }}><Lbl txt={`${Math.max(1, Math.round(4 * m))} MIN`} size={78} color={GOLD} /></div>
      </div>}
    </AbsoluteFill>
  );
};

// 10 · frasco de caldo que se llena a medida que entran los ingredientes
export const BrothJar: React.FC<Base & { k: string; lines: { txt: string; t: number }[]; tFill: number }> = ({ a, a0, d, k, lines, tFill }) => {
  const { f, at } = useT0(a, a0);
  const n = lines.filter((l) => f >= at(l.t)).length;
  const prev = Math.max(0, n - 1) * 0.18, cur = n * 0.18;
  const tgt = f >= at(tFill) ? 0.86 : prev + (cur - prev) * ez((f - at(lines[Math.max(0, n - 1)].t)) / 14);
  const lev = 0.06 + tgt;
  return (
    <AbsoluteFill>
      <Tex k="tx_kraft" f={f} d={d} />
      <Photo k={k} w={720} h={470} x={70} y={130} rot={-2} f={f} at={2} from="left" />
      <div style={{ position: "absolute", left: 90, top: 660, width: 820 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 88, ...rise(f, at(l.t)) }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: GOLD, flex: "none" }} /><Ser txt={l.txt} size={fit(l.txt, 760, 54, "serif")} />
          </div>
        ))}
      </div>
      <svg style={{ position: "absolute", left: 1050, top: 90, overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.45))" }} width={700} height={900} viewBox="0 0 700 900">
        <defs><clipPath id="jar3"><path d="M 150 160 L 550 160 Q 620 200 620 280 L 620 800 Q 620 860 560 860 L 140 860 Q 80 860 80 800 L 80 280 Q 80 200 150 160 Z" /></clipPath>
          <linearGradient id="br3" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#F3C766" /><stop offset="1" stopColor="#B9781F" /></linearGradient></defs>
        <g clipPath="url(#jar3)">
          <rect x={0} y={0} width={700} height={900} fill="rgba(255,255,255,0.35)" />
          <rect x={0} y={860 - 700 * lev} width={700} height={900} fill="url(#br3)" />
          <path d={`M 0 ${860 - 700 * lev} Q 175 ${850 - 700 * lev + 12 * Math.sin(f / 7)} 350 ${860 - 700 * lev} T 700 ${860 - 700 * lev}`} fill="none" stroke="#FBE3A0" strokeWidth={6} />
        </g>
        <path d="M 150 160 L 550 160 Q 620 200 620 280 L 620 800 Q 620 860 560 860 L 140 860 Q 80 860 80 800 L 80 280 Q 80 200 150 160 Z" fill="none" stroke="#ffffffcc" strokeWidth={10} />
        <rect x={130} y={60} width={440} height={100} rx={14} fill="#9A9EA2" stroke="#6b6f73" strokeWidth={5} />
        <rect x={140} y={280} width={40} height={460} rx={20} fill="#ffffff55" />
      </svg>
      {f >= at(tFill) && <div style={{ position: "absolute", left: 1200, top: 470, ...pop(f, at(tFill) + 4) }}>
        <div style={{ background: PAPER, padding: "16px 34px", borderRadius: 6, transform: "rotate(-3deg)", boxShadow: "0 16px 24px #0006", textAlign: "center" }}>
          <Lbl txt="2 QUARTS" size={90} color={RED} /><Ser txt="real broth" size={50} italic />
        </div>
      </div>}
    </AbsoluteFill>
  );
};

// 11 · reloj de cocina que barre las 2 horas para enfriar el caldo
export const CoolClock: React.FC<Base & { k: string; head: string; hrs: number; t: number }> = ({ a, a0, d, k, head, hrs, t }) => {
  const { f, at } = useT0(a, a0);
  const m = ez((f - at(t)) / 40) * (hrs / 12);
  const ang = m * 360;
  const R = 230;
  const ex = 300 + R * Math.sin(ang * Math.PI / 180), ey = 300 - R * Math.cos(ang * Math.PI / 180);
  return (
    <AbsoluteFill>
      <Tex k="tx_tile" f={f} d={d} />
      <Photo k={k} w={860} h={560} x={70} y={260} rot={-2} f={f} at={2} from="left" />
      <div style={{ position: "absolute", left: 1110, top: 70, ...rise(f, 4) }}><Lbl txt={head} size={58} color={INK} ls={4} /></div>
      <svg style={{ position: "absolute", left: 1110, top: 170, overflow: "visible", filter: "drop-shadow(0 26px 34px rgba(0,0,0,0.45))" }} width={600} height={600}>
        <circle cx={300} cy={300} r={290} fill={ICE} /><circle cx={300} cy={300} r={255} fill={PAPER} />
        {ang > 0.5 && <path d={`M 300 300 L 300 ${300 - R} A ${R} ${R} 0 ${ang > 180 ? 1 : 0} 1 ${ex} ${ey} Z`} fill={ICE} opacity={0.45} />}
        {Array.from({ length: 12 }, (_, i) => { const g = i * 30 * Math.PI / 180; return <text key={i} x={300 + Math.sin(g) * 205} y={318 - Math.cos(g) * 205} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={46} fill={INK}>{i === 0 ? 12 : i}</text>; })}
        <line x1={300} y1={300} x2={300 + 130 * Math.sin(ang * Math.PI / 180)} y2={300 - 130 * Math.cos(ang * Math.PI / 180)} stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <circle cx={300} cy={300} r={18} fill={RED} />
      </svg>
      <div style={{ position: "absolute", left: 1210, top: 800, ...pop(f, at(t) + 20) }}><div style={{ background: ICE, padding: "10px 40px", borderRadius: 8, boxShadow: "0 16px 24px #0006" }}><Lbl txt={`${hrs} HOURS`} size={96} color="#fff" ls={4} /></div></div>
    </AbsoluteFill>
  );
};

// 12 · bolsas del freezer con cinta de papel escrita; sello helado "9 MONTHS"
export const FreezeTape: React.FC<Base & { k: string; tapes: { txt: string; t: number }[]; big: string; tBig: number }> = ({ a, a0, d, k, tapes, big, tBig }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Tex k="tx_steel" f={f} d={d} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(150,190,220,0.25), rgba(150,190,220,0))" }} />
      <Photo k={k} w={940} h={600} x={70} y={220} rot={-1.5} f={f} at={2} from="left" />
      {tapes.map((tp, i) => {
        const u = sp(f, at(tp.t), 14, 150);
        return (
          <div key={i} style={{ position: "absolute", left: 1110, top: 200 + i * 190, opacity: cl(u * 3), transform: `translateX(${(1 - u) * 400}px) rotate(${[-2, 1.5, -1][i % 3]}deg)` }}>
            <div style={{ width: 640, padding: "18px 36px", background: "#EFE3BE", boxShadow: "0 12px 20px #0005", clipPath: "polygon(1% 4%,99% 0,100% 50%,99% 96%,0 100%,1% 50%)" }}>
              <Ser txt={tp.txt} size={fit(tp.txt, 560, 74, "serif")} italic color={INK} />
            </div>
          </div>
        );
      })}
      <Stamp txt={big} f={f} at={at(tBig)} c={ICE} x={1160} y={780} rot={-5} size={96} />
    </AbsoluteFill>
  );
};

// 13 · termómetro de dial: 165 seguro, 175 muslos
export const ThermoDial: React.FC<Base & { k: string; marks: { v: number; txt: string; t: number }[] }> = ({ a, a0, d, k, marks }) => {
  const { f, at } = useT0(a, a0);
  const g = (v: number) => -135 + ((v - 100) / 100) * 270;   // 100°→-135, 200°→+135
  let v = 100;
  marks.forEach((m, i) => { const prev = i ? marks[i - 1].v : 100; v = f >= at(m.t) ? prev + (m.v - prev) * sp(f, at(m.t), 12, 70) : v; });
  return (
    <AbsoluteFill>
      <Tex k="tx_block" f={f} d={d} />
      <Photo k={k} w={860} h={560} x={70} y={250} rot={-1.5} f={f} at={2} from="left" />
      <svg style={{ position: "absolute", left: 1100, top: 110, overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.5))" }} width={640} height={640}>
        <circle cx={320} cy={320} r={310} fill="#B9BEC3" /><circle cx={320} cy={320} r={280} fill="#fff" />
        {Array.from({ length: 21 }, (_, i) => { const r = g(100 + i * 5) * Math.PI / 180, big = i % 4 === 0; return <line key={i} x1={320 + Math.sin(r) * (big ? 210 : 235)} y1={320 - Math.cos(r) * (big ? 210 : 235)} x2={320 + Math.sin(r) * 262} y2={320 - Math.cos(r) * 262} stroke={INK} strokeWidth={big ? 7 : 3} />; })}
        {[100, 120, 140, 160, 180, 200].map((n) => { const r = g(n) * Math.PI / 180; return <text key={n} x={320 + Math.sin(r) * 165} y={336 - Math.cos(r) * 165} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={42} fill={INK}>{n}</text>; })}
        {marks.map((m, i) => { const r = g(m.v) * Math.PI / 180; return f >= at(m.t) ? <circle key={i} cx={320 + Math.sin(r) * 248} cy={320 - Math.cos(r) * 248} r={22} fill={i ? MUST : GREEN} /> : null; })}
        <text x={320} y={470} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={36} fill="#888" letterSpacing={6}>°F</text>
        <g transform={`rotate(${g(v)} 320 320)`}><path d="M 312 320 L 320 90 L 328 320 Z" fill={RED} /></g>
        <circle cx={320} cy={320} r={24} fill={INK} />
      </svg>
      <div style={{ position: "absolute", left: 1080, top: 800, display: "flex", gap: 26 }}>
        {marks.map((m, i) => (
          <div key={i} style={{ ...pop(f, at(m.t) + 8), background: i ? MUST : GREEN, borderRadius: 10, padding: "10px 26px", boxShadow: "0 14px 22px #0006", transform: `rotate(${i ? 2 : -2}deg)` }}>
            <Lbl txt={`${m.v}° ${m.txt}`} size={60} color="#fff" />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 14 · cuántas cenas por la misma plata: platos que se apilan de cada lado
const Plates: React.FC<{ n: number; f: number; ats: number[]; c: string }> = ({ n, f, ats, c }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 14, width: 700 }}>
    {Array.from({ length: n }, (_, i) => (
      <svg key={i} width={120} height={120} viewBox="0 0 120 120" style={{ ...pop(f, ats[i] ?? 0) }}>
        <circle cx={60} cy={60} r={56} fill="#fff" stroke="#cfc7b6" strokeWidth={4} /><circle cx={60} cy={60} r={36} fill="none" stroke={c} strokeWidth={6} />
        <path d="M 44 66 Q 60 40 76 58" fill="none" stroke={c} strokeWidth={8} strokeLinecap="round" />
      </svg>
    ))}
  </div>
);
export const MealTally: React.FC<Base & { head: string; L: { name: string; amt: string; n: number; t: number }; R_: { name: string; amt: string; t: number }; adds: { n: number; txt: string; t: number }[]; tEnd: number }> = ({ a, a0, d, head, L, R_, adds, tEnd }) => {
  const { f, at } = useT0(a, a0);
  const ats: number[] = []; adds.forEach((x) => { for (let i = 0; i < x.n; i++) ats.push(at(x.t) + i * 4); });
  const nR = ats.filter((t) => f >= t).length, tot = ats.length;
  const last = adds.filter((x) => f >= at(x.t)).slice(-1)[0];
  return (
    <AbsoluteFill>
      <Tex k="tx_paper" f={f} d={d} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, display: "flex", justifyContent: "center", ...rise(f, 3) }}><Lbl txt={head} size={70} ls={5} /></div>
      <div style={{ position: "absolute", left: 958, top: 170, width: 4, height: 840, background: "#cbbfa6" }} />
      <div style={{ position: "absolute", left: 120, top: 180, ...rise(f, at(L.t) - 8) }}>
        <Lbl txt={L.name} size={52} color={RED} /><Ser txt={L.amt} size={110} />
        <div style={{ marginTop: 20 }}><Plates n={L.n} f={f} ats={Array.from({ length: L.n }, (_, i) => at(L.t) + i * 4)} c={RED} /></div>
        <div style={{ marginTop: 18, ...pop(f, at(L.t) + 18) }}><Ser txt={`${L.n} suppers`} size={70} italic color={RED} /></div>
      </div>
      <div style={{ position: "absolute", left: 1040, top: 180, ...rise(f, at(R_.t)) }}>
        <Lbl txt={R_.name} size={52} color={GREEN} /><Ser txt={R_.amt} size={110} />
        <div style={{ marginTop: 20 }}><Plates n={tot} f={f} ats={ats} c={GREEN} /></div>
        {last && <div style={{ marginTop: 18 }}><Ser txt={`+ ${last.txt}`} size={56} italic color={GREEN} /></div>}
      </div>
      <Stamp txt={`${Math.max(nR, tot)} MEALS`} f={f} at={at(tEnd)} c={GREEN} x={1250} y={840} rot={-6} size={96} />
    </AbsoluteFill>
  );
};

// 15 · de un mes a un año: hoja de almanaque y 12 casilleros que se llenan
export const YearCount: React.FC<Base & { k: string; month: string; year: string; tM: number; tY: number }> = ({ a, a0, d, k, month, year, tM, tY }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Tex k="tx_kraft" f={f} d={d} />
      <Photo k={k} w={760} h={500} x={70} y={120} rot={-2} f={f} at={2} from="left" />
      <div style={{ position: "absolute", left: 150, top: 690, ...pop(f, at(tM)) }}>
        <div style={{ width: 420, background: PAPER, borderRadius: 8, overflow: "hidden", boxShadow: "0 20px 30px #0006", transform: "rotate(-3deg)", textAlign: "center" }}>
          <div style={{ background: RED, padding: "8px 0" }}><Lbl txt="EVERY MONTH" size={44} color="#fff" ls={4} /></div>
          <Ser txt={month} size={130} style={{ padding: "6px 0 12px" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 960, top: 150, display: "grid", gridTemplateColumns: "repeat(4, 200px)", gap: 18 }}>
        {"JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC".split(" ").map((m, i) => (
          <div key={i} style={{ height: 120, background: f >= at(tY) + i * 2 ? MUST : "rgba(251,247,238,0.85)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 14px #0004", ...rise(f, at(tM) + 8 + i) }}>
            <Lbl txt={m} size={48} color={INK} ls={3} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 1040, top: 610, ...pop(f, at(tY) + 26) }}>
        <div style={{ background: INK, padding: "16px 50px", borderRadius: 10, transform: "rotate(2deg)", boxShadow: "0 20px 30px #0007", textAlign: "center" }}>
          <Lbl txt="EVERY YEAR" size={48} color={GOLD} ls={5} /><Ser txt={year} size={170} color="#fff" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// overlay · sello redondo del paso N, arriba a la izquierda
export const StepSeal: React.FC<Base & { n: number; txt: string }> = ({ d, n, txt }) => {
  const f = useCurrentFrame();
  const u = sp(f, 0, 12, 140), o = 1 - ez((f - (d - 10)) / 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 60, top: 50, display: "flex", alignItems: "center", opacity: o, filter: "drop-shadow(0 16px 22px rgba(0,0,0,0.5))" }}>
        <div style={{ width: 190, height: 190, borderRadius: 95, background: RED, border: `8px solid ${PAPER}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${u}) rotate(${(1 - u) * -90}deg)`, zIndex: 2 }}>
          <Lbl txt="STEP" size={30} color={PAPER} ls={5} /><Ser txt={`${n}`} size={96} color="#fff" />
        </div>
        <div style={{ marginLeft: -40, background: PAPER, padding: "18px 40px 18px 70px", borderRadius: "0 12px 12px 0", clipPath: `inset(0 ${100 - 100 * ez((f - 6) / 12)}% 0 0)` }}>
          <Ser txt={txt} size={fit(txt, 900, 62, "serif")} color={INK} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
