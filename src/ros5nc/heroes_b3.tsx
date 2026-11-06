// ola1_B · componentes únicos nuevos 3 (globo con países, rayos X, foto que se despega, antes/después con cortina, árbol de ramas,
// embudo, cinta transportadora, puerta de bóveda, letrero de neón, cadena con eslabón débil).
import React from "react";
import { AMB, DIM, GRN, H, HAND, MARK, Photo, RED, Shadow, Sheen, Stage, TX, Tag, cl, eIn, eio, img, phys } from "./hkit";
import { Img } from "remotion";

export type HP = { t: number; h: H };
type It = { t: string; img?: string; at: number; ok?: boolean | string; n?: string; lat?: number; lon?: number };
const it = (h: H) => (h.items ?? []) as It[];

// ---------- 21 · GLOBO: la Tierra gira y de cada país que mandó un comentario sale un globito ----------
export const HGlobe: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(circle at 50% 50%, #0d1830, #03060d 75%)">{(tt) => {
  const xs = it(h).slice(0, 5), R = 330, cx = 960, cy = 540, rot = tt * 14;
  const pts = [[-0.45, 0.1], [0.35, -0.3], [-0.2, -0.5], [0.5, 0.25], [0.05, 0.45]];
  return <>
    <div style={{ position: "absolute", left: cx - R - 40, top: cy - R - 40, width: 2 * R + 80, height: 2 * R + 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,180,255,.25), transparent 70%)" }} />
    <div style={{ position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 35% 30%, #4d8fd6, #1a4a8a 55%, #0a1f40)", boxShadow: "inset -60px -40px 120px rgba(0,0,0,.7)" }}>
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((i * 190 - rot * 6) % 1330) - 340, top: 60 + (i * 97) % 480, width: 220 + (i * 53) % 160, height: 120 + (i * 31) % 120, borderRadius: "45% 55% 40% 60%", background: "#5fa36a", opacity: 0.85, filter: "blur(2px)" }} />)}
      {Array.from({ length: 6 }, (_, i) => <div key={"l" + i} style={{ position: "absolute", left: 0, right: 0, top: (i + 1) * (2 * R / 7), height: 1, background: "rgba(255,255,255,.12)" }} />)}
    </div>
    {xs.map((x, i) => {
      const [px, py] = pts[i], k = phys(tt, 0.6 + i * 0.5, 7, 0.5), X = cx + px * R, Y = cy + py * R;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: X - 10, top: Y - 10, width: 20, height: 20, borderRadius: "50%", background: AMB, boxShadow: `0 0 20px ${AMB}`, transform: `scale(${k})` }} />
        <div style={{ position: "absolute", left: X + (px > 0 ? 40 : -40) + (px > 0 ? 160 : -160) * k, top: Y - 60 * k, transform: `translate(${px > 0 ? 0 : -100}%, -50%) scale(${0.6 + 0.4 * k})`, opacity: cl(k * 2), background: "#fbf7ee", color: "#1d1a16", borderRadius: 18, padding: "14px 22px", fontWeight: 900, fontSize: 32, whiteSpace: "nowrap", boxShadow: "0 18px 40px rgba(0,0,0,.6)" }}>{x.t}</div>
      </React.Fragment>;
    })}
    {h.lab && <Tag tt={tt} at={1 + xs.length * 0.5} x={960} y={1000} txt={h.lab} col={AMB} size={42} />}
  </>;
}}</Stage>;

// ---------- 22 · RAYOS X: una barra de escaneo cruza la foto y deja ver por dentro (la segunda foto) ----------
export const HXray: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="#04070a">{(tt) => {
  const W = 1200, Hh = 680, x0 = 360, y0 = 180, p = eio(tt, 0.5, 2.6), sx = x0 + W * p;
  const inner = h.img2 ?? h.img;
  return <>
    <div style={{ position: "absolute", left: x0, top: y0, width: W, height: Hh, borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.7)" }}>
      {h.img && <Img src={img(h.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      <div style={{ position: "absolute", left: 0, top: 0, width: W * p, height: Hh, overflow: "hidden" }}>
        {inner && <Img src={img(inner)} style={{ width: W, height: Hh, objectFit: "cover", filter: h.img2 ? "none" : "grayscale(1) invert(1) contrast(1.6) sepia(1) hue-rotate(160deg) saturate(2.5)" }} />}
      </div>
    </div>
    <div style={{ position: "absolute", left: sx - 4, top: y0 - 20, width: 8, height: Hh + 40, background: "#7ff7ff", boxShadow: "0 0 40px 10px rgba(127,247,255,.6)", opacity: p > 0 && p < 1 ? 1 : 0 }} />
    <Tag tt={tt} at={2.8} x={960} y={y0 + Hh + 80} txt={h.lab ?? ""} col="#7ff7ff" size={46} />
  </>;
}}</Stage>;

// ---------- 23 · FOTO QUE SE DESPEGA: la esquina se levanta como calcomanía y abajo está la verdad ----------
export const HPeel: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => {
  const W = 1100, Hh = 640, x0 = 410, y0 = 200, c = 0.78 * eio(tt, 1.0, 2.6), ax = W * (1 - c), ay = Hh * (1 - c);
  const clip = `polygon(0 0, ${W}px 0, ${W}px ${ay}px, ${ax}px ${Hh}px, 0 ${Hh}px)`;
  return <>
    <div style={{ position: "absolute", left: x0, top: y0 }}><Photo id={h.img2} w={W} h={Hh} r={18} /></div>
    <div style={{ position: "absolute", left: x0, top: y0, width: W, height: Hh, clipPath: clip }}><Photo id={h.img} w={W} h={Hh} r={18} /></div>
    {c > 0.01 && <div style={{ position: "absolute", left: x0, top: y0, width: W, height: Hh, clipPath: `polygon(${ax}px ${Hh}px, ${W}px ${ay}px, ${ax}px ${ay}px)`, background: "linear-gradient(135deg,#bdb5a6,#f6f1e7 70%,#d8d0c0)", filter: "drop-shadow(-20px -20px 30px rgba(0,0,0,.5))" }} />}
    <Tag tt={tt} at={0.3} x={x0 + 40} y={y0 - 40} txt={h.a ?? ""} col={DIM} size={36} anchor="l" />
    <Tag tt={tt} at={2.7} x={960} y={y0 + Hh + 80} txt={h.lab ?? ""} col={h.bad ? RED : GRN} size={50} />
  </>;
}}</Stage>;

// ---------- 24 · ANTES / DESPUÉS: una cortina vertical va y viene entre las dos fotos ----------
export const HAntes: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const W = 1300, Hh = 700, x0 = 310, y0 = 170, p = 0.08 + 0.84 * eio(tt, 0.3, 1.6) - 0.42 * eio(tt, 1.8, 2.8);
  const s = cl(p), sx = W * s;
  return <>
    <div style={{ position: "absolute", left: x0, top: y0 }}><Photo id={h.img2} w={W} h={Hh} r={18} /></div>
    <div style={{ position: "absolute", left: x0, top: y0, width: sx, height: Hh, overflow: "hidden", borderRadius: "18px 0 0 18px" }}><Photo id={h.img} w={W} h={Hh} r={18} /></div>
    <div style={{ position: "absolute", left: x0 + sx - 3, top: y0, width: 6, height: Hh, background: "#fff", boxShadow: "0 0 20px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: x0 + sx - 38, top: y0 + Hh / 2 - 38, width: 76, height: 76, borderRadius: "50%", background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 36, color: "#222" }}>⇆</div>
    <Tag tt={tt} at={0.4} x={x0 + 160} y={y0 + 60} txt={h.a ?? "ANTES"} col={RED} size={44} />
    <Tag tt={tt} at={0.6} x={x0 + W - 180} y={y0 + 60} txt={h.b ?? "DESPUÉS"} col={GRN} size={44} />
    {h.lab && <Tag tt={tt} at={2.2} x={960} y={y0 + Hh + 70} txt={h.lab} col={AMB} size={44} />}
  </>;
}}</Stage>;

// ---------- 25 · ÁRBOL: de un tronco salen ramas y en cada rama brota una hoja con un resultado ----------
export const HBranches: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const xs = it(h).slice(0, 6), trunk = eio(tt, 0.2, 1.0);
  const br = [[-1, 0.62], [1, 0.55], [-1, 0.4], [1, 0.32], [-1, 0.2], [1, 0.12]];
  return <>
    <div style={{ position: "absolute", left: 960 - 34, top: 980 - 760 * trunk, width: 68, height: 760 * trunk, borderRadius: 30, background: "linear-gradient(90deg,#3a2414,#6b4426,#3a2414)" }} />
    {xs.map((x, i) => {
      const [sd, yy] = br[i], k = eio(tt, 0.9 + i * 0.35, 1.5 + i * 0.35), lf = phys(tt, 1.4 + i * 0.35, 7, 0.5), y = 980 - 760 * (1 - yy) * 1, len = 330;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: 960, top: y, width: len * k, height: 22, borderRadius: 11, background: "linear-gradient(180deg,#6b4426,#3a2414)", transformOrigin: "0 50%", transform: `rotate(${sd > 0 ? -22 : 202}deg)` }} />
        <div style={{ position: "absolute", left: 960 + sd * (len * 0.95), top: y - len * 0.4, transform: `translate(-50%,-50%) scale(${lf})`, background: x.ok === false ? "linear-gradient(160deg,#c7593a,#7a2a14)" : "linear-gradient(160deg,#6fc46a,#2e7a32)", borderRadius: "60% 10% 60% 10%", padding: "22px 34px", fontWeight: 900, fontSize: 32, color: "#fff", whiteSpace: "nowrap", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>{x.t}</div>
      </React.Fragment>;
    })}
    <Shadow x={960} y={990} w={500} />
    {h.lab && <Tag tt={tt} at={0.6} x={960} y={1030} txt={h.lab} col={AMB} size={40} />}
  </>;
}}</Stage>;

// ---------- 26 · EMBUDO: los ingredientes caen al embudo y abajo sale el resultado ----------
export const HFunnel: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const xs = it(h).slice(0, 5), end = 0.6 + xs.length * 0.5 + 0.6, out = phys(tt, end, 6, 0.5);
  return <>
    {xs.map((x, i) => {
      const a = 0.6 + i * 0.5, f = eIn(tt, a, a + 0.8), x0 = 600 + i * 180, X = x0 + (960 - x0) * f, Y = 80 + 380 * f, s = 1 - 0.7 * f;
      return f < 1 ? <div key={i} style={{ position: "absolute", left: X, top: Y, transform: `translate(-50%,-50%) scale(${s}) rotate(${f * 90 * (i % 2 ? 1 : -1)}deg)`, opacity: tt > a - 0.3 ? 1 : 0 }}>
        {x.img ? <Photo id={x.img} w={190} h={150} r={14} /> : <div style={{ background: "#fbf7ee", color: "#1d1a16", padding: "14px 22px", borderRadius: 14, fontWeight: 900, fontSize: 34, whiteSpace: "nowrap" }}>{x.t}</div>}
      </div> : null;
    })}
    <div style={{ position: "absolute", left: 960 - 360, top: 380, width: 720, height: 300, clipPath: "polygon(0 0, 100% 0, 58% 100%, 42% 100%)", background: "linear-gradient(90deg,#8a8f96,#e4e7ea 45%,#7b8087)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 960 - 58, top: 676, width: 116, height: 90, background: "linear-gradient(90deg,#7b8087,#d4d7da,#7b8087)" }} />
    <div style={{ position: "absolute", left: 960, top: 800 + 60 * (1 - out), transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * out})`, opacity: cl(out * 2), background: AMB, color: "#1d1206", padding: "18px 40px", borderRadius: 20, fontWeight: 900, fontSize: 56, whiteSpace: "nowrap", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>{h.lab ?? ""}</div>
    <Shadow x={960} y={890} w={600} />
  </>;
}}</Stage>;

// ---------- 27 · CINTA TRANSPORTADORA: las cosas pasan por la cinta; las malas caen por la tolva, las buenas siguen ----------
export const HConveyor: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="shutter">{(tt) => {
  const xs = it(h).slice(0, 6), sp = 330;
  return <>
    <div style={{ position: "absolute", left: 80, right: 80, top: 640, height: 60, borderRadius: 30, background: "repeating-linear-gradient(90deg,#2a2a2e 0 40px,#3a3a40 40px 80px)", backgroundPosition: `${-tt * sp}px 0`, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 110 + i * 210, top: 700, width: 50, height: 50, borderRadius: "50%", background: "radial-gradient(circle,#888,#333)", transform: `rotate(${tt * 300}deg)` }} />)}
    <div style={{ position: "absolute", left: 1180, top: 700, width: 220, height: 300, background: "linear-gradient(180deg,#1a1a1d,transparent)", clipPath: "polygon(0 0,100% 0,80% 100%,20% 100%)" }} />
    {xs.map((x, i) => {
      const a = 0.3 + i * 0.75, X = -200 + (tt - a) * sp * 1.4, bad = x.ok === false, fall = bad ? eIn(tt, a + (1290 + 200) / (sp * 1.4), a + (1290 + 200) / (sp * 1.4) + 0.5) : 0;
      if (X < -220 || X > 2100) return null;
      const XX = bad && fall > 0 ? 1290 : X;
      return <div key={i} style={{ position: "absolute", left: XX, top: 640 - 170 + fall * 420, transform: `translate(-50%,0) rotate(${fall * 50}deg)`, opacity: 1 - fall * 0.6 }}>
        {x.img ? <Photo id={x.img} w={220} h={160} r={12} /> : <div style={{ width: 220, height: 160, borderRadius: 12, background: "#fbf7ee" }} />}
        <div style={{ marginTop: 8, width: 220, textAlign: "center", fontWeight: 900, fontSize: 28, color: bad ? RED : GRN }}>{x.t}</div>
      </div>;
    })}
    {h.lab && <Tag tt={tt} at={0.6} x={960} y={160} txt={h.lab} col={AMB} size={48} />}
  </>;
}}</Stage>;

// ---------- 28 · BÓVEDA: la puerta redonda de acero gira su volante y se abre hacia el que mira ----------
export const HVault: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const spin = eio(tt, 0.4, 1.8) * 540, op = eio(tt, 1.9, 3.0), R = 360;
  return <>
    <div style={{ position: "absolute", left: 960 - R - 40, top: 520 - R - 40, width: 2 * R + 80, height: 2 * R + 80, borderRadius: "50%", background: "radial-gradient(circle,#0d0d0f 60%,#3a3a3e 61%,#1c1c1f)", overflow: "hidden" }}>
      {h.img && <Img src={img(h.img)} style={{ position: "absolute", inset: 40, width: 2 * R, height: 2 * R, borderRadius: "50%", objectFit: "cover", opacity: op }} />}
    </div>
    <div style={{ position: "absolute", left: 960 - R, top: 520 - R, width: 2 * R, height: 2 * R, perspective: 2400 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #d9dce0, #8a9098 55%, #4a4f56)", boxShadow: "0 50px 120px rgba(0,0,0,.8), inset 0 0 0 26px rgba(0,0,0,.18)", transformOrigin: "0% 50%", transform: `rotateY(${-op * 95}deg)` }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: R - 12, top: 30, width: 24, height: 24, borderRadius: "50%", background: "#5b6068", transformOrigin: `12px ${R - 30}px`, transform: `rotate(${i * 30}deg)` }} />)}
        <div style={{ position: "absolute", left: R - 170, top: R - 170, width: 340, height: 340, transform: `rotate(${spin}deg)` }}>
          {[0, 60, 120].map((a) => <div key={a} style={{ position: "absolute", left: 155, top: 0, width: 30, height: 340, borderRadius: 15, background: "linear-gradient(90deg,#6a6f76,#f0f2f4,#6a6f76)", transform: `rotate(${a}deg)` }} />)}
          <div style={{ position: "absolute", left: 120, top: 120, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff,#8a9098)" }} />
        </div>
        <Sheen p={cl(tt / 2.5)} r={R} o={0.2} />
      </div>
    </div>
    <Tag tt={tt} at={2.9} x={960} y={990} txt={h.lab ?? ""} col={AMB} size={50} />
  </>;
}}</Stage>;

// ---------- 29 · NEÓN: el letrero de tubo parpadea un par de veces (lento) y queda prendido ----------
export const HNeon: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse at 50% 50%, #1a1016, #050305 75%)">{(tt) => {
  const txt = String(h.lab ?? ""), col = h.col ?? "#ff5ab0", on = tt < 0.6 ? 0 : tt < 0.9 ? 1 : tt < 1.3 ? 0.25 : 1, fs = Math.min(200, 1500 / Math.max(1, txt.length * 0.58));
  return <>
    <div style={{ position: "absolute", left: 160, right: 160, top: 300, height: 420, borderRadius: 30, background: "repeating-linear-gradient(90deg,#20161a 0 120px,#1a1215 120px 240px)", boxShadow: "inset 0 0 120px #000" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 510, transform: "translateY(-50%)", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: fs, color: on > 0.5 ? "#fff" : "#4a3a40", textShadow: on > 0.5 ? `0 0 10px ${col}, 0 0 30px ${col}, 0 0 80px ${col}` : "none", opacity: 0.4 + 0.6 * on, whiteSpace: "nowrap" }}>{txt}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 740, height: 200, background: `radial-gradient(ellipse 50% 40% at 50% 0%, ${col}33, transparent 70%)`, opacity: on }} />
    {h.sub && <Tag tt={tt} at={1.6} x={960} y={840} txt={h.sub} col={DIM} size={38} />}
  </>;
}}</Stage>;

// ---------- 30 · CADENA: los eslabones se tensan y el débil (el error) se abre ----------
export const HChain: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const n = 7, weak = +(h.weak ?? 3), pull = eio(tt, 0.4, 1.6), snap = eio(tt, 2.0, 2.5), gap = 210;
  return <>
    {Array.from({ length: n }, (_, i) => {
      const side = i < weak ? -1 : i > weak ? 1 : 0, dx = side * snap * 160, x = 960 + (i - (n - 1) / 2) * gap * (0.95 + 0.05 * pull) + dx, vert = i % 2 === 1;
      const isW = i === weak, shake = isW && snap < 1 ? Math.sin(tt * 30) * 4 * pull : 0;
      return <div key={i} style={{ position: "absolute", left: x - (vert ? 50 : 130), top: 520 - (vert ? 130 : 50) + shake, width: vert ? 100 : 260, height: vert ? 260 : 100, borderRadius: 60, border: `26px solid ${isW ? (snap > 0 ? RED : "#c9b07a") : "#9aa0a8"}`, boxShadow: "0 20px 40px rgba(0,0,0,.6)", clipPath: isW && snap > 0 ? `polygon(0 0, ${50 - snap * 12}% 0, ${50 - snap * 12}% 100%, 0 100%, 0 0, 100% 0, 100% 100%, ${50 + snap * 12}% 100%, ${50 + snap * 12}% 0)` : undefined, transform: isW ? `rotate(${snap * 18}deg)` : undefined }} />;
    })}
    {snap > 0 && Array.from({ length: 8 }, (_, i) => <div key={"s" + i} style={{ position: "absolute", left: 960 + Math.cos(i) * 140 * snap, top: 520 + Math.sin(i * 1.7) * 120 * snap, width: 10, height: 10, borderRadius: "50%", background: AMB, opacity: 1 - snap }} />)}
    <Tag tt={tt} at={2.4} x={960} y={780} txt={h.lab ?? ""} col={RED} size={52} />
    {h.sub && <Tag tt={tt} at={2.8} x={960} y={850} txt={h.sub} col={DIM} size={34} />}
  </>;
}}</Stage>;
