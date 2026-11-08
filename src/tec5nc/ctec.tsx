// c8c.tsx · componentes ÚNICOS de tec5nc (sesE, «7 errores que destrozan tu lavadora»). Ninguno repite tec29, tec5na, tec5nb.
// Objetos reales dibujados en código (lavadora, tambor, resortes, tapa, nivel, baleros, manguera). Cada animación ~4,4 s de tt.
import React from "react";
import { BR, cl, DIM, eio, H, HAND, lerp, MZ, RED, rnd, Stage, Tag, TX, VER } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const ab = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const e1 = (tt: number, a: number, d = 0.4) => cl((tt - a) / d);
const AZ = "#5fc4ff", OXI = "#c8662a", PIEL = "linear-gradient(160deg,#c99a74,#94643f)", ACERO = "linear-gradient(180deg,#e7ebee,#8b9298 55%,#c9ced3)";
const SVG: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{children}</svg>;
const Txt: React.FC<{ x: number; y: number; w?: number; size?: number; col?: string; o?: number; children: React.ReactNode; weight?: number }> = ({ x, y, w = 700, size = 56, col = TX, o = 1, children, weight = 900 }) => (
  <div style={ab(x - w / 2, y, { width: w, textAlign: "center", fontSize: size, fontWeight: weight, color: col, opacity: o, lineHeight: 1.08, textShadow: "0 5px 18px rgba(0,0,0,.7)" })}>{children}</div>
);
// lavadora de frente, de verdad: panel, perilla, puerta redonda, tapita del filtro y patas
const Lav: React.FC<{ x: number; y: number; w?: number; rot?: number; inner?: React.ReactNode }> = ({ x, y, w = 440, rot = 0, inner }) => {
  const k = w / 440, d = 300 * k;
  return <div style={ab(x, y, { width: w, height: 590 * k, transform: `rotate(${rot}deg)`, transformOrigin: "50% 100%" })}>
    {[46, 356].map((l) => <div key={l} style={ab(l * k, 566 * k, { width: 38 * k, height: 30 * k, borderRadius: 4, background: "#3a3d42" })} />)}
    <div style={ab(0, 0, { width: w, height: 570 * k, borderRadius: 18 * k, background: "linear-gradient(120deg,#fbfcfc,#d9dee1 70%,#b9c0c5)", boxShadow: "0 34px 70px rgba(0,0,0,.6)" })} />
    <div style={ab(16 * k, 14 * k, { width: 408 * k, height: 84 * k, borderRadius: 10 * k, background: "linear-gradient(#e9edef,#c9d0d4)" })} />
    <div style={ab(320 * k, 26 * k, { width: 60 * k, height: 60 * k, borderRadius: "50%", background: ACERO, boxShadow: "0 3px 8px rgba(0,0,0,.4)" })} />
    <div style={ab(40 * k, 32 * k, { width: 110 * k, height: 44 * k, borderRadius: 6 * k, background: "#9aa3a9" })} />
    <div style={ab(70 * k, 122 * k, { width: d, height: d, borderRadius: "50%", background: "#8b9298", boxShadow: "inset 0 0 0 10px #aeb6bb" })}>
      <div style={ab(26 * k, 26 * k, { width: 248 * k, height: 248 * k, borderRadius: "50%", background: "radial-gradient(circle at 40% 34%,#3f4a54,#14191f 72%)", overflow: "hidden" })}>{inner}</div>
    </div>
    <div style={ab(320 * k, 486 * k, { width: 90 * k, height: 60 * k, borderRadius: 6 * k, border: "2px solid #a9b1b6" })} />
  </div>;
};
// tambor en corte: agujeros que giran
const Tambor: React.FC<{ x: number; y: number; r: number; ang?: number; children?: React.ReactNode }> = ({ x, y, r, ang = 0, children }) => <div style={ab(x - r, y - r, { width: 2 * r, height: 2 * r, borderRadius: "50%", background: "radial-gradient(circle,#39424b,#1a2026 72%)", boxShadow: "0 0 0 14px #9aa3a9, 0 0 0 20px #6a7278" })}>
  {Array.from({ length: 34 }, (_, i) => { const a = (i * 360) / 34 + ang, R = r - 18; return <div key={i} style={ab(r + Math.cos((a * Math.PI) / 180) * R - 5, r + Math.sin((a * Math.PI) / 180) * R - 5, { width: 10, height: 10, borderRadius: "50%", background: "#07090b" })} />; })}
  {children}
</div>;
const Mano: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => <div style={ab(x, y, { width: 150, height: 240, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})` })}>
  {[0, 1, 2, 3].map((i) => <div key={i} style={ab(8 + i * 34, 10 - [6, 0, 2, 12][i], { width: 30, height: 120, borderRadius: 15, background: PIEL })} />)}
  <div style={ab(4, 92, { width: 142, height: 130, borderRadius: 34, background: PIEL })} />
  <div style={ab(-34, 130, { width: 62, height: 34, borderRadius: 17, background: PIEL, transform: "rotate(-34deg)" })} />
</div>;
const Puno: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => <div style={ab(x, y, { width: 170, height: 150, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})` })}>
  <div style={ab(0, 20, { width: 170, height: 130, borderRadius: 40, background: PIEL, boxShadow: "0 14px 26px rgba(0,0,0,.45)" })} />
  {[0, 1, 2, 3].map((i) => <div key={i} style={ab(14 + i * 38, 0, { width: 36, height: 64, borderRadius: 18, background: PIEL, boxShadow: "inset 0 -6px 0 rgba(0,0,0,.12)" })} />)}
  <div style={ab(-20, 70, { width: 70, height: 44, borderRadius: 22, background: PIEL, transform: "rotate(-20deg)" })} />
</div>;
const Muelle: React.FC<{ x: number; y1: number; y2: number; col?: string; w?: number }> = ({ x, y1, y2, col = "#c9ced3", w = 34 }) => { const n = 12, st = (y2 - y1) / n; let d = `M${x} ${y1}`; for (let i = 1; i <= n; i++) d += ` L${x + (i === n ? 0 : i % 2 ? w : -w)} ${y1 + st * i}`; return <path d={d} fill="none" stroke={col} strokeWidth={8} strokeLinejoin="round" />; };

// 1 · la lavadora brinca: cada golpe baja la barra de vida
const Saltos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1a1d21" mesa={false}>{(tt) => {
  const g = eio(tt, 0, 1.4), j = Math.abs(Math.sin(tt * 6.6)) * 40 * g, r = Math.sin(tt * 13) * 2.6 * g, gol = [0.8, 1.9, 3.0].filter((a) => tt >= a).length;
  return <>
    <div style={ab(0, 900, { width: 1920, height: 180, background: "linear-gradient(#55595d,#34373a)" })} />
    <Lav x={380 + Math.sin(tt * 9) * 16 * g} y={330 - j} w={460} rot={r} inner={<div style={ab(10, 40 + j, { width: 230, height: 170, borderRadius: 70, background: "linear-gradient(130deg,#31527e,#203658)" })} />} />
    {[0.8, 1.9, 3.0].map((a, i) => <Tag key={a} tt={tt} at={a} x={[200, 1010, 1040][i]} y={[200, 260, 640][i]} txt="PUM" col={MZ} size={96} />)}
    <Txt x={1460} y={170} w={620} col={TX} size={60}>VIDA DE LA MÁQUINA</Txt>
    <div style={ab(1370, 280, { width: 180, height: 560, borderRadius: 22, background: "rgba(0,0,0,.55)", border: `3px solid ${DIM}` })}>
      <div style={ab(12, 12 + 140 * gol, { width: 156, height: 536 - 140 * gol, borderRadius: 12, background: gol < 3 ? VER : RED })} />
    </div>
  </>;
}}</Stage>;

// 2 · siete etiquetas pegadas a la lavadora, la siete en rojo
const Siete: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#18222a" mesa={false}>{(tt) => {
  const P = [[350, 240], [300, 500], [370, 770], [1480, 230], [1570, 470], [1450, 740]];
  return <>
    <Lav x={720} y={180} w={480} />
    {P.map(([x, y], i) => { const s = cl((tt - 0.3 - i * 0.42) / 0.3); return <div key={i} style={ab(x, y, { width: 170, height: 170, borderRadius: 12, background: "#f2d04a", color: "#201a05", fontSize: 110, fontWeight: 900, textAlign: "center", lineHeight: "166px", opacity: s, transform: `scale(${1.5 - 0.5 * s}) rotate(${i % 2 ? 6 : -5}deg)`, boxShadow: "0 16px 32px rgba(0,0,0,.5)" })}>{i + 1}</div>; })}
    {(() => { const s = cl((tt - 3.0) / 0.3), p = 1 + 0.05 * Math.sin(tt * 8); return <div style={ab(835, 400, { width: 250, height: 250, borderRadius: 16, background: RED, color: "#fff", fontSize: 180, fontWeight: 900, textAlign: "center", lineHeight: "244px", opacity: s, transform: `scale(${(1.7 - 0.7 * s) * p}) rotate(-3deg)`, boxShadow: "0 22px 46px rgba(0,0,0,.65)" })}>7</div>; })()}
    <Tag tt={tt} at={3.4} x={960} y={90} txt="EL QUE DUELE" col={RED} size={72} />
  </>;
}}</Stage>;

// 3 · flexómetro de años: 10 a 13 normal, 15 nadie lo garantiza
const Regla15: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#20201c" mesa={false}>{(tt) => {
  const w = eio(tt, 0.1, 1.5) * 1640, x = (y: number) => 140 + (y / 18) * 1640, b = eio(tt, 1.5, 2.2);
  return <>
    <div style={ab(140, 470, { width: w, height: 150, background: "linear-gradient(#f4d24e,#d6ab1d)", boxShadow: "0 16px 36px rgba(0,0,0,.55)", overflow: "hidden" })}>
      {Array.from({ length: 19 }, (_, i) => <React.Fragment key={i}><div style={ab((i / 18) * 1640, 0, { width: 5, height: 74, background: "#1b1a13" })} />{i % 5 === 0 && <div style={ab((i / 18) * 1640 + 12, 62, { fontSize: 70, fontWeight: 900, color: "#1b1a13" })}>{i}</div>}</React.Fragment>)}
    </div>
    <div style={ab(40, 438, { width: 130, height: 214, borderRadius: 26, background: "linear-gradient(#3f4449,#16181b)" })} />
    <div style={ab(x(10), 640, { width: (x(13) - x(10)) * b, height: 30, background: VER, borderRadius: 8 })} />
    <Tag tt={tt} at={2.1} x={(x(10) + x(13)) / 2} y={720} txt="10 A 13 AÑOS" col={VER} size={72} />
    <div style={ab(x(15), 410, { width: 6, height: 270, background: RED, opacity: e1(tt, 3.0) })} />
    <Txt x={x(15)} y={230} w={560} col={RED} size={62} o={e1(tt, 3.1)}>15 AÑOS: NADIE LO GARANTIZA</Txt>
  </>;
}}</Stage>;

// 4 · corte de la máquina: el tambor cuelga de resortes y se apoya en amortiguadores
const Colgado: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#10181f" mesa={false}>{(tt) => {
  const s = Math.sin(tt * 5.4) * 34 * eio(tt, 1.6, 2.4), sx = Math.sin(tt * 3.7) * 18 * eio(tt, 1.6, 2.4), cy = 560 + s, cx = 960 + sx;
  return <>
    <div style={ab(560, 120, { width: 800, height: 860, borderRadius: 20, background: "rgba(245,247,248,.08)", border: "10px solid #dfe4e7" })} />
    <SVG>
      <Muelle x={760} y1={132} y2={cy - 240} /><Muelle x={1160} y1={132} y2={cy - 240} />
      {[770, 1150].map((x) => <g key={x}><rect x={x - 20} y={cy + 230} width={40} height={(965 - cy - 230) * 0.55} fill="#c9ced3" /><rect x={x - 34} y={cy + 230 + (965 - cy - 230) * 0.5} width={68} height={(965 - cy - 230) * 0.5} rx={8} fill="#454b51" /></g>)}
    </SVG>
    <div style={{ opacity: e1(tt, 0.3) }}><Tambor x={cx} y={cy} r={240} ang={tt * 40} /></div>
    <Tag tt={tt} at={0.9} x={350} y={260} txt="RESORTES" col={AZ} size={68} />
    <Txt x={1640} y={800} w={500} col={MZ} size={54} o={e1(tt, 1.5)}>AMORTI-GUADORES</Txt>
    <Tag tt={tt} at={2.7} x={350} y={620} txt="FLOTA" col={VER} size={110} />
  </>;
}}</Stage>;

// 5 · tendedero: el mezclilla mojado hunde la cuerda; la cobija pesa como un niño
const Pantalon: React.FC<{ x: number; y: number; col: string; drip?: number }> = ({ x, y, col, drip = 0 }) => <div style={ab(x - 90, y, { width: 180, height: 330 })}>
  <div style={ab(0, 0, { width: 180, height: 50, background: col, borderRadius: 6 })} />
  <div style={ab(0, 40, { width: 80, height: 290, background: col, borderRadius: "0 0 10px 10px" })} /><div style={ab(100, 40, { width: 80, height: 290, background: col, borderRadius: "0 0 10px 10px" })} />
  <div style={ab(16, 12, { width: 150, height: 3, background: "rgba(255,210,120,.7)" })} />
  {drip > 0 && [24, 64, 118, 156].map((d, i) => <div key={d} style={ab(d, 335 + ((drip * 90 + i * 37) % 120), { width: 12, height: 20, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: AZ })} />)}
</div>;
const Tendedero: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#22282e" mesa={false}>{(tt) => {
  const w1 = eio(tt, 1.2, 1.9), w2 = eio(tt, 2.6, 3.3), sag = 26 + 90 * w1 + 120 * w2;
  return <>
    <SVG><path d={`M60 150 Q960 ${150 + sag * 2} 1860 150`} stroke="#d9dee1" strokeWidth={8} fill="none" /></SVG>
    <div style={{ opacity: 1 - w2 }}><Pantalon x={960} y={150 + sag - 8} col={w1 > 0.5 ? "#16325c" : "#4f7cb8"} drip={w1 > 0.5 ? tt : 0} /></div>
    {w2 > 0 && <div style={ab(960 - 340 , 150 + sag - 8, { width: 680, height: 430, opacity: w2, borderRadius: 10, background: "repeating-linear-gradient(90deg,#7c3b3b 0 60px,#a65151 60px 120px)", boxShadow: "0 20px 44px rgba(0,0,0,.5)" })} />}
    {w2 > 0 && [0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={ab(660 + i * 120, 150 + sag + 430 + ((tt * 260 + i * 47) % 160), { width: 16, height: 26, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: AZ, opacity: w2 })} />)}
    <Tag tt={tt} at={0.4} x={320} y={500} txt="SECO" col={TX} size={72} />
    <Tag tt={tt} at={1.6} x={1560} y={500} txt="MÁS DEL DOBLE" col={AZ} size={64} />
    {w2 > 0.6 && <div style={ab(1470, 660, { opacity: e1(tt, 3.3) })}><div style={ab(70, 0, { width: 90, height: 90, borderRadius: "50%", background: TX })} /><div style={ab(50, 96, { width: 130, height: 200, borderRadius: 38, background: TX })} /></div>}
    <Txt x={350} y={740} w={560} col={MZ} size={62} o={e1(tt, 3.4)}>UNA COBIJA EMPAPADA</Txt>
  </>;
}}</Stage>;

// 6 · la bola de ropa a un lado: el tambor descentrado sacude todo; igual que una llanta mal balanceada
const Descentrado: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#131b22" mesa={false}>{(tt) => {
  const a = tt * 330, g = eio(tt, 0.8, 2.2), rad = (a * Math.PI) / 180, sx = Math.cos(rad) * 22 * g, sy = Math.sin(rad) * 22 * g;
  return <>
    <div style={ab(sx, sy, { position: "absolute", width: 1920, height: 1080 })}><Tambor x={640} y={540} r={330} ang={a}>
      <div style={ab(330 + Math.cos(rad) * 180 - 130, 330 + Math.sin(rad) * 180 - 110, { width: 260, height: 220, borderRadius: "46% 54% 50% 50%", background: "linear-gradient(130deg,#3a68a6,#203d66)", boxShadow: "inset 0 0 40px rgba(0,0,0,.45)" })} />
    </Tambor></div>
    <Tag tt={tt} at={1.2} x={640} y={80} txt="UN SOLO LADO" col={MZ} size={76} />
    <div style={{ opacity: e1(tt, 2.5) }}>
      <div style={ab(1250, 310, { width: 460, height: 460, borderRadius: "50%", background: "#14161a", boxShadow: "inset 0 0 0 56px #2a2d32", transform: `rotate(${a}deg) translate(${sx * 0.5}px,0)` })}>
        <div style={ab(150, 150, { width: 160, height: 160, borderRadius: "50%", background: ACERO })} />
        <div style={ab(190, 8, { width: 80, height: 40, borderRadius: 6, background: MZ })} />
      </div>
    </div>
    <Txt x={1480} y={840} w={720} col={TX} size={58} o={e1(tt, 2.9)}>LLANTA MAL BALANCEADA</Txt>
  </>;
}}</Stage>;

// 7 · la prueba de la mano de canto: tambor repleto vs tambor bien cargado
const Manocanto: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#16202a" mesa={false}>{(tt) => {
  const hand = eio(tt, 1.8, 2.8);
  const Bola = (fill: number, i: number) => Array.from({ length: 30 }, (_, k) => { const c = ["#3a68a6", "#a65151", "#d7b65a", "#5c8a64"][(k + i) % 4], row = Math.floor(k / 5), col = k % 5, y = 470 - row * 82; if (y < 580 - 580 * fill) return null; return <div key={k} style={ab(10 + col * 112 + (row % 2) * 40, y, { width: 150, height: 112, borderRadius: "48% 52% 44% 56%", background: c, boxShadow: "inset 0 0 22px rgba(0,0,0,.45)" })} />; });
  return <>
    <Tambor x={490} y={560} r={290} ang={0}><div style={ab(0, 0, { width: 580, height: 580, borderRadius: "50%", overflow: "hidden" })}>{Bola(1.05, 0)}</div></Tambor>
    <Tambor x={1430} y={560} r={290} ang={0}><div style={ab(0, 0, { width: 580, height: 580, borderRadius: "50%", overflow: "hidden" })}>{Bola(0.62, 2)}</div></Tambor>
    <Tag tt={tt} at={0.8} x={490} y={110} txt="NO CABE" col={RED} size={84} />
    <Tag tt={tt} at={1.3} x={1430} y={110} txt="CABE LA MANO" col={VER} size={72} />
    <div style={{ opacity: e1(tt, 1.6) }}><Mano x={1430} y={lerp(130, 372, hand)} s={0.86} /></div>
    <div style={ab(150, 540, { width: 680, height: 24, background: RED, borderRadius: 12, transform: `rotate(-24deg) scaleX(${e1(tt, 2.8, 0.25)})` })} />
  </>;
}}</Stage>;

// 8 · la placa de la máquina: 8 kg es el máximo, tres cuartos es el día a día
const Placa8: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1d1f23" mesa={false}>{(tt) => {
  const n = eio(tt, 1.3, 2.5), ang = -120 + 240 * (n * 0.75) + (tt > 2.5 ? Math.sin(tt * 18) * 0.9 : 0);
  return <>
    <div style={ab(190, 230, { width: 660, height: 620, borderRadius: 16, background: "linear-gradient(135deg,#d6dbde,#9ea6ac 60%,#c9ced3)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" })}>
      {[[20, 20], [604, 20], [20, 564], [604, 564]].map(([x, y]) => <div key={x + "" + y} style={ab(x, y, { width: 36, height: 36, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#f4f6f7,#5e656b)" })} />)}
      <div style={ab(0, 90, { width: 660, textAlign: "center", fontSize: 54, fontWeight: 900, color: "#23272b" })}>CAPACIDAD</div>
      <div style={ab(0, 170, { width: 660, textAlign: "center", fontSize: 240, fontWeight: 900, color: "#111316" })}>8 KG</div>
      <div style={ab(0, 460, { width: 660, textAlign: "center", fontSize: 60, fontWeight: 900, color: "#8d1f1f" })}>ES EL MÁXIMO</div>
    </div>
    <div style={ab(1020, 250, { width: 720, height: 560 })}>
      <SVG><g transform="translate(-1020,-250)">
        <path d="M1110 760 A 270 270 0 1 1 1650 760" fill="none" stroke="#343a40" strokeWidth={50} />
        <path d="M1110 760 A 270 270 0 0 1 1560 570" fill="none" stroke={VER} strokeWidth={50} opacity={n} />
        <rect x={1372} y={500} width={16} height={270} rx={8} fill={MZ} transform={`rotate(${ang} 1380 760)`} />
        <circle cx={1380} cy={760} r={38} fill="#d6dbde" />
      </g></SVG>
    </div>
    <Tag tt={tt} at={2.6} x={1380} y={860} txt="3/4 DE CARGA" col={VER} size={80} />
  </>;
}}</Stage>;

// 9 · la tapita de detergente: las rayitas de abajo y hasta dónde la llena todo el mundo
const Tapita: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#172430" mesa={false}>{(tt) => {
  const f = eio(tt, 0.4, 2.4), L = 470 * f;
  return <>
    <div style={ab(560, 170, { width: 800, height: 700, clipPath: "polygon(4% 0,96% 0,82% 100%,18% 100%)", background: "rgba(225,240,255,.14)" })}>
      <div style={ab(0, 700 - L, { width: 800, height: L, background: "linear-gradient(#67b9ff,#2471c7)" })} />
      {[250, 340, 430, 520].map((y, i) => <div key={y} style={ab(200, 700 - (560 - y) - 140 + i * 0, { width: 400, height: 8, background: "rgba(255,255,255,.75)" })} />)}
    </div>
    <div style={ab(540, 150, { width: 840, height: 34, borderRadius: 12, background: "linear-gradient(#e7ebee,#8b9298)" })} />
    <div style={ab(1370, 720, { width: 150, height: 8, background: VER, opacity: e1(tt, 2.4) })} />
    <Txt x={1660} y={680} w={380} col={VER} size={62} o={e1(tt, 2.5)}>LO QUE PIDE</Txt>
    <div style={ab(400, 390, { width: 150, height: 8, background: RED, opacity: e1(tt, 3.0) })} />
    <Txt x={230} y={340} w={380} col={RED} size={62} o={e1(tt, 3.1)}>LO QUE ECHAS</Txt>
    <Tag tt={tt} at={3.6} x={960} y={80} txt="2 O 3 VECES" col={MZ} size={84} />
  </>;
}}</Stage>;

// 10 · el colchón de espuma: el tambor gira contra espuma y el motor sufre
const Colchon: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#131f27" mesa={false}>{(tt) => {
  const f = eio(tt, 0.4, 3.0);
  return <>
    <Tambor x={700} y={560} r={350} ang={tt * 50}>
      <div style={ab(0, 0, { width: 700, height: 700, borderRadius: "50%", overflow: "hidden" })}>
        {Array.from({ length: 150 }, (_, i) => { const x = rnd(i * 3) * 700, y = 700 - rnd(i * 7 + 1) * 620 * f, r = 30 + rnd(i) * 60; return <div key={i} style={ab(x - r / 2, y - r / 2 + Math.sin(tt * 3 + i) * 6, { width: r, height: r, borderRadius: "50%", background: "radial-gradient(circle at 34% 30%,#fff,#cde6f7 70%)", opacity: 0.94 })} />; })}
      </div>
    </Tambor>
    <Tag tt={tt} at={1.4} x={700} y={100} txt="ESPUMA" col={TX} size={80} />
    <div style={ab(1250, 260, { width: 460, height: 560, borderRadius: 30, background: "linear-gradient(#3a4047,#1a1d21)", boxShadow: "0 24px 50px rgba(0,0,0,.6)" })}>
      {Array.from({ length: 8 }, (_, i) => { const on = eio(tt, 1.0, 3.4) * 8 > i; return <div key={i} style={ab(70, 470 - i * 58, { width: 320, height: 42, borderRadius: 8, background: on ? (i > 4 ? RED : i > 2 ? MZ : VER) : "#2a2e33" })} />; })}
    </div>
    <Tag tt={tt} at={3.0} x={1480} y={880} txt="MOTOR FORZADO" col={RED} size={62} />
  </>;
}}</Stage>;

// 11 · la prueba de la toalla: exprimir en la cubeta y contar burbujas
const Exprimir: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1b2128" mesa={false}>{(tt) => {
  const tw = eio(tt, 0.5, 2.0), go = eio(tt, 1.6, 3.8);
  return <>
    <div style={ab(960 - 170, 110 + tw * 40, { width: 340, height: 300, borderRadius: 60, background: "repeating-linear-gradient(35deg,#efeadf 0 26px,#cfc8b6 26px 52px)", transform: `scaleX(${1 - tw * 0.48}) rotate(${tw * 6}deg)`, boxShadow: "inset 0 0 40px rgba(0,0,0,.2)" })} />
    <Puno x={800 + tw * 70} y={250 + tw * 40} rot={-80} /><Puno x={1120 - tw * 70} y={250 + tw * 40} rot={80} />
    {[0, 1, 2, 3, 4].map((i) => <div key={i} style={ab(900 + i * 28, 420 + ((tt * 240 + i * 53) % 150), { width: 12, height: 22, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: AZ, opacity: tw })} />)}
    <div style={ab(560, 560, { width: 800, height: 470, clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", background: "linear-gradient(90deg,#3f8fd0,#2a6aa7 45%,#245c92)" })} />
    <div style={ab(560, 590, { width: 800, height: 60, background: "#a8dcf7" })} />
    {Array.from({ length: 34 }, (_, i) => { const k = cl(go * 40 - i), r = 34 + rnd(i) * 44; return <div key={i} style={ab(590 + rnd(i * 5) * 720 - r / 2, 560 + rnd(i * 11) * 40 - r / 2, { width: r, height: r, borderRadius: "50%", background: "radial-gradient(circle at 34% 30%,#fff,#d9edf9 72%)", transform: `scale(${k})` })} />; })}
    <Txt x={320} y={420} w={480} col={RED} size={60} o={e1(tt, 3.0)}>BURBUJAS = JABÓN DE MÁS</Txt>
  </>;
}}</Stage>;

// 12 · no mezclar: tres botellas y el aviso de gas
const Botella: React.FC<{ x: number; col: string; txt: string; rot?: number }> = ({ x, col, txt, rot = 0 }) => <div style={ab(x - 130, 310, { width: 260, height: 520, transform: `rotate(${rot}deg)` })}>
  <div style={ab(90, 0, { width: 80, height: 74, borderRadius: 8, background: "#30363c" })} />
  <div style={ab(0, 66, { width: 260, height: 454, borderRadius: "70px 70px 20px 20px", background: col, boxShadow: "inset -26px 0 40px rgba(0,0,0,.25), 0 24px 44px rgba(0,0,0,.55)" })} />
  <div style={ab(16, 230, { width: 228, height: 130, borderRadius: 10, background: "#f4f6f7", color: "#131416", fontSize: 40, fontWeight: 900, textAlign: "center", lineHeight: "130px" })}>{txt}</div>
</div>;
const Nomezclar: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#201818" mesa={false}>{(tt) => {
  const m = eio(tt, 0.5, 1.6), g = eio(tt, 1.6, 2.6), x = eio(tt, 2.8, 3.2);
  return <>
    <Botella x={lerp(360, 640, m)} col="linear-gradient(120deg,#e9f1f5,#b9c9d3)" txt="CLORO" rot={m * 12} />
    <Botella x={lerp(1560, 1280, m)} col="linear-gradient(120deg,#e7cf9a,#b89a55)" txt="VINAGRE" rot={-m * 12} />
    <Botella x={960} col="linear-gradient(120deg,#c9e3d3,#82ad93)" txt="AMONÍACO" />
    {Array.from({ length: 26 }, (_, i) => { const r = 120 + rnd(i) * 180; return <div key={i} style={ab(560 + rnd(i * 3) * 800 - r / 2, 300 - g * (120 + rnd(i * 5) * 160) - r / 2, { width: r, height: r, borderRadius: "50%", background: "radial-gradient(circle,rgba(177,214,88,.62),rgba(177,214,88,0) 72%)", opacity: g })} />; })}
    <Tag tt={tt} at={2.0} x={960} y={90} txt="GAS TÓXICO" col="#c7e85a" size={92} />
    <div style={ab(460, 900, { width: 1000, height: 130, borderRadius: 18, background: RED, color: "#fff", fontSize: 92, fontWeight: 900, textAlign: "center", lineHeight: "128px", transform: `scale(${x})` })}>NUNCA JUNTOS</div>
  </>;
}}</Stage>;

// 13 · piso con pendiente: una pata en el aire, mil golpecitos
const Pataaire: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#1c2024" mesa={false}>{(tt) => {
  const tilt = eio(tt, 0.3, 1.1) * -4, hit = eio(tt, 1.6, 2.2), bump = Math.abs(Math.sin(tt * 18)) * 1.6 * hit, cnt = Math.round(eio(tt, 2.2, 3.8) * 1000);
  return <>
    <div style={ab(-200, 870, { width: 1400, height: 400, background: "linear-gradient(#5f6367,#3b3e42)", transform: `rotate(${tilt}deg)`, transformOrigin: "60% 0" })} />
    <Lav x={160} y={290} w={450} rot={tilt + bump} />
    <div style={ab(1110, 270, { width: 560, height: 560, borderRadius: "50%", overflow: "hidden", background: "#2a2d31", boxShadow: "0 0 0 12px #e7ebee, 0 26px 56px rgba(0,0,0,.6)", opacity: e1(tt, 0.9) })}>
      <div style={ab(0, 400, { width: 560, height: 200, background: "#5a5e62" })} />
      <div style={ab(180, 0, { width: 240, height: 170, background: "linear-gradient(#f1f3f4,#c9d0d4)" })} />
      <div style={ab(240, 170, { width: 120, height: 150 + bump * 16, background: "linear-gradient(90deg,#797f85,#35383d)", borderRadius: "0 0 12px 12px" })} />
      <div style={ab(190, 332 + bump * 16, { width: 220, height: 6, background: MZ })} /><div style={ab(190, 396, { width: 220, height: 6, background: MZ })} />
    </div>
    <Tag tt={tt} at={1.2} x={1390} y={170} txt="EN EL AIRE" col={MZ} size={78} />
    <div style={ab(1090, 860, { width: 600, textAlign: "center", fontSize: 92, fontWeight: 900, color: RED, opacity: e1(tt, 2.2), fontVariantNumeric: "tabular-nums" })}>{cnt.toLocaleString("es-MX")}/MIN</div>
  </>;
}}</Stage>;

// 14 · la prueba de la esquina: lavadora en 3D que se mece bajo las manos
const Esquina: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1a242c" mesa={false}>{(tt) => {
  const g = eio(tt, 0.9, 1.5) * (tt > 3.2 ? 1 : 1), wob = Math.sin(tt * 9) * 2.6 * g, W = 500, D = 520, H_ = 620;
  const f = (tf: string, w: number, ht: number, bg: string, ex: React.ReactNode = null) => <div style={{ position: "absolute", left: -w / 2, top: -ht / 2, width: w, height: ht, transform: tf, background: bg, boxShadow: "inset 0 0 0 2px rgba(0,0,0,.12)" }}>{ex}</div>;
  return <>
    <div style={ab(860, 610, { perspective: 1700 })}><div style={{ transformStyle: "preserve-3d", transform: `rotateX(-24deg) rotateY(-32deg) rotateZ(${wob}deg) rotateX(${-wob * 0.6}deg)` }}>
      {f(`translateZ(${D / 2}px)`, W, H_, "linear-gradient(135deg,#fafbfb,#d2d8dc)", <div style={ab(100, 170, { width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,#1d242b 56%,#9aa3a9 58%,#c9d0d4 70%)" })} />)}
      {f(`rotateY(90deg) translateZ(${W / 2}px)`, D, H_, "linear-gradient(#cdd3d7,#a3abb1)")}
      {f(`rotateX(90deg) translateZ(${H_ / 2}px)`, W, D, "linear-gradient(#f4f6f7,#d8dde0)")}
    </div></div>
    <div style={{ opacity: e1(tt, 0.3) }}><Puno x={1010} y={lerp(120, 250, eio(tt, 0.4, 0.9) * (0.92 + 0.08 * Math.sin(tt * 9)))} rot={180} s={1.1} /></div>
    <Tag tt={tt} at={1.2} x={1560} y={300} txt="EMPUJA" col={AZ} size={80} />
    <Tag tt={tt} at={2.2} x={1560} y={520} txt="SE MECE" col={RED} size={86} />
    <Tag tt={tt} at={3.1} x={1560} y={740} txt="MAL PARADA" col={MZ} size={70} />
  </>;
}}</Stage>;

// 15 · el nivel y la tuerca: la burbuja llega al centro y la tuerca se aprieta
const Burbuja: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1f2329" mesa={false}>{(tt) => {
  const b = eio(tt, 0.7, 2.6), nut = eio(tt, 3.0, 3.8);
  return <>
    <div style={ab(160, 150, { width: 1600, height: 240, borderRadius: 18, background: "linear-gradient(#f3d24b,#cb9f1b)", boxShadow: "0 26px 54px rgba(0,0,0,.6)" })}>
      <div style={ab(500, 50, { width: 600, height: 140, borderRadius: 70, background: "linear-gradient(#d5f28a,#9dc94a)", boxShadow: "inset 0 8px 18px rgba(0,0,0,.35)" })}>
        <div style={ab(lerp(30, 208, b) + Math.sin(tt * 7) * 2 * (1 - b), 20, { width: 184, height: 100, borderRadius: 50, background: "radial-gradient(circle at 40% 30%,#f7fde3,#c4e47a)" })} />
        {[190, 406].map((x) => <div key={x} style={ab(x, 0, { width: 8, height: 140, background: "#141608" })} />)}
      </div>
    </div>
    <div style={ab(760, 500, { width: 400, height: 150, background: "linear-gradient(#f1f3f4,#c9d0d4)", borderRadius: "0 0 10px 10px" })} />
    <div style={ab(900, 650, { width: 120, height: 230, overflow: "hidden", background: "#6c7278" })}>{Array.from({ length: 12 }, (_, i) => <div key={i} style={ab(0, ((i * 34 + tt * 90 * (1 - b + 0.02)) % 300) - 40, { width: 120, height: 10, background: "rgba(0,0,0,.5)", transform: "skewY(-8deg)" })} />)}</div>
    <div style={ab(880, 650 + (1 - nut) * 100, { width: 160, height: 74, background: "linear-gradient(90deg,#8d959b,#e7ebee 40%,#7b838a)", clipPath: "polygon(16% 0,84% 0,100% 50%,84% 100%,16% 100%,0 50%)" })} />
    <div style={ab(600, 880, { width: 720, height: 40, background: "#5a5e62" })} />
    <Tag tt={tt} at={1.4} x={330} y={600} txt="GIRA LA PATA" col={AZ} size={66} />
    <Txt x={1500} y={600} w={560} col={MZ} size={64} o={e1(tt, 3.2)}>Y APRIETA LA TUERCA</Txt>
  </>;
}}</Stage>;

// 16 · los tornillos de transporte: atrás de la máquina, sueltan el tambor
const Tornillos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#191d22" mesa={false}>{(tt) => {
  const P = [[640, 300], [1280, 300], [640, 800], [1280, 800]], free = eio(tt, 3.2, 3.6);
  const sw = Math.sin(tt * 6) * 22 * free;
  return <>
    <div style={ab(480, 120, { width: 960, height: 860, borderRadius: 16, background: "linear-gradient(#7c858c,#555c63)", boxShadow: "0 26px 56px rgba(0,0,0,.6)" })} />
    <div style={ab(730 + sw, 310, { width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle,#3a4047,#1b1f23 70%)", boxShadow: "0 0 0 16px #4b5259" })} />
    {P.map(([x, y], i) => { const k = eio(tt, 0.5 + i * 0.68, 1.0 + i * 0.68); return <div key={i} style={ab(x - 60, y - 60, { width: 120, height: 120, opacity: 1 - cl((k - 0.8) / 0.2) })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#d03a2f", boxShadow: "0 0 0 8px #f0d2c9" }} />
      <div style={{ position: "absolute", left: 30, top: 30, width: 60, height: 60, background: "linear-gradient(135deg,#e7ebee,#7b838a)", clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)", transform: `rotate(${k * 540}deg) scale(${1 + k * 0.5}) translate(${k * 60}px,${-k * 90}px)` }} />
    </div>; })}
    <Txt x={250} y={430} w={400} col={RED} size={52} o={e1(tt, 0.6)}>TORNILLOS DE TRANSPORTE</Txt>
    <Tag tt={tt} at={3.3} x={1680} y={500} txt="QUÍTALOS" col={VER} size={72} />
  </>;
}}</Stage>;

// 17 · la moneda proyectil: da vueltas, raya, y se va a la bomba
const Proyectil: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#10171d" mesa={false}>{(tt) => {
  const orb = eio(tt, 0.2, 3.0), a = tt * 700, R = 372, fall = eio(tt, 3.0, 3.8), rad = (a * Math.PI) / 180, cx = 960 + Math.cos(rad) * R * (1 - fall), cy = 490 + Math.sin(rad) * R * (1 - fall) + fall * 490;
  return <>
    <Tambor x={960} y={490} r={410} ang={tt * 80} />
    {Array.from({ length: 14 }, (_, i) => { const r0 = (i * 57 * Math.PI) / 180, on = orb * 14 > i; return <div key={i} style={ab(960 + Math.cos(r0) * 385 - 40, 490 + Math.sin(r0) * 385, { width: 80, height: 5, background: "#e7ebee", transform: `rotate(${i * 57 + 80}deg)`, opacity: on ? 0.85 : 0 })} />; })}
    {fall < 1 && Array.from({ length: 8 }, (_, i) => { const r0 = rad - i * 0.13; return <div key={i} style={ab(960 + Math.cos(r0) * R * (1 - fall) - 28, 490 + Math.sin(r0) * R * (1 - fall) - 28 + fall * 490, { width: 56, height: 56, borderRadius: "50%", background: MZ, opacity: 0.32 * (1 - i / 8) })} />; })}
    <div style={ab(cx - 40, cy - 40, { width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff2b8,#c9992f 62%,#7d5a16)", boxShadow: "0 0 18px rgba(255,210,90,.7)" })} />
    <Tag tt={tt} at={1.2} x={270} y={300} txt="PROYECTIL" col={MZ} size={72} />
    <Txt x={1620} y={850} w={500} col={RED} size={62} o={e1(tt, 3.2)}>DIRECTO A LA BOMBA</Txt>
  </>;
}}</Stage>;

// 18 · el alambre: sale de la costura, cruza un agujero y perfora la goma
const Alambre: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1c1a24" mesa={false}>{(tt) => {
  const k = eio(tt, 0.5, 2.6), d = 2300, leak = eio(tt, 2.6, 3.0), bag = eio(tt, 3.2, 3.8);
  return <>
    <div style={ab(120, 160, { width: 560, height: 300, borderRadius: 26, background: "repeating-linear-gradient(45deg,#d9b9c5 0 14px,#caa6b4 14px 28px)" })} />
    <div style={ab(120, 300, { width: 560, height: 8, background: "repeating-linear-gradient(90deg,#fff 0 18px,transparent 18px 34px)" })} />
    <div style={ab(780, 80, { width: 150, height: 920, background: "linear-gradient(90deg,#7b838a,#c9ced3,#7b838a)" })} />
    <div style={ab(820, 440, { width: 70, height: 70, borderRadius: "50%", background: "#07090b" })} />
    <div style={ab(1390, 80, { width: 170, height: 920, background: "linear-gradient(90deg,#17191c,#34383d,#17191c)" })} />
    <SVG><path d="M260 240 C 480 230, 660 330, 820 470 C 960 590, 1190 560, 1460 640" fill="none" stroke="#dfe4e7" strokeWidth={13} strokeLinecap="round" strokeDasharray={d} strokeDashoffset={d * (1 - k)} /></SVG>
    {[0, 1, 2].map((i) => <div key={i} style={ab(1460 + i * 24, 690 + ((tt * 240 + i * 60) % 260), { width: 22, height: 36, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: AZ, opacity: leak })} />)}
    <Tag tt={tt} at={1.0} x={400} y={520} txt="SE SALE" col={MZ} size={76} />
    <Tag tt={tt} at={2.5} x={1720} y={460} txt="FUGA" col={RED} size={90} />
    <div style={ab(200, 640, { width: 460, height: 320, borderRadius: 24, opacity: bag, background: "repeating-linear-gradient(45deg,rgba(255,255,255,.55) 0 3px,transparent 3px 16px),repeating-linear-gradient(-45deg,rgba(255,255,255,.55) 0 3px,transparent 3px 16px),rgba(120,140,160,.25)", border: "6px solid #e7ebee" })} />
    <Txt x={430} y={750} w={420} size={56} col={VER} o={bag}>BOLSITA DE MALLA</Txt>
  </>;
}}</Stage>;

// 19 · el filtro en seis pasos, cada uno con su objeto
const Seispasos: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#131d24" mesa={false}>{(tt) => {
  const T = ["DESENCHUFA", "AGUA FRÍA", "CHAROLA", "GIRA DESPACIO", "LÁMPARA", "SIN GOTAS"];
  const Ob = (i: number) => {
    if (i === 0) return <><div style={ab(70, 60, { width: 120, height: 80, borderRadius: 16, background: "#23262a" })} /><div style={ab(96, 20, { width: 18, height: 44, background: "#c9ced3" })} /><div style={ab(146, 20, { width: 18, height: 44, background: "#c9ced3" })} /><div style={ab(124, 140, { width: 12, height: 80, background: "#23262a" })} /></>;
    if (i === 1) return <><div style={ab(112, 20, { width: 36, height: 150, borderRadius: 18, background: "#e7ebee" })} /><div style={ab(122, 100, { width: 16, height: 70, background: AZ })} /><div style={ab(100, 150, { width: 60, height: 60, borderRadius: "50%", background: AZ })} /></>;
    if (i === 2) return <><div style={ab(20, 130, { width: 220, height: 60, borderRadius: "6px 6px 24px 24px", background: "linear-gradient(#9aa3a9,#5e656b)" })} /><div style={ab(20, 180, { width: 220, height: 30, background: "#d9c9a6" })} /><div style={ab(70, 118, { width: 120, height: 24, borderRadius: 12, background: AZ })} /></>;
    if (i === 3) return <><div style={ab(60, 50, { width: 140, height: 140, borderRadius: "50%", background: "#dfe4e7", boxShadow: "0 0 0 8px #8b9298" })} /><div style={ab(122, 62, { width: 18, height: 116, background: "#6d747a", transform: `rotate(${-eio(tt, 2.6, 3.2) * 120}deg)` })} /></>;
    if (i === 4) return <><div style={ab(20, 88, { width: 140, height: 64, borderRadius: 12, background: "#2e3338" })} /><div style={ab(150, 72, { width: 40, height: 96, background: "#c9ced3", clipPath: "polygon(0 30%,100% 0,100% 100%,0 70%)" })} /><div style={{ ...ab(190, 60), width: 80, height: 120, background: "linear-gradient(90deg,rgba(255,235,150,.75),transparent)", clipPath: "polygon(0 12%,100% 0,100% 100%,0 88%)" }} /></>;
    return <><div style={ab(30, 170, { width: 200, height: 40, background: "#7a7e82" })} /><div style={ab(106, 60, { width: 50, height: 70, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: AZ })} /><div style={ab(70, 92, { width: 124, height: 10, background: RED, transform: "rotate(-38deg)" })} /></>;
  };
  return <>{T.map((x, i) => { const c = i % 3, r = Math.floor(i / 3), s = cl((tt - 0.3 - i * 0.58) / 0.3); return <div key={x} style={ab(180 + c * 540, 110 + r * 460, { width: 480, height: 420, borderRadius: 22, background: "linear-gradient(#26313a,#161d24)", border: `3px solid ${s >= 1 ? VER : DIM}`, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, boxShadow: "0 18px 38px rgba(0,0,0,.5)" })}>
    <div style={ab(24, 22, { width: 74, height: 74, borderRadius: "50%", background: MZ, color: "#1a1505", fontSize: 54, fontWeight: 900, textAlign: "center", lineHeight: "74px" })}>{i + 1}</div>
    <div style={ab(112, 80, { width: 260, height: 230, transform: "scale(1.05)" })}>{Ob(i)}</div>
    <div style={ab(0, 330, { width: 480, textAlign: "center", fontSize: 56, fontWeight: 900, color: TX })}>{x}</div>
  </div>; })}</>;
}}</Stage>;

// 20 · el chipote en la manguera: crece hasta reventar
const Chipote: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#191f27" mesa={false}>{(tt) => {
  const g = eio(tt, 0.4, 3.0), boom = tt > 3.1, rx = 90 + g * 90, ry = 66 + g * 120;
  return <>
    <div style={ab(0, 440, { width: 1920, height: 132, background: "linear-gradient(#3a3d41,#17191c 70%)" })} />
    {!boom && <div style={ab(860 - rx + 100, 506 - ry, { width: 2 * rx, height: 2 * ry, borderRadius: "50%", background: "radial-gradient(circle at 42% 30%,#5a5e63,#1c1e22 70%)", boxShadow: "0 14px 30px rgba(0,0,0,.55)" })} />}
    {[[620, 460], [690, 540], [1170, 462]].map(([x, y]) => <div key={x} style={ab(x, y, { width: 70, height: 4, background: "#0a0b0c", transform: "rotate(18deg)" })} />)}
    <div style={ab(0, 440, { width: 170, height: 132, background: ACERO })} /><div style={ab(1750, 440, { width: 170, height: 132, background: ACERO })} />
    {boom && Array.from({ length: 34 }, (_, i) => { const a = (i * 137.5 * Math.PI) / 180, k = ((tt - 3.1) * 3 + rnd(i) * 0.4) % 1, r = 60 + k * 620; return <div key={i} style={ab(960 + Math.cos(a) * r, 506 + Math.sin(a) * r * 0.7, { width: 26, height: 26, borderRadius: "50%", background: AZ, opacity: 1 - k })} />; })}
    <Txt x={500} y={200} w={720} col={TX} size={60} o={e1(tt, 0.8)}>CON PRESIÓN TODO EL DÍA</Txt>
    <Tag tt={tt} at={2.0} x={1450} y={220} txt="CHIPOTE" col={MZ} size={84} />
    <Tag tt={tt} at={3.2} x={960} y={830} txt="REVIENTA" col={RED} size={110} />
  </>;
}}</Stage>;

// 21 · dos pisos: el agua baja al vecino
const Dospisos: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#1a2028" mesa={false}>{(tt) => {
  const w = eio(tt, 0.4, 2.2), down = eio(tt, 2.2, 3.6);
  return <>
    <div style={ab(280, 90, { width: 1360, height: 900, background: "#2a323b", border: "12px solid #cfd6da" })} />
    <div style={ab(292, 530, { width: 1336, height: 34, background: "#8b7a5f" })} />
    <Lav x={380} y={190} w={260} />
    <div style={ab(292, 530 - 70 * w, { width: 1336, height: 70 * w, background: "linear-gradient(rgba(95,196,255,.55),rgba(30,110,190,.85))" })} />
    {[720, 960, 1240].map((x, i) => <React.Fragment key={x}>
      <div style={ab(x - 90, 564, { width: 180, height: 90 * down, borderRadius: "0 0 90px 90px", background: "rgba(70,50,30,.7)" })} />
      {down > 0.2 && [0, 1, 2].map((k) => <div key={k} style={ab(x - 8, 610 + (((tt + i * 0.2) * 300 + k * 110) % 340), { width: 20, height: 34, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: AZ })} />)}
    </React.Fragment>)}
    <div style={ab(1400, 700, { opacity: down })}><div style={ab(40, 0, { width: 90, height: 90, borderRadius: "50%", background: TX })} /><div style={ab(20, 96, { width: 130, height: 200, borderRadius: 36, background: TX })} /></div>
    <Tag tt={tt} at={0.9} x={1180} y={180} txt="TU PISO" col={AZ} size={80} />
    <Tag tt={tt} at={2.9} x={560} y={780} txt="EL VECINO" col={RED} size={80} />
  </>;
}}</Stage>;

// 22 · hule contra malla: la manguera se envuelve en acero
const Malla: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1a1f25" mesa={false}>{(tt) => {
  const w = eio(tt, 1.6, 3.2) * 1500;
  return <>
    <div style={ab(210, 420, { width: 1500, height: 240, borderRadius: 60, background: "linear-gradient(#45484d,#141518 75%)", overflow: "hidden" })}>
      {Array.from({ length: 22 }, (_, i) => <div key={i} style={ab(30 + i * 68, 40 + rnd(i) * 150, { width: 42, height: 3, background: "#07080a", transform: `rotate(${rnd(i * 3) * 80 - 40}deg)` })} />)}
      <div style={ab(0, 0, { width: w, height: 240, background: "repeating-linear-gradient(55deg,#f1f4f6 0 5px,#7b838a 5px 12px),repeating-linear-gradient(-55deg,rgba(255,255,255,.6) 0 5px,transparent 5px 12px)", backgroundBlendMode: "overlay" })} />
    </div>
    <div style={ab(120, 410, { width: 130, height: 260, borderRadius: 10, background: "linear-gradient(#d3a54a,#8f6a1f)" })} />
    <div style={ab(1670, 410, { width: 130, height: 260, borderRadius: 10, background: "linear-gradient(#d3a54a,#8f6a1f)" })} />
    <Tag tt={tt} at={0.5} x={520} y={250} txt="HULE RESECO" col={OXI} size={74} />
    <Tag tt={tt} at={2.6} x={1400} y={250} txt="MALLA DE ACERO" col={TX} size={66} />
    <Tag tt={tt} at={3.4} x={960} y={790} txt="CADA 5 AÑOS" col={MZ} size={92} />
  </>;
}}</Stage>;

// 23 · la altura del desagüe: muy baja, la del manual, muy alta
const Sifon: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#161c22" mesa={false}>{(tt) => {
  const P = [{ y: 780, c: RED, tx: "MUY BAJA", s: 0.3 }, { y: 460, c: VER, tx: "LA DEL MANUAL", s: 1.5 }, { y: 150, c: RED, tx: "MUY ALTA", s: 2.7 }];
  return <>{P.map((p, i) => { const x = 60 + i * 620, o = e1(tt, p.s); return <div key={i} style={{ opacity: o }}>
    <div style={ab(x, 100, { width: 560, height: 820, borderRadius: 18, background: "rgba(255,255,255,.05)", border: `3px solid ${p.c}` })} />
    <div style={ab(x + 26, 620, { width: 210, height: 280, borderRadius: 10, background: "linear-gradient(#fafbfb,#c9d0d4)" })}><div style={ab(45, 80, { width: 120, height: 120, borderRadius: "50%", background: "#1d242b", boxShadow: "0 0 0 8px #9aa3a9" })} /></div>
    <div style={ab(x + 410, 140, { width: 84, height: 770, background: "linear-gradient(90deg,#d9dee1,#8b9298)" })} />
    <SVG><path d={`M${x + 236} 860 C ${x + 330} 860, ${x + 300} ${p.y}, ${x + 452} ${p.y}`} fill="none" stroke="#1c1e22" strokeWidth={26} strokeLinecap="round" /><path d={`M${x + 236} 860 C ${x + 330} 860, ${x + 300} ${p.y}, ${x + 452} ${p.y}`} fill="none" stroke={i === 1 ? AZ : RED} strokeWidth={8} strokeDasharray="22 26" strokeDashoffset={(i === 0 ? 1 : -1) * tt * 120} /></SVG>
    <div style={ab(x, 960, { width: 560, textAlign: "center", fontSize: 58, fontWeight: 900, color: p.c })}>{p.tx}</div>
  </div>; })}</>;
}}</Stage>;

// 24 · el pliegue de la goma en corte: agua, moho, grieta
const Pliegue: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#10151a" mesa={false}>{(tt) => {
  const m = eio(tt, 1.2, 2.8), g = eio(tt, 2.8, 3.5), d = "M200 240 C 420 240,470 820,760 820 C 1050 820,960 340,1180 340 C 1400 340,1420 820,1760 820";
  return <>
    <SVG>
      <path d={d} fill="none" stroke="#6a7278" strokeWidth={120} strokeLinecap="round" /><path d={d} fill="none" stroke="#899198" strokeWidth={70} strokeLinecap="round" />
      <ellipse cx={760} cy={786} rx={170} ry={34} fill={AZ} opacity={e1(tt, 0.4)} />
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={560 + rnd(i * 3) * 400} cy={700 + rnd(i * 7) * 130} r={6 + rnd(i) * 22 * m} fill="#0b0d0a" opacity={m} />)}
      <path d="M760 800 L740 836 L776 864 L748 900 L772 950" stroke="#040505" strokeWidth={10} fill="none" strokeDasharray={200} strokeDashoffset={200 * (1 - g)} />
    </SVG>
    {[0, 1, 2].map((i) => <div key={i} style={ab(752, 950 + ((tt * 220 + i * 40) % 110), { width: 22, height: 36, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: AZ, opacity: g })} />)}
    <Tag tt={tt} at={0.6} x={1130} y={150} txt="QUEDA AGUA" col={AZ} size={78} />
    <Tag tt={tt} at={1.8} x={380} y={640} txt="MOHO" col={VER} size={92} />
    <Tag tt={tt} at={3.2} x={1250} y={880} txt="SE AGRIETA" col={RED} size={84} />
  </>;
}}</Stage>;

// 25 · la lavadora avisa: el ruido crece mientras la tele sube el volumen
const Avisos: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#191b22" mesa={false}>{(tt) => {
  const k = eio(tt, 0.3, 3.4), vol = Math.ceil(k * 12);
  return <>
    <div style={ab(1200, 100, { width: 620, height: 370, borderRadius: 18, background: "linear-gradient(#20252b,#0a0c0f)", border: "12px solid #2f343a" })}>
      <div style={ab(50, 250, { width: 500, height: 40, display: "flex", gap: 8 })}>{Array.from({ length: 12 }, (_, i) => <div key={i} style={{ width: 34, height: 40, background: i < vol ? VER : "#2a2f35" }} />)}</div>
      <div style={ab(50, 150, { fontSize: 66, fontWeight: 900, color: TX })}>VOL {vol * 8}</div>
    </div>
    <div style={ab(110, 560, { width: 1700, height: 330, borderRadius: 18, background: "rgba(0,0,0,.45)", overflow: "hidden" })}>
      {Array.from({ length: 106 }, (_, i) => { const p = i / 106, on = p < k, a = (8 + p * p * 150) * (0.5 + 0.5 * rnd(i * 2)); return <div key={i} style={ab(14 + i * 16, 165 - a, { width: 9, height: 2 * a, borderRadius: 4, background: on ? (p > 0.72 ? RED : p > 0.4 ? MZ : AZ) : "rgba(255,255,255,.08)" })} />; })}
    </div>
    <Tag tt={tt} at={0.7} x={330} y={940} txt="MURMULLO" col={AZ} size={64} />
    <Tag tt={tt} at={1.9} x={960} y={940} txt="AVIÓN" col={MZ} size={72} />
    <Tag tt={tt} at={3.1} x={1560} y={940} txt="SE ACABÓ" col={RED} size={72} />
    <Txt x={540} y={180} w={880} size={70} o={e1(tt, 0.4)} col={TX}>MESES AVISANDO</Txt>
  </>;
}}</Stage>;

// 26 · el balero: entra agua por el sello, se va la grasa, llega el óxido
const Balero: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#14191f" mesa={false}>{(tt) => {
  const ox = eio(tt, 2.2, 3.8), gr = 1 - eio(tt, 1.2, 2.4), a = tt * (70 - ox * 58), N = 12, R = 280;
  return <>
    <div style={ab(960 - 400, 540 - 400, { width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle,transparent 64%,#b4bbc1 65%,#e7ebee 80%,#8b9298 100%)" })} />
    <div style={ab(960 - 200, 540 - 200, { width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,#10151a 42%,#8b9298 44%,#e7ebee 82%,#7b838a 100%)" })} />
    <div style={ab(960 - 330, 540 - 330, { width: 660, height: 660, borderRadius: "50%", boxShadow: `inset 0 0 0 110px rgba(226,178,56,${0.55 * gr})` })} />
    {Array.from({ length: N }, (_, i) => { const r = ((i * 360) / N + a) * Math.PI / 180, j = Math.sin(tt * 40 + i) * 6 * ox; return <div key={i} style={ab(960 + Math.cos(r) * R - 60 + j, 540 + Math.sin(r) * R - 60, { width: 120, height: 120, borderRadius: "50%", background: ox > 0.5 && i % 2 ? `radial-gradient(circle at 34% 30%,#d9a06a,${OXI} 55%,#54250b)` : `radial-gradient(circle at 34% 30%,#fff,#9aa3a9 55%,#3f464c)`, boxShadow: "0 8px 16px rgba(0,0,0,.5)" })} />; })}
    {Array.from({ length: 8 }, (_, i) => <div key={i} style={ab(60 + ((tt * 220 + i * 75) % 560), 490 + rnd(i) * 90, { width: 30, height: 48, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: AZ, transform: "rotate(90deg)", opacity: e1(tt, 0.6) * (tt < 3.0 ? 1 : 0.4) })} />)}
    <Tag tt={tt} at={0.7} x={280} y={350} txt="SELLO ROTO" col={AZ} size={72} />
    <Tag tt={tt} at={1.7} x={1640} y={300} txt="SIN GRASA" col={MZ} size={72} />
    <Tag tt={tt} at={2.8} x={1640} y={780} txt="ÓXIDO" col={OXI} size={100} />
  </>;
}}</Stage>;

// 27 · la prueba del empujón: curva de rebote sana contra curva vieja
const Rebote: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#171d24" mesa={false}>{(tt) => {
  const W = 1000, P = (f: (x: number) => number, k: number) => { let d = ""; for (let i = 0; i <= 200 * k; i++) { const x = i / 200; d += `${i ? "L" : "M"}${760 + x * W} ${f(x)} `; } return d; };
  const sano = (x: number) => 370 + 170 * Math.exp(-x * 9), viejo = (x: number) => 790 + 170 * Math.exp(-x * 1.6) * Math.cos(x * 30);
  const k1 = eio(tt, 0.5, 1.8), k2 = eio(tt, 2.0, 3.6), bo = (tt > 2 ? Math.exp(-(tt - 2) * 0.7) * Math.cos((tt - 2) * 12) : 1) * 110;
  return <>
    <SVG><Muelle x={380} y1={180} y2={560 + bo} w={70} col="#e7ebee" />
      <rect x={260} y={560 + bo} width={240} height={46} rx={10} fill="#8b9298" /><rect x={250} y={880} width={260} height={60} rx={8} fill="#454b51" />
      <path d={`M380 606 L380 880`} stroke="#454b51" strokeWidth={36} />
      <path d={P(sano, k1)} fill="none" stroke={VER} strokeWidth={12} /><path d={P(viejo, k2)} fill="none" stroke={RED} strokeWidth={12} />
    </SVG>
    <div style={ab(320, 90 , { width: 120, height: 92, background: "#d9dee1", borderRadius: 8 })} />
    <Tag tt={tt} at={1.0} x={1280} y={170} txt="BAJA Y SE QUEDA" col={VER} size={66} />
    <Tag tt={tt} at={2.7} x={1280} y={590} txt="REBOTA" col={RED} size={84} />
    <Txt x={1280} y={990} w={1000} size={54} col={MZ} o={e1(tt, 3.5)}>AMORTIGUADOR ACABADO</Txt>
  </>;
}}</Stage>;

// 28 · la prueba de oído: cuatro ruidos, cuatro diagnósticos
const Oido: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#141820" mesa={false}>{(tt) => {
  const R = [{ a: "ZUMBIDO PAREJO", b: "NORMAL", c: VER, f: (i: number) => 18 }, { a: "RUGIDO QUE SUBE", b: "BALEROS", c: RED, f: (i: number) => 10 + i * 1.3 * (0.6 + rnd(i) * 0.4) }, { a: "CHILLIDO AGUDO", b: "BANDA/POLEA", c: MZ, f: (i: number) => (i % 2 ? 56 : 12) }, { a: "TAC · TAC · TAC", b: "MONEDA ATORADA", c: AZ, f: (i: number) => (i % 13 === 0 ? 70 : 4) }];
  return <>{R.map((r, i) => { const s = cl((tt - 0.3 - i * 0.92) / 0.3), y = 70 + i * 248; return <div key={i} style={ab(120 + (1 - s) * -60, y, { width: 1680, height: 220, borderRadius: 20, background: "rgba(255,255,255,.05)", border: `3px solid ${r.c}`, opacity: s })}>
    <div style={ab(30, 30, { width: 620, fontSize: 56, fontWeight: 900, color: TX, lineHeight: "160px" })}>{r.a}</div>
    <div style={ab(660, 20, { width: 480, height: 180 })}>{Array.from({ length: 46 }, (_, k) => { const a = Math.min(82, r.f(k)) * (0.7 + 0.3 * Math.sin(tt * 10 + k)); return <div key={k} style={ab(k * 10.4, 90 - a, { width: 6, height: 2 * a, background: r.c, borderRadius: 3 })} />; })}</div>
    <div style={ab(1150, 30, { width: 510, fontSize: 56, fontWeight: 900, color: r.c, textAlign: "center", lineHeight: "160px" })}>{r.b}</div>
  </div>; })}</>;
}}</Stage>;

// 29 · los anillos del mantenimiento: del más frecuente al de cada 5 años
const Anillos: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#12191f" mesa={false}>{(tt) => {
  const A = [{ l: "CADA CARGA", d: "bolsillos · poco jabón", c: VER }, { l: "CADA MES", d: "goma y cajón", c: AZ }, { l: "CADA 3 MESES", d: "filtro de la bomba", c: MZ }, { l: "CADA AÑO", d: "las 3 pruebas", c: OXI }, { l: "CADA 5 AÑOS", d: "mangueras nuevas", c: RED }];
  return <>
    <SVG>{A.map((a, i) => { const r = 90 + i * 72, k = eio(tt, 0.3 + i * 0.78, 0.9 + i * 0.78), c = 2 * Math.PI * r; return <g key={i}><circle cx={500} cy={540} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={50} /><circle cx={500} cy={540} r={r} fill="none" stroke={a.c} strokeWidth={50} strokeDasharray={c} strokeDashoffset={c * (1 - k)} transform="rotate(-90 500 540)" /></g>; })}</SVG>
    {A.map((a, i) => <div key={i} style={ab(1010, 90 + i * 186, { width: 840, opacity: e1(tt, 0.5 + i * 0.78) })}>
      <div style={{ fontSize: 66, fontWeight: 900, color: a.c, lineHeight: 1.05 }}>{a.l}</div><div style={{ fontSize: 52, fontWeight: 700, color: TX, lineHeight: 1.1 }}>{a.d}</div>
    </div>)}
  </>;
}}</Stage>;

// 30 · la de 21 años: los años corren y sólo se le cambiaron dos piezas
const Veintiuno: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1d2026" mesa={false}>{(tt) => {
  const n = Math.round(eio(tt, 0.3, 2.4) * 21);
  return <>
    <Lav x={150} y={200} w={520} />
    <div style={ab(780, 150, { width: 980, textAlign: "center", fontSize: 340, fontWeight: 900, color: MZ, lineHeight: 1, textShadow: "0 16px 40px rgba(0,0,0,.65)", fontVariantNumeric: "tabular-nums" })}>{n}</div>
    <div style={ab(780, 510, { width: 980, textAlign: "center", fontSize: 92, fontWeight: 900, color: TX })}>AÑOS</div>
    <div style={{ opacity: e1(tt, 2.6) }}><div style={ab(860, 680, { width: 380, height: 240, borderRadius: 18, background: "rgba(0,0,0,.45)", border: `3px solid ${VER}` })}><div style={ab(70, 30, { width: 240, height: 120, borderRadius: "50%", border: "16px solid #9aa3a9" })} /><div style={ab(0, 165, { width: 380, textAlign: "center", fontSize: 58, fontWeight: 900, color: TX })}>UNA BANDA</div></div></div>
    <div style={{ opacity: e1(tt, 3.1) }}><div style={ab(1290, 680, { width: 420, height: 240, borderRadius: 18, background: "rgba(0,0,0,.45)", border: `3px solid ${VER}` })}><div style={ab(40, 70, { width: 340, height: 50, borderRadius: 25, background: "repeating-linear-gradient(55deg,#f1f4f6 0 4px,#7b838a 4px 10px)" })} /><div style={ab(0, 165, { width: 420, textAlign: "center", fontSize: 58, fontWeight: 900, color: TX })}>MANGUERAS</div></div></div>
  </>;
}}</Stage>;

export const TEC: Record<string, C> = {
  saltos: Saltos, siete: Siete, regla15: Regla15, colgado: Colgado, tendedero: Tendedero, descentrado: Descentrado, manocanto: Manocanto, placa8: Placa8, tapita: Tapita, colchon: Colchon,
  exprimir: Exprimir, nomezclar: Nomezclar, pataaire: Pataaire, esquina: Esquina, burbuja: Burbuja, tornillos: Tornillos, proyectil: Proyectil, alambre: Alambre, seispasos: Seispasos,
  chipote: Chipote, dospisos: Dospisos, malla: Malla, sifon: Sifon, pliegue: Pliegue, avisos: Avisos, balero: Balero, rebote: Rebote, oido: Oido, anillos: Anillos, veintiuno: Veintiuno,
};
