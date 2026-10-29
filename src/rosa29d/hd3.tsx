// rosa29d · componentes únicos 21-30. Todo en código, ninguna familia de rosa29a, b ni c.
import React from "react";
import { Stage, cl, eio, AMB } from "./hkit";
import { Big, Tape, Table, Shadow, Steam } from "./rkit";
import { P, sp, pos, TIN } from "./hd1";

// 21 · «Mi madre hacía gelatina de fresa en un molde con forma de corona»: el molde corona se da vuelta en el aire, baja sobre el plato y al levantarse queda la gelatina roja con su brillo
export const Unmold: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#f2e2cc,#d8b898)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), flip = eio(tt, 0.4, 1.4), down = cl(sp(tt, 1.4, 5.5, 0.45)), up = eio(tt, 2.4, 3.4);
  const crown = (fill: string, sh: string) => <svg width={420} height={220}><path d="M 20 200 L 20 80 L 90 140 L 140 30 L 210 120 L 280 30 L 330 140 L 400 80 L 400 200 Z" fill={fill} stroke={sh} strokeWidth={6} strokeLinejoin="round" /></svg>;
  return <>
    <Table y={840} />
    <Shadow x={960} y={840} w={600} s={s} />
    <div style={pos(960, 780, `scale(${s})`, { width: 620, height: 130, borderRadius: "50%", background: "radial-gradient(ellipse,#ffffff 0 56%,#d8d4cc 58%,#f2efe8 72%)" })} />
    {up > 0 && <div style={pos(960, 680, `scale(${s * (0.98 + 0.02 * Math.sin(tt * 18) * Math.exp(-2 * Math.max(0, tt - 3.2)))})`, { width: 420, height: 220, filter: "drop-shadow(0 10px 14px rgba(120,0,20,.4))" })}>
      {crown("rgba(214,40,60,.92)", "#a8102a")}
      <div style={{ position: "absolute", left: 60, top: 100, width: 80, height: 60, borderRadius: "50%", background: "rgba(255,255,255,.55)", filter: "blur(6px)" }} />
    </div>}
    <div style={pos(960, 680 - 420 * (1 - down) - 600 * up, `scale(${s}) rotate(${180 - 180 * flip}deg)`, { width: 420, height: 220, opacity: 1 - eio(tt, 3.2, 3.6) })}>
      {crown("url(#cr)", "#6f777e")}
      <svg width={0} height={0}><defs><linearGradient id="cr" x1="0" x2="1"><stop offset="0" stopColor="#8e979f" /><stop offset=".5" stopColor="#eef2f5" /><stop offset="1" stopColor="#7a848c" /></linearGradient></defs></svg>
    </div>
    <Big tt={tt} at={3.0} x={960} y={190} txt="PARA LA VISITA" size={96} col="#8a1a2a" />
  </>;
}}</Stage>;

// 22 · «El pan duro de la semana cortado en pedazos adentro, que se ablandaba, y se comía con cuchara»: los cubos de pan caen al tazón de café con leche y cambian de color mientras se hunden
export const Soak: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#2a1c12,#120c08)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6);
  return <>
    <div style={pos(960, 640, `scale(${s})`, { width: 820, height: 560, borderRadius: "0 0 410px 410px / 0 0 400px 400px", overflow: "hidden", background: "linear-gradient(90deg,#e8e2d6,#fbf8f0 40%,#d8d0c0)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" })}>
      <div style={{ position: "absolute", left: 30, top: 40, width: 760, height: 520, borderRadius: "0 0 380px 380px / 0 0 380px 380px", background: "linear-gradient(180deg,#c89a6a,#a8784a)" }}>
        {[0, 1, 2].map((i) => { const a = 0.4 + i * 0.8, f = cl(sp(tt, a, 5, 0.5)), sink = eio(tt, a + 0.4, a + 2.6), y = -200 + 260 * f + 130 * sink;
          return f > 0 ? <div key={i} style={{ position: "absolute", left: 160 + i * 170, top: y, width: 130, height: 110, borderRadius: 14, transform: `rotate(${(i - 1) * 14}deg)`,
            background: `linear-gradient(180deg, rgb(${Math.round(232 - 50 * sink)},${Math.round(200 - 60 * sink)},${Math.round(150 - 60 * sink)}), rgb(${Math.round(200 - 40 * sink)},${Math.round(150 - 40 * sink)},${Math.round(90 - 30 * sink)}))`, boxShadow: `inset 0 0 0 10px rgb(${Math.round(180 - 40 * sink)},${Math.round(120 - 30 * sink)},60)`, opacity: 1 - 0.3 * sink }} /> : null; })}
        <div style={{ position: "absolute", left: 0, top: 120, width: 760, height: 30, background: "linear-gradient(180deg,rgba(255,240,210,.5),transparent)" }} />
      </div>
    </div>
    <Steam tt={tt} x={960} y={380} w={520} h={260} o={0.8} />
    <Big tt={tt} at={2.4} x={960} y={140} txt="SE COMÍA CON CUCHARA" size={84} col={AMB} />
  </>;
}}</Stage>;

// 23 · «El costal de harina de maíz que mi padre traía cada mes era el más grande del almacén»: costales del almacén en fila, de chicos a medianos; el último cae con peso, el doble de grande
export const Sacks: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#e8d8b8,#c0a070)">{(tt) => {
  const S: [number, number][] = [[0.55, 0.3], [0.65, 0.6], [0.6, 0.9], [1.25, 1.8]];
  return <>
    <div style={pos(960, 920, "", { width: 2000, height: 240, background: "repeating-linear-gradient(90deg,#8a6038 0 160px,#7a5030 160px 164px)" })} />
    {S.map(([k, a], i) => { const q = sp(tt, a, i === 3 ? 4.5 : 6, i === 3 ? 0.35 : 0.45), x = 360 + i * 340 + (i === 3 ? 120 : 0), w = 300 * k, hh = 380 * k, y = 820 - hh / 2 - 600 * (1 - cl(q)), sq = i === 3 ? 1 - 0.08 * Math.max(0, Math.sin((tt - 2.1) * 10)) * Math.exp(-3 * Math.max(0, tt - 2.1)) * (tt > 2.1 ? 1 : 0) : 1;
      return <React.Fragment key={i}>
        <Shadow x={x} y={820} w={w + 40} s={cl(q)} />
        <div style={pos(x, y + hh * (1 - sq) / 2, `scaleY(${sq}) scaleX(${2 - sq})`, { width: w, height: hh, borderRadius: `${w * 0.3}px ${w * 0.3}px ${w * 0.18}px ${w * 0.18}px`, background: "repeating-linear-gradient(45deg, rgba(0,0,0,.06) 0 4px, transparent 4px 9px), linear-gradient(90deg,#c8a87a,#ecd8b0 45%,#b8946a)", boxShadow: "0 20px 26px rgba(0,0,0,.35)", opacity: cl(q * 3) })}>
          <div style={{ position: "absolute", left: w * 0.38, top: -14, width: w * 0.24, height: 40, borderRadius: 10, background: "#a8845a" }} />
          {i === 3 && <div style={{ position: "absolute", left: 0, right: 0, top: hh * 0.42, textAlign: "center", fontWeight: 900, fontSize: 56, color: "#8a4a1a", letterSpacing: 4 }}>MAÍZ</div>}
        </div>
      </React.Fragment>; })}
    <Big tt={tt} at={2.6} x={760} y={200} txt="EL MÁS GRANDE" size={96} col="#6b2a14" />
  </>;
}}</Stage>;

// 24 · «El corazón de res es un músculo, pura carne magra, sin grasa, y lleno de hierro»: un imán de herradura baja sobre el corazón y de adentro salen limaduras de hierro que se pegan al imán
export const Magnet: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 55%, #3a1a1a, #100808 75%)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), m = cl(sp(tt, 0.3, 5, 0.5)), pull = eio(tt, 1.2, 3.4);
  return <>
    <div style={pos(960, 700, `scale(${s})`, { width: 420, height: 400 })}>
      <svg width={420} height={400}><path d="M 210 380 C 60 280, 10 180, 50 100 C 90 30, 180 40, 210 100 C 240 40, 330 30, 370 100 C 410 180, 360 280, 210 380 Z" fill="url(#hg)" /><defs><radialGradient id="hg" cx=".4" cy=".35"><stop offset="0" stopColor="#c8504a" /><stop offset=".7" stopColor="#8a2a26" /><stop offset="1" stopColor="#5a1612" /></radialGradient></defs></svg>
      <div style={{ position: "absolute", left: 120, top: 60, width: 60, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.25)", filter: "blur(4px)" }} />
    </div>
    <div style={pos(960, 260 - 300 * (1 - m), "", { width: 320, height: 240 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 320, height: 240, borderRadius: "160px 160px 0 0", border: "60px solid #c8302a", borderBottom: "none", boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: 0, top: 200, width: 60, height: 50, background: "linear-gradient(180deg,#eef2f5,#9aa3aa)" }} /><div style={{ position: "absolute", left: 260, top: 200, width: 60, height: 50, background: "linear-gradient(180deg,#eef2f5,#9aa3aa)" }} />
    </div>
    {Array.from({ length: 60 }, (_, i) => { const sx = 820 + (i * 41) % 280, sy = 620 + (i * 67) % 200, tx = i % 2 ? 990 + (i % 5) * 4 : 830 + (i % 5) * 4, ty = 520 + (i % 7) * 4, k = cl(pull * 1.3 - (i % 10) * 0.03), e = k * k;
      return <div key={i} style={{ position: "absolute", left: sx + (tx - sx) * e, top: sy + (ty - sy) * e, width: 10, height: 3, background: "#b8c0c8", transform: `rotate(${i * 37 + 90 * e}deg)`, opacity: cl(pull * 4) }} />; })}
    <Big tt={tt} at={2.4} x={960} y={950} txt="LLENO DE HIERRO" size={100} col={AMB} />
  </>;
}}</Stage>;

// 25 · «O lo haces muy rápido, a la plancha, o muy lento, en guiso. Nada de punto medio»: un subibaja con la plancha en una punta y la olla en la otra; el apoyo del medio se resquebraja
export const Seesaw: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#f2e6d0,#d0b48a)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), ang = 14 * Math.sin(Math.max(0, tt - 0.4) * 1.8) * (tt > 0.4 ? 1 : 0), crack = eio(tt, 3.0, 3.6);
  return <>
    <Table y={880} />
    <div style={pos(960, 760, `scale(${s})`, { width: 180, height: 200, clipPath: "polygon(50% 0, 100% 100%, 0 100%)", background: "linear-gradient(90deg,#6b4224,#a8743e,#6b4224)" })} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: crack }}><path d="M 960 668 L 948 700 L 972 730 L 950 770 L 966 820" stroke="#2a1a0c" strokeWidth={6} fill="none" /></svg>
    <div style={pos(960, 660, `scale(${s}) rotate(${ang}deg)`, { width: 1300, height: 30 })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1300, height: 30, borderRadius: 15, background: "linear-gradient(180deg,#c99a64,#8a6038)" }} />
      <div style={{ position: "absolute", left: 40, top: -120, width: 260, height: 120, transform: `rotate(${-ang}deg)` }}>
        <div style={{ position: "absolute", left: 0, top: 60, width: 220, height: 60, borderRadius: 10, background: "linear-gradient(180deg,#3a3a3a,#111)" }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 30 + i * 60, top: 20 - 20 * ((tt * 2 + i * 0.3) % 1), width: 14, height: 30, borderRadius: 7, background: "rgba(255,170,60,.8)", opacity: 1 - ((tt * 2 + i * 0.3) % 1) }} />)}
      </div>
      <div style={{ position: "absolute", left: 1000, top: -190, width: 260, height: 190, transform: `rotate(${-ang}deg)` }}>
        <div style={{ position: "absolute", left: 20, top: 40, width: 220, height: 150, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg,#3a3a3a,#6a6a6a,#2a2a2a)" }} />
        <div style={{ position: "absolute", left: 0, top: 30, width: 260, height: 20, borderRadius: 10, background: "#4a4a4a" }} />
      </div>
    </div>
    <Tape txt="RÁPIDO" x={500} y={420 + ang * 6} s={sp(tt, 0.8)} size={40} col="#b33a2c" />
    <Tape txt="LENTO" x={1420} y={420 - ang * 6} s={sp(tt, 1.2)} size={40} />
    <Big tt={tt} at={3.2} x={960} y={160} txt="NADA DE PUNTO MEDIO" size={84} col="#6b2a14" />
  </>;
}}</Stage>;

// 26 · «Mi padre los comía en la fonda de la estación, los sábados»: de noche, el farol de la fonda se mece, pasa un tren con ventanitas encendidas y deja vapor
export const Lantern: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#0e1424,#1e2436 60%,#2a2016)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), sw = 8 * Math.sin(tt * 2.2), tr = eio(tt, 0.6, 4.4);
  return <>
    <div style={pos(960, 900, "", { width: 2000, height: 20, background: "#3a3a3a" })} />
    <div style={{ position: "absolute", left: 2000 - 3600 * tr, top: 690, width: 1500, height: 200 }}>
      {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 300, top: 0, width: 280, height: 190, borderRadius: i === 0 ? "60px 10px 10px 10px" : 10, background: "linear-gradient(180deg,#3a2a24,#1a1210)" }}>
        {[0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", left: 30 + j * 80, top: 40, width: 56, height: 50, background: "#ffcf7a", boxShadow: "0 0 20px #ffb04a" }} />)}
      </div>)}
    </div>
    <Steam tt={tt} x={2000 - 3600 * tr + 120} y={640} w={300} h={260} o={tr > 0.02 && tr < 0.98 ? 0.6 : 0} />
    <div style={pos(700, 520, `scale(${s})`, { width: 620, height: 420, background: "linear-gradient(180deg,#5a3a24,#3a2414)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" })}>
      <div style={{ position: "absolute", left: 60, top: 140, width: 220, height: 160, background: "#ffcf7a", boxShadow: "0 0 50px #ffb04a" }} />
      <div style={{ position: "absolute", left: 360, top: 160, width: 160, height: 260, background: "#2a1a0c" }} />
      <div style={{ position: "absolute", left: -40, top: -70, width: 700, height: 80, background: "#7a2a1a" }} />
    </div>
    <div style={{ position: "absolute", left: 1040, top: 270, width: 0, height: 0, transform: `rotate(${sw}deg)` }}>
      <div style={{ position: "absolute", left: -2, top: 0, width: 4, height: 80, background: "#222" }} />
      <div style={{ position: "absolute", left: -40, top: 80, width: 80, height: 110, borderRadius: "20px 20px 10px 10px", background: "rgba(255,210,120,.95)", boxShadow: "0 0 80px 30px rgba(255,180,80,.45)", border: "6px solid #222" }} />
    </div>
    <Big tt={tt} at={1.6} x={1360} y={180} txt="LA FONDA DE LA ESTACIÓN" size={74} col={AMB} />
  </>;
}}</Stage>;

// 27 · «Una lata, que en mi casa se guardaba para los días malos»: una nubecita de lluvia pasa sobre la mesa; la mano la ve y sube la lata al estante de arriba, al fondo
export const Storm: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#c8ccd2,#8a9098)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), cx = eio(tt, 0.2, 2.0), up = eio(tt, 2.4, 3.8);
  return <>
    <div style={pos(1300, 330, "", { width: 700, height: 26, background: "linear-gradient(180deg,#8a5a34,#4a2a14)", boxShadow: "0 14px 20px rgba(0,0,0,.4)" })} />
    <Table y={860} />
    <div style={pos(700 + 600 * up, 740 - 470 * up, `scale(${s * (1 - 0.15 * up)})`, { width: 200, height: 240, borderRadius: 14, background: TIN, boxShadow: "0 18px 24px rgba(0,0,0,.4)" })}>
      <div style={{ position: "absolute", left: 0, top: 70, width: 200, height: 100, background: "#8a2a1a" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", fontWeight: 900, fontSize: 40, color: "#fbf4e2" }}>CARNE</div>
    </div>
    <div style={pos(300 + 500 * cx, 260, "", { width: 360, height: 160, opacity: cl(tt * 2) })}>
      {[[0, 60, 160], [100, 20, 200], [210, 60, 150]].map(([x, y, d], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: d, height: d * 0.7, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#8a9098,#4a5058)" }} />)}
      {Array.from({ length: 12 }, (_, i) => { const ph = (tt * 2.4 + i * 0.17) % 1; return <div key={i} style={{ position: "absolute", left: 40 + i * 26, top: 160 + 260 * ph, width: 4, height: 30, borderRadius: 2, background: "rgba(200,220,255,.7)", opacity: 1 - ph }} />; })}
    </div>
    <Big tt={tt} at={1.6} x={960} y={140} txt="PARA LOS DÍAS MALOS" size={88} col="#2c3e5a" />
  </>;
}}</Stage>;

// 28 · «En mi casa le decíamos arroz a la cubana, aunque nunca habíamos visto Cuba»: una postal gira en el aire: de un lado la isla con palmeras, del otro el plato de arroz, huevo y plátano; cae el sello
export const Postcard: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#f2e2c4,#d0a870)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), rot = 180 * eio(tt, 1.2, 2.4), stamp = cl(sp(tt, 2.8, 6, 0.4)), front = rot < 90;
  return <>
    <div style={pos(960, 560, `scale(${s}) perspective(1600px) rotateY(${rot}deg) rotate(-4deg)`, { width: 900, height: 580, borderRadius: 16, boxShadow: "0 40px 60px rgba(0,0,0,.4)", background: front ? "linear-gradient(180deg,#5ab8e0,#a8e0f0 55%,#2a8ab0 56%,#1a6a90)" : "#fbf6ea", overflow: "hidden" })}>
      {front ? <>
        <div style={{ position: "absolute", left: 220, top: 300, width: 460, height: 90, borderRadius: "50%", background: "#e8d098" }} />
        {[300, 520].map((x, i) => <div key={x} style={{ position: "absolute", left: x, top: 120 + i * 20, width: 16, height: 200, background: "#8a5a2a", transform: `rotate(${i ? 8 : -6}deg)` }}>
          {[0, 1, 2, 3, 4].map((j) => <div key={j} style={{ position: "absolute", left: -70, top: -20, width: 150, height: 34, borderRadius: "50%", background: "#3a8a3a", transform: `rotate(${j * 72}deg)`, transformOrigin: "50% 100%" }} />)}
        </div>)}
        <div style={{ position: "absolute", left: 640, top: 60, width: 110, height: 110, borderRadius: "50%", background: "#ffe08a", boxShadow: "0 0 40px #ffe08a" }} />
      </> : <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 580, transform: "scaleX(-1)" }}>
        <div style={{ position: "absolute", left: 120, top: 120, width: 520, height: 340, borderRadius: "50%", background: "radial-gradient(ellipse,#ffffff 0 58%,#d8d4cc 60%,#f2efe8 74%)" }}>
          <div style={{ position: "absolute", left: 80, top: 80, width: 220, height: 160, borderRadius: "50%", background: "radial-gradient(circle,#fbf8f0 0 3px,#ece4d2 4px) 0 0/12px 9px" }} />
          <div style={{ position: "absolute", left: 200, top: 100, width: 150, height: 130, borderRadius: "48% 52% 50% 50%", background: "radial-gradient(circle at 50% 50%, #ffb81e 0 24%, #fbf8f0 26%)" }} />
          <div style={{ position: "absolute", left: 340, top: 140, width: 120, height: 80, borderRadius: "50%", background: "linear-gradient(90deg,#c8782a,#e8a848)" }} />
        </div>
        <div style={{ position: "absolute", left: 680, top: 40 - 200 * (1 - stamp), width: 160, height: 190, background: "repeating-linear-gradient(90deg,#c83a2a 0 12px,#fbf6ea 12px 16px)", padding: 10, boxSizing: "border-box", transform: `rotate(${8 - 8 * stamp}deg)`, opacity: cl(stamp * 3) }}>
          <div style={{ width: "100%", height: "100%", background: "#2a8ab0" }} />
        </div>
      </div>}
    </div>
    <Big tt={tt} at={2.0} x={960} y={950} txt="NUNCA HABÍAMOS VISTO CUBA" size={74} col="#6b2a14" />
  </>;
}}</Stage>;

// 29 · «Compro medio kilo de frijoles, un kilo de arroz, un kilo de harina de maíz…»: un ábaco de madera; cada cosa que se nombra corre una cuenta, y al final la suma no llega a diez
export const Abacus: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#efe2c8,#c9a87a)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), n = Math.floor(cl((tt - 0.4) / 3.4) * 12);
  const C = ["#b33a2c", "#e8c048", "#3a7a4a", "#2c5a8a"];
  return <>
    <div style={pos(960, 580, `scale(${s})`, { width: 1100, height: 600, border: "34px solid #7a4a22", borderRadius: 20, background: "#f6ead2", boxShadow: "0 40px 60px rgba(0,0,0,.4)" })}>
      {[0, 1, 2, 3].map((r) => <React.Fragment key={r}>
        <div style={{ position: "absolute", left: 0, top: 70 + r * 130, width: 1032, height: 10, background: "linear-gradient(180deg,#d8b860,#8a6a2a)" }} />
        {[0, 1, 2].map((c) => { const i = r * 3 + c, mv = i < n ? cl(sp(tt, 0.4 + (i / 12) * 3.4, 7, 0.5)) : 0;
          return <div key={c} style={{ position: "absolute", left: 760 + c * 86 - 680 * mv + c * 0, top: 40 + r * 130, width: 80, height: 70, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ffffff66, ${C[r]} 60%)`, boxShadow: "0 6px 8px rgba(0,0,0,.3)" }} />; })}
      </React.Fragment>)}
    </div>
    <Big tt={tt} at={4.2} x={960} y={950} txt="MENOS DE DIEZ DÓLARES" size={88} col="#6b2a14" />
  </>;
}}</Stage>;

// 30 · «En los restaurantes elegantes de Lisboa, de Madrid, de Nueva York, sirven una lata de sardinas en un plato»: el globo terráqueo gira y en cada ciudad se clava una chinche con una latita
export const Globe: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #1a2a40, #070a12 75%)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), spin = 260 * (1 - eio(tt, 0.2, 2.2));
  const PINS: [number, number, number, string][] = [[880, 430, 1.8, "LISBOA"], [960, 450, 2.4, "MADRID"], [620, 420, 3.0, "NUEVA YORK"]];
  return <>
    <div style={pos(840, 560, `scale(${s})`, { width: 640, height: 640, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 35% 30%, #5ab0e0, #1a5a8a 70%, #0a2a4a)", boxShadow: "0 0 80px rgba(90,176,224,.35), inset -60px -40px 80px rgba(0,0,0,.5)" })}>
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: -spin + k * 1280, top: 0, width: 1280, height: 640 }}>
        <div style={{ position: "absolute", left: 120, top: 120, width: 300, height: 260, borderRadius: "40% 60% 50% 50%", background: "#6aa84a" }} />
        <div style={{ position: "absolute", left: 220, top: 380, width: 140, height: 220, borderRadius: "40% 50% 60% 40%", background: "#6aa84a" }} />
        <div style={{ position: "absolute", left: 520, top: 110, width: 220, height: 170, borderRadius: "50% 40% 50% 60%", background: "#7ab85a" }} />
        <div style={{ position: "absolute", left: 560, top: 290, width: 180, height: 240, borderRadius: "50% 50% 60% 40%", background: "#8ab86a" }} />
      </div>)}
    </div>
    {PINS.map(([x, y, a, n], i) => { const q = cl(sp(tt, a, 6, 0.45));
      return <React.Fragment key={n}>
        <div style={pos(x, y - 60 * (1 - q), "", { width: 20, height: 70, opacity: cl(q * 3) })}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 20, height: 20, borderRadius: "50%", background: "#e83a2a" }} />
          <div style={{ position: "absolute", left: 9, top: 18, width: 2, height: 40, background: "#ccc" }} />
        </div>
        <div style={pos(1440, 380 + i * 160, `scale(${q})`, { width: 300, height: 110, borderRadius: 14, background: "linear-gradient(180deg,#e8eef2,#9aa8b4)", boxShadow: "0 14px 20px rgba(0,0,0,.4)" })}>
          {[0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", left: 30 + j * 80, top: 30, width: 70, height: 50, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "linear-gradient(90deg,#8aa0b0,#d8e2ea)" }} />)}
        </div>
        <Tape txt={n} x={1440} y={330 + i * 160} s={q} size={28} rot={-2} />
      </React.Fragment>; })}
    <Big tt={tt} at={3.4} x={840} y={950} txt="PLATO FINO" size={96} col={AMB} />
  </>;
}}</Stage>;
