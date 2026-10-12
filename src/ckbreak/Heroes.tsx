// ckbreak · componentes nuevos (Claude, 12-oct-2026). Fotos reales en capas, cámara con camAt, cada beat en su palabra.
// Tiempos de las props = segundos absolutos del video (words.json). Mismo lenguaje que New.tsx (FirstPlate / Everybody / PageTwenty).
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND, fr, cl, ez, eo, lin, img, C, Grade, Grain, Mark, Print, Chip, Bed, sp } from "./Base";

type P<T> = React.FC<T & { a: number; d: number }>;
const useT = (a: number) => { const f = useCurrentFrame(); return { f, at: (t: number) => fr(t) - fr(a) }; };
const shadowTxt = "0 6px 26px rgba(0,0,0,0.65)";
type Cam = { t: number; s: number; x: number; y: number };
const camAt = (f: number, at: (t: number) => number, K: Cam[], dur = 1.1) => {
  let c = K[0];
  for (let i = 1; i < K.length; i++) {
    const p = c, q = K[i], u = ez((f - at(q.t)) / (dur * 30));
    if (f >= at(q.t)) c = { t: q.t, s: p.s + (q.s - p.s) * u, x: p.x + (q.x - p.x) * u, y: p.y + (q.y - p.y) * u };
  }
  return c;
};
const camStyle = (c: Cam): React.CSSProperties => ({ transformOrigin: "0 0", transform: `translate(${960 - c.x * c.s}px, ${540 - c.y * c.s}px) scale(${c.s})` });
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover" };

// ── NÚMERO DE RECETA: foto a pantalla completa con empuje lento; número grande + nombre + página ──
export const NumCard: P<{ k: string; num: string; name: string; page: string; t: number; o?: [number, number]; chip?: { txt: string; t: number } }> = ({ a, d, k, num, name, page, t, o = [50, 50], chip }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 13, 150), c = chip ? sp(f, at(chip.t), 14, 170) : 0;
  const push = ez(f / Math.max(1, d));
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <AbsoluteFill style={{ transform: `scale(${1.03 + 0.12 * push})`, transformOrigin: `${o[0]}% ${o[1]}%`, filter: "brightness(0.8)" }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,14,0.2) 0%, rgba(10,8,14,0) 32%, rgba(10,8,14,0.72) 100%)" }} />
      <div style={{ position: "absolute", left: 120, bottom: 140, opacity: cl(u * 1.6), transform: `translateY(${(1 - u) * 40}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 300, lineHeight: 0.85, color: C.porc, textShadow: shadowTxt }}>{num}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 88, lineHeight: 1.05, color: C.porc, textShadow: shadowTxt, marginTop: 14, maxWidth: 1400 }}>{name}</div>
      </div>
      <div style={{ position: "absolute", right: 110, top: 110, opacity: cl(u * 1.4), transform: "rotate(4deg)" }}><Chip txt={page} size={50} bg={C.red} color="#fff" /></div>
      {chip ? <div style={{ position: "absolute", right: 110, bottom: 160, opacity: c, transform: `translateX(${(1 - c) * 60}px) rotate(-2deg)` }}><Chip txt={chip.txt} size={54} /></div> : null}
      <Grade vig={0.38} />
      <Grain />
    </AbsoluteFill>
  );
};

// ── TRUCO / PASO PRINCIPAL: foto base con cámara (camAt) + copias reales que llegan en su palabra + rótulos + marca roja ──
type PrintS = { k: string; t: number; x: number; y: number; w: number; h: number; rot?: number; from?: "l" | "r" | "b"; out?: number };
type ChipS = { txt: string; t: number; x: number; y: number; bg?: string; color?: string; size?: number; rot?: number };
export const TrickHero: P<{ base: string; dim?: number; cam?: Cam[]; prints?: PrintS[]; chips?: ChipS[]; mark?: { t: number; x: number; y: number; w: number; h: number; kind?: "circle" | "strike" }; line?: { t: number; x0: number; y0: number; x1: number; y1: number }; paper?: { t: number; x: number; y: number; txt: string; size?: number; rot?: number }; fade?: number }> =
  ({ a, d, base, dim = 0, cam, prints = [], chips = [], mark, line, paper, fade }) => {
    const { f, at } = useT(a);
    const c: Cam = cam ? camAt(f, at, cam, 1.2) : { t: 0, s: 1.02 + 0.2 * f / Math.max(1, d), x: 960, y: 540 };
    const baseOp = fade != null ? 1 - 0.75 * cl((f - at(fade)) / 20) : 1;
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
        <AbsoluteFill style={{ filter: dim ? `brightness(${1 - dim}) blur(${dim * 14}px)` : undefined }}>
          <AbsoluteFill style={{ ...camStyle(c), opacity: baseOp }}>
            <Img src={img(base)} style={FULL} />
          </AbsoluteFill>
        </AbsoluteFill>
        {line ? (() => {
          const u = cl((f - at(line.t)) / 22);
          const L = Math.hypot(line.x1 - line.x0, line.y1 - line.y0);
          return <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.6))" }}>
            <line x1={line.x0} y1={line.y0} x2={line.x1} y2={line.y1} stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - eo(u))} />
          </svg>;
        })() : null}
        {prints.map((p, i) => {
          const u = sp(f, at(p.t), 13, 150);
          const dx = p.from === "l" ? -1 : p.from === "r" ? 1 : 0, dy = p.from === "b" ? 1 : 0;
          const out = p.out != null ? cl((f - at(p.out)) / 14) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: p.x, top: p.y, translate: "-50% -50%", opacity: cl(u * 2) * (1 - out),
              transform: `translate(${dx * (1 - u) * -700 + dx * out * 900}px, ${dy * (1 - u) * 500 + out * 0}px) rotate(${(p.rot ?? 0) * u}deg)` }}>
              <Print k={p.k} w={p.w} h={p.h} f={f} />
            </div>
          );
        })}
        {mark ? <Mark kind={mark.kind ?? "circle"} x={mark.x} y={mark.y} w={mark.w} h={mark.h} f={f} at={at(mark.t)} dur={12} sw={9} /> : null}
        {paper ? (() => {
          const u = sp(f, at(paper.t), 14, 160);
          return <div style={{ position: "absolute", left: paper.x, top: paper.y, translate: "-50% -50%", opacity: cl(u * 2), transform: `rotate(${paper.rot ?? -2}deg) translateY(${(1 - u) * 26}px)`, background: "#F3E7CC", padding: "24px 42px 28px", boxShadow: "0 22px 46px rgba(0,0,0,0.45)", fontFamily: HAND, fontSize: paper.size ?? 74, color: C.ink, lineHeight: 1.08, whiteSpace: "nowrap" }}>{paper.txt}</div>;
        })() : null}
        {chips.map((h, i) => {
          const u = sp(f, at(h.t), 14, 180);
          return <div key={i} style={{ position: "absolute", left: h.x, top: h.y, translate: "-50% -50%", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 24}px) rotate(${h.rot ?? -2}deg)` }}>
            <Chip txt={h.txt} size={h.size ?? 52} bg={h.bg} color={h.color} rot={0} />
          </div>;
        })}
        <Grade vig={0.36} />
        <Grain />
      </AbsoluteFill>
    );
  };

// ── BARAJA: 6 fotos en dos filas de tres, cada una cae en su palabra con su rótulo; una se da vuelta (#1) ──
export const Deal: P<{ bed: string; cards: { k: string; t: number; lab: string }[]; flip?: { t: number; k: string; idx: number }; cam?: Cam[] }> = ({ a, d, bed, cards, flip, cam }) => {
  const { f, at } = useT(a);
  const W = 560, H = 380, X = [440, 1040, 1640], Y = [330, 800];
  const cc: Cam = cam ? camAt(f, at, cam, 1.1) : { t: 0, s: 1, x: 960, y: 540 };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={bed} f={f} T={d} dim={0.6} />
      <AbsoluteFill style={cam ? camStyle(cc) : undefined}>
      {cards.map((c, i) => {
        const u = sp(f, at(c.t), 13, 150);
        const cx = X[i % 3], cy = Y[Math.floor(i / 3)];
        const rot = [-3, 2, -1.5, 2.5, -2, 1.5][i % 6];
        const isFlip = flip && flip.idx === i;
        const th = isFlip ? 180 * ez((f - at(flip!.t)) / 22) : 0;
        const showBack = th < 90;
        return (
          <div key={i} style={{ position: "absolute", left: cx, top: cy, translate: "-50% -50%", opacity: cl(u * 2), transform: `translateY(${(1 - u) * -260}px) rotate(${rot * u}deg)` }}>
            <div style={{ transform: `perspective(1400px) rotateY(${th}deg)` }}>
              {showBack ? (
                <Print k={c.k} w={W} h={H} f={f}>
                  {isFlip ? <div style={{ position: "absolute", inset: 0, background: "#EADFC4", display: "flex", alignItems: "center", justifyContent: "center" }}><Chip txt="#1" size={120} bg={C.red} color="#fff" /></div> : null}
                </Print>
              ) : (
                <div style={{ transform: "rotateY(180deg)" }}><Print k={flip!.k} w={W} h={H} f={f} /></div>
              )}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: -88, textAlign: "center", opacity: cl(u * 1.5) }}>
              <Chip txt={c.lab} size={42} rot={-1} />
            </div>
          </div>
        );
      })}
      </AbsoluteFill>
      <Grade vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// ── ANILLO QUE CUENTA: la temperatura o el tiempo suben de verdad mientras la voz lo dice ──
export const RingCount: P<{ k: string; t0: number; t1: number; from: number; to: number; suffix: string; label: string; chip?: string }> = ({ a, d, k, t0, t1, from, to, suffix, label }) => {
  const { f, at } = useT(a);
  const p = cl((f - at(t0)) / Math.max(1, at(t1) - at(t0)));
  const v = Math.round(from + (to - from) * eo(p));
  const R = 210, L = 2 * Math.PI * R, pop = sp(f, at(t0) - 6, 12, 140);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={k} f={f} T={d} dim={0.55} />
      <div style={{ position: "absolute", left: 960, top: 500, translate: "-50% -50%", opacity: cl(pop * 2), transform: `scale(${0.9 + 0.1 * pop})` }}>
        <svg width={2 * R + 60} height={2 * R + 60} style={{ position: "absolute", left: -R - 30, top: -R - 30, transform: "rotate(-90deg)", filter: "drop-shadow(0 12px 26px rgba(0,0,0,0.5))" }}>
          <circle cx={R + 30} cy={R + 30} r={R} fill="rgba(20,16,12,0.45)" stroke="rgba(251,248,242,0.3)" strokeWidth={22} />
          <circle cx={R + 30} cy={R + 30} r={R} fill="none" stroke="#F2C94C" strokeWidth={22} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - (to === from ? 1 : (v - from) / (to - from)))} />
        </svg>
        <div style={{ position: "absolute", left: -260, top: -120, width: 520, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 230, lineHeight: 1, color: C.porc, textShadow: shadowTxt }}>{v}{suffix}</div>
        <div style={{ position: "absolute", left: -260, top: 150, width: 520, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 46, letterSpacing: 8, color: C.porc, textShadow: shadowTxt }}>{label}</div>
      </div>
      <Grade vig={0.38} />
      <Grain />
    </AbsoluteFill>
  );
};

// ── DOS MITADES: la mezcla con grumos (izq.) contra la lisa (der.); la del medio se vierte; luego la lisa llena la pantalla ──
export const ColdStart: P<{ left: string; right: string; mid: string; tR: number; tM: number; tL: number; tC: number; chip: string }> = ({ a, d, left, right, mid, tR, tM, tL, tC, chip }) => {
  const { f, at } = useT(a);
  const glow = lin(f, at(tR), at(tR) + 18, 0, 1);
  const midOp = lin(f, at(tM), at(tM) + 10, 0, 1) * (1 - lin(f, at(tM) + 96, at(tM) + 112, 0, 1));
  const u = lin(f, at(tC), at(tC) + 28, 0, 1);
  const ch = sp(f, at(tC) + 10, 14, 170);
  const redO = lin(f, at(tL), at(tL) + 10, 0, 1);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#100c08" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: `${50 - 50 * u}%`, height: "100%", overflow: "hidden", opacity: 1 - u * 0.9 }}>
        <Img src={img(left)} style={{ width: 1920, height: 1080, objectFit: "cover", position: "absolute", left: 0, top: 0 }} />
        <Mark kind="circle" x={260} y={250} w={620} h={420} f={f} at={at(tL)} dur={12} sw={10} />
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: `rgba(192,57,43,${0.12 * redO})` }} />
        <div style={{ position: "absolute", left: 120, bottom: 150, opacity: redO, transform: "rotate(-2deg)" }}><Chip txt="LUMPS" size={70} bg={C.red} color="#fff" rot={0} /></div>
      </div>
      <div style={{ position: "absolute", left: `${50 - 50 * u}%`, top: 0, width: `${50 + 50 * u}%`, height: "100%", overflow: "hidden" }}>
        <Img src={img(right)} style={{ width: 1920, height: 1080, objectFit: "cover", position: "absolute", left: `${-50 * (1 - u)}%`, top: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: `rgba(255,236,180,${0.22 * glow * (1 - u * 0.3)})` }} />
      </div>
      {midOp > 0.01 ? <AbsoluteFill style={{ opacity: midOp }}><Img src={img(mid)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill> : null}
      {u > 0 ? <div style={{ position: "absolute", left: 120, bottom: 140, opacity: ch, transform: `translateY(${(1 - ch) * 30}px) rotate(-2deg)` }}><Chip txt={chip} size={84} /></div> : null}
      <Grade vig={0.36} />
      <Grain />
    </AbsoluteFill>
  );
};

export const HEROES: Record<string, React.FC<any>> = { NumCard, TrickHero, Deal, RingCount, ColdStart };
