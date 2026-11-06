// ola1_B · componentes únicos nuevos 1 (dominó, ábaco, heladera con notas, boleto, brújula, alcancía, lupa, reflector, plano técnico, máquina de escribir).
// Ninguno existe en cer28/cer30/rosa29/mec28. Cada uno = un OBJETO que se entiende sin leer; rótulos ≤5 palabras, nunca arriba a la izquierda.
import React from "react";
import { AMB, DIM, GRN, H, HAND, MARK, Photo, RED, Shadow, Sheen, Stage, TX, Tag, cl, eIn, eio, img, phys } from "./hkit";
import { Img } from "remotion";

export type HP = { t: number; h: H };
type It = { t: string; img?: string; at: number; ok?: boolean | string; n?: string };
const it = (h: H) => (h.items ?? []) as It[];
const WOOD = "linear-gradient(180deg,#6b4a2e,#4a321f 60%,#38251a)";

// ---------- 1 · DOMINÓ: una ficha empuja a la otra; cada ficha es una consecuencia, la última cae sobre el sello ----------
export const HDominoes: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const xs = it(h), n = Math.max(1, xs.length), gap = Math.min(300, 1500 / n), x0 = 960 - (gap * (n - 1)) / 2;
  return <>
    <div style={{ position: "absolute", left: 160, right: 160, top: 760, height: 26, borderRadius: 13, background: WOOD, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
    {xs.map((x, i) => {
      const go = 1.8 + i * 0.4, f = eIn(tt, go, go + 0.38), ang = 72 * Math.min(1, f) * (i < n - 1 ? 0.92 : 1);
      const pop = phys(tt, 0.2 + i * 0.12, 6, 0.5);
      return <div key={i} style={{ position: "absolute", left: x0 + i * gap - 70, top: 760 - 330, width: 140, height: 330, transformOrigin: "100% 100%", transform: `rotate(${ang}deg) translateY(${(1 - pop) * -500}px)`, opacity: cl(pop * 2) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(160deg,#fbf7ee,#d9d1c1)", boxShadow: "0 24px 50px rgba(0,0,0,.55), inset -6px 0 0 rgba(0,0,0,.12)" }} />
        <div style={{ position: "absolute", left: 14, right: 14, top: 160, height: 4, background: "#2b2620", borderRadius: 2 }} />
        {x.img ? <div style={{ position: "absolute", left: 14, right: 14, top: 18, height: 130, borderRadius: 10, overflow: "hidden" }}><Img src={img(x.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          : <div style={{ position: "absolute", left: 0, right: 0, top: 38, textAlign: "center", fontWeight: 900, fontSize: 80, color: "#2b2620" }}>{x.n ?? i + 1}</div>}
        <Sheen p={cl((tt - 0.3 - i * 0.1) / 1.2)} r={18} o={0.25} />
      </div>;
    })}
    {xs.map((x, i) => <Tag key={"l" + i} tt={tt} at={0.5 + i * 0.15} x={x0 + i * gap} y={830} txt={x.t} col={TX} size={30} />)}
    <Shadow x={960} y={790} w={1500} />
    {h.stamp && <Tag tt={tt} at={h.stampAt ?? 2.4 + n * 0.4} x={960} y={920} txt={h.stamp} col={h.bad ? RED : AMB} size={54} />}
  </>;
}}</Stage>;

// ---------- 2 · ÁBACO: las cuentas de madera corren de a una y suman la cifra ----------
export const HAbacus: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const v = Math.max(1, Math.min(30, +(h.v ?? 10))), rows = Math.ceil(v / 10);
  let shown = 0;
  return <>
    <div style={{ position: "absolute", left: 360, top: 260, width: 1200, height: 120 + rows * 120, borderRadius: 26, border: "26px solid #5a3b22", boxShadow: "0 50px 100px rgba(0,0,0,.65), inset 0 0 0 2px rgba(255,255,255,.08)", background: "rgba(0,0,0,.25)" }} />
    {Array.from({ length: rows }, (_, r) => <React.Fragment key={r}>
      <div style={{ position: "absolute", left: 386, width: 1148, top: 346 + r * 120, height: 8, borderRadius: 4, background: "linear-gradient(180deg,#d8d0c0,#8a8170)" }} />
      {Array.from({ length: 10 }, (_, i) => {
        const idx = r * 10 + i, on = idx < v, go = 0.6 + idx * 0.16, k = on ? phys(tt, go, 9, 0.5) : 0;
        if (on && tt > go) shown = idx + 1;
        const xr = 1480 - (9 - i) * 78, xl = 440 + i * 78, x = on ? xr + (xl - xr) * k : xr;
        return <div key={i} style={{ position: "absolute", left: x - 34, top: 350 + r * 120 - 44, width: 68, height: 88, borderRadius: "50%", background: on ? `radial-gradient(circle at 35% 30%, #ffd59a, ${AMB} 45%, #8a4b14)` : "radial-gradient(circle at 35% 30%, #a68c6c, #5b4630 60%, #2e2116)", boxShadow: "0 14px 24px rgba(0,0,0,.5)" }} />;
      })}
    </React.Fragment>)}
    <div style={{ position: "absolute", left: 960, top: 210, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 120, color: AMB, textShadow: "0 10px 40px rgba(0,0,0,.6)" }}>{shown}</div>
    <Tag tt={tt} at={0.8 + v * 0.16} x={960} y={320 + rows * 120 + 140} txt={h.u ?? ""} col={TX} size={52} />
    {h.sub && <Tag tt={tt} at={1.4 + v * 0.16} x={960} y={320 + rows * 120 + 210} txt={h.sub} col={DIM} size={32} />}
  </>;
}}</Stage>;

// ---------- 3 · HELADERA CON NOTAS: la puerta de la heladera y los papelitos que se pegan con imán, uno por regla ----------
export const HFridge: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const xs = it(h).slice(0, 6), cols = ["#fff2a8", "#ffd1dc", "#c9f0ff", "#d6f5c9", "#ffe0b8", "#efe3ff"];
  return <>
    <div style={{ position: "absolute", left: 560, top: 70, width: 800, height: 960, borderRadius: 40, background: "linear-gradient(100deg,#e9ecef,#cfd4d9 60%,#b9bfc6)", boxShadow: "0 60px 120px rgba(0,0,0,.65), inset -14px 0 0 rgba(0,0,0,.08)" }}>
      <div style={{ position: "absolute", right: 36, top: 330, width: 26, height: 300, borderRadius: 13, background: "linear-gradient(90deg,#9aa1a8,#f4f6f8,#9aa1a8)" }} />
      <Sheen p={cl(tt / 3)} r={40} o={0.3} />
    </div>
    {xs.map((x, i) => {
      const k = phys(tt, 0.6 + i * 0.55, 8, 0.4), col = i % 2, row = Math.floor(i / 2), rot = [-5, 4, 3, -6, -2, 5][i];
      return <div key={i} style={{ position: "absolute", left: 620 + col * 350, top: 140 + row * 290, width: 320, height: 250, transform: `rotate(${rot}deg) translateY(${(1 - k) * -80}px) scale(${0.7 + 0.3 * k})`, opacity: cl(k * 2), background: cols[i], boxShadow: "0 18px 30px rgba(0,0,0,.35)", padding: "54px 22px 10px", fontFamily: HAND, fontWeight: 700, fontSize: 46, lineHeight: 1.0, color: "#2a2520", textAlign: "center" }}>
        <div style={{ position: "absolute", left: 136, top: -14, width: 48, height: 48, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff, ${[RED, AMB, GRN][i % 3]} 55%, #333)`, boxShadow: "0 8px 12px rgba(0,0,0,.4)" }} />
        {x.t}
      </div>;
    })}
    <Shadow x={960} y={1040} w={900} />
    {h.lab && <Tag tt={tt} at={1 + xs.length * 0.55} x={960} y={1010} txt={h.lab} col={AMB} size={40} />}
  </>;
}}</Stage>;

// ---------- 4 · BOLETO: un boleto de papel con troquel que se corta por la línea punteada (lo que te ahorrás / lo que ganás) ----------
export const HTicket: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const tear = eio(tt, 2.0, 2.8), k = phys(tt, 0.3, 5, 0.55);
  return <>
    <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) rotate(${-4 + 4 * k}deg) scale(${0.6 + 0.4 * k})`, display: "flex" }}>
      <div style={{ width: 820, height: 380, borderRadius: "28px 0 0 28px", background: "linear-gradient(160deg,#f6e7c8,#e3cfa3)", boxShadow: "0 50px 100px rgba(0,0,0,.6)", padding: 46, position: "relative" }}>
        <div style={{ fontFamily: MARK, fontSize: 40, color: "#7a3a1a", letterSpacing: 2 }}>{h.kick ?? "ADMITE UNO"}</div>
        <div style={{ fontWeight: 900, fontSize: 92, lineHeight: 1.0, color: "#2a1d12", marginTop: 20 }}>{h.title ?? h.lab ?? ""}</div>
        <div style={{ position: "absolute", left: 46, bottom: 40, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: "#7a5a3a" }}>{h.sub ?? ""}</div>
        <Sheen p={cl(tt / 2.5)} r={28} o={0.3} />
      </div>
      <div style={{ width: 300, height: 380, borderRadius: "0 28px 28px 0", background: "linear-gradient(160deg,#f6e7c8,#d9c294)", boxShadow: "0 50px 100px rgba(0,0,0,.6)", borderLeft: "6px dashed #8a6a44", transform: `translate(${tear * 140}px, ${tear * 60}px) rotate(${tear * 14}deg)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontWeight: 900, fontSize: 110, color: h.bad ? RED : "#2f6b3a" }}>{h.v ?? "✓"}</div>
        <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: 4, color: "#5a4128" }}>{h.u ?? ""}</div>
      </div>
    </div>
    <Shadow x={960} y={760} w={1100} />
  </>;
}}</Stage>;

// ---------- 5 · BRÚJULA: la aguja duda y clava la dirección correcta; los rumbos son las opciones ----------
export const HCompass: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const opts = (h.opts ?? ["N", "E", "S", "O"]) as string[], win = +(h.win ?? 0), target = win * 90;
  const settle = eio(tt, 0.6, 3.2), wob = (1 - settle) * 70 * Math.sin(tt * 7), ang = target * settle + wob - 140 * (1 - settle);
  return <>
    <div style={{ position: "absolute", left: 960 - 330, top: 520 - 330, width: 660, height: 660, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #3b3227, #17130e 70%)", border: "22px solid #b8893f", boxShadow: "0 60px 120px rgba(0,0,0,.7), inset 0 0 60px rgba(0,0,0,.8)" }}>
      {Array.from({ length: 36 }, (_, i) => <div key={i} style={{ position: "absolute", left: 308, top: 10, width: 4, height: i % 9 === 0 ? 44 : 22, background: i % 9 === 0 ? AMB : "rgba(255,255,255,.4)", transformOrigin: "2px 298px", transform: `rotate(${i * 10}deg)` }} />)}
      <Sheen p={(tt / 3) % 1} r={330} o={0.12} />
    </div>
    {opts.slice(0, 4).map((o, i) => {
      const a = (i * 90 - 90) * Math.PI / 180, r = 420, on = i === win && settle > 0.95;
      return <div key={i} style={{ position: "absolute", left: 960 + r * Math.cos(a), top: 520 + r * Math.sin(a), transform: `translate(-50%,-50%) scale(${on ? 1.15 : 1})`, fontWeight: 900, fontSize: 40, color: on ? GRN : DIM, whiteSpace: "nowrap", textShadow: "0 6px 20px rgba(0,0,0,.7)" }}>{o}</div>;
    })}
    <div style={{ position: "absolute", left: 960 - 20, top: 520 - 260, width: 40, height: 520, transform: `rotate(${ang}deg)`, transformOrigin: "20px 260px" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderBottom: `260px solid ${RED}` }} />
      <div style={{ position: "absolute", left: 0, top: 260, width: 0, height: 0, borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderTop: "260px solid #e8e1d2" }} />
    </div>
    <div style={{ position: "absolute", left: 930, top: 490, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff1c9, #b8893f)" }} />
    {h.lab && <Tag tt={tt} at={3.4} x={960} y={1000} txt={h.lab} col={AMB} size={46} />}
  </>;
}}</Stage>;

// ---------- 6 · ALCANCÍA: las monedas caen por la ranura, el chanchito se llena y salta ----------
export const HPiggy: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const n = Math.max(3, Math.min(9, +(h.n ?? 6))), last = 0.6 + (n - 1) * 0.38 + 0.5, hop = phys(tt, last, 9, 0.3);
  return <>
    {Array.from({ length: n }, (_, i) => {
      const a = 0.6 + i * 0.38, y = 120 + 340 * eIn(tt, a, a + 0.5), vis = tt > a && tt < a + 0.52;
      return vis ? <div key={i} style={{ position: "absolute", left: 960 - 50 + (i % 2 ? 8 : -8), top: y, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff1b0, #e2a72e 55%, #8a5a10)", boxShadow: "0 10px 20px rgba(0,0,0,.5)", transform: `rotateY(${tt * 720}deg)` }} /> : null;
    })}
    <div style={{ position: "absolute", left: 960 - 320, top: 440 - 30 * Math.sin(Math.PI * cl(hop)) * (tt < last + 0.8 ? 1 : 0), width: 640, height: 420 }}>
      <div style={{ position: "absolute", left: 40, top: 40, width: 560, height: 360, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #ffc9d6, #f08aa4 55%, #a8455f)", boxShadow: "0 50px 100px rgba(0,0,0,.6), inset -30px -20px 60px rgba(0,0,0,.2)" }} />
      <div style={{ position: "absolute", left: 255, top: 40, width: 130, height: 16, borderRadius: 8, background: "#5a1f30" }} />
      <div style={{ position: "absolute", left: -20, top: 170, width: 130, height: 110, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ffc9d6, #e07592)" }}><div style={{ position: "absolute", left: 30, top: 40, width: 18, height: 24, borderRadius: 9, background: "#7a2a40" }} /><div style={{ position: "absolute", left: 70, top: 40, width: 18, height: 24, borderRadius: 9, background: "#7a2a40" }} /></div>
      <div style={{ position: "absolute", left: 130, top: 130, width: 26, height: 26, borderRadius: "50%", background: "#2a0f18" }} />
      {[110, 230, 380, 490].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: 370, width: 60, height: 70, borderRadius: 14, background: "#d06a86" }} />)}
      <Sheen p={cl((tt - 0.4) / 2)} r={280} o={0.25} />
    </div>
    <Shadow x={960} y={890} w={700} k={tt > last ? 1 - 0.5 * Math.sin(Math.PI * cl(hop)) : 1} />
    <Tag tt={tt} at={last + 0.2} x={960} y={970} txt={h.lab ?? ""} col={AMB} size={52} />
  </>;
}}</Stage>;

// ---------- 7 · LUPA: la lupa recorre la foto y agranda el detalle que importa ----------
export const HLoupe: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const fx = +(h.fx ?? 0.62), fy = +(h.fy ?? 0.55), p = eio(tt, 0.5, 2.6), lx = 520 + (fx * 1100 - 520 + 400) * p, ly = 300 + (fy * 640 - 300 + 220) * p;
  const W = 1100, Hh = 640, L = 360, Z = 2.4;
  return <>
    <div style={{ position: "absolute", left: 410, top: 220, width: W, height: Hh, transform: "rotate(-1.5deg)" }}>
      <Photo id={h.img} w={W} h={Hh} r={20} dim={0.25} />
    </div>
    <div style={{ position: "absolute", left: lx - L / 2, top: ly - L / 2, width: L, height: L, borderRadius: "50%", overflow: "hidden", border: "18px solid #2b2b2e", boxShadow: "0 40px 80px rgba(0,0,0,.7), inset 0 0 30px rgba(0,0,0,.5)" }}>
      {h.img && <Img src={img(h.img)} style={{ position: "absolute", width: W * Z, height: Hh * Z, objectFit: "cover", left: -((lx - 410) * Z - L / 2), top: -((ly - 220) * Z - L / 2) }} />}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,.35), transparent 40%)" }} />
    </div>
    <div style={{ position: "absolute", left: lx + L * 0.33, top: ly + L * 0.33, width: 60, height: 260, borderRadius: 30, background: "linear-gradient(90deg,#3a2a1a,#7a5a3a,#3a2a1a)", transform: "rotate(-45deg)", transformOrigin: "30px 0" }} />
    <Tag tt={tt} at={2.7} x={960} y={950} txt={h.lab ?? ""} col={AMB} size={48} />
  </>;
}}</Stage>;

// ---------- 8 · REFLECTOR: todo a oscuras, un haz barre el cuarto y encuentra el objeto ----------
export const HSearchlight: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="shutter" bg="#030304">{(tt) => {
  const sw = eio(tt, 0.4, 2.4), x = 300 + 660 * sw + 120 * Math.sin(tt * 2.2) * (1 - sw), y = 560 - 40 * Math.sin(tt * 1.4) * (1 - sw), r = 260 + 120 * eio(tt, 2.4, 3.2);
  const mk = `radial-gradient(circle at ${x}px ${y}px, #000 ${r * 0.7}px, transparent ${r}px)`;
  return <>
    <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mk, maskImage: mk } as React.CSSProperties}>
      {h.img && <Img src={img(h.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
    </div>
    <div style={{ position: "absolute", inset: 0, background: `conic-gradient(from ${150 + 40 * sw}deg at 50% -10%, transparent 0deg, rgba(255,240,200,.07) 8deg, transparent 16deg)` }} />
    <Tag tt={tt} at={2.6} x={x} y={Math.min(980, y + r + 30)} txt={h.lab ?? ""} col={AMB} size={50} />
  </>;
}}</Stage>;

// ---------- 9 · PLANO TÉCNICO: el objeto se dibuja en líneas blancas sobre azul y aparecen las cotas ----------
export const HBlueprint: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse at 50% 45%, #1d4f86, #0c2748 75%)">{(tt) => {
  const d = eio(tt, 0.3, 2.2), ph = eio(tt, 2.0, 2.9), dims = (h.dims ?? []) as { t: string; x1: number; y1: number; x2: number; y2: number }[];
  return <>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
    <div style={{ position: "absolute", left: 460, top: 180, width: 1000, height: 640, borderRadius: 10, overflow: "hidden", clipPath: `inset(0 ${(1 - d) * 100}% 0 0)` }}>
      {h.img && <Img src={img(h.img)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(1) contrast(2.2) brightness(1.4) ${ph < 1 ? "invert(1)" : ""}`, mixBlendMode: "screen", opacity: 0.55 + 0.45 * ph }} />}
      <div style={{ position: "absolute", inset: 0, background: "#1d4f86", mixBlendMode: "multiply", opacity: 1 - ph * 0.6 }} />
      <div style={{ position: "absolute", inset: 0, border: "3px solid rgba(255,255,255,.85)", borderRadius: 10 }} />
    </div>
    <div style={{ position: "absolute", left: 460 + 1000 * d - 3, top: 160, width: 6, height: 680, background: "#cfe8ff", boxShadow: "0 0 30px #cfe8ff", opacity: d < 1 ? 1 : 0 }} />
    {dims.map((m, i) => {
      const k = cl((tt - 2.2 - i * 0.4) / 0.5), x1 = 460 + m.x1 * 1000, y1 = 180 + m.y1 * 640, x2 = 460 + m.x2 * 1000, y2 = 180 + m.y2 * 640, len = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1);
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x1, top: y1, width: len * k, height: 3, background: "#fff", transformOrigin: "0 50%", transform: `rotate(${a}rad)` }} />
        <div style={{ position: "absolute", left: (x1 + x2) / 2, top: (y1 + y2) / 2 - 36, transform: "translate(-50%,-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 48, color: "#fff", opacity: k }}>{m.t}</div>
      </React.Fragment>;
    })}
    <Tag tt={tt} at={2.6} x={960} y={920} txt={h.lab ?? ""} col="#cfe8ff" size={46} />
  </>;
}}</Stage>;

// ---------- 10 · MÁQUINA DE ESCRIBIR: el papel sube y las teclas golpean la frase letra por letra ----------
export const HTypewriter: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const lines = (h.lines ?? [h.lab ?? ""]) as string[], all = lines.join("\n"), n = Math.floor(cl((tt - 0.6) / Math.max(1.4, all.length * 0.05)) * all.length);
  const typed = all.slice(0, n).split("\n"), bump = n > 0 && n < all.length ? Math.sin(tt * 40) * 2 : 0;
  return <>
    <div style={{ position: "absolute", left: 560, top: 140 - typed.length * 18, width: 800, height: 520, background: "linear-gradient(180deg,#fbf8f0,#ece6d6)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", padding: "70px 70px", fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 52, lineHeight: 1.35, color: "#1d1a16" }}>
      {typed.map((l, i) => <div key={i} style={{ whiteSpace: "pre", color: i === 0 && h.red ? "#9a1b12" : "#1d1a16" }}>{l}{i === typed.length - 1 && n < all.length ? <span style={{ opacity: Math.sin(tt * 10) > 0 ? 1 : 0.2 }}>_</span> : null}</div>)}
    </div>
    <div style={{ position: "absolute", left: 380, top: 620 + bump, width: 1160, height: 380, borderRadius: "60px 60px 30px 30px", background: "linear-gradient(180deg,#2f3a33,#1a211c)", boxShadow: "0 60px 120px rgba(0,0,0,.7), inset 0 3px 0 rgba(255,255,255,.12)" }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: -20, height: 44, borderRadius: 22, background: "linear-gradient(180deg,#d9d9d9,#7d7d7d)" }} />
      {Array.from({ length: 3 }, (_, r) => Array.from({ length: 11 - r }, (_, c) => {
        const hit = n > 0 && (n + c * 3 + r * 7) % 13 === 0;
        return <div key={r + "-" + c} style={{ position: "absolute", left: 140 + r * 40 + c * 84, top: 90 + r * 84 + (hit ? 6 : 0), width: 62, height: 62, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f3efe6, #b9b3a6)", boxShadow: hit ? "0 2px 4px rgba(0,0,0,.6)" : "0 8px 12px rgba(0,0,0,.6)" }} />;
      }))}
    </div>
  </>;
}}</Stage>;
