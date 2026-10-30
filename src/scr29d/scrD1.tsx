// scr29d · componentes únicos 1-14 (minutos 0-9). Ninguno repetido con scr29a/b/c. Mismo escenario hkit: entrada con máscara, cámara curva, salida fundida.
import React from "react";
import { AMB, H, HAND, ICE, MARK, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const it = (h: H, i: number, d = 99) => (h.items?.[i]?.at as number | undefined) ?? d;
const GRN = "#6fe39a", BLU = "#5aa8ff";
const tin = "linear-gradient(90deg,#5d6066 0%,#a9aeb5 18%,#e2e5e9 30%,#9ea3aa 52%,#5a5d63 78%,#3b3d42 100%)";
const dust = "repeating-radial-gradient(circle at 30% 40%, #c9995a 0 3px, #b7864a 3px 6px, #d8ab6c 6px 8px)";
const oak = "linear-gradient(180deg,#b98a55,#94683a)";
// llama dibujada: color de naranja (0) a azul (1), parpadeo lento ≤2 Hz
export const Flame: React.FC<{ x: number; y: number; w: number; hgt: number; blue: number; tt: number; on?: number }> = ({ x, y, w, hgt, blue, tt, on = 1 }) => {
  const c1 = blue > 0.5 ? "#dff0ff" : "#fff2c0", c2 = `rgb(${255 - 190 * blue},${140 + 30 * blue},${40 + 215 * blue})`;
  return <div style={{ position: "absolute", left: x - w / 2, top: y - hgt * on, width: w, height: hgt * on, borderRadius: "50% 50% 42% 42%", background: `radial-gradient(ellipse at 50% 88%, ${c1}, ${c2} 45%, rgba(0,0,0,0) 74%)`, transform: `scaleY(${0.94 + 0.06 * Math.sin(tt * 2 * Math.PI * 1.3)})`, transformOrigin: "50% 100%", filter: `blur(${2 + 4 * (1 - blue)}px)` }} />;
};
// la lata de pintura de costado (aro, borde y cuerpo de chapa); fill = cuánto aserrín (0-1), oil = cuánto mojado de aceite (0-1, de arriba hacia abajo)
export const Can: React.FC<{ x: number; y: number; w: number; hh: number; fill?: number; oil?: number; holes?: number; cut?: boolean; children?: React.ReactNode }> = ({ x, y, w, hh, fill = 0, oil = 0, holes = 0, cut, children }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - hh, width: w, height: hh }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "10px 10px 16px 16px", background: tin, boxShadow: "0 40px 80px rgba(0,0,0,.6)", overflow: "hidden" }}>
      {cut && <div style={{ position: "absolute", left: 18, right: 18, top: 14, bottom: 14, background: "#151311", borderRadius: 6 }} />}
      {fill > 0 && <div style={{ position: "absolute", left: cut ? 18 : 0, right: cut ? 18 : 0, bottom: cut ? 14 : 0, height: (hh - 28) * fill, background: dust, opacity: cut ? 1 : 0 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${oil * 100}%`, background: "linear-gradient(180deg, rgba(40,22,8,.85), rgba(60,34,12,.55))" }} />
      </div>}
      {Array.from({ length: holes }, (_, k) => <div key={k} style={{ position: "absolute", left: (w / (holes + 1)) * (k + 1) - 9, top: 34, width: 18, height: 18, borderRadius: "50%", background: "#0b0b0c", boxShadow: "inset 0 2px 3px rgba(255,255,255,.2)" }} />)}
      {[0.14, 0.86].map((r) => <div key={r} style={{ position: "absolute", left: 0, right: 0, top: hh * r, height: 6, background: "rgba(0,0,0,.22)" }} />)}
    </div>
    <div style={{ position: "absolute", left: -8, right: -8, top: -10, height: 22, borderRadius: 8, background: tin }} />
    {children}
  </div>
);

// ---- 0:25 · EL RELOJ DE LA PARED: un reloj de taller enorme; dos agujas de color, la de la sartén da media vuelta y se apaga, la de la lata sigue y da la vuelta entera ----
export const HWallclock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const run = eio(tt, 0.8, 5.6), aPan = 180 * cl(run * 2), aCan = 360 * run, R = 330;
  const hand = (deg: number, col: string, len: number, wd: number, op = 1) => <div style={{ position: "absolute", left: 960 - wd / 2, top: 540 - len, width: wd, height: len, borderRadius: wd, background: col, transformOrigin: `${wd / 2}px ${len}px`, transform: `rotate(${deg}deg)`, opacity: op, boxShadow: `0 0 30px ${col}` }} />;
  return <>
    <div style={{ position: "absolute", left: 960 - R - 34, top: 540 - R - 34, width: (R + 34) * 2, height: (R + 34) * 2, borderRadius: "50%", background: "linear-gradient(160deg,#3b2b1c,#1a120b)", boxShadow: "0 50px 100px rgba(0,0,0,.7)" }} />
    <div style={{ position: "absolute", left: 960 - R, top: 540 - R, width: R * 2, height: R * 2, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%,#f5efe2,#d9cfba)" }}>
      {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: R - 4, top: 14, width: 8, height: k % 3 ? 26 : 46, background: "#2a241d", transformOrigin: `4px ${R - 14}px`, transform: `rotate(${k * 30}deg)` }} />)}
      {/* sector que pinta cada aguja: lo que quema cada una */}
      <div style={{ position: "absolute", inset: 60, borderRadius: "50%", background: `conic-gradient(rgba(255,120,50,.35) 0deg ${aPan}deg, transparent ${aPan}deg)` }} />
      <div style={{ position: "absolute", inset: 130, borderRadius: "50%", background: `conic-gradient(rgba(90,168,255,.35) 0deg ${aCan}deg, transparent ${aCan}deg)` }} />
    </div>
    {hand(aPan, "#ff7a32", 260, 18, 1 - 0.6 * cl((run - 0.5) * 4))}
    {hand(aCan, BLU, 200, 22)}
    <div style={{ position: "absolute", left: 940, top: 520, width: 40, height: 40, borderRadius: "50%", background: "#2a241d" }} />
    <Tag tt={tt} at={2.6} x={1340} y={330} txt="PAN" col="#ff9a5a" size={70} anchor="l" />
    <Tag tt={tt} at={4.6} x={960} y={970} txt="CAN" col="#9fd4ff" size={70} />
  </>;
}}</Stage>;

// ---- 1:46 · EL QUINQUÉ: un farol de abuela con su frasco de aceite; el aceite sube por la mecha en gotitas y arriba se vuelve una llama chica que no se apura ----
export const HLamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const climb = cl((tt - it(h, 0) + 0.8) / 2), lit = eio(tt, 0.6, 1.6);
  return <>
    <div style={{ position: "absolute", left: 1460, top: 200, transform: "translate(-50%,-50%) rotate(-2deg)" }}><Photo id={h.img} w={440} h={300} /></div>
    {/* el frasco */}
    <div style={{ position: "absolute", left: 600, top: 640, width: 380, height: 300, borderRadius: "40% 40% 30px 30px", background: "linear-gradient(90deg,rgba(255,255,255,.12),rgba(255,255,255,.32) 30%,rgba(255,255,255,.1) 70%)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 4px rgba(255,255,255,.25)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 170, background: "linear-gradient(180deg,#d39b3a,#8a5a16)" }} />
    </div>
    {/* la mecha de tela */}
    <div style={{ position: "absolute", left: 776, top: 400, width: 28, height: 420, borderRadius: 6, background: "repeating-linear-gradient(180deg,#e9dcc3 0 10px,#d6c6a6 10px 14px)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${40 + 60 * climb}%`, borderRadius: 6, background: "linear-gradient(180deg, rgba(160,100,30,.25), rgba(160,100,30,.85))" }} />
      {Array.from({ length: 6 }, (_, k) => { const y = 420 - (((tt * 46 + k * 70) % 420)); return <div key={k} style={{ position: "absolute", left: 6, top: y, width: 16, height: 16, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#e8b14a", opacity: climb * 0.9, boxShadow: "0 0 10px #ffb257" }} />; })}
    </div>
    {/* la chimenea de vidrio y la llama */}
    <div style={{ position: "absolute", left: 700, top: 150, width: 180, height: 260, borderRadius: "45% 45% 20px 20px", background: "linear-gradient(90deg,rgba(255,255,255,.06),rgba(255,255,255,.22) 35%,rgba(255,255,255,.05))", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.18)" }} />
    <Flame x={790} y={404} w={70} hgt={150} blue={0.05} tt={tt} on={lit} />
    <div style={{ position: "absolute", left: 790 - 260, top: 330 - 260, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,190,90,.25), transparent 65%)", opacity: lit }} />
    <Tag tt={tt} at={it(h, 0)} x={1000} y={560} txt="IT CLIMBS" col={AMB} size={64} anchor="l" />
    <Tag tt={tt} at={it(h, 1)} x={1000} y={680} txt="THE WICK DECIDES" col={TX} size={52} anchor="l" />
  </>;
}}</Stage>;

// ---- 2:16 · LOS GRANOS: lupa de taller sobre el aserrín; cada grano oscurece al chupar una gota y la mancha se reparte en miles, sin charco ----
export const HGrains: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const soak = cl((tt - it(h, 0) + 0.6) / 2.4), many = eio(tt, it(h, 1) - 0.4, it(h, 1) + 1.2), zoom = 1.3 - 0.35 * many;
  return <>
    <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) scale(${zoom})` }}>
      <div style={{ position: "relative", width: 900, height: 900 }}>
        {Array.from({ length: 60 }, (_, k) => { const a = k * 2.4, r = 40 + (k * 53) % 380, x = 450 + r * Math.cos(a), y = 450 + r * Math.sin(a), d = Math.hypot(x - 450, y - 450) / 420, wet = cl(soak * 1.6 - d * 0.8);
          return <div key={k} style={{ position: "absolute", left: x - 34, top: y - 22, width: 68 + (k % 4) * 10, height: 44, borderRadius: "40% 55% 45% 60%", transform: `rotate(${k * 37}deg)`, background: `linear-gradient(140deg, rgb(${216 - 150 * wet},${171 - 120 * wet},${108 - 85 * wet}), rgb(${170 - 120 * wet},${125 - 95 * wet},${70 - 55 * wet}))`, boxShadow: `inset 0 3px 0 rgba(255,240,200,${0.3 - 0.2 * wet}), 0 6px 10px rgba(0,0,0,.4)` }} />; })}
      </div>
    </div>
    {/* la mecha de tela que cruza el aserrín y se oscurece */}
    <div style={{ position: "absolute", left: 1600, top: 0, width: 60, height: 1080, borderRadius: 8, background: "repeating-linear-gradient(180deg,#e9dcc3 0 12px,#d6c6a6 12px 16px)", boxShadow: "0 0 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 540 - 540 * soak, height: 1080 * soak, background: "rgba(120,70,20,.75)" }} />
    </div>
    {/* la gota que cae al centro */}
    <div style={{ position: "absolute", left: 940, top: -80 + 600 * eio(tt, it(h, 0) - 1, it(h, 0)), width: 40, height: 56, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "linear-gradient(180deg,#e0a447,#8a5a16)", opacity: 1 - cl((tt - it(h, 0)) * 3) }} />
    {/* aro de lupa */}
    <div style={{ position: "absolute", left: 960 - 470 * zoom - 30, top: 540 - 470 * zoom - 30, width: (470 * zoom + 30) * 2, height: (470 * zoom + 30) * 2, borderRadius: "50%", border: "26px solid #2c2c30", boxShadow: "0 0 0 4px #6a6d73, 0 40px 80px rgba(0,0,0,.6)", opacity: 1 - many }} />
    <Tag tt={tt} at={it(h, 0) + 0.8} x={960} y={175} txt="EVERY GRAIN HOLDS OIL" col={AMB} size={62} />
    <Tag tt={tt} at={it(h, 1) + 0.6} x={960} y={980} txt="NO POOL TO FLASH" col={GRN} size={66} />
  </>;
}}</Stage>;

// ---- 3:06 · LOS TACOS DE MADERA: cuatro tacos de madera real caen sobre la mesa en fila, con su veta y su nombre quemado a fuego ----
export const HWoodtypes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const W = [["OAK", "#b98a55", "#8a5f33"], ["MAPLE", "#e2c79a", "#c7a776"], ["ASH", "#d6c09a", "#a98d63"], ["PINE", "#e9cf8a", "#cf9f52"]], ats = [0.5, it(h, 0), it(h, 1), it(h, 2)];
  return <>
    {W.map(([n, c1, c2], i) => { const s = phys(tt, ats[i], 7, 0.4), x = 320 + i * 410;
      return <div key={n} style={{ position: "absolute", left: x - 170, top: 380 - (1 - s) * 600, opacity: cl(s * 3), transform: `rotate(${(i % 2 ? 3 : -3) * (1 - s)}deg)` }}>
        <div style={{ width: 340, height: 380, borderRadius: 12, background: `repeating-linear-gradient(${92 + i * 3}deg, ${c1} 0 14px, ${c2} 14px 18px, ${c1} 18px 34px)`, boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: MARK, fontSize: 76, color: "rgba(40,20,6,.85)", transform: "rotate(-4deg)", textShadow: "0 1px 0 rgba(255,220,170,.3)" }}>{n}</div>
        </div>
        {/* su montoncito de aserrín abajo */}
        <div style={{ width: 300, height: 70, margin: "-10px auto 0", borderRadius: "50% 50% 10px 10px", background: dust, opacity: cl((tt - ats[i] - 0.5) * 2) }} />
      </div>; })}
    <Tag tt={tt} at={ats[3] + 0.6} x={960} y={950} txt="PLAIN WOOD ONLY" col={GRN} size={66} />
  </>;
}}</Stage>;

// ---- 3:22 · LA PLACA CON PEGAMENTO: un MDF partido muestra el pegamento entre las fibras; al calentarse suben vapores verdes y se tacha; la tabla verde de deck también ----
export const HGlueboard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const fume = cl((tt - it(h, 0)) / 1.5), x1 = eio(tt, it(h, 0) + 1.6, it(h, 0) + 2.2), tr = phys(tt, it(h, 1), 6, 0.45), x2 = eio(tt, it(h, 1) + 1.0, it(h, 1) + 1.6);
  const cross = (p: number, cx: number, cy: number, w: number) => <svg width={w} height={w} style={{ position: "absolute", left: cx - w / 2, top: cy - w / 2 }}><path d={`M 20 20 L ${20 + (w - 40) * p} ${20 + (w - 40) * p}`} stroke={RED} strokeWidth={22} strokeLinecap="round" /><path d={`M ${w - 20} 20 L ${w - 20 - (w - 40) * cl(p * 2 - 1)} ${20 + (w - 40) * cl(p * 2 - 1)}`} stroke={RED} strokeWidth={22} strokeLinecap="round" /></svg>;
  return <>
    <div style={{ position: "absolute", left: 620, top: 560, transform: "translate(-50%,-50%) rotateX(18deg)" }}>
      <div style={{ width: 640, height: 420, borderRadius: 8, background: "linear-gradient(180deg,#a37d55,#7a5a3a)", boxShadow: "0 50px 90px rgba(0,0,0,.6)", position: "relative", overflow: "hidden" }}>
        {/* el canto partido: fibras con gotas de pegamento que brillan */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "repeating-linear-gradient(90deg,#8b6a46 0 6px,#a8835a 6px 9px)" }}>
          {Array.from({ length: 5 }, (_, k) => <div key={k} style={{ position: "absolute", left: 0, right: 0, top: 14 + k * 22, height: 5, background: "#f2e7a0", opacity: 0.8, boxShadow: "0 0 10px #f2e7a0" }} />)}
        </div>
        <div style={{ position: "absolute", left: 40, top: 40, fontFamily: MARK, fontSize: 90, color: "rgba(30,16,6,.75)" }}>MDF</div>
      </div>
      {Array.from({ length: 9 }, (_, k) => <div key={k} style={{ position: "absolute", left: 60 + k * 64, top: -40 - ((tt * 70 + k * 37) % 260), width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle, rgba(170,220,90,.55), transparent 70%)", opacity: fume * 0.9, filter: "blur(6px)" }} />)}
      {cross(x1, 320, 210, 520)}
    </div>
    <div style={{ position: "absolute", left: 1400, top: 560, transform: `translate(-50%,-50%) translateY(${(1 - tr) * 500}px)`, opacity: cl(tr * 3) }}>
      <div style={{ width: 520, height: 150, borderRadius: 6, background: "repeating-linear-gradient(90deg,#7e9a5e 0 22px,#6b8650 22px 26px)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 40, top: 30, border: "5px solid #1d2a14", borderRadius: 8, padding: "4px 14px", fontFamily: MARK, fontSize: 42, color: "#1d2a14", transform: "rotate(-3deg)" }}>PRESSURE TREATED</div>
      {Array.from({ length: 6 }, (_, k) => <div key={k} style={{ position: "absolute", left: 30 + k * 80, top: -40 - ((tt * 60 + k * 41) % 220), width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(170,220,90,.5), transparent 70%)", opacity: cl((tt - it(h, 1) - 0.4) * 2) * 0.9, filter: "blur(6px)" }} />)}
      {cross(x2, 260, 75, 300)}
    </div>
    <Tag tt={tt} at={it(h, 0) + 0.3} x={620} y={920} txt="GLUE FUMES" col="#c9f07a" size={56} />
    <Tag tt={tt} at={it(h, 1) + 0.6} x={1400} y={800} txt="CHEMICAL FUMES" col="#c9f07a" size={56} />
  </>;
}}</Stage>;

// ---- 4:12 · EL ANILLO DE AGUJEROS: la boca de la lata vista de arriba; un clavo y el martillo bajan y cada golpe deja un agujero en ronda (8), con aire que entra ----
export const HNailring: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const n = Math.min(8, Math.floor(cl((tt - 0.6) / (it(h, 0) - 0.2)) * 8 + (tt > 0.6 ? 1 : 0))), air = eio(tt, it(h, 1), it(h, 1) + 1);
  const a = (k: number) => -Math.PI / 2 + k * Math.PI / 4, R = 330, hit = (tt - 0.6) % ((it(h, 0) - 0.2) / 8);
  const nx = 960 + R * Math.cos(a(Math.max(0, n - 1))), ny = 540 + R * Math.sin(a(Math.max(0, n - 1)));
  return <>
    <div style={{ position: "absolute", left: 960 - 400, top: 140, width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle,#d7dbe0 0%,#9da2a9 55%,#6c7077 70%,#c9cdd2 74%,#4a4d52 80%)", boxShadow: "0 50px 100px rgba(0,0,0,.7)" }} />
    <div style={{ position: "absolute", left: 960 - 270, top: 270, width: 540, height: 540, borderRadius: "50%", background: dust, boxShadow: "inset 0 20px 40px rgba(0,0,0,.6)" }} />
    {Array.from({ length: n }, (_, k) => <div key={k} style={{ position: "absolute", left: 960 + R * Math.cos(a(k)) - 22, top: 540 + R * Math.sin(a(k)) - 22, width: 44, height: 44, borderRadius: "50%", background: "#0a0a0b", boxShadow: "0 0 0 5px #3c3f44" }} />)}
    {Array.from({ length: n }, (_, k) => <div key={"a" + k} style={{ position: "absolute", left: 960 + (R + 120 - 90 * ((tt * 0.8 + k * 0.13) % 1)) * Math.cos(a(k)) - 30, top: 540 + (R + 120 - 90 * ((tt * 0.8 + k * 0.13) % 1)) * Math.sin(a(k)) - 6, width: 60, height: 12, borderRadius: 6, background: ICE, opacity: air * 0.8, transform: `rotate(${a(k) * 180 / Math.PI}deg)` }} />)}
    {/* el clavo y la cabeza del martillo bajando en cada agujero */}
    {tt < it(h, 0) + 0.4 && <div style={{ position: "absolute", left: nx - 12, top: ny - 260 + 60 * Math.min(1, hit * 8), width: 24, height: 250, background: "linear-gradient(90deg,#8d9399,#e3e6ea,#7a8087)", borderRadius: "4px 4px 0 0" }}><div style={{ position: "absolute", left: -60, top: -110 + 40 * Math.min(1, hit * 8), width: 150, height: 90, borderRadius: 12, background: "linear-gradient(180deg,#3b3e43,#1b1c1f)" }} /></div>}
    <Tag tt={tt} at={it(h, 0)} x={1550} y={540} txt={`${n} × ½"`} col={AMB} size={80} />
    <Tag tt={tt} at={it(h, 1)} x={960} y={1030} txt="AIR IN AT THE TOP" col={ICE} size={52} />
  </>;
}}</Stage>;

// ---- 4:45 · LA LLAVE DE CUCHILLA: un interruptor de cuchilla de taller viejo cae; la mano lo baja con peso, salta la chispa y se prende la lamparita «SUBSCRIBE» ----
export const HKnifeswitch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const down = eio(tt, 1.4, 2.2), on = cl((tt - 2.2) * 4), spark = tt > 2.15 && tt < 2.6 ? 1 : 0;
  return <>
    <div style={{ position: "absolute", left: 700 - 330, top: 210, width: 660, height: 660, transform: "scale(1.4)", transformOrigin: "50% 50%", borderRadius: 18, background: "linear-gradient(160deg,#2b2a28,#141312)", boxShadow: "0 50px 100px rgba(0,0,0,.7), inset 0 0 0 10px #3a3835" }}>
      {[[180, 520], [480, 520]].map(([x, y], k) => <div key={k} style={{ position: "absolute", left: x - 40, top: y - 60, width: 80, height: 120, borderRadius: 8, background: "linear-gradient(90deg,#9a6a30,#e7b46a,#9a6a30)" }} />)}
      {/* las cuchillas que bajan, con la manija de baquelita */}
      <div style={{ position: "absolute", left: 120, top: 150, width: 420, height: 380, transformOrigin: "50% 100%", transform: `perspective(900px) rotateX(${70 - 70 * down}deg)` }}>
        {[60, 360].map((x) => <div key={x} style={{ position: "absolute", left: x - 16, top: 30, width: 32, height: 350, background: "linear-gradient(90deg,#9a6a30,#f0c27a,#9a6a30)", borderRadius: 6 }} />)}
        <div style={{ position: "absolute", left: 30, top: 0, width: 360, height: 70, borderRadius: 35, background: "linear-gradient(180deg,#3a1a10,#160805)", boxShadow: "inset 0 6px 0 rgba(255,255,255,.12)" }} />
      </div>
      {spark > 0 && [180, 480].map((x) => <div key={x} style={{ position: "absolute", left: x - 80, top: 440, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,#fff 0%,#9fd8ff 25%,transparent 65%)" }} />)}
    </div>
    {/* el cable lleva la corriente al botón rojo de SUBSCRIBE, que se prende */}
    <div style={{ position: "absolute", left: 1170, top: 536, width: 300 * on, height: 14, borderRadius: 7, background: "#1a1a1a", boxShadow: `0 0 ${30 * on}px rgba(255,200,120,${on})` }} />
    <div style={{ position: "absolute", left: 1470, top: 540, transform: `translate(0,-50%) scale(${0.92 + 0.08 * on})`, width: 380, height: 150, borderRadius: 26, background: on ? "linear-gradient(180deg,#ff3b30,#c4150e)" : "linear-gradient(180deg,#5a2a26,#33140f)", boxShadow: `0 30px 60px rgba(0,0,0,.6), 0 0 ${120 * on}px rgba(255,59,48,${0.6 * on})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 58, letterSpacing: 2, color: on ? "#fff" : "rgba(255,255,255,.35)" }}>SUBSCRIBE</div>
  </>;
}}</Stage>;

// ---- 5:02 · EL FRASCO QUE APRIETA: corte de la lata; cae una capa de aserrín suelto, el frasco de pepinos baja girando y la deja prieta, tres veces, hasta dos tercios ----
export const HJarpress: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const ats = [0.5, it(h, 0) - 1.2, it(h, 0) + 1.2], CH = 640, top = 900;
  let packed = 0, loose = 0, py = 0;
  ats.forEach((a, i) => { const pour = eio(tt, a, a + 0.8), press = eio(tt, a + 0.9, a + 1.8); loose += pour * (1 - press) * 120; packed += press * 140; if (tt > a) py = press < 1 && pour > 0.9 ? press : py; void i; });
  const lev = packed + loose, jarY = top - lev - 260 + 30 * Math.sin(Math.PI * py);
  const third = eio(tt, it(h, 1), it(h, 1) + 0.6);
  return <>
    <div style={{ position: "absolute", left: 660, top: top - CH, width: 600, height: CH, borderRadius: "12px 12px 20px 20px", background: tin, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: 14, bottom: 14, background: "#141210", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: packed, background: "repeating-linear-gradient(180deg,#a87a42 0 6px,#946a37 6px 8px)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: packed, height: loose, background: dust, opacity: 0.9 }} />
        {/* la marca de los dos tercios y el tercio vacío donde vive la llama */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: CH * 0.66 - 28, height: 4, background: "repeating-linear-gradient(90deg,#fff 0 18px,transparent 18px 30px)", opacity: 0.7 }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: CH * 0.33, background: "radial-gradient(ellipse at 50% 100%, rgba(255,150,60,.35), transparent 70%)", opacity: third }} />
      </div>
    </div>
    {/* el frasco de pepinos, de vidrio, apretando */}
    <div style={{ position: "absolute", left: 760, top: jarY, width: 400, height: 260, borderRadius: "30px 30px 16px 16px", background: "linear-gradient(90deg,rgba(200,230,220,.22),rgba(240,255,250,.55) 30%,rgba(190,220,210,.18))", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.35), 0 20px 40px rgba(0,0,0,.4)", transform: `rotate(${12 * Math.sin(tt * 3) * py}deg)`, opacity: tt < ats[2] + 2.2 ? 1 : 0.0 }}>
      <div style={{ position: "absolute", left: 50, right: 50, top: -40, height: 50, borderRadius: 10, background: "linear-gradient(180deg,#c9b24a,#8a7420)" }} />
    </div>
    <svg width={120} height={170} style={{ position: "absolute", left: 900, top: jarY - 190, opacity: cl((tt - ats[0] - 0.8) * 2) * (tt < ats[2] + 2.2 ? 1 : 0) }}><path d="M 60 0 L 60 120" stroke={AMB} strokeWidth={22} strokeLinecap="round" /><path d="M 15 100 L 60 160 L 105 100" stroke={AMB} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
    <Tag tt={tt} at={ats[0] + 1.6} x={1060} y={jarY - 110} txt="PRESS · TWIST" col={AMB} size={56} anchor="l" />
    <Tag tt={tt} at={it(h, 1) + 0.2} x={1290} y={360} txt="⅓ EMPTY" col="#ffb27a" size={62} anchor="l" />
  </>;
}}</Stage>;

// ---- 5:21 · SUELTO CONTRA APRETADO: dos columnas de aserrín; en la suelta la llama se mete por los huecos hasta abajo, en la apretada se queda arriba como sobre un bloque ----
export const HGaps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const dive = eio(tt, it(h, 0) - 0.6, it(h, 0) + 2), hold = eio(tt, it(h, 1) - 0.5, it(h, 1) + 0.6);
  const col = (x: number, loose: boolean) => <div style={{ position: "absolute", left: x - 230, top: 280, width: 460, height: 620, borderRadius: 14, background: "#151311", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 10px #8e939a", overflow: "hidden" }}>
    {loose ? Array.from({ length: 70 }, (_, k) => { const gx = (k * 67) % 420 + 20, gy = 30 + Math.floor(k / 7) * 58 + (k % 3) * 8;
      const lit = cl(dive * 1.3 - gy / 700); return <div key={k} style={{ position: "absolute", left: gx, top: gy, width: 46, height: 30, borderRadius: "45% 55% 40% 60%", background: lit > 0.05 ? `rgb(${200 + 55 * lit},${120 + 30 * lit},${50})` : "#c39558", boxShadow: lit > 0.05 ? `0 0 20px rgba(255,120,40,${lit})` : "none" }} />; })
      : <div style={{ position: "absolute", inset: 10, top: 40, background: "repeating-linear-gradient(180deg,#a87a42 0 5px,#946a37 5px 7px)" }}><div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 26, background: `rgba(255,130,40,${0.75 * hold})`, boxShadow: `0 0 40px rgba(255,130,40,${hold})` }} /></div>}
  </div>;
  return <>
    {col(560, true)}{col(1360, false)}
    <Flame x={560} y={300 + 520 * dive} w={170} hgt={160} blue={0} tt={tt} />
    <Flame x={1360} y={330} w={170} hgt={170} blue={0.25} tt={tt} on={hold} />
    <Tag tt={tt} at={0.8} x={560} y={960} txt="LOOSE" col={RED} size={64} />
    <Tag tt={tt} at={it(h, 1)} x={1360} y={960} txt="PACKED" col={GRN} size={64} />
  </>;
}}</Stage>;

// ---- 5:49 · EL PALO DE ESCOBA: corte de la lata llena; el palo baja hasta el fondo, hace un circulito y sale dejando un pozo limpio en el centro ----
export const HPlunge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const down = eio(tt, 0.5, it(h, 0) - 0.2), wig = tt > it(h, 0) - 0.2 && tt < it(h, 1) ? Math.sin((tt - it(h, 0)) * 9) * 10 : 0, up = eio(tt, it(h, 1), it(h, 1) + 1.2);
  const hole = cl(down * 1.05), stickY = 120 + 560 * down - 420 * up;
  return <>
    <div style={{ position: "absolute", left: 960 - 330, top: 300, width: 660, height: 640, borderRadius: "12px 12px 20px 20px", background: tin, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: 220, bottom: 14, background: "repeating-linear-gradient(180deg,#a87a42 0 6px,#946a37 6px 8px)", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 310 - 20 - 36, top: 0, width: 72, height: `${hole * 100}%`, background: "linear-gradient(90deg,#0d0b09,#231b13 50%,#0d0b09)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 960 - 34 + wig, top: stickY - 300, width: 68, height: 900, borderRadius: 34, background: "linear-gradient(90deg,#8a5a2a,#d9a466 40%,#a26c34)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    <Tag tt={tt} at={it(h, 1) + 1.2} x={1480} y={620} txt="1-INCH HOLE" col={AMB} size={66} anchor="l" />
    <Tag tt={tt} at={1.2} x={90} y={980} txt="TO THE BOTTOM" col={TX} size={52} anchor="l" />
  </>;
}}</Stage>;

// ---- 6:23 · EL MEDIDOR DE NAFTA: aguja de tanque de auto que dice MEDIO lleno mientras al lado la llamita se ahoga en humo ----
export const HFuelgauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const choke = eio(tt, 0.4, 3), needle = -60 + 60 * eio(tt, it(h, 0) - 0.6, it(h, 0) + 0.6);
  return <>
    <div style={{ position: "absolute", left: 520, top: 540, transform: "translate(-50%,-50%)", width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle at 45% 35%,#26282c,#0b0b0d)", boxShadow: "0 50px 100px rgba(0,0,0,.7), inset 0 0 0 14px #44474d" }}>
      <svg width={640} height={640} style={{ position: "absolute" }}>
        <path d="M 140 420 A 220 220 0 0 1 500 420" stroke="#3b3d42" strokeWidth={40} fill="none" />
        <path d="M 140 420 A 220 220 0 0 1 200 245" stroke={RED} strokeWidth={40} fill="none" />
      </svg>
      <div style={{ position: "absolute", left: 120, top: 440, fontWeight: 900, fontSize: 70, color: RED }}>E</div>
      <div style={{ position: "absolute", right: 120, top: 440, fontWeight: 900, fontSize: 70, color: TX }}>F</div>
      <div style={{ position: "absolute", left: 316, top: 120, width: 10, height: 210, background: AMB, transformOrigin: "5px 210px", transform: `rotate(${needle}deg)`, boxShadow: "0 0 18px rgba(255,178,87,.8)" }} />
      <div style={{ position: "absolute", left: 296, top: 306, width: 50, height: 50, borderRadius: "50%", background: "#888" }} />
    </div>
    <Can x={1380} y={900} w={380} hh={460} />
    <Flame x={1380} y={430} w={150} hgt={200 * (1 - 0.7 * choke)} blue={0} tt={tt} />
    {Array.from({ length: 8 }, (_, k) => <div key={k} style={{ position: "absolute", left: 1300 + (k % 3) * 40, top: 360 - ((tt * 80 + k * 50) % 320), width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(40,40,40,.8), transparent 70%)", opacity: choke, filter: "blur(10px)" }} />)}
    <Tag tt={tt} at={it(h, 0) + 0.6} x={520} y={950} txt="HALF FULL" col={AMB} size={70} />
    <Tag tt={tt} at={1.8} x={1380} y={980} txt="IT CHOKED" col={RED} size={56} />
  </>;
}}</Stage>;

// ---- 6:53 · LA LATITA DE TOMATE: una lata de puré cae; salen volando sus dos tapas, un punzón le hace agujeros al costado y entra de punta en el pozo del medio ----
export const HTomatocan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const drop = phys(tt, 0.4, 6, 0.45), lids = eio(tt, it(h, 0), it(h, 0) + 0.9), nh = Math.floor(cl((tt - it(h, 1)) / 1.4) * 5), ins = eio(tt, it(h, 2), it(h, 2) + 1.4);
  return <>
    {/* la lata grande en corte, abajo, con su pozo */}
    <div style={{ position: "absolute", left: 960 - 420, top: 700, width: 840, height: 380, borderRadius: "12px 12px 0 0", background: tin, opacity: ins > 0.01 ? 1 : 0.5 }}>
      <div style={{ position: "absolute", left: 22, right: 22, top: 70, bottom: 0, background: "repeating-linear-gradient(180deg,#5a3a1a 0 6px,#4a2f15 6px 8px)" }}>
        <div style={{ position: "absolute", left: 400 - 22 - 50, top: 0, width: 100, height: "100%", background: "#0d0b09" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 960 - 110, top: 140 + (1 - drop) * -600 + 470 * ins, width: 220, height: 300, opacity: cl(drop * 3) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "linear-gradient(90deg,#b8261c,#e8473a 30%,#b8261c 70%,#7a140e)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 90, height: 100, background: "#f5ecd6", opacity: 1 - ins }}><div style={{ fontFamily: MARK, fontSize: 36, color: "#b8261c", textAlign: "center", marginTop: 24 }}>TOMATO</div></div>
        {Array.from({ length: nh }, (_, k) => <div key={k} style={{ position: "absolute", left: 40 + (k % 3) * 60, top: 30 + Math.floor(k / 3) * 220, width: 30, height: 30, borderRadius: "50%", background: "#0a0a0a" }} />)}
      </div>
      {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: 10 + 300 * lids * s, top: s < 0 ? -14 - 200 * lids : 286 + 200 * lids, width: 200, height: 26, borderRadius: "50%", background: "linear-gradient(180deg,#e2e5e9,#8d9399)", transform: `rotate(${lids * 220 * s}deg)`, opacity: 1 - cl((lids - 0.7) * 3) }} />)}
    </div>
    {/* el tiro: humo y aire caliente suben por adentro de la latita */}
    {Array.from({ length: 6 }, (_, k) => <div key={k} style={{ position: "absolute", left: 920 + (k % 2) * 30, top: 600 - ((tt * 110 + k * 70) % 420), width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,200,200,.55), transparent 70%)", opacity: cl((tt - it(h, 2) - 1) * 2), filter: "blur(8px)" }} />)}
    <svg width={90} height={200} style={{ position: "absolute", left: 915, top: 300, opacity: cl((tt - it(h, 2) - 1) * 2) }}><path d="M 45 190 L 45 30" stroke={ICE} strokeWidth={16} strokeLinecap="round" /><path d="M 10 60 L 45 15 L 80 60" stroke={ICE} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
    <Tag tt={tt} at={it(h, 0) + 0.3} x={1110} y={260 + 470 * ins} txt="BOTH ENDS OFF" col={AMB} size={52} anchor="l" />
    <Tag tt={tt} at={it(h, 2) + 1} x={1110} y={420} txt="STEADY DRAFT" col={ICE} size={56} anchor="l" />
  </>;
}}</Stage>;

// ---- 7:41 · EL TIMER DE COCINA: un timer de huevo a cuerda marca 30 minutos y gira; al lado la mancha de aceite baja por la columna de aserrín al ritmo del tic ----
export const HKitchentimer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const run = eio(tt, 1, h.out - h.at - 1.2), soak = run;
  return <>
    <div style={{ position: "absolute", left: 560, top: 540, transform: "translate(-50%,-50%)", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,#ffffff,#d8d8d2 60%,#a9a9a2)", boxShadow: "0 50px 100px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: "conic-gradient(from 0deg, #ff6a3d 0deg, #ff6a3d " + 180 * (1 - run) + "deg, #f2f0ea " + 180 * (1 - run) + "deg)", transform: `rotate(${-180 * run}deg)` }}>
        {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: 216, top: 6, width: 8, height: k % 3 ? 20 : 40, background: "#333", transformOrigin: "4px 214px", transform: `rotate(${k * 30}deg)` }} />)}
      </div>
      <div style={{ position: "absolute", left: 230, top: 30, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: "50px solid #222" }} />
      <div style={{ position: "absolute", left: 160, top: 210, width: 200, height: 100, fontWeight: 900, fontSize: 90, textAlign: "center", color: "#222" }}>{Math.round(30 * (1 - run))}</div>
    </div>
    <div style={{ position: "absolute", left: 1220, top: 200, width: 360, height: 700, borderRadius: 14, background: "#151311", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 10px #8e939a", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 10, right: 10, top: 120, bottom: 10, background: "repeating-linear-gradient(180deg,#b5864c 0 6px,#a07440 6px 8px)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${12 + 88 * soak}%`, background: "linear-gradient(180deg, rgba(40,20,6,.9), rgba(70,40,12,.6) 85%, transparent)" }} />
      </div>
      <div style={{ position: "absolute", left: 10, right: 10, top: 106, height: 18, background: `rgba(120,70,20,${0.9 * (1 - soak)})`, borderRadius: 8 }} />
    </div>
    {/* la línea de nivel une el reloj con el frente de la mancha y baja con las agujas */}
    <div style={{ position: "absolute", left: 830, top: 320 + 570 * (0.12 + 0.88 * soak), width: 400, height: 0, borderTop: `6px dashed ${AMB}` }} />
    <div style={{ position: "absolute", left: 1210, top: 312 + 570 * (0.12 + 0.88 * soak), width: 380, height: 16, borderRadius: 8, background: AMB, boxShadow: "0 0 20px rgba(255,178,87,.8)" }} />
    <Tag tt={tt} at={it(h, 0)} x={1400} y={980} txt="IT WICKS DOWN" col={AMB} size={54} />
  </>;
}}</Stage>;

// ---- 8:14 · EL TABLERO DE HERRAMIENTAS: un pegboard de taller; en sus ganchos aparecen de a uno los ladrillos, la alarma de CO y el matafuegos; abajo el bidón con un sello NEVER HOT ----
export const HPegboard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="linear-gradient(180deg,#9c7b56,#7d5f40)">{(tt) => {
  const s = [phys(tt, 0.6, 7, 0.4), phys(tt, it(h, 0), 7, 0.4), phys(tt, it(h, 1), 7, 0.4)], st = phys(tt, it(h, 2), 9, 0.35);
  return <>
    <AbsoluteHoles />
    <div style={{ position: "absolute", left: 360, top: 360 - (1 - s[0]) * 300, opacity: cl(s[0] * 3) }}>
      {[0, 1].map((k) => <div key={k} style={{ width: 320, height: 110, marginTop: 14, borderRadius: 6, background: "linear-gradient(180deg,#b5523a,#7a3424)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />)}
    </div>
    <div style={{ position: "absolute", left: 860, top: 330 - (1 - s[1]) * 300, opacity: cl(s[1] * 3), width: 220, height: 220, borderRadius: 30, background: "linear-gradient(160deg,#fbfbf7,#d9d9d2)", boxShadow: "0 30px 50px rgba(0,0,0,.45)" }}>
      <div style={{ margin: "40px auto 0", width: 120, height: 60, borderRadius: 8, background: "#1a2a1a", color: GRN, fontWeight: 900, fontSize: 44, textAlign: "center" }}>CO</div>
      <div style={{ margin: "20px auto 0", width: 20, height: 20, borderRadius: "50%", background: GRN, boxShadow: `0 0 ${20 + 10 * Math.sin(tt * 3)}px ${GRN}` }} />
    </div>
    <div style={{ position: "absolute", left: 1320, top: 260 - (1 - s[2]) * 300, opacity: cl(s[2] * 3), width: 200, height: 520, borderRadius: "90px 90px 26px 26px", background: "linear-gradient(90deg,#8a1410,#e0322a 35%,#a01a14)", boxShadow: "0 40px 60px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 50, top: -60, width: 100, height: 70, borderRadius: 10, background: "#222" }} />
      <div style={{ position: "absolute", left: 30, top: 180, width: 140, height: 160, borderRadius: 8, background: "#f4efe6" }} />
    </div>
    {/* el sello de goma */}
    <div style={{ position: "absolute", left: 960, top: 860, transform: `translate(-50%,-50%) scale(${2.2 - 1.2 * cl(st)}) rotate(-6deg)`, opacity: cl(st * 3), border: `10px solid ${RED}`, borderRadius: 16, padding: "10px 40px", fontFamily: MARK, fontSize: 80, color: RED, background: "rgba(255,255,255,.08)" }}>NEVER REFILL HOT</div>
  </>;
}}</Stage>;
const AbsoluteHoles: React.FC = () => <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(40,25,10,.75) 0 7px, transparent 8px)", backgroundSize: "56px 56px" }} />;
void HAND; void oak;
