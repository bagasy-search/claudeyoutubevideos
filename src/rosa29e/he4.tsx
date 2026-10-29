// rosa29e · componentes únicos 32-42. Todo en código, ninguna familia de rosa29a-d.
import React from "react";
import { Stage, cl, eio, AMB, TX } from "./hkit";
import { Big, Steam, Table, Shadow } from "./rkit";
import { P, sp, pos, PotSide, STEW } from "./he1";

// 32 · «El guiso se reduce… y la sal se concentra»: macro de una cuchara llena de caldo; las gotitas de agua se van volando como vapor y los granitos de sal se quedan, hasta formar una costra blanca en la cuchara
export const Evap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(circle at 50% 55%, #3a2a1c, #0a0705 72%)">{(tt) => {
  const r = eio(tt, 0.6, 4.4);
  return <>
    <div style={pos(1240, 640, "rotate(-12deg)", { width: 900, height: 70, borderRadius: 35, background: "linear-gradient(180deg,#eef2f4,#8a9298)" })} />
    <div style={pos(760, 600, "", { width: 560, height: 360, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%,#ffffff,#9aa2a8 70%)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" })}>
      <div style={{ position: "absolute", left: 40 + 60 * r, top: 30 + 40 * r, width: 480 - 120 * r, height: 300 - 80 * r, borderRadius: "50%", background: "radial-gradient(ellipse,#c8743a,#7a3410)", opacity: 1 - 0.85 * r }} />
      {Array.from({ length: 46 }, (_, i) => { const a = i * 2.39, rr = 30 + (i * 37) % 190 * (1 - 0.45 * r), k = cl(r * 1.6 - (i % 9) * 0.06);
        return <div key={i} style={{ position: "absolute", left: 280 + Math.cos(a) * rr - 6, top: 180 + Math.sin(a) * rr * 0.6 - 6, width: 12, height: 12, background: "#fff", transform: `rotate(45deg) scale(${0.6 + 0.8 * k})`, boxShadow: "0 0 8px #fff", opacity: 0.4 + 0.6 * k }} />; })}
    </div>
    {Array.from({ length: 14 }, (_, i) => { const ph = (tt * 0.45 + i * 0.29) % 1, x = 600 + (i * 71) % 320 + Math.sin(tt * 2 + i) * 30;
      return <div key={i} style={pos(x, 520 - 420 * ph, "", { width: 26, height: 34, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.9), rgba(160,200,230,.4))", opacity: (1 - ph) * cl(r * 3), filter: `blur(${4 * ph}px)` })} />; })}
    <Big tt={tt} at={2.4} x={1300} y={300} txt="LA SAL SE QUEDA" size={84} col={TX} />
  </>;
}}</Stage>;

// 33 · «El ácido los separa, los levanta, los hace brillar. Es como abrir una ventana en una cocina cerrada»: dos postigos de madera se abren y entra la luz; los sabores (puntos de color) que estaban amontonados y grises se separan y brillan
export const Shutters: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#2a2018,#0e0a06)">{(tt) => {
  const o = eio(tt, 0.4, 1.8), sep = eio(tt, 1.4, 3.4);
  const cols = ["#e8701a", "#8ad04a", "#d83a2a", "#f2d23a", "#c89a6a", "#6ac0e0"];
  return <>
    <div style={pos(960, 520, "", { width: 760, height: 620, background: `linear-gradient(180deg, rgba(255,240,200,${o}), rgba(255,220,150,${0.6 * o}))`, boxShadow: `0 0 ${200 * o}px rgba(255,220,150,${0.6 * o})` })} />
    <div style={{ position: "absolute", left: 580, top: 210, width: 380, height: 620, transformOrigin: "0 50%", transform: `perspective(1400px) rotateY(${-110 * o}deg)`, background: "repeating-linear-gradient(180deg,#7a5230 0 34px,#5a3a1e 34px 40px)", border: "10px solid #4a2e16" }} />
    <div style={{ position: "absolute", left: 960, top: 210, width: 380, height: 620, transformOrigin: "100% 50%", transform: `perspective(1400px) rotateY(${110 * o}deg)`, background: "repeating-linear-gradient(180deg,#7a5230 0 34px,#5a3a1e 34px 40px)", border: "10px solid #4a2e16" }} />
    {Array.from({ length: 18 }, (_, i) => { const a = i * 2.4, r = 30 + 260 * sep * (0.5 + (i % 3) / 4);
      return <div key={i} style={pos(960 + Math.cos(a) * r, 900 + Math.sin(a) * r * 0.25, "", { width: 34, height: 34, borderRadius: "50%", background: sep > 0.1 ? cols[i % 6] : "#6a6460", boxShadow: `0 0 ${24 * sep}px ${cols[i % 6]}`, filter: `saturate(${0.2 + 0.8 * sep})` })} />; })}
    <Big tt={tt} at={1.8} x={960} y={130} txt="ABRIR UNA VENTANA" size={88} col={AMB} />
  </>;
}}</Stage>;

// 34 · «Los cubitos tienen mucha sal»: el cubito de caldo se desenvuelve de su papel dorado y adentro hay una montañita de sal que crece más alta que el cubo
export const Cube: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="linear-gradient(180deg,#e9e2d4,#c9bda4)">{(tt) => {
  const un = eio(tt, 0.4, 1.6), salt = eio(tt, 1.8, 3.8);
  return <>
    <Shadow x={960} y={780} w={520} />
    <div style={pos(960, 640, "", { width: 200, height: 200, background: "linear-gradient(135deg,#c8902a,#8a5a14)", borderRadius: 10, boxShadow: "inset -14px -14px 0 rgba(0,0,0,.2)" })} />
    {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: 960 + (d < 0 ? -110 : 10), top: 530, width: 100, height: 220, transformOrigin: d < 0 ? "100% 50%" : "0 50%", transform: `perspective(900px) rotateY(${d * 150 * un}deg)`, background: "linear-gradient(135deg,#fff3a0,#e8b82a 40%,#a87a10 70%,#f2d870)", border: "2px solid #8a6410" }} />)}
    <div style={pos(960, 560 - 140 * salt, "", { width: 380 * salt, height: 300 * salt, clipPath: "polygon(50% 0,100% 100%,0 100%)", background: "repeating-linear-gradient(45deg,#ffffff 0 6px,#e8eef2 6px 12px)", filter: "drop-shadow(0 10px 14px rgba(0,0,0,.3))" })} />
    <Big tt={tt} at={2.2} x={960} y={170} txt="MUCHA SAL" size={100} col="#7a1a10" />
  </>;
}}</Stage>;

// 35 · «La grasa sube y se pone blanca y dura arriba. La puedes sacar»: el recipiente frío visto de costado; una capa blanca se forma arriba como una tapa y una cuchara la levanta entera en un disco
export const FatCap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#cfe0ea,#90a8b8)">{(tt) => {
  const f = eio(tt, 0.4, 2.0), lift = eio(tt, 2.6, 4.2);
  return <>
    <div style={pos(960, 680, "", { width: 560, height: 360, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg, rgba(255,255,255,.25), rgba(255,255,255,.08) 40%, rgba(255,255,255,.3))", border: "4px solid rgba(255,255,255,.6)", overflow: "hidden" })}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 280, background: "linear-gradient(180deg,#9a4a1e,#5a220c)" }} />
    </div>
    <div style={pos(960, 530 - 300 * lift, `rotate(${-8 * lift}deg)`, { width: 540, height: 40, borderRadius: 12, background: `rgba(250,248,240,${f})`, boxShadow: `0 ${10 * lift}px ${20 * lift}px rgba(0,0,0,.3)` })} />
    <div style={pos(1180, 470 - 300 * lift, "rotate(-60deg)", { width: 36, height: 340, borderRadius: 18, background: "linear-gradient(90deg,#9aa2a8,#eef2f4,#9aa2a8)", opacity: cl(eio(tt, 2.2, 2.6)) })} />
    <Big tt={tt} at={1.4} x={960} y={150} txt="BLANCA Y DURA" size={92} col="#1a3a5a" />
    {lift > 0.3 && <Big tt={tt} at={3.2} x={960} y={960} txt="y la sacas entera" size={58} col="#1a3a5a" hand />}
  </>;
}}</Stage>;

// 36 · «Lo reparto en cuatro recipientes. Uno para el domingo. Uno para el miércoles. Y dos al congelador»: una tira de la semana (D L M M J V S); cuatro tapers caen: uno en domingo, uno en miércoles, dos se escarchan en la puerta del freezer
export const WeekTubs: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#2a2622,#0e0c0a)">{(tt) => {
  const days = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
  const tub = (x: number, y: number, a: number, frost = 0) => { const k = sp(tt, a, 7, 0.5);
    return <div style={pos(x, y - 200 * (1 - k), "", { width: 150, height: 110, borderRadius: 14, opacity: cl(k * 3), background: `linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,.1)), linear-gradient(180deg,#b8642a,#6a2a0a)`, border: `4px solid rgba(${200 + 55 * frost},${220 + 35 * frost},255,.9)`, boxShadow: `0 0 ${30 * frost}px rgba(180,220,255,${frost})` })}>
      <div style={{ position: "absolute", left: -6, right: -6, top: -18, height: 22, borderRadius: 6, background: "#3a7ab8" }} />
    </div>; };
  return <>
    {days.map((d, i) => <div key={i} style={pos(330 + i * 210, 760, "", { width: 190, height: 70, borderRadius: 10, background: i === 0 || i === 3 ? "rgba(255,200,120,.25)" : "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 34, color: TX })}>{d}</div>)}
    {tub(330, 640, 0.5)}
    {tub(330 + 3 * 210, 640, 1.4)}
    <div style={pos(1620, 470, "", { width: 360, height: 420, borderRadius: 20, background: "linear-gradient(180deg,#dfe9f0,#a8bccb)", boxShadow: "inset 0 0 0 8px #8aa0b0" })} />
    {tub(1550, 420, 2.4, eio(tt, 3.2, 4.2))}
    {tub(1700, 560, 2.8, eio(tt, 3.4, 4.4))}
    <Big tt={tt} at={1.0} x={960} y={190} txt="UNA TARDE, CUATRO COMIDAS" size={72} col={AMB} />
  </>;
}}</Stage>;

// 37 · «La olla de hierro, pesada, que me regaló doña Carmen cuando me casé»: una caja de regalo con moño se desarma por sus cuatro caras y aparece la olla negra de hierro; la tarjetita dice «Para Rosa»
export const GiftPot: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(circle at 50% 55%, #3a2a1c, #0a0705 72%)">{(tt) => {
  const bow = eio(tt, 0.4, 1.2), op = eio(tt, 1.2, 2.4), card = sp(tt, 2.8, 6, 0.45);
  return <>
    <Table y={820} />
    <div style={pos(960, 690, `scale(${0.85 + 0.15 * op})`)}><PotSide w={480} fill="radial-gradient(ellipse,#2a2a2d,#111)" /></div>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 960 - 280, top: 470, width: 560, height: 380, transformOrigin: ["50% 100%", "0 50%", "100% 50%", "50% 0"][i],
      transform: `perspective(1600px) ${["rotateX", "rotateY", "rotateY", "rotateX"][i]}(${[-1, 1, -1, 1][i] * 95 * op}deg) translateZ(${i === 0 ? 1 : 0}px)`, background: "linear-gradient(135deg,#c8282a,#8a1414)", opacity: i === 0 ? 1 - op : 1 - op * 0.9, clipPath: op > 0.02 ? undefined : undefined, display: i === 0 ? "block" : "none" }}>
      <div style={{ position: "absolute", left: 255, top: 0, width: 50, height: 380, background: "#f2d27a" }} />
      <div style={{ position: "absolute", left: 0, top: 165, width: 560, height: 50, background: "#f2d27a" }} />
    </div>)}
    <div style={pos(960, 440 - 300 * bow, `rotate(${200 * bow}deg)`, { width: 180, height: 90, opacity: 1 - bow, background: "radial-gradient(ellipse at 25% 50%,#f2d27a 0 30%,transparent 31%), radial-gradient(ellipse at 75% 50%,#f2d27a 0 30%,transparent 31%)" })} />
    <div style={pos(1380, 560, `rotate(${-8 + 4 * card}deg) scale(${card})`, { width: 300, height: 170, background: "#fbf4e2", borderRadius: 6, boxShadow: "0 14px 30px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Caveat, cursive", fontWeight: 700, fontSize: 64, color: "#7a1a10" })}>Para Rosa</div>
    <Big tt={tt} at={2.2} x={960} y={170} txt="REGALO DE CARMEN" size={84} col={AMB} />
  </>;
}}</Stage>;

// 38 · «Relleno unas tapas de masa… al horno, veinte minutos»: un círculo de masa recibe la carne desmenuzada, se dobla en media luna y el borde se repulga pliegue por pliegue
export const Crimp: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#e8dcc4,#c4ae86)">{(tt) => {
  const fill = eio(tt, 0.3, 1.2), fold = eio(tt, 1.4, 2.4), cr = cl((tt - 2.6) / 2.2);
  return <>
    <div style={pos(960, 620, `perspective(1400px) rotateX(${50 - 30 * fold}deg)`, { width: 560, height: 560 })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fbf2dc,#e8d4a8)", clipPath: "inset(50% 0 0 0)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fbf2dc,#e8d4a8)", clipPath: "inset(0 0 50% 0)", transformOrigin: "50% 50%", transform: `rotateX(${-178 * fold}deg)`, backfaceVisibility: "visible" }} />
      <div style={{ position: "absolute", left: 140, top: 300, width: 280, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse,#8a3a16,#5a220c)", transform: `scale(${fill})`, opacity: 1 - fold }} />
    </div>
    {fold > 0.95 && Array.from({ length: 12 }, (_, i) => { const k = cl(cr * 12 - i), a = Math.PI * (i / 11);
      return <div key={i} style={pos(960 - Math.cos(a) * 272, 622 + Math.sin(a) * 288, `rotate(${-90 + 180 * i / 11}deg) scale(${k})`, { width: 64, height: 40, borderRadius: "50% 50% 10% 10%", background: "linear-gradient(180deg,#f2e2bc,#d0b480)", boxShadow: "0 4px 6px rgba(0,0,0,.2)" })} />; })}
    <Big tt={tt} at={2.8} x={960} y={190} txt="MEDIA PORCIÓN, EMPANADAS" size={74} col="#6b2a14" hand />
  </>;
}}</Stage>;

// 39 · «Si una receta una madre no la da, se pierde»: una ficha de receta pasa de mano en mano por cuatro generaciones (cuatro manos); la última mano no está y la ficha empieza a borrarse… hasta que aparece la mano de Rosa y la sostiene
export const Relay: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(90deg,#2a1c12,#4a3020 50%,#2a1c12)">{(tt) => {
  const x = 260 + 1300 * eio(tt, 0.4, 4.0), fade = eio(tt, 3.2, 4.0) * (1 - eio(tt, 4.4, 5.0)), save = sp(tt, 4.3, 6, 0.5);
  const hand = (cx: number, tone: string, k = 1) => <div style={pos(cx, 720, `scale(${k})`, { width: 200, height: 120, borderRadius: "60px 60px 30px 30px", background: tone, boxShadow: "0 20px 30px rgba(0,0,0,.4)", opacity: cl(k * 2) })} />;
  return <>
    {hand(260, "linear-gradient(180deg,#c89a7a,#9a6a4a)")}{hand(690, "linear-gradient(180deg,#d8aa8a,#aa7a5a)")}{hand(1120, "linear-gradient(180deg,#e2b898,#b88a6a)")}
    {hand(1560, "linear-gradient(180deg,#d0a080,#a07050)", save)}
    <div style={pos(x, 600 - 60 * Math.abs(Math.sin((x - 260) / 430 * Math.PI)), `rotate(${-4 + 8 * Math.sin(tt * 2)}deg)`, { width: 260, height: 180, background: "linear-gradient(180deg,#fbf4e2,#e8dcc0)", borderRadius: 6, boxShadow: "0 14px 30px rgba(0,0,0,.4)", padding: 20, opacity: 1 - 0.85 * fade })}>
      {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ height: 4, margin: "20px 0", background: "rgba(80,50,30,.55)", width: `${92 - (k * 17) % 40}%` }} />)}
    </div>
    <Big tt={tt} at={0.8} x={960} y={190} txt="DE MADRE EN MADRE" size={88} col={AMB} />
  </>;
}}</Stage>;

// 40 · «Todo eso, en el mercado, te cuesta unos cuatro dólares. Cuatro comidas, a un dólar cada una»: un billete de 4 dólares se parte en cuatro de 1 que vuelan a cuatro platos de guiso
export const BillSplit: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#e8e0cc,#c4b48e)">{(tt) => {
  const s = sp(tt, 0.1, 5, 0.6), sp4 = eio(tt, 1.4, 2.6);
  return <>
    {[0, 1, 2, 3].map((i) => { const tx = 330 + i * 420;
      return <React.Fragment key={i}>
        <div style={pos(tx, 840)}><div style={{ width: 300, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse,#fbf7ee,#d6cdb8)", boxShadow: "0 12px 20px rgba(0,0,0,.25)" }}><div style={{ position: "absolute", left: 40, top: 14, width: 220, height: 50, borderRadius: "50%", background: STEW }} /></div></div>
        <div style={pos(960 + (tx - 960) * sp4 + (i - 1.5) * 4 * (1 - sp4), 460 + 260 * sp4 + i * 6 * (1 - sp4), `rotate(${(i - 1.5) * 4 + 360 * sp4 * (i % 2 ? 1 : -1) * 0.1}deg) scale(${s * (1 - 0.4 * sp4)})`, { width: 420, height: 190, borderRadius: 10, background: "linear-gradient(135deg,#d8e8c4,#9ab884)", border: "6px solid #4a6a3a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 90, color: "#2a4a1e", boxShadow: "0 14px 24px rgba(0,0,0,.3)" })}>{sp4 > 0.15 ? "$1" : i === 3 ? "$4" : ""}</div>
      </React.Fragment>; })}
    <Big tt={tt} at={2.4} x={960} y={170} txt="UN DÓLAR LA COMIDA" size={86} col="#2a4a1e" />
  </>;
}}</Stage>;

// 41 · «Lo dejas reposar diez minutos tapado»: una funda tejida a crochet (cubre-olla) baja despacio sobre la olla tapada; el vapor se esconde y aparece un reloj de diez minutos hecho de puntos de lana
export const Cozy: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(circle at 50% 60%, #3a2a1c, #0a0705 72%)">{(tt) => {
  const d = sp(tt, 0.5, 4.2, 0.5), arc = eio(tt, 2.2, 5.6);
  return <>
    <Table y={840} />
    <div style={pos(960, 760)}><PotSide w={480} /></div>
    <Steam tt={tt} x={960} y={620} w={260} h={220} o={1 - d} />
    <div style={pos(960, 680 - 520 * (1 - d), "", { width: 560, height: 360, borderRadius: "280px 280px 30px 30px", background: "repeating-radial-gradient(circle at 50% 100%, #c84a3a 0 14px, #e8c87a 14px 28px, #5a8aa8 28px 42px)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", border: "8px solid #a83a2a" })}>
      <div style={{ position: "absolute", left: 250, top: -40, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle,#f2d27a,#a8822a)" }} />
    </div>
    <svg width={220} height={220} style={{ position: "absolute", left: 1350, top: 380, opacity: cl(arc * 4) }}>
      <circle cx={110} cy={110} r={90} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={14} />
      <circle cx={110} cy={110} r={90} fill="none" stroke={AMB} strokeWidth={14} strokeDasharray={`${arc * 565} 565`} transform="rotate(-90 110 110)" strokeLinecap="round" />
      <text x={110} y={128} textAnchor="middle" fontSize={56} fontWeight={900} fill={TX}>10′</text>
    </svg>
    <Big tt={tt} at={1.6} x={960} y={170} txt="REPOSA TAPADO" size={92} col={AMB} />
  </>;
}}</Stage>;

// 42 · «Cada vez que raspo el fondo de la olla con la cuchara de madera, la escucho decir: eso es el guiso»: una mano mayor (la de Carmen) le pasa la cuchara de madera a la mano de Rosa; entre las dos manos queda escrita la frase a mano
export const Handover: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#3a2414,#120a06)">{(tt) => {
  const g = eio(tt, 0.4, 2.2), w = eio(tt, 2.6, 4.4);
  return <>
    <div style={pos(560 + 200 * g, 560, "", { width: 300, height: 170, borderRadius: "90px 40px 40px 90px", background: "linear-gradient(180deg,#c8a084,#906a50)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", opacity: 1 - 0.6 * eio(tt, 2.4, 3.4) })} />
    <div style={pos(1360 - 200 * g, 600, "", { width: 300, height: 170, borderRadius: "40px 90px 90px 40px", background: "linear-gradient(180deg,#dcb294,#aa7e60)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" })} />
    <div style={pos(760 + 360 * g, 520, `rotate(${-10 + 10 * g}deg)`, { width: 560, height: 40, borderRadius: 20, background: "linear-gradient(180deg,#d8b080,#8a6038)" })}>
      <div style={{ position: "absolute", left: 480, top: -50, width: 160, height: 140, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 40%,#d8b080,#7a5028)" }} />
    </div>
    <svg width={1200} height={200} style={{ position: "absolute", left: 360, top: 760 }}>
      <text x={600} y={130} textAnchor="middle" fontFamily="Caveat, cursive" fontSize={110} fontWeight={700} fill="none" stroke="#fff3dc" strokeWidth={3} pathLength={1} strokeDasharray={`${w} 1`}>«eso es el guiso»</text>
      <text x={600} y={130} textAnchor="middle" fontFamily="Caveat, cursive" fontSize={110} fontWeight={700} fill={`rgba(255,243,220,${eio(tt, 3.8, 4.6)})`}>«eso es el guiso»</text>
    </svg>
  </>;
}}</Stage>;
