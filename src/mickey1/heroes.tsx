// ── HÉROES de Mickey's Butcher Shop (Claude, 15-oct): fotos reales en capas, cámara por claves, cada golpe en SU palabra
//    (t = segundo absoluto de words.json). Base: los héroes del Plomero cplocanos (job 964) + los de precio/temperatura/cuentas.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { Bed, Print, Chip, camAt, camStyle, sp, useT, ez, cl, img, C, SERIF, LABEL, HAND, shadowTxt, fit, P } from "../lkit/core";

type Beat = { t: number; txt: string };
const RED = "#C0392B", NAVY = "#1F3350", CREAM = "#F3E7CC", GOLD = "#F2C230";

// nota de papel crema escrita a mano (2-6 palabras)
const Note: React.FC<{ txt: string; u: number; x: number; y: number; rot?: number; size?: number }> = ({ txt, u, x, y, rot = -2, size = 74 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: cl(u * 1.4), transform: `translateY(${(1 - u) * 26}px) rotate(${rot}deg) scale(${0.92 + 0.08 * u})` }}>
    <div style={{ background: CREAM, padding: "18px 38px 22px", boxShadow: "0 24px 50px rgba(0,0,0,0.45)", fontFamily: HAND, fontSize: size, color: C.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>{txt}</div>
  </div>
);
// etiqueta de precio colgada (cartón crema con agujero e hilo), precio en serif
const Tag: React.FC<{ price: string; txt: string; u: number; x: number; y: number; rot?: number; red?: boolean; size?: number }> = ({ price, txt, u, x, y, rot = -4, red, size = 120 }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% 0", opacity: cl(u * 1.6), transform: `translateY(${(1 - u) * -60}px) rotate(${rot * u}deg)`, transformOrigin: "50% 0" }}>
    <div style={{ width: 4, height: 60, background: "#8a7a62", margin: "0 auto" }} />
    <div style={{ background: red ? RED : CREAM, borderRadius: 18, padding: "26px 44px 22px", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", textAlign: "center", border: `3px solid ${red ? "#8e2318" : "#c9b48a"}` }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: "#2a2018", margin: "0 auto 10px" }} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(price, 460, size, "serif"), lineHeight: 1, color: red ? "#fff" : C.ink }}>{price}</div>
      <div style={{ fontFamily: HAND, fontSize: 46, color: red ? "#ffe9e4" : C.pen, marginTop: 6, whiteSpace: "nowrap" }}>{txt}</div>
    </div>
  </div>
);

// 1 · ZOOM A UN PUNTO: la foto a pantalla completa, la cámara entra hacia (cx,cy) por golpes; un anillo rojo que se cierra; notas a la izquierda
export const Zoomin: P<{ k: string; cx: number; cy: number; r0: number; r1: number; beats: Beat[]; ring: number }> = ({ a, d, k, cx, cy, r0, r1, beats, ring }) => {
  const { f, at } = useT(a);
  const K = [{ t: a, s: 1.0, x: 960, y: 540 }, ...beats.map((b, i) => ({ t: b.t, s: 1.1 + 0.1 * i, x: 960 + (cx - 960) * (0.35 + 0.2 * i), y: 540 + (cy - 540) * (0.35 + 0.2 * i) }))];
  const cam = camAt(f, at, K, 1.3);
  const ru = ez((f - at(ring)) / 40), r = r0 + (r1 - r0) * ru;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0e0b08" }}>
      <AbsoluteFill style={camStyle(cam)}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.03 * f / Math.max(1, d)})` }} />
          {f >= at(ring) ? (
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={RED} strokeWidth={9} strokeDasharray="22 12" opacity={cl((f - at(ring)) / 8)} />
            </svg>
          ) : null}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,6,0.5) 0%, rgba(10,8,6,0) 42%)" }} />
      {beats.map((b, i) => <Note key={i} txt={b.txt} u={sp(f, at(b.t), 14, 150)} x={90} y={170 + i * 170} rot={i % 2 ? 1.5 : -2} />)}
    </AbsoluteFill>
  );
};

// 2 · $38 vs $6: el plato del restaurante (izq.) y el chuck del mostrador (der.) caen como fotos con su etiqueta; al final "falls apart"
export const VsPrices: P<{ left: { k: string; price: string; txt: string; t: number }; right: { k: string; price: string; txt: string; t: number }; end?: Beat; bed?: string }> =
  ({ a, d, left, right, end, bed }) => {
    const { f, at } = useT(a);
    const T = Math.max(1, d);
    const ul = sp(f, at(left.t), 14, 130), ur = sp(f, at(right.t), 14, 130);
    const strike = ez((f - at(right.t) - 12) / 14);
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Bed k={bed || right.k} f={f} T={T} dim={0.55} />
        {[{ s: left, u: ul, x: 520, rot: -3, red: false }, { s: right, u: ur, x: 1400, rot: 3, red: true }].map((p, i) => (
          <div key={i} style={{ position: "absolute", left: p.x, top: 470, translate: "-50% -50%", opacity: cl(p.u * 1.5), transform: `translateY(${(1 - p.u) * 140}px) rotate(${p.rot}deg) scale(${0.9 + 0.1 * p.u})` }}>
            <Print k={p.s.k} w={720} h={470} f={f} mat={16} />
            {i === 0 && strike > 0 ? <svg width={760} height={510} style={{ position: "absolute", left: -20, top: -20 }}><line x1={40} y1={470} x2={40 + 680 * strike} y2={470 - 430 * strike} stroke={RED} strokeWidth={16} strokeLinecap="round" /></svg> : null}
            <div style={{ position: "absolute", left: "50%", top: 420, translate: "-50% 0" }}><Tag price={p.s.price} txt={p.s.txt} u={p.u} x={0} y={0} red={p.red} rot={p.red ? 4 : -4} size={110} /></div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 960, top: 450, translate: "-50% -50%", fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: GOLD, textShadow: shadowTxt, opacity: cl(ur * 1.5) }}>vs</div>
        {end && f >= at(end.t) ? <Note txt={end.txt} u={sp(f, at(end.t), 14, 150)} x={1240} y={90} rot={3} size={84} /> : null}
      </AbsoluteFill>
    );
  };

// 3 · 1 SECRETO + 7 TRUCOS: grilla 4x2; la carta 1 cae boca abajo con "?" y el resto cae en cascada, numeradas
export const TrickGrid: P<{ mystery: Beat; items: { k: string; t: number }[]; head?: Beat; bed?: string }> = ({ a, d, mystery, items, head, bed }) => {
  const { f, at } = useT(a);
  const T = Math.max(1, d);
  const cells = [{ k: "", t: mystery.t, m: true }, ...items.map((x) => ({ ...x, m: false }))];
  const cam = 1 + 0.04 * f / T;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed || items[0].k} f={f} T={T} dim={0.6} />
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        {cells.map((c, i) => {
          const u = sp(f, at(c.t), 13, 150); if (f < at(c.t)) return null;
          const col = i % 4, row = Math.floor(i / 4);
          const x = 300 + col * 440, y = 380 + row * 330;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: cl(u * 1.6), transform: `translateY(${(1 - u) * -180}px) rotate(${(i % 2 ? 2.5 : -2.5) * u}deg)` }}>
              {c.m ? (
                <div style={{ width: 400, height: 260, background: NAVY, border: `14px solid ${CREAM}`, boxShadow: "0 30px 60px rgba(0,0,0,0.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: GOLD, lineHeight: 0.9 }}>?</div>
                  <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: CREAM }}>{mystery.txt}</div>
                </div>
              ) : <Print k={c.k} w={400} h={260} f={f} mat={14} />}
              <div style={{ position: "absolute", left: -24, top: -28, width: 78, height: 78, borderRadius: 39, background: RED, color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 50,
                display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 22px rgba(0,0,0,0.45)" }}>{i + 1}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      {head && f >= at(head.t) ? <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 5, color: "#fff", textShadow: shadowTxt, opacity: cl(sp(f, at(head.t)) * 1.4) }}>{head.txt}</div> : null}
    </AbsoluteFill>
  );
};

// 4 · REVELACIÓN: la foto de Mickey con la caja de sal; "SALT" gigante entra en su palabra; luego la nota "but it's WHEN"
export const Reveal: P<{ k: string; word: Beat; sub?: Beat; bed?: string }> = ({ a, d, k, word, sub }) => {
  const { f, at } = useT(a);
  const T = Math.max(1, d);
  const u = sp(f, at(word.t), 11, 170), s = cl((f - at(word.t)) / 6);
  const z = 1.04 + 0.08 * f / T;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0e0b08" }}>
      <Img src={img(k)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: "62% 40%" }} />
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(10,8,6,${0.55 * s}) 0%, rgba(10,8,6,0) 50%)` }} />
      <div style={{ position: "absolute", left: 110, top: 300, opacity: cl(u * 1.5), transform: `scale(${1.6 - 0.6 * u}) rotate(-3deg)`, transformOrigin: "0 50%",
        fontFamily: SERIF, fontWeight: 900, fontSize: 260, letterSpacing: 6, color: "#fff", textShadow: "0 14px 50px rgba(0,0,0,0.8)" }}>{word.txt}</div>
      {sub && f >= at(sub.t) ? <Note txt={sub.txt} u={sp(f, at(sub.t), 14, 150)} x={130} y={640} rot={-2} size={80} /> : null}
    </AbsoluteFill>
  );
};

// 5 · LA MEDIDA: foto a la derecha (cuchara/sal), a la izquierda tarjeta con la cantidad gigante que cambia por línea
export const Measure: P<{ k: string; lines: { t: number; big: string; txt: string }[]; bed?: string }> = ({ a, d, k, lines, bed }) => {
  const { f, at } = useT(a);
  const T = Math.max(1, d);
  const cur = lines.reduce((m, l, i) => (f >= at(l.t) ? i : m), 0);
  const L = lines[cur], u = sp(f, at(L.t), 12, 160);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed || k} f={f} T={T} dim={0.55} />
      <div style={{ position: "absolute", left: 1290, top: 540, translate: "-50% -50%", transform: `rotate(2deg) scale(${1 + 0.03 * f / T})` }}><Print k={k} w={980} h={620} f={f} mat={18} /></div>
      <div style={{ position: "absolute", left: 90, top: 210, width: 640, minHeight: 600, background: CREAM, boxShadow: "0 40px 80px rgba(0,0,0,0.5)", transform: "rotate(-2deg)", padding: "40px 46px" }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: RED }}>MICKEY'S MEASURE</div>
        <div key={cur} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(L.big, 560, 230, "serif"), lineHeight: 1.05, color: C.ink, marginTop: 20, opacity: cl(u * 1.5), transform: `translateY(${(1 - u) * 30}px) scale(${1.15 - 0.15 * u})`, transformOrigin: "0 50%" }}>{L.big}</div>
        <div style={{ fontFamily: HAND, fontSize: fit(L.txt, 560, 64, "hand", 2), lineHeight: 1.05, color: C.pen, marginTop: 14, opacity: cl(u * 1.5) }}>{L.txt}</div>
        <div style={{ display: "flex", gap: 14, marginTop: 26 }}>{lines.map((_, i) => <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: i <= cur ? RED : "#cdbf9e" }} />)}</div>
      </div>
    </AbsoluteFill>
  );
};

// 6 · PROFUNDIDAD: el corte de la carne a pantalla completa; en `wine` una banda morada finita en el borde ("a few millimeters"),
//     en `salt` un barrido dorado que cruza TODO el corte ("all the way through")
export const Depth: P<{ k: string; wine: Beat; salt: Beat; bed?: string }> = ({ a, d, k, wine, salt }) => {
  const { f, at } = useT(a);
  const T = Math.max(1, d);
  const w = ez((f - at(wine.t)) / 18), s = ez((f - at(salt.t)) / 34);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0e0b08" }}>
      <Img src={img(k)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.05 * f / T})` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={180} y={140} width={1560} height={800} rx={60} fill="none" stroke="#8E44AD" strokeWidth={26 * w} opacity={0.85 * w} />
        <rect x={180} y={140} width={1560 * s} height={800} rx={60} fill={GOLD} opacity={0.28 * s} />
      </svg>
      <div style={{ position: "absolute", left: 110, top: 70, opacity: cl(w * 1.4) }}><Chip txt={wine.txt} size={54} bg="#6C3483" color="#fff" rot={-2} /></div>
      <div style={{ position: "absolute", right: 110, bottom: 80, opacity: cl(sp(f, at(salt.t)) * 1.4) }}><Chip txt={salt.txt} size={58} bg={GOLD} color={C.ink} rot={2} /></div>
    </AbsoluteFill>
  );
};

// 7 · TERMÓMETRO: escala vertical (lo..hi °F) a la izquierda, la aguja sube a cada marca en SU palabra; foto a la derecha;
//     `done` = marcas ya vistas (sin tiempo), `bad` = rojo
export const TempLadder: P<{ k: string; marks: { t: number; deg: number; txt: string; bad?: boolean }[]; done?: { deg: number; txt: string; bad?: boolean }[]; lo: number; hi: number; bed?: string }> =
  ({ a, d, k, marks, done = [], lo, hi, bed }) => {
    const { f, at } = useT(a);
    const T = Math.max(1, d);
    const Y = (deg: number) => 930 - (deg - lo) / (hi - lo) * 780;
    let lvl = done.length ? done[done.length - 1].deg : lo + 8;
    for (const m of marks) { const u = ez((f - at(m.t)) / 22); if (u > 0) lvl = lvl + (m.deg - lvl) * u; }
    const all = [...done.map((m) => ({ ...m, u: 1 })), ...marks.map((m) => ({ ...m, u: sp(f, at(m.t), 13, 150) }))];
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Bed k={bed || k} f={f} T={T} dim={0.55} />
        <div style={{ position: "absolute", left: 1230, top: 540, translate: "-50% -50%", transform: `rotate(1.5deg) scale(${1 + 0.03 * f / T})` }}><Print k={k} w={1050} h={680} f={f} mat={18} /></div>
        <div style={{ position: "absolute", left: 150, top: 120, width: 120, height: 840, borderRadius: 60, background: "rgba(251,245,230,0.95)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 182, top: Y(lvl), width: 56, height: 930 - Y(lvl) + 10, borderRadius: 28, background: lvl >= 190 ? "#E67E22" : RED }} />
        <div style={{ position: "absolute", left: 160, top: 920, width: 100, height: 100, borderRadius: 50, background: lvl >= 190 ? "#E67E22" : RED, boxShadow: "0 10px 26px rgba(0,0,0,0.4)" }} />
        {all.map((m, i) => m.u <= 0 ? null : (
          <div key={i} style={{ position: "absolute", left: 290, top: Y(m.deg), translate: "0 -50%", opacity: cl(m.u * 1.5), transform: `translateX(${(1 - m.u) * -40}px)`, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 6, background: m.bad ? RED : C.ink }} />
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: "#fff", textShadow: shadowTxt }}>{m.deg}°F</div>
            <Chip txt={m.txt} size={40} bg={m.bad ? RED : GOLD} color={m.bad ? "#fff" : C.ink} rot={m.bad ? -2 : 2} />
          </div>
        ))}
      </AbsoluteFill>
    );
  };

// 8 · LA CUENTA: recibo de papel que se escribe renglón por renglón sobre la foto de la mesa; el plato de $38 tachado arriba
export const MoneyMath: P<{ k: string; rows: { t: number; txt: string; amt: string }[]; total: { t: number; txt: string; amt: string }; per?: { t: number; txt: string; amt: string }; vs?: { txt: string; amt: string }; bed?: string }> =
  ({ a, d, k, rows, total, per, vs }) => {
    const { f, at } = useT(a);
    const T = Math.max(1, d);
    const line = (txt: string, amt: string, u: number, big = false, red = false) => (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: cl(u * 1.5), transform: `translateX(${(1 - u) * -30}px)`, marginTop: big ? 18 : 8 }}>
        <span style={{ fontFamily: HAND, fontSize: big ? 62 : 56, color: red ? RED : C.pen }}>{txt}</span>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: big ? 92 : 66, color: red ? RED : C.ink }}>{amt}</span>
      </div>
    );
    const vu = vs ? sp(f, 4, 14, 140) : 0, vstr = vs ? ez((f - 20) / 14) : 0;
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `scale(${1.05 + 0.05 * f / T})` }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,6,0.0) 40%, rgba(10,8,6,0.55) 100%)" }} />
        {vs ? (
          <div style={{ position: "absolute", left: 120, top: 90, opacity: cl(vu * 1.5), transform: "rotate(-3deg)" }}>
            <div style={{ background: "#fff", padding: "16px 34px", boxShadow: "0 20px 40px rgba(0,0,0,0.45)", position: "relative" }}>
              <span style={{ fontFamily: HAND, fontSize: 50, color: C.inkSoft }}>{vs.txt} </span><span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: C.ink }}>{vs.amt}</span>
              <div style={{ position: "absolute", left: 20, right: 20 - 0, top: "52%", height: 10, background: RED, transform: `scaleX(${vstr})`, transformOrigin: "0 50%" }} />
            </div>
          </div>
        ) : null}
        <div style={{ position: "absolute", right: 110, top: 150, width: 720, background: "#FFFDF6", padding: "40px 50px 46px", boxShadow: "0 40px 90px rgba(0,0,0,0.55)", transform: "rotate(1.5deg)",
          backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 62px, rgba(70,110,170,0.18) 62px 64px)" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: RED }}>MICKEY'S ARITHMETIC</div>
          {rows.map((r, i) => <div key={i}>{line(r.txt, r.amt, sp(f, at(r.t), 13, 150))}</div>)}
          <div style={{ height: 6, background: C.ink, marginTop: 14, transform: `scaleX(${ez((f - at(total.t)) / 12)})`, transformOrigin: "0 50%" }} />
          {line(total.txt, total.amt, sp(f, at(total.t), 13, 150), true)}
          {per ? line(per.txt, per.amt, sp(f, at(per.t), 13, 150), true, true) : null}
        </div>
      </AbsoluteFill>
    );
  };

// 9 · TRES COMIDAS DE UNA OLLA: tres fotos con marco caen en fila (domingo, lunes, martes) con su rótulo en SU palabra
export const ThreeMeals: P<{ items: { k: string; t: number; txt: string }[]; bed?: string }> = ({ a, d, items, bed }) => {
  const { f, at } = useT(a);
  const T = Math.max(1, d);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed || items[0].k} f={f} T={T} dim={0.55} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 62, letterSpacing: 5, color: "#fff", textShadow: shadowTxt, opacity: cl(f / 12) }}>ONE POT · THREE MEALS</div>
      {items.map((it, i) => {
        if (f < at(it.t)) return null;
        const u = sp(f, at(it.t), 13, 140), x = 340 + i * 620;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 560, translate: "-50% -50%", opacity: cl(u * 1.5), transform: `translateY(${(1 - u) * -200}px) rotate(${(i - 1) * 3}deg)` }}>
            <Print k={it.k} w={560} h={380} f={f} mat={16} />
            <div style={{ position: "absolute", left: "50%", bottom: -50, translate: "-50% 0" }}><Chip txt={it.txt} size={44} rot={i % 2 ? 2 : -2} /></div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
