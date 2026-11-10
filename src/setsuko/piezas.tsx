// setsuko01 · escenas gráficas propias (una mecánica distinta por escena). Reciben t global, a/b = inicio/fin de la escena.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FR, Hanko, Palabras, Pincel, Prenda, PZ, RAIL_Y, Riel, SANS, SERIF, Washi, cl, e, eo, h, lerp, slotX, spr, swing, tela } from "./lib";

type SP = { t: number; a: number; b: number; arg?: string };
const cap: React.CSSProperties = { fontFamily: SANS, fontWeight: 400, letterSpacing: "0.32em", textTransform: "uppercase", color: C.sumi };

// ── 1/9 … 9/9: la prenda cae sobre el riel, se hamaca y se suma a las que ya cuelgan
export const Rail: React.FC<SP> = ({ t, a, b, arg }) => {
  const n = Number(arg), z = PZ[n - 1], d = b - a;
  const drop = spr(t, a + 0.12, 1.25), guarda = d >= 3.5 ? e(t, b - 0.95, b - 0.2) : 0;
  const px = (i: number) => 175 + i * 70;
  const bx = lerp(930, px(n - 1), guarda), bw = lerp(520, 112, guarda);
  const txt = a + 0.45;
  return <Washi>
    <Riel />
    {PZ.slice(0, n - 1).map((q, i) => <Prenda key={i} f={q.f} hook={q.hook} x={px(i)} y={RAIL_Y} w={112} rot={swing(t, a + 0.5, 2.2, 1.6, 6 + i * 0.4)} />)}
    <Prenda f={z.f} hook={z.hook} x={bx} y={lerp(-1000, RAIL_Y, cl(drop))} w={bw} rot={swing(t, a + 0.3, 7, 1.9, 6.4)} />
    <div style={{ position: "absolute", left: 1290, top: 250, width: 560 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 26, fontFamily: SERIF, color: C.sumi }}>
        <span style={{ fontSize: 310, lineHeight: 0.9, opacity: eo(t, txt, 0.4), transform: `translateY(${(1 - eo(t, txt, 0.5)) * 40}px)`, display: "inline-block" }}>{n}</span>
        <span style={{ fontSize: 104, opacity: eo(t, txt + 0.15, 0.4) * 0.45 }}>/ 9</span>
        <span style={{ fontSize: 96, color: C.hanko, opacity: eo(t, txt + 0.25, 0.4), marginLeft: "auto" }}>{z.kan}</span>
      </div>
      <Pincel t={t} at={txt + 0.2} x={0} y={315} w={540} hgt={10} />
      <Palabras t={t} at={txt + 0.3} txt={z.name} style={{ fontFamily: SERIF, fontSize: 78, color: C.sumi, marginTop: 60, lineHeight: 1.15 }} />
      <div style={{ ...cap, fontSize: 26, marginTop: 24, lineHeight: 1.5, opacity: eo(t, txt + 0.65, 0.5) * 0.75 }}>{z.sub}</div>
    </div>
  </Washi>;
};

// ── gancho: las nueve caen de a una y queda el 9
export const Rail9: React.FC<SP> = ({ t, a }) => {
  const solo = FR(2);
  return <Washi>
    <Riel p={eo(t, a, 0.45)} />
    {PZ.map((q, i) => { const at = a + 0.15 + i * 0.13; return <Prenda key={i} f={q.f} hook={q.hook} x={slotX(i)} y={lerp(-420, RAIL_Y, cl(spr(t, at, 1.5)))} w={158} rot={swing(t, at + 0.1, 8, 2.2, 7 + i * 0.3)} />; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 44, fontFamily: SERIF, color: C.sumi }}>
      <span style={{ fontSize: 96, opacity: eo(t, solo, 0.3), transform: `translateY(${(1 - eo(t, solo, 0.35)) * 24}px)`, display: "inline-block", fontStyle: "normal" }}>only</span>
      <span style={{ fontSize: 470, lineHeight: 0.85, display: "inline-block", opacity: eo(t, a + 0.5, 0.3), transform: `scale(${lerp(1.5, 1, eo(t, a + 0.5, 0.45))})` }}>9</span>
      <span style={{ fontSize: 96, opacity: eo(t, a + 0.9, 0.4) }}>pieces</span>
    </div>
    <Pincel t={t} at={solo + 0.1} x={640} y={965} w={640} hgt={12} col={C.hanko} />
  </Washi>;
};

// ── "Nine hangers. I can see every one.": el riel completo, una brisa lo recorre
export const RailFull: React.FC<SP> = ({ t, a }) => (
  <Washi>
    <Riel y={RAIL_Y + 110} />
    {PZ.map((q, i) => <Prenda key={i} f={q.f} hook={q.hook} x={slotX(i)} y={RAIL_Y + 110} w={lerp(196, 188, eo(t, a, 3))} rot={3.4 * Math.sin((t - a) * 2.3 - i * 0.55) * Math.exp(-0.25 * (t - a))} />)}
    <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center" }}>
      <Palabras t={t} at={a + 0.15} txt="nine hangers" style={{ justifyContent: "center", fontFamily: SERIF, fontSize: 100, color: C.sumi }} />
      <div style={{ ...cap, fontSize: 28, marginTop: 20, opacity: eo(t, FR(182), 0.5) * 0.7 }}>I can see every one</div>
    </div>
  </Washi>
);

// ── regla 3: sale una, entra una. La segunda rebota; la azul también.
export const Cambio: React.FC<SP> = ({ t, a }) => {
  const sale = a + 1.5, entra = FR(175) + 3.2, dos = FR(176), azul = FR(177);
  const out = eo(t, sale, 0.8), inn = spr(t, entra, 1.1);
  const reb = (at: number) => { const x = t - at; return x < 0 ? 1 : x < 0.45 ? 1 - eo(t, at, 0.45) * 0.62 : 0.38 + eo(t, at + 0.55, 0.5) * 0.9; }; // entra hasta 38 % y sale despedida
  const X0 = slotX(2), RY = RAIL_Y + 110;
  return <Washi>
    <>
      <Riel y={RY} />
      {PZ.map((q, i) => i === 2 ? null : <Prenda key={i} f={q.f} hook={q.hook} x={slotX(i)} y={RY} w={176} rot={swing(t, a + 0.2, 1.6, 1.2, 5 + i)} op={0.55} />)}
      {/* la camisa gastada se va hacia abajo y se apaga */}
      <Prenda f="p3" hook={0.035} x={X0} y={RY + out * 620} w={176} rot={out * 14 + swing(t, a + 0.2, 3, 1.2, 6)} op={1 - out} style={{ filter: `saturate(${1 - e(t, a + 0.3, sale) * 0.7}) contrast(${1 - e(t, a + 0.3, sale) * 0.25})` }} />
      {/* entra UNA camisa de lino */}
      {t >= entra && <Prenda f="p3" hook={0.035} x={X0} y={lerp(-420, RY, cl(inn))} w={176} rot={swing(t, entra + 0.1, 8, 2, 7)} />}
      {/* "Not two." */}
      {t >= dos && t < dos + 1.3 && <Prenda f="p3" hook={0.035} x={lerp(X0 + 60, 2150, reb(dos))} y={RY - 4} w={176} rot={-10 * (1 - reb(dos))} op={0.9} />}
      {/* "Not one more in blue" */}
      {t >= azul && t < azul + 1.6 && <Prenda f="pblue" hook={0.065} x={lerp(X0 + 70, 2150, reb(azul + 0.25))} y={RY - 4} w={176} rot={-12 * (1 - reb(azul + 0.25))} />}
    </>
    <div style={{ position: "absolute", left: 0, right: 0, top: 740, display: "flex", justifyContent: "center", gap: 90, fontFamily: SERIF, fontSize: 104, color: C.sumi }}>
      <span style={{ opacity: eo(t, entra, 0.4) }}>one in</span>
      <span style={{ opacity: eo(t, a + 0.3, 0.4), color: C.hanko }}>·</span>
      <span style={{ opacity: eo(t, sale, 0.4) }}>one out</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", ...cap, fontSize: 30 }}>
      <span style={{ opacity: e(t, dos, dos + 0.25) * (1 - e(t, azul - 0.1, azul + 0.1)) }}>not two</span>
      <span style={{ opacity: e(t, azul + 0.3, azul + 0.6), position: "absolute", left: 0, right: 0 }}>not one more in blue</span>
    </div>
    <Pincel t={t} at={dos + 0.4} dur={0.22} x={X0 + 130} y={520} w={230} hgt={16} rot={-38} col={C.hanko} op={(1 - e(t, dos + 1.0, dos + 1.25)) * 0.9} />
    <Pincel t={t} at={azul + 0.65} dur={0.22} x={X0 + 130} y={520} w={230} hgt={16} rot={-38} col={C.hanko} op={(1 - e(t, azul + 1.4, azul + 1.7)) * 0.9} />
  </Washi>;
};

// ── mapa de Kyoto dibujado a tinta; la cámara baja hasta la calle Muromachi y el sello marca la tienda
const CALLES: [string, number, number][] = [ // [d, grosor, cuándo arranca]
  ["M1500 40 C1470 250 1535 430 1490 640 C1460 800 1500 930 1470 1060", 26, 0.0],          // río Kamo
  ["M300 250 H1420", 5, 0.35], ["M300 420 H1440", 5, 0.45], ["M300 560 H1450", 4, 0.55], ["M300 700 H1445", 6, 0.65], ["M300 860 H1440", 5, 0.75], // Marutamachi, Oike, Sanjo, Shijo, Gojo
  ["M430 120 V1000", 5, 0.5], ["M905 120 V1000", 4, 0.7], ["M1010 120 V1000", 6, 0.6], ["M1290 120 V1000", 5, 0.8],                           // Horikawa, Muromachi, Karasuma, Kawaramachi
];
export const Mapa: React.FC<SP> = ({ t, a, b }) => {
  const k = e(t, a + 1.3, b - 0.6), z = lerp(1, 2.05, k), sx = 905, sy = 630, sello = FR(3) + 3.9;
  return <Washi>
    <AbsoluteFill style={{ transformOrigin: `${sx}px ${sy}px`, transform: `translate(${(960 - sx) * k * 0.55}px, ${(540 - sy) * k}px) scale(${z})` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={640} y={120} width={260} height={125} fill="none" stroke={C.sumi} strokeOpacity={0.25 * e(t, a + 0.9, a + 1.4)} strokeWidth={3} />
        {CALLES.map(([d, w, at], i) => <path key={i} d={d} fill="none" stroke={i === 0 ? "#5b7691" : i === 7 ? C.sumi : "#3a3632"} strokeOpacity={i === 0 ? 0.5 : i === 7 ? 0.95 : 0.5} strokeWidth={w} strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(t, a + at, 0.9)} />)}
        {[0, 1, 2].map((i) => <path key={"m" + i} d={`M${1600 + i * 95} ${420 + i * 60} q45 -${110 + i * 20} 95 0`} fill="none" stroke={C.sumi} strokeOpacity={0.3 * e(t, a + 1 + i * 0.1, a + 1.6)} strokeWidth={4} strokeLinecap="round" />)}
      </svg>
      {[["Kamo River", 1525, 300, 0.9, 90], ["Shijō", 320, 655, 1.1, 0], ["Sanjō", 320, 516, 1.15, 0], ["Karasuma", 1022, 150, 1.2, 90], ["Imperial Palace", 652, 170, 1.25, 0]].map(([s2, x, y, at, r], i) =>
        <div key={i} style={{ position: "absolute", left: x as number, top: y as number, ...cap, fontSize: 17, letterSpacing: "0.22em", opacity: e(t, a + (at as number), a + (at as number) + 0.4) * 0.6, transformOrigin: "0 0", transform: `rotate(${r}deg)` }}>{s2}</div>)}
      <div style={{ position: "absolute", left: 842, top: 300, fontFamily: SERIF, fontSize: 30, color: C.sumi, writingMode: "vertical-rl", letterSpacing: "0.2em", opacity: e(t, a + 1.6, a + 2.1) }}>室町通</div>
      <div style={{ position: "absolute", left: 925, top: 742, fontFamily: SERIF, fontSize: 34, color: C.sumi, opacity: e(t, a + 1.9, a + 2.4), whiteSpace: "nowrap" }}>Muromachi Street</div>
      <Hanko t={t} at={sello} x={sx} y={sy} size={58} txt="店" rot={-8} />
      <div style={{ position: "absolute", left: sx + 44, top: sy - 44, whiteSpace: "nowrap", opacity: e(t, sello + 0.1, sello + 0.5) }}>
        <div style={{ fontFamily: SERIF, fontSize: 40, color: C.sumi }}>the kimono shop</div>
        <div style={{ ...cap, fontSize: 15, color: C.hanko, marginTop: 4 }}>38 years behind the counter</div>
      </div>
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 96, top: 80, opacity: 1 - e(t, a + 2.2, a + 3.0) }}>
      <div style={{ fontFamily: SERIF, fontSize: 150, color: C.sumi, lineHeight: 1, opacity: eo(t, a + 0.1, 0.5) }}>京都</div>
      <div style={{ ...cap, fontSize: 30, marginTop: 14, opacity: eo(t, a + 0.3, 0.5) * 0.7 }}>Kyoto</div>
    </div>
  </Washi>;
};

// ── la cortina noren se abre y deja ver el índice: 9 prendas · 5 colores · 30 conjuntos · 3 reglas
const Panel: React.FC<{ lado: -1 | 1; p: number; t: number }> = ({ lado, p, t }) => (
  <div style={{ position: "absolute", top: -30, left: lado < 0 ? -20 : 962, width: 978, height: 1140, ...tela(C.ai), transformOrigin: lado < 0 ? "0 0" : "100% 0",
    transform: `skewX(${lado * (-p * 26) + Math.sin(t * 1.7 + lado) * 0.5 * (1 - p)}deg) scaleX(${1 - p * 0.72}) translateY(${-p * 40}px)`, boxShadow: "0 30px 60px rgba(0,0,0,.35)" }}>
    <div style={{ position: "absolute", left: lado < 0 ? 600 : 80, top: 330, width: 300, height: 300, borderRadius: "50%", border: "10px solid rgba(240,235,222,.92)", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: SERIF, fontSize: 190, color: "rgba(240,235,222,.95)", lineHeight: 1 }}>{lado < 0 ? "九" : "枚"}</div>
    {[0.12, 0.5, 0.88].map((q, i) => <div key={i} style={{ position: "absolute", left: `${q * 100}%`, top: 0, width: 2, height: "100%", background: "rgba(0,0,0,.12)" }} />)}
  </div>
);
const IDX: [number, string, string, string][] = [[12, "九", "9", "pieces"], [13, "五", "5", "colours"], [14, "三十", "30", "outfits"], [15, "三", "3", "rules"]];
export const Agenda: React.FC<SP> = ({ t }) => {
  const a = FR(11); // la escena ocupa dos planos del plan (011 cortina + 012 índice): siempre se ancla a la frase 11
  const abre = eo(t, a + 1.0, 1.5);
  return <Washi>
    <div style={{ position: "absolute", left: 110, right: 110, top: 130, display: "flex", justifyContent: "space-between" }}>
      {IDX.map(([f, kan, num, lab], i) => { const at = FR(f), p = eo(t, at, 0.5);
        return <div key={i} style={{ width: 400, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 36}px)` }}>
          <div style={{ fontFamily: SERIF, fontSize: 88, color: C.hanko, height: 200, writingMode: "vertical-rl", margin: "0 auto", letterSpacing: "0.1em" }}>{kan}</div>
          <div style={{ fontFamily: SERIF, fontSize: 340, lineHeight: 1, color: C.sumi, marginTop: 20 }}>{num}</div>
          <div style={{ height: 3, background: C.sumi, opacity: 0.8, width: `${eo(t, at + 0.2, 0.5) * 60}%`, margin: "34px auto 30px" }} />
          <div style={{ ...cap, fontSize: 44 }}>{lab}</div>
        </div>; })}
    </div>
    <Hanko t={t} at={FR(15) + 1.5} x={1740} y={960} size={130} />
    {abre < 0.999 && <><div style={{ position: "absolute", left: -40, top: -22, width: 2000, height: 34, background: "linear-gradient(180deg,#d8bd7c,#8e7440)", zIndex: 3, opacity: 1 - e(t, a + 2.2, a + 2.6) }} />
      <Panel lado={-1} p={abre} t={t} /><Panel lado={1} p={abre} t={t} /></>}
  </Washi>;
};

// ── un rollo de tela (tanmono), cortes rectos, las piezas arman el kimono y vuelven al rollo: no sobra nada
const YAG: React.CSSProperties = { backgroundColor: "#1c2f52", backgroundImage: "repeating-linear-gradient(90deg, transparent 0 22px, rgba(235,235,225,.85) 22px 25px, transparent 25px 46px), repeating-linear-gradient(0deg, transparent 0 9px, #1c2f52 9px 20px)" };
const CORTES = [0.09, 0.18, 0.45, 0.72, 0.86]; // fracciones del largo donde corta la tijera
const PIEZAS: { x0: number; x1: number; half?: 0 | 1; to: [number, number, number] }[] = [ // posición en la tira → destino [x,y,rot] en forma de kimono
  { x0: 0, x1: 0.09, to: [520, 330, 0] }, { x0: 0.09, x1: 0.18, to: [1250, 330, 0] },        // mangas
  { x0: 0.18, x1: 0.45, to: [800, 560, 90] }, { x0: 0.45, x1: 0.72, to: [950, 560, 90] },    // cuerpo ×2
  { x0: 0.72, x1: 0.86, half: 0, to: [690, 650, 90] }, { x0: 0.72, x1: 0.86, half: 1, to: [1060, 650, 90] }, // okumi ×2
  { x0: 0.86, x1: 1, half: 0, to: [875, 270, 0] }, { x0: 0.86, x1: 1, half: 1, to: [875, 215, 0] },          // cuello ×2
];
export const Tanmono: React.FC<SP> = ({ t, a, b, arg }) => {
  const corto = arg === "2", X0 = 250, L = 1480, Y = 500, H = 150;
  const desen = eo(t, a + 0.1, corto ? 0.7 : 1.3), tc = corto ? FR(186) : a + 2.0, arma = corto ? eo(t, FR(187), 0.9) : e(t, a + 3.3, a + 4.6), vuelve = corto ? 0 : e(t, FR(70) + 0.1, FR(70) + 1.2), m = arma * (1 - vuelve);
  return <Washi>
    <div style={{ position: "absolute", left: X0 - 150, top: Y - 35, width: 150, height: 220, borderRadius: 26, ...YAG, boxShadow: "inset -18px 0 26px rgba(0,0,0,.45), 0 22px 30px rgba(0,0,0,.22)", opacity: 1 - m * 0.75 }} />
    {PIEZAS.map((q, i) => { const w = (q.x1 - q.x0) * L, hh = q.half === undefined ? H : H / 2, x = X0 + q.x0 * L, y = Y + (q.half === 1 ? H / 2 : 0);
      const vis = cl((desen - q.x0) / (q.x1 - q.x0)), sep = e(t, tc + 0.2, tc + 0.7) * (1 - vuelve);
      return <div key={i} style={{ position: "absolute", left: lerp(x + (i - 3.5) * 5 * sep, q.to[0] - w / 2 + 85, m), top: lerp(y, q.to[1] - hh / 2 + 60, m), width: w * vis, height: hh, ...YAG, overflow: "hidden",
        transform: `rotate(${q.to[2] * m}deg)`, boxShadow: "0 14px 22px rgba(20,20,40,.22)" }} />; })}
    {CORTES.map((c, i) => { const at = tc + i * 0.14, p = eo(t, at, 0.18) * (1 - m); return p > 0 ? <div key={i} style={{ position: "absolute", left: X0 + c * L - 1.5, top: Y - 34, width: 3, height: (H + 68) * p, background: `repeating-linear-gradient(180deg, ${C.hanko} 0 12px, transparent 12px 20px)` }} /> : null; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center" }}>
      <Palabras t={t} at={a + 0.2} txt="one roll of cloth" style={{ justifyContent: "center", fontFamily: SERIF, fontSize: 92, color: C.sumi }} />
      <div style={{ ...cap, fontSize: 26, marginTop: 16, opacity: eo(t, a + 0.9, 0.5) * (1 - e(t, tc - 0.1, tc + 0.3)) * 0.7 }}>about 12 metres long · 37 cm wide</div>
      <div style={{ ...cap, fontSize: 26, marginTop: -30, opacity: e(t, tc, tc + 0.4) * 0.8 }}>cut only in straight lines</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 905, textAlign: "center", fontFamily: SERIF, fontSize: 76, color: C.sumi, opacity: corto ? eo(t, FR(187), 0.4) : e(t, FR(70), FR(70) + 0.4) }}>nothing wasted</div>
    {(corto ? t >= FR(187) + 0.5 : t >= FR(70) + 1.1) && <Hanko t={t} at={(corto ? FR(187) + 0.7 : FR(70) + 1.3)} x={1420} y={935} size={104} txt="掟" />}
    <div style={{ display: "none" }}>{b}</div>
  </Washi>;
};

// ── "No red. No pink. No flowers.": tres telas, una pincelada las tacha
const FLOR: React.CSSProperties = { backgroundColor: "#efe3d6", backgroundImage: "radial-gradient(circle at 25% 30%, #d9577a 0 9%, transparent 10%), radial-gradient(circle at 70% 22%, #e9a13b 0 7%, transparent 8%), radial-gradient(circle at 55% 68%, #c33d5e 0 11%, transparent 12%), radial-gradient(circle at 18% 78%, #6f9a5a 0 6%, transparent 7%), radial-gradient(circle at 85% 80%, #d9577a 0 8%, transparent 9%)", backgroundSize: "150px 150px" };
export const NoColores: React.FC<SP> = ({ t, a, b }) => {
  const T = [FR(89), FR(90), FR(91)], S = [tela("#b3242b"), tela("#e7a3b5", true), FLOR], N = ["red", "pink", "flowers"];
  return <Washi>
    {T.map((at, i) => { const p = spr(t, at - 0.1, 1.4), x = 200 + i * 560;
      return <div key={i} style={{ position: "absolute", left: x, top: 150, width: 400, height: 530, opacity: cl(p * 3) }}>
        <div style={{ width: "100%", height: "100%", ...S[i], borderRadius: 6, boxShadow: "0 26px 40px rgba(30,20,10,.25)", transform: `rotate(${(i - 1) * 3 + (1 - cl(p)) * 12}deg) translateY(${(1 - cl(p)) * -260}px)`, filter: `saturate(${1 - e(t, at + 0.35, at + 0.8) * 0.75})` }} />
        <Pincel t={t} at={at + 0.25} dur={0.2} x={-50} y={460} w={570} hgt={30} rot={-46} />
        <div style={{ ...cap, fontSize: 38, textAlign: "center", marginTop: 50, opacity: eo(t, at + 0.1, 0.3) }}>no {N[i]}</div>
      </div>; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", fontFamily: SERIF, fontSize: 110, color: C.sumi, opacity: eo(t, FR(92), 0.4) }}>why?</div>
    <div style={{ display: "none" }}>{a + b}</div>
  </Washi>;
};

// ── muestrario: las cinco tarjetas de tela
export const COLORES = [
  { f: 95, kan: "墨", ro: "sumi", en: "ink black", col: "#1f1d1c" }, { f: 99, kan: "生成り", ro: "kinari", en: "unbleached", col: "#e7dcc3", claro: true },
  { f: 103, kan: "藍", ro: "ai", en: "indigo", col: "#1d3a63" }, { f: 106, kan: "茶", ro: "cha", en: "tea brown", col: "#7a4a2a" }, { f: 110, kan: "鼠", ro: "nezumi", en: "mouse grey", col: "#8b8a86" },
];
export const Tarjeta: React.FC<{ i: number; t: number; at: number; w?: number; style?: React.CSSProperties }> = ({ i, t, at, w = 300, style }) => {
  const c = COLORES[i], hgt = w * 1.36, r = eo(t, at + 0.25, 0.5);
  return <div style={{ width: w, height: hgt, borderRadius: 5, ...tela(c.col, c.claro), boxShadow: "0 22px 44px rgba(20,15,5,.38), 0 2px 0 rgba(255,255,255,.18) inset", position: "relative", ...style }}>
    <div style={{ position: "absolute", left: w * 0.08, right: w * 0.08, bottom: w * 0.08, background: "#f6f1e6", padding: `${w * 0.05}px ${w * 0.07}px`, display: "flex", alignItems: "center", gap: w * 0.045, boxShadow: "0 3px 8px rgba(0,0,0,.2)" }}>
      <div style={{ fontFamily: SERIF, fontSize: w * (c.kan.length > 1 ? 0.105 : 0.24), color: C.sumi, lineHeight: 1, clipPath: `inset(0 ${(1 - r) * 100}% 0 0)`, whiteSpace: "nowrap" }}>{c.kan}</div>
      <div style={{ opacity: eo(t, at + 0.45, 0.4) }}>
        <div style={{ fontFamily: SERIF, fontSize: w * (c.kan.length > 1 ? 0.085 : 0.105), color: C.sumi, lineHeight: 1.05 }}>{c.ro}</div>
        <div style={{ ...cap, fontSize: w * 0.043, letterSpacing: "0.2em", opacity: 0.7, marginTop: 4 }}>{c.en}</div>
      </div>
    </div>
  </div>;
};
// "Five colours. Put any two side by side… They cannot argue."
const PARES: [number, number][] = [[0, 1], [2, 3], [4, 1], [3, 0], [2, 4]];
export const Abanico: React.FC<SP> = ({ t, a, b }) => {
  const junta = FR(115) + 0.6, n = Math.min(PARES.length - 1, Math.max(0, Math.floor((t - junta) / 0.95))), par = PARES[n], k = e(t, junta - 0.3, junta + 0.3), ojos = e(t, FR(115) + 3.6, FR(115) + 4.6) * (1 - e(t, b - 0.5, b));
  return <Washi>
    <AbsoluteFill style={{ filter: `blur(${ojos * 7}px)` }}>
      {COLORES.map((_, i) => { const fan = (i - 2), en = par.indexOf(i), act = t >= junta && en >= 0, q = act ? eo(t, junta + n * 0.95, 0.35) : 0;
        const x = lerp(lerp(960, 960 + fan * 285, eo(t, a + 0.1 + i * 0.05, 0.6)), 960 + (en === 0 ? -172 : 172), q), y = lerp(430, 470, q) + (t >= junta && !act ? 30 : 0), rot = lerp(fan * 7, 0, Math.max(q, k * 0.6));
        return <div key={i} style={{ position: "absolute", left: x - 165, top: y - 225, zIndex: act ? 5 : 1, opacity: t >= junta && !act ? 0.28 : 1, transform: `rotate(${rot}deg) scale(${act ? 1 + q * 0.12 : 1})` }}><Tarjeta i={i} t={t} at={a - 5} w={330} /></div>; })}
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}><Palabras t={t} at={a + 0.05} txt="five colours" style={{ justifyContent: "center", fontFamily: SERIF, fontSize: 84, color: C.sumi }} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 930, textAlign: "center", ...cap, fontSize: 30, opacity: e(t, junta, junta + 0.4) * 0.8 }}>any two · side by side</div>
  </Washi>;
};

// ── la aritmética: nueve prendas en cuadrícula que se encienden de a 2 o 3; el contador llega a 30
const ORD = [3, 5, 2, 8, 6, 1, 7, 4, 9]; // orden en la cuadrícula: partes de arriba, pantalones, vestido, capas, estola
const PASOS: { f: number; on: number[]; n?: number; fx?: string }[] = [
  { f: 121, on: [3, 5], fx: "2 tops" }, { f: 122, on: [2, 8], fx: "2 tops · 2 trousers" }, { f: 123, on: [3, 5, 2, 8], fx: "2 × 2" }, { f: 124, on: [3, 5, 2, 8], n: 4, fx: "2 × 2" },
  { f: 125, on: [6], fx: "+ the dress" }, { f: 126, on: [6], fx: "+ the dress" }, { f: 127, on: [6, 2, 8], n: 7, fx: "4 + 3" },
  { f: 128, on: [3, 5, 2, 8, 6], fx: "7 × a layer" }, { f: 129, on: [1], fx: "7 × a layer" }, { f: 130, on: [7], fx: "7 × a layer" }, { f: 131, on: [4], fx: "7 × a layer" }, { f: 132, on: [], fx: "7 × a layer" },
  { f: 133, on: [1, 7, 4], fx: "7 × 4" }, { f: 134, on: [1, 7, 4, 3, 5, 2, 8, 6], n: 28, fx: "7 × 4" },
  { f: 135, on: [6, 3, 2, 8], fx: "the dress, worn open" }, { f: 136, on: [6, 3, 2, 8], n: 30, fx: "28 + 2" }, { f: 137, on: [1, 2, 3, 4, 5, 6, 7, 8], n: 30, fx: "28 + 2" },
];
export const Matriz: React.FC<SP> = ({ t, a, b }) => {
  let i = 0; PASOS.forEach((p, j) => { if (t >= FR(p.f)) i = j; });
  const paso = PASOS[i], at = FR(paso.f);
  // el vestido: solo → sobre el ancho → sobre el angosto
  const on = paso.f === 126 ? (t < at + 1.2 ? [6] : t < at + 2.6 ? [6, 2] : [6, 8]) : paso.f === 135 ? (t < at + 3.9 ? [6, 3, 2] : [6, 3, 8]) : paso.on;
  let prev = 0, cur = 0, tn = a; PASOS.forEach((p, j) => { if (p.n !== undefined && j <= i) { if (p.n !== cur) { prev = cur; cur = p.n; tn = FR(p.f); } } });
  const num = Math.round(lerp(prev, cur, eo(t, tn, cur - prev > 10 ? 0.9 : 0.35)));
  const fin = t >= FR(137);
  return <Washi>
    <AbsoluteFill>
      {ORD.map((n, j) => { const z = PZ[n - 1], cx = 150 + (j % 3) * 330, cy = 60 + Math.floor(j / 3) * 330, act = on.includes(n), lift = act ? eo(t, Math.max(at, a), 0.3) : 0, ent = eo(t, a + 0.05 + j * 0.05, 0.45);
        return <div key={n} style={{ position: "absolute", left: cx, top: cy + (1 - ent) * 40, width: 300, height: 300, opacity: ent * (act || fin ? 1 : 0.42), transform: `translateY(${-lift * 10}px) scale(${1 + lift * 0.05})`,
          background: "rgba(250,247,240,.75)", boxShadow: act ? "0 18px 34px rgba(30,20,5,.22)" : "0 2px 6px rgba(30,20,5,.08)", border: `2px solid ${act ? C.sumi : "rgba(30,28,26,.12)"}`, borderRadius: 4 }}>
          <Prenda f={z.f} hook={0} x={150} y={12} w={176} />
          <div style={{ position: "absolute", left: 14, top: 10, fontFamily: SERIF, fontSize: 30, color: act ? C.hanko : C.sumi, opacity: 0.85 }}>{z.kan}</div>
        </div>; })}
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 1180, top: 70, width: 640 }}>
      <div style={{ ...cap, fontSize: 30, height: 44, opacity: 0.75 }}>{paso.fx}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 6 }}>
        <span style={{ fontFamily: SERIF, fontSize: 330, lineHeight: 1, color: fin ? C.hanko : C.sumi, display: "inline-block", minWidth: 380, transform: `scale(${1 + 0.07 * Math.exp(-7 * Math.max(0, t - tn)) })`, transformOrigin: "0 80%" }}>{num}</span>
        <span style={{ fontFamily: SERIF, fontSize: 64, color: C.sumi, opacity: 0.7 }}>outfits</span>
      </div>
      <Pincel t={t} at={a + 0.4} x={0} y={420} w={600} hgt={9} />
      {/* un mes: 30 casilleros, uno por conjunto */}
      <div style={{ marginTop: 70, display: "grid", gridTemplateColumns: "repeat(6, 84px)", gap: 16 }}>
        {Array.from({ length: 30 }, (_, k) => { const lleno = k < num; return <div key={k} style={{ width: 84, height: 84, borderRadius: 4, border: "2px solid rgba(30,28,26,.22)", background: lleno ? [C.sumi, C.ai, C.cha, C.nezumi, "#cdbf9f"][Math.floor(h(k, 3) * 5)] : "transparent",
          display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: 6, fontFamily: SANS, fontSize: 17, color: lleno ? "rgba(255,255,255,.75)" : "rgba(30,28,26,.4)", transform: `scale(${lleno ? 1 : 0.94})` }}>{k + 1}</div>; })}
      </div>
    </div>
    {fin && <Hanko t={t} at={FR(137) + 0.45} x={1735} y={300} size={128} />}
    <div style={{ display: "none" }}>{b}</div>
  </Washi>;
};

// ── cierre: nueve prendas · cinco colores · tres reglas
export const Recap: React.FC<SP> = ({ t }) => {
  const A = FR(190), B = FR(191), Cc = FR(192);
  const fila = (at: number, y: number, num: string, lab: string, ch: React.ReactNode) => <div style={{ position: "absolute", left: 170, right: 170, top: y, height: 250, display: "flex", alignItems: "center" }}>
    <div style={{ fontFamily: SERIF, fontSize: 230, color: C.sumi, width: 250, lineHeight: 1, opacity: eo(t, at, 0.35), transform: `translateX(${(1 - eo(t, at, 0.45)) * -50}px)` }}>{num}</div>
    <div style={{ ...cap, fontSize: 34, width: 300, opacity: eo(t, at + 0.1, 0.35) }}>{lab}</div>
    <div style={{ position: "relative", flex: 1, height: 250 }}>{ch}</div>
  </div>;
  return <Washi>
    {fila(A, 60, "9", "pieces", <>{PZ.map((q, i) => <Prenda key={i} f={q.f} hook={0} x={70 + i * 108} y={20 - (1 - cl(spr(t, A + i * 0.05, 1.5))) * 420} w={128} rot={swing(t, A + i * 0.05, 5, 2.4, 7)} op={t >= A ? 1 : 0} />)}</>)}
    <div style={{ position: "absolute", left: 170, right: 170, top: 345, height: 2, background: C.line }} />
    {fila(B, 400, "5", "colours", <>{COLORES.map((c, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 190, top: 40, width: 160, height: 170, borderRadius: 4, ...tela(c.col, c.claro), boxShadow: "0 12px 22px rgba(20,15,5,.25)", opacity: eo(t, B + i * 0.06, 0.2), transform: `translateY(${(1 - cl(spr(t, B + i * 0.06, 1.5))) * -60}px) rotate(${(i - 2) * 1.5}deg)` }} />)}</>)}
    <div style={{ position: "absolute", left: 170, right: 170, top: 690, height: 2, background: C.line }} />
    {fila(Cc, 740, "3", "rules", <>{["一", "二", "三"].map((k, i) => <Hanko key={i} t={t} at={Cc + 0.25 + i * 0.22} x={110 + i * 220} y={125} size={150} txt={"掟" + k} rot={-6 + i * 5} />)}</>)}
  </Washi>;
};
