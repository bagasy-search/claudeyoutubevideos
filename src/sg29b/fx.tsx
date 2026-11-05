// sg29b · v3 — tras 3 vueltas del EVALUADOR sin llegar a 8, cada componente se REEMPLAZA por algo más simple e impecable:
// el héroe es una FOTO real de ese momento (se entiende sin leer), grande, con UNA acción clara anclada a la frase
// (sello, contador, ✓/✗, cota que se traza, lista, antes/después, pregunta, medidor...). Textos grandes en píldora, zona segura.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BRUSH, COL, FONT, cl, e, lerp, rnd, sm, spr } from "../sg29kit/k";

type AtF = (ph: string, after?: number) => number;
export type FxP = { t: number; a: number; b: number };
const P = (id: string) => staticFile(`img/sg29b/${id}.jpg`);
const abs = (x: number, y: number, w?: number, h?: number): React.CSSProperties => ({ position: "absolute", left: x, top: y, width: w, height: h });
const GREEN = "#3f9a4a";

// fondo: la foto héroe desenfocada y oscura (nada de piso de plantilla)
const Bg: React.FC<{ id: string; t: number; a: number }> = ({ id, t, a }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#120e0a" }}>
    <Img src={P(id)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(22px) brightness(.42) saturate(.9)", transform: `scale(${1.15 + (t - a) * 0.006})` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255,230,190,.10), transparent 70%)" }} />
  </AbsoluteFill>
);
// la foto como copia en papel con borde blanco, sombra real, entrada con resorte y Ken Burns lento adentro
const Card: React.FC<{ id: string; t: number; t0: number; x: number; y: number; w: number; h: number; rot?: number; from?: "down" | "left" | "right" | "up" | "drop"; o?: number; zx?: number; zy?: number; z?: number; children?: React.ReactNode }> = ({ id, t, t0, x, y, w, h, rot = 0, from = "down", o = 1, zx = 50, zy = 50, z = 1, children }) => {
  const q = spr(t, t0, 1.0), d = 1 - Math.min(1.1, q), vis = cl((t - t0) / 0.1) * o;
  if (vis <= 0) return null;
  const tr = from === "left" ? `translateX(${d * -700}px)` : from === "right" ? `translateX(${d * 700}px)` : from === "up" ? `translateY(${d * -700}px)` : from === "drop" ? `translateY(${d * -500}px) scale(${1 + d * 0.25})` : `translateY(${d * 600}px)`;
  const kb = 1.04 + cl((t - t0) / 12) * 0.08;
  return <div style={{ ...abs(x - w / 2, y - h / 2, w, h), opacity: vis, transform: `${tr} rotate(${rot + d * 9}deg)`, background: "#f7f2e7", padding: 14, boxSizing: "border-box", borderRadius: 6, boxShadow: "0 40px 70px rgba(0,0,0,.6), 0 8px 18px rgba(0,0,0,.45)" }}>
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: 2 }}>
      <Img src={P(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb * z})`, transformOrigin: `${zx}% ${zy}%` }} />
      {children}
    </div>
  </div>;
};
// píldora de texto grande (siempre horizontal, alto contraste)
const Cap: React.FC<{ t: number; t0: number; x: number; y: number; size?: number; col?: string; bg?: string; children: React.ReactNode; w?: number }> = ({ t, t0, x, y, size = 64, col = COL.cream, bg = "rgba(22,16,10,.88)", children, w }) => {
  size = Math.round(size * 1.65); const q = Math.min(1.06, spr(t, t0, 1.2)); if (t < t0) return null;
  const bot = y >= 760;
  return <div style={{ ...abs(x - (w ?? 1500) / 2, bot ? undefined : y, w ?? 1500), bottom: bot ? Math.max(40, 1080 - y - size * 1.4) : undefined, display: "flex", justifyContent: "center", alignItems: "flex-end", opacity: cl((t - t0) / 0.1) }}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color: col, background: bg, padding: `${size * 0.16}px ${size * 0.45}px ${size * 0.22}px`, borderRadius: size * 0.3, boxShadow: "0 16px 34px rgba(0,0,0,.55)", whiteSpace: "normal", textAlign: "center", maxWidth: (w ?? 1500), lineHeight: 1.08, transform: `scale(${0.75 + 0.25 * q})` }}>{children}</div>
  </div>;
};
// sello que cae y golpea (escala 2,2 → 1 con temblor corto)
const Stamp: React.FC<{ t: number; t0: number; x: number; y: number; text: string; rot?: number; size?: number; col?: string; maxW?: number }> = ({ t, t0, x, y, text, rot = -12, size = 92, col = COL.red, maxW = 1100 }) => {
  size = Math.min(size, (maxW * 0.8) / (text.length * 0.64 + 0.9)); if (t < t0) return null; const k = cl((t - t0) / 0.16), sc = lerp(2.3, 1, sm(k)), sh = k >= 1 ? Math.sin((t - t0) * 60) * 6 * Math.exp(-(t - t0 - 0.16) * 14) : 0;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateX(${sh}px) rotate(${rot}deg) scale(${sc})`, opacity: k, fontFamily: FONT, fontWeight: 800, fontSize: size, color: col, border: `${size * 0.1}px solid ${col}`, borderRadius: size * 0.18, padding: `${size * 0.02}px ${size * 0.3}px ${size * 0.08}px`, whiteSpace: "nowrap", letterSpacing: 4, background: "rgba(255,248,236,.86)", boxShadow: "0 10px 24px rgba(0,0,0,.4)", mixBlendMode: "normal" }}>{text}</div>;
};
// insignia redonda ✓ / ✗
const Badge: React.FC<{ t: number; t0: number; x: number; y: number; ok: boolean; r?: number }> = ({ t, t0, x, y, ok, r = 104 }) => {
  if (t < t0) return null; const q = Math.min(1.12, spr(t, t0, 1.3));
  return <div style={{ ...abs(x - r, y - r, r * 2, r * 2), borderRadius: "50%", background: ok ? GREEN : COL.red, border: "8px solid #fff", boxShadow: "0 14px 30px rgba(0,0,0,.5)", transform: `scale(${q})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: r * 1.25, lineHeight: 1 }}>{ok ? "✓" : "✕"}</div>;
};
// contador ODÓMETRO: cada dígito es un tambor que gira con inercia
const Count: React.FC<{ t: number; t0: number; v0: number; v1: number; dur?: number; pre?: string; suf?: string; x: number; y: number; size?: number; col?: string }> = ({ t, t0, v0, v1, dur = 1.6, pre = "", suf = "", x, y, size = 230, col = COL.gold }) => {
  if (t < t0 - 0.3) return null; const k = sm(cl((t - t0) / dur)), v = lerp(v0, v1, k), nd = String(v1).length, H = size * 1.12, Wd = size * 0.68;
  const pop = k >= 1 ? 1 + 0.06 * Math.exp(-(t - t0 - dur) * 6) * Math.sin((t - t0 - dur) * 20) : 1;
  const txt = (c: string) => <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.8, color: col, textShadow: "0 6px 0 #3a2a14", padding: "0 8px" }}>{c}</div>;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${pop})`, display: "flex", alignItems: "center", opacity: cl((t - t0 + 0.3) / 0.2) }}>
    {pre && txt(pre)}
    <div style={{ display: "flex", gap: 8, padding: 12, background: "linear-gradient(#2a2018,#120d08)", borderRadius: 18, boxShadow: "0 24px 50px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.12)" }}>
      {Array.from({ length: nd }, (_, i) => { const p = Math.pow(10, nd - 1 - i), d = (i === nd - 1 ? v : Math.floor(v / p) + Math.max(0, (v % p) - (p - 1))) / (i === nd - 1 ? 1 : 1) % 10;
        return <div key={i} style={{ width: Wd, height: H, overflow: "hidden", borderRadius: 10, background: "linear-gradient(#f4ecd8 0%, #fffaf0 45%, #d9cdb0 100%)", boxShadow: "inset 0 14px 18px rgba(0,0,0,.35), inset 0 -14px 18px rgba(0,0,0,.35)" }}>
          <div style={{ transform: `translateY(${-d * H}px)` }}>{Array.from({ length: 11 }, (_, n) => <div key={n} style={{ height: H, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.82, color: "#1b1712" }}>{n % 10}</div>)}</div></div>; })}
    </div>
    {suf && txt(suf)}
  </div>;
};

export const mkFx = (_Stage: unknown, at: AtF, _atEnd: AtF) => {
  let CA = 0, CB = 0, CN = 0, LAST = 0;
  const A = (ph: string, a: number) => {
    if (a !== CA) { CA = a; CB = a + 10; CN = 0; LAST = a; }
    const slot = Math.max(1.1, Math.min(2.4, (CB - a - 1.6) / 3)), fb = a + 0.5 + CN * slot; CN++;
    let r = fb;
    try { const t0 = at(ph, a - 20); if (t0 >= a + 0.2 && t0 < CB - 0.8) r = t0; } catch { /* turno */ }
    if (CN > 1) r = Math.max(r, LAST + 0.7);
    r = Math.min(r, CB - 0.8); LAST = r; return r;
  };
  const W = (C: React.FC<FxP>): React.FC<FxP> => (p) => { CA = p.a; CB = p.b; CN = 0; LAST = p.a; return (C as (q: FxP) => React.ReactElement)(p); };
  // salida común: se aleja y se funde
  const Out: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => {
    const qi = e(t, a - 0.02, a + 0.22), qo = e(t, b - 0.6, b - 0.05);
    return <AbsoluteFill style={{ opacity: qi * (1 - qo), transform: `scale(${(0.96 + 0.04 * qi) * (1 - 0.05 * qo)})`, filter: qo > 0.01 ? `blur(${qo * 8}px)` : undefined }}>{children}</AbsoluteFill>;
  };

  // ---- M1 · SELLO sobre una o varias fotos ----
  const mkStamp = (bg: string, cards: { id: string; ph: string; stamp: string; lab?: string }[], cap?: [string, string]) => W(({ t, a, b }) => {
    const n = cards.length, cw = n === 1 ? 1200 : n === 2 ? 720 : n === 3 ? 500 : 330, ch = n === 1 ? 680 : n <= 3 ? cw * 0.7 : 430, gap = n === 1 ? 0 : (1600 - cw * n) / (n - 1);
    const ts = cards.map((c) => A(c.ph, a)); const tc = cap ? A(cap[0], a) : 0;
    return <><Bg id={bg} t={t} a={a} /><Out t={t} a={a} b={b}>
      {cards.map((c, i) => { const x = n === 1 ? 960 : 160 + cw / 2 + i * (cw + gap), y = n === 1 ? 470 : 470; const t0 = n === 1 ? a : a + i * 0.12;
        return <React.Fragment key={i}><Card id={c.id} t={t} t0={t0} x={x} y={y} w={cw} h={ch} rot={(i % 2 ? 2 : -2)} from="down" />
          <Stamp t={t} t0={ts[i]} x={x} y={y + (n === 1 ? 40 : 10)} text={c.stamp} size={n === 1 ? 130 : n <= 3 ? 90 : 64} rot={-8 + (i % 3) * 5} maxW={cw} />
          {c.lab && <Cap t={t} t0={t0 + 0.3} x={x} y={y + ch / 2 + 26} size={n >= 4 ? 44 : 56} w={cw + 40}>{c.lab}</Cap>}</React.Fragment>; })}
      {cap && <Cap t={t} t0={tc} x={960} y={n === 1 ? 850 : 830} size={70}>{cap[1]}</Cap>}
    </Out></>;
  });
  // ---- M2 · CONTADOR junto a la foto ----
  const mkCount = (id: string, ph: string, v0: number, v1: number, pre: string, suf: string, sub: [string, string], col = COL.gold) => W(({ t, a, b }) => {
    const t0 = A(ph, a), ts = A(sub[0], a);
    return <><Bg id={id} t={t} a={a} /><Out t={t} a={a} b={b}>
      <Card id={id} t={t} t0={a} x={560} y={520} w={760} h={620} rot={-2.5} from="left" />
      <Count t={t} t0={t0} v0={v0} v1={v1} pre={pre} suf={suf} x={1390} y={420} size={(pre + String(v1) + suf).length > 4 ? 220 : 300} col={col} />
      <Cap t={t} t0={ts} x={1390} y={600} size={54} w={720}>{sub[1]}</Cap>
    </Out></>;
  });
  // ---- M3 · DOS FOTOS ✓ / ✗ ----
  const mkSplit = (L: { id: string; ok: boolean; lab: string; ph: string }, R: { id: string; ok: boolean; lab: string; ph: string }, mid?: string) => W(({ t, a, b }) => {
    const tl = A(L.ph, a), tr = A(R.ph, a);
    return <><Bg id={R.id} t={t} a={a} /><Out t={t} a={a} b={b}>
      {[[L, 530, -2.5, a, tl], [R, 1390, 2.5, a + 0.15, tr]].map(([s, x, rot, t0, tb], i) => { const S = s as typeof L;
        return <React.Fragment key={i}><Card id={S.id} t={t} t0={t0 as number} x={x as number} y={470} w={760} h={540} rot={rot as number} from={i ? "right" : "left"} />
          <Badge t={t} t0={tb as number} x={(x as number) + 300} y={250} ok={S.ok} />
          <Cap t={t} t0={tb as number} x={x as number} y={770} size={58} w={820} col={S.ok ? "#e6f6dd" : "#ffe1da"} bg={S.ok ? "rgba(28,70,32,.92)" : "rgba(110,24,14,.92)"}>{S.lab}</Cap></React.Fragment>; })}
      {mid && <Cap t={t} t0={Math.max(tl, tr) + 0.6} x={960} y={900} size={56}>{mid}</Cap>}
    </Out></>;
  });
  // ---- M4 · TRES COPIAS repartidas una a una ----
  const mkTri = (bg: string, cs: { id: string; lab: string; ph: string }[], cap?: [string, string]) => W(({ t, a, b }) => {
    const ts = cs.map((c) => A(c.ph, a)), tc = cap ? A(cap[0], a) : 0;
    return <><Bg id={bg} t={t} a={a} /><Out t={t} a={a} b={b}>
      {cs.map((c, i) => { const x = 440 + i * 520, t0 = i === 0 ? Math.min(ts[0], a + 0.1) - 0.25 : ts[i] - 0.25;
        return <React.Fragment key={i}><Card id={c.id} t={t} t0={t0} x={x} y={450} w={480} h={560} rot={[-4, 1.5, 4][i]} from="drop" />
          <div style={{ ...abs(x - 200 - 50, 140, 100, 100), borderRadius: "50%", background: COL.red, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 66, display: "flex", alignItems: "center", justifyContent: "center", opacity: cl((t - t0 - 0.2) / 0.1), border: "5px solid #fff" }}>{i + 1}</div>
          <Cap t={t} t0={t0 + 0.3} x={x} y={760} size={52} w={520}>{c.lab}</Cap></React.Fragment>; })}
      {cap && <Cap t={t} t0={tc} x={960} y={880} size={60}>{cap[1]}</Cap>}
    </Out></>;
  });
  // ---- M5 · CÍRCULO trazado + la cámara se acerca al detalle ----
  const mkCircle = (id: string, cx: number, cy: number, ph: string, word: string, ph2?: string, word2?: string) => W(({ t, a, b }) => {
    const t0 = A(ph, a), t2 = ph2 ? A(ph2, a) : 0, z = 1 + 0.32 * e(t, t0 - 0.2, t0 + 1.0), dr = cl((t - t0) / 0.7);
    const X = 260 + 1400 * cx / 100, Y = 120 + 700 * cy / 100;
    return <><Bg id={id} t={t} a={a} /><Out t={t} a={a} b={b}>
      <Card id={id} t={t} t0={a} x={960} y={470} w={1400} h={700} rot={-1} from="down" zx={cx} zy={cy} z={z} />
      {t > t0 && <div style={{ ...abs(274, 134, 1372, 672), background: `radial-gradient(ellipse 300px 230px at ${X - 274}px ${Y - 134}px, rgba(255,236,190,${0.12 * dr}) 0%, rgba(0,0,0,0) 60%, rgba(8,6,4,${0.62 * dr}) 100%)`, pointerEvents: "none" }} />}
      <Cap t={t} t0={t0 + 0.5} x={960} y={850} size={66}>{word}</Cap>
      {word2 && <Cap t={t} t0={t2} x={960} y={130} size={52} bg="rgba(200,50,30,.92)">{word2}</Cap>}
    </Out></>;
  });
  // ---- M6 · COTA que se traza sobre la foto ----
  const mkMeasure = (id: string, ph: string, x: number, y0: number, y1: number, val: string, sub?: [string, string]) => W(({ t, a, b }) => {
    const t0 = A(ph, a), ts = sub ? A(sub[0], a) : 0, k = sm(cl((t - t0) / 0.8)), yy = lerp(y0, y1, k), dr = y1 > y0 ? 1 : -1;
    return <><Bg id={id} t={t} a={a} /><Out t={t} a={a} b={b}>
      <Card id={id} t={t} t0={a} x={860} y={480} w={1240} h={760} rot={-1.5} from="left" />
      {t > t0 && <svg width={1920} height={1080} style={abs(0, 0)}>
        <line x1={x - 40} x2={x + 40} y1={y0} y2={y0} stroke="#ffd23c" strokeWidth={10} strokeLinecap="round" />
        <line x1={x} x2={x} y1={y0} y2={yy} stroke="#ffd23c" strokeWidth={10} strokeLinecap="round" style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,.6))" }} />
        {k > 0.98 && <line x1={x - 40} x2={x + 40} y1={y1} y2={y1} stroke="#ffd23c" strokeWidth={10} strokeLinecap="round" />}
        <path d={`M${x - 22} ${y0 + 30 * dr} L${x} ${y0 + 4 * dr} L${x + 22} ${y0 + 30 * dr}`} stroke="#ffd23c" strokeWidth={8} fill="none" />
        {k > 0.98 && <path d={`M${x - 22} ${y1 - 30 * dr} L${x} ${y1 - 4 * dr} L${x + 22} ${y1 - 30 * dr}`} stroke="#ffd23c" strokeWidth={8} fill="none" />}
      </svg>}
      <Cap t={t} t0={t0 + 0.7} x={Math.min(x + 230, 1300)} y={(y0 + y1) / 2 - 60} size={60} w={420} col="#2a1d08" bg="#ffd23c">{val}</Cap>
      {sub && <Cap t={t} t0={ts} x={860} y={900} size={58}>{sub[1]}</Cap>}
    </Out></>;
  });
  // ---- M7 · COPIAS que caen apiladas ----
  const mkPile = (bg: string, cs: { id: string; lab: string; ph: string }[], cap?: [string, string]) => W(({ t, a, b }) => {
    const ts = cs.map((c) => A(c.ph, a)), tc = cap ? A(cap[0], a) : 0;
    return <><Bg id={bg} t={t} a={a} /><Out t={t} a={a} b={b}>
      {cs.map((c, i) => { const x = 760 + (i - 1) * 150, y = 470 + (i - 1) * 30;
        return <React.Fragment key={i}><Card id={c.id} t={t} t0={ts[i] - 0.2} x={x} y={y} w={900} h={600} rot={[-7, 3, -2, 5][i % 4]} from="drop" />
          <Cap t={t} t0={ts[i] + 0.15} x={1540} y={260 + i * 130} size={58} w={560} bg={i === cs.length - 1 ? "rgba(200,50,30,.92)" : undefined}>{c.lab}</Cap></React.Fragment>; })}
      {cap && <Cap t={t} t0={tc} x={960} y={900} size={64}>{cap[1]}</Cap>}
    </Out></>;
  });
  // ---- M8 · PREGUNTA y RESPUESTA (tarjetas de papel) ----
  const mkQA = (id: string, qph: string, q: string, aph: string, ans: string) => W(({ t, a, b }) => {
    const tq = A(qph, a), ta = Math.max(A(aph, a), tq + 1.2), kq = Math.min(1.08, spr(t, tq, 1.1)), ka = Math.min(1.08, spr(t, ta, 1.1));
    return <><Bg id={id} t={t} a={a} /><Out t={t} a={a} b={b}>
      <Card id={id} t={t} t0={a} x={960} y={500} w={1500} h={800} rot={0} from="down" />
      {t > tq && <div style={{ ...abs(250, 190), transform: `translateX(${(1 - kq) * -500}px) rotate(-3deg)`, opacity: cl((t - tq) / 0.1), background: "#fffdf6", borderRadius: 30, padding: "26px 48px 34px", boxShadow: "0 24px 50px rgba(0,0,0,.5)", fontFamily: FONT, fontWeight: 800, fontSize: 82, color: COL.ink, whiteSpace: "nowrap" }}>{q}
        <div style={{ position: "absolute", left: 70, bottom: -40, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: "44px solid #fffdf6" }} /></div>}
      {t > ta && <div style={{ ...abs(0, 600, 1700), display: "flex", justifyContent: "flex-end" }}><div style={{ transform: `translateX(${(1 - ka) * 600}px) rotate(2.5deg)`, opacity: cl((t - ta) / 0.1), background: "#efe1b6", borderRadius: 10, padding: "24px 50px 32px", boxShadow: "0 24px 50px rgba(0,0,0,.5)", fontFamily: BRUSH, fontSize: 96, color: COL.ink, whiteSpace: "nowrap" }}>{ans}</div></div>}
    </Out></>;
  });
  // ---- M10 · ANTES / DESPUÉS: la cortina barre de izquierda a derecha ----
  const mkWipe = (id0: string, id1: string, ph: string, l0: string, l1: string, sub?: [string, string]) => W(({ t, a, b }) => {
    const t0 = A(ph, a), ts = sub ? A(sub[0], a) : 0, ws = a + 0.45, k = sm(cl((t - ws) / Math.max(1.6, t0 + 0.6 - ws, (b - a) * 0.55))), X = 14 + (1400 - 28) * k;
    return <><Bg id={id1} t={t} a={a} /><Out t={t} a={a} b={b}>
      <Card id={id0} t={t} t0={a} x={960} y={470} w={1400} h={720} rot={0} from="down">
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - (k * 100)}% 0 0)` }}><Img src={P(id1)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.06)" }} /></div>
      </Card>
      {k > 0.02 && k < 0.98 && <div style={{ ...abs(260 + X - 40, 110, 80, 720), background: "linear-gradient(90deg, rgba(255,240,200,0), #fffaf0 35%, #fff 50%, #fffaf0 65%, rgba(255,240,200,0))", boxShadow: "0 0 60px 20px rgba(255,236,190,.7)" }} />}
      <Cap t={t} t0={a + 0.3} x={960} y={850} size={60} w={1400} >{k > 0.5 ? l1 : l0}</Cap>
      {sub && <Cap t={t} t0={ts} x={960} y={150} size={58} bg="rgba(200,50,30,.92)">{sub[1]}</Cap>}
    </Out></>;
  });
  // ---- M11 · ETIQUETAS de papel que se clavan sobre la foto, una por renglón ----
  const mkList = (id: string, rows: { ph: string; txt: string; ok?: boolean; n?: boolean }[], title?: string) => W(({ t, a, b }) => {
    const ts = rows.map((r) => A(r.ph, a)), POS = [[560, 300, -5], [1360, 330, 4], [600, 620, 3], [1330, 640, -4], [960, 470, -2]];
    return <><Bg id={id} t={t} a={a} /><Out t={t} a={a} b={b}>
      <Card id={id} t={t} t0={a} x={960} y={480} w={1500} h={800} rot={-1} from="down" />
      {title && <Cap t={t} t0={a + 0.3} x={960} y={880} size={60} w={1200} col={COL.gold}>{title}</Cap>}
      {rows.map((r, i) => { const t0 = ts[i]; if (t < t0) return null; const [px, py, rot] = POS[i % POS.length], k = cl((t - t0) / 0.22), sc = lerp(1.6, 1, sm(k)), sh = k >= 1 ? Math.sin((t - t0) * 50) * 4 * Math.exp(-(t - t0 - 0.22) * 12) : 0;
        const mark = r.n ? String(i + 1) : r.ok === false ? "✕" : "✓", mc = r.n ? COL.red : r.ok === false ? COL.red : GREEN;
        return <div key={i} style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-50%) translateY(${sh}px) rotate(${rot}deg) scale(${sc})`, opacity: k, display: "flex", alignItems: "center", gap: 22, background: "#fbf3df", padding: "18px 40px 22px 26px", borderRadius: 8, boxShadow: "0 22px 40px rgba(0,0,0,.55), 0 4px 8px rgba(0,0,0,.35)", borderLeft: `14px solid ${mc}` }}>
          <div style={{ position: "absolute", left: "50%", top: -16, width: 30, height: 30, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #ff8a70, #b0281a)", boxShadow: "0 5px 8px rgba(0,0,0,.5)" }} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 92, color: mc, lineHeight: 1 }}>{mark}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 76, color: COL.ink, whiteSpace: "nowrap", lineHeight: 1 }}>{r.txt}</div></div>; })}
    </Out></>;
  });
  // ---- M12 · LA RUTA del sobre: Osaka → Ohio ----
  const mkRoute = (id: string, ph0: string, ph1: string) => W(({ t, a, b }) => {
    const t0 = A(ph0, a), t1 = Math.max(A(ph1, a), t0 + 1.6), k = sm(cl((t - t0 - 0.3) / (t1 - t0 - 0.3)));
    const pt = (u: number) => ({ x: lerp(1560, 360, u), y: 330 - Math.sin(u * Math.PI) * 190 });
    const p = pt(k), path = Array.from({ length: 41 }, (_, i) => pt(i / 40)).map((q, i) => `${i ? "L" : "M"}${q.x} ${q.y}`).join(" ");
    return <><Bg id={id} t={t} a={a} /><Out t={t} a={a} b={b}>
      <Card id={id} t={t} t0={a} x={960} y={700} w={1000} h={520} rot={-2} from="down" />
      <svg width={1920} height={1080} style={abs(0, 0)}><defs><mask id="rm"><path d={path} stroke="#fff" strokeWidth={30} fill="none" pathLength={1} strokeDasharray={`${k} 1`} /></mask></defs><path d={path} stroke="#fff" strokeWidth={10} strokeDasharray="26 20" fill="none" mask="url(#rm)" style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,.6))" }} /></svg>
      <Cap t={t} t0={t0 - 0.2} x={1560} y={380} size={66} w={500} bg="rgba(200,50,30,.92)">OSAKA</Cap>
      <Cap t={t} t0={t1} x={360} y={380} size={66} w={500} bg="rgba(43,63,99,.95)">OHIO</Cap>
      {t > t0 && k < 1 && <div style={{ ...abs(p.x - 75, p.y - 50, 150, 100), background: "linear-gradient(135deg,#fff 0 70%,#e8e2d2)", border: "6px solid", borderImage: "repeating-linear-gradient(45deg,#c8321e 0 10px,#fff 10px 20px,#2b3f63 20px 30px,#fff 30px 40px) 6", boxShadow: "0 10px 20px rgba(0,0,0,.5)", transform: `rotate(${-14 + k * 28}deg)` }} />}
      <Stamp t={t} t0={t1 + 0.4} x={1300} y={560} text="1970" size={90} rot={10} col={COL.indigo} />
    </Out></>;
  });
  // ---- M13 · EL SONIDO: ondas que salen de la corneta ----
  const mkSound = (id: string, ph: string, hx: number, hy: number, word: string, sub: [string, string]) => W(({ t, a, b }) => {
    const t0 = A(ph, a), ts = A(sub[0], a), X = 260 + 1400 * hx / 100, Y = 120 + 720 * hy / 100;
    return <><Bg id={id} t={t} a={a} /><Out t={t} a={a} b={b}>
      <Card id={id} t={t} t0={a} x={960} y={480} w={1400} h={720} rot={1} from="right" />
      {t > t0 && [0, 1, 2, 3].map((i) => { const u = ((t - t0) * 0.9 + i * 0.25) % 1; return <div key={i} style={{ ...abs(X - 40 - u * 260, Y - 40 - u * 260, 80 + u * 520, 80 + u * 520), borderRadius: "50%", border: `${10 - u * 6}px solid rgba(255,220,120,${0.9 * (1 - u)})` }} />; })}
      {word.split("").map((c, i) => { const ti = t0 + 0.1 + i * 0.09; if (t < ti) return null; const q = Math.min(1.15, spr(t, ti, 1.6));
        return <div key={i} style={{ position: "absolute", left: X - 380 + i * 96, top: Y - 290 - Math.sin(i * 0.9) * 30, fontFamily: FONT, fontWeight: 800, fontSize: 150, color: COL.gold, textShadow: "0 8px 0 #4a3010, 0 18px 30px rgba(0,0,0,.6)", transform: `scale(${q}) rotate(${(i - 2) * 4}deg)` }}>{c}</div>; })}
      <Cap t={t} t0={ts} x={960} y={880} size={60}>{sub[1]}</Cap>
    </Out></>;
  });
  // ---- M14 · LA RUEDA de dos cubetas: cambian de lugar en arco ----
  const mkSwap = (i0: string, i1: string, ph: string, l0: string, l1: string, cap: [string, string]) => W(({ t, a, b }) => {
    const ts = A(ph, a), tc = A(cap[0], a), k = sm(cl((t - ts) / 1.1));
    const pos = (u: number) => ({ x: lerp(560, 1360, u), y: 450 - Math.sin(u * Math.PI) * 120 });
    const pa = pos(k), pb = pos(1 - k);
    return <><Bg id={i0} t={t} a={a} /><Out t={t} a={a} b={b}>
      <svg width={1920} height={1080} style={abs(0, 0)}><path d="M720 220 Q960 90 1200 220" stroke="#ffd23c" strokeWidth={10} fill="none" markerEnd="url(#ar)" /><path d="M1200 760 Q960 880 720 760" stroke="#ffd23c" strokeWidth={10} fill="none" markerEnd="url(#ar)" />
        <defs><marker id="ar" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#ffd23c" /></marker></defs></svg>
      <Card id={i0} t={t} t0={a} x={pa.x} y={pa.y} w={640} h={460} rot={-3} from="left" />
      <Card id={i1} t={t} t0={a + 0.15} x={pb.x} y={pb.y} w={640} h={460} rot={3} from="right" />
      <Cap t={t} t0={a + 0.4} x={560} y={720} size={56} w={700}>{k < 0.5 ? l0 : l1}</Cap>
      <Cap t={t} t0={a + 0.4} x={1360} y={720} size={56} w={700}>{k < 0.5 ? l1 : l0}</Cap>
      <Cap t={t} t0={tc} x={960} y={880} size={62} bg="rgba(200,50,30,.92)">{cap[1]}</Cap>
    </Out></>;
  });
  // ---- M15 · MEDIDOR de olor: la aguja corre por la barra SOUR → ROTTEN ----
  const mkGauge = (id: string, ph1: string, ph2: string, sub: [string, string]) => W(({ t, a, b }) => {
    const t1 = A(ph1, a), t2 = Math.max(A(ph2, a), t1 + 1.2), ts = A(sub[0], a);
    const u = lerp(0.08, 0.3, Math.min(1.05, spr(t, t1, 1))) + (t > t2 ? 0.62 * Math.min(1.05, spr(t, t2, 1)) : 0);
    return <><Bg id={id} t={t} a={a} /><Out t={t} a={a} b={b}>
      <Card id={id} t={t} t0={a} x={960} y={390} w={1200} h={560} rot={-1} from="down" />
      <div style={{ ...abs(330, 730, 1260, 64), borderRadius: 32, background: `linear-gradient(90deg, ${GREEN}, #d9b23a 45%, ${COL.red})`, border: "6px solid #fff", boxShadow: "0 14px 30px rgba(0,0,0,.5)", opacity: e(t, a + 0.2, a + 0.5) }} />
      <div style={{ ...abs(330, 820, 1260), display: "flex", justifyContent: "space-between", fontFamily: FONT, fontWeight: 800, fontSize: 62, opacity: e(t, a + 0.3, a + 0.6) }}><span style={{ color: "#bfe8b0" }}>SOUR · good</span><span style={{ color: "#ffb5a6" }}>ROTTEN · more bran</span></div>
      <div style={{ ...abs(330 + 1260 * u - 30, 690, 60, 140), opacity: e(t, a + 0.3, a + 0.6) }}><svg width={60} height={140}><path d="M30 0 L56 40 L36 40 L36 140 L24 140 L24 40 L4 40 Z" fill="#fff" stroke="#1b1712" strokeWidth={4} /></svg></div>
      <Cap t={t} t0={ts} x={960} y={140} size={56}>{sub[1]}</Cap>
    </Out></>;
  });

  // ================= los 44 =================
  const C = {
    Receipt: mkCount("p01_bags_counter", "thirty", 0, 30, "$", "", ["every spring", "every spring"]),
    ForbiddenStamps: mkStamp("o_cheese", [{ id: "o_rice_crust", ph: "rice", stamp: "NO", lab: "rice" }, { id: "o_stale_bread", ph: "bread", stamp: "NO", lab: "bread" }, { id: "o_coffee_grounds", ph: "coffee", stamp: "NO", lab: "coffee" }, { id: "o_orange_peels", ph: "peels", stamp: "NO", lab: "peels" }, { id: "o_okara", ph: "tofu", stamp: "NEVER", lab: "tofu pulp" }], ["every book", "the books said: never"]),
    SealedNose: mkCircle("p03_lid_gap", 50, 46, "nose", "the nose test", "test", "2 seconds"),
    Airmail: mkRoute("p04_airmail", "osaka", "america"),
    Noren: mkStamp("p05_noren", [{ id: "p05_noren", ph: "subscribe", stamp: "SUBSCRIBE" }], ["free", "it's free · it helps the channel"]),
    NukaTub: mkWipe("p06_cuc_fresh", "p06_cuc_pickled", "next", "cucumbers in the wet bran…", "…the next day: pickles"),
    TwinBuckets: mkSplit({ id: "p07_pickle_bucket", ok: true, lab: "pickles", ph: "pickle" }, { id: "p07_scrap_bucket", ok: true, lab: "scraps", ph: "scraps" }, "same bran → BOKASHI"),
    LibraryRules: mkList("p08_library_book", [{ ph: "bread", txt: "no bread", ok: false }, { ph: "rice", txt: "no rice", ok: false }, { ph: "cheese", txt: "no cheese", ok: false }, { ph: "oil", txt: "no oil", ok: false }], "every book said:"),
    AirVsLid: mkSplit({ id: "p09_open_pile", ok: false, lab: "open pile: rots", ph: "open" }, { id: "p09_closed_bucket", ok: true, lab: "closed lid: sours", ph: "lid" }, "no air = it pickles"),
    BucketKit: mkList("p10_kit", [{ ph: "lid", txt: "a lid that closes tight" }, { ph: "holes", txt: "a few holes" }, { ph: "newspaper", txt: "newspaper" }], "the bucket"),
    BranShelf: mkTri("p11_rice_bran", [{ id: "p11_rice_bran", lab: "rice bran", ph: "rice bran" }, { id: "p11_wheat_bran", lab: "wheat bran", ph: "wheat" }, { id: "p11_bokashi", lab: "bokashi bran", ph: "bokashi" }], ["cheap", "any of these works"]),
    LayerCake: mkMeasure("p12_rice_layer", "inch", 900, 400, 560, "1 inch", ["bran", "then a handful of bran"]),
    ThickThin: mkWipe("p13_thick_grey", "p13_thin_layers", "thin", "thick wet cake: grey", "thin layers: it works"),
    CoinBread: mkCircle("p14_coin_bread", 38, 52, "coin", "the size of a coin"),
    MoldWar: mkWipe("p15_mold_green", "p15_bran_covered", "double", "green or black mold", "a double handful of bran"),
    Kissaten: mkTri("p16_kissaten", [{ id: "p16_kissaten", lab: "kissaten 1959", ph: "coffee shops" }, { id: "p16_grounds_tin", lab: "the grounds tin", ph: "grounds" }, { id: "p16_persimmons", lab: "persimmons", ph: "persimmons" }]),
    CoffeeMix: mkPile("p17_rice_bran_bowl", [{ id: "p17_grounds_spoon", lab: "grounds", ph: "spoon" }, { id: "p17_rice_bran_bowl", lab: "mixed in", ph: "mix" }, { id: "p17_filter_torn", lab: "never alone", ph: "filter" }]),
    ThinCrust: mkSplit({ id: "p18_thin_sprinkle", ok: true, lab: "thin like pepper", ph: "pepper" }, { id: "p18_thick_crust", ok: false, lab: "thick crust: water runs off", ph: "crust" }),
    Kotatsu: mkCircle("p19_mikan_kotatsu", 55, 50, "tangerines", "mikan peels", "ten", "ten a day"),
    PeelScissors: mkStamp("p20_peels_bag", [{ id: "p20_peels_cut", ph: "handful", stamp: "ONE HANDFUL", lab: "cut small" }, { id: "p20_peels_bag", ph: "bag", stamp: "NOT A BAG", lab: "a whole bag" }]),
    CorkPoll: mkQA("p21_kitchen_trash", "throw away", "What do you throw away the most?", "comments", "tell me below ↓"),
    TofuHorn: mkSound("p22_tofu_bike", "horn", 70, 30, "POOO", ["okara", "free okara · tofu pulp"]),
    RotOrCheese: mkSplit({ id: "p23_raccoon_pile", ok: false, lab: "open: it rots", ph: "rots" }, { id: "p23_sour_bran", ok: true, lab: "bucket: sour like cheese", ph: "cheese" }),
    HalfInch: mkMeasure("p24_okara_layer", "half an inch", 900, 360, 480, "½ inch", ["bran", "+ a double handful of bran"]),
    PawTrail: mkStamp("p25_paw_prints", [{ id: "p25_meat_fish", ph: "meat", stamp: "NO MEAT · NO FISH", lab: "meat & fish" }, { id: "p25_paw_prints", ph: "raccoon", stamp: "RACCOONS", lab: "they dig it up" }]),
    WeekStack: mkPile("p26_full", [{ id: "p26_low", lab: "night 1", ph: "every night" }, { id: "p26_mid", lab: "night 4", ph: "dinner" }, { id: "p26_full", lab: "Sunday: lid + date", ph: "sunday" }]),
    TapJar: mkCircle("p27_tap_jar", 46, 58, "tap", "brown, sour: keep it", "jar", "into a jar"),
    HundredToOne: mkCount("p28_watering_can", "hundred", 1, 100, "", " : 1", ["burn", "pure, it burns the roots"], "#8fd0ff"),
    TrenchCut: mkMeasure("p29_trench", "deep", 860, 380, 800, "10-12 in", ["eight", "8 inches of soil on top"]),
    WormClock: mkWipe("p30_scraps_trench", "p30_black_soil", "worms", "week 0: scraps", "week 4: just black soil"),
    FrostGauge: mkStamp("p31_soil_thermo", [{ id: "p31_soil_thermo", ph: "frozen", stamp: "FROZEN" }], ["garage", "you cannot dig · bury before the frost"]),
    BedPlan: mkList("p32_tomatoes", [{ ph: "tomatoes", txt: "tomatoes: most" }, { ph: "squash", txt: "squash, cucumbers" }, { ph: "beans", txt: "beans & peas: 1-2" }], "the hungry plants"),
    OverHead: mkMeasure("p33_tall_tomato", "head", 1060, 820, 150, "over 5 ft", ["six buckets", "six buckets in one trench"]),
    LidCheck: mkSplit({ id: "p34_white_fuzz", ok: true, lab: "white fuzz: good", ph: "white" }, { id: "p34_black_wet", ok: false, lab: "black & wet: bad", ph: "black" }),
    PotCut: mkMeasure("p35_big_pot", "pot", 700, 440, 700, "8 in of soil", ["balcony", "no yard? a big pot"]),
    MistakeDominoes: mkList("p36_loose_lid", [{ ph: "mistake 1", txt: "a loose lid", n: true }, { ph: "mistake 2", txt: "too much liquid", n: true }, { ph: "mistake 3", txt: "not enough bran", n: true }, { ph: "mistake 4", txt: "meat and fish", n: true }, { ph: "mistake 5", txt: "burying too shallow", n: true }], "5 mistakes"),
    HouseZone: mkStamp("p37_house_wall", [{ id: "p37_house_wall", ph: "house", stamp: "NOT BY THE HOUSE" }], ["away from the walls", "bury it away from the walls"]),
    FenceQA: mkQA("p38_fence", "does it smell", "Does it smell?", "open it", "Only sour, when you open it."),
    FenceQA_2: mkCircle("p39_fence_gate", 50, 62, "rats", "Will it bring rats?", "deep", "no meat, no fish · bury it deep"),
    TwoBucketWheel: mkSwap("p40_full_bucket", "p40_empty_bucket", "two", "resting 2 weeks", "filling", ["two", "so you need two"]),
    ThirtyVsFifteen: mkSplit({ id: "p41_bag_pile", ok: false, lab: "$30 every year", ph: "thirty" }, { id: "p41_two_buckets", ok: true, lab: "$15 once", ph: "fifteen" }, "two buckets pay for themselves"),
    NoseMeter: mkGauge("p42_steam", "sour", "rotten", ["smells", "lift the lid and smell"]),
    RecapStack: mkList("p43_bucket_top", [{ ph: "rice", txt: "rice", n: true }, { ph: "bread", txt: "bread", n: true }, { ph: "coffee", txt: "coffee", n: true }, { ph: "peels", txt: "peels", n: true }, { ph: "okara", txt: "okara", n: true }], "one more time"),
    TwoWeekHomework: mkPile("p44_calendar", [{ id: "p44_rice_container", lab: "the rice from the pot", ph: "rice" }, { id: "p44_bran_handful", lab: "a handful of bran", ph: "bran" }, { id: "p44_calendar", lab: "two weeks · then smell it", ph: "two weeks" }]),
  };
  return C as Record<string, React.FC<FxP>>;
};
