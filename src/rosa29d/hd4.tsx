// rosa29d · componentes únicos 31-40. Todo en código, ninguna familia de rosa29a, b ni c.
import React from "react";
import { Stage, cl, eio, AMB } from "./hkit";
import { Big, Tape, Table, Shadow, Steam, Coin } from "./rkit";
import { P, sp, pos } from "./hd1";

// 31 · «Mi padre sacaba el tuétano y lo golpeaba contra el plato»: el hueso cae en diagonal sobre el plato dos veces y en el segundo golpe sale el tuétano sobre el pan
export const Tap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#3a2414,#1a0e06)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), hit = (a: number) => Math.exp(-6 * Math.max(0, tt - a)) * (tt > a ? 1 : 0);
  const lift = Math.max(0, Math.sin(Math.PI * cl((tt - 0.6) / 0.8))) + Math.max(0, Math.sin(Math.PI * cl((tt - 1.6) / 0.8)));
  const drop = eio(tt, 2.3, 3.0);
  return <>
    <Table y={820} />
    <div style={pos(960, 760, `scale(${s})`, { width: 760, height: 170, borderRadius: "50%", background: "radial-gradient(ellipse,#fbf8f0 0 56%,#d8d4cc 58%,#f2efe8 72%)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" })} />
    <div style={pos(820, 740, `scale(${s})`, { width: 260, height: 90, borderRadius: "40% 40% 30% 30%", background: "linear-gradient(180deg,#e8b874,#c48a44)" })} />
    <div style={pos(820, 690 + 40 * (1 - drop), `scale(${drop})`, { width: 120, height: 50, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%,#f4e4c4,#c8a878)", opacity: cl(drop * 4) })} />
    <div style={pos(1140, 600 - 180 * lift, `scale(${s}) rotate(${-38 + 10 * lift}deg)`, { width: 380, height: 90 })}>
      <div style={{ position: "absolute", left: 50, top: 22, width: 280, height: 46, background: "linear-gradient(180deg,#f4ead4,#c8b890)" }} />
      {[0, 300].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 0, width: 80, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%,#c89a6a 0 22%,#f4ead4 26%,#c8b890)" }} />)}
    </div>
    {[1.4, 2.4].map((a) => <div key={a} style={pos(1000, 720, `scale(${1 + 1.4 * (1 - hit(a))})`, { width: 160, height: 60, borderRadius: "50%", border: "4px solid rgba(255,230,190,.7)", opacity: hit(a) })} />)}
    <Big tt={tt} at={2.6} x={960} y={190} txt="EL TUÉTANO SOBRE EL PAN" size={80} col={AMB} />
  </>;
}}</Stage>;

// 32 · «Un plato de frijoles con arroz y tortilla te llena por horas»: una pila de cocina se carga de a tres barras, una por cada cosa del plato
export const Battery: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 55%, #2a3a24, #0c120a 75%)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6);
  const B: [string, string, number][] = [["#6a2a1a", "FRIJOLES", 0.6], ["#f4ead4", "ARROZ", 1.4], ["#e8c878", "TORTILLA", 2.2]];
  return <>
    <div style={pos(960, 560, `scale(${s})`, { width: 360, height: 620, borderRadius: 40, border: "16px solid #e8e2d6", boxSizing: "border-box", background: "rgba(0,0,0,.35)", boxShadow: "0 0 60px rgba(160,230,120,.15)" })}>
      <div style={{ position: "absolute", left: 100, top: -50, width: 128, height: 40, borderRadius: "12px 12px 0 0", background: "#e8e2d6" }} />
      {B.map(([c, n, a], i) => { const q = cl(sp(tt, a, 6, 0.45));
        return <div key={n} style={{ position: "absolute", left: 24, top: 404 - i * 186 + 60 * (1 - q), width: 280, height: 166, borderRadius: 18, background: `linear-gradient(180deg,${c},${c}cc)`, opacity: q, boxShadow: `0 0 ${30 * q}px ${c}`,
          display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 40, color: i === 0 ? "#fbf4e2" : "#3a2414", letterSpacing: 2 }}>{n}</div>; })}
    </div>
    <Big tt={tt} at={3.0} x={960} y={970} txt="TE LLENA POR HORAS" size={92} col="#a8e080" />
  </>;
}}</Stage>;

// 33 · «En la escuela del pueblo, la mitad de los niños no comía al mediodía»: una fila de bandejas de la escuela; de a una, la mitad se queda vacía y se corre hacia atrás
export const Trays: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#d8dccc,#a8ac98)">{(tt) => {
  const s0 = sp(tt, 0.05, 4.5, 0.6);
  return <>
    <div style={pos(960, 640, "", { width: 2000, height: 420, background: "linear-gradient(180deg,#a8743e,#7a5028)", opacity: cl(s0 * 2) })} />
    {Array.from({ length: 8 }, (_, i) => { const empty = i % 2 === 1, q = cl(sp(tt, 0.2 + i * 0.12, 6, 0.5)), back = empty ? eio(tt, 1.6 + i * 0.12, 2.4 + i * 0.12) : 0, x = 180 + i * 222;
      return <div key={i} style={pos(x, 620 - 90 * back, `scale(${q * (1 - 0.25 * back)})`, { width: 200, height: 260, borderRadius: 16, background: "linear-gradient(180deg,#c8ced4,#8e979f)", boxShadow: "0 16px 20px rgba(0,0,0,.35)", opacity: 1 - 0.45 * back })}>
        <div style={{ position: "absolute", left: 16, top: 16, width: 168, height: 110, borderRadius: 10, background: "#a8b0b8" }}>
          {!empty && <div style={{ position: "absolute", left: 24, top: 18, width: 120, height: 74, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%,#e8b060,#a85a20)" }} />}
        </div>
        <div style={{ position: "absolute", left: 16, top: 140, width: 76, height: 100, borderRadius: 10, background: "#a8b0b8" }}>{!empty && <div style={{ margin: 14, height: 70, borderRadius: 10, background: "#f4ead4" }} />}</div>
        <div style={{ position: "absolute", left: 108, top: 140, width: 76, height: 100, borderRadius: 10, background: "#a8b0b8" }}>{!empty && <div style={{ margin: 14, height: 70, borderRadius: "50%", background: "#6a8a3a" }} />}</div>
      </div>; })}
    <Big tt={tt} at={2.6} x={960} y={180} txt="LA MITAD NO COMÍA" size={96} col="#3a2a14" />
  </>;
}}</Stage>;

// 34 · «Por dentro tiene que quedar apenas rosado»: el cuchillo corta la tajada de hígado al medio y las dos mitades se abren mostrando el centro rosado
export const CrossSection: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#2a1810,#120a06)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), cut = eio(tt, 0.6, 1.6), open = eio(tt, 1.8, 2.6);
  return <>
    <div style={pos(960, 700, `scale(${s})`, { width: 1100, height: 300, borderRadius: 30, background: "linear-gradient(180deg,#b88a5a,#8a6038)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" })} />
    {[-1, 1].map((d) => <div key={d} style={pos(960 + d * (130 + 60 * open), 640, `scale(${s}) rotate(${d * 8 * open}deg)`, { width: 260, height: 130, overflow: "hidden", borderRadius: d < 0 ? "60px 0 0 60px" : "0 60px 60px 0" })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 260, height: 130, background: "linear-gradient(180deg,#6a2a20,#3a1410)" }} />
      <div style={{ position: "absolute", [d < 0 ? "right" : "left"]: 0, top: 0, width: 46 * open, height: 130, background: "linear-gradient(180deg,#5a2418 0 14%, #d8707a 34%, #e8909a 50%, #d8707a 66%, #5a2418 86%)" }} />
    </div>)}
    <div style={pos(960, 520 + 160 * cut - 260 * open, "rotate(90deg)", { width: 340, height: 40, opacity: 1 - open })}>
      <div style={{ position: "absolute", left: 0, top: 4, width: 120, height: 32, borderRadius: 8, background: "#3a2414" }} />
      <div style={{ position: "absolute", left: 116, top: 0, width: 224, height: 40, borderRadius: "0 30px 6px 0", background: "linear-gradient(180deg,#f2f5f7,#9aa3aa)" }} />
    </div>
    <Big tt={tt} at={2.6} x={960} y={200} txt="APENAS ROSADO" size={104} col="#f0a0a8" />
  </>;
}}</Stage>;

// 35 · «Esto era comida de los días de lluvia»: gotas que bajan por el vidrio de la ventana, y del otro lado la olla humeando sobre el fuego
export const WindowRain: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="linear-gradient(180deg,#2a3038,#14181e)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6);
  return <>
    <div style={pos(960, 560, `scale(${s})`, { width: 1200, height: 760, border: "40px solid #5a3a20", boxSizing: "border-box", background: "radial-gradient(ellipse at 50% 80%, #6a4a2a, #2a1c10 70%)", overflow: "hidden" })}>
      <div style={{ position: "absolute", left: 560, top: 0, width: 40, height: 760, background: "#5a3a20" }} />
      <div style={{ position: "absolute", left: 0, top: 340, width: 1200, height: 40, background: "#5a3a20" }} />
      <div style={{ position: "absolute", left: 420, top: 470, width: 300, height: 170, borderRadius: "16px 16px 60px 60px", background: "linear-gradient(90deg,#2a2a2a,#5a5a5a,#1a1a1a)" }} />
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 440 + i * 56, top: 640 + 8 * Math.sin(tt * 9 + i), width: 30, height: 50, borderRadius: "50% 50% 30% 30%", background: "radial-gradient(circle at 50% 70%,#ffd070,#ff7a20 60%,transparent 70%)" }} />)}
      {Array.from({ length: 26 }, (_, i) => { const ph = ((tt * (0.25 + (i % 5) * 0.07)) + i * 0.137) % 1, x = (i * 97) % 1120;
        return <React.Fragment key={i}>
          <div style={{ position: "absolute", left: x, top: -40 + 820 * ph, width: 12, height: 16, borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%", background: "radial-gradient(circle at 35% 35%,rgba(255,255,255,.9),rgba(160,190,220,.4))" }} />
          <div style={{ position: "absolute", left: x + 4, top: -40, width: 3, height: 820 * ph, background: "linear-gradient(180deg,transparent,rgba(180,210,240,.22))" }} />
        </React.Fragment>; })}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1120, height: 680, background: "linear-gradient(135deg,rgba(255,255,255,.08),transparent 40%)" }} />
    </div>
    <Steam tt={tt} x={960} y={500} w={260} h={220} o={0.55} />
    <Big tt={tt} at={2.0} x={960} y={1010} txt="DÍAS DE LLUVIA" size={84} col={AMB} />
  </>;
}}</Stage>;

// 36 · «Al otro día, con lo que quedaba en la olla, se hacía otra comida»: corte a la olla desde arriba; el cucharón da la vuelta raspando el fondo y junta lo último
export const LastLadle: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #3a2a1a, #0e0804 75%)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), a = 2 * Math.PI * eio(tt, 0.4, 2.6), lift = eio(tt, 2.8, 3.6), left = 1 - 0.85 * eio(tt, 0.4, 2.6);
  return <>
    <div style={pos(960, 560, `scale(${s})`, { width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle, #4a4a4a 0 62%, #2a2a2a 66%, #6a6a6a 70%, #1a1a1a 74%)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" })}>
      <div style={{ position: "absolute", left: 380 - 230 * left, top: 380 - 230 * left, width: 460 * left, height: 460 * left, borderRadius: "50%", background: "radial-gradient(circle at 45% 45%,#c8783a,#8a4a1a)" }} />
      <svg width={760} height={760} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M ${380 + 230 * Math.cos(-Math.PI / 2)} ${380 + 230 * Math.sin(-Math.PI / 2)} A 230 230 0 ${a > Math.PI ? 1 : 0} 1 ${380 + 230 * Math.cos(-Math.PI / 2 + a)} ${380 + 230 * Math.sin(-Math.PI / 2 + a)}`} stroke="rgba(255,255,255,.18)" strokeWidth={34} fill="none" strokeLinecap="round" /></svg>
    </div>
    <div style={pos(960 + 230 * Math.cos(-Math.PI / 2 + a), 560 + 230 * Math.sin(-Math.PI / 2 + a) - 300 * lift, `scale(${s * (1 + 0.15 * lift)})`, { width: 130, height: 130, borderRadius: "50%", background: `radial-gradient(circle at 50% 50%, #c8783a ${40 + 40 * eio(tt, 0.4, 2.6)}%, #b8c0c8 0)`, boxShadow: "0 10px 16px rgba(0,0,0,.5)" })} />
    <Big tt={tt} at={2.6} x={960} y={1000} txt="LO QUE QUEDABA" size={92} col={AMB} />
  </>;
}}</Stage>;

// 37 · «Había café para uno, pero no alcanzaba para dos»: dos tazas en la mesa; la cafetera inclina y sirve; la primera se llena, la segunda recibe sólo las últimas gotas
export const OneCup: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="linear-gradient(180deg,#e8d8c0,#b89870)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), f1 = eio(tt, 0.6, 2.0), mv = eio(tt, 2.0, 2.5), f2 = 0.12 * eio(tt, 2.6, 3.4), tilt = 40 * (eio(tt, 0.4, 0.7) - eio(tt, 3.4, 3.8));
  const cup = (x: number, f: number) => <div style={pos(x, 720, `scale(${s})`, { width: 240, height: 200 })}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 200, height: 200, borderRadius: "0 0 90px 90px", background: "linear-gradient(90deg,#e8e2d6,#fbf8f0 45%,#cfc6b4)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 14, bottom: 14, width: 172, height: 172 * f, borderRadius: "0 0 80px 80px", background: "linear-gradient(180deg,#5a3418,#2a1406)" }} />
    </div>
    <div style={{ position: "absolute", left: 186, top: 40, width: 60, height: 90, borderRadius: "0 40px 40px 0", border: "18px solid #e8e2d6", borderLeft: "none", boxSizing: "border-box" }} />
  </div>;
  const px = 780 + 380 * mv;
  return <>
    <Table y={820} />
    <Shadow x={780} y={820} w={260} s={s} /><Shadow x={1160} y={820} w={260} s={s} />
    {cup(780, f1)}{cup(1160, f2)}
    <div style={pos(px + 120, 400, `rotate(${-tilt}deg)`, { width: 220, height: 260, transformOrigin: "20% 20%" })}>
      <div style={{ position: "absolute", left: 30, top: 40, width: 160, height: 220, borderRadius: "20px 20px 30px 30px", background: "linear-gradient(90deg,#6a6a6a,#c8c8c8 45%,#5a5a5a)" }} />
      <div style={{ position: "absolute", left: -20, top: 60, width: 60, height: 24, borderRadius: 12, background: "#8a8a8a", transform: "rotate(-30deg)" }} />
    </div>
    {tilt > 20 && <div style={{ position: "absolute", left: px - 2, top: 470, width: 8, height: mv > 0 && mv < 1 ? 0 : 200, background: "#4a2810", opacity: mv > 0.95 ? (tt < 3.3 ? 0.6 : 0) : 1 }} />}
    <Big tt={tt} at={3.0} x={960} y={190} txt="NO ALCANZABA PARA DOS" size={80} col="#5a2a14" />
  </>;
}}</Stage>;

// 38 · «Cincuenta años tardé en entender por qué»: un tronco cortado; los anillos crecen de adentro hacia afuera y el contador llega a cincuenta
export const Rings: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#2a3a24,#141c10)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), g = eio(tt, 0.3, 3.2), n = Math.round(50 * g);
  return <>
    <div style={pos(960, 560, `scale(${s})`, { width: 720, height: 720, borderRadius: "50%", background: "#6a4424", boxShadow: "0 40px 60px rgba(0,0,0,.6)" })}>
      {Array.from({ length: 50 }, (_, i) => i < n ? <div key={i} style={{ position: "absolute", left: 360 - (8 + i * 6.6), top: 360 - (8 + i * 6.6), width: 2 * (8 + i * 6.6), height: 2 * (8 + i * 6.6), borderRadius: "50%", border: `${i % 5 === 4 ? 3 : 1.5}px solid ${i % 2 ? "#8a5a30" : "#c89a64"}`, boxSizing: "border-box", background: i === 0 ? "#e8c890" : "transparent" }} /> : null)}
    </div>
    <div style={pos(1450, 560, `scale(${s})`, { fontWeight: 900, fontSize: 200, color: "#e8c890", textShadow: "0 10px 30px rgba(0,0,0,.6)", fontVariantNumeric: "tabular-nums" })}>{n}</div>
    <Big tt={tt} at={3.2} x={960} y={1010} txt="CINCUENTA AÑOS" size={88} col={AMB} />
  </>;
}}</Stage>;

// 39 · «Te ahorras fácil veinte dólares al mes»: un chanchito de barro recibe monedas de a una; se va hinchando y al final suelta un brillo
export const Piggy: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse 80% 70% at 50% 55%, #f4e2c8, #c49a6a 80%)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), n = Math.floor(cl((tt - 0.5) / 2.6) * 8), puff = 1 + 0.025 * n + 0.04 * Math.exp(-6 * Math.max(0, ((tt - 0.5) % 0.33)));
  return <>
    <Shadow x={960} y={860} w={560} s={s} />
    <div style={pos(960, 660, `scale(${s * puff})`, { width: 560, height: 420 })}>
      <div style={{ position: "absolute", left: 40, top: 40, width: 480, height: 340, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f8b8b0, #d8786a 70%)" }} />
      <div style={{ position: "absolute", left: 470, top: 150, width: 90, height: 100, borderRadius: "50%", background: "#e88a7a" }} />
      <div style={{ position: "absolute", left: 120, top: 10, width: 70, height: 80, borderRadius: "50% 50% 10% 50%", background: "#d8786a", transform: "rotate(-20deg)" }} />
      <div style={{ position: "absolute", left: 230, top: 44, width: 110, height: 16, borderRadius: 8, background: "#5a2a24" }} />
      {[110, 200, 330, 420].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 340, width: 50, height: 70, borderRadius: 12, background: "#c8685a" }} />)}
      <div style={{ position: "absolute", left: 420, top: 120, width: 20, height: 20, borderRadius: "50%", background: "#2a1410" }} />
    </div>
    {Array.from({ length: 8 }, (_, i) => { const a = 0.5 + i * 0.33, q = cl((tt - a) / 0.3);
      return q > 0 && q < 1 ? <div key={i} style={pos(960, 380 + 280 * q * q, `rotate(${90 * q}deg) scaleX(${1 - 0.6 * q})`)}><Coin d={90} v="$" /></div> : null; })}
    {tt > 3.2 && <div style={pos(960, 660, `scale(${1 + 2 * eio(tt, 3.2, 3.9)})`, { width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,240,180,.7),transparent 65%)", opacity: 1 - eio(tt, 3.2, 3.9) })} />}
    <Tape txt="+ 20 DÓLARES AL MES" x={960} y={180} s={sp(tt, 2.6)} size={60} col="#2a6a3a" rot={-2} />
  </>;
}}</Stage>;

// 40 · «Esos son los dólares que se quedan en tu bolsillo»: billetes doblados se deslizan dentro del bolsillo de un delantal y el bolsillo se abotona
export const Pocket: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="repeating-linear-gradient(90deg,#d8c4a0 0 40px,#cdb894 40px 80px)">{(tt) => {
  const s = sp(tt, 0.05, 4.5, 0.6), btn = cl(sp(tt, 2.8, 7, 0.4));
  return <>
    <div style={pos(960, 640, `scale(${s})`, { width: 760, height: 620, borderRadius: "30px 30px 120px 120px", background: "linear-gradient(180deg,#5a7a9a,#3a5a7a)", boxShadow: "inset 0 0 0 14px rgba(255,255,255,.1), 0 30px 50px rgba(0,0,0,.45)", overflow: "hidden" })}>
      {[0, 1, 2].map((i) => { const q = eio(tt, 0.4 + i * 0.6, 1.2 + i * 0.6);
        return <div key={i} style={{ position: "absolute", left: 180 + i * 60, top: -260 + 360 * q, width: 260, height: 140, borderRadius: 8, transform: `rotate(${-8 + i * 6}deg)`, background: "linear-gradient(90deg,#9ac08a,#c8e0b0 50%,#8ab07a)", border: "4px solid #5a8a4a", zIndex: 1 }}>
          <div style={{ margin: "30px auto", width: 70, height: 70, borderRadius: "50%", border: "4px solid #5a8a4a" }} />
        </div>; })}
      <div style={{ position: "absolute", left: 0, top: 180, width: 760, height: 440, background: "linear-gradient(180deg,#4a6a8a,#2a4a6a)", borderTop: "8px dashed rgba(255,255,255,.35)", zIndex: 2 }} />
      <div style={{ position: "absolute", left: 300, top: 120 - 40 * (1 - btn), width: 160, height: 120, borderRadius: "0 0 80px 80px", background: "#4a6a8a", zIndex: 3, opacity: cl(btn * 3) }}>
        <div style={{ position: "absolute", left: 60, top: 60, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#e8d8b0,#a88a5a)" }} />
      </div>
    </div>
    <Big tt={tt} at={2.4} x={960} y={150} txt="EN TU BOLSILLO" size={100} col="#2a3a5a" />
  </>;
}}</Stage>;
