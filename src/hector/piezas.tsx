// hector · piezas 2D del canal (todas en inglés, letra grande, se leen en el celular). Cada una entra con su frase (at)
// y sale en out. Paleta del lote: azul marino del cartel, coral, oro, crema de papel, rojo de lapicera, verde de "lo que decís".
// Las usan los 7 videos de Héctor (ver D:/rtmp/hector/MUNDO.md).
import React from "react";
import { Img, staticFile } from "remotion";
import { FONT, P, e, ei, extrude, spr } from "./lib";

export const HC = { navy: "#0f2a44", coral: "#ff6b4a", gold: "#ffd36b", cream: "#fbf8f1", ink: "#1c2433", red: "#c62828", green: "#2e9e62", white: "#fdf6e8", dim: "rgba(253,246,232,.72)" };
const pop = (t: number, at: number, out: number, sp = 1) => ({ k: Math.min(1, spr(t, at, sp)), o: e(t, at, at + 0.14) * (1 - e(t, out, out + 0.3)) });
const card: React.CSSProperties = { background: "linear-gradient(180deg, rgba(17,40,64,.97), rgba(9,22,38,.97))", boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.16)", borderRadius: 26, fontFamily: FONT, color: HC.white };
const paper: React.CSSProperties = { background: "linear-gradient(180deg,#fdfbf5,#f1ece0)", boxShadow: "0 40px 90px rgba(0,0,0,.6)", borderRadius: 6, fontFamily: FONT, color: HC.ink };
const typed = (s: string, t: number, a: number, cps = 32) => s.slice(0, Math.max(0, Math.round((t - a) * cps)));
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

// "QUESTION #3" + la pregunta del vendedor entre comillas + sello rojo DON'T ANSWER (sAt)
// low = va sobre el avatar: abajo y más chica, sin taparle la cara
export const QChapter: React.FC<{ t: number; at: number; out: number; n: number; q: string; sAt?: number; label?: string; stamp?: string; low?: boolean }> = ({ t, at, out, n, q, sAt, label = "QUESTION", stamp = "DON'T ANSWER", low = false }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  const sk = sAt ? Math.min(1.15, spr(t, sAt, 1.3)) : 0;
  return (
    <div style={{ position: "absolute", left: 960, top: low ? 850 : 520, opacity: o, transform: `translate(-50%,-50%) perspective(1600px) rotateX(${(1 - k) * 60}deg) scale(${(0.8 + 0.2 * k) * (low ? 0.72 : 1)})` }}>
      <div style={{ ...card, width: 1300, padding: "46px 70px 56px", textAlign: "center", borderTop: `12px solid ${HC.coral}` }}>
        <div style={{ fontWeight: 900, fontSize: 46, letterSpacing: 10, color: HC.coral }}>{label} #{n}</div>
        <div style={{ fontWeight: 800, fontSize: 82, lineHeight: 1.12, marginTop: 18, textShadow: extrude(4, "#000") }}>“{typed(q, t, at + 0.3, 40)}”</div>
      </div>
      {sAt && t >= sAt && <div style={{ position: "absolute", right: -40, bottom: -70, transform: `rotate(-9deg) scale(${2.2 - 1.2 * Math.min(1, sk)})`, opacity: Math.min(1, (t - sAt) * 8), border: `9px solid ${HC.red}`, color: HC.red, background: "rgba(253,246,232,.92)", fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: "8px 30px", borderRadius: 14, letterSpacing: 4 }}>{stamp}</div>}
    </div>
  );
};

// LO QUE DECÍS: tarjeta verde con la frase exacta, tipeada
export const SayThis: React.FC<{ t: number; at: number; out: number; text: string; head?: string; y?: number }> = ({ t, at, out, text, head = "WHAT YOU SAY", y = 800 }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 960, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - k) * 80}px)` }}>
      <div style={{ ...paper, borderRadius: 18, width: 1380, padding: "26px 46px 30px", borderLeft: `16px solid ${HC.green}` }}>
        <div style={{ fontWeight: 900, fontSize: 32, letterSpacing: 6, color: HC.green }}>✓ {head}</div>
        <div style={{ fontWeight: 800, fontSize: 56, lineHeight: 1.18, marginTop: 8 }}>“{typed(text, t, at + 0.25, 38)}”</div>
      </div>
    </div>
  );
};

// EL FOUR-SQUARE de Abe: 4 casillas, cada una se llena en su frase; hl = la casilla que importa (0 price,1 trade,2 down,3 payment)
export const FourSquare: React.FC<{ t: number; at: number; out: number; cells: { at: number; v: string }[]; hl?: number; hlAt?: number; x?: number; y?: number }> = ({ t, at, out, cells, hl = -1, hlAt = 1e9, x = 960, y = 540 }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  const L = ["PRICE", "TRADE-IN", "DOWN", "PAYMENT"];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1500px) rotateX(${12 + (1 - k) * 50}deg) rotateZ(-2deg) scale(${0.8 + 0.2 * k})` }}>
      <div style={{ width: 980, height: 760, background: "#f7e27a", borderRadius: 8, boxShadow: "0 50px 100px rgba(0,0,0,.6)", position: "relative", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 46px, rgba(60,110,190,.35) 46px 48px)" }}>
        <div style={{ position: "absolute", left: 488, top: 40, width: 8, height: 680, background: HC.ink, borderRadius: 4 }} />
        <div style={{ position: "absolute", top: 376, left: 40, height: 8, width: 900, background: HC.ink, borderRadius: 4 }} />
        {L.map((l, i) => { const c = cells[i]; const on = c && t >= c.at; const hi = i === hl && t >= hlAt;
          return <div key={i} style={{ position: "absolute", left: (i % 2) * 490 + 40, top: (i < 2 ? 0 : 380) + 40, width: 410, height: 300, fontFamily: "Georgia, serif", fontStyle: "italic", color: HC.ink }}>
            <div style={{ fontWeight: 700, fontSize: 46 }}>{l}</div>
            {on && <div style={{ fontWeight: 700, fontSize: 104, marginTop: 30, color: hi ? HC.red : HC.ink, transform: `scale(${Math.min(1.1, spr(t, c.at))})`, transformOrigin: "0 50%" }}>{c.v}</div>}
            {hi && <svg style={{ position: "absolute", left: -30, top: 70 }} width={460} height={230}><ellipse cx={230} cy={115} rx={215} ry={95} fill="none" stroke={HC.red} strokeWidth={8} strokeDasharray={1000} strokeDashoffset={1000 * (1 - e(t, hlAt, hlAt + 0.6))} /></svg>}
          </div>; })}
      </div>
    </div>
  );
};

// dos préstamos lado a lado: el pago parece igual, el total no (diffAt = aparece la diferencia en rojo)
export type Loan = { name: string; pay: number; months: number; apr?: string; extra?: string };
export const LoanCompare: React.FC<{ t: number; at: number; out: number; a: Loan; b: Loan; totAt: number; diffAt: number; head?: string }> = ({ t, at, out, a, b, totAt, diffAt, head }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  const col = (l: Loan, i: number) => { const tot = l.pay * l.months * ei(t, totAt + i * 0.4, totAt + i * 0.4 + 1.4);
    return <div style={{ ...card, width: 620, padding: "34px 40px", textAlign: "center", transform: `rotateY(${(i ? -1 : 1) * (8 + (1 - k) * 40)}deg)` }}>
      <div style={{ fontWeight: 900, fontSize: 40, color: i ? HC.coral : HC.gold, letterSpacing: 4 }}>{l.name}</div>
      <div style={{ fontWeight: 900, fontSize: 120, lineHeight: 1.05, marginTop: 10, textShadow: extrude(6, "#000") }}>{money(l.pay)}<span style={{ fontSize: 44 }}>/mo</span></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: HC.dim }}>{l.months} months{l.apr ? ` · ${l.apr}` : ""}</div>
      {l.extra && <div style={{ fontWeight: 800, fontSize: 32, color: HC.dim, marginTop: 4 }}>{l.extra}</div>}
      {t >= totAt && <div style={{ marginTop: 22, borderTop: "3px dashed rgba(255,255,255,.3)", paddingTop: 16 }}><div style={{ fontWeight: 800, fontSize: 30, color: HC.dim, letterSpacing: 4 }}>YOU PAY IN TOTAL</div><div style={{ fontWeight: 900, fontSize: 86 }}>{money(tot)}</div></div>}
    </div>; };
  const d = Math.abs(b.pay * b.months - a.pay * a.months);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, perspective: 1800 }}>
      {head && <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: HC.white, letterSpacing: 3, textShadow: extrude(5, "#000") }}>{head}</div>}
      <div style={{ position: "absolute", top: head ? 190 : 140, width: "100%", display: "flex", justifyContent: "center", gap: 70 }}>{col(a, 0)}{col(b, 1)}</div>
      {t >= diffAt && <div style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 92, color: HC.white, transform: `scale(${Math.min(1.1, spr(t, diffAt))})` }}>
        <span style={{ background: HC.red, padding: "6px 34px", borderRadius: 16 }}>{money(d * ei(t, diffAt, diffAt + 1.2))} MORE</span></div>}
    </div>
  );
};

// la orden de compra (buyer's order): renglones que se imprimen; los de x = true se tachan en rojo en xAt
export const BuyersOrder: React.FC<{ t: number; out: number; rows: { at: number; item: string; v: number; x?: boolean }[]; xAt?: number; totalAt: number; x?: number; y?: number; title?: string }> = ({ t, out, rows, xAt = 1e9, totalAt, x = 960, y = 540, title = "BUYER'S ORDER" }) => {
  const o = e(t, rows[0].at - 0.3, rows[0].at) * (1 - e(t, out, out + 0.3)); if (o < 0.01) return null;
  const shown = rows.filter((r) => t >= r.at);
  const sum = shown.reduce((a, r) => a + (r.x && t >= xAt + 0.6 ? 0 : r.v), 0);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%) perspective(1500px) rotateY(-10deg) rotateZ(1deg)" }}>
      <div style={{ ...paper, width: 900, padding: "34px 46px", fontFamily: "'Courier New', monospace" }}>
        <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: 6, textAlign: "center", borderBottom: "3px solid #1c2433", paddingBottom: 10 }}>{title}</div>
        <div style={{ fontSize: 22, textAlign: "center", color: "#666", marginTop: 4, fontWeight: 700 }}>BIRD ROAD AUTO PLAZA · MIAMI, FL</div>
        {shown.map((r, i) => { const xk = r.x ? e(t, xAt + i * 0.12, xAt + i * 0.12 + 0.35) : 0;
          return <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", fontSize: 40, fontWeight: 700, lineHeight: "62px", opacity: e(t, r.at, r.at + 0.15), color: r.x && xk > 0.5 ? "#8a8a8a" : HC.ink }}>
            <span>{r.item}</span><span>{money(r.v)}</span>
            {xk > 0 && <div style={{ position: "absolute", left: -10, top: 30, height: 7, width: `${xk * 104}%`, background: HC.red, borderRadius: 4, transform: "rotate(-1.2deg)" }} />}
          </div>; })}
        {t >= totalAt && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 56, fontWeight: 900, borderTop: "3px dashed #999", marginTop: 12, paddingTop: 12, color: HC.red }}><span>TOTAL</span><span>{money(sum)}</span></div>}
      </div>
    </div>
  );
};

// el recuadro federal (Truth in Lending): APR · FINANCE CHARGE · AMOUNT FINANCED · TOTAL OF PAYMENTS; hl se enmarca
export const TilaBox: React.FC<{ t: number; at: number; out: number; v: [string, string, string, string]; hl?: number; hlAt?: number }> = ({ t, at, out, v, hl = -1, hlAt = 1e9 }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  const L = [["ANNUAL PERCENTAGE RATE", "the cost of your credit as a yearly rate"], ["FINANCE CHARGE", "the dollar amount the credit will cost you"], ["AMOUNT FINANCED", "the amount of credit provided to you"], ["TOTAL OF PAYMENTS", "what you will have paid after all payments"]];
  return (
    <div style={{ position: "absolute", left: 960, top: 540, opacity: o, transform: `translate(-50%,-50%) perspective(1600px) rotateX(${8 + (1 - k) * 50}deg)` }}>
      <div style={{ ...paper, padding: 30, display: "flex", gap: 0, fontFamily: "Arial, sans-serif" }}>
        {L.map(([h, d], i) => { const hi = i === hl && t >= hlAt;
          return <div key={i} style={{ width: 400, border: `${hi ? 8 : 3}px solid ${hi ? HC.red : HC.ink}`, marginLeft: i ? -3 : 0, padding: "22px 20px", textAlign: "center", background: hi ? "rgba(198,40,40,.07)" : "transparent", transform: hi ? `scale(${1 + 0.06 * e(t, hlAt, hlAt + 0.3)})` : undefined, position: "relative", zIndex: hi ? 2 : 1 }}>
            <div style={{ fontWeight: 900, fontSize: 30, lineHeight: 1.1 }}>{h}</div>
            <div style={{ fontSize: 22, color: "#555", marginTop: 8, minHeight: 56 }}>{d}</div>
            <div style={{ fontWeight: 900, fontSize: 64, marginTop: 14, color: hi ? HC.red : HC.ink }}>{t >= at + 0.5 + i * 0.3 ? v[i] : ""}</div>
          </div>; })}
      </div>
    </div>
  );
};

// mapa de Miami estilizado: pins que caen en su frase (barrios del canal)
const HOODS: Record<string, [number, number]> = { "Bird Road": [880, 640], Hialeah: [760, 380], "Little Havana": [960, 560], "Sunny Isles": [1180, 170], Aventura: [1120, 120], Pinecrest: [840, 790], Kendall: [700, 820], "Coral Gables": [880, 700], Westchester: [690, 640], "Miami Beach": [1220, 430], Doral: [620, 470], "Coconut Grove": [990, 680], Homestead: [560, 1010] };
export const MiamiMap: React.FC<{ t: number; at: number; out: number; pins: { at: number; n: string; sub?: string }[] }> = ({ t, at, out, pins }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.3)); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: "#0b1d30" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: `scale(${1.08 - 0.08 * ei(t, at, at + 3)})` }}>
        <path d="M0 0 L1080 0 C1100 200 1060 330 1100 460 C1130 600 1090 760 1040 900 C980 1000 900 1060 860 1080 L0 1080 Z" fill="#e9e1cf" />
        <path d="M1150 60 C1190 240 1200 420 1240 560 L1270 560 C1230 400 1220 220 1180 60 Z" fill="#e9e1cf" />
        {Array.from({ length: 14 }, (_, i) => <line key={i} x1={0} y1={80 + i * 72} x2={1080 - Math.abs(7 - i) * 6} y2={80 + i * 72} stroke="rgba(15,42,68,.12)" strokeWidth={3} />)}
        {Array.from({ length: 14 }, (_, i) => <line key={"v" + i} x1={60 + i * 74} y1={0} x2={60 + i * 74} y2={1080} stroke="rgba(15,42,68,.12)" strokeWidth={3} />)}
        <path d="M80 660 L1060 640" stroke="#ff6b4a" strokeWidth={9} opacity={0.75} />
        <text x={110} y={645} fontFamily={FONT} fontWeight={900} fontSize={26} fill="#c4462c" letterSpacing={4}>BIRD ROAD</text>
        <text x={1500} y={600} fontFamily={FONT} fontWeight={900} fontSize={44} fill="rgba(159,203,232,.6)" letterSpacing={10}>ATLANTIC</text>
        <text x={520} y={60} fontFamily={FONT} fontWeight={900} fontSize={34} fill="rgba(15,42,68,.55)" letterSpacing={12}>MIAMI-DADE</text>
      </svg>
      {pins.filter((p) => t >= p.at).map((p, i) => { const q = HOODS[p.n] ?? [900, 540], k = Math.min(1, spr(t, p.at, 1.1));
        return <div key={i} style={{ position: "absolute", left: q[0], top: q[1], transform: `translate(-50%,-100%) translateY(${(1 - k) * -120}px)`, opacity: Math.min(1, (t - p.at) * 6), textAlign: "center", fontFamily: FONT }}>
          <div style={{ background: HC.navy, color: HC.white, fontWeight: 900, fontSize: 36, padding: "8px 20px", borderRadius: 12, whiteSpace: "nowrap", boxShadow: "0 16px 30px rgba(0,0,0,.4)" }}>{p.n}{p.sub && <div style={{ fontSize: 24, color: HC.gold, fontWeight: 800 }}>{p.sub}</div>}</div>
          <svg width={40} height={50}><path d="M20 50 L4 18 A17 17 0 1 1 36 18 Z" fill={HC.coral} /><circle cx={20} cy={17} r={7} fill="#fff" /></svg>
        </div>; })}
    </div>
  );
};

// el año y el lugar de la historia (sello de época)
export const YearStamp: React.FC<{ t: number; at: number; out: number; year: string; place: string; x?: number; y?: number }> = ({ t, at, out, year, place, x = 360, y = 190 }) => {
  const { k, o } = pop(t, at, out, 0.9); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${-4 + (1 - k) * -20}deg) scale(${1.6 - 0.6 * k})` }}>
      <div style={{ ...paper, padding: "16px 34px 18px", borderRadius: 10, border: `6px solid ${HC.navy}`, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 92, lineHeight: 1, color: HC.navy, letterSpacing: 2 }}>{year}</div>
        <div style={{ fontWeight: 800, fontSize: 30, color: HC.coral, letterSpacing: 5, marginTop: 6 }}>{place}</div>
      </div>
    </div>
  );
};

// la frase de un personaje (cita con nombre)
export const QuoteCard: React.FC<{ t: number; at: number; out: number; text: string; who: string; x?: number; y?: number; w?: number }> = ({ t, at, out, text, who, x = 960, y = 540, w = 1240 }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1400px) rotateY(${(1 - k) * 40 - 3}deg)` }}>
      <div style={{ ...card, width: w, padding: "40px 60px" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 150, lineHeight: 0.6, color: HC.coral, height: 60 }}>“</div>
        <div style={{ fontWeight: 800, fontSize: 66, lineHeight: 1.18 }}>{typed(text, t, at + 0.2, 36)}</div>
        <div style={{ fontWeight: 900, fontSize: 36, color: HC.gold, marginTop: 18, letterSpacing: 4 }}>— {who}</div>
      </div>
    </div>
  );
};

// número que cuenta de "from" a "to" con su rótulo (plata que se va)
export const MoneyCounter: React.FC<{ t: number; at: number; out: number; from?: number; to: number; label: string; sub?: string; dur?: number; col?: string; x?: number; y?: number }> = ({ t, at, out, from = 0, to, label, sub, dur = 1.8, col = HC.white, x = 960, y = 520 }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const v = from + (to - from) * ei(t, at + 0.15, at + 0.15 + dur);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, textAlign: "center", fontFamily: FONT }}>
      <div style={{ fontWeight: 900, fontSize: 44, color: HC.gold, letterSpacing: 8, textShadow: extrude(3, "#000") }}>{label}</div>
      <div style={{ fontWeight: 900, fontSize: 230, lineHeight: 1, color: col, textShadow: extrude(9, "#000") }}>{money(v)}</div>
      {sub && <div style={{ fontWeight: 800, fontSize: 42, color: HC.dim, marginTop: 8, textShadow: extrude(3, "#000") }}>{sub}</div>}
    </div>
  );
};

// el menú de F&I: 4 paquetes, cada uno con su pago; hl = el que "te empujan"
export const MenuBoard: React.FC<{ t: number; at: number; out: number; pk: { n: string; pay: string; items: string[] }[]; hl?: number; hlAt?: number }> = ({ t, at, out, pk, hl = 0, hlAt = 1e9 }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3)); if (o < 0.01) return null;
  const cols = [HC.ink, "#b8893a", "#4b6a88", "#8a8a8a"];
  return (
    <div style={{ position: "absolute", left: 960, top: 540, opacity: o, transform: "translate(-50%,-50%) perspective(1600px) rotateX(10deg)" }}>
      <div style={{ ...paper, padding: 26, display: "flex", gap: 18 }}>
        {pk.map((p, i) => { const a = at + 0.2 + i * 0.25, kk = Math.min(1, spr(t, a)), hi = i === hl && t >= hlAt;
          return <div key={i} style={{ width: 360, opacity: Math.min(1, (t - a) * 5), transform: `translateY(${(1 - kk) * 60}px) scale(${hi ? 1 + 0.05 * e(t, hlAt, hlAt + 0.3) : 1})`, border: hi ? `7px solid ${HC.red}` : "3px solid #ddd", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
            <div style={{ background: cols[i % 4], color: "#fff", fontWeight: 900, fontSize: 38, textAlign: "center", padding: "14px 0", letterSpacing: 3 }}>{p.n}</div>
            <div style={{ padding: "16px 20px", minHeight: 300 }}>{p.items.map((it, j) => <div key={j} style={{ fontWeight: 700, fontSize: 28, lineHeight: "44px" }}><span style={{ color: HC.green, fontWeight: 900 }}>✓ </span>{it}</div>)}</div>
            <div style={{ textAlign: "center", fontWeight: 900, fontSize: 56, color: HC.red, paddingBottom: 14 }}>{p.pay}</div>
          </div>; })}
      </div>
    </div>
  );
};

// la calculadora gris: los números se tipean y el resultado aparece
export const Calc: React.FC<{ t: number; at: number; out: number; keys: string; res: string; resAt: number; note?: string; x?: number; y?: number }> = ({ t, at, out, keys, res, resAt, note, x = 1420, y = 540 }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const shown = t >= resAt ? res : typed(keys, t, at + 0.3, 9);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(-16deg) rotateX(8deg) scale(${0.75 + 0.25 * k})` }}>
      <div style={{ width: 520, background: "linear-gradient(180deg,#a3a7ad,#7f838a)", borderRadius: 34, padding: 34, boxShadow: "0 50px 90px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.4)" }}>
        <div style={{ background: "#b9c7a5", borderRadius: 12, height: 130, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 26px", fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 76, color: "#1e2618", boxShadow: "inset 0 4px 10px rgba(0,0,0,.35)", overflow: "hidden", whiteSpace: "nowrap" }}>{shown || "0"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 26 }}>
          {"789÷456×123−0.=+".split("").map((c, i) => <div key={i} style={{ height: 78, borderRadius: 14, background: "=+−×÷".includes(c) ? "#5b5f66" : "#e8e6e0", color: "=+−×÷".includes(c) ? "#fff" : HC.ink, fontFamily: FONT, fontWeight: 900, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 5px 0 rgba(0,0,0,.35)" }}>{c}</div>)}
        </div>
      </div>
      {note && t >= resAt && <div style={{ position: "absolute", left: "50%", top: -70, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: HC.white, background: HC.red, padding: "6px 24px", borderRadius: 12, whiteSpace: "nowrap" }}>{note}</div>}
    </div>
  );
};

// la libreta azul de los Alvarez (o la de Héctor): renglones a mano que se escriben
export const Notebook: React.FC<{ t: number; at: number; out: number; title?: string; rows: { at: number; tx: string; red?: boolean }[]; x?: number; y?: number }> = ({ t, at, out, title, rows, x = 960, y = 540 }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1500px) rotateX(${20 + (1 - k) * 40}deg) rotateZ(-3deg)` }}>
      <div style={{ width: 1060, background: "#1f4f8f", borderRadius: 16, padding: 18, boxShadow: "0 50px 100px rgba(0,0,0,.6)" }}>
        <div style={{ background: "#fbf8ef", borderRadius: 6, padding: "30px 50px 40px 110px", minHeight: 520, position: "relative", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 70px, rgba(60,110,190,.35) 70px 72px)" }}>
          <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, width: 3, background: "rgba(200,60,60,.6)" }} />
          {title && <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 700, fontSize: 52, color: HC.ink, height: 72 }}>{title}</div>}
          {rows.filter((r) => t >= r.at).map((r, i) => <div key={i} style={{ fontFamily: "'Segoe Print', 'Comic Sans MS', cursive", fontWeight: 700, fontSize: 46, lineHeight: "72px", color: r.red ? HC.red : "#1a2c66" }}>{typed(r.tx, t, r.at, 30)}</div>)}
        </div>
      </div>
    </div>
  );
};

// lista que se tilda (recap / "lo que llevás") ; no = renglón con cruz roja
export const Checklist: React.FC<{ t: number; out: number; head: string; rows: { at: number; tx: string; no?: boolean }[]; x?: number; y?: number; w?: number }> = ({ t, out, head, rows, x = 960, y = 540, w = 1200 }) => {
  const o = e(t, rows[0].at - 0.4, rows[0].at - 0.1) * (1 - e(t, out, out + 0.3)); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%) perspective(1500px) rotateY(-6deg)" }}>
      <div style={{ ...paper, width: w, padding: "34px 50px", borderRadius: 14, borderTop: `14px solid ${HC.navy}` }}>
        <div style={{ fontWeight: 900, fontSize: 48, letterSpacing: 4, color: HC.navy, marginBottom: 10 }}>{head}</div>
        {rows.map((r, i) => { const on = t >= r.at, ck = e(t, r.at, r.at + 0.25);
          return <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, fontWeight: 800, fontSize: rows.length > 8 ? 36 : 44, lineHeight: rows.length > 8 ? "56px" : "70px", opacity: on ? 1 : 0.22 }}>
            <div style={{ width: 46, height: 46, borderRadius: 10, border: `4px solid ${r.no ? HC.red : HC.green}`, display: "flex", alignItems: "center", justifyContent: "center", color: r.no ? HC.red : HC.green, fontSize: 38, fontWeight: 900, transform: `scale(${on ? 0.6 + 0.4 * ck : 1})` }}>{on ? (r.no ? "✕" : "✓") : ""}</div>
            <span>{r.tx}</span></div>; })}
      </div>
    </div>
  );
};

// el reloj de la concesionaria: las horas que pasan (from → to, en minutos del día)
export const LotClock: React.FC<{ t: number; at: number; out: number; from: number; to: number; dur?: number; label?: string; x?: number; y?: number }> = ({ t, at, out, from, to, dur = 2.4, label, x = 1500, y = 380 }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const m = from + (to - from) * ei(t, at + 0.2, at + 0.2 + dur), hh = Math.floor(m / 60) % 12 || 12, mm = Math.floor(m % 60);
  const ap = Math.floor(m / 60) >= 12 ? "PM" : "AM", el = m - from;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, textAlign: "center", fontFamily: FONT }}>
      <svg width={360} height={360}><circle cx={180} cy={180} r={165} fill={HC.cream} stroke={HC.navy} strokeWidth={16} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={180} y1={30} x2={180} y2={58} stroke={HC.navy} strokeWidth={8} transform={`rotate(${i * 30} 180 180)`} />)}
        <line x1={180} y1={180} x2={180} y2={92} stroke={HC.navy} strokeWidth={14} strokeLinecap="round" transform={`rotate(${(m / 60) * 30} 180 180)`} />
        <line x1={180} y1={180} x2={180} y2={52} stroke={HC.coral} strokeWidth={8} strokeLinecap="round" transform={`rotate(${(m % 60) * 6} 180 180)`} />
        <circle cx={180} cy={180} r={12} fill={HC.navy} /></svg>
      <div style={{ fontWeight: 900, fontSize: 64, color: HC.white, textShadow: extrude(5, "#000") }}>{hh}:{String(mm).padStart(2, "0")} {ap}</div>
      <div style={{ fontWeight: 800, fontSize: 36, color: HC.gold, textShadow: extrude(3, "#000") }}>{label ?? `${Math.floor(el / 60)} h ${Math.round(el % 60)} min on the lot`}</div>
    </div>
  );
};

// cierre: SUSCRIBITE + la pregunta concreta + el próximo video (sin URL, sin guía)
export const EndCard: React.FC<{ t: number; at: number; out: number; q: string; next: string; qAt?: number; nAt?: number }> = ({ t, at, out, q, next, qAt = at + 0.8, nAt = at + 2.2 }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.4)); if (o < 0.01) return null;
  const sk = Math.min(1, spr(t, at + 0.2));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 960, top: 180, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * sk})`, background: "#e62117", color: "#fff", fontWeight: 900, fontSize: 70, padding: "16px 56px", borderRadius: 18, letterSpacing: 4, boxShadow: "0 20px 50px rgba(0,0,0,.5)" }}>SUBSCRIBE</div>
      {t >= qAt && <div style={{ position: "absolute", left: 960, top: 450, transform: "translate(-50%,-50%)", ...card, width: 1400, padding: "30px 50px", textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 34, color: HC.gold, letterSpacing: 6 }}>💬 IN THE COMMENTS</div>
        <div style={{ fontWeight: 800, fontSize: 56, lineHeight: 1.2, marginTop: 8 }}>{typed(q, t, qAt + 0.2, 40)}</div></div>}
      {t >= nAt && <div style={{ position: "absolute", left: 960, top: 800, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, spr(t, nAt))) * 100}px)`, ...paper, borderRadius: 18, width: 1300, padding: "24px 44px", borderLeft: `16px solid ${HC.coral}` }}>
        <div style={{ fontWeight: 900, fontSize: 30, color: HC.coral, letterSpacing: 6 }}>▶ WATCH NEXT</div>
        <div style={{ fontWeight: 900, fontSize: 52, lineHeight: 1.15, marginTop: 6 }}>{next}</div></div>}
    </div>
  );
};

// CTA de la guía paga: el libro (tapa real) se abre en 3D sobre una página REAL del PDF + QR grande a la URL corta.
// En pantalla nunca la URL: sólo el nombre y "link in the first line of the description". pag = g_<pag>.jpg en public/<slug>/
export const GuideCTA: React.FC<{ t: number; at: number; out: number; pag: string; note?: string }> = ({ t, at, out, pag, note }) => {
  const o = e(t, at, at + 0.35) * (1 - e(t, out, out + 0.4)); if (o < 0.01) return null;
  const bk = Math.min(1, spr(t, at + 0.1, 0.9)), open = ei(t, at + 1.0, at + 2.3), qk = Math.min(1, spr(t, at + 1.8)), sk = Math.min(1, spr(t, at + 2.9, 1.2));
  const W = 500, H = 750;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, fontFamily: FONT, background: "radial-gradient(ellipse at 40% 45%, rgba(15,42,68,.86), rgba(5,12,22,.95))" }}>
      <div style={{ position: "absolute", left: 960, top: 92, transform: "translate(-50%,-50%)", textAlign: "center", width: 1700 }}>
        <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 9, color: HC.coral }}>MY 5 BOOKS OF DEALER SCRIPTS</div>
        <div style={{ fontWeight: 900, fontSize: 76, color: HC.white, textShadow: extrude(4, "#000"), marginTop: 4 }}>The Other Side of the Desk</div>
      </div>
      <div style={{ position: "absolute", left: 560, top: 570, width: W * 2, height: H, transform: `translate(-25%,-50%) perspective(2200px) rotateX(${8 - 8 * bk}deg) rotateY(${-18 + 10 * open}deg) translateY(${(1 - bk) * 300}px) scale(${0.8 + 0.2 * bk})`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", left: W * 0.5, top: 0, width: W, height: H, background: "#fdfbf5", boxShadow: "0 50px 100px rgba(0,0,0,.65)", borderRadius: "0 8px 8px 0", overflow: "hidden" }}>
          <Img src={staticFile(P + "g_" + pag + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        </div>
        <div style={{ position: "absolute", left: W * 0.5, top: 0, width: W, height: H, transformOrigin: "left center", transform: `rotateY(${-165 * open}deg)`, transformStyle: "preserve-3d" }}>
          <Img src={staticFile(P + "g_tapa.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "0 8px 8px 0", backfaceVisibility: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,.65)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#e9e2d2,#f7f3ea)", transform: "rotateY(180deg)", backfaceVisibility: "hidden", borderRadius: "8px 0 0 8px" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1480, top: 520, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * qk})`, opacity: Math.min(1, qk * 1.5), textAlign: "center" }}>
        <div style={{ background: "#fff", padding: 26, borderRadius: 26, boxShadow: "0 40px 90px rgba(0,0,0,.6)", border: `10px solid ${HC.gold}` }}>
          <Img src={staticFile(P + "g_qr.png")} style={{ width: 470, height: 470, display: "block" }} />
        </div>
        <div style={{ fontWeight: 900, fontSize: 38, color: HC.gold, marginTop: 22, whiteSpace: "nowrap", textShadow: extrude(3, "#000") }}>📱 Scan it with your phone camera</div>
      </div>
      <div style={{ position: "absolute", left: 1480, top: 915, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * sk})`, opacity: Math.min(1, sk * 1.5), background: HC.green, color: "#fff", fontWeight: 900, fontSize: 36, padding: "12px 28px", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>{note ?? "Save $3,000–$8,000 on your next car"}</div>
      <div style={{ position: "absolute", left: 960, top: 1028, transform: "translate(-50%,-50%)", fontWeight: 800, fontSize: 40, color: HC.white, opacity: e(t, at + 2.2, at + 2.6), textShadow: extrude(3, "#000") }}>Link in the first line of the description ↓</div>
    </div>
  );
};
