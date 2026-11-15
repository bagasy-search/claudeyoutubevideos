// Chief Aurelio · componentes EXTRA (aurelio-b, enca02/enca05) sobre el mundo de MUNDO.md. API interna (t,a,d en segundos); el Player los usa por extra.tsx.
// Paleta: acero de sala de máquinas (azul petróleo) + LATÓN del telégrafo + ámbar de alarma. Letra: Oswald (rótulos),
// Special Elite (cuaderno / pay slip / cartas), Barlow Condensed (números). Todas las piezas son OVERLAY sobre la toma:
// entran con resorte, viven `d` segundos y salen fundidas; nunca rótulos arriba a la izquierda.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../theme";
export const F = { head: FONT.plate, type: FONT.hand, num: FONT.plate, mono: FONT.mono };
export const K = {
  brass: C.brass, brass2: C.brassHi, brassD: C.brassLo, steel: C.ink, steel2: C.steel2, ink: C.white,
  amber: C.heat, red: C.signal, green: "#7fd18b", paper: C.cream, paperInk: "#2a2118", sea: C.seaHi,
};
export const FPS = 30;
export const s = (t: number) => Math.round(t * FPS);
const cl = (x: number) => Math.max(0, Math.min(1, x));
export const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
export const e = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export const spr = (t: number, a: number, k = 1) => { const x = Math.max(0, (t - a) * 6 * k); return x <= 0 ? 0 : 1 - Math.exp(-x) * Math.cos(x * 1.9); };
// vida de una pieza: entra en a, sale en a+d
export const life = (t: number, a: number, d: number) => e(t, a, a + 0.25) * (1 - e(t, a + d - 0.35, a + d));
export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export type P = { t: number; a: number; d: number };
const Shadow = "0 18px 50px rgba(0,0,0,.55)";
// placa de vidrio ahumado donde se apoyan las piezas (no tapa la toma entera)
const Plate: React.FC<{ x: number; y: number; w: number; h: number; o: number; k: number; children: React.ReactNode; tilt?: number }> = ({ x, y, w, h, o, k, children, tilt = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, transform: `perspective(1400px) rotateY(${tilt * (1 - k)}deg) scale(${0.86 + 0.14 * k})`,
    transformOrigin: "50% 60%", background: "linear-gradient(160deg, rgba(15,29,38,.86), rgba(8,16,22,.9))", border: `2px solid ${K.brass}88`, borderRadius: 18, boxShadow: Shadow, overflow: "hidden" }}>
    {children}
  </div>
);
const Lbl: React.FC<{ c?: string; size?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ c = K.ink, size = 40, style, children }) => (
  <div style={{ fontFamily: F.head, fontWeight: 700, fontSize: size, color: c, letterSpacing: 1.5, textTransform: "uppercase", textShadow: "0 3px 10px rgba(0,0,0,.7)", ...style }}>{children}</div>
);

// ───────── 1. TELÉGRAFO DE MÁQUINAS (emblema del canal; tarjeta de capítulo) ─────────
const ORD = ["FULL", "HALF", "SLOW", "D.SLOW", "STOP", "D.SLOW", "SLOW", "HALF", "FULL"];
export const Telegrafo: React.FC<P & { title: string; num?: number; pos?: number }> = ({ t, a, d, title, num, pos = 2 }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const k = spr(t, a, 0.8), sw = e(t, a + 0.3, a + 1.3);
  const ang = -80 + 160 * ((4 + (pos - 4) * sw) / 8); // la manija viaja de STOP a la orden
  const R = 230;
  return (
    <AbsoluteFill style={{ opacity: o, background: `radial-gradient(circle at 50% 50%, rgba(0,0,0,${0.15 * o}), rgba(0,0,0,${0.55 * o}))` }}>
      <div style={{ position: "absolute", left: 960 - R - 40, top: 470 - R - 40, width: 2 * R + 80, height: 2 * R + 80, transform: `scale(${0.7 + 0.3 * k}) rotate(${(1 - k) * -12}deg)` }}>
        <svg width={2 * R + 80} height={2 * R + 80} viewBox={`${-R - 40} ${-R - 40} ${2 * R + 80} ${2 * R + 80}`}>
          <defs>
            <radialGradient id="tg_b" cx="40%" cy="35%"><stop offset="0" stopColor={K.brass2} /><stop offset=".55" stopColor={K.brass} /><stop offset="1" stopColor={K.brassD} /></radialGradient>
            <radialGradient id="tg_f" cx="50%" cy="40%"><stop offset="0" stopColor="#fbf6ea" /><stop offset="1" stopColor="#d8ccb2" /></radialGradient>
          </defs>
          <circle r={R + 30} fill="url(#tg_b)" stroke={K.brassD} strokeWidth={6} />
          <circle r={R} fill="url(#tg_f)" stroke={K.brassD} strokeWidth={4} />
          {ORD.map((w, i) => {
            const an = (-80 + 20 * i) * Math.PI / 180, x = Math.sin(an) * (R - 62), y = -Math.cos(an) * (R - 62);
            return <g key={i}><line x1={Math.sin(an) * (R - 8)} y1={-Math.cos(an) * (R - 8)} x2={Math.sin(an) * (R - 28)} y2={-Math.cos(an) * (R - 28)} stroke={K.paperInk} strokeWidth={4} />
              <text x={x} y={y} fill={i === 4 ? K.red : K.paperInk} fontFamily={F.head} fontWeight={700} fontSize={i === 4 ? 30 : 22} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${-80 + 20 * i} ${x} ${y})`}>{w}</text></g>;
          })}
          <text y={-R * 0.12} fill={K.paperInk} fontFamily={F.head} fontWeight={500} fontSize={22} textAnchor="middle" letterSpacing={6}>AHEAD · ASTERN</text>
          <g transform={`rotate(${ang})`}><rect x={-9} y={-R + 20} width={18} height={R - 10} rx={9} fill="url(#tg_b)" stroke={K.brassD} strokeWidth={3} />
            <circle cy={-R + 34} r={20} fill={K.red} stroke={K.brassD} strokeWidth={3} /></g>
          <circle r={34} fill="url(#tg_b)" stroke={K.brassD} strokeWidth={4} />
        </svg>
      </div>
      <div style={{ position: "absolute", top: 820, width: "100%", textAlign: "center", opacity: e(t, a + 0.7, a + 1.1) }}>
        {num !== undefined && <Lbl c={K.brass2} size={34} style={{ letterSpacing: 10 }}>Chapter {num}</Lbl>}
        <Lbl size={78} style={{ marginTop: 6, transform: `translateY(${(1 - e(t, a + 0.7, a + 1.2)) * 30}px)` }}>{title}</Lbl>
      </div>
    </AbsoluteFill>
  );
};

// ───────── 2. CORTE DEL BARCO (tanker por cubiertas, sala de máquinas iluminada, escala humana) ─────────
export const CorteBarco: React.FC<P & { label?: string; sub?: string; zone?: "engine" | "cabin" | "bridge" | "galley" }> = ({ t, a, d, label = "The engine room", sub = "five decks down · 113 °F", zone = "engine" }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const k = spr(t, a), dr = e(t, a + 0.2, a + 1.4), hl = e(t, a + 1.2, a + 1.8);
  const Z = { engine: [1180, 330, 300, 150], cabin: [1290, 170, 170, 70], bridge: [1290, 90, 170, 70], galley: [1290, 245, 170, 70] }[zone];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 300, transform: `scale(${0.92 + 0.08 * k})`, transformOrigin: "50% 40%" }}>
        <g transform="translate(140,40)" fill="none" stroke={K.brass2} strokeWidth={4} strokeLinejoin="round" strokeDasharray={4000} strokeDashoffset={4000 * (1 - dr)}>
          <path d="M0 260 L60 470 L1520 470 L1600 300 L1620 230 L1480 230 L1480 60 L1300 60 L1300 230 L40 230 Z" fill={`rgba(15,29,38,${0.82 * dr})`} />
          {[300, 370, 420].map((y) => <line key={y} x1={1180} y1={y} x2={1560} y2={y} strokeWidth={2} opacity={0.6} />)}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <rect key={i} x={140 + i * 115} y={250} width={100} height={200} strokeWidth={2} opacity={0.45} />)}
          <line x1={1300} y1={110} x2={1480} y2={110} strokeWidth={2} /><line x1={1300} y1={170} x2={1480} y2={170} strokeWidth={2} />
        </g>
        <rect x={140 + Z[0]} y={40 + Z[1]} width={Z[2]} height={Z[3]} fill={K.amber} opacity={0.18 + 0.5 * hl * (0.75 + 0.25 * Math.sin(t * 5))} rx={6} />
        {zone === "engine" && <g transform={`translate(${140 + 1250},${40 + 330})`} opacity={hl}>
          <rect x={0} y={0} width={90} height={140} fill={K.brass} opacity={0.85} rx={4} />
          <g transform="translate(110,104)" fill={K.ink}><circle cy={0} r={6} /><rect x={-4} y={7} width={8} height={18} /><rect x={-4} y={25} width={3} height={12} /><rect x={1} y={25} width={3} height={12} /></g>
        </g>}
        <text x={1960 / 2} y={40 + 540} textAnchor="middle" fill={K.sea} fontFamily={F.head} fontSize={26} letterSpacing={8} opacity={dr * 0.8}>~ 800 FT ~</text>
      </svg>
      <div style={{ position: "absolute", left: 140 + Z[0] + 140 - 260, top: 300 + 40 + Z[1] - 150, width: 520, textAlign: "center", opacity: hl, transform: `translateY(${(1 - hl) * 20}px)` }}>
        <Lbl c={K.amber} size={52}>{label}</Lbl><div style={{ fontFamily: F.type, fontSize: 30, color: K.ink, marginTop: 2, textShadow: "0 2px 8px #000" }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// ───────── 3. MOTOR DE 2 TIEMPOS CON ESCALA HUMANA ─────────
export const MotorEscala: React.FC<P & { hp?: string; feet?: number }> = ({ t, a, d, hp = "18,000 HP", feet = 45 }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const up = e(t, a + 0.1, a + 1.5), pist = Math.sin(t * 2 * Math.PI * 1.6);
  const H = 520, base = 900;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1920} height={1080}>
        <g transform="translate(1260,0)">
          {[0, 1, 2, 3].map((fl) => <g key={fl} opacity={e(t, a + 0.15 * fl, a + 0.15 * fl + 0.5)}>
            <line x1={-40} x2={520} y1={base - fl * (H / 4)} y2={base - fl * (H / 4)} stroke={K.brass2} strokeWidth={2} strokeDasharray="10 8" opacity={0.6} />
            <text x={530} y={base - fl * (H / 4) - 8} fill={K.brass2} fontFamily={F.head} fontSize={22}>DECK {fl + 1}</text></g>)}
          <rect x={60} y={base - H * up} width={380} height={H * up} fill="url(#me_g)" stroke={K.brassD} strokeWidth={3} />
          <defs><linearGradient id="me_g" x1="0" x2="1"><stop offset="0" stopColor="#2a3d48" /><stop offset=".5" stopColor="#4a6472" /><stop offset="1" stopColor="#22343e" /></linearGradient></defs>
          {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={78 + i * 60} y={base - H * up + 18 + (i % 2 ? pist : -pist) * 10} width={46} height={46} rx={6} fill={K.brass} opacity={up} />)}
          <g transform={`translate(470,${base})`} fill={K.amber} opacity={e(t, a + 1.2, a + 1.6)}>
            <circle cy={-56} r={9} /><rect x={-7} y={-46} width={14} height={28} rx={3} /><rect x={-7} y={-18} width={5} height={18} /><rect x={2} y={-18} width={5} height={18} />
          </g>
          <line x1={-20} x2={-20} y1={base} y2={base - H * up} stroke={K.amber} strokeWidth={4} />
          <text x={-34} y={base - H * up / 2} fill={K.amber} fontFamily={F.num} fontWeight={800} fontSize={60} textAnchor="end" opacity={up}>{Math.round(feet * up)} FT</text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 1150, top: 120, width: 700, textAlign: "center", opacity: e(t, a + 0.9, a + 1.3) }}>
        <Lbl c={K.brass2} size={36}>Main engine · two-stroke</Lbl><Lbl size={84} style={{ fontFamily: F.num }}>{hp}</Lbl>
      </div>
    </AbsoluteFill>
  );
};

// ───────── 4. MAPA DE RUTA (carta náutica: retícula + puertos en lat/lon reales + estela) ─────────
export type Port = { n: string; lat: number; lon: number };
export const PORTS: Record<string, Port> = {
  galveston: { n: "Galveston", lat: 29.3, lon: -94.8 }, singapore: { n: "Singapore", lat: 1.29, lon: 103.85 }, fujairah: { n: "Fujairah", lat: 25.12, lon: 56.33 },
  rotterdam: { n: "Rotterdam", lat: 51.95, lon: 4.1 }, manila: { n: "Manila", lat: 14.6, lon: 120.98 }, rastanura: { n: "Ras Tanura", lat: 26.64, lon: 50.16 },
  coatza: { n: "Coatzacoalcos", lat: 18.15, lon: -94.42 }, veracruz: { n: "Veracruz", lat: 19.2, lon: -96.13 }, aden: { n: "Gulf of Aden", lat: 12.5, lon: 47.0 },
  malacca: { n: "Malacca Strait", lat: 3.0, lon: 100.6 }, suez: { n: "Suez", lat: 29.97, lon: 32.55 }, northsea: { n: "North Sea", lat: 56.5, lon: 3.0 },
  india: { n: "India", lat: 15.0, lon: 72.5 }, houston: { n: "Houston", lat: 29.75, lon: -95.0 },
};
export const RutaMapa: React.FC<P & { route: string[]; title?: string; lon0?: number; lon1?: number; lat0?: number; lat1?: number }> = ({ t, a, d, route, title, lon0 = -110, lon1 = 130, lat0 = -10, lat1 = 62 }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const X = (lon: number) => 160 + ((lon - lon0) / (lon1 - lon0)) * 1600, Y = (lat: number) => 960 - ((lat - lat0) / (lat1 - lat0)) * 760;
  const pts = route.map((r) => PORTS[r]); const n = pts.length - 1;
  const prog = e(t, a + 0.6, a + Math.max(1.6, d - 1.2)) * n;
  const seg = (i: number) => { const p = pts[i], q = pts[i + 1]; const mx = (X(p.lon) + X(q.lon)) / 2, my = (Y(p.lat) + Y(q.lat)) / 2 - 80; return `M${X(p.lon)} ${Y(p.lat)} Q${mx} ${my} ${X(q.lon)} ${Y(q.lat)}`; };
  return (
    <AbsoluteFill style={{ opacity: o, background: `rgba(10,22,30,${0.78 * o})` }}>
      <svg width={1920} height={1080}>
        {Array.from({ length: 13 }, (_, i) => <line key={"v" + i} x1={160 + i * 133} x2={160 + i * 133} y1={200} y2={960} stroke={K.sea} strokeWidth={1} opacity={0.35} />)}
        {Array.from({ length: 7 }, (_, i) => <line key={"h" + i} y1={200 + i * 126} y2={200 + i * 126} x1={160} x2={1760} stroke={K.sea} strokeWidth={1} opacity={0.35} />)}
        {pts.slice(0, -1).map((_, i) => { const f = cl(prog - i); return f <= 0 ? null : <path key={i} d={seg(i)} fill="none" stroke={K.amber} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - f} style={{ filter: "drop-shadow(0 0 8px rgba(255,176,59,.7))" }} />; })}
        {pts.map((p, i) => { const on = e(t, a + 0.4 + (i === 0 ? 0 : (i - 0.15) * (Math.max(1, d - 1.8) / n)), a + 0.7 + (i === 0 ? 0 : (i - 0.15) * (Math.max(1, d - 1.8) / n))); return (
          <g key={i} opacity={on} transform={`translate(${X(p.lon)},${Y(p.lat)}) scale(${0.6 + 0.4 * on})`}>
            <circle r={13} fill={K.brass2} stroke={K.steel} strokeWidth={4} /><circle r={26 * (1 - on) + 13} fill="none" stroke={K.brass2} strokeWidth={2} opacity={1 - on} />
            <text y={-26} fill={K.ink} fontFamily={F.head} fontWeight={700} fontSize={32} textAnchor="middle" style={{ paintOrder: "stroke" }} stroke={K.steel} strokeWidth={6}>{p.n}</text></g>); })}
      </svg>
      {title && <div style={{ position: "absolute", bottom: 50, width: "100%", textAlign: "center", opacity: e(t, a + 0.3, a + 0.7) }}><Lbl c={K.brass2} size={44}>{title}</Lbl></div>}
    </AbsoluteFill>
  );
};

// ───────── 5. RELOJ DE GUARDIAS 4-8 ─────────
export const RelojGuardia: React.FC<P & { label?: string }> = ({ t, a, d, label = "The 4-to-8 watch" }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const k = spr(t, a), sw = e(t, a + 0.4, a + d - 0.6);
  const R = 240, hr = 3.92 + sw * 4.1; const an = (h: number) => (h / 24) * 2 * Math.PI - Math.PI / 2;
  const arc = (h0: number, h1: number, r: number) => { const p0 = [Math.cos(an(h0)) * r, Math.sin(an(h0)) * r], p1 = [Math.cos(an(h1)) * r, Math.sin(an(h1)) * r]; return `M${p0[0]} ${p0[1]} A${r} ${r} 0 0 1 ${p1[0]} ${p1[1]}`; };
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1920} height={1080}><g transform={`translate(1440,520) scale(${0.8 + 0.2 * k})`}>
        <circle r={R + 22} fill="rgba(10,20,28,.85)" stroke={K.brass} strokeWidth={8} />
        <path d={arc(4, 8, R - 30)} stroke={K.amber} strokeWidth={46} fill="none" opacity={0.9} /><path d={arc(16, 20, R - 30)} stroke={K.amber} strokeWidth={46} fill="none" opacity={0.9} />
        {Array.from({ length: 24 }, (_, h) => <text key={h} x={Math.cos(an(h)) * (R - 84)} y={Math.sin(an(h)) * (R - 84)} fill={K.ink} fontFamily={F.num} fontWeight={600} fontSize={h % 4 === 0 ? 34 : 20} textAnchor="middle" dominantBaseline="middle" opacity={h % 4 === 0 ? 1 : 0.55}>{String(h).padStart(2, "0")}</text>)}
        <line x1={0} y1={0} x2={Math.cos(an(hr)) * (R - 20)} y2={Math.sin(an(hr)) * (R - 20)} stroke={K.red} strokeWidth={8} strokeLinecap="round" /><circle r={16} fill={K.brass} />
      </g></svg>
      <div style={{ position: "absolute", left: 1140, top: 820, width: 600, textAlign: "center" }}><Lbl c={K.amber} size={48}>{label}</Lbl>
        <div style={{ fontFamily: F.type, fontSize: 30, color: K.ink }}>04:00–08:00 · 16:00–20:00</div></div>
    </AbsoluteFill>
  );
};

// ───────── 6. TERMÓMETRO / MEDIDOR (°F, dB…) ─────────
export const Medidor: React.FC<P & { val: number; max: number; unit: string; label: string; min?: number; warn?: number }> = ({ t, a, d, val, max, unit, label, min = 0, warn }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const f = e(t, a + 0.3, a + 1.8), v = min + (val - min) * f, H = 560, h = ((v - min) / (max - min)) * H;
  const hot = warn !== undefined && v >= warn;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 1500, top: 180, width: 300, height: 760, transform: `translateX(${(1 - spr(t, a)) * 120}px)` }}>
        <div style={{ position: "absolute", left: 110, top: 60, width: 80, height: H, borderRadius: 40, background: "rgba(10,20,28,.85)", border: `5px solid ${K.brass}`, boxShadow: Shadow, overflow: "hidden" }}>
          <div style={{ position: "absolute", bottom: 0, width: "100%", height: h, background: `linear-gradient(0deg, ${K.red}, ${hot ? K.red : K.amber})` }} /></div>
        <div style={{ position: "absolute", left: 90, top: 60 + H - 30, width: 120, height: 120, borderRadius: 60, background: K.red, border: `5px solid ${K.brass}` }} />
        <div style={{ position: "absolute", left: -220, top: 60 + H - h - 50, width: 320, textAlign: "right", fontFamily: F.num, fontWeight: 800, fontSize: 96, color: hot ? K.red : K.ink, textShadow: "0 4px 14px #000" }}>{Math.round(v)}{unit}</div>
        <div style={{ position: "absolute", left: -240, top: 740, width: 540, textAlign: "center" }}><Lbl c={K.amber} size={40}>{label}</Lbl></div>
      </div>
    </AbsoluteFill>
  );
};

// ───────── 7. NÚMERO GRANDE (con conteo) ─────────
export const Numero: React.FC<P & { n: number; pre?: string; suf?: string; label: string; sub?: string; x?: number; y?: number; dec?: number }> = ({ t, a, d, n, pre = "", suf = "", label, sub, x = 1320, y = 300, dec = 0 }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const f = e(t, a + 0.15, a + 1.4), k = spr(t, a);
  const v = dec ? (n * f).toFixed(dec) : fmt(n * f);
  return (
    <div style={{ position: "absolute", left: x - 400, top: y, width: 800, textAlign: "center", opacity: o, transform: `scale(${0.75 + 0.25 * k})` }}>
      <div style={{ fontFamily: F.num, fontWeight: 800, fontSize: 190, lineHeight: 1, color: K.ink, textShadow: `0 6px 0 ${K.brassD}, 0 14px 40px rgba(0,0,0,.8)` }}>{pre}{v}{suf}</div>
      <Lbl c={K.amber} size={46} style={{ marginTop: 8 }}>{label}</Lbl>
      {sub && <div style={{ fontFamily: F.type, fontSize: 32, color: K.ink, marginTop: 4, textShadow: "0 2px 8px #000" }}>{sub}</div>}
    </div>
  );
};

// ───────── 8. CALENDARIO (fecha que se encierra y se tacha) / contador de días ─────────
export const Calendario: React.FC<P & { month: string; day: number; mode?: "circle" | "cross" | "both"; note?: string }> = ({ t, a, d, month, day, mode = "both", note }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const k = spr(t, a), c1 = e(t, a + 0.5, a + 1.2), x1 = mode === "circle" ? 0 : e(t, a + (mode === "cross" ? 0.5 : 1.6), a + (mode === "cross" ? 1.0 : 2.1));
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div style={{ position: "absolute", left: 1180, top: 160, width: 600, height: 700, opacity: o, transform: `perspective(1200px) rotateX(${(1 - k) * 30}deg) rotate(-3deg)`, transformOrigin: "50% 0%",
      background: K.paper, borderRadius: 10, boxShadow: Shadow, padding: 30, boxSizing: "border-box" }}>
      <div style={{ fontFamily: F.head, fontWeight: 700, fontSize: 58, color: K.red, textAlign: "center", letterSpacing: 4 }}>{month}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 20 }}>
        {days.map((n) => <div key={n} style={{ position: "relative", fontFamily: F.num, fontWeight: 600, fontSize: 38, color: K.paperInk, textAlign: "center", height: 66, lineHeight: "66px" }}>{n}
          {n === day && <svg width={90} height={90} style={{ position: "absolute", left: -12, top: -12 }}>
            <ellipse cx={45} cy={45} rx={36} ry={30} fill="none" stroke="#1d4fb8" strokeWidth={5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - c1} transform="rotate(-12 45 45)" />
            <path d="M14 18 L76 74 M76 16 L16 72" stroke="#1d4fb8" strokeWidth={6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - x1} /></svg>}</div>)}
      </div>
      {note && <div style={{ fontFamily: F.type, fontSize: 34, color: "#1d4fb8", textAlign: "center", marginTop: 14, opacity: e(t, a + 1.8, a + 2.3), transform: "rotate(-4deg)" }}>{note}</div>}
    </div>
  );
};
export const Dias: React.FC<P & { n: number; label?: string; from?: number }> = ({ t, a, d, n, label = "days without touching land", from = 0 }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const f = e(t, a + 0.1, a + Math.min(2.4, d - 0.6)), v = Math.round(from + (n - from) * f);
  return (
    <div style={{ position: "absolute", left: 0, top: 330, width: 1920, textAlign: "center", opacity: o }}>
      <Lbl c={K.amber} size={42} style={{ letterSpacing: 12 }}>Day</Lbl>
      <div style={{ fontFamily: F.num, fontWeight: 800, fontSize: 260, lineHeight: 1, color: K.ink, textShadow: `0 8px 0 ${K.brassD}, 0 20px 50px rgba(0,0,0,.85)` }}>{v}</div>
      <Lbl size={44}>{label}</Lbl>
    </div>
  );
};

// ───────── 9. CUADERNO / NOTA ESCRITA (Svensson, "Day 151 — done") ─────────
export const Cuaderno: React.FC<P & { lines: string[]; title?: string; x?: number; y?: number; tilt?: number }> = ({ t, a, d, lines, title, x = 1080, y = 170, tilt = -2.5 }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const k = spr(t, a), per = Math.max(0.6, (d - 1.4) / Math.max(1, lines.length));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 700, opacity: o, transform: `rotate(${tilt}deg) translateY(${(1 - k) * 60}px)`, background: K.paper, borderRadius: 6, boxShadow: Shadow, padding: "34px 40px 40px 70px",
      backgroundImage: `repeating-linear-gradient(0deg, transparent 0 55px, rgba(60,120,170,.35) 55px 57px)`, borderLeft: "4px solid rgba(200,60,50,.55)" }}>
      {title && <div style={{ fontFamily: F.head, fontWeight: 700, fontSize: 40, color: K.paperInk, marginBottom: 10 }}>{title}</div>}
      {lines.map((l, i) => { const f = e(t, a + 0.3 + i * per, a + 0.3 + i * per + per * 0.8); const n = Math.round(l.length * f); return (
        <div key={i} style={{ fontFamily: F.type, fontSize: 38, color: K.paperInk, lineHeight: "57px", minHeight: 57 }}>{l.slice(0, n)}{f > 0 && f < 1 ? "▍" : ""}</div>); })}
    </div>
  );
};

// ───────── 10. TELÉFONO SATELITAL CON TAXÍMETRO ($/min) ─────────
export const SatTel: React.FC<P & { rate: number; mins: number; label?: string }> = ({ t, a, d, rate, mins, label = "Ship's satellite line · 1999" }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const f = e(t, a + 0.4, a + d - 0.5), m = mins * f, k = spr(t, a);
  return (
    <div style={{ position: "absolute", left: 1220, top: 200, width: 560, opacity: o, transform: `scale(${0.8 + 0.2 * k})` }}>
      <Plate x={0} y={0} w={560} h={600} o={1} k={1}>
        <svg width={560} height={300}><g transform="translate(280,170)">
          {[0, 1, 2].map((i) => <path key={i} d={`M${-60 - i * 40} ${-60 - i * 40} A${85 + i * 56} ${85 + i * 56} 0 0 1 ${60 + i * 40} ${-60 - i * 40}`} fill="none" stroke={K.amber} strokeWidth={6} opacity={0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 6 - i))} />)}
          <rect x={-40} y={-30} width={80} height={140} rx={16} fill={K.brass} /><rect x={-26} y={-12} width={52} height={36} rx={4} fill={K.steel} />
        </g></svg>
        <div style={{ textAlign: "center", fontFamily: F.num, fontWeight: 800, fontSize: 110, color: K.ink }}>${fmt(m * rate)}</div>
        <div style={{ textAlign: "center", fontFamily: F.type, fontSize: 32, color: K.amber }}>{Math.floor(m)}:{String(Math.floor((m % 1) * 60)).padStart(2, "0")} min · ${rate}/min</div>
        <div style={{ textAlign: "center", fontFamily: F.head, fontSize: 28, color: K.ink, marginTop: 12, letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>
      </Plate>
    </div>
  );
};

// ───────── 11. SOBRES QUE SE APILAN (cartas, eleven letters) ─────────
export const Cartas: React.FC<P & { n: number; label?: string }> = ({ t, a, d, n, label = "letters in one day" }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const per = Math.min(0.22, (d - 1.5) / n);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {Array.from({ length: n }, (_, i) => { const f = spr(t, a + 0.2 + i * per, 1.2); if (f <= 0) return null; return (
        <div key={i} style={{ position: "absolute", left: 1260 + ((i * 37) % 90) - 45, top: 640 - i * 22 - (1 - Math.min(1, f)) * 500, width: 420, height: 240, transform: `rotate(${((i * 53) % 18) - 9}deg)`,
          background: i % 3 === 2 ? "#e8e0f0" : K.paper, border: "1px solid #b9ab8f", boxShadow: "0 8px 20px rgba(0,0,0,.45)",
          backgroundImage: "repeating-linear-gradient(45deg, #c8423a 0 14px, #fff 14px 28px, #2c5aa0 28px 42px, #fff 42px 56px)", backgroundSize: "100% 12px", backgroundRepeat: "repeat-x" }}>
          <div style={{ position: "absolute", right: 22, top: 26, width: 60, height: 72, border: "2px dashed #9b8b6a", background: "#d7c9a6" }} />
          <div style={{ position: "absolute", left: 40, top: 110, width: 220, height: 6, background: "#5b4c38", opacity: 0.5, boxShadow: "0 22px 0 #5b4c38, 0 44px 0 #5b4c38" }} /></div>); })}
      <div style={{ position: "absolute", left: 1150, top: 220, width: 640, textAlign: "center" }}>
        <div style={{ fontFamily: F.num, fontWeight: 800, fontSize: 170, color: K.ink, lineHeight: 1, textShadow: `0 6px 0 ${K.brassD}, 0 14px 40px #000` }}>{Math.min(n, Math.floor((t - a - 0.2) / per) + 1)}</div>
        <Lbl c={K.amber} size={44}>{label}</Lbl></div>
    </AbsoluteFill>
  );
};

// ───────── 12. REGLA / CITA (tarjeta tipeada, para Svensson, Dahl, Lupe) ─────────
export const Cita: React.FC<P & { q: string; who: string; x?: number; y?: number }> = ({ t, a, d, q, who, x = 1060, y = 260 }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const f = e(t, a + 0.3, a + Math.min(d - 0.8, 0.3 + q.length * 0.035)), n = Math.round(q.length * f);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 760, opacity: o, transform: `translateY(${(1 - spr(t, a)) * 40}px)` }}>
      <div style={{ fontFamily: F.head, fontSize: 150, color: K.brass, lineHeight: 0.6, height: 70 }}>“</div>
      <div style={{ fontFamily: F.type, fontSize: 48, color: K.ink, lineHeight: 1.3, textShadow: "0 3px 12px #000, 0 0 30px rgba(0,0,0,.6)" }}>{q.slice(0, n)}</div>
      <div style={{ marginTop: 18, height: 3, width: 200 * e(t, a + 0.6, a + 1.2), background: K.brass }} />
      <Lbl c={K.brass2} size={34} style={{ marginTop: 10, opacity: e(t, a + 0.8, a + 1.2) }}>— {who}</Lbl>
    </div>
  );
};

// ───────── 13. LISTA DE REGLAS (1-2-3, se encienden de a una) ─────────
export const Reglas: React.FC<P & { title: string; items: string[]; at?: number[] }> = ({ t, a, d, title, items, at }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  return (
    <Plate x={1060} y={180} w={760} h={140 + items.length * 130} o={o} k={spr(t, a)} tilt={-14}>
      <div style={{ padding: "30px 40px" }}><Lbl c={K.brass2} size={42}>{title}</Lbl>
        {items.map((it, i) => { const ai = at?.[i] ?? a + 0.6 + i * 0.9, f = e(t, ai, ai + 0.4); return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 26, opacity: 0.25 + 0.75 * f, transform: `translateX(${(1 - f) * 40}px)` }}>
            <div style={{ width: 70, height: 70, borderRadius: 35, background: f > 0.5 ? K.amber : "transparent", border: `3px solid ${K.amber}`, fontFamily: F.num, fontWeight: 800, fontSize: 44, color: K.steel, textAlign: "center", lineHeight: "64px", flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontFamily: F.head, fontWeight: 500, fontSize: 38, color: K.ink, lineHeight: 1.15 }}>{it}</div></div>); })}
      </div>
    </Plate>
  );
};

// ───────── 14. PAY SLIP (ca04: líneas que se imprimen; una resaltada) ─────────
export type SlipRow = [string, string, boolean?];
export const PaySlip: React.FC<P & { head: string; rows: SlipRow[]; total?: [string, string]; hi?: number }> = ({ t, a, d, head, rows, total, hi }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const k = spr(t, a), per = Math.min(0.55, (d - 2) / (rows.length + 1));
  return (
    <div style={{ position: "absolute", left: 1100, top: 110, width: 700, opacity: o, transform: `perspective(1400px) rotateX(${(1 - k) * 25}deg) rotate(2deg)`, background: K.paper, boxShadow: Shadow, padding: "34px 44px",
      backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.025) 0 2px, transparent 2px 6px)" }}>
      <div style={{ fontFamily: F.type, fontSize: 30, color: K.paperInk, textAlign: "center", borderBottom: `2px dashed ${K.paperInk}`, paddingBottom: 12 }}>{head}</div>
      {rows.map(([l, v, mark], i) => { const f = e(t, a + 0.5 + i * per, a + 0.7 + i * per); const H = hi === i ? e(t, a + d * 0.55, a + d * 0.55 + 0.4) : 0; return (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: F.type, fontSize: 34, color: K.paperInk, marginTop: 16, opacity: f, position: "relative" }}>
          <div style={{ position: "absolute", left: -12, right: -12, top: -4, bottom: -4, background: K.amber, opacity: 0.55 * H, transform: `scaleX(${H})`, transformOrigin: "0 50%" }} />
          <span style={{ position: "relative", color: mark ? K.red : K.paperInk }}>{l}</span><span style={{ position: "relative" }}>{v}</span></div>); })}
      {total && <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.type, fontSize: 40, color: K.paperInk, marginTop: 22, paddingTop: 12, borderTop: `3px double ${K.paperInk}`, opacity: e(t, a + 0.6 + rows.length * per, a + 0.9 + rows.length * per) }}>
        <span>{total[0]}</span><span>{total[1]}</span></div>}
    </div>
  );
};

// ───────── 15. ESCALERA DE RANGOS (ca04: wiper → chief, sueldo con año y rango de hoy) ─────────
export type Rung = { rank: string; then: string; now: string };
export const Escalera: React.FC<P & { rungs: Rung[]; on: number; title?: string }> = ({ t, a, d, rungs, on, title = "Engine room pay · foreign flag" }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const k = spr(t, a), n = rungs.length;
  return (
    <Plate x={980} y={110} w={860} h={140 + n * 150} o={o} k={k} tilt={-12}>
      <div style={{ padding: "26px 36px" }}><Lbl c={K.brass2} size={36}>{title}</Lbl>
        {rungs.slice().reverse().map((r, j) => { const i = n - 1 - j, lit = i <= on, cur = i === on, f = cur ? e(t, a + 0.3, a + 0.8) : 1; return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "250px 220px 1fr", alignItems: "center", marginTop: 22, padding: "14px 18px", borderRadius: 10,
            background: cur ? `rgba(255,176,59,${0.22 * f})` : "transparent", border: `2px solid ${lit ? K.amber : "#ffffff22"}`, opacity: lit ? 1 : 0.35, transform: cur ? `scale(${1 + 0.04 * f})` : "none" }}>
            <div style={{ fontFamily: F.head, fontWeight: 700, fontSize: 36, color: K.ink, textTransform: "uppercase" }}>{r.rank}</div>
            <div style={{ fontFamily: F.type, fontSize: 28, color: K.brass2 }}>{r.then}</div>
            <div style={{ fontFamily: F.num, fontWeight: 800, fontSize: 40, color: lit ? K.amber : K.ink, textAlign: "right" }}>{r.now}</div></div>); })}
        <div style={{ fontFamily: F.type, fontSize: 24, color: K.ink, opacity: 0.75, marginTop: 16, textAlign: "right" }}>his pay that year · range per month today</div>
      </div>
    </Plate>
  );
};

// ───────── 16. BARRAS COMPARADAS (1978 vs 2016, 185 vs 50.000…) ─────────
export const Barras: React.FC<P & { items: { l: string; v: number; txt: string; c?: string }[]; title?: string; log?: boolean }> = ({ t, a, d, items, title, log }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const sc = (v: number) => (log ? Math.log10(1 + v) : v); const mx = Math.max(...items.map((i) => sc(i.v)));
  return (
    <Plate x={1000} y={200} w={820} h={180 + items.length * 140} o={o} k={spr(t, a)} tilt={-12}>
      <div style={{ padding: "30px 40px" }}>{title && <Lbl c={K.brass2} size={38}>{title}</Lbl>}
        {items.map((it, i) => { const f = e(t, a + 0.4 + i * 0.5, a + 1.4 + i * 0.5); return (
          <div key={i} style={{ marginTop: 28 }}>
            <div style={{ fontFamily: F.head, fontSize: 32, color: K.ink, textTransform: "uppercase", letterSpacing: 1 }}>{it.l}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6 }}>
              <div style={{ height: 52, width: Math.max(8, 520 * (sc(it.v) / mx) * f), background: it.c ?? K.amber, borderRadius: 6 }} />
              <div style={{ fontFamily: F.num, fontWeight: 800, fontSize: 52, color: K.ink, opacity: f }}>{it.txt}</div></div></div>); })}
      </div>
    </Plate>
  );
};

// ───────── 17. DISTANCIA (barco ⟷ porche, 30 millas) ─────────
export const Distancia: React.FC<P & { miles: number; left?: string; right?: string }> = ({ t, a, d, miles, left = "The ship", right = "The porch light" }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const f = e(t, a + 0.4, a + 1.8), glow = 0.6 + 0.4 * Math.sin(t * 3);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1920} height={1080}>
        <line x1={300} x2={300 + 1320 * f} y1={760} y2={760} stroke={K.ink} strokeWidth={4} strokeDasharray="14 12" />
        <g transform="translate(300,760)"><path d="M-110 -10 L110 -10 L80 30 L-90 30 Z" fill={K.steel2} stroke={K.brass2} strokeWidth={3} /><rect x={40} y={-50} width={40} height={40} fill={K.steel2} stroke={K.brass2} strokeWidth={3} /></g>
        <g transform="translate(1620,760)" opacity={f}><circle r={30 + 30 * glow} fill={K.amber} opacity={0.25} /><circle r={16} fill={K.amber} /><path d="M-60 40 L-60 -30 L0 -70 L60 -30 L60 40" fill="none" stroke={K.brass2} strokeWidth={3} /></g>
        <text x={960} y={720} textAnchor="middle" fill={K.ink} fontFamily={F.num} fontWeight={800} fontSize={110} opacity={f}>{Math.round(miles * f)} MILES</text>
        <text x={300} y={860} textAnchor="middle" fill={K.brass2} fontFamily={F.head} fontSize={34}>{left.toUpperCase()}</text>
        <text x={1620} y={860} textAnchor="middle" fill={K.amber} fontFamily={F.head} fontSize={34} opacity={f}>{right.toUpperCase()}</text>
      </svg>
    </AbsoluteFill>
  );
};

// ───────── 18. TEXTO CLAVE (frase de la promesa / remate, palabra por palabra) ─────────
export const Frase: React.FC<P & { w: string; y?: number; c?: string; size?: number; per?: number }> = ({ t, a, d, w, y = 760, c = K.ink, size = 84, per = 0.16 }) => {
  const o = life(t, a, d); if (o <= 0.01) return null;
  const words = w.split(" ");
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: y, textAlign: "center", opacity: o }}>
      {words.map((x, i) => { const f = spr(t, a + i * per); const hot = x.startsWith("*"); return (
        <span key={i} style={{ display: "inline-block", margin: "0 14px", fontFamily: F.head, fontWeight: 700, fontSize: size, color: hot ? K.amber : c, textTransform: "uppercase",
          opacity: Math.min(1, f), transform: `translateY(${(1 - Math.min(1, f)) * 40}px) scale(${0.85 + 0.15 * Math.min(1.1, f)})`, textShadow: "0 4px 0 rgba(0,0,0,.5), 0 10px 30px rgba(0,0,0,.85)" }}>{hot ? x.slice(1) : x}</span>); })}
    </div>
  );
};

// ───────── 19. PANTALLA FINAL (próximo video + suscribirse) ─────────
export const Final: React.FC<P & { next: string; line?: string }> = ({ t, a, d, next, line = "Tell me in the comments where you've sailed. Lupe reads them to me with my coffee." }) => {
  const o = e(t, a, a + 0.5); if (o <= 0.01) return null;
  const k = spr(t, a + 0.2);
  return (
    <AbsoluteFill style={{ opacity: o, background: `linear-gradient(90deg, rgba(8,16,22,.92) 0 55%, rgba(8,16,22,.4))` }}>
      <div style={{ position: "absolute", left: 120, top: 200, width: 900 }}>
        <Lbl c={K.brass2} size={40} style={{ letterSpacing: 8 }}>Next story</Lbl>
        <div style={{ fontFamily: F.head, fontWeight: 700, fontSize: 70, color: K.ink, lineHeight: 1.1, marginTop: 14, transform: `translateX(${(1 - k) * -80}px)` }}>{next}</div>
        <div style={{ fontFamily: F.type, fontSize: 36, color: K.ink, opacity: 0.85, marginTop: 40, lineHeight: 1.35 }}>{line}</div>
        <div style={{ display: "inline-block", marginTop: 40, padding: "18px 44px", background: K.red, borderRadius: 10, fontFamily: F.head, fontWeight: 700, fontSize: 44, color: "#fff", letterSpacing: 3,
          transform: `scale(${0.9 + 0.1 * spr(t, a + 0.8)})` }}>SUBSCRIBE</div>
      </div>
      <div style={{ position: "absolute", left: 1160, top: 250, width: 640, height: 360, border: `4px solid ${K.brass}`, borderRadius: 14, background: "rgba(0,0,0,.35)", boxShadow: Shadow }} />
    </AbsoluteFill>
  );
};
