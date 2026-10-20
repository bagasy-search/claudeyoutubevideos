// apex06 v2 · el ranking que vive todo el video: los 8 felinos salen de su punto del mapa y vuelan a su casillero
// (#8 inofensivo → #1 devorador de hombres). Nunca aparece por corte: entra volando, se desliza abajo y vuelve.
import React from "react";
import { Img, interpolate } from "remotion";
import { at, Cam, pj, sf, SANS, RED, GOLD, ORANGE, clamp, ease, pop, ramp, FPS } from "./lib";

export type CatK = "snowleo" | "cheetah" | "lynx" | "jaguar" | "cougar" | "leopard" | "lion" | "tiger";
export const RANK: { k: CatK; name: string; lon: number; lat: number; ar: number }[] = [
  { k: "snowleo", name: "Snow leopard", lon: 84, lat: 33, ar: 1119 / 668 },
  { k: "cheetah", name: "Cheetah", lon: 24, lat: -21, ar: 1290 / 669 },
  { k: "lynx", name: "Lynx", lon: -105, lat: 57, ar: 731 / 718 },
  { k: "jaguar", name: "Jaguar", lon: -60, lat: -9, ar: 689 / 340 },
  { k: "cougar", name: "Cougar", lon: -112, lat: 41, ar: 517 / 580 },
  { k: "leopard", name: "Leopard", lon: 22, lat: 3, ar: 1237 / 761 },
  { k: "lion", name: "Lion", lon: 35, lat: -5, ar: 607 / 416 },
  { k: "tiger", name: "Tiger", lon: 80, lat: 23, ar: 619 / 721 },
];
const SW = 196, GAP = 8, X0 = 960 - (8 * SW + 7 * GAP) / 2 + SW / 2, Y = 952;
export const slotXY = (i: number): [number, number] => [X0 + i * (SW + GAP), Y];

// tiempos (anclados a la voz)
const POP = at("ranking the big cats"), FLY = at("from the ones you could"), LUNCH = at("lunch"), TWIST = at("here is the twist");
const NOTL = at("not the lion"), OUT = at("before we start") + 0.3;
// ventanas en las que el ranking está en pantalla [entra, sale] (los capítulos siguientes suman las suyas)
const N8 = at("number 8"), N7 = at("number 7"), N6 = at("number 6"), H3 = at("so those are the harmless"), N5 = at("number five the jaguar"), N4 = at("number 4"),
  ACC = at("so far every cat"), TOP3 = at("the top three are different"), N3 = at("number three the leopard"), N2 = at("number 2"), SECOND = at("it still only gets second"),
  N1 = at("number one the tiger"), FIN = at("so here is the final ranking"), BOT = at("at the bottom the snow"), MID = at("in the middle the jaguar"), TOP = at("and at the top the three"),
  FLIP = at("the ranking flips"), CAM = at("it was the one holding"), END = at("watch the next case") + 3;
const SHOWS: [number, number][] = [[FLY - 0.3, OUT], [N8 - 0.2, N8 + 4.2], [N7 - 0.2, N7 + 4.2], [N6 - 0.2, N6 + 4.0], [H3 - 0.3, H3 + 3.6], [N5 - 0.2, N5 + 4.2], [N4 - 0.2, N4 + 4.0],
  [ACC - 0.3, at("into a habit") + 1.6], [N3 - 0.2, N3 + 4.2], [N2 - 0.2, N2 + 4.2], [SECOND - 0.6, at("in a different league") + 1.4], [N1 - 0.3, N1 + 5.0], [FIN - 0.3, END]];
// casilleros resaltados [desde, hasta, índices, color]
const GLOW: [number, number, number[], string][] = [[N8, N8 + 4, [0], GOLD], [N7, N7 + 4, [1], GOLD], [N6, N6 + 4, [2], GOLD], [H3, H3 + 3.5, [0, 1, 2], "#3fb950"],
  [N5, N5 + 4, [3], ORANGE], [N4, N4 + 4, [4], ORANGE], [ACC, TOP3, [0, 1, 2, 3, 4], "#3fb950"], [TOP3, TOP3 + 9, [5, 6, 7], RED], [N3, N3 + 4, [5], RED], [N2, N2 + 4, [6], RED],
  [SECOND, SECOND + 6, [6], RED], [N1, N1 + 5, [7], RED], [BOT, MID, [0, 1, 2], "#3fb950"], [MID, TOP, [3, 4], ORANGE], [TOP, FLIP - 1, [5, 6, 7], RED]];
// el #1 se revela al decir "number one, the tiger"; "the ranking flips" = los felinos invierten su lugar
const REVEAL1 = N1;

export const RankBar: React.FC<{ c: Cam; f: number; t: number }> = ({ c, f, t }) => {
  const sh = SHOWS.find(([a, b]) => t >= a - 0.1 && t <= b + 0.8);
  const popping = t >= POP - 0.1 && t < FLY + 2;
  if (!sh && !popping) return null;
  const inK = sh ? Math.min(ramp(t, sh[0], 0.5), 1 - ramp(t, sh[1], 0.6)) : 0;
  const slide = (1 - inK) * 260; // el ranking se desliza hacia abajo al salir
  const q = Math.sin(t * 6) * 0.5 + 0.5;
  return (
    <>
      {/* riel con la escala */}
      {inK > 0 && (
        <div style={{ position: "absolute", left: X0 - SW / 2 - 14, top: Y - 128 + slide, width: 8 * SW + 7 * GAP + 28, height: 250, borderRadius: 18, background: "rgba(8,12,18,.78)", border: "3px solid rgba(255,255,255,.85)", boxShadow: "0 16px 40px rgba(0,0,0,.55)", opacity: inK }}>
          <div style={{ position: "absolute", left: 20, right: 20, top: 12, height: 10, borderRadius: 5, background: "linear-gradient(90deg,#3fb950,#ffd23a 45%,#ff8a2a 70%,#e3261c)" }} />
          <div style={{ position: "absolute", left: 22, top: 26, fontFamily: SANS, fontWeight: 900, fontSize: 22, color: "#7ee08a", letterSpacing: 2 }}>HARMLESS</div>
          <div style={{ position: "absolute", right: 22, top: 26, fontFamily: SANS, fontWeight: 900, fontSize: 22, color: "#ff5a4a", letterSpacing: 2 }}>MAN-EATER</div>
        </div>
      )}
      {RANK.map((r, i) => {
        const fk = interpolate(t, [FLIP + i * 0.06, FLIP + 0.9 + i * 0.06], [0, 1], { ...clamp, easing: ease });
        const [sxa, sy00] = slotXY(i), [sxb] = slotXY(7 - i), sx = sxa + (sxb - sxa) * fk, sy0 = sy00 - Math.sin(Math.PI * fk) * (i < 4 ? 70 : -40), sy = sy0 + slide;
        const pos = fk > 0.5 ? 7 - i : i; // lugar que ocupa (para el número)
        const g = GLOW.find(([a, b, ix]) => t >= a && t <= b && ix.includes(i));
        const gk = g ? Math.min(ramp(t, g[0], 0.3), 1 - ramp(t, g[1] - 0.3, 0.3)) : 0;
        const tf = FLY + i * 0.2, kf = interpolate(t, [tf, tf + 0.85], [0, 1], { ...clamp, easing: ease });
        const p0 = pop(f, POP + i * 0.09, 10);
        const [mx, my] = pj(c, r.lon, r.lat);
        // antes del vuelo: parado sobre su punto del mapa; después: en su casillero
        const x = mx + (sx - mx) * kf, y = my - 10 + (sy + 34 - (my - 10)) * kf - Math.sin(Math.PI * kf) * 120;
        const h = 104 + (92 - 104) * kf;
        const rv = r.k === "tiger" ? ramp(t, REVEAL1 + 0.1, 0.6) : 1, hidden = rv < 1;
        const notLion = r.k === "lion" && t < N2 ? ramp(t, NOTL + 0.25, 0.3) : 0;
        const slotOn = inK * ramp(t, tf + 0.6, 0.3);
        const s = (kf > 0 ? 1 : p0) * (sh && t > sh[1] + 0.6 ? 0 : 1);
        if (t < POP - 0.05 || s <= 0.001) return null;
        return (
          <React.Fragment key={r.k}>
            {slotOn > 0 && (
              <div style={{ position: "absolute", left: sx - SW / 2 + 6, top: sy - 64, width: SW - 12, height: 174, borderRadius: 12, background: i === 7 && t < N1 + 5 ? `rgba(227,38,28,${0.18 + 0.25 * ramp(t, LUNCH, 0.3) * (t > TWIST ? q : 1)})` : gk > 0 ? `${g![3]}${Math.round(40 + 50 * gk).toString(16)}` : "rgba(255,255,255,.06)", border: `${gk > 0 ? 4 : 2}px solid ${gk > 0 ? g![3] : i === 7 && t > LUNCH ? RED : "rgba(255,255,255,.25)"}`, opacity: slotOn, transform: `scale(${1 + 0.06 * gk})` }}>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 8, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 21, color: "#fff", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  <span style={{ color: pos === 7 ? "#ff5a4a" : GOLD }}>#{8 - pos}</span> {t < REVEAL1 + 0.3 && r.k === "tiger" ? "???" : r.name}
                </div>
              </div>
            )}
            <Img src={sf(`cut/${r.k}.png`)} style={{ position: "absolute", left: x, top: y, height: h, maxWidth: SW - 20, objectFit: "contain", transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: "50% 100%", filter: `drop-shadow(0 8px 8px rgba(0,0,0,.5)) ${hidden ? `brightness(${rv.toFixed(2)})` : ""} grayscale(${t > N1 ? ramp(t, FLIP + 1.2, 0.6) * 0.5 : notLion * 0.6})`, opacity: hidden ? 0.92 : 1 }} />
            {hidden && kf > 0.9 && t < REVEAL1 && <div style={{ position: "absolute", left: sx, top: sy - 6, transform: `translate(-50%,-50%) scale(${1 + 0.12 * q * ramp(t, TWIST, 0.3)})`, fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#fff", textShadow: `0 0 18px ${RED}, 0 3px 0 #000` }}>?</div>}
            {notLion > 0 && (
              <svg width={SW} height={150} style={{ position: "absolute", left: sx - SW / 2, top: sy - 90 }}>
                <line x1={30} y1={20} x2={30 + (SW - 60) * notLion} y2={20 + 100 * notLion} stroke={RED} strokeWidth={12} strokeLinecap="round" />
                <line x1={SW - 30} y1={20} x2={SW - 30 - (SW - 60) * ramp(t, NOTL + 0.45, 0.3)} y2={20 + 100 * ramp(t, NOTL + 0.45, 0.3)} stroke={RED} strokeWidth={12} strokeLinecap="round" />
              </svg>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
export const RANK_T = { POP, FLY, LUNCH, TWIST, NOTL, OUT, FPS, N1, FIN, FLIP, CAM, END };
