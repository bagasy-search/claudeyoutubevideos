// componentes únicos de al28c · A2: minutos 1-15 (el error, la prueba, el mapa, los motivos y la jeringa).
import React from "react";
import { AMB, DIM, GRN, H, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Check, Cross } from "./heroes1";
import { Arrow, Tile, TileBack, Wave, rnd } from "./heroesA";

// mango de destornillador (punta de metal + mango naranja con estrías)
const Driver: React.FC = () => <div style={{ position: "absolute", left: 0, top: 0 }}>
  <div style={{ position: "absolute", left: 0, top: -9, width: 220, height: 18, borderRadius: 4, background: "linear-gradient(180deg, #e8ecef, #8d949a)" }} />
  <div style={{ position: "absolute", left: 210, top: -34, width: 190, height: 68, borderRadius: 30, background: "linear-gradient(180deg, #ff7a3a, #c23f12)", boxShadow: "0 16px 30px rgba(0,0,0,.5)" }}>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 30 + i * 38, top: 8, width: 12, height: 52, borderRadius: 6, background: "rgba(0,0,0,.18)" }} />)}
  </div>
</div>;

// ---- 1:04 · EL ERROR QUE LO HACE VOLVER: el azulejo cae a los 3 meses, se vuelve a pegar igual… y vuelve a caer ----
export const HLoop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const c = ((tt - 0.6) % 2.4 + 2.4) % 2.4, fall = tt < 0.6 ? 0 : cl((c - 1.3) / 0.6), n = Math.max(0, Math.floor((tt - 0.6) / 2.4)) + 1;
  return <>
    <Head tt={tt} kick="EL ERROR QUE CASI NADIE VE" title="SE VUELVE A SOLTAR" col={RED} />
    <div style={{ position: "absolute", left: 520, top: 260, width: 640, height: 640, borderRadius: 16, background: "#e9e2d2" }} />
    {[0, 2, 3].map((i) => <Tile key={i} x={680 + (i % 2) * 320} y={420 + Math.floor(i / 2) * 320} s={300} tt={tt} />)}
    <Tile x={1000} y={420 + fall * fall * 700} s={300} tt={tt} rot={fall * 24} glow={1 - fall} />
    <svg width={260} height={260} style={{ position: "absolute", left: 1350, top: 380 }}><circle cx={130} cy={130} r={100} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={14} /><circle cx={130} cy={130} r={100} fill="none" stroke={RED} strokeWidth={14} strokeDasharray={628} strokeDashoffset={628 * (1 - c / 2.4)} transform="rotate(-90 130 130)" /></svg>
    <div style={{ position: "absolute", left: 1480, top: 510, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 46, color: TX, textAlign: "center", lineHeight: 1 }}>3<br /><span style={{ fontSize: 22, color: DIM, letterSpacing: 3 }}>MESES</span></div>
    <Tag tt={tt} at={1.4} x={1480} y={720} txt={`VUELTA ${n}`} col={RED} size={42} />
  </>;
}}</Stage>;

// ---- 3:03 · AL REVÉS: el destornillador gira 180° y queda el mango como martillito liviano ----
export const HGrip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const r = eio(tt, 1.0, 2.6) * 180, hit = cl((tt - 3.2) / 0.3) * (1 - cl((tt - 3.5) / 0.4));
  return <>
    <Head tt={tt} kick="LA HERRAMIENTA" title="EL MANGO, NO EL MARTILLO" />
    <div style={{ position: "absolute", left: 900, top: 560, transform: `rotate(${r}deg) scale(1.7)` }}><div style={{ position: "absolute", left: -310, top: 0 }}><Driver /></div></div>
    <Tile x={1500} y={560} s={260} tt={tt} style={{ transform: `translateX(${hit * 6}px)` }} />
    {hit > 0.05 && [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1330 - i * 40, top: 500 - i * 30, width: 80 + i * 60, height: 120 + i * 60, borderRadius: "50%", borderLeft: `4px solid ${AMB}`, opacity: hit * (1 - i * 0.3) }} />)}
    <Tag tt={tt} at={2.8} x={760} y={800} txt="AGARRADO DEL METAL" col={TX} size={36} />
    <Tag tt={tt} at={4.2} x={1450} y={800} txt="PRUEBA DE OÍDO, NO DE FUERZA" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 3:25 · GOLPE SUAVE: medidor de fuerza; la aguja tiene que quedar en "puerta de alguien que duerme" ----
export const HKnock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const v = 0.22 + 0.55 * Math.max(0, Math.sin(cl((tt - 3.2) / 1.2) * Math.PI)), a = -120 + 240 * phys(tt, 0.8, 4, 0.5) * v;
  const P = (d: number) => [450 + 330 * Math.sin(d * Math.PI / 180), 470 - 330 * Math.cos(d * Math.PI / 180)];
  const arcs: [string, number, number][] = [["#5fd48a", -120, -40], ["#ffb257", -40, 40], ["#ff5a4a", 40, 120]];
  return <>
    <Head tt={tt} kick="CÓMO SE GOLPEA" title="COMO SI ALGUIEN DURMIERA" />
    <svg width={900} height={560} style={{ position: "absolute", left: 510, top: 270 }}>
      {arcs.map(([c, a0, a1], i) => { const [x0, y0] = P(a0), [x1, y1] = P(a1); return <path key={i} d={`M${x0} ${y0} A330 330 0 0 1 ${x1} ${y1}`} stroke={c} strokeWidth={46} fill="none" opacity={0.85} />; })}
      <line x1={450} y1={470} x2={450 + 300 * Math.sin(a * Math.PI / 180)} y2={470 - 300 * Math.cos(a * Math.PI / 180)} stroke={TX} strokeWidth={12} strokeLinecap="round" />
      <circle cx={450} cy={470} r={26} fill={TX} />
    </svg>
    <Tag tt={tt} at={1.4} x={640} y={830} txt="SUAVE" col={GRN} size={40} />
    <Tag tt={tt} at={1.6} x={1280} y={830} txt="LO RAJAS" col={RED} size={40} />
    <Tag tt={tt} at={2.2} x={960} y={930} txt="toc · toc · toc" col={TX} size={46} />
  </>;
}}</Stage>;

// ---- 4:17 · EL DE REFERENCIA: el azulejo del medio se marca con anillo verde; la onda se "graba" y la del hueco no coincide ----
export const HRef: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const ring = phys(tt, 0.8, 6, 0.5), scan = cl((tt - 2.4) / 3.6);
  return <>
    <Head tt={tt} kick="TU SONIDO DE REFERENCIA" title="GRÁBATE ESTE" col={GRN} />
    <div style={{ position: "absolute", left: 200, top: 260, width: 800, height: 680 }}>
      {Array.from({ length: 30 }, (_, i) => { const hit = Math.abs(i / 29 - scan) < 0.04, x = (i % 6) * 134 + 64, y = Math.floor(i / 6) * 134 + 64;
        return <React.Fragment key={i}><Tile x={x} y={y} s={128} tt={tt} glow={i === 22 && scan > 0.7 ? 1 : 0} style={hit ? { filter: "brightness(1.15)" } : undefined} />
          {i === 14 && <div style={{ position: "absolute", left: x - 74, top: y - 74, width: 148, height: 148, borderRadius: 14, border: `6px solid ${GRN}`, opacity: ring, transform: `scale(${1.3 - 0.3 * ring})` }} />}</React.Fragment>; })}
    </div>
    <div style={{ position: "absolute", left: 1150, top: 330, width: 620, height: 170, borderRadius: 18, background: "rgba(95,212,138,.1)", border: `2px solid ${GRN}` }}><Wave x={20} y={0} w={580} h={170} p={cl((tt - 1.2) / 1)} f={5} decay={6} col={GRN} tt={0} /></div>
    <div style={{ position: "absolute", left: 1150, top: 560, width: 620, height: 170, borderRadius: 18, background: "rgba(255,178,87,.08)", border: `2px solid ${scan > 0.7 ? AMB : "rgba(255,255,255,.15)"}` }}>{scan > 0.7 && <Wave x={20} y={0} w={580} h={170} p={cl((tt - 5) / 1)} f={22} decay={0.8} col={AMB} tt={tt} />}</div>
    <Tag tt={tt} at={1.6} x={1460} y={300} txt="REFERENCIA" col={GRN} size={30} />
    <Tag tt={tt} at={5.2} x={1460} y={790} txt="DISTINTO = CINTA" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 4:59 · EL MAPA: la pared entera en plano, aparecen las 6 cintas y 4 se agrupan en el rectángulo de la estufa ----
export const HMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const C = 34, Rr = 6, s = 50, x0 = 960 - (C * s) / 2, y0 = 340;
  const PT = [[6, 2], [7, 1], [8, 2], [9, 1], [24, 1], [33, 0]];
  const box = phys(tt, 4.2, 5, 0.55);
  return <>
    <Head tt={tt} kick="LA PARED DE LA COCINA" title="EL MAPA DE LOS HUECOS" />
    <div style={{ position: "absolute", left: x0, top: y0, width: C * s, height: Rr * s, background: "#a59d8b", borderRadius: 6, boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
      {Array.from({ length: C * Rr }, (_, i) => <div key={i} style={{ position: "absolute", left: (i % C) * s + 2, top: Math.floor(i / C) * s + 2, width: s - 4, height: s - 4, background: "#f1ead8", borderRadius: 2 }} />)}
      {PT.map(([c, r], i) => { const k = phys(tt, 0.9 + i * 0.45, 8, 0.4); return <div key={i} style={{ position: "absolute", left: c * s + 6, top: (Rr - 1 - r) * s + 16, width: s - 12, height: 14, background: "#5aa6e8", borderRadius: 2, transform: `scale(${k}) rotate(${(i % 2 ? -8 : 6)}deg)`, opacity: cl(k * 2), boxShadow: `0 0 18px rgba(90,166,232,${0.8 * k})` }} />; })}
      <div style={{ position: "absolute", left: 5 * s - 6, top: -14, width: 5 * s + 12, height: Rr * s + 28, borderRadius: 14, border: `5px solid ${RED}`, opacity: box, transform: `scale(${1.15 - 0.15 * box})` }} />
    </div>
    <div style={{ position: "absolute", left: x0 + 5 * s, top: y0 + Rr * s + 30, width: 5 * s, height: 150, borderRadius: 12, background: "linear-gradient(180deg,#f3f1eb,#d9d5cc)", opacity: box, display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>{[0, 1].map((i) => <div key={i} style={{ width: 70, height: 70, borderRadius: "50%", border: "8px solid #333", boxShadow: `0 0 26px rgba(255,120,40,${0.6 * box})` }} />)}</div>
    <Tag tt={tt} at={4.6} x={x0 + 7.5 * s} y={y0 + Rr * s + 240} txt="4 DE 6 · ATRÁS DE LA ESTUFA" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 6:14 · EL CRUCE DE CAMINOS: ¿suena hueco? → ¿se mueve con la palma? → jeringa / sacarlo ----
export const HDecide: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const n = (x: number, y: number, w: number, txt: string, col: string, at: number) => { const k = phys(tt, at, 7, 0.5); return <div style={{ position: "absolute", left: x - w / 2, top: y - 55, width: w, height: 110, borderRadius: 20, background: "rgba(18,18,22,.92)", border: `3px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 34, color: TX, letterSpacing: 1, transform: `scale(${0.7 + 0.3 * k})`, opacity: cl(k * 2), boxShadow: `0 20px 60px rgba(0,0,0,.5), 0 0 30px ${col}33` }}>{txt}</div>; };
  return <>
    <Head tt={tt} kick="ANTES DE TOCAR NADA" title="DOS ARREGLOS DISTINTOS" />
    {n(960, 330, 520, "SUENA HUECO", AMB, 0.5)}
    <Arrow d="M960 390 L960 470" p={(tt - 1.2) * 2} col={DIM} />
    {n(960, 540, 600, "¿SE MUEVE CON LA PALMA?", ICE, 1.4)}
    <Arrow d="M820 600 Q700 680 560 730" p={(tt - 2.4) * 2} col={GRN} len={400} />
    <Arrow d="M1100 600 Q1220 680 1360 730" p={(tt - 3.4) * 2} col={AMB} len={400} />
    {n(520, 800, 460, "NO → JERINGA", GRN, 2.8)}
    {n(1400, 800, 460, "SÍ → SACARLO", AMB, 3.8)}
    <Tag tt={tt} at={5} x={960} y={960} txt="SI TE EQUIVOCAS, LO ROMPES O SE VUELVE A SOLTAR" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 7:20 · EL DIBUJO: la pared se abre en capas (ladrillo, revoque, adhesivo, azulejo) como un acordeón en perspectiva ----
export const HLayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L: [string, string][] = [["LADRILLO", "repeating-linear-gradient(0deg, #b0644a 0 40px, #8d4a34 40px 46px)"], ["REVOQUE", "#c9c2b4"], ["ADHESIVO", "#8f8a80"], ["AZULEJO", "linear-gradient(120deg,#fff,#f1ead8 40%)"]];
  const open = eio(tt, 0.8, 3.2);
  return <>
    <Head tt={tt} kick="LO QUE HAY ATRÁS" title="CUATRO CAPAS" />
    <div style={{ position: "absolute", left: 960, top: 560, perspective: 1800 }}>
      {L.map(([n, bg], i) => { const k = phys(tt, 0.6 + i * 0.5, 6, 0.55), x = (i - 1.5) * 300 * open;
        return <div key={i} style={{ position: "absolute", left: x - 150, top: -220, width: 300, height: 440, borderRadius: 10, background: bg, transform: `rotateY(${-34 * open}deg) translateY(${(1 - k) * -80}px)`, opacity: cl(k * 2), boxShadow: "0 30px 70px rgba(0,0,0,.55)", outline: i === 2 ? `4px solid ${AMB}` : "none" }} />; })}
    </div>
    {L.map(([n], i) => <Tag key={i} tt={tt} at={1.6 + i * 0.4} x={960 + (i - 1.5) * 300 * open} y={850} txt={n} col={i === 2 ? AMB : TX} size={30} />)}
    <Tag tt={tt} at={4.6} x={960} y={960} txt="LO QUE FALLA ES EL ADHESIVO" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 8:14 · PELOTITAS vs CAPA: dos dorsos lado a lado; cuánto apoya cada uno ----
export const HCover: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const a = cl((tt - 0.8) / 1.6), b = cl((tt - 1.6) / 2.2);
  return <>
    <Head tt={tt} kick="EL MOTIVO Nº 1" title="PEGADO CON PELOTITAS" col={RED} />
    <TileBack x={620} y={560} s={440} blobs={a} />
    <TileBack x={1300} y={560} s={440} full={b} />
    <div style={{ position: "absolute", left: 620, top: 800, transform: "translateX(-50%)", fontWeight: 900, fontSize: 90, color: RED }}>{Math.round(18 * a)}%</div>
    <div style={{ position: "absolute", left: 1300, top: 800, transform: "translateX(-50%)", fontWeight: 900, fontSize: 90, color: GRN }}>{Math.round(100 * b)}%</div>
    <Cross x={620} y={290} s={70} p={cl((tt - 3.4) * 2)} />
    <Check x={1300} y={290} s={70} p={cl((tt - 4.2) * 2)} />
    <Tag tt={tt} at={2.6} x={620} y={960} txt="APOYADO EN 5 PUNTOS" col={DIM} size={28} />
    <Tag tt={tt} at={3.6} x={1300} y={960} txt="APOYADO ENTERO" col={DIM} size={28} />
  </>;
}}</Stage>;

// ---- 9:00 · SE ESTIRA Y SE ENCOGE: tres franjas (azulejo, adhesivo, pared) laten distinto con el calor; contador de calentadas ----
export const HExpand: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const heat = 0.5 + 0.5 * Math.sin(tt * 2.2), cyc = Math.round(eio(tt, 1.2, 6.4) * 43800);
  const row = (y: number, n: string, col: string, k: number) => <div style={{ position: "absolute", left: 860 - 330 - k * 34 * heat, top: y, width: 660 + k * 68 * heat, height: 90, borderRadius: 10, background: col, boxShadow: "0 18px 40px rgba(0,0,0,.4)" }}><div style={{ position: "absolute", left: -250, top: 26, width: 220, textAlign: "right", fontWeight: 900, fontSize: 28, letterSpacing: 2, color: TX }}>{n}</div></div>;
  return <>
    <Head tt={tt} kick="EL MOTIVO Nº 2" title="EL CALOR DE LA ESTUFA" col={RED} />
    {row(330, "AZULEJO", "#f1ead8", 1)}
    {row(440, "ADHESIVO", "#8f8a80", 0.45)}
    {row(550, "PARED", "#c9c2b4", 0.15)}
    {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 660 + i * 100, top: 760 - ((tt * 70 + i * 40) % 120), width: 14, height: 60, borderRadius: 7, background: `rgba(255,120,40,${0.5 * heat})`, filter: "blur(4px)" }} />)}
    <div style={{ position: "absolute", left: 1560, top: 380, transform: "translateX(-50%)", textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 96, color: AMB, fontVariantNumeric: "tabular-nums" }}>{cyc.toLocaleString("es")}</div>
      <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 3, color: DIM }}>CALENTADAS EN 40 AÑOS</div>
    </div>
    <Tag tt={tt} at={3.6} x={960} y={900} txt="CADA UNO SE ESTIRA DISTINTO" col={TX} size={38} />
  </>;
}}</Stage>;

// ---- 10:08 · COMO ARENA: un terrón de adhesivo húmedo se desarma en granos que caen ----
export const HSand: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const d = cl((tt - 1.4) / 3);
  return <>
    <Head tt={tt} kick="EL MOTIVO Nº 3" title="LA HUMEDAD DE ATRÁS" col={ICE} />
    <div style={{ position: "absolute", left: 740, top: 340, width: 440, height: 290, borderRadius: "48% 52% 40% 60%", background: "radial-gradient(circle at 40% 35%, #c9c8bf, #7d7f78)", transform: `scale(${1 - 0.55 * d})`, opacity: 1 - d * 0.6, boxShadow: "inset 0 -20px 40px rgba(0,30,60,.35)" }} />
    {Array.from({ length: 220 }, (_, i) => { const st = 1.4 + rnd(i) * 2.6, k = cl(tt - st); if (k <= 0) return null; const x = 960 + (rnd(i + 3) - 0.5) * 400, y = 480 + k * k * 520 * (0.7 + rnd(i + 7) * 0.5);
      return <div key={i} style={{ position: "absolute", left: x, top: Math.min(y, 900 - rnd(i + 9) * 30), width: 9 + rnd(i + 2) * 12, height: 9 + rnd(i + 2) * 12, borderRadius: 3, background: rnd(i + 5) > 0.75 ? "#e8e4da" : "#6e706a" }} />; })}
    {[0, 1, 2, 3, 4, 5].map((i) => <div key={"w" + i} style={{ position: "absolute", left: 830 + i * 50, top: 360 + ((tt * 40 + i * 30) % 80), width: 10, height: 14, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(140,200,240,.7)", opacity: 1 - d }} />)}
    <Tag tt={tt} at={3} x={1480} y={480} txt="HÚMEDO" col={ICE} size={40} />
    <Tag tt={tt} at={3.6} x={1480} y={560} txt="SE DESHACE" col={TX} size={40} />
    <Tag tt={tt} at={4.4} x={1480} y={640} txt="COSTRA BLANCA" col={DIM} size={36} />
  </>;
}}</Stage>;

// ---- 10:16 · EL TIEMPO: la curva de agarre del adhesivo de 1979 baja año a año hasta cruzar la línea roja ----
export const HYears: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const p = cl((tt - 0.8) / 4), W = 1200, Hh = 480, x0 = 360, y0 = 300;
  const f = (u: number) => 1 - 0.78 * Math.pow(u, 1.6);
  const pts = Array.from({ length: 80 }, (_, i) => i / 79).filter((u) => u <= p).map((u) => `${x0 + u * W},${y0 + (1 - f(u)) * Hh}`).join(" ");
  return <>
    <Head tt={tt} kick="EL MOTIVO Nº 4" title="EL TIEMPO" />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={x0} y1={y0 + Hh} x2={x0 + W} y2={y0 + Hh} stroke="rgba(255,255,255,.25)" strokeWidth={3} />
      <polyline points={pts} fill="none" stroke={AMB} strokeWidth={9} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${AMB})` }} />
      <line x1={x0} y1={y0 + Hh * 0.62} x2={x0 + W} y2={y0 + Hh * 0.62} stroke={RED} strokeWidth={3} strokeDasharray="14 12" opacity={cl(tt - 3)} />
    </svg>
    {["1979", "1990", "2000", "2010", "2026"].map((y, i) => <div key={y} style={{ position: "absolute", left: x0 + i * W / 4, top: y0 + Hh + 20, transform: "translateX(-50%)", fontWeight: 800, fontSize: 28, color: i === 4 ? RED : DIM }}>{y}</div>)}
    <Tag tt={tt} at={1} x={x0} y={y0 - 30} txt="AGARRE" col={DIM} size={26} anchor="l" />
    <Tag tt={tt} at={3.4} x={x0 + W - 140} y={y0 + Hh * 0.62 - 40} txt="SE SUELTA" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 11:10 · LA SILICONA RESBALA: gotas de adhesivo nuevo caen sobre la silicona y rebotan sin agarrar ----
export const HSilicone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <>
  <Head tt={tt} kick="EL ATAJO QUE SALE CARO" title="NADA AGARRA A LA SILICONA" col={RED} />
  <TileBack x={960} y={600} s={500} />
  <div style={{ position: "absolute", left: 760, top: 430, width: 400, height: 340, borderRadius: "42% 58% 50% 50%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.95), rgba(235,240,245,.85) 40%, rgba(200,210,220,.8))", boxShadow: "inset 0 0 30px rgba(255,255,255,.7)" }} />
  {Array.from({ length: 6 }, (_, i) => { const st = 0.8 + i * 0.75, k = tt - st; if (k < 0) return null; const fall = Math.min(1, k / 0.5), b = k > 0.5 ? k - 0.5 : 0;
    const x = 860 + (i % 3) * 100 + b * (i % 2 ? 380 : -380), y = 240 + fall * 330 - b * 300 + b * b * 600;
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: 46, height: 46, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #b9b4a8, #7f7a6f)", opacity: 1 - cl(b - 0.8) }} />; })}
  <Tag tt={tt} at={3.8} x={960} y={950} txt="PRIMERO HAY QUE SACARLA TODA" col={AMB} size={38} />
</>}</Stage>;

// ---- 12:01 · LA BROCA: punta de flecha (cerámica) vs la de pared con percusión ----
export const HBit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sp = tt * 20;
  const bit = (x: number, arrow: boolean, ok: boolean, at: number) => <div style={{ position: "absolute", left: x, top: 300, width: 120, height: 560, opacity: cl(phys(tt, at, 6, 0.6) * 2) }}>
    <div style={{ position: "absolute", left: 40, top: 120, width: 40, height: 400, borderRadius: 6, background: `repeating-linear-gradient(${155 + Math.sin(sp) * 6}deg, #dfe3e6 0 18px, #8d949a 18px 30px)` }} />
    {arrow ? <svg width={120} height={140} style={{ position: "absolute", left: 0, top: 0 }}><path d="M60 0 L105 125 L15 125 Z" fill="#e8c86a" stroke="#a88a30" strokeWidth={4} /></svg>
      : <div style={{ position: "absolute", left: 28, top: 70, width: 64, height: 60, borderRadius: "10px 10px 4px 4px", background: "#c9b07a" }} />}
    {ok ? <Check x={60} y={600} s={60} p={cl((tt - 3.2) * 2)} /> : <Cross x={60} y={600} s={60} p={cl((tt - 3.6) * 2)} />}
  </div>;
  return <>
    <Head tt={tt} kick="PARA LOS AGUJEROS" title="BROCA DE 3-4 MM PARA CERÁMICA" />
    {bit(620, true, true, 0.8)}{bit(1180, false, false, 1.4)}
    <Tag tt={tt} at={2.2} x={680} y={270} txt="PUNTA DE FLECHA" col={AMB} size={34} />
    <Tag tt={tt} at={2.6} x={1240} y={270} txt="PERCUSIÓN" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 13:21 · LA BOTELLA: con un agujero el aire no sale y el líquido no entra; con dos, uno entra y otro respira ----
export const HBottle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const l1 = cl((tt - 1) / 4) * 0.12, l2 = cl((tt - 1.4) / 3.6);
  const bottle = (x: number, lvl: number, two: boolean) => <div style={{ position: "absolute", left: x - 160, top: 300, width: 320, height: 540 }}>
    <div style={{ position: "absolute", left: 110, top: 0, width: 100, height: 90, borderRadius: "14px 14px 0 0", background: "rgba(200,230,255,.18)", border: "4px solid rgba(220,240,255,.6)" }} />
    <div style={{ position: "absolute", left: 0, top: 80, width: 320, height: 440, borderRadius: 50, background: "rgba(200,230,255,.1)", border: "4px solid rgba(220,240,255,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: "linear-gradient(180deg, #f0b34a, #c8862a)" }} />
      {!two && Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 50, top: 90 + 30 * Math.sin(tt * 3 + i), width: 30, height: 30, borderRadius: "50%", border: "3px solid rgba(255,255,255,.5)" }} />)}
    </div>
    {two && tt > 1.4 && Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: "absolute", left: 250, top: 40 - ((tt * 120 + i * 40) % 160), width: 16, height: 16, borderRadius: "50%", border: "3px solid rgba(255,255,255,.6)" }} />)}
  </div>;
  return <>
    <Head tt={tt} kick="¿PARA QUÉ DOS AGUJEROS?" title="UNO ENTRA, EL OTRO RESPIRA" />
    {bottle(620, l1, false)}{bottle(1300, l2, true)}
    <Tag tt={tt} at={2.4} x={620} y={920} txt="UN AGUJERO: NO ENTRA" col={RED} size={34} />
    <Tag tt={tt} at={3.4} x={1300} y={920} txt="DOS: SE LLENA" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- 14:01 · RAYOS X: la pared se vuelve transparente, aparecen los caños; el agujerito de 1 cm no llega ----
export const HPipes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const x = cl((tt - 1) / 1.5), d = eio(tt, 2.8, 4.2);
  return <>
    <Head tt={tt} kick="LO QUE HAY ADENTRO" title="CAÑOS DE LUZ Y DE AGUA" col={ICE} />
    <div style={{ position: "absolute", left: 360, top: 280, width: 1200, height: 580, borderRadius: 16, overflow: "hidden", background: "#0b1a2a", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - x * 0.8, backgroundImage: "linear-gradient(#a59d8b 4px, transparent 4px), linear-gradient(90deg, #a59d8b 4px, #f1ead8 4px)", backgroundSize: "100px 100px" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, height: 34, borderRadius: 17, background: "linear-gradient(180deg, #9cd2ff, #3e86c8)", opacity: x, boxShadow: "0 0 30px rgba(90,170,255,.7)" }} />
      <div style={{ position: "absolute", left: 760, top: 0, bottom: 0, width: 26, borderRadius: 13, background: "linear-gradient(90deg, #ffd27a, #e09a2a)", opacity: x, boxShadow: "0 0 30px rgba(255,190,80,.7)" }} />
      <div style={{ position: "absolute", left: 80 + 80 * d, top: 380, width: 220, height: 16, borderRadius: 8, background: "#dfe3e6", opacity: cl(tt - 2.6) }} />
      <div style={{ position: "absolute", left: 300, top: 360, width: 6, height: 56, background: GRN, opacity: cl(tt - 3.6) }} />
    </div>
    <Tag tt={tt} at={4} x={560} y={930} txt="1 CM: NO LLEGA AL CAÑO" col={GRN} size={34} />
    <Tag tt={tt} at={4.6} x={1340} y={930} txt="CERCA DE UN ENCHUFE: CORTA LA LUZ" col={AMB} size={34} />
  </>;
}}</Stage>;
