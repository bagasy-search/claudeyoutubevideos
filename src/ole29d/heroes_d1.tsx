// ole29d · componentes únicos 1-12 (de la cocina vacía en marzo a las seis tortitas)
import React from "react";
import { AMB, DIM, H, HAND, Head, ICE, MARK, Photo, RED, Stage, TX, Tag, cl, eIn, eio, phys } from "./hkit";

export const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// la sartén de hierro vista desde arriba (cuerpo, borde con brillo, mango con agujero); children = lo que se cocina adentro
export const Skillet: React.FC<{ x: number; y: number; r: number; rot?: number; heat?: number; children?: React.ReactNode }> = ({ x, y, r, rot = 0, heat = 0, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, transform: `rotate(${rot}deg)` }}>
    <div style={{ position: "absolute", left: r * 0.86, top: -r * 0.13, width: r * 1.05, height: r * 0.26, borderRadius: r * 0.13, background: "linear-gradient(180deg,#3a3a3e,#121214 60%,#26262a)", boxShadow: "0 18px 40px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", right: r * 0.1, top: r * 0.07, width: r * 0.12, height: r * 0.12, borderRadius: "50%", background: "#0a0a0b", boxShadow: "inset 0 2px 4px rgba(0,0,0,.9)" }} />
    </div>
    <div style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #3c3c41, #19191b 55%, #0c0c0d)", boxShadow: `inset 0 0 0 ${r * 0.09}px #232326, inset 0 0 0 ${r * 0.11}px #4a4a50, 0 40px 90px rgba(0,0,0,.7), 0 0 ${80 * heat}px rgba(255,120,40,${0.35 * heat})` }}>
      <div style={{ position: "absolute", inset: r * 0.12, borderRadius: "50%", overflow: "hidden", background: `radial-gradient(circle at 45% 40%, #2a2a2e, #141416 70%)` }}>{children}</div>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(ellipse 40% 22% at 34% 22%, rgba(255,255,255,.16), transparent 70%)" }} />
    </div>
  </div>
);

// 1 · 0:05 · EL DESHIELO: corte del camino de primavera; la rueda del trineo se hunde en el barro y las huellas se llenan de agua
export const DMud: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const sink = eio(tt, 1.0, 4.2), fill = eio(tt, 4.4, 8.0);
  return <>
    {/* cielo pálido, pinos y nieve vieja */}
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 230 + rnd(i) * 60, top: 250 - rnd(i, 2) * 90, width: 0, height: 0, borderLeft: "70px solid transparent", borderRight: "70px solid transparent", borderBottom: `${260 + rnd(i, 3) * 120}px solid #16251d`, opacity: 0.9 }} />)}
    {/* el suelo en corte: nieve sucia, barro, tierra helada */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 40, background: "linear-gradient(180deg,#d9dde0,#a7a69c)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 600, height: 300, background: "linear-gradient(180deg,#4a3422,#2e1f14 60%,#1c130c)" }} />
    {/* las dos huellas que se llenan de agua */}
    {[560, 1360].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 170, top: 590, width: 340, height: 70 + 40 * sink, borderRadius: "0 0 50% 50%", background: "#1a120b", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 80}%`, background: "linear-gradient(180deg, rgba(160,190,210,.75), rgba(70,90,100,.9))" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 4, background: "rgba(230,240,250,.7)", transform: `translateX(${Math.sin(tt * 1.3 + i) * 10}px)` }} />
      </div>
    </div>)}
    {/* el trineo vacío, inclinado porque el patín se hundió */}
    <div style={{ position: "absolute", left: 560, top: 430 + 90 * sink, transform: `translate(-50%,-50%) rotate(${-9 * sink}deg)` }}>
      <div style={{ width: 640, height: 50, background: "linear-gradient(180deg,#8a6a44,#5a3e24)", borderRadius: 6 }} />
      {[40, 280, 520].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 50, width: 18, height: 60, background: "#4a3420" }} />)}
      <div style={{ position: "absolute", left: -30, top: 106, width: 700, height: 18, borderRadius: "0 0 0 30px", background: "#5a5e62" }} />
    </div>
    {/* gotas del alero */}
    {Array.from({ length: 6 }, (_, i) => { const ph = (tt * 0.55 + rnd(i, 7)) % 1; return <div key={i} style={{ position: "absolute", left: 1100 + i * 120, top: 120 + ph * 440, width: 8, height: 14, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(210,230,245,.8)", opacity: 1 - ph * 0.6 }} />; })}
    <Tag tt={tt} at={1.2} x={1360} y={460} txt="SPRING BREAKUP" col={TX} size={56} />
    <Tag tt={tt} at={5.0} x={1360} y={520} txt="NO SLED TILL IT DRIES" col={ICE} size={34} />
  </>;
}}</Stage>;

// 2 · 0:22 · UNA SARTÉN, TRES OFICIOS: adentro de la sartén se encienden una hornalla, un horno con su puerta y un plato servido
export const DJobs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const st = [0.6, 2.6, 4.6].map((a) => cl(phys(tt, a, 6, 0.5)) * (1 - eIn(tt, a + 2.0, a + 2.4) * (a < 4 ? 1 : 0)));
  return <>
    <Skillet x={860} y={560} r={330} heat={0.4 + 0.3 * st[0]}>
      {/* hornalla: anillos de fuego */}
      <div style={{ position: "absolute", inset: 0, opacity: st[0] }}>{[0.75, 0.5, 0.25].map((k, i) => <div key={i} style={{ position: "absolute", left: `${50 - k * 50}%`, top: `${50 - k * 50}%`, width: `${k * 100}%`, height: `${k * 100}%`, borderRadius: "50%", border: `10px solid rgba(255,${140 + i * 40},60,${0.7 - i * 0.15})`, boxShadow: "0 0 30px rgba(255,120,40,.6)", transform: `scale(${1 + 0.02 * Math.sin(tt * 2 + i)})` }} />)}</div>
      {/* horno: tapa en cúpula y calor que da vueltas */}
      <div style={{ position: "absolute", inset: 0, opacity: st[1], display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "72%", height: "72%", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f0b25a, #c06a1e 60%, #6a3410)", boxShadow: "inset 0 -20px 40px rgba(0,0,0,.4)", transform: `rotate(${tt * 20}deg)` }}>
          {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 170, height: 6, borderRadius: 3, background: "rgba(255,240,200,.5)", transform: `rotate(${i * 45}deg) translateX(30px)` }} />)}
        </div>
      </div>
      {/* plato: huevo, papas y una cuchara */}
      <div style={{ position: "absolute", inset: 0, opacity: st[2] }}>
        {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120 + rnd(i) * 250, top: 280 + rnd(i, 2) * 200, width: 56, height: 50, borderRadius: 10, background: "radial-gradient(circle at 35% 30%, #f2c46a, #b8742a)", transform: `rotate(${rnd(i, 3) * 90}deg)` }} />)}
        <div style={{ position: "absolute", left: 300, top: 120, width: 220, height: 180, borderRadius: "50% 46% 52% 48%", background: "#fbf8f0" }}><div style={{ position: "absolute", left: 66, top: 50, width: 86, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ffd35a, #f09a10)" }} /></div>
      </div>
    </Skillet>
    {["YOUR STOVE", "YOUR OVEN", "YOUR PLATE"].map((w, i) => <div key={i} style={{ position: "absolute", left: 1400, top: 330 + i * 140, fontWeight: 900, fontSize: 62, letterSpacing: 2, color: st[i] > 0.5 ? AMB : "rgba(247,244,238,.22)", transform: `translateX(${(1 - cl(phys(tt, 0.6 + i * 2, 6, 0.6))) * 60}px)` }}>{w}</div>)}
    <Tag tt={tt} at={6.8} x={1540} y={790} txt="UNDER $1 A MEAL" col={RED} size={40} />
  </>;
}}</Stage>;

// 3 · 0:39 · LA GRILLA DE LA SEMANA: 7 columnas por 3 filas; en cada casillero cae una sartencita, día por día, hasta 21
export const DGrid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const n = Math.floor(eio(tt, 1.2, 8.4) * 21.99);
  return <>
    <Head tt={tt} kick="ONE SKILLET" title="7 DAYS · 21 MEALS" />
    {Array.from({ length: 7 }, (_, d) => <div key={d} style={{ position: "absolute", left: 250 + d * 215, top: 300, width: 190, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 44, color: DIM }}>day {d + 1}</div>)}
    {["BREAKFAST", "DINNER", "SUPPER"].map((m, r) => <div key={m} style={{ position: "absolute", left: 60, top: 420 + r * 200, fontWeight: 800, fontSize: 22, letterSpacing: 3, color: DIM }}>{m}</div>)}
    {Array.from({ length: 21 }, (_, i) => { const d = Math.floor(i / 3), r = i % 3, on = i < n, s = phys(tt, 1.2 + (i / 21) * 7.2, 9, 0.4);
      return <div key={i} style={{ position: "absolute", left: 250 + d * 215, top: 370 + r * 200, width: 190, height: 170, borderRadius: 16, background: "rgba(255,255,255,.04)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,.08)" }}>
        {on && <div style={{ position: "absolute", left: 95, top: 85, transform: `translateY(${(1 - s) * -120}px) scale(${0.3 + 0.7 * s})` }}><Skillet x={-14} y={0} r={58} rot={-20 + d * 7}><div style={{ position: "absolute", inset: 14, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, hsl(${30 + rnd(i) * 20},70%,${55 + rnd(i, 2) * 15}%), hsl(${20 + rnd(i, 3) * 15},60%,30%))` }} /></Skillet></div>}
      </div>; })}
    <div style={{ position: "absolute", right: 110, top: 96, fontWeight: 900, fontSize: 110, color: AMB }}>{n}</div>
  </>;
}}</Stage>;

// 4 · 0:57 · EL SOBRE DEL DÍA SEIS: un sobre lacrado tiembla sobre la mesa; el lacre late como si algo quisiera salir
export const DSeal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = phys(tt, 0.3, 5, 0.55), sh = Math.sin(tt * 13) * 3 * eio(tt, 3, 4) * (1 - eio(tt, 7.5, 8.5)), crack = eio(tt, 5.0, 6.8);
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) translateY(${(1 - s) * -380}px) rotate(${-4 + sh}deg)` }}>
      <div style={{ width: 760, height: 470, background: "linear-gradient(160deg,#efe4cb,#d8c7a3)", borderRadius: 10, boxShadow: "0 50px 110px rgba(0,0,0,.65)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, borderLeft: "380px solid transparent", borderRight: "380px solid transparent", borderTop: "270px solid #e3d4b2", filter: "drop-shadow(0 6px 6px rgba(0,0,0,.18))" }} />
        <div style={{ position: "absolute", left: 70, bottom: 60, fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#3a2a1a" }}>Day 6</div>
        <div style={{ position: "absolute", left: 70, bottom: 30, fontFamily: HAND, fontSize: 36, color: "#6a5236" }}>the crew's favorite</div>
      </div>
      {/* el lacre */}
      <div style={{ position: "absolute", left: 380, top: 270, transform: `translate(-50%,-50%) scale(${1 + 0.05 * Math.sin(tt * 3.2)})` }}>
        <div style={{ width: 150, height: 150, borderRadius: "46% 54% 50% 50%", background: "radial-gradient(circle at 38% 32%, #e0563c, #8a1a12 70%)", boxShadow: "0 10px 24px rgba(0,0,0,.5)" }}>
          <div style={{ position: "absolute", inset: 30, borderRadius: "50%", boxShadow: "inset 0 0 0 5px rgba(60,6,4,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MARK, fontSize: 52, color: "rgba(60,6,4,.7)" }}>O</div>
          <div style={{ position: "absolute", left: 72, top: 10, width: 4, height: 130 * crack, background: "#3a0806", transform: "rotate(14deg)" }} />
        </div>
      </div>
    </div>
    {/* un hilito de vapor que se escapa por la rajadura */}
    {crack > 0.2 && Array.from({ length: 4 }, (_, i) => { const ph = (tt * 0.4 + i * 0.25) % 1; return <div key={i} style={{ position: "absolute", left: 960 + Math.sin(ph * 6 + i) * 30, top: 500 - ph * 300, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,240,220,.35)", filter: "blur(18px)", opacity: Math.sin(ph * Math.PI) * crack }} />; })}
    <Tag tt={tt} at={6.4} x={960} y={900} txt="THE SUPPER THEY BEGGED FOR" col={AMB} size={44} />
  </>;
}}</Stage>;

// 5 · 1:29 · EL TICKET DEL ALMACÉN: sale de la caja registradora renglón por renglón, marca blanca, sin nombre de fantasía
export const DReceipt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L = [["OATS · STORE BRAND", "2.98"], ["EGGS · DOZEN", "3.29"], ["POTATOES · 10 LB", "4.49"], ["ONIONS · 3 LB", "2.79"], ["CORNMEAL · 2 LB", "1.89"], ["PINTO BEANS · 4 LB", "4.19"], ["RICE · 5 LB", "4.29"], ["CABBAGE", "1.99"]];
  const len = eio(tt, 0.8, 7.5) * L.length;
  return <>
    {/* la caja registradora de bronce */}
    <div style={{ position: "absolute", left: 640, top: 760, transform: `translate(-50%,-50%) scale(${phys(tt, 0, 5, 0.6)})` }}>
      <div style={{ width: 520, height: 300, borderRadius: "30px 30px 10px 10px", background: "linear-gradient(160deg,#d8b064,#8a6424 60%,#5a3e14)", boxShadow: "0 40px 90px rgba(0,0,0,.6)", position: "relative" }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 50 + (i % 6) * 72, top: 130 + Math.floor(i / 6) * 70, width: 54, height: 54, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fbf6ea,#cfc5ad)", boxShadow: "0 5px 0 #3a2a10", transform: `translateY(${Math.floor(len) % 12 === i ? 4 : 0}px)` }} />)}
        <div style={{ position: "absolute", left: 120, top: 26, width: 280, height: 70, background: "#1a1208", borderRadius: 8, color: AMB, fontWeight: 900, fontSize: 48, textAlign: "center", lineHeight: "70px" }}>${(L.slice(0, Math.floor(len)).reduce((a, [, p]) => a + +p, 0)).toFixed(2)}</div>
      </div>
    </div>
    {/* el ticket que sube y se curva */}
    <div style={{ position: "absolute", left: 1180, top: 900 - len * 82, width: 520, height: len * 82 + 40, background: "linear-gradient(90deg,#f4f1ea,#fffdf8 50%,#ece7dc)", boxShadow: "0 30px 70px rgba(0,0,0,.55)", transform: `rotate(${3 - len * 0.4}deg)`, transformOrigin: "50% 100%", padding: "24px 30px", fontFamily: "monospace", color: "#2a2a2a", overflow: "hidden" }}>
      {L.slice(0, Math.ceil(len)).map(([a, p], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 30, height: 82, alignItems: "center", opacity: cl(len - i) }}><span>{a}</span><span>{p}</span></div>)}
    </div>
    <Tag tt={tt} at={1.2} x={640} y={420} txt="THE CHEAP STORE BRAND" col={AMB} size={46} />
  </>;
}}</Stage>;

// 6 · 1:46 · EL CARTEL DE PALETAS: los precios caen en un cartel de paletas giratorias de estación de tren, uno por renglón
export const DFlap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const R: [string, string, number][] = [["1 EGG", "25¢", 0.4], ["1 POTATO", "40¢", 3.9], ["1 ONION", "30¢", 4.9], ["½ CUP CORNMEAL", "15¢", 8.0], ["½ CUP RICE", "15¢", 9.6]];
  const Flap: React.FC<{ c: string; at: number; i: number }> = ({ c, at, i }) => {
    const p = cl((tt - at - i * 0.07) / 0.5), ch = p < 1 ? String.fromCharCode(65 + Math.floor((tt * 30 + i * 7) % 26)) : c;
    return <div style={{ width: 62, height: 92, margin: 3, borderRadius: 8, background: "linear-gradient(180deg,#222226 49%,#0e0e10 51%)", boxShadow: "0 6px 12px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 60, color: c === " " ? "transparent" : (p < 1 ? DIM : TX), transform: `rotateX(${p < 1 ? (tt * 900) % 180 - 90 : 0}deg)` }}>{tt < at ? "" : ch}</div>;
  };
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", padding: 40, borderRadius: 24, background: "linear-gradient(180deg,#121214,#08080a)", boxShadow: "0 50px 120px rgba(0,0,0,.7), inset 0 0 0 3px #2a2a2e" }}>
      {R.map(([a, b, at], r) => <div key={r} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex" }}>{a.padEnd(14).split("").map((c, i) => <Flap key={i} c={c} at={at} i={i} />)}</div>
        <div style={{ width: 40 }} />
        <div style={{ display: "flex" }}>{b.padStart(3).split("").map((c, i) => <Flap key={i} c={c} at={at + 0.5} i={i} />)}</div>
      </div>)}
    </div>
  </>;
}}</Stage>;

// 7 · 2:21 · LA PIEL DE LA SARTÉN AL MICROSCOPIO: el hierro gris y poroso; cada fritura deja una capa negra que lo vuelve liso
export const DMicro: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const n = Math.floor(eio(tt, 1.2, 7.6) * 6.99);
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, width: 820, height: 820, transform: `translate(-50%,-50%) scale(${phys(tt, 0, 4.5, 0.6)})`, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 26px #2a2a2e, 0 0 0 34px #6a6a70, 0 60px 140px rgba(0,0,0,.8)", background: "#0d0d0e" }}>
      {/* el hierro: grano rugoso */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, bottom: 0, background: "repeating-linear-gradient(90deg,#5a5a60 0 9px,#3a3a40 9px 15px,#66666c 15px 22px)" }}>
        {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 800, top: -16 + rnd(i, 2) * 14, width: 20 + rnd(i, 3) * 40, height: 30, borderRadius: "50%", background: "#0d0d0e" }} />)}
      </div>
      {/* las capas de grasa horneada que se apilan */}
      {Array.from({ length: n }, (_, i) => { const s = phys(tt, 1.2 + i * 0.92, 8, 0.5); return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 470 - (i + 1) * 30, height: 34, background: `linear-gradient(180deg, hsl(30,30%,${14 + i * 1.5}%), hsl(25,25%,${8 + i}%))`, borderRadius: i < 2 ? "40% 60% 0 0 / 30% 30% 0 0" : 6, transform: `translateY(${(1 - s) * -200}px)`, opacity: cl(s * 2), boxShadow: "0 -2px 0 rgba(255,220,160,.25)" }} />; })}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,.18), transparent 35%)" }} />
    </div>
    <Tag tt={tt} at={0.8} x={360} y={420} txt="BARE IRON" col={DIM} size={36} anchor="l" />
    <Tag tt={tt} at={6.0} x={1420} y={300} txt="EVERY FRY = ONE COAT" col={AMB} size={40} anchor="l" />
  </>;
}}</Stage>;

// 8 · 2:37 · LA CADENA: cada comida es un eslabón de hierro que se forja y se engancha con el siguiente (sobras → desayuno)
export const DChain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const L = ["SUPPER", "LEFTOVERS", "BREAKFAST", "DINNER", "SUPPER"];
  return <>
    {L.map((w, i) => { const s = phys(tt, 0.6 + i * 1.5, 7, 0.4), glow = cl(1 - (tt - 0.6 - i * 1.5) / 1.6), x = 240 + i * 360, y = 560 + (i % 2 ? 36 : -36);
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * 260}px) rotate(${i % 2 ? 90 : 0}deg)`, opacity: cl(s * 2) }}>
        <div style={{ width: 300, height: 170, borderRadius: 85, boxShadow: `inset 0 0 0 34px ${glow > 0.05 ? `rgb(${120 + 135 * glow},${60 + 80 * glow},${30})` : "#2c2c30"}, 0 30px 60px rgba(0,0,0,.6), 0 0 ${60 * glow}px rgba(255,120,30,${0.8 * glow})`, background: "transparent" }} />
        <div style={{ position: "absolute", left: "50%", top: i % 2 ? 210 : -60, transform: `translateX(-50%) rotate(${i % 2 ? -90 : 0}deg)`, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: i === 2 ? AMB : TX, whiteSpace: "nowrap" }}>{w}</div>
      </div>; })}
    {/* chispas de la fragua en el último eslabón */}
    {Array.from({ length: 16 }, (_, i) => { const a = 0.6 + Math.floor(tt / 1.5 - 0.4) * 1.5, ph = cl((tt - a) / 1.1); const ang = rnd(i, 4) * Math.PI * 2; return ph > 0 && ph < 1 ? <div key={i} style={{ position: "absolute", left: 240 + Math.min(4, Math.floor((tt - 0.6) / 1.5)) * 360 + Math.cos(ang) * ph * 200, top: 560 + Math.sin(ang) * ph * 160 + ph * ph * 120, width: 7, height: 7, borderRadius: "50%", background: "#ffc46a", opacity: 1 - ph }} /> : null; })}
    <Tag tt={tt} at={8.0} x={960} y={860} txt="NOTHING GOES TO WASTE" col={AMB} size={48} />
  </>;
}}</Stage>;

// 9 · 3:26 · LA PAPA EN CUBOS: la papa entera se abre en el aire en una grilla 3D de cubitos que caen a la sartén
export const DCubes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sp = eio(tt, 1.4, 3.2), fall = eio(tt, 4.6, 6.6);
  return <>
    <Skillet x={1020} y={760} r={250} heat={0.6} />
    {Array.from({ length: 27 }, (_, i) => { const a = i % 3 - 1, b = Math.floor(i / 3) % 3 - 1, c = Math.floor(i / 9) - 1;
      const x0 = 760 + a * 46 * (1 + sp * 1.6) + b * 18, y0 = 380 + c * 46 * (1 + sp * 1.6) - b * 18, x1 = 1020 + (rnd(i) - 0.5) * 300, y1 = 760 + (rnd(i, 2) - 0.5) * 260;
      return <div key={i} style={{ position: "absolute", left: x0 + (x1 - x0) * fall, top: y0 + (y1 - y0) * fall - Math.sin(fall * Math.PI) * 160, width: 54, height: 54, borderRadius: 8 * (1 - sp) + 6, background: fall > 0.95 ? "radial-gradient(circle at 35% 30%, #f5cf7a, #c2802e)" : sp > 0.05 ? "linear-gradient(135deg,#fbefc8,#e8d29a)" : "#8a6440", transform: `rotate(${fall * rnd(i, 3) * 200}deg)`, boxShadow: "0 8px 14px rgba(0,0,0,.4)" }} />; })}
    <Tag tt={tt} at={2.6} x={500} y={700} txt="SMALL CUBES" col={TX} size={44} />
    <Tag tt={tt} at={3.2} x={500} y={760} txt="COOK FASTER" col={AMB} size={34} />
  </>;
}}</Stage>;

// 10 · 4:01 · LA HINCHAZÓN: el poroto seco en remojo crece de noche al doble; el reloj de la ventana pasa de la luna al sol
export const DSwell: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const g = eio(tt, 1.0, 8.0), sky = g;
  return <>
    {/* la ventana: de noche a mañana */}
    <div style={{ position: "absolute", left: 1320, top: 180, width: 420, height: 320, borderRadius: 10, overflow: "hidden", boxShadow: "inset 0 0 0 16px #3a2a1a, 0 30px 60px rgba(0,0,0,.6)", background: `linear-gradient(180deg, hsl(${220 - 20 * sky},${40 + 20 * sky}%,${10 + 50 * sky}%), hsl(${30 + 20 * sky},${30 + 40 * sky}%,${8 + 55 * sky}%))` }}>
      <div style={{ position: "absolute", left: 60 + 260 * sky, top: 200 - 150 * Math.sin(sky * Math.PI * 0.9), width: 60, height: 60, borderRadius: "50%", background: sky < 0.5 ? "#e8eef5" : "#ffd27a", boxShadow: `0 0 40px ${sky < 0.5 ? "#9ab" : "#ffb04a"}` }} />
      <div style={{ position: "absolute", left: 202, top: 0, width: 16, height: "100%", background: "#3a2a1a" }} /><div style={{ position: "absolute", top: 152, left: 0, height: 16, width: "100%", background: "#3a2a1a" }} />
    </div>
    {/* el bol de vidrio con agua y los porotos que crecen */}
    <div style={{ position: "absolute", left: 700, top: 640, transform: "translate(-50%,-50%)", width: 760, height: 420, borderRadius: "20px 20px 300px 300px", background: "linear-gradient(180deg, rgba(200,220,235,.12), rgba(150,180,200,.25))", boxShadow: "inset 0 0 0 4px rgba(220,235,245,.35), 0 40px 90px rgba(0,0,0,.55)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70 + 40 * g, bottom: 0, background: "rgba(150,110,80,.28)" }} />
      {Array.from({ length: 22 }, (_, i) => { const s = 1 + g * (0.9 + rnd(i) * 0.3); return <div key={i} style={{ position: "absolute", left: 80 + rnd(i, 2) * 560, top: 210 + rnd(i, 3) * 150 - g * 40, width: 60 * s, height: 38 * s, borderRadius: "50% 50% 46% 54% / 60% 60% 40% 40%", background: `radial-gradient(ellipse at 35% 30%, #e8c4a8, #b07a5a 60%, #7a4a30)`, transform: `rotate(${rnd(i, 4) * 180}deg)`, boxShadow: "0 4px 8px rgba(0,0,0,.3)" }}>{Array.from({ length: 4 }, (_, k) => <div key={k} style={{ position: "absolute", left: `${20 + rnd(i, k + 5) * 50}%`, top: `${20 + rnd(i, k + 9) * 50}%`, width: "22%", height: "18%", borderRadius: "50%", background: "#6a3a24", opacity: 0.6 }} />)}</div>; })}
    </div>
    <Tag tt={tt} at={1.4} x={700} y={330} txt="SUNDAY NIGHT" col={ICE} size={40} />
    <Tag tt={tt} at={7.6} x={700} y={900} txt="TWICE THE SIZE BY MORNING" col={AMB} size={42} />
  </>;
}}</Stage>;

// 11 · 4:35 · LA PRUEBA DE LA PALMA: la mano sobre la sartén vacía; el aire tiembla y los segundos se cuentan con los dedos
export const DPalm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const heat = eio(tt, 0.4, 4.0), cnt = Math.min(3, Math.floor(cl((tt - 4.4) / 3.6) * 3.99));
  return <>
    <Skillet x={880} y={720} r={300} heat={heat} />
    {/* ondas de calor que suben */}
    {Array.from({ length: 7 }, (_, i) => { const ph = (tt * 0.6 + i / 7) % 1; return <div key={i} style={{ position: "absolute", left: 640 + i * 70, top: 640 - ph * 300, width: 30, height: 160, borderRadius: 20, borderLeft: `4px solid rgba(255,220,180,${0.35 * heat * Math.sin(ph * Math.PI)})`, transform: `skewX(${Math.sin(tt * 3 + i) * 14}deg)` }} />; })}
    {/* la palma de la mano: silueta de cuatro dedos y pulgar */}
    <div style={{ position: "absolute", left: 880, top: 300, transform: `translate(-50%,-50%) translateY(${(1 - phys(tt, 0.2, 5, 0.6)) * -260}px)` }}>
      <div style={{ width: 300, height: 220, borderRadius: "40% 40% 46% 46%", background: "linear-gradient(180deg,#d9a07a,#b47a52)", position: "relative", boxShadow: "0 30px 50px rgba(0,0,0,.4)" }}>
        {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: 22 + k * 68, top: -150 + (k === 0 || k === 3 ? 30 : 0), width: 58, height: 170, borderRadius: 30, background: "linear-gradient(180deg,#e0aa84,#c08660)", transform: `translateY(${k < cnt ? 0 : 60}px)`, opacity: k < cnt + 1 ? 1 : 0.5 }} />)}
        <div style={{ position: "absolute", left: -70, top: 70, width: 140, height: 60, borderRadius: 30, background: "#c58a62", transform: "rotate(-30deg)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1460, top: 520, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 260, color: cnt >= 3 ? RED : AMB }}>{cnt > 0 ? cnt : ""}</div>
    <Tag tt={tt} at={8.0} x={1460} y={720} txt="HOT ENOUGH" col={RED} size={44} />
  </>;
}}</Stage>;

// 12 · 4:51 · EL HUEVO QUE PATINA: dos sartenes; en la fría el huevo se pega y se rompe, en la caliente se desliza dejando estela
export const DSlide: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const drop = phys(tt, 0.6, 7, 0.5), sl = eio(tt, 3.0, 7.0);
  const Egg = ({ torn }: { torn: boolean }) => <div style={{ width: 200, height: 170, borderRadius: torn ? "40% 20% 50% 30%" : "50% 46% 52% 48%", background: torn ? "rgba(250,246,236,.8)" : "#fbf8f0", position: "relative", boxShadow: torn ? "none" : "0 0 0 6px rgba(200,140,60,.5)" }}>
    <div style={{ position: "absolute", left: 60, top: 46, width: 80, height: 76, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ffd35a, #f09a10)" }} />
    {torn && Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 180, top: rnd(i, 2) * 150, width: 30, height: 20, background: "#2a2a2e", borderRadius: 6 }} />)}
  </div>;
  return <>
    <Skillet x={500} y={600} r={260}><div style={{ position: "absolute", left: 160, top: 160, transform: `scale(${drop})` }}><Egg torn={tt > 2.4} /></div></Skillet>
    <Skillet x={1340} y={600} r={260} heat={0.8}>
      <div style={{ position: "absolute", left: 60 + sl * 200, top: 150 + Math.sin(sl * Math.PI) * -60, width: 220 * sl, height: 30, background: "linear-gradient(90deg, transparent, rgba(255,230,170,.25))", borderRadius: 15 }} />
      <div style={{ position: "absolute", left: 60 + sl * 200, top: 120 + Math.sin(sl * Math.PI) * -60, transform: `scale(${drop}) rotate(${sl * 40}deg)` }}><Egg torn={false} /></div>
    </Skillet>
    <Tag tt={tt} at={2.6} x={500} y={250} txt="COLD PAN · STUCK" col={RED} size={44} />
    <Tag tt={tt} at={4.0} x={1340} y={250} txt="HOT PAN · IT SLIDES" col={AMB} size={44} />
  </>;
}}</Stage>;
