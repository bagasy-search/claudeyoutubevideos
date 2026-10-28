// componentes únicos de al28c · B: minutos 15-28 (la jeringa, sacarlo, la caja del garaje, limpiar y el doble encolado).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Check, Cross } from "./heroes1";
import { Arrow, Tile, rnd } from "./heroesA";

// ---- 15:34 · LA JERINGA DE 20 ML: el émbolo baja y la marca se queda en ~6 ml: "entra mucho menos de lo que piensas" ----
export const HSyringe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const push = eio(tt, 1.2, 4.4) * 0.3, X = 420, W = 1000;
  return <>
    <Head tt={tt} kick="EN UN AZULEJO DE 15 X 15" title="ENTRA MUCHO MENOS" />
    <div style={{ position: "absolute", left: X, top: 470, width: W, height: 150, borderRadius: 30, background: "rgba(220,240,255,.14)", border: "4px solid rgba(230,245,255,.7)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: W * push, right: 0, top: 0, bottom: 0, background: "linear-gradient(180deg, #f3be5a, #c8862a)" }} />
      {Array.from({ length: 21 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i / 20) * W, top: 0, width: 3, height: i % 5 ? 30 : 56, background: "rgba(255,255,255,.7)" }} />)}
    </div>
    <div style={{ position: "absolute", left: X - 220 + W * push, top: 515, width: 260, height: 60, borderRadius: 10, background: "#dfe3e6" }} />
    <div style={{ position: "absolute", left: X - 260 + W * push, top: 450, width: 40, height: 190, borderRadius: 10, background: "#dfe3e6" }} />
    <div style={{ position: "absolute", left: X + W, top: 530, width: 120, height: 30, borderRadius: "0 15px 15px 0", background: "rgba(230,245,255,.6)" }} />
    {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: X, top: 680, width: W, textAlign: "left", paddingLeft: (i / 4) * W - 20, fontWeight: 800, fontSize: 26, color: DIM }}>{20 - i * 5}</div>)}
    <div style={{ position: "absolute", left: X + W * push, top: 400, transform: "translateX(-50%)", fontWeight: 900, fontSize: 50, color: AMB, opacity: cl(tt - 4) }}>~6 ML</div>
    <Tag tt={tt} at={4.8} x={960} y={860} txt="EMPUJA DESPACIO HASTA QUE ASOME ARRIBA" col={TX} size={36} />
  </>;
}}</Stage>;

// ---- 16:17 · EL PUNTAL: tablita + trapo + palo de escoba en diagonal contra la mesada, con flechas de fuerza ----
export const HBrace: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const b = phys(tt, 0.8, 6, 0.5), s = phys(tt, 2.2, 5, 0.5), f = cl((tt - 3.6) / 0.8);
  return <>
    <Head tt={tt} kick="24 HORAS APRETADO" title="TABLITA Y PALO DE ESCOBA" />
    <div style={{ position: "absolute", left: 360, top: 240, width: 40, height: 640, background: "#e9e2d2", boxShadow: "inset -10px 0 20px rgba(0,0,0,.2)" }} />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 400, top: 250 + i * 150, width: 26, height: 144, background: "#f1ead8", borderRadius: 3 }} />)}
    <div style={{ position: "absolute", left: 426, top: 400, width: 16, height: 150, background: "#d8d2c4", opacity: b }} />
    <div style={{ position: "absolute", left: 442 + (1 - b) * 200, top: 380, width: 40, height: 190, background: "linear-gradient(90deg, #d9a86a, #b9864c)", borderRadius: 4, opacity: cl(b * 2) }} />
    <div style={{ position: "absolute", left: 470, top: 465, width: 1150 * s, height: 26, borderRadius: 13, background: "linear-gradient(180deg, #e2b47a, #a87a44)", transform: "rotate(28deg)", transformOrigin: "0 50%" }} />
    <div style={{ position: "absolute", left: 1350, top: 880, width: 460, height: 60, background: "#6f6a62", borderRadius: 6 }} />
    <Arrow d="M1400 860 L540 480" p={f} col={AMB} w={10} len={950} />
    <Tag tt={tt} at={1.4} x={600} y={330} txt="TRAPO + TABLITA" col={TX} size={30} />
    <Tag tt={tt} at={3} x={1500} y={820} txt="APOYADO EN LA MESADA" col={DIM} size={30} />
    <Tag tt={tt} at={4.2} x={1150} y={440} txt="APRIETA CONTRA LA PARED" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 17:05 · SOSTENIDO POR LAS JUNTAS: corte del azulejo suelto, sin nada atrás; sólo las 4 juntas lo agarran (brillan) ----
export const HHeld: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const g = 0.5 + 0.5 * Math.sin(tt * 3), k = phys(tt, 0.7, 5, 0.6);
  return <>
    <Head tt={tt} kick="EL QUE SE MUEVE" title="LO SOSTIENEN LAS JUNTAS" col={RED} />
    <div style={{ position: "absolute", left: 610, top: 260, width: 700, height: 700, background: "#a59d8b", borderRadius: 8, transform: `scale(${0.85 + 0.15 * k})` }}>
      {Array.from({ length: 9 }, (_, i) => i === 4 ? null : <div key={i} style={{ position: "absolute", left: (i % 3) * 233 + 6, top: Math.floor(i / 3) * 233 + 6, width: 221, height: 221, background: "#f1ead8", borderRadius: 3 }} />)}
      {[[233, 227, 233, 12], [233, 461, 233, 12], [227, 233, 12, 233], [461, 233, 12, 233]].map(([x, y, w, hh], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: hh, background: AMB, boxShadow: `0 0 ${20 + 20 * g}px ${AMB}`, opacity: cl((tt - 1.4 - i * 0.3) * 2) }} />)}
      <div style={{ position: "absolute", left: 239, top: 239, width: 221, height: 221, background: "#f1ead8", borderRadius: 3, transform: `translate(${2 * Math.sin(tt * 9)}px, ${3 * Math.sin(tt * 7)}px)`, boxShadow: "0 0 0 3px rgba(255,90,74,.6)" }} />
    </div>
    <Tag tt={tt} at={3.6} x={1600} y={500} txt="ATRÁS:" col={DIM} size={34} />
    <Tag tt={tt} at={4} x={1600} y={570} txt="NADA" col={RED} size={60} />
    <Tag tt={tt} at={4.8} x={960} y={1010} txt="NO SE INYECTA · SE SACA" col={TX} size={34} />
  </>;
}}</Stage>;

// ---- 18:17 · HACIA DÓNDE VA LA FUERZA: el rascador en la junta; flecha hacia adentro = sí, hacia el costado = esquirla ----
export const HForce: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const ch = cl((tt - 3.4) / 0.5);
  return <>
    <Head tt={tt} kick="EL RASCADOR DE JUNTAS" title="LA FUERZA VA HACIA ADENTRO" />
    <div style={{ position: "absolute", left: 460, top: 300, width: 1000, height: 560, perspective: 1400 }}>
      <div style={{ position: "absolute", inset: 0, transform: "rotateX(52deg)", transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 486, height: 560, background: "#f1ead8" }} />
        <div style={{ position: "absolute", left: 514, top: 0, width: 486, height: 560, background: "#f1ead8" }} />
        <div style={{ position: "absolute", left: 486, top: 0, width: 28, height: 560, background: "#5a554c" }} />
        {ch > 0 && Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 514 + rnd(i) * 40 + ch * 160 * rnd(i + 3), top: 260 + rnd(i + 5) * 60 - ch * 80 * rnd(i + 2), width: 18, height: 12, background: "#fbf6ea", clipPath: "polygon(0 0,100% 30%,70% 100%)", opacity: 1 - cl(ch - 0.6) }} />)}
      </div>
    </div>
    <Arrow d="M960 260 L960 520" p={(tt - 1) * 1.6} col={GRN} w={14} len={300} />
    <Arrow d="M1010 640 L1340 640" p={(tt - 2.8) * 2} col={RED} w={14} len={340} />
    <Check x={880} y={300} s={56} p={cl((tt - 2) * 2)} />
    <Cross x={1380} y={580} s={56} p={cl((tt - 3.6) * 2)} />
    <Tag tt={tt} at={2.2} x={700} y={400} txt="HACIA LA PARED" col={GRN} size={34} />
    <Tag tt={tt} at={3.8} x={1420} y={720} txt="EL FILO SE DESCASCARA" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 19:02 · DE LA MÁS SUAVE A LA MÁS DURA: escalera de herramientas; se prende primero la ventosa ----
export const HGentle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const T: [string, string, string][] = [["VENTOSA", GRN, "1º"], ["ESPÁTULA FINA", AMB, "2º"], ["CORTAFRÍO", RED, "SÓLO SI…"]];
  return <>
    <Head tt={tt} kick="PARA SACARLO SIN ROMPERLO" title="EMPIEZA POR LO MÁS SUAVE" />
    {T.map(([n, c, o], i) => { const k = phys(tt, 0.8 + i * 0.7, 6, 0.5), on = i === 0 ? 0.6 + 0.4 * Math.sin(tt * 3) : 0.25;
      return <div key={i} style={{ position: "absolute", left: 360 + i * 420, top: 720 - i * 140, width: 380, height: 150 + i * 140, borderRadius: 20, background: `linear-gradient(180deg, ${c}${i === 0 ? "55" : "22"}, rgba(0,0,0,.2))`, border: `3px solid ${c}`, opacity: cl(k * 2), transform: `translateY(${(1 - k) * 60}px)`, boxShadow: `0 0 ${50 * on}px ${c}` }}>
        <div style={{ position: "absolute", top: -70, left: 0, right: 0, textAlign: "center", fontWeight: 900, fontSize: 34, color: TX }}>{n}</div>
        <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", fontWeight: 900, fontSize: 40, color: c }}>{o}</div>
      </div>; })}
    <div style={{ position: "absolute", left: 470, top: 740, width: 160, height: 110, opacity: phys(tt, 2.6, 6, 0.5) }}>
      <div style={{ position: "absolute", left: 0, top: 50, width: 160, height: 60, borderRadius: "80px 80px 10px 10px", background: "radial-gradient(circle at 50% 80%, #ff6b5a, #c22a1a)" }} />
      <div style={{ position: "absolute", left: 66, top: 0, width: 28, height: 60, borderRadius: 8, background: "#222" }} />
    </div>
  </>;
}}</Stage>;

// ---- 20:04 · COMO LA TAPA DE UNA LATA: palanca con punto de apoyo en la PARED (no en el vecino), de a milímetros ----
export const HLid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const a = Math.min(4, eio(tt, 1, 2.5) * 2 + eio(tt, 3, 4.4) * 2), up = a * 5;
  return <>
    <Head tt={tt} kick="LA ESPÁTULA FINA" title="DE A MILÍMETROS" />
    <div style={{ position: "absolute", left: 360, top: 700, width: 1200, height: 40, background: "#c9c2b4", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 420, top: 660, width: 380, height: 40, background: "#f1ead8" }} />
    <div style={{ position: "absolute", left: 1120, top: 660, width: 380, height: 40, background: "#f1ead8" }} />
    <div style={{ position: "absolute", left: 830, top: 660 - up, width: 260, height: 40, background: "#f1ead8", transform: `rotate(${-a}deg)`, transformOrigin: "100% 100%", boxShadow: "0 0 30px rgba(255,170,70,.5)" }} />
    <div style={{ position: "absolute", left: 600, top: 690, width: 420, height: 12, background: "linear-gradient(90deg, #8a6a3a 40%, #dfe3e6 40%)", transform: `rotate(${-a * 2.4}deg)`, transformOrigin: "100% 50%", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 1006, top: 696, width: 24, height: 24, borderRadius: "50%", background: GRN, boxShadow: `0 0 20px ${GRN}` }} />
    <Tag tt={tt} at={2} x={1018} y={800} txt="APOYO: LA PARED" col={GRN} size={34} />
    <Tag tt={tt} at={3.2} x={610} y={590} txt="NUNCA EL VECINO" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 20:25 · EL ESMALTE CANSADO: lupa sobre el esmalte; red de microrrajaduras que crece hasta el crack ----
export const HTired: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const p = cl((tt - 0.8) / 3), br = cl((tt - 4) / 0.4);
  const D = ["M0 120 L80 140 L160 110 L260 170 L340 150", "M120 0 L130 80 L160 110 L150 220 L180 340", "M260 170 L280 260 L340 300", "M40 260 L150 220 L200 260"];
  return <>
    <Head tt={tt} kick="40 AÑOS DE ESMALTE" title="A VECES SE PARTE" col={RED} />
    <div style={{ position: "absolute", left: 590, top: 300, width: 180, height: 360, overflow: "hidden", transform: `translateX(${-30 * br}px) rotate(${-4 * br}deg)`, transformOrigin: "100% 100%" }}><Tile x={180} y={180} s={360} tt={tt} /></div>
    <div style={{ position: "absolute", left: 770, top: 300, width: 180, height: 360, overflow: "hidden", transform: `translateX(${30 * br}px) rotate(${4 * br}deg)`, transformOrigin: "0 100%" }}><Tile x={0} y={180} s={360} tt={tt} /></div>
    <svg width={360} height={360} style={{ position: "absolute", left: 590, top: 300 }}>{D.map((d, i) => <path key={i} d={d} fill="none" stroke="#6e5a44" strokeWidth={2.5} strokeDasharray={420} strokeDashoffset={420 * (1 - cl(p * 1.4 - i * 0.15))} />)}</svg>
    <div style={{ position: "absolute", left: 1080, top: 300, width: 460, height: 460, borderRadius: "50%", border: "14px solid #3a3a3e", overflow: "hidden", background: "#efe6cf", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
      <svg width={460} height={460}>{D.map((d, i) => <path key={i} d={d} transform="scale(1.3) translate(-20 -10)" fill="none" stroke="#6e5a44" strokeWidth={4} strokeDasharray={600} strokeDashoffset={600 * (1 - cl(p * 1.4 - i * 0.15))} />)}</svg>
    </div>
    <div style={{ position: "absolute", left: 1460, top: 700, width: 140, height: 34, borderRadius: 17, background: "#3a3a3e", transform: "rotate(45deg)" }} />
    <Tag tt={tt} at={4.2} x={770} y={760} txt="CRACK" col={RED} size={60} />
  </>;
}}</Stage>;

// ---- 21:22 · LA CAJA DEL GARAJE: la caja manchada "COCINA 79" se abre y salen 12 azulejos en abanico ----
export const HBox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const op = eio(tt, 1.4, 2.6);
  return <>
    <Head tt={tt} kick="EN EL FONDO DEL GARAJE" title="LA CAJA QUE NADIE SABÍA" col={GRN} />
    {Array.from({ length: 12 }, (_, i) => { const k = phys(tt, 2.6 + i * 0.16, 6, 0.55), a = (i - 5.5) * 9 * k;
      return <div key={i} style={{ position: "absolute", left: 960, top: 640, transform: `rotate(${a}deg) translateY(${-260 * k}px)`, transformOrigin: "0 0" }}><Tile x={0} y={0} s={130} tt={tt} /></div>; })}
    <div style={{ position: "absolute", left: 960 - 270, top: 600, width: 540, height: 300, background: "linear-gradient(180deg, #c99a62, #9c7344)", borderRadius: 8, boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 60 + i * 150, top: 40 + i * 60, width: 90, height: 60, borderRadius: "50%", background: "rgba(80,50,20,.25)" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: HAND, fontSize: 84, color: "#3a2a1a", transform: "rotate(-3deg)" }}>cocina 79</div>
    </div>
    <div style={{ position: "absolute", left: 960 - 270, top: 600, width: 270, height: 30, background: "#b8885a", transformOrigin: "0 50%", transform: `rotate(${-150 * op}deg)` }} />
    <div style={{ position: "absolute", left: 960, top: 600, width: 270, height: 30, background: "#b8885a", transformOrigin: "100% 50%", transform: `rotate(${150 * op}deg)` }} />
    <Tag tt={tt} at={4.8} x={960} y={980} txt="12 IGUALES · MISMO BLANCO · MISMA MEDIDA" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- 22:11 · UNO DECORADO: el hueco blanco se llena con un azulejo pintado y aparecen dos más como si fuera a propósito ----
export const HDeco: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const D = [7, 13, 21];
  const deco = (k: number, i: number) => <svg width={150} height={150} style={{ position: "absolute", inset: 0, opacity: k }}>
    <rect x={8} y={8} width={134} height={134} fill="none" stroke="#2f5d8a" strokeWidth={5} />
    <circle cx={75} cy={75} r={30} fill="none" stroke={i === 1 ? "#c2552a" : "#2f5d8a"} strokeWidth={6} />
    {[0, 1, 2, 3].map((j) => <path key={j} d="M75 45 Q95 20 75 8 Q55 20 75 45" fill={i === 1 ? "#e3a03a" : "#3f7fb8"} transform={`rotate(${j * 90} 75 75)`} />)}
  </svg>;
  return <>
    <Head tt={tt} kick="SI NO APARECE NINGUNO IGUAL" title="QUE PAREZCA A PROPÓSITO" />
    <div style={{ position: "absolute", left: 960 - 480, top: 260, width: 960, height: 640, display: "flex", flexWrap: "wrap", gap: 6, padding: 6, background: "#a59d8b", borderRadius: 8 }}>
      {Array.from({ length: 24 }, (_, i) => { const di = D.indexOf(i), k = di < 0 ? 0 : phys(tt, 1 + di * 1.1, 6, 0.5);
        return <div key={i} style={{ position: "relative", width: 150 + 4, height: 150 }}><Tile x={77} y={75} s={150} tt={tt} />{di >= 0 && <div style={{ position: "absolute", left: 2, top: 0, width: 150, height: 150, transform: `rotateY(${(1 - k) * 90}deg)` }}>{deco(cl(k * 2), di)}</div>}</div>; })}
    </div>
    <Tag tt={tt} at={4.6} x={960} y={970} txt="TRES PINTADOS QUEDAN LINDOS" col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 23:21 · ESTAMPILLA SOBRE ESTAMPILLA: una estampilla nueva pegada sobre otra vieja que se despega: se van las dos ----
export const HStamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const peel = eio(tt, 3, 5);
  const st = (col: string, txt: string) => <div style={{ width: 300, height: 360, background: col, padding: 18, boxSizing: "border-box", WebkitMaskImage: "radial-gradient(circle at 10px 10px, transparent 9px, #000 10px)", WebkitMaskSize: "30px 30px", WebkitMaskPosition: "-5px -5px", boxShadow: "0 20px 50px rgba(0,0,0,.5)" }}><div style={{ width: "100%", height: "100%", border: "3px solid rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 40, color: "rgba(0,0,0,.6)", textAlign: "center" }}>{txt}</div></div>;
  return <>
    <Head tt={tt} kick="EL PASO QUE TODOS SE SALTEAN" title="NUNCA SOBRE LO VIEJO" col={RED} />
    <div style={{ position: "absolute", left: 360, top: 280, width: 1200, height: 620, background: "#e9e2d2", borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 800, top: 420, transform: `rotate(${-peel * 24}deg) translate(${peel * 160}px, ${-peel * 140}px)`, transformOrigin: "0 0" }}>
      <div style={{ position: "absolute", left: 0, top: 0 }}>{st("#c9a46a", "VIEJO")}</div>
      <div style={{ position: "absolute", left: 40, top: 30, transform: `translateY(${(1 - phys(tt, 0.8, 6, 0.5)) * -400}px)` }}>{st("#7fc49a", "NUEVO")}</div>
    </div>
    <Tag tt={tt} at={4.2} x={960} y={970} txt="SE DESPEGA LO DE ABAJO" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 24:10 · LA HERRAMIENTA ACOSTADA: transportador; el cortafrío baja a ~15° y los terrones saltan en golpecitos ----
export const HAngle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const ang = 60 - eio(tt, 0.8, 2.6) * 45, tap = Math.max(0, Math.sin(tt * 9)) * cl(tt - 3);
  return <>
    <Head tt={tt} kick="RASPAR LO VIEJO" title="CASI ACOSTADA" />
    <div style={{ position: "absolute", left: 360, top: 760, width: 1200, height: 40, background: "#c9c2b4" }} />
    {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 980 + i * 90, top: 724 - (i === 0 && tt > 3 ? tap * 40 : 0), width: 60, height: 36, borderRadius: 10, background: "#8a857a", opacity: i === 0 ? 1 - cl((tt - 4.6) * 2) : 1 }} />)}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M960 760 m-300 0 a300 300 0 0 1 600 0" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={3} />
      <path d={`M1260 760 A300 300 0 0 0 ${960 + 300 * Math.cos(ang * Math.PI / 180)} ${760 - 300 * Math.sin(ang * Math.PI / 180)}`} fill="none" stroke={AMB} strokeWidth={8} />
    </svg>
    <div style={{ position: "absolute", left: 960, top: 760, width: 520, height: 22, borderRadius: 6, background: "linear-gradient(90deg, #dfe3e6 70%, #6d7378)", transform: `rotate(${-ang}deg) translateX(${tap * 10 - 520}px)`, transformOrigin: "0 50%" }} />
    <div style={{ position: "absolute", left: 1300, top: 560, fontWeight: 900, fontSize: 90, color: AMB, fontVariantNumeric: "tabular-nums" }}>{Math.round(ang)}°</div>
    <Tag tt={tt} at={3.2} x={700} y={900} txt="GOLPECITOS CORTOS · ANTEOJOS" col={TX} size={34} />
  </>;
}}</Stage>;

// ---- 25:01 · LOS 5 MM: corte del hueco; un lápiz mide la distancia hasta la pared; donde falta, rojo ----
export const HGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const y = 300 + eio(tt, 0.8, 4.6) * 460, bump = y > 560 && y < 640;
  return <>
    <Head tt={tt} kick="EL HUECO" title="5 MM PAREJOS" />
    <div style={{ position: "absolute", left: 620, top: 280, width: 180, height: 540, background: "repeating-linear-gradient(0deg, #b0644a 0 50px, #8d4a34 50px 56px)" }} />
    <div style={{ position: "absolute", left: 800, top: 280, width: 60, height: 540, background: "#c9c2b4" }} />
    <div style={{ position: "absolute", left: 860, top: 580, width: 50, height: 60, borderRadius: "0 20px 20px 0", background: "#8a857a" }} />
    <div style={{ position: "absolute", left: 1000, top: 280, width: 40, height: 540, background: "#a59d8b" }} />
    <div style={{ position: "absolute", left: 860, top: y - 8, width: 140, height: 16, background: bump ? RED : GRN, opacity: 0.85, boxShadow: `0 0 20px ${bump ? RED : GRN}` }} />
    <div style={{ position: "absolute", left: 1060, top: y - 14, width: 420, height: 28, borderRadius: "0 14px 14px 0", background: "linear-gradient(180deg, #ffd34a, #e0a020)" }}><div style={{ position: "absolute", left: -40, top: 0, width: 40, height: 28, background: "#f4d7b0", clipPath: "polygon(100% 0,100% 100%,0 50%)" }} /></div>
    <div style={{ position: "absolute", left: 1520, top: y - 40, fontWeight: 900, fontSize: 60, color: bump ? RED : GRN }}>{bump ? "2 MM" : "5 MM"}</div>
    <Tag tt={tt} at={3.4} x={930} y={900} txt="MENOS DE 5 MM: SIGUE RASPANDO" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 25:20 · PARED CON SED: revoque reseco chupa el agua del adhesivo (gotas que se van), el húmedo la deja quieta ----
export const HThirsty: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const side = (x: number, dry: boolean) => <div style={{ position: "absolute", left: x, top: 330, width: 600, height: 460 }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 260, height: 460, background: dry ? "#d8d0bf" : "#a7a294", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 260, top: 0, width: 110, height: 460, background: "#8f8a80" }} />
    {Array.from({ length: 10 }, (_, i) => { const u = ((tt * 0.6 + rnd(i)) % 1); const xx = dry ? 300 - u * 260 : 300 + 20 * Math.sin(tt * 2 + i);
      return <div key={i} style={{ position: "absolute", left: xx, top: 30 + i * 42, width: 18, height: 18, borderRadius: "50%", background: "rgba(120,190,240,.9)", opacity: dry ? 1 - u : 0.9 }} />; })}
  </div>;
  return <>
    <Head tt={tt} kick="ANTES DE PEGAR" title="LA PARED, APENAS HÚMEDA" col={ICE} />
    {side(300, true)}{side(1060, false)}
    <Tag tt={tt} at={1.6} x={500} y={860} txt="RESECA: SE TOMA EL AGUA" col={RED} size={32} />
    <Tag tt={tt} at={2.6} x={1260} y={860} txt="ESPONJA HÚMEDA: AGARRA" col={GRN} size={32} />
  </>;
}}</Stage>;

// ---- 26:22 · LAS COSTILLAS: el dorso limpio en macro; el adhesivo se mete entre las rayitas como dientes que muerden ----
export const HRibs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const f = eio(tt, 1.2, 4.4), sx = 560 + f * 820;
  return <>
    <Head tt={tt} kick="EL DORSO LIMPIO" title="QUE SE VEAN LAS RAYITAS" />
    <div style={{ position: "absolute", left: 560, top: 290, width: 800, height: 560, perspective: 1400 }}>
      <div style={{ position: "absolute", inset: 0, transform: "rotateX(22deg) rotateZ(-3deg)", background: "linear-gradient(160deg, #d9a17a, #b97850)", borderRadius: 8, boxShadow: "0 30px 60px rgba(0,0,0,.55)", overflow: "hidden" }}>
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40, right: 40, top: 40 + i * 58, height: 22, borderRadius: 11, background: "linear-gradient(180deg, #f0bf98 0%, #c98a60 55%, #8e5636 100%)", boxShadow: "0 6px 8px rgba(70,35,15,.45)" }} />)}
        {Array.from({ length: 26 }, (_, i) => { const x = rnd(i) * 760, y = rnd(i + 40) * 520, gone = cl((560 + f * 820 - 560 - x) / 60);
          return <div key={i} style={{ position: "absolute", left: x - 30, top: y - 25, width: 70 + rnd(i + 7) * 60, height: 50 + rnd(i + 9) * 40, borderRadius: "45% 55% 50% 40%", background: "#8f8a80", boxShadow: "inset 0 -6px 0 rgba(0,0,0,.25)", opacity: 1 - gone, transform: `translateX(${gone * 40}px) scale(${1 - gone * 0.3})` }} />; })}
      </div>
    </div>
    <div style={{ position: "absolute", left: sx - 20, top: 250, width: 40, height: 640, borderRadius: 6, background: "linear-gradient(90deg, #d8dde2, #8d959c)", boxShadow: "0 10px 30px rgba(0,0,0,.5)", opacity: cl(tt - 1) * (1 - cl((tt - 4.6) * 2)) }} />
    <Tag tt={tt} at={1} x={960} y={250} txt="COSTILLAS DEL DORSO" col={DIM} size={30} />
    <Tag tt={tt} at={4.6} x={960} y={920} txt="EL ADHESIVO SE AGARRA DE ACÁ" col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 27:22 · EL ORDEN DEL BALDE: 1 agua, 2 el polvo de a poco, 3 cinco minutos de descanso ----
export const HMix: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = cl((tt - 0.8) / 1.2), p = cl((tt - 2.2) / 2), sw = tt * 4;
  return <>
    <Head tt={tt} kick="ADHESIVO FLEXIBLE" title="PRIMERO EL AGUA" />
    <div style={{ position: "absolute", left: 760, top: 400, width: 400, height: 440, clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)", background: "rgba(255,255,255,.08)", border: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${(w * 0.35 + p * 0.25) * 100}%`, background: p > 0.1 ? `linear-gradient(180deg, #a19c92, #7e796f)` : "linear-gradient(180deg, #8cc6ee, #3e86c8)" }} />
    </div>
    <div style={{ position: "absolute", left: 750, top: 390, width: 420, height: 16, borderRadius: 8, background: "#c94f2a" }} />
    {p > 0 && p < 1 && Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 1000 + rnd(i) * 60 - 30 * Math.sin(sw), top: 260 + ((tt * 300 + i * 20) % 200), width: 6, height: 6, borderRadius: 3, background: "#cfcac0" }} />)}
    {[["1", "AGUA", 0.8, ICE], ["2", "POLVO DE A POCO", 2.2, DIM], ["3", "5 MIN · REVOLVER", 4.4, AMB]].map(([n, txt, at, c], i) => { const k = phys(tt, Number(at), 6, 0.5);
      return <div key={i} style={{ position: "absolute", left: 1300, top: 400 + i * 130, display: "flex", alignItems: "center", gap: 24, opacity: cl(k * 2), transform: `translateX(${(1 - k) * 60}px)` }}><div style={{ width: 80, height: 80, borderRadius: "50%", background: String(c), color: "#111", fontWeight: 900, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div><div style={{ fontWeight: 900, fontSize: 36, color: TX }}>{txt}</div></div>; })}
  </>;
}}</Stage>;

// ---- 28:14 · EL CAMPO ARADO: la llana dentada pasa y deja surcos parejos todos acostados para el mismo lado ----
export const HField: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const x = eio(tt, 0.8, 3.6);
  return <>
    <Head tt={tt} kick="LA LLANA DENTADA" title="COMO UN CAMPO ARADO" />
    <div style={{ position: "absolute", left: 360, top: 330, width: 1200, height: 500, perspective: 1000 }}>
      <div style={{ position: "absolute", inset: 0, transform: "rotateX(48deg)", transformOrigin: "50% 100%", background: "#c9c2b4", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${x * 100}%`, background: "repeating-linear-gradient(0deg, #9a958a 0 26px, #6f6b62 26px 34px, #b0aa9e 34px 44px)" }} />
        <div style={{ position: "absolute", left: `${x * 100}%`, top: 0, bottom: 0, right: 0, background: "#8f8a80", opacity: 0.85 }} />
      </div>
      <div style={{ position: "absolute", left: `${x * 100}%`, top: 120, width: 60, height: 360, marginLeft: -30, background: "linear-gradient(90deg, #dfe3e6, #9aa1a8)", borderRadius: 6, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
        <div style={{ position: "absolute", left: 10, top: 130, width: 40, height: 100, borderRadius: 10, background: "#5a3e28" }} />
      </div>
    </div>
    <Tag tt={tt} at={4} x={960} y={930} txt="UNA SOLA DIRECCIÓN" col={AMB} size={40} />
  </>;
}}</Stage>;

