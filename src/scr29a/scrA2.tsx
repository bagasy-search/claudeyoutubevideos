// scr29a · componentes únicos 18-35 (minutos 8-24). Mismo escenario y lenguaje que scrA1.
import React from "react";
import { AMB, DIM, H, HAND, ICE, MARK, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const it = (h: H, i: number, d = 99) => (h.items?.[i]?.at as number | undefined) ?? d;
const steel = "linear-gradient(90deg,#3a3d42 0%,#8a9098 22%,#c9ced4 34%,#6b7077 55%,#2e3135 100%)";

// ---- 8:04 · EL CRONÓMETRO: un cronómetro de bolsillo barre 5 minutos y el fondo del cuenco pasa de gris a rojo apagado ----
export const HStopwatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const m = eio(tt, 0.6, it(h, 0) + 0.3) * 5, sec = (m * 60) % 60, heat = cl(m / 5);
  return <>
    <div style={{ position: "absolute", left: 640, top: 580, transform: "translate(-50%,-50%)" }}>
      <div style={{ width: 70, height: 60, margin: "0 auto", borderRadius: 12, background: "linear-gradient(#e4e8ec,#8d9399)" }} />
      <div style={{ width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fbf7ee, #d9d1bf)", boxShadow: "0 0 0 22px #b8bec6, 0 0 0 30px #6d7379, 0 50px 90px rgba(0,0,0,.6)", position: "relative" }}>
        {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: 258, top: 14, width: i % 5 ? 3 : 7, height: i % 5 ? 18 : 36, background: "#1b1b1b", transformOrigin: "50% 246px", transform: `rotate(${i * 6}deg)` }} />)}
        {/* subesfera de minutos */}
        <div style={{ position: "absolute", left: 200, top: 300, width: 120, height: 120, borderRadius: "50%", border: "4px solid #1b1b1b" }}>
          <div style={{ position: "absolute", left: 57, top: 10, width: 6, height: 52, background: RED, transformOrigin: "50% 50px", transform: `rotate(${(m / 5) * 360 * (5 / 6)}deg)` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontWeight: 900, fontSize: 30 }}>{Math.floor(m)}</div>
        </div>
        <div style={{ position: "absolute", left: 255, top: 40, width: 10, height: 222, background: "#1b1b1b", borderRadius: 5, transformOrigin: "50% 220px", transform: `rotate(${sec * 6}deg)` }} />
        <div style={{ position: "absolute", left: 245, top: 245, width: 30, height: 30, borderRadius: "50%", background: "#1b1b1b" }} />
      </div>
    </div>
    {/* el fondo del cuenco, de gris a rojo apagado, con el aire que tiembla encima */}
    <div style={{ position: "absolute", left: 1350, top: 600, transform: "translate(-50%,-50%)", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, rgb(${80 + 150 * heat},${80 + 20 * heat},${80 - 40 * heat}) 0%, #2a2a2c 72%)`, boxShadow: `0 0 ${120 * heat}px rgba(255,80,30,${0.5 * heat}), inset 0 0 0 20px #232325` }} />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 1220 + i * 80, top: 300 - ((tt * 60 + i * 40) % 120), width: 6, height: 90, borderRadius: 3, background: `rgba(255,220,180,${0.25 * heat})`, transform: `skewX(${Math.sin(tt * 2 + i) * 18}deg)` }} />)}
    <Tag tt={tt} at={it(h, 0)} x={1350} y={900} txt="5 MIN · BOWL HOT" col={AMB} size={48} />
    <Tag tt={tt} at={0.8} x={1350} y={190} txt="TICK… TICK…" col={DIM} size={40} />
  </>;
}}</Stage>;

// ---- 8:23 · LAS MIRILLAS: tres agujeros del tubo se encienden de a uno, amarillo, naranja y azul, cada uno en su palabra ----
export const HPortholes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const C = [["#ffe066", "#a07a00"], ["#ff8a2a", "#8a3a00"], ["#5aa8ff", "#0a2f7a"]], wob = 0.94 + 0.06 * Math.sin(tt * 2 * Math.PI * 1.4);
  return <>
    <div style={{ position: "absolute", left: 960 - 230, top: 120, width: 460, height: 860, borderRadius: 30, background: steel, boxShadow: "0 50px 100px rgba(0,0,0,.6)" }} />
    {C.map(([a, b], i) => { const on = phys(tt, it(h, i) - 0.1, 5, 0.6), y = 260 + i * 260;
      return <div key={i} style={{ position: "absolute", left: 960, top: y, transform: "translate(-50%,-50%)" }}>
        <div style={{ width: 200, height: 200, borderRadius: "50%", background: on > 0.02 ? `radial-gradient(circle, #fff ${4 * wob}%, ${a} ${30 * wob}%, ${b} 75%)` : "#070707", boxShadow: `inset 0 0 0 14px #2a2c30, 0 0 ${110 * cl(on)}px ${a}`, transform: `scale(${0.92 + 0.08 * cl(on)})` }} />
        <div style={{ position: "absolute", left: 300, top: 70, fontWeight: 900, fontSize: 58, color: a, opacity: cl(on), whiteSpace: "nowrap", transform: `translateX(${(1 - cl(on)) * 40}px)` }}>{["YELLOW", "ORANGE", "BLUE"][i]}</div>
      </div>; })}
    <Tag tt={tt} at={it(h, 2) + 0.8} x={430} y={800} txt="BLUE = CLEAN" col="#5aa8ff" size={56} />
  </>;
}}</Stage>;

// ---- 8:37 · EL PLANO DE LA CASA: vista de arriba; la estufa intenta el dormitorio (rebota en rojo), y aterriza en el garage con la puerta abierta ----
export const HFloorPlan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse at 50% 50%, #12233a, #050b14 75%)">{(tt) => {
  const toBed = eio(tt, 1.2, 2.6) * (1 - eio(tt, it(h, 0) + 0.4, it(h, 0) + 1.6)), toGar = eio(tt, it(h, 0) + 0.8, it(h, 0) + 2.4);
  const shake = tt > 2.6 && tt < it(h, 0) + 0.6 ? Math.sin(tt * 30) * 8 * cl((it(h, 0) + 0.6 - tt)) : 0;
  const sx = 960 + (-330) * toBed + 470 * toGar * 1, sy = 560 - 150 * toBed + 120 * toGar;
  const room = (x: number, y: number, w: number, hh: number, n: string, hot = 0) => <div style={{ position: "absolute", left: x, top: y, width: w, height: hh, border: "6px solid rgba(190,220,255,.8)", background: hot ? `rgba(255,74,61,${0.18 * hot})` : "rgba(190,220,255,.04)" }}><div style={{ position: "absolute", left: 20, top: 14, fontWeight: 900, fontSize: 34, letterSpacing: 3, color: "rgba(190,220,255,.85)" }}>{n}</div></div>;
  const door = eio(tt, it(h, 0) + 1.8, it(h, 0) + 3.0);
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, backgroundImage: "linear-gradient(rgba(190,220,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(190,220,255,.06) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
    {room(400, 220, 520, 340, "BEDROOM", toBed > 0.8 ? 1 : 0)}{room(920, 220, 420, 340, "KITCHEN")}{room(1340, 220, 300, 660, "GARAGE")}{room(400, 560, 940, 320, "LIVING")}
    {/* puerta del garage que se entreabre con el aire */}
    <div style={{ position: "absolute", left: 1640 - 6, top: 640, width: 12, height: 160, background: "#05101e" }} />
    <div style={{ position: "absolute", left: 1640, top: 640, width: 12, height: 160, background: "rgba(190,220,255,.8)", transformOrigin: "50% 0", transform: `rotate(${-35 * door}deg)` }} />
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1720 - ((tt * 120 + i * 60) % 200), top: 690 + i * 30, width: 70, height: 6, borderRadius: 3, background: ICE, opacity: door * 0.8 }} />)}
    {/* la estufa (ficha) */}
    <div style={{ position: "absolute", left: sx + shake, top: sy, transform: "translate(-50%,-50%)", width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ff9a4a, #b34a10)", boxShadow: "0 0 50px rgba(255,140,60,.7)" }} />
    {toBed > 0.8 && <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d="M 560 290 L 760 490 M 760 290 L 560 490" stroke={RED} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={`${cl((tt - 2.6) * 2)} 1`} /></svg>}
    <Tag tt={tt} at={it(h, 0) + 0.1} x={600} y={1000} txt="NOT WHERE YOU SLEEP" col={RED} size={52} />
    <Tag tt={tt} at={it(h, 0) + 2.6} x={1660} y={640} txt="FRESH AIR" col={ICE} size={48} />
    <Tag tt={tt} at={it(h, 1)} x={1450} y={1000} txt="CHIMNEY OUTSIDE" col={AMB} size={52} />
  </>;
}}</Stage>;

// ---- 9:26 · LA CARRERA DEL HUMO: dos caños: uno recto para arriba (el humo vuela) y uno largo de costado (el humo se traba y se escapa por las juntas) ----
export const HPipeRace: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const haze = eio(tt, 2.0, it(h, 0) + 1.2);
  const pipe = (pts: string) => <><path d={pts} fill="none" stroke="#0c0c0d" strokeWidth={76} strokeLinejoin="round" /><path d={pts} fill="none" stroke="#7d8187" strokeWidth={60} strokeLinejoin="round" /><path d={pts} fill="none" stroke="#c9ced4" strokeOpacity={0.55} strokeWidth={12} strokeLinejoin="round" transform="translate(-14,-6)" /></>;
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <line x1={960} y1={140} x2={960} y2={960} stroke="rgba(255,255,255,.15)" strokeWidth={4} />
      {pipe("M 480 900 L 480 260 L 620 160")}{pipe("M 1240 900 L 1240 760 L 1800 700")}
      {/* las dos estufas al pie de cada caño */}
      {[480, 1240].map((x) => <g key={x}><rect x={x - 110} y={880} width={220} height={120} rx={26} fill="#5d6268" stroke="#0c0c0d" strokeWidth={6} /><rect x={x - 40} y={930} width={80} height={50} rx={8} fill="#ff8a2a" opacity={0.85} /></g>)}
      {/* juntas del caño de costado */}
      {[1380, 1520, 1660].map((x) => <rect key={x} x={x - 8} y={720 - (x - 1240) * 0.11} width={16} height={74} fill="#2a2a2c" />)}
    </svg>
    {/* humo en el caño recto: sube rápido y sale */}
    {Array.from({ length: 12 }, (_, i) => { const ph = (tt * 0.55 + i / 12) % 1, y = 900 - ph * 760; return <div key={i} style={{ position: "absolute", left: 480 + (y < 260 ? (260 - y) * 1.2 : 0) - 26, top: y - 26, width: 52 + ph * 40, height: 52 + ph * 40, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,226,235,.6), rgba(220,226,235,0) 70%)" }} />; })}
    {/* humo en el caño de costado: lento, se junta y se escapa por las juntas */}
    {Array.from({ length: 12 }, (_, i) => { const ph = (tt * 0.12 + i / 12) % 1, x = 1240 + ph * 300; return <div key={i} style={{ position: "absolute", left: x - 30, top: (ph < 0.3 ? 900 - ph * 470 : 740 - (x - 1240) * 0.11) - 30, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle, rgba(60,60,64,.8), rgba(60,60,64,0) 70%)" }} />; })}
    {[1380, 1520, 1660].map((x, k) => Array.from({ length: 4 }, (_, i) => { const ph = (tt * 0.35 + i / 4 + k * 0.2) % 1; return <div key={x + "_" + i} style={{ position: "absolute", left: x - 30 + Math.sin(ph * 6 + k) * 30, top: 700 - (x - 1240) * 0.11 - ph * 220, width: 60 + ph * 70, height: 60 + ph * 70, borderRadius: "50%", background: "radial-gradient(circle, rgba(70,70,74,.7), rgba(70,70,74,0) 70%)", opacity: haze * (1 - ph) }} />; }))}
    <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, background: "rgba(60,60,66,.45)", opacity: haze * 0.8 }} />
    <Tag tt={tt} at={0.5} x={480} y={1040} txt="STRAIGHT UP" col={AMB} size={50} />
    <Tag tt={tt} at={0.9} x={1440} y={1040} txt="LONG SIDEWAYS RUN" col={RED} size={50} />
    <Tag tt={tt} at={it(h, 0)} x={1440} y={380} txt="SMOKE IN THE GARAGE" col={DIM} size={40} />
  </>;
}}</Stage>;

// ---- 9:59 · LA VENTANA QUE SE DESEMPAÑA: la escarcha se retira desde el centro mientras el contador de rodillos gira de 40 a 65 °F ----
const Drum: React.FC<{ v: number }> = ({ v }) => { const d = Math.floor(v), f = v - d, k = f > 0.8 ? (f - 0.8) / 0.2 : 0;
  return <div style={{ width: 130, height: 180, overflow: "hidden", borderRadius: 14, background: "linear-gradient(#0d0d0f,#2a2a2e 50%,#0d0d0f)", boxShadow: "inset 0 0 20px #000", position: "relative" }}>
    {[d, d + 1].map((n, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (i - k) * 180, height: 180, lineHeight: "180px", textAlign: "center", fontWeight: 900, fontSize: 140, color: TX }}>{n % 10}</div>)}
  </div>; };
export const HFrost: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const temp = 40 + 25 * eio(tt, 0.8, it(h, 0) + 0.4), clear = eio(tt, 0.8, it(h, 1) + 2.5), mins = Math.round(45 * eio(tt, it(h, 0) - 0.5, it(h, 1) + 0.3));
  return <>
    <div style={{ position: "absolute", left: 650, top: 540, transform: "translate(-50%,-50%)", padding: 24, background: "#e8e4dc", borderRadius: 10, boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "relative", width: 700, height: 620, overflow: "hidden" }}>
        <Photo id={h.img} w={700} h={620} r={0} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(225,238,255,.82)", WebkitMaskImage: `radial-gradient(circle at 50% 55%, transparent ${clear * 70}%, #000 ${clear * 70 + 18}%)`, maskImage: `radial-gradient(circle at 50% 55%, transparent ${clear * 70}%, #000 ${clear * 70 + 18}%)` } as React.CSSProperties} />
        <div style={{ position: "absolute", left: 345, top: 0, width: 12, height: 620, background: "#e8e4dc" }} /><div style={{ position: "absolute", left: 0, top: 305, width: 700, height: 12, background: "#e8e4dc" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1400, top: 470, transform: "translate(-50%,-50%)", display: "flex", gap: 10, padding: 18, background: "linear-gradient(#4a4b4f,#26272a)", borderRadius: 18, boxShadow: "0 40px 70px rgba(0,0,0,.6)" }}>
      <Drum v={Math.floor(temp / 10) + (temp % 10 > 9 ? (temp % 10) - 9 : 0)} /><Drum v={temp % 10} />
      <div style={{ fontWeight: 900, fontSize: 80, color: AMB, alignSelf: "center", marginLeft: 10 }}>°F</div>
    </div>
    <Tag tt={tt} at={it(h, 1)} x={1480} y={730} txt={`${mins} MINUTES`} col={TX} size={56} />
    <Tag tt={tt} at={it(h, 1) + 0.6} x={1480} y={830} txt="ONE DROP A SECOND" col={TX} size={44} />
  </>;
}}</Stage>;

// ---- 10:51 · LA CÁMARA TÉRMICA: un visor recorre la plancha y la pinta en falso color; dos miras leen el punto caliente y el extremo tibio ----
export const HThermal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const scan = eio(tt, 0.9, 3.6), r1 = phys(tt, it(h, 0), 6, 0.5), r2 = phys(tt, it(h, 0) + 1.4, 6, 0.5);
  return <>
    <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)" }}>
      <Photo id={h.img} w={1400} h={800} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(90deg, #fff6c0 0%, #ff5a1a 18%, #c4155a 42%, #5a1a9a 70%, #1a2a8a 100%)", mixBlendMode: "hard-light", opacity: 0.85, clipPath: `inset(0 ${100 - scan * 100}% 0 0)` }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${scan * 100}%`, width: 6, background: "#fff", boxShadow: "0 0 30px #fff", opacity: scan < 1 ? 1 : 0 }} />
      {/* esquinas del visor */}
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x ? 1400 - 90 : 30, top: y ? 800 - 90 : 30, width: 60, height: 60, borderLeft: x ? "none" : "6px solid #fff", borderRight: x ? "6px solid #fff" : "none", borderTop: y ? "none" : "6px solid #fff", borderBottom: y ? "6px solid #fff" : "none", opacity: 0.8 }} />)}
      {[{ x: 230, s: r1, txt: "HOTTEST", c: "#fff6c0" }, { x: 1150, s: r2, txt: "HALF AS HOT", c: ICE }].map((m, i) => <div key={i} style={{ position: "absolute", left: m.x, top: 400, transform: `translate(-50%,-50%) scale(${1.6 - 0.6 * cl(m.s)})`, opacity: cl(m.s * 2) }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", border: `5px solid ${m.c}` }} />
        <div style={{ position: "absolute", left: 57, top: -30, width: 6, height: 180, background: m.c }} /><div style={{ position: "absolute", left: -30, top: 57, width: 180, height: 6, background: m.c }} />
        <div style={{ position: "absolute", left: 140, top: -10, fontWeight: 900, fontSize: 44, color: m.c, whiteSpace: "nowrap", textShadow: "0 4px 18px #000" }}>{m.txt}</div>
      </div>)}
    </div>
  </>;
}}</Stage>;

// ---- 14:22 · EL TERMÓMETRO DE DIAL: el vástago metido en el balde; la aguja barre de 50 a 110 °F y el agua empieza a humear ----
export const HDial: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const v = 50 + 60 * eio(tt, 1.0, it(h, 0) + 0.3), a = -135 + ((v - 30) / 100) * 270, steam = cl((v - 85) / 25);
  return <>
    <div style={{ position: "absolute", left: 1250, top: 600, transform: "translate(-50%,-50%)" }}><Photo id={h.img} w={760} h={720} /></div>
    {Array.from({ length: 5 }, (_, i) => { const ph = (tt * 0.3 + i / 5) % 1; return <div key={i} style={{ position: "absolute", left: 1120 + i * 60 + Math.sin(ph * 5 + i) * 30, top: 520 - ph * 380, width: 90 + ph * 80, height: 90 + ph * 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.4), rgba(255,255,255,0) 70%)", opacity: steam * (1 - ph) }} />; })}
    <div style={{ position: "absolute", left: 610, top: 520, transform: "translate(-50%,-50%) rotate(-12deg)" }}>
      <div style={{ position: "absolute", left: 255, top: 470, width: 18, height: 380, background: "linear-gradient(90deg,#8d9399,#e4e8ec,#6d7379)", borderRadius: 9, transform: "rotate(-40deg)", transformOrigin: "50% 0" }} />
      <div style={{ width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fbf7ee, #e2dac6)", boxShadow: "0 0 0 24px #c9ced4, 0 0 0 30px #5d6268, 0 50px 90px rgba(0,0,0,.6)", position: "relative" }}>
        <svg width={520} height={520} viewBox="-260 -260 520 520" style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={`M ${Math.cos((-225 * Math.PI) / 180) * 200} ${Math.sin((-225 * Math.PI) / 180) * 200} A 200 200 0 1 1 ${Math.cos((45 * Math.PI) / 180) * 200} ${Math.sin((45 * Math.PI) / 180) * 200}`} fill="none" stroke="#e8e1cf" strokeWidth={30} />
          {Array.from({ length: 11 }, (_, i) => { const an = ((-225 + i * 27) * Math.PI) / 180; return <g key={i}><line x1={Math.cos(an) * 180} y1={Math.sin(an) * 180} x2={Math.cos(an) * 218} y2={Math.sin(an) * 218} stroke="#1b1b1b" strokeWidth={6} /><text x={Math.cos(an) * 140} y={Math.sin(an) * 140 + 12} textAnchor="middle" fontSize={34} fontWeight={900} fill="#1b1b1b">{30 + i * 10}</text></g>; })}
        </svg>
        <div style={{ position: "absolute", left: 254, top: 60, width: 12, height: 205, background: RED, borderRadius: 6, transformOrigin: "50% 200px", transform: `rotate(${a + 90}deg)` }} />
        <div style={{ position: "absolute", left: 230, top: 230, width: 60, height: 60, borderRadius: "50%", background: "#1b1b1b" }} />
        <div style={{ position: "absolute", left: 185, width: 150, top: 300, height: 58, borderRadius: 10, background: "#1b1b1b", textAlign: "center", lineHeight: "58px", fontWeight: 900, fontSize: 44, color: "#ffb347", boxShadow: "inset 0 4px 10px rgba(0,0,0,.6)" }}>{Math.round(v)}°F</div>
      </div>
    </div>
    <Tag tt={tt} at={it(h, 0) + 0.4} x={1250} y={980} txt="IN AN HOUR AND A HALF" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 14:53 · EL GLOBO: el serpentín cerrado con un globo en la punta se infla con el vapor hasta reventar; abierto al balde, el vapor sale tranquilo ----
export const HBalloon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const popT = it(h, 0) + 0.5, inf = eio(tt, 0.6, popT), pop = tt > popT, pk = cl((tt - popT) / 0.5), open = phys(tt, it(h, 1) - 0.3, 5, 0.55);
  const wob = 1 + 0.03 * Math.sin(tt * 9) * inf;
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={560} cy={360 + i * 70} rx={170} ry={34} fill="none" stroke="#c47a45" strokeWidth={20} />)}
      <path d="M 730 360 L 900 360 L 900 300" fill="none" stroke="#c47a45" strokeWidth={20} />
      <path d="M 730 710 C 1000 710 1200 760 1400 640" fill="none" stroke="#c47a45" strokeWidth={20} opacity={cl(open)} />
    </svg>
    {/* burbujas que dan vueltas por el serpentín */}
    {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 0.5 + i / 10) % 1, k = Math.floor(ph * 6), an = (ph * 6 - k) * Math.PI * 2; return <div key={i} style={{ position: "absolute", left: 560 + Math.cos(an) * 170 - 10, top: 360 + (5 - k) * 70 + Math.sin(an) * 34 - 10, width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,.75)" }} />; })}
    {!pop ? <div style={{ position: "absolute", left: 900, top: 300, transform: `translate(-50%,-100%) scale(${(0.2 + 0.9 * inf) * wob})`, transformOrigin: "50% 100%" }}>
      <div style={{ width: 300, height: 360, borderRadius: "50% 50% 46% 46% / 55% 55% 45% 45%", background: "radial-gradient(circle at 35% 30%, #ff9a8a, #d0241a 55%, #7a0e08)", boxShadow: `0 0 ${60 * inf}px rgba(255,60,40,.5)` }} />
    </div> : <>{Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 900 + Math.cos(i * 0.52) * 260 * pk - 20, top: 140 + Math.sin(i * 0.52) * 260 * pk - 20, width: 40, height: 16, borderRadius: 6, background: "#d0241a", opacity: 1 - pk, transform: `rotate(${i * 40 + pk * 200}deg)` }} />)}
      <div style={{ position: "absolute", left: 900 - 200 * (0.5 + pk), top: 140 - 200 * (0.5 + pk), width: 400 * (0.5 + pk), height: 400 * (0.5 + pk), borderRadius: "50%", border: `8px solid ${AMB}`, opacity: 1 - pk }} /></>}
    {/* el balde abierto con el vapor tranquilo */}
    <div style={{ position: "absolute", left: 1500, top: 760, transform: `translate(-50%,-50%) scale(${cl(open)})`, opacity: cl(open * 2) }}>
      <div style={{ width: 280, height: 300, clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", background: "linear-gradient(90deg,#d8d6d0,#f4f2ec,#bdbab2)" }} />
      {Array.from({ length: 4 }, (_, i) => { const ph = (tt * 0.35 + i / 4) % 1; return <div key={i} style={{ position: "absolute", left: 60 + i * 40, top: -ph * 260, width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.45), rgba(255,255,255,0) 70%)", opacity: 1 - ph }} />; })}
    </div>
    <Tag tt={tt} at={0.8} x={560} y={1000} txt="CLOSED COIL" col={RED} size={50} />
    <Tag tt={tt} at={it(h, 1)} x={1500} y={980} txt="OPEN BUCKET. ALWAYS." col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 15:43 · LA CAJA DE HERRAMIENTAS DE LOS VIEJOS: la tapa roja se abre y sube cada cosa en su palabra; lo que ellos nunca usaban queda tachado con tiza ----
const Item: React.FC<{ kind: number }> = ({ kind }) => kind === 0
  ? <svg width={220} height={160} viewBox="0 0 220 160"><rect x={20} y={70} width={60} height={20} fill="#2a2a2a" /><rect x={140} y={70} width={60} height={20} fill="#2a2a2a" /><rect x={70} y={40} width={80} height={80} rx={14} fill="rgba(255,235,170,.55)" stroke="#e8e0c0" strokeWidth={5} /><rect x={80} y={60} width={60} height={40} fill="rgba(200,160,60,.6)" /></svg>
  : kind === 1 ? <svg width={220} height={200} viewBox="0 0 220 200"><defs><linearGradient id="bv" x1="0" x2="1"><stop offset="0" stopColor="#7a5418" /><stop offset=".45" stopColor="#ffe29a" /><stop offset="1" stopColor="#8a6420" /></linearGradient></defs><rect x={80} y={10} width={60} height={60} rx={8} fill="url(#bv)" /><polygon points="60,70 160,70 172,100 160,130 60,130 48,100" fill="url(#bv)" /><rect x={95} y={130} width={30} height={60} fill="url(#bv)" /><rect x={160} y={88} width={52} height={24} rx={6} fill="url(#bv)" /></svg>
    : <svg width={200} height={240} viewBox="0 0 200 240"><rect x={40} y={60} width={120} height={170} rx={16} fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.5)" strokeWidth={5} /><rect x={46} y={100} width={108} height={124} rx={12} fill="#c8a98a" /><rect x={70} y={30} width={60} height={34} rx={6} fill="#555" /></svg>;
export const HToolbox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const lid = eio(tt, 0.2, 1.1);
  const items = [{ k: 0, at: 0.9, x: 560, bad: true, txt: "PLASTIC" }, { k: 1, at: it(h, 0), x: 960, bad: false, txt: "BRASS" }, { k: 2, at: it(h, 1), x: 1360, bad: true, txt: "MILKY OIL" }];
  return <>
    <div style={{ position: "absolute", left: 960, top: 820, width: 1240, height: 260, marginLeft: -620, borderRadius: 16, background: "linear-gradient(180deg,#d0241a,#8a120c)", boxShadow: "0 50px 90px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,255,255,.2)" }}>
      <div style={{ position: "absolute", left: 520, top: 40, width: 200, height: 40, borderRadius: 10, background: "linear-gradient(#e4e8ec,#8d9399)" }} />
    </div>
    <div style={{ position: "absolute", left: 960 - 620, top: 820 - 70, width: 1240, height: 80, borderRadius: 16, background: "linear-gradient(180deg,#e0322a,#a8160f)", transformOrigin: "50% 0%", transform: `perspective(1500px) rotateX(${lid * 105}deg) translateY(${-lid * 10}px)` }} />
    {items.map((o, i) => { const s = phys(tt, o.at - 0.2, 5, 0.5), cross = eio(tt, o.at + 0.7, o.at + 1.3);
      return <div key={i} style={{ position: "absolute", left: o.x, top: 430, transform: `translate(-50%,-50%) translateY(${(1 - s) * 340}px) rotate(${(1 - cl(s)) * 14}deg) scale(1.3)`, opacity: cl(s * 2) }}>
        <div style={{ width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center", filter: o.bad ? `saturate(${1 - 0.6 * cross})` : `drop-shadow(0 0 ${30 * cl(s)}px rgba(255,200,90,.6))` }}><Item kind={o.k} /></div>
        {o.bad && <svg width={300} height={300} style={{ position: "absolute", left: 0, top: 0 }}><circle cx={150} cy={150} r={130} fill="none" stroke="#f4efe6" strokeWidth={12} pathLength={1} strokeDasharray={`${cross} 1`} strokeLinecap="round" opacity={0.9} /><line x1={60} y1={60} x2={240} y2={240} stroke="#f4efe6" strokeWidth={12} pathLength={1} strokeDasharray={`${cl(cross * 2 - 1)} 1`} strokeLinecap="round" /></svg>}
        <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: o.bad ? "#f4efe6" : AMB, marginTop: -10 }}>{o.txt}</div>
      </div>; })}
  </>;
}}</Stage>;

// ---- 16:34 · LA NOCHE QUE NO SECA: sobre las botas mojadas pasa la luna y sale el sol por un arco; las gotas siguen cayendo ----
export const HDayCycle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const p = eio(tt, 0.5, 5.5), an = Math.PI * (1 - p), sun = cl((p - 0.5) * 2);
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 700, background: `linear-gradient(180deg, rgb(${10 + 120 * sun},${16 + 140 * sun},${40 + 160 * sun}), rgb(${20 + 200 * sun},${24 + 140 * sun},${50 + 60 * sun}))`, opacity: 0.85 }} />
    <div style={{ position: "absolute", left: 960 + Math.cos(an) * 700 - 70, top: 700 - Math.sin(an) * 520 - 70, width: 140, height: 140, borderRadius: "50%", background: sun > 0.5 ? "radial-gradient(circle, #fff6c0, #ffb347 60%, rgba(255,140,40,0) 72%)" : "radial-gradient(circle at 40% 40%, #f4f1e6, #b9b6a8 65%, rgba(185,182,168,0) 72%)", boxShadow: sun > 0.5 ? "0 0 120px rgba(255,190,90,.7)" : "0 0 60px rgba(220,230,255,.4)" }} />
    <div style={{ position: "absolute", left: 960, top: 690, transform: "translate(-50%,-50%)" }}><Photo id={h.img} w={720} h={500} /></div>
    {Array.from({ length: 8 }, (_, i) => { const ph = (tt * 0.8 + i / 8) % 1; return <div key={i} style={{ position: "absolute", left: 760 + (i * 57) % 400, top: 940 + ph * 110, width: 14, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(150,200,255,.85)", opacity: 1 - ph }} />; })}
    <Tag tt={tt} at={4.6} x={1500} y={330} txt="STILL WET" col="#ffd24a" size={60} />
  </>;
}}</Stage>;

// ---- 17:26 · LA BALANZA: en un platillo el costo de la estufa; en el otro caen guantes y botas secas cada mañana, y la balanza se vuelca ----
export const HBalance: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const n = [it(h, 0), it(h, 0) + 0.5, it(h, 1)].filter((x) => tt > x).length, tilt = -8 + 8 * 0 + (n * 7) * cl(phys(tt, it(h, 0), 4, 0.35)) - (n === 0 ? 0 : 0);
  const ang = n === 0 ? -8 + 1.5 * Math.sin(tt * 1.3) : Math.min(14, -8 + n * 8);
  const L = 420, cx = 960, cy = 360, ly = cy - Math.sin((ang * Math.PI) / 180) * L, ry = cy + Math.sin((ang * Math.PI) / 180) * L;
  const pan = (x: number, y: number, kids: React.ReactNode) => <div style={{ position: "absolute", left: x, top: y, transform: "translateX(-50%)" }}>
    <svg width={300} height={220} style={{ position: "absolute", left: -150 + 150, top: 0 }}><line x1={150} y1={0} x2={30} y2={200} stroke="#c9a24a" strokeWidth={4} /><line x1={150} y1={0} x2={270} y2={200} stroke="#c9a24a" strokeWidth={4} /></svg>
    <div style={{ position: "absolute", left: 0, top: 200, width: 300, height: 40, borderRadius: "0 0 150px 150px", background: "linear-gradient(#ffe29a,#a8762a)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 20, top: 40, width: 260, height: 160, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>{kids}</div>
  </div>;
  return <>
    <div style={{ position: "absolute", left: cx - 12, top: cy, width: 24, height: 560, background: "linear-gradient(90deg,#7a5418,#ffe29a,#7a5418)" }} />
    <div style={{ position: "absolute", left: cx - 160, top: cy + 540, width: 320, height: 40, borderRadius: 12, background: "linear-gradient(#ffe29a,#7a5418)" }} />
    <div style={{ position: "absolute", left: cx - L, top: cy - 8, width: 2 * L, height: 16, borderRadius: 8, background: "linear-gradient(#ffe29a,#a8762a)", transform: `rotate(${-ang}deg)` }} />
    {pan(cx - L * Math.cos((ang * Math.PI) / 180) + 150, ly - 0, <div style={{ width: 200, height: 130, borderRadius: 10, background: "linear-gradient(#5d6268,#2e3135)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 48, color: TX }}>BUILD</div>)}
    {pan(cx + L * Math.cos((ang * Math.PI) / 180) + 150, ry, <>{[0, 1, 2].map((i) => { const s = phys(tt, [it(h, 0), it(h, 0) + 0.5, it(h, 1)][i] - 0.4, 6, 0.4); return s > 0.01 ? <div key={i} style={{ transform: `translateY(${(1 - s) * -400}px)`, opacity: cl(s * 3) }}><Photo id={h.imgs?.[i] ?? h.img} w={80} h={110} r={8} /></div> : null; })}</>)}
    <Tag tt={tt} at={0.6} x={960} y={150} txt="PAYS FOR THE BUILD" col={AMB} size={58} />
    <Tag tt={tt} at={it(h, 1) + 0.4} x={960} y={1010} txt="DRY · WARM · DAILY" col={TX} size={56} />
  </>;
}}</Stage>;

// ---- 18:13 · EL CUADERNO DE ANILLOS: las hojas de la rutina pasan por los anillos, cada una con su número grande y su foto ----
export const HBinder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const pages = [{ n: "2", txt: "BOWL BACK IN", at: 0 }, { n: "3", txt: "TUBE STRAIGHT", at: it(h, 0) }, { n: "4", txt: "ONE SHEET", at: it(h, 1) }];
  const s = phys(tt, 0.05, 4.2, 0.55);
  return <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) translateY(${(1 - s) * 700}px) rotate(${(1 - s) * -8}deg)` }}>
    <div style={{ position: "relative", width: 1100, height: 760, perspective: 2400 }}>
      <div style={{ position: "absolute", left: 0, top: 30, width: 1100, height: 730, borderRadius: 14, background: "#2b2b2e", boxShadow: "0 60px 110px rgba(0,0,0,.7)" }} />
      {pages.map((p, i) => { const flip = i < pages.length - 1 ? eio(tt, pages[i + 1].at - 0.6, pages[i + 1].at + 0.1) : 0;
        return <div key={i} style={{ position: "absolute", left: 30, top: 40, width: 1040, height: 700, transformOrigin: "50% 0%", transform: `rotateX(${flip * 178}deg)`, zIndex: 10 - i, backfaceVisibility: "hidden", background: "#f4efe6", borderRadius: 8, display: "flex", alignItems: "center", gap: 40, padding: "70px 60px 40px", boxShadow: "0 10px 30px rgba(0,0,0,.3)" }}>
          <div style={{ fontWeight: 900, fontSize: 300, color: AMB, width: 220, textAlign: "center", textShadow: "0 6px 0 #b8742a" }}>{p.n}</div>
          <div><Photo id={h.imgs?.[i] ?? h.img} w={620} h={420} /><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 92, color: "#2b2620", marginTop: 8 }}>{p.txt}</div></div>
        </div>; })}
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 110 + i * 145, top: 4, width: 44, height: 70, borderRadius: 22, border: "8px solid #c9ced4", borderBottomColor: "#6d7379", zIndex: 20 }} />)}
    </div>
  </div>;
}}</Stage>;

// ---- 19:07 · EL RELOJ DE ARENA: la arena cae mientras la llama del cuenco se achica sola hasta apagarse ----
export const HHourglass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 0.6, 8.6), fl = 0.92 + 0.08 * Math.sin(tt * 2 * Math.PI * 1.3), fs = Math.max(0, 1 - p * 1.08);
  return <>
    <div style={{ position: "absolute", left: 640, top: 560, transform: "translate(-50%,-50%)" }}>
      <div style={{ width: 380, height: 40, borderRadius: 10, background: "linear-gradient(#8a5530,#4a2a14)" }} />
      <div style={{ position: "relative", width: 380, height: 560 }}>
        <div style={{ position: "absolute", left: 40, top: 0, width: 300, height: 560, clipPath: "polygon(0 0,100% 0,56% 50%,100% 100%,0 100%,44% 50%)", background: "rgba(220,235,255,.12)", border: "2px solid rgba(255,255,255,.3)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 280 - 260 * (1 - p), height: 260 * (1 - p), background: "#e0b56a" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 250 * p, background: "#d8a85a", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
          {p < 0.98 && <div style={{ position: "absolute", left: 147, top: 270, width: 6, height: 290 - 250 * p, background: "#e0b56a" }} />}
        </div>
      </div>
      <div style={{ width: 380, height: 40, borderRadius: 10, background: "linear-gradient(#8a5530,#4a2a14)" }} />
    </div>
    <div style={{ position: "absolute", left: 1320, top: 820, transform: "translate(-50%,-50%)" }}>
      <div style={{ position: "absolute", left: -110, top: -300 * fs * fl, width: 220, height: 300 * fs * fl, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 50% 85%, #cfe4ff, #5aa8ff 35%, rgba(255,140,40,.5) 60%, rgba(255,80,20,0) 72%)" }} />
      <div style={{ width: 420, height: 110, marginLeft: -210, borderRadius: "0 0 210px 210px", background: "linear-gradient(#3a3a3d,#1a1a1c)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
    </div>
    <Tag tt={tt} at={0.6} x={1320} y={260} txt="VALVE SHUT" col={TX} size={50} />
    <Tag tt={tt} at={it(h, 0)} x={640} y={940} txt="10-15 MIN" col={AMB} size={54} />
  </>;
}}</Stage>;

// ---- 19:23 · EL CORCHO: una ficha con la pregunta real cae clavada por una chinche; abajo, la respuesta escrita a mano ----
export const HCork: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 45%, #8a6a44, #3a2a18 80%)">{(tt) => {
  const c = phys(tt, 0.3, 5, 0.45), pin = phys(tt, 1.0, 7, 0.4), sw = 3 * Math.exp(-(tt - 1) * 1.5) * Math.sin((tt - 1) * 6) * (tt > 1 ? 1 : 0), ans = eio(tt, it(h, 0) - 0.2, it(h, 0) + 1.2);
  return <>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(60,40,20,.5) 2px, transparent 3px)", backgroundSize: "18px 18px", opacity: 0.6 }} />
    <div style={{ position: "absolute", left: 960, top: 500, transformOrigin: "50% 0", transform: `translate(-50%,-50%) translateY(${(1 - c) * -600}px) rotate(${-3 + sw}deg)` }}>
      <div style={{ width: 1000, height: 560, background: "repeating-linear-gradient(180deg, #fbf8f0 0 64px, #c9d6e6 64px 66px)", boxShadow: "0 40px 80px rgba(0,0,0,.5)", padding: "90px 70px", fontFamily: HAND, color: "#2b2620" }}>
        <div style={{ fontSize: 46, fontWeight: 700, color: "#8a7a64" }}>a viewer asked:</div>
        <div style={{ fontSize: 120, fontWeight: 700, lineHeight: "130px" }}>“Does it smell?”</div>
        <div style={{ fontSize: 96, fontWeight: 700, color: "#1f5fbf", clipPath: `inset(0 ${(1 - ans) * 100}% 0 0)`, marginTop: 30 }}>Running blue: no.</div>
      </div>
      <div style={{ position: "absolute", left: 480, top: -20, transform: `translateY(${(1 - pin) * -200}px) scale(${1 + (1 - cl(pin)) * 0.6})`, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff8a7a, #c0241a)", boxShadow: "0 10px 16px rgba(0,0,0,.5)" }} />
    </div>
  </>;
}}</Stage>;

// ---- 20:30 · LA CAJA REGISTRADORA: cada tecla salta en su palabra (válvula, cobre, caño) y el cajón se abre al decir «under $60» ----
export const HRegister: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const keys = ["VALVE", "COPPER", "PIPE"], tot = [0, 1, 2].filter((i) => tt > it(h, i)).length, drawer = phys(tt, it(h, 3) - 0.1, 5, 0.45);
  const shown = ["$0", "$14", "$38", "$57"][tot];
  return <>
    <div style={{ position: "absolute", left: 960, top: 600, transform: "translate(-50%,-50%)" }}>
      <div style={{ position: "relative", width: 900, height: 560 }}>
        {/* visor */}
        <div style={{ position: "absolute", left: 560, top: -190, width: 300, height: 130, borderRadius: 16, background: "linear-gradient(#5a5048,#2a241e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 250, height: 80, borderRadius: 8, background: "#0d0d0b", color: AMB, fontWeight: 900, fontSize: 64, textAlign: "center", lineHeight: "80px", textShadow: `0 0 18px ${AMB}` }}>{shown}</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 420, borderRadius: "30px 30px 10px 10px", background: "linear-gradient(160deg,#c9a24a,#8a6420 60%,#5a3e10)", boxShadow: "0 50px 90px rgba(0,0,0,.6), inset 0 4px 0 rgba(255,255,255,.3)" }} />
        {keys.map((k, i) => { const down = tt > it(h, i) && tt < it(h, i) + 0.35 ? 1 : 0, pop = phys(tt, it(h, i) + 0.35, 6, 0.4) * (tt > it(h, i) ? 1 : 0);
          return <div key={i} style={{ position: "absolute", left: 70 + i * 260, top: 80 + down * 18, width: 220, height: 140, borderRadius: 18, background: tt > it(h, i) ? "linear-gradient(#ffe29a,#c9952c)" : "linear-gradient(#f4efe6,#cfc6b0)", boxShadow: "0 12px 0 #3a2a10, 0 20px 30px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 44, color: "#2b2117" }}>
            {k}{pop > 0.01 && <div style={{ position: "absolute", left: 30, top: -105 * cl(pop), width: 160, height: 90, borderRadius: 10, background: "#f4efe6", boxShadow: "0 10px 20px rgba(0,0,0,.4)", fontWeight: 900, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", opacity: cl(pop * 2) }}>{["$14", "$24", "$19"][i]}</div>}
          </div>; })}
        {/* el cajón */}
        <div style={{ position: "absolute", left: 40, top: 420 + 0, width: 820, height: 140, borderRadius: 10, background: "linear-gradient(#7a5418,#4a320c)", transform: `translateY(${cl(drawer) * 90}px) scale(${1 + 0.05 * cl(drawer)})`, boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
          <div style={{ position: "absolute", left: 360, top: 50, width: 100, height: 20, borderRadius: 10, background: "#ffe29a" }} />
        </div>
      </div>
    </div>
    <Tag tt={tt} at={it(h, 3) + 0.3} x={960} y={1010} txt="UNDER $60, ALL IN" col={AMB} size={56} />
    <div style={{ opacity: 1 - eio(tt, it(h, 3) - 0.3, it(h, 3)) }}><Tag tt={tt} at={0.5} x={960} y={1010} txt="OIL: FREE" col={DIM} size={44} /></div>
  </>;
}}</Stage>;

// ---- 20:46 · LA CINTA TRANSPORTADORA: el repaso pasa sobre una cinta con rodillos; cada pieza entra en su palabra y se ilumina bajo el foco ----
export const HConveyor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const cards = [{ txt: "AIR TANK ONLY", at: 0.3 }, { txt: "DRAINED + RINSED", at: it(h, 0) }, { txt: 'DOOR 6x5, 4" UP', at: it(h, 1) }, { txt: '4" CHIMNEY HOLE', at: it(h, 2) }, { txt: '½" DRIP HOLE', at: it(h, 3) }];
  const roll = tt * 220;
  return <>
    <div style={{ position: "absolute", left: 960 - 150, top: 0, width: 300, height: 1080, background: "linear-gradient(90deg, transparent, rgba(255,226,170,.12), transparent)" }} />
    <div style={{ position: "absolute", left: -20, top: 790, width: 1960, height: 60, background: "repeating-linear-gradient(90deg,#1b1b1d 0 40px,#2a2a2d 40px 80px)", backgroundPositionX: -roll, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 160, top: 850, width: 70, height: 70, borderRadius: "50%", background: `conic-gradient(from ${roll}deg, #8d9399, #e4e8ec, #6d7379, #e4e8ec, #8d9399)` }} />)}
    {cards.map((c, i) => { // cada tarjeta llega en su frase, frena en el centro y la siguiente la empuja a la izquierda
      const push = cards.slice(i + 1).reduce((a, n) => a + 600 * eio(tt, n.at - 0.7, n.at), 0);
      const x = 960 + 1400 * (1 - eio(tt, c.at - 0.8, c.at)) - push, near = Math.max(0, 1 - Math.abs(x - 960) / 600); if (x < -400 || tt < c.at - 0.8) return null;
      return <div key={i} style={{ position: "absolute", left: x, top: 790, transform: `translate(-50%,-100%) translateY(${-18 * near}px) scale(${0.82 + 0.18 * near})`, filter: `brightness(${0.55 + 0.45 * near})` }}>
        <Photo id={h.imgs?.[i] ?? h.img} w={480} h={340} />
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 64, marginTop: 14, color: near > 0.6 ? AMB : DIM, whiteSpace: "nowrap" }}>{c.txt}</div>
      </div>; })}
    <Tag tt={tt} at={0.2} x={960} y={130} txt="ONE MORE TIME" col={TX} size={56} />
  </>;
}}</Stage>;

// ---- 21:56 · EL TABLERO DE SILUETAS: el panel de herramientas con 4 lugares llenos (las 4 funciones) y el quinto vacío, que brilla con un signo ----
export const HShadow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 45%, #2a2418, #0d0b08 78%)">{(tt) => {
  const glow = 0.5 + 0.5 * Math.sin(tt * 2.4), five = phys(tt, 2.6, 5, 0.5);
  const slots = ["HEAT", "COOK", "WATER", "DRY"];
  return <>
    <div style={{ position: "absolute", left: 160, top: 170, width: 1600, height: 760, borderRadius: 16, background: "#b99a6e", boxShadow: "0 50px 90px rgba(0,0,0,.6)", backgroundImage: "radial-gradient(rgba(40,30,20,.6) 4px, transparent 5px)", backgroundSize: "40px 40px" }} />
    {slots.map((s, i) => { const k = phys(tt, 0.3 + i * 0.3, 6, 0.5); return <div key={i} style={{ position: "absolute", left: 200 + i * 320, top: 260, opacity: cl(k * 2), transform: `translateY(${(1 - k) * -80}px)` }}>
      <div style={{ width: 290, height: 390, borderRadius: 14, background: "rgba(0,0,0,.35)", padding: 10 }}><Photo id={h.imgs?.[i] ?? h.img} w={270} h={370} r={10} /></div>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 72, color: "#2b2117", marginTop: 8 }}>{s}</div>
    </div>; })}
    <div style={{ position: "absolute", left: 1480, top: 260, width: 270, height: 390, borderRadius: 14, border: `8px dashed rgba(255,178,87,${0.4 + 0.6 * glow * cl(five)})`, boxShadow: `0 0 ${50 * glow * cl(five)}px rgba(255,178,87,.6)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MARK, fontSize: 170, color: AMB, transform: `scale(${0.85 + 0.15 * cl(five)})`, opacity: cl(five * 2) }}>5?</div>
    <div style={{ position: "absolute", left: 1480, top: 672, width: 270, textAlign: "center", fontWeight: 900, fontSize: 52, color: AMB, opacity: cl(five) }}>YOUR IDEA</div>
    <Tag tt={tt} at={3.6} x={960} y={1010} txt="TELL ME BELOW" col={TX} size={64} />
  </>;
}}</Stage>;

// ---- 23:28 · EL ABANICO DE MUESTRAS: un muestrario de pintura se abre de a una tarjeta: humo claro, gris y negro, cada uno en su palabra ----
export const HPaintFan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const chips = [{ c: "rgba(240,244,250,.25)", txt: "CLEAR", sub: "PERFECT", at: 0.2, col: AMB }, { c: "#8a8d92", txt: "GRAY", sub: "DRIP TOO FAST", at: it(h, 0), col: TX }, { c: "#151515", txt: "BLACK", sub: "SHUT IT DOWN", at: it(h, 1), col: RED }];
  return <>
    <div style={{ position: "absolute", left: 960, top: 980 }}>
      {chips.map((c, i) => { const o = phys(tt, c.at - 0.2, 4.5, 0.5), ang = -40 + i * 40 * cl(o);
        return <div key={i} style={{ position: "absolute", left: -170, top: -760, width: 340, height: 760, transformOrigin: "50% 95%", transform: `rotate(${ang}deg)`, borderRadius: 18, background: "#f4efe6", boxShadow: "0 30px 60px rgba(0,0,0,.6)", padding: 26, opacity: cl(0.3 + o) }}>
          <div style={{ fontWeight: 900, fontSize: 60, color: "#1b1b1b", lineHeight: 1 }}>{c.txt}</div>
          <div style={{ fontWeight: 800, fontSize: 44, color: "#6a6258", marginBottom: 18 }}>{c.sub}</div>
          <div style={{ height: 400, borderRadius: 10, background: c.c === "rgba(240,244,250,.25)" ? "linear-gradient(#cfe0f2,#eef4fa)" : c.c, position: "relative", overflow: "hidden" }}>
            {Array.from({ length: 4 }, (_, k) => { const ph = (tt * 0.25 + k / 4) % 1; return <div key={k} style={{ position: "absolute", left: 40 + k * 50, top: 360 - ph * 380, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle, ${i === 2 ? "rgba(0,0,0,.8)" : i === 1 ? "rgba(70,72,78,.7)" : "rgba(255,255,255,.6)"}, transparent 70%)` }} />; })}
          </div>
        </div>; })}
      <div style={{ position: "absolute", left: -40, top: -80, width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(#e4e8ec,#6d7379)" }} />
    </div>
  </>;
}}</Stage>;

// ---- 24:01 · EL OSCILOSCOPIO: la pantalla de fósforo muestra el ronroneo parejo; cuando dice «pulse», la onda se vuelve golpes ----
export const HScope: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const pul = eio(tt, it(h, 0) - 0.3, it(h, 0) + 0.8), PH = "#ffb257";
  const pts = Array.from({ length: 220 }, (_, i) => { const x = i / 219, ph = x * 22 - tt * 6;
    const steady = Math.sin(ph) * 40 + Math.sin(ph * 2.7) * 8, env = Math.pow(Math.max(0, Math.sin(x * Math.PI * 3 - tt * 4)), 6);
    return `${120 + x * 1060},${330 + (steady * (1 - pul) + Math.sin(ph * 1.3) * 170 * env * pul)}`; }).join(" ");
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", width: 1400, height: 820, borderRadius: 40, background: "linear-gradient(160deg,#c9c3b2,#8d877a)", boxShadow: "0 60px 110px rgba(0,0,0,.7), inset 0 4px 0 rgba(255,255,255,.4)" }}>
      <div style={{ position: "absolute", left: 60, top: 60, width: 1300, height: 660, borderRadius: 60, background: "radial-gradient(ellipse at 50% 50%, #1a1408, #070503)", boxShadow: "inset 0 0 60px #000", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,178,87,.12) 2px, transparent 2px), linear-gradient(90deg, rgba(255,178,87,.12) 2px, transparent 2px)", backgroundSize: "106px 82px" }} />
        <svg width={1300} height={660} style={{ position: "absolute", left: 0, top: 0 }}><polyline points={pts} fill="none" stroke={PH} strokeWidth={6} style={{ filter: `drop-shadow(0 0 12px ${PH})` }} /></svg>
      </div>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 300 + i * 360, top: 740, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #4a4a4a, #111)", transform: `rotate(${tt * 20 + i * 70}deg)` }} />)}
    </div>
    <Tag tt={tt} at={0.8} x={960} y={110} txt="LOW, EVEN RUMBLE" col={AMB} size={54} />
    <Tag tt={tt} at={it(h, 0) + 0.6} x={960} y={1010} txt="WHOMP · WHOMP = TOO MUCH OIL" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 11:22 · EL MEDIDOR DE GAS DORMIDO: la lata de chili se calienta en la plancha mientras las ruedas del medidor de gas no se mueven ni un número ----
export const HMeter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const heat = eio(tt, 0.5, 4.5), stamp = phys(tt, it(h, 0), 6, 0.45), dials = [0, 0, 0, 0];
  return <>
    {/* el medidor: cuatro diales con la aguja quieta (sólo un temblor de vidrio) */}
    <div style={{ position: "absolute", left: 560, top: 520, transform: "translate(-50%,-50%)", width: 720, height: 520, borderRadius: 40, background: "linear-gradient(160deg,#9aa0a6,#4a4e53)", boxShadow: "0 60px 100px rgba(0,0,0,.7), inset 0 4px 0 rgba(255,255,255,.35)", padding: 40 }}>
      <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 6, color: "#1b1b1b", textAlign: "center" }}>GAS METER</div>
      <div style={{ display: "flex", gap: 22, justifyContent: "center", marginTop: 30 }}>
        {dials.map((v, i) => <div key={i} style={{ width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fbf7ee, #d9d1bf)", boxShadow: "inset 0 0 0 6px #2a2a2a", position: "relative" }}>
          {Array.from({ length: 10 }, (_, k) => <div key={k} style={{ position: "absolute", left: 68, top: 8, width: 4, height: 14, background: "#1b1b1b", transformOrigin: "50% 62px", transform: `rotate(${k * 36}deg)` }} />)}
          <div style={{ position: "absolute", left: 66, top: 18, width: 8, height: 54, background: RED, borderRadius: 4, transformOrigin: "50% 52px", transform: `rotate(${v * 36 + Math.sin(tt * 7 + i) * 0.6}deg)` }} />
        </div>)}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>{"0000".split("").map((d, i) => <div key={i} style={{ width: 70, height: 96, borderRadius: 8, background: "#0d0d0f", color: TX, fontWeight: 900, fontSize: 70, textAlign: "center", lineHeight: "96px" }}>{d}</div>)}</div>
    </div>
    {/* la lata de chili en la plancha, con el vapor que crece */}
    <div style={{ position: "absolute", left: 1400, top: 560, transform: "translate(-50%,-50%)" }}>
      <Photo id={h.img} w={620} h={560} />
      {Array.from({ length: 5 }, (_, i) => { const ph = (tt * 0.35 + i / 5) % 1; return <div key={i} style={{ position: "absolute", left: 220 + i * 40 + Math.sin(ph * 6 + i) * 24, top: 120 - ph * 260, width: 100 + ph * 60, height: 100 + ph * 60, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.45), rgba(255,255,255,0) 70%)", opacity: heat * (1 - ph) }} />; })}
    </div>
    <div style={{ position: "absolute", left: 560, top: 900, transform: `translate(-50%,-50%) rotate(-6deg) scale(${1.8 - 0.8 * cl(stamp)})`, opacity: cl(stamp * 2), border: `8px solid ${AMB}`, borderRadius: 12, padding: "8px 30px", fontFamily: MARK, fontSize: 70, color: AMB }}>NOT ONE CENT</div>
  </>;
}}</Stage>;

// ---- 13:50 · EL CIRCUITO DE VIDRIO: un lazo de vidrio con agua; el calor de un lado tiñe el agua de rojo, sube sola y vuelve fría por el otro lado, sin bomba ----
export const HLoop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fill = eio(tt, 0.3, 2.6), run = cl((tt - 2.4) / 2), sp = 0.12 * run;
  // el lazo: rectángulo redondeado; izquierda = la estufa (caliente), derecha = el balde (frío)
  const L = 560, R = 1360, T = 230, B = 850, per = 2 * (R - L) + 2 * (B - T);
  const at = (u: number) => { let d = ((u % 1) + 1) % 1 * per; // sube por la izquierda, cruza arriba, baja por la derecha, vuelve abajo
    if (d < B - T) return [L, B - d]; d -= B - T; if (d < R - L) return [L + d, T]; d -= R - L; if (d < B - T) return [R, T + d]; d -= B - T; return [R - d, B]; };
  const hot = (x: number, y: number) => cl(1 - (x - L) / (R - L) * 0.9 - (y - T) / (B - T) * 0.15);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect x={L} y={T} width={R - L} height={B - T} rx={60} fill="none" stroke="rgba(220,235,255,.35)" strokeWidth={70} />
      <rect x={L} y={T} width={R - L} height={B - T} rx={60} fill="none" stroke="rgba(120,170,230,.35)" strokeWidth={50} pathLength={1} strokeDasharray={`${fill} 1`} />
    </svg>
    {/* la llama bajo el lado izquierdo */}
    <div style={{ position: "absolute", left: L - 120, top: 560, width: 240, height: 300, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 50% 85%, #fff2c0, #ff8a2a 40%, rgba(255,80,20,0) 72%)", transform: `scaleY(${0.95 + 0.05 * Math.sin(tt * 2 * Math.PI * 1.2)})`, opacity: 0.9 }} />
    {Array.from({ length: 26 }, (_, i) => { const [x, y] = at(i / 26 + tt * sp), k = hot(x, y);
      return <div key={i} style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: "50%", background: `rgb(${90 + 165 * k},${150 - 80 * k},${255 - 200 * k})`, boxShadow: `0 0 18px rgba(${90 + 165 * k},${150 - 80 * k},${255 - 200 * k},.8)`, opacity: fill > 0.95 ? 1 : 0 }} />; })}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: run }}>
      <path d={`M ${L - 110} 700 L ${L - 110} 380`} stroke={RED} strokeWidth={10} markerEnd="url(#ah)" />
      <path d={`M ${R + 110} 380 L ${R + 110} 700`} stroke={ICE} strokeWidth={10} markerEnd="url(#ac)" />
      <defs><marker id="ah" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill={RED} /></marker><marker id="ac" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill={ICE} /></marker></defs>
    </svg>
    <Tag tt={tt} at={2.6} x={L - 110} y={300} txt="HOT RISES" col={RED} size={44} />
    <Tag tt={tt} at={it(h, 0)} x={R + 110} y={790} txt="COLD SINKS" col={ICE} size={44} />
    <Tag tt={tt} at={1.0} x={960} y={540} txt="NO PUMP" col={TX} size={90} />
  </>;
}}</Stage>;
