// ola1_B · componentes únicos nuevos 4 (estante, dardos, latido, mosaico, pergamino, nivel de burbuja, engranajes, fósforo, carta a mano, pesas).
import React from "react";
import { AMB, DIM, GRN, H, HAND, MARK, Photo, RED, Shadow, Sheen, Stage, TX, Tag, cl, eIn, eio, img, phys } from "./hkit";
import { Img } from "remotion";

export type HP = { t: number; h: H };
type It = { t: string; img?: string; at: number; ok?: boolean | string; n?: string };
const it = (h: H) => (h.items ?? []) as It[];

// ---------- 31 · ESTANTE: la tabla de madera y las cosas que se apoyan una por una (con su peso) ----------
export const HShelf: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const xs = it(h).slice(0, 5), n = Math.max(1, xs.length), w = Math.min(300, 1300 / n);
  return <>
    <div style={{ position: "absolute", left: 220, right: 220, top: 700, height: 44, borderRadius: 6, background: "linear-gradient(180deg,#8a5e38,#5b3a20)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
    {[300, 1560].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 744, width: 40, height: 120, background: "linear-gradient(90deg,#3a2a1a,#5b3a20)", clipPath: "polygon(0 0,100% 0,100% 100%)" }} />)}
    {xs.map((x, i) => {
      const k = phys(tt, 0.4 + i * 0.45, 8, 0.38), X = 960 + (i - (n - 1) / 2) * (w + 30);
      return <div key={i} style={{ position: "absolute", left: X - w / 2, top: 700 - 300 - (1 - k) * 400, opacity: cl(k * 3) }}>
        <Photo id={x.img} w={w} h={300} r={14} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 320 + 60, textAlign: "center", fontWeight: 900, fontSize: 30, color: TX }}>{x.t}</div>
      </div>;
    })}
    <Tag tt={tt} at={0.8 + n * 0.45} x={960} y={950} txt={h.lab ?? ""} col={AMB} size={46} />
  </>;
}}</Stage>;

// ---------- 32 · DARDOS: tres dardos; los dos primeros fallan, el tercero clava el centro (el truco que sí) ----------
export const HDart: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const cx = 960, cy = 500, R = 340, hits = [[-210, -150], [190, 170], [0, 0]];
  return <>
    {[1, 0.8, 0.6, 0.4, 0.2, 0.08].map((s, i) => <div key={i} style={{ position: "absolute", left: cx - R * s, top: cy - R * s, width: 2 * R * s, height: 2 * R * s, borderRadius: "50%", background: i === 5 ? RED : i % 2 ? "#efe6d2" : "#1d1a16", boxShadow: i === 0 ? "0 50px 100px rgba(0,0,0,.65)" : undefined }} />)}
    {hits.map(([dx, dy], i) => {
      const a = 0.5 + i * 0.9, f = eIn(tt, a, a + 0.28), wob = tt > a + 0.28 ? Math.sin((tt - a - 0.28) * 30) * Math.exp(-(tt - a - 0.28) * 6) * 6 : 0;
      if (tt < a - 0.05) return null;
      const X = cx + dx + (1 - f) * 900, Y = cy + dy - (1 - f) * 200;
      return <div key={i} style={{ position: "absolute", left: X, top: Y, width: 260, height: 24, transformOrigin: "0 50%", transform: `rotate(${-14 + wob}deg)` }}>
        <div style={{ position: "absolute", left: 0, top: 9, width: 50, height: 6, background: "#ccc" }} />
        <div style={{ position: "absolute", left: 50, top: 2, width: 130, height: 20, borderRadius: 10, background: i === 2 ? "linear-gradient(180deg,#ffd27a,#c98a1e)" : "linear-gradient(180deg,#888,#444)" }} />
        <div style={{ position: "absolute", left: 180, top: -14, width: 80, height: 52, background: i === 2 ? GRN : "#888", clipPath: "polygon(0 40%,100% 0,100% 100%,0 60%)" }} />
      </div>;
    })}
    <Tag tt={tt} at={0.9} x={300} y={260} txt={(h.miss ?? [])[0] ?? ""} col="rgba(255,255,255,.4)" size={34} />
    <Tag tt={tt} at={1.8} x={1600} y={780} txt={(h.miss ?? [])[1] ?? ""} col="rgba(255,255,255,.4)" size={34} />
    <Tag tt={tt} at={2.6} x={960} y={960} txt={h.lab ?? ""} col={GRN} size={52} />
  </>;
}}</Stage>;

// ---------- 33 · LATIDO: el monitor dibuja el pulso; plano, después vuelve a latir fuerte ----------
export const HPulse: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="shutter" bg="#020806">{(tt) => {
  const W = 1500, pts: string[] = [], head = cl((tt - 0.3) / 3.2) * W, flat = h.flat ? 1 : 0;
  for (let x = 0; x <= head; x += 6) {
    const ph = (x % 300) / 300, live = !flat || x > W * 0.55, amp = live ? (ph > 0.42 && ph < 0.46 ? -220 : ph > 0.46 && ph < 0.5 ? 160 : ph > 0.5 && ph < 0.54 ? -40 : ph > 0.7 && ph < 0.8 ? -30 * Math.sin((ph - 0.7) * 31) : 0) : 0;
    pts.push(`${x},${300 + amp}`);
  }
  return <>
    <div style={{ position: "absolute", left: 210, top: 240, width: W, height: 600, borderRadius: 30, background: "#03140c", boxShadow: "0 50px 100px rgba(0,0,0,.8), inset 0 0 0 12px #1c2b24", backgroundImage: "linear-gradient(rgba(80,255,150,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(80,255,150,.06) 1px, transparent 1px)", backgroundSize: "50px 50px" }}>
      <svg width={W} height={600} style={{ position: "absolute", left: 0, top: 0 }}><polyline points={pts.join(" ")} fill="none" stroke="#5dff9a" strokeWidth={8} strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 10px #5dff9a)" }} /></svg>
      <div style={{ position: "absolute", left: head - 14, top: 286, width: 28, height: 28, borderRadius: "50%", background: "#c8ffe0", boxShadow: "0 0 30px #5dff9a" }} />
    </div>
    <Tag tt={tt} at={0.5} x={260} y={300} txt={h.a ?? ""} col={flat ? RED : "#5dff9a"} size={38} anchor="l" />
    <Tag tt={tt} at={2.6} x={960} y={930} txt={h.lab ?? ""} col="#5dff9a" size={50} />
  </>;
}}</Stage>;

// ---------- 34 · MOSAICO: muchas fotitos chicas vuelan y forman una grilla; la del medio crece ----------
export const HMosaic: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const ims = Array.from(new Set(((Array.isArray(h.imgs) ? h.imgs : h.imgs ? [h.imgs] : []) as (string | undefined)[]).filter(Boolean) as string[])), C = 4, R = 3, cw = 330, ch = 220, x0 = 960 - (C * cw + (C - 1) * 16) / 2, y0 = 160;
  const grow = eio(tt, 2.2, 3.0);
  return <>
    {Array.from({ length: Math.min(C * R, ims.length) }, (_, i) => {
      const c = i % C, r = Math.floor(i / C), k = phys(tt, 0.2 + ((i * 7) % 12) * 0.12, 7, 0.6), mid = i === 5;
      const X = x0 + c * (cw + 16), Y = y0 + r * (ch + 16);
      const gx = mid ? (960 - cw * 1.25 - X) * grow : 0, gy = mid ? (540 - ch * 1.25 - Y) * grow : 0, sc = mid ? 1 + 1.5 * grow : 1;
      return <div key={i} style={{ position: "absolute", left: X + gx, top: Y + gy, transform: `translateY(${(1 - k) * 600}px) rotate(${(1 - k) * (i % 2 ? 20 : -20)}deg) scale(${sc})`, transformOrigin: "0 0", opacity: cl(k * 2) * (mid ? 1 : 1 - grow * 0.6), zIndex: mid ? 5 : 1 }}>
        <Photo id={ims[i]} w={cw} h={ch} r={10} />
      </div>;
    })}
    <Tag tt={tt} at={2.8} x={960} y={1000} txt={h.lab ?? ""} col={AMB} size={48} />
  </>;
}}</Stage>;

// ---------- 35 · PERGAMINO: el rollo se desenrolla hacia abajo y aparece la lista escrita a mano ----------
export const HScroll: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const xs = it(h).slice(0, 6), open = eio(tt, 0.3, 1.6), Hh = 120 + 700 * open;
  return <>
    <div style={{ position: "absolute", left: 960 - 380, top: 150, width: 760, height: Hh, background: "linear-gradient(90deg,#d9c39a,#f3e6c8 20%,#f3e6c8 80%,#d9c39a)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", overflow: "hidden", padding: "70px 70px" }}>
      {xs.map((x, i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: x.ok === false ? "#8a1d12" : "#2a1d12", lineHeight: 1.6, opacity: cl((tt - 1.0 - i * 0.35) * 3), textDecoration: x.ok === false ? "line-through" : "none" }}>{x.n ?? "·"} {x.t}</div>)}
    </div>
    {[150, 150 + Hh].map((y, i) => <div key={i} style={{ position: "absolute", left: 960 - 420, top: y - 40, width: 840, height: 80, borderRadius: 40, background: "linear-gradient(180deg,#b88a50,#e8c88a 40%,#7a5a2a)", boxShadow: "0 20px 40px rgba(0,0,0,.55)" }} />)}
    {h.lab && <Tag tt={tt} at={1.2} x={960} y={1010} txt={h.lab} col={AMB} size={40} />}
  </>;
}}</Stage>;

// ---------- 36 · NIVEL DE BURBUJA: la burbuja anda de un lado a otro y se centra cuando todo está bien ----------
export const HLevel: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s = eio(tt, 0.4, 2.6), tilt = (1 - s) * 7 * Math.cos(tt * 2.2), bx = 960 + tilt * 52;
  return <>
    <div style={{ position: "absolute", left: 260, top: 470, width: 1400, height: 170, borderRadius: 24, background: "linear-gradient(180deg,#ffcf3a,#d69a10)", boxShadow: "0 50px 100px rgba(0,0,0,.6)", transform: `rotate(${tilt}deg)` }}>
      <div style={{ position: "absolute", left: 500, top: 40, width: 400, height: 90, borderRadius: 45, background: "linear-gradient(180deg,#d9ff7a,#9ad62a)", boxShadow: "inset 0 6px 20px rgba(0,0,0,.35)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 130, top: 0, width: 4, height: 90, background: "rgba(0,0,0,.55)" }} />
        <div style={{ position: "absolute", left: 266, top: 0, width: 4, height: 90, background: "rgba(0,0,0,.55)" }} />
        <div style={{ position: "absolute", left: bx - 960 + 200 - 60, top: 16, width: 120, height: 58, borderRadius: 29, background: "radial-gradient(ellipse at 40% 35%, #fff, rgba(255,255,255,.4))" }} />
      </div>
      <Sheen p={cl(tt / 3)} r={24} o={0.25} />
    </div>
    <Shadow x={960} y={690} w={1400} />
    <Tag tt={tt} at={2.7} x={960} y={800} txt={h.lab ?? ""} col={s > 0.98 ? GRN : TX} size={52} />
    {h.sub && <Tag tt={tt} at={3.1} x={960} y={870} txt={h.sub} col={DIM} size={34} />}
  </>;
}}</Stage>;

// ---------- 37 · ENGRANAJES: tres ruedas dentadas que engranan; cuando la última gira, aparece el resultado ----------
const Gear: React.FC<{ x: number; y: number; r: number; a: number; col: string; lab?: string }> = ({ x, y, r, a, col, lab }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r }}>
    <div style={{ position: "absolute", inset: 0, transform: `rotate(${a}deg)` }}>
      {Array.from({ length: Math.round(r / 18) }, (_, i) => <div key={i} style={{ position: "absolute", left: r - 18, top: -16, width: 36, height: 50, borderRadius: 6, background: col, transformOrigin: `18px ${r + 16}px`, transform: `rotate(${(i * 360) / Math.round(r / 18)}deg)` }} />)}
      <div style={{ position: "absolute", inset: 6, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff8, ${col} 40%, #0008 140%)`, boxShadow: "0 30px 60px rgba(0,0,0,.55)" }} />
      <div style={{ position: "absolute", left: r - 26, top: r - 26, width: 52, height: 52, borderRadius: "50%", background: "#1c1c1f" }} />
    </div>
    {lab && <div style={{ position: "absolute", left: -100, right: -100, top: 2 * r + 50, textAlign: "center", fontWeight: 900, fontSize: 38, color: TX, whiteSpace: "nowrap", textShadow: "0 6px 20px #000" }}>{lab}</div>}
  </div>
);
export const HGears: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const xs = it(h).slice(0, 3), sp = eIn(tt, 0.5, 1.5) * (tt - 0.5) * 60, out = phys(tt, 2.4, 6, 0.5);
  const G = [[560, 470, 200], [940, 360, 150], [1300, 500, 180]];
  return <>
    {G.map(([x, y, r], i) => <Gear key={i} x={x} y={y} r={r} a={(i % 2 ? -1 : 1) * sp * (220 / r) + i * 8} col={[AMB, "#c7ccd2", "#d39b6a"][i]} lab={xs[i]?.t} />)}
    <div style={{ position: "absolute", left: 960, top: 900, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * out})`, opacity: cl(out * 2), fontWeight: 900, fontSize: 58, color: GRN, whiteSpace: "nowrap", textShadow: "0 8px 30px #000" }}>{h.lab ?? ""}</div>
  </>;
}}</Stage>;

// ---------- 38 · FÓSFORO: la cabeza raspa la caja, chispa, y la llamita (lenta) prende la idea ----------
export const HMatch: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 50%, #1a120a, #050302 75%)">{(tt) => {
  const st = eio(tt, 0.4, 1.0), lit = tt > 1.0, f = lit ? cl((tt - 1.0) * 3) : 0, fl = 1 + 0.07 * Math.sin(tt * 2 * Math.PI * 1.4);
  const mx = 560 + 420 * st, my = 640 - 60 * st;
  return <>
    <div style={{ position: "absolute", left: 360, top: 620, width: 500, height: 300, borderRadius: 12, background: "linear-gradient(180deg,#c9302a,#8a1d18)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40, background: "repeating-linear-gradient(90deg,#4a2a1a 0 6px,#2a1a10 6px 12px)" }} />
      <div style={{ position: "absolute", left: 60, top: 100, fontFamily: MARK, fontSize: 60, color: "#ffd27a" }}>{h.kick ?? ""}</div>
    </div>
    <div style={{ position: "absolute", left: mx, top: my, width: 560, height: 28, transformOrigin: "0 50%", transform: `rotate(${-20 + 10 * st}deg)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 28, borderRadius: 6, background: "linear-gradient(180deg,#f1d9a8,#c9a26a)" }} />
      <div style={{ position: "absolute", left: 500, top: -16, width: 70, height: 60, borderRadius: "50%", background: lit ? "#2a1a10" : "radial-gradient(circle at 40% 35%,#ff6a4a,#a01d10)" }} />
      {lit && <div style={{ position: "absolute", left: 500, top: -170 * fl, width: 80, height: 170 * fl, borderRadius: "50% 50% 50% 50% / 65% 65% 35% 35%", background: "radial-gradient(ellipse at 50% 80%, #fff8d0, #ffbd45 45%, rgba(255,90,20,0) 75%)", transform: `scale(${f})`, transformOrigin: "50% 100%", filter: "blur(1px)" }} />}
    </div>
    {lit && <div style={{ position: "absolute", left: mx + 300, top: my - 400, width: 900, height: 900, background: "radial-gradient(circle, rgba(255,190,90,.22), transparent 60%)", opacity: f }} />}
    <Tag tt={tt} at={1.4} x={1240} y={250} txt={h.lab ?? ""} col={AMB} size={56} />
    {h.sub && <Tag tt={tt} at={1.9} x={1240} y={320} txt={h.sub} col={DIM} size={34} />}
  </>;
}}</Stage>;

// ---------- 39 · CARTA A MANO: hoja de cuaderno vieja; la tinta escribe las líneas y abajo la firma ----------
export const HLetter: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const lines = (h.lines ?? []) as string[], all = lines.join(""), per = Math.max(1.4, (h.out - h.at - 1.8)) / Math.max(1, all.length);
  let used = 0;
  return <>
    <div style={{ position: "absolute", left: 960 - 520, top: 110, width: 1040, height: 860, backgroundColor: "#f6ecd2", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 119px, rgba(90,120,200,.35) 119px 121px), linear-gradient(180deg,#fbf3df,#efe2c2)", boxShadow: "0 40px 90px rgba(0,0,0,.6)", transform: "rotate(-2deg)", padding: "150px 120px" }}>
      <div style={{ position: "absolute", left: 70, top: 0, bottom: 0, width: 3, background: "rgba(214,91,91,.5)" }} />
      {lines.map((l, i) => {
        const n = Math.max(0, Math.min(l.length, Math.floor((tt - 0.5 - used * per) / per))); used += l.length;
        return <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 96, lineHeight: "120px", color: "#1f2a5a", whiteSpace: "pre" }}>{l.slice(0, n)}</div>;
      })}
      {h.sign && <div style={{ position: "absolute", right: 100, bottom: 80, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#1f2a5a", opacity: cl((tt - 0.6 - all.length * per) * 2) }}>{h.sign}</div>}
    </div>
  </>;
}}</Stage>;

// ---------- 40 · PESAS: la barra se carga disco por disco y se dobla un poquito con el peso ----------
export const HWeights: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="shutter">{(tt) => {
  const xs = it(h).slice(0, 4), loaded = xs.filter((_, i) => tt > 0.5 + i * 0.5).length, bend = loaded * 6;
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M 200 ${540 + bend} Q 960 ${540 - bend * 0.5} 1720 ${540 + bend}`} stroke="#c7ccd2" strokeWidth={30} fill="none" strokeLinecap="round" /></svg>
    {xs.map((x, i) => {
      const k = phys(tt, 0.5 + i * 0.5, 8, 0.45), R = 200 - i * 26;
      return [-1, 1].map((sd) => <div key={i + "" + sd} style={{ position: "absolute", left: 960 + sd * (560 - i * 64) - 34, top: 540 + bend * 0.9 - R + (1 - k) * -600, width: 68, height: 2 * R, borderRadius: 20, background: "linear-gradient(90deg,#1c1c1f,#4a4a50,#1c1c1f)", boxShadow: "0 20px 40px rgba(0,0,0,.6)", opacity: cl(k * 3) }} />);
    })}
    {xs.map((x, i) => <Tag key={"t" + i} tt={tt} at={0.7 + i * 0.5} x={960} y={250 + i * 70} txt={x.t} col={i === xs.length - 1 ? AMB : TX} size={40} />)}
    <Shadow x={960} y={820} w={1500} />
    {h.lab && <Tag tt={tt} at={1 + xs.length * 0.5} x={960} y={900} txt={h.lab} col={RED} size={50} />}
  </>;
}}</Stage>;
