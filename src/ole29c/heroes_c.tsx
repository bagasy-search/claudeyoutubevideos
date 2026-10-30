// ole29c · 33 componentes ÚNICOS (5 cenas de porotos): objetos REALES recortados (agnes + rembg) que llegan con peso sobre la
// foto del momento. Una idea = un mecanismo distinto, una palabra grande, cada momento clavado en la palabra que lo dice.
// Ninguno repite mecanismo de ole29a/ole29d (registro D:/rtmp/ole29_COMPONENTES.md).
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { AMB, Big, Bg, H, HAND, MARK, Pour, Spr, Stage, Steam, TX, cl, eIn, eio, img, phys, spr } from "./hkit";

type C = React.FC<{ t: number; h: H }>;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const ABS: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080 };
// la foto del plano que veníamos viendo, desenfocada: el componente sigue dentro de esa escena
const BgB: React.FC<{ id: string; tt: number; dim?: number }> = ({ id, tt, dim = 0.5 }) => <AbsoluteFill style={{ overflow: "hidden" }}>
  <Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(18px) brightness(${1 - dim})`, transform: `scale(${1.16 - 0.03 * cl(tt / 10)})` }} />
  <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(0,0,0,0), rgba(0,0,0,.5))" }} />
</AbsoluteFill>;
// llama de lenguas (≤1,6 Hz, sin parpadeo)
const Flame: React.FC<{ tt: number; x: number; y: number; w: number; k?: number }> = ({ tt, x, y, w, k = 1 }) => <div style={{ position: "absolute", left: x, top: y, opacity: k }}>
  <div style={{ position: "absolute", left: -w * 0.6, top: -w * 0.16, width: w * 1.2, height: w * 0.3, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,150,50,.55), rgba(255,90,20,.18) 55%, transparent 72%)", filter: `blur(${w * 0.03}px)` }} />
  {Array.from({ length: 9 }, (_, i) => { const f = 0.7 + 0.25 * rnd(i, 9), s = 1 + 0.12 * Math.sin(tt * 2 * Math.PI * f + i * 1.7), hh = w * (0.22 + 0.2 * rnd(i, 8)) * s, ww = w * 0.085; return <div key={i} style={{ position: "absolute", left: (i - 4) * w * 0.1 - ww / 2 + Math.sin(tt * 1.4 + i) * 3, top: -hh, width: ww, height: hh, borderRadius: "50% 50% 40% 40% / 85% 85% 15% 15%", background: "linear-gradient(0deg, #3a6bff 0%, #ffd27a 22%, #ff8a20 60%, rgba(230,60,10,0) 100%)", filter: `blur(${w * 0.006}px)`, mixBlendMode: "screen", opacity: 0.85 }} />; })}
</div>;
// envoltorio que mueve un grupo sin pisar el style del Img de Spr
const Mv: React.FC<{ x?: number; y?: number; r?: number; s?: number; sx?: number; sy?: number; o?: number; ox?: string; children: React.ReactNode }> = ({ x = 0, y = 0, r = 0, s = 1, sx = 1, sy = 1, o = 1, ox = "50% 50%", children }) =>
  <div style={{ ...ABS, opacity: o, transformOrigin: ox, transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s * sx}, ${s * sy})` }}>{children}</div>;
// letra a mano que se escribe (Caveat)
const Hand: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; size?: number; dur?: number; col?: string }> = ({ tt, at, x, y, txt, size = 90, dur = 1.1, col = "#f4ead2" }) => {
  const p = eio(tt, at, at + dur); if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`, textShadow: "0 4px 18px rgba(0,0,0,.8)" }}>{txt}</div>;
};
// porotos sueltos (óvalos con brillo), para lo que cae o se empuja grano a grano
const Bean: React.FC<{ x: number; y: number; r?: number; s?: number; col?: string; o?: number }> = ({ x, y, r = 0, s = 1, col = "#8a5636", o = 1 }) =>
  <div style={{ position: "absolute", left: x - 13 * s, top: y - 8 * s, width: 26 * s, height: 16 * s, borderRadius: "50%", opacity: o, transform: `rotate(${r}deg)`, background: `radial-gradient(ellipse at 35% 30%, rgba(255,255,255,.45), ${col} 45%, rgba(0,0,0,.55))`, boxShadow: "0 3px 4px rgba(0,0,0,.45)" }} />;

// 1 · 0:03 · EL LIBRO DEL JEFE: el libro cae junto a la estufa, la tapa de cuero se abre y el lápiz subraya UNA línea
export const CLedger: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const open = eio(tt, 4.6, 5.5), pen = eio(tt, 5.9, 6.7), ul = eio(tt, 6.8, 7.6);
  return <>
    <BgB id="n_libro_jefe" tt={tt} dim={0.45} />
    <Spr id="sp_ledger_open" tt={tt} at={2.2} x={900} y={560} w={1180} />
    {/* tapa de cuero: gira sobre el lomo y deja ver la página derecha */}
    {tt > 2.2 && open < 1 && <div style={{ position: "absolute", left: 900, top: 270, width: 560, height: 600, transformOrigin: "0 50%", transform: `perspective(1800px) rotateY(${-178 * open}deg) translateY(${(1 - phys(tt, 2.2, 7.5, 0.5)) * -620}px)`, borderRadius: "4px 14px 14px 4px", background: "linear-gradient(100deg,#3a2414,#6a4226 40%,#4a2c18)", boxShadow: "inset 0 0 0 10px rgba(0,0,0,.18), 0 20px 40px rgba(0,0,0,.5)", backfaceVisibility: "hidden" }} />}
    {/* el subrayado en lápiz de la línea del costo */}
    <svg style={ABS}><path d="M 990 600 C 1080 606, 1180 598, 1290 604" stroke="rgba(40,34,30,.85)" strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={320} strokeDashoffset={320 * (1 - ul)} /></svg>
    <Mv x={1290 - 300 * (1 - pen) + 300 * ul - 300} y={-200 * (1 - pen) + 6 * Math.sin(tt * 9) * (ul > 0 && ul < 1 ? 1 : 0)}><Spr id="sp_pencil" tt={tt} at={5.8} x={1300} y={540} w={260} rot={-28} from="none" shadow={0} /></Mv>
    <Big tt={tt} at={7.9} x={960} y={160} txt="PER MAN, PER DAY" size={110} col={AMB} />
    <Big tt={tt} at={11.6} x={960} y={950} txt="OUT BY MONDAY" size={84} />
  </>;
}}</Stage>;

// 2 · 0:38 · CINCO CENAS: los cinco tazones se deslizan por el tablón y frenan; a cada uno le cae un centavo delante
export const CBowls: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const B = ["sp_bowl_black", "sp_bowl_red", "sp_bowl_pot", "sp_bowl_cakes", "sp_bowl_bacon"];
  return <>
    <BgB id="n_cinco_platos" tt={tt} dim={0.4} />
    {B.map((id, i) => { const at = 0.6 + i * 0.28, s = phys(tt, at, 6, 0.62); return <Mv key={id} x={(1 - s) * 1500}><Spr id={id} tt={tt} at={at} x={230 + i * 365} y={560} w={380} from="none" /></Mv>; })}
    {B.map((_, i) => { const at = 5.9 + i * 0.18, s = phys(tt, at, 8, 0.4); if (s <= 0.01) return null;
      return <div key={i} style={{ position: "absolute", left: 230 + i * 365 - 50, top: 760 - 500 * (1 - s), width: 100, height: 100, transform: `rotate(${(1 - s) * 260}deg)` }}><Img src={spr("sp_penny")} style={{ width: 100 }} /></div>; })}
    <Big tt={tt} at={1.8} x={960} y={190} txt="FIVE SUPPERS" size={120} out={7.2} />
    <Big tt={tt} at={7.6} x={960} y={190} txt="11¢ IN CAMP" size={130} col={AMB} />
  </>;
}}</Stage>;

// 3 · 1:26 · POR QUÉ POROTOS: el hacha baja en arco y se clava en el tronco; saltan astillas, a veinte bajo cero
export const CAxe: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sw = eIn(tt, 7.4, 8.0), back = eio(tt, 6.4, 7.4) * (1 - sw), hit = tt > 8.0;
  const ang = -30 - 70 * back + 100 * sw, shake = hit ? Math.exp(-6 * (tt - 8.0)) * Math.sin((tt - 8.0) * 40) * 8 : 0;
  return <>
    <BgB id="n_hacha_frio" tt={tt} dim={0.4} />
    <Mv x={shake}><Spr id="sp_log" tt={tt} at={0.4} x={960} y={720} w={640} /></Mv>
    {tt > 0.9 && <div style={{ ...ABS, transformOrigin: "1500px 980px", transform: `rotate(${hit ? 70 + shake * 0.2 : ang}deg)`, opacity: cl((tt - 0.9) * 3) }}><Spr id="sp_axe" tt={tt} at={0} x={1500} y={600} w={800} rot={-90} from="none" shadow={0} /></div>}
    {hit && Array.from({ length: 10 }, (_, i) => { const d = tt - 8.0, vx = (rnd(i) - 0.5) * 900, vy = -500 - rnd(i, 2) * 500; if (d > 1.6) return null;
      return <div key={i} style={{ position: "absolute", left: 960 + vx * d, top: 520 + vy * d + 900 * d * d, width: 30, height: 12, background: "#d8b98a", borderRadius: 3, transform: `rotate(${d * 600 * (rnd(i, 3) - 0.5)}deg)`, opacity: 1 - d / 1.6 }} />; })}
    <Big tt={tt} at={5.6} x={960} y={170} txt="WHY BEANS?" size={130} out={10.6} />
    <Big tt={tt} at={10.9} x={960} y={170} txt="20 BELOW" size={140} col="#bfe2ff" />
  </>;
}}</Stage>;

// 4 · 1:43 · LA CARNE CONTRA LA BOLSA: el tocino helado se hamaca chiquito en su gancho; la bolsa de 100 lb cae y sacude todo
export const CStore: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sw = 12 * Math.exp(-0.5 * tt) * Math.sin(tt * 2.2), land = tt - 7.6, quake = land > 0 ? Math.exp(-5 * land) * Math.sin(land * 34) * 14 : 0;
  return <>
    <BgB id="n_carne_cara" tt={tt} dim={0.45} />
    <Mv y={quake}>
      <div style={{ ...ABS, transformOrigin: "520px 0px", transform: `rotate(${sw}deg)` }}>
        <div style={{ position: "absolute", left: 518, top: 0, width: 4, height: 190, background: "linear-gradient(90deg,#3a3a3a,#8a8a8a,#3a3a3a)" }} />
        <Spr id="sp_saltpork_hook" tt={tt} at={0.2} x={520} y={420} w={420} from="none" shadow={0} />
      </div>
      <Spr id="sp_sack100" tt={tt} at={7.3} x={1270} y={560} w={820} />
    </Mv>
    <Big tt={tt} at={2.4} x={520} y={880} txt="HEAVY · DEAR" size={90} out={7.0} />
    <Big tt={tt} at={7.6} x={1270} y={150} txt="100 LB" size={150} col={AMB} />
    <Big tt={tt} at={10.0} x={1270} y={990} txt="ALMOST NOTHING" size={84} />
  </>;
}}</Stage>;

// 5 · 2:02 · UNA LIBRA = UNA LATA: la bolsa y la lata a la par; cuando se cocina, la bolsa se vuelca y llena seis tazas
export const CCups: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const tip = eio(tt, 9.0, 9.6);
  return <>
    <BgB id="n_bolsa_vs_lata" tt={tt} dim={0.45} />
    <div style={{ ...ABS, transformOrigin: "560px 700px", transform: `rotate(${62 * tip}deg) translate(${-60 * tip}px, ${-180 * tip}px)` }}><Spr id="sp_bag1lb" tt={tt} at={1.8} x={560} y={500} w={420} /></div>
    <Mv o={1 - eio(tt, 8.6, 9.0)}><Spr id="sp_can_plain" tt={tt} at={5.6} x={1360} y={520} w={340} /></Mv>
    {Array.from({ length: 6 }, (_, i) => { const x = 380 + i * 230, at = 8.9 + i * 0.08, f = eio(tt, 9.6 + i * 0.12, 10.1 + i * 0.12);
      return <React.Fragment key={i}><Mv o={1 - f}><Spr id="sp_tincup_empty" tt={tt} at={at} x={x} y={820} w={220} from="up" /></Mv><Mv o={f}><Spr id="sp_tincup_full" tt={tt} at={at} x={x} y={820} w={220} from="none" shadow={0} /></Mv></React.Fragment>; })}
    {tip > 0.3 && Array.from({ length: 30 }, (_, i) => { const d = (tt - 9.4 - rnd(i) * 0.6); if (d < 0 || d > 0.9) return null; const tx = 380 + (i % 6) * 230;
      return <Bean key={i} x={760 + (tx - 760) * (d / 0.9)} y={420 + 400 * (d / 0.9) ** 2} r={d * 400} s={1.1} />; })}
    <Big tt={tt} at={2.0} x={560} y={150} txt="1 POUND" size={110} out={8.6} />
    <Big tt={tt} at={5.8} x={1360} y={150} txt="= 1 CAN" size={110} col={AMB} out={8.6} />
    <Big tt={tt} at={9.7} x={960} y={190} txt="6 CUPS" size={170} col={AMB} />
  </>;
}}</Stage>;

// 6 · 2:34 · CADA NOCHE OTRA: la bandeja giratoria de madera rota en perspectiva y trae al frente una cena distinta por noche
export const CLazy: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const P = ["sp_tb_soup", "sp_tb_red", "sp_tb_pot", "sp_tb_cakes", "sp_tb_bacon"], rot = eio(tt, 0.6, 2.2) * 72 + eio(tt, 2.8, 4.0) * 72 + eio(tt, 6.6, 7.8) * 72 + eio(tt, 10.4, 11.6) * 72;
  const wob = tt > 9.3 ? Math.exp(-3 * (tt - 9.3)) * Math.sin((tt - 9.3) * 22) * 6 : 0;
  return <>
    <BgB id="n_hombres_comen" tt={tt} dim={0.45} />
    {/* bandeja: elipse de madera vista en perspectiva, con anillos de veta */}
    <div style={{ position: "absolute", left: 960 - 720, top: 640 - 250, width: 1440, height: 500, borderRadius: "50%", background: "repeating-radial-gradient(ellipse at 50% 50%, #7a5432 0px, #8c6440 14px, #6e4a2a 26px)", boxShadow: "0 40px 60px rgba(0,0,0,.6), inset 0 -18px 30px rgba(0,0,0,.45), 0 18px 0 #4a2f18", transform: `scale(${phys(tt, 0.1, 5, 0.7)})` }} />
    {P.map((id, i) => { const a = ((i * 72 - rot) * Math.PI) / 180, x = 960 + 560 * Math.sin(a), y = 640 + 170 * Math.cos(a), z = (Math.cos(a) + 1) / 2;
      return <div key={id} style={{ ...ABS, zIndex: Math.round(z * 10), transform: `translate(${x - 960}px, ${y - 640 + (i === 0 ? wob : 0)}px) scale(${0.55 + 0.45 * z})`, transformOrigin: "960px 640px", filter: `brightness(${0.55 + 0.45 * z})` }}><Spr id={id} tt={tt} at={0.3 + i * 0.1} x={960} y={600} w={420} from="none" /></div>; })}
    <Big tt={tt} at={0.4} x={960} y={150} txt="A NEW SUPPER EVERY NIGHT" size={84} out={11.0} />
    <Big tt={tt} at={11.5} x={960} y={150} txt="ONE BAG" size={140} col={AMB} />
  </>;
}}</Stage>;

// 7 · 2:50 · CENA Nº 1: el número se QUEMA en el tablón colgado (brasa que avanza) y abajo aterriza la olla con lima
export const CSign: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = phys(tt, 0.1, 5, 0.35), sw = 8 * Math.exp(-1.2 * tt) * Math.sin(tt * 4), b1 = eio(tt, 0.4, 1.3), b2 = eio(tt, 1.6, 3.0);
  const Burn: React.FC<{ p: number; txt: string; y: number; size: number }> = ({ p, txt, y, size }) => <div style={{ position: "absolute", left: 960, top: y, transform: "translate(-50%,-50%)", whiteSpace: "nowrap", fontFamily: MARK, fontSize: size }}>
    <span style={{ color: "#2a1608", textShadow: "0 1px 0 rgba(255,220,170,.25), 0 -1px 1px rgba(0,0,0,.6)", clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, display: "inline-block" }}>{txt}</span>
    {p > 0 && p < 1 && <div style={{ position: "absolute", left: `${p * 100}%`, top: "10%", width: 26, height: "80%", borderRadius: 12, background: "radial-gradient(ellipse, #fff1b0, #ff8a20 45%, rgba(255,60,0,0) 75%)", filter: "blur(3px)", transform: "translateX(-50%)" }} />}
  </div>;
  return <>
    <BgB id="n_sopa_negra" tt={tt} dim={0.45} />
    <div style={{ ...ABS, transformOrigin: "960px 0px", transform: `translateY(${(1 - s) * -700}px) rotate(${sw}deg)` }}>
      {[620, 1300].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 0, width: 4, height: 150, background: "#5a4a38" }} />)}
      <Spr id="sp_plank" tt={tt} at={0} x={960} y={300} w={1160} from="none" shadow={0} />
      <Burn p={b1} txt="No. 1" y={250} size={96} />
      <Burn p={b2} txt="BLACK BEAN SOUP" y={360} size={74} />
      {/* humito de la quemadura que sube lento */}
      <Steam tt={tt} x={960} y={240} w={120} k={0.5 * (b2 > 0 && b2 < 1 ? 1 : 0.3) * (1 - eio(tt, 3.2, 4.5))} />
    </div>
    <Spr id="sp_soup_lime" tt={tt} at={2.8} x={960} y={790} w={560} />
    <Steam tt={tt} x={960} y={600} w={200} k={cl((tt - 3.2) * 0.8)} />
  </>;
}}</Stage>;

// 8 · 3:37 · HERVOR FUERTE, DESPUÉS SUSURRO: olla de vidrio en corte; el agua sube, las burbujas revientan y después se calman
export const CBoil: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fill = eio(tt, 3.8, 4.8), hard = eio(tt, 6.0, 6.6) * (1 - eio(tt, 9.0, 9.8)), soft = eio(tt, 9.2, 9.9), fire = 0.35 + 0.65 * hard;
  return <>
    <BgB id="n_diez_tazas" tt={tt} dim={0.5} />
    <Flame tt={tt} x={960} y={930} w={620} k={fire} />
    <div style={{ position: "absolute", left: 960 - 330, top: 900 - 360 * fill - 20, width: 660, height: 360 * fill + 20, overflow: "hidden", borderRadius: "0 0 60px 60px" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(150,120,90,.55), rgba(70,50,35,.7))" }} />
      {Array.from({ length: 34 }, (_, i) => { const k = hard * (0.6 + rnd(i) * 0.8) + soft * (i % 5 === 0 ? 0.25 : 0), sp = 0.6 + 2.4 * hard + 0.3 * soft, ph = (tt * sp * (0.6 + rnd(i, 2)) + rnd(i, 3)) % 1, r = 6 + rnd(i, 4) * 20 * (0.4 + hard);
        return <div key={i} style={{ position: "absolute", left: 30 + rnd(i, 5) * 600 + Math.sin(ph * 8 + i) * 8 * hard, top: (360 * fill + 20) * (1 - ph), width: 2 * r, height: 2 * r, borderRadius: "50%", border: "2px solid rgba(255,255,255,.7)", background: "rgba(255,255,255,.12)", opacity: k * Math.sin(ph * Math.PI) }} />; })}
      {Array.from({ length: 26 }, (_, i) => <Bean key={i} x={40 + rnd(i, 7) * 580} y={360 * fill - 20 - rnd(i, 8) * 50 * (1 + 2 * hard * Math.abs(Math.sin(tt * 3 + i)))} r={rnd(i, 9) * 180} col="#1c1612" />)}
    </div>
    <Spr id="sp_glass_pot" tt={tt} at={0.3} x={960} y={720} w={820} />
    <Steam tt={tt} x={960} y={500} w={260} k={0.3 + 0.7 * hard} />
    <Big tt={tt} at={3.9} x={960} y={140} txt="10 CUPS OF WATER" size={90} out={5.9} />
    <Big tt={tt} at={6.1} x={960} y={140} txt="HARD BOIL · 10 MIN" size={96} col="#ffb070" out={9.0} />
    <Big tt={tt} at={9.3} x={960} y={140} txt="THEN SIMMER" size={110} col={AMB} />
  </>;
}}</Stage>;

// 9 · 4:45 · ÁCIDO TEMPRANO: la lima cae en la olla (salpica en anillos) y los porotos se vuelven piedras de grava
export const CGravel: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const drop = phys(tt, 2.4, 8, 0.5), sp = tt - 2.95, to = eio(tt, 7.2, 8.8);
  return <>
    <BgB id="n_cascara_dura" tt={tt} dim={0.5} />
    <Mv o={1 - to}><Spr id="sp_pot_beans_top" tt={tt} at={0.3} x={960} y={540} w={860} /></Mv>
    <Mv o={to}><Spr id="sp_pot_gravel_top" tt={tt} at={0.3} x={960} y={540} w={860} from="none" /></Mv>
    {sp > 0 && sp < 1.6 && [0, 1, 2].map((i) => { const d = sp - i * 0.22; if (d <= 0) return null; return <div key={i} style={{ position: "absolute", left: 960 - 60 - 260 * d, top: 540 - 60 - 260 * d, width: 120 + 520 * d, height: 120 + 520 * d, borderRadius: "50%", border: "4px solid rgba(255,255,255,.55)", opacity: (1 - d / 1.4) * 0.8 }} />; })}
    {tt > 2.2 && <Mv y={(1 - drop) * -700} s={1 - 0.25 * cl(sp * 2)} o={1 - to}><Spr id="sp_lime_whole" tt={tt} at={0} x={960} y={520} w={220} from="none" shadow={0} /></Mv>}
    <Big tt={tt} at={2.4} x={960} y={130} txt="NO SOUR EARLY" size={100} out={8.3} />
    <Big tt={tt} at={8.8} x={960} y={130} txt="HARD AS GRAVEL" size={110} col="#ffb070" />
  </>;
}}</Stage>;

// 10 · 5:00 · LA LIMA AL FINAL: el cuchillo invisible parte la lima en dos mitades que se abren; y aparecen 8 tazones
export const CLime: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const cut = eio(tt, 6.6, 7.3), slide = eio(tt, 8.6, 9.3);
  const half = (side: number) => <div style={{ ...ABS, clipPath: side < 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)", transform: `translate(${side * 140 * cut - 420 * slide}px, ${-60 * slide}px) rotate(${side * 14 * cut}deg) scale(${1 - 0.45 * slide})`, transformOrigin: "960px 560px" }}><Spr id="sp_lime_big" tt={tt} at={0.4} x={960} y={520} w={560} from={side < 0 ? "top" : "none"} /></div>;
  return <>
    <BgB id="n_ocho_tazones" tt={tt} dim={0.45} />
    {half(-1)}{half(1)}
    {/* la línea del corte, un destello fino que baja */}
    {cut > 0 && cut < 1 && <div style={{ position: "absolute", left: 958, top: 280, width: 4, height: 520 * cut, background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.9))" }} />}
    {Array.from({ length: 8 }, (_, i) => <Spr key={i} id="sp_bowl_tin_soup" tt={tt} at={9.0 + i * 0.16} x={760 + (i % 4) * 300} y={i < 4 ? 430 : 760} w={250} />)}
    <Big tt={tt} at={5.6} x={960} y={130} txt="AT THE END" size={120} col={AMB} out={8.4} />
    <Big tt={tt} at={9.4} x={420} y={600} txt="55¢" size={170} col={AMB} />
  </>;
}}</Stage>;

// 11 · 5:16 · CENA Nº 2 · DÍA DE LAVADO: la ropa se cuelga de a una en la soga que se comba; la olla queda sola atrás
export const CWash: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const C2 = [["sp_shirt", 4.4, 420], ["sp_longjohns", 5.4, 820], ["sp_socks", 6.1, 1190], ["sp_apron", 7.0, 1540]] as const;
  const sag = 40 + C2.filter(([, at]) => tt > at).length * 22, y = (x: number) => 260 + sag * Math.sin((x / 1920) * Math.PI);
  return <>
    <Bg id="n_dia_lavado" tt={tt} dim={0.35} />
    <svg style={ABS}><path d={`M -20 260 Q 960 ${260 + 2 * sag} 1940 260`} stroke="#d8cbb0" strokeWidth={6} fill="none" /></svg>
    {C2.map(([id, at, x]) => { const s = phys(tt, at, 6, 0.32), sw = 6 * Math.exp(-1.2 * Math.max(0, tt - at)) * Math.sin(Math.max(0, tt - at) * 4 + x); if (s <= 0.01) return null;
      return <div key={id} style={{ ...ABS, transformOrigin: `${x}px ${y(x)}px`, transform: `translateY(${(1 - s) * -600}px) rotate(${sw}deg)` }}>
        <Spr id={id} tt={tt} at={0} x={x} y={y(x) + 170} w={340} from="none" shadow={0} />
        {[-60, 60].map((d) => <div key={d} style={{ position: "absolute", left: x + d - 7, top: y(x + d) - 22, width: 14, height: 46, borderRadius: 4, background: "linear-gradient(90deg,#b08a5a,#e0c08a,#9a7446)" }} />)}
      </div>; })}
    <Spr id="sp_redbeans_plate" tt={tt} at={9.2} x={960} y={850} w={460} from="up" />
    <Big tt={tt} at={0.2} x={960} y={110} txt="No. 2 · RED BEANS & RICE" size={84} col={AMB} out={4.2} />
    <Big tt={tt} at={4.5} x={960} y={110} txt="WASH DAY" size={120} out={9.0} />
    <Big tt={tt} at={9.4} x={960} y={110} txt="BACK OF THE STOVE" size={96} col={AMB} />
  </>;
}}</Stage>;

// 12 · 5:33 · DÍA DE PAN: la masa respira y crece; se hornea dorada y los panes se multiplican en la repisa hasta doce
export const CDough: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const rise = eio(tt, 0.8, 4.2), bake = eio(tt, 4.4, 5.4), br = 1 + 0.025 * Math.sin(tt * 2.2) * (1 - bake);
  return <>
    <BgB id="n_pan_semana" tt={tt} dim={0.45} />
    <Mv o={1 - bake} s={(0.7 + 0.3 * rise) * br} sy={1 + 0.06 * rise} ox="960px 820px"><Spr id="sp_dough_ball" tt={tt} at={0.3} x={960} y={640} w={560} /></Mv>
    {Array.from({ length: 12 }, (_, i) => { const at = 4.6 + i * 0.22, x = 300 + (i % 6) * 264, y = i < 6 ? 420 : 720; return <Mv key={i} o={i === 0 ? 1 : 1}><Spr id="sp_loaf" tt={tt} at={at} x={i === 0 ? 960 + (x - 960) * eio(tt, 5.4, 6.2) : x} y={i === 0 ? 640 + (y - 640) * eio(tt, 5.4, 6.2) : y} w={i === 0 ? 300 + 260 * (1 - eio(tt, 5.4, 6.2)) : 240} from={i === 0 ? "none" : "top"} /></Mv>; })}
    <Big tt={tt} at={3.6} x={960} y={130} txt="BREAD FOR THE WEEK" size={96} out={7.6} />
    <Big tt={tt} at={8.2} x={960} y={950} txt="THE POT COOKS ITSELF" size={88} col={AMB} />
  </>;
}}</Stage>;

// 13 · 5:49 · DIEZ MINUTOS ENTEROS: los porotos rojos caen de a uno a la taza, uno por minuto, hasta diez
export const CCount: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const n = Math.floor(cl((tt - 9.4) / 2.0) * 10 + 1e-6);
  return <>
    <BgB id="n_rojos_crudos" tt={tt} dim={0.5} />
    <Spr id="sp_redbeans_heap" tt={tt} at={0.8} x={520} y={700} w={520} />
    <Spr id="sp_tincup2" tt={tt} at={2.0} x={1340} y={720} w={480} />
    {Array.from({ length: 10 }, (_, i) => { const at = 9.4 + i * 0.2, d = tt - at; if (d < 0) return null; const p = cl(d / 0.45);
      return <Bean key={i} x={560 + (1300 + (i % 4) * 30 - 560) * p} y={560 - 380 * Math.sin(p * Math.PI) + (640 - 560) * p} r={d * 500} s={1.4} col="#7a1c18" o={p < 1 ? 1 : 0} />; })}
    {/* los porotos que ya cayeron asoman en la boca de la taza */}
    {Array.from({ length: n }, (_, i) => <Bean key={i} x={1240 + (i % 5) * 46} y={600 - Math.floor(i / 5) * 18} r={rnd(i) * 180} s={1.2} col="#7a1c18" />)}
    <Big tt={tt} at={2.9} x={960} y={140} txt="NOT OPTIONAL" size={120} col="#ffb070" out={9.2} />
    <Big tt={tt} at={9.5} x={960} y={140} txt="10 FULL MINUTES" size={110} col={AMB} />
    {n > 0 && <div style={{ position: "absolute", left: 1340, top: 960, transform: "translate(-50%,-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 110, color: "#f4ead2", textShadow: "0 4px 18px rgba(0,0,0,.8)" }}>{n}</div>}
  </>;
}}</Stage>;

// 14 · 6:24 · LA TRINIDAD: cebolla, morrón y apio giran en triángulo alrededor de la olla y se tiran adentro
export const CTrinity: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const V = [["sp_onion2", 0.4], ["sp_pepper_green", 1.3], ["sp_celery", 3.6]] as const, dive = eIn(tt, 4.5, 5.3);
  return <>
    <BgB id="n_trinidad" tt={tt} dim={0.45} />
    <Spr id="sp_pot_side" tt={tt} at={0.1} x={960} y={720} w={640} />
    {V.map(([id, at], i) => { const a = (tt * 0.9 + (i * 2 * Math.PI) / 3), r = 470 * (1 - dive), x = 960 + r * Math.cos(a), y = 470 + 150 * Math.sin(a) + 200 * dive;
      return <Mv key={id} x={x - 960} y={y - 470} s={1 - 0.6 * dive} o={1 - eio(tt, 5.0, 5.4)} ox="960px 470px"><Spr id={id} tt={tt} at={at} x={960} y={470} w={280} from="none" /></Mv>; })}
    <Steam tt={tt} x={960} y={520} w={240} k={0.4 + 0.6 * eio(tt, 5.2, 6.0)} />
    <Big tt={tt} at={0.5} x={960} y={120} txt="THE TRINITY" size={130} col={AMB} out={5.5} />
    <Big tt={tt} at={5.8} x={960} y={120} txt="GARLIC · BAY · THYME" size={92} />
  </>;
}}</Stage>;

// 15 · 6:39 · CREMOSO: la cuchara de madera da vueltas dejando estela; los porotos se vuelven crema y se aplastan contra la pared
export const CSwirl: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const cr = eio(tt, 7.2, 8.6), press = eio(tt, 11.4, 12.0) * (1 - eio(tt, 12.8, 13.4)), a = tt * 1.3, R = 220 * (1 - press) + 330 * press;
  const sx = 960 + R * Math.cos(press > 0.5 ? 0 : a), sy = 540 + R * 0.75 * Math.sin(press > 0.5 ? 0 : a);
  return <>
    <BgB id="n_cremoso" tt={tt} dim={0.5} />
    <Mv o={1 - cr}><Spr id="sp_redbeans_pot_top" tt={tt} at={0.2} x={960} y={540} w={900} /></Mv>
    <Mv o={cr}><Spr id="sp_redbeans_creamy_top" tt={tt} at={0.2} x={960} y={540} w={900} from="none" /></Mv>
    {/* estela del revuelto: arco que sigue a la cuchara y se desvanece */}
    <svg style={ABS}>{Array.from({ length: 12 }, (_, i) => { const b = a - i * 0.12, x = 960 + 220 * Math.cos(b), y = 540 + 165 * Math.sin(b); return <circle key={i} cx={x} cy={y} r={16 - i} fill="rgba(255,235,210,.35)" opacity={(1 - i / 12) * (1 - press)} />; })}</svg>
    <Mv x={sx - 1100} y={sy - 360}><Spr id="sp_spoon2" tt={tt} at={0.1} x={1100} y={360} w={620} rot={-50 + 25 * press} from="none" shadow={0} /></Mv>
    <Big tt={tt} at={7.6} x={960} y={130} txt="CREAMY" size={150} col={AMB} out={11.2} />
    <Big tt={tt} at={11.6} x={960} y={130} txt="MASH AGAINST THE SIDE" size={88} />
  </>;
}}</Stage>;

// 16 · 7:31 · EL FUEGO MÁS BAJO: superficie del caldo vista de arriba; una sola burbuja lenta sube y abre anillos
export const CRipple: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 60% 55% at 50% 50%, #3a2616, #0a0604 75%)">{(tt) => {
  const low = eio(tt, 6.8, 7.8), per = 3.4 - 1.6 * (1 - low);
  return <>
    <div style={{ position: "absolute", left: 960 - 520, top: 540 - 380, width: 1040, height: 760, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%, #6a4a2c, #3a2414 60%, #1a0e06)", boxShadow: "0 0 0 34px #141414, 0 0 0 40px #2a2a2a, 0 40px 90px rgba(0,0,0,.8)", transform: `scale(${phys(tt, 0.1, 5, 0.7)})` }}>
      {Array.from({ length: 22 }, (_, i) => <Bean key={i} x={200 + rnd(i) * 640} y={180 + rnd(i, 2) * 400} r={rnd(i, 3) * 180} s={1.3} col="#a87046" o={0.75} />)}
      {[0, 1, 2, 3].map((k) => { const ph = ((tt + k * per / 4) % per) / per; return <div key={k} style={{ position: "absolute", left: 520 - 40 - 300 * ph, top: 380 - 30 - 220 * ph, width: 80 + 600 * ph, height: 60 + 440 * ph, borderRadius: "50%", border: "3px solid rgba(255,230,190,.5)", opacity: (1 - ph) * 0.7 }} />; })}
      <div style={{ position: "absolute", left: 500, top: 362, width: 40, height: 34, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.9), rgba(255,230,190,.3) 50%, transparent 70%)", transform: `scale(${0.5 + 0.5 * Math.abs(Math.sin((tt / per) * Math.PI))})` }} />
    </div>
    <Big tt={tt} at={7.0} x={960} y={110} txt="THE LOWEST SIMMER" size={96} col={AMB} out={8.8} />
    <Big tt={tt} at={9.0} x={960} y={110} txt="I MEAN LOW" size={120} />
    <Hand tt={tt} at={9.8} x={960} y={990} txt="Toivo, the bull cook" size={80} />
  </>;
}}</Stage>;

// 17 · 8:22 · LA SAL ESTÁ BIEN, Y LA PRUEBA DEL DEDO: caen cristales de sal; a las dos horas, el poroto se aplasta entre los dedos
export const CPinch: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const pin = eio(tt, 11.6, 12.4), sq = eio(tt, 12.3, 12.8);
  return <>
    <BgB id="n_sal_inicio" tt={tt} dim={0.5} />
    {Array.from({ length: 40 }, (_, i) => { const d = tt - 3.7 - rnd(i) * 1.4; if (d < 0 || d > 1.2) return null; return <div key={i} style={{ position: "absolute", left: 760 + rnd(i, 2) * 400, top: 160 + 700 * d * d, width: 12, height: 12, background: "rgba(255,255,255,.92)", transform: `rotate(${45 + d * 200}deg)`, boxShadow: "0 0 6px rgba(255,255,255,.6)", opacity: 1 - d / 1.2 }} />; })}
    <Mv o={1 - sq}><Spr id="sp_bean_big" tt={tt} at={9.8} x={960} y={600} w={300} /></Mv>
    <Mv o={sq} sx={1 + 0.3 * sq}><Spr id="sp_bean_squashed" tt={tt} at={9.8} x={960} y={620} w={380} from="none" /></Mv>
    <Mv x={-260 * (1 - pin) + 12 * sq} y={-320 * (1 - pin) + 40 * sq} o={cl((tt - 10.6) * 2)}><Spr id="sp_hand_pinch" tt={tt} at={10.6} x={1060} y={430} w={620} from="none" shadow={0} /></Mv>
    <Big tt={tt} at={3.8} x={960} y={130} txt="SALT IS FINE" size={130} col={AMB} out={9.6} />
    <Big tt={tt} at={10.1} x={960} y={130} txt="1½ – 2 HOURS" size={120} />
  </>;
}}</Stage>;

// 18 · 8:53 · CENA Nº 4: el plato que tapa el bol de sobras se levanta y da vuelta; de abajo saltan las tortitas
export const CLid: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const up = eio(tt, 8.4, 9.2);
  return <>
    <BgB id="n_tortitas_negras" tt={tt} dim={0.45} />
    <Spr id="sp_bowl_leftover" tt={tt} at={0.8} x={960} y={720} w={560} />
    <div style={{ ...ABS, transformOrigin: "960px 560px", transform: `translate(${560 * up}px, ${-380 * up}px) rotate(${150 * up}deg)`, opacity: 1 - eio(tt, 9.3, 9.8) }}><Spr id="sp_plate_lid" tt={tt} at={1.4} x={960} y={560} w={600} /></div>
    {[[-300, 9.1], [300, 9.3]].map(([dx, at]) => { const s = phys(tt, at, 6, 0.4); if (s <= 0.01) return null; return <Mv key={dx} x={dx * s} y={-300 * Math.sin(cl((tt - at) / 0.6) * Math.PI)}><Spr id="sp_bean_cake" tt={tt} at={at} x={960} y={600} w={300} from="none" rot={(1 - s) * 360} /></Mv>; })}
    <Big tt={tt} at={4.2} x={960} y={130} txt="No. 4 · BEAN CAKES" size={100} col={AMB} out={8.0} />
    <Big tt={tt} at={8.7} x={960} y={130} txt="SOMETHING NEW" size={110} />
  </>;
}}</Stage>;

// 19 · 9:45 · LA MEZCLA: avena, huevo y cebolla entran de a uno, orbitan y se juntan en una bola que se aplasta en tortita
export const CPatty: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const I = [["sp_oats_cup", 1.0, -0.6], ["sp_egg_one", 6.0, 0.0], ["sp_onion_bits", 7.5, 0.6]] as const, mer = eIn(tt, 11.0, 11.8), flat = eio(tt, 12.2, 12.8);
  return <>
    <BgB id="n_avena_pan" tt={tt} dim={0.45} />
    {I.map(([id, at, off], i) => { const a = off * 2 + tt * 0.5 * (1 + mer * 3), r = 520 * (1 - mer), x = 960 + r * Math.sin(a), y = 540 - 120 * Math.cos(a) * (1 - mer);
      return <Mv key={id} x={x - 960} y={y - 540} s={1 - 0.7 * mer} o={1 - eio(tt, 11.6, 11.9)}><Spr id={id} tt={tt} at={at} x={960} y={540} w={300} from="none" /></Mv>; })}
    <Mv o={eio(tt, 11.6, 11.9) * (1 - flat)} s={phys(tt, 11.6, 8, 0.35)}><Spr id="sp_mash_ball" tt={tt} at={11.6} x={960} y={560} w={360} from="none" /></Mv>
    <Mv o={flat} sx={1 + 0.2 * (1 - flat)} sy={1 - 0.4 * (1 - flat)} ox="960px 600px"><Spr id="sp_patty_raw" tt={tt} at={12.2} x={960} y={600} w={460} from="none" /></Mv>
    <Big tt={tt} at={1.2} x={960} y={130} txt="OATS" size={120} out={5.8} />
    <Big tt={tt} at={6.1} x={960} y={130} txt="+ EGG" size={120} out={7.4} />
    <Big tt={tt} at={7.6} x={960} y={130} txt="+ ONION" size={120} out={11.0} />
    <Big tt={tt} at={11.3} x={960} y={130} txt="WITH YOUR HANDS" size={100} col={AMB} />
  </>;
}}</Stage>;

// 20 · 10:35 · LA TORRE: tortita crocante, cae el huevo encima, la crema, el ketchup; y la cuenta de ocho
export const CStack: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const kp = phys(tt, 6.4, 8, 0.4);
  return <>
    <BgB id="n_huevo_arriba" tt={tt} dim={0.45} />
    <Spr id="sp_tinplate2" tt={tt} at={0.3} x={960} y={780} w={760} />
    <Spr id="sp_cake_crispy" tt={tt} at={0.8} x={960} y={700} w={480} />
    <Spr id="sp_egg_fried2" tt={tt} at={2.8} x={960} y={610} w={420} shadow={0} />
    <Spr id="sp_sourcream" tt={tt} at={4.8} x={1060} y={560} w={170} shadow={0} />
    {kp > 0.01 && <div style={{ position: "absolute", left: 830, top: 580 - 400 * (1 - kp), width: 90, height: 60 * kp, borderRadius: "50% 50% 45% 45%", background: "radial-gradient(circle at 40% 30%, #ff7a6a, #b81e14 60%, #7a0c08)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />}
    <Big tt={tt} at={2.9} x={960} y={130} txt="EGG ON TOP" size={110} out={8.8} />
    <Big tt={tt} at={9.0} x={960} y={130} txt="8 CAKES · 25 MIN" size={100} out={11.2} />
    <Big tt={tt} at={11.6} x={960} y={130} txt="40¢ A SERVING" size={110} col={AMB} />
  </>;
}}</Stage>;

// 21 · 10:52 · CENA Nº 5: el cucharón se inclina sobre el balde de desperdicio… y vuelve: lo último de la olla no se tira
export const CLadle: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const go = eio(tt, 4.8, 6.4), back = eio(tt, 7.8, 8.8), tip = eio(tt, 6.0, 6.8) * (1 - eio(tt, 7.6, 8.2));
  return <>
    <BgB id="n_fondo_olla" tt={tt} dim={0.5} />
    <Spr id="sp_slop_bucket" tt={tt} at={4.4} x={1300} y={800} w={460} />
    <div style={{ ...ABS, transform: `translate(${320 * go - 380 * back}px, ${-60 * go + 40 * back}px) rotate(${32 * tip}deg)`, transformOrigin: "980px 520px" }}><Spr id="sp_ladle_beans" tt={tt} at={0.2} x={800} y={500} w={720} from="left" /></div>
    {tip > 0.6 && back < 0.2 && Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1150 + i * 8, top: 600 + ((tt * 3 + i * 0.25) % 1) * 60, width: 10, height: 18, borderRadius: 6, background: "rgba(120,80,40,.85)", opacity: 1 - ((tt * 3 + i * 0.25) % 1) }} />)}
    <Big tt={tt} at={0.2} x={960} y={130} txt="No. 5 · THE LAST OF THE POT" size={84} col={AMB} out={7.6} />
    <Big tt={tt} at={8.4} x={960} y={130} txt="DON'T DUMP IT" size={120} />
  </>;
}}</Stage>;

// 22 · 11:23 · CINCO MINUTOS: cinco fósforos se encienden y se consumen uno tras otro, uno por minuto; y la sopa ya está
export const CMatches: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const T0 = 1.2, D = 1.9;
  return <>
    <BgB id="n_sopa_cinco" tt={tt} dim={0.5} />
    {Array.from({ length: 5 }, (_, i) => { const a = T0 + i * D, burn = eio(tt, a + 0.3, a + D), lit = cl((tt - a) * 4) * (1 - eio(tt, a + D - 0.2, a + D + 0.2)), x = 560 + i * 200;
      return <React.Fragment key={i}>
        <div style={{ ...ABS, transformOrigin: `${x}px 820px`, transform: `scaleY(${1 - 0.55 * burn})` }}>
          <Spr id="sp_match" tt={tt} at={0.2 + i * 0.12} x={x} y={600} w={440} rot={-90} from="up" />
        </div>
        {burn > 0 && <div style={{ position: "absolute", left: x - 9, top: 600 - 210 + 440 * 0.55 * burn * 0.9, width: 18, height: 30 + 60 * burn, background: "linear-gradient(180deg,#151010,#3a2416)", borderRadius: 6, opacity: 0.9 }} />}
        <Flame tt={tt} x={x} y={385 + 230 * burn} w={110} k={lit} />
      </React.Fragment>; })}
    <Spr id="sp_bacon_pot" tt={tt} at={10.8} x={1500} y={820} w={400} from="right" />
    <Big tt={tt} at={1.0} x={960} y={130} txt="FIVE MINUTES" size={130} col={AMB} out={10.9} />
    <Big tt={tt} at={11.1} x={960} y={130} txt="CRISP" size={140} />
  </>;
}}</Stage>;

// 23 · 12:29 · EL CALDO NO SE TIRA: el caldo gira en remolino hacia el desagüe… y se rebobina hacia arriba, dentro del frasco
export const CDrain: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const down = eio(tt, 3.4, 5.4), up = eio(tt, 6.0, 7.6), lvl = down * (1 - up);
  return <>
    <BgB id="n_desague" tt={tt} dim={0.5} />
    <Mv o={1 - eio(tt, 6.0, 6.6)}><Spr id="sp_basin" tt={tt} at={0.2} x={760} y={560} w={820} /></Mv>
    {/* el caldo en el piletón: disco marrón que gira y se achica al irse por el agujero */}
    <div style={{ position: "absolute", left: 760 - 300, top: 560 - 300, width: 600, height: 600, borderRadius: "50%", background: "conic-gradient(from 0deg, rgba(110,70,35,.95), rgba(70,40,18,.95), rgba(130,85,45,.95), rgba(70,40,18,.95), rgba(110,70,35,.95))", transform: `rotate(${tt * 220 * (0.3 + lvl)}deg) scale(${(1 - lvl * 0.92) * cl(phys(tt, 0.6, 5, 0.7)) * (1 - eio(tt, 6.0, 6.6))})`, opacity: 0.9 }} />
    <svg style={ABS}>{[0, 1, 2].map((k) => <path key={k} d={Array.from({ length: 40 }, (_, i) => { const a = i * 0.35 + tt * 3 + k * 2.1, r = 280 * (1 - i / 40) * (1 - lvl * 0.9); return `${i ? "L" : "M"} ${760 + r * Math.cos(a)} ${560 + r * Math.sin(a)}`; }).join(" ")} stroke="rgba(255,230,190,.4)" strokeWidth={4} fill="none" opacity={1 - up} />)}</svg>
    {/* rebobinado: el chorro sube del desagüe al frasco */}
    {up > 0 && up < 1 && <div style={{ position: "absolute", left: 760 + (1280 - 760) * up - 12, top: 560 - 300 * Math.sin(up * Math.PI), width: 24, height: 24, borderRadius: "50%", background: "#8a5a2c", boxShadow: "0 0 18px rgba(255,190,110,.6)" }} />}
    <Spr id="sp_jar_broth" tt={tt} at={6.4} x={1300} y={600} w={420} from="up" />
    <Big tt={tt} at={3.8} x={960} y={130} txt="DOWN THE DRAIN?" size={110} out={6.0} />
    <Big tt={tt} at={6.2} x={960} y={130} txt="THE MOST VALUABLE PART" size={88} col={AMB} />
  </>;
}}</Stage>;

// 24 · 13:02 · ERROR Nº 1 · NO REVISARLOS: la mano barre los porotos por la mesa y queda a la vista la piedrita
export const CSift: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sw = eio(tt, 8.4, 9.6), hx = 1500 - 1000 * sw;
  return <>
    <BgB id="n_piedrita" tt={tt} dim={0.4} />
    {Array.from({ length: 90 }, (_, i) => { const bx = 380 + rnd(i) * 1160, by = 380 + rnd(i, 2) * 440, dx = bx > hx - 40 && sw > 0 ? Math.min(0, hx - 60 - bx) : 0;
      const s = phys(tt, 0.3 + rnd(i, 4) * 1.2, 8, 0.5); return <Bean key={i} x={bx + dx} y={by - 500 * (1 - s)} r={rnd(i, 3) * 180} s={1.3} col={["#9a6a46", "#c09070", "#7a4e32"][i % 3]} o={cl(s * 3)} />; })}
    {sw > 0.35 && <div style={{ position: "absolute", left: 1120 - 70, top: 600 - 70, width: 140, height: 140, borderRadius: "50%", boxShadow: `0 0 60px 20px rgba(255,200,120,${0.45 * eio(tt, 9.0, 9.6)})` }} />}
    <Spr id="sp_pebble" tt={tt} at={0.8} x={1120} y={600} w={110} from="none" />
    <Mv x={hx - 1500} o={cl((tt - 8.0) * 3)}><Spr id="sp_hand_flat" tt={tt} at={8.0} x={1600} y={560} w={600} rot={90} from="none" shadow={0} /></Mv>
    <Big tt={tt} at={7.7} x={960} y={130} txt="MISTAKE No. 1" size={110} col="#ffb070" out={8.9} />
    <Big tt={tt} at={9.0} x={960} y={130} txt="PICK THEM OVER" size={110} col={AMB} />
  </>;
}}</Stage>;

// 25 · 14:23 · LA SEMANA EN FAROLES: seis faroles en una viga; se van encendiendo cuando nombra cada día
export const CLanterns: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 40%, #1f1810, #050403 75%)">{(tt) => {
  const D = [["SAT", -1, ""], ["SUN", -1, ""], ["MON", -1, "No. 2"], ["TUE", 1.4, "No. 1"], ["WED", 5.6, "No. 4"], ["THU", 10.7, "No. 5"]] as const;
  return <>
    <div style={{ position: "absolute", left: 0, top: 170, width: 1920, height: 54, background: "linear-gradient(180deg,#5a3c22,#3a2414)", boxShadow: "0 10px 30px rgba(0,0,0,.6)" }} />
    {D.map(([d, at, n], i) => { const x = 260 + i * 280, on = at < 0 ? 1 : eio(tt, at, at + 0.7), sw = 3 * Math.sin(tt * 1.2 + i);
      return <div key={d} style={{ ...ABS, transformOrigin: `${x}px 224px`, transform: `rotate(${sw}deg)` }}>
        <div style={{ position: "absolute", left: x - 2, top: 224, width: 4, height: 80, background: "#2a2a2a" }} />
        <div style={{ position: "absolute", left: x - 170, top: 330, width: 340, height: 340, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,190,90,${0.55 * on}), rgba(255,140,40,${0.18 * on}) 45%, transparent 70%)` }} />
        <div style={{ ...ABS, filter: `brightness(${0.45 + 0.75 * on})` }}><Spr id="sp_lantern" tt={tt} at={0.2 + i * 0.12} x={x} y={470} w={250} from="none" shadow={0} /></div>
        <div style={{ position: "absolute", left: x, top: 500, width: 30, height: 46, transform: "translate(-50%,-50%)", borderRadius: "50% 50% 45% 45%", background: "radial-gradient(ellipse at 50% 65%, #fff3c0, #ffb040 55%, rgba(255,120,20,0) 80%)", opacity: on * (0.9 + 0.1 * Math.sin(tt * 3 + i)) }} />
        <div style={{ position: "absolute", left: x, top: 760, transform: "translate(-50%,-50%)", fontFamily: MARK, fontSize: 62, color: on > 0.5 ? "#ffe0a8" : "rgba(247,244,238,.35)" }}>{d}</div>
        {n && <div style={{ position: "absolute", left: x, top: 840, transform: "translate(-50%,-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: AMB, opacity: on }}>{n}</div>}
      </div>; })}
    <Big tt={tt} at={0.4} x={960} y={960} txt="NEVER THE SAME TWICE" size={84} col={TX} />
  </>;
}}</Stage>;

// 26 · 15:28 · ESTIRAR LA OLLA: entra agua caliente de la pava y la olla se ensancha; caen los dados de papa
export const CStretch: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const w = 1 + 0.28 * eio(tt, 2.2, 5.0) + 0.12 * eio(tt, 6.8, 8.6);
  return <>
    <BgB id="n_papa_dados" tt={tt} dim={0.5} />
    <Mv sx={w} sy={1 - 0.05 * (w - 1)} ox="960px 960px"><Spr id="sp_bigpot_side" tt={tt} at={0.2} x={960} y={700} w={700} /></Mv>
    <Mv x={260 * (1 - phys(tt, 1.2, 6, 0.6))} o={1 - eio(tt, 5.4, 6.0)}><Spr id="sp_kettle" tt={tt} at={1.2} x={1330} y={280} w={420} from="none" shadow={0} rot={-20} /></Mv>
    <Pour tt={tt} at={1.9} out={5.0} x={1180} y1={360} y2={560} col="rgba(220,235,245,.8)" w={22} />
    {Array.from({ length: 14 }, (_, i) => { const d = tt - 6.5 - i * 0.1; if (d < 0 || d > 0.7) return null; return <div key={i} style={{ position: "absolute", left: 700 + rnd(i) * 520, top: 160 + 400 * (d / 0.7) ** 2, width: 40, height: 40, background: "linear-gradient(135deg,#fff1cc,#e0c590)", borderRadius: 6, transform: `rotate(${d * 300}deg)`, boxShadow: "0 4px 8px rgba(0,0,0,.4)" }} />; })}
    <Spr id="sp_potato_dice" tt={tt} at={6.2} x={420} y={820} w={360} from="left" />
    <Steam tt={tt} x={960} y={420} w={300} k={0.6} />
    <Big tt={tt} at={1.9} x={960} y={120} txt="HOT WATER" size={120} out={6.3} />
    <Big tt={tt} at={6.5} x={960} y={120} txt="+ A POTATO OR TWO" size={100} out={9.4} />
    <Big tt={tt} at={9.6} x={960} y={120} txt="15 MINUTES MORE" size={110} col={AMB} />
  </>;
}}</Stage>;

// 27 · 16:36 · LA CAJA CON LATA: el ratón corre hacia los porotos, la tapa se cierra de golpe y el ratón se va
export const CMouse: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const run = eio(tt, 0.2, 1.3), shut = tt > 1.35, turn = eio(tt, 1.7, 2.1), away = eio(tt, 2.2, 3.4), bump = shut ? Math.exp(-6 * (tt - 1.35)) * Math.sin((tt - 1.35) * 30) * 10 : 0;
  return <>
    <BgB id="n_caja_lata" tt={tt} dim={0.45} />
    <Mv y={bump}>
      <Mv o={shut ? 0 : 1}><Spr id="sp_tinbox_open" tt={tt} at={0} x={1120} y={600} w={620} from="none" /></Mv>
      <Mv o={shut ? 1 : 0}><Spr id="sp_tinbox_closed" tt={tt} at={0} x={1120} y={620} w={620} from="none" /></Mv>
    </Mv>
    <Mv x={-700 + 520 * run - 900 * away}><div style={{ ...ABS, transformOrigin: "760px 800px", transform: `scaleX(${1 - 2 * turn})` }}><Spr id="sp_mouse" tt={tt} at={0} x={760} y={800} w={220} from="none" /></div></Mv>
    <Big tt={tt} at={1.5} x={960} y={130} txt="NO MICE" size={120} out={3.5} />
    <Big tt={tt} at={3.7} x={960} y={130} txt="GLASS JAR OR TIN" size={100} out={6.8} />
    <Big tt={tt} at={7.0} x={960} y={130} txt="4–5 DAYS · IN BROTH" size={100} col={AMB} />
  </>;
}}</Stage>;

// 28 · 17:10 · EL PORCHE CONGELADOR: la olla en la nieve y la escarcha que crece en cristales desde los bordes
export const CFrost: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fr = eio(tt, 7.6, 10.0);
  return <>
    <Bg id="n_porche" tt={tt} dim={0.4} />
    <Spr id="sp_pot_snow" tt={tt} at={6.0} x={960} y={660} w={680} />
    <svg style={ABS}>{Array.from({ length: 16 }, (_, i) => { const side = i % 4, base = rnd(i) * 1, x0 = side === 0 ? 0 : side === 1 ? 1920 : base * 1920, y0 = side < 2 ? base * 1080 : side === 2 ? 0 : 1080, ang = Math.atan2(540 - y0, 960 - x0) + (rnd(i, 2) - 0.5) * 0.8, L = 420 * fr * (0.6 + rnd(i, 3) * 0.6);
      const x1 = x0 + L * Math.cos(ang), y1 = y0 + L * Math.sin(ang);
      return <g key={i} stroke="rgba(225,240,255,.8)" strokeWidth={3} fill="none" opacity={0.85}>
        <line x1={x0} y1={y0} x2={x1} y2={y1} />
        {[0.3, 0.5, 0.7, 0.85].map((f) => { const px = x0 + (x1 - x0) * f, py = y0 + (y1 - y0) * f, l = 60 * fr * (1 - f); return <React.Fragment key={f}><line x1={px} y1={py} x2={px + l * Math.cos(ang + 0.8)} y2={py + l * Math.sin(ang + 0.8)} /><line x1={px} y1={py} x2={px + l * Math.cos(ang - 0.8)} y2={py + l * Math.sin(ang - 0.8)} /></React.Fragment>; })}
      </g>; })}</svg>
    <AbsoluteFill style={{ boxShadow: `inset 0 0 ${200 * fr}px ${40 * fr}px rgba(200,225,255,.35)` }} />
    <Big tt={tt} at={6.7} x={960} y={130} txt="THE PORCH" size={130} out={8.6} />
    <Big tt={tt} at={8.9} x={960} y={130} txt="FROZEN SOLID" size={130} col="#cfe8ff" />
  </>;
}}</Stage>;

// 29 · 17:45 · SIEMPRE GRASA: la olla gris y aguada recibe la cucharada de grasa y un brillo la recorre: queda llena
export const CGloss: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const sp = eio(tt, 6.0, 7.0), drop = eIn(tt, 7.2, 7.6), sheen = eio(tt, 7.7, 9.0), gl = eio(tt, 7.8, 8.8);
  return <>
    <BgB id="n_gris" tt={tt} dim={0.5} />
    <Mv o={1 - gl}><Spr id="sp_pot_grey" tt={tt} at={0.4} x={960} y={580} w={860} /></Mv>
    <Mv o={gl}><Spr id="sp_pot_glossy" tt={tt} at={0.4} x={960} y={580} w={860} from="none" /></Mv>
    <div style={{ position: "absolute", left: 960 - 430, top: 580 - 430, width: 860, height: 860, borderRadius: "50%", overflow: "hidden", opacity: sheen > 0 && sheen < 1 ? 1 : 0 }}>
      <div style={{ position: "absolute", left: -400 + 1400 * sheen, top: -200, width: 180, height: 1300, transform: "rotate(25deg)", background: "linear-gradient(90deg, transparent, rgba(255,240,200,.55), transparent)" }} />
    </div>
    <Mv x={400 * (1 - sp)} y={-300 * (1 - sp)} o={1 - eio(tt, 8.0, 8.6)}><Spr id="sp_grease_spoon" tt={tt} at={6.0} x={1180} y={260} w={420} rot={-30 + 40 * drop} from="none" shadow={0} /></Mv>
    {drop > 0 && drop < 1 && <div style={{ position: "absolute", left: 1040, top: 320 + 240 * drop, width: 60, height: 50, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fffdf2, #e8dcc0)" }} />}
    <Big tt={tt} at={0.9} x={960} y={120} txt="LOOKS LIKE YESTERDAY" size={90} out={4.6} />
    <Big tt={tt} at={5.0} x={960} y={120} txt="NEVER WITHOUT FAT" size={100} col={AMB} />
  </>;
}}</Stage>;

// 30 · 18:33 · TRES VECES: tres latas en fila caen como dominós una sobre otra; la bolsa aterriza firme y queda de pie
export const CDomino: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fall = (i: number) => eIn(tt, 5.2 + i * 0.28, 5.7 + i * 0.28);
  return <>
    <BgB id="n_latas_despensa" tt={tt} dim={0.5} />
    {[0, 1, 2].map((i) => { const x = 520 + i * 260; return <div key={i} style={{ ...ABS, transformOrigin: `${x + 120}px 900px`, transform: `rotate(${(i < 2 ? 62 : 82) * fall(i)}deg)` }}><Spr id="sp_can_tall" tt={tt} at={2.4 + i * 0.18} x={x} y={700} w={360} /></div>; })}
    <Spr id="sp_bag_big" tt={tt} at={12.0} x={1460} y={600} w={560} />
    <Big tt={tt} at={5.4} x={960} y={130} txt="3× THE PRICE" size={130} col="#ffb070" out={8.0} />
    <Big tt={tt} at={8.2} x={960} y={130} txt="AND NO BROTH" size={110} out={11.8} />
    <Big tt={tt} at={12.3} x={960} y={130} txt="THE BAG WINS" size={130} col={AMB} />
  </>;
}}</Stage>;

// 31 · 19:06 · OLLA A PRESIÓN: la olla aterriza y la válvula suelta un chorro fino de vapor que silba hacia arriba
export const CPressure: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const jet = eio(tt, 8.6, 9.2);
  return <>
    <BgB id="n_olla_presion" tt={tt} dim={0.5} />
    <Spr id="sp_pressure_cooker" tt={tt} at={4.2} x={960} y={680} w={700} />
    {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 1.3 + i * 0.1) % 1; return <div key={i} style={{ position: "absolute", left: 960 - 20 - 60 * ph + Math.sin(ph * 7 + i) * 18 * ph, top: 360 - 560 * ph, width: 40 + 140 * ph, height: 80 + 120 * ph, borderRadius: "50%", background: "rgba(255,255,255,.6)", filter: `blur(${10 + 30 * ph}px)`, opacity: jet * (1 - ph) * 0.8 }} />; })}
    <Big tt={tt} at={4.4} x={960} y={1000} txt="PRESSURE COOKER?" size={90} out={8.7} />
    <Big tt={tt} at={8.9} x={480} y={460} txt="35–40 MIN" size={120} col={AMB} />
    <Big tt={tt} at={10.6} x={1460} y={460} txt="NO SOAKING" size={100} />
  </>;
}}</Stage>;

// 32 · 20:30 · DEBAJO, CADA SEMANA: la bolsa llena aterriza y se va desinflando semana a semana, sin pasarse nunca
export const CSack: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const em = eio(tt, 7.6, 10.4), wk = Math.floor(cl((tt - 7.6) / 2.8) * 18);
  return <>
    <BgB id="n_semanas" tt={tt} dim={0.5} />
    <Mv o={1 - eio(tt, 9.6, 10.4)} sy={1 - 0.3 * em} sx={1 + 0.06 * em} ox="960px 940px"><Spr id="sp_sack_full" tt={tt} at={0.4} x={960} y={600} w={720} /></Mv>
    <Mv o={eio(tt, 9.6, 10.4)}><Spr id="sp_sack_empty" tt={tt} at={0.4} x={960} y={700} w={760} from="none" /></Mv>
    {/* rayitas a lápiz de las semanas, una por semana, al costado */}
    <svg style={ABS}>{Array.from({ length: wk }, (_, i) => { const g = Math.floor(i / 5), k = i % 5, x = 1420 + g * 110 + k * 18, y = 420; return k === 4 ? <line key={i} x1={x - 80} y1={y + 70} x2={x + 6} y2={y - 6} stroke="#f4ead2" strokeWidth={6} strokeLinecap="round" /> : <line key={i} x1={x} y1={y} x2={x} y2={y + 90} stroke="#f4ead2" strokeWidth={6} strokeLinecap="round" />; })}</svg>
    <Big tt={tt} at={2.9} x={960} y={130} txt="HE CLOSED THE BOOK" size={96} out={6.6} />
    <Big tt={tt} at={7.2} x={960} y={130} txt="UNDER, EVERY WEEK" size={110} col={AMB} />
  </>;
}}</Stage>;

// 33 · 21:53 · CENTAVOS EL PLATO: cinco centavos viejos entran rodando de canto, tambalean y caen planos en fila
export const CPennies: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  <BgB id="n_repaso" tt={tt} dim={0.45} />
  {Array.from({ length: 5 }, (_, i) => { const at = 8.4 + i * 0.25, x = 380 + i * 290, roll = eio(tt, at, at + 1.2), fl = eio(tt, at + 1.1, at + 1.6), wob = Math.sin((tt - at) * 16) * 12 * (1 - fl) * (roll > 0.85 ? 1 : 0);
    if (tt < at) return null;
    return <div key={i} style={{ position: "absolute", left: x - 1400 * (1 - roll) - 80, top: 560 - 80, width: 160, height: 160, transform: `perspective(900px) rotateX(${72 * fl}deg) rotate(${-(1 - roll) * 1080 + wob}deg)`, transformOrigin: "50% 100%" }}><Img src={spr("sp_penny_old")} style={{ width: 160, filter: "drop-shadow(0 14px 14px rgba(0,0,0,.5))" }} /></div>; })}
  <Big tt={tt} at={4.4} x={960} y={160} txt="THE CHEAPEST SUPPER" size={100} out={6.6} />
  <Big tt={tt} at={6.9} x={960} y={160} txt="ALREADY PAID FOR" size={100} out={8.3} />
  <Big tt={tt} at={9.0} x={960} y={160} txt="40 LOGGERS · ALL WINTER" size={88} out={10.7} />
  <Big tt={tt} at={10.9} x={960} y={880} txt="PENNIES A PLATE" size={140} col={AMB} />
</>}</Stage>;

export const HA: Record<string, C> = {
  c_ledger: CLedger, c_bowls: CBowls, c_axe: CAxe, c_store: CStore, c_cups: CCups, c_lazy: CLazy, c_sign: CSign, c_boil: CBoil,
  c_gravel: CGravel, c_lime: CLime, c_wash: CWash, c_dough: CDough, c_count: CCount, c_trinity: CTrinity, c_swirl: CSwirl,
  c_ripple: CRipple, c_pinch: CPinch, c_lid: CLid, c_patty: CPatty, c_stack: CStack, c_ladle: CLadle, c_matches: CMatches,
  c_drain: CDrain, c_sift: CSift, c_lanterns: CLanterns, c_stretch: CStretch, c_mouse: CMouse, c_frost: CFrost, c_gloss: CGloss,
  c_domino: CDomino, c_pressure: CPressure, c_sack: CSack, c_pennies: CPennies,
};
