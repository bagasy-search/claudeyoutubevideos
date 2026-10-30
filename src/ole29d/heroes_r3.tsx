// ole29d · RONDA 3 (última) de los 35 componentes únicos. Cada pieza cuenta la idea con el OBJETO haciendo la acción
// (sin carteles que expliquen): lo que se nombra se ilumina, todo llega con peso y sombra, nada queda quieto.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { AMB, Big, Bg, FONT, H, HAND, MARK, Pour, Spr, Stage, Steam, TX, cl, eIn, eio, img, phys, spr } from "./hkit";
import { rnd } from "./heroes_d1";

type C = React.FC<{ t: number; h: H }>;
const W = 1920, HH = 1080;
// capa que se mueve entera (traslado, giro, escala) alrededor de un punto
const Mv: React.FC<{ x?: number; y?: number; r?: number; s?: number; sx?: number; sy?: number; o?: number; ox?: number; oy?: number; f?: string; p?: string; children: React.ReactNode }> = ({ x = 0, y = 0, r = 0, s = 1, sx = 1, sy = 1, o = 1, ox = 960, oy = 540, f, p, children }) =>
  <div style={{ position: "absolute", left: 0, top: 0, width: W, height: HH, opacity: o, transformOrigin: `${ox}px ${oy}px`, transform: `${p ?? ""} translate(${x}px, ${y}px) rotate(${r}deg) scale(${s * sx}, ${s * sy})`, filter: f }}>{children}</div>;
// la foto del plano anterior, desenfocada: el componente sigue dentro de esa escena
const BgB: React.FC<{ id: string; tt: number; dim?: number }> = ({ id, tt, dim = 0.5 }) => <AbsoluteFill style={{ overflow: "hidden" }}>
  <Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(18px) brightness(${1 - dim})`, transform: `scale(${1.16 - 0.03 * cl(tt / 10)})` }} />
  <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(0,0,0,0), rgba(0,0,0,.5))" }} />
</AbsoluteFill>;
// tablones de madera en perspectiva (mesa / mostrador) para que las cosas apoyen en algo real
const Planks: React.FC<{ y?: number; tilt?: number; dark?: boolean }> = ({ y = 700, tilt = 62, dark }) => {
  const c = dark ? ["#2f1f12", "#3a2616", "#2a1b10", "#352314"] : ["#6b4a2c", "#76532f", "#5f4127", "#6e4c2b"];
  return <div style={{ position: "absolute", left: -500, top: y, width: 2920, height: 1300, transformOrigin: "50% 0", transform: `perspective(1100px) rotateX(${tilt}deg)`, background: `repeating-linear-gradient(90deg, rgba(0,0,0,.45) 0 5px, transparent 5px 292px), repeating-linear-gradient(91deg, rgba(255,230,190,.05) 0 2px, transparent 2px 23px), repeating-linear-gradient(90deg, ${c[0]} 0 73px, ${c[1]} 73px 146px, ${c[2]} 146px 219px, ${c[3]} 219px 292px)`, boxShadow: "inset 0 60px 90px rgba(0,0,0,.55)" }} />;
};
// tablones vistos desde arriba (pantalla entera)
const WoodTop: React.FC<{ dark?: boolean }> = ({ dark }) => <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,.6)), repeating-linear-gradient(0deg, rgba(0,0,0,.5) 0 5px, transparent 5px 216px), repeating-linear-gradient(1deg, rgba(255,230,190,.04) 0 2px, transparent 2px 19px), repeating-linear-gradient(0deg, ${dark ? "#2e1e12 0 216px, #37241500 216px" : "#5e4026 0 216px, #6a4a2b00 216px"}), ${dark ? "#33221a" : "#694a2c"}` }} />;
// fuego de partículas: lenguas que suben y se apagan, cada una ≤1,4 Hz (sin parpadeo)
const FireP: React.FC<{ tt: number; x: number; y: number; w: number; k?: number; blue?: boolean; n?: number }> = ({ tt, x, y, w, k = 1, blue, n = 22 }) => k <= 0.01 ? null : <div style={{ position: "absolute", left: x, top: y, mixBlendMode: "screen" }}>
  <div style={{ position: "absolute", left: -w * 0.6, top: -w * 0.22, width: w * 1.2, height: w * 0.44, borderRadius: "50%", background: blue ? "radial-gradient(ellipse, rgba(90,150,255,.5), transparent 70%)" : "radial-gradient(ellipse, rgba(255,140,40,.6), rgba(255,80,20,.2) 55%, transparent 72%)", filter: `blur(${w * 0.04}px)`, opacity: k }} />
  {Array.from({ length: n }, (_, i) => {
    const f = 0.8 + 0.6 * rnd(i, 3), ph = (tt * f + rnd(i, 7)) % 1, sz = w * (0.13 + 0.08 * rnd(i, 5)) * (1 - 0.65 * ph);
    const px = (rnd(i, 2) - 0.5) * w * 0.85 * (1 - 0.45 * ph) + Math.sin(tt * 1.3 + i) * w * 0.02, py = -ph * w * (0.35 + 0.35 * rnd(i, 4));
    return <div key={i} style={{ position: "absolute", left: px - sz / 2, top: py - sz, width: sz, height: sz * 1.6, borderRadius: "50% 50% 45% 45% / 70% 70% 30% 30%", background: blue ? "radial-gradient(circle at 50% 70%, #e8f4ff, #5d9bff 45%, rgba(40,80,255,0) 75%)" : `radial-gradient(circle at 50% 75%, #fff4c8, ${ph < 0.5 ? "#ffb040" : "#ff7a20"} 45%, rgba(220,50,10,0) 75%)`, filter: `blur(${w * 0.012}px)`, opacity: k * Math.sin(ph * Math.PI) * 0.95 }} />;
  })}
</div>;
// esquirlas que saltan (barro, migas, chispas) y caen con gravedad
const Burst: React.FC<{ tt: number; at: number; x: number; y: number; n?: number; col: string; sp?: number; sz?: number; life?: number; up?: number }> = ({ tt, at, x, y, n = 12, col, sp = 420, sz = 12, life = 0.9, up = 1 }) => {
  const d = tt - at; if (d <= 0 || d > life) return null;
  return <>{Array.from({ length: n }, (_, i) => { const a = Math.PI * (0.1 + 0.8 * rnd(i, 11)), v = sp * (0.5 + 0.7 * rnd(i, 12)), s = sz * (0.5 + rnd(i, 13)); return <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * v * d * (rnd(i, 14) > 0.5 ? 1 : -1) - s / 2, top: y - Math.sin(a) * v * d * up + 1500 * d * d - s / 2, width: s, height: s * 0.8, borderRadius: "50%", background: col, opacity: 1 - d / life }} />; })}</>;
};
// sartén dibujada (hierro negro visto desde arriba) cuando no hace falta otra foto
const CodePan: React.FC<{ x: number; y: number; r: number; hot?: number; sy?: number }> = ({ x, y, r, hot = 0, sy = 1 }) => <div style={{ position: "absolute", left: x, top: y, transform: `scaleY(${sy})` }}>
  <div style={{ position: "absolute", left: r * 0.86, top: -r * 0.11, width: r * 0.95, height: r * 0.22, borderRadius: r * 0.1, background: "linear-gradient(180deg,#2c2c2c,#0c0c0c)", boxShadow: "0 10px 20px rgba(0,0,0,.6)" }} />
  <div style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: "radial-gradient(circle at 42% 38%, #2e2e2e, #141414 55%, #080808)", boxShadow: `0 30px 60px rgba(0,0,0,.7), inset 0 0 0 ${r * 0.07}px #262626, inset 0 ${r * 0.04}px ${r * 0.06}px rgba(255,255,255,.12), 0 0 ${90 * hot}px ${20 * hot}px rgba(255,110,30,${0.35 * hot})` }} />
</div>;
// cubito de papa dibujado
const Cube: React.FC<{ x: number; y: number; s?: number; r?: number; gold?: number }> = ({ x, y, s = 34, r = 0, gold = 0 }) => <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: s * 0.2, transform: `rotate(${r}deg)`, background: `linear-gradient(135deg, ${gold > 0.5 ? "#f6d27a" : "#fbf0c8"}, ${gold > 0.5 ? "#c98a2e" : "#e6cd88"})`, boxShadow: `inset -${s * 0.12}px -${s * 0.12}px 0 rgba(170,120,40,.5), inset ${s * 0.06}px ${s * 0.06}px 0 rgba(255,255,255,.4), 0 ${s * 0.12}px ${s * 0.18}px rgba(0,0,0,.45)` }} />;
// etiqueta de cartón colgada de un hilo que cae y se hamaca hasta quedar quieta
const Tag2: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; sub?: string; w?: number; fs?: number }> = ({ tt, at, x, y, txt, sub, w = 300, fs = 110 }) => {
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
const OdoV: React.FC<{ v: number; x: number; y: number; op?: number; size?: number; dec?: number; pre?: string }> = ({ v, x, y, op = 1, size = 120, dec = 2, pre = "$" }) => {
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
const chalkW = (txt: string, size: number) => txt.length * size * 0.56;
const Chalk: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; size?: number; dur?: number; col?: string }> = ({ tt, at, x, y, txt, size = 140, dur = 0.9, col = "rgba(245,245,238,.94)" }) => {
  const p = eio(tt, at, at + dur); if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontFamily: MARK, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`, textShadow: "0 0 3px rgba(255,255,255,.5), 0 0 1px #fff", filter: "url(#chalk3)", letterSpacing: 2 }}>{txt}</div>;
};
const Sv = () => <svg width={0} height={0} style={{ position: "absolute" }}><filter id="chalk3"><feTurbulence baseFrequency="0.9" numOctaves={2} seed={5} /><feDisplacementMap in="SourceGraphic" scale={4} /></filter></svg>;
// número grande con volumen que salta con peso y se va
const Num3: React.FC<{ tt: number; at: number; out: number; x: number; y: number; n: string; col?: string; size?: number }> = ({ tt, at, out, x, y, n, col = TX, size = 230 }) => {
  const s = phys(tt, at, 8, 0.45) * (1 - eIn(tt, out, out + 0.3)); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * s}) translateY(${(1 - s) * 60}px)`, opacity: cl(s * 2), fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, WebkitTextStroke: `5px ${AMB}`, textShadow: "0 4px 0 #6a4416, 0 8px 0 #4a2e0c, 0 12px 0 #2e1c08, 0 26px 40px rgba(0,0,0,.7)" } as React.CSSProperties}>{n}</div>;
};
// destello cálido que hace "ding" sobre algo que acaba de llegar
const Glint: React.FC<{ tt: number; at: number; x: number; y: number; r?: number }> = ({ tt, at, x, y, r = 120 }) => { const d = tt - at; if (d < 0 || d > 0.7) return null; const k = Math.sin((d / 0.7) * Math.PI); return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,246,210,.9), rgba(255,210,120,.35) 35%, transparent 70%)", opacity: k, transform: `scale(${0.6 + 0.6 * k})`, mixBlendMode: "screen" }} />; };

// 1 · DESHIELO: el trineo se hunde inclinado en el barro real; el barro le cierra un labio por delante y deja los surcos
export const SMud: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const en = eio(tt, 0, 1.4), sink = eio(tt, 1.4, 5.2), sx = 1060 + 900 * (1 - en), sy = 600 + 170 * sink;
  const lip = (x: number) => { const d = (x - (sx - 40)) / 520, b = Math.exp(-d * d * d * d); return 1085 - (70 * en + 230 * sink) * b - 8 * Math.sin(x / 47 + tt * 0.6) * b; };
  const pts = Array.from({ length: 49 }, (_, i) => { const x = i * 40; return `${x}px ${lip(x).toFixed(1)}px`; }).join(", ");
  const pole = 2 + 8 * sink;
  return <>
    <Bg id="bg_barro" tt={tt} dim={0.12} />
    {/* surcos abiertos que deja detrás */}
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: sx + 240, top: 930 + i * 70 - 40 * sink, width: Math.max(0, 1920 - sx - 240), height: 26 + i * 8, borderRadius: 14, background: "linear-gradient(180deg, rgba(25,16,8,.85), rgba(70,50,30,.5))", boxShadow: "0 -3px 0 rgba(200,190,170,.25)", opacity: en }} />)}
    {/* tablón clavado en el camino con el nombre de la época; se va torciendo y hundiendo */}
    <div style={{ position: "absolute", left: 300, top: 480 + 60 * sink, transformOrigin: "50% 100%", transform: `rotate(${-pole}deg)`, opacity: eio(tt, 0.4, 1.0) }}>
      <div style={{ position: "absolute", left: -16, top: 0, width: 32, height: 520, background: "linear-gradient(90deg,#4a3018,#6a4626,#3e2814)", boxShadow: "6px 10px 20px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: -230, top: -40, width: 460, height: 130, borderRadius: 8, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.12) 0 3px, transparent 3px 21px), linear-gradient(180deg,#8a6038,#6a4626)", boxShadow: "0 16px 30px rgba(0,0,0,.55), inset 0 0 0 4px rgba(40,24,10,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MARK, fontSize: 62, color: "#241307", textShadow: "0 2px 0 rgba(255,210,150,.25)" }}>MUD SEASON</div>
    </div>
    <Mv x={sx - 1000} y={sy - 600} r={-3 * en - 7 * sink} ox={1000} oy={600}><Spr id="sp_sled" tt={tt} at={0} x={1000} y={600} w={880} from="none" shadow={0} /></Mv>
    {/* el barro de la misma foto por delante: tapa los patines a medida que se hunde */}
    <AbsoluteFill style={{ clipPath: `polygon(0px 1080px, ${pts}, 1920px 1080px)` }}><Bg id="bg_barro" tt={tt} dim={0.12} /></AbsoluteFill>
    <svg width={W} height={HH} style={{ position: "absolute", left: 0, top: 0 }}><path d={"M" + Array.from({ length: 49 }, (_, i) => `${i * 40} ${lip(i * 40).toFixed(1)}`).join(" L")} stroke="rgba(30,20,10,.75)" strokeWidth={7} fill="none" style={{ filter: "blur(2px)" }} /><path d={"M" + Array.from({ length: 49 }, (_, i) => `${i * 40} ${(lip(i * 40) + 6).toFixed(1)}`).join(" L")} stroke="rgba(220,215,200,.28)" strokeWidth={3} fill="none" /></svg>
    <Burst tt={tt} at={1.5} x={sx - 380} y={lip(sx - 380)} n={16} col="#3b2715" sp={520} sz={18} />
    <Burst tt={tt} at={2.6} x={sx + 300} y={lip(sx + 300)} n={12} col="#4a321c" sp={420} sz={14} />
    <Burst tt={tt} at={3.7} x={sx - 200} y={lip(sx - 200)} n={10} col="#2e1e10" sp={360} sz={12} />
  </>;
}}</Stage>;

// 2 · UNA SARTÉN, TRES OFICIOS: el fuego sube (estufa), la tapa baja con vapor (horno), se levanta con la comida (plato), cae el dólar
export const SJobs: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fire = eio(tt, 1.7, 2.5) * (1 - 0.45 * eio(tt, 4.6, 5.4)), lin = phys(tt, 2.75, 7, 0.55), lout = eio(tt, 3.95, 4.6), full = tt >= 4.15;
  const lidY = (1 - lin) * -720 - 640 * lout, seated = lin > 0.92 && lout < 0.05;
  const cs = phys(tt, 7.0, 9, 0.42), cy = 560 - 820 * (1 - cs), spin = Math.max(0, 1 - (tt - 7.0) / 0.9) * 26 * (tt - 7.0);
  return <>
    <Bg id="bg_estufa" tt={tt} dim={0.3} />
    <FireP tt={tt} x={960} y={700} w={980} k={fire} />
    <Spr id="sp_skillet_34" tt={tt} at={0.2} x={960} y={600} w={760} op={full ? 0 : 1} />
    {full && <Mv p="perspective(1600px) rotateX(52deg)" ox={960} oy={460}><Spr id="sp_skillet_full10" tt={tt} at={-5} x={960} y={430} w={720} from="none" shadow={0} /></Mv>}
    {lin > 0.01 && lout < 1 && <>
      <div style={{ position: "absolute", left: 960 - 330, top: 560, width: 660, height: 110, borderRadius: "50%", background: "rgba(0,0,0,.5)", filter: "blur(20px)", opacity: seated ? 1 : 0.4 * lin * (1 - lout) }} />
      <Mv y={lidY}><Spr id="sp_lid" tt={tt} at={-5} x={960} y={480} w={660} from="none" shadow={0} /></Mv>
    </>}
    {/* el vapor se escapa por los bordes de la tapa */}
    <Steam tt={tt} x={660} y={500} w={130} k={1.1 * eio(tt, 3.0, 3.4) * (1 - eio(tt, 3.9, 4.3))} />
    <Steam tt={tt + 1.3} x={1260} y={500} w={130} k={1.1 * eio(tt, 3.1, 3.5) * (1 - eio(tt, 3.9, 4.3))} />
    <Steam tt={tt} x={960} y={420} w={220} k={0.9 * eio(tt, 4.0, 4.6)} />
    {/* el dólar de plata cae girando y se clava en la comida */}
    {tt > 6.9 && <div style={{ position: "absolute", left: 960, top: cy, width: 0, height: 0 }}><Img src={spr("sp_r3_silver_dollar")} style={{ position: "absolute", left: -120, top: -120, width: 240, transform: `scaleX(${0.25 + 0.75 * Math.abs(Math.cos(spin))}) rotate(${8 * Math.sin(spin)}deg)`, filter: "drop-shadow(0 20px 24px rgba(0,0,0,.6))" }} /></div>}
    <Glint tt={tt} at={7.45} x={960} y={560} r={180} />
    <Burst tt={tt} at={7.45} x={960} y={600} n={10} col="#ffe7a8" sp={380} sz={8} life={0.6} />
  </>;
}}</Stage>;

// 3 · 7 × 3 = 21: los platos caen columna por columna (cada columna un día tallado en el tablón) y se estampa el 21 de latón
export const SGrid: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const glow = eio(tt, 8.5, 9.1), plq = phys(tt, 8.8, 8, 0.4), hit = tt > 8.95 ? Math.exp(-7 * (tt - 8.95)) * Math.sin((tt - 8.95) * 40) : 0;
  return <>
    <Bg id="bg_mesa_top" tt={tt} dim={0.12} />
    {Array.from({ length: 7 }, (_, c) => <div key={c} style={{ position: "absolute", left: 270 + c * 230, top: 190, transform: "translate(-50%,-50%)", fontFamily: MARK, fontSize: 76, color: "rgba(38,22,10,.88)", textShadow: "0 2px 0 rgba(255,220,170,.35), 0 -2px 2px rgba(0,0,0,.6)", opacity: eio(tt, 0.5 + c * 0.96, 0.9 + c * 0.96) }}>{c + 1}</div>)}
    <Mv y={6 * hit} f={`brightness(${1 + 0.3 * glow})`}>
      {Array.from({ length: 21 }, (_, i) => { const c = Math.floor(i / 3), r = i % 3; return <Spr key={i} id="sp_tinplate" tt={tt} at={0.8 + i * 0.32} x={270 + c * 230} y={390 + r * 235} w={188} />; })}
    </Mv>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(255,200,120,.16), transparent 70%)", opacity: glow, mixBlendMode: "screen" }} />
    {plq > 0.01 && <div style={{ position: "absolute", left: 960, top: 600, transform: `translate(-50%,-50%) translateY(${(1 - plq) * -700}px) rotate(${-3 + 3 * plq}deg)`, width: 440, height: 300, borderRadius: 26, background: "linear-gradient(160deg,#f3d58a,#c79a3e 45%,#8a6420)", boxShadow: "0 40px 70px rgba(0,0,0,.65), inset 0 3px 0 rgba(255,250,220,.7), inset 0 -6px 0 rgba(90,60,10,.5), 0 0 0 6px #5a3e12", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 240, color: "#5a3a0e", textShadow: "0 -3px 2px rgba(60,35,5,.7), 0 3px 2px rgba(255,240,200,.6)" }}>21
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <div key={i} style={{ position: "absolute", left: 220 + a * 190 - 11, top: 150 + b * 120 - 11, width: 22, height: 22, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fff2c0, #6a4a14)" }} />)}
    </div>}
  </>;
}}</Stage>;

// 4 · EL SOBRE DEL DÍA 6: cae una gota de cera, el sello la aplasta y sube con vapor: queda el 6 en relieve brillando
export const SSeal: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const drop = eio(tt, 1.3, 1.75), dn = eio(tt, 2.2, 2.9) * (1 - eio(tt, 3.2, 3.9)), pressed = tt > 2.88, spread = phys(tt, 2.88, 10, 0.5);
  const ws = tt < 1.75 ? 0 : pressed ? 0.5 + 0.5 * spread : 0.42 + 0.06 * phys(tt, 1.75, 9, 0.4), push = eio(tt, 4.0, 9.8);
  const lx = 960 - 50 + 60 * Math.sin(tt * 0.5);
  return <>
    <BgB id="n_dia_seis" tt={tt} dim={0.55} />
    <Mv s={1 + 0.2 * push} ox={960} oy={540}>
      <Spr id="sp_envelope" tt={tt} at={0.4} x={960} y={600} w={1000} />
      {/* sombra del sello que se acerca */}
      <div style={{ position: "absolute", left: 960 - 150, top: 540 - 40, width: 300, height: 80, borderRadius: "50%", background: "rgba(0,0,0,.55)", filter: "blur(14px)", opacity: 0.7 * dn, transform: `scale(${1.5 - 0.5 * dn})` }} />
      {drop > 0 && drop < 1 && <div style={{ position: "absolute", left: 960 - 22, top: 120 + 400 * drop * drop, width: 44, height: 56, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: "radial-gradient(circle at 38% 30%, #ff9a8a, #b8261c 50%, #6a0c08)" }} />}
      {ws > 0 && <div style={{ position: "absolute", left: 960, top: 540, width: 0, height: 0 }}>
        <Img src={spr("sp_r3_wax_drop")} style={{ position: "absolute", left: -170 * ws, top: -170 * ws, width: 340 * ws, filter: "drop-shadow(0 8px 12px rgba(0,0,0,.5)) saturate(1.2)" }} />
        {tt > 3.3 && <div style={{ position: "absolute", left: -105, top: -105, width: 210, height: 210, borderRadius: "50%", boxShadow: "inset 0 6px 10px rgba(0,0,0,.55), inset 0 -4px 8px rgba(255,150,130,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 170, color: "#8a1a12", textShadow: "0 -3px 3px rgba(0,0,0,.65), 0 3px 3px rgba(255,160,140,.5)", opacity: eio(tt, 3.3, 3.7) }}>6</div>}
        {/* reflejo de la lámpara que pasa por la cera */}
        {tt > 3.3 && <div style={{ position: "absolute", left: lx - 960 - 70, top: -90, width: 140, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,240,220,.7), transparent 70%)", mixBlendMode: "screen" }} />}
      </div>}
      <Steam tt={tt} x={960} y={470} w={110} k={eio(tt, 3.2, 3.6) * (1 - eio(tt, 4.6, 6.0))} />
      <Mv y={-1000 * (1 - dn) - 40 * (1 - eio(tt, 0.8, 2.2))}><Spr id="sp_wax_stamp" tt={tt} at={-5} x={960} y={380} w={200} from="none" shadow={0} /></Mv>
    </Mv>
  </>;
}}</Stage>;

// 5 · CÓMO CUENTO: la caja entra con peso, los víveres caen al mostrador y el ticket sale colgando con el total estampado
export const SReceipt: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const L = [["OATS", ".20", 5.1], ["RICE", ".15", 5.9], ["MILK", ".10", 6.4]] as const, rise = eio(tt, 5.0, 8.9), FULL = 470, cur = 50 + (FULL - 50) * rise;
  const sw = 2.5 * Math.sin(tt * 1.5) * rise, tot = phys(tt, 8.4, 9, 0.4);
  return <>
    <Bg id="bg_mostrador" tt={tt} dim={0.28} />
    <Spr id="sp_oats_jar" tt={tt} at={1.0} x={1500} y={760} w={270} />
    <Spr id="sp_rice_cup" tt={tt} at={1.7} x={1750} y={790} w={240} />
    <Glint tt={tt} at={1.3} x={1500} y={700} r={90} />
    <Glint tt={tt} at={2.0} x={1750} y={740} r={80} />
    <Spr id="sp_register" tt={tt} at={0.2} x={640} y={700} w={620} from="up" />
    {/* el ticket sale por el costado y cuelga hacia abajo: el primer renglón impreso va adelante */}
    <div style={{ position: "absolute", left: 930, top: 500, width: 420, height: cur, transformOrigin: "50% 0", transform: `rotate(${sw}deg)`, overflow: "hidden", background: "linear-gradient(90deg,#ebe4d2,#fbf8ef 50%,#e4dcc8)", boxShadow: "0 22px 36px rgba(0,0,0,.5)", clipPath: "polygon(0 0,100% 0,100% 100%,92% 98.5%,84% 100%,76% 98.5%,68% 100%,60% 98.5%,52% 100%,44% 98.5%,36% 100%,28% 98.5%,20% 100%,12% 98.5%,4% 100%,0 98.5%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: cur - FULL, height: FULL, padding: "30px 28px", boxSizing: "border-box", fontFamily: "Courier New, monospace", fontWeight: 700, color: "#2a2620" }}>
        {L.map(([a, b, at], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 60, marginBottom: 30, opacity: cl((tt - at) * 4) }}><span>{a}</span><span>{b}</span></div>)}
        <div style={{ borderTop: "4px dashed #2a2620", paddingTop: 20, display: "flex", justifyContent: "space-between", fontSize: 76, fontWeight: 900, opacity: cl(tot * 3), transform: `scale(${1.5 - 0.5 * tot})`, transformOrigin: "50% 50%", color: "#7a1a10" }}><span>TOTAL</span><span>.45</span></div>
      </div>
    </div>
  </>;
}}</Stage>;

// 6 · LOS PRECIOS: cada ingrediente cae a la tabla con su etiqueta colgada; el que se nombra se ilumina
export const SFlap: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const IT = [["sp_eggs3", 0.3, 330, "28¢", "each"], ["sp_potato", 4.2, 760, "40¢", ""], ["sp_onion", 6.6, 1170, "30¢", ""], ["sp_cornmeal_cup", 8.9, 1580, "15¢", ""]] as const;
  const act = IT.reduce((a, it, i) => (tt >= it[1] ? i : a), 0);
  return <>
    <BgB id="n_huevos_carton" tt={tt} dim={0.6} />
    <Planks y={660} />
    {IT.map(([id, at, x, p, sub], i) => { const on = i === act ? 1 : 0, k = eio(tt, at, at + 0.4); return <Mv key={id} s={1 + 0.07 * on * k} ox={x} oy={760} f={`brightness(${0.62 + 0.38 * (on ? 1 : 0.15) + 0.0 * k})`}>
      <Spr id={id} tt={tt} at={at} x={x} y={770} w={i === 0 ? 420 : 370} />
      <Tag2 tt={tt} at={at + 0.35} x={x} y={90} txt={p} sub={sub || undefined} />
    </Mv>; })}
  </>;
}}</Stage>;

// 7 · POR QUÉ HIERRO: la gota de aceite corre por los poros y los rellena; la sartén pasa de gris mate a negro brillante
export const SMicro: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 65% at 50% 50%, #2a2219, #070605 75%)">{(tt) => {
  const g = eio(tt, 3.0, 7.6), sweep = -25 + 150 * eio(tt, 6.6, 8.6), R = 190;
  const lx = 900 + 180 * Math.sin(tt * 0.32), ly = 520 + 60 * Math.sin(tt * 0.45 + 1), dx = -60 + 520 * eio(tt, 2.8, 7.4);
  return <>
    <Spr id="sp_iron_macro" tt={tt} at={0.1} x={960} y={560} w={820} from="none" style={{ filter: `grayscale(${0.75 * (1 - g)}) brightness(${1.3 - 0.55 * g}) contrast(${0.82 + 0.5 * g}) drop-shadow(0 18px 22px rgba(0,0,0,.45))` }} />
    {/* brillo que barre la sartén ya curada (enmascarado con la forma de la sartén) */}
    <div style={{ position: "absolute", left: 960 - 410, top: 560 - 410, width: 820, height: 820, WebkitMaskImage: `url(${spr("sp_iron_macro")})`, maskImage: `url(${spr("sp_iron_macro")})`, WebkitMaskSize: "100% auto", maskSize: "100% auto", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", background: `linear-gradient(115deg, transparent ${sweep - 12}%, rgba(255,255,255,.42) ${sweep}%, transparent ${sweep + 12}%)`, mixBlendMode: "screen" } as React.CSSProperties} />
    <div style={{ position: "absolute", left: lx - R, top: ly - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 14px #8a6a32, 0 0 0 20px #4a3416, 0 40px 80px rgba(0,0,0,.7)" }}>
      <Img src={img("iron_macro_full")} style={{ position: "absolute", left: -(lx - R) * 2.4 - 400, top: -(ly - R) * 2.4 - 300, width: 1920 * 2.4, height: 1080 * 2.4, objectFit: "cover", filter: `grayscale(${0.6 * (1 - g)}) brightness(${1.1 - 0.35 * g}) contrast(1.15)` }} />
      {/* poros: huecos oscuros que la gota rellena al pasar (queda una película plana con reflejo, no bolitas) */}
      {Array.from({ length: 13 }, (_, i) => { const x = 30 + rnd(i, 4) * 320, y = 40 + rnd(i, 5) * 300, rx = 26 + rnd(i, 6) * 26, f = cl((dx - x) / 70); return <div key={i} style={{ position: "absolute", left: x - rx, top: y - rx * 0.6, width: 2 * rx, height: 1.2 * rx, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%, #040404, #141414 75%)", boxShadow: "inset 0 5px 8px rgba(0,0,0,.95)" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(170deg, rgba(120,80,20,.95), rgba(40,24,6,.95))", opacity: f }} />
        <div style={{ position: "absolute", left: "18%", top: "16%", width: "55%", height: "22%", borderRadius: "50%", borderTop: "3px solid rgba(255,240,200,.85)", opacity: f }} />
      </div>; })}
      {/* película de aceite detrás de la gota */}
      <div style={{ position: "absolute", left: 0, top: 0, width: Math.max(0, dx), height: 2 * R, background: "linear-gradient(90deg, rgba(150,100,30,.18), rgba(200,140,50,.28))" }} />
      <div style={{ position: "absolute", left: dx - 46, top: 160 + 20 * Math.sin(dx / 60), width: 92, height: 64, borderRadius: "55% 45% 50% 50%", background: "radial-gradient(ellipse at 38% 30%, rgba(255,246,210,.98), rgba(225,165,55,.92) 40%, rgba(130,80,15,.9))", boxShadow: "0 0 14px rgba(255,200,90,.6)", opacity: cl((dx + 40) / 60) * (1 - eio(tt, 7.4, 7.8)) }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(ellipse 50% 30% at 32% 22%, rgba(255,255,255,.28), transparent 70%)" }} />
    </div>
    <div style={{ position: "absolute", left: lx + R * 0.68, top: ly + R * 0.68, width: 60, height: 230, borderRadius: 28, background: "linear-gradient(90deg,#5a3a1c,#8a5c2e,#4a2c12)", transform: "rotate(-45deg)", transformOrigin: "50% 0", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
  </>;
}}</Stage>;

// 8 · CADENA DE COMIDAS: una soga gruesa cruza; cada plato entra colgado por la derecha, la soga se tensa, y la avena frita pasa al frente
export const SChain: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const P = ["sp_r3_dish_oat", "sp_food_pancake", "sp_food_hash", "sp_egg_fried"], SL = [330, 750, 1170, 1590], EN = [0.5, 1.7, 2.9, 4.1];
  const px = P.map((_, i) => SL[i] + (2400 - SL[i]) * (1 - phys(tt, EN[i], 5.5, 0.55))), dep = P.map((_, i) => tt < EN[i] ? 0 : 34 + 46 * phys(tt, EN[i] + 0.5, 8, 0.3));
  const ry = (x: number) => 290 + 26 + px.reduce((a, p, i) => a + dep[i] * Math.exp(-(((x - p) / 170) ** 2)), 0);
  const path = "M" + Array.from({ length: 51 }, (_, i) => `${-40 + i * 40} ${ry(-40 + i * 40).toFixed(1)}`).join(" L");
  const foc = eio(tt, 7.4, 8.4);
  return <>
    <BgB id="n_sobras_bowl" tt={tt} />
    <Mv x={(960 - 330) * foc} y={-60 * foc} s={1 + 0.42 * foc} ox={330} oy={560}>
      <svg width={W} height={HH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={path} stroke="rgba(0,0,0,.45)" strokeWidth={24} fill="none" transform="translate(6 14)" style={{ filter: "blur(6px)" }} />
        <path d={path} stroke="#a57d4a" strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d={path} stroke="rgba(70,45,20,.6)" strokeWidth={22} fill="none" strokeDasharray="6 10" />
        <path d={path} stroke="rgba(255,232,190,.3)" strokeWidth={4} fill="none" transform="translate(0 -6)" />
      </svg>
      {P.map((id, i) => { const x = px[i], d = tt - EN[i] - 1.0, sw = tt < EN[i] + 1.0 ? -14 * (1 - phys(tt, EN[i], 5.5, 0.55)) : 9 * Math.exp(-1.8 * d) * Math.sin(5 * d), y0 = ry(x), dimk = i === 0 ? 1 : 1 - 0.45 * foc; return <Mv key={id} r={sw} ox={x} oy={y0} f={`brightness(${dimk})`}>
        {[-70, 70].map((o) => <div key={o} style={{ position: "absolute", left: x + o - 2, top: y0, width: 4, height: 120, background: "rgba(200,170,120,.85)" }} />)}
        <Spr id={id} tt={tt} at={-5} x={x} y={y0 + 270} w={i === 0 ? 360 : 330} from="none" shadow={0} />
      </Mv>; })}
    </Mv>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 35% 45% at 50% 55%, transparent, rgba(0,0,0,.55))", opacity: foc }} />
  </>;
}}</Stage>;

// 9 · PAPA EN CUBOS: la grasa se derrite en la sartén, el cuchillo pica la papa en cubitos y los cubitos saltan adentro
export const SCubes: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const K = [4.6, 5.3, 6.0, 6.7, 7.4, 8.1, 8.8, 9.5, 10.1], nd = K.filter((k) => tt > k + 0.18).length, cutF = nd / K.length;
  const kb = K.reduce((a, k) => Math.max(a, Math.sin(cl((tt - k) / 0.36) * Math.PI)), 0), kx = 760 - 400 * (nd / K.length), kin = eio(tt, 4.0, 4.5) * (1 - eio(tt, 10.4, 10.9));
  const melt = eio(tt, 2.9, 5.2), sp = eio(tt, 1.5, 2.1) * (1 - eio(tt, 3.1, 3.7)), tip = eio(tt, 2.3, 2.6);
  const N = 54, PX = 1380, PY = 620;
  return <>
    <BgB id="f_corta_papa" tt={tt} dim={0.6} />
    <Spr id="sp_r3_board" tt={tt} at={0.3} x={560} y={720} w={780} />
    <Spr id="sp_skillet_big" tt={tt} at={0.6} x={PX} y={PY} w={780} />
    {/* la cucharada de grasa blanca se derrite en un charco que brilla */}
    <div style={{ position: "absolute", left: PX - 190 * melt, top: PY - 30 - 120 * melt, width: 380 * melt, height: 240 * melt, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, rgba(255,240,190,.55), rgba(220,160,60,.35) 55%, transparent 75%)", opacity: 0.9 }} />
    {tt > 2.6 && <div style={{ position: "absolute", left: PX - 45, top: PY - 90 + (tt < 2.9 ? -260 * (1 - eio(tt, 2.6, 2.9)) : 0), width: 90 * (1 - 0.8 * melt), height: 70 * (1 - 0.8 * melt), borderRadius: "45%", background: "radial-gradient(circle at 40% 35%, #ffffff, #ece6d8)", boxShadow: "0 6px 10px rgba(0,0,0,.3)", transform: `translate(${45 * 0.8 * melt}px, ${35 * 0.8 * melt}px)` }} />}
    <Mv y={-420 * (1 - eio(tt, 1.5, 2.1)) - 420 * eio(tt, 3.1, 3.7)} o={sp > 0.01 || tt < 3.7 ? 1 : 0}><Spr id="sp_r3_lard_spoon" tt={tt} at={-5} x={PX - 60} y={PY - 260} w={300} from="none" shadow={0} rot={-30 * tip} /></Mv>
    {/* la papa entera; el cuchillo la va comiendo de derecha a izquierda */}
    <Spr id="sp_r3_potato_raw" tt={tt} at={3.4} x={560} y={660} w={420} op={cutF >= 1 ? 0 : 1} style={{ clipPath: `inset(0 ${cutF * 100}% 0 0)` }} />
    {Array.from({ length: N }, (_, j) => {
      const born = K[Math.min(K.length - 1, Math.floor(j / 6))] + 0.18; if (tt < born) return null;
      const bx = 760 - (j / N) * 400 + (rnd(j, 1) - 0.5) * 50, by = 660 + (rnd(j, 2) - 0.5) * 120, pop = phys(tt, born, 9, 0.5);
      const p = eio(tt, 11.1 + j * 0.012, 11.75 + j * 0.012), tx = PX + (rnd(j, 5) - 0.5) * 430, ty = PY + (rnd(j, 6) - 0.5) * 300;
      const x = bx + (tx - bx) * p, y = by + (ty - by) * p - 280 * Math.sin(p * Math.PI) - 18 * (1 - pop), jig = p >= 1 ? 2 * Math.sin(tt * 9 + j) : 0;
      return <Cube key={j} x={x + jig} y={y} s={34} r={rnd(j, 3) * 90 + 300 * p} gold={p >= 1 ? eio(tt, 12.0 + rnd(j) * 0.6, 12.6) : 0} />;
    })}
    {kin > 0.01 && <Mv x={kx - 880} y={-560 * (1 - kin) + 150 * kb}><Spr id="sp_knife" tt={tt} at={-5} x={880} y={420} w={260} from="none" shadow={0} rot={8} /></Mv>}
    {[11.75, 11.95, 12.15].map((a, i) => <Burst key={i} tt={tt} at={a} x={PX + (i - 1) * 140} y={PY} n={8} col="#ffd27a" sp={280} sz={6} life={0.5} />)}
    <Steam tt={tt} x={PX} y={PY - 160} w={170} k={0.6 * eio(tt, 3, 5)} />
  </>;
}}</Stage>;

// 10 · REMOJO: un poroto seco de muestra se hincha al doble (queda el contorno de cómo era) mientras el bol crece
export const SSwell: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const g = eio(tt, 5.6, 8.4);
  return <>
    <BgB id="f_porotos_domingo" tt={tt} />
    <Planks y={720} />
    <Spr id="sp_beans_dry" tt={tt} at={1.9} x={500} y={760} w={400} />
    <Spr id="sp_r3_bean_dry" tt={tt} at={3.0} x={960} y={430} w={150} op={1 - g} />
    {g > 0 && <div style={{ position: "absolute", left: 960, top: 430, width: 0, height: 0 }}><Img src={spr("sp_r3_bean_soaked")} style={{ position: "absolute", left: -75 * (1 + g), top: -60 * (1 + g), width: 150 * (1 + g), opacity: cl(g * 3), filter: "drop-shadow(0 16px 20px rgba(0,0,0,.5))" }} /></div>}
    <div style={{ position: "absolute", left: 960 - 78, top: 430 - 50, width: 156, height: 100, borderRadius: "50%", border: "4px dashed rgba(255,240,205,.9)", opacity: g }} />
    <Big tt={tt} at={8.4} x={1240} y={430} txt="×2" size={170} col={AMB} />
    <Mv s={1 + 0.3 * g} ox={1420} oy={860}><Spr id="sp_beans_soaked" tt={tt} at={5.9} x={1420} y={760} w={400} /></Mv>
  </>;
}}</Stage>;

// 11 · LA MANO SOBRE LA SARTÉN: el brazo entra entero, la palma flota sobre el hierro y cuenta 1, 2, 3 hasta que se aparta
export const SPalm: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 60%, #2a1a10, #070605 75%)">{(tt) => {
  const hd = phys(tt, 3.4, 4.5, 0.65), heat = eio(tt, 0.4, 3), back = eio(tt, 8.0, 8.45), warm = eio(tt, 5.0, 7.8);
  return <>
    <div style={{ position: "absolute", left: 820 - 600, top: 700 - 200, width: 1200, height: 420, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,120,40,.32), transparent 68%)", filter: "blur(30px)", opacity: heat }} />
    <Spr id="sp_skillet_drops" tt={tt} at={0.3} x={820} y={650} w={860} />
    {/* aire caliente que ondula sobre el hierro */}
    <svg width={W} height={HH} style={{ position: "absolute", left: 0, top: 0, opacity: heat }}>{Array.from({ length: 7 }, (_, i) => { const x0 = 560 + i * 90, rise = (tt * 46 + i * 37) % 160; return <path key={i} d={`M${x0} ${560 - rise} q 14 -30 0 -60 q -14 -30 0 -60 q 14 -30 0 -60`} stroke="rgba(255,225,190,.16)" strokeWidth={5} fill="none" transform={`translate(${6 * Math.sin(tt * 1.2 + i)} 0)`} style={{ filter: "blur(1.5px)" }} />; })}</svg>
    <Mv x={1150 * (1 - hd) + 180 * back} y={-70 * back}><Spr id="sp_r3_forearm" tt={tt} at={-5} x={1330} y={330} w={1150} from="none" shadow={0} style={{ filter: `drop-shadow(0 40px 40px rgba(0,0,0,.5)) drop-shadow(0 26px 46px rgba(255,120,40,${0.75 * warm}))` }} /></Mv>
    <Num3 tt={tt} at={5.2} out={6.1} x={820} y={150} n="1" />
    <Num3 tt={tt} at={6.2} out={7.1} x={820} y={150} n="2" />
    <Num3 tt={tt} at={7.2} out={9.6} x={820} y={150} n="3" col="#ffd27a" />
  </>;
}}</Stage>;

// 12 · FRÍA O CALIENTE: dos sartenes inclinadas sobre la mesa oscura; en la fría el huevo se agarra y se estira, en la caliente resbala
export const SSlide: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const tilt = eio(tt, 3.0, 4.4), sl = eio(tt, 3.6, 6.2), stretch = eio(tt, 3.5, 5.2), push = eio(tt, 8.0, 12.4);
  return <>
    <WoodTop dark />
    <Mv s={1 + 0.14 * push} ox={1400} oy={620}>
      <Mv p={`perspective(1500px) rotateX(${26 * tilt}deg)`} r={-16 * tilt} ox={520} oy={620}>
        <Spr id="sp_skillet_tilt" tt={tt} at={0.3} x={520} y={620} w={640} />
        <Mv sy={1 + 0.32 * stretch} ox={520} oy={520}><Spr id="sp_egg_stuck" tt={tt} at={1.2} x={520} y={580} w={290} /></Mv>
        {/* escarcha: puntitos azules que brillan lento en el borde de la fría */}
        {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <div key={i} style={{ position: "absolute", left: 520 + Math.cos(a) * 250 - 6, top: 620 + Math.sin(a) * 250 - 6, width: 12, height: 12, borderRadius: "50%", background: "#cfe6ff", boxShadow: "0 0 14px 4px rgba(150,200,255,.7)", opacity: eio(tt, 1.2, 2.0) * (0.45 + 0.4 * Math.sin(tt * 1.6 + i)) }} />; })}
      </Mv>
      <Mv p={`perspective(1500px) rotateX(${26 * tilt}deg)`} r={16 * tilt} ox={1400} oy={620}>
        <div style={{ position: "absolute", left: 1400 - 380, top: 620 - 160, width: 760, height: 520, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,120,40,.35), transparent 65%)", filter: "blur(20px)", opacity: eio(tt, 1, 2.5) }} />
        <Spr id="sp_skillet_tilt" tt={tt} at={0.6} x={1400} y={620} w={640} flip />
        <div style={{ position: "absolute", left: 1400 - 50, top: 520, width: 100, height: 200 * sl, borderRadius: 50, background: "linear-gradient(180deg, rgba(255,220,140,.05), rgba(255,215,130,.45))", opacity: 0.8 }} />
        <Spr id="sp_egg_fried" tt={tt} at={1.5} x={1400} y={540 + 200 * sl} w={270} rot={24 * sl} />
      </Mv>
      <Steam tt={tt} x={1400} y={440} w={150} k={0.8 * eio(tt, 1, 2.5)} />
    </Mv>
  </>;
}}</Stage>;

// 13 · SEIS PANQUEQUES: saltan de la sartén dando vuelta, caen en dos pilas, y el repasador tapa la pila de guardar
export const SFlip: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const towel = phys(tt, 10.3, 7, 0.55), PAN = [600, 700];
  return <>
    <WoodTop />
    <Mv sy={0.5} ox={1250} oy={840}><Spr id="sp_plate_white" tt={tt} at={0.6} x={1250} y={840} w={380} shadow={0} /></Mv>
    <Mv sy={0.5} ox={1610} oy={840}><Spr id="sp_plate_white" tt={tt} at={0.9} x={1610} y={840} w={380} shadow={0} /></Mv>
    <Spr id="sp_skillet_side" tt={tt} at={0.3} x={PAN[0]} y={PAN[1] + 70} w={780} />
    {Array.from({ length: 6 }, (_, i) => {
      const a = 2.2 + i * 1.05, p = eio(tt, a, a + 0.9); if (tt < a - 0.6) return null;
      const tx = i < 3 ? 1250 : 1610, ty = 810 - (i % 3) * 30, x = PAN[0] + (tx - PAN[0]) * p, y = PAN[1] + (ty - PAN[1]) * p - 430 * Math.sin(p * Math.PI);
      const c = Math.cos(2 * Math.PI * p), d = Math.max(0, tt - a - 0.9), sq = p >= 1 ? 0.12 * Math.exp(-8 * d) * Math.sin(d * 30) : 0;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}><Img src={spr("sp_pancake")} style={{ position: "absolute", left: -150 * (1 + sq), top: -150, width: 300 * (1 + sq), transform: `scaleY(${0.05 + 0.33 * Math.abs(c)})`, filter: `${c < 0 ? "brightness(1.3) saturate(.55)" : ""} drop-shadow(0 10px 10px rgba(0,0,0,.45))` }} /></div>;
    })}
    {towel > 0.01 && <Mv y={-560 * (1 - towel)} o={cl(towel * 3)}><Spr id="sp_towel" tt={tt} at={-5} x={1610} y={760} w={480} from="none" /></Mv>}
  </>;
}}</Stage>;

// 14 · EL COCINERO DEL FERROCARRIL: la foto del tren con nieve a tres profundidades; caen las cartas de a una y sube el arroz frío
const CARDS = [["A", "♠", "#1a1a1a"], ["K", "♥", "#b8221a"], ["7", "♣", "#1a1a1a"], ["Q", "♦", "#b8221a"], ["3", "♠", "#1a1a1a"]] as const;
export const SRail: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fr = phys(tt, 3.3, 6, 0.55);
  return <>
    <AbsoluteFill style={{ overflow: "hidden" }}><Img src={img("n_tren_campamento")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(1.16) translateX(${-16 * tt}px)`, filter: "brightness(.62)" }} /></AbsoluteFill>
    {/* nieve a tres profundidades: cuanto más cerca, más grande, borrosa y rápida */}
    {[[40, 4, 0.6, 30], [24, 10, 1.4, 70], [12, 26, 2.6, 130]].map(([n, sz, bl, sp], L) => Array.from({ length: n }, (_, i) => { const x = ((rnd(i, L + 20) * 2200 - tt * sp * 0.6) % 2200 + 2200) % 2200 - 140, y = ((rnd(i, L + 30) * 1200 + tt * sp) % 1200) - 60; return <div key={`${L}-${i}`} style={{ position: "absolute", left: x + 14 * Math.sin(tt * 0.8 + i), top: y, width: sz, height: sz, borderRadius: "50%", background: "rgba(255,255,255,.85)", filter: `blur(${bl}px)`, opacity: 0.7 }} />; }))}
    {CARDS.map(([r, s, c], i) => { const at = 1.4 + i * 0.35, p = phys(tt, at, 7, 0.5); if (p <= 0.01) return null; const x = 360 + i * 85, y = 800 + (i % 2) * 24, rot = (rnd(i, 8) - 0.5) * 50; return <div key={i} style={{ position: "absolute", left: x, top: y - 700 * (1 - p), transform: `translate(-50%,-50%) rotate(${rot + (1 - p) * 140}deg)`, width: 130, height: 185, borderRadius: 12, background: "linear-gradient(160deg,#fbf8f0,#e6dfcf)", boxShadow: "0 16px 26px rgba(0,0,0,.55), 0 0 0 2px rgba(60,50,40,.3)", fontFamily: FONT, fontWeight: 900, color: c }}>
      <div style={{ position: "absolute", left: 12, top: 6, fontSize: 40, lineHeight: 1 }}>{r}<div style={{ fontSize: 34 }}>{s}</div></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 58, textAlign: "center", fontSize: 76 }}>{s}</div>
    </div>; })}
    <Mv y={420 * (1 - fr)}><Spr id="sp_rice_bowl" tt={tt} at={-5} x={1340} y={760} w={460} from="none" /></Mv>
    <Steam tt={tt} x={1340} y={600} w={140} k={0.6 * cl(fr) * (1 - eio(tt, 5.0, 8.0))} />
  </>;
}}</Stage>;

// 15 · FRITO FUERTE: cien granos saltan en parábola cada vez más rápido, chispas de aceite, y al final cae y se rompe el huevo
export const SToss: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 70% 60% at 50% 60%, #2a1a10, #070605 75%)">{(tt) => {
  const tau = Math.max(0, tt - 2.8), phi = 0.8 * tau + 0.05 * tau * tau, on = eio(tt, 2.6, 3.1) * (1 - eio(tt, 8.6, 9.0)), jolt = Math.max(0, Math.sin(2 * Math.PI * phi)) * on;
  const ef = eio(tt, 8.5, 8.85), crack = tt > 8.85, spread = eio(tt, 8.85, 9.5), toast = eio(tt, 3, 9);
  return <>
    <div style={{ position: "absolute", left: 960 - 560, top: 700 - 220, width: 1120, height: 440, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,120,40,.3), transparent 68%)", filter: "blur(30px)" }} />
    <Mv y={-36 * jolt} r={-3 * jolt} ox={960} oy={720}><Spr id="sp_rice_pan" tt={tt} at={0.3} x={960} y={660} w={820} /></Mv>
    {tt > 2.8 && Array.from({ length: 96 }, (_, i) => {
      const ph = (phi + 1 - rnd(i) * 0.12) % 1, hgt = (170 + 260 * rnd(i, 4)) * on, x0 = 960 + (rnd(i, 2) - 0.5) * 520, vx = (rnd(i, 3) - 0.5) * 260;
      let x = x0 + vx * Math.sin(ph * Math.PI), y = 620 - hgt * Math.sin(ph * Math.PI);
      if (spread > 0) { const dx = x - 960, dy = y - 600, d = Math.hypot(dx, dy) || 1; if (d < 140) { x = 960 + (dx / d) * 140; y = 600 + (dy / d) * 140; } }
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 24, height: 10, borderRadius: 5, background: rnd(i, 5) < 0.2 + 0.5 * toast ? "#e4bb64" : "#f6efe0", transform: `rotate(${ph * 540 + i * 33}deg)`, boxShadow: "0 3px 4px rgba(0,0,0,.4)" }} />;
    })}
    {/* chispas de aceite que saltan del borde */}
    {Array.from({ length: 12 }, (_, i) => { const f = 0.9 + 0.5 * rnd(i, 9), ph = (tt * f + rnd(i, 10)) % 1, a = rnd(i, 11) * Math.PI * 2; return tt > 3 && <div key={i} style={{ position: "absolute", left: 960 + Math.cos(a) * (330 + 60 * ph), top: 650 + Math.sin(a) * 200 - 90 * Math.sin(ph * Math.PI), width: 7, height: 7, borderRadius: "50%", background: "#ffd88a", boxShadow: "0 0 10px #ffb040", opacity: Math.sin(ph * Math.PI) * on }} />; })}
    {/* el huevo: cae entero, se parte en dos cáscaras y la yema se abre en el hueco */}
    {tt > 8.5 && !crack && <div style={{ position: "absolute", left: 960 - 48, top: 600 - 64 - 520 * (1 - ef), width: 96, height: 128, borderRadius: "50% 50% 46% 46% / 58% 58% 42% 42%", background: "radial-gradient(circle at 38% 30%, #fffaf0, #e8d8bc 70%)", boxShadow: "0 14px 20px rgba(0,0,0,.45)" }} />}
    {crack && [-1, 1].map((s) => { const d = eio(tt, 8.85, 9.4); return <div key={s} style={{ position: "absolute", left: 960 - 48 + s * 90 * d, top: 540 - 120 * d, width: 96, height: 64, borderRadius: "50% 50% 0 0 / 100% 100% 0 0", background: "linear-gradient(180deg,#fffaf0,#e2d2b4)", transform: `rotate(${s * (20 + 140 * d)}deg)`, opacity: 1 - eio(tt, 9.2, 9.6), boxShadow: "0 8px 12px rgba(0,0,0,.4)" }} />; })}
    {crack && <div style={{ position: "absolute", left: 960, top: 600, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -130 * spread, top: -95 * spread, width: 260 * spread, height: 190 * spread, borderRadius: "48% 52% 55% 45%", background: "radial-gradient(ellipse at 45% 40%, rgba(255,255,255,.97), rgba(245,240,230,.9) 70%, rgba(230,220,200,.5))", boxShadow: "0 6px 10px rgba(0,0,0,.25)" }} />
      <div style={{ position: "absolute", left: -38, top: -38, width: 76, height: 76, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #ffe39a, #f2a414 60%, #d8840a)", transform: `scale(${cl(spread * 2)})`, boxShadow: "0 4px 8px rgba(0,0,0,.3)" }} />
    </div>}
  </>;
}}</Stage>;

// 16 · UNA CUCHARA: la cuchara se inclina y suelta UNA gota que hace un círculo chico; al lado, el panqueque flota en un charco de aceite
export const SSpoon: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const dp = eio(tt, 3.9, 4.5), sp = eio(tt, 4.5, 5.2), rip = eio(tt, 4.5, 5.5), pud = eio(tt, 5.1, 5.9);
  return <>
    <BgB id="f_una_cuchara" tt={tt} />
    <Spr id="sp_skillet_oil" tt={tt} at={0.4} x={560} y={700} w={640} />
    <Mv y={-420 * (1 - eio(tt, 0.8, 2.0))}><Spr id="sp_spoon_wood" tt={tt} at={-5} x={700} y={380} w={620} from="none" shadow={0} rot={-14 - 26 * eio(tt, 3.3, 3.9)} /></Mv>
    {dp > 0 && dp < 1 && <div style={{ position: "absolute", left: 548, top: 430 + 250 * dp * dp, width: 30, height: 30 + 22 * dp, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: "radial-gradient(circle at 40% 30%, #fff8dc, #e8b84e 60%, #b07a18)", boxShadow: "0 0 12px rgba(255,210,110,.6)" }} />}
    {sp > 0 && <div style={{ position: "absolute", left: 560 - 75 * sp, top: 700 - 32 * sp, width: 150 * sp, height: 64 * sp, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, rgba(255,246,210,.95), rgba(225,165,55,.8) 45%, rgba(150,95,20,.7))", boxShadow: "0 0 18px rgba(255,200,90,.45)" }} />}
    {rip > 0 && rip < 1 && <div style={{ position: "absolute", left: 560 - 150 * rip, top: 700 - 60 * rip, width: 300 * rip, height: 120 * rip, borderRadius: "50%", border: `3px solid rgba(255,225,150,${0.8 * (1 - rip)})` }} />}
    {/* el exceso: charco de aceite grande con el panqueque grasoso flotando */}
    <div style={{ position: "absolute", left: 1380 - 330 * pud, top: 720 - 140 * pud, width: 660 * pud, height: 280 * pud, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, rgba(255,240,190,.75), rgba(225,160,50,.6) 45%, rgba(140,85,15,.45) 75%, transparent)", boxShadow: "0 18px 30px rgba(0,0,0,.35)" }} />
    <Mv y={6 * Math.sin(tt * 1.6)}><Spr id="sp_pancake_greasy" tt={tt} at={5.3} x={1380} y={680} w={520} from="right" shadow={0} /></Mv>
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1240 + i * 120, top: 610 + (i % 2) * 50, width: 46, height: 16, borderRadius: "50%", background: "rgba(255,255,255,.85)", filter: "blur(2px)", opacity: eio(tt, 6.0, 6.6) * (0.5 + 0.4 * Math.sin(tt * 1.4 + i * 2)), mixBlendMode: "screen" }} />)}
  </>;
}}</Stage>;

// 17 · LA POLENTA VINO DE ITALIA: desde el mar (barco y bandera) la bolsa vuela en arco, aterriza y se vuelca en la olla vacía
export const SItaly: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 75% 65% at 55% 60%, #3a2a18, #0a0806 75%)">{(tt) => {
  const p = eio(tt, 0.8, 3.2), land = phys(tt, 3.2, 9, 0.4), tip = eio(tt, 7.0, 7.6), fill = eio(tt, 7.6, 9.4);
  const x = 280 + (1000 - 280) * p + (1240 - 1000) * tip, y = 470 + (720 - 470) * p - 400 * Math.sin(p * Math.PI) + (440 - 720) * tip + (tt > 3.2 && tip === 0 ? 10 * (1 - land) : 0);
  return <>
    <Planks y={760} />
    {/* el mar, el barco y la bandera al costado izquierdo */}
    <div style={{ position: "absolute", left: 0, top: 0, width: 560, height: 1080, background: "linear-gradient(180deg,#9cc0d8 0%,#5f8fb2 38%,#245a80 40%,#123d5c 100%)", WebkitMaskImage: "linear-gradient(90deg,#000 55%,transparent)", maskImage: "linear-gradient(90deg,#000 55%,transparent)" } as React.CSSProperties}>
      <svg width={560} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M-40 ${450 + i * 70} q 40 -14 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`} stroke="rgba(255,255,255,.28)" strokeWidth={3} fill="none" transform={`translate(${(tt * (14 + i * 4)) % 160 - 80} 0)`} />)}</svg>
    </div>
    <Mv y={5 * Math.sin(tt * 1.1)} r={1.5 * Math.sin(tt * 0.9)} ox={230} oy={430}><Spr id="sp_r3_ship" tt={tt} at={-5} x={230} y={400} w={300} from="none" shadow={0} /></Mv>
    <div style={{ position: "absolute", left: 420, top: 220, width: 8, height: 300, background: "linear-gradient(90deg,#6a5a4a,#2a221a)" }} />
    <div style={{ position: "absolute", left: 428, top: 228, width: 160, height: 104, display: "flex", transformOrigin: "0 50%", transform: `skewY(${4 * Math.sin(tt * 1.6)}deg) scaleX(${0.94 + 0.06 * Math.sin(tt * 1.6 + 1)})`, boxShadow: "0 10px 18px rgba(0,0,0,.4)" }}>{["#1d8a4a", "#f4f1e8", "#c8322c"].map((c) => <div key={c} style={{ flex: 1, background: c }} />)}</div>
    <svg width={W} height={HH} style={{ position: "absolute", left: 0, top: 0, opacity: 0.6 * (1 - eio(tt, 4, 6)) }}><path d={`M280 470 Q640 -120 ${x} ${y}`} stroke="#e8d3a0" strokeWidth={6} fill="none" strokeDasharray="4 26" strokeLinecap="round" /></svg>
    <Spr id="sp_r3_pot_empty" tt={tt} at={1.8} x={1300} y={800} w={560} />
    <Pour tt={tt} at={7.5} out={9.4} x={1290} y1={500} y2={640} col="rgba(240,190,60,.95)" w={28} />
    {/* la polenta sube y asoma por la boca de la olla */}
    <div style={{ position: "absolute", left: 1300 - 200, top: 640 - 60 * fill, width: 400, height: 40 + 60 * fill, borderRadius: "50% 50% 0 0", background: "radial-gradient(ellipse at 50% 20%, #ffe08a, #e8b23a 70%)", opacity: cl(fill * 4), boxShadow: "inset 0 -10px 16px rgba(160,100,20,.5)" }} />
    <Mv x={x - 860} y={y - 520} r={(1 - p) * -40 + 115 * tip} ox={860} oy={520}><Spr id="sp_sack_cornmeal" tt={tt} at={-5} x={860} y={520} w={340} from="none" shadow={0} /></Mv>
    <Burst tt={tt} at={3.2} x={1000} y={790} n={10} col="#e9cf8a" sp={300} sz={8} life={0.6} />
  </>;
}}</Stage>;

// 18 · DALES ESPACIO: la sartén apretada se ahoga en una nube de vapor; la que tiene lugar dora de a poco y chisporrotea
export const SCrowd: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const b = eio(tt, 4.0, 10.5);
  return <>
    <BgB id="n_sarten_lleno_vapor" tt={tt} />
    <Spr id="sp_pot_crowded" tt={tt} at={0.3} x={560} y={640} w={680} style={{ filter: "saturate(.55) brightness(1.12) drop-shadow(0 18px 22px rgba(0,0,0,.45))" }} />
    {[0, 1.1, 2.3, 3.4].map((o, i) => <Steam key={i} tt={tt + o} x={460 + i * 70} y={480 - (i % 2) * 40} w={300} k={1.5} />)}
    {Array.from({ length: 10 }, (_, i) => { const a = Math.PI * (1.05 + 0.9 * (i / 9)); return <div key={i} style={{ position: "absolute", left: 560 + Math.cos(a) * 300 - 5, top: 640 + Math.sin(a) * 150 - 5, width: 10, height: 13, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, rgba(200,220,235,.5))", opacity: eio(tt, 1, 2.5) * (0.5 + 0.4 * Math.sin(tt * 1.2 + i)) }} />; })}
    <Spr id="sp_pot_room" tt={tt} at={3.0} x={1360} y={640} w={680} style={{ filter: `sepia(${0.5 * b}) saturate(${1 + 0.6 * b}) brightness(${1.06 - 0.2 * b}) drop-shadow(0 18px 22px rgba(0,0,0,.45))` }} />
    {Array.from({ length: 16 }, (_, i) => { const ph = (tt * (0.9 + 0.5 * rnd(i, 4)) + rnd(i)) % 1; return tt > 3.4 && <div key={i} style={{ position: "absolute", left: 1360 + (rnd(i, 2) - 0.5) * 420, top: 630 + (rnd(i, 3) - 0.5) * 220 - 60 * ph, width: i % 3 ? 7 : 14, height: i % 3 ? 7 : 14, borderRadius: "50%", background: i % 3 ? "#ffe2a0" : "transparent", border: i % 3 ? "none" : "2px solid rgba(255,235,180,.7)", opacity: Math.sin(ph * Math.PI) * 0.85, boxShadow: i % 3 ? "0 0 8px #ffc060" : "none" }} />; })}
    <Big tt={tt} at={4.1} x={1360} y={190} txt="ROOM" size={120} col={AMB} />
  </>;
}}</Stage>;

// 19 · UN CUARTO: el cuchillo corta las monedas una por una; el resto del aro se envuelve en papel de carnicero atado con hilo
export const SWrap: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const K = [0.5, 1.0, 1.5, 2.0], kb = K.reduce((a, k) => Math.max(a, Math.sin(cl((tt - k) / 0.32) * Math.PI)), 0), nd = K.filter((k) => tt > k + 0.16).length;
  const kin = eio(tt, 0.1, 0.45) * (1 - eio(tt, 2.4, 2.9)), paper = phys(tt, 3.2, 6, 0.6), fl = eio(tt, 4.4, 5.0), fr = eio(tt, 5.0, 5.6), tie = eio(tt, 5.8, 6.4), done = tt > 5.6;
  return <>
    <BgB id="f_corta_salchicha" tt={tt} />
    <div style={{ position: "absolute", left: 160, top: 470, width: 1600, height: 440, borderRadius: 26, background: "repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 3px, transparent 3px 41px), linear-gradient(180deg,#a7794a,#8a6038)", boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 4px 0 rgba(255,220,170,.3)" }} />
    <Spr id="sp_r3_paper_sheet" tt={tt} at={-5} x={1240 + 900 * (1 - paper)} y={690} w={720} from="none" op={tt > 3.2 ? 1 : 0} shadow={0} />
    {!done && <Spr id="sp_r3_sausage_ring" tt={tt} at={0.0} x={1180 - 30 * nd + 60 * eio(tt, 3.6, 4.3)} y={680} w={560} from="none" style={{ clipPath: `inset(0 0 0 ${nd * 6}%)` }} />}
    {/* las solapas del papel se cierran y queda el paquete atado */}
    {fl > 0 && <div style={{ position: "absolute", left: 900, top: 520, width: 340, height: 340, transformOrigin: "0 50%", transform: `scaleX(${fl})`, background: "linear-gradient(90deg,#b88a58,#c99b68)", boxShadow: "8px 0 16px rgba(0,0,0,.3)", borderRadius: 6, opacity: done ? 0 : 1 }} />}
    {fr > 0 && <div style={{ position: "absolute", left: 1240, top: 520, width: 340, height: 340, transformOrigin: "100% 50%", transform: `scaleX(${fr})`, background: "linear-gradient(270deg,#b88a58,#caa070)", boxShadow: "-8px 0 16px rgba(0,0,0,.3)", borderRadius: 6, opacity: done ? 0 : 1 }} />}
    {done && <div style={{ position: "absolute", left: 1240 - 300, top: 690 - 170, width: 600, height: 340, borderRadius: 10, background: "linear-gradient(160deg,#cfa272,#b08050)", boxShadow: "0 26px 44px rgba(0,0,0,.55), inset 0 0 0 2px rgba(90,60,30,.3)" }}>
      <div style={{ position: "absolute", left: 296, top: 0, width: 3, height: 340, background: "rgba(90,60,30,.35)" }} />
      <div style={{ position: "absolute", left: 0, top: 168, width: 600 * tie, height: 7, background: "#e8dcc0", boxShadow: "0 2px 3px rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", left: 296, top: 0, width: 7, height: 340 * tie, background: "#e8dcc0", boxShadow: "2px 0 3px rgba(0,0,0,.3)" }} />
    </div>}
    {/* las monedas de salchicha: saltan del corte y ruedan a la pila */}
    {Array.from({ length: nd }, (_, i) => { const p = eio(tt, K[i] + 0.16, K[i] + 0.7), x0 = 900 - i * 34, x1 = 470 + i * 70, y1 = 700 + (i % 2) * 20; return <div key={i} style={{ position: "absolute", left: x0 + (x1 - x0) * p - 52, top: 690 + (y1 - 690) * p - 52 - 60 * Math.sin(p * Math.PI), width: 104, height: 104, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, #e8a4a0 0 30%, #c06a5c 31% 62%, #7a3a26 64% 82%, #5a2616 84%)", boxShadow: "0 10px 14px rgba(0,0,0,.45)", transform: `rotate(${p * 300}deg)` }} />; })}
    {kin > 0.01 && <Mv x={900 - 30 * nd - 880} y={-560 * (1 - kin) + 150 * kb}><Spr id="sp_knife" tt={tt} at={-5} x={880} y={420} w={260} from="none" shadow={0} rot={8} /></Mv>}
    <Big tt={tt} at={2.4} x={560} y={300} txt="¼" size={240} col={AMB} />
  </>;
}}</Stage>;

// 20 · LA LATA DE GRASA: la sartén se inclina y vierte el hilo de grasa; después el lápiz raya la cuenta en la lata
export const SGreaseCan: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const pin = eio(tt, 4.6, 5.6) * (1 - eio(tt, 8.3, 8.9)), tilt = eio(tt, 5.8, 6.2) * (1 - eio(tt, 8.1, 8.4)), lvl = eio(tt, 6.3, 8.2);
  const M = [8.7, 9.1, 9.5, 9.9, 10.3], pen = eio(tt, 8.4, 8.7) * (1 - eio(tt, 10.6, 10.9));
  const cur = M.reduce((a, m, i) => (tt > m ? i : a), 0), mp = eio(tt, M[cur], M[cur] + 0.25), mx = cur === 4 ? 860 + 220 * mp : 870 + cur * 50, my = cur === 4 ? 640 + 90 * mp : 620 + 150 * mp;
  return <>
    <BgB id="f_lata_grasa" tt={tt} />
    <Planks y={830} />
    <Spr id="sp_coffee_can" tt={tt} at={2.0} x={960} y={640} w={420} />
    <div style={{ position: "absolute", left: 960 - 160, top: 452 - 8 * lvl, width: 320, height: 54, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, rgba(255,240,190,.9), rgba(220,170,80,.85) 60%)", opacity: eio(tt, 6.3, 6.8) }} />
    <Pour tt={tt} at={6.2} out={8.2} x={950} y1={330} y2={455} col="rgba(236,214,160,.95)" w={20} />
    {[6.4, 6.9, 7.5].map((a, i) => <Burst key={i} tt={tt} at={a} x={950} y={455} n={6} col="#f0d79a" sp={200} sz={7} life={0.4} />)}
    <Mv x={-700 * (1 - pin)} y={-500 * (1 - pin)} r={38 * tilt} ox={880} oy={300}><Spr id="sp_skillet_tilt" tt={tt} at={-5} x={720} y={270} w={520} from="none" shadow={0} /></Mv>
    {M.map((m, i) => { const p = eio(tt, m, m + 0.25); if (p <= 0) return null; return i < 4 ? <div key={i} style={{ position: "absolute", left: 870 + i * 50, top: 620, width: 13, height: 150 * p, borderRadius: 6, background: "rgba(255,250,240,.95)", boxShadow: "0 0 6px rgba(255,255,255,.5)", transform: `rotate(${-3 + rnd(i) * 6}deg)` }} /> : <div key={i} style={{ position: "absolute", left: 850, top: 690, width: 260 * p, height: 13, borderRadius: 6, background: "rgba(255,250,240,.95)", transform: "rotate(-24deg)", transformOrigin: "0 50%" }} />; })}
    {pen > 0.01 && <Mv x={mx - 960 + 160} y={my - 540 - 120 - 400 * (1 - pen)}><Spr id="sp_r3_pencil" tt={tt} at={-5} x={960} y={540} w={380} from="none" shadow={0} /></Mv>}
  </>;
}}</Stage>;

// 21 · LA PAPA APLASTADA: la taza enlozada baja con peso sobre la papa hervida, que se raja y suelta vapor
export const SSmash: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const dn = eio(tt, 5.9, 6.6), pr = eio(tt, 6.6, 8.8), up = eio(tt, 9.0, 9.8), sm = tt > 8.75, bounce = up > 0 ? 0 : 0;
  return <>
    <BgB id="n_papa_hervida" tt={tt} dim={0.65} />
    <Planks y={790} />
    {!sm && <Mv sx={1 + 0.28 * pr} sy={1 - 0.38 * pr} ox={960} oy={880}><Spr id="sp_potato_boiled" tt={tt} at={1.8} x={960} y={720} w={520} /></Mv>}
    {sm && <Spr id="sp_r3_potato_cracked" tt={tt} at={8.75} x={960} y={760} w={720} from="none" />}
    <Steam tt={tt} x={960} y={600} w={240} k={1.2 * eio(tt, 8.75, 9.1) * (1 - eio(tt, 10.0, 11.0))} />
    <Burst tt={tt} at={8.78} x={960} y={720} n={14} col="#f6f0dc" sp={460} sz={16} life={0.8} />
    <Mv y={-760 * (1 - dn) + 150 * pr - 900 * up + bounce}><Spr id="sp_r3_mug_white" tt={tt} at={-5} x={960} y={330} w={330} from="none" shadow={0} /></Mv>
  </>;
}}</Stage>;

// 22 · PIEROGI VAGO: la cebolla pasa de blanca a dorada en la sartén; después caen los cubitos de papa y la cascada de fideos
export const SPierogi: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const g = eio(tt, 1.5, 8.6);
  return <>
    <BgB id="n_cebolla_caramelo" tt={tt} />
    <Mv p="perspective(1500px) rotateX(36deg)" ox={960} oy={640}>
      <Spr id="sp_skillet_onion" tt={tt} at={0.2} x={960} y={640} w={840} style={{ filter: `sepia(${0.6 * g}) saturate(${1 + 0.7 * g}) brightness(${1.1 - 0.18 * g}) drop-shadow(0 18px 22px rgba(0,0,0,.45))` }} />
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 760 + rnd(i, 2) * 400, top: 520 + rnd(i, 3) * 240, width: 30, height: 10, borderRadius: "50%", background: "rgba(255,250,230,.85)", filter: "blur(1px)", opacity: 0.3 + 0.35 * Math.sin(tt * 1.3 + i * 2) }} />)}
      {Array.from({ length: 14 }, (_, j) => { const at = 9.0 + j * 0.05, p = phys(tt, at, 8, 0.45); if (p <= 0.01) return null; return <Cube key={j} x={820 + rnd(j, 4) * 300} y={560 + rnd(j, 5) * 180 - 500 * (1 - p)} s={36} r={rnd(j, 6) * 90} gold={1} />; })}
      <Spr id="sp_noodles" tt={tt} at={10.0} x={920} y={620} w={440} />
    </Mv>
    <Steam tt={tt} x={960} y={420} w={230} k={eio(tt, 1, 3) * 0.85} />
  </>;
}}</Stage>;

// 23 · LA CEBOLLA: el cuchillo parte la cebolla en dos; una mitad dora pareja sobre llama chica, la otra se quema por fuera
export const SBurn: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const open = eio(tt, 2.75, 3.5), kn = eio(tt, 2.2, 2.7) * (1 - eio(tt, 3.0, 3.5)), low = eio(tt, 3.6, 4.4), hi = eio(tt, 6.4, 7.2);
  return <>
    <BgB id="n_crema_agria" tt={tt} dim={0.65} />
    <FireP tt={tt} x={600} y={900} w={300} k={low} blue n={16} />
    <FireP tt={tt} x={1320} y={930} w={760} k={hi} n={28} />
    <Mv x={-300 * open} f={`brightness(${0.55 + 0.45 * low})`}><Spr id="sp_r3_onion_half_gold" tt={tt} at={0.4} x={900} y={640} w={480} /></Mv>
    <Mv x={300 * open} f={`brightness(${0.55 + 0.45 * hi})`}><Spr id="sp_r3_onion_half_burnt" tt={tt} at={0.6} x={1020} y={640} w={480} /></Mv>
    {tt > 7.4 && [0, 1, 2, 3].map((i) => { const ph = (tt * 0.35 + i * 0.25) % 1; return <div key={i} style={{ position: "absolute", left: 1200 + i * 60 + 30 * Math.sin(ph * 5), top: 560 - ph * 380, width: 160, height: 200, borderRadius: "50%", background: "rgba(40,36,32,.55)", filter: "blur(24px)", opacity: Math.sin(ph * Math.PI) }} />; })}
    {kn > 0.01 && <Mv y={-640 * (1 - kn)}><Spr id="sp_knife" tt={tt} at={-5} x={960} y={520} w={300} from="none" shadow={0} rot={4} /></Mv>}
  </>;
}}</Stage>;

// 24 · ARVID Y SU ABUELA: sobre la mesa de la cabaña cae la postal, un dedo con harina marca el pueblo y se desliza la foto de la abuela
export const SPostcard: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const ph = phys(tt, 4.0, 5.5, 0.6), fin = eio(tt, 2.3, 2.9) * (1 - eio(tt, 4.2, 4.8)), tap = Math.max(0, Math.sin(cl((tt - 2.95) / 0.3) * Math.PI)) + Math.max(0, Math.sin(cl((tt - 3.4) / 0.3) * Math.PI)), cam = eio(tt, 0.8, 9.6);
  return <>
    <Bg id="bg_mesa_cabana" tt={tt} dim={0.15} />
    <Mv s={1 + 0.12 * cam} r={-1.2 * cam} ox={1000} oy={760}>
      <Mv p="perspective(1500px) rotateX(46deg)" ox={960} oy={800}>
        <Spr id="sp_postcard" tt={tt} at={0.6} x={1120} y={800} w={640} rot={5} />
        <Mv x={-900 * (1 - ph)} r={-10 + 10 * ph} ox={760} oy={820}><Spr id="sp_grandma_photo" tt={tt} at={-5} x={760} y={820} w={500} rot={-8} from="none" style={{ clipPath: "inset(0 0 9% 9% round 6px)" }} /></Mv>
      </Mv>
      {fin > 0.01 && <Mv x={600 * (1 - fin)} y={-400 * (1 - fin) + 26 * tap}><Spr id="sp_r3_hand_point" tt={tt} at={-5} x={1240} y={560} w={360} from="none" shadow={0} /></Mv>}
    </Mv>
  </>;
}}</Stage>;

// 25 · EL REPOLLO SE ACHICA: de costado, la montaña baja con vapor; la cinta roja en la regla queda marcando dónde llegaba
export const SShrink: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s1 = eio(tt, 1.0, 8.8), s2 = eio(tt, 8.8, 10.6), TOP0 = 300, flag = phys(tt, 1.4, 7, 0.5);
  return <>
    <BgB id="n_manteca_sarten" tt={tt} />
    <Planks y={840} />
    <Mv sy={1 - 0.1 * s1} ox={900} oy={880} o={1 - s2}><Spr id="sp_r3_cabbage_tall" tt={tt} at={0.4} x={900} y={640} w={900} /></Mv>
    <Spr id="sp_r3_cabbage_low" tt={tt} at={-5} x={900} y={700} w={900} from="none" op={s2} />
    <Steam tt={tt} x={900} y={440} w={240} k={0.9 * eio(tt, 1, 3)} />
    {/* regla de madera al costado con la cinta roja en la altura del principio */}
    <div style={{ position: "absolute", left: 1480, top: 220, width: 46, height: 660, background: "linear-gradient(90deg,#d8b678,#b8924e)", boxShadow: "8px 12px 22px rgba(0,0,0,.5)", opacity: eio(tt, 0.6, 1.2) }}>
      {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: 10 + i * 30, width: i % 5 === 0 ? 30 : 16, height: 3, background: "rgba(40,25,10,.7)" }} />)}
    </div>
    {flag > 0.01 && <div style={{ position: "absolute", left: 1470, top: TOP0, width: 150 * flag, height: 34, background: "linear-gradient(180deg,#e0453a,#a82a20)", boxShadow: "0 6px 10px rgba(0,0,0,.4)", clipPath: "polygon(0 0,100% 0,88% 50%,100% 100%,0 100%)" }} />}
    <div style={{ position: "absolute", left: 520, top: TOP0 + 15, width: 950, height: 0, borderTop: "4px dashed rgba(255,235,210,.75)", opacity: eio(tt, 9.4, 10.0) }} />
  </>;
}}</Stage>;

// 26 · 80 CENTAVOS Y EL VOTO DE LA CUADRILLA: la etiqueta de 80¢ colgada; la pila de platos crece con cada voto y la tiza los cuenta
export const STally: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const AT = [0.6, 1.6, 2.6, 9.6, 9.95, 10.3, 10.65], V = [9.6, 9.95, 10.3, 10.65];
  return <>
    <BgB id="n_resto_salchicha" tt={tt} />
    <Planks y={860} />
    <Tag2 tt={tt} at={6.6} x={520} y={110} txt="80¢" w={360} fs={140} />
    {AT.map((a, i) => <Spr key={i} id="sp_r3_plate_side" tt={tt} at={a} x={1120} y={850 - i * 34} w={460} shadow={i === 0 ? 1 : 0} />)}
    <div style={{ position: "absolute", left: 1480, top: 380, width: 300, height: 360, borderRadius: 10, background: "linear-gradient(160deg,#2c302c,#161a17)", boxShadow: "0 24px 40px rgba(0,0,0,.6), 0 0 0 12px #6a4a2c", opacity: eio(tt, 8.6, 9.2) }}>
      {V.map((v, i) => <div key={i} style={{ position: "absolute", left: 56 + i * 52, top: 70, width: 12, height: 220 * eio(tt, v, v + 0.2), borderRadius: 6, background: "rgba(245,245,236,.92)", transform: `rotate(${-4 + rnd(i) * 8}deg)`, filter: "url(#chalk3)" }} />)}
    </div>
    <Sv />
  </>;
}}</Stage>;

// 27 · TOSTADA FRANCESA: el talón de pan duro golpea la mesa, se hunde en el huevo, sale chorreando y dora en la sartén
export const SBread: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const go = eio(tt, 8.2, 8.7), dip = eio(tt, 8.7, 9.0), out = eio(tt, 9.1, 9.5), pan = eio(tt, 9.5, 9.95), brown = eio(tt, 9.95, 10.6), soaked = tt > 9.05;
  const bx = 640 + (1300 - 640) * go + (860 - 1300) * pan, by = 640 + (560 - 640) * go + 120 * dip - 160 * out + (700 - 400) * pan * 0;
  return <>
    <BgB id="n_pan_viejo" tt={tt} />
    <Planks y={780} />
    <CodePan x={820} y={760} r={260} sy={0.55} hot={eio(tt, 6, 8)} />
    <Spr id="sp_egg_bowl" tt={tt} at={7.0} x={1340} y={760} w={520} from="right" />
    <Burst tt={tt} at={4.75} x={640} y={760} n={14} col="#b88a50" sp={360} sz={10} life={0.8} />
    {!soaked && <Spr id="sp_r3_bread_heel" tt={tt} at={4.4} x={bx} y={by} w={420} rot={-20 * go} style={{ clipPath: `inset(0 0 ${55 * dip * (1 - out)}% 0)` }} />}
    {soaked && <Mv f={`sepia(${0.6 * brown}) brightness(${1 - 0.25 * brown}) saturate(${1 + 0.4 * brown})`}><Spr id="sp_r3_bread_soaked" tt={tt} at={-5} x={bx + 20} y={by + 520 * pan * 0 + (760 - 520) * pan} w={420} from="none" /></Mv>}
    {soaked && pan < 1 && [0, 1, 2].map((i) => { const ph = ((tt - 9.1) * 2.2 + i * 0.33) % 1; return <div key={i} style={{ position: "absolute", left: bx - 60 + i * 60, top: by + 120 + ph * 160, width: 14, height: 20, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: "#f2c84a", opacity: 1 - ph }} />; })}
    <Steam tt={tt} x={860} y={640} w={180} k={0.9 * brown} />
  </>;
}}</Stage>;

// 28 · LA CENA DE LIMPIEZA: los cuatro frascos se vuelcan de a uno (se ve el nivel bajar), la sartén se llena por capas y la espátula revuelve
const CLN = [["sp_jar_rice", "#f1ead8"], ["sp_jar_cabbage", "#b7c27a"], ["sp_jar_potato", "#e3c070"], ["sp_jar_beans", "#7a4a2c"]] as const;
export const SCleanout: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const stir = eio(tt, 6.2, 6.6) * (1 - eio(tt, 9.6, 10.0)), ang = (tt - 6.2) * 0.6 * 2 * Math.PI;
  return <>
    <BgB id="n_todo_sarten" tt={tt} />
    <Spr id="sp_cleanout_pan" tt={tt} at={0.2} x={960} y={760} w={660} />
    {CLN.map(([id, col], i) => {
      const a = 0.9 + i * 1.2, tl = eio(tt, a, a + 0.4) * (1 - eio(tt, a + 1.1, a + 1.5)), lv = eio(tt, a + 0.4, a + 1.1), x = 420 + i * 360;
      return <React.Fragment key={id}>
        <Pour tt={tt} at={a + 0.4} out={a + 1.1} x={x + (960 - x) * 0.55} y1={330} y2={700} col={col} w={22} />
        <Mv x={(960 - x) * 0.45 * tl} y={-40 * tl} r={(x < 960 ? 1 : -1) * 115 * tl} ox={x} oy={260}>
          <Spr id={id} tt={tt} at={0.3 + i * 0.15} x={x} y={260} w={220} shadow={0} />
          <div style={{ position: "absolute", left: x - 110, top: 150, width: 220, height: 240, WebkitMaskImage: `url(${spr(id)})`, maskImage: `url(${spr(id)})`, WebkitMaskSize: "100% auto", maskSize: "100% auto", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", background: `linear-gradient(180deg, rgba(205,225,235,.78) ${lv * 92}%, transparent ${lv * 92}%)` } as React.CSSProperties} />
        </Mv>
        {Array.from({ length: 8 }, (_, j) => { const p = phys(tt, a + 0.5 + j * 0.07, 9, 0.5); if (p <= 0.01) return null; const r0 = 40 + rnd(j + i * 8, 3) * 170, a0 = rnd(j + i * 8, 4) * Math.PI * 2 + (stir > 0 ? (tt - 6.2) * 1.4 * stir : 0); return <div key={j} style={{ position: "absolute", left: 960 + Math.cos(a0) * r0 - 40, top: 740 + Math.sin(a0) * r0 * 0.5 - 26 - 300 * (1 - p), width: 80 + rnd(j, 5) * 30, height: 52, borderRadius: "50%", background: `radial-gradient(ellipse at 40% 35%, ${col}, rgba(0,0,0,.25) 120%)`, boxShadow: "0 6px 8px rgba(0,0,0,.35)" }} />; })}
      </React.Fragment>;
    })}
    {stir > 0.01 && <Spr id="sp_spatula" tt={tt} at={-5} x={960 + Math.cos(ang) * 120} y={640 + Math.sin(ang) * 60} w={420} from="none" shadow={0} rot={-30 + 20 * Math.sin(ang)} op={stir} />}
    <Steam tt={tt} x={960} y={600} w={210} k={0.7 * eio(tt, 3, 5)} />
    <Tag2 tt={tt} at={8.4} x={960} y={60} txt="$0.60" w={340} fs={100} />
  </>;
}}</Stage>;

// 29 · LA CUENTA DE LA SEMANA: en el pizarrón real, a tiza y grande: 10 u 11 dólares, cincuenta centavos la comida; las monedas se apilan
export const SChalk: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const LN = [[1.2, 0.6, 330, 230, "15¢", 120], [6.3, 1.3, 960, 450, "$10–11", 270], [9.7, 1.2, 960, 760, "50¢ A MEAL", 170]] as const;
  const cur = LN.reduce((a, l, i) => (tt >= l[0] ? i : a), 0), [a0, du, x0, y0, tx, sz] = LN[cur], p = eio(tt, a0, a0 + du), wd = chalkW(tx, sz);
  const cx = x0 - wd / 2 + p * wd, cy = y0 - sz * 0.62, writing = p > 0 && p < 1, coins = Math.floor(cl((tt - 6.4) / 2.6) * 9);
  return <>
    <Bg id="bg_pizarra" tt={tt} dim={0.05} z={1.1} />
    <Sv />
    {LN.map(([a, d, x, y, txt, s], i) => <Chalk key={i} tt={tt} at={a} x={x} y={y} txt={txt} size={s} dur={d} col={i === 2 ? "rgba(255,214,120,.96)" : undefined} />)}
    {writing && Array.from({ length: 8 }, (_, i) => { const ph = (tt * 2 + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: cx + (rnd(i, 2) - 0.5) * 30, top: cy + sz * 0.5 + ph * 160, width: 5, height: 5, borderRadius: "50%", background: "rgba(245,245,240,.8)", opacity: 1 - ph }} />; })}
    {tt > 0.9 && <Mv x={(tt < 1.2 ? x0 - wd / 2 : cx) - 960} y={cy - 560 + (writing ? 5 * Math.sin(tt * 9) : 0)}><Spr id="sp_chalk" tt={tt} at={0.9} x={960} y={560} w={90} from="up" shadow={0} rot={35} /></Mv>}
    {Array.from({ length: coins }, (_, i) => <div key={i} style={{ position: "absolute", left: 1640 + (i % 2) * 6 - 50, top: 940 - i * 16 - 40 * (1 - phys(tt, 6.4 + i * 0.29, 9, 0.5)), width: 100, height: 34, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #f0b070, #b8662c 60%, #7a3e18)", boxShadow: "0 4px 6px rgba(0,0,0,.5), inset 0 -3px 0 rgba(90,40,10,.6)" }} />)}
  </>;
}}</Stage>;

// 30 · LA LISTA ENTERA: la lista a lápiz se va tachando mientras entran con peso el arroz, la cajita chica, el saco de 25 libras y la bolsa de papas
export const SBagBox: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const ST = [4.6, 5.8, 8.7, 10.1];
  return <>
    <BgB id="n_lista_compras" tt={tt} dim={0.68} />
    <Planks y={680} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0 }}>
      <Spr id="sp_r3_list_paper" tt={tt} at={1.0} x={300} y={500} w={400} rot={-6} />
      {ST.map((s, i) => <div key={i} style={{ position: "absolute", left: 180, top: 420 + i * 52, width: 240 * eio(tt, s, s + 0.3), height: 6, borderRadius: 3, background: "rgba(40,40,46,.85)", transform: "rotate(-7deg)", transformOrigin: "0 50%" }} />)}
    </div>
    <Spr id="sp_rice_bag" tt={tt} at={4.4} x={790} y={700} w={300} />
    <Spr id="sp_rice_box" tt={tt} at={5.6} x={1040} y={830} w={140} />
    <Spr id="sp_r3_flour_sack" tt={tt} at={8.5} x={1330} y={640} w={520} />
    <Spr id="sp_sack_potato" tt={tt} at={9.9} x={1700} y={690} w={380} />
    {ST.map((s, i) => <Glint key={i} tt={tt} at={s - 0.2} x={[790, 1040, 1330, 1700][i]} y={[620, 800, 520, 600][i]} r={110} />)}
  </>;
}}</Stage>;

// 31 · COCINÁ UNA VEZ, COMÉ TRES: la olla humea, el cucharón revuelve y sirve tres veces; cada plato entra y cae en abanico
export const SThree: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const D = [["sp_food_beans", -560, 40, 9.0], ["sp_bean_cakes", 0, 250, 9.6], ["sp_bean_soup", 560, 40, 10.2]] as const;
  const stirA = (tt - 3) * 0.55 * 2 * Math.PI, stir = eio(tt, 3.0, 3.5) * (1 - eio(tt, 8.4, 8.8));
  const srv = D.reduce((a, d, i) => (tt > d[3] - 0.5 ? i : a), -1), sp = srv < 0 ? 0 : eio(tt, D[srv][3] - 0.5, D[srv][3]);
  const lx = srv < 0 ? 960 + Math.cos(stirA) * 90 : 960 + D[srv][1] * 0.55 * sp, ly = srv < 0 ? 330 + Math.sin(stirA) * 30 : 330 + (D[srv][2] + 120) * 0.4 * sp;
  return <>
    <BgB id="n_lars_teamster" tt={tt} />
    <Planks y={780} />
    <Mv y={400 * (1 - phys(tt, 0.5, 5.5, 0.6))}><Spr id="sp_bean_pot" tt={tt} at={-5} x={960} y={520} w={600} from="none" /></Mv>
    <Steam tt={tt} x={960} y={330} w={210} k={0.9} />
    {D.map(([id, dx, dy, a], i) => { const p = phys(tt, a, 6.5, 0.55); if (p <= 0.01) return null; return <Spr key={id} id={id} tt={tt} at={-5} x={960 + dx * p} y={560 + (dy + 260) * p} w={420} from="none" rot={(1 - p) * 30} />; })}
    {(stir > 0.01 || (srv >= 0 && tt < 10.9)) && <Spr id="sp_r3_ladle" tt={tt} at={-5} x={lx} y={ly} w={380} from="none" shadow={0} rot={-20 + 15 * Math.sin(stirA)} op={Math.max(stir, srv >= 0 ? 1 - eio(tt, 10.6, 10.9) : 0)} />}
    <OdoV v={Math.min(3, Math.max(0, srv + 1 - 1 + sp))} x={960} y={140} op={eio(tt, 8.6, 9.0)} size={110} dec={0} pre="" />
  </>;
}}</Stage>;

// 32 · UN SOLO FUEGO: la sartén sobre la boca de la cocina a leña; caen papa, cebolla y huevo de a uno y se van sumando
export const SOneFire: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 62%, #2a1a10, #060504 75%)">{(tt) => {
  const S2 = [["sp_of_potatoes", 4.0, 820, 620, 400], ["sp_of_onions", 5.6, 1100, 560, 360], ["sp_of_eggs", 8.4, 960, 640, 380]] as const;
  const act = S2.reduce((a, s, i) => (tt >= s[1] ? i : a), -1);
  return <>
    <Spr id="sp_r3_burner" tt={tt} at={0.2} x={960} y={600} w={1000} from="none" style={{ filter: `brightness(${0.85 + 0.1 * Math.sin(tt * 1.2)}) drop-shadow(0 0 40px rgba(255,120,40,.4))` }} />
    <FireP tt={tt} x={960} y={880} w={900} k={0.6 * eio(tt, 0.4, 1.4)} n={24} />
    <Spr id="sp_skillet_top" tt={tt} at={0.5} x={960} y={600} w={780} />
    {S2.map(([id, a, x, y, w], i) => <Mv key={id} f={`brightness(${act === i ? 1.12 : 0.85})`}><Spr id={id} tt={tt} at={a} x={x} y={y} w={w} shadow={0} /><Burst tt={tt} at={a + 0.35} x={x} y={y} n={8} col="#ffd27a" sp={260} sz={6} life={0.5} /></Mv>)}
    <Steam tt={tt} x={960} y={360} w={200} k={0.7 * eio(tt, 4, 5)} />
  </>;
}}</Stage>;

// 33 · FAMILIA DE CUATRO: mantel a cuadros visto desde arriba; llegan cuatro platos servidos y el contador del centro cuenta por plato
export const SFamily: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 70% 60% at 50% 55%, #2a2016, #080706 75%)">{(tt) => {
  const PL = [["sp_r3_fam1", 0.8, 960, 210], ["sp_r3_fam2", 6.6, 1500, 560], ["sp_r3_fam3", 7.0, 960, 880], ["sp_r3_fam4", 7.4, 420, 560]] as const;
  const v = tt < 0.8 ? 0 : tt < 6.6 ? 0.53 * eio(tt, 0.9, 1.6) : 0.53 + 1.47 * eio(tt, 6.6, 8.3);
  return <>
    <WoodTop />
    <div style={{ position: "absolute", left: 230, top: 60, width: 1460, height: 960, borderRadius: 10, background: "repeating-linear-gradient(0deg, rgba(190,40,40,.5) 0 60px, transparent 60px 120px), repeating-linear-gradient(90deg, rgba(190,40,40,.5) 0 60px, transparent 60px 120px), #f2ece0", boxShadow: "0 30px 60px rgba(0,0,0,.55)", opacity: eio(tt, 0, 0.6) }} />
    {PL.map(([id, a, x, y], i) => <Spr key={id} id={id} tt={tt} at={a} x={x} y={y} w={330} rot={i * 20} />)}
    <OdoV v={v} x={960} y={545} op={eio(tt, 0.8, 1.2)} size={100} />
  </>;
}}</Stage>;

// 34 · LA SARTÉN DE 10 PULGADAS: entra girando con peso, la cinta métrica se estira de borde a borde y el 10 se enciende; cae un huevo
export const SSize: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 70% 60% at 50% 55%, #241c14, #070605 75%)">{(tt) => {
  const sp = phys(tt, 0.1, 6, 0.55), ext = eio(tt, 1.3, 2.4), ten = eio(tt, 2.4, 2.7), X0 = 640, IN = 64;
  return <>
    <Mv r={-120 * (1 - sp)} ox={960} oy={600}><Spr id="sp_skillet_big" tt={tt} at={0.1} x={960} y={600} w={860} /></Mv>
    <Spr id="sp_r3_tape_case" tt={tt} at={0.8} x={X0 - 70} y={600} w={170} from="left" />
    <div style={{ position: "absolute", left: X0, top: 576, width: 10 * IN * ext + 10, height: 52, overflow: "hidden", background: "linear-gradient(180deg,#f7d23a,#e2b414)", boxShadow: "0 8px 14px rgba(0,0,0,.5)", borderRadius: 3 }}>
      {Array.from({ length: 41 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * IN / 4, top: 0, width: 2, height: i % 4 === 0 ? 22 : 11, background: "#1a1408" }} />)}
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i + 1) * IN - 14, top: 22, fontFamily: FONT, fontWeight: 900, fontSize: 26, color: i === 9 ? "#b8221a" : "#1a1408", textShadow: i === 9 ? `0 0 ${14 * ten}px rgba(255,80,40,${ten})` : "none" }}>{i + 1}</div>)}
    </div>
    <Glint tt={tt} at={2.45} x={X0 + 10 * IN} y={600} r={90} />
    <Spr id="sp_egg_fried" tt={tt} at={3.2} x={960} y={590} w={300} />
  </>;
}}</Stage>;

// 35 · LAS MONEDAS QUE QUEDARON: la lata roja tumbada en la mesa suelta las monedas de a una y el contador frena en $1.07
export const SCount: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 60%, #2a2016, #080706 75%)">{(tt) => {
  const N = 14, AT = Array.from({ length: N }, (_, k) => 1.4 + 5.5 * (1 - Math.pow(1 - k / (N - 1), 1.4))), land = AT.filter((a) => tt > a + 0.45).length;
  return <>
    <Planks y={560} />
    <Spr id="sp_r3_coffee_can_tip" tt={tt} at={0.3} x={640} y={720} w={520} />
    {AT.map((a, k) => { const p = eio(tt, a, a + 0.45); if (p <= 0) return null; const x1 = 960 + rnd(k, 3) * 460, y1 = 720 + rnd(k, 4) * 190, x = 860 + (x1 - 860) * p, y = 740 + (y1 - 740) * p - 90 * Math.sin(p * Math.PI), d = Math.max(0, tt - a - 0.45), sq = 0.15 * Math.exp(-9 * d) * Math.sin(d * 34); return <div key={k} style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}><Img src={spr("sp_r3_coin_one")} style={{ position: "absolute", left: -38, top: -38, width: 76, transform: `scaleY(${0.55 * (1 - sq)}) rotate(${rnd(k) * 360 + 400 * (1 - p)}deg)`, filter: "drop-shadow(0 6px 6px rgba(0,0,0,.55))" }} /></div>; })}
    <OdoV v={1.07 * land / N} x={1440} y={360} op={eio(tt, 0.8, 1.3)} size={150} />
  </>;
}}</Stage>;

export const HA3: Record<string, C> = {
  d_mud: SMud, d_jobs: SJobs, d_grid: SGrid, d_seal: SSeal, d_receipt: SReceipt, d_flap: SFlap, d_micro: SMicro, d_chain: SChain,
  d_cubes: SCubes, d_swell: SSwell, d_palm: SPalm, d_slide: SSlide, d_flip: SFlip, d_rail: SRail, d_toss: SToss, d_spoon: SSpoon,
  d_italy: SItaly, d_crowd: SCrowd, d_wrap: SWrap, d_greasecan: SGreaseCan, d_smash: SSmash, d_pierogi: SPierogi, d_burn: SBurn,
  d_postcard: SPostcard, d_shrink: SShrink, d_tally: STally, d_bread: SBread, d_cleanout: SCleanout, d_chalk: SChalk,
  d_bagbox: SBagBox, d_three: SThree, d_onefire: SOneFire, d_family: SFamily, d_size: SSize, d_count: SCount,
};
