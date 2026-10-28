// cer28 · componentes únicos genéricos 1 (reloj, contador, libreta, frente a frente, polaroid, cinta métrica, cronómetro,
// pruebas, historieta, almanaque, medidor, capas, pasos, tornillos, ondas, mapa, red de vecinos, corcho).
// Cada uno = un OBJETO que se entiende sin leer; el texto es un rótulo de ≤5 palabras. Tiempos internos relativos (tt = s desde at).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, MARK, Photo, RED, Reflected, Shadow, Sheen, Stage, TX, Tag, cl, eIn, eio, phys } from "./hkit";

export type HP = { t: number; h: H };
const it = (h: H) => (h.items ?? []) as { t: string; img?: string; at: number; ok?: boolean | string; n?: string; s?: string }[];

// ---------- 1 · RELOJ DE PALETAS: la hora de la noche cae paleta por paleta y la luna sale detrás ----------
const Flap: React.FC<{ cur: string; nxt: string; f: number }> = ({ cur, nxt, f }) => {
  const W = 200, Hh = 280, half = (ch: string, top: boolean) => <div style={{ position: "absolute", left: 0, top: top ? 0 : Hh / 2, width: W, height: Hh / 2, overflow: "hidden", borderRadius: top ? "20px 20px 0 0" : "0 0 20px 20px", background: top ? "linear-gradient(180deg,#2c2c31,#1e1e22)" : "linear-gradient(180deg,#17171a,#232327)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: top ? 0 : -Hh / 2, height: Hh, lineHeight: `${Hh}px`, textAlign: "center", fontWeight: 900, fontSize: 220, color: TX }}>{ch}</div>
  </div>;
  return <div style={{ position: "relative", width: W, height: Hh, perspective: 900, boxShadow: "0 34px 80px rgba(0,0,0,.65)", borderRadius: 20 }}>
    {half(nxt, true)}{half(cur, false)}
    {f < 0.5 ? <div style={{ position: "absolute", left: 0, top: 0, width: W, height: Hh / 2, transformOrigin: "50% 100%", transform: `rotateX(${-f * 180}deg)`, backfaceVisibility: "hidden" }}>{half(cur, true)}</div>
      : <div style={{ position: "absolute", left: 0, top: Hh / 2, width: W, height: Hh / 2, transformOrigin: "50% 0%", transform: `rotateX(${(1 - f) * 180}deg)` }}><div style={{ position: "relative", top: -Hh / 2 }}>{half(nxt, false)}</div></div>}
    <div style={{ position: "absolute", left: 0, right: 0, top: Hh / 2 - 1, height: 2, background: "rgba(0,0,0,.75)" }} />
    <Sheen p={(f * 1.3) % 1} r={20} o={0.12} />
  </div>;
};
export const HClock: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const dig = String(h.v ?? "2:47").replace(":", "").padStart(3, "0").split("");
  const moon = phys(tt, 0.4, 2.2, 0.8);
  return <>
    <div style={{ position: "absolute", left: 1460, top: 250 - 120 * cl(moon), width: 170, height: 170, borderRadius: "50%", background: "radial-gradient(circle at 38% 36%, #fffbe9, #e8dcb6 60%, #b9ab83)", boxShadow: "0 0 90px 30px rgba(255,240,200,.22)", opacity: cl(moon * 1.4) }} />
    <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 22 }}>
      {dig.map((d, i) => {
        const k = cl((tt - 0.6 - i * 0.55) / 0.5), roll = Math.floor(k * 6), shown = k >= 1 ? d : String((+d + 6 - roll + 10) % 10);
        const el = <Flap key={i} cur={shown} nxt={k >= 1 ? d : String((+shown + 1) % 10)} f={k >= 1 ? 0 : (k * 6) % 1} />;
        return i === dig.length - 2 ? <React.Fragment key={i}><div style={{ fontWeight: 900, fontSize: 170, color: AMB, opacity: 0.55 + 0.45 * Math.sin(tt * 3) ** 2 }}>:</div>{el}</React.Fragment> : el;
      })}
    </div>
    <Shadow x={960} y={760} w={900} k={1} o={0.5} />
    <Tag tt={tt} at={2.4} x={960} y={830} txt={h.lab ?? "DE LA MAÑANA"} col={DIM} size={40} />
    {h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}
  </>;
}}</Stage>;

// ---------- 2 · CONTADOR MECÁNICO: tambores que ruedan y clavan la cifra ----------
export const HOdometer: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const v = String(h.v), n = v.length;
  return <>
    <div style={{ position: "absolute", left: 960, top: 500, transform: "translate(-50%,-50%) rotateX(8deg)", display: "flex", gap: 14, padding: "26px 30px", borderRadius: 26, background: "linear-gradient(180deg,#3a3329,#1b1712)", boxShadow: "0 50px 110px rgba(0,0,0,.7), inset 0 2px 0 rgba(255,255,255,.12)" }}>
      {v.split("").map((d, i) => {
        if (!/\d/.test(d)) return <div key={i} style={{ fontWeight: 900, fontSize: 190, color: AMB, alignSelf: "center" }}>{d}</div>;
        const stop = 0.9 + (n - i) * 0.35, k = eio(tt, 0.4, stop + 0.6), spins = 3 + (n - i), pos = (+d + spins * 10) * k;
        return <div key={i} style={{ position: "relative", width: 170, height: 250, overflow: "hidden", borderRadius: 14, background: "linear-gradient(180deg,#0c0b0a,#2e2a25 18%,#f2ece0 50%,#2e2a25 82%,#0c0b0a)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-(pos % 10) * 250}px)` }}>
            {Array.from({ length: 11 }, (_, j) => <div key={j} style={{ height: 250, lineHeight: "250px", textAlign: "center", fontWeight: 900, fontSize: 200, color: "#17130e" }}>{j % 10}</div>)}
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.75), transparent 30%, transparent 70%, rgba(0,0,0,.75))" }} />
        </div>;
      })}
    </div>
    <Shadow x={960} y={690} w={760} />
    <Tag tt={tt} at={1.6 + n * 0.35} x={960} y={760} txt={h.u ?? ""} col={AMB} size={64} />
    {h.sub && <Tag tt={tt} at={2.4 + n * 0.35} x={960} y={840} txt={h.sub} col={DIM} size={34} />}
  </>;
}}</Stage>;

// ---------- 3 · LA LIBRETA: renglones a mano y el último tapado con fibra + sello ----------
export const HRedact: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = phys(tt, 0.2, 4.5, 0.45), I = it(h), st = phys(tt, h.stampAt ?? 3.2, 7, 0.38);
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, width: 1000, height: 120 + I.length * 72, marginLeft: -500, marginTop: -(60 + I.length * 36), transform: `translateY(${(1 - s) * 700}px) rotate(${-2.5 + (1 - s) * 12}deg)`,
      background: "repeating-linear-gradient(180deg, #f4ecd8 0px, #f4ecd8 70px, #c9d6e6 70px, #c9d6e6 72px), #f4ecd8", borderRadius: 8, boxShadow: "0 60px 120px rgba(0,0,0,.7)", padding: "60px 90px", fontFamily: HAND, color: "#2b2620" }}>
      <div style={{ position: "absolute", left: 70, top: 0, bottom: 0, width: 3, background: "#e08b8b" }} />
      {I.map((r, i) => { const k = cl(phys(tt, r.at, 6, 0.6)), last = i === I.length - 1; return <div key={i} style={{ position: "relative", fontSize: 58, fontWeight: 700, height: 72, lineHeight: "72px", clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` }}>
        {r.t}{last && <div style={{ position: "absolute", left: 90, top: 10, height: 54, width: 560 * cl(phys(tt, r.at + 0.5, 5, 0.7)), background: "#111", borderRadius: 6, transform: "rotate(-1deg)" }} />}
      </div>; })}
      <div style={{ position: "absolute", right: 60, bottom: 40, fontFamily: MARK, fontSize: 66, color: RED, border: `6px solid ${RED}`, borderRadius: 14, padding: "4px 26px", transform: `rotate(-9deg) scale(${Math.max(0, 2.4 - 1.4 * st)})`, opacity: cl(st * 3) }}>{h.stamp ?? "AL FINAL"}</div>
    </div>
    {h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}
  </>;
}}</Stage>;

// ---------- 4 · FRENTE A FRENTE: dos fotos en perspectiva; en la palabra, la perdedora se apaga y cae hacia atrás ----------
export const HVersus: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const [A, B] = it(h), w = cl(phys(tt, h.win ?? 3, 5, 0.55)), win = h.best ?? 1;
  const card = (c: typeof A, i: number) => {
    const s = phys(tt, c.at, 5, 0.5), lose = i !== win, x = i === 0 ? 560 : 1360;
    return <div key={i} style={{ position: "absolute", left: x, top: 520, transform: `translate(-50%,-50%) translateX(${(1 - s) * (i ? 500 : -500)}px) rotateY(${(i ? -16 : 16) * (1 - (lose ? 0 : w))}deg) rotateX(${lose ? 18 * w : 0}deg) translateZ(${lose ? -160 * w : 60 * w}px)`, opacity: cl(s * 2), transformStyle: "preserve-3d" }}>
      <Reflected id={c.img} w={560} h={420} dim={lose ? 0.55 * w : 0}>
        {!lose && <div style={{ position: "absolute", inset: -10, borderRadius: 24, boxShadow: `0 0 0 6px ${GRN}, 0 0 80px rgba(111,227,154,${0.5 * w})`, opacity: w }} />}
        {lose && <svg width={560} height={420} style={{ position: "absolute", left: 0, top: 0 }}><path d="M 70 70 L 490 350 M 490 70 L 70 350" stroke={RED} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={`${w} 1`} opacity={0.9} /></svg>}
      </Reflected>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontWeight: 900, fontSize: 46, color: lose ? DIM : TX, opacity: cl(s * 2) }}>{c.t}</div>
    </div>;
  };
  return <>{card(A, 0)}{card(B, 1)}
    <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${cl(phys(tt, 1.2, 6, 0.4))})`, fontFamily: MARK, fontSize: 80, color: AMB, opacity: 1 - w }}>VS</div>
    {h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}
  </>;
}}</Stage>;

// ---------- 5 · POLAROID DEL CLIENTE: cae hamacándose sobre la mesa, nombre a mano y sello al final ----------
export const HPolaroid: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = phys(tt, 0.2, 2.8, 0.5), sway = Math.sin(tt * 4) * Math.exp(-tt * 1.1), st = phys(tt, h.stampAt ?? 4.5, 7, 0.38), sub = cl(phys(tt, 2.2, 5, 0.6));
  return <>
    <Shadow x={900} y={900} w={760} k={cl(s)} o={0.6} />
    <div style={{ position: "absolute", left: 900, top: 520, transform: `translate(-50%,-50%) translateY(${(1 - s) * -900}px) translateX(${sway * 140}px) rotate(${-5 + sway * 20}deg)`, background: "#f3eee3", padding: "26px 26px 120px", boxShadow: "0 50px 100px rgba(0,0,0,.7)" }}>
      <Photo id={h.img} w={640} h={480} r={2} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#2f2820", whiteSpace: "nowrap" }}>{h.n}</div>
      <div style={{ position: "absolute", right: -40, top: -46, width: 170, height: 60, background: "rgba(240,226,180,.75)", transform: "rotate(14deg)", boxShadow: "0 6px 14px rgba(0,0,0,.25)" }} />
    </div>
    <div style={{ position: "absolute", left: 1290, top: 380, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: TX, width: 520, lineHeight: 1.1, clipPath: `inset(0 ${(1 - sub) * 100}% 0 0)` }}>{h.sub}</div>
    {h.stamp && <div style={{ position: "absolute", left: 1270, top: 660, fontFamily: MARK, fontSize: 48, color: GRN, border: `6px solid ${GRN}`, borderRadius: 14, padding: "6px 24px", transform: `rotate(-7deg) scale(${Math.max(0, 2.4 - 1.4 * st)})`, opacity: cl(st * 3), whiteSpace: "nowrap" }}>{h.stamp}</div>}
  </>;
}}</Stage>;

// ---------- 6 · CINTA MÉTRICA: la cinta amarilla se estira y el número sube hasta la medida ----------
export const HMeasure: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = eio(tt, 0.8, 3.0), L = 1100 * k, x0 = 360, v = +h.v, sh = cl(phys(tt, 0.2, 5, 0.6));
  return <>
    <div style={{ position: "absolute", left: x0 - 220, top: 470, width: 240, height: 240, borderRadius: 40, background: "linear-gradient(145deg,#ffd23c,#d79c00)", boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 -10px 0 rgba(0,0,0,.2)", transform: `scale(${sh}) rotate(${(1 - sh) * -30}deg)` }}>
      <div style={{ position: "absolute", left: 60, top: 60, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f5f5f5, #9a9a9a)", boxShadow: "inset 0 4px 10px rgba(0,0,0,.4)" }} />
      <Sheen p={(tt * 0.3) % 1} r={40} o={0.25} />
    </div>
    <div style={{ position: "absolute", left: x0, top: 640, width: L, height: 64, background: "linear-gradient(180deg,#ffe35a,#f0be0c)", boxShadow: "0 18px 30px rgba(0,0,0,.45)", overflow: "hidden" }}>
      {Array.from({ length: 56 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 20, top: 0, width: 3, height: i % 5 === 0 ? 38 : 18, background: "#2a2008" }} />)}
      {Array.from({ length: 12 }, (_, i) => <div key={"n" + i} style={{ position: "absolute", left: i * 100 + 6, top: 34, fontWeight: 900, fontSize: 22, color: "#2a2008" }}>{i * Math.max(1, Math.round(v / 10))}</div>)}
    </div>
    <div style={{ position: "absolute", left: x0 + L - 14, top: 610, width: 28, height: 124, background: "linear-gradient(90deg,#8d8d8d,#e7e7e7,#7a7a7a)", borderRadius: 4, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    {h.img && <div style={{ position: "absolute", left: 1500, top: 250, transform: `rotate(4deg) scale(${cl(phys(tt, 1.6, 5, 0.55))})` }}><Photo id={h.img} w={330} h={250} r={14} /></div>}
    <div style={{ position: "absolute", left: x0 + L / 2, top: 470, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 150, color: TX, textShadow: "0 12px 40px rgba(0,0,0,.7)", whiteSpace: "nowrap" }}>{h.pre ?? ""}{(v * k).toFixed(h.dec ?? 0).replace(".", ",")}<span style={{ fontSize: 70, color: AMB }}> {h.u}</span></div>
    {h.lab && <Tag tt={tt} at={3.2} x={x0 + 550} y={800} txt={h.lab} col={DIM} size={40} />}
  </>;
}}</Stage>;

// ---------- 7 · CRONÓMETRO: se aprieta la corona y la aguja barre los segundos ----------
export const HStopwatch: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const n = +h.v, press = cl(phys(tt, 0.6, 9, 0.5)), run = eio(tt, 0.8, 0.8 + Math.min(n, 5)), sec = n * run, R = 300;
  return <>
    <Shadow x={960} y={920} w={640} />
    <div style={{ position: "absolute", left: 960 - R, top: 540 - R, width: 2 * R, height: 2 * R, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fbfaf6, #d8d3c8 70%, #a9a396)", boxShadow: "0 0 0 26px #2b2b2e, 0 0 0 32px #6e6e72, 0 50px 120px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: R - 40, top: -98 + 14 * press, width: 80, height: 70, borderRadius: 12, background: "linear-gradient(90deg,#666,#ddd,#666)" }} />
      {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: R - 2, top: 14, width: 4, height: i % 5 ? 18 : 40, background: i < sec / Math.max(n, 1) * 60 ? RED : "#3a3a3a", transformOrigin: `2px ${R - 14}px`, transform: `rotate(${i * 6}deg)` }} />)}
      <div style={{ position: "absolute", left: R - 5, top: 40, width: 10, height: R - 40, background: RED, borderRadius: 5, transformOrigin: `5px ${R - 40}px`, transform: `rotate(${run * 360}deg)`, boxShadow: "0 6px 10px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: R - 22, top: R - 22, width: 44, height: 44, borderRadius: "50%", background: "#222" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: R + 70, textAlign: "center", fontWeight: 900, fontSize: 96, color: "#1b1b1b" }}>{sec.toFixed(1).replace(".", ",")}<span style={{ fontSize: 44 }}> s</span></div>
      <Sheen p={(tt * 0.25) % 1} r={R} o={0.3} />
    </div>
    {h.lab && <Tag tt={tt} at={1.2 + Math.min(n, 5)} x={960} y={160} txt={h.lab} col={AMB} size={52} />}
  </>;
}}</Stage>;

// ---------- 8 · LAS PRUEBAS DEL TALLER: dos filas de fichas; cada intento cae con peso y la que falla se raja ----------
export const HTally: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const rows = (h.rows ?? []) as { t: string; img?: string; r: boolean[]; at: number }[];
  return <>{rows.map((r, i) => {
    const y = 380 + i * 300, ok = r.r.filter(Boolean).length, s = cl(phys(tt, r.at, 5, 0.6));
    return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: 200, top: y - 110, opacity: s, transform: `translateX(${(1 - s) * -80}px)` }}><Photo id={r.img} w={290} h={220} r={16} /></div>
      <div style={{ position: "absolute", left: 200, top: y + 120, width: 290, textAlign: "center", fontWeight: 900, fontSize: 38, opacity: s }}>{r.t}</div>
      {r.r.map((g, j) => { const d = phys(tt, r.at + 0.6 + j * 0.45, 7, 0.4), cr = cl((tt - r.at - 0.9 - j * 0.45) * 3);
        return <div key={j} style={{ position: "absolute", left: 600 + j * 230, top: y - 85, width: 170, height: 170, borderRadius: "50%", transform: `translateY(${(1 - d) * -500}px)`, opacity: cl(d * 3),
          background: g ? "radial-gradient(circle at 38% 34%, #b8ffd1, #2fa565 70%)" : "radial-gradient(circle at 38% 34%, #ffb3aa, #b23126 70%)", boxShadow: "0 24px 40px rgba(0,0,0,.55), inset 0 -8px 0 rgba(0,0,0,.25)" }}>
          {!g && <svg width={170} height={170} style={{ position: "absolute" }}><path d="M 85 10 L 70 60 L 98 92 L 74 160" stroke="rgba(30,0,0,.8)" strokeWidth={7} fill="none" pathLength={1} strokeDasharray={`${cr} 1`} /></svg>}
          <Sheen p={0.3} r={85} o={0.35} />
        </div>; })}
      <div style={{ position: "absolute", left: 1560, top: y - 70, fontWeight: 900, fontSize: 120, color: ok === r.r.length ? GRN : RED, opacity: cl(tt - r.at - 0.8 - r.r.length * 0.45) }}>{ok}<span style={{ fontSize: 60, color: DIM }}>/{r.r.length}</span></div>
    </React.Fragment>;
  })}{h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}</>;
}}</Stage>;

// ---------- 9 · LA HISTORIETA: tres viñetas con foto que entran de a una, la última con sello ----------
export const HStrip: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="shutter">{(tt) => {
  const I = it(h), st = phys(tt, h.stampAt ?? 6, 7, 0.38);
  return <>{I.map((c, i) => { const s = phys(tt, c.at, 4.5, 0.5), x = 360 + i * 600;
    return <div key={i} style={{ position: "absolute", left: x, top: 520, transform: `translate(-50%,-50%) translateY(${(1 - s) * 600}px) rotate(${(i - 1) * 2.5 + (1 - s) * 14}deg)`, background: "#f4efe4", padding: 16, paddingBottom: 90, boxShadow: "0 40px 90px rgba(0,0,0,.65)" }}>
      <Photo id={c.img} w={520} h={540} r={2} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#2b241b", whiteSpace: "nowrap" }}>{c.t}</div>
      <div style={{ position: "absolute", left: 22, top: 22, width: 54, height: 54, borderRadius: "50%", background: "#1d1a16", color: AMB, fontWeight: 900, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
    </div>; })}
    {h.stamp && <div style={{ position: "absolute", left: 960, top: 150, transform: `translate(-50%,-50%) rotate(-3deg) scale(${Math.max(0, 2.4 - 1.4 * st)})`, opacity: cl(st * 3), fontFamily: MARK, fontSize: 60, color: h.bad ? RED : GRN, border: `6px solid ${h.bad ? RED : GRN}`, borderRadius: 14, padding: "4px 26px", background: "rgba(10,10,10,.55)", whiteSpace: "nowrap" }}>{h.stamp}</div>}
  </>;
}}</Stage>;

// ---------- 10 · ALMANAQUE DE TACO: las hojas se arrancan y vuelan, el contador de días avanza ----------
export const HCalendar: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const N = +h.v, dur = Math.min(3.4, 0.35 * N + 0.6), k = eio(tt, 0.8, 0.8 + dur), torn = Math.floor(k * N);
  const page = (n: number, fly: number, key: string) => <div key={key} style={{ position: "absolute", left: 0, top: 0, width: 520, height: 560, background: "linear-gradient(180deg,#fffdf8,#ece6da)", borderRadius: "0 0 14px 14px", boxShadow: "0 6px 14px rgba(0,0,0,.25)", transformOrigin: "50% 0%",
    transform: fly > 0 ? `translate(${fly * 700}px, ${-fly * 260 + fly * fly * 900}px) rotate(${fly * 70}deg) rotateX(${fly * 50}deg)` : undefined, opacity: 1 - cl(fly * 1.3) }}>
    <div style={{ height: 110, background: RED, borderRadius: 0, color: "#fff", fontWeight: 900, fontSize: 44, letterSpacing: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>{h.top ?? "DÍA"}</div>
    <div style={{ textAlign: "center", fontWeight: 900, fontSize: 300, lineHeight: "420px", color: "#1d1a16" }}>{n}</div>
  </div>;
  const fr = (k * N) % 1;
  return <>
    <Shadow x={960} y={880} w={700} />
    <div style={{ position: "absolute", left: 700, top: 250, width: 520, height: 600 }}>
      <div style={{ position: "absolute", left: -10, top: -30, width: 540, height: 50, borderRadius: 10, background: "linear-gradient(180deg,#444,#1b1b1b)" }} />
      {page(Math.min(N, torn + 1), 0, "base")}
      {torn < N && page(torn + 1, 0, "cur")}
      {torn < N && fr > 0.6 && page(torn + 1, (fr - 0.6) / 0.4, "fly")}
    </div>
    <Tag tt={tt} at={1.2 + dur} x={1270} y={500} txt={h.lab ?? ""} col={AMB} size={50} anchor="l" />
    {h.sub && <Tag tt={tt} at={1.8 + dur} x={1300} y={590} txt={h.sub} col={DIM} size={40} anchor="l" />}
  </>;
}}</Stage>;

// ---------- 11 · EL MEDIDOR DE PELIGRO: aguja que se dispara con sobrepico hasta el rojo ----------
export const HGauge: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const v = h.v ?? 0.92, a = -90 + 180 * v * phys(tt, 1.0, 3.2, 0.32), R = 420, pulse = cl(tt - 2.4) * (0.5 + 0.5 * Math.sin(tt * 5));
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs><linearGradient id="gz" x1="0" x2="1"><stop offset="0" stopColor="#3fbf7a" /><stop offset="0.55" stopColor="#ffb257" /><stop offset="1" stopColor="#ff3a2a" /></linearGradient></defs>
      <path d={`M ${960 - R} 760 A ${R} ${R} 0 0 1 ${960 + R} 760`} stroke="#141416" strokeWidth={120} fill="none" />
      <path d={`M ${960 - R} 760 A ${R} ${R} 0 0 1 ${960 + R} 760`} stroke="url(#gz)" strokeWidth={84} fill="none" pathLength={1} strokeDasharray={`${eio(tt, 0.2, 1.2)} 1`} />
      {Array.from({ length: 11 }, (_, i) => { const q = Math.PI * (1 - i / 10); return <line key={i} x1={960 + Math.cos(q) * (R - 80)} y1={760 - Math.sin(q) * (R - 80)} x2={960 + Math.cos(q) * (R - 120)} y2={760 - Math.sin(q) * (R - 120)} stroke={DIM} strokeWidth={6} />; })}
      <circle cx={960 + R * Math.cos(Math.PI * 0.08)} cy={760 - R * Math.sin(Math.PI * 0.08)} r={70} fill="rgba(255,58,42,.5)" opacity={pulse} style={{ filter: "blur(18px)" }} />
    </svg>
    <div style={{ position: "absolute", left: 960 - 12, top: 760 - R + 40, width: 24, height: R - 40, borderRadius: 12, background: "linear-gradient(90deg,#c9c9c9,#fff,#9a9a9a)", transformOrigin: `12px ${R - 40}px`, transform: `rotate(${a}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 960 - 46, top: 760 - 46, width: 92, height: 92, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #777, #1a1a1a)" }} />
    <Tag tt={tt} at={2.2} x={960} y={880} txt={h.lab ?? "LA MÁS PELIGROSA"} col={RED} size={64} />
    {h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}
  </>;
}}</Stage>;

// ---------- 12 · CAPAS EN EXPLOSIÓN: las fotos apiladas se separan en profundidad y la clave se ilumina ----------
export const HExploded: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="diag" cam={0.6}>{(tt) => {
  const I = it(h), ex = phys(tt, 1.0, 2.6, 0.62), hi = h.hi ?? I.length - 1;
  return <div style={{ position: "absolute", left: 960, top: 540, transformStyle: "preserve-3d", transform: `rotateX(52deg) rotateZ(${-28 + 6 * Math.sin(tt * 0.3)}deg)` }}>
    {I.map((c, i) => { const z = (i - (I.length - 1) / 2) * 260 * ex, on = cl(tt - c.at) * (i === hi ? 1 : 0), dim = i === hi ? 0 : 0.35 * cl(tt - (I[hi]?.at ?? 3));
      return <div key={i} style={{ position: "absolute", left: -330, top: -230, transformStyle: "preserve-3d", transform: `translateZ(${z}px)` }}>
        <Photo id={c.img} w={660} h={460} r={14} dim={dim} style={{ boxShadow: on > 0 ? `0 0 0 8px ${AMB}, 0 0 90px rgba(255,178,87,.6)` : "0 30px 60px rgba(0,0,0,.6)" }} />
        <div style={{ position: "absolute", left: 690, top: 180, transform: "rotateX(-52deg) rotateZ(0deg)", transformOrigin: "0 50%", fontWeight: 900, fontSize: 44, whiteSpace: "nowrap", color: i === hi ? AMB : TX, opacity: cl(phys(tt, c.at, 6, 0.6)) }}>{c.t}</div>
      </div>; })}
  </div>;
}}</Stage>;

// ---------- 13 · PASOS EN LA OSCURIDAD: huellas que aparecen de a una hasta el objeto ----------
export const HSteps: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 60% 50% at 60% 55%, #1c1a17, #050506 75%)">{(tt) => {
  const n = h.n ?? 2, pts = Array.from({ length: n * 2 }, (_, i) => ({ x: 260 + i * (1000 / (n * 2)), y: 800 - i * (300 / (n * 2)) + (i % 2 ? 36 : -36) }));
  const end = 0.8 + n * 2 * 0.45, g = phys(tt, end, 4, 0.5);
  return <>
    {pts.map((p, i) => { const k = cl(phys(tt, 0.8 + i * 0.45, 8, 0.6)); return <svg key={i} width={150} height={250} viewBox="0 0 90 150" style={{ position: "absolute", left: p.x, top: p.y, transform: `rotate(${-70 + (i % 2) * 8}deg) scale(${0.8 + 0.2 * k})`, opacity: k * 0.9 }}>
      <ellipse cx={45} cy={50} rx={34} ry={46} fill="rgba(255,226,180,.75)" /><ellipse cx={45} cy={122} rx={24} ry={24} fill="rgba(255,226,180,.75)" /></svg>; })}
    <div style={{ position: "absolute", left: 1480, top: 380, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * cl(g)})`, opacity: cl(g * 2) }}>
      <div style={{ position: "absolute", inset: -60, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,210,140,.35), transparent 70%)" }} />
      <Photo id={h.img} w={540} h={540} r={270} />
    </div>
    <Tag tt={tt} at={end + 0.3} x={1480} y={730} txt={h.lab ?? ""} col={AMB} size={50} />
    {h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}
  </>;
}}</Stage>;

// ---------- 14 · TORNILLOS EN CORTE: el corto apenas muerde el marco; el largo atraviesa hasta la madera de atrás ----------
export const HScrews: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s1 = eio(tt, 0.8, 1.8), pull = eIn(tt, h.pull ?? 2.6, (h.pull ?? 2.6) + 0.7), s2 = eio(tt, h.long ?? 3.6, (h.long ?? 3.6) + 1.4), Y = 260;
  const layer = (x: number, w: number, c: string, lab: string, d: number) => <><div style={{ position: "absolute", left: x, top: Y, width: w, height: 560, background: c, boxShadow: "inset -10px 0 20px rgba(0,0,0,.35)" }}>
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 30 + i * 62, height: 2, background: "rgba(0,0,0,.12)" }} />)}</div>
    <Tag tt={tt} at={d} x={x + w / 2} y={Y + 610} txt={lab} col={DIM} size={30} /></>;
  const screw = (y: number, L: number, k: number, out: number, col: string) => <div style={{ position: "absolute", left: 380 - L * (1 - k) - 40 + out * -300, top: y, transform: `rotate(${out * -18}deg)` }}>
    <div style={{ position: "absolute", left: 0, top: -30, width: 40, height: 100, borderRadius: 8, background: "linear-gradient(90deg,#777,#eee,#888)" }} />
    <div style={{ position: "absolute", left: 40, top: 6, width: L, height: 28, background: `repeating-linear-gradient(90deg, ${col} 0 10px, #6c6c6c 10px 16px)`, clipPath: "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)" }} />
  </div>;
  return <>
    {layer(380, 170, "linear-gradient(90deg,#c8955b,#a97640)", "MARCO", 0.5)}{layer(550, 380, "linear-gradient(90deg,#8d5e33,#6d4627)", "MADERA DE ATRÁS", 0.7)}{layer(930, 420, "linear-gradient(90deg,#bdb6aa,#948c80)", "PARED", 0.9)}
    {screw(Y + 140, 150, s1, pull, "#d9d9d9")}
    <Tag tt={tt} at={1.8} x={300} y={Y + 60} txt={h.a ?? "1,5 CM"} col={RED} size={48} />
    {screw(Y + 380, 600, s2, 0, "#e9d9a8")}
    <Tag tt={tt} at={(h.long ?? 3.6) + 1.4} x={300} y={Y + 460} txt={h.b ?? "6 CM"} col={GRN} size={48} />
    <div style={{ position: "absolute", left: 120, top: Y + 120, opacity: cl((tt - (h.pull ?? 2.6) + 0.6) * 2) * (1 - pull), fontSize: 110, color: RED, fontWeight: 900 }}>←</div>
    {h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}
  </>;
}}</Stage>;

// ---------- 15 · EL SONIDO QUE CRUZA LA CUADRA: ondas desde el objeto y las ventanas de los vecinos se prenden ----------
const House: React.FC<{ x: number; y: number; w: number; lit: number; c?: string }> = ({ x, y, w, lit, c = "#1b2030" }) => (
  <svg width={w} height={w} viewBox="0 0 100 100" style={{ position: "absolute", left: x - w / 2, top: y - w }}>
    <path d="M 8 48 L 50 12 L 92 48 L 92 100 L 8 100 Z" fill={c} /><rect x={22} y={56} width={20} height={20} fill={`rgba(255,196,110,${0.08 + 0.92 * lit})`} />
    <rect x={58} y={56} width={20} height={20} fill={`rgba(255,196,110,${0.08 + 0.92 * lit})`} /><rect x={44} y={80} width={12} height={20} fill="#0c0e15" />
  </svg>);
export const HSoundwave: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 60%, #151a28, #05060a 75%)">{(tt) => {
  const s = phys(tt, 0.3, 5, 0.55), c = { x: 960, y: 560 };
  return <>
    {[0, 1, 2, 3, 4].map((i) => { const q = ((tt - 1.0 - i * 0.35) * 0.45) % 1.6; return q > 0 ? <div key={i} style={{ position: "absolute", left: c.x, top: c.y, width: q * 1500, height: q * 1500, marginLeft: -q * 750, marginTop: -q * 750, borderRadius: "50%", border: `${6 - q * 3}px solid rgba(255,200,120,${0.55 * (1 - q / 1.6)})` }} /> : null; })}
    {Array.from({ length: 8 }, (_, i) => { const x = 120 + i * 240 + (i > 3 ? 0 : 0), d = Math.abs(x - c.x) / 1600, lit = cl((tt - 1.6 - d * 3.2) * 2); return <House key={i} x={x} y={1040} w={200} lit={lit} />; })}
    <div style={{ position: "absolute", left: c.x, top: c.y, transform: `translate(-50%,-50%) scale(${s})` }}>
      <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,200,120,.35), transparent 70%)" }} />
      <Photo id={h.img} w={340} h={340} r={170} />
    </div>
    <div style={{ position: "absolute", left: c.x, top: 250, transform: `translate(-50%,-50%) scale(${cl(phys(tt, 1.1, 7, 0.35))}) rotate(-6deg)`, fontFamily: MARK, fontSize: 120, color: AMB, textShadow: "0 10px 30px rgba(0,0,0,.6)" }}>{h.txt ?? "¡PIII!"}</div>
    {h.lab && <Tag tt={tt} at={2.6} x={c.x} y={820} txt={h.lab} col={TX} size={44} />}
  </>;
}}</Stage>;

// ---------- 16 · EL MAPA: dos caminos desde tu casa; uno larguísimo, otro de 50 metros ----------
export const HRoute: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #26221a, #0b0a08 75%)">{(tt) => {
  const far = eio(tt, 0.8, 3.0), near = eio(tt, h.nearAt ?? 3.4, (h.nearAt ?? 3.4) + 0.8), H0 = { x: 520, y: 620 };
  const P1 = `M ${H0.x} ${H0.y} C 760 860 1100 900 1300 700 S 1620 300 1760 200`, P2 = `M ${H0.x} ${H0.y} L ${H0.x + 260} ${H0.y - 40}`;
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={i * 100} x2={1920} y2={i * 100 + 160} stroke="rgba(255,220,160,.05)" strokeWidth={30} />)}
      <path d={P1} stroke="rgba(0,0,0,.5)" strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={P1} stroke={DIM} strokeWidth={8} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${far} 1`} />
      <path d={P2} stroke={GRN} strokeWidth={14} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${near} 1`} />
    </svg>
    <House x={H0.x} y={H0.y + 40} w={230} lit={1} c="#3a3226" />
    <House x={H0.x + 280} y={H0.y} w={190} lit={near} c="#2c3326" />
    <House x={1760} y={230} w={170} lit={far} c="#2a2a2e" />
    <Tag tt={tt} at={2.6} x={1600} y={360} txt={h.a ?? "TU HIJO · 40 MIN"} col={DIM} size={50} />
    <Tag tt={tt} at={(h.nearAt ?? 3.4) + 0.8} x={H0.x + 300} y={H0.y - 170} txt={h.b ?? "EL VECINO · 50 M"} col={GRN} size={56} />
    {h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}
  </>;
}}</Stage>;

// ---------- 17 · LA RED DEL BARRIO: tu casa al centro; cada vecino se prende y se une con una línea de luz ----------
export const HNetwork: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 55%, #141a26, #04050a 75%)">{(tt) => {
  const I = it(h), C = { x: 960, y: 600 }, R = 360;
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {I.map((c, i) => { const q = -Math.PI / 2 + (i - (I.length - 1) / 2) * 0.95, x = C.x + Math.cos(q) * R * 1.35, y = C.y + Math.sin(q) * R * 0.8 + 120, k = eio(tt, c.at, c.at + 0.6);
        return <g key={i}><line x1={C.x} y1={C.y - 60} x2={C.x + (x - C.x) * k} y2={C.y - 60 + (y - 60 - C.y + 60) * k} stroke={AMB} strokeWidth={6} opacity={0.8} />
          {I.map((d, j) => j === i + 1 ? <line key={j} x1={x} y1={y - 60} x2={x + (C.x + Math.cos(-Math.PI / 2 + (j - (I.length - 1) / 2) * 0.95) * R * 1.35 - x) * cl(tt - d.at - 0.6)} y2={y - 60} stroke="rgba(255,178,87,.35)" strokeWidth={3} strokeDasharray="10 10" /> : null)}</g>; })}
    </svg>
    <House x={C.x} y={C.y + 30} w={190} lit={1} c="#3a3226" />
    {I.map((c, i) => { const q = -Math.PI / 2 + (i - (I.length - 1) / 2) * 0.95, x = C.x + Math.cos(q) * R * 1.35, y = C.y + Math.sin(q) * R * 0.8 + 120, k = cl(phys(tt, c.at + 0.5, 6, 0.5));
      return <React.Fragment key={i}><div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${0.6 + 0.4 * k})`, transformOrigin: `${x}px ${y}px`, opacity: cl(k * 2) }}><House x={x} y={y} w={150} lit={k} /></div>
        <Tag tt={tt} at={c.at + 0.7} x={x} y={y + 40} txt={c.t} col={TX} size={34} /></React.Fragment>; })}
    {h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}
  </>;
}}</Stage>;

// ---------- 18 · EL CORCHO: notas de papel que se clavan de a una con chinche ----------
export const HCork: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse 90% 80% at 50% 50%, #8a6438, #3b2914 85%)">{(tt) => {
  const I = it(h), cols = ["#fff6a8", "#ffd3e0", "#cfeeff", "#d9ffcf", "#fff"];
  return <>
    <div style={{ position: "absolute", inset: 0, opacity: 0.35, background: "repeating-radial-gradient(circle at 30% 40%, rgba(0,0,0,.18) 0 2px, transparent 2px 7px)" }} />
    {I.map((c, i) => { const s = phys(tt, c.at, 6, 0.42), x = 380 + (i % 3) * 580 + (i > 2 ? 280 : 0), y = i > 2 ? 720 : 400 + (i % 2) * 40, r = [-5, 3, -2, 4, -3][i % 5];
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateZ(${(1 - s) * 400}px) rotate(${r + (1 - s) * 10}deg) scale(${1 + (1 - s) * 0.3})`, opacity: cl(s * 3), width: 460, minHeight: 280, background: cols[i % 5], boxShadow: "0 26px 40px rgba(0,0,0,.45)", padding: "60px 30px 30px", fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#2b241b", textAlign: "center", lineHeight: 1.05 }}>
        {c.img && <Photo id={c.img} w={400} h={180} r={4} style={{ margin: "0 auto 14px" }} />}{c.t}
        <div style={{ position: "absolute", left: "50%", top: 14, width: 40, height: 40, marginLeft: -20, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff8a7a, #b5261a)", boxShadow: "0 8px 10px rgba(0,0,0,.45)" }} />
      </div>; })}
    {h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}
  </>;
}}</Stage>;
