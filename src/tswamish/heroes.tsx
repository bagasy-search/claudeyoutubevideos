// ── HÉROES de tswwater (Claude, 15-oct): fotos reales en capas, cámara por claves, cada golpe en SU palabra (t = segundo absoluto de words.json) ──
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo } from "remotion";
import { Bed, Print, Chip, camAt, camStyle, sp, useT, ez, cl, img, clip, C, SERIF, LABEL, HAND, shadowTxt, P } from "../lkit/core";

type Beat = { t: number; txt: string };

// nota de papel crema escrita a mano (2-6 palabras)
const Note: React.FC<{ txt: string; u: number; x: number; y: number; rot?: number; size?: number }> = ({ txt, u, x, y, rot = -2, size = 74 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: cl(u * 1.4), transform: `translateY(${(1 - u) * 26}px) rotate(${rot}deg) scale(${0.92 + 0.08 * u})` }}>
    <div style={{ background: "#F3E7CC", padding: "18px 38px 22px", boxShadow: "0 24px 50px rgba(0,0,0,0.45)", fontFamily: HAND, fontSize: size, color: C.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>{txt}</div>
  </div>
);

// 1 · FOCUS: (opcional) el clip de la gota a pantalla completa hasta vidEnd; después la foto de la placa roja, la cámara entra hacia (cx,cy),
//     en cada golpe una nota (small / thick / red hot) y un anillo rojo que se cierra sobre la placa.
export const Focus: P<{ k: string; cx: number; cy: number; r0: number; r1: number; beats: Beat[]; ring: number; tag?: string; tagT?: number; drop?: number; vid?: string; vidEnd?: number }> =
  ({ a, d, k, cx, cy, r0, r1, beats, ring, tag, tagT, vid, vidEnd }) => {
    const { f, at } = useT(a);
    const v0 = vid && vidEnd ? at(vidEnd) : 0;
    const K = [{ t: vidEnd || a, s: 1.0, x: 960, y: 540 }, ...beats.map((b, i) => ({ t: b.t, s: 1.1 + 0.1 * i, x: 960 + (cx - 960) * (0.35 + 0.2 * i), y: 540 + (cy - 540) * (0.35 + 0.2 * i) }))];
    const cam = camAt(f, at, K, 1.3);
    const ru = ez((f - at(ring)) / 45), r = r0 + (r1 - r0) * ru;
    const xf = vid ? cl((f - v0 + 8) / 10) : 1;
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0e0b08" }}>
        <AbsoluteFill style={{ ...camStyle(cam), opacity: xf }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
            <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.04 * f / Math.max(1, d)})` }} />
            {f >= at(ring) ? (
              <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.red} strokeWidth={9} strokeDasharray="22 12" opacity={cl((f - at(ring)) / 8)} />
              </svg>
            ) : null}
          </div>
        </AbsoluteFill>
        {vid && f < v0 + 2 ? <AbsoluteFill style={{ opacity: 1 - cl((f - v0 + 8) / 10) }}><OffthreadVideo src={clip(vid)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill> : null}
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,6,0.55) 0%, rgba(10,8,6,0) 45%)", opacity: xf }} />
        {beats.map((b, i) => (
          <Note key={i} txt={b.txt} u={sp(f, at(b.t), 14, 150)} x={90} y={170 + i * 175} rot={i % 2 ? 1.5 : -2} size={84} />
        ))}
        {tag && tagT ? <div style={{ position: "absolute", right: 80, bottom: 90, opacity: cl(sp(f, at(Math.max(tagT, vidEnd || 0))) * 1.3) }}><Chip txt={tag} size={46} bg={C.red} color="#fff" rot={-3} /></div> : null}
      </AbsoluteFill>
    );
  };

// 2 · HOLECOUNT: la foto del caño marcado; la cámara lo recorre; "5 RINGS" / "1 INCH APART" / "× 8 HOLES" caen en sus palabras y al final
//     un contador grande sube de 0 a 40.
export const HoleCount: P<{ k: string; a1: Beat; a2: Beat; b1: Beat; tot: Beat }> = ({ a, d, k, a1, a2, b1, tot }) => {
  const { f, at } = useT(a);
  const cam = camAt(f, at, [{ t: a, s: 1.0, x: 960, y: 540 }, { t: a1.t, s: 1.15, x: 820, y: 520 }, { t: b1.t, s: 1.25, x: 1100, y: 560 }, { t: tot.t, s: 1.05, x: 960, y: 540 }], 1.4);
  const tu = ez((f - at(tot.t)) / 36);
  const n = Math.round(40 * tu);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0e0b08" }}>
      <AbsoluteFill style={camStyle(cam)}>
        <Img src={img(k)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,6,0) 45%, rgba(10,8,6,0.6) 100%)" }} />
      <Note txt={a1.txt} u={sp(f, at(a1.t), 14, 150)} x={90} y={110} size={80} />
      <Note txt={a2.txt} u={sp(f, at(a2.t), 14, 150)} x={130} y={290} rot={1.5} size={62} />
      <Note txt={b1.txt} u={sp(f, at(b1.t), 14, 150)} x={1260} y={140} rot={2} size={80} />
      {f >= at(tot.t) - 2 ? (
        <div style={{ position: "absolute", right: 110, bottom: 70, display: "flex", alignItems: "baseline", gap: 22, opacity: cl(tu * 3), transform: `scale(${0.85 + 0.15 * sp(f, at(tot.t), 12, 160)})` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, color: C.porc, textShadow: shadowTxt, letterSpacing: 4 }}>=</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 260, color: "#fff", textShadow: shadowTxt, lineHeight: 0.9 }}>{n}</div>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, color: C.porc, textShadow: shadowTxt, letterSpacing: 4 }}>HOLES</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 3 · TESTBOARD: cama oscura; dos fotos con marco (aceite solo / con agua), barras de horas que crecen en su palabra y la cifra;
//     al final una nota "almost double".
type Side = { k: string; txt: string; val: string; t: number; frac: number };
export const TestBoard: P<{ bed: string; left: Side; right: Side; foot?: Beat }> = ({ a, d, bed, left, right, foot }) => {
  const { f, at } = useT(a);
  const T = Math.max(1, d);
  const col = (s: Side, x: number, color: string, i: number) => {
    const u = sp(f, at(s.t) - 6, 13, 140), g = ez((f - at(s.t)) / 40);
    return (
      <div style={{ position: "absolute", left: x, top: 150, width: 760, opacity: cl(u * 1.5), transform: `translateY(${(1 - u) * 60}px) rotate(${i ? 1.5 : -1.5}deg)` }}>
        <Print k={s.k} w={720} h={400} f={f} mat={14} />
        <div style={{ marginTop: 34, fontFamily: LABEL, fontWeight: 700, fontSize: 54, letterSpacing: 5, color: C.porc, textShadow: shadowTxt }}>{s.txt}</div>
        <div style={{ marginTop: 14, height: 46, width: 720, background: "rgba(255,255,255,0.14)", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${100 * s.frac * g}%`, background: color, borderRadius: 8 }} />
        </div>
        <div style={{ marginTop: 10, fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: "#fff", textShadow: shadowTxt, opacity: cl(g * 2) }}>{s.val}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={T} dim={0.62} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 56, letterSpacing: 6, color: C.porc, textShadow: shadowTxt, opacity: cl(f / 12) }}>ONE LITER OF OIL</div>
      {col(left, 150, "#D9822B", 0)}
      {col(right, 1010, "#3D8BFF", 1)}
      {foot ? <Note txt={foot.txt} u={sp(f, at(foot.t), 14, 150)} x={640} y={900} rot={-1.5} size={72} /> : null}
    </AbsoluteFill>
  );
};
