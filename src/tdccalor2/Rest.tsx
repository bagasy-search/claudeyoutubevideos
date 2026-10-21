// tdccalor2 · EL RESTO (123,3 s → final): los 7 calores ocultos, la CTA2 (Manual 1 pág. 71), seguridad, errores, recibo, tarea y cierre.
// Mismo hilo visual que el minuto 1: el avatar (en sus ventanas pagadas) ↔ UN mundo 3D con UNA cámara (encuadres en tl.ts SHOTS)
// ↔ fotos de Claudio HACIENDO cada paso ↔ tomas LTX ultra reales. Pasos por deslizamiento con desenfoque o por portal circular
// (nunca zoom saliendo del mundo 3D). Piezas NUEVAS en cada minuto, todas ancladas a la palabra del ASR.
import React from "react";
import { AbsoluteFill } from "remotion";
import { PT, screenOf } from "./taller3d";
import { Avatar, World, Clip, Stamp, Desc, WIN } from "./Min1";
import { BigNum, COL, Flash, FONT, Portal, Tag, Vid, e, ei, extrude, spr } from "./lib";
import { ST } from "./tl";

export const REST_START = 123.3;
export const REST_END = 1196.1;

// ---------------- tramos de base (fuera de las ventanas del avatar) ----------------
// "w" = el mundo · "img_x" = foto de Claudio haciendo · "ltx:r_x>respaldo" = toma LTX (si todavía no llegó, el respaldo)
const G: [number, string][] = [
  [123.3, "w"], [135.6, "ltx:r_humo>img_incienso"], [141.2, "w"], [152.4, "w"], [169.4, "w"], [176.3, "img_camara"], [180.2, "ltx:r_cutter>img_arena"],
  [188.0, "w"], [190.8, "ltx:r_humo_quieto>img_vibora"], [203.8, "w"], [219.9, "ltx:r_prende>img_prende"], [223.6, "w"], [236.5, "ltx:r_calor_cano>img_mano_cano"],
  [240.9, "w"], [252.2, "w"], [269.3, "ltx:r_lata_corte>w"], [273.0, "img_latas"], [277.2, "img_aletas"], [286.0, "w"], [303.4, "w"], [309.3, "img_termo_cano"],
  [319.4, "w"], [336.2, "w"], [354.1, "img_ladrillo"], [369.6, "w"], [384.4, "w"], [404.5, "ltx:r_ladrillos>img_pared"], [407.5, "w"], [429.2, "ltx:r_pistola>img_pistola"],
  [435.5, "img_manana"], [440.2, "w"], [450.5, "w"], [465.8, "w"], [482.4, "w"], [499.1, "w"], [506.0, "img_cajon"], [514.5, "ltx:r_taladro>img_taladro"],
  [521.0, "img_columnas"], [532.3, "w"], [538.5, "ltx:r_pintura>img_pintura"], [549.0, "img_cajon_pared"], [565.3, "w"], [582.8, "ltx:r_cajon_sol>w"], [587.0, "w"],
  [599.9, "w"], [604.8, "img_cortinita"], [611.6, "ltx:r_cortinita>w"], [617.5, "w"], [633.6, "ltx:r_banera>img_banera"], [647.6, "img_banera"], [663.7, "w"],
  [697.6, "w"], [704.4, "ltx:r_bidones>img_bidones"], [713.1, "w"], [730.5, "w"], [748.3, "w"], [765.2, "w"], [771.0, "img_listones"], [778.8, "w"],
  [784.0, "img_cobijas"], [790.0, "w"], [797.7, "img_carpa"], [802.8, "w"], [812.7, "ltx:r_carpa>w"], [817.7, "w"], [828.6, "w"], [845.0, "w"],
  [862.4, "img_pinza"], [865.2, "img_toalla"], [868.4, "ltx:r_manos_ladrillo>img_toalla"], [880.7, "img_pies"], [884.2, "w"], [899.1, "w"], [913.4, "w"],
  [931.2, "w"], [948.0, "w"], [964.6, "img_detector"], [971.3, "w"], [981.5, "w"], [996.2, "ltx:r_cepillo>img_cepillo"], [1004.2, "w"], [1015.4, "img_dos_cajones"],
  [1031.4, "w"], [1043.8, "w"], [1059.3, "w"], [1075.6, "img_recibo"], [1092.3, "w"], [1109.9, "img_depto"], [1126.6, "w"], [1144.5, "w"],
  [1160.8, "img_incienso_casa"], [1166.0, "ltx:r_enchufe>w"], [1177.0, "w"], [1186.0, "img_tambor"], [1194.5, "w"],
];
type Seg = { a: number; b: number; k: string; i: number };
const AVR = WIN.filter((w) => w.ms >= 125);
const SEGS: Seg[] = (() => {
  const out: Seg[] = [];
  const av = AVR.map((w) => ({ a: w.ms, b: w.me, k: "av" }));
  const pts = [...G.map(([a, k]) => ({ a, k })), ...av.map((x) => ({ a: x.a, k: "av" })), ...av.map((x) => ({ a: x.b, k: "@end" }))].sort((x, y) => x.a - y.a);
  // la base que sigue cuando termina una ventana del avatar = el último tramo G que ya había empezado (o el próximo)
  let lastG = "w";
  for (const p of pts) {
    if (p.k === "@end") { const nxt = G.find(([a]) => a >= p.a - 0.01 && a < p.a + 0.5); out.push({ a: p.a, b: 0, k: nxt ? nxt[1] : lastG, i: 0 }); continue; }
    if (p.k !== "av") lastG = p.k;
    // un tramo G que arranca justo al cerrar el avatar ya lo puso @end
    if (p.k !== "av" && out.length && Math.abs(out[out.length - 1].a - p.a) < 0.5 && out[out.length - 1].k === p.k) continue;
    out.push({ a: p.a, b: 0, k: p.k, i: 0 });
  }
  const s = out.filter((x) => x.a >= REST_START - 0.01);
  for (let i = 0; i < s.length; i++) { s[i].b = i + 1 < s.length ? s[i + 1].a : REST_END + 1; s[i].i = i; }
  // ⛔ al sacar los tramos mínimos (un G que arranca centésimas antes del cierre del avatar) hay que RE-cerrar los vecinos:
  // si no, queda un hueco sin tramo → Trans devuelve null → 1-2 cuadros NEGROS (medido 21-oct: 18 cortes)
  const f = s.filter((x) => x.b - x.a > 0.05);
  for (let i = 0; i < f.length; i++) f[i].b = i + 1 < f.length ? f[i + 1].a : REST_END + 1; // .i se conserva (decide portal/barrido)
  return f;
})();

// foto con movimiento lento (alterna acercarse / alejarse y el lado del paneo)
const Photo: React.FC<{ k: string; t: number; a: number; i: number }> = ({ k, t, a, i }) => {
  const q = e(t, a, a + 7), zin = i % 2 === 0;
  const sc = zin ? 1.04 + 0.1 * q : 1.14 - 0.09 * q, ox = (i % 3 - 1) * 30 * q;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${sc}) translateX(${ox}px)` }}><Vid id={k} /></AbsoluteFill></AbsoluteFill>;
};
const Base: React.FC<{ s: Seg; t: number }> = ({ s, t }) => {
  if (s.k === "av") return <Avatar t={t} />;
  if (s.k === "w") return <World t={t} />;
  if (s.k.startsWith("img_")) return <Photo k={s.k} t={t} a={s.a} i={s.i} />;
  const [clip, fb] = s.k.slice(4).split(">");
  return <Clip k={clip} t={t} a={s.a}>{fb === "w" ? <World t={t} /> : <Photo k={fb} t={t} a={s.a} i={s.i} />}</Clip>;
};

// paso entre dos tramos: si entra el avatar, el paso corre DESPUÉS de su arranque; si sale, ANTES de su cierre (fuera de su ventana está en negro)
const D = 0.36;
const Trans: React.FC<{ t: number }> = ({ t }) => {
  const i = SEGS.findIndex((s) => t >= s.a && t < s.b);
  if (i < 0) return null;
  const cur = SEGS[i], nxt = SEGS[i + 1], prv = SEGS[i - 1];
  // ventana del paso hacia el siguiente (ocurre al final de cur cuando cur es avatar)
  if (nxt && cur.k === "av" && t >= cur.b - D) return <Mix t={t} a={cur.b - D} b={cur.b} from={cur} to={nxt} n={i} />;
  // paso desde el anterior (al principio de cur, salvo que el anterior fuera avatar: ya se hizo)
  if (prv && prv.k !== "av") {
    const a0 = cur.k === "av" ? cur.a : cur.a - 0.001;
    if (t < a0 + D) return <Mix t={t} a={a0} b={a0 + D} from={prv} to={cur} n={i} />;
  }
  return <Base s={cur} t={t} />;
};
const Mix: React.FC<{ t: number; a: number; b: number; from: Seg; to: Seg; n: number }> = ({ t, a, b, from, to, n }) => {
  const k = ei(t, a, b);
  const portal = (from.k === "w" || to.k === "w") && n % 3 === 1;
  if (portal) {
    const m = screenOf(Math.min(Math.max(t, from.a), REST_END), PT.stoveMouth);
    const inWorld = from.k === "w";
    const x = inWorld ? Math.max(200, Math.min(1720, m.x)) : 960, y = inWorld ? Math.max(200, Math.min(880, m.y)) : 540;
    return <><Base s={from} t={t} /><Portal x={x} y={y} r={k}><Base s={to} t={t} /></Portal></>;
  }
  const dir = n % 2 ? 1 : -1, mb = Math.sin(k * Math.PI) * 40;
  return <>
    <AbsoluteFill style={{ transform: `translateX(${-dir * k * 1920}px)`, filter: mb > 1 && from.k !== "av" ? `blur(${mb}px)` : undefined }}><Base s={from} t={t} /></AbsoluteFill>
    <AbsoluteFill style={{ transform: `translateX(${dir * (1 - k) * 1920}px)`, filter: mb > 1 && to.k !== "av" ? `blur(${mb}px)` : undefined }}><Base s={to} t={t} /></AbsoluteFill>
  </>;
};

// =============================== PIEZAS NUEVAS ===============================
const vis = (t: number, at: number, out: number, fi = 0.18, fo = 0.3) => e(t, at, at + fi) * (1 - e(t, out, out + fo));
// tablero de vidrio oscuro que entra en 3D (base de las piezas)
const Panel: React.FC<{ t: number; at: number; out: number; x: number; y: number; w: number; ry?: number; children: React.ReactNode; col?: string }> = ({ t, at, out, x, y, w, ry = -10, children, col = "rgba(255,255,255,.14)" }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.85));
  return <div style={{ position: "absolute", left: x, top: y, width: w, perspective: 1500, opacity: o }}>
    <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - k) * -650}px) rotateY(${ry + (1 - k) * 30 + 2 * Math.sin(t * 0.6)}deg)`, background: "linear-gradient(180deg, rgba(20,24,30,.95), rgba(10,12,16,.95))", border: `2px solid ${col}`, borderRadius: 26, padding: "28px 36px", boxShadow: "0 60px 110px rgba(0,0,0,.7)", fontFamily: FONT, color: "#f4efe6" }}>{children}</div>
  </div>;
};
const Row: React.FC<{ t: number; at: number; children: React.ReactNode; size?: number; col?: string }> = ({ t, at, children, size = 44, col }) => {
  const k = e(t, at, at + 0.25);
  return <div style={{ opacity: k, transform: `translateY(${(1 - k) * 18}px)`, fontWeight: 800, fontSize: size, lineHeight: 1.3, color: col, margin: "6px 0" }}>{children}</div>;
};
const Hl: React.FC<{ c?: string; children: React.ReactNode }> = ({ c = COL.amber, children }) => <span style={{ color: c, fontWeight: 900 }}>{children}</span>;

// 1 · EL TÍTULO DE CADA CALOR: el número cae con su cartel de taller y el nombre se escribe
const Calor: React.FC<{ t: number; at: number; n: number; name: string; out: number }> = ({ t, at, n, name, out }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, at, 0.9)), chars = Math.floor(name.length * e(t, at + 0.35, at + 1.2));
  return <div style={{ position: "absolute", left: 960, top: 190, transform: "translate(-50%,0)", display: "flex", alignItems: "center", gap: 30, opacity: o, fontFamily: FONT }}>
    <div style={{ width: 150, height: 150, background: "#1d1a16", border: `8px solid ${COL.amber}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 120, color: COL.amber, transform: `translateY(${(1 - k) * -300}px) rotate(${(1 - k) * 25}deg)`, boxShadow: `0 0 40px ${COL.amber}66, 0 30px 60px rgba(0,0,0,.7)` }}>{n}</div>
    <div>
      <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 8, color: COL.dim }}>CALOR OCULTO Nº {n}</div>
      <div style={{ fontWeight: 900, fontSize: 82, color: "#fff", textShadow: extrude(7, "#3a2a10"), whiteSpace: "nowrap" }}>{name.slice(0, chars)}<span style={{ opacity: chars < name.length ? 1 : 0 }}>▌</span></div>
    </div>
  </div>;
};

// 2 · LA RENDIJA: una regla mide 1 cm × 80 cm y el hueco se vuelve UN LADRILLO que falta
const Rendija: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const g = e(t, at + 0.2, at + 2.5), b = e(t, at + 6.6, at + 7.4);
  return <Panel t={t} at={at} out={out} x={1340} y={560} w={860}>
    <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 6, color: COL.dim }}>DEBAJO DE TU PUERTA</div>
    <svg width={780} height={300} viewBox="0 0 780 300">
      <rect x={20} y={40} width={740} height={150} fill="#5b3b26" rx={6} />
      <rect x={20} y={190} width={740 * g} height={22 + 60 * b} fill="#8fd6ff" opacity={0.85} />
      {b > 0.05 && <g opacity={b}>{[0, 1, 2, 3].map((i) => <rect key={i} x={30 + i * 182} y={196} width={170} height={66} rx={4} fill="none" stroke="#ffb257" strokeWidth={4} strokeDasharray="10 8" />)}</g>}
      <rect x={20} y={262} width={740} height={12} fill="#7d7a72" />
      {Array.from({ length: 17 }, (_, i) => <line key={i} x1={20 + i * 46.25} y1={282} x2={20 + i * 46.25} y2={i % 2 ? 292 : 300} stroke="#ffd60a" strokeWidth={3} opacity={g} />)}
    </svg>
    <Row t={t} at={at + 0.6}><Hl c={COL.ice}>1 cm</Hl> × <Hl c={COL.ice}>80 cm</Hl> = <Hl>80 cm²</Hl></Row>
    <Row t={t} at={at + 6.8}>= <Hl c={COL.red}>UN LADRILLO MENOS</Hl> EN LA PARED</Row>
  </Panel>;
};

// 3 · EL SALTO DEL TERMÓMETRO: dos cifras que ruedan y una flecha que sube
const Jump: React.FC<{ t: number; at: number; out: number; from: number; to: number; sub: string; x?: number; y?: number }> = ({ t, at, out, from, to, sub, x = 1420, y = 520 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = e(t, at + 0.5, at + 1.6), v = Math.round(from + (to - from) * k), d = to - from;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${Math.min(1.06, spr(t, at, 0.9))})`, opacity: o, fontFamily: FONT, textAlign: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ fontWeight: 900, fontSize: 120, color: COL.ice, textShadow: extrude(6, "#0b2a44") }}>{from}°</div>
      <div style={{ fontWeight: 900, fontSize: 90, color: COL.amber, transform: `translateY(${-14 * Math.sin(t * 5)}px)` }}>➜</div>
      <div style={{ fontWeight: 900, fontSize: 170, color: d > 0 ? COL.amber : COL.ice, textShadow: extrude(8, d > 0 ? "#5a2d00" : "#0b2a44") }}>{v}°</div>
    </div>
    <div style={{ display: "inline-block", marginTop: 6, padding: "8px 26px", borderRadius: 40, background: d > 0 ? COL.amber : COL.ice, color: "#14100a", fontWeight: 900, fontSize: 40 }}>{d > 0 ? "+" : ""}{d} °C · {sub}</div>
  </div>;
};

// 4 · EL CAÑO SE LLEVA: un anillo que se llena de 1/4 a 1/3 (lo que se va por la chimenea)
const Ring: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = e(t, at + 0.3, at + 1.6), k2 = e(t, at + 2.6, at + 3.6), f = 0.25 + 0.083 * k2, F = f * k;
  const R = 150, C = 2 * Math.PI * R;
  return <Panel t={t} at={at} out={out} x={1440} y={560} w={600} ry={-14}>
    <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 5, color: COL.dim, textAlign: "center" }}>DEL CALOR DEL FUEGO…</div>
    <svg width={530} height={360} viewBox="0 0 530 360">
      <circle cx={265} cy={180} r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={46} />
      <circle cx={265} cy={180} r={R} fill="none" stroke="#ff5a1a" strokeWidth={46} strokeDasharray={`${C * F} ${C}`} transform="rotate(-90 265 180)" />
      <text x={265} y={205} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill="#fff">{k2 > 0.5 ? "1/3" : "1/4"}</text>
    </svg>
    <Row t={t} at={at + 0.8} size={40}>…SE VA POR <Hl c="#ff7a3a">EL CAÑO</Hl></Row>
  </Panel>;
};

// 5 · ×10 SUPERFICIE: el corte del caño (un círculo) y le crecen las aletas
const Fins: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = e(t, at + 0.4, at + 2.4);
  return <Panel t={t} at={at} out={out} x={1450} y={540} w={560} ry={-12}>
    <svg width={490} height={380} viewBox="0 0 490 380">
      <circle cx={245} cy={190} r={60} fill="#2a2a2b" stroke="#ff5a1a" strokeWidth={5} />
      {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, L = 120 * k; return <line key={i} x1={245 + Math.cos(a) * 64} y1={190 + Math.sin(a) * 64} x2={245 + Math.cos(a) * (64 + L)} y2={190 + Math.sin(a) * (64 + L)} stroke="#d6dbe0" strokeWidth={9} strokeLinecap="round" />; })}
    </svg>
    <div style={{ textAlign: "center", fontWeight: 900, fontSize: 64, color: "#d6dbe0" }}>×{Math.max(1, Math.round(10 * k))} <span style={{ fontSize: 38, color: COL.dim }}>SUPERFICIE</span></div>
  </Panel>;
};

// 6 · DOS RELOJES de temperatura del humo: ANTES 180 / CON ALETAS 130
const Dial: React.FC<{ v: number; max: number; lab: string; col: string }> = ({ v, max, lab, col }) => {
  const a = -220 + (v / max) * 260;
  return <div style={{ textAlign: "center" }}>
    <svg width={300} height={230} viewBox="0 0 300 230">
      <path d="M 40 190 A 120 120 0 1 1 260 190" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={20} strokeLinecap="round" />
      <line x1={150} y1={150} x2={150 + Math.cos((a * Math.PI) / 180) * 105} y2={150 + Math.sin((a * Math.PI) / 180) * 105} stroke={col} strokeWidth={8} strokeLinecap="round" />
      <circle cx={150} cy={150} r={14} fill={col} />
      <text x={150} y={222} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#fff">{Math.round(v)}°</text>
    </svg>
    <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: 4, color: COL.dim }}>{lab}</div>
  </div>;
};
const Dials: React.FC<{ t: number; at: number; at2: number; at3: number; out: number }> = ({ t, at, at2, at3, out }) => (
  <Panel t={t} at={at} out={out} x={1360} y={560} w={760} ry={-10}>
    <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 6, color: COL.dim }}>EL HUMO SALE A…</div>
    <div style={{ display: "flex", gap: 30, justifyContent: "center" }}>
      <Dial v={180 * e(t, at + 0.2, at + 1.2)} max={220} lab="SIN ALETAS" col="#ff5a1a" />
      <div style={{ opacity: e(t, at2, at2 + 0.3) }}><Dial v={130 * e(t, at2, at2 + 1)} max={220} lab="CON ALETAS" col={COL.ice} /></div>
    </div>
    <Row t={t} at={at3}><Hl>50 °C</Hl> SE QUEDARON EN EL CUARTO</Row>
  </Panel>
);

// 7 · RELOJ DE LA NOCHE: las agujas corren de las 23 a las 6 y el número del taller cambia
const NightClock: React.FC<{ t: number; at: number; out: number; h0: number; h1: number; dur: number; x?: number; y?: number; temp?: [number, number] }> = ({ t, at, out, h0, h1, dur, x = 1560, y = 330, temp }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = e(t, at + 0.3, at + 0.3 + dur), hh = h0 + (((h1 - h0 + 24) % 24) || 24) * k, ang = ((hh % 12) / 12) * 360, mang = (hh % 1) * 360 + k * 360 * 6;
  const lab = `${String(Math.floor(hh) % 24).padStart(2, "0")}:00`;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${Math.min(1.05, spr(t, at, 0.9))})`, opacity: o, fontFamily: FONT, textAlign: "center" }}>
    <svg width={260} height={260} viewBox="0 0 260 260">
      <circle cx={130} cy={130} r={118} fill="rgba(10,14,22,.92)" stroke="#e9e2d2" strokeWidth={8} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={130 + Math.sin((i * Math.PI) / 6) * 98} y1={130 - Math.cos((i * Math.PI) / 6) * 98} x2={130 + Math.sin((i * Math.PI) / 6) * 110} y2={130 - Math.cos((i * Math.PI) / 6) * 110} stroke="#e9e2d2" strokeWidth={4} />)}
      <line x1={130} y1={130} x2={130 + Math.sin((ang * Math.PI) / 180) * 62} y2={130 - Math.cos((ang * Math.PI) / 180) * 62} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
      <line x1={130} y1={130} x2={130 + Math.sin((mang * Math.PI) / 180) * 92} y2={130 - Math.cos((mang * Math.PI) / 180) * 92} stroke={COL.amber} strokeWidth={6} strokeLinecap="round" />
    </svg>
    <div style={{ fontWeight: 900, fontSize: 60, color: "#fff", textShadow: extrude(5, "#222") }}>{lab}</div>
    {temp && <div style={{ fontWeight: 900, fontSize: 46, color: k > 0.5 ? COL.amber : COL.ice }}>{Math.round(temp[0] + (temp[1] - temp[0]) * k)} °C</div>}
  </div>;
};

// 8 · LA CUENTA (ladrillos como batería): renglones que se escriben y una batería que se carga
const Battery: React.FC<{ k: number; col?: string; label: string }> = ({ k, col = "#ff7a2a", label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <div style={{ width: 300, height: 120, border: "6px solid #e9e2d2", borderRadius: 18, padding: 8, position: "relative" }}>
      <div style={{ width: `${k * 100}%`, height: "100%", borderRadius: 10, background: `linear-gradient(90deg, ${col}, #ffd27a)`, boxShadow: `0 0 30px ${col}` }} />
      <div style={{ position: "absolute", right: -24, top: 34, width: 16, height: 40, background: "#e9e2d2", borderRadius: 4 }} />
    </div>
    <div style={{ fontWeight: 900, fontSize: 56, color: "#fff" }}>{label}</div>
  </div>
);

// 9 · EL SOL EN LA VENTANA: 1 m² que se llena de rayos = 400 W
const SunMeter: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = e(t, at + 0.5, at + 2.5);
  return <Panel t={t} at={at} out={out} x={1400} y={540} w={720} ry={-12} col="rgba(255,214,10,.5)">
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      <svg width={260} height={260} viewBox="0 0 260 260">
        <circle cx={60} cy={60} r={34} fill="#ffd60a" />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={60 + i * 4} y1={60 + i * 6} x2={60 + (110 + i * 12) * k} y2={60 + (150 + i * 4) * k} stroke="#ffd60a" strokeWidth={4} opacity={0.75} />)}
        <rect x={110} y={110} width={130} height={130} fill="rgba(143,214,255,.2)" stroke="#8fd6ff" strokeWidth={5} />
        <text x={175} y={185} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff">1 m²</text>
      </svg>
      <div>
        <Row t={t} at={at + 0.2} size={40}><Hl c={COL.ice}>−3 °C</Hl> AFUERA</Row>
        <Row t={t} at={at + 2.2} size={92} col="#ffd60a">{Math.round(400 * k)} W</Row>
        <Row t={t} at={at + 6.5} size={34}>UNA ESTUFA ELÉCTRICA <Hl>GRATIS</Hl></Row>
      </div>
    </div>
  </Panel>;
};

// 10 · 8 × 8 LATAS: la grilla se llena columna por columna y el contador sube a 64
const CanGrid: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = e(t, at, at + 3.2), n = Math.round(64 * k);
  return <Panel t={t} at={at} out={out} x={1440} y={540} w={560} ry={-12}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 46px)", gap: 8, justifyContent: "center" }}>
      {Array.from({ length: 64 }, (_, i) => { const c = i % 8, r = Math.floor(i / 8), idx = c * 8 + (7 - r); return <div key={i} style={{ height: 46, borderRadius: 8, background: idx < n ? ["#b8202a", "#1f6b3a", "#c7c9cc", "#e3b21c"][i % 4] : "rgba(255,255,255,.08)", boxShadow: idx < n ? "inset 0 -6px 0 rgba(0,0,0,.3)" : undefined }} />; })}
    </div>
    <div style={{ textAlign: "center", marginTop: 14, fontWeight: 900, fontSize: 80, color: "#fff" }}>{n} <span style={{ fontSize: 34, color: COL.dim }}>LATAS · 8 × 8</span></div>
  </Panel>;
};

// 11 · BRÚJULA DE HEMISFERIOS: la aguja gira al NORTE (sur del mundo) y después al SUR (norte)
const Compass: React.FC<{ t: number; at: number; flip: number; out: number }> = ({ t, at, flip, out }) => {
  const a = 0 + 180 * ei(t, flip, flip + 0.8), south = t > flip + 0.4;
  return <Panel t={t} at={at} out={out} x={1440} y={520} w={640} ry={-14}>
    <svg width={570} height={300} viewBox="0 0 570 300">
      <circle cx={150} cy={150} r={120} fill="rgba(255,255,255,.05)" stroke="#e9e2d2" strokeWidth={5} />
      <text x={150} y={52} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff">N</text>
      <text x={150} y={272} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff">S</text>
      <g transform={`rotate(${a} 150 150)`}><polygon points="150,58 168,150 132,150" fill="#ffd60a" /><polygon points="150,242 168,150 132,150" fill="#555" /></g>
      <text x={300} y={120} fontFamily={FONT} fontWeight={900} fontSize={26} fill={!south ? "#ffd60a" : "rgba(255,255,255,.35)"}>SUR DEL MUNDO</text>
      <text x={300} y={160} fontFamily={FONT} fontWeight={900} fontSize={42} fill={!south ? "#fff" : "rgba(255,255,255,.35)"}>→ NORTE</text>
      <text x={300} y={220} fontFamily={FONT} fontWeight={900} fontSize={26} fill={south ? "#ffd60a" : "rgba(255,255,255,.25)"}>NORTE DEL MUNDO</text>
      <text x={300} y={260} fontFamily={FONT} fontWeight={900} fontSize={42} fill={south ? "#fff" : "rgba(255,255,255,.25)"}>→ SUR</text>
    </svg>
  </Panel>;
};

// 12 · LA BALANZA: 1 litro de agua contra 1 kilo de ladrillo; el agua pesa ×5 en calor
const Balance: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = ei(t, at + 1.2, at + 2.4), tilt = 14 * k;
  return <Panel t={t} at={at} out={out} x={1400} y={560} w={760} ry={-10}>
    <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 6, color: COL.dim, textAlign: "center" }}>CALOR QUE GUARDA…</div>
    <svg width={690} height={300} viewBox="0 0 690 300">
      <polygon points="345,280 315,300 375,300" fill="#e9e2d2" /><line x1={345} y1={110} x2={345} y2={285} stroke="#e9e2d2" strokeWidth={8} />
      <g transform={`rotate(${tilt} 345 110)`}>
        <line x1={95} y1={110} x2={595} y2={110} stroke="#e9e2d2" strokeWidth={10} strokeLinecap="round" />
        <rect x={45} y={120} width={110} height={130} rx={18} fill="#3d7fd9" /><text x={100} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff">1 L</text>
        <rect x={510} y={160} width={130} height={60} rx={6} fill="#8d4a33" /><text x={575} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill="#fff">1 kg</text>
      </g>
    </svg>
    <Row t={t} at={at + 2.4} size={56}>EL AGUA: <Hl c="#6fb4ff">× 5</Hl></Row>
  </Panel>;
};

// 13 · CARTEL DE REGLAS numeradas (se marcan con una tilde al decirlas)
const Rules: React.FC<{ t: number; at: number; out: number; title: string; rows: { at: number; txt: string }[]; col?: string; x?: number }> = ({ t, at, out, title, rows, col = COL.amber, x = 1330 }) => (
  <Panel t={t} at={at} out={out} x={x} y={540} w={860} ry={-9} col={col}>
    <div style={{ fontWeight: 900, fontSize: 46, color: col, letterSpacing: 3 }}>{title}</div>
    {rows.map((r, i) => <Row key={i} t={t} at={r.at} size={40}>
      <span style={{ display: "inline-flex", width: 56, height: 56, borderRadius: "50%", background: col, color: "#14100a", alignItems: "center", justifyContent: "center", marginRight: 18, fontWeight: 900 }}>{i + 1}</span>{r.txt}
    </Row>)}
  </Panel>
);

// 14 · LA LAMPARITA de 100 W que se enciende (tu cuerpo)
const Body100: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = e(t, at + 0.6, at + 1.6), fl = 0.9 + 0.1 * Math.sin(t * 13);
  return <Panel t={t} at={at} out={out} x={520} y={520} w={560} ry={12} col="rgba(255,214,10,.4)">
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      <svg width={170} height={250} viewBox="0 0 170 250">
        <circle cx={85} cy={95} r={70} fill={`rgba(255,214,120,${0.15 + 0.75 * k * fl})`} stroke="#e9e2d2" strokeWidth={5} style={{ filter: `drop-shadow(0 0 ${40 * k}px #ffd27a)` }} />
        <path d="M 65 95 Q 75 70 85 95 Q 95 120 105 95" stroke="#7a4a10" strokeWidth={4} fill="none" />
        <rect x={58} y={160} width={54} height={50} rx={6} fill="#9aa3ad" /><rect x={66} y={210} width={38} height={20} rx={6} fill="#555" />
      </svg>
      <div><Row t={t} at={at + 0.4} size={96} col="#ffd60a">100 W</Row><Row t={t} at={at + 1.0} size={34}>TU CUERPO, QUIETO,<br />TODA LA NOCHE</Row></div>
    </div>
  </Panel>;
};

// 15 · 50 m³ CONTRA 3 m³: el cubo grande se encoge al tamaño de la carpa
const Cubes: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = ei(t, at + 1.0, at + 2.4), sz = 220 - 150 * k;
  return <Panel t={t} at={at} out={out} x={1440} y={540} w={600} ry={-14}>
    <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", perspective: 800 }}>
      <div style={{ width: sz, height: sz, background: `rgba(${143 + 112 * k},${214 - 40 * k},${255 - 160 * k},.35)`, border: `5px solid ${k > 0.5 ? COL.amber : COL.ice}`, transform: "rotateX(-18deg) rotateY(30deg)", boxShadow: k > 0.5 ? `0 0 60px ${COL.amber}` : undefined }} />
    </div>
    <div style={{ textAlign: "center", fontWeight: 900, fontSize: 80, color: k > 0.5 ? COL.amber : COL.ice }}>{k > 0.5 ? "3 m³" : "50 m³"}</div>
    <Row t={t} at={at + 0.2} size={32}>DE AIRE QUE CALIENTA TU CUERPO</Row>
  </Panel>;
};

// 16 · EL REPASO: libreta del taller que suma calor por calor
const Tally: React.FC<{ t: number; at: number; out: number; rows: { at: number; n: number; txt: string; v: string }[]; total: number }> = ({ t, at, out, rows, total }) => (
  <Panel t={t} at={at} out={out} x={520} y={560} w={760} ry={10} col="rgba(255,178,87,.6)">
    <div style={{ fontWeight: 900, fontSize: 32, letterSpacing: 6, color: COL.dim }}>LA LIBRETA DEL TALLER</div>
    <Row t={t} at={at + 0.2} size={36}>ARRANQUE: <Hl c={COL.ice}>4 °C</Hl> CON ESCARCHA</Row>
    {rows.map((r) => <Row key={r.n} t={t} at={r.at} size={36}><span style={{ display: "flex", justifyContent: "space-between", gap: 20 }}><span><Hl>{r.n}</Hl> · {r.txt}</span><span style={{ color: "#7dff9e", whiteSpace: "nowrap" }}>{r.v}</span></span></Row>)}
    <div style={{ height: 4, background: "rgba(255,255,255,.3)", margin: "14px 0", transform: `scaleX(${e(t, total - 0.5, total)})`, transformOrigin: "0 0" }} />
    <Row t={t} at={total} size={64}><Hl c="#ffd60a">20 °C</Hl> <span style={{ fontSize: 34 }}>SIN GARRAFA · SIN UN LEÑO MÁS</span></Row>
  </Panel>
);

// 17 · EL MONÓXIDO: tres sentidos tachados (no se huele, no se ve, no hace humo)
const CO: React.FC<{ t: number; at: number; out: number; ats: number[] }> = ({ t, at, out, ats }) => (
  <Panel t={t} at={at} out={out} x={1340} y={540} w={820} ry={-10} col="rgba(255,74,61,.7)">
    <div style={{ fontWeight: 900, fontSize: 70, color: COL.red, textShadow: "0 0 30px rgba(255,74,61,.6)" }}>CO · MONÓXIDO</div>
    <div style={{ display: "flex", gap: 34, marginTop: 16 }}>
      {[["👃", "SIN OLOR"], ["👁", "SIN COLOR"], ["💨", "SIN HUMO"]].map(([ic, l], i) => { const k = e(t, ats[i], ats[i] + 0.3); return <div key={i} style={{ textAlign: "center", opacity: 0.25 + 0.75 * k }}>
        <div style={{ position: "relative", fontSize: 110 }}>{ic}<div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 12, background: COL.red, transform: `rotate(-35deg) scaleX(${k})`, borderRadius: 6 }} /></div>
        <div style={{ fontWeight: 900, fontSize: 32 }}>{l}</div></div>; })}
    </div>
  </Panel>
);

// 18 · BARRAS DE PRUEBA: dos cajones iguales, sin pintar vs negro mate
const Bars2: React.FC<{ t: number; at: number; at2: number; out: number }> = ({ t, at, at2, out }) => {
  const a = e(t, at, at + 1), b = e(t, at2, at2 + 1);
  const bar = (k: number, v: number, lab: string, col: string) => <div style={{ textAlign: "center", width: 220 }}>
    <div style={{ height: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}><div style={{ width: 130, height: 300 * (v / 60) * k, background: col, borderRadius: "12px 12px 0 0", boxShadow: `0 0 30px ${col}66` }} /></div>
    <div style={{ fontWeight: 900, fontSize: 64, color: "#fff" }}>{Math.round(v * k)}°</div><div style={{ fontWeight: 800, fontSize: 28, color: COL.dim }}>{lab}</div></div>;
  return <Panel t={t} at={at - 0.3} out={out} x={1420} y={540} w={620} ry={-12}>
    <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>{bar(a, 30, "SIN PINTAR", "#c7c9cc")}{bar(b, 55, "NEGRO MATE", "#ff7a2a")}</div>
  </Panel>;
};

// 19 · EL RECIBO DE ESTA NOCHE: un ticket que se imprime renglón por renglón
const Ticket: React.FC<{ t: number; at: number; out: number; rows: { at: number; txt: string; v: string }[]; totalAt: number }> = ({ t, at, out, rows, totalAt }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const shown = rows.filter((r) => t >= r.at).length, h = 170 + shown * 64 + (t > totalAt ? 140 : 0);
  return <div style={{ position: "absolute", left: 1420, top: 80, width: 620, transform: `translateX(-50%) rotate(${-2 + 0.6 * Math.sin(t * 0.7)}deg)`, opacity: o, fontFamily: "'Courier New', monospace", filter: "drop-shadow(0 40px 60px rgba(0,0,0,.7))" }}>
    <div style={{ background: "#f3efe4", color: "#1b1b1b", padding: "30px 40px", height: Math.min(h, 900), overflow: "hidden", transition: "none", clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),95% 100%,90% calc(100% - 14px),85% 100%,80% calc(100% - 14px),75% 100%,70% calc(100% - 14px),65% 100%,60% calc(100% - 14px),55% 100%,50% calc(100% - 14px),45% 100%,40% calc(100% - 14px),35% 100%,30% calc(100% - 14px),25% 100%,20% calc(100% - 14px),15% 100%,10% calc(100% - 14px),5% 100%,0 calc(100% - 14px))" }}>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 40 }}>TALLER DE CLAUDIO</div>
      <div style={{ textAlign: "center", fontSize: 26 }}>RECIBO · ESTA NOCHE</div>
      <div style={{ borderTop: "3px dashed #555", margin: "14px 0" }} />
      {rows.map((r, i) => t >= r.at && <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 700, margin: "10px 0" }}><span>{r.txt}</span><span style={{ color: r.v === "$0" ? "#1f7a3a" : "#b3261e" }}>{r.v}</span></div>)}
      {t > totalAt && <><div style={{ borderTop: "3px dashed #555", margin: "14px 0" }} /><div style={{ fontWeight: 900, fontSize: 34 }}>TOTAL: MENOS QUE<br />UNA GARRAFA · UNA VEZ</div></>}
    </div>
  </div>;
};

// 20 · LOS 7 EN FICHAS: se apagan los que necesitan estufa (departamento) / se iluminan los 2 para empezar
const Seven: React.FC<{ t: number; at: number; out: number; on: (i: number) => number; title: string }> = ({ t, at, out, on, title }) => {
  const N = ["RENDIJAS", "ALETAS", "LADRILLOS", "SOL", "AGUA", "CUARTO TIBIO", "LADRILLO A LOS PIES"];
  const o = vis(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, opacity: o, fontFamily: FONT, textAlign: "center" }}>
    <div style={{ fontWeight: 900, fontSize: 54, color: "#fff", textShadow: extrude(6, "#3a2a10"), marginBottom: 18 }}>{title}</div>
    <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
      {N.map((n, i) => { const k = on(i), d = Math.min(1, spr(t, at + i * 0.1, 1)); return <div key={i} style={{ width: 230, padding: "14px 10px", borderRadius: 16, background: k > 0.5 ? "rgba(255,178,87,.95)" : "rgba(20,22,26,.9)", color: k > 0.5 ? "#14100a" : "rgba(255,255,255,.45)", border: "3px solid rgba(255,178,87,.7)", transform: `translateY(${(1 - d) * 120}px) scale(${k > 0.5 ? 1.06 : 0.96})`, fontWeight: 900, fontSize: 26 }}>
        <div style={{ fontSize: 44 }}>{i + 1}</div>{n}</div>; })}
    </div>
  </div>;
};

// 21 · LA PREGUNTA a los comentarios
const Ask: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const n = Math.min(5, Math.floor(e(t, at + 1.0, at + 3.8) * 6));
  return <Panel t={t} at={at} out={out} x={1360} y={520} w={820} ry={-10}>
    <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 5, color: COL.dim }}>💬 TU TAREA DE ESTA NOCHE</div>
    <Row t={t} at={at + 0.2} size={56}>¿CUÁNTAS <Hl>RENDIJAS</Hl> ENCONTRASTE?</Row>
    <div style={{ display: "flex", gap: 16, marginTop: 10 }}>{Array.from({ length: 6 }, (_, i) => <div key={i} style={{ width: 90, height: 90, borderRadius: 16, border: "4px solid rgba(255,255,255,.3)", background: i < n ? COL.amber : "transparent", color: "#14100a", fontWeight: 900, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>{i < n ? i + 1 : ""}</div>)}</div>
    <Row t={t} at={at + 3.6} size={40}>TE APUESTO QUE SON <Hl>MÁS DE 5</Hl></Row>
  </Panel>;
};

// 22 · PRÓXIMO VIDEO: tarjeta con el tambor de 200 L
const Next: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => (
  <Panel t={t} at={at} out={out} x={560} y={520} w={760} ry={10} col="rgba(61,127,217,.8)">
    <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 6, color: "#6fb4ff" }}>▶ PRÓXIMO VIDEO</div>
    <Row t={t} at={at + 0.3} size={60}>LA ESTUFA DE <Hl c="#6fb4ff">TAMBOR DE 200 L</Hl></Row>
    <Row t={t} at={at + 3.4} size={40}>UNA CASA ENTERA CON <Hl>LA MITAD DE LEÑA</Hl></Row>
  </Panel>
);

// rótulo pegado a un punto del mundo
const WTag: React.FC<{ t: number; at: number; out: number; q: [number, number, number]; text: string; sub?: string; dx?: number; dy?: number; col?: string; size?: number }> = ({ t, at, out, q, text, sub, dx = 200, dy = -120, col = COL.amber, size = 50 }) => {
  if (t < at - 0.1 || t > out + 0.5) return null;
  const p = screenOf(t, q);
  // la etiqueta SIEMPRE dentro del cuadro: si no entra del lado pedido, se da vuelta; si tampoco, se corre
  const w = Math.max(text.length * size * 0.68, (sub || "").length * size * 0.36) + 20, M = 70;
  let ddx = dx;
  if (ddx >= 0 && p.x + ddx + w > 1920 - M) ddx = p.x - Math.abs(ddx) - w >= M ? -Math.abs(ddx) : Math.max(1920 - M - w - p.x, -p.x + M);
  else if (ddx < 0 && p.x + ddx - w < M) ddx = p.x + Math.abs(ddx) + w <= 1920 - M ? Math.abs(ddx) : Math.min(M + w - p.x, 1920 - M - p.x);
  const hh = sub ? size * 1.1 : size * 0.6, ddy = Math.min(Math.max(dy, M + hh - p.y), 1080 - M - hh - p.y);
  return <Tag t={t} at={at} x={p.x} y={p.y} dx={ddx} dy={ddy} text={text} sub={sub} col={col} out={out} size={size} />;
};
const Chip2: React.FC<{ t: number; at: number; out: number; text: string; col?: string; y?: number }> = ({ t, at, out, text, col = COL.amber, y = 110 }) => {
  const o = vis(t, at, out, 0.12, 0.25); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 110, top: y, opacity: o, transform: `scale(${Math.min(1.08, spr(t, at))})`, transformOrigin: "0 0", padding: "14px 30px", borderRadius: 40, background: "rgba(10,14,22,.92)", border: `3px solid ${col}`, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: col, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>{text}</div>;
};

// ================================================================================================
export const Rest: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [<Trans key="base" t={t} />];
  const add = (n: React.ReactNode) => L.push(n);
  const sv = ST(t);
  // ---------- 1 · LAS RENDIJAS ----------
  add(<Calor key="c1" t={t} at={127.75} n={1} name="LAS RENDIJAS" out={131.3} />);
  add(<Chip2 key="bar" t={t} at={123.5} out={127.5} text="💸 LO MÁS BARATO DE TODO" />);
  add(<WTag key="hum" t={t} at={141.4} out={146.8} q={PT.doorGap} text="SE ACUESTA" sub="Y SE METE PARA ADENTRO" dx={-320} dy={-160} col={COL.ice} />);
  add(<WTag key="frio" t={t} at={152.6} out={157.4} q={PT.window} text="SALE EL CALIENTE" sub="POR ARRIBA" dx={260} dy={-90} />);
  add(<Rendija key="ren" t={t} at={157.8} out={164.6} />);
  add(<Stamp key="34" t={t} at={169.6} text="3 O 4 EN CADA CASA VIEJA" x={960} y={850} rot={-4} size={64} out={176.1} />);
  add(<Chip2 key="tir" t={t} at={176.4} out={180.1} text="🚲 LA CÁMARA QUE IBAS A TIRAR" />);
  add(<Chip2 key="are" t={t} at={180.4} out={181.9} text="+ ARENA SECA O ASERRÍN" col={COL.ice} />);
  add(<WTag key="vib" t={t} at={188.4} out={190.7} q={PT.doorGap} text="LA VÍBORA" sub="1 METRO · PESADA" dx={-300} dy={-150} />);
  add(<Stamp key="sube" t={t} at={195.2} text="SUBE DERECHO" x={1400} y={300} rot={6} size={70} col="#7dff9e" out={198.1} />);
  add(<WTag key="mng" t={t} at={204.0} out={207.6} q={[-2.6, 1.2, -2.95]} text="MANGUERA CORTADA" sub="EN EL BORDE DE LA HOJA" dx={260} dy={-60} col="#7dff9e" />);
  add(<Jump key="j6" t={t} at={208.4} out={215.7} from={4} to={6} sub="SIN QUEMAR NADA" />);
  // ---------- 2 · EL CAÑO ----------
  add(<Chip2 key="pap" t={t} at={220.1} out={223.4} text="🔥 CON LOS LADRILLOS DE PAPEL" />);
  add(<Calor key="c2" t={t} at={228.55} n={2} name="EL CAÑO DE LA ESTUFA" out={232.3} />);
  add(<BigNum key="200" t={t} at={236.9} text="200 °C" size={160} x={1450} y={300} out={240.7} col="#ff6a2a" sub="EL CAÑO, BIEN PRENDIDO" />);
  add(<WTag key="paj" t={t} at={241.3} out={246.0} q={PT.flueTop} text="CALIENTA A LOS PÁJAROS" dx={-420} dy={60} col="#ff7a3a" />);
  add(<Ring key="ring" t={t} at={252.4} out={258.8} />);
  add(<Stamp key="nunca" t={t} at={253.6} text="TAPARLO: NUNCA" x={600} y={860} rot={-6} size={70} out={259.8} />);
  add(<Chip2 key="rob" t={t} at={260.1} out={265.3} text="🧲 ROBARLE EL CALOR · SIN FRENAR EL HUMO" />);
  add(<Chip2 key="lat" t={t} at={269.5} out={272.9} text="🥫 LATAS DE ALUMINIO VACÍAS" />);
  add(<Chip2 key="u" t={t} at={277.3} out={281.4} text="EN U · COMO UN RADIADOR" col={COL.ice} />);
  add(<Fins key="fins" t={t} at={286.2} out={293.6} />);
  add(<WTag key="alet" t={t} at={286.5} out={297.9} q={PT.flue} text="LAS ALETAS" sub="LATAS + ALAMBRE" dx={-380} dy={-40} col="#d6dbe0" />);
  add(<Rules key="ral" t={t} at={303.6} out={315.3} title="⚠ DETALLE IMPORTANTE" col="#ff9a4a" rows={[{ at: 303.8, txt: "SÓLO DENTRO DEL CUARTO, A +1 m DE LA ESTUFA" }, { at: 305.2, txt: "LO PINTADO, HACIA EL CAÑO" }, { at: 311.0, txt: "1ª PRENDIDA: PUERTA ABIERTA" }]} />);
  add(<Dials key="dl" t={t} at={319.5} at2={322.0} at3={326.6} out={329.8} />);
  add(<Jump key="j9" t={t} at={329.9} out={334.4} from={6} to={9} sub="CON LAS ALETAS" x={1420} y={820} />);
  // ---------- 3 · LOS LADRILLOS ----------
  add(<NightClock key="nc1" t={t} at={336.4} out={346.3} h0={23} h1={0} dur={3.0} temp={[9, 5]} />);
  add(<Calor key="c3" t={t} at={346.75} n={3} name="CUANDO SE APAGA EL FUEGO" out={349.4} />);
  add(<Chip2 key="25" t={t} at={357.6} out={364.6} text="🧱 LADRILLO MACIZO · 2,5 kg · HORAS EN ENFRIARSE" />);
  add(<Panel key="cta" t={t} at={372.9} out={379.8} x={1360} y={540} w={800}>
    <div style={{ fontWeight: 900, fontSize: 32, letterSpacing: 6, color: COL.dim }}>LA CUENTA</div>
    <Row t={t} at={375.4} size={50}>40 LADRILLOS = <Hl>100 kg</Hl></Row>
    <Row t={t} at={378.2} size={50}>+80 °C SOBRE EL AIRE</Row>
  </Panel>);
  add(<Panel key="ctb" t={t} at={384.5} out={396.0} x={1360} y={540} w={800}>
    <Battery k={e(t, 384.6, 388)} label="≈ 2 kWh" />
    <Row t={t} at={386.0} size={44}>= ESTUFA DE <Hl>300 W</Hl> × <Hl>6 HORAS</Hl></Row>
    <Row t={t} at={389.5} size={40}>SIN ENCHUFE · <Hl c="#7dff9e">GRATIS</Hl> · EL MISMO FUEGO</Row>
  </Panel>);
  add(<WTag key="pc" t={t} at={396.3} out={398.0} q={PT.bricks} text="LA PARED DE CALOR" dx={-300} dy={-200} />);
  add(<WTag key="10" t={t} at={407.8} out={411.8} q={[2.22, 0.35, -1.6]} text="10 CM" sub="NUNCA PEGADOS" dx={-260} dy={-120} col="#ffd60a" />);
  add(<WTag key="air" t={t} at={412.1} out={415.2} q={[2.7, 1.3, -1.4]} text="SE CARGAN" sub="COMO UNA BATERÍA" dx={-330} dy={-60} col="#ff9a4a" />);
  add(<Stamp key="nen" t={t} at={419.5} text="NUNCA ENCIMA NI TAPANDO" x={960} y={860} rot={-4} size={62} out={423.8} />);
  add(<Stamp key="res" t={t} at={424.1} text="LA ESTUFA RESPIRA" x={960} y={860} rot={3} size={66} col={COL.ice} out={426.0} />);
  add(<Chip2 key="23" t={t} at={426.1} out={429.0} text="🕚 23:00 · DEJO DE CARGAR" col={COL.ice} />);
  add(<BigNum key="90" t={t} at={430.6} text="90 °C" size={150} x={1480} y={280} out={431.7} col="#ff6a2a" sub="POR FUERA" />);
  add(<NightClock key="nc2" t={t} at={435.6} out={446.3} h0={23} h1={6} dur={2.6} temp={[4, 12]} x={1600} y={340} />);
  add(<Chip2 key="ant" t={t} at={435.7} out={440.0} text="ANTES: 4 °C A LAS 6 · AHORA:" col={COL.ice} />);
  // ---------- CTA2 · Manual 1 pág. 71 ----------
  add(<Chip2 key="m1" t={t} at={450.7} out={453.6} text="MANUAL 1 · LADRILLOS DE CALOR" col="#e05a8a" />);
  add(<BigNum key="p71" t={t} at={453.5} text="PÁG. 71" size={100} x={1660} y={150} out={456.6} col="#ffd60a" edge="#5a4500" />);
  add(<Chip2 key="ah" t={t} at={457.0} out={458.5} text="💰 CUÁNTO TE AHORRA CADA LADRILLO" />);
  add(<Chip2 key="gar" t={t} at={458.7} out={461.0} text="🧱 = 1 GARRAFA ENTERA" col="#7dff9e" />);
  add(<Desc key="dsc" t={t} at={463.9} out={465.7} x={1160} scale={0.74} />);
  // ---------- 4 · EL SOL ----------
  add(<Stamp key="tres" t={t} at={470.4} text="ESOS SON 3" x={960} y={850} rot={-5} size={80} col={COL.amber} out={475.0} />);
  add(<Calor key="c4" t={t} at={478.55} n={4} name="EL SOL DE TU VENTANA" out={482.3} />);
  add(<SunMeter key="sun" t={t} at={484.1} out={495.4} />);
  add(<Chip2 key="tra" t={t} at={501.5} out={505.9} text="🪤 LE ARMO UNA TRAMPA" />);
  add(<Chip2 key="caj" t={t} at={506.1} out={509.6} text="1 m × 1 m · 10 cm · ESPUMA ATRÁS" col={COL.ice} />);
  add(<Chip2 key="mech" t={t} at={516.6} out={520.9} text="🔩 MECHA DE 20 · FONDO Y TAPA" />);
  add(<Chip2 key="sil" t={t} at={524.9} out={527.4} text="SILICONA DE ALTA TEMPERATURA" col="#ff9a4a" />);
  add(<CanGrid key="cg" t={t} at={532.4} out={538.3} />);
  add(<Stamp key="mat" t={t} at={538.7} text="NEGRO MATE" x={1450} y={300} rot={6} size={80} col="#ffd60a" out={543.3} />);
  add(<Compass key="cmp" t={t} at={550.2} flip={555.4} out={560.3} />);
  add(<WTag key="flw" t={t} at={565.6} out={571.0} q={[-4.0, 0.85, -2.45]} text="ENTRA FRÍO ABAJO" dx={260} dy={60} col={COL.ice} />);
  add(<WTag key="flw2" t={t} at={567.5} out={577.7} q={[-4.0, 1.8, -2.4]} text="SALE CALIENTE ARRIBA" dx={300} dy={-80} />);
  add(<Stamp key="sv" t={t} at={572.0} text="SIN VENTILADOR" x={1300} y={880} rot={-5} size={64} col="#7dff9e" out={577.7} />);
  add(<BigNum key="55" t={t} at={582.9} text="55 °C" size={170} x={1450} y={300} out={586.8} col="#ffd60a" sub="EN LA SALIDA, AL MEDIODÍA" />);
  add(<Jump key="j15" t={t} at={587.2} out={593.8} from={12} to={15} sub="SIN TOCAR LA ESTUFA" />);
  add(<Chip2 key="err1" t={t} at={590.7} out={593.9} text="⚠ EL ERROR Nº 1 DE ESTE INVENTO" col={COL.red} y={200} />);
  add(<WTag key="rev" t={t} at={600.0} out={604.6} q={[-4.0, 1.25, -2.45]} text="DE NOCHE SE DA VUELTA" sub="TE DEVUELVE AIRE FRÍO" dx={320} dy={-60} col={COL.ice} />);
  add(<Stamp key="val" t={t} at={617.6} text="VÁLVULA DE UN PESO" x={960} y={850} rot={-4} size={70} col="#7dff9e" out={622.2} />);
  add(<BigNum key="gua" t={t} at={622.5} text="¿CÓMO LO GUARDAS?" size={110} y={200} out={628.4} col={COL.amber} sub="LA RESPUESTA ESTÁ EN EL BAÑO" />);
  // ---------- 5 · EL AGUA ----------
  add(<Calor key="c5" t={t} at={628.95} n={5} name="EL AGUA QUE TIRAS" out={633.4} />);
  add(<Balance key="bal" t={t} at={634.2} out={642.9} />);
  add(<Panel key="ban" t={t} at={650.3} out={660.1} x={1380} y={560} w={760}>
    <div style={{ fontWeight: 900, fontSize: 32, letterSpacing: 6, color: COL.dim }}>UNA BAÑERA</div>
    <Row t={t} at={650.4} size={52}><Hl c="#6fb4ff">150 L</Hl> A <Hl c="#ff7a3a">40 °C</Hl></Row>
    <Battery k={e(t, 655, 659)} col="#3d7fd9" label="3,5 kWh" />
  </Panel>);
  add(<Panel key="vs" t={t} at={663.8} out={670.6} x={1360} y={540} w={780}>
    <Row t={t} at={663.9} size={40}>BAÑERA <span style={{ display: "inline-block", width: 420 * e(t, 664, 665), height: 30, background: "#3d7fd9", borderRadius: 8, verticalAlign: "middle" }} /> 3,5</Row>
    <Row t={t} at={664.3} size={40}>40 LADRILLOS <span style={{ display: "inline-block", width: 240 * e(t, 664.4, 665.4), height: 30, background: "#8d4a33", borderRadius: 8, verticalAlign: "middle" }} /> 2</Row>
    <Row t={t} at={666.0} size={40}>PUERTA ABIERTA = <Hl c="#6fb4ff">ESTUFA DE AGUA, 2 HORAS</Hl></Row>
  </Panel>);
  add(<Rules key="rag" t={t} at={671.0} out={692.6} title="3 REGLAS · LA BAÑERA" col="#6fb4ff" rows={[{ at: 672.8, txt: "CHICOS O MAYORES: NUNCA SIN MIRAR" }, { at: 680.5, txt: "VENTILA DESPUÉS (LA HUMEDAD ENFRÍA)" }, { at: 684.5, txt: "SIN JABÓN TODA LA NOCHE" }]} />);
  add(<WTag key="bid" t={t} at={698.0} out={704.2} q={PT.jugs} text="6 BIDONES NEGROS" sub="6 × 20 L = 120 L" dx={260} dy={-170} />);
  add(<WTag key="35" t={t} at={713.3} out={721.3} q={PT.jugs} text="35 °C A LA TARDE" dx={280} dy={-160} col="#ff9a4a" />);
  add(<Jump key="j16" t={t} at={714.0} out={724.4} from={15} to={16} sub="UN GRADO, NO MÁS" x={1380} y={760} />);
  add(<Stamp key="poco" t={t} at={721.7} text="ES POCO. TE LO DIGO." x={960} y={300} rot={-4} size={64} col={COL.ice} out={724.4} />);
  // ---------- 6 · TÚ ----------
  add(<Stamp key="v5" t={t} at={731.6} text="YA VAMOS 5" x={960} y={860} rot={-4} size={72} col={COL.amber} out={736.8} />);
  add(<Chip2 key="nil" t={t} at={737.0} out={743.6} text="🚫🥫 NI UNA LATA" />);
  add(<Calor key="c6" t={t} at={738.95} n={6} name="ERES TÚ" out={743.6} />);
  add(<Body100 key="b100" t={t} at={748.4} out={756.6} />);
  add(<WTag key="50" t={t} at={750.0} out={756.7} q={PT.cot} text="4 × 4 · TECHO ALTO" sub="50 m³ DE AIRE" dx={300} dy={-200} col={COL.ice} />);
  add(<Stamp key="nada" t={t} at={756.9} text="NO CALIENTA NADA" x={960} y={860} rot={-4} size={66} out={759.2} />);
  add(<BigNum key="ct" t={t} at={765.3} text="EL CUARTO TIBIO" size={110} y={200} out={770.8} col={COL.amber} />);
  add(<Chip2 key="lis" t={t} at={771.2} out={774.6} text="4 LISTONES + ALAMBRE · 1 m DE ALTO" />);
  add(<WTag key="nyl" t={t} at={779.0} out={783.8} q={[-3.4, 1.4, 1.2]} text="COBIJAS + NYLON" sub="QUE EL AIRE NO SE CUELE" dx={300} dy={-160} />);
  add(<Chip2 key="esp" t={t} at={784.1} out={789.8} text="⬇ LONA O CARTÓN BAJO EL COLCHÓN" col={COL.ice} />);
  add(<Cubes key="cub" t={t} at={790.1} out={792.6} />);
  add(<Panel key="mt" t={t} at={797.9} out={802.6} x={1440} y={420} w={500} ry={-12}>
    <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: 4, color: COL.dim }}>DENTRO DE LA CARPA</div>
    <Row t={t} at={798.1} size={50}>½ HORA · <Hl>16 °C</Hl></Row>
    <Row t={t} at={800.4} size={50}>1 HORA · <Hl c="#ff7a3a">18 °C</Hl></Row>
  </Panel>);
  add(<Jump key="j18" t={t} at={803.0} out={808.2} from={10} to={18} sub="CON TU PROPIO CUERPO" />);
  add(<Chip2 key="cab" t={t} at={812.9} out={817.5} text="🙂 LA CABEZA AFUERA, SIEMPRE" col="#7dff9e" />);
  add(<Stamp key="jam" t={t} at={817.8} text="JAMÁS FUEGO ADENTRO" x={960} y={860} rot={-4} size={70} out={823.2} />);
  // ---------- 7 · EL LADRILLO A LOS PIES ----------
  add(<Calor key="c7" t={t} at={834.95} n={7} name="LAS PIEDRAS DE LA ESTUFA" out={838.6} />);
  add(<Chip2 key="abu" t={t} at={838.9} out={841.1} text="👵 LO HACÍAN LAS ABUELAS" />);
  add(<WTag key="ref" t={t} at={851.0} out={856.3} q={PT.brick7} text="LADRILLO REFRACTARIO" sub="1 HORA ARRIBA DE LA ESTUFA" dx={-380} dy={-160} col="#ffd60a" />);
  add(<Chip2 key="pin" t={t} at={862.5} out={865.0} text="🗜 CON LA PINZA, NUNCA CON LA MANO" col={COL.red} />);
  add(<Chip2 key="alg" t={t} at={865.3} out={868.2} text="3 VUELTAS DE TOALLA DE ALGODÓN" />);
  add(<Stamp key="qm" t={t} at={872.9} text="SI QUEMA LA MANO, QUEMA EL PIE" x={960} y={860} rot={-3} size={56} out={874.7} />);
  add(<BigNum key="30p" t={t} at={880.9} text="30 °C" size={150} x={1460} y={300} out={884.0} col="#ff9a4a" sub="EN LOS PIES · A LAS 4 SIGUE TIBIO" />);
  // ---------- EL REPASO ----------
  add(<Tally key="tal" t={t} at={884.3} out={912.5} total={905.3} rows={[
    { at: 891.6, n: 1, txt: "RENDIJAS", v: "+2" }, { at: 892.9, n: 2, txt: "ALETAS", v: "+3" }, { at: 895.3, n: 3, txt: "LADRILLOS", v: "12 °C AL ALBA" },
    { at: 897.5, n: 4, txt: "SOL DE LATAS", v: "+3" }, { at: 900.0, n: 5, txt: "AGUA", v: "+1" }, { at: 902.0, n: 6, txt: "CUARTO TIBIO + 7", v: "" }]} />);
  add(<Flash key="f20" t={t} at={905.3} col="#ffd60a" peak={0.3} w={0.5} />);
  // ---------- SEGURIDAD ----------
  add(<BigNum key="sal" t={t} at={913.5} text="LO QUE TE SALVA LA VIDA" size={92} y={180} out={919.5} col={COL.red} />);
  add(<WTag key="n2" t={t} at={920.0} out={927.0} q={PT.flue} text="EL Nº 2" sub="POR LA TENTACIÓN QUE VIENE DESPUÉS" dx={-420} dy={-60} col={COL.red} />);
  add(<WTag key="tir" t={t} at={931.4} out={935.5} q={[2.7, 1.2, -1.6]} text="LA LLAVE DEL TIRAJE" dx={-400} dy={-120} col={COL.red} />);
  add(<Stamp key="nln" t={t} at={935.8} text="NO LO HAGAS NUNCA" x={960} y={860} rot={-4} size={78} out={942.3} />);
  add(<CO key="co" t={t} at={942.7} out={953.0} ats={[944.6, 945.6, 946.6]} />);
  add(<Rules key="rco" t={t} at={953.2} out={977.0} title="3 REGLAS QUE NO SE DISCUTEN" col={COL.red} rows={[{ at: 955.6, txt: "EL CAÑO SIEMPRE LIBRE" }, { at: 961.6, txt: "DETECTOR DE CO A PILAS = UNA PIZZA" }, { at: 971.4, txt: "UNA VENTANITA ABIERTA: 1 cm" }]} />);
  add(<Chip2 key="cre" t={t} at={981.6} out={991.6} text="🖤 CREOSOTA: EL HUMO FRÍO DEJA HOLLÍN" col="#ff9a4a" />);
  add(<Stamp key="hpf" t={t} at={992.0} text="SE PRENDE FUEGO" x={960} y={860} rot={-4} size={70} out={996.1} />);
  add(<Chip2 key="mes" t={t} at={998.5} out={1004.0} text="🧹 1 VEZ POR MES · CEPILLO + CAÑA" />);
  add(<BigNum key="3e" t={t} at={1004.3} text="3 ERRORES" size={150} y={220} out={1009.2} col={COL.red} sub="DE LOS COMENTARIOS DEL VIDEO ANTERIOR" />);
  // ---------- ERRORES ----------
  add(<Chip2 key="e1" t={t} at={1015.5} out={1026.8} text="❌ 1 · LATAS BRILLANTES O SIN PINTAR" col={COL.red} />);
  add(<Bars2 key="b2" t={t} at={1025.8} at2={1028.9} out={1031.2} />);
  add(<Chip2 key="e2" t={t} at={1031.5} out={1039.6} text="❌ 2 · LADRILLOS PEGADOS A LA CHAPA" col={COL.red} />);
  add(<WTag key="e2t" t={t} at={1035.3} out={1039.6} q={PT.bricks} text="SE CARGAN DE UN SOLO LADO" dx={-380} dy={-140} col={COL.red} />);
  add(<Chip2 key="e3" t={t} at={1046.2} out={1055.5} text="❌ 3 · QUERER CALENTAR TODA LA CASA" col={COL.red} />);
  add(<Stamp key="ncg" t={t} at={1051.1} text="NI CON GAS" x={1450} y={330} rot={6} size={70} out={1055.5} />);
  add(<BigNum key="1l" t={t} at={1059.5} text="ELIGE UN CUARTO" size={110} y={200} out={1069.5} col={COL.amber} sub="VÍBORAS + LADRILLOS · EL RESTO FRESCO" />);
  // ---------- EL RECIBO ----------
  add(<Ticket key="tk" t={t} at={1070.2} out={1108.2} totalAt={1104.3} rows={[
    { at: 1075.3, txt: "3 CÁMARAS DE BICI", v: "$0" }, { at: 1080.4, txt: "2 MANGUERAS VIEJAS", v: "$0" }, { at: 1082.5, txt: "64 LATAS", v: "$0" },
    { at: 1086.3, txt: "40 LADRILLOS USADOS", v: "< GARRAFA" }, { at: 1094.5, txt: "SILICONA ALTA TEMP.", v: "$" }, { at: 1097.5, txt: "AEROSOL NEGRO MATE", v: "$" },
    { at: 1100.0, txt: "ROLLO DE ALAMBRE", v: "$" }, { at: 1102.2, txt: "LISTONES DE LA CARPA", v: "$" }]} />);
  // ---------- DEPARTAMENTO / TOP 2 / TAREA ----------
  add(<Chip2 key="dep" t={t} at={1110.0} out={1120.6} text="🏢 ¿VIVES EN UN DEPARTAMENTO?" col={COL.ice} />);
  add(<Seven key="s5" t={t} at={1117.4} out={1139.7} title="5 DE 7 TE SIRVEN IGUAL" on={(i) => (i === 1 || i === 2 ? 0 : 1)} />);
  add(<Seven key="s2" t={t} at={1143.2} out={1155.9} title="SI ELIGES SÓLO 2 PARA ESTA SEMANA" on={(i) => (i === 0 ? e(t, 1145.5, 1145.7) : i === 2 ? e(t, 1150.6, 1150.8) : 0)} />);
  add(<Chip2 key="fds" t={t} at={1156.4} out={1160.6} text="🥫 LAS LATAS SOLARES: EL FIN DE SEMANA" />);
  add(<Chip2 key="tar" t={t} at={1160.9} out={1172.0} text="🕯 INCIENSO O FÓSFORO · PUERTAS, VENTANAS, ENCHUFES" />);
  add(<Ask key="ask" t={t} at={1177.1} out={1182.6} />);
  add(<Next key="nx" t={t} at={1182.9} out={1194.3} />);
  // cartel del banco del momento (rótulo pegado al número del puesto en el mundo)
  void sv;
  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
