// componentes únicos de al28c · C: minutos 29-42 (apretar y resbalar, la piel, crucetas, lechada, humedad, el mostrador y el final).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Check, Cross } from "./heroes1";
import { Arrow, Tile, TileBack, rnd } from "./heroesA";

// ---- 29:09 · APRETAR Y RESBALAR: vista de canto; el azulejo resbala unos mm, los surcos se aplastan y salen las burbujas ----
export const HSlide: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sl = Math.sin(cl((tt - 1.6) / 1.6) * Math.PI) * 40, fl = cl((tt - 1.6) / 2);
  return <>
    <Head tt={tt} kick="APRIETAS CON LAS PALMAS" title="Y LO HACES RESBALAR" />
    <div style={{ position: "absolute", left: 360, top: 720, width: 1200, height: 60, background: "#c9c2b4" }} />
    {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 380 + i * 74, top: 720 - 46 + 30 * fl, width: 44, height: 46 - 30 * fl, background: "#8f8a80", borderRadius: "8px 8px 0 0" }} />)}
    <div style={{ position: "absolute", left: 360 + sl, top: 600 + 30 * fl - (1 - phys(tt, 0.6, 6, 0.5)) * 160, width: 1200, height: 74, background: "#f1ead8", borderRadius: 6, boxShadow: "0 -10px 30px rgba(0,0,0,.3)" }} />
    {Array.from({ length: 7 }, (_, i) => { const u = cl((tt - 2 - i * 0.2) / 1.6); return <div key={i} style={{ position: "absolute", left: 460 + i * 160, top: 690 - u * 260, width: 24, height: 24, borderRadius: "50%", border: "3px solid rgba(255,255,255,.7)", opacity: (1 - u) * cl(u * 6) }} />; })}
    <Arrow d="M820 500 L1100 500" p={(tt - 1.4) * 2} col={AMB} w={10} len={300} />
    <Tag tt={tt} at={2} x={960} y={450} txt="UNOS MILÍMETROS" col={AMB} size={34} />
    <Tag tt={tt} at={4} x={960} y={880} txt="SE APLASTAN LOS SURCOS · SALE EL AIRE" col={TX} size={34} />
  </>;
}}</Stage>;

// ---- 29:30 · LA PRUEBA DE LOS QUE SABEN: lo despega, lo da vuelta y mide cuánto dorso quedó cubierto ----
export const HFlip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const r = eio(tt, 0.8, 2.2) * 180, c = Math.round(eio(tt, 2.4, 4) * 96);
  return <>
    <Head tt={tt} kick="UN MINUTO DESPUÉS" title="LO DESPEGAS Y MIRAS" />
    <div style={{ position: "absolute", left: 960, top: 560, perspective: 1600 }}>
      <div style={{ position: "absolute", left: -230, top: -230, width: 460, height: 460, transformStyle: "preserve-3d", transform: `rotateY(${r}deg)` }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}><Tile x={230} y={230} s={460} tt={tt} /></div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}><TileBack x={230} y={230} s={460} full={cl((tt - 2.4) / 1.6) * 0.96} /></div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1450, top: 460, fontWeight: 900, fontSize: 120, color: c > 90 ? GRN : TX, fontVariantNumeric: "tabular-nums" }}>{c}%</div>
    <Check x={1560} y={680} s={60} p={cl((tt - 4.4) * 2)} />
    <Tag tt={tt} at={4.6} x={500} y={560} txt="CASI TODO CUBIERTO" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- 30:09 · LA PRUEBA DEL DEDO: dos dedos tocan el adhesivo; uno sale manchado (sirve), el otro limpio (se formó la piel) ----
export const HFinger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const d1 = Math.sin(cl((tt - 0.8) / 1.4) * Math.PI), d2 = Math.sin(cl((tt - 2.6) / 1.4) * Math.PI);
  const finger = (x: number, d: number, dirty: boolean, at: number) => <>
    <div style={{ position: "absolute", left: x - 70, top: 200 + d * 300, width: 140, height: 380, borderRadius: "70px 70px 20px 20px", background: "linear-gradient(90deg, #d9a07c, #f0c4a0 40%, #c98a64)" }}>
      <div style={{ position: "absolute", left: 30, top: 20, width: 80, height: 70, borderRadius: "40px 40px 16px 16px", background: "rgba(255,240,230,.5)" }} />
      {dirty && tt > at + 0.7 && <div style={{ position: "absolute", left: 10, top: -2, width: 120, height: 60, borderRadius: "60px 60px 0 0", background: "#8f8a80" }} />}
    </div>
  </>;
  return <>
    <Head tt={tt} kick="¿TODAVÍA SIRVE?" title="TÓCALO CON LA PUNTA DEL DEDO" />
    <div style={{ position: "absolute", left: 360, top: 760, width: 500, height: 120, background: "repeating-linear-gradient(0deg, #9a958a 0 20px, #7f7a6f 20px 28px)", borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 1060, top: 760, width: 500, height: 120, background: "repeating-linear-gradient(0deg, #a8a398 0 20px, #8f8a80 20px 28px)", borderRadius: 10, boxShadow: "inset 0 0 0 6px rgba(255,255,255,.25)" }} />
    {finger(610, d1, true, 0.8)}{finger(1310, d2, false, 2.6)}
    <Check x={610} y={330} s={60} p={cl((tt - 2.2) * 2)} />
    <Cross x={1310} y={330} s={60} p={cl((tt - 4) * 2)} />
    <Tag tt={tt} at={2.2} x={610} y={960} txt="SALE CON ADHESIVO: SIRVE" col={GRN} size={30} />
    <Tag tt={tt} at={4} x={1310} y={960} txt="SALE LIMPIO: TIENE PIEL" col={RED} size={30} />
  </>;
}}</Stage>;

// ---- 30:30 · EL CAFÉ DEL ALBAÑIL: reloj de 20 min mientras la media pared peinada se pone opaca (la piel) ----
export const HBreak: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const m = Math.round(eio(tt, 0.8, 4.8) * 20), sk = cl((tt - 1) / 4);
  return <>
    <Head tt={tt} kick="POR QUÉ SE SOLTABAN LOS DE ANTES" title="SE IBA A TOMAR ALGO" col={RED} />
    <div style={{ position: "absolute", left: 320, top: 300, width: 700, height: 520, borderRadius: 12, background: `repeating-linear-gradient(0deg, rgb(${154 + sk * 30},${149 + sk * 30},${138 + sk * 30}) 0 22px, #7f7a6f 22px 30px)`, filter: `saturate(${1 - sk * 0.6})`, boxShadow: "0 30px 70px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", inset: 0, background: `rgba(220,215,205,${0.45 * sk})` }} />
    </div>
    <svg width={340} height={340} style={{ position: "absolute", left: 1220, top: 300 }}><circle cx={170} cy={170} r={150} fill="#fbf7ee" /><path d={`M170 170 L170 20 A150 150 0 ${m > 30 ? 1 : 0} 1 ${170 + 150 * Math.sin(m / 60 * 6.283)} ${170 - 150 * Math.cos(m / 60 * 6.283)} Z`} fill={RED} opacity={0.7} /><line x1={170} y1={170} x2={170 + 120 * Math.sin(m / 60 * 6.283)} y2={170 - 120 * Math.cos(m / 60 * 6.283)} stroke="#222" strokeWidth={8} strokeLinecap="round" /></svg>
    <div style={{ position: "absolute", left: 1390, top: 680, transform: "translateX(-50%)", fontWeight: 900, fontSize: 70, color: TX }}>{m} MIN</div>
    <div style={{ position: "absolute", left: 1600, top: 470, width: 120, height: 130, borderRadius: "0 0 30px 30px", background: "#f4f1ea", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>{[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 30 + i * 30, top: -70 - ((tt * 30 + i * 20) % 50), width: 10, height: 40, borderRadius: 5, background: "rgba(255,255,255,.35)", filter: "blur(3px)" }} />)}</div>
    <Tag tt={tt} at={4.6} x={670} y={900} txt="PEGABA SOBRE ADHESIVO CON PIEL" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 31:11 · LAS CRUCETAS: crucecitas de 2 y 3 mm vuelan a las juntas alrededor del azulejo nuevo ----
export const HCross: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const S = 240, G = 18, x0 = 960 - (3 * S + 2 * G) / 2, y0 = 300;
  const pts = [[1, 1], [2, 1], [1, 2], [2, 2]];
  return <>
    <Head tt={tt} kick="SEPARADORES" title="LA MISMA JUNTA QUE LOS OTROS" />
    <div style={{ position: "absolute", left: x0 - G, top: y0 - G, width: 3 * S + 4 * G, height: 3 * S + 4 * G, background: "#5a554c", borderRadius: 6 }} />
    {Array.from({ length: 9 }, (_, i) => <Tile key={i} x={x0 + (i % 3) * (S + G) + S / 2} y={y0 + Math.floor(i / 3) * (S + G) + S / 2} s={S} tt={tt} glow={i === 4 ? 0.4 : 0} />)}
    {pts.map(([c, r], i) => { const k = phys(tt, 1 + i * 0.4, 7, 0.45), x = x0 + c * (S + G) - G / 2, y = y0 + r * (S + G) - G / 2;
      return <div key={i} style={{ position: "absolute", left: x + (1 - k) * 600 * (i % 2 ? 1 : -1), top: y - (1 - k) * 300, transform: `translate(-50%,-50%) rotate(${(1 - k) * 360}deg)`, opacity: cl(k * 2) }}><div style={{ position: "absolute", left: -36, top: -6, width: 72, height: 12, background: "#5aa6e8", borderRadius: 3 }} /><div style={{ position: "absolute", left: -6, top: -36, width: 12, height: 72, background: "#5aa6e8", borderRadius: 3 }} /></div>; })}
    <div style={{ position: "absolute", left: 1500, top: 420, fontWeight: 900, fontSize: 80, color: ICE }}>2 MM</div>
    <div style={{ position: "absolute", left: 1500, top: 520, fontWeight: 800, fontSize: 28, color: DIM, letterSpacing: 2 }}>SI TU JUNTA ES DE 2</div>
  </>;
}}</Stage>;

// ---- 32:13 · NO TOCARLO: reloj de 24 h que gira; cada vez que una mano se acerca, aparece la cruz roja ----
export const HWait: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const hr = Math.round(eio(tt, 0.8, 6) * 24), hand = Math.max(0, Math.sin((tt - 2) * 2.2)) * cl(tt - 2) * (tt < 5.5 ? 1 : 0);
  return <>
    <Head tt={tt} kick="LO MÁS DIFÍCIL DE TODO" title="NO TOCARLO" col={RED} />
    <svg width={460} height={460} style={{ position: "absolute", left: 360, top: 300 }}>
      <circle cx={230} cy={230} r={200} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={30} />
      <circle cx={230} cy={230} r={200} fill="none" stroke={AMB} strokeWidth={30} strokeDasharray={1257} strokeDashoffset={1257 * (1 - hr / 24)} transform="rotate(-90 230 230)" strokeLinecap="round" />
    </svg>
    <div style={{ position: "absolute", left: 590, top: 530, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 110, color: TX, fontVariantNumeric: "tabular-nums" }}>{hr} H</div>
    <Tile x={1300} y={530} s={320} tt={tt} />
    <div style={{ position: "absolute", left: 1520 - hand * 120, top: 470, width: 240, height: 110, borderRadius: 55, background: "linear-gradient(90deg, #f0c4a0, #d9a07c)", opacity: hand }} />
    <Cross x={1300} y={530} s={110} p={hand > 0.6 ? 1 : 0} />
    <Tag tt={tt} at={3} x={1300} y={810} txt="NI PARA VER SI QUEDÓ FIRME" col={DIM} size={30} />
  </>;
}}</Stage>;

// ---- 33:00 · EL COLOR DE LA JUNTA: muestras sobre cartón; blanco + pizca de gris hasta que coincide con la junta vieja ----
export const HColor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const C = ["#f4f2ec", "#e4e0d6", "#d2cbbb", "#bfb6a2"], m = Math.min(3, Math.floor(cl((tt - 0.8) / 4) * 4)), ok = m === 2;
  return <>
    <Head tt={tt} kick="LA LECHADA" title="DEL COLOR DE TU JUNTA" />
    <div style={{ position: "absolute", left: 360, top: 300, width: 520, height: 520, background: "#5a554c", padding: 14, boxSizing: "border-box", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, borderRadius: 8 }}>
      {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ background: "#f1ead8", borderRadius: 3, outline: "7px solid #c8bfac" }} />)}
    </div>
    <div style={{ position: "absolute", left: 1020, top: 330, width: 560, height: 420, background: "#b9915e", borderRadius: 8, boxShadow: "0 30px 70px rgba(0,0,0,.5)" }}>
      {C.map((c, i) => { const k = phys(tt, 0.8 + i * 1, 7, 0.5); if (i > m) return null; return <div key={i} style={{ position: "absolute", left: 40 + i * 128, top: 120, width: 100, height: 180, borderRadius: 50, background: c, transform: `scale(${k})`, boxShadow: i === 2 && ok ? `0 0 0 6px ${GRN}` : "none" }} />; })}
    </div>
    <Tag tt={tt} at={1} x={1300} y={300} txt="PRUEBA EN UN CARTÓN" col={DIM} size={28} />
    <Tag tt={tt} at={4} x={1300} y={820} txt={ok ? "ESTE: IGUAL A LA VIEJA" : "UNA PIZCA DE GRIS…"} col={ok ? GRN : TX} size={34} />
  </>;
}}</Stage>;

// ---- 33:23 · DE BRILLO A OPACO: la lechada fresca brilla; con 15 min se apaga y ahí se limpia en diagonal ----
export const HHaze: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const m = Math.round(eio(tt, 0.6, 3.6) * 15), dull = cl((tt - 0.6) / 3), wipe = eio(tt, 4, 6);
  return <>
    <Head tt={tt} kick="CUÁNDO LIMPIAR" title="CUANDO SE PONE OPACA" />
    <div style={{ position: "absolute", left: 360, top: 300, width: 900, height: 520, background: "#c8bfac", borderRadius: 8, overflow: "hidden" }}>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i % 3) * 300 + 10, top: Math.floor(i / 3) * 260 + 10, width: 280, height: 240, background: "#f1ead8" }} />)}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${120}deg, rgba(255,255,255,${0.55 * (1 - dull)}), transparent 40%), rgba(200,192,175,${0.6 - 0.6 * wipe})`, clipPath: `polygon(${wipe * 140}% 0, 100% 0, 100% 100%, ${wipe * 140 - 40}% 100%)` }} />
    </div>
    <div style={{ position: "absolute", left: 1360, top: 380, fontWeight: 900, fontSize: 110, color: AMB, fontVariantNumeric: "tabular-nums" }}>{m} MIN</div>
    <Tag tt={tt} at={1.6} x={1500} y={560} txt={dull < 0.9 ? "BRILLA: ESPERA" : "OPACA: AHORA"} col={dull < 0.9 ? DIM : GRN} size={34} />
    <Tag tt={tt} at={4.2} x={810} y={900} txt="ESPONJA HÚMEDA EN DIAGONAL" col={TX} size={34} />
  </>;
}}</Stage>;

// ---- 34:03 · LA QUE SE PONE NEGRA: 1 año, 5, 10; la junta común se oscurece con grasa y la epoxi queda igual ----
export const HBlack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const y = eio(tt, 1, 5), yr = Math.round(y * 10);
  const strip = (x: number, dark: number, n: string, c: string) => <div style={{ position: "absolute", left: x, top: 300, width: 520, height: 520, background: `rgb(${200 - dark * 120},${192 - dark * 125},${175 - dark * 125})`, padding: 22, boxSizing: "border-box", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, borderRadius: 8 }}>
    {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ background: "#f1ead8", borderRadius: 3 }} />)}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: -70, textAlign: "center", fontWeight: 900, fontSize: 34, color: c }}>{n}</div>
  </div>;
  return <>
    <Head tt={tt} kick="ATRÁS DE LA ESTUFA" title="LECHADA EPOXI" />
    {strip(360, y, "CEMENTICIA", RED)}{strip(1040, y * 0.05, "EPOXI", GRN)}
    <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 60, color: TX, textAlign: "center", lineHeight: 1 }}>{yr}<br /><span style={{ fontSize: 22, color: DIM, letterSpacing: 3 }}>AÑOS</span></div>
  </>;
}}</Stage>;

// ---- 35:07 · EL ORDEN: las tarjetas "pegar" y "agua" se intercambian: 1 cortar el agua, 2 secar, 3 recién pegar ----
export const HOrder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sw = eio(tt, 2, 3.4);
  const card = (i: number, txt: string, c: string, y: number) => <div style={{ position: "absolute", left: 960 - 330, top: y, width: 660, height: 130, borderRadius: 22, background: "rgba(18,18,22,.92)", border: `3px solid ${c}`, display: "flex", alignItems: "center", gap: 30, padding: "0 34px", boxSizing: "border-box", boxShadow: "0 20px 60px rgba(0,0,0,.5)", opacity: cl(phys(tt, 0.5 + i * 0.3, 6, 0.5) * 2) }}>
    <div style={{ width: 74, height: 74, borderRadius: "50%", background: c, color: "#111", fontWeight: 900, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
    <div style={{ fontWeight: 900, fontSize: 40, color: TX }}>{txt}</div>
  </div>;
  return <>
    <Head tt={tt} kick="SI ATRÁS HAY AGUA" title="EL ORDEN ES OTRO" col={ICE} />
    {card(0, "CORTAR EL AGUA", ICE, 300 + sw * 0 + (1 - sw) * 360)}
    {card(1, "SECAR", AMB, 480)}
    {card(2, "RECIÉN PEGAR", GRN, 660 - (1 - sw) * 360)}
    <Tag tt={tt} at={4.4} x={960} y={900} txt="CAÑO QUE PIERDE = PLOMERO" col={TX} size={34} />
  </>;
}}</Stage>;

// ---- 37:07 · EN EL MOSTRADOR: el ticket de la ferretería se imprime renglón por renglón ----
export const HCounter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const L = ["Adhesivo epoxi fluido · 2 componentes", "Jeringa grande de plástico", "Broca de 3 mm para cerámica", "½ kg de lechada color de mi junta", "Bolsa chica de adhesivo flexible"];
  const p = eio(tt, 0.8, 5.6);
  return <>
    <Head tt={tt} kick="PALABRA POR PALABRA" title="LO QUE PIDES EN LA FERRETERÍA" />
    <div style={{ position: "absolute", left: 960 - 330, top: 250, width: 660, height: 120, borderRadius: 16, background: "#2b2b30" }} />
    <div style={{ position: "absolute", left: 960 - 290, top: 300, width: 580, height: 100 + p * 580, background: "#fbf8f1", boxShadow: "0 30px 80px rgba(0,0,0,.6)", WebkitMaskImage: "linear-gradient(180deg, #000 calc(100% - 18px), transparent)", padding: "40px 40px 0", boxSizing: "border-box", overflow: "hidden" }}>
      <div style={{ fontWeight: 900, fontSize: 26, letterSpacing: 6, color: "#555", textAlign: "center", marginBottom: 24 }}>FERRETERÍA</div>
      {L.map((l, i) => <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", fontFamily: "monospace", fontSize: 28, color: "#222", marginBottom: 26, opacity: cl(p * 6 - i - 0.6) }}><span style={{ color: AMB, fontWeight: 900 }}>■</span>{l}</div>)}
    </div>
  </>;
}}</Stage>;

// ---- 38:08 · LO DE ABAJO SE DESPEGA: tres capas apiladas; la nueva queda pegada a la vieja y se separan juntas de la pared ----
export const HUnder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const off = eio(tt, 2.4, 4.4) * 140;
  return <>
    <Head tt={tt} kick="ERROR Nº 2" title="ENCIMA DEL ADHESIVO VIEJO" col={RED} />
    <div style={{ position: "absolute", left: 360, top: 300, width: 160, height: 560, background: "#c9c2b4", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 520 + off, top: 300, display: "flex" }}>
      <div style={{ width: 70, height: 560, background: "#6e6a60" }} />
      <div style={{ width: 70, height: 560, background: "#a19c92" }} />
      <div style={{ width: 60, height: 560, background: "#f1ead8", borderRadius: "0 6px 6px 0" }} />
    </div>
    {off > 10 && <div style={{ position: "absolute", left: 520, top: 300, width: off, height: 560, background: "repeating-linear-gradient(45deg, rgba(255,90,74,.25) 0 14px, transparent 14px 28px)" }} />}
    <Tag tt={tt} at={1} x={590} y={260} txt="VIEJO" col={DIM} size={28} />
    <Tag tt={tt} at={1.3} x={660} y={900} txt="NUEVO" col={TX} size={28} />
    <Tag tt={tt} at={4.4} x={1350} y={560} txt="SE VAN LOS DOS" col={RED} size={56} />
  </>;
}}</Stage>;

// ---- 39:25 · ADENTRO DE LA DUCHA: la bolsa de adhesivo y la de lechada con el sello "ZONAS HÚMEDAS" y gotas que resbalan ----
export const HShower: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const bag = (x: number, n: string, at: number) => { const k = phys(tt, at, 6, 0.5); return <div style={{ position: "absolute", left: x, top: 320, width: 360, height: 480, borderRadius: "30px 30px 18px 18px", background: "linear-gradient(180deg, #e9e4d8, #c9c2b4)", transform: `translateY(${(1 - k) * -200}px) rotate(${(1 - k) * 8}deg)`, opacity: cl(k * 2), boxShadow: "0 30px 70px rgba(0,0,0,.5)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontWeight: 900, fontSize: 36, color: "#333" }}>{n}</div>
    <div style={{ position: "absolute", left: 40, right: 40, top: 220, height: 120, borderRadius: 60, border: `6px solid ${ICE}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 30, color: "#2a6aa8", transform: `scale(${phys(tt, at + 1.4, 8, 0.4)}) rotate(-8deg)` }}>ZONAS HÚMEDAS</div>
  </div>; };
  return <>
    <Head tt={tt} kick="«¿Y EN LA DUCHA?»" title="EL MISMO ARREGLO, DOS CUIDADOS" col={ICE} />
    {bag(560, "ADHESIVO", 0.8)}{bag(1000, "LECHADA", 1.4)}
    {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 520 + rnd(i) * 900, top: ((tt * 260 + rnd(i + 3) * 1000) % 900) + 100, width: 4, height: 40, borderRadius: 2, background: "rgba(150,210,255,.4)" }} />)}
  </>;
}}</Stage>;

// ---- 40:04 · HACE 10 AÑOS Y NO SE CAYÓ: tres casillas; si las tres dan verde, se puede esperar (marcarlo y golpearlo) ----
export const HTenYears: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const R2 = ["NO SE MUEVE", "NO TIENE RAJADURA", "NO ESTÁ ARRIBA DE DONDE COMES"];
  return <>
    <Head tt={tt} kick="«¿LO TENGO QUE ARREGLAR?»" title="PUEDES ESPERAR SI…" />
    {R2.map((r, i) => { const k = phys(tt, 0.8 + i * 0.8, 6, 0.5); return <div key={i} style={{ position: "absolute", left: 420, top: 320 + i * 150, display: "flex", alignItems: "center", gap: 40, opacity: cl(k * 2), transform: `translateX(${(1 - k) * -80}px)` }}>
      <div style={{ width: 100, height: 100, borderRadius: 18, border: `5px solid ${GRN}`, position: "relative" }}><Check x={50} y={50} s={60} p={cl((tt - 1.4 - i * 0.8) * 2)} /></div>
      <div style={{ fontWeight: 900, fontSize: 50, color: TX }}>{r}</div>
    </div>; })}
    <Tag tt={tt} at={4.4} x={960} y={860} txt="MÁRCALO Y GOLPÉALO CADA TANTO" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 42:12 · 45 AÑOS DESPUÉS: la pared con todos iguales; un escáner busca cuál es el de la caja y no lo encuentra ----
export const HTwin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sx = 300 + ((tt - 0.8) * 420) % 1320, rv = cl((tt - 4.6) * 2);
  return <>
    <Head tt={tt} kick="UNO DE LOS DOCE DE LA CAJA" title="¿CUÁL ES?" col={GRN} />
    <div style={{ position: "absolute", left: 300, top: 300, width: 1320, height: 540, display: "flex", flexWrap: "wrap", gap: 8, padding: 8, background: "#a59d8b", borderRadius: 8, boxSizing: "border-box" }}>
      {Array.from({ length: 32 }, (_, i) => <div key={i} style={{ position: "relative", width: 155, height: 124 }}><Tile x={77} y={62} s={124} tt={tt} style={{ width: 155, left: 0 }} />{i === 15 && rv > 0 && <div style={{ position: "absolute", inset: -6, border: `6px solid ${GRN}`, borderRadius: 10, opacity: rv }} />}</div>)}
    </div>
    {tt < 4.6 && <div style={{ position: "absolute", left: sx, top: 290, width: 8, height: 560, background: ICE, boxShadow: `0 0 30px ${ICE}` }} />}
    {rv > 0 && <div style={{ position: "absolute", left: 1220, top: 860, fontFamily: HAND, fontSize: 60, color: GRN, opacity: rv }}>éste · 2026</div>}
    <Tag tt={tt} at={2} x={960} y={920} txt="NO SE NOTA CUÁL ES" col={TX} size={36} />
  </>;
}}</Stage>;
