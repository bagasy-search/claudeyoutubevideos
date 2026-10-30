// ole29c · RONDA 2 de los 33 componentes únicos (5 cenas de porotos). Cada pedido del evaluador hecho con el OBJETO
// haciendo la acción en la palabra exacta, sin carteles que expliquen; como mucho una palabra o un número grande.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { AMB, Big, H, MARK, Pour, Spr, Stage, Steam, cl, eio, phys, spr } from "./hkit";
import { BgB, Burst, CodePan, Cube, FireP, Glint, HH, Mv, Num3, OdoV, Planks, Tag2, W, WoodTop, rnd } from "./kit2";

type C = React.FC<{ t: number; h: H }>;
// poroto suelto dibujado (cae, rueda, se empuja)
const Bean: React.FC<{ x: number; y: number; r?: number; s?: number; col?: string; o?: number; dry?: number }> = ({ x, y, r = 0, s = 1, col = "#8a5636", o = 1, dry = 0 }) =>
  <div style={{ position: "absolute", left: x - 15 * s, top: y - 9 * s, width: 30 * s, height: 18 * s, borderRadius: "50%", opacity: o, transform: `rotate(${r}deg)`, background: dry > 0.5 ? `radial-gradient(ellipse at 35% 30%, #a9a39a, #6f6a62 55%, #3e3a35)` : `radial-gradient(ellipse at 35% 30%, rgba(255,255,255,.5), ${col} 45%, rgba(0,0,0,.55))`, boxShadow: "0 4px 5px rgba(0,0,0,.45)" }} />;
// superficie de caldo vista de arriba (para burbujas, remolinos, brillo)
const Broth: React.FC<{ x: number; y: number; r: number; col?: string; sy?: number; children?: React.ReactNode }> = ({ x, y, r, col = "#4a2a18", sy = 1, children }) => <div style={{ position: "absolute", left: x - r, top: y - r * sy, width: 2 * r, height: 2 * r * sy, borderRadius: "50%", overflow: "hidden", background: `radial-gradient(ellipse at 40% 35%, ${col}, #1a0e08 85%)`, boxShadow: `0 0 0 ${r * 0.08}px #1c1c1c, 0 0 0 ${r * 0.1}px #3a3a3a, 0 40px 70px rgba(0,0,0,.7), inset 0 ${r * 0.06}px ${r * 0.1}px rgba(0,0,0,.7)` }}>{children}</div>;

// 1 · EL LIBRO DEL JEFE: el libro cae al lado de la estufa, la tapa se abre en bisagra, el lápiz marca UNA fila que se enciende
export const CLedger: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const open = eio(tt, 4.7, 5.7), hand = eio(tt, 5.6, 6.6) * (1 - eio(tt, 9.4, 10.0)), und = eio(tt, 7.9, 9.0), foc = eio(tt, 7.6, 8.4), up = eio(tt, 10.1, 11.0);
  const RY = 606, LX = 1220;
  return <>
    <BgB id="n_libro_jefe" tt={tt} dim={0.7} />
    <Planks y={640} />
    <FireP tt={tt} x={420} y={640} w={240} k={0.8} n={14} />
    <Spr id="sp_c2_stove" tt={tt} at={0.2} x={420} y={520} w={640} from="left" />
    <Mv p="perspective(1600px) rotateX(38deg)" ox={LX} oy={700}>
      <Spr id="sp_c2_ledger_page" tt={tt} at={2.5} x={LX} y={640} w={860} />
      {/* la fila del costo por hombre por día: las demás se apagan, ésta se enciende */}
      <div style={{ position: "absolute", left: LX - 430, top: 250, width: 860, height: RY - 30 - 250, background: "rgba(10,6,2,.55)", opacity: foc }} />
      <div style={{ position: "absolute", left: LX - 430, top: RY + 30, width: 860, height: 380, background: "rgba(10,6,2,.55)", opacity: foc }} />
      <div style={{ position: "absolute", left: LX - 400, top: RY - 30, width: 800, height: 60, background: "linear-gradient(90deg, rgba(255,160,60,.0), rgba(255,170,70,.32) 20%, rgba(255,170,70,.32) 80%, rgba(255,160,60,0))", opacity: foc, mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", left: LX - 360, top: RY + 22, width: 720 * und, height: 7, borderRadius: 4, background: "#2a1608", transform: "rotate(-0.6deg)" }} />
      {/* la cifra de esa fila sube */}
      {up > 0 && <div style={{ position: "absolute", left: LX + 240, top: RY - 34, fontFamily: MARK, fontSize: 58, color: `rgb(${120 + 110 * up},${40},${20})`, transform: `translateY(${-14 * up}px)` }}>↑</div>}
      {/* la tapa de cuero gira sobre el lomo */}
      {tt > 2.4 && open < 1 && <div style={{ position: "absolute", left: LX - 430, top: 240, width: 860, height: 800, transformOrigin: "0 50%", transform: `perspective(1400px) rotateY(${-178 * open}deg)`, backfaceVisibility: "hidden" }}><Spr id="sp_c2_ledger_closed" tt={tt} at={2.5} x={430} y={400} w={860} shadow={0} /></div>}
    </Mv>
    {hand > 0.01 && <Mv x={(LX - 140) - 960 + 260 * und + 500 * (1 - hand)} y={RY - 560 - 320 * (1 - hand) + 4 * Math.sin(tt * 7) * und}><Spr id="sp_c2_hand_pencil" tt={tt} at={-5} x={960} y={420} w={420} from="none" shadow={0} /></Mv>}
  </>;
}}</Stage>;

// 2 · CINCO CENAS: los cinco tazones entran de a uno por el tablón y frenan; les cae un centavo; rueda el centavo viejo
export const CBowls: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const B = ["sp_bowl_black", "sp_bowl_red", "sp_bowl_bacon", "sp_bowl_cakes", "sp_bowl_tin_soup"];
  const rl = eio(tt, 8.2, 9.2), wob = Math.max(0, tt - 9.2), cx = 2100 - (2100 - 960) * rl;
  return <>
    <BgB id="n_cinco_platos" tt={tt} dim={0.7} />
    <Planks y={600} />
    {B.map((id, i) => { const at = 1.8 + i * 0.42, p = phys(tt, at, 5.2, 0.62), x = 330 + i * 315 + 1500 * (1 - p), d = Math.max(0, tt - at - 0.35), slosh = 6 * Math.exp(-3 * d) * Math.sin(d * 14); return <Mv key={id} r={slosh * 0.3} ox={x} oy={720}><Spr id={id} tt={tt} at={-5} x={x} y={640} w={290} from="none" /></Mv>; })}
    {B.map((_, i) => <React.Fragment key={i}><Spr id="sp_penny" tt={tt} at={5.9 + i * 0.16} x={330 + i * 315} y={850} w={78} rot={rnd(i) * 60} /><Burst tt={tt} at={6.15 + i * 0.16} x={330 + i * 315} y={870} n={5} col="#ffd9a0" sp={160} sz={5} life={0.4} /></React.Fragment>)}
    {/* el centavo viejo entra rodando de canto y se tambalea hasta caer plano */}
    {tt > 8.2 && <div style={{ position: "absolute", left: cx, top: 930, width: 0, height: 0 }}><Img src={spr("sp_penny_old")} style={{ position: "absolute", left: -90, top: -90, width: 180, transform: `rotate(${(1 - rl) * 720}deg) scaleY(${tt < 9.2 ? 1 : 0.35 + 0.65 * Math.abs(Math.cos(wob * 9)) * Math.exp(-2.5 * wob)})`, filter: "drop-shadow(0 10px 10px rgba(0,0,0,.6))" }} /></div>}
    <Glint tt={tt} at={9.9} x={960} y={930} r={110} />
  </>;
}}</Stage>;

// 3 · POR QUÉ POROTOS: en la nieve, el hacha sube y baja en arco y se clava en el tronco; saltan astillas; el termómetro cae a -20
export const CAxe: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 45%, #2b3644, #0a0e14 75%)">{(tt) => {
  const raise = eio(tt, 6.6, 7.3), swing = eio(tt, 7.5, 8.0), stuck = tt > 8.0, shake = stuck ? Math.exp(-6 * (tt - 8.0)) * Math.sin((tt - 8.0) * 50) : 0;
  const ang = stuck ? -8 + 2 * shake : -8 - 120 * raise + 120 * swing, merc = 1 - eio(tt, 10.4, 11.6);
  return <>
    <BgB id="n_hacha_frio" tt={tt} dim={0.62} />
    <div style={{ position: "absolute", left: -100, top: 760, width: 2120, height: 420, borderRadius: "50% 50% 0 0 / 30% 30% 0 0", background: "linear-gradient(180deg,#eef3f8,#c9d4de)", boxShadow: "inset 0 20px 40px rgba(120,140,170,.5)" }} />
    {Array.from({ length: 50 }, (_, i) => { const x = (rnd(i, 3) * 2000 + 20 * Math.sin(tt * 0.6 + i)) % 1980, y = ((rnd(i, 4) * 1100 + tt * (40 + 50 * rnd(i, 5))) % 1100) - 20, s = 3 + rnd(i, 6) * 8; return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "#fff", opacity: 0.7, filter: `blur(${s > 8 ? 2 : 0}px)` }} />; })}
    <Mv y={6 * shake}><Spr id="sp_c2_stump" tt={tt} at={0.4} x={900} y={700} w={560} /></Mv>
    {/* el hacha gira desde el puño (borde izquierdo del mango) */}
    <Mv x={-30 * raise} y={12 * shake} r={ang} ox={560} oy={600} o={eio(tt, 6.2, 6.6)}><Spr id="sp_axe" tt={tt} at={-5} x={800} y={600} w={560} from="none" shadow={0} /></Mv>
    <Burst tt={tt} at={8.0} x={1010} y={560} n={18} col="#d9b27a" sp={620} sz={14} life={1.0} />
    <Burst tt={tt} at={8.02} x={1010} y={560} n={12} col="#f6f1e6" sp={420} sz={8} life={0.8} />
    {/* termómetro de mercurio: la columna roja cae en "20 below" */}
    <Mv x={0} y={0}><Spr id="sp_c2_thermometer" tt={tt} at={9.6} x={1560} y={470} w={300} from="right" /></Mv>
    {tt > 9.6 && <div style={{ position: "absolute", left: 1553, top: 330 + 330 * (1 - merc), width: 14, height: 330 * merc, borderRadius: 7, background: "linear-gradient(90deg,#9a1010,#e83a2a,#9a1010)", opacity: cl((tt - 9.8) * 3) }} />}
    {/* aliento helado */}
    {tt > 10.8 && [0, 1, 2].map((i) => { const ph = ((tt - 10.8) * 0.5 + i * 0.33) % 1; return <div key={i} style={{ position: "absolute", left: 1280 + ph * 160, top: 330 - ph * 60, width: 120 + 120 * ph, height: 70 + 50 * ph, borderRadius: "50%", background: "rgba(230,240,250,.6)", filter: "blur(18px)", opacity: Math.sin(ph * Math.PI) * 0.8 }} />; })}
  </>;
}}</Stage>;

// 4 · LA CARNE CONTRA LA BOLSA: el tocino cuelga y se hamaca con su etiqueta cara; la bolsa de 100 lb cae y sacude todo
export const CStore: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const land = 7.75, hit = tt > land ? Math.exp(-3 * (tt - land)) * Math.sin((tt - land) * 9) : 0, sw = 4 * Math.sin(tt * 1.3) + 18 * hit;
  const fall = phys(tt, 7.3, 8, 0.45), dust = eio(tt, land, land + 1.2);
  return <>
    <BgB id="n_carne_cara" tt={tt} dim={0.66} />
    <Planks y={820} />
    <div style={{ position: "absolute", left: 0, top: 60, width: W, height: 34, background: "linear-gradient(180deg,#5a3a20,#2e1c0e)", boxShadow: "0 14px 26px rgba(0,0,0,.6)" }} />
    <Mv r={sw} ox={560} oy={80}>
      <div style={{ position: "absolute", left: 556, top: 80, width: 8, height: 100, background: "linear-gradient(90deg,#666,#bbb,#555)" }} />
      <Spr id="sp_saltpork_hook" tt={tt} at={-5} x={560} y={460} w={420} from="none" shadow={0} />
      <Tag2 tt={tt} at={3.1} x={700} y={330} txt="$$$" w={240} fs={84} />
    </Mv>
    <Mv y={(1 - fall) * -900 + 8 * hit} sy={1 - 0.05 * hit} ox={1340} oy={900}><Spr id="sp_sack100" tt={tt} at={-5} x={1340} y={560} w={560} from="none" shadow={0} /></Mv>
    <div style={{ position: "absolute", left: 1340 - 260, top: 870, width: 520, height: 60, borderRadius: "50%", background: "rgba(0,0,0,.55)", filter: "blur(16px)", opacity: cl(fall) }} />
    {dust > 0 && dust < 1 && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 1340 - 380 + i * 170 + (i - 2) * 160 * dust, top: 820 - 140 * dust, width: 220, height: 160, borderRadius: "50%", background: "rgba(245,238,225,.7)", filter: "blur(26px)", opacity: Math.sin(dust * Math.PI) * 0.8 }} />)}
    <Tag2 tt={tt} at={9.7} x={1340} y={110} txt="1¢" w={240} fs={100} />
  </>;
}}</Stage>;

// 5 · UNA LIBRA = UNA LATA: la balanza de latón se equilibra entre la bolsa y la lata; después la bolsa llena seis tazas
export const CCups: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const tip = -9 * eio(tt, 2.0, 2.6) * (1 - eio(tt, 5.8, 6.8)) + 2 * Math.sin(tt * 2) * Math.exp(-2 * Math.max(0, tt - 6.8)) * cl((tt - 6.8) * 4);
  const go = eio(tt, 8.0, 8.6), C6 = [9.0, 9.4, 9.8, 10.1, 10.4, 10.7];
  const pans = [[760, 540 + 8 * tip], [1160, 540 - 8 * tip]];
  return <>
    <BgB id="n_bolsa_vs_lata" tt={tt} dim={0.66} />
    <Planks y={820} />
    <Mv y={-640 * go} o={1 - go}>
      <Spr id="sp_c2_scale" tt={tt} at={0.2} x={960} y={520} w={760} from="up" />
      <Mv y={pans[0][1] - 540}><Spr id="sp_bag1lb" tt={tt} at={2.0} x={760} y={360} w={190} shadow={0} /></Mv>
      <Mv y={pans[1][1] - 540}><Spr id="sp_c2_bean_can" tt={tt} at={6.0} x={1160} y={380} w={170} shadow={0} /></Mv>
      <Glint tt={tt} at={7.0} x={960} y={250} r={110} />
    </Mv>
    {/* la bolsa se vuelca y llena las seis tazas de a una */}
    <Mv x={0} y={0} r={go * 115} ox={420} oy={320} o={go}><Spr id="sp_bag1lb" tt={tt} at={-5} x={420} y={320} w={210} from="none" shadow={0} /></Mv>
    {C6.map((a, i) => { const x = 520 + i * 230, f = eio(tt, a, a + 0.35); return <React.Fragment key={i}>
      <Spr id={f > 0.6 ? "sp_tincup_full" : "sp_tincup_empty"} tt={tt} at={8.3 + i * 0.08} x={x} y={780} w={190} />
      {f > 0 && f < 1 && Array.from({ length: 8 }, (_, j) => <Bean key={j} x={x + (rnd(j + i * 9) - 0.5) * 40} y={620 + ((f * 3 + j * 0.13) % 1) * 140} r={j * 47} s={0.8} col="#b98a62" />)}
    </React.Fragment>; })}
    <Steam tt={tt} x={960} y={660} w={180} k={0.7 * eio(tt, 9.5, 10.5)} />
  </>;
}}</Stage>;

// 6 · CADA NOCHE OTRA: la bandeja giratoria de madera gira con inercia y frena con otra cena al frente; la hoja del calendario cae
export const CLazy: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = ["sp_tb_soup", "sp_tb_red", "sp_tb_cakes", "sp_tb_bacon", "sp_tb_pot"];
  const turns = [0, 2.1, 6.4, 10.5], idx = turns.filter((x) => tt > x).length - 1, rot = idx * 72 + 72 * eio(tt, turns[idx], turns[idx] + 1.2) - 72;
  const ang = rot + (tt > 10.5 ? 0 : 0), bag = phys(tt, 11.3, 6, 0.5);
  const CX = 960, CY = 640, R = 330;
  return <>
    <BgB id="n_hombres_comen" tt={tt} dim={0.7} />
    <Planks y={560} />
    {/* la bandeja: disco grueso de madera en perspectiva */}
    <div style={{ position: "absolute", left: CX - 520, top: CY - 150 + 46, width: 1040, height: 300, borderRadius: "50%", background: "linear-gradient(180deg,#5a3a1e,#2e1c0c)", boxShadow: "0 50px 70px rgba(0,0,0,.65)" }} />
    <div style={{ position: "absolute", left: CX - 520, top: CY - 150, width: 1040, height: 300, borderRadius: "50%", background: `repeating-radial-gradient(ellipse at 50% 50%, #8a6038 0 9px, #7a5230 9px 18px)`, boxShadow: "inset 0 0 0 10px #6a4426, inset 0 6px 16px rgba(255,220,170,.25)" }} />
    {D.map((id, i) => { const a = ((i * 72 - ang + 90) * Math.PI) / 180, x = CX + Math.cos(a) * R * 1.2, y = CY + Math.sin(a) * R * 0.34, front = (Math.sin(a) + 1) / 2, s = 0.62 + 0.48 * front; return { id, x, y, s, z: front }; }).sort((a, b) => a.z - b.z).map((o) => <div key={o.id} style={{ position: "absolute", left: o.x, top: o.y, width: 0, height: 0, filter: `brightness(${0.55 + 0.5 * o.z})` }}><Img src={spr(o.id)} style={{ position: "absolute", left: -150 * o.s, top: -110 * o.s - 50, width: 300 * o.s, transform: "scaleY(.62)", transformOrigin: "50% 100%", filter: "drop-shadow(0 16px 14px rgba(0,0,0,.5))" }} /></div>)}
    {/* hoja de calendario que cae cada noche */}
    {[1, 2, 3].map((n, i) => { const a = turns[i + 1] - 0.3, p = phys(tt, a, 6.5, 0.5), gone = eio(tt, (turns[i + 2] ?? 99) - 0.4, (turns[i + 2] ?? 99) + 0.3); if (p <= 0.01 || gone >= 1) return null; return <div key={n} style={{ position: "absolute", left: 1600, top: 170 - 500 * (1 - p) + 700 * gone, transform: `rotate(${-6 + 40 * gone}deg)`, opacity: 1 - gone, width: 220, height: 250, borderRadius: 8, background: "linear-gradient(180deg,#b8221a 0 22%, #f6efe0 22%)", boxShadow: "0 20px 30px rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 50, boxSizing: "border-box", fontFamily: MARK, fontSize: 130, color: "#2a1a10" }}>{n}</div>; })}
    {bag > 0.01 && <Mv y={(1 - bag) * -700}><Spr id="sp_c2_burlap_full" tt={tt} at={-5} x={960} y={420} w={300} from="none" /></Mv>}
  </>;
}}</Stage>;

// 7 · CENA Nº 1: en el tablón colgado de dos cadenas, una brasa quema el 1; después baja la olla de sopa negra con lima
export const CSign: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const burn = eio(tt, 0.4, 1.6), pot = phys(tt, 2.8, 7, 0.5), sw = 2.2 * Math.sin(tt * 1.1) * Math.exp(-0.3 * tt);
  const pts = [[0, 0.15], [0.16, 0], [0.16, 1]], seg = burn * 2, tip = seg < 1 ? [pts[0][0] + (pts[1][0] - pts[0][0]) * seg, pts[0][1] + (pts[1][1] - pts[0][1]) * seg] : [pts[1][0], (seg - 1)];
  const BX = 960, BY = 200, sz = 300;
  return <>
    <BgB id="n_sopa_negra" tt={tt} dim={0.72} />
    <Planks y={860} dark />
    <Mv r={sw} ox={BX} oy={0}>
      {[-360, 360].map((dx) => <div key={dx} style={{ position: "absolute", left: BX + dx - 5, top: -20, width: 10, height: BY + 30, background: "repeating-linear-gradient(180deg,#9a9a9a 0 14px,#4a4a4a 14px 18px)" }} />)}
      <Spr id="sp_plank" tt={tt} at={-5} x={BX} y={BY + 90} w={980} from="none" shadow={0} style={{ filter: "brightness(1.05) drop-shadow(0 24px 30px rgba(0,0,0,.6))" }} />
      {/* el 1 quemado: surco carbonizado detrás de la brasa */}
      <svg width={W} height={HH} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={`M${BX - 40} ${BY + 10 + sz * 0.15 * 0.6} L${BX - 40 + sz * 0.16 * Math.min(1, seg)} ${BY + 10 + sz * 0.6 * 0.15 * (1 - Math.min(1, seg))} ${seg > 1 ? `L${BX - 40 + sz * 0.16} ${BY + 10 + sz * 0.6 * (seg - 1)}` : ""}`} stroke="#1a0c04" strokeWidth={26} strokeLinecap="round" fill="none" />
        <path d={`M${BX - 40} ${BY + 10 + sz * 0.15 * 0.6} L${BX - 40 + sz * 0.16 * Math.min(1, seg)} ${BY + 10 + sz * 0.6 * 0.15 * (1 - Math.min(1, seg))} ${seg > 1 ? `L${BX - 40 + sz * 0.16} ${BY + 10 + sz * 0.6 * (seg - 1)}` : ""}`} stroke="rgba(255,120,40,.35)" strokeWidth={34} strokeLinecap="round" fill="none" style={{ filter: "blur(6px)" }} opacity={1 - eio(tt, 1.6, 3)} />
      </svg>
      <div style={{ position: "absolute", left: BX - 290, top: BY + 40, fontFamily: MARK, fontSize: 96, color: "#24130a", textShadow: "0 1px 0 rgba(255,200,140,.25)", opacity: eio(tt, 0.1, 0.4) }}>No.</div>
      {burn > 0 && burn < 1 && <div style={{ position: "absolute", left: BX - 40 + sz * 0.16 * tip[0] / 0.16 - 18, top: BY + 10 + sz * 0.6 * tip[1] - 18, width: 36, height: 36, borderRadius: "50%", background: "radial-gradient(circle,#fff6c0,#ff9a30 45%,rgba(255,60,10,0) 75%)", boxShadow: "0 0 30px 10px rgba(255,120,30,.6)" }} />}
      {burn > 0 && burn < 1 && [0, 1, 2].map((i) => { const ph = (tt * 1.2 + i * 0.33) % 1; return <div key={i} style={{ position: "absolute", left: BX - 40 + sz * 0.16 * tip[0] / 0.16 - 20 + 20 * Math.sin(ph * 6), top: BY - 20 + sz * 0.6 * tip[1] - ph * 120, width: 40, height: 50, borderRadius: "50%", background: "rgba(80,70,60,.5)", filter: "blur(10px)", opacity: Math.sin(ph * Math.PI) }} />; })}
    </Mv>
    <Mv y={(1 - pot) * -800}><Spr id="sp_soup_lime" tt={tt} at={-5} x={960} y={700} w={560} from="none" /></Mv>
    <Steam tt={tt} x={960} y={600} w={170} k={0.8 * cl(pot)} />
  </>;
}}</Stage>;

// 8 · HERVOR FUERTE, DESPUÉS SUSURRO: la olla de vidrio se llena, la llama crece, el agua hierve a borbotones y después se calma
export const CBoil: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 60%, #241a12, #060504 75%)">{(tt) => {
  const fill = eio(tt, 3.0, 4.8), flame = eio(tt, 5.4, 6.2) * (1 - 0.6 * eio(tt, 8.2, 9.2)), boil = eio(tt, 5.9, 6.6) * (1 - 0.85 * eio(tt, 8.4, 9.4)), dial = eio(tt, 6.8, 8.2);
  const PX = 960, TOP = 420, BOT = 740, WL = BOT - (BOT - TOP) * 0.82 * fill;
  return <>
    <BgB id="n_diez_tazas" tt={tt} dim={0.78} />
    <FireP tt={tt} x={PX} y={860} w={560 + 300 * flame} k={0.35 + 0.65 * flame} n={24} />
    <Pour tt={tt} at={3.0} out={4.8} x={PX - 140} y1={120} y2={WL} col="rgba(170,210,235,.75)" w={26} />
    {/* agua en corte, detrás del vidrio */}
    <div style={{ position: "absolute", left: PX - 300, top: WL, width: 600, height: BOT - WL, background: "linear-gradient(180deg, rgba(150,190,215,.45), rgba(90,120,140,.55))", borderRadius: "0 0 30px 30px" }} />
    {Array.from({ length: 30 }, (_, i) => { const f = 0.7 + 0.8 * rnd(i, 2), ph = (tt * f * (0.6 + 1.6 * boil) + rnd(i, 3)) % 1, s = (10 + 22 * rnd(i, 4)) * (0.4 + 0.8 * boil); const y = BOT - 30 - ph * (BOT - 30 - WL); return fill > 0.5 && <div key={i} style={{ position: "absolute", left: PX - 260 + rnd(i, 5) * 520 + 8 * Math.sin(ph * 8 + i) - s / 2, top: y - s / 2, width: s, height: s, borderRadius: "50%", border: "2px solid rgba(240,250,255,.8)", background: "rgba(255,255,255,.15)", opacity: (i < 6 ? 1 : boil) * Math.sin(ph * Math.PI) }} />; })}
    {boil > 0.2 && Array.from({ length: 6 }, (_, i) => <Burst key={i} tt={tt} at={6.2 + i * 0.35} x={PX - 220 + rnd(i, 7) * 440} y={WL} n={5} col="rgba(220,240,255,.9)" sp={220} sz={7} life={0.45} />)}
    <Spr id="sp_glass_pot" tt={tt} at={0.4} x={PX} y={590} w={760} shadow={0} style={{ opacity: 0.92 }} />
    <Steam tt={tt} x={PX} y={WL - 40} w={260} k={1.3 * boil + 0.3 * fill} />
    {/* reloj de 10 minutos: la aguja da la vuelta */}
    <div style={{ position: "absolute", left: 1530, top: 300, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f8f1e0, #d8c9a8)", boxShadow: "0 0 0 10px #6a4a2c, 0 24px 40px rgba(0,0,0,.6)", opacity: eio(tt, 6.4, 6.9) }}>
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 107, top: 10, width: 6, height: 20, background: "#3a2a1a", transformOrigin: "3px 100px", transform: `rotate(${i * 36}deg)` }} />)}
      <div style={{ position: "absolute", left: 107, top: 30, width: 6, height: 80, borderRadius: 3, background: "#b8221a", transformOrigin: "3px 80px", transform: `rotate(${360 * dial}deg)` }} />
      <div style={{ position: "absolute", left: 98, top: 98, width: 24, height: 24, borderRadius: "50%", background: "#3a2a1a" }} />
    </div>
  </>;
}}</Stage>;

// 9 · ÁCIDO TEMPRANO: la lima cae, abre anillos en el caldo, y los porotos se vuelven piedras; la cuchara rebota en ellos
export const CGravel: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const fall = eio(tt, 2.2, 2.6), hit = tt > 2.6, rip = eio(tt, 2.6, 3.8), hard = eio(tt, 5.8, 8.6), sp = eio(tt, 8.8, 9.2), bounce = tt > 9.2 ? Math.exp(-5 * (tt - 9.2)) * Math.abs(Math.sin((tt - 9.2) * 12)) : 0;
  const CX = 960, CY = 600, R = 330;
  return <>
    <BgB id="n_cascara_dura" tt={tt} dim={0.72} />
    <Mv y={(1 - phys(tt, 0.2, 5.5, 0.6)) * 500}>
      <Broth x={CX} y={CY} r={R} col="#3a2616">
        {Array.from({ length: 46 }, (_, i) => { const a = rnd(i, 1) * Math.PI * 2, d = Math.sqrt(rnd(i, 2)) * R * 0.86, at = 5.8 + rnd(i, 3) * 2.6, k = eio(tt, at, at + 0.4); return <Bean key={i} x={R + Math.cos(a) * d} y={R + Math.sin(a) * d} r={rnd(i, 4) * 180} s={1.5 - 0.15 * k} col="#5a3420" dry={k} />; })}
        {hit && [0, 1, 2].map((i) => { const k = cl(rip * 1.6 - i * 0.3); return k > 0 && k < 1 && <div key={i} style={{ position: "absolute", left: R + 40 - 260 * k, top: R - 30 - 260 * k, width: 520 * k, height: 520 * k, borderRadius: "50%", border: `4px solid rgba(255,230,190,${0.6 * (1 - k)})` }} />; })}
      </Broth>
    </Mv>
    {tt > 2.0 && <Mv y={-560 * (1 - fall)} o={1 - eio(tt, 3.0, 3.6)}><Spr id="sp_lime_whole" tt={tt} at={-5} x={CX + 40} y={CY - 30} w={170 - 40 * cl((tt - 2.6) * 2)} from="none" shadow={0} /></Mv>}
    <Burst tt={tt} at={2.6} x={CX + 40} y={CY - 30} n={12} col="rgba(200,170,120,.9)" sp={360} sz={10} life={0.6} />
    {tt > 8.6 && <Mv y={-500 * (1 - sp) - 90 * bounce} r={-30 + 8 * bounce} ox={CX + 200} oy={CY}><Spr id="sp_spoon2" tt={tt} at={-5} x={CX + 220} y={CY - 40} w={520} from="none" shadow={0} /></Mv>}
    <Big tt={tt} at={8.8} x={CX} y={150} txt="GRAVEL" size={130} col={AMB} />
  </>;
}}</Stage>;

// 10 · LA LIMA AL FINAL: la lima se parte con un tajo de luz y se abre como un libro; cada gota cae en un tazón de la fila
export const CLime: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const cut = eio(tt, 6.4, 6.8), open = eio(tt, 6.8, 7.5), rowIn = (i: number) => phys(tt, 8.4 + i * 0.12, 6.5, 0.55);
  const T = Array.from({ length: 8 }, (_, i) => ({ x: 440 + (i % 4) * 350 + (Math.floor(i / 4) ? 175 : 0), y: Math.floor(i / 4) ? 880 : 700 }));
  return <>
    <BgB id="n_ocho_tazones" tt={tt} dim={0.7} />
    <Planks y={620} />
    <div style={{ position: "absolute", left: 960, top: 340, width: 0, height: 0 }}>
      {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: -150 + s * 110 * open, top: -150, width: 300, height: 300, transform: `rotate(${s * 18 * open}deg)` }}>
        <Img src={spr("sp_lime_big")} style={{ position: "absolute", left: 0, top: 0, width: 300, clipPath: s < 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)", filter: "drop-shadow(0 18px 22px rgba(0,0,0,.5))" }} />
        {/* la cara cortada con gajos */}
        {open > 0 && <div style={{ position: "absolute", left: s < 0 ? 150 - 20 * open : 150 - 0, top: 18, width: 20 * open + 2, height: 264, borderRadius: s < 0 ? "50% 0 0 50%" : "0 50% 50% 0", background: "radial-gradient(ellipse at 50% 50%, #e8f7a0, #a8d040 70%, #e8f0c0)", transform: `scaleX(${s})` }} />}
      </div>)}
      {cut > 0 && cut < 1 && <div style={{ position: "absolute", left: -4, top: -170 + 340 * cut - 60, width: 8, height: 120, background: "linear-gradient(180deg, transparent, #fffbe0, transparent)", boxShadow: "0 0 24px 8px rgba(255,250,200,.8)" }} />}
    </div>
    {T.map((p, i) => { const k = rowIn(i), d = eio(tt, 9.0 + i * 0.12, 9.35 + i * 0.12); return <React.Fragment key={i}>
      <Mv y={(1 - k) * 600}><Spr id="sp_bowl_black" tt={tt} at={-5} x={p.x} y={p.y} w={230} from="none" /></Mv>
      {d > 0 && d < 1 && <div style={{ position: "absolute", left: 960 + (p.x - 960) * d - 9, top: 400 + (p.y - 420) * d - 12, width: 18, height: 24, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: "radial-gradient(circle at 40% 30%, #f6ffd0, #a8d040)" }} />}
      {(() => { const r = eio(tt, 9.35 + i * 0.12, 10.1 + i * 0.12); return r > 0 && r < 1 && <div style={{ position: "absolute", left: p.x - 70 * r, top: p.y - 30 * r - 20, width: 140 * r, height: 60 * r, borderRadius: "50%", border: `3px solid rgba(220,250,170,${0.8 * (1 - r)})` }} />; })()}
    </React.Fragment>; })}
  </>;
}}</Stage>;

// 11 · CENA Nº 2 · DÍA DE LAVADO: la olla de porotos rojos humea en la estufa; delante se cuelga la ropa en la soga que se comba
export const CWash: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const CL = [["sp_shirt", 4.5, 520], ["sp_longjohns", 5.8, 960], ["sp_socks", 7.0, 1400]] as const;
  const dep = CL.map(([, a]) => (tt < a ? 0 : 40 + 30 * phys(tt, a + 0.3, 7, 0.35))), px = CL.map((c) => c[2]);
  const ry = (x: number) => 220 + px.reduce((s, p, i) => s + dep[i] * Math.exp(-(((x - p) / 260) ** 2)), 0);
  const potFoc = eio(tt, 8.2, 9.4);
  return <>
    <BgB id="n_dia_lavado" tt={tt} dim={0.6} />
    <Planks y={860} dark />
    <Mv s={1 + 0.08 * potFoc} ox={960} oy={800} f={`brightness(${0.7 + 0.4 * potFoc})`}>
      <FireP tt={tt} x={960} y={900} w={360} k={0.7} n={14} />
      <Spr id="sp_c2_cauldron" tt={tt} at={0.4} x={960} y={760} w={520} />
      <Steam tt={tt} x={960} y={600} w={200} k={1} />
    </Mv>
    <svg width={W} height={HH} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={"M" + Array.from({ length: 49 }, (_, i) => `${-20 + i * 40} ${ry(-20 + i * 40).toFixed(1)}`).join(" L")} stroke="rgba(0,0,0,.4)" strokeWidth={10} fill="none" transform="translate(4 10)" style={{ filter: "blur(4px)" }} />
      <path d={"M" + Array.from({ length: 49 }, (_, i) => `${-20 + i * 40} ${ry(-20 + i * 40).toFixed(1)}`).join(" L")} stroke="#d8c8a6" strokeWidth={7} fill="none" />
    </svg>
    {CL.map(([id, a, x]) => { const p = phys(tt, a, 5.5, 0.55); if (p <= 0.01) return null; const xx = x + 1300 * (1 - p), y0 = ry(xx), d = Math.max(0, tt - a - 0.5), sw = -16 * (1 - p) + 7 * Math.exp(-1.2 * d) * Math.sin(d * 4.5) + 1.2 * Math.sin(tt * 0.9 + x); return <Mv key={id} r={sw} ox={xx} oy={y0}>
      <Spr id={id} tt={tt} at={-5} x={xx} y={y0 + 230} w={id === "sp_socks" ? 260 : 380} from="none" shadow={0} />
      {[-60, 60].map((o) => <div key={o} style={{ position: "absolute", left: xx + o - 15, top: y0 - 40, width: 30 }}><Img src={spr("sp_c2_clothespin")} style={{ width: 30 }} /></div>)}
    </Mv>; })}
    <Big tt={tt} at={4.5} x={960} y={110} txt="WASH DAY" size={110} col={AMB} />
  </>;
}}</Stage>;

// 12 · DÍA DE PAN: la masa respira y crece, se dora con la luz del horno, y los panes llegan a la repisa de a uno
export const CDough: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const rise = eio(tt, 0.6, 3.4), breath = 0.03 * Math.sin(tt * 2.2) * (1 - eio(tt, 3.4, 4)), bake = eio(tt, 3.6, 5.0), shelfIn = eio(tt, 4.8, 5.6);
  return <>
    <BgB id="n_pan_semana" tt={tt} dim={0.7} />
    {/* repisa de madera al fondo, en perspectiva */}
    <div style={{ position: "absolute", left: 160, top: 300, width: 1600, height: 40, background: "linear-gradient(180deg,#8a6038,#5a3a1e)", boxShadow: "0 30px 40px rgba(0,0,0,.6)", transform: `perspective(1200px) rotateX(18deg) translateY(${-400 * (1 - shelfIn)}px)`, opacity: shelfIn }} />
    {Array.from({ length: 12 }, (_, i) => { const a = 5.6 + i * 0.36, p = phys(tt, a, 7, 0.45); if (p <= 0.01) return null; const x = 260 + i * 128, sc = 0.8 + 0.04 * (i % 3); return <div key={i} style={{ position: "absolute", left: x, top: 230 - 500 * (1 - p), width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -70, top: 50, width: 140, height: 24, borderRadius: "50%", background: "rgba(0,0,0,.5)", filter: "blur(8px)" }} />
      <Img src={spr("sp_c2_bread_gold")} style={{ position: "absolute", left: -75 * sc, top: -60 * sc, width: 150 * sc, filter: "drop-shadow(0 10px 10px rgba(0,0,0,.5))" }} />
    </div>; })}
    <Planks y={820} />
    <div style={{ position: "absolute", left: 960 - 360, top: 560, width: 720, height: 460, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,150,60,.5), transparent 65%)", opacity: bake * (1 - eio(tt, 5.0, 5.6)), mixBlendMode: "screen" }} />
    <Mv s={(0.7 + 0.35 * rise) * (1 + breath)} ox={960} oy={860}>
      <Spr id="sp_c2_dough_raw" tt={tt} at={0.2} x={960} y={720} w={420} op={1 - bake} />
      <Spr id="sp_c2_bread_gold" tt={tt} at={-5} x={960} y={720} w={430} from="none" op={bake} />
    </Mv>
    <Steam tt={tt} x={960} y={540} w={180} k={0.8 * bake} />
  </>;
}}</Stage>;

// 13 · DIEZ MINUTOS ENTEROS: caen diez porotos rojos a la taza, uno por minuto, y cada uno enciende una muesca del borde
export const CCount: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const AT = Array.from({ length: 10 }, (_, i) => 1.3 + i * 0.95), nd = AT.filter((a) => tt > a + 0.35).length;
  const odo = nd, CX = 1060, CY = 640;
  return <>
    <BgB id="n_rojos_crudos" tt={tt} dim={0.7} />
    <Planks y={760} />
    {/* el montón de la izquierda: cada poroto que cae sale de acá */}
    {Array.from({ length: 22 }, (_, i) => { const gone = i < 22 - (22 - nd * 2); return !gone || i >= nd * 2 ? <Bean key={i} x={420 + (rnd(i, 1) - 0.5) * 240} y={780 - rnd(i, 2) * 70 * (1 - i / 30)} r={rnd(i, 3) * 180} s={1.5} col="#7a1a20" /> : null; })}
    <Spr id="sp_tincup2" tt={tt} at={0.3} x={CX} y={CY} w={430} />
    {/* diez muescas alrededor de la boca de la taza */}
    {Array.from({ length: 10 }, (_, i) => { const on = i < nd, a = Math.PI * (1.08 + 0.84 * (i / 9)); return <div key={i} style={{ position: "absolute", left: CX - 20 + Math.cos(a) * 200 - 7, top: CY - 150 + Math.sin(a) * 50 - 14, width: 14, height: 28, borderRadius: 4, background: on ? "#ffb040" : "#3a2c1e", boxShadow: on ? "0 0 14px 4px rgba(255,170,60,.7)" : "none" }} />; })}
    {AT.map((a, i) => { const p = eio(tt, a, a + 0.35); if (p <= 0 || p >= 1) return null; return <Bean key={i} x={420 + (CX - 20 - 420) * p} y={720 - 380 * Math.sin(p * Math.PI) + (CY - 140 - 720) * p} r={p * 400} s={1.7} col="#8a1e24" />; })}
    {AT.map((a, i) => <Burst key={i} tt={tt} at={a + 0.35} x={CX - 20} y={CY - 150} n={4} col="#ffcf8a" sp={140} sz={5} life={0.3} />)}
    <OdoV v={odo} x={1560} y={260} op={eio(tt, 1.0, 1.5)} size={120} dec={0} pre="" />
    <Big tt={tt} at={9.8} x={1560} y={410} txt="MIN" size={80} col={AMB} />
  </>;
}}</Stage>;

// 14 · LA TRINIDAD: cebolla, morrón y apio orbitan en triángulo sobre la olla y caen adentro; después ajo, laurel y tomillo
export const CTrinity: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const T = [["sp_onion2", 0.4, 4.4], ["sp_pepper_green", 1.4, 4.7], ["sp_celery", 3.2, 5.0]] as const;
  const S = [["sp_c2_garlic", 5.7, 860], ["sp_c2_bayleaf", 7.7, 960], ["sp_c2_thyme", 9.3, 1060]] as const;
  const orb = tt * 0.6, CX = 960, CY = 700;
  return <>
    <BgB id="n_trinidad" tt={tt} dim={0.7} />
    <Planks y={820} />
    <Spr id="sp_bigpot_side" tt={tt} at={0.1} x={CX} y={CY} w={640} />
    {T.map(([id, a, dive], i) => { const ent = phys(tt, a, 6, 0.55), d = eio(tt, dive, dive + 0.5); if (ent <= 0.01 || d >= 1) return null; const ang = orb + (i * 2 * Math.PI) / 3, x = CX + Math.cos(ang) * 420 * (1 - d), y = 330 + Math.sin(ang) * 110 * (1 - d) + (CY - 380 - 330) * d; return <div key={id} style={{ position: "absolute", left: x, top: y - 600 * (1 - ent), width: 0, height: 0, opacity: 1 - eio(tt, dive + 0.35, dive + 0.5), filter: `brightness(${0.8 + 0.25 * Math.sin(ang)})` }}><Img src={spr(id)} style={{ position: "absolute", left: -110, top: -110, width: 220, transform: `rotate(${20 * Math.sin(ang)}deg) scale(${1 - 0.4 * d})`, filter: "drop-shadow(0 18px 18px rgba(0,0,0,.5))" }} /></div>; })}
    {[4.9, 5.2, 5.4].map((a, i) => <Burst key={i} tt={tt} at={a} x={CX + (i - 1) * 90} y={CY - 210} n={8} col="rgba(240,230,210,.9)" sp={260} sz={8} life={0.5} />)}
    {S.map(([id, a, x]) => { const p = eio(tt, a, a + 0.6); if (p <= 0 || p >= 1) return null; return <div key={id} style={{ position: "absolute", left: x, top: 120 + (CY - 220 - 120) * p * p, width: 0, height: 0 }}><Img src={spr(id)} style={{ position: "absolute", left: -80, top: -80, width: 160, transform: `rotate(${p * 200}deg)`, filter: "drop-shadow(0 12px 12px rgba(0,0,0,.5))" }} /></div>; })}
    {S.map(([, a, x], i) => <Burst key={i} tt={tt} at={a + 0.6} x={x} y={CY - 220} n={6} col="rgba(240,230,210,.9)" sp={200} sz={6} life={0.4} />)}
    <Steam tt={tt} x={CX} y={CY - 240} w={220} k={0.5 + 0.5 * eio(tt, 4.4, 5.4)} />
  </>;
}}</Stage>;

// 15 · CREMOSO: la cuchara de madera gira dejando una estela de crema; después aplasta porotos contra la pared de la olla
export const CSwirl: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const stir = eio(tt, 0.1, 0.6) * (1 - eio(tt, 10.0, 10.6)), ang = tt * 2.4, cream = eio(tt, 4.8, 8.4), mash = eio(tt, 11.4, 12.2), zm = eio(tt, 9.0, 10.8);
  const CX = 960, CY = 560, R = 360;
  return <>
    <BgB id="n_cremoso" tt={tt} dim={0.72} />
    <Mv s={1 + 0.55 * zm} x={-320 * zm} ox={CX + R * 0.8} oy={CY}>
      <Broth x={CX} y={CY} r={R} col={`rgb(${120 + 40 * cream},${36 + 30 * cream},${30 + 20 * cream})`}>
        {Array.from({ length: 60 }, (_, i) => { const a = rnd(i, 1) * Math.PI * 2, d = Math.sqrt(rnd(i, 2)) * R * 0.9; return <Bean key={i} x={R + Math.cos(a + tt * 0.3 * stir) * d} y={R + Math.sin(a + tt * 0.3 * stir) * d} r={rnd(i, 3) * 180 + tt * 20} s={1.4} col="#8a2a24" o={1 - 0.6 * cream} />; })}
        {/* estela cremosa: espiral que se abre detrás de la cuchara */}
        <svg width={2 * R} height={2 * R} style={{ position: "absolute", left: 0, top: 0 }}>{Array.from({ length: 3 }, (_, k) => { const n = 60, pts = Array.from({ length: n }, (_, j) => { const a = ang - j * 0.09 - k * 2.1, rr = R * (0.25 + 0.5 * (j / n) + 0.1 * k); return `${(R + Math.cos(a) * rr).toFixed(1)} ${(R + Math.sin(a) * rr).toFixed(1)}`; }); return <path key={k} d={"M" + pts.join(" L")} stroke={`rgba(214,150,130,${0.25 + 0.55 * cream})`} strokeWidth={20 + 70 * cream} strokeLinecap="round" fill="none" style={{ filter: "blur(6px)" }} />; })}</svg>
        {/* mancha que deja el aplastado contra la pared */}
        <div style={{ position: "absolute", left: 2 * R - 140, top: R - 70, width: 130 * mash, height: 140, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(225,160,140,.95), rgba(170,90,80,.6) 70%, transparent)" }} />
      </Broth>
      <Mv x={stir > 0.01 ? Math.cos(ang) * R * 0.45 : 0 + R * 0.55 * mash} y={stir > 0.01 ? Math.sin(ang) * R * 0.45 : 0} r={stir > 0.01 ? (ang * 180) / Math.PI + 90 : -20 + 10 * Math.sin(mash * Math.PI)} ox={CX} oy={CY} o={Math.max(stir, mash)}><Spr id="sp_spoon2" tt={tt} at={-5} x={CX + 250} y={CY} w={620} from="none" shadow={0} /></Mv>
    </Mv>
    <Steam tt={tt} x={CX} y={CY - 260} w={220} k={0.6} />
  </>;
}}</Stage>;

// 16 · EL FUEGO MÁS BAJO: el caldo de cerca, la llama que se achica abajo, y UNA burbuja lenta que sube y abre anillos
export const CRipple: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 55%, #2a1a10, #050403 75%)">{(tt) => {
  const low = eio(tt, 5.7, 7.8), ph = ((tt - 7.0) % 2.6) / 2.6, up = tt > 7.0 ? ph : 0;
  const bub = up < 0.55 ? up / 0.55 : 1, rings = up > 0.55 ? (up - 0.55) / 0.45 : 0, lx = 960 + 60 * Math.sin(tt * 0.4);
  return <>
    {/* superficie del caldo, inclinada en perspectiva, con el reflejo de la lámpara */}
    <Mv p="perspective(1400px) rotateX(58deg)" ox={960} oy={560}>
      <div style={{ position: "absolute", left: 160, top: 160, width: 1600, height: 900, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 45%, #6a3a1e, #3a1e0e 55%, #140a04 85%)", boxShadow: "0 0 0 40px #1a1a1a, 0 0 0 48px #3a3a3a" }}>
        <div style={{ position: "absolute", left: lx - 160 - 160, top: 300, width: 320, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,220,160,.55), transparent 70%)", transform: `scale(${1 + 0.12 * Math.sin(rings * Math.PI * 3) * (1 - rings)}) skewX(${10 * Math.sin(rings * 9) * (1 - rings)}deg)`, mixBlendMode: "screen" }} />
        {rings > 0 && [0, 1, 2, 3].map((i) => { const k = cl(rings * 1.5 - i * 0.18); return k > 0 && k < 1 && <div key={i} style={{ position: "absolute", left: 800 - 500 * k, top: 450 - 500 * k, width: 1000 * k, height: 1000 * k, borderRadius: "50%", border: `${5 - 3 * k}px solid rgba(255,215,160,${0.55 * (1 - k)})` }} />; })}
        {bub > 0 && bub < 1 && <div style={{ position: "absolute", left: 800 - 40 * bub, top: 450 - 40 * bub, width: 80 * bub, height: 80 * bub, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(255,240,210,.9), rgba(150,80,40,.5) 60%)", boxShadow: "0 0 10px rgba(255,200,140,.4)" }} />}
      </div>
    </Mv>
    {/* la llama de abajo se achica a una llamita azul */}
    <FireP tt={tt} x={960} y={1060} w={900 - 660 * low} k={1 - 0.5 * low} n={20} blue={low > 0.6} />
  </>;
}}</Stage>;

// 17 · LA SAL ESTÁ BIEN, Y LA PRUEBA DEL DEDO: caen cristales de sal grandes; a las dos horas, los dedos aplastan el poroto
export const CPinch: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const salt = eio(tt, 3.8, 5.4), hin = eio(tt, 11.0, 11.8), sq = eio(tt, 12.0, 12.6);
  return <>
    <BgB id="n_sal_inicio" tt={tt} dim={0.72} />
    <Planks y={760} dark />
    <Spr id="sp_pot_beans_top" tt={tt} at={0.2} x={760} y={600} w={620} />
    {Array.from({ length: 34 }, (_, i) => { const a = 3.8 + rnd(i, 1) * 1.4, p = eio(tt, a, a + 0.6); if (p <= 0) return null; const x = 700 + (rnd(i, 2) - 0.5) * 300, y = -40 + (560 + rnd(i, 3) * 100) * p * p, s = 10 + rnd(i, 4) * 12; return <div key={i} style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, transform: `rotate(${45 + i * 30 + p * 200}deg)`, background: "linear-gradient(135deg, #ffffff, #cfd8e0)", boxShadow: "0 0 8px rgba(255,255,255,.8)", opacity: p < 1 ? 1 : 1 - eio(tt, a + 0.6, a + 1.2) }} />; })}
    {/* el reloj de 2 horas pasa rápido (sombra de la ventana que gira) */}
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: HH, background: `linear-gradient(${120 + 120 * eio(tt, 9.8, 11.4)}deg, rgba(255,200,130,.12), transparent 50%)`, opacity: eio(tt, 9.6, 10.0) * (1 - eio(tt, 11.4, 11.8)) }} />
    <Spr id="sp_bean_big" tt={tt} at={10.6} x={1340} y={640} w={260 * (1 - 0.0 * sq)} op={1 - sq} />
    <Spr id="sp_bean_squashed" tt={tt} at={-5} x={1340} y={650} w={330} from="none" op={sq} />
    <Mv x={600 * (1 - hin) - 60 * sq} y={-30 * sq}><Spr id="sp_hand_pinch" tt={tt} at={-5} x={1600} y={600} w={620} from="none" shadow={0} /></Mv>
    <Big tt={tt} at={12.2} x={1340} y={360} txt="2 HOURS" size={90} col={AMB} />
  </>;
}}</Stage>;

// 18 · CENA Nº 4: la tapa de vidrio se levanta en arco, gira en el aire y cae al costado; del bol saltan tres tortitas
export const CLid: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const lift = eio(tt, 7.6, 8.8), flip = eio(tt, 7.9, 8.8), land = phys(tt, 8.8, 8, 0.4);
  const lx = 960 + 620 * lift, ly = 560 - 380 * Math.sin(lift * Math.PI) + 220 * lift, CK = [9.1, 9.5, 9.9];
  return <>
    <BgB id="n_tortitas_negras" tt={tt} dim={0.72} />
    <Planks y={720} />
    <Spr id="sp_bowl_leftover" tt={tt} at={0.4} x={960} y={640} w={520} />
    {CK.map((a, i) => { const p = eio(tt, a, a + 0.55), d = Math.max(0, tt - a - 0.55), sq = 0.12 * Math.exp(-8 * d) * Math.sin(d * 30); if (p <= 0) return null; const x = 960 + (i - 1) * 330 * p, y = 600 - 380 * Math.sin(p * Math.PI) + (880 - 600) * p; return <div key={i} style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}>
      {p >= 1 && <div style={{ position: "absolute", left: -110, top: 40, width: 220, height: 40, borderRadius: "50%", background: "rgba(0,0,0,.5)", filter: "blur(10px)" }} />}
      <Img src={spr("sp_bean_cake")} style={{ position: "absolute", left: -110 * (1 + sq), top: -80, width: 220 * (1 + sq), transform: `scaleY(${p < 1 ? 0.5 + 0.5 * Math.abs(Math.cos(p * Math.PI * 2)) : 0.6})`, filter: "brightness(1.15) saturate(1.2) drop-shadow(0 10px 12px rgba(0,0,0,.45))" }} />
    </div>; })}
    <Steam tt={tt} x={960} y={520} w={200} k={eio(tt, 8.0, 8.6) * (1 - eio(tt, 10, 11.5))} />
    {/* la tapa: vidrio con reflejo cálido */}
    <div style={{ position: "absolute", left: lx, top: ly + (tt > 8.8 ? 14 * (1 - land) : 0), width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -260, top: -260, width: 520, height: 520, borderRadius: "50%", transform: `perspective(900px) rotateX(${60 + 300 * flip}deg)`, background: "radial-gradient(circle at 35% 30%, rgba(255,245,225,.5), rgba(230,210,180,.14) 45%, rgba(200,180,150,.25))", boxShadow: "inset 0 0 0 10px rgba(240,225,200,.35), 0 20px 40px rgba(0,0,0,.4)", backdropFilter: "blur(1px)" }}>
        <div style={{ position: "absolute", left: 230, top: 230, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #d8c8a8, #6a5a40)" }} />
      </div>
    </div>
  </>;
}}</Stage>;

// 19 · LA MEZCLA: avena, huevo y cebolla entran de a uno, orbitan el centro, se funden en la masa y la mano la aplasta
export const CPatty: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const I = [["sp_oats_cup", 0.9, 240], ["sp_egg_one", 5.9, 180], ["sp_onion_bits", 7.1, 220]] as const;
  const merge = eio(tt, 11.0, 11.8), press = eio(tt, 12.2, 12.8), hand = eio(tt, 11.6, 12.2), ang = tt * 0.9;
  return <>
    <BgB id="n_avena_pan" tt={tt} dim={0.72} />
    <WoodTop />
    <Spr id="sp_tinplate2" tt={tt} at={0.3} x={960} y={600} w={520} shadow={0.6} />
    {I.map(([id, a, w], i) => { const ent = phys(tt, a, 6, 0.55); if (ent <= 0.01 || merge >= 1) return null; const an = ang + (i * 2 * Math.PI) / 3, r = 380 * (1 - merge); return <div key={id} style={{ position: "absolute", left: 960 + Math.cos(an) * r * 1.2, top: 560 + Math.sin(an) * r * 0.55 - 600 * (1 - ent), width: 0, height: 0, opacity: 1 - merge }}><Img src={spr(id)} style={{ position: "absolute", left: -w / 2, top: -w / 2, width: w, transform: `scale(${1 - 0.5 * merge})`, filter: "drop-shadow(0 18px 16px rgba(0,0,0,.5))" }} /></div>; })}
    {merge > 0 && <div style={{ position: "absolute", left: 960, top: 600, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -160 * merge * (1 + 0.6 * press), top: -120 * merge * (1 - 0.45 * press), width: 320 * merge * (1 + 0.6 * press), height: 240 * merge * (1 - 0.45 * press), borderRadius: "50%", background: "radial-gradient(ellipse at 38% 32%, #f0dcb0, #c9a670 60%, #8a6a40)", boxShadow: "0 16px 26px rgba(0,0,0,.45)" }}>
        {Array.from({ length: 26 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${10 + rnd(i) * 80}%`, top: `${12 + rnd(i, 2) * 76}%`, width: 10, height: 6, borderRadius: "50%", background: i % 3 ? "rgba(255,250,235,.85)" : "rgba(80,50,30,.8)" }} />)}
      </div>
    </div>}
    {hand > 0.01 && <Mv y={-500 * (1 - hand) + 60 * press} o={1 - eio(tt, 12.8, 13.1)}><Spr id="sp_hand_flat" tt={tt} at={-5} x={960} y={330} w={340} from="none" shadow={0} /></Mv>}
  </>;
}}</Stage>;

// 20 · LA TORRE: ocho tortitas crocantes se apilan de a una; arriba cae el huevo, la crema y el ketchup que chorrea
export const CStack: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const AT = Array.from({ length: 8 }, (_, i) => 0.3 + i * 0.28), top = 820 - 8 * 46, egg = phys(tt, 2.6, 8, 0.45), crm = phys(tt, 4.4, 8, 0.5), ket = eio(tt, 6.2, 7.6), n = AT.filter((a) => tt > a).length;
  return <>
    <BgB id="n_huevo_arriba" tt={tt} dim={0.72} />
    <Planks y={760} />
    <Mv sy={0.45} ox={960} oy={860}><Spr id="sp_tinplate2" tt={tt} at={0.1} x={960} y={860} w={640} shadow={0} /></Mv>
    {AT.map((a, i) => <Spr key={i} id="sp_cake_crispy" tt={tt} at={a} x={960 + (rnd(i) - 0.5) * 18} y={820 - i * 46} w={340} rot={(rnd(i, 2) - 0.5) * 10} shadow={i === 0 ? 1 : 0} style={{ transform: "scaleY(.42)" }} />)}
    {egg > 0.01 && <Mv y={(1 - egg) * -700}><Spr id="sp_egg_fried2" tt={tt} at={-5} x={960} y={top - 20} w={300} from="none" shadow={0} style={{ transform: "scaleY(.55)" }} /></Mv>}
    {crm > 0.01 && <Mv y={(1 - crm) * -700}><Spr id="sp_sourcream" tt={tt} at={-5} x={1000} y={top - 70} w={130} from="none" shadow={0} /></Mv>}
    {/* hilos de ketchup que chorrean por los costados */}
    {[-110, -20, 90].map((dx, i) => <div key={i} style={{ position: "absolute", left: 960 + dx, top: top - 30, width: 18, height: 30 + 200 * cl(ket * 1.4 - i * 0.15), borderRadius: 9, background: "linear-gradient(90deg,#8a0e08,#d8281a,#8a0e08)", boxShadow: "0 4px 6px rgba(0,0,0,.3)" }} />)}
    {ket > 0 && <div style={{ position: "absolute", left: 960 - 130, top: top - 60, width: 260, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, #e02a1a, #8a0e08)", opacity: cl(ket * 3) }} />}
    <OdoV v={n} x={1500} y={300} op={eio(tt, 0.4, 0.8)} size={110} dec={0} pre="" />
    <Tag2 tt={tt} at={11.5} x={420} y={60} txt="40¢" w={300} fs={120} />
  </>;
}}</Stage>;

// 21 · CENA Nº 5: el cucharón se inclina sobre el balde de desperdicio, cae UN poroto, frena con peso y vuelve sobre la olla
export const CLadle: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const bk = eio(tt, 3.0, 4.0), tilt = eio(tt, 5.2, 6.4) * (1 - eio(tt, 7.2, 8.2)), back = eio(tt, 7.2, 8.4), drop = eio(tt, 6.2, 6.8);
  const lx = 960 + 380 * eio(tt, 4.2, 5.2) - 640 * back;
  return <>
    <BgB id="n_fondo_olla" tt={tt} dim={0.72} />
    <Planks y={800} />
    <Spr id="sp_bacon_pot" tt={tt} at={0.3} x={560} y={720} w={480} />
    <Mv x={500 * (1 - bk)} o={bk}><Spr id="sp_slop_bucket" tt={tt} at={-5} x={1420} y={740} w={420} from="none" /></Mv>
    <Mv r={-36 * tilt + 4 * Math.sin(tt * 1.8) * (1 - back) * 0.3} ox={lx - 140} oy={430}><Spr id="sp_ladle_beans" tt={tt} at={0.5} x={lx} y={430} w={520} from="up" shadow={0} /></Mv>
    {drop > 0 && drop < 1 && <Bean x={lx - 210} y={470 + 330 * drop * drop} r={drop * 300} s={1.6} col="#8a5636" />}
    <Burst tt={tt} at={6.8} x={1340} y={600} n={5} col="#c9a070" sp={140} sz={6} life={0.3} />
    <Steam tt={tt} x={560} y={560} w={160} k={0.7} />
  </>;
}}</Stage>;

// 22 · CINCO MINUTOS: cinco fósforos se encienden de a uno junto a la olla, se carbonizan y caen; al quinto, la sopa humea
export const CMatches: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 55%, #1e1610, #050403 75%)">{(tt) => {
  const M = [0.9, 2.6, 4.3, 6.0, 7.7], MX = (i: number) => 540 + i * 210;
  return <>
    <BgB id="n_sopa_cinco" tt={tt} dim={0.78} />
    <Planks y={820} dark />
    <Spr id="sp_bowl_bacon" tt={tt} at={0.1} x={1500} y={760} w={460} />
    {M.map((a, i) => { const ent = phys(tt, a - 0.6, 6.5, 0.55), lit = eio(tt, a, a + 0.25), burn = eio(tt, a + 0.25, a + 1.6), fall = eio(tt, a + 1.6, a + 2.0); if (ent <= 0.01) return null; const x = MX(i), y = 520 - 700 * (1 - ent) + 260 * fall * fall; return <div key={i} style={{ position: "absolute", left: x, top: y, width: 0, height: 0, transform: `rotate(${-90 + 25 * burn + 70 * fall}deg)` }}>
      <Img src={spr("sp_match")} style={{ position: "absolute", left: -10, top: -20, width: 360, filter: `brightness(${1 - 0.7 * burn}) drop-shadow(0 8px 8px rgba(0,0,0,.6))`, clipPath: `inset(0 0 0 ${18 * burn}%)` }} />
      {lit > 0 && burn < 1 && <div style={{ position: "absolute", left: -10 + 65 * burn - 40, top: -10 - 110, width: 80, height: 130, transform: "rotate(90deg)", transformOrigin: "40px 120px", borderRadius: "50% 50% 45% 45% / 70% 70% 30% 30%", background: "radial-gradient(circle at 50% 78%, #fff6c8, #ffb040 45%, rgba(255,80,20,0) 75%)", opacity: lit * (1 - burn * burn), boxShadow: "0 0 60px 20px rgba(255,150,50,.35)" }} />}
    </div>; })}
    {M.map((a, i) => <div key={i} style={{ position: "absolute", left: MX(i) - 200, top: 300, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,170,70,.28), transparent 65%)", opacity: eio(tt, a, a + 0.25) * (1 - eio(tt, a + 1.2, a + 1.6)), mixBlendMode: "screen" }} />)}
    <Steam tt={tt} x={1500} y={600} w={220} k={0.3 + 1.1 * eio(tt, 9.5, 10.3)} />
    <Num3 tt={tt} at={9.6} out={20} x={1500} y={330} n="5" col="#ffd27a" size={200} />
  </>;
}}</Stage>;

// 23 · EL CALDO NO SE TIRA: el caldo gira hacia el desagüe… frena, se rebobina y sube en una columna dentro del frasco
export const CDrain: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sw = eio(tt, 3.4, 4.6), rev = eio(tt, 5.0, 5.6), col = eio(tt, 5.6, 7.0), jar = eio(tt, 6.2, 7.6), spin = tt < 5.0 ? tt * 2.6 * (0.4 + sw) : 5.0 * 2.6 * 1.4 - (tt - 5.0) * 3;
  const CX = 820, CY = 600;
  return <>
    <BgB id="n_desague" tt={tt} dim={0.72} />
    <Mv p="perspective(1500px) rotateX(48deg)" ox={CX} oy={CY}>
      <Spr id="sp_basin" tt={tt} at={0.2} x={CX} y={CY} w={760} from="none" />
      <div style={{ position: "absolute", left: CX - 300 * (1 - 0.6 * sw * (1 - col)), top: CY - 300 * (1 - 0.6 * sw * (1 - col)), width: 600 * (1 - 0.6 * sw * (1 - col)), height: 600 * (1 - 0.6 * sw * (1 - col)), borderRadius: "50%", background: `conic-gradient(from ${spin * 57}deg, #6a3e1e, #a8703a, #5a3218, #8a5a2c, #6a3e1e)`, opacity: 0.9 * (1 - col), filter: "blur(1px)" }}>
        <div style={{ position: "absolute", inset: "38%", borderRadius: "50%", background: "radial-gradient(circle, #050505, #2a1a0e)" }} />
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, transform: `rotate(${spin * 57}deg)` }}>{[0, 1, 2].map((k) => <path key={k} d={`M50 50 ${Array.from({ length: 30 }, (_, j) => { const a = j * 0.35 + k * 2.1, r = 6 + j * 1.4; return `L${(50 + Math.cos(a) * r).toFixed(1)} ${(50 + Math.sin(a) * r).toFixed(1)}`; }).join(" ")}`} stroke="rgba(255,236,200,.45)" strokeWidth={1.4} fill="none" />)}</svg>
      </div>
    </Mv>
    {/* la columna que sube del desagüe y cae en arco al frasco */}
    {col > 0 && jar < 1 && <svg width={W} height={HH} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M${CX} ${CY} Q ${(CX + 1420) / 2} ${-80} 1420 ${430}`} stroke="#8a5a2c" strokeWidth={34} fill="none" strokeLinecap="round" strokeDasharray={`${1500 * col} 3000`} strokeDashoffset={-1500 * jar} /></svg>}
    <Spr id="sp_jar_broth" tt={tt} at={0.6} x={1420} y={600} w={320} style={{ filter: `brightness(${0.75 + 0.35 * jar}) drop-shadow(0 18px 22px rgba(0,0,0,.45))` }} />
    <Glint tt={tt} at={7.4} x={1420} y={540} r={140} />
    <Big tt={tt} at={6.2} x={960} y={140} txt="DON'T POUR IT OUT" size={88} col={AMB} />
  </>;
}}</Stage>;

// 24 · ERROR Nº 1 · NO REVISARLOS: la mano barre los porotos por la mesa nítida y queda a la vista la piedrita, que brilla
export const CSift: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const sw = eio(tt, 8.6, 9.6), hx = 1500 - 900 * sw, hin = eio(tt, 7.9, 8.5);
  return <>
    <WoodTop />
    {Array.from({ length: 120 }, (_, i) => { const x0 = 560 + rnd(i, 1) * 800, y0 = 360 + rnd(i, 2) * 420, push = cl((x0 - hx + 120) / 200) * sw; const x = x0 - push * (220 + 160 * rnd(i, 3)), y = y0 + push * (rnd(i, 4) - 0.5) * 120; return <Bean key={i} x={x} y={y} r={rnd(i, 5) * 180 + push * 60} s={1.25} col="#c39a6c" />; })}
    <div style={{ position: "absolute", left: 1040, top: 560, width: 0, height: 0 }}><Img src={spr("sp_pebble")} style={{ position: "absolute", left: -40, top: -30, width: 80, filter: "drop-shadow(0 6px 6px rgba(0,0,0,.5))" }} /></div>
    {/* granos que la tapaban encima de la piedrita */}
    {Array.from({ length: 8 }, (_, i) => { const push = cl((1040 - hx + 200) / 200) * sw; return <Bean key={`o${i}`} x={1020 + (rnd(i, 9) - 0.5) * 70 - push * 300} y={556 + (rnd(i, 8) - 0.5) * 50} r={i * 40} s={1.25} col="#c39a6c" o={1} />; })}
    <Glint tt={tt} at={9.5} x={1040} y={560} r={120} />
    {hin > 0.01 && <Mv x={hx - 1300 + 400 * (1 - hin)} y={-80}><Spr id="sp_hand_flat" tt={tt} at={-5} x={1300} y={560} w={360} rot={-80} from="none" shadow={0.6} /></Mv>}
    <Big tt={tt} at={7.7} x={960} y={150} txt="ERROR #1" size={120} col="#ff7a4a" />
  </>;
}}</Stage>;

// 25 · LA SEMANA EN FAROLES: cinco faroles cuelgan de la viga con margen; cada uno se enciende y hamaca cuando se nombra su día
export const CLanterns: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 80% 70% at 50% 45%, #1c1610, #040303 75%)">{(tt) => {
  const L = [["MON", -0.4, "2"], ["TUE", 1.4, "1"], ["WED", 5.6, "4"], ["THU", 10.7, "5"], ["FRI", 99, ""]] as const;
  return <>
    <div style={{ position: "absolute", left: 0, top: 90, width: W, height: 50, background: "linear-gradient(180deg,#6a4426,#3a2414)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
    {L.map(([d, a, n], i) => { const x = 280 + i * 340, on = eio(tt, a, a + 0.4), sw = 3 * Math.sin(tt * 1.2 + i) + 8 * Math.exp(-2 * Math.max(0, tt - a)) * Math.sin(Math.max(0, tt - a) * 5) * (tt > a ? 1 : 0); return <Mv key={d} r={sw} ox={x} oy={140}>
      <div style={{ position: "absolute", left: x - 2, top: 140, width: 4, height: 90, background: "#888" }} />
      <div style={{ position: "absolute", left: x - 300, top: 160, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,180,80,.32), transparent 62%)", opacity: on, mixBlendMode: "screen" }} />
      <Spr id="sp_lantern" tt={tt} at={-5} x={x} y={400} w={300} from="none" shadow={0} style={{ filter: `brightness(${0.45 + 0.75 * on}) drop-shadow(0 0 ${40 * on}px rgba(255,170,60,${0.8 * on}))` }} />
      <div style={{ position: "absolute", left: x - 14, top: 380, width: 28, height: 44, borderRadius: "50% 50% 45% 45% / 70% 70% 30% 30%", background: "radial-gradient(circle at 50% 75%, #fff6c8, #ffb040 50%, rgba(255,90,20,0) 80%)", opacity: on * (0.85 + 0.15 * Math.sin(tt * 1.3 + i)) }} />
      <div style={{ position: "absolute", left: x - 100, top: 650, width: 200, height: 150, borderRadius: 10, background: "linear-gradient(170deg,#f1e2bf,#d6be8c)", boxShadow: "0 16px 28px rgba(0,0,0,.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 60, color: "#3a2614", opacity: 0.35 + 0.65 * on, transform: `scale(${0.92 + 0.08 * on})` }}>{d}{n && <div style={{ fontFamily: MARK, fontSize: 52, color: "#b8221a", marginTop: -4 }}>No.{n}</div>}</div>
    </Mv>; })}
  </>;
}}</Stage>;

// 26 · ESTIRAR LA OLLA: la pava vierte agua caliente y la olla se ensancha con resorte; los dados de papa caen y se hunden
export const CStretch: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pour = eio(tt, 1.6, 2.2) * (1 - eio(tt, 4.6, 5.2)), grow = phys(tt, 2.2, 5, 0.3) * 0.22, DC = Array.from({ length: 12 }, (_, i) => 6.5 + i * 0.13);
  return <>
    <BgB id="n_papa_dados" tt={tt} dim={0.72} />
    <Planks y={820} />
    <FireP tt={tt} x={960} y={920} w={520} k={0.6} n={16} />
    <Mv sx={1 + grow} sy={1 + 0.35 * grow} ox={960} oy={900}><Spr id="sp_pot_side" tt={tt} at={0.2} x={960} y={720} w={640} /></Mv>
    <Mv x={-380 * (1 - pour)} y={-200 * (1 - pour)} r={-35 * pour} ox={1200} oy={360} o={cl(pour * 4) + (tt < 1.6 ? 0 : 0)}><Spr id="sp_c2_kettle_pour" tt={tt} at={-5} x={1250} y={330} w={360} from="none" shadow={0} /></Mv>
    <Pour tt={tt} at={2.0} out={4.6} x={1090} y1={400} y2={600} col="rgba(200,225,240,.8)" w={22} />
    {DC.map((a, i) => { const p = eio(tt, a, a + 0.5), x0 = 560 + rnd(i) * 160, x1 = 860 + rnd(i, 2) * 220; if (p <= 0) return null; return <Cube key={i} x={x0 + (x1 - x0) * p} y={300 + (590 - 300) * p - 200 * Math.sin(p * Math.PI)} s={38} r={p * 300 + i * 20} />; })}
    {DC.map((a, i) => <Burst key={i} tt={tt} at={a + 0.5} x={860 + rnd(i, 2) * 220} y={590} n={4} col="rgba(220,235,245,.9)" sp={160} sz={6} life={0.35} />)}
    <Steam tt={tt} x={960} y={520} w={220} k={0.9} />
    <OdoV v={15 * eio(tt, 9.6, 10.8)} x={1560} y={300} op={eio(tt, 9.4, 9.9)} size={110} dec={0} pre="" />
    <Big tt={tt} at={10.0} x={1560} y={450} txt="MIN" size={76} col={AMB} />
  </>;
}}</Stage>;

// 27 · EL FRASCO: el ratón corre hacia el frasco de porotos, la tapa metálica cae de golpe, el ratón frena y se va; caen 5 hojas
export const CMouse: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const run = eio(tt, 0.4, 2.6), lid = phys(tt, 2.5, 9, 0.35), flee = eio(tt, 2.9, 4.2), dir = tt > 2.9 ? -1 : 1;
  const mx = 300 + 640 * run - 900 * flee, hop = Math.abs(Math.sin(tt * 14)) * 10 * (run < 1 || flee > 0 ? 1 : 0);
  const PG = [6.0, 7.2, 7.5, 7.7, 7.9];
  return <>
    <BgB id="n_caja_lata" tt={tt} dim={0.72} />
    <Planks y={760} />
    <Spr id="sp_c2_jar_beans" tt={tt} at={0.1} x={1160} y={560} w={360} />
    <Spr id="sp_c2_bean_can" tt={tt} at={0.3} x={1500} y={640} w={250} />
    <Mv y={-520 * (1 - lid)}><Spr id="sp_c2_tin_lid" tt={tt} at={-5} x={1160} y={330} w={300} from="none" shadow={0} style={{ transform: "scaleY(.35)" }} /></Mv>
    <Burst tt={tt} at={2.85} x={1160} y={330} n={8} col="#e8e2d0" sp={240} sz={6} life={0.4} />
    {tt < 4.2 && <div style={{ position: "absolute", left: mx, top: 790 - hop, width: 0, height: 0 }}><Img src={spr("sp_mouse")} style={{ position: "absolute", left: -110, top: -60, width: 220, transform: `scaleX(${-dir})`, filter: "drop-shadow(0 8px 8px rgba(0,0,0,.5))" }} /></div>}
    {PG.map((a, i) => { const p = phys(tt, a, 7, 0.5); if (p <= 0.01) return null; return <div key={i} style={{ position: "absolute", left: 600 - i * 8, top: 300 - 600 * (1 - p) - i * 6, width: 260, height: 300, transform: `rotate(${-6 + i * 3}deg)`, borderRadius: 8, background: "linear-gradient(180deg,#b8221a 0 20%, #f6efe0 20%)", boxShadow: "0 16px 26px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 54, boxSizing: "border-box", fontFamily: MARK, fontSize: 150, color: "#2a1a10" }}>{i + 1}</div>; })}
  </>;
}}</Stage>;

// 28 · EL PORCHE CONGELADOR: la olla llega a las tablas del porche con nieve; la escarcha crece en cristales desde el borde
export const CFrost: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 80% 70% at 50% 40%, #31404e, #0b1016 78%)">{(tt) => {
  const fr = eio(tt, 7.0, 9.6), tap = eio(tt, 10.0, 10.3) * (1 - eio(tt, 10.3, 10.6)), CX = 960, CY = 560, R = 300;
  return <>
    <div style={{ position: "absolute", left: -400, top: 700, width: 2720, height: 900, transformOrigin: "50% 0", transform: "perspective(1100px) rotateX(60deg)", background: "repeating-linear-gradient(90deg, rgba(0,0,0,.4) 0 5px, transparent 5px 260px), linear-gradient(180deg,#8a8f94,#5a5f64)" }} />
    <div style={{ position: "absolute", left: 0, top: 690, width: W, height: 70, background: "linear-gradient(180deg, rgba(240,246,252,.9), rgba(240,246,252,0))" }} />
    {Array.from({ length: 60 }, (_, i) => { const x = (rnd(i, 3) * 2000 + 18 * Math.sin(tt * 0.6 + i)) % 1960, y = ((rnd(i, 4) * 1100 + tt * (35 + 45 * rnd(i, 5))) % 1100) - 20, s = 3 + rnd(i, 6) * 9; return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "#fff", opacity: 0.75, filter: `blur(${s > 9 ? 2 : 0}px)` }} />; })}
    <Mv x={-900 * (1 - phys(tt, 5.4, 5.5, 0.6))}>
      <Spr id="sp_pot_beans_top" tt={tt} at={-5} x={CX} y={CY} w={2 * R + 40} from="none" style={{ filter: `saturate(${1 - 0.7 * fr}) brightness(${1 + 0.3 * fr}) drop-shadow(0 18px 22px rgba(0,0,0,.45))` }} />
      {/* cristales que nacen del borde hacia el centro */}
      <svg width={W} height={HH} style={{ position: "absolute", left: 0, top: 0 }}>{Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2 + rnd(i) * 0.2, L = (R - 20) * (0.35 + 0.55 * rnd(i, 2)) * cl(fr * 1.3 - rnd(i, 3) * 0.3); if (L <= 2) return null; const x0 = CX + Math.cos(a) * (R - 10), y0 = CY + Math.sin(a) * (R - 10), x1 = x0 - Math.cos(a) * L, y1 = y0 - Math.sin(a) * L; return <g key={i} stroke="rgba(235,246,255,.92)" strokeWidth={3} style={{ filter: "drop-shadow(0 0 4px rgba(200,230,255,.9))" }}><line x1={x0} y1={y0} x2={x1} y2={y1} />{[0.35, 0.6, 0.82].map((f) => { const bx = x0 + (x1 - x0) * f, by = y0 + (y1 - y0) * f, bl = L * 0.22 * (1 - f * 0.5); return <g key={f}><line x1={bx} y1={by} x2={bx + Math.cos(a + 2.4) * bl} y2={by + Math.sin(a + 2.4) * bl} /><line x1={bx} y1={by} x2={bx + Math.cos(a - 2.4) * bl} y2={by + Math.sin(a - 2.4) * bl} /></g>; })}</g>; })}</svg>
      <div style={{ position: "absolute", left: CX - R, top: CY - R, width: 2 * R, height: 2 * R, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,236,250,.0) 30%, rgba(220,236,250,.55))", opacity: fr }} />
    </Mv>
    {tt > 9.8 && <Mv y={-60 * tap - 400 * (1 - eio(tt, 9.6, 10.0))} r={-30} ox={CX + 200} oy={CY}><Spr id="sp_spoon2" tt={tt} at={-5} x={CX + 220} y={CY - 60} w={460} from="none" shadow={0} /></Mv>}
    <Burst tt={tt} at={10.3} x={CX + 20} y={CY} n={10} col="rgba(240,248,255,.95)" sp={300} sz={6} life={0.5} />
    <Big tt={tt} at={8.5} x={CX} y={150} txt="FROZEN SOLID" size={110} col="#cfe6ff" />
  </>;
}}</Stage>;

// 29 · SIEMPRE GRASA: la olla gris y aguada recibe la cucharada; la grasa se derrite y un brillo recorre la superficie
export const CGloss: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const dn = eio(tt, 5.6, 6.3), melt = eio(tt, 6.5, 8.2), g = eio(tt, 7.0, 9.6), sweep = -30 + 170 * eio(tt, 8.4, 10.6), up = eio(tt, 6.8, 7.6);
  const CX = 960, CY = 600, R = 330;
  return <>
    <BgB id="n_gris" tt={tt} dim={0.74} />
    <Spr id="sp_pot_grey" tt={tt} at={0.2} x={CX} y={CY} w={2 * R + 30} />
    <Spr id="sp_pot_glossy" tt={tt} at={-5} x={CX} y={CY} w={2 * R + 30} from="none" shadow={0} op={g} />
    <div style={{ position: "absolute", left: CX - R, top: CY - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", opacity: g }}><div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${sweep - 12}%, rgba(255,240,210,.5) ${sweep}%, transparent ${sweep + 12}%)`, mixBlendMode: "screen" }} /></div>
    {/* el bloque de grasa blanca que se derrite en un charco dorado */}
    {tt > 6.3 && <div style={{ position: "absolute", left: CX + 40 - 120 * melt, top: CY - 40 - 70 * melt, width: 80 + 160 * melt, height: 60 + 80 * melt, borderRadius: "45%", background: melt < 0.6 ? "radial-gradient(circle at 40% 35%, #fff, #ece6d8)" : "radial-gradient(ellipse at 40% 35%, rgba(255,240,190,.75), rgba(220,160,60,.35) 60%, transparent 80%)", opacity: 1 - eio(tt, 9.0, 10.0) }} />}
    <Mv y={-560 * (1 - dn) - 520 * up}><Spr id="sp_grease_spoon" tt={tt} at={-5} x={CX - 60} y={CY - 120} w={520} from="none" shadow={0} rot={-14} /></Mv>
    <Steam tt={tt} x={CX} y={CY - 260} w={220} k={0.3 + 0.8 * g} />
  </>;
}}</Stage>;

// 30 · TRES VECES: las tres latas caen como dominós una sobre otra; la bolsa baja al centro, entera y de pie
export const CDomino: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const F = [4.5, 4.9, 5.25], bag = phys(tt, 11.9, 7, 0.45);
  const rot = (i: number) => { const p = eio(tt, F[i], F[i] + 0.4); const d = Math.max(0, tt - F[i] - 0.4); return 62 * p + (p >= 1 ? 3 * Math.exp(-6 * d) * Math.sin(d * 30) : 0); };
  return <>
    <BgB id="n_latas_despensa" tt={tt} dim={0.72} />
    <Planks y={780} />
    {[0, 1, 2].map((i) => { const x = 440 + i * 230; return <React.Fragment key={i}>
      <Mv r={rot(i)} ox={x + 70} oy={860}><Spr id="sp_c2_bean_can" tt={tt} at={1.8 + i * 0.25} x={x} y={700} w={200} /></Mv>
      <Burst tt={tt} at={F[i] + 0.4} x={x + 200} y={820} n={6} col="#e0d4b8" sp={200} sz={6} life={0.4} />
    </React.Fragment>; })}
    <Num3 tt={tt} at={5.3} out={20} x={680} y={300} n="3×" col="#ff8a5a" size={170} />
    {bag > 0.01 && <Mv y={(1 - bag) * -900}><Spr id="sp_c2_burlap_full" tt={tt} at={-5} x={1420} y={600} w={420} from="none" /></Mv>}
    {bag > 0.9 && <Glint tt={tt} at={12.3} x={1420} y={520} r={150} />}
  </>;
}}</Stage>;

// 31 · OLLA A PRESIÓN: la olla baja con su sombra, rebota y asienta; la válvula silba un chorro fino; el dial marca 35-40
export const CPressure: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const land = phys(tt, 3.6, 7, 0.4), jet = eio(tt, 4.3, 4.7), shake = jet > 0 ? 3 * Math.sin(tt * 30) * Math.exp(-1.5 * Math.max(0, tt - 4.7)) : 0, dial = eio(tt, 8.8, 10.2);
  return <>
    <BgB id="n_olla_presion" tt={tt} dim={0.86} />
    <Planks y={800} />
    <div style={{ position: "absolute", left: 960 - 280 * (0.6 + 0.4 * land), top: 870, width: 560 * (0.6 + 0.4 * land), height: 60, borderRadius: "50%", background: "rgba(0,0,0,.55)", filter: "blur(16px)", opacity: cl(land) }} />
    <Mv y={(1 - land) * -800 + shake}><Spr id="sp_pressure_cooker" tt={tt} at={-5} x={960} y={640} w={560} from="none" shadow={0} /></Mv>
    {/* chorro fino de vapor desde la válvula */}
    {jet > 0 && Array.from({ length: 26 }, (_, i) => { const ph = (tt * 1.6 + rnd(i)) % 1, s = 10 + 70 * ph; return <div key={i} style={{ position: "absolute", left: 960 + 8 * Math.sin(ph * 6 + i) + 30 * ph - s / 2, top: 360 - ph * 330 - s / 2 + (1 - land) * -800, width: s, height: s, borderRadius: "50%", background: "rgba(255,255,255,.85)", filter: `blur(${2 + 12 * ph}px)`, opacity: jet * (1 - ph) }} />; })}
    {/* dial de cocina dentro del frente de la olla */}
    <div style={{ position: "absolute", left: 960 - 95, top: 600, width: 190, height: 190, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fbf6ea, #d8ccb0)", boxShadow: "0 0 0 8px #8a8a8a, 0 10px 20px rgba(0,0,0,.5)", opacity: eio(tt, 8.4, 8.8) }}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 92, top: 6, width: 6, height: i % 3 ? 10 : 18, background: "#3a2a1a", transformOrigin: "3px 89px", transform: `rotate(${i * 30}deg)` }} />)}
      <div style={{ position: "absolute", left: 92, top: 24, width: 6, height: 71, background: "#b8221a", transformOrigin: "3px 71px", transform: `rotate(${225 * dial}deg)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontWeight: 900, fontSize: 34, color: "#3a2a1a" }}>{dial > 0.5 ? "40" : "35"}</div>
    </div>
  </>;
}}</Stage>;

// 32 · DEBAJO, CADA SEMANA: cuatro bolsas, una por semana, caen en fila, cada una más baja, sin pasar nunca la línea; el lápiz raya
export const CSack: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const AT = [6.8, 7.6, 8.3, 9.0], LINE = 430;
  return <>
    <BgB id="n_semanas" tt={tt} dim={0.72} />
    <Planks y={780} />
    <Spr id="sp_ledger_open" tt={tt} at={2.6} x={1580} y={360} w={420} rot={8} />
    {AT.map((a, i) => <div key={i} style={{ position: "absolute", left: 1450 + i * 40, top: 300, width: 8, height: 120 * eio(tt, a + 0.2, a + 0.4), background: "#2a1a10", transform: "rotate(10deg)", borderRadius: 4 }} />)}
    <div style={{ position: "absolute", left: 220, top: LINE, width: 1060, height: 0, borderTop: "6px dashed rgba(255,120,80,.85)", opacity: eio(tt, 6.0, 6.6) }} />
    {AT.map((a, i) => { const id = i < 2 ? "sp_c2_burlap_full" : "sp_c2_burlap_half", sc = 1 - i * 0.1; return <Mv key={i} sy={sc} ox={330 + i * 290} oy={860}><Spr id={id} tt={tt} at={a} x={330 + i * 290} y={640} w={280} /></Mv>; })}
  </>;
}}</Stage>;

// 33 · CENTAVOS EL PLATO: cinco centavos entran rodando de canto, tambalean y caen planos en fila delante de la sopa
export const CPennies: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const AT = [8.6, 9.0, 9.4, 9.8, 10.2];
  return <>
    <BgB id="n_repaso" tt={tt} dim={0.8} />
    <Planks y={700} />
    <Spr id="sp_bowl_tin_soup" tt={tt} at={0.3} x={960} y={520} w={560} />
    <Steam tt={tt} x={960} y={400} w={180} k={0.8} />
    {AT.map((a, i) => { const p = eio(tt, a, a + 0.8), x = 2100 - (2100 - (480 + i * 240)) * p, d = Math.max(0, tt - a - 0.8), wob = p < 1 ? 1 : Math.abs(Math.cos(d * 10)) * Math.exp(-3 * d); if (tt < a) return null; return <div key={i} style={{ position: "absolute", left: x, top: 900, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -90, top: 40, width: 180, height: 30, borderRadius: "50%", background: "rgba(0,0,0,.5)", filter: "blur(8px)" }} />
      <Img src={spr("sp_penny_old")} style={{ position: "absolute", left: -95, top: -95, width: 190, transform: `rotate(${(1 - p) * 900}deg) scaleY(${p < 1 ? 1 : 0.3 + 0.7 * wob})`, filter: "drop-shadow(0 10px 10px rgba(0,0,0,.6))" }} />
    </div>; })}
    {AT.map((a, i) => <Glint key={i} tt={tt} at={a + 1.2} x={480 + i * 240} y={900} r={70} />)}
    <Big tt={tt} at={10.9} x={960} y={150} txt="PENNIES A PLATE" size={100} col={AMB} />
  </>;
}}</Stage>;

export const HA: Record<string, C> = {
  c_ledger: CLedger, c_bowls: CBowls, c_axe: CAxe, c_store: CStore, c_cups: CCups, c_lazy: CLazy, c_sign: CSign, c_boil: CBoil,
  c_gravel: CGravel, c_lime: CLime, c_wash: CWash, c_dough: CDough, c_count: CCount, c_trinity: CTrinity, c_swirl: CSwirl,
  c_ripple: CRipple, c_pinch: CPinch, c_lid: CLid, c_patty: CPatty, c_stack: CStack, c_ladle: CLadle, c_matches: CMatches,
  c_drain: CDrain, c_sift: CSift, c_lanterns: CLanterns, c_stretch: CStretch, c_mouse: CMouse, c_frost: CFrost, c_gloss: CGloss,
  c_domino: CDomino, c_pressure: CPressure, c_sack: CSack, c_pennies: CPennies,
};
