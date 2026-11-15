// scr15b · «The Doomsday Burner From a Scrap Can» — componentes propios, PURO CSS/DOM (sin SVG, sin blur grande, sin grano ni viñeta).
// Mundo: hojalata + cartón corrugado + cera cremosa, acento azul de llama / olla enlozada. Distinto de scr15a (hierro, óxido, tiza).
// Regla del EVALUADOR: foto REAL a sangre + UNA línea grande (≥30 px), nada arriba a la izquierda. m = cuadros de las palabras ancla.
import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONTS } from "./Piezas";

const { SERIF, SANS, HAND } = FONTS;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ou = (t: number) => Easing.out(Easing.cubic)(cl(t));
const k = (f: number, a: number, len = 12) => ou((f - a) / len);
const M = (m: number[], i: number, d: number) => (m[i] ?? d);
type P = { dur: number; m: number[]; a: string[] };
type CSS = React.CSSProperties;

const DARK = "#15171a", TIN = "#c9ced3", CARD = "#b98a52", WAX = "#f3ead2", BLUE = "#3d7bd8", ENAMEL = "#1f3f6e", ORANGE = "#f39a2e", RED = "#c8321f", INK = "#1c1b19", WHITE = "#f5f3ee";
const IMG = (n: string) => `url(${staticFile(`scr15b/g/${n}.png`)})`;
// textura de cartón corrugado (canaletas verticales)
const CORR = `repeating-linear-gradient(90deg, #c4955c 0px, #b07f48 7px, #c99a60 14px)`;

const Plate: React.FC<{ src: string; d?: number; pos?: string; children?: React.ReactNode }> = ({ src, d = 0.5, pos = "50% 50%", children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ overflow: "hidden", background: DARK }}>
    <AbsoluteFill style={{ backgroundImage: IMG(src), backgroundSize: "cover", backgroundPosition: pos, transform: `scale(${1.03 + f * 0.00035})` }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(12,14,17,${d * 0.35}) 0%, rgba(12,14,17,${d * 0.55}) 50%, rgba(12,14,17,${Math.min(0.94, d + 0.3)}) 100%)` }} />
    {children}
  </AbsoluteFill>;
};
const Big: React.FC<{ children: React.ReactNode; e: number; size?: number; col?: string; y?: number; style?: CSS }> = ({ children, e, size = 88, col = WHITE, y = 110, style }) => (
  <div style={{ position: "absolute", left: 90, right: 90, bottom: y, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 1.05, color: col, letterSpacing: 1,
    textShadow: "0 4px 0 rgba(0,0,0,.5)", opacity: cl(e * 1.4), transform: `translateY(${(1 - e) * 40}px)`, ...style }}>{children}</div>
);
const Lbl: React.FC<{ children: React.ReactNode; size?: number; col?: string; style?: CSS }> = ({ children, size = 34, col = WHITE, style }) => (
  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 2, color: col, whiteSpace: "nowrap", ...style }}>{children}</div>
);
// tapa de lata: foto recortada en círculo con aro de hojalata
const Lid: React.FC<{ src: string; r: number; x: number; y: number; e?: number; cap?: string }> = ({ src, r, x, y, e = 1, cap }) => (
  <div style={{ position: "absolute", left: x, top: y, width: r * 2, opacity: cl(e * 1.6), transform: `translateY(${(1 - e) * -120}px) rotate(${(1 - e) * -40}deg)` }}>
    <div style={{ width: r * 2, height: r * 2, borderRadius: "50%", padding: 16, boxSizing: "border-box", background: "radial-gradient(circle, #eef0f2 60%, #8b9198 72%, #e4e7ea 80%, #747a81 100%)", boxShadow: "0 18px 24px rgba(0,0,0,.55)" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", backgroundImage: IMG(src), backgroundSize: "cover", backgroundPosition: "50% 50%", boxShadow: "inset 0 0 0 6px rgba(0,0,0,.25)" }} /></div>
    {cap && <div style={{ marginTop: 18, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: WHITE, textShadow: "0 3px 0 rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{cap}</div>}
  </div>
);
// copia sobre cartón corrugado
const Card: React.FC<{ src: string; w: number; h: number; x: number; y: number; rot?: number; e?: number; cap?: string }> = ({ src, w, h, x, y, rot = 0, e = 1, cap }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, padding: 14, paddingBottom: cap ? 70 : 14, background: CORR, transform: `translateY(${(1 - e) * 90}px) rotate(${rot}deg)`, opacity: cl(e * 1.6), boxShadow: "0 20px 26px rgba(0,0,0,.5)" }}>
    <div style={{ width: w, height: h, backgroundImage: IMG(src), backgroundSize: "cover", backgroundPosition: "50% 50%" }} />
    {cap && <div style={{ position: "absolute", left: 14, right: 14, bottom: 12, height: 50, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 32, color: INK, whiteSpace: "nowrap" }}>{cap}</div>}
  </div>
);
// llama de cera en CSS (naranja con base azul)
const Flame: React.FC<{ s?: number; on?: number; seed?: number }> = ({ s = 1, on = 1, seed = 0 }) => {
  const f = useCurrentFrame(); const fl = 1 + Math.sin(f / 3 + seed) * 0.07 + Math.sin(f / 1.6 + seed * 2) * 0.05;
  return <div style={{ width: 30 * s, height: 80 * s, position: "relative", opacity: on }}>
    <div style={{ position: "absolute", left: 0, bottom: 0, width: 30 * s, height: 80 * s * fl * on, borderRadius: "50% 50% 40% 40% / 70% 70% 30% 30%", transformOrigin: "50% 100%",
      background: `radial-gradient(ellipse at 50% 88%, ${BLUE} 0%, #9cc3ff 12%, #fff3c4 24%, ${ORANGE} 55%, rgba(230,90,20,0) 78%)` }} /></div>;
};
// cinta de papel de etiqueta de lata (crema con banda azul enlozado)
const Band: React.FC<{ children: React.ReactNode; style?: CSS }> = ({ children, style }) => (
  <div style={{ background: `linear-gradient(180deg, ${ENAMEL} 0 14px, ${WAX} 14px calc(100% - 14px), ${ENAMEL} calc(100% - 14px))`, padding: "34px 50px", boxShadow: "0 18px 24px rgba(0,0,0,.5)", ...style }}>{children}</div>
);

// ================= pieces (004): cuatro tapas de lata caen con cada pieza
const Pieces: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame();
  const L: [string, string][] = [["g0590", "A TUNA CAN"], ["g0910", "CARDBOARD"], ["g1210", "OLD CANDLE WAX"], ["g1980", "A COFFEE CAN"]];
  return <Plate src="g0050" d={0.75}>
    {L.map(([s, c], i) => <Lid key={i} src={s} r={170} x={150 + i * 420} y={210} e={k(f, M(m, i, 6 + i * 14), 12)} cap={c} />)}
    <Big e={k(f, 4, 14)} y={100}>Stuff you'd normally throw out.</Big>
  </Plate>;
};

// ================= carousel (017) + recap/rc:n — diez tiras de cartón corrugado con el número a esténcil
const PARTS = ["WHAT IT IS", "THE CAN", "THE CARDBOARD", "THE WAX", "MELT IT SAFE", "FILL IT TWICE", "THE STOVE", "LIGHT + BOIL TEST", "TURN DOWN · PUT OUT", "REFILL + STORE"];
const Strips: React.FC<P & { pick?: number; recap?: boolean }> = ({ pick, recap }) => {
  const f = useCurrentFrame();
  if (pick !== undefined) { const e = k(f, 0, 14); const drop = interpolate(f, [8, 20], [-700, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.bounce) });
    return <AbsoluteFill style={{ background: CORR }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.4))" }} />
      <Card src={PART_IMG[pick - 1]} w={1120} h={680} x={600} y={160} rot={1.5} e={e} />
      <div style={{ position: "absolute", left: 120, top: 320, width: 360, height: 400, background: WAX, border: `10px solid ${ENAMEL}`, transform: `translateY(${drop}px) rotate(-4deg)`, boxShadow: "0 22px 26px rgba(0,0,0,.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Lbl size={40} col={ENAMEL} style={{ letterSpacing: 10 }}>PART</Lbl>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 240, lineHeight: 0.95, color: INK }}>{pick}</div></div>
    </AbsoluteFill>; }
  const x = -f * 30;
  return <Plate src={recap ? "g1890" : "g1730"} d={0.8}>
    {PART_IMG.map((src, i) => <div key={i} style={{ position: "absolute", left: 0, top: 0 }}>
      <Card src={src} w={440} h={330} x={240 + i * 520 + x} y={230} rot={[-2, 1.5, -1, 2][i % 4]} e={k(f, i * 3, 8)} cap={`${i + 1} · ${PARTS[i]}`} /></div>)}
    <Big e={k(f, 2, 14)} y={90} size={76}>{recap ? "Ten parts, one can." : "10 short parts."}</Big>
  </Plate>;
};
const RecapBonus: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g1890" d={0.6}><div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", opacity: k(f, 2, 14) }}>
    <div style={{ padding: "20px 50px", background: CORR, border: "4px solid #7a5530", fontFamily: SANS, fontWeight: 900, fontSize: 72, color: INK, whiteSpace: "nowrap", boxShadow: "0 14px 18px rgba(0,0,0,.5)" }}>Bonus: the three-day can.</div></div></Plate>;
};

// ================= part:n — panel de cartón con «PART n / 10» pintado a esténcil y la copia del capítulo
const PART_IMG = ["g0340", "g0590", "g1010", "g1210", "g1550", "g1750", "g2030", "g2360", "g2940", "g3140"];
const Part: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0]; const e = k(f, 0, 14), s = k(f, 8, 10);
  return <AbsoluteFill style={{ background: CORR }}>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.35))" }} />
    <Card src={PART_IMG[n - 1]} w={860} h={560} x={n % 2 ? 900 + (1 - e) * 900 : 120 - (1 - e) * 900} y={200} rot={n % 2 ? -2 + e : 2 - e} />
    <div style={{ position: "absolute", left: n % 2 ? 110 : 1100, top: 270, opacity: cl(s * 2), transform: `scale(${1 + 0.1 * cl(1 - (f - 16) / 8)})`, transformOrigin: "0 50%" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 70, color: INK, letterSpacing: 14 }}>PART</div>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 280, lineHeight: 0.9, color: INK, letterSpacing: -6 }}>{n}<span style={{ fontSize: 110, color: "#5a3f22" }}> / 10</span></div>
      <div style={{ marginTop: 22, display: "inline-block", padding: "12px 26px", background: WAX, fontFamily: SANS, fontWeight: 900, fontSize: 50, color: INK, maxWidth: 680 }}>{PARTS[n - 1]}</div>
    </div>
  </AbsoluteFill>;
};

// ================= history (032): dos fotos viejas sobre una línea de tiempo con fecha
const History: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a1 = M(m, 1, 60);
  return <Plate src="g0340" d={0.82}>
    <div style={{ position: "absolute", left: 200, right: 200, top: 700, height: 8, background: WAX, transformOrigin: "0 50%", transform: `scaleX(${k(f, 4, 30)})` }} />
    <Card src="g0350" w={620} h={420} x={220} y={170} rot={-3} e={k(f, a1, 12)} cap="1914–18 · TRENCH CANDLE" />
    <Card src="g0330" w={620} h={420} x={1040} y={150} rot={2.5} e={k(f, M(m, 0, 8), 12)} cap="1930s–40s · BUDDY BURNER" />
    <Big e={k(f, a1 + 20, 12)} y={70} size={70}>Nothing new. Tested by cold, hungry people.</Big>
  </Plate>;
};

// ================= wick (040): vista de arriba — una vela con una mecha vs la bobina de cartón que se prende entera
const Wick: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a1 = M(m, 1, 40);
  const top = (x: number, coil: boolean, e: number) => <div style={{ position: "absolute", left: x, top: 200, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,#e9ecef 62%,#8b9198 70%,#dfe3e6 76%,#6f757c 100%)", boxShadow: "0 22px 30px rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 430, height: 430, borderRadius: "50%", background: coil ? `repeating-radial-gradient(circle, ${WAX} 0 14px, #b98a52 14px 20px)` : WAX, position: "relative" }}>
      {coil ? Array.from({ length: 16 }).map((_, i) => { const ang = i * 2.4, r = 30 + i * 11; return <div key={i} style={{ position: "absolute", left: 200 + Math.cos(ang) * r, top: 170 + Math.sin(ang) * r, opacity: k(f, a1 + i * 2, 6) }}><Flame s={0.9} seed={i} on={e} /></div>; })
        : <div style={{ position: "absolute", left: 200, top: 170 }}><Flame s={0.9} on={1} /></div>}
    </div></div>;
  return <Plate src="g0440" d={0.85}>
    {top(250, false, 1)}{top(1150, true, 1)}
    <Lbl size={44} style={{ position: "absolute", left: 250, width: 520, textAlign: "center", top: 750 }}>ONE THIN WICK</Lbl>
    <Lbl size={44} col={ORANGE} style={{ position: "absolute", left: 1150, width: 520, textAlign: "center", top: 750, opacity: k(f, a1, 10) }}>A WHOLE COIL OF WICK</Lbl>
    <Big e={k(f, a1 + 34, 12)} y={60} size={66}>Same wax. A lot more of it burning at once.</Big>
  </Plate>;
};

// ================= stat:x — faja de etiqueta de lata con el número y la fuente
const STAT: Record<string, [string, string, string, string]> = {
  paraffin: ["g0500", "46 MJ/kg", "ENERGY IN PARAFFIN WAX", "ENGINEERING TOOLBOX"],
  cdc: ["g2280", "NO STOVES INSIDE", "A CLOSED HOUSE · CARBON MONOXIDE", "CDC · POWER OUTAGES"] };
const Stat: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const [src, big, lab, so] = STAT[a[0]]; const e = k(f, 2, 14);
  return <Plate src={src} d={0.55}>
    <Band style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", transform: `scaleX(${e})`, padding: "24px 50px" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: big.length > 9 ? 96 : 120, color: INK, lineHeight: 1, whiteSpace: "nowrap" }}>{big}</div>
      <Lbl size={38} col={INK} style={{ marginTop: 10 }}>{lab}</Lbl>
      <Lbl size={30} col={ENAMEL} style={{ marginTop: 14 }}>SOURCE · {so}</Lbl>
    </Band>
  </Plate>;
};

// ================= energy (051): dos barras de cera — lo que tiene una carga vs lo que pide un cuarto de galón
const Energy: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const e0 = k(f, M(m, 0, 6), 24), e1 = k(f, M(m, 1, 50), 14);
  const bar = (y: number, w: number, e: number, col: string, lab: string, val: string) => <div style={{ position: "absolute", left: 200, top: y }}>
    <Lbl size={38} style={{ marginBottom: 14 }}>{lab}</Lbl>
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ width: w * e, height: 120, background: col, borderRadius: 10, boxShadow: "0 12px 16px rgba(0,0,0,.45)" }} />
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 90, color: WHITE, opacity: cl(e * 2) }}>{val}</div></div></div>;
  return <Plate src="g0500" d={0.8}>
    {bar(170, 1250, e0, `linear-gradient(90deg,${WAX},#e2d3ad)`, "ONE TUNA CAN OF WAX · ~150 g", "≈ 7 MJ")}
    {bar(470, 60, e1, `linear-gradient(90deg,#7fb0f0,${BLUE})`, "BOIL 1 QUART OF COLD WATER (PERFECT POT)", "≈ 0.3 MJ")}
    <Big e={k(f, M(m, 1, 50) + 30, 12)} y={90} size={70}>Plenty in the can. The stove has to catch it.</Big>
  </Plate>;
};

// ================= measure (098): la regla junto a la lata — 1½" de lata, 1¼" de tira
const Measure: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const e0 = k(f, M(m, 0, 4), 16), e1 = k(f, M(m, 1, 40), 16); const PX = 260;
  return <Plate src="g0620" d={0.78}>
    <div style={{ position: "absolute", left: 640, top: 160, width: 120, height: 2 * PX + 40, background: "linear-gradient(90deg,#e7b417,#f7d24a 40%,#d6a10c)", borderRadius: 6, boxShadow: "0 12px 16px rgba(0,0,0,.45)" }}>
      {Array.from({ length: 17 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, bottom: 20 + i * (PX / 8), width: i % 4 === 0 ? 70 : 34, height: 4, background: INK }} />)}
      {[0, 1, 2].map((v) => <div key={v} style={{ position: "absolute", left: 76, bottom: 4 + v * (PX / 2) * 2 / 2 * 2, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: INK }}>{v}</div>)}</div>
    <div style={{ position: "absolute", left: 800, bottom: 1080 - 160 - 2 * PX - 20, width: 380, height: 1.5 * PX * e0, background: "linear-gradient(90deg,#8b9198,#e6e9ec 40%,#9aa0a6)", borderRadius: "6px 6px 20px 20px", boxShadow: "0 14px 18px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 50, right: 50, bottom: 0, height: 1.25 * PX * e1, background: CORR, border: "2px solid #7a5530" }} /></div>
    <Lbl size={60} col={WHITE} style={{ position: "absolute", left: 1230, top: 300, opacity: e0 }}>CAN · 1½"</Lbl>
    <Lbl size={60} col={ORANGE} style={{ position: "absolute", left: 1230, top: 420, opacity: e1 }}>STRIP · 1¼"</Lbl>
    <Big e={k(f, M(m, 1, 40) + 20, 12)} y={70} size={66}>A quarter inch shorter than the can.</Big>
  </Plate>;
};

// ================= tubes (104): corte de la canaleta — la tira vista de punta, con los tubitos que suben la cera
const Tubes: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const e = k(f, M(m, 0, 6), 16); const rise = ((f % 60) / 60);
  return <Plate src="g0910" d={0.75}>
    <div style={{ position: "absolute", left: 360, top: 240, width: 1200, height: 380, background: "#c99a60", border: "10px solid #8a6238", boxShadow: "0 22px 30px rgba(0,0,0,.55)", overflow: "hidden", transform: `scale(${0.8 + 0.2 * e})`, opacity: cl(e * 1.5) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 20, height: 26, background: "#b07f48" }} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 20, height: 26, background: "#b07f48" }} />
      {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 98, top: 46, width: 84, height: 288, borderRadius: "50%", border: "10px solid #9a6c3c", boxSizing: "border-box", background: `linear-gradient(0deg, ${WAX} ${cl(rise + i * 0.05) * 100}%, rgba(0,0,0,.25) ${cl(rise + i * 0.05) * 100}%)` }} />)}
    </div>
    <Big e={k(f, M(m, 1, 40), 12)} y={110} size={74}>Cut across the tubes. They carry the wax up.</Big>
  </Plate>;
};

// ================= stubs (128): los cabos de vela caen uno a uno en la lata de café y la hoja del almanaque pasa de mes
const Stubs: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a0 = M(m, 0, 6); const lvl = interpolate(f, [a0, a0 + 60], [0.05, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const MO = ["JAN", "MAR", "MAY", "JUL", "SEP", "NOV"]; const mi = Math.min(5, Math.floor(lvl / 0.85 * 6)); const COL = [WAX, "#f2c9c9", "#e9d98c", "#cfe3f7", WAX, "#d9ecd0"];
  return <Plate src="g1560" d={0.8}>
    {[0, 1, 2, 3, 4, 5].map((i) => { const t = ((f + i * 9) % 30) / 30; return <div key={i} style={{ position: "absolute", left: 830 + (i % 3) * 90, top: 40 + t * 260, width: 50, height: 110, borderRadius: 8, background: COL[i], transform: `rotate(${(i - 2.5) * 18}deg)`, opacity: t < 0.85 ? 1 : 0, boxShadow: "0 6px 0 rgba(0,0,0,.3)" }} />; })}
    <div style={{ position: "absolute", left: 760, top: 340, width: 400, height: 520, borderRadius: "0 0 26px 26px", background: "linear-gradient(90deg,#7d838a,#e6e9ec 35%,#b7bcc1 60%,#6f757c)", boxShadow: "0 22px 30px rgba(0,0,0,.55)", overflow: "hidden" }}>
      {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 40 + i * 80, height: 6, background: "rgba(0,0,0,.15)" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: `repeating-linear-gradient(170deg, ${WAX} 0 26px, #e8d6a8 26px 40px, #f2c9c9 40px 58px, #efe7c0 58px 80px)`, opacity: 0.45 }} /></div>
    <div style={{ position: "absolute", left: 750, top: 310, width: 420, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,#2a2d31 55%,#c9ced3 60%,#7d838a)" }} />
    <div style={{ position: "absolute", left: 1290, top: 380, width: 300, background: WHITE, boxShadow: "0 16px 22px rgba(0,0,0,.5)", transform: "rotate(3deg)" }}>
      <div style={{ height: 70, background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}><Lbl size={34}>THIS YEAR</Lbl></div>
      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 120, color: INK }}>{MO[mi]}</div></div>
    <Big e={k(f, a0 + 50, 12)} y={70} size={70}>Every stub in the house. Full in a year.</Big>
  </Plate>;
};

// ================= grease (148) / nowater (164): sello de goma que cae sobre la foto del error
const Stamp: React.FC<{ src: string; t1: string; t2: string }> = ({ src, t1, t2 }) => {
  const f = useCurrentFrame(); const hit = cl((f - 8) / 4); const sh = f > 8 && f < 14 ? Math.sin(f * 3) * 6 : 0;
  return <Plate src={src} d={0.45}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center" }}><div style={{ transform: `translate(${sh}px,${sh}px) rotate(-5deg) scale(${2.2 - 1.2 * hit})`, opacity: hit, border: `12px solid ${RED}`, borderRadius: 18, padding: "16px 44px", fontFamily: SANS, fontWeight: 900, fontSize: 88, color: RED, letterSpacing: 4, background: "rgba(255,240,230,.82)", whiteSpace: "nowrap" }}>{t1}</div></div>
    <Big e={k(f, 20, 12)} y={110} size={72}>{t2}</Big>
  </Plate>;
};
const Grease: React.FC<P> = () => <Stamp src="g3310" t1="NEVER ON DIRECT HEAT" t2="Hot wax catches like a grease fire." />;
const NoWater: React.FC<P> = () => {
  const f = useCurrentFrame(); const down = interpolate(f, [20, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }); const out = k(f, 34, 14);
  return <Plate src="g1700" d={0.8}>
    <div style={{ position: "absolute", left: 660, top: 520, width: 600, height: 200, borderRadius: "0 0 20px 20px", background: "linear-gradient(90deg,#7d838a,#e6e9ec 35%,#b7bcc1 60%,#6f757c)", boxShadow: "0 22px 30px rgba(0,0,0,.55)" }} />
    <div style={{ position: "absolute", left: 660, top: 500, width: 600, height: 50, borderRadius: "50%", background: `repeating-radial-gradient(ellipse, ${WAX} 0 10px, #b98a52 10px 14px)` }} />
    <div style={{ position: "absolute", left: 700, top: 360, width: 520, display: "flex", justifyContent: "space-around" }}>{[0, 1, 2, 3].map((i) => <Flame key={i} s={1.9} seed={i} on={1 - out} />)}</div>
    <div style={{ position: "absolute", left: 630, top: 120 + down * 360, width: 660, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 30%,#eef0f2,#8b9198)", boxShadow: "0 16px 20px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 300, top: -34, width: 60, height: 40, borderRadius: 10, background: "#3a3f45" }} /></div>
    <Big e={k(f, 40, 12)} y={90} size={76}>Lid it. Never water.</Big>
  </Plate>;
};

// ================= bath (151): corte del baño María — la olla, el agua azul, la lata y la cera que pasa de trozos a líquido
const Bath: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const melt = k(f, M(m, 1, 40), 50); const bub = (f % 20) / 20;
  return <Plate src="g1550" d={0.93}>
    <div style={{ position: "absolute", left: 560, top: 260, width: 800, height: 470, border: "16px solid #3a3f45", borderTop: "none", borderRadius: "0 0 40px 40px", boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 220 * k(f, M(m, 0, 4), 16), background: `linear-gradient(180deg,#7fb0f0,${BLUE})`, borderRadius: "0 0 26px 26px", opacity: 0.85 }} />
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 60 + i * 150, bottom: 20 + ((bub + i * 0.2) % 1) * 180, width: 16, height: 16, borderRadius: "50%", background: "rgba(255,255,255,.7)" }} />)}
      <div style={{ position: "absolute", left: 270, bottom: 30, width: 260, height: 380, background: "linear-gradient(90deg,#7d838a,#e6e9ec 35%,#b7bcc1 60%,#6f757c)", borderRadius: "6px 6px 14px 14px" }}>
        <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, height: 260, background: melt > 0.6 ? `linear-gradient(180deg,#f8e9a8,#e9c862)` : `repeating-linear-gradient(160deg, ${WAX} 0 30px, #d9cfb3 30px 38px)`, borderRadius: "2px 2px 10px 10px" }} /></div>
    </div>
    <Lbl size={46} col="#bcd6ff" style={{ position: "absolute", right: 80, top: 560 }}>WATER ≤ 212 °F</Lbl>
    <Lbl size={46} col={WAX} style={{ position: "absolute", right: 80, top: 360, opacity: k(f, M(m, 1, 40), 10) }}>WAX MELTS · NO FLAME</Lbl>
    <Big e={k(f, 10, 12)} y={70} size={70}>A water bath. Slow and safe.</Big>
  </Plate>;
};

// ================= pours (176): la lata vista de costado — la cera sube a la mitad, espera, y llega arriba
const Pours: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const l1 = k(f, M(m, 0, 6), 24) * 0.5; const l2 = k(f, Math.max(M(m, 0, 6) + 50, dur - 50), 24) * 0.45; const lv = l1 + l2;
  return <Plate src="g1790" d={0.78}>
    <div style={{ position: "absolute", left: 660, top: 330, width: 600, height: 330, background: "linear-gradient(90deg,#7d838a,#e6e9ec 35%,#b7bcc1 60%,#6f757c)", borderRadius: "8px 8px 22px 22px", boxShadow: "0 22px 30px rgba(0,0,0,.55)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 16, height: 280, background: CORR, opacity: 0.85 }} />
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 16, height: 280 * lv, background: "rgba(246,226,150,.88)" }} /></div>
    <div style={{ position: "absolute", left: 1290, top: 330 + 330 - 16 - 280 * 0.5, width: 120, height: 5, background: ORANGE }} />
    <Lbl size={42} col={ORANGE} style={{ position: "absolute", left: 1420, top: 330 + 330 - 16 - 280 * 0.5 - 26 }}>1st · HALF</Lbl>
    <Lbl size={42} col={WAX} style={{ position: "absolute", left: 1420, top: 360, opacity: cl(l2 * 4) }}>2nd POUR · FULL</Lbl>
    <Big e={k(f, 10, 12)} y={90} size={74}>Two pours. Let it soak in between.</Big>
  </Plate>;
};

// ================= stove (202): la anatomía de la cocina sobre la copia — tres etiquetas de cinta de papel
const Stove: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame();
  const T: [string, number, number][] = [["CLOSED END ON TOP = SKILLET", 1000, 230], ["SQUARE DOOR · 3\" × 3\"", 1000, 470], ["RING OF HOLES ON TOP", 1000, 710]];
  return <Plate src="g2060" d={0.72}>
    <Card src="g0050" w={720} h={620} x={170} y={160} rot={-1.5} e={k(f, 2, 12)} />
    {T.map(([t, x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, padding: "18px 30px", background: "rgba(238,229,205,.95)", transform: `rotate(${[-1.5, 1, -1][i]}deg) translateX(${(1 - k(f, M(m, i, 10 + i * 30), 10)) * 900}px)`, boxShadow: "0 10px 14px rgba(0,0,0,.45)", fontFamily: SANS, fontWeight: 900, fontSize: 38, color: INK, whiteSpace: "nowrap" }}>{t}</div>)}
  </Plate>;
};

// ================= where (232): sobre qué sí y sobre qué nunca — fichas de prueba en dos columnas
const Where: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const OK = ["GRAVEL", "PATIO BLOCK", "BARE CONCRETE", "A PAN OF SAND"], NO = ["A WOOD DECK", "DRY GRASS", "A TABLE"];
  const chip = (t: string, i: number, good: boolean, a: number) => <div key={t} style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 28px", marginBottom: 20, background: good ? "rgba(236,242,232,.95)" : "rgba(250,232,228,.95)", borderLeft: `16px solid ${good ? "#2f7a3a" : RED}`, opacity: k(f, a + i * 6, 8), transform: `translateX(${(1 - k(f, a + i * 6, 8)) * (good ? -300 : 300)}px)` }}>
    <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 56, color: good ? "#2f7a3a" : RED }}>{good ? "✓" : "✕"}</div><div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 48, color: INK }}>{t}</div></div>;
  return <Plate src="g0050" d={0.78}>
    <div style={{ position: "absolute", left: 180, top: 150, width: 700 }}>{OK.map((t, i) => chip(t, i, true, M(m, 0, 6)))}</div>
    <div style={{ position: "absolute", left: 1040, top: 150, width: 700 }}>{NO.map((t, i) => chip(t, i, false, M(m, 1, 50)))}</div>
    <Big e={k(f, 10, 12)} y={90} size={72}>Something that can't burn.</Big>
  </Plate>;
};

// ================= boiltimer (246): el reloj de cocina corre y marca 5 / 10 / 18 minutos
const BoilTimer: React.FC<P> = ({ m, dur }) => {
  const f = useCurrentFrame(); const mins = interpolate(f, [6, Math.max(60, dur - 20)], [0, 18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const L: [number, string][] = [[5, "WARM TO THE TOUCH"], [10, "LITTLE BUBBLES"], [18, "ROLLING BOIL"]];
  return <Plate src="g2450" d={0.7}>
    <div style={{ position: "absolute", left: 220, top: 190, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(#fbfaf5 62%,#d9d4c6)", border: `24px solid ${ENAMEL}`, boxShadow: "0 22px 30px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 12, height: 210, marginLeft: -6, marginTop: -210, background: RED, borderRadius: 6, transformOrigin: "50% 100%", transform: `rotate(${(mins / 20) * 360}deg)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 90, color: INK }}>{Math.floor(mins)} MIN</div></div>
    <div style={{ position: "absolute", left: 880, top: 230 }}>
      {L.map(([t, s], i) => <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 30, marginBottom: 40, opacity: mins >= t ? 1 : 0.18 }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 96, color: i === 2 ? ORANGE : WHITE, width: 180 }}>{t}'</div><Lbl size={52}>{s}</Lbl></div>)}</div>
    <Big e={k(f, dur - 30, 10)} y={70} size={64}>Not fast. Your kettle does it in four.</Big>
  </Plate>;
};

// ================= lidwind (255): dos ollas compiten — con tapa y de espaldas al viento vs sin tapa y de cara al viento
const LidWind: React.FC<P> = () => {
  const f = useCurrentFrame(); const a = k(f, 6, 40), b = k(f, 6, 60);
  const lane = (y: number, lab: string, e: number, end: string, col: string) => <div style={{ position: "absolute", left: 160, right: 160, top: y }}>
    <Lbl size={40} style={{ marginBottom: 12 }}>{lab}</Lbl>
    <div style={{ height: 90, background: "rgba(255,255,255,.12)", borderRadius: 45, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${e * 100}%`, background: col, borderRadius: 45 }} />
      </div><div style={{ marginTop: 12, textAlign: "right", fontFamily: SANS, fontWeight: 900, fontSize: 52, color: WHITE, opacity: cl(e * 3 - 2), whiteSpace: "nowrap" }}>{end}</div></div>;
  return <Plate src="g2540" d={0.8}>
    {lane(220, "LID ON · DOOR AWAY FROM THE WIND", a, "BOIL · 18 MIN", `linear-gradient(90deg,${BLUE},${ORANGE})`)}
    {lane(470, "NO LID · DOOR INTO THE WIND", b * 0.7, "25 MIN · BARELY SIMMERING", "linear-gradient(90deg,#4a5c78,#7b8aa0)")}
    <Big e={k(f, 50, 12)} y={90} size={72}>A lid and a wind block: free heat.</Big>
  </Plate>;
};

// ================= menu (265): pizarra de bodegón — lo que sí cocina y lo que no
const Menu: React.FC<P> = () => {
  const f = useCurrentFrame(); const Y = ["OATMEAL", "RAMEN", "A CAN OF SOUP · 12 MIN", "FRIED EGGS"], N = ["DRY BEANS", "A ROAST", "PASTA FOR SIX"];
  return <Plate src="g2700" d={0.75}>
    <div style={{ position: "absolute", left: 360, top: 110, width: 1200, height: 760, background: "linear-gradient(170deg,#2b2d2b,#1d1f1d)", border: "18px solid #6b4a2a", boxShadow: "0 22px 30px rgba(0,0,0,.55)", padding: "40px 70px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 76, color: ORANGE, textAlign: "center" }}>ON THE CAN TODAY</div>
      {Y.map((t, i) => <div key={t} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 68, color: WHITE, opacity: k(f, 10 + i * 10, 8) }}>✓ {t}</div>)}
      {N.map((t, i) => <div key={t} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#d5ccc0", textDecoration: "line-through", textDecorationColor: RED, textDecorationThickness: 8, opacity: k(f, 60 + i * 10, 8) }}>{t}</div>)}
    </div>
  </Plate>;
};

// ================= damper (291): vista de arriba — la tapita se corre y la llama se achica
const Damper: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const c1 = k(f, M(m, 0, 10), 12) * 0.33, c2 = k(f, M(m, 1, 50), 12) * 0.17; const cov = c1 + c2; const fl = 1 - cov * 1.3;
  return <Plate src="g2900" d={0.8}>
    <div style={{ position: "absolute", left: 660, top: 170, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,#e9ecef 62%,#8b9198 70%,#dfe3e6 76%,#6f757c 100%)", boxShadow: "0 22px 30px rgba(0,0,0,.55)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 50, borderRadius: "50%", background: `repeating-radial-gradient(circle, ${WAX} 0 14px, #b98a52 14px 20px)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center", gap: 40 }}>{[0, 1, 2, 3].map((i) => <Flame key={i} s={2.2 * Math.max(0.15, fl)} seed={i} />)}</div>
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: `${cov * 100}%`, background: "radial-gradient(circle at 0% 50%,#f1f3f5,#9aa1a8)", boxShadow: "-10px 0 16px rgba(0,0,0,.4)" }} /></div>
    <Lbl size={64} col={ORANGE} style={{ position: "absolute", left: 1320, top: 420 }}>{cov < 0.05 ? "FULL" : cov < 0.4 ? "⅓ COVERED" : "½ COVERED"}</Lbl>
    <Big e={k(f, 8, 12)} y={70} size={70}>The saved lid is your burner knob.</Big>
  </Plate>;
};

// ================= tenmin (302): cuenta regresiva 10:00 sobre la cera que se pone blanca
const TenMin: React.FC<P> = ({ dur }) => {
  const f = useCurrentFrame(); const s = interpolate(f, [6, Math.max(40, dur - 10)], [600, 540], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Plate src="g3060" d={0.65}>
    <div style={{ position: "absolute", right: 110, top: 150, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(#fbfaf5 62%,#d9d4c6)", border: `26px solid ${ENAMEL}`, boxShadow: "0 22px 30px rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 12, height: 180, marginLeft: -6, marginTop: -180, background: RED, borderRadius: 6, transformOrigin: "50% 100%", transform: `rotate(${(s / 600) * 360}deg)` }} />
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 96, color: INK, marginTop: 200 }}>{Math.ceil(s / 60)} MIN</div></div>
    <Big e={k(f, 10, 12)} y={130} size={84} col={ORANGE}>Liquid wax. Do not pick it up.</Big>
  </Plate>;
};

// ================= lineup (321): la receta entera en tapas de lata en fila
const Lineup: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const L: [string, string][] = [["g0590", "TUNA CAN"], ["g0430", "CARDBOARD"], ["g1840", "WAX"], ["g0050", "COFFEE CAN"]];
  return <Plate src="g1730" d={0.75}>
    {L.map(([s, c], i) => <Card key={i} src={s} w={360} h={360} x={90 + i * 445} y={170} rot={[-2.5, 1.5, -1.5, 2.5][i]} e={k(f, M(m, i, 4 + i * 10), 10)} cap={c} />)}
    <Big e={k(f, M(m, 3, 40) + 10, 12)} y={110}>That's the whole build.</Big>
  </Plate>;
};

// ================= subq (325): suscripción + la pregunta en cinta de enmascarar sobre una lata
const SubQ: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const a1 = M(m, 1, 60); const press = cl((f - M(m, 0, 10) - 10) / 6);
  const down = Math.sin(press * Math.PI);
  return <Plate src="g2270" d={0.62}>
    <div style={{ position: "absolute", right: 120, top: 100, width: 360, padding: "30px 0 24px", borderRadius: 18, background: "linear-gradient(135deg,#eef0f2,#9aa1a8)", border: "5px solid #6f757c", boxShadow: "0 18px 24px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", alignItems: "center", opacity: k(f, M(m, 0, 4), 10) }}>
      <div style={{ width: 170, height: 170, borderRadius: "50%", background: "#3a3f44", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%,#ff6a56,${RED} 60%,#7c1408)`, transform: `translateY(${down * 8}px) scale(${1 - 0.06 * down})`, boxShadow: `0 ${12 - down * 10}px 0 #6a1006` }} /></div>
      <Lbl size={40} col="#2b2f33" style={{ marginTop: 18, letterSpacing: 4 }}>SUBSCRIBE</Lbl>
    </div>
    <div style={{ position: "absolute", left: 120, top: 440, width: 1060, padding: "44px 60px", background: "linear-gradient(90deg,#7d838a,#e6e9ec 35%,#b7bcc1 60%,#6f757c)", transform: `translateY(${(1 - k(f, a1, 14)) * 700}px)`, boxShadow: "0 22px 28px rgba(0,0,0,.5)", borderRadius: 12 }}>
      <div style={{ background: "rgba(238,226,190,.96)", padding: "30px 40px", transform: "rotate(-1.5deg)" }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 72, lineHeight: 1.08, color: "#1b1712" }}>What's the one thing you'd put in your blackout can?</div>
</div></div>
  </Plate>;
};

// ================= mistakes (329) + mist:n — cinta de precaución amarilla con el número
const MIST: [string, string][] = [["g3310", "WAX ON DIRECT HEAT"], ["g3420", "MOVING IT WHILE IT'S LIQUID"], ["g3510", "CARDBOARD OVER THE RIM"], ["g3550", "INSIDE, WINDOWS SHUT"], ["g2150", "NO HOLES ON TOP"]];
const CAUTION = `repeating-linear-gradient(-45deg, #f2c418 0 40px, #1b1b1b 40px 80px)`;
const Mistakes: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g1920" d={0.8}>
    {MIST.map(([src], i) => <div key={i} style={{ position: "absolute", left: 0, top: 0 }}><Card src={src} w={290} h={230} x={110 + i * 350} y={150} rot={[-3, 2, -1.5, 3, -2][i]} e={k(f, 2 + i * 6, 10)} /></div>)}
    {MIST.map((_, i) => <div key={"n" + i} style={{ position: "absolute", left: 100 + i * 350, top: 136, width: 70, height: 70, background: "#f2c418", color: INK, fontFamily: SANS, fontWeight: 900, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", opacity: k(f, 2 + i * 6, 10) }}>{i + 1}</div>)}
    <Big e={k(f, 34, 14)} y={210} size={170}>5 MISTAKES</Big><Big e={k(f, 46, 12)} y={120} size={56} col={ORANGE}>Number two is mine.</Big>
  </Plate>;
};

const Mist: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0]; const [src, bad] = MIST[n - 1]; const e = k(f, 0, 10);
  return <Plate src={src} d={0.5}>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, height: 170, background: CAUTION, transform: `translateX(${(1 - e) * -2000}px)` }}>
      <div style={{ position: "absolute", left: 120, top: 15, bottom: 15, right: 120, background: "rgba(20,18,16,.94)", display: "flex", alignItems: "center", gap: 40, padding: "0 40px" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 110, color: "#f2c418" }}>{n}</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 68, color: WHITE, whiteSpace: "nowrap" }}>{bad}</div></div></div>
  </Plate>;
};

// ================= asked (368) + ask:n — preguntas en fichas pegadas con cinta sobre cartón
const ASK: [string, string][] = [["g3740", "Is this real or is it AI?"], ["g2270", "Inside, if I crack a window?"], ["g3840", "How long does a burner last?"], ["g3870", "One in the trunk for winter?"], ["g3900", "Cooking oil instead of wax?"]];
const Asked: React.FC<P> = () => {
  const f = useCurrentFrame();
  return <Plate src="g1920" d={0.85}>
    {ASK.map(([, q], i) => <div key={i} style={{ position: "absolute", left: i < 3 ? 110 + i * 580 : 400 + (i - 3) * 580, top: 120 + Math.floor(i / 3) * 360 + (i >= 3 ? 0 : 0), width: 520, padding: "36px 36px", background: "#fbf8ee", transform: `rotate(${[-2, 1.5, -1, 2, -1.5][i]}deg) translateY(${(1 - k(f, 4 + i * 7, 10)) * 900}px)`, boxShadow: "0 16px 22px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: 180, top: -20, width: 160, height: 44, background: "rgba(232,222,190,.9)", transform: "rotate(-3deg)" }} />
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54, color: ENAMEL, lineHeight: 1.05 }}>{q}</div></div>)}
    <Big e={k(f, 44, 12)} y={70} size={74}>You asked me.</Big>
  </Plate>;
};
const Ask: React.FC<P> = ({ a }) => {
  const f = useCurrentFrame(); const n = +a[0]; const [src, q] = ASK[n - 1]; const e = k(f, 0, 12);
  return <Plate src={src} d={0.55}>
    <div style={{ position: "absolute", left: 160, right: 160, bottom: 130, padding: "36px 50px", background: "#fbf8ee", transform: `rotate(-1.5deg) translateY(${(1 - e) * 600}px)`, boxShadow: "0 16px 22px rgba(0,0,0,.5)" }}>
      <Lbl size={40} col="#7a6a4a">QUESTION {n} OF 5</Lbl>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 88, color: ENAMEL, lineHeight: 1.05, marginTop: 8 }}>{q}</div></div>
  </Plate>;
};

// ================= memory (400): la foto vieja del auto del padre — se da vuelta y atrás dice «Dad's storm box»
const Memory: React.FC<P> = () => {
  const f = useCurrentFrame(); const flip = interpolate(f, [90, 110], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return <Plate src="g4030" d={0.75}>
    <div style={{ position: "absolute", left: 1140, top: 150, width: 620, height: 520, perspective: 2000 }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${flip}deg) rotate(3deg) translateY(${(1 - k(f, 0, 14)) * 600}px)` }}>
        <div style={{ position: "absolute", inset: 0, background: "#f1ead6", padding: "26px 26px 90px", boxSizing: "border-box", backfaceVisibility: "hidden", boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
          <div style={{ width: "100%", height: "100%", backgroundImage: IMG("g4010"), backgroundSize: "cover", filter: "sepia(.4) saturate(.85)" }} /></div>
        <div style={{ position: "absolute", inset: 0, background: "#f1ead6", transform: "rotateY(180deg)", backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 22px 30px rgba(0,0,0,.5)" }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: ENAMEL, textAlign: "center", lineHeight: 1.1, transform: "rotate(-4deg)" }}>Dad's storm box<br />winter, '87</div></div>
      </div></div>
    <Big e={k(f, 116, 12)} y={80} size={72}>He never needed it. It was always there.</Big>
  </Plate>;
};

// ================= canpack (406): la lata vista en corte se llena de abajo hacia arriba con cada cosa
const PACK: [string, number][] = [["2 TUNA CAN BURNERS", 110], ["A SMALL STEEL POT", 150], ["STRIKE-ANYWHERE MATCHES", 70], ["A PAIR OF PLIERS", 80], ["A BLOCK OF PARAFFIN", 90]];
const CanPack: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); let acc = 0;
  return <Plate src="g4090" d={0.8}>
    <div style={{ position: "absolute", left: 620, top: 130, width: 680, height: 640, borderRadius: "12px 12px 30px 30px", background: "linear-gradient(90deg,#7d838a,#e6e9ec 35%,#b7bcc1 60%,#6f757c)", boxShadow: "0 22px 30px rgba(0,0,0,.55)", overflow: "hidden" }}>
      {PACK.map(([t, h], i) => { const e = k(f, M(m, i, 6 + i * 26), 10); const b = acc; acc += h + 10;
        return <div key={i} style={{ position: "absolute", left: 24, right: 24, bottom: 20 + b + (1 - e) * 600, height: h, opacity: cl(e * 2), background: [WAX, ENAMEL, RED, "#6d5a44", "#efe5c6"][i], borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 38, whiteSpace: "nowrap", color: i === 1 || i === 2 || i === 3 ? WHITE : INK }}>{t}</div>; })}
    </div>
    <Big e={k(f, 6, 12)} y={70} size={66}>Everything goes inside the stove.</Big>
  </Plate>;
};

// ================= kitmath (418): la cuenta del kit en una tira de sumadora
const KitMath: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const R: [string, string][] = [["BURNERS + REFILLS", "4 BURNS"], ["× 2 HOURS EACH", "= 8 HOURS"], ["1½ QUARTS AN HOUR", "= 12 QUARTS"]];
  const shown = R.filter((_, i) => f >= M(m, i, 8 + i * 30)).length;
  return <Plate src="g4120" d={0.72}>
    <div style={{ position: "absolute", left: 360, top: 140, width: 1200, background: "#fbfaf4", boxShadow: "0 22px 30px rgba(0,0,0,.5)", padding: "50px 60px 10px", boxSizing: "border-box", fontFamily: "monospace", opacity: shown ? 1 : 0 }}>
      {R.slice(0, shown).map(([l, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: i === 2 ? 60 : 44, fontWeight: 900, color: i === 2 ? ENAMEL : INK, marginBottom: 50, whiteSpace: "nowrap", gap: 30, borderTop: i === 2 ? "4px solid #222" : undefined, paddingTop: i === 2 ? 20 : 0 }}><span>{l}</span><span>{v}</span></div>)}
    </div>
  </Plate>;
};

// ================= days (423): tres días — cada día gasta 1½ cuartos de los 12 hervidos
const Days: React.FC<P> = ({ m }) => {
  const f = useCurrentFrame(); const used = [0, 1, 2].map((i) => k(f, M(m, 0, 10) + i * 18, 12)); const q = used.reduce((s, x) => s + x * 1.5, 0);
  return <Plate src="g0230" d={0.78}>
    <div style={{ position: "absolute", left: 180, right: 180, top: 140, display: "flex", gap: 40 }}>
      {["DAY 1", "DAY 2", "DAY 3"].map((d, i) => <div key={d} style={{ flex: 1, background: WAX, padding: "26px 30px", boxShadow: "0 16px 22px rgba(0,0,0,.45)", opacity: cl(used[i] * 1.5), transform: `translateY(${(1 - used[i]) * 300}px)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 56, color: ENAMEL }}>{d}</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: INK, marginTop: 10, lineHeight: 1.3, whiteSpace: "nowrap" }}>{[["OATMEAL", "CAN OF SOUP"], ["FRIED EGGS", "RAMEN"], ["COFFEE", "RICE + BEANS"]][i].map((x) => <div key={x}>{x}</div>)}</div></div>)}
    </div>
    <div style={{ position: "absolute", left: 180, right: 180, top: 560, height: 70, background: "rgba(255,255,255,.14)", borderRadius: 35 }}>
      <div style={{ width: `${(q / 12) * 100}%`, height: "100%", background: `linear-gradient(90deg,#7fb0f0,${BLUE})`, borderRadius: 35 }} />
      <Lbl size={40} style={{ position: "absolute", right: 30, top: 14 }}>{q.toFixed(1)} OF 12 QUARTS</Lbl></div>
    <Big e={k(f, M(m, 0, 10) + 60, 12)} y={90} size={70}>Three days of not eating cold food in the dark.</Big>
  </Plate>;
};

// ================= next (457): el próximo video
const Next: React.FC<P> = () => {
  const f = useCurrentFrame(); const e = k(f, 4, 14);
  return <Plate src="g2180" d={0.82}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", opacity: e, transform: `scale(${0.94 + 0.06 * e})` }}>
      <Lbl size={40} col={ORANGE} style={{ letterSpacing: 8 }}>NEXT VIDEO</Lbl>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 116, color: WHITE, lineHeight: 1.02, marginTop: 14, whiteSpace: "nowrap", textShadow: "0 5px 0 rgba(0,0,0,.5)" }}>The 3-in-1 Pellet Stove</div></div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, display: "flex", justifyContent: "center", gap: 40 }}>
      {["HEATS", "COOKS", "BOILS WATER"].map((t, i) => <div key={t} style={{ padding: "14px 34px", background: CORR, border: "4px solid #7a5530", fontFamily: SANS, fontWeight: 900, fontSize: 48, color: INK, opacity: k(f, 20 + i * 8, 8), transform: `translateY(${(1 - k(f, 20 + i * 8, 8)) * 80}px)` }}>{t}</div>)}</div>
  </Plate>;
};

// ---------- dispatcher
export const CompC15b: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  const [c, ...a] = String(s.comp).split(":"); const m: number[] = s.m || [];
  const T: Record<string, React.FC<P>> = { pieces: Pieces, part: Part, history: History, wick: Wick, stat: Stat, energy: Energy, measure: Measure, tubes: Tubes, stubs: Stubs, grease: Grease,
    bath: Bath, nowater: NoWater, pours: Pours, stove: Stove, where: Where, boiltimer: BoilTimer, lidwind: LidWind, menu: Menu, damper: Damper, tenmin: TenMin, lineup: Lineup, subq: SubQ,
    mistakes: Mistakes, mist: Mist, asked: Asked, ask: Ask, memory: Memory, canpack: CanPack, kitmath: KitMath, days: Days, next: Next };
  if (c === "carousel") return <Strips m={m} dur={dur} a={a} />;
  if (c === "recap") return <Strips m={m} dur={dur} a={a} recap />;
  if (c === "rc") return a[0] === "bonus" ? <RecapBonus m={m} dur={dur} a={a} /> : <Strips m={m} dur={dur} a={a} recap pick={+a[0]} />;
  const X = T[c]; return X ? <X m={m} dur={dur} a={a} /> : <AbsoluteFill style={{ background: "#f0f" }} />;
};
