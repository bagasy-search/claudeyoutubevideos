// componentes únicos 1-11 (minutos 0-9)
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

// ---- 0:19 · RELOJ DE PALETAS: las horas pasan con la hornalla apagada (0:00 → 3:00), cada cifra cae como paleta ----
const Flap: React.FC<{ cur: string; nxt: string; f: number }> = ({ cur, nxt, f }) => {
  const W = 190, Hh = 260, half = (ch: string, top: boolean) => <div style={{ position: "absolute", left: 0, top: top ? 0 : Hh / 2, width: W, height: Hh / 2, overflow: "hidden", borderRadius: top ? "18px 18px 0 0" : "0 0 18px 18px", background: top ? "linear-gradient(180deg,#2a2a2e,#1d1d21)" : "linear-gradient(180deg,#18181b,#222226)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: top ? 0 : -Hh / 2, height: Hh, lineHeight: `${Hh}px`, textAlign: "center", fontWeight: 900, fontSize: 210, color: TX }}>{ch}</div>
  </div>;
  return <div style={{ position: "relative", width: W, height: Hh, perspective: 900, boxShadow: "0 30px 70px rgba(0,0,0,.6)", borderRadius: 18 }}>
    {half(nxt, true)}{half(cur, false)}
    {f < 0.5 ? <div style={{ position: "absolute", left: 0, top: 0, width: W, height: Hh / 2, transformOrigin: "50% 100%", transform: `rotateX(${-f * 180}deg)`, backfaceVisibility: "hidden" }}>{half(cur, true)}</div>
      : <div style={{ position: "absolute", left: 0, top: Hh / 2, width: W, height: Hh / 2, transformOrigin: "50% 0%", transform: `rotateX(${(1 - f) * 180}deg)` }}><div style={{ position: "relative", top: -Hh / 2 }}>{half(nxt, false)}</div></div>}
    <div style={{ position: "absolute", left: 0, right: 0, top: Hh / 2 - 1, height: 2, background: "rgba(0,0,0,.7)" }} />
  </div>;
};
export const HFlap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const m = 180 * eio(tt, 0.8, 4.4), H1 = Math.floor(m / 60), T = Math.floor((m % 60) / 10), O = Math.floor(m % 10), fr = m - Math.floor(m);
  const sp = (k: number) => cl(fr * 1.4);
  const nO = (O + 1) % 10, nT = O === 9 ? (T + 1) % 6 : T, nH = O === 9 && T === 5 ? H1 + 1 : H1;
  const live = m < 179.9;
  return <>
    <Head tt={tt} kick="DESDE QUE APAGUÉ LA HORNALLA" title="EL GUISO SIGUE HIRVIENDO" />
    <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 22 }}>
      <Flap cur={String(H1)} nxt={String(live ? nH : H1)} f={live && O === 9 && T === 5 ? sp(0) : 0} />
      <div style={{ fontWeight: 900, fontSize: 160, color: AMB, opacity: 0.6 + 0.4 * Math.sin(tt * 6) ** 2 }}>:</div>
      <Flap cur={String(T)} nxt={String(live ? nT : T)} f={live && O === 9 ? sp(0) : 0} />
      <Flap cur={String(O)} nxt={String(live ? nO : O)} f={live ? sp(0) : 0} />
      <div style={{ marginLeft: 26, fontWeight: 900, fontSize: 64, color: DIM, alignSelf: "flex-end", marginBottom: 20 }}>HORAS</div>
    </div>
    {/* vapor que sube del reloj: el guiso sigue vivo */}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {[0, 1, 2].map((i) => <path key={i} d={`M ${860 + i * 100} 400 c -30 -40 30 -80 0 -120 c -30 -40 30 -80 0 -120`} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="0.35 0.65" strokeDashoffset={-((tt * 0.35 + i * 0.3) % 1)} opacity={cl(tt - 1)} />)}
    </svg>
    <Tag tt={tt} at={1.2} x={960} y={790} txt="🔥 ✕  HORNALLA APAGADA" col={RED} size={40} />
    <Tag tt={tt} at={4.5} x={960} y={860} txt="SIN GAS · SIN LEÑA · SIN LUZ" col={DIM} size={30} />
  </>;
}}</Stage>;

// ---- 1:20 · LA CIFRA TAPADA: la hoja del cuaderno con la cuenta; el resultado está censurado hasta el final ----
export const HRedact: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = phys(tt, 0.2, 4.5, 0.45), st = phys(tt, 2.6, 7, 0.38);
  const rows = ["Porotos, hornalla 3 h", "Locro, hornalla 4 h", "Con la caja: 20 min", "Ahorro por invierno:"];
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, width: 980, height: 640, marginLeft: -490, marginTop: -320, transform: `translateY(${(1 - s) * 700}px) rotate(${-3 + (1 - s) * 12}deg)`,
      background: "repeating-linear-gradient(180deg, #f4ecd8 0px, #f4ecd8 62px, #c9d6e6 62px, #c9d6e6 64px), #f4ecd8", borderRadius: 8, boxShadow: "0 60px 120px rgba(0,0,0,.7)", padding: "80px 90px", fontFamily: HAND, color: "#2b2620" }}>
      <div style={{ position: "absolute", left: 70, top: 0, bottom: 0, width: 3, background: "#e08b8b" }} />
      {rows.map((r, i) => { const k = cl(phys(tt, 0.7 + i * 0.35, 6, 0.6)); return <div key={i} style={{ fontSize: 54, fontWeight: 700, height: 64, clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` }}>{r}</div>; })}
      {/* el resultado tapado con fibra negra que se va pintando */}
      <div style={{ position: "absolute", left: 520, top: 266, height: 58, width: 330 * cl(phys(tt, 1.9, 5, 0.7)), background: "#111", borderRadius: 6, transform: "rotate(-1deg)", boxShadow: "inset 0 0 0 3px #222" }} />
      <div style={{ position: "absolute", right: 70, bottom: 70, fontFamily: MARK, fontSize: 64, color: RED, border: `6px solid ${RED}`, borderRadius: 14, padding: "4px 26px", transform: `rotate(-9deg) scale(${Math.max(0, 2.4 - 1.4 * st)})`, opacity: cl(st * 3) }}>AL FINAL</div>
    </div>
    <Head tt={tt} kick="LA CUENTA DE LA GARRAFA" title="UNA CIFRA QUE ASUSTA" />
  </>;
}}</Stage>;

// ---- 2:21 · EL MAPA DE LA ABUELA: el camino de tierra se dibuja del pueblo a la casa (12 km), pin que cae, foto 1960 ----
export const HRoute: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #2a2418, #0d0b08 75%)">{(tt) => {
  const d = eio(tt, 0.8, 3.6), pin = phys(tt, 3.4, 7, 0.38), ph = phys(tt, 4.2, 4.5, 0.45);
  const path = "M 330 820 C 520 760 560 600 760 610 S 1040 760 1180 600 S 1360 330 1530 330";
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M ${-100 + i * 160} 1080 Q ${200 + i * 140} ${520 + (i % 3) * 60} ${400 + i * 170} 0`} stroke="rgba(255,220,160,.05)" strokeWidth={2} fill="none" />)}
      <path d={path} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={22} strokeLinecap="round" />
      <path d={path} fill="none" stroke={AMB} strokeWidth={9} strokeLinecap="round" strokeDasharray="0.012 0.008" pathLength={1} style={{ clipPath: "none" }} opacity={0.25} />
      <path d={path} fill="none" stroke={AMB} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${d} 1`} />
      <circle cx={330} cy={820} r={16 * cl(phys(tt, 0.5, 7, 0.5))} fill={TX} />
    </svg>
    <Tag tt={tt} at={0.6} x={330} y={880} txt="EL PUEBLO" col={DIM} size={30} />
    <div style={{ position: "absolute", left: 1530, top: 330, transform: `translate(-50%,-100%) translateY(${(1 - pin) * -260}px)`, opacity: cl(pin * 3) }}>
      <svg width={70} height={96} viewBox="0 0 70 96"><path d="M35 94 C 35 94 4 52 4 33 A 31 31 0 1 1 66 33 C 66 52 35 94 35 94 Z" fill={RED} /><circle cx={35} cy={33} r={12} fill="#fff" /></svg>
    </div>
    <Tag tt={tt} at={3.6} x={1530} y={395} txt="LA CASA DE ROSA" size={30} />
    <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 120, color: TX, opacity: cl(tt - 0.8), textShadow: "0 10px 40px rgba(0,0,0,.7)" }}>{Math.round(12 * d)} <span style={{ fontSize: 54, color: DIM }}>KM</span></div>
    <div style={{ position: "absolute", left: 240, top: 150, transform: `rotate(${-6 + (1 - ph) * -30}deg) translateY(${(1 - ph) * -500}px)`, opacity: cl(ph * 3), background: "#f1ead9", padding: "16px 16px 64px", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      <Photo id={h.img} w={380} h={280} r={2} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#3a3226" }}>año 1960</div>
    </div>
  </>;
}}</Stage>;

// ---- 3:36 · EL FOLLETO DE GUERRA: una hoja vieja cae hamacándose como papel y se asienta sobre la mesa ----
export const HLeaflet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = phys(tt, 0.2, 2.6, 0.5), sway = Math.sin(tt * 4) * Math.exp(-tt * 0.9);
  const st = phys(tt, 2.8, 7, 0.38);
  return <div style={{ position: "absolute", left: 960, top: 545, width: 640, height: 860, marginLeft: -320, marginTop: -430,
    transform: `translateY(${(1 - s) * -900}px) translateX(${sway * 160}px) rotateZ(${-4 + sway * 22}deg) rotateX(${(1 - cl(s)) * 50}deg)`,
    background: "radial-gradient(ellipse at 40% 30%, #e9dcbc, #cdb88c 80%)", boxShadow: "0 60px 120px rgba(0,0,0,.75)", padding: "50px 54px", color: "#2a2016", fontFamily: "Georgia, serif", textAlign: "center" }}>
    <div style={{ position: "absolute", inset: 18, border: "3px double #5b4630" }} />
    <div style={{ fontSize: 26, letterSpacing: 6 }}>AVISO A LA POBLACIÓN</div>
    <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1, margin: "18px 0 10px" }}>AHORRE<br />CARBÓN</div>
    <div style={{ fontSize: 30, fontStyle: "italic" }}>cocine con la caja de heno</div>
    <svg width={420} height={330} viewBox="0 0 420 330" style={{ margin: "26px auto 0", display: "block" }}>
      <g fill="none" stroke="#3b2c1c" strokeWidth={4}>
        <path d="M60 120 L210 60 L360 120 L360 280 L210 320 L60 280 Z" /><path d="M60 120 L210 180 L360 120 M210 180 L210 320" />
        <ellipse cx={210} cy={150} rx={70} ry={22} /><path d="M140 150 L140 195 Q210 225 280 195 L280 150" />
        {Array.from({ length: 16 }, (_, i) => <line key={i} x1={80 + (i % 8) * 34} y1={210 + Math.floor(i / 8) * 30} x2={96 + (i % 8) * 34} y2={196 + Math.floor(i / 8) * 30} />)}
      </g>
    </svg>
    <div style={{ fontSize: 24, letterSpacing: 3, marginTop: 6 }}>PAJA · DIARIOS · UN CAJÓN</div>
    <div style={{ position: "absolute", right: -30, top: 400, fontFamily: MARK, fontSize: 44, color: "#9b2a1f", border: "5px solid #9b2a1f", padding: "2px 18px", borderRadius: 10, transform: `rotate(14deg) scale(${Math.max(0, 2.2 - 1.2 * st)})`, opacity: cl(st * 3) * 0.85 }}>EUROPA · GUERRA</div>
  </div>;
}}</Stage>;

// ---- 3:52 · 9 DE 10: diez personas caen en fila; nueve se apagan, una se enciende ----
let PID = 0;
const Person: React.FC<{ c: string }> = ({ c }) => { const id = "pp" + (PID++ % 40); return <svg width={110} height={260} viewBox="0 0 110 260">
  <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={c} /><stop offset="55%" stopColor={c} /><stop offset="100%" stopColor="#000" stopOpacity={0.55} /></linearGradient></defs>
  <circle cx={55} cy={40} r={30} fill={`url(#${id})`} /><path d="M15 240 L15 130 Q15 82 55 82 Q95 82 95 130 L95 240 Z" fill={`url(#${id})`} />
  <ellipse cx={55} cy={250} rx={46} ry={8} fill="rgba(0,0,0,.45)" /></svg>; };
export const HPeople: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const off = eio(tt, 2.0, 2.9);
  return <>
    <Head tt={tt} kick="LA COCINA OCULTA" title="¿CUÁNTOS LA CONOCEN?" />
    <div style={{ position: "absolute", left: 960, top: 590, transform: "translate(-50%,-50%) scale(1.15)", display: "flex", gap: 26 }}>
      {Array.from({ length: 10 }, (_, i) => { const s = phys(tt, 0.4 + i * 0.09, 7, 0.4), lit = i === 6; const c = lit ? AMB : `rgba(${247 - 170 * off},${244 - 170 * off},${238 - 170 * off},1)`;
        return <div key={i} style={{ transform: `translateY(${(1 - s) * -500}px) scale(${lit ? 1 + 0.12 * phys(tt, 2.4, 7, 0.4) : 1})`, opacity: cl(s * 2), filter: lit && tt > 2.3 ? `drop-shadow(0 0 30px ${AMB})` : undefined }}><Person c={c} /></div>; })}
    </div>
    <Tag tt={tt} at={2.6} x={960} y={850} txt="9 DE CADA 10 NO LA CONOCEN" size={52} />
  </>;
}}</Stage>;

// ---- 4:03 · LA PERILLA: gira a ABIERTO con peso, la llama se prende y la garrafa se vacía mientras corren 3 horas ----
export const HKnob: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const r = phys(tt, 0.5, 5, 0.45), fl = cl((tt - 0.9) * 2), hrs = 3 * eio(tt, 1.4, 5.6), lvl = 1 - 0.55 * eio(tt, 1.4, 5.6);
  return <>
    <Head tt={tt} kick="CUANDO LLEGÓ LA GARRAFA" title="LA PERILLA ABIERTA" />
    <div style={{ position: "absolute", left: 640, top: 560, transform: "translate(-50%,-50%)" }}>
      <svg width={460} height={460} viewBox="-230 -230 460 460">
        <circle r={210} fill="#151518" stroke="rgba(255,255,255,.1)" strokeWidth={2} />
        {["APAG.", "MÁX", "MÍN"].map((l, i) => <text key={i} x={Math.cos((-90 + i * 110) * Math.PI / 180) * 175} y={Math.sin((-90 + i * 110) * Math.PI / 180) * 175 + 10} fill={i === 1 ? AMB : DIM} fontSize={30} fontWeight={800} textAnchor="middle" fontFamily="inherit">{l}</text>)}
        <g transform={`rotate(${r * 110})`}><circle r={130} fill="url(#kg)" /><rect x={-26} y={-125} width={52} height={250} rx={24} fill="#3a3a40" /><rect x={-6} y={-118} width={12} height={46} rx={6} fill={AMB} /></g>
        <defs><radialGradient id="kg" cx="40%" cy="35%"><stop offset="0%" stopColor="#55555c" /><stop offset="100%" stopColor="#202024" /></radialGradient></defs>
      </svg>
      {/* anillo de llamas azules */}
      <svg width={460} height={140} viewBox="0 0 460 140" style={{ position: "absolute", left: 0, top: 470 }}>
        {Array.from({ length: 11 }, (_, i) => { const hh = (40 + 18 * Math.sin(tt * 9 + i * 1.7)) * fl; return <path key={i} d={`M ${30 + i * 40} 120 q 12 ${-hh} 0 ${-hh * 1.6} q -12 ${hh * 0.6} 0 ${hh * 1.6} z`} fill="#4aa8ff" opacity={0.85} />; })}
      </svg>
    </div>
    {/* la garrafa que se vacía */}
    <div style={{ position: "absolute", left: 1330, top: 600, transform: "translate(-50%,-50%)" }}>
      <svg width={300} height={460} viewBox="0 0 300 460">
        <defs><clipPath id="gc"><path d="M40 120 Q40 70 150 70 Q260 70 260 120 L260 420 Q260 450 230 450 L70 450 Q40 450 40 420 Z" /></clipPath></defs>
        <rect x={120} y={20} width={60} height={50} rx={8} fill="#8a8a90" />
        <path d="M40 120 Q40 70 150 70 Q260 70 260 120 L260 420 Q260 450 230 450 L70 450 Q40 450 40 420 Z" fill="#2c2c30" stroke="rgba(255,255,255,.15)" strokeWidth={3} />
        <rect x={40} y={70 + 380 * (1 - lvl)} width={220} height={380} fill="#e8a33c" clipPath="url(#gc)" opacity={0.9} />
        <rect x={64} y={110} width={24} height={320} rx={12} fill="rgba(255,255,255,.18)" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontWeight: 900, fontSize: 64 }}>{hrs.toFixed(1).replace(".", ",")} <span style={{ fontSize: 34, color: DIM }}>HORAS</span></div>
    </div>
    <Tag tt={tt} at={5.0} x={960} y={970} txt="NADIE HACÍA LA CUENTA" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 4:40 · LA MESETA: la temperatura sube y se clava en 100; el fuego sigue y sólo repone lo que se va ----
export const HPlateau: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const d = eio(tt, 0.5, 3.6), X0 = 260, X1 = 1660, Y0 = 860, Y100 = 300;
  const pts: [number, number][] = Array.from({ length: 61 }, (_, i) => { const x = i / 60; const v = x < 0.35 ? 20 + 80 * Math.sin((x / 0.35) * Math.PI / 2) : 100; return [X0 + x * (X1 - X0), Y0 - (v / 100) * (Y0 - Y100)]; });
  const n = Math.max(2, Math.round(d * 60)), path = pts.slice(0, n + 1).map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");
  const [hx, hy] = pts[Math.min(60, n)];
  return <>
    <Head tt={tt} kick="POR QUÉ EL FUEGO NO COCINA MÁS" title="100 °C Y NO SUBE MÁS" />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <line x1={X0} y1={Y100} x2={X1} y2={Y100} stroke="rgba(255,255,255,.15)" strokeDasharray="10 12" strokeWidth={3} />
      <text x={X0 - 20} y={Y100 + 12} fill={DIM} fontSize={34} fontWeight={800} textAnchor="end" fontFamily="inherit">100°</text>
      <path d={path + ` L ${hx} ${Y0} L ${X0} ${Y0} Z`} fill={`url(#pg)`} opacity={0.35} />
      <path d={path} fill="none" stroke={AMB} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={hx} cy={hy} r={16} fill={AMB} style={{ filter: `drop-shadow(0 0 16px ${AMB})` }} />
      <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={AMB} /><stop offset="100%" stopColor={AMB} stopOpacity={0} /></linearGradient></defs>
      {/* el fuego de abajo sigue igual de fuerte todo el tiempo */}
      {Array.from({ length: 22 }, (_, i) => { const x = X0 + i * 66; if (x > hx) return null; const hh = 34 + 14 * Math.sin(tt * 8 + i * 2.1); return <path key={i} d={`M ${x} ${Y0 + 90} q 14 ${-hh} 0 ${-hh * 1.5} q -14 ${hh * 0.5} 0 ${hh * 1.5} z`} fill="#4aa8ff" opacity={0.7} />; })}
    </svg>
    <div style={{ position: "absolute", left: 1180, top: Y100 - 120, opacity: cl((d - 0.55) * 4), transform: `translateY(${(1 - cl((d - 0.55) * 4)) * 20}px)`, background: "rgba(14,15,18,.92)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 20, padding: "16px 26px", fontWeight: 900, fontSize: 36 }}>MÁS FUEGO = SÓLO REPONE</div>
  </>;
}}</Stage>;

// ---- 5:38 · AIRE QUIETO: corte de dos ollas; sin caja el calor (partículas) se escapa rápido, en la caja rebota y queda ----
export const HParticles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #17191d, #050506 75%)">{(tt) => {
  const pot = (cx: number, box: boolean) => {
    const parts = Array.from({ length: 46 }, (_, i) => {
      const ph = i * 2.39, sp = 0.6 + (i % 7) * 0.12;
      let x = Math.sin(tt * sp * 1.7 + ph) * 120, y = Math.cos(tt * sp * 1.3 + ph * 1.3) * 90;
      if (!box) { const esc = tt < 0.8 ? 0 : ((tt - 0.8) * 0.32 + i / 46) % 1; const ang = ph; x += Math.cos(ang) * esc * 520; y += Math.sin(ang) * esc * 380 - esc * 120; return { x, y, o: 1 - esc }; }
      return { x, y, o: 1 };
    });
    return <div style={{ position: "absolute", left: cx, top: 540, transform: "scale(1.3)" }}>
      {box && <div style={{ position: "absolute", left: -260, top: -220, width: 520, height: 440, borderRadius: 26, background: "repeating-linear-gradient(45deg, #3a3326 0 10px, #2f291f 10px 20px)", boxShadow: "inset 0 0 0 10px #5a4630, 0 40px 90px rgba(0,0,0,.6)", opacity: cl(phys(tt, 0.6, 5, 0.6)) }} />}
      <div style={{ position: "absolute", left: -160, top: -120, width: 320, height: 240, borderRadius: "16px 16px 40px 40px", background: "linear-gradient(180deg,#5c5c63,#2c2c31)", boxShadow: "inset 0 0 0 4px #77777e" }} />
      {parts.map((p, i) => <div key={i} style={{ position: "absolute", left: p.x - 7, top: p.y - 7, width: 14, height: 14, borderRadius: 7, background: i % 3 ? AMB : RED, opacity: p.o * cl(tt * 2), boxShadow: `0 0 14px ${AMB}` }} />)}
    </div>;
  };
  return <>
    {pot(560, false)}{pot(1360, true)}
    <Tag tt={tt} at={0.8} x={560} y={900} txt="SIN CAJA: SE VA" col={ICE} size={40} />
    <Tag tt={tt} at={1.1} x={1360} y={900} txt="EN LA CAJA: SE QUEDA" col={AMB} size={40} />
    <Tag tt={tt} at={2.4} x={960} y={150} txt="AIRE QUIETO = CALOR ATRAPADO" size={54} />
  </>;
}}</Stage>;

// ---- 7:16 · EL PODIO: las tres cajas suben en escalones (emergencia → conservadora → la del taller, con corona) ----
export const HPodium: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const T = [{ n: "1", l: "DE EMERGENCIA", hh: 170 }, { n: "2", l: "LA CONSERVADORA", hh: 260 }, { n: "3", l: "LA DEL TALLER", hh: 360 }];
  const sel = (h.sel as number[] | undefined) ?? [];
  return <>
    <Head tt={tt} kick="TRES VERSIONES" title="DE LA MÁS SIMPLE A LA MEJOR" />
    {T.map((p, i) => { const s = phys(tt, 0.6 + i * 0.4, 5.5, 0.42), c = phys(tt, 1.0 + i * 0.4, 6, 0.42), x = 560 + i * 400, lit = sel[i] !== undefined && tt >= sel[i];
      return <div key={i}>
        <div style={{ position: "absolute", left: x - 160, top: 1000 - p.hh * cl(s) - (s > 1 ? (s - 1) * 60 : 0), width: 320, height: p.hh + 200, borderRadius: "18px 18px 0 0", background: i === 2 ? "linear-gradient(180deg,#3a2c18,#1a140c)" : "linear-gradient(180deg,#2a2a2f,#151518)", boxShadow: `0 0 0 2px ${i === 2 ? AMB + "88" : "rgba(255,255,255,.1)"}` }}>
          <div style={{ textAlign: "center", fontWeight: 900, fontSize: 120, color: i === 2 ? AMB : "rgba(255,255,255,.18)", marginTop: 6 }}>{p.n}</div>
        </div>
        <div style={{ position: "absolute", left: x - 140, top: 1000 - p.hh - 330, transform: `translateY(${(1 - c) * -300}px) rotate(${(1 - c) * (i - 1) * 12}deg) scale(${lit ? 1.06 : 1})`, opacity: cl(c * 2) }}>
          <Photo id={h.imgs?.[i]} w={280} h={300} style={{ boxShadow: lit ? `0 0 0 4px ${AMB}, 0 40px 90px rgba(0,0,0,.6)` : undefined }} />
          <div style={{ marginTop: 12, textAlign: "center", fontWeight: 900, fontSize: 26, letterSpacing: 2 }}>{p.l}</div>
        </div>
        {i === 2 && <div style={{ position: "absolute", left: x - 45, top: 1000 - p.hh - 420, fontSize: 80, transform: `translateY(${(1 - phys(tt, 3.3, 7, 0.35)) * -200}px) rotate(${(1 - phys(tt, 3.3, 7, 0.35)) * 40}deg)`, opacity: cl(phys(tt, 3.3, 7, 0.35) * 3) }}>👑</div>}
      </div>; })}
  </>;
}}</Stage>;

// ---- 9:08 · EL TELGOPOR SE DERRITE: el termómetro sube a 100 y el bloque se hunde y gotea; entra la tabla que lo salva ----
export const HMelt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const v = 20 + 80 * eio(tt, 0.5, 2.8), m = cl((v - 80) / 20) * cl((tt - 1) * 2), fix = phys(tt, 4.2, 5.5, 0.45);
  const sag = m * 70;
  return <>
    <Head tt={tt} kick="REGLA DE ORO" title="EL TELGOPOR NO TOCA LA OLLA" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={`M 700 520 Q 960 ${520 + sag * 1.4} 1220 520 L 1220 ${820 - sag * 0.3} L 700 ${820 - sag * 0.3} Z`} fill="#f2f2ee" stroke="#d4d4cc" strokeWidth={3} />
      {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={720 + (i * 97) % 480} cy={560 + ((i * 53) % 240)} r={4} fill="#d8d8d0" />)}
      {[790, 930, 1090].map((x, i) => <path key={i} d={`M ${x} ${600 + sag} q 10 ${40 * m} 0 ${80 * m + i * 20 * m} q -10 ${-40 * m} 0 ${-80 * m}`} fill="#e8e8e2" opacity={m} />)}
      {/* fondo de la olla caliente apoyado */}
      <rect x={760} y={360 + sag * 0.9 - (fix > 0.05 ? 34 * cl(fix) : 0)} width={400} height={160} rx={18} fill="#3b3b40" stroke={`rgba(255,${120 - 60 * m},60,${0.5 + 0.5 * m})`} strokeWidth={6} />
      {/* la tabla que entra */}
      <rect x={680 + (1 - fix) * -900} y={490} width={560} height={30} rx={6} fill="#b8864e" opacity={cl(fix * 3)} />
    </svg>
    {/* termómetro */}
    <div style={{ position: "absolute", left: 1420, top: 330, width: 60, height: 460, borderRadius: 30, background: "#1a1a1d", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.15)" }}>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, height: `${(v / 100) * 420}px`, borderRadius: 16, background: `linear-gradient(0deg, ${RED}, ${AMB})` }} />
    </div>
    <div style={{ position: "absolute", left: 1510, top: 320, fontWeight: 900, fontSize: 90 }}>{Math.round(v)}°</div>
    <Tag tt={tt} at={2.6} x={960} y={900} txt="SE ABLANDA CERCA DE 100 °C" col={RED} size={44} />
    <Tag tt={tt} at={4.6} x={960} y={970} txt="SIEMPRE UNA TABLA O UNA TOALLA EN MEDIO" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- 9:44 · EL PLANO: hoja azul de plano, la olla vista de arriba y las cotas que se dibujan: 10 + 26 + 10 = 46 → 50 ----
export const HBlueprint: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="#0f2a4a">{(tt) => {
  const L = (a: number) => cl(eio(tt, a, a + 0.7)), sum = Math.round(10 * L(1.4) + 26 * L(0.6) + 10 * L(2.2)), r50 = phys(tt, 4.2, 6, 0.4);
  const W = "rgba(220,235,255,.9)";
  return <>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }} fill="none" stroke={W} strokeWidth={4}>
      <rect x={560} y={210} width={800} height={600} strokeDasharray="1" pathLength={1} strokeDashoffset={1 - L(0.2)} />
      <rect x={720} y={290} width={480} height={440} strokeDasharray="10 10" opacity={L(1.2)} />
      <circle cx={960} cy={510} r={160} strokeDasharray="1" pathLength={1} strokeDashoffset={1 - L(0.6)} />
      <line x1={800} y1={880} x2={800 + 360 * L(0.6)} y2={880} />
      <line x1={560} y1={880} x2={560 + 240 * L(1.4)} y2={880} stroke={AMB} />
      <line x1={1120} y1={880} x2={1120 + 240 * L(2.2)} y2={880} stroke={AMB} />
    </svg>
    <Tag tt={tt} at={0.8} x={960} y={510} txt="OLLA 26" size={48} />
    <Tag tt={tt} at={0.8} x={960} y={920} txt="26" size={36} />
    <Tag tt={tt} at={1.6} x={680} y={920} txt="+10" col={AMB} size={36} />
    <Tag tt={tt} at={2.4} x={1240} y={920} txt="+10" col={AMB} size={36} />
    <div style={{ position: "absolute", left: 1460, top: 420, fontFamily: MARK, fontSize: 110, color: TX, opacity: cl(tt - 0.6) }}>{sum}</div>
    <div style={{ position: "absolute", left: 1450, top: 560, fontFamily: MARK, fontSize: 96, color: AMB, transform: `scale(${Math.max(0, r50)}) rotate(${(1 - r50) * -20}deg)`, transformOrigin: "0 50%" }}>→ 50 cm</div>
    <Head tt={tt} kick="LA MEDIDA SALE DE LA OLLA" title="10 CM DE CADA LADO" />
  </>;
}}</Stage>;
