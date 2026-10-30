// swl29b · los componentes únicos del video (uno por minuto, ninguno repetido en la tanda: D:/rtmp/swl29_COMPONENTES.md).
// v3 (ronda 1 del evaluador): cada idea es un OBJETO con volumen (cara + canto + brillo + sombra de contacto), apoyado en la mesa,
// que se arma de a partes después de la entrada y no se queda quieto. Una sola palabra por escena, grande y dentro del objeto.
import React from "react";
import { Img } from "remotion";
import { Stage, Tag, Shadow, H, K, cl, phys, eio, eIn, eOut, lerp, rnd, img, SERIF, HAND, MARK, SANS } from "./kit";

const r = (h: H, i: number, d = 0) => (h.b[i] ?? h.at + d) - h.at;   // beat i relativo a la entrada
export const bt = (h: H, lo = 1.0, hi = 3.4) => Math.max(lo, Math.min(hi, r(h, 0, 1.5)));   // la acción principal, dentro de los 6 s
type CP = { t: number; h: H };
const uid = () => "u" + React.useId().replace(/:/g, "");
const A: React.CSSProperties = { position: "absolute" };
const golden = "radial-gradient(ellipse at 38% 30%,#f7c77a,#d68a3a 45%,#8a4a18 85%)";
export const fall = (tt: number, a: number, h0: number, g = 2600) => { const d = tt - a; return d <= 0 ? -h0 : Math.min(0, -h0 + 0.5 * g * d * d); };   // caída con gravedad hasta 0
const bounce = (tt: number, a: number, h0 = 420) => { const d = tt - a; if (d <= 0) return -h0; const T = Math.sqrt(2 * h0 / 2600); if (d < T) return -h0 + 1300 * d * d; const e = d - T; return -Math.abs(Math.sin(e * 9)) * 40 * Math.exp(-e * 6); };

// ───────────────────────── objetos con volumen ─────────────────────────

// muslo visto desde arriba con canto (grosor), poros, pliegues y brillo especular; k = cuánto se doró
const Thigh: React.FC<{ w: number; k?: number; rot?: number; sq?: number; style?: React.CSSProperties }> = ({ w, k = 0, rot = 0, sq = 1, style }) => {
  const id = uid();
  const c = (a: number[], b: number[]) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(",")})`;
  const P = "M28 68 C 22 42, 50 20, 92 18 C 128 16, 154 34, 158 60 C 162 90, 140 120, 98 124 C 56 128, 34 98, 28 68 Z";
  return <div style={{ position: "relative", width: w, height: w * 0.76, transform: `rotate(${rot}deg) scaleY(${sq})`, ...style }}>
    <svg width={w} height={w * 0.76} viewBox="0 0 200 152" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id={id + "s"} cx="40%" cy="32%" r="72%"><stop offset="0%" stopColor={c([255, 236, 216], [252, 214, 130])} /><stop offset="50%" stopColor={c([240, 198, 170], [220, 138, 56])} /><stop offset="100%" stopColor={c([206, 150, 124], [128, 58, 14])} /></radialGradient>
        <pattern id={id + "p"} width="8" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><circle cx="3" cy="3" r="1.1" fill={c([190, 134, 110], [110, 46, 8])} opacity=".5" /><circle cx="6.5" cy="5.6" r=".7" fill={c([190, 134, 110], [100, 40, 6])} opacity=".4" /></pattern>
      </defs>
      <path d={P} transform="translate(0 12)" fill={c([150, 84, 72], [70, 28, 6])} />
      <path d="M150 52 C 170 40, 186 46, 190 56 C 194 66, 184 74, 172 72 Z" fill="#f3ead8" stroke="#cbb994" strokeWidth="2" />
      <path d="M22 70 C 14 40, 46 14, 92 12 C 132 10, 160 30, 166 58 C 172 92, 146 128, 98 132 C 52 136, 28 104, 22 70 Z" fill={c([228, 128, 118], [150, 62, 28])} />
      <path d={P} fill={`url(#${id}s)`} />
      <path d={P} fill={`url(#${id}p)`} />
      <path d="M44 52 C 56 34, 78 28, 100 30" fill="none" stroke={c([255, 248, 238], [255, 240, 190])} strokeWidth="7" strokeLinecap="round" opacity={0.5 + 0.35 * k} />
      <ellipse cx="78" cy="44" rx="16" ry="6" fill="#fff" opacity={0.25 + 0.35 * k} />
      <path d="M60 110 C 80 120, 112 120, 134 104" fill="none" stroke={c([200, 144, 120], [100, 40, 8])} strokeWidth="3" opacity=".5" />
      {k > 0.3 && Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={46 + rnd(i + 2) * 100} cy={36 + rnd(i + 7) * 78} rx={4 + rnd(i) * 6} ry={3 + rnd(i + 1) * 3} fill="#5e2404" opacity={(k - 0.3) * 0.55} />)}
      {k > 0.5 && Array.from({ length: 6 }, (_, i) => <ellipse key={"h" + i} cx={58 + rnd(i + 20) * 74} cy={38 + rnd(i + 30) * 44} rx="5" ry="2" fill="#fff6d8" opacity={(k - 0.5) * 1.3} />)}
    </svg>
  </div>;
};

// sartén de hierro en perspectiva: canto, borde con brillo, fondo con calor (heat 0-1); los hijos van sobre el fondo (coords del div)
const Skillet: React.FC<{ x: number; y: number; w: number; heat?: number; cold?: boolean; children?: React.ReactNode }> = ({ x, y, w, heat = 0, cold, children }) => {
  const id = uid(), h = w * 0.62;
  return <div style={{ ...A, left: x - w / 2, top: y - h / 2, width: w, height: h }}>
    <Shadow x={w / 2} y={h * 0.86} w={w * 1.05} k={1} o={0.75} />
    <svg width={w * 1.5} height={h} viewBox={`0 0 ${w * 1.5} ${h}`} style={{ ...A, left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id={id + "f"} cx="45%" cy="40%" r="65%"><stop offset="0%" stopColor={cold ? "#3a4048" : "#3d3836"} /><stop offset="100%" stopColor={cold ? "#12161a" : "#141110"} /></radialGradient>
        <radialGradient id={id + "h"} cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#ff8a3a" stopOpacity={0.45 * heat} /><stop offset="100%" stopColor="#ff5a1a" stopOpacity="0" /></radialGradient>
        <linearGradient id={id + "r"} x1="0" x2="1"><stop offset="0%" stopColor="#1a1716" /><stop offset="35%" stopColor="#5a5450" /><stop offset="60%" stopColor="#2a2624" /><stop offset="100%" stopColor="#100e0d" /></linearGradient>
      </defs>
      <rect x={w * 0.9} y={h * 0.4} width={w * 0.62} height={w * 0.07} rx={w * 0.035} fill={`url(#${id}r)`} transform={`rotate(-6 ${w * 0.9} ${h * 0.44})`} />
      <ellipse cx={w / 2} cy={h * 0.56} rx={w / 2} ry={h * 0.36} fill="#0b0909" />
      <rect x={0} y={h * 0.44} width={w} height={h * 0.12} fill={`url(#${id}r)`} />
      <ellipse cx={w / 2} cy={h * 0.44} rx={w / 2} ry={h * 0.36} fill={`url(#${id}r)`} />
      <ellipse cx={w / 2} cy={h * 0.46} rx={w * 0.45} ry={h * 0.31} fill={`url(#${id}f)`} />
      <ellipse cx={w / 2} cy={h * 0.46} rx={w * 0.45} ry={h * 0.31} fill={`url(#${id}h)`} />
      <path d={`M ${w * 0.12} ${h * 0.34} Q ${w * 0.3} ${h * 0.1} ${w * 0.62} ${h * 0.1}`} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth={w * 0.012} strokeLinecap="round" />
    </svg>
    <div style={{ ...A, left: w * 0.05, top: h * 0.15, width: w * 0.9, height: h * 0.62 }}>{children}</div>
  </div>;
};

// plato de loza en perspectiva (borde con filete dorado opcional)
const Plate: React.FC<{ x: number; y: number; w: number; gold?: boolean; children?: React.ReactNode }> = ({ x, y, w, gold, children }) => {
  const id = uid(), h = w * 0.5;
  return <div style={{ ...A, left: x - w / 2, top: y - h / 2, width: w, height: h }}>
    <Shadow x={w / 2} y={h * 0.9} w={w} k={1} o={0.6} />
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ ...A, inset: 0, overflow: "visible" }}>
      <defs><radialGradient id={id} cx="42%" cy="38%" r="70%"><stop offset="0%" stopColor="#ffffff" /><stop offset="70%" stopColor="#ece6da" /><stop offset="100%" stopColor="#cfc6b4" /></radialGradient></defs>
      <ellipse cx={w / 2} cy={h * 0.56} rx={w / 2} ry={h * 0.42} fill="#b9b09e" />
      <ellipse cx={w / 2} cy={h * 0.5} rx={w / 2} ry={h * 0.42} fill={`url(#${id})`} />
      {gold && <ellipse cx={w / 2} cy={h * 0.5} rx={w * 0.45} ry={h * 0.37} fill="none" stroke="#d8b25a" strokeWidth={w * 0.012} />}
      <ellipse cx={w / 2} cy={h * 0.52} rx={w * 0.33} ry={h * 0.26} fill="rgba(0,0,0,.05)" />
      <path d={`M ${w * 0.14} ${h * 0.36} Q ${w * 0.3} ${h * 0.14} ${w * 0.56} ${h * 0.12}`} fill="none" stroke="#fff" strokeWidth={w * 0.014} strokeLinecap="round" opacity=".9" />
    </svg>
    <div style={{ ...A, left: w * 0.15, top: h * 0.12, width: w * 0.7, height: h * 0.76 }}>{children}</div>
  </div>;
};

// vapor que sube en volutas
const Steam: React.FC<{ x: number; y: number; tt: number; n?: number; w?: number; k?: number; hgt?: number }> = ({ x, y, tt, n = 6, w = 200, k = 1, hgt = 360 }) => <>{Array.from({ length: n }, (_, i) => {
  const p = ((tt * 0.45 + i / n) % 1), s = 60 + 90 * p;
  return <div key={i} style={{ ...A, left: x - w / 2 + rnd(i) * w + Math.sin(tt * 1.4 + i) * 30 * p - s / 2, top: y - p * hgt - s / 2, width: s, height: s * 1.3, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.42),transparent 68%)", filter: "blur(8px)", opacity: k * Math.sin(p * Math.PI) }} />;
})}</>;

// gota de agua con reflejo
const Drop: React.FC<{ x: number; y: number; s: number; col?: string; o?: number }> = ({ x, y, s, col = "#bfe4ff", o = 1 }) => <svg width={s} height={s * 1.3} viewBox="0 0 20 26" style={{ ...A, left: x - s / 2, top: y - s * 0.65, overflow: "visible", opacity: o }}>
  <path d="M10 1 C 14 9, 18 13, 18 17 A 8 8 0 0 1 2 17 C 2 13, 6 9, 10 1 Z" fill={col} fillOpacity=".75" stroke="rgba(255,255,255,.7)" strokeWidth=".8" />
  <ellipse cx="7" cy="15" rx="2" ry="3" fill="#fff" opacity=".85" />
</svg>;

// mano de Loretta (manga lila) que entra desde un costado; press 0-1 = cuánto aprieta (dedos se cierran)
const Hand: React.FC<{ x: number; y: number; s?: number; rot?: number; press?: number }> = ({ x, y, s = 1, rot = 0, press = 0 }) => {
  const id = uid();
  return <svg width={520 * s} height={300 * s} viewBox="0 0 520 300" style={{ ...A, left: x, top: y, overflow: "visible", transform: `rotate(${rot}deg)`, transformOrigin: "0 50%", filter: "drop-shadow(0 18px 20px rgba(0,0,0,.45))" }}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f2d2b8" /><stop offset="100%" stopColor="#c99a7c" /></linearGradient></defs>
    <path d="M520 80 L 330 96 L 330 210 L 520 230 Z" fill="#b7a0d4" />
    <path d="M330 96 L 300 100 L 300 206 L 330 210 Z" fill="#9c86bc" />
    <path d="M300 104 C 250 96, 190 100, 170 120 L 168 196 C 190 214, 250 214, 300 204 Z" fill={`url(#${id})`} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={70 + press * 50 + i * 4} y={112 + i * 22} width={120 - press * 50} height={22} rx={11} fill={`url(#${id})`} stroke="#b88a6c" strokeWidth="1.5" />)}
    <path d="M250 200 C 220 236, 180 250, 150 246" fill="none" stroke={`url(#${id})`} strokeWidth="26" strokeLinecap="round" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${172 + press * 6} ${118 + i * 22} q 6 6 0 14`} fill="none" stroke="#a87a5e" strokeWidth="2" opacity=".6" />)}
  </svg>;
};

// caja con caras (CSS 3D): frente, tapa y costado
export const Box3: React.FC<{ x: number; y: number; w: number; h: number; d: number; front: string; top: string; side: string; ry?: number; rx?: number; children?: React.ReactNode; lid?: React.ReactNode }> = ({ x, y, w, h, d, front, top, side, ry = -24, rx = -14, children, lid }) => (
  <div style={{ ...A, left: x - w / 2, top: y - h / 2, width: w, height: h, transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}>
    <div style={{ ...A, inset: 0, background: front, transform: `translateZ(${d / 2}px)`, overflow: "hidden" }}>{children}</div>
    <div style={{ ...A, left: 0, top: 0, width: w, height: d, background: top, transformOrigin: "50% 0", transform: `translateZ(${d / 2}px) rotateX(90deg)` }}>{lid}</div>
    <div style={{ ...A, right: 0, top: 0, width: d, height: h, background: side, transformOrigin: "100% 50%", transform: `translateZ(${d / 2}px) rotateY(90deg)` }} />
    <div style={{ ...A, left: 0, top: 0, width: d, height: h, background: side, transformOrigin: "0 50%", transform: `translateZ(${d / 2}px) rotateY(-90deg)`, filter: "brightness(.7)" }} />
  </div>
);

// ───────────────────────── B01-B34 ─────────────────────────

// B01 · ocho en una bandeja: bandeja de espuma en perspectiva, 8 muslos que caen con rebote, el film los cubre y queda UN plato al lado
export const B01Tray: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const film = eio(tt, 2.9, 3.7), one = eio(tt, 4.0, 4.8);
  return <>
    <div style={{ ...A, left: 820 - 480, top: 520, width: 960, height: 420, perspective: 1200 }}>
      <div style={{ ...A, inset: 0, transform: "rotateX(48deg)", transformStyle: "preserve-3d" }}>
        <div style={{ ...A, inset: 0, borderRadius: 50, background: "linear-gradient(180deg,#fbfaf6,#dedad0)", boxShadow: "0 60px 90px rgba(0,0,0,.7), inset 0 0 0 26px #efede7, inset 0 -14px 0 26px #cdc8bd, inset 0 0 60px rgba(0,0,0,.12)" }} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = 0.35 + i * 0.26, y = bounce(tt, a, 520), x = 60 + (i % 4) * 215, yy = 40 + Math.floor(i / 4) * 175;
          return <div key={i} style={{ ...A, left: x, top: yy + y, opacity: tt > a ? 1 : 0 }}><Thigh w={200} rot={-14 + rnd(i) * 28} /></div>;
        })}
        <div style={{ ...A, inset: 10, borderRadius: 44, background: `linear-gradient(${110 + 20 * film}deg, rgba(255,255,255,.0) ${lerp(100, 20, film)}%, rgba(255,255,255,.38) ${lerp(100, 40, film)}%, rgba(235,245,255,.16) ${lerp(100, 60, film)}%, rgba(255,255,255,.3))`, opacity: film }} />
      </div>
    </div>
    <div style={{ ...A, left: 980, top: 640, width: 250, height: 120, borderRadius: 12, background: "linear-gradient(180deg,#fffef8,#efe8d4)", transform: `rotate(-6deg) scale(${phys(tt, 3.4, 7, 0.5)})`, boxShadow: "0 12px 24px rgba(0,0,0,.4)", fontFamily: SANS, color: K.ink, textAlign: "center", paddingTop: 10 }}>
      <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 2 }}>THIGHS · 8 CT</div><div style={{ fontWeight: 900, fontSize: 46, color: K.wine }}>$6.38</div>
    </div>
    <div style={{ opacity: one, transform: `translateX(${(1 - one) * 260}px)` }}>
      <Plate x={1540} y={800} w={380}><div style={{ ...A, left: 48, top: 24, width: 170, height: 6, background: "#cfd3d6", borderRadius: 3, transform: "rotate(-20deg)" }} /></Plate>
      <Tag tt={tt} at={4.4} x={1540} y={600} txt="ONE PERSON" size={64} col={K.goldL} />
    </div>
  </>;
}}</Stage>;

// B02 · cuarenta pollos: estantes del sótano con 40 fuentes bajo 4 lámparas que se apagan en cascada hasta quedar una sola bajo el foco
export const B02Forty: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="night">{(tt) => {
  const last = 34;
  return <>
    {[0, 1, 2, 3].map((rw) => {
      const off = eio(tt, 2.6 + rw * 0.45, 3.0 + rw * 0.45), y = 250 + rw * 170;
      return <React.Fragment key={rw}>
        <div style={{ ...A, left: 240, top: y + 80, width: 1440, height: 22, background: "linear-gradient(180deg,#9aa0a6,#4c5156)", boxShadow: "0 18px 26px rgba(0,0,0,.6)", transform: "perspective(900px) rotateX(30deg)" }} />
        {Array.from({ length: 10 }, (_, c) => {
          const i = rw * 10 + c, k = cl(phys(tt, 0.2 + (c + rw) * 0.06, 8, 0.5)), keep = i === last, o = keep ? 1 : 1 - off * 0.9;
          return <div key={c} style={{ ...A, left: 270 + c * 140, top: y + (1 - k) * 60, width: 124, height: 86, opacity: k, filter: `brightness(${0.25 + 0.75 * o})` }}>
            <div style={{ ...A, left: 0, top: 30, width: 124, height: 56, borderRadius: "10px 10px 30px 30px", background: "linear-gradient(180deg,#8d949b,#3a3e43)" }} />
            <div style={{ ...A, left: 18, top: 6, width: 88, height: 56, borderRadius: "50% 50% 40% 40%", background: golden, boxShadow: "inset 0 -8px 12px rgba(80,30,0,.5)" }} />
            <div style={{ ...A, left: 34, top: 14, width: 30, height: 10, borderRadius: "50%", background: "rgba(255,255,255,.55)" }} />
          </div>;
        })}
        <div style={{ ...A, left: 940, top: y - 40, width: 26, height: 26, borderRadius: "50%", background: `radial-gradient(circle,#fff7d8,#ffcf70 50%,transparent 70%)`, opacity: 1 - off, boxShadow: `0 0 ${60 * (1 - off)}px ${30 * (1 - off)}px rgba(255,210,130,.35)` }} />
      </React.Fragment>;
    })}
    {(() => { const sp = eio(tt, 4.3, 5.0); return <div style={{ ...A, left: 270 + 4 * 140 - 160, top: 0, width: 444, height: 1000, background: "linear-gradient(180deg,rgba(255,236,190,.0),rgba(255,226,170,.28))", clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)", opacity: sp }} />; })()}
    <Tag tt={tt} at={4.6} x={1400} y={980} txt="…and then just me" size={66} col={K.goldL} font={HAND} />
  </>;
}}</Stage>;

// B03 · doce noches: almanaque de taco grueso (se ve el canto de hojas), las hojas se arrancan y caen a la mesa; sello rojo en el 12
export const B03Calendar: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const T0 = 0.7, step = 0.3, n = Math.min(12, 1 + Math.max(0, Math.floor((tt - T0) / step))), stamp = phys(tt, T0 + 11 * step + 0.4, 9, 0.4);
  return <>
    <Shadow x={820} y={930} w={640} k={1} o={0.7} />
    <div style={{ ...A, left: 820 - 280, top: 250, width: 560, height: 680 }}>
      <div style={{ ...A, left: 0, top: 0, width: 560, height: 110, borderRadius: "18px 18px 0 0", background: `linear-gradient(180deg,${K.wine},${K.wineD})`, color: K.cream, fontWeight: 900, fontSize: 46, letterSpacing: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 -6px 0 rgba(0,0,0,.3)" }}>SUPPERS</div>
      {Array.from({ length: 12 - n + 1 }, (_, i) => <div key={i} style={{ ...A, left: 6, right: 6, top: 650 + i * 3, height: 3, background: i % 2 ? "#e9dcc2" : "#d2c3a4" }} />)}
      <div style={{ ...A, left: 0, top: 110, width: 560, height: 540, background: "linear-gradient(180deg,#fffaf0,#efe4cf)", boxShadow: "0 30px 60px rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 340, color: n === 12 ? K.wine : K.ink }}>{n}</div>
      {stamp > 0.01 && <div style={{ ...A, left: 110, top: 380, width: 340, height: 120, border: `10px solid ${K.red}`, borderRadius: 16, color: K.red, fontWeight: 900, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(-12deg) scale(${2.2 - 1.2 * stamp})`, opacity: cl(stamp * 2) * 0.9, letterSpacing: 4 }}>12 NIGHTS</div>}
    </div>
    {Array.from({ length: 11 }, (_, i) => {
      const a = T0 + i * step, d = tt - a; if (d < 0) return null;
      const y = Math.min(560, 0.5 * 2400 * d * d - 120 * d), x = 820 + 260 + i * 34 + 380 * Math.min(1, d) * (0.6 + rnd(i) * 0.6), rot = Math.min(1, d * 1.4) * (40 + rnd(i) * 60);
      return <div key={i} style={{ ...A, left: x - 140, top: 360 + y, width: 280, height: 270, background: "linear-gradient(180deg,#fffdf6,#eadfc8)", boxShadow: "0 16px 30px rgba(0,0,0,.45)", transform: `rotate(${rot}deg) skewX(${Math.sin(d * 8) * 6}deg)`, fontFamily: SERIF, fontSize: 170, color: K.ink, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 - i }}>{i + 1}</div>;
    })}
  </>;
}}</Stage>;

// B04 · lavarlo no mata nada: la canilla tira agua sobre el muslo en la pileta y las gotas saltan a la mesada y quedan marcadas en rojo
export const B04Splash: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="cold">{(tt) => {
  const on = eio(tt, 0.3, 0.9) * (1 - eio(tt, 4.6, 5.1)), sx = 960, oven = phys(tt, 4.4, 7, 0.5);
  return <>
    <div style={{ ...A, left: 260, top: 640, width: 1400, height: 330, borderRadius: 30, background: "linear-gradient(180deg,#e8e1cf,#c6bda8)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", transform: "perspective(1400px) rotateX(38deg)" }} />
    <div style={{ ...A, left: sx - 300, top: 650, width: 600, height: 230, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 35%,#5c6670,#b9c2ca 60%,#8a939b)", boxShadow: "inset 0 30px 50px rgba(0,0,0,.6), 0 0 0 14px #d7dde2" }} />
    <div style={{ ...A, left: sx - 130, top: 680 }}><Thigh w={260} sq={0.62} /></div>
    <svg width="420" height="420" style={{ ...A, left: sx - 40, top: 210, overflow: "visible" }}><path d="M 300 380 L 300 120 Q 300 30 200 30 Q 60 30 40 120 L 40 150" fill="none" stroke="url(#chrome4)" strokeWidth="44" strokeLinecap="round" /><defs><linearGradient id="chrome4" x1="0" x2="1"><stop offset="0%" stopColor="#8b949c" /><stop offset="50%" stopColor="#f4f7f9" /><stop offset="100%" stopColor="#6e767e" /></linearGradient></defs></svg>
    <div style={{ ...A, left: sx - 16, top: 380, width: 32, height: 330 * on, background: "repeating-linear-gradient(180deg,rgba(200,232,255,.9) 0 18px,rgba(150,205,250,.55) 18px 30px)", backgroundPosition: `0 ${tt * 600}px`, borderRadius: 16, filter: "blur(.6px)" }} />
    {Array.from({ length: 34 }, (_, i) => {
      const a = 0.6 + rnd(i) * 3.2, d = tt - a; if (d < 0) return null;
      const dir = rnd(i + 3) < 0.5 ? -1 : 1, vx = dir * (260 + rnd(i + 5) * 560), vy = -(380 + rnd(i + 7) * 300), land = (-vy + Math.sqrt(vy * vy + 2 * 2200 * 120)) / 2200;
      const dd = Math.min(d, land), x = sx + vx * dd, y = 720 + vy * dd + 1100 * dd * dd, landed = d >= land;
      return landed ? <div key={i} style={{ ...A, left: x - 16, top: y - 8, width: 32, height: 16, borderRadius: "50%", background: "rgba(224,74,54,.85)", boxShadow: `0 0 0 ${8 * eOut(d, land, land + 0.4)}px rgba(224,74,54,.22)` }} /> : <Drop key={i} x={x} y={y} s={18} />;
    })}
    {oven > 0.01 && <div style={{ ...A, left: 1460, top: 220, width: 300, height: 220, borderRadius: 24, background: "linear-gradient(180deg,#2a2422,#120f0e)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 0 0 10px #3c3532", transform: `scale(${oven})`, overflow: "hidden" }}>
      <div style={{ ...A, left: 30, top: 40, right: 30, bottom: 30, borderRadius: 12, background: "radial-gradient(ellipse at 50% 70%,#ffb46a,#e0582a 50%,#40140a)", boxShadow: "inset 0 0 30px rgba(0,0,0,.6)" }} />
      <div style={{ ...A, left: 0, right: 0, top: 4, textAlign: "center", fontWeight: 900, fontSize: 30, color: K.goldL }}>425°F</div>
    </div>}
    <Tag tt={tt} at={4.6} x={1610} y={500} txt="THE OVEN DOES IT" size={52} col={K.goldL} />
  </>;
}}</Stage>;

// B05 · como un librito: bolsa de cierre translúcida con arrugas, la mano la aprieta, el aire sale por la rendija y el cierre se corre; marcador «TUE»
export const B05Bag: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const pr = eio(tt, 0.9, 2.6), zip = eio(tt, 2.6, 3.5), wr = eio(tt, 3.7, 4.6), bh = lerp(360, 150, pr), top = 640 - bh / 2, id = "bag5";
  return <>
    <Shadow x={900} y={800} w={820} k={1} o={0.65} />
    <svg width="800" height={bh + 40} viewBox={`0 0 800 ${bh + 40}`} style={{ ...A, left: 500, top: top - 20, overflow: "visible" }}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,.55)" /><stop offset="45%" stopColor="rgba(210,230,245,.18)" /><stop offset="100%" stopColor="rgba(255,255,255,.42)" /></linearGradient></defs>
      <path d={`M 20 40 Q 400 ${40 - 30 * (1 - pr)} 780 40 L 780 ${bh} Q 400 ${bh + 40 * (1 - pr)} 20 ${bh} Z`} fill={`url(#${id})`} stroke="rgba(255,255,255,.75)" strokeWidth="4" />
    </svg>
    <div style={{ ...A, left: 900 - 170, top: 640 - 110 * lerp(1, 0.55, pr) }}><Thigh w={340} k={0} sq={lerp(1, 0.55, pr)} /></div>
    <svg width="800" height={bh + 40} viewBox={`0 0 800 ${bh + 40}`} style={{ ...A, left: 500, top: top - 20, overflow: "visible" }}>
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${80 + i * 100} ${60 + rnd(i) * 30} q ${30 + rnd(i + 1) * 40} ${bh * 0.3} ${-10 + rnd(i + 2) * 30} ${bh * 0.7}`} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="3" />)}
      <rect x="20" y="22" width="760" height="22" rx="8" fill="#3d8fd0" opacity=".9" /><rect x="20" y="22" width={760 * zip} height="22" rx="8" fill="#6bc0f2" />
      <rect x={12 + 760 * zip} y="12" width="34" height="42" rx="6" fill="#e8eef2" stroke="#7d8890" strokeWidth="3" />
      <text x="60" y={bh - 18} fontFamily={MARK} fontSize="74" fill="#1d2b5a" style={{ clipPath: `inset(0 ${100 - 100 * wr}% 0 0)` } as React.CSSProperties}>TUE</text>
    </svg>
    <Hand x={1080} y={top - 170 + 120 * pr} s={1.2} rot={14 - 6 * pr} press={pr} />
    {tt > 1.0 && tt < 3.0 && Array.from({ length: 10 }, (_, i) => { const p = ((tt * 1.8 + i / 10) % 1); return <div key={i} style={{ ...A, left: 1290 + p * 330, top: top + 4 - p * 120 + Math.sin(p * 9 + i) * 20, width: 90 * (1 - p) + 20, height: 30 * (1 - p) + 10, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.55),transparent 70%)", filter: "blur(4px)", opacity: 1 - p }} />; })}
  </>;
}}</Stage>;

// B06 · fino como una moneda: calibre de taller con ventanita digital; mide una moneda de 5 y después una rodaja de papa con cáscara: lo mismo
export const B06Caliper: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const c1 = eio(tt, 0.6, 1.6), sw = eio(tt, 2.4, 3.0), c2 = eio(tt, 3.0, 3.9), gap = sw < 0.5 ? lerp(260, 0, c1) : lerp(260, 0, c2), read = 1.95 + gap / 40;
  const jx = 840;
  return <>
    <Shadow x={960} y={880} w={1300} k={1} o={0.5} />
    <div style={{ ...A, left: 300, top: 420, width: 1320, height: 86, borderRadius: 12, background: "linear-gradient(180deg,#f4f6f8,#a7aeb5 55%,#d6dbe0)", boxShadow: "0 24px 40px rgba(0,0,0,.55), inset 0 -4px 0 rgba(0,0,0,.2)" }}>
      {Array.from({ length: 64 }, (_, i) => <div key={i} style={{ ...A, left: 24 + i * 20, top: 0, width: 2, height: i % 5 ? 20 : 36, background: "#2a2d30" }} />)}
    </div>
    <div style={{ ...A, left: jx - 90, top: 300, width: 90, height: 460, borderRadius: "10px 10px 40px 10px", background: "linear-gradient(90deg,#8a9096,#f2f4f6 45%,#767c82)", boxShadow: "8px 20px 30px rgba(0,0,0,.4)" }} />
    <div style={{ ...A, left: jx + 30 + gap, top: 300, width: 300, height: 460, transformOrigin: "0 0" }}>
      <div style={{ ...A, left: 0, top: 0, width: 90, height: 460, borderRadius: "10px 10px 10px 40px", background: "linear-gradient(90deg,#8a9096,#f2f4f6 45%,#767c82)", boxShadow: "8px 20px 30px rgba(0,0,0,.4)" }} />
      <div style={{ ...A, left: 60, top: 106, width: 300, height: 120, borderRadius: 14, background: "linear-gradient(180deg,#30343a,#1a1d21)", boxShadow: "0 14px 24px rgba(0,0,0,.5)" }}>
        <div style={{ ...A, left: 18, top: 16, right: 18, bottom: 16, borderRadius: 6, background: "linear-gradient(180deg,#bcd6a6,#9ec287)", fontFamily: "monospace", fontWeight: 900, fontSize: 64, color: "#1d2a14", display: "flex", alignItems: "center", justifyContent: "center" }}>{read.toFixed(2)}</div>
      </div>
    </div>
    <div style={{ ...A, left: jx - 4, top: 560 + sw * 520, width: 34, height: 190, borderRadius: 6, background: "repeating-linear-gradient(180deg,#9aa0a6 0 4px,#e6e9ec 4px 8px)", boxShadow: "0 0 0 2px #6e757b" }} />
    <div style={{ ...A, left: jx - 4, top: 560 - (1 - sw) * 640, width: 34, height: 190, borderRadius: 10, background: "linear-gradient(90deg,#8a5a2a 0 5px,#f6ecc8 5px 29px,#8a5a2a 29px)" }} />
    <div style={{ ...A, left: 330, top: 640, width: 210, height: 210, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%,#f3f5f7,#a4abb2 60%,#6e757c)", boxShadow: "0 0 0 8px #8a9198, 0 20px 30px rgba(0,0,0,.5)", opacity: 1 - sw, transform: `scale(${phys(tt, 0.3, 7, 0.5)})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 64, color: "#5a6168" }}>5¢</div>
    <div style={{ ...A, left: 330, top: 640, width: 220, height: 200, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%,#fff6d6,#f0dca0 70%)", boxShadow: "0 0 0 12px #9a6a36, 0 20px 30px rgba(0,0,0,.5)", opacity: sw }} />
    <Tag tt={tt} at={4.2} x={1360} y={860} txt="SAME THICKNESS" size={60} col={K.goldL} />
  </>;
}}</Stage>;

// B07 · mojada es goma, seca es crocante: la banda elástica gruesa con gotas se estira y rebota; la lámina de piel seca recibe el tenedor y se quiebra en astillas
export const B07Rubber: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const st = Math.max(0, Math.sin(cl((tt - 0.5) / 2.0) * Math.PI * 3)) * (1 - cl((tt - 0.5) / 2.0)), hit = 3.0, cr = eOut(tt, hit, hit + 0.8);
  const fy = tt < hit ? lerp(-260, 0, eIn(tt, hit - 0.5, hit)) : -40 * eOut(tt, hit, hit + 0.5);
  return <>
    <Shadow x={520} y={800} w={600} k={1} />
    {[300, 740].map((x, i) => <div key={i} style={{ ...A, left: x - 24, top: 470, width: 48, height: 320, borderRadius: 14, background: "linear-gradient(90deg,#5a3a22,#9a6a42,#4a2c18)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />)}
    <svg width="700" height="300" style={{ ...A, left: 170, top: 400, overflow: "visible" }}>
      <path d={`M 130 140 Q 350 ${140 - 20 + 180 * st} 570 140 Q 350 ${140 + 40 + 220 * st} 130 140`} fill="none" stroke="#c97a48" strokeWidth="34" strokeLinejoin="round" />
      <path d={`M 130 140 Q 350 ${140 - 20 + 180 * st} 570 140`} fill="none" stroke="#f0b088" strokeWidth="10" opacity=".7" />
    </svg>
    {Array.from({ length: 7 }, (_, i) => <Drop key={i} x={340 + i * 52} y={540 + 30 * st * Math.sin(i) + 110 * st} s={20} />)}
    <Tag tt={tt} at={0.6} x={520} y={330} txt="WET" size={72} col={K.ice} />
    <Shadow x={1400} y={800} w={560} k={1} />
    <svg width="560" height="300" viewBox="0 0 560 300" style={{ ...A, left: 1120, top: 480, overflow: "visible" }}>
      <defs><radialGradient id="sk7" cx="40%" cy="30%" r="80%"><stop offset="0%" stopColor="#ffd98a" /><stop offset="60%" stopColor="#d8862c" /><stop offset="100%" stopColor="#7a3a0c" /></radialGradient></defs>
      <path d="M 20 150 C 60 60, 160 40, 280 50 C 420 60, 520 90, 540 160 C 520 240, 400 270, 280 260 C 140 250, 40 230, 20 150 Z" fill="#6a2c08" transform="translate(0 14)" />
      <path d="M 20 150 C 60 60, 160 40, 280 50 C 420 60, 520 90, 540 160 C 520 240, 400 270, 280 260 C 140 250, 40 230, 20 150 Z" fill="url(#sk7)" />
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={70 + rnd(i) * 420} cy={80 + rnd(i + 9) * 150} r={8 + rnd(i + 2) * 14} fill="#ffe6a8" opacity=".35" />)}
      {[["M280 150 L 200 90 L 150 60", 0], ["M280 150 L 380 100 L 460 110", 1], ["M280 150 L 250 230", 2], ["M280 150 L 400 220 L 470 200", 3]].map(([d, i]) => <path key={i as number} d={d as string} fill="none" stroke="#4a1e04" strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - cr} />)}
    </svg>
    <svg width="120" height="300" style={{ ...A, left: 1340, top: 330 + fy, overflow: "visible" }}><rect x="52" y="0" width="16" height="200" rx="6" fill="#c7ccd1" />{[0, 1, 2, 3].map((i) => <rect key={i} x={30 + i * 18} y="190" width="9" height="90" rx="4" fill="#dfe3e7" />)}</svg>
    {tt > hit && Array.from({ length: 18 }, (_, i) => { const d = tt - hit, a = -Math.PI * (0.1 + 0.8 * rnd(i)), v = 300 + rnd(i + 4) * 400, x = 1400 + Math.cos(a) * v * d, y = 630 + Math.sin(a) * v * d + 1200 * d * d; return y < 800 && <div key={i} style={{ ...A, left: x, top: y, width: 22, height: 13, borderRadius: 4, background: "linear-gradient(135deg,#ffd98a,#b8661e)", transform: `rotate(${d * 720 + i * 40}deg)`, boxShadow: "0 6px 8px rgba(0,0,0,.4)" }} />; })}
    <Tag tt={tt} at={3.2} x={1400} y={330} txt="DRY" size={72} col={K.goldL} />
  </>;
}}</Stage>;

// B08 · la papa debajo del pollo: corte de la fuente: el muslo en la rejilla, la grasa cae en gotas y cada rodaja se dora y brilla
export const B08Drip: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const N = 7;
  return <>
    <Shadow x={960} y={940} w={1100} k={1} o={0.7} />
    <div style={{ ...A, left: 420, top: 690, width: 1080, height: 230, clipPath: "polygon(0 0,100% 0,92% 100%,8% 100%)", background: "linear-gradient(180deg,#c9ced3,#6e757c)", boxShadow: "inset 0 20px 30px rgba(0,0,0,.4)" }} />
    <div style={{ ...A, left: 480, top: 700, width: 960, height: 200, clipPath: "polygon(0 0,100% 0,93% 100%,7% 100%)", background: "linear-gradient(180deg,#3a2a1e,#1a120c)" }} />
    {Array.from({ length: N }, (_, i) => {
      const hitT = 0.9 + i * 0.45, g = eOut(tt, hitT, hitT + 0.6);
      return <div key={i} style={{ ...A, left: 540 + i * 122, top: 760, width: 150, height: 62 }}>
        <div style={{ ...A, left: 0, top: 12, width: 150, height: 50, borderRadius: "50%", background: "#c8a46a" }} />
        <div style={{ ...A, left: 0, top: 0, width: 150, height: 50, borderRadius: "50%", background: `radial-gradient(ellipse at 40% 35%,${g > 0.5 ? "#ffd27a" : "#f7ecd0"},${g > 0.5 ? "#b8661e" : "#d8c494"})`, boxShadow: `0 0 0 4px #9a6a36, 0 0 ${30 * g}px rgba(255,190,90,${0.6 * g})` }} />
        <div style={{ ...A, left: 34, top: 10, width: 50, height: 12, borderRadius: "50%", background: "#fff", opacity: 0.7 * g }} />
      </div>;
    })}
    <div style={{ ...A, left: 520, top: 610, width: 900, height: 14, borderRadius: 7, background: "linear-gradient(180deg,#e2e6ea,#7c838a)" }} />
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ ...A, left: 560 + i * 160, top: 600, width: 10, height: 40, background: "#9aa1a8" }} />)}
    <div style={{ ...A, left: 960 - 240, top: 300 + 6 * Math.sin(tt * 3) }}><Thigh w={480} k={0.85} /></div>
    {Array.from({ length: N }, (_, i) => { const a = 0.4 + i * 0.45, d = tt - a; const y = 600 + 0.5 * 2000 * d * d; return d > 0 && y < 780 && <Drop key={i} x={600 + i * 122} y={y} s={28} col="#f2be4a" />; })}
    <Tag tt={tt} at={4.0} x={1580} y={500} txt="CHICKEN FAT" size={64} col={K.goldL} />
  </>;
}}</Stage>;

// B09 · el muslo no se seca: termómetro de carne clavado en el muslo; la aguja pasa la marca de pechuga (165) y sigue a 180, el jugo brilla
export const B09Tender: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const v = lerp(130, 180, eio(tt, 0.7, 3.8)), ang = -120 + (v - 120) / 80 * 240, juicy = cl((v - 168) / 12);
  const mk = (n: number) => -120 + (n - 120) / 80 * 240;
  return <>
    <Plate x={820} y={800} w={760} />
    <div style={{ ...A, left: 820 - 260, top: 560, transform: `scale(${1 + 0.02 * Math.sin(tt * 5) * juicy})` }}><Thigh w={520} k={0.9} sq={0.7} /></div>
    {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ ...A, left: 640 + rnd(i) * 360, top: 640 + rnd(i + 3) * 120, width: 26, height: 12, borderRadius: "50%", background: "#fff6d0", opacity: juicy * (0.5 + 0.5 * Math.sin(tt * 4 + i)) }} />)}
    <div style={{ ...A, left: 1010, top: 330, width: 14, height: 360, borderRadius: 7, background: "linear-gradient(90deg,#8d949b,#f2f4f6,#7a8188)", transform: "rotate(18deg)", transformOrigin: "50% 100%" }} />
    <div style={{ ...A, left: 1130 - 200, top: 130, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle at 42% 36%,#ffffff,#ece8de 70%)", boxShadow: "0 0 0 22px #c9ced3, 0 0 0 26px #7c838a, 0 40px 60px rgba(0,0,0,.6)" }}>
      <svg width="400" height="400" style={{ ...A, inset: 0, overflow: "visible" }}>
        {Array.from({ length: 17 }, (_, i) => { const a = (-120 + i * 15 - 90) * Math.PI / 180; return <line key={i} x1={200 + Math.cos(a) * 160} y1={200 + Math.sin(a) * 160} x2={200 + Math.cos(a) * (i % 2 ? 175 : 185)} y2={200 + Math.sin(a) * (i % 2 ? 175 : 185)} stroke="#2a2d30" strokeWidth={i % 2 ? 2 : 4} />; })}
        <path d={`M ${200 + Math.cos((mk(165) - 90) * Math.PI / 180) * 168} ${200 + Math.sin((mk(165) - 90) * Math.PI / 180) * 168} A 168 168 0 0 1 ${200 + Math.cos((mk(171) - 90) * Math.PI / 180) * 168} ${200 + Math.sin((mk(171) - 90) * Math.PI / 180) * 168}`} fill="none" stroke={K.red} strokeWidth="14" />
        <line x1="200" y1="200" x2={200 + Math.cos((ang - 90) * Math.PI / 180) * 150} y2={200 + Math.sin((ang - 90) * Math.PI / 180) * 150} stroke={K.wine} strokeWidth="8" strokeLinecap="round" />
        <circle cx="200" cy="200" r="16" fill="#2a2d30" />
      </svg>
      <div style={{ ...A, left: 0, right: 0, top: 236, textAlign: "center", fontWeight: 900, fontSize: 84, color: K.ink }}>{Math.round(v)}°</div>
    </div>
    <Tag tt={tt} at={4.0} x={1130} y={620} txt="STILL JUICY" size={60} col={K.goldL} />
  </>;
}}</Stage>;

// B10 · el plato de casamiento: el plato gira sobre su eje (se ve el sello «1964» del reverso), clava de frente con el muslo; el año rueda a hoy
export const B10Plate: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const rot = lerp(0, 540, eio(tt, 0.4, 3.0)), c = Math.cos(rot * Math.PI / 180), back = c < 0, yr = Math.round(lerp(1964, 2026, eio(tt, 3.4, 4.8)));
  const sw = ((tt * 0.35) % 1);
  return <>
    <Shadow x={820} y={940} w={760 * Math.max(0.2, Math.abs(c))} k={1} o={0.7} />
    <div style={{ ...A, left: 820 - 360, top: 180, width: 720, height: 720, borderRadius: "50%", transform: `scaleX(${Math.max(0.04, Math.abs(c))})`, background: back ? "radial-gradient(circle at 50% 50%,#e9e3d6,#d4ccbc 60%,#bdb4a2)" : "radial-gradient(circle at 42% 38%,#ffffff,#f1ece2 60%,#d6cfc2)", boxShadow: "0 50px 80px rgba(0,0,0,.6), inset 0 0 0 26px #f8f4ec, inset 0 0 0 36px #d8b25a, inset 0 0 0 42px #f8f4ec" }}>
      {back ? <div style={{ ...A, inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: SERIF, color: "#3a4a8a" }}><div style={{ fontSize: 40, letterSpacing: 6 }}>WEDDING CHINA</div><div style={{ fontSize: 150 }}>1964</div></div>
        : <>{tt > 2.6 && <div style={{ ...A, left: 180, top: 200, opacity: eio(tt, 2.6, 3.1) }}><Thigh w={360} k={1} /></div>}</>}
      <div style={{ ...A, inset: 0, borderRadius: "50%", background: `linear-gradient(120deg,transparent ${sw * 100 - 20}%,rgba(255,255,255,.5) ${sw * 100}%,transparent ${sw * 100 + 12}%)` }} />
    </div>
    <div style={{ ...A, left: 1300, top: 430, display: "flex", gap: 10, opacity: cl((tt - 3.0) * 3) }}>
      {String(yr).split("").map((d, i) => <div key={i} style={{ width: 110, height: 160, borderRadius: 12, background: "linear-gradient(180deg,#120c08,#2e2016 50%,#120c08)", boxShadow: "inset 0 14px 20px rgba(0,0,0,.8), 0 16px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 120, color: K.goldL }}>{d}</div>)}
    </div>
    <Tag tt={tt} at={4.6} x={1530} y={700} txt="now I'm the company" size={58} col={K.goldL} font={HAND} />
  </>;
}}</Stage>;

// B11 · se suelta sola: el muslo en la sartén tira de hilos de piel pegada que se estiran y se cortan; al soltarse queda la marca dorada
export const B11Release: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const snapT = 3.0, tug = 0.5 - 0.5 * Math.cos(cl((tt - 0.6) / 2.4) * Math.PI * 4), snap = tt > snapT, lift = eOut(tt, snapT, snapT + 0.7);
  const ty = snap ? -60 - 240 * lift : -60 * tug * cl((tt - 0.6) * 2);
  return <>
    <Skillet x={900} y={720} w={980} heat={0.6}>
      <div style={{ ...A, left: 290, top: 120, width: 300, height: 170, borderRadius: "50%", background: "radial-gradient(ellipse,#c97a2e,#7a3a0c 70%,transparent 72%)", opacity: lift }} />
    </Skillet>
    <svg width="980" height="600" style={{ ...A, left: 410, top: 300, overflow: "visible" }}>
      {Array.from({ length: 7 }, (_, i) => { const x = 380 + i * 40, yTop = 360 + ty + 70, yBot = 520, retract = snap ? eOut(tt, snapT, snapT + 0.25) : 0; const mid = lerp(yTop, yBot, 0.5) + 14 * Math.sin(i);
        return <path key={i} d={`M ${x} ${lerp(yTop, yBot, retract * 0.5)} Q ${x + 10 * Math.sin(i * 2)} ${mid} ${x + 4} ${yBot}`} fill="none" stroke="#f0b870" strokeWidth={snap ? 6 * (1 - retract) : 7 - 3 * tug} strokeLinecap="round" opacity={snap ? 1 - retract : 0.9} />; })}
    </svg>
    <div style={{ ...A, left: 900 - 230, top: 470 + ty, transform: `rotate(${snap ? -10 * lift : 2 * Math.sin(tt * 8) * tug}deg)` }}><Thigh w={460} k={0.95} sq={0.75} /></div>
    <Steam x={900} y={560} tt={tt} n={5} w={500} k={0.6} />
    <Tag tt={tt} at={snapT + 0.5} x={1500} y={380} txt="IT LETS GO" size={66} col={K.goldL} />
  </>;
}}</Stage>;

// B12 · un minuto de harina: el reloj de arena grande corre mientras la cuchara de madera revuelve la harina en manteca y se tuesta
export const B12Roux: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const p = cl((tt - 0.6) / 4.4), a = tt * 3.2, col = `rgb(${Math.round(lerp(246, 196, p))},${Math.round(lerp(236, 142, p))},${Math.round(lerp(214, 70, p))})`;
  return <>
    <Skillet x={1080} y={720} w={900} heat={0.5}>
      <div style={{ ...A, left: 160, top: 70, width: 480, height: 260, borderRadius: "50%", background: `radial-gradient(ellipse at 45% 40%,${col},rgba(0,0,0,.1) 80%)`, boxShadow: "inset 0 -10px 20px rgba(0,0,0,.25)" }} />
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ ...A, left: 200 + rnd(i) * 400, top: 100 + rnd(i + 5) * 190, width: 10, height: 6, borderRadius: "50%", background: "rgba(255,255,255,.4)", opacity: 1 - p }} />)}
    </Skillet>
    <div style={{ ...A, left: 1080 + Math.cos(a) * 150 - 30, top: 520 + Math.sin(a) * 60 - 380, width: 60, height: 460, transform: `rotate(${20 + 8 * Math.cos(a)}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ ...A, left: 20, top: 0, width: 22, height: 340, borderRadius: 11, background: "linear-gradient(90deg,#a8743e,#e2b47a,#8a5a2a)" }} />
      <div style={{ ...A, left: 0, top: 330, width: 62, height: 110, borderRadius: "40% 40% 50% 50%", background: "linear-gradient(90deg,#9a6632,#dcaa6e,#835426)" }} />
    </div>
    <Shadow x={420} y={900} w={300} k={1} />
    <svg width="320" height="560" viewBox="0 0 320 560" style={{ ...A, left: 260, top: 340, overflow: "visible" }}>
      <rect x="10" y="0" width="300" height="34" rx="8" fill="#6a4020" /><rect x="10" y="526" width="300" height="34" rx="8" fill="#6a4020" />
      <path d="M 50 34 C 50 200, 150 230, 150 280 C 150 330, 50 360, 50 526 L 270 526 C 270 360, 170 330, 170 280 C 170 230, 270 200, 270 34 Z" fill="rgba(220,240,255,.22)" stroke="rgba(255,255,255,.6)" strokeWidth="4" />
      <path d={`M ${50 + 100 * p * 0.6} ${34 + 200 * p} C 70 ${200}, 150 230, 152 276 L 168 276 C 170 230, 250 200, ${270 - 100 * p * 0.6} ${34 + 200 * p} Z`} fill="#e9c98a" />
      <rect x="157" y="280" width="6" height={240 * (p < 1 ? 1 : 0)} fill="#e9c98a" />
      <path d={`M 60 526 Q 160 ${526 - 180 * p} 260 526 Z`} fill="#e9c98a" />
      <rect x="30" y="40" width="12" height="480" rx="6" fill="rgba(255,255,255,.35)" />
    </svg>
    <Tag tt={tt} at={1.4} x={420} y={280} txt="ONE MINUTE" size={60} col={K.goldL} />
  </>;
}}</Stage>;

// B13 · Mrs. Novak, 1971: proyector de diapositivas con carrusel que gira un paso (clac), haz con polvo y la foto en trapecio sobre la pared
export const B13Projector: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="night">{(tt) => {
  const st = eio(tt, 0.7, 1.1), on = eio(tt, 1.2, 1.6) * (0.95 + 0.05 * Math.sin(tt * 40)), dust = tt;
  return <>
    <div style={{ ...A, left: 760, top: 150, width: 1000, height: 640, perspective: 1400 }}>
      <div style={{ ...A, inset: 0, transform: "rotateY(-22deg)", transformOrigin: "100% 50%", opacity: on, filter: "sepia(.35) brightness(1.05)" }}>{h.bg && <Img src={img(h.bg)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4, boxShadow: "0 0 80px rgba(255,236,190,.35)" }} />}</div>
    </div>
    <div style={{ ...A, left: 350, top: 520, width: 1400, height: 480, background: "linear-gradient(90deg,rgba(255,240,200,.32),rgba(255,240,200,.05))", clipPath: "polygon(0 46%, 0 58%, 100% 100%, 100% -40%)", opacity: on, filter: "blur(4px)", transform: "translateY(-260px)" }} />
    {Array.from({ length: 26 }, (_, i) => { const p = ((rnd(i) + dust * 0.03 * (1 + rnd(i + 3))) % 1); return <div key={i} style={{ ...A, left: 380 + p * 1100, top: 470 + (rnd(i + 7) - 0.5) * (60 + p * 500) + Math.sin(dust + i) * 10, width: 5, height: 5, borderRadius: "50%", background: "#fff3d0", opacity: on * 0.7 }} />; })}
    <Shadow x={300} y={860} w={420} k={1} o={0.75} />
    <div style={{ ...A, left: 110, top: 560, width: 380, height: 280, borderRadius: 26, background: "linear-gradient(180deg,#5a5450,#2a2624)", boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,255,255,.12)" }}>
      <div style={{ ...A, right: -60, top: 80, width: 90, height: 110, borderRadius: 16, background: "linear-gradient(180deg,#2a2624,#0e0c0b)" }}><div style={{ ...A, right: -6, top: 25, width: 30, height: 60, borderRadius: "50%", background: "radial-gradient(circle,#fff8e0,#d8c090 60%,#3a3020)", opacity: 0.4 + 0.6 * on }} /></div>
    </div>
    <svg width="400" height="160" viewBox="0 0 400 160" style={{ ...A, left: 100, top: 440, overflow: "visible" }}>
      <ellipse cx="200" cy="100" rx="190" ry="56" fill="#1a1716" /><ellipse cx="200" cy="86" rx="190" ry="56" fill="#3c3634" />
      {Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2 + st * (Math.PI * 2 / 18); return <rect key={i} x={200 + Math.cos(a) * 150 - 8} y={86 + Math.sin(a) * 42 - 30} width="16" height="34" rx="2" fill={i % 3 ? "#e8e2d4" : "#c9c0aa"} opacity={Math.sin(a) > -0.2 ? 1 : 0.6} />; })}
      <ellipse cx="200" cy="80" rx="40" ry="12" fill="#5a5450" />
    </svg>
    <Tag tt={tt} at={1.8} x={1260} y={920} txt="Mrs. Novak · 1971" size={62} col={K.goldL} font={HAND} />
  </>;
}}</Stage>;

// B14 · la paprika se quema en un segundo: montoncito rojo en el aceite que se oscurece con humo negro; cronómetro; la perilla a OFF y vuelve el rojo
export const B14Paprika: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const burn = eio(tt, 1.0, 2.6) * (1 - eio(tt, 3.2, 3.9)), knob = eio(tt, 2.8, 3.3), col = `rgb(${Math.round(lerp(214, 90, burn))},${Math.round(lerp(52, 34, burn))},${Math.round(lerp(28, 18, burn))})`;
  return <>
    <Skillet x={860} y={720} w={940} heat={0.7 * (1 - knob)}>
      <div style={{ ...A, left: 160, top: 60, width: 520, height: 280, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(240,190,80,.45),transparent 70%)" }} />
      {Array.from({ length: 70 }, (_, i) => { const a = rnd(i) * Math.PI * 2, d = Math.sqrt(rnd(i + 3)) * 150; return <div key={i} style={{ ...A, left: 420 + Math.cos(a) * d * 1.4, top: 200 + Math.sin(a) * d * 0.55 - (1 - d / 150) * 40, width: 18, height: 14, borderRadius: "50%", background: col, boxShadow: "0 3px 4px rgba(0,0,0,.35)" }} />; })}
    </Skillet>
    {Array.from({ length: 8 }, (_, i) => { const p = ((tt * 0.6 + i / 8) % 1), s = 80 + 160 * p; return <div key={i} style={{ ...A, left: 860 - s / 2 + Math.sin(tt * 1.3 + i) * 60 * p, top: 640 - p * 520, width: s, height: s, borderRadius: "50%", background: "radial-gradient(circle,rgba(40,30,26,.75),transparent 68%)", filter: "blur(10px)", opacity: burn * Math.sin(p * Math.PI) }} />; })}
    <svg width="300" height="340" viewBox="0 0 300 340" style={{ ...A, left: 1430, top: 230, overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.55))" }}>
      <rect x="125" y="0" width="50" height="40" rx="8" fill="#b8bec4" /><circle cx="150" cy="190" r="140" fill="#c9ced3" /><circle cx="150" cy="190" r="118" fill="#fffdf6" />
      {Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return <line key={i} x1={150 + Math.cos(a) * 100} y1={190 + Math.sin(a) * 100} x2={150 + Math.cos(a) * 112} y2={190 + Math.sin(a) * 112} stroke="#333" strokeWidth="4" />; })}
      <line x1="150" y1="190" x2={150 + Math.cos(tt * 6.28 * 1.4 - Math.PI / 2) * 100} y2={190 + Math.sin(tt * 6.28 * 1.4 - Math.PI / 2) * 100} stroke={K.red} strokeWidth="7" strokeLinecap="round" /><circle cx="150" cy="190" r="12" fill="#333" />
    </svg>
    <div style={{ ...A, left: 1460, top: 700, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#f2f2ef,#b9b9b4 70%)", boxShadow: "0 20px 30px rgba(0,0,0,.55)", transform: `rotate(${lerp(120, 0, knob)}deg)` }}>
      <div style={{ ...A, left: 96, top: 14, width: 28, height: 90, borderRadius: 14, background: "#333" }} />
    </div>
    <div style={{ ...A, left: 1500, top: 930, fontWeight: 900, fontSize: 46, color: knob > 0.5 ? K.green : K.dim, letterSpacing: 4 }}>OFF</div>
    <Tag tt={tt} at={1.2} x={1580} y={170} txt="1 SECOND" size={60} col={K.red} />
  </>;
}}</Stage>;

// B15 · que no se corte: la cuchara grande vuelca un hilo de salsa caliente en la taza de crema y se arma el remolino naranja-rosa con vapor
export const B15Temper: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pour = eio(tt, 0.8, 1.3) * (1 - eio(tt, 3.0, 3.4)), sw = eio(tt, 1.0, 4.4), id = "sw15";
  const spiral = Array.from({ length: 80 }, (_, i) => { const a = i / 80 * Math.PI * 6 + tt * 1.5, rr = 10 + i * 2.6; return `${i ? "L" : "M"} ${300 + Math.cos(a) * rr * 1.5} ${130 + Math.sin(a) * rr * 0.5}`; }).join(" ");
  return <>
    <Shadow x={900} y={930} w={640} k={1} o={0.7} />
    <svg width="600" height="460" viewBox="0 0 600 460" style={{ ...A, left: 600, top: 470, overflow: "visible" }}>
      <defs><linearGradient id={id} x1="0" x2="1"><stop offset="0%" stopColor="#d9d2c4" /><stop offset="40%" stopColor="#ffffff" /><stop offset="100%" stopColor="#bfb6a6" /></linearGradient></defs>
      <path d="M 40 130 L 80 420 Q 300 470 520 420 L 560 130 Z" fill={`url(#${id})`} />
      <path d="M 560 180 C 660 180, 660 330, 540 340" fill="none" stroke="#e8e2d6" strokeWidth="34" />
      <ellipse cx="300" cy="130" rx="260" ry="70" fill="#f1ede4" stroke="#fff" strokeWidth="8" />
      <ellipse cx="300" cy="134" rx="236" ry="60" fill="#fbf7ee" />
      <path d={spiral} fill="none" stroke="#ee9a6a" strokeWidth="18" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - sw} opacity=".9" />
      <ellipse cx="300" cy="134" rx="236" ry="60" fill={`rgba(240,160,120,${0.35 * sw})`} />
    </svg>
    <div style={{ ...A, left: 870, top: 200, width: 26, height: 410 * pour, borderRadius: 13, background: "linear-gradient(90deg,#b8441c,#f0743a,#b8441c)" }} />
    <svg width="560" height="220" viewBox="0 0 560 220" style={{ ...A, left: 830, top: 80, overflow: "visible", transform: `rotate(${lerp(-4, 22, pour)}deg)`, transformOrigin: "100% 50%", filter: "drop-shadow(0 20px 20px rgba(0,0,0,.5))" }}>
      <path d="M 560 90 L 230 100 L 230 120 L 560 120 Z" fill="#c9ced3" />
      <ellipse cx="120" cy="110" rx="120" ry="80" fill="#dfe3e7" /><ellipse cx="120" cy="104" rx="100" ry="62" fill="#d0581e" /><ellipse cx="90" cy="90" rx="30" ry="12" fill="#ff9a60" opacity=".7" />
    </svg>
    <Steam x={900} y={580} tt={tt} n={6} w={360} k={0.8} />
    <Tag tt={tt} at={4.2} x={1460} y={700} txt="NO CURDLE" size={64} col={K.goldL} />
  </>;
}}</Stage>;

// B16 · Rosa, 1998: latita de recetas abierta en perspectiva; el dedo pasa las fichas de a una y sube la de Rosa, grande, con su letra
export const B16Tin: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const lid = eio(tt, 0.3, 1.0), up = eio(tt, 2.6, 3.6), flick = Math.floor(cl((tt - 1.1) / 1.4) * 7);
  return <>
    <Shadow x={760} y={940} w={720} k={1} o={0.7} />
    <div style={{ ...A, left: 760, top: 780, perspective: 1500 }}>
      <div style={{ transformStyle: "preserve-3d", transform: "rotateX(-16deg) rotateY(-26deg)" }}>
        <div style={{ ...A, left: -300, top: -170, width: 600, height: 300, background: "linear-gradient(180deg,#b23a2e,#7a1c14)", transform: "translateZ(150px)", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.15)" }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ ...A, left: 70 + i * 170, top: 90, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,#f6e6b0,#e0b860)", opacity: 0.85 }} />)}
        </div>
        <div style={{ ...A, left: 300, top: -170, width: 300, height: 300, background: "linear-gradient(180deg,#8a2a20,#5a140e)", transformOrigin: "0 50%", transform: "translateZ(150px) rotateY(90deg)" }} />
        {Array.from({ length: 9 }, (_, i) => { const fl = i < flick ? 1 : 0; return <div key={i} style={{ ...A, left: -270, top: -320, width: 540, height: 200, background: i % 2 ? "#fbf3e0" : "#f3e8cc", borderTop: "6px solid #c9a46a", transformOrigin: "50% 100%", transform: `translateZ(${120 - i * 30}px) translateY(150px) rotateX(${-fl * 32}deg)`, boxShadow: "0 -4px 10px rgba(0,0,0,.2)" }} />; })}
        <div style={{ ...A, left: -300, top: -470, width: 600, height: 300, background: "linear-gradient(180deg,#c24a3c,#8a2a1e)", transformOrigin: "50% 100%", transform: `translateZ(-150px) translateY(0px) rotateX(${lerp(-90, 18, lid)}deg)`, boxShadow: "inset 0 0 0 6px rgba(255,255,255,.12)" }} />
      </div>
    </div>
    <div style={{ ...A, left: lerp(560, 1060, up), top: lerp(560, 230, up), width: 760, height: 470, background: "repeating-linear-gradient(180deg,#fffaf0 0 56px,#9fc0e0 56px 58px)", borderTop: "14px solid #d8392b", boxShadow: `0 ${40 * up}px ${70 * up}px rgba(0,0,0,.55)`, transform: `rotate(${lerp(-10, -3, up)}deg) scale(${lerp(0.5, 1, up)})`, transformOrigin: "0 0", opacity: cl(up * 4), fontFamily: HAND, color: "#1d2b5a", padding: "24px 40px", boxSizing: "border-box" }}>
      <div style={{ fontSize: 80, fontWeight: 700 }}>Arroz con Pollo</div>
      <div style={{ fontSize: 52, marginTop: 30 }}>from Rosa · 1998</div>
      <div style={{ fontSize: 42, marginTop: 30, opacity: 0.8 }}>toast the rice first!</div>
    </div>
  </>;
}}</Stage>;

// B17 · el borde se vuelve traslúcido: macro de granos de arroz en el aceite; la onda de calor los recorre y cada borde se enciende con luz de atrás
export const B17Rice: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const wave = lerp(-200, 2100, cl((tt - 0.6) / 4.0));
  return <>
    <div style={{ ...A, left: -100, top: 470, width: 2120, height: 700, background: "radial-gradient(ellipse at 50% 20%,#7a5a20,#2a1a08 70%)", transform: "perspective(900px) rotateX(58deg)", transformOrigin: "50% 0" }} />
    <div style={{ ...A, left: wave - 260, top: 380, width: 520, height: 700, background: "radial-gradient(ellipse,rgba(255,220,140,.32),transparent 65%)", filter: "blur(20px)" }} />
    {Array.from({ length: 14 }, (_, i) => {
      const row = i % 2, x = 140 + i * 125 + row * 30, y = 560 + row * 170 + rnd(i) * 40, s = 1 + row * 0.35, lit = cl((wave - x) / 220);
      return <div key={i} style={{ ...A, left: x, top: y, transform: `rotate(${-30 + rnd(i + 2) * 60}deg) scale(${s})` }}>
        <div style={{ ...A, left: -10, top: 52, width: 220, height: 30, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.55),transparent 70%)" }} />
        <div style={{ width: 200, height: 76, borderRadius: "50%", background: `radial-gradient(ellipse at 45% 40%, rgba(255,255,250,${1 - 0.55 * lit}), rgba(240,232,214,${1 - 0.7 * lit}) 55%, rgba(255,236,190,${0.6 + 0.4 * lit}) 100%)`, boxShadow: `inset 0 0 ${18 * lit}px ${6 * lit}px rgba(255,214,140,.9), 0 0 ${26 * lit}px rgba(255,210,130,${0.5 * lit})`, border: `2px solid rgba(255,240,210,${0.4 + 0.6 * lit})` }} />
        <div style={{ ...A, left: 40, top: 14, width: 70, height: 14, borderRadius: "50%", background: "#fff", opacity: 0.6 }} />
      </div>;
    })}
    <Tag tt={tt} at={3.8} x={960} y={300} txt="SEE-THROUGH EDGES" size={60} col={K.goldL} />
  </>;
}}</Stage>;

// B18 · la tapa no se levanta: olla con tapa de vidrio y candado dorado que vibra al forcejeo; se abre, sale la columna de vapor y el medidor cae
export const B18Lid: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const open = 3.0, jig = tt < open ? Math.sin(tt * 38) * cl((tt - 0.6) * 1.5) : 0, lift = eOut(tt, open + 0.3, open + 1.0), gauge = tt < open ? 1 : 1 - eOut(tt, open + 0.3, open + 1.6);
  return <>
    <Shadow x={860} y={930} w={760} k={1} o={0.75} />
    <svg width="760" height="420" viewBox="0 0 760 420" style={{ ...A, left: 480, top: 520, overflow: "visible" }}>
      <defs><linearGradient id="pot18" x1="0" x2="1"><stop offset="0%" stopColor="#3a1a14" /><stop offset="40%" stopColor="#b83a2a" /><stop offset="100%" stopColor="#4a1a12" /></linearGradient></defs>
      <rect x="-40" y="90" width="80" height="34" rx="16" fill="#2a2a2a" /><rect x="720" y="90" width="80" height="34" rx="16" fill="#2a2a2a" />
      <path d="M 20 60 L 20 360 Q 380 430 740 360 L 740 60 Z" fill="url(#pot18)" />
      <ellipse cx="380" cy="60" rx="360" ry="60" fill="#5a1a12" /><ellipse cx="380" cy="60" rx="330" ry="48" fill="#2a1410" />
      <path d="M 60 140 Q 80 300 120 340" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="18" strokeLinecap="round" />
    </svg>
    <div style={{ ...A, left: 480, top: 470 - 300 * lift + jig * 3, width: 760, height: 140, transform: `rotate(${jig * 0.8 - 14 * lift}deg)` }}>
      <svg width="760" height="140" viewBox="0 0 760 140" style={{ overflow: "visible" }}>
        <ellipse cx="380" cy="100" rx="370" ry="56" fill="rgba(220,235,245,.35)" stroke="#9aa3ab" strokeWidth="10" />
        <path d="M 120 80 Q 300 50 520 70" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="10" strokeLinecap="round" />
        <rect x="340" y="40" width="80" height="44" rx="14" fill="#222" />
      </svg>
      {lift < 0.1 && <svg width="120" height="170" viewBox="0 0 120 170" style={{ ...A, left: 400, top: 30, overflow: "visible", transform: `rotate(${jig * 6}deg)`, transformOrigin: "60px 0" }}>
        <path d={`M 30 ${70 - 20 * eio(tt, open - 0.4, open)} L 30 30 A 30 30 0 0 1 90 30 L 90 70`} fill="none" stroke="#c9ced3" strokeWidth="14" />
        <rect x="6" y="66" width="108" height="94" rx="14" fill="#e0b450" stroke="#a87a20" strokeWidth="4" /><circle cx="60" cy="104" r="12" fill="#5a3a10" /><rect x="55" y="110" width="10" height="26" fill="#5a3a10" />
      </svg>}
    </div>
    {tt > open + 0.2 && Array.from({ length: 16 }, (_, i) => { const p = ((tt - open) * 0.7 + i / 16) % 1, s = 90 + 200 * p; return <div key={i} style={{ ...A, left: 860 - s / 2 + Math.sin(tt * 2 + i) * 80 * p, top: 520 - p * 560, width: s, height: s * 1.2, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.55),transparent 66%)", filter: "blur(10px)", opacity: Math.sin(p * Math.PI) * eio(tt, open + 0.2, open + 0.6) }} />; })}
    <svg width="300" height="300" viewBox="0 0 300 300" style={{ ...A, left: 1430, top: 340, overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.55))" }}>
      <circle cx="150" cy="150" r="140" fill="#c9ced3" /><circle cx="150" cy="150" r="118" fill="#fffdf6" />
      <path d="M 50 150 A 100 100 0 0 1 250 150" fill="none" stroke="#e8e2d6" strokeWidth="26" />
      <path d="M 50 150 A 100 100 0 0 1 250 150" fill="none" stroke="#7fbfe8" strokeWidth="26" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - gauge} />
      <line x1="150" y1="150" x2={150 + Math.cos(Math.PI + gauge * Math.PI) * 96} y2={150 + Math.sin(Math.PI + gauge * Math.PI) * 96} stroke={K.wine} strokeWidth="8" strokeLinecap="round" /><circle cx="150" cy="150" r="12" fill="#333" />
      <text x="150" y="220" textAnchor="middle" fontFamily={SANS} fontWeight="900" fontSize="34" fill="#333">STEAM</text>
    </svg>
    <Tag tt={tt} at={1.0} x={860} y={300} txt="KEEP IT ON" size={64} col={K.goldL} />
  </>;
}}</Stage>;

// B19 · la costra del fondo: paila con el disco de arroz dorado pegado; la espátula entra por el borde, lo levanta y la grieta corre con astillas
export const B19Crust: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sp = eio(tt, 0.6, 1.8), lift = eio(tt, 2.0, 3.2), cr = eOut(tt, 2.2, 3.0);
  return <>
    <Skillet x={880} y={740} w={1000} heat={0.3}>
      <div style={{ ...A, left: 120, top: 60, width: 660, height: 290, transformOrigin: "100% 50%", transform: `perspective(800px) rotateY(${-34 * lift}deg) translateY(${-60 * lift}px)` }}>
        <div style={{ ...A, inset: 0, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%,#f2c470,#c8822c 55%,#7a3e10)", boxShadow: "inset 0 -12px 24px rgba(60,20,0,.5), 0 18px 20px rgba(0,0,0,.4)" }} />
        {Array.from({ length: 90 }, (_, i) => <div key={i} style={{ ...A, left: 60 + rnd(i) * 540, top: 40 + rnd(i + 4) * 210, width: 22, height: 9, borderRadius: "50%", background: rnd(i + 8) > 0.5 ? "#ffe0a0" : "#a8601c", transform: `rotate(${rnd(i + 2) * 180}deg)`, opacity: 0.8 }} />)}
        <svg width="660" height="290" style={{ ...A, inset: 0, overflow: "visible" }}><path d="M 640 150 L 520 130 L 430 170 L 330 120 L 240 160 L 140 140" fill="none" stroke="#3a1a04" strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - cr} /></svg>
      </div>
    </Skillet>
    <div style={{ ...A, left: lerp(1700, 1240, sp), top: lerp(560, 680, sp) - 90 * lift, width: 560, height: 120, transform: `rotate(${-8 - 10 * lift}deg)`, transformOrigin: "0 50%", filter: "drop-shadow(0 20px 18px rgba(0,0,0,.5))" }}>
      <div style={{ ...A, left: 0, top: 20, width: 220, height: 90, borderRadius: "12px 40px 40px 12px", background: "linear-gradient(180deg,#f2f4f6,#9aa1a8)" }} />
      <div style={{ ...A, left: 210, top: 54, width: 350, height: 26, borderRadius: 13, background: "linear-gradient(180deg,#3a2a1e,#140c06)" }} />
    </div>
    {tt > 2.3 && Array.from({ length: 16 }, (_, i) => { const d = tt - 2.3 - rnd(i) * 0.4; if (d < 0) return null; const a = -Math.PI * (0.2 + 0.6 * rnd(i + 1)), v = 260 + 300 * rnd(i + 2), x = 1180 + Math.cos(a) * v * d, y = 700 + Math.sin(a) * v * d + 1300 * d * d; return y < 860 && <div key={i} style={{ ...A, left: x, top: y, width: 20, height: 10, borderRadius: "50%", background: "#e8a848", transform: `rotate(${d * 600}deg)`, boxShadow: "0 6px 6px rgba(0,0,0,.45)" }} />; })}
    <Tag tt={tt} at={3.4} x={900} y={300} txt="the best part" size={70} col={K.goldL} font={HAND} />
  </>;
}}</Stage>;

// B20 · la piel es el impermeable: flechas de calor rebotan en la piel; la piel se pela como una capa y el calor entra: la carne se arruga y oscurece
export const B20Coat: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const peel = eio(tt, 2.6, 3.6), dry = eio(tt, 3.4, 4.8);
  return <>
    <Plate x={960} y={820} w={820} />
    <div style={{ ...A, left: 960 - 280, top: 560, filter: `brightness(${1 - 0.35 * dry}) saturate(${1 - 0.4 * dry})`, transform: `scale(${1 - 0.08 * dry})` }}>
      <svg width="560" height="300" viewBox="0 0 560 300" style={{ overflow: "visible" }}>
        <path d="M 30 150 C 40 60, 170 30, 300 40 C 440 50, 540 100, 530 170 C 520 250, 400 280, 280 270 C 140 262, 20 230, 30 150 Z" fill="#7a2a1a" transform="translate(0 14)" />
        <path d="M 30 150 C 40 60, 170 30, 300 40 C 440 50, 540 100, 530 170 C 520 250, 400 280, 280 270 C 140 262, 20 230, 30 150 Z" fill="#e88a7a" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${80 + i * 48} ${90 + rnd(i) * 30} q 20 ${60 + rnd(i + 2) * 40} 0 ${120}`} fill="none" stroke="#b8503e" strokeWidth={3 + 4 * dry} opacity={0.4 + 0.5 * dry} />)}
      </svg>
    </div>
    <div style={{ ...A, left: 960 - 290, top: 548, transformOrigin: "100% 30%", transform: `translateX(${420 * peel}px) translateY(${-200 * peel}px) rotate(${50 * peel}deg)`, opacity: 1 - eio(tt, 4.4, 5.0) }}>
      <svg width="580" height="310" viewBox="0 0 580 310" style={{ overflow: "visible", filter: "drop-shadow(0 20px 24px rgba(0,0,0,.45))" }}>
        <defs><radialGradient id="sk20" cx="40%" cy="30%" r="80%"><stop offset="0%" stopColor="#ffd98a" /><stop offset="60%" stopColor="#d8862c" /><stop offset="100%" stopColor="#8a420e" /></radialGradient></defs>
        <path d="M 20 150 C 30 50, 170 18, 300 28 C 450 40, 560 96, 550 172 C 540 260, 410 292, 280 284 C 130 274, 10 240, 20 150 Z" fill="url(#sk20)" />
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={70 + rnd(i) * 440} cy={70 + rnd(i + 5) * 170} r={6 + rnd(i + 1) * 10} fill="#fff0c0" opacity=".35" />)}
        <path d="M 90 80 C 160 50, 260 46, 340 56" fill="none" stroke="#fff6d8" strokeWidth="12" strokeLinecap="round" opacity=".6" />
      </svg>
    </div>
    {Array.from({ length: 7 }, (_, i) => {
      const p = ((tt * 0.8 + i / 7) % 1), x = 700 + i * 90, through = peel > 0.6, yHit = 560;
      const y = 120 + p * 520, bounced = !through && y > yHit, yy = bounced ? yHit - (y - yHit) : y, show = through ? y < 720 : true;
      return show && <svg key={i} width="40" height="120" style={{ ...A, left: x - 20 + (bounced ? (y - yHit) * 0.6 : 0), top: yy - 120, overflow: "visible", opacity: Math.sin(p * Math.PI), transform: bounced ? "scaleY(-1)" : undefined }}><path d="M 20 0 q 14 20 0 40 q -14 20 0 40 l -12 -10 m 12 10 l 12 -10" fill="none" stroke="#ff8a3a" strokeWidth="8" strokeLinecap="round" /></svg>;
    })}
    <Tag tt={tt} at={4.6} x={960} y={300} txt="KEEP THE SKIN" size={66} col={K.goldL} />
  </>;
}}</Stage>;

// B21 · la gota que baila: dos sartenes; en la fría la gota se aplasta y queda; en la caliente se parte en perlas que patinan con vapor
export const B21Drop: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const T = 1.4, d = tt - T, fy = 160 + 0.5 * 2400 * Math.max(0, tt - 0.8) ** 2;
  return <>
    {[0, 1].map((s) => {
      const cx = s ? 1380 : 540, hot = s === 1;
      return <React.Fragment key={s}>
        <Skillet x={cx} y={760} w={640} heat={hot ? 0.95 : 0} cold={!hot} />
        {hot && Array.from({ length: 5 }, (_, i) => <div key={i} style={{ ...A, left: cx - 200 + i * 90, top: 520 - ((tt * 0.8 + i * 0.2) % 1) * 120, width: 70, height: 140, background: "linear-gradient(180deg,transparent,rgba(255,200,150,.12),transparent)", filter: "blur(6px)", transform: `skewX(${Math.sin(tt * 3 + i) * 12}deg)` }} />)}
        {d < 0 ? <Drop x={cx - 40} y={Math.min(fy, 740)} s={56} /> : hot
          ? Array.from({ length: 6 }, (_, i) => { const a = rnd(i) * Math.PI * 2, rr = 30 + 200 * eOut(tt, T, T + 1.6) * (0.5 + rnd(i + 1) * 0.5); return <React.Fragment key={i}>
              <div style={{ ...A, left: cx - 40 + Math.cos(a) * rr - 40, top: 740 + Math.sin(a) * rr * 0.4 - 2, width: 80, height: 6, borderRadius: 3, background: "rgba(255,255,255,.25)", transform: `rotate(${a * 57.3}deg)`, opacity: 1 - eOut(tt, T, T + 2) }} />
              <Drop x={cx - 40 + Math.cos(a) * rr} y={730 + Math.sin(a) * rr * 0.4 - Math.abs(Math.sin(tt * 18 + i)) * 14} s={24} />
            </React.Fragment>; })
          : <div style={{ ...A, left: cx - 40 - 60, top: 730, width: 120, height: 30, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%,rgba(230,245,255,.95),rgba(170,215,250,.6))", boxShadow: "0 4px 6px rgba(0,0,0,.3)" }} />}
        {hot && d > 0 && <Steam x={cx - 40} y={700} tt={tt} n={5} w={300} k={1 - eio(tt, T + 2, T + 3)} hgt={260} />}
        <div style={{ ...A, left: cx - 140, top: 960, width: 200, textAlign: "center", fontWeight: 900, fontSize: 52, letterSpacing: 4, color: hot ? "#ff9a5a" : K.ice }}>{hot ? "HOT" : "COLD"}</div>
      </React.Fragment>;
    })}
    <Tag tt={tt} at={3.6} x={1380} y={300} txt="IT DANCES" size={66} col={K.goldL} />
  </>;
}}</Stage>;

// B22 · cinco minutos: el charco de jugo del plato vuelve en hilos hacia el muslo (rebobinado) mientras la aguja dibujada a mano da 5 vueltas
export const B22Rest: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const back = eio(tt, 1.0, 4.4), turns = cl((tt - 0.6) / 4.2) * 5;
  return <>
    <Plate x={820} y={780} w={900}>
      <div style={{ ...A, left: 40 + 120 * back, top: 60 + 70 * back, width: 560 - 240 * back, height: 260 - 140 * back, borderRadius: "46% 54% 50% 50%", background: "radial-gradient(ellipse at 40% 35%,rgba(255,226,140,.95),rgba(214,150,40,.8) 70%)", boxShadow: "inset 0 -6px 10px rgba(120,60,0,.3)", opacity: 1 - back * 0.9 }} />
    </Plate>
    <svg width="900" height="300" style={{ ...A, left: 370, top: 640, overflow: "visible" }}>
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M ${120 + i * 120} ${200 - (i % 2) * 30} Q ${300 + i * 30} 150 450 120`} fill="none" stroke="#f2c050" strokeWidth="8" strokeLinecap="round" pathLength={1} strokeDasharray="0.25 1" strokeDashoffset={-((tt * 0.9 + i * 0.15) % 1.25)} opacity={back > 0.05 && back < 0.95 ? 0.9 : 0} />)}
    </svg>
    <div style={{ ...A, left: 820 - 230, top: 560, filter: `drop-shadow(0 0 ${30 * back}px rgba(255,210,120,.5))` }}><Thigh w={460} k={1} sq={0.72} /></div>
    <svg width="380" height="380" viewBox="0 0 380 380" style={{ ...A, left: 1380, top: 250, overflow: "visible" }}>
      <path d="M 190 22 C 290 18, 362 96, 358 196 C 354 296, 280 360, 186 358 C 90 356, 20 286, 24 186 C 28 92, 100 26, 196 24" fill="#fffaf0" stroke={K.ink} strokeWidth="7" strokeLinecap="round" />
      {Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return <line key={i} x1={190 + Math.cos(a) * 140} y1={190 + Math.sin(a) * 140} x2={190 + Math.cos(a) * 158 + rnd(i) * 3} y2={190 + Math.sin(a) * 158} stroke={K.ink} strokeWidth="5" strokeLinecap="round" />; })}
      <path d={`M 190 190 L ${190 + Math.cos(turns * Math.PI * 2 - Math.PI / 2) * 130} ${190 + Math.sin(turns * Math.PI * 2 - Math.PI / 2) * 130}`} stroke={K.red} strokeWidth="9" strokeLinecap="round" />
      <circle cx="190" cy="190" r="12" fill={K.ink} />
      <text x="190" y="270" textAnchor="middle" fontFamily={HAND} fontSize="56" fontWeight="700" fill={K.ink}>{Math.min(5, Math.floor(turns))} min</text>
    </svg>
  </>;
}}</Stage>;

// B23 · cruje como papa frita: el tenedor levanta el borde de la piel crocante y de esa grieta nace la onda del crujido, que se dibuja
export const B23Crunch: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fk = eio(tt, 0.6, 1.6), lift = eio(tt, 1.8, 2.6), wv = cl((tt - 2.2) / 1.6);
  const pts = Array.from({ length: 70 }, (_, i) => { const x = i * 16, env = Math.exp(-(((i - 18) / 10) ** 2)) + 0.5 * Math.exp(-(((i - 38) / 8) ** 2)) + 0.3 * Math.exp(-(((i - 55) / 6) ** 2)); return `${i ? "L" : "M"} ${x} ${130 + (rnd(i) - 0.5) * 240 * env}`; }).join(" ");
  return <>
    <Plate x={720} y={800} w={860} />
    <div style={{ ...A, left: 720 - 260, top: 580 }}><Thigh w={520} k={1} sq={0.7} /></div>
    <div style={{ ...A, left: 760, top: 610, width: 200, height: 70, borderRadius: "50% 50% 40% 40%", background: "linear-gradient(180deg,#ffd98a,#b8661e)", transformOrigin: "0 100%", transform: `rotate(${-28 * lift}deg)`, boxShadow: `0 ${12 * lift}px ${16 * lift}px rgba(0,0,0,.4)` }} />
    <svg width="160" height="420" style={{ ...A, left: lerp(1100, 860, fk), top: lerp(260, 300, fk) - 50 * lift, overflow: "visible", transform: `rotate(${30 - 10 * lift}deg)`, filter: "drop-shadow(0 16px 14px rgba(0,0,0,.5))" }}><rect x="70" y="0" width="20" height="300" rx="8" fill="#d0d5da" />{[0, 1, 2, 3].map((i) => <rect key={i} x={46 + i * 18} y="290" width="10" height="110" rx="5" fill="#e4e8eb" />)}</svg>
    <svg width="1120" height="260" viewBox="0 0 1120 260" style={{ ...A, left: 760, top: 260, overflow: "visible" }}>
      <path d={pts} fill="none" stroke={K.goldL} strokeWidth="6" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - wv} style={{ filter: "drop-shadow(0 0 10px rgba(255,210,120,.7))" }} />
      <line x1="0" y1="130" x2={1120 * wv} y2="130" stroke="rgba(255,236,190,.25)" strokeWidth="2" />
    </svg>
  </>;
}}</Stage>;

// B24 · el limón chilla: medio limón con gajos que la mano aprieta; gotas gruesas caen en la sartén con manteca y estalla el vapor
export const B24Lemon: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sq = eio(tt, 0.8, 1.6) * (1 - eio(tt, 3.6, 4.2)), melt = eio(tt, 0.4, 3.0);
  return <>
    <Skillet x={960} y={780} w={960} heat={0.8}>
      <div style={{ ...A, left: 300 - 60 * melt, top: 110 - 20 * melt, width: 260 + 120 * melt, height: 130 + 40 * melt, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(255,226,120,.85),rgba(220,160,40,.5) 70%,transparent 72%)" }} />
      <div style={{ ...A, left: 380, top: 100 - 30 * (1 - melt), width: 110 * (1 - melt * 0.8), height: 80 * (1 - melt * 0.8), background: "linear-gradient(135deg,#fff3b0,#f0d060)", borderRadius: 10, boxShadow: "0 8px 10px rgba(0,0,0,.35)", opacity: 1 - melt * 0.6 }} />
    </Skillet>
    <div style={{ ...A, left: 960 - 170, top: 150, transform: `scaleX(${1 - 0.18 * sq}) scaleY(${1 + 0.06 * sq})` }}>
      <svg width="340" height="340" viewBox="0 0 340 340" style={{ overflow: "visible", filter: "drop-shadow(0 24px 24px rgba(0,0,0,.5))" }}>
        <circle cx="170" cy="170" r="164" fill="#f0c020" /><circle cx="170" cy="170" r="150" fill="#fff6d0" /><circle cx="170" cy="170" r="138" fill="#f8e070" />
        {Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return <line key={i} x1="170" y1="170" x2={170 + Math.cos(a) * 138} y2={170 + Math.sin(a) * 138} stroke="#fff6d0" strokeWidth="7" />; })}
        {[0, 3, 6].map((i) => { const a = i / 10 * Math.PI * 2 + 0.3, cx = 170 + Math.cos(a) * 70, cy = 170 + Math.sin(a) * 70; return <ellipse key={i} cx={cx} cy={cy} rx="9" ry="15" fill="#fff8e0" transform={`rotate(${a * 57.3} ${cx} ${cy})`} />; })}
        <circle cx="170" cy="170" r="16" fill="#fff6d0" /><ellipse cx="110" cy="100" rx="40" ry="18" fill="#fff" opacity=".35" />
      </svg>
    </div>
    <Hand x={1130} y={150} s={1.1} rot={180} press={sq} />
    {Array.from({ length: 10 }, (_, i) => { const a = 1.0 + i * 0.25, d = tt - a; if (d < 0 || tt > 3.8 + i * 0.05) return null; const y = 470 + 0.5 * 2200 * d * d; return y < 740 && <Drop key={i} x={920 + (rnd(i) - 0.5) * 120} y={y} s={34} col="#fff2a0" />; })}
    {Array.from({ length: 10 }, (_, i) => { const p = ((tt - 1.3) * 0.6 + i / 10) % 1, s = 100 + 260 * p; return tt > 1.3 && <div key={i} style={{ ...A, left: 960 - s / 2 + (rnd(i) - 0.5) * 300 * p, top: 720 - p * 480, width: s, height: s, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.6),transparent 66%)", filter: "blur(10px)", opacity: Math.sin(p * Math.PI) * eio(tt, 1.3, 1.6) }} />; })}
  </>;
}}</Stage>;

// B25 · más barato por libra: dos bandejas de carne frente a frente; arriba de cada una un cartel de tablillas que gira hasta su precio
const Flap: React.FC<{ tt: number; at: number; txt: string; w?: number }> = ({ tt, at, txt, w = 90 }) => <div style={{ display: "flex", gap: 8 }}>{txt.split("").map((ch, i) => {
  const done = tt > at + i * 0.18, digs = "0123456789", cur = done ? ch : (/[0-9]/.test(ch) ? digs[Math.floor((tt * 18 + i * 3) % 10)] : ch), fl = done ? 0 : ((tt * 18) % 1);
  return <div key={i} style={{ position: "relative", width: w, height: w * 1.4, borderRadius: 10, background: "linear-gradient(180deg,#1e1e1e 49%,#000 50%,#161616 51%)", boxShadow: "0 12px 20px rgba(0,0,0,.6)", color: "#f4efe2", fontFamily: SANS, fontWeight: 900, fontSize: w * 1.0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
    <span>{cur}</span><div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "50%", background: "#262626", transformOrigin: "50% 100%", transform: `rotateX(${fl * 180}deg)`, opacity: fl > 0 ? 0.8 : 0 }} />
  </div>;
})}</div>;
const MeatTray: React.FC<{ x: number; w: number; n: number; s: number }> = ({ x, w, n, s }) => { const cols = Math.ceil(n / 2); return <div style={{ ...A, left: x - w / 2, top: 700, width: w, height: w * 0.42, transform: `perspective(1200px) rotateX(46deg) scale(${s})` }}>
  <div style={{ ...A, inset: 0, borderRadius: 30, background: "linear-gradient(180deg,#fbfaf6,#d8d4c8)", boxShadow: "0 50px 70px rgba(0,0,0,.65), inset 0 0 0 18px #efede7" }} />
  {Array.from({ length: n }, (_, i) => <div key={i} style={{ ...A, left: 24 + (i % cols) * ((w - 60) / cols), top: 20 + Math.floor(i / cols) * (w * 0.18) }}><Thigh w={Math.min(150, (w - 60) / cols * 1.05)} rot={rnd(i) * 30 - 15} /></div>)}
</div>; };
export const B25Flap: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const win = eio(tt, 3.6, 4.2);
  return <>
    <Shadow x={540} y={900} w={420} k={1} /><Shadow x={1340} y={920} w={820} k={1} />
    <MeatTray x={540} w={400} n={2} s={phys(tt, 0.2, 7, 0.5)} />
    <MeatTray x={1340} w={820} n={10} s={phys(tt, 0.9, 7, 0.5)} />
    <div style={{ ...A, left: 540, top: 340, transform: "translateX(-50%)" }}><Flap tt={tt} at={0.8} txt="3.49" w={86} /></div>
    <div style={{ ...A, left: 1340, top: 340, transform: "translateX(-50%)" }}><Flap tt={tt} at={1.6} txt="1.99" w={86} /></div>
    <div style={{ ...A, left: 540, top: 500, transform: "translateX(-50%)", fontWeight: 900, fontSize: 40, color: K.dim, letterSpacing: 3 }}>PER POUND</div>
    <div style={{ ...A, left: 1340, top: 500, transform: "translateX(-50%)", fontWeight: 900, fontSize: 40, color: K.dim, letterSpacing: 3 }}>PER POUND</div>
    <div style={{ ...A, left: 1340 - 210, top: 250, width: 420, height: 64, borderRadius: 32, background: K.green, color: K.ink, fontWeight: 900, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 3, transform: `scale(${phys(tt, 3.6, 8, 0.4)})`, boxShadow: `0 0 ${40 * win}px rgba(127,214,154,.6)` }}>FAMILY PACK</div>
  </>;
}}</Stage>;

// B26 · día de caldo: bolsa de freezer translúcida con «BONES» en marcador; los huesos caen de a uno con rebote y se apilan; al quinto se enciende
const Bone: React.FC<{ w: number; rot: number }> = ({ w, rot }) => <svg width={w} height={w * 0.36} viewBox="0 0 200 72" style={{ overflow: "visible", transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 10px 10px rgba(0,0,0,.45))" }}>
  <defs><linearGradient id="bn26" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fffaf0" /><stop offset="100%" stopColor="#d8c8a8" /></linearGradient></defs>
  <path d="M 30 20 A 16 16 0 1 1 40 36 L 160 36 A 16 16 0 1 1 170 20 A 16 16 0 1 1 160 52 L 40 52 A 16 16 0 1 1 30 20 Z" fill="url(#bn26)" stroke="#bfae8c" strokeWidth="2" />
  <rect x="40" y="38" width="120" height="6" rx="3" fill="#fff" opacity=".7" />
</svg>;
export const B26Bones: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise" tone="cold">{(tt) => {
  const slots = [[90, 330, -8], [300, 320, 10], [150, 230, 6], [360, 220, -12], [240, 130, 4]], glow = eio(tt, 3.3, 4.0);
  return <>
    <Shadow x={940} y={950} w={680} k={1} o={0.7} />
    <div style={{ ...A, left: 940 - 320, top: 360, width: 640, height: 590, borderRadius: "20px 20px 40px 40px", background: `linear-gradient(160deg,rgba(255,255,255,.4),rgba(200,225,245,${0.15 + 0.25 * glow}) 50%,rgba(255,255,255,.3))`, border: "4px solid rgba(255,255,255,.65)", boxShadow: `0 40px 60px rgba(0,0,0,.45), inset 0 0 ${120 * glow}px rgba(255,200,120,${0.55 * glow})` }}>
      <div style={{ ...A, left: 0, right: 0, top: 14, height: 18, background: "linear-gradient(90deg,#3d8fd0,#6bc0f2)" }} />
      {slots.map(([x, y, rot], i) => { const a = 0.4 + i * 0.55, yy = bounce(tt, a, 700); return tt > a && <div key={i} style={{ ...A, left: x, top: y + yy }}><Bone w={240} rot={rot} /></div>; })}
      <div style={{ ...A, left: 40, top: 50, fontFamily: MARK, fontSize: 84, color: "#1d2b5a", transform: "rotate(-4deg)" }}>BONES</div>
      <div style={{ ...A, right: 50, top: 70, fontFamily: MARK, fontSize: 64, color: "#1d2b5a", letterSpacing: 6 }}>{"I".repeat(Math.min(5, Math.max(0, Math.floor((tt - 0.4) / 0.55) + 1)))}</div>
    </div>
    <Tag tt={tt} at={3.5} x={1500} y={560} txt="broth day" size={78} col={K.goldL} font={HAND} />
  </>;
}}</Stage>;

// B27 · el frasco de grasa de 1955: la cuchara entra al frasco, sale con un copo blanco y lo deja caer en la sartén de papas, donde se derrite
export const B27Jar: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const dip = eio(tt, 0.6, 1.4) * (1 - eio(tt, 1.6, 2.2)), carry = eio(tt, 2.0, 3.0), drop = tt > 3.1, melt = eio(tt, 3.3, 4.6);
  const sx = lerp(560, 1250, carry), sy = 380 + 180 * dip - 60 * Math.sin(carry * Math.PI);
  return <>
    <Shadow x={560} y={920} w={420} k={1} o={0.7} />
    <svg width="380" height="460" viewBox="0 0 380 460" style={{ ...A, left: 370, top: 460, overflow: "visible" }}>
      <rect x="40" y="0" width="300" height="56" rx="10" fill="#c9a24a" /><rect x="40" y="40" width="300" height="10" fill="#8a6a20" />
      <path d="M 30 70 Q 20 60 40 56 L 340 56 Q 360 60 350 70 L 350 420 Q 190 470 30 420 Z" fill="rgba(230,240,245,.25)" stroke="rgba(255,255,255,.6)" strokeWidth="4" />
      <path d="M 36 170 L 344 170 L 344 418 Q 190 466 36 418 Z" fill="#f4ecd6" /><path d="M 36 170 Q 190 150 344 170" fill="none" stroke="#fffaf0" strokeWidth="6" />
      <rect x="70" y="230" width="240" height="110" rx="6" fill="#efe2bf" transform="rotate(-3 190 285)" />
      <text x="190" y="315" textAnchor="middle" fontFamily={MARK} fontSize="78" fill="#2a1a0c" transform="rotate(-3 190 285)">1955</text>
      <rect x="54" y="80" width="18" height="320" rx="9" fill="rgba(255,255,255,.35)" />
    </svg>
    <Skillet x={1350} y={800} w={720} heat={0.6}>
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ ...A, left: 70 + (i % 5) * 100 + (i > 4 ? 50 : 0), top: 70 + Math.floor(i / 5) * 90, width: 92, height: 70, borderRadius: 18, background: "radial-gradient(ellipse at 40% 35%,#ffe08a,#c8802a)", boxShadow: "0 6px 8px rgba(0,0,0,.4)", transform: `rotate(${rnd(i) * 40 - 20}deg)` }} />)}
      <div style={{ ...A, left: 230 - 100 * melt, top: 110 - 30 * melt, width: 140 + 200 * melt, height: 70 + 80 * melt, borderRadius: "50%", background: `radial-gradient(ellipse,rgba(255,240,200,${0.9 - 0.5 * melt}),transparent 70%)`, opacity: drop ? 1 : 0 }} />
    </Skillet>
    <div style={{ ...A, left: sx - 40, top: sy - 330, width: 90, height: 420, transform: `rotate(${lerp(10, -20, carry)}deg)`, transformOrigin: "50% 100%", filter: "drop-shadow(0 16px 14px rgba(0,0,0,.45))" }}>
      <div style={{ ...A, left: 34, top: 0, width: 20, height: 320, borderRadius: 10, background: "linear-gradient(90deg,#9aa1a8,#f2f4f6,#7a8188)" }} />
      <div style={{ ...A, left: 6, top: 310, width: 78, height: 100, borderRadius: "45% 45% 50% 50%", background: "linear-gradient(90deg,#9aa1a8,#f2f4f6,#7a8188)" }} />
      {tt > 1.4 && !drop && <div style={{ ...A, left: 12, top: 300, width: 66, height: 50, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(circle at 40% 35%,#fffdf4,#e8dcc0)" }} />}
    </div>
    {drop && tt < 3.5 && <div style={{ ...A, left: 1290, top: 420 + 0.5 * 2400 * (tt - 3.1) ** 2, width: 66, height: 50, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fffdf4,#e8dcc0)" }} />}
    <Steam x={1350} y={720} tt={tt} n={5} w={360} k={melt} hgt={280} />
  </>;
}}</Stage>;

// B28 · ciento cincuenta: el salón parroquial en perspectiva; las sillas plegables se despliegan fila por fila desde el fondo; la última, con delantal y cuchara
const Chair: React.FC<{ s: number; open: number; apron?: boolean }> = ({ s, open, apron }) => <svg width={80 * s} height={120 * s} viewBox="0 0 80 120" style={{ overflow: "visible", filter: `drop-shadow(0 ${8 * s}px ${6 * s}px rgba(0,0,0,.5))` }}>
  <g transform={`translate(40 120) scale(1 ${open}) translate(-40 -120)`}>
    <rect x="12" y="10" width="56" height="40" rx="6" fill="#9aa1a8" /><rect x="10" y="62" width="60" height="12" rx="4" fill="#b8bec4" />
    <line x1="16" y1="50" x2="12" y2="120" stroke="#6e757c" strokeWidth="6" /><line x1="64" y1="50" x2="68" y2="120" stroke="#6e757c" strokeWidth="6" />
    {apron && <><path d="M 22 14 L 58 14 L 62 60 L 18 60 Z" fill="#e8b4c4" /><path d="M 26 20 L 54 20" stroke="#fff" strokeWidth="3" /><rect x="58" y="0" width="6" height="60" rx="3" fill="#b8844a" transform="rotate(20 60 30)" /></>}
  </g>
</svg>;
export const B28Chairs: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="night">{(tt) => {
  const spot = eio(tt, 3.8, 4.6);
  return <>
    <div style={{ ...A, left: -200, top: 380, width: 2320, height: 900, transform: "perspective(900px) rotateX(62deg)", transformOrigin: "50% 0", background: "repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 2px,transparent 2px 120px),repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 2px,transparent 2px 120px),linear-gradient(180deg,#3a3028,#1a1410)" }} />
    {Array.from({ length: 6 }, (_, rw) => { const back = 5 - rw, s = 0.55 + rw * 0.22, y = 400 + rw * 95 + rw * rw * 6, n = 9 - Math.floor(rw / 2); return Array.from({ length: n }, (_, c) => {
      const a = 0.3 + back * 0.4 + c * 0.04, op = eOut(tt, a, a + 0.35), x = 960 + (c - (n - 1) / 2) * (110 + rw * 45), last = rw === 5 && c === Math.floor(n / 2);
      return <div key={rw * 20 + c} style={{ ...A, left: x - 40 * s, top: y, opacity: cl(op * 3) * (last ? 1 : 1 - spot * 0.55), zIndex: rw }}><Chair s={s} open={Math.max(0.05, op)} apron={last} /></div>;
    }); })}
    <div style={{ ...A, left: 960 - 300, top: 0, width: 600, height: 1080, background: "linear-gradient(180deg,rgba(255,236,190,0),rgba(255,226,170,.3))", clipPath: "polygon(44% 0,56% 0,100% 100%,0 100%)", opacity: spot }} />
    <Tag tt={tt} at={2.6} x={960} y={250} txt="150 PEOPLE" size={72} col={K.goldL} />
  </>;
}}</Stage>;

// B29 · los fideos lo espesan: primero cae agua rápida que salpica; después un hilo grueso y lento de caldo con fideos que forma un montículo
export const B29Thick: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const ph2 = tt > 2.6, w1 = eio(tt, 0.6, 0.9) * (1 - eio(tt, 2.1, 2.4)), w2 = eio(tt, 2.8, 3.4), mound = eio(tt, 3.2, 5.2);
  return <>
    <Plate x={960} y={840} w={760}>
      <div style={{ ...A, left: 260 - 160 * mound, top: 110 - 70 * mound, width: 20 + 320 * mound, height: 20 + 140 * mound, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 40% 30%,#ffe6a0,#d8a040 70%)", boxShadow: "0 8px 10px rgba(0,0,0,.3)" }} />
      {mound > 0.2 && Array.from({ length: 10 }, (_, i) => <div key={i} style={{ ...A, left: 160 + rnd(i) * 220, top: 60 + rnd(i + 3) * 70, width: 70, height: 14, borderRadius: 7, background: "#fff2c0", transform: `rotate(${rnd(i + 5) * 180}deg)`, opacity: mound }} />)}
    </Plate>
    <div style={{ ...A, left: 760, top: 120, width: 400, height: 200, transform: `rotate(${ph2 ? 26 : 34}deg)`, filter: "drop-shadow(0 20px 20px rgba(0,0,0,.5))" }}>
      <div style={{ ...A, left: 180, top: 70, width: 340, height: 26, borderRadius: 13, background: "linear-gradient(180deg,#e2e6ea,#7c838a)" }} />
      <div style={{ ...A, left: 0, top: 10, width: 220, height: 150, borderRadius: "0 0 110px 110px", background: "linear-gradient(180deg,#e2e6ea,#8d949b)" }} />
    </div>
    {!ph2 && <div style={{ ...A, left: 948, top: 300, width: 14, height: 520 * w1, background: "repeating-linear-gradient(180deg,rgba(210,236,255,.95) 0 20px,rgba(160,210,250,.5) 20px 34px)", backgroundPosition: `0 ${tt * 900}px`, borderRadius: 7 }} />}
    {!ph2 && tt > 0.9 && Array.from({ length: 14 }, (_, i) => { const p = ((tt * 2.4 + i / 14) % 1), a = -Math.PI * (0.15 + 0.7 * rnd(i)); return <Drop key={i} x={955 + Math.cos(a) * 260 * p} y={830 + Math.sin(a) * 220 * p + 400 * p * p} s={14} o={1 - p} />; })}
    {ph2 && <div style={{ ...A, left: 930, top: 300, width: 50, height: 470 * w2, background: "linear-gradient(90deg,#c88a2a,#ffe08a 50%,#c88a2a)", borderRadius: 25, overflow: "hidden" }}>
      {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ ...A, left: 6, top: ((tt * 60 + i * 90) % 460), width: 38, height: 12, borderRadius: 6, background: "#fff2c0" }} />)}
    </div>}
    <Tag tt={tt} at={3.8} x={1500} y={480} txt="NO CORNSTARCH" size={60} col={K.goldL} />
  </>;
}}</Stage>;

// B30 · dos tenedores: el cuchillo se cruza en rojo y sale volando; dos tenedores abren el muslo entero en hebras que caen al plato con vapor
export const B30Forks: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const kn = eio(tt, 0.4, 1.0), x = eio(tt, 1.2, 1.6), fly = eIn(tt, 1.8, 2.4), pull = eio(tt, 2.6, 4.2);
  return <>
    <Plate x={960} y={820} w={900} />
    {Array.from({ length: 9 }, (_, i) => { const dx = (i - 4) * 70 * pull, sh = i % 2 ? 1 : -1; return <div key={i} style={{ ...A, left: 960 - 40 + dx, top: 690 + Math.abs(i - 4) * 10 * pull, width: 80, height: 130, borderRadius: "40% 40% 50% 50%", background: "linear-gradient(90deg,#c8783a,#f0b07a 50%,#b8662a)", transform: `rotate(${sh * 18 * pull + (i - 4) * 4}deg)`, opacity: pull > 0.02 ? 1 : 0, boxShadow: "0 8px 10px rgba(0,0,0,.35)" }} />; })}
    <div style={{ ...A, left: 960 - 250, top: 600, opacity: 1 - eio(tt, 2.6, 2.9) }}><Thigh w={500} k={1} sq={0.75} /></div>
    <div style={{ ...A, left: lerp(1700, 1200, kn) + 900 * fly, top: 420 - 500 * fly, transform: `rotate(${-30 + 300 * fly}deg)`, filter: "drop-shadow(0 16px 16px rgba(0,0,0,.5))" }}>
      <div style={{ width: 420, height: 46, borderRadius: "4px 60px 60px 4px", background: "linear-gradient(180deg,#f2f4f6,#9aa1a8)" }} /><div style={{ ...A, left: -170, top: 6, width: 180, height: 36, borderRadius: 14, background: "#3a2a1e" }} />
      <svg width="420" height="200" style={{ ...A, left: 0, top: -80, overflow: "visible" }}><line x1="60" y1="20" x2={60 + 300 * x} y2={20 + 160 * x} stroke={K.red} strokeWidth="18" strokeLinecap="round" /><line x1="360" y1="20" x2={360 - 300 * x} y2={20 + 160 * x} stroke={K.red} strokeWidth="18" strokeLinecap="round" /></svg>
    </div>
    {[-1, 1].map((s) => <svg key={s} width="160" height="460" style={{ ...A, left: 960 - 80 + s * (60 + 220 * pull), top: lerp(120, 330, eio(tt, 2.0, 2.6)), overflow: "visible", transform: `rotate(${s * (10 + 20 * pull)}deg)`, filter: "drop-shadow(0 16px 14px rgba(0,0,0,.5))", opacity: eio(tt, 1.9, 2.3) }}><rect x="70" y="0" width="20" height="300" rx="8" fill="#d0d5da" />{[0, 1, 2, 3].map((i) => <rect key={i} x={46 + i * 18} y="290" width="10" height="120" rx="5" fill="#e4e8eb" />)}</svg>)}
    <Steam x={960} y={660} tt={tt} n={6} w={400} k={pull} />
    <Tag tt={tt} at={4.2} x={1560} y={560} txt="COOK IT WHOLE" size={62} col={K.goldL} />
  </>;
}}</Stage>;

// B31 · dos horas a fuego mínimo: reloj de pared grande cuyas agujas dan 2 vueltas; la olla humea al lado y la luz de la ventana cruza la pared
export const B31Clock: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const p = cl((tt - 0.4) / 4.6), mins = p * 120, sun = lerp(-300, 900, p);
  return <>
    <div style={{ ...A, left: sun, top: 120, width: 520, height: 700, background: "linear-gradient(90deg,transparent,rgba(255,220,160,.16),transparent)", transform: "skewX(-18deg)", filter: "blur(12px)" }} />
    <svg width="520" height="520" viewBox="0 0 520 520" style={{ ...A, left: 340, top: 180, overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
      <circle cx="260" cy="260" r="250" fill="#5a3a22" /><circle cx="260" cy="260" r="226" fill="#fffaf0" /><circle cx="260" cy="260" r="226" fill="none" stroke="#d8c8a0" strokeWidth="6" />
      {Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2 - Math.PI / 2; return <text key={i} x={260 + Math.cos(a) * 180} y={260 + Math.sin(a) * 180 + 16} textAnchor="middle" fontFamily={SERIF} fontSize="46" fill={K.ink}>{i === 0 ? 12 : i}</text>; })}
      <line x1="260" y1="260" x2={260 + Math.cos((mins / 60) * Math.PI * 2 - Math.PI / 2) * 190} y2={260 + Math.sin((mins / 60) * Math.PI * 2 - Math.PI / 2) * 190} stroke={K.ink} strokeWidth="10" strokeLinecap="round" />
      <line x1="260" y1="260" x2={260 + Math.cos(((4 + mins / 60) / 12) * Math.PI * 2 - Math.PI / 2) * 120} y2={260 + Math.sin(((4 + mins / 60) / 12) * Math.PI * 2 - Math.PI / 2) * 120} stroke={K.ink} strokeWidth="16" strokeLinecap="round" />
      <circle cx="260" cy="260" r="16" fill={K.wine} />
    </svg>
    <Shadow x={1360} y={940} w={600} k={1} o={0.7} />
    <svg width="560" height="380" viewBox="0 0 560 380" style={{ ...A, left: 1080, top: 580, overflow: "visible" }}>
      <defs><linearGradient id="pot31" x1="0" x2="1"><stop offset="0%" stopColor="#2a2a2e" /><stop offset="45%" stopColor="#7a7a82" /><stop offset="100%" stopColor="#222226" /></linearGradient></defs>
      <rect x="-30" y="70" width="60" height="26" rx="12" fill="#1a1a1a" /><rect x="530" y="70" width="60" height="26" rx="12" fill="#1a1a1a" />
      <path d="M 20 50 L 20 320 Q 280 380 540 320 L 540 50 Z" fill="url(#pot31)" /><ellipse cx="280" cy="50" rx="260" ry="46" fill="#3a3a3e" /><ellipse cx="280" cy="52" rx="236" ry="36" fill="#c88a2a" />
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={120 + rnd(i) * 320} cy={44 + rnd(i + 2) * 16} r={6 + 4 * Math.abs(Math.sin(tt * 2 + i))} fill="#ffe08a" opacity=".7" />)}
    </svg>
    <Steam x={1360} y={600} tt={tt} n={6} w={360} />
    <Tag tt={tt} at={2.4} x={600} y={830} txt="2 HOURS" size={66} col={K.goldL} />
  </>;
}}</Stage>;

// B32 · si espiás, se bajan: seis bolitas de masa se inflan bajo la tapa de vidrio que se empaña; al levantar la tapa se desinflan una por una
export const B32Puff: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const puff = eio(tt, 0.4, 2.4), fog = eio(tt, 0.6, 2.6), L = 3.0, lift = eOut(tt, L, L + 0.6);
  return <>
    <Skillet x={940} y={760} w={1000} heat={0.5}>
      <div style={{ ...A, left: 80, top: 50, width: 740, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse,#e0a040,#a85a14 75%)" }} />
      {Array.from({ length: 6 }, (_, i) => { const de = eio(tt, L + 0.3 + i * 0.22, L + 0.7 + i * 0.22), s = (0.55 + 0.5 * puff) * (1 - 0.4 * de), x = 150 + (i % 3) * 210, y = 70 + Math.floor(i / 3) * 120;
        return <div key={i} style={{ ...A, left: x, top: y + 40 * (1 - s), width: 180 * s, height: 130 * s, borderRadius: "50% 50% 44% 44%", background: "radial-gradient(ellipse at 40% 30%,#fffdf4,#efe0c0 60%,#c8a878)", boxShadow: "0 10px 12px rgba(0,0,0,.35)" }} />; })}
    </Skillet>
    <div style={{ ...A, left: 940 - 470, top: 570 - 360 * lift, width: 940, height: 300, transform: `rotate(${-16 * lift}deg)` }}>
      <svg width="940" height="300" viewBox="0 0 940 300" style={{ overflow: "visible" }}>
        <ellipse cx="470" cy="150" rx="460" ry="140" fill={`rgba(235,242,248,${0.12 + 0.5 * fog * (1 - lift * 0.8)})`} stroke="#9aa3ab" strokeWidth="12" />
        <path d="M 160 90 Q 380 30 640 60" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="12" strokeLinecap="round" />
        <rect x="420" y="40" width="100" height="50" rx="16" fill="#222" />
      </svg>
    </div>
    {tt > L && <Steam x={940} y={640} tt={tt} n={10} w={600} k={1 - eio(tt, L + 1.5, L + 2.6)} hgt={460} />}
    <Tag tt={tt} at={0.9} x={940} y={300} txt="DON'T PEEK" size={68} col={K.goldL} />
  </>;
}}</Stage>;

// B33 · diez dólares, siete cenas: la tijera recorre el billete de 10 y lo corta en tiras; cada tira cae en un platito con su precio
export const B33Bill: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const N = 7, cut = cl((tt - 0.8) / 2.2), cx = 360 + cut * 1200, sw = 1200 / N;
  return <>
    {Array.from({ length: N }, (_, i) => {
      const x0 = 360 + i * sw, cutAt = 0.8 + ((i + 1) / N) * 2.2, d = tt - cutAt, py = 900, px = 260 + i * 236;
      const fallP = cl(d / 0.6), x = lerp(x0, px - sw / 2, eio(tt, cutAt, cutAt + 0.6)), y = lerp(260, py - 230, fallP * fallP);
      return <React.Fragment key={i}>
        <Plate x={px} y={py} w={220} />
        <div style={{ ...A, left: px - 70, top: py + 40, width: 140, textAlign: "center", fontWeight: 900, fontSize: 40, color: K.goldL, opacity: cl(d * 2) }}>$1.43</div>
        <div style={{ ...A, left: x, top: y, width: sw - 4, height: 520, overflow: "hidden", transformOrigin: "50% 100%", transform: `rotate(${d > 0 ? (rnd(i) - 0.5) * 16 * fallP : 0}deg) scale(${lerp(1, 0.32, fallP)})`, boxShadow: "0 18px 24px rgba(0,0,0,.4)" }}>
          <div style={{ ...A, left: -(i * sw), top: 0, width: 1200, height: 520, background: "linear-gradient(180deg,#dfe8d4,#c4d4b4)", boxShadow: "inset 0 0 0 18px #6a8a5a, inset 0 0 0 26px #dfe8d4, inset 0 0 0 30px #6a8a5a" }}>
            <div style={{ ...A, left: 60, top: 40, fontFamily: SERIF, fontSize: 130, color: "#2e4a26" }}>10</div>
            <div style={{ ...A, right: 60, bottom: 30, fontFamily: SERIF, fontSize: 130, color: "#2e4a26" }}>10</div>
            <div style={{ ...A, left: 470, top: 110, width: 260, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse,#b8c8a4,#8aa47a)", boxShadow: "inset 0 0 0 10px #6a8a5a" }} />
            <div style={{ ...A, left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: SERIF, fontSize: 48, letterSpacing: 10, color: "#2e4a26" }}>TEN DOLLARS</div>
          </div>
        </div>
      </React.Fragment>;
    })}
    {tt > 0.6 && tt < 3.2 && <svg width="260" height="200" viewBox="0 0 260 200" style={{ ...A, left: cx - 60, top: 140, overflow: "visible", filter: "drop-shadow(0 16px 16px rgba(0,0,0,.5))" }}>
      <path d={`M 60 100 L 250 ${100 - 30 * Math.abs(Math.sin(tt * 14))}`} stroke="#d8dde2" strokeWidth="16" strokeLinecap="round" /><path d={`M 60 100 L 250 ${100 + 30 * Math.abs(Math.sin(tt * 14))}`} stroke="#b8bec4" strokeWidth="16" strokeLinecap="round" />
      <circle cx="30" cy="70" r="28" fill="none" stroke={K.red} strokeWidth="14" /><circle cx="30" cy="130" r="28" fill="none" stroke={K.red} strokeWidth="14" /><circle cx="60" cy="100" r="8" fill="#333" />
    </svg>}
  </>;
}}</Stage>;

// B34 · aunque sea una tostada: la tostadora cromada salta, la tostada sube, flota y se vuelve el globo de comentario; otra tostada se pega como respuesta
const Toast: React.FC<{ s?: number }> = ({ s = 1 }) => <div style={{ width: 240 * s, height: 220 * s, borderRadius: `${60 * s}px ${60 * s}px ${14 * s}px ${14 * s}px`, background: "radial-gradient(ellipse at 50% 45%,#f6d49a,#d8984a 70%)", boxShadow: `inset 0 0 0 ${12 * s}px #a8642a, 0 14px 20px rgba(0,0,0,.45)` }} />;
export const B34Toast: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const pop1 = 0.8, up = eOut(tt, pop1, pop1 + 0.6), morph = eio(tt, 1.6, 2.4), pop2 = 3.0, up2 = eOut(tt, pop2, pop2 + 0.6), dock = eio(tt, pop2 + 0.6, pop2 + 1.3);
  return <>
    <Shadow x={820} y={940} w={600} k={1} o={0.75} />
    <div style={{ ...A, left: lerp(610, 980, morph), top: lerp(620, 140, up) - 30 * morph }}>
      <div style={{ opacity: 1 - morph, transform: `rotate(${360 * morph}deg)` }}><Toast /></div>
      <div style={{ ...A, left: 0, top: 0, width: 700, height: 220, borderRadius: 50, background: "radial-gradient(ellipse at 50% 40%,#f6d49a,#e0a85a 80%)", boxShadow: "inset 0 0 0 12px #a8642a, 0 24px 40px rgba(0,0,0,.5)", opacity: morph, transform: `scale(${0.4 + 0.6 * morph})`, transformOrigin: "0 100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: K.ink }}>What did you cook?</div>
      <svg width="80" height="80" style={{ ...A, left: 40, top: 200, opacity: morph, overflow: "visible" }}><path d="M 0 0 L 60 0 L 10 70 Z" fill="#e0a85a" stroke="#a8642a" strokeWidth="10" strokeLinejoin="round" /></svg>
    </div>
    <div style={{ ...A, left: lerp(830, 1260, dock), top: lerp(620, 420, up2) - 20 * dock, opacity: tt > pop2 ? 1 : 0 }}>
      <div style={{ opacity: 1 - dock }}><Toast s={0.8} /></div>
      <div style={{ ...A, left: 0, top: 0, width: 420, height: 160, borderRadius: 40, background: "radial-gradient(ellipse at 50% 40%,#f6d49a,#e0a85a 80%)", boxShadow: "inset 0 0 0 10px #a8642a, 0 20px 30px rgba(0,0,0,.45)", opacity: dock, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: K.ink }}>toast! ♥</div>
    </div>
    <div style={{ ...A, left: 820 - 300, top: 600, width: 600, height: 340, borderRadius: "70px 70px 30px 30px", background: "linear-gradient(90deg,#8d949b,#f4f7f9 35%,#c9ced3 60%,#6e767e)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }}>
      <div style={{ ...A, left: 90, top: 22, width: 160, height: 26, borderRadius: 13, background: "#1a1a1a" }} /><div style={{ ...A, left: 350, top: 22, width: 160, height: 26, borderRadius: 13, background: "#1a1a1a" }} />
      <div style={{ ...A, right: -40, top: 120 + 80 * (tt < pop1 ? 0 : 1 - up), width: 60, height: 40, borderRadius: 10, background: "#2a2a2a" }} />
      <div style={{ ...A, left: 60, top: 70, width: 160, height: 60, borderRadius: "50%", background: "rgba(255,255,255,.5)", filter: "blur(6px)" }} />
    </div>
  </>;
}}</Stage>;

import { Odo as OdoK, Stage as StageK, H as HK } from "./kit";
import { Img as ImgK } from "remotion";
type CPk = { t: number; h: HK };

// ───────────── v6 (ronda 3 del evaluador): el OBJETO es una foto real de la cocina de Loretta; la cámara viaja en curva hacia él,
// un elemento físico en código actúa sobre la foto y una sola palabra grande vive dentro de la escena (nunca arriba a la izquierda).
const FA: React.CSSProperties = { position: "absolute" };
type Fx = (tt: number, d: number) => React.ReactNode;   // d = duración del componente
const Foto: React.FC<CPk & { id: string; fx: number; fy: number; z?: number; word: string; wx?: number; wy?: number; wa?: number; mode?: "iris" | "wipe" | "blinds" | "split" | "drop" | "rise"; fx2?: Fx }> = ({ t, h, id, fy, word, wa = 1.4, mode = "iris", fx2 }) => <StageK t={t} h={h} mode={mode} table={false}>{(tt) => {
  const d = h.out - h.at, k = eio(tt, 0, d), s = lerp(1.0, 1.1, k), pan = 0.6 * 960 * (s - 1) * (1 - 2 * k), oy = fy * 1080;
  const ca = phys(tt, 0.05, 6, 0.55), sweep = cl((tt - 0.6) / 2.2), CW = 1540, CH = 866, CX = (1920 - CW) / 2, CY = 34;
  const fs = Math.min(104, 1640 / (word.length * 0.6));
  return <>
    <ImgK src={img(id)} style={{ ...FA, left: -160, top: -90, width: 2240, height: 1260, objectFit: "cover", filter: "blur(34px) brightness(.42) saturate(1.15)", transform: `scale(${lerp(1.06, 1.0, k)})` }} />
    <div style={{ ...FA, left: CX, top: CY, width: CW, height: CH, transform: `translateY(${(1 - ca) * 60}px) rotate(${lerp(-1.1, 0, ca) + lerp(0, 0.35, k)}deg)`, borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.6), 0 6px 14px rgba(0,0,0,.45)", outline: "6px solid rgba(250,244,230,.92)" }}>
      <div style={{ ...FA, left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `translate(${(CW - 1920) / 2 + pan}px, ${(CH - 1080) / 2}px) scale(${s * CW / 1920 * 1.0})`, }}>
        <ImgK src={img(id)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
        {fx2 && fx2(tt, d)}
      </div>
      <div style={{ ...FA, inset: 0, background: `linear-gradient(105deg, transparent ${sweep * 140 - 40}%, rgba(255,246,220,.16) ${sweep * 140 - 25}%, transparent ${sweep * 140 - 10}%)` }} />
    </div>
    <div style={{ ...FA, left: 960, top: CY + CH + (1080 - CY - CH) / 2 + 4, transform: `translate(-50%,-50%) translateY(${(1 - phys(tt, wa, 7, 0.5)) * 40}px) scale(${0.88 + 0.12 * phys(tt, wa, 7, 0.5)})`, opacity: cl((tt - wa) * 4), fontFamily: SERIF, fontWeight: 900, fontSize: fs, color: K.goldL, letterSpacing: 2, whiteSpace: "nowrap", textShadow: "0 5px 0 rgba(60,30,0,.55), 0 12px 30px rgba(0,0,0,.8)" }}>{word}</div>
  </>;
}}</StageK>;
// monedas que caen con rebote y se apilan
const Coins = (tt: number, a: number, x: number, y: number, n = 6): React.ReactNode => tt < -1e9 && Array.from({ length: n }, (_, i) => {
  const st = a + i * 0.18, dd = tt - st; if (dd < 0) return null;
  const T = 0.42, yy = dd < T ? lerp(-500, 0, (dd / T) ** 2) : -Math.abs(Math.sin((dd - T) * 12)) * 26 * Math.exp(-(dd - T) * 6);
  return <div key={i} style={{ ...FA, left: x + (i % 3) * 22 - 30, top: y + yy - i * 9, width: 118, height: 40, borderRadius: "50%", background: "linear-gradient(180deg,#f4f0e8,#a8a49a 60%,#6a665e)", boxShadow: "0 3px 0 #5a564e, 0 8px 10px rgba(0,0,0,.4)" }} />;
});
// vapor en volutas sobre la foto
const Vapor = (tt: number, x: number, y: number, w = 220, k = 1): React.ReactNode => Array.from({ length: 6 }, (_, i) => {
  const p = (tt * 0.42 + i / 6) % 1, sz = 70 + 120 * p;
  return <div key={i} style={{ ...FA, left: x - w / 2 + rnd(i) * w + Math.sin(tt * 1.3 + i) * 34 * p - sz / 2, top: y - p * 380 - sz / 2, width: sz, height: sz * 1.3, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.4),transparent 68%)", filter: "blur(9px)", opacity: k * Math.sin(p * Math.PI) }} />;
});
// granos / partículas que caen desde un punto
const Lluvia = (tt: number, a: number, x: number, y: number, h0: number, col: string, n = 40, sz = 9): React.ReactNode => Array.from({ length: n }, (_, i) => {
  if (tt < a) return null;
  const p = ((tt - a) * 1.1 + rnd(i)) % 1;
  return <div key={i} style={{ ...FA, left: x + (rnd(i + 5) - 0.5) * 40 * (1 + p), top: y + p * p * h0, width: sz, height: sz, borderRadius: "40%", background: col, transform: `rotate(${i * 50}deg)`, opacity: 1 - p * 0.6 }} />;
});
// aro de cuenta regresiva alrededor de un objeto de la foto
const Aro = (tt: number, a: number, b: number, x: number, y: number, r0: number, col = "#f8dda4"): React.ReactNode => { if (tt > -1) return null;
  const p = 1 - eio(tt, a, b), C = 2 * Math.PI * r0;
  return <svg width={r0 * 2 + 40} height={r0 * 2 + 40} style={{ ...FA, left: x - r0 - 20, top: y - r0 - 20, transform: "rotate(-90deg)", opacity: cl((tt - a + 0.3) * 4) }}><circle cx={r0 + 20} cy={r0 + 20} r={r0} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={16} /><circle cx={r0 + 20} cy={r0 + 20} r={r0} fill="none" stroke={col} strokeWidth={12} strokeDasharray={`${C * p} ${C}`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${col})` }} /></svg>;
};
// destello que pulsa sobre un punto de la foto
const Pulso = (tt: number, a: number, x: number, y: number, col = "rgba(255,240,190,.9)"): React.ReactNode => tt < -1e9 && tt > a && [0, 1].map((i) => { const p = ((tt - a) * 0.8 + i * 0.5) % 1; return <div key={i} style={{ ...FA, left: x - 30 - p * 120, top: y - 30 - p * 120, width: 60 + p * 240, height: 60 + p * 240, borderRadius: "50%", border: `6px solid ${col}`, opacity: 1 - p }} />; });
// contador de rodillos dentro de la escena
const Rodillo: React.FC<{ tt: number; d: number; a: number; b: number; v: number; x: number; y: number; pre?: string; dec?: number; size?: number }> = ({ tt, d, a, b, v, x, y, pre, dec = 0, size = 120 }) => tt < -1e9 && <div style={{ ...FA, left: x, top: y, opacity: 1 - cl((tt - d + 0.45) * 3), transform: `translate(-50%,-50%) scale(${phys(tt, a - 0.3, 7, 0.5)})` }}><OdoK tt={tt} a={a} b={b} v={v} pre={pre} dec={dec} size={size} /></div>;


export const K01: React.FC<CPk> = (p) => <Foto {...p} id="k01" fx={0.5} fy={0.55} z={1.32} word="EIGHT TO A TRAY" wx={960} wy={950} mode="iris"  />;
export const K02: React.FC<CPk> = (p) => <><Foto {...p} id="k02" fx={0.5} fy={0.55} z={1.45} word="40 CHICKENS A NIGHT" wx={960} wy={180} mode="wipe"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={40} x={1500} y={800} size={150} /></>;
export const K03: React.FC<CPk> = (p) => <><Foto {...p} id="k03" fx={0.5} fy={0.55} z={1.38} word="12 NIGHTS OF SUPPER" wx={960} wy={950} mode="rise"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={12} x={1500} y={300} size={150} /></>;
export const K04: React.FC<CPk> = (p) => <Foto {...p} id="k04" fx={0.5} fy={0.55} z={1.32} word="THE OVEN DOES IT" wx={960} wy={180} mode="blinds" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K05: React.FC<CPk> = (p) => <Foto {...p} id="k05" fx={0.5} fy={0.55} z={1.45} word="FLAT LIKE A BOOK" wx={960} wy={950} mode="drop" fx2={(tt) => Lluvia(tt, 0.3, 960, 100, 760, "rgba(230,245,255,.85)", 46, 7)} />;
export const K06: React.FC<CPk> = (p) => <Foto {...p} id="k06" fx={0.5} fy={0.55} z={1.38} word="THIN AS A NICKEL" wx={960} wy={180} mode="split" fx2={(tt) => Coins(tt, 1.2, 420, 880, 9)} />;
export const K07: React.FC<CPk> = (p) => <Foto {...p} id="k07" fx={0.5} fy={0.55} z={1.32} word="DRY SKIN IS CRISPY" wx={960} wy={950} mode="iris" fx2={(tt) => Lluvia(tt, 0.6, 960, 260, 420, "rgba(250,248,240,.9)", 40, 7)} />;
export const K08: React.FC<CPk> = (p) => <Foto {...p} id="k08" fx={0.5} fy={0.55} z={1.45} word="DEEP BROWN" wx={960} wy={180} mode="wipe" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K09: React.FC<CPk> = (p) => <><Foto {...p} id="k09" fx={0.5} fy={0.55} z={1.38} word="180° AND STILL JUICY" wx={960} wy={950} mode="rise"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={180} x={1500} y={300} size={150} /></>;
export const K10: React.FC<CPk> = (p) => <><Foto {...p} id="k10" fx={0.5} fy={0.55} z={1.32} word="WEDDING CHINA · 1964" wx={960} wy={180} mode="blinds"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={1964} x={1500} y={800} size={150} /></>;
export const K11: React.FC<CPk> = (p) => <Foto {...p} id="k11" fx={0.5} fy={0.55} z={1.45} word="IT LETS GO" wx={960} wy={950} mode="drop" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K12: React.FC<CPk> = (p) => <Foto {...p} id="k12" fx={0.5} fy={0.55} z={1.38} word="ONE MINUTE" wx={960} wy={180} mode="split" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K13: React.FC<CPk> = (p) => <Foto {...p} id="k13" fx={0.5} fy={0.55} z={1.32} word="MRS. NOVAK · 1971" wx={960} wy={950} mode="iris"  />;
export const K14: React.FC<CPk> = (p) => <Foto {...p} id="k14" fx={0.5} fy={0.55} z={1.45} word="BURNS IN A SECOND" wx={960} wy={180} mode="wipe" fx2={(tt) => Lluvia(tt, 0.6, 960, 260, 420, "#b8321e", 50, 8)} />;
export const K15: React.FC<CPk> = (p) => <Foto {...p} id="k15" fx={0.5} fy={0.55} z={1.38} word="NO CURDLE" wx={960} wy={950} mode="rise" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K16: React.FC<CPk> = (p) => <><Foto {...p} id="k16" fx={0.5} fy={0.55} z={1.32} word="POTLUCK · 1998" wx={960} wy={180} mode="blinds"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={1998} x={1500} y={800} size={150} /></>;
export const K17: React.FC<CPk> = (p) => <Foto {...p} id="k17" fx={0.5} fy={0.55} z={1.45} word="SEE-THROUGH EDGES" wx={960} wy={950} mode="drop" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K18: React.FC<CPk> = (p) => <Foto {...p} id="k18" fx={0.5} fy={0.55} z={1.38} word="KEEP THE LID ON" wx={960} wy={180} mode="split" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K19: React.FC<CPk> = (p) => <Foto {...p} id="k19" fx={0.5} fy={0.55} z={1.32} word="THE BEST PART" wx={960} wy={950} mode="iris" fx2={(tt) => Lluvia(tt, 0.8, 960, 420, 300, "#c8902e", 26, 10)} />;
export const K20: React.FC<CPk> = (p) => <Foto {...p} id="k20" fx={0.5} fy={0.55} z={1.45} word="KEEP THE SKIN" wx={960} wy={180} mode="wipe"  />;
export const K21: React.FC<CPk> = (p) => <Foto {...p} id="k21" fx={0.5} fy={0.55} z={1.38} word="IT DANCES" wx={960} wy={950} mode="rise" fx2={(tt) => Lluvia(tt, 0.4, 960, 300, 380, "rgba(200,225,255,.85)", 30, 9)} />;
export const K22: React.FC<CPk> = (p) => <><Foto {...p} id="k22" fx={0.5} fy={0.55} z={1.32} word="5 MINUTES. WAIT." wx={960} wy={180} mode="blinds"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={5} x={1500} y={800} size={150} /></>;
export const K23: React.FC<CPk> = (p) => <Foto {...p} id="k23" fx={0.5} fy={0.55} z={1.45} word="LIKE A POTATO CHIP" wx={960} wy={950} mode="drop" fx2={(tt) => Lluvia(tt, 0.8, 960, 420, 300, "#c8902e", 26, 10)} />;
export const K24: React.FC<CPk> = (p) => <Foto {...p} id="k24" fx={0.5} fy={0.55} z={1.38} word="IT HISSES" wx={960} wy={180} mode="split" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K25: React.FC<CPk> = (p) => <Foto {...p} id="k25" fx={0.5} fy={0.55} z={1.32} word="CHEAPER PER POUND" wx={960} wy={950} mode="iris" fx2={(tt) => Coins(tt, 1.2, 420, 880, 9)} />;
export const K26: React.FC<CPk> = (p) => <Foto {...p} id="k26" fx={0.5} fy={0.55} z={1.45} word="BROTH DAY" wx={960} wy={180} mode="wipe" fx2={(tt) => Lluvia(tt, 0.3, 960, 100, 760, "rgba(230,245,255,.85)", 46, 7)} />;
export const K27: React.FC<CPk> = (p) => <><Foto {...p} id="k27" fx={0.5} fy={0.55} z={1.38} word="TASTES LIKE 1955" wx={960} wy={950} mode="rise"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={1955} x={1500} y={300} size={150} /></>;
export const K28: React.FC<CPk> = (p) => <><Foto {...p} id="k28" fx={0.5} fy={0.55} z={1.32} word="150 PEOPLE" wx={960} wy={180} mode="blinds"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={150} x={1500} y={800} size={150} /></>;
export const K29: React.FC<CPk> = (p) => <Foto {...p} id="k29" fx={0.5} fy={0.55} z={1.45} word="NO CORNSTARCH" wx={960} wy={950} mode="drop" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K30: React.FC<CPk> = (p) => <Foto {...p} id="k30" fx={0.5} fy={0.55} z={1.38} word="TWO FORKS" wx={960} wy={180} mode="split"  />;
export const K31: React.FC<CPk> = (p) => <Foto {...p} id="k31" fx={0.5} fy={0.55} z={1.32} word="TWO HOURS" wx={960} wy={950} mode="iris" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K32: React.FC<CPk> = (p) => <Foto {...p} id="k32" fx={0.5} fy={0.55} z={1.45} word="DON'T PEEK" wx={960} wy={180} mode="wipe" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K33: React.FC<CPk> = (p) => <Foto {...p} id="k33" fx={0.5} fy={0.55} z={1.38} word="UNDER $1.50 A NIGHT" wx={960} wy={950} mode="rise" fx2={(tt) => Coins(tt, 1.2, 420, 880, 9)} />;
export const K34: React.FC<CPk> = (p) => <Foto {...p} id="k34" fx={0.5} fy={0.55} z={1.32} word="SEE YOU NEXT WEEK" wx={960} wy={180} mode="blinds" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
