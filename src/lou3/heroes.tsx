// ── HÉROES de Lou (lou2-4, 15-oct-2026; base = héroes de stan1): fotos reales en capas, cada golpe en SU palabra ──
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { Bed, Print, Chip, Mark, FullPhoto, camAt, camStyle, sp, useT, ez, cl, img, C, SERIF, LABEL, HAND, shadowTxt, P } from "../lkit/core";

type Beat = { t: number; txt: string };
type Drop = { k: string; t: number; txt: string };
const RED = "#C0392B", YEL = "#F7D21E";

// nota de papel crema escrita a mano (2-6 palabras)
const Note: React.FC<{ txt: string; u: number; x: number; y: number; rot?: number; size?: number }> = ({ txt, u, x, y, rot = -2, size = 74 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: cl(u * 1.4), transform: `translateY(${(1 - u) * 26}px) rotate(${rot}deg) scale(${0.92 + 0.08 * u})` }}>
    <div style={{ background: "#F3E7CC", padding: "18px 38px 22px", boxShadow: "0 24px 50px rgba(0,0,0,0.45)", fontFamily: HAND, fontSize: size, color: C.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>{txt}</div>
  </div>
);
// número redondo rojo
const Badge: React.FC<{ n: number | string; size?: number }> = ({ n, size = 84 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: RED, color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: size * 0.66,
    display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 22px rgba(0,0,0,0.45)" }}>{n}</div>
);

// 1 · ZOOM CON MARCA: la foto a pantalla completa; la cámara entra hacia (cx,cy) en cada golpe; rótulos a la izquierda y un anillo rojo que se cierra.
export const ZoomMark: P<{ k: string; cx: number; cy: number; r0: number; r1: number; beats: Beat[]; ring: number }> = ({ a, d, k, cx, cy, r0, r1, beats, ring }) => {
  const { f, at } = useT(a);
  const K = [{ t: a, s: 1.0, x: 960, y: 540 }, ...beats.map((b, i) => ({ t: b.t, s: 1.1 + 0.1 * i, x: 960 + (cx - 960) * (0.3 + 0.2 * i), y: 540 + (cy - 540) * (0.3 + 0.2 * i) }))];
  const cam = camAt(f, at, K, 1.3);
  const ru = ez((f - at(ring)) / 40), r = r0 + (r1 - r0) * ru;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0e0b08" }}>
      <AbsoluteFill style={camStyle(cam)}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.03 * f / Math.max(1, d)})` }} />
          {f >= at(ring) ? (
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={RED} strokeWidth={10} strokeDasharray="24 12" opacity={cl((f - at(ring)) / 8)} />
            </svg>
          ) : null}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,6,0.5) 0%, rgba(10,8,6,0) 42%)" }} />
      {beats.map((b, i) => (
        <Note key={i} txt={b.txt} u={sp(f, at(b.t), 14, 150)} x={80} y={140 + i * 170} rot={i % 2 ? 1.5 : -2} />
      ))}
    </AbsoluteFill>
  );
};

// 2 · LOS SIETE TRUCOS sobre el mostrador: 7 fotos con marco en 2 filas (4 + 3); cada una cae en SU palabra con su número y su rótulo.
export const SevenRow: P<{ bed: string; items: Drop[]; head?: string }> = ({ a, d, bed, items, head }) => {
  const { f, at } = useT(a);
  const pos = (i: number) => i < 4 ? { x: 270 + i * 460, y: 400 } : { x: 500 + (i - 4) * 460, y: 790 };
  const last = items.findIndex((it) => f < at(it.t)); const cur = last < 0 ? items.length - 1 : Math.max(0, last - 1);
  const cam = camAt(f, at, [{ t: a, s: 1.0, x: 960, y: 560 }, ...items.map((it, i) => ({ t: it.t, s: 1.05, x: 960 + (pos(i).x - 960) * 0.12, y: 560 + (pos(i).y - 560) * 0.1 }))], 1.0);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.55} />
      <AbsoluteFill style={camStyle(cam)}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          {items.map((it, i) => {
            if (f < at(it.t)) return null;
            const u = sp(f, at(it.t), 13, 140), p = pos(i), on = i === cur;
            return (
              <div key={i} style={{ position: "absolute", left: p.x, top: p.y, translate: "-50% -50%", opacity: cl(u * 1.5),
                transform: `translateY(${(1 - u) * -150}px) rotate(${i % 2 ? 3 : -3}deg) scale(${on ? 1.08 : 0.96})` }}>
                <Print k={it.k} w={330} h={210} f={f} mat={12} />
                <div style={{ position: "absolute", left: -28, top: -32 }}><Badge n={i + 1} size={78} /></div>
                <div style={{ position: "absolute", left: "50%", bottom: -38, translate: "-50% 0" }}><Chip txt={it.txt} size={36} maxW={350} rot={i % 2 ? 2 : -2} /></div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {head ? <div style={{ position: "absolute", left: 0, right: 0, top: 46, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 66, letterSpacing: 6, color: YEL, textShadow: shadowTxt, opacity: cl(f / 10) }}>{head}</div> : null}
    </AbsoluteFill>
  );
};

// 3 · AL REVÉS: "todos" = 1 sartén, 2 horno. En "Slow heat first" las dos fotos cambian de lugar → 1 HORNO LENTO, 2 SARTÉN AL ROJO.
export const Backwards: P<{ bed: string; first: { k: string; txt: string }; second: { k: string; txt: string }; swap: number; last: Beat; head: Beat }> =
  ({ a, d, bed, first, second, swap, last, head }) => {
    const { f, at } = useT(a);
    const u = ez((f - at(swap)) / 26), done = f >= at(swap) + 13;
    const L = 520, R = 1400, Y = 560;
    const x1 = L + (R - L) * u, x2 = R - (R - L) * u, lift = Math.sin(Math.PI * u) * 120;
    const hu = sp(f, at(head.t), 14, 150);
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 6, color: done ? YEL : "#fff", textShadow: shadowTxt }}>
          {done ? "THE OLD BUTCHER WAY" : "WHAT EVERYBODY DOES"}
        </div>
        {[{ s: first, x: x1, y: Y - lift, n: done ? 2 : 1, lab: done ? "HOT PAN · LAST" : "1 · THE PAN" }, { s: second, x: x2, y: Y + lift * 0.4, n: done ? 1 : 2, lab: done ? "SLOW OVEN · FIRST" : "2 · THE OVEN" }].map((p, i) => (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, translate: "-50% -50%", transform: `rotate(${i ? 2.5 : -2.5}deg)` }}>
            <Print k={p.s.k} w={680} h={430} f={f} mat={14} />
            <div style={{ position: "absolute", left: -34, top: -38 }}><Badge n={p.n} size={96} /></div>
            <div style={{ position: "absolute", left: "50%", bottom: -46, translate: "-50% 0" }}><Chip txt={p.lab} size={46} rot={i ? 2 : -2} bg={done && i === 1 ? YEL : "#FFFDF4"} /></div>
          </div>
        ))}
        {f < at(swap) + 4 ? <Mark kind="strike" x={L - 300} y={Y + 200} w={600} h={60} f={f} at={at(head.t) + 4} dur={10} sw={12} /> : null}
        {f >= at(head.t) && f < at(swap) ? <Note txt={head.txt} u={hu} x={680} y={880} rot={-2} size={70} /> : null}
        {f >= at(last.t) ? <Note txt={last.txt} u={sp(f, at(last.t), 14, 150)} x={1180} y={880} rot={2} size={80} /> : null}
      </AbsoluteFill>
    );
  };

// 4 · EL NÚMERO: foto del termómetro clavado; un anillo grande cuenta de n0 a n1 °F entre t0 y t1; chip "+10 a 15° en la sartén"; sello MEDIUM RARE.
export const ThermoCount: P<{ k: string; n0: number; n1: number; t0: number; t1: number; label: Beat; chip: Beat }> = ({ a, d, k, n0, n1, t0, t1, label, chip }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t0)) / Math.max(1, at(t1) - at(t0))), n = Math.round(n0 + (n1 - n0) * p);
  const cam = camAt(f, at, [{ t: a, s: 1.0, x: 960, y: 540 }, { t: t0, s: 1.12, x: 1100, y: 560 }], 1.4);
  const R0 = 190, circ = 2 * Math.PI * R0, fill = 0.35 + 0.5 * p;
  const lu = sp(f, at(label.t), 12, 160), cu = sp(f, at(chip.t), 14, 150);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={camStyle(cam)}><div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "60% 55%", transform: `scale(${1 + 0.1 * cl(f / Math.max(1, d))})` }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(8,6,4,0.62) 0%, rgba(8,6,4,0.2) 48%, rgba(8,6,4,0) 70%)" }} />
      <div style={{ position: "absolute", left: 120, top: 250, width: 2 * R0 + 60, height: 2 * R0 + 60 }}>
        <svg width={2 * R0 + 60} height={2 * R0 + 60} style={{ position: "absolute", left: 0, top: 0, transform: "rotate(-90deg)" }}>
          <circle cx={R0 + 30} cy={R0 + 30} r={R0} fill="rgba(15,12,10,0.72)" stroke="rgba(255,255,255,0.18)" strokeWidth={22} />
          <circle cx={R0 + 30} cy={R0 + 30} r={R0} fill="none" stroke={p >= 1 ? RED : "#F39C32"} strokeWidth={22} strokeLinecap="round" strokeDasharray={`${circ * fill} ${circ}`} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, lineHeight: 1 }}>{n}°</div>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 6, opacity: 0.85 }}>FAHRENHEIT</div>
        </div>
      </div>
      {f >= at(chip.t) ? <div style={{ position: "absolute", left: 150, top: 760, opacity: cl(cu * 1.4), transform: `translateY(${(1 - cu) * 20}px)` }}><Chip txt={chip.txt} size={46} rot={-2} /></div> : null}
      {f >= at(label.t) ? (
        <div style={{ position: "absolute", right: 120, top: 120, transform: `rotate(-8deg) scale(${1.6 - 0.6 * lu})`, opacity: cl(lu * 1.5) }}>
          <div style={{ border: `8px solid ${RED}`, color: RED, background: "rgba(255,253,244,0.92)", fontFamily: LABEL, fontWeight: 700, fontSize: 84, letterSpacing: 8, padding: "6px 34px", borderRadius: 10 }}>{label.txt}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 5 · LA CUENTA: a la izquierda el plato del restaurante con su precio; a la derecha la boleta de casa que se llena en sus palabras; al final el total y el tachón rojo.
export const PriceStack: P<{ bed: string; old: { k: string; price: string; t: number; tag?: string }; rows: { k: string; txt: string; price: string; t: number }[]; total: { price: string; t: number }; head?: string }> =
  ({ a, d, bed, old, rows, total, head }) => {
    const { f, at } = useT(a);
    const ou = sp(f, at(old.t), 14, 140), tu = sp(f, at(total.t), 12, 160);
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} />
        <div style={{ position: "absolute", left: 120, top: 210, opacity: cl(ou * 1.5), transform: `rotate(-3deg) translateY(${(1 - ou) * 40}px)` }}>
          <Print k={old.k} w={700} h={460} f={f} mat={14} />
          <div style={{ position: "absolute", left: 30, top: -40 }}><Chip txt={old.tag || "EATING OUT TODAY"} size={40} rot={-3} /></div>
          <div style={{ position: "absolute", right: -40, bottom: -50, fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: "#fff", textShadow: shadowTxt }}>{old.price}</div>
          {f >= at(total.t) ? <Mark kind="strike" x={380} y={430} w={420} h={90} f={f} at={at(total.t) + 6} dur={10} sw={16} /> : null}
        </div>
        <div style={{ position: "absolute", left: 1040, top: 150, width: 760, background: "#FBF7EC", borderRadius: 6, boxShadow: "0 40px 80px rgba(0,0,0,0.5)", padding: "28px 36px 30px", transform: "rotate(1.5deg)" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 5, color: C.ink, borderBottom: `3px dashed ${C.inkSoft}`, paddingBottom: 10, marginBottom: 14 }}>{head || "AT HOME"}</div>
          {rows.map((r, i) => {
            const u = sp(f, at(r.t), 14, 150);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 132, opacity: f >= at(r.t) ? cl(u * 1.5) : 0, transform: `translateX(${(1 - u) * 60}px)` }}>
                <div style={{ width: 170, height: 112, overflow: "hidden", borderRadius: 4, boxShadow: "0 6px 14px rgba(0,0,0,0.3)" }}><Img src={img(r.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                <div style={{ flex: 1, fontFamily: SERIF, fontSize: 46, color: C.ink }}>{r.txt}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: C.ink }}>{r.price}</div>
              </div>
            );
          })}
          <div style={{ borderTop: `4px solid ${C.ink}`, marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: f >= at(total.t) ? cl(tu * 1.5) : 0 }}>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 48, letterSpacing: 5, color: C.ink }}>TOTAL</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: RED, transform: `scale(${1.3 - 0.3 * tu})` }}>{total.price}</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  };

// 6 · MENU CARD (Lou): la foto del plato a pantalla completa con empuje lento; arriba a la izquierda el número de la cuenta regresiva
// en un círculo amarillo; abajo entra una tira de pizarra de letras blancas (el menú del diner) con el nombre y, en SU palabra, el precio.
export const MenuCard: P<{ bed: string; n: number; of?: number; name: string; price: string; t: number; tag?: string }> = ({ a, d, bed, n, of = 25, name, price, t, tag }) => {
  const { f, at } = useT(a);
  const nu = sp(f, 2, 12, 150), bu = sp(f, 5, 14, 130), pu = sp(f, at(t), 10, 170);
  const big = name.length > 18 ? 78 : 96;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0e0b08" }}>
      <FullPhoto k={bed} f={f} d={Math.max(1, d)} z={[1.03, 1.13]} />
      <div style={{ position: "absolute", left: 70, top: 60, opacity: cl(nu * 1.4), transform: `scale(${0.6 + 0.4 * nu}) rotate(${(1 - nu) * -20}deg)` }}>
        <div style={{ width: 210, height: 210, borderRadius: 105, background: YEL, color: "#141414", fontFamily: SERIF, fontWeight: 900, fontSize: n > 9 ? 112 : 128,
          display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(0,0,0,0.55)", letterSpacing: -4 }}>#{n}</div>
        <div style={{ marginTop: 10, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: "#fff", textShadow: shadowTxt }}>OF {of}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", transform: `translateY(${(1 - bu) * 260}px)` }}>
        <div style={{ background: "#1b1b1b", backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 14px)", border: "10px solid #9a7b4f",
          borderRadius: 8, boxShadow: "0 30px 70px rgba(0,0,0,0.6)", padding: "18px 48px 20px", display: "flex", alignItems: "center", gap: 40, maxWidth: 1700 }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: big, letterSpacing: 6, color: "#F4F1E8", whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: big * 0.9, color: YEL, whiteSpace: "nowrap", opacity: f >= at(t) ? cl(pu * 1.6) : 0,
            transform: `scale(${f >= at(t) ? 1.5 - 0.5 * pu : 1})` }}>{price}</div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 70, top: 70, opacity: cl(bu * 1.3) }}><Chip txt={tag || "ON MY MENU · 1970"} size={36} rot={2} /></div>
    </AbsoluteFill>
  );
};
