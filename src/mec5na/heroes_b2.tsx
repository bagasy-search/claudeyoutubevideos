// ola1_B · componentes únicos nuevos 2 (rompecabezas, radar, podio, cartel LED, fichero, semáforo, dado, vela, cajón, rotuladora).
import React from "react";
import { AMB, DIM, GRN, H, HAND, MARK, Photo, RED, Shadow, Sheen, Stage, TX, Tag, cl, eIn, eio, img, phys } from "./hkit";
import { Img } from "remotion";

export type HP = { t: number; h: H };
type It = { t: string; img?: string; at: number; ok?: boolean | string; n?: string };
const it = (h: H) => (h.items ?? []) as It[];

// ---------- 11 · ROMPECABEZAS: 6 piezas de la foto vuelan desde afuera y encastran; la última cierra la idea ----------
export const HPuzzle: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const W = 1050, Hh = 600, C = 3, R = 2, pw = W / C, ph = Hh / R, x0 = 960 - W / 2, y0 = 500 - Hh / 2;
  const from = [[-900, -300], [0, -800], [900, -300], [-900, 400], [0, 800], [900, 400]];
  return <>
    {Array.from({ length: C * R }, (_, i) => {
      const c = i % C, r = Math.floor(i / C), k = phys(tt, 0.4 + i * 0.32, 6, 0.6), [fx, fy] = from[i];
      return <div key={i} style={{ position: "absolute", left: x0 + c * pw, top: y0 + r * ph, width: pw, height: ph, overflow: "hidden", transform: `translate(${fx * (1 - k)}px, ${fy * (1 - k)}px) rotate(${(1 - k) * (i % 2 ? 40 : -40)}deg)`, opacity: cl(k * 3), boxShadow: k < 0.98 ? "0 30px 60px rgba(0,0,0,.6)" : "none", outline: k < 0.98 ? "2px solid rgba(255,255,255,.4)" : "1px solid rgba(0,0,0,.25)" }}>
        {h.img && <Img src={img(h.img)} style={{ position: "absolute", left: -c * pw, top: -r * ph, width: W, height: Hh, objectFit: "cover" }} />}
      </div>;
    })}
    <div style={{ position: "absolute", left: x0, top: y0, width: W, height: Hh, pointerEvents: "none" }}><Sheen p={cl((tt - 2.4) / 1.2)} o={0.3} /></div>
    <Shadow x={960} y={y0 + Hh + 30} w={W} />
    <Tag tt={tt} at={2.5} x={960} y={y0 + Hh + 100} txt={h.lab ?? ""} col={AMB} size={50} />
  </>;
}}</Stage>;

// ---------- 12 · RADAR: el barrido verde gira y cada punto que toca se enciende con su nombre ----------
export const HRadar: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(circle at 50% 50%, #062014, #010805 75%)">{(tt) => {
  const xs = it(h).slice(0, 6), ang = (tt * 110) % 360, R = 400, cx = 960, cy = 520;
  const pos = [[0.55, 30], [0.8, 110], [0.4, 175], [0.7, 235], [0.9, 290], [0.3, 330]];
  return <>
    {[1, 0.75, 0.5, 0.25].map((s, i) => <div key={i} style={{ position: "absolute", left: cx - R * s, top: cy - R * s, width: 2 * R * s, height: 2 * R * s, borderRadius: "50%", border: "2px solid rgba(80,255,150,.28)" }} />)}
    <div style={{ position: "absolute", left: cx - R, top: cy - 1, width: 2 * R, height: 2, background: "rgba(80,255,150,.2)" }} />
    <div style={{ position: "absolute", left: cx - 1, top: cy - R, width: 2, height: 2 * R, background: "rgba(80,255,150,.2)" }} />
    <div style={{ position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, borderRadius: "50%", background: `conic-gradient(from ${ang - 60}deg, transparent 0deg, rgba(80,255,150,.35) 60deg, transparent 61deg)` }} />
    {xs.map((x, i) => {
      const [rr, a] = pos[i], px = cx + R * rr * Math.cos((a - 90) * Math.PI / 180), py = cy + R * rr * Math.sin((a - 90) * Math.PI / 180);
      const seen = tt > 0.3 + (a / 110), k = phys(tt, 0.3 + a / 110, 8, 0.5), glow = seen ? 0.5 + 0.5 * Math.cos(((ang - a + 360) % 360) * Math.PI / 180 / 2) : 0;
      return seen ? <React.Fragment key={i}>
        <div style={{ position: "absolute", left: px - 14, top: py - 14, width: 28, height: 28, borderRadius: "50%", background: x.ok === false ? RED : "#5dff9a", boxShadow: `0 0 ${20 + 30 * glow}px ${x.ok === false ? RED : "#5dff9a"}`, transform: `scale(${k})` }} />
        <div style={{ position: "absolute", left: px + (px > cx ? 30 : -30), top: py, transform: `translate(${px > cx ? 0 : -100}%, -50%)`, fontWeight: 900, fontSize: 34, color: TX, opacity: cl(k), whiteSpace: "nowrap", textShadow: "0 4px 16px #000" }}>{x.t}</div>
      </React.Fragment> : null;
    })}
    {h.lab && <Tag tt={tt} at={3.3} x={960} y={1000} txt={h.lab} col="#5dff9a" size={44} />}
  </>;
}}</Stage>;

// ---------- 13 · PODIO: 3 escalones suben de a uno con su foto; el primero sube último y brilla ----------
export const HPodium: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const xs = it(h).slice(0, 3), order = [1, 2, 0], hs = [380, 270, 190], xsP = [960, 600, 1320];
  return <>
    {order.map((idx, j) => {
      const x = xs[idx]; if (!x) return null;
      const k = phys(tt, 0.4 + j * 0.8, 6, 0.55), Hh = hs[idx] * cl(k), X = xsP[idx];
      return <React.Fragment key={idx}>
        <div style={{ position: "absolute", left: X - 170, top: 900 - Hh, width: 340, height: Hh, background: idx === 0 ? "linear-gradient(180deg,#e9c46a,#a77a22)" : idx === 1 ? "linear-gradient(180deg,#d9dde2,#8e959d)" : "linear-gradient(180deg,#d39b6a,#8a5a30)", borderRadius: "14px 14px 0 0", boxShadow: "0 30px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
          <div style={{ textAlign: "center", fontWeight: 900, fontSize: 120, color: "rgba(0,0,0,.35)", marginTop: 10 }}>{idx + 1}</div>
          <Sheen p={cl((tt - 1 - j * 0.8) / 1.2)} o={0.35} />
        </div>
        <div style={{ position: "absolute", left: X - 140, top: 900 - Hh - 300, opacity: cl(k * 1.5), transform: `scale(${0.8 + 0.2 * cl(k)})` }}>
          <Photo id={x.img} w={280} h={230} r={16} />
          <div style={{ marginTop: 10, textAlign: "center", fontWeight: 900, fontSize: 32, color: idx === 0 ? AMB : TX, width: 280 }}>{x.t}</div>
        </div>
      </React.Fragment>;
    })}
    {tt > 2.6 && <div style={{ position: "absolute", left: 960 - 300, top: 100, width: 600, height: 500, background: "radial-gradient(ellipse at 50% 70%, rgba(255,210,120,.25), transparent 70%)", opacity: cl((tt - 2.6) * 2) }} />}
    <Shadow x={960} y={905} w={1300} />
  </>;
}}</Stage>;

// ---------- 14 · CARTEL LED: puntitos ámbar que se prenden y la frase corre de derecha a izquierda ----------
export const HLed: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="shutter" bg="#050405">{(tt) => {
  const txt = String(h.lab ?? ""), W = 1500, fs = Math.min(190, (W * 0.92) / Math.max(1, txt.length * 0.74)), tw = txt.length * fs * 0.74, cx = (W - tw) / 2, left = W + (cx - W) * eio(tt, 0.4, 2.2);
  return <>
    <div style={{ position: "absolute", left: 960 - W / 2 - 30, top: 380, width: W + 60, height: 300, borderRadius: 24, background: "#120d08", boxShadow: "0 50px 100px rgba(0,0,0,.8), inset 0 0 0 10px #2a2016" }} />
    <div style={{ position: "absolute", left: 960 - W / 2, top: 410, width: W, height: 240, overflow: "hidden", backgroundImage: "radial-gradient(circle, rgba(255,160,60,.12) 4px, transparent 5px)", backgroundSize: "16px 16px" }}>
      <div style={{ position: "absolute", left, top: 120 - fs * 0.55, fontWeight: 900, fontSize: fs, lineHeight: 1, whiteSpace: "nowrap", color: "#ffa23c", textShadow: "0 0 20px #ff8a1c, 0 0 50px #ff6a00", letterSpacing: 6 }}>{txt}</div>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(90deg, #120d08 3px, transparent 3px), linear-gradient(#120d08 3px, transparent 3px)", backgroundSize: "16px 16px" }} />
    </div>
    {h.sub && <Tag tt={tt} at={1.4} x={960} y={760} txt={h.sub} col={DIM} size={40} />}
  </>;
}}</Stage>;

// ---------- 15 · FICHERO: la cajita de fichas de receta; las fichas se levantan de a una con su título ----------
export const HIndexBox: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const xs = it(h).slice(0, 5);
  return <>
    {xs.map((x, i) => {
      const up = phys(tt, 0.6 + i * 0.6, 7, 0.5), done = i < xs.length - 1 && tt > 1.1 + (i + 1) * 0.6, y = 520 - 260 * up + (done ? 40 : 0), z = i;
      return <div key={i} style={{ position: "absolute", left: 620 + i * 18, top: y - i * 12, width: 680, height: 420, background: "linear-gradient(180deg,#fffdf6,#f1ead8)", borderRadius: 12, boxShadow: "0 20px 40px rgba(0,0,0,.45)", zIndex: z, padding: "30px 40px", transform: `rotate(${(i - 2) * 1.5}deg)` }}>
        <div style={{ height: 3, background: "#d65b5b", marginBottom: 18 }} />
        {Array.from({ length: 6 }, (_, j) => <div key={j} style={{ height: 2, background: "rgba(80,120,200,.35)", marginTop: 46 }} />)}
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#2a2520" }}>{x.t}</div>
        {x.img && <div style={{ position: "absolute", right: 30, top: 110, transform: "rotate(4deg)" }}><Photo id={x.img} w={250} h={200} r={6} /></div>}
      </div>;
    })}
    <div style={{ position: "absolute", left: 560, top: 640, width: 840, height: 330, borderRadius: "10px 10px 30px 30px", background: "linear-gradient(180deg,#8a5a34,#5b3a20)", boxShadow: "0 50px 100px rgba(0,0,0,.65), inset 0 6px 0 rgba(255,255,255,.12)", zIndex: 20 }}>
      <div style={{ position: "absolute", left: 340, top: 120, width: 160, height: 60, borderRadius: 8, background: "linear-gradient(180deg,#d9c39a,#a88a58)", textAlign: "center", lineHeight: "60px", fontFamily: HAND, fontSize: 40, color: "#3a2a1a" }}>{h.lab ?? "recetas"}</div>
    </div>
    <Shadow x={980} y={975} w={900} />
  </>;
}}</Stage>;

// ---------- 16 · SEMÁFORO: rojo con lo que no, amarillo con la duda, verde con lo que sí ----------
export const HTraffic: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const L = (h.lights ?? ["NO", "OJO", "SÍ"]) as string[], step = tt < 1.2 ? 0 : tt < 2.2 ? 1 : 2, cols = [RED, "#ffcf3a", GRN];
  return <>
    <div style={{ position: "absolute", left: 960 - 160, top: 120, width: 320, height: 820, borderRadius: 60, background: "linear-gradient(90deg,#1c1c1f,#38383d,#1c1c1f)", boxShadow: "0 60px 120px rgba(0,0,0,.7)" }}>
      {cols.map((c, i) => {
        const on = (h.only != null ? +h.only === i && tt > 1.0 : step === i), k = on ? 1 : 0.12;
        return <div key={i} style={{ position: "absolute", left: 50, top: 50 + i * 255, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #fff, ${c} 40%, #000 120%)`, opacity: k, boxShadow: on ? `0 0 90px 30px ${c}88` : "inset 0 10px 30px #000" }} />;
      })}
      <Sheen p={cl(tt / 3)} r={60} o={0.12} />
    </div>
    {L.map((l, i) => {
      const on = h.only != null ? +h.only === i && tt > 1.0 : step === i;
      return <div key={i} style={{ position: "absolute", left: i === 1 ? 600 : 1180, top: 160 + i * 255 + 110, transform: `translate(${i === 1 ? "-100%" : "0"}, -50%) scale(${on ? 1 : 0.85})`, fontWeight: 900, fontSize: 54, color: on ? cols[i] : "rgba(255,255,255,.25)", whiteSpace: "nowrap" }}>{l}</div>;
    })}
    <Shadow x={960} y={960} w={500} />
  </>;
}}</Stage>;

// ---------- 17 · DADO: el dado rueda por la mesa y cae mostrando el número ----------
const Face: React.FC<{ n: number; s: number; tr: string }> = ({ n, s, tr }) => {
  const P: Record<number, number[][]> = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]] };
  return <div style={{ position: "absolute", width: s, height: s, transform: tr, background: "linear-gradient(145deg,#ffffff,#dcd6cc)", borderRadius: s * 0.16, boxShadow: "inset 0 0 20px rgba(0,0,0,.15)", backfaceVisibility: "hidden" }}>
    {(P[n] ?? P[1]).map(([x, y], i) => <div key={i} style={{ position: "absolute", left: s * (0.2 + x * 0.3) - s * 0.08, top: s * (0.2 + y * 0.3) - s * 0.08, width: s * 0.16, height: s * 0.16, borderRadius: "50%", background: n === 1 ? RED : "#1d1a16" }} />)}
  </div>;
};
export const HDice: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const v = Math.max(1, Math.min(6, +(h.v ?? 6))), s = 260, r = eio(tt, 0.3, 2.0), x = 300 + 660 * r, bounce = Math.abs(Math.sin(r * Math.PI * 3)) * (1 - r) * 200;
  const rx = (1 - r) * 900, ry = (1 - r) * 720;
  return <>
    <div style={{ position: "absolute", left: x - s / 2, top: 560 - s / 2 - bounce, width: s, height: s, perspective: 1600 }}>
      <div style={{ position: "absolute", width: s, height: s, transformStyle: "preserve-3d", transform: `rotateX(${rx - 12}deg) rotateY(${ry + 18}deg)` }}>
        <Face n={v} s={s} tr={`translateZ(${s / 2}px)`} />
        <Face n={7 - v} s={s} tr={`rotateY(180deg) translateZ(${s / 2}px)`} />
        <Face n={v === 2 || v === 5 ? 3 : 2} s={s} tr={`rotateY(90deg) translateZ(${s / 2}px)`} />
        <Face n={v === 2 || v === 5 ? 4 : 5} s={s} tr={`rotateY(-90deg) translateZ(${s / 2}px)`} />
        <Face n={v === 1 || v === 6 ? 4 : 1} s={s} tr={`rotateX(90deg) translateZ(${s / 2}px)`} />
        <Face n={v === 1 || v === 6 ? 3 : 6} s={s} tr={`rotateX(-90deg) translateZ(${s / 2}px)`} />
      </div>
    </div>
    <Shadow x={x} y={560 + s / 2 + 10} w={s * 1.3} k={1 - bounce / 200} />
    <Tag tt={tt} at={2.2} x={960} y={900} txt={h.lab ?? ""} col={AMB} size={50} />
  </>;
}}</Stage>;

// ---------- 18 · VELA: la vela se consume mientras corre el tiempo; la llama tiembla suave (≤2 Hz) ----------
export const HCandle: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 55%, #2a1c10, #060403 70%)">{(tt) => {
  const burn = eio(tt, 0.6, Math.max(2.5, h.out - h.at - 1)), Hh = 520 - 300 * burn, fl = 1 + 0.06 * Math.sin(tt * 2 * Math.PI * 1.6);
  return <>
    <div style={{ position: "absolute", left: 960 - 500, top: 900 - Hh - 600, width: 1000, height: 1000, background: "radial-gradient(circle at 50% 40%, rgba(255,190,90,.22), transparent 55%)" }} />
    <div style={{ position: "absolute", left: 960 - 90, top: 900 - Hh, width: 180, height: Hh, borderRadius: "16px 16px 6px 6px", background: "linear-gradient(90deg,#d8cbb0,#fbf3e2 45%,#c9b995)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 30, top: 0, width: 26, height: 70 + 50 * burn, borderRadius: "0 0 13px 13px", background: "#efe4cc" }} />
    </div>
    <div style={{ position: "absolute", left: 960 - 3, top: 900 - Hh - 34, width: 6, height: 36, background: "#2a1d12" }} />
    <div style={{ position: "absolute", left: 960 - 34, top: 900 - Hh - 150, width: 68, height: 130, borderRadius: "50% 50% 50% 50% / 65% 65% 35% 35%", background: "radial-gradient(ellipse at 50% 75%, #fff8d0, #ffbd45 45%, rgba(255,90,20,.0) 75%)", transform: `scaleY(${fl}) scaleX(${2 - fl})`, transformOrigin: "50% 100%", filter: "blur(1px)" }} />
    <div style={{ position: "absolute", left: 960 - 160, top: 900, width: 320, height: 40, borderRadius: "50%", background: "linear-gradient(180deg,#8a7a5a,#4a3a22)" }} />
    <Shadow x={960} y={945} w={480} />
    <Tag tt={tt} at={0.9} x={1340} y={560} txt={h.lab ?? ""} col={AMB} size={54} anchor="l" />
    {h.sub && <Tag tt={tt} at={1.6} x={1340} y={630} txt={h.sub} col={DIM} size={Math.min(34, Math.floor(400 / (h.sub.length * 0.66)))} anchor="l" />}
  </>;
}}</Stage>;

// ---------- 19 · CAJÓN: el cajón se abre y adentro están las cosas, una al lado de la otra, con su nombre ----------
export const HDrawer: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="shutter">{(tt) => {
  const op = phys(tt, 0.4, 5, 0.7), xs = it(h).slice(0, 4);
  return <>
    <div style={{ position: "absolute", left: 360, top: 140, width: 1200, height: 380, background: "linear-gradient(180deg,#6b4a2e,#4a321f)", borderRadius: 16, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 360 - 60 * op, top: 300 + 260 * op, width: 1200 + 120 * op, height: 340 + 120 * op, perspective: 1800 }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#2a1d12,#3d2a1a)", borderRadius: 10, transform: "rotateX(48deg)", transformOrigin: "50% 100%", boxShadow: "inset 0 30px 60px rgba(0,0,0,.7)" }}>
        {xs.map((x, i) => {
          const k = phys(tt, 0.9 + i * 0.4, 7, 0.5);
          return <div key={i} style={{ position: "absolute", left: 60 + i * ((1200 + 120 * op - 120) / Math.max(1, xs.length)), top: 40, width: (1200 + 120 * op - 160) / Math.max(1, xs.length), transform: `translateY(${(1 - k) * 50}px)`, opacity: cl(k * 2) }}>
            <Photo id={x.img} w={(1200 + 120 * op - 200) / Math.max(1, xs.length)} h={200} r={12} />
          </div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -10, height: 120, background: "linear-gradient(180deg,#7a5536,#5b3d24)", borderRadius: 12, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", left: "50%", top: 40, width: 200, height: 34, marginLeft: -100, borderRadius: 17, background: "linear-gradient(180deg,#e2c48a,#9a7a3e)" }} />
      </div>
    </div>
    {xs.map((x, i) => <Tag key={i} tt={tt} at={1.1 + i * 0.4} x={360 - 60 * op + 60 + (i + 0.5) * ((1200 + 120 * op - 120) / Math.max(1, xs.length))} y={1010} txt={x.t} col={TX} size={32} />)}
  </>;
}}</Stage>;

// ---------- 20 · ROTULADORA: la cinta sale de la maquinita con las letras en relieve ----------
export const HEmboss: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const txt = String(h.lab ?? ""), n = Math.floor(cl((tt - 0.5) / Math.max(1.2, txt.length * 0.07)) * txt.length), fz = txt.length > 18 ? 70 : txt.length > 12 ? 84 : 104, cw = fz * 0.71, w = 120 + n * cw, sh = Math.max(0, 80 - (1240 - (120 + txt.length * cw)));
  return <>
    <div style={{ position: "absolute", left: 1960 - 720 - w + sh, top: 470, height: 140, width: w, background: h.bad ? "linear-gradient(180deg,#d8322a,#9e1c16)" : "linear-gradient(180deg,#2c62c9,#173d86)", borderRadius: 8, boxShadow: "0 24px 50px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 40, fontWeight: 900, fontSize: fz, letterSpacing: 6, color: "#f4f4f4", textShadow: "0 3px 0 rgba(0,0,0,.35), 0 -2px 0 rgba(255,255,255,.4)", whiteSpace: "pre" }}>{txt.slice(0, n)}</div>
    <div style={{ position: "absolute", left: 1960 - 760 + sh, top: 340, width: 520, height: 420, borderRadius: "80px 160px 80px 80px", background: "linear-gradient(160deg,#ffcf3a,#d69a10)", boxShadow: "0 50px 100px rgba(0,0,0,.65), inset 0 6px 0 rgba(255,255,255,.3)", transform: `rotate(${n < txt.length ? Math.sin(tt * 30) * 0.6 : 0}deg)` }}>
      <div style={{ position: "absolute", left: 150, top: 110, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #3a3a3a, #111)", boxShadow: "inset 0 0 0 14px #222" }} />
      <Sheen p={cl(tt / 2)} r={80} o={0.25} />
    </div>
    <Shadow x={960} y={790} w={1500} />
    {h.sub && <Tag tt={tt} at={0.8 + txt.length * 0.07} x={960} y={870} txt={h.sub} col={DIM} size={36} />}
  </>;
}}</Stage>;
