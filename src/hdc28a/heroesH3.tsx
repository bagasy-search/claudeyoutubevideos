// componentes únicos de hdc28a · C: minutos 12-23 (agua, mezcla, plantar, sol, riego, comida, cortar hojas).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Arrow, Bar, Big, Bulb, Clove, Leaf, Pot, SOIL, SOIL2, X } from "./heroesH";

// ---- 11:50 · CUÁNTOS ENTRAN: vista desde arriba de tres macetas, los dientes caen uno por uno y cuentan ----
export const HCapacity: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const P: [string, number, number, number, string][] = [["REDONDA 30 CM", 300, 300, 7, "6-7"], ["JARDINERA 60 CM", 520, 220, 14, "12-14"], ["BALDE 20 L", 300, 300, 9, "8-9"]];
  return <>
    <Head tt={tt} kick="DESDE ARRIBA" title="CUÁNTOS DIENTES ENTRAN" />
    {P.map(([n, w, hh, k, lab], i) => { const cx = [400, 960, 1520][i], cy = 560, round = i !== 1; return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: cx - w / 2, top: cy - hh / 2, width: w, height: hh, borderRadius: round ? "50%" : 30, background: `radial-gradient(circle, ${SOIL}, ${SOIL2})`, border: `16px solid ${i === 2 ? "#dfe4e8" : "#c97650"}`, boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
      {Array.from({ length: k }, (_, j) => { const p = phys(tt, 0.6 + i * 0.4 + j * 0.12, 8, 0.5), a = (j / k) * Math.PI * 2;
        const x = round ? cx + Math.cos(a) * (j === k - 1 && k > 7 ? 0 : w * 0.28) : cx - 200 + (j % 7) * 66, y = round ? cy + Math.sin(a) * (j === k - 1 && k > 7 ? 0 : hh * 0.28) : cy - 45 + Math.floor(j / 7) * 90;
        return <div key={j} style={{ position: "absolute", left: x - 14, top: y - 14 - (1 - p) * 120, width: 28, height: 28, borderRadius: "50%", background: "#f3eee2", opacity: cl(p * 3), boxShadow: "0 6px 8px rgba(0,0,0,.5)" }} />; })}
      <Tag tt={tt} at={1.4 + i * 0.6} x={cx} y={790} txt={n} col={DIM} size={28} />
      <Tag tt={tt} at={1.8 + i * 0.6} x={cx} y={850} txt={lab} col={i === 2 ? GRN : AMB} size={54} />
    </React.Fragment>; })}
    <Tag tt={tt} at={4.4} x={1520} y={940} txt="DE LAS MEJORES" col={GRN} size={28} />
  </>;
}}</Stage>;

// ---- 12:10 · LOS PIES MOJADOS: maceta sin agujeros se llena y el diente se ahoga; con agujeros + piedritas el agua sale ----
export const HDrain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const w = eio(tt, 0.6, 3.2), out = eio(tt, 1.2, 4.2);
  return <>
    <Head tt={tt} kick="LO QUE MÁS AJOS MATA" title="EL AGUA PARADA" col={RED} />
    <Pot x={560} y={330} w={440} h={520}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${70 * w}%`, background: "linear-gradient(180deg, rgba(90,140,180,.55), rgba(40,70,100,.75))" }} /><div style={{ position: "absolute", left: 150, top: 160 }}><Clove x={60} y={80} s={0.9} /></div><div style={{ position: "absolute", left: 140, top: 140, width: 140, height: 160, borderRadius: "40%", background: "radial-gradient(rgba(90,70,40,.8), transparent 70%)", opacity: cl((tt - 3) * 0.8) }} /></Pot>
    <Pot x={1360} y={330} w={440} h={520} stones><div style={{ position: "absolute", left: 0, right: 0, bottom: 46, height: `${30 * (1 - out) * w}%`, background: "linear-gradient(180deg, rgba(90,140,180,.4), rgba(40,70,100,.5))" }} /><div style={{ position: "absolute", left: 150, top: 160 }}><Clove x={60} y={80} s={0.9} /></div></Pot>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 1250 + i * 70, top: 860 + ((tt * 220 + i * 60) % 160), width: 12, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#8cc8f0", opacity: cl(tt - 1.4) }} />)}
    <Tag tt={tt} at={3.4} x={560} y={920} txt="SIN AGUJEROS: PAPILLA MARRÓN" col={RED} size={32} />
    <Tag tt={tt} at={2.4} x={1360} y={300} txt="AGUJEROS + 2 DEDOS DE PIEDRITAS" col={GRN} size={32} />
  </>;
}}</Stage>;

// ---- 12:50 · LA MEZCLA 2-1-1: tres jarras vuelcan en el balde (tierra, compost, arena) y cae el puñado de ceniza ----
export const HMix: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const J: [string, string, number][] = [["TIERRA", "#4a3424", 2], ["COMPOST", "#2f2418", 1], ["ARENA", "#cdb68a", 1]];
  let lvl = 0;
  return <>
    <Head tt={tt} kick="SIEMPRE IGUAL" title="2 · 1 · 1" />
    <div style={{ position: "absolute", left: 760, top: 520, width: 400, height: 420, clipPath: "polygon(0 0, 100% 0, 92% 100%, 8% 100%)", background: "#d9dde0", overflow: "hidden" }}>
      {J.map(([, c, n], i) => { const f = eio(tt, 0.8 + i * 1.2, 1.8 + i * 1.2); const hgt = 100 * n * f; const b = lvl; lvl += hgt; return <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: b, height: hgt, background: c }} />; })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: lvl, height: 20 * eio(tt, 4.6, 5.2), background: "#8e8a85" }} />
    </div>
    {J.map(([n, c, k], i) => { const a = eio(tt, 0.4 + i * 1.2, 0.9 + i * 1.2) * (1 - eio(tt, 1.9 + i * 1.2, 2.3 + i * 1.2)); return <div key={i} style={{ position: "absolute", left: 300 + i * 0, top: 330 - i * 0, opacity: a > 0.02 ? 1 : 0.0 }}>
      <div style={{ position: "absolute", left: 420, top: 0, width: 180, height: 200, borderRadius: "16px 16px 30px 30px", background: "rgba(255,255,255,.18)", border: "4px solid rgba(255,255,255,.5)", transformOrigin: "100% 100%", transform: `rotate(${70 * a}deg)` }}><div style={{ position: "absolute", left: 8, right: 8, bottom: 8, height: 120, borderRadius: 20, background: c }} /></div>
      <div style={{ position: "absolute", left: 420, top: -60, width: 300, fontWeight: 900, fontSize: 36 }}>{k} {n}</div>
    </div>; })}
    {J.map(([n, , k], i) => <Tag key={i} tt={tt} at={1.4 + i * 1.2} x={1500} y={480 + i * 80} txt={`${k} × ${n}`} col={i === 2 ? AMB : TX} size={40} anchor="l" />)}
    <Tag tt={tt} at={4.8} x={1500} y={740} txt="+ 1 PUÑADO DE CENIZA" col={DIM} size={34} anchor="l" />
  </>;
}}</Stage>;

// ---- 13:35 · LA BALANZA DEL NITRÓGENO: estiércol fresco / abono verde → hojas gigantes y cabeza chiquita ----
export const HNitro: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const n = eio(tt, 1, 4);
  return <>
    <Head tt={tt} kick="LO QUE NO TIENE QUE IR" title="NITRÓGENO DE MÁS" col={RED} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, bottom: 0, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    {Array.from({ length: 8 }, (_, i) => <Leaf key={i} x={900 + i * 18} y={640} len={180 + 300 * n * (0.7 + 0.3 * Math.sin(i * 2.1))} rot={(i - 3.5) * 9} w={18 + 14 * n} col={n > 0.5 ? "#3f8a3a" : undefined} />)}
    <Bulb x={960} y={760} s={0.55 - 0.32 * n} />
    <div style={{ position: "absolute", left: 260, top: 380, width: 280, height: 300, borderRadius: 20, background: "linear-gradient(180deg,#3c9a4a,#2a7036)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 30, color: "#e8f7e0", transform: `rotate(-6deg) translateY(${(1 - phys(tt, 0.4, 6, 0.5)) * -300}px)` }}><div style={{ fontSize: 70 }}>N</div>ABONO DEL PASTO</div>
    <X x={400} y={530} p={cl((tt - 3.4) * 2)} s={300} />
    <Tag tt={tt} at={2.6} x={1450} y={400} txt="HOJAS Y HOJAS" col={GRN} size={42} anchor="l" />
    <Tag tt={tt} at={3.4} x={1450} y={820} txt="Y NADA DE CABEZA" col={RED} size={42} anchor="l" />
  </>;
}}</Stage>;

// ---- 14:20 · PUNTA AL CIELO: el diente acostado o al revés tuerce el brote dando la vuelta; el derecho sale recto ----
export const HUpright: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const g = eio(tt, 1, 4.6);
  return <>
    <Head tt={tt} kick="LA POSICIÓN" title="LA PUNTA, SIEMPRE ARRIBA" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, bottom: 0, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    <Clove x={560} y={700} s={1.4} />
    <Leaf x={560} y={600} len={520 * g} rot={0} w={16} />
    <Clove x={1360} y={700} s={1.4} rot={180} />
    <svg viewBox="0 0 400 700" style={{ position: "absolute", left: 1160, top: 0, width: 400, height: 700, overflow: "visible" }}>
      <path d="M200 790 C200 900 330 880 320 760 C310 620 200 600 230 380" stroke="#7dbf63" strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray={1000} strokeDashoffset={1000 * (1 - g * 0.7)} />
    </svg>
    <Tag tt={tt} at={2} x={560} y={300} txt="SALE DERECHO" col={GRN} size={40} />
    <Tag tt={tt} at={3.4} x={1360} y={300} txt="AL REVÉS: TARDE Y TORCIDO" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 15:05 · LA REGLA DEL DEDO: el índice entra a la tierra hasta la segunda raya = 5 cm ----
export const HFinger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const d = eio(tt, 0.8, 2.6);
  return <>
    <Head tt={tt} kick="SIN REGLA" title="HASTA LA SEGUNDA RAYA" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, bottom: 0, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    <div style={{ position: "absolute", left: 860, top: 160 + 220 * d, width: 140, height: 560, borderRadius: "70px 70px 40px 40px", background: "linear-gradient(90deg,#c88e6c,#ecb898 50%,#c88e6c)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      {[180, 330].map((y, i) => <div key={i} style={{ position: "absolute", left: 20, right: 20, top: 560 - y, height: 6, borderRadius: 3, background: "rgba(120,70,50,.6)" }} />)}
      <div style={{ position: "absolute", left: 30, right: 30, top: 0, height: 70, borderRadius: "40px 40px 10px 10px", background: "rgba(255,240,230,.6)", transform: "rotate(180deg)", transformOrigin: "50% 50%", bottom: 0 }} />
    </div>
    <div style={{ position: "absolute", left: 1040, top: 560, width: 8, height: 230 * d, background: AMB }} />
    <Big x={1250} y={680} txt="5 CM" s={phys(tt, 2.6, 6, 0.5)} col={AMB} size={110} />
    <Tag tt={tt} at={3.4} x={600} y={680} txt="3 A 5 CM DE TIERRA ARRIBA" col={TX} size={34} />
  </>;
}}</Stage>;

// ---- 15:25 · TRES ALTURAS: muy arriba (pájaro), justo (3-5), muy hondo (10-15, se pudre en el camino) ----
export const HZones: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const Z: [number, string, string][] = [[80, "MUY ARRIBA", RED], [260, "3-5 CM · JUSTO", GRN], [520, "10-15 CM", RED]];
  return <>
    <Head tt={tt} kick="LA PROFUNDIDAD" title="EL PUNTO JUSTO" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, bottom: 0, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2} 80%)` }} />
    {Z.map(([dy, n, c], i) => { const p = phys(tt, 0.6 + i * 0.9, 6, 0.5); return <React.Fragment key={i}>
      <Clove x={480 + i * 480} y={380 + dy - 60 * (1 - p)} s={1.2} op={cl(p * 2)} />
      {i === 1 && <div style={{ position: "absolute", left: 480 + i * 480 - 170, top: 380 + dy - 120, width: 340, height: 240, borderRadius: 30, border: `5px solid ${GRN}`, boxShadow: `0 0 40px ${GRN}55`, opacity: cl((tt - 2) * 2) }} />}
      {i === 2 && <div style={{ position: "absolute", left: 1440 - 100, top: 380 + dy - 100, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(rgba(80,60,30,.8), transparent 70%)", opacity: cl(tt - 3.6) }} />}
      <Tag tt={tt} at={1 + i * 0.9} x={480 + i * 480} y={i === 2 ? 1030 : 340} txt={n} col={c} size={36} />
    </React.Fragment>; })}
    <svg viewBox="0 0 120 60" style={{ position: "absolute", left: 360 + 150 * eio(tt, 1.2, 2.4), top: 250 - 60 * Math.abs(Math.sin(tt * 3)), width: 120, height: 60, opacity: cl(tt - 1) }}>
      <path d="M0 30 Q30 0 60 30 Q90 0 120 30" stroke="#2a2a2a" strokeWidth={8} fill="none" strokeLinecap="round" />
    </svg>
  </>;
}}</Stage>;

// ---- 15:55 · EL PALMO: vista de arriba; mano abierta mide; 10-12 cm entre dientes y 5 del borde que se calienta ----
export const HSpacing: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const p = eio(tt, 0.6, 3), hot = 0.5 + 0.5 * Math.sin(tt * 3);
  return <>
    <Head tt={tt} kick="LA DISTANCIA" title="10 A 12 CM ENTRE DIENTES" />
    <div style={{ position: "absolute", left: 460, top: 260, width: 1000, height: 680, borderRadius: "50%", background: `radial-gradient(circle, ${SOIL}, ${SOIL2})`, border: `22px solid rgba(255,${130 - 60 * hot},70,1)`, boxShadow: `0 0 ${30 + 30 * hot}px rgba(255,120,60,.5)` }} />
    {[[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [0, 1]].map(([a, b], i) => { const q = phys(tt, 0.4 + i * 0.25, 7, 0.5); return <div key={i} style={{ position: "absolute", left: 960 + a * 260 - 22, top: 600 + b * 200 - 22 - (1 - q) * 100, width: 44, height: 44, borderRadius: "50%", background: "#f3eee2", opacity: cl(q * 3) }} />; })}
    <div style={{ position: "absolute", left: 960, top: 600 - 18, width: 260 * p, height: 6, background: AMB }} />
    <Tag tt={tt} at={2.4} x={1090} y={550} txt="10-12 CM" col={AMB} size={36} />
    <Tag tt={tt} at={3.4} x={960} y={1000} txt="5 CM DEL BORDE · EL BORDE SE CALIENTA" col={RED} size={32} />
  </>;
}}</Stage>;

// ---- 16:30 · SIN BOLSAS DE AIRE: la palma aprieta y las burbujas alrededor del diente desaparecen; el riego sale por abajo ----
export const HPress: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pr = eio(tt, 1, 2.2), wt = eio(tt, 3, 5);
  return <>
    <Head tt={tt} kick="DESPUÉS DE TAPAR" title="APRETÁS SUAVE" />
    <div style={{ position: "absolute", left: 360, right: 360, top: 520 + 30 * pr, bottom: 120, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, borderRadius: 20 }} />
    <Clove x={960} y={780} s={1.2} />
    {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 960 + Math.cos(i * 0.63) * 150 - 18, top: 780 + Math.sin(i * 0.63) * 120 - 18, width: 36 * (1 - pr), height: 36 * (1 - pr), borderRadius: "50%", background: "rgba(10,8,6,.9)", border: "2px solid rgba(255,255,255,.2)" }} />)}
    <div style={{ position: "absolute", left: 760, top: 240 + 260 * pr - 200 * eio(tt, 2.4, 3), width: 400, height: 260, borderRadius: "120px 120px 60px 60px", background: "linear-gradient(180deg,#d39a78,#eab796)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 360, right: 360, top: 520 + 30, height: (430 - 30) * wt, background: "linear-gradient(180deg, rgba(110,170,220,.25), rgba(110,170,220,.15))", borderRadius: 20 }} />
    <Tag tt={tt} at={2.2} x={1640} y={600} txt="SIN AIRE" col={GRN} size={40} />
    <Tag tt={tt} at={3.6} x={1640} y={680} txt="UN RIEGO LENTO" col={ICE} size={34} />
  </>;
}}</Stage>;

// ---- 17:10 · DE ABAJO HACIA ARRIBA: corte de la tierra; primero raíces (no se ven), después la aguja, después la hojita de 5 cm ----
export const HEmerge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const r = eio(tt, 0.6, 2.2), n = eio(tt, 2.2, 3.4), l = eio(tt, 3.4, 5);
  const wk = Math.max(1, Math.round(1 + 2 * eio(tt, 0.6, 5)));
  return <>
    <Head tt={tt} kick="CUÁNTO TARDA" title={`SEMANA ${wk} DE 1-3`} col={GRN} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, bottom: 0, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    <Clove x={960} y={720} s={1.3} />
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 930 + i * 8, top: 820, width: 4, height: 200 * r * (0.6 + 0.4 * Math.sin(i * 1.7) ** 2), background: "#f1e8d2", transformOrigin: "50% 0", transform: `rotate(${(i - 4) * 9}deg)` }} />)}
    <Leaf x={960} y={640} len={80 * n + 160 * l} rot={2} w={6 + 10 * l} />
    {[["1 · RAÍCES (NO SE VEN)", r], ["2 · LA AGUJA", n], ["3 · HOJITA DE 5 CM: AGARRÓ", l]].map(([s, p], i) => <div key={i} style={{ position: "absolute", left: 1260, top: 300 + i * 70, fontWeight: 900, fontSize: 34, color: (p as number) > 0.9 ? GRN : DIM, opacity: cl((p as number) * 3) }}>{s as string}</div>)}
  </>;
}}</Stage>;

// ---- 18:05 · EL ACOLCHADO: capa de 2-3 cm de paja cae sobre la tierra y deja un aro libre de dos dedos alrededor de cada brote ----
export const HMulch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const m = eio(tt, 0.8, 2.6), ring = cl((tt - 3) * 2);
  return <>
    <Head tt={tt} kick="UNA CAPA ARRIBA" title="EL ACOLCHADO" />
    <div style={{ position: "absolute", left: 300, right: 300, top: 600, bottom: 140, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, borderRadius: 20 }} />
    <div style={{ position: "absolute", left: 300, right: 300, top: 600 - 70 * m, height: 70 * m, background: "repeating-linear-gradient(100deg, #d8b770 0 8px, #b89550 8px 13px, #e6cb88 13px 19px)", borderRadius: 10 }} />
    {[600, 960, 1320].map((x, i) => <React.Fragment key={i}>
      <div style={{ position: "absolute", left: x - 60, top: 600 - 70 * m - 4, width: 120, height: 70 * m + 8, background: SOIL, opacity: ring, borderRadius: 8 }} />
      <Leaf x={x} y={600} len={260} rot={(i - 1) * 4} w={16} />
      <div style={{ position: "absolute", left: x - 70, top: 540, width: 140, height: 40, borderRadius: "50%", border: `4px dashed ${AMB}`, opacity: ring }} />
    </React.Fragment>)}
    <Tag tt={tt} at={1.8} x={1700} y={560} txt="2-3 CM" col={AMB} size={44} />
    <Tag tt={tt} at={3.4} x={960} y={980} txt="UN ARO LIBRE DE DOS DEDOS" col={TX} size={36} />
  </>;
}}</Stage>;

// ---- 18:35 · LAS HORAS DE SOL: el sol recorre su arco; las horas se encienden hasta 6 (y 8); a la sombra la cabeza queda chica ----
export const HSun: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 0.5, 4.2), a = Math.PI * (1 - p), hrs = Math.round(p * 8);
  return <>
    <Head tt={tt} kick="LO QUE MÁS SE DESCUIDA" title="6 HORAS DE SOL, MEJOR 8" />
    <div style={{ position: "absolute", left: 960 - 520, top: 820 - 520, width: 1040, height: 1040, borderRadius: "50%", border: "4px dashed rgba(255,255,255,.18)", clipPath: "inset(0 0 50% 0)" }} />
    <div style={{ position: "absolute", left: 960 + Math.cos(a) * 520 - 70, top: 820 - Math.sin(a) * 520 - 70, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, #fff6c8, #ffc44a 60%, rgba(255,180,60,0) 72%)", boxShadow: "0 0 90px rgba(255,200,80,.8)" }} />
    <div style={{ position: "absolute", left: 760, top: 850, display: "flex", gap: 8 }}>{Array.from({ length: 8 }, (_, i) => <div key={i} style={{ width: 44, height: 44, borderRadius: 10, background: i < hrs ? (i < 6 ? AMB : GRN) : "rgba(255,255,255,.08)" }} />)}</div>
    <Pot x={960} y={640} w={240} h={170}>{null}</Pot>
    {Array.from({ length: 6 }, (_, i) => <Leaf key={i} x={900 + i * 24} y={650} len={150} rot={(i - 2.5) * 6} w={12} />)}
    <Big x={960} y={420} txt={`${hrs} H`} s={phys(tt, 0.6, 6, 0.5)} col={AMB} size={100} />
    <Tag tt={tt} at={4.4} x={960} y={990} txt="MENOS SOL, MENOS CABEZA" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 19:15 · EL DEDO DICE SECO: corte de la tierra con el dedo hasta 2 cm; arriba seca (clara), abajo húmeda (oscura) ----
export const HDry: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const d = eio(tt, 0.6, 2), dry = cl((tt - 2.4) * 2);
  return <>
    <Head tt={tt} kick="CUÁNDO SE RIEGA" title="EL DEDO DICE SECO" col={ICE} />
    <div style={{ position: "absolute", left: 360, right: 360, top: 480, height: 120, background: `rgba(${150 + 40 * dry},${110 + 30 * dry},${70 + 20 * dry},1)`, borderRadius: "20px 20px 0 0" }} />
    <div style={{ position: "absolute", left: 360, right: 360, top: 600, bottom: 120, background: `linear-gradient(180deg, ${SOIL}, #2a1c12)`, borderRadius: "0 0 20px 20px" }} />
    <div style={{ position: "absolute", left: 900, top: 160 + 240 * d, width: 120, height: 440, borderRadius: "60px 60px 30px 30px", background: "linear-gradient(90deg,#c88e6c,#ecb898 50%,#c88e6c)" }} />
    <div style={{ position: "absolute", left: 1060, top: 480, width: 6, height: 120 * d, background: AMB }} />
    <Tag tt={tt} at={1.6} x={1200} y={540} txt="2 CM" col={AMB} size={44} anchor="l" />
    <Tag tt={tt} at={2.8} x={1500} y={540} txt="SECO → RIEGO" col={GRN} size={36} anchor="l" />
    <Tag tt={tt} at={3.6} x={1500} y={720} txt="HÚMEDO → ESPERO" col={ICE} size={36} anchor="l" />
  </>;
}}</Stage>;

// ---- 19:40 · PROFUNDO vs CHORRITO: dos cortes; el riego profundo baja hasta el fondo y las raíces lo siguen; el chorrito moja arriba ----
export const HDeepWater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const w = eio(tt, 0.6, 3), r = eio(tt, 1.6, 4.6);
  return <>
    <Head tt={tt} kick="CUANDO RIEGAS" title="RIEGAS BIEN" col={ICE} />
    {[0, 1].map((k) => { const x = 560 + k * 800, depth = k ? 0.25 : 1; return <React.Fragment key={k}>
      <div style={{ position: "absolute", left: x - 260, top: 380, width: 520, height: 560, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, borderRadius: 20, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${100 * depth * w}%`, background: "linear-gradient(180deg, rgba(110,170,230,.4), rgba(110,170,230,.15))" }} />
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 230 + i * 8, top: 90, width: 4, height: 440 * depth * r * (0.6 + 0.4 * Math.sin(i * 2) ** 2), background: "#f1e8d2", transformOrigin: "50% 0", transform: `rotate(${(i - 4) * (k ? 22 : 7)}deg)` }} />)}
      </div>
      <Leaf x={x} y={380} len={k ? 140 : 240} rot={k ? 14 : 2} w={14} col={k ? "#9fbf63" : undefined} />
    </React.Fragment>; })}
    <Tag tt={tt} at={2.4} x={560} y={990} txt="PROFUNDO, CADA TANTO" col={GRN} size={36} />
    <Tag tt={tt} at={3} x={1360} y={990} txt="CHORRITO DIARIO: FLOJA" col={RED} size={36} />
  </>;
}}</Stage>;

// ---- 20:05 · CORTAR EL RIEGO: hojas de abajo amarillas → la canilla se cierra; la cabeza arma sus pieles ----
export const HStopWater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const y = eio(tt, 0.4, 2.2), c = eio(tt, 2.4, 3.2), sk = eio(tt, 3.2, 5.4);
  return <>
    <Head tt={tt} kick="3-4 SEMANAS ANTES DE COSECHAR" title="SE CORTA EL RIEGO" col={AMB} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 620, bottom: 0, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})` }} />
    {Array.from({ length: 8 }, (_, i) => <Leaf key={i} x={560 + i * 14} y={620} len={160 + 40 * i} rot={(i - 3.5) * 11} w={16} col={i < 3 ? `rgb(${125 + 100 * y},${191 - 10 * y},${99 - 60 * y})` : undefined} />)}
    <Bulb x={620} y={760} s={0.7} />
    <div style={{ position: "absolute", left: 620 - 110, top: 760 - 130, width: 220, height: 270, borderRadius: "50% 50% 46% 46%", border: `6px solid rgba(240,225,190,${sk})`, boxShadow: `0 0 ${30 * sk}px rgba(240,225,190,.5)` }} />
    <div style={{ position: "absolute", left: 1880, top: 180, width: 60, height: 300, borderRadius: 10, background: "linear-gradient(90deg,#8d6b52,#a8836a)" }} />
    <div style={{ position: "absolute", left: 1560, top: 312, width: 340, height: 46, background: "linear-gradient(180deg,#d6dde2,#8f9aa2)" }} />
    <div style={{ position: "absolute", left: 1240, top: 300, width: 360, height: 70, borderRadius: 14, background: "linear-gradient(180deg,#dfe6ea,#9aa5ad)", boxShadow: "0 12px 24px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 1520, top: 370, width: 50, height: 90, background: "linear-gradient(90deg,#9aa5ad,#dfe6ea,#9aa5ad)" }} />
    <div style={{ position: "absolute", left: 1505, top: 600, width: 80, height: 22, borderRadius: "50%", background: "rgba(140,200,240,.35)", opacity: 1 - c }} />
    <div style={{ position: "absolute", left: 1330, top: 250, width: 180, height: 40, borderRadius: 20, background: RED, transform: `rotate(${90 * c}deg)`, transformOrigin: "50% 50%" }} />
    {c < 0.95 && [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 1535, top: 470 + ((tt * 300 + i * 70) % 200), width: 18, height: 30, borderRadius: "50%", background: "#8cc8f0" }} />)}
    <Tag tt={tt} at={1.2} x={620} y={990} txt="HOJAS DE ABAJO AMARILLAS" col={AMB} size={34} />
    <Tag tt={tt} at={3.8} x={1420} y={700} txt="PIELES FIRMES · DURA MESES" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- 20:45 · EL AGUA DE PLÁTANO: frasco con cáscaras; días 1-2 que pasan; el agua se tiñe; potasio ----
export const HBanana: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 0.4, 1.6), tint = eio(tt, 1.8, 4.4), d = 1 + Math.round(tint);
  return <>
    <Head tt={tt} kick="UNA VEZ AL MES" title="AGUA DE CÁSCARAS DE PLÁTANO" col={AMB} />
    <div style={{ position: "absolute", left: 660, top: 320, width: 400, height: 560, borderRadius: "40px 40px 50px 50px", border: "6px solid rgba(230,240,250,.6)", background: `rgba(${200 - 60 * tint},${180 - 70 * tint},${90 - 50 * tint},.45)`, overflow: "hidden" }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 60 + i * 90, top: 90 + (1 - p) * -400 + i * 60, width: 90, height: 300, borderRadius: "45px 45px 20px 20px", background: `linear-gradient(90deg, #e2c23e, #f4dc5a 50%, #c9a52c)`, transform: `rotate(${(i - 1) * 18}deg)`, filter: `brightness(${1 - 0.35 * tint})` }} />)}
    </div>
    <div style={{ position: "absolute", left: 640, top: 290, width: 440, height: 50, borderRadius: 12, background: "#7c6a54" }} />
    <Big x={1400} y={430} txt={`DÍA ${d}`} s={phys(tt, 1.6, 6, 0.5)} col={TX} size={100} />
    <Tag tt={tt} at={2.4} x={1400} y={540} txt="1 LITRO · 2-3 CÁSCARAS" col={DIM} size={32} />
    <Big x={1400} y={700} txt="POTASIO" s={phys(tt, 3.6, 6, 0.5)} col={AMB} size={80} />
  </>;
}}</Stage>;

// ---- 21:35 · NUNCA AL RAS: la tijera baja; a 2-3 cm vuelve a salir, al ras corta el corazón (se apaga) ----
export const HSnip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const c = eio(tt, 0.8, 1.6), re = eio(tt, 2.2, 5);
  return <>
    <Head tt={tt} kick="EL AJO TIERNO" title="NUNCA AL RAS" />
    {[0, 1].map((k) => { const x = 560 + k * 800, cutY = k ? 640 : 560; return <React.Fragment key={k}>
      <div style={{ position: "absolute", left: x - 280, right: 1920 - x - 280, top: 640, height: 300, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, borderRadius: 16 }} />
      {Array.from({ length: 7 }, (_, i) => <Leaf key={i} x={x - 60 + i * 20} y={640} len={c < 1 ? 340 - (340 - (640 - cutY)) * c * 0 : (k ? 0 : 80) + (k ? 0 : 220 * re)} rot={(i - 3) * 5} w={12} />)}
      <div style={{ position: "absolute", left: x - 160, top: cutY - 3, width: 320, height: 6, borderTop: `6px dashed ${k ? RED : GRN}`, opacity: 1 - re * 0.6 }} />
      {k === 1 && <div style={{ position: "absolute", left: x - 30, top: 630, width: 60, height: 30, borderRadius: "50%", background: "radial-gradient(#3d6d2f, transparent 70%)", opacity: 1 - re }} />}
    </React.Fragment>; })}
    <Tag tt={tt} at={2.6} x={560} y={420} txt="A 2-3 CM: VUELVE EN 2 SEMANAS" col={GRN} size={34} />
    <Tag tt={tt} at={3.2} x={1360} y={420} txt="AL RAS: CORTASTE EL CORAZÓN" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 22:05 · CUATRO CORTES Y SE AGOTA: cuatro rebrotes cada vez más finos y amarillos; el diente se vacía ----
export const HCuts: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  return <>
    <Head tt={tt} kick="CADA DIENTE AGUANTA" title="3 O 4 CORTES" />
    {[0, 1, 2, 3, 4].map((i) => { const p = phys(tt, 0.4 + i * 0.6, 6, 0.5), fade = i / 4; return <div key={i} style={{ position: "absolute", left: 260 + i * 300, top: 300, width: 240, height: 640, opacity: cl(p * 2) }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(180deg, ${SOIL}, ${SOIL2})`, borderRadius: 14 }} />
      {Array.from({ length: 5 }, (_, j) => <Leaf key={j} x={80 + j * 20} y={440} len={(320 - 50 * i) * p} rot={(j - 2) * 6} w={14 - 2 * i} col={`rgb(${125 + 90 * fade},${191 - 20 * fade},${99 - 50 * fade})`} />)}
      <div style={{ position: "absolute", left: 120, top: 520 }}><Clove x={0} y={0} s={0.85 - 0.12 * i} op={1 - 0.15 * i} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: -60, textAlign: "center", fontWeight: 900, fontSize: 40, color: i === 4 ? RED : TX }}>{i === 4 ? "AGOTADO" : `CORTE ${i + 1}`}</div>
    </div>; })}
    <Tag tt={tt} at={3.8} x={960} y={1010} txt="AL COMPOST · Y OTROS DIENTES CHICOS" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 22:35 · DOS MACETAS DESFASADAS: línea de tiempo de 8 semanas; cuando una está cortada, la otra está lista ----
export const HStagger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const T = eio(tt, 0.4, 5.6) * 8;
  const hgt = (off: number) => { const x = ((T + off) % 4) / 4; return x < 0.85 ? 40 + 260 * (x / 0.85) : 40; };
  return <>
    <Head tt={tt} kick="UN MES DE DIFERENCIA" title="NUNCA TE QUEDAS SIN HOJAS" col={GRN} />
    {[0, 2].map((off, k) => <React.Fragment key={k}>
      <Pot x={660 + k * 600} y={600} w={300} h={220}>{null}</Pot>
      {Array.from({ length: 8 }, (_, i) => <Leaf key={i} x={590 + k * 600 + i * 20} y={610} len={hgt(off) * (0.85 + 0.15 * Math.sin(i * 1.7))} rot={(i - 3.5) * 4} w={11} />)}
      <Tag tt={tt} at={0.8 + k * 0.4} x={660 + k * 600} y={880} txt={hgt(off) > 240 ? "LISTA" : "REBROTANDO"} col={hgt(off) > 240 ? GRN : DIM} size={34} />
    </React.Fragment>)}
    <div style={{ position: "absolute", left: 460, top: 960, width: 1000, height: 10, borderRadius: 5, background: "rgba(255,255,255,.12)" }}><div style={{ width: `${T / 8 * 100}%`, height: "100%", borderRadius: 5, background: AMB }} /></div>
    <Tag tt={tt} at={0.5} x={1560} y={965} txt={`SEMANA ${Math.max(1, Math.ceil(T))}`} col={AMB} size={30} anchor="l" />
  </>;
}}</Stage>;
