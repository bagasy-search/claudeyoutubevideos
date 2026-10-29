// rosa29e · componentes únicos 22-31. Todo en código, ninguna familia de rosa29a-d.
import React from "react";
import { Stage, cl, eio, AMB, TX, RED } from "./hkit";
import { Big } from "./rkit";
import { P, sp, pos, PotSide, PotTop, KITCHEN, STEW } from "./he1";

// 22 · «Los cortes baratos, los de la paleta, la falda, el osobuco, el pecho, el morcillo»: lámina de carnicería con la vaca dibujada en tinta; los cortes baratos se pintan de a uno en rojo, el lomo queda tachado
export const CowChart: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#efe6d0,#d6c6a2)">{(tt) => {
  const draw = eio(tt, 0.1, 1.2);
  const zones: [string, string, number][] = [["M 300 200 L 420 170 L 440 330 L 300 340 Z", "PALETA", 1.3], ["M 470 360 L 700 360 L 690 430 L 480 430 Z", "FALDA", 1.9], ["M 300 340 L 440 330 L 470 430 L 320 440 Z", "PECHO", 2.5], ["M 330 460 L 400 460 L 400 560 L 340 560 Z", "OSOBUCO", 3.1], ["M 760 450 L 830 450 L 830 560 L 770 560 Z", "MORCILLO", 3.7]];
  return <>
    <svg width={1100} height={700} style={{ position: "absolute", left: 410, top: 230, overflow: "visible", transform: "scale(1.25)", transformOrigin: "50% 45%" }}>
      <path d="M 180 240 Q 160 160 230 150 L 300 200 L 420 170 Q 600 140 800 180 Q 900 200 920 300 L 900 330 Q 880 440 830 450 L 830 600 L 770 600 L 760 450 Q 600 470 470 440 L 400 460 L 400 600 L 340 600 L 330 460 Q 290 440 300 340 Q 230 330 200 300 Z"
        fill="#fbf4e2" stroke="#3a2414" strokeWidth={6} pathLength={1} strokeDasharray={`${draw} 1`} />
      {zones.map(([d, n, a], i) => { const k = eio(tt, a, a + 0.4), m = d.match(/[\d.]+/g)!.map(Number), cx = (m[0] + m[2] + m[4] + m[6]) / 4, cy = (m[1] + m[3] + m[5] + m[7]) / 4;
        return <g key={i}><path d={d} fill={`rgba(190,40,30,${0.75 * k})`} stroke="#3a2414" strokeWidth={3} />
          <text x={cx} y={cy + 8} textAnchor="middle" fontFamily="Caveat, cursive" fontWeight={700} fontSize={30} fill="#fff6e8" opacity={k} transform={`rotate(${i % 2 ? -4 : 4} ${cx} ${cy})`}>{n.toLowerCase()}</text></g>; })}
      <path d="M 470 200 L 700 200 L 700 290 L 470 290 Z" fill="rgba(120,120,120,.25)" stroke="#3a2414" strokeWidth={3} strokeDasharray="8 6" />
      <text x={585} y={258} textAnchor="middle" fontSize={34} fontWeight={900} fill="#5a4a3a">LOMO</text>
      <line x1={480} y1={210} x2={690} y2={280} stroke={RED} strokeWidth={8 * eio(tt, 4.2, 4.5)} />
    </svg>
    <Big tt={tt} at={0.4} x={960} y={130} txt="LOS BARATOS" size={80} col="#3a2414" />
  </>;
}}</Stage>;

// 23 · «Ese tejido blanco se llama colágeno, y con el calor lento se vuelve gelatina»: hebras blancas como lana enredada entre fibras rojas; con el calor se desenredan y se funden en miel brillante
export const YarnMelt: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(circle at 50% 55%, #3a1c12, #0a0504 72%)">{(tt) => {
  const m = eio(tt, 1.0, 4.6);
  return <>
    <svg width={1000} height={600} style={{ position: "absolute", left: 460, top: 260 }}>
      {Array.from({ length: 9 }, (_, i) => <path key={"r" + i} d={`M 0 ${60 + i * 60} C 300 ${40 + i * 60} 700 ${80 + i * 60} 1000 ${60 + i * 60}`} stroke="#9a2a1a" strokeWidth={34} fill="none" opacity={0.85} />)}
      {Array.from({ length: 7 }, (_, i) => { const y = 90 + i * 70, amp = 60 * (1 - m);
        return <path key={i} d={`M 60 ${y} C 200 ${y - amp} 300 ${y + amp} 450 ${y} S 700 ${y - amp} 940 ${y}`} fill="none"
          stroke={`hsla(${44 * m},${10 + 80 * m}%,${95 - 40 * m}%,${1 - 0.2 * m})`} strokeWidth={10 + 18 * m} strokeLinecap="round" style={{ filter: `blur(${4 * m}px)` }} />; })}
    </svg>
    <div style={pos(960, 560, "", { width: 1000, height: 600, background: `radial-gradient(ellipse, rgba(255,170,60,${0.35 * m}), transparent 60%)`, mixBlendMode: "screen" })} />
    <Big tt={tt} at={0.6} x={960} y={170} txt="COLÁGENO" size={100} col={TX} />
    {m > 0.4 && <Big tt={tt} at={3.2} x={960} y={950} txt="se vuelve gelatina" size={64} col={AMB} hand />}
  </>;
}}</Stage>;

// 24 · «Cuando la carne se deshace con la cuchara, sin cuchillo»: el cuchillo se acerca y se retira solo; la cuchara apenas toca el cubo y éste se abre en hebras
export const NoKnife: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#e8dfcc,#c4b494)">{(tt) => {
  const kn = eio(tt, 0.3, 1.2) * (1 - eio(tt, 1.4, 2.2)), sp1 = eio(tt, 2.2, 3.0), open = eio(tt, 3.0, 4.4);
  return <>
    <div style={pos(960, 680, "", { width: 700, height: 160, borderRadius: "50%", background: "radial-gradient(ellipse,#fbf7ee,#d6cdb8)", boxShadow: "0 20px 40px rgba(0,0,0,.25)" })} />
    {Array.from({ length: 8 }, (_, i) => <div key={i} style={pos(960 + (i - 3.5) * (20 + 50 * open), 620 + Math.abs(i - 3.5) * 6 * open, `rotate(${(i - 3.5) * 6 * open}deg)`, { width: 26, height: 150, borderRadius: 12, background: "linear-gradient(90deg,#6a2a14,#9a4a24,#6a2a14)" })} />)}
    <div style={pos(1500 - 300 * kn, 480, "rotate(-30deg)", { width: 420, height: 50, background: "linear-gradient(180deg,#e8edf0,#9aa2a8)", clipPath: "polygon(0 0,100% 40%,100% 100%,0 100%)", opacity: cl(kn * 3 + 0.001) })} />
    {kn > 0.05 && <div style={pos(1360 - 300 * kn, 420, "", { fontSize: 110, fontWeight: 900, color: RED, opacity: eio(tt, 1.0, 1.3) })}>✕</div>}
    <div style={pos(700, 360 + 220 * sp1, "rotate(25deg)", { width: 46, height: 380, borderRadius: 23, background: "linear-gradient(90deg,#9aa2a8,#eef2f4,#9aa2a8)", opacity: cl(sp1 * 3) })}>
      <div style={{ position: "absolute", left: -50, top: 330, width: 146, height: 190, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%,#ffffff,#b8c0c6)" }} />
    </div>
    <Big tt={tt} at={3.2} x={960} y={190} txt="SIN CUCHILLO" size={96} col="#3a2414" />
  </>;
}}</Stage>;

// 25 · «Mi guiso de recién casada hervía como un volcán»: la olla de costado se convierte en volcán: burbujas grandes, la tapa salta, el guiso salpica en arco
export const Volcano: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#2a120a,#0a0403)">{(tt) => {
  const e = eio(tt, 0.4, 1.6), lid = Math.abs(Math.sin(tt * 9)) * 30 * e;
  return <>
    <div style={pos(960, 760)}><PotSide w={600} fill="radial-gradient(ellipse,#ff8a3a,#c43a10)" /></div>
    <div style={pos(960, 560 - lid - 70 * e, `rotate(${Math.sin(tt * 7) * 8 * e}deg)`, { width: 620, height: 50, borderRadius: "50%", background: "radial-gradient(ellipse,#5a5a60,#2a2a2d)" })} />
    {Array.from({ length: 18 }, (_, i) => { const ph = (tt * 0.9 + i * 0.37) % 1, dir = (i % 2 ? 1 : -1) * (120 + (i * 43) % 260);
      return <div key={i} style={pos(960 + dir * ph, 580 - 380 * ph + 420 * ph * ph, "", { width: 22 + (i % 4) * 8, height: 22 + (i % 4) * 8, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ffb070,#c43a10)", opacity: e * (1 - ph) })} />; })}
    {Array.from({ length: 7 }, (_, i) => <div key={"b" + i} style={pos(760 + i * 66, 580 - 20 * Math.abs(Math.sin(tt * 5 + i)), "", { width: 60, height: 40, borderRadius: "50%", border: "5px solid #ffb070", opacity: e })} />)}
    <Big tt={tt} at={1.2} x={960} y={170} txt="COMO UN VOLCÁN" size={96} col="#ff8a4a" />
  </>;
}}</Stage>;

// 26 · «Lo que doña Carmen llamaba el fuego de sonrisa: una burbujita aquí, otra allá, despacio»: la superficie del guiso desde arriba; burbujas chicas aparecen de a una y, sin que se note, dibujan una sonrisa
export const SmileBubbles: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg={KITCHEN}>{(tt) => {
  const pts: [number, number][] = [[-170, -80], [170, -80], ...Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (0.15 + 0.7 * i / 8); return [-Math.cos(a) * 200, 40 + Math.sin(a) * 110] as [number, number]; })];
  return <>
    <div style={pos(960, 560)}><PotTop d={740} fill={STEW}>
      {pts.map(([x, y], i) => { const a = 0.6 + i * 0.32, s = sp(tt, a, 9, 0.5), pop = Math.sin(((tt - a) * 1.4) % 1 * Math.PI);
        return <div key={i} style={{ position: "absolute", left: 326 + x - 22, top: 326 + y - 22, width: 44, height: 44, borderRadius: "50%", border: "4px solid rgba(255,220,170,.85)", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.7), rgba(255,200,140,.2) 50%, transparent 70%)", transform: `scale(${s * (0.85 + 0.15 * pop)})`, opacity: cl(s * 2) }} />; })}
    </PotTop></div>
    <Big tt={tt} at={3.8} x={960} y={140} txt="FUEGO DE SONRISA" size={92} col={AMB} />
  </>;
}}</Stage>;

// 27 · «Es como cuando planchas una camisa: con la plancha muy caliente la quemas, y con calor justo, queda perfecta»: dos camisas; la plancha roja deja la marca quemada en la primera, la tibia alisa la segunda
export const Iron: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#d8e2ea,#a8b6c2)">{(tt) => {
  const a = eio(tt, 0.4, 1.8), b = eio(tt, 2.4, 4.0);
  const shirt = (x: number, wr: number, burn: number) => <svg width={520} height={520} style={{ position: "absolute", left: x - 260, top: 360 }}>
    <path d="M 160 30 L 60 90 L 0 200 L 80 240 L 110 190 L 110 500 L 410 500 L 410 190 L 440 240 L 520 200 L 460 90 L 360 30 Q 260 90 160 30 Z" fill="#f4f6f8" stroke="#9aa2a8" strokeWidth={4} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M 130 ${230 + i * 45} q 60 ${-14 * wr} 130 0 t 130 0`} stroke={`rgba(120,130,140,${0.6 * wr})`} strokeWidth={4} fill="none" />)}
    <path d="M 200 260 L 330 260 L 360 330 L 330 400 L 200 400 L 170 330 Z" fill={`rgba(110,60,20,${0.85 * burn})`} />
  </svg>;
  return <>
    {shirt(560, 1 - 0, a > 0.6 ? 1 : 0)}
    {shirt(1360, 1 - b, 0)}
    <div style={pos(320 + 300 * a, 600, "", { width: 200, height: 150, clipPath: "polygon(0 100%,30% 0,100% 0,100% 100%)", background: `linear-gradient(180deg,#ff6a3a,#c42a10)`, boxShadow: "0 0 40px rgba(255,80,20,.7)", opacity: 1 - eio(tt, 1.9, 2.2) })} />
    <div style={pos(1120 + 300 * b, 560 + 60 * Math.sin(tt * 4) * (b > 0 && b < 1 ? 1 : 0), "", { width: 200, height: 150, clipPath: "polygon(0 100%,30% 0,100% 0,100% 100%)", background: "linear-gradient(180deg,#e8edf0,#9aa2a8)", opacity: cl(eio(tt, 2.2, 2.5)) })} />
    <Big tt={tt} at={1.2} x={560} y={260} txt="MUY CALIENTE" size={60} col="#a8281a" />
    <Big tt={tt} at={3.4} x={1360} y={260} txt="CALOR JUSTO" size={60} col="#1a5a3a" />
  </>;
}}</Stage>;

// 28 · «El secreto es echarlas por tiempos, de la más dura a la más blanda»: un telón rojo se abre sobre la olla; las verduras entran a escena de a una, cuando les toca: zanahoria, papa, calabaza, arvejas
export const Theater: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#1a0a08,#060303)">{(tt) => {
  const cur = eio(tt, 0.2, 1.2);
  const veg: [string, string, number, number][] = [["ZANAHORIA", "linear-gradient(90deg,#e8701a,#ffa040)", 1.6, 140], ["PAPA", "radial-gradient(circle,#e8cc8a,#b8904a)", 2.6, 130], ["CALABAZA", "radial-gradient(circle,#ffb040,#d8701a)", 3.5, 130], ["ARVEJAS", "radial-gradient(circle,#8ad04a,#3a8a1a)", 4.3, 70]];
  return <>
    <div style={pos(960, 860, "", { width: 1500, height: 60, background: "linear-gradient(180deg,#6a3a1a,#3a1a0a)" })} />
    <div style={pos(960, 760)}><PotSide w={420} /></div>
    {veg.map(([n, bg, a, s], i) => { const k = sp(tt, a, 6, 0.5), drop = eio(tt, a + 0.5, a + 0.9);
      return <React.Fragment key={i}>
        <div style={pos(360 + 600 * k, 520 + 200 * drop, `scale(${1 - 0.5 * drop})`, { width: s, height: n === "ZANAHORIA" ? 60 : s, borderRadius: n === "ZANAHORIA" ? "50% 10% 10% 50%" : "50%", background: bg, boxShadow: "0 10px 20px rgba(0,0,0,.5)", opacity: cl(k * 3) * (1 - eio(tt, a + 0.8, a + 1.0)) })} />
        <div style={pos(360 + 600 * k, 420 + 200 * drop, "", { fontWeight: 900, fontSize: 46, color: AMB, letterSpacing: 2, textShadow: "0 6px 16px rgba(0,0,0,.7)", opacity: cl(k * 3) * (1 - eio(tt, a + 0.6, a + 0.9)) })}>{n}</div>
      </React.Fragment>; })}
    <div style={{ position: "absolute", left: 0, top: 0, width: 960 * (1 - cur), height: 1080, background: "repeating-linear-gradient(90deg,#8a1a14 0 40px,#6a1010 40px 80px)", boxShadow: "20px 0 40px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", right: 0, top: 0, width: 960 * (1 - cur), height: 1080, background: "repeating-linear-gradient(90deg,#8a1a14 0 40px,#6a1010 40px 80px)", boxShadow: "-20px 0 40px rgba(0,0,0,.6)" }} />
  </>;
}}</Stage>;

// 29 · «Se hicieron unas bolas de harina, pegotes blancos, y el guiso quedó con gusto a engrudo»: la harina cae en el guiso y se arma en bolitas blancas que flotan y rebotan; un pincel de engrudo pega la cuchara
export const Lumps: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg={KITCHEN}>{(tt) => {
  const fall = eio(tt, 0.2, 1.2), ball = eio(tt, 1.2, 2.4);
  return <>
    <div style={pos(960, 600)}><PotTop d={680} fill={STEW}>
      {Array.from({ length: 16 }, (_, i) => { const x = 120 + (i * 97) % 360, y = 120 + (i * 61) % 360, b = Math.sin(tt * 3 + i) * 4;
        return <div key={i} style={{ position: "absolute", left: x, top: y + b, width: 30 + 30 * ball * ((i % 3) / 3 + 0.6), height: 30 + 30 * ball * ((i % 3) / 3 + 0.6), borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ffffff,#d8d2c4 60%,#a8a090)", opacity: cl(fall * 2), boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />; })}
    </PotTop></div>
    {Array.from({ length: 30 }, (_, i) => { const k = cl((tt - i * 0.03) / 1.0); return k > 0 && k < 1 ? <div key={i} style={pos(900 + (i * 23) % 120, 120 + k * 420, "", { width: 8, height: 8, borderRadius: "50%", background: "#fff", opacity: 0.8 })} /> : null; })}
    <Big tt={tt} at={2.0} x={960} y={150} txt="GUSTO A ENGRUDO" size={88} col="#e8e2d4" />
  </>;
}}</Stage>;

// 30 · «Cuando pasas la cuchara por el fondo, el caldo tarda en volver a cubrir la línea»: vista desde arriba; la cuchara abre un surco en el guiso espeso y las dos orillas vuelven a juntarse despacio
export const PartSea: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg={KITCHEN}>{(tt) => {
  const cut = eio(tt, 0.4, 1.4), close = eio(tt, 1.8, 5.0), w = 90 * cut * (1 - close);
  return <>
    <div style={pos(960, 580)}><PotTop d={720} fill={STEW}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 316 - w / 2, height: w, background: "linear-gradient(180deg, rgba(0,0,0,.5), #3a3a3e 30%, #4a4a50 70%, rgba(0,0,0,.5))", clipPath: `inset(0 ${100 - 100 * cut}% 0 0)` }} />
    </PotTop></div>
    <div style={pos(310 + 700 * cut, 580, "rotate(-90deg)", { width: 40, height: 300, borderRadius: 20, background: "linear-gradient(90deg,#a87a4a,#d8b080,#a87a4a)", opacity: 1 - eio(tt, 1.4, 1.8) })} />
    <div style={pos(960, 980, "", { fontWeight: 900, fontSize: 64, color: TX, fontVariantNumeric: "tabular-nums" })}>{(Math.max(0, tt - 1.4) ).toFixed(1)} s</div>
    <Big tt={tt} at={2.0} x={960} y={150} txt="TARDA EN CERRARSE" size={84} col={AMB} />
  </>;
}}</Stage>;

// 31 · «Sacó un limón del bolsillo de su delantal… exprimió unas gotas en la olla»: el bolsillo del delantal se abulta, salta el limón girando, se parte y caen tres gotas que brillan
export const Lemon: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#efe6d4,#cdbd9a)">{(tt) => {
  const jump = sp(tt, 0.8, 5, 0.35), half = eio(tt, 2.4, 2.9);
  return <>
    <div style={pos(700, 700, "", { width: 420, height: 300, borderRadius: "16px 16px 40px 40px", background: "#f2ead8", border: "6px dashed #a8282a", boxShadow: "0 20px 40px rgba(0,0,0,.25)" })} />
    <div style={pos(700 + 360 * jump, 600 - 300 * Math.sin(jump * Math.PI * 0.9), `rotate(${540 * jump}deg)`, { width: 180 * (1 - 0.3 * half), height: 140, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff7a0,#f2d23a 50%,#c8a81a)", boxShadow: "0 10px 20px rgba(0,0,0,.3)" })} />
    {[0, 1, 2].map((i) => { const k = cl((tt - 3.0 - i * 0.35) / 0.6); return k > 0 && k < 1 ? <div key={i} style={pos(1060, 640 + 300 * k, "", { width: 22, height: 30, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%,#ffffff,#f8f0a0)", boxShadow: "0 0 14px #fff6a0" })} /> : null; })}
    <div style={pos(1060, 980)}><PotSide w={380} /></div>
    <Big tt={tt} at={1.4} x={1420} y={240} txt="UNAS GOTAS DE LIMÓN" size={64} col="#7a5a08" hand />
  </>;
}}</Stage>;
