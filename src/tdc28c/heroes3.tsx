// componentes únicos de tdc28c · 32-46 (minutos 19-31): secado, cuánto duran, monóxido, otras mezclas y comentarios.
import React from "react";
import { AMB, DIM, GRN, H, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Briq, Check, Cross, Grains } from "./heroes1";

// ---- 19:30 · LA PRUEBA DEL SONIDO: dos briquetas que chocan; onda sorda (agua adentro) contra onda clara (seca) ----
export const HSound: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const hit = (a: number) => { const d = tt - a; return d < 0 ? 1 : d < 0.18 ? 1 - d / 0.18 : 0; };
  const W = ({ y, a, clear, col, lbl, sub }: { y: number; a: number; clear: boolean; col: string; lbl: string; sub: string }) => {
    const d = Math.max(0, tt - a), g = hit(a);
    const pts = Array.from({ length: 120 }, (_, i) => { const x = i / 119, amp = d > 0 ? Math.exp(-x * (clear ? 1.2 : 7)) * (clear ? 70 : 60) * cl(d * 3 - x * 2) : 0; return `${900 + x * 820},${y + amp * Math.sin(x * (clear ? 90 : 22))}`; }).join(" ");
    return <>
      <Briq x={420 - 70 * g} y={y} w={110} h={150} rot={-80} /><Briq x={600 + 70 * g} y={y} w={110} h={150} rot={80} />
      {d > 0 && d < 0.4 && <div style={{ position: "absolute", left: 470, top: y - 60, width: 80, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${col}, transparent 70%)`, opacity: 1 - d / 0.4 }} />}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><polyline points={pts} fill="none" stroke={col} strokeWidth={6} /></svg>
      <Tag tt={tt} at={a + 0.3} x={1310} y={y - 120} txt={lbl} col={col} size={42} />
      <Tag tt={tt} at={a + 0.5} x={1310} y={y + 110} txt={sub} col={DIM} size={28} />
    </>;
  };
  return <>
    <Head tt={tt} kick="LAS GOLPEÁS UNA CONTRA OTRA" title="¿CÓMO SUENAN?" col={ICE} />
    <W y={470} a={1.2} clear={false} col="#b9a68f" lbl="SORDAS · TODAVÍA TIENEN AGUA" sub="otro día al sol" />
    <W y={800} a={3.6} clear col={GRN} lbl="CLARAS, COMO DOS TEJAS · SECAS" sub="listas para guardar" />
  </>;
}}</Stage>;

// ---- 19:45 · NO AL LADO DE LA ESTUFA: el agua de adentro se hace vapor de golpe y la briqueta revienta ----
export const HSteamBurst: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 30% 60%, #3a1a0e, #0a0605 75%)">{(tt) => {
  const blow = h.blowAt !== undefined ? (h.blowAt as number) - h.at : 3.4, b = tt - blow, heat = cl(tt / Math.max(0.5, blow));
  return <>
    <Head tt={tt} kick="PARA APURARTE" title="AL LADO DEL FUEGO EXPLOTA" col={RED} />
    {/* estufa a la izquierda, al rojo */}
    <div style={{ position: "absolute", left: 160, top: 330, width: 420, height: 620, borderRadius: 30, background: "linear-gradient(90deg,#1a1210,#3a2a24 40%,#1a1210)" }}>
      <div style={{ position: "absolute", left: 90, top: 220, width: 240, height: 200, borderRadius: 16, background: "radial-gradient(ellipse at 50% 70%, #ffb04a, #ff5a1a 50%, #6a1a08)" }} />
    </div>
    {Array.from({ length: 6 }, (_, i) => { const ph = (tt * 0.7 + i / 6) % 1; return <svg key={i} width={300} height={40} style={{ position: "absolute", left: 600 + ph * 200, top: 450 + i * 70, opacity: Math.sin(ph * Math.PI) * 0.6 }}><path d="M0 20 Q40 0 80 20 T160 20 T240 20" stroke="#ff8a4a" strokeWidth={5} fill="none" /></svg>; })}
    {/* briqueta en corte: burbujas de vapor que crecen */}
    {b < 0 && <div style={{ position: "absolute", left: 1020, top: 400, width: 340, height: 460, borderRadius: 28, background: "linear-gradient(90deg,#141414,#3a3836 40%,#1c1c1c)", boxShadow: "0 0 0 4px rgba(140,210,255,.25)", overflow: "hidden" }}>
      {Array.from({ length: 22 }, (_, i) => { const s = 10 + 40 * heat * ((i % 4) / 4 + 0.4); return <div key={i} style={{ position: "absolute", left: 30 + (i * 71) % 260 - s / 2, top: 40 + (i * 53) % 380 - s / 2, width: s, height: s, borderRadius: "50%", background: "rgba(200,235,255,.55)", boxShadow: "0 0 12px rgba(200,235,255,.6)" }} />; })}
    </div>}
    {b < 0 && <Tag tt={tt} at={0.8} x={1190} y={920} txt="AGUA ADENTRO → VAPOR" col={ICE} size={34} />}
    {/* revienta: pedazos que vuelan */}
    {b >= 0 && <>
      <div style={{ position: "absolute", left: 1190 - 300, top: 630 - 300, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,240,220,.9), rgba(255,140,60,.4) 30%, transparent 65%)", opacity: cl(1 - b * 1.6) }} />
      {Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2 + 0.3, v = 500 + (i % 4) * 160; return <div key={i} style={{ position: "absolute", left: 1190 + Math.cos(a) * v * b - 30, top: 630 + Math.sin(a) * v * b + 500 * b * b - 30, width: 40 + (i % 3) * 20, height: 30 + (i % 4) * 14, clipPath: "polygon(10% 20%,60% 0,100% 40%,80% 100%,20% 90%,0 50%)", background: "#2a2826", transform: `rotate(${b * 600 * (i % 2 ? 1 : -1)}deg)` }} />; })}
      <Tag tt={tt} at={blow + 0.4} x={1190} y={940} txt="SOL Y AIRE · PACIENCIA" col={AMB} size={44} />
    </>}
  </>;
}}</Stage>;

// ---- 20:48 · LA CARRERA CON EL RELOJ: carbón de bolsa contra briquetas, dos curvas de calor en el tiempo ----
export const HRace: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse at 50% 40%, #241c16, #080605 80%)">{(tt) => {
  const d = eio(tt, 0.8, 6.8), X = (m: number) => 260 + m * 12.5, Y = (v: number) => 860 - v * 4.6;
  const bag = (m: number) => m < 10 ? m * 10 : m < 45 ? 100 - (m - 10) * 0.3 : Math.max(0, 89.5 - (m - 45) * 3.2);
  const bq = (m: number) => m < 20 ? m * 4 : m < 95 ? 80 + 2 * Math.sin(m / 9) : Math.max(25, 80 - (m - 95) * 1.6);
  const pts = (f: (m: number) => number) => Array.from({ length: 111 }, (_, i) => i).filter((m) => m <= 110 * d).map((m) => `${X(m)},${Y(f(m))}`).join(" ");
  const now = 110 * d;
  return <>
    <Head tt={tt} kick="CON EL RELOJ EN LA MANO" title="BOLSA CONTRA BRIQUETA" />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={260} y1={860} x2={1680} y2={860} stroke="rgba(255,255,255,.4)" strokeWidth={3} />
      {[0, 30, 60, 90].map((m) => <g key={m}><line x1={X(m)} y1={860} x2={X(m)} y2={876} stroke="rgba(255,255,255,.4)" strokeWidth={3} /><text x={X(m)} y={916} textAnchor="middle" fontSize={30} fontWeight={800} fill={DIM}>{m === 0 ? "0" : m === 60 ? "1 h" : m === 90 ? "1 h 30" : "30 min"}</text></g>)}
      <polyline points={pts(bag)} fill="none" stroke="#ffb257" strokeWidth={9} strokeLinejoin="round" />
      <polyline points={pts(bq)} fill="none" stroke="#ff5a2a" strokeWidth={11} strokeLinejoin="round" />
      <line x1={X(now)} y1={340} x2={X(now)} y2={860} stroke="rgba(255,255,255,.25)" strokeWidth={2} strokeDasharray="8 8" />
    </svg>
    <Tag tt={tt} at={1.6} x={X(14)} y={Y(100) - 50} txt="BOLSA: LLAMA Y CHISPAS" col="#ffb257" size={32} anchor="l" />
    {d > 0.55 && <Tag tt={tt} at={4.6} x={X(62)} y={Y(40)} txt="A LA HORA Y DIEZ: BRASITAS" col="#ffb257" size={30} anchor="l" />}
    {d > 0.82 && <Tag tt={tt} at={6.0} x={X(66)} y={Y(80) - 60} txt="BRIQUETAS: PAREJAS, SIN LLAMA" col="#ff5a2a" size={34} anchor="l" />}
    <Tag tt={tt} at={7.2} x={1460} y={990} txt="CASI EL DOBLE DE TIEMPO ÚTIL" col={TX} size={40} />
  </>;
}}</Stage>;

// ---- 21:45 · COMO UN CAROZO: corte de la briqueta que se quema de afuera para adentro; la arcilla queda de cáscara ----
export const HCore: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 50%, #1e1410, #050303 75%)">{(tt) => {
  const burn = eio(tt, 0.8, 5.6), r0 = 300;
  return <>
    <Head tt={tt} kick="POR QUÉ DURAN MÁS" title="SE QUEMA COMO UN CAROZO" />
    <svg width={800} height={800} style={{ position: "absolute", left: 560, top: 260 }}>
      <defs><radialGradient id="crb"><stop offset="0" stopColor="#ffd27a" /><stop offset=".5" stopColor="#ff6a1a" /><stop offset="1" stopColor="#7a1a06" /></radialGradient></defs>
      <circle cx={400} cy={400} r={r0} fill="#c98a6a" opacity={0.55 + 0.3 * burn} />
      <circle cx={400} cy={400} r={r0 - 24} fill="url(#crb)" />
      <circle cx={400} cy={400} r={Math.max(0, (r0 - 60) * (1 - 0.72 * burn))} fill="#161514" />
      {Array.from({ length: 40 }, (_, i) => { const a = i / 40 * Math.PI * 2, r = (r0 - 60) * (1 - 0.72 * burn) * (0.3 + (i % 5) * 0.14); return <circle key={i} cx={400 + Math.cos(a) * r} cy={400 + Math.sin(a) * r} r={4} fill="rgba(255,255,255,.12)" />; })}
      {Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2 + tt * 0.2; return <path key={i} d={`M${400 + Math.cos(a) * (r0 + 120)} ${400 + Math.sin(a) * (r0 + 120)} L${400 + Math.cos(a) * (r0 + 40)} ${400 + Math.sin(a) * (r0 + 40)}`} stroke={ICE} strokeWidth={5} opacity={0.5} />; })}
    </svg>
    <Tag tt={tt} at={1.6} x={300} y={420} txt="APRETADA: SIN AIRE ADENTRO" col={TX} size={32} anchor="l" />
    <Tag tt={tt} at={3.0} x={1400} y={360} txt="LA ARCILLA: CÁSCARA" col="#e3a988" size={36} anchor="l" />
    <Tag tt={tt} at={3.4} x={1400} y={410} txt="guarda el calor, frena el aire" col={DIM} size={28} anchor="l" />
    <Tag tt={tt} at={5.0} x={960} y={1010} txt="EL BARRO ES EL FRENO" col={AMB} size={46} />
  </>;
}}</Stage>;

// ---- 22:33 · TE RECOSTÁS UN RATITO: la pieza de noche, el brasero adentro y el gas que no se ve llenando el cuarto ----
export const HCORoom: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 40%, #121826, #04060a 80%)">{(tt) => {
  const fill = eio(tt, 0.8, 4.8), x = cl(tt - 5.2);
  return <>
    <Head tt={tt} kick="NO TIENE OLOR · NO TIENE COLOR · NO PICA" title="NO TE DAS CUENTA" col={RED} />
    {/* la pieza en corte */}
    <div style={{ position: "absolute", left: 360, top: 320, width: 1200, height: 620, border: "10px solid #3a3f4a", borderRadius: 8, background: "#0d1119", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 80, top: 80, width: 180, height: 200, border: "8px solid #2a3040", background: "linear-gradient(180deg,#0a1630,#1a2a50)" }}><div style={{ position: "absolute", left: 120, top: 30, width: 30, height: 30, borderRadius: "50%", background: "#e8e4c8" }} /></div>
      {/* cama */}
      <div style={{ position: "absolute", left: 520, top: 400, width: 560, height: 120, borderRadius: 14, background: "linear-gradient(180deg,#6a7aa0,#3a4a70)" }} />
      <div style={{ position: "absolute", left: 540, top: 370, width: 150, height: 60, borderRadius: 20, background: "#d8d4cc" }} />
      <div style={{ position: "absolute", left: 640, top: 360, width: 420, height: 70, borderRadius: "40px 40px 10px 10px", background: "#4f6a9a" }} />
      {/* brasero */}
      <div style={{ position: "absolute", left: 240, top: 470, width: 160, height: 90, clipPath: "polygon(0 0,100% 0,85% 100%,15% 100%)", background: "#2a2522" }} />
      <div style={{ position: "absolute", left: 250, top: 452, width: 140, height: 36, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(255,110,40,${0.7 + 0.2 * Math.sin(tt * 2)}), #3a1206)` }} />
      {/* el gas: puntitos rojos que llenan desde arriba (lo que no se ve) */}
      {Array.from({ length: 90 }, (_, i) => { const px = (i * 131) % 1180, py = (i * 71) % 600, vis = cl(fill * 1.3 - py / 700 * 0.3); return <div key={i} style={{ position: "absolute", left: px + 10 * Math.sin(tt * 0.5 + i), top: py + 8 * Math.cos(tt * 0.4 + i), width: 16, height: 16, borderRadius: "50%", background: "rgba(255,74,61,.5)", opacity: vis * 0.8 }} />; })}
      <div style={{ position: "absolute", inset: 0, background: `rgba(255,74,61,${0.12 * fill})` }} />
    </div>
    <Cross x={960} y={630} s={460} p={x} />
    <Tag tt={tt} at={5.6} x={960} y={1000} txt="NUNCA EL BRASERO A LA PIEZA" col={RED} size={46} />
  </>;
}}</Stage>;

// ---- 23:21 · NUNCA… : cinco lugares que se tachan de a uno (pieza, baño, auto, garaje cerrado, «un ratito») ----
export const HNeverList: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L = [
    { n: "LA PIEZA", ic: <svg width={150} height={110}><rect x={10} y={50} width={130} height={40} rx={8} fill="#6a7aa0" /><rect x={14} y={34} width={40} height={22} rx={8} fill="#d8d4cc" /><rect x={8} y={88} width={10} height={20} fill="#3a4a70" /><rect x={132} y={88} width={10} height={20} fill="#3a4a70" /></svg> },
    { n: "EL BAÑO", ic: <svg width={150} height={110}><path d="M20 50 L130 50 L120 95 L30 95 Z" fill="#e8e4dc" /><rect x={20} y={10} width={10} height={44} fill="#9aa0a6" /><path d="M30 14 L60 14" stroke="#9aa0a6" strokeWidth={8} /></svg> },
    { n: "EL AUTO", ic: <svg width={150} height={110}><path d="M10 70 L30 40 L110 40 L135 70 L140 85 L10 85 Z" fill="#5a8ad0" /><circle cx={40} cy={88} r={14} fill="#222" /><circle cx={110} cy={88} r={14} fill="#222" /><rect x={40} y={46} width={30} height={20} fill="#bfe0ff" /><rect x={76} y={46} width={30} height={20} fill="#bfe0ff" /></svg> },
    { n: "GARAJE CERRADO", ic: <svg width={150} height={110}><path d="M10 40 L75 6 L140 40 L140 105 L10 105 Z" fill="#7a6a5a" /><rect x={30} y={50} width={90} height={55} fill="#4a4f55" />{[0, 1, 2, 3].map((k) => <line key={k} x1={30} y1={60 + k * 13} x2={120} y2={60 + k * 13} stroke="#2a2d30" strokeWidth={3} />)}</svg> },
    { n: "NI UN RATITO", ic: <svg width={150} height={110}><circle cx={75} cy={56} r={46} fill="#f2efe8" /><line x1={75} y1={56} x2={75} y2={22} stroke="#222" strokeWidth={6} /><line x1={75} y1={56} x2={100} y2={66} stroke="#222" strokeWidth={6} /></svg> },
  ];
  return <>
    <Head tt={tt} kick="NI CON LA VENTANA ABIERTA" title="EL BRASERO, NUNCA EN…" col={RED} />
    {L.map((l, i) => { const s = phys(tt, 0.6 + i * 0.9, 7, 0.45), x = 230 + i * 365, xx = cl((tt - 1.2 - i * 0.9) * 1.6);
      return <div key={i} style={{ position: "absolute", left: x - 160, top: 380, width: 320, height: 420, borderRadius: 30, background: "#16181d", boxShadow: "0 30px 70px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.08)", transform: `translateY(${(1 - cl(s)) * 120}px) rotate(${(1 - cl(s)) * (i % 2 ? 8 : -8)}deg)`, opacity: cl(s * 2) }}>
        <div style={{ position: "absolute", left: 85, top: 80 }}>{l.ic}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 270, textAlign: "center", fontWeight: 900, fontSize: 32 }}>{l.n}</div>
        <Cross x={160} y={150} s={220} p={xx} />
      </div>; })}
    <Tag tt={tt} at={5.4} x={960} y={920} txt="AFUERA, O EN ESTUFA CON CHIMENEA" col={GRN} size={44} />
  </>;
}}</Stage>;

// ---- 23:40 · EL DETECTOR: en la pared, chilla; flechas: abrí todo, salí afuera, después averiguás ----
export const HDetector: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#e8e2d6,#c9c1b0)">{(tt) => {
  const s = phys(tt, 0.6, 6, 0.5), al = cl(tt - 2.0), steps = ["ABRÍ TODO", "SALÍ AFUERA", "DESPUÉS VES"];
  return <>
    <div style={{ position: "absolute", left: 110, top: 80, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: "#5a5045" }}>A PILA · CUESTA MENOS QUE UNA BOLSA DE CARBÓN</div>
    <div style={{ position: "absolute", left: 110, top: 116, fontWeight: 900, fontSize: 60, color: "#1b1712" }}>UN DETECTOR EN LA PARED</div>
    <div style={{ position: "absolute", left: 500 - 140, top: 520 - 140, width: 280, height: 280, transform: `scale(${cl(s)})`, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#ffffff,#d8d4cc)", boxShadow: "0 30px 60px rgba(0,0,0,.25), 0 0 0 8px #bdb6a8" }}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 130 + 80 * Math.cos(i / 12 * Math.PI * 2) - 6, top: 130 + 80 * Math.sin(i / 12 * Math.PI * 2) - 6, width: 12, height: 12, borderRadius: "50%", background: "#9a9488" }} />)}
      <div style={{ position: "absolute", left: 115, top: 115, width: 50, height: 50, borderRadius: "50%", background: al > 0 && Math.sin(tt * 12) > 0 ? RED : "#7a2a22", boxShadow: al > 0 && Math.sin(tt * 12) > 0 ? `0 0 40px ${RED}` : undefined }} />
    </div>
    {al > 0 && [0, 1, 2].map((k) => { const ph = (tt * 1.2 + k / 3) % 1; return <div key={k} style={{ position: "absolute", left: 500 - 150 - 200 * ph, top: 520 - 150 - 200 * ph, width: 300 + 400 * ph, height: 300 + 400 * ph, borderRadius: "50%", border: `6px solid ${RED}`, opacity: 1 - ph }} />; })}
    {steps.map((st, i) => { const p = phys(tt, 2.8 + i * 0.9, 7, 0.45); return <div key={i} style={{ position: "absolute", left: 980, top: 380 + i * 150, transform: `translateX(${(1 - cl(p)) * 200}px)`, opacity: cl(p * 2), display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ width: 90, height: 90, borderRadius: 45, background: i === 2 ? "#5a5045" : RED, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 48 }}>{i + 1}</div>
      <div style={{ fontWeight: 900, fontSize: 64, color: "#1b1712" }}>{st}</div>
    </div>; })}
  </>;
}}</Stage>;

// ---- 24:24 · APAGAR SIN AGUA: la tapa cae sobre la lata, sin aire la brasa se apaga sola; el agua salta vapor y ceniza ----
export const HSnuff: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const lid = eio(tt, 2.6, 3.4), fade = cl((tt - 3.4) / 2.4);
  return <>
    <Head tt={tt} kick="CUANDO TERMINÁS" title="SE TAPA, NO SE MOJA" />
    {/* izquierda: agua → vapor y ceniza (X) */}
    <div style={{ position: "absolute", left: 300, top: 640, width: 280, height: 220, background: "linear-gradient(90deg,#5a5e64,#b9bec4,#5a5e64)", borderRadius: 10 }} />
    {Array.from({ length: 16 }, (_, i) => { const ph = (tt * 0.9 + i / 16) % 1; return <div key={i} style={{ position: "absolute", left: 440 + Math.sin(i * 2.3) * 160 * ph - 30, top: 620 - ph * 340 - 30, width: 60 + ph * 60, height: 60 + ph * 60, borderRadius: "50%", background: i % 3 ? "rgba(235,235,235,.35)" : "rgba(90,90,90,.6)", filter: "blur(10px)", opacity: cl(tt - 0.8) * Math.sin(ph * Math.PI) }} />; })}
    <Cross x={440} y={500} s={200} p={cl(tt - 1.4)} />
    <Tag tt={tt} at={1.2} x={440} y={930} txt="AGUA: SALTA VAPOR Y CENIZA" col={RED} size={32} />
    {/* derecha: lata con brasas que se tapa */}
    <div style={{ position: "absolute", left: 1220, top: 600, width: 340, height: 260, background: "linear-gradient(90deg,#5a5e64,#c9ced4 35%,#7a7f86)", borderRadius: "0 0 14px 14px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: `radial-gradient(ellipse at 50% 0%, rgba(255,110,40,${0.9 * (1 - fade)}), rgba(60,20,10,.9))` }} />
    </div>
    <div style={{ position: "absolute", left: 1200, top: 300 + 290 * lid, width: 380, height: 26, borderRadius: 8, background: "linear-gradient(180deg,#d6dade,#7a7f86)", transform: `rotate(${(1 - lid) * -18}deg)` }} />
    <Check x={1390} y={440} s={130} p={cl(tt - 4.4)} />
    <Tag tt={tt} at={3.8} x={1390} y={930} txt="SIN AIRE SE APAGA SOLA" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- 24:46 · OTRAS MEZCLAS: aserrín 1 a 3, hojas, marlos, cáscaras de maní, carozos — todo molido entra ----
export const HSawdust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = [{ n: "ASERRÍN", c: "#d9b27a" }, { n: "HOJAS SECAS", c: "#a8743a" }, { n: "MARLOS", c: "#e0c060" }, { n: "CÁSCARA DE MANÍ", c: "#c79a5e" }, { n: "CAROZOS", c: "#7a4a2a" }];
  return <>
    <Head tt={tt} kick="PARA ESTIRAR EL CARBÓN" title="UNA DE ASERRÍN POR TRES" />
    {/* proporción 1:3 en bloques */}
    {[0, 1, 2, 3].map((i) => { const s = phys(tt, 0.6 + i * 0.3, 7, 0.45); return <div key={i} style={{ position: "absolute", left: 300 + i * 190, top: 330 + (1 - cl(s)) * -150, width: 170, height: 170, opacity: cl(s * 2), borderRadius: 18, background: i === 0 ? "#d9b27a" : "radial-gradient(circle at 40% 35%,#4a4846,#151515)", boxShadow: "0 20px 40px rgba(0,0,0,.5), 0 0 0 3px rgba(255,255,255,.18)" }}>
      {i === 0 && <Grains n={40} x={10} y={10} w={150} h={150} col="#a8803e" s={6} />}
    </div>; })}
    <Tag tt={tt} at={1.8} x={395} y={550} txt="1" col={AMB} size={50} /><Tag tt={tt} at={2.0} x={870} y={550} txt="3 DE CARBÓN" col={TX} size={40} />
    <Tag tt={tt} at={2.4} x={1420} y={415} txt="PRENDE MÁS FÁCIL" col={GRN} size={40} />
    {/* lo demás que entra molido */}
    {L.map((l, i) => { const p = phys(tt, 3.4 + i * 0.45, 7, 0.45); return <div key={i} style={{ position: "absolute", left: 220 + i * 310, top: 660, transform: `translateY(${(1 - cl(p)) * 100}px)`, opacity: cl(p * 2), width: 280, textAlign: "center" }}>
      <div style={{ margin: "0 auto", width: 170, height: 120, borderRadius: "50% 50% 14% 14% / 90% 90% 14% 14%", background: `radial-gradient(ellipse at 45% 30%, ${l.c}, #1a1410)` }} />
      <div style={{ marginTop: 18, fontWeight: 900, fontSize: 30 }}>{l.n}</div>
    </div>; })}
    <Tag tt={tt} at={5.8} x={960} y={1000} txt="TODO MOLIDO ENTRA EN LA MEZCLA" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 25:15 · EL PAPEL: diario y cartón marrón sí (pulpa = pegamento); revista brillante y folletos no (humo tóxico) ----
export const HPaper: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = phys(tt, 0.6, 6, 0.5), b = phys(tt, 1.6, 6, 0.5), fume = cl(tt - 3.2);
  return <>
    <Head tt={tt} kick="CON EL PAPEL, CUIDADO" title="MARRÓN O DIARIO, SÍ" />
    {/* diario + cartón */}
    <div style={{ position: "absolute", left: 300, top: 380, transform: `translateY(${(1 - cl(a)) * 100}px) rotate(-4deg)`, opacity: cl(a * 2) }}>
      <div style={{ width: 460, height: 320, background: "#e9e4d8", borderRadius: 6, padding: 24, boxSizing: "border-box", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
        <div style={{ height: 40, background: "#3a3a3a", width: "70%" }} />
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ height: 8, marginTop: 14, background: "#9a9590", width: `${60 + (i * 13) % 35}%` }} />)}
      </div>
      <div style={{ position: "absolute", left: 220, top: 200, width: 320, height: 200, background: "linear-gradient(135deg,#b88a56,#8a6438)", borderRadius: 6, transform: "rotate(10deg)" }} />
    </div>
    <Check x={560} y={330} s={120} p={cl(tt - 2.2)} />
    <Tag tt={tt} at={2.4} x={560} y={880} txt="SE REMOJA, SE HACE PULPA" col={GRN} size={34} />
    {/* revista brillante */}
    <div style={{ position: "absolute", left: 1150, top: 400, transform: `translateY(${(1 - cl(b)) * 100}px) rotate(5deg)`, opacity: cl(b * 2), width: 440, height: 320, borderRadius: 6, background: "linear-gradient(135deg,#ff4fa0,#ffd23a 40%,#3ac7ff 70%,#8a4aff)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,.6) 45%, transparent 60%)", transform: `translateX(${((tt * 300) % 900) - 450}px)` }} />
    </div>
    {Array.from({ length: 12 }, (_, i) => { const ph = (tt * 0.5 + i / 12) % 1; return <div key={i} style={{ position: "absolute", left: 1370 + Math.sin(i * 1.9 + ph * 3) * 120 - 50, top: 380 - ph * 260 - 50, width: 100 + ph * 80, height: 100 + ph * 80, borderRadius: "50%", background: "rgba(140,200,80,.45)", filter: "blur(16px)", opacity: fume * Math.sin(ph * Math.PI) }} />; })}
    <Cross x={1370} y={560} s={200} p={cl(tt - 3.6)} />
    <Tag tt={tt} at={3.8} x={1370} y={880} txt="BRILLANTE: HUMO TÓXICO" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 25:54 · LO QUE NO COMPRO: una bolsa por semana; las 12 bolsas del invierno que se tachan ----
export const HSavings: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  <Head tt={tt} kick="UNA BOLSA POR SEMANA" title="LO QUE NO COMPRO EN EL INVIERNO" />
  {Array.from({ length: 12 }, (_, i) => { const s = phys(tt, 0.6 + i * 0.25, 7, 0.45), xs = cl((tt - 3.6 - i * 0.12) * 3), c = i % 6, r = Math.floor(i / 6);
    return <div key={i} style={{ position: "absolute", left: 250 + c * 200, top: 330 + r * 290, width: 170, height: 230, transform: `translateY(${(1 - cl(s)) * -160}px) rotate(${((i * 5) % 7) - 3}deg)`, opacity: cl(s * 2) * (1 - 0.45 * xs), borderRadius: "8px 8px 16px 16px", background: "linear-gradient(90deg,#7a5634,#c69a66 40%,#a07a4e 70%,#5e4127)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 26, background: "repeating-linear-gradient(90deg,#8d6840 0 10px,#6e4f30 10px 20px)" }} />
      <div style={{ position: "absolute", left: 18, right: 18, top: 90, fontWeight: 900, fontSize: 26, textAlign: "center", color: "rgba(40,25,10,.75)", border: "3px solid rgba(40,25,10,.5)", borderRadius: 6, padding: "6px 0" }}>CARBÓN</div>
      <Cross x={85} y={115} s={150} p={xs} />
    </div>; })}
  <Tag tt={tt} at={4.4} x={1680} y={480} txt="10 · 12" col={AMB} size={90} />
  <Tag tt={tt} at={4.8} x={1680} y={570} txt="bolsas que no compro" col={DIM} size={30} />
  <Tag tt={tt} at={5.6} x={1680} y={760} txt="CON UN BALDE," col={TX} size={32} />
  <Tag tt={tt} at={5.8} x={1680} y={810} txt="UN CAÑO Y BARRO" col={TX} size={32} />
</>}</Stage>;

// ---- 27:10 · USTEDES ME ESCRIBEN: el teléfono con los comentarios apilados (uno nuevo por aparición) ----
export const HComments: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode={(["iris", "wipe", "split", "drop"] as const)[(h.idx as number) % 4]}>{(tt) => {
  const all = (h.stack as { n: string; from: string; txt: string }[] | undefined) ?? [], idx = (h.idx as number) ?? 0, s = phys(tt, 0.6, 5.5, 0.5), heart = phys(tt, 2.4, 7, 0.32);
  const vis = all.slice(0, idx + 1).reverse();
  return <>
    <Head tt={tt} kick="USTEDES ME ESCRIBEN" title="LEO TODO" />
    <div style={{ position: "absolute", left: 960, top: 560, width: 660, height: 980, marginLeft: -330, marginTop: -480, borderRadius: 60, background: "#0b0b0d", boxShadow: "0 0 0 10px #222226, 0 60px 140px rgba(0,0,0,.8)", overflow: "hidden", transform: `rotateY(${-8 + 4 * Math.sin(tt * 0.4)}deg)` }}>
      <div style={{ position: "absolute", left: 260, top: 18, width: 140, height: 34, borderRadius: 17, background: "#000" }} />
      <div style={{ position: "absolute", left: 30, right: 30, top: 80, fontWeight: 900, fontSize: 30, color: DIM }}>{23 + idx * 31} comentarios</div>
      {vis.map((c, j) => { const isNew = j === 0;
        return <div key={c.n} style={{ position: "absolute", left: 24, right: 24, top: isNew ? 140 + (1 - s) * -260 : 140 + 270 * j * cl(s) + 270 * (j - 1) * (1 - cl(s)), opacity: isNew ? cl(s * 3) : 1 - j * 0.22, borderRadius: 26, background: isNew ? "#1d1d22" : "#141418", padding: "22px 24px", boxShadow: isNew ? `0 0 0 2px ${AMB}88` : undefined }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: ["#e57a44", "#5aa0e6", "#8fcf6a", "#c77ad8", "#e6c25a"][all.indexOf(c) % 5], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 26 }}>{c.n[0]}</div>
            <div><div style={{ fontWeight: 900, fontSize: 32 }}>{c.n}</div><div style={{ fontSize: 22, color: DIM }}>{c.from}</div></div>
          </div>
          <div style={{ marginTop: 12, fontSize: 32, lineHeight: 1.25, color: TX }}>{c.txt}</div>
          {isNew && <div style={{ position: "absolute", right: 24, bottom: 16, fontSize: 40, transform: `scale(${cl(heart) + (heart > 1 ? (heart - 1) * 0.6 : 0)})`, color: RED }}>❤</div>}
        </div>; })}
    </div>
  </>;
}}</Stage>;

// ---- 28:33 · EN EL ASADO: parrilla vista de arriba; se prenden al costado y, rojas parejas, pasan abajo de la carne ----
export const HGrill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse at 50% 50%, #2a1e16, #080605 80%)">{(tt) => {
  const red = cl((tt - 0.8) / 2.4), mv = eio(tt, 3.6, 5.4);
  return <>
    <Head tt={tt} kick="SIRVEN, Y MUCHO" title="PRENDELAS AL COSTADO" />
    <div style={{ position: "absolute", left: 360, top: 320, width: 1200, height: 620, borderRadius: 20, background: "#1a1614", boxShadow: "inset 0 0 0 14px #3a3330" }}>
      {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 52, top: 30, width: 8, height: 560, background: "linear-gradient(90deg,#6a6a6e,#c9c9cf,#6a6a6e)", zIndex: 2 }} />)}
      {/* carne */}
      {[[160, 120], [430, 300], [200, 360]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 230, height: 150, borderRadius: "45% 55% 50% 40%", background: "radial-gradient(ellipse at 40% 40%, #c4523a, #7a2418)", boxShadow: "inset 0 0 0 10px #f0d6b8", zIndex: 3 }} />)}
    </div>
    {Array.from({ length: 12 }, (_, i) => { const sx = 1260 + (i % 3) * 80, sy = 400 + Math.floor(i / 3) * 110, tx = 520 + (i % 4) * 110, ty = 470 + Math.floor(i / 4) * 130, k = cl(mv * 1.4 - (i % 4) * 0.12);
      return <div key={i} style={{ position: "absolute", left: sx + (tx - sx) * k - 40, top: sy + (ty - sy) * k - 40 - Math.sin(k * Math.PI) * 60, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle at 45% 40%, rgba(255,${Math.round(150 - 60 * red)},60,${0.3 + 0.7 * red}), #1c1a18 75%)`, boxShadow: red > 0.5 ? `0 0 30px rgba(255,90,30,${0.6 * red})` : undefined }} />; })}
    <svg width={300} height={80} style={{ position: "absolute", left: 960, top: 970, opacity: cl(tt - 3.4) }}><path d="M290 40 L20 40 M60 10 L20 40 L60 70" stroke={AMB} strokeWidth={8} fill="none" /></svg>
    <Tag tt={tt} at={2.2} x={1700} y={300} txt="ROJAS PAREJAS" col={AMB} size={36} />
    <Tag tt={tt} at={5.2} x={720} y={1010} txt="ASÍ NO TE AHÚMAN" col={GRN} size={40} />
  </>;
}}</Stage>;

// ---- 28:53 · LA CENIZA ROJIZA: alcalina, no va pura a las plantas; un puñado por balde de compost ----
export const HAshC: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const pour = eio(tt, 2.4, 3.8), x = cl(tt - 1.2);
  return <>
    <Head tt={tt} kick="LA CENIZA DE LAS BRIQUETAS" title="UN PUÑADO POR BALDE" col={GRN} />
    {/* planta: X si va pura */}
    <svg width={300} height={360} style={{ position: "absolute", left: 260, top: 420 }}>
      <path d="M150 340 L150 140" stroke="#3a7a3a" strokeWidth={10} />{[[-1, 200], [1, 170], [-1, 140], [1, 110]].map(([s, y], i) => <path key={i} d={`M150 ${y} q ${s * 80} -40 ${s * 110} 10 q ${-s * 60} 20 ${-s * 110} -10`} fill="#5aa04a" />)}
      <path d="M60 340 L240 340 L220 300 L80 300 Z" fill="#a0603a" />
    </svg>
    <Grains n={40} x={320} y={540} w={180} h={120} col="#c98a6a" s={9} seed={2} />
    <Cross x={410} y={560} s={240} p={x} />
    <Tag tt={tt} at={1.4} x={410} y={860} txt="PURA A LAS PLANTAS, NO" col={RED} size={34} />
    {/* compost */}
    <div style={{ position: "absolute", left: 1080, top: 560, width: 420, height: 360, clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", background: "linear-gradient(90deg,#3a5a3a,#5a8a5a 40%,#3a5a3a)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, bottom: 0, background: "linear-gradient(180deg,#4a3420,#2a1c10)" }} />
      <div style={{ position: "absolute", left: 140, top: 30, width: 140, height: 50 * pour, borderRadius: "50%", background: "#c98a6a" }} />
    </div>
    {/* mano con el puñado que cae */}
    {Array.from({ length: 20 }, (_, i) => { const ph = cl(pour * 1.3 - i / 30); return pour > 0 && pour < 1 ? <div key={i} style={{ position: "absolute", left: 1270 + Math.sin(i) * 30, top: 400 + ph * 200, width: 10, height: 10, borderRadius: "40%", background: "#c98a6a", opacity: ph > 0 && ph < 1 ? 1 : 0 }} /> : null; })}
    <div style={{ position: "absolute", left: 1200, top: 330, width: 170, height: 110, borderRadius: "40% 40% 50% 50%", background: "radial-gradient(ellipse at 50% 40%,#e7b48c,#b77d55)", transform: `rotate(${pour * 40}deg)`, opacity: cl(tt - 1.8) }} />
    <Tag tt={tt} at={4.0} x={1290} y={980} txt="MEZCLADA DE A POCO" col={GRN} size={36} />
  </>;
}}</Stage>;
