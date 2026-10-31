// te29e · POTOSÍ · componentes únicos (uno por minuto). Cada pieza = la FOTO REAL del momento como objeto físico (PhotoObj, con sombra y luz)
// + UN mecanismo que hace la idea (fuego que se apaga, balanza, rueda de turnos, gotas que se juntan, pulmón que se vuelve piedra…).
// Elementos de a uno con resorte, un solo renglón de texto lejos de los bordes, nada arriba a la izquierda. Registro: D:/rtmp/te29_COMPONENTES.md
import React from "react";
import { AMB, GRN, H, ICE, PhotoObj, RED, Stage, TX, cl, eio, phys } from "./hkit";
import { Coin, Floor, GOLD, K, LIN, Num, W, at, lerp } from "./tkit";

const SILV = "linear-gradient(180deg,#ffffff,#c9d1d8 45%,#6d7680)";
const stepsOf = (h: H, t: number, fb: [number, string][]) => {
  const said: [number, string][] = (h.steps ?? []).filter((s: [number, string]) => s[0] < h.out - 0.5);
  const st = said.length >= fb.length ? said : fb;
  return { st, cur: st.reduce((a, s, i) => (t >= s[0] ? i : a), -1) };
};
// humo: volutas que suben y se abren
const Smoke: React.FC<{ tt: number; x: number; y: number; n?: number; col?: string }> = ({ tt, x, y, n = 5, col = "rgba(220,220,220,.35)" }) => <>{Array.from({ length: n }, (_, i) => {
  const p = (tt * 0.35 + i / n) % 1;
  return <div key={i} style={{ ...at(x - 40 + 30 * Math.sin(p * 6 + i), y - p * 260), width: 80 + p * 90, height: 80 + p * 90, borderRadius: "50%", background: `radial-gradient(circle, ${col}, transparent 70%)`, opacity: Math.sin(Math.PI * p), filter: "blur(4px)" }} />;
})}</>;
// brasa que respira
const Ember: React.FC<{ tt: number; x: number; y: number; s?: number; d?: number }> = ({ tt, x, y, s = 1, d = 0 }) => { const on = phys(tt, d, 6, 0.5), f = 0.7 + 0.3 * Math.sin(tt * 5 + x);
  return on > 0.02 ? <div style={{ ...at(x - 22 * s, y - 22 * s), width: 44 * s, height: 44 * s, borderRadius: "50%", background: "radial-gradient(circle, #fff6c0, #ff8a2a 40%, rgba(255,60,10,0) 72%)", opacity: cl(on) * f, transform: `scale(${0.6 + 0.6 * f})`, mixBlendMode: "screen" }} /> : null; };

// 0:32 · EL TÍO: la foto del Tío en su nicho; se prenden de a uno los tres cigarrillos (brasas que respiran) y el humo sube por delante
const XTio: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  <Floor x={960} y={960} w={1100} />
  <PhotoObj tt={tt} id="n_tio_cigarrillos" x={460} y={150} w={1000} h={760} rot={-1.5} />
  <Ember tt={tt} x={900} y={560} d={0.8} /><Ember tt={tt} x={960} y={575} d={1.5} /><Ember tt={tt} x={1020} y={560} d={2.2} />
  <Smoke tt={tt} x={960} y={520} n={6} />
  <Num tt={tt} d={0.3} x={960} y={985} txt="EL TÍO" size={96} col={AMB} />
</>}</Stage>;

// 1:04 · EL HILO DE PLATA: del cerro sale un hilo de plata que se tiende en arco hasta Europa y después hasta China; una moneda viaja por el hilo
const XWorldSpan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const a = eio(tt, 0.6, 2.6), b = eio(tt, 2.4, 4.4), cp = cl((tt - 0.6) / 4.2);
  const P = (u: number, x0: number, y0: number, x1: number, y1: number, hy: number) => { const x = lerp(x0, x1, u), y = lerp(y0, y1, u) - Math.sin(Math.PI * u) * hy; return [x, y]; };
  const [cx, cy] = cp < 0.5 ? P(cp * 2, 330, 640, 960, 420, 200) : P(cp * 2 - 1, 960, 420, 1590, 640, 200);
  return <>
    <PhotoObj tt={tt} id="n_cerro_cono" x={110} y={560} w={440} h={330} rot={-3} />
    <PhotoObj tt={tt} id="n_amberes_plaza" x={760} y={150} w={400} h={290} at={1.8} rot={2} />
    <PhotoObj tt={tt} id="n_porcelana_china" x={1380} y={560} w={420} h={320} at={3.6} rot={3} />
    <svg width={1920} height={1080} style={at(0, 0)}>
      <path d="M330 640 Q 645 240 960 420" fill="none" stroke="#e9eef2" strokeWidth={7} strokeDasharray={900} strokeDashoffset={900 * (1 - a)} style={{ filter: "drop-shadow(0 0 10px #fff)" }} />
      <path d="M960 420 Q 1275 240 1590 640" fill="none" stroke="#e9eef2" strokeWidth={7} strokeDasharray={900} strokeDashoffset={900 * (1 - b)} style={{ filter: "drop-shadow(0 0 10px #fff)" }} />
    </svg>
    {cp > 0 && cp < 1 && <div style={{ ...at(cx - 40, cy - 40), transform: `rotateY(${tt * 300}deg)` }}><Coin r={40} silver /></div>}
    <Num tt={tt} d={1.4} x={960} y={110} txt="EUROPA" size={70} col={TX} />
    <Num tt={tt} d={3.6} x={1590} y={950} txt="CHINA" size={70} col={AMB} />
  </>;
}}</Stage>;

// 2:58 · LA FOGATA: la foto de la fogata de noche; el fuego baja hasta apagarse y debajo de las cenizas se encienden, de a uno, hilos de plata derretida
const XFogata: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = K(tt, h, 0.4), fire = 1 - eio(tt, 0.8, W(h) * 0.55);
  return <>
    <PhotoObj tt={tt} id="n_fogata_noche" x={360} y={130} w={1200} h={760} rot={-1} />
    <div style={{ ...at(360, 130), width: 1200, height: 760, background: `rgba(10,8,12,${0.55 * (1 - fire)})` }} />
    {Array.from({ length: 10 }, (_, i) => { const hh = (90 + (i * 47) % 140) * fire * (0.8 + 0.2 * Math.sin(tt * 8 + i)); return <div key={i} style={{ ...at(780 + i * 36, 700 - hh), width: 60, height: hh, borderRadius: "50% 50% 30% 30% / 70% 70% 30% 30%", background: "radial-gradient(ellipse at 50% 85%, #fff4a8, #ffa03a 40%, rgba(220,60,20,0) 75%)", mixBlendMode: "screen" }} />; })}
    <svg width={1920} height={1080} style={at(0, 0)}>{[0, 1, 2, 3, 4].map((i) => { const s = eio(tt, W(h) * 0.5 + i * 0.35, W(h) * 0.5 + i * 0.35 + 0.8);
      return <path key={i} d={`M${760 + i * 90} 720 q 40 -${30 + i * 8} 80 0 t 80 -10`} fill="none" stroke="#f4f8fb" strokeWidth={6} strokeLinecap="round" strokeDasharray={220} strokeDashoffset={220 * (1 - s)} style={{ filter: "drop-shadow(0 0 12px #fff)" }} />; })}</svg>
    <Num tt={tt} d={W(h) * 0.62} x={960} y={985} txt="PLATA" size={110} col={k > 0.6 ? "#eef3f6" : AMB} />
  </>;
}}</Stage>;

// 3:50 · LA BALANZA DE CIUDADES: en un platillo la Potosí de 1610, en el otro Sevilla; la balanza oscila y queda pareja
const XTwinCities: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = phys(tt, 0.9, 3.2, 0.25), ang = 14 * (1 - s);
  return <>
    <Floor x={960} y={960} w={900} />
    <div style={{ ...at(940, 380), width: 40, height: 560, background: "linear-gradient(90deg,#6a4a1c,#c9a35a,#6a4a1c)" }} />
    <div style={{ ...at(360, 360), width: 1200, height: 24, transformOrigin: "50% 50%", transform: `rotate(${ang}deg)`, background: "linear-gradient(180deg,#e9c97a,#8a6414)", borderRadius: 12 }}>
      {[0, 1].map((i) => <div key={i} style={{ ...at(i ? 1000 : 0, 12), width: 200, height: 2, transformOrigin: "100px 0", transform: `rotate(${-ang}deg)` }}>
        <div style={{ ...at(-160, 0), width: 520, height: 400 }}>
          <PhotoObj tt={tt} id={i ? "n_sevilla_rio" : "n_ciudad_1600"} x={0} y={30} w={520} h={340} at={0.2 + i * 0.4} rot={i ? 2 : -2} tilt={0} />
        </div></div>)}
    </div>
    <Num tt={tt} d={0.4} x={560} y={180} txt="POTOSÍ 1610" size={70} col={AMB} />
    <Num tt={tt} d={0.8} x={1360} y={180} txt="SEVILLA" size={70} col={TX} />
    <Num tt={tt} d={W(h) * 0.5} x={960} y={1000} txt="160.000 HABITANTES" size={78} col={GRN} />
  </>;
}}</Stage>;

// 4:17 · A LOMO DE MULA: la caravana real en la foto de fondo y, por delante, una fila de mulas con fardos de seda que cruza la pantalla con paso pesado
const XMule: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = LIN(tt, h, 0.2);
  return <>
    <PhotoObj tt={tt} id="n_mulas_caravana" x={260} y={110} w={1400} h={560} rot={-1} tilt={4} />
    <div style={{ ...at(0, 860), width: 1920, height: 220, background: "linear-gradient(180deg,#5a3e26,#22170e)" }} />
    {Array.from({ length: 5 }, (_, i) => { const x = lerp(-420, 1920, k) - i * 300, bob = Math.abs(Math.sin(tt * 4 + i)) * 10;
      return <div key={i} style={{ ...at(x, 700 - bob) }}><svg width={260} height={180} viewBox="0 0 260 180">
        <ellipse cx={120} cy={170} rx={110} ry={10} fill="rgba(0,0,0,.4)" />
        <path d="M40 70 Q 40 40 90 42 L 180 42 Q 220 44 222 30 L 240 14 L 252 30 L 238 46 Q 236 80 210 84 L 206 160 L 192 160 L 188 96 L 80 96 L 74 160 L 60 160 L 56 96 Q 40 92 40 70Z" fill="#3a2a1c" />
        <rect x={84} y={12} width={52} height={40} rx={6} fill={i % 2 ? "#b8323a" : "#d8b878"} /><rect x={138} y={14} width={46} height={38} rx={6} fill={i % 2 ? "#e0c070" : "#4a6aa8"} />
      </svg></div>; })}
    <Num tt={tt} d={0.4} x={960} y={790} txt="SEMANAS A LOMO DE MULA" size={74} col={AMB} />
  </>;
}}</Stage>;

// 4:42 · LA HERRADURA: sobre la foto de la mansión de un minero rico cae una herradura de plata que gira, rebota y queda brillando; un sello «LEYENDA» se estampa
const XHorseshoe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const f = phys(tt, 0.6, 5, 0.35), st = phys(tt, W(h) * 0.55, 8, 0.4);
  return <>
    <PhotoObj tt={tt} id="n_mansion_minero" x={240} y={170} w={760} h={560} rot={-3} />
    <Floor x={1380} y={880} w={600} />
    <div style={{ ...at(1180, 360 + (1 - Math.min(1, f)) * -420), transform: `rotateY(${(1 - cl(f)) * 720 + 18 * Math.sin(tt)}deg) rotate(${(1 - cl(f)) * 40}deg)` }}>
      <svg width={400} height={460} viewBox="0 0 100 115"><path d="M14 112 L 8 50 Q 8 6 50 6 Q 92 6 92 50 L 86 112 L 70 112 L 74 52 Q 74 24 50 24 Q 26 24 26 52 L 30 112Z" fill="url(#hs)" stroke="#5a636c" strokeWidth={1.5} />
        {[20, 40, 60, 80].map((y, i) => <circle key={i} cx={i < 2 ? 18 : 82} cy={y + 10} r={3} fill="#3a4048" />)}
        <defs><linearGradient id="hs" x1="0" x2="1"><stop offset="0" stopColor="#ffffff" /><stop offset=".5" stopColor="#c9d1d8" /><stop offset="1" stopColor="#7a848e" /></linearGradient></defs></svg>
    </div>
    {st > 0.02 && <div style={{ ...at(1060, 140), transform: `rotate(-8deg) scale(${2 - Math.min(1, st)})`, opacity: cl(st * 2), border: `8px solid ${RED}`, borderRadius: 14, padding: "10px 30px", fontWeight: 900, fontSize: 74, color: RED }}>LEYENDA</div>}
  </>;
}}</Stage>;

// 5:07 · LA RUEDA DE TURNOS: una rueda de madera con los pueblos marcados gira paso a paso; cada clic manda a un hombre hacia el cerro de la foto
const XMita: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const step = Math.floor(Math.max(0, tt - 0.6) / 1.1), sub = eio((tt - 0.6) % 1.1, 0, 0.35), ang = -(step + sub) * 45;
  return <>
    <PhotoObj tt={tt} id="n_cerro_cono" x={1100} y={200} w={640} h={480} rot={2} />
    <Floor x={600} y={950} w={760} />
    <div style={{ ...at(260, 240), width: 680, height: 680, borderRadius: "50%", transform: `rotate(${ang}deg)`, background: "radial-gradient(circle,#8a6a3a 0 18%,#5a4020 19% 22%,#a8844a 23% 92%,#4a3418 93%)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ ...at(325, 30), width: 30, height: 310, transformOrigin: "15px 310px", transform: `rotate(${i * 45}deg)`, background: "linear-gradient(90deg,#4a3418,#7a5a2a,#4a3418)" }}>
        <div style={{ ...at(-10, -10), width: 50, height: 50, borderRadius: "50%", background: i === 0 ? RED : "#d8c8a0" }} /></div>)}
    </div>
    {Array.from({ length: Math.min(step, 5) }, (_, i) => { const p = cl((tt - 0.6 - (i + 1) * 1.1) / 2.2); return <div key={i} style={{ ...at(lerp(820, 1260, p), 760 - 120 * p), opacity: 1 - p * 0.7 }}><svg width={40} height={96} viewBox="0 0 46 110"><circle cx={23} cy={16} r={14} fill="#1d1a16" /><path d="M4 110 Q4 40 23 34 Q42 40 42 110Z" fill="#1d1a16" /></svg></div>; })}
    <Num tt={tt} d={0.3} x={600} y={150} txt="MITA = TURNO" size={84} col={AMB} />
  </>;
}}</Stage>;

// 5:38 · LA CAMINATA: del lago Titicaca a Potosí una línea de pisadas se dibuja de a una sobre el altiplano; un contador de días corre
const XLongWalk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = LIN(tt, h, 0.8), n = 22, days = Math.round(lerp(0, 30, k));
  return <>
    <PhotoObj tt={tt} id="n_titicaca" x={120} y={160} w={480} h={340} rot={-3} />
    <PhotoObj tt={tt} id="n_cerro_cono" x={1320} y={560} w={480} h={340} at={0.5} rot={3} />
    {Array.from({ length: n }, (_, i) => { const u = i / (n - 1), on = k >= u; const x = lerp(560, 1360, u) + 60 * Math.sin(u * 7), y = lerp(480, 620, u) + 90 * Math.sin(u * 3.1);
      return on ? <div key={i} style={{ ...at(x, y + (i % 2 ? 18 : -18)), width: 22, height: 36, borderRadius: "50% 50% 45% 45%", background: "#e8dcc0", transform: `rotate(${70 + 20 * Math.cos(u * 7)}deg)`, boxShadow: "0 3px 0 rgba(0,0,0,.4)" }} /> : null; })}
    <Num tt={tt} d={0.3} x={960} y={160} txt={`${days} DÍAS A PIE`} size={92} col={AMB} />
  </>;
}}</Stage>;

// 6:09 · EL NÚMERO QUE NO SE SOSTIENE: «8.000.000» de piedra aparece entero y se resquebraja; los dígitos caen como escombros y queda un signo de pregunta
const XEightMillion: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const br = cl((tt - 2.2) / 2.2), q = phys(tt, 4.0, 6, 0.45);
  return <>
    <PhotoObj tt={tt} id="n_numero_tachado_e" x={1320} y={620} w={420} h={300} rot={4} />
    <Floor x={900} y={900} w={1400} />
    {"8.000.000".split("").map((c, i) => { const fall = br * (0.6 + (i * 37 % 10) / 20), rot = br * ((i % 2 ? 1 : -1) * (30 + i * 9));
      return <div key={i} style={{ ...at(220 + i * 150, 380 + fall * fall * 700), transform: `rotate(${rot}deg)`, opacity: 1 - cl(br * 1.4 - 0.4), fontWeight: 900, fontSize: 260, color: "#bfb6a6", textShadow: "0 10px 0 #6a6256, 0 30px 40px rgba(0,0,0,.6)" }}>{c}</div>; })}
    {q > 0.02 && <div style={{ ...at(800, 300), transform: `scale(${0.6 + 0.4 * Math.min(1.1, q)})`, opacity: cl(q * 2), fontWeight: 900, fontSize: 420, color: AMB, textShadow: "0 20px 50px rgba(0,0,0,.7)" }}>?</div>}
    <Num tt={tt} d={4.2} x={960} y={150} txt="NADIE LO SABE" size={90} col={TX} />
  </>;
}}</Stage>;

// 6:44 · LAS GOTAS: gotas de mercurio ruedan hacia el centro y se tragan los granos de plata; de la gota grande sube un vapor verde que tapa la foto
const XMercury: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const m = eio(tt, 0.6, 3.0), vap = eio(tt, 3.2, W(h) - 0.5);
  return <>
    <PhotoObj tt={tt} id="n_mercurio_gotas" x={1220} y={180} w={540} h={400} rot={3} />
    <Floor x={760} y={830} w={1000} />
    <div style={{ ...at(260, 760), width: 1000, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,#4a4038,#1a1612)" }} />
    {Array.from({ length: 9 }, (_, i) => { const a = i * 0.7, r0 = 380, x = 760 + Math.cos(a) * r0 * (1 - m) * 1.2, y = 760 + Math.sin(a) * 50 * (1 - m), s = 46 + (i % 3) * 10;
      return <div key={i} style={{ ...at(x - s / 2, y - s / 2 - 10), width: s, height: s * 0.8, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ffffff,#b8c2ca 40%,#4a525a)", opacity: 1 - m * 0.9 }} />; })}
    <div style={{ ...at(760 - 120 * m, 720 - 50 * m), width: 240 * m, height: 120 * m, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ffffff,#b8c2ca 40%,#4a525a)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    <Smoke tt={tt} x={760} y={680} n={7} col={`rgba(160,210,140,${0.45 * vap})`} />
    <Num tt={tt} d={3.4} x={760} y={220} txt="VAPOR VENENOSO" size={86} col={RED} />
  </>;
}}</Stage>;

// 8:33 · LA CIUDAD SE VACÍA: la foto de los tejados de Potosí con una grilla de ventanas encendidas que se apagan de a una hasta quedar pocas
const XEmptying: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const k = LIN(tt, h, 0.6);
  return <>
    <PhotoObj tt={tt} id="n_tejados_potosi" x={260} y={130} w={1400} h={760} rot={-1} tilt={4} />
    <div style={{ ...at(272, 142), width: 1376, height: 736, background: `rgba(8,10,20,${0.25 + 0.45 * k})` }} />
    {Array.from({ length: 48 }, (_, i) => { const off = ((i * 97) % 48) / 48 < k * 0.92; const x = 340 + (i % 12) * 105, y = 420 + Math.floor(i / 12) * 105;
      return <div key={i} style={{ ...at(x, y), width: 40, height: 52, borderRadius: 4, background: off ? "#1a1c24" : "radial-gradient(circle,#fff2b0,#e9a33a)", boxShadow: off ? "none" : "0 0 24px rgba(255,190,90,.8)" }} />; })}
    <Num tt={tt} d={0.4} x={960} y={985} txt="SE VACÍA" size={100} col={AMB} />
  </>;
}}</Stage>;

// 9:08 · EL ESTAÑO: un lingote de estaño cae sobre la mesa, un cuño le estampa «Sn»; y las monedas que salen de él vuelan fuera del cuadro
const XTin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const d = phys(tt, 0.3, 5.5, 0.4), st = eio(tt, 1.6, 1.9) - eio(tt, 2.1, 2.5), fly = cl((tt - 3.0) / 3);
  return <>
    <PhotoObj tt={tt} id="n_estano_lingotes" x={160} y={160} w={560} h={400} rot={-3} />
    <Floor x={1100} y={880} w={900} />
    <div style={{ ...at(780, 560 - (1 - Math.min(1, d)) * 500), width: 640, height: 220, borderRadius: 14, transform: "perspective(1400px) rotateX(28deg)", background: "linear-gradient(180deg,#e2e6ea,#9aa2aa 60%,#5a626a)", boxShadow: "0 30px 40px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,255,255,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: tt > 1.9 ? 130 : 0, color: "#4a525a" }}>Sn</div>
    <div style={{ ...at(1000, 120 + 330 * st), width: 200, height: 300, borderRadius: 10, background: "linear-gradient(90deg,#5a4020,#a8844a,#5a4020)" }} />
    {Array.from({ length: 7 }, (_, i) => { const p = cl(fly * 1.4 - i * 0.08); return p > 0 ? <div key={i} style={{ ...at(1100 + p * (900 + i * 40), 560 - p * (300 + i * 50) + p * p * 200), transform: `rotateY(${p * 900}deg)` }}><Coin r={34} silver /></div> : null; })}
    <Num tt={tt} d={3.0} x={1100} y={980} txt="LA RIQUEZA SE VA LEJOS" size={70} col={AMB} />
  </>;
}}</Stage>;

// 10:16 · LA PARED DE ROCA (6 pasos): un corte de la roca con la veta; a cada «paso» pasa algo en la pared: brilla la veta, aparecen los agujeros,
// entran los cartuchos, destello y polvo, la carretilla se lleva la piedra, y una balanza la pesa
const XBlastSeq: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const fb: [number, string][] = [[h.at + 0.3, "LA VETA"], [h.at + 3, "LOS AGUJEROS"], [h.at + 6, "LA DINAMITA"], [h.at + 9, "LA CARGA"], [h.at + 12, "EL INGENIO"], [h.at + 15, "LA VENTA"]];
  const { st, cur } = stepsOf(h, t, fb), since = cur >= 0 ? t - st[cur][0] : 0, flash = cur === 2 ? Math.exp(-Math.max(0, since - 1.2) * 3) * (since > 1.2 ? 1 : 0) : 0;
  return <>
    <div style={{ ...at(200, 200), width: 1520, height: 640, borderRadius: 20, background: "repeating-linear-gradient(170deg,#5a4a3e 0 40px,#4a3c32 40px 90px,#6a584a 90px 120px)", boxShadow: "inset 0 0 80px rgba(0,0,0,.8), 0 30px 60px rgba(0,0,0,.6)" }} />
    <svg width={1920} height={1080} style={at(0, 0)}><path d="M200 560 Q 700 420 1100 520 T 1720 460" fill="none" stroke={cur >= 0 ? "#eef3f6" : "#8a8a8a"} strokeWidth={cur >= 0 ? 22 : 12} style={{ filter: cur >= 0 ? "drop-shadow(0 0 16px #fff)" : "none" }} /></svg>
    {cur >= 1 && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{ ...at(700 + i * 110, 470 + (i % 2) * 40), width: 36, height: 36, borderRadius: "50%", background: "radial-gradient(circle,#000,#2a2420)", boxShadow: "0 0 0 6px #6a584a" }}>
      {cur >= 2 && <div style={{ ...at(4, -70), width: 28, height: 80, borderRadius: 6, background: "linear-gradient(90deg,#b8323a,#e85a5a,#b8323a)" }} />}</div>)}
    {flash > 0.02 && <div style={{ ...at(0, 0), width: 1920, height: 1080, background: `radial-gradient(circle at 920px 500px, rgba(255,240,200,${flash}), rgba(255,160,60,${flash * 0.4}) 30%, transparent 60%)` }} />}
    {cur >= 3 && <div style={{ ...at(lerp(700, 1500, cl(since / 2.5)) , 760), width: 220, height: 120, borderRadius: "6px 6px 20px 20px", background: "linear-gradient(180deg,#7a7f86,#3a3f46)", boxShadow: "0 16px 0 #222" }}>{[0, 1, 2].map((i) => <div key={i} style={{ ...at(20 + i * 60, -40), width: 70, height: 60, borderRadius: "40%", background: "#6a584a" }} />)}</div>}
    {cur >= 4 && <PhotoObj tt={t - st[4][0]} id="n_ingenio_piedras" x={1300} y={130} w={460} h={330} at={0} rot={3} />}
    {cur >= 5 && <PhotoObj tt={t - st[5][0]} id="n_balanza_mineral" x={160} y={130} w={460} h={330} at={0} rot={-3} />}
    {cur >= 0 && <Num key={cur} tt={since} d={0.05} x={960} y={950} txt={`PASO ${cur + 1} · ${st[cur][1]}`} size={76} col={AMB} />}
  </>;
}}</Stage>;

// 11:11 · EL DÍA DE FREDDY: un reloj de pared cuya aguja corre de las 6 a las 20; en cada hora clave salta la foto de ese momento
const XFreddy: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = LIN(tt, h, 0.4), hr = lerp(6, 20, k), ang = (hr % 12) * 30;
  const P: [number, string, number, number][] = [[6, "n_mate_coca", 1180, 140], [7.5, "n_puesto_dinamita", 1300, 470], [8, "n_boca_negra", 1120, 620]];
  return <>
    <Floor x={600} y={950} w={700} />
    <div style={{ ...at(260, 240), width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle,#f4efe4,#d8cdb4 70%,#8a7a5a 72%,#5a4a2a 76%)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ ...at(312, 30), width: 16, height: 40, transformOrigin: "8px 290px", transform: `rotate(${i * 30}deg)`, background: "#3a3020" }} />)}
      <div style={{ ...at(310, 120), width: 20, height: 200, transformOrigin: "10px 200px", transform: `rotate(${ang}deg)`, background: "#2a2018", borderRadius: 10 }} />
      <div style={{ ...at(295, 295), width: 50, height: 50, borderRadius: "50%", background: RED }} />
    </div>
    {P.map(([hh, id, x, y], i) => hr >= hh ? <PhotoObj key={i} tt={tt - lerp(0.4, W(h) - 0.45, (hh - 6) / 14)} id={id} x={x} y={y} w={460} h={320} at={0} rot={i % 2 ? 3 : -3} /> : null)}
    <Num tt={tt} d={0.3} x={580} y={150} txt={`${String(Math.floor(hr)).padStart(2, "0")}:${String(Math.floor((hr % 1) * 60)).padStart(2, "0")}`} size={96} col={AMB} />
  </>;
}}</Stage>;

// 11:37 · LA TONELADA: la carretilla de la foto empuja por rieles en perspectiva; sobre ella baja una pesa de hierro «1 T» y los rieles se hunden
const XCart: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w8 = phys(tt, 1.0, 5, 0.35), k = LIN(tt, h, 0.3);
  return <>
    <PhotoObj tt={tt} id="n_carretilla_rieles" x={1240} y={140} w={520} h={380} rot={3} />
    <svg width={1920} height={1080} style={at(0, 0)}>{[-1, 1].map((s) => <line key={s} x1={960 + s * 60} y1={560} x2={960 + s * 700} y2={1080} stroke="#9aa2aa" strokeWidth={14} />)}
      {Array.from({ length: 9 }, (_, i) => { const u = ((i / 9 + k * 0.6) % 1), y = 560 + u * u * 520, w = 120 + u * 1300; return <rect key={i} x={960 - w / 2} y={y} width={w} height={8 + u * 20} fill="#4a3420" />; })}</svg>
    <div style={{ ...at(700, 620 + 10 * cl(w8)), width: 520, height: 220, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(180deg,#8a9096,#3a3f46)", boxShadow: "0 20px 0 #1a1a1a" }} />
    <div style={{ ...at(800, 400 - (1 - Math.min(1, w8)) * 500), width: 320, height: 230, borderRadius: "30px 30px 10px 10px", background: "linear-gradient(180deg,#5a5f66,#22262c)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 110, color: "#e9e9e9", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }}>1 T</div>
    <Num tt={tt} d={1.4} x={960} y={150} txt="A MANO" size={96} col={AMB} />
  </>;
}}</Stage>;

// 11:53 · EL PULMÓN DE PIEDRA: dos pulmones rosados que respiran; con cada respiración se vuelven más grises y se cuartean hasta quedar de piedra y quietos
const XLungs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = K(tt, h, 0.3), br = 1 + 0.06 * Math.sin(tt * 3.2) * (1 - k);
  const col = (a: string, b: string) => `color-mix(in srgb, ${a} ${Math.round((1 - k) * 100)}%, ${b})`;
  return <>
    <PhotoObj tt={tt} id="n_radiografia" x={1280} y={200} w={480} h={560} rot={3} />
    <div style={{ ...at(260, 200), transform: `scale(${br})`, transformOrigin: "450px 340px" }}><svg width={900} height={700} viewBox="0 0 300 233">
      <path d="M150 10 L150 70 M150 70 Q 120 80 110 100 M150 70 Q 180 80 190 100" stroke="#c9b8a8" strokeWidth={8} fill="none" />
      <path d="M110 90 Q 40 80 30 160 Q 26 220 90 222 Q 130 222 132 160 L 132 100Z" fill={col("#e88a8a", "#7a7570")} />
      <path d="M190 90 Q 260 80 270 160 Q 274 220 210 222 Q 170 222 168 160 L 168 100Z" fill={col("#e88a8a", "#7a7570")} />
      {k > 0.3 && <g stroke="#3a3632" strokeWidth={1.6} fill="none" opacity={cl((k - 0.3) * 2)}><path d="M60 120 l 20 20 l -6 24 l 18 16" /><path d="M240 110 l -16 26 l 10 20 l -14 30" /><path d="M90 190 l 24 -10" /></g>}
    </svg></div>
    <Num tt={tt} d={0.5} x={700} y={970} txt="SILICOSIS · SIN CURA" size={84} col={k > 0.5 ? RED : AMB} />
  </>;
}}</Stage>;

// 12:46 · MARTES Y VIERNES: una tira de calendario de la semana; se encienden con una vela sólo el martes y el viernes, y la foto de la ofrenda entra detrás
const XTuesday: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  <PhotoObj tt={tt} id="n_tio_ofrenda" x={560} y={90} w={800} h={420} rot={-1} />
  <Floor x={960} y={950} w={1500} />
  {["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"].map((d, i) => { const on = i === 1 || i === 4, s = phys(tt, 0.4 + i * 0.12, 7, 0.5), lit = on ? phys(tt, i === 1 ? 1.6 : 2.4, 6, 0.5) : 0;
    return <div key={i} style={{ ...at(220 + i * 220, 600 + (1 - Math.min(1, s)) * 200), width: 190, height: 260, opacity: cl(s * 2), borderRadius: 12, background: on && lit > 0.1 ? "linear-gradient(180deg,#fff1c8,#e9b949)" : "linear-gradient(180deg,#e9e2d2,#b8ae98)", boxShadow: on && lit > 0.1 ? "0 0 60px rgba(255,190,90,.7)" : "0 16px 30px rgba(0,0,0,.5)", textAlign: "center", fontWeight: 900, fontSize: 52, color: "#3a2a18", paddingTop: 20 }}>{d}
      {on && lit > 0.05 && <div style={{ ...at(80, 110), width: 30, height: 110, borderRadius: 6, background: "linear-gradient(90deg,#efe6d0,#fffaf0,#d8ccb0)" }}><Ember tt={tt} x={15} y={-12} s={1.1} d={i === 1 ? 1.6 : 2.4} /></div>}</div>; })}
</>}</Stage>;

// 14:06 · EL SILBIDO CORTADO: ondas de sonido salen de unos labios y avanzan por el túnel de la foto; un dedo se cruza y las ondas se congelan y se deshacen
const XWhistle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const cut = phys(tt, 2.4, 6, 0.5), fr = cl((tt - 2.4) / 1.5);
  return <>
    <PhotoObj tt={tt} id="n_tunel_silencio" x={360} y={140} w={1200} h={760} rot={-1} tilt={4} />
    {Array.from({ length: 6 }, (_, i) => { const p = tt < 2.4 ? ((tt * 0.8 + i / 6) % 1) : ((2.4 * 0.8 + i / 6) % 1); return <div key={i} style={{ ...at(700 + p * 600, 520 - p * 160), width: 40 + p * 320, height: 40 + p * 320, borderRadius: "50%", border: `6px solid rgba(255,240,210,${(1 - p) * (1 - fr)})`, transform: "translate(-50%,-50%)" }} />; })}
    {cut > 0.02 && <div style={{ ...at(860, 300 + (1 - Math.min(1, cut)) * 400) }}><svg width={120} height={400} viewBox="0 0 30 100"><rect x={9} y={0} width={12} height={80} rx={6} fill="#c89a78" /><rect x={5} y={60} width={20} height={40} rx={8} fill="#b8886a" /></svg></div>}
    <Num tt={tt} d={2.6} x={960} y={985} txt="SHH… NUNCA SE SILBA" size={84} col={AMB} />
  </>;
}}</Stage>;

// 15:10 · EL CORAZÓN EN LA ALTURA: un electrocardiograma corre sobre la foto del tubo de oxígeno; los latidos se aprietan cada vez más rápido
const XAltitude: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = LIN(tt, h, 0.2), pts: string[] = [];
  for (let x = 0; x <= 1400; x += 6) { const u = x / 1400, ph = (u * (4 + 10 * k) * Math.PI * 2) % (Math.PI * 2), spike = ph < 0.3 ? Math.sin(ph / 0.3 * Math.PI) * 180 : ph < 0.5 ? -Math.sin((ph - 0.3) / 0.2 * Math.PI) * 60 : 0; pts.push(`${260 + x},${560 - spike * cl(tt * 2 - u * 2)}`); }
  return <>
    <PhotoObj tt={tt} id="n_oxigeno_tubo" x={1360} y={110} w={420} h={300} rot={3} />
    <div style={{ ...at(220, 330), width: 1480, height: 460, borderRadius: 20, background: "linear-gradient(180deg,#0a1a14,#04100c)", boxShadow: "inset 0 0 0 4px #1a3a2a, 0 30px 60px rgba(0,0,0,.6)", backgroundImage: "repeating-linear-gradient(0deg, rgba(60,200,120,.08) 0 2px, transparent 2px 40px), repeating-linear-gradient(90deg, rgba(60,200,120,.08) 0 2px, transparent 2px 40px)" }} />
    <svg width={1920} height={1080} style={at(0, 0)}><polyline points={pts.join(" ")} fill="none" stroke={GRN} strokeWidth={6} style={{ filter: `drop-shadow(0 0 10px ${GRN})` }} /></svg>
    <Num tt={tt} d={0.4} x={960} y={900} txt={`SOROCHE · ${Math.round(lerp(70, 130, k))} LATIDOS`} size={78} col={k > 0.6 ? RED : AMB} />
  </>;
}}</Stage>;

// 16:04 · EL QUESO: el corte del cerro en triángulo; se abren de a uno los túneles (huecos negros) y al final la punta se hunde con un golpe de polvo
const XGruyere: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = LIN(tt, h, 0.4), sink = eio(tt, W(h) * 0.7, W(h) * 0.85);
  return <>
    <PhotoObj tt={tt} id="n_cumbre_hundida" x={1340} y={130} w={440} h={320} rot={3} />
    <svg width={1920} height={1080} style={at(0, 0)}>
      <defs><linearGradient id="mt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b4583a" /><stop offset="1" stopColor="#6a3020" /></linearGradient></defs>
      <path d={`M260 900 L ${760} ${260 + sink * 90} L ${860} ${300 + sink * 140} L ${960} ${240 + sink * 120} L 1500 900Z`} fill="url(#mt)" />
      {Array.from({ length: 26 }, (_, i) => { const u = (i * 0.618) % 1, v = ((i * 0.381) % 1), on = k > i / 26; const y = 380 + v * 480, half = (y - 240) * 0.62, x = 860 + (u - 0.5) * 2 * half * 0.8;
        return on ? <ellipse key={i} cx={x} cy={y} rx={14 + (i % 4) * 8} ry={9 + (i % 3) * 5} fill="#120c0a" /> : null; })}
    </svg>
    {sink > 0.05 && <Smoke tt={tt} x={860} y={300} n={6} col={`rgba(200,160,130,${0.5 * (1 - eio(tt, W(h) * 0.85, W(h)))})`} />}
    <Num tt={tt} d={0.3} x={860} y={985} txt="500 AÑOS DE TÚNELES" size={84} col={AMB} />
  </>;
}}</Stage>;

// 17:36 · EL REAL DE A OCHO: una moneda de plata enorme gira de canto y, al detenerse de frente, aparecen grabadas de a una las letras P, T, S, I
const XRealOcho: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sp = 1 - eio(tt, 0.3, 2.4), rot = sp * 1080;
  return <>
    <PhotoObj tt={tt} id="n_real_a8" x={150} y={170} w={460} h={340} rot={-3} />
    <Floor x={1100} y={950} w={700} />
    <div style={{ ...at(800, 260), width: 600, height: 600, borderRadius: "50%", transform: `perspective(1600px) rotateY(${rot}deg)`, background: "radial-gradient(circle at 38% 30%,#ffffff,#c9d1d8 45%,#6d7680)", boxShadow: "inset 0 0 0 22px #9aa2aa, inset 0 0 0 30px #e8edf0, 0 30px 60px rgba(0,0,0,.6)" }}>
      {["P", "T", "S", "I"].map((c, i) => { const s = phys(tt, 2.6 + i * 0.45, 7, 0.5); return s > 0.02 ? <div key={i} style={{ ...at(140 + i * 85, 220), opacity: cl(s * 2), transform: `scale(${0.5 + 0.5 * Math.min(1.1, s)})`, fontWeight: 900, fontSize: 150, color: "#5a636c", textShadow: "0 2px 0 #fff, 0 -2px 0 #3a4048" }}>{c}</div> : null; })}
    </div>
    <Num tt={tt} d={0.5} x={1100} y={150} txt="REAL DE A 8" size={96} col={TX} />
  </>;
}}</Stage>;

// 18:38 · LA RUTA DE LA MONEDA: un mapa con la ruta Potosí → Arica → Lima → Panamá → Sevilla y el ramal Acapulco → Manila; una moneda recorre la línea y en cada parada cae la foto
const XRoute: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const S: [number, number, string, string?][] = [[620, 760, "POTOSÍ", "n_cerro_cono"], [560, 700, "ARICA", "n_arica_puerto"], [520, 560, "LIMA"], [500, 420, "PANAMÁ", "n_selva_panama"], [1500, 330, "SEVILLA", "n_sevilla_rio"]];
  const k = LIN(tt, h, 0.4) * (S.length - 1), i0 = Math.min(S.length - 2, Math.floor(k)), f = k - i0, cx = lerp(S[i0][0], S[i0 + 1][0], f), cy = lerp(S[i0][1], S[i0 + 1][1], f) - Math.sin(Math.PI * f) * (i0 === 3 ? 160 : 30);
  return <>
    <div style={{ ...at(160, 140), width: 1600, height: 800, borderRadius: 18, background: "radial-gradient(ellipse at 50% 40%,#e8dcc0,#c2ad80)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
    <svg width={1920} height={1080} style={at(0, 0)}>
      <path d="M420 260 Q 520 380 470 520 Q 520 700 640 900 L 760 900 Q 700 640 640 520 Q 600 380 560 260Z" fill="#a89468" opacity={0.7} />
      <path d="M1380 220 Q 1520 200 1600 300 Q 1560 420 1460 420 Q 1380 340 1380 220Z" fill="#a89468" opacity={0.7} />
      <polyline points={S.slice(0, i0 + 2).map((s, j) => j <= i0 ? `${s[0]},${s[1]}` : `${cx},${cy}`).join(" ")} fill="none" stroke="#5a3a1c" strokeWidth={6} strokeDasharray="14 10" />
    </svg>
    {S.map((s, j) => j <= i0 + (f > 0.9 ? 1 : 0) ? <React.Fragment key={j}><div style={{ ...at(s[0] - 14, s[1] - 14), width: 28, height: 28, borderRadius: "50%", background: RED, boxShadow: "0 0 0 6px rgba(255,255,255,.7)" }} />
      <div style={{ ...at(s[0] + 24, s[1] - 24), fontWeight: 900, fontSize: 40, color: "#3a2614" }}>{s[2]}</div>
      {s[3] && j === S.reduce((m, q, jj) => (q[3] && jj <= i0 + (f > 0.9 ? 1 : 0) ? jj : m), 0) && <PhotoObj tt={tt - (0.4 + j * (W(h) - 0.85) / (S.length - 1))} id={s[3]} x={1180} y={500} w={480} h={330} at={0} rot={j % 2 ? 3 : -3} />}</React.Fragment> : null)}
    <div style={{ ...at(cx - 30, cy - 30), transform: `rotateY(${tt * 360}deg)` }}><Coin r={30} silver /></div>
  </>;
}}</Stage>;

// 20:02 · LAS COLUMNAS Y LA CINTA: dos columnas de piedra se levantan; una cinta se enrosca entre ellas y, al tensarse, el dibujo se vuelve el signo $
const XDollar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const c = phys(tt, 0.3, 6, 0.5), rb = eio(tt, 1.2, 3.2), dl = eio(tt, 3.6, 4.6);
  return <>
    <PhotoObj tt={tt} id="n_columnas_cinta" x={1300} y={160} w={460} h={340} rot={3} />
    <Floor x={820} y={930} w={800} />
    {[0, 1].map((i) => <div key={i} style={{ ...at(560 + i * 360, 300 + (1 - Math.min(1, c)) * 600), width: 140, height: 620, opacity: 1 - dl * 0.6, borderRadius: "10px 10px 0 0", background: "repeating-linear-gradient(90deg,#d8d2c4 0 18px,#b8b0a0 18px 28px)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />)}
    <svg width={1920} height={1080} style={at(0, 0)}><path d="M960 330 C 540 330 540 560 820 600 C 1100 640 1100 860 680 860" fill="none" stroke={RED} strokeWidth={34} strokeLinecap="round" strokeDasharray={1500} strokeDashoffset={1500 * (1 - rb)} opacity={1 - dl * 0.8} /></svg>
    {dl > 0.02 && <div style={{ ...at(820, 590), transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * dl})`, opacity: dl, fontWeight: 900, fontSize: 560, color: GRN, textShadow: "0 20px 50px rgba(0,0,0,.7)" }}>$</div>}
    <Num tt={tt} d={4.0} x={820} y={150} txt="¿DE ACÁ VIENE EL $?" size={84} col={AMB} />
  </>;
}}</Stage>;

export const HC: Record<string, React.FC<{ t: number; h: H }>> = { tio: XTio, worldspan: XWorldSpan, fogata: XFogata, twincities: XTwinCities, mule: XMule, horseshoe: XHorseshoe,
  mita: XMita, longwalk: XLongWalk, eightmillion: XEightMillion, mercury: XMercury, emptying: XEmptying, tin: XTin, blastseq: XBlastSeq, freddy: XFreddy, cart: XCart,
  lungs: XLungs, tuesday: XTuesday, whistle: XWhistle, altitude: XAltitude, gruyere: XGruyere, realocho: XRealOcho, route: XRoute, dollar: XDollar };
export const COMMENTS: { n: string; from: string; txt: string }[] = [];
const _u = [ICE, GOLD, SILV]; void _u;
