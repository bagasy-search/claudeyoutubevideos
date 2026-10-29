// scr29a · componentes únicos 1-17 (minutos 0-8). Cada uno es el OBJETO de la idea, en el escenario común (hkit.Stage),
// con los elementos llegando de a uno en su palabra (items[].at = segundos desde h.at) y salida fundida hacia atrás.
import React from "react";
import { AMB, DIM, H, HAND, ICE, MARK, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const it = (h: H, i: number, d = 99) => (h.items?.[i]?.at as number | undefined) ?? d;
const steel = "linear-gradient(90deg,#3a3d42 0%,#8a9098 22%,#c9ced4 34%,#6b7077 55%,#2e3135 100%)";

// ---- 0:23 · EL MÚLTIPLE DE COBRE: una gota de aceite cae, se reparte en 4 caños y cada caño enciende su foto en su palabra ----
export const HManifold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const drop = eio(tt, 0.2, 1.2), X = [330, 750, 1170, 1590];
  const fill = (i: number) => eio(tt, it(h, i) - 0.5, it(h, i) + 0.25);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs><linearGradient id="cu" x1="0" x2="1"><stop offset="0" stopColor="#7a3f1c" /><stop offset=".4" stopColor="#e39a62" /><stop offset=".6" stopColor="#c97a45" /><stop offset="1" stopColor="#5e2f14" /></linearGradient></defs>
      <rect x={930} y={300} width={60} height={110} rx={12} fill="url(#cu)" />
      {X.map((x, i) => { const d = `M 960 400 C 960 470 ${x} 470 ${x} 560`; return <g key={i}>
        <path d={d} fill="none" stroke="#3a1d0c" strokeWidth={34} strokeLinecap="round" />
        <path d={d} fill="none" stroke="url(#cu)" strokeWidth={26} strokeLinecap="round" />
        <path d={d} fill="none" stroke="#ffb257" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${fill(i)} 1`} opacity={0.95} style={{ filter: "drop-shadow(0 0 10px #ff9a3a)" }} />
      </g>; })}
      <ellipse cx={960} cy={140 + drop * 190} rx={22} ry={30} fill="#0d0a07" stroke="rgba(255,255,255,.35)" strokeWidth={2} opacity={drop < 1 ? 1 : 0} />
      <ellipse cx={952} cy={130 + drop * 190} rx={6} ry={9} fill="rgba(255,255,255,.55)" opacity={drop < 1 ? 1 : 0} />
    </svg>
    {X.map((x, i) => { const s = phys(tt, it(h, i) - 0.15, 6, 0.45), on = fill(i);
      return <div key={i} style={{ position: "absolute", left: x, top: 760, transform: `translate(-50%,-50%) translateY(${(1 - s) * 80}px) scale(${0.85 + 0.15 * cl(s)})`, opacity: cl(0.25 + s), filter: `brightness(${0.35 + 0.65 * on}) saturate(${0.3 + 0.7 * on})` }}>
        <Photo id={h.imgs?.[i] ?? h.img} w={340} h={240} />
        <div style={{ textAlign: "center", marginTop: 18, fontWeight: 900, fontSize: 46, letterSpacing: 3, color: on > 0.5 ? AMB : DIM }}>{h.items![i].txt}</div>
      </div>; })}
    <Tag tt={tt} at={0.4} x={960} y={110} txt="ONE QUART OF OIL" size={44} />
  </>;
}}</Stage>;

// ---- 0:35 · EL CANDADO DEL 4: un gabinete de chapa con un «4» estarcido, el candado se sacude, la puerta deja ver luz y se cierra ----
export const HPadlock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = phys(tt, 0.1, 4.5, 0.5), rattle = Math.sin(tt * 26) * 7 * Math.max(0, 1 - Math.abs(tt - 2.4) / 0.9);
  const crack = 34 * Math.max(0, Math.sin(Math.PI * cl((tt - 2.0) / 4.2)));
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, width: 760, height: 820, marginLeft: -380, marginTop: -410, transform: `translateY(${(1 - s) * -900}px)` }}>
      {/* el interior: las botas iluminadas que se ven por la rendija */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 10, overflow: "hidden", background: "#2a1a0d" }}><Photo id={h.img} w={760} h={820} r={10} /><div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 60% 50%, rgba(255,170,80,.35), rgba(0,0,0,.6))" }} /></div>
      {/* las dos hojas de la puerta; la derecha se abre una rendija */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 380, height: 820, background: "linear-gradient(180deg,#4f565e,#2d3238)", borderRadius: "10px 0 0 10px", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.08), 20px 0 40px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: 380 + crack, top: 0, width: 380, height: 820, background: "linear-gradient(180deg,#535a62,#2f343a)", borderRadius: "0 10px 10px 0", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.08)", transform: `perspective(1600px) rotateY(${-crack * 0.25}deg)`, transformOrigin: "100% 50%" }} />
      <div style={{ position: "absolute", left: 380 + crack / 2 - 2, top: 0, width: crack, height: 820, background: "linear-gradient(90deg, rgba(255,190,110,.0), rgba(255,190,110,.55), rgba(255,190,110,0))", filter: "blur(6px)" }} />
      {/* el 4 estarcido */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontWeight: 900, fontSize: 340, lineHeight: 1, color: "rgba(255,178,87,.9)", textShadow: "0 8px 0 rgba(0,0,0,.35), 0 0 30px rgba(255,178,87,.25)" }}>4</div>
      {/* cadena y candado */}
      <div style={{ position: "absolute", left: 380 - 110, top: 470, width: 220, display: "flex", justifyContent: "space-between", transform: `rotate(${rattle * 0.3}deg)` }}>
        {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ width: 34, height: 22, borderRadius: 12, border: "7px solid #b8bec6", transform: `rotate(${i % 2 ? 90 : 0}deg)` }} />)}
      </div>
      <div style={{ position: "absolute", left: 380, top: 520, transform: `translateX(-50%) rotate(${rattle}deg)`, transformOrigin: "50% -40px" }}>
        <div style={{ width: 90, height: 80, margin: "0 auto", borderRadius: "45px 45px 0 0", border: "16px solid #c9ced4", borderBottom: "none", marginBottom: -4 }} />
        <div style={{ width: 150, height: 130, borderRadius: 18, background: "linear-gradient(160deg,#ffd27a,#b8822c 60%,#7a5418)", boxShadow: "0 20px 40px rgba(0,0,0,.6), inset 0 3px 0 rgba(255,255,255,.4)" }}>
          <div style={{ width: 22, height: 44, margin: "0 auto", position: "relative", top: 40, borderRadius: 11, background: "#3a2608" }} />
        </div>
      </div>
    </div>
    <Tag tt={tt} at={0.8} x={300} y={300} txt="FUNCTION 4" col={AMB} size={54} />
    <Tag tt={tt} at={5.5} x={1620} y={780} txt="LATER…" col={DIM} size={44} />
  </>;
}}</Stage>;

// ---- 0:53 · LA FILA DE ESTUFAS: seis siluetas distintas en fila, un reflector las barre y todas se apagan menos una, que da un paso adelante ----
const SIL: string[] = [
  "M -60 120 L -60 -70 Q 0 -110 60 -70 L 60 120 Z",                 // tambor
  "M -40 120 L -40 -20 L 40 -20 L 40 120 Z M -15 -20 L -15 -120 L 15 -120 L 15 -20 Z",   // cohete
  "M -70 120 L -70 0 L 70 0 L 70 120 Z M 20 0 L 20 -130 L 45 -130 L 45 0 Z",            // caja
  "M -45 120 L -45 -60 Q 0 -100 45 -60 L 45 120 Z",                 // tanque (el elegido)
  "M -55 120 L -55 30 L 55 30 L 55 120 Z",                         // lata
  "M -65 120 L -65 -40 L 65 -40 L 65 120 Z M -10 -40 L -10 -125 L 10 -125 L 10 -40 Z",   // barril con caño
];
export const HLineup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sweep = eio(tt, 0.8, 4.6), pick = phys(tt, it(h, 0) - 0.6, 5, 0.5), X = (i: number) => 330 + i * 252;
  const spotX = 330 + sweep * 1260 * (1 - cl(pick)) + cl(pick) * (X(3) - 330) * 1;
  return <>
    <AbsoluteSpot x={pick > 0.05 ? X(3) : spotX} />
    {SIL.map((d, i) => { const chosen = i === 3, ent = phys(tt, 0.15 + i * 0.12, 6, 0.5);
      const near = Math.max(0, 1 - Math.abs((pick > 0.05 ? X(3) : spotX) - X(i)) / 200);
      const dim = chosen ? 0 : cl(pick) * 0.75;
      return <div key={i} style={{ position: "absolute", left: X(i), top: 640, transform: `translate(-50%,-50%) translateY(${(1 - ent) * 300 + (chosen ? -30 * cl(pick) : 0)}px) scale(${chosen ? 1 + 0.45 * cl(pick) : 1})`, opacity: cl(ent * 2) * (1 - dim) }}>
        {chosen && pick > 0.05 ? <div style={{ opacity: cl(pick * 2) }}><Photo id={h.img} w={250} h={330} r={14} /></div> :
          <svg width={200} height={300} viewBox="-100 -150 200 300"><path d={d} fill={`rgb(${108 + 70 * near},${104 + 60 * near},${100 + 45 * near})`} stroke="rgba(255,235,200,.45)" strokeWidth={4} /></svg>}
      </div>; })}
    <Tag tt={tt} at={0.3} x={960} y={170} txt="“WHICH ONE?”" col={DIM} size={56} />
    <Tag tt={tt} at={it(h, 0) + 0.1} x={X(3)} y={900} txt="THIS ONE" col={AMB} size={50} />
  </>;
}}</Stage>;
const AbsoluteSpot: React.FC<{ x: number }> = ({ x }) => <>
  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: `conic-gradient(from 165deg at ${x}px -60px, transparent 0deg, rgba(255,226,170,.16) 15deg, transparent 30deg)` }} />
  <div style={{ position: "absolute", left: x - 220, top: 800, width: 440, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,220,160,.35), transparent 70%)" }} />
</>;

// ---- 1:25 · LA ETIQUETA DE PRECIO: el tanque en su foto y una etiqueta de cartón que cae colgada de su piolín y se balancea: $10 ----
export const HPriceTag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const ph = phys(tt, 0.1, 4.5, 0.5), tg = tt - (it(h, 0) - 0.8), sw = tg > 0 ? 34 * Math.exp(-tg * 1.1) * Math.cos(tg * 4.2) : -60;
  const drop = cl(phys(tt, it(h, 0) - 0.8, 6, 0.4));
  return <>
    <div style={{ position: "absolute", left: 640, top: 540, transform: `translate(-50%,-50%) rotate(${-2 + (1 - ph) * -8}deg) scale(${0.9 + 0.1 * ph})`, opacity: cl(ph * 2) }}><Photo id={h.img} w={860} h={600} /></div>
    <div style={{ position: "absolute", left: 1380, top: 60, transformOrigin: "50% 0%", transform: `rotate(${sw}deg) translateY(${(1 - drop) * -500}px)` }}>
      <div style={{ width: 4, height: 300, margin: "0 auto", background: "linear-gradient(#d8cfb8,#9f957c)" }} />
      <div style={{ width: 330, height: 200, background: "linear-gradient(160deg,#e9d5a8,#c9ad74)", clipPath: "polygon(22% 0,78% 0,100% 18%,100% 100%,0 100%,0 18%)", boxShadow: "0 30px 50px rgba(0,0,0,.5)", position: "relative", fontFamily: HAND, color: "#2b2117" }}>
        <div style={{ position: "absolute", left: 147, top: 18, width: 36, height: 36, borderRadius: "50%", background: "#3a2a1a", boxShadow: "0 0 0 8px #f5f0e2" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 66, textAlign: "center", fontWeight: 700, fontSize: 110, lineHeight: "110px" }}>$10</div>
      </div>
    </div>
    <Tag tt={tt} at={0.6} x={640} y={900} txt="20-GALLON AIR TANK" size={44} />
    <Tag tt={tt} at={it(h, 0) + 0.5} x={1400} y={720} txt="SCRAPYARD PRICE" col={DIM} size={34} />
  </>;
}}</Stage>;

// ---- 1:44 · EL ESCÁNER: garrafa vs tanque de aire; una barra de rayos X los barre y adentro de la garrafa aparece el gas ----
export const HXray: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const bar = 160 + eio(tt, 0.8, 5.6) * 1600, ok = phys(tt, it(h, 0), 6, 0.5);
  const body = (x: number, w: number, hh: number, r: number) => ({ position: "absolute" as const, left: x - w / 2, top: 560 - hh / 2, width: w, height: hh, borderRadius: r });
  const seen = (x: number) => cl((bar - x + 200) / 200);
  return <>
    {/* garrafa (izq) y tanque de aire (der): pintura afuera, rayos X adentro donde ya pasó la barra */}
    {[{ x: 560, w: 330, hh: 470, r: 150, col: "#d9dcd6", gas: true }, { x: 1360, w: 300, hh: 520, r: 120, col: "#596069", gas: false }].map((o, i) => <div key={i}>
      <div style={{ ...body(o.x, o.w, o.hh, o.r), background: `linear-gradient(90deg, ${o.col}, #fff8 40%, ${o.col} 70%, #222 100%)`, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
      <div style={{ ...body(o.x, o.w, o.hh, o.r), background: "radial-gradient(circle at 50% 40%, #0c2a44, #04101c)", border: "3px solid rgba(143,214,255,.7)", clipPath: `inset(0 ${100 - cl((bar - (o.x - o.w / 2)) / o.w) * 100}% 0 0)` }}>
        {o.gas ? Array.from({ length: 16 }, (_, k) => <div key={k} style={{ position: "absolute", left: 40 + ((k * 73) % 240) + 14 * Math.sin(tt * 1.4 + k), top: 60 + ((k * 131) % 340) + 10 * Math.cos(tt * 1.1 + k), width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,110,60,.85), rgba(255,110,60,0) 70%)", opacity: seen(o.x) }} />)
          : <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, height: 40, borderRadius: "0 0 100px 100px", background: "rgba(143,214,255,.45)" }} />}
      </div>
      <div style={{ position: "absolute", left: o.x - 30, top: 560 - o.hh / 2 - 60, width: 60, height: 60, borderRadius: 10, background: "#8a8f94" }} />
    </div>)}
    {/* la barra del escáner */}
    <div style={{ position: "absolute", left: bar - 6, top: 200, width: 12, height: 720, background: ICE, boxShadow: `0 0 40px 12px ${ICE}`, opacity: bar < 1750 ? 0.9 : 0 }} />
    <Tag tt={tt} at={2.4} x={560} y={880} txt="PROPANE · GAS INSIDE" col={RED} size={40} />
    <Tag tt={tt} at={it(h, 0)} x={1360} y={880} txt="AIR TANK · ONLY AIR" col={ICE} size={40} />
    <div style={{ position: "absolute", left: 560, top: 560, transform: `translate(-50%,-50%) scale(${cl(ok) * 1.1})`, opacity: cl(ok), fontFamily: MARK, fontSize: 120, color: RED, textShadow: "0 10px 30px rgba(0,0,0,.6)" }}>NEVER</div>
  </>;
}}</Stage>;

// ---- 2:06 · LA LLAVE GRANDE: una llave inglesa abraza el hexágono de la válvula y gira a golpes hasta que la válvula sale volando ----
export const HWrench: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const steps = Math.min(4, Math.max(0, Math.floor((tt - 0.9) / 0.85))), fr = cl(((tt - 0.9) % 0.85) / 0.35);
  const ang = -(steps * 30 + (tt > 0.9 && steps < 4 ? 30 * eio(fr, 0, 1) : 0)), rise = steps * 14 + (steps < 4 ? fr * 14 : 0);
  const pop = phys(tt, 4.4, 4, 0.35), fly = tt > 4.4 ? eio(tt, 4.4, 5.6) : 0;
  return <>
    <div style={{ position: "absolute", left: 960, top: 800, width: 1300, height: 240, marginLeft: -650, borderRadius: "50% 50% 0 0 / 100% 100% 0 0", background: steel, boxShadow: "0 -10px 60px rgba(0,0,0,.5)" }} />
    {/* rosca que va saliendo */}
    <div style={{ position: "absolute", left: 960 - 46, top: 690 - rise, width: 92, height: 110, background: "repeating-linear-gradient(170deg,#b9bdc2 0 8px,#6c7076 8px 14px)", opacity: fly > 0.3 ? 0 : 1 }} />
    {/* la válvula (hexágono + manómetro) */}
    <div style={{ position: "absolute", left: 960, top: 640 - rise - fly * 600, transform: `translate(-50%,-50%) rotate(${ang + fly * 280}deg)`, opacity: 1 - cl((fly - 0.7) * 3) }}>
      <svg width={220} height={220} viewBox="-110 -110 220 220"><polygon points="100,0 50,87 -50,87 -100,0 -50,-87 50,-87" fill="#c9a24a" stroke="#7a5a1a" strokeWidth={6} /><circle r={52} fill="#efe9da" stroke="#555" strokeWidth={8} /><line x1={0} y1={0} x2={30} y2={-30} stroke={RED} strokeWidth={6} /></svg>
    </div>
    {/* la llave: abraza el hexágono y gira con él */}
    <div style={{ position: "absolute", left: 960, top: 640 - rise, transform: `rotate(${ang}deg)`, opacity: fly > 0.05 ? 1 - cl(fly * 4) : cl(tt * 3) }}>
      <svg width={1000} height={260} viewBox="0 -130 1000 260" style={{ position: "absolute", left: -120, top: -130 }}>
        <defs><linearGradient id="wr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e4e8ec" /><stop offset=".5" stopColor="#8d9399" /><stop offset="1" stopColor="#4a4f55" /></linearGradient></defs>
        <path d="M 0 -120 L 70 -120 L 70 -100 L 20 -100 L 20 100 L 70 100 L 70 120 L 0 120 Z M 220 -120 L 150 -120 L 150 -100 L 200 -100 L 200 100 L 150 100 L 150 120 L 220 120 Z" fill="url(#wr)" />
        <rect x={210} y={-45} width={760} height={90} rx={45} fill="url(#wr)" stroke="rgba(0,0,0,.4)" strokeWidth={3} />
      </svg>
    </div>
    {/* chasquido de cada golpe */}
    {steps > 0 && steps < 5 && fr < 0.6 && <div style={{ position: "absolute", left: 1180, top: 560, width: 80, height: 80, borderRadius: "50%", border: `5px solid ${AMB}`, opacity: 0.6 * (1 - fr), transform: `scale(${1 + fr})` }} />}
    <Tag tt={tt} at={0.4} x={480} y={250} txt="VALVE OFF" col={AMB} size={56} />
    {/* el agujero que queda abierto donde estaba la válvula */}
    <div style={{ position: "absolute", left: 960 - 70, top: 795 - 26, width: 140, height: 52, borderRadius: "50%", background: "radial-gradient(ellipse,#050505 55%,#3a3d41 75%)", opacity: cl((tt - 4.5) * 3), transform: `scale(${0.3 + 0.7 * cl(phys(tt, 4.5, 5, 0.4))})` }} />
    <Tag tt={tt} at={4.9} x={960} y={930} txt="OPEN BOTH ENDS" col={AMB} size={52} />
  </>;
}}</Stage>;

// ---- 2:20 · EL CARTEL Y LA CAMPANA: un cartel de chapa esmaltada roja entra colgado de dos cadenas y una campana de bronce suena ----
export const HSubscribe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const d = cl(phys(tt, 0.1, 5, 0.42)), sw = 6 * Math.exp(-tt * 0.9) * Math.sin(tt * 3.2);
  const ring = tt - 1.6, bell = ring > 0 ? 22 * Math.exp(-ring * 1.4) * Math.sin(ring * 11) : 0;
  return <>
    <div style={{ position: "absolute", left: 860, top: -40, transformOrigin: "50% 0", transform: `translateY(${(1 - d) * -700}px) rotate(${sw}deg)` }}>
      {[-330, 330].map((x) => <div key={x} style={{ position: "absolute", left: x - 6, top: 0, width: 12, height: 300, background: "repeating-linear-gradient(180deg,#c9ced4 0 16px,#5d6268 16px 22px)" }} />)}
      <div style={{ position: "absolute", left: -420, top: 290, width: 840, height: 330, borderRadius: 26, background: "linear-gradient(170deg,#e0322a,#a8160f 70%)", boxShadow: "0 50px 90px rgba(0,0,0,.6), inset 0 0 0 12px #f4efe6, inset 0 0 0 20px #a8160f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 112, letterSpacing: 2, color: "#f4efe6", textShadow: "0 4px 0 #6a0b06" }}>SUBSCRIBE</div>
        <div style={{ fontWeight: 800, fontSize: 40, letterSpacing: 6, color: "#ffd9c8" }}>ONE STOVE · ALL WINTER</div>
        {/* reflejo del esmalte que cruza */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: `linear-gradient(105deg, transparent ${-30 + (tt * 40) % 180}%, rgba(255,255,255,.25) ${-20 + (tt * 40) % 180}%, transparent ${-10 + (tt * 40) % 180}%)` }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1530, top: 330, transformOrigin: "50% 0", transform: `rotate(${bell}deg) scale(${cl(phys(tt, 1.2, 6, 0.5))})` }}>
      <div style={{ width: 16, height: 70, margin: "0 auto", background: "#8a6a2a" }} />
      <div style={{ width: 210, height: 200, borderRadius: "105px 105px 30px 30px", background: "linear-gradient(120deg,#ffe29a,#c9952c 50%,#7a5418)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
      <div style={{ width: 54, height: 54, margin: "-10px auto 0", borderRadius: "50%", background: "#7a5418", transform: `translateX(${-bell * 1.5}px)` }} />
    </div>
    {[0, 1, 2].map((i) => { const k = cl((ring - i * 0.25) / 1.2); return ring > i * 0.25 && k < 1 ? <div key={i} style={{ position: "absolute", left: 1635 - 140 * (0.6 + k), top: 430 - 140 * (0.6 + k), width: 280 * (0.6 + k), height: 280 * (0.6 + k), borderRadius: "50%", border: `5px solid ${AMB}`, opacity: 1 - k }} /> : null; })}
  </>;
}}</Stage>;

// ---- 2:36 · LA CINTA MÉTRICA: sobre la foto del tanque, la cinta amarilla sale 6", después 5" para arriba, y el marcador traza la puerta ----
export const HTape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const IN = 82, X0 = 640, Y0 = 760;                        // 1 pulgada = 82 px; esquina inferior izquierda de la puerta
  const w = eio(tt, it(h, 0) - 0.9, it(h, 0) + 0.2), v = eio(tt, it(h, 1) - 0.8, it(h, 1) + 0.2), up = eio(tt, it(h, 2) - 0.3, it(h, 2) + 0.7);
  const draw = eio(tt, it(h, 1) + 0.4, it(h, 2) - 0.2);
  const per = 2 * (6 + 5) * IN;
  return <>
    <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", opacity: 0.9 }}><Photo id={h.img} w={1500} h={860} dim={0.35} /></div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect x={X0} y={Y0 - 5 * IN} width={6 * IN} height={5 * IN} fill="none" stroke="#111" strokeWidth={14} pathLength={per} strokeDasharray={`${draw * per} ${per}`} />
      <rect x={X0} y={Y0 - 5 * IN} width={6 * IN} height={5 * IN} fill="none" stroke="#f4efe6" strokeWidth={6} pathLength={per} strokeDasharray={`${draw * per} ${per}`} />
      {/* la cota de 4" desde el piso del tanque */}
      <g opacity={up}><line x1={X0 - 70} y1={Y0} x2={X0 - 70} y2={Y0 + 4 * IN * up} stroke={AMB} strokeWidth={6} /><line x1={X0 - 100} y1={Y0} x2={X0 - 40} y2={Y0} stroke={AMB} strokeWidth={6} /><line x1={X0 - 100} y1={Y0 + 4 * IN * up} x2={X0 - 40} y2={Y0 + 4 * IN * up} stroke={AMB} strokeWidth={6} /></g>
    </svg>
    {/* la cinta horizontal y la vertical, con sus marcas */}
    {[{ len: w * 6, rot: 0 }, { len: v * 5, rot: -90 }].map((tp, k) => tp.len > 0.02 && <div key={k} style={{ position: "absolute", left: X0, top: Y0 + 24, width: tp.len * IN, height: 44, transformOrigin: "0 -24px", transform: `rotate(${tp.rot}deg)`, background: "linear-gradient(180deg,#ffd84a,#e8b512)", boxShadow: "0 8px 20px rgba(0,0,0,.5)", overflow: "hidden" }}>
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * IN, top: 0, width: 3, height: 22, background: "#1d1a10" }}><div style={{ position: "absolute", left: 6, top: 12, fontWeight: 900, fontSize: 22, color: "#1d1a10" }}>{i}</div></div>)}
    </div>)}
    <div style={{ position: "absolute", left: X0 - 80, top: Y0, width: 90, height: 90, borderRadius: 18, background: "linear-gradient(160deg,#ffd84a,#c99a0e)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", transform: `translate(-50%,0) scale(${cl(phys(tt, 0.4, 6, 0.5))})` }} />
    <Tag tt={tt} at={it(h, 0)} x={X0 + 3 * IN} y={Y0 + 120} txt={'6"'} col={AMB} size={64} />
    <Tag tt={tt} at={it(h, 1)} x={X0 + 6 * IN + 110} y={Y0 - 2.5 * IN} txt={'5"'} col={AMB} size={64} />
    <Tag tt={tt} at={it(h, 2)} x={X0 - 210} y={Y0 + 2 * IN} txt={'4" UP'} col={TX} size={56} />
  </>;
}}</Stage>;

// ---- 3:12 · EL CORTE DE LA PUERTA: el tanque en corte con el cuenco hirviendo; con la puerta a 1" el aceite se rebalsa al piso, a 4" queda adentro ----
export const HSection: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const lift = eio(tt, 2.6, 3.8), doorBot = 900 - 28 - lift * 84, spill = eio(tt, 0.9, 2.4) * (1 - lift), boil = Math.sin(tt * 2.2) * 6;
  const wall = { position: "absolute" as const, background: steel };
  return <>
    <div style={{ ...wall, left: 600, top: 260, width: 34, height: 640 }} />
    <div style={{ ...wall, left: 1286, top: 260, width: 34, height: doorBot - 140 - 260 }} />
    <div style={{ ...wall, left: 1286, top: doorBot, width: 34, height: 900 - doorBot }} />
    <div style={{ ...wall, left: 600, top: 900, width: 720, height: 30 }} />
    <div style={{ position: "absolute", left: 634, top: 260, width: 652, height: 640, background: "radial-gradient(ellipse at 50% 90%, rgba(255,120,40,.25), transparent 60%)" }} />
    {/* el cuenco con aceite que hierve */}
    <div style={{ position: "absolute", left: 790, top: 820, width: 340, height: 80, borderRadius: "0 0 170px 170px", background: "#2a2a2c", border: "8px solid #555" }} />
    <div style={{ position: "absolute", left: 806, top: 816 + boil * 0.3, width: 308, height: 30, borderRadius: "50%", background: "radial-gradient(#ff9a3a,#1a0f05 70%)" }} />
    {/* el rebalse: chorro que sale por la puerta baja y charco en el piso */}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={`M 1120 830 Q 1250 ${830 - 30 * spill} 1320 ${880} Q 1360 940 ${1360 + 260 * spill} 960`} fill="none" stroke="#ff7a2a" strokeWidth={14 * spill} strokeLinecap="round" opacity={spill} />
      <ellipse cx={1500} cy={965} rx={220 * spill} ry={22 * spill} fill="#ff6a1a" opacity={0.8 * spill} />
    </svg>
    {/* la marca de altura de la puerta */}
    <div style={{ position: "absolute", left: 1350, top: doorBot - 4, width: 120, height: 8, background: AMB }} />
    <div style={{ position: "absolute", left: 1490, top: doorBot - 34, fontWeight: 900, fontSize: 60, color: AMB }}>{lift > 0.5 ? '4"' : '1"'}</div>
    <Tag tt={tt} at={1.4} x={1560} y={880} txt="BURNING OIL OUT" col={RED} size={38} />
    <Tag tt={tt} at={it(h, 0)} x={960} y={190} txt="STAYS INSIDE THE STEEL" col={AMB} size={50} />
  </>;
}}</Stage>;

// ---- 4:03 · EL CALENDARIO QUE QUEMA: las hojas vuelan del 1 al 14 mientras el molde fino se pone al rojo y se agujerea; el acero grueso aguanta ----
export const HCalendar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const d = Math.min(14, 1 + Math.floor(eio(tt, 0.8, 5.5) * 13.99)), burn = eio(tt, 2.0, 5.6), hole = eio(tt, 4.4, 6.0);
  const thick = phys(tt, it(h, 0) - 0.4, 6, 0.5);
  const disc = (x: number, label: string, b: number, ho: number, thickRim: number) => <div style={{ position: "absolute", left: x, top: 620, transform: "translate(-50%,-50%)" }}>
    <div style={{ width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, rgb(${90 + 165 * b},${80 + 40 * b},${70}) 0%, #3a3a3d 70%)`, boxShadow: `0 0 ${80 * b}px rgba(255,90,30,${0.6 * b}), inset 0 0 0 ${thickRim}px #2a2a2c, 0 40px 70px rgba(0,0,0,.6)`, position: "relative" }}>
      {ho > 0 && <div style={{ position: "absolute", left: 190 - 70 * ho, top: 200 - 60 * ho, width: 140 * ho, height: 120 * ho, borderRadius: "46% 54% 40% 60%", background: "radial-gradient(#000 40%, #ff5a1a 75%, transparent 80%)" }} />}
    </div>
    <div style={{ textAlign: "center", marginTop: 26, fontWeight: 900, fontSize: 42, color: x < 1000 ? RED : AMB }}>{label}</div>
  </div>;
  return <>
    {/* calendario de pared con hojas que vuelan */}
    <div style={{ position: "absolute", left: 210, top: 160, width: 300, height: 340, borderRadius: 12, background: "#f4efe6", boxShadow: "0 40px 70px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ height: 80, background: RED, color: "#fff", fontWeight: 900, fontSize: 42, textAlign: "center", lineHeight: "80px" }}>DAY</div>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 190, color: "#1b1b1b", lineHeight: "250px" }}>{d}</div>
    </div>
    {Array.from({ length: 3 }, (_, k) => { const f = ((eio(tt, 0.8, 5.5) * 13.99) % 1 + k / 3) % 1; return d < 14 ? <div key={k} style={{ position: "absolute", left: 210 + f * 260, top: 240 - f * 120 + f * f * 400, width: 300, height: 250, background: "#ede6d6", opacity: 0.9 * (1 - f), transform: `rotate(${f * 70}deg)`, transformOrigin: "0 0" }} /> : null; })}
    {disc(860, "CAKE PAN", burn, hole, 6)}
    <div style={{ opacity: cl(thick) }}>{disc(1450, "THICK STEEL", burn * 0.55, 0, 34)}</div>
    <Tag tt={tt} at={0.4} x={1150} y={180} txt="TWO WEEKS" col={TX} size={64} />
  </>;
}}</Stage>;

// ---- 4:39 · EL TUBO QUE SE PERFORA: un caño de acero 3D gira y la mecha baja al ritmo, fila por fila, dejando los agujeros ----
export const HDrill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const N = 20, R = 150, rot = tt * 40, ROWS = 6, dt = 0.075, t0 = 0.8;
  const beat = ((tt - t0) / dt) | 0, dn = tt > t0 && beat < N * ROWS ? Math.abs(Math.sin(((tt - t0) / dt) * Math.PI)) : 0;
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, width: 0, height: 0, perspective: 1800 }}>
      <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `rotateX(-8deg) rotateY(${rot}deg)` }}>
        {Array.from({ length: N }, (_, i) => { const a = (i / N) * 360, face = Math.cos(((a + rot) * Math.PI) / 180);
          return <div key={i} style={{ position: "absolute", left: -(2 * Math.PI * R) / N / 2, top: -330, width: (2 * Math.PI * R) / N + 1, height: 660, transform: `rotateY(${a}deg) translateZ(${R}px)`, background: `rgb(${70 + 90 * Math.max(0, face)},${74 + 92 * Math.max(0, face)},${80 + 92 * Math.max(0, face)})`, backfaceVisibility: "hidden" }}>
            {Array.from({ length: ROWS }, (_, r) => { const k = r * N + ((i - Math.round(rot / 18) % N + N * 10) % N); const on = tt > t0 + (r * N + i) * dt * 0.33;
              return on ? <div key={r} style={{ position: "absolute", left: "50%", top: 70 + r * 100, width: 20, height: 20, marginLeft: -10, borderRadius: "50%", background: "radial-gradient(#050505 55%, #c9ced4 70%)", opacity: k >= 0 ? 1 : 1 }} /> : null; })}
          </div>; })}
      </div>
    </div>
    {/* la mecha: baja y sube al ritmo, con viruta */}
    <div style={{ position: "absolute", left: 960 - 14, top: 40 + dn * 60, width: 28, height: 200, background: "repeating-linear-gradient(160deg,#d8dde2 0 10px,#7d838a 10px 18px)", borderRadius: "0 0 14px 14px", opacity: cl(tt * 3) }} />
    <div style={{ position: "absolute", left: 960 - 70, top: -40 + dn * 60, width: 140, height: 90, borderRadius: 14, background: "linear-gradient(#2d5aa0,#1b3a6a)", opacity: cl(tt * 3) }} />
    <Tag tt={tt} at={it(h, 0)} x={480} y={420} txt={'2" PIPE'} col={AMB} size={60} />
    <Tag tt={tt} at={it(h, 1)} x={480} y={540} txt={'14" LONG'} col={TX} size={48} />
    <Tag tt={tt} at={1.4} x={1440} y={480} txt={'¼" HOLES'} col={TX} size={48} />
    <Tag tt={tt} at={2.2} x={1440} y={590} txt="EVERY INCH" col={DIM} size={40} />
  </>;
}}</Stage>;

// ---- 5:26 · LA PLATA POR LA CHIMENEA: billetes que suben por el caño y salen por arriba hechos humo negro ----
export const HMoney: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const pipe = eio(tt, 0.1, 0.9);
  return <>
    <div style={{ position: "absolute", left: 960 - 75, top: 300 + (1 - pipe) * 780, width: 150, height: 780, background: "linear-gradient(90deg,#1a1a1b,#4a4b4f 35%,#222 70%,#111)", boxShadow: "0 0 60px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 14 }, (_, i) => { const ph = ((tt - 0.8) * 0.42 + i / 14) % 1; if (tt < 0.8 + 0) return null;
      const y = 1080 - ph * 900, inPipe = y > 300, smoke = cl((300 - y) / 160);
      return <div key={i} style={{ position: "absolute", left: 960 + Math.sin(i * 2.1 + tt * 1.5) * (inPipe ? 25 : 60 + 200 * smoke), top: y, transform: `translate(-50%,-50%) rotate(${Math.sin(tt * 2 + i) * 25}deg) scale(${1 + smoke * 1.6})`, opacity: inPipe ? 0.85 : 1 - smoke * 0.5 }}>
        {smoke < 0.5 ? <div style={{ width: 120, height: 56, borderRadius: 6, background: "linear-gradient(135deg,#9fc48a,#5d8a4a)", border: "3px solid #3c5a30", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 34, color: "#24391b" }}>$</div>
          : <div style={{ width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,20,20,.9), rgba(20,20,20,0) 70%)" }} />}
      </div>; })}
    <Tag tt={tt} at={0.8} x={480} y={540} txt="FUEL YOU PAID FOR" col={AMB} size={52} />
    <Tag tt={tt} at={3.0} x={1460} y={260} txt="BLACK SMOKE" col={DIM} size={44} />
  </>;
}}</Stage>;

// ---- 6:17 · LA REGLA DE PARED Y LA LUPA: el bidón sube por una regla hasta 3 pies; después una lupa muestra la válvula de aguja de bronce ----
export const HLoupe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const FT = 190, Y0 = 940, lift = eio(tt, 0.6, 3.0), lp = phys(tt, it(h, 0) - 0.4, 4.5, 0.55);
  const jy = Y0 - lift * 3 * FT;
  return <>
    {/* regla de pared */}
    <div style={{ position: "absolute", left: 520, top: Y0 - 4 * FT, width: 90, height: 4 * FT, background: "linear-gradient(90deg,#e8d9b0,#cdb98a)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: 4 * FT - i * FT - 3, width: 60, height: 6, background: "#2b2117" }}><div style={{ position: "absolute", left: 66, top: -24, fontWeight: 900, fontSize: 40, color: i === 3 ? AMB : "#2b2117" }}>{i}</div></div>)}
    </div>
    {/* la estufa abajo y el bidón que sube */}
    <div style={{ position: "absolute", left: 760, top: Y0 - 140, width: 200, height: 140, borderRadius: "30px 30px 0 0", background: steel }} />
    <div style={{ position: "absolute", left: 740, top: jy - 200, width: 170, height: 200, borderRadius: 26, background: "linear-gradient(90deg,#e9e3cf,#cfc6aa)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, height: 110, borderRadius: 16, background: "#1c130b" }} />
      <div style={{ position: "absolute", left: 72, top: 196, width: 26, height: 40, background: "#c9a24a" }} />
    </div>
    <div style={{ position: "absolute", left: 640, top: jy - 6, width: 100, height: 4, background: AMB, opacity: lift }} />
    <Tag tt={tt} at={2.6} x={400} y={Y0 - 3 * FT} txt="3 FT" col={AMB} size={56} />
    {/* lupa con la válvula de aguja de bronce */}
    <div style={{ position: "absolute", left: 1380, top: 520, transform: `translate(-50%,-50%) translateX(${(1 - lp) * 700}px) rotate(${(1 - lp) * 30}deg)`, opacity: cl(lp * 2) }}>
      <div style={{ width: 500, height: 500, borderRadius: "50%", border: "26px solid #2b2b2e", background: "radial-gradient(circle at 40% 35%, #2e2a24, #14110d)", boxShadow: "0 50px 90px rgba(0,0,0,.6), inset 0 0 60px rgba(255,255,255,.12)", overflow: "hidden", position: "relative" }}>
        <svg width={448} height={448} viewBox="-224 -224 448 448">
          <defs><linearGradient id="br" x1="0" x2="1"><stop offset="0" stopColor="#7a5418" /><stop offset=".45" stopColor="#ffe29a" /><stop offset="1" stopColor="#8a6420" /></linearGradient></defs>
          <rect x={-60} y={-200} width={120} height={140} rx={10} fill="url(#br)" />
          <polygon points="-90,-60 90,-60 110,0 90,60 -90,60 -110,0" fill="url(#br)" />
          <rect x={-30} y={60} width={60} height={130} fill="url(#br)" />
          <g transform={`rotate(${tt * 30})`}><circle r={0} /></g>
          <rect x={90} y={-18} width={110} height={36} rx={8} fill="url(#br)" />
          <circle cx={205} cy={0} r={30} fill="#b3261e" />
        </svg>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(130deg, rgba(255,255,255,.18), transparent 40%)" }} />
      </div>
      <div style={{ position: "absolute", left: 400, top: 420, width: 60, height: 260, borderRadius: 30, background: "linear-gradient(90deg,#3a2a1a,#6b4a2a,#2a1a0d)", transform: "rotate(-40deg)", transformOrigin: "50% 0" }} />
    </div>
    <Tag tt={tt} at={it(h, 0) + 0.4} x={1380} y={880} txt="BRASS NEEDLE VALVE" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 6:51 · EL METRÓNOMO: un metrónomo de madera marca 1 por segundo; en cada golpe cae una gota al cuenco caliente y fogonea ----
export const HMetronome: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const ang = 28 * Math.sin(tt * Math.PI), ph = (tt % 1), y = 330 + eio(ph, 0, 0.55) * 420, flash = cl(1 - (ph - 0.55) / 0.35) * (ph > 0.55 ? 1 : 0);
  const n = [0, 1, 2].filter((i) => tt >= it(h, i)).length;
  return <>
    {/* metrónomo */}
    <div style={{ position: "absolute", left: 560, top: 860, transform: "translate(-50%,-100%)" }}>
      <div style={{ width: 360, height: 560, clipPath: "polygon(30% 0,70% 0,100% 100%,0 100%)", background: "linear-gradient(90deg,#4a2a14,#8a5530 45%,#3a200e)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 180 - 4, top: 470, width: 8, height: 420, transformOrigin: "50% 0", transform: `rotate(${180 + ang}deg)`, background: "#d8dde2" }}>
        <div style={{ position: "absolute", left: -26, top: 250, width: 60, height: 50, borderRadius: 8, background: "linear-gradient(#ffe29a,#b8822c)" }} />
      </div>
    </div>
    {/* la gota que cae en el cuenco */}
    <div style={{ position: "absolute", left: 1300 - 12, top: 230, width: 24, height: 100, background: "#c47a45", borderRadius: 6 }} />
    {tt > 0.2 && ph < 0.6 && <div style={{ position: "absolute", left: 1300 - 14, top: y, width: 28, height: 36, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%, #6a5030, #120a04)" }} />}
    <div style={{ position: "absolute", left: 1300 - 220, top: 770, width: 440, height: 110, borderRadius: "0 0 220px 220px", background: "radial-gradient(ellipse at 50% 0%, #ff7a2a 0%, #3a2a20 55%)", boxShadow: `0 0 ${60 + 120 * flash}px rgba(255,140,50,${0.4 + 0.5 * flash})` }} />
    <div style={{ position: "absolute", left: 1300, top: 740, width: 200 * flash + 10, height: 200 * flash + 10, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,230,160,.9), rgba(255,120,40,0) 70%)", opacity: flash }} />
    <div style={{ position: "absolute", left: 960, top: 210, transform: "translateX(-50%)", fontWeight: 900, fontSize: 150, color: AMB, letterSpacing: 30, textShadow: "0 10px 40px rgba(0,0,0,.6)" }}>{["", "1", "1 · 2", "1 · 2 · 3"][n]}</div>
    <Tag tt={tt} at={0.4} x={1300} y={960} txt="ONE DROP A SECOND" col={TX} size={42} />
  </>;
}}</Stage>;

// ---- 7:19 · EL BALDE QUE DECANTA: un balde transparente con la mezcla turbia; pasa la semana (7 puntos) y el agua y el barro bajan al fondo ----
export const HSettle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const wk = eio(tt, it(h, 0) - 4.2, it(h, 0) + 0.4), sep = eio(tt, 2.0, it(h, 1) + 0.4);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return <>
    <div style={{ position: "absolute", left: 960, top: 600, width: 520, height: 560, transform: "translate(-50%,-50%)", clipPath: "polygon(0 0,100% 0,90% 100%,10% 100%)", background: "rgba(255,255,255,.06)", border: "4px solid rgba(255,255,255,.25)", overflow: "hidden" }}>
      {/* aceite limpio arriba, agua y barro abajo: las capas se separan con el tiempo */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, bottom: 0, background: `linear-gradient(180deg, #4a2c10 0%, #3a2410 ${100 - 45 * sep}%, rgba(80,120,150,${0.85 * sep}) ${100 - 42 * sep}%, rgba(80,120,150,${0.85 * sep}) ${100 - 18 * sep}%, #241a10 ${100 - 16 * sep}%, #151009 100%)` }} />
      {Array.from({ length: 30 }, (_, i) => { const y = 120 + ((i * 97) % 380) + sep * (440 - ((i * 97) % 380)) * (i % 2 ? 0.9 : 1); return <div key={i} style={{ position: "absolute", left: 40 + ((i * 151) % 420), top: Math.min(500, y), width: 10, height: 10, borderRadius: "50%", background: i % 2 ? "rgba(120,170,210,.8)" : "#120c06", opacity: 1 - sep * 0.6 }} />; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, height: 6, background: "rgba(255,200,120,.35)" }} />
    </div>
    {/* la semana */}
    <div style={{ position: "absolute", left: 960, top: 220, transform: "translateX(-50%)", display: "flex", gap: 26 }}>
      {days.map((d, i) => { const on = wk * 7 > i + 0.3; return <div key={i} style={{ width: 82, height: 82, borderRadius: "50%", border: `5px solid ${on ? AMB : "rgba(255,255,255,.25)"}`, background: on ? "rgba(255,178,87,.25)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 40, color: on ? AMB : DIM, transform: `scale(${on ? 1.06 : 1})` }}>{d}</div>; })}
    </div>
    <Tag tt={tt} at={2.6} x={1420} y={520} txt="CLEAN OIL" col={AMB} size={44} />
    <Tag tt={tt} at={it(h, 1)} x={1440} y={760} txt="WATER SINKS" col={ICE} size={40} />
    <Tag tt={tt} at={it(h, 1) + 0.4} x={480} y={830} txt="SLUDGE" col={DIM} size={40} />
  </>;
}}</Stage>;

// ---- 7:52 · EL FÓSFORO: el fósforo raspa la caja, prende, y baja al diario arrugado en el cuenco, que se enciende ----
export const HMatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const strike = eio(tt, it(h, 0) - 1.6, it(h, 0) - 1.0), lit = cl((tt - (it(h, 0) - 1.0)) * 2), down = eio(tt, it(h, 0) - 0.6, it(h, 0) + 0.4);
  const catchF = cl((tt - it(h, 0) - 0.2) * 1.2), fl = 0.9 + 0.1 * Math.sin(tt * 2 * Math.PI * 1.6);
  const mx = 560 + strike * 380 + down * 300, my = 420 + down * 260;
  return <>
    {/* la caja */}
    <div style={{ position: "absolute", left: 500, top: 440, width: 520, height: 150, borderRadius: 8, background: "linear-gradient(#e8d9a8,#c9b06a)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", transform: "rotate(-4deg)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40, background: "repeating-linear-gradient(90deg,#5a3a2a 0 6px,#3a2418 6px 9px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 58, textAlign: "center", fontWeight: 900, fontSize: 54, color: RED }}>STRIKE</div>
    </div>
    {/* el cuenco con el diario (foto) */}
    <div style={{ position: "absolute", left: 1300, top: 700, transform: "translate(-50%,-50%) scale(1.45)" }}>
      <div style={{ width: 520, height: 300, borderRadius: "50%", overflow: "hidden", boxShadow: "inset 0 0 0 18px #2a2a2c, 0 40px 80px rgba(0,0,0,.6)" }}><Photo id={h.img} w={520} h={300} r={0} /></div>
      <div style={{ position: "absolute", left: 260 - 160, top: 150 - 260 * catchF, width: 320, height: 320 * catchF, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 50% 85%, rgba(255,240,180,.95), rgba(255,140,40,.7) 40%, rgba(255,80,20,0) 70%)", transform: `scaleY(${fl})`, transformOrigin: "50% 100%" }} />
    </div>
    {/* el fósforo */}
    <div style={{ position: "absolute", left: mx, top: my, transform: `rotate(${-30 + down * 50}deg)`, transformOrigin: "0 50%", opacity: 1 - cl((catchF - 0.6) * 3) }}>
      <div style={{ width: 300, height: 16, borderRadius: 8, background: "linear-gradient(#e2c08a,#b8935a)" }} />
      <div style={{ position: "absolute", left: 290, top: -8, width: 40, height: 32, borderRadius: "50%", background: lit > 0 ? "#3a1a0a" : "#c0392b" }} />
      {lit > 0 && <div style={{ position: "absolute", left: 300, top: -90 * lit, width: 70, height: 110 * lit, borderRadius: "50% 50% 45% 45%", background: "radial-gradient(ellipse at 50% 80%, #fff6d0, #ffb347 45%, rgba(255,90,20,0) 70%)", transform: `scaleY(${fl})`, transformOrigin: "50% 100%" }} />}
    </div>
    {strike > 0.2 && strike < 1 && Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: mx + 300 + Math.cos(i) * 60 * strike, top: my + Math.sin(i * 1.7) * 40 * strike, width: 6, height: 6, borderRadius: "50%", background: "#ffd27a" }} />)}
    <Tag tt={tt} at={0.4} x={1300} y={330} txt="ONE SHEET + OIL" col={TX} size={52} />
  </>;
}}</Stage>;
