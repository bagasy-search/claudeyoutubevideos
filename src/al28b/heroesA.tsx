// componentes únicos de al28b (el moho negro del techo que vuelve) · A: minutos 0-11. Cada uno = lo que se dice en ese segundo, dibujado en código.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Check, Cross } from "./heroes1";

// ---------- piezas comunes ----------
export const rnd = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
// paño de techo pintado (blanco frío con grano de revoque, luz rasante desde la ventanita)
export const Ceil: React.FC<{ x: number; y: number; w: number; h: number; col?: string; rot?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, col = "#eef0ee", rot = 0, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 10, overflow: "hidden", transform: `rotate(${rot}deg)`, background: `linear-gradient(120deg, rgba(255,250,235,.35), transparent 40%, rgba(0,20,40,.18)), ${col}`, boxShadow: "0 40px 90px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.2)", ...style }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(60,70,80,.13) 1.2px, transparent 1.6px), radial-gradient(rgba(255,255,255,.3) 1px, transparent 1.4px)", backgroundSize: "9px 9px, 13px 13px", backgroundPosition: "0 0, 4px 6px" }} />
    {children}
  </div>
);
// puntitos de moho: n puntos más apretados hacia (cx,cy); p = cuántos aparecieron (0-1); sz = tamaño
export const Mold: React.FC<{ n: number; cx: number; cy: number; rx: number; ry: number; p: number; sz?: number; seed?: number; col?: string }> = ({ n, cx, cy, rx, ry, p, sz = 9, seed = 1, col = "#141614" }) => <>
  {Array.from({ length: n }, (_, i) => {
    const a = rnd(i + seed) * 6.283, d = Math.pow(rnd(i * 3 + seed), 1.9), k = cl((p * n - i * 0.85) / 3);
    if (k <= 0) return null;
    const s = sz * (0.45 + rnd(i * 7 + seed) * 0.9) * (0.4 + 0.6 * k);
    return <div key={i} style={{ position: "absolute", left: cx + Math.cos(a) * d * rx - s / 2, top: cy + Math.sin(a) * d * ry - s / 2, width: s, height: s, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, #3a3d36, ${col})`, opacity: 0.55 + 0.4 * k, boxShadow: `0 0 ${s * 0.6}px rgba(20,24,20,${0.35 * k})` }} />;
  })}
</>;
// gota de agua con brillo
export const Drop: React.FC<{ x: number; y: number; s: number; o?: number }> = ({ x, y, s, o = 1 }) => s <= 0.5 ? null : (
  <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s * 1.15, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.95), rgba(170,215,240,.55) 35%, rgba(90,150,190,.35) 70%)", boxShadow: "0 2px 4px rgba(0,30,60,.35)", opacity: o }} />
);
// cuadrado de papel aluminio con arrugas y brillo que corre; tape = cinta en los 4 lados (0-4)
export const Foil: React.FC<{ x: number; y: number; s: number; tt: number; tape?: number; rot?: number; children?: React.ReactNode }> = ({ x, y, s, tt, tape = 0, rot = 0, children }) => (
  <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, transform: `rotate(${rot}deg)` }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: `linear-gradient(${115 + 20 * Math.sin(tt * 0.6)}deg, #8d9399, #e9edf0 ${30 + 10 * Math.sin(tt * 0.8)}%, #9aa1a8 52%, #f4f6f8 68%, #7f868d)`, boxShadow: "0 30px 70px rgba(0,0,0,.5)" }} />
    <svg width={s} height={s} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${rnd(i) * s} 0 L${rnd(i + 9) * s} ${s}`} stroke="#5d646b" strokeWidth={1.4} />)}</svg>
    {[0, 1, 2, 3].map((i) => { const k = cl(tape - i); if (k <= 0) return null; const hz = i % 2 === 0;
      return <div key={i} style={{ position: "absolute", left: hz ? -s * 0.06 : i === 1 ? s - s * 0.06 : -s * 0.06, top: hz ? (i === 0 ? -s * 0.06 : s - s * 0.06) : -s * 0.06, width: hz ? (s * 1.12) * k : s * 0.12, height: hz ? s * 0.12 : (s * 1.12) * k, background: "rgba(214,178,110,.72)", borderRadius: 3, boxShadow: "0 2px 6px rgba(0,0,0,.25)" }} />; })}
    {children}
  </div>
);

// ---- 0:04 · DE MARZO A OCTUBRE: el calendario pasa hoja por hoja y el techo blanco se va llenando de puntitos en la misma esquina ----
export const HMonths: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const M = ["MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT"], m = Math.min(7, Math.floor(cl((tt - 0.8) / 5) * 8)), p = cl((tt - 0.8) / 5.2);
  return <>
    <Head tt={tt} kick="DOS MANOS DE PINTURA EN MARZO" title="Y EN OCTUBRE VOLVIÓ" col={RED} />
    <Ceil x={260} y={230} w={900} h={680}>
      <div style={{ position: "absolute", right: 0, top: 0, width: 210, height: "100%", background: "linear-gradient(90deg, rgba(0,0,0,.0), rgba(0,0,0,.14))" }} />
      <Mold n={160} cx={830} cy={90} rx={420} ry={330} p={p} sz={11} />
    </Ceil>
    {/* calendario de pared: las hojas se arrancan con peso */}
    <div style={{ position: "absolute", left: 1290, top: 300, width: 420, height: 470 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "#f6f1e6", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, borderRadius: "18px 18px 0 0", background: m === 7 ? RED : "#3d6fa8" }} />
      {M.map((x, i) => { const f = cl((tt - 0.8 - (i + 1) * 0.66) / 0.45); if (i > m || f >= 1) return null;
        return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 110, height: 360, transformOrigin: "50% 0", transform: `rotateX(${f * 95}deg) translateY(${f * 60}px)`, opacity: 1 - f, background: "#fbf8f1", borderRadius: "0 0 18px 18px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 150, color: i === 7 ? RED : "#2d2a26", zIndex: 10 - i }}>{x}</div>; })}
    </div>
    <Tag tt={tt} at={6.3} x={1500} y={860} txt="7 MESES" col={RED} size={64} />
  </>;
}}</Stage>;

// ---- 1:30 · EL CUADRADO QUE DECIDE: un cuadrado de aluminio gira y muestra sus dos caras: ¿gotitas de este lado o del otro? ----
export const HFoilTeaser: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = phys(tt, 0.5, 5, 0.5), spin = eio(tt, 1.6, 4.4) * 540, face = Math.cos(spin * Math.PI / 180);
  return <>
    <Head tt={tt} kick="LA JOYA DEL VIDEO" title="UN CUADRADO DE ALUMINIO" />
    <div style={{ position: "absolute", left: 960, top: 560, width: 0, height: 0, perspective: 1600 }}>
      <div style={{ transform: `rotateY(${spin}deg) scale(${cl(s)})`, transformStyle: "preserve-3d" }}>
        <Foil x={0} y={0} s={430} tt={tt} tape={4}>
          {face > 0 ? Array.from({ length: 26 }, (_, i) => <Drop key={i} x={40 + rnd(i) * 350} y={40 + rnd(i + 40) * 350} s={(10 + rnd(i + 3) * 16) * cl((tt - 4.6) * 2)} />) : null}
        </Foil>
      </div>
    </div>
    <Tag tt={tt} at={2.4} x={420} y={560} txt="¿DE QUÉ LADO" col={TX} size={58} />
    <Tag tt={tt} at={2.8} x={420} y={640} txt="SE MOJA?" col={AMB} size={58} />
    <Tag tt={tt} at={5.0} x={1500} y={880} txt="CUESTA UN ROLLO DE COCINA" col={DIM} size={34} />
  </>;
}}</Stage>;

// ---- 2:48 · ES UN SER VIVO: la lupa baja sobre un puntito negro y adentro hay una plantita: hilos que crecen hacia el agua ----
export const HAlive: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const lens = phys(tt, 0.6, 5, 0.55), grow = eio(tt, 1.8, 6.2);
  const hy = Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * 6.283 + rnd(i) * 0.4, L = 120 + rnd(i + 5) * 170, b = a + (rnd(i + 9) - 0.5) * 0.9;
    return `M0 0 Q${Math.cos(a) * L * 0.55} ${Math.sin(a) * L * 0.55} ${Math.cos(b) * L} ${Math.sin(b) * L}`; });
  return <>
    <Head tt={tt} kick="NO ES MUGRE" title="ES UNA PLANTITA QUE VIVE DEL AGUA" />
    <Ceil x={170} y={250} w={760} h={640}><Mold n={90} cx={380} cy={320} rx={330} ry={280} p={1} sz={10} seed={4} /></Ceil>
    {/* la lupa */}
    <div style={{ position: "absolute", left: 1300, top: 560, transform: `translate(-50%,-50%) scale(${cl(lens)})` }}>
      <div style={{ position: "absolute", left: -330, top: -330, width: 660, height: 660, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 50% 50%, #e9ece6, #c9cec5)", boxShadow: "0 0 0 26px #2b2b2f, 0 0 0 30px #55565c, 0 50px 120px rgba(0,0,0,.7)" }}>
        <svg width={660} height={660} style={{ position: "absolute", inset: 0 }}><g transform="translate(330,330)">
          {hy.map((d, i) => <path key={i} d={d} stroke="#1f241e" strokeWidth={3 + rnd(i) * 3} fill="none" strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - grow)} opacity={0.85} />)}
          {Array.from({ length: 30 }, (_, i) => { const a = rnd(i + 2) * 6.283, d = 30 + rnd(i + 7) * 230 * grow; return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={(4 + rnd(i) * 7) * grow} fill="#141814" />; })}
          <circle r={58} fill="#121512" /><circle r={58} fill="url(#gl)" />
          {/* agua quieta: gotitas que la alimentan */}
          {Array.from({ length: 7 }, (_, i) => { const a = i * 0.9 + 0.4, d = 250 - 160 * cl(tt - 2.5 - i * 0.35); return <circle key={`w${i}`} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={10} fill="rgba(110,180,230,.75)" opacity={d > 95 ? 1 : 0} />; })}
        </g></svg>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,.35), transparent 40%)" }} />
      </div>
      <div style={{ position: "absolute", left: 210, top: 210, width: 70, height: 300, borderRadius: 30, background: "linear-gradient(90deg,#1c1c20,#3a3a40,#1c1c20)", transform: "rotate(-45deg)", transformOrigin: "35px 0" }} />
    </div>
    <Tag tt={tt} at={3.2} x={1300} y={960} txt="SIN AGUA, SE MUERE" col={ICE} size={44} />
  </>;
}}</Stage>;

// ---- 3:08 · LA FIEBRE: le secás el sudor (el moho se borra) pero el termómetro sigue en rojo: el agua es la enfermedad ----
export const HFever: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const wipe = eio(tt, 1.4, 3.0), back = cl((tt - 4.6) / 1.4), merc = 0.82 + 0.03 * Math.sin(tt * 2);
  return <>
    <Head tt={tt} kick="EL MOHO ES EL SÍNTOMA" title="EL AGUA ES LA ENFERMEDAD" col={RED} />
    <Ceil x={220} y={260} w={760} h={600}>
      <Mold n={110} cx={380} cy={300} rx={300} ry={250} p={1 - wipe + back * 0.9} sz={12} seed={9} />
      {/* el trapo que pasa */}
      <div style={{ position: "absolute", left: -260 + wipe * 1100, top: 160 + 60 * Math.sin(wipe * 6), width: 230, height: 170, borderRadius: 30, background: "linear-gradient(135deg,#f4d36a,#d9a93a)", opacity: wipe > 0 && wipe < 1 ? 1 : 0, boxShadow: "0 20px 40px rgba(0,0,0,.4)" }} />
    </Ceil>
    {/* termómetro */}
    <div style={{ position: "absolute", left: 1310, top: 230, width: 120, height: 640 }}>
      <div style={{ position: "absolute", left: 30, top: 0, width: 60, height: 540, borderRadius: 30, background: "rgba(255,255,255,.12)", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.35)" }} />
      <div style={{ position: "absolute", left: 44, bottom: 90, width: 32, height: 470 * merc, borderRadius: 16, background: `linear-gradient(0deg, ${RED}, #ff8a6a)`, boxShadow: `0 0 30px ${RED}` }} />
      <div style={{ position: "absolute", left: 10, bottom: 0, width: 100, height: 100, borderRadius: 50, background: `radial-gradient(circle at 35% 35%, #ff9a85, ${RED})`, boxShadow: `0 0 40px ${RED}` }} />
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 96, top: 60 + i * 95, width: 30, height: 4, background: DIM }} />)}
    </div>
    <Tag tt={tt} at={1.6} x={600} y={930} txt="SECAS EL SUDOR…" col={TX} size={44} />
    <Tag tt={tt} at={3.4} x={1370} y={950} txt="LA FIEBRE SIGUE" col={RED} size={44} />
    <Tag tt={tt} at={5.0} x={600} y={1000} txt="…Y VUELVE" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 3:25 · DOS FIRMAS: dos fichas de huellas; una de puntitos parejos, otra de anillos con borde: el techo «firma» de dónde viene el agua ----
export const HSignature: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const a = phys(tt, 0.6, 5.5, 0.5), b = phys(tt, 1.4, 5.5, 0.5), stampA = cl((tt - 2.4) / 0.5), stampB = cl((tt - 3.4) / 0.5);
  const card = (x: number, s: number, r: number, children: React.ReactNode, lab: string, col: string, st: number) => <div style={{ position: "absolute", left: x, top: 270, width: 600, height: 640, borderRadius: 20, background: "#f5efe2", boxShadow: "0 40px 90px rgba(0,0,0,.6)", transform: `translateY(${(1 - cl(s)) * 500}px) rotate(${r * cl(s)}deg)`, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 40, top: 30, fontFamily: HAND, fontWeight: 700, fontSize: 40, color: "#5a5045" }}>Ficha · firma del agua</div>
    <div style={{ position: "absolute", left: 50, top: 110, width: 500, height: 380, borderRadius: 12, background: "#eceeea", boxShadow: "inset 0 0 0 2px rgba(0,0,0,.08)", overflow: "hidden" }}>{children}</div>
    <div style={{ position: "absolute", left: 300, top: 560, transform: `translate(-50%,-50%) rotate(-6deg) scale(${2 - st})`, opacity: st, padding: "8px 26px", border: `5px solid ${col}`, borderRadius: 10, color: col, fontWeight: 900, fontSize: 46, letterSpacing: 3 }}>{lab}</div>
  </div>;
  return <>
    <Head tt={tt} kick="CADA MANCHA DEJA UNA FIRMA" title="APRENDE A LEERLA" />
    {card(250, a, -3, <Mold n={120} cx={250} cy={190} rx={240} ry={190} p={cl((tt - 1.0) / 1.4)} sz={10} seed={2} />, "CONDENSACIÓN", ICE, stampA)}
    {card(1070, b, 3, <svg width={500} height={380}>{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={250} cy={190} rx={(60 + i * 45) * cl((tt - 1.6 - i * 0.25) * 2)} ry={(45 + i * 34) * cl((tt - 1.6 - i * 0.25) * 2)} fill={i === 0 ? "rgba(190,150,90,.25)" : "none"} stroke="#8a6232" strokeWidth={7 - i} opacity={0.85 - i * 0.12} />)}</svg>, "FILTRACIÓN", RED, stampB)}
  </>;
}}</Stage>;

// ---- 4:12 · EL VASO DE LA HELADERA: el vapor del aire toca el vidrio frío y se vuelve gotitas; el vaso no pierde agua ----
export const HGlass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 45%, #2b3a44, #0a0e12 80%)">{(tt) => {
  const dew = cl((tt - 1.6) / 3.2);
  return <>
    <Head tt={tt} kick="LO QUE PASA EN VERANO" title="EL VASO NO PIERDE AGUA" col={ICE} />
    {/* vapor del aire viajando hacia el vaso */}
    {Array.from({ length: 34 }, (_, i) => { const ph = ((tt * 0.35 + rnd(i)) % 1), side = i % 2 ? 1 : -1, x = 960 + side * (520 - ph * 330), y = 380 + rnd(i + 4) * 520;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 16, height: 16, borderRadius: 8, background: "rgba(200,225,240,.55)", filter: "blur(2px)", opacity: Math.sin(ph * 3.14) }} />; })}
    <div style={{ position: "absolute", left: 960 - 190, top: 300, width: 380, height: 560, borderRadius: "16px 16px 40px 40px", background: "linear-gradient(90deg, rgba(255,255,255,.22), rgba(255,255,255,.06) 30%, rgba(255,255,255,.04) 70%, rgba(255,255,255,.2))", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.35), 0 50px 100px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: 420, borderRadius: "0 0 34px 34px", background: "linear-gradient(180deg, rgba(150,200,235,.35), rgba(90,150,200,.45))" }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 70 + i * 90, top: 200 + i * 60 + 8 * Math.sin(tt + i), width: 90, height: 80, borderRadius: 14, background: "rgba(235,248,255,.55)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,.7)", transform: `rotate(${15 * i - 10}deg)` }} />)}
      {Array.from({ length: 70 }, (_, i) => { const k = cl(dew * 1.6 - rnd(i) * 0.8), slide = i % 9 === 0 ? cl(tt - 4.4 - rnd(i)) * 220 : 0;
        return <Drop key={i} x={20 + rnd(i + 11) * 340} y={30 + rnd(i + 23) * 500 + slide} s={(6 + rnd(i + 2) * 16) * k} o={0.9} />; })}
    </div>
    <Tag tt={tt} at={2.0} x={430} y={540} txt="AIRE TIBIO" col={AMB} size={46} />
    <Tag tt={tt} at={2.4} x={1490} y={540} txt="VIDRIO FRÍO" col={ICE} size={46} />
    <Tag tt={tt} at={4.0} x={960} y={950} txt="EL VAPOR SE VUELVE GOTITA" col={TX} size={46} />
  </>;
}}</Stage>;

// ---- 4:32 · LA DUCHA EN CORTE: termómetro de colores; el vapor tibio sube, la losa está azul de fría y en la esquina aparecen las gotas ----
export const HShowerCut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const fill = cl((tt - 0.8) / 3.0), drops = cl((tt - 3.2) / 2.4);
  return <>
    <Head tt={tt} kick="10 MINUTOS DE DUCHA CALIENTE" title="EL VAPOR BUSCA LO MÁS FRÍO" />
    <div style={{ position: "absolute", left: 340, top: 230, width: 1240, height: 700 }}>
      {/* losa fría arriba y pared de afuera a la izquierda */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1240, height: 70, background: "linear-gradient(90deg, #3d7ed6, #7fb2ea 40%, #a9c9ea)", boxShadow: "0 0 50px rgba(80,150,230,.45)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 70, height: 700, background: "linear-gradient(180deg, #3d7ed6, #8dbbe9)" }} />
      <div style={{ position: "absolute", left: 70, top: 70, right: 0, bottom: 0, background: `linear-gradient(0deg, rgba(255,140,70,${0.35 * fill}), rgba(255,180,110,${0.12 * fill}) 70%, transparent)` }} />
      {/* ducha */}
      <div style={{ position: "absolute", left: 230, top: 150, width: 16, height: 120, background: "#9aa2ab" }} /><div style={{ position: "absolute", left: 185, top: 260, width: 110, height: 26, borderRadius: 13, background: "#c8ced4" }} />
      {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 195 + i * 6, top: 290 + ((tt * 600 + i * 47) % 380), width: 3, height: 26, background: "rgba(170,210,240,.7)" }} />)}
      {/* vapor que sube y se va a la esquina */}
      {Array.from({ length: 26 }, (_, i) => { const ph = (tt * 0.28 + rnd(i)) % 1, x = 240 + (rnd(i + 3) - 0.5) * 300 - ph * ph * 150 * (i % 3), y = 620 - ph * 560;
        return <div key={`v${i}`} style={{ position: "absolute", left: x, top: y, width: 90, height: 70, borderRadius: "50%", background: "rgba(255,240,225,.32)", filter: "blur(16px)", opacity: fill * Math.sin(ph * 3.14) }} />; })}
      {/* gotas en la esquina fría */}
      {Array.from({ length: 30 }, (_, i) => <Drop key={`d${i}`} x={80 + Math.pow(rnd(i), 1.6) * 420} y={82 + rnd(i + 6) * 30} s={(8 + rnd(i + 1) * 12) * cl(drops * 2 - rnd(i))} />)}
      {Array.from({ length: 14 }, (_, i) => <Drop key={`e${i}`} x={82 + rnd(i + 30) * 26} y={90 + Math.pow(rnd(i + 8), 1.5) * 300} s={(8 + rnd(i) * 10) * cl(drops * 2 - rnd(i + 3))} />)}
    </div>
    <Tag tt={tt} at={1.4} x={1300} y={420} txt="TIBIO Y PESADO" col={AMB} size={42} />
    <Tag tt={tt} at={2.6} x={1260} y={210} txt="LOSA FRÍA" col={ICE} size={42} />
    <Tag tt={tt} at={4.2} x={560} y={980} txt="LA ESQUINA: LO MÁS FRÍO DEL BAÑO" col={ICE} size={40} />
  </>;
}}</Stage>;

// ---- 5:40 · LOS ANILLOS DEL TRONCO: cada nube que pasa suma un anillo marrón a la aureola de la cocina ----
export const HRings: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const n = Math.min(4, Math.floor(cl((tt - 0.8) / 5) * 5) + 1);
  return <>
    <Head tt={tt} kick="LA MANCHA DE LA COCINA" title="CADA ANILLO = UNA LLUVIA" col={RED} />
    <Ceil x={240} y={240} w={900} h={690} col="#f0ece2">
      <svg width={900} height={690} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 5 }, (_, i) => { const k = cl((tt - 0.8 - i * 1.1) / 0.9); return k > 0 && <ellipse key={i} cx={450} cy={345} rx={(80 + i * 62) * eio(k, 0, 1)} ry={(62 + i * 48) * eio(k, 0, 1)} fill={i === 0 ? "rgba(200,160,100,.28)" : "rgba(220,190,130,.08)"} stroke="#8d6433" strokeWidth={8 - i} opacity={0.9 - i * 0.08} />; })}
      </svg>
    </Ceil>
    {/* las lluvias, una por anillo */}
    {Array.from({ length: 5 }, (_, i) => { const k = cl((tt - 0.5 - i * 1.1) / 1.0), on = k > 0 && k < 1;
      return <div key={i} style={{ position: "absolute", left: 1280, top: 300 + i * 120, opacity: k > 0 ? (i + 1 <= n ? 1 : 0.4) : 0, display: "flex", alignItems: "center", gap: 18, transform: `translateX(${(1 - cl(k * 3)) * 60}px)` }}>
        <div style={{ width: 90, height: 54, borderRadius: 30, background: on ? "#9fb3c6" : "#5f6f80", boxShadow: on ? "0 0 30px rgba(160,190,220,.6)" : "none" }} />
        <div style={{ fontWeight: 900, fontSize: 40, color: TX }}>LLUVIA {i + 1}</div>
      </div>; })}
  </>;
}}</Stage>;

// ---- 7:12 · CUATRO LADOS: el cuadrado de 30×30 se pega con cinta lado por lado; si queda uno abierto, el vapor se mete por atrás ----
export const HFoilTape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const tape = cl((tt - 1.0) / 2.6) * 4, s = phys(tt, 0.4, 5, 0.55);
  return <>
    <Head tt={tt} kick="EL DETALLE QUE CASI NADIE HACE BIEN" title="CINTA EN LOS CUATRO LADOS" />
    <Ceil x={160} y={220} w={1000} h={720}>
      <Mold n={140} cx={500} cy={360} rx={360} ry={280} p={1} sz={10} seed={7} />
      <div style={{ transform: `scale(${cl(s)})`, transformOrigin: "500px 360px", position: "absolute", inset: 0 }}><Foil x={500} y={360} s={460} tt={tt} tape={tape} /></div>
      <div style={{ position: "absolute", left: 270, top: 130, width: 460, height: 0, borderTop: "3px dashed rgba(255,255,255,.0)" }} />
    </Ceil>
    <div style={{ position: "absolute", left: 1240, top: 300, width: 520 }}>
      {["ARRIBA", "DERECHA", "ABAJO", "IZQUIERDA"].map((l, i) => { const k = cl(tape - i); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 34, opacity: 0.35 + 0.65 * k }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, background: k >= 1 ? GRN : "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 36, color: "#0b0b0b" }}>{i + 1}</div>
        <div style={{ fontWeight: 900, fontSize: 44 }}>{l}</div></div>; })}
    </div>
    <Tag tt={tt} at={1.2} x={660} y={1000} txt="30 × 30 CM · SOBRE LO MÁS NEGRO" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 7:45 · 48 HORAS: dos vueltas del reloj con sol y luna; cada ducha del día suma vapor contra el aluminio ----
export const HClock48: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 0.8, 6.0), hrs = Math.round(p * 48), ang = p * 720;
  const day = Math.sin(p * 2 * Math.PI * 2 - Math.PI / 2) * -1;
  return <>
    <Head tt={tt} kick="DOS DÍAS COMPLETOS" title="USAS EL BAÑO COMO SIEMPRE" />
    <div style={{ position: "absolute", left: 700, top: 560, width: 560, height: 560, marginLeft: -280, marginTop: -280, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #2a2a30, #121216)", boxShadow: "0 0 0 14px #3a3a42, 0 50px 120px rgba(0,0,0,.7)" }}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 276, top: 22, width: 8, height: 34, borderRadius: 4, background: DIM, transformOrigin: "4px 258px", transform: `rotate(${i * 30}deg)` }} />)}
      <div style={{ position: "absolute", left: 274, top: 70, width: 12, height: 210, borderRadius: 6, background: AMB, transformOrigin: "6px 210px", transform: `rotate(${ang}deg)`, boxShadow: `0 0 20px ${AMB}` }} />
      <div style={{ position: "absolute", left: 255, top: 255, width: 50, height: 50, borderRadius: 25, background: "#e8e4dc" }} />
    </div>
    {/* sol / luna */}
    <div style={{ position: "absolute", left: 1000, top: 270, width: 110, height: 110, borderRadius: 55, background: day > 0 ? "radial-gradient(circle,#ffe7a0,#ffb347)" : "radial-gradient(circle at 35% 35%,#f4f1ea,#b9b6ae)", boxShadow: day > 0 ? "0 0 60px #ffb347" : "0 0 30px rgba(255,255,255,.3)", opacity: 0.6 + 0.4 * Math.abs(day) }} />
    <div style={{ position: "absolute", left: 1290, top: 400, fontWeight: 900, fontSize: 200, color: TX, fontVariantNumeric: "tabular-nums" }}>{hrs}<span style={{ fontSize: 90, color: AMB }}> H</span></div>
    <div style={{ position: "absolute", left: 1235, top: 680, display: "flex", gap: 12 }}>{Array.from({ length: 6 }, (_, i) => { const on = p * 6 > i + 0.3; return <div key={i} style={{ width: 98, height: 62, borderRadius: 14, background: on ? "rgba(255,190,120,.25)" : "rgba(255,255,255,.06)", boxShadow: on ? `inset 0 0 0 3px ${AMB}` : "inset 0 0 0 2px rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 17, letterSpacing: 1, color: on ? AMB : DIM }}>DUCHA</div>; })}</div>
    <Tag tt={tt} at={3.0} x={1500} y={850} txt="NO ABRAS MÁS LA VENTANA" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 8:10 · EL VEREDICTO: el aluminio se despega y se da vuelta; gotitas abajo = condensación · mojado arriba = filtración ----
export const HFlip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const fl = eio(tt, 3.0, 4.6) * 180, back = fl > 90;
  return <>
    <Head tt={tt} kick="PASADAS LAS 48 HORAS" title="DESPEGAS Y MIRAS LOS DOS LADOS" />
    <div style={{ position: "absolute", left: 640, top: 570, perspective: 1600 }}>
      <div style={{ transform: `rotateX(${fl}deg)`, transformStyle: "preserve-3d" }}>
        <Foil x={0} y={0} s={470} tt={tt} tape={4} rot={back ? 180 : 0}>
          {!back && Array.from({ length: 40 }, (_, i) => <Drop key={i} x={30 + rnd(i) * 410} y={30 + rnd(i + 50) * 410} s={(8 + rnd(i + 2) * 18) * cl((tt - 0.8) * 1.4 - rnd(i))} />)}
          {back && <div style={{ position: "absolute", inset: 30, borderRadius: 10, background: "radial-gradient(ellipse at 50% 50%, rgba(80,60,30,.55), rgba(120,95,60,.2) 60%, transparent)" }} />}
        </Foil>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1150, top: 320, width: 640 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: cl((tt - 1.4) * 2) }}><div style={{ position: "relative", width: 80, height: 80 }}><Check x={40} y={40} s={80} p={cl(tt - 1.6)} /></div><div><div style={{ fontWeight: 900, fontSize: 44 }}>GOTITAS ABAJO</div><div style={{ fontSize: 32, color: ICE, fontWeight: 800 }}>VIENE DEL AIRE · CONDENSACIÓN</div></div></div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 70, opacity: cl((tt - 4.6) * 2) }}><div style={{ position: "relative", width: 80, height: 80 }}><Cross x={40} y={40} s={80} p={cl(tt - 4.8)} /></div><div><div style={{ fontWeight: 900, fontSize: 44 }}>MOJADO ARRIBA</div><div style={{ fontSize: 32, color: RED, fontWeight: 800 }}>VIENE DE LA LOSA · FILTRACIÓN</div></div></div>
    </div>
  </>;
}}</Stage>;

// ---- 9:28 · DÓNDE PONER LA PLATA: dos caminos con su ticket; membrana en la terraza para una condensación = plata tirada ----
export const HMoney: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const a = phys(tt, 0.6, 5.5, 0.5), b = phys(tt, 1.2, 5.5, 0.5), burn = cl((tt - 3.6) / 1.6);
  const ticket = (x: number, s: number, title: string, items: string[], tot: string, col: string, bad: number) => <div style={{ position: "absolute", left: x, top: 260, width: 560, transform: `translateY(${(1 - cl(s)) * -600}px) rotate(${(x > 900 ? 3 : -3) * cl(s)}deg)` }}>
    <div style={{ background: "#fbf8f1", borderRadius: "12px 12px 0 0", padding: "34px 40px 28px", boxShadow: "0 40px 90px rgba(0,0,0,.6)", color: "#24211d", fontFamily: HAND, position: "relative", overflow: "hidden" }}>
      <div style={{ fontWeight: 700, fontSize: 48 }}>{title}</div>
      {items.map((it, i) => <div key={i} style={{ fontSize: 36, marginTop: 12, borderBottom: "2px dashed rgba(0,0,0,.15)", paddingBottom: 8 }}>{it}</div>)}
      <div style={{ fontWeight: 700, fontSize: 52, marginTop: 20, color: col }}>{tot}</div>
      {bad > 0 && <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%,-50%) rotate(-14deg) scale(${2 - bad})`, opacity: bad, border: `7px solid ${RED}`, borderRadius: 12, padding: "6px 22px", fontFamily: "inherit", fontWeight: 900, fontSize: 54, color: RED, background: "rgba(251,248,241,.8)" }}>PLATA TIRADA</div>}
    </div>
    <div style={{ height: 26, background: "repeating-linear-gradient(135deg, #fbf8f1 0 18px, transparent 18px 36px)" }} />
  </div>;
  return <>
    <Head tt={tt} kick="UN ROLLO DE ALUMINIO Y DOS DÍAS" title="TE DICEN DÓNDE PONER LA PLATA" />
    {ticket(260, a, "Si es condensación", ["Vinagre blanco", "Fijador", "Pintura antihongos", "Abrir la ventana"], "BARATO", GRN, 0)}
    {ticket(1080, b, "Membrana en la terraza", ["Rollo de membrana", "Garrafa y soplete", "Un día de albañil"], "CARO", RED, burn)}
  </>;
}}</Stage>;
