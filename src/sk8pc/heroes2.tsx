// componentes únicos de al28a · 17-30 (minutos 8-20): el testigo, cuándo llamar, el error del relleno duro, abrir en V, limpiar y fijador.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Check, CrackSvg, Cross, Pill, Wall } from "./heroes1";

// corte de pared (revoque sobre ladrillo) visto de canto, con la grieta como ranura: base de varios componentes
const Section: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 12, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h * 0.42, background: "linear-gradient(180deg,#e9e1cf,#cfc5b0)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.42, bottom: 0, background: "#b8664a", backgroundImage: "repeating-linear-gradient(90deg, transparent 0 230px, rgba(230,210,180,.7) 230px 242px), repeating-linear-gradient(0deg, transparent 0 96px, rgba(230,210,180,.7) 96px 106px)" }} />
    {children}
  </div>
);

// ---- 8:00 · EL TESTIGO, PASO A PASO: raspar el círculo, el vasito, la pastilla que cruza, la fecha y la rayita ----
export const HPillBuild: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 45% 45%, #2c261c, #080706 80%)">{(tt) => {
  const scr = eio(tt, 0.5, 1.6), paste = phys(tt, 2.2, 7, 0.5), date = eio(tt, 3.6, 4.4), line = eio(tt, 4.8, 5.6);
  const S = ["RASPAR Ø 5 CM", "YESO + AGUA", "CRUZANDO LA GRIETA", "LA FECHA", "LA RAYITA"];
  return <>
    <Head tt={tt} kick="PUNTO 3 · EL TESTIGO DE YESO" title="UN DETECTOR DE CENTAVOS" />
    <Wall x={330} y={240} w={820} h={680}>
      <CrackSvg d="M410 0 L430 160 L395 330 L440 500 L420 680" p={1} w={6} W={820} Hh={680} />
      {/* el círculo raspado: aparece el revoque gris */}
      <div style={{ position: "absolute", left: 410 - 150, top: 340 - 150, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #b9b2a2, #a59d8b)", opacity: scr, transform: `scale(${0.6 + 0.4 * scr})` }} />
      {paste > 0.01 && <Pill x={418} y={340} r={110} s={cl(paste)} />}
      <div style={{ position: "absolute", left: 560, top: 300, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#3a3a42", clipPath: `inset(0 ${(1 - date) * 100}% 0 0)` }}>14 / 3</div>
      <div style={{ position: "absolute", left: 120, top: 338, width: 600 * line, height: 5, background: "#2a2a30", borderRadius: 3 }} />
    </Wall>
    {/* el vasito con la pasta "como dulce de leche frío" */}
    <div style={{ position: "absolute", left: 1260, top: 610 - 30 * eio(tt, 1.4, 2.2), width: 170, height: 190, opacity: cl((tt - 1.2) * 3), clipPath: "polygon(0 0, 100% 0, 86% 100%, 14% 100%)", background: "linear-gradient(90deg, rgba(255,255,255,.35), rgba(255,255,255,.75) 40%, rgba(255,255,255,.3))" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 110, background: "linear-gradient(#fbf8f0,#e7e1d2)" }} />
    </div>
    <div style={{ position: "absolute", left: 1350, top: 460, width: 14, height: 300, background: "#c7a26a", borderRadius: 7, transform: `rotate(${12 + 10 * Math.sin(tt * 4) * (tt < 2.2 ? 1 : 0)}deg)`, opacity: cl((tt - 1.3) * 3) }} />
    {S.map((s, i) => <Tag key={i} tt={tt} at={0.6 + i * 1.15} x={1440} y={300 + i * 70} txt={`${i + 1} · ${s}`} col={i === 2 ? AMB : TX} size={30} anchor="l" />)}
  </>;
}}</Stage>;

// ---- 9:50 · CUATRO SEMANAS: el calendario con los cuatro lunes; el testigo de la izquierda entero, el de la derecha se parte ----
export const HVerdict: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 45%, #1e2228, #06070a 80%)">{(tt) => {
  const wk = Math.min(4, Math.max(0, Math.floor((tt - 0.6) / 0.7) + 1)), split = eio(tt, 3.4, 4.4);
  return <>
    <Head tt={tt} kick="UNA VEZ POR SEMANA · MISMA HORA, MISMA LUZ" title="CUATRO SEMANAS DESPUÉS" />
    <div style={{ position: "absolute", left: 760, top: 210, display: "flex", gap: 22 }}>
      {[1, 2, 3, 4].map((n) => <div key={n} style={{ width: 92, height: 92, borderRadius: 16, background: n <= wk ? "rgba(255,190,90,.18)" : "rgba(255,255,255,.05)", border: `2px solid ${n <= wk ? AMB : "rgba(255,255,255,.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 34, color: n <= wk ? AMB : DIM }}>S{n}</div>)}
    </div>
    <Wall x={240} y={380} w={640} h={460}><CrackSvg d="M320 0 L335 150 L310 300 L330 460" p={1} w={5} W={640} Hh={460} /><Pill x={325} y={230} r={90} date="3/3" /></Wall>
    <Wall x={1040} y={380} w={640} h={460}><CrackSvg d="M320 0 L340 150 L305 300 L332 460" p={1} w={5 + 6 * split} W={640} Hh={460} /><Pill x={325} y={230} r={90} crack={split} open={split * 0.5} date="3/3" /></Wall>
    <Check x={560} y={930} s={90} p={eio(tt, 3.0, 3.8)} />
    <Tag tt={tt} at={3.2} x={560} y={1010} txt="ENTERO · QUIETA · SE ARREGLA" col={GRN} size={30} />
    <Cross x={1360} y={930} s={90} p={eio(tt, 4.4, 5.2)} />
    <Tag tt={tt} at={4.6} x={1360} y={1010} txt="PARTIDO · SE MUEVE HOY · NO SE TAPA" col={RED} size={30} />
  </>;
}}</Stage>;

// ---- 11:00 · LAS SEIS SEÑALES ROJAS: un tablero de alarmas que se encienden de a una ----
export const HRedFlags: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 45%, #2a1210, #080404 80%)">{(tt) => {
  const R: [string, string][] = [["DIAGONAL Y MÁS ANCHA ARRIBA", "1"], ["MÁS DE 3-5 MM", "2"], ["CRECIÓ EN 7 DÍAS", "3"], ["EL TESTIGO SE PARTIÓ", "4"], ["UNA PUERTA SE TRABA", "5"], ["SE VE DE LOS DOS LADOS", "6"]];
  return <>
    <Head tt={tt} kick="PUNTO 4 · SIN ESPERAR" title="LLAMA A UN PROFESIONAL SI…" col={RED} />
    {R.map(([n, ic], i) => { const on = phys(tt, 0.6 + i * 0.75, 7, 0.5), x = 230 + (i % 3) * 500, y = 300 + Math.floor(i / 3) * 330, glow = cl(on);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 440, height: 280, borderRadius: 26, background: `linear-gradient(160deg, rgba(255,90,74,${0.08 + 0.2 * glow}), rgba(20,8,8,.9))`, border: `2px solid rgba(255,90,74,${0.2 + 0.6 * glow})`, boxShadow: `0 0 ${50 * glow}px rgba(255,90,74,${0.35 * glow}), 0 30px 60px rgba(0,0,0,.6)`, transform: `scale(${0.9 + 0.1 * cl(on)})`, opacity: 0.35 + 0.65 * cl(on * 1.5) }}>
        <div style={{ position: "absolute", left: 30, top: 26, width: 90, height: 90, borderRadius: 45, background: `radial-gradient(circle at 40% 35%, #ffb2a6, ${RED})`, boxShadow: `0 0 ${40 * glow}px ${RED}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 34, color: "#3a0a06" }}>{ic}</div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 150, fontWeight: 900, fontSize: 34, lineHeight: 1.15 }}>{n}</div>
      </div>; })}
    <Tag tt={tt} at={5.6} x={960} y={985} txt="INGENIERO · ARQUITECTO · MAESTRO MAYOR — NO EL PINTOR" col={TX} size={34} />
  </>;
}}</Stage>;

// ---- 12:45 · LA CANALETA: corte de la casa; la canaleta rota tira el agua contra el cimiento, la tierra se ablanda, la esquina baja ----
export const HGutter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg, #1a2430 0%, #0e141a 64%, #2c2014 64%, #120c06 100%)">{(tt) => {
  const rain = cl(tt - 0.3), soak = eio(tt, 1.4, 4.0), sink = eio(tt, 3.0, 5.0);
  return <>
    <Head tt={tt} kick="LA CAUSA MÁS COMÚN" title="UNA CANALETA ROTA" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`rotate(${1.6 * sink} 1260 690)`}>
        <path d="M560 690 L560 380 L1260 380 L1260 690 Z" fill="#e3d9c4" />
        <path d="M520 380 L910 230 L1300 380 Z" fill="#8b4a36" />
        <path d={`M640 690 L700 600 L660 520 L730 450`} stroke="#1a1410" strokeWidth={4 + 8 * sink} fill="none" opacity={sink} />
        <rect x={1250} y={372} width={80} height={22} fill="#9aa3ad" />
        <rect x={1300} y={392} width={22} height={60} fill="#9aa3ad" />
      </g>
      <rect x={540} y={690} width={740} height={70} fill="#8f8a80" />
      {/* el chorro que cae pegado a la pared */}
      {Array.from({ length: 14 }, (_, i) => { const ph = ((tt * 1.6 + i / 14) % 1); return <line key={i} x1={1312 + Math.sin(i) * 6} y1={452 + ph * 250} x2={1312 + Math.sin(i) * 6} y2={482 + ph * 250} stroke="rgba(150,200,255,.8)" strokeWidth={6} strokeLinecap="round" opacity={rain} />; })}
      {/* la mancha de agua que se mete bajo el cimiento */}
      <ellipse cx={1300} cy={800} rx={60 + 230 * soak} ry={30 + 140 * soak} fill={`rgba(70,110,160,${0.45 * soak})`} />
    </svg>
    {/* lluvia */}
    {Array.from({ length: 40 }, (_, i) => { const ph = (tt * 1.2 + (i * 0.37) % 1) % 1; return <div key={i} style={{ position: "absolute", left: 80 + (i * 47) % 1800, top: -40 + ph * 760, width: 3, height: 34, background: "rgba(160,200,240,.45)", opacity: rain }} />; })}
    <Tag tt={tt} at={1.6} x={1380} y={440} txt="EL AGUA, JUSTO AHÍ" col={ICE} size={34} anchor="l" />
    <Tag tt={tt} at={3.0} x={1440} y={880} txt="LA TIERRA SE ABLANDA" col={AMB} size={32} anchor="l" />
    <Tag tt={tt} at={4.6} x={960} y={985} txt="SE ARREGLA ESO · LA TIERRA SE SECA · RECIÉN AHÍ SE TAPA" col={TX} size={34} />
  </>;
}}</Stage>;

// ---- 14:10 · LA PARED RESPIRA: día y noche, verano e invierno; la junta se abre y se cierra como un fuelle ----
export const HBreathe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 45%, #1a1e26, #050608 80%)">{(tt) => {
  const ph = Math.sin(tt * 1.6), gap = 16 + 14 * ph, day = 0.5 + 0.5 * ph;
  return <>
    <Head tt={tt} kick="POQUITO, PERO TODOS LOS DÍAS" title="LA PARED SE MUEVE" />
    <div style={{ position: "absolute", left: 140, top: 330, width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle,#fff3c4,#ffb02e)", boxShadow: `0 0 ${80 * day}px #ffb02e`, opacity: day }} />
    <div style={{ position: "absolute", left: 140, top: 330, width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle at 35% 35%,#eef3ff,#9aa8c4)", boxShadow: "0 0 40px rgba(170,190,230,.6)", opacity: 1 - day }} />
    <Wall x={960 - 600 - gap / 2} y={330} w={600} h={480} />
    <Wall x={960 + gap / 2} y={330} w={600} h={480} />
    <div style={{ position: "absolute", left: 960 - gap / 2, top: 330, width: gap, height: 480, background: "#0a0806" }} />
    {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: 960 + s * (gap / 2 + 60) - 40, top: 860, width: 80, height: 6, background: AMB, borderRadius: 3, transform: `scaleX(${0.6 + 0.4 * Math.abs(ph)})` }} />)}
    <Tag tt={tt} at={0.8} x={640} y={290} txt={ph > 0 ? "DE DÍA · SOL · SE ESTIRA" : "DE NOCHE · FRÍO · SE ENCOGE"} col={ph > 0 ? AMB : ICE} size={34} />
    <Tag tt={tt} at={2.6} x={1300} y={290} txt="INVIERNO SE HINCHA · VERANO SE ACHICA" col={DIM} size={30} />
    <Tag tt={tt} at={4.0} x={960} y={950} txt="LA GRIETA ES LA JUNTA DONDE SE ACOMODA TODO" col={TX} size={38} />
  </>;
}}</Stage>;

// ---- 14:45 · EL TAPÓN DE PIEDRA: el relleno duro en la junta; la pared respira, el tapón no: se despega de un costado y la grieta vuelve exacta ----
export const HPlug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const fill = eio(tt, 0.4, 1.4), mv = tt > 1.8 ? Math.sin((tt - 1.8) * 2.4) : 0, brk = eio(tt, 3.0, 3.6);
  const g = 26 + 18 * mv;
  return <>
    <Head tt={tt} kick="EL ERROR QUE LA HACE VOLVER" title="UN TAPÓN DE PIEDRA" col={RED} />
    <Section x={360} y={250} w={1200} h={600}>
      <div style={{ position: "absolute", left: 600 - g / 2, top: 0, width: g, height: 600, background: "#0a0806" }} />
      {/* el tapón: pegado al lado izquierdo; cuando se despega aparece la rendija del lado derecho */}
      <div style={{ position: "absolute", left: 600 - 13 - 9 * mv * brk, top: 0, width: 26, height: 252 * fill, background: "linear-gradient(90deg,#f4f1ea,#d9d3c6)", boxShadow: "inset -3px 0 0 rgba(0,0,0,.2)" }} />
      {brk > 0 && <div style={{ position: "absolute", left: 600 + 13 - 9 * mv * brk, top: 0, width: Math.max(0, 9 + 18 * mv) * brk, height: 252, background: "#050403" }} />}
    </Section>
    <Tag tt={tt} at={0.8} x={1570} y={330} txt="YESO · ENDUIDO" col={TX} size={28} anchor="l" />
    <Tag tt={tt} at={1.4} x={1570} y={375} txt="DURO COMO PIEDRA" col={DIM} size={26} anchor="l" />
    <Tag tt={tt} at={3.4} x={1570} y={560} txt="SE DESPEGA" col={RED} size={34} anchor="l" />
    <Tag tt={tt} at={4.6} x={960} y={950} txt="NO ES QUE VOLVIÓ · NUNCA SE FUE" col={AMB} size={46} />
  </>;
}}</Stage>;

// ---- 15:30 · ABRIR EN V: la ranura finita y honda con la masilla puente encima, contra la V donde el relleno se agarra a las paredes inclinadas ----
export const HVee: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 45%, #2a2219, #070605 80%)">{(tt) => {
  const bridge = eio(tt, 0.6, 1.6), pop = eio(tt, 2.0, 2.6), v = eio(tt, 3.0, 4.2), fl = eio(tt, 4.4, 5.4);
  return <>
    <Head tt={tt} kick="PUNTO 5 · PARECE AL REVÉS" title="ABRIR LA GRIETA EN V" />
    <Section x={200} y={300} w={700} h={520}>
      <div style={{ position: "absolute", left: 345, top: 0, width: 10, height: 360, background: "#0a0806" }} />
      <div style={{ position: "absolute", left: 300, top: -14 - pop * 60, width: 100, height: 16, borderRadius: 8, background: "#f1ede4", opacity: bridge * (1 - pop * 0.6), transform: `rotate(${pop * -18}deg)` }} />
    </Section>
    <Section x={1020} y={300} w={700} h={520}>
      <svg width={700} height={520} style={{ position: "absolute", inset: 0 }}>
        <path d={`M${350 - 6 - 50 * v} 0 L350 ${220 + 140 * (1 - v)} L${350 + 6 + 50 * v} 0 Z`} fill="#0a0806" />
        <path d={`M${350 - 6 - 50 * v} 0 L350 ${220 + 140 * (1 - v)} L${350 + 6 + 50 * v} 0 Z`} fill="#f2efe8" style={{ clipPath: `inset(${(1 - fl) * 100}% 0 0 0)` }} />
      </svg>
    </Section>
    <Cross x={550} y={900} s={86} p={eio(tt, 2.2, 3.0)} />
    <Tag tt={tt} at={2.4} x={550} y={985} txt="MASILLA ENCIMA = UN PUENTE QUE SE DESPEGA" col={RED} size={28} />
    <Check x={1370} y={900} s={86} p={eio(tt, 5.0, 5.8)} />
    <Tag tt={tt} at={5.0} x={1370} y={985} txt="½ CM ARRIBA · SE AGARRA A LAS PAREDES" col={GRN} size={28} />
  </>;
}}</Stage>;

// ---- 16:40 · LAS TRES CAPAS SUELTAS: al raspar salen el yeso, el enduido y la masilla de las tres tapadas, apoyadas, sin pegar ----
export const HLayers3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 45%, #2a2218, #080605 80%)">{(tt) => {
  const L = [{ n: "1ª · YESO", c: "#f7f4ec" }, { n: "2ª · ENDUIDO", c: "#e7e0cf" }, { n: "3ª · MASILLA", c: "#d7cdb5" }];
  return <>
    <Head tt={tt} kick="CUANDO ABRÍ EN V" title="SALIERON TRES CAPAS" />
    <Wall x={240} y={260} w={560} h={640}><div style={{ position: "absolute", left: 250, top: 0, width: 60, height: 640, background: "linear-gradient(90deg,#3a2c1e,#0a0806 50%,#3a2c1e)" }} /></Wall>
    {L.map((q, i) => { const s = phys(tt, 0.8 + i * 1.0, 5, 0.5), x = 520 + cl(s) * (460 + i * 60), y = 380 + i * 150 + cl(s) * 30, r = cl(s) * (i % 2 ? 14 : -10);
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x, top: y, width: 300, height: 110, borderRadius: "14px 40px 18px 30px", background: q.c, transform: `rotate(${r}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.5)", clipPath: "polygon(0 12%, 30% 0, 70% 6%, 100% 0, 96% 80%, 60% 100%, 20% 90%, 3% 100%)" }} />
        <Tag tt={tt} at={1.1 + i * 1.0} x={x + 340} y={y + 55} txt={q.n} col={i === 2 ? AMB : TX} size={34} anchor="l" />
      </React.Fragment>; })}
    <Tag tt={tt} at={4.4} x={1240} y={930} txt="SE SALÍAN CON LA UÑA · ESTABAN APOYADAS" col={RED} size={38} />
  </>;
}}</Stage>;

// ---- 17:20 · ¿SUENA HUECO?: el mango golpea; donde está pegado las ondas son cortas; donde está hueco retumban y se ve el vacío detrás ----
export const HHollow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k1 = tt > 0.8 ? cl(1 - (tt - 0.8) / 0.8) : 0, k2 = tt > 2.6 ? cl(1 - (tt - 2.6) / 1.8) : 0, rv = eio(tt, 3.2, 4.4);
  const Waves = ({ x, k, big }: { x: number; k: number; big?: boolean }) => <>{[0, 1, 2].map((i) => { const r = 40 + (1 - k) * (big ? 260 : 90) + i * 30; return <div key={i} style={{ position: "absolute", left: x - r, top: 520 - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `4px solid ${big ? AMB : ICE}`, opacity: k * (1 - i * 0.3) }} />; })}</>;
  return <>
    <Head tt={tt} kick="UNA REGLA DE ORO" title="¿SUENA A LATA?" />
    <Section x={260} y={300} w={1400} h={460}>
      {/* el hueco detrás del revoque, del lado derecho */}
      <div style={{ position: "absolute", left: 820, top: 150, width: 460, height: 40, background: "#0a0806", opacity: rv, borderRadius: 20 }} />
    </Section>
    <Waves x={620} k={k1} />
    <Waves x={1300} k={k2} big />
    <div style={{ position: "absolute", left: 1300 - 20, top: 520 - 230 + 40 * Math.max(0, Math.sin((tt - 2.4) * 10)) * (tt > 2.2 && tt < 2.8 ? 1 : 0), width: 40, height: 200, borderRadius: 14, background: "linear-gradient(90deg,#c8402a,#ff6a4a,#c8402a)", opacity: cl((tt - 1.9) * 3) }} />
    <div style={{ position: "absolute", left: 620 - 20, top: 290 + 40 * Math.max(0, Math.sin((tt - 0.6) * 10)) * (tt > 0.4 && tt < 1.0 ? 1 : 0), width: 40, height: 200, borderRadius: 14, background: "linear-gradient(90deg,#c8402a,#ff6a4a,#c8402a)", opacity: cl(tt * 3) * (1 - cl((tt - 1.9) * 3)) }} />
    <Tag tt={tt} at={1.2} x={620} y={830} txt="PEGADO · SUENA SECO" col={ICE} size={34} />
    <Tag tt={tt} at={3.2} x={1300} y={830} txt="HUECO · SE DESPEGÓ DEL LADRILLO" col={AMB} size={34} />
    <Tag tt={tt} at={4.6} x={960} y={950} txt="ESO YA ES OTRO ARREGLO" col={TX} size={42} />
  </>;
}}</Stage>;

// ---- 17:50 · EL POLVO, ENEMIGO Nº 1: la masilla se pega al polvo y el polvo no está pegado a nada (sale entera como una calcomanía) ----
export const HDust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse at 50% 45%, #2a2419, #070605 80%)">{(tt) => {
  const put = eio(tt, 0.5, 1.4), peel = eio(tt, 2.2, 3.6), clean = eio(tt, 4.0, 4.8);
  return <>
    <Head tt={tt} kick="PUNTO 6 · LIMPIAR" title="EL POLVO ES EL ENEMIGO" />
    <Section x={360} y={330} w={1200} h={440}>
      {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + (i * 97) % 1120, top: 4 + (i * 13) % 20, width: 6, height: 6, borderRadius: 3, background: "#9b9282", opacity: (1 - clean) * (1 - peel * (i % 2)) }} />)}
      <div style={{ position: "absolute", left: 300, top: -6 - peel * 120, width: 600, height: 34, borderRadius: 10, background: "linear-gradient(#f4f1ea,#d9d3c6)", transform: `rotate(${-8 * peel}deg)`, transformOrigin: "0 100%", opacity: put * (1 - clean) }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -4, height: 8, backgroundImage: "radial-gradient(#9b9282 2px, transparent 2.5px)", backgroundSize: "12px 8px", opacity: peel }} />
      </div>
    </Section>
    <Tag tt={tt} at={2.6} x={1640} y={380} txt="SALE CON EL POLVO PEGADO" col={RED} size={32} />
    <Tag tt={tt} at={4.2} x={960} y={880} txt="PINCEL SECO · ASPIRADORA · TRAPO APENAS HÚMEDO" col={GRN} size={36} />
    <Tag tt={tt} at={5.0} x={960} y={950} txt="NUNCA SOPLAR CON LA BOCA" col={DIM} size={30} />
  </>;
}}</Stage>;

// ---- 18:50 · EL FIJADOR: los granitos sueltos que se pegan entre sí y la absorción pareja (sin fijador, la mancha opaca de la grieta fantasma) ----
export const HFijador: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 45%, #1f2620, #060806 80%)">{(tt) => {
  const glue = eio(tt, 0.8, 2.2), ghost = eio(tt, 3.2, 4.4);
  return <>
    <Head tt={tt} kick="EL PASO QUE TODOS SE SALTEAN" title="EL FIJADOR HACE DOS COSAS" col={GRN} />
    {/* 1 · consolida: granitos sueltos que se juntan */}
    <div style={{ position: "absolute", left: 220, top: 280, width: 680, height: 480, borderRadius: 24, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)" }}>
      {Array.from({ length: 70 }, (_, i) => { const x0 = 40 + (i * 89) % 600, y0 = 60 + (i * 53) % 360, j = (1 - glue) * 16; return <div key={i} style={{ position: "absolute", left: x0 + Math.sin(tt * 6 + i) * j, top: y0 + Math.cos(tt * 5 + i) * j, width: 22, height: 22, borderRadius: 7, background: "#cfc6b2", boxShadow: glue > 0.5 ? `0 0 0 ${4 * glue}px rgba(240,240,255,.25)` : "none" }} />; })}
      <div style={{ position: "absolute", left: 30, bottom: 24, fontWeight: 900, fontSize: 34, color: GRN, opacity: glue }}>1 · PEGA LOS GRANITOS</div>
    </div>
    {/* 2 · iguala la absorción: sin él, la franja opaca */}
    <Wall x={1020} y={280} w={680} h={480}>
      <div style={{ position: "absolute", left: 300, top: 0, width: 80, height: 480, background: "rgba(0,0,0,.14)", opacity: ghost, filter: "blur(6px)" }} />
      <div style={{ position: "absolute", left: 30, bottom: 24, fontWeight: 900, fontSize: 34, color: AMB, opacity: cl(eio(tt, 2.6, 3.2)) }}>2 · IGUALA LA ABSORCIÓN</div>
    </Wall>
    <Tag tt={tt} at={4.4} x={1360} y={830} txt="SIN FIJADOR: LA GRIETA FANTASMA" col={RED} size={32} />
    <Tag tt={tt} at={5.2} x={960} y={950} txt="1 DE FIJADOR : 3-4 DE AGUA" col={TX} size={40} />
  </>;
}}</Stage>;

export { Check, Cross, Pill };
