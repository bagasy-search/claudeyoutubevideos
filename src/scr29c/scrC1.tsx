// scr29c · componentes únicos 1-13 (uno por minuto, ninguno repetido con scr29a ni scr29b). Escenario hkit: entrada con máscara, cámara curva, salida fundida.
import React from "react";
import { AMB, DIM, H, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const it = (h: H, i: number, d = 99) => (h.items?.[i]?.at as number | undefined) ?? d;
const BLU = "#5aa8ff", GRN = "#6fe39a", EXT = "linear-gradient(90deg,#7a1410 0%,#d8352a 30%,#ff6a5a 42%,#b8241c 62%,#5a0e0a 100%)";
const steel = "linear-gradient(90deg,#3a3d42 0%,#8a9098 22%,#c9ced4 34%,#6b7077 55%,#2e3135 100%)";
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 31.7) * 43758.5453; return x - Math.floor(x); };

// ---- 0:05 · LA PARED QUE SE ENNEGRECE: una pared blanca de taller; el hollín sube en manchas desde abajo, después el techo, y una nariz de trapo que queda negra ----
export const HSootwall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const s1 = 0.6 + 0.4 * eio(tt, 0.0, 3.2), s2 = eio(tt, it(h, 0) - 0.2, it(h, 0) + 1.2), rag = phys(tt, it(h, 1), 6, 0.45);
  return <>
    <div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 820, borderRadius: 12, background: "linear-gradient(180deg,#efece4,#d9d4c8)", boxShadow: "0 50px 100px rgba(0,0,0,.6)", overflow: "hidden" }}>
      {Array.from({ length: 22 }, (_, i) => { const x = rnd(i) * 1200, w = 120 + rnd(i + 9) * 220, top = i < 14 ? 820 - 820 * s1 * (0.5 + rnd(i + 3) * 0.6) : 0;
        return <div key={i} style={{ position: "absolute", left: x - w / 2, top: i < 14 ? top : -60, width: w, height: i < 14 ? 900 : 220 * s2, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(20,18,16,.75), rgba(20,18,16,0) 70%)", filter: "blur(10px)", opacity: i < 14 ? s1 : s2 }} />; })}
    </div>
    <div style={{ position: "absolute", left: 1500, top: 760 - (1 - rag) * 300, transform: `translate(-50%,-50%) rotate(${-10 + 6 * rag}deg)`, opacity: cl(rag * 3), width: 280, height: 200, borderRadius: "40% 40% 50% 50%", background: "radial-gradient(ellipse at 50% 55%, #151311 0 60px, #3a3632 80px, #e9e4d8 96px)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}>{[40, 150].map((y) => <div key={y} style={{ position: "absolute", left: -90, right: -90, top: y, height: 8, borderRadius: 4, background: "#d9d4c8", zIndex: -1 }} />)}</div>
    <Tag tt={tt} at={it(h, 1) + 0.4} x={1500} y={1010} txt="YOUR LUNGS" col={RED} size={56} />
    <Tag tt={tt} at={0.8} x={960} y={1000} txt="THE WALLS" col={TX} size={46} />
    <Tag tt={tt} at={it(h, 0)} x={960} y={70} txt="THE CEILING" col={TX} size={46} />
  </>;
}}</Stage>;

// ---- 1:25 · LAS PAREJAS: gotas de vapor suben y cada una busca su pareja de oxígeno; las que no la encuentran se vuelven motas negras ----
export const HPairs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const short = eio(tt, it(h, 0) - 0.5, it(h, 0) + 0.5), dark = eio(tt, it(h, 1) - 0.4, it(h, 1) + 0.6);
  return <>
    <div style={{ position: "absolute", left: 960, top: 900, transform: "translate(-50%,-50%)", width: 520, height: 120, borderRadius: "0 0 90px 90px", background: "linear-gradient(180deg,#3a3532,#151311)", boxShadow: "inset 0 18px 0 #2a1a0a" }} />
    {Array.from({ length: 12 }, (_, i) => { const ph = (tt * 0.22 + i / 12) % 1, x = 720 + (i % 6) * 96 + Math.sin(ph * 6 + i) * 20, y = 840 - ph * 640;
      const paired = i % 2 === 0 || i % 4 === 1 ? 1 - (i % 4 === 1 ? short : 0) : 1 - short, o2 = cl((ph - 0.25) * 4) * paired, black = (1 - paired) * dark * cl((ph - 0.3) * 3);
      const ox = x + 90 * (1 - o2) * (i % 2 ? 1 : -1);
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: "50%", background: black > 0.5 ? "#111" : "radial-gradient(circle at 40% 35%, #ffd27a, #c88a2a)", boxShadow: black > 0.5 ? "none" : `0 0 ${30 * o2}px rgba(90,168,255,.9)`, opacity: 1 - ph * 0.3 }} />
        <div style={{ position: "absolute", left: Math.min(x, ox + 20) + 10, top: y - 14, width: Math.abs(ox + 20 - x) + 20, height: 8, background: BLU, opacity: o2 * 0.8 }} />
        <div style={{ position: "absolute", left: ox + 14, top: y - 52, width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #cfe6ff, #5aa8ff)", opacity: paired * cl(ph * 3), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 24, color: "#0b2a4a" }}>O₂</div>
      </React.Fragment>; })}
    <Tag tt={tt} at={0.6} x={1500} y={300} txt="VAPOR + AIR" col={BLU} size={56} />
    <Tag tt={tt} at={it(h, 1)} x={1500} y={760} txt="SOOT" col={RED} size={70} />
  </>;
}}</Stage>;

// ---- 2:03 · EL TRIÁNGULO DEL FUEGO: tres objetos en los vértices (bidón, fósforo, ventana); el de la ventana se enciende y aparece «FREE» ----
export const HTriangle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const draw = eio(tt, 0.3, 1.8), free = phys(tt, it(h, 0), 6, 0.4);
  const V: [number, number][] = [[960, 200], [560, 860], [1360, 860]];
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute" }}><path d={`M ${V[0]} L ${V[1]} L ${V[2]} Z`} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={10} pathLength={1} strokeDasharray={`${draw} 1`} strokeLinejoin="round" /></svg>
    <div style={{ position: "absolute", left: V[0][0], top: V[0][1], transform: "translate(-50%,-50%)", width: 150, height: 190, borderRadius: "30px 30px 20px 20px", background: "linear-gradient(90deg,#e8e2d0,#fffaf0 40%,#cfc8b4)", boxShadow: "inset 0 -90px 0 #b07a20" }} />
    <div style={{ position: "absolute", left: V[1][0], top: V[1][1], transform: "translate(-50%,-50%)" }}>
      <div style={{ width: 16, height: 180, background: "#d9b07a", borderRadius: 4, margin: "0 auto" }} />
      <div style={{ position: "absolute", left: -32, top: -90, width: 80, height: 110, borderRadius: "50% 50% 42% 42%", background: "radial-gradient(ellipse at 50% 85%, #fff2c0, #ff8a2a 45%, rgba(0,0,0,0) 74%)", transform: `scaleY(${0.95 + 0.05 * Math.sin(tt * 2 * Math.PI * 1.4)})` }} />
    </div>
    <div style={{ position: "absolute", left: V[2][0], top: V[2][1], transform: `translate(-50%,-50%) scale(${1 + 0.15 * cl(free)})`, width: 240, height: 200, borderRadius: 10, border: "12px solid #8a6a44", background: `linear-gradient(180deg, rgba(180,220,255,${0.3 + 0.5 * cl(free)}), rgba(220,240,255,${0.2 + 0.4 * cl(free)}))`, boxShadow: `0 0 ${120 * cl(free)}px rgba(150,210,255,.7)` }}>
      <div style={{ position: "absolute", left: 102, top: 0, width: 12, height: 176, background: "#8a6a44" }} /><div style={{ position: "absolute", left: 0, top: 82, width: 216, height: 12, background: "#8a6a44" }} />
    </div>
    <Tag tt={tt} at={0.6} x={960} y={330} txt="FUEL" col={AMB} size={44} />
    <Tag tt={tt} at={0.9} x={560} y={990} txt="HEAT" col={RED} size={44} />
    <Tag tt={tt} at={1.2} x={1360} y={990} txt="AIR" col={ICE} size={44} />
    <Tag tt={tt} at={it(h, 0)} x={1360} y={680} txt="FREE" col={GRN} size={90} />
  </>;
}}</Stage>;

// ---- 2:20 · LA TARJETA VENCIDA: la etiqueta de inspección del matafuegos cuelga, un punzón le perfora la fecha y el matafuegos cae a la pila de chatarra ----
export const HTagexpire: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const punch = phys(tt, 2.0, 8, 0.4), fall = eio(tt, it(h, 0) - 0.3, it(h, 0) + 1.0), sw = Math.sin(tt * 1.6) * 6 * (1 - fall);
  return <>
    <div style={{ position: "absolute", left: 700, top: 520 + fall * 260, transform: `translate(-50%,-50%) rotate(${fall * 70}deg)`, width: 260, height: 640, borderRadius: "110px 110px 40px 40px", background: EXT, boxShadow: "0 50px 90px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 80, top: -70, width: 100, height: 80, borderRadius: 10, background: steel }} />
    </div>
    <div style={{ position: "absolute", left: 1220, top: 260, transform: `rotate(${sw}deg)`, transformOrigin: "50% -40px", opacity: 1 - fall }}>
      <div style={{ width: 300, height: 400, borderRadius: 16, background: "#f5d33a", boxShadow: "0 30px 50px rgba(0,0,0,.5)", position: "relative", fontWeight: 900, color: "#1c1608" }}>
        <div style={{ position: "absolute", left: 120, top: 20, width: 50, height: 50, borderRadius: "50%", background: "#111" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center", fontSize: 40, letterSpacing: 4 }}>INSPECTED</div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 170, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {["JAN", "APR", "JUL", "OCT"].map((m, i) => <div key={m} style={{ fontSize: 30, textAlign: "center", position: "relative" }}>{m}{i === 2 && punch > 0.05 && <div style={{ position: "absolute", left: "50%", top: "50%", width: 46, height: 46, transform: `translate(-50%,-50%) scale(${cl(punch)})`, borderRadius: "50%", background: "#111" }} />}</div>)}
        </div>
      </div>
    </div>
    <Tag tt={tt} at={2.4} x={1370} y={760} txt="EXPIRED" col={RED} size={72} />
    <Tag tt={tt} at={it(h, 0) + 0.4} x={700} y={960} txt="FREE STEEL" col={AMB} size={56} />
  </>;
}}</Stage>;

// ---- 3:13 · EL AGUA QUE SE ACLARA: un vaso bajo la manguera: el agua sale blanca de polvo y se va aclarando hasta transparente ----
export const HClearwater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const clr = eio(tt, 0.8, 5.5);
  return <>
    <div style={{ position: "absolute", left: 960, top: 120, width: 70, height: 230, background: "linear-gradient(90deg,#2f6b2f,#4f9a4f,#2f6b2f)", borderRadius: 12, transform: "translate(-50%,0)" }} />
    <div style={{ position: "absolute", left: 960, top: 350, width: 40, height: 260, transform: "translate(-50%,0)", background: `linear-gradient(180deg, rgba(240,240,235,${0.85 - 0.75 * clr}), rgba(200,225,255,${0.25 + 0.2 * clr}))`, filter: "blur(2px)" }} />
    <div style={{ position: "absolute", left: 960, top: 690, transform: "translate(-50%,-50%)", width: 380, height: 420, borderRadius: "10px 10px 60px 60px", border: "8px solid rgba(255,255,255,.45)", background: "rgba(255,255,255,.04)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 330, background: `rgba(${235 - 70 * clr},${235 - 30 * clr},${230 + 25 * clr},${0.92 - 0.72 * clr})` }} />
      {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 0.5 + i / 10) % 1; return <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 280, top: 400 - ph * 300, width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,.6)", opacity: 1 - ph }} />; })}
    </div>
    <Tag tt={tt} at={1.0} x={560} y={540} txt="SALT POWDER" col={TX} size={46} />
    <Tag tt={tt} at={5.0} x={1380} y={540} txt="CLEAR" col={ICE} size={76} />
  </>;
}}</Stage>;

// ---- 3:58 · EL CARTEL DE NEÓN: un tubo de neón de taller se enciende letra por letra (parpadeo lento) y la campana se ilumina ----
export const HNeon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const w = "SUBSCRIBE", n = Math.floor(cl((tt - 0.6) / 1.8) * w.length), bell = cl((tt - 2.6) * 2);
  return <>
    <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", width: 1300, height: 360, borderRadius: 30, background: "linear-gradient(180deg,#1b1c20,#0c0c0e)", boxShadow: "0 60px 110px rgba(0,0,0,.8), inset 0 0 0 6px #2b2c31" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: MARK, fontSize: 150, letterSpacing: 10 }}>
        {w.split("").map((c, i) => { const on = i < n ? (i === n - 1 ? 0.6 + 0.4 * Math.round(0.5 + 0.5 * Math.sin(tt * 2 * Math.PI * 1.8)) : 1) : 0.08;
          return <span key={i} style={{ color: on > 0.1 ? "#ffe7e2" : "#3a2020", textShadow: on > 0.1 ? `0 0 12px ${RED}, 0 0 40px ${RED}, 0 0 80px ${RED}` : "none", opacity: on }}>{c}</span>; })}
      </div>
    </div>
    {/* el cable del cartel enchufado a la batería del taller, sin campanita (la del botón de bronce es de scr29b) */}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M 1610 600 C 1700 760, 1560 900, ${1700 + 0 * bell} 960`} stroke="#1b1b1b" strokeWidth={14} fill="none" /></svg>
    <div style={{ position: "absolute", left: 1660, top: 940, width: 140, height: 90, borderRadius: 10, background: "linear-gradient(180deg,#2b2d31,#141518)", boxShadow: `0 0 ${30 * bell}px ${RED}` }} />
  </>;
}}</Stage>;

// ---- 4:26 · LAS DOS CORRIENTES: corte del matafuegos; una corriente chica entra abajo (primaria) y otra grande sube por el tubo y sale arriba al vapor (secundaria) ----
export const HStreams: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const p = cl(tt / 1.2), much = eio(tt, it(h, 0) - 0.3, it(h, 0) + 0.6) * (1 - eio(tt, it(h, 0) + 2.4, it(h, 0) + 3.2)), s = eio(tt, it(h, 1) - 0.3, it(h, 1) + 0.8);
  const Arrow = ({ x, y, len, ang, col, w, o }: { x: number; y: number; len: number; ang: number; col: string; w: number; o: number }) => <div style={{ position: "absolute", left: x, top: y, width: len, height: w, background: `linear-gradient(90deg, rgba(0,0,0,0), ${col})`, transformOrigin: "0 50%", transform: `rotate(${ang}deg)`, opacity: o, borderRadius: w }} />;
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", width: 520, height: 860, borderRadius: "220px 220px 50px 50px", border: "14px solid #b8241c", background: "rgba(40,10,8,.55)" }}>
      <div style={{ position: "absolute", left: 160, top: 640, width: 200, height: 90, borderRadius: "0 0 60px 60px", background: "#222", boxShadow: "inset 0 14px 0 #3a2210" }} />
      <div style={{ position: "absolute", left: 230, top: 80, width: 60, height: 600, borderRadius: 10, background: steel, opacity: 0.85 }} />
      <div style={{ position: "absolute", left: 160, top: 300 - 80 * s, width: 200, height: 320, borderRadius: "50% 50% 42% 42%", background: `radial-gradient(ellipse at 50% 88%, #fff, rgb(${255 - 190 * s},${150},${40 + 215 * s}) 45%, rgba(0,0,0,0) 74%)`, opacity: 0.85 * (1 - 0.6 * much), transform: `scaleY(${0.95 + 0.05 * Math.sin(tt * 2 * Math.PI * 1.4)})` }} />
    </div>
    {[0, 1, 2].map((i) => <Arrow key={i} x={540 - (i * 60) % 120} y={830 + i * 18} len={200 + 140 * much} ang={-6} col={AMB} w={10 + 14 * much} o={p} />)}
    {[0, 1, 2, 3].map((i) => <Arrow key={i} x={1000} y={120 + i * 40} len={260} ang={180 - i * 6} col={BLU} w={16} o={s} />)}
    <Tag tt={tt} at={0.8} x={420} y={760} txt="PRIMARY" col={AMB} size={48} />
    <Tag tt={tt} at={it(h, 0)} x={420} y={1010} txt="TOO MUCH = COLD" col={RED} size={52} />
    <Tag tt={tt} at={it(h, 1)} x={1480} y={160} txt="SECONDARY" col={BLU} size={56} />
  </>;
}}</Stage>;

// ---- 5:36 · LAS TRES MONEDAS: tres brocas como monedas de tamaño real caen en sus filas del caño, chica, mediana y grande ----
export const HCoins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const rows: [number, number, string, string][] = [[0.4, 54, "3/16", "6"], [it(h, 0), 76, "1/4", "8"], [it(h, 0) + 2.6, 98, "5/16", "10"]];
  return <>
    <div style={{ position: "absolute", left: 760, top: 540, transform: "translate(-50%,-50%)", width: 280, height: 860, borderRadius: 30, background: steel, boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
      {rows.map(([a, d], r) => { const n = Math.floor(cl((tt - a) / 0.9) * 5); return Array.from({ length: n }, (_, k) => <div key={r + "-" + k} style={{ position: "absolute", left: 20 + k * 52 - d / 4, top: 700 - r * 300 - d / 2, width: d * 0.8, height: d * 0.8, borderRadius: "50%", background: "#0b0b0c", boxShadow: "inset 0 4px 8px rgba(255,255,255,.12)" }} />); })}
    </div>
    {rows.map(([a, d, lab, n], r) => { const s = phys(tt, a, 7, 0.4); return <div key={r} style={{ position: "absolute", left: 1240, top: 820 - r * 300 - (1 - s) * 300, opacity: cl(s * 3), display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ width: d * 2, height: d * 2, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f2e6c8, #b9a06a 60%, #6a5a34)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
      <div><div style={{ fontWeight: 900, fontSize: 72, color: TX }}>{lab}"</div><div style={{ fontWeight: 900, fontSize: 64, color: AMB, letterSpacing: 2 }}>× {n}</div></div>
    </div>; })}
  </>;
}}</Stage>;

// ---- 6:07 · LA ESCALERA DEL VAPOR: el vapor sube por el tubo de a burbujas; abajo apenas un hilo de aire, arriba cada vez más, y la burbuja pasa de naranja a azul ----
export const HClimb: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const blast = cl(1 - Math.abs(tt - 2.5) / 1.5) * (tt < it(h, 0) ? 1 : 0), more = eio(tt, it(h, 1) - 0.4, it(h, 1) + 1);
  return <>
    <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", width: 200, height: 880, borderRadius: 20, background: "rgba(200,210,220,.12)", border: "8px solid rgba(220,230,240,.4)" }} />
    {[0, 1, 2].map((r) => { const y = 880 - r * 300, w = 30 + r * 45 * (0.5 + 0.5 * more), o = r === 0 ? 0.5 + blast * 0.5 : cl((tt - it(h, 0)) / 1) * (0.4 + 0.6 * more);
      return <React.Fragment key={r}>{[-1, 1].map((sd) => <div key={sd} style={{ position: "absolute", left: 960 + sd * 110 + (sd < 0 ? -w * 3 : 0), top: y, width: w * 3, height: 12 + r * 6, borderRadius: 9, background: `linear-gradient(${sd < 0 ? 90 : 270}deg, rgba(90,168,255,0), ${BLU})`, opacity: o }} />)}</React.Fragment>; })}
    {Array.from({ length: 8 }, (_, i) => { const ph = (tt * 0.25 + i / 8) % 1, b = cl((ph - 0.2) * 1.4) * (0.3 + 0.7 * more), dead = blast * cl(1 - ph * 5);
      return <div key={i} style={{ position: "absolute", left: 960 - 40, top: 920 - ph * 780, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${b > 0.6 ? "#dff0ff" : "#fff2c0"}, rgb(${255 - 190 * b},${140 + 30 * b},${40 + 215 * b}) 50%, rgba(0,0,0,0) 72%)`, opacity: (1 - dead) * (1 - ph * 0.2) }} />; })}
    <div style={{ opacity: 1 - eio(tt, it(h, 0) - 0.3, it(h, 0)) }}><Tag tt={tt} at={1.5} x={1400} y={880} txt="A LITTLE AIR" col={AMB} size={50} /></div>
    <div style={{ opacity: 1 - eio(tt, it(h, 1) - 0.3, it(h, 1)) }}><Tag tt={tt} at={it(h, 0)} x={1400} y={580} txt="MORE AIR" col={TX} size={50} /></div>
    <Tag tt={tt} at={it(h, 1)} x={1400} y={280} txt="MOST AIR" col={BLU} size={60} />
  </>;
}}</Stage>;

// ---- 7:11 · EL TIRAJE: la chimenea chupa como un sorbete; el humo caliente sube y el aire frío de la sala entra por la boca del tubo, sin un solo cable ----
export const HDraft: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pull = eio(tt, 0.4, 2.0), cold = eio(tt, it(h, 0) - 0.4, it(h, 0) + 0.6);
  return <>
    <div style={{ position: "absolute", left: 780, top: 640, transform: "translate(-50%,-50%)", width: 340, height: 580, borderRadius: "140px 140px 40px 40px", background: EXT, boxShadow: "0 60px 110px rgba(0,0,0,.7)" }} />
    <div style={{ position: "absolute", left: 820, top: 40, width: 90, height: 360, background: steel, borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 700, top: 300, width: 40, height: 80, background: steel, borderRadius: 6 }} />
    {Array.from({ length: 7 }, (_, i) => { const ph = (tt * 0.6 * pull + i / 7) % 1; return <div key={i} style={{ position: "absolute", left: 820 + Math.sin(ph * 4 + i) * 10, top: 380 - ph * 420, width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,150,80,.55), rgba(255,150,80,0) 70%)", opacity: pull * (1 - ph) }} />; })}
    {Array.from({ length: 9 }, (_, i) => { const ph = (tt * 0.45 + i / 9) % 1, x = 1500 - ph * 780, y = 300 + Math.sin(ph * 3 + i) * 20 + (i % 3) * 30;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 90, height: 10, borderRadius: 5, background: `linear-gradient(270deg, rgba(90,168,255,0), ${BLU})`, opacity: cold * Math.sin(ph * Math.PI) }} />; })}
    <Tag tt={tt} at={0.8} x={1330} y={130} txt="HOT RUSHES UP" col={AMB} size={50} />
    <Tag tt={tt} at={it(h, 0)} x={1500} y={460} txt="ROOM AIR IN" col={BLU} size={50} />
    <Tag tt={tt} at={it(h, 0) + 1.6} x={1500} y={880} txt="NO BATTERY" col={GRN} size={58} />
  </>;
}}</Stage>;

// ---- 7:45 · EL DIAFRAGMA: la tapita del tubo vista de arriba, con láminas que se cierran y abren como un obturador de cámara; detrás la llama responde ----
export const HAperture: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const o = tt < it(h, 0) ? 0.5 : tt < it(h, 1) ? 0.5 - 0.45 * eio(tt, it(h, 0), it(h, 0) + 0.8) : 0.05 + 0.95 * eio(tt, it(h, 1), it(h, 1) + 1.0);
  return <>
    <div style={{ position: "absolute", left: 760, top: 540, transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: steel, boxShadow: "0 60px 110px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 60, top: 60, width: 480, height: 480, borderRadius: "50%", background: "#0b0b0c", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle, rgba(150,200,255,${0.25 + 0.5 * o}), rgba(0,0,0,0) 60%)` }} />
        {Array.from({ length: 8 }, (_, k) => <div key={k} style={{ position: "absolute", left: 240, top: 240, width: 300, height: 200, background: "linear-gradient(135deg,#55595f,#2a2c30)", border: "2px solid #1a1a1a", transformOrigin: "0 0", transform: `rotate(${k * 45}deg) translate(${40 + 200 * o}px, -20px) rotate(${-30 + 40 * o}deg)` }} />)}
      </div>
    </div>
    <div style={{ position: "absolute", left: 1400, top: 740, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -140, top: -360 + 40 * (1 - o), width: 280, height: 360, borderRadius: "50% 50% 42% 42%", background: `radial-gradient(ellipse at 50% 88%, #fff, rgb(${255 - 190 * o},${140 + 30 * o},${40 + 215 * o}) 45%, rgba(0,0,0,0) 74%)`, transform: `scaleY(${0.95 + 0.05 * Math.sin(tt * 2 * Math.PI * 1.5)})`, transformOrigin: "50% 100%" }} />
    </div>
    <Tag tt={tt} at={it(h, 0)} x={1400} y={860} txt="CLOSED = SMOKY" col={AMB} size={44} />
    <Tag tt={tt} at={it(h, 1)} x={1400} y={940} txt="OPEN = BLUE" col={BLU} size={50} />
    <Tag tt={tt} at={0.8} x={760} y={150} txt="THE SHUTTER" col={TX} size={52} />
  </>;
}}</Stage>;

// ---- 9:23 · LA PISTOLA INFRARROJA: la pistola apunta, el punto rojo se apoya junto a la chimenea y la pantalla cuenta hasta 550 ----
export const HIrgun: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const aim = phys(tt, 0.6, 5, 0.6), v = Math.round(550 * eio(tt, it(h, 0) - 1.6, it(h, 0) + 0.2));
  return <>
    <div style={{ position: "absolute", left: 1320, top: 420, width: 300, height: 600, borderRadius: "160px 160px 40px 40px", background: EXT, boxShadow: "0 60px 110px rgba(0,0,0,.7)" }} />
    <div style={{ position: "absolute", left: 1410, top: 300, width: 80, height: 140, background: steel, borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 1400, top: 470, width: 30, height: 30, borderRadius: "50%", background: RED, boxShadow: `0 0 30px ${RED}`, opacity: cl(aim) }} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}><line x1={760} y1={520} x2={760 + 655 * cl(aim)} y2={520 - 35 * cl(aim)} stroke={RED} strokeWidth={3} opacity={0.6} /></svg>
    <div style={{ position: "absolute", left: 480, top: 540, transform: `translate(-50%,-50%) rotate(${-4 + 4 * cl(aim)}deg) translateX(${(1 - aim) * -300}px)` }}>
      <div style={{ width: 520, height: 230, borderRadius: "40px 120px 40px 40px", background: "linear-gradient(180deg,#f2c94c,#c99a1e)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", position: "relative" }}>
        <div style={{ position: "absolute", left: 40, top: 40, width: 280, height: 150, borderRadius: 14, background: "#0f1a14", fontFamily: "monospace", fontWeight: 900, fontSize: 96, color: "#7dffb0", textAlign: "center", lineHeight: "150px", textShadow: "0 0 18px rgba(125,255,176,.6)" }}>{v}°</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 220, width: 140, height: 260, borderRadius: "0 0 40px 40px", background: "linear-gradient(180deg,#c99a1e,#8a6a12)", transform: "rotate(10deg)" }} />
    </div>
    <Tag tt={tt} at={it(h, 0)} x={480} y={900} txt="SHUTTER CLOSED" col={AMB} size={46} />
  </>;
}}</Stage>;

// ---- 9:56 · EL DOBLE: dos lingotes de hierro al rojo: 550 y 1100; el segundo crece hasta el doble de alto y brilla más ----
export const HTwice: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = phys(tt, 0.5, 6, 0.5), b = eio(tt, it(h, 0) - 1.2, it(h, 0) + 0.4), x2 = phys(tt, it(h, 1), 6, 0.4);
  const Bar = ({ x, hgt, k, v }: { x: number; hgt: number; k: number; v: string }) => <div style={{ position: "absolute", left: x, top: 900 - hgt, width: 300, height: hgt, borderRadius: "16px 16px 4px 4px", background: `linear-gradient(180deg, rgb(255,${200 - 120 * (1 - k)},${120 - 100 * (1 - k)}), rgb(${180 + 60 * k},${40 + 30 * k},20))`, boxShadow: `0 0 ${60 + 120 * k}px rgba(255,${90 + 80 * k},30,${0.5 + 0.3 * k})` }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: -110, textAlign: "center", fontWeight: 900, fontSize: 90, color: TX }}>{v}</div></div>;
  return <>
    <Bar x={540} hgt={330 * cl(a)} k={0.3} v="550°" />
    <Bar x={1080} hgt={330 * cl(a) + 330 * b} k={0.3 + 0.7 * b} v={`${Math.round(550 + 550 * b)}°`} />
    <div style={{ position: "absolute", left: 340, top: 900, width: 1240, height: 8, background: "rgba(255,255,255,.25)" }} />
    <Tag tt={tt} at={0.8} x={690} y={960} txt="CLOSED" col={DIM} size={44} />
    <Tag tt={tt} at={1.2} x={1230} y={960} txt="OPEN" col={BLU} size={44} />
    <div style={{ position: "absolute", left: 640, top: 280, transform: `translate(-50%,-50%) scale(${1.6 - 0.6 * cl(x2)}) rotate(-6deg)`, opacity: cl(x2 * 2), border: `8px solid ${AMB}`, borderRadius: 14, padding: "6px 30px", fontFamily: MARK, fontSize: 90, color: AMB }}>2X HOTTER</div>
  </>;
}}</Stage>;

// ---- 10:47 · LA PERILLA DEL AIRE: una perilla de taller gigante gira a mano; a la derecha la llama copia cada vuelta: naranja perezosa, amarilla, azul ----
export const HSpectrum: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const u = 0.15 + 0.35 * eio(tt, 0.4, 2.0) + 0.42 * eio(tt, it(h, 0) - 0.4, it(h, 0) + 0.8), ok = phys(tt, it(h, 1), 6, 0.4);
  const col = `rgb(${255 - 190 * u},${120 + 50 * u},${30 + 225 * u})`, ang = -130 + 260 * u;
  return <>
    <div style={{ position: "absolute", left: 600, top: 520, transform: "translate(-50%,-50%)", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#3a3d42,#121315)", boxShadow: "0 0 0 26px #2b2d31, 0 60px 110px rgba(0,0,0,.75)" }}>
      {Array.from({ length: 11 }, (_, k) => <div key={k} style={{ position: "absolute", left: 274, top: -70, width: 12, height: 40, borderRadius: 6, background: k < 4 ? "#ff8a3a" : k < 7 ? "#ffd24a" : BLU, transformOrigin: "6px 350px", transform: `rotate(${-130 + k * 26}deg)` }} />)}
      <div style={{ position: "absolute", left: 80, top: 80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,#6b7077,#2b2d31)", transform: `rotate(${ang}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>
        <div style={{ position: "absolute", left: 186, top: 20, width: 28, height: 150, borderRadius: 14, background: col, boxShadow: `0 0 30px ${col}` }} />
        {Array.from({ length: 24 }, (_, k) => <div key={k} style={{ position: "absolute", left: 194, top: -6, width: 12, height: 22, background: "#1b1c1f", transformOrigin: "6px 206px", transform: `rotate(${k * 15}deg)` }} />)}
      </div>
    </div>
    <div style={{ position: "absolute", left: 1380, top: 880, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -60, top: -10, width: 120, height: 40, borderRadius: 8, background: "linear-gradient(90deg,#3a3d42,#8a9098,#2e3135)" }} />
      <div style={{ position: "absolute", left: -170, top: -600, width: 340, height: 600, borderRadius: "50% 50% 42% 42%", background: `radial-gradient(ellipse at 50% 88%, #fff, ${col} 45%, rgba(0,0,0,0) 74%)`, transform: `scaleY(${0.95 + 0.05 * Math.sin(tt * 2 * Math.PI * 1.2)})`, transformOrigin: "50% 100%" }} />
    </div>
    <div style={{ opacity: 1 - eio(tt, it(h, 0) - 0.3, it(h, 0)) }}><Tag tt={tt} at={0.5} x={600} y={990} txt="LAZY ORANGE" col="#ff8a3a" size={60} /></div>
    <div style={{ opacity: 1 - eio(tt, it(h, 1) - 0.3, it(h, 1)) }}><Tag tt={tt} at={it(h, 0)} x={600} y={990} txt="MORE AIR" col="#ffd24a" size={60} /></div>
    <div style={{ position: "absolute", left: 600, top: 1000, transform: `translate(-50%,-50%) scale(${1.5 - 0.5 * cl(ok)})`, opacity: cl(ok * 2), border: `8px solid ${BLU}`, borderRadius: 14, padding: "4px 26px", fontFamily: MARK, fontSize: 80, color: BLU, background: "#0b0b0d" }}>STOP HERE</div>
  </>;
}}</Stage>;
