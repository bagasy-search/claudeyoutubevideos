// ole29d · RONDA 2 de los 35 componentes únicos: objetos REALES recortados (agnes + rembg) que llegan con peso sobre la
// foto real del momento. Una idea = un mecanismo, una palabra grande, cada momento clavado en la palabra que lo dice.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { AMB, Big, Bg, H, HAND, ICE, MARK, Odo, Pour, RED, Spr, Stage, Steam, TX, cl, eIn, eio, img, phys, spr } from "./hkit";
import { rnd } from "./heroes_d1";

type C = React.FC<{ t: number; h: H }>;
// la foto del plano que veníamos viendo, desenfocada: el componente sigue dentro de esa escena
const BgB: React.FC<{ id: string; tt: number; dim?: number }> = ({ id, tt, dim = 0.5 }) => <AbsoluteFill style={{ overflow: "hidden" }}>
  <Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(18px) brightness(${1 - dim})`, transform: `scale(${1.16 - 0.03 * cl(tt / 10)})` }} />
  <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(0,0,0,0), rgba(0,0,0,.5))" }} />
</AbsoluteFill>;
// llama: gotas naranjas desenfocadas que respiran lento (≤1,6 Hz, sin parpadeo)
const Flame: React.FC<{ tt: number; x: number; y: number; w: number; k?: number }> = ({ tt, x, y, w, k = 1 }) => <div style={{ position: "absolute", left: x, top: y, opacity: k }}>
  <div style={{ position: "absolute", left: -w * 0.6, top: -w * 0.16, width: w * 1.2, height: w * 0.3, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,150,50,.55), rgba(255,90,20,.18) 55%, transparent 72%)", filter: `blur(${w * 0.03}px)` }} />
  {Array.from({ length: 9 }, (_, i) => { const f = 0.7 + 0.25 * rnd(i, 9), s = 1 + 0.12 * Math.sin(tt * 2 * Math.PI * f + i * 1.7), hh = w * (0.22 + 0.2 * rnd(i, 8)) * s, ww = w * 0.085; return <div key={i} style={{ position: "absolute", left: (i - 4) * w * 0.1 - ww / 2 + Math.sin(tt * 1.4 + i) * 3, top: -hh, width: ww, height: hh, borderRadius: "50% 50% 40% 40% / 85% 85% 15% 15%", background: "linear-gradient(0deg, #3a6bff 0%, #ffd27a 22%, #ff8a20 60%, rgba(230,60,10,0) 100%)", filter: `blur(${w * 0.006}px)`, mixBlendMode: "screen", opacity: 0.85 }} />; })}
</div>;
// brasa: aro de calor alrededor de una sartén vista desde arriba
const Glow: React.FC<{ x: number; y: number; r: number; k: number }> = ({ x, y, r, k }) => <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", boxShadow: `0 0 ${140 * k}px ${34 * k}px rgba(255,110,30,${0.5 * k})` }} />;
// tiza que se escribe de izquierda a derecha
const Chalk: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; size?: number; dur?: number; col?: string }> = ({ tt, at, x, y, txt, size = 140, dur = 0.9, col = "rgba(245,245,238,.93)" }) => {
  const p = eio(tt, at, at + dur);
  if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontFamily: MARK, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`, textShadow: "0 0 3px rgba(255,255,255,.5), 0 0 1px #fff", filter: "url(#chalk)", letterSpacing: 2 }}>{txt}</div>;
};
// etiqueta de precio de cartón colgada de un hilo, que cae y se hamaca hasta quedar quieta
const PriceTag: React.FC<{ tt: number; at: number; x: number; y: number; txt: string }> = ({ tt, at, x, y, txt }) => {
  const s = phys(tt, at, 7, 0.5); if (s <= 0.01) return null;
  const sw = 16 * Math.exp(-1.6 * Math.max(0, tt - at)) * Math.sin(Math.max(0, tt - at) * 5.5);
  return <div style={{ position: "absolute", left: x, top: y - 210 * (1 - s), transformOrigin: "50% 0", transform: `rotate(${sw}deg)`, opacity: cl(s * 3) }}>
    <div style={{ position: "absolute", left: -1, top: 0, width: 2, height: 70, background: "rgba(240,230,210,.8)" }} />
    <div style={{ position: "absolute", left: -115, top: 66, width: 230, height: 120, borderRadius: "10px 10px 10px 10px", background: "linear-gradient(170deg,#efe0bd,#d8c191)", boxShadow: "0 16px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#3a2614" }}>
      <div style={{ position: "absolute", left: 107, top: 8, width: 14, height: 14, borderRadius: "50%", background: "#2a1d10" }} />{txt}</div>
  </div>;
};
const Sv = () => <svg width={0} height={0} style={{ position: "absolute" }}><filter id="chalk"><feTurbulence baseFrequency="0.9" numOctaves={2} seed={3} /><feDisplacementMap in="SourceGraphic" scale={4} /></filter></svg>;

// 1 · 0:05 · DESHIELO: el trineo de víveres se hunde en el barro real del camino
export const RMud: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const sink = eio(tt, 1.3, 5.0), wet = eio(tt, 6.3, 8.0);
  return <>
    <Bg id="bg_barro" tt={tt} dim={0.2} />
    {/* el sled entra tirado y se va hundiendo: lo que queda bajo la línea del barro se tapa */}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 720, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${(1 - eio(tt, 0, 1.3)) * 700}px, ${250 * sink}px) rotate(${-6 * sink}deg)`, transformOrigin: "60% 70%" }}>
        <Spr id="sp_sled" tt={tt} at={0} x={1000} y={560} w={880} from="none" shadow={0} />
      </div>
    </div>
    {/* barro: capa marrón espesa con brillo húmedo que crece cuando habla del suelo mojado */}
    <div style={{ position: "absolute", left: -40, top: 700, width: 2000, height: 420, borderRadius: "48% 52% 0 0 / 40px 40px 0 0", background: "linear-gradient(180deg,#5a4028 0%,#3a2817 30%,#24170c 100%)", boxShadow: "inset 0 14px 22px rgba(0,0,0,.45)" }}>
      {[260, 760, 1320, 1640].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: 40 + (i % 2) * 70, width: 260 + i * 30, height: 46, borderRadius: "50%", background: "linear-gradient(180deg, rgba(190,200,205,.55), rgba(90,100,105,.35))", opacity: 0.35 + 0.55 * wet, transform: `scaleX(${1 + 0.03 * Math.sin(tt * 0.9 + i)})` }} />)}
      {/* el barro que se levanta contra los patines */}
      <div style={{ position: "absolute", left: 640 + 700 * (1 - eio(tt, 0, 1.3)), top: -26 * sink, width: 760, height: 60, borderRadius: "50%", background: "#4a331f", filter: "blur(2px)" }} />
    </div>
    <Big tt={tt} at={1.4} x={960} y={170} txt="MUD SEASON" size={120} />
  </>;
}}</Stage>;

// 2 · 0:22 · UNA SARTÉN, TRES OFICIOS: se prende el fuego (estufa), baja la tapa (horno), se llena (plato), y el dólar
export const RJobs: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fire = eio(tt, 1.8, 2.4) * (1 - eio(tt, 4.2, 4.8) * 0.6), lid = phys(tt, 2.75, 7, 0.55) * (1 - eio(tt, 3.75, 4.2)), food = eio(tt, 3.9, 4.5);
  const w = ["STOVE", "OVEN", "PLATE"], cur = tt < 3.0 ? 0 : tt < 3.9 ? 1 : 2;
  return <>
    <Bg id="bg_estufa" tt={tt} dim={0.3} />
    <Flame tt={tt} x={900} y={640} w={980} k={fire} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 1 - food }}><Spr id="sp_skillet_34" tt={tt} at={0.2} x={900} y={600} w={780} /></div>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: food, transform: `perspective(1600px) rotateX(52deg) scale(${1.02 + 0.06 * food})`, transformOrigin: "900px 460px" }}><Spr id="sp_skillet_full10" tt={tt} at={3.9} x={900} y={420} w={720} from="none" shadow={0} /></div>
    {lid > 0.01 && <div style={{ position: "absolute", left: 0, top: (1 - lid) * -700 - 500 * eio(tt, 3.75, 4.2), width: 1920, height: 1080, opacity: cl(lid * 3) }}><Spr id="sp_lid" tt={tt} at={0} x={900} y={470} w={640} from="none" shadow={0} /></div>}
    {tt > 1.9 && tt < 7.6 && <Big key={cur} tt={tt} at={[2.0, 3.0, 3.9][cur]} x={1530} y={540} txt={w[cur]} size={110} col={[AMB, TX, TX][cur]} out={[2.9, 3.8, 7.4][cur]} />}
    <Big tt={tt} at={7.8} x={1530} y={540} txt="UNDER $1" size={130} col={AMB} />
  </>;
}}</Stage>;

// 3 · 0:39 · 7 × 3 = 21: veintiún platos de lata caen sobre la mesa de tablones, uno por comida
export const RGrid: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <>
  <Bg id="bg_mesa_top" tt={tt} dim={0.15} />
  {Array.from({ length: 21 }, (_, i) => { const c = i % 7, r = Math.floor(i / 7); return <Spr key={i} id="sp_tinplate" tt={tt} at={0.6 + i * 0.3} x={300 + c * 220 + (r % 2) * 18} y={300 + r * 250} w={200} rot={rnd(i) * 40 - 20} />; })}
  <AbsoluteFill style={{ background: `rgba(0,0,0,${0.45 * eio(tt, 8.6, 9.2)})` }} />
  <Big tt={tt} at={8.8} x={960} y={520} txt="21" size={330} col={AMB} out={10.5} />
  <Big tt={tt} at={11.3} x={960} y={520} txt="7 DAYS" size={200} />
</>}</Stage>;

// 4 · 0:57 · EL SOBRE DEL DÍA 6: el sello de bronce baja y deja el lacre con el 6 en relieve
export const RSeal: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const down = eio(tt, 2.2, 2.9) * (1 - eio(tt, 3.2, 3.9)), wax = phys(tt, 2.9, 9, 0.5);
  return <>
    <Bg id="bg_mesa_cabana" tt={tt} dim={0.3} />
    <Spr id="sp_envelope" tt={tt} at={0.4} x={960} y={600} w={1000} />
    {wax > 0.01 && <div style={{ position: "absolute", left: 960, top: 405, transform: `translate(-50%,-50%) scale(${1.25 - 0.25 * wax}, ${1.25 - 0.25 * wax})`, width: 240, height: 240, borderRadius: "47% 53% 50% 50%", background: "radial-gradient(circle at 40% 35%, #c23a2c, #8a1a14 55%, #5a0c0a)", boxShadow: "0 10px 24px rgba(0,0,0,.5), inset 0 -8px 16px rgba(0,0,0,.4), inset 0 6px 10px rgba(255,160,140,.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: cl(wax * 4) }}>
      <div style={{ width: 170, height: 170, borderRadius: "50%", boxShadow: "inset 0 4px 8px rgba(0,0,0,.55), inset 0 -3px 6px rgba(255,150,130,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MARK, fontSize: 120, color: "#7a1510", textShadow: "0 -2px 2px rgba(0,0,0,.6), 0 2px 2px rgba(255,150,130,.45)" }}>6</div>
    </div>}
    <div style={{ position: "absolute", left: 0, top: -1000 * (1 - down) - 40 * (1 - eio(tt, 0.8, 2.2)), width: 1920, height: 1080 }}><Spr id="sp_wax_stamp" tt={tt} at={0} x={960} y={170} w={190} from="none" shadow={0} /></div>
    <Big tt={tt} at={3.1} x={960} y={900} txt="DAY SIX" size={130} col={AMB} />
  </>;
}}</Stage>;

// 5 · 1:29 · CÓMO CUENTO: caja registradora antigua, entran los víveres y sale el ticket largo que se lee
export const RReceipt: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const L = [["OATS", ".20", 5.1], ["RICE", ".15", 5.9], ["MILK", ".10", 6.4], ["TOTAL", ".45", 8.4]] as const, rise = eio(tt, 5.0, 9.0);
  return <>
    <Bg id="bg_mostrador" tt={tt} dim={0.3} />
    <Spr id="sp_oats_jar" tt={tt} at={1.0} x={1360} y={760} w={300} />
    <Spr id="sp_rice_cup" tt={tt} at={1.6} x={1640} y={790} w={280} />
    {/* el ticket sale por arriba de la caja: papel con renglones impresos */}
    <div style={{ position: "absolute", left: 640, top: 440 - 400 * rise, width: 400, height: 40 + 400 * rise, transform: "translateX(-50%) rotate(-2deg)", background: "linear-gradient(90deg,#efe9da,#fbf8ef 50%,#e8e1cf)", boxShadow: "0 18px 30px rgba(0,0,0,.45)", overflow: "hidden", fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 46, color: "#2a2620", padding: "26px 30px", boxSizing: "border-box", clipPath: "polygon(0 0,100% 0,100% 100%,92% 98%,84% 100%,76% 98%,68% 100%,60% 98%,52% 100%,44% 98%,36% 100%,28% 98%,20% 100%,12% 98%,4% 100%,0 98%)" }}>
      {L.map(([a, b, at], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 26, opacity: cl((tt - at) * 4), borderTop: a === "TOTAL" ? "3px dashed #2a2620" : "none", paddingTop: a === "TOTAL" ? 16 : 0, fontSize: a === "TOTAL" ? 54 : 46 }}><span>{a}</span><span>{b}</span></div>)}
    </div>
    <Spr id="sp_register" tt={tt} at={0.2} x={640} y={720} w={620} />
    <Big tt={tt} at={7.6} x={1380} y={300} txt="STORE PRICES" size={96} />
  </>;
}}</Stage>;

// 6 · 1:46 · LOS PRECIOS: cada ingrediente real cae al mostrador y le cuelga su etiqueta justo cuando lo nombra
export const RFlap: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <>
  <BgB id="n_huevos_carton" tt={tt} />
  {([["sp_eggs3", 0.3, 330, "28¢"], ["sp_potato", 4.2, 760, "40¢"], ["sp_onion", 6.6, 1170, "30¢"], ["sp_cornmeal_cup", 8.9, 1580, "15¢"]] as const).map(([id, at, x, p], i) => <React.Fragment key={id}>
    <Spr id={id} tt={tt} at={at} x={x} y={720} w={i === 0 ? 440 : 390} />
    <PriceTag tt={tt} at={at + 0.35} x={x} y={250} txt={p} />
  </React.Fragment>)}
</>}</Stage>;

// 7 · 2:21 · POR QUÉ HIERRO: la lupa recorre el hierro y los poros se llenan de aceite brillante (el curado)
export const RMicro: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 65% at 50% 50%, #2a2219, #070605 75%)">{(tt) => {
  const lx = 760 + 260 * Math.sin(tt * 0.32), ly = 540 + 80 * Math.sin(tt * 0.45 + 1), fill = eio(tt, 3.0, 7.4);
  return <>
    <Spr id="sp_iron_macro" tt={tt} at={0.1} x={960} y={540} w={1000} from="none" />
    {/* adentro de la lupa: el hierro aumentado con sus poros que se llenan */}
    <div style={{ position: "absolute", left: lx - 260, top: ly - 260, width: 520, height: 520, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 16px #8a6a32, 0 0 0 22px #4a3416, 0 40px 80px rgba(0,0,0,.7)" }}>
      <Img src={img("iron_macro_full")} style={{ position: "absolute", left: -(lx - 260) * 2.4 - 400, top: -(ly - 260) * 2.4 - 300, width: 1920 * 2.4, height: 1080 * 2.4, objectFit: "cover", filter: "brightness(.9) contrast(1.1)" }} />
      {Array.from({ length: 16 }, (_, i) => { const x = 40 + rnd(i, 4) * 440, y = 40 + rnd(i, 5) * 440, r = 26 + rnd(i, 6) * 30, f = cl(fill * 1.6 - rnd(i, 7) * 0.6); return <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #050505, #151515 70%)", boxShadow: "inset 0 6px 10px rgba(0,0,0,.9), 0 2px 0 rgba(255,255,255,.08)" }}>
        <div style={{ position: "absolute", inset: r * (1 - f), borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, rgba(255,230,160,.95), rgba(200,140,40,.85) 45%, rgba(90,50,10,.9))", boxShadow: "0 0 10px rgba(255,200,90,.5)" }} />
      </div>; })}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(ellipse 50% 30% at 32% 22%, rgba(255,255,255,.28), transparent 70%)" }} />
    </div>
    <div style={{ position: "absolute", left: lx + 180, top: ly + 180, width: 70, height: 300, borderRadius: 30, background: "linear-gradient(90deg,#5a3a1c,#8a5c2e,#4a2c12)", transform: "rotate(-40deg)", transformOrigin: "50% 0", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
    <Big tt={tt} at={7.2} x={1460} y={880} txt="SEASONED" size={120} col={AMB} />
  </>;
}}</Stage>;

// 8 · 2:37 · CADENA DE COMIDAS: los platos reales pasan en fila unidos por una cuerda; cada uno lleva al siguiente
export const RChain: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = ["sp_food_oat", "sp_food_hash", "sp_food_pancake", "sp_food_haluski"], sh = -520 * eio(tt, 2.0, 11.0);
  const pos = D.map((_, i) => { const x = 380 + i * 440 + sh, y = 560 + 90 * Math.sin((x / 1920) * Math.PI * 1.6); return [x, y]; });
  return <>
    <BgB id="n_sobras_bowl" tt={tt} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {pos.slice(1).map(([x, y], i) => { const [x0, y0] = pos[i], p = eio(tt, 1.1 + i * 0.45, 1.6 + i * 0.45); return <path key={i} d={`M${x0} ${y0} Q${(x0 + x) / 2} ${(y0 + y) / 2 + 90} ${x0 + (x - x0) * p} ${y0 + (y - y0) * p}`} stroke="#c8a36a" strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="2 22" />; })}
    </svg>
    {D.map((id, i) => <Spr key={id} id={id} tt={tt} at={0.4 + i * 0.45} x={pos[i][0]} y={pos[i][1]} w={380} />)}
    <Big tt={tt} at={1.3} x={960} y={190} txt="NOTHING GOES TO WASTE" size={88} out={7.0} />
    <Big tt={tt} at={7.6} x={960} y={190} txt="DAY 1 · FRIED OATMEAL" size={88} col={AMB} />
  </>;
}}</Stage>;

// 9 · 3:26 · PAPA EN CUBOS: la papa grande se parte en cubitos que saltan a la sartén caliente
export const RCubes: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const cut = eio(tt, 10.1, 10.5), jump = eio(tt, 11.1, 12.2);
  return <>
    <BgB id="n_big_swede" tt={tt} />
    <Spr id="sp_skillet_top" tt={tt} at={0.3} x={1260} y={560} w={900} />
    <Steam tt={tt} x={1300} y={420} w={180} k={0.6 * eio(tt, 1, 3)} />
    <Spr id="sp_potato_chunk" tt={tt} at={3.5} x={520} y={640} w={500} op={1 - cut} rot={-8 + 8 * eio(tt, 9.1, 9.6)} />
    <Spr id="sp_potato_cubes" tt={tt} at={10.1} x={520 + 720 * jump} y={640 - 300 * Math.sin(jump * Math.PI) - 60 * jump} w={440 - 60 * jump} from="none" />
    {Array.from({ length: 9 }, (_, i) => { const p = cl(jump * 1.4 - i * 0.05); return cut > 0 && <Spr key={i} id="sp_potato_cubes" tt={tt} at={10.15} x={560 + (rnd(i, 2) - 0.5) * 260 + (740 + rnd(i) * 120 - (rnd(i, 2) - 0.5) * 260) * p} y={640 + (rnd(i, 3) - 0.5) * 80 - 300 * Math.sin(p * Math.PI) - 40 * p} w={95} rot={i * 40 + tt * 200 * (1 - p)} from="none" shadow={0.5} />; })}
  </>;
}}</Stage>;

// 10 · 4:01 · REMOJO: el bol de porotos secos al lado del remojado que crece hasta el doble
export const RSwell: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const g = eio(tt, 5.6, 8.4);
  return <>
    <BgB id="f_porotos_domingo" tt={tt} />
    <Spr id="sp_beans_dry" tt={tt} at={1.9} x={560} y={680} w={400} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${0.62 + 0.78 * g})`, transformOrigin: "1320px 860px" }}><Spr id="sp_beans_soaked" tt={tt} at={5.9} x={1320} y={680} w={400} /></div>
    <Big tt={tt} at={8.4} x={960} y={200} txt="×2" size={220} col={AMB} />
  </>;
}}</Stage>;

// 11 · 4:35 · LA MANO SOBRE LA SARTÉN: la mano baja sobre el hierro caliente y cuenta 1, 2, 3 con el aire que tiembla
export const RPalm: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 60%, #2a1a10, #070605 75%)">{(tt) => {
  const hd = eio(tt, 3.4, 4.6), heat = eio(tt, 0.4, 3);
  return <>
    <Glow x={860} y={600} r={330} k={heat} />
    <Spr id="sp_skillet_drops" tt={tt} at={0.3} x={860} y={600} w={900} />
    {/* aire caliente que tiembla sobre el hierro */}
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 700 + i * 180, top: 300, width: 160, height: 300, borderRadius: "50%", background: "rgba(255,200,150,.06)", filter: "blur(16px)", transform: `translateY(${-((tt * 40 + i * 70) % 140)}px) scaleX(${1 + 0.2 * Math.sin(tt * 3 + i)})`, opacity: heat }} />)}
    <div style={{ position: "absolute", left: 900 * (1 - hd), top: 0, width: 1920, height: 1080 }}><Spr id="sp_hand" tt={tt} at={0} x={1180} y={420} w={520} from="none" shadow={0} rot={-90} /></div>
    {["1", "2", "3"].map((n, i) => <Big key={n} tt={tt} at={5.2 + i * 1.0} x={1640} y={760} txt={n} size={240} col={i === 2 ? AMB : TX} out={i < 2 ? 5.2 + i * 1.0 + 0.85 : 99} />)}
    <Big tt={tt} at={8.3} x={1640} y={300} txt="HOT" size={200} col={RED} />
  </>;
}}</Stage>;

// 12 · 4:51 · FRÍA O CALIENTE: dos sartenes inclinadas; en la fría el huevo queda pegado, en la caliente resbala
export const RSlide: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const tilt = eio(tt, 3.0, 4.4), sl = eio(tt, 3.6, 6.0);
  return <>
    <BgB id="n_huevo_resbala" tt={tt} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `rotate(${-14 * tilt}deg)`, transformOrigin: "520px 600px" }}>
      <Spr id="sp_skillet_tilt" tt={tt} at={0.3} x={520} y={600} w={640} />
      <Spr id="sp_egg_stuck" tt={tt} at={1.2} x={520} y={560} w={300} />
    </div>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `rotate(${14 * tilt}deg)`, transformOrigin: "1400px 600px" }}>
      <Spr id="sp_skillet_tilt" tt={tt} at={0.6} x={1400} y={600} w={640} flip />
      <Spr id="sp_egg_fried" tt={tt} at={1.5} x={1400 + 230 * sl} y={560 + 120 * sl} w={280} rot={50 * sl} />
    </div>
    <Steam tt={tt} x={1400} y={460} w={150} k={0.7} />
    <Big tt={tt} at={1.4} x={520} y={190} txt="COLD" size={120} col={ICE} />
    <Big tt={tt} at={2.2} x={1400} y={190} txt="HOT" size={120} col={AMB} />
  </>;
}}</Stage>;

// 13 · 5:09 · SEIS PANQUEQUES: saltan de a uno dando vuelta en el aire, se apilan, y el repasador tapa los tres de guardar
export const RFlip: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const towel = phys(tt, 10.3, 7, 0.55);
  return <>
    <BgB id="n_masa_grumos" tt={tt} />
    {Array.from({ length: 6 }, (_, i) => { const a = 2.2 + i * 1.05, p = eio(tt, a, a + 0.9), left = i < 3, x = left ? 640 : 1280, y = 760 - (i % 3) * 46; if (tt < a - 0.6) return null; return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${(x - 960) * p}px, ${(y - 640) * p - 420 * Math.sin(p * Math.PI)}px)`, transformOrigin: "960px 640px" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `rotateX(${360 * p}deg) scaleY(.62)`, transformOrigin: "960px 640px" }}><Spr id="sp_pancake" tt={tt} at={a - 0.6} x={960} y={640} w={360} from="up" shadow={0} /></div>
    </div>; })}
    {towel > 0.01 && <div style={{ position: "absolute", left: 0, top: -500 * (1 - towel), width: 1920, height: 1080, opacity: cl(towel * 3) }}><Spr id="sp_towel" tt={tt} at={0} x={1280} y={760} w={560} from="none" /></div>}
    <Big tt={tt} at={7.8} x={960} y={190} txt="FLIP" size={130} col={AMB} out={9.9} />
    <Big tt={tt} at={10.1} x={960} y={190} txt="SIX PANCAKES" size={110} />
  </>;
}}</Stage>;

// 14 · 5:57 · EL COCINERO DEL FERROCARRIL: la foto del tren sigue con paralaje, caen las cartas del domingo y el bol de arroz frío
export const RRail: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fr = eio(tt, 3.4, 4.4);
  return <>
    <AbsoluteFill style={{ overflow: "hidden" }}><Img src={img("n_tren_campamento")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(1.18) translateX(${-30 * tt}px)`, filter: "brightness(.62)" }} /></AbsoluteFill>
    <Spr id="sp_cards" tt={tt} at={1.4} x={520} y={780} w={420} rot={-12} />
    <Spr id="sp_rice_bowl" tt={tt} at={3.3} x={1340} y={720} w={460} />
    {/* escarcha y aliento frío alrededor del bol */}
    <div style={{ position: "absolute", left: 1340 - 300, top: 470, width: 600, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(190,225,255,.35), transparent 70%)", filter: "blur(22px)", opacity: fr }} />
    <Steam tt={tt} x={1340} y={560} w={140} k={0.5 * fr} />
    <Big tt={tt} at={3.6} x={1340} y={260} txt="COLD RICE" size={120} col={ICE} />
  </>;
}}</Stage>;

// 15 · 6:13 · FRITO FUERTE: el arroz real salta en la sartén, grano por grano, hasta que cruje
export const RToss: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 70% 60% at 50% 60%, #2a1a10, #070605 75%)">{(tt) => {
  const toss = (k: number) => Math.max(0, Math.sin(((tt - 2.8) * 1.3 + k) * Math.PI)) * eio(tt, 2.6, 3.2);
  return <>
    <Glow x={960} y={640} r={360} k={eio(tt, 0, 1.2)} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${-40 * toss(0)}px) rotate(${-4 * toss(0)}deg)`, transformOrigin: "960px 700px" }}>
      <Spr id="sp_rice_pan" tt={tt} at={0.3} x={960} y={640} w={820} />
    </div>
    {Array.from({ length: 70 }, (_, i) => { const ph = ((tt - 2.8) * 1.3 + rnd(i) * 0.9) % 1; if (tt < 2.8) return null; const x = 960 + (rnd(i, 2) - 0.5) * 520 + (rnd(i, 3) - 0.5) * 200 * ph, y = 600 - 380 * Math.sin(ph * Math.PI) * (0.5 + rnd(i, 4)); return <div key={i} style={{ position: "absolute", left: x, top: y, width: 24, height: 10, borderRadius: 5, background: rnd(i, 5) > 0.8 ? "#e8c26a" : "#f6efe0", transform: `rotate(${ph * 720 + i * 30}deg)`, boxShadow: "0 3px 4px rgba(0,0,0,.4)" }} />; })}
    <Big tt={tt} at={3.2} x={960} y={170} txt="FRY IT HARD" size={110} col={AMB} out={8.4} />
    <Big tt={tt} at={8.8} x={960} y={170} txt="ONE EGG IN" size={110} />
  </>;
}}</Stage>;

// 16 · 6:31 · UNA CUCHARA: de la cuchara cae una sola gota a la sartén; al lado, lo que hace el exceso: panqueque grasoso
export const RSpoon: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const dp = eio(tt, 3.9, 4.5), sp = phys(tt, 4.5, 8, 0.4);
  return <>
    <BgB id="f_una_cuchara" tt={tt} />
    <Spr id="sp_skillet_oil" tt={tt} at={0.4} x={560} y={680} w={640} />
    <div style={{ position: "absolute", left: 0, top: -400 * (1 - eio(tt, 0.8, 2.0)), width: 1920, height: 1080 }}><Spr id="sp_spoon_wood" tt={tt} at={0} x={720} y={380} w={620} from="none" shadow={0} rot={-14} /></div>
    {dp > 0 && dp < 1 && <div style={{ position: "absolute", left: 548, top: 400 + 260 * dp * dp, width: 34, height: 44, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: "radial-gradient(circle at 40% 35%, #fff6d8, #e8b84e)", boxShadow: "0 0 10px rgba(255,210,110,.6)" }} />}
    {sp > 0.01 && <div style={{ position: "absolute", left: 560 - 120 * sp, top: 680 - 30 * sp, width: 240 * sp, height: 60 * sp, borderRadius: "50%", border: `3px solid rgba(255,220,140,${0.7 * (1 - eio(tt, 4.8, 5.6))})` }} />}
    <Big tt={tt} at={3.8} x={560} y={160} txt="ONE SPOON" size={100} col={AMB} />
    <Spr id="sp_pancake_greasy" tt={tt} at={5.3} x={1380} y={660} w={600} from="right" />
    <Big tt={tt} at={7.4} x={1380} y={180} txt="GREASY" size={100} col={RED} />
  </>;
}}</Stage>;

// 17 · 7:37 · LA POLENTA VINO DE ITALIA: la bolsa de harina de maíz llega en arco desde el mar y se vuelca en la olla
export const RItaly: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 75% 65% at 55% 60%, #3a2a18, #0a0806 75%)">{(tt) => {
  const p = eio(tt, 0.4, 3.6), x = -200 + 1060 * p, y = 520 - 300 * Math.sin(p * Math.PI) , tip = eio(tt, 7.0, 7.6);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: 0.6 * (1 - eio(tt, 4, 6)) }}><path d={`M-200 520 Q330 -80 ${x} ${y}`} stroke="#e8d3a0" strokeWidth={6} fill="none" strokeDasharray="4 26" strokeLinecap="round" /></svg>
    <Spr id="sp_polenta_pot" tt={tt} at={4.4} x={1160} y={740} w={560} />
    <Pour tt={tt} at={7.5} out={9.4} x={1120} y1={460} y2={690} col="rgba(240,190,60,.95)" w={26} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${x - 860 + 250 * tip}px, ${y - 520 - 150 * tip}px) rotate(${p * 360 * 0 + 110 * tip}deg)`, transformOrigin: "860px 520px" }}><Spr id="sp_sack_cornmeal" tt={tt} at={0} x={860} y={520} w={340} from="none" shadow={0} /></div>
    <Big tt={tt} at={9.1} x={760} y={190} txt="FROM ITALY" size={120} col={AMB} />
  </>;
}}</Stage>;

// 18 · 8:25 · DALES ESPACIO: sartén apretada que hierve en vapor contra la sartén con lugar que dora
export const RCrowd: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <>
  <BgB id="n_sarten_lleno_vapor" tt={tt} />
  <Spr id="sp_pot_crowded" tt={tt} at={0.3} x={560} y={620} w={680} />
  <Steam tt={tt} x={560} y={430} w={260} k={1.2} />
  <Steam tt={tt + 2} x={480} y={460} w={200} k={0.9} />
  <Spr id="sp_pot_room" tt={tt} at={3.0} x={1360} y={620} w={680} />
  {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 1.2 + rnd(i)) % 1; return tt > 3.4 && <div key={i} style={{ position: "absolute", left: 1360 + (rnd(i, 2) - 0.5) * 420, top: 600 + (rnd(i, 3) - 0.5) * 300 - 50 * ph, width: 6, height: 6, borderRadius: "50%", background: "#ffe2a0", opacity: Math.sin(ph * Math.PI) * 0.8, boxShadow: "0 0 8px #ffc060" }} />; })}
  <Big tt={tt} at={0.6} x={560} y={170} txt="STEAMS" size={100} col={ICE} />
  <Big tt={tt} at={4.1} x={1360} y={170} txt="ROOM = CRISP" size={100} col={AMB} />
</>}</Stage>;

// 19 · 9:00 · UN CUARTO: el cuchillo corta las monedas de salchicha; el resto se envuelve en papel de carnicero
export const RWrap: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = eio(tt, 0.2, 0.7) * (1 - eio(tt, 1.6, 2.2)), cut = eio(tt, 0.6, 1.0), wr = eio(tt, 4.3, 5.0);
  return <>
    <BgB id="f_corta_salchicha" tt={tt} />
    <Spr id="sp_sausage" tt={tt} at={0.0} x={1200} y={620} w={620} op={1 - wr} />
    <Spr id="sp_paper_bundle" tt={tt} at={4.4} x={1200} y={640} w={520} />
    <Spr id="sp_sausage_coins" tt={tt} at={0.9} x={560} y={660} w={460} from="left" />
    <div style={{ position: "absolute", left: 0, top: -500 + 520 * k, width: 1920, height: 1080, opacity: k > 0.01 ? 1 : 0 }}><Spr id="sp_knife" tt={tt} at={0} x={880} y={360} w={260} from="none" shadow={0} rot={8} /></div>
    {cut > 0 && cut < 1 && <div style={{ position: "absolute", left: 870, top: 470, width: 6, height: 300, background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.8), rgba(255,255,255,0))", opacity: Math.sin(cut * Math.PI) }} />}
    <Big tt={tt} at={2.4} x={560} y={200} txt="¼" size={220} col={AMB} />
    <Big tt={tt} at={5.0} x={1200} y={200} txt="FOR LATER" size={100} />
  </>;
}}</Stage>;

// 20 · 10:05 · LA LATA DE GRASA: la lata roja recibe el chorro después de cada fritura y se le anotan las rayitas
export const RGreaseCan: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const n = Math.floor(cl((tt - 7.2) / 2.6) * 7);
  return <>
    <BgB id="f_lata_grasa" tt={tt} />
    <Spr id="sp_coffee_can" tt={tt} at={2.0} x={960} y={640} w={560} />
    <Pour tt={tt} at={6.2} out={8.2} x={960} y1={0} y2={420} col="rgba(236,214,160,.95)" w={34} />
    {Array.from({ length: n }, (_, i) => { const cross = i === 4, x = cross ? 845 : 800 + (i > 4 ? i * 34 + 40 : i * 34); return <div key={i} style={{ position: "absolute", left: x, top: cross ? 730 : 700, width: cross ? 170 : 9, height: cross ? 9 : 110, borderRadius: 5, background: "rgba(30,20,12,.88)", transform: `rotate(${cross ? -24 : -4 + rnd(i) * 6}deg)`, boxShadow: "0 1px 0 rgba(255,255,255,.12)" }} />; })}
    <Big tt={tt} at={7.2} x={960} y={190} txt="EVERY TIME" size={110} col={AMB} />
  </>;
}}</Stage>;

// 21 · 10:37 · LA PAPA APLASTADA: la taza de enlozado baja sobre la papa hervida hasta que se raja
export const RSmash: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const dn = eio(tt, 5.9, 6.6), pr = eio(tt, 6.6, 8.9), up = eio(tt, 9.0, 9.7), sm = eio(tt, 8.7, 9.1);
  return <>
    <BgB id="n_papa_hervida" tt={tt} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${1 + 0.25 * pr}, ${1 - 0.35 * pr})`, transformOrigin: "960px 860px" }}><Spr id="sp_potato_boiled" tt={tt} at={1.8} x={960} y={700} w={480} op={1 - sm} /></div>
    <Spr id="sp_potato_smashed" tt={tt} at={8.8} x={960} y={700} w={700} from="none" />
    <div style={{ position: "absolute", left: 0, top: -700 * (1 - dn) + 120 * pr - 760 * up, width: 1920, height: 1080 }}><Spr id="sp_cup_enamel" tt={tt} at={0} x={960} y={380} w={360} from="none" shadow={0} /></div>
    <Big tt={tt} at={9.0} x={960} y={180} txt="CRACKS OPEN" size={110} col={AMB} />
  </>;
}}</Stage>;

// 22 · 11:26 · PIEROGI VAGO: cebolla en la sartén, y caen la papa y los fideos; todo junto
export const RPierogi: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <>
  <BgB id="n_cebolla_caramelo" tt={tt} />
  <Spr id="sp_skillet_onion" tt={tt} at={0.2} x={960} y={640} w={820} />
  <Steam tt={tt} x={960} y={460} w={220} k={eio(tt, 1, 3) * 0.8} />
  <Spr id="sp_noodles" tt={tt} at={10.0} x={900} y={620} w={420} />
  <Big tt={tt} at={1.6} x={960} y={170} txt="LOW AND SLOW" size={100} out={9.4} />
  <Big tt={tt} at={11.5} x={960} y={170} txt="ALL TOGETHER" size={110} col={AMB} />
</>}</Stage>;

// 23 · 11:44 · LA CEBOLLA: fuego chico y dorada a un lado; llamarada y quemada del otro
export const RBurn: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <>
  <BgB id="n_crema_agria" tt={tt} dim={0.6} />
  <Glow x={1380} y={640} r={290} k={0.45 * eio(tt, 3.6, 4.4)} />
  <Glow x={540} y={640} r={290} k={1.3 * eio(tt, 6.2, 7.0)} />
  <Spr id="sp_onion_golden" tt={tt} at={0.4} x={1380} y={640} w={620} />
  <Spr id="sp_onion_burnt" tt={tt} at={0.9} x={540} y={640} w={620} />
  {tt > 8.2 && [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 420 + i * 100, top: 420 - ((tt * 50 + i * 60) % 220), width: 140, height: 200, borderRadius: "50%", background: "rgba(40,36,32,.5)", filter: "blur(22px)" }} />)}
  <Big tt={tt} at={3.9} x={1380} y={170} txt="LOW & SLOW" size={100} col={AMB} />
  <Big tt={tt} at={7.4} x={540} y={170} txt="HOT & FAST" size={100} col={RED} />
</>}</Stage>;

// 24 · 12:32 · ARVID Y SU ABUELA: la foto sepia de la abuela y la postal de su pueblo caen sobre la mesa
export const RPostcard: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  <BgB id="n_arvid_joven" tt={tt} />
  <Spr id="sp_grandma_photo" tt={tt} at={1.5} x={720} y={560} w={560} rot={-7} />
  <Spr id="sp_postcard" tt={tt} at={2.4} x={1260} y={600} w={700} rot={5} />
  <Big tt={tt} at={2.5} x={960} y={150} txt="SLOVAK GRANDMOTHER" size={96} col={AMB} />
</>}</Stage>;

// 25 · 13:03 · EL REPOLLO SE ACHICA: la montaña cruda baja a la mitad; queda la marca de dónde llegaba
export const RShrink: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = eio(tt, 8.8, 10.6);
  return <>
    <BgB id="n_manteca_sarten" tt={tt} />
    <Spr id="sp_cabbage_pile" tt={tt} at={0.4} x={960} y={620} w={800} op={1 - s} />
    <Spr id="sp_cabbage_soft" tt={tt} at={8.8} x={960} y={640} w={760} from="none" op={s} />
    <div style={{ position: "absolute", left: 520, top: 270, width: 880, height: 0, borderTop: "5px dashed rgba(255,240,210,.8)", opacity: eio(tt, 9.0, 9.6) }} />
    <Big tt={tt} at={10.0} x={960} y={160} txt="HALF" size={150} col={AMB} />
  </>;
}}</Stage>;

// 26 · 13:51 · 80 CENTAVOS Y EL VOTO DE LA CUADRILLA: el precio y una pila de platos que crece con cada voto
export const RTally: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const n = Math.floor(cl((tt - 9.6) / 1.4) * 4);
  return <>
    <BgB id="n_resto_salchicha" tt={tt} />
    <Big tt={tt} at={6.6} x={620} y={520} txt="80¢" size={280} col={AMB} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>{Array.from({ length: n + 1 }, (_, i) => <Spr key={i} id="sp_plate_stack" tt={tt} at={i === 0 ? 0.6 : 9.6 + (i - 1) * 0.35} x={1380} y={760 - i * 120} w={460} shadow={i === 0 ? 1 : 0} />)}</div>
    <Big tt={tt} at={9.8} x={1380} y={150} txt="THE CREW VOTED" size={96} />
  </>;
}}</Stage>;

// 27 · 14:37 · TOSTADA FRANCESA: el pan duro golpea la mesa, se moja en el huevo y sale dorado
export const RBread: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const dip = eio(tt, 8.7, 9.3) * (1 - eio(tt, 9.5, 9.9)), done = eio(tt, 9.5, 9.9);
  return <>
    <BgB id="n_pan_viejo" tt={tt} />
    <Spr id="sp_egg_bowl" tt={tt} at={8.1} x={1360} y={720} w={560} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${700 * dip}px, ${90 * dip}px) rotate(${-25 * dip}deg)`, transformOrigin: "660px 620px", opacity: 1 - done }}><Spr id="sp_bread_hard" tt={tt} at={4.4} x={660} y={620} w={600} /></div>
    <Spr id="sp_french_toast" tt={tt} at={9.5} x={660} y={640} w={640} from="none" op={done} />
    <Big tt={tt} at={7.9} x={660} y={190} txt="DON'T" size={150} col={RED} out={9.3} />
    <Big tt={tt} at={9.7} x={760} y={190} txt="FRENCH TOAST" size={110} col={AMB} />
  </>;
}}</Stage>;

// 28 · 15:44 · LA CENA DE LIMPIEZA: los cuatro frascos de sobras se vuelcan juntos en la sartén
export const RCleanout: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const J = ["sp_jar_rice", "sp_jar_cabbage", "sp_jar_potato", "sp_jar_beans"], full = eio(tt, 1.4, 3.0);
  return <>
    <BgB id="n_todo_sarten" tt={tt} />
    <Spr id="sp_cleanout_pan" tt={tt} at={0.2} x={960} y={740} w={640} />
    {J.map((id, i) => { const x = 420 + i * 360, tilt = eio(tt, 0.9 + i * 0.25, 1.4 + i * 0.25) * (1 - eio(tt, 2.8, 3.4)); return <React.Fragment key={id}>
      <Pour tt={tt} at={1.3 + i * 0.25} out={2.8} x={x + (960 - x) * 0.55} y1={330} y2={640} col="rgba(230,210,170,.9)" w={18} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${(960 - x) * 0.45 * tilt}px, ${-40 * tilt}px) rotate(${(x < 960 ? 1 : -1) * 120 * tilt}deg)`, transformOrigin: `${x}px 260px` }}><Spr id={id} tt={tt} at={0.3 + i * 0.15} x={x} y={260} w={220} shadow={0} /></div>
    </React.Fragment>; })}
    {full > 0.5 && <Steam tt={tt} x={960} y={580} w={200} k={0.7} />}
    <Odo tt={tt} at={6.6} dur={1.0} to={0.6} x={1580} y={760} pre="$" size={100} />
  </>;
}}</Stage>;

// 29 · 16:35 · LA CUENTA DE LA SEMANA: en el pizarrón real, a tiza: diez u once dólares, cincuenta centavos la comida
export const RChalk: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const cx = tt < 3.0 ? 330 + 120 * eio(tt, 1.2, 1.8) : tt < 6.3 ? 400 + 300 * eio(tt, 3.3, 3.9) : tt < 9.6 ? 620 + 560 * eio(tt, 6.3, 7.4) : 620 + 700 * eio(tt, 9.7, 10.9), cy = tt < 3.0 ? 270 : tt < 6.3 ? 380 : tt < 9.6 ? 470 : 720;
  return <>
    <Bg id="bg_pizarra" tt={tt} dim={0.05} z={1.1} />
    <Sv />
    <Chalk tt={tt} at={1.2} x={330} y={250} txt="15¢" size={110} dur={0.6} />
    <Chalk tt={tt} at={3.3} x={330} y={360} txt="+ ..." size={90} dur={0.6} />
    <Chalk tt={tt} at={6.3} x={1000} y={440} txt="$10 – 11" size={230} dur={1.1} />
    <Chalk tt={tt} at={7.6} x={1410} y={560} txt="a week" size={80} dur={0.6} />
    <Chalk tt={tt} at={9.7} x={960} y={740} txt="50¢ A MEAL" size={150} dur={1.2} col="rgba(255,214,120,.95)" />
    {tt > 0.9 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${cx - 960}px, ${cy - 560 + 8 * Math.sin(tt * 9)}px)` }}><Spr id="sp_chalk" tt={tt} at={0.9} x={960} y={560} w={80} from="up" shadow={0} rot={35} /></div>}
  </>;
}}</Stage>;

// 30 · 17:28 · LA LISTA ENTERA: la bolsa de harina, la papa en bolsa grande contra la cajita chica de arroz
export const RBagBox: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <>
  <BgB id="n_trineo_carga" tt={tt} />
  <Spr id="sp_rice_bag" tt={tt} at={4.4} x={420} y={640} w={340} style={{ filter: "sepia(.35) brightness(.92) drop-shadow(0 18px 22px rgba(0,0,0,.45))" }} />
  <Spr id="sp_sack_flour" tt={tt} at={8.5} x={1000} y={640} w={420} />
  <Spr id="sp_sack_potato" tt={tt} at={9.9} x={1300} y={660} w={440} />
  <Spr id="sp_rice_box" tt={tt} at={5.6} x={700} y={800} w={200} />
  <Big tt={tt} at={7.1} x={960} y={170} txt="ONE LIST" size={130} col={AMB} />
</>}</Stage>;

// 31 · 18:01 · COCINÁ UNA VEZ, COMÉ TRES: la olla de porotos se reparte en tres platos que salen en abanico
export const RThree: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fan = eio(tt, 9.0, 10.4), D = [["sp_food_beans", -520, 60], ["sp_bean_cakes", 0, 200], ["sp_bean_soup", 520, 60]] as const;
  return <>
    <BgB id="n_lars_teamster" tt={tt} />
    <Spr id="sp_bean_pot" tt={tt} at={0.5} x={960} y={600 - 230 * fan} w={640 - 280 * fan} />
    <Steam tt={tt} x={960} y={420 - 230 * fan} w={200} k={0.8 * (1 - fan)} />
    {D.map(([id, dx, dy], i) => <div key={id} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${dx * fan}px, ${(dy + 160) * fan}px) scale(${0.3 + 0.7 * fan})`, transformOrigin: "960px 560px", opacity: cl(fan * 4) }}><Spr id={id} tt={tt} at={9.0} x={960} y={560} w={380} from="none" /></div>)}
    <Big tt={tt} at={8.4} x={960} y={150} txt="COOK ONCE" size={110} out={9.6} />
    <Big tt={tt} at={9.8} x={960} y={150} txt="EAT THREE TIMES" size={110} col={AMB} />
  </>;
}}</Stage>;

// 32 · 19:19 · UN SOLO FUEGO: la misma sartén sobre la misma llama recibe papa, después cebolla, después huevo
export const ROneFire: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 62%, #2a1a10, #060504 75%)">{(tt) => {
  const S2 = [["sp_of_potatoes", 4.0, 5.5], ["sp_of_onions", 5.6, 8.4], ["sp_of_eggs", 8.4, 99]] as const;
  return <>
    <Flame tt={tt} x={960} y={660} w={620} k={eio(tt, 0.3, 1.2)} />
    <Spr id="sp_skillet_side" tt={tt} at={0.4} x={960} y={720} w={900} />
    {/* lo que se cocina va acostado sobre el fondo de la sartén (en perspectiva), no flotando */}
    {S2.map(([id, a, b]) => <div key={id} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "perspective(1400px) rotateX(64deg)", transformOrigin: "930px 400px" }}><Spr id={id} tt={tt} at={a} x={930} y={400} w={420} op={1 - eio(tt, b, b + 0.4)} shadow={0} /></div>)}
    <Steam tt={tt} x={960} y={330} w={200} k={0.7 * eio(tt, 4, 5)} />
    <Big tt={tt} at={9.8} x={960} y={170} txt="ONE FIRE" size={140} col={AMB} />
  </>;
}}</Stage>;

// 33 · 20:09 · FAMILIA DE CUATRO: caen cuatro platos y el contador mecánico multiplica
export const RFamily: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 70% 60% at 50% 55%, #2a2016, #080706 75%)">{(tt) => <>
  {[0, 1, 2, 3].map((i) => <Spr key={i} id="sp_plate_white" tt={tt} at={i === 0 ? 0.5 : 6.6 + i * 0.22} x={390 + i * 380} y={720} w={330} rot={i * 25} />)}
  <Big tt={tt} at={7.4} x={560} y={300} txt="×4" size={220} col={AMB} />
  <Odo tt={tt} at={8.3} dur={1.4} to={2.0} x={1320} y={300} pre="$" size={110} />
  <Big tt={tt} at={9.6} x={960} y={970} txt="STILL WORKS" size={90} />
</>}</Stage>;

// 34 · 20:26 · LA SARTÉN DE 10 PULGADAS: la cinta se estira de borde a borde y alcanza justo para uno
export const RSize: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 70% 60% at 50% 55%, #241c14, #070605 75%)">{(tt) => {
  const ext = eio(tt, 1.9, 2.9);
  return <>
    <Spr id="sp_skillet_big" tt={tt} at={0.3} x={960} y={600} w={860} />
    <div style={{ position: "absolute", left: 600, top: 560, width: 720 * ext, height: 80, overflow: "hidden" }}><Img src={spr("sp_tape")} style={{ position: "absolute", left: 0, top: 0, width: 720, height: 80, objectFit: "cover" }} /></div>
    <Big tt={tt} at={2.3} x={960} y={190} txt={'10"'} size={180} col={AMB} out={3.5} />
    <Big tt={tt} at={4.1} x={960} y={190} txt="PERFECT FOR ONE" size={110} />
  </>;
}}</Stage>;

// 35 · 21:34 · LAS MONEDAS QUE QUEDARON: caen de a una sobre la mesa y el contador frena en más de lo que pensaba
export const RCount: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 60%, #2a2016, #080706 75%)">{(tt) => <>
  <Spr id="sp_coins" tt={tt} at={4.6} x={760} y={720} w={520} />
  {Array.from({ length: 9 }, (_, i) => <Spr key={i} id="sp_coins" tt={tt} at={4.9 + i * 0.22} x={560 + rnd(i, 3) * 420} y={760 + rnd(i, 4) * 80} w={90} rot={rnd(i) * 360} shadow={0.6} />)}
  <Odo tt={tt} at={4.8} dur={2.4} to={1.07} x={1420} y={460} pre="$" size={130} />
  <Big tt={tt} at={7.2} x={1330} y={220} txt="MORE THAN I THOUGHT" size={70} col={AMB} />
</>}</Stage>;

export const HA2: Record<string, C> = {
  d_mud: RMud, d_jobs: RJobs, d_grid: RGrid, d_seal: RSeal, d_receipt: RReceipt, d_flap: RFlap, d_micro: RMicro, d_chain: RChain,
  d_cubes: RCubes, d_swell: RSwell, d_palm: RPalm, d_slide: RSlide, d_flip: RFlip, d_rail: RRail, d_toss: RToss, d_spoon: RSpoon,
  d_italy: RItaly, d_crowd: RCrowd, d_wrap: RWrap, d_greasecan: RGreaseCan, d_smash: RSmash, d_pierogi: RPierogi, d_burn: RBurn,
  d_postcard: RPostcard, d_shrink: RShrink, d_tally: RTally, d_bread: RBread, d_cleanout: RCleanout, d_chalk: RChalk,
  d_bagbox: RBagBox, d_three: RThree, d_onefire: ROneFire, d_family: RFamily, d_size: RSize, d_count: RCount,
};
