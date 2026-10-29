// mar29a · componentes únicos 1-14 (minuto a minuto). Cada uno = UN mecanismo propio que no se repite en la tanda (ver D:/rtmp/mar29_COMPONENTES.md).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const C: React.FC<{ x?: number; y?: number; children: React.ReactNode }> = ({ x = 960, y = 560, children }) =>
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}>{children}</div>;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

// 1 · termostato de esfera: la aguja baja 68→61 y la escarcha entra por los bordes
export const HDial61: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = eio(tt, 0.8, 3.2), deg = lerp(68, 61, p), ang = -120 + (deg - 50) * 8;
  const fr = eio(tt, 1.4, 4.5);
  return <>
    <Head tt={tt} kick="DAYTON · JANUARY" title="THE HOUSE WON'T WARM" col={ICE} />
    <C y={590}><div style={{ width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #efe6d2, #c9bc9f 70%, #8e8169)", boxShadow: "0 50px 110px rgba(0,0,0,.7), inset 0 -14px 30px rgba(0,0,0,.25)", position: "relative", overflow: "hidden" }}>
      <svg width={520} height={520} style={{ position: "absolute" }}>
        {Array.from({ length: 31 }, (_, i) => { const a = (-120 + i * 8) * Math.PI / 180; const r1 = 205, r2 = i % 5 === 0 ? 172 : 188;
          return <line key={i} x1={260 + r1 * Math.sin(a)} y1={260 - r1 * Math.cos(a)} x2={260 + r2 * Math.sin(a)} y2={260 - r2 * Math.cos(a)} stroke="#3b342a" strokeWidth={i % 5 === 0 ? 5 : 2} />; })}
        {[50, 60, 70, 80].map((v) => { const a = (-120 + (v - 50) * 8) * Math.PI / 180; return <text key={v} x={260 + 140 * Math.sin(a)} y={272 - 140 * Math.cos(a)} textAnchor="middle" fontSize={34} fontWeight={800} fill="#3b342a">{v}</text>; })}
        <g transform={`rotate(${ang} 260 260)`}><polygon points="254,260 266,260 262,70 258,70" fill={RED} /><circle cx={260} cy={260} r={22} fill="#2a2520" /></g>
      </svg>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, transparent ${lerp(100, 46, fr)}%, rgba(225,240,255,.85) ${lerp(110, 70, fr)}%)`, mixBlendMode: "screen" }} />
    </div></C>
    <Tag tt={tt} at={2.6} x={1460} y={560} txt={`${Math.round(deg)}°`} col={ICE} size={120} />
    <Tag tt={tt} at={3.4} x={1460} y={680} txt="AND FALLING" col={DIM} size={30} />
  </>;
}}</Stage>;

// 2 · ticket de servicio que sale de la impresora, renglón por renglón, y el sello del filtro
export const HTicket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const out = eio(tt, 0.4, 3.6), rows: [string, string, number][] = [["SERVICE CALL", "$150", 1.2], ["TIME ON SITE", "90 SEC", 2.0], ["THE PROBLEM", "FILTER", 2.8]];
  const st = phys(tt, 3.9, 9, 0.35);
  return <>
    <Head tt={tt} kick="THE HOUSE CALL" title="WHAT IT REALLY COSTS" col={RED} />
    <div style={{ position: "absolute", left: 660, top: 250, width: 600, height: 40, borderRadius: 10, background: "#2b2b30", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 690, top: 270, width: 540, height: 640, overflow: "hidden" }}>
      <div style={{ width: 540, height: 640, background: "#f4efe3", transform: `translateY(${(out - 1) * 640}px)`, padding: "40px 46px", boxSizing: "border-box", fontFamily: "Courier New, monospace", color: "#2a2620", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 46px, rgba(0,0,0,.05) 46px 47px)" }}>
        <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 4, textAlign: "center" }}>INVOICE · No. 0117</div>
        {rows.map(([a, b, d], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 32, fontWeight: 700, marginTop: 50, opacity: cl((tt - d) * 3) }}><span>{a}</span><span>{b}</span></div>)}
        <div style={{ marginTop: 60, borderTop: "3px dashed #2a2620", paddingTop: 20, fontSize: 30, fontWeight: 900, opacity: cl((tt - 3.3) * 3), display: "flex", justifyContent: "space-between" }}><span>PART PRICE</span><span>$6</span></div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1010, top: 690, transform: `translate(-50%,-50%) rotate(-11deg) scale(${2.2 - 1.2 * st})`, opacity: cl(st * 3), border: `8px solid ${RED}`, color: RED, borderRadius: 14, padding: "8px 26px", fontFamily: MARK, fontSize: 70 }}>A $6 FILTER</div>
  </>;
}}</Stage>;

// 3 · el camino del aire: el aire da la vuelta por la casa; el filtro se tapa y las partículas se frenan y amontonan
export const HAirpath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const clog = eio(tt, 3.0, 6.0), N = 60;
  const path = (u: number): [number, number] => { // rectángulo redondeado: casa → retorno → filtro → soplador → ducto → casa
    const L = [[560, 330], [1360, 330], [1360, 800], [560, 800]]; const seg = Math.floor(u * 4) % 4, f = (u * 4) % 1;
    const a = L[seg], b = L[(seg + 1) % 4]; return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; };
  return <>
    <Head tt={tt} kick="HOW YOUR FURNACE BREATHES" title="ONE LOOP OF AIR" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect x={560} y={330} width={800} height={470} rx={40} fill="none" stroke="rgba(255,255,255,.13)" strokeWidth={70} />
      <rect x={530} y={480} width={60} height={170} rx={6} fill={`rgb(${lerp(240, 95, clog)},${lerp(240, 90, clog)},${lerp(235, 80, clog)})`} stroke={AMB} strokeWidth={4} />
      {Array.from({ length: N }, (_, i) => {
        const sp = lerp(0.11, 0.025, clog); let u = (i / N + tt * sp) % 1;
        const [x, y] = path(u); return <circle key={i} cx={x} cy={y} r={7} fill={ICE} opacity={0.85} />;
      })}
    </svg>
    <Tag tt={tt} at={0.9} x={960} y={270} txt="ROOMS" col={DIM} size={30} />
    <Tag tt={tt} at={1.4} x={430} y={565} txt="FILTER" col={AMB} size={34} />
    <Tag tt={tt} at={1.9} x={960} y={870} txt="BLOWER" col={DIM} size={30} />
    <Tag tt={tt} at={4.4} x={960} y={565} txt="AIR SLOWS DOWN" col={RED} size={64} />
  </>;
}}</Stage>;

// 4 · el fajo de $2.000 del año: se caen los $200 y el contador rueda a $400
export const HCash: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const fall = (i: number) => { const d = 2.2 + i * 0.25, x = tt - d; return x <= 0 ? 0 : 900 * x * x; };
  const cnt = tt < 4.6 ? lerp(0, 200, eio(tt, 2.2, 3.8)) : lerp(200, 400, eio(tt, 4.6, 6.2));
  return <>
    <Head tt={tt} kick="A YEAR OF HEATING & COOLING" title="WHERE THE MONEY GOES" col={GRN} />
    <C x={760} y={600}>{Array.from({ length: 20 }, (_, i) => {
      const top = i >= 18, f = top ? fall(i - 18) : 0, rot = -8 + i * 0.8 + (top ? f * 0.06 : 0);
      return <div key={i} style={{ position: "absolute", left: -260, top: -130 - i * 6 + f, width: 520, height: 230, borderRadius: 10, background: "linear-gradient(135deg,#a7c49a,#6f9363)", border: "3px solid #3f5c37", transform: `rotate(${rot}deg)`, opacity: f > 900 ? 0 : 1, boxShadow: "0 8px 18px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 70, color: "#2c4527" }}>100</div>;
    })}</C>
    <Tag tt={tt} at={0.9} x={760} y={330} txt="$2,000 A YEAR" col={TX} size={46} />
    <div style={{ position: "absolute", left: 1290, top: 470, fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 150, color: RED, opacity: cl((tt - 2) * 3), textShadow: "0 0 40px rgba(255,90,74,.4)" }}>{money(cnt)}</div>
    <Tag tt={tt} at={4.8} x={1480} y={700} txt="+ REPAIRS" col={DIM} size={40} />
  </>;
}}</Stage>;

// 5 · la flecha: el marco del filtro gira 180° y su flecha se alinea con el furnace
export const HFlipcard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const r = 180 * eio(tt, 1.2, 3.0), ok = cl((tt - 3.1) * 2), pul = 1 + 0.06 * Math.sin(tt * 6) * ok;
  return <>
    <Head tt={tt} kick="NUMBER ONE" title="THE ARROW" col={AMB} />
    <C x={760} y={580}><div style={{ perspective: 1600 }}><div style={{ width: 560, height: 380, transform: `rotateY(${r}deg)`, transformStyle: "preserve-3d", position: "relative" }}>
      {[0, 180].map((f) => <div key={f} style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: `rotateY(${f}deg)`, borderRadius: 8, border: "26px solid #d8c9a6", background: "repeating-linear-gradient(90deg,#f2f0ea 0 22px,#d6d3cb 22px 26px)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <svg width={508} height={328} style={{ position: "absolute", top: 0, left: 0 }}><g transform={`translate(254 164) scale(${f ? 1 : -1} 1)`}><polygon points="-170,-26 80,-26 80,-70 180,0 80,70 80,26 -170,26" fill={f ? GRN : RED} stroke="#1a1a1a" strokeWidth={6} /></g></svg>
      </div>)}
    </div></div></C>
    <div style={{ position: "absolute", left: 1270, top: 360, width: 360, height: 460, borderRadius: 16, background: "linear-gradient(160deg,#77777d,#3d3d42)", boxShadow: `0 0 ${60 * ok}px rgba(111,227,154,${0.5 * ok}), 0 40px 80px rgba(0,0,0,.6)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 44, letterSpacing: 4, color: TX }}>FURNACE</div>
    <div style={{ position: "absolute", left: 1080, top: 560, transform: `translate(-50%,-50%) scale(${pul})`, opacity: ok, fontSize: 120, color: GRN, fontWeight: 900 }}>→</div>
    <Tag tt={tt} at={3.4} x={760} y={850} txt="ARROW → FURNACE" col={GRN} size={50} />
  </>;
}}</Stage>;

// 6 · la polaroid que se revela: Mrs. Kowalski, Kettering, 1991
export const HPolaroid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const d = phys(tt, 0.3, 5, 0.5), dev = eio(tt, 0.9, 4.0);
  return <>
    <C x={960} y={540}><div style={{ transform: `translateY(${(1 - d) * -500}px) rotate(${lerp(-24, -4, d)}deg)`, background: "#f5f2ea", padding: "30px 30px 120px", boxShadow: "0 50px 100px rgba(0,0,0,.7)" }}>
      <div style={{ position: "relative" }}><Photo id="f_kowalski" w={640} h={480} r={2} z={1.04} style={{ filter: `sepia(${0.5 - 0.3 * dev}) brightness(${lerp(2.6, 1, dev)}) contrast(${lerp(0.3, 1, dev)})` }} /></div>
      <div style={{ fontFamily: HAND, fontSize: 64, color: "#2a3a6a", textAlign: "center", marginTop: 22, opacity: cl((tt - 2.6) * 2) }}>Kettering, 1991</div>
    </div></C>
  </>;
}}</Stage>;

// 7 · el deslizador MERV: sube 8 → 11 → 13 y las columnas de aire se achican
export const HMervSlider: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const p = tt < 2.6 ? 0.5 * eio(tt, 1.0, 2.4) : 0.5 + 0.5 * eio(tt, 2.8, 4.4), merv = Math.round(lerp(8, 13, p));
  const air = lerp(1, 0.32, p * p);
  return <>
    <Head tt={tt} kick="NUMBER TWO" title="THE FANCY FILTER" col={AMB} />
    <div style={{ position: "absolute", left: 360, top: 830, width: 1200, height: 14, borderRadius: 7, background: `linear-gradient(90deg, ${GRN}, ${AMB}, ${RED})` }} />
    {[8, 11, 13].map((v) => <div key={v} style={{ position: "absolute", left: 360 + (v - 8) / 5 * 1200, top: 880, transform: "translateX(-50%)", fontWeight: 900, fontSize: 40, color: DIM }}>MERV {v}</div>)}
    <div style={{ position: "absolute", left: 360 + p * 1200, top: 837, width: 64, height: 64, borderRadius: "50%", transform: "translate(-50%,-50%)", background: TX, boxShadow: "0 10px 30px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 9 }, (_, i) => { const hgt = 420 * air * (0.85 + 0.15 * Math.sin(tt * 5 + i));
      return <div key={i} style={{ position: "absolute", left: 520 + i * 105, top: 760 - hgt, width: 60, height: hgt, borderRadius: 12, background: `linear-gradient(180deg, rgba(150,210,255,.9), rgba(150,210,255,.15))` }} />; })}
    <Tag tt={tt} at={1.2} x={1640} y={420} txt={`MERV ${merv}`} col={merv > 11 ? RED : GRN} size={70} />
    <Tag tt={tt} at={4.6} x={1640} y={520} txt="LESS AIR" col={RED} size={50} />
  </>;
}}</Stage>;

// 8 · cinta métrica: se estira, tacha «16 x 25» y escribe la medida real
export const HTape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const ext = eio(tt, 0.6, 2.6), strike = eio(tt, 3.2, 4.0);
  return <>
    <Head tt={tt} kick="NUMBER THREE" title="THE SIZE LIE" col={AMB} />
    <div style={{ position: "absolute", left: 300, top: 560, width: 190, height: 190, borderRadius: 30, background: "linear-gradient(150deg,#f2c230,#b88a10)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", transform: "translateY(-50%)" }} />
    <div style={{ position: "absolute", left: 470, top: 610, width: 1150 * ext, height: 70, background: "#f4d34a", overflow: "hidden", boxShadow: "0 12px 26px rgba(0,0,0,.5)" }}>
      {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 20, top: 0, width: 3, height: i % 4 === 0 ? 40 : 20, background: "#2a2620" }} />)}
    </div>
    <div style={{ position: "absolute", left: 960, top: 380, transform: "translateX(-50%)", fontWeight: 900, fontSize: 110, color: DIM, opacity: cl((tt - 1.6) * 3) }}>16 x 25
      <div style={{ position: "absolute", left: 0, top: "52%", height: 10, width: `${strike * 100}%`, background: RED, borderRadius: 5 }} /></div>
    <div style={{ position: "absolute", left: 960, top: 760, transform: "translateX(-50%)", fontFamily: HAND, fontSize: 120, color: GRN, clipPath: `inset(0 ${(1 - eio(tt, 4.2, 5.6)) * 100}% 0 0)` }}>15½ x 24½</div>
  </>;
}}</Stage>;

// 9 · el aire es vago: las líneas de corriente esquivan el filtro y se meten por la rendija del costado
export const HGapflow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const g = eio(tt, 0.8, 2.0);
  return <>
    <Head tt={tt} kick="A GAP ALONG THE EDGE" title="AIR IS LAZY" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <rect x={900} y={300} width={70} height={430} fill="#e9e5da" stroke="#c9b48a" strokeWidth={8} />
      <rect x={900} y={730} width={70} height={60 * g} fill="rgba(255,90,74,.25)" />
      {Array.from({ length: 11 }, (_, i) => {
        const y0 = 320 + i * 40, through = i < 3; const k = (tt * 260 + i * 70) % 1300;
        const d = through ? `M 300 ${y0} L 1620 ${y0}` : `M 300 ${y0} C 760 ${y0}, 820 ${760}, 935 ${760} S 1150 ${y0}, 1620 ${y0}`;
        return <path key={i} d={d} fill="none" stroke={through ? ICE : RED} strokeWidth={5} strokeDasharray="60 1240" strokeDashoffset={-k} opacity={cl((tt - 0.6 - i * 0.05) * 2)} />;
      })}
    </svg>
    <Tag tt={tt} at={3.2} x={960} y={880} txt="AROUND, NOT THROUGH" col={RED} size={60} />
  </>;
}}</Stage>;

// 10 · el calendario: se arrancan las hojas día a día hasta el sello del día 35
export const HCalendar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const day = Math.min(35, Math.floor(1 + 34 * eio(tt, 0.7, 4.0))), fr = ((1 + 34 * eio(tt, 0.7, 4.0)) % 1);
  const st = phys(tt, 4.3, 9, 0.35);
  return <>
    <Head tt={tt} kick="NUMBER FOUR" title="THE 90-DAY MYTH" col={AMB} />
    <C x={960} y={590}><div style={{ width: 460, height: 520, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "#fbf8f0", borderRadius: 14, boxShadow: "0 40px 90px rgba(0,0,0,.6)", overflow: "hidden" }}>
        <div style={{ height: 110, background: RED, color: TX, fontWeight: 900, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 6 }}>DAY</div>
        <div style={{ fontWeight: 900, fontSize: 260, color: "#2a2620", textAlign: "center", lineHeight: "380px" }}>{day}</div>
      </div>
      {day < 35 && <div style={{ position: "absolute", left: 0, top: 110, width: 460, height: 410, background: "#f1ece0", transformOrigin: "top", transform: `perspective(900px) rotateX(${fr * 120}deg)`, opacity: 1 - fr, borderRadius: "0 0 14px 14px" }} />}
    </div></C>
    <div style={{ position: "absolute", left: 1290, top: 560, transform: `translate(-50%,-50%) rotate(-12deg) scale(${2.2 - 1.2 * st})`, opacity: cl(st * 3), border: `8px solid ${RED}`, color: RED, borderRadius: 14, padding: "6px 22px", fontFamily: MARK, fontSize: 64 }}>FULL!</div>
    <Tag tt={tt} at={0.9} x={560} y={560} txt="BOX SAYS 90" col={DIM} size={40} />
  </>;
}}</Stage>;

// 11 · el interruptor de límite: el termómetro sube, el contacto salta con un clic y la llama se apaga
export const HLimit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const temp = eio(tt, 0.8, 3.4), trip = tt > 3.5, k = trip ? phys(tt, 3.5, 14, 0.3) : 0;
  return <>
    <Head tt={tt} kick="A SAFETY SWITCH" title="THE HIGH LIMIT" col={RED} />
    <div style={{ position: "absolute", left: 520, top: 260, width: 70, height: 560, borderRadius: 35, background: "rgba(255,255,255,.12)", border: "4px solid rgba(255,255,255,.3)" }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${18 + 82 * temp}%`, borderRadius: 35, background: `linear-gradient(0deg, ${RED}, ${AMB})` }} /></div>
    <div style={{ position: "absolute", left: 490, top: 820, width: 130, height: 130, borderRadius: "50%", background: RED }} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <circle cx={900} cy={560} r={20} fill={TX} /><circle cx={1180} cy={560} r={20} fill={TX} />
      <line x1={900} y1={560} x2={900 + 280 * Math.cos(-0.45 * k)} y2={560 + 280 * Math.sin(-0.45 * k)} stroke={TX} strokeWidth={16} strokeLinecap="round" />
    </svg>
    <div style={{ position: "absolute", left: 1450, top: 560, transform: `translate(-50%,-50%) scale(${trip ? Math.max(0.05, 1 - k) : 1 + 0.08 * Math.sin(tt * 12)})`, fontSize: 200 }}>🔥</div>
    <Tag tt={tt} at={3.7} x={1040} y={760} txt="CLICK. HEAT OFF." col={RED} size={64} />
  </>;
}}</Stage>;

// 12 · la prueba de la linterna: el haz atraviesa un filtro sano y se ahoga en uno usado
export const HGlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const dirt = eio(tt, 3.0, 4.6);
  return <>
    <Head tt={tt} kick="NUMBER FIVE" title="THE FLASHLIGHT TEST" col={AMB} />
    <C x={960} y={580}><div style={{ position: "relative", width: 640, height: 440 }}>
      <div style={{ position: "absolute", inset: -120, background: `radial-gradient(circle, rgba(255,240,200,${0.9 - 0.85 * dirt}), transparent 60%)`, filter: "blur(10px)" }} />
      <div style={{ position: "absolute", inset: 0, border: "22px solid #d8c9a6", background: `repeating-linear-gradient(90deg, rgba(240,236,226,${0.55 + 0.4 * dirt}) 0 22px, rgba(200,195,185,${0.6 + 0.4 * dirt}) 22px 26px)`, filter: `brightness(${lerp(1.3, 0.28, dirt)})`, boxShadow: "0 40px 90px rgba(0,0,0,.6)" }} />
    </div></C>
    <Tag tt={tt} at={1.2} x={960} y={880} txt={dirt < 0.5 ? "GLOWS = GOOD" : "DARK = DONE"} col={dirt < 0.5 ? GRN : RED} size={66} />
  </>;
}}</Stage>;

// 13 · el cronómetro de bolsillo: 10 segundos por mes
export const HStopwatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = Math.min(10, Math.max(0, (tt - 0.8) * 2.4)), a = s * 36;
  return <>
    <Head tt={tt} kick="ONCE A MONTH" title="THE FIRST OF THE MONTH" col={GRN} />
    <C x={960} y={590}><div style={{ width: 470, height: 470, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fff, #d9d6cf 70%)", border: "18px solid #b9b2a2", boxShadow: "0 50px 100px rgba(0,0,0,.6)", position: "relative" }}>
      <svg width={434} height={434} style={{ position: "absolute" }}>
        <path d={`M 217 217 L 217 40 A 177 177 0 ${a > 180 ? 1 : 0} 1 ${217 + 177 * Math.sin(a * Math.PI / 180)} ${217 - 177 * Math.cos(a * Math.PI / 180)} Z`} fill="rgba(111,227,154,.35)" />
        {Array.from({ length: 10 }, (_, i) => <line key={i} x1={217 + 190 * Math.sin(i * 0.628)} y1={217 - 190 * Math.cos(i * 0.628)} x2={217 + 165 * Math.sin(i * 0.628)} y2={217 - 165 * Math.cos(i * 0.628)} stroke="#2a2620" strokeWidth={6} />)}
        <line x1={217} y1={217} x2={217 + 170 * Math.sin(a * Math.PI / 180)} y2={217 - 170 * Math.cos(a * Math.PI / 180)} stroke={RED} strokeWidth={8} strokeLinecap="round" />
      </svg>
    </div></C>
    <Tag tt={tt} at={1.0} x={1450} y={560} txt={`${Math.floor(s)} SEC`} col={GRN} size={110} />
  </>;
}}</Stage>;

// 14 · el filtro lavable bajo la manguera: corre el agua y el medidor de lo que atrapa se cae
export const HRinse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const g = lerp(78, 35, eio(tt, 2.2, 5.0));
  return <>
    <Head tt={tt} kick="WASHABLE FILTERS" title="SOUNDS SMART" col={ICE} />
    <div style={{ position: "absolute", left: 470, top: 340, width: 520, height: 380, border: "20px solid #8d9196", background: "repeating-linear-gradient(45deg, rgba(200,205,210,.5) 0 8px, transparent 8px 16px)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 40 }, (_, i) => { const y = ((tt * 900 + i * 97) % 700) + 200; return <div key={i} style={{ position: "absolute", left: 500 + (i * 53) % 460, top: y, width: 8, height: 26, borderRadius: 6, background: "rgba(150,210,255,.75)" }} />; })}
    <div style={{ position: "absolute", left: 1240, top: 300, width: 120, height: 460, borderRadius: 18, background: "rgba(255,255,255,.1)", border: "4px solid rgba(255,255,255,.3)", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${g}%`, background: g > 55 ? GRN : RED }} /></div>
    <Tag tt={tt} at={0.8} x={1300} y={810} txt="CATCHES" col={DIM} size={34} />
    <Tag tt={tt} at={1.0} x={1560} y={530} txt={`${Math.round(g)}%`} col={g > 55 ? GRN : RED} size={100} />
    <Tag tt={tt} at={3.4} x={730} y={870} txt="LESS THAN PAPER" col={RED} size={50} />
  </>;
}}</Stage>;
