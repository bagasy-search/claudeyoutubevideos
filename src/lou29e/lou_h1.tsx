// lou29 · componentes únicos 1/3 (uno por minuto): cada uno es un OBJETO del diner que cuenta la idea de ese segundo.
// Todos viven en el Stage (foto del momento desenfocada + piso + haz de luz + polvo); entran de a uno con resorte.
import React from "react";
import { H, Mode, Stage, Tag, phys, cl, eio, TX, DIM, AMB, RED, MARK, HAND } from "./hkit";

export const pop = (tt: number, at: number, w = 7, z = 0.45) => phys(tt, at, w, z);
export const At: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; ry?: number; rx?: number; children: React.ReactNode }> = ({ x, y, s = 1, r = 0, o = 1, ry = 0, rx = 0, children }) =>
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${r}deg) scale(${s})`, opacity: cl(o) }}>{children}</div>;
// vapor que sube en hilos lentos
export const Steam: React.FC<{ tt: number; x: number; y: number; n?: number; w?: number; a?: number }> = ({ tt, x, y, n = 5, w = 160, a = 1 }) => <>{Array.from({ length: n }, (_, i) => {
  const ph = (tt * 0.45 + i / n) % 1;
  return <div key={i} style={{ position: "absolute", left: x - w / 2 + (i + 0.5) * (w / n) + 18 * Math.sin(tt * 1.1 + i * 2), top: y - ph * 260, width: 46, height: 90, borderRadius: "50%", background: "rgba(255,248,236,.5)", filter: "blur(16px)", opacity: a * Math.sin(ph * Math.PI) * 0.55, transform: `scale(${0.6 + ph})` }} />;
})}</>;
// metal cepillado / acero de cocina
export const STEEL = "linear-gradient(90deg,#3a3d42 0%,#9aa1aa 18%,#e4e8ec 32%,#8a9099 52%,#4a4e55 74%,#b9bfc6 90%,#545960 100%)";
const S: React.FC<{ t: number; h: H; f: (tt: number) => React.ReactNode }> = ({ t, h, f }) => <Stage t={t} h={h} mode={(h.mode as Mode) ?? "iris"}>{f}</Stage>;

// m0 · la servilleta del mostrador con la US 30 dibujada en birome: Chicago → Blue Moon (Van Wert) → Pittsburgh
export const HNapkin: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.1, 5, 0.6), d = eio(tt, 0.8, 3.6), pin = pop(tt, 2.4, 8, 0.38);
  return <At x={960} y={560} s={0.9 + 0.1 * s} rx={38 - 6 * s} r={-4 + 2 * Math.sin(tt * 0.3)}>
    <div style={{ width: 1180, height: 640, background: "radial-gradient(circle at 30% 30%,#fbf8f1,#e9e2d4)", borderRadius: 22, boxShadow: "0 60px 120px rgba(0,0,0,.7)", position: "relative",
      WebkitMaskImage: "radial-gradient(circle at 8px 8px, transparent 7px, #000 8px)", WebkitMaskSize: "28px 28px", WebkitMaskPosition: "-6px -6px" } as React.CSSProperties}>
      <div style={{ position: "absolute", inset: 24, border: "2px dashed rgba(120,110,95,.25)", borderRadius: 14 }} />
      <svg width={1180} height={640} style={{ position: "absolute", inset: 0 }}>
        <path d="M120 300 C 300 240, 420 360, 590 310 S 900 250, 1060 330" fill="none" stroke="#1d3f9e" strokeWidth={9} strokeLinecap="round" strokeDasharray={1100} strokeDashoffset={1100 * (1 - d)} />
        {[[120, 300], [1060, 330]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={14 * cl(d * 3 - i * 2)} fill="#1d3f9e" />)}
      </svg>
      <div style={{ position: "absolute", left: 70, top: 340, fontFamily: HAND, fontSize: 54, color: "#1d3f9e", opacity: cl(d * 4) }}>Chicago</div>
      <div style={{ position: "absolute", right: 60, top: 370, fontFamily: HAND, fontSize: 54, color: "#1d3f9e", opacity: cl(d * 3 - 2) }}>Pittsburgh</div>
      <div style={{ position: "absolute", left: 470, top: 120, fontFamily: MARK, fontSize: 64, color: "#1d3f9e", opacity: cl(d * 2), transform: "rotate(-5deg)" }}>US 30</div>
      <div style={{ position: "absolute", left: 590, top: 310, transform: `translate(-50%,-100%) translateY(${(1 - pin) * -160}px)`, opacity: cl(pin * 3) }}>
        <div style={{ width: 54, height: 54, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: RED, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
      </div>
      <div style={{ position: "absolute", left: 590, top: 420, transform: "translateX(-50%)", fontFamily: MARK, fontSize: 46, color: "#b3241b", opacity: cl(pin * 2), whiteSpace: "nowrap" }}>BLUE MOON</div>
    </div>
  </At>;
}} />;

// m1 · el cuentakilómetros del Kenworth: los tambores ruedan 40 millas fuera de ruta, cada semana
export const HOdometer: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.1, 5, 0.6), v = 40 * eio(tt, 0.7, 4.2), truck = eio(tt, 0.2, 6);
  const digits = [Math.floor(v / 10), v % 10];
  return <>
    <At x={300 + 1300 * truck} y={300} s={0.9} o={0.6}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
        <div style={{ width: 150, height: 120, background: "linear-gradient(#d8352a,#8e1c14)", borderRadius: "18px 30px 8px 8px", position: "relative" }}><div style={{ position: "absolute", right: 14, top: 16, width: 54, height: 40, background: "#9fd0ee", borderRadius: 6 }} /></div>
        <div style={{ width: 380, height: 130, background: "linear-gradient(#e9e5dc,#a8a397)", borderRadius: 8 }} />
      </div>
    </At>
    <At x={960} y={640} s={0.85 + 0.15 * s}>
      <div style={{ width: 760, height: 360, borderRadius: 190, background: "radial-gradient(ellipse at 50% 30%,#2a2522,#0c0a09)", border: "16px solid", borderColor: "#b8bec6 #6d727a #4a4e55 #9aa1aa", boxShadow: "0 50px 100px rgba(0,0,0,.8), inset 0 0 60px rgba(0,0,0,.9)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        {[0, 0, 0, ...digits].map((dg, i) => {
          const frac = i === 4 ? v % 1 : 0, sh = i < 3 ? 0 : (i === 4 ? frac : 0);
          return <div key={i} style={{ width: 92, height: 140, overflow: "hidden", background: i === 4 ? "#f0ebe0" : "#151311", borderRadius: 8, position: "relative", boxShadow: "inset 0 18px 20px rgba(0,0,0,.7), inset 0 -18px 20px rgba(0,0,0,.7)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: -sh * 140, fontWeight: 900, fontSize: 110, color: i === 4 ? "#111" : TX, textAlign: "center", lineHeight: "140px" }}>{Math.floor(dg) % 10}<br />{(Math.floor(dg) + 1) % 10}</div>
          </div>;
        })}
      </div>
    </At>
    <Tag tt={tt} at={1.2} x={960} y={880} txt="40 MILES · EVERY WEEK" col={AMB} size={46} />
  </>;
}} />;

// m1-2 · la olla de 20 cuartos que nunca se lavó: los años pasan sobre su costado y el chili no se apaga
export const HPot20: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.05, 4.5, 0.5), yr = Math.min(1978, 1970 + Math.floor(eio(tt, 1.0, 5.5) * 8.99));
  return <>
    <At x={960} y={600} s={0.75 + 0.25 * s}>
      <div style={{ position: "relative", width: 620, height: 520 }}>
        <div style={{ position: "absolute", left: 40, right: 40, bottom: -20, height: 60, borderRadius: "50%", background: "radial-gradient(#3b78ff 0%,#1a3fae 40%,transparent 70%)", filter: "blur(6px)", opacity: 0.8 + 0.2 * Math.sin(tt * 9) }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, bottom: 0, background: STEEL, borderRadius: "0 0 60px 60px", boxShadow: "inset 0 -40px 60px rgba(0,0,0,.55), 0 40px 80px rgba(0,0,0,.6)" }}>
          <div style={{ position: "absolute", left: 30, right: 30, top: 120, bottom: 40, background: "linear-gradient(180deg,rgba(70,40,20,.0),rgba(70,40,20,.35))", borderRadius: 30 }} />
          <div style={{ position: "absolute", left: "50%", top: 190, transform: "translateX(-50%) rotate(-4deg)", fontFamily: MARK, fontSize: 70, color: "#2a1d14", opacity: 0.85 }}>20 QT</div>
        </div>
        <div style={{ position: "absolute", left: -6, right: -6, top: 30, height: 64, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 60%,#7a2e12,#4a1a08 60%,#c9ced4 62%,#7b8088 80%)" }} />
        {[-50, 650].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: 110, width: 40, height: 70, border: "12px solid #6d727a", borderRadius: 18 }} />)}
        <Steam tt={tt} x={310} y={40} n={6} w={420} />
      </div>
    </At>
    <At x={1490} y={420} s={pop(tt, 1.0, 6, 0.5)}><div style={{ fontWeight: 900, fontSize: 120, color: AMB, textShadow: "0 10px 30px rgba(0,0,0,.7)" }}>{yr}</div></At>
    <Tag tt={tt} at={2.2} x={1490} y={530} txt="NEVER WASHED" col={TX} size={44} />
  </>;
}} />;

// m2 · el timer de cocina: la caja dice 10, vos lo parás en 8 (dos minutos menos)
export const HMacTimer: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.1, 5, 0.55), turn = eio(tt, 0.9, 2.2) * 10 - eio(tt, 2.8, 3.8) * 2, back = Math.max(0, turn - 8 * eio(tt, 4.4, 9));
  const ang = (back / 60) * 360 * 6;
  return <>
    <At x={760} y={560} s={0.8 + 0.2 * s} ry={-12}>
      <div style={{ width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff8a6e,#d2351f 55%,#7d150a)", boxShadow: "0 50px 100px rgba(0,0,0,.7), inset 0 -20px 40px rgba(0,0,0,.4)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 60, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fffdf8,#e6e0d4)", transform: `rotate(${-ang}deg)` }}>
          {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: 6, width: i % 5 ? 3 : 6, height: i % 5 ? 16 : 30, background: "#2a2522", transformOrigin: "50% 194px", transform: `translateX(-50%) rotate(${i * 6}deg)` }} />)}
          {[0, 5, 10, 15].map((m) => <div key={m} style={{ position: "absolute", left: "50%", top: "50%", transform: `rotate(${m * 36}deg) translateY(-140px) rotate(${-m * 36}deg) translate(-50%,-50%)`, fontWeight: 900, fontSize: 40, color: "#2a2522" }}>{m}</div>)}
        </div>
        <div style={{ position: "absolute", left: "50%", top: 40, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: "34px solid #1a1716", transform: "translateX(-50%)" }} />
      </div>
    </At>
    <At x={1420} y={430} s={pop(tt, 0.6)} r={6}><div style={{ width: 300, height: 190, background: "linear-gradient(#f2c230,#d99a12)", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#1b2a6b", fontWeight: 900 }}><div style={{ fontSize: 34 }}>ELBOWS</div><div style={{ fontSize: 70, textDecoration: tt > 2.8 ? "line-through" : "none", textDecorationColor: RED }}>10 MIN</div></div></At>
    <Tag tt={tt} at={3.0} x={1420} y={640} txt="YOU: 8" col={AMB} size={84} />
  </>;
}} />;

// m3 · el medallón de perfil: sin el hoyuelo del pulgar se infla como una pelota; con el hoyuelo queda chato
export const HThumbPatty: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.1, 5, 0.6), heat = eio(tt, 2.6, 6.2), press = eio(tt, 0.9, 1.6) * (1 - eio(tt, 1.9, 2.4));
  const Patty: React.FC<{ x: number; dent: boolean }> = ({ x, dent }) => {
    const dome = dent ? 6 : 70 * heat;
    return <At x={x} y={600} s={s}>
      <svg width={460} height={260} style={{ overflow: "visible" }}>
        <rect x={10} y={220} width={440} height={22} rx={6} fill="#2b2b2e" />
        <path d={`M30 220 Q 40 ${160 - dome * 0.4} 230 ${150 - dome} Q 420 ${160 - dome * 0.4} 430 220 Z`} fill="url(#beef)" />
        {dent && <ellipse cx={230} cy={150 + press * 18} rx={70} ry={10} fill="rgba(40,10,5,.55)" />}
        <defs><linearGradient id="beef" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={heat > 0.4 ? "#7a3a1c" : "#b9534a"} /><stop offset="1" stopColor={heat > 0.4 ? "#3e1a0b" : "#8a2f2a"} /></linearGradient></defs>
      </svg>
      {dent && <div style={{ position: "absolute", left: 175, top: -60 + press * 140, width: 110, height: 150, borderRadius: "50% 50% 46% 46%", background: "linear-gradient(#e8b79a,#c98d6d)", opacity: cl(press * 3) * (1 - heat), boxShadow: "0 20px 30px rgba(0,0,0,.4)" }} />}
    </At>;
  };
  return <>
    <Patty x={560} dent={false} /><Patty x={1360} dent={true} />
    <Tag tt={tt} at={3.4} x={560} y={800} txt="BALL" col={RED} size={60} />
    <Tag tt={tt} at={3.8} x={1360} y={800} txt="THUMB DENT" col={AMB} size={60} />
  </>;
}} />;

// m4 · la cebolla: 15 aros, uno por minuto, que van del blanco al ámbar profundo (fuego medio, sin apuro)
export const HOnionClock: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const p = eio(tt, 0.6, 7.5) * 15;
  const col = (i: number) => { const k = cl(p - i); const r = 245 - 120 * k, g = 236 - 150 * k, b = 220 - 190 * k; return `rgb(${r},${g},${b})`; };
  return <>
    <At x={860} y={560} s={pop(tt, 0.05, 4.5, 0.6)} rx={30}>
      <div style={{ position: "relative", width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle,#2a2a2d 60%,#141416)", boxShadow: "0 60px 120px rgba(0,0,0,.8)" }}>
        {Array.from({ length: 15 }, (_, i) => {
          const a = (i / 15) * Math.PI * 2 - Math.PI / 2, r = 230, on = pop(tt, 0.3 + i * 0.12, 8, 0.4);
          return <div key={i} style={{ position: "absolute", left: 320 + r * Math.cos(a) - 50, top: 320 + r * Math.sin(a) - 50, width: 100, height: 100, borderRadius: "50%", border: `16px solid ${col(i)}`, transform: `scale(${on})`, boxShadow: cl(p - i) > 0.6 ? "0 0 24px rgba(255,170,60,.5)" : undefined }} />;
        })}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 150, color: AMB }}>{Math.min(15, Math.floor(p))}</div>
      </div>
    </At>
    <Tag tt={tt} at={1.4} x={1480} y={480} txt="MINUTES" col={TX} size={58} />
    <Tag tt={tt} at={2.2} x={1480} y={570} txt="MEDIUM HEAT" col={AMB} size={50} />
  </>;
}} />;

// m5 · la semana del camionero: todos los camiones del mapa se corren al JUEVES (la salsa de Helen)
export const HThursday: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const D = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  return <>
    {D.map((d, i) => {
      const s = pop(tt, 0.1 + i * 0.09, 7, 0.45), th = i === 3, lift = th ? 40 * eio(tt, 2.6, 3.4) : 0;
      return <At key={d} x={300 + i * 220} y={520 - lift} s={s * (th ? 1 + 0.15 * eio(tt, 2.6, 3.4) : 1)}>
        <div style={{ width: 190, height: 250, borderRadius: 14, background: th ? "linear-gradient(#fff6e6,#f0dcbc)" : "linear-gradient(#e9e4da,#c9c2b5)", boxShadow: th && tt > 2.6 ? "0 0 60px rgba(255,180,90,.6), 0 30px 60px rgba(0,0,0,.6)" : "0 30px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
          <div style={{ height: 60, background: th ? RED : "#5c5a57", color: TX, fontWeight: 900, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>{d}</div>
        </div>
      </At>;
    })}
    {Array.from({ length: 9 }, (_, i) => {
      const from = 300 + ((i * 3) % 7) * 220, m = eio(tt, 1.2 + i * 0.18, 2.6 + i * 0.18), x = from + (960 - from) * m;
      return <At key={i} x={x + ((i % 3) - 1) * 46} y={540 + Math.floor(i / 3) * 52 - 40 * eio(tt, 2.6, 3.4)} s={0.9}><div style={{ width: 48, height: 30, borderRadius: 5, background: ["#d8352a", "#2a62c9", "#e6b422"][i % 3], boxShadow: "0 6px 10px rgba(0,0,0,.5)" }} /></At>;
    })}
    <Tag tt={tt} at={3.2} x={960} y={820} txt="HELEN'S SAUCE" col={AMB} size={60} />
  </>;
}} />;

// m6 · la albóndiga apretada rebota como una pelota de goma; la suelta se queda blanda en la mano
export const HRubberBall: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const b = Math.max(0, tt - 1.0), bounce = Math.abs(Math.sin(b * 3.2)) * 320 * Math.exp(-b * 0.35), sq = bounce < 20 ? 1 - (20 - bounce) / 60 : 1;
  const soft = 1 + 0.06 * Math.sin(tt * 1.5);
  const Ball: React.FC<{ tight: boolean }> = ({ tight }) => <div style={{ width: 200, height: 200, borderRadius: "50%", background: tight ? "radial-gradient(circle at 35% 30%,#a5543f,#5e2316)" : "radial-gradient(circle at 35% 30%,#b8705a,#7b3a28)", boxShadow: "inset -20px -30px 50px rgba(0,0,0,.5)", filter: tight ? "none" : "url(#rough)" }} />;
  return <>
    <svg width={0} height={0}><filter id="rough"><feTurbulence baseFrequency="0.09" numOctaves={2} seed={3} /><feDisplacementMap in="SourceGraphic" scale={14} /></filter></svg>
    <div style={{ position: "absolute", left: 300, right: 300, top: 760, height: 16, borderRadius: 8, background: "linear-gradient(90deg,#c9c2b5,#efe9dd,#c9c2b5)", opacity: pop(tt, 0.1) }} />
    <At x={620} y={660 - bounce} s={pop(tt, 0.3)}><div style={{ transform: `scale(${1 / sq}, ${sq})`, transformOrigin: "50% 100%" }}><Ball tight /></div></At>
    <At x={1300} y={668} s={pop(tt, 0.5)}><div style={{ transform: `scale(${1.08 * soft}, ${0.9 / soft})`, transformOrigin: "50% 100%" }}><Ball tight={false} /></div></At>
    <Tag tt={tt} at={1.4} x={620} y={860} txt="SQUEEZED" col={RED} size={56} />
    <Tag tt={tt} at={2.4} x={1300} y={860} txt="LIKE EGGS" col={AMB} size={56} />
  </>;
}} />;

// m7 · el termómetro de fritura metido en el aceite de la sartén de hierro: sube hasta 350
export const HFryTherm: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const temp = 70 + 280 * eio(tt, 0.8, 4.6), lvl = (temp - 50) / 350;
  return <>
    <At x={900} y={720} s={pop(tt, 0.05, 4.5, 0.55)} rx={52}>
      <div style={{ width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle,#5b3a08 0%,#c58a1d 30%,#7d5410 54%,#1b1a1a 56%,#2e2d2e 70%,#0d0d0e 72%)", boxShadow: "0 80px 140px rgba(0,0,0,.85)", position: "relative" }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 300 + (i * 97) % 300, top: 300 + (i * 61) % 300, width: 14 + (i % 3) * 6, height: 14 + (i % 3) * 6, borderRadius: "50%", border: "2px solid rgba(255,230,160,.6)", opacity: cl(lvl * 2 - 0.6) * (0.5 + 0.5 * Math.sin(tt * 6 + i)) }} />)}
      </div>
    </At>
    <At x={1250} y={470} r={18} s={pop(tt, 0.5)}>
      <div style={{ width: 70, height: 700, borderRadius: 35, background: "linear-gradient(90deg,#cfd6dc,#fff,#b6bec6)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", position: "relative" }}>
        <div style={{ position: "absolute", left: 24, width: 22, bottom: 40, height: 600 * lvl, borderRadius: 11, background: "linear-gradient(#ff6b3d,#c2160a)" }} />
        {[100, 200, 300, 350].map((v) => <div key={v} style={{ position: "absolute", right: -70, bottom: 40 + 600 * (v - 50) / 350 - 14, fontWeight: 800, fontSize: 26, color: v === 350 ? AMB : DIM }}>{v}</div>)}
      </div>
    </At>
    <At x={600} y={300} s={pop(tt, 4.4, 8, 0.4)}><div style={{ fontWeight: 900, fontSize: 170, color: AMB, textShadow: "0 12px 40px rgba(0,0,0,.7)" }}>{Math.round(temp)}°</div></At>
    <Tag tt={tt} at={5.0} x={600} y={420} txt="NO LOWER" col={TX} size={48} />
  </>;
}} />;

// m8 · la guerra: el frasco de chucrut de Pensilvania frente al gorro de Gus (un rayo entre los dos)
export const HKrautWar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const l = pop(tt, 0.2, 6, 0.4), r = pop(tt, 0.6, 6, 0.4), zap = cl(Math.sin(tt * 11) * 2) * cl(tt - 1.6) * (tt < 6 ? 1 : 0.4);
  return <>
    <At x={560 - (1 - l) * 500} y={560} s={l} r={-6 + 3 * Math.sin(tt * 1.3)}>
      <div style={{ width: 300, height: 420, position: "relative" }}>
        <div style={{ position: "absolute", left: 30, right: 30, top: 0, height: 60, borderRadius: 10, background: "linear-gradient(#e2c26a,#8f7024)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 50, bottom: 0, borderRadius: 40, background: "linear-gradient(90deg,rgba(255,255,255,.25),rgba(230,220,140,.35) 30%,rgba(190,180,90,.5))", border: "3px solid rgba(255,255,255,.4)", overflow: "hidden" }}>
          {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 41) % 260, top: 40 + (i * 67) % 300, width: 70, height: 5, borderRadius: 3, background: "#e8e0a4", transform: `rotate(${(i * 53) % 180}deg)` }} />)}
          <div style={{ position: "absolute", left: 30, right: 30, top: 140, height: 90, background: "#fff8e8", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 30, color: "#1b2a6b" }}>SAUERKRAUT</div>
        </div>
      </div>
    </At>
    <At x={1360 + (1 - r) * 500} y={580} s={r} r={5 - 3 * Math.sin(tt * 1.1)}>
      <div style={{ width: 320, height: 300, position: "relative" }}>
        <div style={{ position: "absolute", left: 20, right: 20, top: 0, height: 220, borderRadius: "40% 40% 10% 10%", background: "linear-gradient(#ffffff,#d9d4ca)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, height: 70, borderRadius: 14, background: "repeating-linear-gradient(180deg,#1f5fbf 0 14px,#fff 14px 28px)" }} />
      </div>
    </At>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: zap }}>
      <path d="M900 420 L 990 520 L 930 540 L 1030 660" fill="none" stroke="#fff3c4" strokeWidth={14} strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 18px #ffcf5a)" }} />
    </svg>
    <Tag tt={tt} at={2.0} x={960} y={860} txt="WINTER 1972" col={AMB} size={58} />
  </>;
}} />;

// m9 · el colador: el chucrut se enjuaga UNA vez y la sal se va con el agua (los cristales caen al bowl)
export const HRinseKraut: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const w = cl(tt - 0.9) * (tt < 7 ? 1 : 1 - cl(tt - 7));
  return <>
    {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 860 + i * 26, top: 120, width: 8, height: 340, background: "linear-gradient(rgba(170,215,255,.0),rgba(170,215,255,.55),rgba(170,215,255,.1))", opacity: w * (0.6 + 0.4 * Math.sin(tt * 8 + i)), filter: "blur(1px)" }} />)}
    <At x={960} y={520} s={pop(tt, 0.1, 5, 0.55)} rx={20}>
      <div style={{ width: 620, height: 260, borderRadius: "0 0 310px 310px", background: STEEL, position: "relative", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.7)" }}>
        {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + (i % 12) * 46, top: 40 + Math.floor(i / 12) * 42, width: 12, height: 12, borderRadius: "50%", background: "#1a1a1c" }} />)}
        {Array.from({ length: 26 }, (_, i) => <div key={"k" + i} style={{ position: "absolute", left: 60 + (i * 37) % 500, top: -4 + (i * 13) % 50, width: 90, height: 8, borderRadius: 4, background: "#ece4a6", transform: `rotate(${(i * 47) % 180}deg)` }} />)}
      </div>
    </At>
    {Array.from({ length: 22 }, (_, i) => {
      const ph = ((tt - 1.2) * 0.9 + i / 22) % 1;
      return tt > 1.2 ? <div key={i} style={{ position: "absolute", left: 760 + (i * 89) % 400, top: 660 + ph * 230, width: 12, height: 12, background: "#ffffff", transform: `rotate(45deg)`, opacity: 0.8 * Math.sin(ph * Math.PI) * w, boxShadow: "0 0 8px #fff" }} /> : null;
    })}
    <At x={960} y={930} s={pop(tt, 0.4)}><div style={{ width: 520, height: 110, borderRadius: "0 0 260px 260px", background: "linear-gradient(#e9e4da,#9e978a)" }} /></At>
    <Tag tt={tt} at={1.6} x={1450} y={740} txt="SALT OUT" col={TX} size={52} />
    <Tag tt={tt} at={2.6} x={470} y={480} txt="RINSE ONCE" col={AMB} size={60} />
  </>;
}} />;

// m10 · la moneda de 50 centavos cae girando y arma el plato: dos sándwiches, coleslaw y un pepinillo
export const HFiftyCents: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const c = pop(tt, 0.1, 6, 0.35), spin = (1 - cl(tt / 1.6)) * 900;
  const items: [number, number, React.ReactNode][] = [
    [-170, -20, <div style={{ width: 200, height: 120, borderRadius: "100px 100px 30px 30px", background: "linear-gradient(#e2a24c,#a8641e)", boxShadow: "0 -6px 0 #7a2d17 inset" }} />],
    [60, -60, <div style={{ width: 200, height: 120, borderRadius: "100px 100px 30px 30px", background: "linear-gradient(#e7a854,#ad6a22)", boxShadow: "0 -6px 0 #7a2d17 inset" }} />],
    [-40, 120, <div style={{ width: 150, height: 110, borderRadius: "50%", background: "radial-gradient(#f4f1e4,#d7d2b8)", boxShadow: "inset 0 -10px 20px rgba(120,160,60,.4)" }} />],
    [190, 110, <div style={{ width: 160, height: 56, borderRadius: 28, background: "linear-gradient(#7aa33a,#3f6418)" }} />],
  ];
  return <>
    <At x={1460} y={460 - (1 - c) * 400} s={c}><div style={{ width: 230, height: 230, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#f4f6f8,#a8afb6 60%,#6c7279)", transform: `rotateY(${spin}deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 92, color: "#4b5158", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>50¢</div></At>
    <At x={800} y={600} s={pop(tt, 0.6, 5, 0.6)} rx={40}><div style={{ width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,#fffdf8 55%,#e6dfd1 57%,#fffaf1 66%,#cfc6b6)", boxShadow: "0 60px 120px rgba(0,0,0,.7)", position: "relative" }}>
      {items.map(([x, y, el], i) => { const s = pop(tt, 1.4 + i * 0.6, 8, 0.4); return <div key={i} style={{ position: "absolute", left: 350 + x, top: 350 + y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -260}px) scale(${s})` }}>{el}</div>; })}
    </div></At>
    <Tag tt={tt} at={4.4} x={1460} y={680} txt="FULL PLATE" col={AMB} size={54} />
  </>;
}} />;

// m11 · el mazo: tres cortes gruesos de ternera se aplanan y se vuelven CINCO finos
export const HVeal3to5: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const hit = [1.2, 1.9, 2.6], flat = eio(tt, 1.2, 3.0), split = eio(tt, 3.2, 4.4);
  const mal = hit.reduce((m, a) => m + Math.max(0, 1 - Math.abs(tt - a) * 4), 0);
  const n = 5, cuts = Array.from({ length: n }, (_, i) => i);
  return <>
    <div style={{ position: "absolute", left: 260, right: 260, top: 640, height: 120, borderRadius: 18, background: "linear-gradient(#c8955d,#8a5a2c)", boxShadow: "0 50px 90px rgba(0,0,0,.7)", opacity: pop(tt, 0.05) }} />
    {cuts.map((i) => {
      const from = i < 3 ? 700 + i * 260 : 960, to = 420 + i * 270, show = i < 3 ? 1 : split, x = from + (to - from) * split;
      const hgt = 110 - 80 * flat, wd = 200 + 60 * flat;
      return <div key={i} style={{ position: "absolute", left: x - wd / 2, top: 640 - hgt, width: wd, height: hgt, borderRadius: "40% 40% 16px 16px", background: "linear-gradient(#e7b4a4,#c07f6c)", opacity: show * pop(tt, 0.2 + i * 0.1), boxShadow: "inset 0 -8px 14px rgba(0,0,0,.25)" }} />;
    })}
    <At x={960} y={300 + mal * 230} r={-20 + mal * 20} o={1 - split}><div style={{ position: "relative", width: 300, height: 420 }}><div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 130, borderRadius: 20, background: STEEL }} /><div style={{ position: "absolute", left: 135, top: 120, width: 30, height: 300, borderRadius: 12, background: "linear-gradient(90deg,#6a4423,#a87442,#6a4423)" }} /></div></At>
    <At x={960} y={330} s={pop(tt, 3.6, 7, 0.4)}><div style={{ fontWeight: 900, fontSize: 180, color: AMB, textShadow: "0 12px 40px rgba(0,0,0,.7)" }}>3 → 5</div></At>
  </>;
}} />;

// m12 · la estación de empanado: harina, huevo, pan rallado; la milanesa salta de plato en plato y se va vistiendo
export const HDredge: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P = [{ c: "radial-gradient(#ffffff,#e8e3d8)", n: "FLOUR" }, { c: "radial-gradient(#ffd34d,#e6a417)", n: "EGG" }, { c: "radial-gradient(#d7a55c,#9f6a2a)", n: "CRUMBS" }];
  const hop = eio(tt, 0.9, 5.4) * 3, k = Math.min(2, Math.floor(hop)), f = hop - Math.floor(hop);
  const x = 520 + Math.min(3, hop) * 300 + (hop >= 3 ? 0 : 0), y = 560 - Math.sin(f * Math.PI) * 220 * (hop < 3 ? 1 : 0);
  const coat = ["#e7b4a4", "#f2ece0", "#f2d36a", "#c48a44"][Math.min(3, Math.floor(hop + 0.5))];
  return <>
    {P.map((p, i) => <At key={i} x={520 + i * 450} y={640} s={pop(tt, 0.1 + i * 0.15)} rx={58}><div style={{ width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle,transparent 58%,#f6f2ea 60%,#d8d0c0 70%)`, position: "relative", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }}><div style={{ position: "absolute", inset: 60, borderRadius: "50%", background: p.c }} /></div></At>)}
    {P.map((p, i) => <Tag key={"t" + i} tt={tt} at={0.5 + i * 0.25} x={520 + i * 450} y={860} txt={p.n} col={i === k ? AMB : DIM} size={44} />)}
    <At x={520 + Math.min(2, hop) * 450} y={y} s={pop(tt, 0.6)} r={Math.sin(f * Math.PI) * 30}><div style={{ width: 240, height: 140, borderRadius: "48% 52% 44% 56%", background: coat, boxShadow: "0 20px 30px rgba(0,0,0,.45), inset 0 -10px 20px rgba(0,0,0,.2)" }} /></At>
  </>;
}} />;

export const HC1: Record<string, React.FC<{ t: number; h: H }>> = { napkinMap: HNapkin, odometer: HOdometer, pot20: HPot20, macTimer: HMacTimer, thumbPatty: HThumbPatty, onionClock: HOnionClock,
  thursday: HThursday, rubberBall: HRubberBall, fryTherm: HFryTherm, krautWar: HKrautWar, rinseKraut: HRinseKraut, fiftyCents: HFiftyCents, veal3to5: HVeal3to5, dredge: HDredge };
