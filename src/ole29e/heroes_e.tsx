// ole29e · LOS 39 COMPONENTES ÚNICOS (el barril de cerdo en sal). Cada uno = el OBJETO haciendo lo que se dice en ese segundo,
// sin carteles que expliquen: como mucho una palabra o un número grande. Tiempos locales = segundos desde el «at» de heroes.txt.
import React from "react";
import { Img } from "remotion";
import { AMB, Big, H, MARK, Pour, Spr, Stage, Steam, cl, eio, phys, spr } from "./hkit";
import { BgB, Burst, Cube, FireP, Glint, HH, Mv, Num3, OdoV, Planks, Tag2, W, WoodTop, rnd } from "./kit2";

type C = React.FC<{ t: number; h: H }>;

// pedazo de cerdo salado dibujado: grasa blanca con vetas rosas y cuero abajo
const Chunk: React.FC<{ x: number; y: number; w?: number; h?: number; r?: number; o?: number; dark?: number; f?: string }> = ({ x, y, w = 150, h = 90, r = 0, o = 1, dark = 0, f }) =>
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: o, transform: `rotate(${r}deg)`, borderRadius: "18% 22% 16% 20%", overflow: "hidden", filter: f ?? `brightness(${1 - 0.55 * dark}) saturate(${1 - 0.6 * dark})`, boxShadow: "0 6px 10px rgba(0,0,0,.4)",
    background: `linear-gradient(180deg, #fbf6ee 0 26%, #e9a3a0 26% 36%, #f8f1e6 36% 58%, #dc8f8c 58% 66%, #f4ebdf 66% 84%, #c7a27a 84%)` }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,.55), transparent 55%)" }} />
  </div>;
// cristal de sal gruesa
const Xtal: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number }> = ({ x, y, s = 14, r = 0, o = 1 }) =>
  <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, opacity: o, transform: `rotate(${r}deg)`, background: "linear-gradient(135deg,#ffffff,#d8dde2 60%,#aeb6bd)", boxShadow: "0 0 6px rgba(255,255,255,.7), 0 3px 4px rgba(0,0,0,.35)" }} />;
// barril de roble en CORTE (le falta la mitad de adelante): duelas del fondo, aros, salmuera hasta `lev`, contenido adentro
const Cut: React.FC<{ x: number; y: number; w?: number; h?: number; lev?: number; brine?: string; children?: React.ReactNode }> = ({ x, y, w = 560, h = 640, lev = 0.8, brine = "rgba(190,215,225,.42)", children }) =>
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h }}>
    <div style={{ position: "absolute", left: -18, top: 20, width: w + 36, height: h - 20, borderRadius: "16% / 6%", background: "repeating-linear-gradient(90deg, #5a3a1e 0 3px, #8a5e34 3px 52px, #7a5028 52px 56px, #93663a 56px 104px)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 14, top: 34, width: w - 28, height: h - 52, borderRadius: "12% / 5%", background: "linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,.18) 30%, rgba(0,0,0,.18) 70%, rgba(0,0,0,.55)), repeating-linear-gradient(90deg, #4a2e16 0 3px, #6e4824 3px 48px)", overflow: "hidden" }}>
      {children}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${100 * lev}%`, background: `linear-gradient(180deg, ${brine}, rgba(120,150,160,.5))`, borderTop: "3px solid rgba(235,248,255,.7)" }} />
    </div>
    {[0.08, 0.3, 0.7, 0.93].map((k) => <div key={k} style={{ position: "absolute", left: -22, top: h * k, width: w + 44, height: 22, borderRadius: 10, background: "linear-gradient(180deg,#5a5a5a,#2a2a2a 60%,#1a1a1a)", clipPath: "polygon(0 0, 7% 0, 7% 100%, 0 100%, 0 0, 93% 0, 100% 0, 100% 100%, 93% 100%)" }} />)}
  </div>;
// nieve que cae
const Snow: React.FC<{ tt: number; n?: number; seed?: number }> = ({ tt, n = 50, seed = 3 }) => <>{Array.from({ length: n }, (_, i) => { const x = (rnd(i, seed) * 2000 + 20 * Math.sin(tt * 0.6 + i)) % 1960, y = ((rnd(i, seed + 1) * 1100 + tt * (35 + 45 * rnd(i, seed + 2))) % 1100) - 20, s = 3 + rnd(i, seed + 3) * 8; return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "#fff", opacity: 0.72, filter: `blur(${s > 9 ? 2 : 0}px)` }} />; })}</>;
const page = (n: string | number, x: number, y: number, o = 1, r = 0, s = 1): React.ReactNode => <div style={{ position: "absolute", left: x - 110 * s, top: y - 125 * s, width: 220 * s, height: 250 * s, opacity: o, transform: `rotate(${r}deg)`, borderRadius: 8, background: "linear-gradient(180deg,#24384c 0 22%, #f3ecdc 22%)", boxShadow: "0 18px 28px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 50 * s, boxSizing: "border-box", fontFamily: MARK, fontSize: 92 * s, color: "#2a1a10" }}>{n}</div>;

// 1 · EL TRINEO LLEGA: los caballos entran tirando el trineo cargado sobre la nieve y frenan con peso; el contador de barriles cuenta 10
export const ESled: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 80% 70% at 50% 40%, #3a4654, #0e1218 78%)">{(tt) => {
  const p = phys(tt, 0.3, 3.2, 0.7), x = 2300 - 1300 * p, bob = 4 * Math.sin(tt * 5) * (1 - cl(p * 1.1 - 0.05));
  return <>
    <BgB id="n_trineo_lago" tt={tt} dim={0.62} />
    <div style={{ position: "absolute", left: -100, top: 760, width: 2120, height: 420, background: "linear-gradient(180deg,#eef3f8,#c4cfd9)", boxShadow: "inset 0 20px 40px rgba(110,130,160,.5)" }} />
    {/* surcos del trineo en la nieve */}
    {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: x + 380, top: 846 + k * 30, width: Math.max(0, 2300 - x), height: 8, background: "rgba(120,135,155,.6)", borderRadius: 4 }} />)}
    <Mv x={x - 960} y={bob}><Spr id="sp_e_sled" tt={tt} at={-5} x={960} y={640} w={1180} from="none" shadow={0} /></Mv>
    <div style={{ position: "absolute", left: x - 520, top: 820, width: 1100, height: 70, borderRadius: "50%", background: "rgba(40,50,70,.35)", filter: "blur(18px)" }} />
    {[0, 1].map((i) => { const ph = (tt * 0.8 + i * 0.5) % 1; return <div key={i} style={{ position: "absolute", left: x - 470 - ph * 140, top: 470 - ph * 40, width: 110 + 120 * ph, height: 70 + 40 * ph, borderRadius: "50%", background: "rgba(235,242,250,.7)", filter: "blur(16px)", opacity: Math.sin(ph * Math.PI) * 0.9 }} />; })}
    <Snow tt={tt} n={44} />
    <OdoV v={Math.round(10 * eio(tt, 2.0, 3.2))} x={1600} y={180} op={eio(tt, 1.8, 2.2)} size={130} dec={0} pre="" />
    <Big tt={tt} at={5.0} x={1600} y={340} txt="2,000 LB" size={80} col={AMB} />
  </>;
}}</Stage>;

// 2 · LAS DOS COSAS QUE VAS A VER: una papa cae y rueda hasta quedar quieta sobre la tapa; después una veta oscura baja por la duela
export const EWeek: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pr = phys(tt, 3.0, 7, 0.45), roll = eio(tt, 3.4, 4.4), ooze = eio(tt, 7.8, 9.6);
  return <>
    <BgB id="n_barril_abierto" tt={tt} dim={0.74} />
    <Planks y={860} dark />
    <Spr id="sp_e_barrel" tt={tt} at={0.2} x={960} y={620} w={560} />
    {pr > 0.01 && <div style={{ position: "absolute", left: 760 + 200 * roll, top: 330 - 600 * (1 - pr), width: 0, height: 0 }}><Img src={spr("sp_e_potato")} style={{ position: "absolute", left: -70, top: -60, width: 140, transform: `rotate(${roll * 260 + 6 * Math.sin(tt * 6) * Math.exp(-3 * Math.max(0, tt - 4.4))}deg)`, filter: "drop-shadow(0 10px 10px rgba(0,0,0,.55))" }} /></div>}
    {/* la veta oscura que delata un barril que se echa a perder */}
    <svg width={W} height={HH} style={{ position: "absolute", left: 0, top: 0 }}><path d="M1080 420 C 1092 520, 1070 610, 1086 720 S 1076 860, 1084 900" stroke="rgba(40,30,10,.85)" strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={`${560 * ooze} 2000`} style={{ filter: "blur(1.5px)" }} /></svg>
    <Big tt={tt} at={8.0} x={960} y={130} txt="ONE WEEK" size={96} col="#ff8a5a" />
  </>;
}}</Stage>;

// 3 · HACE MUCHO: la hoja de calendario de hoy se vuela y debajo aparece una de 1925, amarilla, que se asienta con peso
export const EYears: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fly = eio(tt, 2.9, 4.0), sep = eio(tt, 3.2, 4.4), warn = eio(tt, 7.0, 7.6);
  return <>
    <BgB id="n_viejo_nuevo" tt={tt} dim={0.72} />
    <Mv f={`sepia(${0.7 * sep}) brightness(${1 - 0.1 * sep})`}>
      <div style={{ position: "absolute", left: 760, top: 240, width: 400, height: 500, borderRadius: 12, background: "linear-gradient(180deg,#7a2a1a 0 20%, #f0e4c4 20%)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 90, boxSizing: "border-box", fontFamily: MARK, fontSize: 150, color: "#2a1a10", transform: `rotate(${-2 + 2 * Math.sin(tt * 0.7)}deg)` }}>1925</div>
      {fly < 1 && <div style={{ position: "absolute", left: 760 + 1200 * fly * fly, top: 240 - 500 * fly, width: 400, height: 500, borderRadius: 12, transform: `rotate(${50 * fly}deg)`, background: "linear-gradient(180deg,#24384c 0 20%, #fbfaf6 20%)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 90, boxSizing: "border-box", fontFamily: MARK, fontSize: 150, color: "#1a1a1a" }}>2026</div>}
    </Mv>
    {/* el cuchillo de curar queda apoyado y una mano invisible lo tapa con el repasador: no lo hagas en casa */}
    <Mv x={0} y={-500 * (1 - phys(tt, 7.0, 7, 0.45))} r={-8}><Spr id="sp_e_pork_slab" tt={tt} at={-5} x={1460} y={720} w={340} from="none" /></Mv>
    {warn > 0 && <div style={{ position: "absolute", left: 1270, top: 560, width: 380, height: 320, border: `14px solid rgba(220,60,40,${0.9 * warn})`, borderRadius: "50%", transform: `rotate(-20deg) scale(${0.8 + 0.2 * warn})` }}><div style={{ position: "absolute", left: 170, top: -20, width: 14, height: 340, background: `rgba(220,60,40,${0.9 * warn})`, transform: "rotate(90deg)" }} /></div>}
  </>;
}}</Stage>;

// 4 · QUEMA COMIDA COMO LEÑA: los platos de cerdo entran a la boca de la estufa como si fueran troncos y el fuego crece
export const EBurn: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 60%, #2a1a10, #050403 78%)">{(tt) => {
  const L = [4.6, 5.6, 6.6, 7.3], fire = 0.4 + 0.6 * eio(tt, 5.2, 7.8);
  return <>
    <BgB id="n_aserradores" tt={tt} dim={0.82} />
    {/* boca de la estufa de hierro */}
    <div style={{ position: "absolute", left: 620, top: 380, width: 680, height: 440, borderRadius: 30, background: "linear-gradient(180deg,#2a2a2a,#0e0e0e)", boxShadow: "0 0 0 18px #3a3a3a, 0 40px 60px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 60, top: 60, width: 560, height: 320, borderRadius: 18, overflow: "hidden", background: "radial-gradient(ellipse at 50% 90%, #ffb040, #a83a10 45%, #1a0804 85%)" }}>
        <FireP tt={tt} x={280} y={330} w={500} k={fire} n={20} />
      </div>
    </div>
    {L.map((a, i) => { const p = eio(tt, a, a + 0.6), o = 1 - eio(tt, a + 0.5, a + 0.7); if (p <= 0 || o <= 0) return null; const id = i % 2 ? "sp_e_pork_fried" : "sp_e_pork_slices"; return <div key={i} style={{ position: "absolute", left: 1700 - (1700 - 960) * p, top: 760 - 320 * Math.sin(p * Math.PI) - 120 * p, width: 0, height: 0, opacity: o }}><Img src={spr(id)} style={{ position: "absolute", left: -110, top: -70, width: 220 * (1 - 0.4 * p), filter: "drop-shadow(0 12px 12px rgba(0,0,0,.6))" }} /></div>; })}
    {L.map((a, i) => <Burst key={i} tt={tt} at={a + 0.6} x={960} y={620} n={14} col="#ffc060" sp={420} sz={6} life={0.7} />)}
    <Num3 tt={tt} at={9.6} out={20} x={960} y={190} n="8,000" col="#ffd27a" size={170} />
  </>;
}}</Stage>;

// 5 · CASI TODO GRASA: la lonja cae sobre la tabla; una luz recorre la grasa blanca y las vetas rosas; en la sartén se derrite
export const EFat: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const scan = eio(tt, 4.0, 6.8), toPan = eio(tt, 7.6, 8.4), melt = eio(tt, 8.6, 11.0);
  return <>
    <BgB id="n_tocino_rayas" tt={tt} dim={0.72} />
    <WoodTop />
    <Mv x={-380 * toPan} s={1 - 0.15 * toPan} ox={960} oy={560}>
      <Spr id="sp_e_pork_slab" tt={tt} at={0.2} x={960} y={540} w={720} />
      <div style={{ position: "absolute", left: 600, top: 380, width: 720, height: 320, overflow: "hidden", mixBlendMode: "screen", opacity: scan > 0 && scan < 1 ? 1 : 0 }}><div style={{ position: "absolute", top: 0, bottom: 0, left: -200 + 1120 * scan, width: 160, background: "linear-gradient(90deg, transparent, rgba(255,240,220,.6), transparent)" }} /></div>
    </Mv>
    <Spr id="sp_e_pan_pork" tt={tt} at={7.4} x={1360} y={600} w={560} from="right" />
    {/* la grasa que se derrite en la sartén: charco dorado que se agranda */}
    <div style={{ position: "absolute", left: 1360 - 200 * melt, top: 600 - 150 * melt, width: 400 * melt, height: 300 * melt, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,215,120,.55), rgba(200,140,40,.25) 70%, transparent)", mixBlendMode: "screen" }} />
    <Steam tt={tt} x={1360} y={440} w={180} k={0.9 * melt} />
    <Big tt={tt} at={0.8} x={960} y={150} txt="FAT" size={150} col={AMB} out={7.4} />
  </>;
}}</Stage>;

// 6 · LA RES SE CONGELA Y SE DESCONGELA: el costillar cuelga; la escarcha sube, gotea, vuelve a subir; al final se pone oscuro
export const EBeef: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const cyc = tt < 6.4 ? 0 : (tt - 6.4) / 1.4, fr = tt < 6.4 ? eio(tt, 5.8, 6.6) : 0.5 + 0.5 * Math.cos(cyc * Math.PI), bad = eio(tt, 11.2, 12.2), sw = 2.5 * Math.sin(tt * 0.9);
  return <>
    <BgB id="n_res_congelada" tt={tt} dim={0.66} />
    <div style={{ position: "absolute", left: 0, top: 60, width: W, height: 30, background: "linear-gradient(180deg,#5a3a20,#2e1c0e)" }} />
    <Mv r={sw} ox={960} oy={80}>
      <div style={{ position: "absolute", left: 956, top: 80, width: 8, height: 80, background: "#888" }} />
      <Spr id="sp_e_beef_side" tt={tt} at={2.4} x={960} y={560} w={520} from="up" style={{ filter: `saturate(${1 - 0.7 * fr - 0.3 * bad}) brightness(${(1 + 0.35 * fr) * (1 - 0.35 * bad)}) hue-rotate(${-25 * bad}deg) drop-shadow(0 24px 26px rgba(0,0,0,.5))` }} />
      {/* gotas del deshielo */}
      {tt > 7 && fr < 0.6 && [0, 1, 2, 3].map((i) => { const ph = ((tt * 1.4) + i * 0.27) % 1; return <div key={i} style={{ position: "absolute", left: 870 + i * 60, top: 880 + ph * 160, width: 10, height: 16, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(200,140,140,.8)", opacity: 1 - ph }} />; })}
    </Mv>
    {/* el termómetro del galpón que sube y baja */}
    <div style={{ position: "absolute", left: 1560, top: 300, width: 40, height: 420, borderRadius: 20, background: "rgba(240,240,240,.85)", boxShadow: "0 16px 26px rgba(0,0,0,.5)", opacity: eio(tt, 6.0, 6.5) }}><div style={{ position: "absolute", left: 12, bottom: 14, width: 16, height: 80 + 260 * (1 - fr), borderRadius: 8, background: "linear-gradient(90deg,#9a1010,#e83a2a,#9a1010)" }} /></div>
  </>;
}}</Stage>;

// 7 · ESCUCHAR EL BARRIL: los nudillos golpean dos barriles en corte; el lleno apenas vibra, el que perdió salmuera retumba arriba
export const EKnock: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k1 = [2.3, 2.8, 3.3], k2 = [9.6, 10.6, 11.1];
  const ring = (ks: number[], amp: number, life: number) => ks.reduce((s, a) => s + (tt > a ? amp * Math.exp(-(tt - a) / life) * Math.sin((tt - a) * 40) : 0), 0);
  const r1 = ring(k1, 3, 0.08), r2 = ring(k2, 9, 0.45);
  const waves = (ks: number[], x: number, y: number, life: number, n: number) => ks.flatMap((a) => Array.from({ length: n }, (_, j) => { const k = (tt - a - j * 0.09) / life; return k > 0 && k < 1 ? <div key={`${a}-${j}`} style={{ position: "absolute", left: x - 60 - 260 * k, top: y - 60 - 260 * k, width: 120 + 520 * k, height: 120 + 520 * k, borderRadius: "50%", border: `4px solid rgba(255,220,170,${0.6 * (1 - k)})` }} /> : null; }));
  return <>
    <BgB id="n_nudillos" tt={tt} dim={0.74} />
    <Planks y={880} dark />
    <Mv x={r1}><Cut x={560} y={560} w={440} h={560} lev={0.96} /></Mv>
    <Mv x={r2}><Cut x={1360} y={560} w={440} h={560} lev={0.62} /></Mv>
    {waves(k1, 560, 360, 0.35, 1)}
    {waves(k2, 1360, 360, 1.1, 3)}
    {/* el nudillo: puño que golpea la duela */}
    {[...k1.map((a) => [a, 800]), ...k2.map((a) => [a, 1600])].map(([a, x], i) => { const d = tt - a; if (d < -0.3 || d > 0.5) return null; const pull = d < 0 ? -d / 0.3 : Math.min(1, d / 0.2); return <div key={i} style={{ position: "absolute", left: x + 70 * pull, top: 330, width: 110, height: 90, borderRadius: "40% 50% 50% 40%", background: "radial-gradient(circle at 35% 35%, #e6a88a, #b06a4e 70%)", boxShadow: "0 10px 14px rgba(0,0,0,.45)" }} />; })}
    <Big tt={tt} at={7.0} x={560} y={140} txt="DEAD" size={100} col={AMB} />
    <Big tt={tt} at={11.5} x={1360} y={140} txt="HOLLOW" size={100} col="#ff8a5a" />
  </>;
}}</Stage>;

// 8 · EL TONELERO: las duelas curvas se paran en círculo, se inclinan juntas y los aros de hierro bajan y las aprietan
export const EStaves: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const N = 9, squeeze = eio(tt, 3.6, 4.8), hoops = [5.2, 5.5, 5.8], wet = eio(tt, 8.4, 9.4);
  return <>
    <BgB id="n_tonelero" tt={tt} dim={0.72} />
    <Planks y={860} />
    {Array.from({ length: N }, (_, i) => { const a = 1.1 + i * 0.12, p = phys(tt, a, 6.5, 0.5); if (p <= 0.01) return null; const off = (i - (N - 1) / 2), spread = 1 - 0.55 * squeeze, x = 960 + off * 64 * spread * 1.6, tilt = -off * 1.6 * (1 - squeeze); return <Mv key={i} y={-700 * (1 - p)} r={tilt} ox={x} oy={880}><Spr id="sp_e_stave" tt={tt} at={-5} x={x} y={600} w={86} from="none" shadow={0} style={{ filter: `brightness(${0.8 + 0.25 * Math.cos(off * 0.4)}) drop-shadow(0 16px 14px rgba(0,0,0,.5))`, height: 560, objectFit: "fill" }} /></Mv>; })}
    {hoops.map((a, i) => { const p = phys(tt, a, 7, 0.4), y = [380, 600, 820][i]; if (p <= 0.01) return null; return <div key={i} style={{ position: "absolute", left: 960 - 330, top: -100 + (y - -100) * p, width: 660, height: 70, borderRadius: "50%", border: "16px solid #2a2a2a", borderTopColor: "transparent", boxShadow: "0 10px 12px rgba(0,0,0,.4)" }} />; })}
    {hoops.map((a, i) => <Burst key={i} tt={tt} at={a + 0.35} x={960} y={[400, 620, 840][i]} n={6} col="#d0c0a0" sp={200} sz={5} life={0.35} />)}
    {/* agua salada adentro: ni una gota afuera */}
    <div style={{ position: "absolute", left: 700, top: 420 + 380 * (1 - wet), width: 520, height: 400 * wet, background: "linear-gradient(180deg, rgba(190,220,235,.3), rgba(130,170,190,.35))", mixBlendMode: "screen", borderRadius: 20 }} />
    <Big tt={tt} at={6.5} x={960} y={130} txt="OAK" size={140} col={AMB} />
  </>;
}}</Stage>;

// 9 · EL PINO PIERDE: el barril de pino suda resina y gotea por las juntas; después se vuelca y sólo sirve para clavos
export const EPine: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const tip = eio(tt, 5.8, 6.4), nails = eio(tt, 6.2, 7.2);
  return <>
    <BgB id="n_barril_pino" tt={tt} dim={0.72} />
    <Planks y={860} />
    <Mv r={-88 * tip} ox={1100} oy={900} y={-30 * Math.sin(tip * Math.PI)}><Spr id="sp_e_pine_barrel" tt={tt} at={0.2} x={960} y={600} w={520} /></Mv>
    {tip < 0.2 && Array.from({ length: 7 }, (_, i) => { const ph = ((tt * 0.7) + rnd(i, 4)) % 1, x = 760 + i * 66; return <div key={i} style={{ position: "absolute", left: x, top: 420 + ph * 440, width: 12, height: 20, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: i % 2 ? "rgba(230,170,60,.9)" : "rgba(200,225,235,.85)", opacity: 1 - ph }} />; })}
    {/* charco que crece debajo */}
    <div style={{ position: "absolute", left: 960 - 300 * cl(tt / 5), top: 880, width: 600 * cl(tt / 5), height: 50, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(200,160,70,.55), transparent 70%)", opacity: 1 - tip }} />
    {nails > 0 && Array.from({ length: 30 }, (_, i) => { const p = cl(nails * 1.6 - rnd(i, 2) * 0.6); return <div key={i} style={{ position: "absolute", left: 640 + p * (rnd(i, 3) * 460), top: 640 + p * (220 + rnd(i, 5) * 40) - 160 * Math.sin(p * Math.PI), width: 10, height: 60, borderRadius: 2, transform: `rotate(${rnd(i) * 360 + p * 200}deg)`, background: "linear-gradient(90deg,#3a3a3a,#8a8a8a,#3a3a3a)", opacity: p > 0 ? 1 : 0 }} />; })}
    <Big tt={tt} at={6.8} x={960} y={140} txt="NAILS" size={120} col={AMB} />
  </>;
}}</Stage>;

// 10 · ARVID LO HACE RODAR: el barril acostado cruza rodando, choca la leñera y salta la astilla; vuelve a rodar: otra vez
export const ERoll: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const r1 = eio(tt, 0.6, 2.7), back = eio(tt, 8.8, 9.6), x = -300 + 1500 * r1 - 900 * back, hit = tt > 2.7 ? Math.exp(-5 * (tt - 2.7)) * Math.sin((tt - 2.7) * 24) : 0;
  return <>
    <BgB id="n_lenero" tt={tt} dim={0.7} />
    <Planks y={760} />
    {/* la leñera: troncos apilados que se desparraman con el golpe */}
    {Array.from({ length: 14 }, (_, i) => { const row = Math.floor(i / 5), col = i % 5, d = tt > 2.75 ? cl((tt - 2.75) * 2) : 0, fl = rnd(i, 7) > 0.45 ? d : 0; return <div key={i} style={{ position: "absolute", left: 1400 + col * 70 + row * 30 + fl * (rnd(i, 8) - 0.3) * 300, top: 820 - row * 60 - 220 * fl * Math.sin(fl * Math.PI) * (0.6 + rnd(i, 9)) + 70 * fl * row, width: 70, height: 60, borderRadius: "50%", background: "radial-gradient(circle, #d8b27a 0 30%, #a8784a 31% 60%, #5a3a1e 62%)", transform: `rotate(${fl * 300 * (rnd(i) - 0.5)}deg)`, boxShadow: "0 6px 8px rgba(0,0,0,.4)" }} />; })}
    <Burst tt={tt} at={2.75} x={1380} y={760} n={22} col="#d9b27a" sp={520} sz={10} life={0.9} />
    <Mv x={x - 960 + 10 * hit} y={0} r={(x / (Math.PI * 240)) * 360} ox={x} oy={720}><Spr id="sp_e_barrel_lying" tt={tt} at={-5} x={x} y={720} w={520} from="none" shadow={0} /></Mv>
    <div style={{ position: "absolute", left: x - 240, top: 900, width: 480, height: 40, borderRadius: "50%", background: "rgba(0,0,0,.5)", filter: "blur(12px)" }} />
    <Big tt={tt} at={8.8} x={960} y={150} txt="AGAIN." size={130} col={AMB} />
  </>;
}}</Stage>;

// 11 · SAL GRUESA, SIN NADA: la bolsa vuelca cristales grandes que rebotan; el salero de mesa echa polvo fino que se apelmaza
export const ESalt: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pour = eio(tt, 4.6, 7.6), fine = eio(tt, 9.0, 11.4), cake = eio(tt, 11.6, 12.4);
  return <>
    <BgB id="n_sal_gruesa" tt={tt} dim={0.72} />
    <WoodTop dark />
    <Mv r={-38 * eio(tt, 4.2, 4.8)} ox={560} oy={520}><Spr id="sp_e_salt_sack" tt={tt} at={3.6} x={560} y={420} w={460} from="left" /></Mv>
    {Array.from({ length: 60 }, (_, i) => { const a = 4.6 + rnd(i, 1) * 3, p = eio(tt, a, a + 0.55); if (p <= 0) return null; const bx = 660 + rnd(i, 2) * 300, by = 860 - rnd(i, 3) * 70 * cl(pour * 1.5); const b = p < 1 ? 0 : Math.abs(Math.sin((tt - a - 0.55) * 14)) * 30 * Math.exp(-6 * (tt - a - 0.55)); return <Xtal key={i} x={700 + (bx - 700) * p} y={520 + (by - 520) * p * p - b} s={14 + rnd(i, 4) * 16} r={rnd(i, 5) * 90 + p * 180} />; })}
    {/* el salero moderno: polvo fino que cae y se vuelve terrón */}
    <Mv r={150 * eio(tt, 8.6, 9.0)} ox={1420} oy={420}><Spr id="sp_e_salt_canister" tt={tt} at={8.2} x={1420} y={420} w={220} from="right" /></Mv>
    {fine > 0 && <div style={{ position: "absolute", left: 1380, top: 520, width: 30, height: 320 * fine, background: "linear-gradient(180deg, rgba(255,255,255,.95), rgba(240,240,240,.6))", filter: "blur(2px)", opacity: 1 - cake }} />}
    <div style={{ position: "absolute", left: 1395 - 150 * fine, top: 820, width: 300 * fine, height: 90 * fine, borderRadius: cake > 0.5 ? "30% 40% 20% 35%" : "50% 50% 0 0", background: cake > 0.5 ? "radial-gradient(circle at 40% 30%, #f2f0ec, #c8c4ba)" : "linear-gradient(180deg,#ffffff,#e6e6e6)", boxShadow: "0 6px 10px rgba(0,0,0,.35)", transform: `rotate(${-6 * cake}deg)` }} />
    <Big tt={tt} at={6.0} x={760} y={150} txt="COARSE" size={110} col={AMB} />
  </>;
}}</Stage>;

// 12 · CAPA SOBRE CAPA: en el barril en corte caen sal, lonjas con el cuero abajo, sal, lonjas… hasta arriba
export const ELayers: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const ev = [[1.4, "s"], [2.8, "s"], [3.6, "p"], [6.0, "p"], [6.4, "p"], [7.2, "s"], [8.2, "p"], [8.7, "s"], [9.2, "p"], [9.8, "s"]] as const;
  const IW = 504, IH = 588; let lvl = 0; const lay: { a: number; k: string; y: number }[] = [];
  ev.forEach(([a, k]) => { const th = k === "s" ? 26 : 70; lay.push({ a, k, y: IH - lvl - th / 2 }); lvl += th; });
  return <>
    <BgB id="n_capas_barril" tt={tt} dim={0.72} />
    <Planks y={900} dark />
    <Cut x={960} y={560} w={560} h={640} lev={0}>
      {lay.map((l, i) => { const p = phys(tt, l.a, 8, 0.45); if (p <= 0.01) return null; const y = -120 + (l.y - -120) * p; return l.k === "s"
        ? <div key={i} style={{ position: "absolute", left: 0, top: y - 13, width: IW, height: 26, background: "repeating-linear-gradient(90deg, #f6f6f2 0 9px, #d8dcdf 9px 14px, #fbfbf8 14px 22px)", borderRadius: "40% 40% 10% 10% / 80% 80% 20% 20%", boxShadow: "0 2px 4px rgba(0,0,0,.3)" }} />
        : <React.Fragment key={i}>{[0, 1, 2].map((j) => <Chunk key={j} x={90 + j * 165 + (rnd(i, j) - 0.5) * 14} y={y} w={150} h={66} r={(rnd(i, j + 3) - 0.5) * 6} />)}</React.Fragment>; })}
    </Cut>
    {ev.filter(([, k]) => k === "s").map(([a], i) => Array.from({ length: 10 }, (_, j) => { const p = eio(tt, a - 0.35 + j * 0.02, a + j * 0.02); return p > 0 && p < 1 ? <Xtal key={`${i}-${j}`} x={760 + rnd(j, i + 2) * 400} y={160 + 320 * p} s={12} r={j * 40 + p * 200} /> : null; }))}
  </>;
}}</Stage>;

// 13 · HERVIDA Y ENFRIADA: la salmuera hierve en la pava, después se aquieta y se cubre de escarcha antes de bajar sobre la carne
export const EBoiled: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const boil = eio(tt, 1.6, 2.4) * (1 - eio(tt, 6.8, 7.8)), cool = eio(tt, 7.0, 9.0), pour = eio(tt, 9.0, 9.6);
  return <>
    <BgB id="n_olla_hierve" tt={tt} dim={0.74} />
    <Planks y={880} dark />
    <FireP tt={tt} x={760} y={930} w={420} k={boil} n={16} />
    <Mv r={-40 * pour} ox={900} oy={500} f={`saturate(${1 - 0.4 * cool}) brightness(${1 + 0.15 * cool})`}><Spr id="sp_e_kettle" tt={tt} at={0.2} x={760} y={680} w={520} /></Mv>
    {Array.from({ length: 14 }, (_, i) => { const ph = (tt * 2.2 + rnd(i)) % 1; return boil > 0.1 && <div key={i} style={{ position: "absolute", left: 600 + rnd(i, 2) * 320, top: 470 - 30 * ph, width: 22 * ph, height: 22 * ph, borderRadius: "50%", border: "2px solid rgba(255,255,255,.85)", opacity: boil * (1 - ph) }} />; })}
    <Steam tt={tt} x={760} y={430} w={240} k={1.4 * boil + 0.2} />
    {/* escarcha que nace del borde de la pava al enfriarse */}
    <div style={{ position: "absolute", left: 500, top: 450, width: 520, height: 40, borderRadius: "50%", background: "linear-gradient(90deg, rgba(220,240,255,0), rgba(225,242,255,.85), rgba(220,240,255,0))", opacity: cool, filter: "blur(3px)" }} />
    <Spr id="sp_e_pork_slab" tt={tt} at={8.4} x={1440} y={720} w={420} from="right" />
    <Pour tt={tt} at={9.4} out={11.6} x={1220} y1={470} y2={640} col="rgba(200,225,235,.85)" w={20} />
    {/* el termómetro de cocina baja de rojo a azul */}
    <div style={{ position: "absolute", left: 1660, top: 220, width: 34, height: 300, borderRadius: 17, background: "rgba(240,240,240,.9)", boxShadow: "0 12px 20px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", left: 9, bottom: 10, width: 16, height: 40 + 230 * (boil > 0.5 ? 1 : 1 - cool), borderRadius: 8, background: cool > 0.5 ? "#3a7ad8" : "#d8321a" }} /></div>
  </>;
}}</Stage>;

// 14 · LA PRUEBA DE LA PAPA: la papa se hunde en el balde; la sal cae y el palo revuelve; vuelve a entrar y sube a flotar
export const EPotato: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sink = eio(tt, 0.0, 1.3), out = eio(tt, 2.9, 3.6), salt = eio(tt, 3.9, 5.2), stir = eio(tt, 5.3, 5.6) * (1 - eio(tt, 8.6, 9.0)), redrop = eio(tt, 9.4, 10.2), rise = eio(tt, 11.6, 13.0);
  const BX = 960, TOP = 380, BOT = 900, py = tt < 3.6 ? TOP + 30 + (BOT - 110 - TOP - 30) * sink - 700 * out : tt < 9.4 ? -200 : rise > 0 ? BOT - 110 - (BOT - 110 - (TOP + 60)) * rise + 6 * Math.sin(tt * 3) * rise : TOP - 200 + (BOT - 110 - TOP + 200) * redrop;
  return <>
    <BgB id="n_papa_hunde" tt={tt} dim={0.74} />
    <Planks y={880} />
    {/* balde de madera en corte con salmuera clara */}
    <div style={{ position: "absolute", left: BX - 340, top: TOP, width: 680, height: BOT - TOP, borderRadius: "6% 6% 14% 14% / 4% 4% 10% 10%", background: "repeating-linear-gradient(90deg,#5a3a1e 0 4px,#8a5e34 4px 80px)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 24, right: 24, top: 40, bottom: 24, borderRadius: "0 0 50px 50px", background: `linear-gradient(180deg, rgba(200,225,235,${0.35 + 0.25 * salt}), rgba(140,170,185,.55))`, overflow: "hidden" }}>
        {Array.from({ length: 18 }, (_, i) => { const p = cl(salt * 1.4 - rnd(i) * 0.4), sp = stir * Math.sin(tt * 6 + i); return p > 0 && p < 1 && <Xtal key={i} x={80 + rnd(i, 2) * 480 + 40 * sp} y={-20 + 400 * p} s={12} r={i * 30 + p * 300} o={1 - p} />; })}
        {stir > 0 && <div style={{ position: "absolute", left: 280 + 120 * Math.sin(tt * 5), top: -60, width: 22, height: 420, borderRadius: 11, background: "linear-gradient(90deg,#6a4426,#a8784a,#6a4426)", transform: `rotate(${18 * Math.cos(tt * 5)}deg)` }} />}
        {stir > 0 && <div style={{ position: "absolute", left: 120, top: 10, width: 400, height: 40, borderRadius: "50%", border: "3px solid rgba(255,255,255,.4)", transform: `rotate(${tt * 200}deg) scaleY(.3)` }} />}
      </div>
    </div>
    {py > -150 && <div style={{ position: "absolute", left: BX, top: py, width: 0, height: 0 }}><Img src={spr("sp_e_potato")} style={{ position: "absolute", left: -80, top: -65, width: 160, transform: `rotate(${20 * Math.sin(tt)}deg)`, filter: "drop-shadow(0 8px 8px rgba(0,0,0,.4))" }} /></div>}
    {rise > 0.9 && <Glint tt={tt} at={13.0} x={BX} y={TOP + 50} r={110} />}
    <Big tt={tt} at={1.2} x={BX} y={180} txt="SINKS" size={90} col="#ff8a5a" out={3.6} />
    <Big tt={tt} at={12.8} x={BX} y={180} txt="FLOATS" size={110} col={AMB} />
  </>;
}}</Stage>;

// 15 · EL AGUA MÁS PESADA: en la columna de agua la sal se disuelve, el agua se oscurece desde abajo y empuja la papa hacia arriba
export const EHeavy: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 70% at 50% 50%, #1c2a34, #05080a 78%)">{(tt) => {
  const salt = eio(tt, 4.6, 8.2), push = eio(tt, 10.0, 11.6), CX = 960, TOP = 160, BOT = 960;
  const py = BOT - 120 - (BOT - 120 - (TOP + 80)) * push;
  return <>
    <BgB id="n_balde_salmuera" tt={tt} dim={0.84} />
    <div style={{ position: "absolute", left: CX - 260, top: TOP, width: 520, height: BOT - TOP, borderRadius: "20px 20px 40px 40px", background: "linear-gradient(90deg, rgba(255,255,255,.18), rgba(255,255,255,.04) 20%, rgba(255,255,255,.04) 80%, rgba(255,255,255,.2))", boxShadow: "inset 0 0 0 6px rgba(220,235,245,.4), 0 30px 50px rgba(0,0,0,.6)", overflow: "hidden" }}>
      {/* capas de agua cada vez más densas desde el fondo */}
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: i * 100, height: 100, background: `rgba(120,170,200,${0.12 + 0.4 * cl(salt * 1.6 - i * 0.12)})` }} />)}
      {Array.from({ length: 26 }, (_, i) => { const a = 4.6 + rnd(i) * 3.4, p = eio(tt, a, a + 1.2); return p > 0 && p < 1 && <Xtal key={i} x={40 + rnd(i, 2) * 440} y={-10 + 700 * p} s={14 * (1 - p) + 2} r={i * 40} o={1 - p * 0.8} />; })}
    </div>
    {/* flechas de empuje que nacen abajo */}
    {push > 0 && [0, 1, 2].map((i) => { const ph = (tt * 1.2 + i * 0.33) % 1; return <div key={i} style={{ position: "absolute", left: CX - 120 + i * 120 - 12, top: BOT - 80 - ph * 300, width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderBottom: "26px solid rgba(255,210,140,.8)", opacity: Math.sin(ph * Math.PI) * push }} />; })}
    <div style={{ position: "absolute", left: CX, top: py, width: 0, height: 0 }}><Img src={spr("sp_e_potato")} style={{ position: "absolute", left: -85, top: -70, width: 170, transform: `rotate(${10 * Math.sin(tt * 1.3)}deg)`, filter: "drop-shadow(0 6px 6px rgba(0,0,0,.5))" }} /></div>
    <Big tt={tt} at={2.2} x={1540} y={300} txt="HEAVIER" size={90} col={AMB} />
  </>;
}}</Stage>;

// 16 · LA OTRA MITAD: la tapa redonda de madera, más chica que la boca, baja girando y se asienta adentro, sobre la salmuera
export const ELid: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const p = eio(tt, 10.2, 11.8), wob = tt > 11.8 ? 3 * Math.exp(-3 * (tt - 11.8)) * Math.sin((tt - 11.8) * 14) : 0, rock = eio(tt, 7.6, 8.3);
  return <>
    <BgB id="n_tapa_redonda" tt={tt} dim={0.72} />
    <Mv p="perspective(1500px) rotateX(46deg)" ox={960} oy={560}>
      <Spr id="sp_e_barrel_open" tt={tt} at={0.2} x={960} y={560} w={760} from="none" />
      {/* la tapa entra justo adentro de la boca */}
      {p > 0 && <div style={{ position: "absolute", left: 960, top: 560 - 700 * (1 - p), width: 0, height: 0 }}><Img src={spr("sp_e_lid_wood")} style={{ position: "absolute", left: -270, top: -270, width: 540, transform: `rotate(${(1 - p) * 220 + wob}deg)`, filter: `drop-shadow(0 ${30 * (1 - p) + 6}px ${20 * (1 - p) + 6}px rgba(0,0,0,.6))` }} /></div>}
    </Mv>
    {/* anillo que muestra el hueco entre la tapa y la boca */}
    {p >= 1 && <div style={{ position: "absolute", left: 960 - 330, top: 560 - 230, width: 660, height: 460, borderRadius: "50%", border: "4px dashed rgba(255,220,160,.6)", opacity: eio(tt, 11.8, 12.2) }} />}
    {/* la piedra, la otra mitad, aparece a un costado en "the rock" */}
    <Mv y={-500 * (1 - rock)} o={rock}><Spr id="sp_e_rock" tt={tt} at={-5} x={1600} y={760} w={300} from="none" /></Mv>
    <Big tt={tt} at={6.4} x={420} y={180} txt="½" size={200} col={AMB} />
  </>;
}}</Stage>;

// 17 · SIN LA PIEDRA: en el corte, los pedazos de arriba suben flotando y una esquina asoma al aire, donde se pone gris
export const EFloat: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const up = eio(tt, 2.4, 4.2), corner = eio(tt, 4.3, 5.9), rot = eio(tt, 6.6, 9.4), LEV = 0.78, IH = 588, SURF = IH * (1 - LEV);
  return <>
    <BgB id="n_carne_flota" tt={tt} dim={0.72} />
    <Planks y={900} dark />
    <Cut x={960} y={560} w={560} h={640} lev={LEV}>
      {[0, 1, 2, 3, 4, 5].map((i) => { const row = Math.floor(i / 3), x = 90 + (i % 3) * 165, base = IH - 60 - row * 80, top = row === 1, y = top ? base - (base - (SURF + 20)) * up - 40 * corner * (i === 4 ? 1 : 0) : base; return <Chunk key={i} x={x} y={y} w={150} h={66} r={top ? -8 * corner * (i === 4 ? 1 : 0.3) : 0} dark={i === 4 ? rot : 0} />; })}
      {/* la esquina en el aire se pone oscura y aparece la nata */}
      <div style={{ position: "absolute", left: 200, top: SURF - 50, width: 160, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(140,150,90,.6), transparent 70%)", opacity: rot }} />
    </Cut>
    <Glint tt={tt} at={5.5} x={1000} y={330} r={90} />
    <Big tt={tt} at={5.8} x={960} y={130} txt="AIR" size={140} col="#ff8a5a" />
  </>;
}}</Stage>;

// 18 · LA SALMUERA ES UNA FRAZADA: una frazada a cuadros tapa los pedazos; uno deja el pie afuera y se le congela
export const EBlanket: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 80% 70% at 50% 45%, #263240, #080b10 78%)">{(tt) => {
  const cover = phys(tt, 6.6, 6, 0.55), foot = eio(tt, 8.4, 9.2), frost = eio(tt, 9.2, 10.4);
  return <>
    <BgB id="n_manta_lana" tt={tt} dim={0.66} />
    <Planks y={760} dark />
    {[0, 1, 2, 3].map((i) => <Chunk key={i} x={600 + i * 240} y={760} w={210} h={100} r={(rnd(i) - 0.5) * 8} />)}
    {/* la frazada de lana roja que cae y se acomoda sobre los pedazos */}
    <div style={{ position: "absolute", left: 440 - 30 * (1 - cover), top: 560 - 700 * (1 - cover), width: 920, height: 300, transformOrigin: "50% 100%", transform: `perspective(900px) rotateX(${30 * (1 - cover)}deg)`, borderRadius: "40px 40px 20px 20px", background: "repeating-linear-gradient(90deg, rgba(0,0,0,.2) 0 10px, transparent 10px 90px), repeating-linear-gradient(0deg, rgba(0,0,0,.2) 0 10px, transparent 10px 90px), linear-gradient(180deg,#b8321e,#7a1a10)", boxShadow: "0 30px 40px rgba(0,0,0,.5), inset 0 20px 30px rgba(255,255,255,.12)", clipPath: foot > 0 ? `polygon(0 0,100% 0,100% 100%,${100 - 18 * foot}% 100%,${100 - 18 * foot}% ${100 - 40 * foot}%,${100 - 26 * foot}% ${100 - 40 * foot}%,${100 - 26 * foot}% 100%,0 100%)` : "none" }} />
    {/* escarcha sobre la punta que quedó afuera */}
    <div style={{ position: "absolute", left: 1210, top: 690, width: 140, height: 110, borderRadius: "40%", background: "radial-gradient(circle, rgba(230,244,255,.85), rgba(200,226,250,.4) 60%, transparent)", opacity: frost, filter: "blur(2px)" }} />
    {frost > 0 && Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1240 + rnd(i) * 90, top: 700 + rnd(i, 2) * 80, width: 3, height: 30 * frost, background: "rgba(240,250,255,.9)", transform: `rotate(${i * 45}deg)` }} />)}
    <Snow tt={tt} n={36} />
    <Num3 tt={tt} at={10.2} out={20} x={1500} y={240} n="-40°" col="#cfe6ff" size={160} />
  </>;
}}</Stage>;

// 19 · EL CALOR ES EL ENEMIGO: el aire caliente de la cocina ondula hacia el barril, que transpira; el barril se va al galpón
export const EWarm: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 30% 60%, #4a2610, #0a0604 78%)">{(tt) => {
  const sweat = eio(tt, 6.0, 7.8), go = eio(tt, 8.4, 9.8), cold = eio(tt, 9.0, 10.4);
  return <>
    <BgB id="n_campamento_arriba" tt={tt} dim={0.78} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255,120,40,.22), transparent 60%, rgba(120,170,230,.25))", opacity: 0.4 + 0.6 * cold }} />
    <Planks y={860} />
    <FireP tt={tt} x={360} y={860} w={520} k={0.9} n={22} />
    {/* ondas de calor que viajan hacia el barril */}
    {Array.from({ length: 5 }, (_, i) => { const ph = ((tt * 0.45) + i * 0.2) % 1; return <div key={i} style={{ position: "absolute", left: 480 + ph * 520, top: 380, width: 40, height: 380, borderRadius: "50%", borderRight: "6px solid rgba(255,170,90,.35)", filter: "blur(3px)", opacity: Math.sin(ph * Math.PI) * (1 - go) }} />; })}
    <Mv x={820 * go} y={-20 * Math.sin(go * Math.PI)}><Spr id="sp_e_barrel" tt={tt} at={0.3} x={1080} y={620} w={460} /></Mv>
    {sweat > 0 && go < 1 && Array.from({ length: 9 }, (_, i) => { const ph = ((tt * 0.6) + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: 900 + rnd(i, 2) * 360 + 820 * go, top: 420 + ph * 380, width: 10, height: 16, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(220,235,245,.85)", opacity: sweat * (1 - ph) }} />; })}
    <Big tt={tt} at={6.2} x={760} y={150} txt="WARM = ENEMY" size={96} col="#ff8a5a" />
  </>;
}}</Stage>;

// 20 · LA SALMUERA NO SE CONGELA: en el galpón el agua del balde se vuelve hielo; al lado la salmuera del barril sigue líquida
export const EFreeze: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 80% 70% at 50% 40%, #2a3a4a, #070a0e 78%)">{(tt) => {
  const ice = eio(tt, 3.6, 6.6), slosh = Math.sin(tt * 2.4) * 6;
  return <>
    <BgB id="n_frio_parejo" tt={tt} dim={0.72} />
    <Planks y={900} dark />
    {/* el balde de agua sola: cristales que crecen desde los bordes */}
    <div style={{ position: "absolute", left: 360, top: 480, width: 460, height: 420, borderRadius: "6% 6% 14% 14%", background: "repeating-linear-gradient(90deg,#5a3a1e 0 4px,#8a5e34 4px 70px)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: 30, bottom: 20, borderRadius: "0 0 40px 40px", background: `linear-gradient(180deg, rgba(${160 + 80 * ice},${200 + 45 * ice},${220 + 30 * ice},${0.5 + 0.4 * ice}), rgba(140,170,190,.6))`, overflow: "hidden" }}>
        <svg width={420} height={370} style={{ position: "absolute", left: 0, top: 0 }}>{Array.from({ length: 16 }, (_, i) => { const L = 200 * cl(ice * 1.4 - rnd(i) * 0.4), x0 = i % 2 ? 0 : 420, y0 = 20 + rnd(i, 2) * 330, a = (i % 2 ? 0 : Math.PI) + (rnd(i, 3) - 0.5) * 0.8; return L > 2 && <line key={i} x1={x0} y1={y0} x2={x0 + Math.cos(a) * L} y2={y0 + Math.sin(a) * L} stroke="rgba(240,250,255,.95)" strokeWidth={3} />; })}</svg>
      </div>
    </div>
    <Cut x={1340} y={620} w={460} h={560} lev={0.82 + 0.004 * slosh}>{[0, 1, 2].map((i) => <Chunk key={i} x={80 + i * 130} y={420} w={120} h={60} r={slosh * 0.4} />)}</Cut>
    <Big tt={tt} at={6.8} x={590} y={360} txt="ICE" size={100} col="#cfe6ff" />
    <Big tt={tt} at={5.4} x={1340} y={250} txt="STILL LIQUID" size={80} col={AMB} />
  </>;
}}</Stage>;

// 21 · CADA MAÑANA: el farol entra, ilumina el termómetro de mínima y máxima, la libreta anota y los marcadores vuelven a su lugar
export const EThermo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #141820, #030405 80%)">{(tt) => {
  const lan = phys(tt, 1.0, 6, 0.55), lit = eio(tt, 1.6, 2.6), wr = eio(tt, 3.9, 5.4), reset = eio(tt, 5.9, 6.8);
  return <>
    <BgB id="n_termometro_pared" tt={tt} dim={0.9 - 0.25 * lit} />
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${560 + 300 * lan}px 420px, rgba(255,190,100,${0.35 * lit}), transparent 45%)`, mixBlendMode: "screen" }} />
    <Spr id="sp_e_minmax" tt={tt} at={0.2} x={960} y={500} w={360} style={{ filter: `brightness(${0.45 + 0.7 * lit}) drop-shadow(0 20px 26px rgba(0,0,0,.6))` }} />
    {/* los dos marcadores que vuelven sobre la columna */}
    {[880, 1040].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 6, top: 340 + (i ? 120 : 60) * (1 - reset) + 210 * reset, width: 12, height: 26, borderRadius: 3, background: "#2a5ad0", boxShadow: "0 0 8px rgba(80,140,255,.7)", opacity: lit }} />)}
    <Mv x={-700 * (1 - lan)} y={6 * Math.sin(tt * 1.6)}><Spr id="sp_e_lantern" tt={tt} at={-5} x={560} y={420} w={240} from="none" shadow={0} /></Mv>
    <Spr id="sp_e_notebook" tt={tt} at={3.4} x={1480} y={800} w={440} from="right" />
    <div style={{ position: "absolute", left: 1330, top: 830, width: 300 * wr, height: 6, background: "#2a1a10", borderRadius: 3, transform: "rotate(-3deg)" }} />
    <Big tt={tt} at={9.8} x={960} y={140} txt="BELOW 40°" size={96} col={AMB} />
  </>;
}}</Stage>;

// 22 · NIEVE CONTRA LA PARED Y LONA EN MARZO: la pala tira nieve contra el galpón; el sol de marzo cruza; los barriles van al rincón
export const ESnow: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg, #8fa7bf, #2a3644 70%)">{(tt) => {
  const sun = eio(tt, 0.6, 3.0), can = phys(tt, 7.2, 6, 0.55), shov = Math.max(0, Math.sin(tt * 3.2));
  return <>
    <BgB id="n_sol_marzo" tt={tt} dim={0.55} />
    {/* el sol de marzo cruza alto, sin tocar la pared norte */}
    <div style={{ position: "absolute", left: 200 + 1400 * sun, top: 180 - 120 * Math.sin(sun * Math.PI), width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, #fffbe0, #ffd060 50%, rgba(255,200,80,0) 72%)", boxShadow: "0 0 120px 40px rgba(255,220,120,.4)" }} />
    <div style={{ position: "absolute", left: -100, top: 800, width: 2120, height: 400, background: "linear-gradient(180deg,#f0f4f8,#c9d4de)" }} />
    <Spr id="sp_e_shed" tt={tt} at={0.2} x={760} y={600} w={760} />
    {/* la pila de nieve que crece con cada palada */}
    <div style={{ position: "absolute", left: 380, top: 860 - 160 * cl(tt / 6), width: 760, height: 220, borderRadius: "50% 50% 0 0", background: "linear-gradient(180deg,#ffffff,#d6e0ea)", boxShadow: "inset 0 10px 20px rgba(120,140,170,.4)" }} />
    <Mv x={0} y={-40 * shov} r={-30 + 40 * shov} ox={1400} oy={860} o={1 - eio(tt, 6.4, 7.0)}><Spr id="sp_e_shovel" tt={tt} at={0.4} x={1400} y={700} w={260} from="right" shadow={0} /></Mv>
    {tt < 6.6 && [0, 1, 2].map((i) => { const ph = ((tt * 3.2 / Math.PI / 2) + i * 0.33) % 1; return <div key={i} style={{ position: "absolute", left: 1330 - ph * 360, top: 640 - 160 * Math.sin(ph * Math.PI), width: 60, height: 40, borderRadius: "50%", background: "#fff", opacity: 0.9 }} />; })}
    {/* la lona que cae sobre los barriles del rincón */}
    <Spr id="sp_e_barrel" tt={tt} at={3.4} x={1520} y={680} w={260} from="right" />
    <div style={{ position: "absolute", left: 1350, top: 540 - 500 * (1 - can), width: 340, height: 330, borderRadius: "40% 40% 10% 10%", background: "repeating-linear-gradient(80deg, rgba(0,0,0,.12) 0 6px, transparent 6px 40px), linear-gradient(180deg,#a89a74,#6a5e44)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", opacity: can }} />
  </>;
}}</Stage>;

// 23 · SE OLVIDÓ LA PIEDRA: la piedra se levanta, queda en el piso; la tapa vuelve; la piedra se queda sola en el suelo
export const EForgot: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const off = eio(tt, -0.4, 0.4), lid = eio(tt, 3.3, 4.3), focus = eio(tt, 5.0, 6.2), dust = eio(tt, 6.4, 9.4);
  return <>
    <BgB id="n_piedra_suelo" tt={tt} dim={0.74} />
    <Planks y={760} dark />
    <Mv f={`brightness(${1 - 0.45 * focus})`}>
      <Spr id="sp_e_barrel" tt={tt} at={-5} x={760} y={560} w={520} from="none" />
      <Mv y={-420 * (1 - lid)} r={-20 * (1 - lid)}><Spr id="sp_e_lid_wood" tt={tt} at={-5} x={760} y={330} w={380} from="none" shadow={0} style={{ transform: "scaleY(.32)" }} /></Mv>
      {[1.1, 1.8].map((a, i) => { const p = eio(tt, a, a + 0.6); return p > 0 && <Chunk key={i} x={760 + 500 * p + i * 60} y={300 - 200 * Math.sin(p * Math.PI) + 520 * p * p} w={150} h={70} r={p * 90} o={1 - eio(tt, a + 0.8, a + 1.2)} />; })}
    </Mv>
    {/* la piedra en el piso, cada vez más sola y con polvo */}
    <div style={{ position: "absolute", left: 1460 - 160, top: 880, width: 320, height: 50, borderRadius: "50%", background: "rgba(0,0,0,.5)", filter: "blur(10px)" }} />
    <Mv y={0} s={1 + 0.12 * focus} ox={1460} oy={860}><Spr id="sp_e_rock" tt={tt} at={-5} x={1460} y={790} w={340 - 0 * off} from="none" shadow={0} style={{ filter: `brightness(${1 + 0.15 * focus}) sepia(${0.4 * dust})` }} /></Mv>
    {dust > 0 && Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1320 + rnd(i) * 280, top: 640 + ((tt * 20 + rnd(i, 2) * 200) % 200), width: 4, height: 4, borderRadius: "50%", background: "rgba(255,240,210,.6)", opacity: dust }} />)}
    <Big tt={tt} at={5.2} x={1460} y={560} txt="FORGOT" size={110} col="#ff8a5a" />
  </>;
}}</Stage>;

// 24 · SALMUERA QUE HACE HILOS: el tenedor largo sube y la salmuera turbia cuelga en hilos espesos que se estiran y gotean
export const ERopey: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const lift = eio(tt, 1.8, 3.4), str = eio(tt, 3.2, 5.6), FY = 520 - 300 * lift;
  return <>
    <BgB id="n_tenedor_hilos" tt={tt} dim={0.8} />
    {/* superficie turbia, amarillenta */}
    <div style={{ position: "absolute", left: 360, top: 760, width: 1200, height: 260, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%, #b8b080, #6a6440 60%, #2a2818)", boxShadow: "0 0 0 24px #4a2e16, 0 30px 50px rgba(0,0,0,.7)" }} />
    <Mv y={-300 * lift} r={-62} ox={1100} oy={520}><Spr id="sp_e_fork" tt={tt} at={0.4} x={1100} y={520} w={760} from="up" shadow={0} /></Mv>
    {/* los hilos de salmuera entre las púas y la superficie */}
    <svg width={W} height={HH} style={{ position: "absolute", left: 0, top: 0 }}>{Array.from({ length: 7 }, (_, i) => { const x = 900 + i * 22 + 6 * Math.sin(tt * 2 + i), y0 = FY + 260, y1 = 800, mid = (y0 + y1) / 2, sag = 20 * Math.sin(tt * 1.6 + i); const br = str > 0 && tt > 5.4 + i * 0.6 ? 0 : 1; return str > 0 && <path key={i} d={`M${x} ${y0} Q ${x + sag} ${mid} ${x + 4} ${y0 + (y1 - y0) * (br ? 1 : 0.4)}`} stroke={`rgba(200,190,140,${0.75 * str})`} strokeWidth={5 + 4 * Math.sin(i)} fill="none" strokeLinecap="round" />; })}</svg>
    {str > 0 && Array.from({ length: 5 }, (_, i) => { const ph = ((tt - 5) * 0.8 + i * 0.2) % 1; return tt > 5 && <div key={i} style={{ position: "absolute", left: 905 + i * 30, top: FY + 260 + ph * 260, width: 14, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(200,190,140,.85)", opacity: 1 - ph }} />; })}
    <Big tt={tt} at={5.2} x={460} y={200} txt="LIKE SYRUP" size={90} col="#d8c870" />
  </>;
}}</Stage>;

// 25 · SALVAR LO BUENO: los pedazos salen del barril, el chorro frío los lava, la pava escalda el barril y entra salmuera nueva
export const EScrub: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const wash = eio(tt, 5.9, 7.4), scald = eio(tt, 8.0, 9.6), brine = eio(tt, 10.3, 11.6);
  return <>
    <BgB id="n_fregar_carne" tt={tt} dim={0.72} />
    <Planks y={860} />
    <Spr id="sp_e_barrel" tt={tt} at={0.2} x={480} y={620} w={420} />
    {[3.0, 3.4, 3.8].map((a, i) => { const p = eio(tt, a, a + 0.7), x = 480 + (1100 + i * 170 - 480) * p; return p > 0 && <React.Fragment key={i}><Chunk x={x} y={400 - 240 * Math.sin(p * Math.PI) + (720 - 400) * p} w={160} h={78} r={p * 360} f={`brightness(${0.85 + 0.25 * wash})`} />{wash > 0 && wash < 1 && <Burst tt={tt} at={6.0 + i * 0.3} x={1100 + i * 170} y={700} n={10} col="rgba(210,235,250,.9)" sp={260} sz={6} life={0.5} />}</React.Fragment>; })}
    {/* chorro de agua fría desde arriba */}
    <Pour tt={tt} at={5.9} out={7.4} x={1270} y1={0} y2={680} col="rgba(200,230,245,.85)" w={30} />
    <Mv x={-640 * (1 - eio(tt, 7.6, 8.2))} r={-45 * scald} ox={640} oy={300} o={eio(tt, 7.6, 8.0) * (1 - eio(tt, 9.8, 10.2))}><Spr id="sp_e_kettle" tt={tt} at={-5} x={640} y={300} w={300} from="none" shadow={0} /></Mv>
    <Steam tt={tt} x={480} y={440} w={260} k={1.3 * scald * (1 - brine)} />
    <Spr id="sp_e_bucket" tt={tt} at={10.0} x={760} y={760} w={260} from="right" />
    <Glint tt={tt} at={11.4} x={480} y={460} r={140} />
  </>;
}}</Stage>;

// 26 · ÉSTA ES TU PIEDRA: la piedra se levanta del piso, viaja en arco y baja a dos manos jóvenes que la reciben con peso
export const EYourRock: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const pick = eio(tt, 8.4, 9.0), hand = eio(tt, 9.4, 10.2), cam = eio(tt, 9.4, 12.9), weight = tt > 10.2 ? 20 * Math.exp(-4 * (tt - 10.2)) * Math.sin((tt - 10.2) * 10) : 0;
  const rx = 600 + (1200 - 600) * hand, ry = 820 - 220 * pick - 160 * Math.sin(hand * Math.PI) + (560 - 600) * hand;
  return <>
    <BgB id="n_entrega_piedra" tt={tt} dim={0.72} />
    <Mv s={1 + 0.18 * cam} ox={1200} oy={600}>
      <Planks y={860} dark />
      {hand < 1 && <div style={{ position: "absolute", left: rx, top: ry, width: 0, height: 0 }}><Img src={spr("sp_e_rock")} style={{ position: "absolute", left: -150, top: -100, width: 300, transform: `rotate(${-20 * hand}deg)`, filter: "drop-shadow(0 20px 18px rgba(0,0,0,.55))" }} /></div>}
      <Mv y={500 * (1 - eio(tt, 8.8, 9.6)) + weight}><Spr id="sp_e_hands_rock" tt={tt} at={-5} x={1200} y={640} w={560} from="none" shadow={0} op={hand >= 1 ? 1 : eio(tt, 8.8, 9.4)} /></Mv>
    </Mv>
    <Big tt={tt} at={12.2} x={960} y={140} txt="YOUR ROCK" size={120} col={AMB} />
  </>;
}}</Stage>;

// 27 · LOS ERRORES QUE CONTABA NELS: el cuchillo talla una marca por error en la duela; en el 2 asoma un pedazo y la piedra cae
export const EFive: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const N = [0.0, 3.7], rock = phys(tt, 7.2, 7, 0.4), lid = eio(tt, 9.6, 10.4);
  return <>
    <BgB id="n_dedos_nels" tt={tt} dim={0.74} />
    {/* la duela gigante de primer plano: madera de roble con vetas */}
    <div style={{ position: "absolute", left: 260, top: 160, width: 1400, height: 760, borderRadius: 30, background: "repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 3px, transparent 3px 34px), linear-gradient(180deg,#9a6c40,#6a4628)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }} />
    {[0, 1, 2, 3, 4].map((i) => { const cut = i < 2 ? eio(tt, N[i] + 0.2, N[i] + 0.7) : 0; return <div key={i} style={{ position: "absolute", left: 420 + i * 160, top: 260, width: 26, height: 300 * cut, borderRadius: 12, background: "linear-gradient(90deg,#3a220e,#1a0e04,#4a2e16)", boxShadow: "inset 0 0 6px rgba(0,0,0,.8)", opacity: i < 2 ? 1 : 0 }} />; })}
    {[0, 1, 2, 3, 4].map((i) => <div key={`g${i}`} style={{ position: "absolute", left: 420 + i * 160 - 4, top: 260, width: 34, height: 300, borderRadius: 14, border: "3px dashed rgba(255,230,190,.25)", opacity: i >= 2 ? 1 : 0 }} />)}
    {N.map((a, i) => <Burst key={i} tt={tt} at={a + 0.3} x={433 + i * 160} y={300} n={12} col="#e0b880" sp={300} sz={6} life={0.6} />)}
    {/* abajo, el segundo error: el pedazo asoma y la piedra baja (o la tapa se ladea) */}
    <Chunk x={1340} y={780 - 50 * eio(tt, 4.8, 5.8) + 50 * rock} w={220} h={100} r={-10 + 10 * rock} />
    <div style={{ position: "absolute", left: 1180, top: 760, width: 340, height: 120, background: "linear-gradient(180deg, rgba(190,215,225,.6), rgba(130,160,175,.7))", borderRadius: "0 0 30px 30px" }} />
    <Mv y={-600 * (1 - rock)} r={14 * lid}><Spr id="sp_e_rock" tt={tt} at={-5} x={1340} y={690} w={220} from="none" /></Mv>
    <Num3 tt={tt} at={3.7} out={20} x={1340} y={330} n="2" col="#ffd27a" size={220} />
  </>;
}}</Stage>;

// 28 · NUNCA LA MANO: la mano se acerca a la salmuera y se frena; el tenedor baja del clavo de la puerta, pincha y vuelve al clavo
export const EFork: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const hand = eio(tt, 1.0, 2.2) * (1 - eio(tt, 3.0, 3.8)), off = eio(tt, 7.6, 8.6), dip = eio(tt, 8.6, 9.4) * (1 - eio(tt, 9.8, 10.6)), back = eio(tt, 10.6, 11.4);
  const fx = 1500 - 520 * off * (1 - back), fy = 360 + 260 * dip;
  return <>
    <BgB id="n_tenedor_clavo" tt={tt} dim={0.72} />
    {/* marco de la puerta con el clavo */}
    <div style={{ position: "absolute", left: 1380, top: 0, width: 360, height: 1080, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 4px, transparent 4px 120px), linear-gradient(90deg,#5a3a1e,#7a5030,#4a2e16)", boxShadow: "-20px 0 40px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 1540, top: 200, width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(circle,#aaa,#333)" }} />
    <Spr id="sp_e_barrel_open" tt={tt} at={0.2} x={760} y={760} w={620} from="none" style={{ transform: "scaleY(.5)" }} />
    {hand > 0.01 && <div style={{ position: "absolute", left: 760 - 60, top: 200 + 300 * hand, width: 120, height: 220, borderRadius: "40% 40% 30% 30%", background: "linear-gradient(180deg,#e0a084,#b87058)", boxShadow: "0 16px 20px rgba(0,0,0,.4)" }} />}
    {hand > 0.5 && tt < 3.8 && <div style={{ position: "absolute", left: 600, top: 520, width: 320, height: 18, background: "#d8321a", borderRadius: 9, transform: "rotate(-12deg)", opacity: eio(tt, 2.2, 2.6) * (1 - eio(tt, 3.0, 3.8)) }} />}
    <Mv x={fx - 1500} y={fy - 360} r={-80 + 70 * off * (1 - back)} ox={fx} oy={fy}><Spr id="sp_e_fork" tt={tt} at={4.6} x={1550} y={560} w={520} from="right" shadow={0} /></Mv>
    {dip > 0.9 && <Burst tt={tt} at={9.3} x={760} y={760} n={12} col="rgba(210,235,250,.9)" sp={260} sz={6} life={0.5} />}
    <Big tt={tt} at={2.4} x={420} y={150} txt="NEVER" size={120} col="#ff8a5a" />
  </>;
}}</Stage>;

// 29 · MES POR MES: una rueda de meses gira como la de un molino; NOV llega arriba, la papa prueba, DIC trae nieve encima
export const EMonths: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const M = ["NOV", "DEC", "JAN", "FEB", "MAR", "APR"], idx = tt < 7.9 ? 0 : 1 + eio(tt, 7.9, 8.8) - 1, ang = -60 * (tt < 7.9 ? 0 : eio(tt, 7.9, 8.8)), snow = eio(tt, 8.6, 10.2);
  return <>
    <BgB id="n_tablas_barriles" tt={tt} dim={0.72} />
    {/* la rueda de madera de meses */}
    <div style={{ position: "absolute", left: 960 - 460, top: 260, width: 920, height: 920, borderRadius: "50%", transform: `rotate(${ang}deg)`, background: "radial-gradient(circle, #5a3a1e 0 12%, #8a5e34 12.5% 70%, #5a3a1e 71% 76%, transparent 77%)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }}>
      {M.map((m, i) => <div key={m} style={{ position: "absolute", left: 460 - 110, top: 60, width: 220, height: 140, transformOrigin: "110px 400px", transform: `rotate(${i * 60}deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 70, color: "#f3e2c0", textShadow: "0 3px 0 #2a1a0e" }}>{m}</div>)}
    </div>
    <div style={{ position: "absolute", left: 940, top: 230, width: 0, height: 0, borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderTop: "34px solid #ffb040" }} />
    {/* la papa de prueba en NOV */}
    <Spr id="sp_e_bucket" tt={tt} at={3.2} x={420} y={760} w={280} from="left" />
    {tt > 4.6 && tt < 8 && <div style={{ position: "absolute", left: 420, top: 620 + 40 * Math.max(0, 1 - (tt - 4.6) * 2) + 4 * Math.sin(tt * 3), width: 0, height: 0 }}><Img src={spr("sp_e_potato")} style={{ position: "absolute", left: -50, top: -40, width: 100 }} /></div>}
    {/* nieve que se apila sobre el borde de la rueda en DEC */}
    <div style={{ position: "absolute", left: 960 - 320, top: 270 - 10 * snow, width: 640, height: 70 * snow, borderRadius: "50% 50% 20% 20%", background: "linear-gradient(180deg,#ffffff,#dfe8f0)", opacity: snow }} />
    {snow > 0 && <Snow tt={tt} n={30} seed={5} />}
  </>;
}}</Stage>;

// 30 · DOS MEDIOS BARRILES, UNO LLENO: los pedazos de un barril a medias vuelan al otro; el lleno queda apretado y la piedra baja
export const EHalf: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const flt = eio(tt, 6.4, 7.6), mv = eio(tt, 9.2, 10.8), IH = 504;
  return <>
    <BgB id="n_medio_barril" tt={tt} dim={0.72} />
    <Planks y={900} dark />
    <Cut x={560} y={600} w={440} h={560} lev={0.48 - 0.4 * mv}>
      {[0, 1, 2].map((i) => <Chunk key={i} x={70 + i * 140} y={IH - 50 - 60 * flt * Math.abs(Math.sin(tt * 1.8 + i)) * (1 - mv)} w={130} h={62} o={1 - eio(tt, 9.2 + i * 0.3, 9.5 + i * 0.3)} />)}
    </Cut>
    <Cut x={1360} y={600} w={440} h={560} lev={0.48 + 0.36 * mv}>
      {[0, 1, 2].map((i) => <Chunk key={i} x={70 + i * 140} y={IH - 50} w={130} h={62} />)}
      {[0, 1, 2].map((i) => <Chunk key={`n${i}`} x={70 + i * 140} y={IH - 120} w={130} h={62} o={eio(tt, 9.5 + i * 0.3, 9.7 + i * 0.3)} />)}
    </Cut>
    {[0, 1, 2].map((i) => { const p = eio(tt, 9.2 + i * 0.3, 9.6 + i * 0.3); return p > 0 && p < 1 && <Chunk key={i} x={560 + 800 * p} y={500 - 260 * Math.sin(p * Math.PI)} w={130} h={62} r={p * 360} />; })}
    <Big tt={tt} at={1.6} x={560} y={180} txt="½" size={160} col="#ff8a5a" />
  </>;
}}</Stage>;

// 31 · MARZO A ABRIL: el sol de marzo pega fuerte y la lona tapa los barriles; en abril el hielo del río se parte y se va
export const EBreakup: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg, #a8bccd, #3a4a58 70%)">{(tt) => {
  const sun = eio(tt, 0, 1.0), can = phys(tt, 2.0, 6, 0.5), river = eio(tt, 8.6, 9.2), crack = eio(tt, 9.4, 10.2), drift = eio(tt, 10.3, 12.4);
  return <>
    <BgB id="n_deshielo_rio" tt={tt} dim={0.6} />
    <div style={{ position: "absolute", left: 1500, top: 120, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, #fffbe0, #ffd060 45%, rgba(255,200,80,0) 72%)", boxShadow: `0 0 ${160 * sun}px ${60 * sun}px rgba(255,220,120,.45)`, opacity: 1 - river }} />
    <Mv o={1 - river}>
      <Planks y={820} dark />
      {[0, 1, 2].map((i) => <Spr key={i} id="sp_e_barrel" tt={tt} at={-5} x={620 + i * 300} y={660} w={280} from="none" />)}
      <div style={{ position: "absolute", left: 440, top: 420 - 600 * (1 - can), width: 1000, height: 420, borderRadius: "40% 40% 8% 8%", background: "repeating-linear-gradient(80deg, rgba(0,0,0,.12) 0 6px, transparent 6px 40px), linear-gradient(180deg,#a89a74,#5a4e36)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
    </Mv>
    {/* el río en abril: la placa de hielo se raja y los témpanos se van río abajo */}
    <Mv o={river}>
      <div style={{ position: "absolute", left: 0, top: 560, width: W, height: 520, background: "linear-gradient(180deg,#2a3c4c,#122028)" }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 120 + i * 440 + drift * (500 + 200 * i), top: 600 + (i % 2) * 120 + 30 * Math.sin(tt + i), width: 0, height: 0, transform: `rotate(${(i - 1.5) * 6 * crack + drift * 10 * (i % 2 ? 1 : -1)}deg)` }}><Img src={spr("sp_e_ice")} style={{ position: "absolute", left: -230, top: -110, width: 460, filter: "drop-shadow(0 14px 14px rgba(0,0,0,.5))" }} /></div>)}
      <svg width={W} height={HH} style={{ position: "absolute", left: 0, top: 0 }}>{[560, 1000, 1440].map((x, i) => <path key={i} d={`M${x} 600 l 30 60 l -40 70 l 30 80 l -20 90`} stroke="#0a1418" strokeWidth={8} fill="none" strokeDasharray={`${400 * crack} 999`} opacity={1 - drift} />)}</svg>
    </Mv>
    <Big tt={tt} at={9.4} x={960} y={140} txt="BREAK-UP" size={120} col={AMB} />
  </>;
}}</Stage>;

// 32 · TRES AGUAS: los pedazos se remojan; el agua turbia se vuelca y entra agua limpia, otra vez, cada vez más clara
export const ESoak: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const W1 = [8.3, 12.2], dump = (a: number) => eio(tt, a, a + 0.6) * (1 - eio(tt, a + 0.6, a + 1.2)), n = W1.filter((a) => tt > a + 0.6).length;
  const cloud = [0.75, 0.42, 0.12][n], night = eio(tt, 5.7, 6.8) * (1 - eio(tt, 7.0, 7.8));
  return <>
    <BgB id="n_remojo_olla" tt={tt} dim={0.74} />
    <WoodTop />
    <div style={{ position: "absolute", inset: 0, background: "rgba(10,20,50,.6)", opacity: night }} />
    <Mv r={-70 * Math.max(...W1.map(dump))} ox={1200} oy={560}>
      <Spr id="sp_e_soak_pot" tt={tt} at={0.2} x={960} y={560} w={680} />
      <div style={{ position: "absolute", left: 960 - 280, top: 560 - 280, width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, rgba(225,220,200,${cloud}), rgba(200,195,175,${cloud * 0.8}))`, mixBlendMode: "screen" }} />
    </Mv>
    {W1.map((a, i) => <Pour key={i} tt={tt} at={a + 1.2} out={a + 2.6} x={760} y1={0} y2={520} col="rgba(200,230,245,.85)" w={26} />)}
    {/* una luna por noche de remojo */}
    {night > 0 && <div style={{ position: "absolute", left: 1560, top: 140, width: 120, height: 120, borderRadius: "50%", boxShadow: "inset -30px -10px 0 0 #f4f0dc", opacity: night }} />}
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1500 + i * 90, top: 820, width: 60, height: 80, borderRadius: "0 0 20px 20px", border: "5px solid rgba(220,235,245,.8)", borderTop: "none", background: i < n + 1 ? `rgba(200,225,240,${0.6 - 0.18 * i})` : "transparent", opacity: eio(tt, 4.2 + i * 4, 4.6 + i * 4) }} />)}
  </>;
}}</Stage>;

// 33 · VA A TODO: la sartén del centro suelta su grasa y los platos llegan en órbita: papas, sopa de arvejas, salsa sobre bizcochos
export const EEverything: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const P = [["sp_e_potatoes", 0.3], ["sp_e_peasoup", 6.7], ["sp_e_gravy", 8.7]] as const, orb = tt * 0.35;
  return <>
    <BgB id="n_olla_porotos" tt={tt} dim={0.74} />
    <Planks y={780} />
    <Spr id="sp_e_pan_pork" tt={tt} at={0.1} x={960} y={600} w={520} />
    <Steam tt={tt} x={960} y={440} w={200} k={0.8} />
    {P.map(([id, a], i) => { const ent = phys(tt, a, 6, 0.55); if (ent <= 0.01) return null; const an = orb + (i * 2 * Math.PI) / 3 + Math.PI / 2, x = 960 + Math.cos(an) * 560, y = 560 + Math.sin(an) * 230, s = 0.75 + 0.3 * (Math.sin(an) + 1) / 2; return <div key={id} style={{ position: "absolute", left: x + (1 - ent) * 900, top: y, width: 0, height: 0, zIndex: Math.round(10 + 10 * Math.sin(an)) }}><Img src={spr(id)} style={{ position: "absolute", left: -150 * s, top: -110 * s, width: 300 * s, filter: `brightness(${0.75 + 0.3 * s}) drop-shadow(0 18px 16px rgba(0,0,0,.5))` }} /></div>; })}
    {/* hilo de grasa dorada desde la sartén hacia cada plato que llega */}
    {P.map(([, a], i) => <Burst key={i} tt={tt} at={a + 0.5} x={960} y={600} n={10} col="#ffd27a" sp={300} sz={6} life={0.6} />)}
  </>;
}}</Stage>;

// 34 · TU GARAJE NO ES ESO: el galpón de troncos con nieve se encoge y en su lugar cae un garaje tibio con el auto; el termómetro sube
export const EGarage: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg, #7d93a8, #26323e 70%)">{(tt) => {
  const swap = eio(tt, 9.2, 10.2), temp = eio(tt, 9.6, 10.6);
  return <>
    <BgB id="n_garaje" tt={tt} dim={0.62} />
    <div style={{ position: "absolute", left: -100, top: 820, width: 2120, height: 380, background: "linear-gradient(180deg,#eef2f6,#c4ced8)", opacity: 1 - swap }} />
    <Mv s={1 - swap} o={1 - swap} ox={960} oy={860}><Spr id="sp_e_shed" tt={tt} at={0.3} x={960} y={600} w={760} /></Mv>
    {swap > 0 && <Mv y={-600 * (1 - phys(tt, 9.4, 7, 0.45))}>
      <div style={{ position: "absolute", left: 560, top: 360, width: 800, height: 480, background: "linear-gradient(180deg,#c9c2b4,#a8a092)", boxShadow: "0 30px 50px rgba(0,0,0,.5)", clipPath: "polygon(0 22%, 50% 0, 100% 22%, 100% 100%, 0 100%)" }}>
        <div style={{ position: "absolute", left: 120, top: 200, width: 560, height: 280, background: "repeating-linear-gradient(0deg,#e8e2d6 0 50px,#c8c0b0 50px 54px)" }} />
      </div>
      <div style={{ position: "absolute", left: 480, top: 840, width: 960, height: 120, background: "linear-gradient(180deg,#8a8a8a,#5a5a5a)" }} />
    </Mv>}
    <div style={{ position: "absolute", left: 1600, top: 300, width: 40, height: 400, borderRadius: 20, background: "rgba(245,245,245,.9)", boxShadow: "0 16px 26px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", left: 12, bottom: 14, width: 16, height: 60 + 280 * temp, borderRadius: 8, background: temp > 0.5 ? "#d8321a" : "#3a7ad8" }} /></div>
  </>;
}}</Stage>;

// 35 · LA MISMA PANZA: el chancho dibujado a tiza ilumina la panza; la tira de panceta recibe azúcar y humo, la lonja una lluvia de sal
export const EBacon: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #263028, #070908 78%)">{(tt) => {
  const draw = eio(tt, 0.0, 1.6), belly = eio(tt, 2.0, 3.0), split = eio(tt, 3.6, 4.4), smoke = eio(tt, 5.6, 7.0), salt = eio(tt, 8.8, 11.0);
  const pig = "M300 260 C 300 160, 420 110, 560 120 C 700 110, 800 150, 840 220 L 880 200 L 870 250 C 900 290, 890 350, 850 380 L 830 470 L 790 470 L 780 400 L 420 400 L 410 470 L 370 470 L 360 390 C 310 360, 290 310, 300 260 Z";
  return <>
    <BgB id="n_tocino_vs" tt={tt} dim={0.82} />
    <Mv s={1 - 0.4 * split} x={-0 * split} y={-300 * split} ox={960} oy={300}>
      <svg width={W} height={HH} style={{ position: "absolute", left: 0, top: 0 }}><g transform="translate(380 140) scale(1.2)">
        <path d={pig} stroke="#f1ece0" strokeWidth={6} fill="none" strokeDasharray={`${2600 * draw} 3000`} strokeLinecap="round" />
        <path d="M420 330 L 780 330 L 780 400 L 420 400 Z" fill={`rgba(255,170,120,${0.55 * belly})`} />
      </g></svg>
    </Mv>
    <Spr id="sp_e_bacon" tt={tt} at={3.9} x={600} y={720} w={460} from="left" />
    <Spr id="sp_e_pork_slab" tt={tt} at={8.6} x={1340} y={720} w={420} from="right" />
    {smoke > 0 && [0, 1, 2, 3].map((i) => { const ph = ((tt * 0.5) + i * 0.25) % 1; return <div key={i} style={{ position: "absolute", left: 540 + 40 * Math.sin(ph * 6 + i), top: 640 - ph * 300, width: 140 + 100 * ph, height: 100, borderRadius: "50%", background: "rgba(170,160,150,.5)", filter: "blur(20px)", opacity: smoke * Math.sin(ph * Math.PI) }} />; })}
    {Array.from({ length: 40 }, (_, i) => { const a = 8.8 + rnd(i) * 2, p = eio(tt, a, a + 0.5); return p > 0 && p < 1 && <Xtal key={i} x={1180 + rnd(i, 2) * 320} y={420 + 280 * p} s={12} r={i * 33 + p * 200} />; })}
    <Big tt={tt} at={1.8} x={960} y={110} txt="BELLY" size={90} col={AMB} out={4.2} />
  </>;
}}</Stage>;

// 36 · LO QUE HAGO HOY: el paquetito cae en la mesada, la heladera se abre y la lonja entra a un bol con agua fría, de noche
export const EMySoak: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const door = eio(tt, 6.6, 7.6), night = eio(tt, 7.8, 8.6), bowl = phys(tt, 8.8, 6.5, 0.5);
  return <>
    <BgB id="n_remojo_heladera" tt={tt} dim={0.72} />
    <div style={{ position: "absolute", inset: 0, background: "rgba(10,16,40,.55)", opacity: night }} />
    <Planks y={860} />
    {/* la heladera con la puerta que gira y la luz de adentro */}
    <div style={{ position: "absolute", left: 1120, top: 140, width: 520, height: 760, borderRadius: 30, background: "linear-gradient(90deg,#e8e8e4,#cfcfca)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 30, top: 30, width: 460, height: 700, borderRadius: 20, background: "linear-gradient(180deg,#fdfcf4,#d8e4ea)", boxShadow: "inset 0 0 40px rgba(255,255,230,.8)", opacity: door }}>
        {[200, 400].map((y) => <div key={y} style={{ position: "absolute", left: 10, right: 10, top: y, height: 8, background: "rgba(180,200,210,.8)" }} />)}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 760, borderRadius: 30, transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-100 * door}deg)`, background: "linear-gradient(90deg,#f0f0ec,#d6d6d0)", boxShadow: "inset 0 0 0 4px rgba(0,0,0,.08)" }}><div style={{ position: "absolute", right: 40, top: 300, width: 16, height: 160, borderRadius: 8, background: "#8a8a8a" }} /></div>
    </div>
    <Mv y={0} x={door > 0.5 ? 0 : 0}>
      {/* el paquete de una libra: papel de carnicero con hilo */}
      <div style={{ position: "absolute", left: 460, top: 640 - 600 * (1 - phys(tt, 2.0, 7, 0.45)), width: 300, height: 180, borderRadius: 14, background: "linear-gradient(160deg,#f2e6d0,#d6c2a0)", boxShadow: "0 20px 24px rgba(0,0,0,.45)", transform: "rotate(-4deg)" }}><div style={{ position: "absolute", left: 140, top: 0, width: 8, height: 180, background: "#8a3a2a" }} /><div style={{ position: "absolute", left: 0, top: 86, width: 300, height: 8, background: "#8a3a2a" }} /></div>
    </Mv>
    {bowl > 0.01 && <div style={{ position: "absolute", left: 1380, top: 330 - 500 * (1 - bowl), width: 0, height: 0 }}><div style={{ position: "absolute", left: -150, top: -60, width: 300, height: 120, borderRadius: "0 0 150px 150px / 0 0 100px 100px", background: "linear-gradient(180deg, rgba(200,225,240,.8), rgba(150,180,200,.8))", boxShadow: "0 0 0 6px #e8e8e8, 0 14px 18px rgba(0,0,0,.35)" }} /><Chunk x={0} y={-10} w={160} h={60} /></div>}
    {night > 0 && <div style={{ position: "absolute", left: 220, top: 140, width: 120, height: 120, borderRadius: "50%", boxShadow: "inset -30px -10px 0 0 #f4f0dc", opacity: night }} />}
    <Big tt={tt} at={3.6} x={610} y={420} txt="1 LB" size={100} col={AMB} out={7.6} />
  </>;
}}</Stage>;

// 37 · EL ESTANTE DE INVIERNO: en el estante del rincón frío llegan de a uno: cebollas en red, zanahorias en arena, la manteca, el queso
export const EShelf: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 40%, #2a2218, #060504 78%)">{(tt) => {
  const I = [["sp_e_potato_box", 0.0, 520, 760, 380], ["sp_e_onion_net", 2.6, 900, 380, 260], ["sp_e_carrot_box", 6.0, 1340, 760, 360], ["sp_e_crock", 8.3, 880, 770, 260], ["sp_e_cheese", 10.0, 1420, 420, 280]] as const;
  return <>
    <BgB id="n_cebollas_red" tt={tt} dim={0.8} />
    {/* las dos tablas del estante */}
    {[560, 900].map((y) => <div key={y} style={{ position: "absolute", left: 280, top: y, width: 1360, height: 40, background: "linear-gradient(180deg,#8a6038,#4a2e16)", boxShadow: "0 24px 30px rgba(0,0,0,.6)" }} />)}
    {I.map(([id, a, x, y, w], i) => { const hang = id === "sp_e_onion_net", d = Math.max(0, tt - a - 0.4); return <Mv key={id} r={hang ? 8 * Math.exp(-1.5 * d) * Math.sin(d * 4) : 0} ox={x} oy={hang ? 160 : y}>
      {hang && <div style={{ position: "absolute", left: x - 3, top: 140, width: 6, height: 120 * eio(tt, a - 0.2, a + 0.2), background: "#9a8a6a" }} />}
      <Spr id={id} tt={tt} at={a} x={x} y={y} w={w} from={hang ? "top" : i % 2 ? "right" : "left"} />
    </Mv>; })}
    {/* aire que se mueve por la red */}
    {tt > 4.4 && [0, 1, 2].map((i) => { const ph = ((tt * 0.5) + i * 0.33) % 1; return <div key={i} style={{ position: "absolute", left: 640 + ph * 520, top: 360 + 20 * Math.sin(ph * 8), width: 120, height: 4, borderRadius: 2, background: "rgba(220,230,240,.5)", opacity: Math.sin(ph * Math.PI) * 0.7 }} />; })}
  </>;
}}</Stage>;

// 38 · TRES TRABAJOS: tres platos de lata entran; el primero con fuego, el segundo con comida, el tercero con el barril: nadie aplaude
export const EThree: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const A = [-0.4, 0.4, 1.6], third = eio(tt, 3.4, 4.6), dim = eio(tt, 6.4, 8.0);
  return <>
    <BgB id="n_tres_trabajos" tt={tt} dim={0.74} />
    <Planks y={760} />
    {[0, 1, 2].map((i) => { const p = phys(tt, A[i] + 0.4, 6, 0.55), x = 480 + i * 480, foc = i === 2 ? third : 0; return <Mv key={i} y={-700 * (1 - p)} s={1 + 0.25 * foc} ox={x} oy={720} f={`brightness(${i < 2 ? 1 - 0.45 * third : 1})`}>
      <div style={{ position: "absolute", left: x - 190, top: 560, width: 380, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #dcdcd4, #9a9a92 60%, #6a6a64)", boxShadow: "0 24px 30px rgba(0,0,0,.55), inset 0 0 0 18px rgba(255,255,255,.18)", transform: "scaleY(.55)" }} />
      {i === 0 && <FireP tt={tt} x={x} y={720} w={220} k={0.8} n={12} />}
      {i === 1 && <Spr id="sp_e_potatoes" tt={tt} at={-5} x={x} y={650} w={280} from="none" shadow={0} style={{ transform: "scaleY(.7)" }} />}
      {i === 2 && <Spr id="sp_e_barrel" tt={tt} at={-5} x={x} y={560} w={230} from="none" shadow={0} />}
    </Mv>; })}
    {/* el aplauso que no llega: un foco que baja sobre el tercero y se apaga */}
    <div style={{ position: "absolute", left: 1440 - 260, top: 0, width: 520, height: 1080, background: "linear-gradient(180deg, rgba(255,220,150,.28), transparent 80%)", clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)", opacity: third * (1 - dim * 0.7), mixBlendMode: "screen" }} />
    <Num3 tt={tt} at={3.6} out={20} x={1440} y={260} n="3" col="#ffd27a" size={200} />
  </>;
}}</Stage>;

// 39 · TODO EN UN LUGAR: sal, salmuera, papa, tapa y piedra se apilan en el barril de corte, cada una en su palabra, y brilla
export const ERecap: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const salt = eio(tt, 0.9, 1.8), brine = eio(tt, 3.4, 5.0), pot = phys(tt, 6.6, 7, 0.5), lid = phys(tt, 8.0, 7, 0.45), rock = phys(tt, 9.2, 7, 0.4), IH = 588;
  return <>
    <BgB id="n_papa_piedra" tt={tt} dim={0.74} />
    <Planks y={900} dark />
    <Cut x={960} y={580} w={560} h={640} lev={0.78 * brine}>
      {[0, 1].map((r) => [0, 1, 2].map((j) => <Chunk key={`${r}${j}`} x={90 + j * 165} y={IH - 50 - r * 92} w={150} h={66} />))}
      {Array.from({ length: 20 }, (_, i) => <Xtal key={i} x={30 + rnd(i) * 440} y={IH - 200 - 40 * rnd(i, 2) - 300 * (1 - salt)} s={12} r={i * 30} o={salt} />)}
      {pot > 0.01 && <div style={{ position: "absolute", left: 250, top: IH * (1 - 0.78) - 40 + 600 * (1 - pot) * -1 + 4 * Math.sin(tt * 3), width: 0, height: 0 }}><Img src={spr("sp_e_potato")} style={{ position: "absolute", left: -55, top: -45, width: 110 }} /></div>}
    </Cut>
    <Mv y={-700 * (1 - lid)}><div style={{ position: "absolute", left: 960 - 250, top: 580 - 320 + IH * 0.22 + 20, width: 500, height: 40, borderRadius: 12, background: "repeating-linear-gradient(90deg,#8a5e34 0 80px,#6a4426 80px 84px)", boxShadow: "0 10px 14px rgba(0,0,0,.5)" }} /></Mv>
    <Mv y={-700 * (1 - rock)}><Spr id="sp_e_rock" tt={tt} at={-5} x={960} y={360} w={260} from="none" /></Mv>
    <Glint tt={tt} at={9.8} x={960} y={420} r={200} />
  </>;
}}</Stage>;

export const HA: Record<string, C> = {
  e_sled: ESled, e_week: EWeek, e_years: EYears, e_burn: EBurn, e_fat: EFat, e_beef: EBeef, e_knock: EKnock, e_staves: EStaves,
  e_pine: EPine, e_roll: ERoll, e_salt: ESalt, e_layers: ELayers, e_boiled: EBoiled, e_potato: EPotato, e_heavy: EHeavy,
  e_lid: ELid, e_float: EFloat, e_blanket: EBlanket, e_warm: EWarm, e_freeze: EFreeze, e_thermo: EThermo, e_snow: ESnow,
  e_forgot: EForgot, e_ropey: ERopey, e_scrub: EScrub, e_yourrock: EYourRock, e_five: EFive, e_fork: EFork, e_months: EMonths,
  e_half: EHalf, e_breakup: EBreakup, e_soak: ESoak, e_everything: EEverything, e_garage: EGarage, e_bacon: EBacon,
  e_mysoak: EMySoak, e_shelf: EShelf, e_three: EThree, e_recap: ERecap,
};
