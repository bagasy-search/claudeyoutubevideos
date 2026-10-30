// kit2 (ole29e ronda 2): piezas compartidas — capa móvil, fondo desenfocado, tablones, fuego de partículas, esquirlas,
// etiqueta colgada, contador de rodillos, tiza, número con volumen y destello. Copiadas del kit de ole29d r3.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { AMB, FONT, HAND, MARK, TX, cl, eIn, eio, img, phys } from "./hkit";
export const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
export const W = 1920, HH = 1080;
// capa que se mueve entera (traslado, giro, escala) alrededor de un punto
export const Mv: React.FC<{ x?: number; y?: number; r?: number; s?: number; sx?: number; sy?: number; o?: number; ox?: number; oy?: number; f?: string; p?: string; children: React.ReactNode }> = ({ x = 0, y = 0, r = 0, s = 1, sx = 1, sy = 1, o = 1, ox = 960, oy = 540, f, p, children }) =>
  <div style={{ position: "absolute", left: 0, top: 0, width: W, height: HH, opacity: o, transformOrigin: `${ox}px ${oy}px`, transform: `${p ?? ""} translate(${x}px, ${y}px) rotate(${r}deg) scale(${s * sx}, ${s * sy})`, filter: f }}>{children}</div>;
// la foto del plano anterior, desenfocada: el componente sigue dentro de esa escena
export const BgB: React.FC<{ id: string; tt: number; dim?: number }> = ({ id, tt, dim = 0.5 }) => <AbsoluteFill style={{ overflow: "hidden" }}>
  <Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(18px) brightness(${1 - dim})`, transform: `scale(${1.16 - 0.03 * cl(tt / 10)})` }} />
  <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(0,0,0,0), rgba(0,0,0,.5))" }} />
</AbsoluteFill>;
// tablones de madera en perspectiva (mesa / mostrador) para que las cosas apoyen en algo real
export const Planks: React.FC<{ y?: number; tilt?: number; dark?: boolean }> = ({ y = 700, tilt = 62, dark }) => {
  const c = dark ? ["#2f1f12", "#3a2616", "#2a1b10", "#352314"] : ["#6b4a2c", "#76532f", "#5f4127", "#6e4c2b"];
  return <div style={{ position: "absolute", left: -500, top: y, width: 2920, height: 1300, transformOrigin: "50% 0", transform: `perspective(1100px) rotateX(${tilt}deg)`, background: `repeating-linear-gradient(90deg, rgba(0,0,0,.45) 0 5px, transparent 5px 292px), repeating-linear-gradient(91deg, rgba(255,230,190,.05) 0 2px, transparent 2px 23px), repeating-linear-gradient(90deg, ${c[0]} 0 73px, ${c[1]} 73px 146px, ${c[2]} 146px 219px, ${c[3]} 219px 292px)`, boxShadow: "inset 0 60px 90px rgba(0,0,0,.55)" }} />;
};
// tablones vistos desde arriba (pantalla entera)
export const WoodTop: React.FC<{ dark?: boolean }> = ({ dark }) => <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,.6)), repeating-linear-gradient(0deg, rgba(0,0,0,.5) 0 5px, transparent 5px 216px), repeating-linear-gradient(1deg, rgba(255,230,190,.04) 0 2px, transparent 2px 19px), repeating-linear-gradient(0deg, ${dark ? "#2e1e12 0 216px, #37241500 216px" : "#5e4026 0 216px, #6a4a2b00 216px"}), ${dark ? "#33221a" : "#694a2c"}` }} />;
// fuego de partículas: lenguas que suben y se apagan, cada una ≤1,4 Hz (sin parpadeo)
export const FireP: React.FC<{ tt: number; x: number; y: number; w: number; k?: number; blue?: boolean; n?: number }> = ({ tt, x, y, w, k = 1, blue, n = 22 }) => k <= 0.01 ? null : <div style={{ position: "absolute", left: x, top: y, mixBlendMode: "screen" }}>
  <div style={{ position: "absolute", left: -w * 0.6, top: -w * 0.22, width: w * 1.2, height: w * 0.44, borderRadius: "50%", background: blue ? "radial-gradient(ellipse, rgba(90,150,255,.5), transparent 70%)" : "radial-gradient(ellipse, rgba(255,140,40,.6), rgba(255,80,20,.2) 55%, transparent 72%)", filter: `blur(${w * 0.04}px)`, opacity: k }} />
  {Array.from({ length: n }, (_, i) => {
    const f = 0.8 + 0.6 * rnd(i, 3), ph = (tt * f + rnd(i, 7)) % 1, sz = w * (0.13 + 0.08 * rnd(i, 5)) * (1 - 0.65 * ph);
    const px = (rnd(i, 2) - 0.5) * w * 0.85 * (1 - 0.45 * ph) + Math.sin(tt * 1.3 + i) * w * 0.02, py = -ph * w * (0.35 + 0.35 * rnd(i, 4));
    return <div key={i} style={{ position: "absolute", left: px - sz / 2, top: py - sz, width: sz, height: sz * 1.6, borderRadius: "50% 50% 45% 45% / 70% 70% 30% 30%", background: blue ? "radial-gradient(circle at 50% 70%, #e8f4ff, #5d9bff 45%, rgba(40,80,255,0) 75%)" : `radial-gradient(circle at 50% 75%, #fff4c8, ${ph < 0.5 ? "#ffb040" : "#ff7a20"} 45%, rgba(220,50,10,0) 75%)`, filter: `blur(${w * 0.012}px)`, opacity: k * Math.sin(ph * Math.PI) * 0.95 }} />;
  })}
</div>;
// esquirlas que saltan (barro, migas, chispas) y caen con gravedad
export const Burst: React.FC<{ tt: number; at: number; x: number; y: number; n?: number; col: string; sp?: number; sz?: number; life?: number; up?: number }> = ({ tt, at, x, y, n = 12, col, sp = 420, sz = 12, life = 0.9, up = 1 }) => {
  const d = tt - at; if (d <= 0 || d > life) return null;
  return <>{Array.from({ length: n }, (_, i) => { const a = Math.PI * (0.1 + 0.8 * rnd(i, 11)), v = sp * (0.5 + 0.7 * rnd(i, 12)), s = sz * (0.5 + rnd(i, 13)); return <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * v * d * (rnd(i, 14) > 0.5 ? 1 : -1) - s / 2, top: y - Math.sin(a) * v * d * up + 1500 * d * d - s / 2, width: s, height: s * 0.8, borderRadius: "50%", background: col, opacity: 1 - d / life }} />; })}</>;
};
// sartén dibujada (hierro negro visto desde arriba) cuando no hace falta otra foto
export const CodePan: React.FC<{ x: number; y: number; r: number; hot?: number; sy?: number }> = ({ x, y, r, hot = 0, sy = 1 }) => <div style={{ position: "absolute", left: x, top: y, transform: `scaleY(${sy})` }}>
  <div style={{ position: "absolute", left: r * 0.86, top: -r * 0.11, width: r * 0.95, height: r * 0.22, borderRadius: r * 0.1, background: "linear-gradient(180deg,#2c2c2c,#0c0c0c)", boxShadow: "0 10px 20px rgba(0,0,0,.6)" }} />
  <div style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: "radial-gradient(circle at 42% 38%, #2e2e2e, #141414 55%, #080808)", boxShadow: `0 30px 60px rgba(0,0,0,.7), inset 0 0 0 ${r * 0.07}px #262626, inset 0 ${r * 0.04}px ${r * 0.06}px rgba(255,255,255,.12), 0 0 ${90 * hot}px ${20 * hot}px rgba(255,110,30,${0.35 * hot})` }} />
</div>;
// cubito de papa dibujado
export const Cube: React.FC<{ x: number; y: number; s?: number; r?: number; gold?: number }> = ({ x, y, s = 34, r = 0, gold = 0 }) => <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: s * 0.2, transform: `rotate(${r}deg)`, background: `linear-gradient(135deg, ${gold > 0.5 ? "#f6d27a" : "#fbf0c8"}, ${gold > 0.5 ? "#c98a2e" : "#e6cd88"})`, boxShadow: `inset -${s * 0.12}px -${s * 0.12}px 0 rgba(170,120,40,.5), inset ${s * 0.06}px ${s * 0.06}px 0 rgba(255,255,255,.4), 0 ${s * 0.12}px ${s * 0.18}px rgba(0,0,0,.45)` }} />;
// etiqueta de cartón colgada de un hilo que cae y se hamaca hasta quedar quieta
export const Tag2: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; sub?: string; w?: number; fs?: number }> = ({ tt, at, x, y, txt, sub, w = 300, fs = 110 }) => {
  const s = phys(tt, at, 7, 0.5); if (s <= 0.01) return null;
  const d = Math.max(0, tt - at), sw = 14 * Math.exp(-1.5 * d) * Math.sin(d * 5.2), hh = sub ? w * 0.62 : w * 0.5;
  return <div style={{ position: "absolute", left: x, top: y - 260 * (1 - s), transformOrigin: "50% 0", transform: `rotate(${sw}deg)`, opacity: cl(s * 3) }}>
    <div style={{ position: "absolute", left: -1.5, top: 0, width: 3, height: 90, background: "rgba(235,222,195,.9)" }} />
    <div style={{ position: "absolute", left: -w / 2, top: 86, width: w, height: hh, borderRadius: 12, background: "linear-gradient(170deg,#f1e2bf,#d6be8c)", boxShadow: "0 18px 34px rgba(0,0,0,.55), inset 0 -4px 0 rgba(120,90,40,.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: fs, color: "#3a2614", lineHeight: 1 }}>
      <div style={{ position: "absolute", left: w / 2 - 9, top: 10, width: 18, height: 18, borderRadius: "50%", background: "#2a1d10" }} />
      <div style={{ marginTop: 18 }}>{txt}</div>{sub && <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: fs * 0.42, marginTop: 4 }}>{sub}</div>}</div>
  </div>;
};
// contador de rodillos con valor dado (los dígitos giran y frenan)
export const OdoV: React.FC<{ v: number; x: number; y: number; op?: number; size?: number; dec?: number; pre?: string }> = ({ v, x, y, op = 1, size = 120, dec = 2, pre = "$" }) => {
  if (op <= 0.01) return null;
  const str = v.toFixed(dec), H2 = size * 1.15;
  return <div style={{ position: "absolute", left: x, top: y, opacity: op, transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * op})`, display: "flex", alignItems: "center", gap: 6, padding: "14px 22px", borderRadius: 18, background: "linear-gradient(180deg,#2a221a,#120e0a)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,220,160,.25), 0 0 0 4px #6a5032", fontFamily: FONT, fontWeight: 900, fontSize: size, color: "#f4e6c8" }}>
    {pre && <span style={{ color: AMB }}>{pre}</span>}
    {str.split("").map((ch, i) => {
      if (ch === ".") return <span key={i}>.</span>;
      const place = str.replace(".", "").length - 1 - str.slice(0, i).replace(".", "").length, f = (v * 10 ** dec) / 10 ** place, d = place === 0 ? f % 10 : (Math.floor(f) % 10) + Math.max(0, (f % 1) - 0.9) * 10;
      return <div key={i} style={{ width: size * 0.62, height: H2, overflow: "hidden", position: "relative", background: "linear-gradient(180deg,#0b0907,#2c241b 50%,#0b0907)", borderRadius: 8 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: -d * H2, lineHeight: `${H2}px`, textAlign: "center" }}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, j) => <div key={j}>{n}</div>)}</div>
      </div>;
    })}
  </div>;
};
// tiza que se escribe de izquierda a derecha; devuelve también dónde está la punta
export const chalkW = (txt: string, size: number) => txt.length * size * 0.56;
export const Chalk: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; size?: number; dur?: number; col?: string }> = ({ tt, at, x, y, txt, size = 140, dur = 0.9, col = "rgba(245,245,238,.94)" }) => {
  const p = eio(tt, at, at + dur); if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontFamily: MARK, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`, textShadow: "0 0 3px rgba(255,255,255,.5), 0 0 1px #fff", filter: "url(#chalk3)", letterSpacing: 2 }}>{txt}</div>;
};
export const Sv = () => <svg width={0} height={0} style={{ position: "absolute" }}><filter id="chalk3"><feTurbulence baseFrequency="0.9" numOctaves={2} seed={5} /><feDisplacementMap in="SourceGraphic" scale={4} /></filter></svg>;
// número grande con volumen que salta con peso y se va
export const Num3: React.FC<{ tt: number; at: number; out: number; x: number; y: number; n: string; col?: string; size?: number }> = ({ tt, at, out, x, y, n, col = TX, size = 230 }) => {
  const s = phys(tt, at, 8, 0.45) * (1 - eIn(tt, out, out + 0.3)); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * s}) translateY(${(1 - s) * 60}px)`, opacity: cl(s * 2), fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, WebkitTextStroke: `5px ${AMB}`, textShadow: "0 4px 0 #6a4416, 0 8px 0 #4a2e0c, 0 12px 0 #2e1c08, 0 26px 40px rgba(0,0,0,.7)" } as React.CSSProperties}>{n}</div>;
};
// destello cálido que hace "ding" sobre algo que acaba de llegar
export const Glint: React.FC<{ tt: number; at: number; x: number; y: number; r?: number }> = ({ tt, at, x, y, r = 120 }) => { const d = tt - at; if (d < 0 || d > 0.7) return null; const k = Math.sin((d / 0.7) * Math.PI); return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,246,210,.9), rgba(255,210,120,.35) 35%, transparent 70%)", opacity: k, transform: `scale(${0.6 + 0.6 * k})`, mixBlendMode: "screen" }} />; };

