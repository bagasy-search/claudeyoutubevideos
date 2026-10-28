// componentes únicos de al28b · B: minutos 10-20 (protegerte, limpiar, secar, fijador, pintura).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Check, Cross } from "./heroes1";
import { Ceil, Drop, Mold, rnd } from "./heroesA";

// corte de techo: losa de hormigón arriba, revoque, pintura; los hilos (raíces) del moho bajan adentro del revoque
const Slab: React.FC<{ x: number; y: number; w: number; tt: number; roots?: number; children?: React.ReactNode }> = ({ x, y, w, tt, roots = 1, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 520 }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: 230, background: "linear-gradient(180deg,#8d9196,#6f7378)", backgroundImage: "radial-gradient(rgba(40,40,45,.45) 3px, transparent 4px), radial-gradient(rgba(200,200,205,.3) 2px, transparent 3px)", backgroundSize: "34px 30px, 22px 26px", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 0, top: 230, width: w, height: 170, background: "linear-gradient(180deg,#c9bea8,#d8cfbd)", backgroundImage: "radial-gradient(rgba(120,100,70,.3) 1.5px, transparent 2px)", backgroundSize: "11px 11px" }} />
    <div style={{ position: "absolute", left: 0, top: 400, width: w, height: 26, background: "#f2f2ee", boxShadow: "0 8px 20px rgba(0,0,0,.35)" }} />
    <svg width={w} height={520} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 16 }, (_, i) => { const x0 = w * 0.18 + rnd(i) * w * 0.64, L = 110 + rnd(i + 3) * 120;
        return <path key={i} d={`M${x0} 426 Q${x0 + (rnd(i + 5) - 0.5) * 60} ${426 - L * 0.5} ${x0 + (rnd(i + 8) - 0.5) * 90} ${426 - L}`} stroke="#1e221d" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={260} strokeDashoffset={260 * (1 - roots)} opacity={0.85} />; })}
    </svg>
    {children}
    <div style={{ position: "absolute", left: w + 20, top: 100, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: DIM }}>LOSA</div>
    <div style={{ position: "absolute", left: w + 20, top: 300, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: DIM }}>REVOQUE</div>
    <div style={{ position: "absolute", left: w + 20, top: 400, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: DIM }}>PINTURA</div>
  </div>
);

// ---- 10:18 · TODO TE CAE EN LA CARA: de perfil, mirando para arriba; el polvito negro y las gotas bajan directo a ojos, nariz y boca ----
export const HFace: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fall = cl((tt - 1.0) / 4.0);
  return <>
    <Head tt={tt} kick="EN LA PARED ESTÁ ADELANTE · EN EL TECHO" title="TE CAE EN LA CARA" col={RED} />
    <Ceil x={300} y={190} w={1320} h={120}><Mold n={80} cx={760} cy={70} rx={340} ry={50} p={1} sz={12} seed={3} /></Ceil>
    {/* perfil mirando arriba (silueta) */}
    <svg width={700} height={620} style={{ position: "absolute", left: 640, top: 420 }}>
      <path d="M260 600 L260 470 Q170 450 150 380 Q120 300 170 230 Q200 150 290 120 Q330 108 350 140 L380 135 Q395 150 380 168 Q410 190 400 214 Q392 226 380 230 Q400 250 385 270 Q360 300 340 300 Q350 360 330 420 L330 600 Z" fill="#c98a5a" />
      <path d="M170 230 Q150 150 230 110 Q300 80 340 120 Q300 120 270 160 Q230 150 200 200 Z" fill="#3b3430" />
      <ellipse cx={330} cy={175} rx={10} ry={7} fill="#2a1a12" />
    </svg>
    {/* lo que cae: esporas, gotas de vinagre */}
    {Array.from({ length: 40 }, (_, i) => { const ph = ((tt * 0.45 + rnd(i)) % 1), x = 860 + (rnd(i + 2) - 0.5) * 260 + ph * 60, y = 310 + ph * 300, big = i % 4 === 0;
      return big ? <Drop key={i} x={x} y={y} s={14 * fall} o={Math.sin(ph * 3.14)} /> : <div key={i} style={{ position: "absolute", left: x, top: y, width: 7, height: 7, borderRadius: 4, background: "#161816", opacity: fall * Math.sin(ph * 3.14) }} />; })}
    <Tag tt={tt} at={2.2} x={1480} y={560} txt="OJOS" col={RED} size={44} />
    <Tag tt={tt} at={2.6} x={1480} y={640} txt="NARIZ" col={RED} size={44} />
    <Tag tt={tt} at={3.0} x={1480} y={720} txt="BOCA" col={RED} size={44} />
    <Tag tt={tt} at={4.6} x={420} y={760} txt="ESE POLVITO = ESPORAS" col={TX} size={40} />
  </>;
}}</Stage>;

// ---- 10:42 · EL EQUIPO: la mascarilla N95, las antiparras y los guantes caen uno a uno al estante y cada uno se tilda ----
export const HKit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const it = [
    { l: "MASCARILLA N95", n: "NO DE TELA", a: 0.6, el: <div style={{ width: 300, height: 220, borderRadius: "48% 48% 44% 44%", background: "radial-gradient(circle at 45% 35%, #ffffff, #e2e2de 60%, #c4c4bf)", boxShadow: "inset 0 -14px 30px rgba(0,0,0,.15)", position: "relative" }}><div style={{ position: "absolute", left: 120, top: 80, width: 60, height: 44, borderRadius: 10, background: "#d9d9d4", boxShadow: "inset 0 0 0 3px #bdbdb7" }} /><div style={{ position: "absolute", left: -40, top: 90, width: 380, height: 8, background: "#6f8fb3", borderRadius: 4 }} /></div> },
    { l: "ANTIPARRAS", n: "QUE TAPEN LOS COSTADOS", a: 2.0, el: <div style={{ width: 340, height: 150, borderRadius: 70, background: "linear-gradient(180deg, rgba(200,230,250,.55), rgba(140,190,230,.35))", boxShadow: "inset 0 0 0 10px #2c2f35, 0 10px 30px rgba(0,0,0,.4)", position: "relative" }}><div style={{ position: "absolute", left: 30, top: 24, width: 120, height: 30, borderRadius: 15, background: "rgba(255,255,255,.5)" }} /></div> },
    { l: "GUANTES DE GOMA", n: "LOS DE LAVAR PLATOS", a: 3.4, el: <svg width={260} height={260}><path d="M70 250 L70 140 Q60 80 75 40 Q90 25 100 45 L105 110 L110 20 Q125 5 138 22 L138 110 L148 25 Q162 10 175 28 L172 115 L185 55 Q200 42 210 60 L198 150 Q195 210 180 250 Z" fill="#f2cf3a" stroke="#c9a520" strokeWidth={5} /></svg> },
  ];
  return <>
    <Head tt={tt} kick="ANTES DE SUBIR A LA ESCALERA" title="TRES COSAS" />
    <div style={{ position: "absolute", left: 180, top: 770, width: 1560, height: 34, borderRadius: 8, background: "linear-gradient(180deg,#d6c7a8,#a8946f)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }} />
    {it.map((o, i) => { const s = phys(tt, o.a, 6, 0.42), x = 440 + i * 520;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x, top: 770, transform: `translate(-50%,-100%) translateY(${(1 - cl(s)) * -700}px) rotate(${(1 - cl(s)) * (i - 1) * 25}deg)`, opacity: cl((tt - o.a) / 0.6) * cl(s * 3) }}>{o.el}</div>
        <div style={{ position: "absolute", left: x - 40, top: 840 }}><div style={{ position: "relative", width: 80, height: 80, left: -0, top: 0 }}><Check x={40} y={40} s={76} p={cl((tt - o.a - 0.7) * 1.4)} /></div></div>
        <Tag tt={tt} at={o.a + 0.5} x={x} y={960} txt={o.l} col={TX} size={42} />
        <Tag tt={tt} at={o.a + 0.8} x={x} y={1015} txt={o.n} col={DIM} size={28} />
      </React.Fragment>; })}
  </>;
}}</Stage>;

// ---- 11:48 · EL METRO CUADRADO: una puerta acostada se apoya sobre la mancha; si el moho se pasa de la puerta, es para un profesional ----
export const HSquareM: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const door = phys(tt, 0.8, 5, 0.55), spread = cl((tt - 2.8) / 2.4);
  return <>
    <Head tt={tt} kick="LA REGLA QUE TE PIDO POR FAVOR" title="MÁS DE UN METRO CUADRADO" col={RED} />
    <Ceil x={220} y={240} w={1100} h={690}>
      <Mold n={260} cx={550} cy={345} rx={240 + 330 * spread} ry={160 + 200 * spread} p={0.4 + 0.6 * spread} sz={11} seed={12} />
      <div style={{ position: "absolute", left: 550 - 380, top: 345 - 120, width: 760, height: 240, borderRadius: 8, border: "8px solid rgba(250,245,235,.95)", background: "rgba(240,230,210,.18)", boxShadow: "0 0 0 2px rgba(0,0,0,.2)", transform: `scale(${cl(door)}) rotate(${(1 - cl(door)) * 30}deg)`, opacity: cl(door * 3) }}>
        <div style={{ position: "absolute", right: 40, top: 100, width: 30, height: 30, borderRadius: 15, background: "#c9a227" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontWeight: 900, fontSize: 64, color: "rgba(40,36,30,.75)" }}>1 M²</div>
      </div>
    </Ceil>
    <div style={{ position: "absolute", left: 1400, top: 330, width: 420 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}><div style={{ position: "relative", width: 76, height: 76 }}><Check x={38} y={38} s={72} p={cl(tt - 1.6)} /></div><div style={{ fontWeight: 900, fontSize: 38 }}>MANCHA CHICA<br /><span style={{ color: GRN, fontSize: 30 }}>LA LIMPIAS TÚ</span></div></div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 60, opacity: cl((tt - 3.4) * 2) }}><div style={{ position: "relative", width: 76, height: 76 }}><Cross x={38} y={38} s={72} p={cl(tt - 3.6)} /></div><div style={{ fontWeight: 900, fontSize: 38 }}>TECHO ENTERO<br /><span style={{ color: RED, fontSize: 30 }}>O ALGUIEN CON ASMA</span></div></div>
      <Tag tt={tt} at={4.6} x={0} y={420} anchor="l" txt="→ UN PROFESIONAL" col={RED} size={46} />
    </div>
  </>;
}}</Stage>;

// ---- 12:32 · LAS RAÍCES: el techo en corte; la lavandina blanquea la superficie (la mancha «desaparece») pero los hilos siguen vivos adentro y beben su agua ----
export const HRoots: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const bl = cl((tt - 1.0) / 1.2), soak = cl((tt - 2.8) / 2.0), regrow = cl((tt - 5.0) / 1.5);
  return <>
    <Head tt={tt} kick="LA LAVANDINA SACA EL COLOR" title="PERO EL MOHO TIENE RAÍCES" col={RED} />
    <Slab x={300} y={260} w={1100} tt={tt} roots={1}>
      {/* manchita en superficie que se blanquea y vuelve */}
      <div style={{ position: "absolute", left: 300, top: 418, width: 500, height: 26, borderRadius: 13, background: "#1d201c", opacity: Math.max(1 - bl, regrow) }} />
      {/* el agua de la lavandina que sube por las raíces */}
      {Array.from({ length: 18 }, (_, i) => { const x0 = 1100 * 0.18 + rnd(i) * 1100 * 0.64, y = 426 - soak * (90 + rnd(i + 3) * 140); return <div key={i} style={{ position: "absolute", left: x0 - 7, top: y - 7, width: 14, height: 14, borderRadius: 7, background: "rgba(120,190,240,.85)", opacity: soak > 0 && soak < 1 ? 1 : soak >= 1 ? 0.5 : 0 }} />; })}
      {/* chorro de lavandina */}
      <div style={{ position: "absolute", left: 420, top: 430, width: 260, height: 90 * bl, background: "linear-gradient(180deg, rgba(255,255,230,.6), transparent)", opacity: 1 - cl((tt - 2.4) * 2) }} />
    </Slab>
    <Tag tt={tt} at={1.6} x={560} y={830} txt="ARRIBA: BLANQUITO" col={TX} size={40} />
    <Tag tt={tt} at={3.2} x={1180} y={830} txt="ADENTRO: LE DISTE DE TOMAR" col={ICE} size={40} />
    <Tag tt={tt} at={5.2} x={860} y={930} txt="A LAS 2 SEMANAS, VUELVE" col={RED} size={50} />
  </>;
}}</Stage>;

// ---- 13:50 · UN PALMO MÁS: una luz UV pasa por el techo y muestra el moho que todavía no se ve alrededor de la mancha; la mano mide un palmo ----
export const HPalm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const uv = eio(tt, 1.0, 3.6), hand = phys(tt, 3.8, 5, 0.5);
  return <>
    <Head tt={tt} kick="NO ROCÍES SÓLO LO NEGRO" title="UN PALMO MÁS ALREDEDOR" />
    <Ceil x={260} y={230} w={1100} h={700}>
      <Mold n={110} cx={550} cy={350} rx={200} ry={150} p={1} sz={12} seed={5} />
      {/* el halo invisible, sólo bajo la luz */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1100, height: 700, clipPath: `inset(0 ${(1 - uv) * 100}% 0 0)` }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(40,10,90,.55)" }} />
        <Mold n={220} cx={550} cy={350} rx={360} ry={270} p={1} sz={7} seed={21} col="#b3ff6a" />
        <div style={{ position: "absolute", left: 550 - 360, top: 350 - 270, width: 720, height: 540, borderRadius: "50%", border: `5px dashed ${AMB}` }} />
      </div>
      <div style={{ position: "absolute", left: `${uv * 100}%`, top: 0, width: 16, height: 700, marginLeft: -8, background: "#c9a2ff", boxShadow: "0 0 40px 14px rgba(170,120,255,.7)", opacity: uv > 0 && uv < 1 ? 1 : 0 }} />
      {/* la mano que mide un palmo */}
      <svg width={300} height={160} style={{ position: "absolute", left: 750, top: 280, opacity: cl(hand * 2), transform: `scale(${cl(hand)})` }}><path d="M10 120 Q60 60 120 70 L260 30 Q285 30 280 52 L170 92 L270 90 Q290 96 278 114 L150 130 Q90 150 10 150 Z" fill="#d79b6c" stroke="#a8724a" strokeWidth={4} /></svg>
    </Ceil>
    <Tag tt={tt} at={3.0} x={1560} y={470} txt="LAS RAÍCES" col={TX} size={44} />
    <Tag tt={tt} at={3.3} x={1560} y={540} txt="VAN ANTES" col={TX} size={44} />
    <Tag tt={tt} at={3.6} x={1560} y={610} txt="QUE EL COLOR" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 14:18 · UNA HORA: el reloj de cocina gira una hora y el vinagre baja gota a gota por los hilos hasta la raíz ----
export const HHour: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 0.8, 5.6), kill = cl((tt - 4.6) / 1.4);
  return <>
    <Head tt={tt} kick="LA PARTE QUE TODOS SE SALTEAN" title="ESPERAS UNA HORA" />
    <Slab x={200} y={300} w={900} tt={tt} roots={1 - kill * 0.8}>
      {Array.from({ length: 16 }, (_, i) => { const x0 = 900 * 0.18 + rnd(i) * 900 * 0.64, y = 426 - p * (100 + rnd(i + 3) * 120); return <div key={i} style={{ position: "absolute", left: x0 - 8, top: y - 8, width: 16, height: 16, borderRadius: 8, background: "rgba(255,240,170,.9)", boxShadow: "0 0 12px rgba(255,230,140,.8)", opacity: p > 0.02 ? 1 : 0 }} />; })}
    </Slab>
    <div style={{ position: "absolute", left: 1500, top: 520, width: 400, height: 400, marginLeft: -200, marginTop: -200, borderRadius: "50%", background: "#f4f1e8", boxShadow: "0 0 0 16px #c33b2c, 0 40px 90px rgba(0,0,0,.6)" }}>
      <svg width={400} height={400} style={{ position: "absolute", inset: 0 }}><path d={`M200 200 L200 30 A170 170 0 ${p > 0.5 ? 1 : 0} 1 ${200 + 170 * Math.sin(p * 6.283)} ${200 - 170 * Math.cos(p * 6.283)} Z`} fill="rgba(255,190,90,.45)" /></svg>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 196, top: 14, width: 8, height: 26, background: "#3a3530", transformOrigin: "4px 186px", transform: `rotate(${i * 30}deg)` }} />)}
      <div style={{ position: "absolute", left: 194, top: 40, width: 12, height: 160, borderRadius: 6, background: "#2a2622", transformOrigin: "6px 160px", transform: `rotate(${p * 360}deg)` }} />
      <div style={{ position: "absolute", left: 180, top: 180, width: 40, height: 40, borderRadius: 20, background: "#2a2622" }} />
    </div>
    <Tag tt={tt} at={1.4} x={1500} y={800} txt="SIN ENJUAGAR · SIN TOCAR" col={TX} size={36} />
    <Tag tt={tt} at={4.8} x={650} y={900} txt="EL VINAGRE LLEGA A LA RAÍZ" col={AMB} size={46} />
  </>;
}}</Stage>;

// ---- 14:50 · LAS ESPORAS VIAJAN: si raspas fuerte, la nube negra sale del techo y aterriza en la toalla, el armario y la otra esquina ----
export const HSpores: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const go = cl((tt - 1.0) / 3.4);
  const T = [{ x: 380, y: 760, l: "LA TOALLA" }, { x: 960, y: 820, l: "EL ARMARIO" }, { x: 1560, y: 330, l: "OTRA ESQUINA" }];
  return <>
    <Head tt={tt} kick="SI RASPAS FUERTE" title="REPARTES EL MOHO POR LA CASA" col={RED} />
    {/* plano del baño visto de arriba */}
    <div style={{ position: "absolute", left: 220, top: 230, width: 1480, height: 760, borderRadius: 16, background: "rgba(255,255,255,.04)", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.25)" }} />
    <div style={{ position: "absolute", left: 240, top: 250, width: 300, height: 260, borderRadius: 10, background: "rgba(140,190,230,.12)", boxShadow: "inset 0 0 0 3px rgba(140,190,230,.5)" }} />
    <div style={{ position: "absolute", left: 300, top: 300, width: 120, height: 120 }}><Mold n={60} cx={60} cy={60} rx={60} ry={60} p={1} sz={10} seed={8} /></div>
    {T.map((d, k) => <React.Fragment key={k}>
      {Array.from({ length: 22 }, (_, i) => { const q = cl(go * 1.4 - rnd(i + k * 30) * 0.4), x = 360 + (d.x - 360) * q + Math.sin(q * 6 + i) * 40 * (1 - q), y = 360 + (d.y - 360) * q - Math.sin(q * 3.14) * 160;
        return <div key={i} style={{ position: "absolute", left: x + (rnd(i) - 0.5) * 60, top: y + (rnd(i + 5) - 0.5) * 60, width: 9, height: 9, borderRadius: 5, background: "#1a1c19", opacity: q > 0 ? 0.85 : 0 }} />; })}
      <div style={{ position: "absolute", left: d.x - 70, top: d.y - 70, width: 140, height: 140, opacity: cl((go - 0.75) * 4) }}><Mold n={40} cx={70} cy={70} rx={60} ry={60} p={1} sz={9} seed={k + 30} /></div>
      <Tag tt={tt} at={3.6 + k * 0.3} x={d.x} y={d.y + 110} txt={d.l} col={RED} size={36} />
    </React.Fragment>)}
    <Tag tt={tt} at={5.0} x={1250} y={620} txt="CEPILLADO SUAVE" col={GRN} size={50} />
  </>;
}}</Stage>;

// ---- 15:18 · NUNCA JUNTOS: la botella de vinagre y la de lavandina se acercan; antes de tocarse sale la nube verde y la barrera las separa ----
export const HNoMix: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 45%, #2a1612, #080606 80%)">{(tt) => {
  const app = eio(tt, 0.6, 2.2), gas = cl((tt - 1.8) / 1.0), back = eio(tt, 3.0, 4.0);
  const d = 330 * (1 - app) + 330 * back + 135;
  const bottle = (x: number, col: string, cap: string, lab: string) => <div style={{ position: "absolute", left: x - 110, top: 330, width: 220, height: 520 }}>
    <div style={{ position: "absolute", left: 70, top: 0, width: 80, height: 70, borderRadius: 10, background: cap }} />
    <div style={{ position: "absolute", left: 0, top: 60, width: 220, height: 460, borderRadius: "70px 70px 30px 30px", background: col, boxShadow: "inset 20px 0 40px rgba(255,255,255,.3), 0 40px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 20, right: 20, top: 260, padding: "14px 0", background: "#fbf8f1", borderRadius: 8, textAlign: "center", fontWeight: 900, fontSize: 24, color: "#24211d" }}>{lab}</div>
  </div>;
  return <>
    <Head tt={tt} kick="UNA ADVERTENCIA QUE NO OLVIDES" title="NUNCA LOS MEZCLES" col={RED} />
    {bottle(960 - d, "linear-gradient(90deg, rgba(235,240,230,.55), rgba(250,250,240,.75))", "#d23b2a", "VINAGRE")}
    {bottle(960 + d, "linear-gradient(90deg,#f2f2f2,#ffffff)", "#2a5fb3", "LAVANDINA")}
    {Array.from({ length: 16 }, (_, i) => { const ph = (tt * 0.4 + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: 960 + (rnd(i + 1) - 0.5) * 260 - 90, top: 640 - ph * 420, width: 180, height: 140, borderRadius: "50%", background: "rgba(170,230,90,.38)", filter: "blur(22px)", opacity: gas * (1 - back) * Math.sin(ph * 3.14) }} />; })}
    <div style={{ position: "absolute", left: 950, top: 300, width: 20, height: 580 * back, background: RED, borderRadius: 10, boxShadow: `0 0 30px ${RED}` }} />
    <Tag tt={tt} at={2.0} x={960} y={250} txt="UN GAS QUE QUEMA LOS PULMONES" col={RED} size={44} />
    <Tag tt={tt} at={4.0} x={960} y={950} txt="SI HUBO LAVANDINA: ESPERA UN DÍA" col={TX} size={40} />
  </>;
}}</Stage>;

// ---- 16:22 · DOS DÍAS DE SECADO: un medidor sobre el revoque: la aguja baja de MOJADO a SECO mientras pasan el día y la noche ----
export const HDry: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const p = eio(tt, 0.8, 5.8), wet = 1 - p;
  return <>
    <Head tt={tt} kick="LIMPIO Y SIN PINTAR" title="ESPERAS DOS DÍAS" />
    <div style={{ position: "absolute", left: 220, top: 280, width: 760, height: 560, borderRadius: 12, overflow: "hidden", background: "#d8cfbd", boxShadow: "0 40px 90px rgba(0,0,0,.55)" }}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 700 - 100, top: rnd(i + 4) * 500 - 100, width: 260 + rnd(i + 2) * 200, height: 220 + rnd(i + 7) * 160, borderRadius: "50%", background: "rgba(90,80,65,.45)", filter: "blur(30px)", opacity: cl(wet * 1.4 - rnd(i) * 0.4) }} />)}
    </div>
    {/* medidor */}
    <div style={{ position: "absolute", left: 1150, top: 300, width: 560, height: 380, borderRadius: 30, background: "#1c1c20", boxShadow: "0 40px 90px rgba(0,0,0,.6), inset 0 0 0 3px #34343a" }}>
      <svg width={560} height={300} style={{ position: "absolute", left: 0, top: 20 }}>
        <path d="M80 260 A200 200 0 0 1 480 260" stroke="url(#g)" strokeWidth={34} fill="none" />
        <defs><linearGradient id="g"><stop offset="0" stopColor={GRN} /><stop offset="1" stopColor="#3b7fd6" /></linearGradient></defs>
        <line x1={280} y1={260} x2={280 + 180 * Math.cos(Math.PI - (0.15 + 0.7 * wet) * Math.PI)} y2={260 - 180 * Math.sin(Math.PI - (0.15 + 0.7 * wet) * Math.PI)} stroke={TX} strokeWidth={10} strokeLinecap="round" />
        <circle cx={280} cy={260} r={18} fill={TX} />
      </svg>
      <div style={{ position: "absolute", left: 50, top: 300, fontWeight: 900, fontSize: 28, color: GRN }}>SECO</div>
      <div style={{ position: "absolute", right: 50, top: 300, fontWeight: 900, fontSize: 28, color: "#6aa7ef" }}>MOJADO</div>
    </div>
    <div style={{ position: "absolute", left: 1150, top: 740, display: "flex", gap: 20 }}>{["DÍA 1", "NOCHE", "DÍA 2", "NOCHE"].map((d, i) => { const on = p * 4 > i; return <div key={i} style={{ padding: "14px 22px", borderRadius: 14, background: on ? (i % 2 ? "#2b3550" : "rgba(255,190,120,.25)") : "rgba(255,255,255,.06)", fontWeight: 900, fontSize: 28, color: on ? TX : DIM }}>{d}</div>; })}</div>
    <Tag tt={tt} at={1.4} x={600} y={900} txt="VENTANA Y PUERTA ABIERTAS" col={TX} size={40} />
  </>;
}}</Stage>;

// ---- 16:58 · LA PRUEBA DE LA MANO: el dorso apoyado en el techo; el lado frío y húmedo pinta azul, el seco y tibio pinta ámbar ----
export const HHand: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const L = phys(tt, 0.6, 5, 0.55), R = phys(tt, 2.8, 5, 0.55);
  const panel = (x: number, s: number, cold: boolean, a: string, b: string) => <div style={{ position: "absolute", left: x, top: 260, width: 680, height: 600, borderRadius: 18, overflow: "hidden", background: cold ? "radial-gradient(circle at 50% 45%, #4c86d0, #1d3a66 75%)" : "radial-gradient(circle at 50% 45%, #ffb35a, #a8521f 75%)", boxShadow: "0 40px 90px rgba(0,0,0,.6)", opacity: cl(s * 2), transform: `scale(${0.9 + 0.1 * cl(s)})` }}>
    <svg width={680} height={600} style={{ position: "absolute", inset: 0 }}><path d="M210 600 L230 330 Q230 260 280 250 L470 250 Q520 255 515 300 L500 600 Z" fill="rgba(255,235,215,.92)" /><path d="M280 250 Q300 200 340 205 L470 230" stroke="rgba(255,235,215,.92)" strokeWidth={40} fill="none" strokeLinecap="round" /></svg>
    {cold && Array.from({ length: 16 }, (_, i) => <Drop key={i} x={80 + rnd(i) * 520} y={40 + rnd(i + 3) * 160} s={14 + rnd(i + 6) * 10} />)}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontWeight: 900, fontSize: 50, color: "#fff", textShadow: "0 4px 20px rgba(0,0,0,.5)" }}>{a}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontWeight: 900, fontSize: 36, color: "rgba(255,255,255,.85)" }}>{b}</div>
  </div>;
  return <>
    <Head tt={tt} kick="APOYAS EL DORSO DE LA MANO" title="¿FRÍO O TIBIO?" />
    {panel(200, L, true, "TODAVÍA NO", "FRÍO Y HÚMEDO · SÓTANO")}
    {panel(1040, R, false, "YA ESTÁ", "SECO Y TIBIO · COMO EL RESTO")}
  </>;
}}</Stage>;

// ---- 17:52 · EL PEGAMENTO FINITO: con la lupa, los granitos sueltos del revoque; el fijador los envuelve y quedan pegados entre sí ----
export const HPrimer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const glue = eio(tt, 1.6, 4.2), shake = (1 - glue) * 6;
  return <>
    <Head tt={tt} kick="LA MANO QUE NADIE VE" title="EL FIJADOR PEGA LOS GRANITOS" />
    <div style={{ position: "absolute", left: 960, top: 580, width: 760, height: 760, marginLeft: -380, marginTop: -380, borderRadius: "50%", overflow: "hidden", background: "#cfc4ad", boxShadow: "0 0 0 24px #2b2b2f, 0 50px 120px rgba(0,0,0,.7)" }}>
      {Array.from({ length: 70 }, (_, i) => { const x = rnd(i) * 720, y = rnd(i + 70) * 720, s = 34 + rnd(i + 3) * 46;
        return <div key={i} style={{ position: "absolute", left: x + Math.sin(tt * 9 + i) * shake, top: y + Math.cos(tt * 7 + i) * shake, width: s, height: s * 0.85, borderRadius: "45% 55% 40% 60%", background: `hsl(38, ${18 + rnd(i) * 14}%, ${66 + rnd(i + 1) * 14}%)`, boxShadow: `0 0 0 ${6 * glue}px rgba(250,250,250,${0.55 * glue}), 0 4px 8px rgba(0,0,0,.25)` }} />; })}
      <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${0.2 * glue})` }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,.3), transparent 40%)" }} />
    </div>
    <Tag tt={tt} at={0.8} x={300} y={460} txt="FLOJITO" col={RED} size={46} />
    <Tag tt={tt} at={1.1} x={300} y={530} txt="POLVORIENTO" col={RED} size={46} />
    <Tag tt={tt} at={3.6} x={1620} y={460} txt="PEGADO" col={GRN} size={46} />
    <Tag tt={tt} at={3.9} x={1620} y={530} txt="PAREJO" col={GRN} size={46} />
  </>;
}}</Stage>;

// ---- 18:58 · LA ESPONJA EN EL TECHO: dos capas de pintura en corte bajo el vapor: la barata chupa el agua y se oscurece; la antihongos la hace resbalar ----
export const HSponge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const p = cl((tt - 1.0) / 4.0);
  const col = (x: number, good: boolean) => <div style={{ position: "absolute", left: x, top: 300, width: 700, height: 560 }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 700, height: 220, background: "linear-gradient(180deg,#d1c6b0,#c1b59c)" }} />
    <div style={{ position: "absolute", left: 0, top: 220, width: 700, height: 60, background: good ? "linear-gradient(180deg,#ffffff,#eef3f6)" : `linear-gradient(180deg, rgb(${240 - 70 * p},${240 - 60 * p},${235 - 50 * p}), #e8e4da)`, boxShadow: good ? "0 4px 0 rgba(160,210,240,.6)" : "none", backgroundImage: good ? undefined : "radial-gradient(rgba(120,110,90,.35) 3px, transparent 4px)", backgroundSize: "16px 14px" }} />
    {Array.from({ length: 22 }, (_, i) => { const ph = (tt * 0.5 + rnd(i + (good ? 40 : 0))) % 1, x0 = 30 + rnd(i + 3) * 640;
      const y = good ? 520 - ph * 240 : 520 - Math.min(ph * 300, 300);
      const slide = good && ph > 0.95 ? 0 : 0;
      return <Drop key={i} x={x0 + slide} y={good ? Math.max(y, 296) : y} s={14} o={good ? (y <= 296 ? 0.9 : 0.8) : (y < 290 ? 0 : 0.85)} />; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: -70, textAlign: "center", fontWeight: 900, fontSize: 32, whiteSpace: "nowrap", color: good ? GRN : RED }}>{good ? "ANTIHONGOS · MÁS RESINA" : "LÁTEX BARATO · MUCHA CARGA"}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontWeight: 900, fontSize: 36, color: TX, opacity: cl((tt - 3.2) * 2) }}>{good ? "EL AGUA RESBALA" : "CHUPA EL AGUA Y SE LA DA AL MOHO"}</div>
  </div>;
  return <>
    <Head tt={tt} kick="LA PINTURA DE MARZO" title="LE ARMASTE UNA ESPONJA" />
    {col(180, false)}
    {col(1040, true)}
  </>;
}}</Stage>;

// ---- 19:42 · DOS MANOS FINAS: rodillo cruzando en un sentido y después en el otro; al lado, una mano gruesa que chorrea ----
export const HTwoCoats: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const c1 = eio(tt, 0.6, 2.6), c2 = eio(tt, 2.8, 4.8), drip = cl((tt - 1.2) / 3);
  return <>
    <Head tt={tt} kick="CRUZANDO EN UN SENTIDO Y EN EL OTRO" title="DOS MANOS FINAS, NO UNA GRUESA" />
    <Ceil x={200} y={260} w={860} h={640} col="#d6d2c6">
      <div style={{ position: "absolute", left: 0, top: 0, width: `${c1 * 100}%`, height: "100%", background: "repeating-linear-gradient(90deg, rgba(255,255,255,.75) 0 80px, rgba(250,250,250,.65) 80px 160px)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: `${c2 * 100}%`, background: "repeating-linear-gradient(0deg, rgba(255,255,255,.9) 0 80px, rgba(252,252,252,.85) 80px 160px)" }} />
      <div style={{ position: "absolute", left: c1 < 1 ? c1 * 860 - 60 : -400, top: 240, width: 120, height: 180, borderRadius: 20, background: "linear-gradient(90deg,#f2f2ee,#ffffff)", boxShadow: "0 10px 30px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: 340, top: c2 > 0 && c2 < 1 ? 640 - c2 * 700 - 60 : -400, width: 180, height: 120, borderRadius: 20, background: "linear-gradient(0deg,#f2f2ee,#ffffff)", boxShadow: "0 10px 30px rgba(0,0,0,.35)" }} />
    </Ceil>
    <Ceil x={1180} y={260} w={540} h={640} col="#d6d2c6">
      <div style={{ position: "absolute", inset: 0, background: "#fbfbf8" }} />
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 50 + i * 85, top: 0, width: 26, height: 60 + drip * (140 + rnd(i) * 260), borderRadius: "0 0 14px 14px", background: "linear-gradient(180deg,#fbfbf8,#f2f1ec)", boxShadow: "2px 4px 6px rgba(0,0,0,.18)" }} />)}
    </Ceil>
    <Tag tt={tt} at={1.0} x={630} y={960} txt="1ª ↔   ·   2ª ↕   ·   4 H ENTRE UNA Y OTRA" col={GRN} size={36} />
    <Tag tt={tt} at={2.4} x={1450} y={960} txt="GRUESA: CHORREA" col={RED} size={40} />
  </>;
}}</Stage>;
