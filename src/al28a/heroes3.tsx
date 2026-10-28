// componentes únicos de al28a · 31-44 (minutos 20-32): sellador elástico, malla, enduido y lija, pintura, los cuatro testigos, el ingeniero y los comentarios.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Check, CrackSvg, Cross, Pill, Wall } from "./heroes1";

// ---- 20:00 · LA GOMA QUE ACOMPAÑA: la junta se abre y se cierra; el relleno elástico se estira como una goma y no se despega ----
export const HRubber: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 45%, #1c2420, #050706 80%)">{(tt) => {
  const mv = tt > 0.8 ? Math.sin((tt - 0.8) * 2.2) : 0, g = 70 + 46 * mv;
  return <>
    <Head tt={tt} kick="PUNTO 7 · EL CORAZÓN DEL ARREGLO" title="UN RELLENO QUE ACOMPAÑA" col={GRN} />
    <Wall x={960 - 700 - g / 2} y={300} w={700} h={480} />
    <Wall x={960 + g / 2} y={300} w={700} h={480} />
    {/* el sellador: cintura que se afina al estirarse */}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M${960 - g / 2} 300 C ${960 - g / 2 + 10 + 8 * mv} 540, ${960 - g / 2 + 10 + 8 * mv} 540, ${960 - g / 2} 780 L ${960 + g / 2} 780 C ${960 + g / 2 - 10 - 8 * mv} 540, ${960 + g / 2 - 10 - 8 * mv} 540, ${960 + g / 2} 300 Z`} fill="#f3f0ea" />
      <path d={`M${960 - g / 2} 300 C ${960 - g / 2 + 10 + 8 * mv} 540, ${960 - g / 2 + 10 + 8 * mv} 540, ${960 - g / 2} 780`} stroke={GRN} strokeWidth={4} fill="none" opacity={0.6} />
      <path d={`M${960 + g / 2} 300 C ${960 + g / 2 - 10 - 8 * mv} 540, ${960 + g / 2 - 10 - 8 * mv} 540, ${960 + g / 2} 780`} stroke={GRN} strokeWidth={4} fill="none" opacity={0.6} />
    </svg>
    <Tag tt={tt} at={1.4} x={960} y={250} txt={mv > 0 ? "LA PARED SE ESTIRA → ÉL TAMBIÉN" : "LA PARED SE ENCOGE → VUELVE"} col={mv > 0 ? AMB : ICE} size={36} />
    <Tag tt={tt} at={3.4} x={960} y={860} txt="SECO QUEDA COMO UNA GOMA FIRME · CEDE UN POQUITO" col={TX} size={34} />
    <Tag tt={tt} at={4.6} x={960} y={930} txt="ACRÍLICO AL AGUA · SE PINTA ENCIMA" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- 20:15 · EN EL MOSTRADOR: el ticket de la ferretería se imprime con las palabras exactas ----
export const HCounter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 40%, #2c2418, #080604 80%)">{(tt) => {
  const L = ["MASILLA ELÁSTICA", "ACRÍLICA", "PARA FISURAS", "INTERIOR · PINTABLE", "(AFUERA: LA DE EXTERIOR)"];
  const pr = eio(tt, 0.4, 3.8);
  return <>
    <Head tt={tt} kick="EN LA FERRETERÍA PIDES ASÍ" title="LAS PALABRAS EXACTAS" />
    <div style={{ position: "absolute", left: 960 - 330, top: 210, width: 660, height: 60, borderRadius: 14, background: "linear-gradient(#3a3a40,#1c1c20)", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 960 - 280, top: 250, width: 560, height: 700 * pr, overflow: "hidden", background: "linear-gradient(#fbf9f3,#efeadf)", boxShadow: "0 30px 70px rgba(0,0,0,.6)", clipPath: "polygon(0 0,100% 0,100% 100%, 95% 98%, 90% 100%, 85% 98%, 80% 100%, 75% 98%, 70% 100%, 65% 98%, 60% 100%, 55% 98%, 50% 100%, 45% 98%, 40% 100%, 35% 98%, 30% 100%, 25% 98%, 20% 100%, 15% 98%, 10% 100%, 5% 98%, 0 100%)" }}>
      <div style={{ padding: "40px 46px", fontFamily: "monospace", color: "#2a2620" }}>
        <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 4, textAlign: "center" }}>FERRETERÍA</div>
        <div style={{ borderTop: "3px dashed #8a8270", margin: "22px 0" }} />
        {L.map((x, i) => <div key={i} style={{ fontWeight: 800, fontSize: i === 4 ? 26 : 38, margin: "14px 0", color: i === 4 ? "#7a705e" : "#2a2620", opacity: cl((tt - 0.8 - i * 0.6) * 3) }}>{x}</div>)}
      </div>
    </div>
    <Cross x={1530} y={520} s={100} p={eio(tt, 4.0, 4.8)} />
    <Tag tt={tt} at={4.2} x={1530} y={620} txt="SILICONA: NO" col={RED} size={36} />
    <Tag tt={tt} at={4.8} x={1530} y={670} txt="LA PINTURA NO AGARRA" col={DIM} size={28} />
  </>;
}}</Stage>;

// ---- 21:00 · LA PISTOLA: la punta en diagonal, de abajo hacia arriba, empujando hacia adentro (sin aire) ----
export const HGun: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const run = eio(tt, 0.8, 4.4), y = 860 - 560 * run;
  return <>
    <Head tt={tt} kick="EN CARTUCHO" title="DE ABAJO HACIA ARRIBA" />
    <Wall x={560} y={240} w={500} h={700}>
      <div style={{ position: "absolute", left: 220, top: 40, width: 60, height: 620, background: "linear-gradient(90deg,#3a2c1e,#0a0806 50%,#3a2c1e)", clipPath: "polygon(0 0,100% 0,60% 100%,40% 100%)" }} />
      <div style={{ position: "absolute", left: 220, top: 40 + 620 * (1 - run), width: 60, height: 620 * run, background: "linear-gradient(90deg,#e9e5dc,#ffffff 50%,#e2ddd2)", clipPath: "polygon(0 0,100% 0,60% 100%,40% 100%)" }} />
    </Wall>
    {/* la pistola (el pico entra en la V) */}
    <div style={{ position: "absolute", left: 830, top: y - 40, width: 560, height: 90, transform: "rotate(-14deg)", transformOrigin: "0 50%" }}>
      <div style={{ position: "absolute", left: 0, top: 30, width: 90, height: 30, background: "#f2efe8", clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 60%)" }} />
      <div style={{ position: "absolute", left: 88, top: 8, width: 300, height: 74, borderRadius: 12, background: "linear-gradient(#ffffff,#d9d4c8)" }} />
      <div style={{ position: "absolute", left: 380, top: 0, width: 180, height: 90, borderRadius: 10, background: "linear-gradient(#c8402a,#8a2a1a)" }} />
    </div>
    {/* las flechitas: empujar hacia adentro */}
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 760 - 30 * i - ((tt * 60) % 30), top: y - 10, width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderRight: `22px solid ${AMB}`, opacity: 0.8 - i * 0.25 }} />)}
    <Tag tt={tt} at={0.6} x={1460} y={360} txt="PUNTA CHIQUITA" col={TX} size={32} anchor="l" />
    <Tag tt={tt} at={2.0} x={1460} y={430} txt="APRETAR PAREJO" col={TX} size={32} anchor="l" />
    <Tag tt={tt} at={3.2} x={1460} y={500} txt="EL PICO HACIA ADENTRO" col={AMB} size={32} anchor="l" />
    <Tag tt={tt} at={4.4} x={1560} y={570} txt="QUE NO QUEDE AIRE" col={GRN} size={32} anchor="l" />
  </>;
}}</Stage>;

// ---- 21:20 · EL CANALITO: muy grueso se encoge al secar; por eso dos pasadas (mitad y al ras) ----
export const HShrink: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 45%, #22201a, #070605 80%)">{(tt) => {
  const dry = eio(tt, 0.6, 2.2), p1 = eio(tt, 2.8, 3.6), p2 = eio(tt, 4.0, 4.8);
  const V = (x: number, top: number, sag: number, ok?: boolean) => <svg width={520} height={420} style={{ position: "absolute", left: x, top: 340 }}>
    <rect x={0} y={0} width={520} height={420} fill="#cfc5b0" rx={12} />
    <path d="M160 0 L260 380 L360 0 Z" fill="#0a0806" />
    <path d={`M${160 + 100 * top / 380} ${top} Q 260 ${top + sag} ${360 - 100 * top / 380} ${top} L260 380 Z`} fill="#f3f0ea" />
    {ok !== undefined && <rect x={0} y={0} width={520} height={6} fill={ok ? GRN : RED} />}
  </svg>;
  return <>
    <Head tt={tt} kick="SI LA GRIETA ES MUY HONDA" title="DOS PASADAS, NO UNA" />
    {V(300, 0, 46 * dry, false)}
    <Tag tt={tt} at={1.8} x={560} y={830} txt="UNA SOLA, GRUESA: QUEDA UN CANALITO" col={RED} size={30} />
    {V(1100, 190 * (1 - p2) * cl(p1 * 3), 0, true)}
    <Tag tt={tt} at={3.0} x={1360} y={830} txt={p2 > 0.5 ? "2ª · AL RAS" : "1ª · HASTA LA MITAD · SECAR"} col={GRN} size={30} />
  </>;
}}</Stage>;

// ---- 22:25 · EL YESO DE UN BRAZO: la fuerza que pasaba toda por la línea se reparte en 10 cm de malla ----
export const HCast: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse at 50% 45%, #1a2028, #050608 80%)">{(tt) => {
  const mesh = eio(tt, 2.0, 3.2);
  const arrows = (spread: number) => Array.from({ length: 9 }, (_, i) => { const dy = (i - 4) * 46 * spread; return <path key={i} d={`M700 ${540 + dy} L900 ${540 + dy * 0.3}`} stroke={spread < 0.5 ? RED : GRN} strokeWidth={8 - 4 * spread} strokeLinecap="round" opacity={0.85} />; });
  return <>
    <Head tt={tt} kick="PUNTO 8 · LA MALLA DE FIBRA" title="COMO EL YESO EN UN BRAZO" />
    <Wall x={600} y={250} w={720} h={580}>
      <CrackSvg d="M360 0 L372 190 L350 380 L366 580" p={1} w={6} W={720} Hh={580} />
      <div style={{ position: "absolute", left: 360 - 140, top: 0, width: 280, height: 580, opacity: 0.85 * mesh, backgroundImage: "linear-gradient(rgba(255,255,255,.9) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.9) 2px, transparent 2px)", backgroundSize: "18px 18px", transform: `scaleX(${mesh})` }} />
    </Wall>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{arrows(eio(tt, 2.4, 3.6))}</svg>
    <Tag tt={tt} at={0.6} x={300} y={250} txt="SIN MALLA" col={RED} size={34} />
    <Tag tt={tt} at={1.0} x={300} y={295} txt="TODA LA FUERZA EN EL CORTE" col={DIM} size={26} />
    <Tag tt={tt} at={3.4} x={1560} y={430} txt="CON MALLA" col={GRN} size={34} />
    <Tag tt={tt} at={3.8} x={1560} y={480} txt="SE REPARTE EN 10 CM" col={DIM} size={26} />
    <Tag tt={tt} at={4.6} x={960} y={930} txt="AFUERA · ESQUINAS · GRIETAS DE +½ METRO" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 23:05 · LA MALLA EN DIAGONAL: en la esquina de la ventana la cinta cruza la grieta en ángulo, contra la fuerza que sale del vértice ----
export const HDiagMesh: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 45%, #232018, #070605 80%)">{(tt) => {
  const f = eio(tt, 0.6, 1.8), m = eio(tt, 2.2, 3.4);
  return <>
    <Head tt={tt} kick="UN DETALLE DE ALBAÑIL VIEJO" title="LA MALLA EN DIAGONAL" />
    <Wall x={400} y={230} w={1120} h={700}>
      <div style={{ position: "absolute", left: 200, top: 330, width: 420, height: 370, background: "linear-gradient(#5d88a8,#a9cbe2)", border: "14px solid #6a4a32" }} />
      <CrackSvg d="M634 330 L670 290 L686 250 L722 214 L740 170" p={1} w={6} W={1120} Hh={700} />
      <svg width={1120} height={700} style={{ position: "absolute", inset: 0 }}>
        <path d="M634 330 L800 160" stroke={RED} strokeWidth={10} strokeLinecap="round" strokeDasharray={240} strokeDashoffset={240 * (1 - f)} />
        <path d="M800 160 L780 196 M800 160 L764 176" stroke={RED} strokeWidth={10} strokeLinecap="round" opacity={f} />
      </svg>
      <div style={{ position: "absolute", left: 560, top: 200, width: 320, height: 90, transform: `rotate(45deg) scaleX(${m})`, transformOrigin: "50% 50%", opacity: 0.9, backgroundImage: "linear-gradient(rgba(255,255,255,.95) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.95) 2px, transparent 2px)", backgroundSize: "16px 16px", backgroundColor: "rgba(255,255,255,.15)" }} />
    </Wall>
    <Tag tt={tt} at={1.4} x={1500} y={300} txt="SALE DEL VÉRTICE" col={RED} size={30} />
    <Tag tt={tt} at={3.0} x={1640} y={430} txt="LA MALLA LA CRUZA" col={GRN} size={30} />
    <Tag tt={tt} at={4.2} x={960} y={985} txt="Y ESA GRIETA NO VUELVE MÁS" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 23:50 · DESVANECIDO: franja angosta que se nota con luz rasante contra una mano ancha que se pierde en la pared ----
export const HFeather: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 45%, #23211b, #070605 80%)">{(tt) => {
  const L = eio(tt, 0.6, 1.6), R = eio(tt, 2.2, 3.6);
  return <>
    <Head tt={tt} kick="PUNTO 9 · EL ENDUIDO" title="ANCHO Y DESVANECIDO" />
    <Wall x={200} y={290} w={700} h={560}>
      <div style={{ position: "absolute", left: 320, top: 0, width: 60, height: 560 * L, background: "#f3efe6", boxShadow: "-10px 0 14px rgba(0,0,0,.28), 6px 0 6px rgba(255,255,255,.4)" }} />
    </Wall>
    <Wall x={1020} y={290} w={700} h={560}>
      <div style={{ position: "absolute", left: 350 - 250 * R, top: 0, width: 500 * R, height: 560, background: "linear-gradient(90deg, transparent, rgba(243,239,230,.9) 30%, rgba(243,239,230,.9) 70%, transparent)" }} />
    </Wall>
    <Cross x={550} y={920} s={80} p={eio(tt, 1.6, 2.4)} />
    <Tag tt={tt} at={1.8} x={550} y={1000} txt="SÓLO SOBRE LA LÍNEA: SE NOTA" col={RED} size={28} />
    <Check x={1370} y={920} s={80} p={eio(tt, 3.6, 4.4)} />
    <Tag tt={tt} at={3.8} x={1370} y={1000} txt="20-30 CM · MENOS PRESIÓN HACIA AFUERA" col={GRN} size={28} />
  </>;
}}</Stage>;

// ---- 24:40 · LA LINTERNA RASANTE: el cuarto se apaga, la linterna apoyada de costado barre la pared y muestra cada pocito ----
export const HTorch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="#040404">{(tt) => {
  const sw = eio(tt, 0.8, 4.2), fix = eio(tt, 4.4, 5.4);
  const bumps = Array.from({ length: 16 }, (_, i) => [300 + (i * 173) % 1300, 320 + (i * 97) % 480] as const);
  return <>
    <Head tt={tt} kick="UN TRUCO PARA SABER SI QUEDÓ BIEN" title="LA LINTERNA DE COSTADO" />
    <div style={{ position: "absolute", left: 220, top: 260, width: 1480, height: 640, borderRadius: 10, background: `linear-gradient(90deg, rgba(255,236,200,.65), rgba(255,236,200,.16) ${20 + 60 * sw}%, rgba(20,18,16,.9) ${30 + 70 * sw}%)` }}>
      {bumps.map(([x, y], i) => { const lit = cl((sw * 1700 - (x - 220)) / 200); return <div key={i} style={{ position: "absolute", left: x - 220, top: y - 260, width: 40, height: 22, borderRadius: "50%", background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,.5), rgba(0,0,0,.55) 70%)", opacity: lit * (1 - fix) }} />; })}
    </div>
    <div style={{ position: "absolute", left: 150, top: 540, width: 120, height: 60, borderRadius: 12, background: "linear-gradient(#3a3a40,#1a1a1e)" }} />
    <div style={{ position: "absolute", left: 262, top: 548, width: 18, height: 44, borderRadius: 4, background: "#fff6d8", boxShadow: "0 0 30px #ffe8a8" }} />
    <Tag tt={tt} at={2.0} x={960} y={950} txt={fix > 0.5 ? "LIJA 220 Y OTRA MANO FINITA · HASTA QUE NO SE VEA" : "CADA POCITO · CADA BORDE · CADA ONDITA"} col={fix > 0.5 ? GRN : AMB} size={36} />
  </>;
}}</Stage>;

// ---- 25:35 · CARGA CONTRA RESINA: dos baldes en corte; el barato es casi todo polvo blanco (tiza); el bueno, resina que se estira ----
export const HChalk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 45%, #22201c, #070606 80%)">{(tt) => {
  const f = eio(tt, 0.6, 2.4), st = eio(tt, 3.4, 4.8);
  const Bucket = ({ x, carga, lbl, c }: { x: number; carga: number; lbl: string; c: string }) => <div style={{ position: "absolute", left: x, top: 330, width: 440, height: 480 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "16px 16px 60px 60px", background: "rgba(255,255,255,.06)", border: "4px solid rgba(255,255,255,.3)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 420 * carga * f, background: "repeating-radial-gradient(circle at 30% 30%, #f4f2ec 0 4px, #dedad0 4px 7px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 420 * carga * f, height: 420 * (1 - carga) * f, background: "linear-gradient(#9fd8c0cc,#5fb894cc)" }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontWeight: 900, fontSize: 34, color: c }}>{lbl}</div>
  </div>;
  return <>
    <Head tt={tt} kick="PUNTO 10 · LA PINTURA" title="MUCHA CARGA, POCA RESINA" />
    <Bucket x={330} carga={0.82} lbl="LÁTEX BARATO" c={RED} />
    <Bucket x={1150} carga={0.38} lbl="BUEN LÁTEX · ELASTOMÉRICA" c={GRN} />
    <Tag tt={tt} at={2.4} x={1650} y={420} txt="RESINA" col={GRN} size={32} anchor="l" />
    <Tag tt={tt} at={2.4} x={1650} y={700} txt="CARGA" col={DIM} size={32} anchor="l" />
    {/* la película: la barata se raja, la buena se estira */}
    <div style={{ position: "absolute", left: 330, top: 940, width: 440 * (1 + 0.1 * st), height: 14, borderRadius: 7, background: "#f4f2ec", clipPath: st > 0.5 ? "polygon(0 0,48% 0,47% 100%,0 100%,0 0,52% 0,100% 0,100% 100%,53% 100%)" : undefined, opacity: st }} />
    <div style={{ position: "absolute", left: 1150, top: 940, width: 440 * (1 + 0.25 * st), height: 14 - 5 * st, borderRadius: 7, background: "#9fd8c0", opacity: st }} />
  </>;
}}</Stage>;

// ---- 26:25 · DOS MANOS, EL PAÑO ENTERO: el rodillo pinta de esquina a esquina; un parchecito se notaría ----
export const HTwoCoats: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const c1 = eio(tt, 0.4, 2.2), c2 = eio(tt, 2.6, 4.4);
  return <>
    <Head tt={tt} kick="DOS MANOS, NO UNA" title="EL PAÑO COMPLETO" />
    <Wall x={260} y={250} w={1400} h={640} col="#d9cfb9">
      <div style={{ position: "absolute", left: 0, top: 0, width: `${100 * c1}%`, height: "100%", background: "rgba(240,234,220,.75)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: `${100 * c2}%`, height: "100%", background: "rgba(246,242,232,.95)" }} />
      <div style={{ position: "absolute", left: `${100 * (c2 > 0 ? c2 : c1)}%`, top: 0, width: 70, height: "100%", marginLeft: -35, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent)" }} />
    </Wall>
    <div style={{ position: "absolute", left: 260 + 1400 * (c2 > 0 ? c2 : c1) - 60, top: 470 + 120 * Math.sin(tt * 3), width: 120, height: 200, borderRadius: 18, background: "linear-gradient(90deg,#c9c0ad,#f5f1e8,#c9c0ad)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    <Tag tt={tt} at={0.8} x={500} y={950} txt="1ª · UN POQUITO DILUIDA" col={TX} size={32} />
    <Tag tt={tt} at={3.0} x={960} y={950} txt="2ª · PURA" col={GRN} size={32} />
    <Tag tt={tt} at={4.4} x={1420} y={950} txt="DE ESQUINA A ESQUINA" col={AMB} size={32} />
  </>;
}}</Stage>;

// ---- 27:05 · LOS CUATRO TESTIGOS: cuatro tarjetas de la casa; tres quedan enteras, la del dormitorio se parte a los 9 días ----
export const HTestigos4: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 45%, #1e2420, #050706 80%)">{(tt) => {
  const R = [{ n: "PASILLO", v: "ENTERO · 4 SEMANAS", ok: true }, { n: "COCINA", v: "ENTERO · BAJO LA LOSA", ok: true }, { n: "LIVING", v: "ENTERO", ok: true }, { n: "DORMITORIO", v: "PARTIDO · 9 DÍAS", ok: false }];
  return <>
    <Head tt={tt} kick="LO QUE PASÓ CON CADA UNO" title="LOS CUATRO TESTIGOS" />
    {R.map((q, i) => { const s = phys(tt, 0.4 + i * 0.9, 6, 0.5), x = 150 + i * 430, sp = q.ok ? 0 : eio(tt, 3.6, 4.6);
      return <div key={i} style={{ position: "absolute", left: x, top: 290, width: 370, transform: `translateY(${(1 - cl(s)) * 160}px)`, opacity: cl(s * 2) }}>
        <Wall x={0} y={0} w={370} h={420}><CrackSvg d="M185 0 L196 140 L178 280 L190 420" p={1} w={q.ok ? 4 : 4 + 8 * sp} W={370} Hh={420} /><Pill x={188} y={210} r={80} crack={sp} open={sp * 0.6} /></Wall>
        <div style={{ marginTop: 440, fontWeight: 900, fontSize: 36, textAlign: "center" }}>{q.n}</div>
        <div style={{ marginTop: 6, fontWeight: 800, fontSize: 26, textAlign: "center", color: q.ok ? GRN : RED }}>{q.v}</div>
      </div>; })}
  </>;
}}</Stage>;

// ---- 28:00 · EL CASO DEL DORMITORIO: la línea de tiempo de la grieta diagonal, del testigo partido a la grieta tapada ----
export const HEngineer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse at 50% 45%, #1a1e26, #050608 80%)">{(tt) => {
  const S = [["DÍA 9", "EL TESTIGO SE PARTE", RED], ["DÍA 20", "LA RAYITA SE ABRE", RED], ["EL INGENIERO", "VA DERECHO A LA ESQUINA", ICE], ["LA CANALETA", "ROTA HACE 2 INVIERNOS", AMB], ["VEREDA PERIMETRAL", "EL AGUA ESCURRE LEJOS", GRN], ["UN VERANO", "LA TIERRA SE SECA", GRN], ["OTRO TESTIGO", "ENTERO → SE TAPÓ", GRN]] as const;
  const p = eio(tt, 0.4, 6.0);
  return <>
    <Head tt={tt} kick="LA GRIETA DEL DORMITORIO" title="CÓMO TERMINÓ" />
    <div style={{ position: "absolute", left: 160, top: 560, width: 1600 * p, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${RED}, ${AMB} 45%, ${GRN})` }} />
    {S.map(([a, b, c], i) => { const x = 160 + i * (1600 / 6), on = phys(tt, 0.4 + i * (5.6 / 7), 7, 0.5), up = i % 2 === 0;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x - 18, top: 545, width: 36, height: 36, borderRadius: 18, background: c, boxShadow: `0 0 24px ${c}`, transform: `scale(${cl(on)})` }} />
        <div style={{ position: "absolute", left: x - 140, top: up ? 330 : 620, width: 280, textAlign: "center", opacity: cl(on * 2), transform: `translateY(${(1 - cl(on)) * (up ? -30 : 30)}px)` }}>
          <div style={{ fontWeight: 900, fontSize: 32, color: c }}>{a}</div>
          <div style={{ fontWeight: 700, fontSize: 24, color: DIM, marginTop: 8 }}>{b}</div>
        </div>
      </React.Fragment>; })}
    <Tag tt={tt} at={6.2} x={960} y={930} txt="SI LA TAPABA ESE INVIERNO, SE ENTERABA TARDE" col={TX} size={38} />
  </>;
}}</Stage>;

// ---- 29:45 · USTEDES ME ESCRIBIERON: las tarjetas de los comentarios caen una sobre otra, con la respuesta de Claudio a mano ----
export const HComments: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 40%, #1d1d26, #06060a 80%)">{(tt) => {
  const C = [{ n: "UN SUSCRIPTOR", q: "La tapé dos veces con enduido y volvió.", a: "Ábrela en V + elástico + malla" }, { n: "OTRA PERSONA", q: "¿Puedo usar silicona?", a: "No: la pintura no se pega" }, { n: "UN SEÑOR", q: "Una diagonal en el garaje que crece.", a: "No la toques: testigo y profesional" }];
  return <>
    <Head tt={tt} kick="LO QUE ME ESCRIBIERON" title="TUS COMENTARIOS" />
    {C.map((c, i) => { const s = phys(tt, 0.5 + i * 1.6, 6, 0.5), x = 260 + i * 470, r = (i - 1) * 3;
      return <div key={i} style={{ position: "absolute", left: x, top: 300 + (1 - cl(s)) * -200, width: 430, padding: "34px 36px", borderRadius: 26, background: "linear-gradient(160deg,#2a2a34,#17171d)", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", transform: `rotate(${r}deg)`, opacity: cl(s * 2) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}><div style={{ width: 58, height: 58, borderRadius: 29, background: `linear-gradient(135deg, ${[AMB, ICE, GRN][i]}, #444)` }} /><div style={{ fontWeight: 900, fontSize: 26, letterSpacing: 2, color: DIM }}>{c.n}</div></div>
        <div style={{ fontWeight: 700, fontSize: 34, marginTop: 22, lineHeight: 1.25 }}>«{c.q}»</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, marginTop: 24, color: AMB, opacity: cl((tt - 1.3 - i * 1.6) * 2) }}>{c.a}</div>
      </div>; })}
  </>;
}}</Stage>;

export { Check, Cross };
