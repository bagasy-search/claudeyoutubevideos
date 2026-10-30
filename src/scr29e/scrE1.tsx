// scr29e · componentes únicos 1-16 (minutos 0-9). Ninguno repetido con scr29a/b/c/d. Mismo escenario hkit: entrada con máscara, cámara curva, salida fundida.
import React from "react";
import { AMB, H, HAND, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

export const it = (h: H, i: number, d = 99) => (h.items?.[i]?.at as number | undefined) ?? d;
export const GRN = "#6fe39a", BLU = "#5aa8ff", OLV = "linear-gradient(180deg,#5d6a3c,#3c4626 70%,#2c341b)";
export const steel = "linear-gradient(90deg,#4f5257 0%,#9da2a9 22%,#d7dadf 34%,#8f949b 55%,#4c4f55 80%,#33353a 100%)";
export const abs = (l: number, tp: number, w: number, hh: number, s: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: l, top: tp, width: w, height: hh, ...s });
// llama dibujada: naranja (0) → azul (1), parpadeo lento ≤2 Hz
export const Flame: React.FC<{ x: number; y: number; w: number; hgt: number; blue: number; tt: number; on?: number }> = ({ x, y, w, hgt, blue, tt, on = 1 }) => {
  const c1 = blue > 0.5 ? "#dff0ff" : "#fff2c0", c2 = `rgb(${255 - 190 * blue},${140 + 30 * blue},${40 + 215 * blue})`;
  return <div style={abs(x - w / 2, y - hgt * on, w, hgt * on, { borderRadius: "50% 50% 42% 42%", background: `radial-gradient(ellipse at 50% 88%, ${c1}, ${c2} 45%, rgba(0,0,0,0) 74%)`, transform: `scaleY(${0.94 + 0.06 * Math.sin(tt * 2 * Math.PI * 1.3)})`, transformOrigin: "50% 100%", filter: `blur(${2 + 4 * (1 - blue)}px)` })} />;
};
// humo que sube lento (op = cuán negro)
export const Smoke: React.FC<{ x: number; y: number; n: number; tt: number; op: number; span?: number }> = ({ x, y, n, tt, op, span = 140 }) => <>
  {Array.from({ length: n }, (_, k) => <div key={k} style={abs(x + k * span, y - ((tt * 60 + k * 50) % 260), 200, 130, { borderRadius: "50%", background: `rgba(16,16,16,${op})`, filter: "blur(20px)" })} />)}
</>;
// la caja de munición verde oliva de costado (tapa con bisagra arriba, traba al frente, letras de esténcil)
export const Ammo: React.FC<{ x: number; y: number; w: number; hh: number; lid?: number; children?: React.ReactNode }> = ({ x, y, w, hh, lid = 0, children }) => (
  <div style={abs(x - w / 2, y - hh, w, hh)}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: OLV, boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 4px 0 rgba(255,255,255,.12)", overflow: "hidden" }}>
      <div style={abs(30, hh * 0.38, w - 60, hh * 0.2, { fontFamily: MARK, fontSize: hh * 0.16, color: "rgba(235,225,180,.55)", letterSpacing: 4, whiteSpace: "nowrap" })}>CAL .50 M2A1</div>
      {[0.22, 0.78].map((r) => <div key={r} style={abs(0, hh * r, w, 8, { background: "rgba(0,0,0,.25)" })} />)}
      {children}
    </div>
    <div style={abs(-10, -26, w + 20, 34, { borderRadius: 8, background: OLV, transformOrigin: "0% 100%", transform: `rotate(${-70 * lid}deg)`, boxShadow: "0 6px 0 rgba(0,0,0,.3)" })} />
    <div style={abs(w / 2 - 50, -16, 100, 40, { borderRadius: 8, background: "linear-gradient(180deg,#3a4224,#262c17)", opacity: 1 - lid })} />
  </div>
);
// panel solar: celdas azules en grilla, marco de aluminio, brillo que corre
export const Panel: React.FC<{ x: number; y: number; w: number; hh: number; tt: number; sun?: number }> = ({ x, y, w, hh, tt, sun = 1 }) => {
  const p = (tt * 18) % 160 - 30;
  return <div style={abs(x - w / 2, y - hh / 2, w, hh, { borderRadius: 8, background: "#c9ccd1", boxShadow: "0 40px 80px rgba(0,0,0,.55)" })}>
    <div style={{ position: "absolute", inset: Math.min(12, hh * 0.12), display: "grid", gridTemplateColumns: "repeat(6,1fr)", gridTemplateRows: `repeat(${hh > 120 ? 4 : 1},1fr)`, gap: 4, background: "#d6d9de" }}>
      {Array.from({ length: hh > 120 ? 24 : 6 }, (_, k) => <div key={k} style={{ background: "linear-gradient(135deg,#1c3f7a,#0f2550 60%,#183a70)", boxShadow: "inset 0 0 0 1px rgba(160,200,255,.18)" }} />)}
    </div>
    <div style={{ position: "absolute", inset: 12, background: `linear-gradient(115deg, transparent ${p - 10}%, rgba(255,255,255,${0.35 * sun}) ${p}%, transparent ${p + 10}%)` }} />
  </div>;
};
// el ventilador de PC de 80 mm: marco negro y aspas que giran (vel 0-1)
export const PcFan: React.FC<{ x: number; y: number; s: number; tt: number; vel: number }> = ({ x, y, s, tt, vel }) => (
  <div style={abs(x - s / 2, y - s / 2, s, s, { borderRadius: s * 0.12, background: "#1d1e21", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 0 0 3px #34363b" })}>
    <div style={abs(s * 0.08, s * 0.08, s * 0.84, s * 0.84, { borderRadius: "50%", background: "#0c0c0e" })} />
    <div style={abs(s / 2 - s * 0.4, s / 2 - s * 0.4, s * 0.8, s * 0.8, { transform: `rotate(${tt * 360 * 0.9 * vel}deg)` })}>
      {Array.from({ length: 7 }, (_, k) => <div key={k} style={abs(s * 0.4 - s * 0.07, 0, s * 0.14, s * 0.4, { borderRadius: "60% 20% 60% 20%", background: "#3a3c41", transformOrigin: `${s * 0.07}px ${s * 0.4}px`, transform: `rotate(${k * 51.4}deg) skewX(-14deg)`, filter: `blur(${3 * vel}px)` })} />)}
    </div>
    <div style={abs(s / 2 - s * 0.13, s / 2 - s * 0.13, s * 0.26, s * 0.26, { borderRadius: "50%", background: "#26282c", boxShadow: "inset 0 0 0 2px #45474c" })} />
  </div>
);
// batería sellada de moto: caja negra, bornes rojo y negro, barra de carga 0-1
export const Batt: React.FC<{ x: number; y: number; w: number; hh: number; lv: number; col?: string }> = ({ x, y, w, hh, lv, col }) => {
  const c = col ?? (lv > 0.5 ? GRN : lv > 0.25 ? AMB : RED);
  return <div style={abs(x - w / 2, y - hh, w, hh)}>
    <div style={abs(w * 0.16, -24, w * 0.14, 30, { borderRadius: 4, background: "#c8352b" })} />
    <div style={abs(w * 0.7, -24, w * 0.14, 30, { borderRadius: 4, background: "#222" })} />
    <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "linear-gradient(180deg,#2b2c30,#151619)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 4px 0 rgba(255,255,255,.1)", overflow: "hidden" }}>
      <div style={abs(w * 0.1, hh * 0.55, w * 0.8, hh * 0.22, { borderRadius: 6, background: "rgba(255,255,255,.08)" })}>
        <div style={{ width: `${lv * 100}%`, height: "100%", borderRadius: 6, background: c, boxShadow: `0 0 24px ${c}` }} />
      </div>
      <div style={abs(w * 0.1, hh * 0.16, w * 0.8, hh * 0.22, { fontFamily: MARK, fontSize: hh * 0.14, color: "rgba(255,255,255,.6)" })}>12V 7Ah</div>
    </div>
  </div>;
};
// el sol: disco con halo
export const Sun: React.FC<{ x: number; y: number; r: number; on?: number }> = ({ x, y, r, on = 1 }) => <div style={abs(x - r, y - r, r * 2, r * 2, { borderRadius: "50%", background: "radial-gradient(circle,#fff4c2,#ffc94a 55%,rgba(255,170,40,0) 72%)", transform: `scale(${on})`, opacity: cl(on * 2) })} />;

// ---- 0:06 · LA GARRAFA QUE SE VACÍA: tiembla vacía y su manómetro cae a cero; del otro lado suben un sol y la bandeja de aceite: GRATIS ----
export const HJerrycan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const shake = Math.sin(tt * 2 * Math.PI * 1.6) * 6 * (1 - eio(tt, 2.2, 3)), gauge = 1 - eio(tt, 0.6, 2.6), sun = phys(tt, it(h, 0), 6, 0.45), oil = phys(tt, it(h, 1), 6, 0.45);
  return <>
    <div style={abs(250, 300, 360, 520, { transform: `rotate(${shake}deg)`, transformOrigin: "50% 100%" })}>
      <div style={abs(0, 60, 360, 460, { borderRadius: "60px 60px 40px 40px", background: "linear-gradient(90deg,#c9ccd0,#f2f3f5 30%,#a9adb3 75%)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" })} />
      <div style={abs(110, 0, 140, 80, { borderRadius: "20px 20px 0 0", border: "16px solid #b9bcc1", borderBottom: "none" })} />
      <div style={abs(110, 220, 140, 140, { borderRadius: "50%", background: "#f4f1e8", boxShadow: "inset 0 0 0 8px #333" })}>
        <div style={abs(66, 20, 8, 52, { background: RED, transformOrigin: "4px 50px", transform: `rotate(${-110 + 220 * gauge}deg)` })} />
      </div>
    </div>
    <Tag tt={tt} at={1.2} x={430} y={900} txt="$25 · ONE WEEK" col={RED} size={60} />
    <Sun x={1250} y={330} r={150} on={sun} />
    <div style={abs(1400, 520, 300, 220, { transform: `translateY(${(1 - oil) * 300}px)`, opacity: cl(oil * 2), borderRadius: "10px 10px 60px 60px", background: "linear-gradient(90deg,#3d3f44,#7b7f86 40%,#3a3c41)" })}>
      <div style={abs(14, 14, 272, 60, { borderRadius: "50%", background: "radial-gradient(ellipse,#3a2408,#140b02)" })} />
    </div>
    <Tag tt={tt} at={it(h, 1) + 0.7} x={1420} y={900} txt="SUN + OIL = FREE" col={GRN} size={64} />
  </>;
}}</Stage>;

// ---- 0:23 · EL CAJÓN DE PIEZAS: cinco piezas de chatarra caen en un cajón de madera una por una, con su peso ----
export const HPartsbin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ats = [0.5, 1.6, it(h, 0), it(h, 1), it(h, 2)], P = ["AMMO CAN", "PIPE", "12V FAN", "20W PANEL", "BATTERY"];
  const draw = (i: number) => i === 0 ? <Ammo x={130} y={220} w={250} hh={150} /> : i === 1 ? <div style={abs(10, 120, 240, 70, { borderRadius: 35, background: steel })} /> : i === 2 ? <PcFan x={130} y={140} s={180} tt={tt} vel={0.2} /> : i === 3 ? <Panel x={130} y={140} w={250} hh={170} tt={tt} /> : <Batt x={130} y={220} w={210} hh={150} lv={0.9} />;
  return <>
    <div style={abs(160, 770, 1600, 250, { borderRadius: 14, background: "repeating-linear-gradient(90deg,#8a6339 0 120px,#7a5530 120px 124px)", boxShadow: "0 50px 90px rgba(0,0,0,.6), inset 0 10px 0 rgba(255,255,255,.12)" })} />
    {P.map((n, i) => { const s = phys(tt, ats[i], 7, 0.38), x = 230 + i * 300;
      return <div key={n} style={abs(x, 460 - (1 - s) * 700, 260, 300, { opacity: cl(s * 3), transform: `rotate(${(i % 2 ? 4 : -4) * (1 - s)}deg)` })}>
        {draw(i)}
        <div style={abs(0, 250, 260, 60, { fontWeight: 900, fontSize: 40, letterSpacing: 1, color: TX, textAlign: "center", textShadow: "0 4px 14px rgba(0,0,0,.7)", opacity: cl((tt - ats[i] - 0.3) * 3) })}>{n}</div>
      </div>; })}
    <Tag tt={tt} at={ats[4] + 1.2} x={960} y={180} txt="NO GAS LINE · NO CORD · NO BILL" col={AMB} size={58} />
  </>;
}}</Stage>;

// ---- 2:02 · LA LUZ DE NOCHE: un enchufe con lucecita al lado del ventilador; sus barras de consumo quedan parejas; después el panel llena una barra tres veces más alta ----
export const HNightlight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const b1 = eio(tt, 0.6, 2), b2 = eio(tt, it(h, 1) - 0.3, it(h, 1) + 1.5);
  const bar = (x: number, v: number, max: number, col: string, lab: string) => <><div style={abs(x, 860 - v * max, 170, v * max, { borderRadius: "14px 14px 0 0", background: col, boxShadow: `0 0 40px ${col}` })} /><div style={abs(x - 35, 885, 240, 60, { fontWeight: 900, fontSize: 38, color: TX, textAlign: "center" })}>{lab}</div></>;
  return <>
    <div style={abs(100, 260, 300, 420, { borderRadius: 26, background: "#ece8df", boxShadow: "0 30px 60px rgba(0,0,0,.5)" })}>
      <div style={abs(70, 260, 160, 22, { borderRadius: 11, background: "#bdb6a8" })} /><div style={abs(70, 320, 160, 22, { borderRadius: 11, background: "#bdb6a8" })} />
      <div style={abs(80, 50, 140, 190, { borderRadius: "50px 50px 20px 20px", background: "radial-gradient(circle,#fff6d0,#ffd36a 60%,#d1a03a)", boxShadow: `0 0 ${60 * b1}px #ffd36a` })} />
    </div>
    <PcFan x={560} y={460} s={330} tt={tt} vel={0.8} />
    {bar(790, b1, 200, AMB, "FAN 3W")}
    {bar(1050, b1, 190, "#ffd36a", "LIGHT")}
    {bar(1430, b2, 600, GRN, "PANEL 90Wh")}
    <Tag tt={tt} at={it(h, 0)} x={940} y={500} txt="30 Wh / 10 h" col={TX} size={56} />
    <Tag tt={tt} at={it(h, 1) + 1.2} x={1660} y={330} txt="×3" col={GRN} size={110} />
  </>;
}}</Stage>;

// ---- 2:33 · EL FUELLE: un fuelle de herrero de cuero sopla sobre una llama amarilla y sucia; con cada soplido se limpia hasta quedar azul ----
export const HBellows: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const pump = 0.5 + 0.5 * Math.sin(tt * 2 * Math.PI * 0.8), blue = eio(tt, 1, it(h, 0) + 0.6);
  return <>
    <div style={abs(260, 380, 520, 320, { transform: `rotate(-12deg) scaleY(${0.7 + 0.3 * pump})`, transformOrigin: "100% 50%" })}>
      <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0,100% 38%,100% 62%,0 100%)", background: "repeating-linear-gradient(90deg,#6b3f1f 0 40px,#55301a 40px 46px)" }} />
      <div style={abs(-80, 140, 120, 40, { borderRadius: 20, background: "#3a2a1a" })} />
    </div>
    <div style={abs(760, 520, 220, 34, { borderRadius: 17, background: steel, transform: "rotate(-12deg)" })} />
    <Smoke x={1000} y={500} n={5} tt={tt} op={0.5 * (1 - blue)} span={40} />
    <Flame x={1240} y={760} w={240} hgt={360} blue={blue} tt={tt} />
    {Array.from({ length: 6 }, (_, k) => <div key={k} style={abs(900 + ((tt * 300 + k * 60) % 300), 560 + k * 8, 50, 6, { borderRadius: 3, background: `rgba(200,230,255,${0.5 * pump})` })} />)}
    <Tag tt={tt} at={1.4} x={1240} y={300} txt="THE FAN IS NOT THE HEATER" col={TX} size={52} />
    <Tag tt={tt} at={it(h, 0) + 0.4} x={1240} y={900} txt="IT'S THE BELLOWS" col={BLU} size={66} />
  </>;
}}</Stage>;

// ---- 3:07 · EL IMÁN: un imán de herradura baja sobre dos cajas; en la de acero queda pegado con chispa; en la de plástico resbala y cae ----
export const HMagnet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const d1 = phys(tt, it(h, 0) - 0.8, 8, 0.5), d2 = eio(tt, it(h, 1) - 0.8, it(h, 1)), fall = eio(tt, it(h, 1) + 0.2, it(h, 1) + 1.2);
  const mag = (x: number, y: number, rot = 0) => <div style={abs(x - 90, y - 176, 180, 176, { transform: `rotate(${rot}deg)` })}>
    <div style={{ position: "absolute", inset: 0, bottom: 36, borderRadius: "90px 90px 0 0", border: "46px solid #d4382c", borderBottom: "none" }} />
    <div style={abs(0, 140, 46, 36, { background: "#cfd3d8" })} /><div style={abs(134, 140, 46, 36, { background: "#cfd3d8" })} />
  </div>;
  return <>
    <Ammo x={520} y={860} w={560} hh={300} />
    <div style={abs(1180, 560, 560, 300, { borderRadius: 14, background: "linear-gradient(180deg,#6d7a46,#55603a)", boxShadow: "0 40px 80px rgba(0,0,0,.55)" })}><div style={abs(30, 110, 500, 80, { fontFamily: MARK, fontSize: 52, color: "rgba(255,255,255,.35)" })}>PLASTIC</div></div>
    {mag(520, 200 + 356 * d1)}
    {mag(1460 + 260 * fall, 200 + 356 * d2 + 300 * fall, 60 * fall)}
    <div style={abs(480, 520, 80, 80, { borderRadius: "50%", background: "radial-gradient(circle,#fff,#ffd36a 40%,transparent 70%)", opacity: cl(1 - Math.abs(tt - it(h, 0) - 0.1) * 3) })} />
    <Tag tt={tt} at={it(h, 0) + 0.3} x={520} y={960} txt="STICKS = STEEL" col={GRN} size={58} />
    <Tag tt={tt} at={it(h, 1) + 0.6} x={1460} y={960} txt="FALLS = PUT IT BACK" col={RED} size={58} />
  </>;
}}</Stage>;

// ---- 3:24 · LA JUNTA DE GOMA: la tapa abierta de frente; la goma negra se pone roja y larga humo negro… se enfría y sale en una sola tira larga ----
export const HPeel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const heat = eio(tt, it(h, 0) - 0.4, it(h, 0) + 1.2) * (1 - eio(tt, it(h, 1) - 1.2, it(h, 1) - 0.5)), peel = eio(tt, it(h, 1), it(h, 1) + 2.6);
  return <>
    <div style={abs(260, 300, 1400, 520, { borderRadius: 16, background: OLV, boxShadow: "0 50px 90px rgba(0,0,0,.6)", transform: "perspective(1800px) rotateX(38deg)" })}>
      <div style={abs(40, 40, 1320, 440, { borderRadius: 10, background: "#2f3620", boxShadow: "inset 0 0 0 18px #3f4829" })} />
      <div style={abs(50, 50, 1300 * (1 - peel), 18, { borderRadius: 9, background: `rgb(${20 + 160 * heat},${20 + 40 * heat},20)`, boxShadow: heat > 0.1 ? `0 0 30px rgba(255,90,30,${heat})` : "none" })} />
      <div style={abs(50, 412, 1300 * (1 - peel), 18, { borderRadius: 9, background: `rgb(${20 + 160 * heat},${20 + 40 * heat},20)` })} />
    </div>
    <Smoke x={320} y={300} n={7} tt={tt} op={0.7 * heat} span={180} />
    {/* el destornillador y la tira que cuelga */}
    <div style={abs(1600, 200, 30, 380, { borderRadius: 8, background: "linear-gradient(180deg,#d2b13a 0 55%,#cfd3d8 55%)", transform: `rotate(${20 - 10 * peel}deg)`, opacity: cl(peel * 4) })} />
    <svg width={600} height={760} style={{ position: "absolute", left: 1200, top: 260, opacity: cl(peel * 4) }}><path d={`M 420 40 Q ${300 - 200 * peel} 300 ${200 - 120 * peel} ${200 + 460 * peel}`} stroke="#9a9a9a" strokeWidth={34} fill="none" strokeLinecap="round" /><path d={`M 420 40 Q ${300 - 200 * peel} 300 ${200 - 120 * peel} ${200 + 460 * peel}`} stroke="#141414" strokeWidth={24} fill="none" strokeLinecap="round" /></svg>
    <Tag tt={tt} at={it(h, 1) + 0.6} x={1080} y={800} txt="RUBBER GASKET" col={TX} size={50} anchor="l" />
    <Tag tt={tt} at={it(h, 0) + 0.6} x={960} y={160} txt="BURNING RUBBER = BAD AIR" col={RED} size={54} />
    <Tag tt={tt} at={it(h, 1) + 1.2} x={760} y={930} txt="PEEL IT OUT · ONE PIECE" col={GRN} size={62} />
  </>;
}}</Stage>;

// ---- 4:17 · LA QUEMA AL AIRE LIBRE: la caja abierta en el pasto con fuego de leña; un reloj pinta media vuelta; la pintura de adentro pasa de verde a gris quemado ----
export const HBurnout: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const burn = eio(tt, 1, it(h, 0) + 2.5), turn = 180 * eio(tt, it(h, 0) - 0.5, it(h, 0) + 2.5);
  return <>
    <div style={abs(0, 0, 1920, 760, { background: "linear-gradient(180deg,#1c2430,#2c3644)" })} />
    <div style={abs(0, 760, 1920, 320, { background: "linear-gradient(180deg,#1f2e16,#121b0c)" })} />
    <Ammo x={760} y={860} w={620} hh={300} lid={0.95}>
      <div style={abs(20, 40, 580, 240, { borderRadius: 8, background: `rgb(${88 - 30 * burn},${100 - 50 * burn},${56 - 10 * burn})` })} />
    </Ammo>
    <Flame x={700} y={620} w={200} hgt={260} blue={0} tt={tt} />
    <Flame x={830} y={620} w={160} hgt={200} blue={0} tt={tt + 0.3} />
    <div style={abs(1300, 260, 340, 340, { borderRadius: "50%", background: "#f2ede0", boxShadow: "0 30px 60px rgba(0,0,0,.4), inset 0 0 0 12px #3b3b3b" })}>
      <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: `conic-gradient(rgba(255,120,40,.6) 0deg ${turn}deg, transparent ${turn}deg)` }} />
      <div style={abs(164, 50, 12, 130, { background: "#222", transformOrigin: "6px 120px", transform: `rotate(${turn}deg)` })} />
    </div>
    <Tag tt={tt} at={it(h, 0) + 0.4} x={1470} y={680} txt="30 MIN · OUTSIDE · ONCE" col={AMB} size={50} />
  </>;
}}</Stage>;

// ---- 4:33 · LA PUERTITA: cuatro agujeros en las esquinas, una línea de disco los une y la chapa se abre sobre su bisagra de dos bulones ----
export const HHatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const holes = [0, 1, 2, 3].map((k) => cl((tt - it(h, 0) - k * 0.3) * 3)), cut = eio(tt, it(h, 0) + 1.4, it(h, 1) - 0.3), open = phys(tt, it(h, 1) + 0.5, 5, 0.5);
  const S = 420, X = 750, Y = 330, C = [[0, 0], [S, 0], [S, S], [0, S]];
  return <>
    <div style={abs(300, 200, 1320, 700, { borderRadius: 20, background: OLV, boxShadow: "0 50px 90px rgba(0,0,0,.6)" })} />
    <div style={abs(X, Y, S, S, { background: "#0b0b0a", boxShadow: "inset 0 0 60px rgba(255,120,40,.35)", opacity: cl(open * 3) })} />
    <div style={abs(X, Y, S, S, { background: OLV, transformOrigin: "0% 50%", transform: `perspective(1400px) rotateY(${-100 * open}deg)`, boxShadow: open > 0 ? "10px 0 30px rgba(0,0,0,.5)" : "none" })} />
    <svg width={S + 40} height={S + 40} style={{ position: "absolute", left: X - 20, top: Y - 20 }}>
      <rect x={20} y={20} width={S} height={S} fill="none" stroke="#ffcf6a" strokeWidth={6} strokeDasharray={`${4 * S * cut} ${4 * S}`} opacity={1 - cl(open * 2)} />
      {C.map(([cx, cy], k) => <circle key={k} cx={20 + cx} cy={20 + cy} r={16 * holes[k]} fill="#0b0b0a" stroke="#888" strokeWidth={3} />)}
    </svg>
    {[0.2, 0.8].map((r) => <div key={r} style={abs(X - 34, Y + S * r - 20, 50, 40, { borderRadius: 8, background: steel, opacity: cl(open * 4) })} />)}
    <Tag tt={tt} at={0.8} x={960} y={140} txt="3 × 3 INCHES" col={AMB} size={56} />
    <Tag tt={tt} at={it(h, 1) + 1.4} x={960} y={970} txt="LIGHT IT · WATCH IT" col={TX} size={56} />
  </>;
}}</Stage>;

// ---- 5:06 · LA SARTÉN VS LA TARTERA: tapa de caño, sartén de hierro sin mango y tartera fina; la llama las calienta y la tartera se pone roja y se agujerea ----
export const HPiepan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const heat = eio(tt, it(h, 1) - 1, it(h, 1) + 1.2), hole = cl((tt - it(h, 1) - 1) * 1.5);
  const B: [string, string, number][] = [["PIPE CAP", "#4a4c51", 0.5], ["CAST IRON", "#2a2a2c", it(h, 0)], ["PIE PAN", "#c4c8cd", it(h, 1) - 1.6]];
  return <>
    {B.map(([n, c, at], i) => { const s = phys(tt, at, 7, 0.4), x = 420 + i * 540, thin = i === 2;
      return <div key={n} style={{ position: "absolute", left: x - 200, top: 520 - (1 - s) * 500, opacity: cl(s * 3) }}>
        <Flame x={200} y={0} w={120} hgt={130} blue={0.6} tt={tt + i} />
        <div style={abs(0, 0, 400, thin ? 70 : 150, { borderRadius: "0 0 180px 180px / 0 0 90px 90px", background: thin ? `rgb(${196 + 59 * heat},${200 - 120 * heat},${205 - 160 * heat})` : `linear-gradient(180deg,${c},#141416)`, boxShadow: `0 40px 70px rgba(0,0,0,.6)${thin && heat > 0.2 ? `, 0 0 ${80 * heat}px #ff5a2a` : ""}` })} />
        {thin && <div style={abs(160, 16, 80 * hole, 36 * hole, { borderRadius: "50%", background: "#000", boxShadow: "0 0 18px #ff7a2a" })} />}
        <div style={abs(0, 190, 400, 70, { fontFamily: HAND, fontWeight: 700, fontSize: 58, color: TX, textAlign: "center" })}>{n}</div>
      </div>; })}
    <Tag tt={tt} at={1.6} x={700} y={260} txt="THICK · 5 INCHES" col={GRN} size={56} />
    <Tag tt={tt} at={it(h, 1) + 1.4} x={1460} y={900} txt="BURNS THROUGH IN A WEEK" col={RED} size={46} />
  </>;
}}</Stage>;

// ---- 5:24 · EL CAÑO PERFORADO: un caño de 2" gira mientras una mecha marca filas de agujeros de abajo para arriba, empezando a dos pulgadas ----
export const HPerforate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const rows = 6, done = eio(tt, 0.6, it(h, 1) + 1.4) * rows;
  return <>
    <div style={abs(820, 120, 280, 820, { borderRadius: 30, background: steel, boxShadow: "0 50px 90px rgba(0,0,0,.6)", overflow: "hidden" })}>
      {Array.from({ length: rows }, (_, r) => Array.from({ length: 5 }, (_, c) => { const x = c * 64 + ((tt * 30) % 64) - 32;
        return cl(done - r) > 0.5 ? <div key={r + "-" + c} style={abs(x, 620 - r * 90, 30, 30, { borderRadius: "50%", background: "#080809", boxShadow: "inset 0 3px 4px rgba(255,255,255,.25)" })} /> : null; }))}
    </div>
    <div style={abs(1130, 620 - Math.min(rows - 1, Math.floor(done)) * 90 + 114, 380, 40, { borderRadius: 20, background: "repeating-linear-gradient(90deg,#d8dbe0 0 18px,#8d9198 18px 26px)", boxShadow: "0 10px 20px rgba(0,0,0,.5)", opacity: done < rows ? 1 : 0 })} />
    <svg width={140} height={900} style={{ position: "absolute", left: 640, top: 120 }}><path d="M 100 820 L 100 640 M 80 820 L 120 820 M 80 640 L 120 640" stroke={AMB} strokeWidth={6} /></svg>
    <Tag tt={tt} at={it(h, 1)} x={600} y={850} txt={`2"`} col={AMB} size={70} />
    <Tag tt={tt} at={it(h, 0)} x={1200} y={110} txt={`1/4" HOLES`} col={TX} size={60} anchor="l" />
  </>;
}}</Stage>;

// ---- 5:40 · EL CHORRO: corte de la caja; el aire entra por abajo, sube por el caño y sale por cada agujero; el humo se come y la llama se vuelve chorro azul ----
export const HJet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const air = eio(tt, 0.4, it(h, 0)), blue = eio(tt, it(h, 0), it(h, 1));
  return <>
    <div style={abs(360, 200, 1200, 700, { borderRadius: 18, border: "26px solid #4b5630", background: "#120f0b" })} />
    <Flame x={960} y={830} w={460} hgt={300 + 140 * blue} blue={blue} tt={tt} />
    <div style={abs(890, 300, 140, 560, { background: "rgba(200,205,212,.18)", borderLeft: "10px solid #9aa0a7", borderRight: "10px solid #9aa0a7" })} />
    <div style={abs(700, 820, 520, 70, { borderRadius: "0 0 260px 260px / 0 0 60px 60px", background: "#2a2a2c" })} />
    {Array.from({ length: 5 }, (_, k) => <div key={k} style={abs(950, 1000 - ((tt * 260 + k * 140) % 700), 20, 50, { borderRadius: 10, background: ICE, opacity: air * 0.8 })} />)}
    {Array.from({ length: 10 }, (_, k) => { const y = 380 + (k >> 1) * 90, sd = k % 2 ? 1 : -1, p = (tt * 1.4 + k * 0.17) % 1;
      return <div key={k} style={abs(960 + sd * (80 + 120 * p) - 20, y, 40, 10, { borderRadius: 5, background: ICE, opacity: air * (1 - p) })} />; })}
    <Smoke x={700} y={260} n={4} tt={tt} op={0.6 * (1 - blue)} />
    <Tag tt={tt} at={it(h, 0) + 0.5} x={1720} y={420} txt="EXTRA AIR" col={ICE} size={52} />
    <Tag tt={tt} at={it(h, 1) + 0.5} x={1720} y={620} txt="BURNS THE SMOKE" col={BLU} size={48} />
  </>;
}}</Stage>;

// ---- 6:30 · EL VENTILADOR DERRETIDO: el termómetro sube con el ventilador pegado a la estufa y el plástico se chorrea; el ventilador se aleja a su caja fría con malla ----
export const HMeltdown: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const temp = eio(tt, 0.4, it(h, 0) + 0.6), melt = eio(tt, it(h, 0), it(h, 0) + 1.6), away = eio(tt, it(h, 1) - 0.4, it(h, 1) + 1.0), mesh = cl((tt - it(h, 2)) * 2);
  const fx = 780 + 520 * away, m = melt * (1 - away);
  return <>
    <Ammo x={460} y={800} w={480} hh={360} />
    <Flame x={460} y={420} w={200} hgt={60} blue={0.5} tt={tt} />
    <div style={abs(fx - 160, 470, 320, 320, { borderRadius: 30, background: "#7d8288", boxShadow: "0 30px 60px rgba(0,0,0,.5)", opacity: away })} />
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${40 * m}px)`, filter: `sepia(${m}) saturate(${1 + m})` }}><PcFan x={fx} y={630} s={260} tt={tt} vel={1 - m} /></div>
    <div style={abs(fx - 130, 500, 260, 260, { background: "repeating-linear-gradient(45deg,rgba(220,220,220,.5) 0 2px,transparent 2px 14px),repeating-linear-gradient(-45deg,rgba(220,220,220,.5) 0 2px,transparent 2px 14px)", opacity: mesh })} />
    <div style={abs(1700, 200, 70, 560, { borderRadius: 35, background: "#eee", boxShadow: "inset 0 0 0 6px #bbb" })}>
      <div style={abs(20, 520 - 480 * temp * (1 - away * 0.7), 30, 480 * temp * (1 - away * 0.7), { borderRadius: 15, background: RED })} />
    </div>
    <Tag tt={tt} at={it(h, 0) + 0.2} x={1560} y={840} txt="140°F = DEAD FAN" col={RED} size={46} />
    <div style={abs(700, 600, Math.max(0, fx - 160 - 700), 70, { background: "repeating-linear-gradient(90deg,#c9ccd1 0 10px,#8d9198 10px 16px)", borderRadius: 12, opacity: away })} />
    <div style={abs(700, 540, Math.max(0, fx - 160 - 700), 6, { background: GRN, opacity: away })} />
    <Tag tt={tt} at={it(h, 1) + 0.8} x={(700 + fx - 160) / 2} y={330} txt="ONE FOOT OF DUCT" col={GRN} size={56} />
  </>;
}}</Stage>;

// ---- 7:38 · EL PORTAPAPELES: una tabla con clip y cuatro casilleros; cada regla se tilda con birome ----
export const HClipboard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const R: [string, number][] = [["CHIMNEY OUTSIDE", 0.7], ["CO ALARM ON THE WALL", it(h, 0)], ["EXTINGUISHER BY THE DOOR", it(h, 1)], ["NEVER IN A BEDROOM", it(h, 2)]];
  return <>
    <div style={abs(520, 110, 880, 900, { borderRadius: 20, background: "linear-gradient(180deg,#a87b4c,#8a6136)", boxShadow: "0 50px 90px rgba(0,0,0,.6)", transform: "rotate(-2deg)" })}>
      <div style={abs(330, -30, 220, 80, { borderRadius: 12, background: steel })} />
      <div style={abs(50, 80, 780, 780, { background: "#f5f1e6", borderRadius: 6 })}>
        {R.map(([txt, at], i) => { const c = eio(tt, at, at + 0.5);
          return <div key={txt} style={abs(40, 70 + i * 170, 700, 120)}>
            <div style={abs(0, 10, 90, 90, { border: "6px solid #2a2a2a", borderRadius: 10 })} />
            <svg width={120} height={110} style={{ position: "absolute", left: 4, top: -6 }}><path d="M 14 60 L 44 92 L 108 10" stroke={i === 3 ? RED : "#1f6f3a"} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={160} strokeDashoffset={160 * (1 - c)} /></svg>
            <div style={abs(130, 20, 580, 80, { fontFamily: HAND, fontSize: 50, color: "#22201c", opacity: cl(c * 2 + 0.25) })}>{txt}</div>
          </div>; })}
      </div>
    </div>
    <Tag tt={tt} at={0.4} x={1680} y={300} txt="ONE TIME" col={AMB} size={60} />
  </>;
}}</Stage>;

// ---- 8:31 · LA BRÚJULA: globo con el hemisferio norte iluminado y la aguja al sur; se ilumina el sur y la aguja gira al norte ----
export const HCompass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const flip = eio(tt, it(h, 0) - 0.2, it(h, 0) + 0.9), wob = 8 * Math.sin(tt * 3) * Math.exp(-tt * 0.8);
  return <>
    <div style={abs(160, 220, 640, 640, { borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#4b88c4,#1a3c66 70%)", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.6)" })}>
      <div style={abs(0, 0, 640, 320, { background: `rgba(255,220,120,${0.35 * (1 - flip)})` })} />
      <div style={abs(0, 320, 640, 320, { background: `rgba(255,220,120,${0.35 * flip})` })} />
      <div style={abs(0, 316, 640, 8, { background: "rgba(255,255,255,.5)" })} />
    </div>
    <div style={abs(1000, 200, 680, 680, { borderRadius: "50%", background: "radial-gradient(circle,#f3ead2,#d8c79e)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 0 0 30px #a57b35" })}>
      {["N", "E", "S", "W"].map((d, k) => <div key={d} style={abs(310 + 230 * Math.sin((k * Math.PI) / 2), 300 - 230 * Math.cos((k * Math.PI) / 2), 60, 80, { fontFamily: MARK, fontSize: 64, color: "#3a2a12", textAlign: "center" })}>{d}</div>)}
      <div style={abs(320, 80, 40, 520, { transform: `rotate(${180 * (1 - flip) + wob}deg)`, transformOrigin: "20px 260px", clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)", background: `linear-gradient(180deg,${RED} 50%,#e8e8e8 50%)` })} />
    </div>
    <Tag tt={tt} at={0.8} x={480} y={940} txt="NORTH: FACE SOUTH" col={AMB} size={42} />
    <Tag tt={tt} at={it(h, 0) + 0.6} x={1340} y={960} txt="SOUTH: FACE NORTH" col={ICE} size={42} />
  </>;
}}</Stage>;

// ---- 8:44 · EL TRANSPORTADOR: el panel se inclina sobre un transportador gigante: 40° + 15 = 55°; abajo el panel plano junta nieve ----
export const HProtractor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const ang = 40 * eio(tt, 0.5, 1.6) + 15 * eio(tt, it(h, 0) - 0.6, it(h, 0) + 0.4), snow = eio(tt, it(h, 2) - 0.3, it(h, 2) + 1.5), flat = eio(tt, it(h, 1) - 0.4, it(h, 1) + 0.4);
  return <>
    <svg width={1000} height={560} style={{ position: "absolute", left: 160, top: 300 }}>
      <path d="M 40 520 A 460 460 0 0 1 960 520 Z" fill="rgba(240,230,200,.12)" stroke="#e6dcc0" strokeWidth={6} />
      {Array.from({ length: 19 }, (_, k) => { const a = Math.PI - (k * Math.PI) / 18, r2 = k % 9 ? 410 : 380; return <line key={k} x1={500 + 440 * Math.cos(a)} y1={520 - 440 * Math.sin(a)} x2={500 + r2 * Math.cos(a)} y2={520 - r2 * Math.sin(a)} stroke="#e6dcc0" strokeWidth={4} />; })}
    </svg>
    <div style={abs(660, 800, 560, 70, { transformOrigin: "0% 50%", transform: `rotate(${-ang}deg)` })}><Panel x={280} y={35} w={560} hh={70} tt={tt} /></div>
    <Sun x={1620} y={600} r={90} />
    <Tag tt={tt} at={1.2} x={640} y={1000} txt="LATITUDE 40°" col={TX} size={48} />
    <Tag tt={tt} at={it(h, 0) + 0.2} x={1100} y={200} txt={`+15 = ${Math.round(ang)}°`} col={AMB} size={80} />
    <div style={abs(1300, 920, 500, 50, { opacity: flat })}><Panel x={250} y={25} w={500} hh={50} tt={tt} sun={0.3} /><div style={abs(-10, -40 * snow, 520, 40 * snow + 10, { borderRadius: "40px 40px 6px 6px", background: "#f4f7fb" })} /></div>
    <Tag tt={tt} at={it(h, 1) + 0.4} x={1550} y={1035} txt="FLAT = HALF · AND SNOW" col={RED} size={44} />
  </>;
}}</Stage>;
