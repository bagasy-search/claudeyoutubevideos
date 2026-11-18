// dee02 · escenas sobre las fotos reales (ideas en D:/rtmp/dee02/ideas.md). Todo es función pura de t (segundos del video).
// Coordenadas en 1920x1080 de la foto; la cámara nunca muestra x>1729 ni y fuera de 53–1027 (estrellita NB fuera de cuadro).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { registerEsc } from "./Body";
import { P, cl, e, eo, lerp, spr } from "./lib";

const W = 1920, H = 1080, XMAX = 1729, Y0 = 53, Y1 = 1027;
const foto = (n: string) => staticFile(P + "g/" + n);
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "fill" };

// cámara: centro (cx,cy) con zoom z, recortada al área segura
const cam = (cx: number, cy: number, z: number) => {
  z = Math.max(1.115, z);
  const vw = W / z, vh = H / z;
  const L = Math.min(Math.max(cx - vw / 2, 0), XMAX - vw), T = Math.min(Math.max(cy - vh / 2, Y0), Y1 - vh);
  return { transformOrigin: "0 0", transform: `translate(${-L * z}px, ${-T * z}px) scale(${z})` } as React.CSSProperties;
};
// curva suave entre claves [t, valor]
const curva = (t: number, ks: [number, number][]) => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) if (t <= ks[i][0]) return lerp(ks[i - 1][1], ks[i][1], e(t, ks[i - 1][0], ks[i][0]));
  return ks[ks.length - 1][1];
};
const poly = (pts: number[][]) => `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(",")})`;
const centro = (pts: number[][]) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];

// ---------- Escena 1 · la canasta: cada producto nombrado se adelanta y se queda adelante
const PROD: { t: number; pts: number[][] }[] = [
  { t: 582.5, pts: [[522,513],[597,510],[603,588],[668,608],[735,630],[768,668],[780,900],[705,918],[600,922],[533,900],[498,675],[510,630],[528,600]] },          // shampoo
  { t: 584.4, pts: [[708,507],[810,501],[822,543],[870,552],[908,578],[922,675],[942,878],[900,915],[795,924],[742,900],[720,780],[702,630],[699,555]] },            // conditioner
  { t: 585.7, pts: [[1365,458],[1418,468],[1422,518],[1418,630],[1388,780],[1358,922],[1290,927],[1222,918],[1212,840],[1245,675],[1290,555],[1320,510],[1342,477]] }, // mousse
  { t: 586.7, pts: [[1287,348],[1338,368],[1347,412],[1320,510],[1230,690],[1155,840],[1118,885],[1058,878],[1023,832],[1035,780],[1102,645],[1185,495],[1252,393]] }, // spray
  { t: 587.8, pts: [[1068,405],[1118,402],[1155,402],[1182,428],[1185,495],[1178,630],[1140,645],[1083,638],[1058,600],[1050,555],[1050,510],[1053,435]] },            // cream
  { t: 588.9, pts: [[1059,245],[1095,255],[1102,293],[1083,323],[1092,390],[1088,518],[1050,548],[983,543],[960,510],[963,405],[990,368],[1035,323],[1044,270]] },     // oil
  { t: 589.8, pts: [[885,552],[908,548],[922,593],[960,623],[990,660],[1008,750],[1005,795],[968,813],[938,810],[908,758],[893,675],[882,600]] },                       // serum
];
const EscCanasta: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const src = foto("dee02_n172.jpg");
  const z = curva(t, [[a, 1.13], [582.2, 1.16], [b + 0.4, 1.24]]);
  const cx = curva(t, [[a, 980], [b + 0.4, 1010]]), cy = curva(t, [[a, 600], [b + 0.4, 640]]);
  const todos = 1 + 0.025 * Math.max(0, spr(t, 590.3, 0.8)) * (t > 590.3 ? 1 : 0);   // "and she puts all of it": el montón entero se adelanta un poco más
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: W, height: H, ...cam(cx, cy, z) }}>
      <Img src={src} style={full} />
      {PROD.map((p, i) => {
        if (t < p.t - 0.05) return null;
        const k = spr(t, p.t - 0.05, 0.9), [ox, oy] = centro(p.pts), s = (1 + 0.075 * k) * todos;
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: `${ox}px ${oy}px`, transform: `translateY(${-14 * k}px) scale(${s})`,
          filter: `drop-shadow(0 ${16 * k}px ${22 * k}px rgba(0,0,0,${0.55 * cl(k)}))` }}>
          <Img src={src} style={{ ...full, clipPath: poly(p.pts) }} />
        </div>;
      })}
    </div>
  </AbsoluteFill>;
};

// ---------- Escena 2 · copias transparentes de las pelotas reales se apoyan sobre la mousse para medirla
const MOUSSE = [922, 562], PING = { c: [1095, 845], r: 100 }, TEN = { c: [1335, 818], r: 134 };
const Fantasma: React.FC<{ src: string; c: number[]; r: number; p: number; op: number; caida?: number }> = ({ src, c, r, p, op, caida = 0 }) => {
  const dx = (MOUSSE[0] - c[0]) * p, dy = (MOUSSE[1] - c[1]) * p + caida;
  return <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: op, transform: `translate(${dx}px, ${dy}px)`,
    filter: "drop-shadow(0 0 10px rgba(255,255,255,.55))" }}>
    <Img src={src} style={{ ...full, clipPath: `circle(${r}px at ${c[0]}px ${c[1]}px)` }} />
  </div>;
};
const EscPelotas: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const src = foto("dee02_n194.jpg");
  const z = curva(t, [[a, 1.13], [649.6, 1.42], [b + 0.4, 1.5]]);
  const cx = curva(t, [[a, 1000], [649.6, 1110], [b + 0.4, 1080]]), cy = curva(t, [[a, 600], [649.6, 700], [b + 0.4, 690]]);
  // ping-pong: sube a la mousse (650.1), se retira cuando entra la de tenis (651.0), vuelve y se queda (652.7)
  const pIda = eo(t, 650.1, 0.6) * (1 - e(t, 650.9, 651.2)) + eo(t, 652.7, 0.55);
  const pOp = 0.62 * (e(t, 650.0, 650.3) * (1 - e(t, 650.9, 651.2)) + e(t, 652.6, 652.9));
  // tenis: sube (651.0), le sobra por todos lados, y en "ball." (652.2) se cae y se apaga
  const tIda = eo(t, 651.0, 0.6), tCae = 260 * Math.pow(cl((t - 652.2) / 0.5), 2), tOp = 0.6 * e(t, 650.95, 651.25) * (1 - e(t, 652.25, 652.7));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: W, height: H, ...cam(cx, cy, z) }}>
      <Img src={src} style={full} />
      {tOp > 0.01 && <Fantasma src={src} c={TEN.c} r={TEN.r} p={tIda} op={tOp} caida={tCae} />}
      {pOp > 0.01 && <Fantasma src={src} c={PING.c} r={PING.r} p={pIda} op={pOp} />}
    </div>
  </AbsoluteFill>;
};

// ---------- Escena 3 · una lupa recorre la cabeza: peine → coronilla → pelitos rotos → dientes del peine
const EscLupa: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const src = foto("dee02_n286.jpg");
  const z = curva(t, [[a, 1.13], [b + 0.4, 1.2]]);
  const lx = curva(t, [[958.5, 1180], [960.8, 1180], [961.8, 1010], [963.3, 1010], [964.3, 1060], [968.2, 1060], [969.0, 1310]]);
  const ly = curva(t, [[958.5, 330], [960.8, 330], [961.8, 230], [963.3, 230], [964.3, 175], [968.2, 175], [969.0, 310]]);
  const m = curva(t, [[958.5, 2.0], [963.3, 2.0], [964.3, 2.7], [968.2, 2.7], [969.0, 2.3]]);
  const r = curva(t, [[958.4, 0], [958.9, 170], [966.2, 170], [966.9, 215], [968.2, 215], [969.0, 180]]) * (1 - e(t, b - 0.25, b + 0.15));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: W, height: H, ...cam(1060, 420, z) }}>
      <Img src={src} style={full} />
      {r > 2 && <>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, clipPath: `circle(${r}px at ${lx}px ${ly}px)` }}>
          <Img src={src} style={{ ...full, transformOrigin: `${lx}px ${ly}px`, transform: `scale(${m})` }} />
        </div>
        <div style={{ position: "absolute", left: lx - r, top: ly - r, width: 2 * r, height: 2 * r, borderRadius: "50%",
          boxShadow: "0 0 0 5px rgba(236,232,224,.85), 0 18px 40px rgba(0,0,0,.45), inset 0 0 26px rgba(255,255,255,.18)" }} />
      </>}
    </div>
  </AbsoluteFill>;
};

// ---------- Escena 4 · los tres ruleros reales giran en orden, de adelante hacia la coronilla
const RUL = [{ c: [1245, 345], r: 40 }, { c: [1305, 300], r: 40 }, { c: [1368, 273], r: 42 }];
const giro = (t: number, a: number) => 360 * eo(t, a, 0.7);
const EscRuleros: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const src = foto("dee02_n384.jpg");
  const z = curva(t, [[a, 1.13], [1285.1, 2.3], [1286.6, 2.45], [1289.9, 2.45], [b + 0.4, 2.1]]);
  const cx = curva(t, [[a, 1000], [1285.1, 1300], [1287.3, 1240], [1289.9, 1370], [b + 0.4, 1310]]);
  const cy = curva(t, [[a, 560], [1285.1, 330], [1287.3, 360], [1289.9, 290], [b + 0.4, 330]]);
  const T1 = [1282.9, 1283.2, 1283.6], T2 = [1288.1, 1289.0, 1289.8];
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: W, height: H, ...cam(cx, cy, z) }}>
      <Img src={src} style={full} />
      {RUL.map((q, i) => {
        const g = giro(t, T1[i]) + giro(t, T2[i]);
        if (g === 0 || g % 360 === 0 && t > T2[i] + 0.8) return null;
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, clipPath: `circle(${q.r}px at ${q.c[0]}px ${q.c[1]}px)` }}>
          <Img src={src} style={{ ...full, transformOrigin: `${q.c[0]}px ${q.c[1]}px`, transform: `rotate(${g}deg)` }} />
        </div>;
      })}
    </div>
  </AbsoluteFill>;
};

registerEsc({ EscCanasta, EscPelotas, EscLupa, EscRuleros });
