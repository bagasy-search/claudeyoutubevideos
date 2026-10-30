// swl29e · los componentes únicos del video (uno por minuto, ninguno repetido en la tanda: D:/rtmp/swl29_COMPONENTES.md).
// Cada uno es el OBJETO que la idea es, dentro del Stage. h.b = segundos (absolutos) de las palabras que lo disparan.
import React from "react";
import { Img } from "remotion";
import { Stage, Tag, Shadow, H, K, cl, phys, eio, eIn, eOut, lerp, rnd, img, SERIF, HAND, MARK, SANS } from "./kit";

const r = (h: H, i: number, d = 0) => (h.b[i] ?? h.at + d) - h.at;   // beat i relativo a la entrada
const D = (h: H) => h.out - h.at;
type CP = { t: number; h: H };
const CORN = "radial-gradient(ellipse at 40% 30%,#ffe7a0,#f2c25a 45%,#d0902c 80%,#a8661a)";
const IRON = "radial-gradient(ellipse at 40% 35%,#3a3836,#161514 60%,#050505)";
// sartencita de hierro vista en 3/4: disco + mango
const Skillet: React.FC<{ x: number; y: number; w: number; fill?: string; rot?: number; o?: number }> = ({ x, y, w, fill, rot = 0, o = 1 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.32, width: w * 1.55, height: w * 0.64, transform: `rotate(${rot}deg)`, transformOrigin: `${w / 2}px 50%`, opacity: o }}>
    <div style={{ position: "absolute", left: w * 0.9, top: w * 0.26, width: w * 0.62, height: w * 0.12, borderRadius: w * 0.06, background: "linear-gradient(180deg,#3a3734,#0e0d0c)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: w * 0.64, borderRadius: "50%", background: IRON, boxShadow: "0 20px 40px rgba(0,0,0,.55)" }}>
      {fill && <div style={{ position: "absolute", left: "9%", top: "11%", width: "82%", height: "74%", borderRadius: "50%", background: fill }} />}
    </div>
  </div>
);

// E01 · la ventana con lluvia: las gotas bajan por el vidrio, afuera oscurece y a las 5:00 se prende la lámpara de adentro
export const E01Rain: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="night">{(tt) => {
  const dusk = eio(tt, 0.3, 3.0), lamp = eio(tt, 3.0, 3.6), mins = Math.round(lerp(0, 60, dusk));
  return <>
    <div style={{ position: "absolute", left: 960 - 460, top: 180, width: 920, height: 680, borderRadius: 8, overflow: "hidden", background: `linear-gradient(180deg,rgb(${lerp(120, 22, dusk)},${lerp(135, 28, dusk)},${lerp(150, 48, dusk)}),rgb(${lerp(90, 14, dusk)},${lerp(100, 18, dusk)},${lerp(110, 30, dusk)}))`, boxShadow: "inset 0 0 0 26px #f2ead8, inset 0 0 0 30px #b8a888, 0 40px 80px rgba(0,0,0,.6)" }}>
      {/* el campo y el granero lejos */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `rgb(${lerp(70, 12, dusk)},${lerp(80, 16, dusk)},${lerp(60, 14, dusk)})` }} />
      <div style={{ position: "absolute", left: 620, bottom: 170, width: 120, height: 90, background: `rgb(${lerp(120, 30, dusk)},${lerp(40, 12, dusk)},${lerp(40, 12, dusk)})`, clipPath: "polygon(0 35%,50% 0,100% 35%,100% 100%,0 100%)" }} />
      {/* gotas que corren */}
      {Array.from({ length: 34 }, (_, i) => { const sp = 0.25 + rnd(i) * 0.4, y = ((tt * sp + rnd(i + 3)) % 1) * 760 - 60, x = 40 + rnd(i + 7) * 840;
        return <React.Fragment key={i}>
          <div style={{ position: "absolute", left: x, top: y - 80, width: 4, height: 80, borderRadius: 2, background: "linear-gradient(180deg,rgba(220,235,255,0),rgba(220,235,255,.45))" }} />
          <div style={{ position: "absolute", left: x - 6, top: y, width: 16, height: 20, borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%", background: "radial-gradient(circle at 35% 30%,rgba(255,255,255,.9),rgba(170,200,230,.35) 60%)" }} />
        </React.Fragment>; })}
      {/* el reflejo cálido de la lámpara en el vidrio */}
      <div style={{ position: "absolute", left: 120, top: 120, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,200,110,.55),rgba(255,200,110,0) 70%)", opacity: lamp }} />
      <div style={{ position: "absolute", left: 451, top: 0, width: 18, height: "100%", background: "#f2ead8" }} />
      <div style={{ position: "absolute", top: 331, left: 0, width: "100%", height: 18, background: "#f2ead8" }} />
    </div>
    <div style={{ position: "absolute", left: 1460, top: 260, fontFamily: SANS, fontWeight: 900, fontSize: 110, color: lamp > 0.5 ? K.goldL : K.ice }}>{4 + Math.floor(mins / 60)}:{String(mins % 60).padStart(2, "0")}</div>
    <Tag tt={tt} at={3.2} x={1560} y={460} txt="dark at five" size={56} font={HAND} col={K.tx} />
  </>;
}}</Stage>;

// E02 · el carro de panadería del sótano: entra rodando y sus 20 estantes se llenan de bandejas de pan de maíz
export const E02Rack: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const roll = eOut(tt, 0.2, 1.3), x = lerp(-500, 760, roll), n = Math.round(lerp(0, 20, eio(tt, 1.0, D(h) - 1.2)));
  return <>
    <Shadow x={x + 230} y={940} w={560} k={1} />
    <div style={{ position: "absolute", left: x, top: 160, width: 460, height: 760 }}>
      {[0, 440].map((px) => <div key={px} style={{ position: "absolute", left: px, top: 0, width: 20, height: 740, background: "linear-gradient(90deg,#8a9096,#eef1f3,#7c8288)" }} />)}
      {Array.from({ length: 20 }, (_, i) => <React.Fragment key={i}>
        <div style={{ position: "absolute", left: 20, top: 20 + i * 35, width: 420, height: 4, background: "#9aa0a6" }} />
        {i < n && <div style={{ position: "absolute", left: 30 + (i === n - 1 ? (1 - eOut(cl(((tt - 1.0) / (D(h) - 2.2)) * 20 - i), 0, 1)) * -300 : 0), top: 4 + i * 35, width: 400, height: 22, borderRadius: 3, background: "linear-gradient(180deg,#c8ccd0,#8a9096)" }}>
          <div style={{ position: "absolute", left: 8, right: 8, top: 2, height: 14, borderRadius: 3, background: CORN }} />
        </div>}
      </React.Fragment>)}
      {[0, 420].map((px) => <div key={"w" + px} style={{ position: "absolute", left: px - 6, top: 740, width: 32, height: 32, borderRadius: "50%", background: "#222", transform: `rotate(${roll * 720}deg)`, border: "6px solid #555" }} />)}
    </div>
    <div style={{ position: "absolute", left: 1340, top: 400, fontFamily: SANS, fontWeight: 900, fontSize: 170, color: K.goldL, lineHeight: 1 }}>{n}</div>
    <div style={{ position: "absolute", left: 1350, top: 580, fontFamily: HAND, fontSize: 56, color: K.tx }}>sheet pans at a time</div>
  </>;
}}</Stage>;

// E03 · las sartenes encastradas: 12" · 10" · 8" se apilan como mamushkas, se van, y queda la de 6" iluminada
export const E03Nest: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const S2 = [12, 10, 8, 6], go = eio(tt, 2.2, 3.2);
  return <>
    <Shadow x={900} y={860} w={720} k={1} />
    {S2.map((s, i) => { const k = phys(tt, 0.3 + i * 0.35, 6, 0.5), w = s * 52, last = i === 3, out = last ? 0 : go;
      return <div key={s} style={{ position: "absolute", left: 0, top: 0, opacity: cl(k * 3) * (1 - out), transform: `translate(${out * (i - 1.5) * 500}px,${(1 - cl(k)) * -500 - out * 300}px)` }}>
        <Skillet x={900} y={720 - i * 8} w={w} fill={last ? CORN : undefined} rot={-6 + i * 3} />
        <div style={{ position: "absolute", left: 900 + w * 0.32, top: 720 - i * 8 - w * 0.4 - 20, fontFamily: SANS, fontWeight: 900, fontSize: last ? 70 : 40, color: last ? K.goldL : K.dim, transform: `scale(${last ? 1 + 0.15 * go : 1})` }}>{s}"</div>
      </div>; })}
    <div style={{ position: "absolute", left: 900 - 200, top: 560, width: 400, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,210,120,.35),rgba(255,210,120,0) 70%)", opacity: go }} />
    <Tag tt={tt} at={3.0} x={1500} y={480} txt="ONE PERSON" size={64} col={K.goldL} />
    <Tag tt={tt} at={3.6} x={1500} y={570} txt="about a dollar a night" size={50} font={HAND} col={K.tx} />
  </>;
}}</Stage>;

// E04 · la polaroid de 1983: sale de la cámara, se revela de gris a color y en el borde blanco aparece «Dolores · 1983»
export const E04Polaroid: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const out = eOut(tt, 0.3, 1.4), dev = eio(tt, 1.2, 3.6), wr = eio(tt, 3.0, 4.2);
  return <>
    <div style={{ position: "absolute", left: 960 - 270, top: 140, width: 540, height: 260, borderRadius: "30px 30px 10px 10px", background: "linear-gradient(180deg,#f4f1ea,#cfc8ba)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 200, top: 40, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#6a8ab0,#1a2a40 60%,#000)", boxShadow: "0 0 0 14px #2a2a2a" }} />
      <div style={{ position: "absolute", left: 40, top: 30, width: 70, height: 40, borderRadius: 6, background: "#2a2a2a" }} />
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 40 + i * 92, top: 200, width: 80, height: 14, background: ["#d8362a", "#f2a614", "#f6e04a", "#5cb85c", "#3a7ad8"][i] }} />)}
    </div>
    <div style={{ position: "absolute", left: 960 - 220, top: 360 + out * 120, width: 440, height: 520, background: "#fbfaf4", boxShadow: "0 20px 40px rgba(0,0,0,.45)", transform: `rotate(${out * -4 + 2 * Math.sin(tt * 1.2)}deg)`, padding: "26px 26px 0" }}>
      <div style={{ position: "relative", width: 388, height: 388, overflow: "hidden", background: "#2a2a28" }}>
        <Img src={img(h.bg ?? "f05")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: dev, filter: `saturate(${dev * 0.9}) sepia(${0.4 - 0.2 * dev}) brightness(${0.6 + 0.4 * dev})` }} />
      </div>
      <div style={{ marginTop: 26, textAlign: "center", fontFamily: HAND, fontSize: 52, color: "#2a3a8a", clipPath: `inset(0 ${(1 - wr) * 100}% 0 0)` }}>Dolores · 1983</div>
    </div>
    <Tag tt={tt} at={2.2} x={1520} y={560} txt="the church kitchen" size={52} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// E05 · la etiquetadora de precios de almacén: clac, sale la etiqueta naranja «60¢» y se pega en la caja de mezcla
export const E05PriceGun: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const box = phys(tt, 0.2, 6, 0.5), sq = eio(tt, 1.3, 1.5) * (1 - eio(tt, 1.5, 1.8)), lab = cl((tt - 1.5) / 0.4), lx = lerp(1320, 820, eOut(lab, 0, 1));
  return <>
    <Shadow x={760} y={890} w={420} k={1} />
    <div style={{ position: "absolute", left: 760 - 180, top: 360 + (1 - cl(box)) * -500, width: 360, height: 520, borderRadius: 8, background: "linear-gradient(90deg,#1f4fa0,#3a74d0 40%,#1a4088)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", transform: "perspective(1200px) rotateY(-14deg)" }}>
      <div style={{ position: "absolute", left: 20, top: 30, right: 20, fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#fff", lineHeight: 1 }}>CORN<br />BREAD<div style={{ fontSize: 30, fontWeight: 700 }}>MUFFIN MIX</div></div>
      <div style={{ position: "absolute", left: 40, bottom: 40, width: 280, height: 200, borderRadius: "50%", background: CORN, boxShadow: "inset 0 -10px 20px rgba(120,60,10,.4)" }} />
    </div>
    {/* la etiqueta que viaja */}
    {lab > 0 && <div style={{ position: "absolute", left: lx, top: lerp(470, 430, lab), width: 170, height: 90, borderRadius: 10, background: "#ff7a1a", boxShadow: "0 6px 12px rgba(0,0,0,.35)", transform: `rotate(${lerp(0, -10, lab)}deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#fff" }}>60¢</div>}
    {/* la etiquetadora */}
    <div style={{ position: "absolute", left: 1300, top: 380 + sq * 20, width: 360, height: 300, transform: `rotate(${-10 + sq * 6}deg)` }}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 280, height: 120, borderRadius: "20px 60px 20px 20px", background: "linear-gradient(180deg,#d8362a,#9a1a14)" }} />
      <div style={{ position: "absolute", left: 160, top: 150, width: 90, height: 150, borderRadius: 16, background: "linear-gradient(90deg,#2a2a2a,#555,#2a2a2a)", transform: "rotate(10deg)" }} />
      <div style={{ position: "absolute", left: 120, top: 120 + sq * 40, width: 140, height: 30, borderRadius: 10, background: "#3a3a3a", transform: `rotate(${20 - sq * 20}deg)` }} />
      <div style={{ position: "absolute", left: 200, top: 0, width: 80, height: 80, borderRadius: "50%", background: "repeating-radial-gradient(circle,#ff9a3a 0 6px,#e8702a 6px 10px)" }} />
    </div>
    <Tag tt={tt} at={2.6} x={1460} y={800} txt="ONE BOX = TWO SUPPERS" size={52} col={K.goldL} />
  </>;
}}</Stage>;

// E06 · el truco de magia: la caja de mezcla dentro del cajón del mago, el serrucho la corta al medio y una mitad se vuelca en el frasco
export const E06Saw: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="night">{(tt) => {
  const saw = eio(tt, 0.5, 1.8), sp = eio(tt, 1.9, 2.5), pour = eio(tt, 2.7, 3.8), jar = eio(tt, 3.6, 4.3);
  return <>
    <div style={{ position: "absolute", left: 960 - 500, top: 170, width: 1000, height: 640, background: "radial-gradient(ellipse at 50% 0%,rgba(255,230,160,.35),rgba(255,230,160,0) 60%)" }} />
    <Shadow x={800} y={860} w={640} k={1} />
    {[0, 1].map((s) => <div key={s} style={{ position: "absolute", left: 520 + s * 280 + (s ? 60 : -40) * sp + (s ? 300 * pour : 0), top: 460 - (s ? 140 * pour : 0), width: 280, height: 360, transform: `rotate(${s ? -100 * pour : 0}deg)`, transformOrigin: "100% 0", background: s ? "repeating-linear-gradient(45deg,#7a1a3a 0 30px,#9a2a4a 30px 60px)" : "repeating-linear-gradient(-45deg,#7a1a3a 0 30px,#9a2a4a 30px 60px)", boxShadow: "0 20px 40px rgba(0,0,0,.5), inset 0 0 0 10px #f2c84a", opacity: s ? 1 - eIn(tt, 3.8, 4.2) : 1 }}>
      <div style={{ position: "absolute", left: 30, top: 70, right: 30, fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#fff", textAlign: "center" }}>½</div>
      {s === 1 && pour > 0.2 && Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: -20 - rnd(i) * 40, top: 20 + ((tt * 3 + rnd(i)) % 1) * 300, width: 8, height: 8, borderRadius: "50%", background: "#f2d48a", opacity: 1 - jar }} />)}
    </div>)}
    {/* el serrucho */}
    <div style={{ position: "absolute", left: 770 + 30 * Math.sin(tt * 14) * (saw < 1 ? 1 : 0), top: lerp(260, 640, saw), width: 80, height: 420, opacity: 1 - sp }}>
      <div style={{ width: 80, height: 300, clipPath: "polygon(0 0,100% 0,100% 100%,0 92%)", background: "linear-gradient(90deg,#9aa0a6,#f4f6f8 50%,#80868c)" }} />
      <div style={{ width: 80, height: 110, borderRadius: 20, background: "linear-gradient(180deg,#6b4426,#3a2414)" }} />
    </div>
    {/* el frasco con tapa y rótulo */}
    <div style={{ position: "absolute", left: 1330, top: 470, width: 240, height: 360, opacity: cl((tt - 2.4) * 3) }}>
      <div style={{ position: "absolute", left: 20, top: 0, width: 200, height: 50, borderRadius: 10, background: "linear-gradient(90deg,#9a7a30,#f4d68a,#8a6a20)", transform: `translateY(${(1 - jar) * -60}px)` }} />
      <div style={{ position: "absolute", left: 0, top: 46, width: 240, height: 314, borderRadius: "20px 20px 40px 40px", background: "linear-gradient(90deg,rgba(255,255,255,.2),rgba(255,255,255,.5) 30%,rgba(255,255,255,.15))", border: "4px solid rgba(255,255,255,.55)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${pour * 55}%`, background: "linear-gradient(180deg,#f8e0a0,#e8c070)" }} />
        <div style={{ position: "absolute", left: 30, top: 60, background: "#fff7d6", padding: "6px 12px", fontFamily: MARK, fontSize: 34, color: "#1b1b22", transform: "rotate(-3deg)", clipPath: `inset(0 ${(1 - jar) * 100}% 0 0)` }}>HALF BOX</div>
      </div>
    </div>
    <Tag tt={tt} at={3.8} x={1450} y={920} txt="next time" size={50} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// E07 · la cámara térmica: la sartén en el horno pasa de azul (fría) a blanco (humeante); la escala dice 450°F y cae la masa: «SIZZLE»
export const E07Thermal: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="night">{(tt) => {
  const hot = eio(tt, 0.4, 2.8), pour = cl((tt - 3.0) / 0.5), T2 = Math.round(lerp(70, 450, hot));
  const pal = (v: number) => v < 0.33 ? `rgb(${lerp(20, 140, v * 3)},${lerp(30, 20, v * 3)},${lerp(160, 160, v * 3)})` : v < 0.66 ? `rgb(${lerp(140, 255, (v - 0.33) * 3)},${lerp(20, 120, (v - 0.33) * 3)},${lerp(160, 20, (v - 0.33) * 3)})` : `rgb(255,${lerp(120, 250, (v - 0.66) * 3)},${lerp(20, 220, (v - 0.66) * 3)})`;
  return <>
    <div style={{ position: "absolute", left: 960 - 520, top: 200, width: 1040, height: 680, borderRadius: 24, background: "#0a0a12", boxShadow: "0 0 0 16px #2a2a30, 0 40px 80px rgba(0,0,0,.7)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 60%,${pal(hot * 0.5)},#0a0a40 70%)` }} />
      <div style={{ position: "absolute", left: 260, top: 250, width: 520, height: 330, borderRadius: "50%", background: `radial-gradient(ellipse,${pal(hot)},${pal(hot * 0.8)} 60%,${pal(hot * 0.55)})`, boxShadow: `0 0 ${60 * hot}px ${pal(hot)}` }}>
        {pour > 0 && <div style={{ position: "absolute", left: "15%", top: "15%", width: "70%", height: "70%", borderRadius: "50%", background: `radial-gradient(ellipse,${pal(0.3)},${pal(0.55)} 70%,${pal(0.95)})`, transform: `scale(${pour})` }} />}
      </div>
      <div style={{ position: "absolute", left: 760, top: 380, width: 260, height: 60, borderRadius: 30, background: pal(hot * 0.7) }} />
      {/* retícula del visor */}
      <div style={{ position: "absolute", left: 500, top: 395, width: 40, height: 40, border: "3px solid #fff", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 30, top: 24, fontFamily: "monospace", fontSize: 40, color: "#fff" }}>● REC  {T2}°F</div>
      <div style={{ position: "absolute", right: 30, top: 80, width: 40, height: 520, background: `linear-gradient(0deg,${pal(0)},${pal(0.33)},${pal(0.66)},${pal(1)})` }} />
      <div style={{ position: "absolute", right: 80, top: 80 + (1 - hot) * 500, width: 30, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: "24px solid #fff" }} />
    </div>
    {pour > 0 && <div style={{ position: "absolute", left: 960, top: 520, transform: `translateX(-50%) scale(${0.6 + 0.4 * cl(phys(tt, 3.0, 7, 0.4))})`, fontFamily: SANS, fontWeight: 900, fontSize: 110, letterSpacing: 8, color: "#fff", textShadow: "0 0 30px rgba(255,200,120,.9)" }}>SIZZLE</div>}
    <Tag tt={tt} at={1.0} x={960} y={960} txt="THE SKILLET HEATS WITH THE OVEN" size={46} col={K.tx} />
  </>;
}}</Stage>;

// E08 · el contador manual de portero: cada vuelta de la cuchara en el bol suma uno hasta 15 y la cuchara se detiene
export const E08Tally: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const p = cl((tt - 0.4) / (D(h) - 1.6)), n = Math.min(15, Math.floor(p * 15.99)), ang = p * 15 * 360, stop = p >= 1;
  return <>
    <Shadow x={720} y={890} w={600} k={1} />
    <div style={{ position: "absolute", left: 720 - 290, top: 560, width: 580, height: 320, borderRadius: "0 0 290px 290px", background: "linear-gradient(90deg,#e8dcc0,#fffaf0 40%,#cfc0a0)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 720 - 270, top: 530, width: 540, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse,#f4d68a,#d8a850 70%)", overflow: "hidden" }}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 440, top: 10 + rnd(i + 5) * 60, width: 26, height: 16, borderRadius: "50%", background: "#c8903a" }} />)}
    </div>
    <div style={{ position: "absolute", left: 720 + Math.cos(ang * Math.PI / 180) * 180 - 20, top: 300 + Math.sin(ang * Math.PI / 180) * 30, width: 40, height: 300, transform: `rotate(${12 * Math.cos(ang * Math.PI / 180)}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ width: 40, height: 220, borderRadius: 20, background: "linear-gradient(90deg,#8a5a2c,#c8925a,#7a4a1c)" }} />
      <div style={{ width: 70, height: 90, marginLeft: -15, borderRadius: "50%", background: "radial-gradient(ellipse,#d8a26a,#8a5a2c)" }} />
    </div>
    {/* el contador */}
    <div style={{ position: "absolute", left: 1230, top: 330, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%,#f4f6f8,#b8bec4 60%,#7c8288)", boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: 70, top: 150, width: 280, height: 120, borderRadius: 12, background: "#111", display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
        {String(n).padStart(4, "0").split("").map((d, i) => <div key={i} style={{ width: 54, height: 90, background: "linear-gradient(180deg,#fff,#ddd 50%,#fff)", borderRadius: 6, fontFamily: "monospace", fontWeight: 900, fontSize: 70, color: i === 3 || (i === 2 && n > 9) ? K.red : "#111", textAlign: "center", lineHeight: "90px" }}>{d}</div>)}
      </div>
      <div style={{ position: "absolute", left: 300, top: -50, width: 70, height: 80, borderRadius: 14, background: "linear-gradient(180deg,#d8dde2,#8a9096)", transform: `translateY(${(n > 0 ? Math.max(0, 1 - ((p * 15) % 1) * 4) : 0) * 16}px)` }} />
    </div>
    <Tag tt={tt} at={D(h) - 1.0} x={1440} y={820} txt="LUMPY IS GOOD" size={60} col={stop ? K.goldL : K.dim} />
  </>;
}}</Stage>;

// E09 · el ladrillo: el cuadrado de pan de maíz bajo el repasador se va endureciendo (lunes→jueves) hasta volverse un ladrillo rojo
export const E09Brick: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const p = eio(tt, 0.5, D(h) - 1.2), day = ["MON", "TUE", "WED", "THU"][Math.min(3, Math.floor(p * 3.99))], towel = eio(tt, 0.2, 0.8) * (1 - eio(tt, D(h) - 1.4, D(h) - 0.9));
  return <>
    <Shadow x={900} y={860} w={560} k={1} />
    <div style={{ position: "absolute", left: 900 - 230, top: 560, width: 460, height: 300, borderRadius: p > 0.85 ? 4 : 18, background: p < 0.7 ? CORN : "linear-gradient(160deg,#b8442a,#8a2a1a 60%,#6a1a10)", filter: `saturate(${1 - 0.5 * p}) brightness(${1 - 0.25 * p})`, boxShadow: "0 20px 40px rgba(0,0,0,.5)", transform: `scale(${1 - 0.08 * p})`, overflow: "hidden" }}>
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + rnd(i) * 380, top: 20 + rnd(i + 4) * 240, width: 90 * cl(p * 2 - rnd(i)), height: 4, background: "rgba(90,40,10,.6)", transform: `rotate(${rnd(i + 2) * 180}deg)` }} />)}
      {p > 0.75 && [0, 1].map((i) => <div key={"m" + i} style={{ position: "absolute", left: 0, right: 0, top: 96 + i * 104, height: 8, background: "rgba(220,210,190,.7)", opacity: (p - 0.75) * 4 }} />)}
    </div>
    {/* el repasador */}
    <div style={{ position: "absolute", left: 900 - 270, top: 520 - (1 - towel) * 520, width: 540, height: 360, background: "repeating-linear-gradient(90deg,#fbf6ea 0 40px,#c8384a 40px 52px,#fbf6ea 52px 92px)", borderRadius: "10px 10px 40px 40px", opacity: towel * 0.85, transform: `rotate(${-4 + 4 * towel}deg)` }} />
    <div style={{ position: "absolute", left: 1330, top: 380, fontFamily: SANS, fontWeight: 900, fontSize: 130, color: day === "THU" ? K.red : K.goldL }}>{day}</div>
    <Tag tt={tt} at={D(h) - 1.0} x={1440} y={620} txt="HARD AS A BRICK" size={58} col={K.red} />
  </>;
}}</Stage>;

// E10 · la grasa de tocino: la cucharada de la lata de café se derrite y al caer la masa el borde se vuelve un encaje que se teje alrededor
export const E10Lace: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const melt = eio(tt, 0.6, 1.8), bat = eOut(tt, 2.0, 2.6), lace = eio(tt, 2.6, D(h) - 0.6);
  return <>
    <Shadow x={860} y={890} w={720} k={1} />
    <div style={{ position: "absolute", left: 860 - 340, top: 400, width: 680, height: 460, borderRadius: "50%", background: IRON, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 160 + 300 * melt, height: 110 + 200 * melt, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(255,236,190,.85),rgba(240,200,120,.35) 70%,rgba(240,200,120,0))", opacity: melt > 0 ? 1 : 0 }} />
      {/* encaje: anillo de agujeritos que se teje */}
      <svg width={680} height={460} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 48 }, (_, i) => { const a = i / 48 * Math.PI * 2, ok = i / 48 < lace; return ok ? <g key={i}><circle cx={340 + Math.cos(a) * 250} cy={230 + Math.sin(a) * 165} r={14 + 4 * rnd(i)} fill="none" stroke="#8a4e18" strokeWidth={6} /><circle cx={340 + Math.cos(a) * 270} cy={230 + Math.sin(a) * 180} r={7} fill="#b8772c" /></g> : null; })}
      </svg>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 500 * bat, height: 330 * bat, transform: "translate(-50%,-50%)", borderRadius: "50%", background: `radial-gradient(ellipse,#ffe7a0,#f2c25a 60%,rgb(${lerp(242, 184, lace)},${lerp(194, 119, lace)},${lerp(90, 44, lace)}))` }} />
    </div>
    {/* la cuchara con la grasa blanca */}
    <div style={{ position: "absolute", left: lerp(1300, 900, eio(tt, 0.1, 0.6)), top: 300, width: 300, height: 90, transform: `rotate(${-20 + 30 * eio(tt, 0.5, 0.8)}deg)`, opacity: 1 - eIn(tt, 1.2, 1.6) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 120, height: 80, borderRadius: "50%", background: "linear-gradient(90deg,#9aa0a6,#f4f6f8)" }}><div style={{ margin: 16, width: 88, height: 48, borderRadius: "50%", background: "#fbf4e2", transform: `scale(${1 - melt})` }} /></div>
      <div style={{ position: "absolute", left: 110, top: 32, width: 190, height: 16, borderRadius: 8, background: "#c8ccd0" }} />
    </div>
    <div style={{ position: "absolute", left: 1330, top: 600, width: 220, height: 260, borderRadius: 14, background: "linear-gradient(90deg,#8a1a1a,#d8362a 40%,#7a1414)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 20, top: 90, right: 20, fontFamily: SERIF, fontSize: 40, color: "#fff7d6", textAlign: "center" }}>Coffee</div>
      <div style={{ position: "absolute", left: 0, top: -14, width: 220, height: 30, borderRadius: "50%", background: "#c8ccd0" }} />
    </div>
    <Tag tt={tt} at={3.0} x={1440} y={460} txt="lacy and brown" size={58} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// E12 · el laboratorio del huevo: el huevo batido en un vaso de precipitado se reparte en dos probetas hasta la marca de 50 %
export const E12Beakers: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const crack = eio(tt, 0.3, 0.8), whisk = eio(tt, 0.8, 2.0), pour = eio(tt, 2.2, 3.6);
  const col = `rgb(${lerp(255, 248, whisk)},${lerp(250, 206, whisk)},${lerp(240, 90, whisk)})`;
  return <>
    <Shadow x={960} y={890} w={900} k={1} />
    {/* vaso grande */}
    <div style={{ position: "absolute", left: 960 - 130, top: 470 - 60 * pour, width: 260, height: 340, transform: `rotate(${pour > 0 ? 50 * Math.sin(pour * Math.PI) * (pour < 0.5 ? -1 : 1) : 0}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "10px 10px 30px 30px", background: "linear-gradient(90deg,rgba(255,255,255,.18),rgba(255,255,255,.45) 30%,rgba(255,255,255,.12))", border: "4px solid rgba(255,255,255,.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lerp(40, 4, pour)}%`, background: col }}>
          {whisk < 1 && <div style={{ position: "absolute", left: "40%", top: "20%", width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle,#ffb020,#f29010)", opacity: 1 - whisk }} />}
        </div>
      </div>
      {whisk > 0 && whisk < 1 && <div style={{ position: "absolute", left: 110 + 40 * Math.sin(tt * 18), top: -80, width: 12, height: 320, borderRadius: 6, background: "linear-gradient(90deg,#9aa0a6,#f4f6f8)", transform: `rotate(${10 * Math.sin(tt * 18)}deg)` }} />}
    </div>
    {/* la cáscara */}
    {[0, 1].map((s) => <div key={s} style={{ position: "absolute", left: 930 + (s ? 30 : -30) * crack - 40, top: 330 - 60 * (1 - crack) + 200 * eIn(tt, 0.8, 1.2), width: 80, height: 70, borderRadius: s ? "0 50% 50% 0" : "50% 0 0 50%", background: "radial-gradient(circle at 40% 35%,#fffaf0,#e8d8b8)", transform: `rotate(${(s ? 1 : -1) * 30 * crack}deg)`, opacity: 1 - eIn(tt, 1.0, 1.3) }} />)}
    {/* dos probetas */}
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: i ? 1300 : 480, top: 520, width: 140, height: 360 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "6px 6px 70px 70px", background: "linear-gradient(90deg,rgba(255,255,255,.18),rgba(255,255,255,.45) 30%,rgba(255,255,255,.12))", border: "4px solid rgba(255,255,255,.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${50 * cl(pour * 2 - i * 0.9)}%`, background: col }} />
      </div>
      <div style={{ position: "absolute", left: -70, top: 172, width: 70, height: 4, background: K.red }} />
      <div style={{ position: "absolute", left: -110, top: 150, fontFamily: SANS, fontWeight: 900, fontSize: 36, color: K.red }}>½</div>
      <div style={{ position: "absolute", left: 70, top: 390, transform: "translateX(-50%)", fontFamily: HAND, fontSize: 46, color: K.goldL, whiteSpace: "nowrap", opacity: cl(pour * 2 - i * 0.9) }}>{i ? "the fridge" : "tonight"}</div>
    </div>)}
    <Tag tt={tt} at={1.4} x={960} y={300} txt="ALL ONE COLOR" size={52} col={K.tx} />
  </>;
}}</Stage>;

// E13 · el disco de hockey: patina sobre el hielo, frena con raspón de escarcha y se vuelve la hamburguesita cruda de ¼ lb
export const E13Puck: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="cold">{(tt) => {
  const sl = eOut(tt, 0.2, 1.6), x = lerp(-200, 800, sl), mo = eio(tt, 1.8, 2.8);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 520, background: "linear-gradient(180deg,#e8f4fb,#c6e2f2)", transform: "perspective(900px) rotateX(55deg)", transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", left: "50%", top: 0, width: 16, height: "100%", background: "#d83a3a", opacity: 0.6 }} />
      <div style={{ position: "absolute", left: "20%", top: "30%", width: 260, height: 260, borderRadius: "50%", border: "10px solid rgba(58,110,216,.6)" }} />
    </div>
    {/* raspón de hielo */}
    {Array.from({ length: 20 }, (_, i) => <div key={i} style={{ position: "absolute", left: x - 60 - rnd(i) * 160 * sl, top: 690 - rnd(i + 3) * 60, width: 8, height: 8, borderRadius: "50%", background: "#fff", opacity: (1 - mo) * cl((sl - 0.6) * 4) }} />)}
    <Shadow x={x} y={760} w={300} k={1} />
    <div style={{ position: "absolute", left: x - 150, top: 650, width: 300, height: 110, transform: `rotate(${(1 - sl) * 300}deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%,#3a3a3a,#0a0a0a 70%)", opacity: 1 - mo }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 30%,#f28c8c,#c84a4a 55%,#8a2a2a)", opacity: mo, boxShadow: "inset 0 -10px 20px rgba(90,20,20,.45)" }}>
        {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + rnd(i) * 240, top: 15 + rnd(i + 4) * 70, width: 10, height: 6, borderRadius: "50%", background: "rgba(255,220,220,.6)" }} />)}
      </div>
    </div>
    <div style={{ position: "absolute", left: 1220, top: 300, fontFamily: SANS, fontWeight: 900, fontSize: 120, color: K.ink, opacity: cl(mo * 2) }}>¼ LB</div>
    <Tag tt={tt} at={2.4} x={1420} y={480} txt="ground beef" size={56} font={HAND} col={K.wine} />
  </>;
}}</Stage>;

// E14 · el palillo: entra en la costra dorada, sale y en primer plano brilla limpio — «CLEAN ✓»
export const E14Toothpick: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const a = r(h, 0), inn = eio(tt, a - 1.2, a - 0.6), out = eio(tt, a - 0.2, a + 0.4), zoom = eio(tt, a + 0.2, a + 0.8), gold = eio(tt, 0.2, a - 1.4);
  return <>
    <Shadow x={780} y={900} w={700} k={1} />
    <Skillet x={760} y={720} w={640} fill={`radial-gradient(ellipse at 40% 30%,rgb(255,${lerp(230, 214, gold)},${lerp(170, 120, gold)}),rgb(${lerp(240, 216, gold)},${lerp(200, 150, gold)},${lerp(110, 56, gold)}) 60%,#8a5414)`} />
    <div style={{ position: "absolute", left: 760 - 6, top: lerp(260, 520, inn) - 300 * out, width: 12, height: 320, borderRadius: 6, background: "linear-gradient(90deg,#d8b880,#f4e0b4,#c8a060)", transform: `rotate(${8 - 8 * zoom}deg) scale(${1 + 0.6 * zoom})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 0, bottom: -16, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "18px solid #c8a060" }} />
    </div>
    {zoom > 0 && Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 760 + Math.cos(i * 1.3) * 60 * zoom - 10, top: 260 + Math.sin(i * 1.3) * 80 * zoom, width: 20, height: 20, background: "#fff", clipPath: "polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%)", opacity: zoom * (0.5 + 0.5 * Math.sin(tt * 8 + i)) }} />)}
    <Tag tt={tt} at={a + 0.5} x={1400} y={480} txt="CLEAN ✓" size={80} col={K.green} />
    <Tag tt={tt} at={0.4} x={1400} y={620} txt="400°F · 18–20 MIN" size={50} col={K.tx} />
  </>;
}}</Stage>;

// E17 · las dos manoplas: el mango de la sartén se pone al rojo con ondas de calor y un cartel de ruta «400°» amarillo se da vuelta
export const E17Mitts: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const glow = eio(tt, 0.3, 1.6), mitt = eOut(tt, 1.6, 2.4), sign = eio(tt, 0.8, 1.4);
  return <>
    <Shadow x={860} y={860} w={700} k={1} />
    <Skillet x={760} y={700} w={520} fill={CORN} />
    <div style={{ position: "absolute", left: 760 + 470, top: 700 - 30, width: 330, height: 60, borderRadius: 30, background: `linear-gradient(180deg,rgb(${lerp(58, 255, glow)},${lerp(55, 90, glow)},${lerp(52, 30, glow)}),rgb(${lerp(14, 190, glow)},${lerp(13, 30, glow)},${lerp(12, 10, glow)}))`, boxShadow: `0 0 ${50 * glow}px rgba(255,90,30,.8)` }} />
    {Array.from({ length: 4 }, (_, i) => { const ph = (tt * 0.8 + i / 4) % 1; return <svg key={i} width={300} height={60} style={{ position: "absolute", left: 1240, top: 640 - ph * 200, opacity: glow * (1 - ph) }}><path d={`M0,30 Q37,${10 + 20 * Math.sin(tt * 4)} 75,30 T150,30 T225,30 T300,30`} stroke="rgba(255,160,90,.7)" strokeWidth={5} fill="none" /></svg>; })}
    {[0, 1].map((s) => <div key={s} style={{ position: "absolute", left: (s ? 1050 : 380) + (s ? 300 : -300) * (1 - mitt), top: 560 + (s ? 60 : 0), width: 260, height: 220, borderRadius: "110px 110px 40px 40px", background: "repeating-linear-gradient(45deg,#d8362a 0 22px,#b82a20 22px 44px)", boxShadow: "0 20px 40px rgba(0,0,0,.45), inset 0 -40px 0 #f4ead4", transform: `rotate(${s ? 20 : -20}deg)`, opacity: mitt }}>
      <div style={{ position: "absolute", left: s ? 190 : -20, top: 40, width: 90, height: 120, borderRadius: 45, background: "repeating-linear-gradient(45deg,#d8362a 0 22px,#b82a20 22px 44px)" }} />
    </div>)}
    <div style={{ position: "absolute", left: 1420, top: 200, width: 300, height: 300, perspective: 900 }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotateY(${180 - 180 * sign}deg) rotate(45deg)`, background: "#f6c814", border: "12px solid #111", borderRadius: 20, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%) rotate(-45deg)", fontFamily: SANS, fontWeight: 900, fontSize: 80, color: "#111" }}>400°</div>
      </div>
    </div>
    <Tag tt={tt} at={2.4} x={760} y={970} txt="BOTH HANDS" size={58} col={K.goldL} />
  </>;
}}</Stage>;

// E18 · dulce y salado: un plato con el símbolo yin-yang hecho de jarabe de arce y sal gruesa, que gira y se completa
export const E18YinYang: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const draw = eio(tt, 0.4, 2.0), spin = tt * 20;
  return <>
    <Shadow x={960} y={900} w={720} k={1} />
    <div style={{ position: "absolute", left: 960 - 330, top: 240, width: 660, height: 660, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%,#ffffff,#f1ece2 60%,#d8cfbe)", boxShadow: "0 40px 80px rgba(0,0,0,.55), inset 0 0 0 26px #f7f3ec, inset 0 0 0 30px #8a9ac8" }}>
      <svg width={660} height={660} style={{ position: "absolute", inset: 0, transform: `rotate(${spin}deg)` }}>
        <defs><clipPath id="yy"><path d={`M330,330 L330,90 A240,240 0 ${draw > 0.5 ? 1 : 0} 1 ${330 + 240 * Math.sin(draw * 2 * Math.PI)},${330 - 240 * Math.cos(draw * 2 * Math.PI)} Z`} /></clipPath>
          <pattern id="salt" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#fbfbf6" /><rect x="3" y="4" width="6" height="5" fill="#e4e4dc" transform="rotate(20 6 6)" /><rect x="11" y="11" width="5" height="4" fill="#dcdcd2" /></pattern>
          <radialGradient id="syr" cx=".4" cy=".35"><stop offset="0" stopColor="#e8a24a" /><stop offset=".6" stopColor="#a8541a" /><stop offset="1" stopColor="#6a2a08" /></radialGradient></defs>
        <g clipPath={draw < 1 ? "url(#yy)" : undefined}>
          <circle cx={330} cy={330} r={240} fill="url(#salt)" />
          <path d="M330,90 A240,240 0 0 1 330,570 A120,120 0 0 1 330,330 A120,120 0 0 0 330,90 Z" fill="url(#syr)" />
          <circle cx={330} cy={210} r={36} fill="url(#syr)" />
          <circle cx={330} cy={450} r={36} fill="url(#salt)" />
        </g>
        <path d="M300,140 Q340,130 360,160" stroke="rgba(255,240,200,.7)" strokeWidth={8} fill="none" strokeLinecap="round" opacity={draw} />
      </svg>
    </div>
    <Tag tt={tt} at={1.4} x={400} y={420} txt="SWEET" size={64} col={K.goldL} />
    <Tag tt={tt} at={1.8} x={1520} y={420} txt="SALTY" size={64} col={K.tx} />
    <Tag tt={tt} at={2.8} x={960} y={990} txt="Walter ate half of mine" size={52} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// E20 · la mesa para uno: un solo lugar puesto, la vela se enciende sola y la llama tiembla; nada falta
export const E20TableForOne: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise" tone="night">{(tt) => {
  const set = (i: number) => cl(phys(tt, 0.3 + i * 0.3, 6, 0.5)), fl = eio(tt, 1.8, 2.2), fk = 1 + 0.08 * Math.sin(tt * 13) + 0.05 * Math.sin(tt * 7);
  return <>
    <div style={{ position: "absolute", left: 960 - 800, top: 380, width: 1600, height: 900, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 30%,rgba(255,200,120,${0.35 * fl}),rgba(0,0,0,0) 60%)` }} />
    <div style={{ position: "absolute", left: 960 - 640, top: 600, width: 1280, height: 420, transform: "perspective(1200px) rotateX(50deg)", transformOrigin: "50% 0", background: "radial-gradient(ellipse,#f4e8d0,#d8c8a8)", borderRadius: 30, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 960 - 190, top: 640 + (1 - set(0)) * -300, width: 380, height: 160, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%,#ffffff,#ece6d8 60%,#c8b890)", boxShadow: "0 10px 20px rgba(0,0,0,.3), inset 0 0 0 16px #f7f3ec, inset 0 0 0 19px #c9a24a" }}>
      <div style={{ position: "absolute", left: 120, top: 40, width: 140, height: 70, borderRadius: "50%", background: CORN }} />
    </div>
    <div style={{ position: "absolute", left: 960 - 280, top: 650 + (1 - set(1)) * -300, width: 16, height: 150, borderRadius: 8, background: "linear-gradient(90deg,#9aa0a6,#f4f6f8,#80868c)", transform: "rotate(-4deg)" }} />
    <div style={{ position: "absolute", left: 960 + 250, top: 650 + (1 - set(2)) * -300, width: 16, height: 160, borderRadius: 8, background: "linear-gradient(90deg,#9aa0a6,#f4f6f8,#80868c)", transform: "rotate(4deg)" }} />
    {/* la vela */}
    <div style={{ position: "absolute", left: 960 - 22, top: 420, width: 44, height: 200, borderRadius: 6, background: "linear-gradient(90deg,#efe4c8,#fffaf0,#e0d4b4)", opacity: set(3) }} />
    <div style={{ position: "absolute", left: 960 - 22, top: 330, width: 44, height: 90, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(ellipse at 50% 70%,#fff,#ffd060 40%,rgba(255,140,40,0) 75%)", transform: `scale(${fl * fk},${fl * (2 - fk)})`, transformOrigin: "50% 100%", filter: "blur(1px)" }} />
    <div style={{ position: "absolute", left: 960 - 150, top: 230, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,210,120,.35),rgba(255,210,120,0) 70%)", opacity: fl * fk }} />
    <Tag tt={tt} at={2.4} x={960} y={160} txt="nothing wrong with that" size={62} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// E21 · la grilla del waffle desde arriba: cada cuadradito se llena de un charquito de chili, de a uno, en ola
export const E21Waffle: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const N = 7, p = eio(tt, 0.6, D(h) - 1.0) * (N * 2);
  return <>
    <Shadow x={960} y={900} w={760} k={1} />
    <div style={{ position: "absolute", left: 960 - 340, top: 220, width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#ffe7a0,#f0bc54 55%,#c8862a)", boxShadow: "0 40px 80px rgba(0,0,0,.55), inset 0 0 40px rgba(140,80,20,.4)", overflow: "hidden" }}>
      {Array.from({ length: N * N }, (_, i) => { const cx = i % N, cy = Math.floor(i / N), dd = cx + cy, k = cl(p - dd), x = 40 + cx * 88, y = 40 + cy * 88;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 70, height: 70, borderRadius: 8, background: "radial-gradient(circle at 40% 35%,#e8b45a,#c88a34)", boxShadow: "inset 0 8px 12px rgba(120,60,10,.5)" }}>
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 60 * k, height: 60 * k, transform: "translate(-50%,-50%)", borderRadius: "40%", background: "radial-gradient(circle at 40% 35%,#c84a2a,#8a2414 70%)", boxShadow: k > 0.5 ? "inset 0 4px 6px rgba(255,160,120,.4)" : "none" }} />
          {k > 0.9 && (i % 3 === 0) && <div style={{ position: "absolute", left: 20, top: 16, width: 26, height: 10, borderRadius: 5, background: "#f6c84a", transform: `rotate(${rnd(i) * 90}deg)` }} />}
        </div>; })}
    </div>
    <Tag tt={tt} at={1.0} x={1520} y={460} txt="a pool of chili" size={56} font={HAND} col={K.goldL} />
    <Tag tt={tt} at={2.2} x={1520} y={550} txt="IN EVERY SQUARE" size={52} col={K.tx} />
  </>;
}}</Stage>;

// E22 · vuelve del campo: el sombrero de paja vuela y se cuelga en el perchero junto a la puerta; afuera el maizal al atardecer
export const E22Hat: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const fly = eOut(tt, 0.6, 1.6), sw = Math.sin(tt * 5) * 8 * Math.exp(-(tt - 1.6) * 1.6) * (tt > 1.6 ? 1 : 0), door = eio(tt, 0.1, 0.7);
  return <>
    <div style={{ position: "absolute", left: 300, top: 160, width: 520, height: 780, background: "linear-gradient(180deg,#ff9a4a,#f2c05a 50%,#6a8a2a 60%,#3a5a1a)", overflow: "hidden" }}>
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 520, top: 460 + rnd(i + 3) * 300, width: 6, height: 80 + rnd(i) * 60, background: "#c8a83a", transform: `rotate(${(rnd(i + 5) - 0.5) * 20 + 3 * Math.sin(tt * 2 + i)}deg)`, transformOrigin: "50% 100%" }} />)}
      <div style={{ position: "absolute", left: 200, top: 120, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,#fff6c0,#ffb040 60%,rgba(255,150,40,0))" }} />
    </div>
    <div style={{ position: "absolute", left: 300, top: 160, width: 520, height: 780, transformOrigin: "0 50%", transform: `perspective(1400px) rotateY(${-75 * door}deg)`, background: "linear-gradient(90deg,#c9a46a,#e8cc96 40%,#b08a50)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 60, top: 60, width: 400, height: 300, border: "8px solid #a8844a" }} />
      <div style={{ position: "absolute", right: 40, top: 400, width: 30, height: 30, borderRadius: "50%", background: "#6a4a1c" }} />
    </div>
    {/* el perchero */}
    <div style={{ position: "absolute", left: 1150, top: 300, width: 500, height: 40, borderRadius: 8, background: "linear-gradient(180deg,#8a5a2c,#5a3418)" }} />
    {[1220, 1400, 1580].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 330, width: 18, height: 60, borderRadius: 9, background: "#3a2414", transform: "rotate(-20deg)" }} />)}
    <div style={{ position: "absolute", left: 1570, top: 350, width: 120, height: 360, borderRadius: "40px 40px 10px 10px", background: "linear-gradient(90deg,#2a4a8a,#4a6ab0,#1a3a7a)", opacity: 0.9 }} />
    <div style={{ position: "absolute", left: lerp(700, 1300, fly) - 160, top: lerp(500, 300, fly) - Math.sin(fly * Math.PI) * 220, width: 320, height: 140, transform: `rotate(${(1 - fly) * 540 + sw}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", left: 0, top: 70, width: 320, height: 60, borderRadius: "50%", background: "repeating-linear-gradient(90deg,#e8c87a 0 8px,#d0aa58 8px 14px)" }} />
      <div style={{ position: "absolute", left: 80, top: 0, width: 160, height: 100, borderRadius: "80px 80px 20px 20px", background: "repeating-linear-gradient(0deg,#e8c87a 0 8px,#d0aa58 8px 14px)" }} />
      <div style={{ position: "absolute", left: 80, top: 70, width: 160, height: 18, background: "#7a2a1a" }} />
    </div>
    <Tag tt={tt} at={1.8} x={1400} y={820} txt="in from the field" size={60} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// E23 · el marco de la puerta con las rayitas de altura: la marca sube de «Loretta, 6» a la de hoy y vuelve a bajar a la de 6
export const E23Doorframe: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const M: [string, number][] = [["Loretta · 6", 0.3], ["8", 0.42], ["11", 0.56], ["14", 0.7], ["Walter · 1964", 0.86]], sh = eio(tt, 0.4, 2.4), back = eio(tt, 2.8, 3.8);
  const cur = lerp(lerp(0.3, 0.86, sh), 0.3, back);
  return <>
    <div style={{ position: "absolute", left: 760, top: 80, width: 180, height: 1000, background: "linear-gradient(90deg,#f4ecd8,#fffaf0 40%,#e0d4b8)", boxShadow: "inset -10px 0 20px rgba(0,0,0,.15), 0 0 0 4px #c8b48a" }}>
      {M.map(([s, y], i) => { const yy = 1000 - y * 1000, vis = cl((sh * 5) - i + 0.3); return <React.Fragment key={s}>
        <div style={{ position: "absolute", left: 0, top: yy, width: 120 * vis, height: 4, background: "#3a2a1a" }} />
        <div style={{ position: "absolute", left: 20, top: yy - 44, fontFamily: HAND, fontSize: 40, color: "#3a2a5a", whiteSpace: "nowrap", opacity: vis, transform: "rotate(-3deg)" }}>{s}</div>
      </React.Fragment>; })}
    </div>
    <div style={{ position: "absolute", left: 960, top: 1000 - cur * 1000 - 3, width: 420, height: 6, background: K.red, boxShadow: `0 0 20px ${K.red}` }} />
    <div style={{ position: "absolute", left: 1020, top: 1000 - cur * 1000 - 120, fontFamily: SANS, fontWeight: 900, fontSize: 100, color: K.goldL }}>{Math.round(lerp(6, 25, (cur - 0.3) / 0.56))}</div>
    {/* el lápiz que marca */}
    <div style={{ position: "absolute", left: 880, top: 1000 - cur * 1000 - 20, width: 180, height: 26, transform: "rotate(-14deg)", transformOrigin: "0 50%" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, borderTop: "13px solid transparent", borderBottom: "13px solid transparent", borderRight: "26px solid #e8c89a" }} />
      <div style={{ position: "absolute", left: 26, top: 0, width: 154, height: 26, background: "linear-gradient(180deg,#f6c814,#d8a800)" }} />
    </div>
    <Tag tt={tt} at={3.8} x={1500} y={500} txt="sitting next to him" size={54} font={HAND} col={K.tx} />
  </>;
}}</Stage>;

// E24 · la mala palabra: la bolsa de azúcar entra y una barra negra de censura le tapa el rótulo con un «S★★★R»
export const E24Censor: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const bag = phys(tt, 0.2, 6, 0.5), bar = cl(phys(tt, 1.2, 9, 0.35)), no = eio(tt, 2.4, 3.0);
  return <>
    <Shadow x={820} y={900} w={460} k={1} />
    <div style={{ position: "absolute", left: 820 - 200, top: 330 + (1 - cl(bag)) * -500, width: 400, height: 560, borderRadius: "30px 30px 40px 40px", background: "linear-gradient(90deg,#e8e4dc,#ffffff 40%,#d0cabe)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", transform: `rotate(${-3 + 3 * Math.sin(tt * 1.2)}deg)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, borderRadius: "30px 30px 0 0", background: "repeating-linear-gradient(90deg,#d8d2c6 0 12px,#f4f0ea 12px 24px)" }} />
      <div style={{ position: "absolute", left: 30, right: 30, top: 150, textAlign: "center", fontFamily: SERIF, fontSize: 100, color: "#1f4fa0", letterSpacing: 4 }}>SUGAR</div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 270, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#1f4fa0" }}>PURE CANE · 5 LB</div>
      <div style={{ position: "absolute", left: 10, top: 155, width: 380 * bar, height: 110, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#fff", letterSpacing: 6, overflow: "hidden" }}>{bar > 0.9 ? "S★★★R" : ""}</div>
    </div>
    {/* el dedo que dice que no */}
    <div style={{ position: "absolute", left: 1320, top: 360, width: 140, height: 360, transform: `rotate(${18 * Math.sin(tt * 7) * no}deg)`, transformOrigin: "50% 100%", opacity: no }}>
      <div style={{ position: "absolute", left: 40, top: 0, width: 60, height: 220, borderRadius: 30, background: "radial-gradient(ellipse at 40% 30%,#f4cdb4,#d8a488 70%)" }} />
      <div style={{ position: "absolute", left: 0, top: 180, width: 140, height: 180, borderRadius: "50px 50px 30px 30px", background: "radial-gradient(ellipse at 40% 30%,#f4cdb4,#c89478 70%)" }} />
    </div>
    <Tag tt={tt} at={2.6} x={1400} y={820} txt="never in her cornbread" size={52} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// E26 · la sartén colgada del clavo se hamaca; en su fondo aparecen anillos como de tronco, una capa de curado por década
export const E26Rings: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sw = Math.sin(tt * 2.2) * 9 * Math.exp(-tt * 0.35), rg = eio(tt, 0.8, D(h) - 1.2), yr = Math.round(lerp(1938, 2026, rg));
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "repeating-linear-gradient(90deg,#efe2c4 0 120px,#e6d6b2 120px 124px)", opacity: 0.25 }} />
    <div style={{ position: "absolute", left: 960 - 12, top: 120, width: 24, height: 24, borderRadius: "50%", background: "#444", boxShadow: "0 4px 6px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 960 - 280, top: 130, width: 560, height: 860, transformOrigin: "50% 0", transform: `rotate(${sw}deg)` }}>
      <div style={{ position: "absolute", left: 240, top: 0, width: 80, height: 300, borderRadius: 40, background: "linear-gradient(90deg,#1a1918,#3a3734,#0e0d0c)" }}>
        <div style={{ position: "absolute", left: 22, top: 10, width: 36, height: 36, borderRadius: "50%", background: "#efe2c4" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 280, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#3a3836,#161514 60%,#050505)", boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 60 + i * 52, height: 60 + i * 52, transform: "translate(-50%,-50%)", borderRadius: "50%", border: `3px solid rgba(${190 - i * 8},${150 - i * 8},${90 - i * 5},${0.6 * cl(rg * 9 - i)})` }} />)}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontFamily: SANS, fontWeight: 900, fontSize: 90, color: K.goldL, textShadow: "0 4px 10px rgba(0,0,0,.6)" }}>{yr}</div>
      </div>
    </div>
    <Tag tt={tt} at={2.0} x={1520} y={600} txt="older than I am" size={60} font={HAND} col={K.goldL} />
    <Tag tt={tt} at={2.8} x={1520} y={690} txt="NO SOAP · EVER" size={50} col={K.tx} />
  </>;
}}</Stage>;

// E27 · la gelatina tiembla con física de resorte, la tachan y en su lugar se desliza el tamale pie humeante
export const E27Jello: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const land = cl(phys(tt, 0.2, 5, 0.5)), wob = Math.sin(tt * 14) * Math.exp(-(tt - 0.8) * 1.2) * (tt > 0.8 ? 1 : 0), x2 = eio(tt, 1.8, 2.3), sw = eio(tt, 2.6, 3.4);
  return <>
    <Shadow x={960} y={880} w={620} k={1} />
    <div style={{ position: "absolute", left: 960 - 300, top: 820, width: 600, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,#ffffff,#d8d2c6)" }} />
    <div style={{ position: "absolute", left: 960 - 200 - 900 * sw, top: 520 - (1 - land) * 500, width: 400, height: 320, transformOrigin: "50% 100%", transform: `scale(${1 + 0.08 * wob},${1 - 0.1 * wob}) skewX(${wob * 6}deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "40% 40% 20px 20px / 30% 30% 20px 20px", background: "radial-gradient(ellipse at 35% 25%,rgba(220,255,200,.95),rgba(80,200,90,.85) 45%,rgba(30,130,50,.9))", boxShadow: "inset -20px -20px 40px rgba(0,60,10,.4), inset 20px 20px 40px rgba(255,255,255,.4)" }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 50 + i * 80, top: 0, width: 50, height: 320, background: "rgba(255,255,255,.12)", borderRadius: 20 }} />)}
        {Array.from({ length: 6 }, (_, i) => <div key={"f" + i} style={{ position: "absolute", left: 60 + rnd(i) * 260, top: 80 + rnd(i + 4) * 180, width: 30, height: 22, borderRadius: "40%", background: "rgba(255,200,120,.8)" }} />)}
      </div>
      <svg width={440} height={360} style={{ position: "absolute", left: -20, top: -20 }}><path d="M40,40 L400,320" stroke={K.red} strokeWidth={22} strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520 - 520 * x2} /><path d="M400,40 L40,320" stroke={K.red} strokeWidth={22} strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520 - 520 * cl(x2 * 2 - 1)} /></svg>
    </div>
    {/* el tamale pie que entra */}
    <div style={{ position: "absolute", left: 960 - 160 + 900 * (1 - sw), top: 0, opacity: cl(sw * 3) }}>
      <Skillet x={0} y={720} w={420} fill="radial-gradient(ellipse at 40% 30%,#ffd880,#e8a840 50%,#c86a20 80%,#8a3a10)" />
      {Array.from({ length: 4 }, (_, i) => { const ph = (tt * 0.6 + i / 4) % 1; return <div key={i} style={{ position: "absolute", left: 40 + i * 70, top: 560 - ph * 220, width: 50, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.22)", filter: "blur(12px)", opacity: (1 - ph) * sw }} />; })}
    </div>
    <Tag tt={tt} at={3.2} x={960} y={300} txt="NOT A CRUMB LEFT" size={60} col={K.goldL} />
  </>;
}}</Stage>;

// E28 · la perilla de amplificador «CUMIN»: Dolores la gira de 1 a 10… y la pasa a 11; la lata de comino sacude una nube dorada
export const E28Knob: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise" tone="night">{(tt) => {
  const p = eio(tt, 0.5, 2.6), over = eio(tt, 2.8, 3.4), v = lerp(1, 10, p) + over, ang = -135 + (v - 1) * 27;
  return <>
    <div style={{ position: "absolute", left: 960 - 560, top: 280, width: 1120, height: 560, borderRadius: 20, background: "linear-gradient(180deg,#2a2622,#141210)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 8px #c9a24a" }}>
      <div style={{ position: "absolute", left: 40, top: 30, fontFamily: SERIF, fontSize: 44, color: K.goldL }}>Dolores · Model 1983</div>
      {Array.from({ length: 11 }, (_, i) => { const a = -135 + i * 27; return <div key={i} style={{ position: "absolute", left: 560 - 20, top: 300 - 20, width: 40, height: 40, transform: `rotate(${a}deg) translateY(-200px) rotate(${-a}deg)`, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 36, color: i === 10 ? K.red : "#efe6d0", opacity: i === 10 ? over : 1 }}>{i + 1}</div>; })}
      <div style={{ position: "absolute", left: 560 - 140, top: 300 - 140, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle at 40% 32%,#e8e4da,#9a948a 60%,#5a554e)", boxShadow: "0 20px 40px rgba(0,0,0,.6)", transform: `rotate(${ang}deg)` }}>
        {Array.from({ length: 24 }, (_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: 0, width: 4, height: 18, marginLeft: -2, background: "rgba(0,0,0,.3)", transformOrigin: "50% 140px", transform: `rotate(${i * 15}deg)` }} />)}
        <div style={{ position: "absolute", left: "50%", top: 20, width: 12, height: 70, marginLeft: -6, borderRadius: 6, background: K.red }} />
      </div>
      <div style={{ position: "absolute", left: 560 - 80, top: 470, width: 160, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 36, color: "#efe6d0", letterSpacing: 6 }}>CUMIN</div>
    </div>
    {/* la lata de comino y su nube */}
    <div style={{ position: "absolute", left: 1500, top: 420 + 20 * Math.abs(Math.sin(tt * 8)) * over, width: 140, height: 200, borderRadius: 14, background: "linear-gradient(90deg,#8a5a1c,#e8b45a 40%,#7a4a10)", transform: `rotate(${-30 * over}deg)` }}>
      <div style={{ position: "absolute", left: 10, top: 70, right: 10, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 28, color: "#3a1a00" }}>CUMIN</div>
    </div>
    {over > 0 && Array.from({ length: 26 }, (_, i) => { const ph = cl((tt - 2.9 - rnd(i) * 0.4) / 1.2); return <div key={i} style={{ position: "absolute", left: 1480 - ph * 200 * rnd(i + 2), top: 420 + ph * 200 * (rnd(i + 5) - 0.3), width: 14, height: 14, borderRadius: "50%", background: "rgba(200,140,60,.7)", filter: "blur(3px)", opacity: 1 - ph }} />; })}
    <Tag tt={tt} at={3.2} x={960} y={960} txt="always more cumin" size={60} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// E29 · el rollo de entradas de cine: se cortan dos «ADMIT ONE» por la línea de puntos: TONIGHT y TOMORROW
export const E29Tickets: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const T = ["TONIGHT", "TOMORROW"];
  return <>
    <div style={{ position: "absolute", left: 220, top: 400, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle,#3a1a1a 30%,#c8384a 32%,#a82a3a 80%)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", transform: `rotate(${-tt * 40}deg)` }} />
    {T.map((s, i) => { const a = 0.6 + i * 1.3, pull = eOut(tt, a, a + 0.6), tear = eio(tt, a + 0.6, a + 0.9), fly = eOut(tt, a + 0.9, a + 1.6);
      const x = 470 + i * 0 + pull * 420 + fly * (i ? 260 : -40), y = 440 - fly * (i ? -40 : 220) + i * 0;
      return <div key={s} style={{ position: "absolute", left: x, top: y + (i ? 260 : 0) * fly, width: 400, height: 180, transform: `rotate(${fly * (i ? 6 : -8)}deg)`, opacity: tt > a ? 1 : 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "#c8384a", borderRadius: 10, boxShadow: "0 16px 30px rgba(0,0,0,.45)", WebkitMask: "radial-gradient(circle at 0 50%,transparent 22px,#000 23px) left/51% 100% no-repeat, radial-gradient(circle at 100% 50%,transparent 22px,#000 23px) right/51% 100% no-repeat", mask: "radial-gradient(circle at 0 50%,transparent 22px,#000 23px) left/51% 100% no-repeat, radial-gradient(circle at 100% 50%,transparent 22px,#000 23px) right/51% 100% no-repeat" }}>
          <div style={{ position: "absolute", inset: 14, border: "3px dashed rgba(255,240,210,.7)", borderRadius: 6 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 40, letterSpacing: 6, color: "#fff4d6" }}>ADMIT ONE</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 86, textAlign: "center", fontFamily: SERIF, fontSize: 56, color: "#fff" }}>{s}</div>
        </div>
        <div style={{ position: "absolute", left: -6, top: 0, width: 6, height: 180, background: "repeating-linear-gradient(180deg,#fff4d6 0 8px,transparent 8px 16px)", opacity: 1 - tear }} />
      </div>; })}
    <Tag tt={tt} at={3.6} x={1300} y={300} txt="ONE SKILLET · TWO SUPPERS" size={54} col={K.goldL} />
  </>;
}}</Stage>;

// E30 · la caja registradora antigua de la ferretería: se aprietan las teclas, suben las banderitas «$8.00» y se abre el cajón
export const E30Register: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const keys = [0.6, 0.9, 1.2], flag = eio(tt, 1.5, 2.0), drawer = eOut(tt, 2.0, 2.5);
  return <>
    <Shadow x={900} y={920} w={760} k={1} />
    <div style={{ position: "absolute", left: 900 - 340, top: 780, width: 680, height: 110 + 0, transform: `translateY(${drawer * 60}px)`, background: "linear-gradient(180deg,#b88a3a,#7a5418)", borderRadius: 10, boxShadow: "0 20px 30px rgba(0,0,0,.5)" }}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 40 + i * 160, top: 14, width: 140, height: 60, borderRadius: 6, background: "#4a3410", opacity: drawer }} />)}
      <div style={{ position: "absolute", left: 300, top: 70, width: 80, height: 14, borderRadius: 7, background: "#f4d68a" }} />
    </div>
    <div style={{ position: "absolute", left: 900 - 360, top: 380, width: 720, height: 420, borderRadius: "40px 40px 10px 10px", background: "linear-gradient(160deg,#e8c87a,#b88a3a 40%,#8a6020)", boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 0 0 10px rgba(255,240,200,.35)" }}>
      {Array.from({ length: 3 }, (_, r2) => Array.from({ length: 6 }, (_, c) => { const i = r2 * 6 + c, kk = keys.findIndex((k, j) => [3, 10, 14][j] === i), pr = kk >= 0 ? Math.max(0, 1 - Math.abs(tt - keys[kk] - 0.08) * 8) : 0;
        return <div key={i} style={{ position: "absolute", left: 60 + c * 104, top: 190 + r2 * 72 + pr * 10, width: 76, height: 56, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fffaf0,#d8ccb0)", boxShadow: `0 ${8 - pr * 6}px 0 #6a4a1c`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 24, color: "#3a2a10" }}>{[5, 1, 0, 8, 2, 4][c] * (r2 + 1)}</div>; }))}
    </div>
    {/* las banderitas */}
    <div style={{ position: "absolute", left: 900 - 220, top: 330 - 120 * flag, width: 440, height: 130, display: "flex", gap: 10, justifyContent: "center" }}>
      {["$", "8", ".", "0", "0"].map((c, i) => <div key={i} style={{ width: 76, height: 120, background: "#fbf6ea", border: "4px solid #3a2a10", borderRadius: 6, fontFamily: SANS, fontWeight: 900, fontSize: 80, color: K.wine, textAlign: "center", lineHeight: "116px", transform: `translateY(${(1 - cl(flag * 2 - i * 0.2)) * 60}px)` }}>{c}</div>)}
    </div>
    <div style={{ position: "absolute", left: 900 - 260, top: 200, width: 520, height: 140, background: "linear-gradient(180deg,#2a2a2a,#111)", borderRadius: 10, opacity: 1 - flag * 0.0 }} />
    <Tag tt={tt} at={2.4} x={1530} y={520} txt="6-INCH SKILLET" size={52} col={K.tx} />
    <Tag tt={tt} at={3.0} x={1530} y={610} txt="it'll outlive you" size={58} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// E32 · el mazo de cartas: se abre en abanico, se cierra, y el cuadrado de pan de maíz cae encima: mismo tamaño
export const E32Cards: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = r(h, 0), fan = eio(tt, 0.4, 1.6) * (1 - eio(tt, a - 1.2, a - 0.5)), drop = cl(phys(tt, a - 0.4, 7, 0.5)), third = eio(tt, a + 0.4, a + 1.0);
  return <>
    <Shadow x={860} y={880} w={460} k={1} />
    {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ position: "absolute", left: 860 - 130, top: 460, width: 260, height: 370, borderRadius: 18, background: "#fbfaf4", boxShadow: "0 6px 12px rgba(0,0,0,.35)", transformOrigin: "50% 120%", transform: `rotate(${(i - 6) * 9 * fan}deg)`, border: "3px solid #ddd" }}>
      <div style={{ position: "absolute", left: 16, top: 10, fontFamily: SERIF, fontSize: 44, color: i % 2 ? K.red : "#111" }}>{["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"][i]}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontSize: 110, color: i % 2 ? K.red : "#111" }}>{i % 2 ? "♥" : "♠"}</div>
    </div>)}
    <div style={{ position: "absolute", left: 860 - 130, top: 460 - (1 - drop) * 500, width: 260, height: 370, borderRadius: 14, background: CORN, boxShadow: "0 16px 30px rgba(0,0,0,.45), inset 0 -16px 30px rgba(140,80,20,.4)", opacity: tt > a - 0.4 ? 1 : 0 }} />
    {/* tres cuadraditos, el tercero tachado */}
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1260 + i * 150, top: 520, width: 120, height: 120, borderRadius: 10, background: CORN, opacity: cl((tt - a) * 3), boxShadow: "0 8px 14px rgba(0,0,0,.35)" }}>
      {i === 2 && <svg width={140} height={140} style={{ position: "absolute", left: -10, top: -10 }}><circle cx={70} cy={70} r={60} stroke={K.red} strokeWidth={12} fill="none" strokeDasharray="380" strokeDashoffset={380 - 380 * third} /><path d="M28,28 L112,112" stroke={K.red} strokeWidth={12} strokeDasharray="120" strokeDashoffset={120 - 120 * third} /></svg>}
    </div>)}
    <Tag tt={tt} at={a + 0.6} x={1410} y={720} txt="it's the third piece" size={54} font={HAND} col={K.goldL} />
  </>;
}}</Stage>;

// E33 · el pastillero semanal: siete tapitas S M T W T F S se abren de a una y adentro está cada cena del video
export const E33Pills: React.FC<CP> = ({ t, h }) => <Stage t={t} h={h} mode="rise">{(tt) => {
  const L = ["CHILI-TOP", "BEANS", "SAUSAGE", "DRESSING", "WAFFLE", "MILK", "TAMALE"], DY = ["S", "M", "T", "W", "T", "F", "S"], st = Math.max(0.8, (D(h) - 1.6) / 7);
  return <>
    <Shadow x={960} y={820} w={1300} k={1} />
    <div style={{ position: "absolute", left: 960 - 680, top: 520, width: 1360, height: 260, borderRadius: 30, background: "linear-gradient(180deg,rgba(120,180,240,.55),rgba(60,120,200,.75))", boxShadow: "0 30px 60px rgba(0,0,0,.5), inset 0 0 0 4px rgba(255,255,255,.5)" }} />
    {L.map((n, i) => { const k = eio(tt, 0.5 + i * st, 0.5 + i * st + 0.45), x = 960 - 650 + i * 190;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x, top: 545, width: 170, height: 210, borderRadius: 18, background: "radial-gradient(ellipse at 50% 30%,#fffaf0,#efe0c0)", boxShadow: "inset 0 10px 20px rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ width: 90, height: 70, borderRadius: "50%", background: [CORN, "radial-gradient(#d8b07a,#a8784a)", "radial-gradient(#e8a07a,#a85a3a)", "radial-gradient(#d8b880,#a8844a)", "repeating-linear-gradient(90deg,#f0bc54 0 14px,#c8862a 14px 18px)", "radial-gradient(#fffaf0,#e8dcc0)", "radial-gradient(#ffd880,#c86a20)"][i], transform: `scale(${k})` }} />
          <div style={{ marginTop: 12, fontFamily: SANS, fontWeight: 900, fontSize: 24, color: K.ink, opacity: k }}>{n}</div>
        </div>
        <div style={{ position: "absolute", left: x - 6, top: 545 - 20, width: 182, height: 230, transformOrigin: "50% 0", transform: `perspective(900px) rotateX(${110 * k}deg)`, borderRadius: 18, background: "linear-gradient(180deg,rgba(150,200,250,.85),rgba(80,140,220,.9))", boxShadow: "0 6px 12px rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 70, color: "#fff", backfaceVisibility: "hidden" }}>{DY[i]}</div>
      </React.Fragment>; })}
    <Tag tt={tt} at={0.4} x={960} y={360} txt="ONE BOX · SEVEN SUPPERS" size={60} col={K.goldL} />
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


export const K01: React.FC<CPk> = (p) => <Foto {...p} id="k01" fx={0.5} fy={0.55} z={1.32} word="DARK AT FIVE" wx={960} wy={950} mode="iris"  />;
export const K02: React.FC<CPk> = (p) => <Foto {...p} id="k02" fx={0.5} fy={0.55} z={1.45} word="BIG SHEET PANS" wx={960} wy={180} mode="wipe"  />;
export const K03: React.FC<CPk> = (p) => <Foto {...p} id="k03" fx={0.5} fy={0.55} z={1.38} word="SIX-INCH SKILLET" wx={960} wy={950} mode="rise"  />;
export const K04: React.FC<CPk> = (p) => <Foto {...p} id="k04" fx={0.5} fy={0.55} z={1.32} word="DOLORES" wx={960} wy={180} mode="blinds"  />;
export const K05: React.FC<CPk> = (p) => <Foto {...p} id="k05" fx={0.5} fy={0.55} z={1.45} word="60 CENTS" wx={960} wy={950} mode="drop" fx2={(tt) => Coins(tt, 1.2, 420, 880, 9)} />;
export const K06: React.FC<CPk> = (p) => <Foto {...p} id="k06" fx={0.5} fy={0.55} z={1.38} word="ONE BOX, TWO SUPPERS" wx={960} wy={180} mode="split"  />;
export const K07: React.FC<CPk> = (p) => <Foto {...p} id="k07" fx={0.5} fy={0.55} z={1.32} word="SMOKING HOT" wx={960} wy={950} mode="iris"  />;
export const K08: React.FC<CPk> = (p) => <Foto {...p} id="k08" fx={0.5} fy={0.55} z={1.45} word="15 STROKES, THEN STOP" wx={960} wy={180} mode="wipe"  />;
export const K09: React.FC<CPk> = (p) => <Foto {...p} id="k09" fx={0.5} fy={0.55} z={1.38} word="HARD AS A BRICK" wx={960} wy={950} mode="rise"  />;
export const K10: React.FC<CPk> = (p) => <Foto {...p} id="k10" fx={0.5} fy={0.55} z={1.32} word="BACON GREASE" wx={960} wy={180} mode="blinds"  />;
export const K12: React.FC<CPk> = (p) => <Foto {...p} id="k12" fx={0.5} fy={0.55} z={1.45} word="BEAT IT WITH A FORK" wx={960} wy={950} mode="drop"  />;
export const K13: React.FC<CPk> = (p) => <Foto {...p} id="k13" fx={0.5} fy={0.55} z={1.38} word="A HOCKEY PUCK" wx={960} wy={180} mode="split" fx2={(tt) => Lluvia(tt, 0.3, 960, 100, 760, "rgba(230,245,255,.85)", 46, 7)} />;
export const K14: React.FC<CPk> = (p) => <Foto {...p} id="k14" fx={0.5} fy={0.55} z={1.32} word="COMES OUT CLEAN" wx={960} wy={950} mode="iris" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K17: React.FC<CPk> = (p) => <><Foto {...p} id="k17" fx={0.5} fy={0.55} z={1.45} word="400 DEGREES" wx={960} wy={180} mode="wipe"  /><Rodillo tt={p.t - p.h.at} d={p.h.out - p.h.at} a={0.7} b={3.2} v={400} x={1500} y={800} size={150} /></>;
export const K18: React.FC<CPk> = (p) => <Foto {...p} id="k18" fx={0.5} fy={0.55} z={1.38} word="SWEET AND SALTY" wx={960} wy={950} mode="rise"  />;
export const K20: React.FC<CPk> = (p) => <Foto {...p} id="k20" fx={0.5} fy={0.55} z={1.32} word="SUPPER FOR ONE" wx={960} wy={180} mode="blinds"  />;
export const K21: React.FC<CPk> = (p) => <Foto {...p} id="k21" fx={0.5} fy={0.55} z={1.45} word="LITTLE POOLS OF CHILI" wx={960} wy={950} mode="drop" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K22: React.FC<CPk> = (p) => <Foto {...p} id="k22" fx={0.5} fy={0.55} z={1.38} word="IN FROM THE FIELD" wx={960} wy={180} mode="split"  />;
export const K23: React.FC<CPk> = (p) => <Foto {...p} id="k23" fx={0.5} fy={0.55} z={1.32} word="SIX YEARS OLD" wx={960} wy={950} mode="iris"  />;
export const K24: React.FC<CPk> = (p) => <Foto {...p} id="k24" fx={0.5} fy={0.55} z={1.45} word="NO SUGAR" wx={960} wy={180} mode="wipe"  />;
export const K26: React.FC<CPk> = (p) => <Foto {...p} id="k26" fx={0.5} fy={0.55} z={1.38} word="OLDER THAN I AM" wx={960} wy={950} mode="rise"  />;
export const K27: React.FC<CPk> = (p) => <Foto {...p} id="k27" fx={0.5} fy={0.55} z={1.32} word="NOT A CRUMB LEFT" wx={960} wy={180} mode="blinds" fx2={(tt) => Vapor(tt, 960, 520, 420, 0.9)} />;
export const K28: React.FC<CPk> = (p) => <Foto {...p} id="k28" fx={0.5} fy={0.55} z={1.45} word="YOUR QUESTIONS" wx={960} wy={950} mode="drop" fx2={(tt) => Lluvia(tt, 0.6, 960, 260, 420, "#b8321e", 50, 8)} />;
export const K29: React.FC<CPk> = (p) => <Foto {...p} id="k29" fx={0.5} fy={0.55} z={1.38} word="TWO SUPPERS" wx={960} wy={180} mode="split"  />;
export const K30: React.FC<CPk> = (p) => <Foto {...p} id="k30" fx={0.5} fy={0.55} z={1.32} word="$8 AT THE HARDWARE STORE" wx={960} wy={950} mode="iris"  />;
export const K32: React.FC<CPk> = (p) => <Foto {...p} id="k32" fx={0.5} fy={0.55} z={1.45} word="ONE SQUARE, NOT THREE" wx={960} wy={180} mode="wipe"  />;
export const K33: React.FC<CPk> = (p) => <Foto {...p} id="k33" fx={0.5} fy={0.55} z={1.38} word="SEVEN SUPPERS" wx={960} wy={950} mode="rise"  />;
