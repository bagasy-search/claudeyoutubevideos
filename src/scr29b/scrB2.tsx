// scr29b · componentes únicos 11-25 (minutos 10-22). Mismo escenario y lenguaje que scrB1.
import React from "react";
import { AMB, DIM, H, HAND, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const it = (h: H, i: number, d = 99) => (h.items?.[i]?.at as number | undefined) ?? d;
const GRN = "#6fe39a", BLU = "#5aa8ff";
const iron = "linear-gradient(160deg,#5b5652 0%,#35312e 45%,#1f1c1a 100%)";
const steel = "linear-gradient(90deg,#3a3d42 0%,#8a9098 22%,#c9ced4 34%,#6b7077 55%,#2e3135 100%)";

// ---- 10:31 · EL APILADO: el tambor chico baja dado vuelta sobre el grande con peso, como una tapa, y asienta con un rebote ----
export const HStack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const flip = eio(tt, 0.8, 3.0), down = phys(tt, 3.0, 5, 0.35), seat = phys(tt, it(h, 0), 8, 0.4);
  return <>
    <div style={{ position: "absolute", left: 960, top: 820, transform: "translate(-50%,-50%)", width: 820, height: 300, borderRadius: "0 0 60px 60px", background: iron, boxShadow: "0 60px 100px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -30, height: 60, borderRadius: "50%", background: "#141210", boxShadow: "inset 0 10px 60px rgba(255,120,40,.7)" }} />
      {Array.from({ length: 11 }, (_, k) => <div key={k} style={{ position: "absolute", left: 50 + k * 68, top: 60, width: 16, height: 210, borderRadius: 8, background: "linear-gradient(90deg,rgba(255,255,255,.15),rgba(0,0,0,.4))" }} />)}
    </div>
    <div style={{ position: "absolute", left: 960, top: 200 + 380 * cl(down), transform: `translate(-50%,-50%) perspective(1400px) rotateX(${180 * flip}deg) translateY(${-8 * Math.sin(seat * Math.PI)}px)`, width: 620, height: 260, borderRadius: "0 0 50px 50px", background: iron, boxShadow: "0 40px 80px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -24, height: 48, borderRadius: "50%", background: "#2a2624" }} />
      {Array.from({ length: 9 }, (_, k) => <div key={k} style={{ position: "absolute", left: 40 + k * 66, top: 40, width: 14, height: 190, borderRadius: 7, background: "linear-gradient(90deg,rgba(255,255,255,.18),rgba(0,0,0,.35))" }} />)}
      {[0, 1, 2, 3, 4].map((k) => <div key={"b" + k} style={{ position: "absolute", left: 300 + Math.cos(k * 1.2566) * 120 - 16, top: 130 + Math.sin(k * 1.2566) * 40 - 10, width: 32, height: 20, borderRadius: "50%", background: "#0b0b0c" }} />)}
    </div>
    <Tag tt={tt} at={1.0} x={1560} y={260} txt="SMALL DRUM" col={TX} size={50} />
    <Tag tt={tt} at={it(h, 0)} x={1560} y={340} txt="UPSIDE DOWN" col={AMB} size={60} />
  </>;
}}</Stage>;

// ---- 11:17 · EL VIAJE DEL CALOR: planta del tambor de arriba; el chorro caliente cruza hasta el borde y calienta el hierro; con la chimenea al medio se escapa recto ----
export const HPath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const bad = cl((tt - it(h, 0)) / 0.6), good = 1 - bad, run = (tt * 0.45) % 1;
  const Disc = ({ x, mid, k }: { x: number; mid: boolean; k: number }) => <div style={{ position: "absolute", left: x, top: 540, transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: iron, boxShadow: `0 50px 90px rgba(0,0,0,.7), inset 0 0 ${120 * k}px rgba(255,90,30,${0.55 * k})`, opacity: 0.35 + 0.65 * k }}>
    <div style={{ position: "absolute", left: mid ? 250 : 470, top: mid ? 250 : 250, width: 100, height: 100, borderRadius: "50%", background: "#0b0b0c", boxShadow: "0 0 0 8px #555" }} />
    {Array.from({ length: 8 }, (_, i) => { const u = (run + i / 8) % 1, x0 = 300, x1 = mid ? 300 : 520; const x = x0 + (x1 - x0) * u + (mid ? 0 : Math.sin(u * Math.PI) * 0), y = 300 + (mid ? 0 : Math.sin(u * Math.PI * 2 + i) * 90 * (1 - u));
      return <div key={i} style={{ position: "absolute", left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: "50%", background: "radial-gradient(circle,#ffb060,rgba(255,90,30,0) 70%)", opacity: mid ? 1 - u : 1 }} />; })}
  </div>;
  return <>
    <Disc x={560} mid={false} k={good * 0.6 + 0.4} />
    <Disc x={1360} mid k={bad} />
    <Tag tt={tt} at={0.8} x={560} y={110} txt="EDGE" col={GRN} size={70} />
    <Tag tt={tt} at={it(h, 0)} x={1360} y={110} txt="MIDDLE" col={RED} size={70} />
    <Tag tt={tt} at={it(h, 1)} x={1360} y={960} txt="STRAIGHT OUT" col={DIM} size={48} />
    <Tag tt={tt} at={2.0} x={560} y={960} txt="HEATS THE IRON" col={AMB} size={48} />
  </>;
}}</Stage>;

// ---- 11:35 · LA PLANCHA: el hierro de arriba visto en picado; huevo, panceta, cafetera y lata caen de a uno y chisporrotean ----
export const HGriddle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const items: [number, number, number, React.ReactNode][] = [
    [0.3, 700, 470, <div style={{ width: 220, height: 180, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, #ffcc33 0 34px, #fffaf0 36px 100%)", filter: "drop-shadow(0 10px 10px rgba(0,0,0,.4))" }} />],
    [it(h, 0), 1060, 480, <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{[0, 1].map((i) => <div key={i} style={{ width: 300, height: 52, borderRadius: 26, background: "repeating-linear-gradient(90deg,#b6402c 0 40px,#f2d0b0 40px 60px)", transform: `rotate(${i ? 4 : -3}deg)` }} />)}</div>],
    [it(h, 1), 800, 720, <div style={{ width: 200, height: 260, borderRadius: "30px 30px 16px 16px", background: steel, boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />],
    [it(h, 2), 1140, 720, <div style={{ width: 180, height: 220, borderRadius: 16, background: "linear-gradient(90deg,#8a2a1e,#d94a32 40%,#8a2a1e)", boxShadow: "0 20px 30px rgba(0,0,0,.5), inset 0 14px 0 #aaa, inset 0 -14px 0 #aaa" }} />],
  ];
  return <>
    <div style={{ position: "absolute", left: 960, top: 580, transform: "translate(-50%,-50%)", width: 980, height: 820, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, #3b2a22, #1c1715 70%)", boxShadow: "0 0 0 30px #2a2624, 0 0 160px rgba(255,90,30,.35)" }} />
    {items.map(([a0, x, y, el], i) => { const a = items.slice(0, i + 1).reduce((p, n, j) => j === 0 ? n[0] : Math.max(n[0], p + 1.2), 0); const s = phys(tt, a, 7, 0.4); if (s <= 0.01) return null;
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -500}px) scale(${1.15 - 0.15 * s})`, opacity: cl(s * 3) }}>{el}
        {Array.from({ length: 3 }, (_, k) => { const ph = (tt * 0.6 + k / 3 + i * 0.2) % 1; return <div key={k} style={{ position: "absolute", left: 40 + k * 50, top: -40 - ph * 160, width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.4), rgba(255,255,255,0) 70%)", opacity: cl(tt - a) * (1 - ph) }} />; })}
      </div>; })}
    <Tag tt={tt} at={0.6} x={960} y={90} txt="500°F ON TOP" col={AMB} size={60} />
  </>;
}}</Stage>;

// ---- 12:12 · EL RESPLANDOR QUE QUEDA: la válvula se cierra y el hierro tarda en apagarse; el reloj corre una hora y el tambor sigue tibio ----
export const HAfterglow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const m = eio(tt, 0.8, 5.5), glow = 1 - 0.55 * m;
  return <>
    <div style={{ position: "absolute", left: 640, top: 600, transform: "translate(-50%,-50%)", width: 560, height: 520, borderRadius: "40px 40px 60px 60px", background: iron, boxShadow: `0 0 ${200 * glow}px rgba(255,${90 + 60 * m},30,${0.6 * glow})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "40px 40px 60px 60px", background: `radial-gradient(ellipse at 50% 60%, rgba(255,${80 + 70 * m},30,${0.7 * glow}), transparent 65%)` }} />
    </div>
    <div style={{ position: "absolute", left: 1340, top: 520, transform: "translate(-50%,-50%)", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fbf7ee, #d9d1bf)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 14px #2a2a2a" }}>
      <div style={{ position: "absolute", inset: 14, borderRadius: "50%", background: `conic-gradient(rgba(214,58,42,.35) ${360 * m}deg, rgba(0,0,0,0) ${360 * m}deg)` }} />
      {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: 205, top: 24, width: 10, height: 30, background: "#1b1b1b", transformOrigin: "5px 186px", transform: `rotate(${k * 30}deg)` }} />)}
      <div style={{ position: "absolute", left: 203, top: 50, width: 14, height: 160, background: RED, borderRadius: 7, transformOrigin: "7px 160px", transform: `rotate(${360 * m}deg)` }} />
      <div style={{ position: "absolute", left: 195, top: 195, width: 30, height: 30, borderRadius: "50%", background: "#1b1b1b" }} />
    </div>
    <Tag tt={tt} at={4.2} x={1340} y={820} txt="1 HOUR LATER" col={TX} size={56} />
    <Tag tt={tt} at={5.0} x={640} y={940} txt="STILL WARM" col={AMB} size={56} />
  </>;
}}</Stage>;

// ---- 13:00 · LA PUERTA DEL TABLERO: la puerta de madera del tablero viejo del taller; 30 rayitas de navaja aparecen de a cinco (30 años) y adentro un fusible de vidrio entra en su portafusible y el ventilador arranca ----
export const HStamped: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const marks = Math.floor(cl((tt - 0.5) / 2.6) * 30), fuse = phys(tt, it(h, 0), 6, 0.45), run = eio(tt, it(h, 0) + 0.6, it(h, 0) + 1.6);
  return <>
    {/* puerta de madera vieja con vetas */}
    <div style={{ position: "absolute", left: 560, top: 560, transform: "translate(-50%,-50%) perspective(1600px) rotateY(14deg)", width: 620, height: 820, borderRadius: 10, background: "repeating-linear-gradient(90deg,#6b4526 0 18px,#5a3a1f 18px 22px,#7a5230 22px 46px)", boxShadow: "0 60px 110px rgba(0,0,0,.75), inset 0 0 0 16px #3a2614" }}>
      <div style={{ position: "absolute", left: 540, top: 380, width: 34, height: 90, borderRadius: 8, background: "linear-gradient(90deg,#8d9399,#e4e8ec,#6d7379)" }} />
      {Array.from({ length: marks }, (_, k) => { const g = Math.floor(k / 5), j = k % 5, gx = 70 + (g % 2) * 250, gy = 130 + Math.floor(g / 2) * 200;
        return j < 4 ? <div key={k} style={{ position: "absolute", left: gx + j * 36, top: gy, width: 9, height: 120, borderRadius: 4, background: "#f0dcb8", boxShadow: "0 0 0 2px rgba(0,0,0,.25)", transform: `rotate(${(k * 37 % 7) - 3}deg)` }} />
          : <div key={k} style={{ position: "absolute", left: gx - 14, top: gy + 54, width: 160, height: 9, borderRadius: 4, background: "#f0dcb8", transform: "rotate(-24deg)" }} />; })}
    </div>
    {/* adentro: portafusible y el fusible de vidrio que entra */}
    <div style={{ position: "absolute", left: 1260, top: 640, transform: "translate(-50%,-50%)", width: 420, height: 160, borderRadius: 24, background: "linear-gradient(180deg,#2b2d31,#141518)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 50, top: 50 - (1 - cl(fuse)) * 400, width: 320, height: 60, borderRadius: 30, opacity: cl(fuse * 3), background: "linear-gradient(180deg,rgba(230,240,255,.6),rgba(160,180,210,.25))", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.5)" }}>
        {[0, 1].map((e) => <div key={e} style={{ position: "absolute", top: 0, [e ? "right" : "left"]: 0, width: 50, height: 60, borderRadius: 10, background: "linear-gradient(90deg,#8d9399,#e4e8ec,#6d7379)" }} />)}
        <div style={{ position: "absolute", left: 50, right: 50, top: 28, height: 4, background: "#ffb347", boxShadow: `0 0 ${12 * run}px #ffb347` }} />
      </div>
    </div>
    <svg width={240} height={240} viewBox="-120 -120 240 240" style={{ position: "absolute", left: 1500, top: 300 }}><rect x={-120} y={-120} width={240} height={240} rx={26} fill="#1c1d20" /><g transform={`rotate(${600 * run * tt})`}>{[0, 1, 2, 3, 4].map((b) => <path key={b} d="M 0 -14 C 32 -50, 80 -72, 100 -24 C 72 -20, 38 -6, 0 14 Z" fill="#9aa0a6" transform={`rotate(${b * 72})`} />)}</g><circle r={22} fill="#2b2d31" stroke="#9aa0a6" strokeWidth={4} /></svg>
    <Tag tt={tt} at={1.4} x={560} y={1020} txt="30 YEARS" col={AMB} size={70} />
    <Tag tt={tt} at={it(h, 0) + 0.4} x={1260} y={840} txt="ALWAYS A FUSE" col={TX} size={60} />
  </>;
}}</Stage>;

// ---- 14:21 · LA CUERDA DE LEÑA: un cubo de troncos con su etiqueta de precio pesa en un lado; del otro, un bidón de aceite con un cero ----
export const HCord: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const wood = phys(tt, 0.5, 6, 0.4), jug = phys(tt, it(h, 0), 6, 0.4);
  return <>
    <div style={{ position: "absolute", left: 600, top: 560 - (1 - wood) * 500, transform: "translate(-50%,-50%)", width: 560, height: 440, opacity: cl(wood * 3), display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
      {Array.from({ length: 20 }, (_, k) => <div key={k} style={{ borderRadius: "50%", background: "repeating-radial-gradient(circle, #d8a86c 0 5px, #b98450 5px 10px)", boxShadow: "inset 0 0 0 6px #5a3a1f, 0 6px 10px rgba(0,0,0,.4)" }} />)}
    </div>
    <div style={{ position: "absolute", left: 600, top: 870, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 150, color: RED, background: "#f3ead6", padding: "0 40px", borderRadius: 18, boxShadow: "0 20px 40px rgba(0,0,0,.5)", opacity: cl(wood * 2) }}>$$$</div>
    <div style={{ position: "absolute", left: 1340, top: 560 - (1 - jug) * 500, transform: "translate(-50%,-50%)", width: 300, height: 400, borderRadius: "40px 40px 30px 30px", background: "linear-gradient(90deg,#e8e2d0,#fffaf0 40%,#cfc8b4)", opacity: cl(jug * 3), boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 30, height: 220, borderRadius: 20, background: "linear-gradient(180deg,#c88a2a,#7a4a10)" }} />
      <div style={{ position: "absolute", left: 200, top: -50, width: 70, height: 60, borderRadius: 10, background: "#333" }} />
    </div>
    <div style={{ position: "absolute", left: 1340, top: 870, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 150, color: GRN, background: "#f3ead6", padding: "0 40px", borderRadius: 18, boxShadow: "0 20px 40px rgba(0,0,0,.5)", opacity: cl(jug * 2) }}>$0</div>
  </>;
}}</Stage>;

// ---- 14:57 · EL TESTER: las puntas tocan los bornes y los dígitos suben hasta 12.6; la franja verde se prende ----
export const HMultimeter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const touch = eio(tt, 0.6, 1.4), v = 12.6 * eio(tt, 1.4, 3.2), ok = cl((tt - 3.2) * 3);
  return <>
    <div style={{ position: "absolute", left: 760, top: 540, transform: "translate(-50%,-50%) rotate(-4deg)", width: 520, height: 760, borderRadius: 50, background: "linear-gradient(180deg,#ffcc22,#e0a800)", boxShadow: "0 60px 110px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 50, top: 60, width: 420, height: 220, borderRadius: 18, background: "#9fb08a", boxShadow: "inset 0 8px 20px rgba(0,0,0,.4)", fontFamily: "monospace", fontWeight: 900, fontSize: 150, color: "#1d2418", textAlign: "center", lineHeight: "220px" }}>{v.toFixed(1)}</div>
      <div style={{ position: "absolute", left: 160, top: 360, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#444,#111)" }}>
        <div style={{ position: "absolute", left: 92, top: 10, width: 16, height: 80, background: TX, borderRadius: 8 }} />
      </div>
      <div style={{ position: "absolute", left: 50, bottom: 50, width: 420, height: 40, borderRadius: 20, background: ok ? GRN : "#333", opacity: 0.3 + 0.7 * ok, boxShadow: `0 0 ${50 * ok}px ${GRN}` }} />
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d={`M 900 820 C 1100 900, 1200 ${700 - 120 * touch}, ${1300 + 40 * touch} ${560 - 80 * touch}`} stroke={RED} strokeWidth={14} fill="none" />
      <path d={`M 860 840 C 1080 1000, 1350 ${800 - 80 * touch}, ${1520 + 20 * touch} ${560 - 80 * touch}`} stroke="#222" strokeWidth={14} fill="none" />
    </svg>
    <div style={{ position: "absolute", left: 1280, top: 420, width: 360, height: 260, borderRadius: 18, background: "linear-gradient(180deg,#2b2d31,#141518)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
    <Tag tt={tt} at={3.3} x={1460} y={780} txt="ABOVE 12.5" col={GRN} size={62} />
  </>;
}}</Stage>;

// ---- 15:15 · LA ESCALERA DE LA RUTINA: una escalera de madera; en cada peldaño el paso que se nombra se ilumina (sin lista de texto, un objeto por peldaño) ----
export const HLadder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const steps: [number, string, string][] = [[0.5, "TOP DRUM OFF", AMB], [3.5, "KNOCK OUT CARBON", TX], [it(h, 0), "PAPER + OIL", RED]];
  const climb = steps.filter(([a]) => tt > a).length;
  return <>
    <div style={{ position: "absolute", left: 640, top: 540, transform: "translate(-50%,-50%) rotate(-6deg)", width: 420, height: 900 }}>
      {[0, 380].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 0, width: 40, height: 900, borderRadius: 10, background: "linear-gradient(90deg,#b5884e,#7a5530)" }} />)}
      {Array.from({ length: 6 }, (_, k) => { const on = k < climb * 2 ? 1 : 0; return <div key={k} style={{ position: "absolute", left: 20, top: 800 - k * 150, width: 380, height: 36, borderRadius: 8, background: on ? "linear-gradient(180deg,#ffd27a,#d49a3a)" : "linear-gradient(180deg,#9a7444,#6b4a26)", boxShadow: on ? "0 0 40px rgba(255,190,80,.6)" : "none" }} />; })}
    </div>
    {/* un solo rótulo: el peldaño en el que está ahora (sale el anterior, entra el nuevo) */}
    {steps.map(([a, txt, col], i) => { const nx = steps[i + 1]?.[0] ?? 1e9, gone = eio(tt, nx - 0.3, nx); return tt > a && gone < 1 ? <div key={txt} style={{ opacity: 1 - gone, transform: `translateY(${-60 * gone}px)` }}>
      <Tag tt={tt} at={a} x={1000} y={760 - i * 220} txt={txt} col={col} size={64} anchor="l" />
      <div style={{ position: "absolute", left: 870, top: 760 - i * 220, transform: "translate(-50%,-50%)", width: 96, height: 96, borderRadius: "50%", background: col, color: "#1b1b1b", fontWeight: 900, fontSize: 60, textAlign: "center", lineHeight: "96px", opacity: cl((tt - a) * 4), boxShadow: "0 12px 30px rgba(0,0,0,.5)" }}>{i + 1}</div>
    </div> : null; })}
  </>;
}}</Stage>;

// ---- 17:23 · EL BUZÓN: cartas con preguntas llegan volando y entran a un buzón de chapa; la banderita roja se levanta ----
export const HMailbox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const flag = phys(tt, it(h, 0) + 0.6, 6, 0.35);
  return <>
    <div style={{ position: "absolute", left: 1140, top: 560, transform: "translate(-50%,-50%)", width: 620, height: 380, borderRadius: "190px 190px 20px 20px", background: "linear-gradient(160deg,#9aa0a6,#4a4e53)", boxShadow: "0 60px 110px rgba(0,0,0,.7), inset 0 6px 0 rgba(255,255,255,.35)" }}>
      <div style={{ position: "absolute", left: -10, top: 120, width: 30, height: 200, background: "#222", borderRadius: 6 }} />
      <div style={{ position: "absolute", right: -70, top: 60, width: 18, height: 240, background: RED, transformOrigin: "9px 240px", transform: `rotate(${-90 + 90 * cl(flag)}deg)` }}><div style={{ width: 80, height: 60, background: RED, marginLeft: 18 }} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: MARK, fontSize: 56, color: "#1c1c1c" }}>COMMENTS</div>
    </div>
    {Array.from({ length: 7 }, (_, i) => { const a = 0.4 + i * 0.75, u = cl((tt - a) / 1.1); if (u <= 0 || u >= 1) return null;
      const x = 200 + 640 * u, y = 300 + 240 * u - Math.sin(u * Math.PI) * 180;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 200, height: 130, borderRadius: 8, background: "#f4efe4", transform: `translate(-50%,-50%) rotate(${-20 + 40 * u}deg) scale(${1 - 0.4 * u})`, boxShadow: "0 16px 30px rgba(0,0,0,.4)", fontFamily: HAND, fontSize: 70, color: "#333", textAlign: "center", lineHeight: "130px" }}>?</div>; })}
    <Tag tt={tt} at={0.8} x={1140} y={180} txt="WHAT HEATS YOUR SHOP?" col={AMB} size={58} />
  </>;
}}</Stage>;

// ---- 17:55 · EL AIRE QUE ENTRA Y SALE: la caja del ventilador en corte; sin agujeros el aire se ahoga, con agujeros fluye ----
export const HAirflow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const holes = cl((tt - it(h, 0)) / 0.7), flow = 0.25 + 0.75 * holes;
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", width: 900, height: 500, borderRadius: 26, border: "18px solid #6b7077", background: "rgba(30,32,36,.7)", boxShadow: "0 60px 110px rgba(0,0,0,.7)" }}>
      {Array.from({ length: 5 }, (_, k) => <div key={k} style={{ position: "absolute", left: -18, top: 70 + k * 80, width: 18, height: 30 * holes, background: "#0b0b0c", borderRadius: 4 }} />)}
      <div style={{ position: "absolute", left: 300, top: 110, width: 260, height: 260, borderRadius: "50%", background: "#151517", transform: `rotate(${tt * 360 * flow}deg)` }}>
        {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: "absolute", left: 118, top: 14, width: 24, height: 116, borderRadius: 12, background: "#3a3d42", transformOrigin: "12px 116px", transform: `rotate(${k * 72}deg) skewX(-14deg)` }} />)}
      </div>
      <div style={{ position: "absolute", right: -18, top: 180, width: 18, height: 110, background: "#0b0b0c" }} />
      <div style={{ position: "absolute", left: 330, top: -70, width: 200, height: 50, borderRadius: "26px 26px 0 0", border: "14px solid #6b7077", borderBottom: "none" }} />
      {Array.from({ length: 10 }, (_, k) => <div key={k} style={{ position: "absolute", left: 20 + k * 90, top: -10, width: 14, height: 14, borderRadius: "50%", background: "#9aa0a6" }} />)}
      <div style={{ position: "absolute", left: 600, top: 300, fontWeight: 900, fontSize: 40, letterSpacing: 4, color: "rgba(214,220,226,.5)" }}>AMMO CAN</div>
    </div>
    {Array.from({ length: 12 }, (_, i) => { const u = (tt * 0.5 * flow + i / 12) % 1, x = 300 + u * 1360, y = 560 + Math.sin(u * 6 + i) * 30 * (1 - holes) + (i % 3 - 1) * 60;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 70, height: 6, borderRadius: 3, background: ICE, opacity: (holes > 0.5 || u < 0.3 ? 0.8 : 0.15) * Math.sin(u * Math.PI) }} />; })}
    <Tag tt={tt} at={0.6} x={960} y={210} txt="AIR IN" col={ICE} size={60} />
    <Tag tt={tt} at={it(h, 0) + 0.5} x={1600} y={880} txt="AIR OUT" col={GRN} size={60} />
  </>;
}}</Stage>;

// ---- 18:27 · LAS TRES LLAMAS: tres vidrios de lámpara en fila; el que se nombra se enciende con su color y su remedio, los otros quedan apagados ----
export const HTrio: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const st: [number, string, string, string, number][] = [[0.3, "#ffaa33", "KNOB UP", "ORANGE", 0], [it(h, 0) + 1.6, "#5aa8ff", "JUST RIGHT", "BLUE", 1], [it(h, 1), "#888", "KNOB DOWN", "GOING OUT", 0.4]];
  const cur = st.reduce((c, s, i) => (tt > s[0] ? i : c), 0);
  return <>{st.map(([a, col, fix, name, b], i) => { const x = 460 + i * 500, on = i === cur ? 1 : 0.18, s = phys(tt, a, 6, 0.5);
    return <div key={i} style={{ position: "absolute", left: x, top: 520, transform: "translate(-50%,-50%)", opacity: tt > a - 0.2 ? 1 : 0.25 }}>
      <div style={{ width: 300, height: 440, borderRadius: "140px 140px 40px 40px", background: "linear-gradient(90deg, rgba(255,255,255,.06), rgba(255,255,255,.2) 30%, rgba(255,255,255,.04))", border: "4px solid rgba(255,255,255,.25)", position: "relative", boxShadow: `0 0 ${120 * on}px ${col}` }}>
        <div style={{ position: "absolute", left: 70, top: 100 + (i === 2 ? 120 * (0.6 + 0.4 * Math.sin(tt * 3)) : 0), width: 160, height: i === 2 ? 140 : 260, borderRadius: "50% 50% 42% 42%", background: `radial-gradient(ellipse at 50% 85%, #fff, ${col} 45%, rgba(0,0,0,0) 74%)`, opacity: on, transform: `scaleY(${0.95 + 0.05 * Math.sin(tt * 2 * Math.PI * (1.3 + b * 0.5))})`, transformOrigin: "50% 100%" }} />
      </div>
      <div style={{ textAlign: "center", marginTop: 26, fontWeight: 900, fontSize: 44, color: col, opacity: cl(s) }}>{name}</div>
      <div style={{ textAlign: "center", marginTop: 6, fontWeight: 800, fontSize: 32, color: DIM, opacity: cl(s) * on }}>{fix}</div>
    </div>; })}</>;
}}</Stage>;

// ---- 19:38 · EL CABLEADO: rojo y negro se tienden del ventilador a la perilla, de la perilla al fusible y a la batería, dibujándose como un cable real ----
export const HWiring: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const d = eio(tt, 0.6, it(h, 0) + 1.2);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <path d="M 360 480 C 560 380, 640 380, 800 480 S 1100 600, 1240 480 S 1480 380, 1600 470" stroke={RED} strokeWidth={14} fill="none" pathLength={1} strokeDasharray={`${d} 1`} strokeLinecap="round" />
      <path d="M 360 560 C 560 660, 640 660, 800 560 S 1100 700, 1240 600 S 1480 700, 1600 590" stroke="#1a1a1a" strokeWidth={14} fill="none" pathLength={1} strokeDasharray={`${d} 1`} strokeLinecap="round" />
    </svg>
    {/* cada pieza aparece cuando el cable llega a ella */}
    {[{ x: 300, f: 0.0, lab: "FAN" }, { x: 800, f: 0.33, lab: "KNOB" }, { x: 1240, f: 0.66, lab: "FUSE" }, { x: 1680, f: 0.98, lab: "12 V" }].map((p, i) => { const s = cl(phys(tt, 0.4 + p.f * (it(h, 0) + 0.8), 6, 0.45)); return <div key={i} style={{ position: "absolute", left: p.x, top: 520, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 2) }}>
      {i === 0 && <div style={{ width: 260, height: 260, borderRadius: 26, background: "linear-gradient(160deg,#3a3d42,#151517)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={200} height={200} viewBox="-100 -100 200 200" style={{ transform: `rotate(${tt * 400 * cl(d * 3)}deg)` }}>{[0, 1, 2, 3, 4].map((b) => <path key={b} d="M 0 -12 C 30 -40, 70 -60, 86 -20 C 60 -16, 30 -6, 0 12 Z" fill="#9aa0a6" transform={`rotate(${b * 72})`} />)}<circle r={20} fill="#2b2d31" stroke="#9aa0a6" strokeWidth={4} /></svg></div>}
      {i === 1 && <div style={{ width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#4a4d52,#16171a)", boxShadow: "0 0 0 14px #2b2d31, 0 30px 60px rgba(0,0,0,.6)", position: "relative" }}><div style={{ position: "absolute", left: 92, top: 18, width: 16, height: 70, borderRadius: 8, background: AMB, transformOrigin: "50% 82px", transform: `rotate(${-60 + 120 * cl(d * 1.4)}deg)` }} /></div>}
      {i === 2 && <div style={{ width: 220, height: 90, borderRadius: 45, background: "linear-gradient(180deg,rgba(230,240,255,.55),rgba(160,180,210,.25))", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.4), 0 20px 40px rgba(0,0,0,.5)", position: "relative" }}>{[0, 1].map((e) => <div key={e} style={{ position: "absolute", top: 0, [e ? "right" : "left"]: 0, width: 40, height: 90, borderRadius: 12, background: "linear-gradient(90deg,#8d9399,#e4e8ec,#6d7379)" }} />)}<div style={{ position: "absolute", left: 40, right: 40, top: 43, height: 4, background: "#ffb347", boxShadow: "0 0 10px #ffb347" }} /></div>}
      {i === 3 && <div style={{ width: 280, height: 230, borderRadius: 20, background: "linear-gradient(180deg,#2b2d31,#141518)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", position: "relative" }}>{[50, 190].map((x, e) => <div key={x} style={{ position: "absolute", left: x, top: -26, width: 44, height: 30, borderRadius: 6, background: e ? "#c9ced4" : RED }} />)}<div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontWeight: 900, fontSize: 80, color: AMB }}>12V</div></div>}
      {i < 3 && <div style={{ position: "absolute", left: "50%", top: i === 2 ? 130 : 290, transform: "translateX(-50%)", fontWeight: 900, fontSize: 58, color: i === 2 ? AMB : TX, whiteSpace: "nowrap", textShadow: "0 6px 24px rgba(0,0,0,.6)" }}>{p.lab}</div>}
    </div>; })}
  </>;
}}</Stage>;

// ---- 20:05 · LAS ASPAS SUCIAS: el polvo se va pegando en las aspas, el giro se frena y la llama de al lado se vuelve naranja ----
export const HFanblade: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const dust = eio(tt, 0.5, it(h, 0)), slow = 1 - 0.7 * eio(tt, it(h, 0) - 0.5, it(h, 0) + 1.5), ang = 360 * (tt * 2.2 - 1.6 * Math.max(0, tt - it(h, 0)) * 0.6), orange = eio(tt, it(h, 1) - 0.4, it(h, 1) + 0.6);
  return <>
    <div style={{ position: "absolute", left: 720, top: 540, transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: 40, background: "linear-gradient(160deg,#2a2c30,#111)", boxShadow: "0 60px 110px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 40, top: 40, width: 520, height: 520, borderRadius: "50%", transform: `rotate(${ang * slow}deg)` }}>
        <svg width={520} height={520} viewBox="-260 -260 520 520" style={{ position: "absolute", left: 0, top: 0 }}>{[0, 1, 2, 3, 4].map((k) => <path key={k} d="M 0 -40 C 70 -120, 190 -170, 236 -70 C 170 -50, 90 -20, 30 30 Z" fill={`rgb(${70 + 110 * dust},${74 + 92 * dust},${80 + 66 * dust})`} stroke="rgba(0,0,0,.35)" strokeWidth={4} transform={`rotate(${k * 72})`} />)}{Array.from({ length: 40 }, (_, k) => { const a = k * 2.399, r = 60 + (k * 37 % 170); return <circle key={k} cx={r * Math.cos(a)} cy={r * Math.sin(a)} r={5 + (k % 4) * 2} fill="#b8a888" opacity={cl(dust * 1.4 - k / 60)} />; })}</svg>
        <div style={{ position: "absolute", left: 200, top: 200, width: 120, height: 120, borderRadius: "50%", background: "#1c1c1e" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1400, top: 760, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -150, top: -360, width: 300, height: 360, borderRadius: "50% 50% 42% 42%", background: `radial-gradient(ellipse at 50% 88%, #fff, rgb(${90 + 165 * orange},${168 - 30 * orange},${255 - 215 * orange}) 45%, rgba(0,0,0,0) 74%)`, transform: `scaleY(${0.95 + 0.05 * Math.sin(tt * 2 * Math.PI * 1.4)})`, transformOrigin: "50% 100%" }} />
    </div>
    <Tag tt={tt} at={1.2} x={720} y={120} txt="DUST" col="#c9b8a0" size={64} />
    <Tag tt={tt} at={it(h, 1)} x={1400} y={900} txt="ORANGE" col="#ffaa33" size={60} />
  </>;
}}</Stage>;

// ---- 21:21 · LA CARRERA DEL SÁBADO: dos carriles de taller con meta «SHOP WARM»; un tronco rueda lento 50 minutos, una gota de aceite llega en 4 ----
export const HSprint: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = eio(tt, 0.6, 11.8) * 0.98, o = eio(tt, it(h, 0) - 0.3, it(h, 0) + 1.1), X0 = 260, X1 = 1480;
  const Lane = ({ y, f, col, lab, min, kid }: { y: number; f: number; col: string; lab: string; min: string; kid: React.ReactNode }) => <>
    <div style={{ position: "absolute", left: X0 - 60, top: y + 70, width: X1 - X0 + 200, height: 40, borderRadius: 4, background: "linear-gradient(180deg,#3a3532,#1c1917)" }} />
    <div style={{ position: "absolute", left: X0 + (X1 - X0) * f, top: y, transform: "translate(-50%,0)" }}>{kid}</div>
    <div style={{ position: "absolute", left: 120, top: y - 70, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: DIM }}>{lab}</div>
    <div style={{ position: "absolute", left: X0 + (X1 - X0) * f, top: y + 110, transform: "translate(-50%,0)", fontWeight: 900, fontSize: 64, color: col }}>{min}</div>
  </>;
  return <>
    <div style={{ position: "absolute", left: X1 + 200, top: 200, width: 16, height: 700, background: "repeating-linear-gradient(180deg,#fff 0 40px,#111 40px 80px)" }} />
    <Tag tt={tt} at={0.8} x={X1 + 208} y={150} txt="SHOP WARM" col={AMB} size={48} />
    <Lane y={330} f={w} col="#c98a4a" lab="WOOD" min={`${Math.round(50 * w / 0.98)} MIN`} kid={<div style={{ width: 160, height: 90, borderRadius: 45, background: "linear-gradient(180deg,#9a6a3e,#4a2f1a)", transform: `rotate(${w * 900}deg)`, boxShadow: "0 14px 24px rgba(0,0,0,.5)" }} />} />
    <Lane y={680} f={o} col={BLU} lab="OIL" min={`${Math.round(4 * o)} MIN`} kid={<div style={{ width: 90, height: 120, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 40% 60%, #ffd27a, #c88a2a 60%, #7a4a10)", boxShadow: `0 0 ${40 * o}px rgba(90,168,255,.7)` }} />} />
  </>;
}}</Stage>;

// ---- 21:56 · EL INVERNADERO: un invernadero de vidrio con plantas; la estufa azul lo entibia y la escarcha del vidrio se derrite de abajo hacia arriba ----
export const HGreenhouse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const melt = eio(tt, 0.8, 6.5), smoke = cl((tt - it(h, 0)) / 0.5) * (1 - cl((tt - it(h, 1)) / 0.6));
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", width: 1200, height: 640 }}>
      <svg width={1200} height={640} style={{ position: "absolute" }}><path d="M 40 640 L 40 260 L 600 30 L 1160 260 L 1160 640 Z" fill="rgba(180,220,255,.08)" stroke="rgba(220,240,255,.6)" strokeWidth={10} />
        {[240, 440, 760, 960].map((x) => <line key={x} x1={x} y1={x < 600 ? 260 - (x - 40) * 0.41 + 0 : 260 - (1160 - x) * 0.41} x2={x} y2={640} stroke="rgba(220,240,255,.35)" strokeWidth={6} />)}</svg>
      <div style={{ position: "absolute", left: 40, right: 40, top: 30, bottom: 0, clipPath: "polygon(0 36%, 50% 0, 100% 36%, 100% 100%, 0 100%)", background: "linear-gradient(0deg, rgba(240,248,255,0) 0%, rgba(240,248,255,.55) 1%)", backgroundSize: "100% 100%", maskImage: `linear-gradient(0deg, transparent ${melt * 100}%, #000 ${melt * 100 + 8}%)`, WebkitMaskImage: `linear-gradient(0deg, transparent ${melt * 100}%, #000 ${melt * 100 + 8}%)` } as React.CSSProperties} />
      {Array.from({ length: 9 }, (_, k) => <div key={k} style={{ position: "absolute", left: 120 + k * 110, top: 470, width: 70, height: 170, borderRadius: "50% 50% 10px 10px", background: `linear-gradient(180deg, rgb(${90 - 30 * melt},${160 + 40 * melt},${90}), #2c5a2c)`, transform: `scaleY(${0.85 + 0.15 * melt})`, transformOrigin: "50% 100%" }} />)}
      <div style={{ position: "absolute", left: 540, top: 470, width: 120, height: 170, borderRadius: 16, background: "linear-gradient(160deg,#5b5652,#1f1c1a)", boxShadow: "0 0 80px rgba(90,168,255,.5)" }} />
      {Array.from({ length: 4 }, (_, i) => { const ph = (tt * 0.4 + i / 4) % 1; return <div key={i} style={{ position: "absolute", left: 560 + Math.sin(ph * 5) * 30, top: 400 - ph * 260, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,30,30,.8), rgba(30,30,30,0) 70%)", opacity: smoke * (1 - ph) }} />; })}
    </div>
    <Tag tt={tt} at={it(h, 0)} x={1640} y={300} txt="NO SMOKE" col={RED} size={52} />
    <Tag tt={tt} at={it(h, 1)} x={1640} y={380} txt="RUN IT BLUE" col={BLU} size={52} />
  </>;
}}</Stage>;
